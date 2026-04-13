# Implements: REQ-F-ODDSVC-002
# Implements: REQ-F-ODDSVC-003
# Implements: REQ-F-ODDSVC-005
from __future__ import annotations

from pathlib import Path
from typing import Any

from genesis.binding import Worker
from genesis.binding import module_to_executable_jobs
from genesis.dispatch_runtime import auto_dispatch_from_result
from genesis.events import EventContext
from genesis.events import emit
from genesis.identity import RuntimeIdentity
from genesis.run import project_run

from odd_sdlc.app import OddSdlcApp
from odd_sdlc.app import bootstrap as odd_bootstrap
from odd_sdlc.app import catalog as odd_catalog
from odd_sdlc.app import gaps as odd_gaps
from odd_sdlc.app import initialize as odd_initialize
from odd_sdlc.app import iterate as odd_iterate
from odd_sdlc.app import start as odd_start
from odd_sdlc.gtl_module import module as odd_sdlc_module
from odd_sdlc.observer import observe as odd_observe

from .models import WorkerRecord


_ROUTER_WORKER_ID = "odd_service_router"


def _router_worker(module, authority_ref: str) -> Worker:
    return Worker(
        id=_ROUTER_WORKER_ID,
        can_execute=module_to_executable_jobs(module),
        role_ids=tuple(role.id for role in module.roles),
        authority_ref=authority_ref,
    )


def _runtime_identity(record: WorkerRecord) -> RuntimeIdentity:
    return RuntimeIdentity(
        build_id="odd_service",
        worker_id=record.name,
        backend_id=record.agent,
        authority_ref=record.authority_ref,
        assignment_source=f"odd_service://workers/{record.name}",
        resolved_runtime_ref=f"odd_service://workers/{record.name}/{record.agent}",
    )


def create_app(workspace: Path, *, worker_record: WorkerRecord | None = None) -> OddSdlcApp:
    domain_module = odd_sdlc_module(workspace)
    identity = _runtime_identity(worker_record) if worker_record is not None else None
    router = _router_worker(domain_module, worker_record.authority_ref) if worker_record is not None else None
    config = odd_bootstrap(
        workspace_root=workspace,
        build="odd_service",
        runtime_identity=identity,
        domain_module=domain_module,
    )
    return odd_initialize(config, worker=router)


def catalog(workspace: Path, *, worker_record: WorkerRecord | None = None) -> dict[str, Any]:
    return odd_catalog(create_app(workspace, worker_record=worker_record))


def gaps(workspace: Path, *, worker_record: WorkerRecord | None = None) -> dict[str, Any]:
    return odd_gaps(create_app(workspace, worker_record=worker_record))


def start(workspace: Path, *, worker_record: WorkerRecord | None = None) -> dict[str, Any]:
    return odd_start(create_app(workspace, worker_record=worker_record), auto=False)


def iterate(workspace: Path, *, worker_record: WorkerRecord | None = None) -> dict[str, Any]:
    return odd_iterate(create_app(workspace, worker_record=worker_record))


def observe(workspace: Path, *, worker_record: WorkerRecord | None = None) -> dict[str, Any]:
    return odd_observe(create_app(workspace, worker_record=worker_record))


def run_auto(
    workspace: Path,
    *,
    worker_record: WorkerRecord | None = None,
    human_proxy: bool = False,
    max_iterations: int = 50,
) -> dict[str, Any]:
    app = create_app(workspace, worker_record=worker_record)
    result: dict[str, Any] = {}

    for _ in range(max_iterations):
        result = odd_start(app, auto=False)
        result["auto"] = True
        if human_proxy:
            result["human_proxy"] = True

        if result.get("status") in {"converged", "nothing_to_do"}:
            return result

        blocking_reason = result.get("blocking_reason")
        if blocking_reason == "fp_dispatch":
            dispatch_result = auto_dispatch_from_result(
                result,
                workspace,
                config=app.config.runtime_config,
            )
            if dispatch_result.get("status") == "ok":
                continue
            if dispatch_result.get("status") == "yield":
                result.update(dispatch_result)
                result["stopped_by"] = dispatch_result.get("stopped_by", "yield")
                return result
            result.update(dispatch_result)
            result["stopped_by"] = dispatch_result.get("stopped_by", "fp_runtime_failure")
            return result

        if blocking_reason == "fh_gate" and human_proxy:
            edge = str(result.get("edge") or result.get("fh_gate", {}).get("edge") or "").strip()
            run_id = _result_run_id(result)
            if not edge or not run_id:
                result["stopped_by"] = "fh_gate"
                result["human_proxy_error"] = "missing edge or run_id for fh_gate approval"
                return result
            emit_review_approval(workspace, run_id=run_id, edge=edge, actor="human-proxy")
            continue

        if result.get("status") == "pending":
            if blocking_reason:
                result["stopped_by"] = blocking_reason
            return result

        if blocking_reason is not None:
            result["stopped_by"] = blocking_reason
            return result

    result["auto"] = True
    if human_proxy:
        result["human_proxy"] = True
    result["stopped_by"] = "max_iterations"
    return result


def _result_run_id(result: dict[str, Any]) -> str | None:
    for key in ("run_id", "pending_run_id"):
        value = result.get(key)
        if isinstance(value, str) and value:
            return value
    return None


def _run_context(workspace: Path, run_id: str) -> tuple[dict[str, Any], EventContext]:
    app = create_app(workspace)
    events = app.stream.all_events()
    run = project_run(events, run_id)
    workflow_version = app.scope().workflow_version
    return run, EventContext(
        workflow_version=workflow_version,
        work_key=run.get("work_key") if isinstance(run.get("work_key"), str) else None,
        run_id=run_id,
    )


def emit_review_approval(
    workspace: Path,
    *,
    run_id: str,
    edge: str,
    actor: str = "human",
) -> dict[str, Any]:
    run, context = _run_context(workspace, run_id)
    payload: dict[str, Any] = {
        "kind": "fh_review",
        "edge": edge,
        "actor": actor,
        "run_id": run_id,
    }
    if actor == "human-proxy":
        reviews_dir = workspace / ".ai-workspace" / "reviews"
        reviews_dir.mkdir(parents=True, exist_ok=True)
        proxy_log = reviews_dir / "human_proxy.log"
        with proxy_log.open("a", encoding="utf-8") as handle:
            handle.write(f"approved {edge}\n")
        payload["proxy_log"] = str(proxy_log)
    event = emit("approved", payload, stream=create_app(workspace).stream, context=context)
    return {
        "status": "ok",
        "event_id": event["event_id"],
        "run": run,
        "edge": edge,
        "actor": actor,
    }


def emit_review_rejection(
    workspace: Path,
    *,
    run_id: str,
    edge: str,
    actor: str = "human",
    reason: str,
) -> dict[str, Any]:
    run, context = _run_context(workspace, run_id)
    payload: dict[str, Any] = {
        "kind": "fh_review",
        "edge": edge,
        "actor": actor,
        "reason": reason,
        "result": "reject",
        "run_id": run_id,
    }
    event = emit("assessed", payload, stream=create_app(workspace).stream, context=context)
    return {
        "status": "ok",
        "event_id": event["event_id"],
        "run": run,
        "edge": edge,
        "actor": actor,
        "reason": reason,
    }
