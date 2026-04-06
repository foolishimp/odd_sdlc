# Validates: REQ-F-ODDSDLC-003
# Validates: REQ-F-ODDSDLC-004
# Validates: REQ-F-ODDSDLC-006
"""Live Codex qualification lane for the odd_sdlc toy executive."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import pytest


TESTS_DIR = Path(__file__).resolve().parent
ODD_ROOT = TESTS_DIR.parents[4]
GENESIS_PATH = ODD_ROOT / ".genesis"
CODE_PATH = ODD_ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

if str(GENESIS_PATH) not in sys.path:
    sys.path.insert(0, str(GENESIS_PATH))
if str(CODE_PATH) not in sys.path:
    sys.path.insert(0, str(CODE_PATH))
if str(TESTS_DIR) not in sys.path:
    sys.path.insert(0, str(TESTS_DIR))

from genesis.transport import agent_ready, call_agent  # noqa: E402
from odd_sdlc.fd_checks import INTENT_MARKER, product_dependency_surfaces_present  # noqa: E402
from sandbox_runtime import (  # noqa: E402
    install_kernel_sandbox,
    read_events,
    run_installed_genesis,
    run_installed_odd_sdlc,
    seed_canonical_spec_surface,
    seed_odd_sdlc_package,
)


pytestmark = [pytest.mark.live_fp, pytest.mark.timeout(900)]

EDGE_NAME = "derive_intent_surface"
GRAPH_FUNCTION_NAME = "bootstrap_release_self_test"
EVALUATOR_NAME = "intent_surface_semantically_converged"
REPO_ROOT = ODD_ROOT


def _live_enabled() -> bool:
    return (
        os.environ.get("CODEX_LIVE_FP") == "1"
        and agent_ready("codex", work_folder="/private/tmp")
    )


def _prepare_sandbox(workspace: Path, *, run_archive) -> None:
    install_kernel_sandbox(workspace, archive=run_archive)
    seed_odd_sdlc_package(workspace)
    seed_canonical_spec_surface(workspace)
    run_archive.note("sandbox_prepared", workspace=str(workspace), transport_agent="codex")


def _validate_intent_delivery(workspace: Path, *, manifest: dict[str, object]) -> list[str]:
    failures: list[str] = []
    intent_path = workspace / "specification" / "INTENT.md"
    if not intent_path.exists():
        failures.append("INTENT.md was not created or updated")
    else:
        content = intent_path.read_text(encoding="utf-8")
        if not content.startswith("# Intent"):
            failures.append("INTENT.md must retain the '# Intent' heading")
        if INTENT_MARKER not in content:
            failures.append("INTENT.md is missing the required bounded-constructor marker text")
    if product_dependency_surfaces_present(workspace) != 0:
        failures.append("product_dependency_surfaces_present must pass after the intent update")

    result_path = Path(str(manifest["result_path"]))
    if not result_path.exists():
        failures.append("assessment result JSON was not written")
        return failures

    try:
        result_payload = json.loads(result_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        failures.append(f"assessment result JSON is invalid: {exc}")
        return failures

    if result_payload.get("edge") != EDGE_NAME:
        failures.append("assessment result JSON does not target derive_intent_surface")
    if not result_payload.get("actor"):
        failures.append("assessment result JSON must record a non-empty actor")
    assessments = result_payload.get("assessments")
    if not isinstance(assessments, list) or not assessments:
        failures.append("assessment result JSON must contain at least one assessment")
        return failures
    matching = [
        item
        for item in assessments
        if isinstance(item, dict) and item.get("evaluator") == EVALUATOR_NAME
    ]
    if not matching:
        failures.append("assessment result JSON is missing the intent_surface evaluator record")
    elif matching[0].get("result") != "pass":
        failures.append("assessment result JSON must mark the intent_surface evaluator as pass")
    return failures


def _call_codex_with_single_repair(
    *,
    prompt: str,
    manifest: dict[str, object],
    workspace: Path,
    run_archive,
    timeout: int = 420,
) -> tuple[str, list[str]]:
    response = call_agent(
        prompt,
        str(workspace),
        agent="codex",
        timeout=timeout,
        retries=1,
    )
    run_archive.capture_text("raw_response.txt", response)

    failures = _validate_intent_delivery(workspace, manifest=manifest)
    if not failures:
        return response, failures

    repair_prompt = (
        prompt
        + "\n\n[REPAIR REQUIRED]\n"
        + "The workspace artifact and/or assessment JSON still fail deterministic checks.\n"
        + "\n".join(f"- {failure}" for failure in failures)
        + "\nRevise specification/INTENT.md and the assessment JSON at "
        + str(manifest["result_path"])
        + ". Update the files directly; do not answer with commentary only."
    )
    repair_response = call_agent(
        repair_prompt,
        str(workspace),
        agent="codex",
        timeout=timeout,
        retries=1,
    )
    run_archive.capture_text("raw_response_repair.txt", repair_response)
    return repair_response, _validate_intent_delivery(workspace, manifest=manifest)


@pytest.mark.usecase_id("live_codex_first_edge")
@pytest.mark.skipif(not _live_enabled(), reason="set CODEX_LIVE_FP=1 and ensure codex is available")
def test_installed_executive_first_edge_live_codex_qualification(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)

    start_result = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "start",
            archive=run_archive,
            label="odd_sdlc start live codex",
        ).stdout
    )
    manifest_path = Path(start_result["fp_manifest_path"])
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    intent_path = workspace / "specification" / "INTENT.md"
    placeholder_size = intent_path.stat().st_size

    assert start_result["status"] == "iterated"
    assert start_result["blocking_reason"] == "fp_dispatch"
    assert start_result["edge"] == EDGE_NAME
    assert manifest["edge"] == EDGE_NAME
    assert manifest["target_asset"] == "intent_surface"
    assert manifest["graph_function_id"]
    run_archive.update_summary(
        lane="live",
        edge=EDGE_NAME,
        graph_function=GRAPH_FUNCTION_NAME,
        manifest_id=manifest["manifest_id"],
        transport_method="subprocess",
        transport_agent="codex",
        model_id="agent-default:codex",
    )

    response, failures = _call_codex_with_single_repair(
        prompt=str(manifest["prompt"]),
        manifest=manifest,
        workspace=workspace,
        run_archive=run_archive,
    )
    assert response.strip() != ""
    assert intent_path.exists()
    assert intent_path.stat().st_size > placeholder_size
    assert failures == [], failures

    assessed = json.loads(
        run_installed_genesis(
            workspace,
            "assess-result",
            "--result",
            str(manifest["result_path"]),
            archive=run_archive,
            label="genesis assess-result live codex",
        ).stdout
    )
    assert assessed["status"] == "ok"

    next_start = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "start",
            archive=run_archive,
            label="odd_sdlc start post-live-codex",
        ).stdout
    )
    assert next_start["status"] == "iterated"
    assert next_start["edge"] == "derive_product_surface"

    events = read_events(workspace)
    graph_call_events = [event for event in events if event["event_type"] == "graph_call_opened"]
    assert [event["data"]["graph_function"] for event in graph_call_events[:2]] == [
        GRAPH_FUNCTION_NAME,
        GRAPH_FUNCTION_NAME,
    ]
    assert [event["data"]["edge"] for event in graph_call_events[:2]] == [
        EDGE_NAME,
        "derive_product_surface",
    ]
    assessed_events = [event for event in events if event["event_type"] == "assessed"]
    assert assessed_events
    run_archive.update_summary(
        converged_first_edge=True,
        next_edge=next_start["edge"],
        intent_bytes=intent_path.stat().st_size,
    )
