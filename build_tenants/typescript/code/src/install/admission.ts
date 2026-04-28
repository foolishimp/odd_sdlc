// Implements: REQ-F-ODDSDLC-040

import { resolve } from "node:path";
import type { OddSdlcTypescriptInstallRequest } from "./carriers.js";

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function plainRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isPlainRecord(value)) {
    throw new TypeError(`${label}: expected object`);
  }
  return value;
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${key}: expected non-empty string`);
  }
  return value.trim();
}

export function admitOddSdlcTypescriptInstallRequest(
  input: unknown
): OddSdlcTypescriptInstallRequest {
  const record = plainRecord(input, "odd_sdlc install request");
  return Object.freeze({
    kind: "odd_sdlc_typescript_install_request",
    targetRoot: resolve(requiredString(record, "targetRoot")),
    packageSourceRoot: resolve(requiredString(record, "packageSourceRoot")),
    abgPackageSourceRoot: resolve(requiredString(record, "abgPackageSourceRoot")),
    installedPackageName: requiredString(record, "installedPackageName")
  });
}
