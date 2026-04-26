// Implements: REQ-F-ODDSDLC-013
// Implements: REQ-F-ODDSDLC-014
// Implements: REQ-F-ODDSDLC-015
// Implements: REQ-F-ODDSDLC-021
// Implements: REQ-F-ODDSDLC-038

export interface SdlcFunctionCatalogEntry {
  readonly kind: "sdlc_function_catalog_entry";
  readonly name: string;
  readonly intent: string;
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly backingGraphFunction: string;
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
  readonly functions: readonly SdlcFunctionCatalogEntry[];
  readonly executives: readonly SdlcExecutiveProgramEntry[];
}

function entry(input: {
  readonly name: string;
  readonly intent: string;
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
}): SdlcFunctionCatalogEntry {
  return Object.freeze({
    kind: "sdlc_function_catalog_entry",
    name: input.name,
    intent: input.intent,
    inputs: Object.freeze([...input.inputs]),
    outputs: Object.freeze([...input.outputs]),
    backingGraphFunction: input.name
  });
}

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
    intent: "Derive operator UAT testcase structure from requirements.",
    inputs: ["requirement_surface"],
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
    intent: "Derive implementation module structure and requirement allocation.",
    inputs: ["implementation_design_surface", "implementation_stack_profile"],
    outputs: ["implementation_module_surface"]
  }),
  entry({
    name: "derive_code_surface",
    intent: "Derive governed code from implementation modules and stack profile.",
    inputs: ["implementation_module_surface", "implementation_stack_profile"],
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
    name: "derive_test_run_archive_surface",
    intent: "Derive governed test run archive evidence surface.",
    inputs: ["test_module_surface", "test_stack_profile"],
    outputs: ["test_run_archive_surface"]
  }),
  entry({
    name: "qualify_testcase_authority",
    intent: "Qualify UAT and scenario surfaces as testcase authority.",
    inputs: ["uat_testcases_surface", "scenario_surface"],
    outputs: ["testcase_authority_surface"]
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
      "test_run_archive_surface"
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
    name: "prepare_test_execution_surface",
    intent: "Prepare command-side test execution transition surface.",
    inputs: ["release_surface"],
    outputs: ["test_execution_surface"]
  }),
  entry({
    name: "derive_test_execution_result_surface",
    intent: "Admit returned test execution evidence.",
    inputs: ["test_execution_surface", "test_run_archive_surface"],
    outputs: ["test_execution_result_surface"]
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

export const SDLC_FUNCTION_CATALOG = Object.freeze([
  ...BOOTSTRAP_RELEASE_FUNCTION_CATALOG,
  ...OPERATIONAL_FUNCTION_CATALOG,
  ...TRIAGE_FUNCTION_CATALOG
]);
