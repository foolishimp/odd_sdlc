# Implements: REQ-F-ASSETMODEL-001
# Implements: REQ-F-ASSETMODEL-002
# Implements: REQ-F-ASSETMODEL-003
# Implements: REQ-F-ASSETMODEL-004
# Implements: REQ-F-ASSETMODEL-005
"""Domain model for odd_sdlc asset, function, and software-domain descriptors."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import TypedDict


class AssetSemanticFacetPayload(TypedDict):
    name: str
    description: str


class AssetTypeProfilePayload(TypedDict):
    name: str
    description: str
    semantic_facets: list[str]
    fd_evaluator: str
    fp_gap_description: str
    fp_descriptive_framing: str
    specializes: list[str]
    library_level: str
    mutable_default: bool
    proof_hints: list[str]
    closure_hints: list[str]


class AssetCheckpointPayload(TypedDict):
    exists: bool
    path_kind: str
    content_digest: str | None
    bytes: int | None


class AssetProvenancePayload(TypedDict):
    model: str
    source: str
    mutable: bool
    history_basis: str


class AssetPayload(TypedDict):
    asset_id: str
    uri: str
    declared_type: str
    kind: str
    metadata: dict[str, object]
    generated_asset_contract: dict[str, object] | None
    provenance: AssetProvenancePayload | None
    checkpoint: AssetCheckpointPayload | None


class AssetProjectionPayload(AssetPayload, total=False):
    projection_source: str
    update_count: int


class AssetCollectionPayload(TypedDict):
    name: str
    assets: list[AssetPayload]


class AssetFamilyDescriptorPayload(TypedDict):
    name: str
    description: str
    lifecycle_role: str
    representative_asset_types: list[str]
    realization_status: str


class AssetNodeBindingPayload(TypedDict):
    node: str
    asset_ids: list[str]


class WorkActDescriptorPayload(TypedDict):
    name: str
    description: str
    mutates_workspace: bool
    produces_governed_evidence: bool
    typical_asset_families: list[str]
    realization_status: str


class FunctionCatalogEntryPayload(TypedDict):
    name: str
    intent: str
    inputs: list[str]
    outputs: list[str]
    backing_graph_function: str


class EdgeContractDescriptorPayload(TypedDict):
    name: str
    description: str
    source_asset_families: list[str]
    target_asset_family: str
    configured_fp_role: str
    preflight_fd_layers: list[str]
    postflight_fd_layers: list[str]
    work_report_contract: str
    representative_functions: list[str]
    realization_status: str


class ExecutiveProgramEntryPayload(TypedDict):
    name: str
    intent: str
    steps: list[str]
    outputs: list[str]
    kind: str


@dataclass(frozen=True)
class AssetSemanticFacet:
    name: str
    description: str

    def to_dict(self) -> AssetSemanticFacetPayload:
        return {
            "name": self.name,
            "description": self.description,
        }


@dataclass(frozen=True)
class AssetTypeProfile:
    name: str
    description: str
    semantic_facets: tuple[str, ...]
    fd_evaluator: str
    fp_gap_description: str
    fp_descriptive_framing: str
    specializes: tuple[str, ...] = ()
    library_level: str = "generic"
    mutable_default: bool = True
    proof_hints: tuple[str, ...] = ()
    closure_hints: tuple[str, ...] = ()

    def to_dict(self) -> AssetTypeProfilePayload:
        return {
            "name": self.name,
            "description": self.description,
            "semantic_facets": list(self.semantic_facets),
            "fd_evaluator": self.fd_evaluator,
            "fp_gap_description": self.fp_gap_description,
            "fp_descriptive_framing": self.fp_descriptive_framing,
            "specializes": list(self.specializes),
            "library_level": self.library_level,
            "mutable_default": self.mutable_default,
            "proof_hints": list(self.proof_hints),
            "closure_hints": list(self.closure_hints),
        }


@dataclass(frozen=True)
class AssetCheckpoint:
    exists: bool
    path_kind: str
    content_digest: str | None
    bytes: int | None

    def to_dict(self) -> AssetCheckpointPayload:
        return {
            "exists": self.exists,
            "path_kind": self.path_kind,
            "content_digest": self.content_digest,
            "bytes": self.bytes,
        }


@dataclass(frozen=True)
class AssetProvenance:
    model: str
    source: str
    mutable: bool
    history_basis: str

    def to_dict(self) -> AssetProvenancePayload:
        return {
            "model": self.model,
            "source": self.source,
            "mutable": self.mutable,
            "history_basis": self.history_basis,
        }


@dataclass(frozen=True)
class Asset:
    asset_id: str
    uri: str
    declared_type: str
    kind: str = "asset"
    metadata: dict[str, object] = field(default_factory=dict)
    generated_asset_contract: dict[str, object] | None = None
    provenance: AssetProvenance | None = None
    checkpoint: AssetCheckpoint | None = None

    def to_dict(self) -> AssetPayload:
        return {
            "asset_id": self.asset_id,
            "uri": self.uri,
            "declared_type": self.declared_type,
            "kind": self.kind,
            "metadata": dict(self.metadata),
            "generated_asset_contract": (
                None if self.generated_asset_contract is None else dict(self.generated_asset_contract)
            ),
            "provenance": None if self.provenance is None else self.provenance.to_dict(),
            "checkpoint": None if self.checkpoint is None else self.checkpoint.to_dict(),
        }


@dataclass(frozen=True)
class AssetCollection:
    name: str
    assets: tuple[Asset, ...]

    def to_dict(self) -> AssetCollectionPayload:
        return {
            "name": self.name,
            "assets": [asset.to_dict() for asset in self.assets],
        }


@dataclass(frozen=True)
class AssetFamilyDescriptor:
    name: str
    description: str
    lifecycle_role: str
    representative_asset_types: tuple[str, ...]
    realization_status: str

    def to_dict(self) -> AssetFamilyDescriptorPayload:
        return {
            "name": self.name,
            "description": self.description,
            "lifecycle_role": self.lifecycle_role,
            "representative_asset_types": list(self.representative_asset_types),
            "realization_status": self.realization_status,
        }


@dataclass(frozen=True)
class AssetNodeBinding:
    node: str
    asset_ids: tuple[str, ...]

    def to_dict(self) -> AssetNodeBindingPayload:
        return {
            "node": self.node,
            "asset_ids": list(self.asset_ids),
        }


@dataclass(frozen=True)
class WorkActDescriptor:
    name: str
    description: str
    mutates_workspace: bool
    produces_governed_evidence: bool
    typical_asset_families: tuple[str, ...]
    realization_status: str

    def to_dict(self) -> WorkActDescriptorPayload:
        return {
            "name": self.name,
            "description": self.description,
            "mutates_workspace": self.mutates_workspace,
            "produces_governed_evidence": self.produces_governed_evidence,
            "typical_asset_families": list(self.typical_asset_families),
            "realization_status": self.realization_status,
        }


@dataclass(frozen=True)
class FunctionCatalogEntry:
    name: str
    intent: str
    inputs: tuple[str, ...]
    outputs: tuple[str, ...]
    backing_graph_function: str

    def to_dict(self) -> FunctionCatalogEntryPayload:
        return {
            "name": self.name,
            "intent": self.intent,
            "inputs": list(self.inputs),
            "outputs": list(self.outputs),
            "backing_graph_function": self.backing_graph_function,
        }


@dataclass(frozen=True)
class EdgeContractDescriptor:
    name: str
    description: str
    source_asset_families: tuple[str, ...]
    target_asset_family: str
    configured_fp_role: str
    preflight_fd_layers: tuple[str, ...]
    postflight_fd_layers: tuple[str, ...]
    work_report_contract: str
    representative_functions: tuple[str, ...]
    realization_status: str

    def to_dict(self) -> EdgeContractDescriptorPayload:
        return {
            "name": self.name,
            "description": self.description,
            "source_asset_families": list(self.source_asset_families),
            "target_asset_family": self.target_asset_family,
            "configured_fp_role": self.configured_fp_role,
            "preflight_fd_layers": list(self.preflight_fd_layers),
            "postflight_fd_layers": list(self.postflight_fd_layers),
            "work_report_contract": self.work_report_contract,
            "representative_functions": list(self.representative_functions),
            "realization_status": self.realization_status,
        }


@dataclass(frozen=True)
class ExecutiveProgramEntry:
    name: str
    intent: str
    steps: tuple[str, ...]
    outputs: tuple[str, ...]
    kind: str = "executive_program"

    def to_dict(self) -> ExecutiveProgramEntryPayload:
        return {
            "name": self.name,
            "intent": self.intent,
            "steps": list(self.steps),
            "outputs": list(self.outputs),
            "kind": self.kind,
        }


def relative_file_uri(path: Path, *, workspace_root: Path) -> str:
    relative = path.resolve().relative_to(workspace_root.resolve())
    return f"file://{relative.as_posix()}"
