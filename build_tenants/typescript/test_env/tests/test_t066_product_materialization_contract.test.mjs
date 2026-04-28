// Validates: REQ-F-ODDSDLC-030
// Validates: REQ-F-ODDSDLC-032
// Validates: REQ-F-ODDSDLC-053
// Validates: REQ-F-ODDSDLC-058
// Validates: REQ-F-ODDSDLC-061
// Validates: T-066

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
  constructorResultFromWorkerOutput,
  deriveSdlcWorkspaceIngressReport,
  deriveSdlcProjectConstraintsFromWorkspace,
  deriveWorkerHandoffManifest,
  executeInstalledOperatorStart,
  evaluateWorkerResultPostflight,
  FG_CONFORM_PROJECT,
  hookContractByEdgeName,
  installOddSdlcTypescript,
  materializeSdlcProjectConformance,
  projectSdlcGapsFromReplay,
  projectSdlcQueryDomain,
  projectSdlcWorkerAttachment,
  publicStartOnce,
  readOddSdlcRuntimeEvents,
  readWorkerResultReport,
  sha256Text,
  writeHandoffFiles,
  writeProductMaterializationManifest
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
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t066-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# T-066 Fixture", "", "Build a governed Scala product realization."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    ["# Intent", "", "Create a typed downstream implementation."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-fixture.md"),
    ["# Requirements", "", "REQ-T066-001: Reject shallow product source realization."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t066_product_materialization",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "ambiguity_risk_appetite: medium"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function makeCapabilityWorkspace() {
  const root = makeWorkspace();
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t066_capability_materialization",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark/",
      "    language: Scala",
      "    build_tool: sbt",
      "    test_runner: sbt test",
      "    capability_contracts:",
      "      spark_session: true",
      "      dataframe_reads: true"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function declareScalaSbtTestRunner(workspaceRoot) {
  writeFileSync(
    path.join(workspaceRoot, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t100_test_materialization",
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
  materializeSdlcProjectConformance({ workspaceRoot });
}

function makeStart(workspaceRoot) {
  const module = constructSdlcGtlModule();
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: `file://${workspaceRoot}`,
    projectConstraints: admitSdlcProjectConstraints({
      projectSlug: "t066",
      activeTenant: "scala_spark",
      selectedOutputRoot: "build_tenants/scala_spark",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: []
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
    obligationId: `t066-preclosed-${index}`,
    publishedLedgerRef: `proof://t066/preclosed/${index}`,
    actor: "test",
    specHash: `sha256:t066preclosed${index}`,
    manifestId: `manifest:t066:preclosed:${index}`,
    workflowVersion: "t066-preclosed",
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

function writePlaceholderWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t066_placeholder_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const output = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`].join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const tenantRelative = 'src/main/scala/generated/Placeholder.scala';",
      "const sourcePath = path.join(manifest.productMaterialization.tenantRoot, tenantRelative);",
      "mkdirSync(dirname(sourcePath), { recursive: true });",
      "const source = 'package generated\\n// TODO placeholder implementation\\nobject Placeholder { def run(input: String): String = input }\\n';",
      "writeFileSync(sourcePath, source, 'utf8');",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "const materializedFiles = [{ kind: 'sdlc_materialized_product_file', role: 'source', relativePath: tenantRelative, absolutePath: sourcePath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8') }];",
      "const materializedRefs = materializedFiles.map((file) => `file://${file.absolutePath}`);",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: materializedRefs.length > 0 ? materializedRefs : obligation.evidenceRefs, blockingReasons: [] }));",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: outputDigest, summary: 'generated placeholder source that must be rejected by assurance gate', unresolvedReasons: [], materializedFiles, executionEvidence: null, obligationAssessments }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writeCapabilityMissingWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t066_capability_missing_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const output = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`].join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const tenantRelative = 'src/main/scala/generated/Core.scala';",
      "const sourcePath = path.join(manifest.productMaterialization.tenantRoot, tenantRelative);",
      "mkdirSync(dirname(sourcePath), { recursive: true });",
      "const source = 'package generated\\nobject Core { def run(value: String): String = value.reverse }\\n';",
      "writeFileSync(sourcePath, source, 'utf8');",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "const materializedFiles = [{ kind: 'sdlc_materialized_product_file', role: 'source', relativePath: tenantRelative, absolutePath: sourcePath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8') }];",
      "const materializedRefs = materializedFiles.map((file) => `file://${file.absolutePath}`);",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: materializedRefs.length > 0 ? materializedRefs : obligation.evidenceRefs, blockingReasons: [] }));",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: outputDigest, summary: 'generated source without required capability evidence', unresolvedReasons: [], materializedFiles, executionEvidence: null, obligationAssessments }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writeUnassessedObligationWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t066_unassessed_obligation_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const output = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`].join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const tenantRelative = 'src/main/scala/generated/Core.scala';",
      "const sourcePath = path.join(manifest.productMaterialization.tenantRoot, tenantRelative);",
      "mkdirSync(dirname(sourcePath), { recursive: true });",
      "const source = 'package generated\\nobject Core { def transform(value: String): String = value.reverse + value.length.toString }\\n';",
      "writeFileSync(sourcePath, source, 'utf8');",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "const materializedFiles = [{ kind: 'sdlc_materialized_product_file', role: 'source', relativePath: tenantRelative, absolutePath: sourcePath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8') }];",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: outputDigest, summary: 'generated source without traversal obligation assessments', unresolvedReasons: [], materializedFiles, executionEvidence: null }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function freshDataMapperWorkspace() {
  assert.equal(
    existsSync(DATA_MAPPER_TEMPLATE_ROOT),
    true,
    `missing data_mapper template: ${DATA_MAPPER_TEMPLATE_ROOT}`
  );
  const parentRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t066-dm-"));
  const workspaceRoot = path.join(parentRoot, "data_mapper.test66.ts");
  cpSync(DATA_MAPPER_TEMPLATE_ROOT, workspaceRoot, { recursive: true });
  return workspaceRoot;
}

function installedOddSdlcCommand(install) {
  const commandPath = install.commandPaths.find(
    (candidate) => path.basename(candidate) === "odd-sdlc-ts"
  );
  assert(commandPath, "odd-sdlc-ts command path missing");
  return commandPath;
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

function writeDataMapperInventoryWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t066_data_mapper_inventory_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const output = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`].join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const materializedFiles = [];",
      "let executionEvidence = null;",
      "if (manifest.productMaterialization.required) {",
      "  const role = manifest.targetAssetType === 'test_module_surface' ? 'test' : 'source';",
      "  const tenantRelative = role === 'test' ? 'cdme-core/src/test/scala/cdme/CoreSpec.scala' : 'cdme-core/src/main/scala/cdme/Core.scala';",
      "  const productPath = path.join(manifest.productMaterialization.tenantRoot, tenantRelative);",
      "  mkdirSync(dirname(productPath), { recursive: true });",
      "  const capabilityMarkers = manifest.conformedProject.capabilityContracts.map((contract) => `${contract.name} ${contract.value}`).join(' ');",
      "  const source = role === 'test' ? 'package cdme\\nimport org.scalatest.funsuite.AnyFunSuite\\nfinal class CoreSpec extends AnyFunSuite { test(\"core contract\") { assert(Core.retryClosed == true) } }\\n' : `package cdme\\nobject Core { val retryClosed = true; val capabilityMarkers = ${JSON.stringify(capabilityMarkers)} }\\n`;",
      "  writeFileSync(productPath, source, 'utf8');",
      "  const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "  materializedFiles.push({ kind: 'sdlc_materialized_product_file', role, relativePath: tenantRelative, absolutePath: productPath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8') });",
      "  if (role === 'test') {",
      "    const buildPath = path.join(manifest.productMaterialization.tenantRoot, 'build.sbt');",
      "    const buildConfig = 'ThisBuild / scalaVersion := \"2.12.18\"\\nlibraryDependencies += \"org.scalatest\" %% \"scalatest\" % \"3.2.19\" % Test\\nlazy val root = project.in(file(\".\")).settings(name := \"cdme-core\")\\n';",
      "    writeFileSync(buildPath, buildConfig, 'utf8');",
      "    const buildDigest = `sha256:${createHash('sha256').update(buildConfig, 'utf8').digest('hex')}`;",
      "    materializedFiles.push({ kind: 'sdlc_materialized_product_file', role: 'build_config', relativePath: 'build.sbt', absolutePath: buildPath, digest: buildDigest, byteCount: Buffer.byteLength(buildConfig, 'utf8') });",
      "  }",
      "}",
      "if (manifest.targetAssetType === 'test_run_archive_surface') {",
      "  const reportPath = path.join(manifest.archiveRoot, 'junit-report.xml');",
      "  const report = '<testsuite tests=\"1\" failures=\"0\"><testcase classname=\"cdme.CoreSpec\" name=\"provesCore\"/></testsuite>\\n';",
      "  writeFileSync(reportPath, report, 'utf8');",
      "  executionEvidence = { kind: 'sdlc_worker_execution_evidence', lane: 'test', command: manifest.productMaterialization.testExecutionContract, status: 'succeeded', reportRefs: [`file://${reportPath}`], testsObserved: 1, passedCount: 1, failedCount: 0 };",
      "}",
      "const materializedRefs = materializedFiles.map((file) => `file://${file.absolutePath}`);",
      "const executionRefs = executionEvidence === null ? [] : executionEvidence.reportRefs;",
      "const outputRef = `file://${manifest.outputFile}`;",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [outputRef, ...materializedRefs, ...executionRefs, ...obligation.evidenceRefs], blockingReasons: [] }));",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: outputDigest, summary: 'installed data_mapper source/test inventory worker output', unresolvedReasons: [], materializedFiles, executionEvidence, obligationAssessments }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writeOutputSurface(manifest, title) {
  const content = [`# ${title}`, "", `edge: ${manifest.edgeName}`].join("\n");
  const artifact = `${content}\n`;
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, artifact, "utf8");
  return {
    digest: sha256Text(artifact),
    byteCount: Buffer.byteLength(artifact, "utf8")
  };
}

function writeReport(input) {
  const evidenceRefs = input.materializedFiles.map((file) => `file://${file.absolutePath}`);
  writeFileSync(
    input.manifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: input.manifest.graphFunctionName,
        edgeName: input.manifest.edgeName,
        targetAssetType: input.manifest.targetAssetType,
        outputFile: input.manifest.outputFile,
        digest: input.digest,
        summary: input.summary,
        unresolvedReasons: [],
        materializedFiles: input.materializedFiles,
        obligationAssessments: input.manifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: evidenceRefs.length > 0 ? evidenceRefs : obligation.evidenceRefs,
            blockingReasons: []
          })
        )
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

test("T-066 code-surface handoff admits tenant-root product source materialization", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  assert.equal(constraints.activeTenant, "scala_spark");
  assert.equal(constraints.selectedOutputRoot, "build_tenants/scala_spark");
  const contract = hookContractByEdgeName("derive_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t066-product-source"
  });
  writeHandoffFiles(manifest);

  assert.equal(manifest.productMaterialization.required, true);
  assert.equal(manifest.productMaterialization.activeTenant, "scala_spark");
  assert.deepStrictEqual(manifest.productMaterialization.requiredRoles, ["source"]);
  assert.equal(
    manifest.traversalObligationContext.obligations.some(
      (obligation) => obligation.obligationId === "requirement:REQ-T066-001"
    ),
    true
  );
  assert.equal(
    manifest.traversalObligationContext.obligations.some(
      (obligation) => obligation.obligationId === "target_asset:code_surface"
    ),
    true
  );
  assert.equal(
    manifest.traversalObligationContext.deltaSummary.requirementCount,
    1
  );
  assert.equal(
    manifest.allowedWriteRoots.includes(manifest.productMaterialization.tenantRoot),
    true
  );

  const output = writeOutputSurface(manifest, "code_surface");
  const sourceContent = [
    "package generated",
    "",
    "// Implements: REQ-F-ODDSDLC-030",
    "final case class DataMapper(value: String)"
  ].join("\n");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/DataMapper.scala"
  );
  mkdirSync(dirname(productFile), { recursive: true });
  writeFileSync(productFile, `${sourceContent}\n`, "utf8");
  const materializedFiles = [
    {
      kind: "sdlc_materialized_product_file",
      role: "source",
      relativePath: path.relative(manifest.productMaterialization.tenantRoot, productFile),
      absolutePath: productFile,
      digest: sha256Text(`${sourceContent}\n`),
      byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8")
    }
  ];
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated product source under tenant root",
    materializedFiles
  });

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  const constructorResult = constructorResultFromWorkerOutput({
    manifest,
    report,
    operationType: "generate"
  });

  assert.equal(postflight.status, "passed");
  assert.equal(readFileSync(productFile, "utf8"), `${sourceContent}\n`);
  assert.equal(
    postflight.evidenceRefs.includes(`file://${productFile}`),
    true
  );
  assert.equal(
    constructorResult.evidenceRefs.some(
      (ref) => ref.evidenceType === "installed_operator_materialized_product_source"
    ),
    true
  );
  assert.deepStrictEqual(constructorResult.generatedAssetContract.diagnostics, [
    "materialized_product_file_count:1"
  ]);
});

test("T-066 code-surface postflight rejects markdown-only realization", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t066-markdown-only"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "code_surface");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated only the markdown code surface",
    materializedFiles: []
  });

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_files_missing"),
    true
  );
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_role_missing:source"),
    true
  );
});

test("T-066 test-run archive postflight rejects missing execution evidence", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_run_archive_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 14,
    contract,
    projectConstraints: constraints,
    runId: "t066-missing-execution-evidence"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "test_run_archive_surface");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated only a test run archive markdown surface",
    materializedFiles: []
  });

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("test_execution_evidence_missing"),
    true
  );
});

test("T-094/T-095 test-run archive normalizes not-run evidence to pending blocker", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_run_archive_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 14,
    contract,
    projectConstraints: constraints,
    runId: "t094-not-run-execution-evidence"
  });
  const handoffFiles = writeHandoffFiles(manifest);
  const prompt = readFileSync(handoffFiles.promptPath, "utf8");

  assert.match(prompt, /executionEvidence\.status MUST be one of: succeeded, failed, pending/);
  assert.match(prompt, /Do not use status values such as not_run/);
  assert.match(prompt, /executionEvidence\.lane MUST be exactly "test"/);
  assert.match(
    prompt,
    /executionEvidence\.testsObserved, passedCount, and failedCount MUST be numbers or null/
  );
  assert.match(
    prompt,
    /A document that says tests were not run is not closure evidence for this edge/
  );

  const output = writeOutputSurface(manifest, "test_run_archive_surface");
  const outputRef = `file://${manifest.outputFile}`;
  writeFileSync(
    manifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: manifest.graphFunctionName,
        edgeName: manifest.edgeName,
        targetAssetType: manifest.targetAssetType,
        outputFile: manifest.outputFile,
        digest: output.digest,
        summary: "test archive reports that execution did not run",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: manifest.productMaterialization.testExecutionContract,
          status: "not_run",
          reportRefs: [outputRef],
          testsObserved: 0,
          passedCount: 0,
          failedCount: 0
        },
        obligationAssessments: manifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: [outputRef, ...obligation.evidenceRefs],
            blockingReasons: []
          })
        )
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(report.executionEvidence.status, "pending");
  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("test_execution_not_succeeded"),
    true
  );
  assert.equal(
    postflight.blockingReasons.includes("test_execution_zero_tests_observed"),
    true
  );
});

test("T-100 test-module postflight rejects tests that sbt test cannot discover", () => {
  const workspace = makeWorkspace();
  declareScalaSbtTestRunner(workspace);
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const tenantRoot = path.join(workspace, "build_tenants/scala_spark");
  mkdirSync(tenantRoot, { recursive: true });
  writeFileSync(
    path.join(tenantRoot, "build.sbt"),
    [
      'ThisBuild / scalaVersion := "2.12.18"',
      'lazy val root = project.in(file(".")).settings(name := "t100")'
    ].join("\n"),
    "utf8"
  );
  const contract = hookContractByEdgeName("derive_test_module_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 14,
    contract,
    projectConstraints: constraints,
    runId: "t100-non-discoverable-test-module"
  });
  const handoffFiles = writeHandoffFiles(manifest);
  const prompt = readFileSync(handoffFiles.promptPath, "utf8");

  assert.match(prompt, /generated tests MUST be discoverable/);
  assert.match(prompt, /role build_config/);
  assert.match(prompt, /do not emit only standalone object\/main tests/);

  const output = writeOutputSurface(manifest, "test_module_surface");
  const testPath = path.join(
    manifest.productMaterialization.tenantRoot,
    "cdme-core/src/test/scala/cdme/CoreSpec.scala"
  );
  const testContent = [
    "package cdme",
    "object CoreSpec {",
    "  def main(args: Array[String]): Unit = assert(true)",
    "}"
  ].join("\n");
  mkdirSync(dirname(testPath), { recursive: true });
  writeFileSync(testPath, `${testContent}\n`, "utf8");
  const materializedFiles = [
    {
      kind: "sdlc_materialized_product_file",
      role: "test",
      relativePath: path.relative(manifest.productMaterialization.tenantRoot, testPath),
      absolutePath: testPath,
      digest: sha256Text(`${testContent}\n`),
      byteCount: Buffer.byteLength(`${testContent}\n`, "utf8")
    }
  ];
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated standalone main-style test object",
    materializedFiles
  });

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.some((reason) =>
      reason.startsWith("test_materialization_not_discoverable")
    ),
    true
  );
});

test("T-100 test-module postflight admits sbt-discoverable framework tests", () => {
  const workspace = makeWorkspace();
  declareScalaSbtTestRunner(workspace);
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const tenantRoot = path.join(workspace, "build_tenants/scala_spark");
  mkdirSync(tenantRoot, { recursive: true });
  writeFileSync(
    path.join(tenantRoot, "build.sbt"),
    [
      'ThisBuild / scalaVersion := "2.12.18"',
      'libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.19" % Test',
      'lazy val root = project.in(file(".")).settings(name := "t100")'
    ].join("\n"),
    "utf8"
  );
  const contract = hookContractByEdgeName("derive_test_module_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 14,
    contract,
    projectConstraints: constraints,
    runId: "t100-discoverable-test-module"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "test_module_surface");
  const testPath = path.join(
    manifest.productMaterialization.tenantRoot,
    "cdme-core/src/test/scala/cdme/CoreSpec.scala"
  );
  const testContent = [
    "package cdme",
    "import org.scalatest.funsuite.AnyFunSuite",
    "final class CoreSpec extends AnyFunSuite {",
    "  test(\"core contract\") { assert(1 == 1) }",
    "}"
  ].join("\n");
  mkdirSync(dirname(testPath), { recursive: true });
  writeFileSync(testPath, `${testContent}\n`, "utf8");
  const materializedFiles = [
    {
      kind: "sdlc_materialized_product_file",
      role: "test",
      relativePath: path.relative(manifest.productMaterialization.tenantRoot, testPath),
      absolutePath: testPath,
      digest: sha256Text(`${testContent}\n`),
      byteCount: Buffer.byteLength(`${testContent}\n`, "utf8")
    }
  ];
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated sbt-discoverable ScalaTest module",
    materializedFiles
  });

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(
    postflight.blockingReasons.some((reason) =>
      reason.startsWith("test_materialization_not_discoverable")
    ),
    false
  );
});

test("T-066 installed operator rejects shallow source through assurance fold before edge closure", async () => {
  const workspace = makeWorkspace();
  const start = makeStart(workspace);
  const basis = start.executionContract.basis;
  const codeIndex = basis.graph.vectors.findIndex(
    (vector) => vector.name === "derive_code_surface"
  );
  assert(codeIndex > 0);
  const workerScript = writePlaceholderWorkerScript(workspace);
  const result = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
    replayEvents: preclosedEventsBeforeEdge(basis, "derive_code_surface")
  });

  assert.equal(result.status, "postflight_failed");
  assert.equal(result.postflight.status, "blocked");
  assert.equal(result.assuranceSatisfaction.status, "retry_same_edge");
  assert.equal(
    result.postflight.blockingReasons.some((reason) =>
      reason.startsWith("placeholder_surface:file://")
    ),
    true
  );
  assert.equal(
    result.postflight.blockingReasons.some((reason) =>
      reason.startsWith("identity_only_surface:file://")
    ),
    true
  );
  assert.deepStrictEqual(result.emittedRuntimeEventKinds, [
    "graph_call_opened",
    "frame_opened",
    "vector_traversal_planned",
    "vector_evaluated",
    "retry_repair_planned",
    "retry_attempt_opened",
    "continuation_terminated",
    "continuation_reopened"
  ]);
  assert.equal(result.gapDossier.status, "open");
  assert.equal(
    result.gapDossier.reasons.some((reason) =>
      reason.reason.startsWith("placeholder_surface:file://")
    ),
    true
  );

  const failureEvents = await readOddSdlcRuntimeEvents(workspace);
  const afterFailure = projectSdlcGapsFromReplay({
    basis,
    events: Object.freeze([
      ...preclosedEventsBeforeEdge(basis, "derive_code_surface"),
      ...failureEvents
    ])
  });
  assert.equal(afterFailure.currentEdge, "derive_code_surface");
  assert.equal(afterFailure.closedVectorIndexes.includes(codeIndex), false);
});

test("T-066 installed operator rejects missing declared capability evidence", async () => {
  const workspace = makeCapabilityWorkspace();
  const start = makeStart(workspace);
  const basis = start.executionContract.basis;
  const workerScript = writeCapabilityMissingWorkerScript(workspace);
  const result = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
    replayEvents: preclosedEventsBeforeEdge(basis, "derive_code_surface")
  });

  assert.equal(result.status, "postflight_failed");
  assert.equal(result.assuranceSatisfaction.status, "retry_same_edge");
  assert.equal(
    result.postflight.blockingReasons.includes("capability_missing:spark_session"),
    true
  );
  assert.equal(
    result.postflight.blockingReasons.includes("capability_missing:dataframe_reads"),
    true
  );
  assert.equal(
    result.gapDossier.reasons.some(
      (reason) => reason.reason === "capability_missing:spark_session"
    ),
    true
  );
});

test("T-066 installed operator rejects product edge when traversal obligations are unassessed", async () => {
  const workspace = makeWorkspace();
  const start = makeStart(workspace);
  const basis = start.executionContract.basis;
  const workerScript = writeUnassessedObligationWorkerScript(workspace);
  const result = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
    replayEvents: preclosedEventsBeforeEdge(basis, "derive_code_surface")
  });

  assert.equal(result.status, "postflight_failed");
  assert.equal(result.postflight.status, "blocked");
  assert.equal(
    result.postflight.blockingReasons.some((reason) =>
      reason.startsWith("obligation_unassessed:")
    ),
    true
  );
  assert.equal(
    result.gapDossier.reasons.some((reason) =>
      reason.reason.startsWith("obligation_unassessed:")
    ),
    true
  );
});

test("T-066 installed data_mapper successor materializes source and behavioral test inventory", async () => {
  const workspace = freshDataMapperWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t066"
  });
  assert.equal(install.kind, "installed");
  const commandPath = installedOddSdlcCommand(install);
  const workerScript = writeDataMapperInventoryWorkerScript(workspace);
  const workerTransport = `process://node?script=${encodeURIComponent(workerScript)}`;
  const target = "graph_function:bootstrap_release_self_test";
  let codeResult = null;
  let testResult = null;
  let testRunResult = null;

  for (let guard = 0; guard < 20; guard += 1) {
    const gaps = runInstalledOddSdlc(commandPath, ["gaps", "--workspace", workspace], workspace);
    const currentEdge = gaps.projection.currentEdge;
    if (currentEdge === null || currentEdge === "qualify_testcase_authority") {
      break;
    }
    if (currentEdge === FG_CONFORM_PROJECT) {
      const induction = runInstalledOddSdlc(
        commandPath,
        ["start", "--workspace", workspace, "--until", "blocked"],
        workspace
      );
      assert.equal(induction.status, "converged", currentEdge);
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
    assert.equal(start.status, "worker_invoked", currentEdge);
    assert.equal(start.postflight.status, "passed", currentEdge);
    if (currentEdge === "derive_code_surface") {
      codeResult = start;
    }
    if (currentEdge === "derive_test_module_surface") {
      testResult = start;
    }
    if (currentEdge === "derive_test_run_archive_surface") {
      testRunResult = start;
      break;
    }
  }

  assert(codeResult, "derive_code_surface did not run");
  assert(testResult, "derive_test_module_surface did not run");
  assert(testRunResult, "derive_test_run_archive_surface did not run");
  assert.equal(codeResult.assuranceSatisfaction.status, "close_allowed");
  assert.equal(testResult.assuranceSatisfaction.status, "close_allowed");
  assert.equal(testRunResult.postflight.status, "passed");
  assert.equal(testRunResult.workerReport.executionEvidence.status, "succeeded");
  assert.equal(testRunResult.workerReport.executionEvidence.testsObserved, 1);
  assert.equal(
    existsSync(
      path.join(
        workspace,
        "build_tenants/scala_spark/cdme-core/src/main/scala/cdme/Core.scala"
      )
    ),
    true
  );
  assert.equal(
    existsSync(
      path.join(
        workspace,
        "build_tenants/scala_spark/cdme-core/src/test/scala/cdme/CoreSpec.scala"
      )
    ),
    true
  );
  assert.match(
    readFileSync(
      path.join(
        workspace,
        "build_tenants/scala_spark/cdme-core/src/main/scala/cdme/Core.scala"
      ),
      "utf8"
    ),
    /spark_session/
  );
  assert.match(
    readFileSync(
      path.join(
        workspace,
        "build_tenants/scala_spark/cdme-core/src/test/scala/cdme/CoreSpec.scala"
      ),
      "utf8"
    ),
    /assert\(Core\.retryClosed == true\)/
  );
});
