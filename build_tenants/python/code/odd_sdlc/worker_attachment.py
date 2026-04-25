# Implements: REQ-F-ODDSDLC-029
"""F_P worker attachment projection for public odd_sdlc starts."""
from __future__ import annotations

from collections.abc import Mapping
from pathlib import Path
from typing import Literal, NotRequired, TypedDict

from .install_topology import INSTALLED_RUNTIME_CONTRACT_RELATIVE


WorkerAttachmentStatus = Literal["attached", "unattached"]
WorkerAttachmentContract = Literal["transport_contract"]


class WorkerAttachmentProjectionPayload(TypedDict, total=False):
    projection_kind: Literal["odd_sdlc.fp_worker_attachment"]
    schema_version: Literal["v1"]
    status: WorkerAttachmentStatus
    worker_attachment_contract: WorkerAttachmentContract
    runtime_backend: str
    transport_contract: str
    expected_attachment: str
    blocking_reason: Literal["fp_worker_unattached"]
    stop_predicate: Literal["worker_attachment_required"]
    stopped_by: Literal["worker_attachment"]
    unavailable_reason: str


EXPECTED_WORKER_ATTACHMENT = (
    "Add a transport_contract entry to the installed odd_sdlc runtime contract "
    "that points at an admitted agent transport contract."
)


def _string_config_value(config: Mapping[str, object], key: str) -> str:
    value = config.get(key)
    if isinstance(value, str):
        return value.strip()
    return ""


def _transport_contract_ref(value: object) -> str:
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, Mapping) and value:
        return "<inline transport_contract>"
    return ""


def project_fp_worker_attachment(
    runtime_config: Mapping[str, object],
) -> WorkerAttachmentProjectionPayload:
    transport_contract = _transport_contract_ref(runtime_config.get("transport_contract"))
    runtime_backend = _string_config_value(runtime_config, "runtime_backend")
    attached = bool(transport_contract)
    payload: WorkerAttachmentProjectionPayload = {
        "projection_kind": "odd_sdlc.fp_worker_attachment",
        "schema_version": "v1",
        "status": "attached" if attached else "unattached",
        "worker_attachment_contract": "transport_contract",
        "runtime_backend": runtime_backend,
        "transport_contract": transport_contract,
        "expected_attachment": EXPECTED_WORKER_ATTACHMENT,
    }
    if not attached:
        payload.update(
            {
                "blocking_reason": "fp_worker_unattached",
                "stop_predicate": "worker_attachment_required",
                "stopped_by": "worker_attachment",
                "unavailable_reason": "fp_worker_attachment_unavailable",
            }
        )
    return payload


def project_unattached_worker_attachment(
    *,
    reason: str = "fp_worker_attachment_unavailable",
) -> WorkerAttachmentProjectionPayload:
    payload = project_fp_worker_attachment({})
    payload["unavailable_reason"] = reason or "fp_worker_attachment_unavailable"
    return payload


def installed_public_dispatch_requires_worker_attachment(workspace_root: Path | str) -> bool:
    root = Path(workspace_root).resolve()
    return (root / INSTALLED_RUNTIME_CONTRACT_RELATIVE).exists()


def dispatch_result_is_worker_unattached(result: Mapping[str, object]) -> bool:
    if result.get("failure_class") != "policy_config_defect":
        return False
    reason = result.get("reason")
    if not isinstance(reason, str):
        return False
    lowered = reason.lower()
    return (
        "no dispatch agent/backend could be resolved" in lowered
        or "worker attachment" in lowered
    )
