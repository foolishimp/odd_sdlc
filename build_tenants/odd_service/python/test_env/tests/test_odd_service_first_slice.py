# Validates: REQ-F-ODDSVC-001
# Validates: REQ-F-ODDSVC-002
# Validates: REQ-F-ODDSVC-003
# Validates: REQ-F-ODDSVC-004
# Validates: REQ-F-ODDSVC-005
# Validates: REQ-F-ODDSVC-006
from __future__ import annotations

import json
from pathlib import Path

import pytest

import odd_service.service as service_module
from odd_sdlc.release.install import install as install_release
from odd_service.service import approve
from odd_service.service import attach_worker
from odd_service.service import catalog
from odd_service.service import detach_worker
from odd_service.service import gaps
from odd_service.service import observe
from odd_service.service import start
from odd_service.service import status
from odd_service.service import step
from odd_service.service import workers


def _seed_imported_workspace(path: Path) -> None:
    (path / "specification").mkdir(parents=True, exist_ok=True)
    (path / "README.md").write_text("# Imported README\n\nSandbox project.\n", encoding="utf-8")
    (path / "specification" / "INTENT.md").write_text(
        "# Intent\n\nSandbox imported intent.\n",
        encoding="utf-8",
    )
    (path / "specification" / "REQUIREMENTS.md").write_text(
        "# Requirements\n\nSandbox imported requirements.\n",
        encoding="utf-8",
    )


@pytest.fixture
def installed_workspace(tmp_path: Path) -> Path:
    workspace = tmp_path / "odd_service_sandbox"
    _seed_imported_workspace(workspace)
    payload = install_release(
        workspace,
        project_slug="data_mapper",
        platform="spark_scala",
    )
    assert payload["status"] == "installed"
    return workspace


def _run_id(payload: dict[str, object]) -> str:
    for key in ("run_id", "pending_run_id"):
        value = payload.get(key)
        if isinstance(value, str) and value:
            return value
    raise AssertionError(f"expected run id in payload: {payload}")


def test_worker_registry_round_trip(installed_workspace: Path) -> None:
    root = installed_workspace

    empty = workers(root)
    assert empty["workers"] == []
    assert status(root)["worker_count"] == 0

    attached = attach_worker(root, name="builder", agent="claude")
    assert attached["status"] == "ok"
    assert attached["worker"]["name"] == "builder"
    assert attached["worker"]["agent"] == "claude"

    listed = workers(root)
    assert [worker["name"] for worker in listed["workers"]] == ["builder"]
    assert status(root)["worker_count"] == 1

    detached = detach_worker(root, name="builder")
    assert detached["status"] == "ok"
    assert detached["worker"]["name"] == "builder"
    assert workers(root)["workers"] == []


def test_start_creates_service_session_and_preserves_selected_execution_identity(installed_workspace: Path) -> None:
    root = installed_workspace
    attach_worker(root, name="builder", agent="claude")

    started = start(root, worker_name="builder")
    run_id = _run_id(started)
    assert started["fp_manifest_path"]
    assert started["service_session"]["run_id"] == run_id
    assert started["service_worker"]["name"] == "builder"

    manifest = json.loads(Path(started["fp_manifest_path"]).read_text(encoding="utf-8"))
    assert manifest["worker_id"] == "odd_service_router"
    assert manifest["selected_worker_id"] == "builder"
    assert manifest["selected_backend"] == "claude"
    assert manifest["assignment_source"] == "odd_service://workers/builder"
    assert manifest["resolved_runtime_ref"] == "odd_service://workers/builder/claude"

    observed = observe(root, run_id=run_id)
    assert observed["service_session"]["run_id"] == run_id
    assert observed["run"]["run_id"] == run_id
    assert observed["run"]["worker_id"] == "odd_service_router"
    assert observed["run"]["selected_worker_id"] == "builder"
    assert observed["run"]["selected_backend"] == "claude"

    catalog_payload = catalog(root)
    assert [worker["name"] for worker in catalog_payload["workers"]] == ["builder"]
    assert [session["run_id"] for session in catalog_payload["sessions"]] == [run_id]


def test_gaps_and_approval_use_service_session_but_runtime_truth_stays_in_abg(installed_workspace: Path) -> None:
    root = installed_workspace
    attach_worker(root, name="reviewer", agent="claude")
    started = start(root, worker_name="reviewer")
    run_id = _run_id(started)

    gap_payload = gaps(root, run_id=run_id)
    assert gap_payload["run"]["run_id"] == run_id
    assert gap_payload["gaps"]["converged"] is False
    assert gap_payload["service_session"]["worker_name"] == "reviewer"

    approved = approve(root, run_id=run_id, actor="human-proxy")
    assert approved["status"] == "ok"
    assert approved["run"]["run_id"] == run_id

    observed = observe(root, run_id=run_id)
    assert any(event["event_type"] == "approved" for event in observed["recent_events"])
    review_log = root / ".ai-workspace" / "reviews" / "human_proxy.log"
    assert review_log.exists()
    assert "approved" in review_log.read_text(encoding="utf-8")


def test_ephemeral_agent_session_rehydrates_execution_identity_for_gaps_and_step(
    installed_workspace: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    root = installed_workspace
    seen: dict[str, dict[str, object] | None] = {}

    def _fake_start(workspace: Path, *, worker_record=None):  # type: ignore[no-untyped-def]
        seen["start"] = worker_record.to_dict() if worker_record is not None else None
        return {
            "status": "pending",
            "pending_run_id": "run-ephemeral-claude",
            "blocking_reason": "fp_dispatch",
            "edge": "derive_intent_surface",
        }

    def _fake_gaps(workspace: Path, *, worker_record=None):  # type: ignore[no-untyped-def]
        seen["gaps"] = worker_record.to_dict() if worker_record is not None else None
        return {"converged": False, "gaps": []}

    def _fake_iterate(workspace: Path, *, worker_record=None):  # type: ignore[no-untyped-def]
        seen["step"] = worker_record.to_dict() if worker_record is not None else None
        return {
            "status": "pending",
            "pending_run_id": "run-ephemeral-claude",
            "blocking_reason": "fp_dispatch",
            "edge": "derive_intent_surface",
        }

    monkeypatch.setattr(service_module, "runtime_start", _fake_start)
    monkeypatch.setattr(service_module, "runtime_gaps", _fake_gaps)
    monkeypatch.setattr(service_module, "runtime_iterate", _fake_iterate)

    started = start(root, agent="claude")
    run_id = _run_id(started)
    gap_payload = gaps(root, run_id=run_id)
    step_payload = step(root, run_id=run_id)

    assert seen["start"] == {
        "name": "ephemeral-claude",
        "agent": "claude",
        "transport": "local",
        "authority_ref": "runtime://odd_service",
        "metadata": {"ephemeral": True},
    }
    assert seen["gaps"] == {
        "name": "ephemeral-claude",
        "agent": "claude",
        "transport": "local",
        "authority_ref": "runtime://odd_service",
        "metadata": {"ephemeral": True},
    }
    assert seen["step"] == seen["gaps"]
    assert gap_payload["service_session"]["worker_name"] == "ephemeral-claude"
    assert gap_payload["service_session"]["agent"] == "claude"
    assert step_payload["service_session"]["worker_name"] == "ephemeral-claude"
    assert step_payload["service_session"]["agent"] == "claude"
