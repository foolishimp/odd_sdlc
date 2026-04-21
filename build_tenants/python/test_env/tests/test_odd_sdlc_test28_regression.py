# Validates: REQ-F-ODDSDLC-028
# Validates: REQ-F-ODDSDLC-029
# Validates: REQ-F-ODDSDLC-032
from __future__ import annotations

import json
import subprocess
import shutil
import sys
from pathlib import Path
from typing import Any

import pytest


ROOT = Path(__file__).resolve().parents[4]
GENESIS_PATH = ROOT / ".genesis"
CODE_PATH = ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"
TESTS_DIR = Path(__file__).resolve().parent

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))
if str(TESTS_DIR) not in sys.path:
    sys.path.insert(0, str(TESTS_DIR))

from odd_sdlc.release.install import install as install_release  # noqa: E402
from sandbox_runtime import (  # noqa: E402
    complete_current_call,
    read_events,
    refresh_installed_analysis,
    run_installed_substrate,
    run_installed_odd_sdlc,
    sandbox_env,
)
from test_odd_sdlc_installation import (  # noqa: E402
    DATA_MAPPER_TEMPLATE,
    _seed_data_mapper_template_workspace,
)
from test_odd_sdlc_test19_regression import _seed_test19_like_workspace  # noqa: E402


CHAIN_TO_REQUIREMENT = (
    "derive_intent_surface",
    "derive_product_surface",
    "derive_goal_surface",
    "derive_requirement_surface",
)

CHAIN_TO_CODE = CHAIN_TO_REQUIREMENT + (
    "derive_feature_decomp_surface",
    "derive_uat_testcases_surface",
    "derive_design_surface",
    "derive_scenario_surface",
    "derive_implementation_design_surface",
    "select_implementation_stack_profile",
    "derive_implementation_module_surface",
    "derive_code_surface",
)
CHAIN_TO_PRE_CODE = CHAIN_TO_CODE[:-1]
SECOND_PASS_TARGET = Path("build_tenants/scala_spark/src/main/scala/cdme/runtime/DepthTarget.scala")
LEGACY_SECOND_PASS_TARGET = Path("imp_scala_spark/src/main/scala/cdme/runtime/DepthTarget.scala")


def _run_chain(workspace: Path, *, steps: tuple[str, ...], label_prefix: str) -> dict[str, dict[str, Any]]:
    manifests: dict[str, dict[str, Any]] = {}
    for edge in steps:
        result = complete_current_call(
            workspace,
            label_prefix=f"{label_prefix}_{edge}",
        )
        assert result["start"]["edge"] == edge
        manifest_path = Path(result["start"]["fp_manifest_path"])
        manifests[edge] = json.loads(manifest_path.read_text(encoding="utf-8"))
    return manifests


def _complete_current_call_with_agent(
    workspace: Path,
    *,
    expected_edge: str,
    label_prefix: str,
    agent_script: str,
    target_relative_path: Path,
) -> dict[str, Any]:
    start = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "start",
            label=f"{label_prefix} start",
        ).stdout
    )
    assert start["edge"] == expected_edge
    manifest_path = Path(start["fp_manifest_path"])
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    agent = subprocess.run(
        [
            sys.executable,
            str(TESTS_DIR / agent_script),
            str(manifest["prompt"]),
            target_relative_path.as_posix(),
        ],
        cwd=str(workspace),
        env=sandbox_env(workspace),
        capture_output=True,
        text=True,
        timeout=60,
        check=True,
    )
    assessed = json.loads(
        run_installed_substrate(
            workspace,
            "assess-result",
            "--result",
            str(manifest["result_path"]),
            label=f"{label_prefix} assess-result",
        ).stdout
    )
    return {
        "start": start,
        "manifest": manifest,
        "agent": agent,
        "assessed": assessed,
    }


@pytest.fixture(scope="module")
def data_mapper_template_requirement_replay(tmp_path_factory: pytest.TempPathFactory) -> dict[str, Any]:
    workspace = tmp_path_factory.mktemp("data_mapper_test28_regression")
    _seed_data_mapper_template_workspace(workspace)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert payload["status"] == "installed"

    first_manifests = _run_chain(
        workspace,
        steps=CHAIN_TO_REQUIREMENT,
        label_prefix="test28_requirement_first",
    )

    reset = run_installed_substrate(
        workspace,
        "emit-event",
        "--type",
        "reset",
        "--data",
        json.dumps(
            {
                "scope": "workspace",
                "actor": "tester",
                "reason": "test28 regression replay",
            }
        ),
        timeout=60,
        check=False,
    )
    assert reset.returncode == 0, reset.stderr

    second_manifests = _run_chain(
        workspace,
        steps=CHAIN_TO_REQUIREMENT,
        label_prefix="test28_requirement_second",
    )

    events = read_events(workspace)
    return {
        "workspace": workspace,
        "first_manifests": first_manifests,
        "reset": reset,
        "second_manifests": second_manifests,
        "events": events,
    }


@pytest.fixture(scope="module")
def data_mapper_template_code_pass(tmp_path_factory: pytest.TempPathFactory) -> dict[str, Any]:
    workspace = tmp_path_factory.mktemp("data_mapper_test28_code_regression")
    _seed_data_mapper_template_workspace(workspace)

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert payload["status"] == "installed"

    manifests = _run_chain(
        workspace,
        steps=CHAIN_TO_CODE,
        label_prefix="test28_code",
    )
    events = read_events(workspace)
    return {
        "workspace": workspace,
        "manifests": manifests,
        "events": events,
    }


def test_data_mapper_template_requirement_prompt_stays_compact_and_reference_first(
    data_mapper_template_requirement_replay: dict[str, Any],
) -> None:
    manifests = data_mapper_template_requirement_replay["first_manifests"]
    assert "derive_requirement_surface" in manifests

    requirement_manifest = manifests["derive_requirement_surface"]
    prompt = requirement_manifest["prompt"]

    assert len(prompt) < 20_000
    assert "full closure register for on-demand inspection" in prompt
    assert ".ai-workspace/runtime/odd_sdlc-requirement-closure.json" in prompt
    assert "missing from current requirement surface:" in prompt
    assert '"authority_refs"' not in prompt
    assert '"code_refs"' not in prompt


def test_data_mapper_template_code_prompt_exposes_deepening_law(
    data_mapper_template_code_pass: dict[str, Any],
) -> None:
    manifests = data_mapper_template_code_pass["manifests"]
    events = data_mapper_template_code_pass["events"]
    assert "derive_code_surface" in manifests

    code_manifest = manifests["derive_code_surface"]
    prompt = code_manifest["prompt"]

    assert len(prompt) < 20_000
    assert "This edge works over an existing realization or realization plan, not a blank slate." in prompt
    assert "Existing files and existing module groups are obligations, not proof of completion." in prompt
    assert "Prefer deepening or correcting existing artifacts" in prompt

    opened_edges = [
        event["data"]["edge"]
        for event in events
        if event["event_type"] == "graph_call_opened"
    ]
    assert "derive_code_surface" in opened_edges


def test_data_mapper_template_reset_replay_reruns_from_intent_with_bounded_prompts(
    data_mapper_template_requirement_replay: dict[str, Any],
) -> None:
    first_manifests = data_mapper_template_requirement_replay["first_manifests"]
    second_manifests = data_mapper_template_requirement_replay["second_manifests"]
    events = data_mapper_template_requirement_replay["events"]

    assert any(event["event_type"] == "reset" for event in events)

    requirement_prompts = [
        first_manifests["derive_requirement_surface"]["prompt"],
        second_manifests["derive_requirement_surface"]["prompt"],
    ]
    assert all(len(prompt) < 20_000 for prompt in requirement_prompts)
    assert all("full closure register for on-demand inspection" in prompt for prompt in requirement_prompts)
    assert all('"authority_refs"' not in prompt for prompt in requirement_prompts)
    assert all('"code_refs"' not in prompt for prompt in requirement_prompts)


def test_second_pass_code_replay_can_deepen_an_existing_shallow_realization(tmp_path: Path) -> None:
    workspace = tmp_path / "data_mapper_test28_deepening"
    _seed_test19_like_workspace(workspace)
    legacy_target = workspace / LEGACY_SECOND_PASS_TARGET
    legacy_target.write_text(
        "\n".join(
            (
                "package cdme.runtime",
                "",
                "// Implements: REQ-CDME-001",
                "object DepthTarget {",
                "  def summary(): String = ???",
                "}",
                "",
            )
        ),
        encoding="utf-8",
    )

    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert payload["status"] == "installed"

    target_path = workspace / SECOND_PASS_TARGET
    assert target_path.exists()
    before_first_pass = target_path.read_text(encoding="utf-8")
    assert "???" in before_first_pass

    _run_chain(
        workspace,
        steps=CHAIN_TO_PRE_CODE,
        label_prefix="test28_deepening_first_pre_code",
    )
    first_code_pass = complete_current_call(
        workspace,
        label_prefix="test28_deepening_first_code",
    )
    assert first_code_pass["start"]["edge"] == "derive_code_surface"
    assert target_path.read_text(encoding="utf-8") == before_first_pass

    reset = run_installed_substrate(
        workspace,
        "emit-event",
        "--type",
        "reset",
        "--data",
        json.dumps(
            {
                "scope": "workspace",
                "actor": "tester",
                "reason": "second-pass code deepening regression",
            }
        ),
        timeout=60,
        check=False,
    )
    assert reset.returncode == 0, reset.stderr

    _run_chain(
        workspace,
        steps=CHAIN_TO_PRE_CODE,
        label_prefix="test28_deepening_second_pre_code",
    )
    second_code_pass = _complete_current_call_with_agent(
        workspace,
        expected_edge="derive_code_surface",
        label_prefix="test28_deepening_second_code",
        agent_script="fake_deepening_fp_agent.py",
        target_relative_path=SECOND_PASS_TARGET,
    )

    after_second_pass = target_path.read_text(encoding="utf-8")
    assert second_code_pass["assessed"]["status"] == "ok"
    assert after_second_pass != before_first_pass
    assert "???" not in after_second_pass
    assert '"deepened-pass-2"' in after_second_pass

    refresh_installed_analysis(
        workspace,
        label="test28_deepening_post_second_code_refresh_analysis",
    )
    next_start = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "start",
            label="test28_deepening_post_second_code",
        ).stdout
    )
    assert next_start["edge"] == "derive_test_design_surface"
