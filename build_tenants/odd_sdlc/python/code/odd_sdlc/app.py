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
    return {
        "workspace_root": str(workspace_root),
        "semantic_facets": [facet.to_dict() for facet in SEMANTIC_FACETS.values()],
        "asset_types": [profile.to_dict() for profile in ASSET_TYPES.values()],
        "assets": [asset.to_dict() for asset in bootstrap_assets(workspace_root)],
        "collections": [bootstrap_input_collection(workspace_root).to_dict()],
        "bindings": [binding.to_dict() for binding in bootstrap_bindings(workspace_root)],
        "functions": [entry.to_dict() for entry in FUNCTION_CATALOG],
        "graph_functions": [
            {
                "name": function.name,
                "inputs": [node.name for node in function.inputs],
                "outputs": [node.name for node in function.outputs],
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
