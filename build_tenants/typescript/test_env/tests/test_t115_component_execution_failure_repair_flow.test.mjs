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
  deriveComponentDepthAssuranceLedger,
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
