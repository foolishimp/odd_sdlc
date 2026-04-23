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
import shutil
import textwrap

import pytest

from odd_sdlc.workspace_assets import asset_path
from odd_sdlc.release.install import install as install_release
from sandbox_runtime import (
    assert_installed_genesis_runtime,
    complete_bootstrap_chain,
    install_kernel_sandbox,
    read_events,
    reset_sandbox_runtime_state,
    run_constructor_for_start,
    run_installed_substrate,
    run_installed_odd_sdlc,
    run_installed_self_test,
    seed_canonical_spec_surface,
    seed_odd_sdlc_package,
)


pytestmark = pytest.mark.usecase_id("canonical_sandbox_repeatability")
APPS_ROOT = Path(__file__).resolve().parents[5]
ABI_TRANSPORT_PATH = (
    APPS_ROOT / "abiogenesis" / "build_tenants" / "abiogenesis" / "python" / "code" / "genesis" / "transport.py"
)


def _resolve_data_mapper_template() -> Path:
    local_projects_root = APPS_ROOT / "ai_sdlc_examples" / "local_projects"
    candidates = (
        local_projects_root / "data_mapper" / "data_mapper.template",
        local_projects_root / "data_mapper.template",
    )
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise FileNotFoundError(
        "unable to locate data_mapper.template under ai_sdlc_examples/local_projects"
    )


DATA_MAPPER_TEMPLATE = _resolve_data_mapper_template()

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
    "prepare_build_execution_surface",
    "derive_build_execution_result_surface",
    "prepare_test_execution_surface",
    "derive_test_execution_result_surface",
    "prepare_deployment_surface",
    "derive_deployment_result_surface",
    "derive_deployed_environment_surface",
    "derive_runtime_observation_surface",
    "derive_retrofit_plan_surface",
    "review_subject_consensus_round",
    "review_subject_by_consensus",
    "review_design_consensus_round",
    "review_design_by_consensus",
    "review_comment_consensus_round",
    "review_comment_by_consensus",
)

EXPECTED_GRAPH_FUNCTIONS = (
    "bootstrap_release_self_test",
    "release_operational_cycle",
    "review_subject_consensus_round",
    "review_subject_by_consensus",
    "review_design_consensus_round",
    "review_design_by_consensus",
    "review_comment_consensus_round",
    "review_comment_by_consensus",
    "derive_execution_contract_surface",
    "admit_execution_contract_surface",
)
EXPECTED_OPERATIONAL_STEPS = (
    "prepare_build_execution_surface",
    "derive_build_execution_result_surface",
    "prepare_test_execution_surface",
    "derive_test_execution_result_surface",
    "prepare_deployment_surface",
    "derive_deployment_result_surface",
    "derive_deployed_environment_surface",
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
ODD_SDLC_MODULE_REF = "odd_sdlc.gtl_module:MODULE"

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
    "build_execution_surface",
    "build_execution_result_surface",
    "test_execution_surface",
    "test_execution_result_surface",
    "deployment_surface",
    "deployment_result_surface",
    "deployed_environment_surface",
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
    assert_installed_genesis_runtime(workspace)
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


@pytest.mark.usecase_id("data_mapper_template_inherited_e2e")
def test_sandbox_forensic_public_start_stops_before_constructive_events_at_published_fh_gate(
    run_archive,
) -> None:
    workspace = run_archive.workspace
    shutil.copytree(DATA_MAPPER_TEMPLATE, workspace, dirs_exist_ok=True)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    run_archive.capture_json("install.forensic_gate.payload.json", payload)
    assert payload["status"] == "installed"

    refresh_payload = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "refresh-analysis",
            archive=run_archive,
            label="forensic_gate.refresh-analysis",
        ).stdout
    )
    run_archive.capture_json("forensic_gate.refresh-analysis.json", refresh_payload)
    assert refresh_payload["analysis_manifest"]["manifest_kind"] == "odd_sdlc.analysis_manifest"

    gaps_payload = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            archive=run_archive,
            label="forensic_gate.gaps",
        ).stdout
    )
    run_archive.capture_json("forensic_gate.gaps.json", gaps_payload)
    assert gaps_payload["dossiers"][0]["edge"] == "derive_intent_surface"
    assert gaps_payload["dossiers"][0]["constitutional_proposal"]["state"] == "pending_fh"
    assert gaps_payload["dossiers"][0]["route_binding"]["state"] == "await_fh_resolution"

    start_result = run_installed_odd_sdlc(
        workspace,
        "start",
        "--scope",
        "workspace",
        "--target",
        "next",
        "--until",
        "converged",
        archive=run_archive,
        label="forensic_gate.start",
        timeout=180,
        check=False,
    )
    run_archive.capture_text("forensic_gate.start.stdout.txt", start_result.stdout)
    run_archive.capture_text("forensic_gate.start.stderr.txt", start_result.stderr)
    assert start_result.returncode == 3
    start_payload = json.loads(start_result.stdout)
    run_archive.capture_json("forensic_gate.start.json", start_payload)
    assert start_payload["status"] == "pending"
    assert start_payload["blocking_reason"] == "fh_gate"
    assert start_payload["stopped_by"] == "fh_gate"
    assert start_payload["edge"] == "derive_intent_surface"
    assert start_payload["constitutional_proposal"]["state"] == "pending_fh"

    events = read_events(workspace)
    run_archive.capture_json("forensic_gate.events.json", events)
    event_types = [event["event_type"] for event in events]
    assert "constitutional_proposal_recorded" in event_types
    assert "fh_gate_pending" in event_types
    assert event_types.index("constitutional_proposal_recorded") < event_types.index("fh_gate_pending")
    assert "execution_contract_drafted" not in event_types
    assert "execution_contract_admitted" not in event_types
    assert "run_bound" not in event_types
    assert "run_started" not in event_types
    assert "graph_call_opened" not in event_types
    assert "vector_started" not in event_types
    assert "worker_turn_started" not in event_types
    assert "fp_dispatched" not in event_types
    assert "assessed" not in event_types
    assert "found" not in event_types
    assert "run_failed" not in event_types
    assert "run_yielded" not in event_types
    assert not any(
        event["event_type"] in {
            "approved",
            "revoked",
            "constitutional_proposal_approved_with_edits",
            "proposal_applied",
        }
        for event in events
    )


def test_sandbox_preparation_preserves_installer_owned_abg_runtime(run_archive) -> None:
    workspace = run_archive.workspace
    install_kernel_sandbox(workspace, archive=run_archive)
    transport_before = (workspace / ".genesis" / "genesis" / "transport.py").read_text(encoding="utf-8")
    seed_odd_sdlc_package(workspace)
    seed_canonical_spec_surface(workspace)
    transport_after = (workspace / ".genesis" / "genesis" / "transport.py").read_text(encoding="utf-8")
    source_transport = ABI_TRANSPORT_PATH.read_text(encoding="utf-8")

    assert transport_before == transport_after
    assert transport_after == source_transport


def _rewrite_project_contracts(
    workspace: Path,
    *,
    build_execution_contract: str,
    test_execution_contract: str,
    deployment_contract: str,
    runtime_observation_contract: str,
) -> None:
    path = workspace / ".ai-workspace" / "context" / "project_constraints.yml"
    original_lines = path.read_text(encoding="utf-8").splitlines()
    replacements = {
        "build_execution_contract": build_execution_contract,
        "test_execution_contract": test_execution_contract,
        "deployment_contract": deployment_contract,
        "runtime_observation_contract": runtime_observation_contract,
    }
    rewritten: list[str] = []
    for line in original_lines:
        stripped = line.strip()
        replaced = False
        for key, value in replacements.items():
            if stripped.startswith(f"{key}:"):
                indent = line[: len(line) - len(line.lstrip())]
                rewritten.append(f'{indent}{key}: "{value}"')
                replaced = True
                break
        if not replaced:
            rewritten.append(line)
    path.write_text("\n".join(rewritten) + "\n", encoding="utf-8")


def _seed_operational_dispatch_scripts(workspace: Path) -> None:
    ops_root = workspace / ".odd_sdlc_ops"
    ops_root.mkdir(parents=True, exist_ok=True)
    code_root_relative = asset_path(workspace, "code_surface").relative_to(workspace).as_posix()
    build_script = textwrap.dedent(
        """
        from pathlib import Path

        dist_root = Path("dist")
        target_root = Path("target")
        dist_root.mkdir(parents=True, exist_ok=True)
        target_root.mkdir(parents=True, exist_ok=True)
        (dist_root / "build.txt").write_text("build completed\\n", encoding="utf-8")
        (target_root / "build.txt").write_text("target completed\\n", encoding="utf-8")
        """
    ).strip()
    test_script = textwrap.dedent(
        f"""
        from pathlib import Path

        report_root = Path({code_root_relative!r}) / "test-reports"
        report_root.mkdir(parents=True, exist_ok=True)
        report_root.joinpath("junit-dispatch.xml").write_text(
        \"\"\"<testsuite name="dispatch" tests="2" failures="0" errors="0" skipped="0"></testsuite>\"\"\",
            encoding="utf-8",
        )
        """
    ).strip()
    deploy_script = textwrap.dedent(
        """
        from pathlib import Path

        deploy_root = Path("docs")
        deploy_root.mkdir(parents=True, exist_ok=True)
        deploy_root.joinpath("deployment-evidence.txt").write_text(
            "deployment completed\\n",
            encoding="utf-8",
        )
        """
    ).strip()
    observe_script = textwrap.dedent(
        """
        from pathlib import Path

        observe_root = Path("docs")
        observe_root.mkdir(parents=True, exist_ok=True)
        observe_root.joinpath("runtime-observation.txt").write_text(
            "runtime observation projected from deployment result\\n",
            encoding="utf-8",
        )
        """
    ).strip()
    (ops_root / "build.py").write_text(build_script + "\n", encoding="utf-8")
    (ops_root / "test.py").write_text(test_script + "\n", encoding="utf-8")
    (ops_root / "deploy.py").write_text(deploy_script + "\n", encoding="utf-8")
    (ops_root / "observe.py").write_text(observe_script + "\n", encoding="utf-8")


def test_canonical_sandbox_usecase_runs_from_installed_workspace(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    catalog = json.loads(
        run_installed_odd_sdlc(workspace, "catalog", archive=run_archive, label="odd_sdlc catalog").stdout
    )
    run_archive.capture_json("catalog.json", catalog)
    asset_ids = {asset["asset_id"] for asset in catalog["assets"]}
    assert len(asset_ids) == len(catalog["assets"]) == 33
    assert "ambiguity_register_surface" in asset_ids
    assert "requirement_closure_register_surface" in asset_ids
    assert "execution_contract_surface" in asset_ids
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
    assert catalog["graph_functions"][2]["plugin_kind"] == "shared_consensus_plugin"
    assert catalog["graph_functions"][2]["template_kind"] == "symbolic"
    assert catalog["graph_functions"][2]["vectors"] == []
    assert catalog["graph_functions"][3]["template_kind"] == "symbolic"
    assert catalog["graph_functions"][3]["vectors"] == []
    assert [vector["name"] for vector in catalog["graph_functions"][4]["vectors"]] == list(EXPECTED_CONSENSUS_STEPS)
    assert catalog["graph_functions"][5]["template_kind"] == "symbolic"
    assert catalog["graph_functions"][5]["vectors"] == []
    assert catalog["graph_functions"][6]["host_binding_kind"] == "comment_review"
    assert catalog["graph_functions"][7]["host_binding_kind"] == "comment_review"

    gaps = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            archive=run_archive,
            label="odd_sdlc gaps",
        ).stdout
    )
    run_archive.capture_json("gaps.json", gaps)
    assert gaps["converged"] is False
    assert gaps["summary"]["gap_count"] == 27

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
        "asset_ownership_index",
        "asset_types",
        "assets",
        "bindings",
        "collections",
        "edge_contracts",
        "execution_contract_surface",
        "functions",
        "gap_dossier",
        "graph_functions",
        "jobs",
        "operational_capabilities",
        "programs",
        "query_contract",
        "requirement_closure_register",
        "semantic_facets",
        "start_target_catalog",
        "work_act_types",
        "workspace_root",
    ]
    assert domain_query["query_contract"]["name"] == "odd_sdlc.query-domain"
    assert domain_query["query_contract"]["version"] == "v16"
    assert domain_query["query_contract"]["top_level_keys"] == [
        "query_contract",
        "workspace_root",
        "semantic_facets",
        "asset_types",
        "asset_families",
        "assets",
        "start_target_catalog",
        "asset_ownership_index",
        "operational_capabilities",
        "ambiguity_register",
        "requirement_closure_register",
        "collections",
        "functions",
        "edge_contracts",
        "execution_contract_surface",
        "programs",
        "work_act_types",
        "jobs",
        "graph_functions",
        "bindings",
        "gap_dossier",
    ]
    assert domain_query["query_contract"]["runtime_model"] == "abg-native"
    assert domain_query["query_contract"]["query_model"] == "odd-domain-plugin"
    assert domain_query["operational_capabilities"]["projection_kind"] == "odd_sdlc.operational_capabilities"
    assert "analysis_manifest" not in domain_query
    assert "analysis_manifest" in domain_query["gap_dossier"]
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
    assert [run["status"] for run in observed["runs"]] == ["not_started"] + (["completed"] * 18)
    assert [call["status"] for call in observed["graph_calls"]] == ["closed"] * 18
    assert observed["continuations"] == []
    recent_event_types = [event["event_type"] for event in observed["recent_events"]]
    assert "run_completed" in recent_event_types
    assert "edge_converged" in recent_event_types
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
            run_installed_substrate(
                workspace,
                "start",
                "--scope",
                "workspace",
                "--target",
                "next",
                "--until",
                "first_traversal",
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
            run_installed_substrate(
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
        run_installed_substrate(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            "--module",
            module_ref,
            archive=run_archive,
            label="consensus gaps",
        ).stdout
    )
    assert consensus_gaps["converged"] is True
    assert all(float(gap.get("delta") or 0.0) == 0.0 for gap in consensus_gaps["gaps"])
    assert all(not list(gap.get("failing", ())) for gap in consensus_gaps["gaps"])

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
            run_installed_substrate(
                workspace,
                "start",
                "--scope",
                "workspace",
                "--target",
                "next",
                "--until",
                "first_traversal",
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
            run_installed_substrate(
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
        run_installed_substrate(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            "--module",
            CONSENSUS_HARNESS_MODULE_REF,
            archive=run_archive,
            label="consensus harness gaps",
        ).stdout
    )
    assert consensus_gaps["converged"] is True
    assert consensus_gaps["jobs_considered"] == 0
    assert consensus_gaps["total_delta"] == 0.0
    assert consensus_gaps["open_frames"] == 0
    assert all(float(gap.get("delta") or 0.0) == 0.0 for gap in consensus_gaps["gaps"])
    assert all(not list(gap.get("failing", ())) for gap in consensus_gaps["gaps"])

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
    assert payload["already_converged"] is False
    assert payload["completed_edges"] == list(EXPECTED_BOOTSTRAP_STEPS)
    assert all(step["start"]["blocking_reason"] == "fp_dispatch" for step in payload["steps"])
    assert [step["assessed"]["status"] for step in payload["steps"]] == ["ok"] * len(payload["steps"])
    assert payload["steps"][-1]["edge"] == "prepare_release_surface"
    assert payload["steps"][-1]["assessed"]["status"] == "ok"
    assert payload["final_state"]["status"] == "program_boundary_complete"
    assert payload["final_state"]["edge"] == "prepare_release_surface"
    assert payload["final_state"]["next_edge"] == "prepare_build_execution_surface"
    assert payload["program_boundary_complete"] is True
    assert payload["follow_on_program"]["name"] == "release_operational_cycle"
    assert [entry["name"] for entry in payload["other_active_programs"]] == ["release_operational_cycle"]

    events = read_events(workspace)
    graph_call_events = [event for event in events if event["event_type"] == "graph_call_opened"]
    assert len(graph_call_events) == len(payload["completed_edges"])
    graph_function_names = [event["data"]["graph_function"] for event in graph_call_events]
    assert graph_function_names == [
        "bootstrap_release_self_test"
    ] * len(payload["completed_edges"])
    assert "run_completed" in [event["event_type"] for event in events]
    assert asset_path(workspace, "test_run_archive_surface").exists()
    assert asset_path(workspace, "release_surface").exists()


def test_installed_self_test_returns_clean_success_when_bootstrap_is_already_complete(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)
    complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="bootstrap_complete")

    payload = run_installed_self_test(
        workspace,
        archive=run_archive,
        label="odd_sdlc self-test already complete bootstrap",
    )

    assert payload["status"] == "ok"
    assert payload["program"]["name"] == "bootstrap_release_self_test"
    assert payload["already_converged"] is True
    assert payload["completed_edges"] == []
    assert payload["steps"] == []
    assert payload["final_state"]["status"] == "program_boundary_complete"
    assert payload["final_state"]["edge"] == "prepare_release_surface"
    assert payload["final_state"]["next_edge"] == "prepare_build_execution_surface"
    assert payload["program_boundary_complete"] is True
    assert payload["follow_on_program"]["name"] == "release_operational_cycle"
    assert [entry["name"] for entry in payload["other_active_programs"]] == ["release_operational_cycle"]


def test_installed_self_test_resumes_bootstrap_from_the_current_active_edge(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)
    complete_bootstrap_chain(
        workspace,
        archive=run_archive,
        label_prefix="bootstrap_partial",
        steps=EXPECTED_BOOTSTRAP_STEPS[:3],
    )

    payload = run_installed_self_test(
        workspace,
        archive=run_archive,
        label="odd_sdlc self-test resumed bootstrap",
    )

    assert payload["status"] == "ok"
    assert payload["program"]["name"] == "bootstrap_release_self_test"
    assert payload["already_converged"] is False
    assert payload["completed_edges"] == list(EXPECTED_BOOTSTRAP_STEPS[3:])
    assert payload["steps"][0]["edge"] == "derive_requirement_surface"
    assert payload["final_state"]["status"] == "program_boundary_complete"
    assert payload["final_state"]["edge"] == "prepare_release_surface"
    assert payload["final_state"]["next_edge"] == "prepare_build_execution_surface"
    assert payload["program_boundary_complete"] is True
    assert payload["follow_on_program"]["name"] == "release_operational_cycle"


def test_installed_self_test_reports_clean_pending_dispatch_when_bootstrap_edge_is_already_in_flight(
    run_archive,
) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)
    complete_bootstrap_chain(
        workspace,
        archive=run_archive,
        label_prefix="bootstrap_partial",
        steps=EXPECTED_BOOTSTRAP_STEPS[:3],
    )

    pending_start = json.loads(
        run_installed_substrate(
            workspace,
            "start",
            "--scope",
            "workspace",
            "--target",
            "next",
            "--until",
            "first_traversal",
            "--module",
            ODD_SDLC_MODULE_REF,
            archive=run_archive,
            label="bootstrap pending start",
        ).stdout
    )
    assert pending_start["status"] == "iterated"
    assert pending_start["edge"] == "derive_requirement_surface"
    assert pending_start["blocking_reason"] == "fp_dispatch"

    payload = run_installed_self_test(
        workspace,
        archive=run_archive,
        label="odd_sdlc self-test pending bootstrap dispatch",
    )

    assert payload["status"] == "ok"
    assert payload["program"]["name"] == "bootstrap_release_self_test"
    assert payload["already_converged"] is False
    assert payload["blocked_by_pending_dispatch"] is True
    assert payload["completed_edges"] == []
    assert payload["steps"] == []
    assert payload["final_state"]["status"] == "pending"
    assert payload["final_state"]["edge"] == "derive_requirement_surface"
    assert payload["final_state"]["blocking_reason"] == "fp_dispatch"


def test_installed_self_test_returns_clean_success_when_workspace_is_fully_converged(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)
    complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="bootstrap_complete")
    complete_bootstrap_chain(
        workspace,
        archive=run_archive,
        label_prefix="operational_complete",
        steps=EXPECTED_OPERATIONAL_STEPS,
    )

    payload = run_installed_self_test(
        workspace,
        archive=run_archive,
        label="odd_sdlc self-test fully converged",
    )

    assert payload["status"] == "ok"
    assert payload["program"]["name"] == "bootstrap_release_self_test"
    assert payload["already_converged"] is True
    assert payload["completed_edges"] == []
    assert payload["steps"] == []
    assert payload["final_state"]["status"] == "converged"
    assert payload["follow_on_program"] is None


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
    assert "## Operational Transition Command" in deployment_text
    assert "- target_result_surface: `deployment_result_surface`" in deployment_text
    assert "## Admitted Runtime Observation" in runtime_text
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


def test_dispatch_operational_runs_declared_local_bindings_end_to_end(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)
    _seed_operational_dispatch_scripts(workspace)
    _rewrite_project_contracts(
        workspace,
        build_execution_contract="python .odd_sdlc_ops/build.py",
        test_execution_contract="python .odd_sdlc_ops/test.py",
        deployment_contract="python .odd_sdlc_ops/deploy.py",
        runtime_observation_contract="python .odd_sdlc_ops/observe.py",
    )
    refresh_payload = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "refresh-analysis",
            archive=run_archive,
            label="odd_sdlc refresh-analysis operational dispatch",
        ).stdout
    )
    run_archive.capture_json("refresh-analysis.operational_dispatch.json", refresh_payload)

    bootstrap_chain = complete_bootstrap_chain(workspace, archive=run_archive, label_prefix="dispatch_bootstrap")
    assert [step["start"]["edge"] for step in bootstrap_chain] == list(EXPECTED_BOOTSTRAP_STEPS)

    dispatch_labels = (
        "prepare-build",
        "dispatch-build",
        "prepare-test",
        "dispatch-test",
        "prepare-deploy",
        "dispatch-deploy",
        "project-deployed-environment",
        "project-runtime-observation",
        "project-retrofit-plan",
    )
    dispatch_results: list[dict[str, object]] = []
    for label in dispatch_labels:
        payload = json.loads(
            run_installed_odd_sdlc(
                workspace,
                "dispatch-operational",
                archive=run_archive,
                label=f"odd_sdlc dispatch-operational {label}",
                timeout=120,
            ).stdout
        )
        dispatch_results.append(payload)
        run_archive.capture_json(f"dispatch-operational.{label}.json", payload)

    (
        prepare_build,
        dispatch_build,
        prepare_test,
        dispatch_test,
        prepare_deploy,
        dispatch_deploy,
        project_deployed_environment,
        project_runtime_observation,
        project_retrofit_plan,
    ) = dispatch_results

    dispatch_register = json.loads(
        (workspace / ".ai-workspace" / "runtime" / "odd_sdlc-operational-dispatch.json").read_text(encoding="utf-8")
    )
    run_archive.capture_json("operational-dispatch-register.json", dispatch_register)

    assert prepare_build["status"] == "ok"
    assert [step["edge"] for step in prepare_build["completed_steps"]] == ["prepare_build_execution_surface"]
    assert prepare_build["final_state"]["edge"] == "derive_build_execution_result_surface"

    assert dispatch_build["status"] == "ok"
    assert [step["kind"] for step in dispatch_build["completed_steps"]] == ["dispatch"]
    assert dispatch_build["completed_steps"][-1]["dispatch"]["lane"] == "build"
    assert dispatch_build["final_state"]["edge"] == "prepare_test_execution_surface"

    assert prepare_test["status"] == "ok"
    assert [step["edge"] for step in prepare_test["completed_steps"]] == ["prepare_test_execution_surface"]
    assert prepare_test["final_state"]["edge"] == "derive_test_execution_result_surface"

    assert dispatch_test["status"] == "ok"
    assert [step["kind"] for step in dispatch_test["completed_steps"]] == ["dispatch"]
    assert dispatch_test["completed_steps"][-1]["dispatch"]["lane"] == "test"
    assert dispatch_test["final_state"]["edge"] == "prepare_deployment_surface"

    assert prepare_deploy["status"] == "ok"
    assert [step["edge"] for step in prepare_deploy["completed_steps"]] == ["prepare_deployment_surface"]
    assert prepare_deploy["final_state"]["edge"] == "derive_deployment_result_surface"

    assert dispatch_deploy["status"] == "ok"
    assert [step["kind"] for step in dispatch_deploy["completed_steps"]] == ["dispatch"]
    assert dispatch_deploy["completed_steps"][-1]["dispatch"]["lane"] == "deployment"
    assert dispatch_deploy["final_state"]["edge"] == "derive_deployed_environment_surface"

    assert project_deployed_environment["status"] == "ok"
    assert [step["edge"] for step in project_deployed_environment["completed_steps"]] == [
        "derive_deployed_environment_surface"
    ]
    assert project_deployed_environment["final_state"]["edge"] == "derive_runtime_observation_surface"

    assert project_runtime_observation["status"] == "ok"
    assert [step["edge"] for step in project_runtime_observation["completed_steps"]] == [
        "derive_runtime_observation_surface"
    ]
    assert project_runtime_observation["final_state"]["edge"] == "derive_retrofit_plan_surface"

    assert project_retrofit_plan["status"] == "ok"
    assert [step["edge"] for step in project_retrofit_plan["completed_steps"]] == [
        "derive_retrofit_plan_surface"
    ]
    assert project_retrofit_plan["final_state"]["status"] == "converged"
    assert project_retrofit_plan["gap_dossier"]["converged"] is True

    assert dispatch_register["lanes"]["build"]["status"] == "succeeded"
    assert dispatch_register["lanes"]["test"]["status"] == "succeeded"
    assert dispatch_register["lanes"]["deployment"]["status"] == "succeeded"

    build_text = asset_path(workspace, "build_execution_surface").read_text(encoding="utf-8")
    build_result_text = asset_path(workspace, "build_execution_result_surface").read_text(encoding="utf-8")
    test_result_text = asset_path(workspace, "test_execution_result_surface").read_text(encoding="utf-8")
    deployment_result_text = asset_path(workspace, "deployment_result_surface").read_text(encoding="utf-8")
    deployed_environment_text = asset_path(workspace, "deployed_environment_surface").read_text(encoding="utf-8")
    runtime_text = asset_path(workspace, "runtime_observation_surface").read_text(encoding="utf-8")
    retrofit_text = asset_path(workspace, "retrofit_plan_surface").read_text(encoding="utf-8")

    assert "- substrate_binding: `local_python_command`" in build_text
    assert "- status: result_admitted" in build_result_text
    assert "- dispatch_exit_code: 0" in build_result_text
    assert "- parsed reports: 1" in test_result_text
    assert "- tests observed: 2" in test_result_text
    assert "- status: result_admitted" in deployment_result_text
    assert "- status: deployment_result_admitted" in deployed_environment_text
    assert "- status: result_admitted" in runtime_text
    assert "- completion_state: deployment_result_recorded" in runtime_text
    assert "## Planned Next Actions" in retrofit_text


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
        run_installed_odd_sdlc(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            archive=run_archive,
            label="odd_sdlc gaps second",
            timeout=120,
        ).stdout
    )
    assert second_gaps["converged"] is False
    second_refresh = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "refresh-analysis",
            archive=run_archive,
            label="odd_sdlc refresh-analysis second",
        ).stdout
    )
    run_archive.capture_json("refresh-analysis.second.json", second_refresh)

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
    assert list(dict.fromkeys(event["data"].get("edge") for event in assessed_events)) == list(EXPECTED_BOOTSTRAP_STEPS)
    assert all(event["data"].get("kind") == "fp" for event in assessed_events)
    assert [
        (
            event["data"].get("edge"),
            event["data"].get("obligation_id"),
        )
        for event in assessed_events
        if event["data"].get("edge") == "derive_test_module_surface"
    ] == [
        ("derive_test_module_surface", "REQ-ODD-BOOT-001"),
        ("derive_test_module_surface", "REQ-ODD-BOOT-002"),
        ("derive_test_module_surface", "REQ-ODD-BOOT-003"),
        ("derive_test_module_surface", "REQ-ODD-BOOT-004"),
    ]
    assert second_event_types.count("proof_passed") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("closure_passed") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("graph_call_closed") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("run_completed") == len(EXPECTED_BOOTSTRAP_STEPS)
    assert second_event_types.count("edge_converged") == len(EXPECTED_BOOTSTRAP_STEPS)
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
