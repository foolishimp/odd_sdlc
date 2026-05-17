// T-132 JavaScript hello-world scenario.
// Uses the generic scenario sandbox harness so the lane shares the same
// bootstrap -> ABG sandbox -> odd_sdlc install -> gaps/start recipe as T-131.

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FG_CONFORM_PROJECT,
  SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF
} from "../../../build/semantic/code/src/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = resolve(HERE, "../../fixtures/t132_hello_world_single_tenant");

export const T132_HELLO_WORLD_JS_FIXTURE_ROOT = FIXTURE_ROOT;
export const T132_HELLO_WORLD_JS_SOURCE_FILES = Object.freeze([
  "bootstrap.md",
  ".ai-workspace/context/project_constraints.yml"
]);
export const T132_HELLO_WORLD_JS_REQUIREMENT_IDS = Object.freeze([
  "REQ-T132-001",
  "REQ-T132-002",
  "REQ-T132-003",
  "REQ-T132-004",
  "REQ-T132-005"
]);

export const T132_HELLO_WORLD_JS_FULL_LIFECYCLE_EDGES = Object.freeze([
  "derive_intent_surface",
  "derive_product_surface",
  "derive_goal_surface",
  "derive_requirement_surface",
  "derive_uat_testcases_surface",
  "derive_testcase_authority_surface",
  "derive_feature_decomp_surface",
  "derive_design_surface",
  "derive_scenario_surface",
  "derive_implementation_design_surface",
  "derive_component_code_surface",
  "qualify_component_realization_surface",
  "derive_code_surface",
  "derive_test_design_surface",
  "derive_component_test_surface",
  "prepare_test_execution_surface",
  "derive_test_execution_result_surface",
  "qualify_component_test_execution_surface",
  "derive_component_repair_schedule_surface",
  "derive_test_run_archive_surface",
  "derive_release_depth_parity_surface",
  "prepare_release_surface"
]);

export const t132HelloWorldJsScenario = Object.freeze({
  scenarioId: "scenario_t132_hello_world_js",
  installedPackageName: "odd-sdlc-scenario-t132-hello-world-js",
  fixture: {
    root: FIXTURE_ROOT,
    sourceFiles: T132_HELLO_WORLD_JS_SOURCE_FILES
  },
  expectations: {
    firstEdge: FG_CONFORM_PROJECT,
    firstStartStatus: "converged",
    firstEventKinds: [
      "graph_call_opened",
      "frame_opened",
      "vector_traversal_planned",
      "vector_evaluated",
      "vector_closed"
    ],
    archiveArtifacts: ["conform_project_report.json"]
  },
  maxAdvances: 1
});

export function t132HelloWorldJsLiveScenario({
  worker,
  maxAdvances = 24,
  startUntil = "first_traversal"
}) {
  if (typeof worker !== "string" || worker.length === 0) {
    throw new Error("t132HelloWorldJsLiveScenario requires a worker URI");
  }
  return Object.freeze({
    ...t132HelloWorldJsScenario,
    scenarioId: "scenario_t132_hello_world_js_live",
    installedPackageName: "odd-sdlc-scenario-t132-hello-world-js-live",
    expectations: {
      ...t132HelloWorldJsScenario.expectations,
      requirementIds: T132_HELLO_WORLD_JS_REQUIREMENT_IDS,
      workspaceFiles: [
        "specification/INTENT.md",
        "specification/PRODUCT.md",
        "specification/GOALS.md",
        "specification/requirements/10-generated-bootstrap.md",
        "specification/scenarios/20-generated-uat-testcases.md",
        "specification/scenarios/30-generated-testcase-authority.md",
        "build_tenants/hello_world_javascript/src/hello.js"
      ],
      materializationEvidenceWorkspaceFiles: [
        "specification/requirements/10-generated-bootstrap.md",
        "specification/scenarios/20-generated-uat-testcases.md",
        "specification/scenarios/30-generated-testcase-authority.md",
        "build_tenants/hello_world_javascript/src/hello.js"
      ],
      handoffEdgeSequencePrefix: T132_HELLO_WORLD_JS_FULL_LIFECYCLE_EDGES,
      edgeAssuranceArchiveSequencePrefix: T132_HELLO_WORLD_JS_FULL_LIFECYCLE_EDGES,
      firstHandoffOverlayRef: SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF,
      processChecks: []
    },
    liveWorker: worker,
    startTargetSequence: [
      "next",
      "graph_function:bootstrap_release_self_test"
    ],
    startTarget: "next",
    startUntil,
    maxAdvances,
    continueOnEdgeConverge: true,
    stopAfterWorkspaceFilesExist: false
  });
}
