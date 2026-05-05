// Validates: T-113

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
  sha256Text
} from "../../build/semantic/code/src/index.js";

function writeScheduleArtifact(register) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t113-schedule-"));
  const outputFile = path.join(root, "component_realization_schedule_surface.md");
  const content = [
    "# component_realization_schedule_surface",
    "",
    "The schedule is intentionally production-shaped and includes tranche metadata.",
    "",
    "```component_depth_register",
    JSON.stringify(register, null, 2),
    "```",
    ""
  ].join("\n");
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, content, "utf8");
  return { outputFile, content };
}

function reportFor(outputFile, content) {
  return {
    kind: "odd_sdlc.worker_result_report",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_realization_schedule_surface",
    targetAssetType: "component_realization_schedule_surface",
    outputFile,
    digest: sha256Text(content),
    summary: "T-113 schedule admission fixture",
    unresolvedReasons: [],
    materializedFiles: [],
    executionEvidence: null,
    executionEvidenceErrors: [],
    obligationAssessments: []
  };
}

test("T-113 admits production-shaped component realization schedule registers", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-realization-v1",
    targetAssetType: "component_realization_schedule_surface",
    componentRealizationRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId: "C-2-3",
        moduleName: "cdme-adjoint",
        trancheId: "T-1",
        relativePath: "modules/cdme-adjoint/src/main/scala/cdme/adjoint/BackwardTraversalPlanner.scala",
        firstProductFileToChange: "modules/cdme-adjoint/src/main/scala/cdme/adjoint/BackwardTraversalPlanner.scala",
        upstreamComponentIds: ["C-2-1", "C-2-2", "C-0-1"],
        requirementIds: ["REQ-ADJ-004", "REQ-BT-001"],
        sourceAssetRefs: [
          "implementation_component_topology_surface:C-2-3",
          "implementation_design_surface:I-2",
          "implementation_module_surface:M-2:cdme-adjoint"
        ]
      }
    ]
  };
  const { outputFile, content } = writeScheduleArtifact(register);

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_realization_schedule_surface",
    outputFile
  });
  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.registerVersion, "ts-component-depth-v1");
  assert.equal(admission.register.componentRealizationRows.length, 1);
  assert.equal(admission.register.componentRealizationRows[0].publicBoundary, admission.register.componentRealizationRows[0].firstProductFileToChange);
  assert.deepEqual(admission.register.componentRealizationRows[0].upstreamComponentIds, ["C-2-1", "C-2-2", "C-0-1"]);

  const ledger = deriveComponentDepthAssuranceLedger({
    manifest: {
      targetAssetType: "component_realization_schedule_surface"
    },
    report: reportFor(outputFile, content)
  });
  assert(ledger);
  assert.equal(ledger.reasons.length, 0);
});
