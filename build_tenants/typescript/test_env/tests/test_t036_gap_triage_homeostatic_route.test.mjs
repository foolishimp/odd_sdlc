// Validates: REQ-F-ODDSDLC-033
// Validates: REQ-F-ODDSDLC-034
// Validates: REQ-F-ODDSDLC-035
// Validates: REQ-F-ODDSDLC-036
// Validates: REQ-F-ODDSDLC-037
// Investigates: T-036

import test from "node:test";
import assert from "node:assert/strict";

import {
  admitExecutionBasis,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  admitStartIntent
} from "@abiogenesis/typescript-tenant";

import {
  admitSdlcProjectConstraints,
  bindSdlcRoute,
  classifySdlcGapObservation,
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule,
  deriveSdlcGapDossier,
  deriveSdlcLineageLedger,
  deriveSdlcSourceInput,
  deriveSdlcWorkspaceIngressReport,
  observeSdlcGapPressure,
  projectSdlcQueryDomain,
  projectSdlcRequirementClosureRegister,
  proposeSdlcConstitutionalRepricing,
  retireSdlcGapAfterLoopback,
  routeSdlcTicketWorkItem,
  SDLC_TRIAGE_CLASSIFICATION_POLICY,
  SDLC_TRIAGE_ROUTE_POLICY
} from "../../build/semantic/code/src/index.js";

function moduleBasis(handle = "bootstrap_release_self_test") {
  const module = constructSdlcGtlModule();
  return admitExecutionBasis({
    startIntent: admitStartIntent({
      scope: {
        kind: "workspace",
        workspaceRoot: "/workspace/t036",
        moduleName: module.name
      },
      target: {
        kind: "graph_function",
        handle
      },
      until: "blocked"
    }),
    module,
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: "worker://odd-sdlc/typescript",
      backendId: "backend://node",
      buildId: "build://odd-sdlc/typescript",
      resolvedRuntimeRef: "runtime://abiogenesis/typescript"
    }),
    resolvedPolicy: admitResolvedPolicyIdentity({
      resolvedPolicyBundleRef: "policy://odd-sdlc/t036/F_P",
      defaultRegime: "F_P",
      dispatchRef: "dispatch://odd-sdlc/t036",
      approvalSubjectRef: null
    }),
    runId: "run://odd-sdlc/t036",
    workKey: "wk://odd-sdlc/t036",
    frameId: null,
    frameLineageId: null
  });
}

function ingressReport(requirementsText) {
  return deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: "fixture://t036",
    projectConstraints: admitSdlcProjectConstraints({
      projectSlug: "t036",
      activeTenant: "typescript",
      selectedOutputRoot: "build_tenants/typescript",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: ["gap_triage", "ticket_routing"]
    }),
    sourceInputs:
      requirementsText.length === 0
        ? []
        : [
            deriveSdlcSourceInput({
              uri: "fixture://t036/specification/REQUIREMENTS.md",
              relativePath: "specification/REQUIREMENTS.md",
              content: requirementsText
            })
          ]
  });
}

function closureRegisterFor(requirementsText) {
  const ingress = ingressReport(requirementsText);
  const ledger = deriveSdlcLineageLedger({
    ingressReport: ingress,
    workReports: [],
    proofClaims: []
  });
  return projectSdlcRequirementClosureRegister({
    ingressReport: ingress,
    lineageLedger: ledger
  });
}

function openGapDossier() {
  return deriveSdlcGapDossier({
    basis: moduleBasis(),
    events: [],
    triageInput: "operator-review",
    evidenceRefs: ["event://graph-call-open"]
  });
}

test("T-036 observation, classification, and route binding remain separate carriers", () => {
  const closureRegister = closureRegisterFor(
    "REQ-T036-001: Unresolved pressure must route to lawful re-entry."
  );
  const observation = observeSdlcGapPressure({
    gapDossier: openGapDossier(),
    closureRegister,
    analysisRef: "analysis://t036/current"
  });
  const classification = classifySdlcGapObservation({ observation });
  const route = bindSdlcRoute({ observation, classification });

  assert.equal(observation.kind, "sdlc_gap_observation");
  assert.equal(observation.gapStatus, "open");
  assert.deepStrictEqual(observation.requirementPressureIds, ["REQ-T036-001"]);
  assert.deepStrictEqual(observation.emittedRuntimeEventKinds, []);

  assert.equal(classification.kind, "sdlc_triage_classification");
  assert.equal(classification.frameworkLayer, "requirements");
  assert.equal(classification.frameworkCondition, "unmet_requirement");
  assert.equal(classification.processOutcome, "route_selected");

  assert.equal(route.kind, "sdlc_route_binding");
  assert.equal(route.reEntryLayer, "requirements");
  assert.equal(route.routeKind, "fixed_vector_repair");
  assert.equal(route.targetGraphFunction, "derive_requirement_surface");
  assert.equal(route.lawfulStartTarget.handle, "derive_requirement_surface");
  assert.equal(route.mayApplyConstitutionalChange, false);
});

test("T-057 triage classification and route policy are declared data", () => {
  assert.deepStrictEqual(
    SDLC_TRIAGE_CLASSIFICATION_POLICY.map((entry) => entry.condition),
    [
      "converged_without_requirement_pressure",
      "requirement_pressure_present",
      "open_or_partial_gap",
      "fallback"
    ]
  );
  assert.deepStrictEqual(
    SDLC_TRIAGE_ROUTE_POLICY.map((entry) => entry.routePolicy),
    ["gap_retired", "requirements_pressure", "default_repair"]
  );
  assert(
    SDLC_TRIAGE_ROUTE_POLICY.some(
      (entry) =>
        entry.routePolicy === "requirements_pressure" &&
        entry.targetStrategy === "derive_requirement_surface"
    )
  );
});

test("T-036 constitutional repricing is explicit and never applied by triage", () => {
  const observation = observeSdlcGapPressure({
    gapDossier: openGapDossier(),
    closureRegister: closureRegisterFor("REQ-T036-002: Intent may need renewal."),
    analysisRef: "analysis://t036/intent-pressure"
  });
  const classification = classifySdlcGapObservation({
    observation,
    ambiguityCarried: true
  });
  const proposal = proposeSdlcConstitutionalRepricing({
    classification,
    targetSurface: "INTENT.md",
    proposedChangeSummary: "Clarify whether the current product intent admits this route."
  });

  assert.equal(proposal.kind, "sdlc_constitutional_repricing_proposal");
  assert.equal(proposal.approvalRequired, true);
  assert.equal(proposal.approvalOutcome, null);
  assert.equal(proposal.proposalApplied, false);
  assert.deepStrictEqual(proposal.emittedRuntimeEventKinds, []);
});

test("T-036 ticket routing is a TICKET_METHOD proposal and does not write process state", () => {
  const observation = observeSdlcGapPressure({
    gapDossier: openGapDossier(),
    closureRegister: closureRegisterFor("REQ-T036-003: Ticket route remains governed."),
    analysisRef: "analysis://t036/ticket-route"
  });
  const classification = classifySdlcGapObservation({ observation });
  const route = bindSdlcRoute({ observation, classification });
  const workItemRoute = routeSdlcTicketWorkItem({
    routeBinding: route,
    workItemRef: "ticket://T-NEW",
    lawfulReEntryPoint: "requirement_reprice"
  });

  assert.equal(workItemRoute.kind, "sdlc_ticket_work_item_route");
  assert.equal(workItemRoute.ticketAuthority, "TICKET_METHOD");
  assert.equal(workItemRoute.ticketStatus, "proposed");
  assert.equal(workItemRoute.writesTicket, false);
});

test("T-036 loopback retirement is visible and keeps open gaps open", () => {
  const closureRegister = closureRegisterFor("");
  const observation = observeSdlcGapPressure({
    gapDossier: {
      kind: "sdlc_gap_dossier",
      readOnly: true,
      choosesNextTraversal: false,
      edge: null,
      status: "converged",
      evidenceRefs: ["event://all-vectors-closed"],
      triageInput: "loopback",
      nextLawfulActions: []
    },
    closureRegister,
    analysisRef: "analysis://t036/loopback"
  });
  const retirement = retireSdlcGapAfterLoopback({
    observation,
    closureRegister,
    evidenceRefs: ["event://all-vectors-closed"]
  });

  assert.equal(retirement.kind, "sdlc_gap_retirement");
  assert.equal(retirement.status, "gap_retired");
  assert.deepStrictEqual(retirement.unresolvedRequirementIds, []);
  assert.deepStrictEqual(retirement.emittedRuntimeEventKinds, []);
});

test("T-036 triage graph functions are published and queryable", () => {
  const catalog = constructSdlcGraphFunctionCatalog();
  const module = constructSdlcGtlModule();
  const queryDomain = projectSdlcQueryDomain({
    module,
    ingressReport: ingressReport("")
  });

  assert(catalog.functions.some((entry) => entry.name === "observe_gap_pressure"));
  assert(catalog.functions.some((entry) => entry.name === "bind_gap_route"));
  assert(
    queryDomain.graphFunctions.some(
      (entry) => entry.name === "propose_constitutional_repricing"
    )
  );
  assert(
    queryDomain.assetOwnership.some(
      (entry) => entry.assetType === "ticket_work_item_route_surface"
    )
  );
});
