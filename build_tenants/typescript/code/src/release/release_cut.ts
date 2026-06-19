// Implements: REQ-F-ODDSDLC-040

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import {
  packNodePackage,
  readNodePackageIdentity
} from "../package_binding/index.js";
import { isRecord as isPlainRecord } from "../admission/codecs.js";
import { assertCurrentSdlcGtlProgramConformance } from "../gtl_conformance/index.js";
import type {
  OddSdlcTypescriptReleaseCutManifest,
  OddSdlcTypescriptReleaseCutOutcome,
  OddSdlcTypescriptReleaseCutRequest
} from "./carriers.js";

function stableJson(payload: unknown): string {
  return `${JSON.stringify(payload, null, 2)}\n`;
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

async function writeTextFile(targetPath: string, content: string): Promise<void> {
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, content, "utf8");
}

function admitOddSdlcTypescriptReleaseCutRequest(
  input: unknown
): OddSdlcTypescriptReleaseCutRequest {
  const record = plainRecord(input, "odd_sdlc release-cut request");
  return Object.freeze({
    kind: "odd_sdlc_typescript_release_cut_request",
    packageSourceRoot: resolve(requiredString(record, "packageSourceRoot")),
    archiveRoot: resolve(requiredString(record, "archiveRoot"))
  });
}

function postmortemFor(manifest: OddSdlcTypescriptReleaseCutManifest): string {
  return [
    "# odd_sdlc TypeScript Release-Cut Evidence",
    "",
    `- package: ${manifest.packageName}@${manifest.packageVersion}`,
    `- artifact: ${manifest.tarballPath}`,
    `- public command bindings: ${manifest.publicCommandSurface.publishedCommandNames.length}`,
    `- retired command bindings: ${manifest.publicCommandSurface.retiredCommandNames.join(", ")}`,
    "",
    "This release-cut proof is package evidence only. It does not claim graph traversal, live F_P execution, or installed-workspace convergence by itself.",
    ""
  ].join("\n");
}

export async function deriveOddSdlcTypescriptReleaseCut(
  input: unknown
): Promise<OddSdlcTypescriptReleaseCutOutcome> {
  const request = admitOddSdlcTypescriptReleaseCutRequest(input);
  assertCurrentSdlcGtlProgramConformance({
    packageRoot: request.packageSourceRoot
  });
  const identity = await readNodePackageIdentity(request.packageSourceRoot);
  const publishedCommandNames = Object.freeze(Object.keys(identity.bin).sort());
  if (publishedCommandNames.length > 0) {
    throw new Error(
      `package must not publish public command bindings: ${publishedCommandNames.join(", ")}`
    );
  }
  const packedPackage = await packNodePackage({
    packageSourceRoot: request.packageSourceRoot,
    packDestinationRoot: join(request.archiveRoot, "package"),
    npmCacheRoot: join(request.archiveRoot, ".npm-cache")
  });
  const releaseManifestPath = join(request.archiveRoot, "release-cut-manifest.json");
  const postmortemPath = join(request.archiveRoot, "release-cut-postmortem.md");
  const manifest: OddSdlcTypescriptReleaseCutManifest = Object.freeze({
    kind: "odd_sdlc_typescript_release_cut_manifest",
    packageName: identity.packageName,
    packageVersion: identity.packageVersion,
    packageSourceRoot: request.packageSourceRoot,
    archiveRoot: request.archiveRoot,
    tarballPath: packedPackage.tarballPath,
    releaseManifestPath,
    publicCommandSurface: Object.freeze({
      publishedCommandNames,
      retiredCommandNames: Object.freeze(["odd-sdlc-ts"] as const)
    }),
    packageIdentity: identity
  });
  await writeTextFile(releaseManifestPath, stableJson(manifest));
  await writeTextFile(postmortemPath, postmortemFor(manifest));
  return Object.freeze({
    kind: "odd_sdlc_typescript_release_cut",
    request,
    packedPackage,
    manifest,
    releaseManifestPath,
    postmortemPath
  });
}
