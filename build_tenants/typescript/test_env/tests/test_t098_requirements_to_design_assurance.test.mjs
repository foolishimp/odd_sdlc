// Validates: REQ-F-ODDSDLC-013
// Validates: REQ-F-ODDSDLC-051
// Validates: REQ-F-ODDSDLC-053
// Validates: T-098

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
  invokeOddSdlcSpecMethodCommand
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t098-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nBuild a governed design surface from requirement authority.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    "# Product\n\nT-098 requirements-to-design fixture.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    "# Goals\n\n- prove requirements-to-design assurance fold\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    "# Imported Sources\n\n- fixture://t098\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-design.md"),
    [
      "# Design Requirements",
      "",
      "REQ-T098-001: Derive an app-core design surface from admitted requirements.",
      "REQ-T098-002: Preserve app-core feature decomposition pressure in the design traversal."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    "# Project Bootstrap\n\nproject_slug: t098_fixture\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t098_fixture",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "ambiguity_risk_appetite: medium"
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
  const workerPath = path.join(workspaceRoot, "t098_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const obligationLines = manifest.traversalObligationContext.obligations.flatMap((obligation) => [`- ${obligation.obligationId}: ${obligation.summary}`, ...obligation.payload.sourceSnippets.map((snippet) => `  - ${snippet}`)]);",
      "const content = [`# ${manifest.targetAssetType}`, '', `graph_function: ${manifest.graphFunctionName}`, `edge: ${manifest.edgeName}`, `target: ${manifest.targetAssetType}`, '', '## Inputs', ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`), '', '## Obligations', ...(obligationLines.length > 0 ? obligationLines : ['- none']), '', '## Design Body', 'The design surface satisfies admitted requirement and feature decomposition pressure through the current graph edge.'].join('\\n');",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, `${content}\\n`, 'utf8');",
      "const digest = `sha256:${createHash('sha256').update(`${content}\\n`, 'utf8').digest('hex')}`;",
      "const obligationAssessments = manifest.traversalObligationContext.obligations.map((obligation) => ({ kind: 'sdlc_worker_obligation_assessment', obligationId: obligation.obligationId, fulfillmentStatus: 'fulfilled', evidenceRefs: [manifest.outputFile, ...obligation.evidenceRefs], blockingReasons: [] }));",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest, summary: `generated ${manifest.targetAssetType} for ${manifest.edgeName}`, unresolvedReasons: [], materializedFiles: [], executionEvidence: null, obligationAssessments }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

async function startOne(workspace, workerScript) {
  return invokeOddSdlcSpecMethodCommand([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:derive_design_surface",
    "--until",
    "first_traversal",
    "--worker",
    `process://node?script=${encodeURIComponent(workerScript)}`
  ]);
}

test("T-098 requirements-to-design closes through existing assurance ledgers", async () => {
  const workspace = makeWorkspace();
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t098"
  });
  assert.equal(install.kind, "installed");
  const workerScript = writeWorkerScript(workspace);

  const start = await startOne(workspace, workerScript);
  assert.equal(start.status, "ok");
  assert.equal(start.payload.status, "worker_invoked");
  assert.equal(start.payload.postflight.status, "passed");
  const designRun = start.payload;
  assert.equal(designRun.manifest.edgeName, "derive_design_surface");
  assert.equal(designRun.manifest.targetAssetType, "design_surface");
  assert.deepStrictEqual(designRun.manifest.inputAssetTypes, [
    "requirement_surface",
    "uat_testcases_surface",
    "testcase_authority_surface",
    "feature_decomp_surface"
  ]);

  const archiveRoot = designRun.archiveRoot;
  const handoff = JSON.parse(
    readFileSync(path.join(archiveRoot, "handoff_manifest.json"), "utf8")
  );
  const postflight = JSON.parse(
    readFileSync(path.join(archiveRoot, "postflight.json"), "utf8")
  );
  const assuranceLedgers = JSON.parse(
    readFileSync(path.join(archiveRoot, "assurance_ledgers.json"), "utf8")
  );
  const assuranceSatisfaction = JSON.parse(
    readFileSync(path.join(archiveRoot, "assurance_satisfaction.json"), "utf8")
  );

  assert.equal(handoff.edgeName, "derive_design_surface");
  assert.equal(handoff.targetAssetType, "design_surface");
  assert.equal(postflight.status, "passed");
  assert.equal(assuranceSatisfaction.status, "close_allowed");
  assert.deepStrictEqual(assuranceSatisfaction.missingRequiredDimensions, []);
  assert.deepStrictEqual(assuranceSatisfaction.blockingReasons, []);
  assert.deepStrictEqual(
    assuranceLedgers.map((ledger) => ledger.dimension).sort(),
    ["materialization", "requirement_fulfillment", "semantic_convergence"]
  );
  assert(
    assuranceLedgers.every((ledger) =>
      ledger.verdict === "satisfied" || ledger.verdict === "not_applicable"
    )
  );
  assert.equal(
    existsSync(path.join(archiveRoot, "managed_traversal_ledger.json")),
    false
  );
});
