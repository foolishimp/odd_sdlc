# Validates: REQ-F-ODDSDLC-003
# Validates: REQ-F-ODDSDLC-004
# Validates: REQ-F-ODDSDLC-006
"""Live Codex qualification lane for the odd_sdlc toy executive."""
from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import os
import sys
from pathlib import Path
from typing import Any

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
from odd_sdlc.fd_checks import (  # noqa: E402
    CONSENSUS_DECISION_MARKER,
    INTENT_MARKER,
    REVIEW_ASSESSMENT_MARKER,
    REVIEWED_DESIGN_MARKER,
    consensus_decision_dependency_surfaces_present,
    product_dependency_surfaces_present,
    reviewed_design_dependency_surfaces_present,
)
from sandbox_runtime import (  # noqa: E402
    run_constructor_for_start,
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
CODE_EDGE_NAME = "derive_code_surface"
CODE_EVALUATOR_NAME = "code_surface_semantically_converged"
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
PRE_CONSENSUS_STEPS = PRE_CODE_STEPS[:7]
CONSENSUS_MODULE_REF = "odd_sdlc.consensus_module:MODULE"
CONSENSUS_GRAPH_FUNCTION_NAME = "review_design_consensus_round"
CONSENSUS_REVIEW_EDGE = "derive_review_assessment_surface"
CONSENSUS_REVIEW_EVALUATOR = "review_assessment_surface_semantically_converged"
CONSENSUS_REVIEW_ASSET = "review_assessment_surface"
CONSENSUS_DECISION_EDGE = "derive_consensus_decision_surface"
CONSENSUS_REVIEWED_EDGE = "derive_reviewed_design_surface"
CONSENSUS_STEPS = (
    CONSENSUS_REVIEW_EDGE,
    CONSENSUS_DECISION_EDGE,
    CONSENSUS_REVIEWED_EDGE,
)
CONSENSUS_REVIEWERS = (
    {
        "id": "reviewer.traceability",
        "focus": (
            "Judge whether the design remains traceable to generated requirements "
            "and feature decomposition surfaces."
        ),
    },
    {
        "id": "reviewer.delivery",
        "focus": (
            "Judge whether the design is concrete enough to support the mirrored "
            "implementation and test branches."
        ),
    },
)
REPO_ROOT = ODD_ROOT
LIVE_CODEX_PROBE_CONFIG = {
    "transport_contract": {
        "codex": {
            "probe_timeout": 10,
            "retry_count": 0,
            "retry_backoff": 0,
        }
    }
}
LIVE_CLAUDE_PROBE_CONFIG = {
    "transport_contract": {
        "claude": {
            "probe_timeout": 15,
        }
    }
}
CONSENSUS_LIVE_AGENT = os.environ.get("ODD_SDLC_CONSENSUS_AGENT", "claude")


def _probe_config_for(agent: str) -> dict[str, object] | None:
    if agent == "codex":
        return LIVE_CODEX_PROBE_CONFIG
    if agent == "claude":
        return LIVE_CLAUDE_PROBE_CONFIG
    return None


def _live_enabled() -> bool:
    return (
        os.environ.get("CODEX_LIVE_FP") == "1"
        and agent_ready("codex", work_folder="/private/tmp", config=LIVE_CODEX_PROBE_CONFIG)
    )


def _consensus_live_enabled() -> bool:
    enabled = (
        os.environ.get("ODD_SDLC_CONSENSUS_LIVE") == "1"
        or (
            CONSENSUS_LIVE_AGENT == "claude"
            and os.environ.get("CLAUDE_LIVE_FP") == "1"
        )
        or (
            CONSENSUS_LIVE_AGENT == "codex"
            and os.environ.get("CODEX_LIVE_FP") == "1"
        )
    )
    if not enabled:
        return False
    probe_config = _probe_config_for(CONSENSUS_LIVE_AGENT)
    if probe_config is None:
        return agent_ready(CONSENSUS_LIVE_AGENT, work_folder="/private/tmp")
    return agent_ready(
        CONSENSUS_LIVE_AGENT,
        work_folder="/private/tmp",
        config=probe_config,
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


def _validate_code_delivery(workspace: Path, *, manifest: dict[str, object]) -> list[str]:
    failures: list[str] = []
    package_root = workspace / "build_tenants" / "odd_method" / "python" / "code" / "odd_generated_impl"
    expected_files = (
        package_root / "__init__.py",
        package_root / "__main__.py",
        package_root / "app.py",
        package_root / "workflow.py",
    )
    for path in expected_files:
        if not path.exists():
            failures.append(f"generated code file missing: {path.relative_to(workspace)}")
    if failures:
        return failures

    app_spec = importlib.util.spec_from_file_location("odd_generated_impl.app", package_root / "app.py")
    if app_spec is None or app_spec.loader is None:
        failures.append("generated app module could not be loaded")
        return failures
    app_module = importlib.util.module_from_spec(app_spec)
    app_spec.loader.exec_module(app_module)
    greeting = app_module.hello_message()
    if greeting != "Hello from odd_method.":
        failures.append("generated hello_message() must return 'Hello from odd_method.'")
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        exit_code = app_module.main()
    if output.getvalue().strip() != "Hello from odd_method.":
        failures.append("generated main() must print 'Hello from odd_method.'")
    if exit_code != 0:
        failures.append("generated main() must return 0")

    workflow_spec = importlib.util.spec_from_file_location("odd_generated_impl.workflow", package_root / "workflow.py")
    if workflow_spec is None or workflow_spec.loader is None:
        failures.append("generated workflow module could not be loaded")
        return failures
    workflow_module = importlib.util.module_from_spec(workflow_spec)
    workflow_spec.loader.exec_module(workflow_module)
    summary = workflow_module.implementation_summary()
    if summary.get("entry_module") != "odd_generated_impl.app":
        failures.append("generated implementation summary must expose odd_generated_impl.app as entry_module")
    if summary.get("entrypoint") != "main":
        failures.append("generated implementation summary must expose main as entrypoint")
    if summary.get("hello_message") != "Hello from odd_method.":
        failures.append("generated implementation summary must expose the hello-world message")

    result_path = Path(str(manifest["result_path"]))
    if not result_path.exists():
        failures.append("assessment result JSON was not written")
        return failures
    try:
        result_payload = json.loads(result_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        failures.append(f"assessment result JSON is invalid: {exc}")
        return failures
    if result_payload.get("edge") != CODE_EDGE_NAME:
        failures.append("assessment result JSON does not target derive_code_surface")
    if not result_payload.get("actor"):
        failures.append("assessment result JSON must record a non-empty actor")
    assessments = result_payload.get("assessments")
    if not isinstance(assessments, list) or not assessments:
        failures.append("assessment result JSON must contain at least one assessment")
        return failures
    matching = [
        item
        for item in assessments
        if isinstance(item, dict) and item.get("evaluator") == CODE_EVALUATOR_NAME
    ]
    if not matching:
        failures.append("assessment result JSON is missing the code_surface evaluator record")
    elif matching[0].get("result") != "pass":
        failures.append("assessment result JSON must mark the code_surface evaluator as pass")
    return failures


def _call_codex_for_code_with_single_repair(
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
    run_archive.capture_text("raw_response.code.txt", response)

    failures = _validate_code_delivery(workspace, manifest=manifest)
    if not failures:
        return response, failures

    repair_prompt = (
        prompt
        + "\n\n[REPAIR REQUIRED]\n"
        + "The generated code package and/or assessment JSON still fail deterministic checks.\n"
        + "\n".join(f"- {failure}" for failure in failures)
        + "\nRevise the generated code files under build_tenants/odd_method/python/code/odd_generated_impl "
        + "and the assessment JSON at "
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
    run_archive.capture_text("raw_response.code_repair.txt", repair_response)
    return repair_response, _validate_code_delivery(workspace, manifest=manifest)


def _load_review_json(response: str) -> dict[str, Any] | None:
    candidates = [response.strip()]
    stripped = response.strip()
    if stripped.startswith("```") and stripped.endswith("```"):
        lines = stripped.splitlines()
        if len(lines) >= 3:
            candidates.append("\n".join(lines[1:-1]).strip())
    if "{" in stripped and "}" in stripped:
        candidates.append(stripped[stripped.find("{") : stripped.rfind("}") + 1].strip())
    seen: set[str] = set()
    for candidate in candidates:
        if not candidate or candidate in seen:
            continue
        seen.add(candidate)
        try:
            loaded = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(loaded, dict):
            return loaded
    return None


def _validate_review_payload(payload: dict[str, Any], *, reviewer_id: str) -> list[str]:
    failures: list[str] = []
    if payload.get("reviewer_id") != reviewer_id:
        failures.append(f"reviewer_id must be {reviewer_id!r}")
    verdict = payload.get("verdict")
    if verdict not in {"pass", "fail"}:
        failures.append("verdict must be 'pass' or 'fail'")
    summary = payload.get("summary")
    if not isinstance(summary, str) or not summary.strip():
        failures.append("summary must be a non-empty string")
    findings = payload.get("findings")
    if not isinstance(findings, list) or not findings or not all(isinstance(item, str) and item.strip() for item in findings):
        failures.append("findings must be a non-empty list of strings")
    proposed_deltas = payload.get("proposed_deltas")
    if not isinstance(proposed_deltas, list) or not proposed_deltas or not all(
        isinstance(item, str) and item.strip() for item in proposed_deltas
    ):
        failures.append("proposed_deltas must be a non-empty list of strings")
    return failures


def _call_consensus_reviewer(
    *,
    reviewer_id: str,
    focus: str,
    manifest: dict[str, object],
    workspace: Path,
    run_archive,
    timeout: int = 420,
) -> dict[str, Any]:
    prompt = (
        "Read the workspace and review the generated odd_sdlc design for the live toy consensus lane.\n"
        f"You are {reviewer_id}. Focus area: {focus}\n"
        "Do not modify any files.\n"
        "Return exactly one JSON object with these keys:\n"
        "- reviewer_id\n"
        "- verdict (pass|fail)\n"
        "- summary\n"
        "- findings (list of short strings)\n"
        "- proposed_deltas (list of short strings)\n"
        "The current toy lane is expected to be minimally sufficient, so only return fail if you find a concrete blocking defect.\n\n"
        "[EDGE PROMPT CONTEXT]\n"
        f"{manifest['prompt']}"
    )
    slug = reviewer_id.replace(".", "_")
    response = call_agent(
        prompt,
        str(workspace),
        agent=CONSENSUS_LIVE_AGENT,
        timeout=timeout,
        retries=1,
    )
    run_archive.capture_text(f"raw_response.{slug}.txt", response)
    payload = _load_review_json(response)
    failures = _validate_review_payload(payload or {}, reviewer_id=reviewer_id) if payload is not None else [
        "response must decode to a JSON object"
    ]
    if not failures:
        return payload  # type: ignore[return-value]

    repair_prompt = (
        prompt
        + "\n\n[REPAIR REQUIRED]\n"
        + "The previous response did not satisfy the strict JSON contract.\n"
        + "\n".join(f"- {failure}" for failure in failures)
        + "\nReturn JSON only.\n"
        + "\n[PREVIOUS RESPONSE]\n"
        + response
    )
    repair_response = call_agent(
        repair_prompt,
        str(workspace),
        agent=CONSENSUS_LIVE_AGENT,
        timeout=timeout,
        retries=1,
    )
    run_archive.capture_text(f"raw_response.{slug}.repair.txt", repair_response)
    repair_payload = _load_review_json(repair_response)
    repair_failures = _validate_review_payload(repair_payload or {}, reviewer_id=reviewer_id) if repair_payload is not None else [
        "response must decode to a JSON object"
    ]
    assert repair_failures == [], repair_failures
    return repair_payload  # type: ignore[return-value]


def _write_consensus_assessment_surface(
    *,
    workspace: Path,
    reviews: list[dict[str, Any]],
) -> Path:
    design_path = workspace / "build_tenants" / "common" / "design" / "30-generated-odd-design.md"
    target_path = workspace / "build_tenants" / "common" / "design" / "35-generated-review-assessments.md"
    design_snapshot = design_path.read_text(encoding="utf-8").strip()
    sections: list[str] = [
        "# Generated Review Assessments",
        "",
        REVIEW_ASSESSMENT_MARKER,
        "",
        "## Reviewers",
    ]
    for review in reviews:
        sections.append(
            f"- {review['reviewer_id']}: {review['summary']}"
        )
    sections.extend(
        (
            "",
            "## Assessment Records",
        )
    )
    for review in reviews:
        sections.extend(
            (
                f"### {review['reviewer_id']}",
                f"- verdict: {review['verdict']}",
                f"- summary: {review['summary']}",
                "",
                "#### Findings",
            )
        )
        sections.extend(f"- {item}" for item in review["findings"])
        sections.extend(("", "#### Proposed Deltas"))
        sections.extend(f"- {item}" for item in review["proposed_deltas"])
        sections.append("")
    sections.extend(
        (
            "## Source Design Snapshot",
            design_snapshot,
            "",
        )
    )
    target_path.parent.mkdir(parents=True, exist_ok=True)
    target_path.write_text("\n".join(sections), encoding="utf-8")
    return target_path


def _write_consensus_result_payload(
    *,
    manifest: dict[str, object],
    reviews: list[dict[str, Any]],
) -> Path:
    result_path = Path(str(manifest["result_path"]))
    result_payload = {
        "edge": CONSENSUS_REVIEW_EDGE,
        "actor": "codex.consensus_harness",
        "assessments": [
            {
                "evaluator": CONSENSUS_REVIEW_EVALUATOR,
                "result": review["verdict"],
                "evidence": (
                    f"{review['reviewer_id']}: {review['summary']} | "
                    + "; ".join(review["proposed_deltas"])
                ),
            }
            for review in reviews
        ],
    }
    result_path.write_text(json.dumps(result_payload, indent=2, sort_keys=True), encoding="utf-8")
    return result_path


def _start_consensus_edge(workspace: Path, *, edge: str, run_archive) -> dict[str, Any]:
    start = json.loads(
        run_installed_genesis(
            workspace,
            "start",
            "--module",
            CONSENSUS_MODULE_REF,
            archive=run_archive,
            label=f"consensus start {edge}",
        ).stdout
    )
    assert start["status"] == "iterated"
    assert start["blocking_reason"] == "fp_dispatch"
    assert start["edge"] == edge
    return start


def _advance_to_edge(workspace: Path, *, run_archive, expected_steps: tuple[str, ...]) -> None:
    for edge in expected_steps:
        start_result = json.loads(
            run_installed_odd_sdlc(
                workspace,
                "start",
                archive=run_archive,
                label=f"odd_sdlc start {edge}",
            ).stdout
        )
        assert start_result["status"] == "iterated"
        assert start_result["edge"] == edge
        constructor_result, result_path = run_constructor_for_start(
            workspace,
            start_payload=start_result,
            archive=run_archive,
            label=f"odd_sdlc construct {edge}",
        )
        assert constructor_result["status"] == "constructed"
        assessed = json.loads(
            run_installed_genesis(
                workspace,
                "assess-result",
                "--result",
                str(result_path),
                archive=run_archive,
                label=f"genesis assess-result {edge}",
            ).stdout
        )
        assert assessed["status"] == "ok"


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


@pytest.mark.usecase_id("live_codex_code_edge")
@pytest.mark.skipif(not _live_enabled(), reason="set CODEX_LIVE_FP=1 and ensure codex is available")
def test_installed_executive_code_edge_live_codex_qualification(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)
    _advance_to_edge(workspace, run_archive=run_archive, expected_steps=PRE_CODE_STEPS)

    start_result = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "start",
            archive=run_archive,
            label="odd_sdlc start live codex code edge",
        ).stdout
    )
    manifest_path = Path(start_result["fp_manifest_path"])
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert start_result["status"] == "iterated"
    assert start_result["blocking_reason"] == "fp_dispatch"
    assert start_result["edge"] == CODE_EDGE_NAME
    assert manifest["edge"] == CODE_EDGE_NAME
    assert manifest["target_asset"] == "code_surface"
    assert manifest["graph_function_id"]
    run_archive.update_summary(
        lane="live",
        edge=CODE_EDGE_NAME,
        graph_function=GRAPH_FUNCTION_NAME,
        manifest_id=manifest["manifest_id"],
        transport_method="subprocess",
        transport_agent="codex",
        model_id="agent-default:codex",
    )

    response, failures = _call_codex_for_code_with_single_repair(
        prompt=str(manifest["prompt"]),
        manifest=manifest,
        workspace=workspace,
        run_archive=run_archive,
    )
    assert response.strip() != ""
    assert failures == [], failures

    assessed = json.loads(
        run_installed_genesis(
            workspace,
            "assess-result",
            "--result",
            str(manifest["result_path"]),
            archive=run_archive,
            label="genesis assess-result live codex code edge",
        ).stdout
    )
    assert assessed["status"] == "ok"

    next_start = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "start",
            archive=run_archive,
            label="odd_sdlc start post-live-codex code edge",
        ).stdout
    )
    assert next_start["status"] == "iterated"
    assert next_start["edge"] == "derive_test_design_surface"

    events = read_events(workspace)
    graph_call_events = [event for event in events if event["event_type"] == "graph_call_opened"]
    assert [event["data"]["edge"] for event in graph_call_events[-2:]] == [
        CODE_EDGE_NAME,
        "derive_test_design_surface",
    ]
    run_archive.update_summary(
        converged_code_edge=True,
        next_edge=next_start["edge"],
        generated_package="build_tenants/odd_method/python/code/odd_generated_impl",
    )


@pytest.mark.usecase_id("live_codex_two_worker_consensus_round")
@pytest.mark.skipif(
    not _consensus_live_enabled(),
    reason="set CLAUDE_LIVE_FP=1 (or ODD_SDLC_CONSENSUS_LIVE=1) and ensure the configured consensus agent is available",
)
def test_consensus_round_live_codex_two_worker_assessments(run_archive) -> None:
    workspace = run_archive.workspace
    _prepare_sandbox(workspace, run_archive=run_archive)
    _advance_to_edge(workspace, run_archive=run_archive, expected_steps=PRE_CONSENSUS_STEPS)

    start_result = _start_consensus_edge(
        workspace,
        edge=CONSENSUS_REVIEW_EDGE,
        run_archive=run_archive,
    )
    manifest_path = Path(start_result["fp_manifest_path"])
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert manifest["edge"] == CONSENSUS_REVIEW_EDGE
    assert manifest["graph_function_id"]
    assert manifest["target_asset"] == CONSENSUS_REVIEW_ASSET
    run_archive.update_summary(
        lane="live",
        edge=CONSENSUS_REVIEW_EDGE,
        graph_function=CONSENSUS_GRAPH_FUNCTION_NAME,
        manifest_id=manifest["manifest_id"],
        transport_method="subprocess",
        transport_agent=CONSENSUS_LIVE_AGENT,
        worker_ids=[reviewer["id"] for reviewer in CONSENSUS_REVIEWERS],
        model_id=f"agent-default:{CONSENSUS_LIVE_AGENT}",
    )

    reviews = [
        _call_consensus_reviewer(
            reviewer_id=reviewer["id"],
            focus=reviewer["focus"],
            manifest=manifest,
            workspace=workspace,
            run_archive=run_archive,
        )
        for reviewer in CONSENSUS_REVIEWERS
    ]
    assert all(review["verdict"] == "pass" for review in reviews), reviews

    assessment_path = _write_consensus_assessment_surface(workspace=workspace, reviews=reviews)
    result_path = _write_consensus_result_payload(manifest=manifest, reviews=reviews)
    review_content = assessment_path.read_text(encoding="utf-8")
    assert REVIEW_ASSESSMENT_MARKER in review_content
    assert "### reviewer.traceability" in review_content
    assert "### reviewer.delivery" in review_content
    assert consensus_decision_dependency_surfaces_present(workspace) == 0

    assessed = json.loads(
        run_installed_genesis(
            workspace,
            "assess-result",
            "--result",
            str(result_path),
            archive=run_archive,
            label="genesis assess-result live consensus review",
        ).stdout
    )
    assert assessed["status"] == "ok"
    assert len(assessed["assessments"]) == 2

    for edge in (CONSENSUS_DECISION_EDGE, CONSENSUS_REVIEWED_EDGE):
        start = _start_consensus_edge(workspace, edge=edge, run_archive=run_archive)
        constructor, constructor_result_path = run_constructor_for_start(
            workspace,
            start_payload=start,
            archive=run_archive,
            label=f"consensus construct {edge}",
        )
        assert constructor["status"] == "constructed"
        assessed_step = json.loads(
            run_installed_genesis(
                workspace,
                "assess-result",
                "--result",
                str(constructor_result_path),
                archive=run_archive,
                label=f"genesis assess-result {edge}",
            ).stdout
        )
        assert assessed_step["status"] == "ok"

    decision_path = workspace / "build_tenants" / "common" / "design" / "35-generated-consensus-decision.md"
    reviewed_design_path = workspace / "build_tenants" / "common" / "design" / "35-reviewed-odd-design.md"
    assert CONSENSUS_DECISION_MARKER in decision_path.read_text(encoding="utf-8")
    assert REVIEWED_DESIGN_MARKER in reviewed_design_path.read_text(encoding="utf-8")
    assert reviewed_design_dependency_surfaces_present(workspace) == 0

    final_gaps = json.loads(
        run_installed_genesis(
            workspace,
            "gaps",
            "--module",
            CONSENSUS_MODULE_REF,
            archive=run_archive,
            label="consensus gaps live",
        ).stdout
    )
    assert final_gaps["converged"] is True
    assert [entry["edge"] for entry in final_gaps["gaps"]] == list(CONSENSUS_STEPS)
    assert all(entry["delta"] == 0 for entry in final_gaps["gaps"])

    events = read_events(workspace)
    graph_call_events = [
        event
        for event in events
        if event["event_type"] == "graph_call_opened"
        and event["data"]["graph_function"] == CONSENSUS_GRAPH_FUNCTION_NAME
    ]
    assert [event["data"]["edge"] for event in graph_call_events] == list(CONSENSUS_STEPS)
    review_assessed_events = [
        event
        for event in events
        if event["event_type"] == "assessed"
        and event["data"]["edge"] == CONSENSUS_REVIEW_EDGE
    ]
    assert len(review_assessed_events) == 2
    evidences = {event["data"]["evidence"] for event in review_assessed_events}
    assert any("reviewer.traceability" in evidence for evidence in evidences)
    assert any("reviewer.delivery" in evidence for evidence in evidences)
    run_archive.update_summary(
        converged_consensus_round=True,
        reviewed_design=str(reviewed_design_path.relative_to(workspace)),
        assessment_count=len(review_assessed_events),
    )
