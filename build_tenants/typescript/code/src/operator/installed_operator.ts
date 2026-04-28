// Implements: REQ-F-ODDSDLC-051
// Implements: REQ-F-ODDSDLC-052
// Implements: REQ-F-ODDSDLC-053
// Implements: REQ-F-ODDSDLC-054
// Implements: REQ-F-ODDSDLC-055
// Implements: REQ-F-ODDSDLC-056

import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  constructDispatchRequest,
  constructVectorClosedEvent,
  constructVectorEvaluatedEvent,
  deriveAdvancementTransition,
  deriveIterationAdvanceDecision,
  deriveRetryRepairDecision,
  deriveRuntimeAggregateProjection,
  emit,
  resultAssessment,
  runtimeEventsForIterationDecision,
  runtimeEventsForRetryRepairDecision,
  type ExecutionBasis,
  type RuntimeAggregateProjection,
  type RuntimeEvent
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
  SdlcInstalledOperatorStartOutcome,
  SdlcInstalledOperatorStatus,
  SdlcOperatorSummary,
  SdlcPostflightGapDossier,
  SdlcPostflightResult,
  SdlcWorkerHandoffManifest,
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
  constructorResultFromWorkerOutput,
  deriveWorkerHandoffManifest,
  evaluateWorkerResultPostflight,
  readPostflightGapDossierRef,
  readWorkerResultReport,
  operatorRunId,
  sha256File,
  stableOperatorJson,
  writeHandoffFiles,
  writeOperatorArchiveFile,
  writePostflightGapDossier,
  writeProductMaterializationManifest
} from "./handoff.js";
import {
  admitWorkerTransport,
  invokeWorkerTransport
} from "./transport.js";
import {
  deriveSdlcInstalledQualificationInitialState,
  writeSdlcInstalledQualificationInitialStateArchive
} from "../qualification/index.js";
import {
  deriveConformProjectManagedTraversalLedger,
  deriveConformProjectManagedTraversalManifest,
  deriveSdlcConformProjectProfileFromWorkspace,
  materializeSdlcProjectConformance
} from "../workspace/index.js";
import {
  legacyBlockingReasonCode,
  makeSdlcBlockingReason,
  sdlcBlockingReasonFromLegacy,
  summarizeBlockingReasons,
  type SdlcBlockingReason
} from "../shared/blocking_reason.js";

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

function retryContextFromProjection(
  projection: RuntimeAggregateProjection
): SdlcWorkerRetryContext {
  const retryAttemptRefs = Object.freeze(
    projection.retryAttemptRefs.map((ref) =>
      Object.freeze({
        vectorIndex: ref.vectorIndex,
        retryRunId: ref.retryRunId,
        retryCallId: ref.retryCallId,
        manifestId: ref.manifestId,
        attemptIndex: ref.attemptIndex,
        sourceProjectionRef: ref.sourceProjectionRef
      })
    )
  );
  return Object.freeze({
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs,
    priorGapDossiers: Object.freeze(
      retryAttemptRefs
        .map((ref) => readPostflightGapDossierRef(ref.manifestId))
        .filter((dossier): dossier is SdlcPostflightGapDossier => dossier !== null)
    )
  });
}

function constructAssessmentInput(input: {
  readonly basis: ExecutionBasis;
  readonly transition: Extract<ReturnType<typeof deriveAdvancementTransition>, { readonly kind: "fp_dispatch" }>;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly transport: SdlcWorkerTransportContract;
  readonly postflight: SdlcPostflightResult;
  readonly expectedAssessmentIds: readonly string[];
}) {
  return Object.freeze({
    kind: "fp_assessed",
    dispatch_request: constructDispatchRequest({
      basisId: input.basis.id,
      graphFunctionId: input.basis.graphFunction.id,
      jobId: input.basis.job.id,
      dispatchRef: input.transition.dispatchRef,
      workerId: input.transport.workerId,
      backendId: input.transport.backendId,
      resultRef: `result://odd-sdlc/operator/${input.manifest.edgeName}/${input.manifest.vectorIndex}`,
      expectedEdge: input.manifest.edgeName,
      expectedAssessmentIds: input.expectedAssessmentIds,
      transportContract: {
        agentKey: input.transport.agentKey,
        command: input.transport.command,
        argsTemplate: input.transport.args,
        sanitizedEnvironmentPolicy: {
          prefixes: []
        }
      }
    }),
    result_artifact: {
      edge: input.manifest.edgeName,
      actor: input.transport.workerId,
      fulfillment_assessments: input.expectedAssessmentIds.map((id) =>
        Object.freeze({
          id,
          evaluator: id,
          fulfillment_status: "fulfilled",
          fulfillment_detail: "installed operator postflight passed",
          blocking_reasons: [],
          evidence_refs: input.postflight.evidenceRefs
        })
      ),
      selected_worker_id: input.transport.workerId,
      selected_backend: input.transport.backendId,
      role_id: "role://odd-sdlc/fp-worker",
      assignment_source: "installed_worker_transport",
      resolved_runtime_ref: input.basis.runtimeIdentity.resolvedRuntimeRef
    },
    manifest_provenance: {
      spec_hash: sha256File(`${input.manifest.archiveRoot}/handoff_manifest.json`),
      manifest_id: `file://${input.manifest.archiveRoot}/handoff_manifest.json`,
      workflow_version: "odd_sdlc_ts_operator_v1",
      run_id: input.basis.runId,
      work_key: input.basis.workKey,
      authority_ref: "ticket://odd_sdlc/T-064",
      selected_worker_id: input.transport.workerId,
      selected_backend: input.transport.backendId,
      role_id: "role://odd-sdlc/fp-worker",
      assignment_source: "installed_worker_transport",
      resolved_runtime_ref: input.basis.runtimeIdentity.resolvedRuntimeRef
    },
    published_ledger_ref: {
      ref: `file://${input.manifest.archiveRoot}/postflight.json`
    }
  });
}

async function appendAcceptedRuntimeEvents(input: {
  readonly workspaceRoot: string;
  readonly basis: ExecutionBasis;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly transition: Extract<ReturnType<typeof deriveAdvancementTransition>, { readonly kind: "fp_dispatch" }>;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly transport: SdlcWorkerTransportContract;
  readonly postflight: SdlcPostflightResult;
}): Promise<readonly RuntimeEvent[]> {
  const projection = deriveRuntimeAggregateProjection(input.basis, input.replayEvents);
  const decision = deriveIterationAdvanceDecision(input.basis, projection);
  if (decision.kind !== "advance_vector") {
    return Object.freeze([]);
  }
  const emitted: RuntimeEvent[] = [];
  const planned = emit(runtimeEventsForIterationDecision(decision), (event) => {
    emitted.push(event);
  });
  const expectedAssessmentIds = vectorEvaluatorNames({
    basis: input.basis,
    vectorIndex: input.transition.vectorIndex
  });
  resultAssessment(
    constructAssessmentInput({
      basis: input.basis,
      transition: input.transition,
      manifest: input.manifest,
      transport: input.transport,
      postflight: input.postflight,
      expectedAssessmentIds
    }),
    (event) => {
      emitted.push(event);
    }
  );
  await appendOddSdlcRuntimeEvents({
    workspaceRoot: input.workspaceRoot,
    events: emitted
  });
  return Object.freeze([...planned, ...emitted.slice(planned.length)]);
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

async function appendPostflightFailureRuntimeEvents(input: {
  readonly workspaceRoot: string;
  readonly basis: ExecutionBasis;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly gapDossier: SdlcPostflightGapDossier;
}): Promise<readonly RuntimeEvent[]> {
  const projection = deriveRuntimeAggregateProjection(input.basis, input.replayEvents);
  const decision = deriveIterationAdvanceDecision(input.basis, projection);
  if (
    decision.kind !== "advance_vector" ||
    decision.vectorIndex !== input.manifest.vectorIndex
  ) {
    return Object.freeze([]);
  }
  const retryDecision = deriveRetryRepairDecision({
    basis: input.basis,
    projection,
    failedVectorIndex: input.manifest.vectorIndex,
    priorManifestId: input.gapDossier.priorManifestId,
    candidateManifestId: input.gapDossier.currentGapDossierRef,
    maxAttempts: 3,
    stationary: false,
    escalationSubjectRef: null,
    continuationRepair: {
      terminatedContinuationId: `continuation:${encodeURIComponent(
        input.gapDossier.priorManifestId
      )}`,
      reopenedContinuationId: `continuation:${encodeURIComponent(
        input.gapDossier.currentGapDossierRef
      )}`
    }
  });
  const emitted = Object.freeze([
    ...runtimeEventsForIterationDecision(decision),
    constructVectorEvaluatedEvent({
      basis: input.basis,
      vectorIndex: input.manifest.vectorIndex,
      status: "blocked"
    }),
    ...runtimeEventsForRetryRepairDecision(retryDecision)
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
    pathToFileURL(join(input.manifest.archiveRoot, "worker_run.json")).href,
    pathToFileURL(join(input.manifest.archiveRoot, "handoff_manifest.json")).href,
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
  readonly start: SdlcPublicStartOutcome;
  readonly workerTransport: string | null;
  readonly replayEvents: readonly RuntimeEvent[];
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
        workspaceRoot: input.workspaceRoot
      });
    const report = materializeSdlcProjectConformance({
      workspaceRoot: input.workspaceRoot
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
  const contract = hookContractByEdgeName(decision.edge);
  const conformedProject = deriveSdlcConformProjectProfileFromWorkspace(
    input.workspaceRoot
  );
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: input.workspaceRoot,
    graphFunctionName: input.start.executionContract.targetGraphFunction,
    edgeName: decision.edge,
    vectorIndex: decision.vectorIndex,
    contract,
    conformedProject,
    retryContext: retryContextFromProjection(projection)
  });
  const handoffFiles = writeHandoffFiles(manifest);
  const workerRun = invokeWorkerTransport({
    transport,
    manifest,
    manifestPath: handoffFiles.manifestPath,
    promptPath: handoffFiles.promptPath
  });
  if (workerRun.status !== 0) {
    const outcome = terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "worker_failed",
      start: input.start,
      transport,
      manifest,
      workerRun,
      workerReport: null,
      postflight: null,
      gapDossier: null,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length,
      emittedRuntimeEventKinds: Object.freeze([]),
      archiveRoot: manifest.archiveRoot,
      blockingReason: "worker_process_failed",
      blockingReasonCarriers: Object.freeze([
        makeSdlcBlockingReason({
          code: "worker_process_failed",
          evidenceRefs: [
            pathToFileURL(join(manifest.archiveRoot, "worker_run.json")).href
          ]
        })
      ]),
      nextLawfulAction: "inspect_worker_archive",
      currentEdge: decision.edge
    });
    writeRunArchive({ manifest, outcome });
    return outcome;
  }

  let workerReport: SdlcWorkerResultReport;
  try {
    workerReport = readWorkerResultReport(manifest);
  } catch (error: unknown) {
    const rejectionPostflight = workerReportAdmissionPostflight({
      manifest,
      workerRun,
      reason: error instanceof Error ? error.message : "worker_report_rejected"
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
    const emitted = await appendPostflightFailureRuntimeEvents({
      workspaceRoot: input.workspaceRoot,
      basis,
      replayEvents: input.replayEvents,
      manifest,
      gapDossier
    });
    const outcome = terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "worker_report_rejected",
      start: input.start,
      transport,
      manifest,
      workerRun,
      workerReport: null,
      postflight: rejectionPostflight,
      gapDossier,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length + emitted.length,
      emittedRuntimeEventKinds: Object.freeze(emitted.map((event) => event.kind)),
      archiveRoot: manifest.archiveRoot,
      blockingReason: rejectionPostflight.blockingReasons.join(","),
      blockingReasonCarriers: rejectionPostflight.blockingReasonCarriers,
      nextLawfulAction:
        emitted.some((event) => event.kind === "retry_repair_planned")
          ? "retry_same_edge_with_gap_dossier"
          : "repair_worker_report",
      currentEdge: decision.edge
    });
    writeOperatorArchiveFile({
      archiveRoot: manifest.archiveRoot,
      relativePath: "runtime_events.json",
      payload: emitted
    });
    writeRunArchive({ manifest, outcome });
    return outcome;
  }

  writeProductMaterializationManifest({ manifest, report: workerReport });
  const postflight = evaluateWorkerResultPostflight({ manifest, report: workerReport });
  writeOperatorArchiveFile({
    archiveRoot: manifest.archiveRoot,
    relativePath: "postflight.json",
    payload: postflight
  });
  if (postflight.status !== "passed") {
    const gapDossier = constructPostflightGapDossier({
      manifest,
      postflight
    });
    writePostflightGapDossier({ manifest, gapDossier });
    const emitted = await appendPostflightFailureRuntimeEvents({
      workspaceRoot: input.workspaceRoot,
      basis,
      replayEvents: input.replayEvents,
      manifest,
      gapDossier
    });
    const outcome = terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "postflight_failed",
      start: input.start,
      transport,
      manifest,
      workerRun,
      workerReport,
      postflight,
      gapDossier,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length + emitted.length,
      emittedRuntimeEventKinds: Object.freeze(emitted.map((event) => event.kind)),
      archiveRoot: manifest.archiveRoot,
      blockingReason: postflight.blockingReasons.join(","),
      blockingReasonCarriers: postflight.blockingReasonCarriers,
      nextLawfulAction:
        emitted.some((event) => event.kind === "retry_repair_planned")
          ? "retry_same_edge_with_gap_dossier"
          : "triage_gap",
      currentEdge: decision.edge
    });
    writeOperatorArchiveFile({
      archiveRoot: manifest.archiveRoot,
      relativePath: "runtime_events.json",
      payload: emitted
    });
    writeRunArchive({ manifest, outcome });
    return outcome;
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
    const emitted = await appendPostflightFailureRuntimeEvents({
      workspaceRoot: input.workspaceRoot,
      basis,
      replayEvents: input.replayEvents,
      manifest,
      gapDossier
    });
    const outcome = terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "postflight_failed",
      start: input.start,
      transport,
      manifest,
      workerRun,
      workerReport,
      postflight: assuranceGate.blockingPostflight,
      assuranceSatisfaction: assuranceGate.satisfaction,
      gapDossier,
      hookOutcome: null,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length + emitted.length,
      emittedRuntimeEventKinds: Object.freeze(emitted.map((event) => event.kind)),
      archiveRoot: manifest.archiveRoot,
      blockingReason: assuranceGate.blockingPostflight.blockingReasons.join(","),
      blockingReasonCarriers:
        assuranceGate.blockingPostflight.blockingReasonCarriers,
      nextLawfulAction:
        assuranceGate.satisfaction.status === "reprice_required"
          ? "reprice_requirement_or_design"
          : "retry_same_edge_with_gap_dossier",
      currentEdge: decision.edge
    });
    writeOperatorArchiveFile({
      archiveRoot: manifest.archiveRoot,
      relativePath: "runtime_events.json",
      payload: emitted
    });
    writeRunArchive({ manifest, outcome });
    return outcome;
  }

  const constructorResult = constructorResultFromWorkerOutput({
    manifest,
    report: workerReport,
    operationType: defaultOperationForTarget(contract.targetAssetType)
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
              evidenceRefs: [pathToFileURL(join(manifest.archiveRoot, "hook_outcome.json")).href]
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
    writePostflightGapDossier({ manifest, gapDossier });
    const emitted = await appendPostflightFailureRuntimeEvents({
      workspaceRoot: input.workspaceRoot,
      basis,
      replayEvents: input.replayEvents,
      manifest,
      gapDossier
    });
    const outcome = terminalOutcome({
      workspaceRoot: input.workspaceRoot,
      status: "postflight_failed",
      start: input.start,
      transport,
      manifest,
      workerRun,
      workerReport,
      postflight: hookPostflight,
      assuranceSatisfaction: assuranceGate.satisfaction,
      gapDossier,
      hookOutcome,
      replayEventCountBefore: input.replayEvents.length,
      replayEventCountAfter: input.replayEvents.length + emitted.length,
      emittedRuntimeEventKinds: Object.freeze(emitted.map((event) => event.kind)),
      archiveRoot: manifest.archiveRoot,
      blockingReason:
        hookPostflight.blockingReasons.join(",") ?? "hook_postflight_missing",
      blockingReasonCarriers: hookPostflight.blockingReasonCarriers,
      nextLawfulAction: "retry_same_edge_with_gap_dossier",
      currentEdge: decision.edge
    });
    writeOperatorArchiveFile({
      archiveRoot: manifest.archiveRoot,
      relativePath: "runtime_events.json",
      payload: emitted
    });
    writeRunArchive({ manifest, outcome });
    return outcome;
  }

  const emitted = await appendAcceptedRuntimeEvents({
    workspaceRoot: input.workspaceRoot,
    basis,
    replayEvents: input.replayEvents,
    transition,
    manifest,
    transport,
    postflight
  });
  const afterEvents = Object.freeze([...input.replayEvents, ...emitted]);
  const afterProjection = deriveRuntimeAggregateProjection(basis, afterEvents);
  const nextVector =
    afterProjection.nextVectorIndex === null
      ? null
      : basis.graph.vectors[afterProjection.nextVectorIndex]?.name ?? null;
  const outcome = terminalOutcome({
    workspaceRoot: input.workspaceRoot,
    status: "worker_invoked",
    start: input.start,
    transport,
    manifest,
    workerRun,
    workerReport,
    postflight,
    assuranceSatisfaction: assuranceGate.satisfaction,
    gapDossier: null,
    hookOutcome,
    replayEventCountBefore: input.replayEvents.length,
    replayEventCountAfter: afterEvents.length,
    emittedRuntimeEventKinds: Object.freeze(emitted.map((event) => event.kind)),
    archiveRoot: manifest.archiveRoot,
    blockingReason: null,
    nextLawfulAction:
      afterProjection.nextVectorIndex === null
        ? "close_or_reprice"
        : "rerun_gaps_or_start_next_edge",
    currentEdge: nextVector
  });
  writeOperatorArchiveFile({
    archiveRoot: manifest.archiveRoot,
    relativePath: "constructor_result.json",
    payload: constructorResult
  });
  writeOperatorArchiveFile({
    archiveRoot: manifest.archiveRoot,
    relativePath: "runtime_events.json",
    payload: emitted
  });
  writeRunArchive({ manifest, outcome });
  writeOperatorArchiveFile({
    archiveRoot: manifest.archiveRoot,
    relativePath: "operator_summary.json",
    payload: outcome.summary
  });
  writeOperatorArchiveFile({
    archiveRoot: manifest.archiveRoot,
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
    archiveRoot: manifest.archiveRoot,
    relativePath: "run_compact.txt",
    payload: stableOperatorJson(outcome.summary)
  });
  return outcome;
}
