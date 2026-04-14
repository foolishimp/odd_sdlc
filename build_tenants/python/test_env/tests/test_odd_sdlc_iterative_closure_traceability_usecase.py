# Validates: REQ-F-ODDSDLC-029
# Validates: REQ-F-ODDSDLC-030
# Validates: REQ-F-ODDSDLC-031
from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[4]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))

from odd_sdlc.app import bootstrap, initialize
from odd_sdlc.fd_checks import (
    code_traceability_present,
    goal_surface_authority_validated,
    requirement_scope_complete,
    test_traceability_present as fd_test_traceability_present,
)
from odd_sdlc.normalization import normalize_workspace
from odd_sdlc.project_profile import tenant_design_relative_path, tenant_output_dir, tenant_test_env_tests_relative_path
from odd_sdlc.query import query_domain
from odd_sdlc.traceability import REQUIREMENT_CLOSURE_REGISTER_PATH
from odd_sdlc.workspace_assets import asset_marker

from test_odd_sdlc_installation import _seed_data_mapper_template_workspace


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _seed_workspace(workspace: Path) -> None:
    tenant_name = "python"
    _write(
        workspace / ".ai-workspace" / "context" / "project_constraints.yml",
        "\n".join(
            (
                "project:",
                '  name: "iterative-closure.test"',
                '  kind: "software-project"',
                '  language: "Python"',
                '  test_runner: "pytest"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "python"',
                '      output_dir: "imp_trace/"',
                '      description: "traceability lane"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "INTENT.md",
        "\n".join(
            (
                "# Intent",
                "",
                "- INT-001: Carry unresolved live requirements across iterations.",
                "- INT-002: Recover full closure through iterative waves, not one-shot luck.",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "GOALS.md",
        "\n".join(
            (
                "# Goals",
                "",
                "- INT-001: Carry unresolved live requirements across iterations.",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "requirements" / "01-live.md",
        "\n".join(
            (
                "# Live Requirements",
                "",
                "- REQ-CORE-001: Keep the current branch executable.",
                "- REQ-CORE-002: Recover the deferred branch in a later iteration.",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "requirements" / "10-generated-bootstrap.md",
        "\n".join(
            (
                "# Generated Bootstrap Requirements",
                "",
                asset_marker("requirement_surface"),
                "",
                "- REQ-CORE-001: Keep the current branch executable.",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_design_relative_path(tenant_name, "40-generated-implementation-design.md"),
        "\n".join(
            (
                "# Generated Implementation Design",
                "",
                "- REQ-CORE-001",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_design_relative_path(tenant_name, "40-generated-implementation-modules.md"),
        "\n".join(
            (
                "# Generated Implementation Modules",
                "",
                "- module alpha realizes REQ-CORE-001",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_test_env_tests_relative_path(tenant_name, "40-generated-test-modules.md"),
        "\n".join(
            (
                "# Generated Test Modules",
                "",
                "- validation lane covers REQ-CORE-001",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "scenarios" / "30-generated-testcase-authority.md",
        "\n".join(
            (
                "# Generated Testcase Authority",
                "",
                "- REQ-CORE-001",
                "",
            )
        ),
    )
    _write(
        workspace / "imp_trace" / "src" / "main" / "logic.py",
        "\n".join(
            (
                "# Implements: REQ-CORE-001",
                "",
                "def run() -> int:",
                "    return 1",
                "",
            )
        ),
    )
    _write(
        workspace / "imp_trace" / "src" / "test" / "test_logic.py",
        "\n".join(
            (
                "# Validates: REQ-CORE-001",
                "",
                "def test_run() -> None:",
                "    assert True",
                "",
            )
        ),
    )


def _register_entries(payload: dict[str, object]) -> dict[str, dict[str, object]]:
    return {
        entry["requirement_id"]: entry
        for entry in payload["requirement_closure_register"]["requirements"]
    }


@pytest.mark.usecase_id("iterative_requirement_closure_and_generated_traceability")
def test_iterative_requirement_closure_and_generated_traceability(run_archive) -> None:
    workspace = run_archive.workspace
    _seed_workspace(workspace)

    initial_report = normalize_workspace(
        workspace,
        project_slug="iterative-closure",
        platform="python",
    )
    run_archive.capture_json("normalize.initial.json", initial_report)
    initial_domain = query_domain(initialize(bootstrap(workspace_root=workspace)))
    run_archive.capture_json("query_domain.initial.json", initial_domain)
    initial_entries = _register_entries(initial_domain)

    assert (workspace / REQUIREMENT_CLOSURE_REGISTER_PATH).exists()
    assert goal_surface_authority_validated(workspace) == 0
    assert requirement_scope_complete(workspace) == 1
    assert code_traceability_present(workspace) == 0
    assert fd_test_traceability_present(workspace) == 0
    assert initial_domain["query_contract"]["version"] == "v10"
    assert "analysis_manifest" in initial_domain["query_contract"]["top_level_keys"]
    assert initial_domain["requirement_closure_register"]["summary"]["missing_intent_ids_from_goals"] == 0
    assert initial_domain["requirement_closure_register"]["summary"]["missing_from_current_requirement_surface"] == 1
    assert initial_entries["REQ-CORE-001"]["status"] == "realized"
    assert initial_entries["REQ-CORE-002"]["status"] == "missing_from_current_requirement_surface"

    _write(
        workspace / "specification" / "GOALS.md",
        "\n".join(
            (
                "# Goals",
                "",
                "- INT-001: Carry unresolved live requirements across iterations.",
                "- INT-002: Recover full closure through iterative waves, not one-shot luck.",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "requirements" / "10-generated-bootstrap.md",
        "\n".join(
            (
                "# Generated Bootstrap Requirements",
                "",
                asset_marker("requirement_surface"),
                "",
                "- REQ-CORE-001: Keep the current branch executable.",
                "- REQ-CORE-002: Recover the deferred branch in a later iteration.",
                "",
            )
        ),
    )

    carried_report = normalize_workspace(
        workspace,
        project_slug="iterative-closure",
        platform="python",
    )
    run_archive.capture_json("normalize.carried.json", carried_report)
    carried_domain = query_domain(initialize(bootstrap(workspace_root=workspace)))
    run_archive.capture_json("query_domain.carried.json", carried_domain)
    carried_entries = _register_entries(carried_domain)

    assert goal_surface_authority_validated(workspace) == 0
    assert requirement_scope_complete(workspace) == 0
    assert code_traceability_present(workspace) == 0
    assert fd_test_traceability_present(workspace) == 0
    assert carried_domain["requirement_closure_register"]["summary"]["missing_from_current_requirement_surface"] == 0
    assert carried_entries["REQ-CORE-001"]["status"] == "realized"
    assert carried_entries["REQ-CORE-002"]["status"] == "specified"

    _write(
        workspace / tenant_design_relative_path("python", "40-generated-implementation-design.md"),
        "\n".join(
            (
                "# Generated Implementation Design",
                "",
                "- REQ-CORE-001",
                "- REQ-CORE-002",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_design_relative_path("python", "40-generated-implementation-modules.md"),
        "\n".join(
            (
                "# Generated Implementation Modules",
                "",
                "- module alpha realizes REQ-CORE-001",
                "- module beta realizes REQ-CORE-002",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_test_env_tests_relative_path("python", "40-generated-test-modules.md"),
        "\n".join(
            (
                "# Generated Test Modules",
                "",
                "- validation lane covers REQ-CORE-001",
                "- validation lane covers REQ-CORE-002",
                "",
            )
        ),
    )
    _write(
        workspace / "specification" / "scenarios" / "30-generated-testcase-authority.md",
        "\n".join(
            (
                "# Generated Testcase Authority",
                "",
                "- REQ-CORE-001",
                "- REQ-CORE-002",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_output_dir("python") / "src" / "main" / "repair.py",
        "\n".join(
            (
                "# Implements: REQ-CORE-002",
                "",
                "def recover() -> int:",
                "    return 2",
                "",
            )
        ),
    )
    _write(
        workspace / tenant_output_dir("python") / "src" / "test" / "test_repair.py",
        "\n".join(
            (
                "# Validates: REQ-CORE-002",
                "",
                "def test_recover() -> None:",
                "    assert True",
                "",
            )
        ),
    )

    realized_report = normalize_workspace(
        workspace,
        project_slug="iterative-closure",
        platform="python",
    )
    run_archive.capture_json("normalize.realized.json", realized_report)
    realized_domain = query_domain(initialize(bootstrap(workspace_root=workspace)))
    run_archive.capture_json("query_domain.realized.json", realized_domain)
    realized_entries = _register_entries(realized_domain)

    assert goal_surface_authority_validated(workspace) == 0
    assert requirement_scope_complete(workspace) == 0
    assert code_traceability_present(workspace) == 0
    assert fd_test_traceability_present(workspace) == 0
    assert realized_domain["requirement_closure_register"]["summary"]["requirements_missing_code_traceability"] == 0
    assert realized_domain["requirement_closure_register"]["summary"]["requirements_missing_test_traceability"] == 0
    assert realized_domain["requirement_closure_register"]["summary"]["orphan_code_files"] == 0
    assert realized_domain["requirement_closure_register"]["summary"]["orphan_test_files"] == 0
    assert realized_entries["REQ-CORE-001"]["status"] == "realized"
    assert realized_entries["REQ-CORE-002"]["status"] == "realized"


@pytest.mark.usecase_id("iterative_requirement_closure_and_generated_traceability")
def test_normalize_workspace_carries_intent_authority_into_default_goals(run_archive) -> None:
    workspace = run_archive.workspace
    _seed_data_mapper_template_workspace(workspace)

    report = normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    run_archive.capture_json("normalize.default_goals.json", report)

    goals_text = (workspace / "specification" / "GOALS.md").read_text(encoding="utf-8")
    assert "INT-001" in goals_text
    assert "INT-006" in goals_text
    assert goal_surface_authority_validated(workspace) == 0
