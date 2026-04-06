# Validates: REQ-F-ASSETMODEL-001
# Validates: REQ-F-ASSETMODEL-002
# Validates: REQ-F-ASSETMODEL-003
# Validates: REQ-F-ASSETMODEL-004
# Validates: REQ-F-ASSETMODEL-005
# Validates: REQ-F-ODDSDLC-001
# Validates: REQ-F-ODDSDLC-002
# Validates: REQ-F-ODDSDLC-003
# Validates: REQ-F-ODDSDLC-004
# Validates: REQ-F-ODDSDLC-006
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[5]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))

from odd_sdlc.app import bootstrap, catalog, initialize  # noqa: E402
from odd_sdlc.gtl_module import (  # noqa: E402
    BOOTSTRAP_RELEASE_SELF_TEST_INTENT,
    BOOTSTRAP_RELEASE_SELF_TEST_STEPS,
    module as odd_sdlc_module,
)
from odd_sdlc.self_test import self_test  # noqa: E402
from genesis.binding import module_to_executable_jobs  # noqa: E402


def _seed_workspace(path: Path) -> None:
    (path / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (path / "specification" / "INTENT.md").write_text("# Intent\n", encoding="utf-8")
    (path / "specification" / "PRODUCT.md").write_text("# Product\n", encoding="utf-8")
    (path / "specification" / "GOALS.md").write_text("# Goals\n", encoding="utf-8")
    (path / "specification" / "requirements" / "10-bootstrap.md").write_text(
        "# Bootstrap Requirements\n",
        encoding="utf-8",
    )


def _read_events(workspace_root: Path) -> list[dict]:
    events_path = workspace_root / ".ai-workspace" / "events" / "events.jsonl"
    return [
        json.loads(line)
        for line in events_path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def test_module_publishes_first_asset_function_catalog() -> None:
    module = odd_sdlc_module()
    graph_function_names = [graph_function.name for graph_function in module.graph_functions]
    assert graph_function_names == ["bootstrap_release_self_test"]
    input_signatures = {
        graph_function.name: [node.name for node in graph_function.inputs]
        for graph_function in module.graph_functions
    }
    assert input_signatures == {
        "bootstrap_release_self_test": ["input_set"],
    }
    executive = module.graph_functions[0]
    assert executive.declarations.get("function_kind") == "odd_executive_graph_function"
    assert executive.declarations.get("intent") == BOOTSTRAP_RELEASE_SELF_TEST_INTENT
    assert [node.name for node in executive.inputs] == ["input_set"]
    assert [node.name for node in executive.outputs] == ["release_surface"]
    assert [node.name for node in executive.environment.requires] == ["input_set"]
    assert [node.name for node in executive.environment.provides] == [
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
    ]
    assert [node.name for node in executive.environment.carries] == [
        "input_set",
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
    ]
    assert [vector.name for vector in executive.materialize().vectors] == list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS)
    assert [job.name for job in module.jobs] == ["bootstrap_release_self_test_job"]

    executable_jobs = module_to_executable_jobs(module)
    assert len(executable_jobs) == 18
    assert [job.vector.name for job in executable_jobs] == list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS)
    assert {job.job.name for job in executable_jobs} == {"bootstrap_release_self_test_job"}
    assert {job.graph_function.name for job in executable_jobs} == {"bootstrap_release_self_test"}


def test_catalog_reports_uri_assets_and_bindings(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))
    result = catalog(app)

    semantic_facets = {facet["name"] for facet in result["semantic_facets"]}
    assert {
        "structured_document",
        "spec_surface",
        "verification_surface",
        "authority_surface",
        "argument_surface",
        "singleton_surface",
        "collection_surface",
        "generated_surface",
        "source_surface",
    } <= semantic_facets

    asset_types = {asset_type["name"]: asset_type for asset_type in result["asset_types"]}
    assert asset_types["singleton_spec_document"]["library_level"] == "generic"
    assert asset_types["requirement_collection_surface"]["library_level"] == "generic"
    assert asset_types["derived_structure_surface"]["library_level"] == "generic"
    assert asset_types["verification_collection_surface"]["library_level"] == "generic"
    assert asset_types["design_document_surface"]["library_level"] == "generic"
    assert asset_types["authority_document_surface"]["library_level"] == "generic"
    assert asset_types["scenario_collection_surface"]["library_level"] == "generic"
    assert asset_types["release_document_surface"]["library_level"] == "generic"
    assert asset_types["stack_profile_surface"]["library_level"] == "generic"
    assert asset_types["module_structure_surface"]["library_level"] == "generic"
    assert asset_types["archive_evidence_surface"]["library_level"] == "generic"
    assert asset_types["source_code_surface"]["library_level"] == "generic"
    assert asset_types["intent_doc"]["semantic_facets"] == [
        "structured_document",
        "spec_surface",
        "argument_surface",
        "singleton_surface",
        "generated_surface",
    ]
    assert asset_types["intent_doc"]["specializes"] == ["singleton_spec_document"]
    assert asset_types["intent_doc"]["library_level"] == "specialized"
    assert asset_types["requirement_surface"]["specializes"] == ["requirement_collection_surface"]
    assert asset_types["feature_decomp_surface"]["specializes"] == ["derived_structure_surface"]
    assert asset_types["uat_testcases_surface"]["specializes"] == ["verification_collection_surface"]
    assert asset_types["design_surface"]["specializes"] == ["design_document_surface"]
    assert asset_types["testcase_authority_surface"]["specializes"] == ["authority_document_surface"]
    assert asset_types["scenario_surface"]["specializes"] == ["scenario_collection_surface"]
    assert asset_types["release_surface"]["specializes"] == ["release_document_surface"]
    assert asset_types["implementation_design_surface"]["specializes"] == ["design_document_surface"]
    assert asset_types["implementation_stack_profile"]["specializes"] == ["stack_profile_surface"]
    assert asset_types["implementation_module_surface"]["specializes"] == ["module_structure_surface"]
    assert asset_types["code_surface"]["specializes"] == ["source_code_surface"]
    assert asset_types["test_design_surface"]["specializes"] == ["design_document_surface"]
    assert asset_types["test_stack_profile"]["specializes"] == ["stack_profile_surface"]
    assert asset_types["test_module_surface"]["specializes"] == ["module_structure_surface"]
    assert asset_types["test_run_archive_surface"]["specializes"] == ["archive_evidence_surface"]
    assert asset_types["proof_surface"]["mutable_default"] is False

    asset_uris = {asset["uri"] for asset in result["assets"]}
    assert "file://specification/INTENT.md" in asset_uris
    assert "file://specification/PRODUCT.md" in asset_uris
    assert "file://specification/GOALS.md" in asset_uris
    assert "file://specification/requirements" in asset_uris
    assert "file://build_tenants/common/design/20-generated-feature-decomp.md" in asset_uris
    assert "file://specification/scenarios/20-generated-uat-testcases.md" in asset_uris
    assert "file://build_tenants/common/design/30-generated-odd-design.md" in asset_uris
    assert "file://specification/scenarios/30-generated-testcase-authority.md" in asset_uris
    assert "file://specification/scenarios/40-generated-scenarios.md" in asset_uris
    assert "file://build_tenants/odd_method/python/design/40-generated-implementation-design.md" in asset_uris
    assert "file://build_tenants/odd_method/python/design/40-generated-implementation-stack.md" in asset_uris
    assert "file://build_tenants/odd_method/python/design/40-generated-implementation-modules.md" in asset_uris
    assert "file://build_tenants/odd_method/python/code/odd_generated_impl" in asset_uris
    assert "file://build_tenants/odd_sdlc/python/design/40-generated-test-design.md" in asset_uris
    assert "file://build_tenants/odd_sdlc/python/test_env/40-generated-test-stack.md" in asset_uris
    assert "file://build_tenants/odd_sdlc/python/test_env/tests/40-generated-test-modules.md" in asset_uris
    assert "file://build_tenants/odd_sdlc/python/test_env/50-generated-run-archive.md" in asset_uris
    assert "file://docs/40-generated-release.md" in asset_uris

    intent_asset = next(asset for asset in result["assets"] if asset["asset_id"] == "intent_surface")
    assert intent_asset["provenance"] == {
        "model": "projected_checkpoint",
        "source": "workspace_materialized_state",
        "mutable": True,
        "history_basis": "runtime_and_constructive_event_history",
    }
    assert intent_asset["checkpoint"]["exists"] is True
    assert intent_asset["checkpoint"]["path_kind"] == "file"
    assert intent_asset["checkpoint"]["content_digest"]
    assert intent_asset["checkpoint"]["bytes"] is not None
    feature_asset = next(asset for asset in result["assets"] if asset["asset_id"] == "feature_decomp_surface")
    assert feature_asset["checkpoint"]["exists"] is False

    bindings = {binding["node"]: tuple(binding["asset_ids"]) for binding in result["bindings"]}
    assert bindings["input_set"] == ("intent_surface", "product_surface", "goal_surface")
    assert bindings["intent_surface"] == ("intent_surface",)
    assert bindings["product_surface"] == ("product_surface",)
    assert bindings["goal_surface"] == ("goal_surface",)
    assert bindings["requirement_surface"] == ("requirement_surface",)
    assert bindings["feature_decomp_surface"] == ("feature_decomp_surface",)
    assert bindings["uat_testcases_surface"] == ("uat_testcases_surface",)
    assert bindings["design_surface"] == ("design_surface",)
    assert bindings["testcase_authority_surface"] == ("testcase_authority_surface",)
    assert bindings["scenario_surface"] == ("scenario_surface",)
    assert bindings["implementation_design_surface"] == ("implementation_design_surface",)
    assert bindings["implementation_stack_profile"] == ("implementation_stack_profile",)
    assert bindings["implementation_module_surface"] == ("implementation_module_surface",)
    assert bindings["code_surface"] == ("code_surface",)
    assert bindings["test_design_surface"] == ("test_design_surface",)
    assert bindings["test_stack_profile"] == ("test_stack_profile",)
    assert bindings["test_module_surface"] == ("test_module_surface",)
    assert bindings["test_run_archive_surface"] == ("test_run_archive_surface",)
    assert bindings["release_surface"] == ("release_surface",)
    assert [entry["name"] for entry in result["graph_functions"]] == ["bootstrap_release_self_test"]
    executive = result["graph_functions"][0]
    assert executive["intent"] == BOOTSTRAP_RELEASE_SELF_TEST_INTENT
    assert executive["function_kind"] == "odd_executive_graph_function"
    assert executive["inputs"] == ["input_set"]
    assert executive["outputs"] == ["release_surface"]
    assert executive["environment"] == {
        "requires": ["input_set"],
        "provides": [
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
        ],
        "carries": [
            "input_set",
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
        ],
    }
    assert [vector["name"] for vector in executive["vectors"]] == list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS)
    assert executive["job_names"] == ["bootstrap_release_self_test_job"]
    assert result["programs"] == [
        {
            "name": "bootstrap_release_self_test",
            "intent": BOOTSTRAP_RELEASE_SELF_TEST_INTENT,
            "steps": list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS),
            "outputs": ["release_surface"],
            "kind": "executive_program",
        }
    ]


def test_observe_exposes_ui_steel_thread_payload(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join((str(GENESIS_PATH), str(CODE_PATH))),
    }
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "observe",
            "--workspace",
            str(tmp_path),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        check=True,
    )

    payload = json.loads(result.stdout)
    assert sorted(payload.keys()) == [
        "asset_types",
        "assets",
        "bindings",
        "continuations",
        "functions",
        "gaps",
        "graph_calls",
        "graph_functions",
        "jobs",
        "query_contract",
        "recent_events",
        "runs",
        "semantic_facets",
        "workspace_root",
    ]
    assert len(payload["assets"]) == 18
    assert len(payload["functions"]) == 18
    assert payload["gaps"]["converged"] is False
    assert payload["runs"] == []
    assert payload["graph_calls"] == []
    assert payload["continuations"] == []
    assert payload["recent_events"] == []
    assert [entry["name"] for entry in payload["graph_functions"]] == ["bootstrap_release_self_test"]
    assert all(asset["projection_source"] == "workspace_scan" for asset in payload["assets"])


def test_query_domain_exposes_domain_views_without_runtime_duplication(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join((str(GENESIS_PATH), str(CODE_PATH))),
    }
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "query-domain",
            "--workspace",
            str(tmp_path),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        check=True,
    )

    payload = json.loads(result.stdout)
    assert sorted(payload.keys()) == [
        "asset_types",
        "assets",
        "bindings",
        "functions",
        "gaps",
        "graph_functions",
        "jobs",
        "query_contract",
        "semantic_facets",
        "workspace_root",
    ]
    assert payload["query_contract"] == {
        "name": "odd_sdlc.query-domain",
        "version": "v3",
        "top_level_keys": [
            "query_contract",
            "workspace_root",
            "semantic_facets",
            "asset_types",
            "assets",
            "functions",
            "jobs",
            "graph_functions",
            "bindings",
            "gaps",
        ],
        "runtime_model": "abg-native",
        "query_model": "odd-domain-plugin",
    }
    assert "runs" not in payload
    assert "graph_calls" not in payload
    assert "continuations" not in payload
    assert len(payload["assets"]) == 18
    assert len(payload["functions"]) == 18
    assert payload["gaps"]["converged"] is False
    functions = {entry["name"]: entry for entry in payload["functions"]}
    assert functions["derive_product_surface"]["inputs"] == ["input_set", "intent_surface"]
    assert functions["derive_goal_surface"]["inputs"] == [
        "input_set",
        "intent_surface",
        "product_surface",
    ]
    assert functions["derive_feature_decomp_surface"]["inputs"] == ["requirement_surface"]
    assert functions["derive_uat_testcases_surface"]["inputs"] == ["requirement_surface"]
    assert functions["derive_design_surface"]["inputs"] == ["requirement_surface", "feature_decomp_surface"]
    assert functions["derive_scenario_surface"]["inputs"] == ["requirement_surface", "design_surface"]
    assert functions["derive_implementation_design_surface"]["inputs"] == ["design_surface", "scenario_surface"]
    assert functions["select_implementation_stack_profile"]["inputs"] == ["implementation_design_surface"]
    assert functions["derive_implementation_module_surface"]["inputs"] == [
        "implementation_design_surface",
        "implementation_stack_profile",
    ]
    assert functions["derive_code_surface"]["inputs"] == [
        "implementation_module_surface",
        "implementation_stack_profile",
    ]
    assert functions["derive_test_design_surface"]["inputs"] == ["design_surface", "scenario_surface"]
    assert functions["select_test_stack_profile"]["inputs"] == ["test_design_surface"]
    assert functions["derive_test_module_surface"]["inputs"] == ["test_design_surface", "test_stack_profile"]
    assert functions["derive_test_run_archive_surface"]["inputs"] == ["test_module_surface", "test_stack_profile"]
    assert functions["qualify_testcase_authority"]["inputs"] == ["uat_testcases_surface", "scenario_surface"]
    assert functions["prepare_release_surface"]["inputs"] == [
        "requirement_surface",
        "design_surface",
        "scenario_surface",
        "code_surface",
        "testcase_authority_surface",
        "test_run_archive_surface",
    ]
    assert [entry["name"] for entry in payload["graph_functions"]] == ["bootstrap_release_self_test"]
    assert payload["graph_functions"][0]["job_names"] == ["bootstrap_release_self_test_job"]
    assert [vector["name"] for vector in payload["graph_functions"][0]["vectors"]] == list(
        BOOTSTRAP_RELEASE_SELF_TEST_STEPS
    )


def test_start_runs_through_declared_entry_and_emits_abg_facts(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join((str(GENESIS_PATH), str(CODE_PATH))),
    }
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "start",
            "--workspace",
            str(tmp_path),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        check=True,
    )

    payload = json.loads(result.stdout)
    assert payload["status"] == "iterated"
    assert payload["edge"] == "derive_intent_surface"
    assert "run_id" in payload
    assert "call_id" in payload

    events = _read_events(tmp_path)
    event_types = [event["event_type"] for event in events]
    assert "graph_call_opened" in event_types
    assert "vector_started" in event_types
    assert "fp_dispatched" in event_types

    graph_call_event = next(event for event in events if event["event_type"] == "graph_call_opened")
    assert graph_call_event["aggregate_type"] == "graph_call"
    assert graph_call_event["aggregate_id"] == payload["call_id"]


def test_self_test_executes_the_current_executive_program(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    result = self_test(app)

    assert result["status"] == "ok"
    assert result["program"]["name"] == "bootstrap_release_self_test"
    assert result["completed_edges"] == list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS)
    assert all(step["start"]["blocking_reason"] == "fp_dispatch" for step in result["steps"])
    assert all(step["assessed"]["status"] == "ok" for step in result["steps"])
    assert result["final_state"]["status"] == "converged"

    events = _read_events(tmp_path)
    assert [event["event_type"] for event in events if event["event_type"] == "run_completed"] == ["run_completed"] * 18
    assert (tmp_path / "docs" / "40-generated-release.md").exists()
