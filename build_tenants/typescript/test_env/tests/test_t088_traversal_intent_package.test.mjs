// Validates: REQ-F-ODDSDLC-013
// Validates: REQ-F-ODDSDLC-014
// Validates: REQ-F-ODDSDLC-053
// Validates: T-088

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  assertTraversalIntentPackagePressure,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  sha256Text,
  stableOperatorJson,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t088-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    "# T-088 Fixture\n\nImported bootstrap source.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-088: Build from cumulative traversal pressure.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    [
      "# Requirements",
      "",
      "REQ-T088-001: The worker receives source, obligation, output, and evaluator pressure."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t088_fixture",
      "active_tenant: scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark",
      "    language: scala",
      "    build_tool: sbt",
      "    module_structure:",
      "      - pressure-core"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function replaceIntentPackage(manifest, patch) {
  const { packageDigest: _oldDigest, ...oldBasis } = manifest.traversalIntentPackage;
  const digestBasis = { ...oldBasis, ...patch };
  return {
    ...manifest,
    traversalIntentPackage: {
      ...digestBasis,
      packageDigest: sha256Text(stableOperatorJson(digestBasis))
    }
  };
}

function gapDossier(ref, reasons) {
  return {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_test_module_surface",
    vectorIndex: 15,
    targetAssetType: "test_module_surface",
    reasons: reasons.map((reason) => ({
      kind: "sdlc_postflight_gap_reason",
      reason,
      reasonClass: "assurance",
      blockingReason: {
        kind: "sdlc_blocking_reason",
        code: "assurance_ledger_reason",
        reasonClass: "assurance",
        lawfulReentryPoint: "same_edge_retry",
        message: "Assurance ledger fold blocked traversal closure.",
        detail: reason,
        evidenceRefs: [ref]
      }
    })),
    evidenceRefs: [ref],
    priorManifestId: `${ref}/manifest`,
    currentGapDossierRef: ref,
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge"]
  };
}

test("T-088 handoff manifest carries typed cumulative traversal intent package", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 12,
    contract,
    runId: "t088-intent-package"
  });
  const files = writeHandoffFiles(manifest);
  const intentPath = path.join(manifest.archiveRoot, "traversal_intent_package.json");
  const archivedIntent = JSON.parse(readFileSync(intentPath, "utf8"));
  const prompt = readFileSync(files.promptPath, "utf8");
  const { packageDigest, ...digestBasis } = manifest.traversalIntentPackage;

  assert.equal(manifest.traversalIntentPackage.kind, "sdlc_traversal_intent_package");
  assert.doesNotThrow(() => assertTraversalIntentPackagePressure(manifest));
  assert.equal(manifest.traversalIntentPackage.packageVersion, "ts-intent-v1");
  assert.equal(manifest.traversalIntentPackage.graphFunctionName, "bootstrap_release_self_test");
  assert.equal(manifest.traversalIntentPackage.edgeName, "derive_code_surface");
  assert.equal(manifest.traversalIntentPackage.targetAssetType, "code_surface");
  assert.deepStrictEqual(manifest.traversalIntentPackage.sourceAssetTypes, [
    "implementation_module_surface",
    "implementation_stack_profile",
    "realization_schedule_surface",
    "implementation_component_topology_surface",
    "component_code_surface",
    "component_realization_qualification_surface"
  ]);
  assert.equal(
    packageDigest,
    sha256Text(stableOperatorJson(digestBasis))
  );
  assert.equal(archivedIntent.packageDigest, packageDigest);
  assert.equal(existsSync(intentPath), true);
  assert.equal(existsSync(files.workerBriefPath), true);
  assert.match(prompt, /Read the worker brief first:/u);
  assert.match(prompt, /typed cumulative intent package/u);
  assert.match(prompt, /traversal_intent_package\.json/u);
  assert(
    manifest.traversalIntentPackage.authorityRefs.some((ref) =>
      ref.endsWith("specification/requirements/00-imported-sources.md")
    )
  );
  assert(
    manifest.traversalIntentPackage.obligationIds.includes("requirement:REQ-T088-001")
  );
  assert.equal(
    manifest.traversalIntentPackage.productMaterialization.tenantRoot,
    path.join(workspace, "build_tenants/scala_spark")
  );
  assert.equal(
    manifest.traversalIntentPackage.evaluatorExpectations.constructiveFp,
    "fp://odd-sdlc/generic-software-domain-constructor"
  );
});

test("T-088 retry pressure stays linked and does not expand into prior-gap obligations", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_test_module_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 15,
    contract,
    runId: "t088-bounded-retry-frontier",
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [
        gapDossier("proof://gap-a", [
          "REQ-ACC-001:obligation_partial",
          "REQ-ACC-002:obligation_partial",
          "dropped_prior_obligation:REQ-ACC-001:obligation_partial"
        ]),
        gapDossier("proof://gap-b", [
          "REQ-ACC-001:obligation_partial",
          "REQ-ACC-003:obligation_partial",
          "obligation_assessment_open:prior_gap:dropped_prior_obligation:REQ-ACC-002:obligation_partial"
        ])
      ]
    }
  });
  const files = writeHandoffFiles(manifest);
  const prompt = readFileSync(files.promptPath, "utf8");
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );

  assert.equal(manifest.traversalObligationContext.deltaSummary.priorGapCount, 3);
  assert.equal(
    manifest.traversalObligationContext.obligations.some(
      (obligation) => obligation.obligationKind === "prior_gap"
    ),
    false
  );
  assert.deepStrictEqual(manifest.traversalIntentPackage.priorGapDossierRefs, [
    "proof://gap-a",
    "proof://gap-b"
  ]);
  assert.match(prompt, /priorGapFrontier/u);
  assert.match(prompt, /read those files selectively/u);
  assert(
    invocationPackage.retryRepairInstructions.length > 0,
    "retry-local repair instructions may cite prior gap reasons without expanding them into obligations"
  );
  assert.equal(
    manifest.traversalIntentPackage.obligationIds.some((id) =>
      id.startsWith("prior_gap:")
    ),
    false
  );
});

test("T-088 rejects handoff archives with missing cumulative pressure", () => {
  const workspace = makeWorkspace();
  const contract = hookContractByEdgeName("derive_code_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 12,
    contract,
    runId: "t088-negative-pressure"
  });

  assert.throws(
    () =>
      writeHandoffFiles(
        replaceIntentPackage(manifest, {
          authorityRefs: []
        })
      ),
    /missing .*authority|missing induction lineage/u
  );

  assert.throws(
    () =>
      writeHandoffFiles(
        replaceIntentPackage(manifest, {
          obligationIds: []
        })
      ),
    /missing obligation pressure|obligation count drift/u
  );

  assert.throws(
    () =>
      writeHandoffFiles(
        replaceIntentPackage(
          {
            ...manifest,
            retryContext: {
              ...manifest.retryContext,
              priorGapDossiers: [
                {
                  kind: "sdlc_postflight_gap_dossier",
                  status: "open",
                  graphFunctionName: "bootstrap_release_self_test",
                  edgeName: "derive_code_surface",
                  vectorIndex: 12,
                  targetAssetType: "code_surface",
                  reasons: [],
                  evidenceRefs: [],
                  priorManifestId: "proof://prior",
                  currentGapDossierRef: "proof://prior-gap",
                  retryEligible: true,
                  nextLawfulActions: ["retry_same_edge"]
                }
              ]
            }
          },
          {
            priorGapDossierRefs: []
          }
        )
      ),
    /missing prior gap refs/u
  );
});
