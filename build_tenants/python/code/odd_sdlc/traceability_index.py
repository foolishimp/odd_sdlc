# Implements: REQ-F-ODDSDLC-029
# Implements: REQ-F-ODDSDLC-030
"""Requirement traceability index carrier for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re

from .project_profile import (
    load_project_profile,
    profile_design_relative_path,
    profile_test_env_relative_path,
    profile_test_env_tests_relative_path,
)


_REQUIREMENT_ID_RE = re.compile(r"\b(?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*\b")
_GENERATED_REQUIREMENT_SURFACE_PATH = Path("specification/requirements/10-generated-bootstrap.md")
_GENERATED_TESTCASE_AUTHORITY_PATH = Path("specification/scenarios/30-generated-testcase-authority.md")
_GENERATED_TEST_RUN_ARCHIVE_PATH_NAME = "50-generated-run-archive.md"
_TESTCASE_AUTHORITY_MATRIX_PATH = Path("specification/scenarios/TESTCASE_AUTHORITY.md")
_TESTCASE_AUTHORITY_FAMILY_RE = re.compile(r"`((?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*-\*)`")


@dataclass(frozen=True)
class RequirementTraceabilityIndex:
    workspace_root: Path
    authority_refs: dict[str, list[str]]
    current_refs: dict[str, list[str]]
    authority_statements: dict[str, list[str]]
    current_statements: dict[str, list[str]]
    surface_refs: dict[str, dict[str, list[str]]]
    testcase_authority_refs: dict[str, list[str]]
    test_run_archive_refs: dict[str, list[str]]

    def refs_for(self, surface: str) -> dict[str, list[str]]:
        return dict(self.surface_refs.get(surface, {}))

    @property
    def implementation_refs(self) -> dict[str, list[str]]:
        refs = _merge_requirement_refs({}, self.refs_for("implementation_design"))
        return _merge_requirement_refs(refs, self.refs_for("implementation_module"))

    @property
    def planned_validation_refs(self) -> dict[str, list[str]]:
        refs = _merge_requirement_refs({}, self.refs_for("planned_test_design"))
        return _merge_requirement_refs(refs, self.refs_for("planned_test_module"))


def build_requirement_traceability_index(workspace_root: Path | str) -> RequirementTraceabilityIndex:
    root = Path(workspace_root)
    surface_refs = {
        "implementation_design": _surface_requirement_refs(root, _implementation_design_trace_paths(root)),
        "feature_decomp": _surface_requirement_refs(root, _feature_decomp_trace_paths(root)),
        "uat_testcases": _surface_requirement_refs(root, _uat_testcase_trace_paths(root)),
        "design_surface": _surface_requirement_refs(root, _design_surface_trace_paths(root)),
        "scenario": _surface_requirement_refs(root, _scenario_trace_paths(root)),
        "implementation_module": _surface_requirement_refs(root, _implementation_module_trace_paths(root)),
        "planned_test_design": _surface_requirement_refs(root, _planned_test_design_trace_paths(root)),
        "planned_test_module": _surface_requirement_refs(root, _planned_test_module_trace_paths(root)),
    }
    return RequirementTraceabilityIndex(
        workspace_root=root,
        authority_refs=_surface_requirement_refs(root, _authority_requirement_paths(root)),
        current_refs=_surface_requirement_refs(root, _current_requirement_paths(root)),
        authority_statements=_collect_requirement_statement_map(_authority_requirement_paths(root)),
        current_statements=_collect_requirement_statement_map(_current_requirement_paths(root)),
        surface_refs=surface_refs,
        testcase_authority_refs=_testcase_authority_refs(root),
        test_run_archive_refs=_surface_requirement_refs(root, _test_run_archive_trace_paths(root)),
    )


def _read_text(path: Path) -> str:
    if not path.exists() or not path.is_file():
        return ""
    return path.read_text(encoding="utf-8")


def _relative(path: Path, *, workspace_root: Path) -> str:
    try:
        return path.relative_to(workspace_root).as_posix()
    except ValueError:
        return path.as_posix()


def _collect_ids(path: Path, pattern: re.Pattern[str]) -> set[str]:
    return set(pattern.findall(_read_text(path)))


def _normalize_requirement_id(requirement_id: str) -> str:
    parts = requirement_id.upper().split("-")
    if parts[0] == "RF":
        parts[0] = "REQ"
    normalized = [parts[0]]
    for part in parts[1:]:
        if part.isdigit() and len(part) < 3:
            normalized.append(part.zfill(3))
        else:
            normalized.append(part)
    return "-".join(normalized)


def _is_concrete_requirement_id(requirement_id: str) -> bool:
    parts = requirement_id.upper().split("-")
    return any(any(char.isdigit() for char in part) for part in parts[1:])


def _collect_requirement_ids(path: Path) -> set[str]:
    return {
        _normalize_requirement_id(item)
        for item in _collect_ids(path, _REQUIREMENT_ID_RE)
        if _is_concrete_requirement_id(_normalize_requirement_id(item))
    }


def _meaningful_source_lines(path: Path) -> list[str]:
    lines: list[str] = []
    for raw_line in _read_text(path).splitlines():
        stripped = raw_line.strip()
        if not stripped:
            continue
        if stripped.startswith("#"):
            continue
        if stripped.startswith("This ") and "regenerated by" in stripped:
            continue
        lines.append(stripped)
    return lines


def _collect_requirement_statement_map(paths: tuple[Path, ...]) -> dict[str, list[str]]:
    statements: dict[str, list[str]] = {}
    for path in paths:
        if not path.exists():
            continue
        for raw_line in _meaningful_source_lines(path):
            ids = [
                _normalize_requirement_id(item)
                for item in _REQUIREMENT_ID_RE.findall(raw_line)
                if _is_concrete_requirement_id(_normalize_requirement_id(item))
            ]
            if not ids:
                continue
            for requirement_id in ids:
                statements.setdefault(requirement_id, [])
                if raw_line not in statements[requirement_id]:
                    statements[requirement_id].append(raw_line)
    return statements


def _merge_requirement_refs(
    target: dict[str, list[str]],
    source: dict[str, list[str]],
) -> dict[str, list[str]]:
    for requirement_id, refs in source.items():
        bucket = target.setdefault(requirement_id, [])
        for ref in refs:
            if ref not in bucket:
                bucket.append(ref)
    return target


def _surface_requirement_refs(workspace_root: Path, relative_paths: tuple[Path, ...]) -> dict[str, list[str]]:
    refs: dict[str, list[str]] = {}
    for relative_path in relative_paths:
        path = workspace_root / relative_path
        for requirement_id in sorted(_collect_requirement_ids(path)):
            refs.setdefault(requirement_id, []).append(_relative(path, workspace_root=workspace_root))
    return refs


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


def _implementation_design_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (Path(profile_design_relative_path(profile, "40-generated-implementation-design.md")),)


def _feature_decomp_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (Path(profile_design_relative_path(profile, "20-generated-feature-decomp.md")),)


def _uat_testcase_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    return (Path("specification/scenarios/20-generated-uat-testcases.md"),)


def _design_surface_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (Path(profile_design_relative_path(profile, "30-generated-odd-design.md")),)


def _scenario_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    return (Path("specification/scenarios/40-generated-scenarios.md"),)


def _implementation_module_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (Path(profile_design_relative_path(profile, "40-generated-implementation-modules.md")),)


def _planned_test_design_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (Path(profile_design_relative_path(profile, "40-generated-test-design.md")),)


def _planned_test_module_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (Path(profile_test_env_tests_relative_path(profile, "40-generated-test-modules.md")),)


def _test_run_archive_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (Path(profile_test_env_relative_path(profile, _GENERATED_TEST_RUN_ARCHIVE_PATH_NAME)),)


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
    matrix_path = workspace_root / _TESTCASE_AUTHORITY_MATRIX_PATH
    refs: dict[str, list[str]] = {}
    if not matrix_path.exists():
        return refs
    text = matrix_path.read_text(encoding="utf-8")
    concrete_ids = {
        _normalize_requirement_id(item)
        for item in _REQUIREMENT_ID_RE.findall(text)
        if _is_concrete_requirement_id(_normalize_requirement_id(item))
    }
    for requirement_id in sorted(concrete_ids):
        refs.setdefault(requirement_id, []).append(_TESTCASE_AUTHORITY_MATRIX_PATH.as_posix())
    family_patterns = {
        item[:-2]
        for item in _TESTCASE_AUTHORITY_FAMILY_RE.findall(text)
        if item.endswith("-*")
    }
    if family_patterns:
        for requirement_id in _surface_requirement_refs(workspace_root, _authority_requirement_paths(workspace_root)):
            if any(requirement_id.startswith(prefix) for prefix in family_patterns):
                refs.setdefault(requirement_id, []).append(_TESTCASE_AUTHORITY_MATRIX_PATH.as_posix())
    return refs


def _testcase_authority_refs(workspace_root: Path) -> dict[str, list[str]]:
    refs: dict[str, list[str]] = {}
    _merge_requirement_refs(
        refs,
        _surface_requirement_refs(workspace_root, _written_testcase_authority_paths(workspace_root)),
    )
    _merge_requirement_refs(refs, _matrix_testcase_authority_refs(workspace_root))
    return refs
