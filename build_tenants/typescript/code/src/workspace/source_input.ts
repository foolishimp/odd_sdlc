// Implements: REQ-F-ODDSDLC-007
// Implements: REQ-F-ODDSDLC-012
// Implements: REQ-F-ODDSDLC-022

import {
  parseClosedRecord,
  parseEnumValue,
  parseKind,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import {
  SDLC_AMBIGUITY_KIND_VALUES,
  SDLC_SOURCE_INPUT_ROLE_VALUES,
  type SdlcIngressAmbiguity,
  type SdlcSourceInput,
  type SdlcSourceInputRole,
  type SdlcSourceInputSnapshot
} from "./carriers.js";

export function fnv1aDigest(content: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function detectRole(relativePath: string): SdlcSourceInputRole {
  if (relativePath === "specification/INTENT.md") {
    return "intent_surface";
  }
  if (
    relativePath === "specification/REQUIREMENTS.md" ||
    relativePath === "specification/mapper_requirements.md" ||
    relativePath.startsWith("specification/requirements/")
  ) {
    return "requirement_surface";
  }
  if (relativePath.endsWith("project_constraints.yml")) {
    return "project_constraints";
  }
  if (relativePath === "README.md") {
    return "project_readme";
  }
  if (relativePath.startsWith("specification/appendices/")) {
    return "appendix_surface";
  }
  return "unstructured";
}

function detectAuthorityMarkers(content: string): readonly string[] {
  const markerExpression = /\b(?:INT-\d{3}|RF-[A-Z0-9]+(?:-[A-Z0-9]+)*|REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*)\b/g;
  const projectExpression = /^\*\*Project\*\*:\s*(.+?)\s*$/gm;
  const markers = [...content.matchAll(markerExpression)].map((match) => match[0]);
  const projectMarkers = [...content.matchAll(projectExpression)].map(
    (match) => `Project:${match[1] ?? ""}`
  );
  return uniqueSorted([...markers, ...projectMarkers]);
}

function ambiguityFor(input: {
  readonly role: SdlcSourceInputRole;
  readonly authorityMarkers: readonly string[];
}): SdlcIngressAmbiguity {
  const reasons: string[] = [];
  if (input.authorityMarkers.length === 0) {
    reasons.push("no_authority_marker_detected");
  }
  if (input.role === "unstructured") {
    reasons.push("unstructured_role");
  }
  return Object.freeze({
    kind: reasons.length === 0 ? "none" : "ambiguous",
    reasons: Object.freeze(reasons)
  });
}

export function deriveSdlcSourceInput(
  snapshot: SdlcSourceInputSnapshot
): SdlcSourceInput {
  const role = detectRole(snapshot.relativePath);
  const authorityMarkers = detectAuthorityMarkers(snapshot.content);
  return Object.freeze({
    kind: "sdlc_source_input",
    uri: snapshot.uri,
    relativePath: snapshot.relativePath,
    digest: fnv1aDigest(snapshot.content),
    detectedRole: role,
    authorityMarkers,
    ambiguity: ambiguityFor({ role, authorityMarkers })
  });
}

export function admitSdlcSourceInput(
  input: unknown,
  label = "SdlcSourceInput"
): SdlcSourceInput {
  const record = parseClosedRecord(input, label, [
    "kind",
    "uri",
    "relativePath",
    "digest",
    "detectedRole",
    "authorityMarkers",
    "ambiguity"
  ]);
  const ambiguityRecord = parseClosedRecord(record["ambiguity"], `${label}.ambiguity`, [
    "kind",
    "reasons"
  ]);
  parseKind(record["kind"], "sdlc_source_input", `${label}.kind`);
  return Object.freeze({
    kind: "sdlc_source_input",
    uri: parseNonEmptyString(record["uri"], `${label}.uri`),
    relativePath: parseNonEmptyString(record["relativePath"], `${label}.relativePath`),
    digest: parseNonEmptyString(record["digest"], `${label}.digest`),
    detectedRole: parseEnumValue(
      record["detectedRole"],
      `${label}.detectedRole`,
      SDLC_SOURCE_INPUT_ROLE_VALUES
    ),
    authorityMarkers: parseStringList(
      record["authorityMarkers"],
      `${label}.authorityMarkers`
    ),
    ambiguity: Object.freeze({
      kind: parseEnumValue(
        ambiguityRecord["kind"],
        `${label}.ambiguity.kind`,
        SDLC_AMBIGUITY_KIND_VALUES
      ),
      reasons: parseStringList(
        ambiguityRecord["reasons"],
        `${label}.ambiguity.reasons`
      )
    })
  });
}
