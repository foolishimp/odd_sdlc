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
    FunctionCatalogEntry(
        name="derive_design_surface",
        intent="Derive a generated design surface from the current requirement surface and feature decomposition.",
        inputs=("requirement_surface", "feature_decomp_surface"),
        outputs=("design_surface",),
        backing_graph_function="derive_design_surface",
    ),
    FunctionCatalogEntry(
        name="derive_scenario_surface",
        intent="Derive generated scenario bundles from the current requirement and design surfaces.",
        inputs=("requirement_surface", "design_surface"),
        outputs=("scenario_surface",),
        backing_graph_function="derive_scenario_surface",
    ),
    FunctionCatalogEntry(
        name="derive_test_design_surface",
        intent="Derive recursive test-SDLC design from the current design and scenario surfaces.",
        inputs=("design_surface", "scenario_surface"),
        outputs=("test_design_surface",),
        backing_graph_function="derive_test_design_surface",
    ),
    FunctionCatalogEntry(
        name="select_test_stack_profile",
        intent="Select the concrete test stack profile for the current generated test design surface.",
        inputs=("test_design_surface",),
        outputs=("test_stack_profile",),
        backing_graph_function="select_test_stack_profile",
    ),
    FunctionCatalogEntry(
        name="derive_test_module_surface",
        intent="Derive generated test module structure from the current test design and selected stack profile.",
        inputs=("test_design_surface", "test_stack_profile"),
        outputs=("test_module_surface",),
        backing_graph_function="derive_test_module_surface",
    ),
    FunctionCatalogEntry(
        name="derive_test_run_archive_surface",
        intent="Derive governed archive-evidence design from the current test module surface and selected test stack profile.",
        inputs=("test_module_surface", "test_stack_profile"),
        outputs=("test_run_archive_surface",),
        backing_graph_function="derive_test_run_archive_surface",
    ),
    FunctionCatalogEntry(
        name="qualify_testcase_authority",
        intent="Qualify the current generated UAT testcase collection together with the generated scenario set as the authoritative testcase surface for downstream proof.",
        inputs=("uat_testcases_surface", "scenario_surface"),
        outputs=("testcase_authority_surface",),
        backing_graph_function="qualify_testcase_authority",
    ),
    FunctionCatalogEntry(
        name="prepare_release_surface",
        intent="Prepare a generated release readiness surface from the current requirements, design, scenarios, testcase authority, and archived test evidence.",
        inputs=("requirement_surface", "design_surface", "scenario_surface", "testcase_authority_surface", "test_run_archive_surface"),
        outputs=("release_surface",),
        backing_graph_function="prepare_release_surface",
    ),
)
