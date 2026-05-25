// Implements: REQ-F-ODDSDLC-051
// Implements: REQ-F-ODDSDLC-052
// Implements: REQ-F-ODDSDLC-053
// Implements: REQ-F-ODDSDLC-054
// Implements: REQ-F-ODDSDLC-055
// Implements: REQ-F-ODDSDLC-056
// Implements: REQ-F-ODDSDLC-063
// Implements: REQ-F-ODDSDLC-064
// Implements: REQ-F-ODDSDLC-065
// Implements: REQ-F-ODDSDLC-066

import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import {
  admitGraphSpanAssessment,
  constructEnginePluginContract,
  constructGraphReentryAppliedEvent,
  constructGraphReentryPlannedEvent,
  constructFdAuthorityOutcomeAdmittedEvent,
  constructConsequenceProjectionOutcome,
  constructGraphSpanAssessedEvent,
  constructGraphSpanEvaluationScheduledEvent,
  constructGraphSpanFoldbackEvaluatedEvent,
  constructFpDispatchOutcome,
  constructFpEvaluationFinding,
  constructFpEvaluationOutcome,
  constructEvaluationRuleOutcome,
  constructRuntimeWatchdogPolicy,
  constructVectorClosedEvent,
  constructVectorEvaluatedEvent,
  constructVectorTraversalPlannedEvent,
  foldGraphSpanAssessments,
  deriveAdvancementTransition,
  deriveGraphReentryFrontierProjection,
  deriveGraphReentryPlan,
  deriveIterationAdvanceDecision,
  deriveRuntimeAggregateProjection,
  deriveRuntimeLivenessObserverProjection,
  invokeSupervisedProcessActor,
  materializeGraphFunction,
  runEngineIterateAsync,
  runtimeEventsForFpTransformResult,
  runtimeEventsForIterationDecision,
  type ActorInvocation,
  type EnginePluginInput,
  type EvaluationRuleOutcome,
  type ExecutionBasis,
  type ConsequenceProjectionOutcome,
  type FpEvaluationCloseDisposition,
  type FpEvaluationOutcome,
  type GtlAdmittedStateRef,
  type GtlConsequenceProjectionRef,
  type Module,
  type RuntimeAggregateProjection,
  type RuntimeEvent,
  type RuntimeFailureClass,
  type RuntimeLivenessObserverProjection,
  type SupervisedProcessActorResult,
  type TracedProcessExecutorProfile,
  type TracedProcessOutcome,
  type TracedProcessStreamModel
} from "@abiogenesis/typescript-tenant";
import {
  constructBranchExecutionPolicy,
  runEventedNativeSagaFrontier,
  type NativeBranchTask
} from "@abiogenesis/typescript-tenant/abg/m03";
import {
  FG_CONFORM_PROJECT,
  FG_CONFORM_PROJECT_AUTHORITY,
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  admitSdlcTargetCarrierCandidate,
  constructSdlcGtlModule,
  constructSdlcTargetCarrierRegistry,
  constructSdlcTraversalOverlayCatalog,
  missingSdlcTargetCarrierAdmission,
  requireSdlcTargetCarrierRow,
  resolveSdlcTraversalOverlay,
  sdlcTargetCarrierCandidate,
  sdlcGraphFunctionBoundaryRef,
  sdlcGraphVectorBoundaryRef,
  sdlcPublishedActionRef,
  sdlcPublishedTraversalTargetRef,
  sdlcExecutiveEdgeAccountingRowFor,
  sdlcTraversalOverlayAllowsProductConvergence,
  sdlcTraversalOverlayNextGraphContinuation,
  sdlcTargetOutcomeRef,
  withSdlcOverlayBindingPostActionEvidence,
  type SdlcExecutiveEdgeAccountingRow,
  type SdlcTargetCarrierCandidateAdmission,
  type SdlcTargetCarrierContractRow
} from "../graph/index.js";
import { resolveSdlcTraversalOutcomeClass } from "../contracts/carrier_domain_catalog.js";
import {
  deriveSdlcOperatorAssuranceGate,
  type SdlcOperatorAssuranceGateResult
} from "./assurance_gate.js";
import {
  defaultOperationForTarget,
  hookContractByEdgeName,
  minimalSdlcHookInvocationForContract,
  runSdlcHookTurn,
  type SdlcHookTurnOutcome
} from "../hooks/index.js";
import type { SdlcPublicStartOutcome } from "../start/index.js";
import type {
  SdlcInstalledOperatorStartLoop,
  SdlcInstalledOperatorStartLoopAttempt,
  SdlcInstalledOperatorStartOutcome,
  SdlcInstalledOperatorStatus,
  SdlcInstalledOperatorTraversalConsequence,
  SdlcOperatorSummary,
  SdlcPostflightGapDossier,
  SdlcPostflightGapReason,
  SdlcPostflightResult,
  SdlcTraversalObligation,
  SdlcWorkerObligationAssessment,
  SdlcWorkerObligationFulfillmentStatus,
  SdlcWorkerHandoffManifest,
  SdlcDependencyMapNode,
  SdlcDependencyTraversalSelection,
  SdlcFeatureDependencyDag,
  SdlcAbgFrontierCompilation,
  SdlcModuleDependencyMap,
  SdlcTestDependencyMap,
  SdlcWorkerProcessStartedContext,
  SdlcWorkerProcessSummary,
  SdlcWorkerRetryContext,
  SdlcWorkerExecutionEvidence,
  SdlcWorkerResultReport,
  SdlcWorkerRunResult,
  SdlcDecompositionSummary,
  SdlcReviewGradeEdgeFulfillmentAssessment,
  SdlcTraversalHopSelection,
  SdlcTraversalOutcomeClass,
  SdlcWorkerTransportContract
} from "./carriers.js";
import {
  SDLC_COMPONENT_CONCERN_ROLES,
  SDLC_DESIGN_COMPLETENESS_STATUSES
} from "./carriers.js";
import {
  appendOddSdlcRuntimeEvents,
  oddSdlcRuntimeEventsPath
} from "./event_store.js";
import {
  constructPostflightGapDossier,
  buildPostTransformWorkerResultReport,
  componentRepairReentryPlansForGapDossier,
  constructorResultFromWorkerOutput,
  deriveSdlcStagedConstructionAuditCarriers,
  deriveWorkerHandoffManifest,
  readPostflightGapDossierRef,
  operatorRunId,
  snapshotProductMaterializationRoot,
  stableOperatorJson,
  workerResultReportWithFpStageRefs,
  writeInstalledOperatorOwnedEvaluationArtifact,
  writeHandoffFiles,
  writeOperatorArchiveFile,
  writePostflightGapDossier,
  writeWorkerFpTransformResult,
  writeProductMaterializationManifest,
  type SdlcStagedConstructionAuditCarrier
} from "./handoff.js";
import {
  selectSdlcWorkCategoryGovernance
} from "./work_category_governance.js";
import {
  admitSdlcEvaluateContentLedgerArtifact,
  designDepthFpEvaluatorContentLedgerPath,
  evaluateSdlcComputeStage,
  writeDesignDepthRegisterProjectionFromEvaluateContentLedger,
  writeSdlcFpEvaluateResult
} from "./plugins/evaluate/index.js";
import {
  admitImplementationDesignRegisterCandidateForManifest,
  admitImplementationDesignRegisterForManifest,
  admitImplementationDesignRegisterForRuntimeEvaluation,
  designDepthFpEvaluatorRegisterPath
} from "./plugins/evaluate/design_depth_register.js";
import {
  REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE,
  REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
  admitReviewGradeEdgeFulfillmentAssessmentFromArtifact,
  reviewGradeEdgeFulfillmentAssessmentRequired,
  reviewGradeEdgeFulfillmentOpenPressureRefs,
  reviewGradeFindingsAreDownstreamStagePressure
} from "./review_grade_edge_fulfillment.js";
import {
  compileSdlcFeatureDependencyDagToAbgFrontier,
  deriveSdlcFeatureDependencyDagFromMaps
} from "./feature_dependency_dag.js";
import {
  classifySdlcLiveParallelModuleLane,
  constructSdlcLiveFpParallelMaterializationFrontier,
  deriveSdlcLiveFpParallelMaterializationBranchOverrides,
  normalizeSdlcLiveFpParallelMaterializationTarget,
  resolveSdlcLiveFpParallelBatchSize,
  sdlcLiveParallelMaterializationTargetKey,
  type SdlcLiveFpParallelMaterializationBranchRow,
  type SdlcLiveFpParallelMaterializationFanInRow
} from "./live_fp_parallel_materialization_frontier.js";
import { deriveSdlcTraversalHopSelection } from "./traversal_complexity.js";
import {
  admitWorkerTransport,
  parserForWorkerTransport,
  processLaunchForWorker,
  selectedWorkerExecutorProfile
} from "./transport.js";
import {
  deriveSdlcInstalledQualificationInitialState,
  writeSdlcInstalledQualificationInitialStateArchive
} from "../qualification/index.js";
import {
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveConformProjectManagedTraversalLedger,
  deriveConformProjectManagedTraversalManifest,
  materializeSdlcProjectConformance
} from "../workspace/index.js";
import {
  deriveOddSdlcEvaluateNextReport,
  type OddSdlcEvaluateNextActionInput
} from "../runtime/index.js";
import {
  sdlcSelectedAbgFnCompositionIdentityFromEnginePluginInput,
  type SdlcSelectedAbgFnCompositionIdentity
} from "./composition_identity.js";
import {
  constructSdlcEdgeFulfillmentLedger,
  constructSdlcNextActionProjection,
  constructSdlcOverlaySegmentCompletion,
  constructSdlcWorksiteEvidence,
  deriveSdlcEdgeClosureDecision,
  deriveSdlcEdgeFulfillmentCountsFromAssessments,
  type SdlcEdgeFulfillmentCountProjection,
  type SdlcYieldResumeBasis
} from "./traversal_consequence.js";
import {
  admitSdlcEdgeEvidence,
  deriveSdlcEdgeAssuranceCloseDecision,
  deriveSdlcEdgeObligations,
  deriveSdlcEdgeResidualPressure,
  digestSdlcEdgeGainClosureContract,
  measureSdlcEdgeGain,
  resolveSdlcEdgeGainClosureContract,
  sdlcEdgeAssuranceContractRef,
  type SdlcEdgeEvidenceCandidate,
  type SdlcEdgeEvidenceSourceKind,
  type SdlcEdgeLedgerInputRef
} from "./edge_gain_closure.js";
import {
  canonicalSdlcPriorGapReasonCode,
  legacyBlockingReasonCode,
  makeSdlcBlockingReason,
  sdlcBlockingReasonFromLegacy,
  summarizeBlockingReasons,
  type SdlcBlockingReason,
  type SdlcBlockingReasonCode,
  type SdlcBlockingReasonLawfulReentryPoint
} from "../shared/blocking_reason.js";
import { admitComponentDepthRegisterFromArtifact } from "./component_depth_register.js";
import { admitTestDesignRegisterFromArtifact } from "./test_design_register.js";
import { admitTestExecutionSurfaceRegisterFromArtifact } from "./test_execution_surface_register.js";

export const MAX_INSTALLED_RETRY_REENTRY_ATTEMPTS = 5;
export const MAX_INSTALLED_YIELD_REENTRY_ATTEMPTS = 20;
export const MAX_INSTALLED_CONVERGENCE_ATTEMPTS = 200;
const MAX_INSTALLED_OTHER_REENTRY_ATTEMPTS = 5;
const EMPTY_SCOPE_PATH: readonly string[] = Object.freeze([]);

export type SdlcInstalledReentryDisposition = "retry" | "yield" | "other";

function summary(input: {
  readonly workspaceRoot: string;
  readonly graphFunctionName: string | null;
  readonly currentEdge: string | null;
  readonly status: SdlcOperatorSummary["status"];
  readonly blockingReason: string | null;
  readonly blockingReasonCarriers?: readonly SdlcBlockingReason[] | undefined;
  readonly nextLawfulAction: string;
  readonly archiveRoot: string | null;
}): SdlcOperatorSummary {
  const blockingReasons =
    input.blockingReasonCarriers ??
    (input.blockingReason === null
      ? Object.freeze([])
      : Object.freeze([
          sdlcBlockingReasonFromLegacy({ reason: input.blockingReason })
        ]));
  return Object.freeze({
    kind: "sdlc_operator_summary",
    workspaceRoot: input.workspaceRoot,
    graphFunctionName: input.graphFunctionName,
    currentEdge: input.currentEdge,
    status: input.status,
    blockingReason: input.blockingReason ?? summarizeBlockingReasons(blockingReasons),
    blockingReasons,
    nextLawfulAction: input.nextLawfulAction,
    archiveRoot: input.archiveRoot
  });
}

function terminalOutcome(input: {
  readonly workspaceRoot: string;
  readonly status: SdlcInstalledOperatorStatus;
  readonly start: SdlcPublicStartOutcome;
  readonly transport: SdlcWorkerTransportContract | null;
  readonly manifest: SdlcWorkerHandoffManifest | null;
  readonly workerRun: SdlcWorkerRunResult | null;
  readonly workerReport: SdlcWorkerResultReport | null;
  readonly postflight: SdlcPostflightResult | null;
  readonly assuranceSatisfaction?: SdlcInstalledOperatorStartOutcome["assuranceSatisfaction"];
  readonly gapDossier: SdlcPostflightGapDossier | null;
  readonly hookOutcome: SdlcHookTurnOutcome | null;
  readonly replayEventCountBefore: number;
  readonly replayEventCountAfter: number;
  readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
  readonly archiveRoot: string | null;
  readonly blockingReason: string | null;
  readonly blockingReasonCarriers?: readonly SdlcBlockingReason[] | undefined;
  readonly nextLawfulAction: string;
  readonly currentEdge?: string | null;
  readonly traversalConsequence?: SdlcInstalledOperatorTraversalConsequence | null;
}): SdlcInstalledOperatorStartOutcome {
  const graphFunctionName =
    input.start.executionContract?.targetGraphFunction ?? null;
  return Object.freeze({
    kind: "sdlc_installed_operator_start_outcome",
    status: input.status,
    summary: summary({
      workspaceRoot: input.workspaceRoot,
      graphFunctionName,
      currentEdge: input.currentEdge ?? null,
      status: input.status,
      blockingReason: input.blockingReason,
      blockingReasonCarriers: input.blockingReasonCarriers,
      nextLawfulAction: input.nextLawfulAction,
      archiveRoot: input.archiveRoot
    }),
    start: input.start,
    transport: input.transport,
    manifest: input.manifest,
    workerRun: input.workerRun,
    workerReport: input.workerReport,
    postflight: input.postflight,
    assuranceSatisfaction: input.assuranceSatisfaction ?? null,
    gapDossier: input.gapDossier,
    hookOutcome: input.hookOutcome,
    replayEventCountBefore: input.replayEventCountBefore,
    replayEventCountAfter: input.replayEventCountAfter,
    emittedRuntimeEventKinds: input.emittedRuntimeEventKinds,
    eventLogPath: oddSdlcRuntimeEventsPath(input.workspaceRoot),
    archiveRoot: input.archiveRoot,
    traversalConsequence: input.traversalConsequence ?? null
  });
}

function installedStartLoopAttemptFor(input: {
  readonly outcome: SdlcInstalledOperatorStartOutcome;
  readonly attemptIndex: number;
}): SdlcInstalledOperatorStartLoopAttempt {
  return Object.freeze({
    kind: "sdlc_installed_operator_start_loop_attempt",
    attemptIndex: input.attemptIndex,
    status: input.outcome.status,
    currentEdge: input.outcome.summary.currentEdge,
    closureDisposition: installedReentryDispositionForOutcome(input.outcome),
    reentryBasisRef: installedReentryBasisRef(input.outcome),
    blockingReason: input.outcome.summary.blockingReason,
    nextLawfulAction: input.outcome.summary.nextLawfulAction,
    archiveRoot: input.outcome.archiveRoot,
    retryEligible: input.outcome.gapDossier?.retryEligible ?? false,
    emittedRuntimeEventKinds: input.outcome.emittedRuntimeEventKinds
  });
}

function installedStartHasEvaluateNextTraversalTruth(
  outcome: SdlcInstalledOperatorStartOutcome
): boolean {
  if (
    outcome.status === "worker_failed" &&
    outcome.gapDossier?.retryEligible === false
  ) {
    return false;
  }
  return outcome.traversalConsequence?.nextActionProjection.choosesNextTraversal === true;
}

function installedStartRequestsDownstreamGraph(
  outcome: SdlcInstalledOperatorStartOutcome
): boolean {
  return (
    outcome.status === "converged" &&
    outcome.summary.nextLawfulAction === "rerun_start_for_downstream_graph"
  );
}

export function installedStartRequestsYieldResume(
  outcome: Pick<SdlcInstalledOperatorStartOutcome, "traversalConsequence">
): boolean {
  const closureDecision = outcome.traversalConsequence?.edgeClosureDecision ?? null;
  return (
    closureDecision?.disposition === "yield" &&
    closureDecision.yieldResumeBasis !== null
  );
}

export function installedStartShouldContinueForRequestedUntil(input: {
  readonly requestedUntil: string;
  readonly outcome: SdlcInstalledOperatorStartOutcome;
}): boolean {
  return (
    installedStartHasEvaluateNextTraversalTruth(input.outcome) ||
    (input.requestedUntil === "converged" &&
      (installedStartRequestsDownstreamGraph(input.outcome) ||
        installedStartRequestsYieldResume(input.outcome)))
  );
}

export function installedReentryDispositionForOutcome(
  outcome: Pick<SdlcInstalledOperatorStartOutcome, "traversalConsequence">
): SdlcInstalledReentryDisposition | null {
  const disposition =
    outcome.traversalConsequence?.edgeClosureDecision.disposition ?? null;
  if (disposition === null) {
    return null;
  }
  if (disposition === "retry" || disposition === "yield") {
    return disposition;
  }
  return "other";
}

export function installedReentryAttemptLimit(
  disposition: SdlcInstalledReentryDisposition
): number {
  if (disposition === "yield") {
    return MAX_INSTALLED_YIELD_REENTRY_ATTEMPTS;
  }
  if (disposition === "retry") {
    return MAX_INSTALLED_RETRY_REENTRY_ATTEMPTS;
  }
  return MAX_INSTALLED_OTHER_REENTRY_ATTEMPTS;
}

function installedReentryBasisRef(
  outcome: SdlcInstalledOperatorStartOutcome
): string | null {
  const consequence = outcome.traversalConsequence;
  if (consequence === null) {
    return null;
  }
  const materialization = outcome.manifest?.productMaterialization;
  return [
    consequence.edgeFulfillmentLedger.edgeRef,
    `disposition:${consequence.edgeClosureDecision.disposition}`,
    `selected:${consequence.nextActionProjection.selectedActionRef ?? "none"}`,
    `nextGraph:${consequence.nextActionProjection.nextGraphFunctionRef ?? "none"}`,
    `edge:${outcome.summary.currentEdge ?? "none"}`,
    `target:${outcome.manifest?.targetAssetType ?? "none"}`,
    `output:${outcome.manifest?.outputFile ?? "none"}`,
    `materializationRequired:${String(materialization?.required ?? null)}`,
    `selectedOutputRoot:${materialization?.selectedOutputRoot ?? "none"}`,
    `roles:${materialization?.requiredRoles.join(",") ?? "none"}`,
    `executionShards:${String(materialization?.executionShards.length ?? 0)}`,
    `blocking:${outcome.summary.blockingReason ?? "none"}`
  ].join("|");
}

export type SdlcWorkerRetryContextDerivationStatus =
  | "ready"
  | "no_consequence"
  | "no_manifest"
  | "no_executable_intent";

export interface SdlcWorkerRetryContextDerivation {
  readonly kind: "sdlc_worker_retry_context_derivation";
  readonly status: SdlcWorkerRetryContextDerivationStatus;
  readonly retryContext: SdlcWorkerRetryContext | null;
  readonly reasonRef: string;
  readonly sourceProjectionRef: string | null;
}

export function deriveSdlcWorkerRetryContextFromTraversalConsequence(input: {
  readonly outcome: SdlcInstalledOperatorStartOutcome;
  readonly attemptIndex: number;
}): SdlcWorkerRetryContextDerivation {
  const consequence = input.outcome.traversalConsequence;
  if (consequence === null) {
    return Object.freeze({
      kind: "sdlc_worker_retry_context_derivation" as const,
      status: "no_consequence" as const,
      retryContext: null,
      reasonRef: "retry-context-unavailable://odd-sdlc/no-consequence",
      sourceProjectionRef: null
    });
  }
  const sourceProjectionRef =
    consequence.nextActionProjection.nextActionProjectionRef;
  if (input.outcome.manifest === null) {
    return Object.freeze({
      kind: "sdlc_worker_retry_context_derivation" as const,
      status: "no_manifest" as const,
      retryContext: null,
      reasonRef: "retry-context-unavailable://odd-sdlc/no-manifest",
      sourceProjectionRef
    });
  }
  if (consequence.nextActionProjection.choosesNextTraversal !== true) {
    return Object.freeze({
      kind: "sdlc_worker_retry_context_derivation" as const,
      status: "no_executable_intent" as const,
      retryContext: null,
      reasonRef: "retry-context-unavailable://odd-sdlc/no-executable-intent",
      sourceProjectionRef
    });
  }
  const priorGapDossiers =
    input.outcome.gapDossier === null
      ? syntheticGapDossiersFromClosureDecision({
          outcome: input.outcome,
          sourceProjectionRef
        })
      : Object.freeze([input.outcome.gapDossier]);
  const priorAuthorityRef =
    priorGapDossiers[0]?.currentGapDossierRef ??
    consequence.edgeClosureDecision.decisionRef;
  const manifestRef = pathToFileURL(
    join(input.outcome.manifest.archiveRoot, "handoff_manifest.json")
  ).href;
  const refSegment = encodeURIComponent(sourceProjectionRef);
  const retryContext = Object.freeze({
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: Object.freeze([
      Object.freeze({
        vectorIndex: input.outcome.manifest.vectorIndex,
        retryRunId: `retry-run://odd-sdlc-ts/installed-reentry/${refSegment}/${input.attemptIndex}`,
        retryCallId: `retry-call://odd-sdlc-ts/installed-reentry/${refSegment}/${input.attemptIndex}`,
        manifestId: manifestRef,
        priorAuthorityRef,
        attemptIndex: input.attemptIndex,
        sourceProjectionRef
      })
    ]),
    priorGapDossiers
  });
  return Object.freeze({
    kind: "sdlc_worker_retry_context_derivation" as const,
    status: "ready" as const,
    retryContext,
    reasonRef: "retry-context://odd-sdlc/ready",
    sourceProjectionRef
  });
}

function syntheticGapDossiersFromClosureDecision(input: {
  readonly outcome: SdlcInstalledOperatorStartOutcome;
  readonly sourceProjectionRef: string;
}): readonly SdlcPostflightGapDossier[] {
  const manifest = input.outcome.manifest;
  const consequence = input.outcome.traversalConsequence;
  if (
    manifest === null ||
    consequence === null ||
    consequence.edgeClosureDecision.disposition === "close" ||
    consequence.edgeClosureDecision.reasonRefs.length === 0
  ) {
    return Object.freeze([]);
  }
  const currentGapDossierRef = `closure-gap-dossier://odd-sdlc/${encodeURIComponent(
    consequence.edgeClosureDecision.decisionRef
  )}`;
  const reasons = consequence.edgeClosureDecision.reasonRefs.map(
    (reasonRef): SdlcPostflightGapReason =>
      Object.freeze({
        kind: "sdlc_postflight_gap_reason" as const,
        reason: `edge_closure_residual_pressure:${reasonRef}`,
        reasonClass: "assurance" as const,
        blockingReason: makeSdlcBlockingReason({
          code: "assurance_ledger_reason",
          reasonClass: "assurance",
          lawfulReentryPoint: "same_edge_retry",
          message: "Edge closure residual pressure requires same-edge repair.",
          detail: reasonRef,
          evidenceRefs: [
            consequence.edgeClosureDecision.decisionRef,
            input.sourceProjectionRef,
            reasonRef
          ]
        })
      })
  );
  return Object.freeze([
    Object.freeze({
      kind: "sdlc_postflight_gap_dossier" as const,
      status: "open" as const,
      graphFunctionName: manifest.graphFunctionName,
      edgeName: manifest.edgeName,
      vectorIndex: manifest.vectorIndex,
      targetAssetType: manifest.targetAssetType,
      reasons: Object.freeze(reasons),
      evidenceRefs: uniqueSorted([
        consequence.edgeClosureDecision.decisionRef,
        input.sourceProjectionRef,
        ...consequence.edgeClosureDecision.reasonRefs
      ]),
      priorManifestId: pathToFileURL(join(manifest.archiveRoot, "handoff_manifest.json"))
        .href,
      currentGapDossierRef,
      retryEligible: true,
      nextLawfulActions: Object.freeze(["retry_same_edge" as const])
    })
  ]);
}

function terminalReasonForInstalledStartLoop(input: {
  readonly requestedUntil: string;
  readonly outcome: SdlcInstalledOperatorStartOutcome;
  readonly retryGuardExhausted: boolean;
  readonly exhaustedDisposition: SdlcInstalledReentryDisposition | null;
}): SdlcInstalledOperatorStartLoop["terminalReason"] {
  if (input.retryGuardExhausted) {
    if (input.exhaustedDisposition === "yield") {
      return "yield_guard_exhausted";
    }
    if (input.exhaustedDisposition === "other") {
      return "reentry_guard_exhausted";
    }
    return "retry_guard_exhausted";
  }
  if (input.outcome.status === "converged") {
    return "converged";
  }
  if (
    input.requestedUntil === "first_traversal" &&
    input.outcome.status === "worker_invoked"
  ) {
    return "first_traversal_closed";
  }
  if (input.outcome.status === "blocked") {
    return "blocked";
  }
  return "retry_not_planned";
}

function installedStartWithLoop(input: {
  readonly requestedUntil: string;
  readonly outcome: SdlcInstalledOperatorStartOutcome;
  readonly attempts: readonly SdlcInstalledOperatorStartLoopAttempt[];
  readonly maxAttempts: number;
  readonly retryGuardExhausted: boolean;
  readonly exhaustedDisposition: SdlcInstalledReentryDisposition | null;
}): SdlcInstalledOperatorStartOutcome {
  if (input.attempts.length <= 1) {
    return input.outcome;
  }
  const loop: SdlcInstalledOperatorStartLoop = Object.freeze({
    kind: "sdlc_installed_operator_start_loop",
    requestedUntil: input.requestedUntil,
    maxAttempts: input.maxAttempts,
    attemptCount: input.attempts.length,
    terminalReason: terminalReasonForInstalledStartLoop({
      requestedUntil: input.requestedUntil,
      outcome: input.outcome,
      retryGuardExhausted: input.retryGuardExhausted,
      exhaustedDisposition: input.exhaustedDisposition
    }),
    exhaustedDisposition: input.exhaustedDisposition,
    attempts: Object.freeze([...input.attempts])
  });
  return Object.freeze({
    ...input.outcome,
    traversalConsequence: input.outcome.traversalConsequence,
    loop
  });
}

function vectorEvaluatorNames(input: {
  readonly basis: ExecutionBasis;
  readonly vectorIndex: number;
}): readonly string[] {
  const vector = input.basis.graph.vectors[input.vectorIndex];
  if (vector === undefined) {
    throw new TypeError("Installed operator vector index outside basis");
  }
  return Object.freeze(vector.evaluators.map((evaluator) => evaluator.name));
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function compactSdlcPriorGapReasonForRetryContext(
  reason: SdlcPostflightGapReason,
  currentGapDossierRef: string
): SdlcPostflightGapReason {
  const canonicalReason = canonicalSdlcPriorGapReasonCode(reason.reason);
  return Object.freeze({
    ...reason,
    reason: canonicalReason,
    blockingReason: makeSdlcBlockingReason({
      code: reason.blockingReason.code,
      detail:
        reason.blockingReason.code === "assurance_ledger_reason"
          ? canonicalReason
          : reason.blockingReason.detail,
      reasonClass: reason.blockingReason.reasonClass,
      lawfulReentryPoint: reason.blockingReason.lawfulReentryPoint,
      message: reason.blockingReason.message,
      evidenceRefs: [currentGapDossierRef]
    })
  });
}

function compactSdlcPriorGapReasonKey(reason: SdlcPostflightGapReason): string {
  return [
    reason.reason,
    reason.blockingReason.code,
    reason.blockingReason.detail ?? "",
    reason.blockingReason.reasonClass,
    reason.blockingReason.lawfulReentryPoint
  ].join("\u001f");
}

export function compactSdlcPriorGapDossiersForRetryContext(
  dossiers: readonly SdlcPostflightGapDossier[]
): readonly SdlcPostflightGapDossier[] {
  if (dossiers.length <= 1) {
    return Object.freeze([...dossiers]);
  }
  const refs = uniqueSorted(dossiers.map((dossier) => dossier.currentGapDossierRef));
  const latest = preferredWorkerFacingGapDossierForRetryContext(dossiers);
  if (latest === undefined) {
    return Object.freeze([]);
  }
  const latestReasonByKey = new Map<string, SdlcPostflightGapReason>();
  for (const reason of latest.reasons) {
    const compactReason = compactSdlcPriorGapReasonForRetryContext(
      reason,
      latest.currentGapDossierRef
    );
    latestReasonByKey.set(compactSdlcPriorGapReasonKey(compactReason), compactReason);
  }
  const compact: SdlcPostflightGapDossier = Object.freeze({
    kind: latest.kind,
    status: latest.status,
    graphFunctionName: latest.graphFunctionName,
    edgeName: latest.edgeName,
    vectorIndex: latest.vectorIndex,
    targetAssetType: latest.targetAssetType,
    reasons: Object.freeze(
      [...latestReasonByKey.values()].sort(
        (left, right) =>
          left.reason.localeCompare(right.reason) ||
          (left.blockingReason.detail ?? "").localeCompare(
            right.blockingReason.detail ?? ""
          ) ||
          left.blockingReason.code.localeCompare(right.blockingReason.code)
      )
    ),
    evidenceRefs: refs,
    priorManifestId: latest.priorManifestId,
    currentGapDossierRef: latest.currentGapDossierRef,
    retryEligible: latest.retryEligible,
    nextLawfulActions: latest.nextLawfulActions
  });
  return Object.freeze([
    compact
  ]);
}

function workerFacingGapDossierIsOnlyRuntimeProcessFailure(
  dossier: SdlcPostflightGapDossier
): boolean {
  return (
    dossier.reasons.length > 0 &&
    dossier.reasons.every(
      (reason) =>
        reason.reasonClass === "worker_runtime" &&
        (
          reason.blockingReason.code === "worker_process_failed" ||
          reason.blockingReason.code === "worker_hard_timeout" ||
          reason.blockingReason.code === "silent_worker_inactivity" ||
          reason.blockingReason.code === "worker_lost_terminal" ||
          reason.blockingReason.code === "worker_process_error"
        )
    )
  );
}

function preferredWorkerFacingGapDossierForRetryContext(
  dossiers: readonly SdlcPostflightGapDossier[]
): SdlcPostflightGapDossier | undefined {
  const latest = dossiers[dossiers.length - 1];
  if (
    latest === undefined ||
    !workerFacingGapDossierIsOnlyRuntimeProcessFailure(latest)
  ) {
    return latest;
  }
  return [...dossiers]
    .reverse()
    .find(
      (dossier) =>
        dossier.edgeName === latest.edgeName &&
        dossier.targetAssetType === latest.targetAssetType &&
        dossier.vectorIndex === latest.vectorIndex &&
        !workerFacingGapDossierIsOnlyRuntimeProcessFailure(dossier)
    ) ?? latest;
}

function retryContextFromRetryAttemptRefs(
  refs: RuntimeAggregateProjection["retryAttemptRefs"]
): SdlcWorkerRetryContext {
  const retryAttemptRefs = Object.freeze(
    refs.map((ref) =>
      Object.freeze({
        vectorIndex: ref.vectorIndex,
        retryRunId: ref.retryRunId,
        retryCallId: ref.retryCallId,
        manifestId: ref.manifestId,
        priorAuthorityRef: ref.priorManifestId,
        attemptIndex: ref.attemptIndex,
        sourceProjectionRef: ref.sourceProjectionRef
      })
    )
  );
  return Object.freeze({
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs,
    priorGapDossiers: compactSdlcPriorGapDossiersForRetryContext(
      retryAttemptRefs
        .map((ref) => readPostflightGapDossierRef(ref.priorAuthorityRef))
        .filter((dossier): dossier is SdlcPostflightGapDossier => dossier !== null)
    )
  });
}

function decodedRefForScope(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

function decodedArchiveRefForScope(input: string): string {
  let decoded = input;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const next = decodedRefForScope(decoded);
    if (next === decoded) {
      return decoded;
    }
    decoded = next;
  }
  return decoded;
}

function postActionProjectionHasExplicitFeatureScope(input: {
  readonly nextActionProjectionRef: string;
  readonly selectedActionRef: string;
}): boolean {
  const refs = [
    input.nextActionProjectionRef,
    input.selectedActionRef
  ].map(decodedRefForScope);
  return refs.some((ref) =>
    /(?:\/module\/|\/scope\/|post_deferred_scope_product_materialization\/)[A-Za-z0-9._-]+/u.test(
      ref
    )
  );
}

function postActionProjectionCarriesRetryContext(input: {
  readonly nextActionProjection: NonNullable<
    SdlcPublicStartOutcome["executionContract"]
  >["nextActionProjection"];
}): boolean {
  return (
    input.nextActionProjection.gapPressureRefs.length > 0 ||
    (input.nextActionProjection.selectedActionRef?.includes(
      "/post_repair_reentry/"
    ) ?? false) ||
    postActionProjectionHasExplicitFeatureScope({
      nextActionProjectionRef: input.nextActionProjection.nextActionProjectionRef,
      selectedActionRef: input.nextActionProjection.selectedActionRef ?? ""
    })
  );
}

const POST_ACTION_GAP_PRESSURE_PREFIX = "pressure://odd-sdlc/post-action/";

function postActionArchiveRefFromGapPressureRef(ref: string): string | null {
  if (!ref.startsWith(POST_ACTION_GAP_PRESSURE_PREFIX)) {
    return null;
  }
  const remainder = ref.slice(POST_ACTION_GAP_PRESSURE_PREFIX.length);
  const separator = remainder.lastIndexOf("/");
  if (separator <= 0) {
    return null;
  }
  const decoded = decodedRefForScope(remainder.slice(0, separator));
  return decoded.startsWith("file://") ? decoded : null;
}

function postActionArchiveRefFromSelectedActionRef(ref: string | null): string | null {
  if (ref === null || !ref.includes("/post_repair_reentry/")) {
    return null;
  }
  const encodedArchiveRef = ref.split("/").at(-1);
  if (encodedArchiveRef === undefined || encodedArchiveRef.length === 0) {
    return null;
  }
  const decoded = decodedArchiveRefForScope(encodedArchiveRef);
  return decoded.startsWith("file://") ? decoded : null;
}

function gapDossierFromPostActionArchiveRef(
  archiveRef: string
): SdlcPostflightGapDossier | null {
  try {
    const archivePath = fileURLToPath(archiveRef);
    const archiveRoot = archivePath.endsWith("/general")
      ? dirname(archivePath)
      : archivePath;
    return readPostflightGapDossierRef(
      pathToFileURL(join(archiveRoot, "gap_dossier.json")).href
    );
  } catch {
    return null;
  }
}

function postActionGapDossiersFromProjection(input: {
  readonly nextActionProjection: NonNullable<
    SdlcPublicStartOutcome["executionContract"]
  >["nextActionProjection"];
}): readonly SdlcPostflightGapDossier[] {
  const byRef = new Map<string, SdlcPostflightGapDossier>();
  const selectedArchiveRef = postActionArchiveRefFromSelectedActionRef(
    input.nextActionProjection.selectedActionRef
  );
  if (selectedArchiveRef !== null) {
    const dossier = gapDossierFromPostActionArchiveRef(selectedArchiveRef);
    if (dossier !== null) {
      byRef.set(dossier.currentGapDossierRef, dossier);
    }
  }
  for (const pressureRef of input.nextActionProjection.gapPressureRefs) {
    const archiveRef = postActionArchiveRefFromGapPressureRef(pressureRef);
    if (archiveRef === null) {
      continue;
    }
    const dossier = gapDossierFromPostActionArchiveRef(archiveRef);
    if (dossier !== null) {
      byRef.set(dossier.currentGapDossierRef, dossier);
    }
  }
  return compactSdlcPriorGapDossiersForRetryContext([...byRef.values()]);
}

export function deriveSdlcWorkerRetryContextFromPostActionProjection(input: {
  readonly nextActionProjection: NonNullable<
    SdlcPublicStartOutcome["executionContract"]
  >["nextActionProjection"];
  readonly vectorIndex: number;
}): SdlcWorkerRetryContext | undefined {
  if (
    input.nextActionProjection.nextActionBasisKind === "initial_selection" ||
    input.nextActionProjection.choosesNextTraversal !== true ||
    input.nextActionProjection.selectedActionRef === null
  ) {
    return undefined;
  }
  if (!postActionProjectionCarriesRetryContext(input)) {
    return undefined;
  }
  const priorGapDossiers = postActionGapDossiersFromProjection({
    nextActionProjection: input.nextActionProjection
  });
  const priorAuthorityRef =
    priorGapDossiers[0]?.currentGapDossierRef ??
    input.nextActionProjection.selectedActionRef;
  return Object.freeze({
    kind: "sdlc_worker_retry_context" as const,
    retryAttemptRefs: Object.freeze([
      Object.freeze({
        vectorIndex: input.vectorIndex,
        retryRunId: "post-action-reentry",
        retryCallId: input.nextActionProjection.nextActionProjectionRef,
        manifestId: input.nextActionProjection.nextActionProjectionRef,
        priorAuthorityRef,
        attemptIndex: 0,
        sourceProjectionRef: input.nextActionProjection.nextActionProjectionRef
      })
    ]),
    priorGapDossiers
  });
}

function mergedRetryContext(input: {
  readonly projected: SdlcWorkerRetryContext;
  readonly override: SdlcWorkerRetryContext | undefined;
  readonly vectorIndex: number;
}): SdlcWorkerRetryContext {
  if (input.override === undefined) {
    return input.projected;
  }
  const overrideAttemptRefs = input.override.retryAttemptRefs.filter(
    (ref) => ref.vectorIndex === input.vectorIndex
  );
  const overrideDossiers = input.override.priorGapDossiers.filter(
    (dossier) =>
      dossier.vectorIndex === input.vectorIndex ||
      dossier.reasons.some(
        (reason) =>
          reason.blockingReason.lawfulReentryPoint === "repair_worker_output"
      )
  );
  if (overrideAttemptRefs.length === 0 && overrideDossiers.length === 0) {
    return input.projected;
  }
  const attemptRefByKey = new Map<
    string,
    SdlcWorkerRetryContext["retryAttemptRefs"][number]
  >();
  for (const ref of [
    ...input.projected.retryAttemptRefs,
    ...overrideAttemptRefs
  ]) {
    attemptRefByKey.set(
      `${ref.vectorIndex}:${ref.priorAuthorityRef}:${ref.attemptIndex}`,
      ref
    );
  }
  const dossierByRef = new Map<string, SdlcPostflightGapDossier>();
  for (const dossier of [
    ...input.projected.priorGapDossiers,
    ...overrideDossiers
  ]) {
    dossierByRef.set(dossier.currentGapDossierRef, dossier);
  }
  return Object.freeze({
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: Object.freeze([...attemptRefByKey.values()]),
    priorGapDossiers: Object.freeze([...dossierByRef.values()])
  });
}

function latestRuntimeGapDossierForRetryContext(input: {
  readonly workspaceRoot: string;
  readonly vectorIndex: number;
  readonly edgeName: string;
  readonly targetAssetType: string;
}): SdlcPostflightGapDossier | null {
  const operatorRunsRoot = join(
    input.workspaceRoot,
    deriveSdlcConformProjectProfileFromWorkspace(input.workspaceRoot).runtimeLayout
      .operatorRunRoot
  );
  if (!existsSync(operatorRunsRoot) || !statSync(operatorRunsRoot).isDirectory()) {
    return null;
  }
  const candidates: SdlcPostflightGapDossier[] = [];
  const runIds = readdirSync(operatorRunsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const runId of runIds) {
    const gapDossierRef = pathToFileURL(
      join(operatorRunsRoot, runId, "gap_dossier.json")
    ).href;
    const dossier = readPostflightGapDossierRef(gapDossierRef);
    if (
      dossier !== null &&
      dossier.vectorIndex === input.vectorIndex &&
      dossier.edgeName === input.edgeName &&
      dossier.targetAssetType === input.targetAssetType
    ) {
      candidates.push(dossier);
    }
  }
  return preferredWorkerFacingGapDossierForRetryContext(candidates) ?? null;
}

function retryContextCarriesGapAuthority(
  retryContext: SdlcWorkerRetryContext
): boolean {
  return (
    retryContext.priorGapDossiers.length > 0 ||
    retryContext.retryAttemptRefs.some((ref) => {
      const priorAuthorityRef = decodedArchiveRefForScope(ref.priorAuthorityRef);
      return (
        priorAuthorityRef.startsWith("closure-gap-dossier://") ||
        priorAuthorityRef.startsWith("gap-dossier://") ||
        priorAuthorityRef.startsWith("gap://") ||
        /(?:^|\/)gap_dossier\.json(?:$|[?#])/u.test(priorAuthorityRef)
      );
    })
  );
}

export function mergeSdlcWorkerRetryContextWithRuntimeGapRegister(input: {
  readonly projected: SdlcWorkerRetryContext;
  readonly workspaceRoot: string;
  readonly vectorIndex: number;
  readonly edgeName: string;
  readonly targetAssetType: string;
}): SdlcWorkerRetryContext {
  if (!retryContextCarriesGapAuthority(input.projected)) {
    return input.projected;
  }
  const latestGapDossier = latestRuntimeGapDossierForRetryContext(input);
  if (latestGapDossier === null) {
    return input.projected;
  }
  if (
    input.projected.priorGapDossiers.some((dossier) =>
      dossier.reasons.some(
        (reason) =>
          reason.blockingReason.lawfulReentryPoint === "repair_worker_output"
      )
    )
  ) {
    return input.projected;
  }
  const dossierByRef = new Map<string, SdlcPostflightGapDossier>();
  for (const dossier of [
    ...input.projected.priorGapDossiers,
    latestGapDossier
  ]) {
    dossierByRef.set(dossier.currentGapDossierRef, dossier);
  }
  return Object.freeze({
    ...input.projected,
    priorGapDossiers: compactSdlcPriorGapDossiersForRetryContext([
      ...dossierByRef.values()
    ])
  });
}

function vectorIndexByEdgeName(input: {
  readonly basis: ExecutionBasis;
  readonly edgeName: string;
}): number | null {
  const index = input.basis.graph.vectors.findIndex(
    (vector) => vector.name === input.edgeName
  );
  return index < 0 ? null : index;
}

interface GraphContinuationReplayCursor {
  readonly replayEvents: readonly RuntimeEvent[];
  readonly cursorEvents: readonly RuntimeEvent[];
}

function replayEventVectorClosureKey(
  event: RuntimeEvent
): string | null {
  if (event.kind !== "vector_closed") {
    return null;
  }
  return JSON.stringify({
    basisId: event.basisId,
    graphCallId: event.graphCallId,
    frameId: event.frameId,
    vectorIndex: event.vectorIndex,
    edge: event.edge
  });
}

function replayEventsWithoutDuplicateVectorClosures(
  replayEvents: readonly RuntimeEvent[]
): readonly RuntimeEvent[] {
  const seen = new Set<string>();
  const filtered: RuntimeEvent[] = [];
  for (const event of replayEvents) {
    const key = replayEventVectorClosureKey(event);
    if (key !== null) {
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
    }
    filtered.push(event);
  }
  return filtered.length === replayEvents.length
    ? replayEvents
    : Object.freeze(filtered);
}

function replayEventsWithGraphContinuationCursor(input: {
  readonly basis: ExecutionBasis;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly nextGraphVectorRef: string | null;
}): GraphContinuationReplayCursor {
  const replayEvents = replayEventsWithoutDuplicateVectorClosures(input.replayEvents);
  if (input.nextGraphVectorRef === null) {
    return Object.freeze({
      replayEvents,
      cursorEvents: Object.freeze([])
    });
  }
  const targetIndex = vectorIndexByEdgeName({
    basis: input.basis,
    edgeName: input.nextGraphVectorRef
  });
  if (targetIndex === null || targetIndex <= 0) {
    return Object.freeze({
      replayEvents,
      cursorEvents: Object.freeze([])
    });
  }
  const closedIndexes = new Set<number>();
  try {
    for (const vectorIndex of deriveRuntimeAggregateProjection(
      input.basis,
      replayEvents
    ).closedVectorIndexes) {
      closedIndexes.add(vectorIndex);
    }
  } catch {
    for (const event of replayEvents) {
      if (event.kind !== "vector_closed") {
        continue;
      }
      const vectorIndex = Reflect.get(event, "vectorIndex");
      if (
        typeof vectorIndex === "number" &&
        (event.basisId === input.basis.id ||
          input.basis.graph.vectors[vectorIndex]?.name === event.edge)
      ) {
        closedIndexes.add(vectorIndex);
      }
    }
  }
  const cursorEvents: RuntimeEvent[] = [];
  for (let vectorIndex = 0; vectorIndex < targetIndex; vectorIndex += 1) {
    if (closedIndexes.has(vectorIndex)) {
      continue;
    }
    cursorEvents.push(
      constructVectorTraversalPlannedEvent({
        basis: input.basis,
        vectorIndex
      }),
      constructVectorEvaluatedEvent({
        basis: input.basis,
        vectorIndex,
        status: "accepted"
      }),
      constructVectorClosedEvent({
        basis: input.basis,
        vectorIndex,
        closureKind: "advanced"
      })
    );
  }
  return Object.freeze({
    replayEvents:
      cursorEvents.length === 0
        ? replayEvents
        : replayEventsWithoutDuplicateVectorClosures(
            Object.freeze([...replayEvents, ...cursorEvents])
          ),
    cursorEvents: Object.freeze(cursorEvents)
  });
}

function vectorNodeRefFor(input: {
  readonly basis: ExecutionBasis;
  readonly vectorIndex: number;
  readonly role: "source" | "target";
}): string {
  const vector = input.basis.graph.vectors[input.vectorIndex];
  if (vector === undefined) {
    throw new TypeError(`missing vector ${input.vectorIndex}`);
  }
  const node = input.role === "source" ? vector.source[0] : vector.target;
  if (node === undefined) {
    throw new TypeError(`missing ${input.role} node for vector ${input.vectorIndex}`);
  }
  return node.id;
}

function vectorRangeInclusive(start: number, end: number): readonly number[] {
  const indexes: number[] = [];
  for (let index = start; index <= end; index += 1) {
    indexes.push(index);
  }
  return Object.freeze(indexes);
}

function graphSpanRefForOperatorReentry(input: {
  readonly basis: ExecutionBasis;
  readonly sourceVectorIndex: number;
  readonly terminalVectorIndex: number;
  readonly scope: string;
}) {
  return Object.freeze({
    kind: "graph_span_ref" as const,
    spanId:
      `graph-span:odd-sdlc-${input.scope}:${input.basis.id}:` +
      `${input.sourceVectorIndex}->${input.terminalVectorIndex}`,
    basisId: input.basis.id,
    graphFunctionId: input.basis.graphFunction.id,
    sourceVectorIndex: input.sourceVectorIndex,
    terminalVectorIndex: input.terminalVectorIndex,
    sourceNodeRef: vectorNodeRefFor({
      basis: input.basis,
      vectorIndex: input.sourceVectorIndex,
      role: "source"
    }),
    terminalNodeRef: vectorNodeRefFor({
      basis: input.basis,
      vectorIndex: input.terminalVectorIndex,
      role: "target"
    }),
    coveredVectorIndexes: vectorRangeInclusive(
      input.sourceVectorIndex,
      input.terminalVectorIndex
    )
  });
}

function graphReentryPlanRuntimeEventsForSpanEvents(input: {
  readonly basis: ExecutionBasis;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly emittedEvents: readonly RuntimeEvent[];
  readonly spanEvents: readonly RuntimeEvent[];
  readonly causationEventRefs: readonly string[];
}): readonly RuntimeEvent[] {
  const events = Object.freeze([
    ...input.replayEvents,
    ...input.emittedEvents,
    ...input.spanEvents
  ]);
  const frontier = deriveGraphReentryFrontierProjection({
    basis: input.basis,
    events
  });
  const plan = deriveGraphReentryPlan({
    basis: input.basis,
    runtimeProjection: deriveRuntimeAggregateProjection(input.basis, events),
    frontier
  });
  if (plan === null) {
    return Object.freeze([]);
  }
  return Object.freeze([
    constructGraphReentryPlannedEvent({
      basis: input.basis,
      plan,
      causationEventRefs: input.causationEventRefs
    }),
    constructGraphReentryAppliedEvent({
      basis: input.basis,
      plan,
      causationEventRefs: Object.freeze([plan.planRef])
    })
  ]);
}

function repairReentryGraphSpanRuntimeEvents(input: {
  readonly basis: ExecutionBasis;
  readonly outcome: SdlcAbgOwnedFpDispatchState;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly emittedEvents: readonly RuntimeEvent[];
}): readonly RuntimeEvent[] {
  const dossier = input.outcome.gapDossier;
  if (
    dossier === null ||
    blockingReasonRefsForReentry({
      state: input.outcome,
      lawfulReentryPoint: "repair_worker_output"
    }).length === 0
  ) {
    return Object.freeze([]);
  }
  const plans = componentRepairReentryPlansForGapDossier({
    manifest: input.outcome.manifest,
    dossier
  });
  const targetedPlans = plans
    .map((plan) =>
      Object.freeze({
        plan,
        targetVectorIndex: vectorIndexByEdgeName({
          basis: input.basis,
          edgeName: plan.targetEdgeName
        })
      })
    )
    .filter(
      (
        entry
      ): entry is {
        readonly plan: (typeof plans)[number];
        readonly targetVectorIndex: number;
      } => entry.targetVectorIndex !== null
    );
  if (targetedPlans.length === 0) {
    return Object.freeze([]);
  }
  const terminalVectorIndex = input.outcome.manifest.vectorIndex;
  const targetVectorIndex = Math.min(
    ...targetedPlans.map((entry) => entry.targetVectorIndex)
  );
  if (targetVectorIndex > terminalVectorIndex) {
    return Object.freeze([]);
  }
  const generation =
    input.replayEvents.filter((event) => event.kind === "graph_span_foldback_evaluated")
      .length + 1;
  const span = graphSpanRefForOperatorReentry({
    basis: input.basis,
    sourceVectorIndex: targetVectorIndex,
    terminalVectorIndex,
    scope: "repair"
  });
  const schedule = Object.freeze({
    kind: "graph_span_evaluation_schedule" as const,
    scheduleRef: `graph-span-schedule:odd-sdlc-repair:${JSON.stringify({
      basisId: input.basis.id,
      sourceVectorIndex: targetVectorIndex,
      terminalVectorIndex,
      gapDossierRef: dossier.currentGapDossierRef,
      generation
    })}`,
    basisId: input.basis.id,
    graphFunctionId: input.basis.graphFunction.id,
    terminalVectorIndex,
    spanRefs: Object.freeze([span]),
    generation
  });
  const evidenceRefs = uniqueSorted([
    dossier.currentGapDossierRef,
    ...dossier.evidenceRefs,
    ...targetedPlans.flatMap((entry) => [
      entry.plan.sourceGapDossierRef,
      ...entry.plan.diagnosticEvidenceRefs,
      ...entry.plan.repairRowEvidenceRefs
    ])
  ]);
  const assessment = admitGraphSpanAssessment({
    basis: input.basis,
    span,
    assessmentId: `graph-span-assessment:odd-sdlc-repair:${JSON.stringify({
      basisId: input.basis.id,
      targetVectorIndex,
      terminalVectorIndex,
      failures: targetedPlans.map((entry) => entry.plan.failureId).sort(),
      generation
    })}`,
    attemptIndex: 0,
    assessmentRegime: "F_P",
    obligationRows: targetedPlans.map((entry) =>
      Object.freeze({
        obligationId: `component-repair-reentry:${entry.plan.failureId}`,
        sourceAuthorityRef: entry.plan.sourceGapDossierRef,
        status: "semantic_gap" as const,
        terminalEvidenceRefs: Object.freeze([]),
        carryObservations: Object.freeze([
          Object.freeze({
            fromVectorIndex: entry.targetVectorIndex,
            toVectorIndex: terminalVectorIndex,
            status: "dropped" as const,
            evidenceRefs
          })
        ]),
        detail: `component repair row ${entry.plan.failureId} targets ${entry.plan.targetEdgeName}`
      })
    ),
    constitutionalReentry: null,
    evidenceRefs,
    edgeFoldbackRefs: Object.freeze([]),
    detail: "odd_sdlc component repair schedule requires graph-span repair reentry",
    generation
  });
  const foldback = foldGraphSpanAssessments({
    basis: input.basis,
    terminalVectorIndex,
    schedule,
    assessments: Object.freeze([assessment]),
    generation
  });
  const spanEvents = Object.freeze([
    constructGraphSpanEvaluationScheduledEvent({
      basis: input.basis,
      schedule,
      causationEventRefs: Object.freeze([dossier.currentGapDossierRef])
    }),
    constructGraphSpanAssessedEvent({
      basis: input.basis,
      assessment,
      causationEventRefs: evidenceRefs
    }),
    constructGraphSpanFoldbackEvaluatedEvent({
      basis: input.basis,
      foldback,
      causationEventRefs: Object.freeze([assessment.assessmentId])
    })
  ]);
  return Object.freeze([
    ...spanEvents,
    ...graphReentryPlanRuntimeEventsForSpanEvents({
      basis: input.basis,
      replayEvents: input.replayEvents,
      emittedEvents: input.emittedEvents,
      spanEvents,
      causationEventRefs: evidenceRefs
    })
  ]);
}

function postActionReentryGraphSpanRuntimeEvents(input: {
  readonly basis: ExecutionBasis;
  readonly consequence: SdlcInstalledOperatorTraversalConsequence;
  readonly currentVectorIndex: number;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly emittedEvents: readonly RuntimeEvent[];
}): readonly RuntimeEvent[] {
  const closure = input.consequence.edgeClosureDecision;
  const nextAction = input.consequence.nextActionProjection;
  if (
    !["retry", "repair", "re-enter"].includes(closure.disposition) ||
    !nextAction.choosesNextTraversal ||
    nextAction.nextGraphVectorRef === null
  ) {
    return Object.freeze([]);
  }
  const targetVectorIndex = vectorIndexByEdgeName({
    basis: input.basis,
    edgeName: nextAction.nextGraphVectorRef
  });
  if (targetVectorIndex === null || targetVectorIndex > input.currentVectorIndex) {
    return Object.freeze([]);
  }
  const generation =
    [...input.replayEvents, ...input.emittedEvents].filter(
      (event) => event.kind === "graph_span_foldback_evaluated"
    ).length + 1;
  const span = graphSpanRefForOperatorReentry({
    basis: input.basis,
    sourceVectorIndex: targetVectorIndex,
    terminalVectorIndex: input.currentVectorIndex,
    scope: "post-action"
  });
  const evidenceRefs = uniqueSorted([
    closure.decisionRef,
    nextAction.nextActionProjectionRef,
    ...closure.reasonRefs,
    ...nextAction.gapPressureRefs
  ]);
  const schedule = Object.freeze({
    kind: "graph_span_evaluation_schedule" as const,
    scheduleRef: `graph-span-schedule:odd-sdlc-post-action:${JSON.stringify({
      basisId: input.basis.id,
      targetVectorIndex,
      terminalVectorIndex: input.currentVectorIndex,
      closureDecisionRef: closure.decisionRef,
      generation
    })}`,
    basisId: input.basis.id,
    graphFunctionId: input.basis.graphFunction.id,
    terminalVectorIndex: input.currentVectorIndex,
    spanRefs: Object.freeze([span]),
    generation
  });
  const obligationRef =
    evidenceRefs[0] ?? `post-action-reentry:${closure.disposition}`;
  const assessment = admitGraphSpanAssessment({
    basis: input.basis,
    span,
    assessmentId: `graph-span-assessment:odd-sdlc-post-action:${JSON.stringify({
      basisId: input.basis.id,
      targetVectorIndex,
      terminalVectorIndex: input.currentVectorIndex,
      disposition: closure.disposition,
      generation
    })}`,
    attemptIndex: 0,
    assessmentRegime: "F_P",
    obligationRows: Object.freeze([
      Object.freeze({
        obligationId: `post-action-reentry:${closure.disposition}:${obligationRef}`,
        sourceAuthorityRef: closure.decisionRef,
        status: "semantic_gap" as const,
        terminalEvidenceRefs: Object.freeze([]),
        carryObservations: Object.freeze([
          Object.freeze({
            fromVectorIndex: targetVectorIndex,
            toVectorIndex: input.currentVectorIndex,
            status: "dropped" as const,
            evidenceRefs
          })
        ]),
        detail:
          `${closure.disposition} closure selected ${nextAction.nextGraphVectorRef}`
      })
    ]),
    constitutionalReentry: null,
    evidenceRefs,
    edgeFoldbackRefs: Object.freeze([]),
    detail: "odd_sdlc post-action closure requires graph reentry",
    generation
  });
  const foldback = foldGraphSpanAssessments({
    basis: input.basis,
    terminalVectorIndex: input.currentVectorIndex,
    schedule,
    assessments: Object.freeze([assessment]),
    generation
  });
  const spanEvents = Object.freeze([
    constructGraphSpanEvaluationScheduledEvent({
      basis: input.basis,
      schedule,
      causationEventRefs: Object.freeze([closure.decisionRef])
    }),
    constructGraphSpanAssessedEvent({
      basis: input.basis,
      assessment,
      causationEventRefs: evidenceRefs
    }),
    constructGraphSpanFoldbackEvaluatedEvent({
      basis: input.basis,
      foldback,
      causationEventRefs: Object.freeze([assessment.assessmentId])
    })
  ]);
  return Object.freeze([
    ...spanEvents,
    ...graphReentryPlanRuntimeEventsForSpanEvents({
      basis: input.basis,
      replayEvents: input.replayEvents,
      emittedEvents: input.emittedEvents,
      spanEvents,
      causationEventRefs: evidenceRefs
    })
  ]);
}

function fpDispatchPluginContract() {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/fp-dispatch",
    pluginKind: "fp_dispatch",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "FpDispatchOutcome",
    computeStageRole: "transform",
    computeMeans: "F_P",
    computeStagePurpose: "candidate_construction"
  });
}

function fpEvaluatorPluginContract() {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/fp-evaluator",
    pluginKind: "fp_evaluator",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "FpEvaluationOutcome",
    computeStageRole: "evaluate",
    computeMeans: "F_P",
    computeStagePurpose: "candidate_evaluation"
  });
}

const DESIGN_DEPTH_FP_EVALUATOR_RULE_REF =
  "evaluation-rule://odd-sdlc/design-depth-register/fp";
const DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE =
  "design_depth_fp_evaluator_rule_outcome.json";

function designDepthFpEvaluatorRuleContract() {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/design-depth-fp-evaluator-register",
    pluginKind: "fp_evaluator",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "SdlcDesignDepthRegister",
    computeStageRole: "evaluate",
    computeMeans: "F_P",
    computeStagePurpose: "candidate_evaluation"
  });
}

function reviewGradeEdgeFulfillmentRuleContract() {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/review-grade-edge-fulfillment",
    pluginKind: "fp_evaluator",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "SdlcReviewGradeEdgeFulfillmentAssessment",
    computeStageRole: "evaluate",
    computeMeans: "F_P",
    computeStagePurpose: "candidate_evaluation"
  });
}

function consequenceProjectionPluginContract() {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/consequence-projection",
    pluginKind: "consequence_projection",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "ConsequenceProjectionOutcome",
    computeStageRole: "consequence",
    computeMeans: "F_D",
    computeStagePurpose: "consequence_projection"
  });
}

function dispatchResultRef(manifest: SdlcWorkerHandoffManifest): string {
  return pathToFileURL(manifest.reportFile).href;
}

function runtimeFailureArtifact(input: {
  readonly failureClass: RuntimeFailureClass;
  readonly detail: string;
}): Readonly<Record<string, unknown>> {
  return Object.freeze({
    kind: "runtime_failure",
    failureClass: input.failureClass,
    detail: input.detail
  });
}

function writeInstalledOperatorNoDispatchArtifact(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly edgeAccountingRow: SdlcExecutiveEdgeAccountingRow;
}): string {
  const content = [
    `# ${input.manifest.targetAssetType}`,
    "",
    `graph_function: ${input.manifest.graphFunctionName}`,
    `edge: ${input.manifest.edgeName}`,
    "source_function: installed_operator.deterministic_edge",
    "worker_dispatch_allowed: false",
    `edge_accounting_disposition: ${input.edgeAccountingRow.disposition}`,
    `edge_accounting_rationale: ${input.edgeAccountingRow.rationale}`,
    "",
    "## Authority Outputs",
    "",
    ...input.edgeAccountingRow.authorityOutputRefs.map((ref) => `- ${ref}`),
    "",
    "## Closure Evidence",
    "",
    ...(input.edgeAccountingRow.closureEvidenceRefs.length === 0
      ? ["- projection/no-close"]
      : input.edgeAccountingRow.closureEvidenceRefs.map((ref) => `- ${ref}`)),
    "",
    "## Source Authority",
    "",
    ...input.manifest.traversalObligationContext.authorityRefs.map((ref) => `- ${ref}`)
  ].join("\n");
  mkdirSync(dirname(input.manifest.outputFile), { recursive: true });
  writeFileSync(input.manifest.outputFile, content, "utf8");
  return input.manifest.outputFile;
}

function noDispatchReport(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): SdlcWorkerResultReport {
  return Object.freeze({
    ...input.report,
    summary:
      "framework-generated deterministic no-dispatch report from observed artifacts",
    fpTransformRequestRef: null,
    fpTransformResultRef: null,
    fpTransformStatusSnapshot: null
  });
}

function manifestCapabilityValue(
  manifest: SdlcWorkerHandoffManifest,
  name: string
): string | null {
  return (
    manifest.conformedProject.capabilityContracts.find(
      (contract) => contract.name === name
    )?.value ?? null
  );
}

function truthyCapabilityValue(value: string | null): boolean {
  const normalized = value?.trim().toLowerCase() ?? "";
  return (
    normalized === "1" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

function traversalOutcomeClassForManifest(
  manifest: SdlcWorkerHandoffManifest
): SdlcTraversalOutcomeClass {
  return resolveSdlcTraversalOutcomeClass({
    explicitValue: manifestCapabilityValue(manifest, "sdlc_outcome_class"),
    trivialProduct: truthyCapabilityValue(
      manifestCapabilityValue(manifest, "trivial_product")
    )
  }).outcomeClass;
}

function canonicalSummaryForManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly carriers: ReturnType<typeof deriveSdlcStagedConstructionAuditCarriers>;
}): SdlcDecompositionSummary | null {
  const summaries = input.carriers
    .filter(
      (carrier): carrier is {
        readonly artifactRef: string;
        readonly relativePath: string;
        readonly payload: SdlcDecompositionSummary;
      } => carrier.payload.kind === "sdlc_decomposition_summary"
    );
  const preferTest =
    input.manifest.targetAssetType.includes("test") ||
    input.manifest.targetCarrierProjection.requiredStagedAuthorityRefs.some((ref) =>
      ref.includes("test")
    );
  const preferred = summaries.find((carrier) =>
    preferTest
      ? carrier.artifactRef === "operator-run-artifact://test-decomposition-summary"
      : carrier.artifactRef ===
        "operator-run-artifact://implementation-decomposition-summary"
  );
  return preferred?.payload ?? summaries[0]?.payload ?? null;
}

function traversalAuditRoutingDecision(
  selection: SdlcTraversalHopSelection
): "continue" | "block" | "preserve_pressure" | "route_to_fp" {
  if (selection.hopClass === "blocked") {
    return "block";
  }
  if (
    selection.hopClass === "zoom_required" ||
    selection.pressurePreservation.mechanism !== "none"
  ) {
    return "preserve_pressure";
  }
  return "continue";
}

type LiveParallelLaneKind = "dev" | "test";

interface LiveParallelMaterializationLane {
  readonly laneKind: "dev";
  readonly branchKey: string;
  readonly node: SdlcDependencyMapNode;
  readonly targetRef: string;
  readonly normalizedTargetRef: string;
}

function sdlcLiveSlug(input: string): string {
  return (
    input
      .trim()
      .replace(/[^A-Za-z0-9]+/gu, "-")
      .replace(/^-+|-+$/gu, "")
      .toLowerCase() || "unnamed"
  );
}

function normalizedLiveMaterializationTarget(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly targetRef: string;
}): string {
  return normalizeSdlcLiveFpParallelMaterializationTarget({
    targetRef: input.targetRef,
    selectedOutputRoot: input.manifest.productMaterialization.selectedOutputRoot,
    tenantRoot: input.manifest.productMaterialization.tenantRoot
  });
}

function liveParallelModuleLaneKind(targetRef: string): "dev" | null {
  return classifySdlcLiveParallelModuleLane(targetRef);
}

function liveParallelLaneForNode(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly node: SdlcDependencyMapNode;
}): LiveParallelMaterializationLane | null {
  for (const targetRef of input.node.materializationTargetRefs) {
    const normalizedTargetRef = normalizedLiveMaterializationTarget({
      manifest: input.manifest,
      targetRef
    });
    const laneKind = liveParallelModuleLaneKind(normalizedTargetRef);
    if (laneKind === null) {
      continue;
    }
    return Object.freeze({
      laneKind,
      branchKey: `${laneKind}-${sdlcLiveSlug(
        sdlcLiveParallelMaterializationTargetKey(normalizedTargetRef)
      )}`,
      node: input.node,
      targetRef,
      normalizedTargetRef
    });
  }
  return null;
}

function liveParallelWorkerProcessRef(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly branchKey: string;
}): string {
  return `abg-native-branch-task://odd-sdlc/live/${manifestRefSegment(input.manifest)}/${input.branchKey}`;
}

function liveParallelFrontierRef(manifest: SdlcWorkerHandoffManifest): string {
  return `frontier://odd-sdlc/live/${manifestRefSegment(manifest)}/parallel-materialization`;
}

function liveParallelFanInScopeRef(manifest: SdlcWorkerHandoffManifest): string {
  return `fan-in://odd-sdlc/live/${manifestRefSegment(manifest)}/parallel-materialization`;
}

function moduleDependencyMapFromAuditCarriers(
  carriers: readonly SdlcStagedConstructionAuditCarrier[]
): SdlcModuleDependencyMap | null {
  const carrier = carriers.find(
    (candidate) => candidate.artifactRef === "operator-run-artifact://module-dependency-map"
  );
  return carrier?.payload.kind === "sdlc_module_dependency_map"
    ? carrier.payload
    : null;
}

function moduleTraversalSelectionFromAuditCarriers(
  carriers: readonly SdlcStagedConstructionAuditCarrier[]
): SdlcDependencyTraversalSelection | null {
  const carrier = carriers.find(
    (candidate) =>
      candidate.artifactRef ===
      "operator-run-artifact://module-dependency-traversal-selection"
  );
  return carrier?.payload.kind === "sdlc_dependency_traversal_selection"
    ? carrier.payload
    : null;
}

function testDependencyMapFromAuditCarriers(
  carriers: readonly SdlcStagedConstructionAuditCarrier[]
): SdlcTestDependencyMap | null {
  const carrier = carriers.find(
    (candidate) => candidate.artifactRef === "operator-run-artifact://test-dependency-map"
  );
  return carrier?.payload.kind === "sdlc_test_dependency_map"
    ? carrier.payload
    : null;
}

function testTraversalSelectionFromAuditCarriers(
  carriers: readonly SdlcStagedConstructionAuditCarrier[]
): SdlcDependencyTraversalSelection | null {
  const carrier = carriers.find(
    (candidate) =>
      candidate.artifactRef ===
      "operator-run-artifact://test-dependency-traversal-selection"
  );
  return carrier?.payload.kind === "sdlc_dependency_traversal_selection"
    ? carrier.payload
    : null;
}

function liveParallelNodeTargetRefs(
  node: SdlcFeatureDependencyDag["nodes"][number]
): readonly string[] {
  return uniqueSorted(
    node.targetAssetRefs.length > 0
      ? node.targetAssetRefs
      : node.outputAllocationRefs.map((ref) => ref.replace(/^artifact:\/\//u, ""))
  );
}

function liveParallelFrontierDependencyMap(input: {
  readonly source: SdlcModuleDependencyMap;
  readonly lanes: readonly LiveParallelMaterializationLane[];
}): SdlcModuleDependencyMap {
  const laneIds = new Set(input.lanes.map((lane) => lane.node.nodeId));
  const sourceIds = new Set(input.source.nodes.map((node) => node.nodeId));
  const preserveLaneOrMalformedRef = (nodeId: string): boolean =>
    laneIds.has(nodeId) || !sourceIds.has(nodeId);
  return Object.freeze({
    ...input.source,
    nodes: Object.freeze(
      input.lanes.map((lane) =>
        Object.freeze({
          ...lane.node,
          predecessorNodeIds: Object.freeze(
            lane.node.predecessorNodeIds.filter(preserveLaneOrMalformedRef)
          ),
          successorNodeIds: Object.freeze(
            lane.node.successorNodeIds.filter(preserveLaneOrMalformedRef)
          )
        })
      )
    )
  });
}

function liveParallelBranchRowsFromCompilation(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly dag: SdlcFeatureDependencyDag;
  readonly compilation: SdlcAbgFrontierCompilation;
}): readonly SdlcLiveFpParallelMaterializationBranchRow[] {
  return input.dag.nodes.flatMap((node, index) => {
    if (node.nodeKind === "fan_in") {
      return [];
    }
    const branchRef = input.compilation.branchRefs[index];
    if (branchRef === undefined) {
      return [];
    }
    const targetRefs = liveParallelNodeTargetRefs(node);
    const laneKind: LiveParallelLaneKind =
      node.nodeKind === "test_materialization" ? "test" : "dev";
    return Object.freeze({
      branchRef: branchRef.branchRef,
      branchKey: branchRef.branchKey,
      nodeId: node.nodeRef,
      laneKind,
      workerProcessRef: liveParallelWorkerProcessRef({
        manifest: input.manifest,
        branchKey: branchRef.branchKey
      }),
      materializationTargetRefs: targetRefs,
      readRefs: node.readRefs,
      writeTerritoryRefs: node.writeTerritoryRefs,
      outputAllocationRefs: node.outputAllocationRefs
    });
  });
}

function liveParallelFanInRowsFromCompilation(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly dag: SdlcFeatureDependencyDag;
  readonly compilation: SdlcAbgFrontierCompilation;
}): readonly SdlcLiveFpParallelMaterializationFanInRow[] {
  const branchByNodeRef = new Map(
    input.dag.nodes.flatMap((node, index) => {
      const branchRef = input.compilation.branchRefs[index];
      return branchRef === undefined
        ? []
        : [[node.nodeRef, branchRef] as const];
    })
  );
  return input.dag.nodes.flatMap((node) => {
    if (node.nodeKind !== "fan_in") {
      return [];
    }
    const branchRef = branchByNodeRef.get(node.nodeRef);
    if (branchRef === undefined) {
      return [];
    }
    const declaration = input.compilation.declarations.find(
      (candidate) => candidate.branchRef.branchRef === branchRef.branchRef
    );
    return [
      Object.freeze({
        branchRef: branchRef.branchRef,
        nodeId: node.nodeRef,
        predecessorBranchRefs: declaration?.parentBranchRefs ?? Object.freeze([]),
        materializationTargetRefs: liveParallelNodeTargetRefs(node),
        payloadDigest: `payload://odd-sdlc/live/${sdlcLiveSlug(input.manifest.edgeName)}/fan-in`
      })
    ];
  });
}

function liveParallelTask(input: {
  readonly declaration: SdlcAbgFrontierCompilation["declarations"][number];
  readonly payloadDigest: string;
  readonly counters: { active: number; maxActive: number };
}): NativeBranchTask {
  return Object.freeze({
    kind: "native_branch_task" as const,
    branchRef: input.declaration.branchRef.branchRef,
    run: async () => {
      input.counters.active += 1;
      input.counters.maxActive = Math.max(input.counters.maxActive, input.counters.active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      input.counters.active -= 1;
      return Object.freeze({
        kind: "native_branch_task_result" as const,
        branchRef: input.declaration.branchRef.branchRef,
        payloadDigest: input.payloadDigest,
        evidenceRefs: Object.freeze([input.declaration.branchRef.branchRef])
      });
    }
  });
}

async function writeLiveFpParallelMaterializationFrontier(input: {
  readonly basis: ExecutionBasis;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly carriers: readonly SdlcStagedConstructionAuditCarrier[];
  readonly eventSink: (event: RuntimeEvent) => void;
}): Promise<void> {
  if (input.manifest.edgeName !== "derive_component_code_surface") {
    return;
  }
  const dependencyMap = moduleDependencyMapFromAuditCarriers(input.carriers);
  const traversal = moduleTraversalSelectionFromAuditCarriers(input.carriers);
  const testDependencyMap = testDependencyMapFromAuditCarriers(input.carriers);
  const testTraversal = testTraversalSelectionFromAuditCarriers(input.carriers);
  if (
    dependencyMap === null ||
    traversal === null ||
    traversal.selectedMethod !== "parallel"
  ) {
    return;
  }
  const selectedTestDependencyMap =
    testDependencyMap !== null && testTraversal?.selectedMethod === "parallel"
      ? testDependencyMap
      : undefined;
  const lanes = dependencyMap.nodes
    .map((node) => liveParallelLaneForNode({ manifest: input.manifest, node }))
    .filter((lane) => lane !== null);
  const devLaneCount = lanes.length;
  const testLaneCount = selectedTestDependencyMap?.nodes.length ?? 0;
  const laneCount = devLaneCount + testLaneCount;
  if (laneCount < 2) {
    return;
  }
  const frontierDependencyMap = liveParallelFrontierDependencyMap({
    source: dependencyMap,
    lanes
  });
  const fanInNodes = dependencyMap.nodes.filter((node) =>
    node.materializationTargetRefs.some((targetRef) =>
      /^src\/index\.[cm]?[jt]sx?$/u.test(
        normalizedLiveMaterializationTarget({
          manifest: input.manifest,
          targetRef
        })
      )
    )
  );
  const dag = deriveSdlcFeatureDependencyDagFromMaps({
    dagRef: `dag://odd-sdlc/live/${manifestRefSegment(input.manifest)}/parallel-materialization`,
    graphFunctionName: input.manifest.graphFunctionName,
    moduleDependencyMap: frontierDependencyMap,
    testDependencyMap: selectedTestDependencyMap,
    traversalSelectionRef: traversal.selectionRef,
    fanInTargetRefs: uniqueSorted(
      fanInNodes.flatMap((node) => node.materializationTargetRefs)
    ),
    evidenceRefs: Object.freeze([
      dependencyMap.mapRef,
      traversal.selectionRef,
      ...(selectedTestDependencyMap === undefined
        ? []
        : [
            selectedTestDependencyMap.mapRef,
            ...(testTraversal === null ? [] : [testTraversal.selectionRef])
          ])
    ])
  });
  if (dag.blockingReasons.length > 0 || dag.startNodes.length < 2) {
    return;
  }
  const branchOverrides = deriveSdlcLiveFpParallelMaterializationBranchOverrides({
    edgeName: input.manifest.edgeName,
    selectedOutputRoot: input.manifest.productMaterialization.selectedOutputRoot,
    tenantRoot: input.manifest.productMaterialization.tenantRoot,
    dag
  });
  const compilation = compileSdlcFeatureDependencyDagToAbgFrontier({
    dag,
    frontierRef: liveParallelFrontierRef(input.manifest),
    graphCallId: `graph-call://odd-sdlc/live/${manifestRefSegment(input.manifest)}/parallel-materialization`,
    frameId:
      input.basis.frameId ??
      `frame://odd-sdlc/live/${manifestRefSegment(input.manifest)}/parallel-materialization`,
    fanInScopeRef: liveParallelFanInScopeRef(input.manifest),
    basisId: input.basis.id,
    graphFunctionId: input.basis.graphFunction.id,
    frameLineageId: input.basis.frameLineageId,
    frameAttemptId: null,
    commandKind: `materialize_live_parallel_sdlc_branch:${input.manifest.edgeName}`,
    workKeyPrefix: `work://odd-sdlc/live/${manifestRefSegment(input.manifest)}`,
    basisRefs: Object.freeze([
      dependencyMap.mapRef,
      traversal.selectionRef,
      ...(selectedTestDependencyMap === undefined
        ? []
        : [
            selectedTestDependencyMap.mapRef,
            ...(testTraversal === null ? [] : [testTraversal.selectionRef])
          ])
    ]),
    branchKeyByNodeRef: branchOverrides.branchKeyByNodeRef,
    branchRefByNodeRef: branchOverrides.branchRefByNodeRef
  });
  if (
    compilation.writeTerritoryConflictRefs.length > 0 ||
    compilation.outputAllocationConflictRefs.length > 0
  ) {
    return;
  }
  const branchRows = liveParallelBranchRowsFromCompilation({
    manifest: input.manifest,
    dag,
    compilation
  });
  const fanInRows = liveParallelFanInRowsFromCompilation({
    manifest: input.manifest,
    dag,
    compilation
  });
  const declarations = compilation.declarations;
  const counters = { active: 0, maxActive: 0 };
  const emittedEvents: RuntimeEvent[] = [];
  const parallelBatchSize = resolveSdlcLiveFpParallelBatchSize({ laneCount });
  const run = await runEventedNativeSagaFrontier({
    basis: input.basis,
    frontierRef: liveParallelFrontierRef(input.manifest),
    declarations,
    policy: constructBranchExecutionPolicy({
      policyRef: `policy://odd-sdlc/live/${manifestRefSegment(input.manifest)}/parallel-materialization/max-${parallelBatchSize}`,
      maxConcurrency: parallelBatchSize,
      maxRetryAttempts: 0,
      leaseTtlMs: 10_000,
      resolvedSystemPolicyRefs: Object.freeze([
        "abg://event-sourced-saga-frontier",
        traversal.selectionRef
      ])
    }),
    tasks: declarations.map((declaration) => {
      const fanInPayloadDigest =
        fanInRows.find((row) => row.branchRef === declaration.branchRef.branchRef)
          ?.payloadDigest;
      return liveParallelTask({
        declaration,
        payloadDigest:
          typeof fanInPayloadDigest === "string"
            ? fanInPayloadDigest
            : `payload://odd-sdlc/live/${sdlcLiveSlug(input.manifest.edgeName)}/${declaration.branchRef.branchKey}`,
        counters
      });
    }),
    eventSink: (event) => {
      emittedEvents.push(event);
      input.eventSink(event);
    },
    maxBatches: Math.max(3, Math.ceil(declarations.length / parallelBatchSize) + 1),
    correlationId: `correlation://odd-sdlc/live/${manifestRefSegment(input.manifest)}/parallel-materialization`
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    artifactRef: "operator-run-artifact://live-fp-parallel-materialization-frontier",
    payload: constructSdlcLiveFpParallelMaterializationFrontier({
      edgeName: input.manifest.edgeName,
      executionAuthority: "abg_evented_saga_frontier",
      parallelismControl: "abg_branch_execution_policy",
      graphTruthSource: "sdlc_feature_dependency_dag",
      selectedMethod: traversal.selectedMethod,
      dependencyMapRef: dependencyMap.mapRef,
      testDependencyMapRef: selectedTestDependencyMap?.mapRef ?? null,
      dependencyMapRefs: Object.freeze([
        dependencyMap.mapRef,
        ...(selectedTestDependencyMap === undefined
          ? []
          : [selectedTestDependencyMap.mapRef])
      ]),
      traversalSelectionRef: traversal.selectionRef,
      testTraversalSelectionRef:
        selectedTestDependencyMap === undefined
          ? null
          : testTraversal?.selectionRef ?? null,
      traversalSelectionRefs: Object.freeze([
        traversal.selectionRef,
        ...(testTraversal?.selectedMethod === "parallel"
          ? [testTraversal.selectionRef]
          : [])
      ]),
      dagRef: dag.dagRef,
      startNodes: dag.startNodes,
      frontierRef: run.frontierRef,
      policyRef: run.policyRef,
      laneCount,
      devLaneCount,
      testLaneCount,
      fanInCount: fanInRows.length,
      batchCount: run.batchCount,
      batchSizes: run.batches.map(
        (batch) => batch.selection.selectedBranchRefs.length
      ),
      maxActive: counters.maxActive,
      readyBranchRefs: run.batches[0]?.selection.selectedBranchRefs ?? Object.freeze([]),
      compiledReadyBranchRefs: compilation.readyBranchRefs,
      completedBranchRefs: run.completedBranchRefs,
      failedBranchRefs: run.failedBranchRefs,
      writeTerritoryConflictRefs: compilation.writeTerritoryConflictRefs,
      outputAllocationConflictRefs: compilation.outputAllocationConflictRefs,
      branchRows,
      fanInRows,
      emittedEventKinds: uniqueSorted(run.emittedEvents.map((event) => event.kind)),
      emittedEventCount: emittedEvents.length,
      replayEventCount: run.replayEvents.length
    })
  });
}

async function writeTraversalSelectionAudit(input: {
  readonly basis: ExecutionBasis;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly postflight: SdlcPostflightResult;
  readonly edgeAccountingRow: SdlcExecutiveEdgeAccountingRow | null;
  readonly eventSink: (event: RuntimeEvent) => void;
  readonly fpEvaluatorAdmissionEvidenceRefs?: readonly string[] | undefined;
}): Promise<RuntimeEvent | null> {
  const auditCarriers = deriveSdlcStagedConstructionAuditCarriers(
    input.manifest,
    input.fpEvaluatorAdmissionEvidenceRefs ?? Object.freeze([])
  );
  const writtenRefs: string[] = [];
  for (const carrier of auditCarriers) {
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      artifactRef: carrier.artifactRef,
      payload: carrier.payload
    });
    writtenRefs.push(
      pathToFileURL(join(input.manifest.archiveRoot, carrier.relativePath)).href
    );
  }
  await writeLiveFpParallelMaterializationFrontier({
    basis: input.basis,
    manifest: input.manifest,
    carriers: auditCarriers,
    eventSink: input.eventSink
  });
  const canonicalSummary = canonicalSummaryForManifest({
    manifest: input.manifest,
    carriers: auditCarriers
  });
  if (canonicalSummary !== null) {
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      artifactRef: "operator-run-artifact://decomposition-summary",
      payload: canonicalSummary
    });
    writtenRefs.push(
      pathToFileURL(join(input.manifest.archiveRoot, "sdlc_decomposition_summary.json")).href
    );
  }

  const projectionOnlyEligible =
    input.edgeAccountingRow?.disposition === "projection_no_close";
  const evidenceRefs = uniqueSorted([
    ...input.postflight.evidenceRefs,
    ...writtenRefs,
    ...(projectionOnlyEligible ? [pathToFileURL(input.manifest.outputFile).href] : [])
  ]);
  if (
    canonicalSummary === null &&
    !projectionOnlyEligible &&
    input.manifest.targetCarrierProjection.constructionDepthRole === "none"
  ) {
    return null;
  }
  const selection = deriveSdlcTraversalHopSelection({
    selectionRef: `selection://odd-sdlc/${manifestRefSegment(input.manifest)}/traversal-hop`,
    outcomeClass: traversalOutcomeClassForManifest(input.manifest),
    decompositionSummary: canonicalSummary,
    projectionOnlyEligible,
    bundleEligible:
      traversalOutcomeClassForManifest(input.manifest) !== "domain_product" &&
      canonicalSummary !== null,
    evidenceRefs
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_traversal_hop_selection.json",
    payload: selection
  });
  const selectionRef = pathToFileURL(
    join(input.manifest.archiveRoot, "sdlc_traversal_hop_selection.json")
  ).href;
  return constructFdAuthorityOutcomeAdmittedEvent({
    basis: input.basis,
    vectorIndex: input.manifest.vectorIndex,
    status: selection.hopClass === "blocked" ? "blocked" : "accepted",
    severityClass: selection.hopClass === "blocked" ? "construction_context_invalid" : null,
    routingDecision: traversalAuditRoutingDecision(selection),
    affectedFieldRefs: Object.freeze([
      "sdlc_traversal_hop_selection.hopClass",
      "sdlc_traversal_hop_selection.pressurePreservation.mechanism"
    ]),
    consumedFieldRefs: Object.freeze([
      ...(canonicalSummary === null
        ? []
        : ["sdlc_decomposition_summary"]),
      "sdlc_operator_postflight_result"
    ]),
    pressureRefs: selection.blockingReasons,
    diagnosticRefs: selection.blockingReasons,
    evidenceRefs: uniqueSorted([selectionRef, ...selection.evidenceRefs]),
    causationEventRefs: input.postflight.evidenceRefs,
    correlationId: [
      "odd-sdlc-traversal-hop-selection",
      input.basis.id,
      String(input.manifest.vectorIndex)
    ].join(":")
  });
}

function writeFrontDoorTraversalSelectionAudit(input: {
  readonly basis: ExecutionBasis;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly summary: SdlcDecompositionSummary | null;
  readonly selection: SdlcTraversalHopSelection | null;
}): RuntimeEvent | null {
  if (
    input.manifest.vectorIndex !== 0 ||
    input.summary === null ||
    input.selection === null
  ) {
    return null;
  }
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_frontdoor_decomposition_summary.json",
    payload: input.summary
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_frontdoor_traversal_hop_selection.json",
    payload: input.selection
  });
  const summaryRef = pathToFileURL(
    join(input.manifest.archiveRoot, "sdlc_frontdoor_decomposition_summary.json")
  ).href;
  const selectionRef = pathToFileURL(
    join(input.manifest.archiveRoot, "sdlc_frontdoor_traversal_hop_selection.json")
  ).href;
  return constructFdAuthorityOutcomeAdmittedEvent({
    basis: input.basis,
    vectorIndex: input.manifest.vectorIndex,
    status: input.selection.hopClass === "blocked" ? "blocked" : "accepted",
    severityClass:
      input.selection.hopClass === "blocked"
        ? "construction_context_invalid"
        : null,
    routingDecision: traversalAuditRoutingDecision(input.selection),
    affectedFieldRefs: Object.freeze([
      "sdlc_public_start.executionContract.targetGraphFunction",
      "sdlc_public_start.executionContract.overlayRef",
      "sdlc_traversal_hop_selection.hopClass",
      "sdlc_traversal_hop_selection.pressurePreservation.mechanism"
    ]),
    consumedFieldRefs: Object.freeze([
      "sdlc_public_start_request",
      "sdlc_conform_project_profile.capabilityContracts",
      "sdlc_decomposition_summary"
    ]),
    pressureRefs: input.selection.pressurePreservation.preservedPressureRefs,
    diagnosticRefs: input.selection.blockingReasons,
    evidenceRefs: uniqueSorted([
      summaryRef,
      selectionRef,
      ...input.selection.evidenceRefs
    ]),
    causationEventRefs: Object.freeze([]),
    correlationId: [
      "odd-sdlc-frontdoor-traversal-hop-selection",
      input.basis.id,
      String(input.manifest.vectorIndex)
    ].join(":")
  });
}

function workerFailureRuntimeFailureClass(
  postflight: SdlcPostflightResult
): RuntimeFailureClass {
  const carrier = postflight.blockingReasonCarriers[0];
  if (
    carrier !== undefined &&
    (carrier.code === "silent_worker_inactivity" ||
      carrier.code === "worker_hard_timeout") &&
    (carrier.detail?.includes("stdoutBytes=0;stderrBytes=0") ?? false)
  ) {
    return "no_output";
  }
  if (
    carrier !== undefined &&
    (carrier.code === "worker_executor_unavailable" ||
      carrier.code === "worker_launch_failed" ||
      carrier.code === "worker_lost_terminal")
  ) {
    return "transport_failure";
  }
  return "runtime_failure";
}

function actorInvocationForPluginInput(input: {
  readonly pluginInput: EnginePluginInput;
  readonly transport: SdlcWorkerTransportContract;
}): ActorInvocation {
  const ref = input.pluginInput.actorInvocationRef;
  if (ref === null) {
    throw new TypeError("ABG process actor invocation requires actor ref");
  }
  if (input.pluginInput.graphCallId === null || input.pluginInput.frameId === null) {
    throw new TypeError("ABG process actor invocation requires graph/frame refs");
  }
  return Object.freeze({
    kind: "actor_invocation",
    actorInvocationId: ref.actorInvocationId,
    basisId: input.pluginInput.basisId,
    graphFunctionId: input.pluginInput.graphFunctionId,
    runId: null,
    workKey: null,
    graphCallId: input.pluginInput.graphCallId,
    frameId: input.pluginInput.frameId,
    vectorIndex: input.pluginInput.vectorIndex,
    edge: input.pluginInput.edge,
    attemptIndex: ref.attemptIndex,
    dispatchRef: ref.dispatchRef,
    workerId: input.transport.workerId,
    backendId: input.transport.backendId,
    resultRef: ref.resultRef,
    causationEventRefs: Object.freeze([ref.dispatchRef]),
    correlationId: [
      "odd-sdlc-installed-operator",
      input.pluginInput.basisId,
      String(input.pluginInput.vectorIndex),
      String(ref.attemptIndex)
    ].join(":")
  });
}

function environmentPolicyForTransport(
  transport: SdlcWorkerTransportContract
): { readonly prefixes: readonly string[] } {
  if (transport.agentKey === "claude") {
    return Object.freeze({
      prefixes: Object.freeze([
        "CLAUDE_CODE_SSE_",
        "CLAUDE_CODE_ENTRYPOINT",
        "CLAUDE_CODE_EXECPATH"
      ])
    });
  }
  return Object.freeze({ prefixes: Object.freeze([]) });
}

function installedOperatorChildProcessEnvironment(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value !== "string") {
      continue;
    }
    if (key === "NODE_TEST_CONTEXT") {
      continue;
    }
    env[key] = value;
  }
  return env;
}

const DEFAULT_WORKER_INACTIVITY_TIMEOUT_MS = 1000 * 60 * 30;
const DEFAULT_WORKER_TIMEOUT_MS = 1000 * 60 * 60 * 12;
const DEFAULT_WORKER_HEARTBEAT_MS = 1000 * 30;
const DEFAULT_WORKER_TERMINATION_GRACE_MS = 1000 * 10;
const DEFAULT_DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS = 1000 * 60 * 15;
const DEFAULT_DESIGN_DEPTH_FP_EVALUATOR_STDOUT_BUDGET_BYTES = 1024 * 1024;

function positiveIntegerFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function workerInactivityPolicy(): {
  readonly timeoutMs: number;
  readonly inactivityTimeoutMs: number;
  readonly heartbeatMs: number;
  readonly terminationGraceMs: number;
} {
  return Object.freeze({
    timeoutMs: positiveIntegerFromEnv(
      "ODD_SDLC_WORKER_TIMEOUT_MS",
      DEFAULT_WORKER_TIMEOUT_MS
    ),
    inactivityTimeoutMs: positiveIntegerFromEnv(
      "ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS",
      DEFAULT_WORKER_INACTIVITY_TIMEOUT_MS
    ),
    heartbeatMs: positiveIntegerFromEnv(
      "ODD_SDLC_WORKER_HEARTBEAT_MS",
      DEFAULT_WORKER_HEARTBEAT_MS
    ),
    terminationGraceMs: positiveIntegerFromEnv(
      "ODD_SDLC_WORKER_TERMINATION_GRACE_MS",
      DEFAULT_WORKER_TERMINATION_GRACE_MS
    )
  });
}

function designDepthFpEvaluatorTimeoutMs(): number {
  return positiveIntegerFromEnv(
    "ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS",
    DEFAULT_DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS
  );
}

function designDepthFpEvaluatorStdoutBudgetBytes(): number {
  return positiveIntegerFromEnv(
    "ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_STDOUT_BUDGET_BYTES",
    DEFAULT_DESIGN_DEPTH_FP_EVALUATOR_STDOUT_BUDGET_BYTES
  );
}

function fileByteCount(path: string): number {
  try {
    return statSync(path).size;
  } catch {
    return 0;
  }
}

function latestProcessHeartbeat(
  events: readonly RuntimeEvent[]
): Extract<RuntimeEvent, { readonly kind: "actor_process_heartbeat" }> | null {
  let latest: Extract<
    RuntimeEvent,
    { readonly kind: "actor_process_heartbeat" }
  > | null = null;
  for (const event of events) {
    if (event.kind === "actor_process_heartbeat") {
      latest = event;
    }
  }
  return latest;
}

function processSignalSequence(
  events: readonly RuntimeEvent[]
): SdlcWorkerProcessSummary["signalSequence"] {
  return Object.freeze(
    events
      .filter(
        (
          event
        ): event is Extract<
          RuntimeEvent,
          { readonly kind: "actor_process_signal_sent" }
        > => event.kind === "actor_process_signal_sent"
      )
      .map((event) =>
        Object.freeze({
          signal: event.signal,
          elapsedMs: event.elapsedMs
        })
      )
  );
}

function workerProcessSummaryPath(manifest: SdlcWorkerHandoffManifest): string {
  return join(manifest.archiveRoot, "worker_process_summary.json");
}

function workerProcessSummaryRef(manifest: SdlcWorkerHandoffManifest): string {
  return pathToFileURL(workerProcessSummaryPath(manifest)).href;
}

function runtimeLivenessProjectionPath(
  manifest: SdlcWorkerHandoffManifest
): string {
  return join(manifest.archiveRoot, "runtime_liveness_observer_projection.json");
}

function runtimeLivenessProjectionRef(
  manifest: SdlcWorkerHandoffManifest
): string {
  return pathToFileURL(runtimeLivenessProjectionPath(manifest)).href;
}

function workerProcessStartedContextPath(
  manifest: SdlcWorkerHandoffManifest
): string {
  return join(manifest.archiveRoot, "worker_process_started_context.json");
}

function workerProcessStartedContextRef(
  manifest: SdlcWorkerHandoffManifest
): string {
  return pathToFileURL(workerProcessStartedContextPath(manifest)).href;
}

function processStartedRef(manifest: SdlcWorkerHandoffManifest): string {
  return pathToFileURL(join(manifest.archiveRoot, "worker_process_started.json")).href;
}

function processEventsRef(manifest: SdlcWorkerHandoffManifest): string {
  return pathToFileURL(join(manifest.archiveRoot, "worker_process_events.jsonl")).href;
}

function writeWorkerProcessStartedContext(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath: string;
  readonly promptPath: string;
  readonly stdoutPath: string;
  readonly stderrPath: string;
  readonly executorProfile: TracedProcessExecutorProfile;
  readonly traceRoot: string;
  readonly policy: ReturnType<typeof workerInactivityPolicy>;
  readonly event: Extract<RuntimeEvent, { readonly kind: "actor_process_started" }>;
}): SdlcWorkerProcessStartedContext {
  const context: SdlcWorkerProcessStartedContext = Object.freeze({
    kind: "sdlc_worker_process_started_context",
    processStartedRef: processStartedRef(input.manifest),
    processEventsRef: processEventsRef(input.manifest),
    manifestRef: pathToFileURL(input.manifestPath).href,
    promptRef: pathToFileURL(input.promptPath).href,
    reportRef: pathToFileURL(input.manifest.reportFile).href,
    outputRef: pathToFileURL(input.manifest.outputFile).href,
    stdoutRef: pathToFileURL(input.stdoutPath).href,
    stderrRef: pathToFileURL(input.stderrPath).href,
    actorInvocationId: input.event.actorInvocationId,
    edge: input.event.edge,
    vectorIndex: input.event.vectorIndex,
    pid: input.event.pid,
    terminalSessionId: input.event.terminalSessionId,
    command: input.event.command,
    args: input.event.args,
    cwd: input.event.cwd,
    executorProfile: input.executorProfile,
    traceRoot: input.traceRoot,
    timeoutMs: input.policy.timeoutMs,
    inactivityTimeoutMs: input.policy.inactivityTimeoutMs,
    heartbeatMs: input.policy.heartbeatMs
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "worker_process_started_context.json",
    payload: context
  });
  return context;
}

function workerRuntimeWatchdogPolicy(input: {
  readonly policy: ReturnType<typeof workerInactivityPolicy>;
  readonly elapsedMs: number | null;
}) {
  return constructRuntimeWatchdogPolicy({
    policyRef: "policy://odd-sdlc/installed-worker-runtime/abg-3.7.1",
    startupSilenceLeaseMs: input.policy.inactivityTimeoutMs,
    inactivityLeaseMs: input.policy.inactivityTimeoutMs,
    terminationGraceMs: input.policy.terminationGraceMs,
    hardSafetyCapMs: input.policy.timeoutMs,
    nowElapsedMs: input.elapsedMs,
    retryBudgetRemaining: null
  });
}

const RUNTIME_LIVENESS_ARCHIVE_ACTIVITY_ROW_LIMIT = 12;

function archivedRuntimeLivenessObserverProjection(
  projection: RuntimeLivenessObserverProjection
): Readonly<
  RuntimeLivenessObserverProjection & {
    readonly activityRowCount: number;
    readonly omittedActivityRowCount: number;
  }
> {
  const activityRows = projection.activityRows;
  const omittedActivityRowCount = Math.max(
    0,
    activityRows.length - RUNTIME_LIVENESS_ARCHIVE_ACTIVITY_ROW_LIMIT
  );
  return Object.freeze({
    ...projection,
    activityRows: Object.freeze(
      activityRows.slice(-RUNTIME_LIVENESS_ARCHIVE_ACTIVITY_ROW_LIMIT)
    ),
    activityRowCount: activityRows.length,
    omittedActivityRowCount
  });
}

function writeRuntimeLivenessObserverProjection(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly basis: ExecutionBasis;
  readonly processResult: SupervisedProcessActorResult;
  readonly policy: ReturnType<typeof workerInactivityPolicy>;
}): RuntimeLivenessObserverProjection {
  const projection = deriveRuntimeLivenessObserverProjection({
    basis: input.basis,
    runtimeProjection: deriveRuntimeAggregateProjection(
      input.basis,
      input.processResult.events
    ),
    events: input.processResult.events,
    probeContracts: input.processResult.probeContracts,
    policy: workerRuntimeWatchdogPolicy({
      policy: input.policy,
      elapsedMs: input.processResult.elapsedMs
    })
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "runtime_liveness_observer_projection.json",
    payload: archivedRuntimeLivenessObserverProjection(projection)
  });
  return projection;
}

function writeWorkerProcessSummary(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath: string;
  readonly promptPath: string;
  readonly workerRun: SdlcWorkerRunResult;
  readonly processResult: SupervisedProcessActorResult;
  readonly policy: ReturnType<typeof workerInactivityPolicy>;
  readonly livenessProjection: RuntimeLivenessObserverProjection;
}): SdlcWorkerProcessSummary {
  const latestHeartbeat = latestProcessHeartbeat(input.processResult.events);
  const summary: SdlcWorkerProcessSummary = Object.freeze({
    kind: "sdlc_worker_process_summary",
    processStartedRef: processStartedRef(input.manifest),
    processEventsRef: processEventsRef(input.manifest),
    manifestRef: pathToFileURL(input.manifestPath).href,
    promptRef: pathToFileURL(input.promptPath).href,
    reportRef: pathToFileURL(input.manifest.reportFile).href,
    outputRef: pathToFileURL(input.manifest.outputFile).href,
    stdoutRef: pathToFileURL(input.workerRun.stdoutPath).href,
    stderrRef: pathToFileURL(input.workerRun.stderrPath).href,
    pid: input.processResult.pid,
    command: input.workerRun.command,
    args: input.workerRun.args,
    cwd: input.workerRun.cwd,
    ...(input.workerRun.executorProfile === undefined
      ? {}
      : { executorProfile: input.workerRun.executorProfile }),
    ...(input.workerRun.terminalSessionId === undefined
      ? {}
      : { terminalSessionId: input.workerRun.terminalSessionId }),
    ...(input.workerRun.streamModel === undefined
      ? {}
      : { streamModel: input.workerRun.streamModel }),
    ...(input.workerRun.outcome === undefined
      ? {}
      : { outcome: input.workerRun.outcome }),
    ...(input.workerRun.traceRoot === undefined
      ? {}
      : { traceRoot: input.workerRun.traceRoot }),
    ...(input.workerRun.traceResultRef === undefined
      ? {}
      : { traceResultRef: input.workerRun.traceResultRef }),
    ...(input.workerRun.structuredEventCount === undefined
      ? {}
      : { structuredEventCount: input.workerRun.structuredEventCount }),
    ...(input.workerRun.structuredParseFailureCount === undefined
      ? {}
      : {
          structuredParseFailureCount:
            input.workerRun.structuredParseFailureCount
        }),
    ...(input.workerRun.apiRetryCount === undefined
      ? {}
      : { apiRetryCount: input.workerRun.apiRetryCount }),
    ...(input.workerRun.toolCallCount === undefined
      ? {}
      : { toolCallCount: input.workerRun.toolCallCount }),
    ...(input.workerRun.finalOutputRef === undefined
      ? {}
      : { finalOutputRef: input.workerRun.finalOutputRef }),
    ...(input.workerRun.terminalTranscriptRef === undefined
      ? {}
      : { terminalTranscriptRef: input.workerRun.terminalTranscriptRef }),
    timeoutMs: input.policy.timeoutMs,
    inactivityTimeoutMs: input.policy.inactivityTimeoutMs,
    heartbeatMs: input.policy.heartbeatMs,
    runtimeLivenessAuthority:
      "abiogenesis_runtime_liveness_observer_projection",
    runtimeLivenessProjectionRef: runtimeLivenessProjectionRef(input.manifest),
    runtimeLivenessPolicyRef: input.livenessProjection.policyRef,
    runtimeLivenessLeaseState: input.livenessProjection.leaseState,
    runtimeLivenessDispositionAction:
      input.livenessProjection.disposition.action,
    runtimeLivenessDispositionReason:
      input.livenessProjection.disposition.reason,
    lastHeartbeatIndex: latestHeartbeat?.heartbeatIndex ?? null,
    lastHeartbeatElapsedMs: latestHeartbeat?.elapsedMs ?? null,
    signalSequence: processSignalSequence(input.processResult.events),
    status: input.workerRun.status,
    signal: input.workerRun.signal,
    elapsedMs: input.workerRun.elapsedMs,
    timedOut: input.workerRun.timedOut,
    error: input.workerRun.error
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "worker_process_summary.json",
    payload: summary
  });
  return summary;
}

function isUnknownRecord(input: unknown): input is Readonly<Record<string, unknown>> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function objectValue(input: unknown): Readonly<Record<string, unknown>> | null {
  return isUnknownRecord(input) ? input : null;
}

function stringValue(input: unknown): string | null {
  return typeof input === "string" ? input : null;
}

function numberValue(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) ? input : null;
}

function booleanValue(input: unknown): boolean | null {
  return typeof input === "boolean" ? input : null;
}

function nullableNumberValue(input: unknown): number | null | undefined {
  if (input === null) {
    return null;
  }
  return typeof input === "number" && Number.isFinite(input) ? input : undefined;
}

function nullableStringValue(input: unknown): string | null | undefined {
  if (input === null) {
    return null;
  }
  return typeof input === "string" ? input : undefined;
}

function tracedProcessOutcomeValue(input: unknown): TracedProcessOutcome | null {
  const record = objectValue(input);
  if (record === null) {
    return null;
  }
  const kind = stringValue(record["kind"]);
  if (kind === "exited") {
    const status = numberValue(record["status"]);
    return status === null ? null : Object.freeze({ kind, status });
  }
  if (kind === "signaled") {
    const status = nullableNumberValue(record["status"]);
    const signal = stringValue(record["signal"]);
    return status === undefined || signal === null
      ? null
      : Object.freeze({ kind, status, signal });
  }
  if (kind === "hard_timeout") {
    const timeoutMs = nullableNumberValue(record["timeoutMs"]);
    const signal = nullableStringValue(record["signal"]);
    return timeoutMs === undefined || signal === undefined
      ? null
      : Object.freeze({ kind, timeoutMs, signal });
  }
  if (kind === "inactivity_timeout") {
    const inactivityTimeoutMs = nullableNumberValue(record["inactivityTimeoutMs"]);
    const signal = nullableStringValue(record["signal"]);
    return inactivityTimeoutMs === undefined || signal === undefined
      ? null
      : Object.freeze({ kind, inactivityTimeoutMs, signal });
  }
  if (kind === "executor_unavailable") {
    const reason = stringValue(record["reason"]);
    const detail = stringValue(record["detail"]);
    if (
      (reason !== "screen_missing" && reason !== "screen_shell_unavailable") ||
      detail === null
    ) {
      return null;
    }
    return Object.freeze({ kind, reason, detail });
  }
  if (
    kind === "launch_failed" ||
    kind === "process_error" ||
    kind === "lost_terminal"
  ) {
    const detail = stringValue(record["detail"]);
    return detail === null ? null : Object.freeze({ kind, detail });
  }
  return null;
}

function stringArrayValue(input: unknown): readonly string[] | null {
  if (!Array.isArray(input)) {
    return null;
  }
  const values: string[] = [];
  for (const item of input) {
    if (typeof item !== "string") {
      return null;
    }
    values.push(item);
  }
  return Object.freeze(values);
}

function signalSequenceValue(
  input: unknown
): SdlcWorkerProcessSummary["signalSequence"] | null {
  if (!Array.isArray(input)) {
    return null;
  }
  const values: {
    readonly signal: string;
    readonly elapsedMs: number;
  }[] = [];
  for (const item of input) {
    const record = objectValue(item);
    if (record === null) {
      return null;
    }
    const signal = stringValue(record["signal"]);
    const elapsedMs = numberValue(record["elapsedMs"]);
    if (signal === null || elapsedMs === null) {
      return null;
    }
    values.push(Object.freeze({ signal, elapsedMs }));
  }
  return Object.freeze(values);
}

interface WorkerTraceProjection {
  readonly executorProfile: TracedProcessExecutorProfile | null;
  readonly terminalSessionId: string | null;
  readonly streamModel: TracedProcessStreamModel | null;
  readonly structuredEventCount: number | null;
  readonly structuredParseFailureCount: number | null;
  readonly apiRetryCount: number | null;
  readonly toolCallCount: number | null;
  readonly finalOutputRef: string | null;
  readonly terminalTranscriptRef: string | null;
}

function traceResultPath(traceRoot: string): string {
  return join(traceRoot, "result.json");
}

function fileRef(path: string): string {
  return pathToFileURL(path).href;
}

function optionalPathRef(value: unknown): string | null {
  const path = stringValue(value);
  return path === null ? null : fileRef(path);
}

function traceProjectionFor(traceRoot: string): WorkerTraceProjection {
  const fallback: WorkerTraceProjection = Object.freeze({
    executorProfile: null,
    terminalSessionId: null,
    streamModel: null,
    structuredEventCount: null,
    structuredParseFailureCount: null,
    apiRetryCount: null,
    toolCallCount: null,
    finalOutputRef: null,
    terminalTranscriptRef: null
  });
  if (!existsSync(traceResultPath(traceRoot))) {
    return fallback;
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(traceResultPath(traceRoot), "utf8"));
    const record = objectValue(parsed);
    if (record === null) {
      return fallback;
    }
    const rawExecutorProfile = stringValue(record["executorProfile"]);
    const executorProfile =
      rawExecutorProfile === "local-spawn" || rawExecutorProfile === "pty-terminal"
        ? rawExecutorProfile
        : null;
    const rawStreamModel = stringValue(record["streamModel"]);
    const streamModel =
      rawStreamModel === "stdio" || rawStreamModel === "terminal-transcript"
        ? rawStreamModel
        : null;
    const paths = objectValue(record["paths"]);
    const apiRetryEvents = record["apiRetryEvents"];
    const toolCallEvents = record["toolCallEvents"];
    return Object.freeze({
      executorProfile,
      terminalSessionId:
        record["terminalSessionId"] === null
          ? null
          : stringValue(record["terminalSessionId"]),
      streamModel,
      structuredEventCount: numberValue(record["structuredEventCount"]),
      structuredParseFailureCount: numberValue(
        record["structuredParseFailureCount"]
      ),
      apiRetryCount: Array.isArray(apiRetryEvents) ? apiRetryEvents.length : null,
      toolCallCount: Array.isArray(toolCallEvents) ? toolCallEvents.length : null,
      finalOutputRef:
        paths === null ? null : optionalPathRef(paths["finalOutput"]),
      terminalTranscriptRef:
        paths === null
          ? null
          : optionalPathRef(paths["terminalTranscript"])
    });
  } catch {
    return fallback;
  }
}

function terminalSessionIdFromStartedEvent(
  events: readonly RuntimeEvent[]
): string | null {
  for (const event of events) {
    if (event.kind === "actor_process_started") {
      return event.terminalSessionId;
    }
  }
  return null;
}

type WorkerProcessSummaryAdmission =
  | {
      readonly kind: "admitted";
      readonly summary: SdlcWorkerProcessSummary;
    }
  | {
      readonly kind: "missing" | "invalid";
      readonly detail: string;
    };

function admitWorkerProcessSummary(
  manifest: SdlcWorkerHandoffManifest
): WorkerProcessSummaryAdmission {
  if (!existsSync(workerProcessSummaryPath(manifest))) {
    return Object.freeze({
      kind: "missing",
      detail: `missing:${workerProcessSummaryRef(manifest)}`
    });
  }
  try {
    const parsed: unknown = JSON.parse(
      readFileSync(workerProcessSummaryPath(manifest), "utf8")
    );
    const record = objectValue(parsed);
    if (record === null || record["kind"] !== "sdlc_worker_process_summary") {
      return Object.freeze({
        kind: "invalid",
        detail: "invalid_kind"
      });
    }
    const processStartedRef = stringValue(record["processStartedRef"]);
    const processEventsRef = stringValue(record["processEventsRef"]);
    const manifestRef = stringValue(record["manifestRef"]);
    const promptRef = stringValue(record["promptRef"]);
    const reportRef = stringValue(record["reportRef"]);
    const outputRef = stringValue(record["outputRef"]);
    const stdoutRef = stringValue(record["stdoutRef"]);
    const stderrRef = stringValue(record["stderrRef"]);
    const pid = nullableNumberValue(record["pid"]);
    const command = stringValue(record["command"]);
    const args = stringArrayValue(record["args"]);
    const cwd = stringValue(record["cwd"]);
    const timeoutMs = numberValue(record["timeoutMs"]);
    const inactivityTimeoutMs = numberValue(record["inactivityTimeoutMs"]);
    const heartbeatMs = numberValue(record["heartbeatMs"]);
    const runtimeLivenessAuthority = stringValue(
      record["runtimeLivenessAuthority"]
    );
    const runtimeLivenessProjectionRef = stringValue(
      record["runtimeLivenessProjectionRef"]
    );
    const runtimeLivenessPolicyRef = stringValue(
      record["runtimeLivenessPolicyRef"]
    );
    const runtimeLivenessLeaseState = stringValue(
      record["runtimeLivenessLeaseState"]
    );
    const runtimeLivenessDispositionAction = stringValue(
      record["runtimeLivenessDispositionAction"]
    );
    const runtimeLivenessDispositionReason = stringValue(
      record["runtimeLivenessDispositionReason"]
    );
    const lastHeartbeatIndex = nullableNumberValue(
      record["lastHeartbeatIndex"]
    );
    const lastHeartbeatElapsedMs = nullableNumberValue(
      record["lastHeartbeatElapsedMs"]
    );
    const signalSequence = signalSequenceValue(record["signalSequence"]);
    const status = nullableNumberValue(record["status"]);
    const signal = nullableStringValue(record["signal"]);
    const elapsedMs = numberValue(record["elapsedMs"]);
    const timedOut = booleanValue(record["timedOut"]);
    const error = nullableStringValue(record["error"]);
    const rawExecutorProfile = stringValue(record["executorProfile"]);
    const executorProfile =
      rawExecutorProfile === "local-spawn" || rawExecutorProfile === "pty-terminal"
        ? rawExecutorProfile
        : undefined;
    const rawStreamModel = stringValue(record["streamModel"]);
    const streamModel =
      rawStreamModel === "stdio" || rawStreamModel === "terminal-transcript"
        ? rawStreamModel
        : undefined;
    const rawOutcome = record["outcome"];
    const outcome =
      rawOutcome === undefined ? undefined : tracedProcessOutcomeValue(rawOutcome);
    const traceRoot = stringValue(record["traceRoot"]) ?? undefined;
    const traceResultRef =
      stringValue(record["traceResultRef"]) ?? undefined;
    const structuredEventCount =
      nullableNumberValue(record["structuredEventCount"]) ?? undefined;
    const structuredParseFailureCount =
      nullableNumberValue(record["structuredParseFailureCount"]) ??
      undefined;
    const apiRetryCount =
      nullableNumberValue(record["apiRetryCount"]) ?? undefined;
    const toolCallCount =
      nullableNumberValue(record["toolCallCount"]) ?? undefined;
    const finalOutputRef =
      nullableStringValue(record["finalOutputRef"]) ?? undefined;
    const terminalTranscriptRef =
      nullableStringValue(record["terminalTranscriptRef"]) ??
      undefined;
    if (
      processStartedRef === null ||
      processEventsRef === null ||
      manifestRef === null ||
      promptRef === null ||
      reportRef === null ||
      outputRef === null ||
      stdoutRef === null ||
      stderrRef === null ||
      pid === undefined ||
      command === null ||
      args === null ||
      cwd === null ||
      timeoutMs === null ||
      inactivityTimeoutMs === null ||
      heartbeatMs === null ||
      runtimeLivenessAuthority !==
        "abiogenesis_runtime_liveness_observer_projection" ||
      runtimeLivenessProjectionRef === null ||
      runtimeLivenessPolicyRef === null ||
      runtimeLivenessLeaseState === null ||
      runtimeLivenessDispositionAction === null ||
      runtimeLivenessDispositionReason === null ||
      lastHeartbeatIndex === undefined ||
      lastHeartbeatElapsedMs === undefined ||
      signalSequence === null ||
      status === undefined ||
      signal === undefined ||
      elapsedMs === null ||
      timedOut === null ||
      error === undefined ||
      outcome === null
    ) {
      return Object.freeze({
        kind: "invalid",
        detail: "invalid_fields"
      });
    }
    return Object.freeze({
      kind: "admitted",
      summary: Object.freeze({
        kind: "sdlc_worker_process_summary",
        processStartedRef,
        processEventsRef,
        manifestRef,
        promptRef,
        reportRef,
        outputRef,
        stdoutRef,
        stderrRef,
        pid,
        command,
        args,
        cwd,
        timeoutMs,
        inactivityTimeoutMs,
        heartbeatMs,
        runtimeLivenessAuthority,
        runtimeLivenessProjectionRef,
        runtimeLivenessPolicyRef,
        runtimeLivenessLeaseState,
        runtimeLivenessDispositionAction,
        runtimeLivenessDispositionReason,
        lastHeartbeatIndex,
        lastHeartbeatElapsedMs,
        signalSequence,
        ...(executorProfile === undefined ? {} : { executorProfile }),
        ...(streamModel === undefined ? {} : { streamModel }),
        ...(outcome === undefined ? {} : { outcome }),
        ...(traceRoot === undefined ? {} : { traceRoot }),
        ...(traceResultRef === undefined ? {} : { traceResultRef }),
        ...(structuredEventCount === undefined ? {} : { structuredEventCount }),
        ...(structuredParseFailureCount === undefined
          ? {}
          : { structuredParseFailureCount }),
        ...(apiRetryCount === undefined ? {} : { apiRetryCount }),
        ...(toolCallCount === undefined ? {} : { toolCallCount }),
        ...(finalOutputRef === undefined ? {} : { finalOutputRef }),
        ...(terminalTranscriptRef === undefined ? {} : { terminalTranscriptRef }),
        status,
        signal,
        elapsedMs,
        timedOut,
        error
      })
    });
  } catch {
    return Object.freeze({
      kind: "invalid",
      detail: "parse_failed"
    });
  }
}

async function invokeWorkerThroughAbgProcessActor(input: {
  readonly transport: SdlcWorkerTransportContract;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath: string;
  readonly promptPath: string;
  readonly pluginInput: EnginePluginInput;
  readonly basis: ExecutionBasis;
  readonly eventSink: (event: RuntimeEvent) => void;
}): Promise<SdlcWorkerRunResult> {
  const stdoutPath = join(input.manifest.archiveRoot, "worker_stdout.log");
  const stderrPath = join(input.manifest.archiveRoot, "worker_stderr.log");
  const processStartedPath = join(
    input.manifest.archiveRoot,
    "worker_process_started.json"
  );
  const processEventsPath = join(
    input.manifest.archiveRoot,
    "worker_process_events.jsonl"
  );
  const traceRoot = `${processEventsPath}.trace`;
  const outputLastMessagePath =
    input.transport.agentKey === "codex"
      ? join(input.manifest.archiveRoot, "worker_last_message.txt")
      : null;
  const inactivityPolicy = workerInactivityPolicy();
  const executorProfile = selectedWorkerExecutorProfile();
  let startedContextWritten = false;
  const processLaunch = processLaunchForWorker({
    transport: input.transport,
    manifestPath: input.manifestPath,
    manifest: input.manifest,
    promptPath: input.promptPath,
    outputLastMessagePath: outputLastMessagePath ?? "",
    executorProfile
  });
  const processResult: SupervisedProcessActorResult =
    await invokeSupervisedProcessActor({
      invocation: actorInvocationForPluginInput({
        pluginInput: input.pluginInput,
        transport: input.transport
      }),
      command: processLaunch.command,
      args: processLaunch.args,
      cwd: input.manifest.workspaceRoot,
      environment: {
        ...installedOperatorChildProcessEnvironment(),
        ODD_SDLC_OPERATOR_MANIFEST: input.manifestPath,
        ODD_SDLC_OPERATOR_REPORT: input.manifest.reportFile,
        ODD_SDLC_OPERATOR_OUTPUT: input.manifest.outputFile,
        ODD_SDLC_OPERATOR_MATERIALIZATION_ROOT:
          input.manifest.productMaterialization.tenantRoot,
        ODD_SDLC_OPERATOR_MATERIALIZATION_MANIFEST:
          input.manifest.productMaterialization.manifestFile
      },
      environmentPolicy: environmentPolicyForTransport(input.transport),
      stdin: processLaunch.stdin,
      stdoutPath,
      stderrPath,
      stdoutRef: pathToFileURL(stdoutPath).href,
      stderrRef: pathToFileURL(stderrPath).href,
      processStartedPath,
      processEventsPath,
      parser: parserForWorkerTransport(input.transport),
      executorProfile,
      timeoutMs: inactivityPolicy.timeoutMs,
      terminationGraceMs: inactivityPolicy.terminationGraceMs,
      heartbeatMs: inactivityPolicy.heartbeatMs,
      eventSink: (event) => {
        if (event.kind === "actor_process_started" && !startedContextWritten) {
          writeWorkerProcessStartedContext({
            manifest: input.manifest,
            manifestPath: input.manifestPath,
            promptPath: input.promptPath,
            stdoutPath,
            stderrPath,
            executorProfile,
            traceRoot,
            policy: inactivityPolicy,
            event
          });
          startedContextWritten = true;
        }
        input.eventSink(event);
      }
    });
  const stdoutByteCount = fileByteCount(stdoutPath);
  const stderrByteCount = fileByteCount(stderrPath);
  const traceProjection = traceProjectionFor(traceRoot);
  const startedEventTerminalSessionId = terminalSessionIdFromStartedEvent(
    processResult.events
  );
	  const workerRun: SdlcWorkerRunResult = Object.freeze({
    kind: "sdlc_worker_run_result",
    command: processResult.command,
    args: processResult.args,
    cwd: processResult.cwd,
    executorProfile: traceProjection.executorProfile ?? executorProfile,
	    terminalSessionId:
	      startedEventTerminalSessionId ?? traceProjection.terminalSessionId,
    streamModel:
      traceProjection.streamModel ??
      (executorProfile === "pty-terminal" ? "terminal-transcript" : "stdio"),
    outcome: processResult.outcome,
    traceRoot,
    traceResultRef: fileRef(traceResultPath(traceRoot)),
    structuredEventCount: traceProjection.structuredEventCount,
    structuredParseFailureCount: traceProjection.structuredParseFailureCount,
    apiRetryCount: traceProjection.apiRetryCount,
    toolCallCount: traceProjection.toolCallCount,
    finalOutputRef: traceProjection.finalOutputRef,
    terminalTranscriptRef: traceProjection.terminalTranscriptRef,
    status: processResult.status,
    signal: processResult.signal,
    elapsedMs: processResult.elapsedMs,
    timedOut: processResult.timedOut,
    stdoutByteCount,
    stderrByteCount,
    stdoutPath,
    stderrPath,
    outputLastMessagePath,
    error: processResult.error
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "worker_run.json",
    payload: workerRun
  });
  const livenessProjection = writeRuntimeLivenessObserverProjection({
    manifest: input.manifest,
    basis: input.basis,
    processResult,
    policy: inactivityPolicy
  });
  writeWorkerProcessSummary({
    manifest: input.manifest,
    manifestPath: input.manifestPath,
    promptPath: input.promptPath,
    workerRun,
    processResult,
    policy: inactivityPolicy,
    livenessProjection
  });
  return workerRun;
}

function designDepthFpEvaluatorPrompt(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath: string;
  readonly governanceRef: string;
  readonly governancePath: string;
  readonly constructionBriefPath: string;
  readonly invocationPackagePath: string;
  readonly workerReportPath: string;
  readonly workerReportSummaryLines: readonly string[];
  readonly contentLedgerPath: string;
  readonly registerProjectionPath: string;
  readonly selectedCompositionRef: string;
  readonly selectedCompositionDigest: string;
  readonly selectedCompositionSelectionRef: string;
  readonly selectedRegimeBindingRef: string | null;
}): string {
  return [
    "odd_sdlc evaluate.C/F_P design-depth register rule.",
    "",
    "Purpose:",
    "- Populate the implementation design-depth content ledger as the highest semantic design-depth truth for downstream transforms.",
    "- Evaluate the workspace, admitted transform evidence, worker report, construction brief, invocation package, ADR artifact, and ledger pressure together.",
    "- Treat depth as the priority F_P judgment: decide whether the component/module decomposition, source ownership, public boundaries, and residual pressure are proportionate to the requirements.",
    "- For each requirement or requirement group, decide whether it requires separable_public_boundary, shared_component, test_boundary, data_contract_boundary, runtime_or_persistence_boundary, human_review, or blocked handling. Encode that decision in component row publicBoundary/rationale text and designCompletenessVerdict reasons.",
    "- This is evaluation work. Do not rewrite the ADR, source files, tests, package files, or product materialization outputs.",
    "- The content ledger path is the durable evaluation artifact; the task is not a single-shot JSON response.",
    "",
    "Read in order:",
    `1. compressed work-category governance (${input.governanceRef}): ${input.governancePath}`,
    `2. construction brief: ${input.constructionBriefPath}`,
    "3. write the first design-depth content ledger yourself from the construction brief, admitted transform evidence, and selected authority refs.",
    `4. inspect and refine the content ledger file only after it exists: ${input.contentLedgerPath}`,
    "5. only after the first ledger exists, read the ADR or workspace authority refs needed to resolve a specific missing payload section.",
    "",
    "Precomputed worker result report summary:",
    ...input.workerReportSummaryLines.map((line) => `- ${line}`),
    "",
    "Hard pre-register limits:",
    `- Do not use the Read tool on the handoff manifest (${input.manifestPath}). It is too large; summarize selected keys with Node.`,
    `- Do not inspect the worker result report (${input.workerReportPath}) before the first ledger write. Its compact summary is already in this prompt.`,
    `- Do not use the Read tool on the worker invocation package (${input.invocationPackagePath}) before the first ledger write. If needed, summarize selected keys with Node.`,
    `- Do not use the Read tool on the ADR transform artifact (${input.manifest.outputFile}) before the first ledger write. Use bounded search or short Node summaries only when necessary.`,
    "- Before the first ledger write, do not inspect extra authority files beyond the governance doc and construction brief.",
    "- The first durable content-ledger write must be your selected evaluate.C/F_P judgment. Do not spend the first pass gathering exhaustive context.",
    "- Do not run a worker-result-report discovery script before the first ledger write.",
    "- If you run one bounded summary script for any other input, the next tool call must create or overwrite the content ledger file. Do not say \"writing the ledger\" until that file write has succeeded.",
    "- You may write temporary Node snippets for bounded summarization or JSON validation only. Do not use scripts to deterministically construct semantic register rows from framework rules.",
    "",
    "First register materialization rule:",
    "- After reading the governance doc and construction brief, create the content ledger file directly as the selected evaluate.C/F_P semantic pressure map.",
    "- Use admitted upstream design surfaces, dependency pressure, product file targets, tenant stack authority, worker report summary, and specific authority refs as the basis.",
    "- Do not copy a framework-generated register skeleton as semantic truth. If a section is uncertain, emit a partial or blocked axis with explicit reasons and evidence refs instead of inventing rows.",
    "- The content ledger carries an embedded ProductAssetModel payload whose contentKind is sdlc_design_depth_register. F_D will only project that exact payload to the legacy register path after admission.",
    `- Do not write the legacy projection path directly: ${input.registerProjectionPath}`,
    "- The first ledger can be compact; after it exists, iterate only if validation fails or a specific axis is partial/blocked.",
    "Reading discipline:",
    "- Do not print, cat, tail, grep, or paste full authority files into stdout.",
    "- Do not display worker_invocation_package.json, requirement tables, authority ref arrays, evidence arrays, or full JSON objects in the terminal.",
    "- Do not use cat, sed, head, tail, grep, jq '.', or any equivalent command to display the five primary inputs.",
    "- If JSON inspection is needed, run Node snippets that read silently and print only bounded counts, selected keys, or at most 20 short ids.",
    "- Keep terminal output bounded and purposeful. Stdout is an agent work trace, not evaluation truth.",
    "- The content ledger file is the evaluation surface. Prefer file writes and local validation over terminal narration.",
    "",
    "Agentic F_P work loop:",
    "- Start by writing a short plan and checklist for the required register sections.",
    "- Time budget is part of correctness: create the content ledger file before doing deep exploratory review.",
    "- After the governance doc and construction brief are read, write the first content ledger before deep exploratory action. At most one bounded summary script is allowed before the first ledger write, and it must not inspect worker_result_report.json or dump the ADR.",
    "- First content-ledger write must happen as soon as stack, module, component, file target, compact schema, compact sequence, and verdict skeletons can be truthfully populated.",
    "- Then iterate by editing the content ledger file in place: inspect only the authority needed for a specific missing/partial section, update the ledger, then validate the file.",
    "- Do not spend the run enumerating every requirement id before writing the register. Use worker_result_report counts and high-signal samples for pressure; full trace remains in the admitted ledgers.",
    "- If time or authority is insufficient, still write a structurally valid content ledger with partial or blocked designCompletenessVerdict axes and explicit reasons. Missing-ledger timeout is worse than an admitted pressure map with honest residual pressure.",
    "- It is acceptable to rewrite the content ledger multiple times while converging. Do not treat this as a single-shot generation task.",
    "- Use scripts or targeted commands to summarize authority and validate JSON shape; do not paste large source or ledger bodies into stdout.",
    "- Script output budget before first ledger write: no more than 40 total stdout lines.",
    "- If the component/module set is uncertain, encode the uncertainty in partial or blocked designCompletenessVerdict axes and continue with the smallest truthful pressure map.",
    "- If a referenced authority corpus is large, sample the headings/tables needed for module boundaries and requirement ids; do not dump the corpus into the terminal.",
    "- Final response is irrelevant unless the content ledger exists and validates. Prioritize writing and validating the file over narrative.",
    "",
    `Durable evaluation artifact to create and validate: ${input.contentLedgerPath}`,
    "",
    "Required content ledger shape:",
    "- kind: \"sdlc_evaluate_content_ledger\"",
    "- ledgerVersion: \"ts-evaluate-content-v1\"",
    "- stage: \"evaluate.C\"",
    `- ruleRef: "${DESIGN_DEPTH_FP_EVALUATOR_RULE_REF}"`,
    "- ruleRole: \"semantic_judgment\"",
    "- computeMeans: \"F_P\"",
    "- authorityFunction: \"synthesize_model\"",
    `- selectedCompositionRef: "${input.selectedCompositionRef}"`,
    `- selectedCompositionDigest: "${input.selectedCompositionDigest}"`,
    `- selectedCompositionSelectionRef: "${input.selectedCompositionSelectionRef}"`,
    `- selectedRegimeBindingRef: ${input.selectedRegimeBindingRef === null ? "null" : JSON.stringify(input.selectedRegimeBindingRef)}`,
    `- compositionContributionRef: "${input.selectedRegimeBindingRef ?? input.selectedCompositionRef}"`,
    "- sourceBasisRefs[], candidateArtifactRefs[], evidenceRefs[], contentRows[].",
    "- contentRows[0].kind: \"sdlc_evaluate_content_ledger_row\"",
    "- contentRows[0].rowRef: a stable non-empty ref such as \"content-ledger-row://odd-sdlc/design-depth/<edgeName>/1\"",
    "- contentRows[0].authorityFunction: \"synthesize_model\"",
    "- contentRows[0].carrierFamily: \"ProductAssetModel\"",
    "- contentRows[0].contentKind: \"sdlc_design_depth_register\"",
    "- contentRows[0].payload must be the full design-depth register object below.",
    "- contentRows[0].sourceBasisRefs[] must cite the construction brief, governance doc, and any bounded authority inspected for this row.",
    "- contentRows[0].evidenceRefs[] must cite the ADR/transform artifact or other admitted evidence supporting this row.",
    "- Ledger rows are closed carriers: contentRows[0] must contain exactly kind, rowRef, authorityFunction, carrierFamily, contentKind, payload, sourceBasisRefs, evidenceRefs.",
    "",
    "Embedded ProductAssetModel payload shape:",
    "- kind: \"sdlc_design_depth_register\"",
    "- registerVersion: \"ts-design-depth-v1\"",
    "- targetAssetType: \"implementation_design_surface\"",
    "- stackProfileRows[] with kind, stackRef, language, buildTool",
    "- implementationModuleRows[] with kind, moduleName, moduleRef",
    "- aggregateDomainModelRows[] with kind, modelRef",
    "- moduleSchemaFragments[] with kind, moduleName, entities, operations, requirementIds, sourceAssetRefs",
    "- moduleStateDiagramFragments[] with kind, moduleName, entityId, stateless, states, transitions, requirementIds, sourceAssetRefs",
    "- aggregateDomainModel with kind, modelVersion, entities, operations, crossModuleReferences, evidenceRefs",
    `- aggregateDomainModel.modelVersion must be exactly "ts-design-depth-v1".`,
    "- sunnyDaySequenceRows[] with kind, sequenceRef",
    "- aggregateSunnyDaySequence with kind, sequenceVersion, steps, evidenceRefs",
    `- aggregateSunnyDaySequence.sequenceVersion must be exactly "ts-design-depth-v1".`,
    "- componentTopologyRows[] with kind, componentId, moduleName, relativePath, publicBoundary, concernRole, requirementIds, sourceAssetRefs",
    "- componentRealizationRows[] with kind, componentId, moduleName, relativePath, publicBoundary, trancheId, firstProductFileToChange, upstreamComponentIds, requirementIds, sourceAssetRefs",
    "- fileTargetRows[] with kind, relativePath, role",
    "- designCompletenessVerdict with entity, attribute, and flow axis verdicts.",
    `- Allowed componentTopologyRows[].concernRole values: ${SDLC_COMPONENT_CONCERN_ROLES.join(", ")}`,
    `- Allowed designCompletenessVerdict.*.status values: ${SDLC_DESIGN_COMPLETENESS_STATUSES.join(", ")}. Use "satisfied" for a complete axis; never use "complete".`,
    "",
    "Nested closed-object contract:",
    "- Do not use string shorthand for typed rows. An array of strings is only valid for fields whose name ends in Ids, Refs, Names, states, reasons, evidenceRefs, sourceAssetRefs, inputEntityIds, outputEntityIds, requiredAttributeIds, invariantRefs, or stateTransitionIds.",
    "- moduleSchemaFragments[].entities[] must contain closed sdlc_domain_entity objects with kind, entityId, moduleName, ownership, attributes, invariants, sourceAssetRefs.",
    "- sdlc_domain_entity.attributes[] must contain closed sdlc_domain_attribute objects with kind, attributeId, name, valueType, cardinality, invariantRefs.",
    "- moduleSchemaFragments[].operations[] and aggregateDomainModel.operations[] must contain closed sdlc_domain_operation objects with kind, operationId, moduleName, inputEntityIds, outputEntityIds, requiredAttributeIds.",
    "- moduleStateDiagramFragments[].transitions[] must contain closed sdlc_entity_state_transition objects with kind, transitionId, fromState, toState, operationId, entityId.",
    "- aggregateDomainModel.entities[] must contain closed sdlc_aggregate_domain_entity objects with kind, entityId, ownerModuleName, attributes, sourceModuleNames.",
    "- aggregateDomainModel.entities[].attributes[] must contain full closed sdlc_domain_attribute objects. Copy or adapt the owning module schema attribute objects; never emit attribute id strings, names, or summaries in this array. If no valid aggregate attributes are needed, use an empty array.",
    "- aggregateDomainModel.crossModuleReferences[] must contain closed objects with fromModuleName, toModuleName, entityId.",
    "- aggregateSunnyDaySequence.steps[] must contain closed sdlc_sunny_day_sequence_step objects with kind, stepId, moduleName, operationId, inputEntityIds, outputEntityIds, stateTransitionIds.",
    `- designCompletenessVerdict must include kind, verdictVersion, and entity/attribute/flow closed axis verdict objects with kind, axis, status, reasons, evidenceRefs. verdictVersion must be exactly "ts-design-depth-v1". Axis status must be satisfied, partial, or blocked.`,
    "",
    "Minimal nested examples:",
    "- entity: {\"kind\":\"sdlc_domain_entity\",\"entityId\":\"entity:<module>.<name>\",\"moduleName\":\"<module>\",\"ownership\":\"owned\",\"attributes\":[{\"kind\":\"sdlc_domain_attribute\",\"attributeId\":\"attr:<module>.<name>.<field>\",\"name\":\"<field>\",\"valueType\":\"string\",\"cardinality\":\"one\",\"invariantRefs\":[]}],\"invariants\":[],\"sourceAssetRefs\":[\"file://...\"]}",
    "- operation: {\"kind\":\"sdlc_domain_operation\",\"operationId\":\"operation:<module>.<verb>\",\"moduleName\":\"<module>\",\"inputEntityIds\":[],\"outputEntityIds\":[\"entity:<module>.<name>\"],\"requiredAttributeIds\":[]}",
    "- aggregate entity: {\"kind\":\"sdlc_aggregate_domain_entity\",\"entityId\":\"entity:<module>.<name>\",\"ownerModuleName\":\"<module>\",\"attributes\":[{\"kind\":\"sdlc_domain_attribute\",\"attributeId\":\"attr:<module>.<name>.<field>\",\"name\":\"<field>\",\"valueType\":\"string\",\"cardinality\":\"one\",\"invariantRefs\":[]}],\"sourceModuleNames\":[\"<module>\"]}",
    "- transition: {\"kind\":\"sdlc_entity_state_transition\",\"transitionId\":\"transition:<module>.<from>.<to>\",\"fromState\":\"<from>\",\"toState\":\"<to>\",\"operationId\":\"operation:<module>.<verb>\",\"entityId\":\"entity:<module>.<name>\"}",
    "- sequence step: {\"kind\":\"sdlc_sunny_day_sequence_step\",\"stepId\":\"step:<module>.<verb>\",\"moduleName\":\"<module>\",\"operationId\":\"operation:<module>.<verb>\",\"inputEntityIds\":[],\"outputEntityIds\":[\"entity:<module>.<name>\"],\"stateTransitionIds\":[]}",
    "- axis verdict: {\"kind\":\"sdlc_design_completeness_axis_verdict\",\"axis\":\"entity\",\"status\":\"satisfied\",\"reasons\":[\"implementation-design register declares owned entities\"],\"evidenceRefs\":[\"file://...\"]}",
    "",
    "Rules:",
    "- The register is the compact pressure map from design state A to implementation state B; downstream transform.C consumes it as implementation-design truth.",
    "- Prefer a small truthful register over a broad invented architecture, but do not omit source targets, module boundaries, requirement lineage, or stack facts needed to keep pressure on the transformer.",
    "- Register size budget is part of correctness: this evaluator must produce a bounded pressure map, not an exhaustive copy of every requirement table or design paragraph.",
    "- Bounded first-pass register target: one stack profile row, one implementation module row per module, one compact schema fragment per module, at most two entities and two operations per module, one state diagram fragment per module, no more than 18 sunny-day steps, 18 to 32 component rows only when the ADR requires them, and file targets copied from the ADR materialization targets.",
    "- Use feature decomposition rows, ADR component rows, and module/source-root boundaries as the primary component decomposition. Do not derive one component per requirement.",
    "- For a dense full-breadth product, emit 20 to 32 componentTopologyRows/componentRealizationRows when needed; do not exceed 32 component rows without a hard requirement in the ADR.",
    "- Keep moduleSchemaFragments compact: one fragment per implementation module, with representative entities and operations sufficient to preserve transformer pressure. Do not model every possible field, proof artifact, or test case as a separate entity.",
    "- Keep aggregateDomainModel compact: summarize cross-module domain shape with no more than 16 aggregate entities and no more than 24 aggregate operations.",
    "- Keep aggregateSunnyDaySequence compact: use no more than 18 steps that show the main public happy path and proof-output flow.",
    "- Requirement ids on component rows are pressure samples for that component, not the full trace ledger. Carry 3 to 8 local/high-signal requirementIds per component row and leave full global trace coverage in the ADR, feature decomposition, and requirement surfaces.",
    "- Do not repeat the same large requirement id list across many rows.",
    "- Use the construction brief stagePressure and target carrier refs to decide which staged authority this register must satisfy.",
    "- Treat the ADR as candidate transform evidence, not the full truth; correct underspecified ADR rows by evaluating the workspace and ledgers.",
    "- Use the ADR Product File Targets table for fileTargetRows, but keep fileTargetRows to materialized product file roles.",
    "- Canonical fileTargetRows[].role values are source, test, build_config, design, documentation, or other.",
    "- A source row marked deferred is still a materialized product target; emit it with role source.",
    "- For a trivial product, fileTargetRows must name only downstream materialized product targets such as source, test, or build_config files; do not include the current ADR/design document as a file target.",
    "- componentTopologyRows and componentRealizationRows must not be empty for implementation-design registers.",
    "- Do not collapse the register to manifest-only when source/runtime requirements are present in the ADR requirement lineage, construction brief, invocation package, or worker stderr.",
    "- Requirements that imply separable public/runtime/data/test boundaries must become separate component-level realization rows unless the register gives a specific shared-component rationale in publicBoundary and designCompletenessVerdict.reasons.",
    "- Trivial product override: when the workspace/constraints/ADR identify a trivial product or one tiny executable/script target, keep one componentTopologyRows row and one componentRealizationRows row for the shared source target unless there are separate source files or a hard accepted authority requiring separate product components. Carry runtime, route, response, and proof requirement ids as facets of that one component with an explicit shared-component rationale.",
    "- If accepted authority says a source target is an executable, script, program, CLI, service entrypoint, or must print/emit/respond when run, preserve that executable-entrypoint obligation in publicBoundary and designCompletenessVerdict reasons. Do not downgrade it to an import-only helper boundary unless an admitted authority explicitly says the product is library-only.",
    "- Do not split a trivial single-file service into runtime_binding, response, and proof-support components when all behavior is intentionally implemented in the same source file.",
    "- Fail your own self-check and rewrite if the register assigns unrelated source/runtime/data/test obligations to one coarse component without a specific cohesion rationale.",
    "- When a requirement lineage row says a source obligation is deferred to a downstream source-materialization edge, create the implementation component topology/realization row for that source target now and carry the deferred requirement id on that component.",
    "- Staged decomposition admission is mandatory: each componentTopologyRows[] or componentRealizationRows[] row must own no more than 8 requirementIds.",
    "- If one module or source root owns more than 8 requirement ids, split it into multiple component rows under the same module/source root with distinct componentIds and publicBoundary values.",
    "- Keep upstreamComponentIds as component ids only; never use requirement ids as upstream component ids.",
    "- Target enough componentRealizationRows so component-row pressure density remains 8 or less without copying the full global requirement ledger into every row.",
    "- Before final response, reject and rewrite the register if any component row has more than 8 requirementIds or repeats a global requirement list.",
    "- Every componentTopologyRows[].relativePath and componentRealizationRows[].relativePath must have a matching fileTargetRows entry with role source.",
    "- If the ADR repeats the same file path for behavioral roles such as runtime_binding, route, response, smoke proof, execution proof, or deferred implementation behavior, emit one fileTargetRows entry with the materialization role and carry those behavioral requirement ids on componentTopologyRows/componentRealizationRows instead.",
    "- Use only source/application implementation targets for componentTopologyRows and componentRealizationRows.",
    "- Do not turn test, proof-test, package, runtime-config, documentation, or build-context targets into implementation components; keep those only in fileTargetRows.",
    "- componentId and moduleName must be stable identifier tokens without spaces; prefer lowercase words joined by '-' or '_'.",
    "- publicBoundary must be a meaningful product behavior or module contract from the ADR; do not use placeholders such as implementation-core, module-root, component, or target.",
    "- concernRole must be one of the allowed values exactly; use \"other\" for simple executable entrypoints or glue unless admitted source authority clearly maps the component to parser, validator, mapper, error_model, io_adapter, reporting, or domain_model.",
    "- Preserve requirement ids exactly as written in the ADR or construction brief.",
    "- Use file:// evidence refs for the ADR transform artifact.",
    "- If the product is trivial, keep the register trivial; do not invent modules, entities, APIs, persistence, or multiple same-file components.",
    "- designCompletenessVerdict evaluates the implementation-design surface only. Do not mark an axis partial or blocked merely because source materialization, test design, execution, or runtime proof happens on a downstream edge.",
    "- Before the final response, re-open the JSON you wrote and verify that every typed nested item above is an object with exactly the declared fields, not a string, Markdown paragraph, or partial object.",
    "- Self-check the size budget before final response: component rows are between 1 and 32, every component row has 8 or fewer requirementIds, aggregate entities are 16 or fewer, aggregate operations are 24 or fewer, and sunny-day steps are 18 or fewer.",
    `- Required self-check before final response: run a local JSON check over the content ledger file and rewrite until it passes. At minimum, verify contentRows[0] has exactly kind, rowRef, authorityFunction, carrierFamily, contentKind, payload, sourceBasisRefs, evidenceRefs; verify payload.registerVersion, payload.aggregateDomainModel.modelVersion, payload.aggregateSunnyDaySequence.sequenceVersion, and payload.designCompletenessVerdict.verdictVersion are exactly "ts-design-depth-v1"; verify contentRows[0].payload arrays contain objects, not strings: stackProfileRows, implementationModuleRows, aggregateDomainModelRows, moduleSchemaFragments, moduleSchemaFragments[].entities, moduleSchemaFragments[].entities[].attributes, moduleSchemaFragments[].operations, moduleStateDiagramFragments, moduleStateDiagramFragments[].transitions, aggregateDomainModel.entities, aggregateDomainModel.entities[].attributes, aggregateDomainModel.operations, aggregateDomainModel.crossModuleReferences, aggregateSunnyDaySequence.steps, componentTopologyRows, componentRealizationRows, fileTargetRows.`,
    "- Do not run another exploratory command after deciding the component/module set; write the content ledger file first, then validate that file.",
    `- Self-check target file: ${input.contentLedgerPath}`,
    "- Do not include Markdown fences, explanation, comments, or trailing prose in the content ledger file.",
    "- After writing the content ledger, respond with a one-line summary only."
  ].join("\n");
}

function workerResultReportSummaryForDesignDepthPrompt(
  workerReportPath: string
): readonly string[] {
  try {
    const report = objectValue(JSON.parse(readFileSync(workerReportPath, "utf8")));
    if (report === null) {
      return Object.freeze([
        "worker_result_report.json was present but not a JSON object; treat report pressure as unavailable and write an honest partial register."
      ]);
    }
    const obligationAssessments = Array.isArray(report["obligationAssessments"])
      ? report["obligationAssessments"]
      : [];
    const statusCounts = new Map<string, number>();
    const nonFulfilledSamples: string[] = [];
    for (const rawAssessment of obligationAssessments) {
      const assessment = objectValue(rawAssessment);
      if (assessment === null) {
        continue;
      }
      const status =
        stringValue(assessment["fulfillmentStatus"]) ??
        stringValue(assessment["status"]) ??
        "unknown";
      statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
      if (status !== "fulfilled" && nonFulfilledSamples.length < 8) {
        const obligationId =
          stringValue(assessment["obligationId"]) ??
          stringValue(assessment["id"]) ??
          "unknown";
        nonFulfilledSamples.push(`${obligationId}:${status}`);
      }
    }
    const materializedFiles = Array.isArray(report["materializedFiles"])
      ? report["materializedFiles"].length
      : 0;
    const unresolvedReasons = Array.isArray(report["unresolvedReasons"])
      ? report["unresolvedReasons"].length
      : 0;
    const statusDistribution =
      statusCounts.size === 0
        ? "none"
        : [...statusCounts.entries()]
            .map(([status, count]) => `${status}=${count}`)
            .join(", ");
    const summary = stringValue(report["summary"]);
    return Object.freeze([
      `report kind=${stringValue(report["kind"]) ?? "unknown"}`,
      `obligationAssessments=${obligationAssessments.length}; status field is fulfillmentStatus; distribution=${statusDistribution}`,
      `nonFulfilledSample=${nonFulfilledSamples.length === 0 ? "none" : nonFulfilledSamples.join(", ")}`,
      `materializedFiles=${materializedFiles}; unresolvedReasons=${unresolvedReasons}`,
      `summary=${summary === null ? "none" : summary.slice(0, 240)}`
    ]);
  } catch (error) {
    return Object.freeze([
      `worker_result_report.json could not be summarized by the system (${error instanceof Error ? error.message : "unknown error"}); write an honest partial register instead of timing out.`
    ]);
  }
}

async function materializeDesignDepthRegisterWithFpEvaluator(input: {
  readonly transport: SdlcWorkerTransportContract;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly pluginInput: EnginePluginInput;
  readonly basis: ExecutionBasis;
  readonly eventSink: (event: RuntimeEvent) => void;
}): Promise<EvaluationRuleOutcome> {
  const manifestPath = join(input.manifest.archiveRoot, "handoff_manifest.json");
  const constructionBriefPath = join(
    input.manifest.archiveRoot,
    "worker_construction_brief.json"
  );
  const invocationPackagePath = join(
    input.manifest.archiveRoot,
    "worker_invocation_package.json"
  );
  const workerReportPath = join(input.manifest.archiveRoot, "worker_result_report.json");
  const workCategoryGovernance = selectSdlcWorkCategoryGovernance(input.manifest);
  const governancePath = join(
    input.manifest.workspaceRoot,
    workCategoryGovernance.workerPath
  );
  const contentLedgerPath = designDepthFpEvaluatorContentLedgerPath({
    archiveRoot: input.manifest.archiveRoot
  });
  const registerPath = designDepthFpEvaluatorRegisterPath(input.manifest);
  const promptPath = join(
    input.manifest.archiveRoot,
    "design_depth_fp_evaluator_prompt.md"
  );
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "design_depth_fp_evaluator_prompt.md",
    payload: designDepthFpEvaluatorPrompt({
      manifest: input.manifest,
      manifestPath,
      governanceRef: workCategoryGovernance.configRef,
      governancePath,
      constructionBriefPath,
      invocationPackagePath,
      workerReportPath,
      workerReportSummaryLines:
        workerResultReportSummaryForDesignDepthPrompt(workerReportPath),
      contentLedgerPath,
      registerProjectionPath: registerPath,
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef ?? null
    })
  });
  const stdoutPath = join(
    input.manifest.archiveRoot,
    "design_depth_fp_evaluator_stdout.log"
  );
  const stderrPath = join(
    input.manifest.archiveRoot,
    "design_depth_fp_evaluator_stderr.log"
  );
  const processStartedPath = join(
    input.manifest.archiveRoot,
    "design_depth_fp_evaluator_process_started.json"
  );
  const processEventsPath = join(
    input.manifest.archiveRoot,
    "design_depth_fp_evaluator_process_events.jsonl"
  );
  const outputLastMessagePath =
    input.transport.agentKey === "codex"
      ? join(input.manifest.archiveRoot, "design_depth_fp_evaluator_last_message.txt")
      : "";
  const executorProfile = selectedWorkerExecutorProfile();
  const processLaunch = processLaunchForWorker({
    transport: input.transport,
    manifestPath,
    manifest: input.manifest,
    promptPath,
    outputLastMessagePath,
    executorProfile
  });
  const inactivityPolicy = workerInactivityPolicy();
  const evaluatorTimeoutMs = designDepthFpEvaluatorTimeoutMs();
  const stdoutBudgetBytes = designDepthFpEvaluatorStdoutBudgetBytes();
  const traceRoot = `${processEventsPath}.trace`;
  const processResult = await invokeSupervisedProcessActor({
    invocation: actorInvocationForPluginInput({
      pluginInput: input.pluginInput,
      transport: input.transport
    }),
    command: processLaunch.command,
    args: processLaunch.args,
    cwd: input.manifest.workspaceRoot,
    environment: {
      ...installedOperatorChildProcessEnvironment(),
      ODD_SDLC_EVALUATE_STAGE: "design_depth_content_ledger",
      ODD_SDLC_EVALUATOR_CONTENT_LEDGER: contentLedgerPath,
      ODD_SDLC_EVALUATOR_REGISTER_PROJECTION: registerPath,
      ODD_SDLC_EVALUATOR_PROMPT: promptPath,
      ODD_SDLC_EVALUATOR_SOURCE_ARTIFACT: input.manifest.outputFile,
      ODD_SDLC_EVALUATOR_SELECTED_COMPOSITION_REF:
        input.pluginInput.selectedCompositionRef,
      ODD_SDLC_EVALUATOR_SELECTED_COMPOSITION_DIGEST:
        input.pluginInput.selectedCompositionDigest,
      ODD_SDLC_EVALUATOR_SELECTED_COMPOSITION_SELECTION_REF:
        input.pluginInput.selectedCompositionSelectionRef,
      ODD_SDLC_EVALUATOR_SELECTED_REGIME_BINDING_REF:
        input.pluginInput.selectedRegimeBindingRef ?? "",
      ODD_SDLC_EVALUATOR_COMPOSITION_CONTRIBUTION_REF:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef
    },
    environmentPolicy: environmentPolicyForTransport(input.transport),
    stdin: processLaunch.stdin,
    stdoutPath,
    stderrPath,
    stdoutRef: pathToFileURL(stdoutPath).href,
    stderrRef: pathToFileURL(stderrPath).href,
    processStartedPath,
    processEventsPath,
    parser: parserForWorkerTransport(input.transport),
    executorProfile,
    timeoutMs: evaluatorTimeoutMs,
    terminationGraceMs: inactivityPolicy.terminationGraceMs,
    heartbeatMs: inactivityPolicy.heartbeatMs,
    eventSink: input.eventSink
  });
  const stdoutByteCount = fileByteCount(stdoutPath);
  const stderrByteCount = fileByteCount(stderrPath);
  const runRef = pathToFileURL(
    join(input.manifest.archiveRoot, "design_depth_fp_evaluator_run.json")
  ).href;
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "design_depth_fp_evaluator_run.json",
    payload: Object.freeze({
      kind: "sdlc_design_depth_fp_evaluator_run",
      command: processResult.command,
      args: processResult.args,
      cwd: processResult.cwd,
      status: processResult.status,
      signal: processResult.signal,
      elapsedMs: processResult.elapsedMs,
      timedOut: processResult.timedOut,
      error: processResult.error,
      timeoutMs: evaluatorTimeoutMs,
      workerTimeoutMs: inactivityPolicy.timeoutMs,
      stdoutBudgetBytes,
      stdoutByteCount,
      stderrByteCount,
      stdoutRef: pathToFileURL(stdoutPath).href,
      stderrRef: pathToFileURL(stderrPath).href,
      promptRef: pathToFileURL(promptPath).href,
      contentLedgerRef: pathToFileURL(contentLedgerPath).href,
      registerProjectionRef: pathToFileURL(registerPath).href,
      processEventsRef: pathToFileURL(processEventsPath).href,
      traceRoot,
      traceResultRef: fileRef(traceResultPath(traceRoot))
    })
  });
  const evidenceRefs = uniqueSorted([
    pathToFileURL(promptPath).href,
    pathToFileURL(input.manifest.outputFile).href,
    pathToFileURL(stdoutPath).href,
    pathToFileURL(stderrPath).href,
    pathToFileURL(processEventsPath).href,
    runRef
  ]);
  if (processResult.status !== 0) {
    return constructEvaluationRuleOutcome({
      status: "blocked",
      ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
      ruleRole: "semantic_judgment",
      computeMeans: "F_P",
      evidenceRefs,
      diagnosticRefs: evidenceRefs,
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
      compositionContributionRef:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef,
      reason: "design_depth_fp_evaluator_process_failed"
    });
  }
  const contentLedgerAdmission = admitSdlcEvaluateContentLedgerArtifact({
    ledgerPath: contentLedgerPath,
    pluginInput: input.pluginInput,
    ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
    authorityFunction: "synthesize_model",
    computeMeans: "F_P"
  });
  if (
    contentLedgerAdmission.status !== "admitted" ||
    contentLedgerAdmission.ledger === null
  ) {
    const diagnosticRefs = uniqueSorted([
      ...evidenceRefs,
      ...contentLedgerAdmission.evidenceRefs
    ]);
    const residualPressureRefs = [
      ...contentLedgerAdmission.blockingReasons.map(
        (reason: string) =>
          `pressure://odd-sdlc/design-depth-fp-evaluator/${encodeURIComponent(reason)}`
      ),
      ...(stdoutByteCount > stdoutBudgetBytes
        ? [
            `pressure://odd-sdlc/design-depth-fp-evaluator/stdout-budget-exceeded/${String(stdoutByteCount)}`
          ]
        : [])
    ];
    return constructEvaluationRuleOutcome({
      status: "blocked",
      ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
      ruleRole: "semantic_judgment",
      computeMeans: "F_P",
      evidenceRefs: diagnosticRefs,
      residualPressureRefs: Object.freeze(residualPressureRefs),
      diagnosticRefs,
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
      compositionContributionRef:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef,
      reason: contentLedgerAdmission.blockingReasons.join(",") || "design_depth_fp_evaluator_content_ledger_rejected"
    });
  }
  let registerProjectionRef: string;
  try {
    registerProjectionRef = writeDesignDepthRegisterProjectionFromEvaluateContentLedger({
      ledger: contentLedgerAdmission.ledger,
      archiveRoot: input.manifest.archiveRoot,
      registerPath
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "design_depth_register_projection_failed";
    const diagnosticRefs = uniqueSorted([
      ...evidenceRefs,
      ...contentLedgerAdmission.evidenceRefs
    ]);
    return constructEvaluationRuleOutcome({
      status: "blocked",
      ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
      ruleRole: "semantic_judgment",
      computeMeans: "F_P",
      evidenceRefs: diagnosticRefs,
      residualPressureRefs: Object.freeze([
        `pressure://odd-sdlc/design-depth-fp-evaluator/${encodeURIComponent(reason)}`
      ]),
      diagnosticRefs,
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
      compositionContributionRef:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef,
      reason
    });
  }
  const admission = admitImplementationDesignRegisterCandidateForManifest({
    manifest: input.manifest
  });
  if (admission.status !== "admitted" || admission.register === null) {
    const diagnosticRefs = uniqueSorted([
      ...evidenceRefs,
      ...contentLedgerAdmission.evidenceRefs,
      ...admission.evidenceRefs
    ]);
    const residualPressureRefs = [
      ...admission.blockingReasons.map(
        (reason: string) =>
          `pressure://odd-sdlc/design-depth-fp-evaluator/${encodeURIComponent(reason)}`
      ),
      ...(stdoutByteCount > stdoutBudgetBytes
        ? [
            `pressure://odd-sdlc/design-depth-fp-evaluator/stdout-budget-exceeded/${String(stdoutByteCount)}`
          ]
        : [])
    ];
    return constructEvaluationRuleOutcome({
      status: "blocked",
      ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
      ruleRole: "semantic_judgment",
      computeMeans: "F_P",
      evidenceRefs: diagnosticRefs,
      residualPressureRefs: Object.freeze(residualPressureRefs),
      diagnosticRefs,
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
      compositionContributionRef:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef,
      reason: admission.blockingReasons.join(",") || "design_depth_fp_evaluator_register_projection_rejected"
    });
  }
  return constructEvaluationRuleOutcome({
    status: "accepted",
    ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
    ruleRole: "semantic_judgment",
    computeMeans: "F_P",
    producedRegisterRefs: Object.freeze([
      pathToFileURL(contentLedgerPath).href,
      registerProjectionRef
    ]),
    evidenceRefs: uniqueSorted([
      ...evidenceRefs,
      ...contentLedgerAdmission.evidenceRefs,
      ...admission.evidenceRefs
    ]),
    findingRefs: Object.freeze([
      `finding://odd-sdlc/${manifestRefSegment(input.manifest)}/evaluate/design-depth-register`
    ]),
    selectedCompositionRef: input.pluginInput.selectedCompositionRef,
    selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
    selectedCompositionSelectionRef:
      input.pluginInput.selectedCompositionSelectionRef,
    selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
    compositionContributionRef:
      input.pluginInput.selectedRegimeBindingRef ??
      input.pluginInput.selectedCompositionRef
  });
}

function writeDesignDepthFpEvaluatorRuleOutcomeProof(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly outcome: EvaluationRuleOutcome;
}): string {
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE,
    payload: input.outcome
  });
  return pathToFileURL(
    join(input.manifest.archiveRoot, DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE)
  ).href;
}

function reviewGradeEdgeFulfillmentPrompt(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly governanceRef: string;
  readonly governancePath: string;
  readonly constructionBriefPath: string;
  readonly invocationPackagePath: string;
  readonly workerReportPath: string;
  readonly assessmentPath: string;
}): string {
  return [
    "odd_sdlc evaluate.C/F_P review-grade edge fulfillment rule.",
    "",
    "Purpose:",
    "- Review the generated asset against incoming requirements, accepted upstream authority, stage boundary, evidence, and likely failure modes.",
    "- This is semantic evaluation work. Do not rewrite source, tests, design artifacts, reports, ledgers, or framework files.",
    "- The assessment file is an evaluation sidecar consumed by the existing SdlcWorkerObligationAssessment -> SdlcEdgeFulfillmentLedger path. It is not a new closure ledger.",
    "",
    "Read in order:",
    `1. compressed work-category governance (${input.governanceRef}): ${input.governancePath}`,
    `2. construction brief: ${input.constructionBriefPath}`,
    `3. invocation package: ${input.invocationPackagePath}`,
    `4. worker result report: ${input.workerReportPath}`,
    "5. generated asset artifacts named by worker_result_report.materializedFiles.",
    "6. product_materialization_manifest.json in the same archive when present.",
    "7. accepted design-depth register refs from construction_brief.stagePressure.designDepthEvaluatorRegisterRefs when present.",
    "",
    "Reading discipline:",
    "- Do not print full files, full JSON objects, full requirement tables, or full source files to stdout.",
    "- Use targeted scripts that print compact counts or short ids only.",
    "- Terminal output is a work trace. The JSON assessment file is the evaluation truth.",
    "- If reviewedObligationIds is large, create the assessment with a short local script: load worker_result_report, map every fulfilled carryover row to a compact fulfilled finding, explicitly override only open findings, write JSON to the assessment path, then parse it back.",
    "- Do not manually type or stream a large findings array through stdout. Write the durable JSON file and print only compact status counts.",
    "",
    `Durable assessment artifact to create and validate: ${input.assessmentPath}`,
    "",
    "Required JSON shape:",
    "- kind: \"sdlc_review_grade_edge_fulfillment_assessment\"",
    "- assessmentVersion: \"ts-review-grade-v1\"",
    `- graphFunctionName: ${JSON.stringify(input.manifest.graphFunctionName)}`,
    `- edgeName: ${JSON.stringify(input.manifest.edgeName)}`,
    `- targetAssetType: ${JSON.stringify(input.manifest.targetAssetType)}`,
    "- status: \"passed\" or \"blocked\"",
    "- reviewedObligationIds: every obligation id from worker_result_report.obligationAssessments and invocation package inline obligations",
    "- findings[]: one sdlc_review_grade_obligation_finding per reviewed obligation id",
    "- evidenceRefs: refs for the assessment, generated assets, accepted authority, and review evidence",
    "- summary: one compact sentence",
    "- No other top-level keys are allowed.",
    "",
    "Finding shape:",
    "- kind: \"sdlc_review_grade_obligation_finding\"",
    "- obligationId: exact obligation id",
    "- fulfillmentStatus: fulfilled, partial, blocked, or unassessed",
    "- failureClass: null when fulfilled, otherwise one of trace_missing, semantic_not_realized, boundary_collapsed, wrong_stage, schema_invalid, execution_environment, test_overlap_missing",
    "- requiredAction: null when fulfilled, otherwise the concrete work item the next transform must complete",
    "- evidenceRefs: generated asset refs and diagnostic refs used for this judgment",
    "- acceptedAuthorityRefs: non-empty requirement/design/depth/test/target-carrier authority refs used for this judgment",
    "- fulfillmentBinding: null unless this finding is a fulfilled component_code_surface finding. On component_code_surface, every fulfilled finding must provide it, including target_asset, source_asset, module, source_set, inline, aggregate, and requirement rows.",
    "- rationale: compact reason for the judgment",
    "- No other finding keys are allowed. Do not add helper booleans, carryover flags, scores, sourceAssetCarryover, sourceAssetStatus, confidence, or notes fields.",
    "",
    "fulfillmentBinding shape when required:",
    "- kind: \"sdlc_requirement_function_fulfillment_binding\"",
    "- requirementRef: exact obligation id",
    "- productRequirementRef: accepted product requirement ref or exact obligation id when no narrower product-requirement ref exists",
    "- designObligationRef: accepted design/depth/component row ref that assigned the obligation",
    "- componentRef: accepted component/module ref",
    "- productTargetRef: target carrier or declared product-file target ref",
    "- codeSurfaceRef: generated source file/API/route/CLI/service ref",
    "- functionOrEntrypointRef: concrete function, exported API, route, CLI command, service entrypoint, executable script, or equivalent public behavior ref",
    "- realizationEvidenceRefs: source/runtime evidence refs proving the binding",
    "- testOrExecutionEvidenceRefs: test, execution, or evaluator evidence refs that hold the binding to account",
    "- evaluatorFindingRef: stable finding ref for this evaluation finding",
    "",
    "Review rules:",
    "- A requirement tag, file path, schema-valid report, or passing smoke output is evidence, not proof by itself.",
    "- Every finding must include at least one acceptedAuthorityRef. Do not emit an empty acceptedAuthorityRefs array for target_asset, source_set, inline, or aggregate findings.",
    "- For target_asset findings, use the construction brief targetCarrierProjection target carrier refs plus the accepted authority files that governed the generated asset.",
    "- Mark partial or blocked when an asset exists but does not plausibly implement the accepted responsibility.",
    "- Mark boundary_collapsed when generated source collapses multiple accepted component rows back into a coarse facade.",
    "- Mark semantic_not_realized when requirement tags are present but the behavior is absent, stubbed, placeholder, or not connected to the exported/public boundary.",
    "- Mark semantic_not_realized when accepted authority requires executable/script/program behavior but the source only exports a helper or function and has no entrypoint path that runs the product behavior when the file is invoked. A test calling a helper is overlap evidence, not executable-product proof.",
    "- Requirement lineage is transformer-owned semantic evidence, not a postflight closure shortcut. Inspect worker_result_report.materializedFiles, product_materialization_manifest.files, selected target-carrier materializedFiles, and native file tags/comments where the file format permits them.",
    "- Mark trace_missing when a generated product file is used as fulfillment evidence but carries no lineage in the asset itself, selected target carrier, worker report, or materialization manifest. Do not pass by file existence, digest, or test success alone.",
    "- For every component_code_surface fulfilled finding, bind obligationId -> product requirement when available -> design/depth obligation -> component/product target -> function/API/route/CLI/entrypoint -> evidence in fulfillmentBinding.",
    "- For component_code_surface source_asset, module, target_asset, source_set, inline, or aggregate findings, use the exact obligationId as requirementRef and productRequirementRef when no narrower product requirement exists, but still bind the finding to the concrete generated entrypoint/public behavior and evidence.",
    "- A fulfilled component_code_surface finding with fulfillmentBinding:null is invalid and will be retried, even when the obligation is module-level or source-asset-level carryover.",
    "- Mark semantic_not_realized or schema_invalid when tenant stack authority contradicts emitted product files, for example declaring one module system while generated source/test syntax requires another. The worker must repair the authority surface or the product files; documenting an override in prose is not enough.",
    "- When the generated asset includes a declared executable or test execution contract that can run locally without network or destructive side effects, execute it from the declared working directory and use the observed exit/stdout/stderr as evaluation evidence. If it fails, mark the relevant obligation blocked with execution_environment or semantic_not_realized instead of passing by inspection.",
    "- Mark test_overlap_missing when accepted depth requires test overlap and the generated tests do not exercise the responsibility.",
    "- For component_code_surface, compare source files to accepted design-depth componentRealizationRows and fileTargetRows.",
    "- For component_test_surface, compare generated tests to accepted testcase/test-design authority and source responsibilities.",
    "- For every other target asset type, compare the generated asset to incoming obligations, accepted upstream authority, target carrier expectations, stage boundary, and evidence overlap.",
    "- If all reviewed obligations are fulfilled, status must be passed and every finding failureClass/requiredAction must be null.",
    "- If any reviewed obligation is partial, blocked, or unassessed, status must be blocked and every non-fulfilled finding must include failureClass and requiredAction.",
    "- Before final response, re-open and parse the assessment JSON. Verify the top-level key set is exactly kind, assessmentVersion, graphFunctionName, edgeName, targetAssetType, status, reviewedObligationIds, findings, evidenceRefs, summary.",
    "- Verify every finding key set is exactly kind, obligationId, fulfillmentStatus, failureClass, requiredAction, evidenceRefs, acceptedAuthorityRefs, fulfillmentBinding, rationale.",
    "- Rewrite until it is valid whole-file JSON with no Markdown fences, comments, trailing prose, or extra keys.",
    "- Final response must be one line: reviewStatus=<passed|blocked> reviewed=<n> blocked=<n>."
  ].join("\n");
}

function workerReportWithReviewGradeAssessment(input: {
  readonly report: SdlcWorkerResultReport;
  readonly assessment: SdlcReviewGradeEdgeFulfillmentAssessment;
}): SdlcWorkerResultReport {
  const existingById = new Map(
    input.report.obligationAssessments.map((assessment) => [
      assessment.obligationId,
      assessment
    ])
  );
  const findingById = new Map(
    input.assessment.findings.map((finding) => [finding.obligationId, finding])
  );
  const statusWeight = (
    status: SdlcWorkerObligationFulfillmentStatus
  ): number => {
    switch (status) {
      case "fulfilled":
        return 0;
      case "unassessed":
        return 1;
      case "partial":
        return 2;
      case "blocked":
        return 3;
    }
  };
  const stricterStatus = (
    left: SdlcWorkerObligationFulfillmentStatus,
    right: SdlcWorkerObligationFulfillmentStatus
  ): SdlcWorkerObligationFulfillmentStatus =>
    statusWeight(left) >= statusWeight(right) ? left : right;
  const reviewed = new Set(input.assessment.reviewedObligationIds);
  const reviewedRows = input.assessment.reviewedObligationIds.flatMap((obligationId) => {
    const finding = findingById.get(obligationId);
    if (finding === undefined) {
      return [];
    }
    const existing = existingById.get(obligationId);
    const existingStatus =
      existing === undefined
        ? "fulfilled"
        : existing.blockingReasons.length > 0 &&
            existing.fulfillmentStatus === "fulfilled"
          ? "blocked"
          : existing.fulfillmentStatus;
    const fulfillmentStatus = stricterStatus(
      existingStatus,
      finding.fulfillmentStatus
    );
    const blockingReasons = uniqueSorted([
      ...(existing?.blockingReasons ?? Object.freeze([])),
      ...(finding.fulfillmentStatus === "fulfilled"
        ? Object.freeze([])
        : Object.freeze([
            finding.failureClass ?? "review_grade_open",
            finding.requiredAction ?? "required_action_missing"
          ]))
    ]);
    const requiredAction =
      fulfillmentStatus === "fulfilled"
        ? null
        : finding.requiredAction ?? existing?.blockingReasons[0] ?? "required_action_missing";
    return [
      Object.freeze({
        kind: "sdlc_worker_obligation_assessment" as const,
        obligationId,
        fulfillmentStatus,
        evidenceRefs: uniqueSorted([
          ...(existing?.evidenceRefs ?? Object.freeze([])),
          ...finding.evidenceRefs,
          ...input.assessment.evidenceRefs
        ]),
        blockingReasons,
        reviewGrade: true,
        reviewFailureClass: finding.failureClass,
        requiredAction,
        semanticEvidenceRefs: finding.evidenceRefs,
        acceptedAuthorityRefs: finding.acceptedAuthorityRefs,
        fulfillmentBinding: finding.fulfillmentBinding
      })
    ];
  });
  const unreviewedRows = input.report.obligationAssessments.filter(
    (assessment) => !reviewed.has(assessment.obligationId)
  );
  return Object.freeze({
    ...input.report,
    obligationAssessments: Object.freeze([...reviewedRows, ...unreviewedRows])
  });
}

function reviewGradePostflight(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly code: SdlcBlockingReasonCode;
  readonly details: readonly string[];
  readonly evidenceRefs: readonly string[];
}): SdlcPostflightResult {
  const detail =
    input.details.length === 0 ? input.code : input.details.slice(0, 12).join("; ");
  const carrier = makeSdlcBlockingReason({
    code: input.code,
    detail,
    evidenceRefs: input.evidenceRefs
  });
  return Object.freeze({
    kind: "sdlc_operator_postflight_result" as const,
    status: "blocked" as const,
    blockingReasons: Object.freeze([legacyBlockingReasonCode(carrier)]),
    blockingReasonCarriers: Object.freeze([carrier]),
    evidenceRefs: input.evidenceRefs
  });
}

async function materializeReviewGradeEdgeFulfillmentWithFpEvaluator(input: {
  readonly transport: SdlcWorkerTransportContract;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly pluginInput: EnginePluginInput;
  readonly eventSink: (event: RuntimeEvent) => void;
}): Promise<EvaluationRuleOutcome> {
  const manifestPath = join(input.manifest.archiveRoot, "handoff_manifest.json");
  const constructionBriefPath = join(
    input.manifest.archiveRoot,
    "worker_construction_brief.json"
  );
  const invocationPackagePath = join(
    input.manifest.archiveRoot,
    "worker_invocation_package.json"
  );
  const workerReportPath = join(input.manifest.archiveRoot, "worker_result_report.json");
  const workCategoryGovernance = selectSdlcWorkCategoryGovernance(input.manifest);
  const assessmentPath = join(
    input.manifest.archiveRoot,
    REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE
  );
  const promptPath = join(
    input.manifest.archiveRoot,
    "review_grade_edge_fulfillment_prompt.md"
  );
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "review_grade_edge_fulfillment_prompt.md",
    payload: reviewGradeEdgeFulfillmentPrompt({
      manifest: input.manifest,
      governanceRef: workCategoryGovernance.configRef,
      governancePath: join(input.manifest.workspaceRoot, workCategoryGovernance.workerPath),
      constructionBriefPath,
      invocationPackagePath,
      workerReportPath,
      assessmentPath
    })
  });
  const stdoutPath = join(
    input.manifest.archiveRoot,
    "review_grade_edge_fulfillment_stdout.log"
  );
  const stderrPath = join(
    input.manifest.archiveRoot,
    "review_grade_edge_fulfillment_stderr.log"
  );
  const processStartedPath = join(
    input.manifest.archiveRoot,
    "review_grade_edge_fulfillment_process_started.json"
  );
  const processEventsPath = join(
    input.manifest.archiveRoot,
    "review_grade_edge_fulfillment_process_events.jsonl"
  );
  const outputLastMessagePath =
    input.transport.agentKey === "codex"
      ? join(input.manifest.archiveRoot, "review_grade_edge_fulfillment_last_message.txt")
      : "";
  const executorProfile = selectedWorkerExecutorProfile();
  const processLaunch = processLaunchForWorker({
    transport: input.transport,
    manifestPath,
    manifest: input.manifest,
    promptPath,
    outputLastMessagePath,
    executorProfile
  });
  const inactivityPolicy = workerInactivityPolicy();
  const evaluatorTimeoutMs = designDepthFpEvaluatorTimeoutMs();
  const stdoutBudgetBytes = designDepthFpEvaluatorStdoutBudgetBytes();
  const traceRoot = `${processEventsPath}.trace`;
  const processResult = await invokeSupervisedProcessActor({
    invocation: actorInvocationForPluginInput({
      pluginInput: input.pluginInput,
      transport: input.transport
    }),
    command: processLaunch.command,
    args: processLaunch.args,
    cwd: input.manifest.workspaceRoot,
    environment: {
      ...installedOperatorChildProcessEnvironment(),
      ODD_SDLC_EVALUATE_STAGE: "review_grade_edge_fulfillment",
      ODD_SDLC_EVALUATOR_ASSESSMENT: assessmentPath,
      ODD_SDLC_EVALUATOR_PROMPT: promptPath,
      ODD_SDLC_EVALUATOR_WORKER_REPORT: workerReportPath
    },
    environmentPolicy: environmentPolicyForTransport(input.transport),
    stdin: processLaunch.stdin,
    stdoutPath,
    stderrPath,
    stdoutRef: pathToFileURL(stdoutPath).href,
    stderrRef: pathToFileURL(stderrPath).href,
    processStartedPath,
    processEventsPath,
    parser: parserForWorkerTransport(input.transport),
    executorProfile,
    timeoutMs: evaluatorTimeoutMs,
    terminationGraceMs: inactivityPolicy.terminationGraceMs,
    heartbeatMs: inactivityPolicy.heartbeatMs,
    eventSink: input.eventSink
  });
  const stdoutByteCount = fileByteCount(stdoutPath);
  const stderrByteCount = fileByteCount(stderrPath);
  const runRef = pathToFileURL(
    join(input.manifest.archiveRoot, "review_grade_edge_fulfillment_run.json")
  ).href;
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "review_grade_edge_fulfillment_run.json",
    payload: Object.freeze({
      kind: "sdlc_review_grade_edge_fulfillment_run",
      command: processResult.command,
      args: processResult.args,
      cwd: processResult.cwd,
      status: processResult.status,
      signal: processResult.signal,
      elapsedMs: processResult.elapsedMs,
      timedOut: processResult.timedOut,
      error: processResult.error,
      timeoutMs: evaluatorTimeoutMs,
      workerTimeoutMs: inactivityPolicy.timeoutMs,
      stdoutBudgetBytes,
      stdoutByteCount,
      stderrByteCount,
      stdoutRef: pathToFileURL(stdoutPath).href,
      stderrRef: pathToFileURL(stderrPath).href,
      promptRef: pathToFileURL(promptPath).href,
      assessmentRef: pathToFileURL(assessmentPath).href,
      processEventsRef: pathToFileURL(processEventsPath).href,
      traceRoot,
      traceResultRef: fileRef(traceResultPath(traceRoot))
    })
  });
  const evidenceRefs = uniqueSorted([
    pathToFileURL(promptPath).href,
    pathToFileURL(workerReportPath).href,
    pathToFileURL(input.manifest.outputFile).href,
    pathToFileURL(stdoutPath).href,
    pathToFileURL(stderrPath).href,
    pathToFileURL(processEventsPath).href,
    pathToFileURL(processStartedPath).href,
    runRef
  ]);
  if (processResult.status !== 0) {
    const processFailureReason =
      processResult.timedOut === true
        ? "review_grade_evaluator_process_timeout"
        : "review_grade_evaluator_process_failed";
    const postflight = reviewGradePostflight({
      manifest: input.manifest,
      code: processFailureReason,
      details: [
        processResult.signal === null || processResult.signal === undefined
          ? processFailureReason
          : `${processFailureReason}:${processResult.signal}`
      ],
      evidenceRefs
    });
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      relativePath: "review_grade_postflight.json",
      payload: postflight
    });
    writePostflightGapDossier({
      manifest: input.manifest,
      gapDossier: constructPostflightGapDossier({
        manifest: input.manifest,
        postflight
      })
    });
    const residualPressureRefs = Object.freeze([
      `pressure://odd-sdlc/review-grade/${manifestRefSegment(input.manifest)}/${processFailureReason}`
    ]);
    return constructEvaluationRuleOutcome({
      status: "blocked",
      ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
      ruleRole: "semantic_judgment",
      computeMeans: "F_P",
      evidenceRefs,
      residualPressureRefs,
      diagnosticRefs: evidenceRefs,
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
      compositionContributionRef:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef,
      reason: processFailureReason
    });
  }
  const admission = admitReviewGradeEdgeFulfillmentAssessmentFromArtifact({
    manifest: input.manifest,
    outputFile: assessmentPath
  });
  if (admission.status !== "admitted" || admission.assessment === null) {
    const postflight = reviewGradePostflight({
      manifest: input.manifest,
      code: admission.status === "not_required"
        ? "review_grade_assessment_missing"
        : "review_grade_assessment_invalid",
      details: admission.blockingReasons,
      evidenceRefs: uniqueSorted([...evidenceRefs, ...admission.evidenceRefs])
    });
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      relativePath: "review_grade_postflight.json",
      payload: postflight
    });
    writePostflightGapDossier({
      manifest: input.manifest,
      gapDossier: constructPostflightGapDossier({
        manifest: input.manifest,
        postflight
      })
    });
    const diagnosticRefs = uniqueSorted([
      ...evidenceRefs,
      ...admission.evidenceRefs
    ]);
    return constructEvaluationRuleOutcome({
      status: "blocked",
      ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
      ruleRole: "semantic_judgment",
      computeMeans: "F_P",
      evidenceRefs: diagnosticRefs,
      residualPressureRefs: admission.blockingReasons.map(
        (reason) =>
          `pressure://odd-sdlc/review-grade/${manifestRefSegment(input.manifest)}/${encodeURIComponent(reason)}`
      ),
      diagnosticRefs,
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
      compositionContributionRef:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef,
      reason: admission.blockingReasons.join(",") || "review_grade_assessment_rejected"
    });
  }
  const openFindings = admission.assessment.findings.filter(
    (finding) => finding.fulfillmentStatus !== "fulfilled"
  );
  if (reviewGradeFindingsAreDownstreamStagePressure(openFindings)) {
    const residualPressureRefs = uniqueSorted(
      openFindings.map(
        (finding) =>
          `pressure://odd-sdlc/review-grade/${manifestRefSegment(input.manifest)}/${encodeURIComponent(finding.obligationId)}`
      )
    );
    return constructEvaluationRuleOutcome({
      status: "accepted",
      ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
      ruleRole: "semantic_judgment",
      computeMeans: "F_P",
      evidenceRefs: uniqueSorted([...evidenceRefs, ...admission.evidenceRefs]),
      residualPressureRefs,
      diagnosticRefs: residualPressureRefs,
      findingRefs: Object.freeze([
        `finding://odd-sdlc/${manifestRefSegment(input.manifest)}/evaluate/review-grade-edge-fulfillment/downstream-stage-pressure`
      ]),
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
      compositionContributionRef:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef,
      reason: openFindings
        .map((finding) => `${finding.obligationId}:wrong_stage`)
        .join(",")
    });
  }
  if (admission.assessment.status === "blocked" || openFindings.length > 0) {
    const postflight = reviewGradePostflight({
      manifest: input.manifest,
      code: "review_grade_edge_fulfillment_blocked",
      details: openFindings.map(
        (finding) =>
          `${finding.obligationId}:${finding.failureClass ?? "open"}:${finding.requiredAction ?? "required_action_missing"}`
      ),
      evidenceRefs: uniqueSorted([...evidenceRefs, ...admission.evidenceRefs])
    });
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      relativePath: "review_grade_postflight.json",
      payload: postflight
    });
    writePostflightGapDossier({
      manifest: input.manifest,
      gapDossier: constructPostflightGapDossier({
        manifest: input.manifest,
        postflight
      })
    });
    const residualPressureRefs = uniqueSorted(
      openFindings.map(
        (finding) =>
          `pressure://odd-sdlc/review-grade/${manifestRefSegment(input.manifest)}/${encodeURIComponent(finding.obligationId)}`
      )
    );
    return constructEvaluationRuleOutcome({
      status: "blocked",
      ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
      ruleRole: "semantic_judgment",
      computeMeans: "F_P",
      evidenceRefs: uniqueSorted([...evidenceRefs, ...admission.evidenceRefs]),
      residualPressureRefs,
      diagnosticRefs: residualPressureRefs,
      findingRefs: Object.freeze([
        `finding://odd-sdlc/${manifestRefSegment(input.manifest)}/evaluate/review-grade-edge-fulfillment`
      ]),
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
      compositionContributionRef:
        input.pluginInput.selectedRegimeBindingRef ??
        input.pluginInput.selectedCompositionRef,
      reason: openFindings
        .map((finding) => `${finding.obligationId}:${finding.failureClass ?? "open"}`)
        .join(",")
    });
  }
  return constructEvaluationRuleOutcome({
    status: "accepted",
    ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
    ruleRole: "semantic_judgment",
    computeMeans: "F_P",
    evidenceRefs: uniqueSorted([...evidenceRefs, ...admission.evidenceRefs]),
    findingRefs: Object.freeze([
      `finding://odd-sdlc/${manifestRefSegment(input.manifest)}/evaluate/review-grade-edge-fulfillment`
    ]),
    selectedCompositionRef: input.pluginInput.selectedCompositionRef,
    selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
    selectedCompositionSelectionRef:
      input.pluginInput.selectedCompositionSelectionRef,
    selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef,
    compositionContributionRef:
      input.pluginInput.selectedRegimeBindingRef ??
      input.pluginInput.selectedCompositionRef
  });
}

function fulfillmentArtifact(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly transport: SdlcWorkerTransportContract;
  readonly basis: ExecutionBasis;
  readonly expectedAssessmentIds: readonly string[];
  readonly fulfillmentStatus: "fulfilled" | "partial" | "blocked" | "unfulfilled";
  readonly fulfillmentDetail: string;
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
}): Readonly<Record<string, unknown>> {
  const assessmentIds =
    input.expectedAssessmentIds.length === 0
      ? Object.freeze(["runtime_fulfilled"])
      : input.expectedAssessmentIds;
  return Object.freeze({
    edge: input.manifest.edgeName,
    actor: input.transport.workerId,
    fulfillment_assessments: assessmentIds.map((id) =>
      Object.freeze({
        id,
        evaluator: id,
        fulfillment_status: input.fulfillmentStatus,
        fulfillment_detail: input.fulfillmentDetail,
        blocking_reasons: input.blockingReasons,
        evidence_refs: input.evidenceRefs
      })
    ),
    selected_worker_id: input.transport.workerId,
    selected_backend: input.transport.backendId,
    role_id: "role://odd-sdlc/fp-worker",
    assignment_source: "installed_worker_transport",
    resolved_runtime_ref: input.basis.runtimeIdentity.resolvedRuntimeRef
  });
}

function deterministicFulfillmentArtifact(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly basis: ExecutionBasis;
  readonly expectedAssessmentIds: readonly string[];
  readonly fulfillmentStatus: "fulfilled" | "partial" | "blocked" | "unfulfilled";
  readonly fulfillmentDetail: string;
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
}): Readonly<Record<string, unknown>> {
  const assessmentIds =
    input.expectedAssessmentIds.length === 0
      ? Object.freeze(["runtime_fulfilled"])
      : input.expectedAssessmentIds;
  return Object.freeze({
    edge: input.manifest.edgeName,
    actor: "installed_operator",
    fulfillment_assessments: assessmentIds.map((id) =>
      Object.freeze({
        id,
        evaluator: id,
        fulfillment_status: input.fulfillmentStatus,
        fulfillment_detail: input.fulfillmentDetail,
        blocking_reasons: input.blockingReasons,
        evidence_refs: input.evidenceRefs
      })
    ),
    selected_worker_id: null,
    selected_backend: "installed_operator_deterministic_edge",
    role_id: "role://odd-sdlc/installed-operator",
    assignment_source: "edge_accounting.worker_dispatch_disallowed",
    resolved_runtime_ref: input.basis.runtimeIdentity.resolvedRuntimeRef
  });
}

interface SdlcAbgOwnedFpDispatchState {
  readonly status: SdlcInstalledOperatorStatus;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly selectedComposition: SdlcSelectedAbgFnCompositionIdentity;
  readonly workerRun: SdlcWorkerRunResult | null;
  readonly workerReport: SdlcWorkerResultReport | null;
  readonly postflight: SdlcPostflightResult | null;
  readonly assuranceSatisfaction: SdlcInstalledOperatorStartOutcome["assuranceSatisfaction"];
  readonly gapDossier: SdlcPostflightGapDossier | null;
  readonly hookOutcome: SdlcHookTurnOutcome | null;
  readonly blockingReason: string | null;
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
  readonly currentEdge: string | null;
}

async function appendFdConformanceRuntimeEvents(input: {
  readonly workspaceRoot: string;
  readonly basis: ExecutionBasis;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly vectorIndex: number;
}): Promise<readonly RuntimeEvent[]> {
  const projection = deriveRuntimeAggregateProjection(input.basis, input.replayEvents);
  const decision = deriveIterationAdvanceDecision(input.basis, projection);
  if (
    decision.kind !== "advance_vector" ||
    decision.vectorIndex !== input.vectorIndex
  ) {
    return Object.freeze([]);
  }
  const emitted = Object.freeze([
    ...runtimeEventsForIterationDecision(decision),
    constructVectorEvaluatedEvent({
      basis: input.basis,
      vectorIndex: input.vectorIndex,
      status: "accepted"
    }),
    constructVectorClosedEvent({
      basis: input.basis,
      vectorIndex: input.vectorIndex,
      closureKind: "advanced"
    })
  ]);
  await appendOddSdlcRuntimeEvents({
    workspaceRoot: input.workspaceRoot,
    events: emitted
  });
  return emitted;
}

function workerReportAdmissionPostflight(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly workerRun: SdlcWorkerRunResult;
  readonly reason: string;
}): SdlcPostflightResult {
  const evidenceRefs = Object.freeze([
    pathToFileURL(input.manifest.reportFile).href,
    ...workerProcessEvidenceRefs(input),
    ...(input.workerRun.outputLastMessagePath === null
      ? []
      : [pathToFileURL(input.workerRun.outputLastMessagePath).href])
  ]);
  const carrier = makeSdlcBlockingReason({
    code: "worker_report_admission_failed",
    detail: input.reason,
    evidenceRefs
  });
  return Object.freeze({
    kind: "sdlc_operator_postflight_result" as const,
    status: "blocked" as const,
    blockingReasons: Object.freeze([legacyBlockingReasonCode(carrier)]),
    blockingReasonCarriers: Object.freeze([carrier]),
    evidenceRefs
  });
}

function deterministicReportAdmissionPostflight(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly reason: string;
}): SdlcPostflightResult {
  const evidenceRefs = Object.freeze([
    pathToFileURL(input.manifest.reportFile).href,
    ...workerProcessEvidenceRefs({
      manifest: input.manifest,
      workerRun: null
    })
  ]);
  const carrier = makeSdlcBlockingReason({
    code: "worker_report_admission_failed",
    detail: input.reason,
    evidenceRefs
  });
  return Object.freeze({
    kind: "sdlc_operator_postflight_result" as const,
    status: "blocked" as const,
    blockingReasons: Object.freeze([legacyBlockingReasonCode(carrier)]),
    blockingReasonCarriers: Object.freeze([carrier]),
    evidenceRefs
  });
}

function workerProcessEvidenceRefs(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly workerRun: SdlcWorkerRunResult | null;
}): readonly string[] {
  if (input.workerRun === null) {
    return Object.freeze([
      pathToFileURL(join(input.manifest.archiveRoot, "handoff_manifest.json")).href,
      pathToFileURL(join(input.manifest.archiveRoot, "worker_construction_brief.json")).href,
      pathToFileURL(join(input.manifest.archiveRoot, "traversal_intent_package.json")).href
    ]);
  }
  return Object.freeze([
    pathToFileURL(join(input.manifest.archiveRoot, "worker_run.json")).href,
    workerProcessStartedContextRef(input.manifest),
    workerProcessSummaryRef(input.manifest),
    runtimeLivenessProjectionRef(input.manifest),
    pathToFileURL(input.workerRun.stdoutPath).href,
    pathToFileURL(input.workerRun.stderrPath).href,
    ...(input.workerRun.finalOutputRef === undefined ||
    input.workerRun.finalOutputRef === null
      ? []
      : [input.workerRun.finalOutputRef]),
    ...(input.workerRun.terminalTranscriptRef === undefined ||
    input.workerRun.terminalTranscriptRef === null
      ? []
      : [input.workerRun.terminalTranscriptRef]),
    pathToFileURL(join(input.manifest.archiveRoot, "worker_process_started.json")).href,
    pathToFileURL(join(input.manifest.archiveRoot, "worker_process_events.jsonl")).href,
    ...(input.workerRun.traceResultRef === undefined
      ? []
      : [input.workerRun.traceResultRef]),
    pathToFileURL(join(input.manifest.archiveRoot, "handoff_manifest.json")).href
  ]);
}

function graphVectorRef(input: {
  readonly basis: ExecutionBasis;
  readonly vectorIndex: number;
}): string {
  const vector = input.basis.graph.vectors[input.vectorIndex];
  if (vector === undefined) {
    throw new TypeError(`missing graph vector ${input.vectorIndex}`);
  }
  return sdlcGraphVectorBoundaryRef(vector);
}

function graphFunctionRefForBasis(input: {
  readonly basis: ExecutionBasis;
}): string {
  return sdlcGraphFunctionBoundaryRef(input.basis.graphFunction);
}

function targetOutcomeRefForBasis(input: {
  readonly basis: ExecutionBasis;
  readonly vectorIndex: number;
}): string {
  const vector = input.basis.graph.vectors[input.vectorIndex];
  if (vector === undefined) {
    throw new TypeError(`missing graph vector ${input.vectorIndex}`);
  }
  return sdlcTargetOutcomeRef({
    graphFunctionRef: graphFunctionRefForBasis(input),
    targetNodeRef: vector.target.id
  });
}

function traversalConsequenceEvidenceRefs(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
}): readonly string[] {
  return uniqueSorted([
    ...workerProcessEvidenceRefs({
      manifest: input.state.manifest,
      workerRun: input.state.workerRun
    }),
    ...(input.state.workerReport === null
      ? []
      : [pathToFileURL(input.state.workerReport.outputFile).href]),
    ...(input.state.postflight?.evidenceRefs ?? []),
    ...fpEvaluateResultRefsForState(input.state),
    ...(input.state.gapDossier === null
      ? []
      : [
          input.state.gapDossier.currentGapDossierRef,
          ...input.state.gapDossier.evidenceRefs
        ])
  ]);
}

function fpEvaluateResultRefsForState(
  state: SdlcAbgOwnedFpDispatchState
): readonly string[] {
  if (state.workerReport === null || state.postflight === null) {
    return Object.freeze([]);
  }
  if (!existsSync(state.manifest.fpEvaluateResultFile)) {
    throw new TypeError(
      "fp_evaluate_result.json missing for admitted worker report; ledger predecessor invariant violated"
    );
  }
  return Object.freeze([pathToFileURL(state.manifest.fpEvaluateResultFile).href]);
}

function reviewGradeResidualPressureRefsForState(
  state: SdlcAbgOwnedFpDispatchState
): readonly string[] {
  return state.workerReport === null
    ? Object.freeze([])
    : reviewGradeEdgeFulfillmentOpenPressureRefs({
        runRef: manifestRefSegment(state.manifest),
        assessments: state.workerReport.obligationAssessments
      });
}

function fpEvaluationCloseDispositionForState(
  state: SdlcAbgOwnedFpDispatchState
): FpEvaluationCloseDisposition {
  if (reviewGradeResidualPressureRefsForState(state).length > 0) {
    return "no_close";
  }
  if (state.status === "worker_invoked" && state.blockingReason === null) {
    return "close";
  }
  if (state.status === "fp_escalation") {
    return "human_required";
  }
  return "no_close";
}

function fpEvaluationResidualPressureRefsForState(
  state: SdlcAbgOwnedFpDispatchState
): readonly string[] {
  const runRef = manifestRefSegment(state.manifest);
  return uniqueSorted([
    ...state.blockingReasonCarriers.map(
      (reason) =>
        `pressure://odd-sdlc/fp-evaluate/${runRef}/${encodeURIComponent(reason.code)}`
    ),
    ...reviewGradeResidualPressureRefsForState(state)
  ]);
}

function fpEvaluationOutcomeForDispatchState(input: {
  readonly pluginInput: EnginePluginInput;
  readonly state: SdlcAbgOwnedFpDispatchState;
}): FpEvaluationOutcome {
  const runRef = manifestRefSegment(input.state.manifest);
  const closeDisposition = fpEvaluationCloseDispositionForState(input.state);
  const residualPressureRefs =
    fpEvaluationResidualPressureRefsForState(input.state);
  const fpEvaluateResultRefs = fpEvaluateResultRefsForState(input.state);
  const evidenceRefs = uniqueSorted([
    input.pluginInput.sourceProjectionRef,
    ...fpEvaluateResultRefs
  ]);
  const authorityRefs = uniqueSorted([
    ...input.pluginInput.expectedAssessmentIds,
    input.pluginInput.selectedRegimeBindingRef ??
      input.pluginInput.selectedCompositionRef,
    ...(input.state.manifest.edgeAssuranceContractRef === undefined
      ? []
      : [input.state.manifest.edgeAssuranceContractRef]),
    ...(input.state.manifest.targetCarrierContractRef === undefined
      ? []
      : [input.state.manifest.targetCarrierContractRef])
  ]);
  return constructFpEvaluationOutcome({
    status: "evaluated",
    ambiguityStatus: closeDisposition === "close" ? "fulfilled" : "partial",
    findings: [
      constructFpEvaluationFinding({
        findingRef: `finding://odd-sdlc/${runRef}/evaluate/fp`,
        evaluatorRef: input.pluginInput.contract.ref,
        gainReportRef: `gain://odd-sdlc/${runRef}/evaluate/fp`,
        metricRefs: [`metric://odd-sdlc/${runRef}/evaluate/fp/obligations`],
        closeDisposition,
        residualPressureRefs,
        continuationRefs: Object.freeze([]),
        evidenceRefs,
        authorityRefs,
        compositionContributionRef:
          input.pluginInput.selectedRegimeBindingRef ??
          input.pluginInput.selectedCompositionRef,
        compositionRef: input.pluginInput.selectedCompositionRef,
        compositionDigest: input.pluginInput.selectedCompositionDigest,
        diagnosticRefs: uniqueSorted([
          ...residualPressureRefs,
          ...input.pluginInput.stageSetDependencyRefs,
          ...traversalConsequenceEvidenceRefs({ state: input.state })
        ])
      })
    ],
    evidenceRefs,
    diagnosticRefs: residualPressureRefs
  });
}

async function runSdlcPostTransformDiagnosticFlow(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly basis: ExecutionBasis;
  readonly edgeAccountingRow: SdlcExecutiveEdgeAccountingRow | null;
  readonly eventSink: (event: RuntimeEvent) => void;
  readonly postflightRelativePath: string;
  readonly writeMaterializationManifest: boolean;
  readonly fpEvaluatorAdmissionEvidenceRefs?: readonly string[] | undefined;
}): Promise<{
  readonly postflight: SdlcPostflightResult;
  readonly assuranceGate: SdlcOperatorAssuranceGateResult;
}> {
  if (input.state.workerReport === null) {
    throw new TypeError("post-transform diagnostic flow requires a worker report");
  }
  if (input.writeMaterializationManifest) {
    writeProductMaterializationManifest({
      manifest: input.state.manifest,
      report: input.state.workerReport
    });
  }
  const postflight = evaluateSdlcComputeStage({
    manifest: input.state.manifest,
    report: input.state.workerReport,
    fpEvaluatorAdmissionEvidenceRefs:
      input.fpEvaluatorAdmissionEvidenceRefs ?? Object.freeze([])
  });
  writeOperatorArchiveFile({
    archiveRoot: input.state.manifest.archiveRoot,
    relativePath: input.postflightRelativePath,
    payload: postflight
  });
  writeSdlcFpEvaluateResult({
    manifest: input.state.manifest,
    selectedComposition: input.state.selectedComposition,
    report: input.state.workerReport,
    postflight,
    postflightRef: pathToFileURL(
      join(input.state.manifest.archiveRoot, input.postflightRelativePath)
    ).href
  });
  const traversalAuditEvent = await writeTraversalSelectionAudit({
    basis: input.basis,
    manifest: input.state.manifest,
    postflight,
    edgeAccountingRow: input.edgeAccountingRow,
    eventSink: input.eventSink,
    fpEvaluatorAdmissionEvidenceRefs:
      input.fpEvaluatorAdmissionEvidenceRefs ?? Object.freeze([])
  });
  if (traversalAuditEvent !== null) {
    input.eventSink(traversalAuditEvent);
  }
  const assuranceGate = deriveSdlcOperatorAssuranceGate({
    manifest: input.state.manifest,
    report: input.state.workerReport,
    postflight
  });
  writeOperatorArchiveFile({
    archiveRoot: input.state.manifest.archiveRoot,
    relativePath: "assurance_satisfaction.json",
    payload: assuranceGate.satisfaction
  });
  writeOperatorArchiveFile({
    archiveRoot: input.state.manifest.archiveRoot,
    relativePath: "assurance_ledgers.json",
    payload: assuranceGate.ledgers
  });
  return Object.freeze({
    postflight,
    assuranceGate
  });
}

async function refreshDesignDepthStateFromFpEvaluatorRegister(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly basis: ExecutionBasis;
  readonly edgeAccountingRow: SdlcExecutiveEdgeAccountingRow | null;
  readonly eventSink: (event: RuntimeEvent) => void;
  readonly fpEvaluatorAdmissionEvidenceRefs: readonly string[];
}): Promise<SdlcAbgOwnedFpDispatchState> {
  if (
    input.state.manifest.targetAssetType !== "implementation_design_surface" ||
    input.state.workerReport === null
  ) {
    return input.state;
  }
  const admission = admitImplementationDesignRegisterForRuntimeEvaluation({
    manifest: input.state.manifest,
    fpEvaluatorAdmissionEvidenceRefs: input.fpEvaluatorAdmissionEvidenceRefs
  });
  if (admission.status !== "admitted" || admission.register === null) {
    return input.state;
  }
  const diagnostics = await runSdlcPostTransformDiagnosticFlow({
    state: input.state,
    basis: input.basis,
    edgeAccountingRow: input.edgeAccountingRow,
    eventSink: input.eventSink,
    postflightRelativePath: "fp_evaluator_postflight.json",
    writeMaterializationManifest: false,
    fpEvaluatorAdmissionEvidenceRefs: input.fpEvaluatorAdmissionEvidenceRefs
  });
  return Object.freeze({
    ...input.state,
    status: "worker_invoked" as const,
    postflight: diagnostics.postflight,
    assuranceSatisfaction: diagnostics.assuranceGate.satisfaction,
    gapDossier: null,
    blockingReason: null,
    blockingReasonCarriers: Object.freeze([])
  });
}

function shouldDeferDispatchConsequenceToFpEvaluator(
  state: SdlcAbgOwnedFpDispatchState
): boolean {
  return (
    (state.manifest.targetAssetType === "implementation_design_surface" ||
      reviewGradeEdgeFulfillmentAssessmentRequired(state.manifest)) &&
    state.workerReport !== null
  );
}

function manifestRefSegment(manifest: SdlcWorkerHandoffManifest): string {
  return encodeURIComponent(pathToFileURL(manifest.archiveRoot).href);
}

function materializedFileRef(file: {
  readonly absolutePath: string;
}): string {
  return pathToFileURL(file.absolutePath).href;
}

function workerOutputMaterializationRefs(
  state: SdlcAbgOwnedFpDispatchState
): readonly string[] {
  const report = state.workerReport;
  if (report === null) {
    return Object.freeze([]);
  }
  return uniqueSorted([
    pathToFileURL(report.outputFile).href,
    ...report.materializedFiles.map(materializedFileRef)
  ]);
}

export type SdlcPublishedProductMaterializationActionStatus =
  | "eligible"
  | "unpublished"
  | "no_output_asset"
  | "target_binding_mismatch";

export interface SdlcPublishedProductMaterializationAction {
  readonly kind: "sdlc_published_product_materialization_action";
  readonly status: SdlcPublishedProductMaterializationActionStatus;
  readonly graphFunctionName: typeof FG_MATERIALIZE_DECLARED_PRODUCT_ASSET;
  readonly graphFunctionRef: string | null;
  readonly publishedActionRef: string | null;
  readonly outputAssetTypes: readonly string[];
  readonly targetBindingRefs: readonly string[];
  readonly eligibleTargetBindingRefs: readonly string[];
  readonly reasonRefs: readonly string[];
}

function targetBindingRefForAssetType(assetType: string): string {
  return `target-binding://odd-sdlc/${assetType}`;
}

function assetTypeRefFor(assetType: string): string {
  return `asset-type://odd-sdlc/${assetType}`;
}

function materializationTargetAssetTypeFromActionRef(ref: string): string | null {
  const marker = [
    "target-outcome://odd-sdlc/post-action",
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    ""
  ].join("/");
  const markerIndex = ref.indexOf(marker);
  if (markerIndex < 0) {
    return null;
  }
  const suffix = ref.slice(markerIndex + marker.length);
  const encodedAssetType = suffix.split("/")[0] ?? "";
  if (encodedAssetType.length === 0) {
    return null;
  }
  try {
    const assetType = decodeURIComponent(encodedAssetType);
    return assetType.length === 0 ? null : assetType;
  } catch {
    return encodedAssetType;
  }
}

interface SdlcGraphTrackActionTarget {
  readonly requestedTargetAssetType: string;
  readonly graphFunctionName: string;
  readonly graphFunctionRef: string;
  readonly graphVectorName: string;
  readonly graphVectorRef: string;
  readonly targetAssetType: string;
  readonly targetNodeRef: string;
  readonly publishedTraversalTargetRef: string;
  readonly targetOutcomeRef: string;
}

type SdlcGraphTrackActionTargetResolution =
  | {
      readonly status: "selected";
      readonly target: SdlcGraphTrackActionTarget;
    }
  | {
      readonly status: "unresolved" | "ambiguous";
      readonly reasonRef: string;
    };

interface SdlcGraphTrackCandidate {
  readonly graphFunction: Module["graphFunctions"][number];
  readonly vector: ReturnType<typeof materializeGraphFunction>["vectors"][number];
  readonly inputAssetTypes: readonly string[];
  readonly targetAssetType: string;
}

export type SdlcPostProductMaterializationActionResolution =
  | {
      readonly status: "selected";
      readonly action: OddSdlcEvaluateNextActionInput;
    }
  | {
      readonly status: "no_pressure";
    }
  | {
      readonly status: "no_candidate_matched";
      readonly reasonRefs: readonly string[];
    }
  | {
      readonly status: "blocked";
      readonly blockingReason: SdlcBlockingReason;
    };

function targetAssetTypeFromBindingRef(ref: string): string | null {
  const prefix = "target-binding://odd-sdlc/";
  if (!ref.startsWith(prefix)) {
    return null;
  }
  const assetType = ref.slice(prefix.length);
  return assetType.length === 0 ? null : assetType;
}

function targetAssetTypeFromAuthorityRef(ref: string): string | null {
  const scopedPrefix = "asset-type://odd-sdlc/";
  if (ref.startsWith(scopedPrefix)) {
    const assetType = ref.slice(scopedPrefix.length);
    return assetType.length === 0 ? null : assetType;
  }
  const prefix = "asset-type://";
  if (ref.startsWith(prefix)) {
    const assetType = ref.slice(prefix.length);
    return assetType.length === 0 ? null : assetType;
  }
  return null;
}

function admittedAssetTypesFromEvents(
  events: readonly RuntimeEvent[]
): readonly string[] {
  return uniqueSorted(
    events.flatMap((event) => {
      if (event.kind !== "evidence_admitted") {
        return [];
      }
      const authorityRef =
        typeof event.authorityRef === "string" ? event.authorityRef : null;
      if (authorityRef === null) {
        return [];
      }
      const assetType = targetAssetTypeFromAuthorityRef(authorityRef);
      return assetType === null ? [] : [assetType];
    })
  );
}

function admittedAssetTypesForState(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly emittedEvents: readonly RuntimeEvent[];
}): readonly string[] {
  const currentEdgeAdmitted =
    input.state.status === "worker_invoked" &&
    input.state.postflight?.status === "passed";
  return uniqueSorted([
    ...admittedAssetTypesFromEvents(input.replayEvents),
    ...admittedAssetTypesFromEvents(input.emittedEvents),
    ...(currentEdgeAdmitted
      ? [
          ...input.state.manifest.inputAssetTypes,
          input.state.manifest.targetAssetType
        ]
      : [])
  ]);
}

function inheritedMaterializationPressure(input: {
  readonly selectedActionRef: string | null;
  readonly basisRefs: readonly string[];
  readonly admittedAssetTypes: readonly string[];
}): {
  readonly downstreamPressureRefs: readonly string[];
  readonly downstreamTargetBindingRefs: readonly string[];
} {
  const emptyPressure = Object.freeze({
    downstreamPressureRefs: Object.freeze([]),
    downstreamTargetBindingRefs: Object.freeze([])
  });
  if (
    input.selectedActionRef === null ||
    !input.selectedActionRef.includes(FG_MATERIALIZE_DECLARED_PRODUCT_ASSET)
  ) {
    return emptyPressure;
  }
  const targetAssetType = materializationTargetAssetTypeFromActionRef(
    input.selectedActionRef
  );
  if (
    targetAssetType !== null &&
    new Set(input.admittedAssetTypes).has(targetAssetType)
  ) {
    return emptyPressure;
  }
  return Object.freeze({
    downstreamPressureRefs: uniqueSorted([
      input.selectedActionRef,
      ...input.basisRefs.filter(
        (ref: string) =>
          ref.includes("/downstream_transformation_set") ||
          ref.startsWith("downstream-pressure://") ||
          ref.startsWith("downstream-transformation-set://") ||
          ref.startsWith("requirement-authority://")
      )
    ]),
    downstreamTargetBindingRefs: uniqueSorted([
      ...(targetAssetType === null
        ? []
        : [targetBindingRefForAssetType(targetAssetType)]),
      ...input.basisRefs.filter((ref: string) =>
        ref.startsWith("target-binding://odd-sdlc/")
      )
    ])
  });
}

function graphTrackCandidatesForTarget(input: {
  readonly module: Module;
  readonly targetAssetType: string;
}): readonly SdlcGraphTrackCandidate[] {
  return Object.freeze(
    input.module.graphFunctions.flatMap((graphFunction) => {
      if (
        graphFunction.name.startsWith("Fg_") ||
        graphFunction.tags.includes("executive") ||
        graphFunction.tags.includes("overlay_only_leaf")
      ) {
        return [];
      }
      const graph = materializeGraphFunction(graphFunction);
      return graph.vectors
        .filter((vector) => vector.target.name === input.targetAssetType)
        .map((vector) =>
          Object.freeze({
            graphFunction,
            vector,
            inputAssetTypes: Object.freeze(
              vector.source.map((source) => source.name)
            ),
            targetAssetType: vector.target.name
          })
        );
    })
  );
}

function selectedGraphTrackCandidateTarget(input: {
  readonly candidate: SdlcGraphTrackCandidate;
  readonly requestedTargetAssetType: string;
}): SdlcGraphTrackActionTarget {
  const graphFunctionRef = sdlcGraphFunctionBoundaryRef(input.candidate.graphFunction);
  const graphVectorRef = sdlcGraphVectorBoundaryRef(input.candidate.vector);
  const publishedTraversalTargetRef = sdlcPublishedTraversalTargetRef({
    graphFunctionRef,
    graphVectorRef
  });
  return Object.freeze({
    requestedTargetAssetType: input.requestedTargetAssetType,
    graphFunctionName: input.candidate.graphFunction.name,
    graphFunctionRef,
    graphVectorName: input.candidate.vector.name,
    graphVectorRef,
    targetAssetType: input.candidate.targetAssetType,
    targetNodeRef: input.candidate.vector.target.id,
    publishedTraversalTargetRef,
    targetOutcomeRef: sdlcTargetOutcomeRef({
      graphFunctionRef,
      targetNodeRef: input.candidate.vector.target.id
    })
  });
}

function uniqueGraphTrackProducerForAsset(input: {
  readonly module: Module;
  readonly targetAssetType: string;
}): SdlcGraphTrackActionTargetResolution | {
  readonly status: "producer";
  readonly candidate: SdlcGraphTrackCandidate;
} {
  const candidates = graphTrackCandidatesForTarget({
    module: input.module,
    targetAssetType: input.targetAssetType
  });
  if (candidates.length > 1) {
    return Object.freeze({
      status: "ambiguous" as const,
      reasonRef: `graph_track_target_ambiguous_for_product_materialization_action:${input.targetAssetType}`
    });
  }
  const selected =
    candidates.length === 1 &&
    candidates[0]?.graphFunction.tags.includes("published_leaf")
      ? candidates[0]
      : null;
  if (selected !== null) {
    return Object.freeze({
      status: "producer" as const,
      candidate: selected
    });
  }
  if (candidates.length === 1) {
    return Object.freeze({
      status: "unresolved" as const,
      reasonRef: `graph_track_target_unpublished_for_product_materialization_action:${input.targetAssetType}`
    });
  }
  return Object.freeze({
    status: "unresolved" as const,
    reasonRef: `graph_track_target_unresolved_for_product_materialization_action:${input.targetAssetType}`
  });
}

function nextMissingGraphTrackTargetForAsset(input: {
  readonly module: Module;
  readonly requestedTargetAssetType: string;
  readonly targetAssetType: string;
  readonly admittedAssetTypes: ReadonlySet<string>;
  readonly visitedAssetTypes: ReadonlySet<string>;
}): SdlcGraphTrackActionTargetResolution {
  if (input.admittedAssetTypes.has(input.targetAssetType)) {
    return Object.freeze({
      status: "unresolved" as const,
      reasonRef: `graph_track_target_already_admitted_for_product_materialization_action:${input.targetAssetType}`
    });
  }
  if (input.visitedAssetTypes.has(input.targetAssetType)) {
    return Object.freeze({
      status: "unresolved" as const,
      reasonRef: `graph_track_target_cycle_for_product_materialization_action:${input.targetAssetType}`
    });
  }
  const producer = uniqueGraphTrackProducerForAsset({
    module: input.module,
    targetAssetType: input.targetAssetType
  });
  if (producer.status !== "producer") {
    return producer;
  }
  const visitedAssetTypes = new Set(input.visitedAssetTypes);
  visitedAssetTypes.add(input.targetAssetType);
  for (const sourceAssetType of producer.candidate.inputAssetTypes) {
    if (input.admittedAssetTypes.has(sourceAssetType)) {
      continue;
    }
    const upstream = nextMissingGraphTrackTargetForAsset({
      module: input.module,
      requestedTargetAssetType: input.requestedTargetAssetType,
      targetAssetType: sourceAssetType,
      admittedAssetTypes: input.admittedAssetTypes,
      visitedAssetTypes
    });
    if (upstream.status === "selected" || upstream.status === "ambiguous") {
      return upstream;
    }
    if (!upstream.reasonRef.includes("_already_admitted_")) {
      return upstream;
    }
  }
  return Object.freeze({
    status: "selected" as const,
    target: selectedGraphTrackCandidateTarget({
      candidate: producer.candidate,
      requestedTargetAssetType: input.requestedTargetAssetType
    })
  });
}

function graphTrackActionTargetFor(input: {
  readonly module: Module;
  readonly downstreamTargetBindingRefs: readonly string[];
  readonly admittedAssetTypes: readonly string[];
}): SdlcGraphTrackActionTargetResolution {
  const targetAssetTypes = uniqueSorted(
    input.downstreamTargetBindingRefs.flatMap((ref) => {
      const assetType = targetAssetTypeFromBindingRef(ref);
      return assetType === null ? [] : [assetType];
    })
  );
  if (targetAssetTypes.length === 0) {
    return Object.freeze({
      status: "unresolved" as const,
      reasonRef: "graph_track_target_unresolved_for_product_materialization_action"
    });
  }
  const admittedAssetTypes = new Set(uniqueSorted(input.admittedAssetTypes));
  const unresolvedReasonRefs: string[] = [];
  for (const targetAssetType of targetAssetTypes) {
    const resolution = nextMissingGraphTrackTargetForAsset({
      module: input.module,
      requestedTargetAssetType: targetAssetType,
      targetAssetType,
      admittedAssetTypes,
      visitedAssetTypes: new Set()
    });
    if (resolution.status === "selected" || resolution.status === "ambiguous") {
      return resolution;
    }
    unresolvedReasonRefs.push(resolution.reasonRef);
  }
  return Object.freeze({
    status: "unresolved" as const,
    reasonRef: uniqueSorted(unresolvedReasonRefs).join(",")
  });
}

export function deriveSdlcPublishedProductMaterializationAction(input: {
  readonly module: Module;
  readonly downstreamTargetBindingRefs?: readonly string[];
}): SdlcPublishedProductMaterializationAction {
  const graphFunction = input.module.graphFunctions.find(
    (candidate) => candidate.name === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const requiredTargetBindingRefs = uniqueSorted(
    input.downstreamTargetBindingRefs ?? []
  );
  if (graphFunction === undefined) {
    return Object.freeze({
      kind: "sdlc_published_product_materialization_action" as const,
      status: "unpublished" as const,
      graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
      graphFunctionRef: null,
      publishedActionRef: null,
      outputAssetTypes: Object.freeze([]),
      targetBindingRefs: Object.freeze([]),
      eligibleTargetBindingRefs: Object.freeze([]),
      reasonRefs: Object.freeze([
        "product_materialization_graph_function_unpublished"
      ])
    });
  }
  const outputAssetTypes = uniqueSorted(
    graphFunction.outputs.map((output) => output.name)
  );
  const targetBindingRefs = uniqueSorted(
    outputAssetTypes.map(targetBindingRefForAssetType)
  );
  const eligibleTargetBindingRefs =
    requiredTargetBindingRefs.length === 0
      ? targetBindingRefs
      : targetBindingRefs.filter((ref) => requiredTargetBindingRefs.includes(ref));
  const graphFunctionRef = sdlcGraphFunctionBoundaryRef(graphFunction);
  const publishedActionRef = sdlcPublishedActionRef({ graphFunctionRef });
  if (outputAssetTypes.length === 0) {
    return Object.freeze({
      kind: "sdlc_published_product_materialization_action" as const,
      status: "no_output_asset" as const,
      graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
      graphFunctionRef,
      publishedActionRef,
      outputAssetTypes,
      targetBindingRefs,
      eligibleTargetBindingRefs: Object.freeze([]),
      reasonRefs: Object.freeze([
        "product_materialization_graph_function_has_no_output_asset"
      ])
    });
  }
  if (
    requiredTargetBindingRefs.length > 0 &&
    eligibleTargetBindingRefs.length === 0
  ) {
    return Object.freeze({
      kind: "sdlc_published_product_materialization_action" as const,
      status: "target_binding_mismatch" as const,
      graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
      graphFunctionRef,
      publishedActionRef,
      outputAssetTypes,
      targetBindingRefs,
      eligibleTargetBindingRefs: Object.freeze([]),
      reasonRefs: uniqueSorted([
        "downstream_target_binding_not_admitted_for_published_materializer",
        ...requiredTargetBindingRefs.map((ref) => `required_target_binding:${ref}`),
        ...targetBindingRefs.map((ref) => `published_target_binding:${ref}`)
      ])
    });
  }
  return Object.freeze({
    kind: "sdlc_published_product_materialization_action" as const,
    status: "eligible" as const,
    graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    graphFunctionRef,
    publishedActionRef,
    outputAssetTypes,
    targetBindingRefs,
    eligibleTargetBindingRefs,
    reasonRefs: uniqueSorted([
      "evaluate_next_declared_product_materialization_action_published",
      ...eligibleTargetBindingRefs.map((ref) => `eligible_target_binding:${ref}`)
    ])
  });
}

export function sdlcAssessmentCarriesRequirementForDownstreamClosure(
  assessment: SdlcWorkerObligationAssessment
): boolean {
  return (
    assessment.obligationId.startsWith("requirement:") &&
    assessment.blockingReasons.some((reason) =>
      reason.startsWith("requirement_carried_for_downstream_closure:")
    )
  );
}

export function sdlcRequirementObligationBelongsToDownstreamComponentSurface(input: {
  readonly targetAssetType: string;
  readonly productMaterializationRequired: boolean;
  readonly obligationKind: string;
  readonly sourceRefs: readonly string[];
  readonly sourceSnippets: readonly string[];
}): boolean {
  if (
    input.targetAssetType !== "component_code_surface" ||
    !input.productMaterializationRequired ||
    input.obligationKind !== "requirement"
  ) {
    return false;
  }
  const refNamesDownstream = input.sourceRefs.some((ref) => {
    const lower = ref.toLowerCase();
    return (
      lower.includes("adr-003-test-design-surface.md") ||
      lower.includes("/component_test_surface.md") ||
      lower.includes("/component_test_") ||
      lower.includes("test-design-surface") ||
      lower.includes("/test/") ||
      lower.includes(".test.")
    );
  });
  const sourceText = input.sourceSnippets.join("\n").toLowerCase();
  return (
    refNamesDownstream ||
    sourceText.includes("execution proof") ||
    sourceText.includes("execution evidence") ||
    sourceText.includes("test execution") ||
    sourceText.includes("test command") ||
    sourceText.includes("branch test") ||
    sourceText.includes("proof-test") ||
    sourceText.includes("testcase") ||
    sourceText.includes("test case") ||
    sourceText.includes("/test/") ||
    sourceText.includes(".test.") ||
    sourceText.includes("`test`")
  );
}

function manifestRequirementObligationBelongsToDownstreamSurface(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly obligation: SdlcTraversalObligation;
}): boolean {
  return sdlcRequirementObligationBelongsToDownstreamComponentSurface({
    targetAssetType: input.manifest.targetAssetType,
    productMaterializationRequired: input.manifest.productMaterialization.required,
    obligationKind: input.obligation.obligationKind,
    sourceRefs: input.obligation.payload.sourceRefs,
    sourceSnippets: input.obligation.payload.sourceSnippets
  });
}

function manifestAssessmentObligationBelongsToDownstreamSurface(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly assessment: SdlcWorkerObligationAssessment;
}): boolean {
  const obligation =
    input.manifest.traversalObligationContext.obligations.find(
      (candidate) => candidate.obligationId === input.assessment.obligationId
    ) ?? null;
  return obligation === null
    ? false
    : manifestRequirementObligationBelongsToDownstreamSurface({
        manifest: input.manifest,
        obligation
      });
}

function edgeFulfillmentProjectionFor(input: {
  readonly module: Module;
  readonly state: SdlcAbgOwnedFpDispatchState;
}): SdlcEdgeFulfillmentCountProjection {
  const materializationAction = deriveSdlcPublishedProductMaterializationAction({
    module: input.module
  });
  const assessments = Object.freeze(
    (input.state.workerReport?.obligationAssessments ?? Object.freeze([])).map(
      (assessment) => {
        const authorityRequirementInduction =
          input.state.manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY &&
          !input.state.manifest.productMaterialization.required &&
          assessment.obligationId.startsWith("requirement:");
        const belongsToDownstreamSurface =
          manifestAssessmentObligationBelongsToDownstreamSurface({
            manifest: input.state.manifest,
            assessment
          });
        const carriesDownstreamRequirement =
          assessment.obligationId.startsWith("requirement:") &&
          (input.state.manifest.productMaterialization.required
            ? belongsToDownstreamSurface
            : sdlcAssessmentCarriesRequirementForDownstreamClosure(assessment));
        const carriesRequirementTransformationSet =
          assessment.obligationId.startsWith("requirement:") &&
          (carriesDownstreamRequirement ||
            (!input.state.manifest.productMaterialization.required &&
              (authorityRequirementInduction ||
                (input.state.manifest.targetAssetType === "requirement_surface" &&
                  assessment.blockingReasons.some((reason) =>
                    reason.startsWith("requirement_recorded_for_future_closure:")
                  )))));
        return Object.freeze({
          obligationId: assessment.obligationId,
          fulfillmentStatus: assessment.fulfillmentStatus,
          evidenceRefs: assessment.evidenceRefs,
          ...(carriesRequirementTransformationSet
            ? {
                carryDirection: "downstream_transformation_set" as const,
                downstreamGraphFunctionRefs:
                  materializationAction.graphFunctionRef === null
                    ? Object.freeze([])
                    : Object.freeze([materializationAction.graphFunctionRef]),
                targetBindingRefs: materializationAction.targetBindingRefs
              }
            : {})
        });
      }
    )
  );
  return deriveSdlcEdgeFulfillmentCountsFromAssessments({
    declaredObligationIds: uniqueSorted([
      ...input.state.manifest.traversalObligationContext.obligations.map(
        (obligation) => obligation.obligationId
      ),
      ...(input.state.manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY
        ? assessments
            .map((assessment) => assessment.obligationId)
            .filter((obligationId) => obligationId.startsWith("requirement:"))
        : [])
    ]),
    assessments
  });
}

function blockingReasonRefsForReentry(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly lawfulReentryPoint: SdlcBlockingReasonLawfulReentryPoint;
}): readonly string[] {
  const runRef = manifestRefSegment(input.state.manifest);
  return uniqueSorted(
    input.state.blockingReasonCarriers.flatMap((reason, index) =>
      reason.lawfulReentryPoint === input.lawfulReentryPoint
        ? [
            `blocking-reason://odd-sdlc/${runRef}/${String(index)}/${reason.code}`,
            ...reason.evidenceRefs
          ]
        : []
    )
  );
}

function blockReasonRefsForState(
  state: SdlcAbgOwnedFpDispatchState
): readonly string[] {
  if (
    state.status === "worker_invoked" ||
    blockingReasonRefsForReentry({
      state,
      lawfulReentryPoint: "same_edge_retry"
    }).length > 0 ||
    blockingReasonRefsForReentry({
      state,
      lawfulReentryPoint: "repair_worker_output"
    }).length > 0 ||
    blockingReasonRefsForReentry({
      state,
      lawfulReentryPoint: "reprice_requirement_or_design"
    }).length > 0
  ) {
    return Object.freeze([]);
  }
  return uniqueSorted([
    ...(state.gapDossier === null ? [] : [state.gapDossier.currentGapDossierRef]),
    ...state.blockingReasonCarriers.flatMap((reason) => reason.evidenceRefs)
  ]);
}

export function deriveSdlcProductLineageYieldResumeBasis(input: {
  readonly runRef: string;
  readonly edgeRef: string;
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
  readonly productEvidenceRefs: readonly string[];
  readonly livenessProjectionRefs: readonly string[];
}): Omit<SdlcYieldResumeBasis, "kind"> | null {
  const lineageReasons = input.blockingReasonCarriers.filter(
    (reason) => reason.code === "materialized_product_requirement_lineage_missing"
  );
  if (lineageReasons.length === 0) {
    return null;
  }
  const competingSameEdgeReasons = input.blockingReasonCarriers.filter(
    (reason) =>
      reason.lawfulReentryPoint === "same_edge_retry" &&
      reason.code !== "materialized_product_requirement_lineage_missing"
  );
  if (competingSameEdgeReasons.length > 0) {
    return null;
  }
  if (input.productEvidenceRefs.length === 0) {
    return null;
  }
  return Object.freeze({
    yieldKind: "partial_product_evidence_admitted_current_edge_should_resume",
    resumeBasisRef: `resume-basis://odd-sdlc/${input.runRef}/materialized-product-lineage`,
    currentEdgeRef: input.edgeRef,
    admittedProgressRefs: input.productEvidenceRefs,
    livenessProjectionRef: input.livenessProjectionRefs[0] ?? null,
    resumePolicyRef:
      "resume-policy://odd-sdlc/materialized-product-lineage/operator-iterate"
  });
}

function postActionCandidateFor(input: {
  readonly basis: ExecutionBasis;
  readonly vectorIndex: number;
  readonly basisKind: string;
  readonly actionKind: OddSdlcEvaluateNextActionInput["actionKind"];
}) {
  const graphFunctionRef = graphFunctionRefForBasis({ basis: input.basis });
  const vectorRef = graphVectorRef({
    basis: input.basis,
    vectorIndex: input.vectorIndex
  });
  const outcomeRef = targetOutcomeRefForBasis({
    basis: input.basis,
    vectorIndex: input.vectorIndex
  });
  const actionRef = [
    "construction-action://odd-sdlc/post-action",
    graphFunctionRef,
    input.basisKind,
    vectorRef
  ].join("/");
  return Object.freeze({
    actionRef,
    actionKind: input.actionKind,
    graphFunctionRef,
    graphVectorRef: vectorRef,
    publishedTraversalTargetRef: sdlcPublishedTraversalTargetRef({
      graphFunctionRef,
      graphVectorRef: vectorRef
    }),
    targetOutcomeRef: outcomeRef,
    inputAssetRefs: Object.freeze([]),
    expectedOutputAssetRefs: Object.freeze([outcomeRef]),
    requiredAuthorityRefs: Object.freeze([
      sdlcPublishedTraversalTargetRef({ graphFunctionRef, graphVectorRef: vectorRef })
    ]),
    eligibleReasonRefs: Object.freeze([
      "evaluate_next_post_action_selected_published_graph_action"
    ])
  });
}

function postRepairGraphFunctionCandidateForPlan(input: {
  readonly plan: ReturnType<typeof componentRepairReentryPlansForGapDossier>[number];
  readonly runRef: string;
}): OddSdlcEvaluateNextActionInput {
  const graphFunctionRef = input.plan.targetEdgeName;
  const graphVectorRef = input.plan.targetEdgeName;
  const publishedTraversalTargetRef = sdlcPublishedTraversalTargetRef({
    graphFunctionRef,
    graphVectorRef
  });
  const targetOutcomeRef = sdlcTargetOutcomeRef({
    graphFunctionRef,
    targetNodeRef: `node:odd_sdlc:${input.plan.targetAssetType}`
  });
  return Object.freeze({
    actionRef: [
      "construction-action://odd-sdlc/post-action",
      graphFunctionRef,
      "post_repair_reentry",
      graphVectorRef,
      encodeURIComponent(input.runRef)
    ].join("/"),
    actionKind: "reenter_graph_span" as const,
    graphFunctionRef,
    graphVectorRef,
    publishedTraversalTargetRef,
    targetOutcomeRef,
    inputAssetRefs: Object.freeze([]),
    expectedOutputAssetRefs: Object.freeze([targetOutcomeRef]),
    requiredAuthorityRefs: Object.freeze([publishedTraversalTargetRef]),
    eligibleReasonRefs: Object.freeze([
      "evaluate_next_post_repair_reentry",
      `repair_plan:${input.plan.planId}`,
      `source_edge:${input.plan.sourceEdgeName}`,
      `target_edge:${input.plan.targetEdgeName}`,
      `failure:${input.plan.failureId}`
    ])
  });
}

export function deriveSdlcPostCloseOverlayContinuationActionInput(input: {
  readonly module: Module;
  readonly overlayRef: string | null;
  readonly completedGraphFunctionRef: string;
  readonly runRef: string;
}): OddSdlcEvaluateNextActionInput | null {
  if (input.overlayRef === null) {
    return null;
  }
  const catalog = constructSdlcTraversalOverlayCatalog({
    module: input.module
  });
  const overlay = resolveSdlcTraversalOverlay({
    catalog,
    overlayRef: input.overlayRef
  });
  if (overlay === null) {
    return null;
  }
  const continuation = sdlcTraversalOverlayNextGraphContinuation({
    module: input.module,
    overlay,
    completedGraphFunctionRef: input.completedGraphFunctionRef
  });
  if (continuation === null) {
    return null;
  }
  const publishedTraversalTargetRef = sdlcPublishedTraversalTargetRef({
    graphFunctionRef: continuation.nextGraphFunctionRef,
    graphVectorRef: continuation.nextGraphVectorRef
  });
  const targetOutcomeRef = sdlcTargetOutcomeRef({
    graphFunctionRef: continuation.nextGraphFunctionRef,
    targetNodeRef: continuation.targetNodeRef
  });
  return Object.freeze({
    actionRef: [
      "construction-action://odd-sdlc/post-action",
      continuation.nextGraphFunctionRef,
      "post_close_overlay_continuation",
      continuation.nextGraphVectorRef,
      encodeURIComponent(input.runRef)
    ].join("/"),
    actionKind: "invoke_graph_function" as const,
    graphFunctionRef: continuation.nextGraphFunctionRef,
    graphVectorRef: continuation.nextGraphVectorRef,
    publishedTraversalTargetRef,
    targetOutcomeRef,
    inputAssetRefs: Object.freeze([]),
    expectedOutputAssetRefs: Object.freeze([targetOutcomeRef]),
    requiredAuthorityRefs: Object.freeze([publishedTraversalTargetRef]),
    eligibleReasonRefs: Object.freeze([
      "evaluate_next_post_close_overlay_continuation",
      `overlay:${continuation.overlayRef}`,
      `terminal_graph:${continuation.terminalGraphFunctionRef}`,
      `completed_graph:${continuation.completedGraphFunctionRef}`,
      `completed_vector:${continuation.completedGraphVectorRef}`,
      `next_graph:${continuation.nextGraphFunctionRef}`,
      `next_vector:${continuation.nextGraphVectorRef}`,
      `sequence_index:${continuation.sequenceIndex}`
    ])
  });
}

export function deriveSdlcPostProductMaterializationActionResolution(input: {
  readonly module: Module;
  readonly runRef: string;
  readonly downstreamPressureRefs: readonly string[];
  readonly downstreamTargetBindingRefs: readonly string[];
  readonly admittedAssetTypes: readonly string[];
  readonly scopeModuleName?: string | null | undefined;
  readonly scopeScheduleRef?: string | null | undefined;
}): SdlcPostProductMaterializationActionResolution {
  const downstreamPressureRefs = uniqueSorted(input.downstreamPressureRefs);
  const downstreamTargetBindingRefs = uniqueSorted(
    input.downstreamTargetBindingRefs
  );
  const downstreamTargetAssetTypes = uniqueSorted(
    downstreamTargetBindingRefs.flatMap((ref) => {
      const assetType = targetAssetTypeFromBindingRef(ref);
      return assetType === null ? [] : [assetType];
    })
  );
  const admittedAssetTypes = new Set(uniqueSorted(input.admittedAssetTypes));
  if (
    downstreamPressureRefs.length === 0 ||
    downstreamTargetBindingRefs.length === 0
  ) {
    return Object.freeze({ status: "no_pressure" as const });
  }
  if (
    downstreamTargetAssetTypes.length > 0 &&
    downstreamTargetAssetTypes.every((assetType) =>
      admittedAssetTypes.has(assetType)
    )
  ) {
    return Object.freeze({ status: "no_pressure" as const });
  }
  const materializationAction = deriveSdlcPublishedProductMaterializationAction({
    module: input.module,
    downstreamTargetBindingRefs
  });
  if (
    materializationAction.status !== "eligible" ||
    materializationAction.graphFunctionRef === null ||
    materializationAction.publishedActionRef === null
  ) {
    return Object.freeze({
      status: "no_candidate_matched" as const,
      reasonRefs: materializationAction.reasonRefs
    });
  }
  const targetAssetType = materializationAction.outputAssetTypes[0];
  if (targetAssetType === undefined) {
    return Object.freeze({
      status: "no_candidate_matched" as const,
      reasonRefs: materializationAction.reasonRefs
    });
  }
  const graphTrackResolution = graphTrackActionTargetFor({
    module: input.module,
    downstreamTargetBindingRefs,
    admittedAssetTypes: uniqueSorted(input.admittedAssetTypes)
  });
  if (graphTrackResolution.status !== "selected") {
    return Object.freeze({
      status: "blocked" as const,
      blockingReason: makeSdlcBlockingReason({
        code: "post_materialization_graph_track_unresolved",
        detail: graphTrackResolution.reasonRef,
        evidenceRefs: uniqueSorted([
          ...downstreamPressureRefs,
          ...downstreamTargetBindingRefs,
          ...materializationAction.reasonRefs
        ])
      })
    });
  }
  const graphTrackTarget = graphTrackResolution.target;
  const scopeModuleName = input.scopeModuleName ?? null;
  const scopeScheduleRef = input.scopeScheduleRef ?? null;
  const scopePath =
    scopeModuleName === null
      ? EMPTY_SCOPE_PATH
      : Object.freeze(["scope", encodeURIComponent(scopeModuleName)]);
  const targetOutcomeRef = [
      "target-outcome://odd-sdlc/post-action",
      materializationAction.graphFunctionRef,
      targetAssetType,
      ...scopePath,
      encodeURIComponent(input.runRef)
    ].join("/");
  return Object.freeze({
    status: "selected" as const,
    action: Object.freeze({
      actionRef: [
        "construction-action://odd-sdlc/post-action",
        FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
        scopeModuleName === null
          ? "post_downstream_product_materialization"
          : "post_deferred_scope_product_materialization",
        ...(scopeModuleName === null ? [] : [encodeURIComponent(scopeModuleName)]),
        targetOutcomeRef
      ].join("/"),
      actionKind: "invoke_graph_function" as const,
      graphFunctionRef: graphTrackTarget.graphFunctionRef,
      graphVectorRef: graphTrackTarget.graphVectorRef,
      publishedTraversalTargetRef: graphTrackTarget.publishedTraversalTargetRef,
      targetOutcomeRef: graphTrackTarget.targetOutcomeRef,
      inputAssetRefs: Object.freeze([]),
      expectedOutputAssetRefs: Object.freeze(
        uniqueSorted([
          ...materializationAction.outputAssetTypes.map(assetTypeRefFor),
          targetOutcomeRef,
          graphTrackTarget.targetOutcomeRef
        ])
      ),
      requiredAuthorityRefs: uniqueSorted([
        materializationAction.publishedActionRef,
        graphTrackTarget.publishedTraversalTargetRef
      ]),
      eligibleReasonRefs: uniqueSorted([
        "evaluate_next_downstream_requirement_transformation_set",
        `graph_track_function:${graphTrackTarget.graphFunctionName}`,
        `graph_track_vector:${graphTrackTarget.graphVectorName}`,
        `graph_track_target:${graphTrackTarget.publishedTraversalTargetRef}`,
        `graph_track_requested_target:${graphTrackTarget.requestedTargetAssetType}`,
        `graph_track_selected_target:${graphTrackTarget.targetAssetType}`,
        ...(scopeModuleName === null
          ? []
          : [`feature_scope_deferred_module:${scopeModuleName}`]),
        ...(scopeScheduleRef === null
          ? []
          : [`selected_schedule_ref:${scopeScheduleRef}`]),
        ...materializationAction.reasonRefs,
        ...downstreamPressureRefs.map((ref) => `downstream_pressure:${ref}`),
        ...downstreamTargetBindingRefs.map((ref) => `target_binding:${ref}`)
      ])
    })
  });
}

export function deriveSdlcPostProductMaterializationActionInput(input: {
  readonly module: Module;
  readonly runRef: string;
  readonly downstreamPressureRefs: readonly string[];
  readonly downstreamTargetBindingRefs: readonly string[];
  readonly admittedAssetTypes: readonly string[];
  readonly scopeModuleName?: string | null | undefined;
  readonly scopeScheduleRef?: string | null | undefined;
}): OddSdlcEvaluateNextActionInput | null {
  const resolution = deriveSdlcPostProductMaterializationActionResolution(input);
  return resolution.status === "selected" ? resolution.action : null;
}

function postProductMaterializationCandidateFor(input: {
  readonly module: Module;
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly downstreamPressureRefs: readonly string[];
  readonly downstreamTargetBindingRefs: readonly string[];
  readonly admittedAssetTypes: readonly string[];
  readonly scopeModuleName?: string | null | undefined;
  readonly scopeScheduleRef?: string | null | undefined;
}): OddSdlcEvaluateNextActionInput | null {
  const resolution = deriveSdlcPostProductMaterializationActionResolution({
    module: input.module,
    runRef: manifestRefSegment(input.state.manifest),
    downstreamPressureRefs: input.downstreamPressureRefs,
    downstreamTargetBindingRefs: input.downstreamTargetBindingRefs,
    admittedAssetTypes: input.admittedAssetTypes,
    scopeModuleName: input.scopeModuleName,
    scopeScheduleRef: input.scopeScheduleRef
  });
  return resolution.status === "selected" ? resolution.action : null;
}

function deferredProductMaterializationModuleFor(
  state: SdlcAbgOwnedFpDispatchState
): string | null {
  if (
    state.manifest.graphFunctionName !== FG_MATERIALIZE_DECLARED_PRODUCT_ASSET ||
    state.manifest.featureScope.mode !== "steel_thread"
  ) {
    return null;
  }
  return state.manifest.featureScope.deferredModuleNames[0] ?? null;
}

function materializationScheduleRefForModule(moduleName: string): string {
  return [
    "schedule://odd_sdlc",
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    moduleName
  ].join("/");
}

function candidateProjectionScopeSegment(
  candidates: readonly OddSdlcEvaluateNextActionInput[]
): string {
  if (candidates.length !== 1) {
    return "mixed";
  }
  const candidate = candidates[0];
  const scopedModule = candidate?.eligibleReasonRefs
    ?.find((ref) => ref.startsWith("feature_scope_deferred_module:"))
    ?.slice("feature_scope_deferred_module:".length);
  return scopedModule === undefined || scopedModule.length === 0
    ? "general"
    : `module/${encodeURIComponent(scopedModule)}`;
}

export function normalizePostCloseContinuationVectorIndex(input: {
  readonly closureDecisionDisposition: string;
  readonly currentVectorIndex: number;
  readonly nextVectorIndex: number | null;
}): number | null {
  if (
    input.closureDecisionDisposition === "close" &&
    input.nextVectorIndex === input.currentVectorIndex
  ) {
    return null;
  }
  return input.nextVectorIndex;
}

function postActionCandidates(input: {
  readonly basis: ExecutionBasis;
  readonly module: Module;
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly closureDecisionDisposition: string;
  readonly nextVectorIndex: number | null;
  readonly activeOverlayRef: string | null;
  readonly completedGraphFunctionRef: string;
  readonly runRef: string;
  readonly downstreamPressureRefs: readonly string[];
  readonly downstreamTargetBindingRefs: readonly string[];
  readonly admittedAssetTypes: readonly string[];
}) {
  const nextVectorIndex = normalizePostCloseContinuationVectorIndex({
    closureDecisionDisposition: input.closureDecisionDisposition,
    currentVectorIndex: input.state.manifest.vectorIndex,
    nextVectorIndex: input.nextVectorIndex
  });
  const nextDeferredModule =
    input.closureDecisionDisposition === "close"
      ? deferredProductMaterializationModuleFor(input.state)
      : null;
  if (nextDeferredModule !== null) {
    const scopeScheduleRef =
      materializationScheduleRefForModule(nextDeferredModule);
    const productMaterializationCandidate =
      postProductMaterializationCandidateFor({
        module: input.module,
        state: input.state,
        downstreamPressureRefs: uniqueSorted([
          input.state.manifest.featureScope.scopeRef,
          scopeScheduleRef,
          ...input.state.manifest.featureScope.basisRefs.map(
            (ref) => `prior_scope_basis:${ref}`
          )
        ]),
        downstreamTargetBindingRefs: input.downstreamTargetBindingRefs,
        admittedAssetTypes: input.admittedAssetTypes,
        scopeModuleName: nextDeferredModule,
        scopeScheduleRef
      });
    if (productMaterializationCandidate !== null) {
      return Object.freeze([productMaterializationCandidate]);
    }
  }
  if (
    input.closureDecisionDisposition === "close" &&
    input.downstreamPressureRefs.length > 0
  ) {
    const productMaterializationCandidate =
      postProductMaterializationCandidateFor({
        module: input.module,
        state: input.state,
        downstreamPressureRefs: input.downstreamPressureRefs,
        downstreamTargetBindingRefs: input.downstreamTargetBindingRefs,
        admittedAssetTypes: input.admittedAssetTypes
      });
    if (productMaterializationCandidate !== null) {
      return Object.freeze([productMaterializationCandidate]);
    }
  }
  if (
    input.closureDecisionDisposition === "close" &&
    nextVectorIndex === null
  ) {
    const overlayContinuationCandidate =
      deriveSdlcPostCloseOverlayContinuationActionInput({
        module: input.module,
        overlayRef: input.activeOverlayRef,
        completedGraphFunctionRef: input.completedGraphFunctionRef,
        runRef: input.runRef
      });
    return Object.freeze(
      overlayContinuationCandidate === null
        ? []
        : [overlayContinuationCandidate]
    );
  }
  if (
    input.closureDecisionDisposition === "close" &&
    nextVectorIndex !== null
  ) {
    return Object.freeze([
      postActionCandidateFor({
        basis: input.basis,
        vectorIndex: nextVectorIndex,
        basisKind: "post_close_graph_continuation",
        actionKind: "continue_graph_call"
      })
    ]);
  }
  if (input.closureDecisionDisposition === "retry") {
    return Object.freeze([
      postActionCandidateFor({
        basis: input.basis,
        vectorIndex: input.state.manifest.vectorIndex,
        basisKind: "post_retry",
        actionKind: "continue_graph_call"
      })
    ]);
  }
  if (input.closureDecisionDisposition === "repair") {
    const repairReentryPlans =
      input.state.gapDossier === null
        ? Object.freeze([])
        : componentRepairReentryPlansForGapDossier({
            manifest: input.state.manifest,
            dossier: input.state.gapDossier
          });
    const repairReentryVectorIndexes = repairReentryPlans
      .map((plan) =>
        vectorIndexByEdgeName({
          basis: input.basis,
          edgeName: plan.targetEdgeName
        })
      )
      .filter(
        (index): index is number =>
          index !== null && index <= input.state.manifest.vectorIndex
      );
    if (repairReentryVectorIndexes.length > 0) {
      return Object.freeze([
        postActionCandidateFor({
          basis: input.basis,
          vectorIndex: Math.min(...repairReentryVectorIndexes),
          basisKind: "post_repair_reentry",
          actionKind: "reenter_graph_span"
        })
      ]);
    }
    const firstRepairReentryPlan = repairReentryPlans[0];
    if (firstRepairReentryPlan !== undefined) {
      return Object.freeze([
        postRepairGraphFunctionCandidateForPlan({
          plan: firstRepairReentryPlan,
          runRef: input.runRef
        })
      ]);
    }
    return Object.freeze([
      postActionCandidateFor({
        basis: input.basis,
        vectorIndex: input.state.manifest.vectorIndex,
        basisKind: "post_repair",
        actionKind: "repair_same_edge"
      })
    ]);
  }
  if (input.closureDecisionDisposition === "re-enter") {
    return Object.freeze([
      postActionCandidateFor({
        basis: input.basis,
        vectorIndex: input.state.manifest.vectorIndex,
        basisKind: "post_reenter",
        actionKind: "reenter_graph_span"
      })
    ]);
  }
  return Object.freeze([]);
}

function blockingReasonRefsFromCarriers(input: {
  readonly runRef: string;
  readonly scope: string;
  readonly carriers: readonly SdlcBlockingReason[];
}): readonly string[] {
  return uniqueSorted(
    input.carriers.flatMap((reason, index) => [
      `blocking-reason://odd-sdlc/${input.runRef}/${input.scope}/${String(index)}/${reason.code}`,
      ...reason.evidenceRefs
    ])
  );
}

function postProductMaterializationGraphTrackBlockingReasons(input: {
  readonly module: Module;
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly downstreamPressureRefs: readonly string[];
  readonly downstreamTargetBindingRefs: readonly string[];
  readonly admittedAssetTypes: readonly string[];
}): readonly SdlcBlockingReason[] {
  if (
    input.state.status !== "worker_invoked" ||
    input.state.postflight?.status !== "passed" ||
    input.downstreamPressureRefs.length === 0 ||
    input.downstreamTargetBindingRefs.length === 0
  ) {
    return Object.freeze([]);
  }
  const resolution = deriveSdlcPostProductMaterializationActionResolution({
    module: input.module,
    runRef: manifestRefSegment(input.state.manifest),
    downstreamPressureRefs: input.downstreamPressureRefs,
    downstreamTargetBindingRefs: input.downstreamTargetBindingRefs,
    admittedAssetTypes: input.admittedAssetTypes
  });
  return resolution.status === "blocked"
    ? Object.freeze([resolution.blockingReason])
    : Object.freeze([]);
}

function executionEvidenceClosesExecutionResultSource(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly executionEvidence: SdlcWorkerExecutionEvidence;
}): boolean {
  if (input.executionEvidence.reportRefs.length === 0) {
    return false;
  }
  if (input.state.manifest.targetAssetType === "test_execution_result_surface") {
    return input.executionEvidence.status !== "pending";
  }
  return (
    input.executionEvidence.status === "succeeded" &&
    (input.executionEvidence.testsObserved ?? 0) > 0 &&
    (input.executionEvidence.failedCount ?? 0) === 0
  );
}

export function edgeAssuranceEvidenceCandidatesFor(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly obligationIds: readonly string[];
}): readonly SdlcEdgeEvidenceCandidate[] {
  const closureObligationIds = new Set(input.obligationIds);
  const assessmentCandidates = (input.state.workerReport?.obligationAssessments ??
    Object.freeze([]))
    .filter(
      (assessment) =>
        assessment.fulfillmentStatus === "fulfilled" &&
        closureObligationIds.has(assessment.obligationId)
    )
    .flatMap((assessment) =>
      assessment.evidenceRefs.map((evidenceRef) =>
        Object.freeze({
          kind: "sdlc_edge_evidence_candidate" as const,
          evidenceRef,
          sourceKind:
            assessment.reviewGrade === true
              ? ("review_grade_assessment" as const)
              : ("worker_assessment" as const),
          obligationRefs: Object.freeze([assessment.obligationId]),
          supportsBehavioralFulfillment: true
        })
      )
    );
  const executionEvidence = input.state.workerReport?.executionEvidence ?? null;
  const executionCandidates =
    executionEvidence !== null &&
    executionEvidenceClosesExecutionResultSource({
      state: input.state,
      executionEvidence
    })
      ? executionEvidence.reportRefs.map((evidenceRef) =>
          Object.freeze({
            kind: "sdlc_edge_evidence_candidate" as const,
            evidenceRef,
            sourceKind: "execution_result" as const,
            obligationRefs: Object.freeze(input.obligationIds),
            supportsBehavioralFulfillment: true
          })
        )
      : Object.freeze([] as const);
  return Object.freeze([...assessmentCandidates, ...executionCandidates]);
}

function stateRequiresExecutionEvidence(
  state: SdlcAbgOwnedFpDispatchState
): boolean {
  return state.manifest.targetAssetType === "test_execution_result_surface";
}

function requiredEvidenceSourceKindsForState(
  state: SdlcAbgOwnedFpDispatchState
): readonly SdlcEdgeEvidenceSourceKind[] {
  return Object.freeze([
    ...(stateRequiresExecutionEvidence(state) ? ["execution_result" as const] : []),
    ...(reviewGradeEdgeFulfillmentAssessmentRequired(state.manifest)
      ? ["review_grade_assessment" as const]
      : [])
  ]);
}

function plannedEdgeAssuranceLedgerInputs(input: {
  readonly ledgerRef: string;
  readonly closureDecisionRef: string;
  readonly nextActionProjectionRef: string;
}): readonly SdlcEdgeLedgerInputRef[] {
  return Object.freeze([
    Object.freeze({
      kind: "sdlc_edge_ledger_input_ref" as const,
      ledgerInputKind: "sdlc_edge_fulfillment_ledger",
      ledgerRef: input.ledgerRef
    }),
    Object.freeze({
      kind: "sdlc_edge_ledger_input_ref" as const,
      ledgerInputKind: "sdlc_edge_closure_decision",
      ledgerRef: input.closureDecisionRef
    }),
    Object.freeze({
      kind: "sdlc_edge_ledger_input_ref" as const,
      ledgerInputKind: "sdlc_next_action_projection",
      ledgerRef: input.nextActionProjectionRef
    })
  ]);
}

function targetCarrierRowForInstalledEdge(input: {
  readonly module: Module;
  readonly edgeName: string;
}): SdlcTargetCarrierContractRow {
  return requireSdlcTargetCarrierRow({
    registry: constructSdlcTargetCarrierRegistry({
      module: input.module,
      contracts: Object.freeze([resolveSdlcEdgeGainClosureContract(input.edgeName)])
    }),
    edgeRef: input.edgeName
  });
}

function targetCarrierAdmissionForState(input: {
  readonly module: Module;
  readonly state: SdlcAbgOwnedFpDispatchState;
}): SdlcTargetCarrierCandidateAdmission {
  const row = targetCarrierRowForInstalledEdge({
    module: input.module,
    edgeName: input.state.manifest.edgeName
  });
  if (input.state.workerReport === null) {
    return missingSdlcTargetCarrierAdmission({
      row,
      reason: "worker_report_missing"
    });
  }
  const reportRef = pathToFileURL(input.state.manifest.reportFile).href;
  const report = input.state.workerReport;
  const artifactRef = pathToFileURL(report.outputFile).href;
  const targetPayload = targetCarrierPayloadForState({
    state: input.state,
    reportRef,
    artifactRef
  });
  if (targetPayload.structuralAdmissionStatus === "rejected") {
    return missingSdlcTargetCarrierAdmission({
      row,
      payloadRef: targetPayload.payloadRef,
      reason: targetPayload.structuralBlockingReasons.length === 0
        ? "target_payload_structural_admission_rejected"
        : targetPayload.structuralBlockingReasons.join(",")
    });
  }
  const candidate = sdlcTargetCarrierCandidate({
    row,
    payload: targetPayload.payload,
    summary: report.summary,
    evidenceRefs: targetPayload.evidenceRefs
  });
  return admitSdlcTargetCarrierCandidate({
    row,
    payloadRef: targetPayload.payloadRef,
    candidate
  });
}

function workerResultTargetPayload(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly reportRef: string;
}): Readonly<Record<string, unknown>> {
  const report = input.state.workerReport;
  if (report === null) {
    throw new TypeError("worker result target payload requires a worker report");
  }
  return Object.freeze({
    kind: "sdlc_worker_result_target_payload",
    reportRef: input.reportRef,
    outputFile: report.outputFile,
    digest: report.digest,
    materializedFiles: report.materializedFiles,
    materializationDiagnostics: report.materializationDiagnostics,
    executionEvidence: report.executionEvidence,
    executionEvidenceErrors: report.executionEvidenceErrors,
    obligationAssessments: report.obligationAssessments,
    fpTransformRequestRef: report.fpTransformRequestRef,
    fpTransformResultRef: report.fpTransformResultRef,
    fpTransformStatusSnapshot: report.fpTransformStatusSnapshot,
    fpEvaluateResultRef: report.fpEvaluateResultRef
  });
}

function targetCarrierPayloadForState(input: {
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly reportRef: string;
  readonly artifactRef: string;
}): {
  readonly payload: unknown;
  readonly payloadRef: string;
  readonly evidenceRefs: readonly string[];
  readonly structuralAdmissionStatus: "admitted" | "rejected" | "not_required";
  readonly structuralBlockingReasons: readonly string[];
} {
  const report = input.state.workerReport;
  if (report === null) {
    throw new TypeError("target carrier payload requires a worker report");
  }
  const baseEvidenceRefs = uniqueSorted([
    input.reportRef,
    input.artifactRef,
    ...report.materializedFiles.map(materializedFileRef)
  ]);
  if (input.state.manifest.targetAssetType === "implementation_design_surface") {
    const admission = admitImplementationDesignRegisterForManifest({
      manifest: input.state.manifest
    });
    return Object.freeze({
      payload: admission.register ?? Object.freeze({}),
      payloadRef: input.artifactRef,
      evidenceRefs: uniqueSorted([...baseEvidenceRefs, ...admission.evidenceRefs]),
      structuralAdmissionStatus: admission.status,
      structuralBlockingReasons: admission.blockingReasons
    });
  }
  if (input.state.manifest.targetAssetType === "test_design_surface") {
    const admission = admitTestDesignRegisterFromArtifact({
      targetAssetType: input.state.manifest.targetAssetType,
      outputFile: report.outputFile
    });
    return Object.freeze({
      payload: admission.register ?? Object.freeze({}),
      payloadRef: input.artifactRef,
      evidenceRefs: uniqueSorted([...baseEvidenceRefs, ...admission.evidenceRefs]),
      structuralAdmissionStatus: admission.status,
      structuralBlockingReasons: admission.blockingReasons
    });
  }
  if (input.state.manifest.targetAssetType === "test_execution_surface") {
    const admission = admitTestExecutionSurfaceRegisterFromArtifact({
      targetAssetType: input.state.manifest.targetAssetType,
      outputFile: report.outputFile
    });
    return Object.freeze({
      payload: admission.register ?? Object.freeze({}),
      payloadRef: input.artifactRef,
      evidenceRefs: uniqueSorted([...baseEvidenceRefs, ...admission.evidenceRefs]),
      structuralAdmissionStatus: admission.status,
      structuralBlockingReasons: admission.blockingReasons
    });
  }
  const componentAdmission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: input.state.manifest.targetAssetType,
    outputFile: report.outputFile
  });
  if (componentAdmission.status === "admitted") {
    return Object.freeze({
      payload: componentAdmission.register ?? Object.freeze({}),
      payloadRef: input.artifactRef,
      evidenceRefs: uniqueSorted([
        ...baseEvidenceRefs,
        ...componentAdmission.evidenceRefs
      ]),
      structuralAdmissionStatus: componentAdmission.status,
      structuralBlockingReasons: componentAdmission.blockingReasons
    });
  }
  return Object.freeze({
    payload: workerResultTargetPayload({
      state: input.state,
      reportRef: input.reportRef
    }),
    payloadRef: input.reportRef,
    evidenceRefs: baseEvidenceRefs,
    structuralAdmissionStatus: "not_required" as const,
    structuralBlockingReasons: Object.freeze([])
  });
}

type SdlcAbgTerminalTransitionProjection = {
  readonly kind: "terminal";
  readonly terminalKind: string;
  readonly reason?: string | null;
};

function evaluationSetTerminalRetryReasonRefs(input: {
  readonly runRef: string;
  readonly terminal: SdlcAbgTerminalTransitionProjection | null;
}): readonly string[] {
  const reason =
    typeof input.terminal?.reason === "string" ? input.terminal.reason : null;
  if (
    input.terminal?.terminalKind !== "gap_stop" ||
    reason === null ||
    !reason.includes("evaluation_set_incomplete")
  ) {
    return Object.freeze([]);
  }
  return Object.freeze([
    `retry://odd-sdlc/${input.runRef}/abg-evaluation-set/${encodeURIComponent(reason)}`
  ]);
}

function deriveInstalledTraversalConsequence(input: {
  readonly basis: ExecutionBasis;
  readonly start: SdlcPublicStartOutcome;
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly admittedAssetEvents?: readonly RuntimeEvent[];
  readonly emittedEvents: readonly RuntimeEvent[];
  readonly engineTerminal: SdlcAbgTerminalTransitionProjection | null;
  readonly nextVectorIndex: number | null;
}): SdlcInstalledOperatorTraversalConsequence {
  if (input.start.executionContract === null) {
    throw new TypeError("installed traversal consequence requires execution contract");
  }
  const constructionIntent = input.start.executionContract.constructionIntent;
  const module = constructSdlcGtlModule();
  const fpEvaluateResultRefs = fpEvaluateResultRefsForState(input.state);
  const evidenceRefs = traversalConsequenceEvidenceRefs({ state: input.state });
  const runRef = manifestRefSegment(input.state.manifest);
  const selectedComposition = input.state.selectedComposition;
  const ledgerRef = `ledger://odd-sdlc/${runRef}/edge-fulfillment`;
  const closureDecisionRef =
    `closure-decision://odd-sdlc/${runRef}/edge-fulfillment/1`;
  const plannedNextActionProjectionRef =
    `next-action://odd-sdlc/${runRef}/edge-assurance/planned`;
  const edgeRef =
    `edge://odd-sdlc/${graphFunctionRefForBasis({ basis: input.basis })}/${input.state.manifest.vectorIndex}`;
  const edgeAssuranceContract = resolveSdlcEdgeGainClosureContract(
    input.state.manifest.edgeName
  );
  const resolvedEdgeAssuranceContractRef =
    sdlcEdgeAssuranceContractRef(edgeAssuranceContract);
  const resolvedEdgeAssuranceContractDigest =
    digestSdlcEdgeGainClosureContract(edgeAssuranceContract);
  const edgeAssuranceContractRef =
    input.state.manifest.edgeAssuranceContractRef ??
    resolvedEdgeAssuranceContractRef;
  const edgeAssuranceContractDigest =
    input.state.manifest.edgeAssuranceContractDigest ??
    resolvedEdgeAssuranceContractDigest;
  if (
    edgeAssuranceContractRef !== resolvedEdgeAssuranceContractRef ||
    edgeAssuranceContractDigest !== resolvedEdgeAssuranceContractDigest
  ) {
    throw new TypeError("installed traversal consequence edge assurance contract drift");
  }
  const admittedAssetTypes = admittedAssetTypesForState({
    state: input.state,
    replayEvents: input.admittedAssetEvents ?? input.replayEvents,
    emittedEvents: input.emittedEvents
  });
  const processEventRefs = workerProcessEvidenceRefs({
    manifest: input.state.manifest,
    workerRun: input.state.workerRun
  });
  const worksiteEvidence = constructSdlcWorksiteEvidence({
    evidenceBundleRef: `evidence://odd-sdlc/${runRef}/worksite`,
    intentRef: constructionIntent.intentRef,
    invocationRef:
      input.state.workerRun === null
        ? pathToFileURL(join(input.state.manifest.archiveRoot, "handoff_manifest.json")).href
        : processStartedRef(input.state.manifest),
    processEventRefs,
    productEvidenceRefs: Object.freeze([
      ...(input.state.workerReport?.materializedFiles.map(materializedFileRef) ??
        [])
    ]),
    admittedProgressRefs: evidenceRefs,
    livenessProjectionRefs:
      input.state.workerRun === null
        ? Object.freeze([])
        : Object.freeze([runtimeLivenessProjectionRef(input.state.manifest)]),
    predecessorRefs: Object.freeze([
      constructionIntent.intentRef,
      constructionIntent.nextActionProjectionRef
    ])
  });
  const fulfillmentProjection = edgeFulfillmentProjectionFor({
    module,
    state: input.state
  });
  const inheritedPressure = inheritedMaterializationPressure({
    selectedActionRef: constructionIntent.selectedActionRef,
    basisRefs: constructionIntent.basisRefs,
    admittedAssetTypes
  });
  const downstreamPressureRefs = uniqueSorted([
    ...fulfillmentProjection.downstreamPressureRefs,
    ...inheritedPressure.downstreamPressureRefs
  ]);
  const downstreamTargetBindingRefs = uniqueSorted([
    ...fulfillmentProjection.downstreamTargetBindingRefs,
    ...inheritedPressure.downstreamTargetBindingRefs
  ]);
  const postActionBlockingReasonCarriers =
    input.state.manifest.graphFunctionName ===
      FG_MATERIALIZE_DECLARED_PRODUCT_ASSET &&
    fulfillmentProjection.nonConvergedReasonRefs.length === 0
      ? postProductMaterializationGraphTrackBlockingReasons({
          module,
          state: input.state,
          downstreamPressureRefs,
          downstreamTargetBindingRefs,
          admittedAssetTypes
        })
      : Object.freeze([]);
  const postActionBlockingReasonRefs = blockingReasonRefsFromCarriers({
    runRef,
    scope: "post-action",
    carriers: postActionBlockingReasonCarriers
  });
  const edgeAssuranceObligations = deriveSdlcEdgeObligations({
    contract: edgeAssuranceContract,
    obligationRefs: fulfillmentProjection.edgeLocalObligationIds
  });
  const targetCarrierAdmission = targetCarrierAdmissionForState({
    module,
    state: input.state
  });
  const edgeEvidenceAdmission = admitSdlcEdgeEvidence({
    contract: edgeAssuranceContract,
    obligations: edgeAssuranceObligations,
    candidates: edgeAssuranceEvidenceCandidatesFor({
      state: input.state,
      obligationIds: fulfillmentProjection.edgeLocalObligationIds
    }),
    targetCarrierAdmission
  });
  const edgeGain = measureSdlcEdgeGain({
    contract: edgeAssuranceContract,
    obligations: edgeAssuranceObligations,
    admittedEvidence: edgeEvidenceAdmission.admittedEvidence,
    ledgerInputs: plannedEdgeAssuranceLedgerInputs({
      ledgerRef,
      closureDecisionRef,
      nextActionProjectionRef: plannedNextActionProjectionRef
    }),
    targetCarrierAdmission,
    targetCarrierRequired: true,
    requiredEvidenceSourceKinds: requiredEvidenceSourceKindsForState(input.state)
  });
  const edgeResidualPressure = deriveSdlcEdgeResidualPressure(edgeGain);
  const edgeAssuranceCloseDecision = deriveSdlcEdgeAssuranceCloseDecision({
    gain: edgeGain,
    residualPressure: edgeResidualPressure
  });
  const abgEvaluationSetRetryReasonRefs = evaluationSetTerminalRetryReasonRefs({
    runRef,
    terminal: input.engineTerminal
  });
  const retryReasonRefs = uniqueSorted([
    ...blockingReasonRefsForReentry({
      state: input.state,
      lawfulReentryPoint: "same_edge_retry"
    }),
    ...abgEvaluationSetRetryReasonRefs
  ]);
  const repairReasonRefs = blockingReasonRefsForReentry({
    state: input.state,
    lawfulReentryPoint: "repair_worker_output"
  });
  const repriceReasonRefs = blockingReasonRefsForReentry({
    state: input.state,
    lawfulReentryPoint: "reprice_requirement_or_design"
  });
  const ledger = constructSdlcEdgeFulfillmentLedger({
    selectedComposition,
    ledgerRef,
    ledgerVersionRef: `ledger-version://odd-sdlc/${runRef}/edge-fulfillment/1`,
    overlayRef: input.start.executionContract.overlayRef,
    overlayBindingRef: input.start.executionContract.overlayBindingRef,
    graphCatalogDigestRef:
      input.start.executionContract.overlayBinding.graphCatalogDigestRef,
    edgeAssuranceContractRef,
    edgeAssuranceContractDigest,
    targetCarrierContractRef: edgeGain.targetCarrierContractRef,
    targetCarrierContractDigest: edgeGain.targetCarrierContractDigest,
    targetCarrierAdmissionStatus: edgeGain.targetCarrierAdmissionStatus,
    targetCarrierAdmissionRef: edgeGain.targetCarrierAdmissionRef,
    edgeGainRef: edgeGain.gainRef,
    edgeResidualPressureRefs: edgeResidualPressure.requiredPressureRefs,
    edgeRef,
    attemptRef: `attempt://odd-sdlc/${runRef}/${input.state.manifest.vectorIndex}`,
    targetBindingRefs: input.start.executionContract.nextActionProjection.targetBindingRefs,
    evidenceBundleRefs: Object.freeze([worksiteEvidence.evidenceBundleRef]),
    materializationRefs: workerOutputMaterializationRefs(input.state),
    livenessProjectionRefs: worksiteEvidence.livenessProjectionRefs,
    admissionRefs: Object.freeze([
      ...evidenceRefs,
      ...(targetCarrierAdmission?.status === "admitted"
        ? [targetCarrierAdmission.validationRef]
        : [])
    ]),
    downstreamTransformationSetRefs:
      fulfillmentProjection.downstreamTransformationSetRefs,
    downstreamPressureRefs,
    downstreamTargetBindingRefs,
    counts: fulfillmentProjection.counts,
    assessmentCount: fulfillmentProjection.assessmentCount,
    admitted: true,
    targetCertificationPassed: input.state.postflight?.status === "passed",
    fdRecheckPassed:
      input.state.status !== "worker_report_rejected" &&
      postActionBlockingReasonCarriers.length === 0,
    predecessorRefs: Object.freeze([
      constructionIntent.intentRef,
      worksiteEvidence.evidenceBundleRef,
      ...fpEvaluateResultRefs,
      ...input.start.executionContract.nextActionProjection.targetBindingRefs
    ])
  });
  const currentEdgeLawful =
    input.state.status !== "worker_report_rejected" &&
    repriceReasonRefs.length === 0 &&
    abgEvaluationSetRetryReasonRefs.length === 0;
  const yieldResumeBasis = currentEdgeLawful
    ? deriveSdlcProductLineageYieldResumeBasis({
        runRef,
        edgeRef: ledger.edgeRef,
        blockingReasonCarriers: input.state.blockingReasonCarriers,
        productEvidenceRefs: worksiteEvidence.productEvidenceRefs,
        livenessProjectionRefs: worksiteEvidence.livenessProjectionRefs
      })
    : null;
  const closureDecision = deriveSdlcEdgeClosureDecision({
    decisionRef: closureDecisionRef,
    ledger,
    edgeClosureFunctionRef: edgeAssuranceContract.closureFunctionRef,
    edgeAssuranceCloseDecision,
    currentEdgeLawful,
    retryReasonRefs,
    repairReasonRefs,
    repriceReasonRefs,
    yieldResumeBasis,
    blockReasonRefs: uniqueSorted([
      ...blockReasonRefsForState(input.state),
      ...fulfillmentProjection.nonConvergedReasonRefs,
      ...postActionBlockingReasonRefs
    ])
  });
  const overlayCatalog = constructSdlcTraversalOverlayCatalog({ module });
  const activeOverlay = overlayCatalog.overlays.find(
    (overlay) => overlay.overlayRef === input.start.executionContract?.overlayRef
  ) ?? null;
  const overlaySegmentCompletion =
    closureDecision.disposition === "close" &&
    input.nextVectorIndex === null &&
    activeOverlay !== null
      ? (() => {
          const completedGraphFunctionRef =
            input.start.executionContract.targetGraphFunction;
          const productConvergenceAllowed = sdlcTraversalOverlayAllowsProductConvergence({
            overlay: activeOverlay,
            completedGraphFunctionRef,
            module
          });
          const hasRemainingOverlayPressure =
            activeOverlay.termination.remainingGraphPressureRefs.length > 0 ||
            activeOverlay.termination.remainingRequirementPressureRefs.length > 0 ||
            activeOverlay.termination.remainingAssetPressureRefs.length > 0 ||
            activeOverlay.termination.nextEligibleOverlayRefs.length > 0;
          const productConverged =
            productConvergenceAllowed && !hasRemainingOverlayPressure;
          return constructSdlcOverlaySegmentCompletion({
            completionRef: `overlay-segment-completion://odd-sdlc/${runRef}`,
            closureDecision,
            stopDisposition: productConverged
              ? "product_converged"
              : "overlay_segment_complete",
            terminalAssetTypes: activeOverlay.termination.terminalAssetTypes,
            terminalGraphFunctionRefs:
              activeOverlay.termination.terminalGraphFunctionRefs,
            remainingGraphPressureRefs:
              activeOverlay.termination.remainingGraphPressureRefs,
            remainingRequirementPressureRefs:
              activeOverlay.termination.remainingRequirementPressureRefs,
            remainingAssetPressureRefs:
              activeOverlay.termination.remainingAssetPressureRefs,
            nextEligibleOverlayRefs: activeOverlay.termination.nextEligibleOverlayRefs
          });
        })()
      : null;
  const candidates = postActionCandidates({
    basis: input.basis,
    module,
    state: input.state,
    closureDecisionDisposition: closureDecision.disposition,
    nextVectorIndex: input.nextVectorIndex,
    activeOverlayRef: activeOverlay?.overlayRef ?? null,
    completedGraphFunctionRef: input.start.executionContract.targetGraphFunction,
    runRef,
    downstreamPressureRefs: ledger.downstreamPressureRefs,
    downstreamTargetBindingRefs: ledger.downstreamTargetBindingRefs,
    admittedAssetTypes
  });
  const pressureRef =
    `pressure://odd-sdlc/post-action/${runRef}/${closureDecision.disposition}`;
  const nextActionProjection =
    candidates.length === 0
      ? constructSdlcNextActionProjection({
          selectedComposition,
          nextActionProjectionRef:
            `next-action://odd-sdlc/${runRef}/${closureDecision.disposition}/no-action`,
          intentEventRefs: constructionIntent.intentEventRefs,
          productAssetModelRef: constructionIntent.productAssetModelRef,
          gapPressureRefs: Object.freeze([pressureRef]),
          targetBindingRefs: ledger.targetBindingRefs,
          closureDecision,
          observationRef: `observation://odd-sdlc/post-action/${runRef}`,
          policyRefs: Object.freeze([
            "policy://odd-sdlc/evaluate-next/post-action/no-action"
          ]),
          actionCatalogRefs: Object.freeze([
            `catalog://odd-sdlc/post-action/${runRef}/empty`
          ]),
          overlaySegmentCompletion,
          nextGraphFunctionRef: null,
          nextGraphVectorRef: null
        })
      : (() => {
          const projectionScopeSegment = candidateProjectionScopeSegment(candidates);
          const evaluator = deriveOddSdlcEvaluateNextReport({
            basis: input.basis,
            events: Object.freeze([...input.replayEvents, ...input.emittedEvents]),
            intentEventRefs: constructionIntent.intentEventRefs,
            productAssetModelRef: constructionIntent.productAssetModelRef,
            episodeId:
              `construction-episode://odd-sdlc/post-action/${runRef}/${projectionScopeSegment}`,
            observationId:
              `construction-observation://odd-sdlc/post-action/${runRef}/${projectionScopeSegment}`,
            pressures: Object.freeze([
              {
                pressureRef,
                pressureKind: "gap_row",
                sourceRef: closureDecision.decisionRef,
                affectedAssetRefs: Object.freeze(
                  candidates.flatMap(
                    (candidate) => candidate.expectedOutputAssetRefs ?? []
                  )
                ),
                targetOutcomeRefs: Object.freeze(
                  candidates.map((candidate) => candidate.targetOutcomeRef)
                ),
                evidenceRefs,
                severity: 1
              }
            ]),
            actions: candidates
          });
          return constructSdlcNextActionProjection({
            selectedComposition,
            nextActionProjectionRef: evaluator.priorityProjection.projectionRef,
            intentEventRefs: evaluator.intentEventRefs,
            productAssetModelRef: evaluator.productAssetModelRef,
            gapPressureRefs: evaluator.gapPressureRefs,
            targetBindingRefs: ledger.targetBindingRefs,
            closureDecision,
            observationRef: evaluator.observation.observationId,
            policyRefs: Object.freeze([
              evaluator.policyCarrierRef,
              evaluator.priorityProjection.prioritySchemeRef
            ]),
            actionCatalogRefs: evaluator.actionCatalogRefs,
            overlaySegmentCompletion,
            selectedActionRef: evaluator.selectedPriorityRow?.actionRef ?? null,
            nextGraphFunctionRef: evaluator.bestGraphFunctionRef,
            nextGraphVectorRef: evaluator.bestGraphVectorRef
          });
        })();
  const postActionOverlayBinding = withSdlcOverlayBindingPostActionEvidence({
    binding: input.start.executionContract.overlayBinding,
    postActionWorkspaceObservationRef: nextActionProjection.observationRef,
    postActionWorkspaceFingerprintRef:
      `workspace-fingerprint://odd-sdlc/post-action/${runRef}`,
    workspaceDeltaRef: `workspace-delta://odd-sdlc/${runRef}`
  });
  const admittedStateRef: GtlAdmittedStateRef = Object.freeze({
    compositionRef: selectedComposition.compositionRef,
    compositionDigest: selectedComposition.compositionDigest,
    compositionSelectionRef: selectedComposition.compositionSelectionRef,
    graphCallRef: constructionIntent.intentRef,
    frameRef: pathToFileURL(
      join(input.state.manifest.archiveRoot, "handoff_manifest.json")
    ).href,
    eventRefs: uniqueSorted([
      ...constructionIntent.intentEventRefs,
      ...processEventRefs,
      processEventsRef(input.state.manifest)
    ]),
    ledgerRefs: uniqueSorted([ledger.ledgerVersionRef, closureDecision.decisionRef]),
    projectionRefs: uniqueSorted([nextActionProjection.nextActionProjectionRef])
  });
  const consequenceProjection: GtlConsequenceProjectionRef = Object.freeze({
    consequenceRef: `consequence://odd-sdlc/${runRef}/traversal`,
    compositionRef: selectedComposition.compositionRef,
    compositionDigest: selectedComposition.compositionDigest,
    compositionSelectionRef: selectedComposition.compositionSelectionRef,
    assuranceDecisionRef:
      closureDecision.edgeAssuranceDecisionRef ?? closureDecision.decisionRef,
    traversalTransitionRef: nextActionProjection.nextActionProjectionRef,
    domainReadModelRefs: uniqueSorted([
      ledger.ledgerVersionRef,
      closureDecision.decisionRef,
      nextActionProjection.nextActionProjectionRef,
      ...(overlaySegmentCompletion === null
        ? []
        : [overlaySegmentCompletion.completionRef])
    ])
  });
  return Object.freeze({
    kind: "sdlc_installed_operator_traversal_consequence" as const,
    selectedComposition,
    constructionIntent,
    worksiteEvidence,
    edgeGain,
    edgeResidualPressure,
    edgeFulfillmentLedger: ledger,
    edgeClosureDecision: closureDecision,
    overlaySegmentCompletion,
    postActionOverlayBinding,
    nextActionProjection,
    admittedStateRef,
    consequenceProjection
  });
}

function writeTraversalConsequenceArchive(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly consequence: SdlcInstalledOperatorTraversalConsequence;
}): void {
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "gtl_admitted_state_ref.json",
    payload: input.consequence.admittedStateRef
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "gtl_consequence_projection_ref.json",
    payload: input.consequence.consequenceProjection
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_construction_intent.json",
    payload: input.consequence.constructionIntent
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_worksite_evidence.json",
    payload: input.consequence.worksiteEvidence
  });
  if (input.consequence.edgeGain !== undefined) {
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      relativePath: "sdlc_edge_gain.json",
      payload: input.consequence.edgeGain
    });
  }
  if (input.consequence.edgeResidualPressure !== undefined) {
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      relativePath: "sdlc_edge_residual_pressure.json",
      payload: input.consequence.edgeResidualPressure
    });
  }
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_edge_fulfillment_ledger.json",
    payload: input.consequence.edgeFulfillmentLedger
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_edge_closure_decision.json",
    payload: input.consequence.edgeClosureDecision
  });
  if (input.consequence.overlaySegmentCompletion !== null) {
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      relativePath: "sdlc_overlay_segment_completion.json",
      payload: input.consequence.overlaySegmentCompletion
    });
  }
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_overlay_binding_post_action.json",
    payload: input.consequence.postActionOverlayBinding
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "sdlc_next_action_projection.json",
    payload: input.consequence.nextActionProjection
  });
}

function nextLawfulActionFromConsequence(
  consequence: SdlcInstalledOperatorTraversalConsequence
): string {
  return (
    consequence.nextActionProjection.selectedActionRef ??
    `disposition://${consequence.edgeClosureDecision.disposition}`
  );
}

function readOptionalWorkerTextRef(ref: string | null | undefined): string {
  if (ref === null || ref === undefined || !ref.startsWith("file:")) {
    return "";
  }
  try {
    return readFileSync(fileURLToPath(ref), "utf8").slice(0, 65536);
  } catch {
    return "";
  }
}

function readOptionalWorkerTextPath(path: string | null | undefined): string {
  if (path === null || path === undefined) {
    return "";
  }
  try {
    return readFileSync(path, "utf8").slice(0, 65536);
  } catch {
    return "";
  }
}

function workerRunRateLimited(workerRun: SdlcWorkerRunResult): boolean {
  const text = [
    readOptionalWorkerTextRef(workerRun.finalOutputRef),
    readOptionalWorkerTextRef(workerRun.traceResultRef),
    readOptionalWorkerTextPath(workerRun.stdoutPath),
    readOptionalWorkerTextPath(workerRun.stderrPath)
  ].join("\n");
  return (
    /api_error_status["']?\s*:?\s*429/u.test(text) ||
    /monthly usage limit|quota exhausted|quota exceeded|rate limit exceeded|rate[- ]limited/u.test(
      text
    ) ||
    /"type"\s*:\s*"rate_limit_event"[\s\S]*"rate_limit_info"\s*:\s*\{[\s\S]*"status"\s*:\s*"rejected"/u.test(
      text
    )
  );
}

function workerRunOutputLimitExceeded(workerRun: SdlcWorkerRunResult): boolean {
  const text = [
    readOptionalWorkerTextRef(workerRun.finalOutputRef),
    readOptionalWorkerTextRef(workerRun.traceResultRef),
    readOptionalWorkerTextPath(workerRun.stdoutPath),
    readOptionalWorkerTextPath(workerRun.stderrPath)
  ].join("\n");
  return /max_output_tokens|response exceeded the \d+ output token maximum|output token maximum|CLAUDE_CODE_MAX_OUTPUT_TOKENS/u.test(
    text
  );
}

function workerFailureCode(input: {
  readonly workerRun: SdlcWorkerRunResult;
  readonly silentInactivity: boolean;
}): SdlcBlockingReasonCode {
  if (workerRunOutputLimitExceeded(input.workerRun)) {
    return "worker_output_limit_exceeded";
  }
  if (workerRunRateLimited(input.workerRun)) {
    return "worker_rate_limited";
  }
  if (input.workerRun.outcome?.kind === "hard_timeout") {
    return "worker_hard_timeout";
  }
  if (input.silentInactivity || input.workerRun.outcome?.kind === "inactivity_timeout") {
    return "silent_worker_inactivity";
  }
  if (input.workerRun.outcome?.kind === "executor_unavailable") {
    return "worker_executor_unavailable";
  }
  if (input.workerRun.outcome?.kind === "launch_failed") {
    return "worker_launch_failed";
  }
  if (input.workerRun.outcome?.kind === "process_error") {
    return "worker_process_error";
  }
  if (input.workerRun.outcome?.kind === "lost_terminal") {
    return "worker_lost_terminal";
  }
  return "worker_process_failed";
}

export function constructWorkerProcessFailurePostflight(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly workerRun: SdlcWorkerRunResult;
}): SdlcPostflightResult {
  const evidenceRefs = workerProcessEvidenceRefs(input);
  const silentInactivity =
    input.workerRun.outcome?.kind === "inactivity_timeout" ||
    (input.workerRun.timedOut &&
      input.workerRun.stdoutByteCount === 0 &&
      input.workerRun.stderrByteCount === 0 &&
      !existsSync(input.manifest.reportFile));
  const status =
    input.workerRun.status === null
      ? input.workerRun.signal ?? input.workerRun.error ?? "unknown"
      : String(input.workerRun.status);
  const silentRetryAvailable =
    silentInactivity && silentInactivitySharpenedRetryAvailable(input.manifest);
  const processSummaryAdmission = admitWorkerProcessSummary(input.manifest);
  if (silentInactivity && processSummaryAdmission.kind !== "admitted") {
    const carrier = makeSdlcBlockingReason({
      code:
        processSummaryAdmission.kind === "missing"
          ? "worker_process_summary_missing"
          : "worker_process_summary_invalid",
      detail: `${processSummaryAdmission.detail};processSummaryRef=${workerProcessSummaryRef(
        input.manifest
      )}`,
      evidenceRefs
    });
    return Object.freeze({
      kind: "sdlc_operator_postflight_result" as const,
      status: "blocked" as const,
      blockingReasons: Object.freeze([legacyBlockingReasonCode(carrier)]),
      blockingReasonCarriers: Object.freeze([carrier]),
      evidenceRefs
    });
  }
  const processSummary =
    processSummaryAdmission.kind === "admitted"
      ? processSummaryAdmission.summary
      : null;
  const signalSequence =
    processSummary === null || processSummary.signalSequence.length === 0
      ? "none"
      : processSummary.signalSequence
          .map((entry) => `${entry.signal}@${String(entry.elapsedMs)}ms`)
          .join(",");
  const livenessDetail =
    processSummary === null
      ? Object.freeze([] as const)
      : Object.freeze([
          `runtimeLivenessAuthority=${processSummary.runtimeLivenessAuthority}`,
          `runtimeLivenessProjectionRef=${processSummary.runtimeLivenessProjectionRef}`,
          `runtimeLivenessLeaseState=${processSummary.runtimeLivenessLeaseState}`,
          `runtimeLivenessDispositionAction=${processSummary.runtimeLivenessDispositionAction}`,
          `runtimeLivenessDispositionReason=${processSummary.runtimeLivenessDispositionReason}`
        ]);
  const carrier = makeSdlcBlockingReason({
    code: workerFailureCode({
      workerRun: input.workerRun,
      silentInactivity
    }),
    lawfulReentryPoint: silentInactivity
      ? priorSilentInactivityCount(input.manifest) === 0 && silentRetryAvailable
        ? "same_edge_retry"
        : "triage_gap"
      : undefined,
    detail: silentInactivity
      ? [
          `elapsedMs=${String(input.workerRun.elapsedMs)}`,
          `stdoutBytes=${String(input.workerRun.stdoutByteCount)}`,
          `stderrBytes=${String(input.workerRun.stderrByteCount)}`,
          `signal=${input.workerRun.signal ?? "none"}`,
          `outcome=${input.workerRun.outcome?.kind ?? "legacy_timeout"}`,
          `executorProfile=${input.workerRun.executorProfile ?? "unknown"}`,
          `streamModel=${input.workerRun.streamModel ?? "unknown"}`,
          `traceResultRef=${input.workerRun.traceResultRef ?? "unknown"}`,
          `pid=${processSummary?.pid ?? "unknown"}`,
          `hardTimeoutMs=${processSummary?.timeoutMs ?? "unknown"}`,
          `inactivityTimeoutMs=${processSummary?.inactivityTimeoutMs ?? "unknown"}`,
          `heartbeatMs=${processSummary?.heartbeatMs ?? "unknown"}`,
          `lastHeartbeatElapsedMs=${processSummary?.lastHeartbeatElapsedMs ?? "none"}`,
          `signalSequence=${signalSequence}`,
          ...livenessDetail,
          `priorSilentAttempts=${String(priorSilentInactivityCount(input.manifest))}`,
          `sharpenedRetryAvailable=${String(silentRetryAvailable)}`,
          `executionShards=${String(input.manifest.productMaterialization.executionShards.length)}`,
          `executionShardIds=${input.manifest.productMaterialization.executionShards
            .map((shard) => shard.shardId)
            .join(",")}`,
          `processSummaryRef=${workerProcessSummaryRef(input.manifest)}`
        ].join(";")
      : [
          `worker exited non-zero: ${status}`,
          `outcome=${input.workerRun.outcome?.kind ?? "unknown"}`,
          `executorProfile=${input.workerRun.executorProfile ?? "unknown"}`,
          `streamModel=${input.workerRun.streamModel ?? "unknown"}`,
          `finalOutputRef=${input.workerRun.finalOutputRef ?? "none"}`,
          `traceResultRef=${input.workerRun.traceResultRef ?? "unknown"}`
        ].join(";"),
    evidenceRefs
  });
  return Object.freeze({
    kind: "sdlc_operator_postflight_result" as const,
    status: "blocked" as const,
    blockingReasons: Object.freeze([legacyBlockingReasonCode(carrier)]),
    blockingReasonCarriers: Object.freeze([carrier]),
    evidenceRefs
  });
}

function silentInactivitySharpenedRetryAvailable(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return manifest.productMaterialization.executionShards.length > 0;
}

function isSilentWorkerRuntimeReason(
  reason: SdlcPostflightGapDossier["reasons"][number]
): boolean {
  if (reason.blockingReason.code === "silent_worker_inactivity") {
    return true;
  }
  return (
    reason.blockingReason.code === "worker_hard_timeout" &&
    (reason.blockingReason.detail?.includes("stdoutBytes=0;stderrBytes=0") ??
      false)
  );
}

function priorSilentInactivityCount(manifest: SdlcWorkerHandoffManifest): number {
  return manifest.retryContext.priorGapDossiers.reduce(
    (count, dossier) =>
      count +
      dossier.reasons.filter(isSilentWorkerRuntimeReason).length,
    0
  );
}

function workerRuntimeTriageStop(postflight: SdlcPostflightResult): boolean {
  return postflight.blockingReasonCarriers.some(
    (reason) =>
      reason.reasonClass === "worker_runtime" &&
      reason.lawfulReentryPoint === "triage_gap"
  );
}

function writeRunArchive(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly outcome: SdlcInstalledOperatorStartOutcome;
}): void {
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "run.json",
    payload: input.outcome
  });
  writeOperatorArchiveFile({
    archiveRoot: input.manifest.archiveRoot,
    relativePath: "postmortem.md",
    payload: [
      "# T-064 Installed Operator Run Postmortem",
      "",
      `status: ${input.outcome.status}`,
      `graph_function: ${input.outcome.summary.graphFunctionName ?? "n/a"}`,
      `current_edge: ${input.outcome.summary.currentEdge ?? "n/a"}`,
      `worker_status: ${input.outcome.workerRun?.status ?? "n/a"}`,
      `postflight: ${input.outcome.postflight?.status ?? "n/a"}`,
      `assurance: ${input.outcome.assuranceSatisfaction?.status ?? "n/a"}`,
      `event_sequence: ${input.outcome.emittedRuntimeEventKinds.join(" -> ")}`,
      `event_log: ${input.outcome.eventLogPath}`,
      ""
    ].join("\n")
  });
}

export async function executeInstalledOperatorStart(input: {
  readonly workspaceRoot: string;
  readonly sourceWorkspaceRoot?: string;
  readonly start: SdlcPublicStartOutcome;
  readonly workerTransport: string | null;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly eventGraphEvents?: readonly RuntimeEvent[];
  readonly retryContextOverride?: SdlcWorkerRetryContext | undefined;
  readonly requireInstalledTopology?: boolean;
}): Promise<SdlcInstalledOperatorStartOutcome> {
  if (input.requireInstalledTopology === true) {
    const topologyValidation = deriveSdlcInstalledQualificationInitialState({
      workspaceRoot: input.workspaceRoot
    });
    const topologyArchiveRoot = join(
      input.workspaceRoot,
      ".ai-workspace",
      "runtime",
      "odd_sdlc",
      "operator-topology",
      operatorRunId()
    );
    writeSdlcInstalledQualificationInitialStateArchive({
      archiveRoot: topologyArchiveRoot,
      validation: topologyValidation
    });
    if (topologyValidation.status !== "valid") {
      return terminalOutcome({
        workspaceRoot: input.workspaceRoot,
        status: "blocked",
        start: input.start,
        transport: null,
        manifest: null,
        workerRun: null,
        workerReport: null,
        postflight: null,
        gapDossier: null,
        hookOutcome: null,
        replayEventCountBefore: input.replayEvents.length,
        replayEventCountAfter: input.replayEvents.length,
        emittedRuntimeEventKinds: Object.freeze([]),
        archiveRoot: topologyArchiveRoot,
        blockingReason: "installed_topology_invalid",
        blockingReasonCarriers: Object.freeze([
          makeSdlcBlockingReason({
            code: "installed_topology_invalid",
            evidenceRefs: [pathToFileURL(topologyArchiveRoot).href]
          })
        ]),
        nextLawfulAction: "run_install_or_repair_installed_topology"
      });
  }
}

type RuntimeEventArchiveScalar = string | number | boolean | null;

function compactRuntimeEventScalar(
  value: unknown
): RuntimeEventArchiveScalar | undefined {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }
  return undefined;
}

function runtimeEventArchiveScalar(
  event: RuntimeEvent,
  key: string
): RuntimeEventArchiveScalar | undefined {
  switch (key) {
    case "eventRef":
      return "eventRef" in event
        ? compactRuntimeEventScalar(event.eventRef)
        : undefined;
    case "eventId":
      return "eventId" in event
        ? compactRuntimeEventScalar(event.eventId)
        : undefined;
    case "basisRef":
      return "basisRef" in event
        ? compactRuntimeEventScalar(event.basisRef)
        : undefined;
    case "decisionRef":
      return "decisionRef" in event
        ? compactRuntimeEventScalar(event.decisionRef)
        : undefined;
    case "resultRef":
      return "resultRef" in event
        ? compactRuntimeEventScalar(event.resultRef)
        : undefined;
    case "frameId":
      return "frameId" in event
        ? compactRuntimeEventScalar(event.frameId)
        : undefined;
    case "vectorIndex":
      return "vectorIndex" in event
        ? compactRuntimeEventScalar(event.vectorIndex)
        : undefined;
    case "edgeName":
      return "edgeName" in event
        ? compactRuntimeEventScalar(event.edgeName)
        : undefined;
    case "graphFunctionName":
      return "graphFunctionName" in event
        ? compactRuntimeEventScalar(event.graphFunctionName)
        : undefined;
    case "targetAssetType":
      return "targetAssetType" in event
        ? compactRuntimeEventScalar(event.targetAssetType)
        : undefined;
    case "status":
      return "status" in event
        ? compactRuntimeEventScalar(event.status)
        : undefined;
    case "reason":
      return "reason" in event
        ? compactRuntimeEventScalar(event.reason)
        : undefined;
    case "routingDecision":
      return "routingDecision" in event
        ? compactRuntimeEventScalar(event.routingDecision)
        : undefined;
    case "correlationId":
      return "correlationId" in event
        ? compactRuntimeEventScalar(event.correlationId)
        : undefined;
    default:
      return undefined;
  }
}

function runtimeEventArchiveStringArray(
  event: RuntimeEvent,
  key: string
): readonly string[] | undefined {
  switch (key) {
    case "affectedFieldRefs":
      return "affectedFieldRefs" in event
        ? compactRuntimeEventStringArray(event.affectedFieldRefs)
        : undefined;
    case "consumedFieldRefs":
      return "consumedFieldRefs" in event
        ? compactRuntimeEventStringArray(event.consumedFieldRefs)
        : undefined;
    case "pressureRefs":
      return "pressureRefs" in event
        ? compactRuntimeEventStringArray(event.pressureRefs)
        : undefined;
    case "diagnosticRefs":
      return "diagnosticRefs" in event
        ? compactRuntimeEventStringArray(event.diagnosticRefs)
        : undefined;
    case "evidenceRefs":
      return "evidenceRefs" in event
        ? compactRuntimeEventStringArray(event.evidenceRefs)
        : undefined;
    case "causationEventRefs":
      return "causationEventRefs" in event
        ? compactRuntimeEventStringArray(event.causationEventRefs)
        : undefined;
    default:
      return undefined;
  }
}

function compactRuntimeEventStringArray(
  value: unknown
): readonly string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const strings = value.filter((item): item is string => typeof item === "string");
  return Object.freeze(strings);
}

function compactRuntimeEventArchivePayload(
  events: readonly RuntimeEvent[]
): Record<string, unknown> {
  const projectedKeys = [
    "eventRef",
    "eventId",
    "basisRef",
    "decisionRef",
    "resultRef",
    "frameId",
    "vectorIndex",
    "edgeName",
    "graphFunctionName",
    "targetAssetType",
    "status",
    "reason",
    "routingDecision",
    "correlationId"
  ];
  const projectedArrayKeys = [
    "affectedFieldRefs",
    "consumedFieldRefs",
    "pressureRefs",
    "diagnosticRefs",
    "evidenceRefs",
    "causationEventRefs"
  ];
  const projectedEvents = events.map((event, index) => {
    const projected: Record<string, unknown> = {
      index,
      kind: event.kind
    };
    for (const key of projectedKeys) {
      const value = runtimeEventArchiveScalar(event, key);
      if (value !== undefined) {
        projected[key] = value;
      }
    }
    for (const key of projectedArrayKeys) {
      const value = runtimeEventArchiveStringArray(event, key);
      if (value !== undefined) {
        projected[key] = value;
      }
    }
    return Object.freeze(projected);
  });
  return Object.freeze({
    kind: "sdlc_runtime_event_archive_projection",
    archiveVersion: "ts-runtime-events-projection-v1",
    eventCount: events.length,
    eventKinds: Object.freeze(events.map((event) => event.kind)),
    events: Object.freeze(projectedEvents)
  });
}
  if (input.start.executionContract === null) {
    return terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "blocked",
      start: input.start,
      transport: null,
      manifest: null,
      workerRun: null,
      workerReport: null,
      postflight: null,
      gapDossier: null,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length,
      emittedRuntimeEventKinds: Object.freeze([]),
      archiveRoot: null,
      blockingReason: "target_unavailable",
      blockingReasonCarriers: Object.freeze([
        makeSdlcBlockingReason({ code: "target_unavailable" })
      ]),
      nextLawfulAction: "fix_target_or_run_gaps"
    });
  }
  const basis = input.start.executionContract.basis;
  const replayCursor = replayEventsWithGraphContinuationCursor({
    basis,
    replayEvents: input.replayEvents,
    nextGraphVectorRef:
      input.start.executionContract.nextActionProjection.nextGraphVectorRef
  });
  const effectiveReplayEvents = replayCursor.replayEvents;
  const sourceWorkspaceRoot = input.sourceWorkspaceRoot ?? input.workspaceRoot;
  const projection = deriveRuntimeAggregateProjection(basis, effectiveReplayEvents);
  const decision = deriveIterationAdvanceDecision(basis, projection);
  if (decision.kind === "converged") {
    return terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "converged",
      start: input.start,
      transport: null,
      manifest: null,
      workerRun: null,
      workerReport: null,
      postflight: null,
      gapDossier: null,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length,
      emittedRuntimeEventKinds: Object.freeze([]),
      archiveRoot: null,
      blockingReason: null,
      nextLawfulAction: "close_or_reprice"
    });
  }

  const transition = deriveAdvancementTransition(basis, effectiveReplayEvents);
  if (transition.kind === "fd_advance") {
    if (transition.edge !== FG_CONFORM_PROJECT) {
      return terminalOutcome({
        workspaceRoot: input.workspaceRoot,
        status: "blocked",
        start: input.start,
        transport: null,
        manifest: null,
        workerRun: null,
        workerReport: null,
        postflight: null,
        gapDossier: null,
        hookOutcome: null,
        replayEventCountBefore: input.replayEvents.length,
        replayEventCountAfter: input.replayEvents.length,
        emittedRuntimeEventKinds: Object.freeze([]),
        archiveRoot: null,
        blockingReason: `unsupported_fd_transition:${transition.edge}`,
        blockingReasonCarriers: Object.freeze([
          makeSdlcBlockingReason({
            code: "unsupported_fd_transition",
            detail: transition.edge
          })
        ]),
        nextLawfulAction: "reprice_runtime_policy",
        currentEdge: transition.edge
      });
    }
    const archiveRoot = join(
      input.workspaceRoot,
      deriveSdlcConformProjectProfileFromWorkspace(input.workspaceRoot).runtimeLayout
        .operatorRunRoot,
      operatorRunId()
    );
    const managedTraversalManifest =
      deriveConformProjectManagedTraversalManifest({
        workspaceRoot: input.workspaceRoot,
        sourceWorkspaceRoot
      });
    const report = materializeSdlcProjectConformance({
      workspaceRoot: input.workspaceRoot,
      sourceWorkspaceRoot
    });
    const managedTraversalLedger = deriveConformProjectManagedTraversalLedger({
      workspaceRoot: input.workspaceRoot,
      manifest: managedTraversalManifest,
      report
    });
    writeOperatorArchiveFile({
      archiveRoot,
      relativePath: "managed_traversal_manifest.json",
      payload: managedTraversalManifest
    });
    writeOperatorArchiveFile({
      archiveRoot,
      relativePath: "managed_traversal_ledger.json",
      payload: managedTraversalLedger
    });
    writeOperatorArchiveFile({
      archiveRoot,
      relativePath: "conform_project_report.json",
      payload: report
    });
    if (replayCursor.cursorEvents.length > 0) {
      await appendOddSdlcRuntimeEvents({
        workspaceRoot: input.workspaceRoot,
        events: replayCursor.cursorEvents
      });
    }
    const conformanceEvents = await appendFdConformanceRuntimeEvents({
      workspaceRoot: input.workspaceRoot,
      basis,
      replayEvents: effectiveReplayEvents,
      vectorIndex: transition.vectorIndex
    });
    const emitted = Object.freeze([
      ...replayCursor.cursorEvents,
      ...conformanceEvents
    ]);
    const outcome = terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "converged",
      start: input.start,
      transport: null,
      manifest: null,
      workerRun: null,
      workerReport: null,
      postflight: null,
      gapDossier: null,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length + emitted.length,
      emittedRuntimeEventKinds: Object.freeze(emitted.map((event) => event.kind)),
      archiveRoot,
      blockingReason: report.status === "passed" ? null : report.conformanceGaps.join(","),
      blockingReasonCarriers:
        report.status === "passed"
          ? Object.freeze([])
          : Object.freeze([
              makeSdlcBlockingReason({
                code: "project_conformance_gaps",
                detail: report.conformanceGaps.join(","),
                evidenceRefs: report.materializedTopologyRefs
              })
            ]),
      nextLawfulAction:
        report.status === "passed"
          ? "rerun_start_for_downstream_graph"
          : "repair_project_conformance",
      currentEdge: transition.edge
    });
    writeOperatorArchiveFile({
      archiveRoot,
      relativePath: "runtime_events.json",
      payload: emitted
    });
    writeOperatorArchiveFile({
      archiveRoot,
      relativePath: "run.json",
      payload: outcome
    });
    writeOperatorArchiveFile({
      archiveRoot,
      relativePath: "postmortem.md",
      payload: [
        "# T-087 Project Induction Run Postmortem",
        "",
        `status: ${outcome.status}`,
        `graph_function: ${outcome.summary.graphFunctionName ?? "n/a"}`,
        `current_edge: ${outcome.summary.currentEdge ?? "n/a"}`,
        `managed_traversal: ${managedTraversalLedger.status}`,
        `conformance: ${report.status}`,
        `conformance_gaps: ${report.conformanceGaps.join(",") || "none"}`,
        `managed_residual_gaps: ${managedTraversalLedger.residualGaps.join(",") || "none"}`,
        `event_sequence: ${outcome.emittedRuntimeEventKinds.join(" -> ")}`,
        `event_log: ${outcome.eventLogPath}`,
        ""
      ].join("\n")
    });
    return outcome;
  }
  if (transition.kind !== "fp_dispatch") {
    return terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "blocked",
      start: input.start,
      transport: null,
      manifest: null,
      workerRun: null,
      workerReport: null,
      postflight: null,
      gapDossier: null,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length,
      emittedRuntimeEventKinds: Object.freeze([]),
      archiveRoot: null,
      blockingReason: `unsupported_transition:${transition.kind}`,
      blockingReasonCarriers: Object.freeze([
        makeSdlcBlockingReason({
          code: "unsupported_transition",
          detail: transition.kind
        })
      ]),
      nextLawfulAction: "reprice_runtime_policy"
    });
  }

  const transitionEdgeAccountingRow =
    transition.edge === null ? null : sdlcExecutiveEdgeAccountingRowFor(transition.edge);
  const transitionWorkerDispatchAllowed =
    transitionEdgeAccountingRow?.workerDispatchAllowed ?? true;
  if (input.workerTransport === null && transitionWorkerDispatchAllowed) {
    return terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "blocked",
      start: input.start,
      transport: null,
      manifest: null,
      workerRun: null,
      workerReport: null,
      postflight: null,
      gapDossier: null,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length,
      emittedRuntimeEventKinds: Object.freeze([]),
      archiveRoot: null,
      blockingReason: "fp_worker_unattached",
      blockingReasonCarriers: Object.freeze([
        makeSdlcBlockingReason({ code: "fp_worker_unattached" })
      ]),
      nextLawfulAction: "rerun_start_with_worker_transport",
      currentEdge: transition.edge
    });
  }

  const transport =
    input.workerTransport === null ? null : admitWorkerTransport(input.workerTransport);
  const executionContract = input.start.executionContract;
  const dispatchState: { current: SdlcAbgOwnedFpDispatchState | null } = {
    current: null
  };
  const emitted: RuntimeEvent[] = [];
  const admitDispatchConsequence = (
    state: SdlcAbgOwnedFpDispatchState,
    nextVectorIndex: number | null = null
  ): SdlcInstalledOperatorTraversalConsequence => {
    const consequence = deriveInstalledTraversalConsequence({
      basis,
      start: input.start,
      state,
      replayEvents: effectiveReplayEvents,
      emittedEvents: emitted,
      engineTerminal: null,
      nextVectorIndex
    });
    writeTraversalConsequenceArchive({
      manifest: state.manifest,
      consequence
    });
    return consequence;
  };
  const publishDispatchState = (
    state: SdlcAbgOwnedFpDispatchState
  ): SdlcInstalledOperatorTraversalConsequence => {
    dispatchState.current = state;
    return admitDispatchConsequence(state);
  };
  const fpDispatch = Object.freeze({
    contract: fpDispatchPluginContract(),
    dispatch: async (pluginInput: EnginePluginInput) => {
      const selectedComposition =
        sdlcSelectedAbgFnCompositionIdentityFromEnginePluginInput(pluginInput);
      const contract = hookContractByEdgeName(pluginInput.edge);
      const projectedRetryContext = mergedRetryContext({
        projected: retryContextFromRetryAttemptRefs(
          pluginInput.retryAttemptRefs.filter(
            (ref) => ref.vectorIndex === pluginInput.vectorIndex
          )
        ),
        override: deriveSdlcWorkerRetryContextFromPostActionProjection({
          nextActionProjection: executionContract.nextActionProjection,
          vectorIndex: pluginInput.vectorIndex
        }),
        vectorIndex: pluginInput.vectorIndex
      });
      const retryContextWithRuntimeGaps =
        mergeSdlcWorkerRetryContextWithRuntimeGapRegister({
          projected: projectedRetryContext,
          workspaceRoot: input.workspaceRoot,
          vectorIndex: pluginInput.vectorIndex,
          edgeName: pluginInput.edge,
          targetAssetType: contract.targetAssetType
        });
      const manifest = deriveWorkerHandoffManifest({
        workspaceRoot: input.workspaceRoot,
        overlayRef: executionContract.overlayRef,
        overlayBindingRef: executionContract.overlayBindingRef,
        graphCatalogDigestRef: executionContract.overlayBinding.graphCatalogDigestRef,
        graphFunctionName: executionContract.targetGraphFunction,
        edgeName: pluginInput.edge,
        vectorIndex: pluginInput.vectorIndex,
        contract,
        fpTransformRequest: pluginInput.fpTransformRequest,
        traversalAttemptEnvelope: pluginInput.traversalAttemptEnvelope,
        conformedProject: executionContract.conformedProject,
        retryContext: mergedRetryContext({
          projected: retryContextWithRuntimeGaps,
          override: input.retryContextOverride,
          vectorIndex: pluginInput.vectorIndex
        })
      });
      const beforeMaterialization = snapshotProductMaterializationRoot(
        manifest.productMaterialization
      );
      const handoffFiles = writeHandoffFiles(manifest);
      const frontDoorTraversalAuditEvent = writeFrontDoorTraversalSelectionAudit({
        basis,
        manifest,
        summary: executionContract.traversalDecompositionSummary,
        selection: executionContract.traversalHopSelection
      });
      if (frontDoorTraversalAuditEvent !== null) {
        emitted.push(frontDoorTraversalAuditEvent);
      }
      const expectedAssessmentIds =
        pluginInput.expectedAssessmentIds.length === 0
          ? vectorEvaluatorNames({ basis, vectorIndex: pluginInput.vectorIndex })
          : pluginInput.expectedAssessmentIds;
      const fulfillmentFor = (input: {
        readonly workerRun: SdlcWorkerRunResult | null;
        readonly fulfillmentStatus: "fulfilled" | "partial" | "blocked" | "unfulfilled";
        readonly fulfillmentDetail: string;
        readonly blockingReasons: readonly string[];
        readonly evidenceRefs: readonly string[];
      }): Readonly<Record<string, unknown>> => {
        if (input.workerRun === null) {
          return deterministicFulfillmentArtifact({
            manifest,
            basis,
            expectedAssessmentIds,
            fulfillmentStatus: input.fulfillmentStatus,
            fulfillmentDetail: input.fulfillmentDetail,
            blockingReasons: input.blockingReasons,
            evidenceRefs: input.evidenceRefs
          });
        }
        if (transport === null) {
          throw new TypeError("worker fulfillment requires admitted worker transport");
        }
        return fulfillmentArtifact({
          manifest,
          transport,
          basis,
          expectedAssessmentIds,
          fulfillmentStatus: input.fulfillmentStatus,
          fulfillmentDetail: input.fulfillmentDetail,
          blockingReasons: input.blockingReasons,
          evidenceRefs: input.evidenceRefs
        });
      };
      const completeReportDispatch = async (input: {
        readonly workerRun: SdlcWorkerRunResult | null;
        readonly workerReport: SdlcWorkerResultReport;
        readonly hookWorkerContractRef: string;
        readonly passedFulfillmentDetail: string;
      }) => {
        const diagnosticState: SdlcAbgOwnedFpDispatchState = {
          status: "worker_invoked",
          manifest,
          selectedComposition,
          workerRun: input.workerRun,
          workerReport: input.workerReport,
          postflight: null,
          assuranceSatisfaction: null,
          gapDossier: null,
          hookOutcome: null,
          blockingReason: null,
          blockingReasonCarriers: Object.freeze([]),
          currentEdge: pluginInput.edge
        };
        const diagnostics = await runSdlcPostTransformDiagnosticFlow({
          state: diagnosticState,
          basis,
          edgeAccountingRow,
          eventSink: (event) => {
            emitted.push(event);
          },
          postflightRelativePath: "postflight.json",
          writeMaterializationManifest: true
        });
        const postflight = diagnostics.postflight;
        const assuranceGate = diagnostics.assuranceGate;

        const constructorResult = constructorResultFromWorkerOutput({
          manifest,
          report: input.workerReport,
          operationType: defaultOperationForTarget(contract.targetAssetType)
        });
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "constructor_result.json",
          payload: constructorResult
        });
        const hookOutcome = runSdlcHookTurn({
          contract,
          invocation: minimalSdlcHookInvocationForContract({
            contract,
            targetAssetId: constructorResult.outputIdentity.assetId,
            fpWorkerContractRef: input.hookWorkerContractRef
          }),
          constructorResult
        });
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "hook_outcome.json",
          payload: hookOutcome
        });
        if (hookOutcome.postflight?.status !== "passed") {
          const hookDiagnosticReasonCarriers = Object.freeze(
            hookOutcome.postflight === null || hookOutcome.postflight === undefined
              ? [
                  makeSdlcBlockingReason({
                    code: "hook_diagnostic_missing",
                    evidenceRefs: [
                      pathToFileURL(join(manifest.archiveRoot, "hook_outcome.json")).href
                    ]
                  })
                ]
                : hookOutcome.postflight.blockingReasons.map((reason) =>
                  makeSdlcBlockingReason({
                    code: "hook_diagnostic_failed",
                    detail: reason,
                      evidenceRefs: hookOutcome.postflight?.evidenceRefs ?? []
                    })
                )
          );
          const hookDiagnostics = Object.freeze({
            kind: "sdlc_operator_postflight_result" as const,
            status: "passed" as const,
            blockingReasons: Object.freeze([]),
            blockingReasonCarriers: hookDiagnosticReasonCarriers,
            evidenceRefs: Object.freeze([...(hookOutcome.postflight?.evidenceRefs ?? [])])
          });
          writeOperatorArchiveFile({
            archiveRoot: manifest.archiveRoot,
            relativePath: "hook_diagnostics.json",
            payload: hookDiagnostics
          });
        }
        const current: SdlcAbgOwnedFpDispatchState = {
          status: "worker_invoked",
          manifest,
          selectedComposition,
          workerRun: input.workerRun,
          workerReport: input.workerReport,
          postflight,
          assuranceSatisfaction: assuranceGate.satisfaction,
          gapDossier: null,
          hookOutcome,
          blockingReason: null,
          blockingReasonCarriers: Object.freeze([]),
          currentEdge: null
        };
        const consequence = shouldDeferDispatchConsequenceToFpEvaluator(current)
          ? null
          : publishDispatchState(current);
        if (consequence?.edgeClosureDecision.disposition === "block") {
          return constructFpDispatchOutcome({
            status: "blocked",
            resultRef: consequence.nextActionProjection.nextActionProjectionRef,
            attachedResultArtifact: null,
            evidenceRefs: uniqueSorted([
              ...postflight.evidenceRefs,
              consequence.nextActionProjection.nextActionProjectionRef
            ]),
            reason:
              consequence.edgeClosureDecision.reasonRefs.join(",") ||
              "post_action_blocked"
          });
        }
        if (consequence === null) {
          dispatchState.current = current;
        }
        return constructFpDispatchOutcome({
          status: "dispatched",
          resultRef: dispatchResultRef(manifest),
          attachedResultArtifact: fulfillmentFor({
            workerRun: input.workerRun,
            fulfillmentStatus: "fulfilled",
            fulfillmentDetail: input.passedFulfillmentDetail,
            blockingReasons: Object.freeze([]),
            evidenceRefs: postflight.evidenceRefs
          }),
          evidenceRefs: uniqueSorted([
            ...postflight.evidenceRefs,
            ...(consequence === null
              ? [pathToFileURL(input.workerReport.outputFile).href]
              : [consequence.nextActionProjection.nextActionProjectionRef])
          ])
        });
      };
      const edgeAccountingRow = sdlcExecutiveEdgeAccountingRowFor(pluginInput.edge);
      const workerDispatchAllowed = edgeAccountingRow?.workerDispatchAllowed ?? true;
      if (!workerDispatchAllowed) {
        const frameworkOwnedEvaluationArtifact =
          writeInstalledOperatorOwnedEvaluationArtifact({ manifest });
        if (frameworkOwnedEvaluationArtifact === null) {
          if (edgeAccountingRow === null) {
            throw new TypeError(`missing edge accounting row for ${pluginInput.edge}`);
          }
          writeInstalledOperatorNoDispatchArtifact({
            manifest,
            edgeAccountingRow
          });
        } else {
          writeOperatorArchiveFile({
            archiveRoot: manifest.archiveRoot,
            relativePath: "installed_operator_evaluation_artifact.json",
            payload: {
              kind: "sdlc_installed_operator_evaluation_artifact",
              writerInterface: "writeInstalledOperatorOwnedEvaluationArtifact",
              targetAssetType: manifest.targetAssetType,
              outputFile: frameworkOwnedEvaluationArtifact
            }
          });
        }
        let workerReport: SdlcWorkerResultReport | null = null;
        try {
          workerReport = noDispatchReport({
            manifest,
            report: buildPostTransformWorkerResultReport({
              manifest,
              before: beforeMaterialization
            })
          });
          writeOperatorArchiveFile({
            archiveRoot: manifest.archiveRoot,
            relativePath: "worker_result_report.json",
            payload: workerReport
          });
          writeOperatorArchiveFile({
            archiveRoot: manifest.archiveRoot,
            relativePath: "post_transform_observation.json",
            payload: {
              kind: "sdlc_post_transform_observation",
              sourceFunction: "installed_operator.deterministic_edge",
              generatedFunction:
                frameworkOwnedEvaluationArtifact === null
                  ? "writeInstalledOperatorNoDispatchArtifact"
                  : "writeInstalledOperatorOwnedEvaluationArtifact",
              previousReportAdmissionError: null,
              materializedFileCount: workerReport.materializedFiles.length,
              outputFile: workerReport.outputFile,
              digest: workerReport.digest
            }
          });
        } catch (error: unknown) {
          const rejectionPostflight = deterministicReportAdmissionPostflight({
            manifest,
            reason:
              error instanceof Error ? error.message : "worker_report_rejected"
          });
          writeOperatorArchiveFile({
            archiveRoot: manifest.archiveRoot,
            relativePath: "worker_report_admission_postflight.json",
            payload: rejectionPostflight
          });
          const gapDossier = constructPostflightGapDossier({
            manifest,
            postflight: rejectionPostflight
          });
          writePostflightGapDossier({ manifest, gapDossier });
          const current: SdlcAbgOwnedFpDispatchState = {
            status: "worker_report_rejected",
            manifest,
            selectedComposition,
            workerRun: null,
            workerReport: null,
            postflight: rejectionPostflight,
            assuranceSatisfaction: null,
            gapDossier,
            hookOutcome: null,
            blockingReason: rejectionPostflight.blockingReasons.join(","),
            blockingReasonCarriers: rejectionPostflight.blockingReasonCarriers,
            currentEdge: pluginInput.edge
          };
          const consequence = publishDispatchState(current);
          return constructFpDispatchOutcome({
            status: "blocked",
            resultRef: gapDossier.currentGapDossierRef,
            attachedResultArtifact: runtimeFailureArtifact({
              failureClass: "contract_failure",
              detail: rejectionPostflight.blockingReasons.join(",")
            }),
            evidenceRefs: uniqueSorted([
              ...rejectionPostflight.evidenceRefs,
              consequence.nextActionProjection.nextActionProjectionRef
            ]),
            reason: rejectionPostflight.blockingReasons.join(",")
          });
        }
        workerReport = workerResultReportWithFpStageRefs({
          manifest,
          report: workerReport
        });
        workerReport = noDispatchReport({ manifest, report: workerReport });
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "worker_result_report.json",
          payload: workerReport
        });
        return completeReportDispatch({
          workerRun: null,
          workerReport,
          hookWorkerContractRef: "worker-dispatch://installed-operator/no-dispatch",
          passedFulfillmentDetail: "installed operator deterministic edge passed"
        });
      }
      if (transport === null) {
        throw new TypeError("worker dispatch requires admitted worker transport");
      }
      const workerRun = await invokeWorkerThroughAbgProcessActor({
        transport,
        manifest,
        manifestPath: handoffFiles.manifestPath,
        promptPath: handoffFiles.promptPath,
        pluginInput,
        basis,
        eventSink: (event) => {
          emitted.push(event);
        }
      });
      if (workerRun.status !== 0) {
        const failurePostflight = constructWorkerProcessFailurePostflight({
          manifest,
          workerRun
        });
        const stopForRuntimeTriage = workerRuntimeTriageStop(failurePostflight);
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "worker_process_failure_postflight.json",
          payload: failurePostflight
        });
        const gapDossier = constructPostflightGapDossier({
          manifest,
          postflight: failurePostflight
        });
        writePostflightGapDossier({ manifest, gapDossier });
        const current: SdlcAbgOwnedFpDispatchState = {
          status: "worker_failed",
          manifest,
          selectedComposition,
          workerRun,
          workerReport: null,
          postflight: failurePostflight,
          assuranceSatisfaction: null,
          gapDossier,
          hookOutcome: null,
          blockingReason: failurePostflight.blockingReasons.join(","),
          blockingReasonCarriers: failurePostflight.blockingReasonCarriers,
          currentEdge: pluginInput.edge
        };
        const consequence = publishDispatchState(current);
        return constructFpDispatchOutcome({
          status: "blocked",
          resultRef: stopForRuntimeTriage
            ? consequence.nextActionProjection.nextActionProjectionRef
            : gapDossier.currentGapDossierRef,
          attachedResultArtifact: stopForRuntimeTriage
            ? null
            : runtimeFailureArtifact({
                failureClass: workerFailureRuntimeFailureClass(failurePostflight),
                detail: failurePostflight.blockingReasons.join(",")
              }),
          evidenceRefs: uniqueSorted([
            ...failurePostflight.evidenceRefs,
            consequence.nextActionProjection.nextActionProjectionRef
          ]),
          reason: failurePostflight.blockingReasons.join(",")
        });
      }
      const frameworkOwnedEvaluationArtifact =
        writeInstalledOperatorOwnedEvaluationArtifact({ manifest });
      if (frameworkOwnedEvaluationArtifact !== null) {
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "installed_operator_evaluation_artifact.json",
          payload: {
            kind: "sdlc_installed_operator_evaluation_artifact",
            writerInterface: "writeInstalledOperatorOwnedEvaluationArtifact",
            targetAssetType: manifest.targetAssetType,
            outputFile: frameworkOwnedEvaluationArtifact
          }
        });
      }
      let workerReport: SdlcWorkerResultReport | null = null;
      try {
        workerReport = buildPostTransformWorkerResultReport({
          manifest,
          before: beforeMaterialization
        });
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "worker_result_report.json",
          payload: workerReport
        });
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "post_transform_observation.json",
          payload: {
            kind: "sdlc_post_transform_observation",
            sourceFunction: "worker.F_P.transform",
            generatedFunction:
              frameworkOwnedEvaluationArtifact === null
                ? "buildPostTransformWorkerResultReport"
                : "installed_operator.writeInstalledOperatorOwnedEvaluationArtifact",
            previousReportAdmissionError: null,
            materializedFileCount: workerReport.materializedFiles.length,
            outputFile: workerReport.outputFile,
            digest: workerReport.digest
          }
        });
      } catch (error: unknown) {
        if (workerReport === null) {
          const rejectionPostflight = workerReportAdmissionPostflight({
            manifest,
            workerRun,
            reason:
              error instanceof Error ? error.message : "worker_report_rejected"
          });
          writeOperatorArchiveFile({
            archiveRoot: manifest.archiveRoot,
            relativePath: "worker_report_admission_postflight.json",
            payload: rejectionPostflight
          });
          const gapDossier = constructPostflightGapDossier({
            manifest,
            postflight: rejectionPostflight
          });
          writePostflightGapDossier({ manifest, gapDossier });
          const current: SdlcAbgOwnedFpDispatchState = {
            status: "worker_report_rejected",
            manifest,
            selectedComposition,
            workerRun,
            workerReport: null,
            postflight: rejectionPostflight,
            assuranceSatisfaction: null,
            gapDossier,
            hookOutcome: null,
            blockingReason: rejectionPostflight.blockingReasons.join(","),
            blockingReasonCarriers: rejectionPostflight.blockingReasonCarriers,
            currentEdge: pluginInput.edge
          };
          const consequence = publishDispatchState(current);
          return constructFpDispatchOutcome({
            status: "blocked",
            resultRef: gapDossier.currentGapDossierRef,
            attachedResultArtifact: runtimeFailureArtifact({
              failureClass: "contract_failure",
              detail: rejectionPostflight.blockingReasons.join(",")
            }),
            evidenceRefs: uniqueSorted([
              ...rejectionPostflight.evidenceRefs,
              consequence.nextActionProjection.nextActionProjectionRef
            ]),
            reason: rejectionPostflight.blockingReasons.join(",")
          });
        }
      }
      if (workerReport === null) {
        throw new TypeError("worker report admission did not produce a report");
      }
      workerReport = workerResultReportWithFpStageRefs({
        manifest,
        report: workerReport
      });
      writeOperatorArchiveFile({
        archiveRoot: manifest.archiveRoot,
        relativePath: "worker_result_report.json",
        payload: workerReport
      });
      const fpTransformResult = writeWorkerFpTransformResult({
        manifest,
        report: workerReport
      });
      if (fpTransformResult !== null && manifest.fpTransformRequest !== null) {
        emitted.push(
          ...runtimeEventsForFpTransformResult({
            basis,
            request: manifest.fpTransformRequest,
            result: fpTransformResult
          })
        );
      }
      return completeReportDispatch({
        workerRun,
        workerReport,
        hookWorkerContractRef: transport.raw,
        passedFulfillmentDetail: "installed operator postflight passed"
      });
    }
  });
  const designDepthFpEvaluatorAdmissionEvidenceByArchiveRoot = new Map<
    string,
    readonly string[]
  >();
  const fpEvaluator = Object.freeze({
    contract: fpEvaluatorPluginContract(),
    evaluate: async (pluginInput: EnginePluginInput): Promise<FpEvaluationOutcome> => {
      if (dispatchState.current === null) {
        return constructFpEvaluationOutcome({
          status: "blocked",
          reason: "missing installed operator transform state for evaluate.C"
        });
      }
      const fpEvaluatorAdmissionEvidenceRefs =
        designDepthFpEvaluatorAdmissionEvidenceByArchiveRoot.get(
          dispatchState.current.manifest.archiveRoot
        ) ?? Object.freeze([]);
      dispatchState.current = await refreshDesignDepthStateFromFpEvaluatorRegister({
        state: dispatchState.current,
        basis,
        edgeAccountingRow:
          dispatchState.current.currentEdge === null
            ? null
            : sdlcExecutiveEdgeAccountingRowFor(dispatchState.current.currentEdge),
        eventSink: (event) => {
          emitted.push(event);
        },
        fpEvaluatorAdmissionEvidenceRefs
      });
      return fpEvaluationOutcomeForDispatchState({
        pluginInput,
        state: dispatchState.current
      });
    }
  });
  const consequenceProjection = Object.freeze({
    contract: consequenceProjectionPluginContract(),
    project: (pluginInput: EnginePluginInput): ConsequenceProjectionOutcome => {
      if (dispatchState.current === null) {
        return constructConsequenceProjectionOutcome({
          status: "blocked",
          reason: "missing installed operator transform state for consequence.C"
        });
      }
      const selectedComposition =
        sdlcSelectedAbgFnCompositionIdentityFromEnginePluginInput(pluginInput);
      if (
        selectedComposition.compositionRef !==
          dispatchState.current.selectedComposition.compositionRef ||
        selectedComposition.compositionDigest !==
          dispatchState.current.selectedComposition.compositionDigest ||
        selectedComposition.compositionSelectionRef !==
          dispatchState.current.selectedComposition.compositionSelectionRef
      ) {
        return constructConsequenceProjectionOutcome({
          status: "blocked",
          reason: "selected composition drift for consequence.C"
        });
      }
      const consequence = deriveInstalledTraversalConsequence({
        basis,
        start: input.start,
        state: dispatchState.current,
        replayEvents: effectiveReplayEvents,
        admittedAssetEvents: input.eventGraphEvents ?? input.replayEvents,
        emittedEvents: emitted,
        engineTerminal: null,
        nextVectorIndex:
          pluginInput.vectorIndex + 1 < basis.graph.vectors.length
            ? pluginInput.vectorIndex + 1
            : null
      });
      writeTraversalConsequenceArchive({
        manifest: dispatchState.current.manifest,
        consequence
      });
      return constructConsequenceProjectionOutcome({
        status: "projected",
        consequenceRef: consequence.consequenceProjection.consequenceRef,
        domainReadModelRefs:
          consequence.consequenceProjection.domainReadModelRefs,
        evidenceRefs: uniqueSorted([
          pluginInput.sourceProjectionRef,
          consequence.admittedStateRef.compositionRef,
          consequence.consequenceProjection.consequenceRef,
          ...consequence.consequenceProjection.domainReadModelRefs
        ])
      });
    }
  });
  const designDepthFpEvaluatorRule = Object.freeze({
    contract: designDepthFpEvaluatorRuleContract(),
    ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
    ruleRole: "semantic_judgment" as const,
    required: true,
    outputCarrierRefs: Object.freeze(["SdlcDesignDepthRegister"]),
    evaluate: async (pluginInput: EnginePluginInput): Promise<EvaluationRuleOutcome> => {
      if (dispatchState.current === null) {
        return constructEvaluationRuleOutcome({
          status: "accepted",
          ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
          ruleRole: "semantic_judgment",
          computeMeans: "F_P",
          evidenceRefs: Object.freeze([pluginInput.sourceProjectionRef]),
          findingRefs: Object.freeze([
            "finding://odd-sdlc/evaluate/design-depth-register/not-applicable/no-transform-state"
          ]),
          selectedCompositionRef: pluginInput.selectedCompositionRef,
          selectedCompositionDigest: pluginInput.selectedCompositionDigest,
          selectedCompositionSelectionRef:
            pluginInput.selectedCompositionSelectionRef,
          selectedRegimeBindingRef: pluginInput.selectedRegimeBindingRef,
          compositionContributionRef:
            pluginInput.selectedRegimeBindingRef ??
            pluginInput.selectedCompositionRef,
          reason: "design-depth evaluator rule has no transform state for this vector"
        });
      }
      if (
        dispatchState.current.manifest.targetAssetType !==
        "implementation_design_surface"
      ) {
        return constructEvaluationRuleOutcome({
          status: "accepted",
          ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
          ruleRole: "semantic_judgment",
          computeMeans: "F_P",
          evidenceRefs: Object.freeze([pluginInput.sourceProjectionRef]),
          findingRefs: Object.freeze([
            `finding://odd-sdlc/${manifestRefSegment(dispatchState.current.manifest)}/evaluate/design-depth-register/not-applicable`
          ]),
          selectedCompositionRef: pluginInput.selectedCompositionRef,
          selectedCompositionDigest: pluginInput.selectedCompositionDigest,
          selectedCompositionSelectionRef:
            pluginInput.selectedCompositionSelectionRef,
          selectedRegimeBindingRef: pluginInput.selectedRegimeBindingRef,
          compositionContributionRef:
            pluginInput.selectedRegimeBindingRef ??
            pluginInput.selectedCompositionRef,
          reason: "design-depth evaluator rule not applicable to non-design edge"
        });
      }
      if (transport === null) {
        return constructEvaluationRuleOutcome({
          status: "blocked",
          ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
          ruleRole: "semantic_judgment",
          computeMeans: "F_P",
          evidenceRefs: Object.freeze([pluginInput.sourceProjectionRef]),
          selectedCompositionRef: pluginInput.selectedCompositionRef,
          selectedCompositionDigest: pluginInput.selectedCompositionDigest,
          selectedCompositionSelectionRef:
            pluginInput.selectedCompositionSelectionRef,
          selectedRegimeBindingRef: pluginInput.selectedRegimeBindingRef,
          compositionContributionRef:
            pluginInput.selectedRegimeBindingRef ??
            pluginInput.selectedCompositionRef,
          reason: "fp_worker_unattached"
        });
      }
      const outcome = await materializeDesignDepthRegisterWithFpEvaluator({
        transport,
        manifest: dispatchState.current.manifest,
        pluginInput,
        basis,
        eventSink: (event) => {
          emitted.push(event);
        }
      });
      if (outcome.status === "accepted") {
        const ruleOutcomeRef = writeDesignDepthFpEvaluatorRuleOutcomeProof({
          manifest: dispatchState.current.manifest,
          outcome
        });
        designDepthFpEvaluatorAdmissionEvidenceByArchiveRoot.set(
          dispatchState.current.manifest.archiveRoot,
          Object.freeze([ruleOutcomeRef])
        );
      }
      return outcome;
    }
  });
  const reviewGradeEdgeFulfillmentRule = Object.freeze({
    contract: reviewGradeEdgeFulfillmentRuleContract(),
    ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
    ruleRole: "semantic_judgment" as const,
    required: true,
    outputCarrierRefs: Object.freeze(["SdlcReviewGradeEdgeFulfillmentAssessment"]),
    evaluate: async (pluginInput: EnginePluginInput): Promise<EvaluationRuleOutcome> => {
      if (dispatchState.current === null) {
        return constructEvaluationRuleOutcome({
          status: "accepted",
          ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
          ruleRole: "semantic_judgment",
          computeMeans: "F_P",
          evidenceRefs: Object.freeze([pluginInput.sourceProjectionRef]),
          findingRefs: Object.freeze([
            "finding://odd-sdlc/evaluate/review-grade-edge-fulfillment/not-applicable/no-transform-state"
          ]),
          selectedCompositionRef: pluginInput.selectedCompositionRef,
          selectedCompositionDigest: pluginInput.selectedCompositionDigest,
          selectedCompositionSelectionRef:
            pluginInput.selectedCompositionSelectionRef,
          selectedRegimeBindingRef: pluginInput.selectedRegimeBindingRef,
          compositionContributionRef:
            pluginInput.selectedRegimeBindingRef ??
            pluginInput.selectedCompositionRef,
          reason: "review-grade edge fulfillment rule has no transform state for this vector"
        });
      }
      if (!reviewGradeEdgeFulfillmentAssessmentRequired(dispatchState.current.manifest)) {
        return constructEvaluationRuleOutcome({
          status: "accepted",
          ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
          ruleRole: "semantic_judgment",
          computeMeans: "F_P",
          evidenceRefs: Object.freeze([pluginInput.sourceProjectionRef]),
          findingRefs: Object.freeze([
            `finding://odd-sdlc/${manifestRefSegment(dispatchState.current.manifest)}/evaluate/review-grade-edge-fulfillment/not-applicable`
          ]),
          selectedCompositionRef: pluginInput.selectedCompositionRef,
          selectedCompositionDigest: pluginInput.selectedCompositionDigest,
          selectedCompositionSelectionRef:
            pluginInput.selectedCompositionSelectionRef,
          selectedRegimeBindingRef: pluginInput.selectedRegimeBindingRef,
          compositionContributionRef:
            pluginInput.selectedRegimeBindingRef ??
            pluginInput.selectedCompositionRef,
          reason: "review-grade edge fulfillment rule not required for this vector"
        });
      }
      if (transport === null) {
        return constructEvaluationRuleOutcome({
          status: "blocked",
          ruleRef: REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF,
          ruleRole: "semantic_judgment",
          computeMeans: "F_P",
          evidenceRefs: Object.freeze([pluginInput.sourceProjectionRef]),
          selectedCompositionRef: pluginInput.selectedCompositionRef,
          selectedCompositionDigest: pluginInput.selectedCompositionDigest,
          selectedCompositionSelectionRef:
            pluginInput.selectedCompositionSelectionRef,
          selectedRegimeBindingRef: pluginInput.selectedRegimeBindingRef,
          compositionContributionRef:
            pluginInput.selectedRegimeBindingRef ??
            pluginInput.selectedCompositionRef,
          reason: "fp_worker_unattached"
        });
      }
      const outcome = await materializeReviewGradeEdgeFulfillmentWithFpEvaluator({
        transport,
        manifest: dispatchState.current.manifest,
        pluginInput,
        eventSink: (event) => {
          emitted.push(event);
        }
      });
      if (
        dispatchState.current !== null &&
        dispatchState.current.workerReport !== null
      ) {
        const assessmentPath = join(
          dispatchState.current.manifest.archiveRoot,
          REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE
        );
        const admission = admitReviewGradeEdgeFulfillmentAssessmentFromArtifact({
          manifest: dispatchState.current.manifest,
          outputFile: assessmentPath
        });
        if (admission.status === "admitted" && admission.assessment !== null) {
          const workerReport = workerReportWithReviewGradeAssessment({
            report: dispatchState.current.workerReport,
            assessment: admission.assessment
          });
          dispatchState.current = Object.freeze({
            ...dispatchState.current,
            workerReport
          });
          writeOperatorArchiveFile({
            archiveRoot: dispatchState.current.manifest.archiveRoot,
            relativePath: "worker_result_report.json",
            payload: workerReport
          });
        }
      }
      return outcome;
    }
  });
  const engineResult = await runEngineIterateAsync({
    basis,
    runtimeEvents: effectiveReplayEvents,
    eventSink: (event) => {
      emitted.push(event);
    },
    plugins: {
      fpDispatch,
      fpEvaluator,
      consequenceProjection,
      evaluationRules: Object.freeze([
        designDepthFpEvaluatorRule,
        reviewGradeEdgeFulfillmentRule
      ]),
      requiredEvaluationRuleRefs: Object.freeze([
        DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
        REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF
      ])
    },
    maxAttachedFpAttempts: 3
  });
  const completedDispatchState = dispatchState.current;
  if (completedDispatchState === null) {
    const eventsToAppend = Object.freeze([
      ...replayCursor.cursorEvents,
      ...emitted
    ]);
    await appendOddSdlcRuntimeEvents({
      workspaceRoot: input.workspaceRoot,
      events: eventsToAppend
    });
    return terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "blocked",
      start: input.start,
      transport,
      manifest: null,
      workerRun: null,
      workerReport: null,
      postflight: null,
      gapDossier: null,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length + eventsToAppend.length,
      emittedRuntimeEventKinds: Object.freeze(
        eventsToAppend.map((event) => event.kind)
      ),
      archiveRoot: null,
      blockingReason: "unsupported_transition:fp_dispatch_without_plugin_call",
      blockingReasonCarriers: Object.freeze([
        makeSdlcBlockingReason({
          code: "unsupported_transition",
          detail: "fp_dispatch_without_plugin_call"
        })
      ]),
      nextLawfulAction: "reprice_runtime_policy",
      currentEdge: decision.edge
    });
  }
  emitted.push(
    ...repairReentryGraphSpanRuntimeEvents({
      basis,
      outcome: completedDispatchState,
      replayEvents: effectiveReplayEvents,
      emittedEvents: emitted
    })
  );
  const terminal =
    engineResult.transition.kind === "terminal" ? engineResult.transition : null;
  const nextVector =
    engineResult.projection.nextVectorIndex === null
      ? null
      : basis.graph.vectors[engineResult.projection.nextVectorIndex]?.name ?? null;
  const traversalConsequence = deriveInstalledTraversalConsequence({
    basis,
    start: input.start,
    state: completedDispatchState,
    replayEvents: effectiveReplayEvents,
    admittedAssetEvents: input.eventGraphEvents ?? input.replayEvents,
    emittedEvents: emitted,
    engineTerminal: terminal,
    nextVectorIndex: engineResult.projection.nextVectorIndex
  });
  emitted.push(
    ...postActionReentryGraphSpanRuntimeEvents({
      basis,
      consequence: traversalConsequence,
      currentVectorIndex: completedDispatchState.manifest.vectorIndex,
      replayEvents: effectiveReplayEvents,
      emittedEvents: emitted
    })
  );
  const eventsToAppend = Object.freeze([
    ...replayCursor.cursorEvents,
    ...emitted
  ]);
  await appendOddSdlcRuntimeEvents({
    workspaceRoot: input.workspaceRoot,
    events: eventsToAppend
  });
  writeTraversalConsequenceArchive({
    manifest: completedDispatchState.manifest,
    consequence: traversalConsequence
  });
  const closureDisposition = traversalConsequence.edgeClosureDecision.disposition;
  const closedWithNextTraversal =
    closureDisposition === "close" &&
    traversalConsequence.nextActionProjection.choosesNextTraversal;
  const closedWithoutNextTraversal =
    closureDisposition === "close" &&
    !traversalConsequence.nextActionProjection.choosesNextTraversal &&
    traversalConsequence.nextActionProjection.selectedActionRef === null &&
    traversalConsequence.nextActionProjection.nextGraphFunctionRef === null &&
    traversalConsequence.nextActionProjection.nextGraphVectorRef === null;
  const terminalReason =
    typeof terminal?.reason === "string" ? terminal.reason : null;
  const evaluationSetBlocked =
    terminal?.terminalKind === "gap_stop" &&
    terminalReason !== null &&
    terminalReason.includes("evaluation_set_incomplete");
  const status =
    completedDispatchState.status === "worker_invoked" && evaluationSetBlocked
      ? "blocked"
      : completedDispatchState.status === "worker_invoked" &&
    closureDisposition === "close" &&
    (terminal?.terminalKind === "converged" ||
      (terminal?.terminalKind === "gap_stop" && closedWithoutNextTraversal))
      ? "converged"
      : completedDispatchState.status === "worker_invoked" &&
          terminal?.terminalKind === "gap_stop" &&
          !closedWithNextTraversal
        ? "blocked"
        : completedDispatchState.status;
  const blockingReason =
    status === "blocked" && terminal?.reason !== null && terminal?.reason !== undefined
      ? terminal.reason
      : completedDispatchState.blockingReason;
  const nextLawfulAction = nextLawfulActionFromConsequence(traversalConsequence);
  const outcome = terminalOutcome({
    workspaceRoot: input.workspaceRoot,
    status,
    start: input.start,
    transport,
    manifest: completedDispatchState.manifest,
    workerRun: completedDispatchState.workerRun,
    workerReport: completedDispatchState.workerReport,
    postflight: completedDispatchState.postflight,
    assuranceSatisfaction: completedDispatchState.assuranceSatisfaction,
    gapDossier: completedDispatchState.gapDossier,
    hookOutcome: completedDispatchState.hookOutcome,
    replayEventCountBefore: input.replayEvents.length,
    replayEventCountAfter: input.replayEvents.length + eventsToAppend.length,
    emittedRuntimeEventKinds: Object.freeze(
      eventsToAppend.map((event) => event.kind)
    ),
    archiveRoot: completedDispatchState.manifest.archiveRoot,
    blockingReason,
    blockingReasonCarriers: completedDispatchState.blockingReasonCarriers,
    nextLawfulAction,
    traversalConsequence,
    currentEdge:
      status === "converged"
        ? null
        : completedDispatchState.status === "worker_invoked"
        ? nextVector ?? traversalConsequence.nextActionProjection.nextGraphVectorRef
        : completedDispatchState.currentEdge
  });
  writeOperatorArchiveFile({
    archiveRoot: completedDispatchState.manifest.archiveRoot,
    relativePath: "runtime_events.json",
    payload: compactRuntimeEventArchivePayload(eventsToAppend)
  });
  writeRunArchive({ manifest: completedDispatchState.manifest, outcome });
  if (completedDispatchState.status === "worker_invoked") {
    writeOperatorArchiveFile({
      archiveRoot: completedDispatchState.manifest.archiveRoot,
      relativePath: "operator_summary.json",
      payload: outcome.summary
    });
    writeOperatorArchiveFile({
      archiveRoot: completedDispatchState.manifest.archiveRoot,
      relativePath: "run_compact.json",
      payload: {
        status: outcome.status,
        graphFunctionName: outcome.summary.graphFunctionName,
        nextEdge: outcome.summary.currentEdge,
        eventKinds: outcome.emittedRuntimeEventKinds,
        replayEventCountBefore: outcome.replayEventCountBefore,
        replayEventCountAfter: outcome.replayEventCountAfter,
        assuranceStatus: outcome.assuranceSatisfaction?.status ?? null,
        outputFile: outcome.workerReport?.outputFile ?? null,
        materializedFileCount: outcome.workerReport?.materializedFiles.length ?? 0
      }
    });
    writeOperatorArchiveFile({
      archiveRoot: completedDispatchState.manifest.archiveRoot,
      relativePath: "run_compact.txt",
      payload: stableOperatorJson(outcome.summary)
    });
  }
  return outcome;
}

export async function executeInstalledOperatorStartWithReentry(input: {
  readonly workspaceRoot: string;
  readonly sourceWorkspaceRoot?: string;
  readonly start: SdlcPublicStartOutcome;
  readonly workerTransport: string | null;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly eventGraphEvents?: readonly RuntimeEvent[];
  readonly requestedUntil: string;
  readonly requireInstalledTopology?: boolean;
  readonly refreshReplayState: (outcome: SdlcInstalledOperatorStartOutcome) => Promise<{
    readonly start: SdlcPublicStartOutcome;
    readonly replayEvents: readonly RuntimeEvent[];
    readonly eventGraphEvents?: readonly RuntimeEvent[];
  }>;
}): Promise<SdlcInstalledOperatorStartOutcome> {
  const attempts: SdlcInstalledOperatorStartLoopAttempt[] = [];
  let latest: SdlcInstalledOperatorStartOutcome | null = null;
  let start = input.start;
  let replayEvents = input.replayEvents;
  let eventGraphEvents = input.eventGraphEvents ?? input.replayEvents;
  let retryGuardExhausted = false;
  let exhaustedDisposition: SdlcInstalledReentryDisposition | null = null;
  let retryContextOverride: SdlcWorkerRetryContext | undefined;
  const reentryDispositionCounts: Record<SdlcInstalledReentryDisposition, number> = {
    retry: 0,
    yield: 0,
    other: 0
  };
  const maxLoopAttempts =
    input.requestedUntil === "converged"
      ? MAX_INSTALLED_CONVERGENCE_ATTEMPTS
      : MAX_INSTALLED_YIELD_REENTRY_ATTEMPTS;
  for (
    let attemptIndex = 0;
    attemptIndex < maxLoopAttempts;
    attemptIndex += 1
  ) {
    latest = await executeInstalledOperatorStart({
      workspaceRoot: input.workspaceRoot,
      ...(input.sourceWorkspaceRoot === undefined
        ? {}
        : { sourceWorkspaceRoot: input.sourceWorkspaceRoot }),
      start,
      workerTransport: input.workerTransport,
      replayEvents,
      eventGraphEvents,
      ...(retryContextOverride === undefined ? {} : { retryContextOverride }),
      ...(input.requireInstalledTopology === undefined
        ? {}
        : { requireInstalledTopology: input.requireInstalledTopology })
    });
    attempts.push(
      installedStartLoopAttemptFor({
        outcome: latest,
        attemptIndex
      })
    );
    if (
      input.requestedUntil === "first_traversal" &&
      latest.traversalConsequence !== null
    ) {
      break;
    }
    if (
      !installedStartShouldContinueForRequestedUntil({
        requestedUntil: input.requestedUntil,
        outcome: latest
      })
    ) {
      break;
    }
    const shouldContinueEvaluateNext =
      installedStartHasEvaluateNextTraversalTruth(latest);
    const closureDisposition =
      latest.traversalConsequence?.edgeClosureDecision.disposition ?? null;
    const countsAgainstReentryGuard =
      closureDisposition !== null && closureDisposition !== "close";
    if (countsAgainstReentryGuard) {
      const reentryDisposition =
        installedReentryDispositionForOutcome(latest) ?? "other";
      reentryDispositionCounts[reentryDisposition] += 1;
      if (
        reentryDispositionCounts[reentryDisposition] >=
        installedReentryAttemptLimit(reentryDisposition)
      ) {
        retryGuardExhausted = true;
        exhaustedDisposition = reentryDisposition;
        break;
      }
    }
    if (attemptIndex + 1 >= maxLoopAttempts) {
      retryGuardExhausted = true;
      exhaustedDisposition = "other";
      break;
    }
    retryContextOverride =
      countsAgainstReentryGuard && shouldContinueEvaluateNext
        ? deriveSdlcWorkerRetryContextFromTraversalConsequence({
            outcome: latest,
            attemptIndex: attemptIndex + 1
          }).retryContext ?? undefined
        : undefined;
    const refreshed = await input.refreshReplayState(latest);
    start = refreshed.start;
    replayEvents = refreshed.replayEvents;
    eventGraphEvents = refreshed.eventGraphEvents ?? refreshed.replayEvents;
  }
  if (latest === null) {
    return executeInstalledOperatorStart({
      workspaceRoot: input.workspaceRoot,
      ...(input.sourceWorkspaceRoot === undefined
        ? {}
        : { sourceWorkspaceRoot: input.sourceWorkspaceRoot }),
      start,
      workerTransport: input.workerTransport,
      replayEvents,
      eventGraphEvents,
      ...(input.requireInstalledTopology === undefined
        ? {}
        : { requireInstalledTopology: input.requireInstalledTopology })
    });
  }
  return installedStartWithLoop({
    requestedUntil: input.requestedUntil,
    outcome: latest,
    attempts,
    maxAttempts: maxLoopAttempts,
    retryGuardExhausted,
    exhaustedDisposition
  });
}
