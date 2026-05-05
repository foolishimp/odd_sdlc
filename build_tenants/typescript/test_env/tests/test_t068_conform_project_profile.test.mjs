// Validates: REQ-F-ODDSDLC-026
// Validates: REQ-F-ODDSDLC-027
// Validates: REQ-F-ODDSDLC-028
// Validates: REQ-F-ODDSDLC-032
// Validates: REQ-F-ODDSDLC-053
// Validates: T-068

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

import {
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcConformProjectReportFromWorkspace,
  deriveSdlcProjectConstraintsFromWorkspace,
  deriveWorkerHandoffManifest,
  FG_CONFORM_PROJECT,
  hookContractByEdgeName,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";

function makeWorkspace(name, constraintsText) {
  const root = mkdtempSync(path.join(tmpdir(), `${name}-`));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(path.join(root, "specification/INTENT.md"), "# Intent\n", "utf8");
  writeFileSync(path.join(root, "specification/PRODUCT.md"), "# Product\n", "utf8");
  writeFileSync(path.join(root, "specification/GOALS.md"), "# Goals\n", "utf8");
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    "# Imported Sources\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    "# Project Bootstrap\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/TENANT_REGISTRY.md"),
    "# Tenant Registry\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    `${constraintsText.trim()}\n`,
    "utf8"
  );
  return root;
}

test("T-068 conforms arbitrary tenant registry into canonical project profile", () => {
  const workspace = makeWorkspace(
    "odd-sdlc-t068-kotlin",
    `
project:
  name: ledger service
  kind: imported_workspace
  version: 1.2.3
active_tenant: kotlin_jvm
ambiguity_risk_appetite: high
structure:
  root_code_policy: tenant_root_only
build_tenants:
  kotlin_jvm:
    output_dir: build_tenants/kotlin_jvm
    language: kotlin
    build_tool: gradle
    test_runner: gradle test
    module_structure:
      - ingress-core
      - settlement-engine
    capability_contracts:
      cli_runner: true
      junit: true
`
  );

  const profile = deriveSdlcConformProjectProfileFromWorkspace(workspace);
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const report = deriveSdlcConformProjectReportFromWorkspace(workspace);

  assert.equal(profile.kind, "sdlc_conform_project_profile");
  assert.equal(profile.projectSlug, "ledger_service");
  assert.equal(profile.projectKind, "imported_workspace");
  assert.equal(profile.version, "1.2.3");
  assert.equal(profile.activeTenant, "kotlin_jvm");
  assert.equal(profile.selectedOutputRoot, "build_tenants/kotlin_jvm");
  assert.equal(profile.declaredOutputRoot, "build_tenants/kotlin_jvm");
  assert.deepStrictEqual(profile.declaredModuleNames, [
    "ingress-core",
    "settlement-engine"
  ]);
  assert.equal(profile.language, "kotlin");
  assert.equal(profile.tool, "gradle");
  assert.equal(profile.buildExecutionContract, "gradle build");
  assert.equal(profile.testExecutionContract, "gradle test");
  assert.equal(profile.deploymentContract, "undeclared");
  assert.equal(profile.runtimeObservationContract, "undeclared");
  assert.equal(profile.realizationMode, "planned_output_tree");
  assert.deepStrictEqual(
    profile.capabilityContracts.map((contract) => `${contract.name}:${contract.value}`),
    ["cli_runner:true", "junit:true"]
  );

  assert.equal(constraints.activeTenant, "kotlin_jvm");
  assert.equal(constraints.selectedOutputRoot, "build_tenants/kotlin_jvm");
  assert.deepStrictEqual(constraints.capabilityContracts, ["cli_runner", "junit"]);
  assert.equal(report.governingGraphFunction, FG_CONFORM_PROJECT);
  assert.deepStrictEqual(report.conformanceGaps, []);
});

test("T-068 infers execution contracts from selected tenant truth without workload-specific code", () => {
  const workspace = makeWorkspace(
    "odd-sdlc-t068-scala",
    `
project:
  name: analytics pipeline
active_tenant: spark_scala
build_tenants:
  scala_spark:
    output_dir: build_tenants/scala_spark/
    language: scala
    build_tool: sbt
    module_structure:
      - ingestion
      - lineage
      - serving
    capability_contracts:
      fat_jar: true
      spark_session: true
      spark_submit_compatible: true
`
  );

  const profile = deriveSdlcConformProjectProfileFromWorkspace(workspace);

  assert.equal(profile.activeTenant, "scala_spark");
  assert.equal(profile.selectedOutputRoot, "build_tenants/scala_spark");
  assert.deepStrictEqual(profile.declaredModuleNames, [
    "ingestion",
    "lineage",
    "serving"
  ]);
  assert.equal(profile.buildExecutionContract, "sbt clean assembly");
  assert.equal(profile.testExecutionContract, "sbt test");
  assert.equal(profile.deploymentContract, "spark-submit");
});

test("T-068 installed handoff carries conformed project before materialization", () => {
  const workspace = makeWorkspace(
    "odd-sdlc-t068-handoff",
    `
project:
  name: document compiler
active_tenant: node_cli
build_tenants:
  node_cli:
    output_dir: build_tenants/node_cli
    language: typescript
    build_tool: npm
    module_structure:
      - parser
      - renderer
`
  );
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 6,
    contract,
    runId: "t068-conform-project-handoff"
  });
  const handoffFiles = writeHandoffFiles(manifest);
  const archivedProfile = JSON.parse(
    readFileSync(path.join(manifest.archiveRoot, "conformed_project.json"), "utf8")
  );

  assert.equal(manifest.conformedProject.projectSlug, "document_compiler");
  assert.equal(manifest.conformedProject.activeTenant, "node_cli");
  assert.equal(manifest.productMaterialization.selectedOutputRoot, "build_tenants/node_cli");
  assert.deepStrictEqual(manifest.productMaterialization.declaredModuleNames, [
    "parser",
    "renderer"
  ]);
  assert.equal(manifest.productMaterialization.buildExecutionContract, "npm run build");
  assert.equal(manifest.productMaterialization.testExecutionContract, "npm test");
  assert.equal(archivedProfile.projectSlug, "document_compiler");
  assert.match(readFileSync(handoffFiles.promptPath, "utf8"), /Declared modules: parser, renderer/);
});
