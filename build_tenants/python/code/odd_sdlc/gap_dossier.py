# Implements: REQ-F-ODDSDLC-035
"""Published gap-analysis dossier surfaces for odd_sdlc."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .analysis import load_analysis_manifest
from .triage import current_edge_triage_path


GAP_DOSSIER_KIND = "odd_sdlc.gap_dossier_register"
GAP_DOSSIER_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-gap-dossiers.json")
GAP_DOSSIER_CONTEXT_PATH = Path(".ai-workspace/runtime/odd_sdlc-gap-dossiers.md")


def _write_json_if_changed(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(payload, indent=2, sort_keys=True)
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return
    path.write_text(content, encoding="utf-8")


def _write_text_if_changed(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return
    path.write_text(content, encoding="utf-8")


def _string_list(values: Any) -> list[str]:
    if not isinstance(values, (list, tuple)):
        return []
    return [str(value) for value in values if str(value)]


def _gap_truth_summary(gap: dict[str, Any]) -> dict[str, Any]:
    return {
        "gap_kind": str(gap.get("gap_kind") or ""),
        "graph_delta": gap.get("graph_delta"),
        "carry_delta": gap.get("carry_delta"),
        "fulfillment_delta": gap.get("fulfillment_delta"),
        "combined_delta": gap.get("combined_delta"),
        "total_delta": gap.get("total_delta"),
        "graph_converged": gap.get("graph_converged"),
        "carry_converged": gap.get("carry_converged"),
        "fulfillment_converged": gap.get("fulfillment_converged"),
        "edge_converged": gap.get("edge_converged"),
        "blocking_reasons": _string_list(gap.get("blocking_reasons")),
        "failing": _string_list(gap.get("failing")),
        "graph_failing": _string_list(gap.get("graph_failing")),
        "signal_key": str(gap.get("signal_key") or ""),
    }


def _evidence_bundle_refs(workspace_root: Path, gap: dict[str, Any]) -> dict[str, Any]:
    edge_name = str(gap.get("edge") or "")
    refs: dict[str, Any] = {}
    if edge_name:
        triage_path = current_edge_triage_path(workspace_root, edge_name)
        refs["current_triage_artifact_path"] = triage_path.relative_to(workspace_root).as_posix()
    observation = gap.get("observation") if isinstance(gap.get("observation"), dict) else {}
    triage = gap.get("triage") if isinstance(gap.get("triage"), dict) else {}
    route_binding = gap.get("route_binding") if isinstance(gap.get("route_binding"), dict) else {}
    constitutional = (
        gap.get("constitutional_proposal")
        if isinstance(gap.get("constitutional_proposal"), dict)
        else {}
    )
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


def build_gap_dossier_register(
    workspace_root: Path | str,
    *,
    gap_payload: dict[str, Any],
    summary: dict[str, Any],
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    gaps = [
        dict(entry)
        for entry in gap_payload.get("gaps", ())
        if isinstance(entry, dict) and str(entry.get("edge") or "")
    ]
    analysis_current = bool(gap_payload.get("analysis_current"))
    analysis_fingerprint = str(gap_payload.get("analysis_fingerprint") or "") or None
    dossiers: list[dict[str, Any]] = []
    for gap in gaps:
        triage = dict(gap.get("triage") or {})
        constitutional = gap.get("constitutional_proposal")
        if not isinstance(constitutional, dict):
            constitutional = None
        resumption_trigger = ""
        if isinstance(constitutional, dict):
            resumption_trigger = str(constitutional.get("resumption_trigger") or "")
        if not resumption_trigger:
            resumption_trigger = str(triage.get("resumption_trigger") or "")
        dossiers.append(
            {
                "edge": str(gap.get("edge") or ""),
                "analysis_current": analysis_current,
                "analysis_fingerprint": analysis_fingerprint,
                "current_work_key": str(gap.get("work_key") or "") or None,
                "gap_truth": _gap_truth_summary(gap),
                "observation": dict(gap.get("observation") or {}),
                "triage": triage,
                "route_binding": dict(gap.get("route_binding") or {}),
                "constitutional_proposal": constitutional,
                "resumption_trigger": resumption_trigger or None,
                "evidence_bundle_refs": _evidence_bundle_refs(root, gap),
            }
        )
    return {
        "gap_dossier_kind": GAP_DOSSIER_KIND,
        "schema_version": "v1",
        "workspace_root": str(root),
        "analysis_current": analysis_current,
        "analysis_fingerprint": analysis_fingerprint,
        "summary": {
            "gap_count": len(dossiers),
            "declared_obligation_gap_count": int(summary.get("declared_obligation_gap_count") or 0),
            "graph_edge_gap_count": int(summary.get("graph_edge_gap_count") or 0),
            "mixed_truth_classes": bool(summary.get("mixed_truth_classes")),
            "total_delta": float(summary.get("total_delta") or 0.0),
            "graph_total_delta": float(summary.get("graph_total_delta") or 0.0),
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
    _write_json_if_changed(root / GAP_DOSSIER_REGISTER_PATH, dossier_register)
    _write_text_if_changed(
        root / GAP_DOSSIER_CONTEXT_PATH,
        build_gap_dossier_context(root, dossier_register=dossier_register),
    )


def project_gap_dossier_surface(
    workspace_root: Path | str,
    *,
    gap_payload: dict[str, Any],
    dossier_register: dict[str, Any],
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    summary = dict(dossier_register.get("summary") or {})
    return {
        "scope": gap_payload.get("scope"),
        "jobs_considered": gap_payload.get("jobs_considered"),
        "open_frames": gap_payload.get("open_frames"),
        "analysis_current": bool(gap_payload.get("analysis_current")),
        "analysis_fingerprint": gap_payload.get("analysis_fingerprint"),
        "analysis_manifest": load_analysis_manifest(root),
        "converged": bool(summary.get("gap_count", 0) == 0),
        "graph_total_delta": float(summary.get("graph_total_delta") or 0.0),
        "carry_delta": float(gap_payload.get("carry_delta") or 0.0),
        "fulfillment_delta": float(gap_payload.get("fulfillment_delta") or 0.0),
        "combined_delta": float(gap_payload.get("combined_delta") or 0.0),
        "total_delta": float(summary.get("total_delta") or 0.0),
        "declared_obligation_gap_count": int(summary.get("declared_obligation_gap_count") or 0),
        "graph_edge_gap_count": int(summary.get("graph_edge_gap_count") or 0),
        "mixed_truth_classes": bool(summary.get("mixed_truth_classes")),
        "gap_dossier_kind": GAP_DOSSIER_KIND,
        "gap_dossier_register_path": GAP_DOSSIER_REGISTER_PATH.as_posix(),
        "gap_dossier_context_path": GAP_DOSSIER_CONTEXT_PATH.as_posix(),
        "summary": summary,
        "dossiers": dossier_register.get("dossiers"),
    }
