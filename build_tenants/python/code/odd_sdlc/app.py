# Implements: REQ-F-ODDSDLC-003
# Implements: REQ-F-ODDSDLC-004
# Implements: REQ-F-ODDSDLC-020
# Implements: REQ-F-ODDSDLC-027
"""App-owned bootstrap and runtime surface for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass, field
import json
from pathlib import Path
from typing import Any, Literal

from genesis.binding import Worker
from genesis.cli_adapter import (
    _run_start_until_blocked,
    _run_start_until_converged,
    _run_start_until_converged_supervised,
)
from genesis.events import EventStream
from genesis.identity import RuntimeIdentity
from genesis.install import workspace_bootstrap
from genesis.services import Scope, ScopeSelector, StartIntent, StartTarget, gen_gaps, gen_iterate, gen_start

from .analysis import ensure_workspace_ready
from .asset_types import ASSET_TYPES, SEMANTIC_FACETS
from .ambiguity import load_or_build_ambiguity_register
from .execution_contract import (
    admit_execution_contract_surface,
    bound_execution_start_from_contract,
)
from .function_catalog import FUNCTION_CATALOG
from .gap_dossier import (
    build_gap_dossier_register,
    project_gap_dossier_surface,
    publish_gap_dossier_surfaces,
)
from .gtl_module import module as odd_sdlc_module
from .project_profile import load_or_build_operational_capability_projection
from .program_catalog import PROGRAM_CATALOG
from .software_domain_catalog import ASSET_FAMILIES, EDGE_CONTRACTS, WORK_ACT_TYPES
from .span_analysis import aggregate_edge_gap_truth, canonical_edge_gaps, span_gap_analysis
from .start_targeting import (
    graph_function_entries,
    published_asset_ownership_index,
    published_start_target_catalog,
)
from .traceability import collect_declared_obligation_gaps
from .triage import enrich_gap_snapshot
from .workspace_assets import bootstrap_assets, bootstrap_bindings, bootstrap_input_collection


@dataclass(frozen=True)
class AppConfig:
    workspace_root: Path
    runtime_config: dict[str, Any] = field(default_factory=dict)
    build: str | None = None
    runtime_identity: RuntimeIdentity | None = None
    domain_module: Any | None = None


def _app_module(config: AppConfig):
    return config.domain_module or odd_sdlc_module(config.workspace_root)


def _parse_yaml_config(config_path: Path) -> dict[str, Any]:
    if not config_path.exists():
        return {}
    config: dict[str, Any] = {}
    current_list_key: str | None = None
    for line in config_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            current_list_key = None
            continue
        if current_list_key is not None and stripped.startswith("- "):
            config[current_list_key].append(stripped[2:].strip())
            continue
        current_list_key = None
        if ":" not in stripped:
            continue
        key, _, value = stripped.partition(":")
        key = key.strip()
        value = value.strip()
        if value == "":
            config[key] = []
            current_list_key = key
            continue
        if value.startswith("{") or value.startswith("["):
            try:
                config[key] = json.loads(value)
                continue
            except json.JSONDecodeError:
                pass
        config[key] = value
    return config


def _load_runtime_config(workspace_root: Path) -> dict[str, Any]:
    kernel_config = _parse_yaml_config(workspace_root / ".genesis" / "genesis.yml")
    contract_ref = kernel_config.get("runtime_contract")
    if isinstance(contract_ref, str) and contract_ref.strip():
        contract_path = (workspace_root / contract_ref).resolve()
        if contract_path.exists():
            return _parse_yaml_config(contract_path)
    source_contract_path = workspace_root / ".odd_sdlc" / "release" / "genesis.yml"
    if source_contract_path.exists():
        return _parse_yaml_config(source_contract_path)
    return kernel_config


_SELF_QUERY_BINDING_CONTRACT_KEYS = frozenset(
    {
        "operator_asset_contract",
    }
)


def _asset_binding_contract_invokes_query_domain(value: Any) -> bool:
    contract = value
    if isinstance(contract, str):
        try:
            contract = json.loads(contract)
        except json.JSONDecodeError:
            return False
    if not isinstance(contract, dict):
        return False
    command = contract.get("command")
    if isinstance(command, str):
        return "query-domain" in command.split()
    if isinstance(command, list):
        return any(str(part) == "query-domain" for part in command)
    return False


def _sanitize_runtime_config_for_domain_commands(config: dict[str, Any]) -> dict[str, Any]:
    """
    Drop self-query binding contracts from local odd_sdlc command authority.

    These contracts are published so external callers can resolve odd_sdlc asset
    and operator surfaces. Re-importing them into odd_sdlc's own bootstrap makes
    local domain commands consume their own query surface as runtime authority and
    can recurse through `odd_sdlc query-domain` during binding.
    """
    sanitized = dict(config)
    for key in _SELF_QUERY_BINDING_CONTRACT_KEYS:
        sanitized.pop(key, None)
    if _asset_binding_contract_invokes_query_domain(sanitized.get("asset_binding_contract")):
        sanitized.pop("asset_binding_contract", None)
    return sanitized


def _parse_scope_selector(raw_scope: str) -> ScopeSelector:
    value = (raw_scope or "").strip()
    if value == "workspace":
        return ScopeSelector(kind="workspace")
    prefix = "work_key:"
    if value.startswith(prefix):
        work_key = value[len(prefix):].strip()
        if work_key:
            return ScopeSelector(kind="work_key", work_key=work_key)
    raise ValueError("scope must be 'workspace' or 'work_key:<id>'")


def _declared_obligation_specs(
    app: "OddSdlcApp",
    *,
    edge_names: list[str] | None = None,
) -> list[tuple[str, dict[str, Any] | Any]]:
    selected_edges = set(edge_names or ())
    declarations: list[tuple[str, dict[str, Any] | Any]] = []
    for function in app.scope().module.graph_functions:
        graph = function.template.graph
        if graph is None:
            continue
        for vector in graph.vectors:
            if selected_edges and vector.name not in selected_edges:
                continue
            declaration = vector.declarations.get("obligation_ledger")
            if declaration is None:
                continue
            declarations.append((vector.name, declaration))
    return declarations


def _published_operational_capabilities(workspace_root: Path) -> dict[str, object]:
    return load_or_build_operational_capability_projection(workspace_root)


def _capability_gap_entries(
    workspace_root: Path,
    *,
    edge_names: list[str] | None = None,
) -> list[dict[str, Any]]:
    capability_projection = _published_operational_capabilities(workspace_root)
    capability_families = capability_projection.get("families")
    if not isinstance(capability_families, dict):
        return []
    selected_edges = set(edge_names or ())
    entries: list[dict[str, Any]] = []
    for family in capability_families.values():
        if not isinstance(family, dict):
            continue
        if not bool(family.get("in_scope")) or bool(family.get("declared")):
            continue
        family_edges = [
            str(edge_name)
            for edge_name in family.get("expected_resolving_edges", ())
            if str(edge_name)
        ]
        if selected_edges and not any(edge_name in selected_edges for edge_name in family_edges):
            continue
        target_edge = next(
            (edge_name for edge_name in family_edges if edge_name in selected_edges),
            str(family.get("primary_edge") or ""),
        )
        if not target_edge:
            continue
        family_name = str(family.get("family") or "")
        field_name = str(family.get("field_name") or "")
        entries.append(
            {
                "edge": target_edge,
                "delta": 1.0,
                "failing": [f"missing_{family_name}_capability"],
                "passing": [],
                "delta_summary": (
                    f"operational capability `{field_name}` is not declared; "
                    f"`{target_edge}` remains gated until the governing capability is published"
                ),
                "environment_ready": True,
                "operational_capability": dict(family),
            }
        )
    return entries


def _augment_raw_gap_payload_with_capability_truth(
    workspace_root: Path,
    raw_gap_payload: dict[str, Any],
    *,
    edge_names: list[str] | None = None,
) -> dict[str, Any]:
    augmented_gaps = [
        dict(gap)
        for gap in raw_gap_payload.get("gaps", ())
        if isinstance(gap, dict)
    ]
    seen_edges = {str(gap.get("edge") or "") for gap in augmented_gaps}
    for entry in _capability_gap_entries(workspace_root, edge_names=edge_names):
        edge_name = str(entry.get("edge") or "")
        if edge_name in seen_edges:
            continue
        seen_edges.add(edge_name)
        augmented_gaps.append(entry)
    return {
        **raw_gap_payload,
        "gaps": augmented_gaps,
        "total_delta": sum(float(gap.get("delta") or 0.0) for gap in augmented_gaps),
        "converged": not augmented_gaps,
    }


@dataclass
class OddSdlcApp:
    config: AppConfig
    stream: EventStream
    worker: Worker | None = None

    def scope(self, *, selector: ScopeSelector | None = None) -> Scope:
        return Scope(
            module=_app_module(self.config),
            workspace_root=self.config.workspace_root,
            selector=selector or ScopeSelector(kind="workspace"),
            build=self.config.build,
            worker=self.worker,
            runtime_identity=self.config.runtime_identity,
            runtime_config=self.config.runtime_config,
            active_workflow_path=self.config.runtime_config.get("active_workflow"),
            workflow_root=self.config.runtime_config.get("workflow_root"),
        )


def bootstrap(
    *,
    workspace_root: str | Path = ".",
    runtime_config: dict[str, Any] | None = None,
    build: str | None = None,
    runtime_identity: RuntimeIdentity | None = None,
    domain_module: Any | None = None,
) -> AppConfig:
    workspace_root = Path(workspace_root).resolve()
    bound_domain_module = domain_module or odd_sdlc_module(workspace_root)
    loaded_runtime_config = _sanitize_runtime_config_for_domain_commands(
        _load_runtime_config(workspace_root)
    )
    return AppConfig(
        workspace_root=workspace_root,
        runtime_config={
            **loaded_runtime_config,
            "domain_package": "odd_sdlc",
            **dict(runtime_config or {}),
        },
        build=build,
        runtime_identity=runtime_identity,
        domain_module=bound_domain_module,
    )


def initialize(config: AppConfig, *, worker: Worker | None = None) -> OddSdlcApp:
    stream = workspace_bootstrap(config.workspace_root)
    return OddSdlcApp(config=config, stream=stream, worker=worker)


def active_programs(app: OddSdlcApp) -> list[dict[str, Any]]:
    module = _app_module(app.config)
    active_executive_programs = set(module.metadata.get("executive_graph_functions", ()))
    return [
        entry.to_dict()
        for entry in PROGRAM_CATALOG
        if entry.name in active_executive_programs
    ]


def catalog(app: OddSdlcApp) -> dict:
    module = _app_module(app.config)
    workspace_root = app.config.workspace_root
    active_function_catalog = list(module.metadata.get("function_catalog", FUNCTION_CATALOG))
    assets = [asset.to_dict() for asset in bootstrap_assets(workspace_root)]
    graph_function_payload = graph_function_entries(module)
    start_target_catalog = published_start_target_catalog(module)
    asset_ownership_index = published_asset_ownership_index(workspace_root, module)
    return {
        "workspace_root": str(workspace_root),
        "semantic_facets": [facet.to_dict() for facet in SEMANTIC_FACETS.values()],
        "asset_types": [profile.to_dict() for profile in ASSET_TYPES.values()],
        "asset_families": [descriptor.to_dict() for descriptor in ASSET_FAMILIES],
        "work_act_types": [descriptor.to_dict() for descriptor in WORK_ACT_TYPES],
        "assets": assets,
        "operational_capabilities": _published_operational_capabilities(workspace_root),
        "ambiguity_register": load_or_build_ambiguity_register(workspace_root),
        "collections": [bootstrap_input_collection(workspace_root).to_dict()],
        "bindings": [binding.to_dict() for binding in bootstrap_bindings(workspace_root)],
        "functions": [
            entry.to_dict() if hasattr(entry, "to_dict") else entry
            for entry in active_function_catalog
        ],
        "edge_contracts": [descriptor.to_dict() for descriptor in EDGE_CONTRACTS],
        "programs": active_programs(app),
        "graph_functions": graph_function_payload,
        "start_target_catalog": start_target_catalog,
        "asset_ownership_index": asset_ownership_index,
        "jobs": [
            {
                "name": job.name,
                "contracts": [
                    {
                        "kind": contract.kind,
                        "target_id": contract.target_id,
                    }
                    for contract in job.contracts
                ],
            }
            for job in module.jobs
        ],
    }


def gaps(
    app: OddSdlcApp,
    *,
    scope: str = "workspace",
    from_edge: str | None = None,
    to_edge: str | None = None,
    zoom: str = "combined",
    include_dependent: bool = True,
) -> dict:
    selector = _parse_scope_selector(scope)
    if from_edge is not None or to_edge is not None:
        if not from_edge or not to_edge:
            raise ValueError("span gap analysis requires both from_edge and to_edge")
        return span_gap_analysis(
            app,
            scope=scope,
            from_edge=from_edge,
            to_edge=to_edge,
            zoom=zoom,
            include_dependent=include_dependent,
        )
    return _build_gap_surface(app, selector=selector, publish=True)


def gap_snapshot(app: OddSdlcApp) -> dict:
    return _build_gap_surface(app, selector=ScopeSelector(kind="workspace"), publish=False)


def _build_gap_surface(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector,
    publish: bool,
) -> dict[str, Any]:
    resolved_scope = app.scope(selector=selector)
    raw_payload = _augment_raw_gap_payload_with_capability_truth(
        app.config.workspace_root,
        gen_gaps(resolved_scope, app.stream),
    )
    payload = enrich_gap_snapshot(
        workspace_root=app.config.workspace_root,
        stream=app.stream,
        workflow_version=resolved_scope.workflow_version,
        raw_gap_payload=raw_payload,
        runtime_config=app.config.runtime_config,
        publish=publish,
    )
    raw_graph_gaps = [
        dict(gap)
        for gap in payload.get("gaps", ())
        if isinstance(gap, dict)
    ]
    declared_obligation_ledgers = collect_declared_obligation_gaps(
        app.config.workspace_root,
        _declared_obligation_specs(app),
    )
    canonical_gaps = canonical_edge_gaps(
        edge_names=[entry[0] for entry in _declared_obligation_specs(app)],
        raw_graph_gaps=raw_graph_gaps,
        ledger_gaps=declared_obligation_ledgers,
    )
    summary = aggregate_edge_gap_truth(canonical_gaps)
    payload["gaps"] = canonical_gaps
    payload["graph_total_delta"] = summary["graph_total_delta"]
    payload["direct_graph_delta"] = summary["direct_graph_delta"]
    payload["carry_delta"] = summary["carry_delta"]
    payload["fulfillment_delta"] = summary["fulfillment_delta"]
    payload["combined_delta"] = summary["combined_delta"]
    payload["total_delta"] = summary["total_delta"]
    payload["declared_obligation_gap_count"] = summary["declared_obligation_gap_count"]
    payload["graph_edge_gap_count"] = summary["graph_edge_gap_count"]
    payload["mixed_truth_classes"] = summary["mixed_truth_classes"]
    payload["graph_converged"] = summary["graph_converged"]
    payload["carry_converged"] = summary["carry_converged"]
    payload["fulfillment_converged"] = summary["fulfillment_converged"]
    payload["declared_carry_converged"] = summary["declared_carry_converged"]
    payload["declared_fulfillment_converged"] = summary["declared_fulfillment_converged"]
    payload["graph_gap_converged"] = summary["graph_gap_converged"]
    payload["converged"] = summary["converged"]
    dossier_register = build_gap_dossier_register(
        app.config.workspace_root,
        gap_payload=payload,
        summary=summary,
    )
    if publish:
        publish_gap_dossier_surfaces(
            app.config.workspace_root,
            dossier_register=dossier_register,
        )
    return project_gap_dossier_surface(
        app.config.workspace_root,
        gap_payload=payload,
        dossier_register=dossier_register,
    )


def iterate(app: OddSdlcApp, *, scope: str = "workspace") -> dict:
    return gen_iterate(app.scope(selector=_parse_scope_selector(scope)), app.stream)


def start(
    app: OddSdlcApp,
    *,
    scope: str,
    target: str,
    until: Literal["first_traversal", "blocked", "converged"],
    fh_mode: Literal["direct", "human-proxy"] = "direct",
    root_mode: Literal["direct", "supervised"] = "direct",
) -> dict:
    ensure_workspace_ready(app.config.workspace_root)
    selector = _parse_scope_selector(scope)
    resolved_scope = app.scope(selector=selector)
    execution_contract = admit_execution_contract_surface(
        workspace_root=app.config.workspace_root,
        module=resolved_scope.module,
        stream=app.stream,
        workflow_version=resolved_scope.workflow_version,
        work_key=resolved_scope.work_key,
        run_id=resolved_scope.run_id,
        normalized_scope=scope,
        raw_target=target,
        until=until,
    )
    bound_start = bound_execution_start_from_contract(
        scope=resolved_scope,
        execution_contract=execution_contract,
    )
    resolved_target = bound_start.target
    resolved_scope = bound_start.scope
    runtime_config = dict(resolved_scope.runtime_config)
    intent = StartIntent(scope=resolved_scope, target=resolved_target, until=until)

    if until != "converged" and fh_mode != "direct":
        raise ValueError("fh_mode is only lawful when until='converged'")
    if until != "converged" and root_mode != "direct":
        raise ValueError("root_mode is only lawful when until='converged'")

    if until == "converged":
        if root_mode == "supervised":
            result = _run_start_until_converged_supervised(
                intent,
                app.stream,
                workspace=app.config.workspace_root,
                config=runtime_config,
                fh_mode=fh_mode,
            )
        else:
            result = _run_start_until_converged(
                intent,
                app.stream,
                workspace=app.config.workspace_root,
                config=runtime_config,
                fh_mode=fh_mode,
            )
        result["root_mode"] = root_mode
        return result

    if until == "blocked":
        result = _run_start_until_blocked(intent, app.stream)
    else:
        result = gen_start(intent, app.stream)
    result["fh_mode"] = fh_mode
    result["root_mode"] = root_mode
    return result
