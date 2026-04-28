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
import { fileURLToPath } from "node:url";

import {
  constructorResultFromWorkerOutput,
  defaultOperationForTarget,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  installOddSdlcTypescript,
  minimalSdlcHookInvocationForContract,
  readWorkerResultReport,
  runOddSdlcCliAsync,
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

  const firstGaps = await runOddSdlcCliAsync([
    "gaps",
    "--workspace",
    workspace
  ]);
  assert.equal(firstGaps.status, "ok");
  assert.equal(firstGaps.payload.projection.currentEdge, "derive_intent_surface");

  const start = await runOddSdlcCliAsync([
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
  assert.equal(start.payload.loop.stepCount, 1);
  assert.equal(start.payload.loop.stoppedBy, "first_traversal");
  assert.equal(start.payload.workerRun.status, 0);
  assert.equal(start.payload.postflight.status, "passed");
  assert.equal(start.payload.hookOutcome.postflight.status, "passed");
  assert.deepStrictEqual(start.payload.emittedRuntimeEventKinds, [
    "graph_call_opened",
    "frame_opened",
    "vector_traversal_planned",
    "assessed",
    "assessed"
  ]);
  assert.equal(existsSync(start.payload.workerReport.outputFile), true);
  assert.equal(existsSync(start.payload.archiveRoot), true);

  const eventLog = path.join(workspace, ".ai-workspace/events/events.jsonl");
  assert.equal(existsSync(eventLog), true);
  const eventLines = readFileSync(eventLog, "utf8").trim().split(/\r?\n/u);
  assert.equal(eventLines.length, 5);

  const secondGaps = await runOddSdlcCliAsync([
    "gaps",
    "--workspace",
    workspace
  ]);
  assert.equal(secondGaps.status, "ok");
  assert.deepStrictEqual(secondGaps.payload.projection.closedVectorIndexes, [0]);
  assert.equal(secondGaps.payload.projection.currentEdge, "derive_product_surface");

  const compact = spawnSync(process.execPath, [CLI_MAIN, "gaps", "--workspace", workspace], {
    cwd: PACKAGE_ROOT,
    encoding: "utf8"
  });
  assert.equal(compact.status, 0, compact.stderr);
  assert.match(compact.stdout, /^odd-sdlc-ts gaps/u);
  assert.match(compact.stdout, /current_edge: derive_product_surface/u);
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
  assert.equal(JSON.parse(json.stdout).kind, "odd_sdlc_cli_result");
});

test("T-092 installed start --until blocked loops over ABG truth until a real stop", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t092"
  });
  assert.equal(install.kind, "installed");
  const workerScript = writeSecondEdgeFailingWorkerScript(workspace);

  const start = await runOddSdlcCliAsync([
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
  assert.equal(start.payload.loop.stepCount, 2);
  assert.equal(start.payload.loop.stoppedBy, "worker_failed");
  assert.deepStrictEqual(
    start.payload.loop.steps.map((step) => step.currentEdge),
    ["derive_product_surface", "derive_product_surface"]
  );

  const gaps = await runOddSdlcCliAsync(["gaps", "--workspace", workspace]);
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
  assert.match(compact.stdout, /loop_steps: 1/u);
  assert.match(compact.stdout, /loop_stop: first_traversal/u);
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
