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
    "```text",
    "component dependency graph prose can appear before the typed carrier",
    "```",
    "",
    "```json component_depth_register",
    JSON.stringify(register, null, 2),
    "```",
    ""
  ].join("\n");
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, content, "utf8");
  return { outputFile, content };
}

function writeComponentTopologyArtifact(register) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t113-topology-"));
  const outputFile = path.join(root, "implementation_component_topology_surface.md");
  const content = [
    "# implementation_component_topology_surface",
    "",
    "```json",
    JSON.stringify(register, null, 2),
    "```",
    ""
  ].join("\n");
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, content, "utf8");
  return { outputFile, content };
}

function writeTestTopologyArtifact(register) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t113-test-topology-"));
  const outputFile = path.join(root, "test_component_topology_surface.md");
  const content = [
    "# test_component_topology_surface",
    "",
    "```json component_depth_register",
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
    registerVersion: "ts-component-depth-v1",
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

test("B-084 admits metadata-rich worker component realization schedules after prose fences", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_realization_schedule_surface",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_realization_schedule_surface",
    vectorIndex: 14,
    moduleDependencyGraph: {
      nodes: ["cmp.compiler.ir"],
      edges: []
    },
    componentRealizationRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId: "cmp.compiler.ir",
        moduleName: "cdme-compiler",
        relativePath: "cdme-compiler/src/main/scala/cdme/compiler/ir/",
        publicBoundary: "package_internal",
        firstProductFileToChange:
          "cdme-compiler/src/main/scala/cdme/compiler/ir/package.scala",
        trancheId: "T1.foundation_ir",
        realizationOrder: 1,
        upstreamComponentIds: [],
        publishesSurfaces: [],
        sourceAssetRefs: ["asset://implementation_component_topology_surface"],
        requirementIds: ["REQ-TYP-001"]
      }
    ]
  };
  const { outputFile } = writeScheduleArtifact(register);

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_realization_schedule_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.componentRealizationRows.length, 1);
  assert.equal(
    admission.register.componentRealizationRows[0].firstProductFileToChange,
    "cdme-compiler/src/main/scala/cdme/compiler/ir/package.scala"
  );
});

test("B-084 admits metadata-rich worker component topology registers", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "implementation_component_topology_surface",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_implementation_component_topology_surface",
    vectorIndex: 12,
    featureScopeRef:
      "scope://odd_sdlc/implementation-component-topology-surface/steel-thread/cdme-compiler",
    includedModuleNames: ["cdme-compiler"],
    deferredModuleNames: ["cdme-assurance"],
    activeTenant: "scala_spark",
    relativePathBasis: "tenant_root",
    componentTopologyRows: [
      {
        kind: "sdlc_component_topology_row",
        componentId: "cmp.compiler.api",
        moduleName: "cdme-compiler",
        relativePath: "cdme-compiler/src/main/scala/cdme/compiler/api/",
        publicBoundary: "module_public",
        publicSymbols: ["compile"],
        concernRole: "io_adapter",
        concern: "public_boundary_orchestration",
        domainCarrier: null,
        adapter: "orchestration_entry_adapter",
        stateful: true,
        operations: ["compile"],
        sourceAssetRefs: ["asset://implementation_module_surface"],
        requirementIds: ["REQ-AI-001"]
      },
      {
        kind: "sdlc_component_topology_row",
        componentId: "cmp.compiler.parse",
        moduleName: "cdme-compiler",
        relativePath: "cdme-compiler/src/main/scala/cdme/compiler/parse/",
        publicBoundary: "package_internal",
        concernRole: "parser",
        concern: "parsing",
        domainCarrier: "surface_binding",
        adapter: null,
        sourceAssetRefs: ["asset://implementation_module_surface"],
        requirementIds: ["REQ-TYP-001"]
      }
    ]
  };
  const { outputFile } = writeComponentTopologyArtifact(register);

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "implementation_component_topology_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.componentTopologyRows.length, 2);
  assert.equal(admission.register.componentTopologyRows[0].kind, "sdlc_component_topology_row");
  assert.equal(admission.register.componentTopologyRows[0].concernRole, "io_adapter");
  assert.equal(admission.register.componentTopologyRows[1].concernRole, "parser");
});

test("B-084 admits metadata-rich worker test component topology rows", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "test_component_topology_surface",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_test_component_topology_surface",
    vectorIndex: 21,
    testComponentTopologyRows: [
      {
        kind: "sdlc_test_component_topology_row",
        testClassId: "tc.compiler.api.compile-happy-path",
        moduleName: "cdme-compiler",
        relativePath:
          "cdme-compiler/src/test/scala/cdme/compiler/api/CompilerSpec.scala",
        testKind: "unit",
        executionShard: "sbt:test",
        testcaseIds: ["TC-COMPILER-001"],
        coveredComponentIds: ["cmp.compiler.api"],
        requirementIds: ["REQ-AI-001"]
      }
    ]
  };
  const { outputFile } = writeTestTopologyArtifact(register);

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "test_component_topology_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.testComponentTopologyRows.length, 1);
  assert.equal(
    admission.register.testComponentTopologyRows[0].shardId,
    "sbt:test"
  );
});
