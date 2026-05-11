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
  admitFpTransformResultForRequest,
  constructFpTransformResult,
  type FpTransformRequest,
  type FpTransformResult
} from "@abiogenesis/typescript-tenant";
import {
  admitSdlcConstructorResult,
  type SdlcConstructorResult,
  type SdlcHookContract,
  type SdlcWorkOperation
} from "../hooks/index.js";
import {
  FG_CONFORM_PROJECT_AUTHORITY,
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
} from "../graph/index.js";
import {
  parseClosedRecord,
  parseBoolean,
  parseEnumValue,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import { admitExactContractEnum } from "../shared/fd_admission.js";
import {
  admitSdlcBlockingReason,
  canonicalSdlcPriorGapReasonCode,
  legacyBlockingReasonCode,
  makeSdlcBlockingReason,
  sdlcBlockingReasonFromLegacy,
  type SdlcBlockingReason
} from "../shared/blocking_reason.js";
import {
  deriveSdlcFeatureScope,
  sdlcTraversalObligationInFeatureScope
} from "./feature_scope.js";
import { admitComponentDepthRegisterFromArtifact } from "./component_depth_register.js";
import { deriveSdlcTraversalStrategyDecision } from "./traversal_strategy.js";
import {
  defaultSdlcTraversalScopeRefsForName
} from "../shared/traversal_strategy_plan.js";
import type { SdlcProjectConstraints } from "../workspace/index.js";
import {
  deriveSdlcConformProjectProfileFromWorkspace,
  standardSdlcRuntimeLayout,
  type SdlcConformProjectProfile
} from "../workspace/index.js";
import type {
  SdlcMaterializedProductFile,
  SdlcMaterializedProductFileRole,
  SdlcPostflightResult,
  SdlcPostflightGapDossier,
  SdlcPostflightGapReason,
  SdlcPostflightGapReasonClass,
  SdlcFpEvaluateResult,
  SdlcComponentRepairReentryPlan,
  SdlcComponentRepairScheduleRow,
  SdlcProductMaterializationContract,
  SdlcAuthorityIndexCategory,
  SdlcAuthorityIndexEntry,
  SdlcTraversalIntentPackage,
  SdlcTraversalObligation,
  SdlcTraversalObligationPayload,
  SdlcTraversalObligationContext,
  SdlcTraversalStrategyDecision,
  SdlcRetrievalHint,
  SdlcProductMaterializationAuthorityReconciliation,
  SdlcProductMaterializationAuthorityTarget,
  SdlcWorkerBrief,
  SdlcWorkerInvocationObligation,
  SdlcWorkerInvocationPackage,
  SdlcWorkerRetryRepairInstruction,
  SdlcWorkerRetryRepairScope,
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
  "obligationAssessments",
  "fpTransformRequestRef",
  "fpTransformResultRef",
  "fpTransformStatus",
  "fpEvaluateResultRef"
] as const);

const MATERIALIZED_PRODUCT_FILE_ROLES = Object.freeze([
  "source",
  "test",
  "build_config",
  "design",
  "documentation",
  "other"
] as const);

const TENANT_LOCAL_SDLC_SURFACE_OUTPUT_PATHS = Object.freeze({
  feature_decomp_surface: "design/feature_decomp_surface.md",
  design_surface: "design/adrs/ADR-001-design-surface.md",
  scenario_surface: "design/scenario_surface.md",
  implementation_design_surface:
    "design/adrs/ADR-002-implementation-design-surface.md",
  implementation_stack_profile: "design/implementation_stack_profile.md",
  implementation_module_surface: "design/implementation_module_surface.md",
  aggregate_domain_model_surface: "design/aggregate_domain_model_surface.md",
  implementation_component_topology_surface:
    "design/implementation_component_topology_surface.md",
  aggregate_sunny_day_sequence_surface:
    "design/aggregate_sunny_day_sequence_surface.md",
  component_realization_schedule_surface:
    "design/component_realization_schedule_surface.md",
  component_code_surface: "design/component_code_surface.md",
  component_realization_qualification_surface:
    "design/component_realization_qualification_surface.md",
  realization_schedule_surface: "design/realization_schedule_surface.md",
  code_surface: "design/code_surface.md",
  uat_testcases_surface: "design/uat_testcases_surface.md",
  test_design_surface: "design/adrs/ADR-003-test-design-surface.md",
  test_stack_profile: "design/test_stack_profile.md",
  test_module_surface: "design/test_module_surface.md",
  test_component_topology_surface: "design/test_component_topology_surface.md",
  component_test_surface: "design/component_test_surface.md",
  component_test_qualification_surface:
    "design/component_test_qualification_surface.md",
  component_repair_schedule_surface: "design/component_repair_schedule_surface.md",
  testcase_authority_surface: "design/testcase_authority_surface.md",
  release_depth_parity_surface: "design/release_depth_parity_surface.md",
  release_surface: "design/release_surface.md",
  retrofit_design_surface: "design/adrs/ADR-004-retrofit-design-surface.md",
  retrofit_plan_surface: "design/retrofit_plan_surface.md",
  gap_observation_surface: "design/gap_observation_surface.md",
  gap_triage_surface: "design/gap_triage_surface.md",
  gap_route_surface: "design/gap_route_surface.md",
  repricing_proposal_surface: "design/repricing_proposal_surface.md",
  ticket_work_item_route_surface: "design/ticket_work_item_route_surface.md",
  gap_retirement_surface: "design/gap_retirement_surface.md"
} as const satisfies Record<string, string>);

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
  "escalate_to_fp",
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

function tenantLocalSdlcSurfaceRelativePath(targetAssetType: string): string | null {
  for (const [assetType, relativePath] of Object.entries(
    TENANT_LOCAL_SDLC_SURFACE_OUTPUT_PATHS
  )) {
    if (assetType === targetAssetType) {
      return relativePath;
    }
  }
  return null;
}

function deriveOutputFileForTarget(input: {
  readonly defaultOutputRoot: string;
  readonly targetAssetType: string;
  readonly materialization: SdlcProductMaterializationContract;
}): string {
  const tenantRelativePath = tenantLocalSdlcSurfaceRelativePath(
    input.targetAssetType
  );
  if (tenantRelativePath === null) {
    return join(input.defaultOutputRoot, `${input.targetAssetType}.md`);
  }
  return join(input.materialization.tenantRoot, tenantRelativePath);
}

function tenantRelativeOutputArtifactPath(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  const tenantRoot = resolve(manifest.productMaterialization.tenantRoot);
  const outputFile = resolve(manifest.outputFile);
  if (!pathIsInside(outputFile, tenantRoot)) {
    return null;
  }
  return relative(tenantRoot, outputFile).split(path.sep).join("/");
}

function tenantOutputArtifactIsAdr(manifest: SdlcWorkerHandoffManifest): boolean {
  const tenantRelativePath = tenantRelativeOutputArtifactPath(manifest);
  return tenantRelativePath !== null && tenantRelativePath.startsWith("design/adrs/");
}

function materializationRolesForTarget(
  targetAssetType: string
): readonly SdlcMaterializedProductFileRole[] {
  if (targetAssetType === "component_code_surface") {
    return Object.freeze(["source"]);
  }
  if (targetAssetType === "component_test_surface") {
    return Object.freeze(["test"]);
  }
  return Object.freeze([]);
}

function targetAdmitsTestExecutionEvidence(targetAssetType: string): boolean {
  return targetAssetType === "test_execution_result_surface";
}

function declaredExecutionContract(input: string): boolean {
  const contract = input.trim().toLowerCase();
  return (
    contract.length > 0 &&
    contract !== "undeclared" &&
    contract !== "none" &&
    contract !== "n/a" &&
    contract !== "not_applicable"
  );
}

function productMaterializationRequiresTestExecutionEvidence(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return (
    manifest.edgeName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET &&
    manifest.targetAssetType === "component_code_surface" &&
    manifest.productMaterialization.required &&
    declaredExecutionContract(manifest.productMaterialization.testExecutionContract)
  );
}

function manifestAdmitsTestExecutionEvidence(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return (
    targetAdmitsTestExecutionEvidence(manifest.targetAssetType) ||
    productMaterializationRequiresTestExecutionEvidence(manifest)
  );
}

function targetIgnoresExecutionByproducts(targetAssetType: string): boolean {
  return (
    targetAssetType === "component_code_surface" ||
    targetAssetType === "component_test_surface" ||
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

function executionCommandMatchesContract(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly command: string;
}): boolean {
  if (
    input.command === input.manifest.productMaterialization.testExecutionContract
  ) {
    return true;
  }
  const shards = input.manifest.productMaterialization.executionShards;
  return shards.length === 1 && input.command === shards[0]?.command;
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

function productMaterializationForFeatureScope(input: {
  readonly materialization: SdlcProductMaterializationContract;
  readonly featureScope: SdlcWorkerHandoffManifest["featureScope"];
}): SdlcProductMaterializationContract {
  if (
    (input.featureScope.mode !== "steel_thread" &&
      input.featureScope.mode !== "targeted_repair") ||
    input.materialization.executionShards.length === 0 ||
    input.featureScope.includedModuleNames.length === 0
  ) {
    return input.materialization;
  }
  const includedModules = new Set(input.featureScope.includedModuleNames);
  return Object.freeze({
    ...input.materialization,
    executionShards: Object.freeze(
      input.materialization.executionShards.filter((shard) =>
        includedModules.has(shard.moduleName)
      )
    )
  });
}

function normalizeDeclaredProductFileTarget(input: {
  readonly value: string;
  readonly selectedOutputRoot: string;
}): Pick<SdlcProductMaterializationAuthorityTarget, "path" | "targetKind"> | null {
  const withoutComment = input.value.replace(/\s+#.*$/u, "");
  const trimmed = withoutComment
    .trim()
    .replace(/^[-*]\s+/u, "")
    .replace(/^["'`]+|["'`]+$/gu, "")
    .replace(/\\/gu, "/")
    .replace(/^workspace:\/\//u, "")
    .replace(/^\.\//u, "");
  const targetKind =
    trimmed.endsWith("/") || /\/(?:src|project)$/u.test(trimmed)
      ? "directory"
      : "file";
  const cleaned = withoutComment
    .trim()
    .replace(/^[-*]\s+/u, "")
    .replace(/^["'`]+|["'`]+$/gu, "")
    .replace(/\\/gu, "/")
    .replace(/^workspace:\/\//u, "")
    .replace(/^\.\//u, "")
    .replace(/\/+$/u, "");
  if (cleaned.length === 0) {
    return null;
  }
  const normalized = path.posix.normalize(cleaned).replace(/^\.\//u, "");
  if (
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith("../") ||
    isAbsolute(normalized)
  ) {
    return null;
  }
  if (
    normalized === input.selectedOutputRoot ||
    normalized.startsWith(`${input.selectedOutputRoot}/`)
  ) {
    return Object.freeze({
      path: normalized,
      targetKind
    });
  }
  return null;
}

function markdownSectionBodies(input: {
  readonly markdown: string;
  readonly titlePattern: RegExp;
}): readonly string[] {
  const lines = input.markdown.split(/\r?\n/u);
  const bodies: string[] = [];
  let activeDepth: number | null = null;
  let activeLines: string[] = [];
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/u.exec(line);
    if (heading !== null) {
      const marker = heading[1] ?? "";
      const headingTitle = heading[2] ?? "";
      const depth = marker.length;
      const title = headingTitle.trim();
      if (activeDepth !== null && depth <= activeDepth) {
        bodies.push(activeLines.join("\n"));
        activeDepth = null;
        activeLines = [];
      }
      if (activeDepth === null && input.titlePattern.test(title)) {
        activeDepth = depth;
        activeLines = [];
      }
      continue;
    }
    if (activeDepth !== null) {
      activeLines.push(line);
    }
  }
  if (activeDepth !== null) {
    bodies.push(activeLines.join("\n"));
  }
  return Object.freeze(bodies);
}

function targetsFromProductAuthoritySection(input: {
  readonly body: string;
  readonly selectedOutputRoot: string;
}): readonly Pick<SdlcProductMaterializationAuthorityTarget, "path" | "targetKind">[] {
  const targets = new Map<
    string,
    Pick<SdlcProductMaterializationAuthorityTarget, "path" | "targetKind">
  >();
  let fenced = false;
  let sectionTreeRoot: string | null = null;
  const addTarget = (candidate: string): void => {
    const directTarget = normalizeDeclaredProductFileTarget({
      value: candidate,
      selectedOutputRoot: input.selectedOutputRoot
    });
    if (directTarget?.path === input.selectedOutputRoot) {
      sectionTreeRoot = input.selectedOutputRoot;
      return;
    }
    if (directTarget !== null) {
      targets.set(directTarget.path, directTarget);
      return;
    }
    if (sectionTreeRoot === null) {
      return;
    }
    const relativeTarget = normalizeDeclaredProductFileTarget({
      value: `${sectionTreeRoot}/${candidate.trim()}`,
      selectedOutputRoot: input.selectedOutputRoot
    });
    if (
      relativeTarget !== null &&
      relativeTarget.path !== input.selectedOutputRoot
    ) {
      targets.set(relativeTarget.path, relativeTarget);
    }
  };

  for (const line of input.body.split(/\r?\n/u)) {
    if (/^\s*```/u.test(line)) {
      fenced = !fenced;
      continue;
    }
    for (const match of line.matchAll(/`([^`]+)`/gu)) {
      const codeSpan = match[1];
      if (codeSpan !== undefined) {
        addTarget(codeSpan);
      }
    }
    if (!fenced) {
      const bullet = /^\s*[-*]\s+(.+)$/u.exec(line);
      if (bullet !== null) {
        const bulletTarget = bullet[1];
        if (bulletTarget !== undefined) {
          addTarget(bulletTarget);
        }
      }
      continue;
    }
    addTarget(line);
  }
  return Object.freeze(
    [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
  );
}

function firstCodeSpan(input: string): string | null {
  const match = /`([^`]+)`/u.exec(input);
  return match?.[1]?.trim() ?? null;
}

function markdownTableCells(input: string): readonly string[] | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
    return null;
  }
  const cells = trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
  if (
    cells.length === 0 ||
    cells.every((cell) => /^:?-{3,}:?$/u.test(cell))
  ) {
    return null;
  }
  return Object.freeze(cells);
}

function productBuildToolFromMarkdown(product: string): string | null {
  for (const line of product.split(/\r?\n/u)) {
    const cells = markdownTableCells(line);
    if (cells === null || cells.length < 2) {
      const fieldMatch =
        /^\s*(?:[-*]\s*)?(?:\*\*)?Build Tool(?:\*\*)?\s*:\s*(.+?)\s*$/iu.exec(line);
      if (fieldMatch === null) {
        continue;
      }
      const value = firstCodeSpan(fieldMatch[1] ?? "") ?? fieldMatch[1] ?? "";
      const normalized = value.replace(/[*_`]/gu, "").trim();
      return normalized.length === 0 ? null : normalized;
    }
    {
      const field = cells[0]?.replace(/[*_`]/gu, "").trim().toLowerCase();
      if (field !== "build tool") {
        continue;
      }
      const value = firstCodeSpan(cells[1] ?? "") ?? cells[1] ?? "";
      const normalized = value.replace(/[*_`]/gu, "").trim();
      return normalized.length === 0 ? null : normalized;
    }
  }
  return null;
}

function moduleNameFromMarkdownLine(input: string): string | null {
  const codeSpan = firstCodeSpan(input);
  const candidate = codeSpan ??
    input
      .replace(/^[-*]\s+/u, "")
      .replace(/[*_`]/gu, "")
      .trim();
  if (
    candidate.length === 0 ||
    candidate.includes("/") ||
    /^module$/iu.test(candidate) ||
    !/^[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(candidate)
  ) {
    return null;
  }
  return candidate;
}

function targetsFromDeclaredModuleTargets(input: {
  readonly body: string;
  readonly selectedOutputRoot: string;
  readonly buildTool: string | null;
}): readonly Pick<SdlcProductMaterializationAuthorityTarget, "path" | "targetKind">[] {
  const targets = new Map<
    string,
    Pick<SdlcProductMaterializationAuthorityTarget, "path" | "targetKind">
  >();
  const addDirectory = (pathValue: string): void => {
    const normalized = normalizeDeclaredProductFileTarget({
      value: `${pathValue.replace(/\/+$/u, "")}/`,
      selectedOutputRoot: input.selectedOutputRoot
    });
    if (
      normalized !== null &&
      normalized.path !== input.selectedOutputRoot
    ) {
      targets.set(normalized.path, normalized);
    }
  };

  const normalizedBuildTool = input.buildTool?.toLowerCase() ?? "";
  if (/\bsbt\b/u.test(normalizedBuildTool)) {
    const buildFile = normalizeDeclaredProductFileTarget({
      value: `${input.selectedOutputRoot}/build.sbt`,
      selectedOutputRoot: input.selectedOutputRoot
    });
    if (buildFile !== null) {
      targets.set(buildFile.path, buildFile);
    }
    addDirectory(`${input.selectedOutputRoot}/project`);
  }

  for (const line of input.body.split(/\r?\n/u)) {
    const cells = markdownTableCells(line);
    if (cells !== null && cells.length >= 2) {
      const moduleName = moduleNameFromMarkdownLine(cells[0] ?? "");
      if (moduleName !== null) {
        addDirectory(`${input.selectedOutputRoot}/${moduleName}/src`);
      }
      continue;
    }
    if (!/^\s*[-*]\s+/u.test(line)) {
      continue;
    }
    const moduleName = moduleNameFromMarkdownLine(line);
    if (moduleName !== null) {
      addDirectory(`${input.selectedOutputRoot}/${moduleName}/src`);
    }
  }

  return Object.freeze(
    [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
  );
}

function productAuthorityTargetsFor(
  manifest: SdlcWorkerHandoffManifest
): {
  readonly targets: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly sourceRefs: readonly string[];
} {
  const productPath = join(manifest.workspaceRoot, "specification/PRODUCT.md");
  if (!existsSync(productPath)) {
    return Object.freeze({
      targets: Object.freeze([]),
      sourceRefs: Object.freeze([])
    });
  }
  const product = readFileSync(productPath, "utf8");
  const sections = markdownSectionBodies({
    markdown: product,
    titlePattern: /^(?:declared|expected)\s+product\s+files$/iu
  });
  const declaredModuleSections = markdownSectionBodies({
    markdown: product,
    titlePattern: /^(?:declared\s+module\s+targets|module\s+structure)$/iu
  });
  const sourceRef = pathToFileURL(productPath).href;
  const buildTool = productBuildToolFromMarkdown(product);
  const targets = targetContractsFromSeeds({
    source: "product_authority",
    sourceRef,
    seeds: [
      ...sections.flatMap((body) =>
        targetsFromProductAuthoritySection({
          body,
          selectedOutputRoot: manifest.productMaterialization.selectedOutputRoot
        })
      ),
      ...declaredModuleSections.flatMap((body) =>
        targetsFromDeclaredModuleTargets({
          body,
          selectedOutputRoot: manifest.productMaterialization.selectedOutputRoot,
          buildTool
        })
      )
    ]
  });
  return Object.freeze({
    targets,
    sourceRefs: Object.freeze([sourceRef])
  });
}

function contextExpectedFileTargetsFor(
  manifest: SdlcWorkerHandoffManifest
): {
  readonly targets: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly sourceRefs: readonly string[];
  readonly reasonRefs: readonly string[];
} {
  const contextRoot = join(manifest.workspaceRoot, ".ai-workspace/context");
  if (!existsSync(contextRoot)) {
    return Object.freeze({
      targets: Object.freeze([]),
      sourceRefs: Object.freeze([]),
      reasonRefs: Object.freeze([])
    });
  }
  const targets = new Map<string, SdlcProductMaterializationAuthorityTarget>();
  const sourceRefs = new Set<string>();
  const reasonRefs = new Set<string>();
  for (const entry of readdirSync(contextRoot, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }
    const filePath = join(contextRoot, entry.name);
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(filePath, "utf8"));
    } catch {
      reasonRefs.add(`context_expected_files_parse_failed:${entry.name}`);
      continue;
    }
    if (
      parsed === null ||
      typeof parsed !== "object" ||
      !("expectedFiles" in parsed) ||
      !Array.isArray(parsed.expectedFiles)
    ) {
      continue;
    }
    const sourceRef = pathToFileURL(filePath).href;
    sourceRefs.add(sourceRef);
    for (const value of parsed.expectedFiles) {
      if (typeof value !== "string" || value.trim().length === 0) {
        continue;
      }
      const normalized = normalizeDeclaredProductFileTarget({
        value,
        selectedOutputRoot: manifest.productMaterialization.selectedOutputRoot
      });
      if (
        normalized !== null &&
        normalized.path !== manifest.productMaterialization.selectedOutputRoot
      ) {
        targets.set(
          normalized.path,
          Object.freeze({
            kind: "sdlc_product_materialization_authority_target" as const,
            ...normalized,
            source: "context_expected_files" as const,
            sourceRef
          })
        );
      }
    }
  }
  return Object.freeze({
    targets: Object.freeze(
      [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
    ),
    sourceRefs: Object.freeze([...sourceRefs].sort()),
    reasonRefs: Object.freeze([...reasonRefs].sort())
  });
}

function targetContractsFromSeeds(input: {
  readonly source: SdlcProductMaterializationAuthorityTarget["source"];
  readonly sourceRef: string;
  readonly seeds: readonly Pick<SdlcProductMaterializationAuthorityTarget, "path" | "targetKind">[];
}): readonly SdlcProductMaterializationAuthorityTarget[] {
  const targets = new Map<string, SdlcProductMaterializationAuthorityTarget>();
  for (const seed of input.seeds) {
    targets.set(
      seed.path,
      Object.freeze({
        kind: "sdlc_product_materialization_authority_target" as const,
        ...seed,
        source: input.source,
        sourceRef: input.sourceRef
      })
    );
  }
  return Object.freeze(
    [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
  );
}

function mergedTargetContracts(
  contextTargets: readonly SdlcProductMaterializationAuthorityTarget[],
  productTargets: readonly SdlcProductMaterializationAuthorityTarget[]
): readonly SdlcProductMaterializationAuthorityTarget[] {
  const targets = new Map<string, SdlcProductMaterializationAuthorityTarget>();
  for (const target of contextTargets) {
    targets.set(target.path, target);
  }
  for (const target of productTargets) {
    targets.set(target.path, target);
  }
  return Object.freeze(
    [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
  );
}

function normalizedSelectedOutputRoot(input: string): string {
  return input.replace(/\\/gu, "/").replace(/\/+$/u, "");
}

function targetRelativeToSelectedOutputRoot(input: {
  readonly targetPath: string;
  readonly selectedOutputRoot: string;
}): string {
  const outputRoot = normalizedSelectedOutputRoot(input.selectedOutputRoot);
  const targetPath = input.targetPath.replace(/\\/gu, "/").replace(/\/+$/u, "");
  if (targetPath === outputRoot) {
    return "";
  }
  if (targetPath.startsWith(`${outputRoot}/`)) {
    return targetPath.slice(outputRoot.length + 1);
  }
  return targetPath;
}

function productAuthorityTargetIsSharedForFeatureScope(input: {
  readonly target: SdlcProductMaterializationAuthorityTarget;
  readonly selectedOutputRoot: string;
}): boolean {
  const relativeTarget = targetRelativeToSelectedOutputRoot({
    targetPath: input.target.path,
    selectedOutputRoot: input.selectedOutputRoot
  });
  return (
    relativeTarget === "" ||
    relativeTarget === "build.sbt" ||
    relativeTarget === "project" ||
    relativeTarget.startsWith("project/")
  );
}

function productAuthorityTargetMatchesIncludedModule(input: {
  readonly target: SdlcProductMaterializationAuthorityTarget;
  readonly selectedOutputRoot: string;
  readonly includedModuleNames: readonly string[];
}): boolean {
  const relativeTarget = targetRelativeToSelectedOutputRoot({
    targetPath: input.target.path,
    selectedOutputRoot: input.selectedOutputRoot
  });
  const parts = relativeTarget.split("/").filter((part) => part.length > 0);
  return input.includedModuleNames.some((moduleName) =>
    parts.includes(moduleName)
  );
}

function scopeProductMaterializationAuthorityTargets(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly targets: readonly SdlcProductMaterializationAuthorityTarget[];
}): readonly SdlcProductMaterializationAuthorityTarget[] {
  if (
    (input.manifest.featureScope.mode !== "steel_thread" &&
      input.manifest.featureScope.mode !== "targeted_repair") ||
    input.manifest.featureScope.includedModuleNames.length === 0 ||
    !input.manifest.productMaterialization.required
  ) {
    return input.targets;
  }
  return Object.freeze(
    input.targets.filter(
      (target) =>
        productAuthorityTargetIsSharedForFeatureScope({
          target,
          selectedOutputRoot:
            input.manifest.productMaterialization.selectedOutputRoot
        }) ||
        productAuthorityTargetMatchesIncludedModule({
          target,
          selectedOutputRoot:
            input.manifest.productMaterialization.selectedOutputRoot,
          includedModuleNames: input.manifest.featureScope.includedModuleNames
        })
    )
  );
}

function sameTargetSet(
  left: readonly string[],
  right: readonly string[]
): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

export function reconcileSdlcProductMaterializationAuthority(
  manifest: SdlcWorkerHandoffManifest
): SdlcProductMaterializationAuthorityReconciliation {
  const context = contextExpectedFileTargetsFor(manifest);
  const product = productAuthorityTargetsFor(manifest);
  const contextTargets = scopeProductMaterializationAuthorityTargets({
    manifest,
    targets: context.targets
  });
  const productTargets = scopeProductMaterializationAuthorityTargets({
    manifest,
    targets: product.targets
  });
  const contextTargetPaths = uniqueSorted(contextTargets.map((target) => target.path));
  const productTargetPaths = uniqueSorted(productTargets.map((target) => target.path));
  const declaredProductTargetContracts = mergedTargetContracts(
    contextTargets,
    productTargets
  );
  const declaredProductFileTargets = uniqueSorted([
    ...contextTargetPaths,
    ...productTargetPaths
  ]);
  const reasonRefs = new Set<string>(context.reasonRefs);
  if (
    contextTargets.length !== context.targets.length ||
    productTargets.length !== product.targets.length
  ) {
    reasonRefs.add(
      `product_targets_scoped_by_feature_scope:${manifest.featureScope.includedModuleNames.join(",")}`
    );
  }
  if (
    contextTargetPaths.length > 0 &&
    productTargetPaths.length > 0 &&
    !sameTargetSet(contextTargetPaths, productTargetPaths)
  ) {
    reasonRefs.add("product_context_target_mismatch");
  }
  if (
    manifest.productMaterialization.required &&
    declaredProductFileTargets.length === 0
  ) {
    reasonRefs.add("declared_product_file_targets_missing");
  }
  return Object.freeze({
    kind: "sdlc_product_materialization_authority_reconciliation",
    status: !manifest.productMaterialization.required
      ? "not_required"
      : reasonRefs.has("product_context_target_mismatch")
        ? "ambiguous"
      : declaredProductFileTargets.length > 0
        ? "passed"
        : "missing",
    selectedOutputRoot: manifest.productMaterialization.selectedOutputRoot,
    contextExpectedFileTargets: contextTargetPaths,
    productAuthorityTargets: productTargetPaths,
    declaredProductFileTargets,
    contextExpectedTargetContracts: contextTargets,
    productAuthorityTargetContracts: productTargets,
    declaredProductTargetContracts,
    sourceRefs: uniqueSorted([...context.sourceRefs, ...product.sourceRefs]),
    reasonRefs: Object.freeze([...reasonRefs].sort())
  });
}

export function declaredProductFileTargets(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return reconcileSdlcProductMaterializationAuthority(manifest)
    .declaredProductFileTargets;
}

function featureScopeNarrowsMaterialization(
  manifest: Pick<
    SdlcWorkerHandoffManifest,
    "featureScope" | "productMaterialization"
  >
): boolean {
  return (
    manifest.productMaterialization.required &&
    (manifest.featureScope.mode === "steel_thread" ||
      manifest.featureScope.mode === "targeted_repair") &&
    manifest.featureScope.includedModuleNames.length > 0
  );
}

function scopedMaterializationWriteRoots(
  manifest: SdlcWorkerHandoffManifest,
  fallbackRoots: readonly string[]
): readonly string[] {
  if (!featureScopeNarrowsMaterialization(manifest)) {
    return fallbackRoots;
  }
  const authority = reconcileSdlcProductMaterializationAuthority(manifest);
  const roots = new Set<string>([
    manifest.archiveRoot,
    dirname(manifest.outputFile),
    join(manifest.productMaterialization.tenantRoot, "build.sbt"),
    join(manifest.productMaterialization.tenantRoot, "project")
  ]);
  for (const target of authority.declaredProductTargetContracts) {
    const absoluteTarget = resolve(manifest.workspaceRoot, target.path);
    roots.add(target.targetKind === "directory" ? absoluteTarget : absoluteTarget);
  }
  return Object.freeze([...roots].sort());
}

function materializationFileTargetRoots(
  manifest: SdlcWorkerHandoffManifest
): ReadonlySet<string> {
  if (!manifest.productMaterialization.required) {
    return new Set<string>();
  }
  const roots = new Set(
    reconcileSdlcProductMaterializationAuthority(manifest)
      .declaredProductTargetContracts
      .filter((target) => target.targetKind === "file")
      .map((target) => resolve(manifest.workspaceRoot, target.path))
  );
  roots.add(resolve(join(manifest.productMaterialization.tenantRoot, "build.sbt")));
  return roots;
}

function directoryToPrepareForWriteRoot(
  writeRoot: string,
  fileTargetRoots: ReadonlySet<string>
): string {
  const resolved = resolve(writeRoot);
  if (fileTargetRoots.has(resolved)) {
    return dirname(writeRoot);
  }
  if (existsSync(resolved) && statSync(resolved).isFile()) {
    return dirname(writeRoot);
  }
  return writeRoot;
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
    targetAdmitsTestExecutionEvidence(input.contract.targetAssetType) ||
    (input.contract.edgeName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET &&
      input.contract.targetAssetType === "component_code_surface" &&
      input.materialization.required &&
      declaredExecutionContract(input.materialization.testExecutionContract))
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

function scopeTrancheKeys(input: {
  readonly trancheKeys: readonly string[];
  readonly featureScope: SdlcWorkerHandoffManifest["featureScope"];
}): readonly string[] {
  if (input.featureScope.mode === "full_breadth") {
    return input.trancheKeys;
  }
  return Object.freeze(
    input.trancheKeys.filter((key) => {
      if (!key.startsWith("module:")) {
        return true;
      }
      return input.featureScope.includedModuleNames.includes(
        key.slice("module:".length)
      );
    })
  );
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

function scopedAuthorityRefsForFeatureScope(input: {
  readonly authorityRefs: readonly string[];
  readonly obligations: readonly SdlcTraversalObligation[];
  readonly featureScope: SdlcWorkerHandoffManifest["featureScope"];
}): readonly string[] {
  if (input.featureScope.mode === "full_breadth") {
    return input.authorityRefs;
  }
  const usedRefs = new Set<string>();
  for (const obligation of input.obligations) {
    for (const ref of obligation.evidenceRefs) {
      usedRefs.add(ref);
    }
    for (const ref of obligation.payload.sourceRefs) {
      usedRefs.add(ref);
    }
  }
  return Object.freeze(
    input.authorityRefs.filter(
      (ref) =>
        !ref.includes("/specification/requirements/") ||
        ref.endsWith("/specification/requirements/00-imported-sources.md") ||
        usedRefs.has(ref)
    )
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

function retryContextScopeRefs(
  retryContext: SdlcWorkerRetryContext
): readonly string[] {
  return uniqueSorted(
    [
      ...retryContext.retryAttemptRefs.flatMap((attempt) => [
        attempt.sourceProjectionRef,
        attempt.priorAuthorityRef
      ]),
      ...retryContext.priorGapDossiers.flatMap((dossier) => [
        dossier.currentGapDossierRef,
        dossier.edgeName,
        dossier.targetAssetType,
        ...dossier.reasons.flatMap((reason) => [
          reason.reason,
          reason.blockingReason.detail ?? ""
        ])
      ])
    ]
  );
}

function decodedScopeRef(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

function refContainsDeclaredModule(input: {
  readonly ref: string;
  readonly moduleName: string;
}): boolean {
  const decoded = decodedScopeRef(input.ref);
  const moduleName = input.moduleName.trim();
  return (
    decoded === moduleName ||
    decoded.includes(`/${moduleName}`) ||
    decoded.includes(`${moduleName}/`) ||
    decoded.includes(`:${moduleName}`) ||
    decoded.includes(`${moduleName}:`) ||
    decoded.includes(`=${moduleName}`) ||
    decoded.includes(`${moduleName}?`) ||
    decoded.includes(`${moduleName}#`)
  );
}

function retryContextScopedScheduleRefs(input: {
  readonly retryContext: SdlcWorkerRetryContext;
  readonly declaredModuleNames: readonly string[];
}): readonly string[] {
  const scopeRefs = retryContextScopeRefs(input.retryContext);
  if (input.declaredModuleNames.length === 0) {
    return scopeRefs;
  }
  return uniqueSorted(
    scopeRefs.filter((ref) =>
      input.declaredModuleNames.some((moduleName) =>
        refContainsDeclaredModule({ ref, moduleName })
      )
    )
  );
}

function traversalEnvelopeForcesFullBreadth(
  envelope: SdlcWorkerHandoffManifest["traversalAttemptEnvelope"] | null
): boolean {
  return /(?:full[-_]?breadth|broad[-_]?induction|complete[-_]?breadth)/iu.test(
    envelope?.strategyDirectiveRef ?? ""
  );
}

function priorWorkerResultReportRefsForSourceAsset(input: {
  readonly workspaceRoot: string;
  readonly assetType: string;
}): readonly string[] {
  const operatorRunsRoot = join(
    input.workspaceRoot,
    deriveSdlcConformProjectProfileFromWorkspace(input.workspaceRoot).runtimeLayout
      .operatorRunRoot
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
  readonly featureScope: SdlcWorkerHandoffManifest["featureScope"];
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
  const scopedObligations = Object.freeze(
    obligations.filter((obligation) =>
      sdlcTraversalObligationInFeatureScope({
        featureScope: input.featureScope,
        obligation
      })
    )
  );
  const scopedAuthorityRefs = scopedAuthorityRefsForFeatureScope({
    authorityRefs,
    obligations: scopedObligations,
    featureScope: input.featureScope
  });
  const requirementCount = scopedObligations.filter(
    (obligation) => obligation.obligationKind === "requirement"
  ).length;
  const authorityIndex = authorityIndexFor(scopedAuthorityRefs);
  const trancheKeys = scopeTrancheKeys({
    trancheKeys: trancheKeysFor({
      contract: input.contract,
      materialization: input.materialization
    }),
    featureScope: input.featureScope
  });
  const retrievalHints = retrievalHintsFor({
    authorityIndex,
    obligations: scopedObligations,
    trancheKeys
  });
  return Object.freeze({
    kind: "sdlc_traversal_obligation_context" as const,
    requiredSourceAssetTypes: Object.freeze([...input.contract.sourceAssetTypes]),
    targetAssetType: input.contract.targetAssetType,
    obligations: scopedObligations,
    authorityRefs: scopedAuthorityRefs,
    authorityIndex,
    trancheKeys,
    retrievalHints,
    runtimeContextRefs,
    priorEdgeRefs,
    deltaSummary: Object.freeze({
      kind: "sdlc_traversal_obligation_delta_summary" as const,
      obligationCount: scopedObligations.length,
      requirementCount,
      priorGapCount,
      authorityRefCount: scopedAuthorityRefs.length
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
  readonly traversalStrategyDecision: SdlcTraversalStrategyDecision;
  readonly featureScope: SdlcWorkerHandoffManifest["featureScope"];
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
    traversalStrategyDecision: input.traversalStrategyDecision,
    featureScope: input.featureScope,
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
  if (
    JSON.stringify(pkg.traversalStrategyDecision) !==
    JSON.stringify(manifest.traversalStrategyDecision)
  ) {
    throw new TypeError("traversal intent package strategy decision drift");
  }
  if (
    JSON.stringify(pkg.featureScope) !== JSON.stringify(manifest.featureScope)
  ) {
    throw new TypeError("traversal intent package feature scope drift");
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
  readonly fpTransformRequest?: FpTransformRequest | null | undefined;
  readonly traversalAttemptEnvelope?:
    | SdlcWorkerHandoffManifest["traversalAttemptEnvelope"]
    | undefined;
  readonly conformedProject?: SdlcConformProjectProfile | undefined;
  readonly retryContext?: SdlcWorkerRetryContext | undefined;
  readonly projectConstraints?: Pick<
    SdlcProjectConstraints,
    "activeTenant" | "selectedOutputRoot"
  > | undefined;
  readonly runId?: string;
}): SdlcWorkerHandoffManifest {
  const runId = input.runId ?? operatorRunId();
  const conformedProject =
    normalizeConformedProjectRuntimeLayout(input.conformedProject) ??
    deriveSdlcConformProjectProfileFromWorkspace(input.workspaceRoot);
  const archiveRoot = join(
    input.workspaceRoot,
    conformedProject.runtimeLayout.operatorRunRoot,
    runId
  );
  const outputRoot = join(
    input.workspaceRoot,
    conformedProject.runtimeLayout.transformAssetRoot,
    runId
  );
  const baseMaterialization = productMaterializationContract({
    workspaceRoot: input.workspaceRoot,
    archiveRoot,
    targetAssetType: input.contract.targetAssetType,
    conformedProject,
    projectConstraints: input.projectConstraints
  });
  const retryContext = input.retryContext ?? emptyRetryContext();
  const methodRefs = Object.freeze([
    "workspace://.abiogenesis/docs/standards/SPEC_METHOD.md",
    "workspace://.abiogenesis/docs/standards/TICKET_METHOD.md",
    "workspace://.abiogenesis/docs/standards/DESIGN_MODULE_METHOD.md",
    "workspace://.abiogenesis/docs/standards/ODD_METHOD.md"
  ]);
  const resultReportSchema = REPORT_FIELDS;
  const reportFile = join(archiveRoot, "worker_result_report.json");
  const fpTransformRequestFile = join(archiveRoot, "fp_transform_request.json");
  const fpTransformResultFile = join(archiveRoot, "fp_transform_result.json");
  const fpEvaluateResultFile = join(archiveRoot, "fp_evaluate_result.json");
  const traversalAttemptEnvelope = input.traversalAttemptEnvelope ?? null;
  const retrySelectedScheduleItemRefs = retryContextScopedScheduleRefs({
    retryContext,
    declaredModuleNames: baseMaterialization.declaredModuleNames
  });
  const selectedScheduleItemRefs =
    retrySelectedScheduleItemRefs.length > 0 &&
    !traversalEnvelopeForcesFullBreadth(traversalAttemptEnvelope)
      ? retrySelectedScheduleItemRefs
      : traversalAttemptEnvelope?.selectedScheduleItemRefs ??
        defaultSdlcTraversalScopeRefsForName(input.edgeName);
  const traversalStrategyDecision = deriveSdlcTraversalStrategyDecision({
    edgeName: input.edgeName,
    targetAssetType: input.contract.targetAssetType,
    strategyDirectiveRef: traversalAttemptEnvelope?.strategyDirectiveRef ?? null,
    selectedScheduleItemRefs,
    requiredProgressArtifactRefs:
      traversalAttemptEnvelope?.requiredProgressArtifactRefs ?? Object.freeze([]),
    retryContext
  });
  const featureScope = deriveSdlcFeatureScope({
    targetAssetType: input.contract.targetAssetType,
    selectedStrategy: traversalStrategyDecision.selectedStrategy,
    strategyDirectiveRef: traversalAttemptEnvelope?.strategyDirectiveRef ?? null,
    selectedScheduleItemRefs,
    requiredProgressArtifactRefs:
      traversalAttemptEnvelope?.requiredProgressArtifactRefs ?? Object.freeze([]),
    declaredModuleNames: baseMaterialization.declaredModuleNames,
    materializedEntityIds: Object.freeze([]),
    materializedOperationIds: Object.freeze([])
  });
  const materialization = productMaterializationForFeatureScope({
    materialization: baseMaterialization,
    featureScope
  });
  const outputFile = deriveOutputFileForTarget({
    defaultOutputRoot: outputRoot,
    targetAssetType: input.contract.targetAssetType,
    materialization
  });
  const outputFileIsTenantLocal = pathIsInside(
    resolve(outputFile),
    resolve(materialization.tenantRoot)
  );
  const baseAllowedWriteRoots = materialization.required || outputFileIsTenantLocal
    ? Object.freeze([outputRoot, archiveRoot, materialization.tenantRoot])
    : input.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY
      ? Object.freeze([
          outputRoot,
          archiveRoot,
          join(input.workspaceRoot, ".ai-workspace", "context"),
          join(input.workspaceRoot, "specification")
        ])
      : Object.freeze([outputRoot, archiveRoot]);
  const traversalObligationContext = deriveTraversalObligationContext({
    workspaceRoot: input.workspaceRoot,
    contract: input.contract,
    materialization,
    featureScope,
    retryContext
  });
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
    traversalStrategyDecision,
    featureScope,
    obligationContext: traversalObligationContext,
    retryContext
  });
  const manifest = Object.freeze({
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
    fpTransformRequest: input.fpTransformRequest ?? null,
    fpTransformRequestFile,
    fpTransformResultFile,
    fpEvaluateResultFile,
    allowedWriteRoots: baseAllowedWriteRoots,
    conformedProject,
    productMaterialization: materialization,
    traversalStrategyDecision,
    featureScope,
    traversalObligationContext,
    traversalIntentPackage,
    traversalAttemptEnvelope,
    retryContext,
    methodRefs,
    resultReportSchema
  });
  return Object.freeze({
    ...manifest,
    allowedWriteRoots: scopedMaterializationWriteRoots(
      manifest,
      baseAllowedWriteRoots
    )
  });
}

function normalizeConformedProjectRuntimeLayout(
  project: SdlcConformProjectProfile | undefined
): SdlcConformProjectProfile | undefined {
  if (project === undefined) {
    return undefined;
  }
  if ("runtimeLayout" in project && project.runtimeLayout !== undefined) {
    return project;
  }
  return Object.freeze({
    ...project,
    runtimeLayout: standardSdlcRuntimeLayout()
  });
}

function listForPrompt(values: readonly string[]): string {
  return values.length === 0 ? "(none declared)" : values.join(", ");
}

function textIfFile(filePath: string): string | null {
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return null;
  }
  return readFileSync(filePath, "utf8");
}

function compactObligation(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  obligation: SdlcTraversalObligation
): SdlcWorkerInvocationObligation {
  return Object.freeze({
    kind: "sdlc_worker_invocation_obligation" as const,
    obligationId: obligation.obligationId,
    obligationKind: obligation.obligationKind,
    summary: compactPromptText(obligation.summary, 180),
    evidenceRefs: workerFacingRefs(manifest, obligation.evidenceRefs.slice(0, 1)),
    sourceRefs: workerFacingRefs(manifest, obligation.payload.sourceRefs.slice(0, 1)),
    sourceSnippetCount: obligation.payload.sourceSnippets.length,
    coverageExpectation: compactPromptText(
      obligation.payload.coverageExpectation,
      120
    )
  });
}

function compactPromptText(input: string, maxLength: number): string {
  const normalized = input.replace(/\s+/gu, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
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

function requirementTraceObligationIdsForPrompt(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return Object.freeze(
    manifest.traversalObligationContext.obligations
      .filter((obligation) => obligation.obligationKind === "requirement")
      .map((obligation) => obligation.obligationId)
  );
}

function compactRetrievalHints(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  hints: readonly SdlcRetrievalHint[]
): readonly SdlcRetrievalHint[] {
  return Object.freeze(
    hints.slice(0, 12).map((hint) =>
      Object.freeze({
        kind: "sdlc_retrieval_hint" as const,
        key: hint.key,
        ref: workerFacingRef(manifest, hint.ref),
        reason: hint.reason,
        obligationIds: hint.obligationIds.slice(0, 12)
      })
    )
  );
}

function retryRepairScopeForReason(
  reason: string,
  reasonClass: SdlcPostflightGapReason["reasonClass"]
): SdlcWorkerRetryRepairScope {
  if (
    reason.includes("_register_invalid:") ||
    reason.includes("_register_missing") ||
    reason.startsWith("test_execution_evidence_invalid") ||
    reason.startsWith("test_execution_evidence_missing")
  ) {
    return "schema_local";
  }
  if (
    reasonClass === "assurance" ||
    reasonClass === "topology" ||
    reasonClass === "authority_to_code" ||
    reasonClass === "code_to_test"
  ) {
    return "semantic_local";
  }
  return "broad_regeneration";
}

function componentDepthFieldSetForTarget(
  targetAssetType: string
): readonly string[] {
  if (targetAssetType === "implementation_component_topology_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "componentTopologyRows[].kind",
      "componentTopologyRows[].componentId",
      "componentTopologyRows[].moduleName",
      "componentTopologyRows[].relativePath",
      "componentTopologyRows[].publicBoundary",
      "componentTopologyRows[].concernRole",
      "componentTopologyRows[].requirementIds",
      "componentTopologyRows[].sourceAssetRefs"
    ]);
  }
  if (
    targetAssetType === "component_realization_schedule_surface" ||
    targetAssetType === "component_code_surface" ||
    targetAssetType === "component_realization_qualification_surface"
  ) {
    return Object.freeze([
      "kind=sdlc_component_depth_register",
      "registerVersion=ts-component-depth-v1",
      `targetAssetType=${targetAssetType}`,
      "componentRealizationRows[].kind=sdlc_component_realization_row",
      "componentRealizationRows[].componentId",
      "componentRealizationRows[].moduleName",
      "componentRealizationRows[].relativePath",
      "componentRealizationRows[].publicBoundary",
      "componentRealizationRows[].requirementIds",
      "componentRealizationRows[].sourceAssetRefs"
    ]);
  }
  if (targetAssetType === "test_component_topology_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "testComponentTopologyRows[].kind",
      "testComponentTopologyRows[].testClassId",
      "testComponentTopologyRows[].relativePath",
      "testComponentTopologyRows[].testcaseIds",
      "testComponentTopologyRows[].componentIds",
      "testComponentTopologyRows[].requirementIds",
      "testComponentTopologyRows[].shardId"
    ]);
  }
  if (targetAssetType === "component_test_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "componentTestRows[].kind",
      "componentTestRows[].testClassId",
      "componentTestRows[].relativePath",
      "componentTestRows[].testcaseIds",
      "componentTestRows[].componentIds",
      "componentTestRows[].requirementIds",
      "componentTestRows[].shardId"
    ]);
  }
  if (targetAssetType === "component_test_qualification_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "componentTestQualificationRows[].kind",
      "componentTestQualificationRows[].testClassId",
      "componentTestQualificationRows[].testcaseIds",
      "componentTestQualificationRows[].componentIds",
      "componentTestQualificationRows[].requirementIds",
      "componentTestQualificationRows[].status",
      "componentTestQualificationRows[].evidenceRefs"
    ]);
  }
  if (targetAssetType === "component_repair_schedule_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "componentRepairSchedule.kind",
      "componentRepairSchedule.registerVersion",
      "componentRepairSchedule.scheduleStatus",
      "componentRepairSchedule.repairRows",
      "componentRepairSchedule.evidenceRefs",
      "componentRepairSchedule.repairRows[].kind",
      "componentRepairSchedule.repairRows[].scheduleId",
      "componentRepairSchedule.repairRows[].failureId",
      "componentRepairSchedule.repairRows[].repairTarget",
      "componentRepairSchedule.repairRows[].lawfulReentryPoint",
      "componentRepairSchedule.repairRows[].attributionConfidence",
      "componentRepairSchedule.repairRows[].testcaseIds",
      "componentRepairSchedule.repairRows[].componentIds",
      "componentRepairSchedule.repairRows[].requirementIds",
      "componentRepairSchedule.repairRows[].sourceRefs",
      "componentRepairSchedule.repairRows[].testRefs",
      "componentRepairSchedule.repairRows[].evidenceRefs"
    ]);
  }
  if (targetAssetType === "release_depth_parity_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "releaseDepthParity.kind",
      "releaseDepthParity.status",
      "releaseDepthParity.evidenceRefs"
    ]);
  }
  return Object.freeze(["kind", "registerVersion", "targetAssetType"]);
}

function designDepthFieldSetForTarget(targetAssetType: string): readonly string[] {
  if (targetAssetType === "implementation_module_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "moduleSchemaFragments[].kind",
      "moduleSchemaFragments[].moduleName",
      "moduleSchemaFragments[].entities[].kind",
      "moduleSchemaFragments[].entities[].entityId",
      "moduleSchemaFragments[].entities[].moduleName",
      "moduleSchemaFragments[].entities[].ownership",
      "moduleSchemaFragments[].entities[].attributes[].kind",
      "moduleSchemaFragments[].entities[].attributes[].attributeId",
      "moduleSchemaFragments[].entities[].attributes[].name",
      "moduleSchemaFragments[].entities[].attributes[].valueType",
      "moduleSchemaFragments[].entities[].attributes[].cardinality",
      "moduleSchemaFragments[].entities[].attributes[].invariantRefs",
      "moduleSchemaFragments[].entities[].invariants",
      "moduleSchemaFragments[].entities[].sourceAssetRefs",
      "moduleSchemaFragments[].operations[].kind",
      "moduleSchemaFragments[].operations[].operationId",
      "moduleSchemaFragments[].operations[].moduleName",
      "moduleSchemaFragments[].operations[].inputEntityIds",
      "moduleSchemaFragments[].operations[].outputEntityIds",
      "moduleSchemaFragments[].operations[].requiredAttributeIds",
      "moduleSchemaFragments[].requirementIds",
      "moduleSchemaFragments[].sourceAssetRefs",
      "moduleStateDiagramFragments[].kind",
      "moduleStateDiagramFragments[].moduleName",
      "moduleStateDiagramFragments[].entityId",
      "moduleStateDiagramFragments[].stateless",
      "moduleStateDiagramFragments[].states",
      "moduleStateDiagramFragments[].transitions[].kind",
      "moduleStateDiagramFragments[].transitions[].transitionId",
      "moduleStateDiagramFragments[].transitions[].fromState",
      "moduleStateDiagramFragments[].transitions[].toState",
      "moduleStateDiagramFragments[].transitions[].operationId",
      "moduleStateDiagramFragments[].transitions[].entityId",
      "moduleStateDiagramFragments[].requirementIds",
      "moduleStateDiagramFragments[].sourceAssetRefs"
    ]);
  }
  if (targetAssetType === "aggregate_domain_model_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "aggregateDomainModel.kind",
      "aggregateDomainModel.entities",
      "aggregateDomainModel.operations",
      "aggregateDomainModel.crossModuleReferences",
      "designCompletenessVerdict.entity",
      "designCompletenessVerdict.attribute",
      "designCompletenessVerdict.flow"
    ]);
  }
  if (targetAssetType === "aggregate_sunny_day_sequence_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "aggregateDomainModel",
      "aggregateSunnyDaySequence.steps",
      "designCompletenessVerdict.entity",
      "designCompletenessVerdict.attribute",
      "designCompletenessVerdict.flow"
    ]);
  }
  return Object.freeze(["kind", "registerVersion", "targetAssetType"]);
}

function acceptedCarrierSchemaForReason(input: {
  readonly reason: string;
  readonly targetAssetType: string;
}): { readonly schemaRef: string; readonly fieldSet: readonly string[] } | null {
  if (
    input.reason.startsWith("component_depth_register_invalid:") ||
    input.reason === "component_depth_register_missing" ||
    input.reason.startsWith("component_repair_schedule_") ||
    input.reason.startsWith("component_repair_row_open:")
  ) {
    return Object.freeze({
      schemaRef: "schema://odd_sdlc/component_depth_register",
      fieldSet: componentDepthFieldSetForTarget(input.targetAssetType)
    });
  }
  if (
    input.reason.startsWith("design_depth_register_invalid:") ||
    input.reason === "design_depth_register_missing" ||
    input.reason.startsWith("design_attribute_missing:") ||
    input.reason.startsWith("design_operation_required_attributes_missing:")
  ) {
    return Object.freeze({
      schemaRef: "schema://odd_sdlc/design_depth_register",
      fieldSet: designDepthFieldSetForTarget(input.targetAssetType)
    });
  }
  if (
    input.reason.startsWith("test_execution_evidence_invalid") ||
    input.reason.startsWith("test_execution_evidence_missing")
  ) {
    return Object.freeze({
      schemaRef: "schema://odd_sdlc/test_execution_evidence",
      fieldSet: Object.freeze([
        "kind",
        "lane",
        "command",
        "status",
        "reportRefs",
        "testsObserved",
        "passedCount",
        "failedCount",
        "shardEvidence[].kind",
        "shardEvidence[].shardId",
        "shardEvidence[].moduleName",
        "shardEvidence[].lane",
        "shardEvidence[].command",
        "shardEvidence[].status",
        "shardEvidence[].reportRefs",
        "shardEvidence[].testsObserved",
        "shardEvidence[].passedCount",
        "shardEvidence[].failedCount"
      ])
    });
  }
  return null;
}

function repairReentryTargetForRepairTarget(
  repairTarget: SdlcComponentRepairScheduleRow["repairTarget"]
): { readonly targetEdgeName: string; readonly targetAssetType: string } | null {
  if (repairTarget === "component_test") {
    return Object.freeze({
      targetEdgeName: "derive_component_test_surface",
      targetAssetType: "component_test_surface"
    });
  }
  if (repairTarget === "component_code") {
    return Object.freeze({
      targetEdgeName: "derive_component_code_surface",
      targetAssetType: "component_code_surface"
    });
  }
  if (repairTarget === "test_schedule") {
    return Object.freeze({
      targetEdgeName: "derive_test_schedule_surface",
      targetAssetType: "test_schedule_surface"
    });
  }
  if (repairTarget === "test_execution_surface") {
    return Object.freeze({
      targetEdgeName: "prepare_test_execution_surface",
      targetAssetType: "test_execution_surface"
    });
  }
  return null;
}

function filePathForEvidenceRef(input: {
  readonly workspaceRoot: string;
  readonly ref: string;
}): string | null {
  try {
    const parsed = new URL(input.ref);
    if (parsed.protocol === "file:") {
      return fileURLToPath(parsed);
    }
    if (parsed.protocol === "workspace:") {
      return join(input.workspaceRoot, parsed.pathname.replace(/^\/+/, ""));
    }
  } catch {
    if (isAbsolute(input.ref)) {
      return input.ref;
    }
  }
  return null;
}

function existingEvidencePaths(input: {
  readonly workspaceRoot: string;
  readonly refs: readonly string[];
}): readonly string[] {
  return uniqueSorted(
    input.refs.flatMap((ref) => {
      const filePath = filePathForEvidenceRef({
        workspaceRoot: input.workspaceRoot,
        ref
      });
      return filePath !== null && existsSync(filePath) && statSync(filePath).isFile()
        ? [filePath]
        : [];
    })
  );
}

function recentRuntimeAssetPaths(input: {
  readonly workspaceRoot: string;
  readonly targetAssetTypes: readonly string[];
  readonly limit: number;
}): readonly string[] {
  const assetsRoot = join(
    input.workspaceRoot,
    deriveSdlcConformProjectProfileFromWorkspace(input.workspaceRoot).runtimeLayout
      .transformAssetRoot
  );
  if (!existsSync(assetsRoot) || !statSync(assetsRoot).isDirectory()) {
    return Object.freeze([]);
  }
  const candidates: { readonly filePath: string; readonly mtimeMs: number }[] = [];
  for (const runId of readdirSync(assetsRoot)) {
    const runRoot = join(assetsRoot, runId);
    if (!existsSync(runRoot) || !statSync(runRoot).isDirectory()) {
      continue;
    }
    for (const targetAssetType of input.targetAssetTypes) {
      const filePath = join(runRoot, `${targetAssetType}.md`);
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        candidates.push(Object.freeze({
          filePath,
          mtimeMs: statSync(filePath).mtimeMs
        }));
      }
    }
  }
  return Object.freeze(
    candidates
      .sort((left, right) => right.mtimeMs - left.mtimeMs)
      .slice(0, input.limit)
      .map((candidate) => candidate.filePath)
  );
}

function componentRepairRowsFromArtifact(input: {
  readonly outputFile: string;
  readonly preferredTargetAssetType: string;
}): readonly SdlcComponentRepairScheduleRow[] {
  const targetAssetTypes = uniqueSorted([
    input.preferredTargetAssetType,
    "component_repair_schedule_surface",
    "release_depth_parity_surface"
  ]);
  for (const targetAssetType of targetAssetTypes) {
    const admission = admitComponentDepthRegisterFromArtifact({
      targetAssetType,
      outputFile: input.outputFile
    });
    if (
      admission.status === "admitted" &&
      admission.register !== null &&
      admission.register.componentRepairSchedule !== null
    ) {
      return admission.register.componentRepairSchedule.repairRows;
    }
  }
  return Object.freeze([]);
}

function componentRepairRowsForFailure(input: {
  readonly workspaceRoot: string;
  readonly preferredTargetAssetType: string;
  readonly failureId: string;
  readonly evidenceRefs: readonly string[];
}): readonly SdlcComponentRepairScheduleRow[] {
  const paths = uniqueSorted([
    ...existingEvidencePaths({
      workspaceRoot: input.workspaceRoot,
      refs: input.evidenceRefs
    }),
    ...recentRuntimeAssetPaths({
      workspaceRoot: input.workspaceRoot,
      targetAssetTypes: Object.freeze([
        "component_repair_schedule_surface",
        "release_depth_parity_surface"
      ]),
      limit: 8
    })
  ]);
  return Object.freeze(
    paths.flatMap((outputFile) =>
      componentRepairRowsFromArtifact({
        outputFile,
        preferredTargetAssetType: input.preferredTargetAssetType
      }).filter((row) => row.failureId === input.failureId)
    )
  );
}

function diagnosticNeedlesForRepairRow(
  row: SdlcComponentRepairScheduleRow
): readonly string[] {
  return uniqueSorted([
    row.failureId,
    ...row.testRefs.map((ref) => path.basename(ref)),
    ...row.sourceRefs.map((ref) => path.basename(ref)),
    "[error]",
    "type mismatch",
    "Cannot prove",
    "test_compile_failed",
    "blockerDetail"
  ]).filter((needle) => needle.length > 0);
}

function diagnosticEvidenceForRepairRow(input: {
  readonly workspaceRoot: string;
  readonly row: SdlcComponentRepairScheduleRow;
  readonly evidenceRefs: readonly string[];
}): { readonly evidenceRefs: readonly string[]; readonly excerpt: string } {
  const paths = uniqueSorted([
    ...existingEvidencePaths({
      workspaceRoot: input.workspaceRoot,
      refs: uniqueSorted([...input.evidenceRefs, ...input.row.evidenceRefs])
    }),
    ...recentRuntimeAssetPaths({
      workspaceRoot: input.workspaceRoot,
      targetAssetTypes: Object.freeze(["test_execution_result_surface"]),
      limit: 6
    })
  ]);
  const needles = diagnosticNeedlesForRepairRow(input.row).map((needle) =>
    needle.toLowerCase()
  );
  const selectedLines: string[] = [];
  const evidenceRefs: string[] = [];
  for (const filePath of paths) {
    let content: string;
    try {
      content = readFileSync(filePath, "utf8");
    } catch {
      continue;
    }
    const matchingLines = content
      .split(/\r?\n/u)
      .filter((line) => {
        const lower = line.toLowerCase();
        return needles.some((needle) => lower.includes(needle));
      })
      .slice(0, 40);
    if (matchingLines.length === 0) {
      continue;
    }
    evidenceRefs.push(pathToFileURL(filePath).href);
    selectedLines.push(`From ${pathToFileURL(filePath).href}:`, ...matchingLines);
  }
  return Object.freeze({
    evidenceRefs: uniqueSorted(evidenceRefs),
    excerpt: selectedLines.join("\n").slice(0, 2400)
  });
}

function componentRepairReentryPlanForReason(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly dossier: SdlcPostflightGapDossier;
  readonly reason: SdlcPostflightGapReason;
}): SdlcComponentRepairReentryPlan | null {
  const prefix = "component_repair_row_open:";
  if (!input.reason.reason.startsWith(prefix)) {
    return null;
  }
  const failureId = input.reason.reason.slice(prefix.length);
  if (failureId.length === 0) {
    return null;
  }
  const evidenceRefs = uniqueSorted([
    ...input.dossier.evidenceRefs,
    ...input.reason.blockingReason.evidenceRefs
  ]);
  const row = componentRepairRowsForFailure({
    workspaceRoot: input.manifest.workspaceRoot,
    preferredTargetAssetType: input.dossier.targetAssetType,
    failureId,
    evidenceRefs
  })[0];
  if (row === undefined) {
    return null;
  }
  const target = repairReentryTargetForRepairTarget(row.repairTarget);
  if (target === null) {
    return null;
  }
  const acceptedCarrier = acceptedCarrierSchemaForReason({
    reason: input.reason.reason,
    targetAssetType: target.targetAssetType
  });
  if (acceptedCarrier === null) {
    return null;
  }
  const diagnostics = diagnosticEvidenceForRepairRow({
    workspaceRoot: input.manifest.workspaceRoot,
    row,
    evidenceRefs
  });
  return Object.freeze({
    kind: "sdlc_component_repair_reentry_plan" as const,
    planVersion: "ts-component-repair-reentry-v1" as const,
    planId: `component_repair_reentry:${row.failureId}`,
    sourceGapDossierRef: input.dossier.currentGapDossierRef,
    sourceEdgeName: input.dossier.edgeName,
    sourceTargetAssetType: input.dossier.targetAssetType,
    reason: input.reason.reason,
    targetEdgeName: target.targetEdgeName,
    targetAssetType: target.targetAssetType,
    repairTarget: row.repairTarget,
    failureId: row.failureId,
    scheduleId: row.scheduleId,
    testcaseIds: row.testcaseIds,
    componentIds: row.componentIds,
    requirementIds: row.requirementIds,
    sourceRefs: row.sourceRefs,
    testRefs: row.testRefs,
    repairRowEvidenceRefs: uniqueSorted(row.evidenceRefs),
    diagnosticEvidenceRefs: uniqueSorted([
      ...diagnostics.evidenceRefs,
      ...row.evidenceRefs
    ]),
    diagnosticExcerpt: diagnostics.excerpt,
    acceptedCarrierSchemaRef: acceptedCarrier.schemaRef,
    acceptedCarrierFieldSet: acceptedCarrier.fieldSet,
    noBroadRegeneration: true
  });
}

function repairReentryPlansForContext(
  manifest: SdlcWorkerHandoffManifest
): readonly SdlcComponentRepairReentryPlan[] {
  const plans = new Map<string, SdlcComponentRepairReentryPlan>();
  for (const dossier of manifest.retryContext.priorGapDossiers) {
    for (const plan of componentRepairReentryPlansForGapDossier({
      manifest,
      dossier
    })) {
      plans.set(plan.planId, plan);
    }
  }
  return Object.freeze([...plans.values()]);
}

export function componentRepairReentryPlansForGapDossier(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly dossier: SdlcPostflightGapDossier;
}): readonly SdlcComponentRepairReentryPlan[] {
  const plans = new Map<string, SdlcComponentRepairReentryPlan>();
  for (const reason of input.dossier.reasons) {
    const plan = componentRepairReentryPlanForReason({
      manifest: input.manifest,
      dossier: input.dossier,
      reason
    });
    if (plan !== null) {
      plans.set(plan.planId, plan);
    }
  }
  return Object.freeze([...plans.values()]);
}

function retryRepairInstructionsForContext(
  manifest: SdlcWorkerHandoffManifest
): readonly SdlcWorkerRetryRepairInstruction[] {
  const instructions: SdlcWorkerRetryRepairInstruction[] = [];
  for (const dossier of manifest.retryContext.priorGapDossiers) {
    for (const reason of dossier.reasons) {
      const repairReentryPlan = componentRepairReentryPlanForReason({
        manifest,
        dossier,
        reason
      });
      const acceptedCarrier = acceptedCarrierSchemaForReason({
        reason: reason.reason,
        targetAssetType: repairReentryPlan?.targetAssetType ?? dossier.targetAssetType
      });
      const repairScope = retryRepairScopeForReason(
        reason.reason,
        reason.reasonClass
      );
      const evidenceRefs = uniqueSorted([
        ...dossier.evidenceRefs,
        ...reason.blockingReason.evidenceRefs
      ]);
      instructions.push(
        Object.freeze({
          kind: "sdlc_worker_retry_repair_instruction" as const,
          repairScope,
          gapDossierRef: dossier.currentGapDossierRef,
          reason: reason.reason,
          reasonClass: reason.reasonClass,
          blockingReasonCode: reason.blockingReason.code,
          blockingReasonDetail: reason.blockingReason.detail ?? "",
          rejectedArtifactRefs: evidenceRefs,
          acceptedCarrierSchemaRef: acceptedCarrier?.schemaRef ?? null,
          acceptedCarrierFieldSet: acceptedCarrier?.fieldSet ?? Object.freeze([]),
          repairReentryPlanId: repairReentryPlan?.planId ?? null,
          nonClosureRules:
            repairReentryPlan !== null
              ? Object.freeze([
                  `Re-enter ${repairReentryPlan.targetEdgeName} for target ${repairReentryPlan.targetAssetType}.`,
                  `Repair only the scheduled ${repairReentryPlan.repairTarget} row ${repairReentryPlan.scheduleId}.`,
                  "Read diagnosticEvidenceRefs and copy the exact diagnostic lines into the execution plan before editing.",
                  "Do not broadly regenerate tests, source, schedules, or release surfaces.",
                  "Do not bypass postflight; the framework will re-admit and re-evaluate the carrier."
                ])
              : repairScope === "schema_local" || acceptedCarrier !== null
              ? Object.freeze([
                  "Repair the same rejected edge artifact.",
                  "Add, remove, rename, or map rejected fields into the accepted carrier field set.",
                  "Do not regenerate unrelated surfaces or change authority scope unless the gap dossier widens the repair.",
                  "Do not bypass postflight; the framework will re-admit and re-evaluate the carrier."
                ])
              : Object.freeze([
                  "Use the gap dossier as bounded repair pressure.",
                  "Do not treat process success or worker prose as semantic closure.",
                  "Do not bypass postflight; the framework will re-evaluate the result."
                ])
        })
      );
    }
  }
  return Object.freeze(instructions);
}

function transformAxiomsForWorker(): readonly string[] {
  return Object.freeze([
    "F_P.transform only: produce bounded candidate transform evidence.",
    "Do not write ledgers, runtime events, closure decisions, evaluator projections, or framework result carriers.",
    "Use worker_brief, worker_invocation_package, traversal_intent_package, and explicitly referenced manifest fields as authority.",
    "Do not use PTY transcripts, runtime logs, or worker archives as product authority unless a package ref names them.",
    "Start the output artifact with ## Execution Plan naming read authority, bounded steps, and first materialization target.",
    "When requirementTraceObligationIds is non-empty, include ## Requirement Trace Register with each exact id."
  ]);
}

function compactComponentDepthDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  switch (manifest.targetAssetType) {
    case "implementation_component_topology_surface":
      return "Emit component_depth_register.componentTopologyRows with componentId, moduleName, relativePath, publicBoundary, concernRole, sourceAssetRefs, and requirementIds.";
    case "component_realization_schedule_surface":
      return "Emit component_depth_register.componentRealizationRows ordered by dependency reason; keep progress component-addressable.";
    case "component_code_surface":
      if (manifest.graphFunctionName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET) {
        return "No component-depth schema is required for declared-product materialization; close over observed product files, requirement trace evidence, and traversal consequence.";
      }
      return "Emit component_depth_register.componentRealizationRows and preserve declared component boundaries from topology/schedule authority.";
    case "component_realization_qualification_surface":
      return "Emit component_depth_register realization qualification with realized, missing, collapsed, and affected requirement ids.";
    case "test_component_topology_surface":
      return "Emit component_depth_register.testComponentTopologyRows with testClassId, relativePath, testcaseIds, componentIds, requirementIds, test kind, and shard.";
    case "component_test_surface":
      return "Emit component_depth_register with componentTestRows and preserve testClassId/testcase allocation from topology authority.";
    case "component_test_qualification_surface":
      return "Emit component_depth_register.componentTestQualificationRows; failed rows must carry componentExecutionFailureRegister evidence.";
    case "component_repair_schedule_surface":
      return "Emit component_depth_register.componentRepairSchedule from admitted failure rows only; repair rows must bind testcaseId, componentId, and requirementId.";
    case "release_depth_parity_surface":
      return "Emit component_depth_register.releaseDepthParity as met, blocked, or repriced from component topology, realization, test, repair, and execution evidence.";
    default:
      return null;
  }
}

function compactDesignDepthDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  switch (manifest.targetAssetType) {
    case "implementation_module_surface":
      return "Emit design_depth_register module schema and state fragments; mark stateless/stateful entities explicitly.";
    case "aggregate_domain_model_surface":
      return "Emit design_depth_register aggregateDomainModel plus entity, attribute, and flow completeness verdicts.";
    case "aggregate_sunny_day_sequence_surface":
      return "Emit design_depth_register aggregateSunnyDaySequence backed by published operations/entities and completeness verdicts.";
    default:
      return null;
  }
}

function compactExecutionEvidenceDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  if (manifest.targetAssetType === "test_run_archive_surface") {
    return "Archive the admitted test_execution_result_surface truth; do not run test commands, do not emit fresh sdlc_worker_execution_evidence, and do not synthesize release evidence.";
  }
  if (!manifestAdmitsTestExecutionEvidence(manifest)) {
    return null;
  }
  return "Emit sdlc_worker_execution_evidence JSON for the declared test execution contract; executable product materialization must run or explicitly fail/pending its test contract before closure. executionEvidence.status MUST be one of: succeeded, failed, pending. Do not use status values such as not_run. executionEvidence.lane MUST be exactly \"test\". executionEvidence.testsObserved, passedCount, and failedCount MUST be numbers or null. If execution exits non-zero during compile, discovery, or test phases, record failed, not pending. Use pending only when execution did not run or external evidence is still unavailable. Pending evidence is a lawful non-closure carrier for triage or repricing; do not present a not-run document as release closure evidence.";
}

function compactScheduleDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  if (!manifest.targetAssetType.endsWith("_schedule_surface")) {
    return null;
  }
  return "Emit schedule truth with dependency graph, tranches, shard register where relevant, obligation ledger, gap ledger, and next tranche selector.";
}

function retryDefectDirectivesForWorker(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const reasons = manifest.retryContext.priorGapDossiers.flatMap((dossier) =>
    dossier.reasons.map((reason) => {
      const detail = reason.blockingReason.detail ?? reason.reason;
      return `${reason.blockingReason.lawfulReentryPoint}: ${reason.blockingReason.message} (${detail})`;
    })
  );
  if (reasons.length === 0) {
    return Object.freeze([]);
  }
  return Object.freeze([
    "This is a retry/re-entry attempt. Repair the prior deterministic defect before adding new surface area.",
    ...reasons.slice(0, 6).map((reason) => `Prior defect: ${reason}`),
    ...(reasons.length > 6
      ? [`Prior defect count omitted: ${reasons.length - 6}`]
      : [])
  ]);
}

function outcomeDirectivesForWorker(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const directives: string[] = [
    `Outcome: ${manifest.graphFunctionName} -> ${manifest.targetAssetType}.`,
    `Write output artifact: ${workerFacingPath(manifest, manifest.outputFile)}.`,
    `Do not write framework result report: ${workerFacingPath(manifest, manifest.reportFile)}.`
  ];
  directives.push(...retryDefectDirectivesForWorker(manifest));
  if (manifest.featureScope.mode === "full_breadth") {
    directives.push(
      "Full breadth: do not narrow induction, product, goal, or requirement pressure to a feature slice."
    );
  } else {
    directives.push(
      "Steel thread / targeted repair: close only included scope and preserve deferred scope by ref."
    );
  }
  const tenantOutputArtifact = tenantRelativeOutputArtifactPath(manifest);
  const productMaterializationAuthority =
    reconcileSdlcProductMaterializationAuthority(manifest);
  const productFileTargets =
    productMaterializationAuthority.declaredProductFileTargets;
  if (!manifest.productMaterialization.required) {
    directives.push(
      "Product materialization is not required for this edge.",
      "Do not write product source/test files for this edge."
    );
    if (tenantOutputArtifact !== null) {
      directives.push(
        `tenant-local SDLC surface artifact path: ${tenantOutputArtifact}; do not list it in materializedFiles.`
      );
      if (tenantOutputArtifact.startsWith("design/adrs/")) {
        directives.push(
          "ADR/design output must carry Status:, Implements:, Derives from:, Supersedes:, Superseded by:, and retained-special-case fields."
        );
      }
    }
    if (manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY) {
      directives.push(
        "This edge conforms project authority from bootstrap documents.",
        "Conform project authority from bootstrap/source fragments into context, intent, product, goals, and requirements surfaces.",
        "MUST create/update authority files, not only the transform artifact: .ai-workspace/context/project_bootstrap.md, specification/INTENT.md, specification/PRODUCT.md, specification/GOALS.md, specification/requirements/README.md, specification/requirements/*.md.",
        "Read root bootstrap/source files and .ai-workspace/context JSON/YAML/Markdown fragments before writing authority surfaces.",
        "Preserve product identity, tenant/language/runtime, expected files, exact output, and execution command in INTENT, PRODUCT, and requirements.",
        "INTENT must preserve source role and builder anchors: bootstrap document, odd_sdlc, language/runtime, and process execution proof.",
        "Preserve declared product files, expected output, and execution command as explicit requirement obligations.",
        "Cite Fg_conform_project_authority as Derived From for created/updated authority surfaces."
      );
    }
    if (manifest.targetAssetType === "code_surface") {
      directives.push(
        "For code_surface, produce a compatibility rollup over admitted component_code_surface and component_realization_qualification_surface evidence."
      );
    }
    if (manifest.targetAssetType === "test_module_surface") {
      directives.push(
        "For test_module_surface, produce a compatibility rollup over test topology/component test evidence."
      );
    }
  } else {
    const scopedMaterialization =
      featureScopeNarrowsMaterialization(manifest);
    directives.push(
      "Product materialization is REQUIRED for this edge.",
      `Tenant root: ${workerFacingPath(manifest, manifest.productMaterialization.tenantRoot)}.`,
      `Selected output root: ${manifest.productMaterialization.selectedOutputRoot}.`,
      `materializedFiles.relativePath basis: ${manifest.productMaterialization.relativePathBasis}.`,
      scopedMaterialization
        ? `Included modules for this edge: ${listForPrompt(manifest.featureScope.includedModuleNames)}.`
        : `Declared modules: ${listForPrompt(manifest.productMaterialization.declaredModuleNames)}.`,
      scopedMaterialization
        ? `Deferred modules are lineage only for this edge; do not create or modify their files: ${listForPrompt(manifest.featureScope.deferredModuleNames)}.`
        : "Deferred modules: none.",
      `Required roles: ${listForPrompt(manifest.productMaterialization.requiredRoles)}.`,
      `Build/test contracts: ${manifest.productMaterialization.buildExecutionContract} / ${manifest.productMaterialization.testExecutionContract}.`,
      productFileTargets.length === 0
        ? "Declared product file targets: none."
        : `Declared product file targets: ${productFileTargets.join(", ")}.`,
      `Product authority reconciliation: ${productMaterializationAuthority.status}; reasons: ${listForPrompt(productMaterializationAuthority.reasonRefs)}.`,
      `Allowed write roots: ${listForPrompt(manifest.allowedWriteRoots.map((root) => workerFacingPath(manifest, root)))}.`,
      "Do not create or modify product files outside the declared product file targets and allowed shared build roots for this edge.",
      "Apply requirementTraceObligationIds as the requirement transformation set for product files."
    );
    if (
      productMaterializationAuthority.status === "missing" ||
      productMaterializationAuthority.status === "ambiguous"
    ) {
      directives.push(
        "If product target inventory is missing or ambiguous, inspect PRODUCT.md, requirements, and context refs in workerInvocationPackage.productMaterializationAuthority; derive the product topology and report the rationale in the worker result."
      );
    }
    if (manifest.targetAssetType === "test_module_surface") {
      directives.push(
        "Generated tests must be discoverable by the declared test execution contract."
      );
    }
    if (manifest.targetAssetType === "component_code_surface") {
      directives.push(
        manifest.graphFunctionName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
          ? "For declared product materialization, materialize product files under the declared product file targets. The output artifact is the traversal summary carrier, not a substitute for source/build files. Use minimal source structure only when no topology authority is present."
          : "For component_code_surface, materialize implementation files for each declared component and record Component Realization Register evidence."
      );
    }
    if (manifest.targetAssetType === "component_test_surface") {
      directives.push(
        "For component_test_surface, materialize developer test files for each declared test class/file and record Component Test Register evidence.",
        "Materialized tests must preserve declared testClassId; avoid local identifiers that collide with matcher words; prefer shouldEqual or parenthesized shouldBe RHS."
      );
    }
  }
  for (const directive of [
    compactDesignDepthDirective(manifest),
    compactComponentDepthDirective(manifest),
    compactExecutionEvidenceDirective(manifest),
    compactScheduleDirective(manifest)
  ]) {
    if (directive !== null) {
      directives.push(directive);
    }
  }
  return Object.freeze(directives);
}

export function constructWorkerInvocationPackage(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath?: string | undefined;
  readonly traversalIntentPath?: string | undefined;
}): SdlcWorkerInvocationPackage {
  const manifestPath =
    input.manifestPath ?? join(input.manifest.archiveRoot, "handoff_manifest.json");
  const traversalIntentPath =
    input.traversalIntentPath ??
    join(input.manifest.archiveRoot, "traversal_intent_package.json");
  const inlineObligations = inlineObligationsForPrompt(input.manifest).map(
    (obligation) => compactObligation(input.manifest, obligation)
  );
  const priorGapReasons = priorGapReasonCodes(input.manifest.retryContext);
  const repairReentryPlans = repairReentryPlansForContext(input.manifest);
  const retryRepairInstructions = retryRepairInstructionsForContext(input.manifest);
  const productMaterializationAuthority =
    reconcileSdlcProductMaterializationAuthority(input.manifest);
  const productFileTargets =
    productMaterializationAuthority.declaredProductFileTargets;
  const base = Object.freeze({
    kind: "sdlc_worker_invocation_package" as const,
    packageVersion: "ts-invocation-v1" as const,
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    vectorIndex: input.manifest.vectorIndex,
    sourceAssetTypes: input.manifest.inputAssetTypes,
    targetAssetType: input.manifest.targetAssetType,
    manifestPath: workerFacingPath(input.manifest, manifestPath),
    manifestRef: workerFacingRef(input.manifest, pathToFileURL(manifestPath).href),
    manifestDigest: sha256Text(stableOperatorJson(input.manifest)),
    traversalIntentPackagePath: workerFacingPath(input.manifest, traversalIntentPath),
    traversalIntentPackageRef: workerFacingRef(
      input.manifest,
      pathToFileURL(traversalIntentPath).href
    ),
    traversalIntentPackageDigest:
      input.manifest.traversalIntentPackage.packageDigest,
    transformAxioms: transformAxiomsForWorker(),
    outcomeDirectives: outcomeDirectivesForWorker(input.manifest),
    outputContract: Object.freeze({
      kind: "sdlc_worker_invocation_output_contract" as const,
      outputFile: workerFacingPath(input.manifest, input.manifest.outputFile),
      reportFile: workerFacingPath(input.manifest, input.manifest.reportFile),
      fpTransformRequestFile: workerFacingPath(
        input.manifest,
        input.manifest.fpTransformRequestFile
      ),
      fpTransformResultFile: workerFacingPath(
        input.manifest,
        input.manifest.fpTransformResultFile
      ),
      fpEvaluateResultFile: workerFacingPath(
        input.manifest,
        input.manifest.fpEvaluateResultFile
      ),
      materializationRequired: input.manifest.productMaterialization.required,
      tenantRoot: workerFacingPath(
        input.manifest,
        input.manifest.productMaterialization.tenantRoot
      ),
      selectedOutputRoot: input.manifest.productMaterialization.selectedOutputRoot,
      declaredProductFileTargets: productFileTargets,
      requiredRoles: input.manifest.productMaterialization.requiredRoles,
      buildExecutionContract:
        input.manifest.productMaterialization.buildExecutionContract,
      testExecutionContract:
        input.manifest.productMaterialization.testExecutionContract
    }),
    productMaterializationAuthority: workerFacingProductMaterializationAuthority(
      input.manifest,
      productMaterializationAuthority
    ),
    allowedWriteRoots: input.manifest.allowedWriteRoots.map((root) =>
      workerFacingPath(input.manifest, root)
    ),
    traversalStrategyDecision: workerFacingTraversalStrategyDecision(
      input.manifest,
      input.manifest.traversalStrategyDecision
    ),
    featureScope: workerFacingFeatureScope(
      input.manifest,
      input.manifest.featureScope
    ),
    retryFrontier: Object.freeze({
      kind: "sdlc_worker_invocation_retry_frontier" as const,
      retryAttemptRefs: input.manifest.retryContext.retryAttemptRefs.map((ref) =>
        workerFacingRef(input.manifest, ref.manifestId)
      ),
      dossierRefs: workerFacingRefs(
        input.manifest,
        priorGapDossierRefs(input.manifest.retryContext)
      ),
      reasonCount: priorGapReasons.length,
      sampleReasonCodes: priorGapReasons.slice(0, 20),
      omittedReasonCount: Math.max(0, priorGapReasons.length - 20)
    }),
    repairReentryPlans: workerFacingRepairReentryPlans(
      input.manifest,
      repairReentryPlans
    ),
    retryRepairInstructions: workerFacingRetryRepairInstructions(
      input.manifest,
      retryRepairInstructions
    ),
    inlineObligations,
    inlineObligationIds: inlineObligations.map(
      (obligation) => obligation.obligationId
    ),
    requirementTraceObligationIds:
      requirementTraceObligationIdsForPrompt(input.manifest),
    trancheKeys: input.manifest.traversalObligationContext.trancheKeys,
    omittedObligationCount:
      input.manifest.traversalObligationContext.obligations.length -
      inlineObligations.length,
    retrievalHints: compactRetrievalHints(
      input.manifest,
      input.manifest.traversalObligationContext.retrievalHints
    ),
    obligationDeltaSummary:
      input.manifest.traversalObligationContext.deltaSummary,
    authorityRefCount:
      input.manifest.traversalObligationContext.authorityRefs.length,
    runtimeContextRefs: workerFacingRefs(
      input.manifest,
      input.manifest.traversalObligationContext.runtimeContextRefs
    ),
    priorEdgeRefs: workerFacingRefs(
      input.manifest,
      input.manifest.traversalObligationContext.priorEdgeRefs
    ),
    resultReportSchema: input.manifest.resultReportSchema
  });
  return Object.freeze({
    ...base,
    packageDigest: sha256Text(stableOperatorJson(base))
  });
}

export function constructWorkerBrief(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath: string;
  readonly workerInvocationPackagePath: string;
  readonly traversalIntentPath: string;
  readonly conformedProjectPath: string;
  readonly invocationPackage: SdlcWorkerInvocationPackage;
}): SdlcWorkerBrief {
  return Object.freeze({
    kind: "sdlc_worker_brief" as const,
    briefVersion: "ts-worker-brief-v1" as const,
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    vectorIndex: input.manifest.vectorIndex,
    sourceAssetTypes: input.manifest.inputAssetTypes,
    targetAssetType: input.manifest.targetAssetType,
    outputFile: workerFacingPath(input.manifest, input.manifest.outputFile),
    reportFile: workerFacingPath(input.manifest, input.manifest.reportFile),
    materializationRequired: input.manifest.productMaterialization.required,
    allowedWriteRoots: input.manifest.allowedWriteRoots.map((root) =>
      workerFacingPath(input.manifest, root)
    ),
    requiredSchema: input.manifest.resultReportSchema,
    refs: Object.freeze({
      workerInvocationPackagePath: workerFacingPath(
        input.manifest,
        input.workerInvocationPackagePath
      ),
      traversalIntentPackagePath: workerFacingPath(
        input.manifest,
        input.traversalIntentPath
      ),
      handoffManifestPath: workerFacingPath(input.manifest, input.manifestPath),
      conformedProjectPath: workerFacingPath(input.manifest, input.conformedProjectPath),
      fpTransformRequestFile: workerFacingPath(
        input.manifest,
        input.manifest.fpTransformRequestFile
      ),
      fpTransformResultFile: workerFacingPath(
        input.manifest,
        input.manifest.fpTransformResultFile
      ),
      fpEvaluateResultFile: workerFacingPath(
        input.manifest,
        input.manifest.fpEvaluateResultFile
      )
    }),
    digests: Object.freeze({
      workerInvocationPackageDigest: input.invocationPackage.packageDigest,
      traversalIntentPackageDigest:
        input.manifest.traversalIntentPackage.packageDigest,
      handoffManifestDigest: input.invocationPackage.manifestDigest
    }),
    retryInstructionCount: input.invocationPackage.retryRepairInstructions.length,
    repairReentryPlanCount: input.invocationPackage.repairReentryPlans.length
  });
}

function workerFacingPath(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  filePath: string
): string {
  const workspaceRoot = resolve(manifest.workspaceRoot);
  const resolvedPath = resolve(filePath);
  const relativePath = relative(workspaceRoot, resolvedPath);
  if (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath))
  ) {
    return relativePath === "" ? "." : relativePath;
  }
  return filePath;
}

function workerFacingRef(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  ref: string
): string {
  const workspaceRoot = resolve(manifest.workspaceRoot);
  const workspaceUrl = pathToFileURL(workspaceRoot).href;
  const workspaceUrlPrefix = `${workspaceUrl}/`;
  if (ref === workspaceUrl) {
    return "workspace://.";
  }
  if (ref.startsWith(workspaceUrlPrefix)) {
    return `workspace://${ref.slice(workspaceUrlPrefix.length)}`;
  }
  if (ref.startsWith("file://")) {
    try {
      const filePath = fileURLToPath(ref);
      const relativePath = workerFacingPath(manifest, filePath);
      if (relativePath !== filePath) {
        return `workspace://${relativePath}`;
      }
    } catch {
      return ref;
    }
  }
  if (isAbsolute(ref)) {
    const relativePath = workerFacingPath(manifest, ref);
    if (relativePath !== ref) {
      return `workspace://${relativePath}`;
    }
  }
  if (ref.includes(workspaceUrlPrefix)) {
    return ref.split(workspaceUrlPrefix).join("workspace://");
  }
  if (ref.includes(workspaceRoot)) {
    return ref.split(workspaceRoot).join(".");
  }
  return ref;
}

function workerFacingRefs(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  refs: readonly string[]
): readonly string[] {
  return Object.freeze(refs.map((ref) => workerFacingRef(manifest, ref)));
}

function workerFacingProductMaterializationAuthority(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  reconciliation: SdlcProductMaterializationAuthorityReconciliation
): SdlcProductMaterializationAuthorityReconciliation {
  return Object.freeze({
    ...reconciliation,
    sourceRefs: workerFacingRefs(manifest, reconciliation.sourceRefs)
  });
}

function workerFacingTraversalStrategyDecision(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  decision: SdlcTraversalStrategyDecision
): SdlcTraversalStrategyDecision {
  return Object.freeze({
    ...decision,
    basisRefs: workerFacingRefs(manifest, decision.basisRefs)
  });
}

function workerFacingFeatureScope(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  scope: SdlcWorkerHandoffManifest["featureScope"]
): SdlcWorkerHandoffManifest["featureScope"] {
  return Object.freeze({
    ...scope,
    basisRefs: workerFacingRefs(manifest, scope.basisRefs)
  });
}

function workerFacingRetryRepairInstructions(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  instructions: readonly SdlcWorkerRetryRepairInstruction[]
): readonly SdlcWorkerRetryRepairInstruction[] {
  return Object.freeze(
    instructions.map((instruction) =>
      Object.freeze({
        ...instruction,
        gapDossierRef: workerFacingRef(manifest, instruction.gapDossierRef),
        rejectedArtifactRefs: workerFacingRefs(
          manifest,
          instruction.rejectedArtifactRefs
        )
      })
    )
  );
}

function workerFacingRepairReentryPlans(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  plans: readonly SdlcComponentRepairReentryPlan[]
): readonly SdlcComponentRepairReentryPlan[] {
  return Object.freeze(
    plans.map((plan) =>
      Object.freeze({
        ...plan,
        sourceGapDossierRef: workerFacingRef(manifest, plan.sourceGapDossierRef),
        sourceRefs: workerFacingRefs(manifest, plan.sourceRefs),
        testRefs: workerFacingRefs(manifest, plan.testRefs),
        repairRowEvidenceRefs: workerFacingRefs(
          manifest,
          plan.repairRowEvidenceRefs
        ),
        diagnosticEvidenceRefs: workerFacingRefs(
          manifest,
          plan.diagnosticEvidenceRefs
        )
      })
    )
  );
}

export function promptForHandoff(manifest: SdlcWorkerHandoffManifest): string {
  const manifestPath = join(manifest.archiveRoot, "handoff_manifest.json");
  const invocationPackagePath = join(
    manifest.archiveRoot,
    "worker_invocation_package.json"
  );
  const workerBriefPath = join(manifest.archiveRoot, "worker_brief.json");
  const traversalIntentPath = join(
    manifest.archiveRoot,
    "traversal_intent_package.json"
  );
  const outcomeSummary = [
    `edge=${manifest.edgeName}`,
    `target=${manifest.targetAssetType}`,
    `materialization=${manifest.productMaterialization.required ? "required" : "not_required"}`,
    `output=${workerFacingPath(manifest, manifest.outputFile)}`
  ].join("; ");
  const outcomeDirectives = outcomeDirectivesForWorker(manifest).map(
    (directive) => `- ${directive}`
  );
  return [
    "odd_sdlc F_P.transform launch contract.",
    `Outcome: ${outcomeSummary}`,
    "",
    "Read in order:",
    `1. worker brief: ${workerFacingPath(manifest, workerBriefPath)}`,
    `2. invocation package: ${workerFacingPath(manifest, invocationPackagePath)}`,
    `3. traversal intent package: ${workerFacingPath(manifest, traversalIntentPath)}`,
    `4. forensic manifest only when a package ref requires it: ${workerFacingPath(manifest, manifestPath)}`,
    "",
    "Terse axioms:",
    "- Apply workerInvocationPackage.transformAxioms as the single axiom authority.",
    "- Do not add local axiom variants from this launch frame.",
    "",
    "Outcome directives:",
    ...outcomeDirectives,
    "",
    "Worker package fields to apply:",
    "- transformAxioms",
    "- outcomeDirectives",
    "- outputContract",
    "- Use workerInvocationPackage.requirementTraceObligationIds exactly when present.",
    "- traversalStrategyDecision",
    "- featureScope",
    "- retryRepairInstructions and repairReentryPlans when present.",
    "",
    manifest.productMaterialization.required
      ? "Product materialization is REQUIRED for this edge."
      : "Product materialization is not required for this edge.",
    "The framework writes reports, evidence carriers, ledgers, and closure after this process exits."
  ].join("\n");
}

export function writeHandoffFiles(manifest: SdlcWorkerHandoffManifest): {
  readonly manifestPath: string;
  readonly promptPath: string;
  readonly invocationPackagePath: string;
  readonly workerBriefPath: string;
} {
  assertTraversalIntentPackagePressure(manifest);
  mkdirSync(manifest.archiveRoot, { recursive: true });
  const fileTargetRoots = materializationFileTargetRoots(manifest);
  for (const writeRoot of manifest.allowedWriteRoots) {
    mkdirSync(directoryToPrepareForWriteRoot(writeRoot, fileTargetRoots), {
      recursive: true
    });
  }
  const manifestPath = join(manifest.archiveRoot, "handoff_manifest.json");
  const invocationPackagePath = join(
    manifest.archiveRoot,
    "worker_invocation_package.json"
  );
  const workerBriefPath = join(manifest.archiveRoot, "worker_brief.json");
  const promptPath = join(manifest.archiveRoot, "worker_prompt.md");
  const conformedProjectPath = join(manifest.archiveRoot, "conformed_project.json");
  const traversalIntentPath = join(manifest.archiveRoot, "traversal_intent_package.json");
  const invocationPackage = constructWorkerInvocationPackage({
    manifest,
    manifestPath,
    traversalIntentPath
  });
  const workerBrief = constructWorkerBrief({
    manifest,
    manifestPath,
    workerInvocationPackagePath: invocationPackagePath,
    traversalIntentPath,
    conformedProjectPath,
    invocationPackage
  });
  writeFileSync(manifestPath, stableOperatorJson(manifest), "utf8");
  writeFileSync(invocationPackagePath, stableOperatorJson(invocationPackage), "utf8");
  writeFileSync(workerBriefPath, stableOperatorJson(workerBrief), "utf8");
  writeFileSync(promptPath, promptForHandoff(manifest), "utf8");
  writeFileSync(conformedProjectPath, stableOperatorJson(manifest.conformedProject), "utf8");
  writeFileSync(
    traversalIntentPath,
    stableOperatorJson(manifest.traversalIntentPackage),
    "utf8"
  );
  if (manifest.fpTransformRequest !== null) {
    writeFileSync(
      manifest.fpTransformRequestFile,
      stableOperatorJson(manifest.fpTransformRequest),
      "utf8"
    );
  }
  return Object.freeze({
    manifestPath,
    promptPath,
    invocationPackagePath,
    workerBriefPath
  });
}

function parseNonNegativeInteger(input: unknown, label: string): number {
  if (typeof input !== "number" || !Number.isInteger(input) || input < 0) {
    throw new TypeError(`${label}: expected non-negative integer`);
  }
  return input;
}

function parseOptionalNonEmptyString(input: unknown, label: string): string | null {
  if (input === undefined || input === null) {
    return null;
  }
  return parseNonEmptyString(input, label);
}

function parseOptionalFpTransformStatus(
  input: unknown,
  label: string
): FpTransformResult["status"] | null {
  if (input === undefined || input === null) {
    return null;
  }
  return parseEnumValue(input, label, [
    "returned",
    "blocked",
    "runtime_failed",
    "contract_failed"
  ] as const);
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
  return admitExactContractEnum({
    value: input,
    label,
    values: ["succeeded", "failed", "pending"] as const
  });
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
    !manifestAdmitsTestExecutionEvidence(manifest) &&
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
    ),
    fpTransformRequestRef: parseOptionalNonEmptyString(
      record["fpTransformRequestRef"],
      "SdlcWorkerResultReport.fpTransformRequestRef"
    ),
    fpTransformResultRef: parseOptionalNonEmptyString(
      record["fpTransformResultRef"],
      "SdlcWorkerResultReport.fpTransformResultRef"
    ),
    fpTransformStatus: parseOptionalFpTransformStatus(
      record["fpTransformStatus"],
      "SdlcWorkerResultReport.fpTransformStatus"
    ),
    fpEvaluateResultRef: parseOptionalNonEmptyString(
      record["fpEvaluateResultRef"],
      "SdlcWorkerResultReport.fpEvaluateResultRef"
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
      !executionCommandMatchesContract({
        manifest: input.manifest,
        command: executionEvidence.command
      })
    ) {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_command_mismatch",
          detail: executionEvidence.command,
          evidenceRefs: executionEvidence.reportRefs
        })
      );
    }
    if (executionEvidence.status === "pending") {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_not_succeeded",
          detail: executionEvidence.status,
          evidenceRefs: executionEvidence.reportRefs
        })
      );
    }
    if (
      executionEvidence.status !== "failed" &&
      (executionEvidence.testsObserved ?? 0) <= 0
    ) {
      blockers.push(
        makeSdlcBlockingReason({
          code: "test_execution_zero_tests_observed",
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
    normalized.includes("/project/target/") ||
    normalized === ".bsp" ||
    normalized.startsWith(".bsp/") ||
    normalized.includes("/.bsp/")
  );
}

function declaredTechnologyText(manifest: SdlcWorkerHandoffManifest): string {
  const project = manifest.conformedProject;
  return [
    project?.language ?? "",
    project?.tool ?? "",
    manifest.productMaterialization.buildExecutionContract,
    manifest.productMaterialization.testExecutionContract,
    ...(project?.capabilityContracts.flatMap((contract) => [
      contract.name,
      contract.value
    ]) ?? [])
  ].join(" ").toLowerCase();
}

function declaredTechnologyIncludes(
  manifest: SdlcWorkerHandoffManifest,
  token: string
): boolean {
  return declaredTechnologyText(manifest).includes(token.toLowerCase());
}

function declaredBuildConfigRoleForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly normalizedRelativePath: string;
}): SdlcMaterializedProductFileRole | null {
  const lower = input.normalizedRelativePath.toLowerCase();
  if (
    declaredTechnologyIncludes(input.manifest, "sbt") &&
    (lower === "build.sbt" || lower.endsWith("/build.sbt"))
  ) {
    return "build_config";
  }
  if (
    (declaredTechnologyIncludes(input.manifest, "cargo") ||
      declaredTechnologyIncludes(input.manifest, "rust")) &&
    (lower === "cargo.toml" || lower.endsWith("/cargo.toml"))
  ) {
    return "build_config";
  }
  if (
    declaredTechnologyIncludes(input.manifest, "maven") &&
    (lower === "pom.xml" || lower.endsWith("/pom.xml"))
  ) {
    return "build_config";
  }
  if (
    declaredTechnologyIncludes(input.manifest, "gradle") &&
    (lower === "build.gradle" ||
      lower.endsWith("/build.gradle") ||
      lower === "build.gradle.kts" ||
      lower.endsWith("/build.gradle.kts"))
  ) {
    return "build_config";
  }
  return null;
}

function productAuthorityTargetCoversRelativePath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly target: SdlcProductMaterializationAuthorityTarget;
  readonly normalizedRelativePath: string;
}): boolean {
  const targetRelativePath = targetRelativeToSelectedOutputRoot({
    targetPath: input.target.path,
    selectedOutputRoot: input.manifest.productMaterialization.selectedOutputRoot
  }).toLowerCase();
  const relativePath = input.normalizedRelativePath.toLowerCase();
  if (input.target.targetKind === "file") {
    return relativePath === targetRelativePath;
  }
  return (
    relativePath === targetRelativePath ||
    relativePath.startsWith(`${targetRelativePath}/`)
  );
}

function declaredProductAuthorityRoleForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly normalizedRelativePath: string;
}): SdlcMaterializedProductFileRole | null {
  const authority = reconcileSdlcProductMaterializationAuthority(input.manifest);
  const target = authority.declaredProductTargetContracts.find((candidate) =>
    productAuthorityTargetCoversRelativePath({
      manifest: input.manifest,
      target: candidate,
      normalizedRelativePath: input.normalizedRelativePath
    })
  );
  if (target === undefined) {
    return null;
  }
  const targetRelativePath = targetRelativeToSelectedOutputRoot({
    targetPath: target.path,
    selectedOutputRoot: input.manifest.productMaterialization.selectedOutputRoot
  }).toLowerCase();
  if (targetRelativePath === "build.sbt") {
    return "build_config";
  }
  if (
    targetRelativePath === "src" ||
    targetRelativePath.endsWith("/src") ||
    targetRelativePath.includes("/src/")
  ) {
    return "source";
  }
  if (
    targetRelativePath === "design" ||
    targetRelativePath.startsWith("design/")
  ) {
    return "design";
  }
  return null;
}

function materializedRoleForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
}): SdlcMaterializedProductFileRole {
  const normalized = input.relativePath.split(path.sep).join("/");
  const declaredBuildConfigRole = declaredBuildConfigRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalized
  });
  if (declaredBuildConfigRole !== null) {
    return declaredBuildConfigRole;
  }
  const declaredAuthorityRole = declaredProductAuthorityRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalized
  });
  if (declaredAuthorityRole !== null) {
    return declaredAuthorityRole;
  }
  if (normalized === tenantRelativeOutputArtifactPath(input.manifest)) {
    return "design";
  }
  const lower = normalized.toLowerCase();
  if (lower.startsWith("design/") || lower === "design") {
    return "design";
  }
  if (
    input.manifest.targetAssetType === "component_code_surface" &&
    isLikelySourceMaterialization(input.relativePath)
  ) {
    return "source";
  }
  if (
    input.manifest.targetAssetType === "component_test_surface" &&
    isLikelyTestMaterialization(input.relativePath)
  ) {
    return "test";
  }
  if (
    input.manifest.targetAssetType === "test_module_surface" ||
    targetAdmitsTestExecutionEvidence(input.manifest.targetAssetType)
  ) {
    return "test";
  }
  if (isLikelySourceMaterialization(input.relativePath)) {
    return "source";
  }
  return "other";
}

function observedRoleHasNonemptyFile(input: SdlcObservedProductFileSnapshot): boolean {
  const content = textIfFile(input.absolutePath);
  return content !== null && content.trim().length > 0;
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
  if (role === "source" || role === "test" || role === "design") {
    return observedRoleHasNonemptyFile(input.file);
  }
  if (role === "build_config") {
    return textIfFile(input.file.absolutePath) !== null;
  }
  return false;
}

function normalizedRelativePath(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
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
    /\.(?:scala|ts|tsx|js|jsx|mjs|cjs|py|java|kt|rs|sql)$/u.test(normalized);
}

function isLikelyTestMaterialization(relativePath: string): boolean {
  const normalized = normalizedRelativePath(relativePath).toLowerCase();
  const hasTestPath =
    normalized.includes("/src/test/") ||
    normalized.startsWith("src/test/") ||
    normalized.includes("/test/") ||
    normalized.includes("/tests/") ||
    normalized.includes("/spec/") ||
    normalized.includes("/specs/");
  const hasTestName =
    /(?:^|\/)[^/]*(?:test|spec|suite)[^/]*\.(?:scala|ts|tsx|js|jsx|mjs|cjs|py|java|kt|rs)$/u.test(
      normalized
    );
  return hasTestPath || hasTestName;
}

function isLikelyDesignMaterialization(input: {
  readonly relativePath: string;
  readonly absolutePath: string;
}): boolean {
  const normalized = normalizedRelativePath(input.relativePath).toLowerCase();
  if (
    normalized === "design" ||
    (!normalized.startsWith("design/") && !normalized.startsWith("design\\"))
  ) {
    return false;
  }
  if (!/\.(?:md|markdown|json|ya?ml)$/u.test(normalized)) {
    return false;
  }
  const content = textIfFile(input.absolutePath);
  return content !== null && content.trim().length > 0;
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
    if (resolve(file.absolutePath) === resolve(input.manifest.outputFile)) {
      continue;
    }
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
          kind: shardRecord["kind"],
          shardId: shardRecord["shardId"],
          moduleName: shardRecord["moduleName"],
          lane: shardRecord["lane"],
          command: shardRecord["command"],
          status: shardRecord["status"],
          reportRefs: Object.freeze(
            shardReportRefs.includes(input.artifactRef)
              ? shardReportRefs
              : [...shardReportRefs, input.artifactRef]
          ),
          testsObserved: shardRecord["testsObserved"],
          passedCount: shardRecord["passedCount"],
          failedCount: shardRecord["failedCount"]
        });
      })
    : undefined;
  return Object.freeze({
    kind: record["kind"],
    lane: record["lane"],
    command: record["command"],
    status: record["status"],
    reportRefs: Object.freeze(
      reportRefs.includes(input.artifactRef)
        ? reportRefs
        : [...reportRefs, input.artifactRef]
    ),
    testsObserved: record["testsObserved"],
    passedCount: record["passedCount"],
    failedCount: record["failedCount"],
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
  if (!manifestAdmitsTestExecutionEvidence(input.manifest)) {
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
  const fencedBlockExpression =
    /^```([^\r\n`]*)\r?\n([\s\S]*?)^```[^\S\r\n]*$/gmu;
  for (const match of input.content.matchAll(fencedBlockExpression)) {
    const infoString = match[1]?.trim() ?? "";
    const infoParts = infoString.split(/\s+/u).filter((part) => part.length > 0);
    const language = infoParts[0] ?? "";
    if (
      infoString !== "" &&
      language !== "json" &&
      language !== "execution_evidence" &&
      language !== "executionEvidence"
    ) {
      continue;
    }
    const block = match[2]?.trim() ?? "";
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
  const assessments = input.manifest.traversalObligationContext.obligations.map((obligation) => {
      const requirementId = requirementIdForObligation(obligation.obligationId);
      if (requirementId !== null) {
        const observed = observedRequirements.has(requirementId);
        const recordsRequirementSurfaceOnly =
          input.manifest.targetAssetType === "requirement_surface";
        const fulfillmentStatus =
          observed && recordsRequirementSurfaceOnly
            ? "partial"
            : observed
              ? "fulfilled"
              : "blocked";
        return Object.freeze({
          kind: "sdlc_worker_obligation_assessment" as const,
          obligationId: obligation.obligationId,
          fulfillmentStatus,
          evidenceRefs: baseEvidenceRefs,
          blockingReasons:
            fulfillmentStatus === "fulfilled"
              ? Object.freeze([])
              : Object.freeze([
                  observed
                    ? `requirement_recorded_for_future_closure:${requirementId}`
                    : `requirement_trace_not_observed:${requirementId}`
                ])
        });
      }
      if (obligation.obligationKind === "source_asset") {
        const fulfilled = existsSync(input.manifest.outputFile);
        const evidenceRefs = fulfilled
          ? uniqueSorted([...baseEvidenceRefs, ...obligation.evidenceRefs])
          : obligation.evidenceRefs;
        return Object.freeze({
          kind: "sdlc_worker_obligation_assessment" as const,
          obligationId: obligation.obligationId,
          fulfillmentStatus: fulfilled ? "fulfilled" : "blocked",
          evidenceRefs,
          blockingReasons: fulfilled
            ? Object.freeze([])
            : Object.freeze(["post_transform_output_missing"])
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
    });
  if (input.manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY) {
    const existingRequirementIds = new Set(
      assessments
        .map((assessment) => requirementIdForObligation(assessment.obligationId))
        .filter((requirementId): requirementId is string => requirementId !== null)
    );
    for (const requirementId of [...observedRequirements].sort()) {
      if (existingRequirementIds.has(requirementId)) {
        continue;
      }
      assessments.push(
        Object.freeze({
          kind: "sdlc_worker_obligation_assessment" as const,
          obligationId: `requirement:${requirementId}`,
          fulfillmentStatus: "fulfilled" as const,
          evidenceRefs: baseEvidenceRefs,
          blockingReasons: Object.freeze([])
        })
      );
    }
  }
  return Object.freeze(assessments);
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
    }),
    fpTransformRequestRef: input.manifest.fpTransformRequest?.requestRef ?? null,
    fpTransformResultRef:
      input.manifest.fpTransformRequest === null
        ? null
        : pathToFileURL(input.manifest.fpTransformResultFile).href,
    fpTransformStatus:
      input.manifest.fpTransformRequest === null ? null : "returned",
    fpEvaluateResultRef: pathToFileURL(input.manifest.fpEvaluateResultFile).href
  });
}

function reportEvidenceRefs(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): readonly string[] {
  return uniqueSorted([
    pathToFileURL(input.report.outputFile).href,
    pathToFileURL(input.manifest.reportFile).href,
    pathToFileURL(input.manifest.productMaterialization.manifestFile).href,
    ...input.report.materializedFiles.map((file) =>
      pathToFileURL(file.absolutePath).href
    ),
    ...(input.report.executionEvidence?.reportRefs ?? []),
    ...(input.report.executionEvidence?.shardEvidence.flatMap(
      (shard) => shard.reportRefs
    ) ?? [])
  ]);
}

function reportOutputArtifactIsAdmitted(report: SdlcWorkerResultReport): boolean {
  const outputFile = resolve(report.outputFile);
  if (!existsSync(outputFile) || !statSync(outputFile).isFile()) {
    return false;
  }
  return sha256Text(readFileSync(outputFile, "utf8")) === report.digest;
}

function transformStatusForReport(
  report: SdlcWorkerResultReport
): FpTransformResult["status"] {
  return reportOutputArtifactIsAdmitted(report) ? "returned" : "blocked";
}

function transformReasonForReport(report: SdlcWorkerResultReport): string | null {
  return reportOutputArtifactIsAdmitted(report)
    ? null
    : "transform output artifact missing or digest mismatch";
}

export function workerResultReportWithFpStageRefs(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): SdlcWorkerResultReport {
  return Object.freeze({
    ...input.report,
    fpTransformRequestRef:
      input.report.fpTransformRequestRef ??
      input.manifest.fpTransformRequest?.requestRef ??
      null,
    fpTransformResultRef:
      input.report.fpTransformResultRef ??
      (input.manifest.fpTransformRequest === null
        ? null
        : pathToFileURL(input.manifest.fpTransformResultFile).href),
    fpTransformStatus:
      input.report.fpTransformStatus ??
      (input.manifest.fpTransformRequest === null
        ? null
        : transformStatusForReport(input.report)),
    fpEvaluateResultRef:
      input.report.fpEvaluateResultRef ??
      pathToFileURL(input.manifest.fpEvaluateResultFile).href
  });
}

function evidenceCandidatesForReport(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): NonNullable<Parameters<typeof constructFpTransformResult>[0]["evidenceCandidates"]> {
  const assessments = input.report.obligationAssessments;
  const outputArtifactAdmitted = reportOutputArtifactIsAdmitted(input.report);
  const fulfilledCount = assessments.filter(
    (assessment) => assessment.fulfillmentStatus === "fulfilled"
  ).length;
  const blockedCount = assessments.filter(
    (assessment) => assessment.fulfillmentStatus === "blocked"
  ).length;
  const unassessedCount = assessments.filter(
    (assessment) => assessment.fulfillmentStatus === "unassessed"
  ).length;
  const assessmentEvidenceRefs = reportEvidenceRefs(input);
  const candidates = [
    {
      candidateRef: `target_asset:${input.manifest.targetAssetType}`,
      authorityRef: `asset-type://${input.manifest.targetAssetType}`,
      evidenceRefs: assessmentEvidenceRefs,
      payloadClass: "sdlc_transform_output",
      contractRef: "contract://odd_sdlc/fp-transform-output",
      complete: outputArtifactAdmitted,
      shallow: !outputArtifactAdmitted,
      contradictsAuthority: false,
      deferred: false
    },
    {
      candidateRef: `obligation_assessment_set:${input.manifest.edgeName}`,
      authorityRef: `traversal-intent-package:${input.manifest.traversalIntentPackage.packageDigest}`,
      evidenceRefs: assessmentEvidenceRefs,
      payloadClass: "sdlc_obligation_assessment_set",
      contractRef: "contract://odd_sdlc/fp-transform-obligation-assessment-set",
      complete: assessments.length > 0 && fulfilledCount === assessments.length,
      shallow: blockedCount > 0 || unassessedCount > 0,
      contradictsAuthority: blockedCount > 0,
      deferred: unassessedCount > 0
    }
  ];
  return Object.freeze(candidates);
}

export function constructWorkerFpTransformResult(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): FpTransformResult | null {
  const request = input.manifest.fpTransformRequest;
  if (request === null) {
    return null;
  }
  return admitFpTransformResultForRequest(
    request,
    constructFpTransformResult({
      request,
      artifactRef: pathToFileURL(input.report.outputFile).href,
      status: transformStatusForReport(input.report),
      reason: transformReasonForReport(input.report),
      evidenceCandidates: evidenceCandidatesForReport(input)
    })
  );
}

export function writeWorkerFpTransformResult(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): FpTransformResult | null {
  const result = constructWorkerFpTransformResult(input);
  if (result === null) {
    return null;
  }
  writeFileSync(
    input.manifest.fpTransformResultFile,
    stableOperatorJson(result),
    "utf8"
  );
  return result;
}

function evaluateMaterializedProductFiles(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
}): void {
  const contract = input.manifest.productMaterialization;
  const reportedProductFiles = input.report.materializedFiles.filter(
    (file) => resolve(file.absolutePath) !== resolve(input.manifest.outputFile)
  );
  for (const file of input.report.materializedFiles) {
    const absolutePath = resolve(file.absolutePath);
    if (absolutePath === resolve(input.manifest.outputFile)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_file_is_output_artifact",
          evidenceRefs: [pathToFileURL(absolutePath).href]
        })
      );
    }
  }
  if (!contract.required && reportedProductFiles.length > 0) {
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
  if (reportedProductFiles.length === 0) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "materialized_product_files_missing",
        evidenceRefs: [pathToFileURL(contract.tenantRoot).href]
      })
    );
  }
  for (const requiredRole of contract.requiredRoles) {
    if (!reportedProductFiles.some((file) => file.role === requiredRole)) {
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
    if (absolutePath === resolve(input.manifest.outputFile)) {
      continue;
    }
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
    if (file.role === "design" && !isLikelyDesignMaterialization(file)) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_design_file_outside_design_root",
          evidenceRefs: [fileEvidenceRef]
        })
      );
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
}

function evaluateExecutionEvidence(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
  readonly evidenceRefs: string[];
}): void {
  if (!manifestAdmitsTestExecutionEvidence(input.manifest)) {
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
  const executableProductMaterialization =
    productMaterializationRequiresTestExecutionEvidence(input.manifest);
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
    !executionCommandMatchesContract({
      manifest: input.manifest,
      command: executionEvidence.command
    })
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
  if (
    executableProductMaterialization &&
    executionEvidence.status !== "succeeded"
  ) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_failures_present",
        detail: executionEvidence.status,
        evidenceRefs: executionEvidence.reportRefs,
        message:
          "Executable product materialization did not pass its declared test execution contract."
      })
    );
  }
  // Failed-but-structurally-valid execution evidence is admitted here.
  // T-115 maps failed rows to component_test_qualification_surface and
  // component_repair_schedule_surface instead of retrying this edge.
  if (
    executionEvidence.status !== "failed" &&
    (executionEvidence.testsObserved ?? 0) <= 0
  ) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "test_execution_zero_tests_observed",
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

function evaluateAdrOutputArtifact(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly outputFile: string;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
}): void {
  if (!tenantOutputArtifactIsAdr(input.manifest)) {
    return;
  }
  const evidenceRefs = [pathToFileURL(input.outputFile).href];
  const filename = path.basename(input.outputFile);
  if (!/^ADR-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.md$/u.test(filename)) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "adr_output_filename_invalid",
        detail: filename,
        evidenceRefs
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
    if (shardEvidence.status === "pending") {
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
    // Failed shards are repair inputs, not postflight blockers, when their
    // evidence is otherwise structurally valid.
    if (
      shardEvidence.status !== "failed" &&
      (shardEvidence.testsObserved ?? 0) <= 0
    ) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "test_execution_zero_tests_observed",
          detail: expectedShard.shardId,
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
  const inducedAuthorityRequirementIds =
    input.manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY &&
    !input.manifest.productMaterialization.required
      ? observedRequirementIds({
          outputFile: input.report.outputFile,
          materializedFiles: input.report.materializedFiles
        })
      : new Set<string>();
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
      const requirementId = requirementIdForObligation(assessment.obligationId);
      const admittedAuthorityRequirement =
        requirementId !== null &&
        inducedAuthorityRequirementIds.has(requirementId);
      if (!admittedAuthorityRequirement) {
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
    evaluateAdrOutputArtifact({
      manifest: input.manifest,
      outputFile,
      blockingReasonCarriers
    });
    if (sha256Text(content) !== input.report.digest) {
      blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "output_digest_mismatch",
          evidenceRefs: [outputEvidenceRef]
        })
      );
    }
  }
  // worker_result_report.json is a compatibility/read-model artifact. Its
  // unresolvedReasons field is advisory; typed postflight checks below own
  // closure/blocking authority.
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

function obligationAssessmentCounts(
  report: SdlcWorkerResultReport
): SdlcFpEvaluateResult["obligationAssessmentCounts"] {
  let fulfilled = 0;
  let partial = 0;
  let blocked = 0;
  let unassessed = 0;
  for (const assessment of report.obligationAssessments) {
    switch (assessment.fulfillmentStatus) {
      case "fulfilled":
        fulfilled += 1;
        break;
      case "partial":
        partial += 1;
        break;
      case "blocked":
        blocked += 1;
        break;
      case "unassessed":
        unassessed += 1;
        break;
      default: {
        const exhaustive: never = assessment.fulfillmentStatus;
        throw new TypeError(`Unsupported obligation status ${exhaustive}`);
      }
    }
  }
  return Object.freeze({
    total: report.obligationAssessments.length,
    fulfilled,
    partial,
    blocked,
    unassessed
  });
}

export function constructFpEvaluateResult(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly postflight: SdlcPostflightResult;
}): SdlcFpEvaluateResult {
  return Object.freeze({
    kind: "sdlc_fp_evaluate_result" as const,
    stage: "F_P.evaluate" as const,
    reportRef: pathToFileURL(input.manifest.reportFile).href,
    transformResultRef:
      input.manifest.fpTransformRequest === null
        ? null
        : pathToFileURL(input.manifest.fpTransformResultFile).href,
    postflightRef: pathToFileURL(join(input.manifest.archiveRoot, "postflight.json")).href,
    status: input.postflight.status,
    blockingReasons: input.postflight.blockingReasons,
    evidenceRefs: input.postflight.evidenceRefs,
    obligationAssessmentCounts: obligationAssessmentCounts(input.report),
    executionEvidenceStatus: input.report.executionEvidence?.status ?? null
  });
}

export function writeFpEvaluateResult(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly postflight: SdlcPostflightResult;
}): SdlcFpEvaluateResult {
  const result = constructFpEvaluateResult(input);
  writeFileSync(
    input.manifest.fpEvaluateResultFile,
    stableOperatorJson(result),
    "utf8"
  );
  return result;
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
    reason.lawfulReentryPoint === "escalate_to_fp" ||
    reason.lawfulReentryPoint === "repair_worker_output"
  );
  const actions = new Set<
    | "retry_same_edge"
    | "escalate_to_fp"
    | "repair_worker_output"
    | "triage_gap"
    | "reprice_requirement_or_design"
  >();
  for (const reason of input.postflight.blockingReasonCarriers) {
    if (reason.lawfulReentryPoint === "same_edge_retry") {
      actions.add("retry_same_edge");
    } else if (reason.lawfulReentryPoint === "escalate_to_fp") {
      actions.add("escalate_to_fp");
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
