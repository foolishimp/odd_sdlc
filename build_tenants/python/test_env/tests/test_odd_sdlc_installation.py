# Validates: REQ-F-ODDSDLC-003
# Validates: REQ-F-ODDSDLC-007
# Validates: REQ-F-ODDSDLC-022
# Validates: REQ-F-ODDSDLC-027
# Validates: REQ-F-ODDSDLC-032
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[4]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "python" / "code"
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

from odd_sdlc.analysis import load_analysis_manifest, load_workspace_state  # noqa: E402
from odd_sdlc.app import bootstrap, initialize  # noqa: E402
from odd_sdlc.normalization import normalize_workspace  # noqa: E402
from odd_sdlc.project_profile import (  # noqa: E402
    ANALYSIS_MANIFEST_PATH,
    WORKSPACE_STATE_PATH,
    detect_project_profile_ambiguities,
    load_project_profile,
    realization_candidates_for_declared_root,
)
from odd_sdlc.query import query_domain  # noqa: E402
from odd_sdlc.release.install import install as install_release  # noqa: E402
from odd_sdlc.traceability import (  # noqa: E402
    REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH,
    build_requirement_closure_register,
    refresh_requirement_closure_register,
)
from odd_sdlc.workspace_assets import summarize_test_evidence  # noqa: E402
from sandbox_runtime import read_events, run_installed_genesis, run_installed_odd_sdlc  # noqa: E402


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
            '  ambiguity_risk_appetite: "medium"',
            "",
            "constraints: {}",
            "",
            "structure:",
            "  design_tenants:",
            '    - name: "scala_spark"',
            '      output_dir: "imp_scala_spark/"',
            '      description: "Legacy layout"',
            '      test_execution_contract: ""',
            '      deployment_contract: ""',
            '      runtime_observation_contract: ""',
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


def _seed_data_mapper_template_workspace(path: Path) -> None:
    shutil.copytree(DATA_MAPPER_TEMPLATE, path, dirs_exist_ok=True)
    readme_path = path / "README.md"
    if readme_path.exists():
        readme_path.unlink()


def _write_fake_transport_contract(workspace: Path) -> Path:
    contract_path = workspace / ".odd_sdlc" / "release" / "test_transport_contract.json"
    fake_agent = str(TESTS_DIR / "fake_fp_agent.py")
    payload = {
        "codex": {
            "command": sys.executable,
            "args": [
                fake_agent,
                "{prompt}",
            ],
            "output_mode": "stdout",
            "retry_count": 0,
            "retry_backoff": 0,
            "probe_timeout": 5,
            "call_timeout": 30,
        },
        "claude": {
            "command": sys.executable,
            "args": [
                fake_agent,
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


def _append_tenant_capability_contracts(
    workspace: Path,
    *,
    test_execution_contract: str = "",
    deployment_contract: str = "",
    runtime_observation_contract: str = "",
) -> None:
    constraints_path = workspace / ".ai-workspace" / "context" / "project_constraints.yml"
    lines = constraints_path.read_text(encoding="utf-8").splitlines()
    updated: list[str] = []
    replacements = {
        "test_execution_contract": f'      test_execution_contract: "{test_execution_contract}"',
        "deployment_contract": f'      deployment_contract: "{deployment_contract}"',
        "runtime_observation_contract": f'      runtime_observation_contract: "{runtime_observation_contract}"',
    }
    existing_fields = {
        line.strip().partition(":")[0]
        for line in lines
        if line.strip().partition(":")[0] in replacements
    }
    seen: set[str] = set()
    for line in lines:
        stripped = line.strip()
        field_name = stripped.partition(":")[0]
        if field_name in replacements:
            updated.append(replacements[field_name])
            seen.add(field_name)
            continue
        updated.append(line)
        if stripped.startswith("description:"):
            for required_name in ("test_execution_contract", "deployment_contract", "runtime_observation_contract"):
                if required_name in seen or required_name in existing_fields:
                    continue
                updated.append(replacements[required_name])
                seen.add(required_name)
    constraints_path.write_text("\n".join(updated) + "\n", encoding="utf-8")


def _set_ambiguity_risk_appetite(workspace: Path, appetite: str) -> None:
    constraints_path = workspace / ".ai-workspace" / "context" / "project_constraints.yml"
    lines = constraints_path.read_text(encoding="utf-8").splitlines()
    updated: list[str] = []
    replaced = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("ambiguity_risk_appetite:"):
            indent = line[: len(line) - len(line.lstrip())]
            updated.append(f'{indent}ambiguity_risk_appetite: "{appetite}"')
            replaced = True
            continue
        updated.append(line)
        if stripped.startswith("test_runner:") and not replaced:
            indent = line[: len(line) - len(line.lstrip())]
            updated.append(f'{indent}ambiguity_risk_appetite: "{appetite}"')
            replaced = True
    constraints_path.write_text("\n".join(updated) + "\n", encoding="utf-8")


def _append_design_tenant(
    workspace: Path,
    *,
    name: str,
    output_dir: str,
    description: str,
    test_execution_contract: str = "",
    deployment_contract: str = "",
    runtime_observation_contract: str = "",
) -> None:
    constraints_path = workspace / ".ai-workspace" / "context" / "project_constraints.yml"
    lines = constraints_path.read_text(encoding="utf-8").splitlines()
    tenant_block = "\n".join(
        (
            f'    - name: "{name}"',
            f'      output_dir: "{output_dir}"',
            f'      description: "{description}"',
            f'      test_execution_contract: "{test_execution_contract}"',
            f'      deployment_contract: "{deployment_contract}"',
            f'      runtime_observation_contract: "{runtime_observation_contract}"',
        )
    )
    updated: list[str] = []
    inserted = False
    for line in lines:
        if not inserted and line.strip().startswith("root_code_policy:"):
            updated.extend(tenant_block.splitlines())
            inserted = True
        updated.append(line)
    if not inserted:
        raise AssertionError("expected root_code_policy in project_constraints.yml")
    constraints_path.write_text("\n".join(updated) + "\n", encoding="utf-8")


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
    assert report["platform"] == "scala_spark"
    assert report["changed"] is True
    assert [action["kind"] for action in report["actions"]] == [
        "create_product_surface",
        "create_goals_surface",
        "create_requirements_root",
        "create_imported_requirements_summary",
        "create_project_bootstrap",
        "normalize_project_constraints",
        "create_tenant_registry",
        "create_stateful_builder_control_frame",
        "create_realized_test_source_obligation",
        "create_realization_deepening_control_frame",
        "create_ambiguity_register",
        "create_requirement_closure_register",
        "create_requirement_closure_prompt_context",
        "create_analysis_manifest",
        "create_workspace_state",
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
    assert ".ai-workspace/runtime/odd_sdlc-ambiguity-register.json" in project_bootstrap
    assert ".ai-workspace/runtime/odd_sdlc-requirement-closure.json" in project_bootstrap
    assert "- `README.md` only as provenance/context after the imported authority" in project_bootstrap
    assert "## Installed Runtime Start Surface" in project_bootstrap
    assert "PYTHONPATH=.genesis python -m genesis start --auto --workspace ." in project_bootstrap
    assert "it does not proxy F_P transport failures" in project_bootstrap
    assert "deployment, runtime-return, and similar side-effect stages only traverse" in project_bootstrap
    assert "construction_complete_pending_execution" in project_bootstrap
    assert "treat legacy bootstrap instructions" in project_bootstrap
    constraints = (workspace / ".ai-workspace" / "context" / "project_constraints.yml").read_text(encoding="utf-8")
    assert 'name: "data_mapper.test18"' in constraints
    assert 'name: "scala_spark"' in constraints
    assert 'output_dir: "build_tenants/scala_spark/"' in constraints
    assert 'ambiguity_risk_appetite: "medium"' in constraints
    assert 'test_execution_contract: ""' in constraints
    assert 'deployment_contract: ""' in constraints
    assert 'runtime_observation_contract: ""' in constraints
    tenant_registry = (workspace / "build_tenants" / "TENANT_REGISTRY.md").read_text(encoding="utf-8")
    assert "`scala_spark`" in tenant_registry
    assert "`build_tenants/scala_spark/`" in tenant_registry
    ambiguity_register = json.loads(
        (workspace / ".ai-workspace" / "runtime" / "odd_sdlc-ambiguity-register.json").read_text(encoding="utf-8")
    )
    assert ambiguity_register["register_kind"] == "odd_sdlc.ambiguity_register"
    assert ambiguity_register["summary"]["total"] >= 2
    assert ambiguity_register["project_profile"]["ambiguity_risk_appetite"] == "medium"
    missing_deployment = next(
        entry for entry in ambiguity_register["ambiguities"] if entry["ambiguity_id"] == "missing-deployment-capability"
    )
    assert missing_deployment["policy_action"] == "hard_block"
    assert missing_deployment["status"] == "pending_capability"
    requirement_closure_register = json.loads(
        (workspace / ".ai-workspace" / "runtime" / "odd_sdlc-requirement-closure.json").read_text(encoding="utf-8")
    )
    assert requirement_closure_register["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert requirement_closure_register["summary"]["total_live_requirements"] == 0
    workspace_state = load_workspace_state(workspace)
    assert workspace_state is not None
    assert workspace_state["ready"] is True
    assert workspace_state["workspace_mode"] == "governed_workspace"
    assert workspace_state["project_profile"]["tenant_name"] == "scala_spark"
    assert workspace_state["analysis_manifest_path"] == ANALYSIS_MANIFEST_PATH.as_posix()
    analysis_manifest = load_analysis_manifest(workspace)
    assert analysis_manifest is not None
    assert analysis_manifest["manifest_kind"] == "odd_sdlc.analysis_manifest"
    assert analysis_manifest["analysis_fingerprint"] == workspace_state["analysis_fingerprint"]
    assert {entry["artifact_kind"] for entry in analysis_manifest["published_artifacts"]} == {
        "ambiguity_register",
        "requirement_closure_register",
        "requirement_closure_prompt_context",
    }
    assert any(entry["input_kind"] == "project_constraints" for entry in analysis_manifest["source_inputs"])
    assert report["workspace_state_path"] == WORKSPACE_STATE_PATH.as_posix()
    assert report["analysis_manifest_path"] == ANALYSIS_MANIFEST_PATH.as_posix()

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
    assert payload["platform"] == "scala_spark"
    assert payload["normalization"]["platform"] == "scala_spark"
    assert payload["runtime_contract"] == ".odd_sdlc/release/genesis.yml"
    assert payload["agents_md"] in {"prepended", "updated", "created"}
    assert payload["claude_md"] in {"prepended", "updated", "created"}
    assert (workspace / ".odd_sdlc" / "release" / "genesis.yml").exists()
    assert (workspace / ".odd_sdlc" / "python" / "code" / "odd_sdlc" / "__main__.py").exists()
    assert (workspace / ".odd_sdlc" / "python" / "design" / "fp" / "STATEFUL_ITERATOR_CONTROL_FRAME.md").exists()
    assert (workspace / ".odd_sdlc" / "python" / "design" / "fp" / "REALIZATION_DEEPENING_CONTROL_FRAME.md").exists()
    assert not (workspace / "build_tenants" / "odd_sdlc").exists()
    kernel_text = (workspace / ".genesis" / "genesis.yml").read_text(encoding="utf-8")
    assert "runtime_contract: .odd_sdlc/release/genesis.yml" in kernel_text
    runtime_contract_text = (workspace / ".odd_sdlc" / "release" / "genesis.yml").read_text(encoding="utf-8")
    assert "runtime_backend: claude" in runtime_contract_text
    assert "  - .odd_sdlc/python/code" in runtime_contract_text
    workspace_state = load_workspace_state(workspace)
    assert workspace_state is not None
    assert workspace_state["ready"] is True
    assert workspace_state["workspace_mode"] == "installed_target"
    assert workspace_state["analysis_fingerprint"]
    analysis_manifest = load_analysis_manifest(workspace)
    assert analysis_manifest is not None
    assert analysis_manifest["analysis_fingerprint"] == workspace_state["analysis_fingerprint"]
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
        assert "`workspace://.ai-workspace/runtime/odd_sdlc-ambiguity-register.json`" in text
        assert "`workspace://.ai-workspace/runtime/odd_sdlc-requirement-closure.json`" in text
        assert "`workspace://.odd_sdlc/release/genesis.yml`" in text
        assert "- platform: `scala_spark`" in text
        assert "## 4. Start Here" in text
        assert "PYTHONPATH=.genesis python -m genesis start --auto --workspace ." in text
        assert "it does not proxy F_P transport failures" in text
        assert "deployment, runtime-return, and other side-effect stages only traverse" in text
        assert "unresolved live requirements remain active future pressure across iterations" in text
        assert "construction_complete_pending_execution" in text
        assert "treat them as provenance only" in text
        assert "README.md` (provenance/context only; do not use as primary identity evidence)" in text
        assert "<!-- GTL_BOOTLOADER_START -->" in text
        assert text.index("<!-- ODD_SDLC_BOOTLOADER_START -->") < text.index("<!-- GTL_BOOTLOADER_START -->")

    env = os.environ.copy()
    env["PYTHONPATH"] = os.pathsep.join(
        (
            str(workspace / ".genesis"),
            str(workspace / ".odd_sdlc" / "python" / "code"),
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
    assert len(payload["gaps"]) == 18


def test_module_export_is_materialized_and_stable() -> None:
    import odd_sdlc.gtl_module as gtl_module  # noqa: E402
    from gtl.module_model import Module  # noqa: E402

    assert isinstance(gtl_module.MODULE, Module)
    assert gtl_module.MODULE.graph_functions is gtl_module.MODULE.graph_functions
    assert gtl_module.MODULE.jobs is gtl_module.MODULE.jobs
    published_ids = {graph_function.id for graph_function in gtl_module.MODULE.graph_functions}
    contracted_ids = {
        contract.target_id
        for job in gtl_module.MODULE.jobs
        for contract in job.contracts
        if contract.kind == "graph_function"
    }
    assert contracted_ids <= published_ids


def test_module_gates_operational_cycle_without_declared_capability(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test18"
    _seed_imported_workspace(workspace)

    import odd_sdlc.gtl_module as gtl_module  # noqa: E402

    gated = gtl_module.module(workspace)
    assert "release_operational_cycle" not in [function.name for function in gated.graph_functions]
    assert gated.metadata.get("active_operational_steps") == ()


def test_module_publishes_operational_cycle_when_capability_is_declared(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test18"
    _seed_imported_workspace(workspace)
    _append_tenant_capability_contracts(
        workspace,
        deployment_contract="docs/deployment-contract.md",
        runtime_observation_contract="docs/runtime-observation-contract.md",
    )

    import odd_sdlc.gtl_module as gtl_module  # noqa: E402

    enabled = gtl_module.module(workspace)
    assert "release_operational_cycle" in [function.name for function in enabled.graph_functions]
    assert enabled.metadata.get("active_operational_steps") == (
        "prepare_deployment_surface",
        "derive_runtime_observation_surface",
        "derive_retrofit_plan_surface",
    )

 
def test_module_fails_closed_when_constraints_are_absent(tmp_path: Path) -> None:
    workspace = tmp_path / "no-constraints"
    (workspace / "specification").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "INTENT.md").write_text("# Intent\n", encoding="utf-8")

    import odd_sdlc.gtl_module as gtl_module  # noqa: E402

    module = gtl_module.module(workspace)
    assert "release_operational_cycle" not in [function.name for function in module.graph_functions]
    assert module.metadata.get("active_operational_steps") == ()


def test_query_domain_uses_explicit_workspace_root_when_called_outside_workspace(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test18"
    _seed_imported_workspace(workspace)

    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join((str(GENESIS_PATH), str(CODE_PATH), str(TESTS_DIR))),
    }
    result = subprocess.run(
        [sys.executable, "-m", "odd_sdlc", "query-domain", "--workspace", str(workspace)],
        cwd=str(ROOT),
        env=env,
        capture_output=True,
        text=True,
        timeout=120,
        check=True,
    )
    payload = json.loads(result.stdout)

    assert "release_operational_cycle" not in [entry["name"] for entry in payload["programs"]]
    assert "prepare_deployment_surface" not in [entry["name"] for entry in payload["functions"]]
    assert "prepare_deployment_surface" not in [entry["name"] for entry in payload["graph_functions"]]


def test_ungoverned_test_reports_are_not_counted_as_governed_evidence(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test18"
    _seed_imported_workspace(workspace)
    report_root = workspace / "imp_scala_spark" / "target" / "test-reports"
    report_root.mkdir(parents=True, exist_ok=True)
    (workspace / "imp_scala_spark" / "build.sbt").write_text("// build marker\n", encoding="utf-8")
    (report_root / "TEST-fake.xml").write_text(
        '<testsuite tests="2" failures="0" errors="0" skipped="0"></testsuite>',
        encoding="utf-8",
    )

    summary = summarize_test_evidence(workspace)
    assert summary["report_file_count"] == 0
    assert summary["parsed_report_count"] == 0
    assert summary["tests"] == 0
    assert summary["ungoverned_report_file_count"] == 1
    assert summary["ungoverned_report_paths"] == ["imp_scala_spark/target/test-reports/TEST-fake.xml"]


def test_requirement_closure_register_preserves_carry_forward_and_traceability(tmp_path: Path) -> None:
    workspace = tmp_path / "traceability.test"
    (workspace / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "scenarios").mkdir(parents=True, exist_ok=True)
    (workspace / "build_tenants" / "python" / "design").mkdir(parents=True, exist_ok=True)
    (workspace / "build_tenants" / "python" / "test_env" / "tests").mkdir(parents=True, exist_ok=True)
    (workspace / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (workspace / "build_tenants" / "python" / "src" / "main").mkdir(parents=True, exist_ok=True)
    (workspace / "build_tenants" / "python" / "src" / "test").mkdir(parents=True, exist_ok=True)

    (workspace / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "project:",
                '  name: "traceability.test"',
                '  kind: "software-project"',
                '  language: "Python"',
                '  test_runner: "pytest"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "python"',
                '      output_dir: "build_tenants/python/"',
                '      description: "traceability lane"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )
    (workspace / "specification" / "INTENT.md").write_text(
        "# Intent\n\n- INT-001: Preserve live requirement closure through iteration\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "GOALS.md").write_text(
        "# Goals\n\n- INT-001: Preserve live requirement closure through iteration\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "requirements" / "01-live.md").write_text(
        "# Live Requirements\n\n- REQ-CORE-001\n- REQ-CORE-002\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "requirements" / "10-generated-bootstrap.md").write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-CORE-001\n- REQ-CORE-002\n",
        encoding="utf-8",
    )
    (workspace / "build_tenants" / "python" / "design" / "40-generated-implementation-design.md").write_text(
        "# Generated Implementation Design\n\n- REQ-CORE-001\n",
        encoding="utf-8",
    )
    (workspace / "build_tenants" / "python" / "design" / "40-generated-implementation-modules.md").write_text(
        "# Generated Implementation Modules\n\n- module alpha realizes REQ-CORE-001\n",
        encoding="utf-8",
    )
    (workspace / "build_tenants" / "python" / "test_env" / "tests" / "40-generated-test-modules.md").write_text(
        "# Generated Test Modules\n\n- test lane validates REQ-CORE-001\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "scenarios" / "30-generated-testcase-authority.md").write_text(
        "# Generated Testcase Authority\n\n- REQ-CORE-001\n",
        encoding="utf-8",
    )
    (workspace / "build_tenants" / "python" / "src" / "main" / "logic.py").write_text(
        '# Implements: REQ-CORE-001\n\ndef run() -> int:\n    return 1\n',
        encoding="utf-8",
    )
    (workspace / "build_tenants" / "python" / "src" / "test" / "test_logic.py").write_text(
        '# Validates: REQ-CORE-001\n\ndef test_run() -> None:\n    assert True\n',
        encoding="utf-8",
    )

    register = build_requirement_closure_register(workspace, stage="test")
    entries = {entry["requirement_id"]: entry for entry in register["requirements"]}
    assert register["register_kind"] == "odd_sdlc.requirement_closure_register"
    assert entries["REQ-CORE-001"]["status"] == "realized"
    assert entries["REQ-CORE-002"]["status"] == "specified"
    assert register["summary"]["missing_from_current_requirement_surface"] == 0

    refreshed = refresh_requirement_closure_register(workspace, stage="test")
    assert refreshed["summary"]["missing_from_current_requirement_surface"] == 0
    prompt_context_path = workspace / REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH
    prompt_context = prompt_context_path.read_text(encoding="utf-8")
    assert "full closure register for on-demand inspection" in prompt_context
    assert ".ai-workspace/runtime/odd_sdlc-requirement-closure.json" in prompt_context
    assert "missing from current requirement surface: none" in prompt_context


def test_requirement_closure_register_ignores_family_headers_and_counts_written_testcase_authority(tmp_path: Path) -> None:
    workspace = tmp_path / "traceability.family_matrix"
    (workspace / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "scenarios").mkdir(parents=True, exist_ok=True)
    (workspace / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (workspace / ".ai-workspace" / "runtime").mkdir(parents=True, exist_ok=True)

    (workspace / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "project:",
                '  name: "traceability.family_matrix"',
                '  kind: "software-project"',
                '  language: "Python"',
                '  test_runner: "pytest"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "python"',
                '      output_dir: "build_tenants/python/"',
                '      description: "traceability lane"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )
    (workspace / "specification" / "INTENT.md").write_text(
        "# Intent\n\n- INT-001: Preserve testcase authority truth.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "GOALS.md").write_text(
        "# Goals\n\n- INT-001: Preserve testcase authority truth.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "requirements" / "09-odd-service-orchestration-plane.md").write_text(
        "\n".join(
            (
                "# odd_service Orchestration Plane Requirements",
                "",
                "**Family**: REQ-F-ODDSVC-*",
                "",
                "### REQ-F-ODDSVC-001",
                "",
                "### REQ-F-ODDSVC-002",
                "",
            )
        ),
        encoding="utf-8",
    )
    (workspace / "specification" / "requirements" / "10-generated-bootstrap.md").write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-F-ODDSVC-001\n- REQ-F-ODDSVC-002\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "scenarios" / "08-odd-service-orchestration-plane.md").write_text(
        "# odd_service Orchestration Plane\n\n**Validates**: REQ-F-ODDSVC-001, REQ-F-ODDSVC-002\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "scenarios" / "TESTCASE_AUTHORITY.md").write_text(
        "\n".join(
            (
                "# Testcase Authority Matrix",
                "",
                "| Requirement family | Authority surface | Notes |",
                "| --- | --- | --- |",
                "| `REQ-F-ODDSVC-*` | `08-odd-service-orchestration-plane.md` | proves the service boundary |",
                "",
            )
        ),
        encoding="utf-8",
    )

    register = build_requirement_closure_register(workspace, stage="test")
    entries = {entry["requirement_id"]: entry for entry in register["requirements"]}

    assert "REQ-F-ODDSVC" not in entries
    assert register["summary"]["total_live_requirements"] == 2
    assert entries["REQ-F-ODDSVC-001"]["testcase_authority_refs"] == [
        "specification/scenarios/08-odd-service-orchestration-plane.md",
        "specification/scenarios/TESTCASE_AUTHORITY.md",
    ]
    assert entries["REQ-F-ODDSVC-002"]["testcase_authority_refs"] == [
        "specification/scenarios/08-odd-service-orchestration-plane.md",
        "specification/scenarios/TESTCASE_AUTHORITY.md",
    ]


def test_default_claude_manifest_declares_domain_dispatch_timeout(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test18"
    _seed_data_mapper_template_workspace(workspace)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert payload["status"] == "installed"

    start_payload = json.loads(
        run_installed_genesis(
            workspace,
            "start",
            timeout=60,
        ).stdout
    )
    assert start_payload["status"] == "iterated"
    assert start_payload["blocking_reason"] == "fp_dispatch"
    assert start_payload["edge"] == "derive_intent_surface"

    manifest = json.loads(Path(start_payload["fp_manifest_path"]).read_text(encoding="utf-8"))
    assert manifest["selected_backend"] == "claude"
    assert manifest["backend_id"] == "claude"
    assert manifest["resolved_policy"]["dispatch"]["config"]["timeout"] == 1800
    assert "stateful workspace asset under construction" in manifest["prompt"]
    assert "Do not treat the edge like a one-shot pure function call over serialized state." in manifest["prompt"]
    assert (workspace / ".ai-workspace" / "runtime" / "odd_sdlc-realization-deepening-control-frame.md").exists()


@pytest.mark.usecase_id("data_mapper_template_inherited_e2e")
def test_data_mapper_template_as_is_requires_scope_and_traceability_work_before_auto_convergence(run_archive) -> None:
    workspace = run_archive.workspace
    _seed_data_mapper_template_workspace(workspace)

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
    assert len(gaps_payload["gaps"]) == 18

    start_result = run_installed_genesis(
        workspace,
        "start",
        "--auto",
        archive=run_archive,
        label="data_mapper start",
        timeout=180,
        check=False,
    )
    run_archive.capture_text("start.stdout.txt", start_result.stdout)
    run_archive.capture_text("start.stderr.txt", start_result.stderr)
    assert start_result.returncode == 6
    start_payload = json.loads(start_result.stdout)
    run_archive.capture_json("start.payload.json", start_payload)
    assert start_payload["status"] == "yield"
    assert start_payload["stopped_by"] == "yield"
    assert start_payload["handoff_kind"] == "observer_handoff"
    assert start_payload["handoff_reason"] == "fd_findings"

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
    assert final_gaps_payload["converged"] is False
    assert any(gap["edge"] == "derive_test_run_archive_surface" for gap in final_gaps_payload["gaps"])

    events = read_events(workspace)
    run_archive.capture_json("events.completed.json", events)
    event_types = [event["event_type"] for event in events]
    assert "worker_turn_started" in event_types
    assert ("assessed" in event_types) or ("found" in event_types)
    assert "graph_call_closed" in event_types
    assert "continuation_opened" in event_types
    assert "run_yielded" in event_types
    assert "run_failed" not in event_types
    assert all(event.get("data", {}).get("failure_class") != "policy_config_defect" for event in events)
    assert not any(event["event_type"] == "graph_call_failed" for event in events)
    assert any(
        event["event_type"] == "found"
        and event.get("data", {}).get("kind") == "fd_findings"
        for event in events
    )
    graph_call_edges = [
        event["data"]["edge"]
        for event in events
        if event["event_type"] == "graph_call_opened"
    ]
    yielded_graph_calls = [
        event
        for event in events
        if event["event_type"] == "graph_call_opened"
        and event["data"].get("edge") == start_payload["edge"]
        and event["data"].get("run_id") == start_payload["run_id"]
        and event["data"].get("call_id") == start_payload["call_id"]
    ]
    assert graph_call_edges[0] == "derive_intent_surface"
    assert len(yielded_graph_calls) == 1
    assert len(graph_call_edges) >= 1
    assert "prepare_release_surface" not in graph_call_edges
    assert "prepare_deployment_surface" not in graph_call_edges
    assert "derive_runtime_observation_surface" not in graph_call_edges
    assert "derive_retrofit_plan_surface" not in graph_call_edges
    assert any(event["event_type"] == "found" for event in events)

    manifest_dir = workspace / ".ai-workspace" / "fp_manifests"
    result_dir = workspace / ".ai-workspace" / "fp_results"
    assert any(manifest_dir.iterdir())
    assert result_dir.exists()
    first_manifest = json.loads(sorted(manifest_dir.iterdir())[0].read_text(encoding="utf-8"))
    assert first_manifest["resolved_policy"]["dispatch"]["config"]["timeout"] == 1800

    intent_text = (workspace / "specification" / "INTENT.md").read_text(encoding="utf-8")
    product_text = (workspace / "specification" / "PRODUCT.md").read_text(encoding="utf-8")
    assert "Categorical Data Mapping & Computation Engine (CDME)" in intent_text
    assert "`odd_sdlc` exists to prove" not in intent_text
    assert "generated software-domain read model over the imported project authority" in product_text
    assert "toy app" not in product_text
    assert not (workspace / "docs" / "40-generated-release.md").exists()
    assert not (workspace / "docs" / "50-generated-deployment.md").exists()
    assert not (workspace / "docs" / "60-generated-runtime-observation.md").exists()

    run_archive.update_summary(
        initial_gap_count=len(gaps_payload["gaps"]),
        final_total_delta=final_gaps_payload["total_delta"],
        graph_call_edges=graph_call_edges,
        preserved_project_identity=True,
        governed_code_root="build_tenants/scala_spark/",
        release_status="not_reached",
        active_operational_steps=[],
    )


def test_install_release_keeps_downstream_common_out_of_default_project_topology(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test_common"
    _seed_data_mapper_template_workspace(workspace)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )

    assert payload["status"] == "installed"
    assert (workspace / ".odd_sdlc").exists()
    assert not (workspace / "build_tenants" / "common").exists()
    assert not (workspace / "build_tenants" / "odd_sdlc").exists()

    constraints = (workspace / ".ai-workspace" / "context" / "project_constraints.yml").read_text(encoding="utf-8")
    assert 'name: "scala_spark"' in constraints
    assert 'output_dir: "build_tenants/scala_spark/"' in constraints
    assert "build_tenants/common/" not in constraints
    assert "build_tenants/odd_sdlc/" not in constraints

    tenant_registry = (workspace / "build_tenants" / "TENANT_REGISTRY.md").read_text(encoding="utf-8")
    assert "`scala_spark`" in tenant_registry
    assert "`build_tenants/scala_spark/`" in tenant_registry
    assert "`common`" not in tenant_registry
    assert "`odd_sdlc`" not in tenant_registry


def test_normalize_workspace_preserves_onboarded_secondary_tenant_without_topology_migration(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.test_dbt"
    _seed_data_mapper_template_workspace(workspace)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert payload["status"] == "installed"

    _append_design_tenant(
        workspace,
        name="dbt",
        output_dir="build_tenants/dbt/",
        description="Warehouse realization tenant",
    )
    dbt_model = workspace / "build_tenants" / "dbt" / "models" / "mart_orders.sql"
    dbt_model.parent.mkdir(parents=True, exist_ok=True)
    dbt_model.write_text("select 1 as order_id\n", encoding="utf-8")

    report = normalize_workspace(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )

    assert report["changed"] is True
    assert (workspace / "build_tenants" / "dbt" / "models" / "mart_orders.sql").read_text(encoding="utf-8") == "select 1 as order_id\n"

    constraints = (workspace / ".ai-workspace" / "context" / "project_constraints.yml").read_text(encoding="utf-8")
    assert constraints.count('- name: "') >= 2
    assert '    - name: "scala_spark"' in constraints
    assert '      output_dir: "build_tenants/scala_spark/"' in constraints
    assert '    - name: "dbt"' in constraints
    assert '      output_dir: "build_tenants/dbt/"' in constraints

    tenant_registry = (workspace / "build_tenants" / "TENANT_REGISTRY.md").read_text(encoding="utf-8")
    assert "`scala_spark`" in tenant_registry
    assert "`build_tenants/scala_spark/`" in tenant_registry
    assert "`dbt`" in tenant_registry
    assert "`build_tenants/dbt/`" in tenant_registry

    profile = load_project_profile(workspace)
    assert profile.tenant_name == "scala_spark"
    assert profile.output_dir == "build_tenants/scala_spark/"


def test_load_project_profile_preserves_realized_declared_output_root_for_source_style_workspace(tmp_path: Path) -> None:
    workspace = tmp_path / "odd_sdlc.source_like"
    (workspace / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "INTENT.md").write_text(
        "# Intent\n\n- INT-001: Keep source-style tenant realization attributable.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "GOALS.md").write_text(
        "# Goals\n\n- INT-001: Keep source-style tenant realization attributable.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "requirements" / "10-generated-bootstrap.md").write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-CORE-001: Preserve source-style declared realization roots.\n",
        encoding="utf-8",
    )
    (workspace / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "project:",
                '  name: "odd_sdlc_source_like"',
                '  kind: "software-project"',
                '  language: "Python"',
                '  test_runner: "pytest"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "python"',
                '      output_dir: "build_tenants/odd_sdlc/python/"',
                '      description: "Source-style tenant root"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )
    code_path = workspace / "build_tenants" / "odd_sdlc" / "python" / "src" / "main" / "logic.py"
    code_path.parent.mkdir(parents=True, exist_ok=True)
    code_path.write_text(
        "# Implements: REQ-CORE-001\n\ndef run() -> int:\n    return 1\n",
        encoding="utf-8",
    )

    profile = load_project_profile(workspace)
    assert profile.output_dir == "build_tenants/odd_sdlc/python/"
    assert profile.realization_mode == "selected_output_tree"
    assert profile.resolution_reason == "declared_output_tree"

    register = build_requirement_closure_register(workspace, stage="test")
    entries = {entry["requirement_id"]: entry for entry in register["requirements"]}
    assert entries["REQ-CORE-001"]["code_refs"] == ["build_tenants/odd_sdlc/python/src/main/logic.py"]

    queried = query_domain(initialize(bootstrap(workspace_root=workspace)))
    assert queried["analysis_manifest"] is None
    queried_entries = {
        entry["requirement_id"]: entry
        for entry in queried["requirement_closure_register"]["requirements"]
    }
    assert queried_entries["REQ-CORE-001"]["code_refs"] == ["build_tenants/odd_sdlc/python/src/main/logic.py"]


@pytest.mark.skip(
    reason="Invariant no longer expressible after build_tenants collapse: "
    "declared project tenant and governance neighbor both land under build_tenants/odd_sdlc/, "
    "so they can no longer be distinguished for code_ref attribution."
)
def test_load_project_profile_keeps_declared_project_tenant_when_governance_neighbor_exists(tmp_path: Path) -> None:
    workspace = tmp_path / "odd_sdlc.nested_competitor"
    (workspace / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "INTENT.md").write_text(
        "# Intent\n\n- INT-001: Keep the active realization root attributable.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "GOALS.md").write_text(
        "# Goals\n\n- INT-001: Keep the active realization root attributable.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "requirements" / "10-generated-bootstrap.md").write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-CORE-001: Bind to the realized tenant root.\n",
        encoding="utf-8",
    )
    (workspace / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "project:",
                '  name: "odd_sdlc_nested_competitor"',
                '  kind: "software-project"',
                '  language: "Python"',
                '  test_runner: "pytest"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "python"',
                '      output_dir: "build_tenants/odd_sdlc/python/"',
                '      description: "Placeholder source-style tenant root"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )
    placeholder_path = workspace / "build_tenants" / "odd_sdlc" / "python" / "src" / "main" / "placeholder.py"
    placeholder_path.parent.mkdir(parents=True, exist_ok=True)
    placeholder_path.write_text(
        "# Implements: REQ-CORE-001\n\ndef placeholder() -> None:\n    return None\n",
        encoding="utf-8",
    )
    realized_root = workspace / "build_tenants" / "odd_sdlc" / "python"
    realized_root.mkdir(parents=True, exist_ok=True)
    (realized_root / "pyproject.toml").write_text("[project]\nname='odd_sdlc'\n", encoding="utf-8")
    realized_code = realized_root / "code" / "odd_sdlc" / "app.py"
    realized_code.parent.mkdir(parents=True, exist_ok=True)
    realized_code.write_text(
        "# Implements: REQ-CORE-001\n\ndef run() -> int:\n    return 1\n",
        encoding="utf-8",
    )

    profile = load_project_profile(workspace)
    assert profile.output_dir == "build_tenants/odd_sdlc/python/"
    assert profile.realization_mode == "selected_output_tree"
    assert profile.resolution_reason == "declared_output_tree"

    register = build_requirement_closure_register(workspace, stage="test")
    entries = {entry["requirement_id"]: entry for entry in register["requirements"]}
    assert entries["REQ-CORE-001"]["code_refs"] == ["build_tenants/odd_sdlc/python/src/main/placeholder.py"]

    ambiguities = detect_project_profile_ambiguities(workspace, stage="test")
    assert {
        entry["class"]
        for entry in ambiguities
    }.isdisjoint({"multiple_realization_roots", "declared_root_vs_realized_root_mismatch"})


@pytest.mark.skip(
    reason="Invariant no longer expressible after build_tenants collapse: "
    "build_tenants/python/ is simultaneously the canonical output for the 'python' tenant "
    "and the builder-product layout, so declared-vs-builder-product disambiguation cannot be tested."
)
def test_load_project_profile_ignores_builder_product_neighbors_in_source_repo(tmp_path: Path) -> None:
    workspace = tmp_path / "odd_sdlc.builder_products"
    (workspace / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "requirements").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "INTENT.md").write_text(
        "# Intent\n\n- INT-001: Keep builder products out of project-tenant resolution.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "GOALS.md").write_text(
        "# Goals\n\n- INT-001: Keep builder products out of project-tenant resolution.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "requirements" / "10-generated-bootstrap.md").write_text(
        "# Generated Bootstrap Requirements\n\n- REQ-CORE-001: Preserve the source repo declared tenant.\n",
        encoding="utf-8",
    )
    (workspace / "specification" / "requirements" / "09-odd-service-orchestration-plane.md").write_text(
        "# odd_service Orchestration Plane Requirements\n\n### REQ-F-ODDSVC-001\n\n- Preserve the source-repo service boundary.\n",
        encoding="utf-8",
    )
    (workspace / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "project:",
                '  name: "odd_sdlc_builder_products"',
                '  kind: "software-project"',
                '  language: "Python"',
                '  test_runner: "pytest"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "python"',
                '      output_dir: "build_tenants/odd_sdlc/python/"',
                '      description: "Declared source-style tenant root"',
                '      test_execution_contract: "pytest"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )
    declared_code = workspace / "build_tenants" / "odd_sdlc" / "python" / "src" / "main" / "logic.py"
    declared_code.parent.mkdir(parents=True, exist_ok=True)
    declared_code.write_text(
        "# Implements: REQ-CORE-001\n\ndef run() -> int:\n    return 1\n",
        encoding="utf-8",
    )

    odd_sdlc_root = workspace / "build_tenants" / "python" / "code" / "odd_sdlc"
    odd_sdlc_root.mkdir(parents=True, exist_ok=True)
    (odd_sdlc_root / "app.py").write_text(
        "# Implements: REQ-CORE-001\n\ndef run() -> int:\n    return 1\n",
        encoding="utf-8",
    )
    (workspace / "build_tenants" / "python" / "pyproject.toml").write_text(
        "[project]\nname='odd_sdlc'\n",
        encoding="utf-8",
    )

    odd_service_root = workspace / "build_tenants" / "odd_service" / "python" / "code" / "odd_service"
    odd_service_root.mkdir(parents=True, exist_ok=True)
    for module_name in ("app.py", "server.py", "client.py", "workers.py"):
        (odd_service_root / module_name).write_text(
            "def marker() -> str:\n    return 'odd_service'\n",
            encoding="utf-8",
        )
    (workspace / "build_tenants" / "odd_service" / "python" / "pyproject.toml").write_text(
        "[project]\nname='odd_service'\n",
        encoding="utf-8",
    )

    profile = load_project_profile(workspace)
    assert profile.output_dir == "build_tenants/odd_sdlc/python/"
    assert profile.realization_mode == "selected_output_tree"
    assert profile.resolution_reason == "declared_output_tree"
    assert realization_candidates_for_declared_root(workspace) == []

    ambiguities = detect_project_profile_ambiguities(workspace, stage="test")
    assert {
        entry["class"]
        for entry in ambiguities
    }.isdisjoint({"multiple_realization_roots", "declared_root_vs_realized_root_mismatch"})

    queried = query_domain(initialize(bootstrap(workspace_root=workspace)))
    assert queried["analysis_manifest"] is None
    assert queried["requirement_closure_register"]["traceability"]["code_root"] == "build_tenants/python"
    queried_entries = {
        entry["requirement_id"]: entry
        for entry in queried["requirement_closure_register"]["requirements"]
    }
    assert queried_entries["REQ-CORE-001"]["code_refs"] == ["build_tenants/python/code/odd_sdlc/app.py"]


def test_installed_normalize_workspace_without_platform_preserves_existing_active_tenant(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.normalize_default"
    _seed_data_mapper_template_workspace(workspace)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert payload["status"] == "installed"

    result = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "normalize-workspace",
            timeout=60,
        ).stdout
    )
    assert result["platform"] == "scala_spark"

    constraints = (workspace / ".ai-workspace" / "context" / "project_constraints.yml").read_text(encoding="utf-8")
    assert '    - name: "scala_spark"' in constraints
    assert '      output_dir: "build_tenants/scala_spark/"' in constraints
    assert '    - name: "python"' not in constraints
    assert '      output_dir: "build_tenants/python/"' not in constraints


def test_summarize_test_evidence_counts_foreign_secondary_tenant_reports(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper.foreign_reports"
    (workspace / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)
    (workspace / "specification").mkdir(parents=True, exist_ok=True)
    (workspace / "specification" / "INTENT.md").write_text("# Intent\n", encoding="utf-8")
    (workspace / "specification" / "PRODUCT.md").write_text("# Product\n", encoding="utf-8")
    (workspace / "specification" / "GOALS.md").write_text("# Goals\n", encoding="utf-8")
    (workspace / ".ai-workspace" / "context" / "project_constraints.yml").write_text(
        "\n".join(
            (
                "project:",
                '  name: "data_mapper_foreign_reports"',
                '  kind: "software-project"',
                '  language: "Scala"',
                '  test_runner: "sbt test"',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                '    - name: "scala_spark"',
                '      output_dir: "build_tenants/scala_spark/"',
                '      description: "Active governed realization tenant"',
                '      test_execution_contract: "sbt test"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                '    - name: "dbt"',
                '      output_dir: "build_tenants/dbt/"',
                '      description: "Warehouse realization tenant"',
                '      test_execution_contract: "dbt test"',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        ),
        encoding="utf-8",
    )
    active_root = workspace / "build_tenants" / "scala_spark"
    active_root.mkdir(parents=True, exist_ok=True)
    (active_root / "build.sbt").write_text('name := "data-mapper"\n', encoding="utf-8")

    report = workspace / "build_tenants" / "dbt" / "target" / "test-reports" / "TEST-foreign.xml"
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text('<testsuite tests="1" failures="0" errors="0" skipped="0"/>', encoding="utf-8")

    summary = summarize_test_evidence(workspace)
    assert summary["ungoverned_report_file_count"] == 1
    assert summary["ungoverned_report_paths"] == ["build_tenants/dbt/target/test-reports/TEST-foreign.xml"]
