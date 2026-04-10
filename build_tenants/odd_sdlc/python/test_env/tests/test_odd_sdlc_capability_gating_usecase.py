# Validates: REQ-F-ODDSDLC-025
# Validates: REQ-F-ODDSDLC-026
from __future__ import annotations

import json
import shutil

import pytest

from odd_sdlc.release.install import install as install_release
from sandbox_runtime import read_events, run_installed_genesis
from test_odd_sdlc_installation import (
    DATA_MAPPER_TEMPLATE,
    _append_runtime_contract_overrides,
    _append_tenant_capability_contracts,
    _write_fake_transport_contract,
)


def _install_data_mapper_with_fake_transport(workspace):
    shutil.copytree(DATA_MAPPER_TEMPLATE, workspace, dirs_exist_ok=True)
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

    start_payload = json.loads(
        run_installed_genesis(
            workspace,
            "start",
            "--auto",
            archive=run_archive,
            label="capability gating start",
            timeout=180,
        ).stdout
    )
    run_archive.capture_json("start.result.json", start_payload)
    assert start_payload["status"] == "converged"

    final_gaps = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            archive=run_archive,
            label="capability gating gaps.final",
        ).stdout
    )
    run_archive.capture_json("gaps.final.json", final_gaps)
    assert final_gaps["converged"] is True
    assert final_gaps["total_delta"] == 0.0

    events = read_events(workspace)
    run_archive.capture_json("events.completed.json", events)
    graph_call_edges = [
        event["data"]["edge"]
        for event in events
        if event["event_type"] == "graph_call_opened"
    ]
    assert "prepare_release_surface" in graph_call_edges
    assert "prepare_deployment_surface" not in graph_call_edges
    assert "derive_runtime_observation_surface" not in graph_call_edges
    assert "derive_retrofit_plan_surface" not in graph_call_edges

    release_text = (workspace / "docs" / "40-generated-release.md").read_text(encoding="utf-8")
    assert "- completion_state: construction_complete_pending_execution" in release_text
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

    start_payload = json.loads(
        run_installed_genesis(
            workspace,
            "start",
            "--auto",
            archive=run_archive,
            label="capability enabled start",
            timeout=180,
        ).stdout
    )
    run_archive.capture_json("start.result.json", start_payload)
    assert start_payload["status"] == "converged"

    final_gaps = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            archive=run_archive,
            label="capability enabled gaps.final",
        ).stdout
    )
    run_archive.capture_json("gaps.final.json", final_gaps)
    assert final_gaps["converged"] is True
    assert final_gaps["total_delta"] == 0.0

    events = read_events(workspace)
    run_archive.capture_json("events.completed.json", events)
    graph_call_edges = [
        event["data"]["edge"]
        for event in events
        if event["event_type"] == "graph_call_opened"
    ]
    assert "prepare_deployment_surface" in graph_call_edges
    assert "derive_runtime_observation_surface" in graph_call_edges
    assert "derive_retrofit_plan_surface" in graph_call_edges

    deployment_text = (workspace / "docs" / "50-generated-deployment.md").read_text(encoding="utf-8")
    runtime_text = (workspace / "docs" / "60-generated-runtime-observation.md").read_text(encoding="utf-8")
    retrofit_text = (
        workspace / "build_tenants" / "odd_sdlc" / "python" / "design" / "60-generated-retrofit-plan.md"
    ).read_text(encoding="utf-8")
    assert "- completion_state: construction_complete_pending_execution" in deployment_text
    assert "- completion_state: construction_complete_pending_execution" in runtime_text
    assert "## Retrofit Boundary" in retrofit_text
