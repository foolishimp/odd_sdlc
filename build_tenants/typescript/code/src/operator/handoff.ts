// Implements: REQ-F-ODDSDLC-053
// Implements: REQ-F-ODDSDLC-054
// Implements: REQ-F-ODDSDLC-055
// Implements: REQ-F-ODDSDLC-058
// Implements: REQ-F-ODDSDLC-059
// Implements: REQ-F-ODDSDLC-060
// Implements: REQ-F-ODDSDLC-061

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import path, { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  admitSdlcConstructorResult,
  type SdlcConstructorResult,
  type SdlcHookContract,
  type SdlcWorkOperation
} from "../hooks/index.js";
import {
  parseClosedRecord,
  parseBoolean,
  parseEnumValue,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import {
  admitSdlcBlockingReason,
  canonicalSdlcPriorGapReasonCode,
  legacyBlockingReasonCode,
  makeSdlcBlockingReason,
  sdlcBlockingReasonFromLegacy,
  type SdlcBlockingReason
} from "../shared/blocking_reason.js";
import type { SdlcProjectConstraints } from "../workspace/index.js";
import {
  deriveSdlcConformProjectProfileFromWorkspace,
  type SdlcConformProjectProfile
} from "../workspace/index.js";
import type {
  SdlcMaterializedProductFile,
  SdlcMaterializedProductFileRole,
  SdlcPostflightResult,
  SdlcPostflightGapDossier,
  SdlcPostflightGapReason,
  SdlcPostflightGapReasonClass,
  SdlcProductMaterializationContract,
  SdlcAuthorityIndexCategory,
  SdlcAuthorityIndexEntry,
  SdlcTraversalIntentPackage,
  SdlcTraversalObligation,
  SdlcTraversalObligationPayload,
  SdlcTraversalObligationContext,
  SdlcRetrievalHint,
  SdlcWorkerHandoffManifest,
  SdlcWorkerExecutionEvidence,
  SdlcWorkerExecutionShardEvidence,
  SdlcWorkerObligationAssessment,
  SdlcWorkerRetryContext,
  SdlcWorkerResultReport
} from "./carriers.js";

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

const REPORT_FIELDS = Object.freeze([
  "kind",
  "graphFunctionName",
  "edgeName",
  "targetAssetType",
  "outputFile",
  "digest",
  "summary",
  "unresolvedReasons",
  "materializedFiles",
  "executionEvidence",
  "executionEvidenceErrors",
  "obligationAssessments"
] as const);

const MATERIALIZED_PRODUCT_FILE_ROLES = Object.freeze([
  "source",
  "test",
  "build_config",
  "documentation",
  "other"
] as const);

const POSTFLIGHT_GAP_REASON_CLASSES = Object.freeze([
  "contract_violation",
  "authority_to_code",
  "code_to_test",
  "missing_evidence",
  "worker_unresolved",
  "topology",
  "target_resolution",
  "worker_runtime",
  "runtime_policy",
  "install",
  "assurance",
  "unknown"
] as const satisfies readonly SdlcPostflightGapReasonClass[]);

const WORKER_OBLIGATION_FULFILLMENT_STATUSES = Object.freeze([
  "fulfilled",
  "partial",
  "blocked",
  "unassessed"
] as const);

const POSTFLIGHT_GAP_ACTIONS = Object.freeze([
  "retry_same_edge",
  "repair_worker_output",
  "triage_gap",
  "reprice_requirement_or_design"
] as const);

const REQUIREMENT_MARKER_EXPRESSION =
  /\b(?:RF-[A-Z0-9]+(?:-[A-Z0-9]+)*|REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*)\b/g;

const TRAVERSAL_AUTHORITY_PATHS = Object.freeze([
  "specification/INTENT.md",
  "specification/PRODUCT.md",
  "specification/GOALS.md",
  ".ai-workspace/context/project_bootstrap.md",
  ".ai-workspace/context/project_constraints.yml"
] as const);

const TRAVERSAL_RUNTIME_CONTEXT_PATHS = Object.freeze([
  ".ai-workspace/runtime/odd_sdlc-requirement-closure.json",
  ".ai-workspace/runtime/odd_sdlc-ambiguity-register.json",
  ".ai-workspace/runtime/odd_sdlc-analysis-manifest.json",
  ".ai-workspace/runtime/odd_sdlc-workspace-normalization.json"
] as const);

export function stableOperatorJson(payload: unknown): string {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

export function sha256Text(content: string): string {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
}

export function sha256File(filePath: string): string {
  return sha256Text(readFileSync(filePath, "utf8"));
}

export function operatorRunId(): string {
  return `${new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".", "")}_pid${process.pid}`;
}

function materializationRolesForTarget(
  targetAssetType: string
): readonly SdlcMaterializedProductFileRole[] {
  if (targetAssetType === "code_surface") {
    return Object.freeze(["source"]);
  }
  if (targetAssetType === "test_module_surface") {
    return Object.freeze(["test"]);
  }
  return Object.freeze([]);
}

function targetAdmitsTestExecutionEvidence(targetAssetType: string): boolean {
  return targetAssetType === "test_execution_result_surface";
}

function targetIgnoresExecutionByproducts(targetAssetType: string): boolean {
  return (
    targetAssetType === "test_module_surface" ||
    targetAdmitsTestExecutionEvidence(targetAssetType)
  );
}

function targetRequiresSourceAssetObligations(input: {
  readonly targetAssetType: string;
  readonly materializationRequired: boolean;
}): boolean {
  return (
    input.materializationRequired ||
    input.targetAssetType === "test_run_archive_surface"
  );
}

function productMaterializationContract(input: {
  readonly workspaceRoot: string;
  readonly archiveRoot: string;
  readonly targetAssetType: string;
  readonly conformedProject?: SdlcConformProjectProfile | undefined;
  readonly projectConstraints?: Pick<
    SdlcProjectConstraints,
    "activeTenant" | "selectedOutputRoot"
  > | undefined;
}): SdlcProductMaterializationContract {
  const activeTenant =
    input.conformedProject?.activeTenant ??
    input.projectConstraints?.activeTenant ??
    "typescript";
  const selectedOutputRoot =
    input.conformedProject?.selectedOutputRoot ??
    input.projectConstraints?.selectedOutputRoot ??
    `build_tenants/${activeTenant}`;
  const requiredRoles = materializationRolesForTarget(input.targetAssetType);
  const declaredModuleNames = Object.freeze([
    ...(input.conformedProject?.declaredModuleNames ?? [])
  ]);
  const buildExecutionContract =
    input.conformedProject?.buildExecutionContract ?? "undeclared";
  const testExecutionContract =
    input.conformedProject?.testExecutionContract ?? "undeclared";
  const tenantRoot = resolve(input.workspaceRoot, selectedOutputRoot);
  return Object.freeze({
    kind: "sdlc_product_materialization_contract",
    required: requiredRoles.length > 0,
    activeTenant,
    selectedOutputRoot,
    tenantRoot,
    relativePathBasis: "tenant_root",
    declaredModuleNames,
    buildExecutionContract,
    testExecutionContract,
    manifestFile: join(input.archiveRoot, "product_materialization_manifest.json"),
    requiredRoles,
    executionShards: executionShardsFor({
      targetAssetType: input.targetAssetType,
      tenantRoot,
      declaredModuleNames,
      testExecutionContract
    })
  });
}

const DEFAULT_EXECUTION_SHARD_TIMEOUT_MS = 1000 * 60 * 30;
const DEFAULT_EXECUTION_SHARD_INACTIVITY_TIMEOUT_MS = 1000 * 60 * 10;

function shardIdPart(input: string): string {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
  return normalized.length === 0 ? "unnamed" : normalized;
}

function sbtProjectSelector(input: string): string {
  return input.replace(/\\/gu, "\\\\").replace(/"/gu, '\\"');
}

function shellToken(input: string): string {
  if (/^[A-Za-z0-9._/@:-]+$/u.test(input)) {
    return input;
  }
  return `'${input.replace(/'/gu, "'\\''")}'`;
}

function executionShardCommand(input: {
  readonly moduleName: string;
  readonly testExecutionContract: string;
}): string {
  const contract = input.testExecutionContract.trim();
  const moduleName = input.moduleName.trim();
  if (
    moduleName.length === 0 ||
    moduleName === "full-suite" ||
    contract.length === 0 ||
    contract === "undeclared"
  ) {
    return contract;
  }
  if (/^sbt(?:\s|$)/u.test(contract) && /\btest\b/u.test(contract)) {
    return `sbt "${sbtProjectSelector(moduleName)}/test"`;
  }
  if (/^npm(?:\s|$)/u.test(contract) && /\btest\b/u.test(contract)) {
    return `npm test --workspace ${shellToken(moduleName)}`;
  }
  if (/^pnpm(?:\s|$)/u.test(contract) && /\btest\b/u.test(contract)) {
    return `pnpm --filter ${shellToken(moduleName)} test`;
  }
  if (/^yarn(?:\s|$)/u.test(contract) && /\btest\b/u.test(contract)) {
    return `yarn workspace ${shellToken(moduleName)} test`;
  }
  if (/^mvn(?:\s|$)/u.test(contract) && /\btest\b/u.test(contract)) {
    return `mvn -pl ${shellToken(moduleName)} test`;
  }
  if (/^(?:\.\/)?gradlew?(?:\s|$)/u.test(contract) && /\btest\b/u.test(contract)) {
    return `${contract.split(/\s+/u)[0]} :${moduleName.replace(/\//gu, ":")}:test`;
  }
  return contract;
}

function executionShardsFor(input: {
  readonly targetAssetType: string;
  readonly tenantRoot: string;
  readonly declaredModuleNames: readonly string[];
  readonly testExecutionContract: string;
}): SdlcProductMaterializationContract["executionShards"] {
  if (
    input.targetAssetType !== "test_schedule_surface" &&
    input.targetAssetType !== "test_execution_surface" &&
    input.targetAssetType !== "test_execution_result_surface" &&
    input.targetAssetType !== "test_run_archive_surface"
  ) {
    return Object.freeze([]);
  }
  const modules =
    input.declaredModuleNames.length > 0
      ? input.declaredModuleNames
      : Object.freeze(["full-suite"]);
  return Object.freeze(
    modules.map((moduleName, index) =>
      Object.freeze({
        kind: "sdlc_execution_shard" as const,
        shardId: `test-shard-${String(index + 1).padStart(2, "0")}-${shardIdPart(
          moduleName
        )}`,
        lane: "test" as const,
        moduleName,
        command: executionShardCommand({
          moduleName,
          testExecutionContract: input.testExecutionContract
        }),
        workingDirectory: input.tenantRoot,
        timeoutMs: DEFAULT_EXECUTION_SHARD_TIMEOUT_MS,
        inactivityTimeoutMs: DEFAULT_EXECUTION_SHARD_INACTIVITY_TIMEOUT_MS,
        expectedReportRefs: Object.freeze([
          `artifact://odd-sdlc/test-execution/${shardIdPart(moduleName)}`
        ]),
        allowedByproductGlobs: Object.freeze(["target/**", ".bsp/**"]),
        requiredEvidenceKind: "sdlc_worker_execution_evidence" as const,
        retryPolicy: "same_shard_then_triage" as const
      })
    )
  );
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function coverageRefAliases(ref: string): readonly string[] {
  const aliases = new Set<string>([ref]);
  try {
    const parsed = new URL(ref);
    if (parsed.protocol === "file:") {
      aliases.add(fileURLToPath(parsed));
    }
    parsed.hash = "";
    parsed.search = "";
    aliases.add(parsed.href);
    if (parsed.protocol === "file:") {
      aliases.add(fileURLToPath(parsed));
    }
    return Object.freeze([...aliases]);
  } catch {
    const bareRef = ref.replace(/[?#].*$/u, "");
    if (bareRef.length > 0 && bareRef !== ref) {
      aliases.add(bareRef);
    }
    if (isAbsolute(bareRef)) {
      aliases.add(pathToFileURL(bareRef).href);
    }
    return Object.freeze([...aliases]);
  }
}

function assetCoverageRef(input: {
  readonly workspaceRoot: string;
  readonly targetAssetType: string;
  readonly outputFile: string;
}): string | null {
  const relativePath = relative(input.workspaceRoot, input.outputFile);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    return null;
  }
  return `asset://${input.targetAssetType}@${relativePath
    .split(path.sep)
    .join("/")}`;
}

function normalizeRequirementId(requirementId: string): string {
  const parts = requirementId.toUpperCase().split("-");
  const head = parts[0] === "RF" ? "REQ" : parts[0];
  const tail = parts.slice(1).map((part) =>
    /^\d+$/.test(part) && part.length < 3 ? part.padStart(3, "0") : part
  );
  return [head, ...tail].join("-");
}

function fileRef(workspaceRoot: string, relativePath: string): string | null {
  const absolutePath = join(workspaceRoot, relativePath);
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    return null;
  }
  return pathToFileURL(absolutePath).href;
}

function structuralObligationPayload(input: {
  readonly status?: "structural" | "reference_only";
  readonly sourceRefs: readonly string[];
  readonly coverageExpectation: string;
}): SdlcTraversalObligationPayload {
  return Object.freeze({
    kind: "sdlc_traversal_obligation_payload" as const,
    status: input.status ?? "structural",
    sourceRefs: Object.freeze([...input.sourceRefs]),
    sourceDigests: Object.freeze([]),
    sourceSnippets: Object.freeze([]),
    coverageExpectation: input.coverageExpectation
  });
}

function markdownFilesIn(workspaceRoot: string, relativeDir: string): readonly string[] {
  const absoluteDir = join(workspaceRoot, relativeDir);
  if (!existsSync(absoluteDir) || !statSync(absoluteDir).isDirectory()) {
    return Object.freeze([]);
  }
  return Object.freeze(
    readdirSync(absoluteDir)
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => `${relativeDir}/${fileName}`)
      .sort()
  );
}

function readableFileRef(ref: string): { readonly ref: string; readonly filePath: string; readonly content: string } | null {
  if (!ref.startsWith("file://")) {
    return null;
  }
  const filePath = fileURLToPath(ref);
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return null;
  }
  return Object.freeze({
    ref,
    filePath,
    content: readFileSync(filePath, "utf8")
  });
}

function importedSourceRefsFromLedger(ref: string): readonly string[] {
  const source = readableFileRef(ref);
  if (source === null) {
    return Object.freeze([]);
  }
  const refs: string[] = [];
  for (const line of source.content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- file://")) {
      refs.push(trimmed.slice(2).trim());
    }
  }
  return uniqueSorted(refs);
}

function expandedRequirementAuthorityRefs(
  authorityRefs: readonly string[]
): readonly string[] {
  const expanded: string[] = [];
  for (const ref of authorityRefs) {
    if (!ref.startsWith("file://")) {
      continue;
    }
    const filePath = fileURLToPath(ref);
    if (!filePath.includes("/specification/requirements/")) {
      continue;
    }
    expanded.push(ref);
    if (filePath.endsWith("/specification/requirements/00-imported-sources.md")) {
      expanded.push(...importedSourceRefsFromLedger(ref));
    }
  }
  return uniqueSorted(expanded);
}

function lineSnippetForOffset(content: string, offset: number): string {
  const lineStart = content.lastIndexOf("\n", offset) + 1;
  const nextNewline = content.indexOf("\n", offset);
  const lineEnd = nextNewline < 0 ? content.length : nextNewline;
  return content
    .slice(lineStart, lineEnd)
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, 320);
}

function markerOnlySnippet(snippet: string, marker: string): boolean {
  const normalized = snippet
    .replace(/^#+\s*/u, "")
    .replace(/^[-*]\s*/u, "")
    .replaceAll("`", "")
    .trim();
  return normalized === marker || normalized === normalizeRequirementId(marker);
}

function authorityRefsFor(input: {
  readonly workspaceRoot: string;
  readonly activeTenant: string;
}): readonly string[] {
  const candidatePaths = uniqueSorted([
    ...TRAVERSAL_AUTHORITY_PATHS,
    ...markdownFilesIn(input.workspaceRoot, "specification/requirements"),
    ...markdownFilesIn(input.workspaceRoot, "specification/design"),
    ...markdownFilesIn(input.workspaceRoot, "specification/modules"),
    ...markdownFilesIn(input.workspaceRoot, `build_tenants/${input.activeTenant}/design`),
    ...markdownFilesIn(input.workspaceRoot, `build_tenants/${input.activeTenant}/modules`)
  ]);
  return uniqueSorted(
    candidatePaths.flatMap((relativePath) => {
      const ref = fileRef(input.workspaceRoot, relativePath);
      return ref === null ? [] : [ref];
    })
  );
}

function authorityCategoryFor(filePath: string): SdlcAuthorityIndexCategory {
  if (filePath.endsWith("/specification/INTENT.md")) {
    return "intent";
  }
  if (filePath.endsWith("/specification/PRODUCT.md")) {
    return "product";
  }
  if (filePath.endsWith("/specification/GOALS.md")) {
    return "goals";
  }
  if (filePath.includes("/specification/requirements/")) {
    return "requirements";
  }
  if (
    filePath.includes("/specification/design/") ||
    filePath.includes("/build_tenants/") && filePath.includes("/design/")
  ) {
    return "design";
  }
  if (
    filePath.includes("/specification/modules/") ||
    filePath.includes("/build_tenants/") && filePath.includes("/modules/")
  ) {
    return "modules";
  }
  if (filePath.includes("/.ai-workspace/context/")) {
    return "context";
  }
  if (filePath.includes("/.ai-workspace/runtime/")) {
    return "runtime";
  }
  return "other";
}

function titleForAuthorityFile(content: string, filePath: string): string {
  const heading = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("#"));
  if (heading !== undefined) {
    return heading.replace(/^#+\s*/u, "").trim().slice(0, 160);
  }
  return path.basename(filePath);
}

function authorityIndexFor(
  authorityRefs: readonly string[]
): readonly SdlcAuthorityIndexEntry[] {
  return Object.freeze(
    authorityRefs.flatMap((ref) => {
      const source = readableFileRef(ref);
      if (source === null) {
        return [];
      }
      const category = authorityCategoryFor(source.filePath);
      const digest = sha256Text(source.content);
      const key = `${category}:${path.basename(source.filePath)}`;
      return [
        Object.freeze({
          kind: "sdlc_authority_index_entry" as const,
          key,
          ref,
          category,
          title: titleForAuthorityFile(source.content, source.filePath),
          digest,
          tags: Object.freeze([category])
        })
      ];
    })
  );
}

function trancheKeysFor(input: {
  readonly contract: SdlcHookContract;
  readonly materialization: SdlcProductMaterializationContract;
}): readonly string[] {
  const keys: string[] = [];
  if (input.materialization.declaredModuleNames.length > 0) {
    keys.push(
      ...input.materialization.declaredModuleNames.map(
        (moduleName) => `module:${moduleName}`
      )
    );
  }
  keys.push(
    ...input.contract.sourceAssetTypes.map((assetType) => `source_asset:${assetType}`),
    `target_asset:${input.contract.targetAssetType}`
  );
  if (input.contract.targetAssetType.endsWith("_schedule_surface")) {
    keys.push("schedule:dependency_graph", "schedule:tranche_plan");
  }
  if (input.contract.targetAssetType === "code_surface") {
    keys.push("realization:tranche_execution");
  }
  if (
    input.contract.targetAssetType === "test_module_surface" ||
    targetAdmitsTestExecutionEvidence(input.contract.targetAssetType)
  ) {
    keys.push("qualification:tranche_execution");
  }
  if (input.materialization.executionShards.length > 0) {
    keys.push(
      ...input.materialization.executionShards.map(
        (shard) => `execution_shard:${shard.shardId}`
      )
    );
  }
  return uniqueSorted(keys);
}

function retrievalHintsFor(input: {
  readonly authorityIndex: readonly SdlcAuthorityIndexEntry[];
  readonly obligations: readonly SdlcTraversalObligation[];
  readonly trancheKeys: readonly string[];
}): readonly SdlcRetrievalHint[] {
  return Object.freeze(
    input.authorityIndex.map((entry) => {
      const obligationIds = input.obligations
        .filter((obligation) => obligation.evidenceRefs.includes(entry.ref))
        .map((obligation) => obligation.obligationId);
      const trancheMatch = input.trancheKeys.some((key) =>
        key.includes(entry.category)
      );
      return Object.freeze({
        kind: "sdlc_retrieval_hint" as const,
        key: entry.key,
        ref: entry.ref,
        reason:
          obligationIds.length > 0 || trancheMatch
            ? "targeted_authority_for_current_traversal"
            : "available_authority_by_reference",
        obligationIds: Object.freeze(uniqueSorted(obligationIds))
      });
    })
  );
}

function runtimeContextRefsFor(workspaceRoot: string): readonly string[] {
  return uniqueSorted(
    TRAVERSAL_RUNTIME_CONTEXT_PATHS.flatMap((relativePath) => {
      const ref = fileRef(workspaceRoot, relativePath);
      return ref === null ? [] : [ref];
    })
  );
}

function requirementObligations(input: {
  readonly workspaceRoot: string;
  readonly authorityRefs: readonly string[];
}): readonly SdlcTraversalObligation[] {
  const byId = new Map<
    string,
    {
      readonly refs: Set<string>;
      readonly digests: Set<string>;
      readonly snippets: Set<string>;
      readonly concreteSnippets: Set<string>;
    }
  >();
  for (const ref of expandedRequirementAuthorityRefs(input.authorityRefs)) {
    const source = readableFileRef(ref);
    if (source === null) {
      continue;
    }
    const digest = sha256Text(source.content);
    for (const match of source.content.matchAll(REQUIREMENT_MARKER_EXPRESSION)) {
      const marker = match[0] ?? "";
      const requirementId = normalizeRequirementId(marker);
      if (requirementId.length === 0) {
        continue;
      }
      const entry = byId.get(requirementId) ?? {
        refs: new Set<string>(),
        digests: new Set<string>(),
        snippets: new Set<string>(),
        concreteSnippets: new Set<string>()
      };
      const snippet = lineSnippetForOffset(source.content, match.index ?? 0);
      entry.refs.add(ref);
      entry.digests.add(digest);
      if (snippet.length > 0) {
        entry.snippets.add(snippet);
        if (!markerOnlySnippet(snippet, marker)) {
          entry.concreteSnippets.add(snippet);
        }
      }
      byId.set(requirementId, entry);
    }
  }
  return Object.freeze(
    [...byId.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([requirementId, entry]) => {
        const concreteSnippets = [...entry.concreteSnippets].sort();
        const snippets = concreteSnippets.length > 0
          ? concreteSnippets
          : [...entry.snippets].sort();
        const status = concreteSnippets.length > 0 ? "concrete" : "reference_only";
        const summary = concreteSnippets.length > 0
          ? `Fulfill ${requirementId}: ${concreteSnippets[0]}`
          : `Fulfill live requirement ${requirementId}.`;
        return Object.freeze({
          kind: "sdlc_traversal_obligation" as const,
          obligationId: `requirement:${requirementId}`,
          obligationKind: "requirement" as const,
          summary,
          evidenceRefs: Object.freeze([...entry.refs].sort()),
          payload: Object.freeze({
            kind: "sdlc_traversal_obligation_payload" as const,
            status,
            sourceRefs: Object.freeze([...entry.refs].sort()),
            sourceDigests: Object.freeze([...entry.digests].sort()),
            sourceSnippets: Object.freeze(snippets),
            coverageExpectation:
              status === "concrete"
                ? "Worker output must cover this requirement text and cite output evidence or carry a typed gap."
                : "Requirement marker must be expanded into concrete authority before this edge can close."
          })
        });
      })
  );
}

function evaluatorObligations(contract: SdlcHookContract): readonly SdlcTraversalObligation[] {
  const evaluatorRefs = uniqueSorted([
    ...contract.transformProfile.preflightFd,
    contract.transformProfile.constructiveFp,
    ...contract.transformProfile.capabilityFd,
    ...contract.transformProfile.postflightFd,
    ...(contract.transformProfile.fhGate === null
      ? []
      : [contract.transformProfile.fhGate])
  ]);
  return Object.freeze(
    evaluatorRefs.map((evaluatorRef) =>
      Object.freeze({
        kind: "sdlc_traversal_obligation" as const,
        obligationId: `evaluator:${evaluatorRef}`,
        obligationKind: "evaluator" as const,
        summary: `Satisfy evaluator contract ${evaluatorRef}.`,
        evidenceRefs: Object.freeze([evaluatorRef]),
        payload: structuralObligationPayload({
          sourceRefs: Object.freeze([evaluatorRef]),
          coverageExpectation:
            "Worker report and postflight evidence must satisfy this evaluator contract."
        })
      })
    )
  );
}

function priorGapReasonCodes(
  retryContext: SdlcWorkerRetryContext
): readonly string[] {
  return uniqueSorted(
    retryContext.priorGapDossiers.flatMap((dossier) =>
      dossier.reasons.map((reason) =>
        canonicalSdlcPriorGapReasonCode(reason.reason)
      )
    )
  );
}

function priorGapDossierRefs(
  retryContext: SdlcWorkerRetryContext
): readonly string[] {
  return uniqueSorted(
    retryContext.priorGapDossiers.flatMap((dossier) => [
      dossier.currentGapDossierRef,
      ...dossier.evidenceRefs.filter(
        (ref) => ref.endsWith("/gap_dossier.json") || ref.startsWith("proof://gap")
      )
    ])
  );
}

function priorWorkerResultReportRefsForSourceAsset(input: {
  readonly workspaceRoot: string;
  readonly assetType: string;
}): readonly string[] {
  const operatorRunsRoot = join(
    input.workspaceRoot,
    ".ai-workspace",
    "runtime",
    "odd_sdlc",
    "operator-runs"
  );
  if (!existsSync(operatorRunsRoot) || !statSync(operatorRunsRoot).isDirectory()) {
    return Object.freeze([]);
  }
  const refs: string[] = [];
  for (const runId of readdirSync(operatorRunsRoot)) {
    const reportPath = join(operatorRunsRoot, runId, "worker_result_report.json");
    if (!existsSync(reportPath) || !statSync(reportPath).isFile()) {
      continue;
    }
    try {
      const payload: unknown = JSON.parse(readFileSync(reportPath, "utf8"));
      const record = objectRecord(payload);
      if (
        record !== null &&
        record["kind"] === "odd_sdlc.worker_result_report" &&
        record["targetAssetType"] === input.assetType
      ) {
        refs.push(pathToFileURL(reportPath).href);
      }
    } catch {
      continue;
    }
  }
  return Object.freeze(uniqueSorted(refs));
}

function deriveTraversalObligationContext(input: {
  readonly workspaceRoot: string;
  readonly contract: SdlcHookContract;
  readonly materialization: SdlcProductMaterializationContract;
  readonly retryContext: SdlcWorkerRetryContext;
}): SdlcTraversalObligationContext {
  const authorityRefs = authorityRefsFor({
    workspaceRoot: input.workspaceRoot,
    activeTenant: input.materialization.activeTenant
  });
  const runtimeContextRefs = runtimeContextRefsFor(input.workspaceRoot);
  const priorEdgeRefs = uniqueSorted([
    ...input.retryContext.retryAttemptRefs.map((ref) => ref.manifestId),
    ...priorGapDossierRefs(input.retryContext)
  ]);
  const priorGapCount = priorGapReasonCodes(input.retryContext).length;
  const obligations: SdlcTraversalObligation[] = [];
  obligations.push(
    Object.freeze({
      kind: "sdlc_traversal_obligation" as const,
      obligationId: `target_asset:${input.contract.targetAssetType}`,
      obligationKind: "target_asset" as const,
      summary: `Produce target asset type ${input.contract.targetAssetType}.`,
      evidenceRefs: Object.freeze([`asset-type://${input.contract.targetAssetType}`]),
      payload: structuralObligationPayload({
        sourceRefs: Object.freeze([`asset-type://${input.contract.targetAssetType}`]),
        coverageExpectation:
          "Worker output identity must materialize or reference the declared target asset type."
      })
    }),
    ...evaluatorObligations(input.contract),
    ...requirementObligations({
      workspaceRoot: input.workspaceRoot,
      authorityRefs
    })
  );
  if (
    targetRequiresSourceAssetObligations({
      targetAssetType: input.contract.targetAssetType,
      materializationRequired: input.materialization.required
    })
  ) {
    obligations.push(
      ...input.contract.sourceAssetTypes.map((assetType) => {
        const sourceRefs = uniqueSorted([
          `asset-type://${assetType}`,
          ...priorWorkerResultReportRefsForSourceAsset({
            workspaceRoot: input.workspaceRoot,
            assetType
          })
        ]);
        return Object.freeze({
          kind: "sdlc_traversal_obligation" as const,
          obligationId: `source_asset:${assetType}`,
          obligationKind: "source_asset" as const,
          summary: `Use admitted source asset type ${assetType}.`,
          evidenceRefs: Object.freeze(sourceRefs),
          payload: structuralObligationPayload({
            sourceRefs: Object.freeze(sourceRefs),
            coverageExpectation:
              "Worker output must preserve the declared source asset contribution."
          })
        });
      })
    );
  }
  if (input.materialization.required) {
    obligations.push(
      ...input.materialization.declaredModuleNames.map((moduleName) =>
        Object.freeze({
          kind: "sdlc_traversal_obligation" as const,
          obligationId: `module:${moduleName}`,
          obligationKind: "design_or_module" as const,
          summary: `Preserve and realize declared module ${moduleName}.`,
          evidenceRefs: Object.freeze([`module://${moduleName}`]),
          payload: structuralObligationPayload({
            sourceRefs: Object.freeze([`module://${moduleName}`]),
            coverageExpectation:
              "Worker output must include or lawfully carry forward this declared module."
          })
        })
      )
    );
  }
  const requirementCount = obligations.filter(
    (obligation) => obligation.obligationKind === "requirement"
  ).length;
  const authorityIndex = authorityIndexFor(authorityRefs);
  const trancheKeys = trancheKeysFor({
    contract: input.contract,
    materialization: input.materialization
  });
  const retrievalHints = retrievalHintsFor({
    authorityIndex,
    obligations,
    trancheKeys
  });
  return Object.freeze({
    kind: "sdlc_traversal_obligation_context" as const,
    requiredSourceAssetTypes: Object.freeze([...input.contract.sourceAssetTypes]),
    targetAssetType: input.contract.targetAssetType,
    obligations: Object.freeze(obligations),
    authorityRefs,
    authorityIndex,
    trancheKeys,
    retrievalHints,
    runtimeContextRefs,
    priorEdgeRefs,
    deltaSummary: Object.freeze({
      kind: "sdlc_traversal_obligation_delta_summary" as const,
      obligationCount: obligations.length,
      requirementCount,
      priorGapCount,
      authorityRefCount: authorityRefs.length
    })
  });
}

function emptyRetryContext(): SdlcWorkerRetryContext {
  return Object.freeze({
    kind: "sdlc_worker_retry_context",
    retryAttemptRefs: Object.freeze([]),
    priorGapDossiers: Object.freeze([])
  });
}

function constructTraversalIntentPackage(input: {
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly outputFile: string;
  readonly reportFile: string;
  readonly methodRefs: readonly string[];
  readonly resultReportSchema: readonly string[];
  readonly contract: SdlcHookContract;
  readonly materialization: SdlcProductMaterializationContract;
  readonly obligationContext: SdlcTraversalObligationContext;
  readonly retryContext: SdlcWorkerRetryContext;
}): SdlcTraversalIntentPackage {
  const base = Object.freeze({
    kind: "sdlc_traversal_intent_package" as const,
    packageVersion: "ts-intent-v1" as const,
    graphFunctionName: input.graphFunctionName,
    edgeName: input.edgeName,
    vectorIndex: input.vectorIndex,
    sourceAssetTypes: Object.freeze([...input.contract.sourceAssetTypes]),
    targetAssetType: input.contract.targetAssetType,
    methodRefs: Object.freeze([...input.methodRefs]),
    authorityRefs: input.obligationContext.authorityRefs,
    runtimeContextRefs: input.obligationContext.runtimeContextRefs,
    priorEdgeRefs: input.obligationContext.priorEdgeRefs,
    retryAttemptRefs: Object.freeze(
      input.retryContext.retryAttemptRefs.map((ref) => ref.manifestId)
    ),
    priorGapDossierRefs: priorGapDossierRefs(input.retryContext),
    obligationIds: Object.freeze(
      input.obligationContext.obligations.map((obligation) => obligation.obligationId)
    ),
    obligationDeltaSummary: input.obligationContext.deltaSummary,
    productMaterialization: input.materialization,
    resultReportSchema: Object.freeze([...input.resultReportSchema]),
    evaluatorExpectations: input.contract.transformProfile,
    outputFile: input.outputFile,
    reportFile: input.reportFile
  });
  return Object.freeze({
    ...base,
    packageDigest: sha256Text(stableOperatorJson(base))
  });
}

export function assertTraversalIntentPackagePressure(
  manifest: SdlcWorkerHandoffManifest
): void {
  const pkg = manifest.traversalIntentPackage;
  const { packageDigest, ...digestBasis } = pkg;
  if (packageDigest !== sha256Text(stableOperatorJson(digestBasis))) {
    throw new TypeError("traversal intent package digest mismatch");
  }
  if (
    pkg.graphFunctionName !== manifest.graphFunctionName ||
    pkg.edgeName !== manifest.edgeName ||
    pkg.vectorIndex !== manifest.vectorIndex ||
    pkg.targetAssetType !== manifest.targetAssetType ||
    pkg.outputFile !== manifest.outputFile ||
    pkg.reportFile !== manifest.reportFile
  ) {
    throw new TypeError("traversal intent package identity does not match manifest");
  }
  if (pkg.authorityRefs.length === 0) {
    throw new TypeError("traversal intent package missing source authority refs");
  }
  if (
    manifest.productMaterialization.required &&
    !pkg.authorityRefs.some((ref) =>
      ref.endsWith("specification/requirements/00-imported-sources.md")
    )
  ) {
    throw new TypeError("traversal intent package missing induction lineage ref");
  }
  if (
    manifest.productMaterialization.required &&
    pkg.obligationIds.length === 0
  ) {
    throw new TypeError("traversal intent package missing obligation pressure");
  }
  if (
    pkg.obligationIds.length !==
    manifest.traversalObligationContext.obligations.length
  ) {
    throw new TypeError("traversal intent package obligation count drift");
  }
  for (const obligation of manifest.traversalObligationContext.obligations) {
    if (
      obligation.obligationKind === "requirement" &&
      obligation.payload.status !== "concrete"
    ) {
      throw new TypeError(
        `traversal obligation payload insufficient: ${obligation.obligationId}`
      );
    }
  }
  if (
    manifest.retryContext.priorGapDossiers.length > 0 &&
    pkg.priorGapDossierRefs.length === 0
  ) {
    throw new TypeError("traversal intent package missing prior gap refs");
  }
}

export function deriveWorkerHandoffManifest(input: {
  readonly workspaceRoot: string;
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly contract: SdlcHookContract;
  readonly conformedProject?: SdlcConformProjectProfile | undefined;
  readonly retryContext?: SdlcWorkerRetryContext | undefined;
  readonly projectConstraints?: Pick<
    SdlcProjectConstraints,
    "activeTenant" | "selectedOutputRoot"
  > | undefined;
  readonly runId?: string;
}): SdlcWorkerHandoffManifest {
  const runId = input.runId ?? operatorRunId();
  const archiveRoot = join(
    input.workspaceRoot,
    ".ai-workspace",
    "runtime",
    "odd_sdlc",
    "operator-runs",
    runId
  );
  const outputRoot = join(
    input.workspaceRoot,
    ".ai-workspace",
    "runtime",
    "odd_sdlc",
    "assets",
    runId
  );
  const conformedProject =
    input.conformedProject ??
    deriveSdlcConformProjectProfileFromWorkspace(input.workspaceRoot);
  const materialization = productMaterializationContract({
    workspaceRoot: input.workspaceRoot,
    archiveRoot,
    targetAssetType: input.contract.targetAssetType,
    conformedProject,
    projectConstraints: input.projectConstraints
  });
  const retryContext = input.retryContext ?? emptyRetryContext();
  const allowedWriteRoots = materialization.required
    ? Object.freeze([outputRoot, archiveRoot, materialization.tenantRoot])
    : Object.freeze([outputRoot, archiveRoot]);
  const methodRefs = Object.freeze([
    "workspace://.abiogenesis/docs/standards/SPEC_METHOD.md",
    "workspace://.abiogenesis/docs/standards/TICKET_METHOD.md",
    "workspace://.abiogenesis/docs/standards/DESIGN_MODULE_METHOD.md",
    "workspace://.abiogenesis/docs/standards/ODD_METHOD.md"
  ]);
  const resultReportSchema = REPORT_FIELDS;
  const traversalObligationContext = deriveTraversalObligationContext({
    workspaceRoot: input.workspaceRoot,
    contract: input.contract,
    materialization,
    retryContext
  });
  const outputFile = join(outputRoot, `${input.contract.targetAssetType}.md`);
  const reportFile = join(archiveRoot, "worker_result_report.json");
  const traversalIntentPackage = constructTraversalIntentPackage({
    graphFunctionName: input.graphFunctionName,
    edgeName: input.edgeName,
    vectorIndex: input.vectorIndex,
    outputFile,
    reportFile,
    methodRefs,
    resultReportSchema,
    contract: input.contract,
    materialization,
    obligationContext: traversalObligationContext,
    retryContext
  });
  return Object.freeze({
    kind: "sdlc_worker_handoff_manifest",
    contractVersion: "ts-operator-v1",
    workspaceRoot: input.workspaceRoot,
    archiveRoot,
    graphFunctionName: input.graphFunctionName,
    edgeName: input.edgeName,
    vectorIndex: input.vectorIndex,
    inputAssetTypes: Object.freeze([...input.contract.sourceAssetTypes]),
    targetAssetType: input.contract.targetAssetType,
    outputFile,
    reportFile,
    allowedWriteRoots,
    conformedProject,
    productMaterialization: materialization,
    traversalObligationContext,
    traversalIntentPackage,
    retryContext,
    methodRefs,
    resultReportSchema
  });
}

function productMaterializationPrompt(manifest: SdlcWorkerHandoffManifest): string {
  if (!manifest.productMaterialization.required) {
    return [
      "Product materialization is not required for this edge.",
      "Do not write product source/test files for this edge."
    ].join("\n");
  }
  const lines = [
    "Product materialization is REQUIRED for this edge.",
    `Tenant root: ${manifest.productMaterialization.tenantRoot}`,
    `Selected output root: ${manifest.productMaterialization.selectedOutputRoot}`,
    "materializedFiles.relativePath MUST be relative to the tenant root, not the workspace root.",
    `relativePath basis: ${manifest.productMaterialization.relativePathBasis}`,
    `Declared modules: ${
      manifest.productMaterialization.declaredModuleNames.length > 0
        ? manifest.productMaterialization.declaredModuleNames.join(", ")
        : "none declared"
    }`,
    `Build execution contract: ${manifest.productMaterialization.buildExecutionContract}`,
    `Test execution contract: ${manifest.productMaterialization.testExecutionContract}`,
    `Required file roles: ${manifest.productMaterialization.requiredRoles.join(", ")}`,
    `Execution shard count: ${manifest.productMaterialization.executionShards.length}`,
    "Write non-empty downstream product files under the tenant root.",
    "The framework observes changed product files after F_P.transform exits and builds the materialized file ledger.",
    "Use role source for implementation source and role test for developer tests.",
    "Prefer source paths for implementation files and test paths for developer tests."
  ];
  if (manifest.targetAssetType === "test_module_surface") {
    lines.push(
      "For test_module_surface, generated tests MUST be discoverable by the declared test execution contract.",
      "If the selected build configuration lacks a test framework binding, materialize or update build config and list that file with role build_config.",
      "For sbt test, do not emit only standalone object/main tests; use a test framework discoverable by sbt test."
    );
  }
  return lines.join("\n");
}

function executionEvidenceTransformPrompt(
  manifest: SdlcWorkerHandoffManifest
): string {
  if (manifest.targetAssetType === "test_run_archive_surface") {
    return [
      "For test_run_archive_surface, do not run test commands and do not emit fresh sdlc_worker_execution_evidence.",
      "Archive the admitted test_execution_result_surface from the input assets and cite its refs.",
      "If admitted execution-result truth is absent or insufficient, carry a typed blocker instead of synthesizing release evidence."
    ].join("\n");
  }
  if (!targetAdmitsTestExecutionEvidence(manifest.targetAssetType)) {
    return "No execution-evidence transform section is required for this edge.";
  }
  return [
    `For ${manifest.targetAssetType}, the transform artifact should contain bounded test execution evidence for framework admission.`,
    "Do not write worker_result_report.json; the framework admits execution evidence from the transform output.",
    `Consume manifest.productMaterialization.executionShards; do not collapse shard truth into one unscoped run when shards are present.`,
    "When executionShards is non-empty, executionEvidence.shardEvidence MUST contain one sdlc_worker_execution_shard_evidence row for each shardId.",
    "Each shardEvidence row MUST copy shardId and moduleName from the shard register and report counts/status for that shard.",
    "executionEvidence.status MUST be one of: succeeded, failed, pending.",
    "Use pending when execution did not run or external evidence is still unavailable.",
    "Do not use status values such as not_run, skipped, unknown, or none.",
    "executionEvidence.testsObserved, passedCount, and failedCount MUST be numbers or null; never arrays or strings.",
    "executionEvidence.lane MUST be exactly \"test\".",
    `If the test execution contract is declared as ${JSON.stringify(
      manifest.productMaterialization.testExecutionContract
    )}, run that command from the tenant root when execution is available.`,
    "When tests run, record succeeded or failed and report observed test counts.",
    "When tests cannot run, record pending, keep counts at 0, and carry a blocker instead of claiming closure.",
    "Pending evidence is a lawful non-closure carrier for triage or repricing; do not present a not-run document as release closure evidence."
  ].join("\n");
}

function isSbtTestContract(testExecutionContract: string): boolean {
  return /\bsbt\b/u.test(testExecutionContract) && /\btest\b/u.test(testExecutionContract);
}

function textIfFile(filePath: string): string | null {
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return null;
  }
  return readFileSync(filePath, "utf8");
}

function hasSbtTestFrameworkBinding(content: string): boolean {
  return /(?:scalaTest|scalatest|munit|utest|specs2|TestFramework|%+\s*Test)/iu.test(
    content
  );
}

function looksLikeSbtDiscoverableTest(content: string): boolean {
  return /(?:org\.scalatest|munit\.|utest\.|org\.specs2|extends\s+[A-Za-z0-9_.$]*(?:Suite|Spec|FunSuite|AnyFunSuite|AnyFlatSpec|AnyWordSpec|AnyFreeSpec|FunSpec|TestSuite|Specification))/u.test(
    content
  );
}

function scheduleSurfacePrompt(manifest: SdlcWorkerHandoffManifest): string {
  if (!manifest.targetAssetType.endsWith("_schedule_surface")) {
    return "No schedule-surface schema is required for this edge.";
  }
  return [
    "This edge produces a graph-owned schedule surface.",
    "The schedule surface MUST include:",
    "- module_dependency_graph with nodes, edges, and dependency reasons",
    "- realization_tranches or test_tranches ordered by dependency constraints",
    "- execution_shard_register copied from manifest.productMaterialization.executionShards for test scheduling/execution surfaces",
    "- tranche_obligation_ledger mapping tranche ids to requirement/design/module obligation ids",
    "- tranche_gap_ledger with open, done, blocked, and carry-forward states",
    "- next_tranche_selector describing the lawful next tranche and re-entry condition",
    "Do not collapse the schedule into a flat checklist when dependency tranches can be derived."
  ].join("\n");
}

function compactObligation(obligation: SdlcTraversalObligation): unknown {
  return Object.freeze({
    obligationId: obligation.obligationId,
    obligationKind: obligation.obligationKind,
    summary: obligation.summary,
    evidenceRefs: obligation.evidenceRefs,
    sourceRefs: obligation.payload.sourceRefs.slice(0, 3),
    sourceSnippetCount: obligation.payload.sourceSnippets.length,
    coverageExpectation: obligation.payload.coverageExpectation
  });
}

function inlineObligationsForPrompt(
  manifest: SdlcWorkerHandoffManifest
): readonly SdlcTraversalObligation[] {
  const structural = manifest.traversalObligationContext.obligations.filter(
    (obligation) => obligation.obligationKind !== "requirement"
  );
  const requirementSlice = manifest.traversalObligationContext.obligations
    .filter((obligation) => obligation.obligationKind === "requirement")
    .slice(0, 12);
  return Object.freeze([...structural, ...requirementSlice]);
}

function promptPressureProjection(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath: string;
  readonly traversalIntentPath: string;
}): unknown {
  const inlineObligations = inlineObligationsForPrompt(input.manifest);
  const priorGapReasons = priorGapReasonCodes(input.manifest.retryContext);
  return Object.freeze({
    kind: "sdlc_worker_prompt_pressure_projection",
    projectionVersion: "ts-prompt-projection-v1",
    manifestPath: input.manifestPath,
    traversalIntentPackagePath: input.traversalIntentPath,
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    vectorIndex: input.manifest.vectorIndex,
    sourceAssetTypes: input.manifest.inputAssetTypes,
    targetAssetType: input.manifest.targetAssetType,
    authorityIndex: input.manifest.traversalObligationContext.authorityIndex,
    trancheKeys: input.manifest.traversalObligationContext.trancheKeys,
    inlineObligationIds: inlineObligations.map(
      (obligation) => obligation.obligationId
    ),
    inlineObligations: inlineObligations.map(compactObligation),
    retrievalHints: input.manifest.traversalObligationContext.retrievalHints,
    priorGapFrontier: Object.freeze({
      kind: "sdlc_prior_gap_frontier_projection",
      reasonCount: priorGapReasons.length,
      dossierRefs: priorGapDossierRefs(input.manifest.retryContext),
      sampleReasonCodes: priorGapReasons.slice(0, 20),
      omittedReasonCount: Math.max(0, priorGapReasons.length - 20)
    }),
    omittedObligationCount:
      input.manifest.traversalObligationContext.obligations.length -
      inlineObligations.length,
    obligationDeltaSummary:
      input.manifest.traversalObligationContext.deltaSummary,
    productMaterialization: input.manifest.productMaterialization,
    resultReportSchema: input.manifest.resultReportSchema
  });
}

export function promptForHandoff(manifest: SdlcWorkerHandoffManifest): string {
  const manifestPath = join(manifest.archiveRoot, "handoff_manifest.json");
  const traversalIntentPath = join(
    manifest.archiveRoot,
    "traversal_intent_package.json"
  );
  return [
    "You are the F_P worker for an installed odd_sdlc TypeScript operator run.",
    `Read the full handoff manifest before writing output: ${manifestPath}`,
    `Read the traversal intent package before writing output: ${traversalIntentPath}`,
    "Use those files as authority.",
    "The manifest.traversalIntentPackage is the typed cumulative intent package for this edge.",
    "The prompt projection below is a compact index, not a replacement for the full manifest.",
    "Prior retry gaps are linked through priorGapFrontier dossier refs; read those files selectively instead of copying historical gap rows.",
    "Do not use any instruction as authority unless it is represented in the manifest, traversal intent package, or another manifest field.",
    "This invocation is F_P.transform only.",
    "Perform the bounded constructive transformation and return control to the framework.",
    "Do not evaluate closure, assess obligations, list materialized files, write ledgers, or decide whether the edge closes.",
    "The ABG/odd_sdlc post-transform stages observe files, emit events, project ledgers, evaluate obligations, and fold closure after this process exits.",
    "Write only the requested transform artifact and product files unless the manifest says otherwise.",
    `Output artifact: ${manifest.outputFile}`,
    `Framework-generated result report path: ${manifest.reportFile}`,
    "Do not write the result report. The framework writes it after observing this transform.",
    "If you cannot complete the requested transformation in this turn, write the best bounded transform artifact you can, leave remaining work in that artifact, and exit.",
    "Use conformedProject as the generic project profile. Do not infer product identity from this prompt's examples.",
    "",
    productMaterializationPrompt(manifest),
    "",
    executionEvidenceTransformPrompt(manifest),
    "",
    scheduleSurfacePrompt(manifest),
    "",
    "Compact prompt pressure projection:",
    stableOperatorJson(
      promptPressureProjection({
        manifest,
        manifestPath,
        traversalIntentPath
      })
    )
  ].join("\n");
}

export function writeHandoffFiles(manifest: SdlcWorkerHandoffManifest): {
  readonly manifestPath: string;
  readonly promptPath: string;
} {
  assertTraversalIntentPackagePressure(manifest);
  mkdirSync(manifest.archiveRoot, { recursive: true });
  for (const writeRoot of manifest.allowedWriteRoots) {
    mkdirSync(writeRoot, { recursive: true });
  }
  const manifestPath = join(manifest.archiveRoot, "handoff_manifest.json");
  const promptPath = join(manifest.archiveRoot, "worker_prompt.md");
  const conformedProjectPath = join(manifest.archiveRoot, "conformed_project.json");
  const traversalIntentPath = join(manifest.archiveRoot, "traversal_intent_package.json");
  writeFileSync(manifestPath, stableOperatorJson(manifest), "utf8");
  writeFileSync(promptPath, promptForHandoff(manifest), "utf8");
  writeFileSync(conformedProjectPath, stableOperatorJson(manifest.conformedProject), "utf8");
  writeFileSync(
    traversalIntentPath,
    stableOperatorJson(manifest.traversalIntentPackage),
    "utf8"
  );
  return Object.freeze({ manifestPath, promptPath });
}

function parseNonNegativeInteger(input: unknown, label: string): number {
  if (typeof input !== "number" || !Number.isInteger(input) || input < 0) {
    throw new TypeError(`${label}: expected non-negative integer`);
  }
  return input;
}

function parseArray<T>(
  input: unknown,
  label: string,
  parseItem: (item: unknown, itemLabel: string) => T
): readonly T[] {
  if (!Array.isArray(input)) {
    throw new TypeError(`${label}: expected array`);
  }
  return Object.freeze(
    input.map((item, index) => parseItem(item, `${label}[${index}]`))
  );
}

function admitMaterializedProductFile(
  input: unknown,
  label: string
): SdlcMaterializedProductFile {
  const record = parseClosedRecord(input, label, [
    "kind",
    "role",
    "relativePath",
    "absolutePath",
    "digest",
    "byteCount"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_materialized_product_file") {
    throw new TypeError(`${label}.kind: unexpected materialized file kind`);
  }
  return Object.freeze({
    kind: "sdlc_materialized_product_file",
    role: parseEnumValue(
      record["role"],
      `${label}.role`,
      MATERIALIZED_PRODUCT_FILE_ROLES
    ),
    relativePath: parseNonEmptyString(record["relativePath"], `${label}.relativePath`),
    absolutePath: resolve(
      parseNonEmptyString(record["absolutePath"], `${label}.absolutePath`)
    ),
    digest: parseNonEmptyString(record["digest"], `${label}.digest`),
    byteCount: parseNonNegativeInteger(record["byteCount"], `${label}.byteCount`)
  });
}

function parseNullableNonNegativeInteger(input: unknown, label: string): number | null {
  if (input === null) {
    return null;
  }
  return parseNonNegativeInteger(input, label);
}

function parseOptionalArray<T>(
  input: unknown,
  label: string,
  parseItem: (item: unknown, itemLabel: string) => T
): readonly T[] {
  if (input === undefined) {
    return Object.freeze([]);
  }
  return parseArray(input, label, parseItem);
}

function executionEvidenceStatus(input: unknown, label: string) {
  return input === "not_run"
    ? "pending"
    : parseEnumValue(input, label, ["succeeded", "failed", "pending"]);
}

function admitWorkerExecutionShardEvidence(
  input: unknown,
  label: string
): SdlcWorkerExecutionShardEvidence {
  const record = parseClosedRecord(input, label, [
    "kind",
    "shardId",
    "moduleName",
    "lane",
    "command",
    "status",
    "reportRefs",
    "testsObserved",
    "passedCount",
    "failedCount"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_worker_execution_shard_evidence") {
    throw new TypeError(`${label}.kind: unexpected execution shard evidence kind`);
  }
  return Object.freeze({
    kind: "sdlc_worker_execution_shard_evidence" as const,
    shardId: parseNonEmptyString(record["shardId"], `${label}.shardId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    lane: parseEnumValue(record["lane"], `${label}.lane`, ["test"]),
    command: parseNonEmptyString(record["command"], `${label}.command`),
    status: executionEvidenceStatus(record["status"], `${label}.status`),
    reportRefs: parseStringList(record["reportRefs"], `${label}.reportRefs`),
    testsObserved: parseNullableNonNegativeInteger(
      record["testsObserved"],
      `${label}.testsObserved`
    ),
    passedCount: parseNullableNonNegativeInteger(
      record["passedCount"],
      `${label}.passedCount`
    ),
    failedCount: parseNullableNonNegativeInteger(
      record["failedCount"],
      `${label}.failedCount`
    )
  });
}

function admitWorkerExecutionEvidence(
  input: unknown,
  label: string
): SdlcWorkerExecutionEvidence {
  const record = parseClosedRecord(input, label, [
    "kind",
    "lane",
    "command",
    "status",
    "reportRefs",
    "testsObserved",
    "passedCount",
    "failedCount",
    "shardEvidence"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_worker_execution_evidence") {
    throw new TypeError(`${label}.kind: unexpected execution evidence kind`);
  }
  return Object.freeze({
    kind: "sdlc_worker_execution_evidence" as const,
    lane: parseEnumValue(record["lane"], `${label}.lane`, ["build", "test"]),
    command: parseNonEmptyString(record["command"], `${label}.command`),
    status: executionEvidenceStatus(record["status"], `${label}.status`),
    reportRefs: parseStringList(record["reportRefs"], `${label}.reportRefs`),
    testsObserved: parseNullableNonNegativeInteger(
      record["testsObserved"],
      `${label}.testsObserved`
    ),
    passedCount: parseNullableNonNegativeInteger(
      record["passedCount"],
      `${label}.passedCount`
    ),
    failedCount: parseNullableNonNegativeInteger(
      record["failedCount"],
      `${label}.failedCount`
    ),
    shardEvidence: parseOptionalArray(
      record["shardEvidence"],
      `${label}.shardEvidence`,
      admitWorkerExecutionShardEvidence
    )
  });
}

function admitOptionalWorkerExecutionEvidence(
  input: unknown,
  label: string
): SdlcWorkerExecutionEvidence | null {
  if (input === undefined || input === null) {
    return null;
  }
  return admitWorkerExecutionEvidence(input, label);
}

function admitWorkerObligationAssessment(
  input: unknown,
  label: string
): SdlcWorkerObligationAssessment {
  const record = parseClosedRecord(input, label, [
    "kind",
    "obligationId",
    "fulfillmentStatus",
    "evidenceRefs",
    "blockingReasons"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_worker_obligation_assessment") {
    throw new TypeError(`${label}.kind: unexpected obligation assessment kind`);
  }
  return Object.freeze({
    kind: "sdlc_worker_obligation_assessment" as const,
    obligationId: parseNonEmptyString(record["obligationId"], `${label}.obligationId`),
    fulfillmentStatus: parseEnumValue(
      record["fulfillmentStatus"],
      `${label}.fulfillmentStatus`,
      WORKER_OBLIGATION_FULFILLMENT_STATUSES
    ),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`),
    blockingReasons: parseStringList(
      record["blockingReasons"],
      `${label}.blockingReasons`
    )
  });
}

function admitWorkerObligationAssessments(
  input: unknown,
  label: string
): readonly SdlcWorkerObligationAssessment[] {
  if (input === undefined) {
    return Object.freeze([]);
  }
  return parseArray(input, label, admitWorkerObligationAssessment);
}

export function admitWorkerResultReport(
  input: unknown,
  manifest: SdlcWorkerHandoffManifest
): SdlcWorkerResultReport {
  const record = parseClosedRecord(input, "SdlcWorkerResultReport", REPORT_FIELDS);
  const kind = parseNonEmptyString(record["kind"], "SdlcWorkerResultReport.kind");
  if (kind !== "odd_sdlc.worker_result_report") {
    throw new TypeError("SdlcWorkerResultReport.kind: unexpected report kind");
  }
  const graphFunctionName = parseNonEmptyString(
    record["graphFunctionName"],
    "SdlcWorkerResultReport.graphFunctionName"
  );
  const edgeName = parseNonEmptyString(
    record["edgeName"],
    "SdlcWorkerResultReport.edgeName"
  );
  const targetAssetType = parseNonEmptyString(
    record["targetAssetType"],
    "SdlcWorkerResultReport.targetAssetType"
  );
  const outputFile = parseNonEmptyString(
    record["outputFile"],
    "SdlcWorkerResultReport.outputFile"
  );
  const digest = parseNonEmptyString(
    record["digest"],
    "SdlcWorkerResultReport.digest"
  );
  if (graphFunctionName !== manifest.graphFunctionName) {
    throw new TypeError("SdlcWorkerResultReport.graphFunctionName: manifest mismatch");
  }
  if (edgeName !== manifest.edgeName) {
    throw new TypeError("SdlcWorkerResultReport.edgeName: manifest mismatch");
  }
  if (targetAssetType !== manifest.targetAssetType) {
    throw new TypeError("SdlcWorkerResultReport.targetAssetType: manifest mismatch");
  }
  const executionEvidence = admitOptionalWorkerExecutionEvidence(
    record["executionEvidence"],
    "SdlcWorkerResultReport.executionEvidence"
  );
  if (
    !targetAdmitsTestExecutionEvidence(manifest.targetAssetType) &&
    executionEvidence !== null
  ) {
    throw new TypeError(
      "SdlcWorkerResultReport.executionEvidence: target asset type does not admit execution evidence"
    );
  }
  return Object.freeze({
    kind: "odd_sdlc.worker_result_report",
    graphFunctionName,
    edgeName,
    targetAssetType,
    outputFile: resolve(outputFile),
    digest,
    summary: parseNonEmptyString(record["summary"], "SdlcWorkerResultReport.summary"),
    unresolvedReasons: parseStringList(
      record["unresolvedReasons"],
      "SdlcWorkerResultReport.unresolvedReasons"
    ),
    materializedFiles: parseArray(
      record["materializedFiles"],
      "SdlcWorkerResultReport.materializedFiles",
      admitMaterializedProductFile
    ),
    executionEvidence,
    executionEvidenceErrors: parseStringList(
      record["executionEvidenceErrors"] ?? [],
      "SdlcWorkerResultReport.executionEvidenceErrors"
    ),
    obligationAssessments: admitWorkerObligationAssessments(
      record["obligationAssessments"],
      "SdlcWorkerResultReport.obligationAssessments"
    )
  });
}

function pathIsInside(child: string, parent: string): boolean {
  const relativePath = relative(parent, child);
  return (
    relativePath.length === 0 ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath))
  );
}

function filePathFromEvidenceRef(ref: string): string | null {
  if (ref.startsWith("file://")) {
    try {
      return fileURLToPath(ref);
    } catch {
      return null;
    }
  }
  return isAbsolute(ref) ? ref : null;
}

function readExecutionResultEvidenceFromReportRef(ref: string): {
  readonly executionEvidence: SdlcWorkerExecutionEvidence | null;
  readonly error: string | null;
} {
  const filePath = filePathFromEvidenceRef(ref);
  if (filePath === null || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return Object.freeze({
      executionEvidence: null,
      error: "not a readable file evidence ref"
    });
  }
  try {
    const payload: unknown = JSON.parse(readFileSync(filePath, "utf8"));
    const record = parseClosedRecord(payload, "SourceWorkerResultReport", REPORT_FIELDS);
    const kind = parseNonEmptyString(
      record["kind"],
      "SourceWorkerResultReport.kind"
    );
    if (kind !== "odd_sdlc.worker_result_report") {
      return Object.freeze({
        executionEvidence: null,
        error: "unexpected report kind"
      });
    }
    const targetAssetType = parseNonEmptyString(
      record["targetAssetType"],
      "SourceWorkerResultReport.targetAssetType"
    );
    if (targetAssetType !== "test_execution_result_surface") {
      return Object.freeze({
        executionEvidence: null,
        error: `unexpected source target ${targetAssetType}`
      });
    }
    const executionEvidence = admitOptionalWorkerExecutionEvidence(
      record["executionEvidence"],
      "SourceWorkerResultReport.executionEvidence"
    );
    if (executionEvidence === null) {
      const executionEvidenceErrors = parseStringList(
        record["executionEvidenceErrors"] ?? [],
        "SourceWorkerResultReport.executionEvidenceErrors"
      );
      return Object.freeze({
        executionEvidence: null,
        error: executionEvidenceErrors.length > 0
          ? `execution evidence invalid: ${executionEvidenceErrors.join("; ")}`
          : "execution evidence missing"
      });
    }
    return Object.freeze({ executionEvidence, error: null });
  } catch (error) {
    return Object.freeze({
      executionEvidence: null,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

function archiveSourceExecutionResultDependencyError(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly evidenceRefs: readonly string[];
}): string | null {
  const attempts: string[] = [];
  for (const ref of input.evidenceRefs) {
    const readResult = readExecutionResultEvidenceFromReportRef(ref);
    if (readResult.executionEvidence === null) {
      if (readResult.error !== null) {
        attempts.push(`${ref}: ${readResult.error}`);
      }
      continue;
    }
    const executionEvidence = readResult.executionEvidence;
    const blockers: SdlcBlockingReason[] = [];
    const evidenceRefs: string[] = [];
    if (executionEvidence.lane !== "test") {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_lane_mismatch",
          detail: executionEvidence.lane,
          evidenceRefs: executionEvidence.reportRefs
        })
      );
    }
    if (
      executionEvidence.command !==
      input.manifest.productMaterialization.testExecutionContract
    ) {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_command_mismatch",
          detail: executionEvidence.command,
          evidenceRefs: executionEvidence.reportRefs
        })
      );
    }
    if (executionEvidence.status !== "succeeded") {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_not_succeeded",
          detail: executionEvidence.status,
          evidenceRefs: executionEvidence.reportRefs
        })
      );
    }
    if ((executionEvidence.testsObserved ?? 0) <= 0) {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_zero_tests_observed",
          evidenceRefs: executionEvidence.reportRefs
        })
      );
    }
    if ((executionEvidence.failedCount ?? 0) > 0) {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_failures_present",
          detail: String(executionEvidence.failedCount),
          evidenceRefs: executionEvidence.reportRefs
        })
      );
    }
    if (executionEvidence.reportRefs.length === 0) {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_report_refs_missing",
          evidenceRefs: [ref]
        })
      );
    }
    evaluateExecutionShardEvidence({
      manifest: input.manifest,
      executionEvidence,
      blockingReasonCarriers: blockers,
      evidenceRefs
    });
    if (blockers.length === 0) {
      return null;
    }
    attempts.push(
      `${ref}: ${blockers.map((blocker) =>
        blocker.detail === null ? blocker.code : `${blocker.code}:${blocker.detail}`
      ).join(", ")}`
    );
  }
  const detail = attempts.length > 0 ? attempts.join("; ") : "no evidence refs";
  return `admitted execution-result report missing or invalid: ${detail}`;
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

function isExecutionByproductPath(relativePath: string): boolean {
  const normalized = normalizedRelativePath(relativePath).toLowerCase();
  return (
    normalized === "target" ||
    normalized.startsWith("target/") ||
    normalized.includes("/target/") ||
    normalized === ".bsp" ||
    normalized.startsWith(".bsp/") ||
    normalized.includes("/.bsp/")
  );
}

function materializedRoleForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
}): SdlcMaterializedProductFileRole {
  const normalized = input.relativePath.split(path.sep).join("/");
  const lower = normalized.toLowerCase();
  if (
    lower === "build.sbt" ||
    lower.endsWith("/build.sbt") ||
    lower.endsWith(".sbt") ||
    lower.endsWith("/pom.xml") ||
    lower.endsWith("/build.gradle") ||
    lower.endsWith("/build.gradle.kts")
  ) {
    return "build_config";
  }
  if (input.manifest.targetAssetType === "code_surface") {
    return "source";
  }
  if (
    input.manifest.targetAssetType === "test_module_surface" ||
    targetAdmitsTestExecutionEvidence(input.manifest.targetAssetType)
  ) {
    return "test";
  }
  return input.manifest.productMaterialization.requiredRoles[0] ?? "other";
}

function normalizedRelativePath(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

function isLikelyTestMaterialization(input: {
  readonly relativePath: string;
  readonly absolutePath: string;
}): boolean {
  const normalized = normalizedRelativePath(input.relativePath).toLowerCase();
  if (isExecutionByproductPath(normalized)) {
    return false;
  }
  if (
    !(
      normalized.includes("/src/test/") ||
      normalized.startsWith("src/test/") ||
      /\b(test|spec)s?\b/u.test(normalized) ||
      /(?:test|spec)\.(?:scala|ts|tsx|js|jsx|mjs|cjs|py|java|kt)$/u.test(
        normalized
      )
    )
  ) {
    return false;
  }
  const content = textIfFile(input.absolutePath);
  if (content === null) {
    return false;
  }
  if (normalized.endsWith(".scala")) {
    return looksLikeSbtDiscoverableTest(content);
  }
  return content.trim().length > 0;
}

function isLikelySourceMaterialization(relativePath: string): boolean {
  const normalized = normalizedRelativePath(relativePath).toLowerCase();
  if (
    normalized.includes("/src/test/") ||
    normalized.startsWith("src/test/") ||
    normalized.includes("/test/") ||
    normalized.includes("/tests/")
  ) {
    return false;
  }
  return /(?:^|\/)src\/(?:main\/)?/u.test(normalized) &&
    /\.(?:scala|ts|tsx|js|jsx|mjs|cjs|py|java|kt|sql)$/u.test(normalized);
}

function observedFileSatisfiesRequiredRole(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
}): boolean {
  const role = materializedRoleForObservedFile({
    manifest: input.manifest,
    relativePath: input.file.relativePath
  });
  if (!input.manifest.productMaterialization.requiredRoles.includes(role)) {
    return false;
  }
  if (role === "test") {
    return isLikelyTestMaterialization(input.file);
  }
  if (role === "source") {
    return isLikelySourceMaterialization(input.file.relativePath);
  }
  return role === "build_config";
}

function materializedFileFromObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
}): SdlcMaterializedProductFile {
  return Object.freeze({
    kind: "sdlc_materialized_product_file" as const,
    role: materializedRoleForObservedFile({
      manifest: input.manifest,
      relativePath: input.file.relativePath
    }),
    relativePath: input.file.relativePath,
    absolutePath: input.file.absolutePath,
    digest: input.file.digest,
    byteCount: input.file.byteCount
  });
}

export function observeProductMaterializationDelta(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly before: SdlcProductMaterializationSnapshot;
}): readonly SdlcMaterializedProductFile[] {
  const after = snapshotProductMaterializationRoot(
    input.manifest.productMaterialization
  );
  const beforeByPath = snapshotByRelativePath(input.before);
  const observedByPath = new Map<string, SdlcMaterializedProductFile>();
  for (const file of after.files) {
    if (
      targetIgnoresExecutionByproducts(input.manifest.targetAssetType) &&
      isExecutionByproductPath(file.relativePath)
    ) {
      continue;
    }
    const changed = beforeByPath.get(file.relativePath)?.digest !== file.digest;
    const satisfiesRequiredRole = observedFileSatisfiesRequiredRole({
      manifest: input.manifest,
      file
    });
    if (!changed && !satisfiesRequiredRole) {
      continue;
    }
    const materialized = materializedFileFromObservedFile({
      manifest: input.manifest,
      file
    });
    if (
      changed ||
      input.manifest.productMaterialization.requiredRoles.includes(
        materialized.role
      )
    ) {
      observedByPath.set(file.relativePath, materialized);
    }
  }
  return Object.freeze(
    [...observedByPath.values()].sort((left, right) =>
      left.relativePath.localeCompare(right.relativePath)
    )
  );
}

function ensureObservedTransformOutput(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly materializedFiles: readonly SdlcMaterializedProductFile[];
}): void {
  if (existsSync(input.manifest.outputFile)) {
    return;
  }
  if (
    !input.manifest.productMaterialization.required &&
    input.materializedFiles.length === 0
  ) {
    return;
  }
  mkdirSync(dirname(input.manifest.outputFile), { recursive: true });
  writeFileSync(
    input.manifest.outputFile,
    [
      `# ${input.manifest.targetAssetType}`,
      "",
      `graph_function: ${input.manifest.graphFunctionName}`,
      `edge: ${input.manifest.edgeName}`,
      `transform_status: observed`,
      `materialized_file_count: ${input.materializedFiles.length}`,
      "",
      "## Materialized Files",
      "",
      ...input.materializedFiles.map(
        (file) => `- ${file.role}: ${file.relativePath} (${file.digest})`
      )
    ].join("\n"),
    "utf8"
  );
}

function objectRecord(input: unknown): Record<string, unknown> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  return Object.fromEntries(Object.entries(input));
}

function normalizeExecutionEvidenceCandidate(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  if (record["kind"] === "sdlc_worker_execution_evidence") {
    return input;
  }
  if (record["executionEvidence"] !== undefined) {
    return record["executionEvidence"];
  }
  if (record["execution_evidence"] !== undefined) {
    return record["execution_evidence"];
  }
  return input;
}

function executionEvidenceCandidateWithArtifactRef(input: {
  readonly candidate: unknown;
  readonly artifactRef: string;
}): unknown {
  const normalized = normalizeExecutionEvidenceCandidate(input.candidate);
  const record = objectRecord(normalized);
  if (record === null || record["kind"] !== "sdlc_worker_execution_evidence") {
    return normalized;
  }
  const reportRefs = Array.isArray(record["reportRefs"])
    ? record["reportRefs"].filter((ref): ref is string => typeof ref === "string")
    : [];
  const rawShardEvidence: unknown = record["shardEvidence"];
  const shardEvidence = Array.isArray(rawShardEvidence)
    ? rawShardEvidence.map((shard: unknown) => {
        const shardRecord = objectRecord(shard);
        if (shardRecord === null) {
          return shard;
        }
        const shardReportRefs = Array.isArray(shardRecord["reportRefs"])
          ? shardRecord["reportRefs"].filter(
              (ref): ref is string => typeof ref === "string"
            )
          : [];
        return Object.freeze({
          ...shardRecord,
          reportRefs: Object.freeze(
            shardReportRefs.includes(input.artifactRef)
              ? shardReportRefs
              : [...shardReportRefs, input.artifactRef]
          )
        });
      })
    : undefined;
  return Object.freeze({
    ...record,
    reportRefs: Object.freeze(
      reportRefs.includes(input.artifactRef)
        ? reportRefs
        : [...reportRefs, input.artifactRef]
    ),
    ...(shardEvidence === undefined
      ? {}
      : { shardEvidence: Object.freeze(shardEvidence) })
  });
}

interface ParsedJsonCandidate {
  readonly ok: boolean;
  readonly value: unknown;
}

function parseJsonCandidate(input: string): ParsedJsonCandidate {
  try {
    const parsed: unknown = JSON.parse(input);
    return Object.freeze({ ok: true, value: parsed });
  } catch {
    return Object.freeze({ ok: false, value: null });
  }
}

function extractExecutionEvidenceFromTransformArtifact(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly content: string;
}): {
  readonly executionEvidence: SdlcWorkerExecutionEvidence | null;
  readonly errors: readonly string[];
} {
  if (!targetAdmitsTestExecutionEvidence(input.manifest.targetAssetType)) {
    return Object.freeze({
      executionEvidence: null,
      errors: Object.freeze([])
    });
  }
  const artifactRef = pathToFileURL(input.manifest.outputFile).href;
  const candidates: unknown[] = [];
  const wholeJson = parseJsonCandidate(input.content);
  if (wholeJson.ok) {
    candidates.push(wholeJson.value);
  }
  const fencedBlockExpression = /```(?:json|execution_evidence|executionEvidence)?\s*\n([\s\S]*?)```/gu;
  for (const match of input.content.matchAll(fencedBlockExpression)) {
    const block = match[1]?.trim() ?? "";
    const parsed = parseJsonCandidate(block);
    if (parsed.ok) {
      candidates.push(parsed.value);
    }
  }
  const evidenceErrors: string[] = [];
  for (const candidate of candidates) {
    const normalized = normalizeExecutionEvidenceCandidate(candidate);
    const normalizedRecord = objectRecord(normalized);
    if (
      normalizedRecord === null ||
      normalizedRecord["kind"] !== "sdlc_worker_execution_evidence"
    ) {
      continue;
    }
    try {
      return Object.freeze({
        executionEvidence: admitWorkerExecutionEvidence(
          executionEvidenceCandidateWithArtifactRef({
            candidate: normalized,
            artifactRef
          }),
          "transformArtifact.executionEvidence"
        ),
        errors: Object.freeze([])
      });
    } catch (error) {
      evidenceErrors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return Object.freeze({
    executionEvidence: null,
    errors: Object.freeze(evidenceErrors)
  });
}

function requirementIdForObligation(obligationId: string): string | null {
  if (!obligationId.startsWith("requirement:")) {
    return null;
  }
  return normalizeRequirementId(obligationId.slice("requirement:".length));
}

function observedRequirementIds(input: {
  readonly outputFile: string;
  readonly materializedFiles: readonly SdlcMaterializedProductFile[];
}): ReadonlySet<string> {
  const ids = new Set<string>();
  const candidatePaths = [
    input.outputFile,
    ...input.materializedFiles.map((file) => file.absolutePath)
  ];
  for (const filePath of candidatePaths) {
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      continue;
    }
    const content = readFileSync(filePath, "utf8");
    for (const marker of content.match(REQUIREMENT_MARKER_EXPRESSION) ?? []) {
      ids.add(normalizeRequirementId(marker));
    }
  }
  return ids;
}

function postTransformObligationAssessments(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly materializedFiles: readonly SdlcMaterializedProductFile[];
}): readonly SdlcWorkerObligationAssessment[] {
  const outputRef = pathToFileURL(input.manifest.outputFile).href;
  const materializedRefs = input.materializedFiles.map((file) =>
    pathToFileURL(file.absolutePath).href
  );
  const baseEvidenceRefs = Object.freeze([outputRef, ...materializedRefs]);
  const observedRequirements = observedRequirementIds({
    outputFile: input.manifest.outputFile,
    materializedFiles: input.materializedFiles
  });
  return Object.freeze(
    input.manifest.traversalObligationContext.obligations.map((obligation) => {
      const requirementId = requirementIdForObligation(obligation.obligationId);
      if (requirementId !== null) {
        const fulfilled = observedRequirements.has(requirementId);
        return Object.freeze({
          kind: "sdlc_worker_obligation_assessment" as const,
          obligationId: obligation.obligationId,
          fulfillmentStatus: fulfilled ? "fulfilled" : "blocked",
          evidenceRefs: baseEvidenceRefs,
          blockingReasons: fulfilled
            ? Object.freeze([])
            : Object.freeze([`requirement_trace_not_observed:${requirementId}`])
        });
      }
      if (obligation.obligationKind === "target_asset") {
        const fulfilled =
          existsSync(input.manifest.outputFile) &&
          (!input.manifest.productMaterialization.required ||
            input.materializedFiles.length > 0);
        return Object.freeze({
          kind: "sdlc_worker_obligation_assessment" as const,
          obligationId: obligation.obligationId,
          fulfillmentStatus: fulfilled ? "fulfilled" : "blocked",
          evidenceRefs: baseEvidenceRefs,
          blockingReasons: fulfilled
            ? Object.freeze([])
            : Object.freeze(["target_transform_output_not_observed"])
        });
      }
      return Object.freeze({
        kind: "sdlc_worker_obligation_assessment" as const,
        obligationId: obligation.obligationId,
        fulfillmentStatus: existsSync(input.manifest.outputFile)
          ? "fulfilled"
          : "blocked",
        evidenceRefs:
          baseEvidenceRefs.length > 0
            ? baseEvidenceRefs
            : obligation.evidenceRefs,
        blockingReasons: existsSync(input.manifest.outputFile)
          ? Object.freeze([])
          : Object.freeze(["post_transform_output_missing"])
      });
    })
  );
}

export function buildPostTransformWorkerResultReport(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly before: SdlcProductMaterializationSnapshot;
}): SdlcWorkerResultReport {
  const materializedFiles = observeProductMaterializationDelta(input);
  ensureObservedTransformOutput({
    manifest: input.manifest,
    materializedFiles
  });
  if (!existsSync(input.manifest.outputFile)) {
    throw new TypeError("post-transform output artifact missing");
  }
  const content = readFileSync(input.manifest.outputFile, "utf8");
  const extractedExecutionEvidence = extractExecutionEvidenceFromTransformArtifact({
    manifest: input.manifest,
    content
  });
  return Object.freeze({
    kind: "odd_sdlc.worker_result_report" as const,
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    targetAssetType: input.manifest.targetAssetType,
    outputFile: resolve(input.manifest.outputFile),
    digest: sha256Text(content),
    summary: "framework-generated post-transform report from observed artifacts",
    unresolvedReasons: Object.freeze([]),
    materializedFiles,
    executionEvidence: extractedExecutionEvidence.executionEvidence,
    executionEvidenceErrors: extractedExecutionEvidence.errors,
    obligationAssessments: postTransformObligationAssessments({
      manifest: input.manifest,
      materializedFiles
    })
  });
}

function evaluateSbtTestDiscoverability(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
}): void {
  if (
    input.manifest.targetAssetType !== "test_module_surface" ||
    !isSbtTestContract(input.manifest.productMaterialization.testExecutionContract)
  ) {
    return;
  }
  const testFiles = input.report.materializedFiles.filter(
    (file) => file.role === "test"
  );
  const testFileContents = testFiles
    .map((file) => textIfFile(file.absolutePath))
    .filter((content): content is string => content !== null);
  const hasDiscoverableTest = testFileContents.some(looksLikeSbtDiscoverableTest);
  const existingBuildConfig = textIfFile(
    join(input.manifest.productMaterialization.tenantRoot, "build.sbt")
  );
  const reportedBuildConfig = input.report.materializedFiles
    .filter((file) => file.role === "build_config")
    .map((file) => textIfFile(file.absolutePath))
    .filter((content): content is string => content !== null)
    .join("\n");
  const hasFrameworkBinding =
    (existingBuildConfig !== null && hasSbtTestFrameworkBinding(existingBuildConfig)) ||
    hasSbtTestFrameworkBinding(reportedBuildConfig);

  if (hasDiscoverableTest && hasFrameworkBinding) {
    return;
  }
  input.blockingReasonCarriers.push(
    makeSdlcBlockingReason({
      code: "test_materialization_not_discoverable",
      detail: [
        `discoverable_test:${hasDiscoverableTest}`,
        `test_framework_binding:${hasFrameworkBinding}`
      ].join(","),
      evidenceRefs: [
        pathToFileURL(input.manifest.productMaterialization.tenantRoot).href,
        ...testFiles.map((file) => pathToFileURL(file.absolutePath).href)
      ]
    })
  );
}

function evaluateMaterializedProductFiles(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
}): void {
  const contract = input.manifest.productMaterialization;
  if (!contract.required && input.report.materializedFiles.length > 0) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "unexpected_product_materialization_for_surface_edge",
        evidenceRefs: [pathToFileURL(contract.tenantRoot).href]
      })
    );
  }
  if (!contract.required) {
    return;
  }
  if (input.report.materializedFiles.length === 0) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "materialized_product_files_missing",
        evidenceRefs: [pathToFileURL(contract.tenantRoot).href]
      })
    );
  }
  for (const requiredRole of contract.requiredRoles) {
    if (!input.report.materializedFiles.some((file) => file.role === requiredRole)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_role_missing",
          detail: requiredRole,
          evidenceRefs: [pathToFileURL(contract.tenantRoot).href]
        })
      );
    }
  }
  const tenantRoot = resolve(contract.tenantRoot);
  for (const file of input.report.materializedFiles) {
    const absolutePath = resolve(file.absolutePath);
    const fileEvidenceRef = pathToFileURL(absolutePath).href;
    if (!pathIsInside(absolutePath, tenantRoot)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_file_outside_tenant_root",
          evidenceRefs: [fileEvidenceRef]
        })
      );
      continue;
    }
    if (isAbsolute(file.relativePath)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_relative_path_absolute",
          evidenceRefs: [fileEvidenceRef]
        })
      );
    }
    const expectedRelativePath = relative(tenantRoot, absolutePath);
    if (file.relativePath !== expectedRelativePath) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_relative_path_mismatch",
          detail: `${file.relativePath} != ${expectedRelativePath}`,
          evidenceRefs: [fileEvidenceRef]
        })
      );
    }
    if (!existsSync(absolutePath)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_file_missing",
          evidenceRefs: [fileEvidenceRef]
        })
      );
      continue;
    }
    if (!statSync(absolutePath).isFile()) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_path_not_file",
          evidenceRefs: [fileEvidenceRef]
        })
      );
      continue;
    }
    const content = readFileSync(absolutePath, "utf8");
    if (content.trim().length === 0) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_file_empty",
          evidenceRefs: [fileEvidenceRef]
        })
      );
    }
    if (Buffer.byteLength(content, "utf8") !== file.byteCount) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_byte_count_mismatch",
          evidenceRefs: [fileEvidenceRef]
        })
      );
    }
    if (sha256Text(content) !== file.digest) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_digest_mismatch",
          evidenceRefs: [fileEvidenceRef]
        })
      );
    }
  }
  evaluateSbtTestDiscoverability(input);
}

function evaluateExecutionEvidence(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
  readonly evidenceRefs: string[];
}): void {
  if (!targetAdmitsTestExecutionEvidence(input.manifest.targetAssetType)) {
    return;
  }
  const executionEvidence = input.report.executionEvidence;
  if (executionEvidence === null) {
    const executionEvidenceErrors = input.report.executionEvidenceErrors;
    if (executionEvidenceErrors.length > 0) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_evidence_invalid",
          detail: executionEvidenceErrors.join("; "),
          evidenceRefs: input.evidenceRefs
        })
      );
      return;
    }
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_evidence_missing",
        detail:
          "No sdlc_worker_execution_evidence block was admitted from the worker result or transform artifact.",
        evidenceRefs: input.evidenceRefs
      })
    );
    return;
  }
  input.evidenceRefs.push(...executionEvidence.reportRefs);
  if (executionEvidence.lane !== "test") {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_lane_mismatch",
        detail: executionEvidence.lane,
        evidenceRefs: executionEvidence.reportRefs
      })
    );
  }
  if (
    executionEvidence.command !==
    input.manifest.productMaterialization.testExecutionContract
  ) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_command_mismatch",
        detail: executionEvidence.command,
        evidenceRefs: executionEvidence.reportRefs
      })
    );
  }
  evaluateExecutionShardEvidence({
    manifest: input.manifest,
    executionEvidence,
    blockingReasonCarriers: input.blockingReasonCarriers,
    evidenceRefs: input.evidenceRefs
  });
  const contradiction = executionEvidenceContradiction(executionEvidence);
  if (contradiction !== null) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_evidence_contradiction",
        detail: contradiction,
        evidenceRefs: executionEvidence.reportRefs
      })
    );
    if (executionEvidence.reportRefs.length === 0) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_report_refs_missing",
          evidenceRefs: input.evidenceRefs
        })
      );
    }
    return;
  }
  if (executionEvidence.status === "pending") {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_not_succeeded",
        detail: executionEvidence.status,
        evidenceRefs: executionEvidence.reportRefs,
        lawfulReentryPoint: "triage_gap",
        message:
          "Governed test execution is pending; closure requires triage or repricing rather than same-edge retry."
      })
    );
    if (executionEvidence.reportRefs.length === 0) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_report_refs_missing",
          evidenceRefs: input.evidenceRefs
        })
      );
    }
    return;
  }
  if (executionEvidence.status !== "succeeded") {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_not_succeeded",
        detail: executionEvidence.status,
        evidenceRefs: executionEvidence.reportRefs
      })
    );
  }
  if ((executionEvidence.testsObserved ?? 0) <= 0) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_zero_tests_observed",
        evidenceRefs: executionEvidence.reportRefs
      })
    );
  }
  if ((executionEvidence.failedCount ?? 0) > 0) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_failures_present",
        detail: String(executionEvidence.failedCount),
        evidenceRefs: executionEvidence.reportRefs
      })
    );
  }
  if (executionEvidence.reportRefs.length === 0) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_report_refs_missing",
        evidenceRefs: input.evidenceRefs
      })
    );
  }
}

function evaluateExecutionShardEvidence(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly executionEvidence: SdlcWorkerExecutionEvidence;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
  readonly evidenceRefs: string[];
}): void {
  const expectedShards = input.manifest.productMaterialization.executionShards;
  if (expectedShards.length === 0) {
    return;
  }
  const evidenceByShard = new Map<string, SdlcWorkerExecutionShardEvidence>();
  for (const shardEvidence of input.executionEvidence.shardEvidence) {
    input.evidenceRefs.push(...shardEvidence.reportRefs);
    if (evidenceByShard.has(shardEvidence.shardId)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_shard_evidence_mismatch",
          detail: `duplicate shard evidence for ${shardEvidence.shardId}`,
          evidenceRefs: shardEvidence.reportRefs
        })
      );
      continue;
    }
    evidenceByShard.set(shardEvidence.shardId, shardEvidence);
  }
  const expectedShardIds = new Set(expectedShards.map((shard) => shard.shardId));
  for (const shardEvidence of input.executionEvidence.shardEvidence) {
    if (!expectedShardIds.has(shardEvidence.shardId)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_shard_evidence_mismatch",
          detail: `unknown shardId ${shardEvidence.shardId}`,
          evidenceRefs: shardEvidence.reportRefs
        })
      );
    }
  }
  for (const expectedShard of expectedShards) {
    const shardEvidence = evidenceByShard.get(expectedShard.shardId);
    if (shardEvidence === undefined) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_shard_evidence_missing",
          detail: expectedShard.shardId,
          evidenceRefs: input.executionEvidence.reportRefs
        })
      );
      continue;
    }
    if (shardEvidence.moduleName !== expectedShard.moduleName) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_shard_evidence_mismatch",
          detail: `${expectedShard.shardId}: moduleName ${shardEvidence.moduleName}`,
          evidenceRefs: shardEvidence.reportRefs
        })
      );
    }
    if (shardEvidence.command !== expectedShard.command) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_command_mismatch",
          detail: `${expectedShard.shardId}: ${shardEvidence.command}`,
          evidenceRefs: shardEvidence.reportRefs
        })
      );
    }
    const contradiction = executionEvidenceContradiction(shardEvidence);
    if (contradiction !== null) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_evidence_contradiction",
          detail: `${expectedShard.shardId}: ${contradiction}`,
          evidenceRefs: shardEvidence.reportRefs
        })
      );
      continue;
    }
    if (shardEvidence.status !== "succeeded") {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_not_succeeded",
          detail: `${expectedShard.shardId}: ${shardEvidence.status}`,
          evidenceRefs: shardEvidence.reportRefs,
          lawfulReentryPoint:
            shardEvidence.status === "pending" ? "triage_gap" : undefined,
          message:
            shardEvidence.status === "pending"
              ? "Governed shard execution is pending; closure requires triage or repricing rather than same-edge retry."
              : undefined
        })
      );
      continue;
    }
    if ((shardEvidence.testsObserved ?? 0) <= 0) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_zero_tests_observed",
          detail: expectedShard.shardId,
          evidenceRefs: shardEvidence.reportRefs
        })
      );
    }
    if ((shardEvidence.failedCount ?? 0) > 0) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_failures_present",
          detail: `${expectedShard.shardId}: ${String(shardEvidence.failedCount)}`,
          evidenceRefs: shardEvidence.reportRefs
        })
      );
    }
    if (shardEvidence.reportRefs.length === 0) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_report_refs_missing",
          detail: expectedShard.shardId,
          evidenceRefs: input.executionEvidence.reportRefs
        })
      );
    }
  }
  const expectedComplete = expectedShards.every((shard) =>
    evidenceByShard.has(shard.shardId)
  );
  if (!expectedComplete) {
    return;
  }
  const shardTotals = aggregateShardExecutionEvidence(
    input.executionEvidence.shardEvidence
  );
  if (shardTotals === null) {
    return;
  }
  if (
    input.executionEvidence.testsObserved !== null &&
    input.executionEvidence.testsObserved !== shardTotals.testsObserved
  ) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_evidence_contradiction",
        detail: `aggregate testsObserved ${input.executionEvidence.testsObserved} does not equal shard total ${shardTotals.testsObserved}`,
        evidenceRefs: input.executionEvidence.reportRefs
      })
    );
  }
  if (
    input.executionEvidence.passedCount !== null &&
    input.executionEvidence.passedCount !== shardTotals.passedCount
  ) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_evidence_contradiction",
        detail: `aggregate passedCount ${input.executionEvidence.passedCount} does not equal shard total ${shardTotals.passedCount}`,
        evidenceRefs: input.executionEvidence.reportRefs
      })
    );
  }
  if (
    input.executionEvidence.failedCount !== null &&
    input.executionEvidence.failedCount !== shardTotals.failedCount
  ) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_evidence_contradiction",
        detail: `aggregate failedCount ${input.executionEvidence.failedCount} does not equal shard total ${shardTotals.failedCount}`,
        evidenceRefs: input.executionEvidence.reportRefs
      })
    );
  }
}

function aggregateShardExecutionEvidence(
  shardEvidence: readonly SdlcWorkerExecutionShardEvidence[]
): { readonly testsObserved: number; readonly passedCount: number; readonly failedCount: number } | null {
  let testsObserved = 0;
  let passedCount = 0;
  let failedCount = 0;
  for (const shard of shardEvidence) {
    if (
      shard.testsObserved === null ||
      shard.passedCount === null ||
      shard.failedCount === null
    ) {
      return null;
    }
    testsObserved += shard.testsObserved;
    passedCount += shard.passedCount;
    failedCount += shard.failedCount;
  }
  return Object.freeze({ testsObserved, passedCount, failedCount });
}

function executionEvidenceContradiction(
  executionEvidence: SdlcWorkerExecutionEvidence | SdlcWorkerExecutionShardEvidence
): string | null {
  const observed = executionEvidence.testsObserved;
  const passed = executionEvidence.passedCount;
  const failed = executionEvidence.failedCount;
  if (observed !== null && passed !== null && failed !== null) {
    if (passed + failed !== observed) {
      return `passedCount + failedCount (${passed + failed}) does not equal testsObserved (${observed})`;
    }
  }
  if (executionEvidence.status === "succeeded" && (failed ?? 0) > 0) {
    return `status succeeded but failedCount is ${failed}`;
  }
  if (
    executionEvidence.status === "failed" &&
    observed !== null &&
    observed > 0 &&
    (failed ?? 0) === 0
  ) {
    return `status failed but failedCount is 0 for ${observed} observed tests`;
  }
  return null;
}

function evaluateObligationAssessments(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
}): void {
  const declaredById = new Map(
    input.manifest.traversalObligationContext.obligations.map((obligation) => [
      obligation.obligationId,
      obligation
    ])
  );
  const assessedById = new Map(
    input.report.obligationAssessments.map((assessment) => [
      assessment.obligationId,
      assessment
    ])
  );
  const reportRef = pathToFileURL(input.manifest.reportFile).href;
  const outputAssetRef = assetCoverageRef({
    workspaceRoot: input.manifest.workspaceRoot,
    targetAssetType: input.manifest.targetAssetType,
    outputFile: input.report.outputFile
  });
  const outputContent =
    existsSync(input.report.outputFile) && statSync(input.report.outputFile).isFile()
      ? readFileSync(input.report.outputFile, "utf8")
      : "";
  const outputCoverageRefs = new Set<string>([
    ...coverageRefAliases(input.report.outputFile),
    ...coverageRefAliases(pathToFileURL(input.report.outputFile).href),
    ...(outputAssetRef === null ? [] : coverageRefAliases(outputAssetRef)),
    ...input.report.materializedFiles.flatMap((file) => [
      ...coverageRefAliases(file.absolutePath),
      ...coverageRefAliases(pathToFileURL(file.absolutePath).href)
    ]),
    ...(input.report.executionEvidence?.reportRefs.flatMap((ref) =>
      coverageRefAliases(ref)
    ) ?? []),
    ...(input.report.executionEvidence?.shardEvidence.flatMap((shard) =>
      shard.reportRefs.flatMap((ref) => coverageRefAliases(ref))
    ) ?? [])
  ]);
  for (const obligation of declaredById.values()) {
    if (
      obligation.obligationKind === "requirement" &&
      obligation.payload.status !== "concrete"
    ) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "obligation_payload_insufficient",
          detail: obligation.obligationId,
          evidenceRefs: obligation.evidenceRefs.length > 0
            ? obligation.evidenceRefs
            : [reportRef]
        })
      );
    }
    if (!assessedById.has(obligation.obligationId)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "obligation_unassessed",
          detail: obligation.obligationId,
          evidenceRefs: obligation.evidenceRefs.length > 0
            ? obligation.evidenceRefs
            : [reportRef]
        })
      );
    }
  }
  for (const assessment of input.report.obligationAssessments) {
    const declared = declaredById.get(assessment.obligationId);
    if (declared === undefined) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "obligation_assessment_extra",
          detail: assessment.obligationId,
          evidenceRefs: assessment.evidenceRefs.length > 0
            ? assessment.evidenceRefs
            : [reportRef]
        })
      );
    }
    if (
      input.manifest.targetAssetType === "test_run_archive_surface" &&
      declared?.obligationKind === "source_asset" &&
      assessment.fulfillmentStatus === "fulfilled"
    ) {
      const sourceAssetType = declared.obligationId.slice("source_asset:".length);
      const archiveDependencyError =
        sourceAssetType === "test_execution_result_surface"
          ? archiveSourceExecutionResultDependencyError({
              manifest: input.manifest,
              evidenceRefs: assessment.evidenceRefs
            })
          : null;
      if (!outputContent.includes(sourceAssetType) || archiveDependencyError !== null) {
        input.blockingReasonCarriers.push(
          makeSdlcBlockingReason({
            code: "source_asset_dependency_missing",
            detail: archiveDependencyError === null
              ? sourceAssetType
              : `${sourceAssetType}: ${archiveDependencyError}`,
            evidenceRefs: assessment.evidenceRefs.length > 0
              ? assessment.evidenceRefs
              : [reportRef]
          })
        );
      }
    }
    if (
      declared?.obligationKind === "requirement" &&
      assessment.fulfillmentStatus === "fulfilled" &&
      !assessment.evidenceRefs.some((ref) =>
        coverageRefAliases(ref).some((alias) => outputCoverageRefs.has(alias))
      )
    ) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "obligation_fulfilled_without_output_coverage",
          detail: assessment.obligationId,
          evidenceRefs: assessment.evidenceRefs.length > 0
            ? assessment.evidenceRefs
            : [reportRef]
        })
      );
    }
    if (assessment.fulfillmentStatus === "unassessed") {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "obligation_status_unassessed",
          detail: assessment.obligationId,
          evidenceRefs: assessment.evidenceRefs.length > 0
            ? assessment.evidenceRefs
            : [reportRef]
        })
      );
    }
    if (
      assessment.fulfillmentStatus === "blocked" &&
      assessment.evidenceRefs.length === 0
    ) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "obligation_blocked_without_evidence",
          detail: assessment.obligationId,
          evidenceRefs: [reportRef]
        })
      );
    }
  }
}

export function evaluateWorkerResultPostflight(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): SdlcPostflightResult {
  const blockingReasonCarriers: SdlcBlockingReason[] = [];
  const outputFile = resolve(input.report.outputFile);
  const outputEvidenceRef = pathToFileURL(outputFile).href;
  if (outputFile !== resolve(input.manifest.outputFile)) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "output_file_manifest_mismatch",
        evidenceRefs: [outputEvidenceRef]
      })
    );
  }
  if (!input.manifest.allowedWriteRoots.some((root) => pathIsInside(outputFile, root))) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "output_file_outside_allowed_root",
        evidenceRefs: [outputEvidenceRef]
      })
    );
  }
  if (!existsSync(outputFile)) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "output_file_missing",
        evidenceRefs: [outputEvidenceRef]
      })
    );
  } else if (!statSync(outputFile).isFile()) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "output_path_not_file",
        evidenceRefs: [outputEvidenceRef]
      })
    );
  } else {
    const content = readFileSync(outputFile, "utf8");
    if (content.trim().length === 0) {
      blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "output_file_empty",
          evidenceRefs: [outputEvidenceRef]
        })
      );
    }
    if (sha256Text(content) !== input.report.digest) {
      blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "output_digest_mismatch",
          evidenceRefs: [outputEvidenceRef]
        })
      );
    }
  }
  if (input.report.unresolvedReasons.length > 0) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "worker_report_unresolved_reasons_present",
        detail: input.report.unresolvedReasons.join("; "),
        evidenceRefs: [pathToFileURL(input.manifest.reportFile).href]
      })
    );
  }
  evaluateMaterializedProductFiles({
    manifest: input.manifest,
    report: input.report,
    blockingReasonCarriers
  });
  const evidenceRefs = [
    pathToFileURL(input.manifest.outputFile).href,
    pathToFileURL(input.manifest.reportFile).href,
    pathToFileURL(input.manifest.productMaterialization.manifestFile).href,
    ...input.report.materializedFiles.map((file) =>
      pathToFileURL(file.absolutePath).href
    )
  ];
  evaluateExecutionEvidence({
    manifest: input.manifest,
    report: input.report,
    blockingReasonCarriers,
    evidenceRefs
  });
  evaluateObligationAssessments({
    manifest: input.manifest,
    report: input.report,
    blockingReasonCarriers
  });
  const blockingReasons = blockingReasonCarriers.map(legacyBlockingReasonCode);
  return Object.freeze({
    kind: "sdlc_operator_postflight_result",
    status: blockingReasons.length === 0 ? "passed" : "blocked",
    blockingReasons: Object.freeze(blockingReasons),
    blockingReasonCarriers: Object.freeze(blockingReasonCarriers),
    evidenceRefs: Object.freeze(evidenceRefs)
  });
}

export function writeProductMaterializationManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): string {
  mkdirSync(dirname(input.manifest.productMaterialization.manifestFile), {
    recursive: true
  });
  writeFileSync(
    input.manifest.productMaterialization.manifestFile,
    stableOperatorJson({
      kind: "sdlc_product_materialization_manifest",
      contract: input.manifest.productMaterialization,
      files: input.report.materializedFiles
    }),
    "utf8"
  );
  return input.manifest.productMaterialization.manifestFile;
}

export function gapDossierPathForManifest(
  manifest: SdlcWorkerHandoffManifest
): string {
  return join(manifest.archiveRoot, "gap_dossier.json");
}

export function constructPostflightGapDossier(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly postflight: SdlcPostflightResult;
}): SdlcPostflightGapDossier {
  if (input.postflight.status !== "blocked") {
    throw new TypeError("Postflight gap dossier requires blocked postflight");
  }
  const gapDossierRef = pathToFileURL(gapDossierPathForManifest(input.manifest)).href;
  const retryEligible = input.postflight.blockingReasonCarriers.some((reason) =>
    reason.lawfulReentryPoint === "same_edge_retry" ||
    reason.lawfulReentryPoint === "repair_worker_output"
  );
  const actions = new Set<
    "retry_same_edge" | "repair_worker_output" | "triage_gap" | "reprice_requirement_or_design"
  >();
  for (const reason of input.postflight.blockingReasonCarriers) {
    if (reason.lawfulReentryPoint === "same_edge_retry") {
      actions.add("retry_same_edge");
    } else if (reason.lawfulReentryPoint === "repair_worker_output") {
      actions.add("repair_worker_output");
    } else if (reason.lawfulReentryPoint === "triage_gap") {
      actions.add("triage_gap");
    } else if (reason.lawfulReentryPoint === "reprice_requirement_or_design") {
      actions.add("reprice_requirement_or_design");
    }
  }
  if (actions.size === 0) {
    actions.add("triage_gap");
  }
  return Object.freeze({
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    vectorIndex: input.manifest.vectorIndex,
    targetAssetType: input.manifest.targetAssetType,
    reasons: Object.freeze(
      input.postflight.blockingReasonCarriers.map((blockingReason, index) =>
        Object.freeze({
          kind: "sdlc_postflight_gap_reason",
          reason:
            input.postflight.blockingReasons[index] ??
            legacyBlockingReasonCode(blockingReason),
          reasonClass: blockingReason.reasonClass,
          blockingReason
        })
      )
    ),
    evidenceRefs: input.postflight.evidenceRefs,
    priorManifestId: pathToFileURL(
      join(input.manifest.archiveRoot, "handoff_manifest.json")
    ).href,
    currentGapDossierRef: gapDossierRef,
    retryEligible,
    nextLawfulActions: Object.freeze([...actions])
  });
}

export function writePostflightGapDossier(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly gapDossier: SdlcPostflightGapDossier;
}): string {
  const filePath = gapDossierPathForManifest(input.manifest);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, stableOperatorJson(input.gapDossier), "utf8");
  return filePath;
}

function admitPostflightGapReason(
  input: unknown,
  label: string
): SdlcPostflightGapReason {
  const record = parseClosedRecord(input, label, [
    "kind",
    "reason",
    "reasonClass",
    "blockingReason"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_postflight_gap_reason") {
    throw new TypeError(`${label}.kind: unexpected postflight gap reason kind`);
  }
  const reason = parseNonEmptyString(record["reason"], `${label}.reason`);
  const reasonClass = parseEnumValue(
    record["reasonClass"],
    `${label}.reasonClass`,
    POSTFLIGHT_GAP_REASON_CLASSES
  );
  return Object.freeze({
    kind: "sdlc_postflight_gap_reason",
    reason,
    reasonClass,
    blockingReason:
      record["blockingReason"] === undefined
        ? sdlcBlockingReasonFromLegacy({ reason })
        : admitSdlcBlockingReason(record["blockingReason"], `${label}.blockingReason`)
  });
}

export function admitPostflightGapDossier(
  input: unknown,
  label = "SdlcPostflightGapDossier"
): SdlcPostflightGapDossier {
  const record = parseClosedRecord(input, label, [
    "kind",
    "status",
    "graphFunctionName",
    "edgeName",
    "vectorIndex",
    "targetAssetType",
    "reasons",
    "evidenceRefs",
    "priorManifestId",
    "currentGapDossierRef",
    "retryEligible",
    "nextLawfulActions"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_postflight_gap_dossier") {
    throw new TypeError(`${label}.kind: unexpected postflight gap dossier kind`);
  }
  const status = parseEnumValue(record["status"], `${label}.status`, ["open"]);
  return Object.freeze({
    kind: "sdlc_postflight_gap_dossier",
    status,
    graphFunctionName: parseNonEmptyString(
      record["graphFunctionName"],
      `${label}.graphFunctionName`
    ),
    edgeName: parseNonEmptyString(record["edgeName"], `${label}.edgeName`),
    vectorIndex: parseNonNegativeInteger(record["vectorIndex"], `${label}.vectorIndex`),
    targetAssetType: parseNonEmptyString(
      record["targetAssetType"],
      `${label}.targetAssetType`
    ),
    reasons: parseArray(record["reasons"], `${label}.reasons`, admitPostflightGapReason),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`),
    priorManifestId: parseNonEmptyString(
      record["priorManifestId"],
      `${label}.priorManifestId`
    ),
    currentGapDossierRef: parseNonEmptyString(
      record["currentGapDossierRef"],
      `${label}.currentGapDossierRef`
    ),
    retryEligible: parseBoolean(record["retryEligible"], `${label}.retryEligible`),
    nextLawfulActions: parseArray(
      record["nextLawfulActions"],
      `${label}.nextLawfulActions`,
      (item, itemLabel) =>
        parseEnumValue(item, itemLabel, POSTFLIGHT_GAP_ACTIONS)
    )
  });
}

export function readPostflightGapDossierRef(
  ref: string
): SdlcPostflightGapDossier | null {
  if (!ref.startsWith("file://")) {
    return null;
  }
  try {
    return admitPostflightGapDossier(
      JSON.parse(readFileSync(fileURLToPath(ref), "utf8"))
    );
  } catch {
    return null;
  }
}

export function constructorResultFromWorkerOutput(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly operationType?: SdlcWorkOperation;
}): SdlcConstructorResult {
  if (!existsSync(input.manifest.productMaterialization.manifestFile)) {
    writeProductMaterializationManifest({
      manifest: input.manifest,
      report: input.report
    });
  }
  const content = readFileSync(input.report.outputFile, "utf8");
  const digest = sha256Text(content);
  return admitSdlcConstructorResult({
    operationType: input.operationType ?? "generate",
    outputIdentity: {
      assetId: `asset://odd_sdlc/operator/${input.manifest.edgeName}/${input.manifest.targetAssetType}`,
      uri: pathToFileURL(input.report.outputFile).href,
      declaredType: input.manifest.targetAssetType,
      digest,
      byteCount: Buffer.byteLength(content, "utf8")
    },
    evidenceRefs: [
      {
        ref: pathToFileURL(input.report.outputFile).href,
        evidenceType: "installed_operator_generated_asset",
        digest
      },
      {
        ref: pathToFileURL(input.manifest.reportFile).href,
        evidenceType: "installed_operator_worker_report",
        digest: sha256File(input.manifest.reportFile)
      },
      {
        ref: pathToFileURL(input.manifest.productMaterialization.manifestFile).href,
        evidenceType: "installed_operator_product_materialization_manifest",
        digest: sha256File(input.manifest.productMaterialization.manifestFile)
      }
    ].concat(
      input.report.materializedFiles.map((file) => ({
        ref: pathToFileURL(file.absolutePath).href,
        evidenceType: `installed_operator_materialized_product_${file.role}`,
        digest: file.digest
      })),
      input.report.executionEvidence?.reportRefs.map((ref) => ({
        ref,
        evidenceType: "installed_operator_execution_report",
        digest: "sha256:external"
      })) ?? []
    ),
    generatedAssetContract: {
      contractName: `installed-operator-${input.manifest.targetAssetType}-contract`,
      targetAssetId: `asset://odd_sdlc/operator/${input.manifest.edgeName}/${input.manifest.targetAssetType}`,
      satisfied: true,
      materialized: true,
      diagnostics: [
        `materialized_product_file_count:${input.report.materializedFiles.length}`
      ],
      foreignRealizationCandidates: []
    },
    ambiguityCandidates: []
  });
}

export function readWorkerResultReport(
  manifest: SdlcWorkerHandoffManifest
): SdlcWorkerResultReport {
  const payload: unknown = JSON.parse(readFileSync(manifest.reportFile, "utf8"));
  return admitWorkerResultReport(payload, manifest);
}

export function writeOperatorArchiveFile(input: {
  readonly archiveRoot: string;
  readonly relativePath: string;
  readonly payload: unknown;
}): string {
  const targetPath = join(input.archiveRoot, input.relativePath);
  mkdirSync(dirname(targetPath), { recursive: true });
  const content =
    typeof input.payload === "string"
      ? input.payload
      : stableOperatorJson(input.payload);
  writeFileSync(targetPath, content, "utf8");
  return targetPath;
}

export function relativeToWorkspace(workspaceRoot: string, filePath: string): string {
  return path.relative(workspaceRoot, filePath);
}
