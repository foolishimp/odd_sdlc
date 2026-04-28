// Validates: REQ-F-ODDSDLC-013
// Validates: REQ-F-ODDSDLC-051
// Validates: REQ-F-ODDSDLC-055
// Validates: T-084

import test from "node:test";
import assert from "node:assert/strict";

import {
  SDLC_ASSURANCE_LEDGER_DIMENSIONS,
  deriveAmbiguityAssuranceLedger,
  deriveCapabilityAssuranceLedger,
  deriveMaterializationAssuranceLedger,
  deriveObligationCarryAssuranceLedger,
  deriveRequirementFulfillmentAssuranceLedger,
  deriveSemanticConvergenceAssuranceLedger,
  deriveShallowRealizationAssuranceLedger,
  foldSdlcAssuranceLedgers,
  makeSdlcAssuranceLedger,
  makeSdlcAssuranceLedgerReason
} from "../../build/semantic/code/src/index.js";

function reason(code, lawfulReentryPoint = "same_edge_retry") {
  return makeSdlcAssuranceLedgerReason({
    code,
    message: code,
    evidenceRefs: [`proof://${code}`],
    lawfulReentryPoint
  });
}

function ledger(dimension, verdict, input = {}) {
  return makeSdlcAssuranceLedger({
    dimension,
    verdict,
    reasons: input.reasons ?? [],
    evidenceRefs: input.evidenceRefs ?? [],
    carryForwardObligationRefs: input.carryForwardObligationRefs ?? []
  });
}

function allSatisfied(overrides = []) {
  const overrideByDimension = new Map(
    overrides.map((override) => [override.dimension, override])
  );
  return SDLC_ASSURANCE_LEDGER_DIMENSIONS.map((dimension) =>
    overrideByDimension.get(dimension) ?? ledger(dimension, "satisfied")
  );
}

function manifest() {
  return {
    kind: "sdlc_worker_handoff_manifest",
    reportFile: "proof://worker-report",
    productMaterialization: {
      kind: "sdlc_product_materialization_contract",
      required: true,
      activeTenant: "scala_spark",
      selectedOutputRoot: "build_tenants/scala_spark",
      tenantRoot: "/workspace/build_tenants/scala_spark",
      relativePathBasis: "tenant_root",
      declaredModuleNames: [],
      buildExecutionContract: "sbt clean assembly",
      testExecutionContract: "sbt test",
      manifestFile: "proof://materialization-manifest",
      requiredRoles: ["source"]
    },
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: []
    }
  };
}

function passedPostflight() {
  return {
    kind: "sdlc_operator_postflight_result",
    status: "passed",
    blockingReasons: [],
    blockingReasonCarriers: [],
    evidenceRefs: ["proof://postflight"]
  };
}

function fulfilledClosureRegister() {
  return {
    kind: "sdlc_requirement_closure_register",
    entries: [
      {
        kind: "sdlc_requirement_closure_entry",
        requirementId: "REQ-DM-001",
        sourceInputUris: ["fixture://requirements"],
        assetIds: ["asset://code"],
        producedByGraphFunctions: ["derive_code_surface"],
        proofKinds: ["behavioral_test"],
        authorityVerbs: ["validates"],
        evidenceRefs: ["proof://requirement"],
        traceabilityStatus: "behavioral_evidence",
        fulfillmentStatus: "fulfilled",
        carryStatus: "fulfilled",
        openReasons: []
      }
    ],
    fulfilledRequirementIds: ["REQ-DM-001"],
    carriedForwardRequirementIds: [],
    unresolvedRequirementIds: [],
    emittedRuntimeEventKinds: []
  };
}

test("T-084 fold admits every ledger verdict kind", () => {
  for (const verdict of [
    "satisfied",
    "open_gap",
    "blocked",
    "reprice_required",
    "not_applicable"
  ]) {
    const satisfaction = foldSdlcAssuranceLedgers({
      requiredDimensions: ["materialization"],
      ledgers: [ledger("materialization", verdict)]
    });
    assert.equal(satisfaction.ledgers[0].verdict, verdict);
  }
});

test("T-084 blocked ledger prevents closure", () => {
  const blocked = ledger("materialization", "blocked", {
    reasons: [reason("materialization_report_missing", "operator_blocked")]
  });
  const satisfaction = foldSdlcAssuranceLedgers({
    ledgers: allSatisfied([blocked])
  });

  assert.equal(satisfaction.status, "blocked");
  assert.deepStrictEqual(
    satisfaction.blockingReasons.map((item) => item.code),
    ["materialization_report_missing"]
  );
});

test("T-084 reprice dominates retry gaps", () => {
  const reprice = ledger("ambiguity", "reprice_required", {
    reasons: [reason("target_asset_identity_ambiguous", "requirement_reprice")]
  });
  const gap = ledger("capability", "open_gap", {
    reasons: [reason("capability_inventory_missing")]
  });
  const satisfaction = foldSdlcAssuranceLedgers({
    ledgers: allSatisfied([reprice, gap])
  });

  assert.equal(satisfaction.status, "reprice_required");
  assert.deepStrictEqual(
    satisfaction.repriceReasons.map((item) => item.code),
    ["target_asset_identity_ambiguous"]
  );
  assert.deepStrictEqual(
    satisfaction.gapReasons.map((item) => item.code),
    ["capability_inventory_missing"]
  );
});

test("T-084 open gap produces same-edge retry pressure", () => {
  const openGap = ledger("semantic_convergence", "open_gap", {
    reasons: [reason("candidate_restates_target_only")],
    carryForwardObligationRefs: ["gap://semantic/candidate_restates_target_only"]
  });
  const satisfaction = foldSdlcAssuranceLedgers({
    ledgers: allSatisfied([openGap])
  });

  assert.equal(satisfaction.status, "retry_same_edge");
  assert.deepStrictEqual(satisfaction.retryHandoff.obligationRefs, [
    "gap://semantic/candidate_restates_target_only"
  ]);
  assert.deepStrictEqual(satisfaction.retryHandoff.reasonCodes, [
    "candidate_restates_target_only"
  ]);
});

test("T-084 all satisfied ledgers allow closure", () => {
  const satisfaction = foldSdlcAssuranceLedgers({
    ledgers: allSatisfied()
  });

  assert.equal(satisfaction.status, "close_allowed");
  assert.equal(satisfaction.missingRequiredDimensions.length, 0);
  assert.equal(satisfaction.satisfiedDimensions.length, 7);
});

test("T-084 not-applicable ledger does not hide required failure", () => {
  const notApplicable = ledger("semantic_convergence", "not_applicable");
  const blocked = ledger("requirement_fulfillment", "blocked", {
    reasons: [reason("requirement_trace_basis_missing", "operator_blocked")]
  });
  const satisfaction = foldSdlcAssuranceLedgers({
    ledgers: allSatisfied([notApplicable, blocked])
  });

  assert.equal(satisfaction.status, "blocked");
  assert.deepStrictEqual(satisfaction.notApplicableDimensions, [
    "semantic_convergence"
  ]);
  assert.deepStrictEqual(
    satisfaction.blockingReasons.map((item) => item.code),
    ["requirement_trace_basis_missing"]
  );
});

test("T-084 missing required ledger blocks closure deterministically", () => {
  const satisfaction = foldSdlcAssuranceLedgers({
    requiredDimensions: ["materialization", "capability"],
    ledgers: [ledger("materialization", "satisfied")]
  });

  assert.equal(satisfaction.status, "blocked");
  assert.deepStrictEqual(satisfaction.missingRequiredDimensions, ["capability"]);
  assert.deepStrictEqual(
    satisfaction.blockingReasons.map((item) => item.code),
    ["missing_required_ledger:capability"]
  );
});

test("T-084 folds real outputs from every assurance dimension", () => {
  const materialization = deriveMaterializationAssuranceLedger({
    manifest: manifest(),
    report: {
      kind: "odd_sdlc.worker_result_report",
      graphFunctionName: "bootstrap_release_self_test",
      edgeName: "derive_code_surface",
      targetAssetType: "code_surface",
      outputFile: "proof://code-surface",
      digest: "sha256:code",
      summary: "result",
      unresolvedReasons: [],
      materializedFiles: [
        {
          kind: "sdlc_materialized_product_file",
          role: "source",
          relativePath: "src/main/scala/Mapper.scala",
          absolutePath: "/workspace/build_tenants/scala_spark/src/main/scala/Mapper.scala",
          digest: "sha256:mapper",
          byteCount: 32
        }
      ]
    },
    postflight: passedPostflight()
  });
  const semantic = deriveSemanticConvergenceAssuranceLedger({
    targetRefs: ["target://mapper/lineage"],
    claims: [
      {
        kind: "sdlc_semantic_convergence_claim",
        targetRef: "target://mapper/lineage",
        status: "covered",
        evidenceRefs: ["proof://semantic"]
      }
    ]
  });
  const obligation = deriveObligationCarryAssuranceLedger({
    manifest: manifest(),
    currentGapDossier: null
  });
  const requirement = deriveRequirementFulfillmentAssuranceLedger({
    closureRegister: fulfilledClosureRegister()
  });
  const ambiguity = deriveAmbiguityAssuranceLedger({ findings: [] });
  const capability = deriveCapabilityAssuranceLedger({
    requiredCapabilities: [
      {
        kind: "sdlc_required_capability",
        capabilityId: "lineage_preservation",
        evidenceContract: "lineage links source and target fields",
        requirementRefs: ["REQ-DM-001"]
      }
    ],
    observedCapabilities: [
      {
        kind: "sdlc_observed_capability",
        capabilityId: "lineage_preservation",
        evidenceRefs: ["file://Mapper.scala"],
        substantive: true
      }
    ]
  });
  const shallow = deriveShallowRealizationAssuranceLedger({
    synthesisRequired: true,
    executableProofRequired: true,
    surfaces: [
      {
        kind: "sdlc_realization_text_surface",
        role: "source",
        ref: "file://Mapper.scala",
        content: "object Mapper { def map(input: String) = input.reverse }"
      },
      {
        kind: "sdlc_realization_text_surface",
        role: "test",
        ref: "file://MapperSpec.scala",
        content: "test(\"mapper\") { assert(Mapper.map(\"ab\") == \"ba\") }"
      }
    ]
  });
  const satisfaction = foldSdlcAssuranceLedgers({
    ledgers: [
      materialization,
      semantic,
      obligation,
      requirement,
      ambiguity,
      capability,
      shallow
    ]
  });

  assert.equal(satisfaction.status, "close_allowed");
  assert.deepStrictEqual(
    satisfaction.ledgers.map((item) => item.dimension),
    SDLC_ASSURANCE_LEDGER_DIMENSIONS
  );
});
