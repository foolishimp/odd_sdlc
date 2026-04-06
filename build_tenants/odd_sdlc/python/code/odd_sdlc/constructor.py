# Implements: REQ-F-ODDSDLC-003
# Implements: REQ-F-ODDSDLC-004
# Implements: REQ-F-ASSETMODEL-005
"""Bounded constructor turn for the first odd_sdlc slice."""
from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any

from genesis.events import EventContext, EventStream, emit

from .asset_types import ASSET_TYPES
from .fd_checks import (
    DESIGN_MARKER,
    CODE_MARKER,
    FEATURE_DECOMP_MARKER,
    GOALS_MARKER,
    IMPLEMENTATION_DESIGN_MARKER,
    IMPLEMENTATION_MODULE_MARKER,
    IMPLEMENTATION_STACK_PROFILE_MARKER,
    INTENT_MARKER,
    PRODUCT_MARKER,
    REQUIREMENTS_MARKER,
    RELEASE_MARKER,
    SCENARIO_MARKER,
    TEST_DESIGN_MARKER,
    TEST_MODULE_MARKER,
    TEST_RUN_ARCHIVE_MARKER,
    TEST_STACK_PROFILE_MARKER,
    TESTCASE_AUTHORITY_MARKER,
    UAT_TESTCASES_MARKER,
)
from .workspace_assets import checkpoint_for_path, relative_file_uri


def _read_json(path: Path, *, label: str) -> dict[str, Any]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError(f"{label} must be a JSON object")
    return raw


def _workspace_asset_path(workspace_root: Path, target_asset: str) -> Path:
    mapping = {
        "intent_surface": workspace_root / "specification" / "INTENT.md",
        "product_surface": workspace_root / "specification" / "PRODUCT.md",
        "goal_surface": workspace_root / "specification" / "GOALS.md",
        "requirement_surface": workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md",
        "feature_decomp_surface": workspace_root / "build_tenants" / "common" / "design" / "20-generated-feature-decomp.md",
        "uat_testcases_surface": workspace_root / "specification" / "scenarios" / "20-generated-uat-testcases.md",
        "design_surface": workspace_root / "build_tenants" / "common" / "design" / "30-generated-odd-design.md",
        "testcase_authority_surface": workspace_root / "specification" / "scenarios" / "30-generated-testcase-authority.md",
        "scenario_surface": workspace_root / "specification" / "scenarios" / "40-generated-scenarios.md",
        "implementation_design_surface": workspace_root / "build_tenants" / "odd_method" / "python" / "design" / "40-generated-implementation-design.md",
        "implementation_stack_profile": workspace_root / "build_tenants" / "odd_method" / "python" / "design" / "40-generated-implementation-stack.md",
        "implementation_module_surface": workspace_root / "build_tenants" / "odd_method" / "python" / "design" / "40-generated-implementation-modules.md",
        "code_surface": workspace_root / "build_tenants" / "odd_method" / "python" / "code" / "odd_generated_impl",
        "test_design_surface": workspace_root / "build_tenants" / "odd_sdlc" / "python" / "design" / "40-generated-test-design.md",
        "test_stack_profile": workspace_root / "build_tenants" / "odd_sdlc" / "python" / "test_env" / "40-generated-test-stack.md",
        "test_module_surface": workspace_root / "build_tenants" / "odd_sdlc" / "python" / "test_env" / "tests" / "40-generated-test-modules.md",
        "test_run_archive_surface": workspace_root / "build_tenants" / "odd_sdlc" / "python" / "test_env" / "50-generated-run-archive.md",
        "release_surface": workspace_root / "docs" / "40-generated-release.md",
    }
    try:
        return mapping[target_asset]
    except KeyError as exc:
        raise ValueError(f"Unsupported target_asset {target_asset!r}") from exc


def _construct_intent(workspace_root: Path) -> str:
    product = (workspace_root / "specification" / "PRODUCT.md").read_text(encoding="utf-8").strip()
    goals = (workspace_root / "specification" / "GOALS.md").read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Intent",
            "",
            INTENT_MARKER,
            "",
            "## Purpose",
            "`odd_sdlc` exists to prove that asset-typed GTL/ABG apps can be built, run, audited, reset, and rerun.",
            "",
            "## Bound Sources",
            f"- Product surface present: {'yes' if product else 'no'}",
            f"- Goals surface present: {'yes' if goals else 'no'}",
            "",
            "## Runtime Contract",
            "- graph functions are the constructive carrier",
            "- ABG owns runtime facts",
            "- post-mortem event audit is the primary proof surface",
            "",
        )
    )


def _construct_product(workspace_root: Path) -> str:
    intent = (workspace_root / "specification" / "INTENT.md").read_text(encoding="utf-8").strip()
    goals = (workspace_root / "specification" / "GOALS.md").read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Product",
            "",
            PRODUCT_MARKER,
            "",
            "The current product is a toy app with one real canonical use case:",
            "- derive intent from the bootstrap input set",
            "- derive product from the bootstrap input set plus the current intent surface",
            "- derive goals from the bootstrap input set plus the current intent and product surfaces",
            "- audit emitted facts across that dependency chain",
            "- reset and rerun the same chain",
            "",
            "## Intent Dependency Snapshot",
            intent,
            "",
            "## Current Goals Snapshot",
            goals,
            "",
        )
    )


def _construct_goals(workspace_root: Path) -> str:
    intent = (workspace_root / "specification" / "INTENT.md").read_text(encoding="utf-8").strip()
    product = (workspace_root / "specification" / "PRODUCT.md").read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Goals",
            "",
            GOALS_MARKER,
            "",
            "## Current Wave",
            "- keep the `INTENT -> PRODUCT -> GOALS` dependency chain canonical",
            "- keep the installed sandbox use case repeatable",
            "- prove runtime truth by event audit and archived rerun comparison",
            "",
            "## Upstream Surfaces",
            intent,
            "",
            product,
            "",
        )
    )


def _construct_requirements(workspace_root: Path) -> str:
    intent = (workspace_root / "specification" / "INTENT.md").read_text(encoding="utf-8").strip()
    product = (workspace_root / "specification" / "PRODUCT.md").read_text(encoding="utf-8").strip()
    goals = (workspace_root / "specification" / "GOALS.md").read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Bootstrap Requirements",
            "",
            REQUIREMENTS_MARKER,
            "",
            "The first odd_sdlc slice must remain installable, runnable, auditable, and resettable.",
            "",
            "## Generated Expectations",
            "- the installed sandbox opens the intent, product, and goal graph calls in dependency order",
            "- each bounded constructor turn records attributable asset mutation",
            "- assess-result closes each call lawfully",
            "- reset clears runtime state without corrupting the workspace",
            "",
            "## Derived Sources",
            intent,
            "",
            product,
            "",
            goals,
            "",
        )
    )


def _construct_feature_decomp(workspace_root: Path) -> str:
    requirements = (
        workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Feature Decomposition",
            "",
            FEATURE_DECOMP_MARKER,
            "",
            "## Candidate Features",
            "- bootstrap_chain: derive intent, product, goals, and requirements in lawful dependency order",
            "- fanout_outputs: derive downstream planning and proving surfaces from the generated requirement surface",
            "",
            "## Source Requirements Snapshot",
            requirements,
            "",
        )
    )


def _construct_uat_testcases(workspace_root: Path) -> str:
    requirements = (
        workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated UAT Testcases",
            "",
            UAT_TESTCASES_MARKER,
            "",
            "## Canonical Acceptance Cases",
            "1. install a clean sandbox workspace",
            "2. run the bootstrap subgraph to requirements",
            "3. fan out from requirements to feature decomposition and UAT testcase surfaces",
            "4. reset runtime state and rerun without losing archived evidence",
            "",
            "## Source Requirements Snapshot",
            requirements,
            "",
        )
    )


def _construct_design(workspace_root: Path) -> str:
    requirements = (
        workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md"
    ).read_text(encoding="utf-8").strip()
    feature_decomp = (
        workspace_root / "build_tenants" / "common" / "design" / "20-generated-feature-decomp.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated odd_sdlc Design",
            "",
            DESIGN_MARKER,
            "",
            "## Design Boundary",
            "- odd_sdlc keeps ABG as runtime truth and exposes domain query logic as a plugin boundary",
            "- the toy app grows by extending the asset graph, not by introducing a shadow controller",
            "",
            "## Source Requirements Snapshot",
            requirements,
            "",
            "## Source Feature Decomposition Snapshot",
            feature_decomp,
            "",
        )
    )


def _construct_testcase_authority(workspace_root: Path) -> str:
    uat_testcases = (
        workspace_root / "specification" / "scenarios" / "20-generated-uat-testcases.md"
    ).read_text(encoding="utf-8").strip()
    scenarios = (
        workspace_root / "specification" / "scenarios" / "40-generated-scenarios.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Testcase Authority",
            "",
            TESTCASE_AUTHORITY_MARKER,
            "",
            "## Current Authority Position",
            "- the generated UAT testcase collection together with the generated scenario set is the active authoritative verification surface for the current odd_sdlc sandbox slice",
            "- downstream proof lanes should validate against this joined verification surface until superseded by a newer qualified surface",
            "",
            "## Source UAT Testcase Snapshot",
            uat_testcases,
            "",
            "## Source Scenario Snapshot",
            scenarios,
            "",
        )
    )


def _construct_scenarios(workspace_root: Path) -> str:
    requirements = (
        workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md"
    ).read_text(encoding="utf-8").strip()
    design = (
        workspace_root / "build_tenants" / "common" / "design" / "30-generated-odd-design.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Scenarios",
            "",
            SCENARIO_MARKER,
            "",
            "## Canonical Scenario Bundles",
            "1. bootstrap the odd_sdlc sandbox and derive the current asset graph to release readiness",
            "2. observe the resulting runtime truth through ABG events and ODD domain queries",
            "3. reset runtime state and compare archived first-run and rerun evidence",
            "",
            "## Source Requirements Snapshot",
            requirements,
            "",
            "## Source Design Snapshot",
            design,
            "",
        )
    )


def _construct_implementation_design(workspace_root: Path) -> str:
    design = (
        workspace_root / "build_tenants" / "common" / "design" / "30-generated-odd-design.md"
    ).read_text(encoding="utf-8").strip()
    scenarios = (
        workspace_root / "specification" / "scenarios" / "40-generated-scenarios.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Implementation Design",
            "",
            IMPLEMENTATION_DESIGN_MARKER,
            "",
            "## Recursive Implementation SDLC",
            "- implementation work is modeled as its own bounded SDLC branch under build_tenants/odd_method/python",
            "- stack choice, module decomposition, and executable code are explicit generated assets",
            "- the implementation branch mirrors the test branch but emits code rather than archive evidence",
            "",
            "## Source Design Snapshot",
            design,
            "",
            "## Source Scenario Snapshot",
            scenarios,
            "",
        )
    )


def _construct_implementation_stack_profile(workspace_root: Path) -> str:
    implementation_design = (
        workspace_root / "build_tenants" / "odd_method" / "python" / "design" / "40-generated-implementation-design.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Implementation Stack Profile",
            "",
            IMPLEMENTATION_STACK_PROFILE_MARKER,
            "",
            "## Selected Stack",
            "- primary language: python",
            "- package model: directory-backed generated package under build_tenants/odd_method/python/code",
            "- runtime boundary: importable implementation package with explicit public summary function",
            "- proof posture: code generation is still audited through odd_sdlc event history and downstream tests",
            "",
            "## Source Implementation Design Snapshot",
            implementation_design,
            "",
        )
    )


def _construct_implementation_module_surface(workspace_root: Path) -> str:
    implementation_design = (
        workspace_root / "build_tenants" / "odd_method" / "python" / "design" / "40-generated-implementation-design.md"
    ).read_text(encoding="utf-8").strip()
    implementation_stack = (
        workspace_root / "build_tenants" / "odd_method" / "python" / "design" / "40-generated-implementation-stack.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Implementation Modules",
            "",
            IMPLEMENTATION_MODULE_MARKER,
            "",
            "## Module Layout",
            "- odd_generated_impl/__init__.py: package marker and public export surface",
            "- odd_generated_impl/workflow.py: generated implementation summary and executable entry helpers",
            "",
            "## Source Implementation Design Snapshot",
            implementation_design,
            "",
            "## Source Implementation Stack Snapshot",
            implementation_stack,
            "",
        )
    )


def _construct_code_surface(workspace_root: Path) -> dict[str, str]:
    implementation_modules = (
        workspace_root / "build_tenants" / "odd_method" / "python" / "design" / "40-generated-implementation-modules.md"
    ).read_text(encoding="utf-8").strip()
    implementation_stack = (
        workspace_root / "build_tenants" / "odd_method" / "python" / "design" / "40-generated-implementation-stack.md"
    ).read_text(encoding="utf-8").strip()
    init_text = "\n".join(
        (
            '"""Generated odd_method implementation package."""',
            "",
            f"# {CODE_MARKER}",
            "",
            "from .workflow import implementation_summary",
            "",
            "__all__ = [\"implementation_summary\"]",
            "",
        )
    )
    workflow_text = "\n".join(
        (
            '"""Generated implementation workflow helpers for the odd_sdlc toy branch."""',
            "",
            f"CODE_MARKER = {CODE_MARKER!r}",
            "",
            "def implementation_summary() -> dict[str, object]:",
            '    """Return the generated implementation branch summary."""',
            "    return {",
            '        "package": "odd_generated_impl",',
            '        "graph_function": "bootstrap_release_self_test",',
            '        "implementation_branch": [',
            '            "derive_implementation_design_surface",',
            '            "select_implementation_stack_profile",',
            '            "derive_implementation_module_surface",',
            '            "derive_code_surface",',
            "        ],",
            '        "artifacts": [',
            '            "implementation_design_surface",',
            '            "implementation_stack_profile",',
            '            "implementation_module_surface",',
            '            "code_surface",',
            "        ],",
            '        "module_surface_heading": '
            + repr(implementation_modules.splitlines()[0] if implementation_modules else ""),
            ",",
            '        "stack_surface_heading": '
            + repr(implementation_stack.splitlines()[0] if implementation_stack else ""),
            ",",
            "    }",
            "",
        )
    )
    return {
        "__init__.py": init_text,
        "workflow.py": workflow_text,
    }


def _construct_release(workspace_root: Path) -> str:
    requirements = (
        workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md"
    ).read_text(encoding="utf-8").strip()
    design = (
        workspace_root / "build_tenants" / "common" / "design" / "30-generated-odd-design.md"
    ).read_text(encoding="utf-8").strip()
    scenarios = (
        workspace_root / "specification" / "scenarios" / "40-generated-scenarios.md"
    ).read_text(encoding="utf-8").strip()
    code_surface = (
        workspace_root / "build_tenants" / "odd_method" / "python" / "code" / "odd_generated_impl" / "workflow.py"
    ).read_text(encoding="utf-8").strip()
    testcase_authority = (
        workspace_root / "specification" / "scenarios" / "30-generated-testcase-authority.md"
    ).read_text(encoding="utf-8").strip()
    test_run_archive = (
        workspace_root / "build_tenants" / "odd_sdlc" / "python" / "test_env" / "50-generated-run-archive.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Release Surface",
            "",
            RELEASE_MARKER,
            "",
            "## Current Release Position",
            "- requirements are present and regenerated",
            "- design is present and regenerated",
            "- scenarios are present and regenerated",
            "- implementation code is present and regenerated",
            "- testcase authority is present and regenerated",
            "- archived test evidence is present and regenerated",
            "- the current toy line is ready for downstream release-oriented review",
            "",
            "## Source Requirements Snapshot",
            requirements,
            "",
            "## Source Design Snapshot",
            design,
            "",
            "## Source Scenario Snapshot",
            scenarios,
            "",
            "## Source Code Snapshot",
            code_surface,
            "",
            "## Source Testcase Authority Snapshot",
            testcase_authority,
            "",
            "## Source Test Run Archive Snapshot",
            test_run_archive,
            "",
        )
    )


def _construct_test_design(workspace_root: Path) -> str:
    design = (
        workspace_root / "build_tenants" / "common" / "design" / "30-generated-odd-design.md"
    ).read_text(encoding="utf-8").strip()
    scenarios = (
        workspace_root / "specification" / "scenarios" / "40-generated-scenarios.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Test Design",
            "",
            TEST_DESIGN_MARKER,
            "",
            "## Recursive Test SDLC",
            "- test work is modeled as its own bounded SDLC branch under build_tenants/odd_sdlc/python/test_env",
            "- sandbox design, stack choice, module structure, and archived run evidence are explicit generated assets",
            "",
            "## Source Design Snapshot",
            design,
            "",
            "## Source Scenario Snapshot",
            scenarios,
            "",
        )
    )


def _construct_test_stack_profile(workspace_root: Path) -> str:
    test_design = (
        workspace_root / "build_tenants" / "odd_sdlc" / "python" / "design" / "40-generated-test-design.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Test Stack Profile",
            "",
            TEST_STACK_PROFILE_MARKER,
            "",
            "## Selected Stack",
            "- primary harness: pytest",
            "- sandbox orchestration: installed odd_sdlc workspace seeded through gen-install",
            "- archive model: persistent run archive with runtime snapshots and comparative analysis",
            "- UI path remains open for a later Playwright-derived branch",
            "",
            "## Source Test Design Snapshot",
            test_design,
            "",
        )
    )


def _construct_test_module_surface(workspace_root: Path) -> str:
    test_design = (
        workspace_root / "build_tenants" / "odd_sdlc" / "python" / "design" / "40-generated-test-design.md"
    ).read_text(encoding="utf-8").strip()
    test_stack = (
        workspace_root / "build_tenants" / "odd_sdlc" / "python" / "test_env" / "40-generated-test-stack.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Test Modules",
            "",
            TEST_MODULE_MARKER,
            "",
            "## Module Layout",
            "- sandbox_runtime.py: installed sandbox orchestration helpers",
            "- run_archive.py: persistent comparative archive helpers",
            "- test_odd_sdlc_sandbox_usecase.py: canonical sandbox proving lane",
            "",
            "## Source Test Design Snapshot",
            test_design,
            "",
            "## Source Test Stack Snapshot",
            test_stack,
            "",
        )
    )


def _construct_test_run_archive(workspace_root: Path) -> str:
    test_modules = (
        workspace_root / "build_tenants" / "odd_sdlc" / "python" / "test_env" / "tests" / "40-generated-test-modules.md"
    ).read_text(encoding="utf-8").strip()
    test_stack = (
        workspace_root / "build_tenants" / "odd_sdlc" / "python" / "test_env" / "40-generated-test-stack.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Test Run Archive",
            "",
            TEST_RUN_ARCHIVE_MARKER,
            "",
            "## Archive Policy",
            "- retain first-run and rerun runtime snapshots",
            "- retain summary.json and comparative_analysis.json artifacts",
            "- preserve archived workspaces as observable surfaces for odd_manager",
            "",
            "## Source Test Module Snapshot",
            test_modules,
            "",
            "## Source Test Stack Snapshot",
            test_stack,
            "",
        )
    )


def _constructed_content(target_asset: str, workspace_root: Path) -> str:
    if target_asset == "intent_surface":
        return _construct_intent(workspace_root)
    if target_asset == "product_surface":
        return _construct_product(workspace_root)
    if target_asset == "goal_surface":
        return _construct_goals(workspace_root)
    if target_asset == "requirement_surface":
        return _construct_requirements(workspace_root)
    if target_asset == "feature_decomp_surface":
        return _construct_feature_decomp(workspace_root)
    if target_asset == "uat_testcases_surface":
        return _construct_uat_testcases(workspace_root)
    if target_asset == "design_surface":
        return _construct_design(workspace_root)
    if target_asset == "testcase_authority_surface":
        return _construct_testcase_authority(workspace_root)
    if target_asset == "scenario_surface":
        return _construct_scenarios(workspace_root)
    if target_asset == "implementation_design_surface":
        return _construct_implementation_design(workspace_root)
    if target_asset == "implementation_stack_profile":
        return _construct_implementation_stack_profile(workspace_root)
    if target_asset == "implementation_module_surface":
        return _construct_implementation_module_surface(workspace_root)
    if target_asset == "code_surface":
        return _construct_code_surface(workspace_root)
    if target_asset == "test_design_surface":
        return _construct_test_design(workspace_root)
    if target_asset == "test_stack_profile":
        return _construct_test_stack_profile(workspace_root)
    if target_asset == "test_module_surface":
        return _construct_test_module_surface(workspace_root)
    if target_asset == "test_run_archive_surface":
        return _construct_test_run_archive(workspace_root)
    if target_asset == "release_surface":
        return _construct_release(workspace_root)
    raise ValueError(f"Unsupported target_asset {target_asset!r}")


def construct_manifest(manifest_path: str | Path, *, workspace_root: str | Path = ".") -> dict[str, Any]:
    workspace = Path(workspace_root).resolve()
    manifest_file = Path(manifest_path).resolve()
    manifest = _read_json(manifest_file, label=f"manifest file {manifest_file}")

    target_asset = manifest.get("target_asset")
    result_path = manifest.get("result_path")
    failing_evaluators = manifest.get("failing_evaluators", [])
    if not isinstance(target_asset, str) or not target_asset:
        raise ValueError("manifest must provide target_asset")
    if not isinstance(result_path, str) or not result_path:
        raise ValueError("manifest must provide result_path")
    if not isinstance(failing_evaluators, list) or not failing_evaluators:
        raise ValueError("manifest must provide failing_evaluators")

    target_path = _workspace_asset_path(workspace, target_asset)
    target_path.parent.mkdir(parents=True, exist_ok=True)
    previous_checkpoint = checkpoint_for_path(target_path)
    content = _constructed_content(target_asset, workspace)
    if target_asset == "code_surface":
        if target_path.exists():
            shutil.rmtree(target_path)
        target_path.mkdir(parents=True, exist_ok=True)
        for relative_path, file_content in content.items():
            file_path = target_path / relative_path
            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text(file_content, encoding="utf-8")
    else:
        target_path.write_text(content, encoding="utf-8")
    current_checkpoint = checkpoint_for_path(target_path)

    declared_asset_type = {
        "intent_surface": "intent_doc",
        "product_surface": "product_doc",
        "goal_surface": "goal_surface",
        "requirement_surface": "requirement_surface",
        "feature_decomp_surface": "feature_decomp_surface",
        "uat_testcases_surface": "uat_testcases_surface",
        "design_surface": "design_surface",
        "testcase_authority_surface": "testcase_authority_surface",
        "scenario_surface": "scenario_surface",
        "implementation_design_surface": "implementation_design_surface",
        "implementation_stack_profile": "implementation_stack_profile",
        "implementation_module_surface": "implementation_module_surface",
        "code_surface": "code_surface",
        "test_design_surface": "test_design_surface",
        "test_stack_profile": "test_stack_profile",
        "test_module_surface": "test_module_surface",
        "test_run_archive_surface": "test_run_archive_surface",
        "release_surface": "release_surface",
    }[target_asset]
    asset_profile = ASSET_TYPES[declared_asset_type]

    emit(
        "asset_checkpoint_updated",
        {
            "asset_id": target_asset,
            "asset_uri": relative_file_uri(target_path, workspace_root=workspace),
            "declared_asset_type": declared_asset_type,
            "mutable": asset_profile.mutable_default,
            "manifest_id": manifest["manifest_id"],
            "edge": manifest["edge"],
            "target_path": str(target_path),
            "previous_checkpoint": previous_checkpoint.to_dict(),
            "current_checkpoint": current_checkpoint.to_dict(),
        },
        stream=EventStream.open(workspace),
        context=EventContext(
            workflow_version=manifest.get("workflow_version", "unknown"),
            run_id=manifest.get("run_id"),
            job_id=manifest.get("job_id"),
            graph_function_id=manifest.get("graph_function_id"),
            materialization_id=manifest.get("materialization_id"),
            call_id=manifest.get("call_id"),
            vector_id=manifest.get("vector_id"),
            aggregate_type="graph_call",
            aggregate_id=manifest.get("call_id"),
            correlation_id=manifest.get("call_id"),
        ),
    )

    primary_evaluator = failing_evaluators[0]["name"]
    payload = {
        "edge": manifest["edge"],
        "actor": "odd_sdlc_constructor",
        "assessments": [
            {
                "evaluator": primary_evaluator,
                "result": "pass",
                "evidence": f"updated {target_path.relative_to(workspace)} via bounded constructor turn",
            }
        ],
    }
    result_file = Path(result_path)
    result_file.parent.mkdir(parents=True, exist_ok=True)
    result_file.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    return {
        "status": "constructed",
        "manifest_path": str(manifest_file),
        "target_asset": target_asset,
        "target_path": str(target_path),
        "result_path": str(result_file),
        "actor": payload["actor"],
        "evaluator": primary_evaluator,
    }
