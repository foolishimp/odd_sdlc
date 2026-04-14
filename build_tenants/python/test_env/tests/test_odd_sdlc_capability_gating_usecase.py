# Validates: REQ-F-ODDSDLC-025
# Validates: REQ-F-ODDSDLC-026
from __future__ import annotations

import json
import pytest

from odd_sdlc.release.install import install as install_release
from sandbox_runtime import run_installed_genesis, run_installed_odd_sdlc
from test_odd_sdlc_installation import (
    _append_runtime_contract_overrides,
    _append_tenant_capability_contracts,
    _seed_data_mapper_template_workspace,
    _write_fake_transport_contract,
)


def _install_data_mapper_with_fake_transport(workspace):
    _seed_data_mapper_template_workspace(workspace)
    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    transport_contract = _write_fake_transport_contract(workspace)
    _append_runtime_contract_overrides(workspace, transport_contract=transport_contract)
    return payload


@pytest.mark.usecase_id("capability_gated_operational_convergence")
def test_operational_cycle_is_omitted_without_declared_capability(run_archive) -> None:
    workspace = run_archive.workspace
    payload = _install_data_mapper_with_fake_transport(workspace)
    run_archive.capture_json("install.payload.json", payload)

    initial_gaps = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            archive=run_archive,
            label="capability gating gaps.initial",
        ).stdout
    )
    run_archive.capture_json("gaps.initial.json", initial_gaps)
    assert initial_gaps["converged"] is False
    assert len(initial_gaps["gaps"]) == 18

    domain_query = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "query-domain",
            archive=run_archive,
            label="capability gating query-domain",
        ).stdout
    )
    run_archive.capture_json("query-domain.json", domain_query)
    function_names = [entry["name"] for entry in domain_query["functions"]]
    graph_function_names = [entry["name"] for entry in domain_query["graph_functions"]]
    program_names = [entry["name"] for entry in domain_query["programs"]]

    assert "prepare_deployment_surface" not in function_names
    assert "derive_runtime_observation_surface" not in function_names
    assert "derive_retrofit_plan_surface" not in function_names
    assert "release_operational_cycle" not in graph_function_names
    assert "release_operational_cycle" not in program_names
    assert not (workspace / "docs" / "50-generated-deployment.md").exists()
    assert not (workspace / "docs" / "60-generated-runtime-observation.md").exists()


@pytest.mark.usecase_id("capability_gated_operational_convergence")
def test_operational_cycle_returns_when_capability_is_declared(run_archive) -> None:
    workspace = run_archive.workspace
    payload = _install_data_mapper_with_fake_transport(workspace)
    _append_tenant_capability_contracts(
        workspace,
        deployment_contract="docs/deployment-contract.md",
        runtime_observation_contract="docs/runtime-observation-contract.md",
    )
    run_archive.capture_json("install.payload.json", payload)

    initial_gaps = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            archive=run_archive,
            label="capability enabled gaps.initial",
        ).stdout
    )
    run_archive.capture_json("gaps.initial.json", initial_gaps)
    assert initial_gaps["converged"] is False
    assert len(initial_gaps["gaps"]) == 21

    domain_query = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "query-domain",
            archive=run_archive,
            label="capability enabled query-domain",
        ).stdout
    )
    run_archive.capture_json("query-domain.json", domain_query)
    function_names = [entry["name"] for entry in domain_query["functions"]]
    graph_function_names = [entry["name"] for entry in domain_query["graph_functions"]]
    program_names = [entry["name"] for entry in domain_query["programs"]]

    assert "prepare_deployment_surface" in function_names
    assert "derive_runtime_observation_surface" in function_names
    assert "derive_retrofit_plan_surface" in function_names
    assert "release_operational_cycle" in graph_function_names
    assert "release_operational_cycle" in program_names
