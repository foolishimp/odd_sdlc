# Implements: REQ-F-ODDSDLC-003
# Implements: REQ-F-ODDSDLC-004
"""App-owned bootstrap and runtime surface for odd_sdlc."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from genesis.binding import Worker
from genesis.events import EventStream
from genesis.install import workspace_bootstrap
from genesis.services import Scope, gen_gaps, gen_iterate, gen_start

from .asset_types import ASSET_TYPES, SEMANTIC_FACETS
from .function_catalog import FUNCTION_CATALOG
from .gtl_module import module as odd_sdlc_module
from .program_catalog import PROGRAM_CATALOG
from .workspace_assets import bootstrap_assets, bootstrap_bindings, bootstrap_input_collection


@dataclass(frozen=True)
class AppConfig:
    workspace_root: Path
    runtime_config: dict[str, Any] = field(default_factory=dict)
    build: str | None = None


@dataclass
class OddSdlcApp:
    config: AppConfig
    stream: EventStream
    worker: Worker | None = None

    def scope(self) -> Scope:
        return Scope(
            module=odd_sdlc_module(),
            workspace_root=self.config.workspace_root,
            build=self.config.build,
            worker=self.worker,
            runtime_config=self.config.runtime_config,
        )


def bootstrap(
    *,
    workspace_root: str | Path = ".",
    runtime_config: dict[str, Any] | None = None,
    build: str | None = None,
) -> AppConfig:
    return AppConfig(
        workspace_root=Path(workspace_root).resolve(),
        runtime_config={
            "domain_package": "odd_sdlc",
            **dict(runtime_config or {}),
        },
        build=build,
    )


def initialize(config: AppConfig, *, worker: Worker | None = None) -> OddSdlcApp:
    stream = workspace_bootstrap(config.workspace_root)
    return OddSdlcApp(config=config, stream=stream, worker=worker)


def catalog(app: OddSdlcApp) -> dict:
    module = odd_sdlc_module()
    workspace_root = app.config.workspace_root
    function_intent_by_name = {
        entry.name: entry.intent
        for entry in FUNCTION_CATALOG
    }

    def _decl_value(value: Any) -> Any:
        return value.to_dict() if hasattr(value, "to_dict") else value

    def _node_contract(node) -> dict[str, Any]:
        return {
            "name": node.name,
            "schema": node.schema if isinstance(node.schema, str) else getattr(node.schema, "__name__", repr(node.schema)),
            "asset_surface": node.asset_surface.to_dict(),
        }
    job_names_by_function_id: dict[str, list[str]] = {}
    for job in module.jobs:
        for contract in job.contracts:
            if contract.kind != "graph_function":
                continue
            job_names_by_function_id.setdefault(contract.target_id, []).append(job.name)
    return {
        "workspace_root": str(workspace_root),
        "semantic_facets": [facet.to_dict() for facet in SEMANTIC_FACETS.values()],
        "asset_types": [profile.to_dict() for profile in ASSET_TYPES.values()],
        "assets": [asset.to_dict() for asset in bootstrap_assets(workspace_root)],
        "collections": [bootstrap_input_collection(workspace_root).to_dict()],
        "bindings": [binding.to_dict() for binding in bootstrap_bindings(workspace_root)],
        "functions": [entry.to_dict() for entry in FUNCTION_CATALOG],
        "programs": [entry.to_dict() for entry in PROGRAM_CATALOG],
        "graph_functions": [
            {
                "id": function.id,
                "name": function.name,
                "intent": function_intent_by_name.get(function.name, function.declarations.get("intent", "")),
                "function_kind": function.declarations.get("function_kind"),
                "harness_kind": function.declarations.get("harness_kind"),
                "harness_contract": _decl_value(function.declarations.get("harness_contract")),
                "harness_implementation": _decl_value(function.declarations.get("harness_implementation")),
                "template_kind": function.template.kind,
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
        ],
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


def gaps(app: OddSdlcApp) -> dict:
    return gen_gaps(app.scope(), app.stream)


def iterate(app: OddSdlcApp) -> dict:
    return gen_iterate(app.scope(), app.stream)


def start(app: OddSdlcApp, *, auto: bool = False) -> dict:
    return gen_start(app.scope(), app.stream, auto=auto)
