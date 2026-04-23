"""Closed carrier family for odd_sdlc runtime-effect event ingress."""
from __future__ import annotations

from collections.abc import Mapping
from pathlib import Path
from typing import Literal, NotRequired, TypeAlias, TypedDict

from .domain_model import AssetCheckpointPayload
from .public_start_contract import (
    AssetExecutionTargetPayload,
    EvidenceItemPayload,
    ExecutionTargetPayload,
    ExecutionContractSurfacePayload,
    FhGatePayload,
    NextExecutionTargetPayload,
    ProposalKind,
    RetryClassification,
    RouteState,
    WorkItemRouteContractPayload,
)
from .public_start_subcarriers import admit_evidence_items


RuntimeEventType: TypeAlias = Literal[
    "fh_gate_pending",
    "asset_checkpoint_updated",
    "constitutional_proposal_approved_with_edits",
    "proposal_applied",
    "derivation_reopened",
    "gap_retired",
    "gap_event",
    "observation_recorded",
    "triage_produced",
    "route_recorded",
    "constitutional_proposal_recorded",
    "triage_divergence",
    "approved",
    "execution_contract_drafted",
    "execution_contract_superseded",
    "execution_contract_rejected",
    "execution_contract_admitted",
]

RouteProposalVectorKind: TypeAlias = Literal["fixed", "declared_graph_function", "dynamic"]
ConstitutionalPolicyMode: TypeAlias = Literal["fh_gate", "suppress"]
ConstitutionalProposalRecordState: TypeAlias = Literal[
    "pending_fh",
    "approve_with_edits",
    "approve",
    "reject",
    "defer",
    "suppressed",
]
HomeostaticGapKind: TypeAlias = Literal["odd_sdlc.homeostatic_gap"]


class GapAuthorityBasisPayload(TypedDict):
    basis_kind: Literal["gap_authority_basis"]
    edge: str
    analysis_fingerprint: str | None
    failing_evaluators: list[str]
    missing_required_bindings: list[str]
    reentry_layer: str | None


class GapRealizedBasisPayload(TypedDict):
    basis_kind: Literal["gap_realized_basis"]
    delta: float
    delta_summary: str
    environment_ready: bool
    work_key: str | None
    selected_output_dir: str | None


class TriageAssetFindingPayload(TypedDict):
    asset_id: str
    finding_kind: str
    target_layer: str


class RouteProposalPayload(TypedDict, total=False):
    vector_kind: RouteProposalVectorKind
    fixed_vector: str | None
    dynamic_family: str | None
    selected_graphfunction: str | None
    target_assets: list[str]
    priority_source: str


class RealizationIterationEventPayload(TypedDict):
    edge_id: str
    evaluator_id: str
    classification: RetryClassification
    deepening_eligible: bool
    carry_delta: float | int | None
    dispatch_index: int


class ObservationRecordedEventPayload(TypedDict):
    kind: HomeostaticGapKind
    edge: str
    run_id: str | None
    observation_id: str
    analysis_fingerprint: str | None
    observed_boundary: str
    observed_signal: str
    evidence: list[EvidenceItemPayload]


class TriageProducedEventPayload(TypedDict):
    kind: HomeostaticGapKind
    edge: str
    run_id: str | None
    triage_id: str
    observation_id: str
    prior_observation_id: str | None
    analysis_fingerprint: str | None
    triage_hash: str
    framework_layer: str
    framework_condition: str
    gap_kind: str
    process_outcome_kind: str
    reentry_layer: str | None
    resumption_trigger: str | None
    authority_basis: GapAuthorityBasisPayload
    realized_basis: GapRealizedBasisPayload
    asset_findings: list[TriageAssetFindingPayload]
    evidence: list[EvidenceItemPayload]
    realization_iteration: RealizationIterationEventPayload | None
    route_proposal: RouteProposalPayload | None


class RouteRecordedEventPayload(TypedDict):
    kind: HomeostaticGapKind
    edge: str
    run_id: str | None
    route_id: str
    triage_id: str
    analysis_fingerprint: str | None
    state: RouteState
    vector_kind: RouteProposalVectorKind | None
    selected_vector: str | None
    dynamic_family: str | None
    selected_graphfunction: str | None
    target_assets: list[str]
    priority_source: str
    realization_iteration: RealizationIterationEventPayload | None
    no_lawful_route_reason: str | None


class ConstitutionalProposalRecordedEventPayload(TypedDict):
    kind: HomeostaticGapKind
    edge: str
    run_id: str | None
    proposal_id: str
    triage_id: str
    analysis_fingerprint: str | None
    state: ConstitutionalProposalRecordState
    identity_hash: str
    policy_mode: ConstitutionalPolicyMode
    proposal_kind: ProposalKind
    target_surface: str
    target_surface_digest: str
    reentry_layer: Literal["goals", "intent"]


class TriageDivergenceEventPayload(TypedDict):
    kind: HomeostaticGapKind
    edge: str
    run_id: str | None
    prior_triage_hash: str | None
    current_triage_hash: str
    prior_triage_id: str | None
    current_triage_id: str


class ExecutionContractEventPayload(TypedDict):
    execution_contract: ExecutionContractSurfacePayload


class ConstitutionalProposalApprovedWithEditsEventPayload(TypedDict):
    edge: str
    proposal_id: str
    actor: str


class ProposalAppliedEventPayload(TypedDict):
    edge: str
    proposal_id: str
    target_surface: str
    surface_digest: str
    actor: str
    approval_event_id: str


class DerivationReopenedEventPayload(TypedDict):
    edge: str
    proposal_id: str
    target_surface: str
    surface_digest: str


class GapRetiredEventPayload(TypedDict):
    edge: str
    proposal_id: str
    target_surface: str
    surface_digest: str
    reopen_event_id: str


class GapEventEventPayload(TypedDict):
    edge: str
    proposal_id: str
    originating_gap_edge: str
    surface_digest: str
    delta: float
    failing: list[str]
    reopen_event_id: str


class AssetCheckpointUpdatedEventPayload(TypedDict):
    asset_id: str
    asset_uri: str
    declared_asset_type: str
    mutable: bool
    manifest_id: str
    edge: str
    target_path: str
    previous_checkpoint: AssetCheckpointPayload
    current_checkpoint: AssetCheckpointPayload


class ApprovedReviewEventPayload(TypedDict):
    edge: str
    actor: str


RuntimeEventPayload: TypeAlias = (
    FhGatePayload
    | AssetCheckpointUpdatedEventPayload
    | ConstitutionalProposalApprovedWithEditsEventPayload
    | ProposalAppliedEventPayload
    | DerivationReopenedEventPayload
    | GapRetiredEventPayload
    | GapEventEventPayload
    | ObservationRecordedEventPayload
    | TriageProducedEventPayload
    | RouteRecordedEventPayload
    | ConstitutionalProposalRecordedEventPayload
    | TriageDivergenceEventPayload
    | ApprovedReviewEventPayload
    | ExecutionContractEventPayload
)


def _mapping(value: object, *, field: str) -> Mapping[str, object]:
    if isinstance(value, Mapping):
        return value
    raise ValueError(f"{field} must be an object")


def _string(value: object, *, field: str) -> str:
    if isinstance(value, str) and value:
        return value
    raise ValueError(f"{field} must be a non-empty string")


def _optional_string(value: object, *, field: str) -> str | None:
    if value is None:
        return None
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, str):
        return value or None
    raise ValueError(f"{field} must be a string or null")


def _string_list(value: object, *, field: str) -> list[str]:
    if not isinstance(value, list):
        raise ValueError(f"{field} must be a list[str]")
    projected: list[str] = []
    for item in value:
        if not isinstance(item, str):
            raise ValueError(f"{field} must be a list[str]")
        projected.append(item)
    return projected


def _bool(value: object, *, field: str) -> bool:
    if isinstance(value, bool):
        return value
    raise ValueError(f"{field} must be a bool")


def _float(value: object, *, field: str) -> float:
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)
    raise ValueError(f"{field} must be numeric")


def _optional_delta(value: object, *, field: str) -> float | int | None:
    if value is None:
        return None
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return value
    raise ValueError(f"{field} must be numeric or null")


def _non_negative_int(value: object, *, field: str) -> int:
    if isinstance(value, int) and not isinstance(value, bool) and value >= 0:
        return value
    raise ValueError(f"{field} must be a non-negative integer")


def _route_proposal_vector_kind(value: object, *, field: str) -> RouteProposalVectorKind:
    if value == "fixed":
        return "fixed"
    if value == "declared_graph_function":
        return "declared_graph_function"
    if value == "dynamic":
        return "dynamic"
    raise ValueError(f"{field} has invalid value")


def _optional_route_proposal_vector_kind(
    value: object,
    *,
    field: str,
) -> RouteProposalVectorKind | None:
    if value is None:
        return None
    return _route_proposal_vector_kind(value, field=field)


def _retry_classification(value: object, *, field: str) -> RetryClassification:
    if value == "deepening_eligible":
        return "deepening_eligible"
    if value == "structurally_terminal":
        return "structurally_terminal"
    raise ValueError(f"{field} has invalid value")


def _route_state(value: object, *, field: str) -> RouteState:
    if value == "advance_declared_graph_function":
        return "advance_declared_graph_function"
    if value == "advance_dynamic_family":
        return "advance_dynamic_family"
    if value == "advance_fixed_vector":
        return "advance_fixed_vector"
    if value == "await_fh_resolution":
        return "await_fh_resolution"
    if value == "blocked_stale_analysis":
        return "blocked_stale_analysis"
    if value == "constitutional_reprice_approved":
        return "constitutional_reprice_approved"
    if value == "constitutional_reprice_rejected":
        return "constitutional_reprice_rejected"
    if value == "deferred":
        return "deferred"
    if value == "no_lawful_route":
        return "no_lawful_route"
    if value == "suppressed_by_mode":
        return "suppressed_by_mode"
    raise ValueError(f"{field} has invalid value")


def _proposal_kind(value: object, *, field: str) -> ProposalKind:
    if value == "goal_reprice":
        return "goal_reprice"
    if value == "intent_reprice":
        return "intent_reprice"
    if value == "product_reprice":
        return "product_reprice"
    if value == "requirement_reprice":
        return "requirement_reprice"
    if value == "design_reframe":
        return "design_reframe"
    if value == "realization_refactor":
        return "realization_refactor"
    raise ValueError(f"{field} has invalid value")


def _constitutional_policy_mode(
    value: object,
    *,
    field: str,
) -> ConstitutionalPolicyMode:
    if value == "fh_gate":
        return "fh_gate"
    if value == "suppress":
        return "suppress"
    raise ValueError(f"{field} has invalid value")


def _constitutional_record_state(
    value: object,
    *,
    field: str,
) -> ConstitutionalProposalRecordState:
    if value == "pending_fh":
        return "pending_fh"
    if value == "approve_with_edits":
        return "approve_with_edits"
    if value == "approve":
        return "approve"
    if value == "reject":
        return "reject"
    if value == "defer":
        return "defer"
    if value == "suppressed":
        return "suppressed"
    raise ValueError(f"{field} has invalid value")


def _execution_contract_status(
    value: object,
    *,
    field: str,
) -> Literal["drafted", "admitted", "rejected", "superseded"]:
    if value == "drafted":
        return "drafted"
    if value == "admitted":
        return "admitted"
    if value == "rejected":
        return "rejected"
    if value == "superseded":
        return "superseded"
    raise ValueError(f"{field} has invalid value")


def _execution_source_kind(
    value: object,
    *,
    field: str,
) -> Literal["operator_request", "ticket_work_item"]:
    if value == "operator_request":
        return "operator_request"
    if value == "ticket_work_item":
        return "ticket_work_item"
    raise ValueError(f"{field} has invalid value")


def _reentry_layer_goals_or_intent(
    value: object,
    *,
    field: str,
) -> Literal["goals", "intent"]:
    if value == "goals":
        return "goals"
    if value == "intent":
        return "intent"
    raise ValueError(f"{field} has invalid value")


def _kind(value: object, *, field: str) -> HomeostaticGapKind:
    if value == "odd_sdlc.homeostatic_gap":
        return "odd_sdlc.homeostatic_gap"
    raise ValueError(f"{field} has invalid value")


def _asset_checkpoint(value: object, *, field: str) -> AssetCheckpointPayload:
    payload = _mapping(value, field=field)
    return {
        "exists": _bool(payload.get("exists"), field=f"{field}.exists"),
        "path_kind": _string(payload.get("path_kind"), field=f"{field}.path_kind"),
        "content_digest": _optional_string(
            payload.get("content_digest"),
            field=f"{field}.content_digest",
        ),
        "bytes": (
            _non_negative_int(payload.get("bytes"), field=f"{field}.bytes")
            if payload.get("bytes") is not None
            else None
        ),
    }


def _authority_basis(value: object) -> GapAuthorityBasisPayload:
    payload = _mapping(value, field="authority_basis")
    basis_kind = payload.get("basis_kind")
    if basis_kind != "gap_authority_basis":
        raise ValueError("authority_basis.basis_kind must be gap_authority_basis")
    return {
        "basis_kind": "gap_authority_basis",
        "edge": _string(payload.get("edge"), field="authority_basis.edge"),
        "analysis_fingerprint": _optional_string(
            payload.get("analysis_fingerprint"),
            field="authority_basis.analysis_fingerprint",
        ),
        "failing_evaluators": _string_list(
            payload.get("failing_evaluators", []),
            field="authority_basis.failing_evaluators",
        ),
        "missing_required_bindings": _string_list(
            payload.get("missing_required_bindings", []),
            field="authority_basis.missing_required_bindings",
        ),
        "reentry_layer": _optional_string(
            payload.get("reentry_layer"),
            field="authority_basis.reentry_layer",
        ),
    }


def _realized_basis(value: object) -> GapRealizedBasisPayload:
    payload = _mapping(value, field="realized_basis")
    basis_kind = payload.get("basis_kind")
    if basis_kind != "gap_realized_basis":
        raise ValueError("realized_basis.basis_kind must be gap_realized_basis")
    return {
        "basis_kind": "gap_realized_basis",
        "delta": _float(payload.get("delta"), field="realized_basis.delta"),
        "delta_summary": _string(payload.get("delta_summary"), field="realized_basis.delta_summary"),
        "environment_ready": _bool(
            payload.get("environment_ready"),
            field="realized_basis.environment_ready",
        ),
        "work_key": _optional_string(payload.get("work_key"), field="realized_basis.work_key"),
        "selected_output_dir": _optional_string(
            payload.get("selected_output_dir"),
            field="realized_basis.selected_output_dir",
        ),
    }


def _asset_findings(value: object) -> list[TriageAssetFindingPayload]:
    if not isinstance(value, list):
        raise ValueError("asset_findings must be a list")
    projected: list[TriageAssetFindingPayload] = []
    for index, item in enumerate(value):
        payload = _mapping(item, field=f"asset_findings[{index}]")
        projected.append(
            {
                "asset_id": _string(payload.get("asset_id"), field=f"asset_findings[{index}].asset_id"),
                "finding_kind": _string(
                    payload.get("finding_kind"),
                    field=f"asset_findings[{index}].finding_kind",
                ),
                "target_layer": _string(
                    payload.get("target_layer"),
                    field=f"asset_findings[{index}].target_layer",
                ),
            }
        )
    return projected


def _route_proposal(value: object) -> RouteProposalPayload | None:
    if value is None:
        return None
    payload = _mapping(value, field="route_proposal")
    projected: RouteProposalPayload = {
        "vector_kind": _route_proposal_vector_kind(
            payload.get("vector_kind"),
            field="route_proposal.vector_kind",
        ),
        "fixed_vector": _optional_string(
            payload.get("fixed_vector"),
            field="route_proposal.fixed_vector",
        ),
        "dynamic_family": _optional_string(
            payload.get("dynamic_family"),
            field="route_proposal.dynamic_family",
        ),
        "selected_graphfunction": _optional_string(
            payload.get("selected_graphfunction"),
            field="route_proposal.selected_graphfunction",
        ),
        "target_assets": _string_list(
            payload.get("target_assets", []),
            field="route_proposal.target_assets",
        ),
    }
    priority_source = _optional_string(
        payload.get("priority_source"),
        field="route_proposal.priority_source",
    )
    if priority_source is not None:
        projected["priority_source"] = priority_source
    return projected


def _realization_iteration(value: object) -> RealizationIterationEventPayload | None:
    if value is None:
        return None
    payload = _mapping(value, field="realization_iteration")
    return {
        "edge_id": _string(payload.get("edge_id"), field="realization_iteration.edge_id"),
        "evaluator_id": _string(
            payload.get("evaluator_id"),
            field="realization_iteration.evaluator_id",
        ),
        "classification": _retry_classification(
            payload.get("classification"),
            field="realization_iteration.classification",
        ),
        "deepening_eligible": _bool(
            payload.get("deepening_eligible"),
            field="realization_iteration.deepening_eligible",
        ),
        "carry_delta": _optional_delta(
            payload.get("carry_delta"),
            field="realization_iteration.carry_delta",
        ),
        "dispatch_index": _non_negative_int(
            payload.get("dispatch_index"),
            field="realization_iteration.dispatch_index",
        ),
    }


def _execution_contract_surface(value: object) -> ExecutionContractSurfacePayload:
    payload = _mapping(value, field="execution_contract")
    contract_kind = _string(payload.get("contract_kind"), field="execution_contract.contract_kind")
    contract_id = _string(payload.get("contract_id"), field="execution_contract.contract_id")
    status = _execution_contract_status(payload.get("status"), field="execution_contract.status")
    source_kind = _execution_source_kind(
        payload.get("source_kind"),
        field="execution_contract.source_kind",
    )
    target_truth = _execution_target(payload.get("target_truth"))
    projected: ExecutionContractSurfacePayload = {
        "contract_kind": contract_kind,
        "contract_id": contract_id,
        "status": status,
        "source_kind": source_kind,
        "target_truth": target_truth,
    }
    carrier_shape = _optional_string(payload.get("carrier_shape"), field="execution_contract.carrier_shape")
    if carrier_shape is not None:
        projected["carrier_shape"] = carrier_shape
    carrier_graph_functions = payload.get("carrier_graph_functions")
    if isinstance(carrier_graph_functions, Mapping):
        projected["carrier_graph_functions"] = {
            "derive": _string(
                carrier_graph_functions.get("derive"),
                field="execution_contract.carrier_graph_functions.derive",
            ),
            "admit": _string(
                carrier_graph_functions.get("admit"),
                field="execution_contract.carrier_graph_functions.admit",
            ),
        }
    ticket_id = _optional_string(payload.get("ticket_id"), field="execution_contract.ticket_id")
    if ticket_id is not None:
        projected["ticket_id"] = ticket_id
    ticket_title = _optional_string(payload.get("ticket_title"), field="execution_contract.ticket_title")
    if ticket_title is not None:
        projected["ticket_title"] = ticket_title
    ticket_status = _optional_string(payload.get("ticket_status"), field="execution_contract.ticket_status")
    if ticket_status is not None:
        projected["ticket_status"] = ticket_status
    ticket_category = _optional_string(payload.get("ticket_category"), field="execution_contract.ticket_category")
    if ticket_category is not None:
        projected["ticket_category"] = ticket_category
    change_class = _optional_string(payload.get("change_class"), field="execution_contract.change_class")
    if change_class is not None:
        projected["change_class"] = change_class
    re_entry_point = _optional_string(payload.get("re_entry_point"), field="execution_contract.re_entry_point")
    if re_entry_point is not None:
        projected["re_entry_point"] = re_entry_point
    affected_boundary = _optional_string(
        payload.get("affected_boundary"),
        field="execution_contract.affected_boundary",
    )
    if affected_boundary is not None:
        projected["affected_boundary"] = affected_boundary
    superseded_truth = _optional_string(
        payload.get("superseded_truth"),
        field="execution_contract.superseded_truth",
    )
    if superseded_truth is not None:
        projected["superseded_truth"] = superseded_truth
    closure_law = _optional_string(payload.get("closure_law"), field="execution_contract.closure_law")
    if closure_law is not None:
        projected["closure_law"] = closure_law
    required_direction = _optional_string(
        payload.get("required_direction"),
        field="execution_contract.required_direction",
    )
    if required_direction is not None:
        projected["required_direction"] = required_direction
    acceptance = _optional_string(payload.get("acceptance"), field="execution_contract.acceptance")
    if acceptance is not None:
        projected["acceptance"] = acceptance
    migration_declaration = _optional_string(
        payload.get("migration_declaration"),
        field="execution_contract.migration_declaration",
    )
    if migration_declaration is not None:
        projected["migration_declaration"] = migration_declaration
    migration_checklist = _optional_string(
        payload.get("migration_checklist"),
        field="execution_contract.migration_checklist",
    )
    if migration_checklist is not None:
        projected["migration_checklist"] = migration_checklist
    register_path = _optional_string(payload.get("register_path"), field="execution_contract.register_path")
    if register_path is not None:
        projected["register_path"] = register_path
    context_path = _optional_string(payload.get("context_path"), field="execution_contract.context_path")
    if context_path is not None:
        projected["context_path"] = context_path
    supersedes_contract_id = _optional_string(
        payload.get("supersedes_contract_id"),
        field="execution_contract.supersedes_contract_id",
    )
    if supersedes_contract_id is not None:
        projected["supersedes_contract_id"] = supersedes_contract_id
    superseded_by_contract_id = _optional_string(
        payload.get("superseded_by_contract_id"),
        field="execution_contract.superseded_by_contract_id",
    )
    if superseded_by_contract_id is not None:
        projected["superseded_by_contract_id"] = superseded_by_contract_id
    if "evaluation_criteria" in payload:
        projected["evaluation_criteria"] = _string_list(
            payload.get("evaluation_criteria"),
            field="execution_contract.evaluation_criteria",
        )
    if "non_closure_conditions" in payload:
        projected["non_closure_conditions"] = _string_list(
            payload.get("non_closure_conditions"),
            field="execution_contract.non_closure_conditions",
        )
    if "proof_surface" in payload:
        projected["proof_surface"] = _string_list(
            payload.get("proof_surface"),
            field="execution_contract.proof_surface",
        )
    if "errors" in payload:
        projected["errors"] = _string_list(payload.get("errors"), field="execution_contract.errors")
    route_contract = payload.get("route_contract")
    if isinstance(route_contract, Mapping):
        projected["route_contract"] = _work_item_route_contract(route_contract)
    return projected


def _work_item_route_contract(value: object) -> WorkItemRouteContractPayload:
    payload = _mapping(value, field="execution_contract.route_contract")
    return {
        "route_kind": _string(payload.get("route_kind"), field="execution_contract.route_contract.route_kind"),
        "binding_source": _string(
            payload.get("binding_source"),
            field="execution_contract.route_contract.binding_source",
        ),
        "ticket_id": _string(payload.get("ticket_id"), field="execution_contract.route_contract.ticket_id"),
        "change_class": _string(
            payload.get("change_class"),
            field="execution_contract.route_contract.change_class",
        ),
        "re_entry_point": _string(
            payload.get("re_entry_point"),
            field="execution_contract.route_contract.re_entry_point",
        ),
        "reentry_vector": _string(
            payload.get("reentry_vector"),
            field="execution_contract.route_contract.reentry_vector",
        ),
        "reentry_target_asset": _string(
            payload.get("reentry_target_asset"),
            field="execution_contract.route_contract.reentry_target_asset",
        ),
        "scope_binding": _string(
            payload.get("scope_binding"),
            field="execution_contract.route_contract.scope_binding",
        ),
        "operator_target_handle": _string(
            payload.get("operator_target_handle"),
            field="execution_contract.route_contract.operator_target_handle",
        ),
    }


def _execution_target(value: object) -> ExecutionTargetPayload:
    payload = _mapping(value, field="execution_contract.target_truth")
    kind = payload.get("kind")
    normalized_scope = _string(
        payload.get("normalized_scope"),
        field="execution_contract.target_truth.normalized_scope",
    )
    public_target = _string(
        payload.get("public_target"),
        field="execution_contract.target_truth.public_target",
    )
    until = _string(payload.get("until"), field="execution_contract.target_truth.until")
    if kind == "next":
        next_target: NextExecutionTargetPayload = {
            "normalized_scope": normalized_scope,
            "public_target": public_target,
            "until": until,
            "kind": "next",
        }
        edge_override = _optional_string(
            payload.get("edge_override"),
            field="execution_contract.target_truth.edge_override",
        )
        if edge_override is not None:
            next_target["edge_override"] = edge_override
        route_state = payload.get("route_state")
        if route_state is not None:
            next_target["route_state"] = _route_state(
                route_state,
                field="execution_contract.target_truth.route_state",
            )
        binding_source = _optional_string(
            payload.get("binding_source"),
            field="execution_contract.target_truth.binding_source",
        )
        if binding_source is not None:
            next_target["binding_source"] = binding_source
        return next_target
    if kind == "graph_function":
        return {
            "normalized_scope": normalized_scope,
            "public_target": public_target,
            "until": until,
            "kind": "graph_function",
            "handle": _string(payload.get("handle"), field="execution_contract.target_truth.handle"),
            "target_id": _string(payload.get("target_id"), field="execution_contract.target_truth.target_id"),
            "graph_function_name": _string(
                payload.get("graph_function_name"),
                field="execution_contract.target_truth.graph_function_name",
            ),
        }
    if kind == "asset":
        asset_target: AssetExecutionTargetPayload = {
            "normalized_scope": normalized_scope,
            "public_target": public_target,
            "until": until,
            "kind": "asset",
            "handle": _string(payload.get("handle"), field="execution_contract.target_truth.handle"),
            "target_id": _string(payload.get("target_id"), field="execution_contract.target_truth.target_id"),
            "graph_function_name": _string(
                payload.get("graph_function_name"),
                field="execution_contract.target_truth.graph_function_name",
            ),
            "asset_id": _string(payload.get("asset_id"), field="execution_contract.target_truth.asset_id"),
            "asset_uri": _string(payload.get("asset_uri"), field="execution_contract.target_truth.asset_uri"),
            "binding_source": _string(
                payload.get("binding_source"),
                field="execution_contract.target_truth.binding_source",
            ),
        }
        asset_relative_path = _optional_string(
            payload.get("asset_relative_path"),
            field="execution_contract.target_truth.asset_relative_path",
        )
        if asset_relative_path is not None:
            asset_target["asset_relative_path"] = asset_relative_path
        asset_path_kind = _optional_string(
            payload.get("asset_path_kind"),
            field="execution_contract.target_truth.asset_path_kind",
        )
        if asset_path_kind is not None:
            asset_target["asset_path_kind"] = asset_path_kind
        asset_exists = payload.get("asset_exists")
        if asset_exists is not None:
            asset_target["asset_exists"] = _bool(
                asset_exists,
                field="execution_contract.target_truth.asset_exists",
            )
        route_contract = payload.get("route_contract")
        if route_contract is not None:
            asset_target["route_contract"] = _work_item_route_contract(route_contract)
        ticket_id = _optional_string(
            payload.get("ticket_id"),
            field="execution_contract.target_truth.ticket_id",
        )
        if ticket_id is not None:
            asset_target["ticket_id"] = ticket_id
        ticket_relative_path = _optional_string(
            payload.get("ticket_relative_path"),
            field="execution_contract.target_truth.ticket_relative_path",
        )
        if ticket_relative_path is not None:
            asset_target["ticket_relative_path"] = ticket_relative_path
        ticket_target_truth = _optional_string(
            payload.get("ticket_target_truth"),
            field="execution_contract.target_truth.ticket_target_truth",
        )
        if ticket_target_truth is not None:
            asset_target["ticket_target_truth"] = ticket_target_truth
        return asset_target
    raise ValueError("execution_contract.target_truth.kind has invalid value")


def admit_runtime_event_payload(
    *,
    event_type: RuntimeEventType,
    data: object,
) -> RuntimeEventPayload:
    payload = _mapping(data, field=event_type)
    if event_type == "fh_gate_pending":
        evaluators = payload.get("evaluators")
        if evaluators != ["constitutional_pending_fh"]:
            raise ValueError("fh_gate_pending.evaluators must contain constitutional_pending_fh")
        return {
            "edge": _string(payload.get("edge"), field="fh_gate_pending.edge"),
            "evaluators": ["constitutional_pending_fh"],
            "criteria": _string_list(payload.get("criteria"), field="fh_gate_pending.criteria"),
        }
    if event_type == "asset_checkpoint_updated":
        return {
            "asset_id": _string(payload.get("asset_id"), field="asset_checkpoint_updated.asset_id"),
            "asset_uri": _string(payload.get("asset_uri"), field="asset_checkpoint_updated.asset_uri"),
            "declared_asset_type": _string(
                payload.get("declared_asset_type"),
                field="asset_checkpoint_updated.declared_asset_type",
            ),
            "mutable": _bool(payload.get("mutable"), field="asset_checkpoint_updated.mutable"),
            "manifest_id": _string(payload.get("manifest_id"), field="asset_checkpoint_updated.manifest_id"),
            "edge": _string(payload.get("edge"), field="asset_checkpoint_updated.edge"),
            "target_path": _string(payload.get("target_path"), field="asset_checkpoint_updated.target_path"),
            "previous_checkpoint": _asset_checkpoint(
                payload.get("previous_checkpoint"),
                field="asset_checkpoint_updated.previous_checkpoint",
            ),
            "current_checkpoint": _asset_checkpoint(
                payload.get("current_checkpoint"),
                field="asset_checkpoint_updated.current_checkpoint",
            ),
        }
    if event_type == "constitutional_proposal_approved_with_edits":
        return {
            "edge": _string(payload.get("edge"), field="constitutional_proposal_approved_with_edits.edge"),
            "proposal_id": _string(
                payload.get("proposal_id"),
                field="constitutional_proposal_approved_with_edits.proposal_id",
            ),
            "actor": _string(payload.get("actor"), field="constitutional_proposal_approved_with_edits.actor"),
        }
    if event_type == "proposal_applied":
        return {
            "edge": _string(payload.get("edge"), field="proposal_applied.edge"),
            "proposal_id": _string(payload.get("proposal_id"), field="proposal_applied.proposal_id"),
            "target_surface": _string(
                payload.get("target_surface"),
                field="proposal_applied.target_surface",
            ),
            "surface_digest": _string(
                payload.get("surface_digest"),
                field="proposal_applied.surface_digest",
            ),
            "actor": _string(payload.get("actor"), field="proposal_applied.actor"),
            "approval_event_id": _string(
                payload.get("approval_event_id"),
                field="proposal_applied.approval_event_id",
            ),
        }
    if event_type == "derivation_reopened":
        return {
            "edge": _string(payload.get("edge"), field="derivation_reopened.edge"),
            "proposal_id": _string(payload.get("proposal_id"), field="derivation_reopened.proposal_id"),
            "target_surface": _string(
                payload.get("target_surface"),
                field="derivation_reopened.target_surface",
            ),
            "surface_digest": _string(
                payload.get("surface_digest"),
                field="derivation_reopened.surface_digest",
            ),
        }
    if event_type == "gap_retired":
        return {
            "edge": _string(payload.get("edge"), field="gap_retired.edge"),
            "proposal_id": _string(payload.get("proposal_id"), field="gap_retired.proposal_id"),
            "target_surface": _string(payload.get("target_surface"), field="gap_retired.target_surface"),
            "surface_digest": _string(payload.get("surface_digest"), field="gap_retired.surface_digest"),
            "reopen_event_id": _string(payload.get("reopen_event_id"), field="gap_retired.reopen_event_id"),
        }
    if event_type == "gap_event":
        return {
            "edge": _string(payload.get("edge"), field="gap_event.edge"),
            "proposal_id": _string(payload.get("proposal_id"), field="gap_event.proposal_id"),
            "originating_gap_edge": _string(
                payload.get("originating_gap_edge"),
                field="gap_event.originating_gap_edge",
            ),
            "surface_digest": _string(payload.get("surface_digest"), field="gap_event.surface_digest"),
            "delta": _float(payload.get("delta"), field="gap_event.delta"),
            "failing": _string_list(payload.get("failing", []), field="gap_event.failing"),
            "reopen_event_id": _string(payload.get("reopen_event_id"), field="gap_event.reopen_event_id"),
        }
    if event_type == "observation_recorded":
        return {
            "kind": _kind(payload.get("kind"), field="observation_recorded.kind"),
            "edge": _string(payload.get("edge"), field="observation_recorded.edge"),
            "run_id": _optional_string(payload.get("run_id"), field="observation_recorded.run_id"),
            "observation_id": _string(
                payload.get("observation_id"),
                field="observation_recorded.observation_id",
            ),
            "analysis_fingerprint": _optional_string(
                payload.get("analysis_fingerprint"),
                field="observation_recorded.analysis_fingerprint",
            ),
            "observed_boundary": _string(
                payload.get("observed_boundary"),
                field="observation_recorded.observed_boundary",
            ),
            "observed_signal": _string(
                payload.get("observed_signal"),
                field="observation_recorded.observed_signal",
            ),
            "evidence": admit_evidence_items(payload.get("evidence")),
        }
    if event_type == "triage_produced":
        return {
            "kind": _kind(payload.get("kind"), field="triage_produced.kind"),
            "edge": _string(payload.get("edge"), field="triage_produced.edge"),
            "run_id": _optional_string(payload.get("run_id"), field="triage_produced.run_id"),
            "triage_id": _string(payload.get("triage_id"), field="triage_produced.triage_id"),
            "observation_id": _string(
                payload.get("observation_id"),
                field="triage_produced.observation_id",
            ),
            "prior_observation_id": _optional_string(
                payload.get("prior_observation_id"),
                field="triage_produced.prior_observation_id",
            ),
            "analysis_fingerprint": _optional_string(
                payload.get("analysis_fingerprint"),
                field="triage_produced.analysis_fingerprint",
            ),
            "triage_hash": _string(payload.get("triage_hash"), field="triage_produced.triage_hash"),
            "framework_layer": _string(
                payload.get("framework_layer"),
                field="triage_produced.framework_layer",
            ),
            "framework_condition": _string(
                payload.get("framework_condition"),
                field="triage_produced.framework_condition",
            ),
            "gap_kind": _string(payload.get("gap_kind"), field="triage_produced.gap_kind"),
            "process_outcome_kind": _string(
                payload.get("process_outcome_kind"),
                field="triage_produced.process_outcome_kind",
            ),
            "reentry_layer": _optional_string(
                payload.get("reentry_layer"),
                field="triage_produced.reentry_layer",
            ),
            "resumption_trigger": _optional_string(
                payload.get("resumption_trigger"),
                field="triage_produced.resumption_trigger",
            ),
            "authority_basis": _authority_basis(payload.get("authority_basis")),
            "realized_basis": _realized_basis(payload.get("realized_basis")),
            "asset_findings": _asset_findings(payload.get("asset_findings", [])),
            "evidence": admit_evidence_items(payload.get("evidence")),
            "realization_iteration": _realization_iteration(payload.get("realization_iteration")),
            "route_proposal": _route_proposal(payload.get("route_proposal")),
        }
    if event_type == "route_recorded":
        return {
            "kind": _kind(payload.get("kind"), field="route_recorded.kind"),
            "edge": _string(payload.get("edge"), field="route_recorded.edge"),
            "run_id": _optional_string(payload.get("run_id"), field="route_recorded.run_id"),
            "route_id": _string(payload.get("route_id"), field="route_recorded.route_id"),
            "triage_id": _string(payload.get("triage_id"), field="route_recorded.triage_id"),
            "analysis_fingerprint": _optional_string(
                payload.get("analysis_fingerprint"),
                field="route_recorded.analysis_fingerprint",
            ),
            "state": _route_state(payload.get("state"), field="route_recorded.state"),
            "vector_kind": _optional_route_proposal_vector_kind(
                payload.get("vector_kind"),
                field="route_recorded.vector_kind",
            ),
            "selected_vector": _optional_string(
                payload.get("selected_vector"),
                field="route_recorded.selected_vector",
            ),
            "dynamic_family": _optional_string(
                payload.get("dynamic_family"),
                field="route_recorded.dynamic_family",
            ),
            "selected_graphfunction": _optional_string(
                payload.get("selected_graphfunction"),
                field="route_recorded.selected_graphfunction",
            ),
            "target_assets": _string_list(
                payload.get("target_assets", []),
                field="route_recorded.target_assets",
            ),
            "priority_source": _string(
                payload.get("priority_source"),
                field="route_recorded.priority_source",
            ),
            "realization_iteration": _realization_iteration(payload.get("realization_iteration")),
            "no_lawful_route_reason": _optional_string(
                payload.get("no_lawful_route_reason"),
                field="route_recorded.no_lawful_route_reason",
            ),
        }
    if event_type == "constitutional_proposal_recorded":
        return {
            "kind": _kind(payload.get("kind"), field="constitutional_proposal_recorded.kind"),
            "edge": _string(payload.get("edge"), field="constitutional_proposal_recorded.edge"),
            "run_id": _optional_string(
                payload.get("run_id"),
                field="constitutional_proposal_recorded.run_id",
            ),
            "proposal_id": _string(
                payload.get("proposal_id"),
                field="constitutional_proposal_recorded.proposal_id",
            ),
            "triage_id": _string(payload.get("triage_id"), field="constitutional_proposal_recorded.triage_id"),
            "analysis_fingerprint": _optional_string(
                payload.get("analysis_fingerprint"),
                field="constitutional_proposal_recorded.analysis_fingerprint",
            ),
            "state": _constitutional_record_state(
                payload.get("state"),
                field="constitutional_proposal_recorded.state",
            ),
            "identity_hash": _string(
                payload.get("identity_hash"),
                field="constitutional_proposal_recorded.identity_hash",
            ),
            "policy_mode": _constitutional_policy_mode(
                payload.get("policy_mode"),
                field="constitutional_proposal_recorded.policy_mode",
            ),
            "proposal_kind": _proposal_kind(
                payload.get("proposal_kind"),
                field="constitutional_proposal_recorded.proposal_kind",
            ),
            "target_surface": _string(
                payload.get("target_surface"),
                field="constitutional_proposal_recorded.target_surface",
            ),
            "target_surface_digest": _string(
                payload.get("target_surface_digest"),
                field="constitutional_proposal_recorded.target_surface_digest",
            ),
            "reentry_layer": _reentry_layer_goals_or_intent(
                payload.get("reentry_layer"),
                field="constitutional_proposal_recorded.reentry_layer",
            ),
        }
    if event_type == "triage_divergence":
        return {
            "kind": _kind(payload.get("kind"), field="triage_divergence.kind"),
            "edge": _string(payload.get("edge"), field="triage_divergence.edge"),
            "run_id": _optional_string(payload.get("run_id"), field="triage_divergence.run_id"),
            "prior_triage_hash": _optional_string(
                payload.get("prior_triage_hash"),
                field="triage_divergence.prior_triage_hash",
            ),
            "current_triage_hash": _string(
                payload.get("current_triage_hash"),
                field="triage_divergence.current_triage_hash",
            ),
            "prior_triage_id": _optional_string(
                payload.get("prior_triage_id"),
                field="triage_divergence.prior_triage_id",
            ),
            "current_triage_id": _string(
                payload.get("current_triage_id"),
                field="triage_divergence.current_triage_id",
            ),
        }
    if event_type == "approved":
        return {
            "edge": _string(payload.get("edge"), field="approved.edge"),
            "actor": _string(payload.get("actor"), field="approved.actor"),
        }
    if event_type in {
        "execution_contract_drafted",
        "execution_contract_superseded",
        "execution_contract_rejected",
        "execution_contract_admitted",
    }:
        return {"execution_contract": _execution_contract_surface(payload.get("execution_contract"))}
    raise ValueError(f"unsupported runtime event type: {event_type}")


def serialize_runtime_event_payload(data: RuntimeEventPayload) -> dict[str, object]:
    return {str(key): value for key, value in data.items()}
