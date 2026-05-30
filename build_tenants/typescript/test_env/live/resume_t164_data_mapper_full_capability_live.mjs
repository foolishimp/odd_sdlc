// Resume helper for T-164 data_mapper full-capability live runs.
// This intentionally reuses an existing installed workspace after a timeout or
// transport interruption instead of rebuilding already-materialized assets.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  configuredLiveTimeoutMs,
  liveOperatorRuntimePolicy
} from "./operator_runtime_policy.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const RUNTIME_POLICY = liveOperatorRuntimePolicy();
const LIVE_TEST_RUN_ROOT =
  process.env["ODD_SDLC_TS_LIVE_TEST_RUN_ROOT"] ??
  process.env["ODD_SDLC_TS_TEST_RUN_ROOT"] ??
  path.join(PACKAGE_ROOT, "test_env/test_runs");
const LANE_ROOT = path.join(
  LIVE_TEST_RUN_ROOT,
  "t164_data_mapper_full_capability_live"
);
const WORKER_TRANSPORT =
  process.env["ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_WORKER"] ??
  "process://claude?model=sonnet&effort=xhigh";
const COMMAND_TIMEOUT_MS = configuredLiveTimeoutMs(
  "ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_TIMEOUT_MS",
  RUNTIME_POLICY.liveHarnessFullCapabilityCommandTimeoutMs
);
const WORKER_TIMEOUT_MS = configuredLiveTimeoutMs(
  "ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_WORKER_TIMEOUT_MS",
  RUNTIME_POLICY.workerTimeoutMs
);
const WORKER_INACTIVITY_TIMEOUT_MS = configuredLiveTimeoutMs(
  "ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_WORKER_INACTIVITY_TIMEOUT_MS",
  RUNTIME_POLICY.workerInactivityTimeoutMs
);
const DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS =
  RUNTIME_POLICY.designDepthFpEvaluatorTimeoutMs;

function archiveTimestamp() {
  return new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".", "");
}

function writeJson(filePath, payload) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function latestArchiveRoot() {
  if (!existsSync(LANE_ROOT)) {
    return null;
  }
  const archiveNames = readdirSync(LANE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{8}T\d+Z_pid\d+$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const latest = archiveNames.at(-1);
  return latest === undefined ? null : path.join(LANE_ROOT, latest);
}

function selectedArchiveRoot() {
  return (
    process.env[
      "ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_RESUME_ARCHIVE_ROOT"
    ] ?? latestArchiveRoot()
  );
}

function runtimeFilesNamed(workspace, fileName) {
  const runsRoot = path.join(workspace, ".ai-workspace/runtime/odd_sdlc/operator-runs");
  if (!existsSync(runsRoot)) {
    return [];
  }
  const files = [];
  const stack = [runsRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(child);
      } else if (entry.isFile() && entry.name === fileName) {
        files.push(child);
      }
    }
  }
  return files.sort();
}

function observedHandoffEdges(workspace) {
  return runtimeFilesNamed(workspace, "handoff_manifest.json").map((filePath) => {
    const manifest = readJsonFile(filePath);
    return {
      filePath,
      edgeName: manifest.edgeName,
      targetAssetType: manifest.targetAssetType,
      archiveRoot: manifest.archiveRoot
    };
  });
}

function compressedEdges(edges) {
  const result = [];
  for (const edge of edges) {
    if (result[result.length - 1] !== edge) {
      result.push(edge);
    }
  }
  return result;
}

const archiveRoot = selectedArchiveRoot();
assert.notEqual(
  archiveRoot,
  null,
  "set ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_RESUME_ARCHIVE_ROOT"
);
const workspace = path.join(archiveRoot, "workspace");
const installedCommand = path.join(workspace, "node_modules/.bin/odd-sdlc-ts");
assert.equal(existsSync(workspace), true, `missing workspace: ${workspace}`);
assert.equal(
  existsSync(installedCommand),
  true,
  `missing installed odd-sdlc-ts command: ${installedCommand}`
);

const startArgs = [
  "start",
  "--workspace",
  ".",
  "--target",
  "next",
  "--until",
  "converged",
  "--worker",
  WORKER_TRANSPORT
];
const label = `resume-start-until-converged-${archiveTimestamp()}_pid${process.pid}`;
const startedAt = new Date().toISOString();
const processRecordPath = path.join(archiveRoot, `${label}.process.json`);
writeJson(processRecordPath, {
  kind: "odd_sdlc_t164_full_capability_resume_process_result",
  lifecycleStatus: "started",
  label,
  archiveRoot,
  workspace,
  command: installedCommand,
  args: startArgs,
  cwd: workspace,
  status: null,
  signal: null,
  error: null,
  stdoutBytes: 0,
  stderrBytes: 0,
  commandTimeoutMs: COMMAND_TIMEOUT_MS,
  workerTimeoutMs: WORKER_TIMEOUT_MS,
  workerInactivityTimeoutMs: WORKER_INACTIVITY_TIMEOUT_MS,
  designDepthFpEvaluatorTimeoutMs: DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS,
  startedAt,
  endedAt: null,
  hostPid: process.pid
});
const run = spawnSync(installedCommand, startArgs, {
  cwd: workspace,
  encoding: "utf8",
  env: {
    ...process.env,
    ODD_SDLC_TS_OUTPUT: "json",
    ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
    ABG_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
    ODD_SDLC_WORKER_TIMEOUT_MS: String(WORKER_TIMEOUT_MS),
    ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS: String(WORKER_INACTIVITY_TIMEOUT_MS),
    ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS: String(
      DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS
    )
  },
  maxBuffer: 1024 * 1024 * 100,
  timeout: COMMAND_TIMEOUT_MS
});
const endedAt = new Date().toISOString();
const processRecord = {
  kind: "odd_sdlc_t164_full_capability_resume_process_result",
  lifecycleStatus: "completed",
  label,
  archiveRoot,
  workspace,
  command: installedCommand,
  args: startArgs,
  cwd: workspace,
  status: run.status,
  signal: run.signal,
  error: run.error?.message ?? null,
  stdoutBytes: Buffer.byteLength(run.stdout ?? "", "utf8"),
  stderrBytes: Buffer.byteLength(run.stderr ?? "", "utf8"),
  commandTimeoutMs: COMMAND_TIMEOUT_MS,
  workerTimeoutMs: WORKER_TIMEOUT_MS,
  workerInactivityTimeoutMs: WORKER_INACTIVITY_TIMEOUT_MS,
  designDepthFpEvaluatorTimeoutMs: DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS,
  startedAt,
  endedAt,
  hostPid: process.pid
};
writeJson(processRecordPath, processRecord);
writeFileSync(path.join(archiveRoot, `${label}.stdout.json`), run.stdout ?? "", "utf8");
writeFileSync(path.join(archiveRoot, `${label}.stderr.log`), run.stderr ?? "", "utf8");

assert.equal(run.status, 0, run.stderr || JSON.stringify(processRecord, null, 2));
const parsed = run.stdout === "" ? null : JSON.parse(run.stdout);
assert.equal(parsed?.kind, "odd_sdlc_spec_method_result");
assert.equal(parsed.status, "ok", JSON.stringify(parsed, null, 2));
const payload = parsed.payload;
const edgeNames = compressedEdges(
  observedHandoffEdges(workspace).map((entry) => entry.edgeName)
);
const summary = {
  kind: "odd_sdlc_t164_data_mapper_full_capability_resume_summary",
  archiveRoot,
  workspace,
  installedCommand,
  startArgs,
  resumeLabel: label,
  startStatus: payload.status ?? null,
  currentEdge:
    payload.projection?.currentEdge ?? payload.summary?.currentEdge ?? null,
  blockingReason:
    payload.summary?.blockingReason ?? payload.blockingReason ?? null,
  loop: payload.loop ?? null,
  edgeNames,
  commandTimeoutMs: COMMAND_TIMEOUT_MS,
  workerTimeoutMs: WORKER_TIMEOUT_MS,
  workerInactivityTimeoutMs: WORKER_INACTIVITY_TIMEOUT_MS,
  designDepthFpEvaluatorTimeoutMs: DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS
};
writeJson(path.join(archiveRoot, `${label}.summary.json`), summary);
writeJson(path.join(archiveRoot, "latest_resume_summary.json"), summary);

console.log(JSON.stringify(summary, null, 2));
