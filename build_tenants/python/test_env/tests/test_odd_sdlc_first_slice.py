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

import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest


ROOT = Path(__file__).resolve().parents[4]
GENESIS_PATH = ROOT.parent / "abiogenesis" / "build_tenants" / "abiogenesis" / "python" / "code"
CODE_PATH = ROOT / "build_tenants" / "python" / "code"
DATA_MAPPER_TEMPLATE = (
    ROOT / "build_tenants" / "python" / "test_env" / "fixtures" / "data_mapper_reference" / "data_mapper.template"
)

GRAPH_FUNCTION_NAMES = [
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
]


if not DATA_MAPPER_TEMPLATE.exists():
    raise AssertionError(f"internal data_mapper.template fixture missing: {DATA_MAPPER_TEMPLATE}")

TEST28_PASS2_REPLAY_SOURCES = {
    "JobSubmitter.scala": """package replay

object JobSubmitter {
  def submit(job: String): String = ???
}
""",
    "Reconciler.scala": """package replay

object Reconciler {
  val isConsistent = true
}
""",
    "SparkMorphismExecutor.scala": """package replay

object SparkMorphismExecutor {
  def execute(input: String): String = {
    val output = output
    output
  }
}
""",
}


def _write_test28_pass2_replay_code(code_root: Path) -> None:
    code_root.mkdir(parents=True, exist_ok=True)
    for filename, source in TEST28_PASS2_REPLAY_SOURCES.items():
        (code_root / filename).write_text(source, encoding="utf-8")


def _expected_graph_function_names(actual_names: list[str]) -> list[str]:
    expected = ["bootstrap_release_self_test"]
    if "release_operational_cycle" in actual_names:
        expected.append("release_operational_cycle")
    expected.extend(
        [
            "review_subject_consensus_round",
            "review_subject_by_consensus",
            "review_design_consensus_round",
            "review_design_by_consensus",
            "review_comment_consensus_round",
            "review_comment_by_consensus",
            "derive_execution_contract_surface",
            "admit_execution_contract_surface",
        ]
    )
    return expected


def _expected_program_entries(graph_function_names: list[str]) -> list[dict[str, object]]:
    expected: list[dict[str, object]] = [
        {
            "name": "bootstrap_release_self_test",
            "intent": BOOTSTRAP_RELEASE_SELF_TEST_INTENT,
            "steps": list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS),
            "outputs": ["release_surface"],
            "kind": "executive_program",
        }
    ]
    if "release_operational_cycle" in graph_function_names:
        expected.append(
            {
                "name": "release_operational_cycle",
                "intent": RELEASE_OPERATIONAL_CYCLE_INTENT,
                "steps": list(RELEASE_OPERATIONAL_CYCLE_STEPS),
                "outputs": ["retrofit_plan_surface"],
                "kind": "executive_program",
            }
        )
    return expected


if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))

import odd_sdlc.app as app_module  # noqa: E402
import odd_sdlc.__main__ as odd_sdlc_cli  # noqa: E402
import odd_sdlc.continuation as continuation_module  # noqa: E402
import odd_sdlc.query as query_module  # noqa: E402
import odd_sdlc.triage as triage_module  # noqa: E402
from odd_sdlc.analysis import load_analysis_manifest, refresh_analysis, workspace_state_ready  # noqa: E402
from odd_sdlc.app import bootstrap, catalog, gaps, initialize, start  # noqa: E402
from odd_sdlc.continuation import continue_with_result  # noqa: E402
from odd_sdlc.execution_contract import (  # noqa: E402
    ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION,
    DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION,
    EXECUTION_CONTRACT_CONTEXT_PATH,
    EXECUTION_CONTRACT_KIND,
    EXECUTION_CONTRACT_REGISTER_PATH,
    ExecutionContractSurfaceError,
    admit_execution_contract_surface,
    bound_execution_start_from_contract,
    execution_contract_payload,
    load_admitted_execution_contract_projection,
)
from odd_sdlc.homeostatic_loop import apply_constitutional_proposal  # noqa: E402
from odd_sdlc.gap_dossier import (  # noqa: E402
    GAP_DOSSIER_CONTEXT_PATH,
    GAP_DOSSIER_REGISTER_PATH,
    load_gap_dossier_read_model,
    project_gap_dossier_input,
    project_operator_gap_analysis,
)
from odd_sdlc.gtl_module import (  # noqa: E402
    BOOTSTRAP_RELEASE_SELF_TEST_INTENT,
    BOOTSTRAP_RELEASE_SELF_TEST_STEPS,
    RELEASE_OPERATIONAL_CYCLE_INTENT,
    RELEASE_OPERATIONAL_CYCLE_STEPS,
    module as odd_sdlc_module,
)
from odd_sdlc.query import query_domain  # noqa: E402
import odd_sdlc.self_test as self_test_module  # noqa: E402
from odd_sdlc.project_profile import load_project_profile  # noqa: E402
from odd_sdlc.normalization import normalize_workspace  # noqa: E402
from odd_sdlc.public_start import (  # noqa: E402
    PublicStartDispatchRequired,
    PublicStartReturn,
    project_public_start_dispatch_outcome,
    project_public_start_gen_start_outcome,
)
from odd_sdlc.public_start_subcarriers import (  # noqa: E402
    admit_evidence_items,
    admit_fulfillment_assessments,
    admit_prompt_compactions,
    admit_published_fulfillment_ledger_ref,
    admit_resolved_policy_payload,
)
from odd_sdlc.repair_frontier import (  # noqa: E402
    REPAIR_FRONTIER_CONTEXT_PATH,
    REPAIR_FRONTIER_REGISTER_PATH,
    build_repair_frontier_prompt_context,
)
from odd_sdlc.runtime_contexts import (  # noqa: E402
    REALIZATION_ITERATION_DIGEST_CONTEXT_PATH,
    STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH,
    TEST_LANE_COMPLETENESS_CONTEXT_PATH,
)
from odd_sdlc.runtime_event_contract import admit_runtime_event_payload  # noqa: E402
from odd_sdlc.self_test import self_test  # noqa: E402
import odd_sdlc.span_analysis as span_analysis_module  # noqa: E402
from odd_sdlc.requirement_closure import (  # noqa: E402
    REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH,
    build_requirement_closure_prompt_context,
    build_requirement_closure_register,
    declared_requirement_edge_gap,
    load_requirement_closure_register_read_model,
)
from odd_sdlc.test_lane_evidence import (  # noqa: E402
    admit_test_lane_evidence_payload,
    build_test_lane_evidence,
)
from odd_sdlc.traceability_index import build_requirement_traceability_index  # noqa: E402
from odd_sdlc.worker_attachment import project_fp_worker_attachment  # noqa: E402
from odd_sdlc.triage import CURRENT_TRIAGE_DIR, enrich_gap_snapshot, load_current_edge_triage  # noqa: E402
from odd_sdlc.workspace_assets import (  # noqa: E402
    ASSET_PATHS,
    CODE_SURFACE_PREFIXES,
    assess_generated_asset_contract,
    asset_marker,
    asset_marker_path,
    asset_materialization_path,
    asset_path,
    bootstrap_assets,
    resolved_asset_relative_path,
)


def _manifest_context(manifest: dict[str, object], name: str) -> dict[str, object]:
    for context in manifest.get("contexts", ()):
        if isinstance(context, dict) and context.get("name") == name:
            return context
    raise AssertionError(f"manifest context {name!r} not found")


def _admit_ordinary_execution_contract(tmp_path: Path, module) -> None:
    app = initialize(bootstrap(workspace_root=tmp_path))
    admit_execution_contract_surface(
        workspace_root=tmp_path,
        module=module,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        work_key=None,
        run_id=None,
        normalized_scope="workspace",
        raw_target="graph_function:bootstrap_release_self_test",
        until="converged",
    )


from genesis.binding import ContextResolver, TargetAssetBinding, _assemble_prompt, module_to_executable_jobs  # noqa: E402
from genesis.cli_adapter import _emit_event_cmd  # noqa: E402
from genesis.events import emit  # noqa: E402
from genesis.policy import resolve_policy_bundle  # noqa: E402


def _generic_fp_obligation_ledger(
    vector_name: str,
    evaluator_name: str,
    description: str,
    *,
    evaluator_index: int = 1,
) -> dict[str, object]:
    return {
        "obligation_source_kind": "vector_declared_fp_evaluators",
        "obligation_source_ref": f"vector://{vector_name}#obligation_ledger",
        "obligation_kind": "fp_evaluator_obligation",
        "carry_rule": "declared_fulfillment_obligation_set_totality",
        "fulfillment_rule": "per_obligation_fp_assessment",
        "evidence_policy": "agent_supplied_evidence_refs",
        "obligations": [
            {
                "id": evaluator_name,
                "evaluator": evaluator_name,
                "statement": description,
                "source_kind": "vector_declared_fp_evaluators",
                "source_refs": [f"vector://{vector_name}#evaluator/{evaluator_index}"],
            }
        ],
    }


def _seed_workspace(path: Path) -> None:
    (path / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (path / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (path / "specification" / "INTENT.md").write_text("# Intent\n", encoding="utf-8")
    (path / "specification" / "PRODUCT.md").write_text("# Product\n", encoding="utf-8")
    (path / "specification" / "GOALS.md").write_text("# Goals\n", encoding="utf-8")
    (path / "specification" / "requirements" / "10-bootstrap.md").write_text(
        "\n".join(
            (
                "# Bootstrap Requirements",
                "",
                "- REQ-DEMO-001: the proving workspace remains installable and executable.",
                "- REQ-DEMO-002: constructor turns remain attributable and resettable.",
                "",
            )
        ),
        encoding="utf-8",
    )


def _seed_imported_workspace_for_normalization(path: Path) -> None:
    (path / "specification").mkdir(parents=True, exist_ok=True)
    (path / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (path / "specification" / "INTENT.md").write_text("# Project Intent\n\nImported project intent.\n", encoding="utf-8")
    (path / "specification" / "REQUIREMENTS.md").write_text(
        "\n".join(
            (
                "# Imported Requirements",
                "",
                "- REQ-ADJ-01: Preserve imported numbering authority.",
                "- REQ-ADJ-02-A: Preserve imported suffixed numbering authority.",
                "",
            )
        ),
        encoding="utf-8",
    )


def _seed_data_mapper_template_workspace(path: Path) -> None:
    shutil.copytree(DATA_MAPPER_TEMPLATE, path, dirs_exist_ok=True)


def _invalidate_imported_intent_surface(path: Path) -> None:
    (path / "specification" / "INTENT.md").write_text(
        "# Project Intent\n\nImported project intent.\n",
        encoding="utf-8",
    )
    (path / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                f"# Project Constraints — {path.name}",
                "# Imported legacy test surface",
                "",
                "project:",
                '  name: ""',
                '  kind: "data-pipeline"',
                '  language: "Scala"',
                '  test_runner: "sbt test"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "scala_spark"',
                '      output_dir: "imp_scala_spark/"',
                '      description: "Legacy layout"',
                '      build_execution_contract: ""',
                '      test_execution_contract: ""',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )


def _seed_ticket_work_item(
    path: Path,
    *,
    ticket_id: str = "B-900",
    status: str = "active",
    ticket_category: str = "ordinary",
    change_class: str = "requirement_reprice",
    re_entry_point: str = "requirements",
) -> None:
    ticket_dir = path / ".ai-workspace" / "tickets" / status
    ticket_dir.mkdir(parents=True, exist_ok=True)
    ticket_lines = [
        "---",
        f"id: {ticket_id}",
        "title: Demo work item",
        "type: bug",
        f"ticket_category: {ticket_category}",
        f"status: {status}",
        f"change_class: {change_class}",
        f"re_entry_point: {re_entry_point}",
        "target_truth: one admitted execution contract governs this bounded repair",
        "superseded_truth: raw ticket prose and operator phrasing steer execution directly",
        "closure_law: close only when the admitted execution contract is the source carrier and mixed old/new execution proof is rejected",
        "evaluation_criteria:",
        "  - admit the execution contract before prompt assembly opens",
        "  - carry the admitted closure law into manifest provenance",
        "non_closure_conditions:",
        "  - raw ticket prose still acts as execution authority",
        "  - mixed old/new execution proof still counts as closure",
        "proof_surface:",
        "  - .ai-workspace/runtime/odd_sdlc-execution-contract.json",
        "  - .ai-workspace/runtime/odd_sdlc-execution-contract.md",
        "---",
        "",
        "# Demo Work Item",
        "",
        "- reproduce and repair bounded requirement pressure",
        "",
    ]
    if ticket_category == "implementation_migration":
        ticket_lines.extend(
            [
                "## Migration Declaration",
                "",
                "- old_truth_path: manual operator interpretation remains authoritative execution truth",
                "- new_truth_path: ticket-driven routed traversal governs the declared re-entry seam",
                "- closure_law: close only when routed ticket execution replaces manual authority and mixed old/new behavior is not accepted as proof",
                "",
                "## Migration Checklist",
                "",
                "- [x] old truth path is named explicitly",
                "- [x] new truth path is named explicitly",
                "- [ ] old truth path is removed or explicitly demoted from authority",
                "- [ ] mixed-state behavior is no longer accepted as closure evidence",
                "",
                "## Required Direction",
                "",
                "1. Route the work-item through the declared re-entry seam.",
                "2. Preserve already-satisfied structure.",
                "3. Do not count mixed old/new execution as closure.",
                "",
                "## Acceptance",
                "",
                "- routed traversal uses the declared re-entry seam",
                "- prompt and manifest carry the work-item execution discipline",
                "",
            ]
        )
    (ticket_dir / f"{ticket_id}-demo.md").write_text(
        "\n".join(ticket_lines),
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
                '      build_execution_contract: "python -m build"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: "docs/deployment-contract.md"',
                '      runtime_observation_contract: "docs/runtime-observation-contract.md"',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )


def _seed_fp_iteration_artifacts(
    path: Path,
    *,
    edge_id: str,
    suffix: str = "0001",
) -> tuple[Path, Path]:
    manifests_dir = path / ".ai-workspace" / "fp_manifests"
    results_dir = path / ".ai-workspace" / "fp_results"
    manifests_dir.mkdir(parents=True, exist_ok=True)
    results_dir.mkdir(parents=True, exist_ok=True)
    result_path = results_dir / f"{edge_id}_{suffix}.json"
    result_path.write_text(
        json.dumps(
            {
                "edge": edge_id,
                "actor": "odd_sdlc_constructor",
                "attestation": {"status": "ok"},
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    manifest_path = manifests_dir / f"{edge_id}_{suffix}.json"
    manifest_path.write_text(
        json.dumps(
            {
                "edge": edge_id,
                "result_path": str(result_path.relative_to(path)),
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    return manifest_path, result_path


def test_normalize_workspace_canonicalizes_imported_requirement_authority(tmp_path: Path) -> None:
    workspace = tmp_path / "b045-source"
    _seed_imported_workspace_for_normalization(workspace)

    normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )

    imported_summary = (
        workspace / "specification" / "requirements" / "00-imported-sources.md"
    ).read_text(encoding="utf-8")
    assert "REQ-ADJ-001" in imported_summary
    assert "REQ-ADJ-002-A" in imported_summary
    assert "REQ-ADJ-01:" not in imported_summary
    assert "REQ-ADJ-02-A:" not in imported_summary

    index = build_requirement_traceability_index(workspace)
    assert index.authority_refs["REQ-ADJ-001"] == ["specification/requirements/00-imported-sources.md"]
    assert index.authority_refs["REQ-ADJ-002-A"] == ["specification/requirements/00-imported-sources.md"]


def test_normalize_workspace_publishes_named_diagnostic_for_empty_execution_contracts(tmp_path: Path) -> None:
    workspace = tmp_path / "b046-source"
    _seed_imported_workspace_for_normalization(workspace)

    normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )

    constraints = (workspace / ".ai-workspace" / "context" / "project_constraints.yml").read_text(encoding="utf-8")
    assert 'build_execution_contract: "undeclared"' in constraints
    assert 'test_execution_contract: "undeclared"' in constraints
    assert 'deployment_contract: "undeclared"' in constraints
    assert 'runtime_observation_contract: "undeclared"' in constraints
    assert 'build_execution_contract: ""' not in constraints

    profile = load_project_profile(workspace)
    assert profile.has_build_execution_capability() is False
    assert profile.has_test_execution_capability() is False

    ambiguity_register = json.loads(
        (workspace / ".ai-workspace" / "runtime" / "odd_sdlc-ambiguity-register.json").read_text(encoding="utf-8")
    )
    missing_build = next(
        entry
        for entry in ambiguity_register["ambiguities"]
        if entry["ambiguity_id"] == "missing-build-execution-capability"
    )
    assert missing_build["status"] == "pending_capability"
    assert missing_build["observed_state"]["declared_value"] == "undeclared"


def test_b056_project_profile_admits_v31_build_tenants_constraints(tmp_path: Path) -> None:
    constraints_path = tmp_path / ".ai-workspace" / "context" / "project_constraints.yml"
    constraints_path.parent.mkdir(parents=True, exist_ok=True)
    constraints_path.write_text(
        "\n".join(
            (
                "project:",
                '  name: "data_mapper"',
                '  kind: "data-pipeline"',
                '  test_runner: "sbt test"',
                'active_tenant: "scala_spark"',
                'ambiguity_risk_appetite: "medium"',
                "build_tenants:",
                "  scala_spark:",
                '    output_dir: "build_tenants/scala_spark/"',
                '    language: "Scala"',
                '    build_tool: "sbt"',
                "    module_structure:",
                '      - "cdme-compiler"',
                '      - "cdme-assurance"',
                "    capability_contracts:",
                "      spark_session: true",
                "      dataframe_reads: true",
                '      cli_runner_class: "cdme.engine.CdmeEngineRunner"',
                '    build_execution_contract: "sbt clean assembly"',
                '    test_execution_contract: "sbt test"',
                '    deployment_contract: "spark-submit"',
                '    runtime_observation_contract: "OpenLineage"',
                "constraints: {}",
                "root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )

    profile = load_project_profile(tmp_path)

    assert profile.project_slug == "data_mapper"
    assert profile.tenant_name == "scala_spark"
    assert profile.declared_output_dir == "build_tenants/scala_spark/"
    assert profile.build_execution_contract == "sbt clean assembly"
    assert profile.test_execution_contract == "sbt test"
    assert profile.deployment_contract == "spark-submit"
    assert profile.runtime_observation_contract == "OpenLineage"
    assert profile.capability_contracts["spark_session"] == "true"
    assert profile.capability_contracts["dataframe_reads"] == "true"
    assert profile.capability_contracts["cli_runner_class"] == "cdme.engine.CdmeEngineRunner"
    assert profile.declared_module_names() == ("cdme-compiler", "cdme-assurance")


def test_b056_v31_and_v32_project_constraints_normalize_to_same_profile(tmp_path: Path) -> None:
    v31 = tmp_path / "v31"
    v32 = tmp_path / "v32"
    for workspace in (v31, v32):
        (workspace / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (v31 / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "project:",
                '  name: "data_mapper"',
                '  kind: "data-pipeline"',
                '  test_runner: "sbt test"',
                'active_tenant: "scala_spark"',
                "build_tenants:",
                "  scala_spark:",
                '    output_dir: "build_tenants/scala_spark/"',
                '    language: "Scala"',
                '    build_tool: "sbt"',
                "    capability_contracts:",
                "      spark_session: true",
                "      dataframe_reads: true",
                '    build_execution_contract: "sbt clean assembly"',
                '    test_execution_contract: "sbt test"',
                '    deployment_contract: "spark-submit"',
                '    runtime_observation_contract: "OpenLineage"',
                "constraints: {}",
                "root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )
    (v32 / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "project:",
                '  name: "data_mapper"',
                '  kind: "data-pipeline"',
                '  language: "Scala"',
                '  tool: "sbt"',
                '  test_runner: "sbt test"',
                "constraints: {}",
                "structure:",
                "  design_tenants:",
                '    - name: "scala_spark"',
                '      output_dir: "build_tenants/scala_spark/"',
                "      capability_contracts:",
                '        spark_session: "true"',
                '        dataframe_reads: "true"',
                '      build_execution_contract: "sbt clean assembly"',
                '      test_execution_contract: "sbt test"',
                '      deployment_contract: "spark-submit"',
                '      runtime_observation_contract: "OpenLineage"',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )

    v31_profile = load_project_profile(v31).to_dict()
    v32_profile = load_project_profile(v32).to_dict()

    for key in (
        "project_slug",
        "tenant_name",
        "declared_output_dir",
        "build_execution_contract",
        "test_execution_contract",
        "deployment_contract",
        "runtime_observation_contract",
        "capability_contracts",
    ):
        assert v31_profile[key] == v32_profile[key]


def test_b060_normalize_data_mapper_template_maps_stale_execution_cues(
    tmp_path: Path,
) -> None:
    workspace = tmp_path / "data_mapper.b060"
    _seed_data_mapper_template_workspace(workspace)

    normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )

    constraints = (workspace / ".ai-workspace" / "context" / "project_constraints.yml").read_text(encoding="utf-8")
    assert 'test_runner: "sbt test"' in constraints
    assert 'test_runner: """' not in constraints
    assert 'build_execution_contract: "sbt clean assembly"' in constraints
    assert 'test_execution_contract: "sbt test"' in constraints
    assert 'deployment_contract: "spark-submit"' in constraints
    assert 'runtime_observation_contract: "OpenLineage"' in constraints

    profile = load_project_profile(workspace)
    assert profile.test_runner == "sbt test"
    assert profile.declared_module_names() == (
        "cdme-compiler",
        "cdme-assurance",
        "cdme-executor",
        "cdme-adjoint",
        "cdme-accounting",
        "cdme-fidelity",
        "cdme-engine",
    )
    assert profile.has_build_execution_capability() is True
    assert profile.has_test_execution_capability() is True
    assert profile.has_deployment_capability() is True
    assert profile.has_runtime_observation_capability() is True


def test_b059_planned_scala_tree_carries_requirement_traceability(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)
    constraints_path = tmp_path / ".ai-workspace" / "context" / "project_constraints.yml"
    constraints_path.write_text(
        "\n".join(
            (
                "project:",
                '  name: "planned_traceability"',
                '  kind: "data-pipeline"',
                '  language: "Scala"',
                '  tool: "sbt"',
                '  test_runner: "sbt test"',
                "constraints: {}",
                "structure:",
                "  design_tenants:",
                '    - name: "scala_spark"',
                '      output_dir: "build_tenants/scala_spark/"',
                '      module_structure: "(app-core, app-extra)"',
                "      capability_contracts:",
                '        fat_jar: "true"',
                '        spark_submit_compatible: "true"',
                '      build_execution_contract: "sbt clean assembly"',
                '      test_execution_contract: "sbt test"',
                '      deployment_contract: "spark-submit"',
                '      runtime_observation_contract: "OpenLineage"',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )

    from odd_sdlc.constructor import (  # noqa: PLC2701
        _construct_planned_software_tree,
        _materialize_planned_generated_test_files,
    )

    files = _construct_planned_software_tree(tmp_path)
    code_root = tmp_path / "build_tenants" / "scala_spark"
    for relative_path, content in files.items():
        target = code_root / relative_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")

    index = build_requirement_traceability_index(tmp_path)
    scan = index.traceability_scan()
    assert index.missing_code_traceability_ids() == ()
    assert scan["orphan_code_files"] == []
    assert scan["orphan_test_files"] == []

    main_source = (code_root / "app-core/src/main/scala/cdme/app_core/AppCoreModule.scala").read_text(encoding="utf-8")
    test_source = (code_root / "app-core/src/test/scala/cdme/app_core/AppCoreModuleSpec.scala").read_text(encoding="utf-8")
    build_sbt = (code_root / "build.sbt").read_text(encoding="utf-8")
    assert 'project in file("app-core")' in build_sbt
    assert 'name := "app-core"' in build_sbt
    assert "file('app-core')" not in build_sbt
    assert "name := 'app-core'" not in build_sbt
    assert "// Implements: REQ-DEMO-001" in main_source
    assert "// Implements: REQ-DEMO-002" in main_source
    assert "// Validates: REQ-DEMO-001" in test_source
    assert "// Validates: REQ-DEMO-002" in test_source
    assert "extends AnyFunSuite" in test_source

    materialization_report = _materialize_planned_generated_test_files(tmp_path)
    assert materialization_report["generated_test_source_count"] == 2
    generated_trace = (
        code_root
        / "app-core/src/test/scala/odd/generated/AppCoreGeneratedTraceSpec.scala"
    ).read_text(encoding="utf-8")
    assert "// Validates: REQ-DEMO-001" in generated_trace
    assert "extends AnyFunSuite" in generated_trace


def test_b058_operational_execution_edges_have_public_start_route(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))
    refresh_analysis(tmp_path, stage="test")

    enriched = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": "workspace",
            "jobs_considered": 1,
            "total_delta": 1.0,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "prepare_deployment_surface",
                    "delta": 1.0,
                    "failing": ["deployment_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "deployment surface has not been prepared",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config={},
        publish=False,
    )

    head = enriched["gaps"][0]
    assert head["triage"]["framework_layer"] == "execution"
    assert head["triage"]["reentry_layer"] == "execution"
    assert head["route_binding"]["state"] == "advance_fixed_vector"
    assert head["route_binding"]["selected_vector"] == "advance_operational_execution"


def _read_events(workspace_root: Path) -> list[dict]:
    events_path = workspace_root / ".ai-workspace" / "events" / "events.jsonl"
    return [
        json.loads(line)
        for line in events_path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def _prime_workspace_for_explicit_public_start(
    workspace_root: Path,
    app,
) -> dict[str, object]:
    published = gaps(app, scope="workspace")
    dossiers = published.get("dossiers") if isinstance(published, dict) else None
    if not isinstance(dossiers, list) or not dossiers:
        return published
    head = dossiers[0]
    if not isinstance(head, dict):
        return published
    proposal = head.get("constitutional_proposal")
    if not isinstance(proposal, dict):
        return published
    if str(proposal.get("state") or "") != "pending_fh":
        return published
    approved = apply_constitutional_proposal(
        workspace_root,
        edge=str(head.get("edge") or ""),
        proposal_id=str(proposal.get("proposal_id") or ""),
        actor="test",
    )
    assert approved["status"] == "applied"
    return gaps(app, scope="workspace")


def _goal_gap_payload(
    delta_summary: str = "goal surface remains insufficient under the current constitution",
    *,
    work_key: str | None = None,
) -> dict[str, object]:
    return {
        "scope": {},
        "jobs_considered": 1,
        "total_delta": 0.5,
        "open_frames": 0,
        "converged": False,
        "gaps": [
            {
                "edge": "derive_goal_surface",
                "delta": 0.5,
                "failing": ["goal_surface_semantically_converged"],
                "passing": [],
                "delta_summary": delta_summary,
                "environment_ready": True,
                "work_key": work_key,
            }
        ],
    }


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
    assert asset_path(tmp_path, "code_surface") == tmp_path / "build_tenants" / "python" / "code" / "odd_sdlc_proving_impl"
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
        tmp_path / "build_tenants" / "python" / "code" / "odd_sdlc_proving_impl" / "__init__.py"
    )


def test_workspace_assets_import_path_is_canonicalized_by_layer() -> None:
    code_root = ROOT / "build_tenants" / "python" / "code" / "odd_sdlc"
    tests_root = ROOT / "build_tenants" / "python" / "test_env" / "tests"

    code_files = sorted(code_root.rglob("*.py"))
    test_files = sorted(tests_root.rglob("*.py"))

    code_violations = [
        path.relative_to(ROOT).as_posix()
        for path in code_files
        if any(
            line.strip().startswith("from odd_sdlc.workspace_assets import")
            for line in path.read_text(encoding="utf-8").splitlines()
        )
    ]
    test_violations = [
        path.relative_to(ROOT).as_posix()
        for path in test_files
        if any(
            line.strip().startswith("from .workspace_assets import")
            for line in path.read_text(encoding="utf-8").splitlines()
        )
    ]

    assert code_violations == []
    assert test_violations == []


def test_domain_modules_do_not_import_abg_emit_directly() -> None:
    code_root = ROOT / "build_tenants" / "python" / "code" / "odd_sdlc"
    allowed_emit_import_paths = {
        "build_tenants/python/code/odd_sdlc/runtime_effects.py",
    }
    direct_emit_imports = []
    for path in sorted(code_root.rglob("*.py")):
        lines = [line.strip() for line in path.read_text(encoding="utf-8").splitlines()]
        rel = path.relative_to(ROOT).as_posix()
        if any(
            line.startswith("from genesis.events import") and "emit" in line
            for line in lines
        ):
            direct_emit_imports.append(rel)

    assert direct_emit_imports == sorted(allowed_emit_import_paths)


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
    expected_graph_function_names = ["bootstrap_release_self_test"]
    if "release_operational_cycle" in graph_function_names:
        expected_graph_function_names.append("release_operational_cycle")
    expected_graph_function_names.extend(
        [
            "review_subject_consensus_round",
            "review_subject_by_consensus",
            "review_design_consensus_round",
            "review_design_by_consensus",
            "review_comment_consensus_round",
            "review_comment_by_consensus",
            DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION,
            ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION,
        ]
    )
    assert graph_function_names == expected_graph_function_names
    input_signatures = {
        graph_function.name: [node.name for node in graph_function.inputs]
        for graph_function in module.graph_functions
    }
    expected_input_signatures = {
        "bootstrap_release_self_test": ["input_set"],
        "review_subject_consensus_round": ["subject_surface"],
        "review_subject_by_consensus": ["subject_surface"],
        "review_design_consensus_round": ["design_surface"],
        "review_design_by_consensus": ["design_surface"],
        "review_comment_consensus_round": ["comment_review_subject_surface"],
        "review_comment_by_consensus": ["comment_review_subject_surface"],
        DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION: ["work_request_surface"],
        ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION: ["execution_contract_surface"],
    }
    if "release_operational_cycle" in graph_function_names:
        expected_input_signatures["release_operational_cycle"] = [
            "release_surface",
            "test_run_archive_surface",
        ]
    assert input_signatures == expected_input_signatures
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
    shared_consensus_offset = 1
    if "release_operational_cycle" in graph_function_names:
        operational = module.graph_functions[1]
        assert operational.declarations.get("function_kind") == "odd_executive_graph_function"
        assert operational.declarations.get("intent") == RELEASE_OPERATIONAL_CYCLE_INTENT
        assert [node.name for node in operational.inputs] == ["release_surface", "test_run_archive_surface"]
        assert [node.name for node in operational.outputs] == ["retrofit_plan_surface"]
        assert [vector.name for vector in operational.materialize().vectors] == list(RELEASE_OPERATIONAL_CYCLE_STEPS)
        shared_consensus_offset = 2
    shared_consensus_round = module.graph_functions[shared_consensus_offset]
    assert shared_consensus_round.declarations.get("function_kind") == "odd_consensus_plugin_round_graph_function"
    assert shared_consensus_round.template.kind == "symbolic"
    assert [node.name for node in shared_consensus_round.inputs] == ["subject_surface"]
    assert [node.name for node in shared_consensus_round.outputs] == ["reviewed_subject_surface"]
    assert shared_consensus_round.declarations.get("plugin_kind") == "shared_consensus_plugin"
    assert shared_consensus_round.declarations.get("harness_implementation") == {
        "custom_functions": (
            "review_subject_assessment_round",
            "reduce_subject_consensus_decision",
            "apply_subject_consensus_decision",
        ),
        "policy_rule": "subject_consensus_rule",
    }
    shared_consensus_library = module.graph_functions[shared_consensus_offset + 1]
    assert shared_consensus_library.declarations.get("function_kind") == "odd_consensus_plugin_graph_function"
    assert shared_consensus_library.template.kind == "symbolic"
    assert [node.name for node in shared_consensus_library.inputs] == ["subject_surface"]
    assert [node.name for node in shared_consensus_library.outputs] == ["reviewed_subject_surface"]
    assert shared_consensus_library.declarations.get("plugin_kind") == "shared_consensus_plugin"
    assert "consensus" in shared_consensus_library.tags
    assert "plugin" in shared_consensus_library.tags
    consensus_round = module.graph_functions[shared_consensus_offset + 2]
    assert consensus_round.declarations.get("function_kind") == "odd_consensus_round_graph_function"
    assert consensus_round.template.kind == "inline_graph"
    assert [node.name for node in consensus_round.inputs] == ["design_surface"]
    assert [node.name for node in consensus_round.outputs] == ["reviewed_design_surface"]
    assert consensus_round.inputs[0].asset_surface.kind == "design_surface"
    assert consensus_round.outputs[0].asset_surface.kind == "reviewed_design_surface"
    assert consensus_round.declarations.get("host_binding_of") == "review_subject_consensus_round"
    assert [vector.name for vector in consensus_round.materialize().vectors] == [
        "derive_review_assessment_surface",
        "derive_consensus_decision_surface",
        "derive_reviewed_design_surface",
    ]
    consensus_library = module.graph_functions[shared_consensus_offset + 3]
    assert consensus_library.declarations.get("function_kind") == "odd_consensus_library_graph_function"
    assert consensus_library.template.kind == "symbolic"
    assert [node.name for node in consensus_library.inputs] == ["design_surface"]
    assert [node.name for node in consensus_library.outputs] == ["reviewed_design_surface"]
    assert "consensus" in consensus_library.tags
    assert "library" in consensus_library.tags
    assert consensus_library.declarations.get("host_binding_of") == "review_subject_by_consensus"
    assert consensus_library.declarations.get("recursion") is not None
    assert consensus_library.declarations.get("harness_implementation") == {
        "custom_functions": (
            "review_design_assessment_round",
            "reduce_design_consensus_decision",
            "apply_design_consensus_decision",
        ),
        "policy_rule": "design_consensus_rule",
    }
    comment_consensus_round = module.graph_functions[shared_consensus_offset + 4]
    assert comment_consensus_round.declarations.get("function_kind") == "odd_consensus_host_binding_round_graph_function"
    assert comment_consensus_round.template.kind == "symbolic"
    assert [node.name for node in comment_consensus_round.inputs] == ["comment_review_subject_surface"]
    assert [node.name for node in comment_consensus_round.outputs] == ["reviewed_comment_surface"]
    assert comment_consensus_round.declarations.get("host_binding_of") == "review_subject_consensus_round"
    comment_consensus_library = module.graph_functions[shared_consensus_offset + 5]
    assert comment_consensus_library.declarations.get("function_kind") == "odd_consensus_host_binding_graph_function"
    assert comment_consensus_library.template.kind == "symbolic"
    assert [node.name for node in comment_consensus_library.inputs] == ["comment_review_subject_surface"]
    assert [node.name for node in comment_consensus_library.outputs] == ["reviewed_comment_surface"]
    assert comment_consensus_library.declarations.get("host_binding_of") == "review_subject_by_consensus"
    derive_execution_contract = module.graph_functions[shared_consensus_offset + 6]
    assert derive_execution_contract.name == DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION
    assert derive_execution_contract.declarations.get("function_kind") == "odd_runtime_source_graph_function"
    assert derive_execution_contract.template.kind == "symbolic"
    assert derive_execution_contract.declarations.get("selection_visible") is False
    assert derive_execution_contract.declarations.get("carrier_asset") == "execution_contract_surface"
    assert derive_execution_contract.declarations.get("source_asset") == "work_request_surface"
    assert derive_execution_contract.declarations.get("transition_kind") == "derive"
    assert [node.name for node in derive_execution_contract.inputs] == ["work_request_surface"]
    assert [node.name for node in derive_execution_contract.outputs] == ["execution_contract_surface"]
    admit_execution_contract = module.graph_functions[shared_consensus_offset + 7]
    assert admit_execution_contract.name == ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION
    assert admit_execution_contract.declarations.get("function_kind") == "odd_runtime_source_graph_function"
    assert admit_execution_contract.template.kind == "symbolic"
    assert admit_execution_contract.declarations.get("selection_visible") is False
    assert admit_execution_contract.declarations.get("carrier_asset") == "execution_contract_surface"
    assert admit_execution_contract.declarations.get("source_asset") == "execution_contract_surface"
    assert admit_execution_contract.declarations.get("transition_kind") == "admit"
    assert [node.name for node in admit_execution_contract.inputs] == ["execution_contract_surface"]
    assert [node.name for node in admit_execution_contract.outputs] == ["execution_contract_surface"]
    expected_job_names = ["bootstrap_release_self_test_job"]
    if "release_operational_cycle" in graph_function_names:
        expected_job_names.append("release_operational_cycle_job")
    assert [job.name for job in module.jobs] == expected_job_names

    executable_jobs = module_to_executable_jobs(module)
    expected_executable_vector_names = list(BOOTSTRAP_RELEASE_SELF_TEST_STEPS)
    expected_executable_job_names = {"bootstrap_release_self_test_job"}
    if "release_operational_cycle" in graph_function_names:
        expected_executable_vector_names.extend(RELEASE_OPERATIONAL_CYCLE_STEPS)
        expected_executable_job_names.add("release_operational_cycle_job")
    assert len(executable_jobs) == len(expected_executable_vector_names)
    assert [job.vector.name for job in executable_jobs] == expected_executable_vector_names
    assert {job.job.name for job in executable_jobs} == expected_executable_job_names

    vectors = {vector.name: vector for vector in executive.materialize().vectors}
    requirement_context_names = [context.name for context in vectors["derive_requirement_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in requirement_context_names
    assert "odd_sdlc_requirement_closure_builder_context" in requirement_context_names
    assert "odd_sdlc_repair_frontier" in requirement_context_names
    assert "odd_sdlc_realization_iteration_digest" not in requirement_context_names
    realization_context_names = [context.name for context in vectors["derive_code_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in realization_context_names
    assert "odd_sdlc_repair_frontier" in realization_context_names
    assert "odd_sdlc_realization_iteration_digest" in realization_context_names
    assert "odd_sdlc_realization_deepening_control_frame" not in realization_context_names
    module_context_names = [context.name for context in vectors["derive_implementation_module_surface"].contexts]
    assert "odd_sdlc_repair_frontier" in module_context_names
    assert "odd_sdlc_realization_iteration_digest" in module_context_names
    assert "odd_sdlc_realization_deepening_control_frame" not in module_context_names
    test_design_context_names = [context.name for context in vectors["derive_test_design_surface"].contexts]
    assert "odd_sdlc_repair_frontier" in test_design_context_names
    assert "odd_sdlc_realization_iteration_digest" in test_design_context_names
    assert "odd_sdlc_realization_deepening_control_frame" not in test_design_context_names
    test_module_context_names = [context.name for context in vectors["derive_test_module_surface"].contexts]
    assert "odd_sdlc_repair_frontier" in test_module_context_names
    assert "odd_sdlc_realization_iteration_digest" in test_module_context_names
    assert "odd_sdlc_realization_deepening_control_frame" not in test_module_context_names
    archive_context_names = [context.name for context in vectors["derive_test_run_archive_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in archive_context_names
    assert "odd_sdlc_repair_frontier" in archive_context_names
    assert "odd_sdlc_test_lane_completeness" in archive_context_names
    assert "odd_sdlc_realization_iteration_digest" not in archive_context_names
    expected_executable_graph_function_names = {"bootstrap_release_self_test"}
    if "release_operational_cycle" in graph_function_names:
        expected_executable_graph_function_names.add("release_operational_cycle")
    assert {job.graph_function.name for job in executable_jobs} == expected_executable_graph_function_names


def test_module_build_does_not_publish_runtime_sidecars(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    runtime_paths = (
        tmp_path / STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH,
        tmp_path / TEST_LANE_COMPLETENESS_CONTEXT_PATH,
        tmp_path / REALIZATION_ITERATION_DIGEST_CONTEXT_PATH,
        tmp_path / REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH,
        tmp_path / REPAIR_FRONTIER_REGISTER_PATH,
        tmp_path / REPAIR_FRONTIER_CONTEXT_PATH,
    )
    assert all(not path.exists() for path in runtime_paths)

    odd_sdlc_module(tmp_path)

    assert all(not path.exists() for path in runtime_paths)


def test_constructive_vectors_consume_repair_frontier_context(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    module = odd_sdlc_module(tmp_path)
    vectors = {
        vector.name: vector
        for vector in module.graph_functions[0].materialize().vectors
    }

    requirement_context_names = [context.name for context in vectors["derive_requirement_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in requirement_context_names
    assert "odd_sdlc_requirement_closure_builder_context" in requirement_context_names
    assert "odd_sdlc_repair_frontier" in requirement_context_names
    assert "odd_sdlc_realization_iteration_digest" not in requirement_context_names

    code_context_names = [context.name for context in vectors["derive_code_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in code_context_names
    assert "odd_sdlc_repair_frontier" in code_context_names
    assert "odd_sdlc_realization_iteration_digest" in code_context_names
    assert "odd_sdlc_realization_deepening_control_frame" not in code_context_names

    module_context_names = [context.name for context in vectors["derive_implementation_module_surface"].contexts]
    assert "odd_sdlc_repair_frontier" in module_context_names
    assert "odd_sdlc_realization_iteration_digest" in module_context_names
    assert "odd_sdlc_realization_deepening_control_frame" not in module_context_names

    test_design_context_names = [context.name for context in vectors["derive_test_design_surface"].contexts]
    assert "odd_sdlc_repair_frontier" in test_design_context_names
    assert "odd_sdlc_realization_iteration_digest" in test_design_context_names
    assert "odd_sdlc_realization_deepening_control_frame" not in test_design_context_names

    test_module_context_names = [context.name for context in vectors["derive_test_module_surface"].contexts]
    assert "odd_sdlc_repair_frontier" in test_module_context_names
    assert "odd_sdlc_realization_iteration_digest" in test_module_context_names
    assert "odd_sdlc_realization_deepening_control_frame" not in test_module_context_names

    archive_context_names = [context.name for context in vectors["derive_test_run_archive_surface"].contexts]
    assert "odd_sdlc_stateful_builder_control_frame" in archive_context_names
    assert "odd_sdlc_repair_frontier" in archive_context_names
    assert "odd_sdlc_test_lane_completeness" in archive_context_names
    assert "odd_sdlc_realization_iteration_digest" not in archive_context_names


def test_refresh_analysis_publishes_realization_iteration_digest_context(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    manifest_path, result_path = _seed_fp_iteration_artifacts(
        tmp_path,
        edge_id="derive_code_surface",
    )
    manifest_digest = "sha256:" + hashlib.sha256(
        manifest_path.read_text(encoding="utf-8").encode("utf-8")
    ).hexdigest()
    result_digest = "sha256:" + hashlib.sha256(
        result_path.read_text(encoding="utf-8").encode("utf-8")
    ).hexdigest()

    refresh_analysis(tmp_path, stage="test")

    context_path = tmp_path / REALIZATION_ITERATION_DIGEST_CONTEXT_PATH
    assert context_path.exists()
    context = context_path.read_text(encoding="utf-8")
    assert "# odd_sdlc Realization Iteration Continuity Digest" in context
    assert "## `derive_code_surface`" in context
    assert f"- latest_manifest_path: {manifest_path.as_posix()}" in context
    assert f"- latest_manifest_digest: {manifest_digest}" in context
    assert f"- latest_result_path: {result_path.as_posix()}" in context
    assert f"- latest_result_digest: {result_digest}" in context
    assert "## `derive_test_module_surface`" in context
    assert "- no_prior_turn_published: true" in context


def test_code_edge_prompt_uses_neutral_repair_frontier_context(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    manifest_path, result_path = _seed_fp_iteration_artifacts(
        tmp_path,
        edge_id="derive_code_surface",
    )
    manifest_digest = "sha256:" + hashlib.sha256(
        manifest_path.read_text(encoding="utf-8").encode("utf-8")
    ).hexdigest()
    result_digest = "sha256:" + hashlib.sha256(
        result_path.read_text(encoding="utf-8").encode("utf-8")
    ).hexdigest()
    refresh_analysis(tmp_path, stage="test")
    module = odd_sdlc_module(tmp_path)
    _admit_ordinary_execution_contract(tmp_path, module)
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
    assert "odd_sdlc_repair_frontier" in relevant_contexts
    assert "odd_sdlc_realization_iteration_digest" in relevant_contexts
    digest_context = str(relevant_contexts["odd_sdlc_realization_iteration_digest"])
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

    prompt_assembly = _assemble_prompt(
        pre,
        code_job,
        result_path=".ai-workspace/fp_results/mock.json",
        workspace_root=tmp_path,
    )
    prompt = prompt_assembly.prompt

    assert "# odd_sdlc Deterministic Repair Frontier" in prompt
    assert "# odd_sdlc Realization Iteration Continuity Digest" in digest_context
    assert f"- latest_manifest_path: {manifest_path.as_posix()}" in digest_context
    assert f"- latest_manifest_digest: {manifest_digest}" in digest_context
    assert f"- latest_result_path: {result_path.as_posix()}" in digest_context
    assert f"- latest_result_digest: {result_digest}" in digest_context
    assert "# odd_sdlc Realization Iteration Continuity Digest" in prompt
    assert manifest_path.as_posix() in prompt
    assert manifest_digest in prompt
    assert result_path.as_posix() in prompt
    assert result_digest in prompt
    assert "## Code Frontier" in prompt
    assert "lawful edit frontier" in prompt
    assert "current governance truth" in prompt
    assert "without prescribing builder strategy" in prompt
    assert "## Global Law" not in prompt
    assert "Prefer deepening or correcting existing artifacts" in prompt


def test_bootstrap_asset_publication_shares_generated_asset_contract_with_fd_certification(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)

    published_asset = next(
        asset
        for asset in bootstrap_assets(tmp_path)
        if asset.asset_id == "test_module_surface"
    )
    attestation = assess_generated_asset_contract(tmp_path, "test_module_surface")

    assert published_asset.generated_asset_contract == attestation["contract"]
    assert published_asset.generated_asset_contract is not None
    assert (
        published_asset.generated_asset_contract["marker_text"]
        == asset_marker("test_module_surface")
    )


def test_probabilistic_prompt_uses_published_generated_asset_contract_for_target_asset(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    module = odd_sdlc_module(tmp_path)
    job = next(
        candidate
        for candidate in module_to_executable_jobs(module)
        if candidate.vector.name == "derive_test_module_surface"
    )
    evaluator = next(ev for ev in job.vector.evaluators if ev.name == "test_module_surface_semantically_converged")
    published_asset = next(
        asset
        for asset in bootstrap_assets(tmp_path)
        if asset.asset_id == "test_module_surface"
    )
    checkpoint = published_asset.checkpoint
    assert checkpoint is not None
    target_binding = TargetAssetBinding(
        asset_id=published_asset.asset_id,
        uri=published_asset.uri,
        relative_path=str(published_asset.metadata["relative_path"]),
        path_kind=checkpoint.path_kind,
        exists=checkpoint.exists,
        generated_asset_contract=published_asset.generated_asset_contract,
    )
    pre = SimpleNamespace(
        current_asset={},
        failing_evaluators=[evaluator],
        fd_results={},
        relevant_contexts={},
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

    prompt_assembly = _assemble_prompt(
        pre,
        job,
        result_path=".ai-workspace/fp_results/mock.json",
        workspace_root=tmp_path,
        target_binding=target_binding,
    )
    prompt = prompt_assembly.prompt

    assert "[GENERATED ASSET CONTRACT]" in prompt
    assert asset_marker("test_module_surface") in prompt
    assert "marker_path: build_tenants/python/test_env/tests/40-generated-test-modules.md" in prompt
    assert "heading_prefix: # Generated Test Modules" in prompt


def test_refresh_analysis_publishes_deterministic_repair_frontier(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")

    register = json.loads((tmp_path / REPAIR_FRONTIER_REGISTER_PATH).read_text(encoding="utf-8"))
    context = (tmp_path / REPAIR_FRONTIER_CONTEXT_PATH).read_text(encoding="utf-8")

    assert register["repair_frontier_kind"] == "odd_sdlc.repair_frontier"
    assert register["summary"]["frontier_count"] == 4
    assert sorted(register["frontiers"].keys()) == ["code", "design", "requirements", "test"]
    assert register["frontiers"]["code"]["target_asset"] == "code_surface"
    assert "lawful_edit_frontier" in register["frontiers"]["code"]
    assert "lawful_proof_frontier" in register["frontiers"]["code"]
    assert "widening_conditions" not in register["frontiers"]["code"]
    assert "# odd_sdlc Deterministic Repair Frontier" in context
    assert "## Code Frontier" in context
    assert "lawful edit frontier" in context
    assert "widening conditions" not in context
    assert "## Global Law" not in context


def test_refresh_analysis_does_not_publish_replacement_strategy_surface(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")

    requirement_context = (
        tmp_path / REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH
    ).read_text(encoding="utf-8").lower()
    repair_context = (
        tmp_path / REPAIR_FRONTIER_CONTEXT_PATH
    ).read_text(encoding="utf-8").lower()

    for banned in (
        "retry budget",
        "turn counter",
        "gain rule",
        "depth score",
        "builder-facing",
        "## builder law",
    ):
        assert banned not in requirement_context
        assert banned not in repair_context


def test_feature_decomp_declared_requirement_gap_uses_requirement_edge_ledger(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    feature_decomp_path = asset_path(tmp_path, "feature_decomp_surface")
    feature_decomp_path.parent.mkdir(parents=True, exist_ok=True)
    feature_decomp_path.write_text(
        "\n".join(
            (
                "# Generated Feature Decomposition",
                "",
                asset_marker("feature_decomp_surface"),
                "",
                "- REQ-DEMO-001: preserve installability as a named feature family.",
                "",
            )
        ),
        encoding="utf-8",
    )

    gap = declared_requirement_edge_gap(
        tmp_path,
        {
            "adapter_ref": "odd_sdlc.requirement_closure:declared_requirement_edge_gap",
            "obligation_source_ref": "requirement_surface",
            "obligation_source_kind": "requirement_surface",
            "obligation_source_admission_basis": "authority_or_current_surface",
            "obligation_kind": "requirement",
            "derivation_rule": "identity",
            "carry_rule": "deterministic_requirement_membership",
            "fulfillment_rule": "feature_decomp_surface_coverage",
            "evidence_policy": "feature_decomp_traceability",
        },
        edge_name="derive_feature_decomp_surface",
    )

    assert gap["edge"] == "derive_feature_decomp_surface"
    assert gap["expected_count"] == 2
    assert gap["carried_count"] == 1
    assert gap["fulfilled_count"] == 1
    assert gap["missing_count"] == 1
    assert gap["extra_count"] == 0
    assert gap["carry_converged"] is False
    assert gap["fulfillment_converged"] is True
    assert gap["edge_converged"] is False
    assert gap["blocking_reasons"] == ["missing_from_edge_obligation_set"]
    obligations = {entry["id"]: entry for entry in gap["obligations"]}
    assert obligations["REQ-DEMO-001"]["evidence_refs"] == [
        resolved_asset_relative_path(tmp_path, "feature_decomp_surface")
    ]
    blocking = {entry["id"]: entry for entry in gap["blocking_obligations"]}
    assert blocking["REQ-DEMO-002"]["carry_status"] == "missing"
    assert blocking["REQ-DEMO-002"]["fulfillment_status"] == "unassessed"
    assert blocking["REQ-DEMO-002"]["blocking_reasons"] == ["missing_from_edge_obligation_set"]


def test_gaps_keep_design_producer_open_when_generated_target_contract_is_invalid(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    requirement_surface = asset_materialization_path(tmp_path, "requirement_surface")
    requirement_surface.parent.mkdir(parents=True, exist_ok=True)
    requirement_surface.write_text(
        "\n".join(
            (
                "# Generated Bootstrap Requirements",
                "",
                "- REQ-DEMO-001: preserve installability as a named feature family.",
                "- REQ-DEMO-002: preserve attributable and resettable turns.",
                "",
            )
        ),
        encoding="utf-8",
    )
    feature_decomp_surface = asset_materialization_path(tmp_path, "feature_decomp_surface")
    feature_decomp_surface.parent.mkdir(parents=True, exist_ok=True)
    feature_decomp_surface.write_text(
        "\n".join(
            (
                "# Generated Feature Decomposition",
                "",
                asset_marker("feature_decomp_surface"),
                "",
                "- REQ-DEMO-001: preserve installability as a named feature family.",
                "- REQ-DEMO-002: preserve attributable and resettable turns.",
                "",
            )
        ),
        encoding="utf-8",
    )
    design_surface = asset_materialization_path(tmp_path, "design_surface")
    design_surface.parent.mkdir(parents=True, exist_ok=True)
    design_surface.write_text(
        "\n".join(
            (
                "# Draft Design Notes",
                "",
                "- intentionally missing governed marker",
                "",
            )
        ),
        encoding="utf-8",
    )

    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = gaps(
        app,
        from_edge="derive_design_surface",
        to_edge="derive_scenario_surface",
        zoom="combined",
    )

    by_edge = {gap["edge"]: gap for gap in payload["gaps"]}
    assert "derive_design_surface" in by_edge
    assert by_edge["derive_design_surface"]["gap_kind"] == "declared_obligation_edge_gap"
    assert by_edge["derive_design_surface"]["edge_converged"] is False
    assert by_edge["derive_design_surface"]["graph_delta"] > 0.0
    assert "design_dependency_surfaces_present" in by_edge["derive_design_surface"]["graph_failing"]


def test_query_domain_is_read_only_when_analysis_has_not_been_published(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))
    before_events = list(app.stream.all_events())
    payload = query_domain(app)
    after_events = list(app.stream.all_events())

    assert payload["ambiguity_register"]["register_kind"] == "odd_sdlc.ambiguity_register"
    assert payload["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert payload["requirement_closure_register"]["published"] is False
    assert payload["requirement_closure_register"]["unavailable_reason"] == "workspace_state_unpublished"
    assert payload["requirement_closure_register"]["requirements"] == []
    assert payload["gap_dossier"]["published"] is False
    assert payload["gap_dossier"]["unavailable_reason"] == "workspace_state_unpublished"
    assert payload["gap_dossier"]["analysis_current"] is False
    assert payload["gap_dossier"]["analysis_manifest"] is None
    assert payload["gap_dossier"]["dossiers"] == []
    assert before_events == after_events
    assert not (tmp_path / CURRENT_TRIAGE_DIR).exists()
    assert not (tmp_path / STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH).exists()
    assert not (tmp_path / REALIZATION_ITERATION_DIGEST_CONTEXT_PATH).exists()
    assert not (tmp_path / REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH).exists()


def test_query_domain_publishes_triaged_work_item_assets_with_published_route_contract(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(tmp_path, ticket_id="B-900")

    payload = query_domain(initialize(bootstrap(workspace_root=tmp_path)))

    assets = {asset["asset_id"]: asset for asset in payload["assets"]}
    assert "ticket/B-900" in assets
    assert assets["ticket/B-900"]["declared_type"] == "work_request_surface"
    assert assets["ticket/B-900"]["metadata"]["re_entry_point"] == "requirements"

    asset_ownership = {entry["handle"]: entry for entry in payload["asset_ownership_index"]}
    assert asset_ownership["ticket/B-900"]["operator_target"]["handle"] == "bootstrap_release_self_test"
    assert asset_ownership["ticket/B-900"]["route_contract"]["reentry_vector"] == "derive_requirement_surface"
    assert asset_ownership["ticket/B-900"]["route_contract"]["binding_source"] == "odd_sdlc.work_item_route_contract"


def test_query_domain_keeps_backlog_ticket_visible_but_not_start_addressable(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(tmp_path, ticket_id="B-901", status="backlog")

    payload = query_domain(initialize(bootstrap(workspace_root=tmp_path)))

    assets = {asset["asset_id"]: asset for asset in payload["assets"]}
    assert "ticket/B-901" in assets
    assert assets["ticket/B-901"]["declared_type"] == "work_request_surface"
    assert assets["ticket/B-901"]["metadata"]["ticket_status"] == "backlog"
    assert "route_kind" not in assets["ticket/B-901"]["metadata"]

    asset_ownership = {entry["handle"]: entry for entry in payload["asset_ownership_index"]}
    assert "ticket/B-901" not in asset_ownership


def test_start_requires_published_gap_dossier_for_public_next(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))
    calls: list[tuple[object, object]] = []

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    with pytest.raises(RuntimeError, match="analysis has not been published"):
        start(
            app,
            scope="workspace",
            target="next",
            until="first_traversal",
        )
    assert calls == []

    refresh_analysis(tmp_path, stage="test")
    second = start(app, scope="workspace", target="next", until="first_traversal")
    assert second["status"] == "pending"
    assert second["blocking_reason"] == "published_gap_dossier_unavailable"
    assert second["stopped_by"] == "published_gap_dossier"
    assert second["unavailable_reason"] == "gap_dossier_unpublished"
    assert calls == []

    published_gaps = gaps(app, scope="workspace")
    assert published_gaps["published"] is True
    result = start(app, scope="workspace", target="next", until="first_traversal")

    assert result["status"] == "pending"
    assert result["blocking_reason"] == "fh_gate"
    assert result["fh_mode"] == "direct"
    assert result["root_mode"] == "direct"
    assert len(calls) == 0


@pytest.mark.parametrize(
    "target",
    [
        "graph_function:bootstrap_release_self_test",
        "asset:reviewed_design_surface",
    ],
)
def test_explicit_public_start_requires_published_gap_dossier_before_admission(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    target: str,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    def _should_not_admit(*args: object, **kwargs: object) -> dict[str, object]:
        raise AssertionError("explicit public start must not admit before the published gap carrier exists")

    def _should_not_start(*args: object, **kwargs: object) -> dict[str, object]:
        raise AssertionError("explicit public start must not dispatch before the published gap carrier exists")

    monkeypatch.setattr(app_module, "admit_bound_execution_start", _should_not_admit)
    monkeypatch.setattr(app_module, "gen_start", _should_not_start)

    result = start(
        app,
        scope="workspace",
        target=target,
        until="first_traversal",
    )

    assert result["status"] == "pending"
    assert result["target"] == target
    assert result["blocking_reason"] == "published_gap_dossier_unavailable"
    assert result["stopped_by"] == "published_gap_dossier"
    assert result["unavailable_reason"] == "gap_dossier_unpublished"
    assert not (tmp_path / EXECUTION_CONTRACT_REGISTER_PATH).exists()


def test_start_next_stops_before_execution_contract_when_head_gap_is_pending_constitutional_fh(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    def _should_not_start(*args: object, **kwargs: object) -> dict[str, object]:
        raise AssertionError("gen_start must not run while the head edge is pending_fh")

    monkeypatch.setattr(app_module, "gen_start", _should_not_start)
    published_gaps = gaps(app, scope="workspace")
    head = published_gaps["dossiers"][0]

    result = start(app, scope="workspace", target="next", until="first_traversal")

    assert result["status"] == "pending"
    assert result["target"] == "next"
    assert result["edge"] == "derive_intent_surface"
    assert result["blocking_reason"] == "fh_gate"
    assert result["stop_predicate"] == "human_gate_required"
    assert result["stopped_by"] == "fh_gate"
    assert result["fh_gate"]["evaluators"] == ["constitutional_pending_fh"]
    assert result["constitutional_proposal"]["proposal_id"] == head["constitutional_proposal"]["proposal_id"]
    assert result["constitutional_proposal"]["state"] == "pending_fh"
    assert result["route_binding"]["state"] == "await_fh_resolution"
    assert result["triage_artifact_path"] == head["evidence_bundle_refs"]["current_triage_artifact_path"]
    assert result["fh_mode"] == "direct"
    assert result["root_mode"] == "direct"
    assert not (tmp_path / EXECUTION_CONTRACT_REGISTER_PATH).exists()

    event_types = [event["event_type"] for event in _read_events(tmp_path)]
    assert "fh_gate_pending" in event_types
    assert "execution_contract_drafted" not in event_types
    assert "execution_contract_admitted" not in event_types
    assert "run_bound" not in event_types
    assert "worker_turn_started" not in event_types
    assert "fp_dispatched" not in event_types


def test_start_next_admits_execution_contract_from_published_head_gap_route(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    calls: list[tuple[object, object]] = []

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    initial_gaps = gaps(app, scope="workspace")
    proposal_id = initial_gaps["dossiers"][0]["constitutional_proposal"]["proposal_id"]
    assert proposal_id

    approved = apply_constitutional_proposal(
        tmp_path,
        edge="derive_intent_surface",
        proposal_id=proposal_id,
        actor="human",
    )
    assert approved["status"] == "applied"

    refreshed_gaps = gaps(app, scope="workspace")
    assert refreshed_gaps["dossiers"][0]["route_binding"]["state"] == "constitutional_reprice_approved"
    assert refreshed_gaps["dossiers"][0]["constitutional_proposal"]["proposal_id"] == proposal_id

    result = start(app, scope="workspace", target="next", until="first_traversal")

    assert result["status"] == "ok"
    assert result["target"] == "next"
    assert result["resolved_edge"] == "derive_intent_surface"
    assert result["fh_mode"] == "direct"
    assert result["root_mode"] == "direct"
    assert len(calls) == 1
    assert calls[0][0].target.kind == "next"
    assert calls[0][0].scope.diagnostic_edge_override == "derive_intent_surface"
    execution_contract = json.loads(
        (tmp_path / EXECUTION_CONTRACT_REGISTER_PATH).read_text(encoding="utf-8")
    )
    assert execution_contract["target_truth"]["kind"] == "next"
    assert execution_contract["target_truth"]["public_target"] == "next"
    assert execution_contract["target_truth"]["edge_override"] == "derive_intent_surface"
    assert execution_contract["target_truth"]["route_state"] == "constitutional_reprice_approved"
    assert execution_contract["target_truth"]["binding_source"] == "odd_sdlc.gap_dossier_register"


def test_start_next_human_proxy_auto_applies_constitutional_gate_and_advances(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    initial_gaps = gaps(app, scope="workspace")
    assert initial_gaps["dossiers"][0]["constitutional_proposal"]["state"] == "pending_fh"
    calls: list[tuple[object, object]] = []

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "converged", "edge": "derive_intent_surface"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    result = start(
        app,
        scope="workspace",
        target="next",
        until="converged",
        fh_mode="human-proxy",
    )

    assert result["status"] == "converged"
    assert result["target"] == "next"
    assert result["resolved_edge"] == "derive_intent_surface"
    assert len(calls) == 1
    assert calls[0][0].target.kind == "next"
    assert calls[0][0].scope.diagnostic_edge_override == "derive_intent_surface"

    events = _read_events(tmp_path)
    event_types = [event["event_type"] for event in events]
    assert "fh_gate_pending" in event_types
    assert "constitutional_proposal_approved_with_edits" in event_types
    assert "proposal_applied" in event_types
    assert not any(
        event["event_type"] == "approved"
        and event.get("data", {}).get("kind") == "fh_review"
        for event in events
    )


def test_b051_valid_imported_intent_carries_forward_without_first_run_fh_gate(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    workspace = tmp_path / "b051_valid_imported_intent"
    _seed_data_mapper_template_workspace(workspace)
    normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    refresh_analysis(workspace, stage="test")
    bootstrap_text = (workspace / ".ai-workspace" / "context" / "project_bootstrap.md").read_text(
        encoding="utf-8"
    )
    assert "- authoritative project title: `Categorical Data Mapping & Computation Engine (CDME)`" in bootstrap_text
    assert "- identity source: `specification/INTENT.md`" in bootstrap_text
    workspace_state = json.loads(
        (workspace / ".ai-workspace" / "runtime" / "odd_sdlc-workspace-state.json").read_text(encoding="utf-8")
    )
    carry_forward = workspace_state["imported_intent_carry_forward"]
    assert carry_forward["authoritative"] is True
    assert carry_forward["identity_source"] == "specification/INTENT.md"

    app = initialize(
        bootstrap(
            workspace_root=workspace,
            runtime_config={"constitutional_repricing": {"mode": "fh_gate"}},
        )
    )
    calls: list[tuple[object, object]] = []

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    published = gaps(app, scope="workspace")
    head = published["dossiers"][0]
    assert head["edge"] == "derive_intent_surface"
    assert head["route_binding"]["state"] == "advance_fixed_vector"
    assert head["constitutional_proposal"] is None

    result = start(app, scope="workspace", target="next", until="first_traversal")

    assert result["status"] == "ok"
    assert result["resolved_edge"] == "derive_intent_surface"
    assert len(calls) == 1
    execution_contract = json.loads(
        (workspace / EXECUTION_CONTRACT_REGISTER_PATH).read_text(encoding="utf-8")
    )
    assert execution_contract["target_truth"]["route_state"] == "advance_fixed_vector"
    event_types = [event["event_type"] for event in _read_events(workspace)]
    assert "fh_gate_pending" not in event_types
    assert "execution_contract_admitted" in event_types


def test_b051_malformed_imported_intent_still_requires_constitutional_gate(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    workspace = tmp_path / "b051_malformed_imported_intent"
    _seed_data_mapper_template_workspace(workspace)
    _invalidate_imported_intent_surface(workspace)
    normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    refresh_analysis(workspace, stage="test")
    bootstrap_text = (workspace / ".ai-workspace" / "context" / "project_bootstrap.md").read_text(
        encoding="utf-8"
    )
    assert "authoritative project title: not confidently determined from imported authority" in bootstrap_text
    workspace_state = json.loads(
        (workspace / ".ai-workspace" / "runtime" / "odd_sdlc-workspace-state.json").read_text(encoding="utf-8")
    )
    carry_forward = workspace_state["imported_intent_carry_forward"]
    assert carry_forward["authoritative"] is False
    assert carry_forward["reason"] == "intent_surface_present_without_project_identity"

    app = initialize(
        bootstrap(
            workspace_root=workspace,
            runtime_config={"constitutional_repricing": {"mode": "fh_gate"}},
        )
    )

    def _should_not_start(*args: object, **kwargs: object) -> dict[str, object]:
        raise AssertionError("gen_start must not run while malformed imported intent remains pending_fh")

    monkeypatch.setattr(app_module, "gen_start", _should_not_start)

    published = gaps(app, scope="workspace")
    head = published["dossiers"][0]
    assert head["edge"] == "derive_intent_surface"
    assert head["constitutional_proposal"]["state"] == "pending_fh"
    assert head["route_binding"]["state"] == "await_fh_resolution"

    result = start(app, scope="workspace", target="next", until="first_traversal")

    assert result["status"] == "pending"
    assert result["blocking_reason"] == "fh_gate"
    assert result["constitutional_proposal"]["state"] == "pending_fh"
    assert result["route_binding"]["state"] == "await_fh_resolution"


def test_b051_applied_constitutional_proposal_clears_public_pending_gate(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    workspace = tmp_path / "b051_replayed_constitutional_resolution"
    _seed_data_mapper_template_workspace(workspace)
    _invalidate_imported_intent_surface(workspace)
    normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    refresh_analysis(workspace, stage="test")
    app = initialize(
        bootstrap(
            workspace_root=workspace,
            runtime_config={"constitutional_repricing": {"mode": "fh_gate"}},
        )
    )
    calls: list[tuple[object, object]] = []

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    initial = gaps(app, scope="workspace")
    proposal = initial["dossiers"][0]["constitutional_proposal"]
    approved = apply_constitutional_proposal(
        workspace,
        edge="derive_intent_surface",
        proposal_id=proposal["proposal_id"],
        actor="test",
    )
    assert approved["status"] == "applied"

    refreshed = gaps(app, scope="workspace")
    head = refreshed["dossiers"][0]
    assert head["route_binding"]["state"] == "constitutional_reprice_approved"
    assert head["constitutional_proposal"]["state"] == "approve_with_edits"

    result = start(app, scope="workspace", target="next", until="first_traversal")

    assert result["status"] == "ok"
    assert result["resolved_edge"] == "derive_intent_surface"
    assert len(calls) == 1
    event_types = [event["event_type"] for event in _read_events(workspace)]
    assert "proposal_applied" in event_types


def test_continue_with_result_publishes_workspace_gap_surface_and_uses_published_status(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))
    published_selectors: list[object] = []

    monkeypatch.setattr(
        continuation_module,
        "ingest_fp_result",
        lambda result_path, workspace_root: {
            "status": "ok",
            "result_path": str(result_path),
            "workspace_root": str(workspace_root),
        },
    )
    monkeypatch.setattr(
        continuation_module,
        "refresh_analysis",
        lambda workspace_root, stage: {
            "ready": True,
            "stage": stage,
            "workspace_root": str(workspace_root),
        },
    )

    def _fake_publish_gap_surface(_app, *, selector):
        published_selectors.append(selector)
        return {
            "published": True,
            "scope": "workspace",
            "converged": False,
            "gap_dossier_register_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.json",
        }

    monkeypatch.setattr(continuation_module, "publish_gap_surface", _fake_publish_gap_surface)
    monkeypatch.setattr(
        continuation_module,
        "active_programs",
        lambda _app: [{"name": "bootstrap_release_self_test"}],
    )

    payload = continue_with_result(app, result_path=tmp_path / "result.json")

    assert payload["status"] == "continued"
    assert payload["analysis"]["stage"] == "result_admission"
    assert payload["gap_snapshot"]["published"] is True
    assert payload["gap_snapshot"]["scope"] == "workspace"
    assert payload["active_programs"] == [{"name": "bootstrap_release_self_test"}]
    assert len(published_selectors) == 1
    assert getattr(published_selectors[0], "kind", None) == "workspace"


def test_start_next_work_key_scope_uses_scoped_gap_surface_not_workspace_head(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    calls: list[tuple[object, object]] = []

    def _fake_load_gap_dossier_read_model(_workspace_root: Path, *, scope=None) -> dict[str, object]:
        if getattr(scope, "kind", None) == "work_key":
            assert scope.work_key == "demo"
            return {
                "published": True,
                "scope": "work_key:demo",
                "summary": {"gap_count": 1},
                "gap_dossier_register_path": ".ai-workspace/runtime/scoped_gap_dossiers/odd_sdlc-gap-dossiers.work-key-demo.demo.json",
                "gap_dossier_context_path": ".ai-workspace/runtime/scoped_gap_dossiers/odd_sdlc-gap-dossiers.work-key-demo.demo.md",
                "dossiers": [
                    {
                        "edge": "derive_product_surface",
                        "route_binding": {"state": "constitutional_reprice_approved"},
                        "constitutional_proposal": {
                            "proposal_id": "const-work",
                            "proposal_kind": "product_reprice",
                            "state": "approve_with_edits",
                            "target_surface": "specification/PRODUCT.md",
                        },
                        "evidence_bundle_refs": {
                            "current_triage_artifact_path": ".ai-workspace/runtime/triage/derive_product_surface.json",
                        },
                    }
                ],
            }
        return {
            "published": True,
            "scope": "workspace",
            "summary": {"gap_count": 1},
            "gap_dossier_register_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.json",
            "gap_dossier_context_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.md",
            "dossiers": [
                {
                    "edge": "derive_intent_surface",
                    "route_binding": {"state": "await_fh_resolution"},
                    "constitutional_proposal": {
                        "proposal_id": "const-workspace",
                        "proposal_kind": "intent_reprice",
                        "state": "pending_fh",
                        "target_surface": "specification/INTENT.md",
                    },
                    "evidence_bundle_refs": {
                        "current_triage_artifact_path": ".ai-workspace/runtime/triage/derive_intent_surface.json",
                    },
                }
            ],
        }

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok", "edge": intent.scope.diagnostic_edge_override}

    monkeypatch.setattr(app_module, "load_gap_dossier_read_model", _fake_load_gap_dossier_read_model)
    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    result = start(
        app,
        scope="work_key:demo",
        target="next",
        until="first_traversal",
    )

    assert result["status"] == "ok"
    assert result["target"] == "next"
    assert result["resolved_edge"] == "derive_product_surface"
    assert len(calls) == 1
    assert calls[0][0].scope.selector.work_key == "demo"
    assert calls[0][0].scope.diagnostic_edge_override == "derive_product_surface"


def test_work_key_gap_publication_does_not_overwrite_workspace_gap_dossier_truth(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    def _fake_gen_gaps(scope, _stream) -> dict[str, object]:
        if scope.selector.kind == "work_key":
            return {
                "scope": "work_key:demo",
                "jobs_considered": 1,
                "total_delta": 0.5,
                "open_frames": 0,
                "converged": False,
                "gaps": [
                    {
                        "edge": "derive_product_surface",
                        "delta": 0.5,
                        "failing": ["product_surface_semantically_converged"],
                        "passing": [],
                        "delta_summary": "scoped product surface remains insufficient",
                        "environment_ready": True,
                        "work_key": "demo",
                    }
                ],
            }
        return {
            "scope": "workspace",
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_intent_surface",
                    "delta": 0.5,
                    "failing": ["intent_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "workspace intent surface remains insufficient",
                    "environment_ready": True,
                    "work_key": None,
                }
            ],
        }

    def _fake_declared_obligation_specs(_app):
        return [
            ("derive_intent_surface", {}),
            ("derive_product_surface", {}),
        ]

    def _should_not_start(*args: object, **kwargs: object) -> dict[str, object]:
        raise AssertionError("workspace start(next) must still stop on the workspace constitutional head gate")

    monkeypatch.setattr(app_module, "gen_gaps", _fake_gen_gaps)
    monkeypatch.setattr(app_module, "declared_obligation_specs", _fake_declared_obligation_specs)
    monkeypatch.setattr(app_module, "collect_declared_obligation_gaps", lambda *_args, **_kwargs: [])
    monkeypatch.setattr(app_module, "gen_start", _should_not_start)

    workspace_payload = gaps(app, scope="workspace")
    work_payload = gaps(app, scope="work_key:demo")
    workspace_read_model = load_gap_dossier_read_model(tmp_path, scope="workspace")
    work_read_model = load_gap_dossier_read_model(tmp_path, scope="work_key:demo")
    queried = query_domain(app)
    workspace_start = start(app, scope="workspace", target="next", until="first_traversal")

    assert workspace_payload["scope"] == "workspace"
    assert workspace_payload["dossiers"][0]["edge"] == "derive_intent_surface"
    assert work_payload["scope"] == "work_key:demo"
    assert work_payload["dossiers"][0]["edge"] == "derive_product_surface"
    assert work_payload["gap_dossier_register_path"] != workspace_payload["gap_dossier_register_path"]
    assert work_payload["gap_dossier_register_path"] is not None
    assert workspace_payload["gap_dossier_register_path"] == GAP_DOSSIER_REGISTER_PATH.as_posix()
    assert workspace_read_model["scope"] == "workspace"
    assert workspace_read_model["dossiers"][0]["edge"] == "derive_intent_surface"
    assert work_read_model["scope"] == "work_key:demo"
    assert work_read_model["dossiers"][0]["edge"] == "derive_product_surface"
    assert queried["gap_dossier"]["scope"] == "workspace"
    assert queried["gap_dossier"]["dossiers"][0]["edge"] == "derive_intent_surface"
    assert workspace_start["blocking_reason"] == "fh_gate"
    assert workspace_start["edge"] == "derive_intent_surface"


def test_start_next_until_blocked_reacquires_published_head_gap_between_traversals(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    published_surfaces = iter(
        (
            {
                "published": True,
                "converged": False,
                "summary": {"gap_count": 1},
                "gap_dossier_register_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.json",
                "gap_dossier_context_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.md",
                "dossiers": [
                    {
                        "edge": "derive_intent_surface",
                        "route_binding": {"state": "constitutional_reprice_approved"},
                        "constitutional_proposal": {
                            "proposal_id": "const-intent",
                            "proposal_kind": "intent_reprice",
                            "state": "approved",
                            "target_surface": "specification/INTENT.md",
                        },
                        "evidence_bundle_refs": {
                            "current_triage_artifact_path": ".ai-workspace/runtime/triage/derive_intent_surface.json",
                        },
                    }
                ],
            },
            {
                "published": True,
                "converged": False,
                "summary": {"gap_count": 1},
                "gap_dossier_register_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.json",
                "gap_dossier_context_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.md",
                "dossiers": [
                    {
                        "edge": "derive_product_surface",
                        "route_binding": {"state": "advance_fixed_vector"},
                        "constitutional_proposal": None,
                        "evidence_bundle_refs": {
                            "current_triage_artifact_path": ".ai-workspace/runtime/triage/derive_product_surface.json",
                        },
                    }
                ],
            },
            {
                "published": True,
                "converged": True,
                "summary": {"gap_count": 0},
                "gap_dossier_register_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.json",
                "gap_dossier_context_path": ".ai-workspace/runtime/odd_sdlc-gap-dossiers.md",
                "dossiers": [],
            },
        )
    )
    rebound_edges: list[str | None] = []
    refresh_stages: list[str] = []
    published_rebuilds: list[str] = []

    def _fake_load_gap_dossier_read_model(_workspace_root: Path, *, scope=None) -> dict[str, object]:
        return next(published_surfaces)

    def _fake_refresh_analysis(_workspace_root: Path, *, stage: str = "refresh_analysis") -> dict[str, object]:
        refresh_stages.append(stage)
        return {"status": "ok", "stage": stage}

    def _fake_build_gap_surface(*args: object, **kwargs: object) -> dict[str, object]:
        if kwargs.get("publish") is True:
            published_rebuilds.append("published")
        return {"published": bool(kwargs.get("publish"))}

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        rebound_edges.append(intent.scope.diagnostic_edge_override)
        return {
            "status": "in_progress",
            "edge": intent.scope.diagnostic_edge_override,
            "workflow_version": "test-workflow",
        }

    monkeypatch.setattr(app_module, "load_gap_dossier_read_model", _fake_load_gap_dossier_read_model)
    monkeypatch.setattr(app_module, "refresh_analysis", _fake_refresh_analysis)
    monkeypatch.setattr(app_module, "_build_gap_surface", _fake_build_gap_surface)
    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    result = start(
        app,
        scope="workspace",
        target="next",
        until="blocked",
    )

    assert result["status"] == "converged"
    assert result["target"] == "next"
    assert rebound_edges == ["derive_intent_surface", "derive_product_surface"]
    assert refresh_stages == [
        "public_start_next_traversal",
        "public_start_next_traversal",
    ]
    assert published_rebuilds == ["published", "published"]


def _prepare_public_next_dispatch_app(tmp_path: Path):
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    initial_gaps = gaps(app, scope="workspace")
    proposal_id = initial_gaps["dossiers"][0]["constitutional_proposal"]["proposal_id"]
    approved = apply_constitutional_proposal(
        tmp_path,
        edge="derive_intent_surface",
        proposal_id=proposal_id,
        actor="human",
    )
    assert approved["status"] == "applied"
    refreshed_gaps = gaps(app, scope="workspace")
    assert refreshed_gaps["dossiers"][0]["route_binding"]["state"] == "constitutional_reprice_approved"
    return app


def test_project_public_start_gen_start_outcome_projects_proof_hold_before_dispatch() -> None:
    outcome = project_public_start_gen_start_outcome(
        {
            "status": "pending",
            "blocking_reason": "fp_dispatch",
            "edge": "derive_code_surface",
        },
        until="converged",
    )
    assert isinstance(outcome, PublicStartDispatchRequired)

    proof_hold_outcome = project_public_start_gen_start_outcome(
        {
            "status": "pending",
            "blocking_reason": "fp_dispatch",
            "edge": "derive_code_surface",
        },
        until="converged",
        proof_hold={
            "held": True,
            "reason": "policy_wait",
        },
    )
    assert isinstance(proof_hold_outcome, PublicStartReturn)
    assert proof_hold_outcome.reason == "proof_hold"
    assert proof_hold_outcome.result["status"] == "pending"
    assert proof_hold_outcome.result["stopped_by"] == "proof_hold"
    assert proof_hold_outcome.result["proof_hold_active"] is True


def test_b055_public_start_projects_no_worker_dispatch_as_blocked() -> None:
    attachment = project_fp_worker_attachment({"runtime_backend": "claude"})
    assert attachment["status"] == "unattached"
    assert attachment["blocking_reason"] == "fp_worker_unattached"

    outcome = project_public_start_dispatch_outcome(
        {
            "status": "error",
            "failure_class": "policy_config_defect",
            "reason": "no dispatch agent/backend could be resolved from manifest or runtime config",
            "target": "next",
            "edge": "derive_code_surface",
        }
    )

    assert isinstance(outcome, PublicStartReturn)
    assert outcome.reason == "blocked"
    assert outcome.result["status"] == "pending"
    assert outcome.result["blocking_reason"] == "fp_worker_unattached"
    assert outcome.result["stop_predicate"] == "worker_attachment_required"
    assert outcome.result["stopped_by"] == "worker_attachment"
    assert outcome.result["worker_attachment"]["status"] == "unattached"


def test_b055_public_start_accepts_explicit_transport_contract_as_worker_attachment() -> None:
    attachment = project_fp_worker_attachment(
        {
            "runtime_backend": "claude",
            "transport_contract": ".genesis/odd_sdlc/release/test_transport_contract.json",
        }
    )

    assert attachment["status"] == "attached"
    assert attachment["worker_attachment_contract"] == "transport_contract"
    assert attachment["transport_contract"] == ".genesis/odd_sdlc/release/test_transport_contract.json"
    assert "blocking_reason" not in attachment


def test_start_next_converged_surfaces_yielded_dispatch_contract(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    app = _prepare_public_next_dispatch_app(tmp_path)

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        return {
            "status": "pending",
            "blocking_reason": "fp_dispatch",
            "edge": intent.scope.diagnostic_edge_override,
            "run_id": "run-yield",
            "call_id": "call-yield",
            "workflow_version": "wf-yield",
            "spec_hash": "spec-yield",
        }

    def _fake_project_proof_hold(*args: object, **kwargs: object) -> dict[str, object]:
        return {"held": False}

    def _fake_auto_dispatch(*args: object, **kwargs: object) -> dict[str, object]:
        return {
            "status": "yield",
            "stopped_by": "yield",
            "continuation_id": "cont-yield",
            "handoff_kind": "repair",
            "handoff_reason": "proof_incomplete",
            "failure_class": "proof_failure",
        }

    import genesis.dispatch_runtime as dispatch_runtime_module
    import genesis.proof_hold as proof_hold_module

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)
    monkeypatch.setattr(proof_hold_module, "project_proof_hold", _fake_project_proof_hold)
    monkeypatch.setattr(dispatch_runtime_module, "auto_dispatch_from_result", _fake_auto_dispatch)

    result = start(
        app,
        scope="workspace",
        target="next",
        until="converged",
    )

    assert result["status"] == "yield"
    assert result["stopped_by"] == "yield"
    assert result["continuation_id"] == "cont-yield"
    assert result["handoff_kind"] == "repair"
    assert result["handoff_reason"] == "proof_incomplete"
    assert result["failure_class"] == "proof_failure"
    assert result["target"] == "next"
    assert result["resolved_edge"] == "derive_intent_surface"


def test_start_next_converged_preserves_true_runtime_failure_without_continuation(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    app = _prepare_public_next_dispatch_app(tmp_path)

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        return {
            "status": "pending",
            "blocking_reason": "fp_dispatch",
            "edge": intent.scope.diagnostic_edge_override,
            "run_id": "run-failure",
            "call_id": "call-failure",
            "workflow_version": "wf-failure",
            "spec_hash": "spec-failure",
        }

    def _fake_project_proof_hold(*args: object, **kwargs: object) -> dict[str, object]:
        return {"held": False}

    def _fake_auto_dispatch(*args: object, **kwargs: object) -> dict[str, object]:
        return {
            "status": "error",
            "failure_class": "transport_failure",
            "reason": "transport_failure",
        }

    import genesis.dispatch_runtime as dispatch_runtime_module
    import genesis.proof_hold as proof_hold_module

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)
    monkeypatch.setattr(proof_hold_module, "project_proof_hold", _fake_project_proof_hold)
    monkeypatch.setattr(dispatch_runtime_module, "auto_dispatch_from_result", _fake_auto_dispatch)

    result = start(
        app,
        scope="workspace",
        target="next",
        until="converged",
    )

    assert result["status"] == "error"
    assert result["stopped_by"] == "fp_runtime_failure"
    assert result["failure_class"] == "transport_failure"
    assert result["reason"] == "transport_failure"
    assert result["target"] == "next"
    assert result["resolved_edge"] == "derive_intent_surface"


def test_start_routes_ticket_asset_to_declared_reentry_vector(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(tmp_path, ticket_id="B-900")
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    published = _prime_workspace_for_explicit_public_start(tmp_path, app)
    assert published["dossiers"][0]["constitutional_proposal"]["state"] in {
        "approve_with_edits",
        "suppressed",
    }
    assert published["dossiers"][0]["route_binding"]["state"] in {
        "constitutional_reprice_approved",
        "suppressed_by_mode",
    }
    calls: list[tuple[object, object]] = []

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    result = start(
        app,
        scope="workspace",
        target="asset:ticket/B-900",
        until="first_traversal",
    )

    assert result["status"] == "ok"
    assert result["fh_mode"] == "direct"
    assert result["root_mode"] == "direct"
    assert len(calls) == 1
    intent = calls[0][0]
    assert intent.scope.diagnostic_edge_override == "derive_requirement_surface"
    assert intent.target.kind == "asset"
    assert intent.target.handle == "ticket/B-900"
    assert intent.target.asset_id == "ticket/B-900"
    assert intent.target.graph_function_name == "bootstrap_release_self_test"
    assert intent.target.asset_relative_path == ".ai-workspace/tickets/active/B-900-demo.md"


def test_start_uses_admitted_route_contract_for_diagnostic_override(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(tmp_path, ticket_id="B-904")
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    _prime_workspace_for_explicit_public_start(tmp_path, app)
    calls: list[tuple[object, object]] = []
    active_module = app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).module
    bootstrap_target_id = next(
        graph_function.id
        for graph_function in active_module.graph_functions
        if graph_function.name == "bootstrap_release_self_test"
    )

    def _fake_admit_bound_execution_start(**kwargs: object) -> SimpleNamespace:
        return SimpleNamespace(
            scope=SimpleNamespace(
                module=active_module,
                workspace_root=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).workspace_root,
                selector=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).selector,
                diagnostic_edge_override="derive_goal_surface",
                build=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).build,
                runtime_identity=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).runtime_identity,
                worker=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).worker,
                active_workflow_path=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).active_workflow_path,
                workflow_root=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).workflow_root,
                work_key=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).work_key,
                run_id=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).run_id,
                runtime_config=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).runtime_config,
            ),
            target=SimpleNamespace(
                kind="asset",
                handle="ticket/B-904",
                target_id=bootstrap_target_id,
                graph_function_name="bootstrap_release_self_test",
                asset_id="ticket/B-904",
                asset_uri="workspace://.ai-workspace/tickets/active/B-904-demo.md",
                asset_relative_path=".ai-workspace/tickets/active/B-904-demo.md",
                asset_path_kind="file",
                asset_exists=True,
                binding_source="odd_sdlc.asset_ownership_index",
            ),
            execution_contract={"status": "admitted"},
        )

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "admit_bound_execution_start", _fake_admit_bound_execution_start)
    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    result = start(
        app,
        scope="workspace",
        target="asset:ticket/B-904",
        until="first_traversal",
    )

    assert result["status"] == "ok"
    assert len(calls) == 1
    intent = calls[0][0]
    assert intent.scope.diagnostic_edge_override == "derive_goal_surface"


def test_start_uses_admitted_target_truth_for_start_intent(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(tmp_path, ticket_id="B-905")
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    _prime_workspace_for_explicit_public_start(tmp_path, app)
    calls: list[tuple[object, object]] = []
    active_module = app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).module
    bootstrap_target_id = next(
        graph_function.id
        for graph_function in active_module.graph_functions
        if graph_function.name == "bootstrap_release_self_test"
    )

    def _fake_admit_bound_execution_start(**kwargs: object) -> SimpleNamespace:
        return SimpleNamespace(
            scope=SimpleNamespace(
                module=active_module,
                workspace_root=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).workspace_root,
                selector=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).selector,
                diagnostic_edge_override="derive_requirement_surface",
                build=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).build,
                runtime_identity=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).runtime_identity,
                worker=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).worker,
                active_workflow_path=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).active_workflow_path,
                workflow_root=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).workflow_root,
                work_key=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).work_key,
                run_id=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).run_id,
                runtime_config=app.scope(selector=span_analysis_module.parse_gap_scope_selector("workspace")).runtime_config,
            ),
            target=SimpleNamespace(
                kind="asset",
                handle="ticket/B-905",
                target_id=bootstrap_target_id,
                graph_function_name="bootstrap_release_self_test",
                asset_id="ticket/B-905",
                asset_uri="workspace://.ai-workspace/tickets/active/B-905-demo.md",
                asset_relative_path=".ai-workspace/tickets/active/B-905-overridden.md",
                asset_path_kind="file",
                asset_exists=True,
                binding_source="odd_sdlc.asset_ownership_index",
            ),
            execution_contract={"status": "admitted"},
        )

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "admit_bound_execution_start", _fake_admit_bound_execution_start)
    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    result = start(
        app,
        scope="workspace",
        target="asset:ticket/B-905",
        until="first_traversal",
    )

    assert result["status"] == "ok"
    assert len(calls) == 1
    intent = calls[0][0]
    assert intent.target.asset_relative_path == ".ai-workspace/tickets/active/B-905-overridden.md"


@pytest.mark.parametrize(
    ("target", "ticket_id"),
    [
        ("graph_function:bootstrap_release_self_test", None),
        ("asset:ticket/B-907", "B-907"),
    ],
)
def test_explicit_public_start_targets_stop_at_published_constitutional_head_gate(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    target: str,
    ticket_id: str | None,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    published = gaps(app, scope="workspace")
    assert published["dossiers"][0]["constitutional_proposal"]["state"] == "pending_fh"
    if ticket_id is not None:
        _seed_ticket_work_item(
            tmp_path,
            ticket_id=ticket_id,
            change_class="intent_reprice",
            re_entry_point="intent",
        )

    def _should_not_admit(*args: object, **kwargs: object) -> SimpleNamespace:
        raise AssertionError("explicit public start must stop before execution-contract admission when head gate is pending_fh")

    def _should_not_start(*args: object, **kwargs: object) -> dict[str, object]:
        raise AssertionError("gen_start must not run while the published constitutional head gate is pending_fh")

    monkeypatch.setattr(app_module, "ensure_workspace_ready", lambda workspace_root: {"analysis_current": True})
    monkeypatch.setattr(app_module, "load_gap_dossier_read_model", lambda workspace_root, scope: dict(published))
    monkeypatch.setattr(app_module, "admit_bound_execution_start", _should_not_admit)
    monkeypatch.setattr(app_module, "gen_start", _should_not_start)

    result = start(
        app,
        scope="workspace",
        target=target,
        until="first_traversal",
    )

    assert result["status"] == "pending"
    assert result["blocking_reason"] == "fh_gate"
    assert result["stopped_by"] == "fh_gate"
    assert result["target"] == target
    assert result["edge"] == "derive_intent_surface"
    assert result["constitutional_proposal"]["state"] == "pending_fh"
    assert result["route_binding"]["state"] == "await_fh_resolution"
    assert not (tmp_path / EXECUTION_CONTRACT_REGISTER_PATH).exists()

    event_types = [event["event_type"] for event in _read_events(tmp_path)]
    assert "fh_gate_pending" in event_types
    assert "execution_contract_drafted" not in event_types
    assert "execution_contract_admitted" not in event_types
    assert "run_bound" not in event_types
    assert "worker_turn_started" not in event_types


def test_start_rejects_unpublished_ticket_asset_handle(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    _prime_workspace_for_explicit_public_start(tmp_path, app)

    with pytest.raises(ValueError, match="unknown or non-start-addressable published asset handle"):
        start(
            app,
            scope="workspace",
            target="asset:ticket/B-003",
            until="first_traversal",
        )


def test_start_rejects_backlog_ticket_asset_handle(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(tmp_path, ticket_id="B-902", status="backlog")
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    _prime_workspace_for_explicit_public_start(tmp_path, app)

    with pytest.raises(ValueError, match="ticket_status 'backlog' is not start-authoritative"):
        start(
            app,
            scope="workspace",
            target="asset:ticket/B-902",
            until="first_traversal",
        )


def test_start_rejects_ticket_asset_without_published_route_contract(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(tmp_path, ticket_id="B-906", re_entry_point="unknown_surface")
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    _prime_workspace_for_explicit_public_start(tmp_path, app)

    with pytest.raises(ValueError, match="unknown or non-start-addressable published asset handle"):
        start(
            app,
            scope="workspace",
            target="asset:ticket/B-906",
            until="first_traversal",
        )


def test_ticket_asset_start_carries_ticket_execution_context_into_manifest_prompt(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(
        tmp_path,
        ticket_id="B-901",
        ticket_category="implementation_migration",
        change_class="intent_reprice",
        re_entry_point="intent",
    )
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    _prime_workspace_for_explicit_public_start(tmp_path, app)
    app.config.runtime_config.pop("asset_binding_contract", None)
    result = start(
        app,
        scope="workspace",
        target="asset:ticket/B-901",
        until="first_traversal",
    )

    assert result["status"] == "iterated"
    assert result["blocking_reason"] == "fp_dispatch"
    manifest = json.loads(Path(result["fp_manifest_path"]).read_text(encoding="utf-8"))
    execution_contract_context = _manifest_context(
        manifest,
        "odd_sdlc_execution_contract_context",
    )
    assert execution_contract_context["locator"] == (
        f"workspace://{EXECUTION_CONTRACT_CONTEXT_PATH.as_posix()}"
    )
    assert "# Admitted Execution Contract" in str(execution_contract_context["content"])
    execution_contract = json.loads(
        (tmp_path / EXECUTION_CONTRACT_REGISTER_PATH).read_text(encoding="utf-8")
    )
    assert execution_contract["contract_kind"] == EXECUTION_CONTRACT_KIND
    assert execution_contract["status"] == "admitted"
    assert execution_contract["closure_law"] == (
        "close only when the admitted execution contract is the source carrier and mixed "
        "old/new execution proof is rejected"
    )
    assert execution_contract["evaluation_criteria"] == [
        "admit the execution contract before prompt assembly opens",
        "carry the admitted closure law into manifest provenance",
    ]
    assert execution_contract["non_closure_conditions"] == [
        "raw ticket prose still acts as execution authority",
        "mixed old/new execution proof still counts as closure",
    ]
    assert execution_contract["proof_surface"][:2] == [
        ".ai-workspace/runtime/odd_sdlc-execution-contract.json",
        ".ai-workspace/runtime/odd_sdlc-execution-contract.md",
    ]
    assert execution_contract["target_truth"]["ticket_target_truth"] == (
        "one admitted execution contract governs this bounded repair"
    )
    assert execution_contract["carrier_graph_functions"] == {
        "derive": DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION,
        "admit": ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION,
    }
    assert execution_contract["target_truth"]["handle"] == "ticket/B-901"
    assert execution_contract["target_truth"]["ticket_relative_path"] == ".ai-workspace/tickets/active/B-901-demo.md"
    assert execution_contract["route_contract"]["reentry_vector"] == "derive_intent_surface"
    assert "# Admitted Execution Contract" in manifest["prompt"]
    assert "contract_id: " in manifest["prompt"]
    catalog_payload = catalog(app)
    assert catalog_payload["execution_contract_surface"]["contract_id"] == execution_contract["contract_id"]
    assert catalog_payload["execution_contract_surface"]["target_truth"]["handle"] == "ticket/B-901"
    query_payload = query_domain(app)
    assert query_payload["execution_contract_surface"]["contract_id"] == execution_contract["contract_id"]
    gap_payload = gaps(app, scope="workspace")
    assert gap_payload["execution_contract_surface"]["contract_id"] == execution_contract["contract_id"]
    dossier_register = json.loads(
        (tmp_path / GAP_DOSSIER_REGISTER_PATH).read_text(encoding="utf-8")
    )
    assert dossier_register["execution_contract_surface"]["contract_id"] == execution_contract["contract_id"]
    dossier_context = (tmp_path / GAP_DOSSIER_CONTEXT_PATH).read_text(encoding="utf-8")
    assert "## Execution Contract" in dossier_context
    assert execution_contract["contract_id"] in dossier_context


def test_raw_gen_start_without_admitted_execution_contract_fails_closed(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    intent = app_module.StartIntent(
        scope=app.scope(),
        target=app_module.StartTarget.next(),
        until="first_traversal",
    )

    with pytest.raises(FileNotFoundError, match="odd_sdlc_execution_contract_context"):
        app_module.gen_start(intent, app.stream)


def test_ordinary_asset_target_uses_operator_execution_contract(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    module = odd_sdlc_module(tmp_path)

    contract = admit_execution_contract_surface(
        workspace_root=tmp_path,
        module=module,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        work_key=None,
        run_id=None,
        normalized_scope="workspace",
        raw_target="asset:reviewed_design_surface",
        until="first_traversal",
    )
    contract_payload = contract.to_dict()

    assert contract_payload["status"] == "admitted"
    assert contract_payload["source_kind"] == "operator_request"
    assert contract_payload["ticket_category"] == "ordinary"
    assert "ticket_id" not in contract_payload
    assert contract_payload["target_truth"]["handle"] == "reviewed_design_surface"
    assert contract_payload["target_truth"]["asset_id"] == "reviewed_design_surface"
    assert contract_payload["target_truth"]["asset_relative_path"].endswith(
        "/design/35-reviewed-odd-design.md"
    )
    assert contract_payload["target_truth"]["asset_path_kind"] == "missing"
    assert contract_payload["target_truth"]["asset_exists"] is False


def test_bound_execution_start_rejects_open_dict_execution_contract_payload(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    contract = admit_execution_contract_surface(
        workspace_root=tmp_path,
        module=odd_sdlc_module(tmp_path),
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        work_key=None,
        run_id=None,
        normalized_scope="workspace",
        raw_target="asset:reviewed_design_surface",
        until="first_traversal",
    )

    with pytest.raises(TypeError, match="AdmittedExecutionContract carrier"):
        bound_execution_start_from_contract(
            scope=app.scope(),
            execution_contract=execution_contract_payload(contract),
        )


def test_downstream_consumers_reject_corrupt_execution_contract_surface(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    register_path = tmp_path / EXECUTION_CONTRACT_REGISTER_PATH
    register_path.parent.mkdir(parents=True, exist_ok=True)
    register_path.write_text(
        json.dumps(
            {
                "contract_kind": EXECUTION_CONTRACT_KIND,
                "carrier_shape": "typed_execution_contract_carrier.v1",
                "contract_id": "execution_contract/corrupt",
                "source_kind": "operator_request",
                "status": "drafted",
                "target_truth": {"kind": "next"},
            }
        ),
        encoding="utf-8",
    )

    with pytest.raises(ExecutionContractSurfaceError, match="status is not admitted"):
        catalog(app)
    with pytest.raises(ExecutionContractSurfaceError, match="status is not admitted"):
        query_domain(app)
    with pytest.raises(ExecutionContractSurfaceError, match="status is not admitted"):
        gaps(app, scope="workspace")


def test_new_execution_contract_supersedes_previous_admitted_contract(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    _seed_workspace(tmp_path)
    _seed_ticket_work_item(
        tmp_path,
        ticket_id="B-903",
        ticket_category="implementation_migration",
        change_class="intent_reprice",
        re_entry_point="intent",
    )
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    _prime_workspace_for_explicit_public_start(tmp_path, app)

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    first = start(app, scope="workspace", target="graph_function:bootstrap_release_self_test", until="first_traversal")
    assert first["status"] == "ok"
    first_register = json.loads(
        (tmp_path / EXECUTION_CONTRACT_REGISTER_PATH).read_text(encoding="utf-8")
    )
    first_contract_id = first_register["contract_id"]

    second = start(app, scope="workspace", target="asset:ticket/B-903", until="first_traversal")
    assert second["status"] == "ok"
    second_register = json.loads(
        (tmp_path / EXECUTION_CONTRACT_REGISTER_PATH).read_text(encoding="utf-8")
    )
    assert second_register["status"] == "admitted"
    assert second_register["contract_id"] != first_contract_id
    assert second_register["supersedes_contract_id"] == first_contract_id

    execution_events = [
        event for event in _read_events(tmp_path)
        if event["event_type"].startswith("execution_contract_")
    ]
    assert [event["event_type"] for event in execution_events] == [
        "execution_contract_drafted",
        "execution_contract_admitted",
        "execution_contract_drafted",
        "execution_contract_superseded",
        "execution_contract_admitted",
    ]
    superseded_event = next(
        event for event in execution_events
        if event["event_type"] == "execution_contract_superseded"
    )
    superseded_contract = superseded_event["data"]["execution_contract"]
    assert superseded_contract["contract_id"] == first_contract_id
    assert superseded_contract["status"] == "superseded"
    assert superseded_contract["superseded_by_contract_id"] == second_register["contract_id"]


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

    register = load_requirement_closure_register_read_model(tmp_path)
    assert register["published"] is False
    assert register["unavailable_reason"] == "published_analysis_stale"

    rebuilt = build_requirement_closure_register(tmp_path, stage="workspace_scan")
    entries = {entry["requirement_id"] for entry in rebuilt["requirements"]}
    assert {"REQ-DEMO-001", "REQ-DEMO-002"} <= entries


def test_requirement_closure_prompt_context_requires_explicit_register(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)

    with pytest.raises(TypeError):
        build_requirement_closure_prompt_context(tmp_path)  # type: ignore[call-arg]


def test_repair_frontier_prompt_context_requires_explicit_frontier(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)

    with pytest.raises(TypeError):
        build_repair_frontier_prompt_context(tmp_path)  # type: ignore[call-arg]


def test_span_analysis_projects_typed_canonical_gap_carriers() -> None:
    raw_graph_gaps = span_analysis_module.project_raw_graph_gap_rows(
        [
            {
                "edge": "derive_requirement_surface",
                "delta": 0.5,
                "failing": ["requirement_scope_complete"],
                "passing": [],
                "blocking_reasons": [],
            }
        ]
    )
    declared_gaps = span_analysis_module.project_declared_obligation_gap_rows(
        [
            {
                "edge": "derive_code_surface",
                "carry_delta": 0.25,
                "fulfillment_delta": 0.5,
                "combined_delta": 0.75,
                "carry_converged": False,
                "fulfillment_converged": False,
                "edge_converged": False,
                "blocking_reasons": ["missing_planned_test_coverage"],
                "expected_count": 2,
                "carried_count": 1,
                "fulfilled_count": 0,
                "partial_count": 1,
                "missing_count": 1,
                "extra_count": 0,
                "unfulfilled_count": 1,
                "blocking_count": 1,
                "signal_key": "derive_code_surface",
            }
        ]
    )

    canonical = span_analysis_module.canonical_edge_gaps(
        edge_names=["derive_requirement_surface", "derive_code_surface"],
        raw_graph_gaps=raw_graph_gaps,
        ledger_gaps=declared_gaps,
    )

    assert isinstance(canonical[0], span_analysis_module.GraphEdgeGapProjection)
    assert isinstance(canonical[1], span_analysis_module.DeclaredObligationEdgeGapProjection)
    assert canonical[0].to_dict()["gap_kind"] == "graph_edge_gap"
    assert canonical[1].to_dict()["gap_kind"] == "declared_obligation_edge_gap"

    summary = span_analysis_module.aggregate_edge_gap_truth(canonical)
    assert summary.graph_edge_gap_count == 1
    assert summary.declared_obligation_gap_count == 1


def test_gap_dossier_projects_typed_input_from_canonical_gap_carriers() -> None:
    raw_graph_gaps = span_analysis_module.project_raw_graph_gap_rows(
        [
            {
                "edge": "derive_requirement_surface",
                "delta": 1.0,
                "failing": ["requirement_scope_complete"],
                "passing": [],
                "blocking_reasons": ["missing_requirement_surface"],
                "observation": {"observed_signal": "unresolved_gap_pressure"},
                "triage": {"process_outcome_kind": "blocked_stale_analysis"},
                "route_binding": {"state": "blocked_stale_analysis"},
                "current_work_key": "work::demo",
            }
        ]
    )
    canonical = span_analysis_module.canonical_edge_gaps(
        edge_names=["derive_requirement_surface"],
        raw_graph_gaps=raw_graph_gaps,
        ledger_gaps=[],
    )
    summary = span_analysis_module.aggregate_edge_gap_truth(canonical)

    projected = project_gap_dossier_input(
        gap_payload={
            "scope": "workspace",
            "jobs_considered": 1,
            "open_frames": 0,
            "analysis_current": False,
            "analysis_fingerprint": "fp::demo",
        },
        canonical_gaps=canonical,
        summary=summary,
    )

    assert projected.scope == "workspace"
    assert projected.analysis_current is False
    assert projected.summary.graph_edge_gap_count == 1
    assert len(projected.rows) == 1
    assert isinstance(projected.rows[0].gap_truth, span_analysis_module.GraphEdgeGapProjection)
    assert projected.rows[0].triage["process_outcome_kind"] == "blocked_stale_analysis"
    assert projected.rows[0].route_binding["state"] == "blocked_stale_analysis"


def test_start_requires_explicit_refresh_when_published_analysis_is_stale(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))
    calls: list[tuple[object, object]] = []

    def _fake_gen_start(intent, stream) -> dict[str, object]:
        calls.append((intent, stream))
        return {"status": "ok"}

    monkeypatch.setattr(app_module, "gen_start", _fake_gen_start)

    refresh_analysis(tmp_path, stage="test")
    intent_surface = tmp_path / "specification" / "INTENT.md"
    intent_surface.write_text(
        "\n".join(
            (
                "# Intent",
                "",
                "This intent surface is regenerated by the bounded odd_sdlc constructor turn.",
                "",
                "## Purpose",
                "`odd_sdlc` exists to prove that iterative starts can refresh stale published analysis.",
                "",
            )
        ),
        encoding="utf-8",
    )

    ready_before, _ = workspace_state_ready(tmp_path)
    assert ready_before is False

    with pytest.raises(RuntimeError, match="workspace analysis is stale"):
        start(app, scope="workspace", target="next", until="first_traversal")

    assert calls == []
    ready_after, _ = workspace_state_ready(tmp_path)
    assert ready_after is False


def test_refresh_analysis_publishes_distinct_analysis_manifest(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    requirement_surface = tmp_path / "specification" / "requirements" / "10-generated-bootstrap.md"
    requirement_surface.write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-DEMO-001\n",
        encoding="utf-8",
    )

    report = refresh_analysis(tmp_path, stage="test")
    analysis_manifest = load_analysis_manifest(tmp_path)

    assert analysis_manifest is not None
    assert analysis_manifest["manifest_kind"] == "odd_sdlc.analysis_manifest"
    assert analysis_manifest["analysis_fingerprint"] == report["workspace_state"]["analysis_fingerprint"]
    assert report["workspace_state"]["analysis_manifest_path"] == report["analysis_manifest_path"]
    assert {entry["artifact_kind"] for entry in analysis_manifest["published_artifacts"]} == {
        "ambiguity_register",
        "requirement_closure_register",
        "requirement_closure_prompt_context",
        "repair_frontier_register",
        "repair_frontier_prompt_context",
    }
    assert any(entry["input_kind"] == "requirement_surface" for entry in analysis_manifest["source_inputs"])


def test_query_domain_exposes_published_analysis_manifest(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    requirement_surface = tmp_path / "specification" / "requirements" / "10-generated-bootstrap.md"
    requirement_surface.write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-DEMO-001\n",
        encoding="utf-8",
    )

    refresh_analysis(tmp_path, stage="test")
    payload = query_domain(initialize(bootstrap(workspace_root=tmp_path)))

    assert payload["gap_dossier"]["analysis_manifest"] is not None
    assert payload["gap_dossier"]["analysis_manifest"]["manifest_kind"] == "odd_sdlc.analysis_manifest"
    assert {entry["artifact_kind"] for entry in payload["gap_dossier"]["analysis_manifest"]["published_artifacts"]} == {
        "ambiguity_register",
        "requirement_closure_register",
        "requirement_closure_prompt_context",
        "repair_frontier_register",
        "repair_frontier_prompt_context",
    }
    assert payload["gap_dossier"]["analysis_current"] is True
    assert payload["gap_dossier"]["published"] is False
    assert payload["gap_dossier"]["unavailable_reason"] == "gap_dossier_unpublished"
    assert payload["gap_dossier"]["dossiers"] == []
    assert payload["gap_dossier"]["gap_dossier_kind"] == "odd_sdlc.gap_dossier_register"


def test_query_domain_rejects_malformed_published_gap_dossier_register(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    register_path = tmp_path / GAP_DOSSIER_REGISTER_PATH
    register_path.parent.mkdir(parents=True, exist_ok=True)
    register_path.write_text(
        json.dumps(
            {
                "gap_dossier_kind": "odd_sdlc.gap_dossier_register",
                "schema_version": "v1",
                "workspace_root": str(tmp_path),
                "scope": "workspace",
                "analysis_current": True,
                "summary": {"gap_count": 1},
                "dossiers": [
                    {
                        "analysis_current": True,
                        "gap_truth": {"gap_kind": "declared_obligation_edge_gap"},
                    }
                ],
            }
        ),
        encoding="utf-8",
    )

    payload = query_domain(initialize(bootstrap(workspace_root=tmp_path)))

    assert payload["gap_dossier"]["published"] is False
    assert payload["gap_dossier"]["unavailable_reason"] == "gap_dossier_unavailable"
    assert payload["gap_dossier"]["dossiers"] == []


def test_load_admitted_execution_contract_projection_rejects_invalid_status_literal(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)
    register_path = tmp_path / EXECUTION_CONTRACT_REGISTER_PATH
    register_path.parent.mkdir(parents=True, exist_ok=True)
    register_path.write_text(
        json.dumps(
            {
                "contract_kind": EXECUTION_CONTRACT_KIND,
                "carrier_shape": "typed_execution_contract_carrier.v1",
                "contract_id": "contract_bad_status",
                "status": "admittedish",
                "source_kind": "operator_request",
                "target_truth": {
                    "kind": "next",
                    "normalized_scope": "workspace",
                    "public_target": "next",
                    "until": "converged",
                    "edge_override": "derive_intent_surface",
                },
            }
        ),
        encoding="utf-8",
    )

    with pytest.raises(ExecutionContractSurfaceError, match="status is not admitted"):
        load_admitted_execution_contract_projection(tmp_path, required=True)
def test_gaps_publishes_homeostatic_observation_and_triage(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = gaps(app)
    first_dossier = payload["dossiers"][0]

    assert payload["analysis_current"] is False
    assert first_dossier["observation"]["observed_signal"] == "stale_published_analysis"
    assert first_dossier["triage"]["process_outcome_kind"] == "blocked_stale_analysis"
    assert first_dossier["route_binding"]["route_id"].startswith("route_")
    assert first_dossier["route_binding"]["state"] == "blocked_stale_analysis"
    triage_artifact = load_current_edge_triage(tmp_path, first_dossier["edge"])
    assert triage_artifact is not None
    assert triage_artifact["artifact_kind"] == "odd_sdlc.current_edge_triage"
    assert triage_artifact["triage"]["process_outcome_kind"] == "blocked_stale_analysis"
    assert triage_artifact["route_binding"]["state"] == "blocked_stale_analysis"
    assert triage_artifact["observation"]["event_id"]
    assert triage_artifact["triage"]["event_id"]
    assert triage_artifact["route_binding"]["route_event_id"]
    dossier_register_path = tmp_path / GAP_DOSSIER_REGISTER_PATH
    dossier_context_path = tmp_path / GAP_DOSSIER_CONTEXT_PATH
    assert dossier_register_path.exists()
    assert dossier_context_path.exists()
    dossier_register = json.loads(dossier_register_path.read_text(encoding="utf-8"))
    assert dossier_register["gap_dossier_kind"] == "odd_sdlc.gap_dossier_register"
    dossier = dossier_register["dossiers"][0]
    assert dossier["edge"] == first_dossier["edge"]
    assert dossier["route_binding"]["state"] == "blocked_stale_analysis"
    assert dossier["evidence_bundle_refs"]["current_triage_artifact_path"] == (
        CURRENT_TRIAGE_DIR / f"{first_dossier['edge']}.json"
    ).as_posix()
    dossier_context = dossier_context_path.read_text(encoding="utf-8")
    assert "# odd_sdlc Gap Analysis Dossiers" in dossier_context
    assert f"## `{first_dossier['edge']}`" in dossier_context
    event_types = [event["event_type"] for event in app.stream.all_events()]
    assert "observation_recorded" in event_types
    assert "triage_produced" in event_types
    assert "route_recorded" in event_types
    observation_event = next(event for event in app.stream.all_events() if event["event_type"] == "observation_recorded")
    triage_event = next(event for event in app.stream.all_events() if event["event_type"] == "triage_produced")
    route_event = next(event for event in app.stream.all_events() if event["event_type"] == "route_recorded")
    assert observation_event["data"]["run_id"] == triage_event["data"]["run_id"] == route_event["data"]["run_id"]
    assert triage_event["correlation_id"] == observation_event["event_id"]
    assert route_event["correlation_id"] == triage_event["event_id"]
    assert observation_event["data"]["run_id"].startswith("gap_snapshot::")


def test_operator_gap_analysis_projects_from_published_dossier_head(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    raw = gaps(app)
    analysis = project_operator_gap_analysis(raw)
    head = raw["dossiers"][0]

    assert analysis["analysis_kind"] == "odd_sdlc.operator_gap_analysis"
    assert analysis["scope"] == "workspace"
    assert analysis["status"] == "open"
    assert analysis["frontier"]["edge"] == head["edge"]
    assert analysis["frontier"]["route_state"] == head["route_binding"]["state"]
    assert analysis["frontier"]["blocker_class"] == head["triage"]["process_outcome_kind"]
    assert analysis["start_resolution"]["blocking_reason"] == head["route_binding"]["state"]
    assert analysis["next_lawful_steps"]
    assert analysis["machine_output"]["command"] == "odd_sdlc gaps --format json"
    assert analysis["source"]["binding_source"] == "odd_sdlc.gap_dossier_register"
    assert analysis["source"]["gap_dossier_register_path"] == GAP_DOSSIER_REGISTER_PATH.as_posix()


def test_cli_bare_gaps_defaults_to_workspace_operator_analysis(
    tmp_path: Path,
    capsys: pytest.CaptureFixture[str],
) -> None:
    _seed_workspace(tmp_path)

    exit_code = odd_sdlc_cli.main(["gaps", "--workspace", str(tmp_path)])
    payload = json.loads(capsys.readouterr().out)
    raw_register = json.loads((tmp_path / GAP_DOSSIER_REGISTER_PATH).read_text(encoding="utf-8"))
    raw_head = raw_register["dossiers"][0]

    assert exit_code == 0
    assert payload["analysis_kind"] == "odd_sdlc.operator_gap_analysis"
    assert payload["scope"] == "workspace"
    assert payload["frontier"]["edge"] == raw_head["edge"]
    assert payload["frontier"]["route_state"] == raw_head["route_binding"]["state"]
    assert payload["next_lawful_steps"]
    assert payload["machine_output"]["command"] == "odd_sdlc gaps --format json"


def test_cli_gaps_raw_json_mode_returns_machine_dossier(
    tmp_path: Path,
    capsys: pytest.CaptureFixture[str],
) -> None:
    _seed_workspace(tmp_path)

    exit_code = odd_sdlc_cli.main(["gaps", "--workspace", str(tmp_path), "--format", "json"])
    payload = json.loads(capsys.readouterr().out)

    assert exit_code == 0
    assert payload["gap_dossier_kind"] == "odd_sdlc.gap_dossier_register"
    assert payload["scope"] == "workspace"
    assert payload["published"] is True
    assert "dossiers" in payload
    assert payload.get("analysis_kind") != "odd_sdlc.operator_gap_analysis"


def test_operator_gap_analysis_fails_closed_when_dossier_unavailable(tmp_path: Path) -> None:
    surface = load_gap_dossier_read_model(tmp_path, scope="workspace")

    analysis = project_operator_gap_analysis(surface)

    assert analysis["analysis_kind"] == "odd_sdlc.operator_gap_analysis"
    assert analysis["status"] == "unavailable"
    assert analysis["frontier"] is None
    assert analysis["start_resolution"]["blocking_reason"] == "published_gap_dossier_unavailable"
    assert analysis["next_lawful_steps"][0].startswith("Gap guidance is unavailable")
    assert analysis["machine_output"]["command"] == "odd_sdlc gaps --format json"


def test_cli_gaps_help_teaches_bare_operator_path(capsys: pytest.CaptureFixture[str]) -> None:
    with pytest.raises(SystemExit) as exc:
        odd_sdlc_cli.main(["gaps", "--help"])

    assert exc.value.code == 0
    help_text = capsys.readouterr().out
    assert "bare gaps defaults to workspace" in help_text
    assert "--format" in help_text
    assert "raw dossier carrier" in help_text


def test_gaps_fail_closed_when_declared_obligation_carrier_is_unavailable(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    def _fail_declared_gap_projection(*_args, **_kwargs):
        raise RuntimeError("declared obligation carrier unavailable")

    monkeypatch.setattr(
        app_module,
        "collect_declared_obligation_gaps",
        _fail_declared_gap_projection,
    )

    with pytest.raises(RuntimeError, match="declared obligation carrier unavailable"):
        gaps(app)


def test_gaps_can_analyze_a_bounded_span_with_dependent_proof_gap(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    monkeypatch.setattr(
        span_analysis_module,
        "gen_gaps",
        lambda _scope, _stream: {
            "scope": {},
            "jobs_considered": 18,
            "total_delta": 1.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_requirement_surface",
                    "delta": 0.5,
                    "failing": ["requirement_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "requirement surface still needs refinement",
                    "environment_ready": True,
                },
                {
                    "edge": "derive_code_surface",
                    "delta": 0.5,
                    "failing": ["code_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "code surface remains shallow",
                    "environment_ready": True,
                },
                {
                    "edge": "derive_test_module_surface",
                    "delta": 0.5,
                    "failing": ["test_module_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "test module surface remains incomplete",
                    "environment_ready": True,
                },
            ],
        },
    )
    monkeypatch.setattr(
        span_analysis_module,
        "collect_declared_obligation_gaps",
        lambda _workspace_root, _declarations: [
            {
                "edge": "derive_code_surface",
                "combined_delta": 0.5,
                "carry_delta": 0.0,
                "fulfillment_delta": 0.5,
                "carry_converged": True,
                "fulfillment_converged": False,
                "edge_converged": False,
                "expected_count": 2,
                "carried_count": 2,
                "fulfilled_count": 1,
                "partial_count": 1,
                "missing_count": 0,
                "extra_count": 0,
                "unfulfilled_count": 1,
                "blocking_count": 1,
                "blocking_reasons": ["behavioral_realization_missing"],
                "summary": "code still lacks behavioral realization",
                "signal_key": "derive_code_surface",
                "declared_edges": ["derive_code_surface"],
            },
            {
                "edge": "derive_test_design_surface",
                "combined_delta": 0.25,
                "carry_delta": 0.25,
                "fulfillment_delta": 0.0,
                "carry_converged": False,
                "fulfillment_converged": True,
                "edge_converged": False,
                "expected_count": 2,
                "carried_count": 1,
                "fulfilled_count": 1,
                "partial_count": 0,
                "missing_count": 1,
                "extra_count": 0,
                "unfulfilled_count": 0,
                "blocking_count": 1,
                "blocking_reasons": ["missing_planned_test_coverage"],
                "summary": "planned test coverage still drops obligations",
                "signal_key": "derive_test_design_surface",
                "declared_edges": ["derive_test_design_surface"],
            },
            {
                "edge": "derive_test_module_surface",
                "combined_delta": 0.0,
                "carry_delta": 0.0,
                "fulfillment_delta": 0.0,
                "carry_converged": True,
                "fulfillment_converged": True,
                "edge_converged": True,
                "expected_count": 2,
                "carried_count": 2,
                "fulfilled_count": 2,
                "partial_count": 0,
                "missing_count": 0,
                "extra_count": 0,
                "unfulfilled_count": 0,
                "blocking_count": 0,
                "blocking_reasons": [],
                "summary": "test module obligations currently close",
                "signal_key": "derive_test_module_surface",
                "declared_edges": ["derive_test_module_surface"],
            },
        ],
    )

    payload = gaps(
        app,
        from_edge="derive_requirement_surface",
        to_edge="derive_test_module_surface",
        zoom="combined",
        include_dependent=True,
    )

    assert payload["analysis_kind"] == "odd_sdlc.span_gap_analysis"
    assert payload["span"]["selected_edges"] == [
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
    ]
    assert {gap["edge"] for gap in payload["graph_view"]["gaps"]} == {
        "derive_requirement_surface",
        "derive_code_surface",
        "derive_test_module_surface",
    }
    assert [gap["edge"] for gap in payload["gaps"]] == [
        "derive_requirement_surface",
        "derive_code_surface",
        "derive_test_design_surface",
        "derive_test_module_surface",
    ]
    canonical_gaps = {gap["edge"]: gap for gap in payload["gaps"]}
    assert canonical_gaps["derive_requirement_surface"]["gap_kind"] == "graph_edge_gap"
    assert canonical_gaps["derive_requirement_surface"]["carry_truth_available"] is False
    assert canonical_gaps["derive_requirement_surface"]["fulfillment_truth_available"] is False
    assert canonical_gaps["derive_requirement_surface"]["carry_converged"] is None
    assert canonical_gaps["derive_requirement_surface"]["fulfillment_converged"] is None
    assert canonical_gaps["derive_requirement_surface"]["graph_delta"] == pytest.approx(0.5)
    assert canonical_gaps["derive_requirement_surface"]["total_delta"] == pytest.approx(0.5)
    assert canonical_gaps["derive_code_surface"]["gap_kind"] == "declared_obligation_edge_gap"
    assert canonical_gaps["derive_code_surface"]["carry_truth_available"] is True
    assert canonical_gaps["derive_code_surface"]["fulfillment_truth_available"] is True
    assert canonical_gaps["derive_code_surface"]["carry_converged"] is True
    assert canonical_gaps["derive_code_surface"]["fulfillment_converged"] is False
    assert canonical_gaps["derive_code_surface"]["graph_delta"] == pytest.approx(0.5)
    assert canonical_gaps["derive_code_surface"]["combined_delta"] == pytest.approx(0.5)
    assert canonical_gaps["derive_code_surface"]["total_delta"] == pytest.approx(1.0)
    assert canonical_gaps["derive_code_surface"]["signal_key"] == "derive_code_surface"
    assert canonical_gaps["derive_test_design_surface"]["carry_converged"] is False
    assert canonical_gaps["derive_test_design_surface"]["fulfillment_converged"] is True
    assert canonical_gaps["derive_test_design_surface"]["graph_delta"] == pytest.approx(0.0)
    assert canonical_gaps["derive_test_design_surface"]["combined_delta"] == pytest.approx(0.25)
    assert canonical_gaps["derive_test_design_surface"]["total_delta"] == pytest.approx(0.25)
    assert canonical_gaps["derive_test_design_surface"]["signal_key"] == "derive_test_design_surface"
    assert canonical_gaps["derive_test_module_surface"]["carry_converged"] is True
    assert canonical_gaps["derive_test_module_surface"]["fulfillment_converged"] is True
    assert canonical_gaps["derive_test_module_surface"]["graph_delta"] == pytest.approx(0.5)
    assert canonical_gaps["derive_test_module_surface"]["combined_delta"] == pytest.approx(0.0)
    assert canonical_gaps["derive_test_module_surface"]["total_delta"] == pytest.approx(0.5)
    assert payload["summary"]["converged"] is False
    assert payload["summary"]["declared_obligation_gap_count"] == 3
    assert payload["summary"]["graph_edge_gap_count"] == 1
    assert payload["summary"]["mixed_truth_classes"] is True
    assert payload["summary"]["carry_converged"] is False
    assert payload["summary"]["fulfillment_converged"] is False
    assert payload["summary"]["declared_carry_converged"] is False
    assert payload["summary"]["declared_fulfillment_converged"] is False
    assert payload["summary"]["graph_gap_converged"] is False
    assert payload["summary"]["span_converged"] is False
    assert payload["summary"]["graph_total_delta"] == pytest.approx(1.5)
    assert payload["summary"]["direct_graph_delta"] == pytest.approx(1.5)
    assert payload["summary"]["carry_delta"] == pytest.approx(0.25)
    assert payload["summary"]["fulfillment_delta"] == pytest.approx(0.5)
    assert payload["summary"]["combined_delta"] == pytest.approx(0.75)
    assert payload["summary"]["total_delta"] == pytest.approx(2.25)
    assert payload["summary"]["expected_count"] == 6
    assert payload["summary"]["fulfilled_count"] == 4
    assert payload["summary"]["partial_count"] == 1
    assert payload["summary"]["missing_count"] == 1
    assert payload["summary"]["blocking_reasons"] == [
        "behavioral_realization_missing",
        "missing_planned_test_coverage",
    ]


def test_gaps_rejects_inverted_span_order(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    with pytest.raises(ValueError, match="invalid span ordering"):
        gaps(
            app,
            from_edge="derive_test_module_surface",
            to_edge="derive_requirement_surface",
            zoom="combined",
        )


def test_gap_publication_does_not_inherit_unrelated_prior_run_id(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    emit(
        "workflow_selected",
        {
            "edge": "derive_intent_surface",
            "run_id": "run_previous_real_start",
            "work_key": "derive_intent_surface",
        },
        stream=app.stream,
    )

    payload = gaps(app)
    triage_artifact = load_current_edge_triage(tmp_path, payload["dossiers"][0]["edge"])
    events = app.stream.all_events()
    triage_event = next(event for event in events if event["event_type"] == "triage_produced")
    assert triage_artifact is not None
    assert triage_artifact["run_id"] == triage_event["data"]["run_id"]
    assert triage_event["data"]["run_id"].startswith("gap_snapshot::")
    assert triage_event["data"]["run_id"] != "run_previous_real_start"


def test_query_domain_prefers_current_triage_artifact_when_analysis_is_current(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    published = gaps(app)
    edge_id = published["dossiers"][0]["edge"]
    published_triage_id = published["dossiers"][0]["triage"]["triage_id"]
    artifact_path = tmp_path / CURRENT_TRIAGE_DIR / f"{edge_id}.json"
    artifact = json.loads(artifact_path.read_text(encoding="utf-8"))
    artifact["triage"]["triage_id"] = "tri_from_current_artifact"
    artifact_path.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    before_events = _read_events(tmp_path)
    payload = query_domain(app)
    after_events = _read_events(tmp_path)

    assert payload["gap_dossier"]["dossiers"][0]["triage"]["triage_id"] == published_triage_id
    assert before_events == after_events


def test_gaps_deduplicates_identical_projection_publication(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    first = gaps(app)
    first_events = _read_events(tmp_path)
    second = gaps(app)
    second_events = _read_events(tmp_path)

    assert second["dossiers"][0]["triage"]["triage_id"] == first["dossiers"][0]["triage"]["triage_id"]
    assert second_events == first_events


def test_triage_divergence_records_prior_observation_chain(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(
        bootstrap(
            workspace_root=tmp_path,
            runtime_config={"constitutional_repricing": {"mode": "fh_gate"}},
        )
    )

    first = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=_goal_gap_payload("goal surface remains insufficient under the current constitution"),
        runtime_config=app.config.runtime_config,
        publish=True,
    )
    second = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=_goal_gap_payload("goal surface remains contradictory under the current constitution"),
        runtime_config=app.config.runtime_config,
        publish=True,
    )

    first_edge = first["gaps"][0]
    second_edge = second["gaps"][0]
    divergence = [event for event in _read_events(tmp_path) if event["event_type"] == "triage_divergence"]

    assert second_edge["triage"]["prior_observation_id"] == first_edge["observation"]["observation_id"]
    assert divergence
    assert divergence[-1]["data"]["prior_triage_id"] == first_edge["triage"]["triage_id"]
    assert divergence[-1]["data"]["current_triage_id"] == second_edge["triage"]["triage_id"]


def test_bootstrap_strips_self_query_binding_contracts_from_runtime_config(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    runtime_contract = tmp_path / ".genesis" / "odd_sdlc" / "release" / "genesis.yml"
    runtime_contract.parent.mkdir(parents=True, exist_ok=True)
    runtime_contract.write_text(
        "\n".join(
            (
                'domain_package: odd_sdlc',
                'transport_contract: .genesis/odd_sdlc/release/test_transport_contract.json',
                'asset_binding_contract: {"command":["python","-m","odd_sdlc","query-domain","--workspace","."]}',
                'operator_asset_contract: {"command":["python","-m","odd_sdlc","query-domain","--workspace","."]}',
                "",
            )
        ),
        encoding="utf-8",
    )
    (tmp_path / ".genesis" / "genesis.yml").write_text(
        "runtime_contract: .genesis/odd_sdlc/release/genesis.yml\n",
        encoding="utf-8",
    )

    config = bootstrap(workspace_root=tmp_path)

    assert config.runtime_config["domain_package"] == "odd_sdlc"
    assert config.runtime_config["transport_contract"] == ".genesis/odd_sdlc/release/test_transport_contract.json"
    assert config.runtime_config["asset_binding_contract"]["command"] == [
        "python",
        "-m",
        "odd_sdlc",
        "query-assets",
        "--workspace",
        ".",
    ]
    assert "operator_asset_contract" not in config.runtime_config


def test_source_bootstrap_publishes_explicit_query_assets_contract(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)

    config = bootstrap(workspace_root=tmp_path)

    assert config.runtime_config["domain_package"] == "odd_sdlc"
    assert config.runtime_config["asset_binding_contract"]["command"] == [
        "python",
        "-m",
        "odd_sdlc",
        "query-assets",
        "--workspace",
        ".",
    ]


def test_bootstrap_preserves_lightweight_asset_binding_contract(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    runtime_contract = tmp_path / ".genesis" / "odd_sdlc" / "release" / "genesis.yml"
    runtime_contract.parent.mkdir(parents=True, exist_ok=True)
    runtime_contract.write_text(
        "\n".join(
            (
                'domain_package: odd_sdlc',
                'asset_binding_contract: {"command":["python","-m","odd_sdlc","query-assets","--workspace","."]}',
                "",
            )
        ),
        encoding="utf-8",
    )
    (tmp_path / ".genesis" / "genesis.yml").write_text(
        "runtime_contract: .genesis/odd_sdlc/release/genesis.yml\n",
        encoding="utf-8",
    )

    config = bootstrap(workspace_root=tmp_path)

    assert config.runtime_config["asset_binding_contract"]["command"] == [
        "python",
        "-m",
        "odd_sdlc",
        "query-assets",
        "--workspace",
        ".",
    ]


def test_missing_capability_is_projected_as_blocked_missing_capability(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_runtime_observation_surface",
                    "delta": 0.5,
                    "failing": ["missing_runtime_observation_contract"],
                    "passing": [],
                    "delta_summary": "runtime observation capability contract is not declared",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=True,
    )

    edge = payload["gaps"][0]
    triage_artifact = load_current_edge_triage(tmp_path, edge["edge"])
    assert edge["triage"]["process_outcome_kind"] == "blocked_missing_capability"
    assert edge["triage"]["framework_condition"] == "blocked"
    assert edge["triage"]["resumption_trigger"] == "capability_declaration_changed"
    assert edge["triage"]["policy_gate"] == {
        "state": "capability_blocked",
        "reason": "missing_capability",
    }
    assert edge["route_proposal"] is None
    assert edge["route_binding"]["state"] == "blocked_missing_capability"
    assert edge["route_binding"]["priority_source"] == "capability_gate"
    assert triage_artifact is not None
    assert triage_artifact["triage"]["process_outcome_kind"] == "blocked_missing_capability"
    assert triage_artifact["route_binding"]["state"] == "blocked_missing_capability"


def test_governed_workspace_constitutional_pressure_is_suppressed_by_default(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(
        bootstrap(
            workspace_root=tmp_path,
            runtime_config={"constitutional_repricing": {"mode": "suppress"}},
        )
    )

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_goal_surface",
                    "delta": 0.5,
                    "failing": ["goal_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "goal surface remains insufficient under the current constitution",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=True,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["process_outcome_kind"] == "propose_constitutional_reprice"
    assert edge["constitutional_proposal"]["state"] == "suppressed"
    assert edge["constitutional_proposal"]["policy_mode"] == "suppress"
    assert edge["route_binding"]["state"] == "suppressed_by_mode"
    events = list(app.stream.all_events())
    event_types = [event["event_type"] for event in events]
    assert "constitutional_proposal_recorded" in event_types
    constitutional_event = next(
        event for event in events if event["event_type"] == "constitutional_proposal_recorded"
    )
    assert constitutional_event["data"]["identity_hash"] == edge["constitutional_proposal"]["identity_hash"]


def test_constitutional_pressure_can_be_gated_to_fh_and_deferred(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(
        bootstrap(
            workspace_root=tmp_path,
            runtime_config={"constitutional_repricing": {"mode": "fh_gate"}},
        )
    )
    raw_gap_payload = {
        "scope": {},
        "jobs_considered": 1,
        "total_delta": 0.5,
        "open_frames": 0,
        "converged": False,
        "gaps": [
            {
                "edge": "derive_goal_surface",
                "delta": 0.5,
                "failing": ["goal_surface_semantically_converged"],
                "passing": [],
                "delta_summary": "goal surface remains insufficient under the current constitution",
                "environment_ready": True,
            }
        ],
    }

    initial = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=raw_gap_payload,
        runtime_config=app.config.runtime_config,
        publish=True,
    )

    assert initial["gaps"][0]["constitutional_proposal"]["state"] == "pending_fh"
    assert initial["gaps"][0]["route_binding"]["state"] == "await_fh_resolution"

    emit(
        "constitutional_proposal_deferred",
        {
            "edge": "derive_goal_surface",
            "proposal_id": initial["gaps"][0]["constitutional_proposal"]["proposal_id"],
            "reason": "operator deferred constitutional decision",
        },
        stream=app.stream,
    )

    deferred = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=raw_gap_payload,
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    assert deferred["gaps"][0]["constitutional_proposal"]["state"] == "defer"
    assert deferred["gaps"][0]["constitutional_proposal"]["resumption_trigger"] == "approved_or_revoked"
    assert deferred["gaps"][0]["route_binding"]["state"] == "deferred"


def test_constitutional_resolution_uses_stable_constitutional_proposal_identity(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(
        bootstrap(
            workspace_root=tmp_path,
            runtime_config={"constitutional_repricing": {"mode": "fh_gate"}},
        )
    )

    first = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=_goal_gap_payload("goal surface remains insufficient under the current constitution"),
        runtime_config=app.config.runtime_config,
        publish=True,
    )
    first_proposal = first["gaps"][0]["constitutional_proposal"]["proposal_id"]
    emit(
        "constitutional_proposal_deferred",
        {
            "edge": "derive_goal_surface",
            "proposal_id": first_proposal,
            "reason": "operator deferred earlier constitutional decision",
        },
        stream=app.stream,
    )

    second = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=_goal_gap_payload("goal surface remains contradictory under the current constitution"),
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    second_edge = second["gaps"][0]
    assert second_edge["constitutional_proposal"]["proposal_id"] == first_proposal
    assert second_edge["constitutional_proposal"]["state"] == "defer"
    assert second_edge["route_binding"]["state"] == "deferred"


def test_constitutional_resolution_mints_new_identity_after_material_target_surface_change(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(
        bootstrap(
            workspace_root=tmp_path,
            runtime_config={"constitutional_repricing": {"mode": "fh_gate"}},
        )
    )

    first = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=_goal_gap_payload(),
        runtime_config=app.config.runtime_config,
        publish=False,
    )
    first_proposal = first["gaps"][0]["constitutional_proposal"]["proposal_id"]
    emit(
        "constitutional_proposal_deferred",
        {
            "edge": "derive_goal_surface",
            "proposal_id": first_proposal,
            "reason": "operator deferred earlier constitutional decision",
        },
        stream=app.stream,
    )

    goals_path = tmp_path / "specification" / "GOALS.md"
    goals_path.write_text(
        goals_path.read_text(encoding="utf-8")
        + "\n\n## Material Change\n- newly introduced constitutional direction.\n",
        encoding="utf-8",
    )
    refresh_analysis(tmp_path, stage="material_surface_change")

    second = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=_goal_gap_payload(),
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    second_edge = second["gaps"][0]
    assert second_edge["constitutional_proposal"]["proposal_id"] != first_proposal
    assert second_edge["constitutional_proposal"]["state"] == "pending_fh"
    assert second_edge["route_binding"]["state"] == "await_fh_resolution"


def test_constitutional_proposal_identity_diverges_across_work_key_scope(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(
        bootstrap(
            workspace_root=tmp_path,
            runtime_config={"constitutional_repricing": {"mode": "fh_gate"}},
        )
    )

    workspace_scope = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=_goal_gap_payload(),
        runtime_config=app.config.runtime_config,
        publish=False,
    )
    work_scope = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=_goal_gap_payload(work_key="work::demo"),
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    workspace_proposal = workspace_scope["gaps"][0]["constitutional_proposal"]
    work_proposal = work_scope["gaps"][0]["constitutional_proposal"]
    assert workspace_proposal["proposal_id"] != work_proposal["proposal_id"]
    assert workspace_proposal["identity_hash"] != work_proposal["identity_hash"]
    assert workspace_proposal["state"] == "pending_fh"
    assert work_proposal["state"] == "pending_fh"


def test_invalid_constitutional_policy_mode_fails_closed(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(
        bootstrap(
            workspace_root=tmp_path,
            runtime_config={"constitutional_repricing": {"mode": "bogus"}},
        )
    )

    with pytest.raises(RuntimeError, match="invalid constitutional_repricing.mode"):
        enrich_gap_snapshot(
            workspace_root=tmp_path,
            stream=app.stream,
            workflow_version=app.scope().workflow_version,
            raw_gap_payload=_goal_gap_payload(),
            runtime_config=app.config.runtime_config,
            publish=False,
        )


def test_emit_event_cmd_accepts_constitutional_operator_events(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    initialize(bootstrap(workspace_root=tmp_path))

    deferred = _emit_event_cmd(
        "constitutional_proposal_deferred",
        json.dumps(
            {
                "edge": "derive_goal_surface",
                "proposal_id": "const_demo",
                "reason": "operator deferred constitutional decision",
            }
        ),
        tmp_path,
    )
    approved = _emit_event_cmd(
        "constitutional_proposal_approved_with_edits",
        json.dumps(
            {
                "edge": "derive_goal_surface",
                "proposal_id": "const_demo",
                "actor": "human",
            }
        ),
        tmp_path,
    )

    assert deferred == 0
    assert approved == 0
    event_types = [event["event_type"] for event in _read_events(tmp_path)]
    assert "constitutional_proposal_deferred" in event_types
    assert "constitutional_proposal_approved_with_edits" in event_types


def test_shallow_code_findings_do_not_publish_deepening_strategy(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    code_root = asset_path(tmp_path, "code_surface")
    _write_test28_pass2_replay_code(code_root)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.75,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_code_surface",
                    "delta": 0.75,
                    "failing": ["code_traceability_present"],
                    "passing": [],
                    "delta_summary": "existing code realization is still shallow",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["framework_condition"] == "unproven"
    assert edge["triage"]["gap_kind"] == "code_gap"
    assert edge["route_proposal"]["fixed_vector"] == "repair_output_contract"
    assert edge["route_binding"]["state"] == "advance_fixed_vector"
    assert edge["route_binding"]["selected_vector"] == "repair_output_contract"
    assert edge["triage"]["asset_findings"] == []
    assert edge["triage"]["extensions"] == {}


def test_realization_edge_fp_retry_policy_reenters_declared_graph_function(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_code_surface",
                    "delta": 0.5,
                    "failing": [
                        "derive_code_surface_obligation_ledger_carry_converged",
                        "code_surface_semantically_converged",
                    ],
                    "passing": [],
                    "delta_summary": "code realization needs another admitted turn",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    edge = payload["gaps"][0]
    iteration = edge["triage"]["realization_iteration"]
    assert edge["triage"]["process_outcome_kind"] == "advance_declared_graph_function"
    assert edge["route_proposal"]["vector_kind"] == "declared_graph_function"
    assert edge["route_proposal"]["selected_graphfunction"] == "derive_code_surface"
    assert edge["route_binding"]["state"] == "advance_declared_graph_function"
    assert edge["route_binding"]["selected_graphfunction"] == "derive_code_surface"
    assert edge["route_binding"]["priority_source"] == "triage.realization_iteration"
    assert iteration["edge_id"] == "derive_code_surface"
    assert iteration["evaluator_id"] == "code_surface_semantically_converged"
    assert iteration["classification"] == "deepening_eligible"
    assert iteration["deepening_eligible"] is True
    assert iteration["dispatch_index"] == 0
    assert iteration["carry_delta"] == pytest.approx(0.5)


def test_realization_edge_without_fp_retry_policy_falls_back_to_fixed_vector(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    monkeypatch.setattr(
        triage_module,
        "_edge_fp_retry_policy",
        lambda *_args, **_kwargs: None,
    )

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_code_surface",
                    "delta": 0.5,
                    "failing": [
                        "derive_code_surface_obligation_ledger_carry_converged",
                        "code_surface_semantically_converged",
                    ],
                    "passing": [],
                    "delta_summary": "code realization deepening is no longer declared",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["process_outcome_kind"] == "advance_fixed_vector"
    assert edge["route_proposal"]["fixed_vector"] == "repair_output_contract"
    assert edge["route_binding"]["state"] == "advance_fixed_vector"
    assert edge["route_binding"]["selected_vector"] == "repair_output_contract"


def test_realization_iteration_classification_is_published_in_triage_and_route_events(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_code_surface",
                    "delta": 0.5,
                    "failing": [
                        "derive_code_surface_obligation_ledger_carry_converged",
                        "code_surface_semantically_converged",
                    ],
                    "passing": [],
                    "delta_summary": "code realization remains incomplete after the first admitted turn",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=True,
    )

    edge = payload["gaps"][0]
    triage_event = next(event for event in app.stream.all_events() if event["event_type"] == "triage_produced")
    route_event = next(event for event in app.stream.all_events() if event["event_type"] == "route_recorded")

    assert edge["triage"]["realization_iteration"]["classification"] == "deepening_eligible"
    assert triage_event["data"]["realization_iteration"] == {
        "edge_id": "derive_code_surface",
        "evaluator_id": "code_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
        "carry_delta": 0.5,
        "dispatch_index": 0,
    }
    assert route_event["data"]["realization_iteration"] == triage_event["data"]["realization_iteration"]
    assert route_event["data"]["priority_source"] == "triage.realization_iteration"
    assert route_event["data"]["selected_graphfunction"] == "derive_code_surface"


def test_live_graph_edge_maps_testcase_authority_to_test_reentry(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "qualify_testcase_authority",
                    "delta": 0.5,
                    "failing": ["testcase_authority_validated"],
                    "passing": [],
                    "delta_summary": "testcase authority remains incomplete",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["framework_layer"] == "test"
    assert edge["triage"]["reentry_layer"] == "test"
    assert edge["route_proposal"]["fixed_vector"] == "realize_missing_tests"


def test_product_gap_reopens_product_surface(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "derive_product_surface",
                    "delta": 0.5,
                    "failing": ["product_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "product surface remains unresolved under the current intent authority",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["framework_layer"] == "product"
    assert edge["triage"]["reentry_layer"] == "product"
    assert edge["triage"]["gap_kind"] == "unclassified_gap"
    assert edge["triage"]["process_outcome_kind"] == "advance_fixed_vector"
    assert edge["route_proposal"]["fixed_vector"] == "reopen_product"
    assert edge["route_binding"]["state"] == "advance_fixed_vector"


def test_release_gap_uses_declared_graph_function_route(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "prepare_release_surface",
                    "delta": 0.5,
                    "failing": ["release_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "release preparation is unresolved but has no lawful re-entry vector",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["framework_layer"] == "execution"
    assert edge["triage"]["process_outcome_kind"] == "advance_declared_graph_function"
    assert edge["route_binding"]["state"] == "advance_declared_graph_function"
    assert edge["route_binding"]["selected_graphfunction"] == "prepare_release_surface"


def test_release_gap_without_declared_route_is_explicit_no_lawful_route(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    monkeypatch.setattr(
        triage_module,
        "_declared_head_graph_function_routes",
        lambda _workspace_root: frozenset(),
    )

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "prepare_release_surface",
                    "delta": 0.5,
                    "failing": ["release_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "release preparation is unresolved but has no lawful re-entry vector",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config=app.config.runtime_config,
        publish=False,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["framework_layer"] == "execution"
    assert edge["triage"]["framework_condition"] == "unroutable"
    assert edge["triage"]["process_outcome_kind"] == "no_lawful_route"
    assert edge["route_binding"]["state"] == "no_lawful_route"


def test_release_gap_without_declaration_fails_closed_even_with_dynamic_candidate(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    monkeypatch.setattr(
        triage_module,
        "_declared_head_graph_function_routes",
        lambda _workspace_root: frozenset(),
    )

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "prepare_release_surface",
                    "delta": 0.5,
                    "failing": ["release_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "release preparation is unresolved and must not be dynamically rescued",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config={
            "dynamic_routing": {
                "candidates": [
                    {
                        "family": "execution_recovery",
                        "graphfunction": "prepare_release_surface",
                        "priority": 100,
                        "applies_to": {
                            "edge": "prepare_release_surface",
                            "framework_layer": "execution",
                        },
                    }
                ]
            }
        },
        publish=False,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["process_outcome_kind"] == "no_lawful_route"
    assert edge["route_binding"]["state"] == "no_lawful_route"
    assert (
        edge["route_binding"]["no_lawful_route_reason"]
        == "graph_function_only_route_requires_declaration"
    )


def test_dynamic_route_selection_is_deterministic_across_matching_candidates(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))
    raw_gap_payload = {
        "scope": {},
        "jobs_considered": 1,
        "total_delta": 0.5,
        "open_frames": 0,
        "converged": False,
            "gaps": [
                {
                    "edge": "prepare_deployment_surface",
                    "delta": 0.5,
                    "failing": ["deployment_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "deployment preparation is unresolved and should route through dynamic recovery",
                    "environment_ready": True,
                }
            ],
    }
    dynamic_candidates = [
        {
            "family": "execution_recovery",
            "graphfunction": "zz_candidate",
            "priority": 5,
            "applies_to": {"edge": "prepare_deployment_surface", "framework_layer": "execution"},
        },
        {
            "family": "execution_recovery",
            "graphfunction": "aa_candidate",
            "priority": 5,
            "applies_to": {"edge": "prepare_deployment_surface", "framework_layer": "execution"},
        },
    ]

    first = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=raw_gap_payload,
        runtime_config={"dynamic_routing": {"candidates": dynamic_candidates}},
        publish=False,
    )
    second = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload=raw_gap_payload,
        runtime_config={"dynamic_routing": {"candidates": list(reversed(dynamic_candidates))}},
        publish=False,
    )

    first_edge = first["gaps"][0]
    second_edge = second["gaps"][0]
    assert first_edge["triage"]["process_outcome_kind"] == "advance_dynamic_family"
    assert first_edge["route_proposal"]["dynamic_family"] == "execution_recovery"
    assert first_edge["route_binding"]["state"] == "advance_dynamic_family"
    assert first_edge["route_binding"]["selected_graphfunction"] == "aa_candidate"
    assert second_edge["route_binding"]["selected_graphfunction"] == "aa_candidate"


def test_zero_candidate_dynamic_route_is_explicit_no_lawful_route(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    payload = enrich_gap_snapshot(
        workspace_root=tmp_path,
        stream=app.stream,
        workflow_version=app.scope().workflow_version,
        raw_gap_payload={
            "scope": {},
            "jobs_considered": 1,
            "total_delta": 0.5,
            "open_frames": 0,
            "converged": False,
            "gaps": [
                {
                    "edge": "prepare_deployment_surface",
                    "delta": 0.5,
                    "failing": ["deployment_surface_semantically_converged"],
                    "passing": [],
                    "delta_summary": "deployment preparation is unresolved and declared dynamic routing found no candidates",
                    "environment_ready": True,
                }
            ],
        },
        runtime_config={"dynamic_routing": {"candidates": []}},
        publish=False,
    )

    edge = payload["gaps"][0]
    assert edge["triage"]["process_outcome_kind"] == "no_lawful_route"
    assert edge["route_binding"]["state"] == "no_lawful_route"
    assert edge["route_binding"]["no_lawful_route_reason"] == "no_matching_dynamic_candidate"


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
    graph_function_names = [entry["name"] for entry in result["graph_functions"]]
    assert graph_function_names == _expected_graph_function_names(graph_function_names)
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
    shared_consensus_index = 1
    if "release_operational_cycle" in graph_function_names:
        operational = result["graph_functions"][1]
        assert operational["intent"] == RELEASE_OPERATIONAL_CYCLE_INTENT
        assert operational["function_kind"] == "odd_executive_graph_function"
        assert operational["template_kind"] == "inline_graph"
        assert operational["inputs"] == ["release_surface", "test_run_archive_surface"]
        assert operational["outputs"] == ["retrofit_plan_surface"]
        assert [vector["name"] for vector in operational["vectors"]] == list(RELEASE_OPERATIONAL_CYCLE_STEPS)
        assert operational["job_names"] == ["release_operational_cycle_job"]
        shared_consensus_index = 2
    shared_consensus_round = result["graph_functions"][shared_consensus_index]
    assert shared_consensus_round["function_kind"] == "odd_consensus_plugin_round_graph_function"
    assert shared_consensus_round["plugin_kind"] == "shared_consensus_plugin"
    assert shared_consensus_round["harness_kind"] == "consensus_round"
    assert shared_consensus_round["template_kind"] == "symbolic"
    assert shared_consensus_round["inputs"] == ["subject_surface"]
    assert shared_consensus_round["outputs"] == ["reviewed_subject_surface"]
    assert shared_consensus_round["job_names"] == []
    assert shared_consensus_round["harness_contract"] == {
        "subject_asset": "subject_surface",
        "assessment_asset": "review_assessment_surface",
        "decision_asset": "consensus_decision_surface",
        "reviewed_asset": "reviewed_subject_surface",
        "assessment_vector_asset": "review_assessment_vector",
        "injected_functions": {
            "review_round": "review_subject_assessment_round",
            "reduce": "reduce_subject_consensus_decision",
            "apply": "apply_subject_consensus_decision",
        },
        "policy_rule": "subject_consensus_rule",
        "composable": True,
        "recursive": True,
    }
    assert shared_consensus_round["harness_implementation"] == {
        "custom_functions": (
            "review_subject_assessment_round",
            "reduce_subject_consensus_decision",
            "apply_subject_consensus_decision",
        ),
        "policy_rule": "subject_consensus_rule",
    }
    shared_consensus_library = result["graph_functions"][shared_consensus_index + 1]
    assert shared_consensus_library["function_kind"] == "odd_consensus_plugin_graph_function"
    assert shared_consensus_library["plugin_kind"] == "shared_consensus_plugin"
    assert shared_consensus_library["harness_kind"] == "consensus_harness"
    assert shared_consensus_library["template_kind"] == "symbolic"
    assert shared_consensus_library["inputs"] == ["subject_surface"]
    assert shared_consensus_library["outputs"] == ["reviewed_subject_surface"]
    assert shared_consensus_library["vectors"] == []
    assert shared_consensus_library["job_names"] == []
    assert shared_consensus_library["harness_contract"] == shared_consensus_round["harness_contract"]
    assert shared_consensus_library["harness_implementation"] == shared_consensus_round["harness_implementation"]
    consensus_round = result["graph_functions"][shared_consensus_index + 2]
    assert consensus_round["function_kind"] == "odd_consensus_round_graph_function"
    assert consensus_round["harness_kind"] == "consensus_round"
    assert consensus_round["host_binding_of"] == "review_subject_consensus_round"
    assert consensus_round["host_binding_kind"] == "design_review"
    assert consensus_round["host_subject_asset"] == "design_surface"
    assert consensus_round["host_reviewed_asset"] == "reviewed_design_surface"
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
    consensus_vectors = {vector["name"]: vector for vector in consensus_round["vectors"]}
    assert list(consensus_vectors) == [
        "derive_review_assessment_surface",
        "derive_consensus_decision_surface",
        "derive_reviewed_design_surface",
    ]
    assert consensus_vectors["derive_review_assessment_surface"]["source"] == ["design_surface"]
    assert consensus_vectors["derive_review_assessment_surface"]["target"] == "review_assessment_surface"
    assert consensus_vectors["derive_review_assessment_surface"]["obligation_ledger"] == _generic_fp_obligation_ledger(
        "derive_review_assessment_surface",
        "review_assessment_surface_semantically_converged",
        "The review assessment surface is semantically converged for the current design under review.",
    )
    assert consensus_vectors["derive_consensus_decision_surface"]["source"] == ["review_assessment_surface"]
    assert consensus_vectors["derive_consensus_decision_surface"]["target"] == "consensus_decision_surface"
    assert consensus_vectors["derive_consensus_decision_surface"]["obligation_ledger"] == _generic_fp_obligation_ledger(
        "derive_consensus_decision_surface",
        "consensus_decision_surface_semantically_converged",
        "The consensus decision surface is semantically converged for the current review assessment round.",
    )
    assert consensus_vectors["derive_reviewed_design_surface"]["source"] == [
        "design_surface",
        "consensus_decision_surface",
    ]
    assert consensus_vectors["derive_reviewed_design_surface"]["target"] == "reviewed_design_surface"
    assert consensus_vectors["derive_reviewed_design_surface"]["obligation_ledger"] == _generic_fp_obligation_ledger(
        "derive_reviewed_design_surface",
        "reviewed_design_surface_semantically_converged",
        "The reviewed design surface is semantically converged for the current design and consensus decision state.",
    )
    assert consensus_round["job_names"] == []
    consensus_library = result["graph_functions"][shared_consensus_index + 3]
    assert consensus_library["function_kind"] == "odd_consensus_library_graph_function"
    assert consensus_library["harness_kind"] == "consensus_harness"
    assert consensus_library["host_binding_of"] == "review_subject_by_consensus"
    assert consensus_library["host_binding_kind"] == "design_review"
    assert consensus_library["host_subject_asset"] == "design_surface"
    assert consensus_library["host_reviewed_asset"] == "reviewed_design_surface"
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
    comment_consensus_round = result["graph_functions"][shared_consensus_index + 4]
    assert comment_consensus_round["function_kind"] == "odd_consensus_host_binding_round_graph_function"
    assert comment_consensus_round["plugin_kind"] == "host_binding"
    assert comment_consensus_round["host_binding_of"] == "review_subject_consensus_round"
    assert comment_consensus_round["host_binding_kind"] == "comment_review"
    assert comment_consensus_round["host_subject_asset"] == "comment_review_subject_surface"
    assert comment_consensus_round["host_reviewed_asset"] == "reviewed_comment_surface"
    assert comment_consensus_round["inputs"] == ["comment_review_subject_surface"]
    assert comment_consensus_round["outputs"] == ["reviewed_comment_surface"]
    assert comment_consensus_round["template_kind"] == "symbolic"
    assert comment_consensus_round["job_names"] == []
    comment_consensus_library = result["graph_functions"][shared_consensus_index + 5]
    assert comment_consensus_library["function_kind"] == "odd_consensus_host_binding_graph_function"
    assert comment_consensus_library["plugin_kind"] == "host_binding"
    assert comment_consensus_library["host_binding_of"] == "review_subject_by_consensus"
    assert comment_consensus_library["host_binding_kind"] == "comment_review"
    assert comment_consensus_library["host_subject_asset"] == "comment_review_subject_surface"
    assert comment_consensus_library["host_reviewed_asset"] == "reviewed_comment_surface"
    assert comment_consensus_library["inputs"] == ["comment_review_subject_surface"]
    assert comment_consensus_library["outputs"] == ["reviewed_comment_surface"]
    assert comment_consensus_library["template_kind"] == "symbolic"
    assert comment_consensus_library["job_names"] == []
    assert result["programs"] == _expected_program_entries(graph_function_names)


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
        "asset_ownership_index",
        "asset_types",
        "assets",
        "bindings",
        "collections",
        "continuations",
        "edge_contracts",
        "execution_contract_surface",
        "functions",
        "gap_dossier",
        "graph_calls",
        "graph_functions",
        "jobs",
        "operational_capabilities",
        "programs",
        "query_contract",
        "recent_events",
        "requirement_closure_register",
        "runs",
        "semantic_facets",
        "start_target_catalog",
        "work_act_types",
        "workspace_root",
    ]
    assert len(payload["assets"]) == len(ASSET_PATHS)
    assert len(payload["functions"]) == 24
    assert len(payload["asset_families"]) == 8
    assert len(payload["work_act_types"]) == 8
    assert len(payload["edge_contracts"]) == 7
    assert len(payload["collections"]) == 1
    graph_function_names = [entry["name"] for entry in payload["graph_functions"]]
    assert payload["programs"] == _expected_program_entries(graph_function_names)
    assert payload["gap_dossier"]["converged"] is False
    assert payload["runs"] == []
    assert payload["graph_calls"] == []
    assert payload["continuations"] == []
    assert payload["recent_events"] == []
    assert payload["ambiguity_register"]["register_kind"] == "odd_sdlc.ambiguity_register"
    assert payload["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert payload["operational_capabilities"]["projection_kind"] == "odd_sdlc.operational_capabilities"
    assert graph_function_names == _expected_graph_function_names(graph_function_names)
    graph_functions = {entry["name"]: entry for entry in payload["graph_functions"]}
    assert graph_functions[DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION]["selection_visible"] is False
    assert graph_functions[ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION]["selection_visible"] is False
    start_targets = {entry["handle"]: entry for entry in payload["start_target_catalog"]}
    assert start_targets[DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION]["start_addressable"] is False
    assert start_targets[DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION]["execution_binding"] == "not_start_addressable"
    assert start_targets[ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION]["start_addressable"] is False
    assert start_targets[ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION]["execution_binding"] == "not_start_addressable"
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
    assert payload["query_contract"] == {
        "name": "odd_sdlc.query-domain",
        "version": "v17",
        "top_level_keys": [
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
        ],
        "runtime_model": "abg-native",
        "query_model": "odd-domain-plugin",
    }
    assert payload["operational_capabilities"]["projection_kind"] == "odd_sdlc.operational_capabilities"
    assert payload["operational_capabilities"]["families"]["build_execution"]["state"] == "undeclared"
    assert payload["operational_capabilities"]["families"]["test_execution"]["state"] == "undeclared"
    assert payload["operational_capabilities"]["families"]["deployment"]["state"] == "undeclared"
    assert payload["operational_capabilities"]["families"]["runtime_observation"]["state"] == "undeclared"
    assert "runs" not in payload
    assert "graph_calls" not in payload
    assert "continuations" not in payload
    assert len(payload["assets"]) == len(ASSET_PATHS)
    assert len(payload["functions"]) == 24
    assert len(payload["asset_families"]) == 8
    assert len(payload["work_act_types"]) == 8
    assert len(payload["edge_contracts"]) == 7
    assert len(payload["collections"]) == 1
    assert len(payload["programs"]) == 1
    assert payload["gap_dossier"]["published"] is False
    assert payload["gap_dossier"]["unavailable_reason"] == "workspace_state_unpublished"
    assert payload["gap_dossier"]["converged"] is False
    assert payload["gap_dossier"]["analysis_current"] is False
    assert payload["gap_dossier"]["analysis_manifest"] is None
    assert payload["gap_dossier"]["dossiers"] == []
    assert payload["ambiguity_register"]["register_kind"] == "odd_sdlc.ambiguity_register"
    assert payload["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert payload["asset_families"][0]["name"] == "worksite_inputs"
    assert payload["work_act_types"][0]["name"] == "generate"
    assert payload["edge_contracts"][0]["name"] == "bootstrap_spec_foundation"
    start_targets = {entry["handle"]: entry for entry in payload["start_target_catalog"]}
    assert start_targets["bootstrap_release_self_test"]["start_addressable"] is True
    assert start_targets["bootstrap_release_self_test"]["carrier_class"] == "executive_carrier"
    assert start_targets["review_design_consensus_round"]["start_addressable"] is True
    assert start_targets["review_design_consensus_round"]["carrier_class"] == "host_binding"
    assert start_targets["review_subject_by_consensus"]["start_addressable"] is False
    asset_ownership = {entry["handle"]: entry for entry in payload["asset_ownership_index"]}
    assert asset_ownership["code_surface"]["operator_target"]["handle"] == "bootstrap_release_self_test"
    assert asset_ownership["reviewed_design_surface"]["operator_target"]["handle"] == "review_design_consensus_round"
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
    for absent_name in (
        "prepare_build_execution_surface",
        "derive_build_execution_result_surface",
        "prepare_test_execution_surface",
        "derive_test_execution_result_surface",
        "prepare_deployment_surface",
        "derive_deployment_result_surface",
        "derive_deployed_environment_surface",
        "derive_runtime_observation_surface",
        "derive_retrofit_plan_surface",
    ):
        assert absent_name not in functions
    assert [entry["name"] for entry in payload["graph_functions"]] == [
        name for name in GRAPH_FUNCTION_NAMES if name != "release_operational_cycle"
    ]
    graph_functions = {entry["name"]: entry for entry in payload["graph_functions"]}
    assert graph_functions["bootstrap_release_self_test"]["job_names"] == ["bootstrap_release_self_test_job"]
    assert "release_operational_cycle" not in graph_functions
    assert graph_functions["review_design_consensus_round"]["job_names"] == []
    assert graph_functions["review_subject_consensus_round"]["job_names"] == []
    assert graph_functions["review_subject_by_consensus"]["job_names"] == []
    assert graph_functions[DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION]["job_names"] == []
    assert graph_functions[DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION]["selection_visible"] is False
    assert graph_functions[ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION]["job_names"] == []
    assert graph_functions[ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION]["selection_visible"] is False
    assert start_targets[DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION]["start_addressable"] is False
    assert start_targets[ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION]["start_addressable"] is False
    assert [vector["name"] for vector in graph_functions["bootstrap_release_self_test"]["vectors"]] == list(
        BOOTSTRAP_RELEASE_SELF_TEST_STEPS
    )
    bootstrap_vectors = {vector["name"]: vector for vector in graph_functions["bootstrap_release_self_test"]["vectors"]}
    assert bootstrap_vectors["derive_feature_decomp_surface"]["obligation_ledger"] == {
        "signal_key": "derive_feature_decomp_surface",
        "adapter_ref": "odd_sdlc.requirement_closure:declared_requirement_edge_gap",
        "obligation_source_ref": "requirement_surface",
        "obligation_source_kind": "requirement_surface",
        "obligation_source_admission_basis": "authority_or_current_surface",
        "obligation_kind": "requirement",
        "derivation_rule": "identity",
        "carry_rule": "deterministic_requirement_membership",
        "fulfillment_rule": "feature_decomp_surface_coverage",
        "evidence_policy": "feature_decomp_traceability",
    }
    assert bootstrap_vectors["derive_uat_testcases_surface"]["obligation_ledger"] == {
        "signal_key": "derive_uat_testcases_surface",
        "adapter_ref": "odd_sdlc.requirement_closure:declared_requirement_edge_gap",
        "obligation_source_ref": "requirement_surface",
        "obligation_source_kind": "requirement_surface",
        "obligation_source_admission_basis": "authority_or_current_surface",
        "obligation_kind": "requirement",
        "derivation_rule": "identity",
        "carry_rule": "deterministic_requirement_membership",
        "fulfillment_rule": "uat_testcases_surface_coverage",
        "evidence_policy": "uat_testcase_traceability",
    }
    assert bootstrap_vectors["derive_design_surface"]["obligation_ledger"] == {
        "signal_key": "derive_design_surface",
        "adapter_ref": "odd_sdlc.requirement_closure:declared_requirement_edge_gap",
        "obligation_source_ref": "requirement_surface",
        "obligation_source_kind": "requirement_surface",
        "obligation_source_admission_basis": "authority_or_current_surface",
        "obligation_kind": "requirement",
        "derivation_rule": "identity",
        "carry_rule": "deterministic_requirement_membership",
        "fulfillment_rule": "design_surface_coverage",
        "evidence_policy": "design_surface_traceability",
    }
    assert bootstrap_vectors["derive_scenario_surface"]["obligation_ledger"] == {
        "signal_key": "derive_scenario_surface",
        "adapter_ref": "odd_sdlc.requirement_closure:declared_requirement_edge_gap",
        "obligation_source_ref": "requirement_surface",
        "obligation_source_kind": "requirement_surface",
        "obligation_source_admission_basis": "authority_or_current_surface",
        "obligation_kind": "requirement",
        "derivation_rule": "identity",
        "carry_rule": "deterministic_requirement_membership",
        "fulfillment_rule": "scenario_surface_coverage",
        "evidence_policy": "scenario_surface_traceability",
    }

    module = odd_sdlc_module(tmp_path)
    vectors_by_name = {
        vector.name: vector
        for function in module.graph_functions
        for vector in (function.template.graph.vectors if function.template.graph is not None else ())
    }
    assert [evaluator.name for evaluator in vectors_by_name["derive_feature_decomp_surface"].evaluators] == [
        "feature_decomp_dependency_surfaces_present",
        "derive_feature_decomp_surface_obligation_ledger_carry_converged",
        "feature_decomp_surface_semantically_converged",
    ]
    assert [evaluator.name for evaluator in vectors_by_name["derive_uat_testcases_surface"].evaluators] == [
        "uat_testcases_dependency_surfaces_present",
        "derive_uat_testcases_surface_obligation_ledger_carry_converged",
        "uat_testcases_surface_semantically_converged",
    ]
    assert [evaluator.name for evaluator in vectors_by_name["derive_design_surface"].evaluators] == [
        "design_dependency_surfaces_present",
        "derive_design_surface_obligation_ledger_carry_converged",
        "design_surface_semantically_converged",
    ]
    assert [evaluator.name for evaluator in vectors_by_name["derive_scenario_surface"].evaluators] == [
        "scenario_dependency_surfaces_present",
        "derive_scenario_surface_obligation_ledger_carry_converged",
        "scenario_surface_semantically_converged",
    ]
    assert vectors_by_name["derive_implementation_module_surface"].declarations["fp_retry_policy"].to_dict() == {
        "evaluator_id": "implementation_module_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
    }
    assert vectors_by_name["derive_code_surface"].declarations["fp_retry_policy"].to_dict() == {
        "evaluator_id": "code_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
    }
    assert vectors_by_name["derive_test_design_surface"].declarations["fp_retry_policy"].to_dict() == {
        "evaluator_id": "test_design_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
    }
    assert vectors_by_name["derive_test_module_surface"].declarations["fp_retry_policy"].to_dict() == {
        "evaluator_id": "test_module_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
    }
    assert bootstrap_vectors["derive_code_surface"]["obligation_ledger"] == {
        "signal_key": "derive_code_surface",
        "adapter_ref": "odd_sdlc.requirement_closure:declared_requirement_edge_gap",
        "obligation_source_ref": "requirement_surface",
        "obligation_source_kind": "requirement_surface",
        "obligation_source_admission_basis": "authority_or_current_surface",
        "obligation_kind": "requirement",
        "derivation_rule": "implementation_code_projection",
        "carry_rule": "deterministic_requirement_membership",
        "fulfillment_rule": "behavioral_code_realization",
        "evidence_policy": "behavioral_code_evidence",
    }
    assert bootstrap_vectors["derive_implementation_module_surface"]["fp_retry_policy"] == {
        "evaluator_id": "implementation_module_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
    }
    assert bootstrap_vectors["derive_code_surface"]["fp_retry_policy"] == {
        "evaluator_id": "code_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
    }
    assert bootstrap_vectors["derive_implementation_design_surface"]["obligation_ledger"] == {
        "signal_key": "derive_implementation_design_surface",
        "adapter_ref": "odd_sdlc.requirement_closure:declared_requirement_edge_gap",
        "obligation_source_ref": "requirement_surface",
        "obligation_source_kind": "requirement_surface",
        "obligation_source_admission_basis": "authority_or_current_surface",
        "obligation_kind": "requirement",
        "derivation_rule": "implementation_design_projection",
        "carry_rule": "deterministic_requirement_membership",
        "fulfillment_rule": "implementation_design_surface_coverage",
        "evidence_policy": "implementation_design_traceability",
    }
    assert bootstrap_vectors["derive_test_design_surface"]["obligation_ledger"] == {
        "signal_key": "derive_test_design_surface",
        "adapter_ref": "odd_sdlc.requirement_closure:declared_requirement_edge_gap",
        "obligation_source_ref": "requirement_surface",
        "obligation_source_kind": "requirement_surface",
        "obligation_source_admission_basis": "authority_or_current_surface",
        "obligation_kind": "requirement",
        "derivation_rule": "validation_design_projection",
        "carry_rule": "deterministic_requirement_membership",
        "fulfillment_rule": "test_design_surface_coverage",
        "evidence_policy": "planned_test_design_coverage",
    }
    assert bootstrap_vectors["derive_test_design_surface"]["fp_retry_policy"] == {
        "evaluator_id": "test_design_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
    }
    assert bootstrap_vectors["derive_test_module_surface"]["fp_retry_policy"] == {
        "evaluator_id": "test_module_surface_semantically_converged",
        "classification": "deepening_eligible",
        "deepening_eligible": True,
    }
    assert bootstrap_vectors["derive_requirement_surface"]["obligation_ledger"] == _generic_fp_obligation_ledger(
        "derive_requirement_surface",
        "requirement_surface_semantically_converged",
        "The requirement family surface is semantically converged for the current workspace input set.",
        evaluator_index=2,
    )
    assert bootstrap_vectors["select_test_stack_profile"]["obligation_ledger"] == _generic_fp_obligation_ledger(
        "select_test_stack_profile",
        "test_stack_profile_semantically_converged",
        "The test stack profile is semantically converged for the current generated test design.",
    )
    assert [vector["name"] for vector in graph_functions["review_design_consensus_round"]["vectors"]] == [
        "derive_review_assessment_surface",
        "derive_consensus_decision_surface",
        "derive_reviewed_design_surface",
    ]
    assert payload["graph_functions"][3]["template_kind"] == "inline_graph"
    assert [vector["name"] for vector in payload["graph_functions"][3]["vectors"]] == [
        "derive_review_assessment_surface",
        "derive_consensus_decision_surface",
        "derive_reviewed_design_surface",
    ]


def test_t021_gap_support_helpers_have_one_authoritative_owner() -> None:
    app_source = (CODE_PATH / "odd_sdlc" / "app.py").read_text(encoding="utf-8")
    analysis_source = (CODE_PATH / "odd_sdlc" / "analysis.py").read_text(encoding="utf-8")
    span_source = (CODE_PATH / "odd_sdlc" / "span_analysis.py").read_text(encoding="utf-8")
    constructor_source = (CODE_PATH / "odd_sdlc" / "constructor.py").read_text(encoding="utf-8")
    execution_contract_source = (CODE_PATH / "odd_sdlc" / "execution_contract.py").read_text(encoding="utf-8")
    gap_dossier_source = (CODE_PATH / "odd_sdlc" / "gap_dossier.py").read_text(encoding="utf-8")
    normalization_source = (CODE_PATH / "odd_sdlc" / "normalization.py").read_text(encoding="utf-8")
    operational_dispatch_source = (CODE_PATH / "odd_sdlc" / "operational_dispatch.py").read_text(encoding="utf-8")
    publication_io_source = (CODE_PATH / "odd_sdlc" / "publication_io.py").read_text(encoding="utf-8")
    project_profile_source = (CODE_PATH / "odd_sdlc" / "project_profile.py").read_text(encoding="utf-8")
    traceability_index_source = (CODE_PATH / "odd_sdlc" / "traceability_index.py").read_text(encoding="utf-8")

    assert "def _parse_scope_selector" not in app_source
    assert "def _declared_obligation_specs" not in app_source
    assert "def _capability_gap_entries" not in app_source

    assert "def parse_gap_scope_selector" in span_source
    assert "def declared_obligation_specs" in span_source
    assert "def capability_gap_entries" in span_source

    assert "def _strip_quotes" not in constructor_source
    assert "def _project_constraints_path" not in constructor_source
    assert "def _project_constraint_scalar" not in constructor_source
    assert "def _module_names" not in constructor_source
    assert "def _classify_operational_binding" not in constructor_source
    assert "def _load_operational_dispatch_register" not in constructor_source
    assert "_OPERATIONAL_DISPATCH_REGISTER_PATH" not in constructor_source
    assert "from .operational_dispatch import classify_operational_binding" in constructor_source
    assert "from .operational_dispatch import latest_operational_dispatch" in constructor_source
    assert "def _write_json_if_changed" not in analysis_source
    assert "def _write_text_if_changed" not in analysis_source
    assert "def _write_json_if_changed" not in gap_dossier_source
    assert "def _write_text_if_changed" not in gap_dossier_source
    assert "def _write_if_changed" not in execution_contract_source
    assert "def _workspace_mode" not in analysis_source
    assert "def _workspace_mode" not in traceability_index_source
    assert "def default_project_slug" not in normalization_source

    assert "def strip_scalar_quotes" in project_profile_source
    assert "def default_project_slug" in project_profile_source
    assert "def declared_module_names" in project_profile_source
    assert "def resolve_workspace_mode" in project_profile_source
    assert "def classify_operational_binding" in operational_dispatch_source
    assert "def load_operational_dispatch_register" in operational_dispatch_source
    assert "def latest_operational_dispatch" in operational_dispatch_source
    assert "def write_json_if_changed" in publication_io_source
    assert "def write_text_if_changed" in publication_io_source


def test_b043_operational_dispatch_is_a_single_step_cooperative_adapter() -> None:
    operational_dispatch_source = (CODE_PATH / "odd_sdlc" / "operational_dispatch.py").read_text(
        encoding="utf-8"
    )

    assert 'target="next"' not in operational_dispatch_source
    assert '_RELEASE_OPERATIONAL_CYCLE_TARGET = "graph_function:release_operational_cycle"' in operational_dispatch_source
    assert "def _current_operational_dispatch_step" not in operational_dispatch_source
    assert "def _release_operational_cycle_entrypoint" not in operational_dispatch_source
    assert "while current.get(\"edge\") in _PROJECTION_ONLY_EDGES" not in operational_dispatch_source


def test_b047_test_lane_materializes_generated_source_before_archive_evidence(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)
    module = odd_sdlc_module(tmp_path)
    vectors_by_name = {
        vector.name: dict(vector.declarations["obligation_ledger"])
        for vector in module.graph_functions[0].materialize().vectors
    }
    constructor_source = (CODE_PATH / "odd_sdlc" / "constructor.py").read_text(encoding="utf-8")
    retired_realized_test_source_note = (
        ROOT / "build_tenants" / "python" / "design" / "fp" / "REALIZED_TEST_SOURCE_OBLIGATION.md"
    ).read_text(encoding="utf-8")

    assert vectors_by_name["derive_test_design_surface"]["derivation_rule"] == "validation_design_projection"
    assert vectors_by_name["derive_test_design_surface"]["evidence_policy"] == "planned_test_design_coverage"
    assert vectors_by_name["derive_test_module_surface"]["derivation_rule"] == "validation_module_projection"
    assert vectors_by_name["derive_test_module_surface"]["evidence_policy"] == "planned_test_module_coverage"
    assert vectors_by_name["derive_test_run_archive_surface"]["derivation_rule"] == "realized_test_source_projection"
    assert vectors_by_name["derive_test_run_archive_surface"]["fulfillment_rule"] == "realized_test_source"
    assert vectors_by_name["derive_test_run_archive_surface"]["evidence_policy"] == "realized_test_source_evidence"
    assert "_materialize_planned_generated_test_files" in constructor_source
    assert "planned_generated_test_source" in constructor_source
    assert "materializes deterministic generated developer-test source" in retired_realized_test_source_note
    assert "no longer published as runtime prompt strategy" in retired_realized_test_source_note.lower()


def test_b037_test_lane_carrier_orders_completeness_and_rejects_malformed_execution_without_source(
    tmp_path: Path,
) -> None:
    _seed_workspace(tmp_path)

    planned_lane = build_test_lane_evidence(tmp_path)
    assert planned_lane["completeness_state"] == "planned_validation_allocation"
    assert planned_lane["next_lawful_gain"] == "materialize_realized_test_source"
    assert planned_lane["blocking_reasons"] == ["missing_realized_test_source"]

    profile = load_project_profile(tmp_path)
    code_root = tmp_path / profile.code_relative_path()
    test_file = code_root / "src" / "test" / "scala" / "DataMapperSpec.scala"
    test_file.parent.mkdir(parents=True, exist_ok=True)
    test_file.write_text(
        "\n".join(
            (
                "// Validates: REQ-DM-001",
                "class DataMapperSpec:",
                "    pass",
                "",
            )
        ),
        encoding="utf-8",
    )

    realized_lane = build_test_lane_evidence(tmp_path)
    assert realized_lane["completeness_state"] == "realized_test_source"
    assert realized_lane["next_lawful_gain"] == "record_governed_test_execution_evidence"
    assert realized_lane["realized_test_source_requirement_ids"] == ["REQ-DM-001"]

    report_path = code_root / "target" / "test-reports" / "junit.xml"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(
        '<testsuite tests="1" failures="0" errors="0" skipped="0"></testsuite>',
        encoding="utf-8",
    )
    execution_lane = build_test_lane_evidence(
        tmp_path,
        test_summary={
            "report_file_count": 1,
            "parsed_report_count": 1,
            "tests": 1,
            "failures": 0,
            "errors": 0,
            "skipped": 0,
            "report_paths": ["build_tenants/python/code/target/test-reports/junit.xml"],
            "ungoverned_report_file_count": 0,
            "ungoverned_report_paths": [],
            "governing_capability": {
                "family": "test_execution",
                "field_name": "test_execution_contract",
                "cue": "pytest",
                "in_scope": True,
                "declared_value": "pytest",
                "declared": True,
                "state": "declared",
                "affected_assets": ["test_execution_surface", "test_execution_result_surface"],
                "expected_resolving_edges": [
                    "prepare_test_execution_surface",
                    "derive_test_execution_result_surface",
                ],
                "primary_edge": "prepare_test_execution_surface",
                "resolution_text": "pytest execution is declared for the governed workspace",
            },
        },
    )
    assert execution_lane["completeness_state"] == "governed_test_execution_evidence"
    assert execution_lane["next_lawful_gain"] == "none"

    with pytest.raises(
        ValueError,
        match="governed test execution evidence cannot be admitted without governed realized test source",
    ):
        admit_test_lane_evidence_payload(
            {
                "projection_kind": "odd_sdlc.test_lane_evidence",
                "completeness_state": "governed_test_execution_evidence",
                "next_lawful_gain": "none",
                "blocking_reasons": [],
                "planned_requirement_ids": [],
                "realized_test_source_requirement_ids": [],
                "archive_requirement_ids": [],
                "evidence_refs": [],
                "report_paths": ["code/target/test-reports/junit.xml"],
                "report_file_count": 1,
                "parsed_report_count": 1,
                "test_source_file_count": 0,
            }
        )


def test_b048_public_start_residual_payloads_are_closed() -> None:
    contract_source = (CODE_PATH / "odd_sdlc" / "public_start_contract.py").read_text(
        encoding="utf-8"
    )
    query_contract_source = (CODE_PATH / "odd_sdlc" / "query_contract.py").read_text(
        encoding="utf-8"
    )
    public_start_source = (CODE_PATH / "odd_sdlc" / "public_start.py").read_text(encoding="utf-8")
    gap_dossier_source = (CODE_PATH / "odd_sdlc" / "gap_dossier.py").read_text(encoding="utf-8")

    for retired_shape in (
        "evidence: list[dict[str, object]]",
        "resolved_policy: dict[str, object]",
        "prompt_compactions: list[dict[str, object]]",
        "published_ledger_ref: dict[str, object]",
        "fulfillment_assessments: list[dict[str, object]]",
        "assets: list[dict[str, object]]",
    ):
        assert retired_shape not in contract_source
        assert retired_shape not in query_contract_source

    assert "admit_evidence_items" in gap_dossier_source
    assert "admit_resolved_policy_payload" in public_start_source
    assert "admit_prompt_compactions" in public_start_source
    assert "admit_published_fulfillment_ledger_ref" in public_start_source
    assert "admit_fulfillment_assessments" in public_start_source
    assert "def _mapping_value" not in public_start_source
    assert "def _mapping_list_value" not in public_start_source


def test_b048_public_start_residual_register_fails_closed_on_raw_embedded_payloads() -> None:
    with pytest.raises(ValueError, match="evidence\\[0\\].evidence_role"):
        admit_evidence_items([{"detail": "missing role"}])

    with pytest.raises(ValueError, match="resolved_policy"):
        admit_resolved_policy_payload(
            {"dispatch": {"ref": "genesis.policy_defaults:dispatch", "config": {}}}
        )

    with pytest.raises(ValueError, match="prompt_compactions\\[0\\].inspection_ref"):
        admit_prompt_compactions(
            [
                {
                    "surface": "manifest.prompt",
                    "reason": "budget",
                    "size_unit": "chars",
                    "original_size": 10,
                    "emitted_size": 5,
                    "budget_size": 5,
                }
            ]
        )

    with pytest.raises(ValueError, match="published fulfillment ledger ref"):
        admit_published_fulfillment_ledger_ref(
            {"kind": "wrong", "resolver": "workspace_file", "manifest_id": "m1"}
        )

    with pytest.raises(ValueError, match="fulfillment_assessments\\[0\\].fulfillment_status"):
        admit_fulfillment_assessments(
            [
                {
                    "id": "REQ-1",
                    "evaluator": "REQ-1",
                    "fulfillment_status": "planned",
                    "fulfillment_detail": "",
                    "blocking_reasons": [],
                    "evidence_refs": [],
                }
            ]
        )


def test_b052_public_start_resolved_policy_accepts_genesis_tuple_bundle_refs() -> None:
    payload = resolve_policy_bundle()

    admitted = admit_resolved_policy_payload(payload)

    assert isinstance(payload["bundle_refs"], tuple)
    assert admitted["resolved_policy_bundle_ref"] == payload["resolved_policy_bundle_ref"]
    assert admitted["bundle_refs"] == list(payload["bundle_refs"])


def test_b052_public_start_resolved_policy_accepts_list_bundle_refs() -> None:
    payload = resolve_policy_bundle()
    tuple_refs = payload["bundle_refs"]
    assert isinstance(tuple_refs, tuple)
    payload["bundle_refs"] = list(tuple_refs)

    admitted = admit_resolved_policy_payload(payload)

    assert admitted["resolved_policy_bundle_ref"] == payload["resolved_policy_bundle_ref"]
    assert admitted["bundle_refs"] == list(tuple_refs)


def test_b048_query_domain_rejects_embedded_open_payload_fields() -> None:
    assert (
        query_module._asset_projection(  # noqa: SLF001
            {
                "uri": "asset://missing-id",
                "declared_type": "source_file",
                "kind": "asset",
                "metadata": {},
                "generated_asset_contract": None,
                "provenance": None,
                "checkpoint": None,
            }
        )
        is None
    )
    assert (
        query_module._asset_projection(  # noqa: SLF001
            {
                "asset_id": "asset://demo",
                "uri": "asset://demo",
                "declared_type": "source_file",
                "kind": "asset",
                "metadata": {},
                "generated_asset_contract": None,
                "provenance": None,
                "checkpoint": None,
                "projection_source": ["event_history"],
                "update_count": "two",
            }
        )
        == {
            "asset_id": "asset://demo",
            "uri": "asset://demo",
            "declared_type": "source_file",
            "kind": "asset",
            "metadata": {},
            "generated_asset_contract": None,
            "provenance": None,
            "checkpoint": None,
        }
    )


def test_b049_runtime_effects_rejects_open_mapping_event_ingress() -> None:
    runtime_effects_source = (CODE_PATH / "odd_sdlc" / "runtime_effects.py").read_text(encoding="utf-8")
    runtime_event_contract_source = (CODE_PATH / "odd_sdlc" / "runtime_event_contract.py").read_text(
        encoding="utf-8"
    )

    assert "data: Mapping[str, object]" not in runtime_effects_source
    assert "data: dict[str, Any]" not in runtime_effects_source
    assert "data: RuntimeEventPayload" in runtime_effects_source
    assert "def admit_runtime_event_payload(" in runtime_event_contract_source

    for source_name in (
        "app.py",
        "constructor.py",
        "execution_contract.py",
        "homeostatic_loop.py",
        "public_start.py",
        "triage.py",
    ):
        source = (CODE_PATH / "odd_sdlc" / source_name).read_text(encoding="utf-8")
        assert "admit_runtime_event_payload(" in source


def test_b049_runtime_event_emission_uses_closed_carrier_adapter() -> None:
    drafted = admit_runtime_event_payload(
        event_type="execution_contract_drafted",
        data={
            "execution_contract": {
                "contract_kind": "odd_sdlc.execution_contract_surface",
                "contract_id": "contract_demo",
                "status": "drafted",
                "source_kind": "operator_request",
                "target_truth": {
                    "normalized_scope": "workspace",
                    "public_target": "next",
                    "until": "first_traversal",
                    "kind": "next",
                },
            }
        },
    )
    assert drafted["execution_contract"]["status"] == "drafted"
    assert drafted["execution_contract"]["target_truth"]["kind"] == "next"

    approved = admit_runtime_event_payload(
        event_type="approved",
        data={"edge": "derive_code_surface", "actor": "human_proxy"},
    )
    assert approved == {"edge": "derive_code_surface", "actor": "human_proxy"}

    route_recorded = admit_runtime_event_payload(
        event_type="route_recorded",
        data={
            "kind": "odd_sdlc.homeostatic_gap",
            "edge": "derive_code_surface",
            "run_id": None,
            "route_id": "route_demo",
            "triage_id": "triage_demo",
            "analysis_fingerprint": None,
            "state": "blocked_missing_capability",
            "vector_kind": None,
            "selected_vector": None,
            "dynamic_family": None,
            "selected_graphfunction": None,
            "target_assets": [],
            "priority_source": "capability_gate",
            "realization_iteration": None,
            "no_lawful_route_reason": None,
        },
    )
    assert route_recorded["state"] == "blocked_missing_capability"


def test_b049_runtime_effects_fail_closed_on_raw_dict_payload() -> None:
    with pytest.raises(ValueError, match="fh_gate_pending.criteria"):
        admit_runtime_event_payload(
            event_type="fh_gate_pending",
            data={
                "edge": "derive_code_surface",
                "evaluators": ["constitutional_pending_fh"],
            },
        )

    with pytest.raises(ValueError, match="execution_contract.status"):
        admit_runtime_event_payload(
            event_type="execution_contract_drafted",
            data={
                "execution_contract": {
                    "contract_kind": "odd_sdlc.execution_contract_surface",
                    "contract_id": "contract_demo",
                    "status": "planned",
                    "source_kind": "operator_request",
                    "target_truth": {
                        "normalized_scope": "workspace",
                        "public_target": "next",
                        "until": "first_traversal",
                        "kind": "next",
                    },
                }
            },
        )


def test_refresh_analysis_publishes_test_lane_completeness_context(tmp_path: Path) -> None:
    _seed_workspace(tmp_path)

    refresh_analysis(tmp_path, stage="test")

    context_path = tmp_path / TEST_LANE_COMPLETENESS_CONTEXT_PATH
    context = context_path.read_text(encoding="utf-8")

    assert "# odd_sdlc Test Lane Completeness Context" in context
    assert "- completeness_state: planned_validation_allocation" in context
    assert "- next_lawful_gain: materialize_realized_test_source" in context


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
    published = json.loads(
        subprocess.run(
            [
                sys.executable,
                "-m",
                "odd_sdlc",
                "gaps",
                "--scope",
                "workspace",
                "--workspace",
                str(tmp_path),
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
            env=env,
            check=True,
        ).stdout
    )
    dossiers = published.get("dossiers") if isinstance(published, dict) else None
    if isinstance(dossiers, list) and dossiers and isinstance(dossiers[0], dict):
        proposal = dossiers[0].get("constitutional_proposal")
        if isinstance(proposal, dict) and str(proposal.get("state") or "") == "pending_fh":
            approved = apply_constitutional_proposal(
                tmp_path,
                edge=str(dossiers[0].get("edge") or ""),
                proposal_id=str(proposal.get("proposal_id") or ""),
                actor="test",
            )
            assert approved["status"] == "applied"
            published = json.loads(
                subprocess.run(
                    [
                        sys.executable,
                        "-m",
                        "odd_sdlc",
                        "gaps",
                        "--scope",
                        "workspace",
                        "--workspace",
                        str(tmp_path),
                    ],
                    cwd=ROOT,
                    capture_output=True,
                    text=True,
                    env=env,
                    check=True,
                ).stdout
            )
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "start",
            "--scope",
            "workspace",
            "--target",
            "next",
            "--until",
            "first_traversal",
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
    assert "fp_manifest_path" in payload

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
    assert result["final_state"]["status"] == "program_boundary_complete"
    assert result["final_state"]["edge"] == "prepare_release_surface"
    assert result["final_state"]["next_edge"] == "prepare_build_execution_surface"
    assert result["program_boundary_complete"] is True
    assert result["follow_on_program"]["name"] == "release_operational_cycle"
    assert result["emit_boundary"]["passes"] is True
    assert result["emit_boundary"]["observed_emit_import_paths"] == ["runtime_effects.py"]
    assert result["homeostatic_loop"]["status"] == "retired"
    assert result["homeostatic_loop"]["loopback"]["status"] == "retired"

    events = _read_events(tmp_path)
    event_types = [event["event_type"] for event in events]
    assert "run_completed" in event_types
    assert "proposal_applied" in event_types
    assert "derivation_reopened" in event_types
    assert "gap_retired" in event_types
    assert asset_path(tmp_path, "test_run_archive_surface").exists()
    assert asset_path(tmp_path, "release_surface").exists()


def test_self_test_fails_closed_when_release_route_declaration_is_removed(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    refresh_analysis(tmp_path, stage="test")
    app = initialize(bootstrap(workspace_root=tmp_path))

    monkeypatch.setattr(
        triage_module,
        "_declared_head_graph_function_routes",
        lambda _workspace_root: frozenset(),
    )

    with pytest.raises(RuntimeError, match="remained pending on 'prepare_release_surface' after retry"):
        self_test(app)


def test_self_test_reports_clean_pending_dispatch_when_the_current_program_edge_is_in_flight(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    monkeypatch.setattr(
        self_test_module,
        "start",
        lambda _app, **_kwargs: {
            "status": "pending",
            "edge": "derive_intent_surface",
            "blocking_reason": "fp_dispatch",
        },
    )

    result = self_test(app)

    assert result["status"] == "ok"
    assert result["already_converged"] is False
    assert result["blocked_by_pending_dispatch"] is True
    assert result["completed_edges"] == []
    assert result["steps"] == []
    assert result["final_state"]["status"] == "pending"
    assert result["final_state"]["edge"] == "derive_intent_surface"


def test_self_test_still_raises_when_pending_dispatch_is_outside_the_current_program(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _seed_workspace(tmp_path)
    app = initialize(bootstrap(workspace_root=tmp_path))

    monkeypatch.setattr(
        self_test_module,
        "start",
        lambda _app, **_kwargs: {
            "status": "pending",
            "edge": "nonexistent_edge",
            "blocking_reason": "fp_dispatch",
        },
    )

    with pytest.raises(RuntimeError, match="non-iterated status 'pending'"):
        self_test(app)
