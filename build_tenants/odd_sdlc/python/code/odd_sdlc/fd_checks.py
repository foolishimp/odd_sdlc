# Implements: REQ-F-RUNTIME-003
# Implements: REQ-F-ODDSDLC-004
# Implements: REQ-F-ODDSDLC-026
# Implements: REQ-F-ODDSDLC-029
# Implements: REQ-F-ODDSDLC-030
# Implements: REQ-F-ODDSDLC-031
"""Deterministic checks for the retained odd_sdlc proving subset."""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from .fd_contracts import FD_EVALUATOR_CONTRACTS_BY_CLI_NAME
from .project_profile import PROJECT_CONSTRAINTS_PATH, load_project_profile
from .traceability import (
    missing_code_traceability_ids,
    missing_intent_ids_from_goals,
    missing_requirement_ids_from_current_surface,
    missing_test_traceability_ids,
    traceability_scan,
)
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
        required_root_assets=("intent_surface", "product_surface", "goal_surface", "requirement_surface"),
        required_materialization_assets=("requirement_surface",),
        required_generated_assets=("intent_surface", "product_surface", "goal_surface", "requirement_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["requirement-scope-complete"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["feature-decomp-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["uat-testcases-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["design-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface", "feature_decomp_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["review-assessment-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("design_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["consensus-decision-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("review_assessment_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["reviewed-design-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("design_surface", "consensus_decision_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["testcase-authority-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("uat_testcases_surface", "scenario_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["scenario-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("requirement_surface", "design_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["implementation-design-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("design_surface", "scenario_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["implementation-stack-profile-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("implementation_design_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["implementation-module-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("implementation_design_surface", "implementation_stack_profile"),
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
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-design-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("design_surface", "scenario_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-stack-profile-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("test_design_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-module-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("test_design_surface", "test_stack_profile"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-run-archive-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("test_module_surface", "test_stack_profile"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["test-traceability-present"].cli_name: CheckRule(
        required_generated_assets=("test_module_surface", "testcase_authority_surface", "code_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["deployment-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("release_surface",),
        required_profile_fields=("deployment_contract",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["runtime-observation-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("deployment_surface", "test_run_archive_surface"),
        required_profile_fields=("deployment_contract", "runtime_observation_contract"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["retrofit-plan-dependency-surfaces-present"].cli_name: CheckRule(
        required_generated_assets=("runtime_observation_surface", "release_surface"),
        required_profile_fields=("deployment_contract", "runtime_observation_contract"),
    ),
}


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


def bootstrap_input_set_present(workspace_root: Path) -> int:
    return _run_check("bootstrap-input-set-present", workspace_root)


def product_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("product-dependency-surfaces-present", workspace_root)


def goal_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("goal-dependency-surfaces-present", workspace_root)


def goal_surface_authority_validated(workspace_root: Path) -> int:
    return 0 if not missing_intent_ids_from_goals(workspace_root) else 1


def requirements_boundary_sources_present(workspace_root: Path) -> int:
    return _run_check("requirements-boundary-sources-present", workspace_root)


def requirement_scope_complete(workspace_root: Path) -> int:
    return 0 if not missing_requirement_ids_from_current_surface(workspace_root) else 1


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
    scan = traceability_scan(workspace_root)
    return 0 if not missing_code_traceability_ids(workspace_root) and not scan["orphan_code_files"] else 1


def release_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("release-dependency-surfaces-present", workspace_root)


def test_design_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("test-design-dependency-surfaces-present", workspace_root)


def test_stack_profile_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("test-stack-profile-dependency-surfaces-present", workspace_root)


def test_module_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("test-module-dependency-surfaces-present", workspace_root)


def test_run_archive_dependency_surfaces_present(workspace_root: Path) -> int:
    return _run_check("test-run-archive-dependency-surfaces-present", workspace_root)


def test_traceability_present(workspace_root: Path) -> int:
    scan = traceability_scan(workspace_root)
    return 0 if not missing_test_traceability_ids(workspace_root) and not scan["orphan_test_files"] else 1


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
    args = parser.parse_args(argv)
    workspace_root = Path(args.workspace).resolve()
    function_name = args.check.replace("-", "_")
    check_function = globals().get(function_name)
    if callable(check_function):
        return int(check_function(workspace_root))
    return _run_check(args.check, workspace_root)


if __name__ == "__main__":
    raise SystemExit(main())
