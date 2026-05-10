# Validates: REQ-F-ODDSDLC-027
# Validates: REQ-F-ODDSDLC-028
from __future__ import annotations

import json
from pathlib import Path

import pytest

from odd_sdlc.normalization import normalize_workspace
from odd_sdlc.release.install import install as install_release
from sandbox_runtime import read_events, run_installed_odd_sdlc
from test_odd_sdlc_installation import (
    _append_runtime_contract_overrides,
    _seed_data_mapper_template_workspace,
    _set_ambiguity_risk_appetite,
    _write_fake_transport_contract,
)


def _create_competing_realization_root(workspace: Path) -> None:
    (workspace / "imp_scala_spark" / "project").mkdir(parents=True, exist_ok=True)
    (workspace / "imp_scala_spark" / "cdme-core" / "src" / "main" / "scala" / "com" / "cdme").mkdir(
        parents=True,
        exist_ok=True,
    )
    (workspace / "imp_scala_spark" / "build.sbt").write_text(
        '\n'.join(
            (
                'ThisBuild / scalaVersion := "2.13.12"',
                'lazy val root = (project in file("."))',
                "",
            )
        ),
        encoding="utf-8",
    )


def _rewrite_output_dir(workspace: Path, output_dir: str) -> None:
    constraints_path = workspace / ".ai-workspace" / "context" / "project_constraints.yml"
    lines = constraints_path.read_text(encoding="utf-8").splitlines()
    updated = []
    for line in lines:
        if line.strip().startswith("output_dir:"):
            indent = line[: len(line) - len(line.lstrip())]
            updated.append(f'{indent}output_dir: "{output_dir}"')
        else:
            updated.append(line)
    constraints_path.write_text("\n".join(updated) + "\n", encoding="utf-8")


def _install_ambiguous_workspace(workspace: Path) -> None:
    _seed_data_mapper_template_workspace(workspace)
    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert payload["status"] == "installed"
    _rewrite_output_dir(workspace, "build_tenants/data_mapper/spark_scala/")
    _create_competing_realization_root(workspace)
    _append_runtime_contract_overrides(
        workspace,
        transport_contract=_write_fake_transport_contract(workspace),
    )


def _query_ambiguity_register(workspace: Path) -> dict:
    run_installed_odd_sdlc(
        workspace,
        "refresh-analysis",
        label="odd_sdlc refresh-analysis",
    )
    payload = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "query-domain",
            label="odd_sdlc query-domain",
        ).stdout
    )
    return payload["ambiguity_register"]


def _query_start_target_catalog(workspace: Path) -> list[dict]:
    payload = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "query-domain",
            label="odd_sdlc query-domain",
        ).stdout
    )
    return list(payload["start_target_catalog"])


@pytest.mark.usecase_id("ambiguity_register_disambiguation_pipeline")
def test_low_risk_appetite_escalates_major_ambiguity_to_fh(run_archive) -> None:
    workspace = run_archive.workspace
    _install_ambiguous_workspace(workspace)
    _set_ambiguity_risk_appetite(workspace, "low")
    normalize_workspace(workspace, project_slug="data_mapper", platform="spark_scala")

    start_result = run_installed_odd_sdlc(
        workspace,
        "start",
        "--scope",
        "workspace",
        "--target",
        "graph_function:select_implementation_stack_profile",
        "--until",
        "converged",
        archive=run_archive,
        label="low risk appetite start",
        timeout=180,
        check=False,
    )
    run_archive.capture_text("low_risk.start.stdout.txt", start_result.stdout)
    run_archive.capture_text("low_risk.start.stderr.txt", start_result.stderr)
    payload = json.loads(start_result.stdout)
    run_archive.capture_json("low_risk.start.json", payload)
    assert start_result.returncode == 3
    assert payload["stopped_by"] == "fh_gate"
    assert payload["edge"] == "select_implementation_stack_profile"

    start_target_catalog = _query_start_target_catalog(workspace)
    run_archive.capture_json("low_risk.start_target_catalog.json", start_target_catalog)
    target_entry = next(
        entry
        for entry in start_target_catalog
        if entry["handle"] == "select_implementation_stack_profile"
    )
    assert target_entry["start_addressable"] is True
    assert target_entry["execution_binding"] == "target_injected_job"

    ambiguity_register = _query_ambiguity_register(workspace)
    run_archive.capture_json("low_risk.ambiguity_register.json", ambiguity_register)
    entries = {entry["ambiguity_id"]: entry for entry in ambiguity_register["ambiguities"]}
    assert entries["multiple-realization-roots"]["policy_action"] == "escalate_fh"
    assert entries["multiple-realization-roots"]["status"] == "fh_required"
    assert entries["multiple-realization-roots"]["blocking"] is True
<<<<<<< Updated upstream:build_tenants/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py
    assert (
        entries["multiple-realization-roots"]["expected_resolving_edge"]
        == "select_implementation_stack_profile"
    )
=======
    assert "declared-root-vs-realized-root-mismatch" not in entries
>>>>>>> Stashed changes:build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py

    events = read_events(workspace)
    run_archive.capture_json("low_risk.events.json", events)
    assert any(event["event_type"] == "fh_gate_pending" for event in events)
    assert not any(
        event["event_type"] == "approved"
        and event.get("data", {}).get("kind") == "fh_review"
        for event in events
    )


@pytest.mark.usecase_id("ambiguity_register_disambiguation_pipeline")
def test_high_risk_appetite_allows_fp_to_carry_major_ambiguity(run_archive) -> None:
    workspace = run_archive.workspace
    _install_ambiguous_workspace(workspace)
    _set_ambiguity_risk_appetite(workspace, "high")
    normalize_workspace(workspace, project_slug="data_mapper", platform="spark_scala")

<<<<<<< Updated upstream:build_tenants/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py
    start_result = run_installed_odd_sdlc(
        workspace,
        "start",
        "--scope",
        "workspace",
        "--target",
        "graph_function:select_implementation_stack_profile",
        "--until",
        "converged",
        archive=run_archive,
        label="high risk appetite start",
        timeout=180,
        check=False,
=======
    start_payload = json.loads(
        run_installed_genesis(
            workspace,
            "start",
            "--auto",
            archive=run_archive,
            label="high risk appetite start",
            timeout=180,
            check=False,
        ).stdout
>>>>>>> Stashed changes:build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py
    )
    run_archive.capture_text("high_risk.start.stdout.txt", start_result.stdout)
    run_archive.capture_text("high_risk.start.stderr.txt", start_result.stderr)
    start_payload = json.loads(start_result.stdout)
    run_archive.capture_json("high_risk.start.json", start_payload)
<<<<<<< Updated upstream:build_tenants/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py
    assert start_result.returncode == 0
    assert start_payload["status"] in {"pending", "error"}
    assert start_payload["stopped_by"] != "fh_gate"
    assert start_payload["edge"] == "select_implementation_stack_profile"
    assert start_payload["blocking_reason"] == "fp_dispatch"
=======
    assert start_payload["status"] in {"pending", "error"}
    assert start_payload["stopped_by"] != "fh_gate"
    assert start_payload["edge"] != "select_implementation_stack_profile"
>>>>>>> Stashed changes:build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py
    if start_payload["status"] == "error":
        assert start_payload["failure_class"] == "transport_failure"
        assert start_payload["stopped_by"] == "fp_runtime_failure"

    ambiguity_register = _query_ambiguity_register(workspace)
    run_archive.capture_json("high_risk.ambiguity_register.json", ambiguity_register)
    entries = {entry["ambiguity_id"]: entry for entry in ambiguity_register["ambiguities"]}
    assert entries["multiple-realization-roots"]["policy_action"] == "fp_decide"
    assert entries["multiple-realization-roots"]["decision_status"] == "pending_fp"
    assert entries["multiple-realization-roots"]["status"] == "open"
    assert entries["multiple-realization-roots"]["blocking"] is False
<<<<<<< Updated upstream:build_tenants/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py
=======
    assert "declared-root-vs-realized-root-mismatch" not in entries
>>>>>>> Stashed changes:build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py

    events = read_events(workspace)
    run_archive.capture_json("high_risk.events.json", events)
    assert not any(event["event_type"] == "fh_gate_pending" for event in events)
