# Validates: REQ-F-VERIFY-003
# Validates: REQ-F-VERIFY-004
# Validates: REQ-F-ODDSDLC-004
# Validates: REQ-F-ODDSDLC-006
from __future__ import annotations

import contextlib
import importlib.util
import io
import json
from pathlib import Path

import pytest

from odd_sdlc.workspace_assets import asset_path
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
    "derive_implementation_design_surface",
    "select_implementation_stack_profile",
    "derive_implementation_module_surface",
    "derive_code_surface",
    "derive_test_design_surface",
    "select_test_stack_profile",
    "derive_test_module_surface",
    "derive_test_run_archive_surface",
    "qualify_testcase_authority",
    "prepare_release_surface",
)

EXPECTED_FUNCTIONS = (
    "derive_intent_surface",
    "derive_product_surface",
    "derive_goal_surface",
    "derive_requirement_surface",
    "derive_feature_decomp_surface",
    "derive_uat_testcases_surface",
    "derive_design_surface",
    "derive_scenario_surface",
    "derive_implementation_design_surface",
    "select_implementation_stack_profile",
    "derive_implementation_module_surface",
    "derive_code_surface",
    "derive_test_design_surface",
    "select_test_stack_profile",
    "derive_test_module_surface",
    "derive_test_run_archive_surface",
    "qualify_testcase_authority",
    "prepare_release_surface",
    "prepare_deployment_surface",
    "derive_runtime_observation_surface",
    "derive_retrofit_plan_surface",
)

EXPECTED_GRAPH_FUNCTIONS = (
    "bootstrap_release_self_test",
    "release_operational_cycle",
    "review_design_consensus_round",
    "review_design_by_consensus",
)
EXPECTED_OPERATIONAL_STEPS = (
    "prepare_deployment_surface",
    "derive_runtime_observation_surface",
    "derive_retrofit_plan_surface",
)

EXPECTED_CONSENSUS_STEPS = (
    "derive_review_assessment_surface",
    "derive_consensus_decision_surface",
    "derive_reviewed_design_surface",
)
EXPECTED_CONSENSUS_HARNESS_STEPS = (
    "review_design_assessment_round",
    "reduce_design_consensus_decision",
    "apply_design_consensus_decision",
)

EXPECTED_CONSENSUS_UPDATED_ASSETS = (
    "review_assessment_surface",
    "consensus_decision_surface",
    "reviewed_design_surface",
)

CONSENSUS_ROUND_MODULE_REF = "odd_sdlc.consensus_module:MODULE"
CONSENSUS_HARNESS_MODULE_REF = "odd_sdlc.consensus_harness_module:MODULE"

EXPECTED_UPDATED_ASSETS = (
    "intent_surface",
    "product_surface",
    "goal_surface",
    "requirement_surface",
    "feature_decomp_surface",
    "uat_testcases_surface",
    "design_surface",
    "scenario_surface",
    "implementation_design_surface",
    "implementation_stack_profile",
    "implementation_module_surface",
    "code_surface",
    "test_design_surface",
    "test_stack_profile",
    "test_module_surface",
    "test_run_archive_surface",
    "testcase_authority_surface",
    "release_surface",
)
EXPECTED_OPERATIONAL_UPDATED_ASSETS = (
    "deployment_surface",
    "runtime_observation_surface",
    "retrofit_plan_surface",
)


def _assert_constructor_attestation(constructor: dict[str, object]) -> None:
    attestation = constructor.get("attestation")
    assert isinstance(attestation, dict)
    assert attestation["asset_id"] == constructor["target_asset"]
    assert attestation["contract_satisfied"] is True
    assert attestation["missing_files"] == []
    assert attestation["member_prefix_failures"] == []


def _load_generated_code_summary(workspace: Path) -> dict[str, object]:
    workflow_path = asset_path(workspace, "code_surface") / "workflow.py"
    spec = importlib.util.spec_from_file_location("odd_sdlc_proving_impl.workflow", workflow_path)
    if spec is None or spec.loader is None:
        raise AssertionError(f"Could not load generated workflow module from {workflow_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    summary = module.implementation_summary()
    if not isinstance(summary, dict):
        raise AssertionError("Generated implementation_summary() must return a dict")
    return summary


def _validate_generated_hello_world_app(workspace: Path) -> dict[str, object]:
    app_path = asset_path(workspace, "code_surface") / "app.py"
    spec = importlib.util.spec_from_file_location("odd_sdlc_proving_impl.app", app_path)
    if spec is None or spec.loader is None:
        raise AssertionError(f"Could not load generated app module from {app_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    message = module.hello_message()
    if not isinstance(message, str):
        raise AssertionError("Generated hello_message() must return a string")
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        exit_code = module.main()
    return {
        "message": message,
        "stdout": output.getvalue().strip(),
        "exit_code": exit_code,
    }


def _prepare_sandbox(workspace: Path, *, run_archive) -> None:
    install_kernel_sandbox(workspace, archive=run_archive)
    seed_odd_sdlc_package(workspace)
    seed_canonical_spec_surface(workspace)
    refresh_analysis = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "refresh-analysis",
            archive=run_archive,
            label="odd_sdlc refresh-analysis",
        ).stdout
    )
    run_archive.capture_json("refresh-analysis.json", refresh_analysis)
    run_archive.note("sandbox_prepared", workspace=str(workspace))


def test_canonical_sandbox_usecase_runs_from_installed_workspace(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    catalog = json.loads(
        run_installed_odd_sdlc(workspace, "catalog", archive=run_archive, label="odd_sdlc catalog").stdout
    )
    run_archive.capture_json("catalog.json", catalog)
    assert len(catalog["assets"]) == 26
    assert any(asset["asset_id"] == "ambiguity_register_surface" for asset in catalog["assets"])
    assert any(asset["asset_id"] == "requirement_closure_register_surface" for asset in catalog["assets"])
    assert [item["name"] for item in catalog["asset_families"]] == [
        "worksite_inputs",
        "solution_design",
        "implementation_branch",
        "qualification_branch",
        "release_readiness",
        "deployment_records",
        "runtime_evidence",
        "retrofit_plans",
    ]
    assert [item["name"] for item in catalog["work_act_types"]] == [
        "generate",
        "adopt",
        "import",
        "qualify",
        "release",
        "deploy",
        "observe",
        "retrofit",
    ]
    assert [item["name"] for item in catalog["edge_contracts"]] == [
        "bootstrap_spec_foundation",
        "materialize_implementation_branch",
        "materialize_qualification_branch",
        "prepare_release_readiness",
        "publish_deployment_record",
        "return_runtime_evidence",
        "retrofit_and_relaunch",
    ]
    assert [item["name"] for item in catalog["functions"]] == list(EXPECTED_FUNCTIONS)
    assert [item["name"] for item in catalog["graph_functions"]] == list(EXPECTED_GRAPH_FUNCTIONS)
    assert [item["name"] for item in catalog["jobs"]] == ["bootstrap_release_self_test_job", "release_operational_cycle_job"]
    assert catalog["graph_functions"][0]["job_names"] == ["bootstrap_release_self_test_job"]
    assert [vector["name"] for vector in catalog["graph_functions"][0]["vectors"]] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert catalog["graph_functions"][1]["job_names"] == ["release_operational_cycle_job"]
    assert [vector["name"] for vector in catalog["graph_functions"][1]["vectors"]] == list(EXPECTED_OPERATIONAL_STEPS)
    assert catalog["graph_functions"][2]["job_names"] == []
    assert [vector["name"] for vector in catalog["graph_functions"][2]["vectors"]] == list(EXPECTED_CONSENSUS_STEPS)
    assert catalog["graph_functions"][3]["template_kind"] == "symbolic"
    assert catalog["graph_functions"][3]["vectors"] == []

    gaps = json.loads(
        run_installed_odd_sdlc(workspace, "gaps", archive=run_archive, label="odd_sdlc gaps").stdout
    )
    run_archive.capture_json("gaps.json", gaps)
    assert gaps["converged"] is False
    assert len(gaps["gaps"]) == 21

    chain = complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="bootstrap_chain")
    run_archive.capture_json("chain.json", chain)
    assert [step["start"]["edge"] for step in chain] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert all(step["start"]["blocking_reason"] == "fp_dispatch" for step in chain)
    for step in chain:
        _assert_constructor_attestation(step["constructor"])
    assert all(step["assessed"]["status"] == "ok" for step in chain)
    generated_summary = _load_generated_code_summary(workspace)
    assert generated_summary["package"] == "odd_sdlc_proving_impl"
    assert generated_summary["graph_function"] == "bootstrap_release_self_test"
    assert generated_summary["hello_message"] == "Hello from odd_sdlc proving subset."
    assert generated_summary["entry_module"] == "odd_sdlc_proving_impl.app"
    assert generated_summary["entrypoint"] == "main"
    assert generated_summary["implementation_branch"] == list(EXPECTED_BOOTSTRAP_STEPS[8:12])
    assert generated_summary["artifacts"] == [
        "implementation_design_surface",
        "implementation_stack_profile",
        "implementation_module_surface",
        "code_surface",
    ]
    generated_app = _validate_generated_hello_world_app(workspace)
    assert generated_app == {
        "message": "Hello from odd_sdlc proving subset.",
        "stdout": "Hello from odd_sdlc proving subset.",
        "exit_code": 0,
    }

    events = read_events(workspace)
    run_archive.capture_json("events.completed.json", events)
    graph_call_events = [event for event in events if event["event_type"] == "graph_call_opened"]
    assert [event["data"]["graph_function"] for event in graph_call_events] == ["bootstrap_release_self_test"] * len(
        EXPECTED_BOOTSTRAP_STEPS
    )
    assert [event["data"]["edge"] for event in graph_call_events] == list(EXPECTED_BOOTSTRAP_STEPS)
    asset_updates = [event for event in events if event["event_type"] == "asset_checkpoint_updated"]
    assert [event["data"]["asset_id"] for event in asset_updates] == list(EXPECTED_UPDATED_ASSETS)
    assert [event["aggregate_id"] for event in asset_updates] == [step["start"]["call_id"] for step in chain]
    assert all(event["data"]["current_checkpoint"]["exists"] is True for event in asset_updates)
    path_kind_by_asset = {
        event["data"]["asset_id"]: event["data"]["current_checkpoint"]["path_kind"]
        for event in asset_updates
    }
    assert path_kind_by_asset["code_surface"] == "directory"
    assert all(
        path_kind == "file"
        for asset_id, path_kind in path_kind_by_asset.items()
        if asset_id != "code_surface"
    )
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
        "ambiguity_register",
        "asset_families",
        "asset_types",
        "assets",
        "bindings",
        "collections",
        "edge_contracts",
        "functions",
        "gaps",
        "graph_functions",
        "jobs",
        "programs",
        "query_contract",
        "requirement_closure_register",
        "semantic_facets",
        "work_act_types",
        "workspace_root",
    ]
    assert domain_query["query_contract"]["name"] == "odd_sdlc.query-domain"
    assert domain_query["query_contract"]["version"] == "v7"
    assert domain_query["query_contract"]["top_level_keys"] == [
        "query_contract",
        "workspace_root",
        "semantic_facets",
        "asset_types",
        "asset_families",
        "assets",
        "ambiguity_register",
        "requirement_closure_register",
        "collections",
        "functions",
        "edge_contracts",
        "programs",
        "work_act_types",
        "jobs",
        "graph_functions",
        "bindings",
        "gaps",
    ]
    assert domain_query["query_contract"]["runtime_model"] == "abg-native"
    assert domain_query["query_contract"]["query_model"] == "odd-domain-plugin"
    assert "runs" not in domain_query
    assert "graph_calls" not in domain_query
    assert "continuations" not in domain_query
    assert domain_query["ambiguity_register"]["register_kind"] == "odd_sdlc.ambiguity_register"
    assert domain_query["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert domain_query["asset_families"][0]["name"] == "worksite_inputs"
    assert domain_query["work_act_types"][0]["name"] == "generate"
    assert domain_query["edge_contracts"][0]["name"] == "bootstrap_spec_foundation"

    observed = json.loads(
        run_installed_odd_sdlc(workspace, "observe", archive=run_archive, label="odd_sdlc observe").stdout
    )
    run_archive.capture_json("observe.json", observed)
    observed_assets = {asset["asset_id"]: asset for asset in observed["assets"]}
    for asset_id, event in zip(EXPECTED_UPDATED_ASSETS, asset_updates, strict=True):
        observed_asset = observed_assets[asset_id]
        assert observed_asset["projection_source"] == "event_history"
        assert observed_asset["update_count"] == 1
        assert observed_asset["provenance"]["source"] == "asset_checkpoint_events"
        assert observed_asset["provenance"]["last_event_id"] == event["event_id"]
        assert observed_asset["checkpoint"] == event["data"]["current_checkpoint"]
    assert [run["status"] for run in observed["runs"]] == ["completed"] * 18
    assert [call["status"] for call in observed["graph_calls"]] == ["closed"] * 18
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


def test_consensus_round_module_runs_from_a_generated_design_surface(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    bootstrap_prefix = complete_bootstrap_chain(
        workspace,
        archive=run_archive,
        label_prefix="consensus_bootstrap_prefix",
        steps=EXPECTED_BOOTSTRAP_STEPS[:7],
    )
    assert bootstrap_prefix[-1]["start"]["edge"] == "derive_design_surface"

    module_ref = CONSENSUS_ROUND_MODULE_REF
    completed_round: list[dict[str, object]] = []
    for edge in EXPECTED_CONSENSUS_STEPS:
        start = json.loads(
            run_installed_genesis(
                workspace,
                "start",
                "--module",
                module_ref,
                archive=run_archive,
                label=f"{edge} start",
            ).stdout
        )
        assert start["edge"] == edge
        assert start["blocking_reason"] == "fp_dispatch"
        constructor, result_path = run_constructor_for_start(
            workspace,
            start_payload=start,
            archive=run_archive,
            label=f"{edge} construct",
        )
        assessed = json.loads(
            run_installed_genesis(
                workspace,
                "assess-result",
                "--result",
                str(result_path),
                archive=run_archive,
                label=f"{edge} assess-result",
            ).stdout
        )
        completed_round.append(
            {
                "start": start,
                "constructor": constructor,
                "assessed": assessed,
            }
        )

    assert [step["start"]["edge"] for step in completed_round] == list(EXPECTED_CONSENSUS_STEPS)
    assert all(step["assessed"]["status"] == "ok" for step in completed_round)
    for step in completed_round:
        _assert_constructor_attestation(step["constructor"])

    consensus_gaps = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            "--module",
            module_ref,
            archive=run_archive,
            label="consensus gaps",
        ).stdout
    )
    assert consensus_gaps["converged"] is True
    assert [entry["edge"] for entry in consensus_gaps["gaps"]] == list(EXPECTED_CONSENSUS_STEPS)
    assert all(entry["delta"] == 0 for entry in consensus_gaps["gaps"])

    events = read_events(workspace)
    consensus_graph_calls = [
        event
        for event in events
        if event["event_type"] == "graph_call_opened"
        and event["data"]["graph_function"] == "review_design_consensus_round"
    ]
    assert [event["data"]["edge"] for event in consensus_graph_calls] == list(EXPECTED_CONSENSUS_STEPS)

    consensus_asset_updates = [
        event
        for event in events
        if event["event_type"] == "asset_checkpoint_updated"
        and event["data"]["asset_id"] in EXPECTED_CONSENSUS_UPDATED_ASSETS
    ]
    assert [event["data"]["asset_id"] for event in consensus_asset_updates] == list(EXPECTED_CONSENSUS_UPDATED_ASSETS)
    assert all(event["data"]["current_checkpoint"]["exists"] is True for event in consensus_asset_updates)


def test_consensus_harness_module_runs_from_a_generated_design_surface(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    bootstrap_prefix = complete_bootstrap_chain(
        workspace,
        archive=run_archive,
        label_prefix="consensus_harness_bootstrap_prefix",
        steps=EXPECTED_BOOTSTRAP_STEPS[:7],
    )
    assert bootstrap_prefix[-1]["start"]["edge"] == "derive_design_surface"

    completed_round: list[dict[str, object]] = []
    for edge in EXPECTED_CONSENSUS_HARNESS_STEPS:
        start = json.loads(
            run_installed_genesis(
                workspace,
                "start",
                "--module",
                CONSENSUS_HARNESS_MODULE_REF,
                archive=run_archive,
                label=f"{edge} harness start",
            ).stdout
        )
        assert start["edge"] == edge
        assert start["blocking_reason"] == "fp_dispatch"
        constructor, result_path = run_constructor_for_start(
            workspace,
            start_payload=start,
            archive=run_archive,
            label=f"{edge} harness construct",
        )
        assessed = json.loads(
            run_installed_genesis(
                workspace,
                "assess-result",
                "--result",
                str(result_path),
                archive=run_archive,
                label=f"{edge} harness assess-result",
            ).stdout
        )
        completed_round.append(
            {
                "start": start,
                "constructor": constructor,
                "assessed": assessed,
            }
        )

    assert [step["start"]["edge"] for step in completed_round] == list(EXPECTED_CONSENSUS_HARNESS_STEPS)
    assert all(step["assessed"]["status"] == "ok" for step in completed_round)
    for step in completed_round:
        _assert_constructor_attestation(step["constructor"])

    consensus_gaps = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            "--module",
            CONSENSUS_HARNESS_MODULE_REF,
            archive=run_archive,
            label="consensus harness gaps",
        ).stdout
    )
    assert consensus_gaps["converged"] is True
    assert [entry["edge"] for entry in consensus_gaps["gaps"]] == list(EXPECTED_CONSENSUS_HARNESS_STEPS)
    assert all(entry["delta"] == 0 for entry in consensus_gaps["gaps"])

    events = read_events(workspace)
    consensus_graph_calls = [
        event
        for event in events
        if event["event_type"] == "graph_call_opened"
        and event["data"]["graph_function"] == "review_design_by_consensus"
    ]
    assert [event["data"]["edge"] for event in consensus_graph_calls] == list(EXPECTED_CONSENSUS_HARNESS_STEPS)

    consensus_asset_updates = [
        event
        for event in events
        if event["event_type"] == "asset_checkpoint_updated"
        and event["data"]["asset_id"] in EXPECTED_CONSENSUS_UPDATED_ASSETS
    ]
    assert [event["data"]["asset_id"] for event in consensus_asset_updates] == list(EXPECTED_CONSENSUS_UPDATED_ASSETS)
    assert all(event["data"]["current_checkpoint"]["exists"] is True for event in consensus_asset_updates)


def test_installed_self_test_command_drives_the_current_executive_program(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    payload = run_installed_self_test(workspace, archive=run_archive)

    assert payload["status"] == "ok"
    assert payload["program"]["name"] == "bootstrap_release_self_test"
    assert payload["completed_edges"] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert all(step["start"]["blocking_reason"] == "fp_dispatch" for step in payload["steps"])
    assert [step["assessed"]["status"] for step in payload["steps"]] == ["ok"] * len(payload["steps"])
    assert payload["steps"][-1]["edge"] == "prepare_release_surface"
    assert payload["steps"][-1]["assessed"]["status"] == "ok"
    assert payload["final_state"]["status"] == "iterated"
    assert payload["final_state"]["edge"] == "prepare_deployment_surface"
    assert payload["final_state"]["blocking_reason"] == "fp_dispatch"

    events = read_events(workspace)
    graph_call_events = [event for event in events if event["event_type"] == "graph_call_opened"]
    assert len(graph_call_events) >= len(payload["completed_edges"])
    graph_function_names = [event["data"]["graph_function"] for event in graph_call_events]
    assert graph_function_names[: len(payload["completed_edges"])] == [
        "bootstrap_release_self_test"
    ] * len(payload["completed_edges"])
    assert all(name == "release_operational_cycle" for name in graph_function_names[len(payload["completed_edges"]) :])
    assert "run_completed" in [event["event_type"] for event in events]
    assert asset_path(workspace, "test_run_archive_surface").exists()
    assert asset_path(workspace, "release_surface").exists()


def test_operational_cycle_projects_deployment_runtime_and_retrofit_surfaces(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    bootstrap_chain = complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="bootstrap")
    assert [step["start"]["edge"] for step in bootstrap_chain] == list(EXPECTED_BOOTSTRAP_STEPS)

    operational_chain = complete_bootstrap_chain(
        workspace,
        archive=run_archive,
        label_prefix="operational",
        steps=EXPECTED_OPERATIONAL_STEPS,
    )
    run_archive.capture_json("operational_chain.json", operational_chain)
    assert [step["start"]["edge"] for step in operational_chain] == list(EXPECTED_OPERATIONAL_STEPS)
    assert all(step["assessed"]["status"] == "ok" for step in operational_chain)

    deployment_text = asset_path(workspace, "deployment_surface").read_text(encoding="utf-8")
    runtime_text = asset_path(workspace, "runtime_observation_surface").read_text(encoding="utf-8")
    retrofit_text = asset_path(workspace, "retrofit_plan_surface").read_text(encoding="utf-8")
    assert "## Governed Deployment Record" in deployment_text
    assert "- tests carried into deployment record:" in deployment_text
    assert "## Returned Runtime Position" in runtime_text
    assert "- report files returned:" in runtime_text
    assert "## Retrofit Boundary" in retrofit_text
    assert "## Planned Next Actions" in retrofit_text

    events = read_events(workspace)
    operational_graph_calls = [
        event
        for event in events
        if event["event_type"] == "graph_call_opened"
        and event["data"]["edge"] in EXPECTED_OPERATIONAL_STEPS
    ]
    assert [event["data"]["graph_function"] for event in operational_graph_calls] == [
        "release_operational_cycle"
    ] * len(EXPECTED_OPERATIONAL_STEPS)
    operational_updates = [
        event
        for event in events
        if event["event_type"] == "asset_checkpoint_updated"
        and event["data"]["asset_id"] in EXPECTED_OPERATIONAL_UPDATED_ASSETS
    ]
    assert [event["data"]["asset_id"] for event in operational_updates] == list(EXPECTED_OPERATIONAL_UPDATED_ASSETS)


def test_canonical_sandbox_can_reset_runtime_state_and_rerun_cleanly(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    first_chain = complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="first")
    first_events = read_events(workspace)
    run_archive.capture_json("events.first_run.json", first_events)
    assert [step["start"]["edge"] for step in first_chain] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert [event["data"]["asset_id"] for event in first_events if event["event_type"] == "asset_checkpoint_updated"] == list(EXPECTED_UPDATED_ASSETS)

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
        run_installed_odd_sdlc(workspace, "gaps", archive=run_archive, label="odd_sdlc gaps second", timeout=120).stdout
    )
    assert second_gaps["converged"] is False

    second_chain = complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="second")
    second_events = read_events(workspace)
    run_archive.capture_json("events.second_run.json", second_events)
    assert [step["start"]["edge"] for step in second_chain] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert [
        event["data"]["asset_id"]
        for event in second_events
        if event["event_type"] == "asset_checkpoint_updated"
    ] == list(EXPECTED_UPDATED_ASSETS)
    second_event_types = [event["event_type"] for event in second_events]
    assert "genesis_installed" not in second_event_types
    assert second_event_types.count("run_bound") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("run_started") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("graph_call_opened") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("vector_started") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("fp_dispatched") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("asset_checkpoint_updated") == len(EXPECTED_BOOTSTRAP_STEPS)
    assessed_events = [event for event in second_events if event["event_type"] == "assessed"]
    assert len(assessed_events) == len(EXPECTED_BOOTSTRAP_STEPS) + 1
    assert [
        (
            event["data"].get("edge"),
            event["data"].get("evaluator"),
        )
        for event in assessed_events
        if event["data"].get("edge") == "derive_test_module_surface"
    ] == [
        ("derive_test_module_surface", "planned_test_traceability_present"),
        ("derive_test_module_surface", "test_module_surface_semantically_converged"),
    ]
    assert second_event_types.count("proof_passed") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("closure_passed") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("graph_call_closed") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("run_completed") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("edge_converged") == len(EXPECTED_BOOTSTRAP_STEPS) - 1
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
