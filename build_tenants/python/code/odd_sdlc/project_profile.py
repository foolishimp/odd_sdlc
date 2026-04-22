# Implements: REQ-F-ODDSDLC-009
# Implements: REQ-F-ODDSDLC-013
# Implements: REQ-F-ODDSDLC-026
# Implements: REQ-F-ODDSDLC-027
# Implements: REQ-F-ODDSDLC-028
# Implements: REQ-F-ODDSDLC-032
"""Project-profile resolution for the active odd_sdlc software-domain package."""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
import os
from pathlib import Path

from .install_topology import (
    INSTALLED_RUNTIME_CONTRACT_RELATIVE,
    LEGACY_INSTALLED_PRODUCT_ROOT_RELATIVE,
    TENANT_WORKSPACES_DIR_NAME,
)


PROJECT_CONSTRAINTS_PATH = Path(".ai-workspace/context/project_constraints.yml")
WORKSPACE_STATE_PATH = Path(".ai-workspace/runtime/odd_sdlc-workspace-state.json")
ANALYSIS_MANIFEST_PATH = Path(".ai-workspace/runtime/odd_sdlc-analysis-manifest.json")
DEFAULT_PROVING_CODE_RELATIVE_PATH = "build_tenants/python/code/odd_sdlc_proving_impl"
DEFAULT_AMBIGUITY_RISK_APPETITE = "medium"
AMBIGUITY_RISK_APPETITES = {"low", "medium", "high"}
TENANT_NAME_ALIASES = {
    "spark_scala": "scala_spark",
}
BUILD_MARKERS = (
    "build.sbt",
    "pom.xml",
    "pyproject.toml",
    "setup.py",
    "package.json",
    "Cargo.toml",
    "go.mod",
)
SOURCE_DOMAIN_PRODUCT_ROOT = Path("build_tenants/python/code/odd_sdlc")
SOURCE_SERVICE_PRODUCT_ROOT = Path("build_tenants/odd_service/python/code/odd_service")
SOURCE_SERVICE_SPEC_PATH = Path("specification/requirements/09-odd-service-orchestration-plane.md")
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
FINGERPRINT_IGNORED_DIR_NAMES = {
    ".ai-workspace",
    ".genesis",
    LEGACY_INSTALLED_PRODUCT_ROOT_RELATIVE.name,
    ".pytest_cache",
    "__pycache__",
    "dist",
    "node_modules",
    "test_runs",
    "venv",
    ".venv",
}
IGNORE_ROOTS = {
    ".ai-workspace",
    ".genesis",
    LEGACY_INSTALLED_PRODUCT_ROOT_RELATIVE.name,
    "build_tenants",
    "docs",
    "specification",
    "node_modules",
    "venv",
    ".venv",
}
NON_REALIZATION_TENANT_NAMES = {
    "common",
    "odd_sdlc",
    "odd_service",
}
OPERATIONAL_CAPABILITY_SPECS: tuple[dict[str, object], ...] = (
    {
        "family": "build_execution",
        "field_name": "build_execution_contract",
        "cue": "build_execution",
        "affected_assets": (
            "build_execution_surface",
            "build_execution_result_surface",
            "release_surface",
        ),
        "expected_resolving_edges": (
            "prepare_build_execution_surface",
            "derive_build_execution_result_surface",
        ),
        "resolution_text": "Declare the build execution contract before treating build execution as a governed operational transition.",
    },
    {
        "family": "test_execution",
        "field_name": "test_execution_contract",
        "cue_attr": "test_runner",
        "affected_assets": (
            "test_execution_surface",
            "test_execution_result_surface",
            "test_run_archive_surface",
            "release_surface",
        ),
        "expected_resolving_edges": (
            "prepare_test_execution_surface",
            "derive_test_execution_result_surface",
        ),
        "resolution_text": "Declare the test execution contract before treating test execution as governed evidence.",
    },
    {
        "family": "deployment",
        "field_name": "deployment_contract",
        "cue": "deployment",
        "affected_assets": (
            "deployment_surface",
            "deployment_result_surface",
            "deployed_environment_surface",
            "release_surface",
        ),
        "expected_resolving_edges": (
            "prepare_deployment_surface",
            "derive_deployment_result_surface",
            "derive_deployed_environment_surface",
        ),
        "resolution_text": "Declare the deployment contract before treating deployment as an admissible governed stage.",
    },
    {
        "family": "runtime_observation",
        "field_name": "runtime_observation_contract",
        "cue": "runtime_observation",
        "affected_assets": (
            "runtime_observation_surface",
            "retrofit_plan_surface",
        ),
        "expected_resolving_edges": (
            "derive_runtime_observation_surface",
            "derive_retrofit_plan_surface",
        ),
        "resolution_text": "Declare the runtime observation contract before treating runtime return as governed evidence.",
    },
)
SUMMARY_IGNORED_DIR_NAMES = {
    ".ai-workspace",
    ".genesis",
    LEGACY_INSTALLED_PRODUCT_ROOT_RELATIVE.name,
    ".pytest_cache",
    "__pycache__",
    "design",
    "dist",
    "docs",
    "node_modules",
    "specification",
    "test_env",
    "test_install",
    "test_runs",
    "venv",
    ".venv",
}


def strip_scalar_quotes(value: str) -> str:
    stripped = value.strip()
    if len(stripped) >= 2 and stripped[0] == stripped[-1] and stripped[0] in {'"', "'"}:
        return stripped[1:-1]
    return stripped


def default_project_slug(workspace_root: Path) -> str:
    name = workspace_root.resolve().name.strip()
    if not name:
        return "project"
    return name.split(".", 1)[0].replace("-", "_")


def canonical_tenant_name(value: str) -> str:
    normalized = value.strip()
    if not normalized:
        return "python"
    return TENANT_NAME_ALIASES.get(normalized, normalized)


def tenant_root_relative_path(tenant_name: str) -> str:
    return f"build_tenants/{canonical_tenant_name(tenant_name)}"


def tenant_output_dir(tenant_name: str) -> str:
    return f"{tenant_root_relative_path(tenant_name)}/"


def tenant_design_relative_path(tenant_name: str, filename: str) -> str:
    return f"{tenant_root_relative_path(tenant_name)}/design/{filename}"


def tenant_test_env_relative_path(tenant_name: str, filename: str) -> str:
    return f"{tenant_root_relative_path(tenant_name)}/test_env/{filename}"


def tenant_test_env_tests_relative_path(tenant_name: str, filename: str) -> str:
    return f"{tenant_root_relative_path(tenant_name)}/test_env/tests/{filename}"


def profile_tenant_root_relative_path(profile: "ProjectProfile") -> str:
    if profile.realization_mode == "generated_proving_subset":
        return tenant_root_relative_path(profile.tenant_name)
    output_dir = profile.output_dir.strip().rstrip("/")
    if output_dir.startswith("build_tenants/"):
        return output_dir
    return tenant_root_relative_path(profile.tenant_name)


def profile_design_relative_path(profile: "ProjectProfile", filename: str) -> str:
    return f"{profile_tenant_root_relative_path(profile)}/design/{filename}"


def profile_test_env_relative_path(profile: "ProjectProfile", filename: str) -> str:
    return f"{profile_tenant_root_relative_path(profile)}/test_env/{filename}"


def profile_test_env_tests_relative_path(profile: "ProjectProfile", filename: str) -> str:
    return f"{profile_tenant_root_relative_path(profile)}/test_env/tests/{filename}"


@dataclass(frozen=True)
class ProjectProfile:
    workspace_name: str
    project_slug: str
    project_kind: str
    language: str
    test_runner: str
    tool: str
    version: str
    module_structure: str
    ambiguity_risk_appetite: str
    tenant_name: str
    output_dir: str
    declared_output_dir: str
    build_execution_contract: str
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

    def declared_module_names(self) -> tuple[str, ...]:
        raw = self.module_structure
        if "(" in raw and ")" in raw:
            inner = raw[raw.find("(") + 1 : raw.rfind(")")]
            modules = tuple(part.strip() for part in inner.split(",") if part.strip())
            if modules:
                return modules
        return ("app-core",)

    def has_build_execution_capability(self) -> bool:
        return bool(self.build_execution_contract.strip())

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
            "tool": self.tool,
            "version": self.version,
            "module_structure": self.module_structure,
            "ambiguity_risk_appetite": self.normalized_risk_appetite(),
            "tenant_name": self.tenant_name,
            "output_dir": self.output_dir,
            "declared_output_dir": self.declared_output_dir,
            "build_execution_contract": self.build_execution_contract,
            "test_execution_contract": self.test_execution_contract,
            "deployment_contract": self.deployment_contract,
            "runtime_observation_contract": self.runtime_observation_contract,
            "root_code_policy": self.root_code_policy,
            "realization_mode": self.realization_mode,
            "resolution_reason": self.resolution_reason,
        }

    @classmethod
    def from_dict(cls, payload: dict[str, str]) -> "ProjectProfile":
        return cls(
            workspace_name=str(payload.get("workspace_name", "")),
            project_slug=str(payload.get("project_slug", "")),
            project_kind=str(payload.get("project_kind", "")),
            language=str(payload.get("language", "")),
            test_runner=str(payload.get("test_runner", "")),
            tool=str(payload.get("tool", "")),
            version=str(payload.get("version", "")),
            module_structure=str(payload.get("module_structure", "")),
            ambiguity_risk_appetite=str(payload.get("ambiguity_risk_appetite", DEFAULT_AMBIGUITY_RISK_APPETITE)),
            tenant_name=str(payload.get("tenant_name", "python")),
            output_dir=str(payload.get("output_dir", "")),
            declared_output_dir=str(payload.get("declared_output_dir", "")),
            build_execution_contract=str(payload.get("build_execution_contract", "")),
            test_execution_contract=str(payload.get("test_execution_contract", "")),
            deployment_contract=str(payload.get("deployment_contract", "")),
            runtime_observation_contract=str(payload.get("runtime_observation_contract", "")),
            root_code_policy=str(payload.get("root_code_policy", "")),
            realization_mode=str(payload.get("realization_mode", "")),
            resolution_reason=str(payload.get("resolution_reason", "")),
        )


def _tracked_workspace_input_entries(workspace_root: Path | str) -> list[dict[str, str | bool]]:
    root = Path(workspace_root).resolve()
    tracked: list[dict[str, str | bool]] = []
    explicit_paths = (
        PROJECT_CONSTRAINTS_PATH,
        INSTALLED_RUNTIME_CONTRACT_RELATIVE,
    )
    seen: set[str] = set()
    for relative_path in explicit_paths:
        path = root / relative_path
        tracked.append(
            {
                "path": relative_path.as_posix(),
                "exists": path.exists(),
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest() if path.exists() else "",
            }
        )
        seen.add(relative_path.as_posix())
    for base_relative in (Path("specification"), Path("build_tenants")):
        base = root / base_relative
        if not base.exists() or not base.is_dir():
            continue
        for current_root, dirnames, filenames in os.walk(base):
            dirnames[:] = sorted(
                dirname
                for dirname in dirnames
                if dirname not in FINGERPRINT_IGNORED_DIR_NAMES
            )
            current_path = Path(current_root)
            for filename in sorted(filenames):
                child = current_path / filename
                if (
                    child.suffix not in SOURCE_EXTENSIONS
                    and child.suffix != ".md"
                    and child.name not in BUILD_MARKERS
                ):
                    continue
                relative_path = child.relative_to(root)
                key = relative_path.as_posix()
                if key in seen:
                    continue
                seen.add(key)
                tracked.append(
                    {
                        "path": key,
                        "exists": True,
                        "sha256": hashlib.sha256(child.read_bytes()).hexdigest(),
                    }
                )
    return tracked


def current_workspace_inputs(workspace_root: Path | str) -> list[dict[str, str | bool]]:
    return _tracked_workspace_input_entries(workspace_root)


def current_workspace_input_fingerprint(workspace_root: Path | str) -> str:
    tracked = _tracked_workspace_input_entries(workspace_root)
    return hashlib.sha256(
        json.dumps(tracked, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def is_source_domain_repo_workspace(workspace_root: Path | str) -> bool:
    root = Path(workspace_root).resolve()
    return (
        not (root / INSTALLED_RUNTIME_CONTRACT_RELATIVE).exists()
        and (root / SOURCE_DOMAIN_PRODUCT_ROOT).exists()
        and (root / SOURCE_SERVICE_PRODUCT_ROOT).exists()
        and (root / SOURCE_SERVICE_SPEC_PATH).exists()
    )


def load_published_workspace_state(workspace_root: Path | str) -> dict[str, object] | None:
    root = Path(workspace_root).resolve()
    path = root / WORKSPACE_STATE_PATH
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def resolve_workspace_mode(
    workspace_root: Path | str,
    *,
    prefer_published: bool = True,
) -> str:
    root = Path(workspace_root).resolve()
    if prefer_published:
        payload = load_published_workspace_state(root)
        if isinstance(payload, dict):
            workspace_mode = payload.get("workspace_mode")
            if isinstance(workspace_mode, str) and workspace_mode:
                return workspace_mode
    if (root / INSTALLED_RUNTIME_CONTRACT_RELATIVE).exists():
        return "installed_target"
    if is_source_domain_repo_workspace(root):
        return "source_domain_repo"
    if (root / PROJECT_CONSTRAINTS_PATH).exists():
        return "governed_workspace"
    return "unclassified_workspace"


def load_published_analysis_manifest(workspace_root: Path | str) -> dict[str, object] | None:
    root = Path(workspace_root).resolve()
    path = root / ANALYSIS_MANIFEST_PATH
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def published_analysis_is_current(workspace_root: Path | str) -> bool:
    root = Path(workspace_root).resolve()
    current = current_workspace_input_fingerprint(root)
    workspace_state = load_published_workspace_state(root)
    analysis_manifest = load_published_analysis_manifest(root)
    if not isinstance(workspace_state, dict) or not isinstance(analysis_manifest, dict):
        return False
    if not bool(workspace_state.get("ready")):
        return False
    state_fingerprint = str(
        workspace_state.get("analysis_fingerprint")
        or workspace_state.get("input_fingerprint")
        or ""
    )
    if state_fingerprint != current:
        return False
    if str(workspace_state.get("analysis_manifest_path") or "") != ANALYSIS_MANIFEST_PATH.as_posix():
        return False
    if str(analysis_manifest.get("analysis_fingerprint") or "") != current:
        return False
    return True


def load_published_project_profile(workspace_root: Path | str) -> ProjectProfile | None:
    payload = load_published_workspace_state(workspace_root)
    if payload is None:
        return None
    if not published_analysis_is_current(workspace_root):
        return None
    profile_payload = payload.get("project_profile")
    if not isinstance(profile_payload, dict):
        return None
    return ProjectProfile.from_dict({key: str(value) for key, value in profile_payload.items()})


def operational_capability_projection_for_profile(
    profile: ProjectProfile,
    *,
    workspace_root: Path | str | None = None,
) -> dict[str, object]:
    root = Path(workspace_root).resolve() if workspace_root is not None else None
    families: dict[str, dict[str, object]] = {}
    for spec in OPERATIONAL_CAPABILITY_SPECS:
        family = str(spec["family"])
        field_name = str(spec["field_name"])
        contract_value = str(getattr(profile, field_name, "") or "")
        cue_attr = str(spec.get("cue_attr") or "")
        cue_value = (
            str(getattr(profile, cue_attr, "") or "")
            if cue_attr
            else str(spec.get("cue") or "")
        )
        declared = bool(contract_value.strip())
        expected_resolving_edges = tuple(
            str(edge_name)
            for edge_name in spec.get("expected_resolving_edges", ())
            if str(edge_name)
        )
        families[family] = {
            "family": family,
            "field_name": field_name,
            "cue": cue_value,
            "in_scope": bool(cue_value.strip()),
            "declared_value": contract_value,
            "declared": declared,
            "state": "declared" if declared else "undeclared",
            "affected_assets": list(spec.get("affected_assets", ())),
            "expected_resolving_edges": list(expected_resolving_edges),
            "primary_edge": expected_resolving_edges[0] if expected_resolving_edges else "",
            "resolution_text": str(spec.get("resolution_text") or ""),
        }
    return {
        "projection_kind": "odd_sdlc.operational_capabilities",
        "schema_version": "v1",
        "workspace_root": str(root) if root is not None else "",
        "families": families,
    }


def build_operational_capability_projection(
    workspace_root: Path | str,
    *,
    profile: ProjectProfile | None = None,
) -> dict[str, object]:
    root = Path(workspace_root).resolve()
    current_profile = profile or load_project_profile(root)
    return operational_capability_projection_for_profile(
        current_profile,
        workspace_root=root,
    )


def load_published_operational_capability_projection(
    workspace_root: Path | str,
) -> dict[str, object] | None:
    payload = load_published_workspace_state(workspace_root)
    if payload is None:
        return None
    if not published_analysis_is_current(workspace_root):
        return None
    projection = payload.get("operational_capabilities")
    return projection if isinstance(projection, dict) else None


def load_or_build_operational_capability_projection(
    workspace_root: Path | str,
) -> dict[str, object]:
    published = load_published_operational_capability_projection(workspace_root)
    if published is not None:
        return published
    return build_operational_capability_projection(workspace_root)


def realization_candidates_for_declared_root(workspace_root: Path) -> list[dict[str, object]]:
    profile = load_project_profile(workspace_root)
    selected_relative = Path(profile.declared_output_dir.strip("/")) if profile.declared_output_dir else None
    return _realization_candidates(workspace_root, selected_relative=selected_relative)


def realization_candidates_for_selected_root(workspace_root: Path) -> list[dict[str, object]]:
    profile = load_project_profile(workspace_root)
    return _realization_candidates(
        workspace_root,
        selected_relative=Path(profile.code_relative_path().strip("/")),
    )


def detect_project_profile_ambiguities(workspace_root: Path, *, stage: str) -> list[dict[str, object]]:
    profile = resolve_project_profile(workspace_root)
    selected_root = workspace_root / profile.output_dir if profile.output_dir else workspace_root / DEFAULT_PROVING_CODE_RELATIVE_PATH
    selected_summary = _code_root_summary(selected_root)
    selected_relative = Path(profile.declared_output_dir.strip("/")) if profile.declared_output_dir else None
    candidates = _realization_candidates(workspace_root, selected_relative=selected_relative)
    capability_projection = build_operational_capability_projection(workspace_root, profile=profile)
    capability_families = capability_projection.get("families")
    if not isinstance(capability_families, dict):
        capability_families = {}
    entries: list[dict[str, object]] = []

    if profile.declared_output_dir and candidates:
        competing = [profile.declared_output_dir, *[str(candidate["relative_path"]) for candidate in candidates]]
        entries.append(
            {
                "ambiguity_id": "multiple-realization-roots",
                "class": "multiple_realization_roots",
                "title": "Multiple plausible realization roots are present",
                "description": "The workspace declares one realization root while other workspace trees, including sibling build_tenants, also appear to contain governed product realization.",
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

    for family_name, family in capability_families.items():
        if not isinstance(family, dict):
            continue
        if not bool(family.get("in_scope")) or bool(family.get("declared")):
            continue
        field_name = str(family.get("field_name") or "")
        resolution_text = str(family.get("resolution_text") or "")
        expected_resolving_edges = family.get("expected_resolving_edges")
        primary_edge = str(family.get("primary_edge") or "")
        affected_assets = [
            str(asset_id)
            for asset_id in family.get("affected_assets", ())
            if str(asset_id)
        ]
        entries.append(
            {
                "ambiguity_id": f"missing-{family_name.replace('_', '-')}-capability",
                "class": "execution_stage_without_declared_capability",
                "title": f"Required capability `{field_name}` is not declared",
                "description": "A later executional or operational stage is in the domain model but its governing technology capability is not declared in the active build tenant.",
                "severity": "major",
                "status": "pending_capability",
                "hard_stop": True,
                "invariant_refs": ["REQ-F-ODDSDLC-026", "REQ-F-ODDSDLC-027", "REQ-F-ODDSDLC-028"],
                "affected_assets": [*affected_assets, "ambiguity_register_surface"],
                "introduced_by": stage,
                "expected_resolving_edge": primary_edge,
                "current_resolution": resolution_text,
                "observed_state": {
                    "family": family_name,
                    "field_name": field_name,
                    "declared_value": str(family.get("declared_value") or ""),
                    "tenant_name": profile.tenant_name,
                    "expected_resolving_edges": expected_resolving_edges if isinstance(expected_resolving_edges, list) else [],
                },
                "competing_interpretations": [
                    f"construction-only lane with no declared {field_name}",
                    f"capability-declared lane for {field_name}",
                ],
                "evidence_refs": [".ai-workspace/context/project_constraints.yml"],
            }
        )
    test_capability = capability_families.get("test_execution")
    if (
        isinstance(test_capability, dict)
        and not bool(test_capability.get("declared"))
        and int(selected_summary.get("test_report_file_count") or 0) > 0
    ):
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
                "expected_resolving_edge": str(test_capability.get("primary_edge") or "prepare_test_execution_surface"),
                "current_resolution": "Either declare the test execution contract or classify the observed reports as imported/adopted external evidence.",
                "observed_state": {
                    "resolved_output_dir": profile.output_dir,
                    "test_report_file_count": int(selected_summary.get("test_report_file_count") or 0),
                    "field_name": str(test_capability.get("field_name") or ""),
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
    for current_root, dirnames, filenames in os.walk(path):
        dirnames[:] = [
            dirname
            for dirname in dirnames
            if dirname not in SUMMARY_IGNORED_DIR_NAMES
        ]
        current_path = Path(current_root)
        relative_parts = current_path.relative_to(path).parts if current_path != path else ()
        if any(part == "target" for part in relative_parts):
            for filename in filenames:
                child = current_path / filename
                if child.suffix == ".xml" and "test-reports" in child.parts:
                    test_report_file_count += 1
            continue
        for filename in filenames:
            child = current_path / filename
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


def _candidate_entry(workspace_root: Path, path: Path) -> dict[str, object] | None:
    summary = _code_root_summary(path)
    if not summary["build_markers"] and int(summary["source_file_count"]) < 4 and int(summary["test_report_file_count"]) == 0:
        return None
    return {
        "relative_path": path.relative_to(workspace_root).as_posix(),
        "build_markers": list(summary["build_markers"]),
        "source_file_count": int(summary["source_file_count"]),
        "test_source_file_count": int(summary["test_source_file_count"]),
        "test_report_file_count": int(summary["test_report_file_count"]),
        "score": _realization_score(summary),
    }


def _top_level_realization_candidates(workspace_root: Path, *, selected_relative: Path | None) -> list[dict[str, object]]:
    candidates: list[dict[str, object]] = []
    for entry in sorted(workspace_root.iterdir(), key=lambda item: item.name):
        if not entry.is_dir():
            continue
        if entry.name in IGNORE_ROOTS or entry.name.startswith("."):
            continue
        if selected_relative and _is_selected_or_ancestor(
            entry.relative_to(workspace_root).as_posix(),
            selected_relative.as_posix() if selected_relative else None,
        ):
            continue
        candidate = _candidate_entry(workspace_root, entry)
        if candidate is not None:
            candidates.append(candidate)
    return candidates


def _is_selected_or_ancestor(candidate_path: str, selected_path: str | None) -> bool:
    """Return True when *candidate_path* is the selected root or an ancestor of it."""
    if selected_path is None:
        return False
    if candidate_path == selected_path:
        return True
    return selected_path.startswith(candidate_path + "/")


def _build_tenant_realization_candidates(workspace_root: Path, *, selected_relative: Path | None) -> list[dict[str, object]]:
    build_tenants_root = workspace_root / "build_tenants"
    if not build_tenants_root.exists() or not build_tenants_root.is_dir():
        return []

    selected_relative_posix = selected_relative.as_posix() if selected_relative is not None else None
    candidates: list[dict[str, object]] = []
    seen: set[str] = set()
    for tenant_root in sorted(build_tenants_root.iterdir(), key=lambda item: item.name):
        if not tenant_root.is_dir():
            continue
        if tenant_root.name in NON_REALIZATION_TENANT_NAMES:
            continue
        tenant_candidate = _candidate_entry(workspace_root, tenant_root)
        if tenant_candidate is not None:
            relative_path = str(tenant_candidate["relative_path"])
            if not _is_selected_or_ancestor(relative_path, selected_relative_posix) and relative_path not in seen:
                seen.add(relative_path)
                candidates.append(tenant_candidate)
            continue

        for child in sorted(tenant_root.iterdir(), key=lambda item: item.name):
            if not child.is_dir():
                continue
            if child.name == TENANT_WORKSPACES_DIR_NAME:
                continue
            candidate = _candidate_entry(workspace_root, child)
            if candidate is None:
                continue
            relative_path = str(candidate["relative_path"])
            if _is_selected_or_ancestor(relative_path, selected_relative_posix) or relative_path in seen:
                continue
            seen.add(relative_path)
            candidates.append(candidate)
    return candidates


def _realization_candidates(workspace_root: Path, *, selected_relative: Path | None) -> list[dict[str, object]]:
    candidates: list[dict[str, object]] = []
    seen: set[str] = set()
    for candidate in _top_level_realization_candidates(workspace_root, selected_relative=selected_relative):
        relative_path = str(candidate["relative_path"])
        if relative_path in seen:
            continue
        seen.add(relative_path)
        candidates.append(candidate)
    for candidate in _build_tenant_realization_candidates(workspace_root, selected_relative=selected_relative):
        relative_path = str(candidate["relative_path"])
        if relative_path in seen:
            continue
        seen.add(relative_path)
        candidates.append(candidate)
    return candidates


def _resolved_output_from_topology(workspace_root: Path, declared_output_dir: str) -> tuple[str, str] | None:
    declared_path = workspace_root / declared_output_dir
    declared_summary = _code_root_summary(declared_path)
    selected_relative = Path(declared_output_dir.strip("/")) if declared_output_dir else None
    candidates = _realization_candidates(workspace_root, selected_relative=selected_relative)
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
            values["root_code_policy"] = strip_scalar_quotes(stripped.partition(":")[2])
            in_design_tenants = False
            current_tenant_scope = False
            continue

        if in_design_tenants and stripped.startswith("- name:"):
            if not first_design_tenant_seen:
                values["tenant_name"] = strip_scalar_quotes(stripped.partition(":")[2])
                first_design_tenant_seen = True
                current_tenant_scope = True
            else:
                current_tenant_scope = False
            continue

        if section == "project" and ":" in stripped:
            key, _, value = stripped.partition(":")
            values[key.strip()] = strip_scalar_quotes(value)
            continue

        if section == "structure" and not in_design_tenants and ":" in stripped:
            key, _, value = stripped.partition(":")
            values[key.strip()] = strip_scalar_quotes(value)
            continue

        if current_tenant_scope and ":" in stripped:
            key, _, value = stripped.partition(":")
            values[f"tenant_{key.strip()}"] = strip_scalar_quotes(value)

    return values


def parse_design_tenants(path: Path) -> list[dict[str, str]]:
    tenants: list[dict[str, str]] = []
    if not path.exists():
        return tenants

    section = ""
    in_design_tenants = False
    current_tenant: dict[str, str] | None = None

    def _flush_current() -> None:
        nonlocal current_tenant
        if current_tenant is not None:
            tenants.append(current_tenant)
            current_tenant = None

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        stripped = raw_line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped == "project:":
            _flush_current()
            section = "project"
            in_design_tenants = False
            continue
        if stripped == "structure:":
            _flush_current()
            section = "structure"
            in_design_tenants = False
            continue
        if stripped == "constraints:":
            _flush_current()
            section = "constraints"
            in_design_tenants = False
            continue
        if section == "structure" and stripped == "design_tenants:":
            in_design_tenants = True
            continue
        if section == "structure" and stripped.startswith("root_code_policy:"):
            _flush_current()
            in_design_tenants = False
            continue

        if in_design_tenants and stripped.startswith("- name:"):
            _flush_current()
            current_tenant = {
                "name": canonical_tenant_name(strip_scalar_quotes(stripped.partition(":")[2])),
            }
            continue

        if current_tenant is not None and ":" in stripped:
            key, _, value = stripped.partition(":")
            current_tenant[key.strip()] = strip_scalar_quotes(value)

    _flush_current()
    return tenants


def resolve_project_profile(workspace_root: Path | str) -> ProjectProfile:
    workspace_root = Path(workspace_root).resolve()
    constraints = _parse_constraints_lines(workspace_root / PROJECT_CONSTRAINTS_PATH)
    workspace_name = workspace_root.resolve().name
    project_slug = constraints.get("name") or default_project_slug(workspace_root)
    tenant_name = canonical_tenant_name(constraints.get("tenant_name") or "python")
    declared_output_dir = constraints.get("tenant_output_dir", "")
    canonical_output_dir = tenant_output_dir(tenant_name)
    canonical_output_path = workspace_root / canonical_output_dir

    if declared_output_dir:
        declared_path = workspace_root / declared_output_dir
        declared_summary = _code_root_summary(declared_path)
        declared_realized = bool(declared_summary["build_markers"]) or int(declared_summary["source_file_count"]) > 0
        canonical_summary = _code_root_summary(canonical_output_path)
        canonical_realized = bool(canonical_summary["build_markers"]) or int(canonical_summary["source_file_count"]) > 0
        if canonical_realized:
            output_dir = canonical_output_dir
            realization_mode = "selected_output_tree"
            resolution_reason = "canonical_tenant_root"
        elif declared_realized:
            output_dir = declared_output_dir
            realization_mode = "selected_output_tree"
            resolution_reason = "declared_output_tree"
        elif declared_path.exists():
            output_dir = declared_output_dir
            realization_mode = "planned_output_tree"
            resolution_reason = "legacy_declared_output_tree_pending_migration"
        else:
            output_dir = canonical_output_dir
            realization_mode = "planned_output_tree"
            resolution_reason = "canonical_tenant_root_planned"
        # Once constraints are canonicalized to the tenant root, keep that root authoritative.
        # Competing realized trees should surface as ambiguity, not silently replace the declared root.
        allow_topology_recovery = declared_output_dir != canonical_output_dir
        topology_recovery = _resolved_output_from_topology(workspace_root, declared_output_dir) if allow_topology_recovery else None
        if topology_recovery is not None:
            output_dir, resolution_reason = topology_recovery
            realization_mode = "selected_output_tree"
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
        tool=constraints.get("tool", ""),
        version=constraints.get("version", ""),
        module_structure=constraints.get("module_structure", ""),
        ambiguity_risk_appetite=constraints.get("ambiguity_risk_appetite", DEFAULT_AMBIGUITY_RISK_APPETITE),
        tenant_name=tenant_name,
        output_dir=output_dir,
        declared_output_dir=declared_output_dir,
        build_execution_contract=constraints.get("tenant_build_execution_contract", ""),
        test_execution_contract=constraints.get("tenant_test_execution_contract", ""),
        deployment_contract=constraints.get("tenant_deployment_contract", ""),
        runtime_observation_contract=constraints.get("tenant_runtime_observation_contract", ""),
        root_code_policy=constraints.get("root_code_policy", ""),
        realization_mode=realization_mode,
        resolution_reason=resolution_reason,
    )


def load_project_profile(workspace_root: Path | str) -> ProjectProfile:
    published = load_published_project_profile(workspace_root)
    if published is not None:
        return published
    return resolve_project_profile(workspace_root)
