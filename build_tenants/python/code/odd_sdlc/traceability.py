# Implements: REQ-F-ODDSDLC-029
# Implements: REQ-F-ODDSDLC-030
# Implements: REQ-F-ODDSDLC-031
"""Requirement closure and generated traceability register for odd_sdlc."""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from .project_profile import (
    IGNORE_ROOTS,
    SOURCE_EXTENSIONS,
    is_source_domain_repo_workspace,
    load_project_profile,
    load_published_workspace_state,
    published_analysis_is_current,
    profile_design_relative_path,
    profile_test_env_tests_relative_path,
)


REQUIREMENT_CLOSURE_REGISTER_KIND = "odd_sdlc.requirement_closure_register"
REQUIREMENT_CLOSURE_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-requirement-closure.json")
REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH = Path(
    ".ai-workspace/runtime/odd_sdlc-requirement-closure-context.md"
)
_REQUIREMENT_ID_RE = re.compile(r"\b(?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*-\d{3}\b")
_INTENT_ID_RE = re.compile(r"\bINT-\d{3}\b")
_GENERATED_REQUIREMENT_SURFACE_PATH = Path("specification/requirements/10-generated-bootstrap.md")
_GENERATED_TESTCASE_AUTHORITY_PATH = Path("specification/scenarios/30-generated-testcase-authority.md")
_TESTCASE_AUTHORITY_MATRIX_PATH = Path("specification/scenarios/TESTCASE_AUTHORITY.md")
_TESTCASE_AUTHORITY_FAMILY_RE = re.compile(r"`((?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*-\*)`")
_MARKDOWN_FILE_TOKEN_RE = re.compile(r"`([^`]+\.md)`")
_SOURCE_DOMAIN_CODE_ROOT = Path("build_tenants/python")


def _read_text(path: Path) -> str:
    if not path.exists() or not path.is_file():
        return ""
    return path.read_text(encoding="utf-8")


def _relative(path: Path, *, workspace_root: Path) -> str:
    return path.relative_to(workspace_root).as_posix()


def _collect_ids(path: Path, pattern: re.Pattern[str]) -> set[str]:
    return set(pattern.findall(_read_text(path)))


def _merge_requirement_refs(
    target: dict[str, list[str]],
    source: dict[str, list[str]],
) -> dict[str, list[str]]:
    for requirement_id, refs in source.items():
        for ref in refs:
            current = target.setdefault(requirement_id, [])
            if ref not in current:
                current.append(ref)
    return target


def _authority_requirement_paths(workspace_root: Path) -> tuple[Path, ...]:
    spec_root = workspace_root / "specification"
    req_root = spec_root / "requirements"
    candidates: list[Path] = []
    if req_root.exists():
        for path in sorted(req_root.rglob("*.md")):
            if path.name == "10-generated-bootstrap.md":
                continue
            if path.name.startswith("00-"):
                continue
            candidates.append(path)
    for path in sorted(spec_root.glob("*.md")):
        if path.name in {"INTENT.md", "PRODUCT.md", "GOALS.md"}:
            continue
        if "requirement" not in path.name.lower():
            continue
        if path not in candidates:
            candidates.append(path)
    return tuple(candidates)


def _current_requirement_paths(workspace_root: Path) -> tuple[Path, ...]:
    generated = workspace_root / _GENERATED_REQUIREMENT_SURFACE_PATH
    if generated.exists():
        return (generated,)
    return _authority_requirement_paths(workspace_root)


def authority_requirement_refs(workspace_root: Path) -> dict[str, list[str]]:
    refs: dict[str, list[str]] = {}
    for path in _authority_requirement_paths(workspace_root):
        for requirement_id in sorted(_collect_ids(path, _REQUIREMENT_ID_RE)):
            refs.setdefault(requirement_id, []).append(_relative(path, workspace_root=workspace_root))
    return refs


def current_requirement_refs(workspace_root: Path) -> dict[str, list[str]]:
    refs: dict[str, list[str]] = {}
    for path in _current_requirement_paths(workspace_root):
        for requirement_id in sorted(_collect_ids(path, _REQUIREMENT_ID_RE)):
            refs.setdefault(requirement_id, []).append(_relative(path, workspace_root=workspace_root))
    return refs


def missing_requirement_ids_from_current_surface(workspace_root: Path) -> tuple[str, ...]:
    authority_ids = set(authority_requirement_refs(workspace_root))
    current_ids = set(current_requirement_refs(workspace_root))
    return tuple(sorted(authority_ids - current_ids))


def missing_intent_ids_from_goals(workspace_root: Path) -> tuple[str, ...]:
    intent_ids = _collect_ids(workspace_root / "specification/INTENT.md", _INTENT_ID_RE)
    goal_ids = _collect_ids(workspace_root / "specification/GOALS.md", _INTENT_ID_RE)
    return tuple(sorted(intent_ids - goal_ids))


def _surface_requirement_refs(workspace_root: Path, relative_paths: tuple[Path, ...]) -> dict[str, list[str]]:
    refs: dict[str, list[str]] = {}
    for relative_path in relative_paths:
        path = workspace_root / relative_path
        if not path.exists():
            continue
        rel = relative_path.as_posix()
        for requirement_id in sorted(_collect_ids(path, _REQUIREMENT_ID_RE)):
            refs.setdefault(requirement_id, []).append(rel)
    return refs


def _written_testcase_authority_paths(workspace_root: Path) -> tuple[Path, ...]:
    scenarios_root = workspace_root / "specification" / "scenarios"
    if not scenarios_root.exists():
        return ()
    paths: list[Path] = []
    for path in sorted(scenarios_root.glob("*.md")):
        if path.name == "20-generated-uat-testcases.md":
            continue
        relative = path.relative_to(workspace_root)
        if relative == _TESTCASE_AUTHORITY_MATRIX_PATH:
            continue
        paths.append(relative)
    return tuple(paths)


def _matrix_testcase_authority_refs(workspace_root: Path) -> dict[str, list[str]]:
    path = workspace_root / _TESTCASE_AUTHORITY_MATRIX_PATH
    if not path.exists():
        return {}
    live_requirement_ids = set(authority_requirement_refs(workspace_root)) | set(current_requirement_refs(workspace_root))
    refs: dict[str, list[str]] = {}
    for line in _read_text(path).splitlines():
        family_match = _TESTCASE_AUTHORITY_FAMILY_RE.search(line)
        if family_match is None:
            continue
        family_pattern = family_match.group(1)
        family_prefix = family_pattern[:-1]
        supporting_paths = [
            Path("specification/scenarios") / token
            for token in _MARKDOWN_FILE_TOKEN_RE.findall(line)
        ]
        authority_refs = [_TESTCASE_AUTHORITY_MATRIX_PATH.as_posix(), *[item.as_posix() for item in supporting_paths]]
        for requirement_id in sorted(req_id for req_id in live_requirement_ids if req_id.startswith(family_prefix)):
            current = refs.setdefault(requirement_id, [])
            for ref in authority_refs:
                if ref not in current:
                    current.append(ref)
    return refs


def _implementation_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (
        Path(profile_design_relative_path(profile, "40-generated-implementation-design.md")),
        Path(profile_design_relative_path(profile, "40-generated-implementation-modules.md")),
    )


def _planned_test_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (
        Path(profile_test_env_tests_relative_path(profile, "40-generated-test-modules.md")),
    )


def implementation_claim_refs(workspace_root: Path) -> dict[str, list[str]]:
    return _surface_requirement_refs(workspace_root, _implementation_trace_paths(workspace_root))


def planned_test_claim_refs(workspace_root: Path) -> dict[str, list[str]]:
    return _surface_requirement_refs(workspace_root, _planned_test_trace_paths(workspace_root))


def testcase_authority_refs(workspace_root: Path) -> dict[str, list[str]]:
    refs: dict[str, list[str]] = {}
    _merge_requirement_refs(
        refs,
        _surface_requirement_refs(
            workspace_root,
            (
                _GENERATED_TESTCASE_AUTHORITY_PATH,
                *_written_testcase_authority_paths(workspace_root),
            ),
        ),
    )
    _merge_requirement_refs(refs, _matrix_testcase_authority_refs(workspace_root))
    return refs


def test_claim_refs(workspace_root: Path) -> dict[str, list[str]]:
    return planned_test_claim_refs(workspace_root)


def _is_source_file(path: Path, *, code_root: Path) -> bool:
    relative_parts = path.relative_to(code_root).parts
    return (
        path.suffix in SOURCE_EXTENSIONS
        and not any(part in IGNORE_ROOTS for part in relative_parts)
        and "target" not in {part.lower() for part in relative_parts}
    )


def _is_test_file(path: Path, *, code_root: Path) -> bool:
    relative_parts = [part.lower() for part in path.relative_to(code_root).parts]
    name = path.name.lower()
    under_main_source = len(relative_parts) >= 2 and relative_parts[0] == "src" and relative_parts[1] == "main"
    return (
        "test" in relative_parts
        or "tests" in relative_parts
        or name.startswith("test_")
        or (
            (name.endswith("spec.scala") or name.endswith("test.scala"))
            and not under_main_source
        )
    )


def _tagged_requirement_ids(path: Path, *, tag: str) -> set[str]:
    ids: set[str] = set()
    for line in _read_text(path).splitlines():
        if tag not in line:
            continue
        ids.update(_REQUIREMENT_ID_RE.findall(line))
    return ids


def _workspace_mode(workspace_root: Path) -> str | None:
    published = load_published_workspace_state(workspace_root)
    if isinstance(published, dict):
        workspace_mode = published.get("workspace_mode")
        if isinstance(workspace_mode, str) and workspace_mode:
            return workspace_mode
    if is_source_domain_repo_workspace(workspace_root):
        return "source_domain_repo"
    return None


def _traceability_code_root_relative_path(workspace_root: Path) -> str:
    if _workspace_mode(workspace_root) == "source_domain_repo":
        source_domain_root = workspace_root / _SOURCE_DOMAIN_CODE_ROOT / "code" / "odd_sdlc"
        if source_domain_root.exists():
            return _SOURCE_DOMAIN_CODE_ROOT.as_posix()
    profile = load_project_profile(workspace_root)
    return profile.code_relative_path()


def traceability_scan(workspace_root: Path) -> dict[str, Any]:
    code_root_relative_path = _traceability_code_root_relative_path(workspace_root)
    code_root = workspace_root / code_root_relative_path
    code_refs: dict[str, list[str]] = {}
    test_refs: dict[str, list[str]] = {}
    orphan_code_files: list[str] = []
    orphan_test_files: list[str] = []

    if not code_root.exists() or not code_root.is_dir():
        return {
            "code_root": _relative(code_root, workspace_root=workspace_root)
            if code_root.is_relative_to(workspace_root)
            else code_root_relative_path,
            "code_refs": {},
            "test_refs": {},
            "orphan_code_files": [],
            "orphan_test_files": [],
        }

    for path in sorted(item for item in code_root.rglob("*") if item.is_file() and _is_source_file(item, code_root=code_root)):
        rel = _relative(path, workspace_root=workspace_root)
        if _is_test_file(path, code_root=code_root):
            ids = _tagged_requirement_ids(path, tag="Validates:")
            if not ids:
                orphan_test_files.append(rel)
            for requirement_id in sorted(ids):
                test_refs.setdefault(requirement_id, []).append(rel)
            continue
        ids = _tagged_requirement_ids(path, tag="Implements:")
        if not ids:
            orphan_code_files.append(rel)
        for requirement_id in sorted(ids):
            code_refs.setdefault(requirement_id, []).append(rel)

    return {
        "code_root": _relative(code_root, workspace_root=workspace_root),
        "code_refs": code_refs,
        "test_refs": test_refs,
        "orphan_code_files": orphan_code_files,
        "orphan_test_files": orphan_test_files,
    }


def missing_code_traceability_ids(workspace_root: Path) -> tuple[str, ...]:
    expected_ids = _expected_implementation_requirement_ids(workspace_root)
    if not expected_ids:
        return ()
    code_refs = traceability_scan(workspace_root)["code_refs"]
    return tuple(sorted(requirement_id for requirement_id in expected_ids if requirement_id not in code_refs))


def missing_planned_test_traceability_ids(workspace_root: Path) -> tuple[str, ...]:
    expected_ids = _expected_validation_requirement_ids(workspace_root)
    if not expected_ids:
        return ()
    claimed_ids = set(planned_test_claim_refs(workspace_root))
    return tuple(sorted(expected_ids - claimed_ids))


def missing_realized_test_traceability_ids(workspace_root: Path) -> tuple[str, ...]:
    expected_ids = _expected_validation_requirement_ids(workspace_root)
    if not expected_ids:
        return ()
    realized_ids = set(traceability_scan(workspace_root)["test_refs"])
    return tuple(sorted(expected_ids - realized_ids))


def missing_test_traceability_ids(workspace_root: Path) -> tuple[str, ...]:
    return missing_realized_test_traceability_ids(workspace_root)


def unexpected_planned_test_traceability_ids(workspace_root: Path) -> tuple[str, ...]:
    expected_ids = _expected_validation_requirement_ids(workspace_root)
    claimed_ids = set(planned_test_claim_refs(workspace_root))
    return tuple(sorted(claimed_ids - expected_ids))


def unexpected_realized_test_traceability_ids(workspace_root: Path) -> tuple[str, ...]:
    expected_ids = _expected_validation_requirement_ids(workspace_root)
    realized_ids = set(traceability_scan(workspace_root)["test_refs"])
    return tuple(sorted(realized_ids - expected_ids))


def _expected_validation_requirement_ids(workspace_root: Path) -> set[str]:
    implementation_ids = _expected_implementation_requirement_ids(workspace_root)
    if implementation_ids:
        return implementation_ids
    return set(current_requirement_refs(workspace_root))


def _expected_implementation_requirement_ids(workspace_root: Path) -> set[str]:
    implementation_ids = set(implementation_claim_refs(workspace_root))
    if implementation_ids:
        return implementation_ids
    return set(current_requirement_refs(workspace_root))


def build_requirement_closure_register(workspace_root: Path, *, stage: str = "workspace_scan") -> dict[str, Any]:
    authority_refs = authority_requirement_refs(workspace_root)
    current_refs = current_requirement_refs(workspace_root)
    implementation_refs = implementation_claim_refs(workspace_root)
    planned_validation_refs = planned_test_claim_refs(workspace_root)
    uat_validation_refs = testcase_authority_refs(workspace_root)
    scan = traceability_scan(workspace_root)
    code_refs = scan["code_refs"]
    test_refs = scan["test_refs"]

    all_ids = sorted(
        set(authority_refs)
        | set(current_refs)
        | set(implementation_refs)
        | set(planned_validation_refs)
        | set(uat_validation_refs)
        | set(code_refs)
        | set(test_refs)
    )
    requirements: list[dict[str, Any]] = []
    status_counts: dict[str, int] = {}

    for requirement_id in all_ids:
        in_authority = requirement_id in authority_refs
        in_current = requirement_id in current_refs
        implementation_files = implementation_refs.get(requirement_id, [])
        planned_validation_files = planned_validation_refs.get(requirement_id, [])
        uat_validation_files = uat_validation_refs.get(requirement_id, [])
        code_files = code_refs.get(requirement_id, [])
        test_files = test_refs.get(requirement_id, [])
        if in_authority and not in_current:
            status = "missing_from_current_requirement_surface"
        elif code_files and test_files:
            status = "realized"
        elif code_files or test_files:
            status = "partially_realized"
        elif implementation_files or planned_validation_files or uat_validation_files:
            status = "planned"
        elif in_current:
            status = "specified"
        else:
            status = "unclassified"
        status_counts[status] = status_counts.get(status, 0) + 1
        requirements.append(
            {
                "requirement_id": requirement_id,
                "present_in_authority": in_authority,
                "present_in_current_requirement_surface": in_current,
                "authority_refs": authority_refs.get(requirement_id, []),
                "current_requirement_refs": current_refs.get(requirement_id, []),
                "implementation_claim_refs": implementation_files,
                "planned_test_claim_refs": planned_validation_files,
                "testcase_authority_refs": uat_validation_files,
                "test_claim_refs": planned_validation_files,
                "code_refs": code_files,
                "test_refs": test_files,
                "status": status,
            }
        )

    return {
        "register_kind": REQUIREMENT_CLOSURE_REGISTER_KIND,
        "schema_version": "v1",
        "workspace_root": str(workspace_root),
        "stage": stage,
        "project_profile": load_project_profile(workspace_root).to_dict(),
        "summary": {
            "total_live_requirements": len(requirements),
            "missing_from_current_requirement_surface": len(missing_requirement_ids_from_current_surface(workspace_root)),
            "missing_intent_ids_from_goals": len(missing_intent_ids_from_goals(workspace_root)),
            "requirements_missing_code_traceability": len(missing_code_traceability_ids(workspace_root)),
            "requirements_missing_planned_test_traceability": len(missing_planned_test_traceability_ids(workspace_root)),
            "requirements_with_unexpected_planned_test_traceability": len(unexpected_planned_test_traceability_ids(workspace_root)),
            "requirements_missing_test_traceability": len(missing_realized_test_traceability_ids(workspace_root)),
            "requirements_with_unexpected_realized_test_traceability": len(unexpected_realized_test_traceability_ids(workspace_root)),
            "orphan_code_files": len(scan["orphan_code_files"]),
            "orphan_test_files": len(scan["orphan_test_files"]),
            "status_counts": status_counts,
        },
        "traceability": scan,
        "requirements": requirements,
    }


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


def build_requirement_closure_prompt_context(
    workspace_root: Path,
    *,
    register: dict[str, Any] | None = None,
) -> str:
    payload = register or build_requirement_closure_register(workspace_root, stage="workspace_scan")
    summary = payload["summary"]
    missing_requirement_ids = missing_requirement_ids_from_current_surface(workspace_root)
    missing_goal_intent_ids = missing_intent_ids_from_goals(workspace_root)
    missing_code_ids = missing_code_traceability_ids(workspace_root)
    missing_planned_test_ids = missing_planned_test_traceability_ids(workspace_root)
    unexpected_planned_test_ids = unexpected_planned_test_traceability_ids(workspace_root)
    missing_realized_test_ids = missing_realized_test_traceability_ids(workspace_root)
    unexpected_realized_test_ids = unexpected_realized_test_traceability_ids(workspace_root)
    full_register_path = REQUIREMENT_CLOSURE_REGISTER_PATH.as_posix()
    generated_surface_path = _GENERATED_REQUIREMENT_SURFACE_PATH.as_posix()

    lines = [
        "# odd_sdlc Requirement Closure Builder Context",
        "",
        "Use this as a compact builder-facing summary of the live requirement closure state.",
        "Treat the generated requirement surface as the target asset under construction.",
        "Use the full closure register only when you need per-id detail.",
        "",
        "## Working Boundary",
        f"- target generated requirement surface: `{generated_surface_path}`",
        f"- full closure register for on-demand inspection: `{full_register_path}`",
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
        f"- orphan code files: {summary['orphan_code_files']}",
        f"- orphan test files: {summary['orphan_test_files']}",
        "",
        "## Immediate Repair Signal",
        *_format_id_lines("missing from current requirement surface", missing_requirement_ids),
        *_format_id_lines("intent ids still missing from goals", missing_goal_intent_ids),
        *_format_id_lines("requirement ids still missing code traceability", missing_code_ids),
        *_format_id_lines("requirement ids still missing planned test traceability", missing_planned_test_ids),
        *_format_id_lines("unexpected requirement ids claimed by planned tests", unexpected_planned_test_ids),
        *_format_id_lines("requirement ids still missing realized test traceability", missing_realized_test_ids),
        *_format_id_lines("unexpected requirement ids claimed by realized tests", unexpected_realized_test_ids),
        "",
        "## Builder Law",
        "- inspect the current generated requirement surface first",
        "- continue from the current workspace state rather than restating the whole imported authority",
        "- use the full closure register only when the compact summary is insufficient for the next repair step",
    ]
    return "\n".join(lines) + "\n"


def refresh_requirement_closure_register(workspace_root: Path, *, stage: str = "workspace_scan") -> dict[str, Any]:
    payload = build_requirement_closure_register(workspace_root, stage=stage)
    path = workspace_root / REQUIREMENT_CLOSURE_REGISTER_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(payload, indent=2, sort_keys=True)
    existing = path.read_text(encoding="utf-8") if path.exists() else None
    if existing != content:
        path.write_text(content, encoding="utf-8")
    prompt_context_path = workspace_root / REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH
    prompt_context_content = build_requirement_closure_prompt_context(
        workspace_root,
        register=payload,
    )
    existing_prompt_context = (
        prompt_context_path.read_text(encoding="utf-8")
        if prompt_context_path.exists()
        else None
    )
    if existing_prompt_context != prompt_context_content:
        prompt_context_path.write_text(prompt_context_content, encoding="utf-8")
    return payload


def load_published_requirement_closure_register(workspace_root: Path) -> dict[str, Any] | None:
    workspace_state = load_published_workspace_state(workspace_root)
    if not isinstance(workspace_state, dict):
        return None
    if not published_analysis_is_current(workspace_root):
        return None
    path = workspace_root / REQUIREMENT_CLOSURE_REGISTER_PATH
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def load_or_build_requirement_closure_register(workspace_root: Path) -> dict[str, Any]:
    published = load_published_requirement_closure_register(workspace_root)
    if published is not None:
        return published
    return build_requirement_closure_register(workspace_root, stage="workspace_scan")
