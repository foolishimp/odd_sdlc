// Implements: REQ-F-ODDSDLC-007
// Implements: REQ-F-ODDSDLC-012
// Implements: REQ-F-ODDSDLC-016
// Implements: REQ-F-ODDSDLC-022
// Implements: REQ-F-ODDSDLC-032

export const SDLC_SOURCE_INPUT_ROLE_VALUES = Object.freeze([
  "intent_surface",
  "requirement_surface",
  "project_constraints",
  "project_readme",
  "appendix_surface",
  "unstructured"
] as const);

export type SdlcSourceInputRole =
  (typeof SDLC_SOURCE_INPUT_ROLE_VALUES)[number];

export const SDLC_AMBIGUITY_KIND_VALUES = Object.freeze([
  "none",
  "ambiguous"
] as const);

export type SdlcAmbiguityKind =
  (typeof SDLC_AMBIGUITY_KIND_VALUES)[number];

export interface SdlcIngressAmbiguity {
  readonly kind: SdlcAmbiguityKind;
  readonly reasons: readonly string[];
}

export interface SdlcSourceInput {
  readonly kind: "sdlc_source_input";
  readonly uri: string;
  readonly relativePath: string;
  readonly digest: string;
  readonly detectedRole: SdlcSourceInputRole;
  readonly authorityMarkers: readonly string[];
  readonly ambiguity: SdlcIngressAmbiguity;
}

export interface SdlcProjectConstraints {
  readonly kind: "sdlc_project_constraints";
  readonly projectSlug: string;
  readonly activeTenant: string;
  readonly selectedOutputRoot: string;
  readonly ambiguityRiskAppetite: "low" | "medium" | "high";
  readonly capabilityContracts: readonly string[];
}

export interface SdlcImportedRequirementAuthority {
  readonly kind: "sdlc_imported_requirement_authority";
  readonly requirementId: string;
  readonly sourceUri: string;
  readonly sourceDigest: string;
}

export interface SdlcBootstrapLineageRecord {
  readonly kind: "sdlc_bootstrap_lineage_record";
  readonly elementId: string;
  readonly elementKind: "project" | "requirement_seed" | "authority_marker";
  readonly sourceInputUris: readonly string[];
}

export interface SdlcWorkspaceIngressReport {
  readonly kind: "sdlc_workspace_ingress_report";
  readonly workspaceRootUri: string;
  readonly projectConstraints: SdlcProjectConstraints;
  readonly sourceInputs: readonly SdlcSourceInput[];
  readonly importedRequirementAuthorities: readonly SdlcImportedRequirementAuthority[];
  readonly lineage: readonly SdlcBootstrapLineageRecord[];
}

export interface SdlcSourceInputSnapshot {
  readonly uri: string;
  readonly relativePath: string;
  readonly content: string;
}
