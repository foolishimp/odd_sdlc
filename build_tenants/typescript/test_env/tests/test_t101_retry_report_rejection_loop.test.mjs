// Validates: REQ-F-ODDSDLC-062
// Validates: T-101

import test from "node:test";
import assert from "node:assert/strict";
import {
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
  installOddSdlcTypescript,
  runOddSdlcCliAsync
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t101-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nBuild a retry-visible report rejection fixture.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    "# Product\n\nT-101 retry loop fixture.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    "# Goals\n\n- prove retry eligible report rejection continues\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-retry.md"),
    [
      "# Retry Requirements",
      "",
      "REQ-T101-001: Retry a report-admission failure when the operator emits retry repair truth.",
      "REQ-T101-002: Carry the prior gap dossier into the next worker handoff."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t101_fixture",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript",
      "    language: TypeScript",
      "    build_tool: npm",
      "    test_runner: npm test",
      "    module_structure:",
      "      - retry-core"
    ].join("\n"),
    "utf8"
  );
  return root;
}

function writeRetryWorker(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t101_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const runtimeRoot = path.join(manifest.workspaceRoot, '.ai-workspace', 'runtime', 'odd_sdlc');",
      "mkdirSync(runtimeRoot, { recursive: true });",
      "const countsPath = path.join(runtimeRoot, 't101_attempt_counts.json');",
      "const counts = existsSync(countsPath) ? JSON.parse(readFileSync(countsPath, 'utf8')) : {};",
      "counts[manifest.edgeName] = (counts[manifest.edgeName] ?? 0) + 1;",
      "writeFileSync(countsPath, `${JSON.stringify(counts, null, 2)}\\n`, 'utf8');",
      "const priorGapCount = manifest.traversalObligationContext.deltaSummary.priorGapCount;",
      "appendFileSync(path.join(runtimeRoot, 't101_edge_log.jsonl'), `${JSON.stringify({ edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, attempt: counts[manifest.edgeName], priorGapCount, archiveRoot: manifest.archiveRoot })}\\n`, 'utf8');",
      "function digestText(content) { return `sha256:${createHash('sha256').update(content, 'utf8').digest('hex')}`; }",
      "function materializedFile(role, relativePath, content) { const absolutePath = path.join(manifest.productMaterialization.tenantRoot, relativePath); mkdirSync(dirname(absolutePath), { recursive: true }); writeFileSync(absolutePath, content, 'utf8'); return { kind: 'sdlc_materialized_product_file', role, relativePath, absolutePath, digest: digestText(content), byteCount: Buffer.byteLength(content, 'utf8') }; }",
      "const sourceRelative = 'retry-core/src/index.ts';",
      "const testRelative = 'retry-core/test/index.test.ts';",
      "function componentDepthRegister() {",
      "  const base = { kind: 'sdlc_component_depth_register', registerVersion: 'ts-component-depth-v1', targetAssetType: manifest.targetAssetType };",
      "  const componentRow = { kind: 'sdlc_component_realization_row', componentId: 'retry-core', moduleName: 'retry-core', relativePath: sourceRelative, publicBoundary: 'retryCore', requirementIds: ['REQ-T101-001'], sourceAssetRefs: ['fixture://t101'] };",
      "  const topologyRow = { kind: 'sdlc_component_topology_row', componentId: 'retry-core', moduleName: 'retry-core', relativePath: sourceRelative, publicBoundary: 'retryCore', concernRole: 'other', requirementIds: ['REQ-T101-001'], sourceAssetRefs: ['fixture://t101'] };",
      "  const testTopologyRow = { kind: 'sdlc_test_component_topology_row', testClassId: 'RetryCoreSpec', relativePath: testRelative, testcaseIds: ['TC-T101-001'], componentIds: ['retry-core'], requirementIds: ['REQ-T101-002'], shardId: 'test-shard-01-retry-core' };",
      "  const testRow = { kind: 'sdlc_component_test_realization_row', testClassId: 'RetryCoreSpec', relativePath: testRelative, testcaseIds: ['TC-T101-001'], componentIds: ['retry-core'], requirementIds: ['REQ-T101-002'], shardId: 'test-shard-01-retry-core' };",
      "  const qualificationRow = { kind: 'sdlc_component_test_qualification_row', testClassId: 'RetryCoreSpec', testcaseIds: ['TC-T101-001'], componentIds: ['retry-core'], requirementIds: ['REQ-T101-002'], status: 'passed', evidenceRefs: [manifest.outputFile] };",
      "  const repairSchedule = { kind: 'sdlc_component_repair_schedule', registerVersion: 'ts-component-depth-v1', scheduleStatus: 'no_repair_required', repairRows: [], evidenceRefs: [manifest.outputFile] };",
      "  if (manifest.targetAssetType === 'implementation_component_topology_surface') return { ...base, componentTopologyRows: [topologyRow] };",
      "  if (manifest.targetAssetType === 'component_realization_schedule_surface' || manifest.targetAssetType === 'component_code_surface' || manifest.targetAssetType === 'component_realization_qualification_surface') return { ...base, componentRealizationRows: [componentRow] };",
      "  if (manifest.targetAssetType === 'test_component_topology_surface') return { ...base, testComponentTopologyRows: [testTopologyRow] };",
      "  if (manifest.targetAssetType === 'component_test_surface') return { ...base, componentTestRows: [testRow] };",
      "  if (manifest.targetAssetType === 'component_test_qualification_surface') return { ...base, componentTestQualificationRows: [qualificationRow] };",
      "  if (manifest.targetAssetType === 'component_repair_schedule_surface') return { ...base, componentRepairSchedule: repairSchedule };",
      "  if (manifest.targetAssetType === 'release_depth_parity_surface') return { ...base, releaseDepthParity: { kind: 'sdlc_release_depth_parity_assessment', status: 'met', summary: 'T-101 fixture parity met', blockingReasons: [], evidenceRefs: [manifest.outputFile] } };",
      "  return null;",
      "}",
      "const materializedFiles = [];",
      "const outputLines = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`, `attempt: ${counts[manifest.edgeName]}`, `prior_gap_count: ${priorGapCount}`, '', '## Inputs', ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`), ''];",
      "if (manifest.targetAssetType.endsWith('_schedule_surface')) { outputLines.push('## module_dependency_graph', '- node: retry-core', '## realization_tranches', '- id: RT-001 | module: retry-core | state: open', '## tranche_obligation_ledger', '- RT-001: REQ-T101-001', '## tranche_gap_ledger', '- RT-001: open', '## next_tranche_selector', '- next: RT-001'); }",
      "const componentRegister = componentDepthRegister();",
      "if (componentRegister !== null) { outputLines.push('', '```component_depth_register', JSON.stringify(componentRegister, null, 2), '```'); }",
      "if (manifest.edgeName === 'derive_component_code_surface' && counts[manifest.edgeName] === 1) { process.exit(0); }",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "const outputContent = `${outputLines.join('\\n')}\\n`;",
      "writeFileSync(manifest.outputFile, outputContent, 'utf8');",
      "if (manifest.targetAssetType === 'component_code_surface') { materializedFiles.push(materializedFile('source', sourceRelative, ['// Implements: REQ-T101-001', 'export function retryCore(): string {', \"  return 'retry-core';\", '}', ''].join('\\n'))); }",
      "if (manifest.targetAssetType === 'component_test_surface') { materializedFiles.push(materializedFile('test', testRelative, ['// Validates: REQ-T101-002', \"import test from 'node:test';\", \"import assert from 'node:assert/strict';\", \"test('retry core', () => {\", \"  assert.equal('retry-core', 'retry-core');\", '});', ''].join('\\n'))); }",
      "const evidenceRefs = [manifest.outputFile, ...materializedFiles.map((file) => file.absolutePath)];",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [...evidenceRefs, ...obligation.evidenceRefs], blockingReasons: [] }));",
      "const shardEvidence = manifest.productMaterialization.executionShards.map((shard) => ({ kind: 'sdlc_worker_execution_shard_evidence', shardId: shard.shardId, moduleName: shard.moduleName, lane: 'test', command: shard.command, status: 'succeeded', reportRefs: [manifest.outputFile], testsObserved: 1, passedCount: 1, failedCount: 0 }));",
      "const executionEvidence = manifest.targetAssetType === 'test_execution_result_surface' ? { kind: 'sdlc_worker_execution_evidence', lane: 'test', command: manifest.productMaterialization.testExecutionContract, status: 'succeeded', reportRefs: [manifest.outputFile], testsObserved: shardEvidence.length, passedCount: shardEvidence.length, failedCount: 0, shardEvidence } : null;",
      "const report = { kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: digestText(outputContent), summary: `generated ${manifest.targetAssetType}`, unresolvedReasons: [], materializedFiles, executionEvidence, obligationAssessments };",
      "writeFileSync(manifest.reportFile, `${JSON.stringify(report, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

test("T-101 ABG-owned iteration continues retry-eligible worker report rejection", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t101"
  });
  assert.equal(install.kind, "installed");

  const workerScript = writeRetryWorker(workspace);
  const conform = await runOddSdlcCliAsync([
    "start",
    "--workspace",
    workspace,
    "--target",
    "next",
    "--until",
    "converged"
  ]);
  assert.equal(conform.status, "ok");
  assert.equal(conform.payload.status, "converged");

  const start = await runOddSdlcCliAsync([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:bootstrap_release_self_test",
    "--until",
    "blocked",
    "--worker",
    `process://node?script=${encodeURIComponent(workerScript)}`
  ]);

  assert.equal(start.status, "ok");
  assert.equal(start.payload.status, "converged");
  assert.equal("loop" in start.payload, false);
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("retry_repair_planned"),
    true
  );
  assert.equal(
    start.payload.emittedRuntimeEventKinds.includes("retry_progress_recorded"),
    true
  );

  const edgeLog = readFileSync(
    path.join(workspace, ".ai-workspace/runtime/odd_sdlc/t101_edge_log.jsonl"),
    "utf8"
  )
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const codeAttempts = edgeLog.filter(
    (entry) => entry.edgeName === "derive_component_code_surface"
  );
  assert.equal(codeAttempts.length, 2);
  assert.equal(codeAttempts[0].priorGapCount, 0);
  assert(codeAttempts[1].priorGapCount > 0);
  const testDesignAttempts = edgeLog.filter(
    (entry) => entry.edgeName === "derive_test_design_surface"
  );
  assert(testDesignAttempts.length > 0);
  assert.equal(testDesignAttempts[0].priorGapCount, 0);
});
