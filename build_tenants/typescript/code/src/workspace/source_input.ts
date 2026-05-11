// Implements: REQ-F-ODDSDLC-007
// Implements: REQ-F-ODDSDLC-012
// Implements: REQ-F-ODDSDLC-022

import { createHash } from "node:crypto";
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

export function sha256Digest(content: string): string {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
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

function normalizeLocalRequirementId(rawId: string): string {
  const normalized = rawId.trim().toUpperCase();
  const requirementMatch = /^R-(\d+)$/u.exec(normalized);
  if (requirementMatch !== null && requirementMatch[1] !== undefined) {
    return `R-${requirementMatch[1].padStart(3, "0")}`;
  }
  return normalized;
}

function localRequirementSlug(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[`*_()[\]{}]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 72);
  return slug.length === 0 ? "requirement" : slug;
}

function localRequirementMarker(input: {
  readonly requirementId: string;
  readonly title: string;
}): string {
  return [
    "requirement-local://odd-sdlc",
    encodeURIComponent(normalizeLocalRequirementId(input.requirementId)),
    encodeURIComponent(localRequirementSlug(input.title))
  ].join("/");
}

function detectLocalRequirementMarkers(content: string): readonly string[] {
  const explicitRequirementHeading =
    /^\s{0,3}(?:#{1,6}\s+|[-*]\s+)?(R-\d{1,4})(?:\s*[:.-]\s*|\s+)([^\n]+?)\s*$/gimu;
  const canonicalRequirementMarker =
    /\b(?:RF-[A-Z0-9]+(?:-[A-Z0-9]+)*|REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*)\b/gu;
  const explicitMarkers = [...content.matchAll(explicitRequirementHeading)].map(
    (match) =>
      localRequirementMarker({
        requirementId: match[1] ?? "R-000",
        title: match[2] ?? "requirement"
      })
  );
  if (explicitMarkers.length > 0 || canonicalRequirementMarker.test(content)) {
    return uniqueSorted(explicitMarkers);
  }
  const numberedRequirementHeading =
    /^\s{0,3}#{1,6}\s+(\d{1,3})[.)]\s+([^\n]+?)\s*$/gmu;
  return uniqueSorted(
    [...content.matchAll(numberedRequirementHeading)].map((match) =>
      localRequirementMarker({
        requirementId: `R-${match[1] ?? "000"}`,
        title: match[2] ?? "requirement"
      })
    )
  );
}

function detectAuthorityMarkers(
  content: string,
  role: SdlcSourceInputRole
): readonly string[] {
  const markerExpression = /\b(?:INT-\d{3}|RF-[A-Z0-9]+(?:-[A-Z0-9]+)*|REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*)\b/g;
  const transformRefExpression =
    /\b(?:transform-obligation|requirement-transform|requirement-lineage):\/\/[^\s\])}>,]+/g;
  const projectExpression = /^\*\*Project\*\*:\s*(.+?)\s*$/gm;
  const markers = [...content.matchAll(markerExpression)].map((match) => match[0]);
  const transformRefs = [...content.matchAll(transformRefExpression)].map(
    (match) => match[0]
  );
  const projectMarkers = [...content.matchAll(projectExpression)].map(
    (match) => `Project:${match[1] ?? ""}`
  );
  const localRequirementMarkers =
    role === "requirement_surface" ? detectLocalRequirementMarkers(content) : [];
  return uniqueSorted([
    ...markers,
    ...localRequirementMarkers,
    ...transformRefs,
    ...projectMarkers
  ]);
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
  const authorityMarkers = detectAuthorityMarkers(snapshot.content, role);
  return Object.freeze({
    kind: "sdlc_source_input",
    uri: snapshot.uri,
    relativePath: snapshot.relativePath,
    digest: sha256Digest(snapshot.content),
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
