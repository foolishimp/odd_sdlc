# Validates: REQ-F-ODDSDLC-027
# Validates: REQ-F-ODDSDLC-032
# Derived-From: /Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/B-005-adopt-abg-yielded-handoff-in-odd-sdlc.md
# Derived-From: /Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-004-restore-homeostatic-gap-triage-and-intent-renewal.md
# Derived-From: /Users/jim/src/apps/odd_sdlc/specification/scenarios/07-canonical-sandbox-repeatability.md
from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any

import pytest

from odd_sdlc.release.install import install as install_release
from sandbox_runtime import (
    continue_installed_result,
    read_events,
    run_constructor_for_start,
    run_installed_odd_sdlc,
    run_installed_python,
    run_installed_substrate,
)
from test_odd_sdlc_installation import (
    _append_runtime_contract_overrides,
    _seed_data_mapper_template_workspace,
    _write_fake_transport_contract,
)

EXPECTED_YIELD_EDGE = "derive_code_surface"


def _approve_pending_start_gate(
    workspace: Path,
    *,
    payload: dict[str, Any],
    run_archive,
    label: str,
) -> None:
    proposal = payload.get("constitutional_proposal")
    if not isinstance(proposal, dict) or proposal.get("state") != "pending_fh":
        raise AssertionError(f"expected pending_fh constitutional proposal, got {proposal!r}")
    approval_code = (
        "import json\n"
        "from odd_sdlc.homeostatic_loop import apply_constitutional_proposal\n"
        f"payload = apply_constitutional_proposal('.', edge={payload['edge']!r}, "
        f"proposal_id={proposal['proposal_id']!r}, actor='yield_usecase_fixture')\n"
        "print(json.dumps(payload))\n"
    )
    approval = run_installed_python(
        workspace,
        approval_code,
        archive=run_archive,
        label=label,
        check=False,
    )
    run_archive.capture_text(f"{label}.stdout.txt", approval.stdout)
    run_archive.capture_text(f"{label}.stderr.txt", approval.stderr)
    assert approval.returncode == 0, approval.stderr
    try:
        applied_payload = json.loads(approval.stdout)
    except json.JSONDecodeError as error:
        raise AssertionError(f"expected JSON proposal-application payload, got {approval.stdout!r}") from error
    assert applied_payload["status"] == "applied"
    republished = run_installed_odd_sdlc(
        workspace,
        "gaps",
        "--scope",
        "workspace",
        archive=run_archive,
        label=f"{label}.republish_gaps",
    )
    run_archive.capture_text(f"{label}.republish_gaps.stdout.txt", republished.stdout)
    run_archive.capture_text(f"{label}.republish_gaps.stderr.txt", republished.stderr)


def _approve_head_constitutional_gate(workspace: Path, *, run_archive, label: str) -> None:
    gap_payload = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            archive=run_archive,
            label=f"{label}.gaps",
        ).stdout
    )
    run_archive.capture_json(f"{label}.gaps.json", gap_payload)
    head = gap_payload["dossiers"][0]
    proposal = head.get("constitutional_proposal")
    if not isinstance(proposal, dict) or proposal.get("state") != "pending_fh":
        return
    _approve_pending_start_gate(
        workspace,
        payload={
            "edge": head["edge"],
            "constitutional_proposal": proposal,
        },
        run_archive=run_archive,
        label=f"{label}.approve_constitutional_gate",
    )


def _prepare_installed_yield_workspace(
    run_archive,
    *,
    workspace: Path | None = None,
    artifact_prefix: str = "install",
) -> Path:
    workspace = workspace or run_archive.workspace
    _seed_data_mapper_template_workspace(workspace)
    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    run_archive.capture_json(f"{artifact_prefix}.payload.json", payload)
    assert payload["status"] == "installed"
    transport_contract = _write_fake_transport_contract(workspace)
    _append_runtime_contract_overrides(workspace, transport_contract=transport_contract)
    run_archive.copy_file(
        transport_contract,
        dest_name=f"{artifact_prefix}.transport_contract.test_transport_contract.json",
    )
    run_installed_odd_sdlc(
        workspace,
        "refresh-analysis",
        archive=run_archive,
        label=f"{artifact_prefix}.refresh_analysis",
    )
    _approve_head_constitutional_gate(
        workspace,
        run_archive=run_archive,
        label=f"{artifact_prefix}.constitutional_gate",
    )
    return workspace


def _run_start_auto_expect_yield(
    workspace: Path,
    *,
    run_archive,
    label: str,
) -> dict[str, Any]:
    start_args = (
        "start",
        "--scope",
        "workspace",
        "--target",
        "next",
        "--until",
        "converged",
        "--fh-mode",
        "human-proxy",
    )
    start_result = run_installed_odd_sdlc(
        workspace,
        *start_args,
        archive=run_archive,
        label=label,
        timeout=180,
        check=False,
    )
    run_archive.capture_text(f"{label}.stdout.txt", start_result.stdout)
    run_archive.capture_text(f"{label}.stderr.txt", start_result.stderr)
    if start_result.returncode == 3:
        payload = json.loads(start_result.stdout)
        _approve_pending_start_gate(
            workspace,
            payload=payload,
            run_archive=run_archive,
            label=f"{label}.approve_pending_gate",
        )
        start_result = run_installed_odd_sdlc(
            workspace,
            *start_args,
            archive=run_archive,
            label=f"{label}.retry",
            timeout=180,
            check=False,
        )
        run_archive.capture_text(f"{label}.retry.stdout.txt", start_result.stdout)
        run_archive.capture_text(f"{label}.retry.stderr.txt", start_result.stderr)
    assert start_result.returncode == 6
    payload = json.loads(start_result.stdout)
    run_archive.capture_json(f"{label}.payload.json", payload)
    assert payload["status"] == "yield"
    assert payload["stopped_by"] == "yield"
    assert payload["handoff_kind"] == "observer_handoff"
    assert payload["handoff_reason"] == "fd_findings"
    assert isinstance(payload.get("run_id"), str) and payload["run_id"]
    assert isinstance(payload.get("call_id"), str) and payload["call_id"]
    return payload


def _observe_runtime(workspace: Path, *, run_archive, label: str) -> dict[str, Any]:
    observed = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "observe",
            archive=run_archive,
            label=label,
            timeout=120,
        ).stdout
    )
    run_archive.capture_json(f"{label}.json", observed)
    return observed


def _manual_start(workspace: Path, *, run_archive, label: str) -> dict[str, Any]:
    start_args = (
        "start",
        "--scope",
        "workspace",
        "--target",
        "next",
        "--until",
        "first_traversal",
    )
    start_result = run_installed_odd_sdlc(
        workspace,
        *start_args,
        archive=run_archive,
        label=label,
        check=False,
    )
    if start_result.returncode == 3:
        payload = json.loads(start_result.stdout)
        _approve_pending_start_gate(
            workspace,
            payload=payload,
            run_archive=run_archive,
            label=f"{label}.approve_pending_gate",
        )
        start_result = run_installed_odd_sdlc(
            workspace,
            *start_args,
            archive=run_archive,
            label=f"{label}.retry",
        )
    payload = json.loads(start_result.stdout)
    run_archive.capture_json(f"{label}.json", payload)
    return payload


def _advance_to_edge(workspace: Path, *, target_edge: str, run_archive, label_prefix: str) -> dict[str, Any]:
    while True:
        start_payload = _manual_start(
            workspace,
            run_archive=run_archive,
            label=f"{label_prefix}.start.{target_edge}",
        )
        if start_payload["edge"] == target_edge:
            return start_payload
        constructor, result_path = run_constructor_for_start(
            workspace,
            start_payload=start_payload,
            archive=run_archive,
            label=f"{label_prefix}.{start_payload['edge']}.construct",
        )
        run_archive.capture_json(f"{label_prefix}.{start_payload['edge']}.construct.json", constructor)
        assessed = continue_installed_result(
            workspace,
            result_path=result_path,
            archive=run_archive,
            label=f"{label_prefix}.{start_payload['edge']}.continue",
        )
        run_archive.capture_json(f"{label_prefix}.{start_payload['edge']}.assess-result.json", assessed)
        assert assessed["status"] in {"continued", "converged"}
        assert assessed["result_admission"]["status"] == "ok"


def _yielded_run_projection(observed: dict[str, Any], *, run_id: str) -> dict[str, Any]:
    for run in observed["runs"]:
        if (run.get("run_id") or run.get("instance_id")) == run_id:
            return run
    raise AssertionError(f"missing run projection for {run_id!r}")


def _yielded_call_projection(observed: dict[str, Any], *, call_id: str) -> dict[str, Any]:
    for graph_call in observed["graph_calls"]:
        if graph_call["call_id"] == call_id:
            return graph_call
    raise AssertionError(f"missing graph call projection for {call_id!r}")


def _observer_handoff_projection(observed: dict[str, Any], *, run_id: str, call_id: str) -> dict[str, Any]:
    matches = [
        continuation
        for continuation in observed["continuations"]
        if continuation["run_id"] == run_id
        and continuation["call_id"] == call_id
        and continuation["continuation_kind"] == "observer_handoff"
    ]
    if len(matches) != 1:
        raise AssertionError(
            f"expected one observer_handoff continuation for run={run_id!r} call={call_id!r}, got {matches!r}"
        )
    return matches[0]


@pytest.mark.usecase_id("yield_handoff_canned_chain")
def test_data_mapper_yield_chain_surfaces_asset_event_and_result_truth(run_archive) -> None:
    workspace = _prepare_installed_yield_workspace(run_archive)

    initial_gaps = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            archive=run_archive,
            label="yield_chain.initial_gaps",
        ).stdout
    )
    run_archive.capture_json("yield_chain.initial_gaps.json", initial_gaps)
    assert initial_gaps["converged"] is False
    assert initial_gaps["summary"]["gap_count"] == len(initial_gaps["dossiers"])
    assert initial_gaps["summary"]["gap_count"] >= 18

    start_payload = _run_start_auto_expect_yield(
        workspace,
        run_archive=run_archive,
        label="yield_chain.start",
    )

    events = read_events(workspace)
    run_archive.capture_json("yield_chain.events.json", events)
    event_types = [event["event_type"] for event in events]
    assert "worker_turn_started" in event_types
    assert "graph_call_closed" in event_types
    assert "continuation_opened" in event_types
    assert "run_yielded" in event_types
    assert event_types.index("graph_call_closed") < event_types.index("continuation_opened") < event_types.index("run_yielded")
    assert "run_failed" not in event_types
    assert "graph_call_failed" not in event_types
    assert any(
        event["event_type"] == "found"
        and event.get("data", {}).get("kind") == "fd_findings"
        for event in events
    )

    intent_text = (workspace / "specification" / "INTENT.md").read_text(encoding="utf-8")
    product_text = (workspace / "specification" / "PRODUCT.md").read_text(encoding="utf-8")
    assert "Categorical Data Mapping & Computation Engine (CDME)" in intent_text
    assert "Categorical Data Mapping & Computation Engine (CDME)" in product_text

    manifest_dir = workspace / ".ai-workspace" / "fp_manifests"
    result_dir = workspace / ".ai-workspace" / "fp_results"
    assert any(manifest_dir.iterdir())
    assert any(result_dir.iterdir())
    first_manifest = json.loads(sorted(manifest_dir.iterdir())[0].read_text(encoding="utf-8"))
    assert first_manifest["resolved_policy"]["dispatch"]["config"]["timeout"] == 1800
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
    assert graph_call_edges[-1] == start_payload["edge"]
    assert len(yielded_graph_calls) == 1
    assert start_payload["edge"] == EXPECTED_YIELD_EDGE
    assert "prepare_release_surface" not in graph_call_edges


@pytest.mark.usecase_id("yield_handoff_canned_chain")
def test_data_mapper_continue_command_admits_result_refreshes_analysis_and_advances_start(run_archive) -> None:
    workspace = _prepare_installed_yield_workspace(run_archive)

    start_payload = _manual_start(
        workspace,
        run_archive=run_archive,
        label="continue_resume.start_first",
    )
    assert start_payload["status"] == "iterated"
    assert start_payload["edge"] == "derive_intent_surface"
    constructor, result_path = run_constructor_for_start(
        workspace,
        start_payload=start_payload,
        archive=run_archive,
        label="continue_resume.construct_first",
    )
    run_archive.capture_json("continue_resume.construct_first.json", constructor)

    continuation = continue_installed_result(
        workspace,
        result_path=result_path,
        archive=run_archive,
        label="continue_resume.continue_first",
    )
    run_archive.capture_json("continue_resume.continue_first.json", continuation)
    assert continuation["status"] == "continued"
    assert continuation["result_admission"]["status"] == "ok"
    assert continuation["analysis"]["ready"] is True
    assert continuation["gap_snapshot"]["converged"] is False

    next_start = _manual_start(
        workspace,
        run_archive=run_archive,
        label="continue_resume.start_second",
    )
    assert next_start["status"] == "iterated"
    assert next_start["edge"] == "derive_product_surface"


@pytest.mark.usecase_id("yield_handoff_canned_chain")
def test_data_mapper_yield_chain_projects_run_continuation_and_gap_truth(run_archive) -> None:
    workspace = _prepare_installed_yield_workspace(run_archive)
    start_payload = _run_start_auto_expect_yield(
        workspace,
        run_archive=run_archive,
        label="yield_projection.start",
    )

    observed_before = _observe_runtime(
        workspace,
        run_archive=run_archive,
        label="yield_projection.observe_before",
    )
    yielded_run = _yielded_run_projection(observed_before, run_id=start_payload["run_id"])
    yielded_call = _yielded_call_projection(observed_before, call_id=start_payload["call_id"])
    handoff = _observer_handoff_projection(
        observed_before,
        run_id=start_payload["run_id"],
        call_id=start_payload["call_id"],
    )
    assert yielded_run["status"] == "yielded"
    assert yielded_call["status"] == "closed"
    assert handoff["status"] == "open"

    raw_gaps = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            archive=run_archive,
            label="yield_projection.raw_gaps",
        ).stdout
    )
    run_archive.capture_json("yield_projection.raw_gaps.json", raw_gaps)
    assert raw_gaps["converged"] is False
    assert raw_gaps["total_delta"] > 0
    assert raw_gaps["dossiers"]

    domain_gaps = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "gaps",
            "--scope",
            "workspace",
            archive=run_archive,
            label="yield_projection.domain_gaps",
            timeout=120,
        ).stdout
    )
    run_archive.capture_json("yield_projection.domain_gaps.json", domain_gaps)
    assert domain_gaps["converged"] is False
    assert any(
        "observation" in dossier
        and "triage" in dossier
        and "route_binding" in dossier
        and "gap_truth" in dossier
        for dossier in domain_gaps["dossiers"]
    )

    observed_after = _observe_runtime(
        workspace,
        run_archive=run_archive,
        label="yield_projection.observe_after",
    )
    before_run_ids = {run["instance_id"] for run in observed_before["runs"]}
    after_run_ids = {run["instance_id"] for run in observed_after["runs"]}
    assert before_run_ids.issubset(after_run_ids)
    assert (after_run_ids - before_run_ids).issubset(
        {
            run_id
            for run_id in after_run_ids
            if run_id.startswith("gap_snapshot::")
        }
    )
    assert _yielded_run_projection(observed_after, run_id=start_payload["run_id"])["status"] == "yielded"
    assert _observer_handoff_projection(
        observed_after,
        run_id=start_payload["run_id"],
        call_id=start_payload["call_id"],
    )["continuation_id"] == handoff["continuation_id"]


@pytest.mark.usecase_id("yield_handoff_canned_chain")
def test_data_mapper_continue_command_preserves_yielded_handoff_truth(run_archive) -> None:
    workspace = _prepare_installed_yield_workspace(run_archive)
    start_payload = _run_start_auto_expect_yield(
        workspace,
        run_archive=run_archive,
        label="continue_yield.start",
    )
    assert start_payload["edge"] == EXPECTED_YIELD_EDGE

    continuation = continue_installed_result(
        workspace,
        result_path=Path(start_payload["result_path"]),
        archive=run_archive,
        label="continue_yield.continue",
    )
    run_archive.capture_json("continue_yield.continue.json", continuation)
    assert continuation["status"] == "yield"
    assert continuation["result_admission"]["status"] == "yield"
    assert continuation["result_admission"]["handoff_kind"] == "observer_handoff"
    assert continuation["result_admission"]["handoff_reason"] == "fd_findings"
    assert continuation["gap_snapshot"]["converged"] is False
    design_gap = next(
        gap
        for gap in continuation["gap_snapshot"]["dossiers"]
        if gap["edge"] == EXPECTED_YIELD_EDGE
    )
    assert "observation" in design_gap
    assert "triage" in design_gap
    assert "route_binding" in design_gap


@pytest.mark.usecase_id("yield_handoff_canned_chain")
def test_data_mapper_yield_chain_reissues_fresh_handoff_on_a_fresh_workspace(run_archive) -> None:
    first_workspace = _prepare_installed_yield_workspace(
        run_archive,
        artifact_prefix="yield_reissue_first.install",
    )
    first_start = _run_start_auto_expect_yield(
        first_workspace,
        run_archive=run_archive,
        label="yield_reissue.start_first",
    )
    first_observed = _observe_runtime(
        first_workspace,
        run_archive=run_archive,
        label="yield_reissue.observe_first",
    )
    first_handoff = _observer_handoff_projection(
        first_observed,
        run_id=first_start["run_id"],
        call_id=first_start["call_id"],
    )

    second_workspace = run_archive.run_dir / "workspace_second"
    second_workspace.mkdir(parents=True, exist_ok=True)
    _prepare_installed_yield_workspace(
        run_archive,
        workspace=second_workspace,
        artifact_prefix="yield_reissue_second.install",
    )
    second_start = _run_start_auto_expect_yield(
        second_workspace,
        run_archive=run_archive,
        label="yield_reissue.start_second",
    )
    second_observed = _observe_runtime(
        second_workspace,
        run_archive=run_archive,
        label="yield_reissue.observe_second",
    )
    second_handoff = _observer_handoff_projection(
        second_observed,
        run_id=second_start["run_id"],
        call_id=second_start["call_id"],
    )

    assert second_start["edge"] == first_start["edge"] == EXPECTED_YIELD_EDGE
    assert second_start["run_id"] != first_start["run_id"]
    assert second_start["call_id"] != first_start["call_id"]
    assert second_handoff["continuation_id"] != first_handoff["continuation_id"]
    assert second_handoff["status"] == "open"
