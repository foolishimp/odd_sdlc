"""Admitted completeness carrier for the odd_sdlc test lane."""
from __future__ import annotations

from pathlib import Path
from typing import Literal, Mapping, TypeAlias, TypedDict

from .traceability_index import RequirementTraceabilityIndex, build_requirement_traceability_index
from .workspace_assets import TestEvidenceSummary, summarize_test_evidence


TestLaneCompletenessState: TypeAlias = Literal[
    "planned_validation_allocation",
    "realized_test_source",
    "governed_test_execution_evidence",
]
TestLaneNextLawfulGain: TypeAlias = Literal[
    "materialize_realized_test_source",
    "record_governed_test_execution_evidence",
    "none",
]


class TestLaneEvidencePayload(TypedDict):
    projection_kind: str
    completeness_state: TestLaneCompletenessState
    next_lawful_gain: TestLaneNextLawfulGain
    blocking_reasons: list[str]
    planned_requirement_ids: list[str]
    realized_test_source_requirement_ids: list[str]
    archive_requirement_ids: list[str]
    evidence_refs: list[str]
    report_paths: list[str]
    report_file_count: int
    parsed_report_count: int
    test_source_file_count: int


def _require_string(value: object, *, field: str) -> str:
    if isinstance(value, str) and value:
        return value
    raise ValueError(f"test-lane evidence payload field {field!r} must be a non-empty string")


def _require_string_list(value: object, *, field: str) -> list[str]:
    if not isinstance(value, list):
        raise ValueError(f"test-lane evidence payload field {field!r} must be a list[str]")
    normalized: list[str] = []
    for item in value:
        if not isinstance(item, str):
            raise ValueError(f"test-lane evidence payload field {field!r} must be a list[str]")
        normalized.append(item)
    return normalized


def _require_int(value: object, *, field: str) -> int:
    if isinstance(value, int):
        return value
    raise ValueError(f"test-lane evidence payload field {field!r} must be an int")


def _classify_lane_state(
    *,
    test_source_file_count: int,
    parsed_report_count: int,
) -> tuple[TestLaneCompletenessState, TestLaneNextLawfulGain, list[str]]:
    if parsed_report_count > 0:
        if test_source_file_count == 0:
            raise ValueError(
                "governed test execution evidence cannot be admitted without governed realized test source"
            )
        return "governed_test_execution_evidence", "none", []
    if test_source_file_count > 0:
        return (
            "realized_test_source",
            "record_governed_test_execution_evidence",
            ["missing_governed_test_execution_evidence"],
        )
    return (
        "planned_validation_allocation",
        "materialize_realized_test_source",
        ["missing_realized_test_source"],
    )


def admit_test_lane_evidence_payload(
    payload: Mapping[str, object],
) -> TestLaneEvidencePayload:
    projection_kind = _require_string(payload.get("projection_kind"), field="projection_kind")
    if projection_kind != "odd_sdlc.test_lane_evidence":
        raise ValueError(
            "test-lane evidence payload field 'projection_kind' must be 'odd_sdlc.test_lane_evidence'"
        )
    test_source_file_count = _require_int(
        payload.get("test_source_file_count"),
        field="test_source_file_count",
    )
    parsed_report_count = _require_int(
        payload.get("parsed_report_count"),
        field="parsed_report_count",
    )
    completeness_state = _require_string(
        payload.get("completeness_state"),
        field="completeness_state",
    )
    next_lawful_gain = _require_string(
        payload.get("next_lawful_gain"),
        field="next_lawful_gain",
    )
    expected_state, expected_gain, _ = _classify_lane_state(
        test_source_file_count=test_source_file_count,
        parsed_report_count=parsed_report_count,
    )
    if completeness_state != expected_state:
        raise ValueError(
            "test-lane evidence payload completeness_state does not match the admitted lane boundary"
        )
    if next_lawful_gain != expected_gain:
        raise ValueError(
            "test-lane evidence payload next_lawful_gain does not match the admitted lane boundary"
        )
    return {
        "projection_kind": projection_kind,
        "completeness_state": expected_state,
        "next_lawful_gain": expected_gain,
        "blocking_reasons": _require_string_list(
            payload.get("blocking_reasons"),
            field="blocking_reasons",
        ),
        "planned_requirement_ids": _require_string_list(
            payload.get("planned_requirement_ids"),
            field="planned_requirement_ids",
        ),
        "realized_test_source_requirement_ids": _require_string_list(
            payload.get("realized_test_source_requirement_ids"),
            field="realized_test_source_requirement_ids",
        ),
        "archive_requirement_ids": _require_string_list(
            payload.get("archive_requirement_ids"),
            field="archive_requirement_ids",
        ),
        "evidence_refs": _require_string_list(
            payload.get("evidence_refs"),
            field="evidence_refs",
        ),
        "report_paths": _require_string_list(
            payload.get("report_paths"),
            field="report_paths",
        ),
        "report_file_count": _require_int(
            payload.get("report_file_count"),
            field="report_file_count",
        ),
        "parsed_report_count": parsed_report_count,
        "test_source_file_count": test_source_file_count,
    }


def build_test_lane_evidence(
    workspace_root: Path,
    *,
    index: RequirementTraceabilityIndex | None = None,
    test_summary: TestEvidenceSummary | None = None,
) -> TestLaneEvidencePayload:
    resolved_index = index if index is not None else build_requirement_traceability_index(workspace_root)
    resolved_summary = test_summary if test_summary is not None else summarize_test_evidence(workspace_root)
    planned_requirement_ids = sorted(resolved_index.planned_validation_refs)
    realized_test_source_requirement_ids = sorted(resolved_index.source_scan.test_refs)
    archive_requirement_ids = sorted(resolved_index.test_run_archive_refs)
    evidence_refs = sorted(
        {
            *(
                ref
                for refs in resolved_index.source_scan.test_refs.values()
                for ref in refs
            ),
            *(
                ref
                for refs in resolved_index.test_run_archive_refs.values()
                for ref in refs
            ),
            *resolved_summary["report_paths"],
        }
    )
    completeness_state, next_lawful_gain, blocking_reasons = _classify_lane_state(
        test_source_file_count=resolved_index.source_scan.test_file_count,
        parsed_report_count=resolved_summary["parsed_report_count"],
    )
    return {
        "projection_kind": "odd_sdlc.test_lane_evidence",
        "completeness_state": completeness_state,
        "next_lawful_gain": next_lawful_gain,
        "blocking_reasons": blocking_reasons,
        "planned_requirement_ids": planned_requirement_ids,
        "realized_test_source_requirement_ids": realized_test_source_requirement_ids,
        "archive_requirement_ids": archive_requirement_ids,
        "evidence_refs": evidence_refs,
        "report_paths": list(resolved_summary["report_paths"]),
        "report_file_count": resolved_summary["report_file_count"],
        "parsed_report_count": resolved_summary["parsed_report_count"],
        "test_source_file_count": resolved_index.source_scan.test_file_count,
    }


def build_test_lane_completeness_context(workspace_root: Path) -> str:
    lane = build_test_lane_evidence(workspace_root)
    evidence_lines = tuple(f"- `{ref}`" for ref in lane["evidence_refs"]) or ("- none observed",)
    blocking_lines = tuple(f"- {reason}" for reason in lane["blocking_reasons"]) or ("- none",)
    return "\n".join(
        (
            "# odd_sdlc Test Lane Completeness Context",
            "",
            "This runtime context is descriptive only.",
            "ABG owns continuation and re-entry; odd_sdlc publishes the current test-lane",
            "completeness state and the next lawful gain without imperative builder strategy.",
            "",
            "## Current Completeness",
            f"- completeness_state: {lane['completeness_state']}",
            f"- next_lawful_gain: {lane['next_lawful_gain']}",
            f"- planned_requirement_ids: {', '.join(lane['planned_requirement_ids']) or 'none'}",
            f"- realized_test_source_requirement_ids: {', '.join(lane['realized_test_source_requirement_ids']) or 'none'}",
            f"- archive_requirement_ids: {', '.join(lane['archive_requirement_ids']) or 'none'}",
            f"- test_source_file_count: {lane['test_source_file_count']}",
            f"- report_file_count: {lane['report_file_count']}",
            f"- parsed_report_count: {lane['parsed_report_count']}",
            "",
            "## Blocking Reasons",
            *blocking_lines,
            "",
            "## Evidence Refs",
            *evidence_lines,
            "",
        )
    )
