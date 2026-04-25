# Implements: REQ-F-ODDSDLC-003
"""Typed public-start admission and iteration outcome projection for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Literal, Mapping, assert_never, cast

from .gap_dossier import (
    PendingConstitutionalStartGate,
    PublicNextStartBlock,
    PublicNextStartDirective,
    PublicNextStartResolution,
)
from .public_start_contract import (
    BlockedReason,
    ConstitutionalProposalProjection,
    DispatchRequiredStartResult,
    FailureClass,
    FailureStartResult,
    FhGatePayload,
    HandoffKind,
    FirstTraversalStartResult,
    PendingConstitutionalStartResult,
    ProposalKind,
    ProposalState,
    ProofHoldPayload,
    ProofHoldStartResult,
    PublicStartStatus,
    PublicNextStartBlockedResult,
    PublicStartHumanGatePayload,
    PublicStartReturnPayload,
    ResolvedPolicyPayload,
    RouteState,
    RouteBindingProjection,
    StopPredicate,
    StoppedBy,
    TerminalStartResult,
    YieldedStartResult,
)
from .runtime_effects import publish_workspace_runtime_event
from .runtime_event_contract import admit_runtime_event_payload
from .public_start_subcarriers import (
    admit_fulfillment_assessments,
    admit_prompt_compactions,
    admit_published_fulfillment_ledger_ref,
    admit_resolved_policy_payload,
)
from .worker_attachment import (
    WorkerAttachmentProjectionPayload,
    dispatch_result_is_worker_unattached,
    project_unattached_worker_attachment,
)


@dataclass(frozen=True)
class PublicStartReturn:
    result: PublicStartReturnPayload
    reason: Literal[
        "first_traversal",
        "terminal",
        "blocked",
        "proof_hold",
        "yielded",
        "failure",
    ]


@dataclass(frozen=True)
class PublicStartRepublishAndContinue:
    republish_stage: Literal["public_start_next_traversal", "public_start_next_dispatch"]
    reason: Literal["traversal_applied", "dispatch_succeeded"]


@dataclass(frozen=True)
class PublicStartDispatchRequired:
    result: DispatchRequiredStartResult
    reason: Literal["dispatch_required"] = "dispatch_required"


@dataclass(frozen=True)
class PublicStartHumanGateRequired:
    result: PublicStartHumanGatePayload
    reason: Literal["human_gate_required"] = "human_gate_required"


@dataclass(frozen=True)
class PublicStartAdmissionDirective:
    raw_target: str
    carrier_basis: Literal["published_head_gap", "published_explicit_target"]
    edge_override: str | None = None
    route_state: RouteState | None = None
    binding_source: str | None = None
    triage_artifact_path: str | None = None
    gap_dossier_register_path: str | None = None
    gap_dossier_context_path: str | None = None


PublicStartIterationOutcome = (
    PublicStartReturn
    | PublicStartRepublishAndContinue
    | PublicStartDispatchRequired
    | PublicStartHumanGateRequired
)
PublicStartAdmissionResolution = (
    PendingConstitutionalStartGate
    | PublicNextStartBlock
    | PublicStartAdmissionDirective
)


def _string_value(payload: Mapping[str, object], key: str) -> str | None:
    value = payload.get(key)
    if isinstance(value, str) and value:
        return value
    return None


def _bool_value(payload: Mapping[str, object], key: str) -> bool | None:
    value = payload.get(key)
    if isinstance(value, bool):
        return value
    return None


def _int_value(payload: Mapping[str, object], key: str) -> int | None:
    value = payload.get(key)
    if isinstance(value, int) and not isinstance(value, bool):
        return value
    return None


def _fh_mode_value(payload: Mapping[str, object]) -> Literal["direct", "human-proxy"] | None:
    value = _string_value(payload, "fh_mode")
    if value in {"direct", "human-proxy"}:
        return cast(Literal["direct", "human-proxy"], value)
    return None


def _root_mode_value(payload: Mapping[str, object]) -> Literal["direct", "supervised"] | None:
    value = _string_value(payload, "root_mode")
    if value in {"direct", "supervised"}:
        return cast(Literal["direct", "supervised"], value)
    return None


def _route_state_value(value: object) -> RouteState | None:
    if value in {
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
    }:
        return cast(RouteState, value)
    return None


def _proposal_kind_value(value: object) -> ProposalKind | None:
    if value in {
        "goal_reprice",
        "intent_reprice",
        "product_reprice",
        "requirement_reprice",
        "design_reframe",
        "realization_refactor",
    }:
        return cast(ProposalKind, value)
    return None


def _proposal_state_value(value: object) -> ProposalState | None:
    if value in {
        "pending_fh",
        "approve_with_edits",
        "approved",
        "revoked",
        "defer",
        "suppressed",
    }:
        return cast(ProposalState, value)
    return None


def _public_start_status_value(value: object) -> PublicStartStatus | None:
    if value in {
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
    }:
        return cast(PublicStartStatus, value)
    return None


def _blocked_reason_value(value: object) -> BlockedReason | None:
    if value in {
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
    }:
        return cast(BlockedReason, value)
    return None


def _stopped_by_value(value: object) -> StoppedBy | None:
    if value in {
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
    }:
        return cast(StoppedBy, value)
    return None


def _failure_class_value(value: object) -> FailureClass | None:
    if value in {
        "transport_failure",
        "no_output",
        "contract_failure",
        "policy_config_defect",
        "runtime_defect",
        "proof_failure",
        "fd_findings",
    }:
        return cast(FailureClass, value)
    return None


def _route_binding_projection(payload: Mapping[str, object]) -> RouteBindingProjection | None:
    route_binding = payload.get("route_binding")
    if not isinstance(route_binding, Mapping):
        return None
    state = _route_state_value(route_binding.get("state"))
    if state is None:
        return None
    projected: RouteBindingProjection = {"state": state}
    selected_graphfunction = route_binding.get("selected_graphfunction")
    if isinstance(selected_graphfunction, str) and selected_graphfunction:
        projected["selected_graphfunction"] = selected_graphfunction
    return projected


def _constitutional_proposal_projection(
    payload: Mapping[str, object],
) -> ConstitutionalProposalProjection | None:
    proposal = payload.get("constitutional_proposal")
    if not isinstance(proposal, Mapping):
        return None
    proposal_id = proposal.get("proposal_id")
    if not isinstance(proposal_id, str) or not proposal_id:
        return None
    proposal_kind = _proposal_kind_value(proposal.get("proposal_kind"))
    if proposal_kind is None:
        return None
    state = _proposal_state_value(proposal.get("state"))
    if state is None:
        return None
    target_surface = proposal.get("target_surface")
    if not isinstance(target_surface, str) or not target_surface:
        return None
    projected: ConstitutionalProposalProjection = {
        "proposal_id": proposal_id,
        "proposal_kind": proposal_kind,
        "state": state,
        "target_surface": target_surface,
    }
    resumption_trigger = proposal.get("resumption_trigger")
    if isinstance(resumption_trigger, str) and resumption_trigger:
        projected["resumption_trigger"] = resumption_trigger
    target_surface_digest = proposal.get("target_surface_digest")
    if isinstance(target_surface_digest, str) and target_surface_digest:
        projected["target_surface_digest"] = target_surface_digest
    identity_hash = proposal.get("identity_hash")
    if isinstance(identity_hash, str) and identity_hash:
        projected["identity_hash"] = identity_hash
    event_id = proposal.get("event_id")
    if isinstance(event_id, str) and event_id:
        projected["event_id"] = event_id
    return projected


def _fh_gate_payload(payload: Mapping[str, object], *, edge: str) -> FhGatePayload | None:
    value = payload.get("fh_gate")
    if not isinstance(value, Mapping):
        return None
    gate_edge = value.get("edge")
    evaluators = value.get("evaluators")
    criteria = value.get("criteria")
    if not isinstance(gate_edge, str) or not gate_edge:
        gate_edge = edge
    if not isinstance(evaluators, list) or not isinstance(criteria, list):
        return None
    projected_criteria = [item for item in criteria if isinstance(item, str) and item]
    if not projected_criteria:
        return None
    if "constitutional_pending_fh" not in evaluators:
        return None
    return {
        "edge": gate_edge,
        "evaluators": ["constitutional_pending_fh"],
        "criteria": projected_criteria,
    }


def _as_first_traversal_result(payload: Mapping[str, object]) -> FirstTraversalStartResult:
    status = _public_start_status_value(payload.get("status")) or "iterated"
    result: FirstTraversalStartResult = {
        "status": status,
        "target": _string_value(payload, "target") or "next",
    }
    resolved_target = _string_value(payload, "resolved_target")
    if resolved_target is not None:
        result["resolved_target"] = resolved_target
    resolved_edge = _string_value(payload, "resolved_edge")
    if resolved_edge is not None:
        result["resolved_edge"] = resolved_edge
    edge = _string_value(payload, "edge")
    if edge is not None:
        result["edge"] = edge
    work_key = _string_value(payload, "work_key")
    if work_key is not None:
        result["work_key"] = work_key
    spec_hash = _string_value(payload, "spec_hash")
    if spec_hash is not None:
        result["spec_hash"] = spec_hash
    workflow_version = _string_value(payload, "workflow_version")
    if workflow_version is not None:
        result["workflow_version"] = workflow_version
    fh_mode = _fh_mode_value(payload)
    if fh_mode is not None:
        result["fh_mode"] = fh_mode
    root_mode = _root_mode_value(payload)
    if root_mode is not None:
        result["root_mode"] = root_mode
    return result


def _as_terminal_result(
    payload: Mapping[str, object],
    *,
    stop_predicate: Literal["converged", "no_open_gap", "gap_stop"],
) -> TerminalStartResult:
    status = _string_value(payload, "status")
    normalized_status: Literal["converged", "nothing_to_do"] = (
        "nothing_to_do" if status == "nothing_to_do" else "converged"
    )
    result: TerminalStartResult = {
        "status": normalized_status,
        "target": _string_value(payload, "target") or "next",
        "stop_predicate": stop_predicate,
    }
    stopped_by = _string_value(payload, "stopped_by")
    if stopped_by is not None:
        result["stopped_by"] = stopped_by
    resolved_target = _string_value(payload, "resolved_target")
    if resolved_target is not None:
        result["resolved_target"] = resolved_target
    resolved_edge = _string_value(payload, "resolved_edge")
    if resolved_edge is not None:
        result["resolved_edge"] = resolved_edge
    fh_mode = _fh_mode_value(payload)
    if fh_mode is not None:
        result["fh_mode"] = fh_mode
    root_mode = _root_mode_value(payload)
    if root_mode is not None:
        result["root_mode"] = root_mode
    return result


def _as_blocked_result(
    payload: Mapping[str, object],
    *,
    blocking_reason: BlockedReason,
    stop_predicate: StopPredicate,
    stopped_by: StoppedBy,
) -> PublicNextStartBlockedResult:
    result: PublicNextStartBlockedResult = {
        "status": "converged" if _string_value(payload, "status") == "converged" else "pending",
        "target": _string_value(payload, "target") or "next",
        "blocking_reason": blocking_reason,
        "stop_predicate": stop_predicate,
        "stopped_by": stopped_by,
    }
    route_binding = _route_binding_projection(payload)
    if route_binding is not None:
        result["route_binding"] = route_binding
    gap_dossier_register_path = _string_value(payload, "gap_dossier_register_path")
    if gap_dossier_register_path is not None:
        result["gap_dossier_register_path"] = gap_dossier_register_path
    gap_dossier_context_path = _string_value(payload, "gap_dossier_context_path")
    if gap_dossier_context_path is not None:
        result["gap_dossier_context_path"] = gap_dossier_context_path
    triage_artifact_path = _string_value(payload, "triage_artifact_path")
    if triage_artifact_path is not None:
        result["triage_artifact_path"] = triage_artifact_path
    resumption_trigger = _string_value(payload, "resumption_trigger")
    if resumption_trigger is not None:
        result["resumption_trigger"] = resumption_trigger
    unavailable_reason = _string_value(payload, "unavailable_reason")
    if unavailable_reason is not None:
        result["unavailable_reason"] = unavailable_reason
    resolved_target = _string_value(payload, "resolved_target")
    if resolved_target is not None:
        result["resolved_target"] = resolved_target
    resolved_edge = _string_value(payload, "resolved_edge")
    if resolved_edge is not None:
        result["resolved_edge"] = resolved_edge
    edge = _string_value(payload, "edge")
    if edge is not None:
        result["edge"] = edge
    fh_mode = _fh_mode_value(payload)
    if fh_mode is not None:
        result["fh_mode"] = fh_mode
    root_mode = _root_mode_value(payload)
    if root_mode is not None:
        result["root_mode"] = root_mode
    worker_attachment = payload.get("worker_attachment")
    if isinstance(worker_attachment, Mapping):
        result["worker_attachment"] = dict(worker_attachment)
    return result


def _as_worker_attachment_blocked_result(
    payload: Mapping[str, object],
    *,
    worker_attachment: Mapping[str, object],
) -> PublicNextStartBlockedResult:
    enriched = dict(payload)
    enriched["blocking_reason"] = "fp_worker_unattached"
    enriched["stop_predicate"] = "worker_attachment_required"
    enriched["stopped_by"] = "worker_attachment"
    enriched["unavailable_reason"] = str(
        worker_attachment.get("unavailable_reason")
        or "fp_worker_attachment_unavailable"
    )
    enriched["worker_attachment"] = dict(worker_attachment)
    return _as_blocked_result(
        enriched,
        blocking_reason="fp_worker_unattached",
        stop_predicate="worker_attachment_required",
        stopped_by="worker_attachment",
    )


def project_public_start_worker_attachment_block(
    result: Mapping[str, object],
    *,
    worker_attachment: WorkerAttachmentProjectionPayload,
) -> PublicStartReturn:
    return PublicStartReturn(
        _as_worker_attachment_blocked_result(
            result,
            worker_attachment=worker_attachment,
        ),
        reason="blocked",
    )


def _as_human_gate_result(payload: Mapping[str, object]) -> PublicStartHumanGatePayload:
    edge = _string_value(payload, "edge")
    proposal = _constitutional_proposal_projection(payload)
    route_binding = _route_binding_projection(payload)
    fh_gate = _fh_gate_payload(payload, edge=edge or "")
    if edge is None or proposal is None or route_binding is None or fh_gate is None:
        return _as_blocked_result(
            payload,
            blocking_reason="fh_gate",
            stop_predicate="human_gate_required",
            stopped_by="fh_gate",
        )
    result: PendingConstitutionalStartResult = {
        "status": "pending",
        "target": _string_value(payload, "target") or "next",
        "edge": edge,
        "blocking_reason": "fh_gate",
        "stop_predicate": "human_gate_required",
        "stopped_by": "fh_gate",
        "fh_gate": fh_gate,
        "constitutional_proposal": proposal,
        "route_binding": route_binding,
        "gap_dossier_register_path": _string_value(payload, "gap_dossier_register_path"),
        "gap_dossier_context_path": _string_value(payload, "gap_dossier_context_path"),
        "resumption_trigger": _string_value(payload, "resumption_trigger"),
        "triage_artifact_path": _string_value(payload, "triage_artifact_path"),
    }
    resolved_target = _string_value(payload, "resolved_target")
    if resolved_target is not None:
        result["resolved_target"] = resolved_target
    resolved_edge = _string_value(payload, "resolved_edge")
    if resolved_edge is not None:
        result["resolved_edge"] = resolved_edge
    fh_mode = _fh_mode_value(payload)
    if fh_mode is not None:
        result["fh_mode"] = fh_mode
    root_mode = _root_mode_value(payload)
    if root_mode is not None:
        result["root_mode"] = root_mode
    return result


def _as_dispatch_required_result(payload: Mapping[str, object]) -> DispatchRequiredStartResult:
    result: DispatchRequiredStartResult = {
        "status": "pending",
        "target": _string_value(payload, "target") or "next",
        "edge": _string_value(payload, "edge") or "",
        "blocking_reason": "fp_dispatch",
        "stop_predicate": "dispatch_required",
    }
    work_key = _string_value(payload, "work_key")
    if work_key is not None:
        result["work_key"] = work_key
    spec_hash = _string_value(payload, "spec_hash")
    if spec_hash is not None:
        result["spec_hash"] = spec_hash
    workflow_version = _string_value(payload, "workflow_version")
    if workflow_version is not None:
        result["workflow_version"] = workflow_version
    fp_manifest_path = _string_value(payload, "fp_manifest_path")
    if fp_manifest_path is not None:
        result["fp_manifest_path"] = fp_manifest_path
    manifest_id = _string_value(payload, "manifest_id")
    if manifest_id is not None:
        result["manifest_id"] = manifest_id
    call_id = _string_value(payload, "call_id")
    if call_id is not None:
        result["call_id"] = call_id
    resolved_policy = payload.get("resolved_policy")
    if resolved_policy is not None:
        result["resolved_policy"] = admit_resolved_policy_payload(resolved_policy)
    resolved_target = _string_value(payload, "resolved_target")
    if resolved_target is not None:
        result["resolved_target"] = resolved_target
    resolved_edge = _string_value(payload, "resolved_edge")
    if resolved_edge is not None:
        result["resolved_edge"] = resolved_edge
    fh_mode = _fh_mode_value(payload)
    if fh_mode is not None:
        result["fh_mode"] = fh_mode
    root_mode = _root_mode_value(payload)
    if root_mode is not None:
        result["root_mode"] = root_mode
    return result


def _as_proof_hold_result(
    payload: Mapping[str, object],
    *,
    proof_hold: ProofHoldPayload,
) -> ProofHoldStartResult:
    result: ProofHoldStartResult = {
        "status": "pending",
        "target": _string_value(payload, "target") or "next",
        "edge": _string_value(payload, "edge") or "",
        "stop_predicate": "proof_hold",
        "stopped_by": "proof_hold",
        "proof_hold": proof_hold,
        "proof_hold_active": True,
    }
    resolved_target = _string_value(payload, "resolved_target")
    if resolved_target is not None:
        result["resolved_target"] = resolved_target
    resolved_edge = _string_value(payload, "resolved_edge")
    if resolved_edge is not None:
        result["resolved_edge"] = resolved_edge
    work_key = _string_value(payload, "work_key")
    if work_key is not None:
        result["work_key"] = work_key
    spec_hash = _string_value(payload, "spec_hash")
    if spec_hash is not None:
        result["spec_hash"] = spec_hash
    workflow_version = _string_value(payload, "workflow_version")
    if workflow_version is not None:
        result["workflow_version"] = workflow_version
    fh_mode = _fh_mode_value(payload)
    if fh_mode is not None:
        result["fh_mode"] = fh_mode
    root_mode = _root_mode_value(payload)
    if root_mode is not None:
        result["root_mode"] = root_mode
    return result


def _as_yielded_result(payload: Mapping[str, object]) -> YieldedStartResult:
    handoff_kind = _string_value(payload, "handoff_kind")
    if handoff_kind not in {"retry", "repair", "fh_review", "observer_handoff"}:
        handoff_kind = "repair"
    normalized_handoff_kind = cast(HandoffKind, handoff_kind)
    result: YieldedStartResult = {
        "status": "yield",
        "target": _string_value(payload, "target") or "next",
        "stopped_by": "yield",
        "edge": _string_value(payload, "edge") or "",
        "call_id": _string_value(payload, "call_id") or "",
        "continuation_id": _string_value(payload, "continuation_id") or "",
        "handoff_kind": normalized_handoff_kind,
        "handoff_reason": _string_value(payload, "handoff_reason") or "",
        "failure_class": _failure_class_value(payload.get("failure_class")) or "runtime_defect",
    }
    run_id = _string_value(payload, "run_id")
    if run_id is not None:
        result["run_id"] = run_id
    result_path = _string_value(payload, "result_path")
    if result_path is not None:
        result["result_path"] = result_path
    manifest_id = _string_value(payload, "manifest_id")
    if manifest_id is not None:
        result["manifest_id"] = manifest_id
    spec_hash = _string_value(payload, "spec_hash")
    if spec_hash is not None:
        result["spec_hash"] = spec_hash
    workflow_version = _string_value(payload, "workflow_version")
    if workflow_version is not None:
        result["workflow_version"] = workflow_version
    events_emitted = _int_value(payload, "events_emitted")
    if events_emitted is not None:
        result["events_emitted"] = events_emitted
    published_ledger_ref = payload.get("published_ledger_ref")
    if published_ledger_ref is not None:
        result["published_ledger_ref"] = admit_published_fulfillment_ledger_ref(published_ledger_ref)
    prompt_compactions = payload.get("prompt_compactions")
    if prompt_compactions is not None:
        result["prompt_compactions"] = admit_prompt_compactions(prompt_compactions)
    fulfillment_assessments = payload.get("fulfillment_assessments")
    if fulfillment_assessments is not None:
        result["fulfillment_assessments"] = admit_fulfillment_assessments(fulfillment_assessments)
    resolved_target = _string_value(payload, "resolved_target")
    if resolved_target is not None:
        result["resolved_target"] = resolved_target
    resolved_edge = _string_value(payload, "resolved_edge")
    if resolved_edge is not None:
        result["resolved_edge"] = resolved_edge
    fh_mode = _fh_mode_value(payload)
    if fh_mode is not None:
        result["fh_mode"] = fh_mode
    root_mode = _root_mode_value(payload)
    if root_mode is not None:
        result["root_mode"] = root_mode
    return result


def _as_failure_result(payload: Mapping[str, object]) -> FailureStartResult:
    result: FailureStartResult = {
        "status": "error",
        "target": _string_value(payload, "target") or "next",
        "stopped_by": _stopped_by_value(payload.get("stopped_by")) or "fp_runtime_failure",
        "failure_class": _failure_class_value(payload.get("failure_class")) or "runtime_defect",
        "reason": _string_value(payload, "reason") or "public_start_failed",
    }
    resolved_target = _string_value(payload, "resolved_target")
    if resolved_target is not None:
        result["resolved_target"] = resolved_target
    resolved_edge = _string_value(payload, "resolved_edge")
    if resolved_edge is not None:
        result["resolved_edge"] = resolved_edge
    edge = _string_value(payload, "edge")
    if edge is not None:
        result["edge"] = edge
    fh_mode = _fh_mode_value(payload)
    if fh_mode is not None:
        result["fh_mode"] = fh_mode
    root_mode = _root_mode_value(payload)
    if root_mode is not None:
        result["root_mode"] = root_mode
    return result


def project_public_start_admission_for_next(
    resolution: PendingConstitutionalStartGate | PublicNextStartBlock | PublicNextStartDirective,
) -> PublicStartAdmissionResolution:
    if isinstance(resolution, PendingConstitutionalStartGate | PublicNextStartBlock):
        return resolution
    if isinstance(resolution, PublicNextStartDirective):
        return PublicStartAdmissionDirective(
            raw_target=resolution.raw_target,
            carrier_basis="published_head_gap",
            edge_override=resolution.edge_override,
            route_state=resolution.route_state,
            binding_source=resolution.binding_source,
            triage_artifact_path=resolution.triage_artifact_path,
            gap_dossier_register_path=resolution.gap_dossier_register_path,
            gap_dossier_context_path=resolution.gap_dossier_context_path,
        )
    assert_never(resolution)


def project_public_start_admission_for_explicit(
    *,
    raw_target: str,
    head_resolution: PublicNextStartResolution,
) -> PublicStartAdmissionResolution:
    if isinstance(head_resolution, PendingConstitutionalStartGate):
        return head_resolution
    if isinstance(head_resolution, PublicNextStartBlock):
        if head_resolution.stop_predicate in {
            "publish_gap_dossier",
            "published_head_gap_required",
            "published_head_route_required",
        }:
            return head_resolution
        return PublicStartAdmissionDirective(
            raw_target=str(raw_target),
            carrier_basis="published_explicit_target",
        )
    if isinstance(head_resolution, PublicNextStartDirective):
        return PublicStartAdmissionDirective(
            raw_target=str(raw_target),
            carrier_basis="published_explicit_target",
        )
    assert_never(head_resolution)


def _project_public_start_stop_predicate(result: Mapping[str, object]) -> StopPredicate | None:
    value = _string_value(result, "stop_predicate")
    if value in {
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
    }:
        return cast(StopPredicate, value)
    blocking_reason = _string_value(result, "blocking_reason")
    if blocking_reason == "fp_dispatch":
        return "dispatch_required"
    if blocking_reason == "fp_worker_unattached":
        return "worker_attachment_required"
    if blocking_reason == "fh_gate":
        return "human_gate_required"
    if blocking_reason == "fd_gap":
        return "gap_stop"
    if _string_value(result, "stopped_by") == "yield":
        return "yielded"
    status = _string_value(result, "status")
    if status == "converged":
        return "converged"
    if status in {"iterated", "in_progress", "queued", "needs_selection", "dispatched"}:
        return "traversal_applied"
    if status == "nothing_to_do":
        return "gap_stop"
    return None


def _stopped_by_for_public_start_stop_predicate(
    stop_predicate: StopPredicate | None,
) -> StoppedBy | None:
    mapping: dict[StopPredicate, StoppedBy | None] = {
        "dispatch_required": "fp_dispatch",
        "worker_attachment_required": "worker_attachment",
        "human_gate_required": "fh_gate",
        "gap_stop": "fd_gap",
        "yielded": "yield",
        "proof_hold": "proof_hold",
        "converged": None,
        "traversal_applied": None,
        "publish_gap_dossier": "published_gap_dossier",
        "published_head_gap_required": "published_gap_dossier",
        "published_head_route_required": "route_binding",
        "head_route_not_start_authoritative": "route_binding",
        "no_open_gap": "converged",
    }
    if stop_predicate is None:
        return None
    return mapping[stop_predicate]


def project_public_start_gen_start_outcome(
    result: Mapping[str, object],
    *,
    until: str,
    proof_hold: ProofHoldPayload | None = None,
) -> PublicStartIterationOutcome:
    if until == "first_traversal":
        return PublicStartReturn(_as_first_traversal_result(result), reason="first_traversal")

    status = _string_value(result, "status")
    if status in {"converged", "nothing_to_do"}:
        stop_predicate = _project_public_start_stop_predicate(result)
        terminal_predicate: Literal["converged", "no_open_gap", "gap_stop"]
        if stop_predicate == "no_open_gap":
            terminal_predicate = "no_open_gap"
        elif stop_predicate == "gap_stop":
            terminal_predicate = "gap_stop"
        else:
            terminal_predicate = "converged"
        return PublicStartReturn(
            _as_terminal_result(result, stop_predicate=terminal_predicate),
            reason="terminal",
        )

    stop_predicate = _project_public_start_stop_predicate(result)
    if stop_predicate == "traversal_applied":
        return PublicStartRepublishAndContinue(
            republish_stage="public_start_next_traversal",
            reason="traversal_applied",
        )

    if stop_predicate == "human_gate_required" and until == "converged":
        return PublicStartHumanGateRequired(_as_human_gate_result(result))

    if until == "blocked":
        return PublicStartReturn(
            _as_blocked_result(
                result,
                blocking_reason=_blocked_reason_value(result.get("blocking_reason"))
                or "public_next_start_unavailable",
                stop_predicate=stop_predicate or "gap_stop",
                stopped_by=_stopped_by_for_public_start_stop_predicate(stop_predicate) or "fd_gap",
            ),
            reason="blocked",
        )

    if stop_predicate == "dispatch_required":
        if proof_hold and proof_hold.get("held"):
            return PublicStartReturn(
                _as_proof_hold_result(result, proof_hold=proof_hold),
                reason="proof_hold",
            )
        return PublicStartDispatchRequired(_as_dispatch_required_result(result))

    if stop_predicate == "yielded":
        return PublicStartReturn(_as_yielded_result(result), reason="yielded")

    if status == "error" or _string_value(result, "failure_class") is not None:
        return PublicStartReturn(_as_failure_result(result), reason="failure")

    return PublicStartReturn(
        _as_blocked_result(
            result,
            blocking_reason=_blocked_reason_value(result.get("blocking_reason"))
            or "public_next_start_unavailable",
            stop_predicate=stop_predicate or "gap_stop",
            stopped_by=_stopped_by_for_public_start_stop_predicate(stop_predicate) or "fd_gap",
        ),
        reason="blocked",
    )


def project_public_start_dispatch_outcome(
    dispatch_result: Mapping[str, object],
) -> PublicStartIterationOutcome:
    status = _string_value(dispatch_result, "status")
    if status == "ok":
        return PublicStartRepublishAndContinue(
            republish_stage="public_start_next_dispatch",
            reason="dispatch_succeeded",
        )
    if status == "yield":
        return PublicStartReturn(_as_yielded_result(dispatch_result), reason="yielded")
    if dispatch_result_is_worker_unattached(dispatch_result):
        return project_public_start_worker_attachment_block(
            dispatch_result,
            worker_attachment=project_unattached_worker_attachment(
                reason=_string_value(dispatch_result, "reason")
                or "fp_worker_attachment_unavailable"
            ),
        )
    return PublicStartReturn(_as_failure_result(dispatch_result), reason="failure")


def resolve_public_start_result_policy(
    result: Mapping[str, object],
    workspace_root: Path | str,
) -> "ResolvedPolicyPayload | None":
    resolved_policy = result.get("resolved_policy")
    if resolved_policy is not None:
        return admit_resolved_policy_payload(resolved_policy)

    root = Path(workspace_root).resolve()
    manifest_path: Path | None = None
    manifest_path_value = _string_value(result, "fp_manifest_path")
    if manifest_path_value is not None:
        manifest_path = Path(manifest_path_value)
    else:
        manifest_id = _string_value(result, "manifest_id")
        if manifest_id is not None:
            manifest_path = root / ".ai-workspace" / "fp_manifests" / f"{manifest_id}.json"
    if manifest_path is None or not manifest_path.exists():
        return None
    try:
        raw_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    if not isinstance(raw_manifest, Mapping):
        return None
    manifest_policy = raw_manifest.get("resolved_policy")
    if manifest_policy is None:
        return None
    return admit_resolved_policy_payload(manifest_policy)


def emit_public_start_human_proxy_approval(
    workspace_root: Path | str,
    *,
    edge: str,
    workflow_version: str,
    work_key: str | None = None,
    run_id: str | None = None,
) -> dict[str, object]:
    root = Path(workspace_root).resolve()
    reviews_dir = root / ".ai-workspace" / "reviews"
    reviews_dir.mkdir(parents=True, exist_ok=True)
    proxy_log = reviews_dir / "human_proxy.log"
    with proxy_log.open("a", encoding="utf-8") as handle:
        handle.write(f"{datetime.now(timezone.utc).isoformat()} approved {edge}\n")

    event = publish_workspace_runtime_event(
        workspace_root=root,
        event_type="approved",
        data=admit_runtime_event_payload(
            event_type="approved",
            data={"edge": edge, "actor": "human_proxy"},
        ),
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        aggregate_type="review",
        aggregate_id=edge,
    )
    if not isinstance(event, Mapping):
        raise RuntimeError("publish_workspace_runtime_event returned a non-mapping review event")
    return {str(key): value for key, value in event.items()}
