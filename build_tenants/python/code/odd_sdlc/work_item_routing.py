# Implements: REQ-F-ODDSDLC-035
# Implements: REQ-F-ODDSDLC-037
"""Triaged work-item asset publication and route-contract helpers for odd_sdlc."""
from __future__ import annotations

from dataclasses import asdict, dataclass
import hashlib
from pathlib import Path
from typing import Any, Literal, Mapping

import yaml

from .asset_types import ASSET_TYPES
from .domain_model import Asset, AssetCheckpoint, AssetProvenance, relative_file_uri
from .public_start_contract import WorkItemRouteContractPayload


WORK_ITEM_TARGET_HANDLE_PREFIX = "ticket/"
WORK_ITEM_ROUTE_KIND: Literal["odd_sdlc.work_item_reentry"] = "odd_sdlc.work_item_reentry"
WORK_ITEM_ROUTE_BINDING_SOURCE: Literal[
    "odd_sdlc.work_item_route_contract"
] = "odd_sdlc.work_item_route_contract"
WORK_ITEM_ROUTE_OPERATOR_TARGET: Literal[
    "bootstrap_release_self_test"
] = "bootstrap_release_self_test"
TRIAGED_WORK_ITEM_DIRS = (
    Path(".ai-workspace/tickets/active"),
    Path(".ai-workspace/tickets/backlog"),
)
STARTABLE_WORK_ITEM_STATUSES = {"active"}

_REENTRY_ROUTE_BY_POINT: dict[str, tuple[str, str]] = {
    "goals": ("derive_goal_surface", "goal_surface"),
    "goal_surface": ("derive_goal_surface", "goal_surface"),
    "intent": ("derive_intent_surface", "intent_surface"),
    "intent_surface": ("derive_intent_surface", "intent_surface"),
    "product_definition": ("derive_product_surface", "product_surface"),
    "product": ("derive_product_surface", "product_surface"),
    "product_surface": ("derive_product_surface", "product_surface"),
    "requirements": ("derive_requirement_surface", "requirement_surface"),
    "requirement_surface": ("derive_requirement_surface", "requirement_surface"),
    "design": ("derive_design_surface", "design_surface"),
    "design_surface": ("derive_design_surface", "design_surface"),
}


@dataclass(frozen=True)
class WorkItemRouteContract:
    route_kind: Literal["odd_sdlc.work_item_reentry"]
    binding_source: Literal["odd_sdlc.work_item_route_contract"]
    ticket_id: str
    change_class: str
    re_entry_point: str
    reentry_vector: str
    reentry_target_asset: str
    scope_binding: Literal["workspace"]
    operator_target_handle: Literal["bootstrap_release_self_test"]

    def to_dict(self) -> WorkItemRouteContractPayload:
        payload = asdict(self)
        return {
            "route_kind": str(payload["route_kind"]),
            "binding_source": str(payload["binding_source"]),
            "ticket_id": str(payload["ticket_id"]),
            "change_class": str(payload["change_class"]),
            "re_entry_point": str(payload["re_entry_point"]),
            "reentry_vector": str(payload["reentry_vector"]),
            "reentry_target_asset": str(payload["reentry_target_asset"]),
            "scope_binding": str(payload["scope_binding"]),
            "operator_target_handle": str(payload["operator_target_handle"]),
        }


def is_work_item_handle(handle: str) -> bool:
    return handle.startswith(WORK_ITEM_TARGET_HANDLE_PREFIX)


def _parse_ticket_frontmatter(ticket_path: Path) -> dict[str, Any]:
    lines = ticket_path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return {}
    frontmatter_lines: list[str] = []
    for line in lines[1:]:
        if line.strip() == "---":
            break
        frontmatter_lines.append(line)
    try:
        payload = yaml.safe_load("\n".join(frontmatter_lines)) or {}
    except yaml.YAMLError:
        return {}
    return payload if isinstance(payload, dict) else {}


def _ticket_body_text(ticket_path: Path) -> str:
    text = ticket_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return text
    for index, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            return "\n".join(lines[index + 1 :]).strip()
    return text


def _ticket_sections(ticket_path: Path) -> dict[str, str]:
    body = _ticket_body_text(ticket_path)
    sections: dict[str, str] = {}
    current_heading: str | None = None
    buffer: list[str] = []
    for line in body.splitlines():
        if line.startswith("## "):
            if current_heading is not None:
                sections[current_heading] = "\n".join(buffer).strip()
            current_heading = line[3:].strip()
            buffer = []
            continue
        if current_heading is not None:
            buffer.append(line)
    if current_heading is not None:
        sections[current_heading] = "\n".join(buffer).strip()
    return sections


def load_work_item_ticket_surface(
    workspace_root: Path,
    *,
    ticket_relative_path: str,
) -> dict[str, Any] | None:
    ticket_path = workspace_root / ticket_relative_path
    if not ticket_path.exists():
        return None
    metadata = _parse_ticket_frontmatter(ticket_path)
    sections = _ticket_sections(ticket_path)
    body = _ticket_body_text(ticket_path)
    return {
        "relative_path": ticket_relative_path,
        "metadata": metadata,
        "sections": sections,
        "body": body,
    }


def _checkpoint_for_path(path: Path) -> AssetCheckpoint:
    if not path.exists():
        return AssetCheckpoint(exists=False, path_kind="missing", content_digest=None, bytes=None)
    payload = path.read_bytes()
    return AssetCheckpoint(
        exists=True,
        path_kind="file",
        content_digest=hashlib.sha256(payload).hexdigest(),
        bytes=path.stat().st_size,
    )


def _work_item_handle(ticket_id: str) -> str:
    return f"{WORK_ITEM_TARGET_HANDLE_PREFIX}{ticket_id}"


def _normalized_route_contract(
    metadata: Mapping[str, Any],
    *,
    ticket_id: str,
) -> WorkItemRouteContract | None:
    change_class = (metadata.get("change_class") or "").strip()
    re_entry_point = (metadata.get("re_entry_point") or "").strip()
    route = _REENTRY_ROUTE_BY_POINT.get(re_entry_point)
    if not change_class or not route:
        return None
    reentry_vector, reentry_target_asset = route
    return WorkItemRouteContract(
        route_kind=WORK_ITEM_ROUTE_KIND,
        binding_source=WORK_ITEM_ROUTE_BINDING_SOURCE,
        ticket_id=ticket_id,
        change_class=change_class,
        re_entry_point=re_entry_point,
        reentry_vector=reentry_vector,
        reentry_target_asset=reentry_target_asset,
        scope_binding="workspace",
        operator_target_handle=WORK_ITEM_ROUTE_OPERATOR_TARGET,
    )


def work_item_route_contract_from_ticket_metadata(
    metadata: Mapping[str, Any],
    *,
    ticket_id: str,
) -> WorkItemRouteContract | None:
    return _normalized_route_contract(metadata, ticket_id=ticket_id)


def work_item_route_contract_from_payload(payload: Mapping[str, Any]) -> WorkItemRouteContract | None:
    if str(payload.get("route_kind") or "") != WORK_ITEM_ROUTE_KIND:
        return None
    if str(payload.get("binding_source") or "") != WORK_ITEM_ROUTE_BINDING_SOURCE:
        return None
    ticket_id = str(payload.get("ticket_id") or "").strip()
    change_class = str(payload.get("change_class") or "").strip()
    re_entry_point = str(payload.get("re_entry_point") or "").strip()
    reentry_vector = str(payload.get("reentry_vector") or "").strip()
    reentry_target_asset = str(payload.get("reentry_target_asset") or "").strip()
    scope_binding = str(payload.get("scope_binding") or "").strip()
    operator_target_handle = str(payload.get("operator_target_handle") or "").strip()
    if not all(
        (
            ticket_id,
            change_class,
            re_entry_point,
            reentry_vector,
            reentry_target_asset,
        )
    ):
        return None
    if scope_binding != "workspace" or operator_target_handle != WORK_ITEM_ROUTE_OPERATOR_TARGET:
        return None
    return WorkItemRouteContract(
        route_kind=WORK_ITEM_ROUTE_KIND,
        binding_source=WORK_ITEM_ROUTE_BINDING_SOURCE,
        ticket_id=ticket_id,
        change_class=change_class,
        re_entry_point=re_entry_point,
        reentry_vector=reentry_vector,
        reentry_target_asset=reentry_target_asset,
        scope_binding="workspace",
        operator_target_handle=WORK_ITEM_ROUTE_OPERATOR_TARGET,
    )


def triaged_work_item_assets(workspace_root: Path) -> tuple[Asset, ...]:
    work_request_type = ASSET_TYPES["work_request_surface"]
    assets: list[Asset] = []
    for relative_dir in TRIAGED_WORK_ITEM_DIRS:
        ticket_root = workspace_root / relative_dir
        if not ticket_root.is_dir():
            continue
        for ticket_path in sorted(ticket_root.glob("*.md")):
            metadata = _parse_ticket_frontmatter(ticket_path)
            ticket_id = (metadata.get("id") or ticket_path.stem).strip()
            if not ticket_id:
                continue
            ticket_status = str(metadata.get("status") or "")
            checkpoint: AssetCheckpoint = _checkpoint_for_path(ticket_path)
            handle = _work_item_handle(ticket_id)
            asset_metadata: dict[str, object] = {
                "relative_path": ticket_path.relative_to(workspace_root).as_posix(),
                "exists": "true" if ticket_path.exists() else "false",
                "path_kind": checkpoint.path_kind,
                "ticket_id": ticket_id,
                "title": str(metadata.get("title") or ""),
                "ticket_category": str(metadata.get("ticket_category") or "ordinary"),
                "ticket_status": ticket_status,
                "change_class": str(metadata.get("change_class") or ""),
                "re_entry_point": str(metadata.get("re_entry_point") or ""),
            }
            assets.append(
                Asset(
                    asset_id=handle,
                    uri=relative_file_uri(ticket_path, workspace_root=workspace_root),
                    declared_type="work_request_surface",
                    metadata=asset_metadata,
                    provenance=AssetProvenance(
                        model="projected_checkpoint",
                        source="ticket_surface_scan",
                        mutable=work_request_type.mutable_default,
                        history_basis="ticket_metadata_and_workspace_state",
                    ),
                    checkpoint=checkpoint,
                )
            )
    return tuple(assets)
