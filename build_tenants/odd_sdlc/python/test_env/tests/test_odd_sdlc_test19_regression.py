# Validates: REQ-F-ODDSDLC-004
# Validates: REQ-F-ODDSDLC-007
from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[5]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))

from odd_sdlc.release.install import install as install_release  # noqa: E402
from odd_sdlc.workspace_assets import assess_generated_asset_contract, assess_realization_topology, asset_path  # noqa: E402
from sandbox_runtime import complete_bootstrap_chain, read_events, run_installed_odd_sdlc  # noqa: E402


LIVE_TEST19_ROOT = Path("/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test19")
PRE_CODE_STEPS = (
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
)


def _legacy_project_constraints(workspace_name: str) -> str:
    return "\n".join(
        (
            f"# Project Constraints — {workspace_name}",
            "# Imported legacy test19-like topology surface",
            "",
            "project:",
            '  name: ""',
            '  kind: "data-pipeline"',
            '  language: "Scala"',
            '  test_runner: "sbt test"',
            "",
            "constraints: {}",
            "",
            "structure:",
            "  design_tenants:",
            '    - name: "scala_spark"',
            '      output_dir: "imp_scala_spark/"',
            '      description: "Imported Scala/Spark realization tree"',
            "  root_code_policy: reject",
            "",
        )
    )


def _seed_test19_like_workspace(workspace: Path) -> None:
    (workspace / "specification").mkdir(parents=True, exist_ok=True)
    (workspace / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (workspace / "README.md").write_text(
        "# CDME\n\nImported test19-like workspace used for topology regression.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "INTENT.md").write_text(
        "# Project Intent\n\nImported intent authority.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "REQUIREMENTS.md").write_text(
        "# Imported Requirements\n\nImported requirement-like authority.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "mapper_requirements.md").write_text(
        "# Mapper Requirements\n\nImported mapper-specific authority.\n",
        encoding="utf-8",
    )
    (workspace / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        _legacy_project_constraints(workspace.name),
        encoding="utf-8",
    )

    imp_root = workspace / "imp_scala_spark"
    (imp_root / "src" / "main" / "scala" / "cdme" / "runtime").mkdir(parents=True, exist_ok=True)
    (imp_root / "src" / "test" / "scala" / "cdme" / "runtime").mkdir(parents=True, exist_ok=True)
    (imp_root / "target" / "test-reports").mkdir(parents=True, exist_ok=True)
    (imp_root / "build.sbt").write_text(
        'name := "cdme-test19-topology-regression"\nscalaVersion := "2.13.15"\n',
        encoding="utf-8",
    )
    for index in range(6):
        (imp_root / "src" / "main" / "scala" / "cdme" / "runtime" / f"Stage{index}.scala").write_text(
            "\n".join(
                (
                    f"package cdme.runtime",
                    "",
                    f"object Stage{index} {{",
                    f'  def name: String = "stage-{index}"',
                    "}",
                    "",
                )
            ),
            encoding="utf-8",
        )
    for index in range(4):
        (imp_root / "src" / "test" / "scala" / "cdme" / "runtime" / f"Stage{index}Spec.scala").write_text(
            "\n".join(
                (
                    "package cdme.runtime",
                    "",
                    f"object Stage{index}Spec {{",
                    "  def passed: Boolean = true",
                    "}",
                    "",
                )
            ),
            encoding="utf-8",
        )
    for index in range(3):
        (imp_root / "target" / "test-reports" / f"TEST-stage-{index}.xml").write_text(
            "\n".join(
                (
                    '<?xml version="1.0" encoding="UTF-8"?>',
                    f'<testsuite tests="5" failures="0" errors="0" skipped="0" name="stage-{index}"/>',
                    "",
                )
            ),
            encoding="utf-8",
        )


def _foreign_candidate_paths(attestation_or_report: dict[str, object]) -> list[str]:
    candidates = attestation_or_report.get("foreign_realization_candidates", [])
    if not isinstance(candidates, list):
        return []
    return [
        candidate["relative_path"]
        for candidate in candidates
        if isinstance(candidate, dict) and isinstance(candidate.get("relative_path"), str)
    ]


FULL_BOOTSTRAP_STEPS = PRE_CODE_STEPS + (
    "derive_code_surface",
    "derive_test_design_surface",
    "select_test_stack_profile",
    "derive_test_module_surface",
    "derive_test_run_archive_surface",
    "qualify_testcase_authority",
    "prepare_release_surface",
)


@pytest.mark.usecase_id("data_mapper_test19_topology_regression")
def test_test19_topology_regression_binds_selected_realization_on_synthetic_workspace(run_archive) -> None:
    workspace = run_archive.workspace
    _seed_test19_like_workspace(workspace)

    install_payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    run_archive.capture_json("install.payload.json", install_payload)

    gaps = json.loads(run_installed_odd_sdlc(workspace, "gaps", archive=run_archive, label="test19 gaps").stdout)
    run_archive.capture_json("gaps.initial.json", gaps)
    assert gaps["converged"] is False

    completed = complete_bootstrap_chain(
        workspace,
        archive=run_archive,
        label_prefix="test19_regression_full",
        steps=FULL_BOOTSTRAP_STEPS,
    )
    run_archive.capture_json("completed.full.json", completed)
    assert [step["start"]["edge"] for step in completed] == list(FULL_BOOTSTRAP_STEPS)
    assert all(step["assessed"]["status"] == "ok" for step in completed)

    topology = assess_realization_topology(workspace)
    code_attestation = assess_generated_asset_contract(workspace, "code_surface")
    release_attestation = assess_generated_asset_contract(workspace, "release_surface")
    archive_attestation = assess_generated_asset_contract(workspace, "test_run_archive_surface")
    run_archive.capture_json("topology.report.json", topology)
    run_archive.capture_json("code.attestation.json", code_attestation)
    run_archive.capture_json("release.attestation.json", release_attestation)
    run_archive.capture_json("archive.attestation.json", archive_attestation)

    assert topology["topology_diverged"] is False
    assert _foreign_candidate_paths(topology) == []
    assert asset_path(workspace, "code_surface") == workspace / "imp_scala_spark"
    assert code_attestation["topology_guard_applied"] is True
    assert code_attestation["topology_guard_passed"] is True
    assert code_attestation["contract_satisfied"] is True
    assert code_attestation["code_surface_summary"]["build_markers"] == ["build.sbt"]
    assert code_attestation["code_surface_summary"]["source_file_count"] >= 10
    code_step = next(step for step in completed if step["start"]["edge"] == "derive_code_surface")
    assert code_step["constructor"]["work_report"]["operation"] == "adopt"
    assert release_attestation["contract_satisfied"] is True
    assert archive_attestation["contract_satisfied"] is True
    release_path = asset_path(workspace, "release_surface")
    release_text = release_path.read_text(encoding="utf-8")
    assert "governed code root: `imp_scala_spark/`" in release_text
    assert "- tests observed: 15" in release_text
    assert "- failures observed: 0" in release_text
    archive_text = asset_path(workspace, "test_run_archive_surface").read_text(encoding="utf-8")
    assert "- report files observed: 3" in archive_text
    assert "- parsed reports: 3" in archive_text


@pytest.mark.usecase_id("data_mapper_test19_topology_regression")
def test_test19_live_workspace_topology_is_detected() -> None:
    if not LIVE_TEST19_ROOT.exists():
        pytest.skip("live data_mapper.test19 workspace is not available")

    topology = assess_realization_topology(LIVE_TEST19_ROOT)
    code_attestation = assess_generated_asset_contract(LIVE_TEST19_ROOT, "code_surface")
    release_attestation = assess_generated_asset_contract(LIVE_TEST19_ROOT, "release_surface")
    archive_attestation = assess_generated_asset_contract(LIVE_TEST19_ROOT, "test_run_archive_surface")

    assert topology["topology_diverged"] is False
    assert _foreign_candidate_paths(topology) == []
    assert (LIVE_TEST19_ROOT / "imp_scala_spark" / "build.sbt").exists()
    assert (LIVE_TEST19_ROOT / "build_tenants" / "odd_method" / "python" / "code" / "odd_generated_impl").exists()

    assert code_attestation["topology_guard_applied"] is True
    assert code_attestation["topology_guard_passed"] is True
    assert code_attestation["contract_satisfied"] is True
    assert code_attestation["code_surface_summary"]["build_markers"] == ["build.sbt"]
    assert code_attestation["code_surface_summary"]["source_file_count"] >= 20
    # The live workspace remains historical evidence until the executive is rerun over it.
    assert release_attestation["contract_satisfied"] is False
    assert archive_attestation["contract_satisfied"] is False
    assert "implementation pending" in asset_path(LIVE_TEST19_ROOT, "release_surface").read_text(encoding="utf-8")
    assert "awaiting implementation" in asset_path(LIVE_TEST19_ROOT, "test_run_archive_surface").read_text(encoding="utf-8")

    events = read_events(LIVE_TEST19_ROOT)
    opened_edges = [
        event["data"]["edge"]
        for event in events
        if event.get("event_type") == "graph_call_opened" and isinstance(event.get("data"), dict)
    ]
    assert "derive_code_surface" in opened_edges
    assert "prepare_release_surface" in opened_edges
