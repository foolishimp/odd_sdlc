export type OddSdlcDefaultTraversalStrategy =
  | "full_breadth"
  | "steel_thread"
  | "targeted_repair";

const ODD_SDLC_DEFAULT_TRAVERSAL_EDGE_STRATEGIES: Readonly<
  Record<string, OddSdlcDefaultTraversalStrategy>
> = Object.freeze({
    derive_intent_surface: "full_breadth",
    derive_product_surface: "full_breadth",
    derive_goal_surface: "full_breadth",
    derive_requirement_surface: "full_breadth",
    intent_surface: "full_breadth",
    product_surface: "full_breadth",
    goal_surface: "full_breadth",
    requirement_surface: "full_breadth",
    derive_feature_decomp_surface: "steel_thread",
    derive_uat_testcases_surface: "steel_thread",
    derive_design_surface: "steel_thread",
    derive_scenario_surface: "steel_thread",
    derive_implementation_design_surface: "steel_thread",
    derive_implementation_module_surface: "steel_thread",
    derive_aggregate_domain_model_surface: "steel_thread",
    derive_aggregate_sunny_day_sequence_surface: "steel_thread",
    derive_implementation_component_topology_surface: "steel_thread",
    derive_code_surface: "steel_thread",
    derive_test_execution_result_surface: "full_breadth",
    derive_test_run_archive_surface: "full_breadth",
    qualify_testcase_authority: "full_breadth",
    prepare_release_surface: "full_breadth",
    feature_decomp_surface: "steel_thread",
    uat_testcases_surface: "steel_thread",
    design_surface: "steel_thread",
    scenario_surface: "steel_thread",
    implementation_design_surface: "steel_thread",
    implementation_module_surface: "steel_thread",
    aggregate_domain_model_surface: "steel_thread",
    aggregate_sunny_day_sequence_surface: "steel_thread",
    implementation_component_topology_surface: "steel_thread",
    code_surface: "steel_thread",
    test_execution_result_surface: "full_breadth",
    test_run_archive_surface: "full_breadth",
  release_surface: "full_breadth"
});

function deriveDefaultEdgeScopeRefs(input: {
  readonly edgeStrategies: Readonly<Record<string, OddSdlcDefaultTraversalStrategy>>;
}): Readonly<Record<string, readonly string[]>> {
  const refs: Record<string, readonly string[]> = {};
  for (const [edgeName, strategy] of Object.entries(input.edgeStrategies)) {
    if (strategy !== "full_breadth") {
      refs[edgeName] = Object.freeze([
        `schedule://odd_sdlc/${edgeName}/cdme-compiler`
      ]);
    }
  }
  return Object.freeze(refs);
}

export const ODD_SDLC_DEFAULT_TRAVERSAL_STRATEGY_PLAN = Object.freeze({
  kind: "sdlc_traversal_strategy_plan" as const,
  planVersion: "ts-strategy-plan-v1" as const,
  planRef: "strategy-plan://odd_sdlc/typescript/default-data-mapper-rc2",
  defaultStrategy: "full_breadth" as const,
  edgeStrategies: ODD_SDLC_DEFAULT_TRAVERSAL_EDGE_STRATEGIES,
  edgeScopeRefs: deriveDefaultEdgeScopeRefs({
    edgeStrategies: ODD_SDLC_DEFAULT_TRAVERSAL_EDGE_STRATEGIES
  })
});

export function defaultSdlcTraversalStrategyForName(
  name: string
): OddSdlcDefaultTraversalStrategy {
  return (
    ODD_SDLC_DEFAULT_TRAVERSAL_STRATEGY_PLAN.edgeStrategies[name] ??
    ODD_SDLC_DEFAULT_TRAVERSAL_STRATEGY_PLAN.defaultStrategy
  );
}

export function defaultSdlcTraversalScopeRefsForName(
  name: string
): readonly string[] {
  const scopedRefs = ODD_SDLC_DEFAULT_TRAVERSAL_STRATEGY_PLAN.edgeScopeRefs[name];
  if (scopedRefs !== undefined) {
    return Object.freeze([...scopedRefs]);
  }
  return Object.freeze([
    `schedule://odd_sdlc/${name}/primary`
  ]);
}
