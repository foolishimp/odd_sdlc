// Validates: T-164
// Live proof: data_mapper full graph capability through installed start --until converged.

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS
} from "../../build/semantic/code/src/index.js";
import {
  configuredLiveTimeoutMs,
  liveOperatorRuntimePolicy
} from "./operator_runtime_policy.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const RUNTIME_POLICY = liveOperatorRuntimePolicy();
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

const REQUIRED_FULL_GRAPH_EDGES = Object.freeze([
  ...OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS
]);

const REQUIRED_TEST_LIFECYCLE_EDGES = Object.freeze([
  "derive_test_design_surface",
  "derive_component_test_surface",
  "prepare_test_execution_surface",
  "derive_test_execution_result_surface",
  "qualify_component_test_execution_surface",
  "derive_component_repair_schedule_surface",
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
  const processRecordPath = path.join(input.archiveRoot, `${input.label}.process.json`);
  writeJson(processRecordPath, {
    kind: "odd_sdlc_t164_full_capability_process_result",
    lifecycleStatus: "started",
    label: input.label,
    command: input.command,
    args: input.args,
    cwd: input.cwd,
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
  const run = spawnSync(input.command, input.args, {
    cwd: input.cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      ODD_SDLC_TS_OUTPUT: "json",
      ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
      ABG_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
      ODD_SDLC_WORKER_TIMEOUT_MS: String(WORKER_TIMEOUT_MS),
      ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS: String(
        WORKER_INACTIVITY_TIMEOUT_MS
      ),
      ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS: String(
        DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS
      )
    },
    maxBuffer: 1024 * 1024 * 100,
    timeout: COMMAND_TIMEOUT_MS
  });
  const endedAt = new Date().toISOString();
  const record = {
    kind: "odd_sdlc_t164_full_capability_process_result",
    lifecycleStatus: "completed",
    label: input.label,
    command: input.command,
    args: input.args,
    cwd: input.cwd,
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
  writeJson(processRecordPath, record);
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
      archiveRoot: manifest.archiveRoot,
      outputFile: manifest.outputFile
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

function latestHandoffWithEdge(workspace, edgeName) {
  return observedHandoffEdges(workspace)
    .filter(
      (entry) =>
        entry.edgeName === edgeName && typeof entry.archiveRoot === "string"
    )
    .sort((left, right) => left.archiveRoot.localeCompare(right.archiveRoot))
    .at(-1) ?? null;
}

function assertEdgeArchiveCarrier(workspace, edgeName, fileName) {
  const archiveRoot = latestArchiveWithEdge(workspace, edgeName);
  assert.notEqual(archiveRoot, null, `missing archive for ${edgeName}`);
  assertExists(path.join(archiveRoot, fileName), `${edgeName} ${fileName}`);
}

function assertNonEmptyArray(payload, fieldName) {
  assert(
    Array.isArray(payload?.[fieldName]) && payload[fieldName].length > 0,
    `${fieldName} must be a non-empty array`
  );
}

function parseFencedJson(text, fenceName) {
  const match = text.match(
    new RegExp("```(?:json\\s+)?" + fenceName + "\\s*\\n([\\s\\S]*?)```", "u")
  );
  assert(match, `missing fenced ${fenceName} JSON block`);
  return JSON.parse(match[1]);
}

function assertImplementationDesignCompositeProof(workspace) {
  const archiveRoot = latestArchiveWithEdge(
    workspace,
    "derive_implementation_design_surface"
  );
  assert.notEqual(
    archiveRoot,
    null,
    "missing archive for derive_implementation_design_surface"
  );
  const register = readJsonFile(
    path.join(archiveRoot, "design_depth_fp_evaluator_register.json")
  );
  assert.equal(register.kind, "sdlc_design_depth_register");
  assert.equal(register.registerVersion, "ts-design-depth-v1");
  assert.equal(register.targetAssetType, "implementation_design_surface");
  for (const fieldName of [
    "stackProfileRows",
    "implementationModuleRows",
    "aggregateDomainModelRows",
    "moduleSchemaFragments",
    "moduleStateDiagramFragments",
    "sunnyDaySequenceRows",
    "componentTopologyRows",
    "componentRealizationRows",
    "fileTargetRows"
  ]) {
    assertNonEmptyArray(register, fieldName);
  }
  assertNonEmptyArray(register.aggregateDomainModel, "entities");
  assertNonEmptyArray(register.aggregateSunnyDaySequence, "steps");
}

function assertTestDesignCompositeProof(workspace) {
  const handoff = latestHandoffWithEdge(workspace, "derive_test_design_surface");
  assert.notEqual(handoff, null, "missing handoff for derive_test_design_surface");
  assert.equal(typeof handoff.outputFile, "string", "missing test design output file");
  const outputFile = path.isAbsolute(handoff.outputFile)
    ? handoff.outputFile
    : path.join(workspace, handoff.outputFile);
  assertExists(outputFile, "derive_test_design_surface output file");
  const text = readFileSync(outputFile, "utf8");
  for (const heading of [
    "## Test Decomposition Summary",
    "## Test Stack Profile",
    "## Test Dependency Map",
    "## Test Design Register"
  ]) {
    assert.match(text, new RegExp(heading.replaceAll(" ", "\\s+"), "u"));
  }
  const register = parseFencedJson(text, "test_design_register");
  assert.equal(register.kind, "sdlc_test_design_register");
  assert.equal(register.registerVersion, "ts-test-design-v1");
  assert.equal(register.targetAssetType, "test_design_surface");
  for (const fieldName of [
    "designConsumptionRows",
    "uatTestcaseRows",
    "testcaseAuthorityRows",
    "testStackProfileRows",
    "testModuleRows",
    "testComponentTopologyRows",
    "testDataBindings",
    "expectedResultBindings",
    "uatIntegrationBindings",
    "testExecutionScheduleRows"
  ]) {
    assertNonEmptyArray(register, fieldName);
  }
}

function writeSyntheticHandoff(input) {
  const runRoot = path.join(
    input.workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs",
    input.runId
  );
  mkdirSync(runRoot, { recursive: true });
  writeJson(path.join(runRoot, "handoff_manifest.json"), {
    edgeName: input.edgeName,
    targetAssetType: input.targetAssetType,
    archiveRoot: input.archiveRoot,
    outputFile: input.outputFile
  });
}

test("T-164 full-capability proof derives required graph edges from current catalog truth", () => {
  assert.deepEqual(REQUIRED_FULL_GRAPH_EDGES, [
    ...OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS
  ]);
  assert.deepEqual(
    REQUIRED_FULL_GRAPH_EDGES.filter((edgeName) =>
      [
        "Fg_conform_project_authority",
        "select_implementation_stack_profile",
        "derive_implementation_module_surface",
        "derive_aggregate_domain_model_surface",
        "derive_implementation_component_topology_surface",
        "derive_aggregate_sunny_day_sequence_surface",
        "derive_component_realization_schedule_surface",
        "select_test_stack_profile",
        "derive_test_module_surface",
        "derive_test_component_topology_surface",
        "derive_test_schedule_surface",
        "qualify_testcase_authority"
      ].includes(edgeName)
    ),
    []
  );
});

test("T-164 composite design proofs preserve split-edge capability without stale graph edges", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t164-graph-proof-"));
  try {
    const implementationArchive = path.join(workspace, "archives/implementation");
    mkdirSync(implementationArchive, { recursive: true });
    writeSyntheticHandoff({
      workspace,
      runId: "implementation",
      edgeName: "derive_implementation_design_surface",
      targetAssetType: "implementation_design_surface",
      archiveRoot: implementationArchive,
      outputFile: null
    });
    writeJson(path.join(implementationArchive, "design_depth_fp_evaluator_register.json"), {
      kind: "sdlc_design_depth_register",
      registerVersion: "ts-design-depth-v1",
      targetAssetType: "implementation_design_surface",
      stackProfileRows: [{}],
      implementationModuleRows: [{}],
      aggregateDomainModelRows: [{}],
      moduleSchemaFragments: [{}],
      moduleStateDiagramFragments: [{}],
      sunnyDaySequenceRows: [{}],
      componentTopologyRows: [{}],
      componentRealizationRows: [{}],
      fileTargetRows: [{}],
      aggregateDomainModel: { entities: [{}] },
      aggregateSunnyDaySequence: { steps: [{}] }
    });

    const testArchive = path.join(workspace, "archives/test-design");
    const testOutputFile = path.join(workspace, "design/test-design.md");
    mkdirSync(testArchive, { recursive: true });
    mkdirSync(dirname(testOutputFile), { recursive: true });
    writeSyntheticHandoff({
      workspace,
      runId: "test-design",
      edgeName: "derive_test_design_surface",
      targetAssetType: "test_design_surface",
      archiveRoot: testArchive,
      outputFile: testOutputFile
    });
    writeFileSync(
      testOutputFile,
      [
        "## Test Decomposition Summary",
        "## Test Stack Profile",
        "## Test Dependency Map",
        "## Test Design Register",
        "```json test_design_register",
        JSON.stringify(
          {
            kind: "sdlc_test_design_register",
            registerVersion: "ts-test-design-v1",
            targetAssetType: "test_design_surface",
            designConsumptionRows: [{}],
            uatTestcaseRows: [{}],
            testcaseAuthorityRows: [{}],
            testStackProfileRows: [{}],
            testModuleRows: [{}],
            testComponentTopologyRows: [{}],
            testDataBindings: [{}],
            expectedResultBindings: [{}],
            uatIntegrationBindings: [{}],
            testExecutionScheduleRows: [{}]
          },
          null,
          2
        ),
        "```"
      ].join("\n"),
      "utf8"
    );

    assertImplementationDesignCompositeProof(workspace);
    assertTestDesignCompositeProof(workspace);
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
});

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
      workerTimeoutMs: WORKER_TIMEOUT_MS,
      workerInactivityTimeoutMs: WORKER_INACTIVITY_TIMEOUT_MS,
      designDepthFpEvaluatorTimeoutMs: DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS,
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
    assertImplementationDesignCompositeProof(workspace);
    assertTestDesignCompositeProof(workspace);
    assert(runtimeFilesNamed(workspace, "sdlc_edge_gain.json").length > 0);
  }
);
