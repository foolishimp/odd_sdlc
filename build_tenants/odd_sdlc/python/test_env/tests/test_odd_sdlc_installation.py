# Validates: REQ-F-ODDSDLC-003
# Validates: REQ-F-ODDSDLC-007
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

from odd_sdlc.normalization import normalize_workspace  # noqa: E402
from odd_sdlc.release.install import install as install_release  # noqa: E402


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
        "normalize_project_constraints",
    ]

    assert (workspace / "specification" / "PRODUCT.md").read_text(encoding="utf-8").startswith("# Product")
    assert (workspace / "specification" / "GOALS.md").read_text(encoding="utf-8").startswith("# Goals")
    imported_summary = (
        workspace / "specification" / "requirements" / "00-imported-sources.md"
    ).read_text(encoding="utf-8")
    assert "Imported Requirement Sources" in imported_summary
    assert "`specification/REQUIREMENTS.md`" in imported_summary
    constraints = (workspace / ".ai-workspace" / "context" / "project_constraints.yml").read_text(encoding="utf-8")
    assert 'name: "data_mapper.test18"' in constraints
    assert 'name: "spark_scala"' in constraints
    assert 'output_dir: "build_tenants/data_mapper/spark_scala/"' in constraints

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
    assert (workspace / ".odd_sdlc" / "release" / "genesis.yml").exists()
    assert (workspace / "build_tenants" / "odd_sdlc" / "python" / "code" / "odd_sdlc" / "__main__.py").exists()
    kernel_text = (workspace / ".genesis" / "genesis.yml").read_text(encoding="utf-8")
    assert "runtime_contract: .odd_sdlc/release/genesis.yml" in kernel_text

    env = os.environ.copy()
    env["PYTHONPATH"] = str(workspace / ".genesis")
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
    assert len(payload["gaps"]) == 18
