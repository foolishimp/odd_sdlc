# Implements: REQ-F-ODDSDLC-035
"""Published gap-analysis dossier surfaces for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping, Sequence

from .analysis import load_analysis_manifest
from .execution_contract import AdmittedExecutionContractProjection
from .publication_io import write_json_if_changed, write_text_if_changed
from .span_analysis import CanonicalEdgeGap, EdgeGapTruthSummary
from .triage import current_edge_triage_path


GAP_DOSSIER_KIND = "odd_sdlc.gap_dossier_register"
GAP_DOSSIER_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-gap-dossiers.json")
GAP_DOSSIER_CONTEXT_PATH = Path(".ai-workspace/runtime/odd_sdlc-gap-dossiers.md")


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


def _string_list(values: Any) -> list[str]:
    if not isinstance(values, (list, tuple)):
        return []
    return [str(value) for value in values if str(value)]


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
        scope=str(gap_payload.get("scope") or "") or None,
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
    write_json_if_changed(root / GAP_DOSSIER_REGISTER_PATH, dossier_register)
    write_text_if_changed(
        root / GAP_DOSSIER_CONTEXT_PATH,
        build_gap_dossier_context(root, dossier_register=dossier_register),
    )


def project_gap_dossier_surface(
    workspace_root: Path | str,
    *,
    gap_input: GapDossierInput,
    dossier_register: dict[str, Any],
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    summary = dict(dossier_register.get("summary") or {})
    return {
        "scope": gap_input.scope,
        "jobs_considered": gap_input.jobs_considered,
        "open_frames": gap_input.open_frames,
        "execution_contract_surface": dossier_register.get("execution_contract_surface"),
        "analysis_current": gap_input.analysis_current,
        "analysis_fingerprint": gap_input.analysis_fingerprint,
        "analysis_manifest": load_analysis_manifest(root),
        "converged": bool(summary.get("gap_count", 0) == 0),
        "graph_total_delta": gap_input.summary.graph_total_delta,
        "carry_delta": gap_input.summary.carry_delta,
        "fulfillment_delta": gap_input.summary.fulfillment_delta,
        "combined_delta": gap_input.summary.combined_delta,
        "total_delta": gap_input.summary.total_delta,
        "declared_obligation_gap_count": gap_input.summary.declared_obligation_gap_count,
        "graph_edge_gap_count": gap_input.summary.graph_edge_gap_count,
        "mixed_truth_classes": gap_input.summary.mixed_truth_classes,
        "gap_dossier_kind": GAP_DOSSIER_KIND,
        "gap_dossier_register_path": GAP_DOSSIER_REGISTER_PATH.as_posix(),
        "gap_dossier_context_path": GAP_DOSSIER_CONTEXT_PATH.as_posix(),
        "summary": summary,
        "dossiers": dossier_register.get("dossiers"),
    }
