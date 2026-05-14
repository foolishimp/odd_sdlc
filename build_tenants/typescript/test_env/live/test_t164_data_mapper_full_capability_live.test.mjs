// Validates: T-164
// Live proof: data_mapper full graph capability through installed start --until converged.

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
  writeFileSync
} from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const LIVE_ENABLED =
  process.env["ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_LIVE"] === "1";
const WORKER_TRANSPORT =
  process.env["ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_WORKER"] ??
  "process://claude?model=sonnet&effort=xhigh";
const DATA_MAPPER_TEMPLATE_ROOT =
  process.env["ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT"] ??
  "/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template";
const LIVE_TEST_RUN_ROOT =
  process.env["ODD_SDLC_TS_LIVE_TEST_RUN_ROOT"] ??
  process.env["ODD_SDLC_TS_TEST_RUN_ROOT"] ??
  path.join(PACKAGE_ROOT, "test_env/test_runs");
const COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_TIMEOUT_MS"] ??
    `${1000 * 60 * 60 * 12}`,
  10
);

const REQUIRED_FULL_GRAPH_EDGES = Object.freeze([
  "Fg_conform_project_authority",
  "derive_feature_decomp_surface",
  "derive_design_surface",
  "derive_scenario_surface",
  "derive_implementation_design_surface",
  "select_implementation_stack_profile",
  "derive_implementation_module_surface",
  "derive_aggregate_domain_model_surface",
  "derive_implementation_component_topology_surface",
  "derive_aggregate_sunny_day_sequence_surface",
  "derive_component_realization_schedule_surface",
  "derive_component_code_surface",
  "qualify_component_realization_surface",
  "derive_code_surface",
  "derive_test_design_surface",
  "select_test_stack_profile",
  "derive_test_module_surface",
  "derive_test_component_topology_surface",
  "derive_component_test_surface",
  "derive_test_schedule_surface",
  "prepare_test_execution_surface",
  "derive_test_execution_result_surface",
  "qualify_component_test_execution_surface",
  "derive_component_repair_schedule_surface",
  "derive_test_run_archive_surface",
  "qualify_testcase_authority",
  "derive_release_depth_parity_surface",
  "prepare_release_surface"
]);

const REQUIRED_TEST_LIFECYCLE_EDGES = Object.freeze([
  "derive_test_design_surface",
  "select_test_stack_profile",
  "derive_test_module_surface",
  "derive_test_component_topology_surface",
  "derive_component_test_surface",
  "derive_test_schedule_surface",
  "prepare_test_execution_surface",
  "derive_test_execution_result_surface",
  "qualify_component_test_execution_surface",
  "derive_test_run_archive_surface",
  "derive_release_depth_parity_surface",
  "prepare_release_surface"
]);

function archiveTimestamp() {
  return new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".", "");
}

function dataMapperFullCapabilityArchiveRoot(timestamp, pid) {
  return path.join(
    LIVE_TEST_RUN_ROOT,
    "t164_data_mapper_full_capability_live",
    `${timestamp}_pid${pid}`
  );
}

function writeJson(filePath, payload) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function assertExists(filePath, label) {
  assert.equal(existsSync(filePath), true, `missing ${label}: ${filePath}`);
}

function freshDataMapperWorkspace(archiveRoot) {
  assertExists(DATA_MAPPER_TEMPLATE_ROOT, "data_mapper template root");
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

function runCommand(input) {
  const startedAt = new Date().toISOString();
  const run = spawnSync(input.command, input.args, {
    cwd: input.cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      ODD_SDLC_TS_OUTPUT: "json",
      ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
      ABG_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal"
    },
    maxBuffer: 1024 * 1024 * 100,
    timeout: COMMAND_TIMEOUT_MS
  });
  const endedAt = new Date().toISOString();
  const record = {
    kind: "odd_sdlc_t164_full_capability_process_result",
    label: input.label,
    command: input.command,
    args: input.args,
    cwd: input.cwd,
    status: run.status,
    signal: run.signal,
    error: run.error?.message ?? null,
    stdoutBytes: Buffer.byteLength(run.stdout ?? "", "utf8"),
    stderrBytes: Buffer.byteLength(run.stderr ?? "", "utf8"),
    startedAt,
    endedAt
  };
  writeJson(path.join(input.archiveRoot, `${input.label}.process.json`), record);
  writeFileSync(
    path.join(input.archiveRoot, `${input.label}.stdout.json`),
    run.stdout ?? "",
    "utf8"
  );
  writeFileSync(
    path.join(input.archiveRoot, `${input.label}.stderr.log`),
    run.stderr ?? "",
    "utf8"
  );
  assert.equal(run.status, 0, run.stderr || JSON.stringify(record, null, 2));
  return run.stdout === "" ? null : JSON.parse(run.stdout);
}

function specPayload(parsed, label) {
  assert.equal(parsed?.kind, "odd_sdlc_spec_method_result", label);
  assert.equal(parsed.status, "ok", JSON.stringify(parsed, null, 2));
  return parsed.payload;
}

function installedCommandFromInstallPayload(payload, workspace) {
  const commandPath = payload.commandPaths?.find(
    (candidate) => path.basename(candidate) === "odd-sdlc-ts"
  );
  return commandPath ?? path.join(workspace, "node_modules/.bin/odd-sdlc-ts");
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

function missingValues(required, observed) {
  const observedSet = new Set(observed);
  return required.filter((value) => !observedSet.has(value));
}

function latestArchiveWithEdge(workspace, edgeName) {
  return observedHandoffEdges(workspace)
    .filter((entry) => entry.edgeName === edgeName)
    .map((entry) => entry.archiveRoot)
    .filter((archiveRoot) => typeof archiveRoot === "string")
    .sort()
    .at(-1) ?? null;
}

function assertEdgeArchiveCarrier(workspace, edgeName, fileName) {
  const archiveRoot = latestArchiveWithEdge(workspace, edgeName);
  assert.notEqual(archiveRoot, null, `missing archive for ${edgeName}`);
  assertExists(path.join(archiveRoot, fileName), `${edgeName} ${fileName}`);
}

test(
  "T-164 data_mapper full capability live run uses one installed start-until-converged command",
  {
    skip: LIVE_ENABLED
      ? false
      : "ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_LIVE=1 not set"
  },
  () => {
    const archiveRoot = dataMapperFullCapabilityArchiveRoot(
      archiveTimestamp(),
      process.pid
    );
    mkdirSync(archiveRoot, { recursive: true });
    const workspace = freshDataMapperWorkspace(archiveRoot);
    const sourceCli = path.join(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");
    assertExists(sourceCli, "built source odd-sdlc-ts CLI");

    const summary = {
      kind: "odd_sdlc_t164_data_mapper_full_capability_live_summary",
      archiveRoot,
      workspace,
      templateRoot: DATA_MAPPER_TEMPLATE_ROOT,
      workerTransport: WORKER_TRANSPORT,
      commandTimeoutMs: COMMAND_TIMEOUT_MS,
      requiredEdges: REQUIRED_FULL_GRAPH_EDGES
    };
    writeJson(path.join(archiveRoot, "run_summary.json"), summary);

    const installPayload = specPayload(
      runCommand({
        label: "install",
        command: process.execPath,
        args: [
          sourceCli,
          "install",
          "--target",
          ".",
          "--package-source",
          PACKAGE_ROOT,
          "--abg-package-source",
          ABG_TYPESCRIPT_ROOT,
          "--installed-package-name",
          "odd-sdlc-t164-data-mapper-full-capability"
        ],
        cwd: workspace,
        archiveRoot
      }),
      "install"
    );
    const installedCommand = installedCommandFromInstallPayload(
      installPayload,
      workspace
    );
    assertExists(installedCommand, "installed odd-sdlc-ts command");

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
    const startPayload = specPayload(
      runCommand({
        label: "start-until-converged",
        command: installedCommand,
        args: startArgs,
        cwd: workspace,
        archiveRoot
      }),
      "start-until-converged"
    );

    const handoffEdges = observedHandoffEdges(workspace);
    const edgeNames = compressedEdges(handoffEdges.map((entry) => entry.edgeName));
    const missingFullGraphEdges = missingValues(
      REQUIRED_FULL_GRAPH_EDGES,
      edgeNames
    );
    const missingTestLifecycleEdges = missingValues(
      REQUIRED_TEST_LIFECYCLE_EDGES,
      edgeNames
    );
    const finalSummary = {
      ...summary,
      installedCommand,
      installManifestPath: installPayload.installManifestPath ?? null,
      startArgs,
      startStatus: startPayload.status ?? null,
      startCurrentEdge:
        startPayload.projection?.currentEdge ??
        startPayload.summary?.currentEdge ??
        null,
      startBlockingReason:
        startPayload.summary?.blockingReason ??
        startPayload.blockingReason ??
        null,
      loop: startPayload.loop ?? null,
      edgeNames,
      missingFullGraphEdges,
      missingTestLifecycleEdges
    };
    writeJson(path.join(archiveRoot, "run_summary.json"), finalSummary);

    assert.equal(
      startPayload.status,
      "converged",
      JSON.stringify(finalSummary, null, 2)
    );
    assert.deepEqual(
      missingFullGraphEdges,
      [],
      JSON.stringify(finalSummary, null, 2)
    );
    assert.deepEqual(
      missingTestLifecycleEdges,
      [],
      JSON.stringify(finalSummary, null, 2)
    );
    assertEdgeArchiveCarrier(
      workspace,
      "derive_test_execution_result_surface",
      "sdlc_edge_closure_decision.json"
    );
    assertEdgeArchiveCarrier(
      workspace,
      "derive_test_run_archive_surface",
      "sdlc_edge_closure_decision.json"
    );
    assertEdgeArchiveCarrier(
      workspace,
      "derive_release_depth_parity_surface",
      "sdlc_edge_closure_decision.json"
    );
    assertEdgeArchiveCarrier(
      workspace,
      "prepare_release_surface",
      "sdlc_edge_closure_decision.json"
    );
    assert(runtimeFilesNamed(workspace, "sdlc_edge_gain.json").length > 0);
  }
);
