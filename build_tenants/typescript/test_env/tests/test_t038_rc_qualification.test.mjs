// Validates: REQ-F-ODDSDLC-024
// Validates: REQ-F-ODDSDLC-040
// Validates: REQ-F-ODDSDLC-041
// Validates: REQ-F-ODDSDLC-043
// Investigates: T-038

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  admitSdlcConstructorResult,
  admitSdlcOperationalResult,
  admitSdlcProjectConstraints,
  admitSdlcRequirementProofClaim,
  classifySdlcGapObservation,
  constructSdlcGtlModule,
  deriveSdlcLineageLedger,
  deriveSdlcSourceInput,
  deriveSdlcGapDossier,
  deriveSdlcWorkspaceIngressReport,
  describeOddSdlcTypescriptRcQualification,
  hookContractByEdgeName,
  minimalSdlcHookInvocationForContract,
  observeSdlcGapPressure,
  observeSdlcRuntimeReturn,
  prepareSdlcOperationalTransition,
  projectSdlcQueryDomain,
  projectSdlcRepairFrontier,
  projectSdlcRequirementClosureRegister,
  projectSdlcWorkerAttachment,
  publicStartOnce,
  remainingOddSdlcTypescriptRcGaps,
  routeSdlcTicketWorkItem,
  runSdlcHookTurn,
  bindSdlcRoute,
  advanceSdlcOperationalTransitionOnce
} from "../../build/semantic/code/src/index.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

const PORTABLE_REQUIREMENTS_TEXT = [
  "# Requirements",
  "",
  "REQ-LDM-001: The mapper preserves lineage.",
  "REQ-ENG-007: The implementation exposes runnable proof."
].join("\n");

function fixtureSnapshot(relativePath, content) {
  return {
    uri: `fixture://portable-t038/${relativePath}`,
    relativePath,
    content
  };
}

function ingressReport() {
  const constraints = admitSdlcProjectConstraints({
    projectSlug: "data_mapper",
    activeTenant: "typescript",
    selectedOutputRoot: "build_tenants/typescript",
    ambiguityRiskAppetite: "medium",
    capabilityContracts: ["build_runner", "runtime_return_channel"]
  });
  const sourceInputs = [
    deriveSdlcSourceInput(
      fixtureSnapshot(
        "specification/INTENT.md",
        ["# Intent", "", "**Project**: data_mapper", "", "INT-001: Govern mapping."].join("\n")
      )
    ),
    deriveSdlcSourceInput(
      fixtureSnapshot("specification/requirements/01-core.md", PORTABLE_REQUIREMENTS_TEXT)
    ),
    deriveSdlcSourceInput(
      fixtureSnapshot(
        ".ai-workspace/context/project_constraints.yml",
        ["name: data_mapper", "active_tenant: typescript"].join("\n")
      )
    )
  ];
  return deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: "fixture://portable-t038",
    projectConstraints: constraints,
    sourceInputs
  });
}

function codeSurfaceConstructorResult(targetAssetId, requestedOperation) {
  return admitSdlcConstructorResult({
    operationType: requestedOperation,
    outputIdentity: {
      assetId: targetAssetId,
      uri: "file:///workspace/build_tenants/typescript/code/src/generated.ts",
      declaredType: "code_surface",
      digest: "sha256:t038-code-surface",
      byteCount: 128
    },
    evidenceRefs: [
      {
        ref: "test://t038/harnessed-worker-report",
        evidenceType: "harnessed_fp_work_report",
        digest: "sha256:t038-worker-report"
      }
    ],
    generatedAssetContract: {
      contractName: "generated-code-surface-contract",
      targetAssetId,
      satisfied: true,
      materialized: true,
      diagnostics: [],
      foreignRealizationCandidates: []
    },
    ambiguityCandidates: []
  });
}

test("T-038 qualification report scopes RC claim and tickets remaining gaps", () => {
  const report = describeOddSdlcTypescriptRcQualification();

  assert.equal(report.kind, "odd_sdlc_typescript_rc_qualification_report");
  assert.equal(report.verdict, "bounded_rc_ready");
  assert(report.nonClaimedScope.includes("live probabilistic data_mapper generation with an external F_P worker"));
  assert(report.gates.some((gate) => gate.name === "T-038 composed harnessed sandbox" && gate.status === "passed"));
  assert(report.gates.some((gate) => gate.name === "live F_P worker traversal" && gate.status === "not_claimed"));

  for (const gap of remainingOddSdlcTypescriptRcGaps()) {
    assert(gap.gapTicket);
    assert(existsSync(resolve(REPO_ROOT, gap.gapTicket)));
  }
});

test("T-038 composed harnessed sandbox walks ingress to operational return", () => {
  const ingress = ingressReport();
  const module = constructSdlcGtlModule();
  const queryDomain = projectSdlcQueryDomain({
    module,
    ingressReport: ingress,
    currentDossierRefs: ["test://t038/dossier"]
  });

  const workerAttachment = projectSdlcWorkerAttachment({
    transportContract: "transport://t038/harnessed-fp"
  });
  const start = publicStartOnce({
    request: {
      kind: "sdlc_public_start_request",
      workspaceRoot: "/tmp/t038",
      target: {
        kind: "asset",
        handle: "release_surface"
      },
      until: "first_traversal",
      defaultRegime: "F_P"
    },
    module,
    queryDomain,
    workerAttachment
  });

  assert.equal(start.kind, "sdlc_public_start_projected");
  assert.equal(start.status, "dispatch_required");
  assert.equal(start.executionContract.targetGraphFunction, "bootstrap_release_self_test");

  const gapDossier = deriveSdlcGapDossier({
    basis: start.executionContract.basis,
    events: [],
    triageInput: "t038 harnessed sandbox",
    evidenceRefs: ["test://t038/start"]
  });
  assert.equal(gapDossier.choosesNextTraversal, false);

  const contract = hookContractByEdgeName("derive_code_surface");
  const targetAssetId = "asset://t038/code-surface";
  const invocation = minimalSdlcHookInvocationForContract({
    contract,
    targetAssetId,
    fpWorkerContractRef: "transport://t038/harnessed-fp"
  });
  const hookTurn = runSdlcHookTurn({
    contract,
    invocation,
    constructorResult: codeSurfaceConstructorResult(targetAssetId, invocation.requestedOperation)
  });

  assert.equal(hookTurn.preflight.status, "passed");
  assert(hookTurn.workReport);
  assert.equal(hookTurn.postflight?.status, "passed");
  assert.equal(hookTurn.workReport.generatedAssetAuthority.graphFunctionName, "derive_code_surface");
  assert.deepStrictEqual(hookTurn.emittedRuntimeEventKinds, []);

  const proofClaim = admitSdlcRequirementProofClaim({
    kind: "sdlc_requirement_proof_claim",
    requirementId: "REQ-LDM-001",
    assetId: targetAssetId,
    proofKind: "behavioral_test",
    authorityVerb: "validates",
    evidenceRefs: ["test://t038/harnessed-sandbox"]
  });
  const lineage = deriveSdlcLineageLedger({
    ingressReport: ingress,
    workReports: [hookTurn.workReport],
    proofClaims: [proofClaim]
  });
  const closure = projectSdlcRequirementClosureRegister({
    ingressReport: ingress,
    lineageLedger: lineage
  });
  const repairFrontier = projectSdlcRepairFrontier({ closureRegister: closure });

  assert.deepStrictEqual(closure.fulfilledRequirementIds, ["REQ-LDM-001"]);
  assert.deepStrictEqual(closure.unresolvedRequirementIds, ["REQ-ENG-007"]);
  assert.deepStrictEqual(repairFrontier.unmetRequirementIds, ["REQ-ENG-007"]);

  const observation = observeSdlcGapPressure({
    gapDossier,
    closureRegister: closure,
    analysisRef: "analysis://t038"
  });
  const classification = classifySdlcGapObservation({ observation });
  const route = bindSdlcRoute({ observation, classification });
  const ticketRoute = routeSdlcTicketWorkItem({
    routeBinding: route,
    workItemRef: "ticket://T-038/harnessed-follow-up",
    lawfulReEntryPoint: "requirement_reprice"
  });

  assert.equal(classification.frameworkLayer, "requirements");
  assert.equal(route.lawfulStartTarget.handle, "derive_requirement_surface");
  assert.equal(ticketRoute.ticketAuthority, "TICKET_METHOD");
  assert.equal(ticketRoute.writesTicket, false);

  const buildPlan = prepareSdlcOperationalTransition({
    projectConstraints: ingress.projectConstraints,
    lane: "build",
    commandId: "command://t038/build",
    capabilityContract: "build_runner",
    targetAssetIds: [targetAssetId]
  });
  assert.equal(buildPlan.status, "prepared");
  assert(buildPlan.command);
  const buildResult = admitSdlcOperationalResult({
    kind: "sdlc_operational_result",
    resultId: "result://t038/build/1",
    commandId: buildPlan.command.commandId,
    status: "succeeded",
    evidenceAssetIds: ["asset://t038/build-log"],
    returnedAt: "2026-04-26T00:00:00Z"
  });
  const buildAdvance = advanceSdlcOperationalTransitionOnce({
    command: buildPlan.command,
    result: buildResult,
    runtimeFactRefs: ["abg://t038/build-result"]
  });
  assert.equal(buildAdvance.stage, "result_admitted");
  assert.equal(buildAdvance.projection.state, "succeeded");
  assert.equal(buildAdvance.nextControlOwner, "abg_public_start");

  const runtimePlan = prepareSdlcOperationalTransition({
    projectConstraints: ingress.projectConstraints,
    lane: "runtime_return",
    commandId: "command://t038/runtime-return",
    capabilityContract: "runtime_return_channel",
    targetAssetIds: ["asset://t038/deployment-result"]
  });
  assert(runtimePlan.command);
  const runtimeResult = admitSdlcOperationalResult({
    kind: "sdlc_operational_result",
    resultId: "result://t038/runtime-return/1",
    commandId: runtimePlan.command.commandId,
    status: "succeeded",
    evidenceAssetIds: ["asset://t038/runtime-observation"],
    returnedAt: "2026-04-26T00:00:00Z"
  });
  const runtimeObservation = observeSdlcRuntimeReturn({
    command: runtimePlan.command,
    result: runtimeResult,
    runtimeFactRefs: ["abg://t038/runtime-return"]
  });

  assert.deepStrictEqual(runtimeObservation.feedsGraphFunctions, [
    "derive_runtime_observation_surface",
    "derive_retrofit_plan_surface"
  ]);
  assert.deepStrictEqual(runtimeObservation.emittedRuntimeEventKinds, []);
});
