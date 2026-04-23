"""Published start-target and asset-ownership resolution for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, Mapping, NotRequired, TypedDict

from gtl.module_model import Module

from .function_catalog import FUNCTION_CATALOG
from .public_start_contract import (
    AssetOperatorTargetPayload,
    AssetOwnershipIndexEntryPayload,
    StartTargetCatalogEntryPayload,
    WorkItemRouteContractPayload,
)
from .work_item_routing import (
    STARTABLE_WORK_ITEM_STATUSES,
    WORK_ITEM_ROUTE_OPERATOR_TARGET,
    WorkItemRouteContract,
    is_work_item_handle,
    work_item_route_contract_from_payload,
    work_item_route_contract_from_ticket_metadata,
)

if TYPE_CHECKING:
    from genesis.services import StartTarget


OpaqueGraphNodeAssetSurfacePayload = dict[str, object]
OpaqueGtlDeclarationPayload = dict[str, object]


class GraphFunctionNodeContractPayload(TypedDict):
    name: str
    schema: str
    asset_surface: OpaqueGraphNodeAssetSurfacePayload


class GraphFunctionEnvironmentPayload(TypedDict):
    requires: list[str]
    provides: list[str]
    carries: list[str]


class GraphFunctionVectorPayload(TypedDict, total=False):
    name: str
    source: list[str]
    target: str
    obligation_ledger: OpaqueGtlDeclarationPayload
    fp_retry_policy: OpaqueGtlDeclarationPayload


class GraphFunctionEntryPayload(TypedDict, total=False):
    id: str
    name: str
    intent: str
    function_kind: str
    plugin_kind: str
    harness_kind: str
    harness_contract: OpaqueGtlDeclarationPayload
    harness_implementation: OpaqueGtlDeclarationPayload
    host_binding_of: str
    host_binding_kind: str
    host_subject_asset: str
    host_reviewed_asset: str
    obligation_ledger: OpaqueGtlDeclarationPayload
    template_kind: str
    selection_visible: bool
    tags: list[str]
    inputs: list[str]
    outputs: list[str]
    input_contracts: list[GraphFunctionNodeContractPayload]
    output_contracts: list[GraphFunctionNodeContractPayload]
    environment: GraphFunctionEnvironmentPayload
    vectors: list[GraphFunctionVectorPayload]
    job_names: list[str]


_START_TARGET_CATALOG_SOURCE = "odd_sdlc.start_target_catalog"
_ASSET_OWNERSHIP_INDEX_SOURCE = "odd_sdlc.asset_ownership_index"
_REVIEW_DESIGN_ASSET_IDS = frozenset(
    {
        "review_assessment_surface",
        "consensus_decision_surface",
        "reviewed_design_surface",
    }
)
_OPERATIONAL_CYCLE_ASSET_IDS = frozenset(
    {
        "build_execution_surface",
        "build_execution_result_surface",
        "test_execution_surface",
        "test_execution_result_surface",
        "deployment_surface",
        "deployment_result_surface",
        "deployed_environment_surface",
        "runtime_observation_surface",
        "retrofit_plan_surface",
    }
)
_NON_ADDRESSABLE_INDEX_ASSET_IDS = frozenset(
    {
        "ambiguity_register_surface",
        "requirement_closure_register_surface",
    }
)


@dataclass(frozen=True)
class ResolvedOddStartTarget:
    target: StartTarget
    route_contract: WorkItemRouteContract | None = None


def _decl_value(value: object) -> object:
    return value.to_dict() if hasattr(value, "to_dict") else value


def _decl_payload(value: object) -> OpaqueGtlDeclarationPayload | None:
    projected = _decl_value(value)
    return projected if isinstance(projected, dict) else None


def _string_list(value: object) -> list[str]:
    if not isinstance(value, (list, tuple)):
        return []
    return [str(item) for item in value if isinstance(item, str) and item]


def _graph_function_carrier_class(entry: Mapping[str, object]) -> str:
    function_kind = str(entry.get("function_kind") or "")
    if "runtime_source" in function_kind:
        return "runtime_source_carrier"
    if "executive" in function_kind:
        return "executive_carrier"
    if str(entry.get("host_binding_of") or ""):
        return "host_binding"
    if "plugin" in function_kind or str(entry.get("plugin_kind") or ""):
        return "higher_order_plugin"
    return "edge_realization_carrier"


def _module_metadata(module: Module) -> Mapping[str, object]:
    return module.metadata if isinstance(module.metadata, Mapping) else {}


def _function_catalog_entries(module: Module) -> list[object]:
    function_catalog = _module_metadata(module).get("function_catalog")
    if isinstance(function_catalog, (list, tuple)):
        return list(function_catalog)
    return list(FUNCTION_CATALOG)


def _node_contract(node: object) -> GraphFunctionNodeContractPayload:
    return {
        "name": str(getattr(node, "name", "")),
        "schema": (
            getattr(node, "schema")
            if isinstance(getattr(node, "schema"), str)
            else getattr(getattr(node, "schema"), "__name__", repr(getattr(node, "schema")))
        ),
        "asset_surface": getattr(getattr(node, "asset_surface"), "to_dict")(),
    }


def graph_function_entries(module: Module) -> list[GraphFunctionEntryPayload]:
    active_function_catalog = _function_catalog_entries(module)
    function_intent_by_name: dict[str, str] = {}
    for entry in active_function_catalog:
        if isinstance(entry, dict):
            name = entry.get("name")
            intent = entry.get("intent")
        else:
            name = getattr(entry, "name", None)
            intent = getattr(entry, "intent", None)
        if isinstance(name, str):
            function_intent_by_name[name] = intent or ""

    job_names_by_function_id: dict[str, list[str]] = {}
    for job in module.jobs:
        for contract in job.contracts:
            if contract.kind != "graph_function":
                continue
            job_names_by_function_id.setdefault(contract.target_id, []).append(job.name)

    return [
        _graph_function_entry_payload(
            function,
            function_intent=function_intent_by_name.get(
                function.name, function.declarations.get("intent", "")
            ),
            job_names=job_names_by_function_id.get(function.id, []),
        )
        for function in module.graph_functions
    ]


def _graph_function_entry_payload(
    function: object,
    *,
    function_intent: object,
    job_names: list[str],
) -> GraphFunctionEntryPayload:
    payload: GraphFunctionEntryPayload = {
        "id": str(getattr(function, "id")),
        "name": str(getattr(function, "name")),
        "intent": function_intent if isinstance(function_intent, str) else "",
        "template_kind": str(getattr(getattr(function, "template"), "kind")),
        "tags": list(getattr(function, "tags")),
        "inputs": [node.name for node in getattr(function, "inputs")],
        "outputs": [node.name for node in getattr(function, "outputs")],
        "input_contracts": [_node_contract(node) for node in getattr(function, "inputs")],
        "output_contracts": [_node_contract(node) for node in getattr(function, "outputs")],
        "environment": {
            "requires": [node.name for node in getattr(function, "environment").requires],
            "provides": [node.name for node in getattr(function, "environment").provides],
            "carries": [node.name for node in getattr(function, "environment").carries],
        },
        "vectors": [
            _graph_function_vector_payload(vector)
            for vector in (
                getattr(getattr(function, "template"), "graph").vectors
                if getattr(function, "template").graph is not None
                else ()
            )
        ],
        "job_names": job_names,
    }

    declarations = getattr(function, "declarations")
    function_kind = declarations.get("function_kind")
    if isinstance(function_kind, str) and function_kind:
        payload["function_kind"] = function_kind
    plugin_kind = declarations.get("plugin_kind")
    if isinstance(plugin_kind, str) and plugin_kind:
        payload["plugin_kind"] = plugin_kind
    harness_kind = declarations.get("harness_kind")
    if isinstance(harness_kind, str) and harness_kind:
        payload["harness_kind"] = harness_kind
    host_binding_of = declarations.get("host_binding_of")
    if isinstance(host_binding_of, str) and host_binding_of:
        payload["host_binding_of"] = host_binding_of
    host_binding_kind = declarations.get("host_binding_kind")
    if isinstance(host_binding_kind, str) and host_binding_kind:
        payload["host_binding_kind"] = host_binding_kind
    host_subject_asset = declarations.get("host_subject_asset")
    if isinstance(host_subject_asset, str) and host_subject_asset:
        payload["host_subject_asset"] = host_subject_asset
    host_reviewed_asset = declarations.get("host_reviewed_asset")
    if isinstance(host_reviewed_asset, str) and host_reviewed_asset:
        payload["host_reviewed_asset"] = host_reviewed_asset

    harness_contract = _decl_payload(declarations.get("harness_contract"))
    if harness_contract is not None:
        payload["harness_contract"] = harness_contract
    harness_implementation = _decl_payload(declarations.get("harness_implementation"))
    if harness_implementation is not None:
        payload["harness_implementation"] = harness_implementation
    obligation_ledger = _decl_payload(declarations.get("obligation_ledger"))
    if obligation_ledger is not None:
        payload["obligation_ledger"] = obligation_ledger

    selection_visible = declarations.get("selection_visible")
    if isinstance(selection_visible, bool):
        payload["selection_visible"] = selection_visible

    return payload


def _graph_function_vector_payload(vector: object) -> GraphFunctionVectorPayload:
    payload: GraphFunctionVectorPayload = {
        "name": str(getattr(vector, "name")),
        "source": [
            node.name
            for node in (
                getattr(vector, "source")
                if isinstance(getattr(vector, "source"), tuple)
                else (getattr(vector, "source"),)
            )
        ],
        "target": getattr(getattr(vector, "target"), "name"),
    }
    declarations = getattr(vector, "declarations")
    obligation_ledger = _decl_payload(declarations.get("obligation_ledger"))
    if obligation_ledger is not None:
        payload["obligation_ledger"] = obligation_ledger
    fp_retry_policy = _decl_payload(declarations.get("fp_retry_policy"))
    if fp_retry_policy is not None:
        payload["fp_retry_policy"] = fp_retry_policy
    return payload


def published_start_target_catalog(module: Module) -> list[StartTargetCatalogEntryPayload]:
    entries: list[StartTargetCatalogEntryPayload] = []
    for entry in graph_function_entries(module):
        handle = str(entry["name"])
        carrier_class = _graph_function_carrier_class(entry)
        start_addressable = (
            str(entry.get("template_kind") or "") != "symbolic"
            and entry.get("selection_visible") is not False
        )
        execution_binding = "published_job"
        if not entry.get("job_names"):
            execution_binding = (
                "target_injected_job" if start_addressable else "not_start_addressable"
            )
        projected: StartTargetCatalogEntryPayload = {
            "handle": handle,
            "target_id": str(entry["id"]),
            "graph_function_name": handle,
            "carrier_class": carrier_class,
            "template_kind": str(entry["template_kind"]),
            "job_names": _string_list(entry.get("job_names")),
            "execution_binding": execution_binding,
            "start_addressable": start_addressable,
            "inputs": _string_list(entry.get("inputs")),
            "outputs": _string_list(entry.get("outputs")),
            "binding_source": _START_TARGET_CATALOG_SOURCE,
        }
        host_binding_of = entry.get("host_binding_of")
        if isinstance(host_binding_of, str) and host_binding_of:
            projected["host_binding_of"] = host_binding_of
        host_binding_kind = entry.get("host_binding_kind")
        if isinstance(host_binding_kind, str) and host_binding_kind:
            projected["host_binding_kind"] = host_binding_kind
        plugin_kind = entry.get("plugin_kind")
        if isinstance(plugin_kind, str) and plugin_kind:
            projected["plugin_kind"] = plugin_kind
        entries.append(projected)
    return entries


def _governing_target_handle_for_asset(
    asset_id: str,
    *,
    start_target_by_handle: Mapping[str, StartTargetCatalogEntryPayload],
) -> str | None:
    if asset_id in _NON_ADDRESSABLE_INDEX_ASSET_IDS:
        return None
    if asset_id in _REVIEW_DESIGN_ASSET_IDS:
        return (
            "review_design_consensus_round"
            if "review_design_consensus_round" in start_target_by_handle
            else None
        )
    if asset_id in _OPERATIONAL_CYCLE_ASSET_IDS:
        return (
            "release_operational_cycle"
            if "release_operational_cycle" in start_target_by_handle
            else None
        )
    return (
        "bootstrap_release_self_test"
        if "bootstrap_release_self_test" in start_target_by_handle
        else None
    )


def published_asset_ownership_index(
    workspace_root: Path,
    module: Module,
) -> list[AssetOwnershipIndexEntryPayload]:
    from .workspace_assets import bootstrap_assets

    start_target_catalog = published_start_target_catalog(module)
    start_target_by_handle = {
        str(entry["handle"]): entry
        for entry in start_target_catalog
        if bool(entry.get("start_addressable"))
    }
    assets = [asset.to_dict() for asset in bootstrap_assets(workspace_root)]
    index: list[AssetOwnershipIndexEntryPayload] = []
    for asset in assets:
        asset_id = str(asset.get("asset_id") or "")
        if not asset_id:
            continue
        raw_metadata = asset.get("metadata")
        metadata: Mapping[str, object] = raw_metadata if isinstance(raw_metadata, dict) else {}
        if is_work_item_handle(asset_id):
            ticket_status = str(metadata.get("ticket_status") or "")
            if ticket_status not in STARTABLE_WORK_ITEM_STATUSES:
                continue
            ticket_id = str(metadata.get("ticket_id") or "").strip()
            route_contract = work_item_route_contract_from_ticket_metadata(
                metadata,
                ticket_id=ticket_id,
            )
            if route_contract is None:
                continue
            owner_handle: str | None = WORK_ITEM_ROUTE_OPERATOR_TARGET
        else:
            route_contract = None
            owner_handle = _governing_target_handle_for_asset(
                asset_id,
                start_target_by_handle=start_target_by_handle,
            )
        if owner_handle is None:
            continue
        owner_entry = start_target_by_handle.get(owner_handle)
        if owner_entry is None:
            continue
        raw_checkpoint = asset.get("checkpoint")
        checkpoint: Mapping[str, object] | None = (
            raw_checkpoint if isinstance(raw_checkpoint, Mapping) else None
        )
        operator_target: AssetOperatorTargetPayload = {
            "kind": "graph_function",
            "handle": str(owner_entry["handle"]),
            "target_id": str(owner_entry["target_id"]),
            "graph_function_name": str(owner_entry["graph_function_name"]),
            "carrier_class": str(owner_entry["carrier_class"]),
        }
        entry: AssetOwnershipIndexEntryPayload = {
            "handle": asset_id,
            "asset_id": asset_id,
            "binding_source": _ASSET_OWNERSHIP_INDEX_SOURCE,
            "operator_target": operator_target,
        }
        uri = asset.get("uri")
        if isinstance(uri, str) and uri:
            entry["uri"] = uri
        relative_path = metadata.get("relative_path")
        if isinstance(relative_path, str) and relative_path:
            entry["relative_path"] = relative_path
        if checkpoint is not None:
            path_kind = checkpoint.get("path_kind")
            if isinstance(path_kind, str) and path_kind:
                entry["path_kind"] = path_kind
            exists = checkpoint.get("exists")
            if isinstance(exists, bool):
                entry["exists"] = exists
        if route_contract is not None:
            route_payload: WorkItemRouteContractPayload = {
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
            entry["route_contract"] = route_payload
        index.append(entry)
    return index


def resolve_start_target(
    workspace_root: Path,
    module: Module,
    raw_target: str,
) -> ResolvedOddStartTarget:
    from genesis.services import StartTarget
    from .workspace_assets import bootstrap_assets

    value = (raw_target or "").strip()
    if value == "next":
        return ResolvedOddStartTarget(target=StartTarget.next())

    start_target_catalog = published_start_target_catalog(module)
    start_target_by_handle = {
        str(entry["handle"]): entry
        for entry in start_target_catalog
        if bool(entry.get("start_addressable"))
    }
    graph_prefix = "graph_function:"
    asset_prefix = "asset:"
    if value.startswith(graph_prefix):
        handle = value[len(graph_prefix):].strip()
        if not handle:
            raise ValueError("graph_function target requires a non-empty published handle")
        entry = start_target_by_handle.get(handle)
        if entry is None:
            raise ValueError(
                f"unknown or non-start-addressable published graph-function handle {handle!r}"
            )
        return ResolvedOddStartTarget(
            target=StartTarget.graph_function(
                handle=handle,
                target_id=str(entry["target_id"]),
                graph_function_name=str(entry["graph_function_name"]),
            )
        )

    if not value.startswith(asset_prefix):
        raise ValueError(
            "target must be 'next', 'graph_function:<published_handle>', or 'asset:<published_handle>'"
        )
    handle = value[len(asset_prefix):].strip()
    if not handle:
        raise ValueError("asset target requires a non-empty published handle")

    if is_work_item_handle(handle):
        asset_payload = next(
            (
                asset.to_dict()
                for asset in bootstrap_assets(workspace_root)
                if str(asset.asset_id or "") == handle
            ),
            None,
        )
        if isinstance(asset_payload, dict):
            metadata_value = asset_payload.get("metadata")
            metadata: Mapping[str, object] = (
                metadata_value if isinstance(metadata_value, Mapping) else {}
            )
            ticket_status = str(metadata.get("ticket_status") or "")
            if ticket_status and ticket_status not in STARTABLE_WORK_ITEM_STATUSES:
                raise ValueError(f"ticket_status {ticket_status!r} is not start-authoritative")

    asset_ownership_index = published_asset_ownership_index(workspace_root, module)
    asset_entry = next(
        (entry for entry in asset_ownership_index if str(entry.get("handle") or "") == handle),
        None,
    )
    if asset_entry is None:
        raise ValueError(
            f"unknown or non-start-addressable published asset handle {handle!r}"
        )
    operator_target = dict(asset_entry["operator_target"])
    route_contract = None
    if is_work_item_handle(handle):
        route_payload = asset_entry.get("route_contract")
        if not isinstance(route_payload, dict):
            raise ValueError(f"published work-item asset handle {handle!r} missing route_contract")
        route_contract = work_item_route_contract_from_payload(route_payload)
        if route_contract is None:
            raise ValueError(f"published work-item asset handle {handle!r} has invalid route_contract")
    return ResolvedOddStartTarget(
        target=StartTarget.asset(
            handle=handle,
            target_id=str(operator_target["target_id"]),
            graph_function_name=str(operator_target["graph_function_name"]),
            asset_id=str(asset_entry["asset_id"]),
            asset_uri=str(asset_entry["uri"]),
            asset_relative_path=(
                str(asset_entry["relative_path"])
                if isinstance(asset_entry.get("relative_path"), str)
                else None
            ),
            asset_path_kind=(
                str(asset_entry["path_kind"])
                if isinstance(asset_entry.get("path_kind"), str)
                else None
            ),
            asset_exists=(
                bool(asset_entry["exists"])
                if isinstance(asset_entry.get("exists"), bool)
                else None
            ),
            binding_source=str(asset_entry["binding_source"]),
        ),
        route_contract=route_contract,
    )
