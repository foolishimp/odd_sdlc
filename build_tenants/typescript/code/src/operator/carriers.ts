// Implements: REQ-F-ODDSDLC-051
// Implements: REQ-F-ODDSDLC-052
// Implements: REQ-F-ODDSDLC-053
// Implements: REQ-F-ODDSDLC-054
// Implements: REQ-F-ODDSDLC-055
// Implements: REQ-F-ODDSDLC-059
// Implements: REQ-F-ODDSDLC-060

import type { RuntimeEvent } from "@abiogenesis/typescript-tenant";
import type { SdlcTraversalRequirementSatisfaction } from "../assurance/index.js";
import type {
  SdlcHookTransformProfile,
  SdlcHookTurnOutcome
} from "../hooks/index.js";
import type { SdlcPublicStartOutcome } from "../start/index.js";
import type { SdlcBlockingReason } from "../shared/blocking_reason.js";
import type { SdlcConformProjectProfile } from "../workspace/index.js";

export type SdlcInstalledOperatorStatus =
  | "blocked"
  | "converged"
  | "worker_invoked"
  | "worker_failed"
  | "worker_report_rejected"
  | "postflight_failed";

export interface SdlcOperatorSummary {
  readonly kind: "sdlc_operator_summary";
  readonly workspaceRoot: string;
  readonly graphFunctionName: string | null;
  readonly currentEdge: string | null;
  readonly status: SdlcInstalledOperatorStatus | "dispatch_required";
  readonly blockingReason: string | null;
  readonly blockingReasons: readonly SdlcBlockingReason[];
  readonly nextLawfulAction: string;
  readonly archiveRoot: string | null;
}

export interface SdlcWorkerTransportContract {
  readonly kind: "sdlc_worker_transport_contract";
  readonly raw: string;
  readonly scheme: "process";
  readonly agentKey: string;
  readonly command: string;
  readonly args: readonly string[];
  readonly workerId: string;
  readonly backendId: string;
}

export interface SdlcWorkerRunResult {
  readonly kind: "sdlc_worker_run_result";
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly status: number | null;
  readonly signal: string | null;
  readonly elapsedMs: number;
  readonly timedOut: boolean;
  readonly stdoutByteCount: number;
  readonly stderrByteCount: number;
  readonly stdoutPath: string;
  readonly stderrPath: string;
  readonly outputLastMessagePath: string | null;
  readonly error: string | null;
}

export interface SdlcWorkerProcessStartedContext {
  readonly kind: "sdlc_worker_process_started_context";
  readonly processStartedRef: string;
  readonly processEventsRef: string;
  readonly manifestRef: string;
  readonly promptRef: string;
  readonly reportRef: string;
  readonly outputRef: string;
  readonly stdoutRef: string;
  readonly stderrRef: string;
  readonly actorInvocationId: string;
  readonly edge: string;
  readonly vectorIndex: number;
  readonly pid: number | null;
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly timeoutMs: number;
  readonly inactivityTimeoutMs: number;
  readonly heartbeatMs: number;
}

export interface SdlcWorkerProcessSummary {
  readonly kind: "sdlc_worker_process_summary";
  readonly processStartedRef: string;
  readonly processEventsRef: string;
  readonly manifestRef: string;
  readonly promptRef: string;
  readonly reportRef: string;
  readonly outputRef: string;
  readonly stdoutRef: string;
  readonly stderrRef: string;
  readonly pid: number | null;
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly timeoutMs: number;
  readonly inactivityTimeoutMs: number;
  readonly heartbeatMs: number;
  readonly lastHeartbeatIndex: number | null;
  readonly lastHeartbeatElapsedMs: number | null;
  readonly signalSequence: readonly {
    readonly signal: string;
    readonly elapsedMs: number;
  }[];
  readonly status: number | null;
  readonly signal: string | null;
  readonly elapsedMs: number;
  readonly timedOut: boolean;
  readonly error: string | null;
}

export type SdlcMaterializedProductFileRole =
  | "source"
  | "test"
  | "build_config"
  | "documentation"
  | "other";

export interface SdlcProductMaterializationContract {
  readonly kind: "sdlc_product_materialization_contract";
  readonly required: boolean;
  readonly activeTenant: string;
  readonly selectedOutputRoot: string;
  readonly tenantRoot: string;
  readonly relativePathBasis: "tenant_root";
  readonly declaredModuleNames: readonly string[];
  readonly buildExecutionContract: string;
  readonly testExecutionContract: string;
  readonly manifestFile: string;
  readonly requiredRoles: readonly SdlcMaterializedProductFileRole[];
  readonly executionShards: readonly SdlcExecutionShard[];
}

export interface SdlcExecutionShard {
  readonly kind: "sdlc_execution_shard";
  readonly shardId: string;
  readonly lane: "test";
  readonly moduleName: string;
  readonly command: string;
  readonly workingDirectory: string;
  readonly timeoutMs: number;
  readonly inactivityTimeoutMs: number;
  readonly expectedReportRefs: readonly string[];
  readonly allowedByproductGlobs: readonly string[];
  readonly requiredEvidenceKind: "sdlc_worker_execution_evidence";
  readonly retryPolicy: "same_shard_then_triage";
}

export interface SdlcMaterializedProductFile {
  readonly kind: "sdlc_materialized_product_file";
  readonly role: SdlcMaterializedProductFileRole;
  readonly relativePath: string;
  readonly absolutePath: string;
  readonly digest: string;
  readonly byteCount: number;
}

export interface SdlcWorkerExecutionEvidence {
  readonly kind: "sdlc_worker_execution_evidence";
  readonly lane: "build" | "test";
  readonly command: string;
  readonly status: "succeeded" | "failed" | "pending";
  readonly reportRefs: readonly string[];
  readonly testsObserved: number | null;
  readonly passedCount: number | null;
  readonly failedCount: number | null;
  readonly shardEvidence: readonly SdlcWorkerExecutionShardEvidence[];
}

export interface SdlcWorkerExecutionShardEvidence {
  readonly kind: "sdlc_worker_execution_shard_evidence";
  readonly shardId: string;
  readonly moduleName: string;
  readonly lane: "test";
  readonly command: string;
  readonly status: "succeeded" | "failed" | "pending";
  readonly reportRefs: readonly string[];
  readonly testsObserved: number | null;
  readonly passedCount: number | null;
  readonly failedCount: number | null;
}

export type SdlcTraversalObligationKind =
  | "requirement"
  | "source_asset"
  | "target_asset"
  | "evaluator"
  | "design_or_module"
  | "prior_gap"
  | "runtime_context";

export interface SdlcTraversalObligation {
  readonly kind: "sdlc_traversal_obligation";
  readonly obligationId: string;
  readonly obligationKind: SdlcTraversalObligationKind;
  readonly summary: string;
  readonly evidenceRefs: readonly string[];
  readonly payload: SdlcTraversalObligationPayload;
}

export type SdlcTraversalObligationPayloadStatus =
  | "concrete"
  | "structural"
  | "reference_only";

export interface SdlcTraversalObligationPayload {
  readonly kind: "sdlc_traversal_obligation_payload";
  readonly status: SdlcTraversalObligationPayloadStatus;
  readonly sourceRefs: readonly string[];
  readonly sourceDigests: readonly string[];
  readonly sourceSnippets: readonly string[];
  readonly coverageExpectation: string;
}

export interface SdlcTraversalObligationDeltaSummary {
  readonly kind: "sdlc_traversal_obligation_delta_summary";
  readonly obligationCount: number;
  readonly requirementCount: number;
  readonly priorGapCount: number;
  readonly authorityRefCount: number;
}

export type SdlcAuthorityIndexCategory =
  | "intent"
  | "product"
  | "goals"
  | "requirements"
  | "design"
  | "modules"
  | "context"
  | "runtime"
  | "other";

export interface SdlcAuthorityIndexEntry {
  readonly kind: "sdlc_authority_index_entry";
  readonly key: string;
  readonly ref: string;
  readonly category: SdlcAuthorityIndexCategory;
  readonly title: string;
  readonly digest: string;
  readonly tags: readonly string[];
}

export interface SdlcRetrievalHint {
  readonly kind: "sdlc_retrieval_hint";
  readonly key: string;
  readonly ref: string;
  readonly reason: string;
  readonly obligationIds: readonly string[];
}

export interface SdlcTraversalObligationContext {
  readonly kind: "sdlc_traversal_obligation_context";
  readonly requiredSourceAssetTypes: readonly string[];
  readonly targetAssetType: string;
  readonly obligations: readonly SdlcTraversalObligation[];
  readonly authorityRefs: readonly string[];
  readonly authorityIndex: readonly SdlcAuthorityIndexEntry[];
  readonly trancheKeys: readonly string[];
  readonly retrievalHints: readonly SdlcRetrievalHint[];
  readonly runtimeContextRefs: readonly string[];
  readonly priorEdgeRefs: readonly string[];
  readonly deltaSummary: SdlcTraversalObligationDeltaSummary;
}

export type SdlcWorkerObligationFulfillmentStatus =
  | "fulfilled"
  | "partial"
  | "blocked"
  | "unassessed";

export interface SdlcWorkerObligationAssessment {
  readonly kind: "sdlc_worker_obligation_assessment";
  readonly obligationId: string;
  readonly fulfillmentStatus: SdlcWorkerObligationFulfillmentStatus;
  readonly evidenceRefs: readonly string[];
  readonly blockingReasons: readonly string[];
}

export type SdlcPostflightGapReasonClass =
  | "contract_violation"
  | "authority_to_code"
  | "code_to_test"
  | "missing_evidence"
  | "worker_unresolved"
  | "topology"
  | "target_resolution"
  | "worker_runtime"
  | "runtime_policy"
  | "install"
  | "assurance"
  | "unknown";

export interface SdlcPostflightGapReason {
  readonly kind: "sdlc_postflight_gap_reason";
  readonly reason: string;
  readonly reasonClass: SdlcPostflightGapReasonClass;
  readonly blockingReason: SdlcBlockingReason;
}

export interface SdlcPostflightGapDossier {
  readonly kind: "sdlc_postflight_gap_dossier";
  readonly status: "open";
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly targetAssetType: string;
  readonly reasons: readonly SdlcPostflightGapReason[];
  readonly evidenceRefs: readonly string[];
  readonly priorManifestId: string;
  readonly currentGapDossierRef: string;
  readonly retryEligible: boolean;
  readonly nextLawfulActions: readonly (
    | "retry_same_edge"
    | "repair_worker_output"
    | "triage_gap"
    | "reprice_requirement_or_design"
  )[];
}

export interface SdlcWorkerRetryContext {
  readonly kind: "sdlc_worker_retry_context";
  readonly retryAttemptRefs: readonly {
    readonly vectorIndex: number;
    readonly retryRunId: string;
    readonly retryCallId: string;
    readonly manifestId: string;
    readonly priorManifestId: string;
    readonly attemptIndex: number;
    readonly sourceProjectionRef: string;
  }[];
  readonly priorGapDossiers: readonly SdlcPostflightGapDossier[];
}

export interface SdlcTraversalIntentPackage {
  readonly kind: "sdlc_traversal_intent_package";
  readonly packageVersion: "ts-intent-v1";
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly sourceAssetTypes: readonly string[];
  readonly targetAssetType: string;
  readonly methodRefs: readonly string[];
  readonly authorityRefs: readonly string[];
  readonly runtimeContextRefs: readonly string[];
  readonly priorEdgeRefs: readonly string[];
  readonly retryAttemptRefs: readonly string[];
  readonly priorGapDossierRefs: readonly string[];
  readonly obligationIds: readonly string[];
  readonly obligationDeltaSummary: SdlcTraversalObligationDeltaSummary;
  readonly productMaterialization: SdlcProductMaterializationContract;
  readonly resultReportSchema: readonly string[];
  readonly evaluatorExpectations: SdlcHookTransformProfile;
  readonly outputFile: string;
  readonly reportFile: string;
  readonly packageDigest: string;
}

export interface SdlcWorkerHandoffManifest {
  readonly kind: "sdlc_worker_handoff_manifest";
  readonly contractVersion: "ts-operator-v1";
  readonly workspaceRoot: string;
  readonly archiveRoot: string;
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly inputAssetTypes: readonly string[];
  readonly targetAssetType: string;
  readonly outputFile: string;
  readonly reportFile: string;
  readonly allowedWriteRoots: readonly string[];
  readonly conformedProject: SdlcConformProjectProfile;
  readonly productMaterialization: SdlcProductMaterializationContract;
  readonly traversalObligationContext: SdlcTraversalObligationContext;
  readonly traversalIntentPackage: SdlcTraversalIntentPackage;
  readonly retryContext: SdlcWorkerRetryContext;
  readonly methodRefs: readonly string[];
  readonly resultReportSchema: readonly string[];
}

export interface SdlcWorkerResultReport {
  readonly kind: "odd_sdlc.worker_result_report";
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly targetAssetType: string;
  readonly outputFile: string;
  readonly digest: string;
  readonly summary: string;
  readonly unresolvedReasons: readonly string[];
  readonly materializedFiles: readonly SdlcMaterializedProductFile[];
  readonly executionEvidence: SdlcWorkerExecutionEvidence | null;
  readonly executionEvidenceErrors: readonly string[];
  readonly obligationAssessments: readonly SdlcWorkerObligationAssessment[];
}

export interface SdlcPostflightResult {
  readonly kind: "sdlc_operator_postflight_result";
  readonly status: "passed" | "blocked";
  readonly blockingReasons: readonly string[];
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcInstalledOperatorStartOutcome {
  readonly kind: "sdlc_installed_operator_start_outcome";
  readonly status: SdlcInstalledOperatorStatus;
  readonly summary: SdlcOperatorSummary;
  readonly start: SdlcPublicStartOutcome;
  readonly transport: SdlcWorkerTransportContract | null;
  readonly manifest: SdlcWorkerHandoffManifest | null;
  readonly workerRun: SdlcWorkerRunResult | null;
  readonly workerReport: SdlcWorkerResultReport | null;
  readonly postflight: SdlcPostflightResult | null;
  readonly assuranceSatisfaction: SdlcTraversalRequirementSatisfaction | null;
  readonly gapDossier: SdlcPostflightGapDossier | null;
  readonly hookOutcome: SdlcHookTurnOutcome | null;
  readonly replayEventCountBefore: number;
  readonly replayEventCountAfter: number;
  readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
  readonly eventLogPath: string;
  readonly archiveRoot: string | null;
}
