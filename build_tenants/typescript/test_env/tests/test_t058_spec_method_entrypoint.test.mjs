// Validates: REQ-F-ODDSDLC-040
// Validates: REQ-F-ODDSDLC-041
// Validates: REQ-F-ODDSDLC-043
// Validates: T-058
// Validates: T-204

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  constructSdlcGraphFunctionCatalog,
  projectOddSdlcWorkspaceGaps,
  projectOddSdlcWorkspaceQueryDomain
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");

function makeConformantWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-ts-workspace-api-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# Workspace API Fixture", "", "REQ-WORKSPACE-001: Fixture readme authority."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    ["# Goals", "", "GOAL-WORKSPACE-001: Exercise typed workspace projection API."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    ["# Intent", "", "INT-WORKSPACE-001: Govern workspace API fixture."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    ["# Product", "", "PRODUCT-WORKSPACE-001: Workspace API fixture product surface."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    ["# Imported Sources", "", "- README.md", "- specification/INTENT.md"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-workspace-api.md"),
    ["# Requirements", "", "REQ-WORKSPACE-002: Preserve read-only workspace projection law."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    ["# Project Bootstrap", "", "Source package: workspace API fixture."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: workspace_api_fixture",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "ambiguity_risk_appetite: medium"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/TENANT_REGISTRY.md"),
    ["# Tenant Registry", "", "- typescript: build_tenants/typescript"].join("\n"),
    "utf8"
  );
  return root;
}

function writePassedComputeWithoutBindArchive(workspace) {
  const archiveRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs/20260510T000200000Z_pid3"
  );
  mkdirSync(archiveRoot, { recursive: true });
  writeFileSync(
    path.join(archiveRoot, "worker_result_report.json"),
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: "derive_component_code_surface",
        edgeName: "derive_component_code_surface",
        targetAssetType: "component_code_surface",
        outputFile: path.join(workspace, "build_tenants/typescript/src/index.ts"),
        materializedFiles: [],
        materializationDiagnostics: [],
        executionEvidence: null,
        executionEvidenceErrors: [],
        obligationAssessments: []
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "postflight.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_operator_postflight_result",
        status: "passed",
        blockingReasons: [],
        blockingReasonCarriers: [],
        evidenceRefs: []
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "fp_evaluate_result.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_fp_evaluate_result",
        status: "passed",
        postflightStatus: "passed",
        blockingReasons: [],
        evidenceRefs: [],
        obligationAssessmentCounts: {
          total: 0,
          fulfilled: 0,
          partial: 0,
          blocked: 0,
          unassessed: 0,
          extra: 0
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

test("T-058 workspace catalog API reads graph catalog without workspace mutation", () => {
  const result = constructSdlcGraphFunctionCatalog();

  assert(
    result.functions.some(
      (entry) => entry.backingGraphFunction === "derive_code_surface"
    )
  );
  assert(
    result.executives.some(
      (entry) => entry.backingGraphFunction === "bootstrap_release_self_test"
    )
  );
});

test("T-058 workspace query-domain API projects admitted workspace sources", () => {
  const workspace = makeConformantWorkspace();
  const result = projectOddSdlcWorkspaceQueryDomain({ workspaceRoot: workspace });

  assert.equal(result.kind, "sdlc_query_domain_projection");
  assert.equal(result.workspaceRootUri, `file://${workspace}`);
  assert(
    result.startTargets.some(
      (entry) => entry.name === "bootstrap_release_self_test"
    )
  );
  assert(
    result.assetOwnership.some((entry) => entry.assetType === "code_surface")
  );
});

test("T-204 workspace gaps API is a read-only projection, not a start surface", () => {
  const workspace = makeConformantWorkspace();
  const result = projectOddSdlcWorkspaceGaps({ workspaceRoot: workspace });

  assert.equal("start" in result, false);
  assert.equal("executionContract" in result, false);
  assert.equal(result.dossier.kind, "sdlc_gap_dossier");
  assert.equal(result.dossier.readOnly, true);
  assert.equal(result.dossier.choosesNextTraversal, false);
  assert.equal(
    result.dossier.rankingAuthority,
    "abiogenesis_construction_priority_projection"
  );
  assert.equal(result.dossier.localRankingAuthority, false);
  assert.equal(
    result.requirementFulfillment.kind,
    "sdlc_requirement_fulfillment_public_projection"
  );
  assert.equal(result.requirementFulfillment.readOnly, true);
  assert.equal(result.requirementFulfillment.choosesNextTraversal, false);
  assert.deepEqual(result.archiveDiagnostics, []);
});

test("T-205 passed compute archive without bind outcome is diagnosed on gaps read model", () => {
  const workspace = makeConformantWorkspace();
  writePassedComputeWithoutBindArchive(workspace);

  const result = projectOddSdlcWorkspaceGaps({ workspaceRoot: workspace });
  const diagnostic = result.archiveDiagnostics.find(
    (entry) => entry.code === "missing_bind_outcome_after_passed_compute"
  );

  assert(diagnostic, JSON.stringify(result, null, 2));
  assert.equal(
    result.requirementFulfillment.archiveRehydration.status,
    "no_archive_with_consequence_triple"
  );
  assert.match(
    JSON.stringify(diagnostic.evidenceRefs),
    /worker_result_report\.json/u
  );
  assert.match(JSON.stringify(diagnostic.evidenceRefs), /postflight\.json/u);
  assert.match(
    JSON.stringify(diagnostic.evidenceRefs),
    /fp_evaluate_result\.json/u
  );
  assert.match(
    JSON.stringify(diagnostic.evidenceRefs),
    /sdlc_edge_closure_decision\.json/u
  );
});

test("T-204 workspace gaps API rejects deleted start-shaped input fields", () => {
  const workspace = makeConformantWorkspace();

  assert.throws(
    () =>
      projectOddSdlcWorkspaceGaps({
        workspaceRoot: workspace,
        target: { kind: "next", handle: "next" }
      }),
    /OddSdlcWorkspaceGapsInput\.target: unexpected field/u
  );
  assert.throws(
    () =>
      projectOddSdlcWorkspaceGaps({
        workspaceRoot: workspace,
        evaluatorPriorityEdge: "derive_intent_surface"
      }),
    /OddSdlcWorkspaceGapsInput\.evaluatorPriorityEdge: unexpected field/u
  );
});

test("T-204 workspace API entry stays free of retry/control authority", () => {
  const source = readFileSync(
    resolve(PACKAGE_ROOT, "code/src/workspace_api/entry.ts"),
    "utf8"
  );
  assert(!source.includes("projectSdlcRuntimeBindingContract"));
  assert(!source.includes("deriveAdvancementTransition("));
  assert(!source.includes("installAbiogenesis"));
  assert(!source.includes("while ("));
  assert(!source.includes("retryContextOverride"));
  assert(!source.includes("MAX_INSTALLED_START_SELF_HEAL_ATTEMPTS"));
});
