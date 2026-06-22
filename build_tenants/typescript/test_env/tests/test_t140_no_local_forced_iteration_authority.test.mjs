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
  admitExecutionBasis,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  admitStartIntent
} from "@abiogenesis/typescript-tenant";

import {
  deriveSdlcPostYieldResumeActionInput,
  deriveSdlcWorkerRetryContextFromPostActionProjection,
  mergeSdlcWorkerRetryContextWithRuntimeGapRegister,
  sdlcRequirementObligationBelongsToDownstreamComponentSurface,
  sdlcWorkerRetryContextFromAbgRetryContext
} from "../../build/semantic/code/src/operator/installed_operator.js";
import {
  deriveSdlcEdgeFulfillmentCountsFromAssessments
} from "../../build/semantic/code/src/operator/traversal_consequence.js";
import {
  createOddSdlcAbgRuntimeAssuranceProvider,
  constructSdlcGtlModule,
  sdlcBlockingReasonFromLegacy
} from "../../build/semantic/code/src/index.js";

const installedOperatorSource = () =>
  readFileSync(
    new URL("../../code/src/operator/installed_operator.ts", import.meta.url),
    "utf8"
  );

function liteDesignModuleBasis() {
  const module = constructSdlcGtlModule();
  return admitExecutionBasis({
    startIntent: admitStartIntent({
      scope: {
        kind: "workspace",
        workspaceRoot: "/workspace/odd-sdlc-t140",
        moduleName: module.name
      },
      target: {
        kind: "graph_function",
        handle: "lite_design_module_implementation"
      },
      until: "converged"
    }),
    module,
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: "worker://odd-sdlc/t140",
      backendId: "backend://node",
      buildId: "build://odd-sdlc/t140",
      resolvedRuntimeRef: "runtime://abiogenesis/typescript"
    }),
    resolvedPolicy: admitResolvedPolicyIdentity({
      resolvedPolicyBundleRef: "policy://odd-sdlc/t140/F_P",
      defaultRegime: "F_P",
      dispatchRef: "dispatch://odd-sdlc/t140",
      approvalSubjectRef: null
    }),
    runId: "run://odd-sdlc/t140",
    workKey: "wk://odd-sdlc/t140",
    frameId: null,
    frameLineageId: null
  });
}

test("T-204 upstream review-grade yield resumes admitted repair vector", () => {
  const action = deriveSdlcPostYieldResumeActionInput({
    basis: liteDesignModuleBasis(),
    yieldResumeBasis: {
      yieldKind: "nonlocal_repair_surface_admitted_upstream_reentry",
      resumeBasisRef:
        "resume-basis://odd-sdlc/t204/upstream-reentry/component-code",
      currentEdgeRef: "derive_lite_component_test_surface",
      admittedProgressRefs: [
        "pressure://odd-sdlc/review-grade/t204/req-ldm-004",
        "graph_function:lite_design_module_implementation",
        "graph_vector:lite_design_module_implementation/derive_lite_component_code_surface",
        "source_asset:implementation_design_surface"
      ],
      livenessProjectionRef: null,
      resumePolicyRef:
        "resume-policy://odd-sdlc/nonlocal-repair-surface/upstream-reentry"
    }
  });

  assert.notEqual(action, null);
  assert.equal(action.actionKind, "reenter_graph_span");
  assert.equal(action.graphVectorRef, "derive_lite_component_code_surface");
  assert.notEqual(action.graphVectorRef, "derive_lite_component_test_surface");
  assert(action.eligibleReasonRefs.includes("graph_vector:lite_design_module_implementation/derive_lite_component_code_surface"));
});

test("T-204 runtime assurance provider does not author ABG event-ledger truth", () => {
  const provider = createOddSdlcAbgRuntimeAssuranceProvider();

  assert.equal(typeof provider.authoritySnapshot, "function");
  assert.equal("eventLedgerValid" in provider, false);
});

test("T-204 upstream review-grade gap is not current-edge retry context", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t204-upstream-gap-"));
  const runRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs/20260622T044451596Z_pid64107"
  );
  mkdirSync(runRoot, { recursive: true });
  const gapDossierRef = pathToFileURL(path.join(runRoot, "gap_dossier.json"))
    .href;
  const reason =
    "review_grade_edge_fulfillment_blocked:requirement:data_mapper.requirements.req_ldm_004:test_overlap_missing:Re-enter source/code edge.";
  const dossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "lite_design_module_implementation",
    edgeName: "derive_lite_component_test_surface",
    vectorIndex: 3,
    targetAssetType: "component_test_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason: {
          ...sdlcBlockingReasonFromLegacy({ reason }),
          lawfulReentryPoint: "escalate_to_fp"
        }
      }
    ],
    evidenceRefs: [],
    priorManifestId: gapDossierRef.replace("gap_dossier.json", "handoff_manifest.json"),
    currentGapDossierRef: gapDossierRef,
    retryEligible: true,
    nextLawfulActions: ["escalate_to_fp"]
  };
  writeFileSync(
    path.join(runRoot, "gap_dossier.json"),
    JSON.stringify(dossier),
    "utf8"
  );

  const retryContext = mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
    workspaceRoot: workspace,
    vectorIndex: 3,
    edgeName: "derive_lite_component_test_surface",
    targetAssetType: "component_test_surface",
    projected: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: []
    }
  });

  assert.equal(retryContext.priorGapDossiers.length, 0);
});

test("T-204 upstream review-grade pressure is carried as F_P continuation basis", () => {
  const source = installedOperatorSource();

  assert.match(source, /function fpEvaluationContinuationRefsForState/u);
  assert.match(
    source,
    /repairSurfaceTriage\?\.disposition === "upstream_reentry"/u
  );
  assert.match(
    source,
    /continuation:\/\/odd-sdlc\/\$\{runRef\}\/review-grade\/upstream-reentry/u
  );
  assert.match(
    source,
    /continuationRefs,\s*[\r\n]+\s*evidenceRefs/u
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

test("T-188 post-action retry context ignores non-retryable triage dossiers", () => {
  const archiveRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t188-triage-"));
  const gapDossierRef = pathToFileURL(path.join(archiveRoot, "gap_dossier.json"))
    .href;
  const blockingReason = {
    kind: "sdlc_blocking_reason",
    code: "review_grade_evaluator_process_timeout",
    reasonClass: "assurance",
    lawfulReentryPoint: "triage_gap",
    message:
      "Review-grade evaluator process or assessment admission failed and requires operator triage.",
    detail: "review_grade_evaluator_process_timeout:SIGTERM",
    evidenceRefs: [pathToFileURL(path.join(archiveRoot, "review_grade_run.json")).href]
  };
  const gapDossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_uat_testcases_surface",
    vectorIndex: 0,
    targetAssetType: "uat_testcases_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason: "review_grade_evaluator_process_timeout:SIGTERM",
        reasonClass: "assurance",
        blockingReason
      }
    ],
    evidenceRefs: [pathToFileURL(path.join(archiveRoot, "review_grade_run.json")).href],
    priorManifestId: pathToFileURL(path.join(archiveRoot, "handoff_manifest.json"))
      .href,
    currentGapDossierRef: gapDossierRef,
    retryEligible: false,
    nextLawfulActions: ["triage_gap"]
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
        "construction-action://odd-sdlc/post-action/derive_uat_testcases_surface/post_repair/derive_uat_testcases_surface",
      nextActionProjectionRef:
        "construction-priority-projection://odd-sdlc/post-action/derive_uat_testcases_surface",
      gapPressureRefs: [
        `pressure://odd-sdlc/post-action/${encodeURIComponent(
          pathToFileURL(archiveRoot).href
        )}/triage`
      ]
    }
  });

  assert(retryContext);
  assert.deepEqual(retryContext.priorGapDossiers, []);
});

test("T-189 retry context consumes ABG fresh retry projection rows", () => {
  const archiveRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t189-abg-retry-"));
  const gapDossierRef = pathToFileURL(path.join(archiveRoot, "gap_dossier.json"))
    .href;
  const reason = "review_grade_edge_fulfillment_blocked:target_asset";
  const gapDossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_component_test_surface",
    vectorIndex: 4,
    targetAssetType: "component_test_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({ reason })
      }
    ],
    evidenceRefs: [],
    priorManifestId: pathToFileURL(path.join(archiveRoot, "handoff_manifest.json"))
      .href,
    currentGapDossierRef: gapDossierRef,
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge"]
  };
  mkdirSync(archiveRoot, { recursive: true });
  writeFileSync(
    path.join(archiveRoot, "gap_dossier.json"),
    JSON.stringify(gapDossier),
    "utf8"
  );

  const retryContext = sdlcWorkerRetryContextFromAbgRetryContext({
    kind: "fresh_retry_context_projection",
    basisId: "basis://t189",
    graphFunctionId: "graph-function://t189",
    graphCallId: "graph-call://t189",
    frameId: "frame://t189",
    vectorIndex: 4,
    edge: "derive_component_test_surface",
    status: "fresh",
    reason: null,
    replayFrontierRef: "retry-frontier://abg/t189/current",
    suppliedFrontierRef: "retry-frontier://abg/t189/stale",
    frontier: {
      kind: "retry_frontier_projection",
      basisId: "basis://t189",
      graphFunctionId: "graph-function://t189",
      graphCallId: "graph-call://t189",
      frameId: "frame://t189",
      vectorIndex: 4,
      edge: "derive_component_test_surface",
      frontierRef: "retry-frontier://abg/t189/current",
      isFullFrontier: true,
      rows: [],
      reasonClasses: ["blocking_reason"],
      attemptCount: 2,
      latestAttemptIndex: 1
    },
    selectedRows: [
      {
        kind: "retry_frontier_row",
        rowId: "retry-row://abg/t189/current-gap",
        vectorIndex: 4,
        edge: "derive_component_test_surface",
        attemptIndex: 1,
        retryRunId: "retry-run://abg/t189/current",
        manifestId: pathToFileURL(path.join(archiveRoot, "handoff_manifest.json"))
          .href,
        priorManifestId: pathToFileURL(path.join(archiveRoot, "prior.json")).href,
        reasonClass: "blocking_reason",
        ownerSurface: "abg_retry",
        detail: reason,
        evidenceRefs: [gapDossierRef],
        sourceEventKind: "retry_repair_planned",
        clearedByClosure: false
      }
    ],
    selectedEvidenceRefs: [gapDossierRef]
  });

  assert.equal(retryContext.retryAttemptRefs.length, 1);
  assert.equal(
    retryContext.retryAttemptRefs[0].sourceProjectionRef,
    "retry-frontier://abg/t189/current"
  );
  assert.equal(retryContext.retryAttemptRefs[0].priorAuthorityRef, gapDossierRef);
  assert.equal(retryContext.priorGapDossiers.length, 1);
  assert.equal(retryContext.priorGapDossiers[0].currentGapDossierRef, gapDossierRef);
});

test("T-189 retry context fails closed on non-fresh or unselected ABG seam", () => {
  const row = {
    kind: "retry_frontier_row",
    rowId: "retry-row://abg/t189/unselected-gap",
    vectorIndex: 4,
    edge: "derive_component_test_surface",
    attemptIndex: 1,
    retryRunId: "retry-run://abg/t189/unselected",
    manifestId: "file:///tmp/odd-sdlc-t189/handoff_manifest.json",
    priorManifestId: "file:///tmp/odd-sdlc-t189/gap_dossier.json",
    reasonClass: "blocking_reason",
    ownerSurface: "abg_retry",
    detail: "review_grade_edge_fulfillment_blocked",
    evidenceRefs: ["file:///tmp/odd-sdlc-t189/gap_dossier.json"],
    sourceEventKind: "retry_repair_planned",
    clearedByClosure: false
  };
  const baseProjection = {
    kind: "fresh_retry_context_projection",
    basisId: "basis://t189",
    graphFunctionId: "graph-function://t189",
    graphCallId: "graph-call://t189",
    frameId: "frame://t189",
    vectorIndex: 4,
    edge: "derive_component_test_surface",
    status: "fresh",
    reason: null,
    replayFrontierRef: "retry-frontier://abg/t189/current",
    suppliedFrontierRef: null,
    frontier: {
      kind: "retry_frontier_projection",
      basisId: "basis://t189",
      graphFunctionId: "graph-function://t189",
      graphCallId: "graph-call://t189",
      frameId: "frame://t189",
      vectorIndex: 4,
      edge: "derive_component_test_surface",
      frontierRef: "retry-frontier://abg/t189/current",
      isFullFrontier: true,
      rows: [row],
      reasonClasses: ["blocking_reason"],
      attemptCount: 2,
      latestAttemptIndex: 1
    },
    selectedRows: [row],
    selectedEvidenceRefs: ["file:///tmp/odd-sdlc-t189/gap_dossier.json"]
  };

  assert.throws(
    () =>
      sdlcWorkerRetryContextFromAbgRetryContext({
        ...baseProjection,
        status: "stale_supplied_projection"
      }),
    /not fresh/u
  );
  assert.throws(
    () =>
      sdlcWorkerRetryContextFromAbgRetryContext({
        ...baseProjection,
        selectedRows: []
      }),
    /frontier rows but no selected retry rows/u
  );

  const emptyContext = sdlcWorkerRetryContextFromAbgRetryContext({
    ...baseProjection,
    frontier: {
      ...baseProjection.frontier,
      rows: [],
      reasonClasses: [],
      attemptCount: 0,
      latestAttemptIndex: null
    },
    selectedRows: [],
    selectedEvidenceRefs: []
  });
  assert.deepEqual(emptyContext.retryAttemptRefs, []);
  assert.deepEqual(emptyContext.priorGapDossiers, []);
});

test("T-204 post-action retry context ignores closure archive without a gap dossier file", () => {
  const archiveRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t188-closure-"));
  const reason =
    "component_depth_register_invalid:component_depth_register.componentTopologyRows[0].sourceAssetRefs: expected array";
  const reasonRef = `pressure://odd-sdlc/component-depth/${encodeURIComponent(
    pathToFileURL(archiveRoot).href
  )}/${encodeURIComponent(reason)}`;
  writeFileSync(
    path.join(archiveRoot, "handoff_manifest.json"),
    JSON.stringify({
      kind: "sdlc_worker_handoff_manifest",
      archiveRoot,
      graphFunctionName: "derive_component_code_surface",
      edgeName: "derive_component_code_surface",
      vectorIndex: 0,
      targetAssetType: "component_code_surface"
    }),
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "sdlc_edge_closure_decision.json"),
    JSON.stringify({
      kind: "sdlc_edge_closure_decision",
      decisionRef: "closure-decision://odd-sdlc/t188/component-code",
      disposition: "retry",
      reasonRefs: [reasonRef]
    }),
    "utf8"
  );

  const retryContext = deriveSdlcWorkerRetryContextFromPostActionProjection({
    vectorIndex: 0,
    nextActionProjection: {
      nextActionBasisKind: "post_repair",
      choosesNextTraversal: true,
      selectedActionRef:
        "construction-action://odd-sdlc/post-action/derive_component_code_surface/post_retry/derive_component_code_surface",
      nextActionProjectionRef:
        "construction-priority-projection://odd-sdlc/post-action/derive_component_code_surface",
      gapPressureRefs: [
        `pressure://odd-sdlc/post-action/${encodeURIComponent(
          pathToFileURL(archiveRoot).href
        )}/retry`
      ]
    }
  });

  assert(retryContext);
  assert.equal(
    retryContext.retryAttemptRefs[0].priorAuthorityRef,
    "construction-action://odd-sdlc/post-action/derive_component_code_surface/post_retry/derive_component_code_surface"
  );
  assert.equal(retryContext.priorGapDossiers.length, 0);
});

test("T-204 runtime gap merge ignores closure archive without a gap dossier file", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t188-runtime-"));
  const archiveRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs/20260601T155828595Z_pid42919"
  );
  mkdirSync(archiveRoot, { recursive: true });
  const reason =
    "component_depth_register_invalid:component_depth_register.componentTopologyRows[0].sourceAssetRefs: expected array";
  const reasonRef = `pressure://odd-sdlc/component-depth/${encodeURIComponent(
    pathToFileURL(archiveRoot).href
  )}/${encodeURIComponent(reason)}`;
  writeFileSync(
    path.join(archiveRoot, "handoff_manifest.json"),
    JSON.stringify({
      kind: "sdlc_worker_handoff_manifest",
      archiveRoot,
      graphFunctionName: "derive_component_code_surface",
      edgeName: "derive_component_code_surface",
      vectorIndex: 0,
      targetAssetType: "component_code_surface"
    }),
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "sdlc_edge_closure_decision.json"),
    JSON.stringify({
      kind: "sdlc_edge_closure_decision",
      decisionRef: "closure-decision://odd-sdlc/t188/component-code",
      disposition: "retry",
      reasonRefs: [reasonRef]
    }),
    "utf8"
  );

  const retryContext = mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
    workspaceRoot: workspace,
    vectorIndex: 0,
    edgeName: "derive_component_code_surface",
    targetAssetType: "component_code_surface",
    projected: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [
        {
          vectorIndex: 0,
          retryRunId: "post-action-reentry",
          retryCallId: "construction-priority-projection://stale",
          manifestId: "construction-priority-projection://stale",
          priorAuthorityRef:
            "construction-action://odd-sdlc/post-action/Fg_materialize_declared_product_asset/post_downstream_product_materialization/component_code_surface",
          attemptIndex: 0,
          sourceProjectionRef: "construction-priority-projection://stale"
        }
      ],
      priorGapDossiers: []
    }
  });

  assert.equal(retryContext.priorGapDossiers.length, 0);
  assert.equal(
    retryContext.retryAttemptRefs[0].priorAuthorityRef,
    "construction-action://odd-sdlc/post-action/Fg_materialize_declared_product_asset/post_downstream_product_materialization/component_code_surface"
  );
});

test("T-188 runtime gap merge does not promote non-retryable triage dossiers", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t188-runtime-triage-"));
  const archiveRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs/20260604T035229784Z_pid72875"
  );
  mkdirSync(archiveRoot, { recursive: true });
  const gapDossierRef = pathToFileURL(path.join(archiveRoot, "gap_dossier.json"))
    .href;
  writeFileSync(
    path.join(archiveRoot, "gap_dossier.json"),
    JSON.stringify({
      kind: "sdlc_postflight_gap_dossier",
      status: "open",
      graphFunctionName: "bootstrap_release_self_test",
      edgeName: "derive_uat_testcases_surface",
      vectorIndex: 0,
      targetAssetType: "uat_testcases_surface",
      reasons: [
        {
          kind: "sdlc_postflight_gap_reason",
          reason: "review_grade_evaluator_process_timeout:SIGTERM",
          reasonClass: "assurance",
          blockingReason: {
            kind: "sdlc_blocking_reason",
            code: "review_grade_evaluator_process_timeout",
            reasonClass: "assurance",
            lawfulReentryPoint: "triage_gap",
            message:
              "Review-grade evaluator process or assessment admission failed and requires operator triage.",
            detail: "review_grade_evaluator_process_timeout:SIGTERM",
            evidenceRefs: [
              pathToFileURL(
                path.join(archiveRoot, "review_grade_edge_fulfillment_run.json")
              ).href
            ]
          }
        }
      ],
      evidenceRefs: [
        pathToFileURL(
          path.join(archiveRoot, "review_grade_edge_fulfillment_run.json")
        ).href
      ],
      priorManifestId: pathToFileURL(path.join(archiveRoot, "handoff_manifest.json"))
        .href,
      currentGapDossierRef: gapDossierRef,
      retryEligible: false,
      nextLawfulActions: ["triage_gap"]
    }),
    "utf8"
  );

  const projected = {
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: [
      {
        vectorIndex: 0,
        retryRunId: "post-action-reentry",
        retryCallId: "construction-priority-projection://uat",
        manifestId: "construction-priority-projection://uat",
        priorAuthorityRef:
          "construction-action://odd-sdlc/post-action/derive_uat_testcases_surface/post_repair/derive_uat_testcases_surface",
        attemptIndex: 0,
        sourceProjectionRef: "construction-priority-projection://uat"
      }
    ],
    priorGapDossiers: []
  };
  const retryContext = mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
    workspaceRoot: workspace,
    vectorIndex: 0,
    edgeName: "derive_uat_testcases_surface",
    targetAssetType: "uat_testcases_surface",
    projected
  });

  assert.deepEqual(retryContext, projected);
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

test("T-188 runtime gap merge restores newer real same-edge gap after stale retry projection", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t188-real-gap-"));
  const runsRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  const staleRun = path.join(runsRoot, "20260601T170339802Z_pid39651");
  const latestRun = path.join(runsRoot, "20260601T173921237Z_pid807");
  mkdirSync(staleRun, { recursive: true });
  mkdirSync(latestRun, { recursive: true });
  const latestRef = pathToFileURL(path.join(latestRun, "gap_dossier.json")).href;
  const reason =
    "review_grade_edge_fulfillment_blocked:target_asset:component_test_surface:semantic_not_realized:Repair src/topology.js and re-run npm test.";
  const dossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "derive_component_test_surface",
    edgeName: "derive_component_test_surface",
    vectorIndex: 0,
    targetAssetType: "component_test_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({ reason })
      }
    ],
    evidenceRefs: [
      pathToFileURL(
        path.join(latestRun, "review_grade_edge_fulfillment_assessment.json")
      ).href
    ],
    priorManifestId: pathToFileURL(path.join(latestRun, "handoff_manifest.json"))
      .href,
    currentGapDossierRef: latestRef,
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge"]
  };
  writeFileSync(
    path.join(latestRun, "gap_dossier.json"),
    JSON.stringify(dossier),
    "utf8"
  );

  const retryContext = mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
    workspaceRoot: workspace,
    vectorIndex: 0,
    edgeName: "derive_component_test_surface",
    targetAssetType: "component_test_surface",
    projected: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [
        {
          vectorIndex: 0,
          retryRunId: "post-action-reentry",
          retryCallId: `construction-priority-projection:construction-episode://odd-sdlc/post-action/${encodeURIComponent(
            pathToFileURL(path.join(staleRun, "general")).href
          )}`,
          manifestId: `construction-priority-projection:construction-episode://odd-sdlc/post-action/${encodeURIComponent(
            pathToFileURL(path.join(staleRun, "general")).href
          )}`,
          priorAuthorityRef: `construction-action://odd-sdlc/post-action/derive_component_test_surface/post_close_overlay_continuation/derive_component_test_surface/${encodeURIComponent(
            pathToFileURL(staleRun).href
          )}`,
          attemptIndex: 0,
          sourceProjectionRef: `construction-priority-projection:construction-episode://odd-sdlc/post-action/${encodeURIComponent(
            pathToFileURL(path.join(staleRun, "general")).href
          )}`
        }
      ],
      priorGapDossiers: []
    }
  });

  assert.equal(retryContext.priorGapDossiers.length, 1);
  assert.equal(retryContext.priorGapDossiers[0].currentGapDossierRef, latestRef);
  assert.equal(retryContext.priorGapDossiers[0].reasons[0].reason, reason);
});

test("T-204 runtime gap merge drops stale review-grade gap when a newer run lacks a current dossier", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t204-stale-review-gap-"));
  const runsRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  const staleRun = path.join(runsRoot, "20260621T062026437Z_pid77635");
  const latestRun = path.join(runsRoot, "20260621T062945972Z_pid77635");
  mkdirSync(staleRun, { recursive: true });
  mkdirSync(latestRun, { recursive: true });
  const staleRef = pathToFileURL(path.join(staleRun, "gap_dossier.json")).href;
  const staleReason =
    "review_grade_edge_fulfillment_blocked:requirement:data_mapper.requirements.req_int_001:semantic_not_realized:Revise ADR-003 synthesis coverage.";
  const staleDossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "lite_design_module_implementation",
    edgeName: "derive_lite_test_design_surface",
    vectorIndex: 2,
    targetAssetType: "test_design_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason: staleReason,
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({ reason: staleReason })
      }
    ],
    evidenceRefs: [
      pathToFileURL(
        path.join(staleRun, "review_grade_edge_fulfillment_assessment.json")
      ).href
    ],
    priorManifestId: pathToFileURL(path.join(staleRun, "handoff_manifest.json")).href,
    currentGapDossierRef: staleRef,
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge"]
  };
  writeFileSync(
    path.join(staleRun, "gap_dossier.json"),
    JSON.stringify(staleDossier),
    "utf8"
  );
  writeFileSync(
    path.join(latestRun, "handoff_manifest.json"),
    JSON.stringify({
      kind: "sdlc_worker_handoff_manifest",
      archiveRoot: latestRun,
      graphFunctionName: "lite_design_module_implementation",
      edgeName: "derive_lite_test_design_surface",
      vectorIndex: 2,
      targetAssetType: "test_design_surface"
    }),
    "utf8"
  );
  writeFileSync(
    path.join(latestRun, "review_grade_edge_fulfillment_assessment.json"),
    JSON.stringify({
      kind: "sdlc_review_grade_edge_fulfillment_assessment",
      assessmentVersion: "ts-review-grade-v1",
      graphFunctionName: "lite_design_module_implementation",
      edgeName: "derive_lite_test_design_surface",
      targetAssetType: "test_design_surface",
      status: "blocked",
      reviewedObligationIds: [
        "requirement:data_mapper.requirements.req_ldm_004_a",
        "requirement:data_mapper.requirements.req_ldm_006"
      ],
      findings: [],
      stageBoundaryConformance: null,
      materializationBindingRelation: null,
      obligationCoverageFold: null,
      evidenceRefs: [],
      summary: "newer blocked assessment exists without a published gap dossier"
    }),
    "utf8"
  );

  const retryContext = mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
    workspaceRoot: workspace,
    vectorIndex: 2,
    edgeName: "derive_lite_test_design_surface",
    targetAssetType: "test_design_surface",
    projected: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [
        {
          vectorIndex: 2,
          retryRunId: "run://odd-sdlc/public-start:retry:1",
          retryCallId: pathToFileURL(path.join(staleRun, "worker_result_report.json")).href,
          manifestId: pathToFileURL(path.join(staleRun, "handoff_manifest.json")).href,
          priorAuthorityRef: pathToFileURL(
            path.join(staleRun, "worker_result_report.json")
          ).href,
          attemptIndex: 1,
          sourceProjectionRef: "retry-frontier://odd-sdlc/stale"
        }
      ],
      priorGapDossiers: [staleDossier]
    }
  });

  assert.equal(retryContext.priorGapDossiers.length, 0);
  assert.equal(retryContext.retryAttemptRefs.length, 1);
});

test("T-199 runtime gap merge restores same-run assurance retry gap dossier", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t199-same-run-gap-"));
  const runsRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  const retryRun = path.join(runsRoot, "20260612T001131540Z_pid17256");
  mkdirSync(retryRun, { recursive: true });
  const gapDossierRef = pathToFileURL(path.join(retryRun, "gap_dossier.json"))
    .href;
  const reason =
    "review_grade_edge_fulfillment_blocked:target_asset:component_code_surface:semantic_not_realized:Materialize the missing declared source boundary.";
  const gapDossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "lite_design_module_implementation",
    edgeName: "derive_lite_component_code_surface",
    vectorIndex: 1,
    targetAssetType: "component_code_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({ reason })
      }
    ],
    evidenceRefs: [
      pathToFileURL(
        path.join(retryRun, "review_grade_edge_fulfillment_assessment.json")
      ).href
    ],
    priorManifestId: pathToFileURL(path.join(retryRun, "handoff_manifest.json"))
      .href,
    currentGapDossierRef: gapDossierRef,
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge"]
  };
  writeFileSync(
    path.join(retryRun, "gap_dossier.json"),
    JSON.stringify(gapDossier),
    "utf8"
  );

  const retryContext = mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
    workspaceRoot: workspace,
    vectorIndex: 1,
    edgeName: "derive_lite_component_code_surface",
    targetAssetType: "component_code_surface",
    projected: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [
        {
          vectorIndex: 1,
          retryRunId: "run://odd-sdlc/public-start:retry:1",
          retryCallId:
            'retry-frontier-row:{"vectorIndex":1,"reasonClass":"retry_planned"}',
          manifestId:
            'manifest:assurance_retry:{"vectorIndex":1,"attemptIndex":1}',
          priorAuthorityRef: pathToFileURL(
            path.join(retryRun, "worker_result_report.json")
          ).href,
          attemptIndex: 1,
          sourceProjectionRef: 'retry-frontier:{"vectorIndex":1}'
        }
      ],
      priorGapDossiers: []
    }
  });

  assert.equal(retryContext.priorGapDossiers.length, 1);
  assert.equal(
    retryContext.priorGapDossiers[0].currentGapDossierRef,
    gapDossierRef
  );
  assert.equal(retryContext.priorGapDossiers[0].reasons[0].reason, reason);
});

test("T-188 retry context drops stale component repair schedule pressure after current qualification passes", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t188-stale-repair-"));
  mkdirSync(path.join(workspace, ".ai-workspace/context"), { recursive: true });
  mkdirSync(
    path.join(workspace, "build_tenants/data_mapper_lite_javascript/design"),
    { recursive: true }
  );
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t188_stale_repair",
      "  active_tenant: data_mapper_lite_javascript",
      "  selected_output_root: build_tenants/data_mapper_lite_javascript",
      "  ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  data_mapper_lite_javascript:",
      "    output_dir: build_tenants/data_mapper_lite_javascript",
      "    language: JavaScript",
      "    build_tool: npm",
      "    test_runner: npm test",
      "    test_execution_contract: npm test"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(
      workspace,
      "build_tenants/data_mapper_lite_javascript/design/component_test_qualification_surface.md"
    ),
    `${JSON.stringify(
      {
        kind: "sdlc_component_depth_register",
        registerVersion: "ts-component-depth-v1",
        targetAssetType: "component_test_qualification_surface",
        componentTopologyRows: [],
        componentRealizationRows: [],
        testComponentTopologyRows: [],
        componentTestRows: [],
        componentTestQualificationRows: [
          {
            kind: "sdlc_component_test_qualification_row",
            testClassId: "test.topology.multigraph_identity",
            testcaseIds: ["TC-T188-001"],
            componentIds: ["topology.object_registry"],
            requirementIds: ["REQ-T188-001"],
            status: "passed",
            evidenceRefs: ["file:///tmp/t188/current-execution-summary.json"]
          }
        ],
        componentExecutionFailureRegister: null,
        componentRepairSchedule: null,
        releaseDepthParity: null
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const staleRef = "file:///tmp/t188-stale-repair/gap_dossier.json";
  const staleDossier = {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "derive_component_repair_schedule_surface",
    edgeName: "derive_component_repair_schedule_surface",
    vectorIndex: 0,
    targetAssetType: "component_repair_schedule_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason: "component_repair_schedule_repair_required",
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({
          reason: "component_repair_schedule_repair_required"
        })
      },
      {
        kind: "sdlc_postflight_gap_reason",
        reason: "component_repair_row_open:failure:test.topology.multigraph_identity:node-test:topology",
        reasonClass: "assurance",
        blockingReason: sdlcBlockingReasonFromLegacy({
          reason: "component_repair_row_open:failure:test.topology.multigraph_identity:node-test:topology"
        })
      }
    ],
    evidenceRefs: ["file:///tmp/t188-stale-repair/sdlc_edge_closure_decision.json"],
    priorManifestId: "file:///tmp/t188-stale-repair/handoff_manifest.json",
    currentGapDossierRef: staleRef,
    retryEligible: true,
    nextLawfulActions: ["repair_worker_output"]
  };

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
          retryCallId: "construction-priority-projection://stale-repair",
          manifestId: "construction-priority-projection://stale-repair",
          priorAuthorityRef: staleRef,
          attemptIndex: 0,
          sourceProjectionRef: "construction-priority-projection://stale-repair"
        }
      ],
      priorGapDossiers: [staleDossier]
    }
  });

  assert.deepEqual(retryContext.priorGapDossiers, []);
  assert.equal(retryContext.retryAttemptRefs[0].priorAuthorityRef, staleRef);
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

test("T-140 installed operator has no local traversal-consequence retry derivation", () => {
  const source = installedOperatorSource();

  assert.equal(
    source.includes("deriveSdlcWorkerRetryContextFromTraversalConsequence"),
    false
  );
  assert.equal(source.includes("retryContextFromGapDossier"), false);
  assert.equal(
    source.includes("latest.gapDossier === null\n        ? undefined"),
    false
  );
});

test("T-204 installed operator does not synthesize gap authority from closure archives", () => {
  const source = installedOperatorSource();

  assert.equal(source.includes("syntheticClosureGapDossierFromArchiveRoot"), false);
  assert.equal(
    source.includes('readFileSync(join(archiveRoot, "sdlc_edge_closure_decision.json")'),
    false
  );
  assert.match(
    source,
    /function stateWithReviewGradePostflight[\s\S]*constructPostflightGapDossier[\s\S]*writePostflightGapDossier[\s\S]*gapDossier: reviewGradeGapDossier \?\? state\.gapDossier/u
  );
  assert.match(source, /latestRuntimeAttemptRunIdForRetryContext/u);
  assert.match(source, /retryContextWithoutPriorGapDossiers/u);
});

test("T-204 non-close closure cannot project as a closed ABG consequence", () => {
  const source = installedOperatorSource();

  assert.match(
    source,
    /consequence\.edgeClosureDecision\.disposition !== "close"[\s\S]*traversalAction === null[\s\S]*constructConsequenceProjectionOutcome\(\{[\s\S]*status: "blocked"[\s\S]*reason: `edge_closure_decision_\$\{consequence\.edgeClosureDecision\.disposition\}`/u
  );
  assert.doesNotMatch(
    source,
    /status: "projected"[\s\S]*traversalAction,[\s\S]*\}\);[\s\S]*consequence\.edgeClosureDecision\.disposition !== "close"/u
  );
});

test("T-204 test-design closure admission carries selected target-carrier identity", () => {
  const source = installedOperatorSource();

  assert.match(
    source,
    /if \(input\.state\.manifest\.targetAssetType === "test_design_surface"\) \{[\s\S]*admitTestDesignRegisterFromArtifact\(\{[\s\S]*targetCarrierKind: input\.state\.manifest\.targetCarrierProjection\.outputCarrierKind,[\s\S]*edgeRef: input\.state\.manifest\.edgeName,[\s\S]*contractRef:[\s\S]*input\.state\.manifest\.targetCarrierProjection\.targetCarrierContractRef,[\s\S]*contractDigest:[\s\S]*input\.state\.manifest\.targetCarrierProjection\.targetCarrierContractDigest/u
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

  assert.equal(source.includes("sdlcClosureBlockingReasonRefsForReentry"), false);
  assert.equal(source.includes('reason.lawfulReentryPoint === "same_edge_retry"'), true);
  assert.equal(
    source.includes('reason.blockingReason.lawfulReentryPoint === "repair_worker_output"'),
    true
  );
  assert.equal(source.includes('action: "retry_same_edge"'), false);
  assert.equal(source.includes('action: "repair_worker_output"'), false);
  assert.equal(source.includes('action: "reprice_requirement_or_design"'), false);
});
