# Implements: REQ-F-RUNTIME-003
# Implements: REQ-F-ODDSDLC-004
# Implements: REQ-F-ODDSDLC-026
# Implements: REQ-F-ODDSDLC-029
# Implements: REQ-F-ODDSDLC-030
# Implements: REQ-F-ODDSDLC-031
"""Deterministic checks for the retained odd_sdlc proving subset."""
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .fd_contracts import FD_EVALUATOR_CONTRACTS_BY_CLI_NAME
from .gtl_module import module as load_gtl_module
from .project_profile import PROJECT_CONSTRAINTS_PATH, load_project_profile
from .traceability_index import RequirementTraceabilityIndex, build_requirement_traceability_index
from .requirement_closure import obligation_gap_from_declaration
from .workspace_assets import assess_generated_asset_contract, asset_materialization_path, asset_path


@dataclass(frozen=True)
class CheckRule:
    required_root_assets: tuple[str, ...] = ()
    required_materialization_assets: tuple[str, ...] = ()
    required_generated_assets: tuple[str, ...] = ()
    required_profile_fields: tuple[str, ...] = ()


CHECK_RULES: dict[str, CheckRule] = {
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["bootstrap-input-set-present"].cli_name: CheckRule(
        required_root_assets=("intent_surface", "product_surface", "goal_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["product-dependency-surfaces-present"].cli_name: CheckRule(
        required_root_assets=("intent_surface", "product_surface", "goal_surface"),
        required_generated_assets=("intent_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["goal-dependency-surfaces-present"].cli_name: CheckRule(
        required_root_assets=("intent_surface", "product_surface", "goal_surface"),
        required_generated_assets=("intent_surface", "product_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["goal-surface-authority-validated"].cli_name: CheckRule(
        required_root_assets=("intent_surface", "goal_surface"),
        required_generated_assets=("intent_surface", "goal_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["requirements-boundary-sources-present"].cli_name: CheckRule(
        required_root_assets=("intent_surface", "product_surface", "goal_surface"),
        required_generated_assets=("intent_surface", "product_surface", "goal_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["requirement-scope-complete"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["requirement-family-traceability-published"].cli_name: CheckRule(),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["feature-decomp-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface", "feature_decomp_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["uat-testcases-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface", "uat_testcases_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["design-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface", "feature_decomp_surface", "design_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["review-assessment-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("design_surface", "review_assessment_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["consensus-decision-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("review_assessment_surface", "consensus_decision_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["reviewed-design-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("design_surface", "consensus_decision_surface", "reviewed_design_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["design-consensus-terminated"].cli_name: CheckRule(
        required_generated_assets=(
            "design_surface",
            "review_assessment_surface",
            "consensus_decision_surface",
            "reviewed_design_surface",
        ),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["testcase-authority-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("uat_testcases_surface", "scenario_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["scenario-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface", "design_surface", "scenario_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["implementation-design-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("design_surface", "scenario_surface", "implementation_design_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["implementation-stack-profile-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("implementation_design_surface", "implementation_stack_profile"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["implementation-module-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("implementation_design_surface", "implementation_stack_profile", "implementation_module_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["code-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("implementation_module_surface", "implementation_stack_profile"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["code-traceability-present"].cli_name: CheckRule(
        required_generated_assets=("implementation_module_surface", "code_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["release-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=(
            "requirement_surface",
            "design_surface",
            "scenario_surface",
            "code_surface",
            "testcase_authority_surface",
            "test_run_archive_surface",
        ),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["build-execution-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("release_surface", "build_execution_surface"),
        required_profile_fields=("build_execution_contract",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["build-execution-result-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("build_execution_surface", "build_execution_result_surface"),
        required_profile_fields=("build_execution_contract",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-design-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("design_surface", "scenario_surface", "test_design_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-stack-profile-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("test_design_surface", "implementation_design_surface", "implementation_stack_profile", "test_stack_profile"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-module-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("test_design_surface", "test_stack_profile", "implementation_module_surface", "test_module_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["planned-test-traceability-present"].cli_name: CheckRule(
        required_generated_assets=("test_module_surface", "implementation_module_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-run-archive-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("test_module_surface", "test_stack_profile", "test_run_archive_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["realized-test-traceability-present"].cli_name: CheckRule(
        required_generated_assets=("test_module_surface", "code_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["obligation-ledger-carry-converged"].cli_name: CheckRule(),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-execution-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("release_surface", "test_execution_surface"),
        required_profile_fields=("test_execution_contract",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-execution-result-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("test_execution_surface", "test_run_archive_surface", "test_execution_result_surface"),
        required_profile_fields=("test_execution_contract",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["deployment-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("release_surface", "deployment_surface"),
        required_profile_fields=("deployment_contract",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["deployment-result-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("deployment_surface", "deployment_result_surface"),
        required_profile_fields=("deployment_contract",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["deployed-environment-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("deployment_result_surface", "deployed_environment_surface"),
        required_profile_fields=("deployment_contract",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["runtime-observation-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("deployment_result_surface", "test_run_archive_surface", "runtime_observation_surface"),
        required_profile_fields=("deployment_contract", "runtime_observation_contract"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["retrofit-plan-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("runtime_observation_surface", "release_surface", "retrofit_plan_surface"),
        required_profile_fields=("deployment_contract", "runtime_observation_contract"),
    ),
}
_CLI_FAILURE_MAX_ITEMS = 8
_CLI_FAILURE_MAX_STRING_CHARS = 800
_CLI_FAILURE_MAX_DEPTH = 5


def _traceability_index(workspace_root: Path) -> RequirementTraceabilityIndex:
    return build_requirement_traceability_index(workspace_root)


def _require_exists(path: Path) -> bool:
    return path.exists()


def _run_check(check_name: str, workspace_root: Path) -> int:
    rule = CHECK_RULES[check_name]
    profile = load_project_profile(workspace_root)
    enforce_declared_capabilities = (workspace_root / PROJECT_CONSTRAINTS_PATH).exists()
    if not all(_require_exists(asset_path(workspace_root, asset_id)) for asset_id in rule.required_root_assets):
        return 1
    if not all(
        _require_exists(asset_materialization_path(workspace_root, asset_id))
        for asset_id in rule.required_materialization_assets
    ):
        return 1
    if not all(
        assess_generated_asset_contract(workspace_root, asset_id)["contract_satisfied"]
        for asset_id in rule.required_generated_assets
    ):
        return 1
    if enforce_declared_capabilities and not all(
        getattr(profile, field_name, "").strip() for field_name in rule.required_profile_fields
    ):
        return 1
    return 0


def _generic_failure_detail(check_name: str, workspace_root: Path) -> dict[str, Any]:
    rule = CHECK_RULES[check_name]
    profile = load_project_profile(workspace_root)
    enforce_declared_capabilities = (workspace_root / PROJECT_CONSTRAINTS_PATH).exists()
    missing_root_assets = [
        asset_id
        for asset_id in rule.required_root_assets
        if not _require_exists(asset_path(workspace_root, asset_id))
    ]
    missing_materialization_assets = [
        asset_id
        for asset_id in rule.required_materialization_assets
        if not _require_exists(asset_materialization_path(workspace_root, asset_id))
    ]
    generated_contract_failures = [
        assess_generated_asset_contract(workspace_root, asset_id)
        for asset_id in rule.required_generated_assets
        if not assess_generated_asset_contract(workspace_root, asset_id)["contract_satisfied"]
    ]
    missing_profile_fields = [
        field_name
        for field_name in rule.required_profile_fields
        if enforce_declared_capabilities and not getattr(profile, field_name, "").strip()
    ]
    return {
        "check": check_name,
        "failure_kind": "dependency_gap",
        "workspace_root": str(workspace_root),
        "missing_root_assets": missing_root_assets,
        "missing_materialization_assets": missing_materialization_assets,
        "generated_contract_failures": generated_contract_failures,
        "missing_profile_fields": missing_profile_fields,
    }


def _goal_surface_authority_detail(workspace_root: Path) -> dict[str, Any]:
    index = _traceability_index(workspace_root)
    missing_ids = list(index.missing_intent_ids_from_goals())
    generic = _generic_failure_detail("goal-surface-authority-validated", workspace_root)
    generated_contract_failures = list(generic["generated_contract_failures"])
    missing_root_assets = list(generic["missing_root_assets"])
    missing_materialization_assets = list(generic["missing_materialization_assets"])
    failure_kind = "authority_gap" if missing_ids else "dependency_gap"
    suggested_repair = (
        "Carry the missing INT-* identifiers into GOALS.md so active goals retain live intent authority."
        if missing_ids
        else "Repair the generated goal surface contract so the active goal surface is materially governed before closure."
    )
    return {
        "check": "goal-surface-authority-validated",
        "failure_kind": failure_kind,
        "workspace_root": str(workspace_root),
        "goal_surface": "specification/GOALS.md",
        "intent_surface": "specification/INTENT.md",
        "missing_intent_ids": missing_ids,
        "missing_root_assets": missing_root_assets,
        "missing_materialization_assets": missing_materialization_assets,
        "generated_contract_failures": generated_contract_failures,
        "suggested_repair": suggested_repair,
    }


def _requirement_scope_detail(workspace_root: Path) -> dict[str, Any]:
    index = _traceability_index(workspace_root)
    missing_ids = list(index.missing_requirement_ids_from_current_surface())
    generic = _generic_failure_detail("requirement-scope-complete", workspace_root)
    generated_contract_failures = list(generic["generated_contract_failures"])
    missing_root_assets = list(generic["missing_root_assets"])
    missing_materialization_assets = list(generic["missing_materialization_assets"])
    failure_kind = "requirement_gap" if missing_ids else "dependency_gap"
    suggested_repair = (
        "Carry the missing REQ ids into the generated requirement surface instead of silently narrowing scope."
        if missing_ids
        else "Repair the generated requirement surface contract so the active requirement surface is materially governed before closure."
    )
    return {
        "check": "requirement-scope-complete",
        "failure_kind": failure_kind,
        "workspace_root": str(workspace_root),
        "generated_requirement_surface": "specification/requirements/10-generated-bootstrap.md",
        "missing_requirement_ids": missing_ids,
        "missing_root_assets": missing_root_assets,
        "missing_materialization_assets": missing_materialization_assets,
        "generated_contract_failures": generated_contract_failures,
        "suggested_repair": suggested_repair,
    }


def _requirement_family_traceability_detail(workspace_root: Path) -> dict[str, Any]:
    publication = _traceability_index(workspace_root).requirement_family_traceability_scan()
    families = publication["families"]
    missing_carry_fields = [
        entry["requirement_family_ref"]
        for entry in families
        if "Carries Forward From" in entry["missing_fields"]
    ]
    missing_authoring_design_fields = [
        entry["requirement_family_ref"]
        for entry in families
        if "Authoring Design" in entry["missing_fields"]
    ]
    invalid_format_families = [
        {
            "requirement_family_ref": entry["requirement_family_ref"],
            "invalid_format_fields": entry["invalid_format_fields"],
        }
        for entry in families
        if entry["invalid_format_fields"]
    ]
    invalid_carry_refs = [
        {
            "requirement_family_ref": entry["requirement_family_ref"],
            "invalid_carry_refs": entry["invalid_carry_refs"],
        }
        for entry in families
        if entry["invalid_carry_refs"]
    ]
    invalid_authoring_design_refs = [
        {
            "requirement_family_ref": entry["requirement_family_ref"],
            "invalid_authoring_design_refs": entry["invalid_authoring_design_refs"],
        }
        for entry in families
        if entry["invalid_authoring_design_refs"]
    ]
    missing_backlinks = [
        {
            "requirement_family_ref": entry["requirement_family_ref"],
            "missing_authoring_design_backlinks": entry["missing_authoring_design_backlinks"],
        }
        for entry in families
        if entry["missing_authoring_design_backlinks"]
    ]
    return {
        "check": "requirement-family-traceability-published",
        "failure_kind": "traceability_publication_gap",
        "workspace_root": str(workspace_root),
        "summary": publication["summary"],
        "missing_carry_fields": missing_carry_fields,
        "missing_authoring_design_fields": missing_authoring_design_fields,
        "invalid_format_families": invalid_format_families,
        "invalid_carry_refs": invalid_carry_refs,
        "invalid_authoring_design_refs": invalid_authoring_design_refs,
        "missing_authoring_design_backlinks": missing_backlinks,
        "suggested_repair": (
            "Publish explicit `Carries Forward From:` and `Authoring Design:` fields on every active requirement family, "
            "use backticked .md refs or `None`, and ensure each referenced design surface reciprocally points back "
            "through `Implements:` requirement ids or `Derives From:` family refs."
        ),
    }


def _code_traceability_detail(workspace_root: Path) -> dict[str, Any]:
    index = _traceability_index(workspace_root)
    scan = index.traceability_scan()
    zero_surface = scan["code_file_count"] == 0
    return {
        "check": "code-traceability-present",
        "failure_kind": "zero_surface_gap" if zero_surface else "traceability_gap",
        "workspace_root": str(workspace_root),
        "code_root": scan["code_root"],
        "code_file_count": scan["code_file_count"],
        "test_file_count": scan["test_file_count"],
        "surface_failure_reason": "governed_code_surface_empty" if zero_surface else "",
        "missing_requirement_ids": list(index.missing_code_traceability_ids()),
        "orphan_code_files": list(scan["orphan_code_files"]),
        "suggested_repair": (
            "Materialize at least one governed source artifact under the selected code root before certifying implementation traceability."
            if zero_surface
            else "Add Implements tags for the missing REQ ids and remove or tag orphan generated source files."
        ),
    }


def _planned_test_traceability_detail(workspace_root: Path) -> dict[str, Any]:
    index = _traceability_index(workspace_root)
    missing_ids = list(index.missing_planned_test_traceability_ids())
    unexpected_ids = list(index.unexpected_planned_test_traceability_ids())
    return {
        "check": "planned-test-traceability-present",
        "failure_kind": "planned_test_gap",
        "workspace_root": str(workspace_root),
        "test_module_surface": "build_tenants/<tenant>/test_env/tests/40-generated-test-modules.md",
        "missing_requirement_ids": missing_ids,
        "unexpected_requirement_ids": unexpected_ids,
        "suggested_repair": "Align planned Validates coverage to the live implementation branch requirement inventory.",
    }


def _expected_realized_test_roots(workspace_root: Path) -> list[str]:
    profile = load_project_profile(workspace_root)
    code_root = Path(profile.code_relative_path())
    language = profile.language.strip().lower()
    test_runner = profile.test_runner.strip().lower()
    if language == "scala" or "sbt" in test_runner:
        return [
            (code_root / "src" / "test").as_posix(),
            (code_root / "src" / "test" / "scala").as_posix(),
        ]
    if language == "python" or "pytest" in test_runner:
        return [
            (code_root / "tests").as_posix(),
            (code_root / "src" / "tests").as_posix(),
        ]
    return [
        (code_root / "tests").as_posix(),
        (code_root / "src" / "test").as_posix(),
    ]


def _realized_test_traceability_detail(workspace_root: Path) -> dict[str, Any]:
    index = _traceability_index(workspace_root)
    scan = index.traceability_scan()
    missing_ids = list(index.missing_realized_test_traceability_ids())
    unexpected_ids = list(index.unexpected_realized_test_traceability_ids())
    zero_surface = scan["test_file_count"] == 0
    return {
        "check": "realized-test-traceability-present",
        "failure_kind": "zero_surface_gap" if zero_surface else "realized_test_gap",
        "workspace_root": str(workspace_root),
        "code_root": scan["code_root"],
        "code_file_count": scan["code_file_count"],
        "test_file_count": scan["test_file_count"],
        "surface_failure_reason": "governed_realized_test_surface_empty" if zero_surface else "",
        "missing_requirement_ids": missing_ids,
        "unexpected_requirement_ids": unexpected_ids,
        "orphan_test_files": list(scan["orphan_test_files"]),
        "expected_test_roots": _expected_realized_test_roots(workspace_root),
        "suggested_repair": (
            "Materialize at least one governed realized test artifact under the selected code root before certifying realized test traceability."
            if zero_surface
            else "Materialize real test source under the governed code root with Validates tags for the missing REQ ids and remove or retag orphan test files."
        ),
    }


def _declared_obligation_declaration(workspace_root: Path, edge_name: str) -> Any | None:
    declared_module = load_gtl_module(workspace_root)
    for function in declared_module.graph_functions:
        graph = function.template.graph
        if graph is None:
            continue
        for vector in graph.vectors:
            if vector.name != edge_name:
                continue
            return vector.declarations.get("obligation_ledger")
    return None


def _obligation_ledger_carry_detail(workspace_root: Path, edge_name: str) -> dict[str, Any]:
    declaration = _declared_obligation_declaration(workspace_root, edge_name)
    if declaration is None:
        return {
            "check": "obligation-ledger-carry-converged",
            "failure_kind": "missing_obligation_ledger_declaration",
            "workspace_root": str(workspace_root),
            "edge": edge_name,
            "suggested_repair": "Publish an obligation_ledger declaration on the GTL edge before using deterministic carry gating.",
        }
    gap = obligation_gap_from_declaration(
        workspace_root,
        declaration,
        edge_name=edge_name,
    )
    detail = dict(gap)
    detail["check"] = "obligation-ledger-carry-converged"
    return detail


def _failure_detail(check_name: str, workspace_root: Path, *, edge_name: str | None = None) -> dict[str, Any]:
    if check_name == "goal-surface-authority-validated":
        return _goal_surface_authority_detail(workspace_root)
    if check_name == "requirement-scope-complete":
        return _requirement_scope_detail(workspace_root)
    if check_name == "requirement-family-traceability-published":
        return _requirement_family_traceability_detail(workspace_root)
    if check_name == "code-traceability-present":
        return _code_traceability_detail(workspace_root)
    if check_name == "planned-test-traceability-present":
        return _planned_test_traceability_detail(workspace_root)
    if check_name == "realized-test-traceability-present":
        return _realized_test_traceability_detail(workspace_root)
    if check_name == "obligation-ledger-carry-converged" and edge_name:
        return _obligation_ledger_carry_detail(workspace_root, edge_name)
    return _generic_failure_detail(check_name, workspace_root)


def _bounded_cli_value(value: Any, *, depth: int = 0) -> Any:
    if depth >= _CLI_FAILURE_MAX_DEPTH:
        if isinstance(value, dict):
            return {"type": "object", "field_count": len(value)}
        if isinstance(value, (list, tuple)):
            return {"type": "list", "total_count": len(value)}
        if isinstance(value, str) and len(value) > _CLI_FAILURE_MAX_STRING_CHARS:
            return f"{value[:_CLI_FAILURE_MAX_STRING_CHARS]}...[truncated]"
        return value
    if isinstance(value, dict):
        return {
            str(key): _bounded_cli_value(item, depth=depth + 1)
            for key, item in value.items()
        }
    if isinstance(value, (list, tuple)):
        bounded_items = [
            _bounded_cli_value(item, depth=depth + 1)
            for item in list(value)[:_CLI_FAILURE_MAX_ITEMS]
        ]
        if len(value) <= _CLI_FAILURE_MAX_ITEMS:
            return bounded_items
        return {
            "items": bounded_items,
            "total_count": len(value),
            "omitted_count": len(value) - _CLI_FAILURE_MAX_ITEMS,
        }
    if isinstance(value, str) and len(value) > _CLI_FAILURE_MAX_STRING_CHARS:
        return f"{value[:_CLI_FAILURE_MAX_STRING_CHARS]}...[truncated]"
    return value


def _cli_failure_detail(check_name: str, workspace_root: Path, *, edge_name: str | None = None) -> dict[str, Any]:
    detail = _failure_detail(check_name, workspace_root, edge_name=edge_name)
    bounded = _bounded_cli_value(detail)
    if not isinstance(bounded, dict):
        raise ValueError("bounded CLI failure detail must remain a JSON object")
    return bounded


def bootstrap_input_set_present(workspace_root: Path) -> int:
    return _run_check("bootstrap-input-set-present", workspace_root)


def product_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("product-dependency-surfaces-present", workspace_root)


def goal_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("goal-dependency-surfaces-present", workspace_root)


def goal_surface_authority_validated(workspace_root: Path) -> int:
    index = _traceability_index(workspace_root)
    return (
        0
        if _run_check("goal-surface-authority-validated", workspace_root) == 0
        and not index.missing_intent_ids_from_goals()
        else 1
    )


def requirements_boundary_sources_present(workspace_root: Path) -> int:
    return _run_check("requirements-boundary-sources-present", workspace_root)


def requirement_scope_complete(workspace_root: Path) -> int:
    index = _traceability_index(workspace_root)
    return (
        0
        if _run_check("requirement-scope-complete", workspace_root) == 0
        and not index.missing_requirement_ids_from_current_surface()
        else 1
    )


def requirement_family_traceability_published(workspace_root: Path) -> int:
    summary = _traceability_index(workspace_root).requirement_family_traceability_scan()["summary"]
    return 0 if (
        summary["missing_carry_publication_count"] == 0
        and summary["missing_authoring_design_publication_count"] == 0
        and summary["invalid_carry_ref_count"] == 0
        and summary["invalid_authoring_design_ref_count"] == 0
        and summary["missing_authoring_design_backlink_count"] == 0
    ) else 1


def feature_decomp_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("feature-decomp-dependency-surfaces-present", workspace_root)


def uat_testcases_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("uat-testcases-dependency-surfaces-present", workspace_root)


def design_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("design-dependency-surfaces-present", workspace_root)


def review_assessment_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("review-assessment-dependency-surfaces-present", workspace_root)


def consensus_decision_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("consensus-decision-dependency-surfaces-present", workspace_root)


def reviewed_design_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("reviewed-design-dependency-surfaces-present", workspace_root)


def design_consensus_terminated(workspace_root: Path) -> int:
    return _run_check("design-consensus-terminated", workspace_root)


def testcase_authority_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("testcase-authority-dependency-surfaces-present", workspace_root)


def scenario_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("scenario-dependency-surfaces-present", workspace_root)


def implementation_design_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("implementation-design-dependency-surfaces-present", workspace_root)


def implementation_stack_profile_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("implementation-stack-profile-dependency-surfaces-present", workspace_root)


def implementation_module_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("implementation-module-dependency-surfaces-present", workspace_root)


def code_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("code-dependency-surfaces-present", workspace_root)


def code_traceability_present(workspace_root: Path) -> int:
    index = _traceability_index(workspace_root)
    scan = index.traceability_scan()
    expected_ids = set(index.expected_implementation_code_requirement_ids())
    if scan["code_file_count"] == 0:
        return 1
    if not expected_ids:
        return 0
    return 0 if not index.missing_code_traceability_ids() and not scan["orphan_code_files"] else 1


def release_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("release-dependency-surfaces-present", workspace_root)


def test_design_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("test-design-dependency-surfaces-present", workspace_root)


def test_stack_profile_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("test-stack-profile-dependency-surfaces-present", workspace_root)


def test_module_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("test-module-dependency-surfaces-present", workspace_root)


def planned_test_traceability_present(workspace_root: Path) -> int:
    index = _traceability_index(workspace_root)
    return 0 if not index.missing_planned_test_traceability_ids() and not index.unexpected_planned_test_traceability_ids() else 1


def test_run_archive_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("test-run-archive-dependency-surfaces-present", workspace_root)


def realized_test_traceability_present(workspace_root: Path) -> int:
    index = _traceability_index(workspace_root)
    return (
        0
        if not index.missing_realized_test_traceability_ids()
        and not index.unexpected_realized_test_traceability_ids()
        else 1
    )


def obligation_ledger_carry_converged(workspace_root: Path, edge_name: str | None = None) -> int:
    if not edge_name:
        return 1
    detail = _obligation_ledger_carry_detail(workspace_root, edge_name)
    return 0 if bool(detail.get("carry_converged")) else 1


def deployment_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("deployment-dependency-surfaces-present", workspace_root)


def runtime_observation_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("runtime-observation-dependency-surfaces-present", workspace_root)


def retrofit_plan_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("retrofit-plan-dependency-surfaces-present", workspace_root)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_sdlc.fd_checks")
    parser.add_argument("check", choices=tuple(CHECK_RULES))
    parser.add_argument("--workspace", default=".")
    parser.add_argument("--edge")
    args = parser.parse_args(argv)
    workspace_root = Path(args.workspace).resolve()
    function_name = args.check.replace("-", "_")
    check_function = globals().get(function_name)
    if callable(check_function):
        if args.edge is not None:
            exit_code = int(check_function(workspace_root, args.edge))
        else:
            exit_code = int(check_function(workspace_root))
    else:
        exit_code = _run_check(args.check, workspace_root)
    if exit_code != 0:
        print(json.dumps(_cli_failure_detail(args.check, workspace_root, edge_name=args.edge), indent=2, sort_keys=True))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
