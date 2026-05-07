// Validates: T-123

import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  constructSdlcHookContractCatalog,
  deriveSdlcTraversalStrategyDecision,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  promptForHandoff
} from "../../build/semantic/code/src/index.js";

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t123-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nBuild a typed data mapper.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    "# Product\n\nData mapper fixture.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    "# Goals\n\n- prove per-edge strategy selection\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    "# Imported Sources\n\n- fixture://t123\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-t123.md"),
    "REQ-T123-001: Preserve broad induction before scoped construction.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    "# Bootstrap\n\nproject_slug: t123_fixture\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t123_fixture",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark"
    ].join("\n"),
    "utf8"
  );
  return root;
}

const conformedProject = Object.freeze({
  activeTenant: "scala_spark",
  selectedOutputRoot: "build_tenants/scala_spark",
  declaredModuleNames: Object.freeze(["cdme-compiler", "cdme-accounting"]),
  buildExecutionContract: "sbt package",
  testExecutionContract: "sbt test"
});

function retryContext() {
  return {
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: [],
    priorGapDossiers: [
      {
        kind: "sdlc_postflight_gap_dossier",
        dossierVersion: "ts-gap-dossier-v1",
        graphFunctionName: "bootstrap_release_self_test",
        edgeName: "derive_test_execution_result_surface",
        vectorIndex: 17,
        targetAssetType: "test_execution_result_surface",
        status: "open",
        reasons: [
          {
            kind: "sdlc_postflight_gap_reason",
            reason: "test execution failed for cdme-compiler",
            reasonClass: "code_to_test",
            blockingReason: {
              kind: "sdlc_blocking_reason",
              code: "test_execution_not_succeeded",
              reasonClass: "code_to_test",
              lawfulReentryPoint: "repair_worker_output",
              message: "Test execution did not succeed.",
              detail: "module=cdme-compiler",
              evidenceRefs: []
            }
          }
        ],
        evidenceRefs: [],
        priorManifestId: "manifest://t123/prior",
        currentGapDossierRef: "gap://t123/prior",
        retryEligible: true,
        nextLawfulActions: ["repair_worker_output"]
      }
    ]
  };
}

function manifestFor(edgeName, traversalAttemptEnvelope = null, retry = null) {
  const contract = hookContractByEdgeName(edgeName);
  return deriveWorkerHandoffManifest({
    workspaceRoot: makeWorkspace(),
    graphFunctionName: "graph_function:bootstrap_release_self_test",
    edgeName,
    vectorIndex: 0,
    contract,
    traversalAttemptEnvelope,
    ...(retry === null ? {} : { retryContext: retry }),
    conformedProject,
    runId: `t123-${edgeName}`
  });
}

test("T-123 fallback plan derives one strategy decision for every catalog edge", () => {
  for (const contract of constructSdlcHookContractCatalog()) {
    const decision = deriveSdlcTraversalStrategyDecision({
      edgeName: contract.edgeName,
      targetAssetType: contract.targetAssetType
    });
    assert.equal(decision.kind, "sdlc_traversal_strategy_decision");
    assert.equal(decision.decisionSource, "odd_sdlc_fallback_plan");
    assert(decision.strategyPlanRef.startsWith("strategy-plan://odd_sdlc/"));
  }
});

test("T-123 graph vectors and operator handoff consume one shared strategy plan", () => {
  const packageRoot = process.cwd();
  const graphModule = readFileSync(
    path.join(packageRoot, "code/src/graph/module.ts"),
    "utf8"
  );
  const sharedPlan = readFileSync(
    path.join(packageRoot, "code/src/shared/traversal_strategy_plan.ts"),
    "utf8"
  );

  assert(!graphModule.includes("FULL_BREADTH_TRAVERSAL_NAMES"));
  assert.match(graphModule, /defaultSdlcTraversalStrategyForName/u);
  assert.match(sharedPlan, /ODD_SDLC_DEFAULT_TRAVERSAL_STRATEGY_PLAN/u);
});

test("T-123 induction and requirement edges remain full-breadth", () => {
  for (const edgeName of [
    "derive_intent_surface",
    "derive_product_surface",
    "derive_goal_surface",
    "derive_requirement_surface"
  ]) {
    const manifest = manifestFor(edgeName);
    assert.equal(
      manifest.traversalStrategyDecision.selectedStrategy,
      "full_breadth"
    );
    assert.equal(manifest.traversalStrategyDecision.featureScopeRequired, false);
    assert.equal(manifest.traversalStrategyDecision.featureScopeDerived, false);
    assert.equal(manifest.featureScope.mode, "full_breadth");
    assert.deepStrictEqual(manifest.featureScope.deferredModuleNames, []);
    assert(
      promptForHandoff(manifest).includes(
        "do not narrow induction, product, goal, or requirement pressure"
      )
    );
  }
});

test("T-123 post-induction construction edges derive T-122 feature scope", () => {
  const manifest = manifestFor("derive_aggregate_domain_model_surface");
  assert.equal(
    manifest.traversalStrategyDecision.selectedStrategy,
    "steel_thread"
  );
  assert.equal(manifest.traversalStrategyDecision.featureScopeRequired, true);
  assert.equal(manifest.traversalStrategyDecision.featureScopeDerived, true);
  assert.equal(manifest.featureScope.mode, "steel_thread");
  assert.deepStrictEqual(manifest.featureScope.includedModuleNames, [
    "cdme-compiler"
  ]);
  assert.deepStrictEqual(manifest.featureScope.deferredModuleNames, [
    "cdme-accounting"
  ]);
  assert.equal(
    manifest.traversalIntentPackage.traversalStrategyDecision.selectedStrategy,
    "steel_thread"
  );
});

test("T-123 targeted repair is distinct from steel-thread strategy", () => {
  const manifest = manifestFor("derive_code_surface");
  assert.equal(
    manifest.traversalStrategyDecision.selectedStrategy,
    "steel_thread"
  );
  assert.equal(manifest.featureScope.mode, "steel_thread");
  assert.equal(
    manifest.traversalIntentPackage.traversalStrategyDecision.selectedStrategy,
    "steel_thread"
  );

  const executionManifest = manifestFor("derive_test_execution_result_surface");
  assert.equal(
    executionManifest.traversalStrategyDecision.selectedStrategy,
    "full_breadth"
  );
  assert.equal(executionManifest.featureScope.mode, "full_breadth");
  assert.deepStrictEqual(
    executionManifest.productMaterialization.executionShards.map(
      (shard) => shard.moduleName
    ),
    ["cdme-compiler", "cdme-accounting"]
  );

  const retryManifest = manifestFor(
    "derive_test_execution_result_surface",
    null,
    retryContext()
  );
  assert.equal(
    retryManifest.traversalStrategyDecision.selectedStrategy,
    "targeted_repair"
  );
  assert.equal(retryManifest.featureScope.mode, "targeted_repair");
  assert.deepStrictEqual(retryManifest.featureScope.includedModuleNames, [
    "cdme-compiler"
  ]);
  assert.deepStrictEqual(retryManifest.featureScope.deferredModuleNames, [
    "cdme-accounting"
  ]);
  assert.deepStrictEqual(
    retryManifest.productMaterialization.executionShards.map(
      (shard) => shard.moduleName
    ),
    retryManifest.featureScope.includedModuleNames
  );

  const archiveRetryManifest = manifestFor(
    "derive_test_run_archive_surface",
    null,
    retryContext()
  );
  assert.equal(
    archiveRetryManifest.traversalStrategyDecision.selectedStrategy,
    "targeted_repair"
  );
  assert.equal(archiveRetryManifest.featureScope.mode, "targeted_repair");
  assert.deepStrictEqual(
    archiveRetryManifest.productMaterialization.executionShards.map(
      (shard) => shard.moduleName
    ),
    archiveRetryManifest.featureScope.includedModuleNames
  );
});

test("T-123 ABG-selected strategy overrides the fallback plan", () => {
  const manifest = manifestFor("derive_requirement_surface", {
    kind: "traversal_attempt_envelope",
    envelopeRef: "abg://envelope/t123",
    profileRef: "abg://profile/t123",
    basisId: "basis:t123",
    graphFunctionId: "graph:t123",
    graphCallId: "call:t123",
    frameId: "frame:t123",
    vectorIndex: 0,
    edge: "derive_requirement_surface",
    strategyDirectiveRef:
      "strategy://abg/selected/single_vertical_slice",
    backendProfileRef: "backend:t123",
    actorInvocationId: "actor:t123",
    selectedScheduleItemRefs: ["schedule://cdme-compiler/requirements"],
    orderingConstraintRefs: [],
    phaseGateRefs: [],
    requiredProgressArtifactRefs: [],
    gapPressureRefs: [],
    affectRefs: [],
    retryBudgetRemaining: 1,
    mustExitAfterBoundedAttempt: true
  });
  assert.equal(manifest.traversalStrategyDecision.decisionSource, "abg_selected");
  assert.equal(
    manifest.traversalStrategyDecision.selectedStrategy,
    "steel_thread"
  );
  assert.equal(manifest.featureScope.mode, "steel_thread");
});

test("T-123 ABG-selected full breadth cannot be overridden by retry context", () => {
  const manifest = manifestFor(
    "derive_test_execution_result_surface",
    {
      kind: "traversal_attempt_envelope",
      envelopeRef: "abg://envelope/t123-full",
      profileRef: "abg://profile/t123-full",
      basisId: "basis:t123-full",
      graphFunctionId: "graph:t123-full",
      graphCallId: "call:t123-full",
      frameId: "frame:t123-full",
      vectorIndex: 0,
      edge: "derive_test_execution_result_surface",
      strategyDirectiveRef:
        "strategy://abg/selected/full_breadth",
      backendProfileRef: "backend:t123-full",
      actorInvocationId: "actor:t123-full",
      selectedScheduleItemRefs: ["schedule://cdme-compiler/test-execution"],
      orderingConstraintRefs: [],
      phaseGateRefs: [],
      requiredProgressArtifactRefs: [],
      gapPressureRefs: [],
      affectRefs: [],
      retryBudgetRemaining: 1,
      mustExitAfterBoundedAttempt: true
    },
    retryContext()
  );
  assert.equal(manifest.traversalStrategyDecision.decisionSource, "abg_selected");
  assert.equal(
    manifest.traversalStrategyDecision.selectedStrategy,
    "full_breadth"
  );
  assert.equal(manifest.featureScope.mode, "full_breadth");
  assert.deepStrictEqual(
    manifest.productMaterialization.executionShards.map(
      (shard) => shard.moduleName
    ),
    ["cdme-compiler", "cdme-accounting"]
  );
});
