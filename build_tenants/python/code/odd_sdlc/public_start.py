# Implements: REQ-F-ODDSDLC-003
"""Typed public-start iteration outcome projection for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any, Literal, Mapping

from .gap_dossier import (
    PendingConstitutionalStartGate,
    PublicNextStartBlock,
    PublicNextStartDirective,
    PublicNextStartResolution,
)
from .runtime_effects import publish_workspace_runtime_event


@dataclass(frozen=True)
class PublicStartReturn:
    result: dict[str, Any]
    reason: Literal[
        "first_traversal",
        "terminal",
        "blocked",
        "proof_hold",
        "yielded",
        "failure",
    ]


@dataclass(frozen=True)
class PublicStartRepublishAndContinue:
    republish_stage: Literal["public_start_next_traversal", "public_start_next_dispatch"]
    reason: Literal["traversal_applied", "dispatch_succeeded"]


@dataclass(frozen=True)
class PublicStartDispatchRequired:
    result: dict[str, Any]
    reason: Literal["dispatch_required"] = "dispatch_required"


@dataclass(frozen=True)
class PublicStartHumanGateRequired:
    result: dict[str, Any]
    reason: Literal["human_gate_required"] = "human_gate_required"


@dataclass(frozen=True)
class PublicStartAdmissionDirective:
    raw_target: str
    carrier_basis: Literal["published_head_gap", "published_explicit_target"]
    edge_override: str | None = None
    route_state: str | None = None
    binding_source: str | None = None
    triage_artifact_path: str | None = None
    gap_dossier_register_path: str | None = None
    gap_dossier_context_path: str | None = None


PublicStartIterationOutcome = (
    PublicStartReturn
    | PublicStartRepublishAndContinue
    | PublicStartDispatchRequired
    | PublicStartHumanGateRequired
)
PublicStartAdmissionResolution = (
    PendingConstitutionalStartGate
    | PublicNextStartBlock
    | PublicStartAdmissionDirective
)


def project_public_start_admission_for_next(
    resolution: PendingConstitutionalStartGate | PublicNextStartBlock | PublicNextStartDirective,
) -> PublicStartAdmissionResolution:
    if isinstance(resolution, (PendingConstitutionalStartGate, PublicNextStartBlock)):
        return resolution
    return PublicStartAdmissionDirective(
        raw_target=resolution.raw_target,
        carrier_basis="published_head_gap",
        edge_override=resolution.edge_override,
        route_state=resolution.route_state,
        binding_source=resolution.binding_source,
        triage_artifact_path=resolution.triage_artifact_path,
        gap_dossier_register_path=resolution.gap_dossier_register_path,
        gap_dossier_context_path=resolution.gap_dossier_context_path,
    )


def project_public_start_admission_for_explicit(
    *,
    raw_target: str,
    head_resolution: PublicNextStartResolution,
) -> PublicStartAdmissionResolution:
    if isinstance(head_resolution, PendingConstitutionalStartGate):
        return head_resolution
    if isinstance(head_resolution, PublicNextStartBlock):
        if head_resolution.stop_predicate in {
            "publish_gap_dossier",
            "published_head_gap_required",
            "published_head_route_required",
        }:
            return head_resolution
    return PublicStartAdmissionDirective(
        raw_target=str(raw_target),
        carrier_basis="published_explicit_target",
    )


def _project_public_start_stop_predicate(result: Mapping[str, Any]) -> str | None:
    value = result.get("stop_predicate")
    if isinstance(value, str):
        return value
    blocking_reason = result.get("blocking_reason")
    if blocking_reason == "fp_dispatch":
        return "dispatch_required"
    if blocking_reason == "fh_gate":
        return "human_gate_required"
    if blocking_reason == "fd_gap":
        return "gap_stop"
    if result.get("stopped_by") == "yield":
        return "yielded"
    status = result.get("status")
    if status == "converged":
        return "converged"
    if status in {"iterated", "in_progress", "queued", "needs_selection", "dispatched"}:
        return "traversal_applied"
    if status == "nothing_to_do":
        return "gap_stop"
    return None


def _stopped_by_for_public_start_stop_predicate(stop_predicate: str | None) -> str | None:
    mapping = {
        "dispatch_required": "fp_dispatch",
        "human_gate_required": "fh_gate",
        "gap_stop": "fd_gap",
        "yielded": "yield",
        "proof_hold": "proof_hold",
        "converged": None,
        "traversal_applied": None,
    }
    return mapping.get(stop_predicate)


def project_public_start_gen_start_outcome(
    result: Mapping[str, Any],
    *,
    until: str,
    proof_hold: Mapping[str, Any] | None = None,
) -> PublicStartIterationOutcome:
    payload = dict(result)
    if until == "first_traversal":
        return PublicStartReturn(payload, reason="first_traversal")

    status = payload.get("status")
    if status in {"converged", "nothing_to_do"}:
        return PublicStartReturn(payload, reason="terminal")

    stop_predicate = _project_public_start_stop_predicate(payload)
    if stop_predicate == "traversal_applied":
        return PublicStartRepublishAndContinue(
            republish_stage="public_start_next_traversal",
            reason="traversal_applied",
        )

    if stop_predicate == "human_gate_required" and until == "converged":
        payload["stopped_by"] = "fh_gate"
        return PublicStartHumanGateRequired(payload)

    if until == "blocked":
        stopped_by = _stopped_by_for_public_start_stop_predicate(stop_predicate)
        if stopped_by is not None:
            payload["stopped_by"] = stopped_by
        return PublicStartReturn(payload, reason="blocked")

    if stop_predicate == "dispatch_required":
        if proof_hold and proof_hold.get("held"):
            payload["status"] = "pending"
            payload["proof_hold"] = dict(proof_hold)
            payload["proof_hold_active"] = True
            payload["stop_predicate"] = "proof_hold"
            payload["stopped_by"] = "proof_hold"
            return PublicStartReturn(payload, reason="proof_hold")
        return PublicStartDispatchRequired(payload)

    stopped_by = _stopped_by_for_public_start_stop_predicate(stop_predicate)
    if stopped_by is not None:
        payload["stopped_by"] = stopped_by
    return PublicStartReturn(payload, reason="blocked")


def project_public_start_dispatch_outcome(
    dispatch_result: Mapping[str, Any],
) -> PublicStartIterationOutcome:
    payload = dict(dispatch_result)
    status = payload.get("status")
    if status == "ok":
        return PublicStartRepublishAndContinue(
            republish_stage="public_start_next_dispatch",
            reason="dispatch_succeeded",
        )
    if status == "yield":
        return PublicStartReturn(payload, reason="yielded")
    payload["stopped_by"] = str(payload.get("stopped_by") or "fp_runtime_failure")
    return PublicStartReturn(payload, reason="failure")


def resolve_public_start_result_policy(
    result: Mapping[str, object],
    workspace_root: Path | str,
) -> dict[str, object] | None:
    resolved_policy = result.get("resolved_policy")
    if isinstance(resolved_policy, Mapping):
        return dict(resolved_policy)

    root = Path(workspace_root).resolve()
    manifest_path: Path | None = None
    manifest_path_value = result.get("fp_manifest_path")
    if isinstance(manifest_path_value, str) and manifest_path_value:
        manifest_path = Path(manifest_path_value)
    else:
        manifest_id = result.get("manifest_id")
        if isinstance(manifest_id, str) and manifest_id:
            manifest_path = root / ".ai-workspace" / "fp_manifests" / f"{manifest_id}.json"
    if manifest_path is None or not manifest_path.exists():
        return None
    try:
        raw_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    if not isinstance(raw_manifest, Mapping):
        return None
    manifest_policy = raw_manifest.get("resolved_policy")
    if not isinstance(manifest_policy, Mapping):
        return None
    return dict(manifest_policy)


def emit_public_start_human_proxy_approval(
    workspace_root: Path | str,
    *,
    edge: str,
    workflow_version: str,
    work_key: str | None = None,
    run_id: str | None = None,
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    reviews_dir = root / ".ai-workspace" / "reviews"
    reviews_dir.mkdir(parents=True, exist_ok=True)
    proxy_log = reviews_dir / "human_proxy.log"
    with proxy_log.open("a", encoding="utf-8") as handle:
        handle.write(f"{datetime.now(timezone.utc).isoformat()} approved {edge}\n")

    return publish_workspace_runtime_event(
        workspace_root=root,
        event_type="approved",
        data={
            "kind": "fh_review",
            "edge": edge,
            "actor": "human-proxy",
            "proxy_log": str(proxy_log),
        },
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
    )
