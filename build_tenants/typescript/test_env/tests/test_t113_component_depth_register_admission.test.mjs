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
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  promptForHandoff,
  sdlcTargetCarrierContractRef,
  sdlcTargetCarrierOutputKind,
  sha256Text
} from "../../build/semantic/code/src/index.js";

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t113-workspace-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(path.join(root, "README.md"), "# T-113 Fixture\n", "utf8");
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-T113: Prove component-depth carrier admission.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    "# Requirements\n\nREQ-T113-001: Materialized component files satisfy typed component rows.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t113_fixture",
      "active_tenant: scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark",
      "    language: scala",
      "    build_tool: sbt"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function writeArtifact(register, name = register.targetAssetType) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t113-"));
  const outputFile = path.join(root, `${name}.md`);
  const content = `${JSON.stringify(register, null, 2)}\n`;
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, content, "utf8");
  return { outputFile, content };
}

function componentDepthEdgeRefForTarget(targetAssetType) {
  switch (targetAssetType) {
    case "component_code_surface":
      return "derive_component_code_surface";
    case "component_realization_qualification_surface":
      return "qualify_component_realization_surface";
    case "component_test_surface":
      return "derive_component_test_surface";
    case "component_test_qualification_surface":
      return "qualify_component_test_execution_surface";
    case "component_repair_schedule_surface":
      return "derive_component_repair_schedule_surface";
    case "release_depth_parity_surface":
      return "derive_release_depth_parity_surface";
    default:
      throw new TypeError(`Unsupported component-depth target ${targetAssetType}`);
  }
}

function componentDepthTargetCarrierFor(register) {
  const edgeRef = componentDepthEdgeRefForTarget(register.targetAssetType);
  return {
    kind: sdlcTargetCarrierOutputKind(register.targetAssetType),
    targetAssetType: register.targetAssetType,
    edgeRef,
    contractRef: sdlcTargetCarrierContractRef({
      edgeRef,
      targetAssetType: register.targetAssetType
    }),
    contractDigest: sha256Text(JSON.stringify({
      edgeRef,
      targetAssetType: register.targetAssetType,
      payloadKind: register.kind
    })),
    payload: register
  };
}

function writeMarkdownCarrierArtifact(register, name = register.targetAssetType) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t113-"));
  const outputFile = path.join(root, `${name}.md`);
  const carrier = componentDepthTargetCarrierFor(register);
  const content = [
    `# ${name}`,
    "",
    "```json component_depth_register",
    JSON.stringify(carrier, null, 2),
    "```",
    ""
  ].join("\n");
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, content, "utf8");
  return { outputFile, content };
}

function writePlainFenceLabeledCarrierArtifact(register, name = register.targetAssetType) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t113-"));
  const outputFile = path.join(root, `${name}.md`);
  const carrier = componentDepthTargetCarrierFor(register);
  const content = [
    `# ${name}`,
    "",
    "```",
    "json component_depth_register",
    JSON.stringify(carrier, null, 2),
    "```",
    ""
  ].join("\n");
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, content, "utf8");
  return { outputFile, content };
}

function reportFor(outputFile, content, manifest, materializedFiles = []) {
  return {
    kind: "odd_sdlc.worker_result_report",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile,
    digest: sha256Text(content),
    summary: "T-113 component-depth admission fixture",
    unresolvedReasons: [],
    materializedFiles,
    materializationDiagnostics: [],
    executionEvidence: null,
    executionEvidenceErrors: [],
    obligationAssessments: [],
    fpTransformRequestRef: null,
    fpTransformResultRef: null,
    fpTransformStatusSnapshot: null,
    fpEvaluateResultRef: null
  };
}

function materializeSourceFile(manifest, relativePath, content) {
  const absolutePath = path.join(manifest.productMaterialization.tenantRoot, relativePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content, "utf8");
  return {
    kind: "sdlc_materialized_product_file",
    role: "source",
    relativePath,
    absolutePath,
    digest: sha256Text(content),
    byteCount: Buffer.byteLength(content, "utf8"),
    materializationSource: "current_attempt"
  };
}

function componentRow() {
  return {
    kind: "sdlc_component_realization_row",
    componentId: "cmp.compiler.ir",
    moduleName: "cdme-compiler",
    relativePath: "cdme-compiler/src/main/scala/cdme/compiler/ir/package.scala",
    publicBoundary: "package_internal",
    trancheId: "tranche:foundation-ir",
    firstProductFileToChange:
      "cdme-compiler/src/main/scala/cdme/compiler/ir/package.scala",
    upstreamComponentIds: [],
    requirementIds: ["REQ-TYP-001"],
    sourceAssetRefs: ["asset://implementation_design_surface"]
  };
}

test("T-113 admits production-shaped component realization rows on current component targets", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 9,
    contract,
    runId: "t113-component-depth"
  });
  const row = componentRow();
  const materializedFile = materializeSourceFile(
    manifest,
    row.relativePath,
    "package cdme.compiler.ir\n\nfinal case class IrNode(id: String)\n"
  );
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_code_surface",
    componentRealizationRows: [row]
  };
  const { outputFile, content } = writeArtifact(register);

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_code_surface",
    outputFile
  });
  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.componentRealizationRows.length, 1);
  assert.equal(
    admission.register.componentRealizationRows[0].firstProductFileToChange,
    "cdme-compiler/src/main/scala/cdme/compiler/ir/package.scala"
  );

  const ledger = deriveComponentDepthAssuranceLedger({
    manifest,
    report: reportFor(outputFile, content, manifest, [materializedFile])
  });
  assert(ledger);
  assert.equal(ledger.reasons.length, 0);
});

test("T-188 component-code prompt publishes topology row fields required by admission", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 9,
    contract,
    runId: "t188-component-code-prompt"
  });

  const prompt = promptForHandoff(manifest);
  assert.match(
    prompt,
    /payload\.componentTopologyRows[^.]+sourceAssetRefs/u
  );
  assert.match(
    prompt,
    /sourceAssetRefs must name the design or source authority/u
  );
  assert.match(prompt, /payload\.componentTestRows=\[\]/u);
  assert.match(prompt, /payload\.componentTestQualificationRows=\[\]/u);
});

test("T-197 rejects component-test rows on component-code target before row alias parsing", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_code_surface",
    componentRealizationRows: [
      componentRow()
    ],
    componentTestRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId: "hello_world_javascript_test",
        moduleName: "hello_world_javascript",
        relativePath: "test/hello.test.js",
        publicBoundary: "node --test test/hello.test.js",
        requirementIds: ["REQ-T197-LIVE-001"],
        sourceAssetRefs: ["workspace://design/component_code_surface.md"]
      }
    ]
  };
  const { outputFile } = writeMarkdownCarrierArtifact(
    register,
    "component_code_surface"
  );

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_code_surface",
    outputFile
  });

  assert.equal(admission.status, "rejected");
  const reasons = admission.blockingReasons.join("\n");
  assert.match(
    reasons,
    /component_depth_register_component_code_test_rows_wrong_stage/u
  );
  assert.doesNotMatch(reasons, /componentTestRows\[0\]\.componentId: unexpected field/u);
});

test("T-188 component-test prompt keeps source topology rows out of test carrier", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_component_test_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 22,
    contract,
    runId: "t188-component-test-prompt"
  });

  const prompt = promptForHandoff(manifest);
  assert.match(prompt, /do not copy source componentTopologyRows/u);
  assert.match(prompt, /componentTestRows\[\]\.componentIds/u);
  assert.match(prompt, /payload\.componentTopologyRows=\[\]/u);
  assert.match(prompt, /payload\.componentRepairSchedule=null/u);
});

test("B-084 rejects metadata-rich component realization aliases", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_realization_qualification_surface",
    componentRealizationRows: [
      {
        ...componentRow(),
        realizationOrder: 1,
        publishesSurfaces: [],
        sourceAssetRefs: ["asset://implementation_design_surface"]
      }
    ]
  };
  const { outputFile } = writeArtifact(register, "component_realization_qualification_surface");

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_realization_qualification_surface",
    outputFile
  });

  assert.equal(admission.status, "rejected");
  assert.match(admission.blockingReasons.join("\n"), /realizationOrder: unexpected field/u);
});

test("T-171 rejects boolean publicBoundary on component realization rows", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_code_surface",
    componentRealizationRows: [
      {
        ...componentRow(),
        publicBoundary: true
      }
    ]
  };
  const { outputFile } = writeArtifact(register, "component_code_surface");

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_code_surface",
    outputFile
  });

  assert.equal(admission.status, "rejected");
  assert.match(admission.blockingReasons.join("\n"), /publicBoundary: expected string/u);
});

test("B-084 admits metadata-rich component test rows", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_test_surface",
    componentTestRows: [
      {
        kind: "sdlc_component_test_realization_row",
        testClassId: "tc.compiler.api.compile-happy-path",
        relativePath:
          "cdme-compiler/src/test/scala/cdme/compiler/api/CompilerSpec.scala",
        testcaseIds: ["TC-COMPILER-001"],
        componentIds: ["cmp.compiler.api"],
        requirementIds: ["REQ-AI-001"],
        shardId: "sbt:test"
      }
    ]
  };
  const { outputFile } = writeArtifact(register, "component_test_surface");

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_test_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.componentTestRows.length, 1);
  assert.equal(admission.register.componentTestRows[0].shardId, "sbt:test");
});

test("T-113 admits repair and release-depth rows on current component-depth targets", () => {
  const repairRegister = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_repair_schedule_surface",
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "no_repair_required",
      repairRows: [],
      evidenceRefs: ["evidence://t113/repair"]
    }
  };
  const releaseRegister = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "release_depth_parity_surface",
    releaseDepthParity: {
      kind: "sdlc_release_depth_parity_assessment",
      status: "met",
      summary: "current component-depth release parity is met",
      blockingReasons: [],
      evidenceRefs: ["evidence://t113/release"]
    }
  };
  const repair = writeArtifact(repairRegister, "component_repair_schedule_surface");
  const release = writeArtifact(releaseRegister, "release_depth_parity_surface");

  assert.equal(
    admitComponentDepthRegisterFromArtifact({
      targetAssetType: "component_repair_schedule_surface",
      outputFile: repair.outputFile
    }).status,
    "admitted"
  );
  assert.equal(
    admitComponentDepthRegisterFromArtifact({
      targetAssetType: "release_depth_parity_surface",
      outputFile: release.outputFile
    }).status,
    "admitted"
  );
});

test("T-188 admits Markdown-fenced component-depth target carrier payloads", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_repair_schedule_surface",
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "triage_gap",
      repairRows: [],
      evidenceRefs: ["evidence://t188/component-repair-schedule"]
    }
  };
  const { outputFile } = writeMarkdownCarrierArtifact(
    register,
    "component_repair_schedule_surface"
  );

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_repair_schedule_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(
    admission.register.componentRepairSchedule.scheduleStatus,
    "triage_gap"
  );
});

test("T-194 admits live plain-fence labeled component-depth target carrier payloads", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_repair_schedule_surface",
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "triage_gap",
      repairRows: [],
      evidenceRefs: ["evidence://t194/component-repair-schedule"]
    }
  };
  const { outputFile } = writePlainFenceLabeledCarrierArtifact(
    register,
    "component_repair_schedule_surface"
  );

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_repair_schedule_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(
    admission.register.componentRepairSchedule.scheduleStatus,
    "triage_gap"
  );
});

test("T-153 rejects component-depth wrappers that are not GTL target-carrier envelopes", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_repair_schedule_surface",
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "triage_gap",
      repairRows: [],
      evidenceRefs: ["evidence://t153/component-repair-schedule"]
    }
  };
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t153-"));
  const outputFile = path.join(root, "component_repair_schedule_surface.md");
  const carrier = {
    ...componentDepthTargetCarrierFor(register),
    contractRef: "contract://odd-sdlc/local-component-depth-wrapper"
  };
  writeFileSync(
    outputFile,
    [
      "# Invalid component-depth wrapper",
      "",
      "```json component_depth_register",
      JSON.stringify(carrier, null, 2),
      "```",
      ""
    ].join("\n"),
    "utf8"
  );

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_repair_schedule_surface",
    outputFile
  });

  assert.equal(admission.status, "rejected");
  const reasons = admission.blockingReasons.join("\n");
  assert.match(reasons, /contractRef: unexpected protocol value/u);
});

test("T-188 target-carrier payload rejection reports payload schema only", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_test_surface",
    componentTopologyRows: [
      {
        kind: "sdlc_component_topology_row",
        componentId: "missing-source-refs",
        moduleName: "test",
        relativePath: "test/topology.test.js",
        publicBoundary: "test boundary",
        concernRole: "validator",
        requirementIds: ["REQ-T188-001"]
      }
    ],
    componentTestRows: [
      {
        kind: "sdlc_component_test_realization_row",
        testClassId: "tc.topology",
        relativePath: "test/topology.test.js",
        testcaseIds: ["TC-T188-001"],
        componentIds: ["cmp.topology"],
        requirementIds: ["REQ-T188-001"],
        shardId: "node:test"
      }
    ]
  };
  const { outputFile } = writeMarkdownCarrierArtifact(
    register,
    "component_test_surface"
  );

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_test_surface",
    outputFile
  });

  assert.equal(admission.status, "rejected");
  const reasons = admission.blockingReasons.join("\n");
  assert.match(reasons, /componentTopologyRows\[0\]\.sourceAssetRefs: expected array/u);
  assert.doesNotMatch(reasons, /component_depth_register\.edgeRef: unexpected field/u);
  assert.doesNotMatch(reasons, /component_depth_register\.contractRef: unexpected field/u);
});

test("T-113 ignores stale repair schedule payload on component-code target", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_code_surface",
    componentRealizationRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId: "source-component",
        moduleName: "source",
        relativePath: "src/main/scala",
        publicBoundary: "source boundary",
        requirementIds: ["requirement:data_mapper.req_source"],
        sourceAssetRefs: ["build_tenants/scala_spark/src/main/scala"]
      }
    ],
    componentRepairSchedule: {
      kind: "sdlc_component_repair_schedule",
      registerVersion: "ts-component-depth-v1",
      scheduleStatus: "no_repair_required",
      repairRows: [
        {
          kind: "sdlc_component_repair_schedule_row",
          scheduleId: "stale-row",
          failureId: "stale-failure",
          repairTarget: "component_code",
          lawfulReentryPoint: "repair_worker_output",
          attributionConfidence: "high"
        }
      ]
    }
  };
  const { outputFile } = writeArtifact(register, "component_code_surface");

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_code_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.componentRepairSchedule, null);
  assert.equal(admission.register.componentRealizationRows.length, 1);
});
