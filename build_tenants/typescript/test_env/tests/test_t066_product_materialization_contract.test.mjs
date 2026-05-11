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
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  admitSdlcProjectConstraints,
  buildPostTransformWorkerResultReport,
  constructPostflightGapDossier,
  constructSdlcGtlModule,
  constructorResultFromWorkerOutput,
  deriveComponentDepthAssuranceLedger,
  deriveShallowRealizationAssuranceLedger,
  deriveSdlcOperatorAssuranceGate,
  deriveSdlcWorkspaceIngressReport,
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcProjectConstraintsFromWorkspace,
  deriveWorkerHandoffManifest,
  executeInstalledOperatorStart,
  FG_CONFORM_PROJECT_AUTHORITY,
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  evaluateWorkerResultPostflight,
  FG_CONFORM_PROJECT,
  hookContractByEdgeName,
  installOddSdlcTypescript,
  materializeSdlcProjectConformance,
  evalSdlcGapFromReplay,
  projectSdlcQueryDomain,
  projectSdlcWorkerAttachment,
  publicStartOnce,
  readOddSdlcRuntimeEvents,
  readWorkerResultReport,
  sha256Text,
  snapshotProductMaterializationRoot,
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
  const conformedProject =
    deriveSdlcConformProjectProfileFromWorkspace(workspaceRoot);
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
    conformedProject,
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

function vectorClosedEventForVector(basis, vector, index) {
  return {
    kind: "vector_closed",
    basisId: basis.id,
    graphCallId: `graph-call:${basis.id}`,
    frameId: `frame:${basis.id}:root`,
    vectorIndex: index,
    edge: vector.name,
    closureKind: "advanced"
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
      .flatMap((vector, index) => [
        assessedEventForVector(basis, vector, index),
        vectorClosedEventForVector(basis, vector, index)
      ])
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
      "const sourceRelative = 'cdme-core/src/main/scala/cdme/Core.scala';",
      "const testRelative = 'cdme-core/src/test/scala/cdme/CoreSpec.scala';",
      "function designCompletenessVerdict() {",
      "  const axis = (name) => ({ kind: 'sdlc_design_completeness_axis_verdict', axis: name, status: 'satisfied', reasons: [], evidenceRefs: [`file://${manifest.outputFile}`] });",
      "  return { kind: 'sdlc_design_completeness_verdict', verdictVersion: 'ts-design-depth-v1', entity: axis('entity'), attribute: axis('attribute'), flow: axis('flow') };",
      "}",
      "function designDepthRegister() {",
      "  const attribute = { kind: 'sdlc_domain_attribute', attributeId: 'attr:Core.retryClosed', name: 'retryClosed', valueType: 'boolean', cardinality: 'one', invariantRefs: ['REQ-ENG-001'] };",
      "  const entity = { kind: 'sdlc_domain_entity', entityId: 'entity:Core', moduleName: 'cdme-core', ownership: 'owned', attributes: [attribute], invariants: ['retry closure is explicit'], sourceAssetRefs: ['template://data_mapper'] };",
      "  const operation = { kind: 'sdlc_domain_operation', operationId: 'operation:Core.retryClosed', moduleName: 'cdme-core', inputEntityIds: ['entity:Core'], outputEntityIds: ['entity:Core'], requiredAttributeIds: ['attr:Core.retryClosed'] };",
      "  const aggregateEntity = { kind: 'sdlc_aggregate_domain_entity', entityId: entity.entityId, ownerModuleName: 'cdme-core', attributes: [attribute], sourceModuleNames: ['cdme-core'] };",
      "  const aggregateDomainModel = { kind: 'sdlc_aggregate_domain_model', modelVersion: 'ts-design-depth-v1', entities: [aggregateEntity], operations: [operation], crossModuleReferences: [], evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  const aggregateSunnyDaySequence = { kind: 'sdlc_aggregate_sunny_day_sequence', sequenceVersion: 'ts-design-depth-v1', steps: [{ kind: 'sdlc_sunny_day_sequence_step', stepId: 'step:Core.retryClosed', moduleName: 'cdme-core', operationId: operation.operationId, inputEntityIds: [entity.entityId], outputEntityIds: [entity.entityId], stateTransitionIds: ['transition:Core.open.closed'] }], evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  const base = { kind: 'sdlc_design_depth_register', registerVersion: 'ts-design-depth-v1', targetAssetType: manifest.targetAssetType };",
      "  if (manifest.targetAssetType === 'implementation_module_surface') return { ...base, moduleSchemaFragments: [{ kind: 'sdlc_module_schema_fragment', moduleName: 'cdme-core', entities: [entity], operations: [operation], requirementIds: ['REQ-ENG-001'], sourceAssetRefs: ['template://data_mapper'] }], moduleStateDiagramFragments: [{ kind: 'sdlc_module_state_diagram_fragment', moduleName: 'cdme-core', entityId: entity.entityId, stateless: false, states: ['open', 'closed'], transitions: [{ kind: 'sdlc_entity_state_transition', transitionId: 'transition:Core.open.closed', fromState: 'open', toState: 'closed', operationId: operation.operationId, entityId: entity.entityId }], requirementIds: ['REQ-ENG-001'], sourceAssetRefs: ['template://data_mapper'] }] };",
      "  if (manifest.targetAssetType === 'aggregate_domain_model_surface') return { ...base, aggregateDomainModel, designCompletenessVerdict: designCompletenessVerdict() };",
      "  if (manifest.targetAssetType === 'aggregate_sunny_day_sequence_surface') return { ...base, aggregateDomainModel, aggregateSunnyDaySequence, designCompletenessVerdict: designCompletenessVerdict() };",
      "  return null;",
      "}",
      "function componentDepthRegister() {",
      "  const componentRow = { kind: 'sdlc_component_realization_row', componentId: 'cdme-core', moduleName: 'cdme-core', relativePath: sourceRelative, publicBoundary: 'Core.retryClosed', requirementIds: ['REQ-DM-001'], sourceAssetRefs: ['fixture://data_mapper'] };",
      "  const topologyRow = { kind: 'sdlc_component_topology_row', componentId: 'cdme-core', moduleName: 'cdme-core', relativePath: sourceRelative, publicBoundary: 'Core.retryClosed', concernRole: 'mapper', requirementIds: ['REQ-DM-001'], sourceAssetRefs: ['fixture://data_mapper'] };",
      "  const testTopologyRow = { kind: 'sdlc_test_component_topology_row', testClassId: 'CoreSpec', relativePath: testRelative, testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-DM-001'], shardId: null };",
      "  const testRow = { kind: 'sdlc_component_test_realization_row', testClassId: 'CoreSpec', relativePath: testRelative, testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-DM-001'], shardId: null };",
      "  const qualificationRow = { kind: 'sdlc_component_test_qualification_row', testClassId: 'CoreSpec', testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-DM-001'], status: 'passed', evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  const repairSchedule = { kind: 'sdlc_component_repair_schedule', registerVersion: 'ts-component-depth-v1', scheduleStatus: 'no_repair_required', repairRows: [], evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  const base = { kind: 'sdlc_component_depth_register', registerVersion: 'ts-component-depth-v1', targetAssetType: manifest.targetAssetType };",
      "  if (manifest.targetAssetType === 'implementation_component_topology_surface') return { ...base, componentTopologyRows: [topologyRow] };",
      "  if (manifest.targetAssetType === 'component_realization_schedule_surface' || manifest.targetAssetType === 'component_code_surface' || manifest.targetAssetType === 'component_realization_qualification_surface') return { ...base, componentRealizationRows: [componentRow] };",
      "  if (manifest.targetAssetType === 'test_component_topology_surface') return { ...base, testComponentTopologyRows: [testTopologyRow] };",
      "  if (manifest.targetAssetType === 'component_test_surface') return { ...base, componentTestRows: [testRow] };",
      "  if (manifest.targetAssetType === 'component_test_qualification_surface') return { ...base, componentTestQualificationRows: [qualificationRow] };",
      "  if (manifest.targetAssetType === 'component_repair_schedule_surface') return { ...base, componentRepairSchedule: repairSchedule };",
      "  if (manifest.targetAssetType === 'release_depth_parity_surface') return { ...base, releaseDepthParity: { kind: 'sdlc_release_depth_parity_assessment', status: 'met', summary: 'component depth parity met for fixture worker', blockingReasons: [], evidenceRefs: [`file://${manifest.outputFile}`] } };",
      "  return null;",
      "}",
      "const designRegister = designDepthRegister();",
      "const componentRegister = componentDepthRegister();",
      "const requirementIds = manifest.traversalObligationContext.obligations.map((obligation) => obligation.obligationId.replace(/^requirement:/, '')).filter((id) => id.startsWith('REQ-')).join(', ') || 'none';",
      "const outputLines = [`# ${manifest.targetAssetType}`];",
      "if (manifest.outputFile.split(path.sep).join('/').includes('/design/adrs/')) outputLines.push('', '| Field | Value |', '|-------|-------|', '| `Status:` | `active` |', `| \\`Implements:\\` | ${requirementIds} |`, `| \\`Derives from:\\` | ${manifest.graphFunctionName} / ${manifest.edgeName} |`, '| `Supersedes:` | none |', '| `Superseded by:` | none |', '| `Retained special case:` | none |');",
      "outputLines.push('', `edge: ${manifest.edgeName}`, '', '## Inputs', ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`));",
      "if (designRegister !== null) outputLines.push('', '```design_depth_register', JSON.stringify(designRegister, null, 2), '```');",
      "if (componentRegister !== null) outputLines.push('', '```component_depth_register', JSON.stringify(componentRegister, null, 2), '```');",
      "const output = outputLines.join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const tenantRelative = sourceRelative;",
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
      "const sourceRelative = 'cdme-core/src/main/scala/cdme/Core.scala';",
      "const testRelative = 'cdme-core/src/test/scala/cdme/CoreSpec.scala';",
      "function componentDepthRegister() {",
      "  const base = { kind: 'sdlc_component_depth_register', registerVersion: 'ts-component-depth-v1', targetAssetType: manifest.targetAssetType };",
      "  const componentRow = { kind: 'sdlc_component_realization_row', componentId: 'cdme-core', moduleName: 'cdme-core', relativePath: sourceRelative, publicBoundary: 'Core.retryClosed', requirementIds: ['REQ-DM-001'], sourceAssetRefs: ['fixture://data_mapper'] };",
      "  const topologyRow = { kind: 'sdlc_component_topology_row', componentId: 'cdme-core', moduleName: 'cdme-core', relativePath: sourceRelative, publicBoundary: 'Core.retryClosed', concernRole: 'mapper', requirementIds: ['REQ-DM-001'], sourceAssetRefs: ['fixture://data_mapper'] };",
      "  const testTopologyRow = { kind: 'sdlc_test_component_topology_row', testClassId: 'CoreSpec', relativePath: testRelative, testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-DM-001'], shardId: 'test-shard-01-cdme-core' };",
      "  const testRow = { kind: 'sdlc_component_test_realization_row', testClassId: 'CoreSpec', relativePath: testRelative, testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-DM-001'], shardId: 'test-shard-01-cdme-core' };",
      "  const qualificationRow = { kind: 'sdlc_component_test_qualification_row', testClassId: 'CoreSpec', testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-DM-001'], status: 'passed', evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  const repairSchedule = { kind: 'sdlc_component_repair_schedule', registerVersion: 'ts-component-depth-v1', scheduleStatus: 'no_repair_required', repairRows: [], evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  if (manifest.targetAssetType === 'implementation_component_topology_surface') return { ...base, componentTopologyRows: [topologyRow] };",
      "  if (manifest.targetAssetType === 'component_realization_schedule_surface' || manifest.targetAssetType === 'component_code_surface' || manifest.targetAssetType === 'component_realization_qualification_surface') return { ...base, componentRealizationRows: [componentRow] };",
      "  if (manifest.targetAssetType === 'test_component_topology_surface') return { ...base, testComponentTopologyRows: [testTopologyRow] };",
      "  if (manifest.targetAssetType === 'component_test_surface') return { ...base, componentTestRows: [testRow] };",
      "  if (manifest.targetAssetType === 'component_test_qualification_surface') return { ...base, componentTestQualificationRows: [qualificationRow] };",
      "  if (manifest.targetAssetType === 'component_repair_schedule_surface') return { ...base, componentRepairSchedule: repairSchedule };",
      "  if (manifest.targetAssetType === 'release_depth_parity_surface') return { ...base, releaseDepthParity: { kind: 'sdlc_release_depth_parity_assessment', status: 'met', summary: 'component depth parity met for fixture worker', blockingReasons: [], evidenceRefs: [`file://${manifest.outputFile}`] } };",
      "  return null;",
      "}",
      "const register = componentDepthRegister();",
      "const requirementIds = manifest.traversalObligationContext.obligations.map((obligation) => obligation.obligationId.replace(/^requirement:/, '')).filter((id) => id.startsWith('REQ-')).join(', ') || 'none';",
      "const outputLines = [`# ${manifest.targetAssetType}`];",
      "if (manifest.outputFile.split(path.sep).join('/').includes('/design/adrs/')) outputLines.push('', '| Field | Value |', '|-------|-------|', '| `Status:` | `active` |', `| \\`Implements:\\` | ${requirementIds} |`, `| \\`Derives from:\\` | ${manifest.graphFunctionName} / ${manifest.edgeName} |`, '| `Supersedes:` | none |', '| `Superseded by:` | none |', '| `Retained special case:` | none |');",
      "outputLines.push('', `edge: ${manifest.edgeName}`, '', '## Inputs', ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`));",
      "if (register !== null) outputLines.push('', '```component_depth_register', JSON.stringify(register, null, 2), '```');",
      "const output = outputLines.join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const tenantRelative = sourceRelative;",
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

function writeSilentWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t066_silent_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "setTimeout(() => {",
      "  process.exit(0);",
      "}, 10000);"
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
  for (const relativePath of [
    ".ai-workspace/events",
    ".ai-workspace/runtime",
    ".abiogenesis",
    ".genesis",
    ".npm-cache",
    "node_modules"
  ]) {
    rmSync(path.join(workspaceRoot, relativePath), {
      recursive: true,
      force: true
    });
  }
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
  assert.equal(parsed.kind, "odd_sdlc_spec_method_result");
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
      "const sourceRelative = 'cdme-core/src/main/scala/cdme/Core.scala';",
      "const testRelative = 'cdme-core/src/test/scala/cdme/CoreSpec.scala';",
      "function designCompletenessVerdict() {",
      "  const axis = (name) => ({ kind: 'sdlc_design_completeness_axis_verdict', axis: name, status: 'satisfied', reasons: [], evidenceRefs: [`file://${manifest.outputFile}`] });",
      "  return { kind: 'sdlc_design_completeness_verdict', verdictVersion: 'ts-design-depth-v1', entity: axis('entity'), attribute: axis('attribute'), flow: axis('flow') };",
      "}",
      "function designDepthRegister() {",
      "  const attribute = { kind: 'sdlc_domain_attribute', attributeId: 'attr:Compiler.mappingPlan', name: 'mappingPlan', valueType: 'string', cardinality: 'one', invariantRefs: ['REQ-ENG-001'] };",
      "  const entity = { kind: 'sdlc_domain_entity', entityId: 'entity:MappingPlan', moduleName: 'cdme-compiler', ownership: 'owned', attributes: [attribute], invariants: ['mapping plan is explicit'], sourceAssetRefs: ['template://data_mapper'] };",
      "  const operation = { kind: 'sdlc_domain_operation', operationId: 'operation:compileMappingPlan', moduleName: 'cdme-compiler', inputEntityIds: ['entity:MappingPlan'], outputEntityIds: ['entity:MappingPlan'], requiredAttributeIds: ['attr:Compiler.mappingPlan'] };",
      "  const aggregateEntity = { kind: 'sdlc_aggregate_domain_entity', entityId: entity.entityId, ownerModuleName: 'cdme-compiler', attributes: [attribute], sourceModuleNames: ['cdme-compiler'] };",
      "  const aggregateDomainModel = { kind: 'sdlc_aggregate_domain_model', modelVersion: 'ts-design-depth-v1', entities: [aggregateEntity], operations: [operation], crossModuleReferences: [], evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  const aggregateSunnyDaySequence = { kind: 'sdlc_aggregate_sunny_day_sequence', sequenceVersion: 'ts-design-depth-v1', steps: [{ kind: 'sdlc_sunny_day_sequence_step', stepId: 'step:compileMappingPlan', moduleName: 'cdme-compiler', operationId: operation.operationId, inputEntityIds: [entity.entityId], outputEntityIds: [entity.entityId], stateTransitionIds: ['transition:MappingPlan.draft.compiled'] }], evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  const base = { kind: 'sdlc_design_depth_register', registerVersion: 'ts-design-depth-v1', targetAssetType: manifest.targetAssetType };",
      "  if (manifest.targetAssetType === 'implementation_module_surface') return { ...base, moduleSchemaFragments: [{ kind: 'sdlc_module_schema_fragment', moduleName: 'cdme-compiler', entities: [entity], operations: [operation], requirementIds: ['REQ-ENG-001'], sourceAssetRefs: ['template://data_mapper'] }], moduleStateDiagramFragments: [{ kind: 'sdlc_module_state_diagram_fragment', moduleName: 'cdme-compiler', entityId: entity.entityId, stateless: false, states: ['draft', 'compiled'], transitions: [{ kind: 'sdlc_entity_state_transition', transitionId: 'transition:MappingPlan.draft.compiled', fromState: 'draft', toState: 'compiled', operationId: operation.operationId, entityId: entity.entityId }], requirementIds: ['REQ-ENG-001'], sourceAssetRefs: ['template://data_mapper'] }] };",
      "  if (manifest.targetAssetType === 'aggregate_domain_model_surface') return { ...base, aggregateDomainModel, designCompletenessVerdict: designCompletenessVerdict() };",
      "  if (manifest.targetAssetType === 'aggregate_sunny_day_sequence_surface') return { ...base, aggregateDomainModel, aggregateSunnyDaySequence, designCompletenessVerdict: designCompletenessVerdict() };",
      "  return null;",
      "}",
      "function componentDepthRegister() {",
      "  const base = { kind: 'sdlc_component_depth_register', registerVersion: 'ts-component-depth-v1', targetAssetType: manifest.targetAssetType };",
      "  const componentRow = { kind: 'sdlc_component_realization_row', componentId: 'cdme-core', moduleName: 'cdme-core', relativePath: sourceRelative, publicBoundary: 'Core.retryClosed', requirementIds: ['REQ-ENG-001'], sourceAssetRefs: ['template://data_mapper'] };",
      "  const topologyRow = { kind: 'sdlc_component_topology_row', componentId: 'cdme-core', moduleName: 'cdme-core', relativePath: sourceRelative, publicBoundary: 'Core.retryClosed', concernRole: 'mapper', requirementIds: ['REQ-ENG-001'], sourceAssetRefs: ['template://data_mapper'] };",
      "  const testTopologyRow = { kind: 'sdlc_test_component_topology_row', testClassId: 'CoreSpec', relativePath: testRelative, testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-ENG-001'], shardId: 'test-shard-01-cdme-core' };",
      "  const testRow = { kind: 'sdlc_component_test_realization_row', testClassId: 'CoreSpec', relativePath: testRelative, testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-ENG-001'], shardId: 'test-shard-01-cdme-core' };",
      "  const qualificationRow = { kind: 'sdlc_component_test_qualification_row', testClassId: 'CoreSpec', testcaseIds: ['TC-DM-001'], componentIds: ['cdme-core'], requirementIds: ['REQ-ENG-001'], status: 'passed', evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  const repairSchedule = { kind: 'sdlc_component_repair_schedule', registerVersion: 'ts-component-depth-v1', scheduleStatus: 'no_repair_required', repairRows: [], evidenceRefs: [`file://${manifest.outputFile}`] };",
      "  if (manifest.targetAssetType === 'implementation_component_topology_surface') return { ...base, componentTopologyRows: [topologyRow] };",
      "  if (manifest.targetAssetType === 'component_realization_schedule_surface' || manifest.targetAssetType === 'component_code_surface' || manifest.targetAssetType === 'component_realization_qualification_surface') return { ...base, componentRealizationRows: [componentRow] };",
      "  if (manifest.targetAssetType === 'test_component_topology_surface') return { ...base, testComponentTopologyRows: [testTopologyRow] };",
      "  if (manifest.targetAssetType === 'component_test_surface') return { ...base, componentTestRows: [testRow] };",
      "  if (manifest.targetAssetType === 'component_test_qualification_surface') return { ...base, componentTestQualificationRows: [qualificationRow] };",
      "  if (manifest.targetAssetType === 'component_repair_schedule_surface') return { ...base, componentRepairSchedule: repairSchedule };",
      "  if (manifest.targetAssetType === 'release_depth_parity_surface') return { ...base, releaseDepthParity: { kind: 'sdlc_release_depth_parity_assessment', status: 'met', summary: 'component depth parity met for data_mapper fixture worker', blockingReasons: [], evidenceRefs: [`file://${manifest.outputFile}`] } };",
      "  return null;",
      "}",
      "const designRegister = designDepthRegister();",
      "const componentRegister = componentDepthRegister();",
      "const requirementIds = manifest.traversalObligationContext.obligations.map((obligation) => obligation.obligationId.replace(/^requirement:/, '')).filter((id) => id.startsWith('REQ-')).join(', ') || 'none';",
      "const outputLines = [`# ${manifest.targetAssetType}`];",
      "if (manifest.outputFile.split(path.sep).join('/').includes('/design/adrs/')) outputLines.push('', '| Field | Value |', '|-------|-------|', '| `Status:` | `active` |', `| \\`Implements:\\` | ${requirementIds} |`, `| \\`Derives from:\\` | ${manifest.graphFunctionName} / ${manifest.edgeName} |`, '| `Supersedes:` | none |', '| `Superseded by:` | none |', '| `Retained special case:` | none |');",
      "outputLines.push('', `edge: ${manifest.edgeName}`, '', '## Inputs', ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`));",
      "if (designRegister !== null) outputLines.push('', '```design_depth_register', JSON.stringify(designRegister, null, 2), '```');",
      "if (componentRegister !== null) outputLines.push('', '```component_depth_register', JSON.stringify(componentRegister, null, 2), '```');",
      "const output = outputLines.join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const materializedFiles = [];",
      "let executionEvidence = null;",
      "if (manifest.productMaterialization.required) {",
      "  const role = manifest.targetAssetType === 'component_test_surface' ? 'test' : 'source';",
      "  const tenantRelative = role === 'test' ? testRelative : sourceRelative;",
      "  const productPath = path.join(manifest.productMaterialization.tenantRoot, tenantRelative);",
      "  mkdirSync(dirname(productPath), { recursive: true });",
      "  const declaredCapabilityMarkers = manifest.conformedProject.capabilityContracts.map((contract) => `${contract.name} ${contract.value}`).join(' ');",
      "  const capabilityMarkers = declaredCapabilityMarkers.length > 0 ? declaredCapabilityMarkers : 'spark_session dataframe_reads';",
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
      "if (manifest.targetAssetType === 'test_execution_result_surface') {",
      "  const reportPath = path.join(manifest.archiveRoot, 'junit-report.xml');",
      "  const report = '<testsuite tests=\"1\" failures=\"0\"><testcase classname=\"cdme.CoreSpec\" name=\"provesCore\"/></testsuite>\\n';",
      "  writeFileSync(reportPath, report, 'utf8');",
      "  const shardEvidence = manifest.productMaterialization.executionShards.map((shard) => ({ kind: 'sdlc_worker_execution_shard_evidence', shardId: shard.shardId, moduleName: shard.moduleName, lane: 'test', command: shard.command, status: 'succeeded', reportRefs: [`file://${reportPath}`], testsObserved: 1, passedCount: 1, failedCount: 0 }));",
      "  executionEvidence = { kind: 'sdlc_worker_execution_evidence', lane: 'test', command: manifest.productMaterialization.testExecutionContract, status: 'succeeded', reportRefs: [`file://${reportPath}`], testsObserved: shardEvidence.length, passedCount: shardEvidence.length, failedCount: 0, shardEvidence };",
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
  const outputRef = `file://${input.manifest.outputFile}`;
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
            evidenceRefs: evidenceRefs.length > 0 ? evidenceRefs : [outputRef],
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

function retryContextForModule(input = {}) {
  const edgeName = input.edgeName ?? "derive_test_execution_result_surface";
  const targetAssetType = input.targetAssetType ?? "test_execution_result_surface";
  return {
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: [],
    priorGapDossiers: [
      {
        kind: "sdlc_postflight_gap_dossier",
        dossierVersion: "ts-gap-dossier-v1",
        graphFunctionName: "bootstrap_release_self_test",
        edgeName,
        vectorIndex: input.vectorIndex ?? 17,
        targetAssetType,
        status: "open",
        reasons: [
          {
            kind: "sdlc_postflight_gap_reason",
            reason: "module-scoped retry for cdme-compiler",
            reasonClass: "assurance",
            blockingReason: {
              kind: "sdlc_blocking_reason",
              code: "source_asset_dependency_missing",
              reasonClass: "assurance",
              lawfulReentryPoint: "same_edge_retry",
              message: "Retry narrows current closure pressure to admitted shard scope.",
              detail: "module=cdme-compiler",
              evidenceRefs: []
            }
          }
        ],
        evidenceRefs: [],
        priorManifestId: "manifest://t066/retry",
        currentGapDossierRef: "gap://t066/cdme-compiler",
        retryEligible: true,
        nextLawfulActions: ["retry_same_edge"]
      }
    ]
  };
}

test("T-066 code-surface handoff admits tenant-root product source materialization", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  assert.equal(constraints.activeTenant, "scala_spark");
  assert.equal(constraints.selectedOutputRoot, "build_tenants/scala_spark");
  const contract = hookContractByEdgeName("derive_component_code_surface");
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
      (obligation) =>
        obligation.obligationKind === "requirement" &&
        obligation.summary.includes("REQ-T066-001") &&
        obligation.obligationId !== "requirement:REQ-T066-001"
    ),
    true
  );
  assert.equal(
    manifest.traversalObligationContext.obligations.some(
      (obligation) => obligation.obligationId === "target_asset:component_code_surface"
    ),
    true
  );
  assert.equal(
    manifest.traversalObligationContext.deltaSummary.requirementCount,
    2
  );
  assert.equal(
    manifest.allowedWriteRoots.includes(manifest.productMaterialization.tenantRoot),
    true
  );
  assert.equal(
    path.relative(workspace, manifest.outputFile).split(path.sep).join("/"),
    "build_tenants/scala_spark/design/component_code_surface.md"
  );

  const output = writeOutputSurface(manifest, "component_code_surface");
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

test("T-144 assurance gate routes missing obligation assessments to same-edge retry", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t144-assurance-missing-obligation"
  });
  const output = writeOutputSurface(manifest, "component_code_surface");
  const sourceContent = [
    "package generated",
    "",
    "final case class MissingAssessmentProbe(value: String)"
  ].join("\n");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/MissingAssessmentProbe.scala"
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
  const report = {
    kind: "odd_sdlc.worker_result_report",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile,
    digest: output.digest,
    summary: "generated product source while omitting obligation assessment",
    unresolvedReasons: [],
    materializedFiles,
    executionEvidence: null,
    obligationAssessments: []
  };
  const gate = deriveSdlcOperatorAssuranceGate({
    manifest,
    report,
    postflight: {
      kind: "sdlc_operator_postflight_result",
      status: "passed",
      blockingReasons: [],
      blockingReasonCarriers: [],
      evidenceRefs: [`file://${productFile}`]
    }
  });

  assert.equal(gate.satisfaction.status, "retry_same_edge");
  assert(gate.blockingPostflight);
  const missingAssessmentReason =
    gate.blockingPostflight.blockingReasonCarriers.find((reason) =>
      reason.detail.startsWith("obligation_assessment_missing:")
    );
  assert(missingAssessmentReason);
  assert.equal(missingAssessmentReason.lawfulReentryPoint, "same_edge_retry");
  assert.notEqual(missingAssessmentReason.lawfulReentryPoint, "operator_blocked");
});

test("T-144 invalid component-depth register is observable but does not block fulfilled product materialization", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "derive_component_code_surface",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t144-component-depth-nonblocking"
  });
  writeHandoffFiles(manifest);
  const sourcePath = path.join(manifest.productMaterialization.tenantRoot, "src/hello.js");
  const sourceContent = "console.log('Hello, world!');\n";
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(sourcePath, sourceContent, "utf8");
  const invalidRegisterArtifact = [
    "# component_code_surface",
    "",
    "```json component_depth_register",
    JSON.stringify(
      {
        kind: "sdlc_component_depth_register",
        registerVersion: "ts-component-depth-v1",
        targetAssetType: "component_code_surface",
        componentRealizationRows: [
          {
            kind: "sdlc_component_realization_row",
            componentId: "component:hello",
            moduleName: "hello_world_javascript",
            relativePath: "src/hello.js",
            publicBoundary: 3,
            requirementIds: ["REQ-T066-001"],
            sourceAssetRefs: ["fixture://t144"]
          }
        ]
      },
      null,
      2
    ),
    "```",
    ""
  ].join("\n");
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, invalidRegisterArtifact, "utf8");
  writeReport({
    manifest,
    digest: sha256Text(invalidRegisterArtifact),
    summary: "materialized source with noncanonical component-depth register",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "src/hello.js",
        absolutePath: sourcePath,
        digest: sha256Text(sourceContent),
        byteCount: Buffer.byteLength(sourceContent, "utf8")
      }
    ]
  });

  const report = readWorkerResultReport(manifest);
  const gate = deriveSdlcOperatorAssuranceGate({
    manifest,
    report,
    postflight: {
      kind: "sdlc_operator_postflight_result",
      status: "passed",
      blockingReasons: [],
      blockingReasonCarriers: [],
      evidenceRefs: [`file://${sourcePath}`]
    }
  });
  const componentDepth = gate.ledgers.find((ledger) => ledger.dimension === "component_depth");

  assert(componentDepth);
  assert.equal(componentDepth.required, false);
  assert.equal(componentDepth.verdict, "open_gap");
  assert.equal(
    componentDepth.reasons.some((reason) =>
      reason.code.startsWith("component_depth_register_invalid:")
    ),
    true,
    JSON.stringify(componentDepth.reasons, null, 2)
  );
  assert.equal(gate.satisfaction.status, "close_allowed");
  assert.equal(gate.blockingPostflight, null);
});

test("T-004 tenant-local surface output is not counted as product source materialization", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t004-tenant-local-surface-output"
  });
  const before = snapshotProductMaterializationRoot(
    manifest.productMaterialization
  );
  const output = writeOutputSurface(manifest, "component_code_surface");
  const productContent = [
    "package generated",
    "",
    "// Implements: REQ-T066-001",
    "final case class TenantSurfacePlacement(value: String)"
  ].join("\n");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/TenantSurfacePlacement.scala"
  );
  mkdirSync(dirname(productFile), { recursive: true });
  writeFileSync(productFile, `${productContent}\n`, "utf8");

  const report = buildPostTransformWorkerResultReport({ manifest, before });

  assert.equal(output.digest, sha256Text(readFileSync(manifest.outputFile, "utf8")));
  assert.equal(
    path.relative(workspace, manifest.outputFile).split(path.sep).join("/"),
    "build_tenants/scala_spark/design/component_code_surface.md"
  );
  assert.deepStrictEqual(
    report.materializedFiles.map((file) => file.relativePath),
    ["src/main/scala/generated/TenantSurfacePlacement.scala"]
  );
  assert.equal(report.materializedFiles[0].role, "source");
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed");
});

test("T-002 component-code materialization ignores build execution byproducts", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t002-component-code-byproduct-filter"
  });
  const before = snapshotProductMaterializationRoot(
    manifest.productMaterialization
  );
  writeHandoffFiles(manifest);
  writeOutputSurface(manifest, "component_code_surface");
  const sourceRelativePath = "src/main/scala/generated/Generated.scala";
  const sourcePath = path.join(
    manifest.productMaterialization.tenantRoot,
    sourceRelativePath
  );
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(
    sourcePath,
    [
      "package generated",
      "",
      "// Implements: REQ-T066-001",
      "final case class Generated(value: String)"
    ].join("\n") + "\n",
    "utf8"
  );
  const byproductPaths = [
    "target/debug/.cargo-lock",
    "target/debug/incremental/generated.lock",
    ".bsp/sbt.json"
  ];
  for (const relativePath of byproductPaths) {
    const absolutePath = path.join(
      manifest.productMaterialization.tenantRoot,
      relativePath
    );
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(
      absolutePath,
      relativePath.endsWith(".lock") ? "" : "build-tool byproduct\n",
      "utf8"
    );
  }
  const sbtProjectRelativePath = "project/build.properties";
  const sbtProjectFile = path.join(
    manifest.productMaterialization.tenantRoot,
    sbtProjectRelativePath
  );
  mkdirSync(dirname(sbtProjectFile), { recursive: true });
  writeFileSync(sbtProjectFile, "sbt.version=1.10.7\n", "utf8");

  const report = buildPostTransformWorkerResultReport({ manifest, before });

  assert.deepStrictEqual(
    report.materializedFiles.map((file) => file.relativePath),
    [sbtProjectRelativePath, sourceRelativePath]
  );
  assert.equal(report.materializedFiles[0].role, "other");
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed");
});

test("T-004 design edges write tenant-local design surfaces instead of runtime asset files", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_implementation_design_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 4,
    contract,
    projectConstraints: constraints,
    runId: "t004-design-surface-placement"
  });
  const files = writeHandoffFiles(manifest);
  const prompt = readFileSync(files.promptPath, "utf8");

  assert.equal(manifest.productMaterialization.required, false);
  assert.equal(
    path.relative(workspace, manifest.outputFile).split(path.sep).join("/"),
    "build_tenants/scala_spark/design/adrs/ADR-002-implementation-design-surface.md"
  );
  assert.equal(
    manifest.allowedWriteRoots.includes(manifest.productMaterialization.tenantRoot),
    true
  );
  assert.match(prompt, /tenant-local SDLC surface/u);
  assert.match(prompt, /design\/adrs\/ADR-002-implementation-design-surface\.md/u);
  assert.match(prompt, /Status:, Implements:, Derives from:, Supersedes:, Superseded by:/u);
});

test("T-144 ADR field grammar is worker context, not a postflight FD gate", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_implementation_design_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 4,
    contract,
    projectConstraints: constraints,
    runId: "t004-adr-field-validation"
  });
  writeHandoffFiles(manifest);
  const incomplete = writeOutputSurface(manifest, "implementation_design_surface");
  writeReport({
    manifest,
    digest: incomplete.digest,
    summary: "generated ADR path without ADR fields",
    materializedFiles: []
  });
  const advisory = evaluateWorkerResultPostflight({
    manifest,
    report: readWorkerResultReport(manifest)
  });
  assert.equal(advisory.status, "passed");
  assert.equal(
    advisory.blockingReasons.includes("adr_output_required_field_missing:Status"),
    false
  );

  const adr = [
    "# ADR-002 Implementation Design Surface",
    "",
    "| Field | Value |",
    "|-------|-------|",
    "| `Status:` | `active` |",
    "| `Implements:` | REQ-T066-001 |",
    "| `Derives from:` | bootstrap_release_self_test / derive_implementation_design_surface |",
    "| `Supersedes:` | none |",
    "| `Superseded by:` | none |",
    "| `Retained special case:` | none |",
    "",
    "## Context",
    "",
    "Tenant-local implementation design must live under design/adrs.",
    "",
    "## Decision",
    "",
    "Write the implementation design decision into the tenant ADR folder."
  ].join("\n");
  writeFileSync(manifest.outputFile, `${adr}\n`, "utf8");
  writeReport({
    manifest,
    digest: sha256Text(`${adr}\n`),
    summary: "generated ADR path with ADR fields",
    materializedFiles: []
  });
  const passed = evaluateWorkerResultPostflight({
    manifest,
    report: readWorkerResultReport(manifest)
  });
  assert.equal(passed.status, "passed");
});

test("T-066 code-surface postflight rejects markdown-only realization", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
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
  const output = writeOutputSurface(manifest, "component_code_surface");
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

test("T-158 product materialization repair replays prior same-edge manifest", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const firstManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000000000Z_pid158"
  });
  writeHandoffFiles(firstManifest);
  const firstOutput = writeOutputSurface(firstManifest, "component_code_surface");
  const sourcePath = path.join(
    firstManifest.productMaterialization.tenantRoot,
    "src/main/scala/Example.scala"
  );
  const sourceContent = [
    "package example",
    "",
    "object Example {",
    "  def value: String = \"ok\"",
    "}"
  ].join("\n");
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(sourcePath, `${sourceContent}\n`, "utf8");
  writeReport({
    manifest: firstManifest,
    digest: firstOutput.digest,
    summary: "initial product source materialization",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "src/main/scala/Example.scala",
        absolutePath: sourcePath,
        digest: sha256Text(`${sourceContent}\n`),
        byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8")
      }
    ]
  });
  const firstReport = readWorkerResultReport(firstManifest);
  writeProductMaterializationManifest({
    manifest: firstManifest,
    report: firstReport
  });

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000100000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const repairOutput = writeOutputSurface(
    repairManifest,
    "component_code_surface_trace_repair"
  );
  writeReport({
    manifest: repairManifest,
    digest: repairOutput.digest,
    summary: "trace-only repair with no product rewrite",
    materializedFiles: []
  });

  const repairReport = readWorkerResultReport(repairManifest);
  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: repairReport
  });
  writeProductMaterializationManifest({
    manifest: repairManifest,
    report: repairReport
  });
  const replayedManifest = JSON.parse(
    readFileSync(repairManifest.productMaterialization.manifestFile, "utf8")
  );

  assert.equal(postflight.status, "passed");
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_files_missing"),
    false
  );
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_role_missing:source"),
    false
  );
  assert.equal(replayedManifest.files.length, 1);
  assert.equal(
    replayedManifest.replay.lineageRefs.includes(
      `file://${firstManifest.productMaterialization.manifestFile}`
    ),
    true
  );
});

test("T-131 shallow realization assurance admits bounded runtime error guards", () => {
  const closed = deriveShallowRealizationAssuranceLedger({
    synthesisRequired: false,
    executableProofRequired: false,
    surfaces: [
      {
        kind: "sdlc_realization_text_surface",
        role: "source",
        ref: "file://src/cli/parseArgs.ts",
        content: [
          "export function requireName(value: string | undefined): string {",
          "  if (value === undefined) {",
          "    throw new Error(\"missing required workspace name\");",
          "  }",
          "  return value;",
          "}"
        ].join("\n")
      }
    ]
  });
  const rejected = deriveShallowRealizationAssuranceLedger({
    synthesisRequired: false,
    executableProofRequired: false,
    surfaces: [
      {
        kind: "sdlc_realization_text_surface",
        role: "source",
        ref: "file://src/cli/parseArgs.ts",
        content: [
          "export function requireName(): never {",
          "  throw new Error(\"not implemented\");",
          "}"
        ].join("\n")
      }
    ]
  });

  assert.equal(closed.verdict, "satisfied");
  assert.equal(rejected.verdict, "open_gap");
  assert.deepStrictEqual(rejected.reasons.map((reason) => reason.code), [
    "placeholder_surface:file://src/cli/parseArgs.ts"
  ]);
});

test("T-131 component-depth assurance admits already-materialized declared product paths", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 15,
    contract,
    projectConstraints: constraints,
    runId: "t131-incremental-component-code"
  });
  writeHandoffFiles(manifest);
  const sourcePath = path.join(manifest.productMaterialization.tenantRoot, "src/cli.ts");
  const domainPath = path.join(
    manifest.productMaterialization.tenantRoot,
    "domains/document_to_requirements/domain.json"
  );
  const sourceContent = [
    "// Implements: REQ-T066-001",
    "export function run(): string {",
    "  return \"ok\";",
    "}"
  ].join("\n");
  const domainContent = JSON.stringify(
    {
      kind: "odd_chat_domain",
      graphFunctions: [
        {
          id: "graph_function:document_to_requirements",
          name: "document_to_requirements"
        }
      ]
    },
    null,
    2
  );
  mkdirSync(dirname(sourcePath), { recursive: true });
  mkdirSync(dirname(domainPath), { recursive: true });
  writeFileSync(sourcePath, `${sourceContent}\n`, "utf8");
  writeFileSync(domainPath, `${domainContent}\n`, "utf8");
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_code_surface",
    componentRealizationRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId: "component:app-core.cli",
        moduleName: "app-core",
        relativePath: "src/cli.ts",
        publicBoundary: "exports the CLI command boundary",
        requirementIds: ["REQ-T066-001"],
        sourceAssetRefs: ["asset://t131/bootstrap"]
      },
      {
        kind: "sdlc_component_realization_row",
        componentId: "component:app-core.default-domain-fixture",
        moduleName: "app-core",
        relativePath: "domains/document_to_requirements/domain.json",
        publicBoundary: "provides the default deployed domain fixture",
        requirementIds: ["REQ-T066-001"],
        sourceAssetRefs: ["asset://t131/bootstrap"]
      }
    ]
  };
  const artifact = [
    "# component_code_surface",
    "",
    "```json component_depth_register",
    JSON.stringify(register, null, 2),
    "```",
    ""
  ].join("\n");
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, artifact, "utf8");
  writeReport({
    manifest,
    digest: sha256Text(artifact),
    summary: "generated product source with unchanged default domain fixture",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "src/cli.ts",
        absolutePath: sourcePath,
        digest: sha256Text(`${sourceContent}\n`),
        byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8")
      }
    ]
  });

  const report = readWorkerResultReport(manifest);
  const ledger = deriveComponentDepthAssuranceLedger({ manifest, report });

  assert(ledger);
  assert.equal(
    ledger.reasons.some(
      (reason) =>
        reason.code ===
        "component_declared_path_not_materialized:domains/document_to_requirements/domain.json"
    ),
    false,
    JSON.stringify(ledger.reasons, null, 2)
  );
  assert.equal(ledger.verdict, "satisfied");
});

test("T-102 post-transform observation admits existing discoverable test files", () => {
  const workspace = makeWorkspace();
  const testRelativePath =
    "cdme-compiler/src/test/scala/cdme/compiler/ExistingSpec.scala";
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "## Expected Product Files",
      "",
      `- build_tenants/scala_spark/${testRelativePath} role=test`
    ].join("\n"),
    "utf8"
  );
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_test_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 15,
    contract,
    projectConstraints: constraints,
    runId: "t102-existing-test-materialization"
  });
  const testPath = path.join(
    manifest.productMaterialization.tenantRoot,
    testRelativePath
  );
  mkdirSync(dirname(testPath), { recursive: true });
  writeFileSync(
    testPath,
    [
      "package cdme.compiler",
      "",
      "import org.scalatest.funsuite.AnyFunSuite",
      "",
      "// Validates: REQ-T066-001",
      "class ExistingSpec extends AnyFunSuite {",
      "  test(\"existing spec is admitted as materialization evidence\") {",
      "    assert(1 == 1)",
      "  }",
      "}"
    ].join("\n") + "\n",
    "utf8"
  );
  const before = snapshotProductMaterializationRoot(
    manifest.productMaterialization
  );
  writeHandoffFiles(manifest);
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(
    manifest.outputFile,
    [
      "# component_test_surface",
      "",
      "edge: derive_component_test_surface",
      "",
      "This transform reclassifies existing tenant tests as current edge evidence.",
      "",
      "REQ-T066-001"
    ].join("\n") + "\n",
    "utf8"
  );

  const report = buildPostTransformWorkerResultReport({ manifest, before });

  assert.equal(report.materializedFiles.length, 1);
  assert.equal(report.materializedFiles[0].role, "test");
  assert.equal(report.materializedFiles[0].relativePath, testRelativePath);
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed");
});

test("T-102 post-transform observation ignores test-module build byproducts", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_test_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 15,
    contract,
    projectConstraints: constraints,
    runId: "t102-test-module-byproduct-filter"
  });
  const before = snapshotProductMaterializationRoot(
    manifest.productMaterialization
  );
  writeHandoffFiles(manifest);
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(
    manifest.outputFile,
    [
      "# component_test_surface",
      "",
      "edge: derive_component_test_surface",
      "",
      "This transform writes one test and a build tool emits target files.",
      "",
      "REQ-T066-001"
    ].join("\n") + "\n",
    "utf8"
  );
  const testRelativePath =
    "cdme-compiler/src/test/scala/cdme/compiler/GeneratedSpec.scala";
  const testPath = path.join(
    manifest.productMaterialization.tenantRoot,
    testRelativePath
  );
  mkdirSync(dirname(testPath), { recursive: true });
  writeFileSync(
    testPath,
    [
      "package cdme.compiler",
      "",
      "import org.scalatest.funsuite.AnyFunSuite",
      "",
      "// Validates: REQ-T066-001",
      "class GeneratedSpec extends AnyFunSuite {",
      "  test(\"generated spec is admitted\") { assert(1 == 1) }",
      "}"
    ].join("\n") + "\n",
    "utf8"
  );
  const byproductPaths = [
    "cdme-compiler/target/scala-2.13/test-zinc/inc_compile_2.13.zip",
    "cdme-compiler/target/test-reports/TEST-cdme.compiler.GeneratedSpec.xml",
    ".bsp/sbt.json"
  ];
  for (const relativePath of byproductPaths) {
    const absolutePath = path.join(
      manifest.productMaterialization.tenantRoot,
      relativePath
    );
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, "build-tool byproduct\n", "utf8");
  }

  const report = buildPostTransformWorkerResultReport({ manifest, before });

  assert.deepStrictEqual(
    report.materializedFiles.map((file) => file.relativePath),
    [testRelativePath]
  );
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed");
});

test("T-066 test execution result postflight rejects missing execution evidence", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 17,
    contract,
    projectConstraints: constraints,
    runId: "t066-missing-execution-evidence"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "test_execution_result_surface");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated only a test execution result markdown surface",
    materializedFiles: []
  });

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "blocked");
  const missingReason = postflight.blockingReasonCarriers.find(
    (reason) => reason.code === "test_execution_evidence_missing"
  );
  assert.notEqual(missingReason, undefined);
  assert.match(missingReason.detail, /No sdlc_worker_execution_evidence block/);
});

test("T-104 test-run archive is surface-only and does not require fresh execution evidence", () => {
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

  assert.match(prompt, /do not run test commands/);
  assert.match(prompt, /do not emit fresh sdlc_worker_execution_evidence/);
  assert.match(prompt, /Archive the admitted test_execution_result_surface/);
  assert.doesNotMatch(prompt, /run that command from the tenant root/);

  const output = writeOutputSurface(manifest, "test_run_archive_surface");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated archive over prior test execution result truth",
    materializedFiles: [],
    executionEvidence: null
  });

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(report.executionEvidence, null);
  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("test_execution_evidence_missing"),
    false
  );
  assert.equal(
    postflight.blockingReasons.every(
      (reason) => reason !== "test_execution_not_succeeded"
    ),
    true
  );
  assert.equal(
    postflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "source_asset_dependency_missing" &&
        reason.detail.includes("test_execution_result_surface") &&
        reason.detail.includes("admitted execution-result report missing")
    ),
    true
  );
});

test("T-104 test-run archive closure depends on cited execution-result truth", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const executionContract = hookContractByEdgeName("derive_test_execution_result_surface");
  const executionManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: executionContract.edgeName,
    vectorIndex: 17,
    contract: executionContract,
    projectConstraints: constraints,
    runId: "t104-source-execution-result"
  });
  writeHandoffFiles(executionManifest);
  const executionOutput = writeOutputSurface(
    executionManifest,
    "test_execution_result_surface"
  );
  const executionReportPath = path.join(executionManifest.archiveRoot, "junit-report.xml");
  writeFileSync(
    executionReportPath,
    '<testsuite tests="1" failures="0"><testcase classname="cdme.CoreSpec" name="provesCore"/></testsuite>\n',
    "utf8"
  );
  const shardEvidence = executionManifest.productMaterialization.executionShards.map(
    (shard) => ({
      kind: "sdlc_worker_execution_shard_evidence",
      shardId: shard.shardId,
      moduleName: shard.moduleName,
      lane: "test",
      command: shard.command,
      status: "succeeded",
      reportRefs: [`file://${executionReportPath}`],
      testsObserved: 1,
      passedCount: 1,
      failedCount: 0
    })
  );
  writeFileSync(
    executionManifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: executionManifest.graphFunctionName,
        edgeName: executionManifest.edgeName,
        targetAssetType: executionManifest.targetAssetType,
        outputFile: executionManifest.outputFile,
        digest: executionOutput.digest,
        summary: "admitted execution-result dependency with shard truth",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: executionManifest.productMaterialization.testExecutionContract,
          status: "succeeded",
          reportRefs: [`file://${executionReportPath}`],
          testsObserved: shardEvidence.length,
          passedCount: shardEvidence.length,
          failedCount: 0,
          shardEvidence
        },
        obligationAssessments: executionManifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: [`file://${executionManifest.outputFile}`, `file://${executionReportPath}`],
            blockingReasons: []
          })
        )
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  const executionReport = readWorkerResultReport(executionManifest);
  const executionPostflight = evaluateWorkerResultPostflight({
    manifest: executionManifest,
    report: executionReport
  });
  assert.equal(executionPostflight.status, "passed");

  const contract = hookContractByEdgeName("derive_test_run_archive_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 18,
    contract,
    projectConstraints: constraints,
    runId: "t104-archive-cites-execution-result"
  });
  writeHandoffFiles(manifest);
  const content = [
    "# test_run_archive_surface",
    "",
    "Archived dependencies:",
    ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`),
    "Requirement trace: REQ-T066-001"
  ].join("\n");
  const artifact = `${content}\n`;
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, artifact, "utf8");
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
        digest: sha256Text(artifact),
        summary: "archive names execution-result dependency without carrier truth",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: null,
        obligationAssessments: manifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: [outputRef, ...obligation.evidenceRefs.filter(
              (ref) => !ref.endsWith("/worker_result_report.json")
            )],
            blockingReasons: []
          })
        )
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const proseOnlyReport = readWorkerResultReport(manifest);
  const proseOnlyPostflight = evaluateWorkerResultPostflight({
    manifest,
    report: proseOnlyReport
  });

  assert.equal(proseOnlyPostflight.status, "blocked");
  assert.equal(
    proseOnlyPostflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "source_asset_dependency_missing" &&
        reason.detail.includes("admitted execution-result report missing")
    ),
    true
  );

  writeFileSync(
    manifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: manifest.graphFunctionName,
        edgeName: manifest.edgeName,
        targetAssetType: manifest.targetAssetType,
        outputFile: manifest.outputFile,
        digest: sha256Text(artifact),
        summary: "archive cites admitted execution-result dependency",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: null,
        obligationAssessments: manifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: obligation.obligationId ===
              "source_asset:test_execution_result_surface"
              ? [outputRef, `file://${executionManifest.reportFile}`, ...obligation.evidenceRefs]
              : [outputRef, ...obligation.evidenceRefs],
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

  assert.equal(postflight.status, "passed");
});

test("T-115 test-run archive admits structurally valid failed execution evidence", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const executionContract = hookContractByEdgeName("derive_test_execution_result_surface");
  const executionManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: executionContract.edgeName,
    vectorIndex: 17,
    contract: executionContract,
    projectConstraints: constraints,
    runId: "t115-archive-failed-execution-result"
  });
  writeHandoffFiles(executionManifest);
  const executionOutput = writeOutputSurface(
    executionManifest,
    "test_execution_result_surface"
  );
  const shard = executionManifest.productMaterialization.executionShards[0];
  writeFileSync(
    executionManifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: executionManifest.graphFunctionName,
        edgeName: executionManifest.edgeName,
        targetAssetType: executionManifest.targetAssetType,
        outputFile: executionManifest.outputFile,
        digest: executionOutput.digest,
        summary: "admitted failed execution-result dependency",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: shard.command,
          status: "failed",
          reportRefs: [`file://${executionManifest.outputFile}`],
          testsObserved: 0,
          passedCount: 0,
          failedCount: 0,
          shardEvidence: [
            {
              kind: "sdlc_worker_execution_shard_evidence",
              shardId: shard.shardId,
              moduleName: shard.moduleName,
              lane: "test",
              command: shard.command,
              status: "failed",
              reportRefs: [`file://${executionManifest.outputFile}`],
              testsObserved: 0,
              passedCount: 0,
              failedCount: 0
            }
          ]
        },
        obligationAssessments: executionManifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: [`file://${executionManifest.outputFile}`],
            blockingReasons: []
          })
        )
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  const executionReport = readWorkerResultReport(executionManifest);
  assert.equal(
    evaluateWorkerResultPostflight({
      manifest: executionManifest,
      report: executionReport
    }).status,
    "passed"
  );

  const contract = hookContractByEdgeName("derive_test_run_archive_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 18,
    contract,
    projectConstraints: constraints,
    runId: "t115-archive-cites-failed-execution-result"
  });
  writeHandoffFiles(manifest);
  const content = [
    "# test_run_archive_surface",
    "",
    "Archived dependencies:",
    ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`),
    "Requirement trace: REQ-T066-001"
  ].join("\n");
  const artifact = `${content}\n`;
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, artifact, "utf8");
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
        digest: sha256Text(artifact),
        summary: "archive cites admitted failed execution-result dependency",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: null,
        obligationAssessments: manifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: obligation.obligationId ===
              "source_asset:test_execution_result_surface"
              ? [outputRef, `file://${executionManifest.reportFile}`, ...obligation.evidenceRefs]
              : [outputRef, ...obligation.evidenceRefs],
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

  assert.equal(postflight.status, "passed");
});

test("T-104 test-run archive rejects legacy fresh execution evidence reports", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_run_archive_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 18,
    contract,
    projectConstraints: constraints,
    runId: "t104-archive-rejects-execution-evidence"
  });
  writeHandoffFiles(manifest);
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
        summary: "legacy archive report tries to emit fresh execution evidence",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: manifest.productMaterialization.testExecutionContract,
          status: "succeeded",
          reportRefs: [outputRef],
          testsObserved: 1,
          passedCount: 1,
          failedCount: 0,
          shardEvidence: []
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

  assert.throws(
    () => readWorkerResultReport(manifest),
    /target asset type does not admit execution evidence/u
  );
});

test("T-094/T-095 test execution result rejects non-contract not-run status", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 17,
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
    /Pending evidence is a lawful non-closure carrier for triage or repricing/
  );
  assert.match(
    prompt,
    /do not present a not-run document as release closure evidence/
  );

  const output = writeOutputSurface(manifest, "test_execution_result_surface");
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
        summary: "test execution result reports that execution did not run",
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
          failedCount: 0,
          shardEvidence: manifest.productMaterialization.executionShards.map(
            (shard) => ({
              kind: "sdlc_worker_execution_shard_evidence",
              shardId: shard.shardId,
              moduleName: shard.moduleName,
              lane: "test",
              command: shard.command,
              status: "not_run",
              reportRefs: [outputRef],
              testsObserved: 0,
              passedCount: 0,
              failedCount: 0
            })
          )
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

  assert.throws(() => readWorkerResultReport(manifest), /status/u);
});

test("B-077 execution evidence contradiction stops for triage instead of retry", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 18,
    contract,
    projectConstraints: constraints,
    runId: "b077-execution-evidence-contradiction"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "test_execution_result_surface");
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
        summary: "test execution result reports failed status with zero failed tests",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: manifest.productMaterialization.testExecutionContract,
          status: "failed",
          reportRefs: [outputRef],
          testsObserved: 63,
          passedCount: 63,
          failedCount: 0,
          shardEvidence: manifest.productMaterialization.executionShards.map(
            (shard) => ({
              kind: "sdlc_worker_execution_shard_evidence",
              shardId: shard.shardId,
              moduleName: shard.moduleName,
              lane: "test",
              command: shard.command,
              status: "failed",
              reportRefs: [outputRef],
              testsObserved: 63,
              passedCount: 63,
              failedCount: 0
            })
          )
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
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasonCarriers.some(
      (reason) => reason.code === "test_execution_evidence_contradiction"
    ),
    true
  );
  assert.equal(
    postflight.blockingReasons.includes("test_execution_not_succeeded"),
    false
  );
  assert.equal(
    postflight.blockingReasonCarriers.find(
      (reason) => reason.code === "test_execution_evidence_contradiction"
    )?.lawfulReentryPoint,
    "triage_gap"
  );
  const dossier = constructPostflightGapDossier({ manifest, postflight });
  assert.equal(dossier.retryEligible, false);
  assert.deepStrictEqual(dossier.nextLawfulActions, ["triage_gap"]);
});

test("B-072 post-transform test execution result admits embedded execution evidence", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 17,
    contract,
    projectConstraints: constraints,
    runId: "b072-transform-execution-evidence"
  });
  writeHandoffFiles(manifest);
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  const content = [
    "# test_execution_result_surface",
    "",
    "The transform returns governed test execution evidence.",
    "",
    "```json",
    JSON.stringify(
      {
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: manifest.productMaterialization.testExecutionContract,
          status: "succeeded",
          reportRefs: [],
          testsObserved: 2,
          passedCount: 2,
          failedCount: 0,
          shardEvidence: manifest.productMaterialization.executionShards.map(
            (shard) => ({
              kind: "sdlc_worker_execution_shard_evidence",
              shardId: shard.shardId,
              moduleName: shard.moduleName,
              lane: "test",
              command: shard.command,
              status: "succeeded",
              reportRefs: [],
              testsObserved: 2,
              passedCount: 2,
              failedCount: 0
            })
          )
        }
      },
      null,
      2
    ),
    "```"
  ].join("\n");
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, `${content}\n`, "utf8");

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  assert.equal(report.executionEvidence?.status, "succeeded");
  assert.equal(report.executionEvidence?.testsObserved, 2);
  assert.deepStrictEqual(report.executionEvidence?.reportRefs, [
    `file://${manifest.outputFile}`
  ]);
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed");
});

test("B-084 post-transform execution evidence drops worker-local metadata from typed carrier", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 26,
    contract,
    projectConstraints: constraints,
    runId: "b084-transform-execution-evidence-metadata"
  });
  writeHandoffFiles(manifest);
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  mkdirSync(path.join(manifest.productMaterialization.tenantRoot, "project/target"), {
    recursive: true
  });
  writeFileSync(
    path.join(manifest.productMaterialization.tenantRoot, "project/target/build.properties"),
    "sbt.version=1.10.7\n",
    "utf8"
  );
  const shard = manifest.productMaterialization.executionShards[0];
  const content = [
    "# test_execution_result_surface",
    "",
    "The transform returns governed pending test execution evidence with worker-local metadata.",
    "",
    "```yaml",
    "kind: sdlc_feature_scope_acknowledgment",
    "mode: steel_thread",
    "```",
    "",
    "```json",
    JSON.stringify(
      {
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: manifest.productMaterialization.testExecutionContract,
          workingDirectory: manifest.productMaterialization.tenantRoot,
          status: "pending",
          testsObserved: 0,
          passedCount: 0,
          failedCount: 0,
          blocker: "bounded transform did not invoke tests",
          shardEvidence: [
            {
              kind: "sdlc_worker_execution_shard_evidence",
              shardId: shard.shardId,
              moduleName: shard.moduleName,
              lane: "test",
              command: shard.command,
              workingDirectory: shard.workingDirectory,
              status: "pending",
              testsObserved: 0,
              passedCount: 0,
              failedCount: 0,
              blocker: "deferred shard"
            }
          ]
        }
      },
      null,
      2
    ),
    "```"
  ].join("\n");
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, `${content}\n`, "utf8");

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  assert.equal(report.executionEvidence?.status, "pending");
  assert.equal(report.materializedFiles.length, 0);
  assert.deepStrictEqual(report.executionEvidence?.reportRefs, [
    `file://${manifest.outputFile}`
  ]);
  assert.equal(report.executionEvidence?.shardEvidence.length, 1);
  assert.deepStrictEqual(report.executionEvidence?.shardEvidence[0].reportRefs, [
    `file://${manifest.outputFile}`
  ]);
  assert.equal(report.executionEvidenceErrors.length, 0);

  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasonCarriers.some(
      (reason) => reason.code === "test_execution_not_succeeded"
    ),
    true
  );
  assert.equal(
    postflight.blockingReasonCarriers.some(
      (reason) => reason.code === "test_execution_evidence_invalid"
    ),
    false
  );
});

test("T-115 failed execution evidence with zero observed tests is admitted for repair qualification", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 26,
    contract,
    projectConstraints: constraints,
    runId: "t115-failed-zero-test-evidence"
  });
  writeHandoffFiles(manifest);
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  const shard = manifest.productMaterialization.executionShards[0];
  const content = [
    "# test_execution_result_surface",
    "",
    "```json",
    JSON.stringify(
      {
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: shard.command,
          status: "failed",
          testsObserved: 0,
          passedCount: 0,
          failedCount: 0,
          shardEvidence: [
            {
              kind: "sdlc_worker_execution_shard_evidence",
              shardId: shard.shardId,
              moduleName: shard.moduleName,
              lane: "test",
              command: shard.command,
              status: "failed",
              testsObserved: 0,
              passedCount: 0,
              failedCount: 0
            }
          ]
        }
      },
      null,
      2
    ),
    "```"
  ].join("\n");
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, `${content}\n`, "utf8");

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(report.executionEvidence?.status, "failed");
  assert.equal(postflight.status, "passed");
  assert.equal(
    postflight.blockingReasonCarriers.some(
      (reason) => reason.code === "test_execution_zero_tests_observed"
    ),
    false
  );
});

test("T-115 execution-result prompt classifies executed compile failure as failed evidence", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 26,
    contract,
    projectConstraints: constraints,
    runId: "t115-executed-compile-failure-prompt"
  });
  const files = writeHandoffFiles(manifest);
  const prompt = readFileSync(files.promptPath, "utf8");

  assert.match(
    prompt,
    /Use pending only when execution did not run or external evidence is still unavailable/u
  );
  assert.match(
    prompt,
    /exits non-zero during compile, discovery, or test phases, record failed, not pending/u
  );
});

test("B-072 malformed transform execution result evidence becomes typed invalid blocker", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 17,
    contract,
    projectConstraints: constraints,
    runId: "b072-malformed-transform-execution-evidence"
  });
  writeHandoffFiles(manifest);
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  const content = [
    "# test_execution_result_surface",
    "",
    "The transform returns malformed governed test execution evidence.",
    "",
    "```json",
    JSON.stringify(
      {
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          status: "succeeded",
          reportRefs: [],
          testsObserved: 1,
          passedCount: 1,
          failedCount: 0
        }
      },
      null,
      2
    ),
    "```"
  ].join("\n");
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, `${content}\n`, "utf8");

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  assert.equal(report.executionEvidence, null);
  assert.equal(report.executionEvidenceErrors.length, 1);
  assert.match(report.executionEvidenceErrors[0], /command/);

  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasonCarriers.some(
      (reason) => reason.code === "test_execution_evidence_invalid"
    ),
    true
  );
  assert.equal(
    postflight.blockingReasons.includes("test_execution_evidence_missing"),
    false
  );
  const invalidReason = postflight.blockingReasonCarriers.find(
    (reason) => reason.code === "test_execution_evidence_invalid"
  );
  assert.equal(invalidReason?.lawfulReentryPoint, "repair_worker_output");
  assert.match(invalidReason?.detail ?? "", /command/);
});

test("B-079 execution-result postflight requires registered shard evidence", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: b079_shard_postflight",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark/",
      "    language: Scala",
      "    build_tool: sbt",
      "    test_runner: sbt test",
      "    module_structure:",
      "      - cdme-compiler",
      "      - cdme-engine"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 17,
    contract,
    projectConstraints: constraints,
    runId: "b079-shard-evidence-required"
  });
  assert.deepStrictEqual(
    manifest.productMaterialization.executionShards.map((shard) => shard.moduleName),
    ["cdme-compiler", "cdme-engine"]
  );
  assert.deepStrictEqual(
    manifest.productMaterialization.executionShards.map((shard) => shard.command),
    ['sbt "cdme-compiler/test"', 'sbt "cdme-engine/test"']
  );
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "test_execution_result_surface");
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
        summary: "aggregate evidence without shard rows",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: manifest.productMaterialization.testExecutionContract,
          status: "succeeded",
          reportRefs: [outputRef],
          testsObserved: 2,
          passedCount: 2,
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

  const blockedReport = readWorkerResultReport(manifest);
  const blockedPostflight = evaluateWorkerResultPostflight({
    manifest,
    report: blockedReport
  });
  assert.equal(blockedPostflight.status, "blocked");
  assert.deepStrictEqual(
    blockedPostflight.blockingReasonCarriers
      .filter((reason) => reason.code === "test_execution_shard_evidence_missing")
      .map((reason) => reason.detail),
    ["test-shard-01-cdme-compiler", "test-shard-02-cdme-engine"]
  );

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
        summary: "aggregate evidence with registered shard rows",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: manifest.productMaterialization.testExecutionContract,
          status: "succeeded",
          reportRefs: [outputRef],
          testsObserved: 2,
          passedCount: 2,
          failedCount: 0,
          shardEvidence: manifest.productMaterialization.executionShards.map(
            (shard) => ({
              kind: "sdlc_worker_execution_shard_evidence",
              shardId: shard.shardId,
              moduleName: shard.moduleName,
              lane: "test",
              command: shard.command,
              status: "succeeded",
              reportRefs: [outputRef],
              testsObserved: 1,
              passedCount: 1,
              failedCount: 0
            })
          )
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
  const passedReport = readWorkerResultReport(manifest);
  const passedPostflight = evaluateWorkerResultPostflight({
    manifest,
    report: passedReport
  });
  assert.equal(passedPostflight.status, "passed");
});

test("B-085 archive retry preserves targeted execution shard scope", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: b085_archive_targeted_scope",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark/",
      "    language: Scala",
      "    build_tool: sbt",
      "    test_runner: sbt test",
      "    module_structure:",
      "      - cdme-compiler",
      "      - cdme-engine"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);

  const executionContract = hookContractByEdgeName(
    "derive_test_execution_result_surface"
  );
  const executionManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: executionContract.edgeName,
    vectorIndex: 17,
    contract: executionContract,
    projectConstraints: constraints,
    retryContext: retryContextForModule(),
    runId: "b085-targeted-execution-result"
  });
  assert.deepStrictEqual(
    executionManifest.productMaterialization.executionShards.map(
      (shard) => shard.moduleName
    ),
    ["cdme-compiler"]
  );
  writeHandoffFiles(executionManifest);
  const executionOutput = writeOutputSurface(
    executionManifest,
    "test_execution_result_surface"
  );
  const executionShard = executionManifest.productMaterialization.executionShards[0];
  writeFileSync(
    executionManifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: executionManifest.graphFunctionName,
        edgeName: executionManifest.edgeName,
        targetAssetType: executionManifest.targetAssetType,
        outputFile: executionManifest.outputFile,
        digest: executionOutput.digest,
        summary: "targeted execution-result dependency with one admitted shard",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: executionShard.command,
          status: "succeeded",
          reportRefs: [`file://${executionManifest.outputFile}`],
          testsObserved: 1,
          passedCount: 1,
          failedCount: 0,
          shardEvidence: [
            {
              kind: "sdlc_worker_execution_shard_evidence",
              shardId: executionShard.shardId,
              moduleName: executionShard.moduleName,
              lane: "test",
              command: executionShard.command,
              status: "succeeded",
              reportRefs: [`file://${executionManifest.outputFile}`],
              testsObserved: 1,
              passedCount: 1,
              failedCount: 0
            }
          ]
        },
        obligationAssessments: executionManifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: [`file://${executionManifest.outputFile}`],
            blockingReasons: []
          })
        )
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  const executionReport = readWorkerResultReport(executionManifest);
  assert.equal(
    evaluateWorkerResultPostflight({
      manifest: executionManifest,
      report: executionReport
    }).status,
    "passed"
  );

  const archiveContract = hookContractByEdgeName("derive_test_run_archive_surface");
  const archiveManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: archiveContract.edgeName,
    vectorIndex: 18,
    contract: archiveContract,
    projectConstraints: constraints,
    retryContext: retryContextForModule({
      edgeName: "derive_test_run_archive_surface",
      targetAssetType: "test_run_archive_surface",
      vectorIndex: 18
    }),
    runId: "b085-targeted-archive"
  });
  assert.equal(
    archiveManifest.traversalStrategyDecision.selectedStrategy,
    "targeted_repair"
  );
  assert.deepStrictEqual(
    archiveManifest.productMaterialization.executionShards.map(
      (shard) => shard.moduleName
    ),
    ["cdme-compiler"]
  );
  writeHandoffFiles(archiveManifest);
  const archiveContent = [
    "# test_run_archive_surface",
    "",
    "Archived dependencies:",
    ...archiveManifest.inputAssetTypes.map((assetType) => `- ${assetType}`),
    "Requirement trace: REQ-T066-001"
  ].join("\n");
  const archiveArtifact = `${archiveContent}\n`;
  mkdirSync(dirname(archiveManifest.outputFile), { recursive: true });
  writeFileSync(archiveManifest.outputFile, archiveArtifact, "utf8");
  const archiveOutputRef = `file://${archiveManifest.outputFile}`;
  writeFileSync(
    archiveManifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: archiveManifest.graphFunctionName,
        edgeName: archiveManifest.edgeName,
        targetAssetType: archiveManifest.targetAssetType,
        outputFile: archiveManifest.outputFile,
        digest: sha256Text(archiveArtifact),
        summary: "archive cites targeted execution-result dependency",
        unresolvedReasons: [],
        materializedFiles: [],
        executionEvidence: null,
        obligationAssessments: archiveManifest.traversalObligationContext.obligations.map(
          (obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs:
              obligation.obligationId === "source_asset:test_execution_result_surface"
                ? [
                    archiveOutputRef,
                    `file://${executionManifest.reportFile}`,
                    ...obligation.evidenceRefs
                  ]
                : [archiveOutputRef, ...obligation.evidenceRefs],
            blockingReasons: []
          })
        )
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  const archiveReport = readWorkerResultReport(archiveManifest);
  const archivePostflight = evaluateWorkerResultPostflight({
    manifest: archiveManifest,
    report: archiveReport
  });
  assert.equal(archivePostflight.status, "passed");
});

test("B-080 silent execution-result recovery carries shard identity", async () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: b080_silent_shard_recovery",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark/",
      "    language: Scala",
      "    build_tool: sbt",
      "    test_runner: sbt test",
      "    module_structure:",
      "      - cdme-compiler",
      "      - cdme-engine"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const start = makeStart(workspace);
  const basis = start.executionContract.basis;
  const workerScript = writeSilentWorkerScript(workspace);
  const previousTimeout = process.env["ODD_SDLC_WORKER_TIMEOUT_MS"];
  const previousInactivityTimeout =
    process.env["ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS"];
  const previousHeartbeat = process.env["ODD_SDLC_WORKER_HEARTBEAT_MS"];
  process.env["ODD_SDLC_WORKER_TIMEOUT_MS"] = "50";
  process.env["ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS"] = "10000";
  process.env["ODD_SDLC_WORKER_HEARTBEAT_MS"] = "20";
  try {
    const result = await executeInstalledOperatorStart({
      workspaceRoot: workspace,
      start,
      workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
      replayEvents: preclosedEventsBeforeEdge(
        basis,
        "derive_test_execution_result_surface"
      )
    });

    assert.equal(result.status, "worker_failed");
    assert.equal(result.postflight.status, "blocked");
    assert.equal(
      result.postflight.blockingReasonCarriers[0].code,
      "worker_hard_timeout"
    );
    assert.equal(
      result.postflight.blockingReasonCarriers[0].lawfulReentryPoint,
      "triage_gap"
    );
    const executionShardIds = result.manifest.productMaterialization.executionShards
      .map((shard) => shard.shardId)
      .join(",");
    assert.match(
      result.postflight.blockingReasonCarriers[0].detail,
      new RegExp(`executionShardIds=${executionShardIds}`, "u")
    );
    assert.match(
      result.postflight.blockingReasonCarriers[0].detail,
      /signalSequence=SIGTERM@\d+ms/u
    );
    assert.match(
      result.postflight.blockingReasonCarriers[0].detail,
      /runtimeLivenessAuthority=abiogenesis_runtime_liveness_observer_projection/u
    );
    assert.match(
      result.postflight.blockingReasonCarriers[0].detail,
      /runtimeLivenessProjectionRef=file:.*runtime_liveness_observer_projection\.json/u
    );
    assert.match(
      result.postflight.blockingReasonCarriers[0].detail,
      /runtimeLivenessLeaseState=externally_interrupted/u
    );
    assert.match(
      result.postflight.blockingReasonCarriers[0].detail,
      /priorSilentAttempts=1/u
    );
    assert.match(
      result.postflight.blockingReasonCarriers[0].detail,
      /processSummaryRef=file:.*worker_process_summary\.json/u
    );
    assert.equal(
      result.postflight.evidenceRefs.some((ref) =>
        ref.includes("worker_process_started_context.json")
      ),
      true
    );
    assert.equal(
      result.postflight.evidenceRefs.some((ref) =>
        ref.includes("worker_process_summary.json")
      ),
      true
    );
    assert.deepStrictEqual(
      result.manifest.productMaterialization.declaredModuleNames,
      ["cdme-compiler", "cdme-engine"]
    );
    assert.equal(
      result.manifest.traversalStrategyDecision.selectedStrategy,
      "full_breadth"
    );
    assert.equal(result.manifest.featureScope.mode, "full_breadth");
    assert.deepStrictEqual(
      result.manifest.featureScope.includedModuleNames,
      ["cdme-compiler", "cdme-engine"]
    );
    assert.deepStrictEqual(
      result.manifest.featureScope.deferredModuleNames,
      []
    );
    assert.deepStrictEqual(
      result.manifest.productMaterialization.executionShards.map(
        (shard) => shard.moduleName
      ),
      result.manifest.featureScope.includedModuleNames
    );
    assert.equal(result.manifest.retryContext.priorGapDossiers.length, 1);
    assert.equal(result.gapDossier.reasons.length, 1);
    assert.match(
      result.gapDossier.reasons[0].reason,
      /worker_hard_timeout|silent_worker_inactivity/u
    );
    assert.deepStrictEqual(result.gapDossier.nextLawfulActions, ["triage_gap"]);
    assert.equal(result.gapDossier.retryEligible, false);
  } finally {
    if (previousTimeout === undefined) {
      delete process.env["ODD_SDLC_WORKER_TIMEOUT_MS"];
    } else {
      process.env["ODD_SDLC_WORKER_TIMEOUT_MS"] = previousTimeout;
    }
    if (previousInactivityTimeout === undefined) {
      delete process.env["ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS"];
    } else {
      process.env["ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS"] =
        previousInactivityTimeout;
    }
    if (previousHeartbeat === undefined) {
      delete process.env["ODD_SDLC_WORKER_HEARTBEAT_MS"];
    } else {
      process.env["ODD_SDLC_WORKER_HEARTBEAT_MS"] = previousHeartbeat;
    }
  }
});

test("T-100 component-test postflight admits materialized tests before execution discoverability proof", () => {
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
  const contract = hookContractByEdgeName("derive_component_test_surface");
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

  assert.match(prompt, /For component_test_surface, materialize developer test files/);
  assert.match(prompt, /component_depth_register with componentTestRows/);
  assert.match(prompt, /Materialized tests must preserve declared testClassId/);
  assert.match(prompt, /avoid local identifiers that collide with matcher words/u);
  assert.match(prompt, /prefer shouldEqual or parenthesized shouldBe RHS/u);

  const output = writeOutputSurface(manifest, "component_test_surface");
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

  assert.equal(postflight.status, "passed");
  assert.equal(
    postflight.blockingReasons.some((reason) =>
      reason.startsWith("test_materialization_not_discoverable")
    ),
    false
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
  const contract = hookContractByEdgeName("derive_component_test_surface");
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
  const output = writeOutputSurface(manifest, "component_test_surface");
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
    (vector) => vector.name === "derive_component_code_surface"
  );
  assert(codeIndex > 0);
  const workerScript = writePlaceholderWorkerScript(workspace);
  const result = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
    replayEvents: preclosedEventsBeforeEdge(basis, "derive_component_code_surface")
  });

  assert.equal(result.status, "postflight_failed");
  assert.equal(result.postflight.status, "blocked");
  assert.equal(result.assuranceSatisfaction.status, "retry_same_edge");
  assert.equal(
    result.postflight.blockingReasons.some((reason) =>
      reason.startsWith("placeholder_surface:file://")
    ),
    true,
    JSON.stringify(result.postflight.blockingReasons, null, 2)
  );
  assert.deepStrictEqual(result.emittedRuntimeEventKinds.slice(0, 4), [
    "basis_admitted",
    "graph_call_opened",
    "frame_opened",
    "vector_traversal_planned"
  ]);
  assert.equal(result.emittedRuntimeEventKinds.includes("fp_dispatch_requested"), true);
  assert.equal(result.emittedRuntimeEventKinds.includes("actor_invocation_started"), true);
  assert.equal(result.emittedRuntimeEventKinds.includes("vector_evaluated"), true);
  assert.equal(result.emittedRuntimeEventKinds.includes("terminal_reached"), true);
  assert.equal(result.gapDossier.status, "open");
  assert.equal(
    result.gapDossier.reasons.some((reason) =>
      reason.reason.startsWith("placeholder_surface:file://")
    ),
    true
  );

  const failureEvents = await readOddSdlcRuntimeEvents(workspace);
  const afterFailure = evalSdlcGapFromReplay({
    basis,
    events: Object.freeze([
      ...preclosedEventsBeforeEdge(basis, "derive_component_code_surface"),
      ...failureEvents
    ])
  });
  assert.equal(afterFailure.currentEdge, "derive_component_code_surface");
  assert.equal(afterFailure.closedVectorIndexes.includes(codeIndex), false);
});

test("T-066 installed operator rejects unexpected product materialization before capability evidence", async () => {
  const workspace = makeCapabilityWorkspace();
  const start = makeStart(workspace);
  const basis = start.executionContract.basis;
  const workerScript = writeCapabilityMissingWorkerScript(workspace);
  const result = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
    replayEvents: preclosedEventsBeforeEdge(basis, "derive_component_code_surface")
  });

  assert.equal(result.status, "postflight_failed");
  assert.equal(result.assuranceSatisfaction?.status ?? "retry_same_edge", "retry_same_edge");
  assert.equal(result.postflight.status, "blocked");
  assert.equal(
    result.postflight.blockingReasons.includes("unexpected_product_materialization_for_surface_edge"),
    true,
    JSON.stringify(result.postflight.blockingReasons, null, 2)
  );
  assert.equal(
    result.gapDossier.reasons[0].reason,
    "unexpected_product_materialization_for_surface_edge"
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
    replayEvents: preclosedEventsBeforeEdge(basis, "derive_component_code_surface")
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
  let testExecutionResult = null;
  let testRunResult = null;

  for (let guard = 0; guard < 40; guard += 1) {
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
    if (currentEdge === FG_CONFORM_PROJECT_AUTHORITY) {
      const authority = runInstalledOddSdlc(
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
      assert(
        authority.status === "converged" || authority.status === "worker_invoked",
        `${currentEdge}: ${authority.status}`
      );
      if (authority.status === "worker_invoked") {
        assert.equal(authority.postflight.status, "passed", currentEdge);
      }
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
    const observedEdge = start.summary?.currentEdge ?? currentEdge;
    if (
      observedEdge === "derive_component_code_surface" ||
      (
        start.manifest?.graphFunctionName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET &&
        start.manifest?.targetAssetType === "component_code_surface"
      )
    ) {
      codeResult = start;
    }
    if (
      observedEdge === "derive_component_test_surface" ||
      (
        start.manifest?.graphFunctionName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET &&
        start.manifest?.targetAssetType === "component_test_surface"
      )
    ) {
      testResult = start;
    }
    if (observedEdge === "derive_test_execution_result_surface") {
      testExecutionResult = start;
    }
    if (observedEdge === "derive_test_run_archive_surface") {
      testRunResult = start;
      break;
    }
    if (start.status === "converged") {
      continue;
    }
    assert.equal(start.status, "worker_invoked", currentEdge);
    assert.equal(start.postflight.status, "passed", currentEdge);
  }

  assert(codeResult, "derive_component_code_surface did not run");
  assert(testResult, "derive_component_test_surface did not run");
  assert(testExecutionResult, "derive_test_execution_result_surface did not run");
  assert(testRunResult, "derive_test_run_archive_surface did not run");
  assert.equal(codeResult.assuranceSatisfaction.status, "close_allowed");
  assert.equal(testResult.assuranceSatisfaction.status, "close_allowed");
  assert.equal(testExecutionResult.postflight.status, "passed");
  assert.equal(testRunResult.postflight.status, "passed");
  const executionEvidence = testExecutionResult.workerReport?.executionEvidence ?? null;
  if (executionEvidence !== null) {
    assert.equal(
      executionEvidence.status,
      "succeeded"
    );
    assert.equal(
      executionEvidence.testsObserved,
      executionEvidence.shardEvidence.length
    );
    assert(executionEvidence.shardEvidence.length >= 1);
    assert.equal(
      executionEvidence.shardEvidence.length,
      testExecutionResult.manifest.productMaterialization.executionShards.length
    );
  }
  assert.equal(testRunResult.workerReport.executionEvidence, null);
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
