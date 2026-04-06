# Validates: REQ-F-VERIFY-003
# Validates: REQ-F-VERIFY-004
# Validates: REQ-F-ODDSDLC-004
# Validates: REQ-F-ODDSDLC-006
from __future__ import annotations

import json
from pathlib import Path

import pytest

from sandbox_runtime import (
    complete_bootstrap_chain,
    install_kernel_sandbox,
    read_events,
    reset_sandbox_runtime_state,
    run_constructor_for_start,
    run_installed_genesis,
    run_installed_odd_sdlc,
    run_installed_self_test,
    seed_canonical_spec_surface,
    seed_odd_sdlc_package,
)


pytestmark = pytest.mark.usecase_id("canonical_sandbox_repeatability")

EXPECTED_BOOTSTRAP_STEPS = (
    "derive_intent_surface",
    "derive_product_surface",
    "derive_goal_surface",
    "derive_requirement_surface",
    "derive_feature_decomp_surface",
    "derive_uat_testcases_surface",
    "derive_design_surface",
    "derive_scenario_surface",
    "derive_test_design_surface",
    "select_test_stack_profile",
    "derive_test_module_surface",
    "derive_test_run_archive_surface",
    "qualify_testcase_authority",
    "prepare_release_surface",
)


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
    assert len(catalog["assets"]) == 14
    assert [item["name"] for item in catalog["functions"]] == [
        "derive_intent_surface",
        "derive_product_surface",
        "derive_goal_surface",
        "derive_requirement_surface",
        "derive_feature_decomp_surface",
        "derive_uat_testcases_surface",
        "derive_design_surface",
        "derive_scenario_surface",
        "derive_test_design_surface",
        "select_test_stack_profile",
        "derive_test_module_surface",
        "derive_test_run_archive_surface",
        "qualify_testcase_authority",
        "prepare_release_surface",
    ]
    assert [item["name"] for item in catalog["graph_functions"]] == ["bootstrap_release_self_test"]
    assert [item["name"] for item in catalog["jobs"]] == ["bootstrap_release_self_test_job"]
    assert catalog["graph_functions"][0]["job_names"] == ["bootstrap_release_self_test_job"]
    assert [vector["name"] for vector in catalog["graph_functions"][0]["vectors"]] == list(EXPECTED_BOOTSTRAP_STEPS)

    gaps = json.loads(
        run_installed_odd_sdlc(workspace, "gaps", archive=run_archive, label="odd_sdlc gaps").stdout
    )
    run_archive.capture_json("gaps.json", gaps)
    assert gaps["converged"] is False
    assert len(gaps["gaps"]) == 14

    chain = complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="bootstrap_chain")
    run_archive.capture_json("chain.json", chain)
    assert [step["start"]["edge"] for step in chain] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert chain[0]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[1]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[2]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[3]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[4]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[5]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[6]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[7]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[8]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[9]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[10]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[11]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[12]["start"]["blocking_reason"] == "fp_dispatch"
    assert chain[13]["start"]["blocking_reason"] == "fp_dispatch"
    assert Path(chain[0]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Intent")
    assert Path(chain[1]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Product")
    assert Path(chain[2]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Goals")
    assert Path(chain[3]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Bootstrap Requirements")
    assert Path(chain[4]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Feature Decomposition")
    assert Path(chain[5]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated UAT Testcases")
    assert Path(chain[6]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated odd_sdlc Design")
    assert Path(chain[7]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Scenarios")
    assert Path(chain[8]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Test Design")
    assert Path(chain[9]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Test Stack Profile")
    assert Path(chain[10]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Test Modules")
    assert Path(chain[11]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Test Run Archive")
    assert Path(chain[12]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Testcase Authority")
    assert Path(chain[13]["constructor"]["target_path"]).read_text(encoding="utf-8").startswith("# Generated Release Surface")
    assert all(step["assessed"]["status"] == "ok" for step in chain)

    events = read_events(workspace)
    run_archive.capture_json("events.completed.json", events)
    graph_call_events = [event for event in events if event["event_type"] == "graph_call_opened"]
    assert [event["data"]["graph_function"] for event in graph_call_events] == ["bootstrap_release_self_test"] * len(
        EXPECTED_BOOTSTRAP_STEPS
    )
    assert [event["data"]["edge"] for event in graph_call_events] == list(EXPECTED_BOOTSTRAP_STEPS)
    asset_updates = [event for event in events if event["event_type"] == "asset_checkpoint_updated"]
    assert [event["data"]["asset_id"] for event in asset_updates] == [
        "intent_surface",
        "product_surface",
        "goal_surface",
        "requirement_surface",
        "feature_decomp_surface",
        "uat_testcases_surface",
        "design_surface",
        "scenario_surface",
        "test_design_surface",
        "test_stack_profile",
        "test_module_surface",
        "test_run_archive_surface",
        "testcase_authority_surface",
        "release_surface",
    ]
    assert [event["aggregate_id"] for event in asset_updates] == [step["start"]["call_id"] for step in chain]
    assert all(event["data"]["current_checkpoint"]["exists"] is True for event in asset_updates)
    assert all(event["data"]["current_checkpoint"]["path_kind"] == "file" for event in asset_updates)
    assert all(
        event["data"]["previous_checkpoint"]["content_digest"] != event["data"]["current_checkpoint"]["content_digest"]
        for event in asset_updates
    )

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
        "graph_functions",
        "query_contract",
        "semantic_facets",
        "workspace_root",
    ]
    assert domain_query["query_contract"]["name"] == "odd_sdlc.query-domain"
    assert domain_query["query_contract"]["version"] == "v2"
    assert domain_query["query_contract"]["top_level_keys"] == [
        "query_contract",
        "workspace_root",
        "semantic_facets",
        "asset_types",
        "assets",
        "functions",
        "graph_functions",
        "bindings",
        "gaps",
    ]
    assert domain_query["query_contract"]["runtime_model"] == "abg-native"
    assert domain_query["query_contract"]["query_model"] == "odd-domain-plugin"
    assert "runs" not in domain_query
    assert "graph_calls" not in domain_query
    assert "continuations" not in domain_query

    observed = json.loads(
        run_installed_odd_sdlc(workspace, "observe", archive=run_archive, label="odd_sdlc observe").stdout
    )
    run_archive.capture_json("observe.json", observed)
    observed_assets = {asset["asset_id"]: asset for asset in observed["assets"]}
    for asset_id, event in zip(
        (
            "intent_surface",
            "product_surface",
            "goal_surface",
            "requirement_surface",
            "feature_decomp_surface",
            "uat_testcases_surface",
            "design_surface",
            "scenario_surface",
            "test_design_surface",
            "test_stack_profile",
            "test_module_surface",
            "test_run_archive_surface",
            "testcase_authority_surface",
            "release_surface",
        ),
        asset_updates,
        strict=True,
    ):
        observed_asset = observed_assets[asset_id]
        assert observed_asset["projection_source"] == "event_history"
        assert observed_asset["update_count"] == 1
        assert observed_asset["provenance"]["source"] == "asset_checkpoint_events"
        assert observed_asset["provenance"]["last_event_id"] == event["event_id"]
        assert observed_asset["checkpoint"] == event["data"]["current_checkpoint"]
    assert [run["status"] for run in observed["runs"]] == ["completed"] * 14
    assert [call["status"] for call in observed["graph_calls"]] == ["closed"] * 14
    assert observed["continuations"] == []
    recent_event_types = [event["event_type"] for event in observed["recent_events"]]
    assert "run_completed" in recent_event_types
    assert recent_event_types[-1] == "edge_converged"
    run_archive.snapshot_runtime("completed_run", workspace=workspace)
    run_archive.update_summary(
        completed_edges=[step["start"]["edge"] for step in chain],
        final_run_id=chain[-1]["start"]["run_id"],
        final_call_id=chain[-1]["start"]["call_id"],
        query_contract=domain_query["query_contract"],
    )


def test_installed_self_test_command_drives_the_current_executive_program(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    payload = run_installed_self_test(workspace, archive=run_archive)

    assert payload["status"] == "ok"
    assert payload["program"]["name"] == "bootstrap_release_self_test"
    assert payload["completed_edges"] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert payload["final_state"]["status"] == "converged"
    assert all(step["start"]["blocking_reason"] == "fp_dispatch" for step in payload["steps"])
    assert all(step["assessed"]["status"] == "ok" for step in payload["steps"])

    events = read_events(workspace)
    graph_call_events = [event for event in events if event["event_type"] == "graph_call_opened"]
    assert [event["data"]["graph_function"] for event in graph_call_events] == ["bootstrap_release_self_test"] * len(
        EXPECTED_BOOTSTRAP_STEPS
    )
    assert [event["event_type"] for event in events if event["event_type"] == "run_completed"] == ["run_completed"] * 14
    assert (workspace / "docs" / "40-generated-release.md").exists()


def test_canonical_sandbox_can_reset_runtime_state_and_rerun_cleanly(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    first_chain = complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="first")
    first_events = read_events(workspace)
    run_archive.capture_json("events.first_run.json", first_events)
    assert [step["start"]["edge"] for step in first_chain] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert [event["data"]["asset_id"] for event in first_events if event["event_type"] == "asset_checkpoint_updated"] == [
        "intent_surface",
        "product_surface",
        "goal_surface",
        "requirement_surface",
        "feature_decomp_surface",
        "uat_testcases_surface",
        "design_surface",
        "scenario_surface",
        "test_design_surface",
        "test_stack_profile",
        "test_module_surface",
        "test_run_archive_surface",
        "testcase_authority_surface",
        "release_surface",
    ]

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

    second_chain = complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="second")
    second_events = read_events(workspace)
    run_archive.capture_json("events.second_run.json", second_events)
    assert [step["start"]["edge"] for step in second_chain] == list(EXPECTED_BOOTSTRAP_STEPS)
    second_event_types = [event["event_type"] for event in second_events]
    expected_step = [
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
    assert second_event_types == expected_step * 14
    assert first_chain[0]["start"]["run_id"] != second_chain[0]["start"]["run_id"]
    assert first_chain[0]["start"]["call_id"] != second_chain[0]["start"]["call_id"]
    run_archive.capture_json(
        "comparative_analysis.json",
        {
            "first_run_ids": [step["start"]["run_id"] for step in first_chain],
            "second_run_ids": [step["start"]["run_id"] for step in second_chain],
            "first_call_ids": [step["start"]["call_id"] for step in first_chain],
            "second_call_ids": [step["start"]["call_id"] for step in second_chain],
            "first_edges": [step["start"]["edge"] for step in first_chain],
            "second_edges": [step["start"]["edge"] for step in second_chain],
            "event_types_match": [event["event_type"] for event in first_events if event["event_type"] != "genesis_installed"] == second_event_types,
            "first_event_types": [event["event_type"] for event in first_events],
            "second_event_types": second_event_types,
        },
    )
    run_archive.snapshot_runtime("second_run_completed", workspace=workspace)
    run_archive.update_summary(
        first_run_ids=[step["start"]["run_id"] for step in first_chain],
        second_run_ids=[step["start"]["run_id"] for step in second_chain],
        completed_edges=[step["start"]["edge"] for step in second_chain],
        comparative_analysis="first and second installed sandbox bootstrap-subgraph runs archived for post-mortem comparison",
    )
