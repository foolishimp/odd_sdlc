# Implements: REQ-F-ODDSDLC-040
"""Admitted execution-contract surface for odd_sdlc dispatch."""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
from typing import TYPE_CHECKING, Literal, Mapping, cast

from .publication_io import write_text_if_changed
from .public_start_contract import (
    AssetExecutionTargetPayload,
    CarrierGraphFunctionsPayload,
    ExecutionContractSurfacePayload,
    ExecutionSourcePayload,
    ExecutionTargetPayload,
    GraphFunctionExecutionTargetPayload,
    NextExecutionTargetPayload,
    OperatorExecutionSourcePayload,
    TicketWorkItemExecutionSourcePayload,
    WorkItemRouteContractPayload,
)
from .start_targeting import resolve_start_target
from .work_item_routing import (
    STARTABLE_WORK_ITEM_STATUSES,
    WorkItemRouteContract,
    is_work_item_handle,
    load_work_item_ticket_surface,
    work_item_route_contract_from_payload,
)

if TYPE_CHECKING:
    from genesis.events import EventStream
    from genesis.services import Scope, StartTarget
    from gtl.module_model import Module

from .runtime_event_contract import admit_runtime_event_payload


EXECUTION_CONTRACT_KIND = "odd_sdlc.execution_contract_surface"
DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION = "derive_execution_contract_surface"
ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION = "admit_execution_contract_surface"
EXECUTION_CONTRACT_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-execution-contract.json")
EXECUTION_CONTRACT_CONTEXT_PATH = Path(".ai-workspace/runtime/odd_sdlc-execution-contract.md")
_EXECUTION_CONTRACT_CARRIER_SHAPE = "typed_execution_contract_carrier.v1"
_EXECUTION_CONTRACT_SOURCE_KINDS = frozenset({"operator_request", "ticket_work_item"})
_EXECUTION_CONTRACT_TARGET_KINDS = frozenset({"next", "graph_function", "asset"})
_EXECUTION_CONTRACT_STATUSES = frozenset({"drafted", "admitted", "rejected", "superseded"})


class ExecutionContractSurfaceError(ValueError):
    """Raised when a persisted execution-contract carrier is missing or malformed."""


@dataclass(frozen=True)
class BoundExecutionStart:
    scope: Scope
    target: StartTarget
    execution_contract: "AdmittedExecutionContract"


@dataclass(frozen=True)
class AdmittedExecutionContractProjection:
    contract_id: str
    source_kind: Literal["operator_request", "ticket_work_item"]
    target_kind: Literal["next", "graph_function", "asset"]
    payload: ExecutionContractSurfacePayload

    def to_dict(self) -> ExecutionContractSurfacePayload:
        normalized = normalize_execution_contract_surface_payload(self.payload)
        if normalized is None:
            raise ExecutionContractSurfaceError("cannot normalize admitted execution contract payload")
        return normalized


@dataclass(frozen=True)
class NextExecutionTarget:
    public_target: str
    normalized_scope: str
    until: str
    edge_override: str | None = None
    route_state: str | None = None
    binding_source: str | None = None
    kind: Literal["next"] = "next"

    def to_payload(self) -> NextExecutionTargetPayload:
        payload: NextExecutionTargetPayload = {
            "normalized_scope": self.normalized_scope,
            "public_target": self.public_target,
            "until": self.until,
            "kind": self.kind,
        }
        if self.edge_override:
            payload["edge_override"] = self.edge_override
        if self.route_state:
            payload["route_state"] = self.route_state
        if self.binding_source:
            payload["binding_source"] = self.binding_source
        return payload

    def to_dict(self) -> NextExecutionTargetPayload:
        return self.to_payload()

    def to_start_target(self) -> StartTarget:
        from genesis.services import StartTarget

        return StartTarget.next()


@dataclass(frozen=True)
class GraphFunctionExecutionTarget:
    public_target: str
    normalized_scope: str
    until: str
    handle: str
    target_id: str
    graph_function_name: str
    kind: Literal["graph_function"] = "graph_function"

    def to_payload(self) -> GraphFunctionExecutionTargetPayload:
        return {
            "normalized_scope": self.normalized_scope,
            "public_target": self.public_target,
            "until": self.until,
            "kind": self.kind,
            "handle": self.handle,
            "target_id": self.target_id,
            "graph_function_name": self.graph_function_name,
        }

    def to_dict(self) -> GraphFunctionExecutionTargetPayload:
        return self.to_payload()

    def to_start_target(self) -> StartTarget:
        from genesis.services import StartTarget

        return StartTarget.graph_function(
            handle=self.handle,
            target_id=self.target_id,
            graph_function_name=self.graph_function_name,
        )


@dataclass(frozen=True)
class AssetExecutionTarget:
    public_target: str
    normalized_scope: str
    until: str
    handle: str
    target_id: str
    graph_function_name: str
    asset_id: str
    asset_uri: str
    asset_relative_path: str | None
    asset_path_kind: str | None
    asset_exists: bool | None
    binding_source: str
    route_contract: WorkItemRouteContract | None = None
    ticket_id: str | None = None
    ticket_relative_path: str | None = None
    ticket_target_truth: str | None = None
    kind: Literal["asset"] = "asset"

    def to_payload(self) -> AssetExecutionTargetPayload:
        payload: AssetExecutionTargetPayload = {
            "normalized_scope": self.normalized_scope,
            "public_target": self.public_target,
            "until": self.until,
            "kind": self.kind,
            "handle": self.handle,
            "target_id": self.target_id,
            "graph_function_name": self.graph_function_name,
            "asset_id": self.asset_id,
            "asset_uri": self.asset_uri,
            "binding_source": self.binding_source,
        }
        if self.asset_relative_path:
            payload["asset_relative_path"] = self.asset_relative_path
        if self.asset_path_kind:
            payload["asset_path_kind"] = self.asset_path_kind
        if self.asset_exists is not None:
            payload["asset_exists"] = self.asset_exists
        if self.route_contract is not None:
            payload["route_contract"] = _work_item_route_contract_payload(self.route_contract)
        if self.ticket_id:
            payload["ticket_id"] = self.ticket_id
        if self.ticket_relative_path:
            payload["ticket_relative_path"] = self.ticket_relative_path
        if self.ticket_target_truth:
            payload["ticket_target_truth"] = self.ticket_target_truth
        return payload

    def to_dict(self) -> AssetExecutionTargetPayload:
        return self.to_payload()

    def to_start_target(self) -> StartTarget:
        from genesis.services import StartTarget

        return StartTarget.asset(
            handle=self.handle,
            target_id=self.target_id,
            graph_function_name=self.graph_function_name,
            asset_id=self.asset_id,
            asset_uri=self.asset_uri,
            asset_relative_path=self.asset_relative_path,
            asset_path_kind=self.asset_path_kind,
            asset_exists=self.asset_exists,
            binding_source=self.binding_source,
        )


ExecutionTarget = NextExecutionTarget | GraphFunctionExecutionTarget | AssetExecutionTarget


@dataclass(frozen=True)
class OperatorExecutionSource:
    ticket_category: Literal["ordinary"]
    change_class: str
    re_entry_point: str
    affected_boundary: str
    closure_law: str
    evaluation_criteria: tuple[str, ...]
    non_closure_conditions: tuple[str, ...]
    proof_surface: tuple[str, ...]
    source_kind: Literal["operator_request"] = "operator_request"

    def to_dict(self) -> OperatorExecutionSourcePayload:
        return {
            "source_kind": self.source_kind,
            "ticket_category": self.ticket_category,
            "change_class": self.change_class,
            "re_entry_point": self.re_entry_point,
            "affected_boundary": self.affected_boundary,
            "closure_law": self.closure_law,
            "evaluation_criteria": list(self.evaluation_criteria),
            "non_closure_conditions": list(self.non_closure_conditions),
            "proof_surface": list(self.proof_surface),
        }


@dataclass(frozen=True)
class TicketWorkItemExecutionSource:
    ticket_id: str
    ticket_title: str
    ticket_status: str
    ticket_category: str
    change_class: str
    re_entry_point: str
    affected_boundary: str
    superseded_truth: str
    closure_law: str
    evaluation_criteria: tuple[str, ...]
    non_closure_conditions: tuple[str, ...]
    proof_surface: tuple[str, ...]
    route_contract: WorkItemRouteContract
    required_direction: str
    acceptance: str
    migration_declaration: str
    migration_checklist: str
    source_kind: Literal["ticket_work_item"] = "ticket_work_item"

    def to_dict(self) -> TicketWorkItemExecutionSourcePayload:
        payload: TicketWorkItemExecutionSourcePayload = {
            "source_kind": self.source_kind,
            "ticket_id": self.ticket_id,
            "ticket_title": self.ticket_title,
            "ticket_status": self.ticket_status,
            "ticket_category": self.ticket_category,
            "change_class": self.change_class,
            "re_entry_point": self.re_entry_point,
            "affected_boundary": self.affected_boundary,
            "superseded_truth": self.superseded_truth,
            "closure_law": self.closure_law,
            "evaluation_criteria": list(self.evaluation_criteria),
            "non_closure_conditions": list(self.non_closure_conditions),
            "proof_surface": list(self.proof_surface),
            "route_contract": self.route_contract.to_dict(),
            "required_direction": self.required_direction,
            "acceptance": self.acceptance,
            "migration_declaration": self.migration_declaration,
            "migration_checklist": self.migration_checklist,
        }
        return payload


ExecutionSource = OperatorExecutionSource | TicketWorkItemExecutionSource


@dataclass(frozen=True)
class DraftExecutionContract:
    source: ExecutionSource
    target: ExecutionTarget
    contract_id: str
    status: Literal["drafted"] = "drafted"
    carrier_shape: Literal["typed_execution_contract_carrier.v1"] = "typed_execution_contract_carrier.v1"

    def to_dict(self) -> ExecutionContractSurfacePayload:
        payload = _base_contract_payload(self.source, self.target)
        payload.update(
            {
                "contract_kind": EXECUTION_CONTRACT_KIND,
                "carrier_shape": self.carrier_shape,
                "carrier_graph_functions": _carrier_graph_functions(),
                "contract_id": self.contract_id,
                "status": self.status,
            }
        )
        return payload


@dataclass(frozen=True)
class AdmittedExecutionContract:
    source: ExecutionSource
    target: ExecutionTarget
    contract_id: str
    supersedes_contract_id: str | None = None
    register_path: str = EXECUTION_CONTRACT_REGISTER_PATH.as_posix()
    context_path: str = EXECUTION_CONTRACT_CONTEXT_PATH.as_posix()
    status: Literal["admitted"] = "admitted"
    carrier_shape: Literal["typed_execution_contract_carrier.v1"] = "typed_execution_contract_carrier.v1"

    @property
    def route_contract(self) -> WorkItemRouteContract | None:
        return self.target.route_contract if isinstance(self.target, AssetExecutionTarget) else None

    def to_dict(self) -> ExecutionContractSurfacePayload:
        payload = _base_contract_payload(self.source, self.target)
        payload.update(
            {
                "contract_kind": EXECUTION_CONTRACT_KIND,
                "carrier_shape": self.carrier_shape,
                "carrier_graph_functions": _carrier_graph_functions(),
                "contract_id": self.contract_id,
                "status": self.status,
                "register_path": self.register_path,
                "context_path": self.context_path,
            }
        )
        if self.supersedes_contract_id is not None:
            payload["supersedes_contract_id"] = self.supersedes_contract_id
        return payload


@dataclass(frozen=True)
class RejectedExecutionContract:
    draft: DraftExecutionContract
    errors: tuple[str, ...]
    status: Literal["rejected"] = "rejected"

    def to_dict(self) -> ExecutionContractSurfacePayload:
        payload = self.draft.to_dict()
        payload["status"] = self.status
        payload["errors"] = list(self.errors)
        return payload


@dataclass(frozen=True)
class SupersededExecutionContract:
    payload: ExecutionContractSurfacePayload
    superseded_by_contract_id: str
    status: Literal["superseded"] = "superseded"

    def to_dict(self) -> ExecutionContractSurfacePayload:
        payload = normalize_execution_contract_surface_payload(self.payload)
        if payload is None:
            raise ExecutionContractSurfaceError("cannot normalize superseded execution contract payload")
        payload["status"] = self.status
        payload["superseded_by_contract_id"] = self.superseded_by_contract_id
        return payload


ExecutionContractCarrier = (
    DraftExecutionContract | AdmittedExecutionContract | RejectedExecutionContract | SupersededExecutionContract
)


def _load_existing_contract(path: Path) -> ExecutionContractSurfacePayload | None:
    if not path.exists():
        return None
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return normalize_execution_contract_surface_payload(payload)


def _work_item_route_contract_payload(
    route_contract: WorkItemRouteContract,
) -> WorkItemRouteContractPayload:
    return {
        "route_kind": route_contract.route_kind,
        "binding_source": route_contract.binding_source,
        "ticket_id": route_contract.ticket_id,
        "change_class": route_contract.change_class,
        "re_entry_point": route_contract.re_entry_point,
        "reentry_vector": route_contract.reentry_vector,
        "reentry_target_asset": route_contract.reentry_target_asset,
        "scope_binding": route_contract.scope_binding,
        "operator_target_handle": route_contract.operator_target_handle,
    }


def _execution_target_payload(payload: Mapping[str, object]) -> ExecutionTargetPayload:
    kind = str(payload.get("kind") or "")
    if kind == "next":
        projected: NextExecutionTargetPayload = {
            "normalized_scope": str(payload.get("normalized_scope") or ""),
            "public_target": str(payload.get("public_target") or ""),
            "until": str(payload.get("until") or ""),
            "kind": "next",
        }
        edge_override = str(payload.get("edge_override") or "")
        if edge_override:
            projected["edge_override"] = edge_override
        route_state = str(payload.get("route_state") or "")
        if route_state:
            projected["route_state"] = route_state
        binding_source = str(payload.get("binding_source") or "")
        if binding_source:
            projected["binding_source"] = binding_source
        return projected
    if kind == "graph_function":
        graph_payload: GraphFunctionExecutionTargetPayload = {
            "normalized_scope": str(payload.get("normalized_scope") or ""),
            "public_target": str(payload.get("public_target") or ""),
            "until": str(payload.get("until") or ""),
            "kind": "graph_function",
            "handle": str(payload.get("handle") or ""),
            "target_id": str(payload.get("target_id") or ""),
            "graph_function_name": str(payload.get("graph_function_name") or ""),
        }
        return graph_payload
    if kind == "asset":
        asset_payload: AssetExecutionTargetPayload = {
            "normalized_scope": str(payload.get("normalized_scope") or ""),
            "public_target": str(payload.get("public_target") or ""),
            "until": str(payload.get("until") or ""),
            "kind": "asset",
            "handle": str(payload.get("handle") or ""),
            "target_id": str(payload.get("target_id") or ""),
            "graph_function_name": str(payload.get("graph_function_name") or ""),
            "asset_id": str(payload.get("asset_id") or ""),
            "asset_uri": str(payload.get("asset_uri") or ""),
            "binding_source": str(payload.get("binding_source") or ""),
        }
        for key in (
            "asset_relative_path",
            "asset_path_kind",
            "ticket_id",
            "ticket_relative_path",
            "ticket_target_truth",
        ):
            value = payload.get(key)
            if isinstance(value, str) and value:
                if key == "asset_relative_path":
                    asset_payload["asset_relative_path"] = value
                elif key == "asset_path_kind":
                    asset_payload["asset_path_kind"] = value
                elif key == "ticket_id":
                    asset_payload["ticket_id"] = value
                elif key == "ticket_relative_path":
                    asset_payload["ticket_relative_path"] = value
                elif key == "ticket_target_truth":
                    asset_payload["ticket_target_truth"] = value
        asset_exists = payload.get("asset_exists")
        if isinstance(asset_exists, bool):
            asset_payload["asset_exists"] = asset_exists
        route_contract = payload.get("route_contract")
        if isinstance(route_contract, Mapping):
            normalized_route_contract = work_item_route_contract_from_payload(route_contract)
            if normalized_route_contract is not None:
                asset_payload["route_contract"] = _work_item_route_contract_payload(normalized_route_contract)
        return asset_payload
    raise ExecutionContractSurfaceError(f"unsupported execution target kind {kind!r}")


def normalize_execution_contract_surface_payload(
    payload: object,
) -> ExecutionContractSurfacePayload | None:
    if not isinstance(payload, Mapping):
        return None
    projected: ExecutionContractSurfacePayload = {}
    contract_kind = payload.get("contract_kind")
    if isinstance(contract_kind, str) and contract_kind:
        projected["contract_kind"] = contract_kind
    carrier_shape = payload.get("carrier_shape")
    if isinstance(carrier_shape, str) and carrier_shape:
        projected["carrier_shape"] = carrier_shape
    contract_id = payload.get("contract_id")
    if isinstance(contract_id, str) and contract_id:
        projected["contract_id"] = contract_id
    status = payload.get("status")
    if status in _EXECUTION_CONTRACT_STATUSES:
        projected["status"] = cast(Literal["drafted", "admitted", "rejected", "superseded"], status)
    source_kind = payload.get("source_kind")
    if source_kind in _EXECUTION_CONTRACT_SOURCE_KINDS:
        projected["source_kind"] = cast(Literal["operator_request", "ticket_work_item"], source_kind)
    ticket_category = payload.get("ticket_category")
    if isinstance(ticket_category, str) and ticket_category:
        projected["ticket_category"] = ticket_category
    change_class = payload.get("change_class")
    if isinstance(change_class, str) and change_class:
        projected["change_class"] = change_class
    re_entry_point = payload.get("re_entry_point")
    if isinstance(re_entry_point, str) and re_entry_point:
        projected["re_entry_point"] = re_entry_point
    affected_boundary = payload.get("affected_boundary")
    if isinstance(affected_boundary, str) and affected_boundary:
        projected["affected_boundary"] = affected_boundary
    superseded_truth = payload.get("superseded_truth")
    if isinstance(superseded_truth, str) and superseded_truth:
        projected["superseded_truth"] = superseded_truth
    closure_law = payload.get("closure_law")
    if isinstance(closure_law, str) and closure_law:
        projected["closure_law"] = closure_law
    required_direction = payload.get("required_direction")
    if isinstance(required_direction, str) and required_direction:
        projected["required_direction"] = required_direction
    acceptance = payload.get("acceptance")
    if isinstance(acceptance, str) and acceptance:
        projected["acceptance"] = acceptance
    migration_declaration = payload.get("migration_declaration")
    if isinstance(migration_declaration, str) and migration_declaration:
        projected["migration_declaration"] = migration_declaration
    migration_checklist = payload.get("migration_checklist")
    if isinstance(migration_checklist, str) and migration_checklist:
        projected["migration_checklist"] = migration_checklist
    register_path = payload.get("register_path")
    if isinstance(register_path, str) and register_path:
        projected["register_path"] = register_path
    context_path = payload.get("context_path")
    if isinstance(context_path, str) and context_path:
        projected["context_path"] = context_path
    supersedes_contract_id = payload.get("supersedes_contract_id")
    if isinstance(supersedes_contract_id, str) and supersedes_contract_id:
        projected["supersedes_contract_id"] = supersedes_contract_id
    superseded_by_contract_id = payload.get("superseded_by_contract_id")
    if isinstance(superseded_by_contract_id, str) and superseded_by_contract_id:
        projected["superseded_by_contract_id"] = superseded_by_contract_id
    ticket_id = payload.get("ticket_id")
    if isinstance(ticket_id, str) and ticket_id:
        projected["ticket_id"] = ticket_id
    ticket_title = payload.get("ticket_title")
    if isinstance(ticket_title, str) and ticket_title:
        projected["ticket_title"] = ticket_title
    ticket_status = payload.get("ticket_status")
    if isinstance(ticket_status, str) and ticket_status:
        projected["ticket_status"] = ticket_status
    carrier_graph_functions = payload.get("carrier_graph_functions")
    if isinstance(carrier_graph_functions, Mapping):
        derive = carrier_graph_functions.get("derive")
        admit = carrier_graph_functions.get("admit")
        if isinstance(derive, str) and derive and isinstance(admit, str) and admit:
            projected["carrier_graph_functions"] = {"derive": derive, "admit": admit}
    evaluation_criteria = payload.get("evaluation_criteria")
    if isinstance(evaluation_criteria, list):
        projected["evaluation_criteria"] = [str(entry) for entry in evaluation_criteria if str(entry)]
    non_closure_conditions = payload.get("non_closure_conditions")
    if isinstance(non_closure_conditions, list):
        projected["non_closure_conditions"] = [
            str(entry) for entry in non_closure_conditions if str(entry)
        ]
    proof_surface = payload.get("proof_surface")
    if isinstance(proof_surface, list):
        projected["proof_surface"] = [str(entry) for entry in proof_surface if str(entry)]
    errors = payload.get("errors")
    if isinstance(errors, list):
        projected["errors"] = [str(entry) for entry in errors if str(entry)]
    route_contract = payload.get("route_contract")
    if isinstance(route_contract, Mapping):
        normalized_route_contract = work_item_route_contract_from_payload(route_contract)
        if normalized_route_contract is not None:
            projected["route_contract"] = _work_item_route_contract_payload(normalized_route_contract)
    target_truth = payload.get("target_truth")
    if isinstance(target_truth, Mapping):
        projected["target_truth"] = _execution_target_payload(target_truth)
    return projected


def _admitted_execution_contract_projection_from_payload(
    payload: Mapping[str, object],
) -> AdmittedExecutionContractProjection:
    errors: list[str] = []
    contract_id = str(payload.get("contract_id") or "")
    contract_kind = str(payload.get("contract_kind") or "")
    carrier_shape = str(payload.get("carrier_shape") or "")
    status = str(payload.get("status") or "")
    source_kind = str(payload.get("source_kind") or "")
    target_truth = payload.get("target_truth")
    target_kind = (
        str(target_truth.get("kind") or "")
        if isinstance(target_truth, Mapping)
        else ""
    )
    if contract_kind != EXECUTION_CONTRACT_KIND:
        errors.append("contract_kind is not odd_sdlc.execution_contract_surface")
    if carrier_shape != _EXECUTION_CONTRACT_CARRIER_SHAPE:
        errors.append("carrier_shape is not typed_execution_contract_carrier.v1")
    if status != "admitted":
        errors.append("status is not admitted")
    if not contract_id:
        errors.append("contract_id is required")
    if source_kind not in _EXECUTION_CONTRACT_SOURCE_KINDS:
        errors.append("source_kind is not an admitted execution source variant")
    if not isinstance(target_truth, Mapping):
        errors.append("target_truth is required")
    elif target_kind not in _EXECUTION_CONTRACT_TARGET_KINDS:
        errors.append("target_truth.kind is not an admitted execution target variant")
    elif target_kind == "next" and not str(target_truth.get("edge_override") or "").strip():
        errors.append("next target_truth requires edge_override")
    if source_kind == "ticket_work_item":
        route_contract = payload.get("route_contract")
        target_route_contract = (
            target_truth.get("route_contract") if isinstance(target_truth, Mapping) else None
        )
        if not isinstance(route_contract, Mapping):
            errors.append("ticket_work_item execution requires top-level route_contract")
        if not isinstance(target_route_contract, Mapping):
            errors.append("ticket_work_item execution requires target route_contract")
    if errors:
        raise ExecutionContractSurfaceError("; ".join(errors))
    normalized_payload = normalize_execution_contract_surface_payload(payload)
    if normalized_payload is None:
        raise ExecutionContractSurfaceError("cannot normalize admitted execution contract payload")
    return AdmittedExecutionContractProjection(
        contract_id=contract_id,
        source_kind=cast(Literal["operator_request", "ticket_work_item"], source_kind),
        target_kind=cast(Literal["next", "graph_function", "asset"], target_kind),
        payload=normalized_payload,
    )


def load_admitted_execution_contract_projection(
    workspace_root: Path | str,
    *,
    required: bool = False,
) -> AdmittedExecutionContractProjection | None:
    path = Path(workspace_root).resolve() / EXECUTION_CONTRACT_REGISTER_PATH
    if not path.exists():
        if required:
            raise ExecutionContractSurfaceError(
                f"missing admitted execution contract at {EXECUTION_CONTRACT_REGISTER_PATH.as_posix()}"
            )
        return None
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ExecutionContractSurfaceError(
            f"cannot read admitted execution contract at {EXECUTION_CONTRACT_REGISTER_PATH.as_posix()}"
        ) from exc
    if not isinstance(payload, Mapping):
        raise ExecutionContractSurfaceError("execution contract register is not a JSON object")
    return _admitted_execution_contract_projection_from_payload(payload)


def _parse_key_value_lines(text: str) -> dict[str, str]:
    payload: dict[str, str] = {}
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- "):
            stripped = stripped[2:].strip()
        if ":" not in stripped:
            continue
        key, _, value = stripped.partition(":")
        key = key.strip()
        value = value.strip()
        if key and value:
            payload[key] = value
    return payload


def _bullet_lines(text: str) -> list[str]:
    entries: list[str] = []
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- "):
            stripped = stripped[2:].strip()
        if stripped:
            entries.append(stripped)
    return entries


def _unchecked_checklist_items(text: str) -> list[str]:
    items: list[str] = []
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- [ ] "):
            items.append(stripped[len("- [ ] "):].strip())
    return items


def _coerce_string_list(value: object) -> list[str]:
    if isinstance(value, (list, tuple)):
        return [str(entry).strip() for entry in value if str(entry).strip()]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def _base_contract_payload(source: ExecutionSource, target: ExecutionTarget) -> ExecutionContractSurfacePayload:
    source_payload: ExecutionSourcePayload = source.to_dict()
    payload = normalize_execution_contract_surface_payload(source_payload)
    if payload is None:
        raise ExecutionContractSurfaceError("cannot normalize execution contract surface payload")
    payload["target_truth"] = target.to_dict()
    return payload


def _execution_target_from_resolved(
    *,
    raw_target: str,
    normalized_scope: str,
    until: str,
    resolved_target: StartTarget,
    route_contract: WorkItemRouteContract | None,
    next_edge_override: str | None = None,
    next_route_state: str | None = None,
    next_binding_source: str | None = None,
    ticket_id: str | None = None,
    ticket_relative_path: str | None = None,
    ticket_target_truth: str | None = None,
) -> ExecutionTarget:
    kind = str(getattr(resolved_target, "kind", "") or "")
    if kind == "next":
        return NextExecutionTarget(
            public_target=raw_target,
            normalized_scope=normalized_scope,
            until=until,
            edge_override=next_edge_override,
            route_state=next_route_state,
            binding_source=next_binding_source,
        )
    if kind == "graph_function":
        return GraphFunctionExecutionTarget(
            public_target=raw_target,
            normalized_scope=normalized_scope,
            until=until,
            handle=str(getattr(resolved_target, "handle", "") or ""),
            target_id=str(getattr(resolved_target, "target_id", "") or ""),
            graph_function_name=str(getattr(resolved_target, "graph_function_name", "") or ""),
        )
    if kind == "asset":
        return AssetExecutionTarget(
            public_target=raw_target,
            normalized_scope=normalized_scope,
            until=until,
            handle=str(getattr(resolved_target, "handle", "") or ""),
            target_id=str(getattr(resolved_target, "target_id", "") or ""),
            graph_function_name=str(getattr(resolved_target, "graph_function_name", "") or ""),
            asset_id=str(getattr(resolved_target, "asset_id", "") or ""),
            asset_uri=str(getattr(resolved_target, "asset_uri", "") or ""),
            asset_relative_path=getattr(resolved_target, "asset_relative_path", None),
            asset_path_kind=getattr(resolved_target, "asset_path_kind", None),
            asset_exists=getattr(resolved_target, "asset_exists", None),
            binding_source=str(getattr(resolved_target, "binding_source", "") or ""),
            route_contract=route_contract,
            ticket_id=ticket_id,
            ticket_relative_path=ticket_relative_path,
            ticket_target_truth=ticket_target_truth,
        )
    raise ValueError(f"unsupported execution target kind {kind!r}")


def _ordinary_execution_contract(
    *,
    raw_target: str,
    normalized_scope: str,
    until: str,
    resolved_target: StartTarget,
    route_contract: WorkItemRouteContract | None,
    next_edge_override: str | None = None,
    next_route_state: str | None = None,
    next_binding_source: str | None = None,
) -> tuple[OperatorExecutionSource, ExecutionTarget]:
    target = _execution_target_from_resolved(
        raw_target=raw_target,
        normalized_scope=normalized_scope,
        until=until,
        resolved_target=resolved_target,
        route_contract=route_contract,
        next_edge_override=next_edge_override,
        next_route_state=next_route_state,
        next_binding_source=next_binding_source,
    )
    source = OperatorExecutionSource(
        ticket_category="ordinary",
        change_class="realization_refactor",
        re_entry_point="realization_surface",
        affected_boundary="odd_sdlc start dispatch over admitted published start-target truth",
        closure_law=(
            "Dispatch stays open until the admitted published start target advances under "
            "published deterministic failure law, output contract law, and later proof/gap-analysis review."
        ),
        evaluation_criteria=(
            "scope, target, and until are normalized before dispatch",
            "prompt assembly consumes the admitted execution contract rather than ad hoc operator phrasing",
            "later proof and gap analysis can evaluate the same admitted basis",
        ),
        non_closure_conditions=(
            "dispatch begins without an admitted execution contract",
            "prompt or manifest provenance is derived from raw operator phrasing instead of admitted contract truth",
            "proof or gap analysis cannot attribute the turn back to the admitted execution basis",
        ),
        proof_surface=(
            EXECUTION_CONTRACT_REGISTER_PATH.as_posix(),
            EXECUTION_CONTRACT_CONTEXT_PATH.as_posix(),
            ".ai-workspace/runtime/odd_sdlc-gap-dossier-register.json",
        ),
    )
    return source, target


def _is_ticket_work_item_target(resolved_target: StartTarget) -> bool:
    if str(getattr(resolved_target, "kind", "") or "") != "asset":
        return False
    asset_id = str(getattr(resolved_target, "asset_id", "") or "")
    handle = str(getattr(resolved_target, "handle", "") or "")
    return bool(is_work_item_handle(asset_id) or is_work_item_handle(handle))


def _ticket_execution_contract(
    *,
    workspace_root: Path,
    raw_target: str,
    normalized_scope: str,
    until: str,
    resolved_target: StartTarget,
    route_contract: WorkItemRouteContract | None,
) -> tuple[TicketWorkItemExecutionSource, ExecutionTarget]:
    if route_contract is None:
        raise ValueError("ticket work-item execution requires route_contract from asset carrier")
    ticket_relative_path = str(getattr(resolved_target, "asset_relative_path", "") or "")
    ticket_surface = load_work_item_ticket_surface(
        workspace_root,
        ticket_relative_path=ticket_relative_path,
    )
    if ticket_surface is None:
        raise ValueError(f"ticket asset {ticket_relative_path!r} is not present in workspace state")
    metadata = dict(ticket_surface.get("metadata") or {})
    sections = dict(ticket_surface.get("sections") or {})
    migration_declaration = _parse_key_value_lines(str(sections.get("Migration Declaration") or ""))
    acceptance_lines = _bullet_lines(str(sections.get("Acceptance") or ""))
    non_closure_conditions = _unchecked_checklist_items(
        str(sections.get("Migration Checklist") or "")
    )
    target_truth_statement = str(metadata.get("target_truth") or "").strip()
    explicit_evaluation_criteria = _coerce_string_list(metadata.get("evaluation_criteria"))
    explicit_non_closure_conditions = _coerce_string_list(metadata.get("non_closure_conditions"))
    explicit_proof_surface = _coerce_string_list(metadata.get("proof_surface"))
    ticket_status = str(metadata.get("status") or "").strip()
    target = _execution_target_from_resolved(
        raw_target=raw_target,
        normalized_scope=normalized_scope,
        until=until,
        resolved_target=resolved_target,
        route_contract=route_contract,
        ticket_id=str(metadata.get("id") or ""),
        ticket_relative_path=ticket_relative_path,
        ticket_target_truth=target_truth_statement or None,
    )
    proof_surface = []
    for entry in (
        *explicit_proof_surface,
        EXECUTION_CONTRACT_REGISTER_PATH.as_posix(),
        EXECUTION_CONTRACT_CONTEXT_PATH.as_posix(),
        ".ai-workspace/runtime/odd_sdlc-gap-dossier-register.json",
    ):
        if entry and entry not in proof_surface:
            proof_surface.append(entry)
    source = TicketWorkItemExecutionSource(
        ticket_id=str(metadata.get("id") or ""),
        ticket_title=str(metadata.get("title") or ""),
        ticket_status=ticket_status,
        ticket_category=str(metadata.get("ticket_category") or "ordinary"),
        change_class=str(metadata.get("change_class") or ""),
        re_entry_point=str(metadata.get("re_entry_point") or ""),
        affected_boundary=str(
            metadata.get("affected_boundary")
            or "odd_sdlc intake routing, dispatch prompt assembly, and closure/gap-analysis attribution"
        ),
        superseded_truth=str(
            metadata.get("superseded_truth")
            or migration_declaration.get("old_truth_path")
            or ""
        ),
        closure_law=str(
            metadata.get("closure_law")
            or migration_declaration.get("closure_law")
            or metadata.get("change_intent")
            or ""
        ),
        evaluation_criteria=tuple(explicit_evaluation_criteria or acceptance_lines),
        non_closure_conditions=tuple(explicit_non_closure_conditions or non_closure_conditions),
        proof_surface=tuple(proof_surface),
        route_contract=route_contract,
        required_direction=str(sections.get("Required Direction") or "").strip(),
        acceptance=str(sections.get("Acceptance") or "").strip(),
        migration_declaration=str(sections.get("Migration Declaration") or "").strip(),
        migration_checklist=str(sections.get("Migration Checklist") or "").strip(),
    )
    return source, target


def _validate_execution_contract(contract: DraftExecutionContract) -> list[str]:
    errors: list[str] = []
    source = contract.source
    target = contract.target
    if not source.closure_law.strip():
        errors.append("closure_law is required")
    if not source.evaluation_criteria:
        errors.append("evaluation_criteria is required")
    if not source.proof_surface:
        errors.append("proof_surface is required")
    if isinstance(target, NextExecutionTarget) and not target.edge_override:
        errors.append("next execution contract requires admitted edge_override")
    if isinstance(source, TicketWorkItemExecutionSource):
        if source.ticket_status not in STARTABLE_WORK_ITEM_STATUSES:
            errors.append(f"ticket_status {source.ticket_status!r} is not start-authoritative")
        if not source.route_contract.reentry_vector:
            errors.append("ticket_work_item contract requires admitted routed re-entry truth")
        if source.ticket_category == "implementation_migration":
            if not source.migration_declaration.strip():
                errors.append("implementation_migration contract requires Migration Declaration")
            if not source.migration_checklist.strip():
                errors.append("implementation_migration contract requires Migration Checklist")
            if not source.non_closure_conditions:
                errors.append("implementation_migration contract requires explicit non-closure conditions")
    return errors


def _carrier_graph_functions() -> CarrierGraphFunctionsPayload:
    return {
        "derive": DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION,
        "admit": ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION,
    }


def _contract_id(payload: ExecutionContractSurfacePayload) -> str:
    digest = hashlib.sha256(
        json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    return f"execution_contract/{digest[:16]}"


def _draft_execution_contract(source: ExecutionSource, target: ExecutionTarget) -> DraftExecutionContract:
    payload = _base_contract_payload(source, target)
    payload["contract_kind"] = EXECUTION_CONTRACT_KIND
    payload["carrier_shape"] = "typed_execution_contract_carrier.v1"
    payload["carrier_graph_functions"] = _carrier_graph_functions()
    return DraftExecutionContract(
        source=source,
        target=target,
        contract_id=_contract_id(payload),
    )


def execution_contract_payload(
    contract: ExecutionContractCarrier,
) -> ExecutionContractSurfacePayload:
    return contract.to_dict()


def _render_execution_contract_context(
    contract: ExecutionContractCarrier,
) -> str:
    contract_payload = execution_contract_payload(contract)
    lines = [
        "# Admitted Execution Contract",
        "",
        "This dispatch is governed by one admitted execution contract surface.",
        "Use this surface as the current execution basis for prompt, closure, and later gap-analysis review.",
        "",
        "## Identity",
        f"- contract_id: {contract_payload.get('contract_id', '')}",
        f"- contract_kind: {contract_payload.get('contract_kind', '')}",
        f"- carrier_shape: {contract_payload.get('carrier_shape', '')}",
        f"- status: {contract_payload.get('status', '')}",
        f"- source_kind: {contract_payload.get('source_kind', '')}",
        f"- ticket_category: {contract_payload.get('ticket_category', '')}",
        f"- change_class: {contract_payload.get('change_class', '')}",
        f"- re_entry_point: {contract_payload.get('re_entry_point', '')}",
    ]
    carrier_graph_functions = contract_payload.get("carrier_graph_functions")
    if isinstance(carrier_graph_functions, Mapping):
        lines.extend(
            [
                "",
                "## Source Carrier",
                f"- derive: {carrier_graph_functions.get('derive', '')}",
                f"- admit: {carrier_graph_functions.get('admit', '')}",
            ]
        )
    target_truth = contract_payload.get("target_truth")
    if isinstance(target_truth, Mapping):
        lines.extend(
            [
                "",
                "## Target Truth",
                *(f"- {key}: {value}" for key, value in target_truth.items()),
            ]
        )
    closure_law = str(contract_payload.get("closure_law") or "").strip()
    if closure_law:
        lines.extend(["", "## Closure Law", closure_law])
    evaluation_criteria = list(contract_payload.get("evaluation_criteria") or ())
    if evaluation_criteria:
        lines.extend(["", "## Evaluation Criteria", *[f"- {entry}" for entry in evaluation_criteria]])
    non_closure_conditions = list(contract_payload.get("non_closure_conditions") or ())
    if non_closure_conditions:
        lines.extend(
            ["", "## Non-Closure Conditions", *[f"- {entry}" for entry in non_closure_conditions]]
        )
    proof_surface = list(contract_payload.get("proof_surface") or ())
    if proof_surface:
        lines.extend(["", "## Proof Surface", *[f"- {entry}" for entry in proof_surface]])
    if str(contract_payload.get("migration_declaration") or "").strip():
        lines.extend(["", "## Migration Declaration", str(contract_payload["migration_declaration"])])
    if str(contract_payload.get("migration_checklist") or "").strip():
        lines.extend(["", "## Migration Checklist", str(contract_payload["migration_checklist"])])
    if str(contract_payload.get("required_direction") or "").strip():
        lines.extend(["", "## Required Direction", str(contract_payload["required_direction"])])
    if str(contract_payload.get("acceptance") or "").strip():
        lines.extend(["", "## Acceptance", str(contract_payload["acceptance"])])
    return "\n".join(lines).rstrip() + "\n"


def derive_execution_contract_surface(
    *,
    workspace_root: Path,
    module: Module,
    stream: EventStream,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
    normalized_scope: str,
    raw_target: str,
    until: str,
    next_edge_override: str | None = None,
    next_route_state: str | None = None,
    next_binding_source: str | None = None,
) -> DraftExecutionContract:
    from .runtime_effects import publish_runtime_event

    if (raw_target or "").strip() == "next" and not next_edge_override:
        raise ValueError(
            "raw target 'next' is not start-authoritative; resolve the published head gap route before admitting an execution contract"
        )
    resolved = resolve_start_target(workspace_root, module, raw_target)
    resolved_target = resolved.target
    source: ExecutionSource
    target: ExecutionTarget
    if _is_ticket_work_item_target(resolved_target):
        source, target = _ticket_execution_contract(
            workspace_root=workspace_root,
            raw_target=raw_target,
            normalized_scope=normalized_scope,
            until=until,
            resolved_target=resolved_target,
            route_contract=resolved.route_contract,
        )
    else:
        source, target = _ordinary_execution_contract(
            raw_target=raw_target,
            normalized_scope=normalized_scope,
            until=until,
            resolved_target=resolved_target,
            route_contract=resolved.route_contract,
            next_edge_override=next_edge_override,
            next_route_state=next_route_state,
            next_binding_source=next_binding_source,
        )
    draft = _draft_execution_contract(source, target)
    publish_runtime_event(
        stream=stream,
        event_type="execution_contract_drafted",
        data=admit_runtime_event_payload(
            event_type="execution_contract_drafted",
            data={"execution_contract": draft.to_dict()},
        ),
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        aggregate_type="execution_contract",
        aggregate_id=draft.contract_id,
    )
    return draft


def admit_execution_contract_surface(
    *,
    workspace_root: Path,
    module: Module,
    stream: EventStream,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
    normalized_scope: str,
    raw_target: str,
    until: str,
    next_edge_override: str | None = None,
    next_route_state: str | None = None,
    next_binding_source: str | None = None,
) -> AdmittedExecutionContract:
    from .runtime_effects import publish_runtime_event

    draft = derive_execution_contract_surface(
        workspace_root=workspace_root,
        module=module,
        stream=stream,
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        normalized_scope=normalized_scope,
        raw_target=raw_target,
        until=until,
        next_edge_override=next_edge_override,
        next_route_state=next_route_state,
        next_binding_source=next_binding_source,
    )
    errors = _validate_execution_contract(draft)
    register_path = workspace_root / EXECUTION_CONTRACT_REGISTER_PATH
    context_path = workspace_root / EXECUTION_CONTRACT_CONTEXT_PATH
    previous_contract = _load_existing_contract(register_path)
    supersedes_contract_id = None
    if (
        isinstance(previous_contract, dict)
        and str(previous_contract.get("contract_kind") or "") == EXECUTION_CONTRACT_KIND
        and str(previous_contract.get("status") or "") == "admitted"
        and str(previous_contract.get("contract_id") or "")
        and str(previous_contract.get("contract_id") or "") != draft.contract_id
    ):
        superseded = SupersededExecutionContract(
            payload=previous_contract,
            superseded_by_contract_id=draft.contract_id,
        )
        supersedes_contract_id = str(previous_contract["contract_id"])
        publish_runtime_event(
            stream=stream,
            event_type="execution_contract_superseded",
            data=admit_runtime_event_payload(
                event_type="execution_contract_superseded",
                data={"execution_contract": superseded.to_dict()},
            ),
            workflow_version=workflow_version,
            work_key=work_key,
            run_id=run_id,
            aggregate_type="execution_contract",
            aggregate_id=str(previous_contract["contract_id"]),
            correlation_id=draft.contract_id,
        )
    if errors:
        rejected = RejectedExecutionContract(draft=draft, errors=tuple(errors))
        rejected_payload = rejected.to_dict()
        rejected_payload["register_path"] = EXECUTION_CONTRACT_REGISTER_PATH.as_posix()
        rejected_payload["context_path"] = EXECUTION_CONTRACT_CONTEXT_PATH.as_posix()
        write_text_if_changed(register_path, json.dumps(rejected_payload, indent=2, sort_keys=True))
        write_text_if_changed(context_path, _render_execution_contract_context(rejected))
        publish_runtime_event(
            stream=stream,
            event_type="execution_contract_rejected",
            data=admit_runtime_event_payload(
                event_type="execution_contract_rejected",
                data={"execution_contract": rejected_payload},
            ),
            workflow_version=workflow_version,
            work_key=work_key,
            run_id=run_id,
            aggregate_type="execution_contract",
            aggregate_id=draft.contract_id,
        )
        raise ValueError("; ".join(errors))

    contract = AdmittedExecutionContract(
        source=draft.source,
        target=draft.target,
        contract_id=draft.contract_id,
        supersedes_contract_id=supersedes_contract_id,
    )
    contract_payload = contract.to_dict()
    write_text_if_changed(register_path, json.dumps(contract_payload, indent=2, sort_keys=True))
    write_text_if_changed(context_path, _render_execution_contract_context(contract))
    publish_runtime_event(
        stream=stream,
        event_type="execution_contract_admitted",
        data=admit_runtime_event_payload(
            event_type="execution_contract_admitted",
            data={"execution_contract": contract_payload},
        ),
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        aggregate_type="execution_contract",
        aggregate_id=contract.contract_id,
    )
    return contract


def _module_with_injected_target_job(module: Module, *, target_id: str) -> Module:
    from gtl.module_model import Module
    from gtl.work_model import ContractRef, Job

    if any(
        contract.kind == "graph_function" and contract.target_id == target_id
        for job in module.jobs
        for contract in job.contracts
    ):
        return module
    graph_function = next(
        (candidate for candidate in module.graph_functions if candidate.id == target_id),
        None,
    )
    if graph_function is None:
        raise ValueError(f"cannot inject start target job for unknown graph function id {target_id!r}")
    injected_job = Job(
        name=f"{graph_function.name}_target_job",
        contracts=(ContractRef(kind="graph_function", target_id=graph_function.id),),
        roles=module.roles,
    )
    return Module(
        name=module.name,
        graphs=module.graphs,
        graph_functions=module.graph_functions,
        refinement_boundaries=module.refinement_boundaries,
        candidate_families=module.candidate_families,
        jobs=tuple((*module.jobs, injected_job)),
        roles=module.roles,
        operators=module.operators,
        evaluators=module.evaluators,
        rules=module.rules,
        imports=module.imports,
        metadata=module.metadata,
    )


def bound_execution_start_from_contract(
    *,
    scope: Scope,
    execution_contract: AdmittedExecutionContract,
) -> BoundExecutionStart:
    from genesis.services import Scope

    if not isinstance(execution_contract, AdmittedExecutionContract):
        raise TypeError("bound execution start requires AdmittedExecutionContract carrier")
    next_edge_override = (
        execution_contract.target.edge_override
        if isinstance(execution_contract.target, NextExecutionTarget)
        else None
    )
    match execution_contract.target:
        case NextExecutionTarget() as admitted_target:
            resolved_target = admitted_target.to_start_target()
        case GraphFunctionExecutionTarget() as admitted_target:
            resolved_target = admitted_target.to_start_target()
        case AssetExecutionTarget() as admitted_target:
            resolved_target = admitted_target.to_start_target()
        case _:
            raise TypeError("execution contract target is not an admitted target variant")
    admitted_route_contract = execution_contract.route_contract
    runtime_config = dict(scope.runtime_config)
    if resolved_target.kind != "next":
        bound_scope = Scope(
            module=_module_with_injected_target_job(
                scope.module,
                target_id=str(resolved_target.target_id),
            ),
            workspace_root=scope.workspace_root,
            selector=scope.selector,
            diagnostic_edge_override=(
                admitted_route_contract.reentry_vector
                if admitted_route_contract is not None
                else scope.diagnostic_edge_override
            ),
            build=scope.build,
            runtime_identity=scope.runtime_identity,
            worker=None,
            active_workflow_path=scope.active_workflow_path,
            workflow_root=scope.workflow_root,
            work_key=scope.work_key,
            run_id=scope.run_id,
            runtime_config=runtime_config,
        )
    else:
        bound_scope = Scope(
            module=scope.module,
            workspace_root=scope.workspace_root,
            selector=scope.selector,
            diagnostic_edge_override=next_edge_override or scope.diagnostic_edge_override,
            build=scope.build,
            runtime_identity=scope.runtime_identity,
            worker=scope.worker,
            active_workflow_path=scope.active_workflow_path,
            workflow_root=scope.workflow_root,
            work_key=scope.work_key,
            run_id=scope.run_id,
            runtime_config=runtime_config,
        )
    return BoundExecutionStart(
        scope=bound_scope,
        target=resolved_target,
        execution_contract=execution_contract,
    )


def admit_bound_execution_start(
    *,
    scope: Scope,
    stream: EventStream,
    workspace_root: Path,
    module: Module,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
    normalized_scope: str,
    raw_target: str,
    until: str,
    next_edge_override: str | None = None,
    next_route_state: str | None = None,
    next_binding_source: str | None = None,
) -> BoundExecutionStart:
    contract = admit_execution_contract_surface(
        workspace_root=workspace_root,
        module=module,
        stream=stream,
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        normalized_scope=normalized_scope,
        raw_target=raw_target,
        until=until,
        next_edge_override=next_edge_override,
        next_route_state=next_route_state,
        next_binding_source=next_binding_source,
    )
    return bound_execution_start_from_contract(
        scope=scope,
        execution_contract=contract,
    )
