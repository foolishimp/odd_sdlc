"""Closed carrier family for the odd_sdlc public-start boundary."""
from __future__ import annotations

from typing import Literal, NotRequired, TypedDict, TypeAlias

from .domain_model import AssetProjectionPayload


RouteState: TypeAlias = Literal[
    "advance_declared_graph_function",
    "advance_dynamic_family",
    "advance_fixed_vector",
    "await_fh_resolution",
    "blocked_missing_capability",
    "blocked_stale_analysis",
    "converged",
    "constitutional_reprice_approved",
    "constitutional_reprice_rejected",
    "deferred",
    "no_lawful_route",
    "suppressed_by_mode",
    "unresolved",
]
ProposalState: TypeAlias = Literal[
    "pending_fh",
    "approve_with_edits",
    "approved",
    "revoked",
    "defer",
    "suppressed",
]
ProposalKind: TypeAlias = Literal[
    "goal_reprice",
    "intent_reprice",
    "product_reprice",
    "requirement_reprice",
    "design_reframe",
    "realization_refactor",
]
FailureClass: TypeAlias = Literal[
    "transport_failure",
    "no_output",
    "contract_failure",
    "policy_config_defect",
    "runtime_defect",
    "proof_failure",
    "fd_findings",
]
StopPredicate: TypeAlias = Literal[
    "human_gate_required",
    "dispatch_required",
    "worker_attachment_required",
    "gap_stop",
    "yielded",
    "proof_hold",
    "converged",
    "traversal_applied",
    "publish_gap_dossier",
    "published_head_gap_required",
    "published_head_route_required",
    "head_route_not_start_authoritative",
    "no_open_gap",
]
BlockedReason: TypeAlias = Literal[
    "fh_gate",
    "published_gap_dossier_unavailable",
    "head_gap_unavailable",
    "route_binding_unavailable",
    "public_next_start_unavailable",
    "route_binding_not_start_authoritative",
    "fp_worker_unattached",
    "converged",
    "advance_dynamic_family",
    "advance_fixed_vector",
    "await_fh_resolution",
    "blocked_missing_capability",
    "blocked_stale_analysis",
    "constitutional_reprice_approved",
    "constitutional_reprice_rejected",
    "deferred",
    "no_lawful_route",
    "suppressed_by_mode",
    "unresolved",
]
StoppedBy: TypeAlias = Literal[
    "fh_gate",
    "fp_dispatch",
    "fd_gap",
    "yield",
    "proof_hold",
    "published_gap_dossier",
    "route_binding",
    "converged",
    "fp_runtime_failure",
    "worker_attachment",
]
ExecutionTargetKind: TypeAlias = Literal["next", "graph_function", "asset"]
ExecutionSourceKind: TypeAlias = Literal["operator_request", "ticket_work_item"]
PublicStartStatus: TypeAlias = Literal[
    "pending",
    "yield",
    "converged",
    "nothing_to_do",
    "blocked",
    "error",
    "iterated",
    "in_progress",
    "queued",
    "needs_selection",
    "dispatched",
]
FhMode: TypeAlias = Literal["direct", "human-proxy"]
RootMode: TypeAlias = Literal["direct", "supervised"]
HandoffKind: TypeAlias = Literal["retry", "repair", "fh_review", "observer_handoff"]
RetryClassification: TypeAlias = Literal["deepening_eligible", "structurally_terminal"]


class GapDossierSummary(TypedDict, total=False):
    published: bool
    unavailable_reason: str
    gap_count: int
    declared_obligation_gap_count: int
    graph_edge_gap_count: int
    mixed_truth_classes: bool
    graph_total_delta: float
    total_delta: float


class EvidenceBundleRefs(TypedDict, total=False):
    current_triage_artifact_path: str
    observation_event_id: str
    triage_event_id: str
    route_event_id: str
    constitutional_event_id: str


class RouteBindingProjection(TypedDict):
    state: RouteState
    route_id: NotRequired[str]
    route_event_id: NotRequired[str]
    binding_source: NotRequired[str]
    selected_graphfunction: NotRequired[str]


class GapTruthProjection(TypedDict):
    gap_kind: str
    graph_delta: float | int | None
    carry_delta: float | int | None
    fulfillment_delta: float | int | None
    combined_delta: float | int | None
    total_delta: float | int | None
    graph_converged: bool
    carry_converged: bool
    fulfillment_converged: bool
    edge_converged: bool
    blocking_reasons: list[str]
    failing: list[str]
    graph_failing: list[str]
    signal_key: str


class EvidenceItemPayload(TypedDict):
    evidence_role: str
    binding: NotRequired[str]
    detail: NotRequired[str]
    excerpt: NotRequired[str]
    name: NotRequired[str]


class ObservationProjection(TypedDict, total=False):
    event_id: str
    observation_id: str
    current_work_key: str
    work_key: str
    observed_boundary: str
    observation_basis: str
    observed_signal: str
    evidence: list[EvidenceItemPayload]


class TriageProjection(TypedDict, total=False):
    event_id: str
    triage_id: str
    observation_id: str
    prior_observation_id: str
    framework_layer: str
    framework_condition: str
    process_outcome_kind: str
    reentry_layer: str
    resumption_trigger: str
    route_state: RouteState | str
    realization_iteration: "RealizationIterationProjection"
    evidence: list[EvidenceItemPayload]


class FhGatePayload(TypedDict):
    edge: str
    evaluators: list[Literal["constitutional_pending_fh"]]
    criteria: list[str]


class ProofHoldPayload(TypedDict, total=False):
    held: bool
    reason: str
    proof_hold_id: str


class RealizationIterationProjection(TypedDict):
    edge_id: str
    evaluator_id: str
    classification: RetryClassification
    deepening_eligible: bool
    carry_delta: float | int | None
    dispatch_index: int


class ConstitutionalProposalProjection(TypedDict):
    proposal_id: str
    proposal_kind: ProposalKind
    state: ProposalState
    target_surface: str
    resumption_trigger: NotRequired[str]
    target_surface_digest: NotRequired[str]
    identity_hash: NotRequired[str]
    event_id: NotRequired[str]


class GapDossierRow(TypedDict):
    edge: str
    analysis_current: bool
    analysis_fingerprint: str | None
    current_work_key: str | None
    gap_truth: GapTruthProjection
    observation: ObservationProjection
    triage: TriageProjection
    route_binding: RouteBindingProjection
    constitutional_proposal: ConstitutionalProposalProjection | None
    resumption_trigger: str | None
    evidence_bundle_refs: EvidenceBundleRefs


class WorkItemRouteContractPayload(TypedDict):
    route_kind: str
    binding_source: str
    ticket_id: str
    change_class: str
    re_entry_point: str
    reentry_vector: str
    reentry_target_asset: str
    scope_binding: str
    operator_target_handle: str


class StartTargetCatalogEntryPayload(TypedDict, total=False):
    handle: str
    target_id: str
    graph_function_name: str
    carrier_class: str
    template_kind: str
    job_names: list[str]
    execution_binding: str
    start_addressable: bool
    inputs: list[str]
    outputs: list[str]
    host_binding_of: str
    host_binding_kind: str
    plugin_kind: str
    binding_source: str


class AssetOperatorTargetPayload(TypedDict):
    kind: Literal["graph_function"]
    handle: str
    target_id: str
    graph_function_name: str
    carrier_class: str


class AssetOwnershipIndexEntryPayload(TypedDict, total=False):
    handle: str
    asset_id: str
    uri: str
    relative_path: str
    path_kind: str
    exists: bool
    binding_source: str
    operator_target: AssetOperatorTargetPayload
    route_contract: WorkItemRouteContractPayload


class NextExecutionTargetPayload(TypedDict):
    normalized_scope: str
    public_target: str
    until: str
    kind: Literal["next"]
    edge_override: NotRequired[str]
    route_state: NotRequired[RouteState | str]
    binding_source: NotRequired[str]


class GraphFunctionExecutionTargetPayload(TypedDict):
    normalized_scope: str
    public_target: str
    until: str
    kind: Literal["graph_function"]
    handle: str
    target_id: str
    graph_function_name: str


class AssetExecutionTargetPayload(TypedDict):
    normalized_scope: str
    public_target: str
    until: str
    kind: Literal["asset"]
    handle: str
    target_id: str
    graph_function_name: str
    asset_id: str
    asset_uri: str
    binding_source: str
    asset_relative_path: NotRequired[str]
    asset_path_kind: NotRequired[str]
    asset_exists: NotRequired[bool]
    route_contract: NotRequired[WorkItemRouteContractPayload]
    ticket_id: NotRequired[str]
    ticket_relative_path: NotRequired[str]
    ticket_target_truth: NotRequired[str]


ExecutionTargetPayload: TypeAlias = (
    NextExecutionTargetPayload
    | GraphFunctionExecutionTargetPayload
    | AssetExecutionTargetPayload
)


class CarrierGraphFunctionsPayload(TypedDict):
    derive: str
    admit: str


class OperatorExecutionSourcePayload(TypedDict):
    source_kind: Literal["operator_request"]
    ticket_category: Literal["ordinary"]
    change_class: str
    re_entry_point: str
    affected_boundary: str
    closure_law: str
    evaluation_criteria: list[str]
    non_closure_conditions: list[str]
    proof_surface: list[str]


class TicketWorkItemExecutionSourcePayload(TypedDict):
    source_kind: Literal["ticket_work_item"]
    ticket_id: str
    ticket_title: str
    ticket_status: str
    ticket_category: str
    change_class: str
    re_entry_point: str
    affected_boundary: str
    superseded_truth: str
    closure_law: str
    evaluation_criteria: list[str]
    non_closure_conditions: list[str]
    proof_surface: list[str]
    route_contract: WorkItemRouteContractPayload
    required_direction: str
    acceptance: str
    migration_declaration: str
    migration_checklist: str


ExecutionSourcePayload: TypeAlias = (
    OperatorExecutionSourcePayload | TicketWorkItemExecutionSourcePayload
)


class ExecutionContractSurfacePayload(TypedDict, total=False):
    contract_kind: str
    carrier_shape: str
    carrier_graph_functions: CarrierGraphFunctionsPayload
    contract_id: str
    status: Literal["drafted", "admitted", "rejected", "superseded"]
    source_kind: ExecutionSourceKind
    ticket_id: str
    ticket_title: str
    ticket_status: str
    ticket_category: str
    change_class: str
    re_entry_point: str
    affected_boundary: str
    superseded_truth: str
    closure_law: str
    evaluation_criteria: list[str]
    non_closure_conditions: list[str]
    proof_surface: list[str]
    route_contract: WorkItemRouteContractPayload
    required_direction: str
    acceptance: str
    migration_declaration: str
    migration_checklist: str
    register_path: str
    context_path: str
    supersedes_contract_id: str
    superseded_by_contract_id: str
    errors: list[str]
    target_truth: ExecutionTargetPayload


class GapDossierReadModel(TypedDict):
    scope: str
    jobs_considered: int
    open_frames: int
    published: bool
    execution_contract_surface: ExecutionContractSurfacePayload | None
    analysis_current: bool
    analysis_fingerprint: str | None
    event_stream_fingerprint: str | None
    event_stream_event_count: int
    event_stream_latest_event_id: str | None
    event_stream_latest_event_time: str | None
    analysis_manifest: object
    converged: bool
    graph_total_delta: float
    carry_delta: float
    fulfillment_delta: float
    combined_delta: float
    total_delta: float
    declared_obligation_gap_count: int
    graph_edge_gap_count: int
    mixed_truth_classes: bool
    gap_dossier_kind: str
    gap_dossier_register_path: str | None
    gap_dossier_context_path: str | None
    summary: GapDossierSummary
    dossiers: list[GapDossierRow]
    unavailable_reason: NotRequired[str]


class GapDossierRegisterPayload(TypedDict):
    gap_dossier_kind: str
    schema_version: str
    workspace_root: str
    scope: str
    execution_contract_surface: ExecutionContractSurfacePayload | None
    analysis_current: bool
    analysis_fingerprint: str | None
    event_stream_fingerprint: NotRequired[str | None]
    event_stream_event_count: NotRequired[int]
    event_stream_latest_event_id: NotRequired[str | None]
    event_stream_latest_event_time: NotRequired[str | None]
    summary: GapDossierSummary
    dossiers: list[GapDossierRow]


class PendingConstitutionalStartResult(TypedDict):
    status: Literal["pending"]
    target: str
    edge: str
    blocking_reason: Literal["fh_gate"]
    stop_predicate: Literal["human_gate_required"]
    stopped_by: Literal["fh_gate"]
    fh_gate: FhGatePayload
    constitutional_proposal: ConstitutionalProposalProjection
    route_binding: RouteBindingProjection
    gap_dossier_register_path: str | None
    gap_dossier_context_path: str | None
    resumption_trigger: str | None
    triage_artifact_path: str | None
    fh_mode: NotRequired[FhMode]
    root_mode: NotRequired[RootMode]
    resolved_target: NotRequired[str]
    resolved_edge: NotRequired[str]
    human_proxy_error: NotRequired[str]


class PublicNextStartBlockedResult(TypedDict, total=False):
    status: Literal["pending", "converged"]
    target: str
    blocking_reason: BlockedReason
    stop_predicate: StopPredicate
    stopped_by: StoppedBy
    edge: str
    route_binding: RouteBindingProjection
    gap_dossier_register_path: str | None
    gap_dossier_context_path: str | None
    triage_artifact_path: str | None
    resumption_trigger: str | None
    unavailable_reason: str
    worker_attachment: object
    fh_mode: FhMode
    root_mode: RootMode
    resolved_target: str
    resolved_edge: str
    human_proxy_error: str


class DispatchRequiredStartResult(TypedDict, total=False):
    status: Literal["pending"]
    target: str
    edge: str
    blocking_reason: Literal["fp_dispatch"]
    stop_predicate: Literal["dispatch_required"]
    work_key: str
    spec_hash: str
    workflow_version: str
    fp_manifest_path: str
    manifest_id: str
    resolved_policy: "ResolvedPolicyPayload"
    call_id: str
    fh_mode: FhMode
    root_mode: RootMode
    resolved_target: str
    resolved_edge: str


class FirstTraversalStartResult(TypedDict, total=False):
    status: PublicStartStatus
    target: str
    resolved_target: str
    resolved_edge: str
    edge: str
    work_key: str
    spec_hash: str
    workflow_version: str
    fh_mode: FhMode
    root_mode: RootMode


class TerminalStartResult(TypedDict, total=False):
    status: Literal["converged", "nothing_to_do"]
    target: str
    stop_predicate: Literal["converged", "no_open_gap", "gap_stop"]
    resolved_target: str
    resolved_edge: str
    stopped_by: str
    fh_mode: FhMode
    root_mode: RootMode


class ProofHoldStartResult(TypedDict, total=False):
    status: Literal["pending"]
    target: str
    edge: str
    work_key: str
    spec_hash: str
    workflow_version: str
    stop_predicate: Literal["proof_hold"]
    stopped_by: Literal["proof_hold"]
    proof_hold: ProofHoldPayload
    proof_hold_active: Literal[True]
    fh_mode: FhMode
    root_mode: RootMode
    resolved_target: str
    resolved_edge: str


class YieldedStartResult(TypedDict, total=False):
    status: Literal["yield"]
    target: str
    stopped_by: Literal["yield"]
    edge: str
    run_id: str
    call_id: str
    continuation_id: str
    handoff_kind: HandoffKind
    handoff_reason: str
    failure_class: FailureClass
    resolved_target: str
    resolved_edge: str
    result_path: str
    manifest_id: str
    spec_hash: str
    workflow_version: str
    prompt_compactions: list["PromptCompactionPayload"]
    published_ledger_ref: "PublishedFulfillmentLedgerRefPayload"
    events_emitted: int
    fulfillment_assessments: list["FulfillmentAssessmentPayload"]
    fh_mode: FhMode
    root_mode: RootMode


class FailureStartResult(TypedDict, total=False):
    status: Literal["error"]
    target: str
    stopped_by: StoppedBy
    failure_class: FailureClass
    reason: str
    resolved_target: str
    resolved_edge: str
    edge: str
    fh_mode: FhMode
    root_mode: RootMode


PublicStartBlockedPayload: TypeAlias = (
    PendingConstitutionalStartResult | PublicNextStartBlockedResult
)


PublicStartResultPayload: TypeAlias = (
    PendingConstitutionalStartResult
    | PublicNextStartBlockedResult
    | DispatchRequiredStartResult
    | FirstTraversalStartResult
    | TerminalStartResult
    | ProofHoldStartResult
    | YieldedStartResult
    | FailureStartResult
)


PublicStartReturnPayload: TypeAlias = (
    FirstTraversalStartResult
    | TerminalStartResult
    | PublicNextStartBlockedResult
    | ProofHoldStartResult
    | YieldedStartResult
    | FailureStartResult
)


PublicStartHumanGatePayload: TypeAlias = (
    PendingConstitutionalStartResult | PublicNextStartBlockedResult
)


class QueryDomainContractPayload(TypedDict):
    name: str
    version: str
    top_level_keys: list[str]
    runtime_model: str
    query_model: str


class QueryDomainPayload(TypedDict):
    query_contract: QueryDomainContractPayload
    workspace_root: str
    execution_contract_surface: ExecutionContractSurfacePayload | None
    semantic_facets: object
    asset_types: object
    asset_families: object
    assets: list[AssetProjectionPayload]
    start_target_catalog: list[StartTargetCatalogEntryPayload]
    asset_ownership_index: list[AssetOwnershipIndexEntryPayload]
    operational_capabilities: object
    ambiguity_register: object
    requirement_closure_register: object
    collections: object
    functions: object
    edge_contracts: object
    programs: object
    work_act_types: object
    jobs: object
    graph_functions: object
    bindings: object
    gap_dossier: GapDossierReadModel


FulfillmentStatus: TypeAlias = Literal["fulfilled", "partial", "blocked", "unfulfilled"]
PromptCompactionSizeUnit: TypeAlias = Literal["chars", "items", "bindings"]


class GenesisPolicyConcernPayload(TypedDict):
    ref: str
    config: dict[str, object]


class ResolvedPolicyPayload(TypedDict):
    resolved_policy_bundle_ref: str
    bundle_refs: list[str]
    sources: dict[str, str]
    dispatch: GenesisPolicyConcernPayload
    evaluation: GenesisPolicyConcernPayload
    escalation: GenesisPolicyConcernPayload
    proof: GenesisPolicyConcernPayload
    closure: GenesisPolicyConcernPayload


class PromptCompactionPayload(TypedDict):
    surface: str
    reason: str
    size_unit: PromptCompactionSizeUnit
    original_size: int
    emitted_size: int
    budget_size: int
    inspection_ref: str


class PublishedFulfillmentLedgerRefPayload(TypedDict):
    kind: str
    resolver: str
    manifest_id: str


class FulfillmentAssessmentPayload(TypedDict):
    id: str
    evaluator: str
    fulfillment_status: FulfillmentStatus
    fulfillment_detail: str
    blocking_reasons: list[str]
    evidence_refs: list[str]
