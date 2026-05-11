// Validates: REQ-F-ODDSDLC-051
// Validates: REQ-F-ODDSDLC-052
// Validates: REQ-F-ODDSDLC-053
// Validates: REQ-F-ODDSDLC-054
// Validates: REQ-F-ODDSDLC-055
// Validates: REQ-F-ODDSDLC-056
// Validates: T-064

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  admitSdlcProjectConstraints,
  constructWorkerProcessFailurePostflight,
  constructSdlcGtlModule,
  constructorResultFromWorkerOutput,
  defaultOperationForTarget,
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcWorkspaceIngressReport,
  deriveWorkerHandoffManifest,
  executeInstalledOperatorStart,
  hookContractByEdgeName,
  installOddSdlcTypescript,
  minimalSdlcHookInvocationForContract,
  projectSdlcQueryDomain,
  projectSdlcWorkerAttachment,
  publicStartOnce,
  readWorkerResultReport,
  invokeOddSdlcSpecMethodCommand,
  runSdlcHookTurn,
  sha256Text,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const CLI_MAIN = resolve(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t064-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# T-064 Fixture", "", "Build a governed data-mapper style project."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    ["# Product", "", "T-064 fixture product."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    ["# Goals", "", "- exercise installed operator worker path"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    ["# Intent", "", "Create a typed data mapping application from source requirements."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    ["# Imported Sources", "", "- fixture://t064"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-fixture.md"),
    ["# Requirements", "", "REQ-T064-001: Preserve installed operator replay truth."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    ["# Project Bootstrap", "", "project_slug: t064_fixture"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t064_fixture",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "ambiguity_risk_appetite: medium"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/TENANT_REGISTRY.md"),
    ["# Tenant Registry", "", "- tenant: typescript"].join("\n"),
    "utf8"
  );
  return root;
}

function writeWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t064_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "process.stdout.write('t064 stdout before report\\n');",
      "process.stderr.write('t064 stderr before report\\n');",
      "const content = [`# ${manifest.targetAssetType}`, '', `graph_function: ${manifest.graphFunctionName}`, `edge: ${manifest.edgeName}`, '', 'This is a governed first-slice intent surface.'].join('\\n');",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, `${content}\\n`, 'utf8');",
      "const digest = `sha256:${createHash('sha256').update(`${content}\\n`, 'utf8').digest('hex')}`;",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [manifest.outputFile, ...obligation.evidenceRefs], blockingReasons: [] }));",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest, summary: 'generated governed first-slice intent surface', unresolvedReasons: [], materializedFiles: [], obligationAssessments }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writeSecondEdgeFailingWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t064_loop_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "if (manifest.edgeName === 'derive_product_surface') process.exit(7);",
      "const content = [`# ${manifest.targetAssetType}`, '', `graph_function: ${manifest.graphFunctionName}`, `edge: ${manifest.edgeName}`, '', 'This is governed autonomous-loop output.'].join('\\n');",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, `${content}\\n`, 'utf8');",
      "const digest = `sha256:${createHash('sha256').update(`${content}\\n`, 'utf8').digest('hex')}`;",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [manifest.outputFile], blockingReasons: [] }));",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest, summary: 'generated governed autonomous-loop output', unresolvedReasons: [], materializedFiles: [], obligationAssessments }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writeTransformOnlyWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t064_transform_only_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const content = [`# ${manifest.targetAssetType}`, '', `graph_function: ${manifest.graphFunctionName}`, `edge: ${manifest.edgeName}`, '', 'Implements: REQ-T064-001', '', 'This worker performs only F_P.transform and leaves evaluation to the framework.'].join('\\n');",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, `${content}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writeSilentWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t064_silent_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "setTimeout(() => {",
      "  process.exit(0);",
      "}, 10000);"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writeFailingWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t064_failing_worker.mjs");
  writeFileSync(workerPath, "process.exit(7);\n", "utf8");
  return workerPath;
}

test("T-064 installed operator start invokes worker and replay-backed gaps advances", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t064"
  });
  assert.equal(install.kind, "installed");
  const workerScript = writeWorkerScript(workspace);

  const firstGaps = await invokeOddSdlcSpecMethodCommand([
    "gaps",
    "--workspace",
    workspace
  ]);
  assert.equal(firstGaps.status, "ok");
  assert.equal(firstGaps.payload.projection.currentEdge, "Fg_conform_project_authority");

  const start = await invokeOddSdlcSpecMethodCommand([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:bootstrap_release_self_test",
    "--until",
    "first_traversal",
    "--worker",
    `process://node?script=${encodeURIComponent(workerScript)}`
  ]);
  assert.equal(start.status, "ok");
  assert.equal(start.payload.kind, "sdlc_installed_operator_start_outcome");
  assert.equal(start.payload.status, "worker_invoked");
  assert.equal("loop" in start.payload, false);
  assert.equal(start.payload.workerRun.status, 0);
  assert.equal(start.payload.postflight.status, "passed");
  assert.equal(start.payload.hookOutcome.postflight.status, "passed");
  assert.deepStrictEqual(start.payload.emittedRuntimeEventKinds.slice(0, 4), [
    "basis_admitted",
    "graph_call_opened",
    "frame_opened",
    "vector_traversal_planned"
  ]);
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("fp_dispatch_requested"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("actor_invocation_started"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("actor_process_started"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("actor_process_stream_observed"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("actor_process_exited"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("actor_invocation_closed"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("authority_snapshot_admitted"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("payload_observed"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("payload_validated"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("evidence_admitted"),
    true
  );
  assert.deepStrictEqual(start.payload.emittedRuntimeEventKinds.slice(-2), [
    "vector_closed",
    "terminal_reached"
  ]);
  assert.equal(existsSync(start.payload.workerReport.outputFile), true);
  assert.equal(existsSync(start.payload.archiveRoot), true);
  assert.equal(
    existsSync(path.join(start.payload.archiveRoot, "worker_process_started.json")),
    true
  );
  assert.equal(
    existsSync(path.join(start.payload.archiveRoot, "worker_process_events.jsonl")),
    true
  );
  const startedContextPath = path.join(
    start.payload.archiveRoot,
    "worker_process_started_context.json"
  );
  assert.equal(existsSync(startedContextPath), true);
  const startedContext = JSON.parse(readFileSync(startedContextPath, "utf8"));
  assert.equal(startedContext.kind, "sdlc_worker_process_started_context");
  assert.match(startedContext.manifestRef, /handoff_manifest\.json$/u);
  assert.match(startedContext.promptRef, /worker_prompt\.md$/u);
  assert.match(startedContext.reportRef, /worker_result_report\.json$/u);
  assert.match(startedContext.outputRef, /intent_surface\.md$/u);
  assert.equal(startedContext.pid > 0, true);
  if (startedContext.executorProfile === "pty-terminal") {
    assert.equal(typeof startedContext.terminalSessionId, "string");
    assert.equal(startedContext.terminalSessionId.length > 0, true);
  } else {
    assert.equal(startedContext.terminalSessionId, null);
  }
  assert.equal(startedContext.timeoutMs > startedContext.inactivityTimeoutMs, true);
  const processSummaryPath = path.join(
    start.payload.archiveRoot,
    "worker_process_summary.json"
  );
  assert.equal(existsSync(processSummaryPath), true);
  const processSummary = JSON.parse(readFileSync(processSummaryPath, "utf8"));
  assert.equal(processSummary.kind, "sdlc_worker_process_summary");
  assert.match(processSummary.manifestRef, /handoff_manifest\.json$/u);
  assert.match(processSummary.promptRef, /worker_prompt\.md$/u);
  assert.match(processSummary.reportRef, /worker_result_report\.json$/u);
  assert.match(processSummary.outputRef, /intent_surface\.md$/u);
  assert.equal(processSummary.timeoutMs > processSummary.inactivityTimeoutMs, true);
  assert.equal(processSummary.signalSequence.length, 0);
  assert.match(
    readFileSync(start.payload.workerRun.stdoutPath, "utf8"),
    /t064 stdout before report/u
  );
  assert.match(
    readFileSync(start.payload.workerRun.stderrPath, "utf8"),
    /t064 stderr before report/u
  );
  assert.match(
    readFileSync(path.join(start.payload.archiveRoot, "worker_process_events.jsonl"), "utf8"),
    /actor_process_stream_observed/u
  );

  const eventLog = path.join(workspace, ".ai-workspace/events/events.jsonl");
  assert.equal(existsSync(eventLog), true);
  const eventLines = readFileSync(eventLog, "utf8").trim().split(/\r?\n/u);
  const loggedEvents = eventLines.map((line) => JSON.parse(line));
  assert.equal(loggedEvents[0].kind, "workspace_installation_admitted");
  assert.deepStrictEqual(
    loggedEvents.slice(1).map((event) => event.kind),
    start.payload.emittedRuntimeEventKinds
  );

  const secondGaps = await invokeOddSdlcSpecMethodCommand([
    "gaps",
    "--workspace",
    workspace
  ]);
  assert.equal(secondGaps.status, "ok");
  assert.deepStrictEqual(secondGaps.payload.projection.closedVectorIndexes, []);
  assert.equal(secondGaps.payload.projection.currentEdge, "derive_intent_surface");

  const compact = spawnSync(process.execPath, [CLI_MAIN, "gaps", "--workspace", workspace], {
    cwd: PACKAGE_ROOT,
    encoding: "utf8"
  });
  assert.equal(compact.status, 0, compact.stderr);
  assert.match(compact.stdout, /^odd-sdlc-ts gaps/u);
  assert.match(compact.stdout, /current_edge: derive_intent_surface/u);
  assert.match(compact.stdout, /json: rerun with ODD_SDLC_TS_OUTPUT=json/u);

  const json = spawnSync(process.execPath, [CLI_MAIN, "gaps", "--workspace", workspace], {
    cwd: PACKAGE_ROOT,
    encoding: "utf8",
    env: {
      ...process.env,
      ODD_SDLC_TS_OUTPUT: "json"
    },
    maxBuffer: 1024 * 1024 * 5
  });
  assert.equal(json.status, 0, json.stderr);
  assert.equal(JSON.parse(json.stdout).kind, "odd_sdlc_spec_method_result");
});

test("B-078 typed ABG hard timeout outranks legacy silent inactivity", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-b078"
  });
  assert.equal(install.kind, "installed");
  const workerScript = writeSilentWorkerScript(workspace);
  const previousTimeout = process.env["ODD_SDLC_WORKER_TIMEOUT_MS"];
  const previousInactivityTimeout =
    process.env["ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS"];
  const previousHeartbeat = process.env["ODD_SDLC_WORKER_HEARTBEAT_MS"];
  process.env["ODD_SDLC_WORKER_TIMEOUT_MS"] = "120";
  process.env["ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS"] = "10000";
  process.env["ODD_SDLC_WORKER_HEARTBEAT_MS"] = "20";
  try {
    const start = await invokeOddSdlcSpecMethodCommand([
      "start",
      "--workspace",
      workspace,
      "--target",
      "graph_function:bootstrap_release_self_test",
      "--until",
      "first_traversal",
      "--worker",
      `process://node?script=${encodeURIComponent(workerScript)}`
    ]);

    assert.equal(start.status, "ok");
    assert.equal(start.payload.status, "worker_failed");
    assert.equal(start.payload.workerRun.timedOut, true);
    assert.equal(start.payload.workerRun.stdoutByteCount, 0);
    assert.equal(start.payload.workerRun.stderrByteCount, 0);
    assert.equal(
      start.payload.postflight.blockingReasonCarriers[0].code,
      "worker_hard_timeout"
    );
    assert.equal(start.payload.manifest.retryContext.priorGapDossiers.length, 0);
    assert.equal(start.payload.gapDossier.retryEligible, false);
    assert.deepStrictEqual(
      start.payload.gapDossier.nextLawfulActions,
      ["triage_gap"]
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /sharpenedRetryAvailable=false/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /pid=\d+/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /outcome=hard_timeout/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /hardTimeoutMs=120/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /inactivityTimeoutMs=10000/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /heartbeatMs=20/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /lastHeartbeatElapsedMs=\d+/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /signalSequence=SIGTERM@\d+ms/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /runtimeLivenessAuthority=abiogenesis_runtime_liveness_observer_projection/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /runtimeLivenessProjectionRef=file:.*runtime_liveness_observer_projection\.json/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /runtimeLivenessLeaseState=externally_interrupted/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /runtimeLivenessDispositionAction=block/u
    );
    assert.match(
      start.payload.postflight.blockingReasonCarriers[0].detail,
      /processSummaryRef=file:.*worker_process_summary\.json/u
    );
    assert.deepStrictEqual(start.payload.gapDossier.nextLawfulActions, [
      "triage_gap"
    ]);
    assert.equal(start.payload.gapDossier.retryEligible, false);
    assert.match(
      readFileSync(
        path.join(start.payload.archiveRoot, "worker_process_events.jsonl"),
        "utf8"
      ),
      /actor_process_timeout/u
    );
    assert.equal(
      start.payload.postflight.evidenceRefs.some((ref) =>
        ref.includes("worker_process_events.jsonl")
      ),
      true
    );
    assert.equal(
      start.payload.postflight.evidenceRefs.some((ref) =>
        ref.includes("worker_process_started_context.json")
      ),
      true
    );
    assert.equal(
      start.payload.postflight.evidenceRefs.some((ref) =>
        ref.includes("worker_process_summary.json")
      ),
      true
    );
    const processSummary = JSON.parse(
      readFileSync(
        path.join(start.payload.archiveRoot, "worker_process_summary.json"),
        "utf8"
      )
    );
    assert.equal(processSummary.kind, "sdlc_worker_process_summary");
    assert.equal(processSummary.timeoutMs, 120);
    assert.equal(processSummary.inactivityTimeoutMs, 10000);
    assert.equal(processSummary.heartbeatMs, 20);
    assert.equal(
      processSummary.runtimeLivenessAuthority,
      "abiogenesis_runtime_liveness_observer_projection"
    );
    assert.equal(
      processSummary.runtimeLivenessLeaseState,
      "externally_interrupted"
    );
    assert.equal(processSummary.runtimeLivenessDispositionAction, "block");
    assert.equal(processSummary.pid > 0, true);
    assert.equal(processSummary.lastHeartbeatElapsedMs >= 0, true);
    assert.deepStrictEqual(
      processSummary.signalSequence.map((entry) => entry.signal),
      ["SIGTERM"]
    );
    assert.match(processSummary.manifestRef, /handoff_manifest\.json$/u);
    assert.match(processSummary.promptRef, /worker_prompt\.md$/u);
    assert.match(processSummary.reportRef, /worker_result_report\.json$/u);
    assert.match(processSummary.outputRef, /intent_surface\.md$/u);
    const livenessProjection = JSON.parse(
      readFileSync(
        path.join(start.payload.archiveRoot, "runtime_liveness_observer_projection.json"),
        "utf8"
      )
    );
    assert.equal(livenessProjection.kind, "runtime_liveness_observer_projection");
    assert.equal(livenessProjection.leaseState, "externally_interrupted");
    assert.equal(livenessProjection.disposition.action, "block");
    assert.equal(
      livenessProjection.interruptionRows.some(
        (row) => row.source === "harness_safety_cap"
      ),
      true
    );
  } finally {
    if (previousTimeout === undefined) {
      delete process.env["ODD_SDLC_WORKER_TIMEOUT_MS"];
    } else {
      process.env["ODD_SDLC_WORKER_TIMEOUT_MS"] = previousTimeout;
    }
    if (previousInactivityTimeout === undefined) {
      delete process.env["ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS"];
    } else {
      process.env["ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS"] =
        previousInactivityTimeout;
    }
    if (previousHeartbeat === undefined) {
      delete process.env["ODD_SDLC_WORKER_HEARTBEAT_MS"];
    } else {
      process.env["ODD_SDLC_WORKER_HEARTBEAT_MS"] = previousHeartbeat;
    }
  }
});

test("T-128 installed start returns worker_failed envelope after process failure", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t128"
  });
  assert.equal(install.kind, "installed");
  const workerScript = writeFailingWorkerScript(workspace);

  const start = await invokeOddSdlcSpecMethodCommand([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:bootstrap_release_self_test",
    "--until",
    "first_traversal",
    "--worker",
    `process://node?script=${encodeURIComponent(workerScript)}`
  ]);

  assert.equal(start.status, "ok");
  assert.equal(start.payload.kind, "sdlc_installed_operator_start_outcome");
  assert.equal(start.payload.status, "worker_failed");
  assert.equal("loop" in start.payload, false);
  assert.equal(start.payload.workerRun.status, 7);
  assert.equal(start.payload.postflight.status, "blocked");
  assert.equal(start.payload.gapDossier.status, "open");
  assert.equal(start.payload.gapDossier.retryEligible, false);
  assert.deepStrictEqual(start.payload.gapDossier.nextLawfulActions, [
    "triage_gap"
  ]);
  assert.equal(
    existsSync(
      path.join(
        start.payload.manifest.archiveRoot,
        "worker_process_failure_postflight.json"
      )
    ),
    true
  );
});

test("B-078 process-summary admission defects fail closed as typed evidence blockers", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_intent_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "b078-process-summary-admission"
  });
  writeHandoffFiles(manifest);
  const stdoutPath = path.join(manifest.archiveRoot, "worker_stdout.log");
  const stderrPath = path.join(manifest.archiveRoot, "worker_stderr.log");
  writeFileSync(stdoutPath, "", "utf8");
  writeFileSync(stderrPath, "", "utf8");
  const workerRun = {
    kind: "sdlc_worker_run_result",
    command: "node",
    args: [],
    cwd: workspace,
    status: 143,
    signal: null,
    elapsedMs: 120,
    timedOut: true,
    stdoutByteCount: 0,
    stderrByteCount: 0,
    stdoutPath,
    stderrPath,
    outputLastMessagePath: null,
    error: null
  };

  const missing = constructWorkerProcessFailurePostflight({
    manifest,
    workerRun
  });
  assert.equal(
    missing.blockingReasonCarriers[0].code,
    "worker_process_summary_missing"
  );
  assert.equal(
    missing.blockingReasons.some((reason) =>
      reason.startsWith("silent_worker_inactivity")
    ),
    false
  );

  writeFileSync(
    path.join(manifest.archiveRoot, "worker_process_summary.json"),
    "{\"kind\":\"wrong\"}\n",
    "utf8"
  );
  const invalid = constructWorkerProcessFailurePostflight({
    manifest,
    workerRun
  });
  assert.equal(
    invalid.blockingReasonCarriers[0].code,
    "worker_process_summary_invalid"
  );
  assert.match(
    invalid.blockingReasonCarriers[0].detail,
    /processSummaryRef=file:.*worker_process_summary\.json/u
  );
});

test("T-064 worker provider rate limits stay inside same-edge retry law", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("prepare_test_execution_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 25,
    contract,
    runId: "t064-worker-rate-limit"
  });
  writeHandoffFiles(manifest);
  const stdoutPath = path.join(manifest.archiveRoot, "worker_stdout.log");
  const stderrPath = path.join(manifest.archiveRoot, "worker_stderr.log");
  const finalOutputPath = path.join(manifest.archiveRoot, "final_output.txt");
  writeFileSync(
    stdoutPath,
    [
      JSON.stringify({
        type: "rate_limit_event",
        rate_limit_info: { status: "rejected", rateLimitType: "five_hour" }
      }),
      JSON.stringify({ type: "result", is_error: true, api_error_status: 429 })
    ].join("\n"),
    "utf8"
  );
  writeFileSync(stderrPath, "", "utf8");
  writeFileSync(finalOutputPath, "You've hit your org's monthly usage limit\n", "utf8");
  const workerRun = {
    kind: "sdlc_worker_run_result",
    command: "claude",
    args: [],
    cwd: workspace,
    outcome: { kind: "exited", status: 1 },
    executorProfile: "pty-terminal",
    streamModel: "terminal-transcript",
    finalOutputRef: pathToFileURL(finalOutputPath).href,
    status: 1,
    signal: null,
    elapsedMs: 1866,
    timedOut: false,
    stdoutByteCount: 180,
    stderrByteCount: 0,
    stdoutPath,
    stderrPath,
    outputLastMessagePath: null,
    error: null
  };

  const postflight = constructWorkerProcessFailurePostflight({
    manifest,
    workerRun
  });

  assert.equal(postflight.blockingReasonCarriers[0].code, "worker_rate_limited");
  assert.equal(
    postflight.blockingReasonCarriers[0].lawfulReentryPoint,
    "same_edge_retry"
  );
  assert(postflight.evidenceRefs.includes(pathToFileURL(finalOutputPath).href));
});

test("T-064 operator observes F_P.transform output and generates report", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t064-transform-only"
  });
  assert.equal(install.kind, "installed");
  const workerScript = writeTransformOnlyWorkerScript(workspace);

  const start = await invokeOddSdlcSpecMethodCommand([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:bootstrap_release_self_test",
    "--until",
    "first_traversal",
    "--worker",
    `process://node?script=${encodeURIComponent(workerScript)}`
  ]);

  assert.equal(start.status, "ok");
  assert.equal(start.payload.kind, "sdlc_installed_operator_start_outcome");
  assert.equal(start.payload.status, "worker_invoked");
  assert.equal(start.payload.workerRun.status, 0);
  assert.equal(start.payload.workerReport.kind, "odd_sdlc.worker_result_report");
  assert.match(start.payload.workerReport.summary, /framework-generated/u);
  assert.match(start.payload.workerReport.fpTransformResultRef, /fp_transform_result\.json$/u);
  assert.equal(start.payload.workerReport.fpTransformStatus, "returned");
  assert.equal(start.payload.postflight.status, "passed");
  const transformRequest = JSON.parse(
    readFileSync(path.join(start.payload.archiveRoot, "fp_transform_request.json"), "utf8")
  );
  const transformResult = JSON.parse(
    readFileSync(path.join(start.payload.archiveRoot, "fp_transform_result.json"), "utf8")
  );
  const evaluateResult = JSON.parse(
    readFileSync(path.join(start.payload.archiveRoot, "fp_evaluate_result.json"), "utf8")
  );
  assert.equal(transformRequest.kind, "fp_transform_request");
  assert.equal(transformResult.kind, "fp_transform_result");
  assert.equal(transformResult.requestRef, transformRequest.requestRef);
  assert.equal(transformResult.status, "returned");
  assert.equal(evaluateResult.kind, "sdlc_fp_evaluate_result");
  assert.equal(evaluateResult.stage, "F_P.evaluate");
  assert.equal(evaluateResult.status, "passed");
  assert.equal(
    existsSync(path.join(start.payload.archiveRoot, "post_transform_observation.json")),
    true
  );
});

test("T-092 installed start --until blocked delegates iteration to ABG until a real stop", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t092"
  });
  assert.equal(install.kind, "installed");
  const workerScript = writeSecondEdgeFailingWorkerScript(workspace);

  const start = await invokeOddSdlcSpecMethodCommand([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:bootstrap_release_self_test",
    "--until",
    "blocked",
    "--worker",
    `process://node?script=${encodeURIComponent(workerScript)}`
  ]);

  assert.equal(start.status, "ok");
  assert.equal(start.payload.kind, "sdlc_installed_operator_start_outcome");
  assert.equal(start.payload.status, "worker_failed");
  assert.equal("loop" in start.payload, false);
  assert.equal(start.payload.summary.currentEdge, "derive_product_surface");
  assert.equal(start.payload.postflight.status, "blocked");
  assert.equal(start.payload.gapDossier.status, "open");
  assert.equal(
    start.payload.postflight.evidenceRefs.some((ref) =>
      ref.includes("worker_process_started.json")
    ),
    true
  );
  assert.equal(
    start.payload.postflight.evidenceRefs.some((ref) =>
      ref.includes("worker_process_events.jsonl")
    ),
    true
  );
  assert.equal(
    start.payload.gapDossier.evidenceRefs.some((ref) =>
      ref.includes("worker_process_events.jsonl")
    ),
    true
  );
  assert.deepStrictEqual(start.payload.emittedRuntimeEventKinds.slice(-2), [
    "retry_attempt_stopped",
    "terminal_reached"
  ]);

  const gaps = await invokeOddSdlcSpecMethodCommand(["gaps", "--workspace", workspace]);
  assert.equal(gaps.status, "ok");
  assert.equal(gaps.payload.projection.currentEdge, "derive_product_surface");

  const compact = spawnSync(
    process.execPath,
    [
      CLI_MAIN,
      "start",
      "--workspace",
      workspace,
      "--target",
      "graph_function:bootstrap_release_self_test",
      "--until",
      "first_traversal",
      "--worker",
      `process://node?script=${encodeURIComponent(workerScript)}`
    ],
    {
      cwd: PACKAGE_ROOT,
      encoding: "utf8"
    }
  );
  assert.equal(compact.status, 0, compact.stderr);
  assert.doesNotMatch(compact.stdout, /loop_steps:/u);
  assert.doesNotMatch(compact.stdout, /loop_stop:/u);
});

test("T-067 installed operator preserves non-generate operation type for qualification edges", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_test_run_archive_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 15,
    contract,
    runId: "t067-qualification-operation"
  });
  writeHandoffFiles(manifest);

  const content = [
    "# test_run_archive_surface",
    "",
    "This is a governed qualification archive surface."
  ].join("\n");
  const artifact = `${content}\n`;
  const digest = sha256Text(artifact);
  writeFileSync(manifest.outputFile, artifact, "utf8");
  writeFileSync(
    manifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: manifest.graphFunctionName,
        edgeName: manifest.edgeName,
        targetAssetType: manifest.targetAssetType,
        outputFile: manifest.outputFile,
        digest,
        summary: "generated governed qualification archive surface",
        unresolvedReasons: [],
        materializedFiles: []
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const workerReport = readWorkerResultReport(manifest);
  const operationType = defaultOperationForTarget(contract.targetAssetType);
  const constructorResult = constructorResultFromWorkerOutput({
    manifest,
    report: workerReport,
    operationType
  });
  const invocation = minimalSdlcHookInvocationForContract({
    contract,
    targetAssetId: constructorResult.outputIdentity.assetId,
    fpWorkerContractRef: "process://node"
  });
  const outcome = runSdlcHookTurn({
    contract,
    invocation,
    constructorResult
  });

  assert.equal(operationType, "qualify");
  assert.equal(invocation.requestedOperation, "qualify");
  assert.equal(constructorResult.operationType, "qualify");
  assert.equal(outcome.workReport?.operationType, "qualify");
  assert.equal(outcome.postflight?.status, "passed");
});

test("T-106 installed operator uses admitted conformed profile after workspace drift", async () => {
  const workspace = makeWorkspace();
  const module = constructSdlcGtlModule();
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: `file://${workspace}`,
    projectConstraints: admitSdlcProjectConstraints({
      projectSlug: "t064_fixture",
      activeTenant: "typescript",
      selectedOutputRoot: "build_tenants/typescript",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: []
    }),
    sourceInputs: []
  });
  const queryDomain = projectSdlcQueryDomain({ module, ingressReport });
  const conformedProject =
    deriveSdlcConformProjectProfileFromWorkspace(workspace);
  assert.equal(conformedProject.activeTenant, "typescript");
  const start = publicStartOnce({
    request: {
      kind: "sdlc_public_start_request",
      workspaceRoot: workspace,
      target: {
        kind: "graph_function",
        handle: "bootstrap_release_self_test"
      },
      until: "first_traversal",
      defaultRegime: "F_P"
    },
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({
      transportContract: "process://node"
    })
  });
  assert.equal(start.kind, "sdlc_public_start_projected");

  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: drifted_fixture",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark/",
      "    language: Scala",
      "    build_tool: sbt",
      "    test_runner: sbt test"
    ].join("\n"),
    "utf8"
  );

  const workerScript = writeTransformOnlyWorkerScript(workspace);
  const result = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
    replayEvents: []
  });

  assert.notEqual(result.status, "worker_failed");
  assert.notEqual(result.manifest, null);
  assert.equal(result.manifest.conformedProject.activeTenant, "typescript");
  assert.equal(
    result.manifest.productMaterialization.tenantRoot.endsWith(
      "build_tenants/typescript"
    ),
    true
  );
});
