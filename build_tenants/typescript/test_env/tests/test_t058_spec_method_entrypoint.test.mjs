// Validates: REQ-F-ODDSDLC-040
// Validates: REQ-F-ODDSDLC-041
// Validates: REQ-F-ODDSDLC-043
// Validates: T-058

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  constructFrameOpenedEvent,
  constructGraphCallOpenedEvent,
  constructVectorClosedEvent,
  constructVectorTraversalPlannedEvent,
  materializeGraphFunction
} from "@abiogenesis/typescript-tenant";

import {
  FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
  FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF,
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule,
  projectOddSdlcWorkspaceGaps,
  projectOddSdlcWorkspaceQueryDomain,
  projectOddSdlcWorkspaceStart
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-ts-cli-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# CLI Fixture", "", "REQ-CLI-001: Fixture readme authority."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    ["# Intent", "", "**Project**: CLI Fixture", "", "INT-001: Govern CLI fixture."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-cli.md"),
    ["# Requirements", "", "REQ-CLI-002: Preserve public command adapter law."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: cli_fixture",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "ambiguity_risk_appetite: medium"
    ].join("\n"),
    "utf8"
  );
  return root;
}

function makeConformantWorkspace() {
  const root = makeWorkspace();
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    ["# Goals", "", "GOAL-CLI-001: Exercise typed workspace projection API."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    ["# Product", "", "PRODUCT-CLI-001: CLI fixture product surface."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    ["# Imported Sources", "", "- README.md", "- specification/INTENT.md"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    ["# Project Bootstrap", "", "Source package: CLI fixture."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/TENANT_REGISTRY.md"),
    ["# Tenant Registry", "", "- typescript: build_tenants/typescript"].join("\n"),
    "utf8"
  );
  return root;
}

function writeRuntimeEvents(workspace, events) {
  const eventsRoot = path.join(workspace, ".ai-workspace/events");
  mkdirSync(eventsRoot, { recursive: true });
  writeFileSync(
    path.join(eventsRoot, "events.jsonl"),
    `${events.map((event) => JSON.stringify(event)).join("\n")}\n`,
    "utf8"
  );
}

function graphFunctionTarget(handle) {
  return { kind: "graph_function", handle };
}

function assetTarget(handle) {
  return { kind: "asset", handle };
}

function overlayTarget(handle) {
  return { kind: "overlay", handle };
}

function workspaceGaps(workspaceRoot, input = {}) {
  return projectOddSdlcWorkspaceGaps({ workspaceRoot, ...input });
}

function graphTrackRefs(graphFunctionName) {
  const graphFunction = constructSdlcGtlModule().graphFunctions.find(
    (candidate) => candidate.name === graphFunctionName
  );
  assert(graphFunction);
  const vector = materializeGraphFunction(graphFunction).vectors[0];
  assert(vector);
  return {
    graphFunctionRef: graphFunction.name,
    graphVectorRef: vector.name
  };
}

function writePostCloseNextActionArchive(workspace, input = {}) {
  const archiveRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs",
    input.name ?? "20260510T000000000Z_pid1"
  );
  mkdirSync(archiveRoot, { recursive: true });
  const decisionRef =
    input.decisionRef ??
    `closure-decision://t058/${input.name ?? "post-close"}`;
  const graphFunctionName =
    input.graphFunctionName ?? "derive_component_code_surface";
  const trackRefs = graphTrackRefs(graphFunctionName);
  const effectiveNextGraphFunctionRef =
    input.nextGraphFunctionRef === undefined
      ? input.choosesNextTraversal === false
        ? null
        : trackRefs.graphFunctionRef
      : input.nextGraphFunctionRef;
  const effectiveNextGraphVectorRef =
    input.nextGraphVectorRef === undefined
      ? effectiveNextGraphFunctionRef === null
        ? null
        : trackRefs.graphVectorRef
      : input.nextGraphVectorRef;
  writeFileSync(
    path.join(archiveRoot, "worker_invocation_package.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_worker_invocation_package",
        graphFunctionName,
        edgeName: graphFunctionName
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "sdlc_edge_closure_decision.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_edge_closure_decision",
        decisionRef,
        disposition: "close",
        ...(input.overlayRef === undefined
          ? {}
          : { overlayRef: input.overlayRef }),
        ...(input.admittedOverlayBindingRef === undefined
          ? {}
          : { overlayBindingRef: input.admittedOverlayBindingRef })
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "sdlc_edge_fulfillment_ledger.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_edge_fulfillment_ledger",
        ledgerRef: `ledger://t058/${input.name ?? "post-close"}`,
        ledgerVersionRef: `ledger-version://t058/${input.name ?? "post-close"}/1`,
        ...(input.overlayRef === undefined
          ? {}
          : { overlayRef: input.overlayRef }),
        ...(input.admittedOverlayBindingRef === undefined
          ? {}
          : { overlayBindingRef: input.admittedOverlayBindingRef }),
        counts: {
          expected: 1,
          fulfilled: 1,
          partial: 0,
          blocked: 0,
          unfulfilled: 0,
          missing: 0,
          extra: 0
        },
        edgeConverged: true
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "sdlc_next_action_projection.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_next_action_projection",
        choosesNextTraversal: input.choosesNextTraversal ?? true,
        selectedActionRef:
          input.selectedActionRef === undefined
            ? "construction-action://t058/materialize"
            : input.selectedActionRef,
        nextActionProjectionRef:
          input.nextActionProjectionRef ??
          "construction-priority-projection://t058/post-close/materialize",
        nextGraphFunctionRef: effectiveNextGraphFunctionRef,
        nextGraphVectorRef: effectiveNextGraphVectorRef,
        predecessorRefs: input.predecessorRefs ?? [decisionRef],
        ...(input.overlayRef === undefined
          ? {}
          : { overlayRef: input.overlayRef }),
        ...(input.overlayBindingRef === undefined
          ? {}
          : { overlayBindingRef: input.overlayBindingRef })
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

function writePassedComputeWithoutBindArchive(workspace, input = {}) {
  const archiveRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs",
    input.name ?? "20260510T000200000Z_pid3"
  );
  mkdirSync(archiveRoot, { recursive: true });
  const graphFunctionName =
    input.graphFunctionName ?? "derive_component_code_surface";
  writeFileSync(
    path.join(archiveRoot, "worker_result_report.json"),
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName,
        edgeName: graphFunctionName,
        targetAssetType: "component_code_surface",
        outputFile: path.join(workspace, "build_tenants/typescript/src/index.ts"),
        materializedFiles: [],
        materializationDiagnostics: [],
        executionEvidence: null,
        executionEvidenceErrors: [],
        obligationAssessments: []
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "postflight.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_operator_postflight_result",
        status: "passed",
        blockingReasons: [],
        blockingReasonCarriers: [],
        evidenceRefs: []
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "fp_evaluate_result.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_fp_evaluate_result",
        status: "passed",
        postflightStatus: "passed",
        blockingReasons: [],
        evidenceRefs: [],
        obligationAssessmentCounts: {
          total: 0,
          fulfilled: 0,
          partial: 0,
          blocked: 0,
          unassessed: 0,
          extra: 0
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  return archiveRoot;
}

test("T-058 workspace catalog API reads graph catalog without workspace mutation", () => {
  const result = constructSdlcGraphFunctionCatalog();

  assert(
    result.functions.some(
      (entry) => entry.backingGraphFunction === "derive_code_surface"
    )
  );
  assert(
    result.executives.some(
      (entry) => entry.backingGraphFunction === "bootstrap_release_self_test"
    )
  );
});

test("T-058 vector-backed post-close next action becomes the next start target", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace);

  const result = workspaceGaps(workspace);

  assert.equal(
    result.start.executionContract.targetGraphFunction,
    "derive_component_code_surface"
  );
  assert.equal(
    result.projection.currentEdge,
    "derive_component_code_surface"
  );
  assert.equal(
    result.start.executionContract.nextActionProjection.nextGraphVectorRef,
    graphTrackRefs("derive_component_code_surface").graphVectorRef
  );
});

test("T-204 workspace start projection reads replay-visible next action", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace);

  const start = projectOddSdlcWorkspaceStart({
    workspaceRoot: workspace,
    target: { kind: "next", handle: "next" },
    until: "blocked"
  });

  assert.equal(start.kind, "sdlc_public_start_blocked");
  assert.equal(start.blockingReason, "fp_worker_unattached");
  assert.equal(
    start.executionContract?.targetGraphFunction,
    "derive_component_code_surface"
  );
  assert.equal(
    start.executionContract?.nextActionProjection.nextGraphVectorRef,
    graphTrackRefs("derive_component_code_surface").graphVectorRef
  );
});

test("T-158 archived next traversal does not compare predecessor overlay binding to the next edge binding", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace, {
    graphFunctionName: "Fg_conform_project_authority",
    nextGraphFunctionRef: "derive_feature_decomp_surface",
    nextGraphVectorRef: "derive_feature_decomp_surface",
    overlayRef: "overlay://odd-sdlc/current-full-traversal",
    overlayBindingRef: "overlay-binding://odd-sdlc/predecessor-edge-binding"
  });

  const result = workspaceGaps(workspace);

  assert.equal(
    result.start.executionContract.targetGraphFunction,
    "derive_feature_decomp_surface"
  );
  assert.equal(result.start.executionContract.requestedUntil, "blocked");
  assert.equal(
    result.start.executionContract.nextActionProjection.nextGraphVectorRef,
    "derive_feature_decomp_surface"
  );
  assert.notEqual(
    result.start.executionContract.overlayBindingRef,
    "overlay-binding://odd-sdlc/predecessor-edge-binding"
  );
});

test("T-170 archived next traversal preserves target-next basis identity", () => {
  const workspace = makeConformantWorkspace();
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t132_hello_world_single_tenant",
      "  overlay_strategy: thread",
      "  overlay_ref: overlay://odd-sdlc/lite-design-module-implementation",
      "active_tenant: hello_world_javascript",
      "selected_output_root: build_tenants/hello_world_javascript",
      "ambiguity_risk_appetite: low",
      "build_tenants:",
      "  hello_world_javascript:",
      "    output_dir: build_tenants/hello_world_javascript",
      "    language: JavaScript",
      "    build_tool: node",
      "    test_runner: node",
      "    module_structure:",
      "      - hello_world_javascript"
    ].join("\n"),
    "utf8"
  );
  writePostCloseNextActionArchive(workspace, {
    graphFunctionName: FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
    nextGraphFunctionRef: FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
    nextGraphVectorRef: FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
    overlayRef: SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF
  });

  const result = workspaceGaps(workspace);

  assert.equal(
    result.start.executionContract.targetGraphFunction,
    FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE
  );
  assert.equal(
    result.start.executionContract.nextActionProjection.nextGraphVectorRef,
    FG_DERIVE_LITE_COMPONENT_CODE_SURFACE
  );
  assert.match(
    result.start.executionContract.overlayBindingRef,
    /public-start%2Fnext%2Fnext/
  );
  assert.doesNotMatch(
    result.start.executionContract.overlayBindingRef,
    /public-start%2Fgraph_function/
  );
});

test("T-160 archived overlay replay preserves prior vector replay basis", () => {
  const workspace = makeConformantWorkspace();
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t160_hello_world_rust_lite",
      "  overlay_strategy: thread",
      "  overlay_ref: overlay://odd-sdlc/lite-design-module-implementation",
      "active_tenant: hello_world_rust",
      "selected_output_root: build_tenants/hello_world_rust",
      "ambiguity_risk_appetite: low",
      "build_tenants:",
      "  hello_world_rust:",
      "    output_dir: build_tenants/hello_world_rust",
      "    language: Rust",
      "    build_tool: cargo",
      "    test_runner: cargo",
      "    module_structure:",
      "      - hello_world_rust"
    ].join("\n"),
    "utf8"
  );

  const initial = workspaceGaps(workspace, {
    target: overlayTarget("lite-design-module-implementation")
  });
  const basis = initial.start.executionContract.basis;
  writeRuntimeEvents(workspace, [
    constructGraphCallOpenedEvent(basis),
    constructFrameOpenedEvent(basis),
    constructVectorTraversalPlannedEvent({ basis, vectorIndex: 0 }),
    constructVectorClosedEvent({
      basis,
      vectorIndex: 0,
      closureKind: "advanced"
    })
  ]);
  writePostCloseNextActionArchive(workspace, {
    graphFunctionName: FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
    nextGraphFunctionRef: FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
    nextGraphVectorRef: FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
    overlayRef: SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF
  });

  const replay = workspaceGaps(workspace, {
    target: overlayTarget("lite-design-module-implementation")
  });

  assert.equal(
    replay.start.executionContract.targetGraphFunction,
    FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE
  );
  assert.equal(
    replay.start.executionContract.nextActionProjection.nextGraphVectorRef,
    FG_DERIVE_LITE_COMPONENT_CODE_SURFACE
  );
  assert.equal(
    replay.start.executionContract.basis.id,
    initial.start.executionContract.basis.id
  );
  assert.equal(
    replay.start.executionContract.overlayBindingRef,
    initial.start.executionContract.overlayBindingRef
  );
  assert.equal(
    replay.projection.currentEdge,
    FG_DERIVE_LITE_COMPONENT_CODE_SURFACE
  );
  assert.doesNotMatch(
    replay.start.executionContract.overlayBindingRef,
    /public-start%2Fgraph_function/
  );
  assert.match(
    replay.start.executionContract.overlayBindingRef,
    /public-start%2Foverlay%2Flite-design-module-implementation/
  );
});

test("T-160 archived next traversal rejects inconsistent predecessor overlay binding", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace, {
    graphFunctionName: "Fg_conform_project_authority",
    nextGraphFunctionRef: "derive_feature_decomp_surface",
    nextGraphVectorRef: "derive_feature_decomp_surface",
    overlayRef: "overlay://odd-sdlc/current-full-traversal",
    admittedOverlayBindingRef: "overlay-binding://odd-sdlc/admitted",
    overlayBindingRef: "overlay-binding://odd-sdlc/projection-drift"
  });

  const result = workspaceGaps(workspace);

  assert.equal(result.blockingReason, "stale_query_domain");
  assert.match(
    result.start.detail,
    /overlayBindingRef does not match its admitted closure\/ledger binding/
  );
});

test("T-205 passed compute archive without bind outcome fails closed", () => {
  const workspace = makeConformantWorkspace();
  writePassedComputeWithoutBindArchive(workspace);

  const result = workspaceGaps(workspace);

  assert.equal(
    result.blockingReason,
    "missing_bind_outcome_after_passed_compute"
  );
  assert.match(
    result.start.detail,
    /passed worker\/postflight\/F_P evaluation facts without the required traversal consequence triple/u
  );
  assert.match(
    JSON.stringify(result.start.evidenceRefs),
    /sdlc_edge_closure_decision\.json/u
  );
});

test("T-158 explicit graph-function target is not overridden by another archived next action", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace, {
    graphFunctionName: "derive_component_code_surface"
  });

  const result = workspaceGaps(workspace, {
    target: graphFunctionTarget("bootstrap_release_self_test")
  });

  assert.equal(
    result.start.executionContract.targetGraphFunction,
    "bootstrap_release_self_test"
  );
  assert.notEqual(
    result.start.executionContract.targetGraphFunction,
    "derive_component_code_surface"
  );
});

test("T-102 converged graph-function target resumes its archived post-close successor", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace, {
    graphFunctionName: "derive_test_execution_result_surface",
    nextGraphFunctionRef: "qualify_component_test_execution_surface",
    nextGraphVectorRef: "qualify_component_test_execution_surface",
    overlayRef: "overlay://odd-sdlc/current-full-traversal"
  });

  const result = workspaceGaps(workspace, {
    target: graphFunctionTarget("derive_test_execution_result_surface"),
    until: "converged"
  });

  assert.equal(
    result.start.executionContract.targetGraphFunction,
    "qualify_component_test_execution_surface"
  );
  assert.equal(
    result.start.executionContract.nextActionProjection.nextGraphVectorRef,
    "qualify_component_test_execution_surface"
  );
});

test("T-102 converged graph-function target resumes later same-overlay archived successor", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace, {
    graphFunctionName: "qualify_component_test_execution_surface",
    nextGraphFunctionRef: "derive_component_repair_schedule_surface",
    nextGraphVectorRef: "derive_component_repair_schedule_surface",
    overlayRef: "overlay://odd-sdlc/current-full-traversal"
  });

  const result = workspaceGaps(workspace, {
    target: graphFunctionTarget("derive_test_execution_result_surface"),
    until: "converged"
  });

  assert.equal(
    result.start.executionContract.targetGraphFunction,
    "derive_component_repair_schedule_surface"
  );
  assert.equal(
    result.start.executionContract.nextActionProjection.nextGraphVectorRef,
    "derive_component_repair_schedule_surface"
  );
});

test("T-058 newer terminal post-close projection prevents stale next-action replay", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace, {
    name: "20260510T000000000Z_pid1"
  });
  writePostCloseNextActionArchive(workspace, {
    name: "20260510T000100000Z_pid2",
    choosesNextTraversal: false,
    selectedActionRef: null,
    nextGraphFunctionRef: null
  });

  const result = workspaceGaps(workspace);

  assert.notEqual(
    result.start.executionContract.targetGraphFunction,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
});

test("T-145 archive-only terminal closure does not retire a public gap edge", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace, {
    name: "20260510T000200000Z_pid3",
    graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    choosesNextTraversal: false,
    selectedActionRef: null,
    nextGraphFunctionRef: null
  });

  const result = workspaceGaps(workspace, {
    target: graphFunctionTarget(FG_MATERIALIZE_DECLARED_PRODUCT_ASSET)
  });

  assert.equal(result.projection.status, "open");
  assert.equal(
    result.projection.currentEdge,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  assert.equal(result.dossier.status, "open");
  assert.equal(result.dossier.edge, FG_MATERIALIZE_DECLARED_PRODUCT_ASSET);
  assert.equal(
    result.dossier.bestGraphFunctionRef,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  assert.notDeepEqual(result.dossier.nextLawfulActions, ["close_or_reprice"]);
  assert.equal(
    result.dossier.rankingReasonRefs.some((ref) =>
      ref.startsWith("terminal_closed_edge_replayed:")
    ),
    false
  );
});

test("T-058 workspace query-domain API projects admitted workspace sources", () => {
  const workspace = makeConformantWorkspace();
  const result = projectOddSdlcWorkspaceQueryDomain({ workspaceRoot: workspace });

  assert.equal(result.kind, "sdlc_query_domain_projection");
  assert.equal(result.workspaceRootUri, `file://${workspace}`);
  assert(
    result.startTargets.some(
      (entry) => entry.name === "bootstrap_release_self_test"
    )
  );
  assert(
    result.assetOwnership.some((entry) => entry.assetType === "code_surface")
  );
});

test("T-058 workspace gaps API emits read-only dossier without choosing traversal", () => {
  const workspace = makeConformantWorkspace();
  const result = workspaceGaps(workspace);

  assert.equal(result.start.kind, "sdlc_public_start_blocked");
  assert.equal(result.projection.kind, "sdlc_gap_projection");
  assert.equal(result.dossier.kind, "sdlc_gap_dossier");
  assert.equal(result.dossier.choosesNextTraversal, false);
  assert.equal(
    result.homeostaticTriage.kind,
    "sdlc_homeostatic_gap_triage_surface"
  );
  assert.equal(result.homeostaticTriage.observation.kind, "sdlc_gap_observation");
  assert.equal(
    result.homeostaticTriage.observation.requirementTransformLineage[0].kind,
    "sdlc_requirement_transform_lineage"
  );
  assert.match(
    result.homeostaticTriage.observation.requirementTransformLineage[0]
      .immediateTransformObligationRef,
    /^transform-obligation:\/\/odd-sdlc\/[^/]+\/REQ-/u
  );
  assert.equal(
    result.homeostaticTriage.observation.requirementTransformLineage[0]
      .lineageStatus,
    "lineage_observed"
  );
  assert.equal(
    result.homeostaticTriage.observation.requirementTransformLineage[0]
      .lineageSource,
    "requirement_transform_authority"
  );
  assert(
    result.homeostaticTriage.observation.requirementTransformLineage[0]
      .lineageAuthorityRefs.some((ref) =>
        ref.startsWith("requirement-transform://odd-sdlc/ingress/")
      )
  );
  assert.equal(
    result.homeostaticTriage.classification.frameworkLayer,
    "code"
  );
  assert.equal(
    result.homeostaticTriage.classification.frameworkCondition,
    "open_gap"
  );
  assert.equal(
    result.homeostaticTriage.routeBinding.targetGraphFunction,
    "derive_code_surface"
  );
  assert.equal(
    result.homeostaticTriage.routeBinding.mayApplyConstitutionalChange,
    false
  );
  assert.equal(
    `${result.homeostaticTriage.classification.frameworkLayer}/${result.homeostaticTriage.classification.frameworkCondition}`,
    "code/open_gap"
  );
});

test("T-058 workspace gaps API admits one evaluator priority surface", () => {
  const workspace = makeConformantWorkspace();
  const result = workspaceGaps(workspace, {
    evaluatorPriorityEdge: "derive_intent_surface"
  });

  assert.equal(result.projection.currentEdge, "derive_intent_surface");
  assert.equal(result.dossier.choosesNextTraversal, false);
  assert.equal(
    result.dossier.rankingAuthority,
    "abiogenesis_construction_priority_projection"
  );
  assert.equal(result.dossier.localRankingAuthority, false);
  assert.match(
    result.dossier.prioritySchemeRef,
    /^priority-scheme:\/\/odd-sdlc\/workspace-api\/gaps\//
  );
  assert.equal(
    result.dossier.bestGraphVectorRef,
    "derive_intent_surface"
  );
  assert.deepEqual(result.dossier.nextLawfulActions, [
    "construction-action:derive_intent_surface:derive_intent_surface"
  ]);
  assert(
    result.dossier.rankingReasonRefs.includes(
      "workspace-api://odd-sdlc/gaps/evaluator-priority-edge/derive_intent_surface"
    )
  );
});

test("T-058 workspace gaps priority fails closed on invalid edge selectors", () => {
  const unknownWorkspace = makeConformantWorkspace();
  assert.throws(
    () =>
      workspaceGaps(unknownWorkspace, {
        evaluatorPriorityEdge: "missing_edge"
      }),
    /does not name a published graph edge/u
  );

  const closedWorkspace = makeConformantWorkspace();
  const initial = workspaceGaps(closedWorkspace);
  const basis = initial.start.executionContract.basis;
  writeRuntimeEvents(closedWorkspace, [
    constructGraphCallOpenedEvent(basis),
    constructFrameOpenedEvent(basis),
    constructVectorTraversalPlannedEvent({ basis, vectorIndex: 0 }),
    constructVectorClosedEvent({
      basis,
      vectorIndex: 0,
      closureKind: "advanced"
    })
  ]);
  assert.throws(
    () =>
      workspaceGaps(closedWorkspace, {
        evaluatorPriorityEdge: "derive_intent_surface"
      }),
    /already closed graph edge/u
  );
});

test("T-058 workspace start projection API projects worker attachment", () => {
  const workspace = makeConformantWorkspace();
  const blocked = projectOddSdlcWorkspaceStart({
    workspaceRoot: workspace,
    target: graphFunctionTarget("bootstrap_release_self_test"),
    until: "blocked"
  });
  assert.equal(blocked.kind, "sdlc_public_start_blocked");
  assert.equal(blocked.blockingReason, "fp_worker_unattached");

  const attached = projectOddSdlcWorkspaceStart({
    workspaceRoot: workspace,
    target: assetTarget("code_surface"),
    until: "blocked",
    workerTransport: "process://codex"
  });
  assert.equal(attached.kind, "sdlc_public_start_projected");
  assert.equal(attached.status, "dispatch_required");
  assert.equal(
    attached.executionContract.targetGraphFunction,
    "derive_code_surface"
  );
});

test("T-058 workspace API entry stays free of retry/control authority", () => {
  const source = readFileSync(
    resolve(PACKAGE_ROOT, "code/src/workspace_api/entry.ts"),
    "utf8"
  );
  assert(!source.includes("deriveAdvancementTransition("));
  assert(!source.includes("installAbiogenesis"));
  assert(!source.includes("while ("));
  assert(!source.includes("retryContextOverride"));
  assert(!source.includes("MAX_INSTALLED_START_SELF_HEAL_ATTEMPTS"));
});
