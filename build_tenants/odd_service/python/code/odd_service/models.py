# Implements: REQ-F-ODDSVC-002
# Implements: REQ-F-ODDSVC-005
# Implements: REQ-F-ODDSVC-006
from __future__ import annotations

from dataclasses import asdict
from dataclasses import dataclass
from dataclasses import field
from datetime import datetime
from pathlib import Path
from typing import Any


SERVICE_ROOT_RELATIVE = Path(".odd_service") / "service"


def utc_now() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


@dataclass(frozen=True)
class WorkerRecord:
    name: str
    agent: str
    transport: str = "local"
    authority_ref: str = "runtime://odd_service"
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "WorkerRecord":
        return cls(
            name=str(payload["name"]),
            agent=str(payload["agent"]),
            transport=str(payload.get("transport") or "local"),
            authority_ref=str(payload.get("authority_ref") or "runtime://odd_service"),
            metadata=dict(payload.get("metadata") or {}),
        )


@dataclass(frozen=True)
class SessionRecord:
    run_id: str
    workspace_root: str
    created_at: str
    updated_at: str
    worker_name: str | None = None
    agent: str | None = None
    status: str | None = None
    edge: str | None = None
    manifest_id: str | None = None
    fp_manifest_path: str | None = None
    last_command: str | None = None
    last_result: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "SessionRecord":
        return cls(
            run_id=str(payload["run_id"]),
            workspace_root=str(payload["workspace_root"]),
            created_at=str(payload["created_at"]),
            updated_at=str(payload["updated_at"]),
            worker_name=payload.get("worker_name"),
            agent=payload.get("agent"),
            status=payload.get("status"),
            edge=payload.get("edge"),
            manifest_id=payload.get("manifest_id"),
            fp_manifest_path=payload.get("fp_manifest_path"),
            last_command=payload.get("last_command"),
            last_result=dict(payload.get("last_result") or {}),
        )
