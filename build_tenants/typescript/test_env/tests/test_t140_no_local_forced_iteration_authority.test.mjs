// Validates: T-140

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
import { pathToFileURL } from "node:url";

import {
  deriveSdlcEdgeFulfillmentCountsFromAssessments,
  deriveSdlcWorkerRetryContextFromPostActionProjection,
  deriveSdlcWorkerRetryContextFromTraversalConsequence,
  mergeSdlcWorkerRetryContextWithRuntimeGapRegister,
  sdlcRequirementObligationBelongsToDownstreamComponentSurface,
  sdlcBlockingReasonFromLegacy
} from "../../build/semantic/code/src/index.js";

const installedOperatorSource = () =>
  readFileSync(
    new URL("../../code/src/operator/installed_operator.ts", import.meta.url),
    "utf8"
  );

test("T-140 retry context derives from traversal consequence projection refs", () => {
  const gapDossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_code_surface",
    vectorIndex: 7,
    targetAssetType: "component_code_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason:
          "obligation_assessment_blocked:requirement:workspace.requirements.req_dq_003",
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({
          reason:
            "obligation_assessment_blocked:requirement:workspace.requirements.req_dq_003"
        })
      }
    ],
    evidenceRefs: ["file:///tmp/odd-sdlc-t140/postflight.json"],
    priorManifestId: "file:///tmp/odd-sdlc-t140/handoff_manifest.json",
    currentGapDossierRef: "file:///tmp/odd-sdlc-t140/gap_dossier.json",
    retryEligible: true,
    nextLawfulActions: ["repair_worker_output"]
  };
  const derivation = deriveSdlcWorkerRetryContextFromTraversalConsequence({
    attemptIndex: 3,
    outcome: {
      manifest: {
        archiveRoot: "/tmp/odd-sdlc-t140/archive",
        vectorIndex: 7
      },
      gapDossier,
      traversalConsequence: {
        edgeClosureDecision: {
          decisionRef: "closure-decision://t140/retry"
        },
        nextActionProjection: {
          choosesNextTraversal: true,
          nextActionProjectionRef: "next-action://t140/evaluate-next"
        }
      }
    }
  });

  assert.equal(derivation.status, "ready");
  const retryContext = derivation.retryContext;
  assert(retryContext);
  assert.equal(
    retryContext.retryAttemptRefs[0].sourceProjectionRef,
    "next-action://t140/evaluate-next"
  );
  assert.equal(
    retryContext.retryAttemptRefs[0].priorAuthorityRef,
    "file:///tmp/odd-sdlc-t140/gap_dossier.json"
  );
  assert.equal(retryContext.retryAttemptRefs[0].attemptIndex, 3);
  assert.equal(retryContext.retryAttemptRefs[0].vectorIndex, 7);
  assert.equal(retryContext.priorGapDossiers.length, 1);
  assert.equal(
    retryContext.priorGapDossiers[0].currentGapDossierRef,
    "file:///tmp/odd-sdlc-t140/gap_dossier.json"
  );
});

test("T-164 post-action retry context restores current gap dossier from pressure refs", () => {
  const archiveRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t140-gap-"));
  const gapDossierRef = pathToFileURL(path.join(archiveRoot, "gap_dossier.json"))
    .href;
  const reason =
    "obligation_assessment_blocked:requirement:workspace.stage_15_trv_requirements.req_trv_005_b";
  const gapDossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_code_surface",
    vectorIndex: 0,
    targetAssetType: "component_code_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({ reason })
      }
    ],
    evidenceRefs: [pathToFileURL(path.join(archiveRoot, "postflight.json")).href],
    priorManifestId: pathToFileURL(path.join(archiveRoot, "handoff_manifest.json"))
      .href,
    currentGapDossierRef: gapDossierRef,
    retryEligible: true,
    nextLawfulActions: ["repair_worker_output"]
  };
  mkdirSync(archiveRoot, { recursive: true });
  writeFileSync(
    path.join(archiveRoot, "gap_dossier.json"),
    JSON.stringify(gapDossier),
    "utf8"
  );

  const retryContext = deriveSdlcWorkerRetryContextFromPostActionProjection({
    vectorIndex: 0,
    nextActionProjection: {
      nextActionBasisKind: "post_repair",
      choosesNextTraversal: true,
      selectedActionRef:
        "construction-action://odd-sdlc/post-action/derive_component_code_surface/post_repair/derive_component_code_surface",
      nextActionProjectionRef:
        "construction-priority-projection://odd-sdlc/post-action/derive_component_code_surface",
      gapPressureRefs: [
        `pressure://odd-sdlc/post-action/${encodeURIComponent(
          pathToFileURL(archiveRoot).href
        )}/repair`
      ]
    }
  });

  assert(retryContext);
  assert.equal(retryContext.priorGapDossiers.length, 1);
  assert.equal(retryContext.priorGapDossiers[0].currentGapDossierRef, gapDossierRef);
  assert.equal(retryContext.retryAttemptRefs[0].priorAuthorityRef, gapDossierRef);
  assert.equal(retryContext.priorGapDossiers[0].reasons[0].reason, reason);
});

test("T-164 retry context uses latest workspace runtime gap register", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t164-register-"));
  const runsRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  const staleRun = path.join(runsRoot, "20260514T140256503Z_pid16747");
  const latestRun = path.join(runsRoot, "20260514T154328166Z_pid61086");
  mkdirSync(staleRun, { recursive: true });
  mkdirSync(latestRun, { recursive: true });
  const staleRef = pathToFileURL(path.join(staleRun, "gap_dossier.json")).href;
  const latestRef = pathToFileURL(path.join(latestRun, "gap_dossier.json")).href;
  const staleReason = "materialized_product_requirement_lineage_missing";
  const latestReason =
    "obligation_assessment_blocked:requirement:workspace.requirements.req_dq_003";
  const dossier = ({ ref, reason }) => ({
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_code_surface",
    vectorIndex: 0,
    targetAssetType: "component_code_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({ reason })
      }
    ],
    evidenceRefs: [],
    priorManifestId: ref.replace("gap_dossier.json", "handoff_manifest.json"),
    currentGapDossierRef: ref,
    retryEligible: true,
    nextLawfulActions: ["repair_worker_output"]
  });
  writeFileSync(
    path.join(staleRun, "gap_dossier.json"),
    JSON.stringify(dossier({ ref: staleRef, reason: staleReason })),
    "utf8"
  );
  writeFileSync(
    path.join(latestRun, "gap_dossier.json"),
    JSON.stringify(dossier({ ref: latestRef, reason: latestReason })),
    "utf8"
  );

  const retryContext = mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
    workspaceRoot: workspace,
    vectorIndex: 0,
    edgeName: "derive_component_code_surface",
    targetAssetType: "component_code_surface",
    projected: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [dossier({ ref: staleRef, reason: staleReason })]
    }
  });

  assert.equal(retryContext.priorGapDossiers.length, 1);
  assert.equal(retryContext.priorGapDossiers[0].currentGapDossierRef, latestRef);
  assert.equal(retryContext.priorGapDossiers[0].reasons[0].reason, latestReason);
});

test("T-164 runtime gap register does not contaminate fresh post-action continuation", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t164-fresh-"));
  const runsRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  const staleRun = path.join(runsRoot, "20260524T234438416Z_pid26467");
  mkdirSync(staleRun, { recursive: true });
  const staleRef = pathToFileURL(path.join(staleRun, "gap_dossier.json")).href;
  const staleExecutionEvidence =
    "file:///tmp/stale/assets/20260524T234422163Z_pid26467/test_execution_result_surface.md";
  const dossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_repair_schedule_surface",
    vectorIndex: 0,
    targetAssetType: "component_repair_schedule_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason: "review_grade_edge_fulfillment_blocked:stale_execution_result",
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({
          reason: "review_grade_edge_fulfillment_blocked:stale_execution_result"
        })
      }
    ],
    evidenceRefs: [staleExecutionEvidence],
    priorManifestId: staleRef.replace("gap_dossier.json", "handoff_manifest.json"),
    currentGapDossierRef: staleRef,
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge"]
  };
  writeFileSync(path.join(staleRun, "gap_dossier.json"), JSON.stringify(dossier), "utf8");

  const retryContext = mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
    workspaceRoot: workspace,
    vectorIndex: 0,
    edgeName: "derive_component_repair_schedule_surface",
    targetAssetType: "component_repair_schedule_surface",
    projected: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [
        {
          vectorIndex: 0,
          retryRunId: "post-action-reentry",
          retryCallId: "construction-priority-projection://fresh",
          manifestId: "construction-priority-projection://fresh",
          priorAuthorityRef:
            "construction-action://odd-sdlc/post-action/derive_component_repair_schedule_surface/post_close_overlay_continuation/derive_component_repair_schedule_surface/file%3A%2F%2F%2Ftmp%2Flatest-qualification",
          attemptIndex: 0,
          sourceProjectionRef: "construction-priority-projection://fresh"
        }
      ],
      priorGapDossiers: []
    }
  });

  assert.equal(retryContext.priorGapDossiers.length, 0);
  assert.equal(
    retryContext.retryAttemptRefs[0].priorAuthorityRef.includes("post_close_overlay_continuation"),
    true
  );
});

test("T-174 component-code closure carries test and execution requirements downstream", () => {
  assert.equal(
    sdlcRequirementObligationBelongsToDownstreamComponentSurface({
      targetAssetType: "component_code_surface",
      productMaterializationRequired: true,
      obligationKind: "requirement",
      sourceRefs: [
        "workspace://build_tenants/typescript/design/adrs/ADR-003-test-design-surface.md"
      ],
      sourceSnippets: ["### REQ-T174-006 Hello Branch Test\nRun node --test."]
    }),
    true
  );
  assert.equal(
    sdlcRequirementObligationBelongsToDownstreamComponentSurface({
      targetAssetType: "component_code_surface",
      productMaterializationRequired: true,
      obligationKind: "requirement",
      sourceRefs: ["workspace://specification/requirements/18-typed-construction-algebra.md"],
      sourceSnippets: ["### REQ-T174-007 Execution Proof\nCapture test execution evidence."]
    }),
    true
  );
  assert.equal(
    sdlcRequirementObligationBelongsToDownstreamComponentSurface({
      targetAssetType: "component_code_surface",
      productMaterializationRequired: true,
      obligationKind: "requirement",
      sourceRefs: ["workspace://specification/requirements/02-graph-functions.md"],
      sourceSnippets: ["### REQ-T174-001 Publish a feature dependency frontier."]
    }),
    false
  );
  const projection = deriveSdlcEdgeFulfillmentCountsFromAssessments({
    declaredObligationIds: [
      "requirement:source",
      "requirement:test"
    ],
    assessments: [
      {
        obligationId: "requirement:source",
        fulfillmentStatus: "fulfilled",
        evidenceRefs: ["workspace://src/index.js"]
      },
      {
        obligationId: "requirement:test",
        fulfillmentStatus: "partial",
        evidenceRefs: ["workspace://test/hello.test.js"],
        carryDirection: "downstream_transformation_set",
        downstreamGraphFunctionRefs: ["derive_component_test_surface"],
        targetBindingRefs: ["target-binding://component-test"]
      }
    ]
  });
  assert.deepEqual(projection.counts, {
    expected: 1,
    fulfilled: 1,
    partial: 0,
    blocked: 0,
    unfulfilled: 0,
    missing: 0,
    extra: 0
  });
  assert.deepEqual(projection.nonConvergedReasonRefs, []);
  assert(
    projection.downstreamPressureRefs.includes(
      "obligation://odd-sdlc/requirement%3Atest/downstream_transformation_set"
    )
  );
});

test("T-140 retry context is absent without executable evaluate-next truth", () => {
  const derivation = deriveSdlcWorkerRetryContextFromTraversalConsequence({
    attemptIndex: 1,
    outcome: {
      manifest: {
        archiveRoot: "/tmp/odd-sdlc-t140/archive",
        vectorIndex: 0
      },
      traversalConsequence: {
        edgeClosureDecision: {
          decisionRef: "closure-decision://t140/block"
        },
        nextActionProjection: {
          choosesNextTraversal: false,
          nextActionProjectionRef: "next-action://t140/no-action"
        }
      }
    }
  });
  assert.equal(derivation.status, "no_executable_intent");
  assert.equal(derivation.retryContext, null);
});

test("T-140 retry context absence keeps no consequence and no manifest distinct", () => {
  const noConsequence = deriveSdlcWorkerRetryContextFromTraversalConsequence({
    attemptIndex: 1,
    outcome: {
      manifest: {
        archiveRoot: "/tmp/odd-sdlc-t140/archive",
        vectorIndex: 0
      },
      traversalConsequence: null
    }
  });
  assert.equal(noConsequence.status, "no_consequence");
  assert.equal(noConsequence.retryContext, null);

  const noManifest = deriveSdlcWorkerRetryContextFromTraversalConsequence({
    attemptIndex: 1,
    outcome: {
      manifest: null,
      traversalConsequence: {
        edgeClosureDecision: {
          decisionRef: "closure-decision://t140/no-manifest"
        },
        nextActionProjection: {
          choosesNextTraversal: true,
          nextActionProjectionRef: "next-action://t140/no-manifest"
        }
      }
    }
  });
  assert.equal(noManifest.status, "no_manifest");
  assert.equal(noManifest.retryContext, null);
});

test("T-140 installed loop names traversal consequence as retry source", () => {
  const source = installedOperatorSource();

  assert.equal(
    source.includes("deriveSdlcWorkerRetryContextFromTraversalConsequence"),
    true
  );
  assert.equal(source.includes("retryContextFromGapDossier"), false);
  assert.equal(
    source.includes(
      "deriveSdlcWorkerRetryContextFromTraversalConsequence"
    ),
    true
  );
  assert.equal(
    source.includes("latest.gapDossier === null\n        ? undefined"),
    false
  );
});

test("T-140 installed operator does not dispatch from legacy gap action strings", () => {
  const source = installedOperatorSource();

  assert.equal(source.includes("gapActionRefs"), false);
  assert.equal(source.includes("nextLawfulActions.includes"), false);
  assert.equal(source.includes("retry_same_edge_with_gap_dossier"), false);
  assert.equal(source.includes("plan_repair_reentry_with_gap_dossier"), false);
  assert.equal(source.includes("inspect_worker_archive"), false);
});

test("T-140 closure reasons use typed blocking-reason reentry points", () => {
  const source = installedOperatorSource();

  assert.equal(source.includes("blockingReasonRefsForReentry"), true);
  assert.equal(source.includes('lawfulReentryPoint: "same_edge_retry"'), true);
  assert.equal(source.includes('lawfulReentryPoint: "repair_worker_output"'), true);
  assert.equal(
    source.includes('lawfulReentryPoint: "reprice_requirement_or_design"'),
    true
  );
  assert.equal(source.includes('action: "retry_same_edge"'), false);
  assert.equal(source.includes('action: "repair_worker_output"'), false);
  assert.equal(source.includes('action: "reprice_requirement_or_design"'), false);
});
