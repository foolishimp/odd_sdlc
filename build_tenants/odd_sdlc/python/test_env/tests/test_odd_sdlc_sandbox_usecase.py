# Validates: REQ-F-VERIFY-003
# Validates: REQ-F-VERIFY-004
# Validates: REQ-F-ODDSDLC-004
from __future__ import annotations

import json
from pathlib import Path

import pytest

from sandbox_runtime import (
    install_kernel_sandbox,
    read_events,
    reset_sandbox_runtime_state,
    run_constructor_for_start,
    run_installed_genesis,
    run_installed_odd_sdlc,
    seed_canonical_spec_surface,
    seed_odd_sdlc_package,
)


pytestmark = pytest.mark.usecase_id("canonical_sandbox_repeatability")


def _prepare_sandbox(workspace: Path, *, run_archive) -> None:
    install_kernel_sandbox(workspace, archive=run_archive)
    seed_odd_sdlc_package(workspace)
    seed_canonical_spec_surface(workspace)
    run_archive.note("sandbox_prepared", workspace=str(workspace))


def test_canonical_sandbox_usecase_runs_from_installed_workspace(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    catalog = json.loads(
        run_installed_odd_sdlc(workspace, "catalog", archive=run_archive, label="odd_sdlc catalog").stdout
    )
    run_archive.capture_json("catalog.json", catalog)
    assert len(catalog["assets"]) == 4
    assert [item["name"] for item in catalog["functions"]] == [
        "derive_intent_surface",
        "derive_product_surface",
        "derive_goal_surface",
        "derive_requirement_surface",
    ]

    gaps = json.loads(
        run_installed_odd_sdlc(workspace, "gaps", archive=run_archive, label="odd_sdlc gaps").stdout
    )
    run_archive.capture_json("gaps.json", gaps)
    assert gaps["converged"] is False
    assert len(gaps["gaps"]) == 4

    start = json.loads(
        run_installed_odd_sdlc(workspace, "start", archive=run_archive, label="odd_sdlc start").stdout
    )
    run_archive.capture_json("start.json", start)
    assert start["status"] == "iterated"
    assert start["edge"] == "derive_intent_surface"
    assert start["blocking_reason"] == "fp_dispatch"

    pre_assess_events = read_events(workspace)
    pre_assess_types = [event["event_type"] for event in pre_assess_events]
    assert pre_assess_types[-5:] == [
        "run_bound",
        "run_started",
        "graph_call_opened",
        "vector_started",
        "fp_dispatched",
    ]
    run_archive.capture_json("events.pre_assess.json", pre_assess_events)

    constructor, result_path = run_constructor_for_start(
        workspace,
        start_payload=start,
        archive=run_archive,
        label="odd_sdlc construct",
    )
    assert constructor["status"] == "constructed"
    assert Path(constructor["target_path"]).read_text(encoding="utf-8").startswith("# Intent")
    assessed = json.loads(
        run_installed_genesis(
            workspace,
            "assess-result",
            "--result",
            str(result_path),
            archive=run_archive,
            label="genesis assess-result",
        ).stdout
    )
    run_archive.capture_json("assessed.json", assessed)
    assert assessed["status"] == "ok"

    events = read_events(workspace)
    run_archive.capture_json("events.completed.json", events)
    event_types = [event["event_type"] for event in events]
    assert event_types[-7:] == [
        "fp_dispatched",
        "asset_checkpoint_updated",
        "assessed",
        "proof_passed",
        "closure_passed",
        "graph_call_closed",
        "run_completed",
    ]
    asset_update = next(event for event in events if event["event_type"] == "asset_checkpoint_updated")
    assert asset_update["aggregate_type"] == "graph_call"
    assert asset_update["aggregate_id"] == start["call_id"]
    assert asset_update["data"]["asset_id"] == "intent_surface"
    assert asset_update["data"]["declared_asset_type"] == "intent_doc"
    assert asset_update["data"]["current_checkpoint"]["exists"] is True
    assert asset_update["data"]["current_checkpoint"]["path_kind"] == "file"
    assert asset_update["data"]["previous_checkpoint"]["content_digest"] != asset_update["data"]["current_checkpoint"]["content_digest"]

    domain_query = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "query-domain",
            archive=run_archive,
            label="odd_sdlc query-domain",
        ).stdout
    )
    run_archive.capture_json("query-domain.json", domain_query)
    assert sorted(domain_query.keys()) == [
        "asset_types",
        "assets",
        "bindings",
        "functions",
        "gaps",
        "query_contract",
        "semantic_facets",
        "workspace_root",
    ]
    assert domain_query["query_contract"]["name"] == "odd_sdlc.query-domain"
    assert domain_query["query_contract"]["version"] == "v1"
    assert domain_query["query_contract"]["runtime_model"] == "abg-native"
    assert domain_query["query_contract"]["query_model"] == "odd-domain-plugin"
    assert "runs" not in domain_query
    assert "graph_calls" not in domain_query
    assert "continuations" not in domain_query

    observed = json.loads(
        run_installed_odd_sdlc(workspace, "observe", archive=run_archive, label="odd_sdlc observe").stdout
    )
    run_archive.capture_json("observe.json", observed)
    intent_asset = next(asset for asset in observed["assets"] if asset["asset_id"] == "intent_surface")
    assert intent_asset["projection_source"] == "event_history"
    assert intent_asset["update_count"] == 1
    assert intent_asset["provenance"]["source"] == "asset_checkpoint_events"
    assert intent_asset["provenance"]["last_event_id"] == asset_update["event_id"]
    assert intent_asset["checkpoint"] == asset_update["data"]["current_checkpoint"]
    assert observed["runs"][-1]["status"] == "completed"
    assert observed["graph_calls"][-1]["status"] == "closed"
    assert observed["continuations"] == []
    recent_event_types = [event["event_type"] for event in observed["recent_events"]]
    assert "run_completed" in recent_event_types
    assert recent_event_types[-1] == "edge_converged"
    run_archive.snapshot_runtime("completed_run", workspace=workspace)
    run_archive.update_summary(
        final_run_id=start["run_id"],
        final_call_id=start["call_id"],
        query_contract=domain_query["query_contract"],
    )


def test_canonical_sandbox_can_reset_runtime_state_and_rerun_cleanly(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    first = json.loads(
        run_installed_odd_sdlc(workspace, "start", archive=run_archive, label="odd_sdlc start first").stdout
    )
    _, first_result = run_constructor_for_start(
        workspace,
        start_payload=first,
        archive=run_archive,
        label="odd_sdlc construct first",
    )
    run_installed_genesis(
        workspace,
        "assess-result",
        "--result",
        str(first_result),
        archive=run_archive,
        label="genesis assess-result first",
    )
    first_events = read_events(workspace)
    run_archive.capture_json("events.first_run.json", first_events)
    assert any(event["event_type"] == "run_completed" for event in first_events)

    reset_sandbox_runtime_state(
        workspace,
        archive=run_archive,
        snapshot_label="first_run_completed",
    )
    assert read_events(workspace) == []
    first_snapshot_events = (
        run_archive.artifacts_dir
        / "runtime_snapshots"
        / "first_run_completed"
        / ".ai-workspace"
        / "events"
        / "events.jsonl"
    )
    assert first_snapshot_events.exists()

    second_gaps = json.loads(
        run_installed_odd_sdlc(workspace, "gaps", archive=run_archive, label="odd_sdlc gaps second").stdout
    )
    assert second_gaps["converged"] is False

    second = json.loads(
        run_installed_odd_sdlc(workspace, "start", archive=run_archive, label="odd_sdlc start second").stdout
    )
    _, second_result = run_constructor_for_start(
        workspace,
        start_payload=second,
        archive=run_archive,
        label="odd_sdlc construct second",
    )
    run_installed_genesis(
        workspace,
        "assess-result",
        "--result",
        str(second_result),
        archive=run_archive,
        label="genesis assess-result second",
    )
    second_events = read_events(workspace)
    run_archive.capture_json("events.second_run.json", second_events)
    second_event_types = [event["event_type"] for event in second_events]
    assert second_event_types == [
        "run_bound",
        "run_started",
        "graph_call_opened",
        "vector_started",
        "fp_dispatched",
        "asset_checkpoint_updated",
        "assessed",
        "proof_passed",
        "closure_passed",
        "graph_call_closed",
        "run_completed",
    ]
    assert first["run_id"] != second["run_id"]
    assert first["call_id"] != second["call_id"]
    run_archive.capture_json(
        "comparative_analysis.json",
        {
            "first_run_id": first["run_id"],
            "second_run_id": second["run_id"],
            "first_call_id": first["call_id"],
            "second_call_id": second["call_id"],
            "event_types_match": [event["event_type"] for event in first_events] == second_event_types,
            "first_event_types": [event["event_type"] for event in first_events],
            "second_event_types": second_event_types,
        },
    )
    run_archive.snapshot_runtime("second_run_completed", workspace=workspace)
    run_archive.update_summary(
        first_run_id=first["run_id"],
        second_run_id=second["run_id"],
        first_call_id=first["call_id"],
        second_call_id=second["call_id"],
        comparative_analysis="first and second installed sandbox runs archived for post-mortem comparison",
    )
