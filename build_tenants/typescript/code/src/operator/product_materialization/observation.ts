import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path, { isAbsolute, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  parseArray,
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString,
  parseStringList
} from "../../shared/validation.js";
import type {
  SdlcMaterializedProductFile,
  SdlcMaterializedProductFileRole,
  SdlcProductMaterializationContract,
  SdlcWorkerHandoffManifest,
  SdlcWorkerResultMaterializationDiagnostic
} from "../carriers.js";
import type {
  ProductMaterializationReplayManifestRead
} from "./replay.js";

const MATERIALIZED_PRODUCT_FILE_ROLES = Object.freeze([
  "source",
  "test",
  "build_config",
  "design",
  "documentation",
  "other"
] as const satisfies readonly SdlcMaterializedProductFileRole[]);

function relativePathLooksLikeTestMaterialization(relativePath: string): boolean {
  const normalized = relativePath.toLowerCase();
  return (
    normalized === "test" ||
    normalized === "tests" ||
    normalized.startsWith("test/") ||
    normalized.startsWith("tests/") ||
    normalized.startsWith("src/test/") ||
    normalized.includes("/test/") ||
    normalized.includes("/tests/") ||
    normalized.includes("/src/test/") ||
    normalized.endsWith("/test") ||
    normalized.endsWith("/tests")
  );
}

function relativePathLooksLikeSourceMaterialization(relativePath: string): boolean {
  const normalized = relativePath.toLowerCase();
  return (
    normalized === "src" ||
    normalized.startsWith("src/") ||
    normalized.endsWith("/src") ||
    normalized.includes("/src/")
  );
}

function inferredRequiredRoleForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly normalizedRelativePath: string;
  readonly deps: ProductMaterializationObservationDeps;
}): SdlcMaterializedProductFileRole | null {
  const requiredRoles = input.deps.effectiveProductMaterializationRequiredRoles(
    input.manifest
  );
  if (
    requiredRoles.includes("test") &&
    relativePathLooksLikeTestMaterialization(input.normalizedRelativePath)
  ) {
    return "test";
  }
  if (
    requiredRoles.includes("source") &&
    relativePathLooksLikeSourceMaterialization(input.normalizedRelativePath)
  ) {
    return "source";
  }
  return null;
}

export interface SdlcObservedProductFileSnapshot {
  readonly relativePath: string;
  readonly absolutePath: string;
  readonly digest: string;
  readonly byteCount: number;
}

export interface SdlcProductMaterializationSnapshot {
  readonly kind: "sdlc_product_materialization_snapshot";
  readonly tenantRoot: string;
  readonly files: readonly SdlcObservedProductFileSnapshot[];
}

export interface ProductMaterializationObservationDelta {
  readonly materializedFiles: readonly SdlcMaterializedProductFile[];
  readonly diagnostics: readonly SdlcWorkerResultMaterializationDiagnostic[];
}

type PriorAdmittedObservedMaterializedFileLookup =
  | {
      readonly kind: "file";
      readonly file: SdlcMaterializedProductFile;
    }
  | {
      readonly kind: "diagnostic";
      readonly diagnostics: readonly SdlcWorkerResultMaterializationDiagnostic[];
    }
  | {
      readonly kind: "none";
    };

interface TargetCarrierMaterializedFileAnnotation {
  readonly role: SdlcMaterializedProductFileRole;
  readonly relativePath: string;
  readonly requirementTraceObligationIds: readonly string[];
}

export interface ProductMaterializationObservationDeps {
  readonly targetIgnoresExecutionByproducts: (targetAssetType: string) => boolean;
  readonly targetAdmitsTestExecutionEvidence: (targetAssetType: string) => boolean;
  readonly isTenantLocalSdlcSurfaceRelativePath: (relativePath: string) => boolean;
  readonly declaredBuildConfigRoleForObservedFile: (input: {
    readonly manifest: SdlcWorkerHandoffManifest;
    readonly normalizedRelativePath: string;
  }) => SdlcMaterializedProductFileRole | null;
  readonly declaredProductAuthorityRoleForObservedFile: (input: {
    readonly manifest: SdlcWorkerHandoffManifest;
    readonly normalizedRelativePath: string;
  }) => SdlcMaterializedProductFileRole | null;
  readonly effectiveProductMaterializationRequiredRoles: (
    manifest: SdlcWorkerHandoffManifest
  ) => readonly SdlcMaterializedProductFileRole[];
  readonly tenantRelativeOutputArtifactPath: (
    manifest: SdlcWorkerHandoffManifest
  ) => string | null;
  readonly textIfFile: (filePath: string) => string | null;
  readonly uniqueSorted: (values: readonly string[]) => readonly string[];
  readonly productMaterializationReplayArchives: (
    manifest: SdlcWorkerHandoffManifest
  ) => readonly string[];
  readonly replayArchivePostflightStatus: (
    archiveRoot: string
  ) => "absent" | "blocked" | "invalid" | "passed";
  readonly priorHandoffManifestMatchesCurrent: (input: {
    readonly archiveRoot: string;
    readonly currentManifest: SdlcWorkerHandoffManifest;
  }) => boolean;
  readonly readProductMaterializationReplayManifest: (input: {
    readonly archiveRoot: string;
    readonly currentManifest: SdlcWorkerHandoffManifest;
  }) => ProductMaterializationReplayManifestRead;
  readonly admitReplayManifestMaterializedProductFile: (
    input: unknown,
    label: string
  ) => SdlcMaterializedProductFile;
  readonly replayMaterializedFile: (input: {
    readonly manifest: SdlcWorkerHandoffManifest;
    readonly file: SdlcMaterializedProductFile;
    readonly sourceManifestRef: string;
    readonly sourceHandoffManifestRef: string;
    readonly sourceAttemptRef: string;
  }) => SdlcMaterializedProductFile;
  readonly currentAttemptMaterializedFileFromReplayPath: (input: {
    readonly manifest: SdlcWorkerHandoffManifest;
    readonly observedFile: SdlcObservedProductFileSnapshot;
    readonly replayedFile: SdlcMaterializedProductFile;
    readonly sourceManifestRef: string;
  }) => SdlcMaterializedProductFile;
  readonly handoffManifestRefForArchiveRoot: (archiveRoot: string) => string;
  readonly attemptRefForArchiveRoot: (archiveRoot: string) => string;
}

function sha256Text(content: string): string {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
}

function walkFiles(root: string): readonly string[] {
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    return Object.freeze([]);
  }
  const files: string[] = [];
  const visit = (current: string): void => {
    for (const name of readdirSync(current)) {
      const absolutePath = join(current, name);
      const stat = statSync(absolutePath);
      if (stat.isDirectory()) {
        visit(absolutePath);
      } else if (stat.isFile()) {
        files.push(absolutePath);
      }
    }
  };
  visit(root);
  return Object.freeze(files.sort());
}

export function snapshotProductMaterializationRoot(
  contract: SdlcProductMaterializationContract
): SdlcProductMaterializationSnapshot {
  const tenantRoot = resolve(contract.tenantRoot);
  return Object.freeze({
    kind: "sdlc_product_materialization_snapshot" as const,
    tenantRoot,
    files: Object.freeze(
      walkFiles(tenantRoot).map((absolutePath) => {
        const content = readFileSync(absolutePath, "utf8");
        return Object.freeze({
          relativePath: relative(tenantRoot, absolutePath),
          absolutePath,
          digest: sha256Text(content),
          byteCount: Buffer.byteLength(content, "utf8")
        });
      })
    )
  });
}

function snapshotByRelativePath(
  snapshot: SdlcProductMaterializationSnapshot
): ReadonlyMap<string, SdlcObservedProductFileSnapshot> {
  return new Map(snapshot.files.map((file) => [file.relativePath, file]));
}

function normalizedRelativePath(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

function isExecutionByproductPath(relativePath: string): boolean {
  const normalized = normalizedRelativePath(relativePath).toLowerCase();
	return (
		normalized === ".ai-workspace/runtime" ||
		normalized.startsWith(".ai-workspace/runtime/") ||
		normalized.includes("/.ai-workspace/runtime/") ||
		normalized === "target" ||
		normalized.startsWith("target/") ||
		normalized.includes("/target/") ||
    normalized.includes("/project/target/") ||
    normalized === ".bsp" ||
    normalized.startsWith(".bsp/") ||
    normalized.includes("/.bsp/")
  );
}

function isExecutionGeneratedBuildPropertiesPath(relativePath: string): boolean {
  const normalized = normalizedRelativePath(relativePath).toLowerCase();
  return (
    normalized === "project/build.properties" ||
    normalized.endsWith("/project/build.properties")
  );
}

function materializedRoleForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
  readonly deps: ProductMaterializationObservationDeps;
}): SdlcMaterializedProductFileRole {
  const normalized = input.relativePath.split(path.sep).join("/");
  const declaredAuthorityRole = input.deps.declaredProductAuthorityRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalized
  });
  if (declaredAuthorityRole !== null) {
    return declaredAuthorityRole;
  }
  const declaredBuildConfigRole = input.deps.declaredBuildConfigRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalized
  });
  if (declaredBuildConfigRole !== null) {
    return declaredBuildConfigRole;
  }
  const inferredRequiredRole = inferredRequiredRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalized,
    deps: input.deps
  });
  if (inferredRequiredRole !== null) {
    return inferredRequiredRole;
  }
  if (normalized === input.deps.tenantRelativeOutputArtifactPath(input.manifest)) {
    return "design";
  }
  return "other";
}

function observedRoleHasNonemptyFile(input: {
  readonly file: SdlcObservedProductFileSnapshot;
  readonly deps: ProductMaterializationObservationDeps;
}): boolean {
  const content = input.deps.textIfFile(input.file.absolutePath);
  return content !== null && content.trim().length > 0;
}

function observedFileSatisfiesRequiredRole(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
  readonly deps: ProductMaterializationObservationDeps;
}): boolean {
  const normalized = input.file.relativePath.split(path.sep).join("/");
  const role = materializedRoleForObservedFile({
    manifest: input.manifest,
    relativePath: normalized,
    deps: input.deps
  });
  if (!input.deps.effectiveProductMaterializationRequiredRoles(input.manifest).includes(role)) {
    return false;
  }
  if (role === "source" || role === "test" || role === "design") {
    return observedRoleHasNonemptyFile({ file: input.file, deps: input.deps });
  }
  if (role === "build_config") {
    return input.deps.textIfFile(input.file.absolutePath) !== null;
  }
  return false;
}

function materializedFileFromObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
  readonly deps: ProductMaterializationObservationDeps;
}): SdlcMaterializedProductFile {
  return Object.freeze({
    kind: "sdlc_materialized_product_file" as const,
    role: materializedRoleForObservedFile({
      manifest: input.manifest,
      relativePath: input.file.relativePath,
      deps: input.deps
    }),
    relativePath: input.file.relativePath,
    absolutePath: input.file.absolutePath,
    digest: input.file.digest,
    byteCount: input.file.byteCount,
    materializationSource: "current_attempt" as const
  });
}

function objectRecord(input: unknown): Record<string, unknown> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  return Object.fromEntries(Object.entries(input));
}

function parseJsonCandidate(input: string): { readonly ok: boolean; readonly value: unknown } {
  try {
    const parsed: unknown = JSON.parse(input);
    return Object.freeze({ ok: true, value: parsed });
  } catch {
    return Object.freeze({ ok: false, value: null });
  }
}

function selectedTargetCarrierMatchesManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly record: Record<string, unknown>;
}): boolean {
  const projection = input.manifest.targetCarrierProjection;
  if (projection === null || projection === undefined) {
    return false;
  }
  return (
    input.record["kind"] === projection.outputCarrierKind &&
    input.record["targetAssetType"] === input.manifest.targetAssetType &&
    input.record["edgeRef"] === input.manifest.edgeName &&
    input.record["contractRef"] === projection.targetCarrierContractRef &&
    input.record["contractDigest"] === projection.targetCarrierContractDigest
  );
}

function parseTargetCarrierMaterializedFileAnnotation(
  input: unknown,
  label: string
): TargetCarrierMaterializedFileAnnotation {
  const record = parseClosedRecord(input, label, [
    "kind",
    "role",
    "relativePath",
    "requirementTraceObligationIds"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_materialized_product_file") {
    throw new TypeError(`${label}.kind: unexpected materialized file kind`);
  }
  const relativePath = normalizedRelativePath(
    parseNonEmptyString(record["relativePath"], `${label}.relativePath`)
  );
  if (isAbsolute(relativePath) || relativePath.startsWith("../")) {
    throw new TypeError(`${label}.relativePath: expected tenant-relative path`);
  }
  return Object.freeze({
    role: parseEnumValue(record["role"], `${label}.role`, MATERIALIZED_PRODUCT_FILE_ROLES),
    relativePath,
    requirementTraceObligationIds: parseStringList(
      record["requirementTraceObligationIds"],
      `${label}.requirementTraceObligationIds`
    )
  });
}

function targetCarrierMaterializedFileAnnotationsFromCandidate(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly candidate: unknown;
  readonly label: string;
}): readonly TargetCarrierMaterializedFileAnnotation[] {
  const record = objectRecord(input.candidate);
  if (
    record === null ||
    !selectedTargetCarrierMatchesManifest({
      manifest: input.manifest,
      record
    })
  ) {
    return Object.freeze([]);
  }
  const rawMaterializedFiles = record["materializedFiles"];
  if (rawMaterializedFiles === undefined) {
    return Object.freeze([]);
  }
  return parseArray(
    rawMaterializedFiles,
    `${input.label}.materializedFiles`,
    parseTargetCarrierMaterializedFileAnnotation
  );
}

function targetCarrierJsonCandidatesFromTransformArtifact(
  content: string
): readonly unknown[] {
  const candidates: unknown[] = [];
  const wholeJson = parseJsonCandidate(content);
  if (wholeJson.ok) {
    candidates.push(wholeJson.value);
  }
  const fencedBlockExpression =
    /^```([^\r\n`]*)\r?\n([\s\S]*?)^```[^\S\r\n]*$/gmu;
  for (const match of content.matchAll(fencedBlockExpression)) {
    const infoString = match[1]?.trim() ?? "";
    const infoParts = infoString.split(/\s+/u).filter((part) => part.length > 0);
    const language = infoParts[0] ?? "";
    const registerKind = infoParts[1] ?? "";
    if (
      infoString !== "" &&
      language !== "json" &&
      language !== "component_depth_register"
    ) {
      continue;
    }
    if (
      language === "json" &&
      registerKind !== "" &&
      registerKind !== "component_depth_register"
    ) {
      continue;
    }
    const block = match[2]?.trim() ?? "";
    const parsed = parseJsonCandidate(block);
    if (parsed.ok) {
      candidates.push(parsed.value);
    }
  }
  return Object.freeze(candidates);
}

function targetCarrierMaterializedFileAnnotations(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly deps: ProductMaterializationObservationDeps;
}): ReadonlyMap<string, TargetCarrierMaterializedFileAnnotation> {
  if (
    input.manifest.targetCarrierProjection === null ||
    input.manifest.targetCarrierProjection === undefined ||
    !existsSync(input.manifest.outputFile) ||
    !statSync(input.manifest.outputFile).isFile()
  ) {
    return new Map();
  }
  const content = readFileSync(input.manifest.outputFile, "utf8");
  const byRelativePath = new Map<string, TargetCarrierMaterializedFileAnnotation>();
  for (const [index, candidate] of targetCarrierJsonCandidatesFromTransformArtifact(
    content
  ).entries()) {
    let annotations: readonly TargetCarrierMaterializedFileAnnotation[];
    try {
      annotations = targetCarrierMaterializedFileAnnotationsFromCandidate({
        manifest: input.manifest,
        candidate,
        label: `transformArtifact.selectedTargetCarrier[${index}]`
      });
    } catch {
      continue;
    }
    for (const annotation of annotations) {
      const prior = byRelativePath.get(annotation.relativePath);
      byRelativePath.set(
        annotation.relativePath,
        prior === undefined
          ? annotation
          : Object.freeze({
              ...annotation,
              requirementTraceObligationIds: input.deps.uniqueSorted([
                ...prior.requirementTraceObligationIds,
                ...annotation.requirementTraceObligationIds
              ])
            })
      );
    }
  }
  return byRelativePath;
}

function materializedFileWithTargetCarrierAnnotation(input: {
  readonly file: SdlcMaterializedProductFile;
  readonly annotations: ReadonlyMap<string, TargetCarrierMaterializedFileAnnotation>;
  readonly deps: ProductMaterializationObservationDeps;
}): SdlcMaterializedProductFile {
  const annotation = input.annotations.get(normalizedRelativePath(input.file.relativePath));
  if (
    annotation === undefined ||
    annotation.role !== input.file.role ||
    annotation.requirementTraceObligationIds.length === 0
  ) {
    return input.file;
  }
  return Object.freeze({
    ...input.file,
    requirementTraceObligationIds: input.deps.uniqueSorted([
      ...(input.file.requirementTraceObligationIds ?? []),
      ...annotation.requirementTraceObligationIds
    ])
  });
}

function diagnosticFromReplayManifest(
  replayManifest: Extract<ProductMaterializationReplayManifestRead, { readonly kind: "diagnostic" }>
): SdlcWorkerResultMaterializationDiagnostic {
  return Object.freeze({
    kind: "sdlc_worker_result_materialization_diagnostic" as const,
    code: replayManifest.code,
    detail: replayManifest.detail,
    evidenceRefs: replayManifest.evidenceRefs
  });
}

function priorAdmittedMaterializedFileForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
  readonly deps: ProductMaterializationObservationDeps;
}): PriorAdmittedObservedMaterializedFileLookup {
  for (const archiveRoot of input.deps.productMaterializationReplayArchives(input.manifest)) {
    if (
      !input.deps.priorHandoffManifestMatchesCurrent({
        archiveRoot,
        currentManifest: input.manifest
      })
    ) {
      continue;
    }
    const replayManifest = input.deps.readProductMaterializationReplayManifest({
      archiveRoot,
      currentManifest: input.manifest
    });
    if (replayManifest.kind === "diagnostic") {
      return Object.freeze({
        kind: "diagnostic" as const,
        diagnostics: Object.freeze([diagnosticFromReplayManifest(replayManifest)])
      });
    }
    if (replayManifest.kind !== "manifest") {
      continue;
    }
    const matched = replayManifest.files.find(
      (candidate) =>
        candidate.relativePath === input.file.relativePath &&
        candidate.digest === input.file.digest
    );
    if (matched !== undefined) {
      return Object.freeze({
        kind: "file" as const,
        file: input.deps.replayMaterializedFile({
          manifest: input.manifest,
          file: matched,
          sourceManifestRef: pathToFileURL(replayManifest.manifestFile).href,
          sourceHandoffManifestRef: input.deps.handoffManifestRefForArchiveRoot(archiveRoot),
          sourceAttemptRef: input.deps.attemptRefForArchiveRoot(archiveRoot)
        })
      });
    }
  }
  return Object.freeze({ kind: "none" as const });
}

function priorAdmittedMaterializedFileForObservedPath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
  readonly deps: ProductMaterializationObservationDeps;
}): PriorAdmittedObservedMaterializedFileLookup {
  let latest:
    | {
        readonly archiveRoot: string;
        readonly manifestFile: string;
        readonly file: SdlcMaterializedProductFile;
      }
    | null = null;
  for (const archiveRoot of input.deps.productMaterializationReplayArchives(input.manifest)) {
    if (
      !input.deps.priorHandoffManifestMatchesCurrent({
        archiveRoot,
        currentManifest: input.manifest
      })
    ) {
      continue;
    }
    const replayManifest = input.deps.readProductMaterializationReplayManifest({
      archiveRoot,
      currentManifest: input.manifest
    });
    if (replayManifest.kind === "diagnostic") {
      return Object.freeze({
        kind: "diagnostic" as const,
        diagnostics: Object.freeze([diagnosticFromReplayManifest(replayManifest)])
      });
    }
    if (replayManifest.kind !== "manifest") {
      continue;
    }
    const matched = replayManifest.files.find(
      (candidate) => candidate.relativePath === input.file.relativePath
    );
    if (matched !== undefined) {
      latest = Object.freeze({
        archiveRoot,
        manifestFile: replayManifest.manifestFile,
        file: matched
      });
    }
  }
  if (latest === null) {
    return Object.freeze({ kind: "none" as const });
  }
  return Object.freeze({
    kind: "file" as const,
    file: input.deps.currentAttemptMaterializedFileFromReplayPath({
      manifest: input.manifest,
      observedFile: input.file,
      replayedFile: latest.file,
      sourceManifestRef: pathToFileURL(latest.manifestFile).href
    })
  });
}

function isOpenRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function parseOpenRecord(input: unknown, label: string): Record<string, unknown> {
  if (!isOpenRecord(input)) {
    throw new TypeError(`${label}: expected object`);
  }
  return input;
}

function priorAdmittedMaterializedFileForObservedProductLineage(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
  readonly deps: ProductMaterializationObservationDeps;
  readonly postflightStatus?: "blocked" | "passed";
}): PriorAdmittedObservedMaterializedFileLookup {
  const expectedPostflightStatus = input.postflightStatus ?? "passed";
  for (const archiveRoot of input.deps.productMaterializationReplayArchives(input.manifest)) {
    const replayStatus = input.deps.replayArchivePostflightStatus(archiveRoot);
    if (
      expectedPostflightStatus === "passed" &&
      replayStatus !== "passed" &&
      replayStatus !== "absent"
    ) {
      continue;
    }
    if (expectedPostflightStatus === "blocked" && replayStatus !== "blocked") {
      continue;
    }
    const manifestFile = join(archiveRoot, "product_materialization_manifest.json");
    if (!existsSync(manifestFile) || !statSync(manifestFile).isFile()) {
      continue;
    }
    try {
      const replayManifest = parseOpenRecord(
        JSON.parse(readFileSync(manifestFile, "utf8")),
        "productMaterializationLineage.manifest"
      );
      if (replayManifest["kind"] !== "sdlc_product_materialization_manifest") {
        continue;
      }
      const priorContract = parseOpenRecord(
        replayManifest["contract"],
        "productMaterializationLineage.contract"
      );
      if (
        resolve(
          parseNonEmptyString(
            priorContract["tenantRoot"],
            "productMaterializationLineage.contract.tenantRoot"
          )
        ) !== resolve(input.manifest.productMaterialization.tenantRoot) ||
        parseNonEmptyString(
          priorContract["activeTenant"],
          "productMaterializationLineage.contract.activeTenant"
        ) !== input.manifest.productMaterialization.activeTenant ||
        parseNonEmptyString(
          priorContract["selectedOutputRoot"],
          "productMaterializationLineage.contract.selectedOutputRoot"
        ) !== input.manifest.productMaterialization.selectedOutputRoot
      ) {
        continue;
      }
      const files = parseArray(
        replayManifest["files"],
        "productMaterializationLineage.manifest.files",
        input.deps.admitReplayManifestMaterializedProductFile
      );
      const matched = files.find(
        (candidate) =>
          candidate.relativePath === input.file.relativePath &&
          candidate.digest === input.file.digest
      );
      if (matched !== undefined) {
        return Object.freeze({
          kind: "file" as const,
          file: input.deps.replayMaterializedFile({
            manifest: input.manifest,
            file: matched,
            sourceManifestRef: pathToFileURL(manifestFile).href,
            sourceHandoffManifestRef: input.deps.handoffManifestRefForArchiveRoot(archiveRoot),
            sourceAttemptRef: input.deps.attemptRefForArchiveRoot(archiveRoot)
          })
        });
      }
    } catch {
      continue;
    }
  }
  return Object.freeze({ kind: "none" as const });
}

function addDiagnostics(
  diagnosticsByKey: Map<string, SdlcWorkerResultMaterializationDiagnostic>,
  diagnostics: readonly SdlcWorkerResultMaterializationDiagnostic[]
): void {
  for (const diagnostic of diagnostics) {
    diagnosticsByKey.set(
      `${diagnostic.code}\n${diagnostic.detail}\n${diagnostic.evidenceRefs.join("\n")}`,
      diagnostic
    );
  }
}

export function observeProductMaterializationDeltaWithDiagnostics(
  input: {
    readonly manifest: SdlcWorkerHandoffManifest;
    readonly before: SdlcProductMaterializationSnapshot;
  },
  deps: ProductMaterializationObservationDeps
): ProductMaterializationObservationDelta {
  const after = snapshotProductMaterializationRoot(
    input.manifest.productMaterialization
  );
  const beforeByPath = snapshotByRelativePath(input.before);
  const observedByPath = new Map<string, SdlcMaterializedProductFile>();
  const targetCarrierAnnotations = targetCarrierMaterializedFileAnnotations({
    manifest: input.manifest,
    deps
  });
  const diagnosticsByKey = new Map<
    string,
    SdlcWorkerResultMaterializationDiagnostic
  >();
  for (const file of after.files) {
    if (resolve(file.absolutePath) === resolve(input.manifest.outputFile)) {
      continue;
    }
    if (
      deps.targetIgnoresExecutionByproducts(input.manifest.targetAssetType) &&
      (isExecutionByproductPath(file.relativePath) ||
        (deps.targetAdmitsTestExecutionEvidence(input.manifest.targetAssetType) &&
          isExecutionGeneratedBuildPropertiesPath(file.relativePath)))
    ) {
      continue;
    }
    if (
      !input.manifest.productMaterialization.required &&
      deps.isTenantLocalSdlcSurfaceRelativePath(file.relativePath)
    ) {
      continue;
    }
    const changed = beforeByPath.get(file.relativePath)?.digest !== file.digest;
    const priorAdmitted =
      input.manifest.productMaterialization.required && !changed
        ? priorAdmittedMaterializedFileForObservedFile({
            manifest: input.manifest,
            file,
            deps
          })
        : !input.manifest.productMaterialization.required
          ? priorAdmittedMaterializedFileForObservedProductLineage({
              manifest: input.manifest,
              file,
              deps
            })
          : Object.freeze({ kind: "none" as const });
    if (priorAdmitted.kind === "file") {
      if (input.manifest.productMaterialization.required) {
        if (
          deps.effectiveProductMaterializationRequiredRoles(input.manifest).includes(
            priorAdmitted.file.role
          )
        ) {
          observedByPath.set(file.relativePath, priorAdmitted.file);
          continue;
        }
      } else {
        continue;
      }
    }
    if (priorAdmitted.kind === "diagnostic") {
      addDiagnostics(diagnosticsByKey, priorAdmitted.diagnostics);
      continue;
    }
    const priorRejected =
      !input.manifest.productMaterialization.required && !changed
        ? priorAdmittedMaterializedFileForObservedProductLineage({
            manifest: input.manifest,
            file,
            deps,
            postflightStatus: "blocked"
          })
        : Object.freeze({ kind: "none" as const });
    if (priorRejected.kind === "file") {
      observedByPath.set(file.relativePath, priorRejected.file);
      continue;
    }
    if (priorRejected.kind === "diagnostic") {
      addDiagnostics(diagnosticsByKey, priorRejected.diagnostics);
      continue;
    }
    const priorPathAdmitted =
      input.manifest.productMaterialization.required && !changed
        ? priorAdmittedMaterializedFileForObservedPath({
            manifest: input.manifest,
            file,
            deps
          })
        : Object.freeze({ kind: "none" as const });
    if (priorPathAdmitted.kind === "file") {
      if (
        deps.effectiveProductMaterializationRequiredRoles(input.manifest).includes(
          priorPathAdmitted.file.role
        )
      ) {
        observedByPath.set(file.relativePath, priorPathAdmitted.file);
        continue;
      }
    }
    if (priorPathAdmitted.kind === "diagnostic") {
      addDiagnostics(diagnosticsByKey, priorPathAdmitted.diagnostics);
      continue;
    }
    const satisfiesRequiredRole = observedFileSatisfiesRequiredRole({
      manifest: input.manifest,
      file,
      deps
    });
    if (!changed && !input.manifest.productMaterialization.required) {
      continue;
    }
    if (!changed && !satisfiesRequiredRole) {
      continue;
    }
    const materialized = materializedFileWithTargetCarrierAnnotation({
      file: materializedFileFromObservedFile({
        manifest: input.manifest,
        file,
        deps
      }),
      annotations: targetCarrierAnnotations,
      deps
    });
    if (
      changed ||
      deps.effectiveProductMaterializationRequiredRoles(input.manifest).includes(
        materialized.role
      )
    ) {
      observedByPath.set(file.relativePath, materialized);
    }
  }
  return Object.freeze({
    materializedFiles: Object.freeze(
      [...observedByPath.values()].sort((left, right) =>
        left.relativePath.localeCompare(right.relativePath)
      )
    ),
    diagnostics: Object.freeze([...diagnosticsByKey.values()])
  });
}

export function observeProductMaterializationDelta(
  input: {
    readonly manifest: SdlcWorkerHandoffManifest;
    readonly before: SdlcProductMaterializationSnapshot;
  },
  deps: ProductMaterializationObservationDeps
): readonly SdlcMaterializedProductFile[] {
  return observeProductMaterializationDeltaWithDiagnostics(input, deps)
    .materializedFiles;
}
