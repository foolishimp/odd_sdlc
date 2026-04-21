# Implements: REQ-F-ODDSDLC-029
# Implements: REQ-F-ODDSDLC-030
"""Requirement closure report projections for odd_sdlc."""
from __future__ import annotations

from pathlib import Path
from typing import Any


def _format_id_lines(
    label: str,
    ids: tuple[str, ...],
    *,
    max_items: int = 12,
) -> list[str]:
    if not ids:
        return [f"- {label}: none"]
    shown = ids[:max_items]
    suffix = ""
    if len(ids) > max_items:
        suffix = f" (+{len(ids) - max_items} more)"
    return [f"- {label}: {', '.join(shown)}{suffix}"]


def _gap_ids(payload: dict[str, Any], key: str) -> tuple[str, ...]:
    gaps = payload.get("traceability_gaps")
    if not isinstance(gaps, dict):
        return ()
    value = gaps.get(key)
    if not isinstance(value, list):
        return ()
    return tuple(str(item) for item in value)


def _family_refs(
    payload: dict[str, Any],
    predicate,
) -> tuple[str, ...]:
    publication = payload.get("requirement_family_traceability")
    if not isinstance(publication, dict):
        return ()
    families = publication.get("families")
    if not isinstance(families, list):
        return ()
    refs: list[str] = []
    for entry in families:
        if isinstance(entry, dict) and predicate(entry):
            refs.append(str(entry.get("requirement_family_ref") or ""))
    return tuple(ref for ref in refs if ref)


def build_requirement_closure_prompt_context_from_register(
    payload: dict[str, Any],
    *,
    register_path: Path,
    generated_requirement_surface_path: Path,
    carries_field: str,
    authoring_design_field: str,
) -> str:
    summary = payload["summary"]
    missing_carry_publication_families = _family_refs(
        payload,
        lambda entry: carries_field in entry.get("missing_fields", ()),
    )
    missing_authoring_design_families = _family_refs(
        payload,
        lambda entry: authoring_design_field in entry.get("missing_fields", ()),
    )
    invalid_family_traceability_refs = _family_refs(
        payload,
        lambda entry: bool(entry.get("invalid_format_fields"))
        or bool(entry.get("invalid_carry_refs"))
        or bool(entry.get("invalid_authoring_design_refs")),
    )
    missing_design_backlink_families = _family_refs(
        payload,
        lambda entry: bool(entry.get("missing_authoring_design_backlinks")),
    )

    lines = [
        "# odd_sdlc Requirement Closure Builder Context",
        "",
        "Use this as a compact builder-facing summary of the live requirement closure state.",
        "Treat the generated requirement surface as the target asset under construction.",
        "Use the full closure register only when you need per-id detail.",
        "",
        "## Working Boundary",
        f"- target generated requirement surface: `{generated_requirement_surface_path.as_posix()}`",
        f"- full closure register for on-demand inspection: `{register_path.as_posix()}`",
        "- preserve authority ids and imported source boundaries; do not rewrite authority files to hide closure defects",
        "- reduce requirement-scope gaps in the generated requirement surface before asking for assessment",
        "",
        "## Summary",
        f"- total live requirements: {summary['total_live_requirements']}",
        f"- missing from current requirement surface: {summary['missing_from_current_requirement_surface']}",
        f"- missing intent ids from goals: {summary['missing_intent_ids_from_goals']}",
        f"- requirements missing code traceability: {summary['requirements_missing_code_traceability']}",
        f"- requirements missing planned test traceability: {summary['requirements_missing_planned_test_traceability']}",
        f"- requirements with unexpected planned test traceability: {summary['requirements_with_unexpected_planned_test_traceability']}",
        f"- requirements missing realized test traceability: {summary['requirements_missing_test_traceability']}",
        f"- requirements with unexpected realized test traceability: {summary['requirements_with_unexpected_realized_test_traceability']}",
        f"- requirement families missing carries publication: {summary['requirement_families_missing_carry_publication']}",
        f"- requirement families missing authoring design publication: {summary['requirement_families_missing_authoring_design_publication']}",
        f"- requirement family invalid trace refs: {summary['requirement_family_invalid_carry_refs'] + summary['requirement_family_invalid_authoring_design_refs']}",
        f"- requirement families missing reciprocal design backlink: {summary['requirement_family_missing_design_backlinks']}",
        f"- orphan code files: {summary['orphan_code_files']}",
        f"- orphan test files: {summary['orphan_test_files']}",
        "",
        "## Immediate Repair Signal",
        *_format_id_lines("missing from current requirement surface", _gap_ids(payload, "missing_requirement_ids_from_current_surface")),
        *_format_id_lines("intent ids still missing from goals", _gap_ids(payload, "missing_intent_ids_from_goals")),
        *_format_id_lines("requirement ids still missing code traceability", _gap_ids(payload, "missing_code_traceability_ids")),
        *_format_id_lines("requirement ids still missing planned test traceability", _gap_ids(payload, "missing_planned_test_traceability_ids")),
        *_format_id_lines("unexpected requirement ids claimed by planned tests", _gap_ids(payload, "unexpected_planned_test_traceability_ids")),
        *_format_id_lines("requirement ids still missing realized test traceability", _gap_ids(payload, "missing_realized_test_traceability_ids")),
        *_format_id_lines("unexpected requirement ids claimed by realized tests", _gap_ids(payload, "unexpected_realized_test_traceability_ids")),
        *_format_id_lines("requirement families still missing carries publication", missing_carry_publication_families),
        *_format_id_lines("requirement families still missing authoring design publication", missing_authoring_design_families),
        *_format_id_lines("requirement families with invalid trace refs", invalid_family_traceability_refs),
        *_format_id_lines("requirement families missing reciprocal design backlink", missing_design_backlink_families),
        "",
        "## Builder Law",
        "- inspect the current generated requirement surface first",
        "- continue from the current workspace state rather than restating the whole imported authority",
        "- use the full closure register only when the compact summary is insufficient for the next repair step",
    ]
    return "\n".join(lines) + "\n"
