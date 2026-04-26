// Implements: REQ-F-ODDSDLC-022

import {
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString,
  parseString,
  parseStringList
} from "../shared/validation.js";
import type { SdlcProjectConstraints } from "./carriers.js";

export function admitSdlcProjectConstraints(
  input: unknown,
  label = "SdlcProjectConstraints"
): SdlcProjectConstraints {
  const record = parseClosedRecord(input, label, [
    "projectSlug",
    "activeTenant",
    "selectedOutputRoot",
    "ambiguityRiskAppetite",
    "capabilityContracts"
  ]);
  const activeTenant = parseNonEmptyString(record["activeTenant"], `${label}.activeTenant`);
  const selectedOutputRoot = parseNonEmptyString(
    record["selectedOutputRoot"],
    `${label}.selectedOutputRoot`
  );
  if (!selectedOutputRoot.startsWith("build_tenants/")) {
    throw new TypeError(`${label}.selectedOutputRoot: expected build_tenants/*`);
  }
  return Object.freeze({
    kind: "sdlc_project_constraints",
    projectSlug: parseNonEmptyString(record["projectSlug"], `${label}.projectSlug`),
    activeTenant,
    selectedOutputRoot,
    ambiguityRiskAppetite: parseEnumValue(
      record["ambiguityRiskAppetite"],
      `${label}.ambiguityRiskAppetite`,
      ["low", "medium", "high"]
    ),
    capabilityContracts: parseStringList(
      record["capabilityContracts"],
      `${label}.capabilityContracts`
    )
  });
}

export function parseProjectSlugFromConstraintText(content: string): string {
  const nameLine = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("name:"));
  if (nameLine === undefined) {
    return "imported_project";
  }
  const rawName = parseString(nameLine.slice("name:".length).trim(), "project.name");
  const name = (rawName.split("#")[0] ?? "")
    .replace(/["']/g, "")
    .trim();
  return name.length === 0 ? "imported_project" : name.replace(/[^a-zA-Z0-9_]+/g, "_");
}
