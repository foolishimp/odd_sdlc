// Implements: REQ-F-ODDSDLC-033
// Implements: REQ-F-ODDSDLC-034
// Implements: REQ-F-ODDSDLC-035
// Implements: REQ-F-ODDSDLC-036
// Implements: REQ-F-ODDSDLC-037

import type {
  SdlcGapDossier,
  SdlcRequirementClosureRegister
} from "../projection/index.js";
import type {
  SdlcConstitutionalRepricingProposal,
  SdlcGapObservation,
  SdlcGapRetirement,
  SdlcRouteBinding,
  SdlcTicketWorkItemRoute,
  SdlcTriageClassification,
  SdlcTriageCondition,
  SdlcTriageFrameworkLayer,
  SdlcTriageProcessOutcome,
  SdlcTriageReEntryLayer
} from "./carriers.js";

const EMPTY_RUNTIME_EVENT_KINDS: readonly [] = Object.freeze([]);

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function observationId(input: {
  readonly analysisRef: string;
  readonly currentEdge: string | null;
  readonly requirementPressureIds: readonly string[];
}): string {
  return `observation:${input.analysisRef}:${input.currentEdge ?? "none"}:${input.requirementPressureIds.join(",")}`;
}

export function observeSdlcGapPressure(input: {
  readonly gapDossier: SdlcGapDossier;
  readonly closureRegister: SdlcRequirementClosureRegister;
  readonly analysisRef: string;
}): SdlcGapObservation {
  const requirementPressureIds = input.closureRegister.unresolvedRequirementIds;
  const currentEdge = input.gapDossier.edge;
  return Object.freeze({
    kind: "sdlc_gap_observation",
    observationId: observationId({
      analysisRef: input.analysisRef,
      currentEdge,
      requirementPressureIds
    }),
    analysisRef: input.analysisRef,
    gapStatus: input.gapDossier.status,
    currentEdge,
    requirementPressureIds,
    evidenceRefs: uniqueSorted([
      ...input.gapDossier.evidenceRefs,
      ...requirementPressureIds.map((requirementId) => `requirement://${requirementId}`)
    ]),
    freshnessToken: `${input.analysisRef}:${input.gapDossier.status}:${currentEdge ?? "none"}`,
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

function classifyObservation(
  observation: SdlcGapObservation
): {
  readonly frameworkLayer: SdlcTriageFrameworkLayer;
  readonly frameworkCondition: SdlcTriageCondition;
  readonly processOutcome: SdlcTriageProcessOutcome;
  readonly domainMeaning: string;
} {
  if (
    observation.gapStatus === "converged" &&
    observation.requirementPressureIds.length === 0
  ) {
    return {
      frameworkLayer: "release",
      frameworkCondition: "gap_retired",
      processOutcome: "gap_retired",
      domainMeaning: "gap is closed at current authority basis"
    };
  }
  if (observation.requirementPressureIds.length > 0) {
    return {
      frameworkLayer: "requirements",
      frameworkCondition: "unmet_requirement",
      processOutcome: "route_selected",
      domainMeaning: "unresolved requirement pressure must re-enter before implementation closure"
    };
  }
  if (observation.gapStatus === "open" || observation.gapStatus === "partial") {
    return {
      frameworkLayer: "code",
      frameworkCondition: "open_gap",
      processOutcome: "route_selected",
      domainMeaning: "current ABG edge remains open and needs a declared start target"
    };
  }
  return {
    frameworkLayer: "runtime",
    frameworkCondition: "unclassified_gap",
    processOutcome: "unclassified_gap",
    domainMeaning: "no totalized domain route matched the observation"
  };
}

export function classifySdlcGapObservation(input: {
  readonly observation: SdlcGapObservation;
  readonly ambiguityCarried?: boolean;
}): SdlcTriageClassification {
  const classification = classifyObservation(input.observation);
  return Object.freeze({
    kind: "sdlc_triage_classification",
    observationId: input.observation.observationId,
    frameworkLayer: classification.frameworkLayer,
    frameworkCondition: classification.frameworkCondition,
    domainMeaning: classification.domainMeaning,
    processOutcome: classification.processOutcome,
    ambiguityCarried: input.ambiguityCarried ?? false,
    evidenceRefs: Object.freeze([...input.observation.evidenceRefs]),
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

function reEntryLayerFor(classification: SdlcTriageClassification): SdlcTriageReEntryLayer {
  if (classification.processOutcome === "gap_retired") {
    return "none";
  }
  if (
    classification.frameworkLayer === "intent" ||
    classification.frameworkLayer === "goals" ||
    classification.frameworkLayer === "product" ||
    classification.frameworkLayer === "requirements" ||
    classification.frameworkLayer === "design" ||
    classification.frameworkLayer === "code" ||
    classification.frameworkLayer === "test"
  ) {
    return classification.frameworkLayer;
  }
  return "code";
}

function targetGraphFunctionFor(input: {
  readonly classification: SdlcTriageClassification;
  readonly observation: SdlcGapObservation;
}): string | null {
  if (input.classification.processOutcome === "gap_retired") {
    return null;
  }
  if (input.classification.frameworkLayer === "requirements") {
    return "derive_requirement_surface";
  }
  return input.observation.currentEdge;
}

export function bindSdlcRoute(input: {
  readonly observation: SdlcGapObservation;
  readonly classification: SdlcTriageClassification;
}): SdlcRouteBinding {
  const reEntryLayer = reEntryLayerFor(input.classification);
  const targetGraphFunction = targetGraphFunctionFor(input);
  const routeKind =
    input.classification.processOutcome === "gap_retired"
      ? "gap_retired"
      : "fixed_vector_repair";
  return Object.freeze({
    kind: "sdlc_route_binding",
    routeId: `route:${input.observation.observationId}`,
    observationId: input.observation.observationId,
    reEntryLayer,
    routeKind,
    targetGraphFunction,
    lawfulStartTarget: Object.freeze({
      kind: targetGraphFunction === null ? "none" : "graph_function",
      handle: targetGraphFunction
    }),
    routeEligibility: targetGraphFunction === null && routeKind !== "gap_retired" ? "blocked" : "eligible",
    preservedSignals: uniqueSorted([
      input.classification.frameworkCondition,
      ...input.observation.requirementPressureIds
    ]),
    mayApplyConstitutionalChange: false,
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

export function proposeSdlcConstitutionalRepricing(input: {
  readonly classification: SdlcTriageClassification;
  readonly targetSurface: SdlcConstitutionalRepricingProposal["targetSurface"];
  readonly proposedChangeSummary: string;
}): SdlcConstitutionalRepricingProposal {
  return Object.freeze({
    kind: "sdlc_constitutional_repricing_proposal",
    proposalId: `repricing:${input.classification.observationId}:${input.targetSurface}`,
    observationId: input.classification.observationId,
    targetSurface: input.targetSurface,
    proposedChangeSummary: input.proposedChangeSummary,
    approvalRequired: true,
    approvalOutcome: null,
    proposalApplied: false,
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

export function routeSdlcTicketWorkItem(input: {
  readonly routeBinding: SdlcRouteBinding;
  readonly workItemRef: string;
  readonly lawfulReEntryPoint: string;
}): SdlcTicketWorkItemRoute {
  return Object.freeze({
    kind: "sdlc_ticket_work_item_route",
    workItemRef: input.workItemRef,
    routeBindingId: input.routeBinding.routeId,
    ticketAuthority: "TICKET_METHOD",
    ticketStatus: "proposed",
    lawfulReEntryPoint: input.lawfulReEntryPoint,
    writesTicket: false,
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

export function retireSdlcGapAfterLoopback(input: {
  readonly observation: SdlcGapObservation;
  readonly closureRegister: SdlcRequirementClosureRegister;
  readonly evidenceRefs: readonly string[];
}): SdlcGapRetirement {
  const unresolvedRequirementIds = input.closureRegister.unresolvedRequirementIds;
  const status =
    input.observation.gapStatus === "converged" && unresolvedRequirementIds.length === 0
      ? "gap_retired"
      : "gap_still_open";
  return Object.freeze({
    kind: "sdlc_gap_retirement",
    observationId: input.observation.observationId,
    status,
    unresolvedRequirementIds,
    evidenceRefs: uniqueSorted(input.evidenceRefs),
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

