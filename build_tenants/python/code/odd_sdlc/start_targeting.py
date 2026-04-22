"""Published start-target and asset-ownership resolution for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .function_catalog import FUNCTION_CATALOG
from .work_item_routing import (
    STARTABLE_WORK_ITEM_STATUSES,
    WORK_ITEM_ROUTE_OPERATOR_TARGET,
    WorkItemRouteContract,
    is_work_item_handle,
    work_item_route_contract_from_payload,
    work_item_route_contract_from_ticket_metadata,
)


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
    target: Any
    route_contract: WorkItemRouteContract | None = None


def _decl_value(value: Any) -> Any:
    return value.to_dict() if hasattr(value, "to_dict") else value


def _graph_function_carrier_class(entry: dict[str, Any]) -> str:
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


def graph_function_entries(module) -> list[dict[str, Any]]:
    active_function_catalog = list(module.metadata.get("function_catalog", FUNCTION_CATALOG))
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

    def _node_contract(node) -> dict[str, Any]:
        return {
            "name": node.name,
            "schema": (
                node.schema
                if isinstance(node.schema, str)
                else getattr(node.schema, "__name__", repr(node.schema))
            ),
            "asset_surface": node.asset_surface.to_dict(),
        }

    job_names_by_function_id: dict[str, list[str]] = {}
    for job in module.jobs:
        for contract in job.contracts:
            if contract.kind != "graph_function":
                continue
            job_names_by_function_id.setdefault(contract.target_id, []).append(job.name)

    return [
        {
            "id": function.id,
            "name": function.name,
            "intent": function_intent_by_name.get(
                function.name, function.declarations.get("intent", "")
            ),
            "function_kind": function.declarations.get("function_kind"),
            "plugin_kind": function.declarations.get("plugin_kind"),
            "harness_kind": function.declarations.get("harness_kind"),
            "harness_contract": _decl_value(function.declarations.get("harness_contract")),
            "harness_implementation": _decl_value(
                function.declarations.get("harness_implementation")
            ),
            "host_binding_of": function.declarations.get("host_binding_of"),
            "host_binding_kind": function.declarations.get("host_binding_kind"),
            "host_subject_asset": function.declarations.get("host_subject_asset"),
            "host_reviewed_asset": function.declarations.get("host_reviewed_asset"),
            "obligation_ledger": _decl_value(function.declarations.get("obligation_ledger")),
            "template_kind": function.template.kind,
            "selection_visible": function.declarations.get("selection_visible"),
            "tags": list(function.tags),
            "inputs": [node.name for node in function.inputs],
            "outputs": [node.name for node in function.outputs],
            "input_contracts": [_node_contract(node) for node in function.inputs],
            "output_contracts": [_node_contract(node) for node in function.outputs],
            "environment": {
                "requires": [node.name for node in function.environment.requires],
                "provides": [node.name for node in function.environment.provides],
                "carries": [node.name for node in function.environment.carries],
            },
            "vectors": [
                {
                    "name": vector.name,
                    "source": [
                        node.name
                        for node in (
                            vector.source
                            if isinstance(vector.source, tuple)
                            else (vector.source,)
                        )
                    ],
                    "target": vector.target.name,
                    "obligation_ledger": _decl_value(
                        vector.declarations.get("obligation_ledger")
                    ),
                }
                for vector in (
                    function.template.graph.vectors
                    if function.template.graph is not None
                    else ()
                )
            ],
            "job_names": job_names_by_function_id.get(function.id, []),
        }
        for function in module.graph_functions
    ]


def published_start_target_catalog(module) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
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
        entries.append(
            {
                "handle": handle,
                "target_id": str(entry["id"]),
                "graph_function_name": handle,
                "carrier_class": carrier_class,
                "template_kind": entry["template_kind"],
                "job_names": list(entry.get("job_names") or ()),
                "execution_binding": execution_binding,
                "start_addressable": start_addressable,
                "inputs": list(entry["inputs"]),
                "outputs": list(entry["outputs"]),
                "host_binding_of": entry.get("host_binding_of"),
                "host_binding_kind": entry.get("host_binding_kind"),
                "plugin_kind": entry.get("plugin_kind"),
                "binding_source": _START_TARGET_CATALOG_SOURCE,
            }
        )
    return entries


def _governing_target_handle_for_asset(
    asset_id: str,
    *,
    start_target_by_handle: dict[str, dict[str, Any]],
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
    module,
) -> list[dict[str, Any]]:
    from .workspace_assets import bootstrap_assets

    start_target_catalog = published_start_target_catalog(module)
    start_target_by_handle = {
        str(entry["handle"]): entry
        for entry in start_target_catalog
        if bool(entry.get("start_addressable"))
    }
    assets = [asset.to_dict() for asset in bootstrap_assets(workspace_root)]
    index: list[dict[str, Any]] = []
    for asset in assets:
        asset_id = str(asset.get("asset_id") or "")
        if not asset_id:
            continue
        metadata = asset.get("metadata") if isinstance(asset.get("metadata"), dict) else {}
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
            owner_handle = WORK_ITEM_ROUTE_OPERATOR_TARGET
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
        checkpoint = asset.get("checkpoint") if isinstance(asset.get("checkpoint"), dict) else {}
        entry = {
            "handle": asset_id,
            "asset_id": asset_id,
            "uri": asset.get("uri"),
            "relative_path": metadata.get("relative_path"),
            "path_kind": checkpoint.get("path_kind"),
            "exists": checkpoint.get("exists"),
            "binding_source": _ASSET_OWNERSHIP_INDEX_SOURCE,
            "operator_target": {
                "kind": "graph_function",
                "handle": owner_entry["handle"],
                "target_id": owner_entry["target_id"],
                "graph_function_name": owner_entry["graph_function_name"],
                "carrier_class": owner_entry["carrier_class"],
            },
        }
        if route_contract is not None:
            entry["route_contract"] = route_contract.to_dict()
        index.append(entry)
    return index


def resolve_start_target(
    workspace_root: Path,
    module,
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
            metadata = (
                asset_payload.get("metadata")
                if isinstance(asset_payload.get("metadata"), dict)
                else {}
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
