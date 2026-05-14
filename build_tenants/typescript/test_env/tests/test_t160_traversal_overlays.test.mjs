// Investigates: T-160

import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { materializeGraphFunction } from "@abiogenesis/typescript-tenant";

import {
  admitSdlcProjectConstraints,
  admitSdlcPublicStartRequest,
  constructSdlcOverlayBinding,
  conformProjectProfileFromConstraintsText,
  constructSdlcEdgeFulfillmentLedger,
  constructSdlcGtlModule,
  constructSdlcNextActionProjection,
  constructSdlcOverlaySegmentCompletion,
  constructSdlcTraversalOverlayCatalog,
  deriveSdlcEdgeClosureDecision,
  deriveSdlcWorkspaceIngressReport,
  FG_BOOTSTRAP_REQUIREMENTS_EXECUTIVE,
  FG_CONFORM_PROJECT,
  FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
  FG_DERIVE_LITE_DESIGN_ADR_SURFACE,
  FG_DERIVE_LITE_MODULE_SURFACE,
  FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
  FG_SOLUTION_ARCHITECTURE_EXECUTIVE,
  FG_UAT_TEST_CASES_EXECUTIVE,
  projectSdlcQueryDomain,
  projectSdlcWorkerAttachment,
  publicSdlcOverlayStartTargets,
  publicStartOnce,
  SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF,
  SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF,
  SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF,
  SDLC_SOLUTION_ARCHITECTURE_OVERLAY_REF,
  SDLC_UAT_TEST_CASES_OVERLAY_REF,
  withSdlcOverlayBindingPostActionEvidence
} from "../../build/semantic/code/src/index.js";

function startContext(workspaceRoot = "/workspace/t160") {
  const module = constructSdlcGtlModule();
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: `file://${workspaceRoot}`,
    projectConstraints: admitSdlcProjectConstraints({
      projectSlug: "t160",
      activeTenant: "typescript",
      selectedOutputRoot: "build_tenants/typescript",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: ["transport_contract"]
    }),
    sourceInputs: []
  });
  const queryDomain = projectSdlcQueryDomain({ module, ingressReport });
  const conformedProject = conformProjectProfileFromConstraintsText({
    workspaceRoot,
    constraintsText: [
      "project:",
      "  name: t160",
      "  selected_output_root: build_tenants/typescript",
      "  ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript",
      "    capability_contracts:",
      "      - transport_contract"
    ].join("\n")
  });
  return { module, queryDomain, conformedProject, workspaceRoot };
}

test("T-160 publishes five governed traversal overlays with boundary refs", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const overlays = new Map(catalog.overlays.map((overlay) => [overlay.overlayRef, overlay]));

  assert.deepStrictEqual(
    catalog.overlays.map((overlay) => overlay.overlayRef),
    [
      SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF,
      SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF,
      SDLC_SOLUTION_ARCHITECTURE_OVERLAY_REF,
      SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF,
      SDLC_UAT_TEST_CASES_OVERLAY_REF
    ]
  );
  assert.equal(overlays.has("overlay://odd-sdlc/hello-world-light"), false);
  assert(
    overlays
      .get(SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF)
      .aliases.includes("overlay://odd-sdlc/bootstrap-heavy")
  );
  for (const overlay of catalog.overlays) {
    assert.match(overlay.graphCatalogDigestRef, /^graph-catalog-digest:\/\/odd-sdlc\//);
    assert(overlay.graphFunctionRefs.length > 0, overlay.overlayRef);
    assert(overlay.graphVectorRefs.length > 0, overlay.overlayRef);
    assert(overlay.assetTemplates.length > 0, overlay.overlayRef);
    for (const template of overlay.assetTemplates) {
      assert.equal(template.kind, "sdlc_overlay_asset_template");
      assert.match(template.templateRef, /^overlay:\/\/odd-sdlc\//);
      assert.equal(template.terminalRole, "terminal_asset");
      assert(overlay.graphFunctionRefs.includes(template.producerGraphFunctionRef));
    }
    assert.equal(
      overlay.graphFunctionRefs.some((ref) => ref.startsWith("graph-function:")),
      false,
      overlay.overlayRef
    );
    assert.equal(
      overlay.graphVectorRefs.some(
        (ref) => ref.startsWith("graph-vector:") || ref.startsWith("vector:")
      ),
      false,
      overlay.overlayRef
    );
  }
  assert.deepStrictEqual(
    overlays.get(SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF).publicStartTargets,
    [FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE]
  );
  assert.deepStrictEqual(
    overlays.get(SDLC_SOLUTION_ARCHITECTURE_OVERLAY_REF).publicStartTargets,
    [FG_SOLUTION_ARCHITECTURE_EXECUTIVE]
  );
  assert.deepStrictEqual(
    overlays.get(SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF).publicStartTargets,
    [FG_BOOTSTRAP_REQUIREMENTS_EXECUTIVE]
  );
  assert.deepStrictEqual(
    overlays.get(SDLC_UAT_TEST_CASES_OVERLAY_REF).publicStartTargets,
    [FG_UAT_TEST_CASES_EXECUTIVE]
  );
});

test("T-160 lite overlay terminates on a bounded implementation edge", () => {
  const module = constructSdlcGtlModule();
  const liteExecutive = module.graphFunctions.find(
    (graphFunction) => graphFunction.name === FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE
  );
  assert(liteExecutive);
  const graph = materializeGraphFunction(liteExecutive);
  const finalVector = graph.vectors.at(-1);
  assert(finalVector);

  assert.deepStrictEqual(
    graph.vectors.map((vector) => vector.name),
    [
      FG_DERIVE_LITE_DESIGN_ADR_SURFACE,
      FG_DERIVE_LITE_MODULE_SURFACE,
      FG_DERIVE_LITE_COMPONENT_CODE_SURFACE
    ]
  );
  assert.equal(finalVector.name, FG_DERIVE_LITE_COMPONENT_CODE_SURFACE);
  assert.equal(finalVector.target.name, "component_code_surface");
  assert.deepStrictEqual(
    finalVector.source.map((node) => node.name),
    [
      "implementation_design_surface",
      "implementation_module_surface"
    ]
  );
  assert.equal(
    finalVector.source.some((node) =>
      [
        "implementation_component_topology_surface",
        "component_realization_schedule_surface",
        "implementation_stack_profile"
      ].includes(node.name)
    ),
    false
  );
});

test("T-160 UAT overlay consumes requirements and solution architecture authority", () => {
  const module = constructSdlcGtlModule();
  const uatExecutive = module.graphFunctions.find(
    (graphFunction) => graphFunction.name === FG_UAT_TEST_CASES_EXECUTIVE
  );
  assert(uatExecutive);
  const graph = materializeGraphFunction(uatExecutive);
  const finalVector = graph.vectors.at(-1);
  assert(finalVector);

  assert.equal(finalVector.name, "derive_uat_testcases_surface");
  assert.equal(finalVector.target.name, "uat_testcases_surface");
  assert.deepStrictEqual(
    finalVector.source.map((node) => node.name),
    [
      "requirement_surface",
      "implementation_design_surface"
    ]
  );
});

test("T-160 overlay binding distinguishes material assets from planned templates", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const overlay = catalog.overlays.find(
    (candidate) => candidate.overlayRef === SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF
  );
  assert(overlay);
  const planned = constructSdlcOverlayBinding({
    catalog,
    overlay,
    workspaceRootUri: "file:///workspace/t160",
    workspaceIdentityRef: "workspace://t160",
    preActionWorkspaceObservationRef: "observation://t160/pre",
    preActionWorkspaceFingerprintRef: "fingerprint://t160/pre",
    selectedGraphFunctionRef: overlay.graphFunctionRefs[0],
    selectedStartTargetRef: FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
    requestedBy: "public_start"
  });
  assert.equal(planned.assetBindings[0].mode, "planned_from_template");
  assert.equal(planned.assetBindings[0].templateRef, overlay.assetTemplates[0].templateRef);

  const material = constructSdlcOverlayBinding({
    catalog,
    overlay,
    workspaceRootUri: "file:///workspace/t160",
    workspaceIdentityRef: "workspace://t160",
    preActionWorkspaceObservationRef: "observation://t160/pre",
    preActionWorkspaceFingerprintRef: "fingerprint://t160/pre",
    selectedGraphFunctionRef: overlay.graphFunctionRefs[0],
    selectedStartTargetRef: FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
    requestedBy: "public_start",
    materialAssetRefs: [
      {
        assetType: "component_code_surface",
        assetRef: "workspace://build_tenants/hello_world_javascript/src/hello.js",
        relativePath: "build_tenants/hello_world_javascript/src/hello.js",
        evidenceRefs: ["evidence://t160/material"]
      }
    ]
  });
  assert.equal(material.assetBindings[0].mode, "material");
  assert.equal(material.assetBindings[0].templateRef, null);
  assert.deepEqual(material.assetBindings[0].evidenceRefs, ["evidence://t160/material"]);

  assert.throws(
    () =>
      constructSdlcOverlayBinding({
        catalog,
        overlay,
        workspaceRootUri: "file:///workspace/t160",
        workspaceIdentityRef: "workspace://t160",
        preActionWorkspaceObservationRef: "observation://t160/pre",
        preActionWorkspaceFingerprintRef: "fingerprint://t160/pre",
        selectedGraphFunctionRef: overlay.graphFunctionRefs[0],
        selectedStartTargetRef: FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
        requestedBy: "public_start",
        materialAssetRefs: [
          {
            assetType: "undeclared_asset",
            assetRef: "workspace://bad",
            relativePath: "bad",
            evidenceRefs: []
          }
        ]
      }),
    /not declared by the selected overlay template/
  );
});

test("T-160 overlay binding admits post-action workspace evidence as refinement", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const overlay = catalog.overlays.find(
    (candidate) => candidate.overlayRef === SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF
  );
  assert(overlay);
  const binding = constructSdlcOverlayBinding({
    catalog,
    overlay,
    workspaceRootUri: "file:///workspace/t160",
    workspaceIdentityRef: "workspace://t160",
    preActionWorkspaceObservationRef: "observation://t160/pre",
    preActionWorkspaceFingerprintRef: "fingerprint://t160/pre",
    selectedGraphFunctionRef: overlay.graphFunctionRefs[0],
    selectedStartTargetRef: FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
    requestedBy: "public_start"
  });
  const refined = withSdlcOverlayBindingPostActionEvidence({
    binding,
    postActionWorkspaceObservationRef: "observation://t160/post",
    postActionWorkspaceFingerprintRef: "fingerprint://t160/post",
    workspaceDeltaRef: "workspace-delta://t160/post"
  });

  assert.equal(refined.bindingRef, binding.bindingRef);
  assert.equal(
    refined.workspaceBasis.postActionWorkspaceObservationRef,
    "observation://t160/post"
  );
  assert(refined.predecessorRefs.includes("workspace-delta://t160/post"));
});

test("T-160 query-domain renders overlay-governed start targets as read model", () => {
  const { queryDomain } = startContext();

  assert.equal(queryDomain.readOnly, true);
  assert.equal(queryDomain.traversalOverlays.kind, "sdlc_traversal_overlay_catalog");
  assert(
    queryDomain.startTargets.some(
      (target) =>
        target.name === FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE &&
        target.overlayRefs.includes(SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF)
    )
  );
  assert(
    queryDomain.startTargets.some(
      (target) =>
        target.name === FG_SOLUTION_ARCHITECTURE_EXECUTIVE &&
        target.defaultForOverlayRefs.includes(SDLC_SOLUTION_ARCHITECTURE_OVERLAY_REF)
    )
  );
});

test("T-164 bootstrap overlay owns initial conformance when the project is underconformed", () => {
  const { module, queryDomain, conformedProject, workspaceRoot } = startContext();
  const blockedQueryDomain = Object.freeze({
    ...queryDomain,
    projectConformance: Object.freeze({
      ...(queryDomain.projectConformance ?? {}),
      status: "blocked"
    })
  });
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const blockedTargets = publicSdlcOverlayStartTargets({
    module,
    catalog,
    projectConformanceStatus: "blocked"
  });
  const conformTarget = blockedTargets.find(
    (target) => target.name === FG_CONFORM_PROJECT
  );
  assert(conformTarget);
  assert(
    conformTarget.overlayRefs.includes(SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF)
  );
  assert(
    conformTarget.defaultForOverlayRefs.includes(
      SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF
    )
  );

  const outcome = publicStartOnce({
    request: admitSdlcPublicStartRequest({
      workspaceRoot,
      target: {
        kind: "overlay",
        handle: "bootstrap-requirements"
      },
      until: "first_traversal",
      defaultRegime: "F_P"
    }),
    module,
    queryDomain: blockedQueryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({ transportContract: null })
  });

  assert.equal(outcome.kind, "sdlc_public_start_projected");
  assert(outcome.executionContract);
  assert.equal(outcome.executionContract.targetGraphFunction, FG_CONFORM_PROJECT);
  assert.equal(
    outcome.executionContract.overlayRef,
    SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF
  );
});

test("T-160 public start admits overlay binding directly for lite traversal", () => {
  const { module, queryDomain, conformedProject, workspaceRoot } = startContext();
  const outcome = publicStartOnce({
    request: admitSdlcPublicStartRequest({
      workspaceRoot,
      target: {
        kind: "overlay",
        handle: "lite-design-module-implementation"
      },
      until: "blocked",
      defaultRegime: "F_P"
    }),
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({ transportContract: null })
  });

  assert.equal(outcome.kind, "sdlc_public_start_blocked");
  assert.equal(outcome.blockingReason, "fp_worker_unattached");
  assert(outcome.executionContract);
  assert.equal(
    outcome.executionContract.targetGraphFunction,
    FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE
  );
  assert.equal(
    outcome.executionContract.overlayRef,
    SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF
  );
  assert.match(
    outcome.executionContract.overlayBindingRef,
    /^overlay-binding:\/\/odd-sdlc\//
  );
  assert.equal(
    outcome.executionContract.nextActionProjection.overlayBindingRef,
    outcome.executionContract.overlayBindingRef
  );
  assert(
    outcome.executionContract.constructionIntent.basisRefs.includes(
      outcome.executionContract.overlayBindingRef
    )
  );
});

test("T-160 public start binds existing overlay assets as material workspace truth", () => {
  const workspaceRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t160-material-"));
  const materialPath = path.join(
    workspaceRoot,
    "build_tenants/hello_world_javascript/src/hello.js"
  );
  mkdirSync(path.dirname(materialPath), { recursive: true });
  writeFileSync(materialPath, "console.log('hello');\n", "utf8");
  const { module, queryDomain, conformedProject } = startContext(workspaceRoot);
  const outcome = publicStartOnce({
    request: admitSdlcPublicStartRequest({
      workspaceRoot,
      target: {
        kind: "overlay",
        handle: "lite-design-module-implementation"
      },
      until: "blocked",
      defaultRegime: "F_P"
    }),
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({ transportContract: null })
  });

  assert(outcome.executionContract);
  const binding = outcome.executionContract.overlayBinding.assetBindings.find(
    (candidate) => candidate.assetType === "component_code_surface"
  );
  assert(binding);
  assert.equal(binding.mode, "material");
  assert.equal(
    binding.relativePath,
    "build_tenants/hello_world_javascript/src/hello.js"
  );
  assert(binding.assetRef.endsWith("/build_tenants/hello_world_javascript/src/hello.js"));
  assert(
    binding.evidenceRefs.includes(
      outcome.executionContract.overlayBinding.workspaceBasis.preActionWorkspaceObservationRef
    )
  );
});

test("T-160 public start carries prior admitted overlay ledger and event refs", () => {
  const workspaceRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t160-prior-"));
  const archiveRoot = path.join(
    workspaceRoot,
    ".ai-workspace/runtime/odd_sdlc/operator-runs/20260512T000000000Z_pid160"
  );
  mkdirSync(archiveRoot, { recursive: true });
  writeFileSync(
    path.join(archiveRoot, "sdlc_edge_fulfillment_ledger.json"),
    `${JSON.stringify({
      kind: "sdlc_edge_fulfillment_ledger",
      overlayRef: SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF,
      ledgerRef: "ledger://odd-sdlc/t160/bootstrap",
      ledgerVersionRef: "ledger-version://odd-sdlc/t160/bootstrap/1"
    }, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "sdlc_edge_closure_decision.json"),
    `${JSON.stringify({
      kind: "sdlc_edge_closure_decision",
      overlayRef: SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF,
      decisionRef: "closure-decision://odd-sdlc/t160/bootstrap",
      disposition: "close"
    }, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "runtime_events.json"),
    `${JSON.stringify({
      kind: "sdlc_runtime_event_archive_projection",
      eventCount: 1,
      eventKinds: ["vector_closed"],
      events: []
    }, null, 2)}\n`,
    "utf8"
  );
  const { module, queryDomain, conformedProject } = startContext(workspaceRoot);
  const outcome = publicStartOnce({
    request: admitSdlcPublicStartRequest({
      workspaceRoot,
      target: {
        kind: "overlay",
        handle: "lite-design-module-implementation"
      },
      until: "blocked",
      defaultRegime: "F_P"
    }),
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({ transportContract: null })
  });

  assert(outcome.executionContract);
  assert(
    outcome.executionContract.overlayBinding.priorLedgerRefs.includes(
      "ledger-version://odd-sdlc/t160/bootstrap/1"
    )
  );
  assert.equal(outcome.executionContract.overlayBinding.priorEventRefs.length, 1);
  assert(outcome.executionContract.overlayBinding.priorEventRefs[0].endsWith("/runtime_events.json"));
});

test("T-160 overlay replay keeps stable traversal identity while selecting next vector", () => {
  const { module, queryDomain, conformedProject, workspaceRoot } = startContext();
  const baseRequest = {
    workspaceRoot,
    target: {
      kind: "overlay",
      handle: "lite-design-module-implementation"
    },
    until: "first_traversal",
    defaultRegime: "F_P"
  };
  const first = publicStartOnce({
    request: admitSdlcPublicStartRequest(baseRequest),
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({ transportContract: null })
  });
  const replay = publicStartOnce({
    request: admitSdlcPublicStartRequest({
      ...baseRequest,
      replayNextActionProjectionRef: "next-action://odd-sdlc/t160/select-stack",
      replaySelectedActionRef: "construction-action://odd-sdlc/t160/select-stack",
      replayNextGraphVectorRef: FG_DERIVE_LITE_MODULE_SURFACE,
      replayClosureDecisionRef: "closure-decision://odd-sdlc/t160/derive-design",
      replayOverlayRef: SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF
    }),
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({ transportContract: null })
  });

  assert(first.executionContract);
  assert(replay.executionContract);
  assert.equal(
    replay.executionContract.overlayBinding.selection.selectedGraphVectorRef,
    FG_DERIVE_LITE_MODULE_SURFACE
  );
  assert.equal(
    replay.executionContract.overlayBindingRef,
    first.executionContract.overlayBindingRef
  );
  assert.equal(replay.executionContract.basis.id, first.executionContract.basis.id);
});

test("T-160 stale overlay binding replay fails closed", () => {
  const { module, queryDomain, conformedProject, workspaceRoot } = startContext();
  const outcome = publicStartOnce({
    request: admitSdlcPublicStartRequest({
      workspaceRoot,
      target: {
        kind: "overlay",
        handle: "lite-design-module-implementation"
      },
      until: "first_traversal",
      defaultRegime: "F_P",
      replayNextActionProjectionRef: "next-action://odd-sdlc/t160/stale",
      replaySelectedActionRef: "construction-action://odd-sdlc/t160/stale",
      replayNextGraphVectorRef: FG_DERIVE_LITE_MODULE_SURFACE,
      replayClosureDecisionRef: "closure-decision://odd-sdlc/t160/stale",
      replayOverlayRef: SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF,
      replayOverlayBindingRef: "overlay-binding://odd-sdlc/wrong"
    }),
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({ transportContract: null })
  });

  assert.equal(outcome.kind, "sdlc_public_start_blocked");
  assert.equal(outcome.blockingReason, "stale_query_domain");
  assert.equal(outcome.executionContract, null);
});

test("T-160 consequence carriers preserve overlay binding identity", () => {
  const ledger = constructSdlcEdgeFulfillmentLedger({
    ledgerRef: "ledger://odd-sdlc/t160",
    ledgerVersionRef: "ledger-version://odd-sdlc/t160/1",
    overlayRef: SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF,
    overlayBindingRef: "overlay-binding://odd-sdlc/t160",
    graphCatalogDigestRef: "graph-catalog-digest://odd-sdlc/t160",
    edgeRef: "edge://odd-sdlc/t160/lite",
    attemptRef: "attempt://odd-sdlc/t160/lite",
    targetBindingRefs: ["target-binding://odd-sdlc/component_code_surface"],
    evidenceBundleRefs: ["evidence://odd-sdlc/t160/lite"],
    counts: {
      expected: 1,
      fulfilled: 1,
      partial: 0,
      blocked: 0,
      unfulfilled: 0,
      missing: 0,
      extra: 0
    }
  });
  const closureDecision = deriveSdlcEdgeClosureDecision({
    decisionRef: "closure-decision://odd-sdlc/t160",
    ledger,
    currentEdgeLawful: true
  });
  const projection = constructSdlcNextActionProjection({
    nextActionProjectionRef: "next-action://odd-sdlc/t160",
    intentEventRefs: ["event://odd-sdlc/t160"],
    productAssetModelRef: "product-asset-model://odd-sdlc/t160",
    gapPressureRefs: ["pressure://odd-sdlc/t160"],
    targetBindingRefs: ledger.targetBindingRefs,
    closureDecision,
    observationRef: "observation://odd-sdlc/t160",
    policyRefs: ["policy://odd-sdlc/t160"],
    actionCatalogRefs: ["catalog://odd-sdlc/t160"]
  });

  assert.equal(ledger.overlayBindingRef, "overlay-binding://odd-sdlc/t160");
  assert.equal(closureDecision.overlayBindingRef, ledger.overlayBindingRef);
  assert.equal(projection.overlayBindingRef, ledger.overlayBindingRef);
  assert(projection.predecessorRefs.includes("overlay-binding://odd-sdlc/t160"));
});

test("T-160 overlay segment completion is separate from product convergence", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  for (const overlayRef of [
    SDLC_BOOTSTRAP_REQUIREMENTS_OVERLAY_REF,
    SDLC_SOLUTION_ARCHITECTURE_OVERLAY_REF,
    SDLC_UAT_TEST_CASES_OVERLAY_REF,
    SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF
  ]) {
    const overlay = catalog.overlays.find((candidate) => candidate.overlayRef === overlayRef);
    assert(overlay);
    const ledger = constructSdlcEdgeFulfillmentLedger({
      ledgerRef: `ledger://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`,
      ledgerVersionRef: `ledger-version://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}/1`,
      overlayRef: overlay.overlayRef,
      overlayBindingRef: `overlay-binding://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`,
      graphCatalogDigestRef: overlay.graphCatalogDigestRef,
      edgeRef: `edge://odd-sdlc/t160/${encodeURIComponent(overlay.name)}`,
      attemptRef: `attempt://odd-sdlc/t160/${encodeURIComponent(overlay.name)}`,
      targetBindingRefs: [`target-binding://odd-sdlc/${overlay.termination.terminalAssetTypes[0]}`],
      evidenceBundleRefs: [`evidence://odd-sdlc/t160/${encodeURIComponent(overlay.name)}`],
      counts: {
        expected: 1,
        fulfilled: 1,
        partial: 0,
        blocked: 0,
        unfulfilled: 0,
        missing: 0,
        extra: 0
      }
    });
    const closureDecision = deriveSdlcEdgeClosureDecision({
      decisionRef: `closure-decision://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`,
      ledger,
      currentEdgeLawful: true
    });
    const segmentCompletion = constructSdlcOverlaySegmentCompletion({
      completionRef: `overlay-segment-completion://odd-sdlc/t160/${encodeURIComponent(overlay.name)}`,
      closureDecision,
      stopDisposition: "overlay_segment_complete",
      terminalAssetTypes: overlay.termination.terminalAssetTypes,
      terminalGraphFunctionRefs: overlay.termination.terminalGraphFunctionRefs,
      remainingGraphPressureRefs: overlay.termination.remainingGraphPressureRefs,
      remainingRequirementPressureRefs: overlay.termination.remainingRequirementPressureRefs,
      remainingAssetPressureRefs: overlay.termination.remainingAssetPressureRefs,
      nextEligibleOverlayRefs: overlay.termination.nextEligibleOverlayRefs
    });
    const projection = constructSdlcNextActionProjection({
      nextActionProjectionRef: `next-action://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`,
      intentEventRefs: [`event://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`],
      productAssetModelRef: `product-asset-model://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`,
      gapPressureRefs: [`pressure://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`],
      targetBindingRefs: ledger.targetBindingRefs,
      closureDecision,
      overlaySegmentCompletion: segmentCompletion,
      observationRef: `observation://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`,
      policyRefs: [`policy://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`],
      actionCatalogRefs: [`catalog://odd-sdlc/t160/segment/${encodeURIComponent(overlay.name)}`]
    });

    assert.equal(segmentCompletion.stopDisposition, "overlay_segment_complete");
    assert.equal(segmentCompletion.productConverged, false);
    assert.equal(projection.overlaySegmentCompletionRef, segmentCompletion.completionRef);
    assert.equal(projection.overlayStopDisposition, "overlay_segment_complete");
    assert(projection.remainingGraphPressureRefs.length > 0);
    assert(projection.nextEligibleOverlayRefs.length > 0);
  }
});

test("T-160 current full overlay can refine prior lite ledger and event truth", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const overlay = catalog.overlays.find(
    (candidate) => candidate.overlayRef === SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF
  );
  assert(overlay);
  const binding = constructSdlcOverlayBinding({
    catalog,
    overlay,
    workspaceRootUri: "file:///workspace/t160",
    workspaceIdentityRef: "workspace://t160",
    preActionWorkspaceObservationRef: "observation://t160/pre-current-full",
    preActionWorkspaceFingerprintRef: "fingerprint://t160/pre-current-full",
    selectedGraphFunctionRef: overlay.graphFunctionRefs[0],
    selectedStartTargetRef: "Fg_conform_project_authority",
    requestedBy: "public_start",
    priorLedgerRefs: ["ledger://odd-sdlc/t160/lite"],
    priorEventRefs: ["event://odd-sdlc/t160/lite-vector-closed"]
  });

  assert(binding.priorLedgerRefs.includes("ledger://odd-sdlc/t160/lite"));
  assert(binding.priorEventRefs.includes("event://odd-sdlc/t160/lite-vector-closed"));
  assert(binding.predecessorRefs.includes("ledger://odd-sdlc/t160/lite"));
  assert(binding.predecessorRefs.includes("event://odd-sdlc/t160/lite-vector-closed"));
});

test("T-160 public start consumes overlay catalog rather than query-domain start target authority", () => {
  const source = readFileSync(
    new URL("../../code/src/start/public_start.ts", import.meta.url),
    "utf8"
  );
  const evaluateBody = source.slice(
    source.indexOf("function evaluateInitialPublicStartAction"),
    source.indexOf("function constructExecutionContract")
  );

  assert.match(evaluateBody, /constructSdlcTraversalOverlayCatalog/);
  assert.match(evaluateBody, /publicSdlcOverlayStartTargets/);
  assert.equal(evaluateBody.includes("input.queryDomain.startTargets"), false);
});

test("T-160 spec-method replay preserves overlay target identity", () => {
  const source = readFileSync(
    new URL("../../code/src/spec_method/entry.ts", import.meta.url),
    "utf8"
  );
  const replayBody = source.slice(
    source.indexOf("function startOutcomeForObservedReplay"),
    source.indexOf("function replayEventsForBasis")
  );

  assert.match(replayBody, /input\.request\.target\.kind === "overlay"/);
  assert.match(replayBody, /\? input\.request\.target/);
  assert.match(
    replayBody,
    /overlayRef: selectedNextGraphFunction\.overlayRef/
  );
});
