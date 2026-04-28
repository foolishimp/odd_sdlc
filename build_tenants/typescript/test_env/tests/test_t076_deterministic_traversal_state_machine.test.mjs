// Validates: REQ-F-ODDSDLC-013
// Validates: REQ-F-ODDSDLC-014
// Validates: REQ-F-ODDSDLC-015
// Validates: REQ-F-ODDSDLC-039
// Validates: REQ-F-ODDSDLC-051
// Validates: REQ-F-ODDSDLC-055
// Validates: T-076

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  admitSdlcProjectConstraints,
  constructSdlcGtlModule,
  deriveSdlcInstalledQualificationInitialState,
  deriveSdlcWorkspaceIngressReport,
  deriveMaterializationAssuranceLedger,
  deriveObligationCarryAssuranceLedger,
  executeInstalledOperatorStart,
  FG_CONFORM_PROJECT,
  foldSdlcAssuranceLedgers,
  installOddSdlcTypescript,
  materializeSdlcProjectConformance,
  projectSdlcGapsFromReplay,
  projectSdlcQueryDomain,
  projectSdlcWorkerAttachment,
  publicStartOnce,
  readOddSdlcRuntimeEvents
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const DATA_MAPPER_TEMPLATE_ROOT =
  process.env["ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT"] ??
  "/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template";

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t076-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# T-076 Fixture", "", "Build a governed Scala data mapper."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    ["# Intent", "", "Create a typed data mapping application from source requirements."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-fixture.md"),
    [
      "# Requirements",
      "",
      "REQ-T076-001: Failed code-edge postflight must become retry truth."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t076_fixture",
      "  test_runner: sbt test",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "ambiguity_risk_appetite: medium"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function freshDataMapperWorkspace() {
  assert.equal(
    existsSync(DATA_MAPPER_TEMPLATE_ROOT),
    true,
    `missing data_mapper template: ${DATA_MAPPER_TEMPLATE_ROOT}`
  );
  const parentRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t076-dm-"));
  const workspaceRoot = path.join(parentRoot, "data_mapper.test76.ts");
  cpSync(DATA_MAPPER_TEMPLATE_ROOT, workspaceRoot, { recursive: true });
  return workspaceRoot;
}

function runInstalledOddSdlc(commandPath, args, workspaceRoot) {
  const run = spawnSync(commandPath, args, {
    cwd: workspaceRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      ODD_SDLC_TS_OUTPUT: "json"
    },
    maxBuffer: 1024 * 1024 * 10
  });
  assert.equal(run.status, 0, run.stderr);
  const parsed = JSON.parse(run.stdout);
  assert.equal(parsed.kind, "odd_sdlc_cli_result");
  assert.equal(parsed.status, "ok");
  return parsed.payload;
}

function installedOddSdlcCommand(install) {
  const commandPath = install.commandPaths.find(
    (candidate) => path.basename(candidate) === "odd-sdlc-ts"
  );
  assert(commandPath, "odd-sdlc-ts command path missing");
  return commandPath;
}

function makeStart(workspaceRoot) {
  const module = constructSdlcGtlModule();
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: `file://${workspaceRoot}`,
    projectConstraints: admitSdlcProjectConstraints({
      projectSlug: "t076",
      activeTenant: "scala_spark",
      selectedOutputRoot: "build_tenants/scala_spark",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: ["transport_contract"]
    }),
    sourceInputs: []
  });
  const queryDomain = projectSdlcQueryDomain({ module, ingressReport });
  const start = publicStartOnce({
    request: {
      kind: "sdlc_public_start_request",
      workspaceRoot,
      target: {
        kind: "graph_function",
        handle: "bootstrap_release_self_test"
      },
      until: "converged",
      defaultRegime: "F_P"
    },
    module,
    queryDomain,
    workerAttachment: projectSdlcWorkerAttachment({
      transportContract: "process://node"
    })
  });
  assert.equal(start.kind, "sdlc_public_start_projected");
  return start;
}

function assessedEventForVector(basis, vector, index) {
  return {
    kind: "assessed",
    assessmentKind: "fp",
    edge: vector.name,
    obligationId: `preclosed-${index}`,
    publishedLedgerRef: `proof://preclosed/${index}`,
    actor: "test",
    specHash: `sha256:preclosed${index}`,
    manifestId: `manifest:preclosed:${index}`,
    workflowVersion: "t076-preclosed",
    runId: basis.runId,
    workKey: basis.workKey,
    selectedWorkerId: null,
    selectedBackend: null,
    roleId: null,
    authorityRef: null,
    assignmentSource: null,
    resolvedRuntimeRef: null
  };
}

function preclosedEventsBeforeEdge(basis, edgeName) {
  const targetIndex = basis.graph.vectors.findIndex(
    (vector) => vector.name === edgeName
  );
  assert.notEqual(targetIndex, -1, `${edgeName} vector must exist`);
  return Object.freeze(
    basis.graph.vectors
      .slice(0, targetIndex)
      .map((vector, index) => assessedEventForVector(basis, vector, index))
  );
}

function writeRetryAwareWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t076_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const hasPriorGap = manifest.retryContext.priorGapDossiers.length > 0;",
      "const output = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`, `retry_context: ${hasPriorGap}`].join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const tenantRelative = 'cdme-core/src/main/scala/cdme/Core.scala';",
      "const sourcePath = path.join(manifest.productMaterialization.tenantRoot, tenantRelative);",
      "mkdirSync(dirname(sourcePath), { recursive: true });",
      "const source = hasPriorGap ? 'package cdme\\nobject Core { val retryClosed = true }\\n' : 'package cdme\\nobject Core { val retryClosed = false }\\n';",
      "writeFileSync(sourcePath, source, 'utf8');",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "const relativePath = hasPriorGap ? tenantRelative : path.relative(manifest.workspaceRoot, sourcePath);",
      "const materializedFiles = [{ kind: 'sdlc_materialized_product_file', role: 'source', relativePath, absolutePath: sourcePath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8') }];",
      "const materializedRefs = materializedFiles.map((file) => `file://${file.absolutePath}`);",
      "const outputRef = `file://${manifest.outputFile}`;",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [outputRef, ...materializedRefs, ...obligation.evidenceRefs], blockingReasons: [] }));",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: outputDigest, summary: 'generated code surface with retry-aware materialization path basis', unresolvedReasons: [], materializedFiles, executionEvidence: null, obligationAssessments }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writeInstalledRetryWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t076_installed_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const hasPriorGap = manifest.retryContext.priorGapDossiers.length > 0;",
      "const output = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`, `retry_context: ${hasPriorGap}`].join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const materializedFiles = [];",
      "if (manifest.productMaterialization.required) {",
      "  const role = manifest.targetAssetType === 'test_module_surface' ? 'test' : 'source';",
      "  const tenantRelative = role === 'test' ? 'cdme-core/src/test/scala/cdme/CoreSpec.scala' : 'cdme-core/src/main/scala/cdme/Core.scala';",
      "  const productPath = path.join(manifest.productMaterialization.tenantRoot, tenantRelative);",
      "  mkdirSync(dirname(productPath), { recursive: true });",
      "  const capabilityMarkers = manifest.conformedProject.capabilityContracts.map((contract) => `${contract.name} ${contract.value}`).join(' ');",
      "  const source = role === 'test' ? 'package cdme\\nclass CoreSpec\\n' : `package cdme\\nobject Core { val retryClosed = ${hasPriorGap}; val capabilityMarkers = \"${capabilityMarkers}\" }\\n`;",
      "  writeFileSync(productPath, source, 'utf8');",
      "  const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "  const relativePath = manifest.targetAssetType === 'code_surface' && !hasPriorGap ? path.relative(manifest.workspaceRoot, productPath) : tenantRelative;",
      "  materializedFiles.push({ kind: 'sdlc_materialized_product_file', role, relativePath, absolutePath: productPath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8') });",
      "}",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "const materializedRefs = materializedFiles.map((file) => `file://${file.absolutePath}`);",
      "const outputRef = `file://${manifest.outputFile}`;",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [outputRef, ...materializedRefs, ...obligation.evidenceRefs], blockingReasons: [] }));",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: outputDigest, summary: 'installed data_mapper retry-aware worker output', unresolvedReasons: [], materializedFiles, executionEvidence: null, obligationAssessments }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

test("T-076 postflight failure enters ABG retry truth and next handoff carries prior gap", async () => {
  const workspace = makeWorkspace();
  const start = makeStart(workspace);
  const basis = start.executionContract.basis;
  const codeIndex = basis.graph.vectors.findIndex(
    (vector) => vector.name === "derive_code_surface"
  );
  assert(codeIndex > 0);
  const preclosedEvents = preclosedEventsBeforeEdge(basis, "derive_code_surface");
  const workerScript = writeRetryAwareWorkerScript(workspace);
  const workerTransport = `process://node?script=${encodeURIComponent(workerScript)}`;

  const first = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport,
    replayEvents: preclosedEvents
  });

  assert.equal(first.status, "postflight_failed");
  assert.equal(first.postflight.status, "blocked");
  assert.equal(first.gapDossier.status, "open");
  const firstMaterializationLedger = deriveMaterializationAssuranceLedger({
    manifest: first.manifest,
    report: first.workerReport,
    postflight: first.postflight
  });
  const firstObligationLedger = deriveObligationCarryAssuranceLedger({
    manifest: first.manifest,
    currentGapDossier: first.gapDossier
  });
  const firstSatisfaction = foldSdlcAssuranceLedgers({
    requiredDimensions: ["materialization", "obligation_carry"],
    ledgers: [firstMaterializationLedger, firstObligationLedger]
  });
  assert.equal(firstSatisfaction.status, "blocked");
  assert.deepStrictEqual(firstSatisfaction.retryHandoff.reasonCodes, [
    "materialized_product_relative_path_mismatch"
  ]);
  assert.deepStrictEqual(
    first.gapDossier.reasons.map((reason) => reason.reason),
    ["materialized_product_relative_path_mismatch"]
  );
  assert.deepStrictEqual(
    first.gapDossier.reasons.map((reason) => reason.reasonClass),
    ["contract_violation"]
  );
  assert.deepStrictEqual(first.emittedRuntimeEventKinds, [
    "graph_call_opened",
    "frame_opened",
    "vector_traversal_planned",
    "vector_evaluated",
    "retry_repair_planned",
    "retry_attempt_opened",
    "continuation_terminated",
    "continuation_reopened"
  ]);
  assert.equal(first.summary.nextLawfulAction, "retry_same_edge_with_gap_dossier");

  const failureEvents = await readOddSdlcRuntimeEvents(workspace);
  const afterFailure = projectSdlcGapsFromReplay({
    basis,
    events: Object.freeze([...preclosedEvents, ...failureEvents])
  });
  assert.equal(afterFailure.currentEdge, "derive_code_surface");
  assert.equal(afterFailure.closedVectorIndexes.includes(codeIndex), false);

  const second = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport,
    replayEvents: Object.freeze([...preclosedEvents, ...failureEvents])
  });

  assert.equal(second.status, "worker_invoked");
  assert.equal(second.postflight.status, "passed");
  assert.equal(second.manifest.retryContext.priorGapDossiers.length, 1);
  assert.equal(second.manifest.traversalIntentPackage.priorGapDossierRefs.length, 1);
  assert(
    second.manifest.traversalIntentPackage.obligationIds.includes(
      "prior_gap:materialized_product_relative_path_mismatch"
    )
  );
  assert.equal(
    second.manifest.retryContext.priorGapDossiers[0].reasons[0].reason,
    "materialized_product_relative_path_mismatch"
  );
  assert.equal(
    second.workerReport.materializedFiles[0].relativePath,
    "cdme-core/src/main/scala/cdme/Core.scala"
  );
  const secondMaterializationLedger = deriveMaterializationAssuranceLedger({
    manifest: second.manifest,
    report: second.workerReport,
    postflight: second.postflight
  });
  const secondObligationLedger = deriveObligationCarryAssuranceLedger({
    manifest: second.manifest,
    currentGapDossier: null,
    closedReasonCodes: ["materialized_product_relative_path_mismatch"]
  });
  const secondSatisfaction = foldSdlcAssuranceLedgers({
    requiredDimensions: ["materialization", "obligation_carry"],
    ledgers: [secondMaterializationLedger, secondObligationLedger]
  });
  assert.equal(secondSatisfaction.status, "close_allowed");

  const finalEvents = await readOddSdlcRuntimeEvents(workspace);
  const afterSecond = projectSdlcGapsFromReplay({
    basis,
    events: Object.freeze([...preclosedEvents, ...finalEvents])
  });
  assert.equal(afterSecond.closedVectorIndexes.includes(codeIndex), true);
  assert.notEqual(afterSecond.currentEdge, "derive_code_surface");
});

test("T-076 installed data_mapper successor re-enters failed code edge from event truth", async () => {
  const workspace = freshDataMapperWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t076"
  });
  assert.equal(install.kind, "installed");
  const initialState = deriveSdlcInstalledQualificationInitialState({
    workspaceRoot: workspace
  });
  assert.equal(initialState.status, "valid");

  const commandPath = installedOddSdlcCommand(install);
  const workerScript = writeInstalledRetryWorkerScript(workspace);
  const workerTransport = `process://node?script=${encodeURIComponent(workerScript)}`;
  const target = "graph_function:bootstrap_release_self_test";

  for (let guard = 0; guard < 20; guard += 1) {
    const gaps = runInstalledOddSdlc(commandPath, ["gaps", "--workspace", workspace], workspace);
    if (gaps.projection.currentEdge === "derive_code_surface") {
      break;
    }
    if (gaps.projection.currentEdge === FG_CONFORM_PROJECT) {
      const induction = runInstalledOddSdlc(
        commandPath,
        ["start", "--workspace", workspace, "--until", "blocked"],
        workspace
      );
      assert.equal(induction.status, "converged");
      assert.equal(induction.summary.currentEdge, FG_CONFORM_PROJECT);
      continue;
    }
    const start = runInstalledOddSdlc(
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
        workerTransport
      ],
      workspace
    );
    assert.equal(start.status, "worker_invoked");
    assert.equal(start.postflight.status, "passed");
  }

  const beforeFailure = runInstalledOddSdlc(
    commandPath,
    ["gaps", "--workspace", workspace],
    workspace
  );
  assert.equal(beforeFailure.projection.currentEdge, "derive_code_surface");

  const failed = runInstalledOddSdlc(
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
      workerTransport
    ],
    workspace
  );
  assert.equal(failed.status, "postflight_failed");
  assert.equal(failed.postflight.status, "blocked");
  assert.deepStrictEqual(failed.gapDossier.reasons.map((reason) => reason.reason), [
    "materialized_product_relative_path_mismatch"
  ]);
  assert.deepStrictEqual(failed.emittedRuntimeEventKinds, [
    "graph_call_opened",
    "frame_opened",
    "vector_traversal_planned",
    "vector_evaluated",
    "retry_repair_planned",
    "retry_attempt_opened",
    "continuation_terminated",
    "continuation_reopened"
  ]);

  const afterFailure = runInstalledOddSdlc(
    commandPath,
    ["gaps", "--workspace", workspace],
    workspace
  );
  assert.equal(afterFailure.projection.currentEdge, "derive_code_surface");

  const repaired = runInstalledOddSdlc(
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
      workerTransport
    ],
    workspace
  );
  assert.equal(repaired.status, "worker_invoked");
  assert.equal(repaired.postflight.status, "passed");
  assert.equal(repaired.manifest.retryContext.priorGapDossiers.length, 1);
  assert.equal(repaired.manifest.traversalIntentPackage.priorGapDossierRefs.length, 1);
  assert(
    repaired.manifest.traversalIntentPackage.obligationIds.includes(
      "prior_gap:materialized_product_relative_path_mismatch"
    )
  );
  assert.equal(
    repaired.workerReport.materializedFiles[0].relativePath,
    "cdme-core/src/main/scala/cdme/Core.scala"
  );
  assert.equal(
    existsSync(
      path.join(
        workspace,
        "build_tenants/scala_spark/cdme-core/src/main/scala/cdme/Core.scala"
      )
    ),
    true
  );

  const afterRepair = runInstalledOddSdlc(
    commandPath,
    ["gaps", "--workspace", workspace],
    workspace
  );
  assert.notEqual(afterRepair.projection.currentEdge, "derive_code_surface");
  assert(readFileSync(path.join(workspace, ".ai-workspace/events/events.jsonl"), "utf8").trim().length > 0);
});
