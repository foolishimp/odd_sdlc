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
  constructGraphSpanAssessedEvent,
  constructGraphSpanEvaluationScheduledEvent,
  constructGraphSpanFoldbackEvaluatedEvent,
  constructFpDispatchOutcome,
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
  type ExecutionBasis,
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
  FG_CONFORM_PROJECT,
  FG_CONFORM_PROJECT_AUTHORITY,
  FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
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
import { deriveSdlcOperatorAssuranceGate } from "./assurance_gate.js";
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
  SdlcWorkerObligationAssessment,
  SdlcWorkerHandoffManifest,
  SdlcWorkerProcessStartedContext,
  SdlcWorkerProcessSummary,
  SdlcWorkerRetryContext,
  SdlcWorkerResultReport,
  SdlcWorkerRunResult,
  SdlcDecompositionSummary,
  SdlcTraversalHopSelection,
  SdlcTraversalOutcomeClass,
  SdlcWorkerTransportContract
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
  evaluateWorkerResultPostflight,
  readPostflightGapDossierRef,
  operatorRunId,
  snapshotProductMaterializationRoot,
  stableOperatorJson,
  workerResultReportWithFpStageRefs,
  writeInstalledOperatorOwnedEvaluationArtifact,
  writeHandoffFiles,
  writeFpEvaluateResult,
  writeOperatorArchiveFile,
  writePostflightGapDossier,
  writeWorkerFpTransformResult,
  writeProductMaterializationManifest
} from "./handoff.js";
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
import { admitDesignDepthRegisterFromArtifact } from "./design_depth_register.js";
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
      ? Object.freeze([])
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
  const latest = dossiers[dossiers.length - 1];
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
  let latest: SdlcPostflightGapDossier | null = null;
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
      dossier.targetAssetType === input.targetAssetType &&
      dossier.retryEligible
    ) {
      latest = dossier;
    }
  }
  return latest;
}

export function mergeSdlcWorkerRetryContextWithRuntimeGapRegister(input: {
  readonly projected: SdlcWorkerRetryContext;
  readonly workspaceRoot: string;
  readonly vectorIndex: number;
  readonly edgeName: string;
  readonly targetAssetType: string;
}): SdlcWorkerRetryContext {
  const latestGapDossier = latestRuntimeGapDossierForRetryContext(input);
  if (latestGapDossier === null) {
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

function replayEventsWithGraphContinuationCursor(input: {
  readonly basis: ExecutionBasis;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly nextGraphVectorRef: string | null;
}): GraphContinuationReplayCursor {
  if (input.nextGraphVectorRef === null) {
    return Object.freeze({
      replayEvents: input.replayEvents,
      cursorEvents: Object.freeze([])
    });
  }
  const targetIndex = vectorIndexByEdgeName({
    basis: input.basis,
    edgeName: input.nextGraphVectorRef
  });
  if (targetIndex === null || targetIndex <= 0) {
    return Object.freeze({
      replayEvents: input.replayEvents,
      cursorEvents: Object.freeze([])
    });
  }
  const closedIndexes = new Set<number>();
  try {
    for (const vectorIndex of deriveRuntimeAggregateProjection(
      input.basis,
      input.replayEvents
    ).closedVectorIndexes) {
      closedIndexes.add(vectorIndex);
    }
  } catch {
    for (const event of input.replayEvents) {
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
        ? input.replayEvents
        : Object.freeze([...input.replayEvents, ...cursorEvents]),
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
    outputCarrier: "FpDispatchOutcome"
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
  const explicit = manifestCapabilityValue(manifest, "sdlc_outcome_class");
  if (
    explicit === "framework_smoke" ||
    explicit === "tutorial_example" ||
    explicit === "domain_product"
  ) {
    return explicit;
  }
  return truthyCapabilityValue(manifestCapabilityValue(manifest, "trivial_product"))
    ? "framework_smoke"
    : "domain_product";
}

function canonicalSummaryForManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly carriers: ReturnType<typeof deriveSdlcStagedConstructionAuditCarriers>;
}): SdlcDecompositionSummary | null {
  const summaries = input.carriers
    .filter(
      (carrier): carrier is {
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
      ? carrier.relativePath.includes("test")
      : carrier.relativePath.includes("implementation")
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

function writeTraversalSelectionAudit(input: {
  readonly basis: ExecutionBasis;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly postflight: SdlcPostflightResult;
  readonly edgeAccountingRow: SdlcExecutiveEdgeAccountingRow | null;
}): RuntimeEvent | null {
  const auditCarriers = deriveSdlcStagedConstructionAuditCarriers(input.manifest);
  const writtenRefs: string[] = [];
  for (const carrier of auditCarriers) {
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      relativePath: carrier.relativePath,
      payload: carrier.payload
    });
    writtenRefs.push(
      pathToFileURL(join(input.manifest.archiveRoot, carrier.relativePath)).href
    );
  }
  const canonicalSummary = canonicalSummaryForManifest({
    manifest: input.manifest,
    carriers: auditCarriers
  });
  if (canonicalSummary !== null) {
    writeOperatorArchiveFile({
      archiveRoot: input.manifest.archiveRoot,
      relativePath: "sdlc_decomposition_summary.json",
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
    payload: projection
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

function graphFunctionOutputAssetTypes(input: {
  readonly module: Module;
  readonly graphFunctionName: string;
}): readonly string[] {
  const graphFunction = input.module.graphFunctions.find(
    (candidate) => candidate.name === input.graphFunctionName
  );
  return graphFunction === undefined
    ? Object.freeze([])
    : uniqueSorted(graphFunction.outputs.map((output) => output.name));
}

function admittedAssetTypesForState(input: {
  readonly module: Module;
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
          input.state.manifest.targetAssetType,
          ...graphFunctionOutputAssetTypes({
            module: input.module,
            graphFunctionName: input.state.manifest.graphFunctionName
          })
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
        const carriesRequirementTransformationSet =
          assessment.obligationId.startsWith("requirement:") &&
          !input.state.manifest.productMaterialization.required &&
          (authorityRequirementInduction ||
            sdlcAssessmentCarriesRequirementForDownstreamClosure(assessment) ||
            (input.state.manifest.targetAssetType === "requirement_surface" &&
              assessment.blockingReasons.some((reason) =>
                reason.startsWith("requirement_recorded_for_future_closure:")
              )));
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

function edgeAssuranceEvidenceCandidatesFor(input: {
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
          sourceKind: "worker_assessment" as const,
          obligationRefs: Object.freeze([assessment.obligationId]),
          supportsBehavioralFulfillment: true
        })
      )
    );
  const executionEvidence = input.state.workerReport?.executionEvidence ?? null;
  const executionCandidates =
    executionEvidence !== null &&
    executionEvidence.status === "succeeded" &&
    (executionEvidence.testsObserved ?? 0) > 0 &&
    (executionEvidence.failedCount ?? 0) === 0
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

function declaredExecutionContract(input: string): boolean {
  const contract = input.trim().toLowerCase();
  return (
    contract.length > 0 &&
    contract !== "undeclared" &&
    contract !== "none" &&
    contract !== "n/a" &&
    contract !== "not_applicable"
  );
}

function stateRequiresExecutionEvidence(
  state: SdlcAbgOwnedFpDispatchState
): boolean {
  return (
    state.manifest.targetAssetType === "test_execution_result_surface" ||
    ((state.manifest.edgeName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET ||
      state.manifest.edgeName === FG_DERIVE_LITE_COMPONENT_CODE_SURFACE) &&
      state.manifest.targetAssetType === "component_code_surface" &&
      state.manifest.productMaterialization.required &&
      declaredExecutionContract(
        state.manifest.productMaterialization.testExecutionContract
      ))
  );
}

function requiredEvidenceSourceKindsForState(
  state: SdlcAbgOwnedFpDispatchState
): readonly SdlcEdgeEvidenceSourceKind[] {
  return stateRequiresExecutionEvidence(state)
    ? Object.freeze(["execution_result"] as const)
    : Object.freeze([]);
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
    const admission = admitDesignDepthRegisterFromArtifact({
      targetAssetType: input.state.manifest.targetAssetType,
      outputFile: report.outputFile,
      archiveRoot: input.state.manifest.archiveRoot
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

function deriveInstalledTraversalConsequence(input: {
  readonly basis: ExecutionBasis;
  readonly start: SdlcPublicStartOutcome;
  readonly state: SdlcAbgOwnedFpDispatchState;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly admittedAssetEvents?: readonly RuntimeEvent[];
  readonly emittedEvents: readonly RuntimeEvent[];
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
    module,
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
  const retryReasonRefs = blockingReasonRefsForReentry({
    state: input.state,
    lawfulReentryPoint: "same_edge_retry"
  });
  const repairReasonRefs = blockingReasonRefsForReentry({
    state: input.state,
    lawfulReentryPoint: "repair_worker_output"
  });
  const repriceReasonRefs = blockingReasonRefsForReentry({
    state: input.state,
    lawfulReentryPoint: "reprice_requirement_or_design"
  });
  const ledger = constructSdlcEdgeFulfillmentLedger({
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
  const yieldResumeBasis = deriveSdlcProductLineageYieldResumeBasis({
    runRef,
    edgeRef: ledger.edgeRef,
    blockingReasonCarriers: input.state.blockingReasonCarriers,
    productEvidenceRefs: worksiteEvidence.productEvidenceRefs,
    livenessProjectionRefs: worksiteEvidence.livenessProjectionRefs
  });
  const closureDecision = deriveSdlcEdgeClosureDecision({
    decisionRef: closureDecisionRef,
    ledger,
    edgeClosureFunctionRef: edgeAssuranceContract.closureFunctionRef,
    edgeAssuranceCloseDecision,
    currentEdgeLawful:
      input.state.status !== "worker_report_rejected" &&
      repriceReasonRefs.length === 0,
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
  return Object.freeze({
    kind: "sdlc_installed_operator_traversal_consequence" as const,
    constructionIntent,
    worksiteEvidence,
    edgeGain,
    edgeResidualPressure,
    edgeFulfillmentLedger: ledger,
    edgeClosureDecision: closureDecision,
    overlaySegmentCompletion,
    postActionOverlayBinding,
    nextActionProjection
  });
}

function writeTraversalConsequenceArchive(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly consequence: SdlcInstalledOperatorTraversalConsequence;
}): void {
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
  const value = (event as unknown as Record<string, unknown>)[key];
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
      const completeReportDispatch = (input: {
        readonly workerRun: SdlcWorkerRunResult | null;
        readonly workerReport: SdlcWorkerResultReport;
        readonly hookWorkerContractRef: string;
        readonly passedFulfillmentDetail: string;
      }) => {
        writeProductMaterializationManifest({
          manifest,
          report: input.workerReport
        });
        const postflight = evaluateWorkerResultPostflight({
          manifest,
          report: input.workerReport
        });
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "postflight.json",
          payload: postflight
        });
        writeFpEvaluateResult({ manifest, report: input.workerReport, postflight });
        const traversalAuditEvent = writeTraversalSelectionAudit({
          basis,
          manifest,
          postflight,
          edgeAccountingRow
        });
        if (traversalAuditEvent !== null) {
          emitted.push(traversalAuditEvent);
        }
        if (postflight.status !== "passed") {
          const gapDossier = constructPostflightGapDossier({
            manifest,
            postflight
          });
          writePostflightGapDossier({ manifest, gapDossier });
          const current: SdlcAbgOwnedFpDispatchState = {
            status: "postflight_failed",
            manifest,
            workerRun: input.workerRun,
            workerReport: input.workerReport,
            postflight,
            assuranceSatisfaction: null,
            gapDossier,
            hookOutcome: null,
            blockingReason: postflight.blockingReasons.join(","),
            blockingReasonCarriers: postflight.blockingReasonCarriers,
            currentEdge: pluginInput.edge
          };
          const consequence = publishDispatchState(current);
          return constructFpDispatchOutcome({
            status: "dispatched",
            resultRef: gapDossier.currentGapDossierRef,
            attachedResultArtifact: fulfillmentFor({
              workerRun: input.workerRun,
              fulfillmentStatus: "partial",
              fulfillmentDetail: postflight.blockingReasons.join(","),
              blockingReasons: postflight.blockingReasons,
              evidenceRefs: postflight.evidenceRefs
            }),
            evidenceRefs: uniqueSorted([
              ...postflight.evidenceRefs,
              consequence.nextActionProjection.nextActionProjectionRef
            ]),
            reason: postflight.blockingReasons.join(",")
          });
        }

        const assuranceGate = deriveSdlcOperatorAssuranceGate({
          manifest,
          report: input.workerReport,
          postflight
        });
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "assurance_satisfaction.json",
          payload: assuranceGate.satisfaction
        });
        writeOperatorArchiveFile({
          archiveRoot: manifest.archiveRoot,
          relativePath: "assurance_ledgers.json",
          payload: assuranceGate.ledgers
        });
        if (assuranceGate.blockingPostflight !== null) {
          writeOperatorArchiveFile({
            archiveRoot: manifest.archiveRoot,
            relativePath: "assurance_postflight.json",
            payload: assuranceGate.blockingPostflight
          });
          writeFpEvaluateResult({
            manifest,
            report: input.workerReport,
            postflight: assuranceGate.blockingPostflight,
            postflightRef: pathToFileURL(
              join(manifest.archiveRoot, "assurance_postflight.json")
            ).href
          });
          const gapDossier = constructPostflightGapDossier({
            manifest,
            postflight: assuranceGate.blockingPostflight
          });
          writePostflightGapDossier({ manifest, gapDossier });
          const current: SdlcAbgOwnedFpDispatchState = {
            status:
              assuranceGate.satisfaction.status === "fp_escalation"
                ? "fp_escalation"
                : "postflight_failed",
            manifest,
            workerRun: input.workerRun,
            workerReport: input.workerReport,
            postflight: assuranceGate.blockingPostflight,
            assuranceSatisfaction: assuranceGate.satisfaction,
            gapDossier,
            hookOutcome: null,
            blockingReason: assuranceGate.blockingPostflight.blockingReasons.join(","),
            blockingReasonCarriers:
              assuranceGate.blockingPostflight.blockingReasonCarriers,
            currentEdge: pluginInput.edge
          };
          const consequence = publishDispatchState(current);
          if (assuranceGate.satisfaction.status === "reprice_required") {
            return constructFpDispatchOutcome({
              status: "blocked",
              resultRef: consequence.nextActionProjection.nextActionProjectionRef,
              attachedResultArtifact: null,
              evidenceRefs: assuranceGate.blockingPostflight.evidenceRefs,
              reason: assuranceGate.blockingPostflight.blockingReasons.join(",")
            });
          }
          return constructFpDispatchOutcome({
            status: "dispatched",
            resultRef: gapDossier.currentGapDossierRef,
            attachedResultArtifact: fulfillmentFor({
              workerRun: input.workerRun,
              fulfillmentStatus: "partial",
              fulfillmentDetail:
                assuranceGate.blockingPostflight.blockingReasons.join(","),
              blockingReasons: assuranceGate.blockingPostflight.blockingReasons,
              evidenceRefs: assuranceGate.blockingPostflight.evidenceRefs
            }),
            evidenceRefs: uniqueSorted([
              ...assuranceGate.blockingPostflight.evidenceRefs,
              consequence.nextActionProjection.nextActionProjectionRef
            ]),
            reason: assuranceGate.blockingPostflight.blockingReasons.join(",")
          });
        }

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
          const hookBlockingReasonCarriers = Object.freeze(
            hookOutcome.postflight === null || hookOutcome.postflight === undefined
              ? [
                  makeSdlcBlockingReason({
                    code: "hook_postflight_missing",
                    evidenceRefs: [
                      pathToFileURL(join(manifest.archiveRoot, "hook_outcome.json")).href
                    ]
                  })
                ]
              : hookOutcome.postflight.blockingReasons.map((reason) =>
                  makeSdlcBlockingReason({
                    code: "hook_postflight_failed",
                    detail: reason,
                    evidenceRefs: hookOutcome.postflight?.evidenceRefs ?? []
                  })
                )
          );
          const hookPostflight = Object.freeze({
            kind: "sdlc_operator_postflight_result" as const,
            status: "blocked" as const,
            blockingReasons: Object.freeze(
              hookBlockingReasonCarriers.map(legacyBlockingReasonCode)
            ),
            blockingReasonCarriers: hookBlockingReasonCarriers,
            evidenceRefs: Object.freeze([...(hookOutcome.postflight?.evidenceRefs ?? [])])
          });
          writeOperatorArchiveFile({
            archiveRoot: manifest.archiveRoot,
            relativePath: "hook_postflight.json",
            payload: hookPostflight
          });
          writeFpEvaluateResult({
            manifest,
            report: input.workerReport,
            postflight: hookPostflight,
            postflightRef: pathToFileURL(
              join(manifest.archiveRoot, "hook_postflight.json")
            ).href
          });
          const gapDossier = constructPostflightGapDossier({
            manifest,
            postflight: hookPostflight
          });
          writePostflightGapDossier({ manifest, gapDossier });
          const current: SdlcAbgOwnedFpDispatchState = {
            status: "postflight_failed",
            manifest,
            workerRun: input.workerRun,
            workerReport: input.workerReport,
            postflight: hookPostflight,
            assuranceSatisfaction: assuranceGate.satisfaction,
            gapDossier,
            hookOutcome,
            blockingReason: hookPostflight.blockingReasons.join(","),
            blockingReasonCarriers: hookPostflight.blockingReasonCarriers,
            currentEdge: pluginInput.edge
          };
          const consequence = publishDispatchState(current);
          return constructFpDispatchOutcome({
            status: "dispatched",
            resultRef: gapDossier.currentGapDossierRef,
            attachedResultArtifact: fulfillmentFor({
              workerRun: input.workerRun,
              fulfillmentStatus: "partial",
              fulfillmentDetail: hookPostflight.blockingReasons.join(","),
              blockingReasons: hookPostflight.blockingReasons,
              evidenceRefs: hookPostflight.evidenceRefs
            }),
            evidenceRefs: uniqueSorted([
              ...hookPostflight.evidenceRefs,
              consequence.nextActionProjection.nextActionProjectionRef
            ]),
            reason: hookPostflight.blockingReasons.join(",")
          });
        }
        const current: SdlcAbgOwnedFpDispatchState = {
          status: "worker_invoked",
          manifest,
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
        const consequence = publishDispatchState(current);
        if (consequence.edgeClosureDecision.disposition === "block") {
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
            consequence.nextActionProjection.nextActionProjectionRef
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
  const engineResult = await runEngineIterateAsync({
    basis,
    runtimeEvents: effectiveReplayEvents,
    eventSink: (event) => {
      emitted.push(event);
    },
    plugins: { fpDispatch },
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
  const terminal =
    engineResult.transition.kind === "terminal" ? engineResult.transition : null;
  const closureDisposition = traversalConsequence.edgeClosureDecision.disposition;
  const closedWithNextTraversal =
    closureDisposition === "close" &&
    traversalConsequence.nextActionProjection.choosesNextTraversal;
  const status =
    completedDispatchState.status === "worker_invoked" &&
    terminal?.terminalKind === "converged" &&
    closureDisposition === "close"
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
