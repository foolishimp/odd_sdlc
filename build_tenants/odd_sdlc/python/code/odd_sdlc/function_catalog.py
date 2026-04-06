# Implements: REQ-F-ASSETMODEL-004
# Implements: REQ-F-ODDSDLC-002
"""Named function catalog for the first odd_sdlc slice."""
from __future__ import annotations

from .domain_model import FunctionCatalogEntry


FUNCTION_CATALOG: tuple[FunctionCatalogEntry, ...] = (
    FunctionCatalogEntry(
        name="derive_intent_surface",
        intent="Derive or revise the intent surface from the bound bootstrap input set.",
        inputs=("input_set",),
        outputs=("intent_surface",),
        backing_graph_function="derive_intent_surface",
    ),
    FunctionCatalogEntry(
        name="derive_product_surface",
        intent="Derive or revise the product surface from the bound bootstrap input set and the current intent surface.",
        inputs=("input_set", "intent_surface"),
        outputs=("product_surface",),
        backing_graph_function="derive_product_surface",
    ),
    FunctionCatalogEntry(
        name="derive_goal_surface",
        intent="Derive or revise the goals surface from the bound bootstrap input set, the current intent surface, and the current product surface.",
        inputs=("input_set", "intent_surface", "product_surface"),
        outputs=("goal_surface",),
        backing_graph_function="derive_goal_surface",
    ),
    FunctionCatalogEntry(
        name="derive_requirement_surface",
        intent="Derive the requirement family surface from input, intent, product, and goals.",
        inputs=("input_set", "intent_surface", "product_surface", "goal_surface"),
        outputs=("requirement_surface",),
        backing_graph_function="derive_requirement_surface",
    ),
    FunctionCatalogEntry(
        name="derive_feature_decomp_surface",
        intent="Derive feature decomposition structure from the current requirement surface.",
        inputs=("requirement_surface",),
        outputs=("feature_decomp_surface",),
        backing_graph_function="derive_feature_decomp_surface",
    ),
    FunctionCatalogEntry(
        name="derive_uat_testcases_surface",
        intent="Derive operator-facing UAT testcase structure from the current requirement surface.",
        inputs=("requirement_surface",),
        outputs=("uat_testcases_surface",),
        backing_graph_function="derive_uat_testcases_surface",
    ),
)
