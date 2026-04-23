# Implements: REQ-F-ODDSDLC-003
# Implements: REQ-F-ODDSDLC-004
# Implements: REQ-F-ODDSDLC-020
# Implements: REQ-F-ODDSDLC-027
"""App-owned bootstrap and runtime surface for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass, field
import json
from pathlib import Path
from typing import Literal, Mapping, TypeGuard, cast

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
from gtl.module_model import Module

from .analysis import ensure_workspace_ready, refresh_analysis
from .asset_types import ASSET_TYPES, SEMANTIC_FACETS
from .ambiguity import load_or_build_ambiguity_register
from .domain_model import ExecutiveProgramEntryPayload
from .execution_contract import (
    BoundExecutionStart,
    admit_bound_execution_start,
    load_admitted_execution_contract_projection,
)
from .function_catalog import FUNCTION_CATALOG
from .gap_dossier import (
    PublicNextStartBlock,
    PublicNextStartDirective,
    build_gap_dossier_register,
    load_gap_dossier_read_model,
    PendingConstitutionalStartGate,
    project_public_next_start_resolution,
    project_gap_dossier_input,
    project_gap_dossier_surface,
    publish_gap_dossier_surfaces,
)
from .gtl_module import module as odd_sdlc_module
from .public_start import (
    PublicStartDispatchRequired,
    PublicStartAdmissionDirective,
    PublicStartHumanGateRequired,
    PublicStartRepublishAndContinue,
    PublicStartReturn,
    emit_public_start_human_proxy_approval,
    project_public_start_admission_for_explicit,
    project_public_start_admission_for_next,
    project_public_start_dispatch_outcome,
    project_public_start_gen_start_outcome,
    resolve_public_start_result_policy,
)
from .project_profile import load_or_build_operational_capability_projection
from .program_catalog import PROGRAM_CATALOG
from .public_start_contract import (
    GapDossierReadModel,
    PendingConstitutionalStartResult,
    PublicStartBlockedPayload,
    PublicStartResultPayload,
)
from .runtime_contract import query_assets_binding_contract
from .software_domain_catalog import ASSET_FAMILIES, EDGE_CONTRACTS, WORK_ACT_TYPES
from .span_analysis import (
    aggregate_edge_gap_truth,
    capability_gap_entries,
    canonical_edge_gaps,
    declared_obligation_specs,
    parse_gap_scope_selector,
    project_declared_obligation_gap_rows,
    project_raw_graph_gap_rows,
    span_gap_analysis,
)
from .start_targeting import (
    graph_function_entries,
    published_asset_ownership_index,
    published_start_target_catalog,
)
from .requirement_closure import collect_declared_obligation_gaps
from .runtime_effects import publish_runtime_event
from .runtime_event_contract import admit_runtime_event_payload
from .triage import enrich_gap_snapshot
from .workspace_assets import bootstrap_assets, bootstrap_bindings, bootstrap_input_collection


SOURCE_CODE_ROOT = Path(__file__).resolve().parents[1]
ABIOGENESIS_SOURCE_CODE_ROOT = (
    Path(__file__).resolve().parents[5]
    / "abiogenesis"
    / "build_tenants"
    / "abiogenesis"
    / "python"
    / "code"
)


RuntimeConfig = dict[str, object]


@dataclass(frozen=True)
class AppConfig:
    workspace_root: Path
    runtime_config: RuntimeConfig = field(default_factory=dict)
    build: str | None = None
    runtime_identity: RuntimeIdentity | None = None
    domain_module: Module | None = None


def _app_module(config: AppConfig) -> Module:
    return config.domain_module or odd_sdlc_module(config.workspace_root)


def _parse_yaml_config(config_path: Path) -> RuntimeConfig:
    if not config_path.exists():
        return {}
    config: RuntimeConfig = {}
    current_list_key: str | None = None
    for line in config_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            current_list_key = None
            continue
        if current_list_key is not None and stripped.startswith("- "):
            current_value = config.get(current_list_key)
            if isinstance(current_value, list):
                current_value.append(stripped[2:].strip())
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


def _load_runtime_config(workspace_root: Path) -> RuntimeConfig:
    kernel_config = _parse_yaml_config(workspace_root / ".genesis" / "genesis.yml")
    contract_ref = kernel_config.get("runtime_contract")
    if isinstance(contract_ref, str) and contract_ref.strip():
        contract_path = (workspace_root / contract_ref).resolve()
        if contract_path.exists():
            return _parse_yaml_config(contract_path)
    return kernel_config


_SELF_QUERY_BINDING_CONTRACT_KEYS = frozenset(
    {
        "operator_asset_contract",
    }
)


def _asset_binding_contract_invokes_query_domain(value: object) -> bool:
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


def _sanitize_runtime_config_for_domain_commands(
    config: Mapping[str, object],
) -> RuntimeConfig:
    """
    Drop self-query binding contracts from local odd_sdlc command authority.

    These contracts are published so external callers can resolve odd_sdlc asset
    and operator surfaces. Re-importing them into odd_sdlc's own bootstrap makes
    local domain commands consume their own query surface as runtime authority and
    can recurse through `odd_sdlc query-domain` during binding.
    """
    sanitized: RuntimeConfig = {str(key): value for key, value in config.items()}
    for key in _SELF_QUERY_BINDING_CONTRACT_KEYS:
        sanitized.pop(key, None)
    if _asset_binding_contract_invokes_query_domain(sanitized.get("asset_binding_contract")):
        sanitized.pop("asset_binding_contract", None)
    return sanitized


def _runtime_config_string(config: Mapping[str, object], key: str) -> str | None:
    value = config.get(key)
    if isinstance(value, str) and value.strip():
        return value
    return None


def _published_operational_capabilities(workspace_root: Path) -> dict[str, object]:
    payload = load_or_build_operational_capability_projection(workspace_root)
    if not isinstance(payload, Mapping):
        raise RuntimeError("operational capability projection returned a non-mapping payload")
    return {str(key): value for key, value in payload.items()}


def _mapping_result(payload: object, *, context: str) -> dict[str, object]:
    if not isinstance(payload, Mapping):
        raise RuntimeError(f"{context} returned a non-mapping payload")
    return {str(key): value for key, value in payload.items()}


def _augment_raw_gap_payload_with_capability_truth(
    workspace_root: Path,
    raw_gap_payload: dict[str, object],
    *,
    edge_names: list[str] | None = None,
) -> dict[str, object]:
    raw_gaps = raw_gap_payload.get("gaps")
    gap_rows = raw_gaps if isinstance(raw_gaps, (list, tuple)) else ()
    augmented_gaps = [
        dict(gap)
        for gap in gap_rows
        if isinstance(gap, dict)
    ]
    seen_edges = {str(gap.get("edge") or "") for gap in augmented_gaps}
    for entry in capability_gap_entries(workspace_root, edge_names=edge_names):
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
            active_workflow_path=_runtime_config_string(
                self.config.runtime_config,
                "active_workflow",
            ),
            workflow_root=_runtime_config_string(
                self.config.runtime_config,
                "workflow_root",
            ),
        )


def bootstrap(
    *,
    workspace_root: str | Path = ".",
    runtime_config: Mapping[str, object] | None = None,
    build: str | None = None,
    runtime_identity: RuntimeIdentity | None = None,
    domain_module: Module | None = None,
) -> AppConfig:
    workspace_root = Path(workspace_root).resolve()
    bound_domain_module = domain_module or odd_sdlc_module(workspace_root)
    loaded_runtime_config = _load_runtime_config(workspace_root)
    merged_runtime_config = _sanitize_runtime_config_for_domain_commands(
        {
            **loaded_runtime_config,
            "domain_package": "odd_sdlc",
            **dict(runtime_config or {}),
        }
    )
    if not merged_runtime_config.get("asset_binding_contract"):
        merged_runtime_config["asset_binding_contract"] = _mapping_result(
            query_assets_binding_contract(),
            context="query_assets_binding_contract",
        )
    if not merged_runtime_config.get("pythonpath"):
        merged_runtime_config["pythonpath"] = [
            str(ABIOGENESIS_SOURCE_CODE_ROOT),
            str(SOURCE_CODE_ROOT),
        ]
    return AppConfig(
        workspace_root=workspace_root,
        runtime_config=merged_runtime_config,
        build=build,
        runtime_identity=runtime_identity,
        domain_module=bound_domain_module,
    )


def initialize(config: AppConfig, *, worker: Worker | None = None) -> OddSdlcApp:
    stream = workspace_bootstrap(config.workspace_root)
    return OddSdlcApp(config=config, stream=stream, worker=worker)


def active_programs(app: OddSdlcApp) -> list[ExecutiveProgramEntryPayload]:
    module = _app_module(app.config)
    active_executive_programs = set(module.metadata.get("executive_graph_functions", ()))
    return [
        entry.to_dict()
        for entry in PROGRAM_CATALOG
        if entry.name in active_executive_programs
    ]


def catalog(app: OddSdlcApp) -> dict[str, object]:
    module = _app_module(app.config)
    workspace_root = app.config.workspace_root
    active_function_catalog = list(module.metadata.get("function_catalog", FUNCTION_CATALOG))
    assets = [asset.to_dict() for asset in bootstrap_assets(workspace_root)]
    graph_function_payload = graph_function_entries(module)
    start_target_catalog = published_start_target_catalog(module)
    asset_ownership_index = published_asset_ownership_index(workspace_root, module)
    execution_contract = load_admitted_execution_contract_projection(workspace_root)
    return {
        "workspace_root": str(workspace_root),
        "execution_contract_surface": (
            execution_contract.to_dict() if execution_contract is not None else None
        ),
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
) -> dict[str, object] | GapDossierReadModel:
    selector = parse_gap_scope_selector(scope)
    if from_edge is not None or to_edge is not None:
        if not from_edge or not to_edge:
            raise ValueError("span gap analysis requires both from_edge and to_edge")
        return _mapping_result(
            span_gap_analysis(
                app,
                scope=scope,
                from_edge=from_edge,
                to_edge=to_edge,
                zoom=zoom,
                include_dependent=include_dependent,
            ),
            context="span_gap_analysis",
        )
    return _build_gap_surface(app, selector=selector, publish=True)


def gap_snapshot(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector | None = None,
) -> GapDossierReadModel:
    return _build_gap_surface(
        app,
        selector=selector or ScopeSelector(kind="workspace"),
        publish=False,
    )


def _build_gap_surface(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector,
    publish: bool,
) -> GapDossierReadModel:
    execution_contract = load_admitted_execution_contract_projection(app.config.workspace_root)
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
        declared_obligation_specs(app),
    )
    canonical_gaps = canonical_edge_gaps(
        edge_names=[entry[0] for entry in declared_obligation_specs(app)],
        raw_graph_gaps=project_raw_graph_gap_rows(raw_graph_gaps),
        ledger_gaps=project_declared_obligation_gap_rows(declared_obligation_ledgers),
    )
    summary = aggregate_edge_gap_truth(canonical_gaps)
    gap_input = project_gap_dossier_input(
        gap_payload=payload,
        canonical_gaps=canonical_gaps,
        summary=summary,
    )
    payload["gaps"] = [gap.to_dict() for gap in canonical_gaps]
    payload["graph_total_delta"] = summary.graph_total_delta
    payload["direct_graph_delta"] = summary.direct_graph_delta
    payload["carry_delta"] = summary.carry_delta
    payload["fulfillment_delta"] = summary.fulfillment_delta
    payload["combined_delta"] = summary.combined_delta
    payload["total_delta"] = summary.total_delta
    payload["declared_obligation_gap_count"] = summary.declared_obligation_gap_count
    payload["graph_edge_gap_count"] = summary.graph_edge_gap_count
    payload["mixed_truth_classes"] = summary.mixed_truth_classes
    payload["graph_converged"] = summary.graph_converged
    payload["carry_converged"] = summary.carry_converged
    payload["fulfillment_converged"] = summary.fulfillment_converged
    payload["declared_carry_converged"] = summary.declared_carry_converged
    payload["declared_fulfillment_converged"] = summary.declared_fulfillment_converged
    payload["graph_gap_converged"] = summary.graph_gap_converged
    payload["converged"] = summary.converged
    dossier_register = build_gap_dossier_register(
        app.config.workspace_root,
        gap_input=gap_input,
        execution_contract=execution_contract,
    )
    if publish:
        publish_gap_dossier_surfaces(
            app.config.workspace_root,
            dossier_register=dossier_register,
        )
    return project_gap_dossier_surface(
        app.config.workspace_root,
        gap_input=gap_input,
        dossier_register=dossier_register,
        published=publish,
    )


def iterate(app: OddSdlcApp, *, scope: str = "workspace") -> dict[str, object]:
    return _mapping_result(
        gen_iterate(app.scope(selector=parse_gap_scope_selector(scope)), app.stream),
        context="gen_iterate",
    )


def _publish_pending_constitutional_start_gate(
    app: OddSdlcApp,
    *,
    gate: PendingConstitutionalStartGate,
    workflow_version: str,
    work_key: str | None,
    run_id: str | None,
) -> None:
    publish_runtime_event(
        stream=app.stream,
        event_type="fh_gate_pending",
        data=admit_runtime_event_payload(
            event_type="fh_gate_pending",
            data=gate.fh_gate_payload(),
        ),
        workflow_version=workflow_version,
        work_key=work_key,
        run_id=run_id,
        aggregate_type="edge_triage",
        aggregate_id=gate.edge,
        causation_event_id=gate.constitutional_event_id,
    )


def _apply_pending_constitutional_human_proxy(
    app: OddSdlcApp,
    *,
    edge: str,
    proposal_id: str,
) -> dict[str, object]:
    from .homeostatic_loop import apply_constitutional_proposal

    result = apply_constitutional_proposal(
        app.config.workspace_root,
        edge=edge,
        proposal_id=proposal_id,
        actor="human-proxy",
    )
    if not isinstance(result, Mapping):
        raise RuntimeError("apply_constitutional_proposal returned a non-mapping result")
    return {str(key): value for key, value in result.items()}


def _attach_public_start_block_metadata(
    result: PublicStartBlockedPayload,
    *,
    public_target: str,
    fh_mode: str,
    root_mode: str,
) -> PublicStartBlockedPayload:
    result["target"] = public_target
    if public_target != "next":
        result["resolved_target"] = public_target
    fh_mode_literal: Literal["direct", "human-proxy"] | None = None
    if fh_mode in {"direct", "human-proxy"}:
        fh_mode_literal = cast(Literal["direct", "human-proxy"], fh_mode)
    if fh_mode_literal is not None:
        result["fh_mode"] = fh_mode_literal
    root_mode_literal: Literal["direct", "supervised"] | None = None
    if root_mode in {"direct", "supervised"}:
        root_mode_literal = cast(Literal["direct", "supervised"], root_mode)
    if root_mode_literal is not None:
        result["root_mode"] = root_mode_literal
    return result


def _is_pending_constitutional_start_result(
    result: PublicStartBlockedPayload,
) -> TypeGuard[PendingConstitutionalStartResult]:
    return (
        result["blocking_reason"] == "fh_gate"
        and "constitutional_proposal" in result
        and "fh_gate" in result
    )


def _attach_public_next_result_metadata(
    result: dict[str, object],
    *,
    public_target: str = "next",
    resolved_raw_target: str | None = None,
    next_edge_override: str | None = None,
    fh_mode: str,
    root_mode: str,
) -> dict[str, object]:
    result["target"] = public_target
    if resolved_raw_target and resolved_raw_target != "next":
        result["resolved_target"] = resolved_raw_target
    elif next_edge_override:
        result["resolved_edge"] = next_edge_override
    result["fh_mode"] = fh_mode
    result["root_mode"] = root_mode
    return result


def publish_gap_surface(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector,
) -> GapDossierReadModel:
    return _build_gap_surface(app, selector=selector, publish=True)


def republish_gap_surface(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector,
    stage: str,
) -> GapDossierReadModel:
    refresh_analysis(app.config.workspace_root, stage=stage)
    return publish_gap_surface(app, selector=selector)


def _public_next_gap_surface(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector,
) -> GapDossierReadModel:
    return load_gap_dossier_read_model(app.config.workspace_root, scope=selector)


def _resolve_public_start_admission(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector,
    target: str,
    normalized_scope: str,
    until: str,
    fh_mode: str,
    root_mode: str,
) -> tuple[
    PublicStartAdmissionDirective | None,
    BoundExecutionStart | None,
    PublicStartBlockedPayload | None,
]:
    resolved_scope = app.scope(selector=selector)
    gap_surface = _public_next_gap_surface(app, selector=selector)
    head_resolution = project_public_next_start_resolution(gap_surface)
    value = (target or "").strip()
    if value == "next":
        admission_resolution = project_public_start_admission_for_next(head_resolution)
    else:
        admission_resolution = project_public_start_admission_for_explicit(
            raw_target=value,
            head_resolution=head_resolution,
        )

    if isinstance(admission_resolution, PendingConstitutionalStartGate):
        _publish_pending_constitutional_start_gate(
            app,
            gate=admission_resolution,
            workflow_version=resolved_scope.workflow_version,
            work_key=resolved_scope.work_key,
            run_id=resolved_scope.run_id,
        )
        blocked_result = admission_resolution.to_start_result()
        return None, None, _attach_public_start_block_metadata(
            blocked_result,
            public_target=value,
            fh_mode=fh_mode,
            root_mode=root_mode,
        )

    if isinstance(admission_resolution, PublicNextStartBlock):
        return None, None, _attach_public_start_block_metadata(
            admission_resolution.to_start_result(),
            public_target=value,
            fh_mode=fh_mode,
            root_mode=root_mode,
        )

    bound_start = admit_bound_execution_start(
        scope=resolved_scope,
        workspace_root=app.config.workspace_root,
        module=resolved_scope.module,
        stream=app.stream,
        workflow_version=resolved_scope.workflow_version,
        work_key=resolved_scope.work_key,
        run_id=resolved_scope.run_id,
        normalized_scope=normalized_scope,
        raw_target=admission_resolution.raw_target,
        until=until,
        next_edge_override=admission_resolution.edge_override,
        next_route_state=admission_resolution.route_state,
        next_binding_source=admission_resolution.binding_source,
    )
    return admission_resolution, bound_start, None


def _resolve_public_next_iteration(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector,
    normalized_scope: str,
    until: str,
    fh_mode: str,
    root_mode: str,
) -> tuple[
    PublicNextStartDirective | None,
    BoundExecutionStart | None,
    PublicStartBlockedPayload | None,
]:
    directive, bound_start, blocked_result = _resolve_public_start_admission(
        app,
        selector=selector,
        target="next",
        normalized_scope=normalized_scope,
        until=until,
        fh_mode=fh_mode,
        root_mode=root_mode,
    )
    if blocked_result is not None:
        return None, None, blocked_result
    if directive is None or not isinstance(directive, PublicStartAdmissionDirective):
        raise RuntimeError("public next start admission failed to produce an admitted directive")
    if directive.route_state is None:
        raise RuntimeError("public next start admission directive missing typed route_state")
    return PublicNextStartDirective(
        edge=str(directive.edge_override or ""),
        route_state=directive.route_state,
        raw_target=directive.raw_target,
        edge_override=directive.edge_override,
        binding_source=directive.binding_source or "",
        triage_artifact_path=directive.triage_artifact_path,
        gap_dossier_register_path=directive.gap_dossier_register_path,
        gap_dossier_context_path=directive.gap_dossier_context_path,
    ), bound_start, None


def _run_public_next_start(
    app: OddSdlcApp,
    *,
    selector: ScopeSelector,
    normalized_scope: str,
    until: Literal["first_traversal", "blocked", "converged"],
    fh_mode: Literal["direct", "human-proxy"],
    root_mode: Literal["direct", "supervised"],
) -> dict[str, object] | PublicStartResultPayload:
    from genesis.dispatch_runtime import auto_dispatch_from_result
    from genesis.proof_hold import project_proof_hold

    max_iterations = 50
    auto_applied_constitutional_proposals: set[str] = set()
    result: dict[str, object] = {}

    for _ in range(max_iterations):
        directive, bound_start, blocked_result = _resolve_public_next_iteration(
            app,
            selector=selector,
            normalized_scope=normalized_scope,
            until=until,
            fh_mode=fh_mode,
            root_mode=root_mode,
        )
        if blocked_result is not None:
            if fh_mode == "human-proxy" and _is_pending_constitutional_start_result(blocked_result):
                proposal = blocked_result["constitutional_proposal"]
                edge = blocked_result["edge"].strip()
                proposal_id = proposal["proposal_id"].strip()
                if edge and proposal_id:
                    if proposal_id in auto_applied_constitutional_proposals:
                        blocked_result["human_proxy_error"] = (
                            "constitutional proposal remained pending after human-proxy application"
                        )
                        return blocked_result
                    auto_applied_constitutional_proposals.add(proposal_id)
                    _apply_pending_constitutional_human_proxy(
                        app,
                        edge=edge,
                        proposal_id=proposal_id,
                    )
                    republish_gap_surface(
                        app,
                        selector=selector,
                        stage="public_start_next_human_proxy",
                    )
                    continue
            return blocked_result
        if directive is None or bound_start is None:
            raise RuntimeError("public next start resolution failed to produce an admitted basis")

        intent = StartIntent(scope=bound_start.scope, target=bound_start.target, until=until)
        result = gen_start(intent, app.stream)
        _attach_public_next_result_metadata(
            result,
            resolved_raw_target=directive.raw_target,
            next_edge_override=directive.edge_override,
            fh_mode=fh_mode,
            root_mode=root_mode,
        )

        if until == "first_traversal":
            return result

        iteration_outcome = project_public_start_gen_start_outcome(
            result,
            until=until,
        )
        if isinstance(iteration_outcome, PublicStartRepublishAndContinue):
            republish_gap_surface(
                app,
                selector=selector,
                stage=iteration_outcome.republish_stage,
            )
            continue
        if isinstance(iteration_outcome, PublicStartHumanGateRequired):
            if fh_mode != "human-proxy":
                return iteration_outcome.result
            fh_gate = iteration_outcome.result.get("fh_gate")
            fh_gate_edge = (
                str(fh_gate.get("edge") or "")
                if isinstance(fh_gate, Mapping)
                else ""
            )
            edge = str(iteration_outcome.result.get("edge") or fh_gate_edge or "").strip()
            if not edge:
                result.update(iteration_outcome.result)
                result["stopped_by"] = "fh_gate"
                result["human_proxy_error"] = "missing edge for fh_gate approval"
                return result
            emit_public_start_human_proxy_approval(
                app.config.workspace_root,
                edge=edge,
                workflow_version=str(bound_start.scope.workflow_version),
                work_key=bound_start.scope.work_key,
                run_id=bound_start.scope.run_id,
            )
            republish_gap_surface(
                app,
                selector=selector,
                stage="public_start_next_human_proxy",
            )
            continue
        if isinstance(iteration_outcome, PublicStartReturn):
            return iteration_outcome.result
        if isinstance(iteration_outcome, PublicStartDispatchRequired):
            resolved_policy = resolve_public_start_result_policy(
                iteration_outcome.result,
                app.config.workspace_root,
            )
            proof_hold = project_proof_hold(
                app.config.workspace_root,
                edge=(
                    iteration_outcome.result.get("edge")
                    if isinstance(iteration_outcome.result.get("edge"), str)
                    else None
                ),
                work_key=(
                    iteration_outcome.result.get("work_key")
                    if isinstance(iteration_outcome.result.get("work_key"), str)
                    else None
                ),
                spec_hash=(
                    iteration_outcome.result.get("spec_hash")
                    if isinstance(iteration_outcome.result.get("spec_hash"), str)
                    else None
                ),
                workflow_version=(
                    iteration_outcome.result.get("workflow_version")
                    if isinstance(iteration_outcome.result.get("workflow_version"), str)
                    else None
                ),
                resolved_policy=resolved_policy,
            )
            proof_hold_outcome = project_public_start_gen_start_outcome(
                iteration_outcome.result,
                until=until,
                proof_hold=proof_hold,
            )
            if isinstance(proof_hold_outcome, PublicStartReturn):
                return proof_hold_outcome.result
            dispatch_result = auto_dispatch_from_result(
                iteration_outcome.result,
                app.config.workspace_root,
                config=dict(bound_start.scope.runtime_config),
            )
            dispatch_outcome = project_public_start_dispatch_outcome(dispatch_result)
            if isinstance(dispatch_outcome, PublicStartRepublishAndContinue):
                republish_gap_surface(
                    app,
                    selector=selector,
                    stage=dispatch_outcome.republish_stage,
                )
                continue
            if not isinstance(dispatch_outcome, PublicStartReturn):
                raise RuntimeError("public next dispatch outcome failed to project a terminal result")
            result.update(dispatch_outcome.result)
            _attach_public_next_result_metadata(
                result,
                resolved_raw_target=directive.raw_target,
                next_edge_override=directive.edge_override,
                fh_mode=fh_mode,
                root_mode=root_mode,
            )
            return result
        raise RuntimeError("public next start outcome failed to classify the iteration")

    return _attach_public_next_result_metadata(
        result,
        fh_mode=fh_mode,
        root_mode=root_mode,
    ) | {"stopped_by": "max_iterations"}


def start(
    app: OddSdlcApp,
    *,
    scope: str,
    target: str,
    until: Literal["first_traversal", "blocked", "converged"],
    fh_mode: Literal["direct", "human-proxy"] = "direct",
    root_mode: Literal["direct", "supervised"] = "direct",
) -> dict[str, object] | PublicStartResultPayload:
    ensure_workspace_ready(app.config.workspace_root)
    if until != "converged" and fh_mode != "direct":
        raise ValueError("fh_mode is only lawful when until='converged'")
    if until != "converged" and root_mode != "direct":
        raise ValueError("root_mode is only lawful when until='converged'")

    selector = parse_gap_scope_selector(scope)
    if (target or "").strip() == "next":
        return _run_public_next_start(
            app,
            selector=selector,
            normalized_scope=scope,
            until=until,
            fh_mode=fh_mode,
            root_mode=root_mode,
        )

    directive, bound_start, blocked_result = _resolve_public_start_admission(
        app,
        selector=selector,
        target=target,
        normalized_scope=scope,
        until=until,
        fh_mode=fh_mode,
        root_mode=root_mode,
    )
    if blocked_result is not None:
        return blocked_result
    if directive is None or bound_start is None:
        raise RuntimeError("public start admission failed to produce an admitted basis")
    resolved_target = bound_start.target
    resolved_scope = bound_start.scope
    runtime_config = dict(resolved_scope.runtime_config)
    intent = StartIntent(scope=resolved_scope, target=resolved_target, until=until)

    if until == "converged":
        if root_mode == "supervised":
            raw_result = _run_start_until_converged_supervised(
                intent,
                app.stream,
                workspace=app.config.workspace_root,
                config=runtime_config,
                fh_mode=fh_mode,
            )
        else:
            raw_result = _run_start_until_converged(
                intent,
                app.stream,
                workspace=app.config.workspace_root,
                config=runtime_config,
                fh_mode=fh_mode,
            )
        normalized_result = _mapping_result(raw_result, context="_run_start_until_converged")
        normalized_result["root_mode"] = root_mode
        return normalized_result

    if until == "blocked":
        raw_result = _run_start_until_blocked(intent, app.stream)
    else:
        raw_result = gen_start(intent, app.stream)
    normalized_result = _mapping_result(raw_result, context="gen_start/_run_start_until_blocked")
    normalized_result["fh_mode"] = fh_mode
    normalized_result["root_mode"] = root_mode
    return normalized_result
