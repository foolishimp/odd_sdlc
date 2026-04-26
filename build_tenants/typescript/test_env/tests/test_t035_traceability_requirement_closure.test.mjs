// Validates: REQ-F-ODDSDLC-029
// Validates: REQ-F-ODDSDLC-030
// Validates: REQ-F-ODDSDLC-031
// Investigates: T-035

import test from "node:test";
import assert from "node:assert/strict";

import {
  admitSdlcConstructorResult,
  admitSdlcProjectConstraints,
  admitSdlcRequirementProofClaim,
  deriveSdlcLineageLedger,
  deriveSdlcSourceInput,
  deriveSdlcWorkspaceIngressReport,
  hookContractByEdgeName,
  minimalSdlcHookInvocationForContract,
  projectSdlcRepairFrontier,
  projectSdlcRequirementClosureRegister,
  runSdlcHookTurn
} from "../../build/semantic/code/src/index.js";

const REQUIREMENTS_TEXT = [
  "# Requirements",
  "",
  "REQ-EX-001: Generated code must implement the mapping behavior.",
  "REQ-EX-002: Generated code must expose traceability.",
  "REQ-EX-003: Runtime proof must remain visible until closed."
].join("\n");

function sourceInput(relativePath, content) {
  return deriveSdlcSourceInput({
    uri: `fixture://t035/${relativePath}`,
    relativePath,
    content
  });
}

function ingressReport() {
  return deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: "fixture://t035",
    projectConstraints: admitSdlcProjectConstraints({
      projectSlug: "t035",
      activeTenant: "typescript",
      selectedOutputRoot: "build_tenants/typescript",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: ["traceability", "requirement_closure"]
    }),
    sourceInputs: [
      sourceInput("specification/REQUIREMENTS.md", REQUIREMENTS_TEXT)
    ]
  });
}

function successfulCodeWorkReport() {
  const contract = hookContractByEdgeName("derive_code_surface");
  const targetAssetId = "asset://code_surface";
  const invocation = minimalSdlcHookInvocationForContract({
    contract,
    targetAssetId,
    fpWorkerContractRef: "worker://fp/local"
  });
  const outcome = runSdlcHookTurn({
    contract,
    invocation,
    constructorResult: admitSdlcConstructorResult({
      operationType: "generate",
      outputIdentity: {
        assetId: targetAssetId,
        uri: "file:///workspace/src/generated_code.ts",
        declaredType: "code_surface",
        digest: "sha256:generated-code",
        byteCount: 2048
      },
      evidenceRefs: [
        {
          ref: "file:///workspace/src/generated_code.ts",
          evidenceType: "materialized_asset",
          digest: "sha256:generated-code-evidence"
        }
      ],
      generatedAssetContract: {
        contractName: "generated-asset-contract",
        targetAssetId,
        satisfied: true,
        materialized: true,
        diagnostics: [],
        foreignRealizationCandidates: []
      },
      ambiguityCandidates: []
    })
  });
  assert.equal(outcome.postflight?.status, "passed");
  assert(outcome.workReport);
  return outcome.workReport;
}

function proofClaim(input) {
  return admitSdlcRequirementProofClaim({
    kind: "sdlc_requirement_proof_claim",
    ...input
  });
}

function closureEntry(register, requirementId) {
  const entry = register.entries.find(
    (candidate) => candidate.requirementId === requirementId
  );
  assert(entry);
  return entry;
}

test("T-035 lineage ties source requirement, graph function, generated asset, and proof", () => {
  const ingress = ingressReport();
  const workReport = successfulCodeWorkReport();
  const claims = [
    proofClaim({
      requirementId: "REQ-EX-001",
      assetId: "asset://code_surface",
      proofKind: "trace_tag",
      authorityVerb: "implements",
      evidenceRefs: ["comment://Implements:REQ-EX-001"]
    }),
    proofClaim({
      requirementId: "REQ-EX-001",
      assetId: "asset://code_surface",
      proofKind: "behavioral_test",
      authorityVerb: "validates",
      evidenceRefs: ["test://t035/REQ-EX-001"]
    }),
    proofClaim({
      requirementId: "REQ-EX-002",
      assetId: "asset://code_surface",
      proofKind: "trace_tag",
      authorityVerb: "implements",
      evidenceRefs: ["comment://Implements:REQ-EX-002"]
    })
  ];

  const ledger = deriveSdlcLineageLedger({
    ingressReport: ingress,
    workReports: [workReport],
    proofClaims: claims
  });
  const entry = ledger.entries[0];
  assert(entry);

  assert.equal(entry.elementId, "asset://code_surface");
  assert.equal(entry.producedByGraphFunction, "derive_code_surface");
  assert.equal(entry.selectedBy, "abg_selected_edge");
  assert.equal(entry.targetAssetType, "code_surface");
  assert.equal(entry.generatedAssetContractSatisfied, true);
  assert(entry.sourceInputUris.some((uri) => uri.endsWith("specification/REQUIREMENTS.md")));
  assert(entry.requirementIds.includes("REQ-EX-001"));
  assert(entry.requirementIds.includes("REQ-EX-002"));
  assert(entry.evidenceRefs.includes("test://t035/REQ-EX-001"));
  assert.deepStrictEqual(ledger.emittedRuntimeEventKinds, []);
});

test("T-035 requirement closure rejects trace-only shells and carries unresolved truth", () => {
  const ingress = ingressReport();
  const ledger = deriveSdlcLineageLedger({
    ingressReport: ingress,
    workReports: [successfulCodeWorkReport()],
    proofClaims: [
      proofClaim({
        requirementId: "REQ-EX-001",
        assetId: "asset://code_surface",
        proofKind: "trace_tag",
        authorityVerb: "implements",
        evidenceRefs: ["comment://Implements:REQ-EX-001"]
      }),
      proofClaim({
        requirementId: "REQ-EX-001",
        assetId: "asset://code_surface",
        proofKind: "behavioral_test",
        authorityVerb: "validates",
        evidenceRefs: ["test://t035/REQ-EX-001"]
      }),
      proofClaim({
        requirementId: "REQ-EX-002",
        assetId: "asset://code_surface",
        proofKind: "trace_tag",
        authorityVerb: "implements",
        evidenceRefs: ["comment://Implements:REQ-EX-002"]
      })
    ]
  });
  const register = projectSdlcRequirementClosureRegister({
    ingressReport: ingress,
    lineageLedger: ledger
  });

  const fulfilled = closureEntry(register, "REQ-EX-001");
  assert.equal(fulfilled.fulfillmentStatus, "fulfilled");
  assert.equal(fulfilled.traceabilityStatus, "behavioral_evidence");
  assert.equal(fulfilled.carryStatus, "fulfilled");

  const traceOnly = closureEntry(register, "REQ-EX-002");
  assert.equal(traceOnly.fulfillmentStatus, "partial");
  assert.equal(traceOnly.traceabilityStatus, "trace_only");
  assert.equal(traceOnly.carryStatus, "carried_forward");
  assert(traceOnly.openReasons.includes("behavioral_evidence_missing"));

  const missing = closureEntry(register, "REQ-EX-003");
  assert.equal(missing.fulfillmentStatus, "missing");
  assert.equal(missing.traceabilityStatus, "absent");
  assert.equal(missing.carryStatus, "carried_forward");
  assert(missing.openReasons.includes("no_generated_asset_lineage"));

  assert.deepStrictEqual(register.fulfilledRequirementIds, ["REQ-EX-001"]);
  assert.deepStrictEqual(register.unresolvedRequirementIds, [
    "REQ-EX-002",
    "REQ-EX-003"
  ]);
  assert.deepStrictEqual(register.emittedRuntimeEventKinds, []);
});

test("T-035 repair frontier separates unmet deltas from preservation truth", () => {
  const ingress = ingressReport();
  const ledger = deriveSdlcLineageLedger({
    ingressReport: ingress,
    workReports: [successfulCodeWorkReport()],
    proofClaims: [
      proofClaim({
        requirementId: "REQ-EX-001",
        assetId: "asset://code_surface",
        proofKind: "behavioral_test",
        authorityVerb: "validates",
        evidenceRefs: ["test://t035/REQ-EX-001"]
      })
    ]
  });
  const register = projectSdlcRequirementClosureRegister({
    ingressReport: ingress,
    lineageLedger: ledger
  });
  const frontier = projectSdlcRepairFrontier({ closureRegister: register });

  assert.deepStrictEqual(frontier.preservationRequirementIds, ["REQ-EX-001"]);
  assert.deepStrictEqual(frontier.unmetRequirementIds, [
    "REQ-EX-002",
    "REQ-EX-003"
  ]);
  assert(frontier.lanes.some((lane) => lane.lane === "test"));
  assert.match(frontier.lawfulProofFrontier, /behavioral_test|runtime_result/);
  assert.deepStrictEqual(frontier.emittedRuntimeEventKinds, []);
});

test("T-035 proof claim admission rejects wrong carrier kind", () => {
  assert.throws(
    () =>
      admitSdlcRequirementProofClaim({
        kind: "not_requirement_proof_claim",
        requirementId: "REQ-EX-001",
        assetId: "asset://code_surface",
        proofKind: "trace_tag",
        authorityVerb: "implements",
        evidenceRefs: ["comment://Implements:REQ-EX-001"]
      }),
    /kind/
  );
});

