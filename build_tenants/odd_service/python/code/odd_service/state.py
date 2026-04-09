# Implements: REQ-F-ODDSVC-002
# Implements: REQ-F-ODDSVC-006
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .models import SERVICE_ROOT_RELATIVE
from .models import SessionRecord
from .models import WorkerRecord


def service_root(workspace: Path) -> Path:
    root = workspace.resolve() / SERVICE_ROOT_RELATIVE
    root.mkdir(parents=True, exist_ok=True)
    return root


def workers_path(workspace: Path) -> Path:
    return service_root(workspace) / "workers.json"


def sessions_path(workspace: Path) -> Path:
    return service_root(workspace) / "sessions.json"


def _read_json_map(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return dict(raw)


def _write_json_map(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def load_workers(workspace: Path) -> dict[str, WorkerRecord]:
    payload = _read_json_map(workers_path(workspace))
    return {
        name: WorkerRecord.from_dict(record)
        for name, record in payload.items()
        if isinstance(name, str) and isinstance(record, dict)
    }


def save_workers(workspace: Path, workers: dict[str, WorkerRecord]) -> None:
    _write_json_map(
        workers_path(workspace),
        {name: worker.to_dict() for name, worker in sorted(workers.items())},
    )


def load_sessions(workspace: Path) -> dict[str, SessionRecord]:
    payload = _read_json_map(sessions_path(workspace))
    return {
        run_id: SessionRecord.from_dict(record)
        for run_id, record in payload.items()
        if isinstance(run_id, str) and isinstance(record, dict)
    }


def save_sessions(workspace: Path, sessions: dict[str, SessionRecord]) -> None:
    _write_json_map(
        sessions_path(workspace),
        {run_id: session.to_dict() for run_id, session in sorted(sessions.items())},
    )
