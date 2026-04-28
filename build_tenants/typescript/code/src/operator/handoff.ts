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
  SdlcWorkerObligationAssessment,
  SdlcWorkerRetryContext,
  SdlcWorkerResultReport
} from "./carriers.js";

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
  return Object.freeze({
    kind: "sdlc_product_materialization_contract",
    required: requiredRoles.length > 0,
    activeTenant,
    selectedOutputRoot,
    tenantRoot: resolve(input.workspaceRoot, selectedOutputRoot),
    relativePathBasis: "tenant_root",
    declaredModuleNames: Object.freeze([
      ...(input.conformedProject?.declaredModuleNames ?? [])
    ]),
    buildExecutionContract:
      input.conformedProject?.buildExecutionContract ?? "undeclared",
    testExecutionContract:
      input.conformedProject?.testExecutionContract ?? "undeclared",
    manifestFile: join(input.archiveRoot, "product_materialization_manifest.json"),
    requiredRoles
  });
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
    input.contract.targetAssetType === "test_run_archive_surface"
  ) {
    keys.push("qualification:tranche_execution");
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
    ...input.retryContext.priorGapDossiers.map(
      (dossier) => dossier.currentGapDossierRef
    )
  ]);
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
  if (input.materialization.required) {
    obligations.push(
      ...input.contract.sourceAssetTypes.map((assetType) =>
        Object.freeze({
          kind: "sdlc_traversal_obligation" as const,
          obligationId: `source_asset:${assetType}`,
          obligationKind: "source_asset" as const,
          summary: `Use admitted source asset type ${assetType}.`,
          evidenceRefs: Object.freeze([`asset-type://${assetType}`]),
          payload: structuralObligationPayload({
            sourceRefs: Object.freeze([`asset-type://${assetType}`]),
            coverageExpectation:
              "Worker output must preserve the declared source asset contribution."
          })
        })
      ),
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
  obligations.push(
    ...input.retryContext.priorGapDossiers.flatMap((dossier) =>
      dossier.reasons.map((reason) =>
        Object.freeze({
          kind: "sdlc_traversal_obligation" as const,
          obligationId: `prior_gap:${reason.reason}`,
          obligationKind: "prior_gap" as const,
          summary: `Close or carry prior gap ${reason.reason}.`,
          evidenceRefs: Object.freeze([dossier.currentGapDossierRef]),
          payload: structuralObligationPayload({
            sourceRefs: Object.freeze([dossier.currentGapDossierRef]),
            coverageExpectation:
              "Worker output must close this prior gap or carry it forward as a typed residual gap."
          })
        })
      )
    )
  );
  const requirementCount = obligations.filter(
    (obligation) => obligation.obligationKind === "requirement"
  ).length;
  const priorGapCount = obligations.filter(
    (obligation) => obligation.obligationKind === "prior_gap"
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
    priorGapDossierRefs: Object.freeze(
      input.retryContext.priorGapDossiers.map((dossier) => dossier.currentGapDossierRef)
    ),
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
      "Set materializedFiles to an empty array and do not write product source/test files."
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
    "Write non-empty downstream product files under the tenant root.",
    "Every materialized product file must be listed in materializedFiles with:",
    "kind, role, relativePath, absolutePath, digest, byteCount.",
    "Each materialized file kind MUST be \"sdlc_materialized_product_file\".",
    "Use role source for implementation source and role test for developer tests.",
    "The digest must be sha256:<hex> over the UTF-8 file content."
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

function executionEvidencePrompt(manifest: SdlcWorkerHandoffManifest): string {
  const base = [
    "executionEvidence.status MUST be one of: succeeded, failed, pending.",
    "Use pending when execution did not run or external evidence is still unavailable.",
    "Do not use status values such as not_run, skipped, unknown, or none.",
    "executionEvidence.testsObserved, passedCount, and failedCount MUST be numbers or null; never arrays or strings."
  ];
  if (manifest.targetAssetType !== "test_run_archive_surface") {
    return base.join("\n");
  }
  return [
    ...base,
    "For test_run_archive_surface, the target outcome is governed test execution evidence.",
    "For test_run_archive_surface, executionEvidence.lane MUST be exactly \"test\".",
    `If the test execution contract is declared as ${JSON.stringify(
      manifest.productMaterialization.testExecutionContract
    )}, run that command from the tenant root when execution is available.`,
    "When tests run, set status to succeeded or failed and report observed test counts.",
    "When tests cannot run, set status to pending, keep counts at 0, and carry a blocking reason instead of claiming closure.",
    "A document that says tests were not run is not closure evidence for this edge."
  ].join("\n");
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
    "Do not use any instruction as authority unless it is represented in the manifest, traversal intent package, or another manifest field.",
    "Write only the requested output artifact and JSON result report unless the manifest says otherwise.",
    `Output artifact: ${manifest.outputFile}`,
    `Result report: ${manifest.reportFile}`,
    "",
    "The result report must be JSON with exactly these fields:",
    REPORT_FIELDS.join(", "),
    "",
    "Use kind \"odd_sdlc.worker_result_report\".",
    "Set graphFunctionName, edgeName, targetAssetType, and outputFile from the manifest.",
    "Set digest to the sha256:<hex> digest of the output artifact content.",
    "Set unresolvedReasons to an array, empty when no blocker remains.",
    "Set materializedFiles according to the product materialization contract.",
    "Set executionEvidence to null unless the target surface is an execution archive/result.",
    "When executionEvidence is non-null it must have exactly these fields: kind, lane, command, status, reportRefs, testsObserved, passedCount, failedCount.",
    "executionEvidence.kind MUST be \"sdlc_worker_execution_evidence\".",
    "Do not add extra executionEvidence fields such as workingDirectory, duration, stdout, or stderr.",
    executionEvidencePrompt(manifest),
    "Set obligationAssessments to one assessment for every manifest.traversalObligationContext.obligations item.",
    "Each obligation assessment must have exactly these fields: kind, obligationId, fulfillmentStatus, evidenceRefs, blockingReasons.",
    "obligation assessment kind MUST be \"sdlc_worker_obligation_assessment\".",
    "fulfillmentStatus MUST be one of fulfilled, partial, blocked, unassessed.",
    "Use conformedProject as the generic project profile. Do not infer product identity from this prompt's examples.",
    "",
    productMaterializationPrompt(manifest),
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
    "failedCount"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_worker_execution_evidence") {
    throw new TypeError(`${label}.kind: unexpected execution evidence kind`);
  }
  return Object.freeze({
    kind: "sdlc_worker_execution_evidence" as const,
    lane: parseEnumValue(record["lane"], `${label}.lane`, ["build", "test"]),
    command: parseNonEmptyString(record["command"], `${label}.command`),
    status:
      record["status"] === "not_run"
        ? "pending"
        : parseEnumValue(record["status"], `${label}.status`, [
            "succeeded",
            "failed",
            "pending"
          ]),
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
    executionEvidence: admitOptionalWorkerExecutionEvidence(
      record["executionEvidence"],
      "SdlcWorkerResultReport.executionEvidence"
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
  if (input.manifest.targetAssetType !== "test_run_archive_surface") {
    return;
  }
  const executionEvidence = input.report.executionEvidence;
  if (executionEvidence === null) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_evidence_missing",
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
  const outputCoverageRefs = new Set<string>([
    ...coverageRefAliases(input.report.outputFile),
    ...coverageRefAliases(pathToFileURL(input.report.outputFile).href),
    ...input.report.materializedFiles.flatMap((file) => [
      ...coverageRefAliases(file.absolutePath),
      ...coverageRefAliases(pathToFileURL(file.absolutePath).href)
    ]),
    ...(input.report.executionEvidence?.reportRefs.flatMap((ref) =>
      coverageRefAliases(ref)
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
    retryEligible: true,
    nextLawfulActions: Object.freeze([
      "retry_same_edge",
      "repair_worker_output",
      "triage_gap",
      "reprice_requirement_or_design"
    ] as const)
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
