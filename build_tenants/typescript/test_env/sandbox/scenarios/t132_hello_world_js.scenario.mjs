// T-132 JavaScript hello-world scenario.
// Uses the generic scenario sandbox harness so the lane shares the same
// bootstrap -> ABG sandbox -> odd_sdlc install -> gaps/start recipe as T-131.

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
  FG_DERIVE_LITE_DESIGN_ADR_SURFACE,
  FG_CONFORM_PROJECT,
  SDLC_FRAMEWORK_SMOKE_MIN_FP_OVERLAY_REF
} from "../../../build/semantic/code/src/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = resolve(HERE, "../../fixtures/t132_hello_world_single_tenant");

export const T132_HELLO_WORLD_JS_FIXTURE_ROOT = FIXTURE_ROOT;
export const T132_HELLO_WORLD_JS_SOURCE_FILES = Object.freeze([
  "bootstrap.md",
  ".ai-workspace/context/project_constraints.yml",
  "build_tenants/hello_world_javascript/spec/TECH_STACK.json"
]);
export const T132_HELLO_WORLD_JS_REQUIREMENT_IDS = Object.freeze([
  "REQ-T132-001"
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

export const T132_HELLO_WORLD_JS_MIN_FP_EDGES = Object.freeze([
  FG_DERIVE_LITE_DESIGN_ADR_SURFACE,
  FG_DERIVE_LITE_COMPONENT_CODE_SURFACE
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
  startUntil = "converged"
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
      archiveArtifacts: [],
      workspaceFiles: [
        "build_tenants/hello_world_javascript/spec/TECH_STACK.json",
        "build_tenants/hello_world_javascript/src/hello.js",
        "build_tenants/hello_world_javascript/test/hello.test.js"
      ],
      materializationEvidenceWorkspaceFiles: [
        "build_tenants/hello_world_javascript/src/hello.js",
        "build_tenants/hello_world_javascript/test/hello.test.js"
      ],
      exactHandoffEdgeSequence: T132_HELLO_WORLD_JS_MIN_FP_EDGES,
      handoffEdgeSequencePrefix: T132_HELLO_WORLD_JS_MIN_FP_EDGES,
      edgeAssuranceArchiveSequencePrefix: T132_HELLO_WORLD_JS_MIN_FP_EDGES,
      firstHandoffOverlayRef: SDLC_FRAMEWORK_SMOKE_MIN_FP_OVERLAY_REF,
      latestArchiveArtifacts: [
        "sdlc_decomposition_summary.json",
        "sdlc_implementation_decomposition_summary.json",
        "sdlc_module_dependency_map.json",
        "sdlc_module_dependency_traversal_selection.json",
        "sdlc_traversal_hop_selection.json",
        "worker_result_report.json"
      ],
      latestArchiveJsonAssertions: [
        {
          file: "sdlc_decomposition_summary.json",
          equals: {
            kind: "sdlc_decomposition_summary",
            admissionDecision: "admit",
            upstreamCount: 1,
            downstreamCount: 1,
            upstreamPerDownstreamRatio: 1,
            downstreamPerUpstreamRatio: 1,
            blockingReasons: []
          }
        },
        {
          file: "sdlc_traversal_hop_selection.json",
          equals: {
            kind: "sdlc_traversal_hop_selection",
            outcomeClass: "framework_smoke",
            hopClass: "single_hop",
            blockingReasons: [],
            "complexityAssessment.inputObligationCount": 1,
            "complexityAssessment.outputRowCount": 1,
            "complexityAssessment.upstreamPerDownstreamRatio": 1,
            "complexityAssessment.downstreamPerUpstreamRatio": 1,
            "pressurePreservation.admissionDecision": "admit",
            "pressurePreservation.mechanism": "outcome_class_graph_variant"
          }
        }
      ],
      processChecks: [
        {
          command: "node",
          args: ["src/hello.js"],
          cwd: "build_tenants/hello_world_javascript",
          stdout: "Hello, world!"
        },
        {
          command: "node",
          args: ["--test", "test/hello.test.js"],
          cwd: "build_tenants/hello_world_javascript",
          exitCode: 0
        }
      ]
    },
    liveWorker: worker,
    startTarget: "next",
    startUntil,
    maxAdvances: 1,
    stopAfterGraphClose: true,
    stopAfterWorkspaceFilesExist: false
  });
}
