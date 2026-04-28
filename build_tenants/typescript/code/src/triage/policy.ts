// Implements: REQ-F-ODDSDLC-033
// Implements: REQ-F-ODDSDLC-034
// Implements: REQ-F-ODDSDLC-035

import type {
  SdlcRouteKind,
  SdlcTriageCondition,
  SdlcTriageFrameworkLayer,
  SdlcTriageProcessOutcome,
  SdlcTriageReEntryLayer
} from "./carriers.js";

export type SdlcTriageClassificationCondition =
  | "converged_without_requirement_pressure"
  | "requirement_pressure_present"
  | "open_or_partial_gap"
  | "fallback";

export interface SdlcTriageClassificationPolicyEntry {
  readonly kind: "sdlc_triage_classification_policy_entry";
  readonly condition: SdlcTriageClassificationCondition;
  readonly frameworkLayer: SdlcTriageFrameworkLayer;
  readonly frameworkCondition: SdlcTriageCondition;
  readonly processOutcome: SdlcTriageProcessOutcome;
  readonly domainMeaning: string;
}

export type SdlcTriageTargetStrategy =
  | "none"
  | "derive_requirement_surface"
  | "current_edge";

export interface SdlcTriageRoutePolicyEntry {
  readonly kind: "sdlc_triage_route_policy_entry";
  readonly routePolicy: "gap_retired" | "requirements_pressure" | "default_repair";
  readonly reEntryLayer: SdlcTriageReEntryLayer | "classification_layer_or_code";
  readonly routeKind: SdlcRouteKind;
  readonly targetStrategy: SdlcTriageTargetStrategy;
}

export const SDLC_TRIAGE_CLASSIFICATION_POLICY = Object.freeze([
  Object.freeze({
    kind: "sdlc_triage_classification_policy_entry",
    condition: "converged_without_requirement_pressure",
    frameworkLayer: "release",
    frameworkCondition: "gap_retired",
    processOutcome: "gap_retired",
    domainMeaning: "gap is closed at current authority basis"
  }),
  Object.freeze({
    kind: "sdlc_triage_classification_policy_entry",
    condition: "requirement_pressure_present",
    frameworkLayer: "requirements",
    frameworkCondition: "unmet_requirement",
    processOutcome: "route_selected",
    domainMeaning:
      "unresolved requirement pressure must re-enter before implementation closure"
  }),
  Object.freeze({
    kind: "sdlc_triage_classification_policy_entry",
    condition: "open_or_partial_gap",
    frameworkLayer: "code",
    frameworkCondition: "open_gap",
    processOutcome: "route_selected",
    domainMeaning: "current ABG edge remains open and needs a declared start target"
  }),
  Object.freeze({
    kind: "sdlc_triage_classification_policy_entry",
    condition: "fallback",
    frameworkLayer: "runtime",
    frameworkCondition: "unclassified_gap",
    processOutcome: "unclassified_gap",
    domainMeaning: "no totalized domain route matched the observation"
  })
] as const satisfies readonly SdlcTriageClassificationPolicyEntry[]);

export const SDLC_TRIAGE_ROUTE_POLICY = Object.freeze([
  Object.freeze({
    kind: "sdlc_triage_route_policy_entry",
    routePolicy: "gap_retired",
    reEntryLayer: "none",
    routeKind: "gap_retired",
    targetStrategy: "none"
  }),
  Object.freeze({
    kind: "sdlc_triage_route_policy_entry",
    routePolicy: "requirements_pressure",
    reEntryLayer: "requirements",
    routeKind: "fixed_vector_repair",
    targetStrategy: "derive_requirement_surface"
  }),
  Object.freeze({
    kind: "sdlc_triage_route_policy_entry",
    routePolicy: "default_repair",
    reEntryLayer: "classification_layer_or_code",
    routeKind: "fixed_vector_repair",
    targetStrategy: "current_edge"
  })
] as const satisfies readonly SdlcTriageRoutePolicyEntry[]);
