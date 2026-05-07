// Validates: T-115

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  admitComponentDepthRegisterFromArtifact,
  constructPostflightGapDossier,
  deriveComponentDepthAssuranceLedger,
  deriveSdlcOperatorAssuranceGate,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  sha256Text
} from "../../build/semantic/code/src/index.js";

function workspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t115-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(path.join(root, "README.md"), "# T-115\n", "utf8");
  writeFileSync(path.join(root, "specification/INTENT.md"), "# Intent\n", "utf8");
  writeFileSync(path.join(root, "specification/GOALS.md"), "# Goals\n", "utf8");
  writeFileSync(path.join(root, "specification/PRODUCT.md"), "# Product\n", "utf8");
  writeFileSync(
    path.join(root, "specification/requirements/01-t115.md"),
    "REQ-T115-001: Failed governed test execution is routed to component repair schedule truth.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t115_repair_flow",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark/",
      "    language: Scala",
      "    build_tool: sbt",
      "    test_runner: sbt test"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/TENANT_REGISTRY.md"),
    "# Tenant Registry\n\n- scala_spark\n",
    "utf8"
  );
  return root;
}

function manifest(root, edgeName) {
  return deriveWorkerHandoffManifest({
    workspaceRoot: root,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName,
    vectorIndex: 0,
    contract: hookContractByEdgeName(edgeName)
  });
}

function reportFor(manifest, output) {
  return {
    kind: "odd_sdlc.worker_result_report",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile,
    digest: sha256Text(output),
    summary: "T-115 typed repair-flow fixture",
    unresolvedReasons: [],
    materializedFiles: [],
    executionEvidence: null,
    executionEvidenceErrors: [],
    obligationAssessments: []
  };
}

function fulfilledObligationAssessments(manifest, evidenceRefs) {
  return manifest.traversalObligationContext.obligations.map((obligation) => ({
    kind: "sdlc_worker_obligation_assessment",
    obligationId: obligation.obligationId,
    fulfillmentStatus: "fulfilled",
    evidenceRefs,
    blockingReasons: []
  }));
}

function writeRegister(manifest, register) {
  const output = [
    `# ${manifest.targetAssetType}`,
    "",
    "```component_depth_register",
    JSON.stringify(register, null, 2),
    "```",
    ""
  ].join("\n");
  mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, output, "utf8");
  return output;
}

const failedQualificationRow = Object.freeze({
  kind: "sdlc_component_test_qualification_row",
  testClassId: "CoreSpec",
  testcaseIds: ["TC-DM-001"],
  componentIds: ["cdme-core"],
  requirementIds: ["REQ-T115-001"],
  status: "failed",
  evidenceRefs: ["artifact://test-execution/core"]
});

const failureRow = Object.freeze({
  kind: "sdlc_component_execution_failure_row",
  failureId: "failure://cdme-core/CoreSpec/TC-DM-001",
  shardId: "test-shard-01-core",
  moduleName: "cdme-core",
  testClassId: "CoreSpec",
  testcaseIds: ["TC-DM-001"],
  componentIds: ["cdme-core"],
  requirementIds: ["REQ-T115-001"],
  failureKind: "assertion_failure",
  repairTarget: "component_code",
  lawfulReentryPoint: "repair_component_realization",
  attributionConfidence: "high",
  sourceRefs: ["build_tenants/scala_spark/cdme-core/src/main/scala/cdme/Core.scala"],
  testRefs: ["build_tenants/scala_spark/cdme-core/src/test/scala/cdme/CoreSpec.scala"],
  evidenceRefs: ["artifact://test-execution/core"]
});

test("T-115 admits failed component execution when failure attribution is typed", () => {
  const root = workspace();
  const handoff = manifest(root, "qualify_component_test_execution_surface");
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_test_qualification_surface",
    componentTestQualificationRows: [failedQualificationRow],
    componentExecutionFailureRegister: {
      kind: "component_execution_failure_register",
      registerVersion: "ts-component-depth-v1",
      failureRows: [failureRow]
    }
  };
  const output = writeRegister(handoff, register);
  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: handoff.targetAssetType,
    outputFile: handoff.outputFile
  });
  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.componentExecutionFailureRegister.failureRows.length, 1);

  const ledger = deriveComponentDepthAssuranceLedger({
    manifest: handoff,
    report: reportFor(handoff, output)
  });
  assert(ledger);
  assert(!ledger.reasons.some((reason) =>
    reason.code.startsWith("component_execution_failure_unattributed")
  ));
});

test("T-115 admits compile-failure qualification carrier as repair input", () => {
  const root = workspace();
  const handoff = manifest(root, "qualify_component_test_execution_surface");
  const output = writeRegister(handoff, {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_test_qualification_surface",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "qualify_component_test_execution_surface",
    vectorIndex: 27,
    componentTestQualificationRows: [
      {
        kind: "sdlc_component_test_qualification_row",
        testClassId: "DiagnosticsFinalizeSpec",
        testcaseIds: ["TC-DM-DIAG-001"],
        componentIds: ["cdme-diagnostics"],
        requirementIds: ["REQ-T115-001"],
        status: "failed",
        evidenceRefs: ["artifact://test-execution/cdme-compiler"]
      },
      {
        kind: "sdlc_component_test_qualification_row",
        testClassId: "ApiCompileSpec",
        testcaseIds: ["TC-DM-API-001"],
        componentIds: ["cdme-api"],
        requirementIds: ["REQ-T115-001"],
        status: "blocked",
        evidenceRefs: ["artifact://test-execution/cdme-compiler"]
      }
    ],
    componentExecutionFailureRegister: {
      kind: "component_execution_failure_register",
      registerVersion: "ts-component-depth-v1",
      shardId: "test-shard-01-cdme-compiler",
      moduleName: "cdme-compiler",
      failureRows: [
        {
          kind: "sdlc_component_execution_failure_row",
          failureId: "failure://cdme-compiler/DiagnosticsFinalizeSpec",
          shardId: "test-shard-01-cdme-compiler",
          moduleName: "cdme-compiler",
          testClassId: "DiagnosticsFinalizeSpec",
          testcaseIds: ["TC-DM-DIAG-001"],
          componentIds: ["cdme-diagnostics"],
          requirementIds: ["REQ-T115-001"],
          failureKind: "test_compile_error",
          failureDetail: "test compile failed before execution",
          repairTarget:
            "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala",
          lawfulReentryPoint: "realization_refactor",
          attributionConfidence: "high",
          sourceRefs: [
            "build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/diagnostics/CompileDiagnostic.scala"
          ],
          testRefs: [
            "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala"
          ],
          evidenceRefs: ["artifact://test-execution/cdme-compiler"]
        }
      ],
      blockedTestClassIds: ["ApiCompileSpec"]
    }
  });

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: handoff.targetAssetType,
    outputFile: handoff.outputFile
  });
  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.registerVersion, "ts-component-depth-v1");
  assert.equal(admission.register.componentTestQualificationRows[1].status, "blocked");
  assert.equal(
    admission.register.componentExecutionFailureRegister.failureRows[0].failureKind,
    "test_compile_error"
  );
  assert.equal(
    admission.register.componentExecutionFailureRegister.failureRows[0].repairTarget,
    "component_test"
  );

  const ledger = deriveComponentDepthAssuranceLedger({
    manifest: handoff,
    report: reportFor(handoff, output)
  });
  assert(ledger);
  assert.equal(ledger.reasons.length, 0);
});

test("T-115 rejects failed component execution without typed attribution", () => {
  const root = workspace();
  const handoff = manifest(root, "qualify_component_test_execution_surface");
  const output = writeRegister(handoff, {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_test_qualification_surface",
    componentTestQualificationRows: [failedQualificationRow]
  });

  const ledger = deriveComponentDepthAssuranceLedger({
    manifest: handoff,
    report: reportFor(handoff, output)
  });
  assert(ledger);
  assert(ledger.reasons.some((reason) =>
    reason.code === "component_execution_failure_unattributed:CoreSpec"
  ));
});

test("T-115 admits a bounded component repair schedule carrier", () => {
  const root = workspace();
  const handoff = manifest(root, "derive_component_repair_schedule_surface");
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_repair_schedule_surface",
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "repair_required",
      repairRows: [
        {
          kind: "sdlc_component_repair_schedule_row",
          scheduleId: "repair://cdme-core/CoreSpec/TC-DM-001",
          failureId: failureRow.failureId,
          repairTarget: "component_code",
          lawfulReentryPoint: "repair_component_realization",
          attributionConfidence: "high",
          testcaseIds: failureRow.testcaseIds,
          componentIds: failureRow.componentIds,
          requirementIds: failureRow.requirementIds,
          sourceRefs: failureRow.sourceRefs,
          testRefs: failureRow.testRefs,
          evidenceRefs: failureRow.evidenceRefs
        }
      ],
      evidenceRefs: ["artifact://test-execution/core"]
    }
  };
  const output = writeRegister(handoff, register);
  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: handoff.targetAssetType,
    outputFile: handoff.outputFile
  });
  assert.equal(admission.status, "admitted");

  const ledger = deriveComponentDepthAssuranceLedger({
    manifest: handoff,
    report: reportFor(handoff, output)
  });
  assert(ledger);
  assert.equal(ledger.reasons.length, 0);
});

test("T-115 routes unbound repair schedule rows back to worker-output repair", () => {
  const root = workspace();
  const handoff = manifest(root, "derive_component_repair_schedule_surface");
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_repair_schedule_surface",
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "repair_required",
      repairRows: [
        {
          kind: "sdlc_component_repair_schedule_row",
          scheduleId: "repair:cdme-compiler:module-build-definition",
          failureId: "gap:previous-worker-output",
          repairTarget: "component_test",
          lawfulReentryPoint: "repair_component_test",
          attributionConfidence: "high",
          testcaseIds: [],
          componentIds: ["cdme-compiler"],
          requirementIds: [],
          sourceRefs: [],
          testRefs: [],
          evidenceRefs: ["artifact://component-repair-schedule/unbound-row"]
        }
      ],
      evidenceRefs: ["artifact://component-repair-schedule"]
    }
  };
  const output = writeRegister(handoff, register);
  const outputRef = `file://${handoff.outputFile}`;
  const report = {
    ...reportFor(handoff, output),
    obligationAssessments: fulfilledObligationAssessments(handoff, [outputRef])
  };
  const gate = deriveSdlcOperatorAssuranceGate({
    manifest: handoff,
    report,
    postflight: {
      kind: "sdlc_operator_postflight_result",
      status: "passed",
      blockingReasons: [],
      blockingReasonCarriers: [],
      evidenceRefs: [outputRef]
    }
  });

  assert(gate.blockingPostflight);
  const reason = gate.blockingPostflight.blockingReasonCarriers.find(
    (carrier) =>
      carrier.detail ===
      "component_repair_schedule_unbound:repair:cdme-compiler:module-build-definition"
  );
  assert(reason);
  assert.equal(reason.lawfulReentryPoint, "repair_worker_output");

  const dossier = constructPostflightGapDossier({
    manifest: handoff,
    postflight: gate.blockingPostflight
  });
  assert.equal(dossier.retryEligible, true);
  assert.deepEqual(dossier.nextLawfulActions, ["repair_worker_output"]);
});

test("T-115 admits repair schedule carrier with repair-target paths", () => {
  const root = workspace();
  const handoff = manifest(root, "derive_component_repair_schedule_surface");
  const output = writeRegister(handoff, {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_repair_schedule_surface",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_repair_schedule_surface",
    vectorIndex: 28,
    moduleName: "cdme-compiler",
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "repair_required",
      scheduleSource:
        "asset://component_test_qualification_surface#componentExecutionFailureRegister",
      repairRows: [
        {
          kind: "sdlc_component_repair_schedule_row",
          scheduleId: "schedule.compiler.diagnostics.scalac.001",
          failureId: "fail.compiler.diagnostics.scalac.001",
          moduleName: "cdme-compiler",
          shardId: "test-shard-01-cdme-compiler",
          trancheId: "T-REPAIR-1",
          repairTarget:
            "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala",
          lawfulReentryPoint: "realization_refactor",
          attributionConfidence: "high",
          testcaseIds: ["TC-DM-DIAG-001"],
          componentIds: ["cdme-diagnostics"],
          requirementIds: ["REQ-T115-001"],
          sourceRefs: [
            "build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/diagnostics/CompileDiagnostic.scala"
          ],
          testRefs: [
            "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala"
          ],
          evidenceRefs: [
            "asset://component_test_qualification_surface#componentExecutionFailureRegister/failureRows/fail.compiler.diagnostics.scalac.001"
          ],
          repairKind: "fix_test_source_to_match_realized_diagnostic_api"
        }
      ],
      triageGaps: []
    }
  });

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: handoff.targetAssetType,
    outputFile: handoff.outputFile
  });
  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.kind, "sdlc_component_depth_register");
  assert.equal(
    admission.register.componentRepairSchedule.repairRows[0].repairTarget,
    "component_test"
  );
  assert.deepEqual(admission.register.componentRepairSchedule.evidenceRefs, [
    "asset://component_test_qualification_surface#componentExecutionFailureRegister/failureRows/fail.compiler.diagnostics.scalac.001"
  ]);

  const ledger = deriveComponentDepthAssuranceLedger({
    manifest: handoff,
    report: reportFor(handoff, output)
  });
  assert(ledger);
  assert.equal(ledger.reasons.length, 0);
});

test("T-115 admits release-depth parity carrier as blocked repair pressure", () => {
  const root = workspace();
  const handoff = manifest(root, "derive_release_depth_parity_surface");
  const output = writeRegister(handoff, {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "release_depth_parity_surface",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_release_depth_parity_surface",
    vectorIndex: 31,
    releaseDepthParity: {
      kind: "sdlc_release_depth_parity_assessment",
      status: "blocked",
      scope: "release_surface",
      blockerCodes: [
        "shard_compile_failed_no_test_evidence",
        "blocked_test_classes_have_no_pass_evidence"
      ],
      blockerDetail: "test shard failed at test_compile",
      decisionBasis: [
        "schedule://odd_sdlc/derive_release_depth_parity_surface/primary"
      ],
      metPrecondition: false,
      repricedRequested: false
    }
  });

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: handoff.targetAssetType,
    outputFile: handoff.outputFile
  });
  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.registerVersion, "ts-component-depth-v1");
  assert.equal(admission.register.releaseDepthParity.status, "blocked");
  assert.deepEqual(admission.register.releaseDepthParity.blockingReasons, [
    "shard_compile_failed_no_test_evidence",
    "blocked_test_classes_have_no_pass_evidence"
  ]);

  const ledger = deriveComponentDepthAssuranceLedger({
    manifest: handoff,
    report: reportFor(handoff, output)
  });
  assert(ledger);
  assert(
    ledger.reasons.some((reason) => reason.code === "release_depth_parity_blocked")
  );
});

test("B-085 release-depth parity repair rows route to repair worker output", () => {
  const root = workspace();
  const handoff = manifest(root, "derive_release_depth_parity_surface");
  const output = writeRegister(handoff, {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "release_depth_parity_surface",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_release_depth_parity_surface",
    vectorIndex: 31,
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "repair_required",
      repairRows: [
        {
          kind: "sdlc_component_repair_schedule_row",
          scheduleId: "schedule.compiler.diagnostics.scalac.001",
          failureId: "fail.compiler.diagnostics.scalac.001",
          moduleName: "cdme-compiler",
          shardId: "test-shard-01-cdme-compiler",
          repairTarget:
            "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala",
          lawfulReentryPoint: "realization_refactor",
          attributionConfidence: "high",
          testcaseIds: ["TC-DM-DIAG-001"],
          componentIds: ["cdme-diagnostics"],
          requirementIds: ["REQ-T115-001"],
          sourceRefs: [
            "build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/diagnostics/CompileDiagnostic.scala"
          ],
          testRefs: [
            "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala"
          ],
          evidenceRefs: [
            "asset://component_test_qualification_surface#componentExecutionFailureRegister/failureRows/fail.compiler.diagnostics.scalac.001",
            "asset://test_execution_result_surface#shardEvidence/test-shard-01-cdme-compiler"
          ]
        }
      ],
      evidenceRefs: [
        "asset://component_test_qualification_surface#componentExecutionFailureRegister/failureRows/fail.compiler.diagnostics.scalac.001"
      ]
    },
    releaseDepthParity: {
      kind: "sdlc_release_depth_parity_assessment",
      status: "blocked",
      scope: "release_surface",
      blockerCodes: [
        "shard_compile_failed_no_test_evidence",
        "blocked_test_classes_have_no_pass_evidence"
      ],
      blockerDetail: "test shard failed at test_compile",
      decisionBasis: [
        "asset://component_repair_schedule_surface#componentRepairSchedule",
        "asset://test_execution_result_surface#shardEvidence/test-shard-01-cdme-compiler"
      ],
      metPrecondition: false,
      repricedRequested: false
    }
  });
  const outputRef = `file://${handoff.outputFile}`;
  const report = {
    ...reportFor(handoff, output),
    obligationAssessments: fulfilledObligationAssessments(handoff, [outputRef])
  };
  const gate = deriveSdlcOperatorAssuranceGate({
    manifest: handoff,
    report,
    postflight: {
      kind: "sdlc_operator_postflight_result",
      status: "passed",
      blockingReasons: [],
      blockingReasonCarriers: [],
      evidenceRefs: [outputRef]
    }
  });

  assert(gate.blockingPostflight);
  assert.equal(gate.blockingPostflight.status, "blocked");
  assert(
    gate.blockingPostflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "assurance_ledger_reason" &&
        reason.detail ===
          "component_repair_row_open:fail.compiler.diagnostics.scalac.001"
    )
  );

  const reentryPoints = gate.blockingPostflight.blockingReasonCarriers.map(
    (reason) => reason.lawfulReentryPoint
  );
  assert(reentryPoints.includes("repair_worker_output"));
  assert(!reentryPoints.includes("same_edge_retry"));

  const dossier = constructPostflightGapDossier({
    manifest: handoff,
    postflight: gate.blockingPostflight
  });
  assert.deepEqual(dossier.nextLawfulActions, ["repair_worker_output"]);
  assert.equal(dossier.retryEligible, true);
  assert(
    dossier.reasons.every(
      (reason) => reason.blockingReason.lawfulReentryPoint === "repair_worker_output"
    )
  );
});
