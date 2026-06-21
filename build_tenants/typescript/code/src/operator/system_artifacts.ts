// Implements: T-183

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import {
  type SdlcOperatorRunArtifactRow,
  operatorRunArtifactRowForRelativePath,
  requireOperatorRunArtifactRowForArtifactRef
} from "../contracts/operator_run_artifact_catalog.js";

interface SdlcArchiveWritePlan {
  readonly kind: "sdlc_archive_write_plan";
  readonly archiveRoot: string;
  readonly relativePath: string;
  readonly content: string;
  readonly artifactRef: string | null;
  readonly sourceOwner: string | null;
  readonly authoritative: boolean;
}

export function stableSdlcSystemArtifactJson(payload: unknown): string {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function constructSdlcArchiveWritePlan(input: {
  readonly archiveRoot: string;
  readonly relativePath: string;
  readonly content: string;
}): SdlcArchiveWritePlan {
  return Object.freeze({
    kind: "sdlc_archive_write_plan" as const,
    archiveRoot: input.archiveRoot,
    relativePath: input.relativePath,
    content: input.content,
    artifactRef: null,
    sourceOwner: null,
    authoritative: false
  });
}

function constructSdlcOperatorRunArtifactArchiveWritePlan(input: {
  readonly archiveRoot: string;
  readonly artifactRef: string;
  readonly content: string;
  readonly artifactRow?: SdlcOperatorRunArtifactRow | undefined;
}): SdlcArchiveWritePlan {
  const artifact =
    input.artifactRow ?? requireOperatorRunArtifactRowForArtifactRef(input.artifactRef);
  if (artifact.artifactRef !== input.artifactRef) {
    throw new TypeError(
      `${input.artifactRef}: archive write artifact row ref mismatch: ${artifact.artifactRef}`
    );
  }
  return Object.freeze({
    kind: "sdlc_archive_write_plan" as const,
    archiveRoot: input.archiveRoot,
    relativePath: artifact.relativePath,
    content: input.content,
    artifactRef: artifact.artifactRef,
    sourceOwner: artifact.sourceOwner,
    authoritative: artifact.admissionRef !== null
  });
}

function executeSdlcArchiveWritePlan(plan: SdlcArchiveWritePlan): string {
  const targetPath = join(plan.archiveRoot, plan.relativePath);
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, plan.content, "utf8");
  return targetPath;
}

function relativePathWithinRoot(input: {
  readonly root: string;
  readonly absolutePath: string;
}): string | null {
  const root = resolve(input.root);
  const absolutePath = resolve(input.absolutePath);
  const relativePath = relative(root, absolutePath).split("\\").join("/");
  if (
    relativePath.length === 0 ||
    relativePath.startsWith("../") ||
    relativePath === ".."
  ) {
    return null;
  }
  return relativePath;
}

function normalizedSystemArtifactTarget(input: {
  readonly archiveRoot: string;
  readonly absolutePath: string;
}): {
  readonly root: string;
  readonly relativePath: string;
} {
  const archiveRoot = resolve(input.archiveRoot);
  const archiveRelativePath = relativePathWithinRoot({
    root: archiveRoot,
    absolutePath: input.absolutePath
  });
  if (archiveRelativePath !== null) {
    return Object.freeze({
      root: archiveRoot,
      relativePath: archiveRelativePath
    });
  }
  const runtimeRoot = resolve(archiveRoot, "../..");
  const runtimeRelativePath = relativePathWithinRoot({
    root: runtimeRoot,
    absolutePath: input.absolutePath
  });
  if (runtimeRelativePath === null) {
    throw new TypeError(
      `${input.absolutePath}: system artifact path is outside archive root ${input.archiveRoot}`
    );
  }
  return Object.freeze({
    root: runtimeRoot,
    relativePath: runtimeRelativePath
  });
}

function isUncatalogedSystemArtifactPath(relativePath: string): boolean {
  return (
    relativePath.startsWith("installed_operator_execution/") ||
    relativePath.startsWith("transform-assets/")
  );
}

function assertCatalogedAuthorityPayload(input: {
  readonly relativePath: string;
  readonly payload: unknown;
}): void {
  if (
    !isUncatalogedSystemArtifactPath(input.relativePath) &&
    typeof input.payload === "object" &&
    input.payload !== null &&
    !Array.isArray(input.payload) &&
    "kind" in input.payload &&
    typeof input.payload.kind === "string" &&
    (input.payload.kind.startsWith("sdlc_") ||
      input.payload.kind.startsWith("odd_sdlc.") ||
      input.payload.kind.startsWith("fp_"))
  ) {
    throw new TypeError(
      `${input.relativePath}: authoritative operator archive payload has no catalog row`
    );
  }
}

export function writeSdlcSystemArtifact(input: {
  readonly archiveRoot: string;
  readonly relativePath?: string | undefined;
  readonly absolutePath?: string | undefined;
  readonly artifactRef?: string | undefined;
  readonly payload: unknown;
}): string {
  const content =
    typeof input.payload === "string"
      ? input.payload
      : stableSdlcSystemArtifactJson(input.payload);
  const target =
    input.relativePath !== undefined
      ? Object.freeze({
          root: input.archiveRoot,
          relativePath: input.relativePath
        })
      : input.absolutePath === undefined
        ? null
        : normalizedSystemArtifactTarget({
            archiveRoot: input.archiveRoot,
            absolutePath: input.absolutePath
          });
  const relativePath = target?.relativePath;
  const artifact =
    input.artifactRef !== undefined
      ? requireOperatorRunArtifactRowForArtifactRef(input.artifactRef)
      : relativePath === undefined
        ? null
        : operatorRunArtifactRowForRelativePath(relativePath);
  if (artifact !== null) {
    if (
      artifact.carrierKind !== null &&
      typeof input.payload === "object" &&
      input.payload !== null &&
      !Array.isArray(input.payload) &&
      "kind" in input.payload &&
      input.payload.kind !== artifact.carrierKind
    ) {
      throw new TypeError(
        `${artifact.artifactRef}: payload kind ${String(input.payload.kind)} does not match catalog carrier kind ${artifact.carrierKind}`
      );
    }
    return executeSdlcArchiveWritePlan(
      constructSdlcOperatorRunArtifactArchiveWritePlan({
        archiveRoot: input.archiveRoot,
        artifactRef: artifact.artifactRef,
        artifactRow: artifact,
        content
      })
    );
  }
  if (target === null || relativePath === undefined) {
    throw new TypeError(
      "system artifact write requires artifactRef, relativePath, or absolutePath"
    );
  }
  assertCatalogedAuthorityPayload({
    relativePath,
    payload: input.payload
  });
  return executeSdlcArchiveWritePlan(
    constructSdlcArchiveWritePlan({
      archiveRoot: target.root,
      relativePath,
      content
    })
  );
}
