# Implements: REQ-F-ODDSDLC-020
"""Deterministic repair-frontier publication for stateful builder prompts."""
from __future__ import annotations

from pathlib import Path
from typing import Any, Callable

from .project_profile import (
    load_project_profile,
    profile_tenant_root_relative_path,
    profile_test_env_relative_path,
    profile_test_env_tests_relative_path,
)
from .requirement_closure import (
    REQUIREMENT_CLOSURE_REGISTER_PATH,
)


REPAIR_FRONTIER_KIND = "odd_sdlc.repair_frontier"
REPAIR_FRONTIER_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-repair-frontier.json")
REPAIR_FRONTIER_CONTEXT_PATH = Path(".ai-workspace/runtime/odd_sdlc-repair-frontier.md")


def _matching_ids(
    requirements: list[dict[str, Any]],
    predicate: Callable[[dict[str, Any]], bool],
) -> list[str]:
    return sorted(
        str(entry["requirement_id"])
        for entry in requirements
        if predicate(entry)
    )


def _matching_paths(
    requirements: list[dict[str, Any]],
    predicate: Callable[[dict[str, Any]], bool],
    *field_names: str,
) -> list[str]:
    paths: set[str] = set()
    for entry in requirements:
        if not predicate(entry):
            continue
        for field_name in field_names:
            for ref in entry.get(field_name, ()):
                if isinstance(ref, str) and ref:
                    paths.add(ref)
    return sorted(paths)


def _format_id_lines(label: str, ids: list[str]) -> list[str]:
    if not ids:
        return [f"- {label}: none"]
    head = f"- {label}:"
    return [head, *[f"  - `{value}`" for value in ids]]


def _format_path_lines(label: str, paths: list[str]) -> list[str]:
    if not paths:
        return [f"- {label}: none"]
    head = f"- {label}:"
    return [head, *[f"  - `{value}`" for value in paths]]


def build_repair_frontier_register(
    workspace_root: Path | str,
    *,
    requirement_register: dict[str, Any],
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    register = requirement_register
    requirements = [
        dict(entry)
        for entry in register.get("requirements", ())
        if isinstance(entry, dict) and isinstance(entry.get("requirement_id"), str)
    ]
    profile = load_project_profile(root)
    tenant_root = profile_tenant_root_relative_path(profile)
    code_root = profile.code_relative_path()
    test_env_root = profile_test_env_relative_path(profile, "").rstrip("/")
    test_env_tests_root = profile_test_env_tests_relative_path(profile, "").rstrip("/")
    run_archive_path = profile_test_env_relative_path(profile, "50-generated-run-archive.md")

    def requirements_unmet(entry: dict[str, Any]) -> bool:
        return (
            not bool(entry.get("present_in_current_requirement_surface"))
            or str(entry.get("carry_status") or "") != "carried"
        )

    def requirements_preserve(entry: dict[str, Any]) -> bool:
        return bool(entry.get("present_in_current_requirement_surface"))

    def design_unmet(entry: dict[str, Any]) -> bool:
        return (
            str(entry.get("carry_status") or "") == "carried"
            and not bool(entry.get("design_surface_claim_refs"))
        )

    def design_preserve(entry: dict[str, Any]) -> bool:
        return bool(entry.get("design_surface_claim_refs"))

    def code_unmet(entry: dict[str, Any]) -> bool:
        return any(
            reason in {"missing_code_realization", "behavioral_realization_missing"}
            for reason in entry.get("blocking_reasons", ())
        )

    def code_preserve(entry: dict[str, Any]) -> bool:
        return bool(entry.get("behavioral_code_refs") or entry.get("code_refs"))

    def test_unmet(entry: dict[str, Any]) -> bool:
        return any(
            reason in {"missing_planned_test_coverage", "missing_realized_test_source"}
            for reason in entry.get("blocking_reasons", ())
        )

    def test_preserve(entry: dict[str, Any]) -> bool:
        return bool(
            entry.get("planned_test_claim_refs")
            or entry.get("planned_test_design_claim_refs")
            or entry.get("planned_test_module_claim_refs")
            or entry.get("test_refs")
            or entry.get("test_run_archive_refs")
        )

    frontiers = {
        "requirements": {
            "target_asset": "requirement_surface",
            "unmet_requirement_ids": _matching_ids(requirements, requirements_unmet),
            "preservation_requirement_ids": _matching_ids(requirements, requirements_preserve),
            "lawful_edit_frontier": [
                "specification/requirements/",
                "specification/GOALS.md",
                "specification/INTENT.md",
            ],
            "lawful_proof_frontier": [
                REQUIREMENT_CLOSURE_REGISTER_PATH.as_posix(),
            ],
        },
        "design": {
            "target_asset": "design_surface",
            "unmet_requirement_ids": _matching_ids(requirements, design_unmet),
            "preservation_requirement_ids": _matching_ids(requirements, design_preserve),
            "lawful_edit_frontier": sorted(
                set(
                    _matching_paths(
                        requirements,
                        lambda entry: design_unmet(entry) or design_preserve(entry),
                        "design_surface_claim_refs",
                        "implementation_design_claim_refs",
                        "feature_decomp_claim_refs",
                        "scenario_claim_refs",
                    )
                    or [f"{tenant_root}/design/"]
                )
            ),
            "lawful_proof_frontier": [
                REQUIREMENT_CLOSURE_REGISTER_PATH.as_posix(),
                f"{tenant_root}/design/",
            ],
        },
        "code": {
            "target_asset": "code_surface",
            "unmet_requirement_ids": _matching_ids(requirements, code_unmet),
            "preservation_requirement_ids": _matching_ids(requirements, code_preserve),
            "lawful_edit_frontier": sorted(
                set(
                    _matching_paths(
                        requirements,
                        lambda entry: code_unmet(entry) or code_preserve(entry),
                        "implementation_module_claim_refs",
                        "code_refs",
                        "behavioral_code_refs",
                    )
                    or [code_root]
                )
            ),
            "lawful_proof_frontier": sorted(
                {
                    REQUIREMENT_CLOSURE_REGISTER_PATH.as_posix(),
                    test_env_root,
                    test_env_tests_root,
                    run_archive_path,
                }
            ),
        },
        "test": {
            "target_asset": "test_run_archive_surface",
            "unmet_requirement_ids": _matching_ids(requirements, test_unmet),
            "preservation_requirement_ids": _matching_ids(requirements, test_preserve),
            "lawful_edit_frontier": sorted(
                set(
                    _matching_paths(
                        requirements,
                        lambda entry: test_unmet(entry) or test_preserve(entry),
                        "planned_test_design_claim_refs",
                        "planned_test_module_claim_refs",
                        "planned_test_claim_refs",
                        "test_refs",
                        "test_run_archive_refs",
                    )
                    or [test_env_root, test_env_tests_root]
                )
            ),
            "lawful_proof_frontier": sorted(
                {
                    REQUIREMENT_CLOSURE_REGISTER_PATH.as_posix(),
                    test_env_root,
                    test_env_tests_root,
                    run_archive_path,
                }
            ),
        },
    }

    total_unmet = sum(len(frontier["unmet_requirement_ids"]) for frontier in frontiers.values())
    total_preserve = sum(len(frontier["preservation_requirement_ids"]) for frontier in frontiers.values())

    return {
        "repair_frontier_kind": REPAIR_FRONTIER_KIND,
        "schema_version": "v1",
        "workspace_root": str(root),
        "project_profile": profile.to_dict(),
        "summary": {
            "frontier_count": len(frontiers),
            "total_unmet_requirement_pressure": total_unmet,
            "total_preservation_requirement_pressure": total_preserve,
        },
        "frontiers": frontiers,
    }


def build_repair_frontier_prompt_context(
    workspace_root: Path | str,
    *,
    repair_frontier: dict[str, Any],
) -> str:
    frontier = repair_frontier
    summary = dict(frontier.get("summary") or {})
    frontiers = dict(frontier.get("frontiers") or {})
    lines = [
        "# odd_sdlc Deterministic Repair Frontier",
        "",
        "This publication carries current governance truth for the enduring asset under construction.",
        "It names preserved structure, unmet requirement pressure, and lawful edit/proof frontiers without prescribing builder strategy.",
        "",
        "## Summary",
        f"- frontier count: {summary.get('frontier_count', 0)}",
        f"- total unmet requirement pressure: {summary.get('total_unmet_requirement_pressure', 0)}",
        f"- total preservation requirement pressure: {summary.get('total_preservation_requirement_pressure', 0)}",
        "",
    ]

    for lane_name in ("requirements", "design", "code", "test"):
        lane = dict(frontiers.get(lane_name) or {})
        lines.extend(
            (
                f"## {lane_name.title()} Frontier",
                f"- target asset: `{lane.get('target_asset', '')}`",
                *_format_id_lines("unmet requirement ids", list(lane.get("unmet_requirement_ids", ()))),
                *_format_id_lines(
                    "preservation requirement ids",
                    list(lane.get("preservation_requirement_ids", ())),
                ),
                *_format_path_lines("lawful edit frontier", list(lane.get("lawful_edit_frontier", ()))),
                *_format_path_lines("lawful proof frontier", list(lane.get("lawful_proof_frontier", ()))),
                "",
            )
        )
    return "\n".join(lines) + "\n"
