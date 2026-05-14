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
  constructWorkerInvocationPackage,
  constructPostflightGapDossier,
  constructFpEvaluateResult,
  constructSdlcGtlModule,
  constructorResultFromWorkerOutput,
  declaredProductFileTargets,
  deriveComponentDepthAssuranceLedger,
  deriveShallowRealizationAssuranceLedger,
  deriveSdlcOperatorAssuranceGate,
  deriveSdlcProductLineageYieldResumeBasis,
  deriveSdlcWorkspaceIngressReport,
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcProjectConstraintsFromWorkspace,
  deriveSdlcSourceInput,
  deriveWorkerHandoffManifest,
  executeInstalledOperatorStart,
  FG_CONFORM_PROJECT_AUTHORITY,
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  evaluateWorkerResultPostflight,
  FG_CONFORM_PROJECT,
  hookContractByEdgeName,
  installOddSdlcTypescript,
  materializeSdlcProjectConformance,
  makeSdlcBlockingReason,
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
      "function currentRequirementTraceIds() {",
      "  try {",
      "    const invocation = JSON.parse(readFileSync(path.join(manifest.archiveRoot, 'worker_invocation_package.json'), 'utf8'));",
      "    if (Array.isArray(invocation.requirementTraceObligationIds) && invocation.requirementTraceObligationIds.length > 0) return invocation.requirementTraceObligationIds;",
      "  } catch {}",
      "  return manifest.traversalObligationContext.obligations.filter((obligation) => obligation.obligationKind === 'requirement').map((obligation) => obligation.obligationId);",
      "}",
      "const requirementObligationIds = currentRequirementTraceIds();",
      "const requirementIds = requirementObligationIds.map((id) => id.replace(/^requirement:/, '')).filter((id) => id.startsWith('REQ-')).join(', ') || 'none';",
      "const requirementTraceHeader = requirementObligationIds.map((id) => `// ${id}`).join('\\n');",
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
      "const source = `${requirementTraceHeader}\\npackage generated\\n// TODO placeholder implementation\\nobject Placeholder { def run(input: String): String = input }\\n`; ",
      "writeFileSync(sourcePath, source, 'utf8');",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "const materializedFiles = [{ kind: 'sdlc_materialized_product_file', role: 'source', relativePath: tenantRelative, absolutePath: sourcePath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8'), requirementTraceObligationIds: requirementObligationIds }];",
      "const materializedRefs = materializedFiles.map((file) => `file://${file.absolutePath}`);",
      "const outputRef = `file://${manifest.outputFile}`;",
      "const materializedRequirementIdSet = new Set(requirementObligationIds);",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: materializedRequirementIdSet.has(obligation.obligationId) && materializedRefs.length > 0 ? materializedRefs : [outputRef, ...obligation.evidenceRefs], blockingReasons: [] }));",
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
      "function currentRequirementTraceIds() {",
      "  try {",
      "    const invocation = JSON.parse(readFileSync(path.join(manifest.archiveRoot, 'worker_invocation_package.json'), 'utf8'));",
      "    if (Array.isArray(invocation.requirementTraceObligationIds) && invocation.requirementTraceObligationIds.length > 0) return invocation.requirementTraceObligationIds;",
      "  } catch {}",
      "  return manifest.traversalObligationContext.obligations.filter((obligation) => obligation.obligationKind === 'requirement').map((obligation) => obligation.obligationId);",
      "}",
      "const requirementObligationIds = currentRequirementTraceIds();",
      "const requirementIds = requirementObligationIds.map((id) => id.replace(/^requirement:/, '')).filter((id) => id.startsWith('REQ-')).join(', ') || 'none';",
      "const requirementTraceHeader = requirementObligationIds.map((id) => `// ${id}`).join('\\n');",
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
      "const source = `${requirementTraceHeader}\\npackage generated\\nobject Core { def run(value: String): String = value.reverse }\\n`; ",
      "writeFileSync(sourcePath, source, 'utf8');",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "const materializedFiles = [{ kind: 'sdlc_materialized_product_file', role: 'source', relativePath: tenantRelative, absolutePath: sourcePath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8'), requirementTraceObligationIds: requirementObligationIds }];",
      "const materializedRefs = materializedFiles.map((file) => `file://${file.absolutePath}`);",
      "const outputRef = `file://${manifest.outputFile}`;",
      "const materializedRequirementIdSet = new Set(requirementObligationIds);",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: materializedRequirementIdSet.has(obligation.obligationId) && materializedRefs.length > 0 ? materializedRefs : [outputRef, ...obligation.evidenceRefs], blockingReasons: [] }));",
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
  if (
    parsed.payload?.kind === "sdlc_installed_operator_start_cli_projection" &&
    typeof parsed.payload.sourceOutcomeRef === "string"
  ) {
    return JSON.parse(readFileSync(fileURLToPath(parsed.payload.sourceOutcomeRef), "utf8"));
  }
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
      "function currentRequirementTraceIds() {",
      "  try {",
      "    const invocation = JSON.parse(readFileSync(path.join(manifest.archiveRoot, 'worker_invocation_package.json'), 'utf8'));",
      "    if (Array.isArray(invocation.requirementTraceObligationIds) && invocation.requirementTraceObligationIds.length > 0) return invocation.requirementTraceObligationIds;",
      "  } catch {}",
      "  return manifest.traversalObligationContext.obligations.filter((obligation) => obligation.obligationKind === 'requirement').map((obligation) => obligation.obligationId);",
      "}",
      "const requirementObligationIds = currentRequirementTraceIds();",
      "const requirementIds = requirementObligationIds.map((id) => id.replace(/^requirement:/, '')).filter((id) => id.startsWith('REQ-')).join(', ') || 'none';",
      "const requirementTraceHeader = requirementObligationIds.map((id) => `// ${id}`).join('\\n');",
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
      "  const source = role === 'test' ? `${requirementTraceHeader}\\npackage cdme\\nimport org.scalatest.funsuite.AnyFunSuite\\nfinal class CoreSpec extends AnyFunSuite { test(\"core contract\") { assert(Core.retryClosed == true) } }\\n` : `${requirementTraceHeader}\\npackage cdme\\nobject Core { val retryClosed = true; val capabilityMarkers = ${JSON.stringify(capabilityMarkers)} }\\n`;",
      "  writeFileSync(productPath, source, 'utf8');",
      "  const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "  materializedFiles.push({ kind: 'sdlc_materialized_product_file', role, relativePath: tenantRelative, absolutePath: productPath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8'), requirementTraceObligationIds: requirementObligationIds });",
      "  if (role === 'test') {",
      "    const buildPath = path.join(manifest.productMaterialization.tenantRoot, 'build.sbt');",
      "    const buildConfig = `${requirementObligationIds.map((id) => `// ${id}`).join('\\n')}\\nThisBuild / scalaVersion := \"2.12.18\"\\nlibraryDependencies += \"org.scalatest\" %% \"scalatest\" % \"3.2.19\" % Test\\nlazy val root = project.in(file(\".\")).settings(name := \"cdme-core\")\\n`; ",
      "    writeFileSync(buildPath, buildConfig, 'utf8');",
      "    const buildDigest = `sha256:${createHash('sha256').update(buildConfig, 'utf8').digest('hex')}`;",
      "    materializedFiles.push({ kind: 'sdlc_materialized_product_file', role: 'build_config', relativePath: 'build.sbt', absolutePath: buildPath, digest: buildDigest, byteCount: Buffer.byteLength(buildConfig, 'utf8'), requirementTraceObligationIds: requirementObligationIds });",
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
      "const materializedRequirementIdSet = new Set(requirementObligationIds);",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [outputRef, ...(materializedRequirementIdSet.has(obligation.obligationId) ? materializedRefs : []), ...executionRefs, ...obligation.evidenceRefs], blockingReasons: [] }));",
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

function requirementObligationIds(manifest) {
  return manifest.traversalObligationContext.obligations
    .filter((obligation) => obligation.obligationKind === "requirement")
    .map((obligation) => obligation.obligationId);
}

function requirementTraceLines(manifest, commentPrefix = "//") {
  return requirementObligationIds(manifest).map(
    (obligationId) => `${commentPrefix} ${obligationId}`
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
    ...requirementTraceLines(manifest),
    "package generated",
    "",
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
      byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8"),
      requirementTraceObligationIds: requirementObligationIds(manifest)
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

test("T-158 postflight blocks worker reads outside active workspace", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_scenario_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "derive_scenario_surface",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t158-worker-read-boundary"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "scenario_surface");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "scenario surface",
    materializedFiles: []
  });
  const outsideRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-old-sandbox-"));
  const outsideFile = path.join(
    outsideRoot,
    "workspace/design/scenario_surface.md"
  );
  mkdirSync(dirname(outsideFile), { recursive: true });
  writeFileSync(outsideFile, "# stale scenario\n", "utf8");
  writeFileSync(
    path.join(manifest.archiveRoot, "worker_stdout.log"),
    [
      JSON.stringify({
        type: "system",
        cwd: workspace,
        memory_paths: {
          auto: "/Users/jim/.claude/projects/-Users-jim-src-apps-odd-sdlc/memory/"
        }
      }),
      JSON.stringify({
        type: "assistant",
        message: {
          content: [
            {
              type: "tool_use",
              id: "toolu_boundary_read",
              name: "Read",
              input: { file_path: outsideFile }
            }
          ]
        }
      })
    ].join("\n") + "\n",
    "utf8"
  );

  const report = readWorkerResultReport(manifest);
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  const authorityReason = postflight.blockingReasons.find((reason) =>
    reason.startsWith("worker_authority_read_outside_workspace:")
  );

  assert.equal(postflight.status, "blocked");
  assert.notEqual(authorityReason, undefined);
  assert.match(authorityReason ?? "", /worker_stdout\.log:2/u);
  assert.match(authorityReason ?? "", /scenario_surface\.md/u);
});

test("T-158 worker read-boundary ignores regex pattern strings that begin with slash", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_scenario_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "derive_scenario_surface",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t158-worker-read-boundary-regex-pattern"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "scenario_surface");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "scenario surface",
    materializedFiles: []
  });
  writeFileSync(
    path.join(manifest.archiveRoot, "worker_stdout.log"),
    JSON.stringify({
      type: "assistant",
      message: {
        content: [
          {
            type: "tool_use",
            id: "toolu_boundary_grep",
            name: "Grep",
            input: {
              pattern: "/ requirement:.*req_trv_005_a",
              path: path.join(workspace, "build_tenants/scala_spark")
            }
          }
        ]
      }
    }) + "\n",
    "utf8"
  );

  const report = readWorkerResultReport(manifest);
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  const authorityReason = postflight.blockingReasons.find((reason) =>
    reason.startsWith("worker_authority_read_outside_workspace:")
  );

  assert.equal(authorityReason, undefined);
});

test("T-159 worker read-boundary ignores executor persisted output metadata", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_scenario_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "derive_scenario_surface",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t159-worker-read-boundary-runtime-metadata"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "scenario_surface");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "scenario surface",
    materializedFiles: []
  });
  writeFileSync(
    path.join(manifest.archiveRoot, "worker_stdout.log"),
    JSON.stringify({
      type: "user",
      tool_use_result: {
        type: "text",
        persistedOutputPath:
          "/Users/jim/.claude/projects/-Users-jim-src-apps-odd-sdlc/tool-results/toolu_false_positive.txt",
        file: {
          filePath: output.path
        }
      }
    }) + "\n",
    "utf8"
  );

  const report = readWorkerResultReport(manifest);
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  const authorityReason = postflight.blockingReasons.find((reason) =>
    reason.startsWith("worker_authority_read_outside_workspace:")
  );

  assert.equal(postflight.status, "passed");
  assert.equal(authorityReason, undefined);
});

test("T-159 product materialization blocks cited source without requirement lineage", () => {
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
    runId: "t159-product-source-lineage-missing"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "component_code_surface");
  const sourceContent = ["package generated", "", "object Main"].join("\n");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/Main.scala"
  );
  mkdirSync(dirname(productFile), { recursive: true });
  writeFileSync(productFile, `${sourceContent}\n`, "utf8");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated source cites requirements only through the report",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: path.relative(manifest.productMaterialization.tenantRoot, productFile),
        absolutePath: productFile,
        digest: sha256Text(`${sourceContent}\n`),
        byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8")
      }
    ]
  });

  const report = readWorkerResultReport(manifest);
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes(
      "materialized_product_requirement_lineage_missing"
    ),
    true,
    JSON.stringify(postflight.blockingReasons, null, 2)
  );
});

test("T-159 product materialization blocks source row without requirement lineage ids", () => {
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
    runId: "t159-product-source-row-lineage-missing"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "component_code_surface");
  const requirementIds = requirementObligationIds(manifest);
  assert(requirementIds.length > 0);
  const sourceContent = [
    ...requirementIds.map((id) => `// Implements: ${id}`),
    "package generated",
    "",
    "object Main"
  ].join("\n");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/Main.scala"
  );
  mkdirSync(dirname(productFile), { recursive: true });
  writeFileSync(productFile, `${sourceContent}\n`, "utf8");
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
        summary: "generated source carries inline tags but omits row lineage",
        unresolvedReasons: [],
        materializedFiles: [
          {
            kind: "sdlc_materialized_product_file",
            role: "source",
            relativePath: path.relative(
              manifest.productMaterialization.tenantRoot,
              productFile
            ),
            absolutePath: productFile,
            digest: sha256Text(`${sourceContent}\n`),
            byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8")
          }
        ],
        obligationAssessments:
          manifest.traversalObligationContext.obligations.map((obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: [outputRef],
            blockingReasons: []
          }))
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
    postflight.blockingReasons.includes(
      "materialized_product_requirement_lineage_missing"
    ),
    true,
    JSON.stringify(postflight.blockingReasons, null, 2)
  );
});

test("T-159 product materialization blocks lineage outside current obligations", () => {
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
    runId: "t159-product-source-unrelated-lineage"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "component_code_surface");
  const unrelatedId = "requirement:unrelated_project.requirements.req_999";
  const sourceContent = [
    `// Implements: ${unrelatedId}`,
    "package generated",
    "",
    "object Main"
  ].join("\n");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/Main.scala"
  );
  mkdirSync(dirname(productFile), { recursive: true });
  writeFileSync(productFile, `${sourceContent}\n`, "utf8");
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
        summary: "generated source carries unrelated lineage",
        unresolvedReasons: [],
        materializedFiles: [
          {
            kind: "sdlc_materialized_product_file",
            role: "source",
            relativePath: path.relative(
              manifest.productMaterialization.tenantRoot,
              productFile
            ),
            absolutePath: productFile,
            digest: sha256Text(`${sourceContent}\n`),
            byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8"),
            requirementTraceObligationIds: [unrelatedId]
          }
        ],
        obligationAssessments:
          manifest.traversalObligationContext.obligations.map((obligation) => ({
            kind: "sdlc_worker_obligation_assessment",
            obligationId: obligation.obligationId,
            fulfillmentStatus: "fulfilled",
            evidenceRefs: [`file://${manifest.outputFile}`],
            blockingReasons: []
          }))
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
    postflight.blockingReasons.includes(
      "materialized_product_requirement_lineage_missing"
    ),
    true,
    JSON.stringify(postflight.blockingReasons, null, 2)
  );
  assert(
    postflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "materialized_product_requirement_lineage_missing" &&
        reason.detail?.includes(`unrelated:${unrelatedId}`)
    ),
    JSON.stringify(postflight.blockingReasonCarriers, null, 2)
  );
  assert(
    postflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "materialized_product_requirement_lineage_missing" &&
        reason.detail?.includes("current_requirements:")
    ),
    JSON.stringify(postflight.blockingReasonCarriers, null, 2)
  );
});

test("T-159 product materialization admits source with requirement lineage in file and row", () => {
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
    runId: "t159-product-source-lineage-present"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "component_code_surface");
  const requirementTags = [
    ...new Set(
      manifest.traversalObligationContext.obligations.flatMap((obligation) => {
        if (obligation.obligationKind !== "requirement") {
          return [];
        }
        const match = /^Fulfill ([^:]+):/u.exec(obligation.summary);
        return match?.[1] === undefined ? [] : [match[1]];
      })
    )
  ];
  assert(requirementTags.length > 0);
  const sourceContent = [
    ...requirementTags.map((tag) => `// Implements: ${tag}`),
    "package generated",
    "",
    "object Main"
  ].join("\n");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/Main.scala"
  );
  mkdirSync(dirname(productFile), { recursive: true });
  writeFileSync(productFile, `${sourceContent}\n`, "utf8");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated source carries requirement lineage",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: path.relative(manifest.productMaterialization.tenantRoot, productFile),
        absolutePath: productFile,
        digest: sha256Text(`${sourceContent}\n`),
        byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8")
      }
    ]
  });

  const report = readWorkerResultReport(manifest);
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  writeProductMaterializationManifest({ manifest, report });
  const materializationManifest = JSON.parse(
    readFileSync(manifest.productMaterialization.manifestFile, "utf8")
  );

  assert.equal(postflight.status, "passed", JSON.stringify(postflight.blockingReasons));
  assert.equal(materializationManifest.files.length, 1);
  assert(
    materializationManifest.files[0].requirementTraceObligationIds.length > 0
  );
  assert.equal(
    materializationManifest.files[0].materializationSource,
    "current_attempt"
  );
});

test("T-159 product materialization canonicalizes duplicate requirement authorities", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "bootstrap.md"),
    [
      "# Bootstrap",
      "",
      "REQ-T066-001: Bootstrap source for the same logical product requirement."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/requirements/00-imported-sources.md"),
    [
      "# Imported Sources",
      "",
      "## Source Refs",
      "",
      "- workspace://bootstrap.md",
      "",
      "## Imported Requirement Markers",
      "",
      "- REQ-T066-001"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/requirements/README.md"),
    [
      "# Requirements",
      "",
      "- `REQ-T066-001` - index row for the same logical requirement"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "- requirement authority preserves every keyed REQ-T066-00x identifier",
      "- declared source file: build_tenants/scala_spark/src/main/scala/generated/Main.scala"
    ].join("\n"),
    "utf8"
  );
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t159-product-lineage-canonical-authority"
  });
  const files = writeHandoffFiles(manifest);
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const rawRequirementIds = requirementObligationIds(manifest);

  assert(rawRequirementIds.length > invocationPackage.requirementTraceObligationIds.length);
  assert.equal(
    rawRequirementIds.some((id) => id.endsWith(".product.req_t066")),
    false
  );
  assert.deepEqual(invocationPackage.requirementTraceObligationIds, [
    "requirement:t066_product_materialization.stage_01_fixture.req_t066_001"
  ]);

  const output = writeOutputSurface(manifest, "component_code_surface");
  const sourceContent = [
    ...invocationPackage.requirementTraceObligationIds.map((id) => `// ${id}`),
    "package generated",
    "",
    "object Main"
  ].join("\n");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/Main.scala"
  );
  mkdirSync(dirname(productFile), { recursive: true });
  writeFileSync(productFile, `${sourceContent}\n`, "utf8");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "generated source is assessed against duplicate authority refs",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: path.relative(manifest.productMaterialization.tenantRoot, productFile),
        absolutePath: productFile,
        digest: sha256Text(`${sourceContent}\n`),
        byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8")
      }
    ]
  });

  const report = readWorkerResultReport(manifest);
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  writeProductMaterializationManifest({ manifest, report });
  const materializationManifest = JSON.parse(
    readFileSync(manifest.productMaterialization.manifestFile, "utf8")
  );

  assert.equal(postflight.status, "passed", JSON.stringify(postflight.blockingReasons));
  assert.deepEqual(
    materializationManifest.files[0].requirementTraceObligationIds,
    invocationPackage.requirementTraceObligationIds
  );
});

test("T-164 post-transform closes duplicate requirement aliases from canonical trace", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "bootstrap.md"),
    [
      "# Bootstrap",
      "",
      "### REQ-T066-001 Source Contract",
      "",
      "The generated source shall satisfy the same logical requirement."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/requirements/00-imported-sources.md"),
    [
      "# Imported Sources",
      "",
      "## Source Refs",
      "",
      "- workspace://bootstrap.md",
      "",
      "## Imported Requirement Markers",
      "",
      "- REQ-T066-001"
    ].join("\n"),
    "utf8"
  );
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t164-post-transform-duplicate-requirement-alias"
  });
  const files = writeHandoffFiles(manifest);
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const before = snapshotProductMaterializationRoot(
    manifest.productMaterialization
  );
  writeOutputSurface(manifest, "component_code_surface");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/generated/Main.scala"
  );
  const source = [
    ...invocationPackage.requirementTraceObligationIds.map((id) => `// ${id}`),
    "package generated",
    "object Main"
  ].join("\n");
  mkdirSync(dirname(productFile), { recursive: true });
  writeFileSync(productFile, `${source}\n`, "utf8");

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  const requirementAssessments = report.obligationAssessments.filter((assessment) =>
    assessment.obligationId.startsWith("requirement:")
  );
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(requirementAssessments.length > invocationPackage.requirementTraceObligationIds.length, true);
  assert.equal(
    requirementAssessments.every(
      (assessment) => assessment.fulfillmentStatus === "fulfilled"
    ),
    true,
    JSON.stringify(requirementAssessments, null, 2)
  );
  assert.equal(postflight.status, "passed", JSON.stringify(postflight.blockingReasons));
});

test("T-159 placeholder requirement markers are not promoted into product lineage obligations", () => {
  const workspace = makeWorkspace();
  const placeholderContent = [
    "# Requirements",
    "",
    "- 01-t066-requirements.md - keyed REQ-T066-NNN requirements are projected during induction.",
    "- example placeholder REQ-XXX-001 must not become authority.",
    "- example placeholder REQ-TBD-001 must not become authority."
  ].join("\n");
  writeFileSync(
    path.join(workspace, "specification/requirements/README.md"),
    placeholderContent,
    "utf8"
  );
  const sourceInput = deriveSdlcSourceInput({
    uri: "workspace://specification/requirements/README.md",
    relativePath: "specification/requirements/README.md",
    content: placeholderContent
  });

  assert.deepEqual(
    sourceInput.authorityMarkers.filter((marker) => marker.startsWith("REQ-")),
    []
  );

  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t159-placeholder-requirement-markers"
  });
  const files = writeHandoffFiles(manifest);
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const rawRequirementIds = requirementObligationIds(manifest);

  assert(
    rawRequirementIds.some((id) => id.endsWith(".stage_01_fixture.req_t066_001")),
    rawRequirementIds.join("\n")
  );
  assert.equal(
    rawRequirementIds.some((id) => /(?:nnn|xxx|tbd)/u.test(id)),
    false,
    rawRequirementIds.join("\n")
  );
  assert.deepEqual(invocationPackage.requirementTraceObligationIds, [
    "requirement:t066_product_materialization.stage_01_fixture.req_t066_001"
  ]);
});

test("T-159 conformance assessments do not add raw display-id duplicates", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "bootstrap.md"),
    [
      "# Bootstrap",
      "",
      "REQ-T066-001: Bootstrap source for the same logical product requirement."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/requirements/00-imported-sources.md"),
    [
      "# Imported Sources",
      "",
      "## Source Refs",
      "",
      "- workspace://bootstrap.md",
      "",
      "## Imported Requirement Markers",
      "",
      "- REQ-T066-001"
    ].join("\n"),
    "utf8"
  );
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName(FG_CONFORM_PROJECT_AUTHORITY);
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: FG_CONFORM_PROJECT_AUTHORITY,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    projectConstraints: constraints,
    runId: "t159-conformance-no-raw-display-duplicates"
  });
  const requirementIds = requirementObligationIds(manifest);
  assert(
    requirementIds.some((id) => id.endsWith(".stage_01_fixture.req_t066_001")),
    requirementIds.join("\n")
  );
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(
    manifest.outputFile,
    [
      "# Project Authority",
      "",
      "## Requirement Trace Register",
      "",
      "- REQ-T066-001"
    ].join("\n"),
    "utf8"
  );

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  const assessedRequirementIds = report.obligationAssessments
    .map((assessment) => assessment.obligationId)
    .filter((id) => id.startsWith("requirement:"));

  assert.equal(
    assessedRequirementIds.includes("requirement:REQ-T066-001"),
    false,
    assessedRequirementIds.join("\n")
  );
  assert(
    assessedRequirementIds.some((id) => id.endsWith(".stage_01_fixture.req_t066_001")),
    assessedRequirementIds.join("\n")
  );
});

test("T-159 authority conformance carries unobserved requirements instead of retrying same edge", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName(FG_CONFORM_PROJECT_AUTHORITY);
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: FG_CONFORM_PROJECT_AUTHORITY,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    projectConstraints: constraints,
    runId: "t159-conformance-carries-requirements"
  });
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  writeOutputSurface(manifest, "Project Authority");

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  const requirementAssessment = report.obligationAssessments.find((assessment) =>
    assessment.obligationId.endsWith(".stage_01_fixture.req_t066_001")
  );
  assert(requirementAssessment);
  assert.equal(requirementAssessment.fulfillmentStatus, "partial");
  assert(
    requirementAssessment.blockingReasons.some((reason) =>
      reason.startsWith("requirement_carried_for_downstream_closure:")
    ),
    JSON.stringify(requirementAssessment.blockingReasons)
  );

  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed");

  const gate = deriveSdlcOperatorAssuranceGate({ manifest, report, postflight });
  assert.equal(gate.satisfaction.status, "close_allowed");
  assert.equal(gate.blockingPostflight, null);

  const evaluation = constructFpEvaluateResult({ manifest, report, postflight });
  assert.equal(evaluation.postflightStatus, "passed");
  assert.equal(evaluation.status, "admitted_with_open_obligations");
  assert.equal(evaluation.obligationAssessmentCounts.blocked, 0);
  assert.equal(evaluation.obligationAssessmentCounts.partial > 0, true);
});

test("T-159 workspace imported-source refs expand before downstream traversal", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "bootstrap.md"),
    [
      "# Bootstrap",
      "",
      "REQ-T066-001: Build the CLI source from bootstrap authority."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/requirements/00-imported-sources.md"),
    [
      "# Imported Sources",
      "",
      "## Source Refs",
      "",
      "- workspace://bootstrap.md",
      "",
      "## Imported Requirement Markers",
      "",
      "- REQ-T066-001"
    ].join("\n"),
    "utf8"
  );
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_feature_decomp_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 1,
    contract,
    projectConstraints: constraints,
    runId: "t159-workspace-imported-source-refs"
  });

  assert.equal(
    manifest.traversalObligationContext.obligations.some(
      (obligation) =>
        obligation.obligationId.includes("stage_00_imported_sources")
    ),
    false,
    JSON.stringify(
      manifest.traversalObligationContext.obligations.map(
        (obligation) => obligation.obligationId
      ),
      null,
      2
    )
  );
  assert(
    manifest.traversalObligationContext.obligations.some(
      (obligation) => obligation.obligationId.includes(".bootstrap.")
    )
  );
  assert.doesNotThrow(() => writeHandoffFiles(manifest));
});

test("T-158 F_P.evaluate keeps report admission distinct from open obligation closure", () => {
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
    runId: "t158-fp-evaluate-open-obligation"
  });
  const output = writeOutputSurface(manifest, "component_code_surface");
  const report = {
    kind: "odd_sdlc.worker_result_report",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile,
    digest: output.digest,
    summary: "valid report admission with an open obligation",
    unresolvedReasons: [],
    materializedFiles: [],
    executionEvidence: null,
    obligationAssessments: [
      {
        kind: "sdlc_worker_obligation_assessment",
        obligationId:
          manifest.traversalObligationContext.obligations[0]?.obligationId ??
          "obligation://t158/open",
        fulfillmentStatus: "blocked",
        evidenceRefs: [`file://${manifest.outputFile}`],
        blockingReasons: ["requires follow-on repair"]
      }
    ]
  };
  const postflight = {
    kind: "sdlc_operator_postflight_result",
    status: "passed",
    blockingReasons: [],
    blockingReasonCarriers: [],
    evidenceRefs: [`file://${manifest.outputFile}`]
  };

  const result = constructFpEvaluateResult({ manifest, report, postflight });

  assert.equal(result.postflightStatus, "passed");
  assert.equal(result.status, "admitted_with_open_obligations");
  assert.equal(result.obligationAssessmentCounts.blocked, 1);
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
      ...requirementTraceLines(manifest),
      "package generated",
      "",
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
  writeFileSync(
    sbtProjectFile,
    [...requirementTraceLines(manifest, "#"), "sbt.version=1.10.7"].join("\n") + "\n",
    "utf8"
  );

  const report = buildPostTransformWorkerResultReport({ manifest, before });

  assert.deepStrictEqual(
    report.materializedFiles.map((file) => file.relativePath),
    [sbtProjectRelativePath, sourceRelativePath]
  );
  assert.equal(report.materializedFiles[0].role, "other");
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed");
});

test("T-159 post-transform assessments do not flatten every requirement onto every product file", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "specification/requirements/01-fixture.md"),
    [
      "# Requirements",
      "",
      "REQ-T066-001: Generate the main source file.",
      "REQ-T066-002: Generate the helper source file."
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t159-post-transform-lineage-not-flattened"
  });
  const requirementIds = requirementObligationIds(manifest);
  const mainRequirement = requirementIds.find((id) => id.endsWith("req_t066_001"));
  const helperRequirement = requirementIds.find((id) => id.endsWith("req_t066_002"));
  assert(mainRequirement);
  assert(helperRequirement);
  const before = snapshotProductMaterializationRoot(
    manifest.productMaterialization
  );
  writeHandoffFiles(manifest);
  writeOutputSurface(manifest, "component_code_surface");
  const mainRelativePath = "src/main/scala/generated/Main.scala";
  const helperRelativePath = "src/main/scala/generated/Helper.scala";
  const mainPath = path.join(manifest.productMaterialization.tenantRoot, mainRelativePath);
  const helperPath = path.join(
    manifest.productMaterialization.tenantRoot,
    helperRelativePath
  );
  const mainContent = [`// ${mainRequirement}`, "package generated", "object Main"].join("\n");
  const helperContent = [
    `// ${helperRequirement}`,
    "package generated",
    "object Helper"
  ].join("\n");
  mkdirSync(dirname(mainPath), { recursive: true });
  writeFileSync(mainPath, `${mainContent}\n`, "utf8");
  writeFileSync(helperPath, `${helperContent}\n`, "utf8");

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  writeProductMaterializationManifest({ manifest, report });
  const materializationManifest = JSON.parse(
    readFileSync(manifest.productMaterialization.manifestFile, "utf8")
  );
  const byPath = new Map(
    materializationManifest.files.map((file) => [
      file.relativePath,
      file.requirementTraceObligationIds
    ])
  );

  assert.deepEqual(byPath.get(mainRelativePath), [mainRequirement]);
  assert.deepEqual(byPath.get(helperRelativePath), [helperRequirement]);
  assert.equal(
    report.obligationAssessments
      .find((assessment) => assessment.obligationId === mainRequirement)
      ?.evidenceRefs.includes(`file://${helperPath}`),
    false
  );
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed", JSON.stringify(postflight.blockingReasons));
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
  const firstRequirementIds = requirementObligationIds(firstManifest);
  assert(firstRequirementIds.length > 0);
  const sourceContent = [
    ...firstRequirementIds.map((id) => `// Implements: ${id}`),
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
  assert.equal(replayedManifest.files[0].materializationSource, "replay");
  assert.match(replayedManifest.files[0].rolePolicyRef, /^target-role-policy:\/\//u);
  assert.equal(
    replayedManifest.files[0].sourceManifestRef,
    `file://${firstManifest.productMaterialization.manifestFile}`
  );
  assert.equal(
    replayedManifest.replay.lineageRefs.includes(
      `file://${firstManifest.productMaterialization.manifestFile}`
    ),
    true
  );
});

test("T-158 replay completeness follows declared product targets, not role-only presence", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "Build Tool: cargo",
      "",
      "- active tenant: hello_world_rust",
      "- selected output root: build_tenants/hello_world_rust",
      "",
      "## Product Files",
      "",
      "- `build_tenants/hello_world_rust/Cargo.toml`",
      "- `build_tenants/hello_world_rust/src/main.rs`"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t158_rust_declared_target_replay",
      "active_tenant: hello_world_rust",
      "selected_output_root: build_tenants/hello_world_rust",
      "ambiguity_risk_appetite: low",
      "build_tenants:",
      "  hello_world_rust:",
      "    output_dir: build_tenants/hello_world_rust",
      "    language: Rust",
      "    build_tool: cargo",
      "    test_runner: cargo test",
      "    module_structure:",
      "      - hello_world_rust"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const firstManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T010000000Z_pid158"
  });
  writeHandoffFiles(firstManifest);
  assert.deepStrictEqual(declaredProductFileTargets(firstManifest), [
    "build_tenants/hello_world_rust/Cargo.toml",
    "build_tenants/hello_world_rust/src/main.rs"
  ]);
  assert.deepStrictEqual(firstManifest.productMaterialization.requiredRoles, [
    "source"
  ]);

  const firstOutput = writeOutputSurface(firstManifest, "component_code_surface");
  const requirementIds = requirementObligationIds(firstManifest);
  assert(requirementIds.length > 0);
  const cargoPath = path.join(firstManifest.productMaterialization.tenantRoot, "Cargo.toml");
  const sourcePath = path.join(firstManifest.productMaterialization.tenantRoot, "src/main.rs");
  const cargoContent = [
    ...requirementIds.slice(0, 3).map((id) => `# ${id}`),
    "",
    "[package]",
    'name = "hello_world_rust"',
    'version = "0.1.0"',
    'edition = "2021"'
  ].join("\n");
  const sourceContent = [
    ...requirementIds.map((id) => `// ${id}`),
    "fn main() {",
    '    println!("Hello, world!");',
    "}"
  ].join("\n");
  mkdirSync(dirname(cargoPath), { recursive: true });
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(cargoPath, `${cargoContent}\n`, "utf8");
  writeFileSync(sourcePath, `${sourceContent}\n`, "utf8");
  writeReport({
    manifest: firstManifest,
    digest: firstOutput.digest,
    summary: "initial Rust product materialization",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "build_config",
        relativePath: "Cargo.toml",
        absolutePath: cargoPath,
        digest: sha256Text(`${cargoContent}\n`),
        byteCount: Buffer.byteLength(`${cargoContent}\n`, "utf8"),
        requirementTraceObligationIds: requirementIds.slice(0, 3)
      },
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "src/main.rs",
        absolutePath: sourcePath,
        digest: sha256Text(`${sourceContent}\n`),
        byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8"),
        requirementTraceObligationIds: requirementIds
      }
    ]
  });
  writeProductMaterializationManifest({
    manifest: firstManifest,
    report: readWorkerResultReport(firstManifest)
  });

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T010100000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const repairOutput = writeOutputSurface(
    repairManifest,
    "component_code_surface_trace_repair"
  );
  const repairedSourceContent = [
    ...requirementIds.map((id) => `// ${id}`),
    "fn main() {",
    '    println!("Hello, world!");',
    "}"
  ].join("\n");
  writeFileSync(sourcePath, `${repairedSourceContent}\n`, "utf8");
  writeReport({
    manifest: repairManifest,
    digest: repairOutput.digest,
    summary: "repair reports only the source role",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "src/main.rs",
        absolutePath: sourcePath,
        digest: sha256Text(`${repairedSourceContent}\n`),
        byteCount: Buffer.byteLength(`${repairedSourceContent}\n`, "utf8"),
        requirementTraceObligationIds: requirementIds
      }
    ]
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

  assert.equal(postflight.status, "passed", JSON.stringify(postflight.blockingReasons));
  assert.deepStrictEqual(
    replayedManifest.files.map((file) => file.relativePath),
    ["Cargo.toml", "src/main.rs"]
  );
  const replayedCargo = replayedManifest.files.find(
    (file) => file.relativePath === "Cargo.toml"
  );
  const currentSource = replayedManifest.files.find(
    (file) => file.relativePath === "src/main.rs"
  );
  assert.equal(replayedCargo.materializationSource, "replay");
  assert.equal(replayedCargo.role, "build_config");
  assert.equal(currentSource.materializationSource, "current_attempt");
  assert.equal(currentSource.role, "source");
});

test("T-164 replay empty predecessor is superseded by later admitted product rows", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "Build Tool: cargo",
      "",
      "- active tenant: hello_world_rust_service",
      "- selected output root: build_tenants/hello_world_rust_service",
      "",
      "## Product Files",
      "",
      "- `build_tenants/hello_world_rust_service/Cargo.toml`",
      "- `build_tenants/hello_world_rust_service/src/main.rs`"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t164_rust_service_replay",
      "active_tenant: hello_world_rust_service",
      "selected_output_root: build_tenants/hello_world_rust_service",
      "ambiguity_risk_appetite: low",
      "build_tenants:",
      "  hello_world_rust_service:",
      "    output_dir: build_tenants/hello_world_rust_service",
      "    language: Rust",
      "    build_tool: cargo",
      "    test_runner: cargo test",
      "    module_structure:",
      "      - hello_world_rust_service"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");

  const emptyManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260513T000100000Z_pid164"
  });
  writeHandoffFiles(emptyManifest);
  const emptyOutput = writeOutputSurface(
    emptyManifest,
    "component_code_surface_empty_attempt"
  );
  writeReport({
    manifest: emptyManifest,
    digest: emptyOutput.digest,
    summary: "failed materialization attempt with no product rows",
    materializedFiles: []
  });
  writeProductMaterializationManifest({
    manifest: emptyManifest,
    report: readWorkerResultReport(emptyManifest)
  });

  const validManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260513T000200000Z_pid164"
  });
  writeHandoffFiles(validManifest);
  const validOutput = writeOutputSurface(validManifest, "component_code_surface");
  const requirementIds = requirementObligationIds(validManifest);
  const cargoPath = path.join(
    validManifest.productMaterialization.tenantRoot,
    "Cargo.toml"
  );
  const sourcePath = path.join(
    validManifest.productMaterialization.tenantRoot,
    "src/main.rs"
  );
  const cargoContent = [
    ...requirementIds.slice(0, 2).map((id) => `# ${id}`),
    "",
    "[package]",
    'name = "hello_world_rust_service"',
    'version = "0.1.0"',
    'edition = "2021"'
  ].join("\n");
  const sourceContent = [
    ...requirementIds.map((id) => `// ${id}`),
    "fn main() {",
    '    println!("helloworld");',
    "}"
  ].join("\n");
  mkdirSync(dirname(cargoPath), { recursive: true });
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(cargoPath, `${cargoContent}\n`, "utf8");
  writeFileSync(sourcePath, `${sourceContent}\n`, "utf8");
  writeReport({
    manifest: validManifest,
    digest: validOutput.digest,
    summary: "valid Rust service product materialization",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "build_config",
        relativePath: "Cargo.toml",
        absolutePath: cargoPath,
        digest: sha256Text(`${cargoContent}\n`),
        byteCount: Buffer.byteLength(`${cargoContent}\n`, "utf8"),
        requirementTraceObligationIds: requirementIds.slice(0, 2)
      },
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "src/main.rs",
        absolutePath: sourcePath,
        digest: sha256Text(`${sourceContent}\n`),
        byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8"),
        requirementTraceObligationIds: requirementIds
      }
    ]
  });
  writeProductMaterializationManifest({
    manifest: validManifest,
    report: readWorkerResultReport(validManifest)
  });

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260513T000300000Z_pid164"
  });
  writeHandoffFiles(repairManifest);
  const repairOutput = writeOutputSurface(
    repairManifest,
    "component_code_surface_trace_repair"
  );
  writeReport({
    manifest: repairManifest,
    digest: repairOutput.digest,
    summary: "trace-only repair after valid materialization",
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

  assert.equal(postflight.status, "passed", JSON.stringify(postflight.blockingReasons));
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_manifest_replay_empty"),
    false
  );
  assert.deepStrictEqual(
    replayedManifest.files.map((file) => file.relativePath),
    ["Cargo.toml", "src/main.rs"]
  );
  assert.equal(replayedManifest.files[0].materializationSource, "replay");
  assert.equal(replayedManifest.files[1].materializationSource, "replay");
});

test("T-158 product materialization target contracts prefer requirement authority", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "specification/requirements/01-fixture.md"),
    [
      "# HWRUSTMIN Requirements",
      "",
      "### REQ-HWRUSTMIN-003 Product Files",
      "",
      "The later product materialization writes `build_tenants/hello_world_rust/Cargo.toml`",
      "and `build_tenants/hello_world_rust/src/main.rs`."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "Build Tool: cargo",
      "",
      "- active tenant: hello_world_rust",
      "- selected output root: build_tenants/hello_world_rust",
      "",
      "## Product Files",
      "",
      "- `build_tenants/hello_world_rust/Cargo.toml`",
      "- `build_tenants/hello_world_rust/src/main.rs`"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t158_requirement_target_authority",
      "active_tenant: hello_world_rust",
      "selected_output_root: build_tenants/hello_world_rust",
      "ambiguity_risk_appetite: low",
      "build_tenants:",
      "  hello_world_rust:",
      "    output_dir: build_tenants/hello_world_rust",
      "    language: Rust",
      "    build_tool: cargo",
      "    test_runner: cargo test",
      "    module_structure:",
      "      - hello_world_rust"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t158-requirement-target-authority"
  });
  const invocationPackage = constructWorkerInvocationPackage({ manifest });

  assert.deepEqual(declaredProductFileTargets(manifest), [
    "build_tenants/hello_world_rust/Cargo.toml",
    "build_tenants/hello_world_rust/src/main.rs"
  ]);
  assert.deepEqual(
    invocationPackage.productMaterializationAuthority.requirementAuthorityTargets,
    invocationPackage.productMaterializationAuthority.declaredProductFileTargets
  );
  assert.equal(
    invocationPackage.productMaterializationAuthority.declaredProductTargetContracts.every(
      (target) => target.source === "requirement_authority"
    ),
    true
  );
  assert.deepEqual(invocationPackage.outputContract.requiredRoles, [
    "source",
    "build_config"
  ]);
});

test("T-158 product materialization reports stale product targets but follows requirements", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "specification/requirements/01-fixture.md"),
    [
      "# HWRUSTMIN Requirements",
      "",
      "### REQ-HWRUSTMIN-003 Product Files",
      "",
      "The later product materialization writes `build_tenants/hello_world_rust/Cargo.toml`",
      "and `build_tenants/hello_world_rust/src/main.rs`."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "Build Tool: cargo",
      "",
      "- active tenant: hello_world_rust",
      "- selected output root: build_tenants/hello_world_rust",
      "",
      "## Product Files",
      "",
      "- `build_tenants/hello_world_rust/src/main.rs`"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t158_requirement_product_target_mismatch",
      "active_tenant: hello_world_rust",
      "selected_output_root: build_tenants/hello_world_rust",
      "ambiguity_risk_appetite: low",
      "build_tenants:",
      "  hello_world_rust:",
      "    output_dir: build_tenants/hello_world_rust",
      "    language: Rust",
      "    build_tool: cargo",
      "    test_runner: cargo test",
      "    module_structure:",
      "      - hello_world_rust"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "t158-requirement-product-target-mismatch"
  });
  const invocationPackage = constructWorkerInvocationPackage({ manifest });

  assert.equal(
    invocationPackage.productMaterializationAuthority.status,
    "passed"
  );
  assert.equal(
    invocationPackage.productMaterializationAuthority.reasonRefs.includes(
      "requirement_product_target_mismatch"
    ),
    true
  );
  assert.deepEqual(
    invocationPackage.productMaterializationAuthority.declaredProductFileTargets,
    [
      "build_tenants/hello_world_rust/Cargo.toml",
      "build_tenants/hello_world_rust/src/main.rs"
    ]
  );
  assert.equal(
    invocationPackage.productMaterializationAuthority.declaredProductTargetContracts.every(
      (target) => target.source === "requirement_authority"
    ),
    true
  );
});

test("T-158 replay preserves predecessor role policy instead of synthesizing it", () => {
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
    runId: "20260511T000110000Z_pid158"
  });
  writeHandoffFiles(firstManifest);
  const sourcePath = path.join(
    firstManifest.productMaterialization.tenantRoot,
    "src/main/scala/Example.scala"
  );
  const requirementIds = requirementObligationIds(firstManifest);
  assert(requirementIds.length > 0);
  const sourceContent = [
    ...requirementIds.map((id) => `// Implements: ${id}`),
    "package example",
    "object Example { def value: String = \"ok\" }"
  ].join("\n");
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(sourcePath, `${sourceContent}\n`, "utf8");
  mkdirSync(dirname(firstManifest.productMaterialization.manifestFile), {
    recursive: true
  });
  writeFileSync(
    firstManifest.productMaterialization.manifestFile,
    `${JSON.stringify(
      {
        kind: "sdlc_product_materialization_manifest",
        contract: firstManifest.productMaterialization,
        files: [
          {
            kind: "sdlc_materialized_product_file",
            role: "source",
            relativePath: "src/main/scala/Example.scala",
            absolutePath: sourcePath,
            digest: sha256Text(`${sourceContent}\n`),
            byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8"),
            requirementTraceObligationIds: requirementIds
          }
        ]
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000120000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const repairOutput = writeOutputSurface(
    repairManifest,
    "component_code_surface_trace_repair"
  );
  writeReport({
    manifest: repairManifest,
    digest: repairOutput.digest,
    summary: "trace-only repair with predecessor missing role policy",
    materializedFiles: []
  });

  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: readWorkerResultReport(repairManifest)
  });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes(
      "materialized_product_replay_role_policy_missing"
    ),
    true,
    JSON.stringify(postflight.blockingReasons, null, 2)
  );
});

test("T-158 observed unchanged repair files keep prior admitted role policy before path heuristics", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_test_surface");
  const firstManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 15,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000150000Z_pid158"
  });
  writeHandoffFiles(firstManifest);
  const firstOutput = writeOutputSurface(firstManifest, "component_test_surface");
  const testRelativePath = "src/main/scala/Example.scala";
  const testPath = path.join(
    firstManifest.productMaterialization.tenantRoot,
    testRelativePath
  );
  const testContent = [
    ...requirementTraceLines(firstManifest),
    "package example",
    "",
    "object ExamplePriorTest {",
    "  val exercised = true",
    "}"
  ].join("\n") + "\n";
  mkdirSync(dirname(testPath), { recursive: true });
  writeFileSync(testPath, testContent, "utf8");
  writeReport({
    manifest: firstManifest,
    digest: firstOutput.digest,
    summary: "initial test materialization on a source-looking path",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "test",
        relativePath: testRelativePath,
        absolutePath: testPath,
        digest: sha256Text(testContent),
        byteCount: Buffer.byteLength(testContent, "utf8"),
        requirementTraceObligationIds: requirementObligationIds(firstManifest)
      }
    ]
  });
  writeProductMaterializationManifest({
    manifest: firstManifest,
    report: readWorkerResultReport(firstManifest)
  });

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 15,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000151000Z_pid158"
  });
  const before = snapshotProductMaterializationRoot(
    repairManifest.productMaterialization
  );
  writeHandoffFiles(repairManifest);
  mkdirSync(dirname(repairManifest.outputFile), { recursive: true });
  const repairContent = "# component_test_surface\n\nTrace-only repair.\n";
  writeFileSync(repairManifest.outputFile, repairContent, "utf8");

  const repairReport = buildPostTransformWorkerResultReport({
    manifest: repairManifest,
    before
  });
  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: repairReport
  });

  assert.equal(repairReport.materializedFiles.length, 1);
  assert.equal(repairReport.materializedFiles[0].role, "test");
  assert.equal(repairReport.materializedFiles[0].materializationSource, "replay");
  assert.equal(
    repairReport.materializedFiles[0].rolePolicyRef,
    "target-role-policy://odd-sdlc/product-test-tree"
  );
  assert.equal(postflight.status, "passed");
});

test("T-158 product materialization repair without predecessor still blocks", () => {
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
    runId: "20260511T000200000Z_pid158"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "component_code_surface_trace_repair");
  writeReport({
    manifest,
    digest: output.digest,
    summary: "trace-only repair with no predecessor",
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

test("T-158 mismatched predecessor materialization cannot satisfy repair", () => {
  const workspace = makeWorkspace();
  const baseProfile = deriveSdlcConformProjectProfileFromWorkspace(workspace);
  const firstProfile = {
    ...baseProfile,
    activeTenant: "scala_spark",
    selectedOutputRoot: "build_tenants/scala_spark",
    declaredOutputRoot: "build_tenants/scala_spark"
  };
  const repairProfile = {
    ...baseProfile,
    activeTenant: "scala_spark",
    selectedOutputRoot: "build_tenants/scala_spark_repair",
    declaredOutputRoot: "build_tenants/scala_spark_repair"
  };
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const firstManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    conformedProject: firstProfile,
    runId: "20260511T000300000Z_pid158"
  });
  writeHandoffFiles(firstManifest);
  const firstOutput = writeOutputSurface(firstManifest, "component_code_surface");
  const sourcePath = path.join(
    firstManifest.productMaterialization.tenantRoot,
    "src/main/scala/Example.scala"
  );
  const sourceContent = "package example\nobject Example\n";
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(sourcePath, sourceContent, "utf8");
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
        digest: sha256Text(sourceContent),
        byteCount: Buffer.byteLength(sourceContent, "utf8")
      }
    ]
  });
  writeProductMaterializationManifest({
    manifest: firstManifest,
    report: readWorkerResultReport(firstManifest)
  });

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    conformedProject: repairProfile,
    runId: "20260511T000400000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const repairOutput = writeOutputSurface(repairManifest, "component_code_surface_trace_repair");
  writeReport({
    manifest: repairManifest,
    digest: repairOutput.digest,
    summary: "trace-only repair with mismatched predecessor",
    materializedFiles: []
  });

  const repairReport = readWorkerResultReport(repairManifest);
  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: repairReport
  });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_manifest_replay_target_mismatch"),
    true
  );
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_files_missing"),
    true
  );
});

test("T-158 corrupt predecessor materialization emits replay diagnostic", () => {
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
    runId: "20260511T000500000Z_pid158"
  });
  writeHandoffFiles(firstManifest);
  mkdirSync(dirname(firstManifest.productMaterialization.manifestFile), { recursive: true });
  writeFileSync(firstManifest.productMaterialization.manifestFile, "{not json", "utf8");

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000600000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const repairOutput = writeOutputSurface(repairManifest, "component_code_surface_trace_repair");
  writeReport({
    manifest: repairManifest,
    digest: repairOutput.digest,
    summary: "trace-only repair with corrupt predecessor",
    materializedFiles: []
  });

  const repairReport = readWorkerResultReport(repairManifest);
  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: repairReport
  });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_manifest_replay_parse_failed"),
    true
  );
});

test("T-158 replay keeps diagnostics when an older predecessor can replay", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  const validManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000510000Z_pid158"
  });
  writeHandoffFiles(validManifest);
  const validOutput = writeOutputSurface(validManifest, "component_code_surface");
  const requirementIds = requirementObligationIds(validManifest);
  assert(requirementIds.length > 0);
  const sourcePath = path.join(
    validManifest.productMaterialization.tenantRoot,
    "src/main/scala/Example.scala"
  );
  const sourceContent = [
    ...requirementIds.map((id) => `// Implements: ${id}`),
    "package example",
    "object Example { def value: String = \"ok\" }"
  ].join("\n");
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(sourcePath, `${sourceContent}\n`, "utf8");
  writeReport({
    manifest: validManifest,
    digest: validOutput.digest,
    summary: "valid predecessor materialization",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "src/main/scala/Example.scala",
        absolutePath: sourcePath,
        digest: sha256Text(`${sourceContent}\n`),
        byteCount: Buffer.byteLength(`${sourceContent}\n`, "utf8"),
        requirementTraceObligationIds: requirementIds
      }
    ]
  });
  writeProductMaterializationManifest({
    manifest: validManifest,
    report: readWorkerResultReport(validManifest)
  });

  const corruptManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000520000Z_pid158"
  });
  writeHandoffFiles(corruptManifest);
  mkdirSync(dirname(corruptManifest.productMaterialization.manifestFile), {
    recursive: true
  });
  writeFileSync(corruptManifest.productMaterialization.manifestFile, "{not json", "utf8");

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000530000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const repairOutput = writeOutputSurface(repairManifest, "component_code_surface_trace_repair");
  writeReport({
    manifest: repairManifest,
    digest: repairOutput.digest,
    summary: "trace-only repair with valid older and corrupt newer predecessor",
    materializedFiles: []
  });

  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: readWorkerResultReport(repairManifest)
  });

  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_manifest_replay_parse_failed"),
    true,
    JSON.stringify(postflight.blockingReasons, null, 2)
  );
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_files_missing"),
    false,
    JSON.stringify(postflight.blockingReasons, null, 2)
  );
});

test("T-158 unchanged observed files cannot bypass corrupt predecessor replay diagnostics", () => {
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
    runId: "20260511T000700000Z_pid158"
  });
  writeHandoffFiles(firstManifest);
  mkdirSync(dirname(firstManifest.productMaterialization.manifestFile), { recursive: true });
  writeFileSync(firstManifest.productMaterialization.manifestFile, "{not json", "utf8");

  const sourcePath = path.join(
    firstManifest.productMaterialization.tenantRoot,
    "src/main/scala/Example.scala"
  );
  const sourceContent = "package example\nobject ExistingExample\n";
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(sourcePath, sourceContent, "utf8");

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T000800000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const before = snapshotProductMaterializationRoot(
    repairManifest.productMaterialization
  );
  writeOutputSurface(repairManifest, "component_code_surface_trace_repair");

  const repairReport = buildPostTransformWorkerResultReport({
    manifest: repairManifest,
    before
  });
  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: repairReport
  });

  assert.equal(repairReport.materializedFiles.length, 0);
  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_manifest_replay_parse_failed"),
    true
  );
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_files_missing"),
    true
  );
});

test("T-158 unchanged observed diagnostics block even when current files satisfy roles", () => {
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
    runId: "20260511T000900000Z_pid158"
  });
  writeHandoffFiles(firstManifest);
  mkdirSync(dirname(firstManifest.productMaterialization.manifestFile), { recursive: true });
  writeFileSync(firstManifest.productMaterialization.manifestFile, "{not json", "utf8");

  const unchangedPath = path.join(
    firstManifest.productMaterialization.tenantRoot,
    "src/main/scala/Existing.scala"
  );
  mkdirSync(dirname(unchangedPath), { recursive: true });
  writeFileSync(
    unchangedPath,
    "// Implements: REQ-T066-001\npackage example\nobject Existing\n",
    "utf8"
  );

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    projectConstraints: constraints,
    runId: "20260511T001000000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const before = snapshotProductMaterializationRoot(
    repairManifest.productMaterialization
  );
  writeOutputSurface(repairManifest, "component_code_surface_trace_repair");
  const changedPath = path.join(
    repairManifest.productMaterialization.tenantRoot,
    "src/main/scala/Changed.scala"
  );
  writeFileSync(
    changedPath,
    "// Implements: REQ-T066-001\npackage example\nobject Changed\n",
    "utf8"
  );

  const repairReport = buildPostTransformWorkerResultReport({
    manifest: repairManifest,
    before
  });
  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: repairReport
  });

  assert.equal(repairReport.materializedFiles.length, 1);
  assert.equal(repairReport.materializationDiagnostics.length, 1);
  assert.equal(postflight.status, "blocked");
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_manifest_replay_parse_failed"),
    true
  );
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_files_missing"),
    false
  );
});

test("T-158 non-materialization surface edges ignore empty product replay manifests", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_implementation_module_surface");
  const firstManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 8,
    contract,
    projectConstraints: constraints,
    runId: "20260511T001050000Z_pid158"
  });
  assert.equal(firstManifest.productMaterialization.required, false);
  writeHandoffFiles(firstManifest);
  const firstOutput = writeOutputSurface(firstManifest, "implementation_module_surface");
  writeReport({
    manifest: firstManifest,
    digest: firstOutput.digest,
    summary: "non-materialization surface attempt with no product files",
    materializedFiles: []
  });
  writeProductMaterializationManifest({
    manifest: firstManifest,
    report: readWorkerResultReport(firstManifest)
  });

  const unchangedSurfacePath = path.join(
    firstManifest.productMaterialization.tenantRoot,
    "design/feature_decomp_surface.md"
  );
  mkdirSync(dirname(unchangedSurfacePath), { recursive: true });
  writeFileSync(
    unchangedSurfacePath,
    "# feature_decomp_surface\n\nPrior surface that remains unchanged.\n",
    "utf8"
  );

  const repairManifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 8,
    contract,
    projectConstraints: constraints,
    runId: "20260511T001060000Z_pid158"
  });
  writeHandoffFiles(repairManifest);
  const before = snapshotProductMaterializationRoot(
    repairManifest.productMaterialization
  );
  writeOutputSurface(repairManifest, "implementation_module_surface_repair");

  const repairReport = buildPostTransformWorkerResultReport({
    manifest: repairManifest,
    before
  });
  const postflight = evaluateWorkerResultPostflight({
    manifest: repairManifest,
    report: repairReport
  });

  assert.equal(repairReport.materializedFiles.length, 0);
  assert.equal(repairReport.materializationDiagnostics.length, 0);
  assert.equal(postflight.status, "passed");
  assert.equal(
    postflight.blockingReasons.includes("materialized_product_manifest_replay_empty"),
    false
  );
});

test("T-158 replay materialized file carrier requires predecessor lineage refs", () => {
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
    runId: "20260511T001100000Z_pid158"
  });
  writeHandoffFiles(manifest);
  const output = writeOutputSurface(manifest, "component_code_surface");
  const sourcePath = path.join(
    manifest.productMaterialization.tenantRoot,
    "src/main/scala/Example.scala"
  );
  const sourceContent = "// Implements: REQ-T066-001\npackage example\nobject Example\n";
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(sourcePath, sourceContent, "utf8");
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
        summary: "malformed replay row without predecessor refs",
        unresolvedReasons: [],
        materializedFiles: [
          {
            kind: "sdlc_materialized_product_file",
            role: "source",
            relativePath: "src/main/scala/Example.scala",
            absolutePath: sourcePath,
            digest: sha256Text(sourceContent),
            byteCount: Buffer.byteLength(sourceContent, "utf8"),
            materializationSource: "replay"
          }
        ],
        executionEvidence: null,
        obligationAssessments: []
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  assert.throws(
    () => readWorkerResultReport(manifest),
    /replayed materialized files require source lineage refs/u
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

test("T-159 component-depth assurance admits workspace-relative declared product paths", () => {
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
    runId: "t159-workspace-relative-component-path"
  });
  writeHandoffFiles(manifest);
  const tenantRelativePath = "src/cli.ts";
  const workspaceRelativePath = path.posix.join(
    manifest.productMaterialization.selectedOutputRoot,
    tenantRelativePath
  );
  const sourcePath = path.join(
    manifest.productMaterialization.tenantRoot,
    tenantRelativePath
  );
  const requirementIds = requirementObligationIds(manifest);
  assert(requirementIds.length > 0);
  const sourceContent = [
    ...requirementIds.map((id) => `// Implements: ${id}`),
    "export function run(): string {",
    "  return \"ok\";",
    "}"
  ].join("\n");
  mkdirSync(dirname(sourcePath), { recursive: true });
  writeFileSync(sourcePath, `${sourceContent}\n`, "utf8");
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_code_surface",
    componentRealizationRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId: "component:app-core.cli",
        moduleName: "app-core",
        relativePath: workspaceRelativePath,
        publicBoundary: "exports the CLI command boundary",
        requirementIds: ["REQ-T066-001"],
        sourceAssetRefs: ["asset://t159/bootstrap"]
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
    summary: "generated product source with workspace-relative realization path",
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: tenantRelativePath,
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
        `component_declared_path_not_materialized:${workspaceRelativePath}`
    ),
    false,
    JSON.stringify(ledger.reasons, null, 2)
  );
  assert.equal(ledger.verdict, "satisfied");
});

test("T-160 product materialization authority admits plain Product Files section", () => {
  const workspace = makeWorkspace();
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "- active tenant: hello_world_javascript",
      "- selected output root: build_tenants/hello_world_javascript",
      "",
      "## Product Files",
      "",
      "- `build_tenants/hello_world_javascript/src/hello.js` is generated by traversal."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t160_product_files_heading",
      "active_tenant: hello_world_javascript",
      "selected_output_root: build_tenants/hello_world_javascript",
      "ambiguity_risk_appetite: low",
      "build_tenants:",
      "  hello_world_javascript:",
      "    output_dir: build_tenants/hello_world_javascript",
      "    language: JavaScript",
      "    build_tool: node",
      "    test_runner: node",
      "    module_structure:",
      "      - hello_world_javascript"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: workspace });
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const contract = hookContractByEdgeName("derive_lite_component_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "lite_design_module_implementation",
    edgeName: "derive_lite_component_code_surface",
    vectorIndex: 2,
    contract,
    projectConstraints: constraints,
    runId: "t160-product-files-heading"
  });

  assert.deepStrictEqual(declaredProductFileTargets(manifest), [
    "build_tenants/hello_world_javascript/src/hello.js"
  ]);
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

test("T-159 component-depth prompts pin the top-level register envelope on first attempt", () => {
  const workspace = makeWorkspace();
  const constraints = deriveSdlcProjectConstraintsFromWorkspace(workspace);
  const cases = [
    {
      edgeName: "derive_implementation_component_topology_surface",
      targetAssetType: "implementation_component_topology_surface",
      rowDirective: /component_depth_register\.componentTopologyRows/u
    },
    {
      edgeName: "derive_component_realization_schedule_surface",
      targetAssetType: "component_realization_schedule_surface",
      rowDirective: /component_depth_register\.componentRealizationRows/u,
      extraDirectives: []
    },
    {
      edgeName: "derive_component_code_surface",
      targetAssetType: "component_code_surface",
      rowDirective: /component_depth_register\.componentRealizationRows/u,
      extraDirectives: [
        /source target set from admitted component topology\/schedule authority/u,
        /Build config files alone never satisfy required role source/u
      ]
    }
  ];

  for (const promptCase of cases) {
    const contract = hookContractByEdgeName(promptCase.edgeName);
    const manifest = deriveWorkerHandoffManifest({
      workspaceRoot: workspace,
      graphFunctionName: promptCase.edgeName,
      edgeName: contract.edgeName,
      vectorIndex: 0,
      contract,
      projectConstraints: constraints,
      runId: `t159-component-depth-envelope-${promptCase.targetAssetType}`
    });
    const handoffFiles = writeHandoffFiles(manifest);
    const prompt = readFileSync(handoffFiles.promptPath, "utf8");
    const invocationPackage = JSON.parse(
      readFileSync(handoffFiles.invocationPackagePath, "utf8")
    );
    const envelopePattern = new RegExp(
      `Emit a fenced \`json component_depth_register\` carrier with ` +
        `\`kind:"sdlc_component_depth_register"\`, ` +
        `\`registerVersion:"ts-component-depth-v1"\`, and ` +
        `\`targetAssetType:"${promptCase.targetAssetType}"\`\\.`,
      "u"
    );

    assert.match(prompt, envelopePattern);
    assert.match(prompt, promptCase.rowDirective);
    for (const extraDirective of promptCase.extraDirectives ?? []) {
      assert.match(prompt, extraDirective);
    }
    assert.equal(
      invocationPackage.outcomeDirectives.some((directive) =>
        envelopePattern.test(directive)
      ),
      true
    );
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
    ...requirementTraceLines(manifest),
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
      byteCount: Buffer.byteLength(`${testContent}\n`, "utf8"),
      requirementTraceObligationIds: requirementObligationIds(manifest)
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

test("T-159 lineage-only product materialization miss yields for operator iteration", () => {
  const lineageReason = makeSdlcBlockingReason({
    code: "materialized_product_requirement_lineage_missing",
    detail: "src/main.rs: requirementTraceObligationIds",
    evidenceRefs: ["file:///workspace/build_tenants/hello_world_rust/src/main.rs"]
  });
  const yieldResumeBasis = deriveSdlcProductLineageYieldResumeBasis({
    runRef: "file%3A%2F%2F%2Fworkspace%2F.ai-workspace%2Fruntime%2Frun-1",
    edgeRef: "edge://odd-sdlc/derive_component_code_surface/0",
    blockingReasonCarriers: [lineageReason],
    productEvidenceRefs: [
      "file:///workspace/build_tenants/hello_world_rust/src/main.rs"
    ],
    livenessProjectionRefs: ["liveness://odd-sdlc/run-1"]
  });

  assert(yieldResumeBasis);
  assert.equal(
    yieldResumeBasis.yieldKind,
    "partial_product_evidence_admitted_current_edge_should_resume"
  );
  assert.equal(
    yieldResumeBasis.resumePolicyRef,
    "resume-policy://odd-sdlc/materialized-product-lineage/operator-iterate"
  );
  assert.deepStrictEqual(yieldResumeBasis.admittedProgressRefs, [
    "file:///workspace/build_tenants/hello_world_rust/src/main.rs"
  ]);

  const competingRetryReason = makeSdlcBlockingReason({
    code: "test_execution_not_succeeded",
    evidenceRefs: ["file:///workspace/.ai-workspace/runtime/run-1/postflight.json"]
  });
  assert.equal(
    deriveSdlcProductLineageYieldResumeBasis({
      runRef: "file%3A%2F%2F%2Fworkspace%2F.ai-workspace%2Fruntime%2Frun-1",
      edgeRef: "edge://odd-sdlc/derive_component_code_surface/0",
      blockingReasonCarriers: [lineageReason, competingRetryReason],
      productEvidenceRefs: [
        "file:///workspace/build_tenants/hello_world_rust/src/main.rs"
      ],
      livenessProjectionRefs: ["liveness://odd-sdlc/run-1"]
    }),
    null
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
