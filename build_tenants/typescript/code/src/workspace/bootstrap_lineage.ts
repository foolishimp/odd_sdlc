// Implements: REQ-F-ODDSDLC-016
// Implements: REQ-F-ODDSDLC-022
// Implements: REQ-F-ODDSDLC-032

import { parseNonEmptyString } from "../shared/validation.js";
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
  return Object.freeze({
    kind: "sdlc_workspace_ingress_report",
    workspaceRootUri,
    projectConstraints: input.projectConstraints,
    sourceInputs: Object.freeze([...input.sourceInputs]),
    importedRequirementAuthorities: authorities,
    lineage: lineageFor({
      projectConstraints: input.projectConstraints,
      sourceInputs: input.sourceInputs,
      authorities
    })
  });
}
