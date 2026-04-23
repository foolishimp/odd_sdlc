# Implements: REQ-F-ODDSDLC-035
"""Published gap-analysis dossier surfaces for odd_sdlc."""
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping, Sequence, cast

from .analysis import load_analysis_manifest
from .execution_contract import (
    AdmittedExecutionContractProjection,
    normalize_execution_contract_surface_payload,
)
from .project_profile import load_published_workspace_state, published_analysis_is_current
from .public_start_contract import (
    BlockedReason,
    ConstitutionalProposalProjection,
    EvidenceBundleRefs,
    FhGatePayload,
    GapDossierReadModel,
    GapDossierRegisterPayload,
    GapDossierRow,
    GapDossierSummary,
    GapTruthProjection,
    ObservationProjection,
    PendingConstitutionalStartResult,
    ProposalKind,
    ProposalState,
    PublicNextStartBlockedResult,
    RealizationIterationProjection,
    RouteState,
    RouteBindingProjection,
    RetryClassification,
    StopPredicate,
    StoppedBy,
    TriageProjection,
)
from .public_start_subcarriers import admit_evidence_items
from .publication_io import write_json_if_changed, write_text_if_changed
from .span_analysis import CanonicalEdgeGap, EdgeGapTruthSummary
from .triage import current_edge_triage_path


GAP_DOSSIER_KIND = "odd_sdlc.gap_dossier_register"
GAP_DOSSIER_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-gap-dossiers.json")
GAP_DOSSIER_CONTEXT_PATH = Path(".ai-workspace/runtime/odd_sdlc-gap-dossiers.md")
_SCOPED_GAP_DOSSIER_DIR = Path(".ai-workspace/runtime/scoped_gap_dossiers")
_SCOPE_PATH_SAFE_RE = re.compile(r"[^A-Za-z0-9._-]+")


class GapDossierUnavailableError(ValueError):
    """Raised when public consumers require a published gap-dossier carrier."""


@dataclass(frozen=True)
class GapDossierInputRow:
    edge: str
    current_work_key: str | None
    gap_truth: CanonicalEdgeGap
    observation: ObservationProjection
    triage: TriageProjection
    route_binding: RouteBindingProjection
    constitutional_proposal: ConstitutionalProposalProjection | None


@dataclass(frozen=True)
class GapDossierInput:
    scope: str | None
    jobs_considered: int
    open_frames: int
    analysis_current: bool
    analysis_fingerprint: str | None
    summary: EdgeGapTruthSummary
    rows: tuple[GapDossierInputRow, ...]


@dataclass(frozen=True)
class PendingConstitutionalStartGate:
    edge: str
    proposal_id: str
    proposal_kind: ProposalKind
    proposal_state: ProposalState
    target_surface: str
    route_state: RouteState
    resumption_trigger: str | None
    constitutional_event_id: str | None
    triage_artifact_path: str | None
    gap_dossier_register_path: str | None
    gap_dossier_context_path: str | None

    @property
    def criteria(self) -> tuple[str, ...]:
        return (
            (
                f"constitutional proposal {self.proposal_id} for {self.target_surface} "
                f"remains {self.proposal_state}"
            ),
        )

    def fh_gate_payload(self) -> FhGatePayload:
        return {
            "edge": self.edge,
            "evaluators": ["constitutional_pending_fh"],
            "criteria": list(self.criteria),
        }

    def to_start_result(self) -> PendingConstitutionalStartResult:
        constitutional_proposal: ConstitutionalProposalProjection = {
            "proposal_id": self.proposal_id,
            "state": self.proposal_state,
            "proposal_kind": self.proposal_kind,
            "target_surface": self.target_surface,
        }
        if self.resumption_trigger is not None:
            constitutional_proposal["resumption_trigger"] = self.resumption_trigger
        result: PendingConstitutionalStartResult = {
            "status": "pending",
            "target": "next",
            "edge": self.edge,
            "blocking_reason": "fh_gate",
            "stop_predicate": "human_gate_required",
            "stopped_by": "fh_gate",
            "fh_gate": self.fh_gate_payload(),
            "constitutional_proposal": constitutional_proposal,
            "route_binding": {
                "state": self.route_state,
            },
            "gap_dossier_register_path": self.gap_dossier_register_path,
            "gap_dossier_context_path": self.gap_dossier_context_path,
            "resumption_trigger": self.resumption_trigger,
            "triage_artifact_path": self.triage_artifact_path,
        }
        return result


@dataclass(frozen=True)
class PublicNextStartDirective:
    edge: str
    route_state: RouteState
    raw_target: str
    edge_override: str | None
    binding_source: str
    triage_artifact_path: str | None
    gap_dossier_register_path: str | None
    gap_dossier_context_path: str | None


@dataclass(frozen=True)
class PublicNextStartBlock:
    blocking_reason: BlockedReason
    stopped_by: StoppedBy
    stop_predicate: StopPredicate
    edge: str | None = None
    route_state: RouteState | None = None
    resumption_trigger: str | None = None
    triage_artifact_path: str | None = None
    gap_dossier_register_path: str | None = None
    gap_dossier_context_path: str | None = None
    unavailable_reason: str | None = None
    status: str = "pending"

    def to_start_result(self) -> PublicNextStartBlockedResult:
        result: PublicNextStartBlockedResult = {
            "status": "converged" if self.status == "converged" else "pending",
            "target": "next",
            "blocking_reason": self.blocking_reason,
            "stop_predicate": self.stop_predicate,
            "stopped_by": self.stopped_by,
            "gap_dossier_register_path": self.gap_dossier_register_path,
            "gap_dossier_context_path": self.gap_dossier_context_path,
            "triage_artifact_path": self.triage_artifact_path,
            "resumption_trigger": self.resumption_trigger,
        }
        if self.edge is not None:
            result["edge"] = self.edge
        if self.route_state is not None:
            result["route_binding"] = {"state": self.route_state}
        if self.unavailable_reason is not None:
            result["unavailable_reason"] = self.unavailable_reason
        return result


PublicNextStartResolution = (
    PendingConstitutionalStartGate
    | PublicNextStartDirective
    | PublicNextStartBlock
)


def _string_list(values: object) -> list[str]:
    if not isinstance(values, (list, tuple)):
        return []
    return [str(value) for value in values if str(value)]


def _int_value(value: object, default: int = 0) -> int:
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str):
        try:
            return int(value)
        except ValueError:
            return default
    return default


def _float_value(value: object, default: float = 0.0) -> float:
    if isinstance(value, bool):
        return float(value)
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return default
    return default


def _retry_classification(value: object) -> RetryClassification | None:
    if value in {"deepening_eligible", "structurally_terminal"}:
        return cast(RetryClassification, value)
    return None


def _route_state(value: object) -> RouteState | None:
    if value in {
        "advance_declared_graph_function",
        "advance_dynamic_family",
        "advance_fixed_vector",
        "await_fh_resolution",
        "blocked_stale_analysis",
        "constitutional_reprice_approved",
        "constitutional_reprice_rejected",
        "deferred",
        "no_lawful_route",
        "suppressed_by_mode",
    }:
        return cast(RouteState, value)
    return None


def _proposal_kind(value: object) -> ProposalKind | None:
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


def _proposal_state(value: object) -> ProposalState | None:
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


def _blocked_reason_value(value: object) -> BlockedReason | None:
    if value in {
        "fh_gate",
        "published_gap_dossier_unavailable",
        "head_gap_unavailable",
        "route_binding_unavailable",
        "public_next_start_unavailable",
        "route_binding_not_start_authoritative",
        "converged",
        "advance_dynamic_family",
        "advance_fixed_vector",
        "await_fh_resolution",
        "blocked_stale_analysis",
        "constitutional_reprice_approved",
        "constitutional_reprice_rejected",
        "deferred",
        "no_lawful_route",
        "suppressed_by_mode",
    }:
        return cast(BlockedReason, value)
    return None


def normalize_gap_dossier_scope(scope: object | None = None) -> str:
    if scope is None:
        return "workspace"
    if isinstance(scope, Mapping):
        selector = scope.get("selector")
        if isinstance(selector, Mapping):
            kind = str(selector.get("kind") or "").strip()
            if kind == "workspace":
                return "workspace"
            if kind == "work_key":
                work_key = str(selector.get("work_key") or "").strip()
                if work_key:
                    return f"work_key:{work_key}"
        kind = str(scope.get("kind") or "").strip()
        if kind == "workspace":
            return "workspace"
        if kind == "work_key":
            work_key = str(scope.get("work_key") or "").strip()
            if work_key:
                return f"work_key:{work_key}"
        if not scope:
            return "workspace"
    if isinstance(scope, str):
        value = scope.strip()
        return value or "workspace"
    attr_kind: object = getattr(scope, "kind", None)
    if attr_kind == "workspace":
        return "workspace"
    if attr_kind == "work_key":
        work_key = str(getattr(scope, "work_key", "") or "").strip()
        if work_key:
            return f"work_key:{work_key}"
    raise ValueError(f"unsupported gap dossier scope: {scope!r}")


def _gap_dossier_relative_paths(scope: object | None = None) -> tuple[Path, Path]:
    scope_label = normalize_gap_dossier_scope(scope)
    if scope_label == "workspace":
        return GAP_DOSSIER_REGISTER_PATH, GAP_DOSSIER_CONTEXT_PATH
    slug = _SCOPE_PATH_SAFE_RE.sub("-", scope_label).strip("-") or "scope"
    digest = hashlib.sha256(scope_label.encode("utf-8")).hexdigest()[:12]
    base_name = f"odd_sdlc-gap-dossiers.{slug}.{digest}"
    return (
        _SCOPED_GAP_DOSSIER_DIR / f"{base_name}.json",
        _SCOPED_GAP_DOSSIER_DIR / f"{base_name}.md",
    )


def _published_gap_dossier_paths(
    workspace_root: Path,
    *,
    scope: object | None = None,
) -> tuple[str | None, str | None]:
    register_rel, context_rel = _gap_dossier_relative_paths(scope)
    register_path = workspace_root / register_rel
    context_path = workspace_root / context_rel
    return (
        register_rel.as_posix() if register_path.exists() else None,
        context_rel.as_posix() if context_path.exists() else None,
    )


def _gap_truth_summary(gap: CanonicalEdgeGap) -> GapTruthProjection:
    payload = gap.to_dict()
    return {
        "gap_kind": str(payload.get("gap_kind") or ""),
        "graph_delta": payload.get("graph_delta"),
        "carry_delta": payload.get("carry_delta"),
        "fulfillment_delta": payload.get("fulfillment_delta"),
        "combined_delta": payload.get("combined_delta"),
        "total_delta": payload.get("total_delta"),
        "graph_converged": bool(payload.get("graph_converged")),
        "carry_converged": bool(payload.get("carry_converged")),
        "fulfillment_converged": bool(payload.get("fulfillment_converged")),
        "edge_converged": bool(payload.get("edge_converged")),
        "blocking_reasons": _string_list(payload.get("blocking_reasons")),
        "failing": _string_list(payload.get("failing")),
        "graph_failing": _string_list(payload.get("graph_failing")),
        "signal_key": str(payload.get("signal_key") or ""),
    }


def _number_or_none(value: object) -> float | int | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return value
    return None


def _observation_projection(value: object) -> ObservationProjection:
    if not isinstance(value, Mapping):
        return {}
    projection: ObservationProjection = {}
    event_id = value.get("event_id")
    if isinstance(event_id, str) and event_id:
        projection["event_id"] = event_id
    observation_id = value.get("observation_id")
    if isinstance(observation_id, str) and observation_id:
        projection["observation_id"] = observation_id
    current_work_key = value.get("current_work_key")
    if isinstance(current_work_key, str) and current_work_key:
        projection["current_work_key"] = current_work_key
    work_key = value.get("work_key")
    if isinstance(work_key, str) and work_key:
        projection["work_key"] = work_key
    observed_boundary = value.get("observed_boundary")
    if isinstance(observed_boundary, str) and observed_boundary:
        projection["observed_boundary"] = observed_boundary
    observation_basis = value.get("observation_basis")
    if isinstance(observation_basis, str) and observation_basis:
        projection["observation_basis"] = observation_basis
    observed_signal = value.get("observed_signal")
    if isinstance(observed_signal, str) and observed_signal:
        projection["observed_signal"] = observed_signal
    evidence = value.get("evidence")
    if evidence is not None:
        projected_evidence = admit_evidence_items(evidence)
        if projected_evidence:
            projection["evidence"] = projected_evidence
    return projection


def _triage_projection(value: object) -> TriageProjection:
    if not isinstance(value, Mapping):
        return {}
    projection: TriageProjection = {}
    event_id = value.get("event_id")
    if isinstance(event_id, str) and event_id:
        projection["event_id"] = event_id
    triage_id = value.get("triage_id")
    if isinstance(triage_id, str) and triage_id:
        projection["triage_id"] = triage_id
    observation_id = value.get("observation_id")
    if isinstance(observation_id, str) and observation_id:
        projection["observation_id"] = observation_id
    prior_observation_id = value.get("prior_observation_id")
    if isinstance(prior_observation_id, str) and prior_observation_id:
        projection["prior_observation_id"] = prior_observation_id
    framework_layer = value.get("framework_layer")
    if isinstance(framework_layer, str) and framework_layer:
        projection["framework_layer"] = framework_layer
    framework_condition = value.get("framework_condition")
    if isinstance(framework_condition, str) and framework_condition:
        projection["framework_condition"] = framework_condition
    process_outcome_kind = value.get("process_outcome_kind")
    if isinstance(process_outcome_kind, str) and process_outcome_kind:
        projection["process_outcome_kind"] = process_outcome_kind
    reentry_layer = value.get("reentry_layer")
    if isinstance(reentry_layer, str) and reentry_layer:
        projection["reentry_layer"] = reentry_layer
    resumption_trigger = value.get("resumption_trigger")
    if isinstance(resumption_trigger, str) and resumption_trigger:
        projection["resumption_trigger"] = resumption_trigger
    route_state = value.get("route_state")
    if isinstance(route_state, str) and route_state:
        projection["route_state"] = route_state
    realization_iteration = value.get("realization_iteration")
    if isinstance(realization_iteration, Mapping):
        edge_id = realization_iteration.get("edge_id")
        evaluator_id = realization_iteration.get("evaluator_id")
        classification = _retry_classification(realization_iteration.get("classification"))
        deepening_eligible = realization_iteration.get("deepening_eligible")
        if (
            isinstance(edge_id, str)
            and edge_id
            and isinstance(evaluator_id, str)
            and evaluator_id
            and classification is not None
            and isinstance(deepening_eligible, bool)
        ):
            projected_iteration: RealizationIterationProjection = {
                "edge_id": edge_id,
                "evaluator_id": evaluator_id,
                "classification": classification,
                "deepening_eligible": deepening_eligible,
                "carry_delta": realization_iteration.get("carry_delta"),
                "dispatch_index": _int_value(realization_iteration.get("dispatch_index")),
            }
            projection["realization_iteration"] = projected_iteration
    evidence = value.get("evidence")
    if evidence is not None:
        projected_evidence = admit_evidence_items(evidence)
        if projected_evidence:
            projection["evidence"] = projected_evidence
    return projection


def _route_binding_projection(value: object) -> RouteBindingProjection:
    state: RouteState | None = None
    selected_graphfunction = None
    route_id = None
    route_event_id = None
    binding_source = None
    if isinstance(value, Mapping):
        state = _route_state(value.get("state"))
        selected_graphfunction = value.get("selected_graphfunction")
        route_id = value.get("route_id")
        route_event_id = value.get("route_event_id")
        binding_source = value.get("binding_source")
    projection: RouteBindingProjection = {"state": state or "blocked_stale_analysis"}
    if isinstance(route_id, str) and route_id:
        projection["route_id"] = route_id
    if isinstance(route_event_id, str) and route_event_id:
        projection["route_event_id"] = route_event_id
    if isinstance(binding_source, str) and binding_source:
        projection["binding_source"] = binding_source
    if isinstance(selected_graphfunction, str) and selected_graphfunction:
        projection["selected_graphfunction"] = selected_graphfunction
    return projection


def _gap_dossier_summary_projection(value: object) -> GapDossierSummary:
    if not isinstance(value, Mapping):
        return {}
    projection: GapDossierSummary = {}
    if "gap_count" in value:
        projection["gap_count"] = _int_value(value.get("gap_count"), default=0)
    if "declared_obligation_gap_count" in value:
        projection["declared_obligation_gap_count"] = _int_value(
            value.get("declared_obligation_gap_count"),
            default=0,
        )
    if "graph_edge_gap_count" in value:
        projection["graph_edge_gap_count"] = _int_value(
            value.get("graph_edge_gap_count"),
            default=0,
        )
    if "graph_total_delta" in value:
        projection["graph_total_delta"] = _float_value(
            value.get("graph_total_delta"),
            default=0.0,
        )
    if "total_delta" in value:
        projection["total_delta"] = _float_value(
            value.get("total_delta"),
            default=0.0,
        )
    mixed_truth_classes = value.get("mixed_truth_classes")
    if isinstance(mixed_truth_classes, bool):
        projection["mixed_truth_classes"] = mixed_truth_classes
    return projection


def _gap_truth_projection(value: object) -> GapTruthProjection:
    if not isinstance(value, Mapping):
        return {
            "gap_kind": "",
            "graph_delta": None,
            "carry_delta": None,
            "fulfillment_delta": None,
            "combined_delta": None,
            "total_delta": None,
            "graph_converged": False,
            "carry_converged": False,
            "fulfillment_converged": False,
            "edge_converged": False,
            "blocking_reasons": [],
            "failing": [],
            "graph_failing": [],
            "signal_key": "",
        }
    return {
        "gap_kind": str(value.get("gap_kind") or ""),
        "graph_delta": _number_or_none(value.get("graph_delta")),
        "carry_delta": _number_or_none(value.get("carry_delta")),
        "fulfillment_delta": _number_or_none(value.get("fulfillment_delta")),
        "combined_delta": _number_or_none(value.get("combined_delta")),
        "total_delta": _number_or_none(value.get("total_delta")),
        "graph_converged": bool(value.get("graph_converged")),
        "carry_converged": bool(value.get("carry_converged")),
        "fulfillment_converged": bool(value.get("fulfillment_converged")),
        "edge_converged": bool(value.get("edge_converged")),
        "blocking_reasons": _string_list(value.get("blocking_reasons")),
        "failing": _string_list(value.get("failing")),
        "graph_failing": _string_list(value.get("graph_failing")),
        "signal_key": str(value.get("signal_key") or ""),
    }


def _constitutional_proposal_projection(value: object) -> ConstitutionalProposalProjection | None:
    if not isinstance(value, Mapping):
        return None
    proposal_id = str(value.get("proposal_id") or "")
    proposal_kind = _proposal_kind(value.get("proposal_kind"))
    proposal_state = _proposal_state(value.get("state"))
    target_surface = str(value.get("target_surface") or "")
    if (
        not proposal_id
        or proposal_kind is None
        or proposal_state is None
        or not target_surface
    ):
        return None
    projection: ConstitutionalProposalProjection = {
        "proposal_id": proposal_id,
        "proposal_kind": proposal_kind,
        "state": proposal_state,
        "target_surface": target_surface,
    }
    resumption_trigger = value.get("resumption_trigger")
    if isinstance(resumption_trigger, str) and resumption_trigger:
        projection["resumption_trigger"] = resumption_trigger
    target_surface_digest = value.get("target_surface_digest")
    if isinstance(target_surface_digest, str) and target_surface_digest:
        projection["target_surface_digest"] = target_surface_digest
    identity_hash = value.get("identity_hash")
    if isinstance(identity_hash, str) and identity_hash:
        projection["identity_hash"] = identity_hash
    event_id = value.get("event_id")
    if isinstance(event_id, str) and event_id:
        projection["event_id"] = event_id
    return projection


def _copy_observation_projection(value: ObservationProjection) -> ObservationProjection:
    return _observation_projection(value)


def _copy_triage_projection(value: TriageProjection) -> TriageProjection:
    return _triage_projection(value)


def _copy_route_binding_projection(value: RouteBindingProjection) -> RouteBindingProjection:
    return _route_binding_projection(value)


def _copy_constitutional_proposal_projection(
    value: ConstitutionalProposalProjection | None,
) -> ConstitutionalProposalProjection | None:
    if value is None:
        return None
    return _constitutional_proposal_projection(value)


def _evidence_bundle_refs_projection(value: object) -> EvidenceBundleRefs:
    if not isinstance(value, Mapping):
        return {}
    projection: EvidenceBundleRefs = {}
    current_triage_artifact_path = value.get("current_triage_artifact_path")
    if isinstance(current_triage_artifact_path, str) and current_triage_artifact_path:
        projection["current_triage_artifact_path"] = current_triage_artifact_path
    observation_event_id = value.get("observation_event_id")
    if isinstance(observation_event_id, str) and observation_event_id:
        projection["observation_event_id"] = observation_event_id
    triage_event_id = value.get("triage_event_id")
    if isinstance(triage_event_id, str) and triage_event_id:
        projection["triage_event_id"] = triage_event_id
    route_event_id = value.get("route_event_id")
    if isinstance(route_event_id, str) and route_event_id:
        projection["route_event_id"] = route_event_id
    constitutional_event_id = value.get("constitutional_event_id")
    if isinstance(constitutional_event_id, str) and constitutional_event_id:
        projection["constitutional_event_id"] = constitutional_event_id
    return projection


def _gap_dossier_row_projection(value: object) -> GapDossierRow | None:
    if not isinstance(value, Mapping):
        return None
    edge = value.get("edge")
    if not isinstance(edge, str) or not edge:
        return None
    analysis_current = value.get("analysis_current")
    analysis_fingerprint = value.get("analysis_fingerprint")
    current_work_key = value.get("current_work_key")
    resumption_trigger = value.get("resumption_trigger")
    row: GapDossierRow = {
        "edge": edge,
        "analysis_current": bool(analysis_current),
        "analysis_fingerprint": analysis_fingerprint if isinstance(analysis_fingerprint, str) else None,
        "current_work_key": current_work_key if isinstance(current_work_key, str) else None,
        "gap_truth": _gap_truth_projection(value.get("gap_truth")),
        "observation": _observation_projection(value.get("observation")),
        "triage": _triage_projection(value.get("triage")),
        "route_binding": _route_binding_projection(value.get("route_binding")),
        "constitutional_proposal": _constitutional_proposal_projection(value.get("constitutional_proposal")),
        "resumption_trigger": resumption_trigger if isinstance(resumption_trigger, str) else None,
        "evidence_bundle_refs": _evidence_bundle_refs_projection(value.get("evidence_bundle_refs")),
    }
    return row


def _gap_dossier_register_projection(value: object) -> GapDossierRegisterPayload | None:
    if not isinstance(value, Mapping):
        return None
    gap_dossier_kind = value.get("gap_dossier_kind")
    schema_version = value.get("schema_version")
    workspace_root = value.get("workspace_root")
    scope = value.get("scope")
    if not isinstance(gap_dossier_kind, str) or not gap_dossier_kind:
        return None
    if not isinstance(schema_version, str) or not schema_version:
        return None
    if not isinstance(workspace_root, str) or not workspace_root:
        return None
    if not isinstance(scope, str) or not scope:
        return None
    dossiers_value = value.get("dossiers")
    if not isinstance(dossiers_value, list):
        return None
    dossiers: list[GapDossierRow] = []
    for raw_row in dossiers_value:
        projected_row = _gap_dossier_row_projection(raw_row)
        if projected_row is None:
            return None
        dossiers.append(projected_row)
    analysis_fingerprint = value.get("analysis_fingerprint")
    return {
        "gap_dossier_kind": gap_dossier_kind,
        "schema_version": schema_version,
        "workspace_root": workspace_root,
        "scope": scope,
        "execution_contract_surface": normalize_execution_contract_surface_payload(
            value.get("execution_contract_surface")
        ),
        "analysis_current": bool(value.get("analysis_current")),
        "analysis_fingerprint": analysis_fingerprint if isinstance(analysis_fingerprint, str) else None,
        "summary": _gap_dossier_summary_projection(value.get("summary")),
        "dossiers": dossiers,
    }


def _evidence_bundle_refs(workspace_root: Path, row: GapDossierInputRow) -> EvidenceBundleRefs:
    edge_name = row.edge
    refs: EvidenceBundleRefs = {}
    if edge_name:
        triage_path = current_edge_triage_path(workspace_root, edge_name)
        refs["current_triage_artifact_path"] = triage_path.relative_to(workspace_root).as_posix()
    observation = row.observation
    triage = row.triage
    route_binding = row.route_binding
    constitutional_value = row.constitutional_proposal
    constitutional: Mapping[str, object]
    if constitutional_value is None:
        constitutional = {}
    else:
        constitutional = constitutional_value
    for key, source in (
        ("observation_event_id", observation),
        ("triage_event_id", triage),
        ("route_event_id", route_binding),
        ("constitutional_event_id", constitutional),
    ):
        event_id = source.get("event_id") if key != "route_event_id" else source.get("route_event_id")
        if isinstance(event_id, str) and event_id:
            if key == "observation_event_id":
                refs["observation_event_id"] = event_id
            elif key == "triage_event_id":
                refs["triage_event_id"] = event_id
            elif key == "route_event_id":
                refs["route_event_id"] = event_id
            elif key == "constitutional_event_id":
                refs["constitutional_event_id"] = event_id
    return refs


def project_gap_dossier_input(
    *,
    gap_payload: Mapping[str, object],
    canonical_gaps: Sequence[CanonicalEdgeGap],
    summary: EdgeGapTruthSummary,
) -> GapDossierInput:
    rows: list[GapDossierInputRow] = []
    for gap in canonical_gaps:
        metadata = dict(gap.metadata)
        rows.append(
            GapDossierInputRow(
                edge=gap.edge,
                current_work_key=(
                    str(metadata.get("current_work_key") or metadata.get("work_key") or "") or None
                    if metadata.get("current_work_key") is not None
                    or metadata.get("work_key") is not None
                    else None
                ),
                gap_truth=gap,
                observation=_observation_projection(metadata.get("observation")),
                triage=_triage_projection(metadata.get("triage")),
                route_binding=_route_binding_projection(metadata.get("route_binding")),
                constitutional_proposal=_constitutional_proposal_projection(
                    metadata.get("constitutional_proposal")
                ),
            )
        )
    return GapDossierInput(
        scope=normalize_gap_dossier_scope(gap_payload.get("scope")),
        jobs_considered=_int_value(gap_payload.get("jobs_considered") or 0),
        open_frames=_int_value(gap_payload.get("open_frames") or 0),
        analysis_current=bool(gap_payload.get("analysis_current")),
        analysis_fingerprint=str(gap_payload.get("analysis_fingerprint") or "") or None,
        summary=summary,
        rows=tuple(rows),
    )


def build_gap_dossier_register(
    workspace_root: Path | str,
    *,
    gap_input: GapDossierInput,
    execution_contract: AdmittedExecutionContractProjection | None = None,
) -> GapDossierRegisterPayload:
    root = Path(workspace_root).resolve()
    dossiers: list[GapDossierRow] = []
    for row in gap_input.rows:
        triage = _copy_triage_projection(row.triage)
        constitutional = _copy_constitutional_proposal_projection(row.constitutional_proposal)
        resumption_trigger = ""
        if constitutional is not None:
            resumption_trigger = str(constitutional.get("resumption_trigger") or "")
        if not resumption_trigger:
            resumption_trigger = str(triage.get("resumption_trigger") or "")
        dossiers.append(
            {
                "edge": row.edge,
                "analysis_current": gap_input.analysis_current,
                "analysis_fingerprint": gap_input.analysis_fingerprint,
                "current_work_key": row.current_work_key,
                "gap_truth": _gap_truth_summary(row.gap_truth),
                "observation": _copy_observation_projection(row.observation),
                "triage": triage,
                "route_binding": _copy_route_binding_projection(row.route_binding),
                "constitutional_proposal": constitutional,
                "resumption_trigger": resumption_trigger or None,
                "evidence_bundle_refs": _evidence_bundle_refs(root, row),
            }
        )
    summary: GapDossierSummary = {
        "gap_count": len(dossiers),
        "declared_obligation_gap_count": gap_input.summary.declared_obligation_gap_count,
        "graph_edge_gap_count": gap_input.summary.graph_edge_gap_count,
        "mixed_truth_classes": gap_input.summary.mixed_truth_classes,
        "total_delta": gap_input.summary.total_delta,
        "graph_total_delta": gap_input.summary.graph_total_delta,
    }
    return {
        "gap_dossier_kind": GAP_DOSSIER_KIND,
        "schema_version": "v1",
        "workspace_root": str(root),
        "scope": gap_input.scope or "workspace",
        "execution_contract_surface": (
            execution_contract.to_dict() if execution_contract is not None else None
        ),
        "analysis_current": gap_input.analysis_current,
        "analysis_fingerprint": gap_input.analysis_fingerprint,
        "summary": summary,
        "dossiers": dossiers,
    }


def build_gap_dossier_context(
    workspace_root: Path | str,
    *,
    dossier_register: GapDossierRegisterPayload,
) -> str:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(dossier_register.get("scope"))
    summary = dict(dossier_register.get("summary") or {})
    execution_contract = (
        dossier_register.get("execution_contract_surface")
        if isinstance(dossier_register.get("execution_contract_surface"), Mapping)
        else None
    )
    dossiers = [
        dict(entry)
        for entry in dossier_register.get("dossiers", ())
        if isinstance(entry, dict)
    ]
    lines = [
        "# odd_sdlc Gap Analysis Dossiers",
        "",
        "Use this as the current edge-scoped review surface for why the worksite remains open.",
        "Each dossier is derived from current analysis, current triage, and the canonical gap row.",
        "",
        "## Summary",
        f"- workspace_root: `{root}`",
        f"- scope: `{scope_label}`",
        f"- analysis_current: {bool(dossier_register.get('analysis_current'))}",
        f"- analysis_fingerprint: `{str(dossier_register.get('analysis_fingerprint') or 'unpublished')}`",
        f"- gap_count: {summary.get('gap_count', 0)}",
        f"- declared_obligation_gap_count: {summary.get('declared_obligation_gap_count', 0)}",
        f"- graph_edge_gap_count: {summary.get('graph_edge_gap_count', 0)}",
        f"- mixed_truth_classes: {bool(summary.get('mixed_truth_classes'))}",
        f"- total_delta: {summary.get('total_delta', 0.0)}",
        "",
    ]
    if isinstance(execution_contract, Mapping):
        target_truth = execution_contract.get("target_truth")
        target_kind = (
            str(target_truth.get("kind") or "")
            if isinstance(target_truth, Mapping)
            else ""
        )
        lines.extend(
            [
                "## Execution Contract",
                f"- contract_id: `{str(execution_contract.get('contract_id') or '')}`",
                f"- source_kind: `{str(execution_contract.get('source_kind') or '')}`",
                f"- target_kind: `{target_kind}`",
                "",
            ]
        )
    for dossier in dossiers:
        gap_truth_value = dossier.get("gap_truth")
        gap_truth: Mapping[str, object] = gap_truth_value if isinstance(gap_truth_value, Mapping) else {}
        observation_value = dossier.get("observation")
        observation: Mapping[str, object] = (
            observation_value if isinstance(observation_value, Mapping) else {}
        )
        triage_value = dossier.get("triage")
        triage: Mapping[str, object] = triage_value if isinstance(triage_value, Mapping) else {}
        route_binding_value = dossier.get("route_binding")
        route_binding: Mapping[str, object] = (
            route_binding_value if isinstance(route_binding_value, Mapping) else {}
        )
        constitutional = dossier.get("constitutional_proposal")
        if not isinstance(constitutional, Mapping):
            constitutional = {}
        refs_value = dossier.get("evidence_bundle_refs")
        refs: Mapping[str, object] = refs_value if isinstance(refs_value, Mapping) else {}
        lines.extend(
            [
                f"## `{str(dossier.get('edge') or '')}`",
                f"- gap_kind: `{str(gap_truth.get('gap_kind') or '')}`",
                f"- observed_signal: `{str(observation.get('observed_signal') or '')}`",
                f"- process_outcome_kind: `{str(triage.get('process_outcome_kind') or '')}`",
                f"- route_state: `{str(route_binding.get('state') or '')}`",
                f"- reentry_layer: `{str(triage.get('reentry_layer') or '')}`",
                f"- resumption_trigger: `{str(dossier.get('resumption_trigger') or 'none')}`",
                f"- total_delta: {gap_truth.get('total_delta')}",
                f"- blocking_reasons: {', '.join(_string_list(gap_truth.get('blocking_reasons'))) or 'none'}",
                f"- triage_artifact: `{str(refs.get('current_triage_artifact_path') or '')}`",
            ]
        )
        realization_iteration = triage.get("realization_iteration")
        if isinstance(realization_iteration, Mapping):
            lines.extend(
                [
                    f"- realization_iteration.evaluator_id: `{str(realization_iteration.get('evaluator_id') or '')}`",
                    f"- realization_iteration.classification: `{str(realization_iteration.get('classification') or '')}`",
                    f"- realization_iteration.deepening_eligible: `{str(realization_iteration.get('deepening_eligible') or '')}`",
                    f"- realization_iteration.dispatch_index: `{str(realization_iteration.get('dispatch_index') or '')}`",
                    f"- realization_iteration.carry_delta: `{str(realization_iteration.get('carry_delta') or '')}`",
                ]
            )
        if constitutional:
            lines.append(
                f"- constitutional_state: `{str(constitutional.get('state') or '')}`"
            )
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def _gap_dossier_register_json_payload(
    dossier_register: GapDossierRegisterPayload,
) -> dict[str, object]:
    return {
        "gap_dossier_kind": dossier_register["gap_dossier_kind"],
        "schema_version": dossier_register["schema_version"],
        "workspace_root": dossier_register["workspace_root"],
        "scope": dossier_register["scope"],
        "execution_contract_surface": (
            dict(dossier_register["execution_contract_surface"])
            if dossier_register["execution_contract_surface"] is not None
            else None
        ),
        "analysis_current": dossier_register["analysis_current"],
        "analysis_fingerprint": dossier_register["analysis_fingerprint"],
        "summary": dict(dossier_register["summary"]),
        "dossiers": [
            {
                "edge": row["edge"],
                "analysis_current": row["analysis_current"],
                "analysis_fingerprint": row["analysis_fingerprint"],
                "current_work_key": row["current_work_key"],
                "gap_truth": dict(row["gap_truth"]),
                "observation": dict(row["observation"]),
                "triage": dict(row["triage"]),
                "route_binding": dict(row["route_binding"]),
                "constitutional_proposal": (
                    dict(row["constitutional_proposal"])
                    if row["constitutional_proposal"] is not None
                    else None
                ),
                "resumption_trigger": row["resumption_trigger"],
                "evidence_bundle_refs": dict(row["evidence_bundle_refs"]),
            }
            for row in dossier_register["dossiers"]
        ],
    }


def publish_gap_dossier_surfaces(
    workspace_root: Path | str,
    *,
    dossier_register: GapDossierRegisterPayload,
) -> None:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(dossier_register.get("scope"))
    register_rel, context_rel = _gap_dossier_relative_paths(scope_label)
    write_json_if_changed(
        root / register_rel,
        _gap_dossier_register_json_payload(dossier_register),
    )
    write_text_if_changed(
        root / context_rel,
        build_gap_dossier_context(root, dossier_register=dossier_register),
    )


def load_published_gap_dossier_register(
    workspace_root: Path | str,
    *,
    scope: object | None = None,
) -> GapDossierRegisterPayload | None:
    root = Path(workspace_root).resolve()
    workspace_state = load_published_workspace_state(root)
    if not isinstance(workspace_state, dict):
        return None
    if not published_analysis_is_current(root):
        return None
    register_rel, _ = _gap_dossier_relative_paths(scope)
    path = root / register_rel
    if not path.exists():
        return None
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return _gap_dossier_register_projection(payload)


def _gap_dossier_unavailable_reason(
    workspace_root: Path | str,
    *,
    scope: object | None = None,
) -> str:
    root = Path(workspace_root).resolve()
    workspace_state = load_published_workspace_state(root)
    if not isinstance(workspace_state, dict):
        return "workspace_state_unpublished"
    if not published_analysis_is_current(root):
        return "published_analysis_stale"
    register_rel, _ = _gap_dossier_relative_paths(scope)
    path = root / register_rel
    if not path.exists():
        return "gap_dossier_unpublished"
    return "gap_dossier_unavailable"


def unavailable_gap_dossier_projection(
    workspace_root: Path | str,
    *,
    scope: object | None = None,
) -> GapDossierReadModel:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(scope)
    register_path, context_path = _published_gap_dossier_paths(root, scope=scope_label)
    reason = _gap_dossier_unavailable_reason(root, scope=scope_label)
    workspace_state = load_published_workspace_state(root) or {}
    return {
        "scope": scope_label,
        "jobs_considered": 0,
        "open_frames": 0,
        "published": False,
        "unavailable_reason": reason,
        "execution_contract_surface": None,
        "analysis_current": published_analysis_is_current(root),
        "analysis_fingerprint": str(workspace_state.get("analysis_fingerprint") or "") or None,
        "analysis_manifest": load_analysis_manifest(root),
        "converged": False,
        "graph_total_delta": 0.0,
        "carry_delta": 0.0,
        "fulfillment_delta": 0.0,
        "combined_delta": 0.0,
        "total_delta": 0.0,
        "declared_obligation_gap_count": 0,
        "graph_edge_gap_count": 0,
        "mixed_truth_classes": False,
        "gap_dossier_kind": GAP_DOSSIER_KIND,
        "gap_dossier_register_path": register_path,
        "gap_dossier_context_path": context_path,
        "summary": {
            "published": False,
            "unavailable_reason": reason,
            "gap_count": 0,
        },
        "dossiers": [],
    }


def load_gap_dossier_read_model(
    workspace_root: Path | str,
    *,
    scope: object | None = None,
) -> GapDossierReadModel:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(scope)
    published = load_published_gap_dossier_register(root, scope=scope_label)
    if published is None:
        return unavailable_gap_dossier_projection(root, scope=scope_label)
    return project_gap_dossier_read_model(root, dossier_register=published)


def require_published_gap_dossier_read_model(
    workspace_root: Path | str,
    *,
    scope: object | None = None,
) -> GapDossierReadModel:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(scope)
    published = load_published_gap_dossier_register(root, scope=scope_label)
    if published is not None:
        return project_gap_dossier_read_model(root, dossier_register=published)
    reason = _gap_dossier_unavailable_reason(root, scope=scope_label)
    raise GapDossierUnavailableError(f"published gap dossier unavailable: {reason}")


def head_gap_dossier(gap_dossier_surface: GapDossierReadModel) -> GapDossierRow | None:
    dossiers = gap_dossier_surface.get("dossiers")
    if not isinstance(dossiers, (list, tuple)) or not dossiers:
        return None
    head = dossiers[0]
    return head


def project_pending_constitutional_start_gate(
    gap_dossier_surface: GapDossierReadModel,
) -> PendingConstitutionalStartGate | None:
    head = head_gap_dossier(gap_dossier_surface)
    if head is None:
        return None
    route_binding = head.get("route_binding")
    constitutional = head.get("constitutional_proposal")
    if not isinstance(route_binding, Mapping) or not isinstance(constitutional, Mapping):
        return None
    route_state = _route_state(route_binding.get("state"))
    proposal_state = _proposal_state(constitutional.get("state"))
    proposal_kind = _proposal_kind(constitutional.get("proposal_kind"))
    if route_state != "await_fh_resolution" or proposal_state != "pending_fh" or proposal_kind is None:
        return None
    refs = head.get("evidence_bundle_refs")
    triage_artifact_path: str | None = None
    constitutional_event_id: str | None = None
    if isinstance(refs, Mapping):
        triage_artifact_path = str(refs.get("current_triage_artifact_path") or "") or None
        constitutional_event_id = str(refs.get("constitutional_event_id") or "") or None
    return PendingConstitutionalStartGate(
        edge=str(head.get("edge") or ""),
        proposal_id=str(constitutional.get("proposal_id") or ""),
        proposal_kind=proposal_kind,
        proposal_state=proposal_state,
        target_surface=str(constitutional.get("target_surface") or ""),
        route_state=route_state,
        resumption_trigger=str(head.get("resumption_trigger") or "") or None,
        constitutional_event_id=constitutional_event_id,
        triage_artifact_path=triage_artifact_path,
        gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
        gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
    )


def project_unavailable_public_next_start_block(
    gap_dossier_surface: GapDossierReadModel,
) -> PublicNextStartBlock | None:
    if bool(gap_dossier_surface.get("published", True)):
        return None
    return PublicNextStartBlock(
        blocking_reason="published_gap_dossier_unavailable",
        stopped_by="published_gap_dossier",
        stop_predicate="publish_gap_dossier",
        gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
        gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
        unavailable_reason=str(gap_dossier_surface.get("unavailable_reason") or "") or None,
    )


def project_public_next_start_directive(
    gap_dossier_surface: GapDossierReadModel,
) -> PublicNextStartDirective | None:
    head = head_gap_dossier(gap_dossier_surface)
    if head is None:
        return None
    route_binding = head.get("route_binding")
    if not isinstance(route_binding, Mapping):
        return None
    route_state = _route_state(route_binding.get("state"))
    edge = str(head.get("edge") or "")
    raw_target: str | None = None
    edge_override: str | None = None
    if route_state is None:
        return None
    if route_state == "advance_declared_graph_function":
        if edge:
            raw_target = "next"
            edge_override = edge
    elif route_state == "advance_dynamic_family":
        graph_function_name = str(route_binding.get("selected_graphfunction") or "")
        if graph_function_name:
            raw_target = f"graph_function:{graph_function_name}"
    elif route_state in {
        "advance_fixed_vector",
        "constitutional_reprice_approved",
        "suppressed_by_mode",
    }:
        if edge:
            raw_target = "next"
            edge_override = edge
    if raw_target is None:
        return None
    refs = head.get("evidence_bundle_refs")
    triage_artifact_path: str | None = None
    if isinstance(refs, Mapping):
        triage_artifact_path = str(refs.get("current_triage_artifact_path") or "") or None
    return PublicNextStartDirective(
        edge=edge,
        route_state=route_state,
        raw_target=raw_target,
        edge_override=edge_override,
        binding_source=GAP_DOSSIER_KIND,
        triage_artifact_path=triage_artifact_path,
        gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
        gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
    )


def project_blocked_public_next_start_block(
    gap_dossier_surface: GapDossierReadModel,
) -> PublicNextStartBlock | None:
    if project_unavailable_public_next_start_block(gap_dossier_surface) is not None:
        return None
    head = head_gap_dossier(gap_dossier_surface)
    if head is None:
        summary = gap_dossier_surface.get("summary")
        gap_count = None
        if isinstance(summary, Mapping):
            raw_gap_count = summary.get("gap_count")
            gap_count = _int_value(raw_gap_count) if raw_gap_count is not None else None
        if bool(gap_dossier_surface.get("converged")) or gap_count == 0:
            return PublicNextStartBlock(
                status="converged",
                blocking_reason="converged",
                stopped_by="converged",
                stop_predicate="no_open_gap",
                gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
                gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
            )
        return PublicNextStartBlock(
            blocking_reason="head_gap_unavailable",
            stopped_by="route_binding",
            stop_predicate="published_head_gap_required",
            gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
            gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
        )
    route_binding = head.get("route_binding")
    if not isinstance(route_binding, Mapping):
        return PublicNextStartBlock(
            blocking_reason="route_binding_unavailable",
            stopped_by="route_binding",
            stop_predicate="published_head_route_required",
            edge=str(head.get("edge") or "") or None,
            gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
            gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
        )
    route_state = str(route_binding.get("state") or "")
    if route_state in {
        "advance_declared_graph_function",
        "advance_dynamic_family",
        "advance_fixed_vector",
        "constitutional_reprice_approved",
        "suppressed_by_mode",
    }:
        return None
    blocking_reason = _blocked_reason_value(route_state) or "route_binding_not_start_authoritative"
    route_state_value = _route_state(route_state)
    refs = head.get("evidence_bundle_refs")
    triage_artifact_path: str | None = None
    if isinstance(refs, Mapping):
        triage_artifact_path = str(refs.get("current_triage_artifact_path") or "") or None
    return PublicNextStartBlock(
        blocking_reason=blocking_reason,
        stopped_by="route_binding",
        stop_predicate="head_route_not_start_authoritative",
        edge=str(head.get("edge") or "") or None,
        route_state=route_state_value,
        resumption_trigger=str(head.get("resumption_trigger") or "") or None,
        triage_artifact_path=triage_artifact_path,
        gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
        gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
    )


def project_public_next_start_resolution(
    gap_dossier_surface: GapDossierReadModel,
) -> PublicNextStartResolution:
    unavailable = project_unavailable_public_next_start_block(gap_dossier_surface)
    if unavailable is not None:
        return unavailable
    pending_gate = project_pending_constitutional_start_gate(gap_dossier_surface)
    if pending_gate is not None:
        return pending_gate
    blocked = project_blocked_public_next_start_block(gap_dossier_surface)
    if blocked is not None:
        return blocked
    directive = project_public_next_start_directive(gap_dossier_surface)
    if directive is not None:
        return directive
    return PublicNextStartBlock(
        blocking_reason="public_next_start_unavailable",
        stopped_by="route_binding",
        stop_predicate="published_head_route_required",
        gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
        gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
    )


def project_gap_dossier_surface(
    workspace_root: Path | str,
    *,
    gap_input: GapDossierInput,
    dossier_register: GapDossierRegisterPayload,
    published: bool,
) -> GapDossierReadModel:
    read_model = project_gap_dossier_read_model(
        workspace_root,
        dossier_register=dossier_register,
    )
    if not published:
        read_model["published"] = False
        read_model["gap_dossier_register_path"] = None
        read_model["gap_dossier_context_path"] = None
    read_model.update(
        {
            "scope": gap_input.scope or "workspace",
            "jobs_considered": gap_input.jobs_considered,
            "open_frames": gap_input.open_frames,
            "analysis_current": gap_input.analysis_current,
            "analysis_fingerprint": gap_input.analysis_fingerprint,
            "converged": bool(dict(dossier_register.get("summary") or {}).get("gap_count", 0) == 0),
            "graph_total_delta": gap_input.summary.graph_total_delta,
            "carry_delta": gap_input.summary.carry_delta,
            "fulfillment_delta": gap_input.summary.fulfillment_delta,
            "combined_delta": gap_input.summary.combined_delta,
            "total_delta": gap_input.summary.total_delta,
            "declared_obligation_gap_count": gap_input.summary.declared_obligation_gap_count,
            "graph_edge_gap_count": gap_input.summary.graph_edge_gap_count,
            "mixed_truth_classes": gap_input.summary.mixed_truth_classes,
        }
    )
    return read_model


def project_gap_dossier_read_model(
    workspace_root: Path | str,
    *,
    dossier_register: GapDossierRegisterPayload,
) -> GapDossierReadModel:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(dossier_register.get("scope"))
    summary = _gap_dossier_summary_projection(dossier_register.get("summary"))
    register_path, context_path = _published_gap_dossier_paths(root, scope=scope_label)
    return {
        "scope": scope_label,
        "jobs_considered": 0,
        "open_frames": 0,
        "published": True,
        "execution_contract_surface": dossier_register.get("execution_contract_surface"),
        "analysis_current": published_analysis_is_current(root),
        "analysis_fingerprint": str(dossier_register.get("analysis_fingerprint") or "") or None,
        "analysis_manifest": load_analysis_manifest(root),
        "converged": bool(_int_value(summary.get("gap_count", 0)) == 0),
        "graph_total_delta": _float_value(summary.get("graph_total_delta", 0.0)),
        "carry_delta": 0.0,
        "fulfillment_delta": 0.0,
        "combined_delta": _float_value(summary.get("total_delta", 0.0)),
        "total_delta": _float_value(summary.get("total_delta", 0.0)),
        "declared_obligation_gap_count": _int_value(summary.get("declared_obligation_gap_count", 0)),
        "graph_edge_gap_count": _int_value(summary.get("graph_edge_gap_count", 0)),
        "mixed_truth_classes": bool(summary.get("mixed_truth_classes")),
        "gap_dossier_kind": GAP_DOSSIER_KIND,
        "gap_dossier_register_path": register_path,
        "gap_dossier_context_path": context_path,
        "summary": summary,
        "dossiers": dossier_register.get("dossiers") or [],
    }
