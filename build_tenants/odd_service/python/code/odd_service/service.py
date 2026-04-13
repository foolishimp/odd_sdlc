# Implements: REQ-F-ODDSVC-002
# Implements: REQ-F-ODDSVC-003
# Implements: REQ-F-ODDSVC-004
# Implements: REQ-F-ODDSVC-005
# Implements: REQ-F-ODDSVC-006
"""Local odd_service orchestration slice over ABG and odd_sdlc."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from genesis.continuation import project_continuation
from genesis.graph_call import project_graph_call
from genesis.run import project_run

from .models import SessionRecord
from .models import WorkerRecord
from .models import utc_now
from .runtime_adapter import catalog as runtime_catalog
from .runtime_adapter import emit_review_approval
from .runtime_adapter import emit_review_rejection
from .runtime_adapter import gaps as runtime_gaps
from .runtime_adapter import iterate as runtime_iterate
from .runtime_adapter import observe as runtime_observe
from .runtime_adapter import run_auto as runtime_run_auto
from .runtime_adapter import start as runtime_start
from .state import load_sessions
from .state import save_sessions
from .workers import attach_worker as registry_attach_worker
from .workers import detach_worker as registry_detach_worker
from .workers import get_worker
from .workers import list_workers as registry_list_workers


SERVICE_STATUS: dict[str, Any] = {
    "package": "odd_service",
    "status": "incubating",
    "authority": "orchestration_only",
    "runtime_truth": "abg",
    "domain_package": "odd_sdlc",
    "capabilities": (
        "worker_registry",
        "workspace_start",
        "workspace_run_auto",
        "run_observe",
        "run_approve",
        "run_reject",
    ),
}


def _workspace(path: str | Path) -> Path:
    return Path(path).resolve()


def _resolve_worker_record(
    workspace: Path,
    *,
    worker_name: str | None = None,
    agent: str | None = None,
) -> dict[str, Any]:
    record = None
    if worker_name:
        record = get_worker(workspace, name=worker_name)
        if record is None:
            raise ValueError(f"unknown worker {worker_name!r}")
    elif agent:
        record = WorkerRecord(
            name=f"ephemeral-{agent}",
            agent=agent,
            metadata={"ephemeral": True},
        )
    return {
        "worker_name": record.name if record else None,
        "agent": record.agent if record else None,
        "record": record,
    }


def _result_run_id(result: dict[str, Any]) -> str | None:
    for key in ("run_id", "pending_run_id"):
        value = result.get(key)
        if isinstance(value, str) and value:
            return value
    return None


def _session_for_result(
    workspace: Path,
    *,
    result: dict[str, Any],
    command: str,
    worker_name: str | None,
    agent: str | None,
) -> SessionRecord | None:
    run_id = _result_run_id(result)
    if not run_id:
        return None
    now = utc_now()
    sessions = load_sessions(workspace)
    existing = sessions.get(run_id)
    session = SessionRecord(
        run_id=run_id,
        workspace_root=str(workspace),
        created_at=existing.created_at if existing else now,
        updated_at=now,
        worker_name=worker_name or (existing.worker_name if existing else None),
        agent=agent or (existing.agent if existing else None),
        status=result.get("status") or (existing.status if existing else None),
        edge=result.get("edge") or (existing.edge if existing else None),
        manifest_id=result.get("manifest_id") or (existing.manifest_id if existing else None),
        fp_manifest_path=result.get("fp_manifest_path") or (existing.fp_manifest_path if existing else None),
        last_command=command,
        last_result=dict(result),
    )
    sessions[run_id] = session
    save_sessions(workspace, sessions)
    return session


def _require_session(workspace: Path, run_id: str) -> SessionRecord:
    session = load_sessions(workspace).get(run_id)
    if session is None:
        raise ValueError(f"unknown run/session {run_id!r}")
    return session


def _worker_for_session(workspace: Path, session: SessionRecord) -> WorkerRecord | None:
    if session.worker_name:
        worker = get_worker(workspace, name=session.worker_name)
        if worker is not None:
            return worker
    if session.agent:
        return WorkerRecord(
            name=session.worker_name or f"ephemeral-{session.agent}",
            agent=session.agent,
            metadata={"ephemeral": True},
        )
    return None


def _filtered_observation(workspace: Path, run_id: str, *, since: str | None = None) -> dict[str, Any]:
    domain = runtime_observe(workspace)
    from odd_sdlc.app import initialize as odd_initialize
    from odd_sdlc.app import bootstrap as odd_bootstrap

    app = odd_initialize(odd_bootstrap(workspace_root=workspace, build="odd_service"))
    all_events = app.stream.all_events()
    run = project_run(all_events, run_id)

    call_ids: list[str] = []
    continuation_ids: list[str] = []
    seen_calls: set[str] = set()
    seen_continuations: set[str] = set()
    for event in all_events:
        event_run_id = event.get("run_id") or event.get("data", {}).get("run_id")
        if event_run_id != run_id:
            continue
        call_id = event.get("call_id") or event.get("data", {}).get("call_id")
        continuation_id = event.get("continuation_id") or event.get("data", {}).get("continuation_id")
        if isinstance(call_id, str) and call_id and call_id not in seen_calls:
            seen_calls.add(call_id)
            call_ids.append(call_id)
        if isinstance(continuation_id, str) and continuation_id and continuation_id not in seen_continuations:
            seen_continuations.add(continuation_id)
            continuation_ids.append(continuation_id)

    relevant_events = [
        event
        for event in all_events
        if (event.get("run_id") or event.get("data", {}).get("run_id")) == run_id
    ]
    if since:
        seen = False
        sliced: list[dict[str, Any]] = []
        for event in relevant_events:
            if seen:
                sliced.append(event)
            elif event.get("event_id") == since:
                seen = True
        relevant_events = sliced

    return {
        "workspace_root": str(workspace),
        "service_status": SERVICE_STATUS,
        "run": run,
        "graph_calls": [project_graph_call(all_events, call_id) for call_id in call_ids],
        "continuations": [project_continuation(all_events, continuation_id) for continuation_id in continuation_ids],
        "recent_events": [
            {
                "event_id": event.get("event_id"),
                "event_time": event.get("event_time"),
                "event_type": event.get("event_type"),
                "aggregate_type": event.get("aggregate_type"),
                "aggregate_id": event.get("aggregate_id"),
                "run_id": event.get("run_id") or event.get("data", {}).get("run_id"),
                "call_id": event.get("call_id") or event.get("data", {}).get("call_id"),
                "continuation_id": event.get("continuation_id") or event.get("data", {}).get("continuation_id"),
            }
            for event in relevant_events[-50:]
        ],
        "domain": {
            "assets": domain.get("assets", []),
            "bindings": domain.get("bindings", []),
            "functions": domain.get("functions", []),
            "graph_functions": domain.get("graph_functions", []),
            "gaps": domain.get("gaps", {}),
            "jobs": domain.get("jobs", []),
            "query_contract": domain.get("query_contract"),
        },
    }


def status(workspace: str | Path = ".") -> dict[str, Any]:
    root = _workspace(workspace)
    return {
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "worker_count": len(registry_list_workers(root)),
        "session_count": len(load_sessions(root)),
    }


def catalog(workspace: str | Path = ".") -> dict[str, Any]:
    root = _workspace(workspace)
    return {
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "workers": [worker.to_dict() for worker in registry_list_workers(root)],
        "sessions": [session.to_dict() for _, session in sorted(load_sessions(root).items())],
        "domain": runtime_catalog(root),
    }


def attach_worker(
    workspace: str | Path = ".",
    *,
    name: str,
    agent: str,
    transport: str = "local",
    authority_ref: str = "runtime://odd_service",
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    root = _workspace(workspace)
    worker = registry_attach_worker(
        root,
        name=name,
        agent=agent,
        transport=transport,
        authority_ref=authority_ref,
        metadata=metadata,
    )
    return {
        "status": "ok",
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "worker": worker.to_dict(),
    }


def detach_worker(workspace: str | Path = ".", *, name: str) -> dict[str, Any]:
    root = _workspace(workspace)
    worker = registry_detach_worker(root, name=name)
    return {
        "status": "ok" if worker is not None else "not_found",
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "worker": worker.to_dict() if worker is not None else None,
    }


def workers(workspace: str | Path = ".") -> dict[str, Any]:
    root = _workspace(workspace)
    return {
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "workers": [worker.to_dict() for worker in registry_list_workers(root)],
    }


def start(
    workspace: str | Path = ".",
    *,
    worker_name: str | None = None,
    agent: str | None = None,
) -> dict[str, Any]:
    root = _workspace(workspace)
    resolved = _resolve_worker_record(root, worker_name=worker_name, agent=agent)
    result = runtime_start(root, worker_record=resolved["record"])
    session = _session_for_result(
        root,
        result=result,
        command="start",
        worker_name=resolved["worker_name"],
        agent=resolved["agent"],
    )
    return {
        **result,
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "service_worker": resolved["record"].to_dict() if resolved["record"] is not None else None,
        "service_session": session.to_dict() if session is not None else None,
    }


def run(
    workspace: str | Path = ".",
    *,
    worker_name: str | None = None,
    agent: str | None = None,
    human_proxy: bool = False,
) -> dict[str, Any]:
    root = _workspace(workspace)
    resolved = _resolve_worker_record(root, worker_name=worker_name, agent=agent)
    result = runtime_run_auto(
        root,
        worker_record=resolved["record"],
        human_proxy=human_proxy,
    )
    session = _session_for_result(
        root,
        result=result,
        command="run",
        worker_name=resolved["worker_name"],
        agent=resolved["agent"],
    )
    return {
        **result,
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "service_worker": resolved["record"].to_dict() if resolved["record"] is not None else None,
        "service_session": session.to_dict() if session is not None else None,
    }


def step(
    workspace: str | Path = ".",
    *,
    run_id: str,
) -> dict[str, Any]:
    root = _workspace(workspace)
    session = _require_session(root, run_id)
    worker = _worker_for_session(root, session)
    result = runtime_iterate(root, worker_record=worker)
    session = _session_for_result(
        root,
        result=result,
        command="step",
        worker_name=worker.name if worker is not None else None,
        agent=worker.agent if worker is not None else None,
    ) or session
    return {
        **result,
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "service_session": session.to_dict(),
    }


def gaps(
    workspace: str | Path = ".",
    *,
    run_id: str,
) -> dict[str, Any]:
    root = _workspace(workspace)
    session = _require_session(root, run_id)
    worker = _worker_for_session(root, session)
    return {
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "service_session": session.to_dict(),
        "run": _filtered_observation(root, run_id)["run"],
        "gaps": runtime_gaps(root, worker_record=worker),
    }


def observe(
    workspace: str | Path = ".",
    *,
    run_id: str,
    since: str | None = None,
) -> dict[str, Any]:
    root = _workspace(workspace)
    session = _require_session(root, run_id)
    payload = _filtered_observation(root, run_id, since=since)
    payload["service_session"] = session.to_dict()
    return payload


def approve(
    workspace: str | Path = ".",
    *,
    run_id: str,
    edge: str | None = None,
    actor: str = "human",
) -> dict[str, Any]:
    root = _workspace(workspace)
    session = _require_session(root, run_id)
    observation = _filtered_observation(root, run_id)
    run_projection = observation["run"]
    resolved_edge = edge or run_projection.get("edge")
    if not isinstance(resolved_edge, str) or not resolved_edge:
        raise ValueError(f"run {run_id!r} does not expose an edge to approve")
    result = emit_review_approval(root, run_id=run_id, edge=resolved_edge, actor=actor)
    return {
        **result,
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "service_session": session.to_dict(),
    }


def reject(
    workspace: str | Path = ".",
    *,
    run_id: str,
    reason: str,
    edge: str | None = None,
    actor: str = "human",
) -> dict[str, Any]:
    root = _workspace(workspace)
    session = _require_session(root, run_id)
    observation = _filtered_observation(root, run_id)
    run_projection = observation["run"]
    resolved_edge = edge or run_projection.get("edge")
    if not isinstance(resolved_edge, str) or not resolved_edge:
        raise ValueError(f"run {run_id!r} does not expose an edge to reject")
    result = emit_review_rejection(root, run_id=run_id, edge=resolved_edge, actor=actor, reason=reason)
    return {
        **result,
        "workspace_root": str(root),
        "service_status": SERVICE_STATUS,
        "service_session": session.to_dict(),
    }
