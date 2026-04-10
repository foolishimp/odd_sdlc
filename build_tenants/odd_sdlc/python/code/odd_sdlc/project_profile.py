# Implements: REQ-F-ODDSDLC-009
# Implements: REQ-F-ODDSDLC-013
# Implements: REQ-F-ODDSDLC-026
# Implements: REQ-F-ODDSDLC-027
# Implements: REQ-F-ODDSDLC-028
"""Project-profile resolution for the active odd_sdlc software-domain package."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


PROJECT_CONSTRAINTS_PATH = Path(".ai-workspace/context/project_constraints.yml")
DEFAULT_PROVING_CODE_RELATIVE_PATH = "build_tenants/odd_sdlc/python/code/odd_sdlc_proving_impl"
DEFAULT_AMBIGUITY_RISK_APPETITE = "medium"
AMBIGUITY_RISK_APPETITES = {"low", "medium", "high"}
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
    ambiguity_risk_appetite: str
    tenant_name: str
    output_dir: str
    declared_output_dir: str
    test_execution_contract: str
    deployment_contract: str
    runtime_observation_contract: str
    root_code_policy: str
    realization_mode: str
    resolution_reason: str

    def code_relative_path(self) -> str:
        return self.output_dir if self.output_dir else DEFAULT_PROVING_CODE_RELATIVE_PATH

    def normalized_risk_appetite(self) -> str:
        appetite = self.ambiguity_risk_appetite.strip().lower()
        return appetite if appetite in AMBIGUITY_RISK_APPETITES else DEFAULT_AMBIGUITY_RISK_APPETITE

    def has_test_execution_capability(self) -> bool:
        return bool(self.test_execution_contract.strip())

    def has_deployment_capability(self) -> bool:
        return bool(self.deployment_contract.strip())

    def has_runtime_observation_capability(self) -> bool:
        return bool(self.runtime_observation_contract.strip())

    def to_dict(self) -> dict[str, str]:
        return {
            "workspace_name": self.workspace_name,
            "project_slug": self.project_slug,
            "project_kind": self.project_kind,
            "language": self.language,
            "test_runner": self.test_runner,
            "ambiguity_risk_appetite": self.normalized_risk_appetite(),
            "tenant_name": self.tenant_name,
            "output_dir": self.output_dir,
            "declared_output_dir": self.declared_output_dir,
            "test_execution_contract": self.test_execution_contract,
            "deployment_contract": self.deployment_contract,
            "runtime_observation_contract": self.runtime_observation_contract,
            "root_code_policy": self.root_code_policy,
            "realization_mode": self.realization_mode,
            "resolution_reason": self.resolution_reason,
        }


def realization_candidates_for_declared_root(workspace_root: Path) -> list[dict[str, object]]:
    profile = load_project_profile(workspace_root)
    declared_top_level = Path(profile.declared_output_dir).parts[0] if profile.declared_output_dir else None
    return _top_level_realization_candidates(workspace_root, selected_top_level=declared_top_level)


def detect_project_profile_ambiguities(workspace_root: Path, *, stage: str) -> list[dict[str, object]]:
    profile = load_project_profile(workspace_root)
    selected_root = workspace_root / profile.output_dir if profile.output_dir else workspace_root / DEFAULT_PROVING_CODE_RELATIVE_PATH
    selected_summary = _code_root_summary(selected_root)
    candidates = realization_candidates_for_declared_root(workspace_root)
    entries: list[dict[str, object]] = []

    if profile.declared_output_dir and candidates:
        competing = [profile.declared_output_dir, *[str(candidate["relative_path"]) for candidate in candidates]]
        entries.append(
            {
                "ambiguity_id": "multiple-realization-roots",
                "class": "multiple_realization_roots",
                "title": "Multiple plausible realization roots are present",
                "description": "The workspace declares one realization root while other top-level trees also appear to contain governed product realization.",
                "severity": "major",
                "status": "open",
                "hard_stop": False,
                "invariant_refs": ["REQ-F-ODDSDLC-022", "REQ-F-ODDSDLC-027", "REQ-F-ODDSDLC-028"],
                "affected_assets": ["code_surface", "ambiguity_register_surface"],
                "introduced_by": stage,
                "expected_resolving_edge": "select_implementation_stack_profile",
                "current_resolution": "Select one authoritative realization root and remove or explicitly subordinate competing roots.",
                "observed_state": {
                    "declared_output_dir": profile.declared_output_dir,
                    "resolved_output_dir": profile.output_dir,
                    "candidate_count": len(candidates),
                    "candidates": candidates,
                },
                "competing_interpretations": competing,
                "evidence_refs": [
                    ".ai-workspace/context/project_constraints.yml",
                    *competing,
                ],
            }
        )

    if profile.declared_output_dir and profile.output_dir != profile.declared_output_dir:
        entries.append(
            {
                "ambiguity_id": "declared-root-vs-realized-root-mismatch",
                "class": "declared_root_vs_realized_root_mismatch",
                "title": "Declared realization root and selected realization root differ",
                "description": "Deterministic profile resolution chose a different realization root than the one declared in project constraints.",
                "severity": "major",
                "status": "open",
                "hard_stop": False,
                "invariant_refs": ["REQ-F-ODDSDLC-022", "REQ-F-ODDSDLC-027", "REQ-F-ODDSDLC-028"],
                "affected_assets": ["code_surface", "ambiguity_register_surface"],
                "introduced_by": stage,
                "expected_resolving_edge": "select_implementation_stack_profile",
                "current_resolution": "Align the declared output root with the realized root or remove the conflicting realized tree.",
                "observed_state": {
                    "declared_output_dir": profile.declared_output_dir,
                    "resolved_output_dir": profile.output_dir,
                    "resolution_reason": profile.resolution_reason,
                },
                "competing_interpretations": [profile.declared_output_dir, profile.output_dir],
                "evidence_refs": [
                    ".ai-workspace/context/project_constraints.yml",
                    profile.declared_output_dir,
                    profile.output_dir,
                ],
            }
        )

    capability_specs = (
        (
            "missing-test-execution-capability",
            profile.test_runner.strip(),
            profile.has_test_execution_capability(),
            "test_execution_contract",
            "test_run_archive_surface",
            "Declare the test execution contract before treating test execution as governed evidence.",
        ),
        (
            "missing-deployment-capability",
            "deployment",
            profile.has_deployment_capability(),
            "deployment_contract",
            "deployment_surface",
            "Declare the deployment contract before treating deployment as an admissible governed stage.",
        ),
        (
            "missing-runtime-observation-capability",
            "runtime_observation",
            profile.has_runtime_observation_capability(),
            "runtime_observation_contract",
            "runtime_observation_surface",
            "Declare the runtime observation contract before treating runtime return as governed evidence.",
        ),
    )
    for ambiguity_id, cue, declared, field_name, affected_asset, resolution_text in capability_specs:
        if not cue or declared:
            continue
        entries.append(
            {
                "ambiguity_id": ambiguity_id,
                "class": "execution_stage_without_declared_capability",
                "title": f"Required capability `{field_name}` is not declared",
                "description": "A later executional or operational stage is in the domain model but its governing technology capability is not declared in the active build tenant.",
                "severity": "major",
                "status": "pending_capability",
                "hard_stop": True,
                "invariant_refs": ["REQ-F-ODDSDLC-026", "REQ-F-ODDSDLC-027", "REQ-F-ODDSDLC-028"],
                "affected_assets": [affected_asset, "ambiguity_register_surface"],
                "introduced_by": stage,
                "expected_resolving_edge": {
                    "test_execution_contract": "derive_test_run_archive_surface",
                    "deployment_contract": "prepare_deployment_surface",
                    "runtime_observation_contract": "derive_runtime_observation_surface",
                }.get(field_name),
                "current_resolution": resolution_text,
                "observed_state": {
                    "field_name": field_name,
                    "declared_value": getattr(profile, field_name, ""),
                    "tenant_name": profile.tenant_name,
                },
                "competing_interpretations": [
                    f"construction-only lane with no declared {field_name}",
                    f"capability-declared lane for {field_name}",
                ],
                "evidence_refs": [".ai-workspace/context/project_constraints.yml"],
            }
        )

    if selected_summary["test_report_file_count"] and not profile.has_test_execution_capability():
        entries.append(
            {
                "ambiguity_id": "execution-evidence-without-declared-capability",
                "class": "declared_capability_absent_but_side_effect_observed",
                "title": "Test execution evidence exists without a declared execution contract",
                "description": "The workspace contains test reports even though the governing build tenant does not declare a test execution capability contract.",
                "severity": "major",
                "status": "open",
                "hard_stop": True,
                "invariant_refs": ["REQ-F-ODDSDLC-026", "REQ-F-ODDSDLC-027", "REQ-F-ODDSDLC-028"],
                "affected_assets": ["test_run_archive_surface", "release_surface", "ambiguity_register_surface"],
                "introduced_by": stage,
                "expected_resolving_edge": "derive_test_run_archive_surface",
                "current_resolution": "Either declare the test execution contract or classify the observed reports as imported/adopted external evidence.",
                "observed_state": {
                    "resolved_output_dir": profile.output_dir,
                    "test_report_file_count": int(selected_summary["test_report_file_count"]),
                },
                "competing_interpretations": [
                    "ungoverned side-effect execution happened outside declared tenant capability",
                    "test execution is a governed stage and the tenant contract is incomplete",
                ],
                "evidence_refs": [
                    ".ai-workspace/context/project_constraints.yml",
                    profile.output_dir,
                ],
            }
        )

    return entries


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
        ambiguity_risk_appetite=constraints.get("ambiguity_risk_appetite", DEFAULT_AMBIGUITY_RISK_APPETITE),
        tenant_name=tenant_name,
        output_dir=output_dir,
        declared_output_dir=declared_output_dir,
        test_execution_contract=constraints.get("tenant_test_execution_contract", ""),
        deployment_contract=constraints.get("tenant_deployment_contract", ""),
        runtime_observation_contract=constraints.get("tenant_runtime_observation_contract", ""),
        root_code_policy=constraints.get("root_code_policy", ""),
        realization_mode=realization_mode,
        resolution_reason=resolution_reason,
    )
