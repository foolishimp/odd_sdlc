// Validates: T-115

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  admitComponentDepthRegisterFromArtifact,
  componentRepairReentryPlansForGapDossier,
  constructPostflightGapDossier,
  deriveComponentDepthAssuranceLedger,
  deriveSdlcOperatorAssuranceGate,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  sha256Text,
  writeInstalledOperatorOwnedEvaluationArtifact
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
  const output = `${JSON.stringify(register, null, 2)}\n`;
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
          repairTarget: "component_test",
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
      ]
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

test("T-171 keeps medium-confidence repair schedules inside the F_P schedule retry loop", () => {
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
          scheduleId: "repair:cdme-executor:spark-imports",
          failureId: "failure:execution-evidence:cdme-executor",
          repairTarget: "component_code",
          lawfulReentryPoint: "repair_component_realization",
          attributionConfidence: "medium",
          testcaseIds: ["TC-DM-EXEC-001"],
          componentIds: ["cdme-executor"],
          requirementIds: ["REQ-T115-001"],
          sourceRefs: [
            "build_tenants/scala_spark/cdme-executor/src/main/scala/cdme/executor/DataProfiler.scala"
          ],
          testRefs: [
            "build_tenants/scala_spark/cdme-executor/src/test/scala/cdme/executor/DataProfilerSpec.scala"
          ],
          evidenceRefs: ["artifact://test-execution/cdme-executor"]
        }
      ],
      evidenceRefs: ["artifact://component-repair-schedule"]
    }
  };
  const output = writeRegister(handoff, register);
  const outputRef = `file://${handoff.outputFile}`;
  const gate = deriveSdlcOperatorAssuranceGate({
    manifest: handoff,
    report: {
      ...reportFor(handoff, output),
      obligationAssessments: fulfilledObligationAssessments(handoff, [outputRef])
    },
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
      "component_repair_schedule_not_high_confidence:repair:cdme-executor:spark-imports"
  );
  assert(reason);
  assert.equal(reason.lawfulReentryPoint, "repair_worker_output");

  const dossier = constructPostflightGapDossier({
    manifest: handoff,
    postflight: gate.blockingPostflight
  });
  assert.equal(dossier.retryEligible, true);
  assert.deepEqual(dossier.nextLawfulActions, ["repair_worker_output"]);
  assert.equal(
    componentRepairReentryPlansForGapDossier({ manifest: handoff, dossier })
      .length,
    0,
    "medium-confidence schedule rows must re-enter the schedule transform, not source/test repair"
  );
});

test("T-115 admits repair schedule carrier with repair-target paths", () => {
  const root = workspace();
  const handoff = manifest(root, "derive_component_repair_schedule_surface");
  const output = writeRegister(handoff, {
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
          scheduleId: "schedule.compiler.diagnostics.scalac.001",
          failureId: "fail.compiler.diagnostics.scalac.001",
          repairTarget: "component_test",
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
          ]
        }
      ],
      evidenceRefs: [
        "asset://component_test_qualification_surface#componentExecutionFailureRegister/failureRows/fail.compiler.diagnostics.scalac.001"
      ]
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
    releaseDepthParity: {
      kind: "sdlc_release_depth_parity_assessment",
      status: "blocked",
      summary: "test shard failed at test_compile",
      blockingReasons: [
        "shard_compile_failed_no_test_evidence",
        "blocked_test_classes_have_no_pass_evidence"
      ],
      evidenceRefs: [
        "schedule://odd_sdlc/derive_release_depth_parity_surface/primary"
      ]
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
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "repair_required",
      repairRows: [
        {
          kind: "sdlc_component_repair_schedule_row",
          scheduleId: "schedule.compiler.diagnostics.scalac.001",
          failureId: "fail.compiler.diagnostics.scalac.001",
          repairTarget: "component_test",
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
      summary: "test shard failed at test_compile",
      blockingReasons: [
        "shard_compile_failed_no_test_evidence",
        "blocked_test_classes_have_no_pass_evidence"
      ],
      evidenceRefs: [
        "asset://component_repair_schedule_surface#componentRepairSchedule",
        "asset://test_execution_result_surface#shardEvidence/test-shard-01-cdme-compiler"
      ]
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

test("B-085 release-depth parity consumes source repair schedule without duplicate carrier copy", () => {
  const root = workspace();
  const scheduleHandoff = manifest(root, "derive_component_repair_schedule_surface");
  const scheduleOutput = writeRegister(scheduleHandoff, {
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
          scheduleId: "schedule.compiler.diagnostics.scalac.001",
          failureId: "fail.compiler.diagnostics.scalac.001",
          repairTarget: "component_test",
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
          evidenceRefs: ["asset://test_execution_result_surface#shardEvidence/test-shard-01-cdme-compiler"]
        }
      ],
      evidenceRefs: ["asset://test_execution_result_surface#shardEvidence/test-shard-01-cdme-compiler"]
    }
  });
  assert.equal(
    admitComponentDepthRegisterFromArtifact({
      targetAssetType: scheduleHandoff.targetAssetType,
      outputFile: scheduleHandoff.outputFile
    }).status,
    "admitted"
  );

  const releaseHandoff = manifest(root, "derive_release_depth_parity_surface");
  const releaseOutput = writeRegister(releaseHandoff, {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "release_depth_parity_surface",
    releaseDepthParity: {
      kind: "sdlc_release_depth_parity_assessment",
      status: "blocked",
      summary: "component repair schedule is still repair_required",
      blockingReasons: ["blocked_test_classes_have_no_pass_evidence"],
      evidenceRefs: [
        `file://${scheduleHandoff.outputFile}`,
        "asset://test_execution_result_surface#shardEvidence/test-shard-01-cdme-compiler"
      ]
    }
  });
  const releaseOutputRef = `file://${releaseHandoff.outputFile}`;
  const gate = deriveSdlcOperatorAssuranceGate({
    manifest: releaseHandoff,
    report: {
      ...reportFor(releaseHandoff, releaseOutput),
      obligationAssessments: fulfilledObligationAssessments(releaseHandoff, [
        releaseOutputRef,
        `file://${scheduleHandoff.outputFile}`
      ])
    },
    postflight: {
      kind: "sdlc_operator_postflight_result",
      status: "passed",
      blockingReasons: [],
      blockingReasonCarriers: [],
      evidenceRefs: [releaseOutputRef, `file://${scheduleHandoff.outputFile}`]
    }
  });
  assert(gate.blockingPostflight);
  assert(
    gate.blockingPostflight.blockingReasonCarriers.some(
      (reason) =>
        reason.detail ===
        "component_repair_row_open:fail.compiler.diagnostics.scalac.001"
    )
  );

  const dossier = constructPostflightGapDossier({
    manifest: releaseHandoff,
    postflight: gate.blockingPostflight
  });
  deriveWorkerHandoffManifest({
    workspaceRoot: root,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_test_surface",
    vectorIndex: 23,
    contract: hookContractByEdgeName("derive_component_test_surface"),
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [dossier]
    },
    runId: "t115-source-schedule-reentry"
  });
  const plans = componentRepairReentryPlansForGapDossier({
    manifest: releaseHandoff,
    dossier
  });
  assert.equal(plans.length, 1);
  assert.equal(
    plans[0].targetEdgeName,
    "derive_component_test_surface"
  );
  assert.equal(
    plans[0].failureId,
    "fail.compiler.diagnostics.scalac.001"
  );
  assert.equal(sha256Text(scheduleOutput).length, 71);
});

test("T-173 release-depth parity retires stale repair schedule after newer passing execution", () => {
  const root = workspace();
  const scheduleHandoff = manifest(root, "derive_component_repair_schedule_surface");
  writeRegister(scheduleHandoff, {
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
          scheduleId: "schedule.compiler.diagnostics.scalac.001",
          failureId: "fail.compiler.diagnostics.scalac.001",
          repairTarget: "component_code",
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
          evidenceRefs: ["asset://test_execution_result_surface#stale-failure"]
        }
      ],
      evidenceRefs: ["asset://test_execution_result_surface#stale-failure"]
    }
  });

  const executionHandoff = manifest(root, "derive_test_execution_result_surface");
  const executionEvidence = {
    kind: "sdlc_worker_execution_evidence",
    lane: "test",
    command: "sbt test",
    status: "succeeded",
    reportRefs: [`file://${executionHandoff.archiveRoot}/installed_operator_execution/passed.summary.json`],
    testsObserved: 1,
    passedCount: 1,
    failedCount: 0,
    shardEvidence: [
      {
        kind: "sdlc_worker_execution_shard_evidence",
        shardId: "test-shard-01-cdme-compiler",
        moduleName: "cdme-compiler",
        lane: "test",
        command: "sbt \"cdme-compiler/test\"",
        status: "succeeded",
        reportRefs: [`file://${executionHandoff.archiveRoot}/installed_operator_execution/passed.summary.json`],
        testsObserved: 1,
        passedCount: 1,
        failedCount: 0
      }
    ]
  };
  mkdirSync(path.dirname(executionHandoff.reportFile), { recursive: true });
  writeFileSync(
    path.join(executionHandoff.archiveRoot, "handoff_manifest.json"),
    `${JSON.stringify(executionHandoff, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(
    executionHandoff.reportFile,
    `${JSON.stringify({
      ...reportFor(executionHandoff, "# test_execution_result_surface\n"),
      projectionRole: "typed_fp_stage_projection",
      authoritativeStageResultRef: pathToFileURL(executionHandoff.fpEvaluateResultFile).href,
      executionEvidence,
      executionEvidenceErrors: []
    }, null, 2)}\n`,
    "utf8"
  );

  const releaseHandoff = manifest(root, "derive_release_depth_parity_surface");
  writeInstalledOperatorOwnedEvaluationArtifact({ manifest: releaseHandoff });

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: releaseHandoff.targetAssetType,
    outputFile: releaseHandoff.outputFile
  });
  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.componentRepairSchedule.scheduleStatus, "no_repair_required");
  assert.equal(admission.register.componentRepairSchedule.repairRows.length, 0);
  assert.equal(admission.register.releaseDepthParity.status, "met");

  const releaseOutput = readFileSync(releaseHandoff.outputFile, "utf8");
  const gate = deriveSdlcOperatorAssuranceGate({
    manifest: releaseHandoff,
    report: {
      ...reportFor(releaseHandoff, releaseOutput),
      obligationAssessments: fulfilledObligationAssessments(releaseHandoff, [
        `file://${releaseHandoff.outputFile}`
      ])
    },
    postflight: {
      kind: "sdlc_operator_postflight_result",
      status: "passed",
      blockingReasons: [],
      blockingReasonCarriers: [],
      evidenceRefs: [`file://${releaseHandoff.outputFile}`]
    }
  });
  assert.equal(gate.blockingPostflight, null);
});
