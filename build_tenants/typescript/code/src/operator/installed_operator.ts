// Implements: REQ-F-ODDSDLC-051
// Implements: REQ-F-ODDSDLC-052
// Implements: REQ-F-ODDSDLC-053
// Implements: REQ-F-ODDSDLC-054
// Implements: REQ-F-ODDSDLC-055
// Implements: REQ-F-ODDSDLC-056

import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync, readFileSync, statSync } from "node:fs";
import {
  admitGraphSpanAssessment,
  constructEnginePluginContract,
  constructGraphSpanAssessedEvent,
  constructGraphSpanEvaluationScheduledEvent,
  constructGraphSpanFoldbackEvaluatedEvent,
  constructFpDispatchOutcome,
  constructVectorClosedEvent,
  constructVectorEvaluatedEvent,
  foldGraphSpanAssessments,
  deriveAdvancementTransition,
  deriveIterationAdvanceDecision,
  deriveRuntimeAggregateProjection,
  invokeSupervisedProcessActor,
  runEngineIterateAsync,
  runtimeEventsForFpTransformResult,
  runtimeEventsForIterationDecision,
  type ActorInvocation,
  type EnginePluginInput,
  type ExecutionBasis,
  type RuntimeAggregateProjection,
  type RuntimeEvent,
  type SupervisedProcessActorResult,
  type TracedProcessExecutorProfile,
  type TracedProcessOutcome,
  type TracedProcessStreamModel
} from "@abiogenesis/typescript-tenant";
import { FG_CONFORM_PROJECT } from "../graph/index.js";
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
  SdlcOperatorSummary,
  SdlcPostflightGapDossier,
  SdlcPostflightGapReason,
  SdlcPostflightResult,
  SdlcWorkerHandoffManifest,
  SdlcWorkerProcessStartedContext,
  SdlcWorkerProcessSummary,
  SdlcWorkerRetryContext,
  SdlcWorkerResultReport,
  SdlcWorkerRunResult,
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
  deriveWorkerHandoffManifest,
  evaluateWorkerResultPostflight,
  readPostflightGapDossierRef,
  readWorkerResultReport,
  operatorRunId,
  snapshotProductMaterializationRoot,
  stableOperatorJson,
  workerResultReportWithFpStageRefs,
  writeHandoffFiles,
  writeFpEvaluateResult,
  writeOperatorArchiveFile,
  writePostflightGapDossier,
  writeWorkerFpTransformResult,
  writeProductMaterializationManifest
} from "./handoff.js";
import {
  admitWorkerTransport,
  argsForWorker,
  parserForWorkerTransport,
  selectedWorkerExecutorProfile,
  stdinForWorker
} from "./transport.js";
import {
  deriveSdlcInstalledQualificationInitialState,
  writeSdlcInstalledQualificationInitialStateArchive
} from "../qualification/index.js";
import {
  deriveConformProjectManagedTraversalLedger,
  deriveConformProjectManagedTraversalManifest,
  materializeSdlcProjectConformance
} from "../workspace/index.js";
import {
  canonicalSdlcPriorGapReasonCode,
  legacyBlockingReasonCode,
  makeSdlcBlockingReason,
  sdlcBlockingReasonFromLegacy,
  summarizeBlockingReasons,
  type SdlcBlockingReason,
  type SdlcBlockingReasonCode
} from "../shared/blocking_reason.js";

const MAX_INSTALLED_REENTRY_ATTEMPTS = 4;

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
    archiveRoot: input.archiveRoot
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
    blockingReason: input.outcome.summary.blockingReason,
    nextLawfulAction: input.outcome.summary.nextLawfulAction,
    archiveRoot: input.outcome.archiveRoot,
    retryEligible: input.outcome.gapDossier?.retryEligible ?? false,
    emittedRuntimeEventKinds: input.outcome.emittedRuntimeEventKinds
  });
}

function installedStartHasSameEdgeRetryTruth(
  outcome: SdlcInstalledOperatorStartOutcome
): boolean {
  if (outcome.gapDossier?.retryEligible !== true) {
    return false;
  }
  return (
    outcome.summary.nextLawfulAction === "retry_same_edge_with_gap_dossier" ||
    outcome.gapDossier.nextLawfulActions.includes("retry_same_edge")
  );
}

function installedStartHasRepairReentryTruth(
  outcome: SdlcInstalledOperatorStartOutcome
): boolean {
  return (
    outcome.gapDossier?.retryEligible === true &&
    outcome.gapDossier.nextLawfulActions.includes("repair_worker_output")
  );
}

function installedStartHasFpEscalationTruth(
  outcome: SdlcInstalledOperatorStartOutcome
): boolean {
  return (
    outcome.gapDossier?.retryEligible === true &&
    outcome.gapDossier.nextLawfulActions.includes("escalate_to_fp")
  );
}

function installedStartHasReentryTruth(
  outcome: SdlcInstalledOperatorStartOutcome
): boolean {
  return (
    installedStartHasSameEdgeRetryTruth(outcome) ||
    installedStartHasFpEscalationTruth(outcome) ||
    installedStartHasRepairReentryTruth(outcome)
  );
}

function retryContextFromGapDossier(input: {
  readonly gapDossier: SdlcPostflightGapDossier;
  readonly attemptIndex: number;
}): SdlcWorkerRetryContext {
  const sourceProjectionRef = `projection://odd-sdlc-ts/installed-reentry/${input.gapDossier.vectorIndex}/${input.attemptIndex}`;
  return Object.freeze({
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: Object.freeze([
      Object.freeze({
        vectorIndex: input.gapDossier.vectorIndex,
        retryRunId: `retry-run://odd-sdlc-ts/installed-reentry/${input.gapDossier.vectorIndex}/${input.attemptIndex}`,
        retryCallId: `retry-call://odd-sdlc-ts/installed-reentry/${input.gapDossier.vectorIndex}/${input.attemptIndex}`,
        manifestId: input.gapDossier.priorManifestId,
        priorManifestId: input.gapDossier.currentGapDossierRef,
        attemptIndex: input.attemptIndex,
        sourceProjectionRef
      })
    ]),
    priorGapDossiers: Object.freeze([input.gapDossier])
  });
}

function terminalReasonForInstalledStartLoop(input: {
  readonly requestedUntil: string;
  readonly outcome: SdlcInstalledOperatorStartOutcome;
  readonly retryGuardExhausted: boolean;
}): SdlcInstalledOperatorStartLoop["terminalReason"] {
  if (input.retryGuardExhausted) {
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
  readonly retryGuardExhausted: boolean;
}): SdlcInstalledOperatorStartOutcome {
  if (input.attempts.length <= 1) {
    return input.outcome;
  }
  const loop: SdlcInstalledOperatorStartLoop = Object.freeze({
    kind: "sdlc_installed_operator_start_loop",
    requestedUntil: input.requestedUntil,
    maxAttempts: MAX_INSTALLED_REENTRY_ATTEMPTS,
    attemptCount: input.attempts.length,
    terminalReason: terminalReasonForInstalledStartLoop({
      requestedUntil: input.requestedUntil,
      outcome: input.outcome,
      retryGuardExhausted: input.retryGuardExhausted
    }),
    attempts: Object.freeze([...input.attempts])
  });
  return Object.freeze({
    ...input.outcome,
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

function compactPriorGapDossiers(
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
  const latestReasonByCode = new Map<string, SdlcPostflightGapReason>();
  for (const dossier of dossiers) {
    for (const reason of dossier.reasons) {
      const canonicalReason = canonicalSdlcPriorGapReasonCode(reason.reason);
      latestReasonByCode.set(
        canonicalReason,
        Object.freeze({
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
            evidenceRefs: [dossier.currentGapDossierRef]
          })
        })
      );
    }
  }
  const compact: SdlcPostflightGapDossier = Object.freeze({
    kind: latest.kind,
    status: latest.status,
    graphFunctionName: latest.graphFunctionName,
    edgeName: latest.edgeName,
    vectorIndex: latest.vectorIndex,
    targetAssetType: latest.targetAssetType,
    reasons: Object.freeze(
      [...latestReasonByCode.values()].sort((left, right) =>
        left.reason.localeCompare(right.reason)
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
        priorManifestId: ref.priorManifestId,
        attemptIndex: ref.attemptIndex,
        sourceProjectionRef: ref.sourceProjectionRef
      })
    )
  );
  return Object.freeze({
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs,
    priorGapDossiers: compactPriorGapDossiers(
      retryAttemptRefs
        .map((ref) => readPostflightGapDossierRef(ref.priorManifestId))
        .filter((dossier): dossier is SdlcPostflightGapDossier => dossier !== null)
    )
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
      dossier.nextLawfulActions.includes("repair_worker_output")
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
      `${ref.vectorIndex}:${ref.priorManifestId}:${ref.attemptIndex}`,
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

function vectorIndexByEdgeName(input: {
  readonly basis: ExecutionBasis;
  readonly edgeName: string;
}): number | null {
  const index = input.basis.graph.vectors.findIndex(
    (vector) => vector.name === input.edgeName
  );
  return index < 0 ? null : index;
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

function graphSpanRefForRepairReentry(input: {
  readonly basis: ExecutionBasis;
  readonly sourceVectorIndex: number;
  readonly terminalVectorIndex: number;
}) {
  return Object.freeze({
    kind: "graph_span_ref" as const,
    spanId: `graph-span:odd-sdlc-repair:${input.basis.id}:${input.sourceVectorIndex}->${input.terminalVectorIndex}`,
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

function repairReentryGraphSpanRuntimeEvents(input: {
  readonly basis: ExecutionBasis;
  readonly outcome: SdlcAbgOwnedFpDispatchState;
  readonly replayEvents: readonly RuntimeEvent[];
}): readonly RuntimeEvent[] {
  const dossier = input.outcome.gapDossier;
  if (
    dossier === null ||
    dossier.retryEligible !== true ||
    !dossier.nextLawfulActions.includes("repair_worker_output")
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
  const span = graphSpanRefForRepairReentry({
    basis: input.basis,
    sourceVectorIndex: targetVectorIndex,
    terminalVectorIndex
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
  return Object.freeze([
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
  readonly failureClass: "runtime_failure" | "payload_contract_failure";
  readonly detail: string;
}): Readonly<Record<string, unknown>> {
  return Object.freeze({
    kind: "runtime_failure",
    failureClass: input.failureClass,
    detail: input.detail
  });
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

const DEFAULT_WORKER_INACTIVITY_TIMEOUT_MS = 1000 * 60 * 10;
const DEFAULT_WORKER_TIMEOUT_MS = 1000 * 60 * 30;
const DEFAULT_WORKER_HEARTBEAT_MS = 1000 * 30;

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

function writeWorkerProcessSummary(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath: string;
  readonly promptPath: string;
  readonly workerRun: SdlcWorkerRunResult;
  readonly processResult: SupervisedProcessActorResult;
  readonly policy: ReturnType<typeof workerInactivityPolicy>;
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
  const args = argsForWorker({
    transport: input.transport,
    manifestPath: input.manifestPath,
    manifest: input.manifest,
    promptPath: input.promptPath,
    outputLastMessagePath: outputLastMessagePath ?? ""
  });
  const processResult: SupervisedProcessActorResult =
    await invokeSupervisedProcessActor({
      invocation: actorInvocationForPluginInput({
        pluginInput: input.pluginInput,
        transport: input.transport
      }),
      command: input.transport.command,
      args,
      cwd: input.manifest.workspaceRoot,
      environment: {
        ...process.env,
        ODD_SDLC_OPERATOR_MANIFEST: input.manifestPath,
        ODD_SDLC_OPERATOR_REPORT: input.manifest.reportFile,
        ODD_SDLC_OPERATOR_OUTPUT: input.manifest.outputFile,
        ODD_SDLC_OPERATOR_MATERIALIZATION_ROOT:
          input.manifest.productMaterialization.tenantRoot,
        ODD_SDLC_OPERATOR_MATERIALIZATION_MANIFEST:
          input.manifest.productMaterialization.manifestFile
      },
      environmentPolicy: environmentPolicyForTransport(input.transport),
      stdin: stdinForWorker({
        transport: input.transport,
        promptPath: input.promptPath
      }),
      stdoutPath,
      stderrPath,
      stdoutRef: pathToFileURL(stdoutPath).href,
      stderrRef: pathToFileURL(stderrPath).href,
      processStartedPath,
      processEventsPath,
      parser: parserForWorkerTransport(input.transport),
      executorProfile,
      timeoutMs: Math.min(
        inactivityPolicy.timeoutMs,
        inactivityPolicy.inactivityTimeoutMs
      ),
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
  writeWorkerProcessSummary({
    manifest: input.manifest,
    manifestPath: input.manifestPath,
    promptPath: input.promptPath,
    workerRun,
    processResult,
    policy: inactivityPolicy
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

interface SdlcAbgOwnedFpDispatchState {
  readonly status: SdlcInstalledOperatorStatus;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly workerRun: SdlcWorkerRunResult;
  readonly workerReport: SdlcWorkerResultReport | null;
  readonly postflight: SdlcPostflightResult | null;
  readonly assuranceSatisfaction: SdlcInstalledOperatorStartOutcome["assuranceSatisfaction"];
  readonly gapDossier: SdlcPostflightGapDossier | null;
  readonly hookOutcome: SdlcHookTurnOutcome | null;
  readonly blockingReason: string | null;
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
  readonly nextLawfulAction: string | null;
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

function workerProcessEvidenceRefs(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly workerRun: SdlcWorkerRunResult;
}): readonly string[] {
  return Object.freeze([
    pathToFileURL(join(input.manifest.archiveRoot, "worker_run.json")).href,
    workerProcessStartedContextRef(input.manifest),
    workerProcessSummaryRef(input.manifest),
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
  return /rate_limit_event|api_error_status["']?\s*:?\s*429|monthly usage limit|rate limit|rate_limit/u.test(
    text
  );
}

function workerFailureCode(input: {
  readonly workerRun: SdlcWorkerRunResult;
  readonly silentInactivity: boolean;
}): SdlcBlockingReasonCode {
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
  const sourceWorkspaceRoot = input.sourceWorkspaceRoot ?? input.workspaceRoot;
  const projection = deriveRuntimeAggregateProjection(basis, input.replayEvents);
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

  const transition = deriveAdvancementTransition(basis, input.replayEvents);
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
      ".ai-workspace",
      "runtime",
      "odd_sdlc",
      "operator-runs",
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
    const emitted = await appendFdConformanceRuntimeEvents({
      workspaceRoot: input.workspaceRoot,
      basis,
      replayEvents: input.replayEvents,
      vectorIndex: transition.vectorIndex
    });
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

  if (input.workerTransport === null) {
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

  const transport = admitWorkerTransport(input.workerTransport);
  const executionContract = input.start.executionContract;
  const dispatchState: { current: SdlcAbgOwnedFpDispatchState | null } = {
    current: null
  };
  const emitted: RuntimeEvent[] = [];
  const fpDispatch = Object.freeze({
    contract: fpDispatchPluginContract(),
    dispatch: async (pluginInput: EnginePluginInput) => {
      const contract = hookContractByEdgeName(pluginInput.edge);
      const manifest = deriveWorkerHandoffManifest({
        workspaceRoot: input.workspaceRoot,
        graphFunctionName: executionContract.targetGraphFunction,
        edgeName: pluginInput.edge,
        vectorIndex: pluginInput.vectorIndex,
        contract,
        fpTransformRequest: pluginInput.fpTransformRequest,
        traversalAttemptEnvelope: pluginInput.traversalAttemptEnvelope,
        conformedProject: executionContract.conformedProject,
        retryContext: mergedRetryContext({
          projected: retryContextFromRetryAttemptRefs(
            pluginInput.retryAttemptRefs.filter(
              (ref) => ref.vectorIndex === pluginInput.vectorIndex
            )
          ),
          override: input.retryContextOverride,
          vectorIndex: pluginInput.vectorIndex
        })
      });
      const beforeMaterialization = snapshotProductMaterializationRoot(
        manifest.productMaterialization
      );
      const handoffFiles = writeHandoffFiles(manifest);
      const workerRun = await invokeWorkerThroughAbgProcessActor({
        transport,
        manifest,
        manifestPath: handoffFiles.manifestPath,
        promptPath: handoffFiles.promptPath,
        pluginInput,
        eventSink: (event) => {
          emitted.push(event);
        }
      });
      const expectedAssessmentIds =
        pluginInput.expectedAssessmentIds.length === 0
          ? vectorEvaluatorNames({ basis, vectorIndex: pluginInput.vectorIndex })
          : pluginInput.expectedAssessmentIds;

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
        dispatchState.current = {
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
          nextLawfulAction: null,
          currentEdge: pluginInput.edge
        };
        return constructFpDispatchOutcome({
          status: "blocked",
          resultRef: gapDossier.currentGapDossierRef,
          attachedResultArtifact: stopForRuntimeTriage
            ? null
            : runtimeFailureArtifact({
                failureClass: "runtime_failure",
                detail: failurePostflight.blockingReasons.join(",")
              }),
          evidenceRefs: failurePostflight.evidenceRefs,
          reason: failurePostflight.blockingReasons.join(",")
        });
      }
      let workerReport: SdlcWorkerResultReport;
      try {
        workerReport = readWorkerResultReport(manifest);
      } catch (error: unknown) {
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
              generatedFunction: "ABG.events",
              previousReportAdmissionError:
                error instanceof Error ? error.message : "worker_report_rejected",
              materializedFileCount: workerReport.materializedFiles.length,
              outputFile: workerReport.outputFile,
              digest: workerReport.digest
            }
          });
        } catch (postTransformError: unknown) {
          const rejectionPostflight = workerReportAdmissionPostflight({
            manifest,
            workerRun,
            reason:
              postTransformError instanceof Error
                ? postTransformError.message
                : error instanceof Error
                  ? error.message
                  : "worker_report_rejected"
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
          dispatchState.current = {
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
            nextLawfulAction: null,
            currentEdge: pluginInput.edge
          };
          return constructFpDispatchOutcome({
            status: "blocked",
            resultRef: gapDossier.currentGapDossierRef,
            attachedResultArtifact: runtimeFailureArtifact({
              failureClass: "payload_contract_failure",
              detail: rejectionPostflight.blockingReasons.join(",")
            }),
            evidenceRefs: rejectionPostflight.evidenceRefs,
            reason: rejectionPostflight.blockingReasons.join(",")
          });
        }
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
      writeProductMaterializationManifest({ manifest, report: workerReport });
      const postflight = evaluateWorkerResultPostflight({
        manifest,
        report: workerReport
      });
      writeOperatorArchiveFile({
        archiveRoot: manifest.archiveRoot,
        relativePath: "postflight.json",
        payload: postflight
      });
      writeFpEvaluateResult({ manifest, report: workerReport, postflight });
      if (postflight.status !== "passed") {
        const gapDossier = constructPostflightGapDossier({
          manifest,
          postflight
        });
        writePostflightGapDossier({ manifest, gapDossier });
        dispatchState.current = {
          status: "postflight_failed",
          manifest,
          workerRun,
          workerReport,
          postflight,
          assuranceSatisfaction: null,
          gapDossier,
          hookOutcome: null,
          blockingReason: postflight.blockingReasons.join(","),
          blockingReasonCarriers: postflight.blockingReasonCarriers,
          nextLawfulAction: null,
          currentEdge: pluginInput.edge
        };
        return constructFpDispatchOutcome({
          status: "dispatched",
          resultRef: gapDossier.currentGapDossierRef,
          attachedResultArtifact: fulfillmentArtifact({
            manifest,
            transport,
            basis,
            expectedAssessmentIds,
            fulfillmentStatus: "partial",
            fulfillmentDetail: postflight.blockingReasons.join(","),
            blockingReasons: postflight.blockingReasons,
            evidenceRefs: postflight.evidenceRefs
          }),
          evidenceRefs: postflight.evidenceRefs,
          reason: postflight.blockingReasons.join(",")
        });
      }

      const assuranceGate = deriveSdlcOperatorAssuranceGate({
        manifest,
        report: workerReport,
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
        const gapDossier = constructPostflightGapDossier({
          manifest,
          postflight: assuranceGate.blockingPostflight
        });
        writePostflightGapDossier({ manifest, gapDossier });
        dispatchState.current = {
          status:
            assuranceGate.satisfaction.status === "fp_escalation"
              ? "fp_escalation"
              : "postflight_failed",
          manifest,
          workerRun,
          workerReport,
          postflight: assuranceGate.blockingPostflight,
          assuranceSatisfaction: assuranceGate.satisfaction,
          gapDossier,
          hookOutcome: null,
          blockingReason: assuranceGate.blockingPostflight.blockingReasons.join(","),
          blockingReasonCarriers:
            assuranceGate.blockingPostflight.blockingReasonCarriers,
          nextLawfulAction:
            assuranceGate.satisfaction.status === "reprice_required"
              ? "reprice_requirement_or_design"
              : assuranceGate.satisfaction.status === "fp_escalation"
                ? "escalate_to_fp"
              : null,
          currentEdge: pluginInput.edge
        };
        if (assuranceGate.satisfaction.status === "reprice_required") {
          return constructFpDispatchOutcome({
            status: "blocked",
            resultRef: gapDossier.currentGapDossierRef,
            attachedResultArtifact: null,
            evidenceRefs: assuranceGate.blockingPostflight.evidenceRefs,
            reason: assuranceGate.blockingPostflight.blockingReasons.join(",")
          });
        }
        return constructFpDispatchOutcome({
          status: "dispatched",
          resultRef: gapDossier.currentGapDossierRef,
          attachedResultArtifact: fulfillmentArtifact({
            manifest,
            transport,
            basis,
            expectedAssessmentIds,
            fulfillmentStatus: "partial",
            fulfillmentDetail:
              assuranceGate.blockingPostflight.blockingReasons.join(","),
            blockingReasons: assuranceGate.blockingPostflight.blockingReasons,
            evidenceRefs: assuranceGate.blockingPostflight.evidenceRefs
          }),
          evidenceRefs: assuranceGate.blockingPostflight.evidenceRefs,
          reason: assuranceGate.blockingPostflight.blockingReasons.join(",")
        });
      }

      const constructorResult = constructorResultFromWorkerOutput({
        manifest,
        report: workerReport,
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
          fpWorkerContractRef: transport.raw
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
        const gapDossier = constructPostflightGapDossier({
          manifest,
          postflight: hookPostflight
        });
        writePostflightGapDossier({ manifest, gapDossier });        dispatchState.current = {
          status: "postflight_failed",
          manifest,
          workerRun,
          workerReport,
          postflight: hookPostflight,
          assuranceSatisfaction: assuranceGate.satisfaction,
          gapDossier,
          hookOutcome,
          blockingReason: hookPostflight.blockingReasons.join(","),
          blockingReasonCarriers: hookPostflight.blockingReasonCarriers,
          nextLawfulAction: null,
          currentEdge: pluginInput.edge
        };
        return constructFpDispatchOutcome({
          status: "dispatched",
          resultRef: gapDossier.currentGapDossierRef,
          attachedResultArtifact: fulfillmentArtifact({
            manifest,
            transport,
            basis,
            expectedAssessmentIds,
            fulfillmentStatus: "partial",
            fulfillmentDetail: hookPostflight.blockingReasons.join(","),
            blockingReasons: hookPostflight.blockingReasons,
            evidenceRefs: hookPostflight.evidenceRefs
          }),
          evidenceRefs: hookPostflight.evidenceRefs,
          reason: hookPostflight.blockingReasons.join(",")
        });
      }
      dispatchState.current = {
        status: "worker_invoked",
        manifest,
        workerRun,
        workerReport,
        postflight,
        assuranceSatisfaction: assuranceGate.satisfaction,
        gapDossier: null,
        hookOutcome,
        blockingReason: null,
        blockingReasonCarriers: Object.freeze([]),
        nextLawfulAction: null,
        currentEdge: null
      };
      return constructFpDispatchOutcome({
        status: "dispatched",
        resultRef: dispatchResultRef(manifest),
        attachedResultArtifact: fulfillmentArtifact({
          manifest,
          transport,
          basis,
          expectedAssessmentIds,
          fulfillmentStatus: "fulfilled",
          fulfillmentDetail: "installed operator postflight passed",
          blockingReasons: Object.freeze([]),
          evidenceRefs: postflight.evidenceRefs
        }),
        evidenceRefs: postflight.evidenceRefs
      });
    }
  });
  const engineResult = await runEngineIterateAsync({
    basis,
    runtimeEvents: input.replayEvents,
    eventSink: (event) => {
      emitted.push(event);
    },
    plugins: { fpDispatch },
    maxAttachedFpAttempts: 3
  });
  const completedDispatchState = dispatchState.current;
  if (completedDispatchState === null) {
    await appendOddSdlcRuntimeEvents({
      workspaceRoot: input.workspaceRoot,
      events: emitted
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
      replayEventCountAfter: input.replayEvents.length + emitted.length,
      emittedRuntimeEventKinds: Object.freeze(emitted.map((event) => event.kind)),
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
      replayEvents: input.replayEvents
    })
  );
  await appendOddSdlcRuntimeEvents({
    workspaceRoot: input.workspaceRoot,
    events: emitted
  });
  const retryPlanned = emitted.some((event) => event.kind === "retry_repair_planned");
  const retryVisibleGap =
    completedDispatchState.gapDossier?.retryEligible === true &&
    completedDispatchState.gapDossier.nextLawfulActions.includes("retry_same_edge");
  const repairVisibleGap =
    completedDispatchState.gapDossier?.retryEligible === true &&
    completedDispatchState.gapDossier.nextLawfulActions.includes("repair_worker_output");
  const fpEscalationVisibleGap =
    completedDispatchState.gapDossier?.retryEligible === true &&
    completedDispatchState.gapDossier.nextLawfulActions.includes("escalate_to_fp");
  const nextVector =
    engineResult.projection.nextVectorIndex === null
      ? null
      : basis.graph.vectors[engineResult.projection.nextVectorIndex]?.name ?? null;
  const terminal =
    engineResult.transition.kind === "terminal" ? engineResult.transition : null;
  const status =
    completedDispatchState.status === "worker_invoked" &&
    terminal?.terminalKind === "converged"
      ? "converged"
      : completedDispatchState.status === "worker_invoked" &&
          terminal?.terminalKind === "gap_stop"
        ? "blocked"
        : completedDispatchState.status;
  const blockingReason =
    status === "blocked" && terminal?.reason !== null && terminal?.reason !== undefined
      ? terminal.reason
      : completedDispatchState.blockingReason;
  const nextLawfulAction =
    status === "converged"
      ? "close_or_reprice"
      : status === "blocked" && engineResult.assuranceGate.kind === "assurance_blocked"
        ? "review_dossier"
        : completedDispatchState.nextLawfulAction ??
          (completedDispatchState.status === "worker_invoked"
            ? engineResult.projection.nextVectorIndex === null
              ? "close_or_reprice"
              : "rerun_gaps_or_start_next_edge"
            : retryPlanned || retryVisibleGap
              ? "retry_same_edge_with_gap_dossier"
              : fpEscalationVisibleGap
                ? "escalate_to_fp_with_gap_dossier"
              : repairVisibleGap
                ? "plan_repair_reentry_with_gap_dossier"
              : "inspect_worker_archive");
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
    replayEventCountAfter: input.replayEvents.length + emitted.length,
    emittedRuntimeEventKinds: Object.freeze(emitted.map((event) => event.kind)),
    archiveRoot: completedDispatchState.manifest.archiveRoot,
    blockingReason,
    blockingReasonCarriers: completedDispatchState.blockingReasonCarriers,
    nextLawfulAction,
    currentEdge:
      status === "converged"
        ? null
        : completedDispatchState.status === "worker_invoked"
        ? nextVector
        : completedDispatchState.currentEdge
  });
  writeOperatorArchiveFile({
    archiveRoot: completedDispatchState.manifest.archiveRoot,
    relativePath: "runtime_events.json",
    payload: emitted
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
  readonly requestedUntil: string;
  readonly requireInstalledTopology?: boolean;
  readonly refreshReplayState: () => Promise<{
    readonly start: SdlcPublicStartOutcome;
    readonly replayEvents: readonly RuntimeEvent[];
  }>;
}): Promise<SdlcInstalledOperatorStartOutcome> {
  const attempts: SdlcInstalledOperatorStartLoopAttempt[] = [];
  let latest: SdlcInstalledOperatorStartOutcome | null = null;
  let start = input.start;
  let replayEvents = input.replayEvents;
  let retryGuardExhausted = false;
  let retryContextOverride: SdlcWorkerRetryContext | undefined;
  for (
    let attemptIndex = 0;
    attemptIndex < MAX_INSTALLED_REENTRY_ATTEMPTS;
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
    if (!installedStartHasReentryTruth(latest)) {
      break;
    }
    if (attemptIndex === MAX_INSTALLED_REENTRY_ATTEMPTS - 1) {
      retryGuardExhausted = true;
      break;
    }
    retryContextOverride =
      latest.gapDossier === null
        ? undefined
        : retryContextFromGapDossier({
            gapDossier: latest.gapDossier,
            attemptIndex: attemptIndex + 1
          });
    const refreshed = await input.refreshReplayState();
    start = refreshed.start;
    replayEvents = refreshed.replayEvents;
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
      ...(input.requireInstalledTopology === undefined
        ? {}
        : { requireInstalledTopology: input.requireInstalledTopology })
    });
  }
  return installedStartWithLoop({
    requestedUntil: input.requestedUntil,
    outcome: latest,
    attempts,
    retryGuardExhausted
  });
}
