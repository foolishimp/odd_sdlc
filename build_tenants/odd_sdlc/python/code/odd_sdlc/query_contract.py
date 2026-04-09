# Implements: REQ-F-ODDSDLC-005
"""Stable query-contract descriptors for odd_sdlc plugins."""
from __future__ import annotations


QUERY_DOMAIN_CONTRACT_NAME = "odd_sdlc.query-domain"
QUERY_DOMAIN_CONTRACT_VERSION = "v5"
QUERY_DOMAIN_TOP_LEVEL_KEYS = (
    "query_contract",
    "workspace_root",
    "semantic_facets",
    "asset_types",
    "asset_families",
    "assets",
    "collections",
    "functions",
    "edge_contracts",
    "programs",
    "work_act_types",
    "jobs",
    "graph_functions",
    "bindings",
    "gaps",
)


def query_domain_contract() -> dict[str, object]:
    return {
        "name": QUERY_DOMAIN_CONTRACT_NAME,
        "version": QUERY_DOMAIN_CONTRACT_VERSION,
        "top_level_keys": list(QUERY_DOMAIN_TOP_LEVEL_KEYS),
        "runtime_model": "abg-native",
        "query_model": "odd-domain-plugin",
    }
