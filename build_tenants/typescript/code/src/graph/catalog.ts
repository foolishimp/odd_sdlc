// Implements: REQ-F-ODDSDLC-013
// Implements: REQ-F-ODDSDLC-014
// Implements: REQ-F-ODDSDLC-015
// Implements: REQ-F-ODDSDLC-021
// Implements: REQ-F-ODDSDLC-038
// Implements: REQ-F-ODDSDLC-057

import {
  FG_SINGLE_TYPED_TRAVERSAL,
  REUSABLE_GRAPH_FUNCTION_CATALOG,
  type SdlcReusableGraphFunctionCatalogEntry
} from "./library.js";

export interface SdlcFunctionCatalogEntry {
  readonly kind: "sdlc_function_catalog_entry";
  readonly catalogRole: "product_specialization";
  readonly graphTrackPublication: "default" | "overlay_only";
  readonly name: string;
  readonly intent: string;
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly backingGraphFunction: string;
  readonly specializesGraphFunction: typeof FG_SINGLE_TYPED_TRAVERSAL;
  readonly transformContractRef: string;
  readonly evaluationContractRef: string;
}

export interface SdlcExecutiveProgramEntry {
  readonly kind: "sdlc_executive_program_entry";
  readonly name: string;
  readonly intent: string;
  readonly steps: readonly string[];
  readonly outputs: readonly string[];
  readonly backingGraphFunction: string;
}

export interface SdlcGraphFunctionCatalog {
  readonly kind: "sdlc_graph_function_catalog";
  readonly libraryFunctions: readonly SdlcReusableGraphFunctionCatalogEntry[];
  readonly functions: readonly SdlcFunctionCatalogEntry[];
  readonly executives: readonly SdlcExecutiveProgramEntry[];
}

export const FG_BOOTSTRAP_REQUIREMENTS_EXECUTIVE =
  "bootstrap_requirements" as const;
export const FG_SOLUTION_ARCHITECTURE_EXECUTIVE =
  "solution_architecture" as const;
export const FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE =
  "lite_design_module_implementation" as const;
export const FG_UAT_TEST_CASES_EXECUTIVE = "uat_test_cases" as const;
export const FG_DERIVE_LITE_DESIGN_ADR_SURFACE =
  "derive_lite_design_adr_surface" as const;
export const FG_DERIVE_LITE_MODULE_SURFACE =
  "derive_lite_module_surface" as const;
export const FG_DERIVE_LITE_COMPONENT_CODE_SURFACE =
  "derive_lite_component_code_surface" as const;

export const BOOTSTRAP_REQUIREMENTS_EXECUTIVE_STEPS = Object.freeze([
  "derive_intent_surface",
  "derive_product_surface",
  "derive_goal_surface",
  "derive_requirement_surface"
] as const);

export const SOLUTION_ARCHITECTURE_EXECUTIVE_STEPS = Object.freeze([
  "derive_feature_decomp_surface",
  "derive_design_surface",
  "derive_scenario_surface",
  "derive_implementation_design_surface"
] as const);

export const LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE_STEPS = Object.freeze([
  FG_DERIVE_LITE_DESIGN_ADR_SURFACE,
  FG_DERIVE_LITE_MODULE_SURFACE,
  FG_DERIVE_LITE_COMPONENT_CODE_SURFACE
] as const);

export const UAT_TEST_CASES_EXECUTIVE_STEPS = Object.freeze([
  "derive_uat_testcases_surface"
] as const);

function entry(input: {
  readonly name: string;
  readonly intent: string;
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly graphTrackPublication?: "default" | "overlay_only";
}): SdlcFunctionCatalogEntry {
  return Object.freeze({
    kind: "sdlc_function_catalog_entry",
    catalogRole: "product_specialization",
    graphTrackPublication: input.graphTrackPublication ?? "default",
    name: input.name,
    intent: input.intent,
    inputs: Object.freeze([...input.inputs]),
    outputs: Object.freeze([...input.outputs]),
    backingGraphFunction: input.name,
    specializesGraphFunction: FG_SINGLE_TYPED_TRAVERSAL,
    transformContractRef: `transform://odd_sdlc/${input.name}`,
    evaluationContractRef: `evaluation://odd_sdlc/${input.name}`
  });
}

export const SDLC_REUSABLE_GRAPH_FUNCTION_CATALOG =
  REUSABLE_GRAPH_FUNCTION_CATALOG;

export const BOOTSTRAP_RELEASE_FUNCTION_CATALOG = Object.freeze([
  entry({
    name: "derive_intent_surface",
    intent: "Derive or revise intent from the bound bootstrap inputs.",
    inputs: ["input_set"],
    outputs: ["intent_surface"]
  }),
  entry({
    name: "derive_product_surface",
    intent: "Derive product definition from bootstrap inputs and intent.",
    inputs: ["input_set", "intent_surface"],
    outputs: ["product_surface"]
  }),
  entry({
    name: "derive_goal_surface",
    intent: "Derive current goals from input, intent, and product surfaces.",
    inputs: ["input_set", "intent_surface", "product_surface"],
    outputs: ["goal_surface"]
  }),
  entry({
    name: "derive_requirement_surface",
    intent: "Derive the requirement family surface for the current wave.",
    inputs: ["input_set", "intent_surface", "product_surface", "goal_surface"],
    outputs: ["requirement_surface"]
  }),
  entry({
    name: "derive_feature_decomp_surface",
    intent: "Derive feature decomposition from current requirements.",
    inputs: ["requirement_surface"],
    outputs: ["feature_decomp_surface"]
  }),
  entry({
    name: "derive_uat_testcases_surface",
    intent: "Derive operator UAT testcase structure from requirements and admitted solution architecture authority.",
    inputs: ["requirement_surface", "implementation_design_surface"],
    outputs: ["uat_testcases_surface"]
  }),
  entry({
    name: "derive_design_surface",
    intent: "Derive design from requirements and feature decomposition.",
    inputs: ["requirement_surface", "feature_decomp_surface"],
    outputs: ["design_surface"]
  }),
  entry({
    name: "derive_scenario_surface",
    intent: "Derive scenario bundles from requirements and design.",
    inputs: ["requirement_surface", "design_surface"],
    outputs: ["scenario_surface"]
  }),
  entry({
    name: "derive_implementation_design_surface",
    intent: "Derive recursive implementation design from design and scenarios.",
    inputs: ["design_surface", "scenario_surface"],
    outputs: ["implementation_design_surface"]
  }),
  entry({
    name: "select_implementation_stack_profile",
    intent: "Select implementation stack profile for the implementation design.",
    inputs: ["implementation_design_surface"],
    outputs: ["implementation_stack_profile"]
  }),
  entry({
    name: "derive_implementation_module_surface",
    intent: "Derive implementation module structure, requirement allocation, per-module attribute schemas, and per-module state diagrams.",
    inputs: ["implementation_design_surface", "implementation_stack_profile"],
    outputs: ["implementation_module_surface"]
  }),
  entry({
    name: "derive_aggregate_domain_model_surface",
    intent: "Compose per-module typed schemas into one aggregate domain model before component topology and scheduling.",
    inputs: ["implementation_module_surface"],
    outputs: ["aggregate_domain_model_surface"]
  }),
  entry({
    name: "derive_implementation_component_topology_surface",
    intent: "Derive production-shaped implementation component topology from implementation design, module authority, aggregate domain model, and stack profile.",
    inputs: [
      "implementation_design_surface",
      "implementation_module_surface",
      "aggregate_domain_model_surface",
      "implementation_stack_profile"
    ],
    outputs: ["implementation_component_topology_surface"]
  }),
  entry({
    name: "derive_aggregate_sunny_day_sequence_surface",
    intent: "Compose component topology and aggregate domain model into one end-to-end sunny-day sequence before realization scheduling.",
    inputs: [
      "implementation_module_surface",
      "aggregate_domain_model_surface",
      "implementation_component_topology_surface"
    ],
    outputs: ["aggregate_sunny_day_sequence_surface"]
  }),
  entry({
    name: "derive_component_realization_schedule_surface",
    intent: "Derive component-level realization schedule from component topology, aggregate design surfaces, module authority, and stack profile.",
    inputs: [
      "implementation_component_topology_surface",
      "implementation_module_surface",
      "aggregate_domain_model_surface",
      "aggregate_sunny_day_sequence_surface",
      "implementation_stack_profile"
    ],
    outputs: ["component_realization_schedule_surface"]
  }),
  entry({
    name: "derive_component_code_surface",
    intent: "Materialize or repair component-shaped implementation code from component topology, realization schedule, and any admitted component repair schedule.",
    inputs: [
      "implementation_component_topology_surface",
      "component_realization_schedule_surface",
      "implementation_stack_profile"
    ],
    outputs: ["component_code_surface"]
  }),
  entry({
    name: "qualify_component_realization_surface",
    intent: "Qualify component code against the declared implementation component topology.",
    inputs: [
      "implementation_component_topology_surface",
      "component_code_surface"
    ],
    outputs: ["component_realization_qualification_surface"]
  }),
  entry({
    name: "derive_realization_schedule_surface",
    intent: "Derive governed realization schedule from implementation design, modules, and stack profile.",
    inputs: [
      "implementation_design_surface",
      "implementation_module_surface",
      "aggregate_domain_model_surface",
      "aggregate_sunny_day_sequence_surface",
      "implementation_component_topology_surface",
      "component_realization_schedule_surface",
      "implementation_stack_profile"
    ],
    outputs: ["realization_schedule_surface"]
  }),
  entry({
    name: "derive_code_surface",
    intent: "Derive governed code from implementation modules, stack profile, and admitted realization schedule.",
    inputs: [
      "implementation_module_surface",
      "implementation_stack_profile",
      "realization_schedule_surface",
      "implementation_component_topology_surface",
      "component_code_surface",
      "component_realization_qualification_surface"
    ],
    outputs: ["code_surface"]
  }),
  entry({
    name: "derive_test_design_surface",
    intent: "Derive recursive test design from design and scenarios.",
    inputs: ["design_surface", "scenario_surface"],
    outputs: ["test_design_surface"]
  }),
  entry({
    name: "select_test_stack_profile",
    intent: "Select the test stack profile for the current test design.",
    inputs: ["test_design_surface"],
    outputs: ["test_stack_profile"]
  }),
  entry({
    name: "derive_test_module_surface",
    intent: "Derive test module structure and planned validation allocation.",
    inputs: ["test_design_surface", "test_stack_profile"],
    outputs: ["test_module_surface"]
  }),
  entry({
    name: "derive_test_component_topology_surface",
    intent: "Derive test-class topology and TC allocation over implementation component topology.",
    inputs: [
      "test_design_surface",
      "test_module_surface",
      "implementation_component_topology_surface"
    ],
    outputs: ["test_component_topology_surface"]
  }),
  entry({
    name: "derive_component_test_surface",
    intent: "Materialize or repair component-shaped test code from test component topology, component code, and any admitted component repair schedule.",
    inputs: [
      "test_component_topology_surface",
      "component_code_surface",
      "test_stack_profile"
    ],
    outputs: ["component_test_surface"]
  }),
  entry({
    name: "derive_test_schedule_surface",
    intent: "Derive governed test execution schedule from test design, modules, and stack profile.",
    inputs: [
      "test_design_surface",
      "test_module_surface",
      "test_stack_profile",
      "aggregate_domain_model_surface",
      "aggregate_sunny_day_sequence_surface",
      "test_component_topology_surface",
      "component_test_surface"
    ],
    outputs: ["test_schedule_surface"]
  }),
  entry({
    name: "prepare_test_execution_surface",
    intent: "Prepare command-side test execution transition surface from the admitted test schedule.",
    inputs: ["test_schedule_surface"],
    outputs: ["test_execution_surface"]
  }),
  entry({
    name: "derive_test_execution_result_surface",
    intent: "Admit governed test execution evidence before archive publication.",
    inputs: ["test_execution_surface", "test_schedule_surface"],
    outputs: ["test_execution_result_surface"]
  }),
  entry({
    name: "qualify_component_test_execution_surface",
    intent: "Qualify component test execution evidence against test component topology and materialized component tests.",
    inputs: [
      "test_execution_result_surface",
      "test_component_topology_surface",
      "component_test_surface"
    ],
    outputs: ["component_test_qualification_surface"]
  }),
  entry({
    name: "derive_component_repair_schedule_surface",
    intent: "Derive a bounded component repair schedule from admitted component execution failure rows, execution result truth, and component realization qualification.",
    inputs: [
      "component_test_qualification_surface",
      "test_execution_result_surface",
      "component_realization_qualification_surface"
    ],
    outputs: ["component_repair_schedule_surface"]
  }),
  entry({
    name: "derive_test_run_archive_surface",
    intent: "Derive governed test run archive surface from admitted test execution result truth and component repair schedule state.",
    inputs: [
      "test_module_surface",
      "test_stack_profile",
      "test_schedule_surface",
      "test_execution_result_surface",
      "component_test_qualification_surface",
      "component_repair_schedule_surface"
    ],
    outputs: ["test_run_archive_surface"]
  }),
  entry({
    name: "qualify_testcase_authority",
    intent: "Qualify UAT and scenario surfaces as testcase authority.",
    inputs: ["uat_testcases_surface", "scenario_surface"],
    outputs: ["testcase_authority_surface"]
  }),
  entry({
    name: "derive_release_depth_parity_surface",
    intent: "Derive release depth parity evidence from component realization, component tests, and admitted test run archive truth.",
    inputs: [
      "implementation_component_topology_surface",
      "component_realization_qualification_surface",
      "component_test_qualification_surface",
      "component_repair_schedule_surface",
      "test_run_archive_surface"
    ],
    outputs: ["release_depth_parity_surface"]
  }),
  entry({
    name: "prepare_release_surface",
    intent: "Prepare release readiness from requirements, design, code, tests, and archive evidence.",
    inputs: [
      "requirement_surface",
      "design_surface",
      "scenario_surface",
      "code_surface",
      "testcase_authority_surface",
      "test_run_archive_surface",
      "component_repair_schedule_surface",
      "release_depth_parity_surface"
    ],
    outputs: ["release_surface"]
  })
]);

export const OPERATIONAL_FUNCTION_CATALOG = Object.freeze([
  entry({
    name: "prepare_build_execution_surface",
    intent: "Prepare command-side build transition surface.",
    inputs: ["release_surface"],
    outputs: ["build_execution_surface"]
  }),
  entry({
    name: "derive_build_execution_result_surface",
    intent: "Admit returned build result or pending build state.",
    inputs: ["build_execution_surface"],
    outputs: ["build_execution_result_surface"]
  }),
  entry({
    name: "prepare_deployment_surface",
    intent: "Prepare command-side deployment transition surface.",
    inputs: ["release_surface"],
    outputs: ["deployment_surface"]
  }),
  entry({
    name: "derive_deployment_result_surface",
    intent: "Admit returned deployment result or pending deployment state.",
    inputs: ["deployment_surface"],
    outputs: ["deployment_result_surface"]
  }),
  entry({
    name: "derive_deployed_environment_surface",
    intent: "Project current deployed environment from deployment result.",
    inputs: ["deployment_result_surface"],
    outputs: ["deployed_environment_surface"]
  }),
  entry({
    name: "derive_runtime_observation_surface",
    intent: "Bind returned runtime evidence back into the worksite.",
    inputs: ["deployment_result_surface", "test_run_archive_surface"],
    outputs: ["runtime_observation_surface"]
  }),
  entry({
    name: "derive_retrofit_plan_surface",
    intent: "Plan the next retrofit wave from runtime observation and release state.",
    inputs: ["runtime_observation_surface", "release_surface"],
    outputs: ["retrofit_plan_surface"]
  })
]);

export const TRIAGE_FUNCTION_CATALOG = Object.freeze([
  entry({
    name: "observe_gap_pressure",
    intent: "Project current gap pressure from gap dossier and requirement closure truth.",
    inputs: ["sdlc_gap_dossier", "sdlc_requirement_closure_register"],
    outputs: ["gap_observation_surface"]
  }),
  entry({
    name: "classify_gap_triage",
    intent: "Classify observed pressure into framework layer, condition, and process outcome.",
    inputs: ["gap_observation_surface"],
    outputs: ["gap_triage_surface"]
  }),
  entry({
    name: "bind_gap_route",
    intent: "Bind triage classification to lawful re-entry and public start target.",
    inputs: ["gap_observation_surface", "gap_triage_surface"],
    outputs: ["gap_route_surface"]
  }),
  entry({
    name: "propose_constitutional_repricing",
    intent: "Publish a gated constitutional repricing proposal without applying it.",
    inputs: ["gap_triage_surface"],
    outputs: ["repricing_proposal_surface"]
  }),
  entry({
    name: "route_ticket_work_item",
    intent: "Project ticket/work-item routing under TICKET_METHOD authority.",
    inputs: ["gap_route_surface"],
    outputs: ["ticket_work_item_route_surface"]
  }),
  entry({
    name: "retire_gap_after_loopback",
    intent: "Publish gap retirement state after loopback over renewed closure truth.",
    inputs: ["gap_observation_surface", "sdlc_requirement_closure_register"],
    outputs: ["gap_retirement_surface"]
  })
]);

export const LITE_FUNCTION_CATALOG = Object.freeze([
  entry({
    name: FG_DERIVE_LITE_DESIGN_ADR_SURFACE,
    intent: "Derive a compact design/ADR authority surface for a bounded implementation slice without expanding the full solution architecture graph.",
    inputs: ["input_set"],
    outputs: ["implementation_design_surface"],
    graphTrackPublication: "overlay_only"
  }),
  entry({
    name: FG_DERIVE_LITE_MODULE_SURFACE,
    intent: "Derive compact module authority from the lite design/ADR surface for immediate implementation.",
    inputs: ["implementation_design_surface"],
    outputs: ["implementation_module_surface"],
    graphTrackPublication: "overlay_only"
  }),
  entry({
    name: FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
    intent: "Materialize a bounded component implementation from lite design/ADR and module authority without expanding through full topology, stack profile, or realization scheduling.",
    inputs: [
      "implementation_design_surface",
      "implementation_module_surface"
    ],
    outputs: ["component_code_surface"],
    graphTrackPublication: "overlay_only"
  })
]);

export const SDLC_FUNCTION_CATALOG = Object.freeze([
  ...BOOTSTRAP_RELEASE_FUNCTION_CATALOG,
  ...LITE_FUNCTION_CATALOG,
  ...OPERATIONAL_FUNCTION_CATALOG,
  ...TRIAGE_FUNCTION_CATALOG
]);
