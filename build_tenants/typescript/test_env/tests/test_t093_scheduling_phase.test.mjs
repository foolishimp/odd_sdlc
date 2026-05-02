// Validates: REQ-F-ODDSDLC-057
// Validates: T-093

import test from "node:test";
import assert from "node:assert/strict";
import {
  appendFileSync,
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
  BOOTSTRAP_RELEASE_FUNCTION_CATALOG,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  installOddSdlcTypescript,
  runOddSdlcCliAsync,
  SDLC_HOOK_TARGET_POLICY
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t093-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    [
      "# Intent",
      "",
      "Build a governed product through a schedule-constrained realization edge."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    "# Product\n\nT-093 scheduling fixture.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    "# Goals\n\n- prove schedule surfaces constrain realization materialization\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    "# Imported Sources\n\n- fixture://t093\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-schedule.md"),
    [
      "# Scheduling Requirements",
      "",
      "REQ-T093-001: Produce implementation work from an admitted realization schedule.",
      "REQ-T093-002: Produce test archive evidence from an admitted test schedule."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    "# Project Bootstrap\n\nproject_slug: t093_fixture\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t093_fixture",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript/",
      "    language: TypeScript",
      "    build_tool: npm",
      "    test_runner: npm test",
      "    module_structure:",
      "      - api",
      "      - worker"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/TENANT_REGISTRY.md"),
    "# Tenant Registry\n\n- tenant: typescript\n",
    "utf8"
  );
  return root;
}

function writeWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t093_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const edgeLog = path.join(manifest.workspaceRoot, '.ai-workspace', 'runtime', 'odd_sdlc', 't093_edge_log.jsonl');",
      "mkdirSync(dirname(edgeLog), { recursive: true });",
      "appendFileSync(edgeLog, `${JSON.stringify({ edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, inputAssetTypes: manifest.inputAssetTypes, outputFile: manifest.outputFile, archiveRoot: manifest.archiveRoot })}\\n`, 'utf8');",
      "const scheduleLines = manifest.targetAssetType.includes('schedule') ? ['## Work Packages', '- status: open | package: synthesize target surface | dependency: admitted design/module', '- status: done | package: preserve source authority | checkpoint: obligation assessment', '- status: blocked | package: re-enter same edge | condition: unresolved gap dossier', '## Re-entry Conditions', '- retry_same_edge when postflight or assurance returns open gap'] : [];",
      "const obligationLines = manifest.traversalObligationContext.obligations.flatMap((obligation) => [`- ${obligation.obligationId}: ${obligation.summary}`, ...obligation.payload.sourceSnippets.map((snippet) => `  - ${snippet}`)]);",
      "const outputContent = [`# ${manifest.targetAssetType}`, '', `graph_function: ${manifest.graphFunctionName}`, `edge: ${manifest.edgeName}`, `target: ${manifest.targetAssetType}`, '', '## Inputs', ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`), '', ...scheduleLines, '', '## Obligations', ...(obligationLines.length > 0 ? obligationLines : ['- none']), '', '## Result', `Generated ${manifest.targetAssetType} under the current graph-owned schedule contract.`].join('\\n');",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, `${outputContent}\\n`, 'utf8');",
      "function digestText(content) { return `sha256:${createHash('sha256').update(content, 'utf8').digest('hex')}`; }",
      "function materializedFile(role, relativePath, content) { const absolutePath = path.join(manifest.productMaterialization.tenantRoot, relativePath); mkdirSync(dirname(absolutePath), { recursive: true }); writeFileSync(absolutePath, content, 'utf8'); return { kind: 'sdlc_materialized_product_file', role, relativePath, absolutePath, digest: digestText(content), byteCount: Buffer.byteLength(content, 'utf8') }; }",
      "const materializedFiles = [];",
      "if (manifest.targetAssetType === 'code_surface') { materializedFiles.push(materializedFile('source', 'src/main.ts', ['// Implements: REQ-T093-001', 'export function scheduledValue(seed: number): number {', '  const planned = seed + 1;', '  if (planned > 1) {', '    return planned;', '  }', '  return 1;', '}', ''].join('\\n'))); }",
      "if (manifest.targetAssetType === 'test_module_surface') { materializedFiles.push(materializedFile('test', 'test/main.test.ts', ['// Validates: REQ-T093-002', \"import test from 'node:test';\", \"import assert from 'node:assert/strict';\", \"test('scheduled value proof', () => {\", '  const actual = 2 + 2;', '  assert.equal(actual, 4);', '});', ''].join('\\n'))); }",
      "const evidenceRefs = [manifest.outputFile, ...materializedFiles.map((file) => file.absolutePath)];",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [...evidenceRefs, ...obligation.evidenceRefs], blockingReasons: [] }));",
      "const shardEvidence = manifest.productMaterialization.executionShards.map((shard) => ({ kind: 'sdlc_worker_execution_shard_evidence', shardId: shard.shardId, moduleName: shard.moduleName, lane: 'test', command: shard.command, status: 'succeeded', reportRefs: [manifest.outputFile], testsObserved: 1, passedCount: 1, failedCount: 0 }));",
      "const executionEvidence = manifest.targetAssetType === 'test_execution_result_surface' ? { kind: 'sdlc_worker_execution_evidence', lane: 'test', command: manifest.productMaterialization.testExecutionContract, status: 'succeeded', reportRefs: [manifest.outputFile], testsObserved: shardEvidence.length, passedCount: shardEvidence.length, failedCount: 0, shardEvidence } : null;",
      "const report = { kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: digestText(`${outputContent}\\n`), summary: `generated ${manifest.targetAssetType}`, unresolvedReasons: [], materializedFiles, executionEvidence, obligationAssessments };",
      "writeFileSync(manifest.reportFile, `${JSON.stringify(report, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

test("T-093 publishes schedule graph assets before materialization edges", () => {
  const names = BOOTSTRAP_RELEASE_FUNCTION_CATALOG.map((entry) => entry.name);
  assert(
    names.indexOf("derive_implementation_module_surface") <
      names.indexOf("derive_realization_schedule_surface")
  );
  assert(
    names.indexOf("derive_realization_schedule_surface") <
      names.indexOf("derive_code_surface")
  );
  assert(
    names.indexOf("derive_test_module_surface") <
      names.indexOf("derive_test_schedule_surface")
  );
  assert(
    names.indexOf("derive_test_schedule_surface") <
      names.indexOf("prepare_test_execution_surface")
  );
  assert(
    names.indexOf("prepare_test_execution_surface") <
      names.indexOf("derive_test_execution_result_surface")
  );
  assert(
    names.indexOf("derive_test_execution_result_surface") <
      names.indexOf("derive_test_run_archive_surface")
  );

  assert.deepStrictEqual(
    hookContractByEdgeName("derive_code_surface").sourceAssetTypes,
    [
      "implementation_module_surface",
      "implementation_stack_profile",
      "realization_schedule_surface"
    ]
  );
  assert.deepStrictEqual(
    hookContractByEdgeName("derive_test_run_archive_surface").sourceAssetTypes,
    [
      "test_module_surface",
      "test_stack_profile",
      "test_schedule_surface",
      "test_execution_result_surface"
    ]
  );
  assert.deepStrictEqual(
    hookContractByEdgeName("derive_test_execution_result_surface").sourceAssetTypes,
    ["test_execution_surface", "test_schedule_surface"]
  );
  assert(
    SDLC_HOOK_TARGET_POLICY.some(
      (entry) => entry.targetAssetType === "realization_schedule_surface"
    )
  );
  assert(
    SDLC_HOOK_TARGET_POLICY.some(
      (entry) => entry.targetAssetType === "test_schedule_surface"
    )
  );
});

test("B-079 test execution schedule exposes a bounded shard register", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 17,
    contract,
    runId: "b079-shard-register"
  });

  assert.deepStrictEqual(manifest.productMaterialization.declaredModuleNames, [
    "api",
    "worker"
  ]);
  assert.deepStrictEqual(
    manifest.productMaterialization.executionShards.map((shard) => shard.moduleName),
    ["api", "worker"]
  );
  assert.deepStrictEqual(
    manifest.productMaterialization.executionShards.map((shard) => shard.shardId),
    ["test-shard-01-api", "test-shard-02-worker"]
  );
  assert.deepStrictEqual(
    manifest.productMaterialization.executionShards.map((shard) => shard.command),
    ["npm test --workspace api", "npm test --workspace worker"]
  );
  assert(
    manifest.traversalObligationContext.trancheKeys.includes(
      "execution_shard:test-shard-01-api"
    )
  );
  assert.equal(
    manifest.productMaterialization.executionShards.every(
      (shard) =>
        shard.requiredEvidenceKind === "sdlc_worker_execution_evidence" &&
        shard.retryPolicy === "same_shard_then_triage"
    ),
    true
  );
});

test("T-093 ABG-owned start produces and consumes schedule surfaces", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t093"
  });
  assert.equal(install.kind, "installed");
  const workerScript = writeWorkerScript(workspace);

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

  const edgeLogPath = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/t093_edge_log.jsonl"
  );
  assert.equal(existsSync(edgeLogPath), true);
  const entries = readFileSync(edgeLogPath, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const edgeNames = entries.map((entry) => entry.edgeName);
  const realizationSchedule = entries.find(
    (entry) => entry.edgeName === "derive_realization_schedule_surface"
  );
  const code = entries.find((entry) => entry.edgeName === "derive_code_surface");
  const testSchedule = entries.find(
    (entry) => entry.edgeName === "derive_test_schedule_surface"
  );
  const testRun = entries.find(
    (entry) => entry.edgeName === "derive_test_run_archive_surface"
  );
  const testExecutionResult = entries.find(
    (entry) => entry.edgeName === "derive_test_execution_result_surface"
  );

  assert(realizationSchedule);
  assert(code);
  assert(testSchedule);
  assert(testExecutionResult);
  assert(testRun);
  assert(
    edgeNames.indexOf("derive_realization_schedule_surface") <
      edgeNames.indexOf("derive_code_surface")
  );
  assert(
    edgeNames.indexOf("derive_test_schedule_surface") <
      edgeNames.indexOf("derive_test_execution_result_surface")
  );
  assert(
    edgeNames.indexOf("derive_test_execution_result_surface") <
      edgeNames.indexOf("derive_test_run_archive_surface")
  );
  assert(code.inputAssetTypes.includes("realization_schedule_surface"));
  assert(testExecutionResult.inputAssetTypes.includes("test_execution_surface"));
  assert(testRun.inputAssetTypes.includes("test_schedule_surface"));
  assert(testRun.inputAssetTypes.includes("test_execution_result_surface"));

  const realizationScheduleText = readFileSync(
    realizationSchedule.outputFile,
    "utf8"
  );
  const testScheduleText = readFileSync(testSchedule.outputFile, "utf8");
  assert.match(realizationScheduleText, /status: open/);
  assert.match(realizationScheduleText, /status: done/);
  assert.match(realizationScheduleText, /status: blocked/);
  assert.match(testScheduleText, /retry_same_edge/);
});
