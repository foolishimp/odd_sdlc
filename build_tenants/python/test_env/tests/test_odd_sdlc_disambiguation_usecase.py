# Validates: REQ-F-ODDSDLC-027
# Validates: REQ-F-ODDSDLC-028
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[4]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))

from odd_sdlc.ambiguity import AMBIGUITY_REGISTER_PATH
from odd_sdlc.app import bootstrap, initialize
from odd_sdlc.normalization import normalize_workspace
from odd_sdlc.query import query_domain
from odd_sdlc.release.install import install as install_release
from test_odd_sdlc_installation import _seed_data_mapper_template_workspace


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
    (
        workspace
        / "imp_scala_spark"
        / "cdme-core"
        / "src"
        / "main"
        / "scala"
        / "com"
        / "cdme"
        / "TopologyMarker.scala"
    ).write_text(
        "\n".join(
            (
                "package com.cdme",
                "",
                "object TopologyMarker {",
                '  val name = "competing-realization-root"',
                "}",
                "",
            )
        ),
        encoding="utf-8",
    )


def _rewrite_output_dir(workspace: Path, output_dir: str) -> None:
    constraints_path = workspace / ".ai-workspace" / "context" / "project_constraints.yml"
    lines = constraints_path.read_text(encoding="utf-8").splitlines()
    updated = []
    replaced = False
    for line in lines:
        if line.strip().startswith("output_dir:"):
            indent = line[: len(line) - len(line.lstrip())]
            updated.append(f'{indent}output_dir: "{output_dir}"')
            replaced = True
        else:
            updated.append(line)
    if not replaced:
        raise AssertionError("expected output_dir in project_constraints.yml")
    constraints_path.write_text("\n".join(updated) + "\n", encoding="utf-8")


@pytest.mark.usecase_id("ambiguity_register_disambiguation_pipeline")
def test_normalization_publishes_and_reduces_major_ambiguity(run_archive) -> None:
    workspace = run_archive.workspace
    _seed_data_mapper_template_workspace(workspace)
    _rewrite_output_dir(workspace, "build_tenants/data_mapper/spark_scala/")
    _create_competing_realization_root(workspace)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    run_archive.capture_json("install.payload.json", payload)
    assert payload["status"] == "installed"

    register_path = workspace / AMBIGUITY_REGISTER_PATH
    initial_register = json.loads(register_path.read_text(encoding="utf-8"))
    run_archive.capture_json("ambiguity_register.initial.json", initial_register)
    initial_entries = {entry["ambiguity_id"]: entry for entry in initial_register["ambiguities"]}
    assert initial_register["register_kind"] == "odd_sdlc.ambiguity_register"
    assert initial_register["schema_version"] == "v2"
    assert initial_entries["multiple-realization-roots"]["status"] == "fh_required"
    assert initial_entries["multiple-realization-roots"]["policy_action"] == "escalate_fh"
    assert "declared-root-vs-realized-root-mismatch" not in initial_entries
    assert initial_register["summary"]["active"] >= 1

    app = initialize(bootstrap(workspace_root=workspace))
    initial_domain = query_domain(app)
    run_archive.capture_json("query_domain.initial.json", initial_domain)
    assert initial_domain["query_contract"]["version"] == "v16"
    assert "analysis_manifest" not in initial_domain["query_contract"]["top_level_keys"]
    assert "analysis_manifest" in initial_domain["gap_dossier"]
    assert "ambiguity_register" in initial_domain["query_contract"]["top_level_keys"]
    assert "requirement_closure_register" in initial_domain["query_contract"]["top_level_keys"]
    assert any(asset["asset_id"] == "ambiguity_register_surface" for asset in initial_domain["assets"])
    assert any(asset["asset_id"] == "requirement_closure_register_surface" for asset in initial_domain["assets"])
    assert initial_domain["ambiguity_register"]["summary"]["active"] == initial_register["summary"]["active"]
    assert initial_domain["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"

    shutil.rmtree(workspace / "imp_scala_spark")
    second_report = normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    run_archive.capture_json("normalize.second.json", second_report)
    assert second_report["changed"] is True
    assert any(action["kind"] == "update_ambiguity_register" for action in second_report["actions"])

    reduced_register = json.loads(register_path.read_text(encoding="utf-8"))
    run_archive.capture_json("ambiguity_register.reduced.json", reduced_register)
    reduced_entries = {entry["ambiguity_id"]: entry for entry in reduced_register["ambiguities"]}
    assert reduced_entries["multiple-realization-roots"]["status"] == "resolved"
    assert "declared-root-vs-realized-root-mismatch" not in reduced_entries
    assert reduced_register["summary"]["active"] < initial_register["summary"]["active"]
    assert reduced_register["summary"]["status_counts"]["resolved"] >= 1

    reduced_domain = query_domain(initialize(bootstrap(workspace_root=workspace)))
    run_archive.capture_json("query_domain.reduced.json", reduced_domain)
    assert reduced_domain["ambiguity_register"]["summary"]["active"] == reduced_register["summary"]["active"]
    assert reduced_domain["requirement_closure_register"]["register_kind"] == "odd_sdlc.requirement_closure_register"
