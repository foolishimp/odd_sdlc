# Validates: REQ-F-ODDSDLC-003
# Validates: REQ-F-ODDSDLC-007
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[5]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"
TESTS_DIR = Path(__file__).resolve().parent
DATA_MAPPER_TEMPLATE = (
    ROOT.parents[0] / "ai_sdlc_examples" / "local_projects" / "data_mapper.template"
)

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))
if str(TESTS_DIR) not in sys.path:
    sys.path.insert(0, str(TESTS_DIR))

from odd_sdlc.normalization import normalize_workspace  # noqa: E402
from odd_sdlc.release.install import install as install_release  # noqa: E402
from sandbox_runtime import read_events, run_installed_genesis  # noqa: E402


def _legacy_project_constraints(workspace_name: str) -> str:
    return "\n".join(
        (
            f"# Project Constraints — {workspace_name}",
            "# Imported legacy test surface",
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
            '      description: "Legacy layout"',
            "  root_code_policy: reject",
            "",
        )
    )


def _seed_imported_workspace(path: Path) -> None:
    (path / "specification").mkdir(parents=True, exist_ok=True)
    (path / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (path / "specification" / "INTENT.md").write_text(
        "# Project Intent\n\nImported project intent surface.\n",
        encoding="utf-8",
    )
    (path / "specification" / "REQUIREMENTS.md").write_text(
        "# Imported Requirements\n\nImported requirement-like authority surface.\n",
        encoding="utf-8",
    )
    (path / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        _legacy_project_constraints(path.name),
        encoding="utf-8",
    )


def _write_fake_transport_contract(workspace: Path) -> Path:
    contract_path = workspace / ".odd_sdlc" / "release" / "test_transport_contract.json"
    payload = {
        "claude": {
            "command": sys.executable,
            "args": [
                str(TESTS_DIR / "fake_fp_agent.py"),
                "{prompt}",
            ],
            "retry_count": 0,
            "retry_backoff": 0,
            "probe_timeout": 5,
            "call_timeout": 30,
        }
    }
    contract_path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")
    return contract_path


def _append_runtime_contract_overrides(workspace: Path, *, transport_contract: Path) -> None:
    runtime_contract = workspace / ".odd_sdlc" / "release" / "genesis.yml"
    text = runtime_contract.read_text(encoding="utf-8").rstrip()
    additions = (
        f"transport_contract: {transport_contract.relative_to(workspace).as_posix()}",
    )
    for line in additions:
        if line not in text:
            text += f"\n{line}"
    runtime_contract.write_text(text + "\n", encoding="utf-8")


def test_normalize_workspace_standardizes_imported_workspace_shape(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test18"
    _seed_imported_workspace(workspace)

    report = normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )

    assert report["workspace_name"] == "data_mapper.test18"
    assert report["project_slug"] == "data_mapper"
    assert report["platform"] == "spark_scala"
    assert report["changed"] is True
    assert [action["kind"] for action in report["actions"]] == [
        "create_product_surface",
        "create_goals_surface",
        "create_requirements_root",
        "create_imported_requirements_summary",
        "create_project_bootstrap",
        "normalize_project_constraints",
    ]

    assert (workspace / "specification" / "PRODUCT.md").read_text(encoding="utf-8").startswith("# Product")
    assert (workspace / "specification" / "GOALS.md").read_text(encoding="utf-8").startswith("# Goals")
    imported_summary = (
        workspace / "specification" / "requirements" / "00-imported-sources.md"
    ).read_text(encoding="utf-8")
    assert "Imported Requirement Sources" in imported_summary
    assert "`specification/REQUIREMENTS.md`" in imported_summary
    project_bootstrap = (workspace / ".ai-workspace" / "context" / "project_bootstrap.md").read_text(encoding="utf-8")
    assert project_bootstrap.startswith("# Project Bootstrap")
    assert "## Project Identity" in project_bootstrap
    assert "## Source Titles" in project_bootstrap
    assert "## Ontology Anchors" in project_bootstrap
    assert "- `specification/INTENT.md` when present" in project_bootstrap
    assert "- `README.md` only as provenance/context after the imported authority" in project_bootstrap
    assert "## Installed Runtime Start Surface" in project_bootstrap
    assert "PYTHONPATH=.genesis python -m genesis start --auto --human-proxy --workspace ." in project_bootstrap
    assert "treat legacy bootstrap instructions" in project_bootstrap
    constraints = (workspace / ".ai-workspace" / "context" / "project_constraints.yml").read_text(encoding="utf-8")
    assert 'name: "data_mapper.test18"' in constraints
    assert 'name: "scala_spark"' in constraints
    assert 'output_dir: "imp_scala_spark/"' in constraints

    second = normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert second["changed"] is False
    assert second["actions"] == []


def test_install_deploys_runtime_contract_and_enables_genesis_gaps(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test18"
    _seed_imported_workspace(workspace)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )

    assert payload["status"] == "installed"
    assert payload["runtime_contract"] == ".odd_sdlc/release/genesis.yml"
    assert payload["agents_md"] in {"prepended", "updated", "created"}
    assert payload["claude_md"] in {"prepended", "updated", "created"}
    assert (workspace / ".odd_sdlc" / "release" / "genesis.yml").exists()
    assert (workspace / "build_tenants" / "odd_sdlc" / "python" / "code" / "odd_sdlc" / "__main__.py").exists()
    kernel_text = (workspace / ".genesis" / "genesis.yml").read_text(encoding="utf-8")
    assert "runtime_contract: .odd_sdlc/release/genesis.yml" in kernel_text
    runtime_contract_text = (workspace / ".odd_sdlc" / "release" / "genesis.yml").read_text(encoding="utf-8")
    assert "runtime_backend: claude" in runtime_contract_text
    claude_text = (workspace / "CLAUDE.md").read_text(encoding="utf-8")
    agents_text = (workspace / "AGENTS.md").read_text(encoding="utf-8")
    for text in (claude_text, agents_text):
        assert "<!-- ODD_SDLC_BOOTLOADER_START -->" in text
        assert "# odd_sdlc Workspace Governance Surface" in text
        assert "This workspace contains a target project governed by `odd_sdlc`." in text
        assert "It is not itself a GTL/ABG project in identity terms." in text
        assert "do not infer project purpose or business identity from repository name, sibling workspaces, template lineage, or methodology examples" in text
        assert "repository and sibling-workspace context may explain provenance, but must not be used as project identity evidence" in text
        assert "`workspace://.ai-workspace/context/project_bootstrap.md`" in text
        assert "`workspace://specification/INTENT.md`" in text
        assert "`workspace://specification/requirements/00-imported-sources.md`" in text
        assert "`workspace://.ai-workspace/runtime/odd_sdlc-workspace-normalization.json`" in text
        assert "`workspace://.odd_sdlc/release/genesis.yml`" in text
        assert "## 4. Start Here" in text
        assert "PYTHONPATH=.genesis python -m genesis start --auto --human-proxy --workspace ." in text
        assert "treat them as provenance only" in text
        assert "README.md` (provenance/context only; do not use as primary identity evidence)" in text
        assert "<!-- GTL_BOOTLOADER_START -->" in text
        assert text.index("<!-- ODD_SDLC_BOOTLOADER_START -->") < text.index("<!-- GTL_BOOTLOADER_START -->")

    env = os.environ.copy()
    env["PYTHONPATH"] = os.pathsep.join(
        (
            str(workspace / ".genesis"),
            str(workspace / "build_tenants" / "odd_sdlc" / "python" / "code"),
        )
    )
    env.pop("PYTEST_CURRENT_TEST", None)
    result = subprocess.run(
        [sys.executable, "-m", "genesis", "gaps", "--workspace", str(workspace)],
        cwd=str(workspace),
        env=env,
        capture_output=True,
        text=True,
        timeout=120,
        check=True,
    )
    payload = json.loads(result.stdout)
    assert payload["converged"] is False
    assert len(payload["gaps"]) == 21


@pytest.mark.usecase_id("data_mapper_template_inherited_e2e")
def test_data_mapper_template_as_is_supports_first_auto_start(run_archive) -> None:
    workspace = run_archive.workspace
    shutil.copytree(DATA_MAPPER_TEMPLATE, workspace, dirs_exist_ok=True)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    run_archive.capture_json("install.payload.json", payload)

    assert payload["status"] == "installed"
    transport_contract = _write_fake_transport_contract(workspace)
    _append_runtime_contract_overrides(workspace, transport_contract=transport_contract)
    run_archive.copy_file(
        transport_contract,
        dest_name="transport_contract.test_transport_contract.json",
    )

    gaps_payload = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            archive=run_archive,
            label="data_mapper gaps.initial",
        ).stdout
    )
    run_archive.capture_json("gaps.initial.json", gaps_payload)
    assert gaps_payload["converged"] is False
    assert len(gaps_payload["gaps"]) == 21

    start_payload = json.loads(
        run_installed_genesis(
            workspace,
            "start",
            "--auto",
            "--human-proxy",
            archive=run_archive,
            label="data_mapper start",
            timeout=180,
        ).stdout
    )
    run_archive.capture_json("start.result.json", start_payload)
    assert start_payload["status"] == "converged"

    runtime_contract_text = (workspace / ".odd_sdlc" / "release" / "genesis.yml").read_text(encoding="utf-8")
    assert "runtime_backend: claude" in runtime_contract_text

    final_gaps_payload = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            archive=run_archive,
            label="data_mapper gaps.final",
        ).stdout
    )
    run_archive.capture_json("gaps.final.json", final_gaps_payload)
    assert final_gaps_payload["converged"] is True
    assert final_gaps_payload["total_delta"] == 0.0

    events = read_events(workspace)
    run_archive.capture_json("events.completed.json", events)
    event_types = [event["event_type"] for event in events]
    assert "worker_turn_started" in event_types
    assert "assessed" in event_types
    assert "graph_call_failed" not in event_types
    assert "run_failed" not in event_types
    assert all(event.get("data", {}).get("failure_class") != "policy_config_defect" for event in events)
    graph_call_edges = [
        event["data"]["edge"]
        for event in events
        if event["event_type"] == "graph_call_opened"
    ]
    assert graph_call_edges[0] == "derive_intent_surface"
    assert "derive_code_surface" in graph_call_edges
    assert "prepare_release_surface" in graph_call_edges
    assert "prepare_deployment_surface" in graph_call_edges
    assert "derive_runtime_observation_surface" in graph_call_edges
    assert "derive_retrofit_plan_surface" in graph_call_edges

    manifest_dir = workspace / ".ai-workspace" / "fp_manifests"
    result_dir = workspace / ".ai-workspace" / "fp_results"
    assert any(manifest_dir.iterdir())
    assert any(result_dir.iterdir())

    intent_text = (workspace / "specification" / "INTENT.md").read_text(encoding="utf-8")
    product_text = (workspace / "specification" / "PRODUCT.md").read_text(encoding="utf-8")
    release_text = (workspace / "docs" / "40-generated-release.md").read_text(encoding="utf-8")
    assert "Categorical Data Mapping & Computation Engine (CDME)" in intent_text
    assert "`odd_sdlc` exists to prove" not in intent_text
    assert "generated software-domain read model over the imported project authority" in product_text
    assert "toy app" not in product_text
    assert "governed code root: `imp_scala_spark/`" in release_text
    assert "odd_sdlc_proving_impl" not in release_text
    assert "- status: pending_evidence" in release_text

    code_root = workspace / "imp_scala_spark"
    assert code_root.exists()
    assert (code_root / "build.sbt").exists()
    assert (code_root / "project" / "build.properties").exists()
    assert len(list(code_root.rglob("*.scala"))) >= 16
    assert not (workspace / "build_tenants" / "odd_sdlc" / "python" / "code" / "odd_sdlc_proving_impl").exists()

    run_archive.update_summary(
        initial_gap_count=len(gaps_payload["gaps"]),
        final_total_delta=final_gaps_payload["total_delta"],
        graph_call_edges=graph_call_edges,
        preserved_project_identity=True,
        governed_code_root="imp_scala_spark/",
        release_status="pending_evidence",
        source_file_count=len(list(code_root.rglob("*.scala"))),
    )
