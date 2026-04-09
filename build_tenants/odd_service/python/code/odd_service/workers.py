# Implements: REQ-F-ODDSVC-005
from __future__ import annotations

from pathlib import Path
from typing import Any

from .models import WorkerRecord
from .state import load_workers
from .state import save_workers


def attach_worker(
    workspace: Path,
    *,
    name: str,
    agent: str,
    transport: str = "local",
    authority_ref: str = "runtime://odd_service",
    metadata: dict[str, Any] | None = None,
) -> WorkerRecord:
    workers = load_workers(workspace)
    record = WorkerRecord(
        name=name,
        agent=agent,
        transport=transport,
        authority_ref=authority_ref,
        metadata=dict(metadata or {}),
    )
    workers[name] = record
    save_workers(workspace, workers)
    return record


def detach_worker(workspace: Path, *, name: str) -> WorkerRecord | None:
    workers = load_workers(workspace)
    record = workers.pop(name, None)
    save_workers(workspace, workers)
    return record


def list_workers(workspace: Path) -> list[WorkerRecord]:
    return [workers for _, workers in sorted(load_workers(workspace).items())]


def get_worker(workspace: Path, *, name: str) -> WorkerRecord | None:
    return load_workers(workspace).get(name)
