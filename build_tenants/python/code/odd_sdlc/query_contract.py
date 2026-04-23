# Implements: REQ-F-ODDSDLC-005
# Implements: REQ-F-ODDSDLC-020
# Implements: REQ-F-ODDSDLC-029
"""Stable query-contract descriptors for odd_sdlc plugins."""
from __future__ import annotations

from typing import Literal, TypedDict

from .ambiguity import AmbiguityRegisterReadModel
from .domain_model import (
    AssetCheckpointPayload,
    AssetCollectionPayload,
    AssetFamilyDescriptorPayload,
    AssetNodeBindingPayload,
    AssetPayload,
    AssetProjectionPayload,
    AssetSemanticFacetPayload,
    AssetTypeProfilePayload,
    EdgeContractDescriptorPayload,
    ExecutiveProgramEntryPayload,
    FunctionCatalogEntryPayload,
    WorkActDescriptorPayload,
)
from .project_profile import OperationalCapabilitiesProjectionPayload
from .public_start_contract import (
    AssetOwnershipIndexEntryPayload,
    ExecutionContractSurfacePayload,
    GapDossierReadModel,
    StartTargetCatalogEntryPayload,
)
from .requirement_closure import RequirementClosureRegisterReadModel
from .start_targeting import GraphFunctionEntryPayload


class QueryDomainContractPayload(TypedDict):
    name: str
    version: str
    top_level_keys: list[str]
    runtime_model: str
    query_model: str

class JobContractPayload(TypedDict):
    kind: str
    target_id: str


class JobProjectionPayload(TypedDict):
    name: str
    contracts: list[JobContractPayload]


class QueryAssetsBindingPayload(TypedDict):
    query_contract: Literal["odd_sdlc.query-assets"]
    workspace_root: str
    assets: list[AssetProjectionPayload]


class QueryDomainPayload(TypedDict):
    query_contract: QueryDomainContractPayload
    workspace_root: str
    execution_contract_surface: ExecutionContractSurfacePayload | None
    semantic_facets: list[AssetSemanticFacetPayload]
    asset_types: list[AssetTypeProfilePayload]
    asset_families: list[AssetFamilyDescriptorPayload]
    assets: list[AssetProjectionPayload]
    start_target_catalog: list[StartTargetCatalogEntryPayload]
    asset_ownership_index: list[AssetOwnershipIndexEntryPayload]
    operational_capabilities: OperationalCapabilitiesProjectionPayload
    ambiguity_register: AmbiguityRegisterReadModel
    requirement_closure_register: RequirementClosureRegisterReadModel
    collections: list[AssetCollectionPayload]
    functions: list[FunctionCatalogEntryPayload]
    edge_contracts: list[EdgeContractDescriptorPayload]
    programs: list[ExecutiveProgramEntryPayload]
    work_act_types: list[WorkActDescriptorPayload]
    jobs: list[JobProjectionPayload]
    graph_functions: list[GraphFunctionEntryPayload]
    bindings: list[AssetNodeBindingPayload]
    gap_dossier: GapDossierReadModel


QUERY_DOMAIN_CONTRACT_NAME = "odd_sdlc.query-domain"
QUERY_DOMAIN_CONTRACT_VERSION = "v17"
QUERY_DOMAIN_TOP_LEVEL_KEYS = (
    "query_contract",
    "workspace_root",
    "semantic_facets",
    "asset_types",
    "asset_families",
    "assets",
    "start_target_catalog",
    "asset_ownership_index",
    "operational_capabilities",
    "ambiguity_register",
    "requirement_closure_register",
    "collections",
    "functions",
    "edge_contracts",
    "execution_contract_surface",
    "programs",
    "work_act_types",
    "jobs",
    "graph_functions",
    "bindings",
    "gap_dossier",
)


def query_domain_contract() -> QueryDomainContractPayload:
    return {
        "name": QUERY_DOMAIN_CONTRACT_NAME,
        "version": QUERY_DOMAIN_CONTRACT_VERSION,
        "top_level_keys": list(QUERY_DOMAIN_TOP_LEVEL_KEYS),
        "runtime_model": "abg-native",
        "query_model": "odd-domain-plugin",
    }
