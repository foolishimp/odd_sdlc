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
      "const priorGapCount = manifest.traversalObligationContext.obligations.filter((obligation) => obligation.obligationKind === 'prior_gap').length;",
      "appendFileSync(path.join(runtimeRoot, 't101_edge_log.jsonl'), `${JSON.stringify({ edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, attempt: counts[manifest.edgeName], priorGapCount, archiveRoot: manifest.archiveRoot })}\\n`, 'utf8');",
      "function digestText(content) { return `sha256:${createHash('sha256').update(content, 'utf8').digest('hex')}`; }",
      "function materializedFile(role, relativePath, content) { const absolutePath = path.join(manifest.productMaterialization.tenantRoot, relativePath); mkdirSync(dirname(absolutePath), { recursive: true }); writeFileSync(absolutePath, content, 'utf8'); return { kind: 'sdlc_materialized_product_file', role, relativePath, absolutePath, digest: digestText(content), byteCount: Buffer.byteLength(content, 'utf8') }; }",
      "const materializedFiles = [];",
      "const outputLines = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`, `attempt: ${counts[manifest.edgeName]}`, `prior_gap_count: ${priorGapCount}`, ''];",
      "if (manifest.targetAssetType.endsWith('_schedule_surface')) { outputLines.push('## module_dependency_graph', '- node: retry-core', '## realization_tranches', '- id: RT-001 | module: retry-core | state: open', '## tranche_obligation_ledger', '- RT-001: REQ-T101-001', '## tranche_gap_ledger', '- RT-001: open', '## next_tranche_selector', '- next: RT-001'); }",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "const outputContent = `${outputLines.join('\\n')}\\n`;",
      "writeFileSync(manifest.outputFile, outputContent, 'utf8');",
      "if (manifest.targetAssetType === 'code_surface') { materializedFiles.push(materializedFile('source', 'src/index.ts', ['// Implements: REQ-T101-001', 'export function retryCore(): string {', \"  return 'retry-core';\", '}', ''].join('\\n'))); }",
      "if (manifest.targetAssetType === 'test_module_surface') { materializedFiles.push(materializedFile('test', 'test/index.test.ts', ['// Validates: REQ-T101-002', \"import test from 'node:test';\", \"import assert from 'node:assert/strict';\", \"test('retry core', () => {\", \"  assert.equal('retry-core', 'retry-core');\", '});', ''].join('\\n'))); }",
      "if (manifest.edgeName === 'derive_code_surface' && counts[manifest.edgeName] === 1) { process.exit(0); }",
      "const evidenceRefs = [manifest.outputFile, ...materializedFiles.map((file) => file.absolutePath)];",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [...evidenceRefs, ...obligation.evidenceRefs], blockingReasons: [] }));",
      "const executionEvidence = manifest.targetAssetType === 'test_run_archive_surface' ? { kind: 'sdlc_worker_execution_evidence', lane: 'test', command: manifest.productMaterialization.testExecutionContract, status: 'succeeded', reportRefs: [manifest.outputFile], testsObserved: 1, passedCount: 1, failedCount: 0 } : null;",
      "const report = { kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: digestText(outputContent), summary: `generated ${manifest.targetAssetType}`, unresolvedReasons: [], materializedFiles, executionEvidence, obligationAssessments };",
      "writeFileSync(manifest.reportFile, `${JSON.stringify(report, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

test("T-101 autonomous loop continues retry-eligible worker report rejection", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t101"
  });
  assert.equal(install.kind, "installed");

  const workerScript = writeRetryWorker(workspace);
  const start = await runOddSdlcCliAsync([
    "start",
    "--workspace",
    workspace,
    "--target",
    "next",
    "--until",
    "blocked",
    "--worker",
    `process://node?script=${encodeURIComponent(workerScript)}`
  ]);

  assert.equal(start.status, "ok");
  assert.equal(start.payload.loop.stoppedBy, "converged");

  const steps = start.payload.loop.steps;
  const rejectedIndex = steps.findIndex(
    (step) =>
      step.status === "worker_report_rejected" &&
      step.currentEdge === "derive_code_surface"
  );
  assert.notEqual(rejectedIndex, -1);
  assert.equal(steps[rejectedIndex].nextLawfulAction, "retry_same_edge_with_gap_dossier");
  assert.equal(steps[rejectedIndex + 1].status, "worker_invoked");
  assert.equal(
    steps[rejectedIndex + 1].currentEdge,
    "derive_test_design_surface"
  );

  const edgeLog = readFileSync(
    path.join(workspace, ".ai-workspace/runtime/odd_sdlc/t101_edge_log.jsonl"),
    "utf8"
  )
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const codeAttempts = edgeLog.filter(
    (entry) => entry.edgeName === "derive_code_surface"
  );
  assert.equal(codeAttempts.length, 2);
  assert.equal(codeAttempts[0].priorGapCount, 0);
  assert(codeAttempts[1].priorGapCount > 0);
});
