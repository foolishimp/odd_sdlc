# Implements: REQ-F-ODDSDLC-029
# Implements: REQ-F-ODDSDLC-030
"""Requirement traceability index carrier for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass
import os
from pathlib import Path
import re
from typing import Any

from .project_profile import (
    IGNORE_ROOTS,
    SOURCE_EXTENSIONS,
    load_project_profile,
    profile_design_relative_path,
    profile_test_env_relative_path,
    profile_test_env_tests_relative_path,
    resolve_workspace_mode,
)


_REQUIREMENT_ID_RE = re.compile(r"\b(?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*\b")
_GENERATED_REQUIREMENT_SURFACE_PATH = Path("specification/requirements/10-generated-bootstrap.md")
_GENERATED_TESTCASE_AUTHORITY_PATH = Path("specification/scenarios/30-generated-testcase-authority.md")
_GENERATED_TEST_RUN_ARCHIVE_PATH_NAME = "50-generated-run-archive.md"
_TESTCASE_AUTHORITY_MATRIX_PATH = Path("specification/scenarios/TESTCASE_AUTHORITY.md")
_TESTCASE_AUTHORITY_FAMILY_RE = re.compile(r"`((?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*-\*)`")
_INTENT_ID_RE = re.compile(r"\bINT-\d{3}\b")
_MARKDOWN_FILE_TOKEN_RE = re.compile(r"`([^`]+\.md)`")
_MARKDOWN_HEADER_FIELD_RE = re.compile(r"^\*\*(?P<field>[^*]+)\*\*:\s*(?P<value>.*)$")
_SOURCE_DOMAIN_CODE_ROOT = Path("build_tenants/python")
_ACTIVE_STATUS = "active"
_REQUIREMENT_CARRIES_FIELD = "Carries Forward From"
_REQUIREMENT_AUTHORING_DESIGN_FIELD = "Authoring Design"
TRACEABILITY_SCAN_IGNORED_DIR_NAMES = {
    ".ai-workspace",
    ".genesis",
    ".git",
    ".pytest_cache",
    "__pycache__",
    "dist",
    "node_modules",
    "target",
    "test_install",
    "test_runs",
    "venv",
    ".venv",
}


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
    source_scan: TraceabilitySourceScan
    family_publication: RequirementFamilyTraceabilityPublication

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

    def traceability_scan(self) -> dict[str, Any]:
        return self.source_scan.to_dict()

    def requirement_family_traceability_scan(self) -> dict[str, Any]:
        return self.family_publication.to_dict()

    def missing_requirement_ids_from_current_surface(self) -> tuple[str, ...]:
        return tuple(sorted(set(self.authority_refs) - set(self.current_refs)))

    def missing_intent_ids_from_goals(self) -> tuple[str, ...]:
        intent_ids = _collect_ids(self.workspace_root / "specification/INTENT.md", _INTENT_ID_RE)
        goal_ids = _collect_ids(self.workspace_root / "specification/GOALS.md", _INTENT_ID_RE)
        return tuple(sorted(intent_ids - goal_ids))

    def expected_validation_design_requirement_ids(self) -> set[str]:
        return set(self.current_refs)

    def expected_validation_module_requirement_ids(self) -> set[str]:
        planned_test_design_ids = set(self.refs_for("planned_test_design"))
        if planned_test_design_ids:
            return planned_test_design_ids
        return self.expected_validation_design_requirement_ids()

    def expected_validation_authority_requirement_ids(self) -> set[str]:
        planned_test_module_ids = set(self.refs_for("planned_test_module"))
        if planned_test_module_ids:
            return planned_test_module_ids
        return self.expected_validation_module_requirement_ids()

    def expected_realized_validation_requirement_ids(self) -> set[str]:
        testcase_authority_ids = set(self.testcase_authority_refs)
        if testcase_authority_ids:
            return testcase_authority_ids
        return self.expected_validation_authority_requirement_ids()

    def expected_implementation_design_requirement_ids(self) -> set[str]:
        return set(self.current_refs)

    def expected_implementation_module_requirement_ids(self) -> set[str]:
        implementation_design_ids = set(self.refs_for("implementation_design"))
        if implementation_design_ids:
            return implementation_design_ids
        return self.expected_implementation_design_requirement_ids()

    def expected_implementation_code_requirement_ids(self) -> set[str]:
        implementation_module_ids = set(self.refs_for("implementation_module"))
        if implementation_module_ids:
            return implementation_module_ids
        return self.expected_implementation_module_requirement_ids()

    def missing_code_traceability_ids(self) -> tuple[str, ...]:
        expected_ids = self.expected_implementation_code_requirement_ids()
        if not expected_ids:
            return ()
        code_refs = self.source_scan.code_refs
        return tuple(sorted(requirement_id for requirement_id in expected_ids if requirement_id not in code_refs))

    def missing_planned_test_traceability_ids(self) -> tuple[str, ...]:
        expected_ids = self.expected_validation_design_requirement_ids()
        if not expected_ids:
            return ()
        claimed_ids = set(self.planned_validation_refs)
        return tuple(sorted(expected_ids - claimed_ids))

    def missing_realized_test_traceability_ids(self) -> tuple[str, ...]:
        expected_ids = self.expected_realized_validation_requirement_ids()
        if not expected_ids:
            return ()
        realized_ids = set(self.test_run_archive_refs)
        return tuple(sorted(expected_ids - realized_ids))

    def missing_test_traceability_ids(self) -> tuple[str, ...]:
        return self.missing_realized_test_traceability_ids()

    def unexpected_planned_test_traceability_ids(self) -> tuple[str, ...]:
        expected_ids = self.expected_validation_design_requirement_ids()
        claimed_ids = set(self.planned_validation_refs)
        return tuple(sorted(claimed_ids - expected_ids))

    def unexpected_realized_test_traceability_ids(self) -> tuple[str, ...]:
        expected_ids = self.expected_realized_validation_requirement_ids()
        realized_ids = set(self.test_run_archive_refs)
        return tuple(sorted(realized_ids - expected_ids))


@dataclass(frozen=True)
class TraceabilitySourceScan:
    code_root: str
    code_refs: dict[str, list[str]]
    test_refs: dict[str, list[str]]
    orphan_code_files: tuple[str, ...]
    orphan_test_files: tuple[str, ...]
    code_file_count: int
    test_file_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "code_root": self.code_root,
            "code_refs": self.code_refs,
            "test_refs": self.test_refs,
            "orphan_code_files": list(self.orphan_code_files),
            "orphan_test_files": list(self.orphan_test_files),
            "code_file_count": self.code_file_count,
            "test_file_count": self.test_file_count,
        }


@dataclass(frozen=True)
class RequirementFamilyTraceabilityPublication:
    families: tuple[dict[str, Any], ...]
    summary: dict[str, int]

    def to_dict(self) -> dict[str, Any]:
        return {
            "families": [dict(item) for item in self.families],
            "summary": dict(self.summary),
        }


def build_requirement_traceability_index(workspace_root: Path | str) -> RequirementTraceabilityIndex:
    root = Path(workspace_root)
    source_scan = traceability_source_scan(root)
    family_publication = requirement_family_traceability_publication(root)
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
        source_scan=source_scan,
        family_publication=family_publication,
    )


def traceability_source_scan(workspace_root: Path | str) -> TraceabilitySourceScan:
    root = Path(workspace_root)
    code_root_relative_path = _traceability_code_root_relative_path(root)
    code_root = root / code_root_relative_path
    code_refs: dict[str, list[str]] = {}
    test_refs: dict[str, list[str]] = {}
    orphan_code_files: list[str] = []
    orphan_test_files: list[str] = []
    code_file_count = 0
    test_file_count = 0

    if not code_root.exists() or not code_root.is_dir():
        return TraceabilitySourceScan(
            code_root=(
                _relative(code_root, workspace_root=root)
                if code_root.is_relative_to(root)
                else code_root_relative_path
            ),
            code_refs={},
            test_refs={},
            orphan_code_files=(),
            orphan_test_files=(),
            code_file_count=0,
            test_file_count=0,
        )

    for path in _iter_traceability_source_files(code_root):
        rel = _relative(path, workspace_root=root)
        if _is_test_file(path, code_root=code_root):
            test_file_count += 1
            ids = _tagged_requirement_ids(path, tag="Validates:")
            if not ids:
                orphan_test_files.append(rel)
            for requirement_id in sorted(ids):
                test_refs.setdefault(requirement_id, []).append(rel)
            continue
        code_file_count += 1
        ids = _tagged_requirement_ids(path, tag="Implements:")
        if not ids:
            orphan_code_files.append(rel)
        for requirement_id in sorted(ids):
            code_refs.setdefault(requirement_id, []).append(rel)

    return TraceabilitySourceScan(
        code_root=_relative(code_root, workspace_root=root),
        code_refs=code_refs,
        test_refs=test_refs,
        orphan_code_files=tuple(orphan_code_files),
        orphan_test_files=tuple(orphan_test_files),
        code_file_count=code_file_count,
        test_file_count=test_file_count,
    )


def requirement_family_traceability_publication(
    workspace_root: Path | str,
) -> RequirementFamilyTraceabilityPublication:
    root = Path(workspace_root)
    families: list[dict[str, Any]] = []
    missing_carry_publication_count = 0
    missing_authoring_design_publication_count = 0
    invalid_carry_ref_count = 0
    invalid_authoring_design_ref_count = 0
    missing_authoring_design_backlink_count = 0

    for path in _active_requirement_family_paths(root):
        fields = _markdown_header_fields(path)
        family_ref = _relative(path, workspace_root=root)
        requirement_ids = _collect_requirement_ids(path)
        missing_fields: list[str] = []
        invalid_format_fields: list[str] = []
        carries_forward_refs: list[str] = []
        authoring_design_refs: list[str] = []
        invalid_carry_refs: list[str] = []
        invalid_authoring_design_refs: list[str] = []
        missing_authoring_design_backlinks: list[str] = []

        carries_raw = fields.get(_REQUIREMENT_CARRIES_FIELD)
        if carries_raw is None:
            missing_fields.append(_REQUIREMENT_CARRIES_FIELD)
        else:
            carries_forward_refs, carries_valid = _markdown_path_field_refs(carries_raw)
            if not carries_valid:
                invalid_format_fields.append(_REQUIREMENT_CARRIES_FIELD)

        design_raw = fields.get(_REQUIREMENT_AUTHORING_DESIGN_FIELD)
        if design_raw is None:
            missing_fields.append(_REQUIREMENT_AUTHORING_DESIGN_FIELD)
        else:
            authoring_design_refs, design_valid = _markdown_path_field_refs(design_raw)
            if not design_valid:
                invalid_format_fields.append(_REQUIREMENT_AUTHORING_DESIGN_FIELD)

        for ref in carries_forward_refs:
            if not (root / ref).exists():
                invalid_carry_refs.append(ref)

        for ref in authoring_design_refs:
            if not (root / ref).exists():
                invalid_authoring_design_refs.append(ref)
                continue
            if not _design_ref_backlinks_requirement_family(
                workspace_root=root,
                design_ref=ref,
                requirement_family_ref=family_ref,
                requirement_ids=requirement_ids,
            ):
                missing_authoring_design_backlinks.append(ref)

        if _REQUIREMENT_CARRIES_FIELD in missing_fields:
            missing_carry_publication_count += 1
        if _REQUIREMENT_AUTHORING_DESIGN_FIELD in missing_fields:
            missing_authoring_design_publication_count += 1
        invalid_carry_ref_count += len(invalid_carry_refs)
        invalid_authoring_design_ref_count += len(invalid_authoring_design_refs)
        missing_authoring_design_backlink_count += len(missing_authoring_design_backlinks)

        families.append(
            {
                "requirement_family_ref": family_ref,
                "family_pattern": fields.get("Family", ""),
                "status": fields.get("Status", ""),
                "carries_forward_refs": carries_forward_refs,
                "authoring_design_refs": authoring_design_refs,
                "missing_fields": missing_fields,
                "invalid_format_fields": invalid_format_fields,
                "invalid_carry_refs": invalid_carry_refs,
                "invalid_authoring_design_refs": invalid_authoring_design_refs,
                "missing_authoring_design_backlinks": missing_authoring_design_backlinks,
            }
        )

    return RequirementFamilyTraceabilityPublication(
        families=tuple(families),
        summary={
            "active_requirement_family_count": len(families),
            "missing_carry_publication_count": missing_carry_publication_count,
            "missing_authoring_design_publication_count": missing_authoring_design_publication_count,
            "invalid_carry_ref_count": invalid_carry_ref_count,
            "invalid_authoring_design_ref_count": invalid_authoring_design_ref_count,
            "missing_authoring_design_backlink_count": missing_authoring_design_backlink_count,
        },
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


def _published_requirement_family_paths(workspace_root: Path) -> tuple[Path, ...]:
    req_root = workspace_root / "specification" / "requirements"
    if not req_root.exists():
        return ()
    paths: list[Path] = []
    for path in sorted(req_root.glob("*.md")):
        if path.name in {"README.md", "00-imported-sources.md", _GENERATED_REQUIREMENT_SURFACE_PATH.name}:
            continue
        paths.append(path)
    return tuple(paths)


def _active_requirement_family_paths(workspace_root: Path) -> tuple[Path, ...]:
    active_paths: list[Path] = []
    for path in _published_requirement_family_paths(workspace_root):
        status = _markdown_header_fields(path).get("Status", "").strip().lower()
        if status == _ACTIVE_STATUS:
            active_paths.append(path)
    return tuple(active_paths)


def _markdown_header_fields(path: Path) -> dict[str, str]:
    fields: dict[str, str] = {}
    for raw_line in _read_text(path).splitlines():
        match = _MARKDOWN_HEADER_FIELD_RE.match(raw_line.strip())
        if match is None:
            continue
        fields[match.group("field").strip()] = match.group("value").strip()
    return fields


def _markdown_path_field_refs(raw_value: str) -> tuple[list[str], bool]:
    value = raw_value.strip()
    if not value:
        return [], False
    if value.lower() == "none":
        return [], True
    refs = [Path(token).as_posix() for token in _MARKDOWN_FILE_TOKEN_RE.findall(value)]
    return refs, bool(refs)


def _design_ref_backlinks_requirement_family(
    *,
    workspace_root: Path,
    design_ref: str,
    requirement_family_ref: str,
    requirement_ids: set[str],
) -> bool:
    design_path = workspace_root / design_ref
    if not design_path.exists():
        return False
    design_text = _read_text(design_path)
    if requirement_family_ref in design_text:
        return True
    return bool(_collect_requirement_ids(design_path) & requirement_ids)


def _implementation_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    return (
        *_implementation_design_trace_paths(workspace_root),
        *_implementation_module_trace_paths(workspace_root),
    )


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


def _planned_test_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    return (
        *_planned_test_design_trace_paths(workspace_root),
        *_planned_test_module_trace_paths(workspace_root),
    )


def _test_run_archive_trace_paths(workspace_root: Path) -> tuple[Path, ...]:
    profile = load_project_profile(workspace_root)
    return (Path(profile_test_env_relative_path(profile, _GENERATED_TEST_RUN_ARCHIVE_PATH_NAME)),)


def _is_source_file(path: Path, *, code_root: Path) -> bool:
    relative_parts = path.relative_to(code_root).parts
    return (
        path.suffix in SOURCE_EXTENSIONS
        and not any(part in IGNORE_ROOTS for part in relative_parts)
        and "target" not in {part.lower() for part in relative_parts}
    )


def _iter_traceability_source_files(code_root: Path):
    for current_root, dirnames, filenames in os.walk(code_root):
        dirnames[:] = sorted(
            dirname
            for dirname in dirnames
            if dirname not in TRACEABILITY_SCAN_IGNORED_DIR_NAMES
        )
        for filename in sorted(filenames):
            path = Path(current_root) / filename
            if path.is_file() and _is_source_file(path, code_root=code_root):
                yield path


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
        ids.update(
            _normalize_requirement_id(requirement_id)
            for requirement_id in _REQUIREMENT_ID_RE.findall(line)
            if _is_concrete_requirement_id(requirement_id)
        )
    return ids


def _traceability_code_root_relative_path(workspace_root: Path) -> str:
    if resolve_workspace_mode(workspace_root) == "source_domain_repo":
        source_domain_root = workspace_root / _SOURCE_DOMAIN_CODE_ROOT / "code" / "odd_sdlc"
        if source_domain_root.exists():
            return _SOURCE_DOMAIN_CODE_ROOT.as_posix()
    profile = load_project_profile(workspace_root)
    return profile.code_relative_path()


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
