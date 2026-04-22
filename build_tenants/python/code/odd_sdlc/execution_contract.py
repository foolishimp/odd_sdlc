# Implements: REQ-F-ODDSDLC-040
"""Admitted execution-contract surface for odd_sdlc dispatch."""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
from typing import Any, Literal, Mapping

from .publication_io import write_text_if_changed
from .start_targeting import resolve_start_target
from .work_item_routing import (
    STARTABLE_WORK_ITEM_STATUSES,
    WorkItemRouteContract,
    is_work_item_handle,
    load_work_item_ticket_surface,
)


EXECUTION_CONTRACT_KIND = "odd_sdlc.execution_contract_surface"
DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION = "derive_execution_contract_surface"
ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION = "admit_execution_contract_surface"
EXECUTION_CONTRACT_REGISTER_PATH = Path(".ai-workspace/runtime/odd_sdlc-execution-contract.json")
EXECUTION_CONTRACT_CONTEXT_PATH = Path(".ai-workspace/runtime/odd_sdlc-execution-contract.md")
_EXECUTION_CONTRACT_CARRIER_SHAPE = "typed_execution_contract_carrier.v1"
_EXECUTION_CONTRACT_SOURCE_KINDS = frozenset({"operator_request", "ticket_work_item"})
_EXECUTION_CONTRACT_TARGET_KINDS = frozenset({"next", "graph_function", "asset"})


class ExecutionContractSurfaceError(ValueError):
    """Raised when a persisted execution-contract carrier is missing or malformed."""


@dataclass(frozen=True)
class BoundExecutionStart:
    scope: Any
    target: Any
    execution_contract: "AdmittedExecutionContract"


@dataclass(frozen=True)
class AdmittedExecutionContractProjection:
    contract_id: str
    source_kind: Literal["operator_request", "ticket_work_item"]
    target_kind: Literal["next", "graph_function", "asset"]
    payload: Mapping[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return dict(self.payload)


@dataclass(frozen=True)
class NextExecutionTarget:
    public_target: str
    normalized_scope: str
    until: str
    kind: Literal["next"] = "next"

    def to_dict(self) -> dict[str, Any]:
        return {
            "normalized_scope": self.normalized_scope,
            "public_target": self.public_target,
            "until": self.until,
            "kind": self.kind,
        }

    def to_start_target(self) -> Any:
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

    def to_dict(self) -> dict[str, Any]:
        return {
            "normalized_scope": self.normalized_scope,
            "public_target": self.public_target,
            "until": self.until,
            "kind": self.kind,
            "handle": self.handle,
            "target_id": self.target_id,
            "graph_function_name": self.graph_function_name,
        }

    def to_start_target(self) -> Any:
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

    def to_dict(self) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "normalized_scope": self.normalized_scope,
            "public_target": self.public_target,
            "until": self.until,
            "kind": self.kind,
            "handle": self.handle,
            "target_id": self.target_id,
            "graph_function_name": self.graph_function_name,
            "asset_id": self.asset_id,
            "asset_uri": self.asset_uri,
            "asset_relative_path": self.asset_relative_path,
            "asset_path_kind": self.asset_path_kind,
            "asset_exists": self.asset_exists,
            "binding_source": self.binding_source,
            "route_contract": (
                self.route_contract.to_dict() if self.route_contract is not None else None
            ),
            "ticket_id": self.ticket_id,
            "ticket_relative_path": self.ticket_relative_path,
            "ticket_target_truth": self.ticket_target_truth,
        }
        return {key: value for key, value in payload.items() if value not in (None, "", {})}

    def to_start_target(self) -> Any:
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

    def to_dict(self) -> dict[str, Any]:
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

    def to_dict(self) -> dict[str, Any]:
        payload = {
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
        return {key: value for key, value in payload.items() if value not in (None, "", [], {})}


ExecutionSource = OperatorExecutionSource | TicketWorkItemExecutionSource


@dataclass(frozen=True)
class DraftExecutionContract:
    source: ExecutionSource
    target: ExecutionTarget
    contract_id: str
    status: Literal["drafted"] = "drafted"
    carrier_shape: Literal["typed_execution_contract_carrier.v1"] = _EXECUTION_CONTRACT_CARRIER_SHAPE

    def to_dict(self) -> dict[str, Any]:
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
    carrier_shape: Literal["typed_execution_contract_carrier.v1"] = _EXECUTION_CONTRACT_CARRIER_SHAPE

    @property
    def route_contract(self) -> WorkItemRouteContract | None:
        return self.target.route_contract if isinstance(self.target, AssetExecutionTarget) else None

    def to_dict(self) -> dict[str, Any]:
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
                "supersedes_contract_id": self.supersedes_contract_id,
            }
        )
        return {key: value for key, value in payload.items() if value not in (None, "", [], {})}


@dataclass(frozen=True)
class RejectedExecutionContract:
    draft: DraftExecutionContract
    errors: tuple[str, ...]
    status: Literal["rejected"] = "rejected"

    def to_dict(self) -> dict[str, Any]:
        payload = self.draft.to_dict()
        payload["status"] = self.status
        payload["errors"] = list(self.errors)
        return payload


@dataclass(frozen=True)
class SupersededExecutionContract:
    payload: dict[str, Any]
    superseded_by_contract_id: str
    status: Literal["superseded"] = "superseded"

    def to_dict(self) -> dict[str, Any]:
        payload = dict(self.payload)
        payload["status"] = self.status
        payload["superseded_by_contract_id"] = self.superseded_by_contract_id
        return payload


ExecutionContractCarrier = (
    DraftExecutionContract | AdmittedExecutionContract | RejectedExecutionContract | SupersededExecutionContract
)


def _load_existing_contract(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return payload if isinstance(payload, dict) else None


def _admitted_execution_contract_projection_from_payload(
    payload: Mapping[str, Any],
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
    return AdmittedExecutionContractProjection(
        contract_id=contract_id,
        source_kind=source_kind,  # type: ignore[arg-type]
        target_kind=target_kind,  # type: ignore[arg-type]
        payload=dict(payload),
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


def _coerce_string_list(value: Any) -> list[str]:
    if isinstance(value, (list, tuple)):
        return [str(entry).strip() for entry in value if str(entry).strip()]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def _base_contract_payload(source: ExecutionSource, target: ExecutionTarget) -> dict[str, Any]:
    payload = source.to_dict()
    payload["target_truth"] = target.to_dict()
    return payload


def _execution_target_from_resolved(
    *,
    raw_target: str,
    normalized_scope: str,
    until: str,
    resolved_target: Any,
    route_contract: WorkItemRouteContract | None,
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
    resolved_target: Any,
    route_contract: WorkItemRouteContract | None,
) -> tuple[OperatorExecutionSource, ExecutionTarget]:
    target = _execution_target_from_resolved(
        raw_target=raw_target,
        normalized_scope=normalized_scope,
        until=until,
        resolved_target=resolved_target,
        route_contract=route_contract,
    )
    source = OperatorExecutionSource(
        ticket_category="ordinary",
        change_class="realization_refactor",
        re_entry_point="realization_surface",
        affected_boundary="odd_sdlc start dispatch over published graph-function target truth",
        closure_law=(
            "Dispatch stays open until the selected graph-function edge advances under published "
            "deterministic failure law, output contract law, and later proof/gap-analysis review."
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


def _is_ticket_work_item_target(resolved_target: Any) -> bool:
    if str(getattr(resolved_target, "kind", "") or "") != "asset":
        return False
    asset_id = str(getattr(resolved_target, "asset_id", "") or "")
    handle = str(getattr(resolved_target, "handle", "") or "")
    return is_work_item_handle(asset_id) or is_work_item_handle(handle)


def _ticket_execution_contract(
    *,
    workspace_root: Path,
    raw_target: str,
    normalized_scope: str,
    until: str,
    resolved_target: Any,
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
    if not source.closure_law.strip():
        errors.append("closure_law is required")
    if not source.evaluation_criteria:
        errors.append("evaluation_criteria is required")
    if not source.proof_surface:
        errors.append("proof_surface is required")
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


def _carrier_graph_functions() -> dict[str, str]:
    return {
        "derive": DERIVE_EXECUTION_CONTRACT_GRAPH_FUNCTION,
        "admit": ADMIT_EXECUTION_CONTRACT_GRAPH_FUNCTION,
    }


def _contract_id(payload: dict[str, Any]) -> str:
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


def execution_contract_payload(contract: ExecutionContractCarrier | Mapping[str, Any]) -> dict[str, Any]:
    if isinstance(
        contract,
        (
            DraftExecutionContract,
            AdmittedExecutionContract,
            RejectedExecutionContract,
            SupersededExecutionContract,
        ),
    ):
        return contract.to_dict()
    return dict(contract)


def _render_execution_contract_context(contract: ExecutionContractCarrier | Mapping[str, Any]) -> str:
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
    module: Any,
    stream: Any,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
    normalized_scope: str,
    raw_target: str,
    until: str,
) -> DraftExecutionContract:
    from .runtime_effects import publish_runtime_event

    resolved = resolve_start_target(workspace_root, module, raw_target)
    resolved_target = resolved.target
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
        )
    draft = _draft_execution_contract(source, target)
    publish_runtime_event(
        stream=stream,
        event_type="execution_contract_drafted",
        data={"execution_contract": draft.to_dict()},
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
    module: Any,
    stream: Any,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
    normalized_scope: str,
    raw_target: str,
    until: str,
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
            data={"execution_contract": superseded.to_dict()},
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
        write_text_if_changed(context_path, _render_execution_contract_context(rejected_payload))
        publish_runtime_event(
            stream=stream,
            event_type="execution_contract_rejected",
            data={"execution_contract": rejected_payload},
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
        data={"execution_contract": contract_payload},
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        aggregate_type="execution_contract",
        aggregate_id=contract.contract_id,
    )
    return contract


def _module_with_injected_target_job(module: Any, *, target_id: str) -> Any:
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
    scope: Any,
    execution_contract: AdmittedExecutionContract,
) -> BoundExecutionStart:
    from genesis.services import Scope

    if not isinstance(execution_contract, AdmittedExecutionContract):
        raise TypeError("bound execution start requires AdmittedExecutionContract carrier")
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
            diagnostic_edge_override=scope.diagnostic_edge_override,
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
    scope: Any,
    stream: Any,
    workspace_root: Path,
    module: Any,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
    normalized_scope: str,
    raw_target: str,
    until: str,
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
    )
    return bound_execution_start_from_contract(
        scope=scope,
        execution_contract=contract,
    )
