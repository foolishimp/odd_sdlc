// Validates: REQ-F-ODDSDLC-040
// Validates: REQ-F-ODDSDLC-041
// Validates: REQ-F-ODDSDLC-043
// Validates: T-058

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  constructFrameOpenedEvent,
  constructGraphCallOpenedEvent,
  constructVectorClosedEvent,
  constructVectorTraversalPlannedEvent,
  materializeGraphFunction
} from "@abiogenesis/typescript-tenant";

import {
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  constructSdlcGtlModule,
  invokeOddSdlcSpecMethodCommandSync,
  serializeOddSdlcSpecMethodResult
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const CLI_MAIN = resolve(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");

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
    ["# Goals", "", "GOAL-CLI-001: Exercise Spec Method entrypoint."].join("\n"),
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
        disposition: "close"
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
        predecessorRefs: input.predecessorRefs ?? [decisionRef]
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

test("T-058 Spec Method catalog command reads graph catalog without workspace mutation", () => {
  const result = invokeOddSdlcSpecMethodCommandSync(["catalog"]);

  assert.equal(result.status, "ok");
  assert.equal(result.command, "catalog");
  assert.equal(result.exitCode, 0);
  assert(
    result.payload.functions.some(
      (entry) => entry.backingGraphFunction === "derive_code_surface"
    )
  );
  assert(
    result.payload.executives.some(
      (entry) => entry.backingGraphFunction === "bootstrap_release_self_test"
    )
  );
});

test("T-058 vector-backed post-close next action becomes the next start target", () => {
  const workspace = makeConformantWorkspace();
  writePostCloseNextActionArchive(workspace);

  const result = invokeOddSdlcSpecMethodCommandSync([
    "gaps",
    "--workspace",
    workspace
  ]);

  assert.equal(result.status, "ok");
  assert.equal(
    result.payload.start.executionContract.targetGraphFunction,
    "derive_component_code_surface"
  );
  assert.equal(
    result.payload.projection.currentEdge,
    "derive_component_code_surface"
  );
  assert.equal(
    result.payload.start.executionContract.nextActionProjection.nextGraphVectorRef,
    graphTrackRefs("derive_component_code_surface").graphVectorRef
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

  const result = invokeOddSdlcSpecMethodCommandSync([
    "gaps",
    "--workspace",
    workspace
  ]);

  assert.equal(result.status, "ok");
  assert.notEqual(
    result.payload.start.executionContract.targetGraphFunction,
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

  const result = invokeOddSdlcSpecMethodCommandSync([
    "gaps",
    "--workspace",
    workspace,
    "--target",
    `graph_function:${FG_MATERIALIZE_DECLARED_PRODUCT_ASSET}`
  ]);

  assert.equal(result.status, "ok");
  assert.equal(result.payload.projection.status, "open");
  assert.equal(
    result.payload.projection.currentEdge,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  assert.equal(result.payload.dossier.status, "open");
  assert.equal(result.payload.dossier.edge, FG_MATERIALIZE_DECLARED_PRODUCT_ASSET);
  assert.equal(
    result.payload.dossier.bestGraphFunctionRef,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  assert.notDeepEqual(result.payload.dossier.nextLawfulActions, ["close_or_reprice"]);
  assert.equal(
    result.payload.dossier.rankingReasonRefs.some((ref) =>
      ref.startsWith("terminal_closed_edge_replayed:")
    ),
    false
  );
});

test("T-058 Spec Method query-domain command projects admitted workspace sources", () => {
  const workspace = makeConformantWorkspace();
  const result = invokeOddSdlcSpecMethodCommandSync(["query-domain", "--workspace", workspace]);

  assert.equal(result.status, "ok");
  assert.equal(result.payload.kind, "sdlc_query_domain_projection");
  assert.equal(result.payload.workspaceRootUri, `file://${workspace}`);
  assert(
    result.payload.startTargets.some(
      (entry) => entry.name === "bootstrap_release_self_test"
    )
  );
  assert(
    result.payload.assetOwnership.some((entry) => entry.assetType === "code_surface")
  );
});

test("T-058 Spec Method gaps command emits read-only dossier without choosing traversal", () => {
  const workspace = makeConformantWorkspace();
  const result = invokeOddSdlcSpecMethodCommandSync(["gaps", "--workspace", workspace]);

  assert.equal(result.status, "ok");
  assert.equal(result.payload.start.kind, "sdlc_public_start_blocked");
  assert.equal(result.payload.projection.kind, "sdlc_gap_projection");
  assert.equal(result.payload.dossier.kind, "sdlc_gap_dossier");
  assert.equal(result.payload.dossier.choosesNextTraversal, false);
  assert.equal(
    result.payload.homeostaticTriage.kind,
    "sdlc_homeostatic_gap_triage_surface"
  );
  assert.equal(result.payload.homeostaticTriage.observation.kind, "sdlc_gap_observation");
  assert.equal(
    result.payload.homeostaticTriage.observation.requirementTransformLineage[0].kind,
    "sdlc_requirement_transform_lineage"
  );
  assert.match(
    result.payload.homeostaticTriage.observation.requirementTransformLineage[0]
      .immediateTransformObligationRef,
    /^transform-obligation:\/\/odd-sdlc\/[^/]+\/REQ-/u
  );
  assert.equal(
    result.payload.homeostaticTriage.observation.requirementTransformLineage[0]
      .lineageStatus,
    "lineage_observed"
  );
  assert.equal(
    result.payload.homeostaticTriage.observation.requirementTransformLineage[0]
      .lineageSource,
    "requirement_transform_authority"
  );
  assert(
    result.payload.homeostaticTriage.observation.requirementTransformLineage[0]
      .lineageAuthorityRefs.some((ref) =>
        ref.startsWith("requirement-transform://odd-sdlc/ingress/")
      )
  );
  assert.equal(
    result.payload.homeostaticTriage.classification.frameworkLayer,
    "code"
  );
  assert.equal(
    result.payload.homeostaticTriage.classification.frameworkCondition,
    "open_gap"
  );
  assert.equal(
    result.payload.homeostaticTriage.routeBinding.targetGraphFunction,
    "derive_code_surface"
  );
  assert.equal(
    result.payload.homeostaticTriage.routeBinding.mayApplyConstitutionalChange,
    false
  );
  assert.match(
    serializeOddSdlcSpecMethodResult(result),
    /triage: code\/open_gap -> code:derive_code_surface/u
  );
});

test("T-058 Spec Method gaps command admits one evaluator priority surface", () => {
  const workspace = makeConformantWorkspace();
  const result = invokeOddSdlcSpecMethodCommandSync([
    "gaps",
    "--workspace",
    workspace,
    "--evaluator-priority-edge",
    "Fg_conform_project_authority"
  ]);

  assert.equal(result.status, "ok");
  assert.equal(result.payload.projection.currentEdge, "Fg_conform_project_authority");
  assert.equal(result.payload.dossier.choosesNextTraversal, false);
  assert.equal(
    result.payload.dossier.rankingAuthority,
    "abiogenesis_construction_priority_projection"
  );
  assert.equal(result.payload.dossier.localRankingAuthority, false);
  assert.match(
    result.payload.dossier.prioritySchemeRef,
    /^priority-scheme:\/\/odd-sdlc\/spec-method\/gaps\//
  );
  assert.equal(
    result.payload.dossier.bestGraphVectorRef,
    "Fg_conform_project_authority"
  );
  assert.deepEqual(result.payload.dossier.nextLawfulActions, [
    "construction-action:Fg_conform_project_authority:Fg_conform_project_authority"
  ]);
  assert(
    result.payload.dossier.rankingReasonRefs.includes(
      "spec-method://odd-sdlc/gaps/evaluator-priority-edge/Fg_conform_project_authority"
    )
  );

  const rejected = invokeOddSdlcSpecMethodCommandSync([
    "start",
    "--workspace",
    workspace,
    "--evaluator-priority-edge",
    "Fg_conform_project_authority"
  ]);
  assert.equal(rejected.status, "error");
  assert.match(rejected.payload.error, /only valid for gaps/);
});

test("T-058 Spec Method gaps priority fails closed on invalid edge selectors", () => {
  const unknownWorkspace = makeConformantWorkspace();
  const unknown = invokeOddSdlcSpecMethodCommandSync([
    "gaps",
    "--workspace",
    unknownWorkspace,
    "--evaluator-priority-edge",
    "missing_edge"
  ]);
  assert.equal(unknown.status, "error");
  assert.match(unknown.payload.error, /does not name a published graph edge/);

  const duplicate = invokeOddSdlcSpecMethodCommandSync([
    "gaps",
    "--workspace",
    makeConformantWorkspace(),
    "--evaluator-priority-edge",
    "derive_design_surface",
    "--evaluator-priority-edge",
    "derive_release_depth_parity_surface"
  ]);
  assert.equal(duplicate.status, "error");
  assert.match(duplicate.payload.error, /may be declared once/);

  const closedWorkspace = makeConformantWorkspace();
  const initial = invokeOddSdlcSpecMethodCommandSync([
    "gaps",
    "--workspace",
    closedWorkspace
  ]);
  const basis = initial.payload.start.executionContract.basis;
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
  const closed = invokeOddSdlcSpecMethodCommandSync([
    "gaps",
    "--workspace",
    closedWorkspace,
    "--evaluator-priority-edge",
    "Fg_conform_project_authority"
  ]);
  assert.equal(closed.status, "error");
  assert.match(closed.payload.error, /already closed graph edge/);
});

test("T-058 Spec Method start command is an ABG entrypoint over worker attachment", () => {
  const workspace = makeConformantWorkspace();
  const blocked = invokeOddSdlcSpecMethodCommandSync([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:bootstrap_release_self_test",
    "--until",
    "blocked"
  ]);
  assert.equal(blocked.status, "ok");
  assert.equal(blocked.payload.kind, "sdlc_public_start_blocked");
  assert.equal(blocked.payload.blockingReason, "fp_worker_unattached");

  const attached = invokeOddSdlcSpecMethodCommandSync([
    "start",
    "--workspace",
    workspace,
    "--target",
    "asset:code_surface",
    "--until",
    "blocked",
    "--worker",
    "process://codex"
  ]);
  assert.equal(attached.status, "ok");
  assert.equal(attached.payload.kind, "sdlc_public_start_projected");
  assert.equal(attached.payload.status, "dispatch_required");
  assert.equal(
    attached.payload.executionContract.targetGraphFunction,
    "derive_code_surface"
  );
});

test("T-058 package binary returns JSON and propagates command errors", () => {
  const okRun = spawnSync(process.execPath, [CLI_MAIN, "rc-report"], {
    cwd: PACKAGE_ROOT,
    encoding: "utf8"
  });
  assert.equal(okRun.status, 0);
  const okPayload = JSON.parse(okRun.stdout);
  assert.equal(okPayload.kind, "odd_sdlc_spec_method_result");
  assert.equal(okPayload.command, "rc-report");
  assert.equal(okPayload.status, "ok");

  const badRun = spawnSync(process.execPath, [CLI_MAIN, "unknown-command"], {
    cwd: PACKAGE_ROOT,
    encoding: "utf8"
  });
  assert.equal(badRun.status, 2);
  const badPayload = JSON.parse(badRun.stderr);
  assert.equal(badPayload.status, "error");
});

test("T-058 Spec Method entry stays free of retry/control authority", () => {
  const source = readFileSync(
    resolve(PACKAGE_ROOT, "code/src/spec_method/entry.ts"),
    "utf8"
  );
  assert(!source.includes("deriveAdvancementTransition("));
  assert(!source.includes("installAbiogenesis"));
  assert(!source.includes("while ("));
  assert(!source.includes("retryContextOverride"));
  assert(!source.includes("MAX_INSTALLED_START_SELF_HEAL_ATTEMPTS"));
});
