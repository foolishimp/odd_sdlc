# Implements: REQ-F-ODDSDLC-035
"""Published gap-analysis dossier surfaces for odd_sdlc."""
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping, Sequence

from .analysis import load_analysis_manifest
from .execution_contract import AdmittedExecutionContractProjection
from .project_profile import load_published_workspace_state, published_analysis_is_current
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
    observation: dict[str, Any]
    triage: dict[str, Any]
    route_binding: dict[str, Any]
    constitutional_proposal: dict[str, Any] | None


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
    proposal_kind: str
    proposal_state: str
    target_surface: str
    route_state: str
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

    def fh_gate_payload(self) -> dict[str, Any]:
        return {
            "edge": self.edge,
            "evaluators": ["constitutional_pending_fh"],
            "criteria": list(self.criteria),
        }

    def to_start_result(self) -> dict[str, Any]:
        return {
            "status": "pending",
            "target": "next",
            "edge": self.edge,
            "blocking_reason": "fh_gate",
            "stop_predicate": "human_gate_required",
            "stopped_by": "fh_gate",
            "fh_gate": self.fh_gate_payload(),
            "constitutional_proposal": {
                "proposal_id": self.proposal_id,
                "state": self.proposal_state,
                "proposal_kind": self.proposal_kind,
                "target_surface": self.target_surface,
                "resumption_trigger": self.resumption_trigger,
            },
            "route_binding": {
                "state": self.route_state,
            },
            "gap_dossier_register_path": self.gap_dossier_register_path,
            "gap_dossier_context_path": self.gap_dossier_context_path,
            "resumption_trigger": self.resumption_trigger,
            "triage_artifact_path": self.triage_artifact_path,
        }


@dataclass(frozen=True)
class PublicNextStartDirective:
    edge: str
    route_state: str
    raw_target: str
    edge_override: str | None
    binding_source: str
    triage_artifact_path: str | None
    gap_dossier_register_path: str | None
    gap_dossier_context_path: str | None


@dataclass(frozen=True)
class PublicNextStartBlock:
    blocking_reason: str
    stopped_by: str
    stop_predicate: str
    edge: str | None = None
    route_state: str | None = None
    resumption_trigger: str | None = None
    triage_artifact_path: str | None = None
    gap_dossier_register_path: str | None = None
    gap_dossier_context_path: str | None = None
    unavailable_reason: str | None = None
    status: str = "pending"

    def to_start_result(self) -> dict[str, Any]:
        result = {
            "status": self.status,
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


def _string_list(values: Any) -> list[str]:
    if not isinstance(values, (list, tuple)):
        return []
    return [str(value) for value in values if str(value)]


def normalize_gap_dossier_scope(scope: Any | None = None) -> str:
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
    kind = getattr(scope, "kind", None)
    if kind == "workspace":
        return "workspace"
    if kind == "work_key":
        work_key = str(getattr(scope, "work_key", "") or "").strip()
        if work_key:
            return f"work_key:{work_key}"
    raise ValueError(f"unsupported gap dossier scope: {scope!r}")


def _gap_dossier_relative_paths(scope: Any | None = None) -> tuple[Path, Path]:
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
    scope: Any | None = None,
) -> tuple[str | None, str | None]:
    register_rel, context_rel = _gap_dossier_relative_paths(scope)
    register_path = workspace_root / register_rel
    context_path = workspace_root / context_rel
    return (
        register_rel.as_posix() if register_path.exists() else None,
        context_rel.as_posix() if context_path.exists() else None,
    )


def _gap_truth_summary(gap: CanonicalEdgeGap) -> dict[str, Any]:
    payload = gap.to_dict()
    return {
        "gap_kind": str(payload.get("gap_kind") or ""),
        "graph_delta": payload.get("graph_delta"),
        "carry_delta": payload.get("carry_delta"),
        "fulfillment_delta": payload.get("fulfillment_delta"),
        "combined_delta": payload.get("combined_delta"),
        "total_delta": payload.get("total_delta"),
        "graph_converged": payload.get("graph_converged"),
        "carry_converged": payload.get("carry_converged"),
        "fulfillment_converged": payload.get("fulfillment_converged"),
        "edge_converged": payload.get("edge_converged"),
        "blocking_reasons": _string_list(payload.get("blocking_reasons")),
        "failing": _string_list(payload.get("failing")),
        "graph_failing": _string_list(payload.get("graph_failing")),
        "signal_key": str(payload.get("signal_key") or ""),
    }


def _evidence_bundle_refs(workspace_root: Path, row: GapDossierInputRow) -> dict[str, Any]:
    edge_name = row.edge
    refs: dict[str, Any] = {}
    if edge_name:
        triage_path = current_edge_triage_path(workspace_root, edge_name)
        refs["current_triage_artifact_path"] = triage_path.relative_to(workspace_root).as_posix()
    observation = row.observation
    triage = row.triage
    route_binding = row.route_binding
    constitutional = row.constitutional_proposal or {}
    for key, source in (
        ("observation_event_id", observation),
        ("triage_event_id", triage),
        ("route_event_id", route_binding),
        ("constitutional_event_id", constitutional),
    ):
        event_id = source.get("event_id") if key != "route_event_id" else source.get("route_event_id")
        if isinstance(event_id, str) and event_id:
            refs[key] = event_id
    return refs


def project_gap_dossier_input(
    *,
    gap_payload: Mapping[str, Any],
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
                observation=dict(metadata.get("observation") or {}),
                triage=dict(metadata.get("triage") or {}),
                route_binding=dict(metadata.get("route_binding") or {}),
                constitutional_proposal=(
                    dict(metadata.get("constitutional_proposal") or {})
                    if isinstance(metadata.get("constitutional_proposal"), Mapping)
                    else None
                ),
            )
        )
    return GapDossierInput(
        scope=normalize_gap_dossier_scope(gap_payload.get("scope")),
        jobs_considered=int(gap_payload.get("jobs_considered") or 0),
        open_frames=int(gap_payload.get("open_frames") or 0),
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
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    dossiers: list[dict[str, Any]] = []
    for row in gap_input.rows:
        triage = dict(row.triage)
        constitutional = (
            dict(row.constitutional_proposal)
            if isinstance(row.constitutional_proposal, dict)
            else None
        )
        resumption_trigger = ""
        if isinstance(constitutional, dict):
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
                "observation": dict(row.observation),
                "triage": triage,
                "route_binding": dict(row.route_binding),
                "constitutional_proposal": constitutional,
                "resumption_trigger": resumption_trigger or None,
                "evidence_bundle_refs": _evidence_bundle_refs(root, row),
            }
        )
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
        "summary": {
            "gap_count": len(dossiers),
            "declared_obligation_gap_count": gap_input.summary.declared_obligation_gap_count,
            "graph_edge_gap_count": gap_input.summary.graph_edge_gap_count,
            "mixed_truth_classes": gap_input.summary.mixed_truth_classes,
            "total_delta": gap_input.summary.total_delta,
            "graph_total_delta": gap_input.summary.graph_total_delta,
        },
        "dossiers": dossiers,
    }


def build_gap_dossier_context(
    workspace_root: Path | str,
    *,
    dossier_register: dict[str, Any],
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
        gap_truth = dict(dossier.get("gap_truth") or {})
        observation = dict(dossier.get("observation") or {})
        triage = dict(dossier.get("triage") or {})
        route_binding = dict(dossier.get("route_binding") or {})
        constitutional = dossier.get("constitutional_proposal")
        if not isinstance(constitutional, dict):
            constitutional = {}
        refs = dict(dossier.get("evidence_bundle_refs") or {})
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
        if constitutional:
            lines.append(
                f"- constitutional_state: `{str(constitutional.get('state') or '')}`"
            )
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def publish_gap_dossier_surfaces(
    workspace_root: Path | str,
    *,
    dossier_register: dict[str, Any],
) -> None:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(dossier_register.get("scope"))
    register_rel, context_rel = _gap_dossier_relative_paths(scope_label)
    write_json_if_changed(root / register_rel, dossier_register)
    write_text_if_changed(
        root / context_rel,
        build_gap_dossier_context(root, dossier_register=dossier_register),
    )


def load_published_gap_dossier_register(
    workspace_root: Path | str,
    *,
    scope: Any | None = None,
) -> dict[str, Any] | None:
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
    return json.loads(path.read_text(encoding="utf-8"))


def _gap_dossier_unavailable_reason(
    workspace_root: Path | str,
    *,
    scope: Any | None = None,
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
    scope: Any | None = None,
) -> dict[str, Any]:
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
    scope: Any | None = None,
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(scope)
    published = load_published_gap_dossier_register(root, scope=scope_label)
    if published is None:
        return unavailable_gap_dossier_projection(root, scope=scope_label)
    return project_gap_dossier_read_model(root, dossier_register=published)


def require_published_gap_dossier_read_model(
    workspace_root: Path | str,
    *,
    scope: Any | None = None,
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(scope)
    published = load_published_gap_dossier_register(root, scope=scope_label)
    if published is not None:
        return project_gap_dossier_read_model(root, dossier_register=published)
    reason = _gap_dossier_unavailable_reason(root, scope=scope_label)
    raise GapDossierUnavailableError(f"published gap dossier unavailable: {reason}")


def head_gap_dossier(gap_dossier_surface: Mapping[str, Any]) -> dict[str, Any] | None:
    dossiers = gap_dossier_surface.get("dossiers")
    if not isinstance(dossiers, (list, tuple)) or not dossiers:
        return None
    head = dossiers[0]
    if not isinstance(head, Mapping):
        return None
    return dict(head)


def project_pending_constitutional_start_gate(
    gap_dossier_surface: Mapping[str, Any],
) -> PendingConstitutionalStartGate | None:
    head = head_gap_dossier(gap_dossier_surface)
    if head is None:
        return None
    route_binding = head.get("route_binding")
    constitutional = head.get("constitutional_proposal")
    if not isinstance(route_binding, Mapping) or not isinstance(constitutional, Mapping):
        return None
    route_state = str(route_binding.get("state") or "")
    proposal_state = str(constitutional.get("state") or "")
    if route_state != "await_fh_resolution" or proposal_state != "pending_fh":
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
        proposal_kind=str(constitutional.get("proposal_kind") or ""),
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
    gap_dossier_surface: Mapping[str, Any],
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
    gap_dossier_surface: Mapping[str, Any],
) -> PublicNextStartDirective | None:
    head = head_gap_dossier(gap_dossier_surface)
    if head is None:
        return None
    route_binding = head.get("route_binding")
    if not isinstance(route_binding, Mapping):
        return None
    route_state = str(route_binding.get("state") or "")
    edge = str(head.get("edge") or "")
    raw_target: str | None = None
    edge_override: str | None = None
    if route_state == "advance_dynamic_family":
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
    gap_dossier_surface: Mapping[str, Any],
) -> PublicNextStartBlock | None:
    if project_unavailable_public_next_start_block(gap_dossier_surface) is not None:
        return None
    head = head_gap_dossier(gap_dossier_surface)
    if head is None:
        summary = gap_dossier_surface.get("summary")
        gap_count = None
        if isinstance(summary, Mapping):
            try:
                gap_count = int(summary.get("gap_count")) if summary.get("gap_count") is not None else None
            except (TypeError, ValueError):
                gap_count = None
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
        "advance_dynamic_family",
        "advance_fixed_vector",
        "constitutional_reprice_approved",
        "suppressed_by_mode",
    }:
        return None
    refs = head.get("evidence_bundle_refs")
    triage_artifact_path: str | None = None
    if isinstance(refs, Mapping):
        triage_artifact_path = str(refs.get("current_triage_artifact_path") or "") or None
    return PublicNextStartBlock(
        blocking_reason=route_state or "route_binding_not_start_authoritative",
        stopped_by="route_binding",
        stop_predicate="head_route_not_start_authoritative",
        edge=str(head.get("edge") or "") or None,
        route_state=route_state or None,
        resumption_trigger=str(head.get("resumption_trigger") or "") or None,
        triage_artifact_path=triage_artifact_path,
        gap_dossier_register_path=str(gap_dossier_surface.get("gap_dossier_register_path") or "") or None,
        gap_dossier_context_path=str(gap_dossier_surface.get("gap_dossier_context_path") or "") or None,
    )


def project_public_next_start_resolution(
    gap_dossier_surface: Mapping[str, Any],
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
    dossier_register: dict[str, Any],
    published: bool,
) -> dict[str, Any]:
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
            "scope": gap_input.scope,
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
    dossier_register: Mapping[str, Any],
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    scope_label = normalize_gap_dossier_scope(dossier_register.get("scope"))
    summary = dict(dossier_register.get("summary") or {})
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
        "converged": bool(summary.get("gap_count", 0) == 0),
        "graph_total_delta": summary.get("graph_total_delta", 0.0),
        "carry_delta": 0.0,
        "fulfillment_delta": 0.0,
        "combined_delta": summary.get("total_delta", 0.0),
        "total_delta": summary.get("total_delta", 0.0),
        "declared_obligation_gap_count": summary.get("declared_obligation_gap_count", 0),
        "graph_edge_gap_count": summary.get("graph_edge_gap_count", 0),
        "mixed_truth_classes": bool(summary.get("mixed_truth_classes")),
        "gap_dossier_kind": GAP_DOSSIER_KIND,
        "gap_dossier_register_path": register_path,
        "gap_dossier_context_path": context_path,
        "summary": summary,
        "dossiers": dossier_register.get("dossiers"),
    }
