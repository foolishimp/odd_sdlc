# Implements: REQ-F-ODDSDLC-007
# Implements: REQ-F-ODDSDLC-029
"""Runtime contract carriers shared by source bootstrap and installer."""
from __future__ import annotations

import json
from typing import Any

from .install_topology import INSTALLED_PRODUCT_CODE_ROOT_RELATIVE


def query_assets_binding_contract() -> dict[str, Any]:
    return {
        "command": ["python", "-m", "odd_sdlc", "query-assets", "--workspace", "."],
        "assets_key": "assets",
        "asset_id_key": "asset_id",
        "uri_key": "uri",
        "relative_path_key": "metadata.relative_path",
        "path_kind_key": "checkpoint.path_kind",
        "exists_key": "checkpoint.exists",
    }


def query_assets_binding_contract_json() -> str:
    return json.dumps(
        query_assets_binding_contract(),
        separators=(",", ":"),
        sort_keys=True,
    )


def runtime_contract_lines() -> tuple[str, ...]:
    return (
        "# odd_sdlc runtime contract",
        "module: odd_sdlc.gtl_module:MODULE",
        "package: odd_sdlc.gtl_module:MODULE",
        "domain_package: odd_sdlc",
        "runtime_backend: claude",
        "worker_attachment_contract: transport_contract",
        "# add transport_contract to attach an admitted F_P worker; without it start --until converged returns fp_worker_unattached",
        f"asset_binding_contract: {query_assets_binding_contract_json()}",
        "pythonpath:",
        "  - .genesis",
        f"  - {INSTALLED_PRODUCT_CODE_ROOT_RELATIVE.as_posix()}",
        "",
    )
