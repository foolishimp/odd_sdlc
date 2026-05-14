// Implements: REQ-F-ODDSDLC-051
// Implements: REQ-F-ODDSDLC-052
// Implements: REQ-F-ODDSDLC-053
// Implements: REQ-F-ODDSDLC-054
// Implements: REQ-F-ODDSDLC-055
// Implements: REQ-F-ODDSDLC-059
// Implements: REQ-F-ODDSDLC-060
// Implements: REQ-F-ODDSDLC-063
// Implements: REQ-F-ODDSDLC-065

import type {
  FpTransformRequest,
  FpTransformResult,
  RuntimeEvent,
  TracedProcessExecutorProfile,
  TracedProcessOutcome,
  TracedProcessStreamModel,
  TraversalAttemptEnvelope
} from "@abiogenesis/typescript-tenant";
import type { SdlcTraversalRequirementSatisfaction } from "../assurance/index.js";
import type {
  SdlcHookTransformProfile,
  SdlcHookTurnOutcome
} from "../hooks/index.js";
import type { SdlcPublicStartOutcome } from "../start/index.js";
import type {
  SdlcBlockingReason,
  SdlcBlockingReasonCode
} from "../shared/blocking_reason.js";
import type { SdlcConformProjectProfile } from "../workspace/index.js";
import type { SdlcOverlayBinding } from "../graph/index.js";
import type {
  SdlcConstructionIntent,
  SdlcEdgeClosureDecision,
  SdlcEdgeFulfillmentLedger,
  SdlcNextActionProjection,
  SdlcOverlaySegmentCompletion,
  SdlcWorksiteEvidence
} from "./traversal_consequence.js";
import type {
  SdlcEdgeGain,
  SdlcEdgeResidualPressure
} from "./edge_gain_closure.js";

export type SdlcInstalledOperatorStatus =
  | "blocked"
  | "converged"
  | "fp_escalation"
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

export interface SdlcInstalledOperatorStartLoopAttempt {
  readonly kind: "sdlc_installed_operator_start_loop_attempt";
  readonly attemptIndex: number;
  readonly status: SdlcInstalledOperatorStatus;
  readonly currentEdge: string | null;
  readonly closureDisposition: string | null;
  readonly reentryBasisRef: string | null;
  readonly blockingReason: string | null;
  readonly nextLawfulAction: string;
  readonly archiveRoot: string | null;
  readonly retryEligible: boolean;
  readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
}

export interface SdlcInstalledOperatorStartLoop {
  readonly kind: "sdlc_installed_operator_start_loop";
  readonly requestedUntil: string;
  readonly maxAttempts: number;
  readonly attemptCount: number;
  readonly terminalReason:
    | "first_traversal_closed"
    | "converged"
    | "blocked"
    | "retry_not_planned"
    | "retry_guard_exhausted"
    | "yield_guard_exhausted"
    | "reentry_guard_exhausted";
  readonly exhaustedDisposition: "retry" | "yield" | "other" | null;
  readonly attempts: readonly SdlcInstalledOperatorStartLoopAttempt[];
}

export interface SdlcInstalledOperatorTraversalConsequence {
  readonly kind: "sdlc_installed_operator_traversal_consequence";
  readonly constructionIntent: SdlcConstructionIntent;
  readonly worksiteEvidence: SdlcWorksiteEvidence;
  readonly edgeGain?: SdlcEdgeGain;
  readonly edgeResidualPressure?: SdlcEdgeResidualPressure;
  readonly edgeFulfillmentLedger: SdlcEdgeFulfillmentLedger;
  readonly edgeClosureDecision: SdlcEdgeClosureDecision;
  readonly overlaySegmentCompletion: SdlcOverlaySegmentCompletion | null;
  readonly postActionOverlayBinding: SdlcOverlayBinding;
  readonly nextActionProjection: SdlcNextActionProjection;
}

export interface SdlcWorkerTransportContract {
  readonly kind: "sdlc_worker_transport_contract";
  readonly raw: string;
  readonly scheme: "process";
  readonly agentKey: string;
  readonly command: string;
  readonly args: readonly string[];
  readonly model: string | null;
  readonly effort: "low" | "medium" | "high" | "xhigh" | "max" | null;
  readonly workerId: string;
  readonly backendId: string;
}

export interface SdlcWorkerRunResult {
  readonly kind: "sdlc_worker_run_result";
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly executorProfile?: TracedProcessExecutorProfile;
  readonly terminalSessionId?: string | null;
  readonly streamModel?: TracedProcessStreamModel;
  readonly outcome?: TracedProcessOutcome;
  readonly traceRoot?: string;
  readonly traceResultRef?: string;
  readonly structuredEventCount?: number | null;
  readonly structuredParseFailureCount?: number | null;
  readonly apiRetryCount?: number | null;
  readonly toolCallCount?: number | null;
  readonly finalOutputRef?: string | null;
  readonly terminalTranscriptRef?: string | null;
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
  readonly executorProfile?: TracedProcessExecutorProfile;
  readonly terminalSessionId?: string | null;
  readonly streamModel?: TracedProcessStreamModel;
  readonly outcome?: TracedProcessOutcome;
  readonly traceRoot?: string;
  readonly traceResultRef?: string;
  readonly structuredEventCount?: number | null;
  readonly structuredParseFailureCount?: number | null;
  readonly apiRetryCount?: number | null;
  readonly toolCallCount?: number | null;
  readonly finalOutputRef?: string | null;
  readonly terminalTranscriptRef?: string | null;
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
  readonly executorProfile?: TracedProcessExecutorProfile;
  readonly terminalSessionId?: string | null;
  readonly streamModel?: TracedProcessStreamModel;
  readonly outcome?: TracedProcessOutcome;
  readonly traceRoot?: string;
  readonly traceResultRef?: string;
  readonly structuredEventCount?: number | null;
  readonly structuredParseFailureCount?: number | null;
  readonly apiRetryCount?: number | null;
  readonly toolCallCount?: number | null;
  readonly finalOutputRef?: string | null;
  readonly terminalTranscriptRef?: string | null;
  readonly timeoutMs: number;
  readonly inactivityTimeoutMs: number;
  readonly heartbeatMs: number;
  readonly runtimeLivenessAuthority: "abiogenesis_runtime_liveness_observer_projection";
  readonly runtimeLivenessProjectionRef: string;
  readonly runtimeLivenessPolicyRef: string;
  readonly runtimeLivenessLeaseState: string;
  readonly runtimeLivenessDispositionAction: string;
  readonly runtimeLivenessDispositionReason: string;
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
  | "design"
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

export interface SdlcBaseMaterializedProductFile {
  readonly kind: "sdlc_materialized_product_file";
  readonly role: SdlcMaterializedProductFileRole;
  readonly relativePath: string;
  readonly absolutePath: string;
  readonly digest: string;
  readonly byteCount: number;
  readonly requirementTraceObligationIds?: readonly string[] | undefined;
}

export interface SdlcCurrentAttemptMaterializedProductFile
  extends SdlcBaseMaterializedProductFile {
  readonly materializationSource: "current_attempt";
  readonly sourceManifestRef?: string | undefined;
  readonly sourceHandoffManifestRef?: string | undefined;
  readonly sourceAttemptRef?: string | undefined;
  readonly overwritesMaterializationRef?: string | undefined;
  readonly rolePolicyRef?: string | undefined;
}

export interface SdlcReplayedMaterializedProductFile
  extends SdlcBaseMaterializedProductFile {
  readonly materializationSource: "replay";
  readonly sourceManifestRef: string;
  readonly sourceHandoffManifestRef: string;
  readonly sourceAttemptRef: string;
  readonly rolePolicyRef?: string | undefined;
}

export type SdlcMaterializedProductFile =
  | SdlcCurrentAttemptMaterializedProductFile
  | SdlcReplayedMaterializedProductFile;

export const SDLC_COMPONENT_CONCERN_ROLES = Object.freeze([
  "parser",
  "validator",
  "mapper",
  "error_model",
  "io_adapter",
  "reporting",
  "domain_model",
  "other"
] as const);

export type SdlcComponentConcernRole =
  (typeof SDLC_COMPONENT_CONCERN_ROLES)[number];

export interface SdlcComponentTopologyRow {
  readonly kind: "sdlc_component_topology_row";
  readonly componentId: string;
  readonly moduleName: string;
  readonly relativePath: string;
  readonly publicBoundary: string;
  readonly concernRole: SdlcComponentConcernRole;
  readonly requirementIds: readonly string[];
  readonly sourceAssetRefs: readonly string[];
}

export interface SdlcComponentRealizationRow {
  readonly kind: "sdlc_component_realization_row";
  readonly componentId: string;
  readonly moduleName: string;
  readonly relativePath: string;
  readonly publicBoundary: string;
  readonly trancheId: string | null;
  readonly firstProductFileToChange: string | null;
  readonly upstreamComponentIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly sourceAssetRefs: readonly string[];
}

export interface SdlcTestComponentTopologyRow {
  readonly kind: "sdlc_test_component_topology_row";
  readonly testClassId: string;
  readonly relativePath: string;
  readonly testcaseIds: readonly string[];
  readonly componentIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly shardId: string | null;
}

export interface SdlcComponentTestRealizationRow {
  readonly kind: "sdlc_component_test_realization_row";
  readonly testClassId: string;
  readonly relativePath: string;
  readonly testcaseIds: readonly string[];
  readonly componentIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly shardId: string | null;
}

export type SdlcComponentTestExecutionStatus =
  | "passed"
  | "failed"
  | "blocked"
  | "pending"
  | "unproven";

export interface SdlcComponentTestQualificationRow {
  readonly kind: "sdlc_component_test_qualification_row";
  readonly testClassId: string;
  readonly testcaseIds: readonly string[];
  readonly componentIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly status: SdlcComponentTestExecutionStatus;
  readonly evidenceRefs: readonly string[];
}

export const SDLC_COMPONENT_EXECUTION_FAILURE_KINDS = Object.freeze([
  "execution_evidence_missing",
  "execution_carrier_invalid",
  "execution_command_mismatch",
  "execution_shard_mismatch",
  "zero_tests_observed",
  "source_compile_error",
  "test_compile_error",
  "assertion_failure",
  "testcase_authority_contradiction",
  "runtime_exception",
  "worker_timeout_or_lost_terminal",
  "network_or_transport_failure",
  "triage_gap"
] as const);

export type SdlcComponentExecutionFailureKind =
  (typeof SDLC_COMPONENT_EXECUTION_FAILURE_KINDS)[number];

export const SDLC_COMPONENT_REPAIR_TARGETS = Object.freeze([
  "component_code",
  "component_test",
  "test_schedule",
  "test_execution_surface",
  "implementation_design",
  "testcase_authority",
  "requirement_reprice",
  "worker_archive",
  "transport_retry"
] as const);

export type SdlcComponentRepairTarget =
  (typeof SDLC_COMPONENT_REPAIR_TARGETS)[number];

export const SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE = Object.freeze([
  "high",
  "medium",
  "low"
] as const);

export type SdlcComponentAttributionConfidence =
  (typeof SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE)[number];

export interface SdlcComponentExecutionFailureRow {
  readonly kind: "sdlc_component_execution_failure_row";
  readonly failureId: string;
  readonly shardId: string;
  readonly moduleName: string;
  readonly testClassId: string;
  readonly testcaseIds: readonly string[];
  readonly componentIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly failureKind: SdlcComponentExecutionFailureKind;
  readonly repairTarget: SdlcComponentRepairTarget;
  readonly lawfulReentryPoint: string;
  readonly attributionConfidence: SdlcComponentAttributionConfidence;
  readonly sourceRefs: readonly string[];
  readonly testRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcComponentExecutionFailureRegister {
  readonly kind: "component_execution_failure_register";
  readonly registerVersion: "ts-component-depth-v1";
  readonly failureRows: readonly SdlcComponentExecutionFailureRow[];
}

export const SDLC_COMPONENT_REPAIR_SCHEDULE_STATUSES = Object.freeze([
  "repair_required",
  "no_repair_required",
  "triage_gap"
] as const);

export type SdlcComponentRepairScheduleStatus =
  (typeof SDLC_COMPONENT_REPAIR_SCHEDULE_STATUSES)[number];

export interface SdlcComponentRepairScheduleRow {
  readonly kind: "sdlc_component_repair_schedule_row";
  readonly scheduleId: string;
  readonly failureId: string;
  readonly repairTarget: SdlcComponentRepairTarget;
  readonly lawfulReentryPoint: string;
  readonly attributionConfidence: SdlcComponentAttributionConfidence;
  readonly testcaseIds: readonly string[];
  readonly componentIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly sourceRefs: readonly string[];
  readonly testRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcComponentRepairSchedule {
  readonly kind: "sdlc_component_repair_schedule";
  readonly registerVersion: "ts-component-depth-v1";
  readonly scheduleStatus: SdlcComponentRepairScheduleStatus;
  readonly repairRows: readonly SdlcComponentRepairScheduleRow[];
  readonly evidenceRefs: readonly string[];
}

export type SdlcReleaseDepthParityStatus = "met" | "blocked" | "repriced";

export interface SdlcReleaseDepthParityAssessment {
  readonly kind: "sdlc_release_depth_parity_assessment";
  readonly status: SdlcReleaseDepthParityStatus;
  readonly summary: string;
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcComponentDepthRegister {
  readonly kind: "sdlc_component_depth_register";
  readonly registerVersion: "ts-component-depth-v1";
  readonly targetAssetType: string;
  readonly componentTopologyRows: readonly SdlcComponentTopologyRow[];
  readonly componentRealizationRows: readonly SdlcComponentRealizationRow[];
  readonly testComponentTopologyRows: readonly SdlcTestComponentTopologyRow[];
  readonly componentTestRows: readonly SdlcComponentTestRealizationRow[];
  readonly componentTestQualificationRows: readonly SdlcComponentTestQualificationRow[];
  readonly componentExecutionFailureRegister: SdlcComponentExecutionFailureRegister | null;
  readonly componentRepairSchedule: SdlcComponentRepairSchedule | null;
  readonly releaseDepthParity: SdlcReleaseDepthParityAssessment | null;
}

export type SdlcComponentDepthRegisterAdmissionStatus =
  | "admitted"
  | "rejected"
  | "not_required";

export interface SdlcComponentDepthRegisterAdmission {
  readonly kind: "sdlc_component_depth_register_admission";
  readonly status: SdlcComponentDepthRegisterAdmissionStatus;
  readonly targetAssetType: string;
  readonly register: SdlcComponentDepthRegister | null;
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export const SDLC_DOMAIN_ENTITY_OWNERSHIP = Object.freeze([
  "owned",
  "referenced"
] as const);

export type SdlcDomainEntityOwnership =
  (typeof SDLC_DOMAIN_ENTITY_OWNERSHIP)[number];

export const SDLC_DOMAIN_ATTRIBUTE_CARDINALITIES = Object.freeze([
  "one",
  "optional",
  "many"
] as const);

export type SdlcDomainAttributeCardinality =
  (typeof SDLC_DOMAIN_ATTRIBUTE_CARDINALITIES)[number];

export interface SdlcDomainAttribute {
  readonly kind: "sdlc_domain_attribute";
  readonly attributeId: string;
  readonly name: string;
  readonly valueType: string;
  readonly cardinality: SdlcDomainAttributeCardinality;
  readonly invariantRefs: readonly string[];
}

export interface SdlcDomainEntity {
  readonly kind: "sdlc_domain_entity";
  readonly entityId: string;
  readonly moduleName: string;
  readonly ownership: SdlcDomainEntityOwnership;
  readonly attributes: readonly SdlcDomainAttribute[];
  readonly invariants: readonly string[];
  readonly sourceAssetRefs: readonly string[];
}

export interface SdlcDomainOperation {
  readonly kind: "sdlc_domain_operation";
  readonly operationId: string;
  readonly moduleName: string;
  readonly inputEntityIds: readonly string[];
  readonly outputEntityIds: readonly string[];
  readonly requiredAttributeIds: readonly string[];
}

export interface SdlcModuleSchemaFragment {
  readonly kind: "sdlc_module_schema_fragment";
  readonly moduleName: string;
  readonly entities: readonly SdlcDomainEntity[];
  readonly operations: readonly SdlcDomainOperation[];
  readonly requirementIds: readonly string[];
  readonly sourceAssetRefs: readonly string[];
}

export interface SdlcEntityStateTransition {
  readonly kind: "sdlc_entity_state_transition";
  readonly transitionId: string;
  readonly fromState: string;
  readonly toState: string;
  readonly operationId: string;
  readonly entityId: string;
}

export interface SdlcModuleStateDiagramFragment {
  readonly kind: "sdlc_module_state_diagram_fragment";
  readonly moduleName: string;
  readonly entityId: string;
  readonly stateless: boolean;
  readonly states: readonly string[];
  readonly transitions: readonly SdlcEntityStateTransition[];
  readonly requirementIds: readonly string[];
  readonly sourceAssetRefs: readonly string[];
}

export interface SdlcAggregateDomainEntity {
  readonly kind: "sdlc_aggregate_domain_entity";
  readonly entityId: string;
  readonly ownerModuleName: string;
  readonly attributes: readonly SdlcDomainAttribute[];
  readonly sourceModuleNames: readonly string[];
}

export interface SdlcAggregateDomainModel {
  readonly kind: "sdlc_aggregate_domain_model";
  readonly modelVersion: "ts-design-depth-v1";
  readonly entities: readonly SdlcAggregateDomainEntity[];
  readonly operations: readonly SdlcDomainOperation[];
  readonly crossModuleReferences: readonly {
    readonly fromModuleName: string;
    readonly toModuleName: string;
    readonly entityId: string;
  }[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcSunnyDaySequenceStep {
  readonly kind: "sdlc_sunny_day_sequence_step";
  readonly stepId: string;
  readonly moduleName: string;
  readonly operationId: string;
  readonly inputEntityIds: readonly string[];
  readonly outputEntityIds: readonly string[];
  readonly stateTransitionIds: readonly string[];
}

export interface SdlcAggregateSunnyDaySequence {
  readonly kind: "sdlc_aggregate_sunny_day_sequence";
  readonly sequenceVersion: "ts-design-depth-v1";
  readonly steps: readonly SdlcSunnyDaySequenceStep[];
  readonly evidenceRefs: readonly string[];
}

export const SDLC_DESIGN_COMPLETENESS_AXES = Object.freeze([
  "entity",
  "attribute",
  "flow"
] as const);

export type SdlcDesignCompletenessAxis =
  (typeof SDLC_DESIGN_COMPLETENESS_AXES)[number];

export const SDLC_DESIGN_COMPLETENESS_STATUSES = Object.freeze([
  "satisfied",
  "partial",
  "blocked"
] as const);

export type SdlcDesignCompletenessStatus =
  (typeof SDLC_DESIGN_COMPLETENESS_STATUSES)[number];

export interface SdlcDesignCompletenessAxisVerdict {
  readonly kind: "sdlc_design_completeness_axis_verdict";
  readonly axis: SdlcDesignCompletenessAxis;
  readonly status: SdlcDesignCompletenessStatus;
  readonly reasons: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcDesignCompletenessVerdict {
  readonly kind: "sdlc_design_completeness_verdict";
  readonly verdictVersion: "ts-design-depth-v1";
  readonly entity: SdlcDesignCompletenessAxisVerdict;
  readonly attribute: SdlcDesignCompletenessAxisVerdict;
  readonly flow: SdlcDesignCompletenessAxisVerdict;
}

export interface SdlcDesignDepthRegister {
  readonly kind: "sdlc_design_depth_register";
  readonly registerVersion: "ts-design-depth-v1";
  readonly targetAssetType: string;
  readonly moduleSchemaFragments: readonly SdlcModuleSchemaFragment[];
  readonly moduleStateDiagramFragments: readonly SdlcModuleStateDiagramFragment[];
  readonly aggregateDomainModel: SdlcAggregateDomainModel | null;
  readonly aggregateSunnyDaySequence: SdlcAggregateSunnyDaySequence | null;
  readonly designCompletenessVerdict: SdlcDesignCompletenessVerdict | null;
}

export type SdlcDesignDepthRegisterAdmissionStatus =
  | "admitted"
  | "partial"
  | "rejected"
  | "not_required";

export interface SdlcDesignDepthRegisterAdmission {
  readonly kind: "sdlc_design_depth_register_admission";
  readonly status: SdlcDesignDepthRegisterAdmissionStatus;
  readonly targetAssetType: string;
  readonly register: SdlcDesignDepthRegister | null;
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
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
  readonly edgeAssuranceContractRef?: string;
  readonly edgeAssuranceContractDigest?: string;
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

export type SdlcTraversalStrategy =
  | "full_breadth"
  | "steel_thread"
  | "targeted_repair";

export type SdlcTraversalStrategyDecisionSource =
  | "abg_selected"
  | "odd_sdlc_fallback_plan";

export interface SdlcTraversalStrategyPlan {
  readonly kind: "sdlc_traversal_strategy_plan";
  readonly planVersion: "ts-strategy-plan-v1";
  readonly planRef: string;
  readonly defaultStrategy: SdlcTraversalStrategy;
  readonly edgeStrategies: Readonly<Record<string, SdlcTraversalStrategy>>;
  readonly edgeScopeRefs?: Readonly<Record<string, readonly string[]>>;
}

export interface SdlcTraversalStrategyDecision {
  readonly kind: "sdlc_traversal_strategy_decision";
  readonly decisionVersion: "ts-strategy-decision-v1";
  readonly edgeName: string;
  readonly targetAssetType: string;
  readonly selectedStrategy: SdlcTraversalStrategy;
  readonly decisionSource: SdlcTraversalStrategyDecisionSource;
  readonly strategyPlanRef: string;
  readonly strategyDirectiveRef: string | null;
  readonly featureScopeRequired: boolean;
  readonly featureScopeDerived: boolean;
  readonly basisRefs: readonly string[];
}

export type SdlcFeatureScopeMode =
  | "steel_thread"
  | "targeted_repair"
  | "full_breadth";

export interface SdlcFeatureScope {
  readonly kind: "sdlc_feature_scope";
  readonly scopeVersion: "ts-scope-v1";
  readonly mode: SdlcFeatureScopeMode;
  readonly scopeRef: string;
  readonly basisRefs: readonly string[];
  readonly includedModuleNames: readonly string[];
  readonly includedEntityIds: readonly string[];
  readonly includedOperationIds: readonly string[];
  readonly deferredModuleNames: readonly string[];
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
    | "escalate_to_fp"
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
    readonly priorAuthorityRef: string;
    readonly attemptIndex: number;
    readonly sourceProjectionRef: string;
  }[];
  readonly priorGapDossiers: readonly SdlcPostflightGapDossier[];
}

export interface SdlcTraversalIntentPackage {
  readonly kind: "sdlc_traversal_intent_package";
  readonly packageVersion: "ts-intent-v1";
  readonly overlayRef: string | null;
  readonly overlayBindingRef: string | null;
  readonly graphCatalogDigestRef: string | null;
  readonly edgeAssuranceContractRef?: string;
  readonly edgeAssuranceContractDigest?: string;
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
  readonly traversalStrategyDecision: SdlcTraversalStrategyDecision;
  readonly featureScope: SdlcFeatureScope;
  readonly productMaterialization: SdlcProductMaterializationContract;
  readonly resultReportSchema: readonly string[];
  readonly evaluatorExpectations: SdlcHookTransformProfile;
  readonly outputFile: string;
  readonly reportFile: string;
  readonly packageDigest: string;
}

export interface SdlcWorkerInvocationObligation {
  readonly kind: "sdlc_worker_invocation_obligation";
  readonly obligationId: string;
  readonly obligationKind: SdlcTraversalObligationKind;
  readonly summary: string;
  readonly evidenceRefs: readonly string[];
  readonly sourceRefs: readonly string[];
  readonly sourceSnippetCount: number;
  readonly coverageExpectation: string;
}

export interface SdlcWorkerInvocationRetryFrontier {
  readonly kind: "sdlc_worker_invocation_retry_frontier";
  readonly retryAttemptRefs: readonly string[];
  readonly dossierRefs: readonly string[];
  readonly reasonCount: number;
  readonly sampleReasonCodes: readonly string[];
  readonly omittedReasonCount: number;
}

export type SdlcWorkerRetryRepairScope =
  | "schema_local"
  | "semantic_local"
  | "broad_regeneration";

export interface SdlcWorkerRetryRepairInstruction {
  readonly kind: "sdlc_worker_retry_repair_instruction";
  readonly repairScope: SdlcWorkerRetryRepairScope;
  readonly gapDossierRef: string;
  readonly reason: string;
  readonly reasonClass: SdlcPostflightGapReasonClass;
  readonly blockingReasonCode: string;
  readonly blockingReasonDetail: string;
  readonly rejectedArtifactRefs: readonly string[];
  readonly acceptedCarrierSchemaRef: string | null;
  readonly acceptedCarrierFieldSet: readonly string[];
  readonly repairReentryPlanId: string | null;
  readonly nonClosureRules: readonly string[];
}

export interface SdlcComponentRepairReentryPlan {
  readonly kind: "sdlc_component_repair_reentry_plan";
  readonly planVersion: "ts-component-repair-reentry-v1";
  readonly planId: string;
  readonly sourceGapDossierRef: string;
  readonly sourceEdgeName: string;
  readonly sourceTargetAssetType: string;
  readonly reason: string;
  readonly targetEdgeName: string;
  readonly targetAssetType: string;
  readonly repairTarget: SdlcComponentRepairTarget;
  readonly failureId: string;
  readonly scheduleId: string;
  readonly testcaseIds: readonly string[];
  readonly componentIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly sourceRefs: readonly string[];
  readonly testRefs: readonly string[];
  readonly repairRowEvidenceRefs: readonly string[];
  readonly diagnosticEvidenceRefs: readonly string[];
  readonly diagnosticExcerpt: string;
  readonly acceptedCarrierSchemaRef: string;
  readonly acceptedCarrierFieldSet: readonly string[];
  readonly noBroadRegeneration: true;
}

export interface SdlcWorkerInvocationOutputContract {
  readonly kind: "sdlc_worker_invocation_output_contract";
  readonly outputFile: string;
  readonly reportFile: string;
  readonly fpTransformRequestFile: string;
  readonly fpTransformResultFile: string;
  readonly fpEvaluateResultFile: string;
  readonly materializationRequired: boolean;
  readonly tenantRoot: string;
  readonly selectedOutputRoot: string;
  readonly declaredProductFileTargets: readonly string[];
  readonly declaredProductTargetContracts: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly requiredRoles: readonly SdlcMaterializedProductFileRole[];
  readonly buildExecutionContract: string;
  readonly testExecutionContract: string;
}

export interface SdlcProductMaterializationAuthorityTarget {
  readonly kind: "sdlc_product_materialization_authority_target";
  readonly path: string;
  readonly targetKind: "file" | "directory";
  readonly requiredRole: SdlcMaterializedProductFileRole;
  readonly policyRef: string;
  readonly source:
    | "context_expected_files"
    | "product_authority"
    | "requirement_authority";
  readonly sourceRef: string;
}

export interface SdlcProductMaterializationAuthorityReconciliation {
  readonly kind: "sdlc_product_materialization_authority_reconciliation";
  readonly status: "not_required" | "passed" | "missing" | "ambiguous";
  readonly selectedOutputRoot: string;
  readonly contextExpectedFileTargets: readonly string[];
  readonly requirementAuthorityTargets: readonly string[];
  readonly productAuthorityTargets: readonly string[];
  readonly declaredProductFileTargets: readonly string[];
  readonly contextExpectedTargetContracts: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly requirementAuthorityTargetContracts: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly productAuthorityTargetContracts: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly declaredProductTargetContracts: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly sourceRefs: readonly string[];
  readonly reasonRefs: readonly string[];
}

export interface SdlcWorkerInvocationPackage {
  readonly kind: "sdlc_worker_invocation_package";
  readonly packageVersion: "ts-invocation-v1";
  readonly edgeAssuranceContractRef?: string;
  readonly edgeAssuranceContractDigest?: string;
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly sourceAssetTypes: readonly string[];
  readonly targetAssetType: string;
  readonly manifestPath: string;
  readonly manifestRef: string;
  readonly manifestDigest: string;
  readonly traversalIntentPackagePath: string;
  readonly traversalIntentPackageRef: string;
  readonly traversalIntentPackageDigest: string;
  readonly transformAxioms: readonly string[];
  readonly outcomeDirectives: readonly string[];
  readonly outputContract: SdlcWorkerInvocationOutputContract;
  readonly productMaterializationAuthority: SdlcProductMaterializationAuthorityReconciliation;
  readonly allowedWriteRoots: readonly string[];
  readonly traversalStrategyDecision: SdlcTraversalStrategyDecision;
  readonly featureScope: SdlcFeatureScope;
  readonly retryFrontier: SdlcWorkerInvocationRetryFrontier;
  readonly repairReentryPlans: readonly SdlcComponentRepairReentryPlan[];
  readonly retryRepairInstructions: readonly SdlcWorkerRetryRepairInstruction[];
  readonly inlineObligations: readonly SdlcWorkerInvocationObligation[];
  readonly inlineObligationIds: readonly string[];
  readonly requirementTraceObligationIds: readonly string[];
  readonly omittedRequirementTraceObligationCount: number;
  readonly trancheKeys: readonly string[];
  readonly omittedObligationCount: number;
  readonly retrievalHints: readonly SdlcRetrievalHint[];
  readonly obligationDeltaSummary: SdlcTraversalObligationDeltaSummary;
  readonly authorityRefCount: number;
  readonly runtimeContextRefs: readonly string[];
  readonly priorEdgeRefs: readonly string[];
  readonly resultReportSchema: readonly string[];
  readonly packageDigest: string;
}

export interface SdlcWorkerBrief {
  readonly kind: "sdlc_worker_brief";
  readonly briefVersion: "ts-worker-brief-v1";
  readonly edgeAssuranceContractRef?: string;
  readonly edgeAssuranceContractDigest?: string;
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly sourceAssetTypes: readonly string[];
  readonly targetAssetType: string;
  readonly outputFile: string;
  readonly reportFile: string;
  readonly materializationRequired: boolean;
  readonly allowedWriteRoots: readonly string[];
  readonly requiredSchema: readonly string[];
  readonly refs: {
    readonly workerInvocationPackagePath: string;
    readonly traversalIntentPackagePath: string;
    readonly handoffManifestPath: string;
    readonly conformedProjectPath: string;
    readonly fpTransformRequestFile: string;
    readonly fpTransformResultFile: string;
    readonly fpEvaluateResultFile: string;
  };
  readonly digests: {
    readonly workerInvocationPackageDigest: string;
    readonly traversalIntentPackageDigest: string;
    readonly handoffManifestDigest: string;
  };
  readonly retryInstructionCount: number;
  readonly repairReentryPlanCount: number;
}

export interface SdlcWorkerHandoffManifest {
  readonly kind: "sdlc_worker_handoff_manifest";
  readonly contractVersion: "ts-operator-v1";
  readonly overlayRef: string | null;
  readonly overlayBindingRef: string | null;
  readonly graphCatalogDigestRef: string | null;
  readonly edgeAssuranceContractRef?: string;
  readonly edgeAssuranceContractDigest?: string;
  readonly workspaceRoot: string;
  readonly archiveRoot: string;
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly inputAssetTypes: readonly string[];
  readonly targetAssetType: string;
  readonly outputFile: string;
  readonly reportFile: string;
  readonly fpTransformRequest: FpTransformRequest | null;
  readonly fpTransformRequestFile: string;
  readonly fpTransformResultFile: string;
  readonly fpEvaluateResultFile: string;
  readonly allowedWriteRoots: readonly string[];
  readonly conformedProject: SdlcConformProjectProfile;
  readonly productMaterialization: SdlcProductMaterializationContract;
  readonly traversalStrategyDecision: SdlcTraversalStrategyDecision;
  readonly featureScope: SdlcFeatureScope;
  readonly traversalObligationContext: SdlcTraversalObligationContext;
  readonly traversalIntentPackage: SdlcTraversalIntentPackage;
  readonly traversalAttemptEnvelope: TraversalAttemptEnvelope | null;
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
  readonly materializationDiagnostics: readonly SdlcWorkerResultMaterializationDiagnostic[];
  readonly executionEvidence: SdlcWorkerExecutionEvidence | null;
  readonly executionEvidenceErrors: readonly string[];
  readonly obligationAssessments: readonly SdlcWorkerObligationAssessment[];
  readonly fpTransformRequestRef: string | null;
  readonly fpTransformResultRef: string | null;
  readonly fpTransformStatus: FpTransformResult["status"] | null;
  readonly fpEvaluateResultRef: string | null;
}

export interface SdlcWorkerResultMaterializationDiagnostic {
  readonly kind: "sdlc_worker_result_materialization_diagnostic";
  readonly code: SdlcBlockingReasonCode;
  readonly detail: string;
  readonly evidenceRefs: readonly string[];
}

export interface SdlcPostflightResult {
  readonly kind: "sdlc_operator_postflight_result";
  readonly status: "passed" | "blocked";
  readonly blockingReasons: readonly string[];
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcFpEvaluateResult {
  readonly kind: "sdlc_fp_evaluate_result";
  readonly stage: "F_P.evaluate";
  readonly reportRef: string;
  readonly transformResultRef: string | null;
  readonly postflightRef: string;
  readonly status:
    | SdlcPostflightResult["status"]
    | "admitted_with_open_obligations";
  readonly postflightStatus: SdlcPostflightResult["status"];
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly obligationAssessmentCounts: {
    readonly total: number;
    readonly fulfilled: number;
    readonly partial: number;
    readonly blocked: number;
    readonly unassessed: number;
  };
  readonly executionEvidenceStatus: SdlcWorkerExecutionEvidence["status"] | null;
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
  readonly traversalConsequence: SdlcInstalledOperatorTraversalConsequence | null;
  readonly loop?: SdlcInstalledOperatorStartLoop | undefined;
}
