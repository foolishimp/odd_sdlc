# Implements: REQ-F-ASSETMODEL-005
# Implements: REQ-F-ODDSDLC-005
"""ODD domain query library for odd_sdlc."""
from __future__ import annotations

from typing import Any

from .app import OddSdlcApp, catalog, gaps
from .query_contract import query_domain_contract
from .workspace_assets import bootstrap_assets


def _project_assets(app: OddSdlcApp) -> list[dict[str, Any]]:
    base_assets = [asset.to_dict() for asset in bootstrap_assets(app.config.workspace_root)]
    events = app.stream.all_events()
    checkpoint_events_by_asset: dict[str, list[dict[str, Any]]] = {}
    for event in events:
        if event.get("event_type") != "asset_checkpoint_updated":
            continue
        asset_id = event.get("data", {}).get("asset_id")
        if not isinstance(asset_id, str) or not asset_id:
            continue
        checkpoint_events_by_asset.setdefault(asset_id, []).append(event)

    projected: list[dict[str, Any]] = []
    for asset in base_assets:
        asset_id = asset["asset_id"]
        updates = checkpoint_events_by_asset.get(asset_id, [])
        if updates:
            latest = updates[-1]
            latest_data = latest["data"]
            provenance = dict(asset.get("provenance") or {})
            provenance["source"] = "asset_checkpoint_events"
            provenance["last_event_id"] = latest.get("event_id")
            projected.append(
                {
                    **asset,
                    "checkpoint": latest_data["current_checkpoint"],
                    "provenance": provenance,
                    "projection_source": "event_history",
                    "update_count": len(updates),
                }
            )
        else:
            projected.append(
                {
                    **asset,
                    "projection_source": "workspace_scan",
                    "update_count": 0,
                }
            )
    return projected


def query_assets(app: OddSdlcApp) -> list[dict[str, Any]]:
    return _project_assets(app)


def query_functions(app: OddSdlcApp) -> list[dict[str, Any]]:
    return catalog(app)["functions"]


def query_bindings(app: OddSdlcApp) -> list[dict[str, Any]]:
    return catalog(app)["bindings"]


def query_domain(app: OddSdlcApp) -> dict[str, Any]:
    catalog_payload = catalog(app)
    return {
        "query_contract": query_domain_contract(),
        "workspace_root": str(app.config.workspace_root),
        "semantic_facets": catalog_payload["semantic_facets"],
        "asset_types": catalog_payload["asset_types"],
        "assets": query_assets(app),
        "functions": catalog_payload["functions"],
        "bindings": catalog_payload["bindings"],
        "gaps": gaps(app),
    }
