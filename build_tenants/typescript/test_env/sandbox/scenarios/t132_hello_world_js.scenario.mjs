// T-132 JavaScript hello-world scenario.
// Uses the generic scenario sandbox harness so the lane shares the same
// bootstrap -> ABG sandbox -> odd_sdlc install -> gaps/start recipe as T-131.

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { FG_CONFORM_PROJECT } from "../../../build/semantic/code/src/index.js";

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
    requirementIds: T132_HELLO_WORLD_JS_REQUIREMENT_IDS,
    archiveArtifacts: ["conform_project_report.json"]
  },
  maxAdvances: 1
});

export function t132HelloWorldJsLiveScenario({
  worker,
  maxAdvances = 6,
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
      workspaceFiles: [
        "build_tenants/hello_world_javascript/src/hello.js"
      ],
      processChecks: [
        {
          command: "node",
          args: ["build_tenants/hello_world_javascript/src/hello.js"],
          stdout: "Hello, world!"
        }
      ]
    },
    liveWorker: worker,
    startTarget: "next",
    startUntil,
    maxAdvances,
    continueOnEdgeConverge: true
  });
}
