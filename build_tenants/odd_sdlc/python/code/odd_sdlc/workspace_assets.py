# Implements: REQ-F-ASSETMODEL-001
# Implements: REQ-F-ASSETMODEL-003
# Implements: REQ-F-ASSETMODEL-005
"""Workspace asset inventory and bindings for odd_sdlc."""
from __future__ import annotations

import hashlib
from pathlib import Path

from .asset_types import ASSET_TYPES
from .domain_model import (
    Asset,
    AssetCheckpoint,
    AssetCollection,
    AssetNodeBinding,
    AssetProvenance,
    relative_file_uri,
)


BOOTSTRAP_PATHS: tuple[tuple[str, str], ...] = (
    ("intent_surface", "specification/INTENT.md"),
    ("product_surface", "specification/PRODUCT.md"),
    ("goal_surface", "specification/GOALS.md"),
    ("requirement_surface", "specification/requirements"),
)

NODE_ASSET_TYPES = {
    "intent_surface": "intent_doc",
    "product_surface": "product_doc",
    "goal_surface": "goal_surface",
    "requirement_surface": "requirement_surface",
}


def _digest_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _digest_directory(path: Path) -> str:
    digest = hashlib.sha256()
    for child in sorted(item for item in path.rglob("*") if item.is_file()):
        digest.update(child.relative_to(path).as_posix().encode("utf-8"))
        digest.update(b"\0")
        digest.update(_digest_file(child).encode("utf-8"))
        digest.update(b"\0")
    return digest.hexdigest()


def _directory_size(path: Path) -> int:
    return sum(child.stat().st_size for child in path.rglob("*") if child.is_file())


def checkpoint_for_path(path: Path) -> AssetCheckpoint:
    if not path.exists():
        return AssetCheckpoint(exists=False, path_kind="missing", content_digest=None, bytes=None)
    if path.is_dir():
        return AssetCheckpoint(
            exists=True,
            path_kind="directory",
            content_digest=_digest_directory(path),
            bytes=_directory_size(path),
        )
    return AssetCheckpoint(
        exists=True,
        path_kind="file",
        content_digest=_digest_file(path),
        bytes=path.stat().st_size,
    )


def bootstrap_assets(workspace_root: Path) -> tuple[Asset, ...]:
    assets: list[Asset] = []
    for node_name, rel_path in BOOTSTRAP_PATHS:
        path = workspace_root / rel_path
        asset_type = NODE_ASSET_TYPES[node_name]
        type_profile = ASSET_TYPES[asset_type]
        checkpoint = checkpoint_for_path(path)
        assets.append(
            Asset(
                asset_id=node_name,
                uri=relative_file_uri(path, workspace_root=workspace_root),
                declared_type=asset_type,
                metadata={
                    "relative_path": rel_path,
                    "exists": "true" if path.exists() else "false",
                    "path_kind": checkpoint.path_kind,
                },
                provenance=AssetProvenance(
                    model="projected_checkpoint",
                    source="workspace_materialized_state",
                    mutable=type_profile.mutable_default,
                    history_basis="runtime_and_constructive_event_history",
                ),
                checkpoint=checkpoint,
            )
        )
    return tuple(assets)


def bootstrap_input_collection(workspace_root: Path) -> AssetCollection:
    return AssetCollection(name="bootstrap_input_set", assets=bootstrap_assets(workspace_root))


def bootstrap_bindings(workspace_root: Path) -> tuple[AssetNodeBinding, ...]:
    assets = {asset.asset_id: asset for asset in bootstrap_assets(workspace_root)}
    bindings = [
        AssetNodeBinding(node="input_set", asset_ids=tuple(assets)),
    ]
    for node_name, _ in BOOTSTRAP_PATHS:
        bindings.append(AssetNodeBinding(node=node_name, asset_ids=(node_name,)))
    return tuple(bindings)
