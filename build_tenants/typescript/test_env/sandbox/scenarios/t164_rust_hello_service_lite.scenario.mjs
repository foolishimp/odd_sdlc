// T-164 Rust hello service lite traversal scenario.
// Builds a minimal Rust HTTP service and verifies it with curl in the live lane.

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FG_CONFORM_PROJECT,
  SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF
} from "../../../build/semantic/code/src/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = resolve(HERE, "../../fixtures/t164_rust_hello_service_lite");

export const T164_RUST_HELLO_SERVICE_LITE_FIXTURE_ROOT = FIXTURE_ROOT;
export const T164_RUST_HELLO_SERVICE_LITE_SOURCE_FILES = Object.freeze([
  "bootstrap.md",
  ".ai-workspace/context/project_constraints.yml"
]);

export const T164_RUST_HELLO_SERVICE_REQUIREMENT_IDS = Object.freeze([
  "REQ-T164-RUST-SVC-001",
  "REQ-T164-RUST-SVC-002",
  "REQ-T164-RUST-SVC-003",
  "REQ-T164-RUST-SVC-004",
  "REQ-T164-RUST-SVC-005"
]);

export const t164RustHelloServiceLiteScenario = Object.freeze({
  scenarioId: "scenario_t164_rust_hello_service_lite",
  installedPackageName: "odd-sdlc-scenario-t164-rust-hello-service-lite",
  fixture: {
    root: FIXTURE_ROOT,
    sourceFiles: T164_RUST_HELLO_SERVICE_LITE_SOURCE_FILES
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
    firstStartTargetGraphFunction: FG_CONFORM_PROJECT,
    firstStartOverlayRef: SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF,
    requirementIds: T164_RUST_HELLO_SERVICE_REQUIREMENT_IDS,
    archiveArtifacts: ["conform_project_report.json"]
  },
  startTarget: "overlay:bootstrap-requirements",
  startUntil: "first_traversal",
  maxAdvances: 1
});

export function t164RustHelloServiceLiteLiveScenario({
  worker,
  maxAdvances = 16,
  startUntil = "first_traversal"
}) {
  if (typeof worker !== "string" || worker.length === 0) {
    throw new Error("t164RustHelloServiceLiteLiveScenario requires a worker URI");
  }
  return Object.freeze({
    ...t164RustHelloServiceLiteScenario,
    scenarioId: "scenario_t164_rust_hello_service_lite_live",
    installedPackageName:
      "odd-sdlc-scenario-t164-rust-hello-service-lite-live",
    expectations: {
      workspaceFiles: [
        "build_tenants/hello_world_rust_service/Cargo.toml",
        "build_tenants/hello_world_rust_service/src/main.rs"
      ],
      materializationEvidenceWorkspaceFiles: [
        "build_tenants/hello_world_rust_service/Cargo.toml",
        "build_tenants/hello_world_rust_service/src/main.rs"
      ],
      handoffEdgeSequencePrefix: [
        "bootstrap_requirements",
        "derive_lite_design_adr_surface",
        "derive_lite_module_surface",
        "derive_lite_component_code_surface"
      ],
      processChecks: [
        {
          command: "bash",
          args: [
            "-lc",
            [
              "log=$(mktemp)",
              "port=${HELLO_SERVICE_PORT:-$((18000 + ($$ % 1000)))}",
              "HELLO_SERVICE_PORT=$port cargo run --quiet >\"$log\" 2>&1 &",
              "pid=$!",
              "trap 'kill \"$pid\" 2>/dev/null || true; rm -f \"$log\"' EXIT",
              "for _ in $(seq 1 200); do",
              "  body=$(curl --fail --silent \"http://127.0.0.1:$port/\" 2>/dev/null || true)",
              "  if [ \"$body\" = \"helloworld\" ]; then",
              "    printf '%s\\n' \"$body\"",
              "    exit 0",
              "  fi",
              "  sleep 0.2",
              "done",
              "cat \"$log\" >&2",
              "exit 1"
            ].join("\n")
          ],
          cwd: "build_tenants/hello_world_rust_service",
          stdout: "helloworld"
        }
      ],
      latestArchiveArtifacts: [
        "sdlc_overlay_segment_completion.json"
      ]
    },
    liveWorker: worker,
    startTarget: "overlay:lite-design-module-implementation",
    startTargetSequence: Object.freeze([
      "overlay:bootstrap-requirements",
      "overlay:bootstrap-requirements"
    ]),
    startUntil,
    maxAdvances,
    continueOnEdgeConverge: true,
    stopAfterWorkspaceFilesExist: true
  });
}
