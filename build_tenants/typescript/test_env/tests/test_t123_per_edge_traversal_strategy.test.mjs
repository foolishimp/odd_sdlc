// Validates: T-123

import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
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

function consequenceRetryContextFor(sourceProjectionRef) {
  return {
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: [
      {
        vectorIndex: 0,
        retryRunId: `retry-run://t123/${encodeURIComponent(sourceProjectionRef)}`,
        retryCallId: `retry-call://t123/${encodeURIComponent(sourceProjectionRef)}`,
        manifestId: "file:///tmp/t123/handoff_manifest.json",
        priorAuthorityRef: "closure-decision://t123/prior-close",
        attemptIndex: 1,
        sourceProjectionRef
      }
    ],
    priorGapDossiers: []
  };
}

function retryContextForAccountingPlaceholderWithCompilerEvidence() {
  return {
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: [
      {
        vectorIndex: 0,
        retryRunId: "retry-run://t123/cdme-accounting",
        retryCallId: "retry-call://t123/cdme-accounting",
        manifestId: "file:///tmp/t123/accounting/handoff_manifest.json",
        priorAuthorityRef: "file:///tmp/t123/accounting/gap_dossier.json",
        attemptIndex: 1,
        sourceProjectionRef:
          "construction-priority-projection://odd-sdlc/post-action/module/cdme-accounting/Fg_materialize_declared_product_asset"
      }
    ],
    priorGapDossiers: [
      {
        kind: "sdlc_postflight_gap_dossier",
        dossierVersion: "ts-gap-dossier-v1",
        graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
        edgeName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
        vectorIndex: 0,
        targetAssetType: "component_code_surface",
        status: "open",
        reasons: [
          {
            kind: "sdlc_postflight_gap_reason",
            reason:
              "placeholder_surface:file:///tmp/t123/build_tenants/scala_spark/cdme-accounting/src/main/scala/cdme/accounting/AccountingLedger.scala",
            reasonClass: "assurance",
            blockingReason: {
              kind: "sdlc_blocking_reason",
              code: "accounting_ledger_reason",
              reasonClass: "assurance",
              lawfulReentryPoint: "same_edge_retry",
              message: "Accounting file contains placeholder implementation text.",
              detail:
                "placeholder_surface:file:///tmp/t123/build_tenants/scala_spark/cdme-accounting/src/main/scala/cdme/accounting/AccountingLedger.scala",
              evidenceRefs: [
                "file:///tmp/t123/build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/TopologicalCompiler.scala"
              ]
            }
          }
        ],
        evidenceRefs: [
          "file:///tmp/t123/build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/TopologicalCompiler.scala",
          "file:///tmp/t123/build_tenants/scala_spark/cdme-accounting/src/main/scala/cdme/accounting/AccountingLedger.scala"
        ],
        priorManifestId: "file:///tmp/t123/accounting/handoff_manifest.json",
        currentGapDossierRef: "file:///tmp/t123/accounting/gap_dossier.json",
        retryEligible: true,
        nextLawfulActions: ["retry_same_edge"]
      }
    ]
  };
}

function manifestFor(
  edgeName,
  traversalAttemptEnvelope = null,
  retry = null,
  graphFunctionName = "graph_function:bootstrap_release_self_test"
) {
  const contract = hookContractByEdgeName(edgeName);
  return deriveWorkerHandoffManifest({
    workspaceRoot: makeWorkspace(),
    graphFunctionName,
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

test("T-123 unqualified post-induction construction edges default to full wave", () => {
  const manifest = manifestFor("derive_aggregate_domain_model_surface");
  assert.equal(
    manifest.traversalStrategyDecision.selectedStrategy,
    "full_breadth"
  );
  assert.equal(manifest.traversalStrategyDecision.featureScopeRequired, false);
  assert.equal(manifest.traversalStrategyDecision.featureScopeDerived, false);
  assert.equal(manifest.featureScope.mode, "full_breadth");
  assert.deepStrictEqual(manifest.featureScope.includedModuleNames, [
    "cdme-compiler",
    "cdme-accounting"
  ]);
  assert.deepStrictEqual(manifest.featureScope.deferredModuleNames, []);
  assert.equal(
    manifest.traversalIntentPackage.traversalStrategyDecision.selectedStrategy,
    "full_breadth"
  );
});

test("T-123 unqualified declared product materialization uses full-wave scope", () => {
  const manifest = manifestFor(
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    null,
    null,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );

  assert.equal(
    manifest.traversalStrategyDecision.selectedStrategy,
    "full_breadth"
  );
  assert.equal(manifest.traversalStrategyDecision.featureScopeRequired, false);
  assert.equal(manifest.traversalStrategyDecision.featureScopeDerived, false);
  assert.equal(manifest.featureScope.mode, "full_breadth");
  assert.deepStrictEqual(manifest.featureScope.includedModuleNames, [
    "cdme-compiler",
    "cdme-accounting"
  ]);
  assert.deepStrictEqual(manifest.featureScope.deferredModuleNames, []);
  assert.doesNotMatch(
    promptForHandoff(manifest),
    /Steel thread \/ targeted repair: close only included scope/u
  );
});

test("T-123 targeted repair is distinct from steel-thread strategy", () => {
  const manifest = manifestFor("derive_code_surface");
  assert.equal(
    manifest.traversalStrategyDecision.selectedStrategy,
    "full_breadth"
  );
  assert.equal(manifest.featureScope.mode, "full_breadth");
  assert.equal(
    manifest.traversalIntentPackage.traversalStrategyDecision.selectedStrategy,
    "full_breadth"
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

test("T-123 consequence reentry scope advances steel thread beyond static first slice", () => {
  const manifest = manifestFor(
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    {
      kind: "traversal_attempt_envelope",
      envelopeRef: "abg://envelope/t123-materialize",
      profileRef: "abg://profile/t123-materialize",
      basisId: "basis:t123-materialize",
      graphFunctionId: "graph:t123-materialize",
      graphCallId: "call:t123-materialize",
      frameId: "frame:t123-materialize",
      vectorIndex: 0,
      edge: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
      strategyDirectiveRef:
        "strategy://abg/selected/single_vertical_slice",
      backendProfileRef: "backend:t123-materialize",
      actorInvocationId: "actor:t123-materialize",
      selectedScheduleItemRefs: [
        `schedule://odd_sdlc/${FG_MATERIALIZE_DECLARED_PRODUCT_ASSET}/cdme-compiler`
      ],
      orderingConstraintRefs: [],
      phaseGateRefs: [],
      requiredProgressArtifactRefs: [],
      gapPressureRefs: [],
      affectRefs: [],
      retryBudgetRemaining: 1,
      mustExitAfterBoundedAttempt: true
    },
    consequenceRetryContextFor(
      `construction-priority-projection://odd-sdlc/post-action/module/cdme-accounting/${FG_MATERIALIZE_DECLARED_PRODUCT_ASSET}`
    ),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );

  assert.equal(manifest.traversalStrategyDecision.decisionSource, "abg_selected");
  assert.equal(manifest.traversalStrategyDecision.selectedStrategy, "steel_thread");
  assert.equal(manifest.featureScope.mode, "steel_thread");
  assert.deepStrictEqual(manifest.featureScope.includedModuleNames, [
    "cdme-accounting"
  ]);
  assert.deepStrictEqual(manifest.featureScope.deferredModuleNames, [
    "cdme-compiler"
  ]);
  assert(
    manifest.traversalStrategyDecision.basisRefs.some((ref) =>
      ref.includes("cdme-accounting")
    )
  );
});

test("T-123 unscoped post-action lineage does not broaden first materialization slice", () => {
  const manifest = manifestFor(
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    {
      kind: "traversal_attempt_envelope",
      envelopeRef: "abg://envelope/t123-materialize-general",
      profileRef: "abg://profile/t123-materialize-general",
      basisId: "basis:t123-materialize-general",
      graphFunctionId: "graph:t123-materialize-general",
      graphCallId: "call:t123-materialize-general",
      frameId: "frame:t123-materialize-general",
      vectorIndex: 0,
      edge: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
      strategyDirectiveRef:
        "strategy://abg/selected/single_vertical_slice",
      backendProfileRef: "backend:t123-materialize-general",
      actorInvocationId: "actor:t123-materialize-general",
      selectedScheduleItemRefs: [
        `schedule://odd_sdlc/${FG_MATERIALIZE_DECLARED_PRODUCT_ASSET}/cdme-compiler`
      ],
      orderingConstraintRefs: [],
      phaseGateRefs: [],
      requiredProgressArtifactRefs: [],
      gapPressureRefs: [],
      affectRefs: [],
      retryBudgetRemaining: 1,
      mustExitAfterBoundedAttempt: true
    },
    consequenceRetryContextFor(
      `construction-priority-projection://odd-sdlc/post-action/general/${FG_MATERIALIZE_DECLARED_PRODUCT_ASSET}`
    ),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );

  assert.equal(manifest.traversalStrategyDecision.decisionSource, "abg_selected");
  assert.equal(manifest.traversalStrategyDecision.selectedStrategy, "steel_thread");
  assert.equal(manifest.featureScope.mode, "steel_thread");
  assert.deepStrictEqual(manifest.featureScope.includedModuleNames, [
    "cdme-compiler"
  ]);
  assert.deepStrictEqual(manifest.featureScope.deferredModuleNames, [
    "cdme-accounting"
  ]);
});

test("T-123 same-edge retry scope does not widen from evidence refs", () => {
  const manifest = manifestFor(
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    {
      kind: "traversal_attempt_envelope",
      envelopeRef: "abg://envelope/t123-materialize-retry-accounting",
      profileRef: "abg://profile/t123-materialize-retry-accounting",
      basisId: "basis:t123-materialize-retry-accounting",
      graphFunctionId: "graph:t123-materialize-retry-accounting",
      graphCallId: "call:t123-materialize-retry-accounting",
      frameId: "frame:t123-materialize-retry-accounting",
      vectorIndex: 0,
      edge: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
      strategyDirectiveRef: "strategy://odd_sdlc/Fg_materialize_declared_product_asset/steel_thread",
      backendProfileRef: "backend:t123-materialize-retry-accounting",
      actorInvocationId: "actor:t123-materialize-retry-accounting",
      selectedScheduleItemRefs: [
        `schedule://odd_sdlc/${FG_MATERIALIZE_DECLARED_PRODUCT_ASSET}/cdme-accounting`
      ],
      orderingConstraintRefs: [],
      phaseGateRefs: [],
      requiredProgressArtifactRefs: [],
      gapPressureRefs: [],
      affectRefs: [],
      retryBudgetRemaining: 1,
      mustExitAfterBoundedAttempt: true
    },
    retryContextForAccountingPlaceholderWithCompilerEvidence(),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );

  assert.equal(manifest.traversalStrategyDecision.selectedStrategy, "steel_thread");
  assert.equal(manifest.featureScope.mode, "steel_thread");
  assert.deepStrictEqual(manifest.featureScope.includedModuleNames, [
    "cdme-accounting"
  ]);
  assert.deepStrictEqual(manifest.featureScope.deferredModuleNames, [
    "cdme-compiler"
  ]);
  assert(
    manifest.retryContext.priorGapDossiers[0].evidenceRefs.some((ref) =>
      ref.includes("cdme-compiler")
    )
  );
  const prompt = promptForHandoff(manifest);
  assert.match(prompt, /This is a retry\/re-entry attempt/u);
  assert.match(prompt, /Prior defect: same_edge_retry/u);
  assert.match(prompt, /Accounting file contains placeholder implementation text/u);
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
