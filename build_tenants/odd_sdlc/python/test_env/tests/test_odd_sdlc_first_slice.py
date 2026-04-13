# Validates: REQ-F-ASSETMODEL-001
# Validates: REQ-F-ASSETMODEL-002
# Validates: REQ-F-ASSETMODEL-003
# Validates: REQ-F-ASSETMODEL-004
# Validates: REQ-F-ASSETMODEL-005
# Validates: REQ-F-ODDSDLC-001
# Validates: REQ-F-ODDSDLC-002
# Validates: REQ-F-ODDSDLC-003
# Validates: REQ-F-ODDSDLC-004
# Validates: REQ-F-ODDSDLC-020
# Validates: REQ-F-ODDSDLC-006
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest


ROOT = Path(__file__).resolve().parents[5]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

GRAPH_FUNCTION_NAMES = [
    "bootstrap_release_self_test",
    "release_operational_cycle",
    "review_design_consensus_round",
    "review_design_by_consensus",
]

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))

import odd_sdlc.app as app_module  # noqa: E402
from odd_sdlc.analysis import refresh_analysis, workspace_state_ready  # noqa: E402
from odd_sdlc.app import bootstrap, catalog, initialize, start  # noqa: E402
from odd_sdlc.gtl_module import (  # noqa: E402
    BOOTSTRAP_RELEASE_SELF_TEST_INTENT,
    BOOTSTRAP_RELEASE_SELF_TEST_STEPS,
    RELEASE_OPERATIONAL_CYCLE_INTENT,
    RELEASE_OPERATIONAL_CYCLE_STEPS,
    module as odd_sdlc_module,
)
import odd_sdlc.self_test as self_test_module  # noqa: E402
from odd_sdlc.project_profile import load_project_profile  # noqa: E402
from odd_sdlc.query import query_domain  # noqa: E402
from odd_sdlc.runtime_contexts import (  # noqa: E402
    REALIZATION_DEEPENING_CONTEXT_PATH,
    REALIZED_TEST_SOURCE_CONTEXT_PATH,
    STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH,
)
from odd_sdlc.self_test import self_test  # noqa: E402
from odd_sdlc.traceability import (  # noqa: E402
    REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH,
    load_or_build_requirement_closure_register,
)
from odd_sdlc.workspace_assets import (  # noqa: E402
    ASSET_PATHS,
    CODE_SURFACE_PREFIXES,
    assess_generated_asset_contract,
    asset_marker,
    asset_marker_path,
    asset_materialization_path,
    asset_path,
    resolved_asset_relative_path,
)
from genesis.binding import ContextResolver, _assemble_prompt, module_to_executable_jobs  # noqa: E402


def _seed_workspace(path: Path) -> None:
    (path / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (path / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (path / "specification" / "INTENT.md").write_text("# Intent\n", encoding="utf-8")
    (path / "specification" / "PRODUCT.md").write_text("# Product\n", encoding="utf-8")
    (path / "specification" / "GOALS.md").write_text("# Goals\n", encoding="utf-8")
    (path / "specification" / "requirements" / "10-bootstrap.md").write_text(
        "# Bootstrap Requirements\n",
        encoding="utf-8",
    )
    (path / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "# Project Constraints — first-slice test",
                "",
                "project:",
                '  name: "first-slice-test"',
                '  kind: "software-project"',
                '  language: "Python"',
                '  test_runner: "pytest"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "python_default"',
                '      output_dir: ""',
                '      description: "First-slice proving layout"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: "docs/deployment-contract.md"',
                '      runtime_observation_contract: "docs/runtime-observation-contract.md"',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )


def _read_events(workspace_root: Path) -> list[dict]:
    events_path = workspace_root / ".ai-workspace" / "events" / "events.jsonl"
    return [
        json.loads(line)
        for line in events_path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def test_workspace_assets_define_single_active_path_surface(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    tenant_name = load_project_profile(tmp_path).tenant_name
    assert asset_path(tmp_path, "intent_surface") == tmp_path / "specification" / "INTENT.md"
    assert asset_path(tmp_path, "requirement_surface") == tmp_path / "specification" / "requirements"
    assert asset_path(tmp_path, "ambiguity_register_surface") == (
        tmp_path / ".ai-workspace" / "runtime" / "odd_sdlc-ambiguity-register.json"
    )
    assert asset_path(tmp_path, "requirement_closure_register_surface") == (
        tmp_path / ".ai-workspace" / "runtime" / "odd_sdlc-requirement-closure.json"
    )
    assert asset_path(tmp_path, "code_surface") == tmp_path / "build_tenants" / "odd_sdlc" / "python" / "code" / "odd_sdlc_proving_impl"
    assert asset_path(tmp_path, "release_surface") == tmp_path / "docs" / "40-generated-release.md"
    assert asset_path(tmp_path, "deployment_surface") == tmp_path / "docs" / "50-generated-deployment.md"
    assert asset_path(tmp_path, "runtime_observation_surface") == tmp_path / "docs" / "60-generated-runtime-observation.md"
    assert asset_path(tmp_path, "retrofit_plan_surface") == (
        tmp_path / "build_tenants" / tenant_name / "design" / "60-generated-retrofit-plan.md"
    )
    assert asset_materialization_path(tmp_path, "requirement_surface") == (
        tmp_path / "specification" / "requirements" / "10-generated-bootstrap.md"
    )
    assert asset_marker_path(tmp_path, "code_surface") == (
        tmp_path / "build_tenants" / "odd_sdlc" / "python" / "code" / "odd_sdlc_proving_impl" / "__init__.py"
    )


def test_generated_asset_contract_assessment_for_file_surface(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    intent_path = asset_path(tmp_path, "intent_surface")
    intent_path.write_text(
        "\n".join(
            (
                "# Intent",
                "",
                asset_marker("intent_surface"),
                "",
                "Generated file-surface proof.",
                "",
            )
        ),
        encoding="utf-8",
    )

    attestation = assess_generated_asset_contract(tmp_path, "intent_surface")
    assert attestation["asset_id"] == "intent_surface"
    assert attestation["materialization_kind_expected"] == "file"
    assert attestation["materialization_kind_actual"] == "file"
    assert attestation["heading_matches"] is True
    assert attestation["marker_present"] is True
    assert attestation["contract_satisfied"] is True


def test_generated_asset_contract_assessment_for_code_surface(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    package_root = asset_path(tmp_path, "code_surface")
    package_root.mkdir(parents=True, exist_ok=True)
    code_marker = asset_marker("code_surface")
    file_contents = {
        "__init__.py": "\n".join(
            (
                CODE_SURFACE_PREFIXES[0][1],
                "",
                f"# {code_marker}",
                "",
                "from .app import hello_message, main",
                "",
            )
        ),
        "__main__.py": "\n".join((CODE_SURFACE_PREFIXES[1][1], "", "from .app import main", "")),
        "app.py": "\n".join((CODE_SURFACE_PREFIXES[2][1], "", "def hello_message() -> str:", "    return 'hi'", "")),
        "workflow.py": "\n".join(
            (
                CODE_SURFACE_PREFIXES[3][1],
                "",
                "def implementation_summary() -> dict[str, object]:",
                "    return {}",
                "",
            )
        ),
    }
    for relative_path, content in file_contents.items():
        (package_root / relative_path).write_text(content, encoding="utf-8")

    attestation = assess_generated_asset_contract(tmp_path, "code_surface")
    assert attestation["asset_id"] == "code_surface"
    assert attestation["materialization_kind_expected"] == "directory"
    assert attestation["materialization_kind_actual"] == "directory"
    assert attestation["missing_files"] == []
    assert attestation["member_prefix_failures"] == []
    assert attestation["marker_present"] is True
    assert attestation["contract_satisfied"] is True


def test_module_publishes_first_asset_function_catalog(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    module = odd_sdlc_module(tmp_path)
    graph_function_names = [graph_function.name for graph_function in module.graph_functions]
    assert graph_function_names == [
        "bootstrap_release_self_test",
        "release_operational_cycle",
        "review_design_consensus_round",
        "review_design_by_consensus",
    ]
    input_signatures = {
        graph_function.name: [node.name for node in graph_function.inputs]
        for graph_function in module.graph_functions
    }
    assert input_signatures == {
        "bootstrap_release_self_test": ["input_set"],
        "release_operational_cycle": ["release_surface", "test_run_archive_surface"],
        "review_design_consensus_round": ["design_surface"],
        "review_design_by_consensus": ["design_surface"],
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
    operational = module.graph_functions[1]
    assert operational.declarations.get("function_kind") == "odd_executive_graph_function"
    assert operational.declarations.get("intent") == RELEASE_OPERATIONAL_CYCLE_INTENT
    assert [node.name for node in operational.inputs] == ["release_surface", "test_run_archive_surface"]
    assert [node.name for node in operational.outputs] == ["retrofit_plan_surface"]
    assert [vector.name for vector in operational.materialize().vectors] == list(RELEASE_OPERATIONAL_CYCLE_STEPS)
    consensus_round = module.graph_functions[2]
    assert consensus_round.declarations.get("function_kind") == "odd_consensus_round_graph_function"
    assert consensus_round.template.kind == "inline_graph"
    assert [node.name for node in consensus_round.inputs] == ["design_surface"]
    assert [node.name for node in consensus_round.outputs] == ["reviewed_design_surface"]
    assert consensus_round.inputs[0].asset_surface.kind == "design_surface"
    assert consensus_round.outputs[0].asset_surface.kind == "reviewed_design_surface"
    assert [vector.name for vector in consensus_round.materialize().vectors] == [
        "derive_review_assessment_surface",
        "derive_consensus_decision_surface",
        "derive_reviewed_design_surface",
    ]
    consensus_library = module.graph_functions[3]
    assert consensus_library.declarations.get("function_kind") == "odd_consensus_library_graph_function"
    assert consensus_library.template.kind == "symbolic"
    assert [node.name for node in consensus_library.inputs] == ["design_surface"]
    assert [node.name for node in consensus_library.outputs] == ["reviewed_design_surface"]
    assert "consensus" in consensus_library.tags
    assert "library" in consensus_library.tags
    assert consensus_library.declarations.get("recursion") is not None
    assert consensus_library.declarations.get("harness_implementation") == {
        "custom_functions": (
            "review_design_assessment_round",
            "reduce_design_consensus_decision",
            "apply_design_consensus_decision",
        ),
        "policy_rule": "design_consensus_rule",
    }
    assert [job.name for job in module.jobs] == ["bootstrap_release_self_test_job", "release_operational_cycle_job"]

    executable_jobs = module_to_executable_jobs(module)
    assert len(executable_jobs) == 21
    assert [job.vector.name for job in executable_jobs] == list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS) + list(
        RELEASE_OPERATIONAL_CYCLE_STEPS
    )
    assert {job.job.name for job in executable_jobs} == {"bootstrap_release_self_test_job", "release_operational_cycle_job"}

    vectors = {vector.name: vector for vector in executive.materialize().vectors}
    requirement_context_names = [context.name for context in vectors["derive_requirement_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in requirement_context_names
    assert "odd_sdlc_requirement_closure_builder_context" in requirement_context_names
    realization_context_names = [context.name for context in vectors["derive_code_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in realization_context_names
    assert "odd_sdlc_realization_deepening_control_frame" in realization_context_names
    module_context_names = [context.name for context in vectors["derive_implementation_module_surface"].contexts]
    assert "odd_sdlc_realization_deepening_control_frame" in module_context_names
    test_module_context_names = [context.name for context in vectors["derive_test_module_surface"].contexts]
    assert "odd_sdlc_realization_deepening_control_frame" in test_module_context_names
    archive_context_names = [context.name for context in vectors["derive_test_run_archive_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in archive_context_names
    assert "odd_sdlc_realized_test_source_obligation" in archive_context_names
    assert {job.graph_function.name for job in executable_jobs} == {
        "bootstrap_release_self_test",
        "release_operational_cycle",
    }


def test_module_build_does_not_publish_runtime_sidecars(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    runtime_paths = (
        tmp_path / STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH,
        tmp_path / REALIZED_TEST_SOURCE_CONTEXT_PATH,
        tmp_path / REALIZATION_DEEPENING_CONTEXT_PATH,
        tmp_path / REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH,
    )
    assert all(not path.exists() for path in runtime_paths)

    odd_sdlc_module(tmp_path)

    assert all(not path.exists() for path in runtime_paths)


def test_code_edge_prompt_includes_realization_deepening_context(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    module = odd_sdlc_module(tmp_path)
    code_job = next(
        job
        for job in module_to_executable_jobs(module)
        if job.vector.name == "derive_code_surface"
    )
    resolver = ContextResolver(tmp_path)
    relevant_contexts = {
        context.name: resolver.load(context)
        for context in code_job.vector.contexts
    }
    evaluator = next(ev for ev in code_job.vector.evaluators if ev.name == "code_traceability_present")
    pre = SimpleNamespace(
        current_asset={},
        failing_evaluators=[evaluator],
        fd_results={
            evaluator.name: {
                "passes": False,
                "detail": {
                    "returncode": 1,
                    "stdout": '{"missing_requirement_ids":["REQ-DEMO-001"]}',
                    "stderr": "",
                },
            }
        },
        relevant_contexts=relevant_contexts,
        resolved_environment=SimpleNamespace(
            bindings=(),
            ready=True,
            summary_lines=lambda: [],
            vector_source_required_contexts=(),
            asset_surface_required_contexts=(),
            asset_surface_injected_required_contexts=(),
            requires=(),
        ),
    )

    prompt = _assemble_prompt(pre, code_job, result_path=".ai-workspace/fp_results/mock.json")

    assert "This edge works over an existing realization or realization plan, not a blank slate." in prompt
    assert "Existing files and existing module groups are obligations, not proof of completion." in prompt
    assert "Prefer deepening or correcting existing artifacts" in prompt


def test_query_domain_is_read_only_when_analysis_has_not_been_published(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    payload = query_domain(initialize(bootstrap(workspace_root=tmp_path)))

    assert payload["ambiguity_register"]["register_kind"] == "odd_sdlc.ambiguity_register"
    assert payload["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert not (tmp_path / STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH).exists()
    assert not (tmp_path / REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH).exists()


def test_start_requires_explicit_analysis_publication(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))
    calls: list[tuple[object, object, bool]] = []

    def _fake_gen_start(scope, stream, *, auto: bool = False) -> dict[str, object]:
        calls.append((scope, stream, auto))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    with pytest.raises(RuntimeError, match="refresh-analysis"):
        start(app)
    assert calls == []

    refresh_analysis(tmp_path, stage="test")
    result = start(app, auto=True)

    assert result == {"status": "ok"}
    assert len(calls) == 1
    assert calls[0][2] is True


def test_published_analysis_invalidates_when_requirement_surface_changes(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    requirement_surface = tmp_path / "specification" / "requirements" / "10-generated-bootstrap.md"
    requirement_surface.write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-DEMO-001\n",
        encoding="utf-8",
    )

    refresh_analysis(tmp_path, stage="test")
    ready_before, _ = workspace_state_ready(tmp_path)
    assert ready_before is True

    requirement_surface.write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-DEMO-001\n- REQ-DEMO-002\n",
        encoding="utf-8",
    )

    ready_after, _ = workspace_state_ready(tmp_path)
    assert ready_after is False

    register = load_or_build_requirement_closure_register(tmp_path)
    entries = {entry["requirement_id"] for entry in register["requirements"]}
    assert {"REQ-DEMO-001", "REQ-DEMO-002"} <= entries


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
        "lifecycle_surface",
        "deployment_surface",
        "runtime_observation_surface",
        "worksite_surface",
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
    assert asset_types["review_assessment_surface"]["specializes"] == ["authority_document_surface"]
    assert asset_types["consensus_decision_surface"]["specializes"] == ["authority_document_surface"]
    assert asset_types["reviewed_design_surface"]["specializes"] == ["design_document_surface"]
    assert asset_types["testcase_authority_surface"]["specializes"] == ["authority_document_surface"]
    assert asset_types["scenario_surface"]["specializes"] == ["scenario_collection_surface"]
    assert asset_types["release_surface"]["specializes"] == ["release_document_surface"]
    assert asset_types["ambiguity_register_surface"]["library_level"] == "specialized"
    assert asset_types["requirement_closure_register_surface"]["library_level"] == "specialized"
    assert asset_types["implementation_design_surface"]["specializes"] == ["design_document_surface"]
    assert asset_types["implementation_stack_profile"]["specializes"] == ["stack_profile_surface"]
    assert asset_types["implementation_module_surface"]["specializes"] == ["module_structure_surface"]
    assert asset_types["code_surface"]["specializes"] == ["source_code_surface"]
    assert asset_types["test_design_surface"]["specializes"] == ["design_document_surface"]
    assert asset_types["test_stack_profile"]["specializes"] == ["stack_profile_surface"]
    assert asset_types["test_module_surface"]["specializes"] == ["module_structure_surface"]
    assert asset_types["test_run_archive_surface"]["specializes"] == ["archive_evidence_surface"]
    assert asset_types["proof_surface"]["mutable_default"] is False
    assert asset_types["deployment_record_surface"]["library_level"] == "generic"
    assert asset_types["runtime_observation_surface"]["library_level"] == "generic"
    assert asset_types["operational_evidence_surface"]["library_level"] == "generic"
    assert asset_types["maintenance_plan_surface"]["library_level"] == "generic"
    assert asset_types["retrofit_design_surface"]["library_level"] == "generic"

    asset_families = {family["name"]: family for family in result["asset_families"]}
    assert asset_families["worksite_inputs"]["realization_status"] == "active_first_slice"
    assert asset_families["implementation_branch"]["representative_asset_types"] == [
        "implementation_design_surface",
        "implementation_stack_profile",
        "implementation_module_surface",
        "code_surface",
    ]
    assert asset_families["deployment_records"]["realization_status"] == "active_first_slice"
    assert asset_families["runtime_evidence"]["realization_status"] == "active_first_slice"
    assert asset_families["retrofit_plans"]["realization_status"] == "active_first_slice"

    work_act_types = {act["name"]: act for act in result["work_act_types"]}
    assert work_act_types["generate"]["realization_status"] == "active_first_slice"
    assert work_act_types["adopt"]["realization_status"] == "declared_domain_contract"
    assert work_act_types["deploy"]["realization_status"] == "active_first_slice"
    assert work_act_types["observe"]["realization_status"] == "active_first_slice"
    assert work_act_types["retrofit"]["typical_asset_families"] == [
        "retrofit_plans",
        "implementation_branch",
        "qualification_branch",
    ]
    assert work_act_types["retrofit"]["realization_status"] == "active_first_slice"

    edge_contracts = {contract["name"]: contract for contract in result["edge_contracts"]}
    assert edge_contracts["bootstrap_spec_foundation"]["realization_status"] == "active_first_slice"
    assert edge_contracts["prepare_release_readiness"]["representative_functions"] == [
        "prepare_release_surface",
    ]
    assert edge_contracts["publish_deployment_record"]["representative_functions"] == [
        "prepare_deployment_surface",
    ]
    assert edge_contracts["return_runtime_evidence"]["representative_functions"] == [
        "derive_runtime_observation_surface",
    ]
    assert edge_contracts["retrofit_and_relaunch"]["realization_status"] == "active_first_slice"

    asset_uris = {asset["uri"] for asset in result["assets"]}
    expected_asset_uris = {f"file://{resolved_asset_relative_path(tmp_path, asset_id)}" for asset_id, _ in ASSET_PATHS}
    assert asset_uris == expected_asset_uris

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
    assert bindings["review_assessment_surface"] == ("review_assessment_surface",)
    assert bindings["consensus_decision_surface"] == ("consensus_decision_surface",)
    assert bindings["reviewed_design_surface"] == ("reviewed_design_surface",)
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
    assert bindings["deployment_surface"] == ("deployment_surface",)
    assert bindings["runtime_observation_surface"] == ("runtime_observation_surface",)
    assert bindings["retrofit_plan_surface"] == ("retrofit_plan_surface",)
    assert [entry["name"] for entry in result["graph_functions"]] == GRAPH_FUNCTION_NAMES
    executive = result["graph_functions"][0]
    assert executive["intent"] == BOOTSTRAP_RELEASE_SELF_TEST_INTENT
    assert executive["function_kind"] == "odd_executive_graph_function"
    assert executive["template_kind"] == "inline_graph"
    assert "executive" in executive["tags"]
    assert executive["inputs"] == ["input_set"]
    assert executive["outputs"] == ["release_surface"]
    assert executive["input_contracts"][0]["asset_surface"]["kind"] == "bootstrap_input_set"
    assert executive["output_contracts"][0]["asset_surface"]["kind"] == "release_surface"
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
    operational = result["graph_functions"][1]
    assert operational["intent"] == RELEASE_OPERATIONAL_CYCLE_INTENT
    assert operational["function_kind"] == "odd_executive_graph_function"
    assert operational["template_kind"] == "inline_graph"
    assert operational["inputs"] == ["release_surface", "test_run_archive_surface"]
    assert operational["outputs"] == ["retrofit_plan_surface"]
    assert [vector["name"] for vector in operational["vectors"]] == list(RELEASE_OPERATIONAL_CYCLE_STEPS)
    assert operational["job_names"] == ["release_operational_cycle_job"]
    consensus_round = result["graph_functions"][2]
    assert consensus_round["function_kind"] == "odd_consensus_round_graph_function"
    assert consensus_round["harness_kind"] == "consensus_round"
    assert consensus_round["template_kind"] == "inline_graph"
    assert consensus_round["inputs"] == ["design_surface"]
    assert consensus_round["outputs"] == ["reviewed_design_surface"]
    assert consensus_round["input_contracts"][0]["asset_surface"]["kind"] == "design_surface"
    assert consensus_round["output_contracts"][0]["asset_surface"]["kind"] == "reviewed_design_surface"
    assert consensus_round["harness_contract"] == {
        "subject_asset": "design_surface",
        "assessment_asset": "review_assessment_surface",
        "decision_asset": "consensus_decision_surface",
        "reviewed_asset": "reviewed_design_surface",
        "assessment_vector_asset": "review_assessment_vector",
        "injected_functions": {
            "review_round": "review_design_assessment_round",
            "reduce": "reduce_design_consensus_decision",
            "apply": "apply_design_consensus_decision",
        },
        "policy_rule": "design_consensus_rule",
        "composable": True,
        "recursive": True,
    }
    assert consensus_round["vectors"] == [
        {"name": "derive_review_assessment_surface", "source": ["design_surface"], "target": "review_assessment_surface"},
        {"name": "derive_consensus_decision_surface", "source": ["review_assessment_surface"], "target": "consensus_decision_surface"},
        {"name": "derive_reviewed_design_surface", "source": ["design_surface", "consensus_decision_surface"], "target": "reviewed_design_surface"},
    ]
    assert consensus_round["job_names"] == []
    consensus_library = result["graph_functions"][3]
    assert consensus_library["function_kind"] == "odd_consensus_library_graph_function"
    assert consensus_library["harness_kind"] == "consensus_harness"
    assert consensus_library["template_kind"] == "symbolic"
    assert consensus_library["inputs"] == ["design_surface"]
    assert consensus_library["outputs"] == ["reviewed_design_surface"]
    assert "consensus" in consensus_library["tags"]
    assert "library" in consensus_library["tags"]
    assert consensus_library["vectors"] == []
    assert consensus_library["job_names"] == []
    assert consensus_library["harness_contract"] == consensus_round["harness_contract"]
    assert consensus_library["harness_implementation"] == {
        "custom_functions": (
            "review_design_assessment_round",
            "reduce_design_consensus_decision",
            "apply_design_consensus_decision",
        ),
        "policy_rule": "design_consensus_rule",
    }
    assert result["programs"] == [
        {
            "name": "bootstrap_release_self_test",
            "intent": BOOTSTRAP_RELEASE_SELF_TEST_INTENT,
            "steps": list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS),
            "outputs": ["release_surface"],
            "kind": "executive_program",
        },
        {
            "name": "release_operational_cycle",
            "intent": RELEASE_OPERATIONAL_CYCLE_INTENT,
            "steps": list(RELEASE_OPERATIONAL_CYCLE_STEPS),
            "outputs": ["retrofit_plan_surface"],
            "kind": "executive_program",
        },
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
        "ambiguity_register",
        "asset_families",
        "asset_types",
        "assets",
        "bindings",
        "collections",
        "continuations",
        "edge_contracts",
        "functions",
        "gaps",
        "graph_calls",
        "graph_functions",
        "jobs",
        "programs",
        "query_contract",
        "recent_events",
        "requirement_closure_register",
        "runs",
        "semantic_facets",
        "work_act_types",
        "workspace_root",
    ]
    assert len(payload["assets"]) == 26
    assert len(payload["functions"]) == 21
    assert len(payload["asset_families"]) == 8
    assert len(payload["work_act_types"]) == 8
    assert len(payload["edge_contracts"]) == 7
    assert len(payload["collections"]) == 1
    assert len(payload["programs"]) == 2
    assert payload["gaps"]["converged"] is False
    assert payload["runs"] == []
    assert payload["graph_calls"] == []
    assert payload["continuations"] == []
    assert payload["recent_events"] == []
    assert payload["ambiguity_register"]["register_kind"] == "odd_sdlc.ambiguity_register"
    assert payload["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert [entry["name"] for entry in payload["graph_functions"]] == GRAPH_FUNCTION_NAMES
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
    assert payload["query_contract"] == {
        "name": "odd_sdlc.query-domain",
        "version": "v7",
        "top_level_keys": [
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
        ],
        "runtime_model": "abg-native",
        "query_model": "odd-domain-plugin",
    }
    assert "runs" not in payload
    assert "graph_calls" not in payload
    assert "continuations" not in payload
    assert len(payload["assets"]) == 26
    assert len(payload["functions"]) == 21
    assert len(payload["asset_families"]) == 8
    assert len(payload["work_act_types"]) == 8
    assert len(payload["edge_contracts"]) == 7
    assert len(payload["collections"]) == 1
    assert len(payload["programs"]) == 2
    assert payload["gaps"]["converged"] is False
    assert payload["ambiguity_register"]["register_kind"] == "odd_sdlc.ambiguity_register"
    assert payload["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert payload["asset_families"][0]["name"] == "worksite_inputs"
    assert payload["work_act_types"][0]["name"] == "generate"
    assert payload["edge_contracts"][0]["name"] == "bootstrap_spec_foundation"
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
    assert functions["prepare_deployment_surface"]["inputs"] == ["release_surface"]
    assert functions["derive_runtime_observation_surface"]["inputs"] == ["deployment_surface", "test_run_archive_surface"]
    assert functions["derive_retrofit_plan_surface"]["inputs"] == ["runtime_observation_surface", "release_surface"]
    assert [entry["name"] for entry in payload["graph_functions"]] == GRAPH_FUNCTION_NAMES
    assert payload["graph_functions"][0]["job_names"] == ["bootstrap_release_self_test_job"]
    assert payload["graph_functions"][1]["job_names"] == ["release_operational_cycle_job"]
    assert payload["graph_functions"][2]["job_names"] == []
    assert payload["graph_functions"][3]["job_names"] == []
    assert [vector["name"] for vector in payload["graph_functions"][0]["vectors"]] == list(
        BOOTSTRAP_RELEASE_SELF_TEST_STEPS
    )
    assert [vector["name"] for vector in payload["graph_functions"][1]["vectors"]] == list(RELEASE_OPERATIONAL_CYCLE_STEPS)
    assert [vector["name"] for vector in payload["graph_functions"][2]["vectors"]] == [
        "derive_review_assessment_surface",
        "derive_consensus_decision_surface",
        "derive_reviewed_design_surface",
    ]
    assert payload["graph_functions"][3]["template_kind"] == "symbolic"
    assert payload["graph_functions"][3]["vectors"] == []


def test_start_runs_through_declared_entry_and_emits_abg_facts(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join((str(GENESIS_PATH), str(CODE_PATH))),
    }
    subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "refresh-analysis",
            "--workspace",
            str(tmp_path),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        check=True,
    )
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
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    result = self_test(app)

    assert result["status"] == "ok"
    assert result["program"]["name"] == "bootstrap_release_self_test"
    assert result["completed_edges"] == list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS)
    assert all(step["start"]["blocking_reason"] == "fp_dispatch" for step in result["steps"])
    assert [step["assessed"]["status"] for step in result["steps"]] == ["ok"] * len(result["steps"])
    assert result["steps"][-1]["edge"] == "prepare_release_surface"
    assert result["steps"][-1]["assessed"]["status"] == "ok"
    assert result["final_state"]["status"] == "iterated"
    assert result["final_state"]["edge"] == "prepare_deployment_surface"
    assert result["final_state"]["blocking_reason"] == "fp_dispatch"

    events = _read_events(tmp_path)
    assert "run_completed" in [event["event_type"] for event in events]
    assert asset_path(tmp_path, "test_run_archive_surface").exists()
    assert asset_path(tmp_path, "release_surface").exists()


def test_self_test_raises_when_the_executive_cannot_start_the_expected_edge(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    monkeypatch.setattr(
        self_test_module,
        "start",
        lambda _app: {
            "status": "pending",
            "edge": "derive_intent_surface",
            "blocking_reason": "fp_dispatch",
        },
    )

    with pytest.raises(RuntimeError, match="non-iterated status 'pending'"):
        self_test(app)
