// Validates: T-109
// Validates: T-041
// Validates: live-installed-data-mapper-pty-traversal

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FG_CONFORM_PROJECT,
  installOddSdlcTypescript
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const LIVE_ENABLED = process.env["ODD_SDLC_TS_T109_DATA_MAPPER_LIVE"] === "1";
const DATA_MAPPER_TEMPLATE_ROOT =
  process.env["ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT"] ??
  "/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template";
const MAX_STEPS = Number.parseInt(
  process.env["ODD_SDLC_TS_T109_DATA_MAPPER_MAX_STEPS"] ?? "24",
  10
);
const COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_T109_DATA_MAPPER_COMMAND_TIMEOUT_MS"] ?? `${1000 * 60 * 20}`,
  10
);

function archiveTimestamp() {
  return new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(".", "");
}

function writeJson(filePath, payload) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

const SOURCE_ROOT_FIXED_LEAK_PATHS = [
  ".abiogenesis",
  ".bloop",
  ".genesis",
  ".metals",
  ".scala-build",
  "build_tenants/scala_spark",
  "target"
];

function sourceRootLeakPaths() {
  const paths = new Set(SOURCE_ROOT_FIXED_LEAK_PATHS);
  if (existsSync(REPO_ROOT)) {
    for (const entry of readdirSync(REPO_ROOT, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith("cdme-")) {
        paths.add(entry.name);
      }
    }
  }
  return [...paths].sort();
}

function latestMtimeMs(candidatePath) {
  if (!existsSync(candidatePath)) {
    return null;
  }
  let latest = statSync(candidatePath).mtimeMs;
  const stack = [candidatePath];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      const childStat = statSync(child);
      latest = Math.max(latest, childStat.mtimeMs);
      if (entry.isDirectory()) {
        stack.push(child);
      }
    }
  }
  return latest;
}

function snapshotSourceRootHygiene() {
  const snapshot = {};
  for (const relativePath of sourceRootLeakPaths()) {
    snapshot[relativePath] = latestMtimeMs(path.join(REPO_ROOT, relativePath));
  }
  return snapshot;
}

function assertSourceRootHygieneUnchanged(baseline, archiveRoot, label) {
  const current = snapshotSourceRootHygiene();
  const offenders = [];
  for (const [relativePath, after] of Object.entries(current)) {
    const before = Object.hasOwn(baseline, relativePath) ? baseline[relativePath] : null;
    if (before === null && after !== null) {
      offenders.push({ relativePath, reason: "created", before, after });
    } else if (before !== null && after !== null && after > before + 1000) {
      offenders.push({ relativePath, reason: "updated", before, after });
    }
  }
  writeJson(path.join(archiveRoot, `${label}.source-root-hygiene.json`), {
    kind: "odd_sdlc_source_root_hygiene_check",
    label,
    repoRoot: REPO_ROOT,
    baseline,
    current,
    offenders
  });
  assert.deepEqual(
    offenders,
    [],
    `source-root sandbox leak detected after ${label}: ${JSON.stringify(offenders, null, 2)}`
  );
}

function freshDataMapperWorkspace(archiveRoot) {
  assert.equal(
    existsSync(DATA_MAPPER_TEMPLATE_ROOT),
    true,
    `missing data_mapper template: ${DATA_MAPPER_TEMPLATE_ROOT}`
  );
  const workspace = path.join(archiveRoot, "workspace");
  cpSync(DATA_MAPPER_TEMPLATE_ROOT, workspace, { recursive: true });
  for (const relativePath of [
    ".ai-workspace/events",
    ".ai-workspace/runtime",
    ".abiogenesis",
    ".genesis",
    ".npm-cache",
    "node_modules"
  ]) {
    rmSync(path.join(workspace, relativePath), { recursive: true, force: true });
  }
  return workspace;
}

function installedOddSdlcCommand(install) {
  const commandPath = install.commandPaths.find(
    (candidate) => path.basename(candidate) === "odd-sdlc-ts"
  );
  assert(commandPath, "odd-sdlc-ts command path missing");
  return commandPath;
}

function runInstalled(commandPath, args, workspace, archiveRoot, label, sourceRootHygieneBaseline) {
  const run = spawnSync(commandPath, args, {
    cwd: workspace,
    encoding: "utf8",
    env: {
      ...process.env,
      ODD_SDLC_TS_OUTPUT: "json",
      ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
      ABG_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal"
    },
    maxBuffer: 1024 * 1024 * 50,
    timeout: COMMAND_TIMEOUT_MS
  });
  const record = {
    label,
    commandPath,
    args,
    cwd: workspace,
    status: run.status,
    signal: run.signal,
    error: run.error?.message ?? null,
    stdoutBytes: Buffer.byteLength(run.stdout ?? "", "utf8"),
    stderr: run.stderr
  };
  writeJson(path.join(archiveRoot, `${label}.process.json`), record);
  writeFileSync(path.join(archiveRoot, `${label}.stdout.json`), run.stdout ?? "", "utf8");
  writeFileSync(path.join(archiveRoot, `${label}.stderr.log`), run.stderr ?? "", "utf8");
  assertSourceRootHygieneUnchanged(sourceRootHygieneBaseline, archiveRoot, label);
  assert.equal(run.status, 0, run.stderr || JSON.stringify(record, null, 2));
  const parsed = JSON.parse(run.stdout);
  assert.equal(parsed.kind, "odd_sdlc_cli_result");
  assert.equal(parsed.status, "ok", JSON.stringify(parsed, null, 2));
  return parsed.payload;
}

function edgeSummary(payload) {
  return {
    status: payload.status,
    currentEdge: payload.projection?.currentEdge ?? payload.summary?.currentEdge ?? null,
    summaryEdge: payload.summary?.currentEdge ?? null,
    graphFunction: payload.summary?.graphFunctionName ?? null,
    postflight: payload.postflight?.status ?? null,
    assurance: payload.assuranceSatisfaction?.status ?? null,
    blockingReason: payload.summary?.blockingReason ?? payload.blockingReason ?? null,
    archiveRoot: payload.archiveRoot ?? payload.summary?.archiveRoot ?? null
  };
}

test(
  "T-109/T-041 live installed data_mapper traverses through Claude PTY on the production operator path",
  { skip: LIVE_ENABLED ? false : "ODD_SDLC_TS_T109_DATA_MAPPER_LIVE=1 not set" },
  async () => {
    const archiveRoot = path.join(
      PACKAGE_ROOT,
      "test_env/test_runs/t109_live_installed_data_mapper_pty",
      `${archiveTimestamp()}_pid${process.pid}`
    );
    mkdirSync(archiveRoot, { recursive: true });
    const workspace = freshDataMapperWorkspace(archiveRoot);
    const install = await installOddSdlcTypescript({
      targetRoot: workspace,
      packageSourceRoot: PACKAGE_ROOT,
      abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
      installedPackageName: "odd-sdlc-t109-live-data-mapper"
    });
    assert.equal(install.kind, "installed");
    const commandPath = installedOddSdlcCommand(install);
    const sourceRootHygieneBaseline = snapshotSourceRootHygiene();
    const target = "graph_function:bootstrap_release_self_test";
    const requiredEdges = new Set([
      "derive_code_surface",
      "derive_test_module_surface",
      "derive_test_execution_result_surface",
      "derive_test_run_archive_surface"
    ]);
    const reachedEdges = new Set();
    const steps = [];

    for (let step = 0; step < MAX_STEPS; step += 1) {
      const gaps = runInstalled(
        commandPath,
        ["gaps", "--workspace", workspace],
        workspace,
        archiveRoot,
        `step-${String(step).padStart(2, "0")}-gaps`,
        sourceRootHygieneBaseline
      );
      const currentEdge = gaps.projection.currentEdge;
      steps.push({ step, phase: "gaps", ...edgeSummary(gaps) });
      if (currentEdge === null || currentEdge === "qualify_testcase_authority") {
        break;
      }
      if (currentEdge === FG_CONFORM_PROJECT) {
        const induction = runInstalled(
          commandPath,
          ["start", "--workspace", workspace, "--until", "blocked"],
          workspace,
          archiveRoot,
          `step-${String(step).padStart(2, "0")}-induction`,
          sourceRootHygieneBaseline
        );
        steps.push({ step, phase: "induction", ...edgeSummary(induction) });
        assert.equal(induction.status, "converged", JSON.stringify(induction, null, 2));
        continue;
      }
      const start = runInstalled(
        commandPath,
        [
          "start",
          "--workspace",
          workspace,
          "--target",
          target,
          "--until",
          "first_traversal",
          "--worker",
          "process://claude"
        ],
        workspace,
        archiveRoot,
        `step-${String(step).padStart(2, "0")}-start-${currentEdge}`,
        sourceRootHygieneBaseline
      );
      steps.push({ step, phase: "start", requestedEdge: currentEdge, ...edgeSummary(start) });
      writeJson(path.join(archiveRoot, "steps.json"), steps);
      assert.equal(start.status, "worker_invoked", JSON.stringify(start, null, 2));
      assert.equal(start.workerRun.executorProfile, "pty-terminal");
      assert.equal(start.workerRun.streamModel, "terminal-transcript");
      assert.equal(start.workerRun.outcome.kind, "exited");
      assert.equal(start.workerRun.outcome.status, 0);
      assert.equal(start.postflight.status, "passed", JSON.stringify(start, null, 2));
      reachedEdges.add(currentEdge);
      if ([...requiredEdges].every((edge) => reachedEdges.has(edge))) {
        break;
      }
    }

    writeJson(path.join(archiveRoot, "steps.json"), steps);
    writeJson(path.join(archiveRoot, "reached_edges.json"), [...reachedEdges].sort());
    for (const edge of requiredEdges) {
      assert.equal(reachedEdges.has(edge), true, `required live edge not reached: ${edge}`);
    }
    assert.equal(
      existsSync(
        path.join(
          workspace,
          "build_tenants/scala_spark/cdme-core/src/main/scala/cdme/Core.scala"
        )
      ),
      true
    );
    assert.equal(
      existsSync(
        path.join(
          workspace,
          "build_tenants/scala_spark/cdme-core/src/test/scala/cdme/CoreSpec.scala"
        )
      ),
      true
    );
    writeJson(path.join(archiveRoot, "run_summary.json"), {
      verdict: "passed",
      workspace,
      reachedEdges: [...reachedEdges].sort(),
      maxSteps: MAX_STEPS
    });
  }
);
