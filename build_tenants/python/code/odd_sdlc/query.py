# Implements: REQ-F-ASSETMODEL-005
# Implements: REQ-F-ODDSDLC-005
# Implements: REQ-F-ODDSDLC-020
# Implements: REQ-F-ODDSDLC-027
# Implements: REQ-F-ODDSDLC-029
"""ODD domain query library for odd_sdlc."""
from __future__ import annotations

from typing import Mapping

from .app import OddSdlcApp, catalog
from .ambiguity import AmbiguityRegisterReadModel
from .ambiguity import load_or_build_ambiguity_register
from .domain_model import (
    AssetCheckpointPayload,
    AssetCollectionPayload,
    AssetFamilyDescriptorPayload,
    AssetNodeBindingPayload,
    AssetPayload,
    AssetProjectionPayload,
    AssetProvenancePayload,
    AssetSemanticFacetPayload,
    AssetTypeProfilePayload,
    EdgeContractDescriptorPayload,
    ExecutiveProgramEntryPayload,
    FunctionCatalogEntryPayload,
    WorkActDescriptorPayload,
)
from .execution_contract import normalize_execution_contract_surface_payload
from .gap_dossier import load_gap_dossier_read_model
from .project_profile import (
    OperationalCapabilitiesProjectionPayload,
    OperationalCapabilityFamilyPayload,
)
from .query_contract import (
    JobContractPayload,
    JobProjectionPayload,
    QueryAssetsBindingPayload,
    QueryDomainPayload,
    query_domain_contract,
)
from .public_start_contract import (
    AssetOperatorTargetPayload,
    AssetOwnershipIndexEntryPayload,
    ExecutionContractSurfacePayload,
    NextExecutionTargetPayload,
    StartTargetCatalogEntryPayload,
    WorkItemRouteContractPayload,
)
from .requirement_closure import (
    RequirementClosureRegisterReadModel,
    load_requirement_closure_register_read_model,
)
from .start_targeting import (
    GraphFunctionEntryPayload,
    GraphFunctionEnvironmentPayload,
    GraphFunctionNodeContractPayload,
    OpaqueGtlDeclarationPayload,
    GraphFunctionVectorPayload,
)
from .work_item_routing import work_item_route_contract_from_payload
from .workspace_assets import bootstrap_assets


def _project_assets(app: OddSdlcApp) -> list[AssetProjectionPayload]:
    base_assets: list[AssetPayload] = [
        asset.to_dict()
        for asset in bootstrap_assets(app.config.workspace_root)
    ]
    events = app.stream.all_events()
    checkpoint_events_by_asset: dict[str, list[dict[str, object]]] = {}
    for event in events:
        if not isinstance(event, Mapping):
            continue
        if event.get("event_type") != "asset_checkpoint_updated":
            continue
        event_data = event.get("data")
        if not isinstance(event_data, Mapping):
            continue
        asset_id = event_data.get("asset_id")
        if not isinstance(asset_id, str) or not asset_id:
            continue
        checkpoint_events_by_asset.setdefault(asset_id, []).append(_object_dict(event))

    projected: list[AssetProjectionPayload] = []
    for asset in base_assets:
        asset_id = asset.get("asset_id")
        if not asset_id:
            continue
        updates = checkpoint_events_by_asset.get(asset_id, [])
        if updates:
            latest = updates[-1]
            latest_data_value = latest.get("data")
            latest_data = latest_data_value if isinstance(latest_data_value, Mapping) else {}
            projected.append(
                _asset_projection_from_payload(
                    asset,
                    projection_source="event_history",
                    update_count=len(updates),
                    checkpoint=_checkpoint_payload(latest_data.get("current_checkpoint")),
                    provenance=_event_history_provenance(
                        asset.get("provenance"),
                        last_event_id=latest.get("event_id"),
                    ),
                )
            )
        else:
            projected.append(
                _asset_projection_from_payload(
                    asset,
                    projection_source="workspace_scan",
                    update_count=0,
                    checkpoint=asset.get("checkpoint"),
                    provenance=asset.get("provenance"),
                )
            )
    return projected


def query_assets(app: OddSdlcApp) -> list[AssetProjectionPayload]:
    return _project_assets(app)


def query_asset_bindings(app: OddSdlcApp) -> QueryAssetsBindingPayload:
    return {
        "query_contract": "odd_sdlc.query-assets",
        "workspace_root": str(app.config.workspace_root),
        "assets": query_assets(app),
    }


def _object_dict(value: object) -> dict[str, object]:
    if not isinstance(value, Mapping):
        return {}
    return {str(key): item for key, item in value.items()}


def _object_dict_list(value: object) -> list[dict[str, object]]:
    if not isinstance(value, list):
        return []
    projected: list[dict[str, object]] = []
    for item in value:
        if isinstance(item, Mapping):
            projected.append(_object_dict(item))
    return projected


def _checkpoint_payload(value: object) -> AssetCheckpointPayload | None:
    if not isinstance(value, Mapping):
        return None
    return {
        "exists": bool(value.get("exists")),
        "path_kind": str(value.get("path_kind") or ""),
        "content_digest": _string_field(value.get("content_digest")),
        "bytes": value.get("bytes") if isinstance(value.get("bytes"), int) else None,
    }


def _provenance_payload(value: object) -> AssetProvenancePayload | None:
    if not isinstance(value, Mapping):
        return None
    model = _string_field(value.get("model"))
    source = _string_field(value.get("source"))
    mutable = _bool_field(value.get("mutable"))
    history_basis = _string_field(value.get("history_basis"))
    if model is None or source is None or mutable is None or history_basis is None:
        return None
    return {
        "model": model,
        "source": source,
        "mutable": mutable,
        "history_basis": history_basis,
    }


def _event_history_provenance(
    value: object,
    *,
    last_event_id: object,
) -> AssetProvenancePayload:
    base = _provenance_payload(value)
    return {
        "model": base["model"] if base is not None else "",
        "source": "asset_checkpoint_events",
        "mutable": base["mutable"] if base is not None else True,
        "history_basis": (
            last_event_id
            if isinstance(last_event_id, str) and last_event_id
            else (base["history_basis"] if base is not None else "")
        ),
    }


def _asset_projection_from_payload(
    asset: AssetPayload,
    *,
    projection_source: str,
    update_count: int,
    checkpoint: AssetCheckpointPayload | None,
    provenance: AssetProvenancePayload | None,
) -> AssetProjectionPayload:
    return {
        "asset_id": asset["asset_id"],
        "uri": asset["uri"],
        "declared_type": asset["declared_type"],
        "kind": asset["kind"],
        "metadata": dict(asset["metadata"]),
        "generated_asset_contract": (
            None
            if asset["generated_asset_contract"] is None
            else dict(asset["generated_asset_contract"])
        ),
        "provenance": provenance,
        "checkpoint": checkpoint,
        "projection_source": projection_source,
        "update_count": update_count,
    }


def _semantic_facets(value: object) -> list[AssetSemanticFacetPayload]:
    entries: list[AssetSemanticFacetPayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        description = _string_field(item.get("description"))
        if name is None or description is None:
            continue
        entries.append({"name": name, "description": description})
    return entries


def _asset_type_profiles(value: object) -> list[AssetTypeProfilePayload]:
    entries: list[AssetTypeProfilePayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        description = _string_field(item.get("description"))
        fd_evaluator = _string_field(item.get("fd_evaluator"))
        fp_gap_description = _string_field(item.get("fp_gap_description"))
        fp_descriptive_framing = _string_field(item.get("fp_descriptive_framing"))
        library_level = _string_field(item.get("library_level"))
        mutable_default = _bool_field(item.get("mutable_default"))
        if (
            name is None
            or description is None
            or fd_evaluator is None
            or fp_gap_description is None
            or fp_descriptive_framing is None
            or library_level is None
            or mutable_default is None
        ):
            continue
        entries.append(
            {
                "name": name,
                "description": description,
                "semantic_facets": _string_list_field(item.get("semantic_facets")),
                "fd_evaluator": fd_evaluator,
                "fp_gap_description": fp_gap_description,
                "fp_descriptive_framing": fp_descriptive_framing,
                "specializes": _string_list_field(item.get("specializes")),
                "library_level": library_level,
                "mutable_default": mutable_default,
                "proof_hints": _string_list_field(item.get("proof_hints")),
                "closure_hints": _string_list_field(item.get("closure_hints")),
            }
        )
    return entries


def _asset_family_descriptors(value: object) -> list[AssetFamilyDescriptorPayload]:
    entries: list[AssetFamilyDescriptorPayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        description = _string_field(item.get("description"))
        lifecycle_role = _string_field(item.get("lifecycle_role"))
        realization_status = _string_field(item.get("realization_status"))
        if (
            name is None
            or description is None
            or lifecycle_role is None
            or realization_status is None
        ):
            continue
        entries.append(
            {
                "name": name,
                "description": description,
                "lifecycle_role": lifecycle_role,
                "representative_asset_types": _string_list_field(
                    item.get("representative_asset_types")
                ),
                "realization_status": realization_status,
            }
        )
    return entries


def _asset_projection(value: object) -> AssetProjectionPayload | None:
    if not isinstance(value, Mapping):
        return None
    asset_id = _string_field(value.get("asset_id"))
    uri = _string_field(value.get("uri"))
    declared_type = _string_field(value.get("declared_type"))
    kind = _string_field(value.get("kind"))
    if asset_id is None or uri is None or declared_type is None or kind is None:
        return None
    payload: AssetProjectionPayload = {
        "asset_id": asset_id,
        "uri": uri,
        "declared_type": declared_type,
        "kind": kind,
        "metadata": _object_dict(value.get("metadata")),
        "generated_asset_contract": (
            _object_dict(value.get("generated_asset_contract"))
            if isinstance(value.get("generated_asset_contract"), Mapping)
            else None
        ),
        "provenance": _provenance_payload(value.get("provenance")),
        "checkpoint": _checkpoint_payload(value.get("checkpoint")),
    }
    projection_source = _string_field(value.get("projection_source"))
    if projection_source is not None:
        payload["projection_source"] = projection_source
    update_count = value.get("update_count")
    if isinstance(update_count, int):
        payload["update_count"] = update_count
    return payload


def _asset_collections(value: object) -> list[AssetCollectionPayload]:
    entries: list[AssetCollectionPayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        assets: list[AssetPayload] = []
        for asset_value in _object_dict_list(item.get("assets")):
            asset = _asset_projection(asset_value)
            if asset is not None:
                assets.append(
                    {
                        "asset_id": asset["asset_id"],
                        "uri": asset["uri"],
                        "declared_type": asset["declared_type"],
                        "kind": asset["kind"],
                        "metadata": dict(asset["metadata"]),
                        "generated_asset_contract": (
                            None
                            if asset["generated_asset_contract"] is None
                            else dict(asset["generated_asset_contract"])
                        ),
                        "provenance": asset["provenance"],
                        "checkpoint": asset["checkpoint"],
                    }
                )
        if name is None:
            continue
        entries.append({"name": name, "assets": assets})
    return entries


def _function_catalog_entries(value: object) -> list[FunctionCatalogEntryPayload]:
    entries: list[FunctionCatalogEntryPayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        intent = _string_field(item.get("intent"))
        backing_graph_function = _string_field(item.get("backing_graph_function"))
        if name is None or intent is None or backing_graph_function is None:
            continue
        entries.append(
            {
                "name": name,
                "intent": intent,
                "inputs": _string_list_field(item.get("inputs")),
                "outputs": _string_list_field(item.get("outputs")),
                "backing_graph_function": backing_graph_function,
            }
        )
    return entries


def _edge_contract_descriptors(value: object) -> list[EdgeContractDescriptorPayload]:
    entries: list[EdgeContractDescriptorPayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        description = _string_field(item.get("description"))
        target_asset_family = _string_field(item.get("target_asset_family"))
        configured_fp_role = _string_field(item.get("configured_fp_role"))
        work_report_contract = _string_field(item.get("work_report_contract"))
        realization_status = _string_field(item.get("realization_status"))
        if (
            name is None
            or description is None
            or target_asset_family is None
            or configured_fp_role is None
            or work_report_contract is None
            or realization_status is None
        ):
            continue
        entries.append(
            {
                "name": name,
                "description": description,
                "source_asset_families": _string_list_field(item.get("source_asset_families")),
                "target_asset_family": target_asset_family,
                "configured_fp_role": configured_fp_role,
                "preflight_fd_layers": _string_list_field(item.get("preflight_fd_layers")),
                "postflight_fd_layers": _string_list_field(item.get("postflight_fd_layers")),
                "work_report_contract": work_report_contract,
                "representative_functions": _string_list_field(
                    item.get("representative_functions")
                ),
                "realization_status": realization_status,
            }
        )
    return entries


def _executive_program_entries(value: object) -> list[ExecutiveProgramEntryPayload]:
    entries: list[ExecutiveProgramEntryPayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        intent = _string_field(item.get("intent"))
        kind = _string_field(item.get("kind"))
        if name is None or intent is None or kind is None:
            continue
        entries.append(
            {
                "name": name,
                "intent": intent,
                "steps": _string_list_field(item.get("steps")),
                "outputs": _string_list_field(item.get("outputs")),
                "kind": kind,
            }
        )
    return entries


def _work_act_descriptors(value: object) -> list[WorkActDescriptorPayload]:
    entries: list[WorkActDescriptorPayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        description = _string_field(item.get("description"))
        mutates_workspace = _bool_field(item.get("mutates_workspace"))
        produces_governed_evidence = _bool_field(item.get("produces_governed_evidence"))
        realization_status = _string_field(item.get("realization_status"))
        if (
            name is None
            or description is None
            or mutates_workspace is None
            or produces_governed_evidence is None
            or realization_status is None
        ):
            continue
        entries.append(
            {
                "name": name,
                "description": description,
                "mutates_workspace": mutates_workspace,
                "produces_governed_evidence": produces_governed_evidence,
                "typical_asset_families": _string_list_field(
                    item.get("typical_asset_families")
                ),
                "realization_status": realization_status,
            }
        )
    return entries


def _job_contract(value: object) -> JobContractPayload | None:
    if not isinstance(value, Mapping):
        return None
    kind = _string_field(value.get("kind"))
    target_id = _string_field(value.get("target_id"))
    if kind is None or target_id is None:
        return None
    return {"kind": kind, "target_id": target_id}


def _jobs(value: object) -> list[JobProjectionPayload]:
    entries: list[JobProjectionPayload] = []
    for item in _object_dict_list(value):
        name = _string_field(item.get("name"))
        if name is None:
            continue
        contracts: list[JobContractPayload] = []
        contracts_value = item.get("contracts")
        if isinstance(contracts_value, list):
            for contract_value in contracts_value:
                contract = _job_contract(contract_value)
                if contract is not None:
                    contracts.append(contract)
        entries.append({"name": name, "contracts": contracts})
    return entries


def _bindings(value: object) -> list[AssetNodeBindingPayload]:
    entries: list[AssetNodeBindingPayload] = []
    for item in _object_dict_list(value):
        node = _string_field(item.get("node"))
        if node is None:
            continue
        entries.append({"node": node, "asset_ids": _string_list_field(item.get("asset_ids"))})
    return entries


def _graph_function_entries(value: object) -> list[GraphFunctionEntryPayload]:
    entries: list[GraphFunctionEntryPayload] = []
    for item in _object_dict_list(value):
        identifier = _string_field(item.get("id"))
        name = _string_field(item.get("name"))
        intent = _string_field(item.get("intent"))
        template_kind = _string_field(item.get("template_kind"))
        if (
            identifier is None
            or name is None
            or intent is None
            or template_kind is None
        ):
            continue
        entry: GraphFunctionEntryPayload = {
            "id": identifier,
            "name": name,
            "intent": intent,
            "template_kind": template_kind,
            "tags": _string_list_field(item.get("tags")),
            "inputs": _string_list_field(item.get("inputs")),
            "outputs": _string_list_field(item.get("outputs")),
            "input_contracts": _graph_function_node_contracts(item.get("input_contracts")),
            "output_contracts": _graph_function_node_contracts(item.get("output_contracts")),
            "environment": _graph_function_environment(item.get("environment")),
            "vectors": _graph_function_vectors(item.get("vectors")),
            "job_names": _string_list_field(item.get("job_names")),
        }
        function_kind = _string_field(item.get("function_kind"))
        if function_kind is not None:
            entry["function_kind"] = function_kind
        plugin_kind = _string_field(item.get("plugin_kind"))
        if plugin_kind is not None:
            entry["plugin_kind"] = plugin_kind
        harness_kind = _string_field(item.get("harness_kind"))
        if harness_kind is not None:
            entry["harness_kind"] = harness_kind
        host_binding_of = _string_field(item.get("host_binding_of"))
        if host_binding_of is not None:
            entry["host_binding_of"] = host_binding_of
        host_binding_kind = _string_field(item.get("host_binding_kind"))
        if host_binding_kind is not None:
            entry["host_binding_kind"] = host_binding_kind
        host_subject_asset = _string_field(item.get("host_subject_asset"))
        if host_subject_asset is not None:
            entry["host_subject_asset"] = host_subject_asset
        host_reviewed_asset = _string_field(item.get("host_reviewed_asset"))
        if host_reviewed_asset is not None:
            entry["host_reviewed_asset"] = host_reviewed_asset
        harness_contract = _opaque_gtl_declaration(item.get("harness_contract"))
        if harness_contract is not None:
            entry["harness_contract"] = harness_contract
        harness_implementation = _opaque_gtl_declaration(item.get("harness_implementation"))
        if harness_implementation is not None:
            entry["harness_implementation"] = harness_implementation
        obligation_ledger = _opaque_gtl_declaration(item.get("obligation_ledger"))
        if obligation_ledger is not None:
            entry["obligation_ledger"] = obligation_ledger
        selection_visible = _bool_field(item.get("selection_visible"))
        if selection_visible is not None:
            entry["selection_visible"] = selection_visible
        entries.append(entry)
    return entries


def _graph_function_node_contracts(value: object) -> list[GraphFunctionNodeContractPayload]:
    entries: list[GraphFunctionNodeContractPayload] = []
    if not isinstance(value, list):
        return entries
    for item in value:
        if not isinstance(item, Mapping):
            continue
        name = _string_field(item.get("name"))
        schema = _string_field(item.get("schema"))
        if name is None or schema is None:
            continue
        entries.append(
            {
                "name": name,
                "schema": schema,
                "asset_surface": _object_dict(item.get("asset_surface")),
            }
        )
    return entries


def _graph_function_environment(value: object) -> GraphFunctionEnvironmentPayload:
    if not isinstance(value, Mapping):
        return {"requires": [], "provides": [], "carries": []}
    return {
        "requires": _string_list_field(value.get("requires")),
        "provides": _string_list_field(value.get("provides")),
        "carries": _string_list_field(value.get("carries")),
    }


def _graph_function_vectors(value: object) -> list[GraphFunctionVectorPayload]:
    entries: list[GraphFunctionVectorPayload] = []
    if not isinstance(value, list):
        return entries
    for item in value:
        if not isinstance(item, Mapping):
            continue
        entry: GraphFunctionVectorPayload = {}
        name = _string_field(item.get("name"))
        if name is not None:
            entry["name"] = name
        source = item.get("source")
        if isinstance(source, list):
            entry["source"] = [part for part in source if isinstance(part, str)]
        target = _string_field(item.get("target"))
        if target is not None:
            entry["target"] = target
        obligation_ledger = _opaque_gtl_declaration(item.get("obligation_ledger"))
        if obligation_ledger is not None:
            entry["obligation_ledger"] = obligation_ledger
        fp_retry_policy = _opaque_gtl_declaration(item.get("fp_retry_policy"))
        if fp_retry_policy is not None:
            entry["fp_retry_policy"] = fp_retry_policy
        entries.append(entry)
    return entries


def _opaque_gtl_declaration(value: object) -> OpaqueGtlDeclarationPayload | None:
    if not isinstance(value, Mapping):
        return None
    return _object_dict(value)


def _operational_capability_family_payload(
    value: object,
) -> OperationalCapabilityFamilyPayload | None:
    if not isinstance(value, Mapping):
        return None
    family = value.get("family")
    field_name = value.get("field_name")
    cue = value.get("cue")
    in_scope = _bool_field(value.get("in_scope"))
    declared_value = value.get("declared_value")
    declared = _bool_field(value.get("declared"))
    primary_edge = value.get("primary_edge")
    resolution_text = value.get("resolution_text")
    state = value.get("state")
    if (
        not isinstance(family, str)
        or not isinstance(field_name, str)
        or not isinstance(cue, str)
        or in_scope is None
        or not isinstance(declared_value, str)
        or declared is None
        or state not in {"declared", "undeclared"}
        or not isinstance(primary_edge, str)
        or not isinstance(resolution_text, str)
    ):
        return None
    return {
        "family": family,
        "field_name": field_name,
        "cue": cue,
        "in_scope": in_scope,
        "declared_value": declared_value,
        "declared": declared,
        "state": state,
        "affected_assets": _string_list_field(value.get("affected_assets")),
        "expected_resolving_edges": _string_list_field(value.get("expected_resolving_edges")),
        "primary_edge": primary_edge,
        "resolution_text": resolution_text,
    }


def _operational_capabilities(value: object) -> OperationalCapabilitiesProjectionPayload:
    if not isinstance(value, Mapping):
        return {
            "projection_kind": "odd_sdlc.operational_capabilities",
            "schema_version": "v1",
            "workspace_root": "",
            "families": {},
        }
    families: dict[str, OperationalCapabilityFamilyPayload] = {}
    raw_families = value.get("families")
    if isinstance(raw_families, Mapping):
        for family_name, family_payload in raw_families.items():
            normalized = _operational_capability_family_payload(family_payload)
            if isinstance(family_name, str) and normalized is not None:
                families[family_name] = normalized
    return {
        "projection_kind": "odd_sdlc.operational_capabilities",
        "schema_version": "v1",
        "workspace_root": str(value.get("workspace_root") or ""),
        "families": families,
    }


def _execution_contract_surface(
    value: object,
) -> ExecutionContractSurfacePayload | None:
    normalized: object = normalize_execution_contract_surface_payload(value)
    if not isinstance(normalized, Mapping):
        return None
    payload: ExecutionContractSurfacePayload = {}
    contract_kind = _string_field(normalized.get("contract_kind"))
    if contract_kind is not None:
        payload["contract_kind"] = contract_kind
    carrier_shape = _string_field(normalized.get("carrier_shape"))
    if carrier_shape is not None:
        payload["carrier_shape"] = carrier_shape
    contract_id = _string_field(normalized.get("contract_id"))
    if contract_id is not None:
        payload["contract_id"] = contract_id
    status = _string_field(normalized.get("status"))
    if status == "drafted":
        payload["status"] = "drafted"
    elif status == "admitted":
        payload["status"] = "admitted"
    elif status == "rejected":
        payload["status"] = "rejected"
    elif status == "superseded":
        payload["status"] = "superseded"
    source_kind = _string_field(normalized.get("source_kind"))
    if source_kind == "operator_request":
        payload["source_kind"] = "operator_request"
    elif source_kind == "ticket_work_item":
        payload["source_kind"] = "ticket_work_item"
    ticket_id = _string_field(normalized.get("ticket_id"))
    if ticket_id is not None:
        payload["ticket_id"] = ticket_id
    ticket_title = _string_field(normalized.get("ticket_title"))
    if ticket_title is not None:
        payload["ticket_title"] = ticket_title
    ticket_status = _string_field(normalized.get("ticket_status"))
    if ticket_status is not None:
        payload["ticket_status"] = ticket_status
    ticket_category = _string_field(normalized.get("ticket_category"))
    if ticket_category is not None:
        payload["ticket_category"] = ticket_category
    change_class = _string_field(normalized.get("change_class"))
    if change_class is not None:
        payload["change_class"] = change_class
    re_entry_point = _string_field(normalized.get("re_entry_point"))
    if re_entry_point is not None:
        payload["re_entry_point"] = re_entry_point
    affected_boundary = _string_field(normalized.get("affected_boundary"))
    if affected_boundary is not None:
        payload["affected_boundary"] = affected_boundary
    superseded_truth = _string_field(normalized.get("superseded_truth"))
    if superseded_truth is not None:
        payload["superseded_truth"] = superseded_truth
    closure_law = _string_field(normalized.get("closure_law"))
    if closure_law is not None:
        payload["closure_law"] = closure_law
    required_direction = _string_field(normalized.get("required_direction"))
    if required_direction is not None:
        payload["required_direction"] = required_direction
    acceptance = _string_field(normalized.get("acceptance"))
    if acceptance is not None:
        payload["acceptance"] = acceptance
    migration_declaration = _string_field(normalized.get("migration_declaration"))
    if migration_declaration is not None:
        payload["migration_declaration"] = migration_declaration
    migration_checklist = _string_field(normalized.get("migration_checklist"))
    if migration_checklist is not None:
        payload["migration_checklist"] = migration_checklist
    register_path = _string_field(normalized.get("register_path"))
    if register_path is not None:
        payload["register_path"] = register_path
    context_path = _string_field(normalized.get("context_path"))
    if context_path is not None:
        payload["context_path"] = context_path
    supersedes_contract_id = _string_field(normalized.get("supersedes_contract_id"))
    if supersedes_contract_id is not None:
        payload["supersedes_contract_id"] = supersedes_contract_id
    superseded_by_contract_id = _string_field(normalized.get("superseded_by_contract_id"))
    if superseded_by_contract_id is not None:
        payload["superseded_by_contract_id"] = superseded_by_contract_id
    carrier_graph_functions = normalized.get("carrier_graph_functions")
    if isinstance(carrier_graph_functions, Mapping):
        derive = _string_field(carrier_graph_functions.get("derive"))
        admit = _string_field(carrier_graph_functions.get("admit"))
        if derive is not None and admit is not None:
            payload["carrier_graph_functions"] = {"derive": derive, "admit": admit}
    evaluation_criteria = _string_list_field(normalized.get("evaluation_criteria"))
    if evaluation_criteria:
        payload["evaluation_criteria"] = evaluation_criteria
    non_closure_conditions = _string_list_field(normalized.get("non_closure_conditions"))
    if non_closure_conditions:
        payload["non_closure_conditions"] = non_closure_conditions
    proof_surface = _string_list_field(normalized.get("proof_surface"))
    if proof_surface:
        payload["proof_surface"] = proof_surface
    errors = _string_list_field(normalized.get("errors"))
    if errors:
        payload["errors"] = errors
    route_contract = _route_contract_payload(normalized.get("route_contract"))
    if route_contract is not None:
        payload["route_contract"] = route_contract
    target_truth = normalized.get("target_truth")
    if isinstance(target_truth, Mapping):
        normalized_scope = _string_field(target_truth.get("normalized_scope"))
        public_target = _string_field(target_truth.get("public_target"))
        until = _string_field(target_truth.get("until"))
        kind = _string_field(target_truth.get("kind"))
        if (
            normalized_scope is not None
            and public_target is not None
            and until is not None
            and kind == "next"
        ):
            next_target: NextExecutionTargetPayload = {
                "normalized_scope": normalized_scope,
                "public_target": public_target,
                "until": until,
                "kind": "next",
            }
            edge_override = _string_field(target_truth.get("edge_override"))
            if edge_override is not None:
                next_target["edge_override"] = edge_override
            route_state = _string_field(target_truth.get("route_state"))
            if route_state is not None:
                next_target["route_state"] = route_state
            binding_source = _string_field(target_truth.get("binding_source"))
            if binding_source is not None:
                next_target["binding_source"] = binding_source
            payload["target_truth"] = next_target
    return payload or None


def _string_field(value: object) -> str | None:
    return value if isinstance(value, str) and value else None


def _bool_field(value: object) -> bool | None:
    return value if isinstance(value, bool) else None


def _string_list_field(value: object) -> list[str]:
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, str) and item]


def _route_contract_payload(value: object) -> WorkItemRouteContractPayload | None:
    if not isinstance(value, Mapping):
        return None
    contract = work_item_route_contract_from_payload(value)
    if contract is None:
        return None
    return {
        "route_kind": contract.route_kind,
        "binding_source": contract.binding_source,
        "ticket_id": contract.ticket_id,
        "change_class": contract.change_class,
        "re_entry_point": contract.re_entry_point,
        "reentry_vector": contract.reentry_vector,
        "reentry_target_asset": contract.reentry_target_asset,
        "scope_binding": contract.scope_binding,
        "operator_target_handle": contract.operator_target_handle,
    }


def _start_target_catalog(value: object) -> list[StartTargetCatalogEntryPayload]:
    entries: list[StartTargetCatalogEntryPayload] = []
    for item in _object_dict_list(value):
        handle = _string_field(item.get("handle"))
        target_id = _string_field(item.get("target_id"))
        graph_function_name = _string_field(item.get("graph_function_name"))
        carrier_class = _string_field(item.get("carrier_class"))
        template_kind = _string_field(item.get("template_kind"))
        execution_binding = _string_field(item.get("execution_binding"))
        start_addressable = _bool_field(item.get("start_addressable"))
        binding_source = _string_field(item.get("binding_source"))
        if (
            handle is None
            or target_id is None
            or graph_function_name is None
            or carrier_class is None
            or template_kind is None
            or execution_binding is None
            or start_addressable is None
            or binding_source is None
        ):
            continue
        entry: StartTargetCatalogEntryPayload = {
            "handle": handle,
            "target_id": target_id,
            "graph_function_name": graph_function_name,
            "carrier_class": carrier_class,
            "template_kind": template_kind,
            "job_names": _string_list_field(item.get("job_names")),
            "execution_binding": execution_binding,
            "start_addressable": start_addressable,
            "inputs": _string_list_field(item.get("inputs")),
            "outputs": _string_list_field(item.get("outputs")),
            "binding_source": binding_source,
        }
        host_binding_of = _string_field(item.get("host_binding_of"))
        if host_binding_of is not None:
            entry["host_binding_of"] = host_binding_of
        host_binding_kind = _string_field(item.get("host_binding_kind"))
        if host_binding_kind is not None:
            entry["host_binding_kind"] = host_binding_kind
        plugin_kind = _string_field(item.get("plugin_kind"))
        if plugin_kind is not None:
            entry["plugin_kind"] = plugin_kind
        entries.append(entry)
    return entries


def _asset_operator_target(value: object) -> AssetOperatorTargetPayload | None:
    if not isinstance(value, Mapping):
        return None
    kind = _string_field(value.get("kind"))
    handle = _string_field(value.get("handle"))
    target_id = _string_field(value.get("target_id"))
    graph_function_name = _string_field(value.get("graph_function_name"))
    carrier_class = _string_field(value.get("carrier_class"))
    if (
        kind != "graph_function"
        or handle is None
        or target_id is None
        or graph_function_name is None
        or carrier_class is None
    ):
        return None
    return {
        "kind": "graph_function",
        "handle": handle,
        "target_id": target_id,
        "graph_function_name": graph_function_name,
        "carrier_class": carrier_class,
    }


def _asset_ownership_index(value: object) -> list[AssetOwnershipIndexEntryPayload]:
    entries: list[AssetOwnershipIndexEntryPayload] = []
    for item in _object_dict_list(value):
        handle = _string_field(item.get("handle"))
        asset_id = _string_field(item.get("asset_id"))
        binding_source = _string_field(item.get("binding_source"))
        operator_target = _asset_operator_target(item.get("operator_target"))
        if (
            handle is None
            or asset_id is None
            or binding_source is None
            or operator_target is None
        ):
            continue
        entry: AssetOwnershipIndexEntryPayload = {
            "handle": handle,
            "asset_id": asset_id,
            "binding_source": binding_source,
            "operator_target": operator_target,
        }
        uri = _string_field(item.get("uri"))
        if uri is not None:
            entry["uri"] = uri
        relative_path = _string_field(item.get("relative_path"))
        if relative_path is not None:
            entry["relative_path"] = relative_path
        path_kind = _string_field(item.get("path_kind"))
        if path_kind is not None:
            entry["path_kind"] = path_kind
        exists = _bool_field(item.get("exists"))
        if exists is not None:
            entry["exists"] = exists
        route_contract = _route_contract_payload(item.get("route_contract"))
        if route_contract is not None:
            entry["route_contract"] = route_contract
        entries.append(entry)
    return entries


def query_functions(app: OddSdlcApp) -> list[FunctionCatalogEntryPayload]:
    return _function_catalog_entries(catalog(app).get("functions"))


def query_jobs(app: OddSdlcApp) -> list[JobProjectionPayload]:
    return _jobs(catalog(app).get("jobs"))


def query_bindings(app: OddSdlcApp) -> list[AssetNodeBindingPayload]:
    return _bindings(catalog(app).get("bindings"))


def query_ambiguity_register(app: OddSdlcApp) -> AmbiguityRegisterReadModel:
    return _object_dict(load_or_build_ambiguity_register(app.config.workspace_root))


def query_requirement_closure_register(app: OddSdlcApp) -> RequirementClosureRegisterReadModel:
    return _object_dict(
        load_requirement_closure_register_read_model(app.config.workspace_root),
    )


def query_domain(app: OddSdlcApp) -> QueryDomainPayload:
    catalog_payload = catalog(app)
    gap_dossier = load_gap_dossier_read_model(app.config.workspace_root, scope="workspace")
    return {
        "query_contract": query_domain_contract(),
        "workspace_root": str(app.config.workspace_root),
        "execution_contract_surface": _execution_contract_surface(
            catalog_payload.get("execution_contract_surface"),
        ),
        "semantic_facets": _semantic_facets(catalog_payload.get("semantic_facets")),
        "asset_types": _asset_type_profiles(catalog_payload.get("asset_types")),
        "asset_families": _asset_family_descriptors(catalog_payload.get("asset_families")),
        "assets": query_assets(app),
        "start_target_catalog": _start_target_catalog(catalog_payload.get("start_target_catalog")),
        "asset_ownership_index": _asset_ownership_index(catalog_payload.get("asset_ownership_index")),
        "operational_capabilities": _operational_capabilities(
            catalog_payload.get("operational_capabilities")
        ),
        "ambiguity_register": query_ambiguity_register(app),
        "requirement_closure_register": query_requirement_closure_register(app),
        "collections": _asset_collections(catalog_payload.get("collections")),
        "functions": _function_catalog_entries(catalog_payload.get("functions")),
        "edge_contracts": _edge_contract_descriptors(catalog_payload.get("edge_contracts")),
        "programs": _executive_program_entries(catalog_payload.get("programs")),
        "work_act_types": _work_act_descriptors(catalog_payload.get("work_act_types")),
        "jobs": _jobs(catalog_payload.get("jobs")),
        "graph_functions": _graph_function_entries(catalog_payload.get("graph_functions")),
        "bindings": _bindings(catalog_payload.get("bindings")),
        "gap_dossier": gap_dossier,
    }
