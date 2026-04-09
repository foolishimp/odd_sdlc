# Implements: REQ-F-ODDSDLC-009
# Implements: REQ-F-ODDSDLC-013
"""Project-profile resolution for the active odd_sdlc software-domain package."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


PROJECT_CONSTRAINTS_PATH = Path(".ai-workspace/context/project_constraints.yml")
DEFAULT_PROVING_CODE_RELATIVE_PATH = "build_tenants/odd_sdlc/python/code/odd_sdlc_proving_impl"
BUILD_MARKERS = (
    "build.sbt",
    "pom.xml",
    "pyproject.toml",
    "setup.py",
    "package.json",
    "Cargo.toml",
    "go.mod",
)
SOURCE_EXTENSIONS = {
    ".py",
    ".scala",
    ".java",
    ".kt",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".rs",
    ".go",
}
IGNORE_ROOTS = {
    ".ai-workspace",
    ".genesis",
    ".odd_sdlc",
    "build_tenants",
    "docs",
    "specification",
    "node_modules",
    "venv",
    ".venv",
}


def _strip_quotes(value: str) -> str:
    stripped = value.strip()
    if len(stripped) >= 2 and stripped[0] == stripped[-1] and stripped[0] in {'"', "'"}:
        return stripped[1:-1]
    return stripped


def _default_project_slug(workspace_root: Path) -> str:
    name = workspace_root.resolve().name.strip()
    if not name:
        return "project"
    return name.split(".", 1)[0].replace("-", "_")


@dataclass(frozen=True)
class ProjectProfile:
    workspace_name: str
    project_slug: str
    project_kind: str
    language: str
    test_runner: str
    tenant_name: str
    output_dir: str
    declared_output_dir: str
    root_code_policy: str
    realization_mode: str
    resolution_reason: str

    def code_relative_path(self) -> str:
        return self.output_dir if self.output_dir else DEFAULT_PROVING_CODE_RELATIVE_PATH

    def to_dict(self) -> dict[str, str]:
        return {
            "workspace_name": self.workspace_name,
            "project_slug": self.project_slug,
            "project_kind": self.project_kind,
            "language": self.language,
            "test_runner": self.test_runner,
            "tenant_name": self.tenant_name,
            "output_dir": self.output_dir,
            "declared_output_dir": self.declared_output_dir,
            "root_code_policy": self.root_code_policy,
            "realization_mode": self.realization_mode,
            "resolution_reason": self.resolution_reason,
        }


def _code_root_summary(path: Path) -> dict[str, int | list[str] | bool]:
    if not path.exists() or not path.is_dir():
        return {
            "exists": False,
            "build_markers": [],
            "source_file_count": 0,
            "test_source_file_count": 0,
            "test_report_file_count": 0,
        }

    build_markers = [marker for marker in BUILD_MARKERS if (path / marker).exists()]
    source_file_count = 0
    test_source_file_count = 0
    test_report_file_count = 0
    for child in path.rglob("*"):
        if not child.is_file():
            continue
        if any(part in {"target", "__pycache__", ".pytest_cache"} for part in child.parts):
            if child.suffix == ".xml" and "test-reports" in child.parts:
                test_report_file_count += 1
            continue
        if child.suffix in SOURCE_EXTENSIONS:
            source_file_count += 1
            if "test" in child.parts:
                test_source_file_count += 1
    return {
        "exists": True,
        "build_markers": build_markers,
        "source_file_count": source_file_count,
        "test_source_file_count": test_source_file_count,
        "test_report_file_count": test_report_file_count,
    }


def _realization_score(summary: dict[str, int | list[str] | bool]) -> int:
    build_markers = summary.get("build_markers", [])
    source_file_count = int(summary.get("source_file_count", 0))
    test_source_file_count = int(summary.get("test_source_file_count", 0))
    test_report_file_count = int(summary.get("test_report_file_count", 0))
    return (100 * len(build_markers)) + source_file_count + (2 * test_source_file_count) + (5 * test_report_file_count)


def _top_level_realization_candidates(workspace_root: Path, *, selected_top_level: str | None) -> list[dict[str, object]]:
    candidates: list[dict[str, object]] = []
    for entry in sorted(workspace_root.iterdir(), key=lambda item: item.name):
        if not entry.is_dir():
            continue
        if entry.name in IGNORE_ROOTS or entry.name.startswith("."):
            continue
        if selected_top_level and entry.name == selected_top_level:
            continue
        summary = _code_root_summary(entry)
        if not summary["build_markers"] and int(summary["source_file_count"]) < 4 and int(summary["test_report_file_count"]) == 0:
            continue
        candidates.append(
            {
                "relative_path": entry.relative_to(workspace_root).as_posix(),
                "build_markers": list(summary["build_markers"]),
                "source_file_count": int(summary["source_file_count"]),
                "test_source_file_count": int(summary["test_source_file_count"]),
                "test_report_file_count": int(summary["test_report_file_count"]),
                "score": _realization_score(summary),
            }
        )
    return candidates


def _resolved_output_from_topology(workspace_root: Path, declared_output_dir: str) -> tuple[str, str] | None:
    declared_path = workspace_root / declared_output_dir
    declared_summary = _code_root_summary(declared_path)
    selected_top_level = Path(declared_output_dir).parts[0] if declared_output_dir else None
    candidates = _top_level_realization_candidates(workspace_root, selected_top_level=selected_top_level)
    if not candidates:
        return None

    if not declared_summary["exists"]:
        if len(candidates) == 1:
            return str(candidates[0]["relative_path"]), "topology_recovery_missing_declared_root"
        return None

    declared_score = _realization_score(declared_summary)
    placeholder_like = not declared_summary["build_markers"] and int(declared_summary["source_file_count"]) <= 3
    sorted_candidates = sorted(candidates, key=lambda item: int(item["score"]), reverse=True)
    best = sorted_candidates[0]
    if placeholder_like and int(best["score"]) > declared_score + 20:
        return str(best["relative_path"]), "topology_recovery_prefer_realized_root"
    return None


def _parse_constraints_lines(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values

    section = ""
    in_design_tenants = False
    first_design_tenant_seen = False
    current_tenant_scope = False
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        stripped = raw_line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped == "project:":
            section = "project"
            in_design_tenants = False
            current_tenant_scope = False
            continue
        if stripped == "structure:":
            section = "structure"
            in_design_tenants = False
            current_tenant_scope = False
            continue
        if stripped == "constraints:":
            section = "constraints"
            in_design_tenants = False
            current_tenant_scope = False
            continue
        if section == "structure" and stripped == "design_tenants:":
            in_design_tenants = True
            current_tenant_scope = False
            continue

        if section == "structure" and stripped.startswith("root_code_policy:"):
            values["root_code_policy"] = _strip_quotes(stripped.partition(":")[2])
            in_design_tenants = False
            current_tenant_scope = False
            continue

        if in_design_tenants and stripped.startswith("- name:"):
            if not first_design_tenant_seen:
                values["tenant_name"] = _strip_quotes(stripped.partition(":")[2])
                first_design_tenant_seen = True
                current_tenant_scope = True
            else:
                current_tenant_scope = False
            continue

        if section == "project" and ":" in stripped:
            key, _, value = stripped.partition(":")
            values[key.strip()] = _strip_quotes(value)
            continue

        if section == "structure" and not in_design_tenants and ":" in stripped:
            key, _, value = stripped.partition(":")
            values[key.strip()] = _strip_quotes(value)
            continue

        if current_tenant_scope and ":" in stripped:
            key, _, value = stripped.partition(":")
            values[f"tenant_{key.strip()}"] = _strip_quotes(value)

    return values


def load_project_profile(workspace_root: Path) -> ProjectProfile:
    constraints = _parse_constraints_lines(workspace_root / PROJECT_CONSTRAINTS_PATH)
    workspace_name = workspace_root.resolve().name
    project_slug = constraints.get("name") or _default_project_slug(workspace_root)
    tenant_name = constraints.get("tenant_name") or "python"
    declared_output_dir = constraints.get("tenant_output_dir", "")

    if declared_output_dir:
        declared_path = workspace_root / declared_output_dir
        recovered = _resolved_output_from_topology(workspace_root, declared_output_dir)
        if recovered is not None:
            output_dir, resolution_reason = recovered
            realization_mode = "selected_output_tree"
        elif declared_path.exists():
            output_dir = declared_output_dir
            realization_mode = "selected_output_tree"
            resolution_reason = "project_constraints"
        else:
            output_dir = declared_output_dir
            realization_mode = "planned_output_tree"
            resolution_reason = "project_constraints_declared_output_tree"
    else:
        output_dir = DEFAULT_PROVING_CODE_RELATIVE_PATH
        realization_mode = "generated_proving_subset"
        resolution_reason = "default_proving_subset"

    return ProjectProfile(
        workspace_name=workspace_name,
        project_slug=project_slug,
        project_kind=constraints.get("kind", ""),
        language=constraints.get("language", ""),
        test_runner=constraints.get("test_runner", ""),
        tenant_name=tenant_name,
        output_dir=output_dir,
        declared_output_dir=declared_output_dir,
        root_code_policy=constraints.get("root_code_policy", ""),
        realization_mode=realization_mode,
        resolution_reason=resolution_reason,
    )
