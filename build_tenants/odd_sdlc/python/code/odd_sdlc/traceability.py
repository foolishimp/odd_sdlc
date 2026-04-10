# Implements: REQ-F-ODDSDLC-029
# Implements: REQ-F-ODDSDLC-030
# Implements: REQ-F-ODDSDLC-031
"""Requirement closure and generated traceability register for odd_sdlc."""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from .project_profile import IGNORE_ROOTS, SOURCE_EXTENSIONS, load_project_profile


REQUIREMENT_CLOSURE_REGISTER_KIND = "odd_sdlc.requirement_closure_register"
REQUIREMENT_CLOSURE_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-requirement-closure.json")
_REQUIREMENT_ID_RE = re.compile(r"\b(?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*\b")
_INTENT_ID_RE = re.compile(r"\bINT-\d{3}\b")
_GENERATED_REQUIREMENT_SURFACE_PATH = Path("specification/requirements/10-generated-bootstrap.md")
_IMPLEMENTATION_TRACE_PATHS = (
    Path("build_tenants/odd_sdlc/python/design/40-generated-implementation-design.md"),
    Path("build_tenants/odd_sdlc/python/design/40-generated-implementation-modules.md"),
)
_TEST_TRACE_PATHS = (
    Path("build_tenants/odd_sdlc/python/test_env/tests/40-generated-test-modules.md"),
    Path("specification/scenarios/30-generated-testcase-authority.md"),
)


def _read_text(path: Path) -> str:
    if not path.exists() or not path.is_file():
        return ""
    return path.read_text(encoding="utf-8")


def _relative(path: Path, *, workspace_root: Path) -> str:
    return path.relative_to(workspace_root).as_posix()


def _collect_ids(path: Path, pattern: re.Pattern[str]) -> set[str]:
    return set(pattern.findall(_read_text(path)))


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


def implementation_claim_refs(workspace_root: Path) -> dict[str, list[str]]:
    return _surface_requirement_refs(workspace_root, _IMPLEMENTATION_TRACE_PATHS)


def test_claim_refs(workspace_root: Path) -> dict[str, list[str]]:
    return _surface_requirement_refs(workspace_root, _TEST_TRACE_PATHS)


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
    return (
        "test" in relative_parts
        or "tests" in relative_parts
        or name.startswith("test_")
        or name.endswith("spec.scala")
        or name.endswith("test.scala")
    )


def _tagged_requirement_ids(path: Path, *, tag: str) -> set[str]:
    ids: set[str] = set()
    for line in _read_text(path).splitlines():
        if tag not in line:
            continue
        ids.update(_REQUIREMENT_ID_RE.findall(line))
    return ids


def traceability_scan(workspace_root: Path) -> dict[str, Any]:
    profile = load_project_profile(workspace_root)
    code_root = workspace_root / profile.code_relative_path()
    code_refs: dict[str, list[str]] = {}
    test_refs: dict[str, list[str]] = {}
    orphan_code_files: list[str] = []
    orphan_test_files: list[str] = []

    if not code_root.exists() or not code_root.is_dir():
        return {
            "code_root": _relative(code_root, workspace_root=workspace_root)
            if code_root.is_relative_to(workspace_root)
            else profile.code_relative_path(),
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
    claimed = implementation_claim_refs(workspace_root)
    if not claimed:
        return ()
    code_refs = traceability_scan(workspace_root)["code_refs"]
    return tuple(sorted(requirement_id for requirement_id in claimed if requirement_id not in code_refs))


def missing_test_traceability_ids(workspace_root: Path) -> tuple[str, ...]:
    claimed = test_claim_refs(workspace_root)
    if not claimed:
        return ()
    test_refs = traceability_scan(workspace_root)["test_refs"]
    return tuple(sorted(requirement_id for requirement_id in claimed if requirement_id not in test_refs))


def build_requirement_closure_register(workspace_root: Path, *, stage: str = "workspace_scan") -> dict[str, Any]:
    authority_refs = authority_requirement_refs(workspace_root)
    current_refs = current_requirement_refs(workspace_root)
    implementation_refs = implementation_claim_refs(workspace_root)
    validation_refs = test_claim_refs(workspace_root)
    scan = traceability_scan(workspace_root)
    code_refs = scan["code_refs"]
    test_refs = scan["test_refs"]

    all_ids = sorted(
        set(authority_refs)
        | set(current_refs)
        | set(implementation_refs)
        | set(validation_refs)
        | set(code_refs)
        | set(test_refs)
    )
    requirements: list[dict[str, Any]] = []
    status_counts: dict[str, int] = {}

    for requirement_id in all_ids:
        in_authority = requirement_id in authority_refs
        in_current = requirement_id in current_refs
        implementation_files = implementation_refs.get(requirement_id, [])
        validation_files = validation_refs.get(requirement_id, [])
        code_files = code_refs.get(requirement_id, [])
        test_files = test_refs.get(requirement_id, [])
        if in_authority and not in_current:
            status = "missing_from_current_requirement_surface"
        elif code_files and test_files:
            status = "realized"
        elif code_files or test_files:
            status = "partially_realized"
        elif implementation_files or validation_files:
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
                "test_claim_refs": validation_files,
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
            "requirements_missing_test_traceability": len(missing_test_traceability_ids(workspace_root)),
            "orphan_code_files": len(scan["orphan_code_files"]),
            "orphan_test_files": len(scan["orphan_test_files"]),
            "status_counts": status_counts,
        },
        "traceability": scan,
        "requirements": requirements,
    }


def refresh_requirement_closure_register(workspace_root: Path, *, stage: str = "workspace_scan") -> dict[str, Any]:
    payload = build_requirement_closure_register(workspace_root, stage=stage)
    path = workspace_root / REQUIREMENT_CLOSURE_REGISTER_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(payload, indent=2, sort_keys=True)
    existing = path.read_text(encoding="utf-8") if path.exists() else None
    if existing != content:
        path.write_text(content, encoding="utf-8")
    return payload


def load_or_build_requirement_closure_register(workspace_root: Path) -> dict[str, Any]:
    return refresh_requirement_closure_register(workspace_root, stage="workspace_scan")
