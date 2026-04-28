// Implements: REQ-F-ODDSDLC-016
// Implements: REQ-F-ODDSDLC-022
// Implements: REQ-F-ODDSDLC-032

import { parseNonEmptyString } from "../shared/validation.js";
import {
  FG_INGRESS_PROJECT,
  type IngressSourceSet,
  type IngressSourceStructureGrade,
  type ProjectIngressContract
} from "../graph/library.js";
import {
  type SdlcBootstrapLineageRecord,
  type SdlcImportedRequirementAuthority,
  type SdlcProjectConstraints,
  type SdlcSourceInput,
  type SdlcWorkspaceIngressReport
} from "./carriers.js";
import { uniqueSorted } from "./source_input.js";

function normalizeRequirementId(requirementId: string): string {
  const parts = requirementId.toUpperCase().split("-");
  const head = parts[0] === "RF" ? "REQ" : parts[0];
  const tail = parts.slice(1).map((part) =>
    /^\d+$/.test(part) && part.length < 3 ? part.padStart(3, "0") : part
  );
  return [head, ...tail].join("-");
}

function importedRequirementAuthorities(
  sourceInputs: readonly SdlcSourceInput[]
): readonly SdlcImportedRequirementAuthority[] {
  const authorities: SdlcImportedRequirementAuthority[] = [];
  for (const sourceInput of sourceInputs) {
    if (sourceInput.detectedRole !== "requirement_surface") {
      continue;
    }
    for (const marker of sourceInput.authorityMarkers) {
      if (marker.startsWith("REQ-") || marker.startsWith("RF-")) {
        authorities.push(
          Object.freeze({
            kind: "sdlc_imported_requirement_authority",
            requirementId: normalizeRequirementId(marker),
            sourceUri: sourceInput.uri,
            sourceDigest: sourceInput.digest
          })
        );
      }
    }
  }
  return Object.freeze(authorities);
}

function lineageFor(input: {
  readonly projectConstraints: SdlcProjectConstraints;
  readonly sourceInputs: readonly SdlcSourceInput[];
  readonly authorities: readonly SdlcImportedRequirementAuthority[];
}): readonly SdlcBootstrapLineageRecord[] {
  const projectSources = input.sourceInputs
    .filter((sourceInput) =>
      sourceInput.detectedRole === "intent_surface" ||
      sourceInput.detectedRole === "project_constraints" ||
      sourceInput.detectedRole === "project_readme"
    )
    .map((sourceInput) => sourceInput.uri);
  const records: SdlcBootstrapLineageRecord[] = [
    Object.freeze({
      kind: "sdlc_bootstrap_lineage_record",
      elementId: `project:${input.projectConstraints.projectSlug}`,
      elementKind: "project",
      sourceInputUris: uniqueSorted(projectSources)
    })
  ];
  for (const authority of input.authorities) {
    records.push(
      Object.freeze({
        kind: "sdlc_bootstrap_lineage_record",
        elementId: `requirement:${authority.requirementId}`,
        elementKind: "requirement_seed",
        sourceInputUris: Object.freeze([authority.sourceUri])
      })
    );
  }
  return Object.freeze(records);
}

function structureGrade(
  sourceInputs: readonly SdlcSourceInput[]
): IngressSourceStructureGrade {
  const roles = new Set(sourceInputs.map((sourceInput) => sourceInput.detectedRole));
  if (roles.size === 1 && roles.has("unstructured")) {
    return "unstructured";
  }
  if (
    roles.has("project_constraints") &&
    (roles.has("intent_surface") || roles.has("requirement_surface"))
  ) {
    return "structured";
  }
  return "loosely_structured";
}

function deriveIngressSourceSet(input: {
  readonly workspaceRootUri: string;
  readonly sourceInputs: readonly SdlcSourceInput[];
}): IngressSourceSet {
  return Object.freeze({
    kind: "ingress_source_set",
    workspaceRootUri: input.workspaceRootUri,
    structureGrade: structureGrade(input.sourceInputs),
    sources: Object.freeze(
      input.sourceInputs.map((sourceInput) =>
        Object.freeze({
          kind: "ingress_source_ledger_entry",
          sourceRef: sourceInput.uri,
          relativePath: sourceInput.relativePath,
          digestRef: sourceInput.digest,
          detectedRole: sourceInput.detectedRole,
          authorityMarkers: sourceInput.authorityMarkers
        })
      )
    )
  });
}

function deriveProjectIngressContract(
  projectConstraints: SdlcProjectConstraints
): ProjectIngressContract {
  return Object.freeze({
    kind: "project_ingress_contract",
    graphFunctionName: FG_INGRESS_PROJECT,
    projectTypeRef: "type://odd_sdlc/project",
    topologyPolicyRef: "policy://odd_sdlc/spec_method_project_topology",
    ambiguityPolicyRef: `policy://odd_sdlc/ambiguity/${projectConstraints.ambiguityRiskAppetite}`,
    importedAuthorityPolicyRef: "policy://odd_sdlc/imported_authority/lineage_required",
    selectedOutputRoot: projectConstraints.selectedOutputRoot,
    activeTenant: projectConstraints.activeTenant
  });
}

function ambiguityRegister(
  sourceInputs: readonly SdlcSourceInput[]
): readonly string[] {
  return uniqueSorted(
    sourceInputs.flatMap((sourceInput) =>
      sourceInput.ambiguity.reasons.map(
        (reason) => `${sourceInput.uri}:${reason}`
      )
    )
  );
}

function bootstrapGapSet(input: {
  readonly ambiguityRegister: readonly string[];
  readonly authorities: readonly SdlcImportedRequirementAuthority[];
}): readonly string[] {
  const gaps: string[] = [];
  if (input.ambiguityRegister.length > 0) {
    gaps.push("bootstrap_ambiguity_present");
  }
  if (input.authorities.length === 0) {
    gaps.push("no_imported_requirement_authority");
  }
  return uniqueSorted(gaps);
}

export function deriveSdlcWorkspaceIngressReport(input: {
  readonly workspaceRootUri: string;
  readonly projectConstraints: SdlcProjectConstraints;
  readonly sourceInputs: readonly SdlcSourceInput[];
}): SdlcWorkspaceIngressReport {
  const workspaceRootUri = parseNonEmptyString(
    input.workspaceRootUri,
    "SdlcWorkspaceIngressReport.workspaceRootUri"
  );
  const authorities = importedRequirementAuthorities(input.sourceInputs);
  const ingressSourceSet = deriveIngressSourceSet({
    workspaceRootUri,
    sourceInputs: input.sourceInputs
  });
  const ambiguity = ambiguityRegister(input.sourceInputs);
  return Object.freeze({
    kind: "sdlc_workspace_ingress_report",
    governingGraphFunction: FG_INGRESS_PROJECT,
    workspaceRootUri,
    projectConstraints: input.projectConstraints,
    ingressSourceSet,
    projectIngressContract: deriveProjectIngressContract(input.projectConstraints),
    sourceInputs: Object.freeze([...input.sourceInputs]),
    importedRequirementAuthorities: authorities,
    lineage: lineageFor({
      projectConstraints: input.projectConstraints,
      sourceInputs: input.sourceInputs,
      authorities
    }),
    ambiguityRegister: ambiguity,
    bootstrapGapSet: bootstrapGapSet({
      ambiguityRegister: ambiguity,
      authorities
    })
  });
}
