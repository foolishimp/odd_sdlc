// Implements: T-161

import path from "node:path";

import {
  fileSizeOrZero,
  loadJsonFile,
  loadJsonlFile,
  type LoadedJson,
  type LoadedJsonl
} from "./archive_reader.js";

export interface OperatorSummaryRecord {
  readonly kind: "sdlc_operator_summary";
  readonly graphFunctionName?: string;
  readonly currentEdge?: string;
  readonly status?: string;
  readonly blockingReason?: string | null;
  readonly nextLawfulAction?: string;
  readonly archiveRoot?: string;
}

export interface WorkerRunRecord {
  readonly kind: "sdlc_worker_run_result";
  readonly elapsedMs?: number;
  readonly stdoutByteCount?: number;
  readonly stderrByteCount?: number;
  readonly status?: number;
  readonly signal?: string | null;
  readonly timedOut?: boolean;
  readonly toolCallCount?: number;
}

export interface PostflightRecord {
  readonly kind: "sdlc_operator_postflight_result";
  readonly status?: string;
  readonly blockingReasons?: readonly unknown[];
  readonly blockingReasonCarriers?: readonly unknown[];
  readonly evidenceRefs?: readonly string[];
}

export interface EdgeClosureDecisionRecord {
  readonly kind: "sdlc_edge_closure_decision";
  readonly disposition?: string;
  readonly decisionRef?: string;
  readonly ledgerRef?: string;
  readonly basisRefs?: readonly string[];
}

export interface EdgeFulfillmentLedgerRecord {
  readonly kind: "sdlc_edge_fulfillment_ledger";
  readonly edgeRef?: string;
  readonly attemptRef?: string;
  readonly counts?: {
    readonly expected?: number;
    readonly fulfilled?: number;
    readonly partial?: number;
    readonly blocked?: number;
    readonly unfulfilled?: number;
    readonly missing?: number;
    readonly extra?: number;
  };
  readonly targetCarrierAdmissionStatus?: string;
  readonly targetCarrierAdmissionRef?: string | null;
  readonly edgeResidualPressureRefs?: readonly string[];
}

export interface EdgeGainRecord {
  readonly kind: "sdlc_edge_gain";
  readonly residualPressureRefs?: readonly string[];
  readonly evidenceRefs?: readonly string[];
}

export interface NextActionProjectionRecord {
  readonly kind: "sdlc_next_action_projection";
  readonly choosesNextTraversal?: boolean;
  readonly nextActionProjectionRef?: string;
  readonly selectedActionRef?: string;
  readonly nextGraphFunctionRef?: string;
  readonly nextGraphVectorRef?: string;
  readonly predecessorRefs?: readonly string[];
  readonly overlayRef?: string | null;
}

export interface ProductMaterializationFileRecord {
  readonly kind: "sdlc_materialized_product_file";
  readonly role?: string;
  readonly relativePath?: string;
  readonly absolutePath?: string;
  readonly digest?: string;
  readonly byteCount?: number;
  readonly materializationSource?: string;
  readonly requirementTraceObligationIds?: readonly string[];
}

export interface ProductMaterializationManifestRecord {
  readonly kind: "sdlc_product_materialization_manifest";
  readonly contract?: {
    readonly required?: boolean;
    readonly tenantRoot?: string;
    readonly requiredRoles?: readonly string[];
  };
  readonly files?: readonly ProductMaterializationFileRecord[];
}

export interface HandoffManifestRecord {
  readonly kind: "sdlc_worker_handoff_manifest";
  readonly graphFunctionName?: string;
  readonly edgeName?: string;
  readonly vectorIndex?: number;
  readonly targetAssetType?: string;
  readonly inputAssetTypes?: readonly string[];
}

export interface FpEvaluateResultRecord {
  readonly kind: "sdlc_fp_evaluate_result";
  readonly status?: string;
  readonly postflightStatus?: string;
  readonly blockingReasons?: readonly unknown[];
  readonly evidenceRefs?: readonly string[];
}

export interface WorkerProcessStartedRecord {
  readonly kind: "actor_process_started";
  readonly pid?: number;
  readonly observedAtMs?: number | null;
}

export interface WorkerProcessEventRecord {
  readonly kind: string;
  readonly observedAtMs?: number | null;
  readonly elapsedMs?: number | null;
  readonly pid?: number | null;
  readonly heartbeatIndex?: number | null;
  readonly status?: number | null;
  readonly signal?: string | null;
}

export interface RuntimeEventsArchiveRecord {
  readonly kind: "sdlc_runtime_event_archive_projection";
  readonly archiveVersion?: string;
  readonly eventCount?: number;
  readonly eventKinds?: readonly string[];
  readonly events?: readonly unknown[];
}

export interface RunPerformanceSummaryRecord {
  readonly kind: "sdlc_run_performance_summary" | "sdlc_edge_performance_summary";
  readonly fields?: Readonly<Record<string, unknown>>;
}

export interface WorkerResultReportRecord {
  readonly kind: "odd_sdlc.worker_result_report";
  readonly outputFile?: string;
  readonly obligationAssessments?: readonly unknown[];
  readonly unresolvedReasons?: readonly unknown[];
  readonly executionEvidence?: {
    readonly status?: string;
    readonly reportRefs?: readonly string[];
    readonly testsObserved?: number | null;
    readonly passedCount?: number | null;
    readonly failedCount?: number | null;
  } | null;
}

export interface WorkerConstructionBriefRecord {
  readonly kind: "sdlc_worker_construction_brief";
  readonly canonicalPromptCarrierPath?: string;
  readonly promptSourcePolicyRef?: string;
  readonly packageDigest?: string;
  readonly packageDispositions?: readonly {
    readonly packageName?: string;
    readonly path?: string;
    readonly digest?: string;
    readonly disposition?: string;
  }[];
}

export interface OperatorRunCarriers {
  readonly operatorRunRoot: string;
  readonly operatorSummary: LoadedJson<OperatorSummaryRecord>;
  readonly workerRun: LoadedJson<WorkerRunRecord>;
  readonly postflight: LoadedJson<PostflightRecord>;
  readonly edgeClosure: LoadedJson<EdgeClosureDecisionRecord>;
  readonly edgeFulfillmentLedger: LoadedJson<EdgeFulfillmentLedgerRecord>;
  readonly edgeGain: LoadedJson<EdgeGainRecord>;
  readonly nextActionProjection: LoadedJson<NextActionProjectionRecord>;
  readonly productManifest: LoadedJson<ProductMaterializationManifestRecord>;
  readonly handoffManifest: LoadedJson<HandoffManifestRecord>;
  readonly fpEvaluateResult: LoadedJson<FpEvaluateResultRecord>;
  readonly workerProcessStarted: LoadedJson<WorkerProcessStartedRecord>;
  readonly workerProcessEvents: LoadedJsonl<WorkerProcessEventRecord>;
  readonly runtimeEvents: LoadedJson<RuntimeEventsArchiveRecord>;
  readonly workerResultReport: LoadedJson<WorkerResultReportRecord>;
  readonly workerConstructionBrief: LoadedJson<WorkerConstructionBriefRecord>;
  readonly runPerformanceSummary: LoadedJson<RunPerformanceSummaryRecord>;
  readonly edgePerformanceSummary: LoadedJson<RunPerformanceSummaryRecord>;
  readonly fileSizes: OperatorRunFileSizes;
}

export interface OperatorRunFileSizes {
  readonly handoffManifest: number;
  readonly traversalIntentPackage: number;
  readonly workerInvocationPackage: number;
  readonly workerPrompt: number;
  readonly workerStdout: number;
  readonly workerStderr: number;
  readonly workerProcessEvents: number;
  readonly runtimeEvents: number;
  readonly workerResultReport: number;
  readonly workerConstructionBrief: number;
  readonly productMaterializationManifest: number;
  readonly fpTransformRequest: number;
  readonly fpTransformResult: number;
  readonly assuranceLedgers: number;
  readonly hookOutcome: number;
  readonly postTransformObservation: number;
  readonly sdlcWorksiteEvidence: number;
  readonly sdlcEdgeClosureDecision: number;
  readonly sdlcEdgeFulfillmentLedger: number;
  readonly sdlcEdgeGain: number;
  readonly sdlcEdgeResidualPressure: number;
  readonly sdlcNextActionProjection: number;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function recordHasKind(value: unknown, expected: string): boolean {
  return isRecord(value) && value["kind"] === expected;
}

function guardKind<T extends { readonly kind: string }>(
  expected: T["kind"]
): (value: unknown) => value is T {
  return (value: unknown): value is T => recordHasKind(value, expected);
}

function guardKinds<T extends { readonly kind: string }>(
  expectedKinds: readonly T["kind"][]
): (value: unknown) => value is T {
  const set = new Set<string>(expectedKinds);
  return (value: unknown): value is T =>
    isRecord(value) &&
    typeof value["kind"] === "string" &&
    set.has(value["kind"]);
}

function guardJsonlEvent(value: unknown): value is WorkerProcessEventRecord {
  return isRecord(value) && typeof value["kind"] === "string";
}

const PRODUCT_MANIFEST_GUARD: (value: unknown) => value is ProductMaterializationManifestRecord =
  guardKind<ProductMaterializationManifestRecord>("sdlc_product_materialization_manifest");

const HANDOFF_MANIFEST_GUARD: (value: unknown) => value is HandoffManifestRecord =
  guardKind<HandoffManifestRecord>("sdlc_worker_handoff_manifest");

const OPERATOR_SUMMARY_GUARD: (value: unknown) => value is OperatorSummaryRecord =
  guardKind<OperatorSummaryRecord>("sdlc_operator_summary");

const WORKER_RUN_GUARD: (value: unknown) => value is WorkerRunRecord =
  guardKind<WorkerRunRecord>("sdlc_worker_run_result");

const POSTFLIGHT_GUARD: (value: unknown) => value is PostflightRecord =
  guardKind<PostflightRecord>("sdlc_operator_postflight_result");

const EDGE_CLOSURE_GUARD: (value: unknown) => value is EdgeClosureDecisionRecord =
  guardKind<EdgeClosureDecisionRecord>("sdlc_edge_closure_decision");

const EDGE_FULFILLMENT_GUARD: (value: unknown) => value is EdgeFulfillmentLedgerRecord =
  guardKind<EdgeFulfillmentLedgerRecord>("sdlc_edge_fulfillment_ledger");

const EDGE_GAIN_GUARD: (value: unknown) => value is EdgeGainRecord =
  guardKind<EdgeGainRecord>("sdlc_edge_gain");

const NEXT_ACTION_GUARD: (value: unknown) => value is NextActionProjectionRecord =
  guardKind<NextActionProjectionRecord>("sdlc_next_action_projection");

const FP_EVALUATE_GUARD: (value: unknown) => value is FpEvaluateResultRecord =
  guardKind<FpEvaluateResultRecord>("sdlc_fp_evaluate_result");

const WORKER_PROCESS_STARTED_GUARD: (value: unknown) => value is WorkerProcessStartedRecord =
  guardKind<WorkerProcessStartedRecord>("actor_process_started");

const RUNTIME_EVENTS_GUARD: (value: unknown) => value is RuntimeEventsArchiveRecord =
  guardKind<RuntimeEventsArchiveRecord>("sdlc_runtime_event_archive_projection");

const WORKER_RESULT_REPORT_GUARD: (value: unknown) => value is WorkerResultReportRecord =
  guardKind<WorkerResultReportRecord>("odd_sdlc.worker_result_report");

const WORKER_CONSTRUCTION_BRIEF_GUARD: (value: unknown) => value is WorkerConstructionBriefRecord =
  guardKind<WorkerConstructionBriefRecord>("sdlc_worker_construction_brief");

const PERF_SUMMARY_GUARD: (value: unknown) => value is RunPerformanceSummaryRecord =
  guardKinds<RunPerformanceSummaryRecord>([
    "sdlc_run_performance_summary",
    "sdlc_edge_performance_summary"
  ]);

export function readOperatorRunCarriers(operatorRunRoot: string): OperatorRunCarriers {
  const sizeOf = (relative: string): number =>
    fileSizeOrZero(path.join(operatorRunRoot, relative));
  const fileSizes: OperatorRunFileSizes = Object.freeze({
    handoffManifest: sizeOf("handoff_manifest.json"),
    traversalIntentPackage: sizeOf("traversal_intent_package.json"),
    workerInvocationPackage: sizeOf("worker_invocation_package.json"),
    workerPrompt: sizeOf("worker_prompt.md"),
    workerStdout: sizeOf("worker_stdout.log"),
    workerStderr: sizeOf("worker_stderr.log"),
    workerProcessEvents: sizeOf("worker_process_events.jsonl"),
    runtimeEvents: sizeOf("runtime_events.json"),
    workerResultReport: sizeOf("worker_result_report.json"),
    workerConstructionBrief: sizeOf("worker_construction_brief.json"),
    productMaterializationManifest: sizeOf("product_materialization_manifest.json"),
    fpTransformRequest: sizeOf("fp_transform_request.json"),
    fpTransformResult: sizeOf("fp_transform_result.json"),
    assuranceLedgers: sizeOf("assurance_ledgers.json"),
    hookOutcome: sizeOf("hook_outcome.json"),
    postTransformObservation: sizeOf("post_transform_observation.json"),
    sdlcWorksiteEvidence: sizeOf("sdlc_worksite_evidence.json"),
    sdlcEdgeClosureDecision: sizeOf("sdlc_edge_closure_decision.json"),
    sdlcEdgeFulfillmentLedger: sizeOf("sdlc_edge_fulfillment_ledger.json"),
    sdlcEdgeGain: sizeOf("sdlc_edge_gain.json"),
    sdlcEdgeResidualPressure: sizeOf("sdlc_edge_residual_pressure.json"),
    sdlcNextActionProjection: sizeOf("sdlc_next_action_projection.json")
  });
  return Object.freeze({
    operatorRunRoot,
    operatorSummary: loadJsonFile<OperatorSummaryRecord>(
      path.join(operatorRunRoot, "operator_summary.json"),
      OPERATOR_SUMMARY_GUARD
    ),
    workerRun: loadJsonFile<WorkerRunRecord>(
      path.join(operatorRunRoot, "worker_run.json"),
      WORKER_RUN_GUARD
    ),
    postflight: loadJsonFile<PostflightRecord>(
      path.join(operatorRunRoot, "postflight.json"),
      POSTFLIGHT_GUARD
    ),
    edgeClosure: loadJsonFile<EdgeClosureDecisionRecord>(
      path.join(operatorRunRoot, "sdlc_edge_closure_decision.json"),
      EDGE_CLOSURE_GUARD
    ),
    edgeFulfillmentLedger: loadJsonFile<EdgeFulfillmentLedgerRecord>(
      path.join(operatorRunRoot, "sdlc_edge_fulfillment_ledger.json"),
      EDGE_FULFILLMENT_GUARD
    ),
    edgeGain: loadJsonFile<EdgeGainRecord>(
      path.join(operatorRunRoot, "sdlc_edge_gain.json"),
      EDGE_GAIN_GUARD
    ),
    nextActionProjection: loadJsonFile<NextActionProjectionRecord>(
      path.join(operatorRunRoot, "sdlc_next_action_projection.json"),
      NEXT_ACTION_GUARD
    ),
    productManifest: loadJsonFile<ProductMaterializationManifestRecord>(
      path.join(operatorRunRoot, "product_materialization_manifest.json"),
      PRODUCT_MANIFEST_GUARD
    ),
    handoffManifest: loadJsonFile<HandoffManifestRecord>(
      path.join(operatorRunRoot, "handoff_manifest.json"),
      HANDOFF_MANIFEST_GUARD
    ),
    fpEvaluateResult: loadJsonFile<FpEvaluateResultRecord>(
      path.join(operatorRunRoot, "fp_evaluate_result.json"),
      FP_EVALUATE_GUARD
    ),
    workerProcessStarted: loadJsonFile<WorkerProcessStartedRecord>(
      path.join(operatorRunRoot, "worker_process_started.json"),
      WORKER_PROCESS_STARTED_GUARD
    ),
    workerProcessEvents: loadJsonlFile<WorkerProcessEventRecord>(
      path.join(operatorRunRoot, "worker_process_events.jsonl"),
      guardJsonlEvent
    ),
    runtimeEvents: loadJsonFile<RuntimeEventsArchiveRecord>(
      path.join(operatorRunRoot, "runtime_events.json"),
      RUNTIME_EVENTS_GUARD
    ),
    workerResultReport: loadJsonFile<WorkerResultReportRecord>(
      path.join(operatorRunRoot, "worker_result_report.json"),
      WORKER_RESULT_REPORT_GUARD
    ),
    workerConstructionBrief: loadJsonFile<WorkerConstructionBriefRecord>(
      path.join(operatorRunRoot, "worker_construction_brief.json"),
      WORKER_CONSTRUCTION_BRIEF_GUARD
    ),
    runPerformanceSummary: loadJsonFile<RunPerformanceSummaryRecord>(
      path.join(operatorRunRoot, "run_performance_summary.json"),
      PERF_SUMMARY_GUARD
    ),
    edgePerformanceSummary: loadJsonFile<RunPerformanceSummaryRecord>(
      path.join(operatorRunRoot, "edge_performance_summary.json"),
      PERF_SUMMARY_GUARD
    ),
    fileSizes
  });
}
