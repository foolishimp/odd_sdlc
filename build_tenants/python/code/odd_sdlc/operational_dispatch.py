# Implements: REQ-F-ODDSDLC-003
"""Local operational dispatch for declarative odd_sdlc command surfaces."""
from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime, UTC
from pathlib import Path
from typing import Literal, TypedDict

from genesis.result_ingest import ingest_fp_result

from .analysis import refresh_analysis
from .app import OddSdlcApp, active_programs, initialize, publish_gap_surface, start
from .constructor import construct_manifest
from .domain_model import ExecutiveProgramEntryPayload
from .public_start_contract import GapDossierReadModel
from .project_profile import execution_contract_is_declared, load_project_profile
from .public_start_contract import PublicStartResultPayload
from .span_analysis import parse_gap_scope_selector
from .workspace_assets import asset_path


OPERATIONAL_DISPATCH_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-operational-dispatch.json")
OPERATIONAL_DISPATCH_LOG_DIR = Path(".ai-workspace/runtime/operational_dispatch")

_PREPARE_EDGE_TO_RESULT_EDGE = {
    "prepare_build_execution_surface": "derive_build_execution_result_surface",
    "prepare_test_execution_surface": "derive_test_execution_result_surface",
    "prepare_deployment_surface": "derive_deployment_result_surface",
}
_RESULT_EDGE_TO_LANE = {
    "derive_build_execution_result_surface": "build",
    "derive_test_execution_result_surface": "test",
    "derive_deployment_result_surface": "deployment",
}
_RESULT_EDGE_TO_COMMAND_FIELD = {
    "derive_build_execution_result_surface": "build_execution_contract",
    "derive_test_execution_result_surface": "test_execution_contract",
    "derive_deployment_result_surface": "deployment_contract",
}
_PROJECTION_ONLY_EDGES = {
    "derive_deployed_environment_surface",
    "derive_runtime_observation_surface",
    "derive_retrofit_plan_surface",
}
_RELEASE_OPERATIONAL_CYCLE_TARGET = "graph_function:release_operational_cycle"


class OperationalDispatchRecordPayload(TypedDict):
    dispatch_id: str
    lane: str
    edge: str
    contract: str
    binding: str
    status: Literal["succeeded", "failed"]
    exit_code: int
    stdout_path: str
    stderr_path: str
    dispatched_at: str
    completed_at: str
    cwd: str


class OperationalDispatchRegisterPayload(TypedDict):
    register_kind: Literal["odd_sdlc_operational_dispatch_register"]
    lanes: dict[str, OperationalDispatchRecordPayload]
    history: list[OperationalDispatchRecordPayload]


class OperationalDispatchStatePayload(TypedDict, total=False):
    status: str
    edge: str
    next_edge: str
    blocking_reason: str
    stopped_by: str
    unavailable_reason: str


class OperationalDispatchPrepareStepPayload(TypedDict):
    kind: Literal["prepare"]
    edge: str
    result_path: str
    admission_status: str


class OperationalDispatchProjectionStepPayload(TypedDict):
    kind: Literal["projection"]
    edge: str
    result_path: str
    admission_status: str


class OperationalDispatchDispatchStepPayload(TypedDict):
    kind: Literal["dispatch"]
    edge: str
    dispatch: OperationalDispatchRecordPayload
    result_path: str
    admission_status: str


OperationalDispatchStepPayload = (
    OperationalDispatchPrepareStepPayload
    | OperationalDispatchProjectionStepPayload
    | OperationalDispatchDispatchStepPayload
)


class OperationalDispatchNoopResultPayload(TypedDict):
    status: Literal["noop"]
    workspace_root: str
    reason: str
    initial_state: OperationalDispatchStatePayload
    current_state: OperationalDispatchStatePayload
    completed_steps: list[OperationalDispatchStepPayload]
    active_programs: list[ExecutiveProgramEntryPayload]


class OperationalDispatchErrorResultPayload(TypedDict):
    status: Literal["error"]
    workspace_root: str
    reason: str
    initial_state: OperationalDispatchStatePayload
    current_state: OperationalDispatchStatePayload
    completed_steps: list[OperationalDispatchStepPayload]
    active_programs: list[ExecutiveProgramEntryPayload]


class OperationalDispatchOkResultPayload(TypedDict):
    status: Literal["ok"]
    workspace_root: str
    initial_state: OperationalDispatchStatePayload
    final_state: OperationalDispatchStatePayload
    completed_steps: list[OperationalDispatchStepPayload]
    gap_dossier: GapDossierReadModel
    active_programs: list[ExecutiveProgramEntryPayload]


OperationalDispatchResultPayload = (
    OperationalDispatchNoopResultPayload
    | OperationalDispatchErrorResultPayload
    | OperationalDispatchOkResultPayload
)


def _timestamp() -> str:
    return datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")


def _fresh_app(app: OddSdlcApp) -> OddSdlcApp:
    return initialize(app.config, worker=app.worker)


def _register_default() -> OperationalDispatchRegisterPayload:
    return {
        "register_kind": "odd_sdlc_operational_dispatch_register",
        "lanes": {},
        "history": [],
    }


def _dispatch_record_payload(value: object) -> OperationalDispatchRecordPayload | None:
    if not isinstance(value, dict):
        return None
    dispatch_id = value.get("dispatch_id")
    lane = value.get("lane")
    edge = value.get("edge")
    contract = value.get("contract")
    binding = value.get("binding")
    status = value.get("status")
    exit_code = value.get("exit_code")
    stdout_path = value.get("stdout_path")
    stderr_path = value.get("stderr_path")
    dispatched_at = value.get("dispatched_at")
    completed_at = value.get("completed_at")
    cwd = value.get("cwd")
    if not isinstance(dispatch_id, str) or not dispatch_id:
        return None
    if not isinstance(lane, str) or not lane:
        return None
    if not isinstance(edge, str) or not edge:
        return None
    if not isinstance(contract, str) or not contract:
        return None
    if not isinstance(binding, str) or not binding:
        return None
    if not isinstance(stdout_path, str) or not stdout_path:
        return None
    if not isinstance(stderr_path, str) or not stderr_path:
        return None
    if not isinstance(dispatched_at, str) or not dispatched_at:
        return None
    if not isinstance(completed_at, str) or not completed_at:
        return None
    if not isinstance(exit_code, int):
        return None
    if status == "succeeded":
        record_status: Literal["succeeded", "failed"] = "succeeded"
    elif status == "failed":
        record_status = "failed"
    else:
        return None
    return {
        "dispatch_id": dispatch_id,
        "lane": lane,
        "edge": edge,
        "contract": contract,
        "binding": binding,
        "status": record_status,
        "exit_code": exit_code,
        "stdout_path": stdout_path,
        "stderr_path": stderr_path,
        "dispatched_at": dispatched_at,
        "completed_at": completed_at,
        "cwd": cwd if isinstance(cwd, str) and cwd else ".",
    }


def load_operational_dispatch_register(workspace_root: Path) -> OperationalDispatchRegisterPayload:
    path = workspace_root / OPERATIONAL_DISPATCH_REGISTER_PATH
    if not path.exists():
        return _register_default()
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        return _register_default()
    lanes: dict[str, OperationalDispatchRecordPayload] = {}
    raw_lanes = raw.get("lanes")
    if isinstance(raw_lanes, dict):
        for lane_name, lane_value in raw_lanes.items():
            record = _dispatch_record_payload(lane_value)
            if isinstance(lane_name, str) and record is not None:
                lanes[lane_name] = record
    history: list[OperationalDispatchRecordPayload] = []
    raw_history = raw.get("history")
    if isinstance(raw_history, list):
        for entry in raw_history:
            record = _dispatch_record_payload(entry)
            if record is not None:
                history.append(record)
    return {
        "register_kind": "odd_sdlc_operational_dispatch_register",
        "lanes": lanes,
        "history": history,
    }


def latest_operational_dispatch(
    workspace_root: Path,
    lane: str,
) -> OperationalDispatchRecordPayload | None:
    payload = load_operational_dispatch_register(workspace_root)
    return payload["lanes"].get(lane)


def classify_operational_binding(contract: str) -> str:
    lowered = contract.strip().lower()
    if not execution_contract_is_declared(contract):
        return "undeclared"
    if lowered == "spark-submit" or lowered.startswith("spark-submit "):
        return "external_spark_submit"
    if "sbt" in lowered:
        return "local_scala_sbt"
    if "pytest" in lowered:
        return "local_python_pytest"
    if lowered.startswith("python "):
        return "local_python_command"
    return "local_shell_command"


def _requires_external_evidence(binding: str) -> bool:
    return binding.startswith("external_")


def _append_env_option(existing: str, option: str) -> str:
    if option in existing.split():
        return existing
    return f"{existing} {option}".strip()


def _configure_local_scala_sbt_env(workspace_root: Path, env: dict[str, str]) -> None:
    sbt_root = workspace_root / ".ai-workspace" / "runtime" / "sbt"
    boot_dir = sbt_root / "boot"
    global_base = sbt_root / "global"
    ivy_home = sbt_root / "ivy2"
    for path in (boot_dir, global_base, ivy_home):
        path.mkdir(parents=True, exist_ok=True)

    sbt_opts = env.get("SBT_OPTS", "")
    sbt_opts = _append_env_option(sbt_opts, f"-Dsbt.boot.directory={boot_dir}")
    sbt_opts = _append_env_option(sbt_opts, f"-Dsbt.global.base={global_base}")
    sbt_opts = _append_env_option(sbt_opts, f"-Dsbt.ivy.home={ivy_home}")
    env["SBT_OPTS"] = sbt_opts


def _write_dispatch_register(
    workspace_root: Path,
    entry: OperationalDispatchRecordPayload,
) -> None:
    path = workspace_root / OPERATIONAL_DISPATCH_REGISTER_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = load_operational_dispatch_register(workspace_root)
    lanes = payload["lanes"]
    history = payload["history"]
    lane = entry["lane"].strip()
    if lane:
        lanes[lane] = entry
    history.append(entry)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _dispatch_local_contract(
    workspace_root: Path,
    *,
    edge: str,
    lane: str,
    contract: str,
) -> OperationalDispatchRecordPayload:
    binding = classify_operational_binding(contract)
    dispatch_id = f"{lane}_{_timestamp()}"
    log_dir = workspace_root / OPERATIONAL_DISPATCH_LOG_DIR / lane / dispatch_id
    log_dir.mkdir(parents=True, exist_ok=True)
    stdout_path = log_dir / "stdout.log"
    stderr_path = log_dir / "stderr.log"
    cwd = workspace_root
    if binding == "local_scala_sbt":
        code_root = asset_path(workspace_root, "code_surface")
        if code_root.exists() and code_root.is_dir():
            cwd = code_root

    env = os.environ.copy()
    if binding == "local_scala_sbt":
        _configure_local_scala_sbt_env(workspace_root, env)
    completed = subprocess.run(
        ["/bin/zsh", "-lc", contract],
        cwd=cwd,
        capture_output=True,
        text=True,
        env=env,
        check=False,
    )
    stdout_path.write_text(completed.stdout, encoding="utf-8")
    stderr_path.write_text(completed.stderr, encoding="utf-8")

    status: Literal["succeeded", "failed"] = (
        "succeeded" if completed.returncode == 0 else "failed"
    )
    entry: OperationalDispatchRecordPayload = {
        "dispatch_id": dispatch_id,
        "lane": lane,
        "edge": edge,
        "contract": contract,
        "binding": binding,
        "status": status,
        "exit_code": completed.returncode,
        "stdout_path": str(stdout_path.relative_to(workspace_root)),
        "stderr_path": str(stderr_path.relative_to(workspace_root)),
        "dispatched_at": _timestamp(),
        "completed_at": _timestamp(),
        "cwd": str(cwd.relative_to(workspace_root)) if cwd != workspace_root else ".",
    }
    _write_dispatch_register(workspace_root, entry)
    return entry


def _project_start_state(
    value: dict[str, object] | PublicStartResultPayload,
) -> OperationalDispatchStatePayload:
    payload: OperationalDispatchStatePayload = {}
    status = value.get("status")
    if isinstance(status, str) and status:
        payload["status"] = status
    edge = value.get("edge")
    if isinstance(edge, str) and edge:
        payload["edge"] = edge
    next_edge = value.get("next_edge")
    if isinstance(next_edge, str) and next_edge:
        payload["next_edge"] = next_edge
    blocking_reason = value.get("blocking_reason")
    if isinstance(blocking_reason, str) and blocking_reason:
        payload["blocking_reason"] = blocking_reason
    stopped_by = value.get("stopped_by")
    if isinstance(stopped_by, str) and stopped_by:
        payload["stopped_by"] = stopped_by
    unavailable_reason = value.get("unavailable_reason")
    if isinstance(unavailable_reason, str) and unavailable_reason:
        payload["unavailable_reason"] = unavailable_reason
    return payload


def _admission_status(value: object) -> str:
    if isinstance(value, dict):
        status = value.get("status")
        if isinstance(status, str) and status:
            return status
    return ""


def _result_path(value: object) -> str:
    if isinstance(value, dict):
        result_path = value.get("result_path")
        if isinstance(result_path, str) and result_path:
            return result_path
    return ""


def _operational_start(app: OddSdlcApp) -> dict[str, object] | PublicStartResultPayload:
    return start(
        _fresh_app(app),
        scope="workspace",
        target=_RELEASE_OPERATIONAL_CYCLE_TARGET,
        until="first_traversal",
    )


def _manifest_path(
    current: dict[str, object] | PublicStartResultPayload,
    *,
    step_kind: str,
) -> str:
    manifest_path = current.get("fp_manifest_path")
    edge = current.get("edge")
    if isinstance(manifest_path, str) and manifest_path:
        return manifest_path
    raise RuntimeError(f"{step_kind} edge {edge!r} did not produce fp_manifest_path")


def _prepare_step(
    workspace_root: Path,
    current: dict[str, object] | PublicStartResultPayload,
) -> OperationalDispatchPrepareStepPayload:
    edge = str(current.get("edge") or "")
    constructor_result = construct_manifest(
        _manifest_path(current, step_kind="prepare"),
        workspace_root=workspace_root,
    )
    result_admission = ingest_fp_result(constructor_result["result_path"], workspace_root)
    return {
        "kind": "prepare",
        "edge": edge,
        "result_path": _result_path(constructor_result),
        "admission_status": _admission_status(result_admission),
    }


def _projection_step(
    workspace_root: Path,
    current: dict[str, object] | PublicStartResultPayload,
) -> OperationalDispatchProjectionStepPayload:
    edge = str(current.get("edge") or "")
    constructor_result = construct_manifest(
        _manifest_path(current, step_kind="projection"),
        workspace_root=workspace_root,
    )
    result_admission = ingest_fp_result(constructor_result["result_path"], workspace_root)
    return {
        "kind": "projection",
        "edge": edge,
        "result_path": _result_path(constructor_result),
        "admission_status": _admission_status(result_admission),
    }


def _dispatch_step(
    workspace_root: Path,
    current: dict[str, object] | PublicStartResultPayload,
    *,
    dispatch_record: OperationalDispatchRecordPayload,
) -> OperationalDispatchDispatchStepPayload:
    edge = str(current.get("edge") or "")
    constructor_result = construct_manifest(
        _manifest_path(current, step_kind="operational"),
        workspace_root=workspace_root,
    )
    result_admission = ingest_fp_result(constructor_result["result_path"], workspace_root)
    return {
        "kind": "dispatch",
        "edge": edge,
        "dispatch": dispatch_record,
        "result_path": _result_path(constructor_result),
        "admission_status": _admission_status(result_admission),
    }


def dispatch_operational(app: OddSdlcApp) -> OperationalDispatchResultPayload:
    workspace_root = app.config.workspace_root
    refresh_analysis(workspace_root, stage="operational_dispatch")

    initial = _operational_start(app)
    steps: list[OperationalDispatchStepPayload] = []
    dispatch_edge = initial.get("edge")

    if not isinstance(dispatch_edge, str) or not dispatch_edge:
        return {
            "status": "noop",
            "workspace_root": str(workspace_root),
            "reason": "release_operational_cycle has no current admissible edge",
            "initial_state": _project_start_state(initial),
            "current_state": _project_start_state(initial),
            "completed_steps": steps,
            "active_programs": active_programs(_fresh_app(app)),
        }

    if dispatch_edge in _PREPARE_EDGE_TO_RESULT_EDGE:
        steps.append(_prepare_step(workspace_root, initial))
        refresh_analysis(workspace_root, stage="operational_dispatch")
    elif dispatch_edge in _PROJECTION_ONLY_EDGES:
        steps.append(_projection_step(workspace_root, initial))
        refresh_analysis(workspace_root, stage="operational_dispatch")
    else:
        lane = _RESULT_EDGE_TO_LANE.get(dispatch_edge)
        contract_field = _RESULT_EDGE_TO_COMMAND_FIELD.get(dispatch_edge)
        if lane is None or contract_field is None:
            return {
                "status": "noop",
                "workspace_root": str(workspace_root),
                "reason": "current edge is not an operational dispatch edge",
                "initial_state": _project_start_state(initial),
                "current_state": _project_start_state(initial),
                "completed_steps": steps,
                "active_programs": active_programs(_fresh_app(app)),
            }

        profile = load_project_profile(workspace_root)
        contract = str(getattr(profile, contract_field) or "").strip()
        if not contract:
            return {
                "status": "error",
                "workspace_root": str(workspace_root),
                "reason": f"missing declared contract for {lane} operational lane",
                "initial_state": _project_start_state(initial),
                "current_state": _project_start_state(initial),
                "completed_steps": steps,
                "active_programs": active_programs(_fresh_app(app)),
            }

        binding = classify_operational_binding(contract)
        if _requires_external_evidence(binding):
            steps.append(_projection_step(workspace_root, initial))
            refresh_analysis(workspace_root, stage="operational_dispatch")
            final_state = _operational_start(app)
            published_app = _fresh_app(app)
            return {
                "status": "ok",
                "workspace_root": str(workspace_root),
                "initial_state": _project_start_state(initial),
                "final_state": _project_start_state(final_state),
                "completed_steps": steps,
                "gap_dossier": publish_gap_surface(published_app, selector=parse_gap_scope_selector("workspace")),
                "active_programs": active_programs(published_app),
            }

        dispatch_record = _dispatch_local_contract(
            workspace_root,
            edge=dispatch_edge,
            lane=lane,
            contract=contract,
        )
        refresh_analysis(workspace_root, stage="operational_dispatch")
        steps.append(
            _dispatch_step(
                workspace_root,
                initial,
                dispatch_record=dispatch_record,
            )
        )
        refresh_analysis(workspace_root, stage="operational_dispatch")

    final_state = _operational_start(app)
    published_app = _fresh_app(app)
    return {
        "status": "ok",
        "workspace_root": str(workspace_root),
        "initial_state": _project_start_state(initial),
        "final_state": _project_start_state(final_state),
        "completed_steps": steps,
        "gap_dossier": publish_gap_surface(published_app, selector=parse_gap_scope_selector("workspace")),
        "active_programs": active_programs(published_app),
    }
