// Validates: REQ-F-ODDSDLC-013
// Validates: REQ-F-ODDSDLC-014
// Validates: REQ-F-ODDSDLC-015
// Investigates: T-164

import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { materializeGraphFunction } from "@abiogenesis/typescript-tenant";

import {
  admitSdlcEdgeEvidence,
  assertSdlcEdgeGainClosureContractsRegistered,
  assertSdlcOverlayEdgeGainClosureContracts,
  assertTraversalIntentPackagePressure,
  composeSdlcPathGain,
  constructSdlcEdgeFulfillmentLedger,
  constructSdlcGtlModule,
  constructSdlcNextActionProjection,
  constructSdlcTraversalOverlayCatalog,
  constructWorkerBrief,
  constructWorkerInvocationPackage,
  deriveSdlcEdgeAssuranceCloseDecision,
  deriveSdlcEdgeClosureDecision,
  deriveSdlcEdgeObligations,
  deriveSdlcEdgeResidualPressure,
  deriveWorkerHandoffManifest,
  digestSdlcEdgeGainClosureContract,
  FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
  hookContractByEdgeName,
  indexSdlcEdgeGainClosureContracts,
  materializeSdlcProjectConformance,
  measureSdlcEdgeGain,
  SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF,
  SDLC_EDGE_GAIN_CLOSURE_CATEGORY_TEMPLATES,
  SDLC_EDGE_GAIN_CLOSURE_CONTRACTS,
  SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF,
  sdlcEdgeAssuranceContractRef
} from "../../build/semantic/code/src/index.js";

function overlayByRef(catalog, overlayRef) {
  const overlay = catalog.overlays.find((candidate) => candidate.overlayRef === overlayRef);
  assert(overlay, overlayRef);
  return overlay;
}

function unique(values) {
  return [...new Set(values)];
}

function moduleGraphFunctionByName(module, name) {
  const graphFunction = module.graphFunctions.find((candidate) => candidate.name === name);
  assert(graphFunction, name);
  return graphFunction;
}

function contractByEdge(edgeRef) {
  const contract = SDLC_EDGE_GAIN_CLOSURE_CONTRACTS.find(
    (candidate) => candidate.edgeRef === edgeRef
  );
  assert(contract, edgeRef);
  return contract;
}

function allLedgerInputsFor(contract, prefix = "ledger://t164") {
  return contract.ledgerInputKinds.map((ledgerInputKind) => ({
    kind: "sdlc_edge_ledger_input_ref",
    ledgerInputKind,
    ledgerRef: `${prefix}/${contract.edgeRef}/${ledgerInputKind}`
  }));
}

function measuredGain(edgeRef, closeReady) {
  const contract = contractByEdge(edgeRef);
  const obligationRef = `obligation://${edgeRef}/primary`;
  const obligations = deriveSdlcEdgeObligations({
    contract,
    obligationRefs: [obligationRef]
  });
  const admission = admitSdlcEdgeEvidence({
    contract,
    obligations,
    candidates: closeReady
      ? [
          {
            kind: "sdlc_edge_evidence_candidate",
            evidenceRef: `evidence://${edgeRef}/behavior`,
            sourceKind: "worker_assessment",
            obligationRefs: [obligationRef],
            supportsBehavioralFulfillment: true
          }
        ]
      : []
  });
  return measureSdlcEdgeGain({
    contract,
    obligations,
    admittedEvidence: admission.admittedEvidence,
    ledgerInputs: allLedgerInputsFor(contract)
  });
}

function materializedVectorsForOverlay(module, overlay) {
  const byVector = new Map();
  for (const graphFunctionRef of overlay.graphFunctionRefs) {
    const graphFunction = moduleGraphFunctionByName(module, graphFunctionRef);
    for (const vector of materializeGraphFunction(graphFunction).vectors) {
      if (!byVector.has(vector.name)) {
        byVector.set(vector.name, vector);
      }
    }
  }
  return byVector;
}

function materializedVectorsForModule(module) {
  const byVector = new Map();
  for (const graphFunction of module.graphFunctions) {
    for (const vector of materializeGraphFunction(graphFunction).vectors) {
      if (!byVector.has(vector.name)) {
        byVector.set(vector.name, vector);
      }
    }
  }
  return byVector;
}

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t164-edge-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    "# T-164 Edge Fixture\n\nRust hello service fixture workspace.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-T164: Build a small HTTP service from graph traversal contracts.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "A Rust HTTP service exposing GET /hello and returning hello world."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    [
      "# Requirements",
      "",
      "REQ-T164-001: The service must expose a GET /hello endpoint.",
      "REQ-T164-002: The endpoint must return hello world as the response body."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t164_edge_fixture",
      "active_tenant: rust_service",
      "build_tenants:",
      "  rust_service:",
      "    output_dir: build_tenants/rust_service",
      "    language: rust",
      "    build_tool: cargo",
      "    module_structure:",
      "      - service"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

test("T-164 current-full overlay vectors all have gain and closure contract rows", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const currentFull = overlayByRef(catalog, SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF);
  const byEdge = indexSdlcEdgeGainClosureContracts({
    contracts: SDLC_EDGE_GAIN_CLOSURE_CONTRACTS
  });
  const uniqueCurrentFullVectorRefs = unique(currentFull.graphVectorRefs);

  assert.equal(uniqueCurrentFullVectorRefs.length, 42);

  const categoryCounts = {};
  for (const graphVectorRef of uniqueCurrentFullVectorRefs) {
    const contract = byEdge.get(graphVectorRef);
    assert(contract, graphVectorRef);
    assert.equal(contract.closureClassification, "close_capable");
    assert.equal(contract.ledgerInputKinds.includes("sdlc_edge_fulfillment_ledger"), true);
    assert.equal(contract.ledgerInputKinds.includes("sdlc_edge_closure_decision"), true);
    assert.match(
      contract.metricFunctionRef,
      new RegExp(`^function://odd-sdlc/edge-gain/${contract.category}/`)
    );
    assert.match(
      contract.closureFunctionRef,
      new RegExp(`^function://odd-sdlc/edge-gain/${contract.category}/`)
    );
    assert(contract.residualPressureRefs.length > 0, graphVectorRef);
    categoryCounts[contract.category] = (categoryCounts[contract.category] ?? 0) + 1;
  }

  assert.deepStrictEqual(categoryCounts, {
    conformance: 1,
    authority_synthesis: 5,
    solution_formalisation: 4,
    testcase_synthesis_and_authority: 2,
    implementation_formalisation_and_planning: 7,
    implementation_encoding: 2,
    implementation_qualification: 1,
    test_formalisation_and_planning: 5,
    test_encoding_and_execution: 4,
    repair_archive_release_qualification: 4,
    operational_transition_and_return: 7
  });
});

test("T-164 published graph vector inventory is fully classified", () => {
  const module = constructSdlcGtlModule();
  const materializedVectors = materializedVectorsForModule(module);
  const publishedGraphVectorRefs = [...materializedVectors.keys()].sort();
  const byEdge = indexSdlcEdgeGainClosureContracts({
    contracts: SDLC_EDGE_GAIN_CLOSURE_CONTRACTS
  });

  assert.equal(publishedGraphVectorRefs.length, 62);
  assert.equal(SDLC_EDGE_GAIN_CLOSURE_CONTRACTS.length, 62);

  assertSdlcEdgeGainClosureContractsRegistered({
    publishedGraphVectorRefs,
    contracts: SDLC_EDGE_GAIN_CLOSURE_CONTRACTS
  });

  const classificationCounts = {};
  for (const graphVectorRef of publishedGraphVectorRefs) {
    const contract = byEdge.get(graphVectorRef);
    const vector = materializedVectors.get(graphVectorRef);
    assert(contract, graphVectorRef);
    assert(vector, graphVectorRef);
    assert.deepStrictEqual(
      contract.sourceAssetTypes,
      vector.source.map((node) => node.name),
      graphVectorRef
    );
    assert.equal(contract.targetAssetType, vector.target.name, graphVectorRef);
    classificationCounts[contract.closureClassification] =
      (classificationCounts[contract.closureClassification] ?? 0) + 1;
  }

  assert.deepStrictEqual(classificationCounts, {
    close_capable: 47,
    library_only: 9,
    projection_only: 6
  });
});

test("T-164 contract rows match current-full materialized graph vector boundaries", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const currentFull = overlayByRef(catalog, SDLC_CURRENT_FULL_TRAVERSAL_OVERLAY_REF);
  const materializedVectors = materializedVectorsForOverlay(module, currentFull);
  const byEdge = indexSdlcEdgeGainClosureContracts({
    contracts: SDLC_EDGE_GAIN_CLOSURE_CONTRACTS
  });

  for (const graphVectorRef of unique(currentFull.graphVectorRefs)) {
    const vector = materializedVectors.get(graphVectorRef);
    const contract = byEdge.get(graphVectorRef);
    assert(vector, graphVectorRef);
    assert(contract, graphVectorRef);
    assert.deepStrictEqual(
      contract.sourceAssetTypes,
      vector.source.map((node) => node.name),
      graphVectorRef
    );
    assert.equal(contract.targetAssetType, vector.target.name, graphVectorRef);
  }
});

test("T-164 overlay matrix covers every current overlay-selected vector", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const overlayVectorUnion = unique(
    catalog.overlays.flatMap((overlay) => overlay.graphVectorRefs)
  );

  assert.equal(catalog.overlays.length, 5);
  assert.equal(overlayVectorUnion.length, 45);

  for (const overlay of catalog.overlays) {
    assertSdlcOverlayEdgeGainClosureContracts({
      overlayRef: overlay.overlayRef,
      graphVectorRefs: overlay.graphVectorRefs,
      contracts: SDLC_EDGE_GAIN_CLOSURE_CONTRACTS
    });
  }
});

test("T-164 lite direct implementation vector has a specialized residual-pressure row", () => {
  const module = constructSdlcGtlModule();
  const catalog = constructSdlcTraversalOverlayCatalog({ module });
  const lite = overlayByRef(catalog, SDLC_LITE_DESIGN_MODULE_IMPLEMENTATION_OVERLAY_REF);
  const vectors = materializedVectorsForOverlay(module, lite);
  const liteDirectVector = vectors.get(FG_DERIVE_LITE_COMPONENT_CODE_SURFACE);
  assert(liteDirectVector);

  assert.deepStrictEqual(
    liteDirectVector.source.map((node) => node.name),
    ["implementation_design_surface", "implementation_module_surface"]
  );
  assert.equal(liteDirectVector.target.name, "component_code_surface");

  const contract = indexSdlcEdgeGainClosureContracts({
    contracts: SDLC_EDGE_GAIN_CLOSURE_CONTRACTS
  }).get(FG_DERIVE_LITE_COMPONENT_CODE_SURFACE);
  assert(contract);
  assert.equal(contract.category, "implementation_encoding");
  assert.equal(contract.compositionRole, "terminal");
  assert(
    contract.residualPressureRefs.includes(
      "pressure://odd-sdlc/current-full-traversal-refinement"
    )
  );
});

test("T-164 matrix validation fails closed for missing duplicate ambiguous and unregistered rows", () => {
  const contract = SDLC_EDGE_GAIN_CLOSURE_CONTRACTS[0];
  assert(contract);

  assert.throws(
    () =>
      assertSdlcOverlayEdgeGainClosureContracts({
        overlayRef: "overlay://odd-sdlc/test",
        graphVectorRefs: [contract.edgeRef, "missing_edge"],
        contracts: [contract]
      }),
    (error) => error?.code === "missing_edge_gain_closure_contract"
  );

  assert.throws(
    () =>
      indexSdlcEdgeGainClosureContracts({
        contracts: [contract, contract]
      }),
    (error) => error?.code === "duplicate_edge_gain_closure_contract"
  );

  assert.throws(
    () =>
      indexSdlcEdgeGainClosureContracts({
        contracts: [{ ...contract, sourceAssetTypes: [] }]
      }),
    (error) => error?.code === "ambiguous_edge_gain_closure_contract"
  );

  assert.throws(
    () =>
      assertSdlcEdgeGainClosureContractsRegistered({
        publishedGraphVectorRefs: [],
        contracts: [contract]
      }),
    (error) => error?.code === "unregistered_edge_gain_closure_contract"
  );
});

test("T-164 category templates declare the common function pack shape", () => {
  assert.equal(SDLC_EDGE_GAIN_CLOSURE_CATEGORY_TEMPLATES.length, 15);
  for (const template of SDLC_EDGE_GAIN_CLOSURE_CATEGORY_TEMPLATES) {
    assert.match(
      template.functionPack.deriveObligationsRef,
      new RegExp(`/${template.category}/derive-obligations$`)
    );
    assert.match(
      template.functionPack.admitEvidenceRef,
      new RegExp(`/${template.category}/admit-evidence$`)
    );
    assert.match(
      template.functionPack.measureGainRef,
      new RegExp(`/${template.category}/measure-gain$`)
    );
    assert.match(
      template.functionPack.closeEdgeRef,
      new RegExp(`/${template.category}/close-edge$`)
    );
    assert.match(
      template.functionPack.deriveResidualPressureRef,
      new RegExp(`/${template.category}/derive-residual-pressure$`)
    );
    assert.match(
      template.functionPack.composePathGainRef,
      new RegExp(`/${template.category}/compose-path-gain$`)
    );
    assert(template.defaultLedgerInputKinds.length > 0, template.category);
    assert(template.deterministicOptimizationRefs.length > 0, template.category);
  }
});

test("T-164 edge gain is measured by admitted obligation evidence not worker percentages", () => {
  const contract = contractByEdge("derive_requirement_surface");
  const obligations = deriveSdlcEdgeObligations({
    contract,
    obligationRefs: [
      "RequirementAuthority(current_surface,REQ-X)",
      "BehavioralFulfillment(REQ-X)"
    ]
  });
  const admission = admitSdlcEdgeEvidence({
    contract,
    obligations,
    candidates: [
      {
        kind: "sdlc_edge_evidence_candidate",
        evidenceRef: "evidence://req-x/authority-ledger-row",
        sourceKind: "worker_assessment",
        obligationRefs: ["RequirementAuthority(current_surface,REQ-X)"],
        supportsBehavioralFulfillment: true
      },
      {
        kind: "sdlc_edge_evidence_candidate",
        evidenceRef: "metric://worker/req-x/100-percent-complete",
        sourceKind: "worker_percent_complete",
        obligationRefs: ["BehavioralFulfillment(REQ-X)"],
        supportsBehavioralFulfillment: true
      }
    ]
  });

  assert.equal(admission.admittedEvidence.length, 1);
  assert.equal(admission.rejectedEvidence.length, 1);
  assert.match(
    admission.rejectedEvidence[0].reasonRef,
    /worker_percent_complete_is_not_metric_authority/
  );

  const gain = measureSdlcEdgeGain({
    contract,
    obligations,
    admittedEvidence: admission.admittedEvidence,
    ledgerInputs: allLedgerInputsFor(contract)
  });
  const residual = deriveSdlcEdgeResidualPressure(gain);
  const decision = deriveSdlcEdgeAssuranceCloseDecision({ gain, residualPressure: residual });

  assert.equal(gain.expectedCount, 2);
  assert.equal(gain.fulfilledCount, 1);
  assert.equal(gain.missingCount, 1);
  assert.equal(gain.closeReady, false);
  assert.equal(residual.clear, false);
  assert.equal(decision.disposition, "retry");

  const closeAdmission = admitSdlcEdgeEvidence({
    contract,
    obligations,
    candidates: [
      ...admission.admittedEvidence.map((evidence) => ({
        kind: "sdlc_edge_evidence_candidate",
        evidenceRef: evidence.evidenceRef,
        sourceKind: evidence.sourceKind,
        obligationRefs: evidence.obligationRefs,
        supportsBehavioralFulfillment: true
      })),
      {
        kind: "sdlc_edge_evidence_candidate",
        evidenceRef: "evidence://req-x/behavioral-proof",
        sourceKind: "runtime_event",
        obligationRefs: ["BehavioralFulfillment(REQ-X)"],
        supportsBehavioralFulfillment: true
      }
    ]
  });
  const closeGain = measureSdlcEdgeGain({
    contract,
    obligations,
    admittedEvidence: closeAdmission.admittedEvidence,
    ledgerInputs: allLedgerInputsFor(contract)
  });
  const closeResidual = deriveSdlcEdgeResidualPressure(closeGain);
  const closeDecision = deriveSdlcEdgeAssuranceCloseDecision({
    gain: closeGain,
    residualPressure: closeResidual
  });

  assert.equal(closeGain.missingCount, 0);
  assert.equal(closeResidual.clear, true);
  assert.equal(closeDecision.disposition, "close");
});

test("T-164 artifact presence alone is rejected as behavioral closure evidence", () => {
  const contract = contractByEdge("derive_component_code_surface");
  const obligationRef = "BehavioralFulfillment(component-code)";
  const obligations = deriveSdlcEdgeObligations({
    contract,
    obligationRefs: [obligationRef]
  });
  const admission = admitSdlcEdgeEvidence({
    contract,
    obligations,
    candidates: [
      {
        kind: "sdlc_edge_evidence_candidate",
        evidenceRef: "file://build_tenants/rust_service/src/main.rs",
        sourceKind: "artifact_presence",
        obligationRefs: [obligationRef]
      }
    ]
  });
  const gain = measureSdlcEdgeGain({
    contract,
    obligations,
    admittedEvidence: admission.admittedEvidence,
    ledgerInputs: allLedgerInputsFor(contract)
  });

  assert.equal(admission.admittedEvidence.length, 0);
  assert.equal(admission.rejectedEvidence.length, 1);
  assert.match(
    admission.rejectedEvidence[0].reasonRef,
    /artifact_presence_without_behavioral_fulfillment/
  );
  assert.equal(gain.closeReady, false);
});

test("T-164 compound traversal gain exposes the open edge in a three-vector chain", () => {
  const chain = composeSdlcPathGain({
    pathRef: "path://odd-sdlc/t164/a-b-c-d",
    edgeGains: [
      measuredGain("derive_intent_surface", true),
      measuredGain("derive_requirement_surface", false),
      measuredGain("derive_design_surface", true)
    ]
  });

  assert.equal(chain.edgeGainRefs.length, 3);
  assert.equal(chain.closeReady, false);
  assert.deepStrictEqual(chain.openEdgeRefs, ["derive_requirement_surface"]);
  assert.deepStrictEqual(chain.bottleneckEdgeRefs, ["derive_requirement_surface"]);
  assert(chain.residualPressureRefs.length > 0);
});

test("T-164 consequence carriers retain gain close and residual pressure identity", () => {
  const contract = contractByEdge("derive_design_surface");
  const contractRef = sdlcEdgeAssuranceContractRef(contract);
  const contractDigest = digestSdlcEdgeGainClosureContract(contract);
  const edgeGainRef = "edge-gain://odd-sdlc/t164/design";
  const residualPressureRefs = ["pressure://odd-sdlc/t164/design/missing-proof"];
  const ledger = constructSdlcEdgeFulfillmentLedger({
    ledgerRef: "ledger://odd-sdlc/t164/edge-fulfillment",
    ledgerVersionRef: "ledger-version://odd-sdlc/t164/edge-fulfillment/1",
    overlayRef: "overlay://odd-sdlc/t164",
    overlayBindingRef: "overlay-binding://odd-sdlc/t164",
    graphCatalogDigestRef: "sha256:t164-catalog",
    edgeAssuranceContractRef: contractRef,
    edgeAssuranceContractDigest: contractDigest,
    edgeGainRef,
    edgeResidualPressureRefs: residualPressureRefs,
    edgeRef: "edge://odd-sdlc/t164/derive-design",
    attemptRef: "attempt://odd-sdlc/t164/derive-design/1",
    targetBindingRefs: ["target-binding://odd-sdlc/t164/design"],
    evidenceBundleRefs: ["evidence://odd-sdlc/t164/worksite"],
    counts: {
      expected: 1,
      fulfilled: 0,
      partial: 0,
      blocked: 1,
      unfulfilled: 0,
      missing: 0,
      extra: 0
    },
    admitted: true,
    targetCertificationPassed: true,
    fdRecheckPassed: true
  });
  const decision = deriveSdlcEdgeClosureDecision({
    decisionRef: "closure-decision://odd-sdlc/t164/edge-fulfillment/1",
    ledger,
    edgeClosureFunctionRef: contract.closureFunctionRef,
    currentEdgeLawful: true,
    blockReasonRefs: residualPressureRefs
  });
  const projection = constructSdlcNextActionProjection({
    nextActionProjectionRef: "next-action://odd-sdlc/t164/block",
    intentEventRefs: ["intent-event://odd-sdlc/t164/1"],
    productAssetModelRef: "product-asset-model://odd-sdlc/t164",
    gapPressureRefs: residualPressureRefs,
    targetBindingRefs: ledger.targetBindingRefs,
    closureDecision: decision,
    observationRef: "observation://odd-sdlc/t164/post-action",
    policyRefs: ["policy://odd-sdlc/t164/no-action"],
    actionCatalogRefs: ["catalog://odd-sdlc/t164/empty"]
  });

  assert.equal(ledger.edgeAssuranceContractRef, contractRef);
  assert.equal(ledger.edgeAssuranceContractDigest, contractDigest);
  assert.equal(ledger.edgeGainRef, edgeGainRef);
  assert.deepStrictEqual(ledger.edgeResidualPressureRefs, residualPressureRefs);
  assert.equal(decision.edgeClosureFunctionRef, contract.closureFunctionRef);
  assert.equal(decision.edgeGainRef, edgeGainRef);
  assert.equal(projection.edgeAssuranceContractRef, contractRef);
  assert.equal(projection.edgeGainRef, edgeGainRef);
  assert.deepStrictEqual(projection.edgeResidualPressureRefs, residualPressureRefs);
});

test("T-164 handoff invocation and brief carry the edge assurance contract", () => {
  const workspace = makeWorkspace();
  const hookContract = hookContractByEdgeName("derive_code_surface");
  const edgeContract = contractByEdge("derive_code_surface");
  const contractRef = sdlcEdgeAssuranceContractRef(edgeContract);
  const contractDigest = digestSdlcEdgeGainClosureContract(edgeContract);
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: hookContract.edgeName,
    vectorIndex: 12,
    contract: hookContract,
    runId: "t164-edge-assurance-carrier"
  });
  const invocationPackage = constructWorkerInvocationPackage({ manifest });
  const brief = constructWorkerBrief({
    manifest,
    manifestPath: path.join(manifest.archiveRoot, "handoff_manifest.json"),
    workerInvocationPackagePath: path.join(
      manifest.archiveRoot,
      "worker_invocation_package.json"
    ),
    traversalIntentPath: path.join(manifest.archiveRoot, "traversal_intent_package.json"),
    conformedProjectPath: path.join(manifest.archiveRoot, "conformed_project.json"),
    invocationPackage
  });

  assert.doesNotThrow(() => assertTraversalIntentPackagePressure(manifest));
  assert.equal(manifest.edgeAssuranceContractRef, contractRef);
  assert.equal(manifest.edgeAssuranceContractDigest, contractDigest);
  assert.equal(manifest.traversalObligationContext.edgeAssuranceContractRef, contractRef);
  assert.equal(manifest.traversalIntentPackage.edgeAssuranceContractRef, contractRef);
  assert.equal(invocationPackage.edgeAssuranceContractRef, contractRef);
  assert.equal(brief.edgeAssuranceContractRef, contractRef);
  assert.equal(brief.edgeAssuranceContractDigest, contractDigest);
});
