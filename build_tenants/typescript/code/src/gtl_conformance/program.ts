// Implements: REQ-F-ODDSDLC-040
// Implements: REQ-F-ODDSDLC-088
// Validates: T-197

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  statSync
} from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GTL_PROGRAM_BIND_ADMISSION_STRENGTH_COMPATIBILITY_REF,
  GTL_PROGRAM_OBLIGATION_DELTA_FAMILY_VALUES,
  GTL_PROGRAM_T153_FEATURE_KINDS,
  GTL_PROGRAM_T153_FEATURE_OWNER_CLASSIFICATIONS,
  admitGtlProgramConformanceInput,
  formatGtlProgramConformanceIssues,
  materializeGraphFunction,
  resolveAbgFnCompositionSelection,
  typecheckGtlProgram
} from "@abiogenesis/typescript-tenant";
import type {
  Graph,
  GraphFunction,
  GraphVector,
  GtlProgramConformanceInput,
  GtlProgramConformanceInputAdmission,
  GtlProgramConformanceReport,
  GtlProgramComputeCompositionRow,
  GtlProgramComputeStageBindingRow,
  GtlProgramFeatureCoverageManifest,
  GtlProgramObligationDeltaFamily,
  GtlProgramPluginResultInterfaceRow,
  GtlProgramRuntimeBindingRow,
  GtlProgramT153FeatureKind,
  GtlProgramTargetCarrierRow,
  GtlProgramTraversalBindConservationRow,
  EnginePluginContract,
  Module,
  Regime
} from "@abiogenesis/typescript-tenant";
import {
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule,
  constructSdlcTargetCarrierRegistry,
  constructSdlcTraversalOverlayCatalog,
  publicSdlcOverlayStartTargets,
  SDLC_EDGE_GAIN_CLOSURE_CONTRACTS
} from "../graph/index.js";
import { hookContractByEdgeName } from "../hooks/catalog.js";
import { ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT } from "../runtime/index.js";
import { materializeSdlcProjectConformance } from "../workspace/project_profile.js";
import {
  constructSdlcEvaluationGridContract,
  constructSdlcPromptInvocationProjection,
  sdlcPromptSectionFromLines,
  type SdlcPromptFamily,
  type SdlcRenderedPromptProjection
} from "../operator/prompt_assets.js";
import {
  deriveWorkerHandoffManifest,
  promptForHandoffProjection
} from "../operator/plugins/transform/launch_contract.js";
import {
  consequenceProjectionPluginContract,
  designDepthFpEvaluatorRuleContract,
  fpDispatchPluginContract,
  fpEvaluatorPluginContract,
  reviewGradeEdgeFulfillmentRuleContract,
  ticketWorkflowFdRuleContract
} from "../operator/plugins/plugin_contracts.js";
import {
  admitSdlcEvaluateContentRegisterArtifactForSelectedIdentity,
  writeDesignDepthRegisterProjectionFromEvaluateContentRegister,
  type SdlcDesignDepthRegisterFragmentSection
} from "../operator/plugins/evaluate/content_register.js";
import { sha256Text } from "../shared/digest.js";
const PACKAGE_ROOT_FROM_BUILD = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../.."
);

export const SDLC_GTL_PROGRAM_CONFORMANCE_SUBJECT_REF =
  "workspace://odd-sdlc/typescript/current" as const;

export const SDLC_GTL_PROGRAM_CONFORMANCE_FEATURE_COVERAGE_REF =
  "feature-coverage://odd-sdlc/typescript/current" as const;

export const SDLC_GTL_PROGRAM_CONFORMANCE_ACTIVE_SCAN_ROOTS = Object.freeze([
  "specification",
  "build_tenants/typescript/code/src",
  "build_tenants/typescript/design",
  "build_tenants/typescript/test_env/tests",
  "build_tenants/typescript/test_env/live"
] as const);

export const SDLC_GTL_PROGRAM_CONFORMANCE_ACTIVE_SCAN_EXTENSIONS =
  Object.freeze([".ts", ".mjs", ".md", ".json"] as const);

export const SDLC_GTL_PROGRAM_CONFORMANCE_EXCLUDED_SCAN_SURFACES =
  Object.freeze([
    "build_tenants/typescript/test_env/tests/test_t194_gtl_program_conformance.test.mjs",
    "build_tenants/typescript/test_env/tests/test_t197_product_gtl_gate.test.mjs"
  ] as const);

const STALE_ABG_IDENTITY_PATTERN_SOURCE = [
  "(?:",
  "abg[-_:/ ]?3\\.",
  "|ABG[-_:/ ]?3\\.",
  "|ABIogenesis[^\\n`]*3\\.",
  "|@abiogenesis[^\\n`]*(?:@|\\/)3\\.",
  "|runtime:\\/\\/abg\\/3\\.",
  "|abg:\\/\\/3\\.",
  "|3\\.7\\.1-r" + "c\\.1",
  "|3\\.8\\.0-r" + "c\\.3",
  "|3\\.9-r" + "c3",
  "|3\\.9\\.0-r" + "c\\.13",
  "|r" + "c13",
  "|r" + "c\\.13",
  ")"
].join("");

export const STALE_ABG_IDENTITY_PATTERN = new RegExp(
  STALE_ABG_IDENTITY_PATTERN_SOURCE,
  "u"
);

const T153_REQUIREMENT_REFS = Object.freeze([
  "REQ-L-GTL3-ASSET-SURFACE",
  "REQ-L-GTL3-COMPOSE",
  "REQ-L-GTL3-COMPUTE-NOTATION",
  "REQ-L-GTL3-CONTRACT-LAW-API",
  "REQ-L-GTL3-EVALUATOR",
  "REQ-L-GTL3-GRAPH",
  "REQ-L-GTL3-GRAPHFUNCTION",
  "REQ-L-GTL3-GRAPHVECTOR",
  "REQ-L-GTL3-HOF",
  "REQ-L-GTL3-HOOKS",
  "REQ-L-GTL3-IDENTITY",
  "REQ-L-GTL3-JOB",
  "REQ-L-GTL3-LAWS",
  "REQ-L-GTL3-MODULE",
  "REQ-L-GTL3-OPERATOR",
  "REQ-L-GTL3-RECURSE",
  "REQ-L-GTL3-ROLE",
  "REQ-L-GTL3-RULE",
  "REQ-L-GTL3-SELECTION-BOUNDARY",
  "REQ-L-GTL3-SUBSTITUTE",
  "REQ-L-GTL3-SUBWORK",
  "REQ-L-GTL3-SYNTHESIS",
  "REQ-R-ABG3-ASSURANCE",
  "REQ-R-ABG3-FN-COMPOSITION",
  "REQ-R-ABG3-INTERPRET",
  "REQ-R-ABG3-RUN",
  "REQ-R-ABG3-TRANSPORT"
] as const);

interface HookConfigEntryLike {
  readonly key: string;
  readonly value?: {
    readonly kind?: string;
    readonly value?: unknown;
  };
}

interface HookRefLike {
  readonly ref: string;
  readonly config?: {
    readonly entries?: readonly HookConfigEntryLike[];
  };
}

interface MaterializedGraphVectorRow {
  readonly graphFunction: GraphFunction;
  readonly graph: Graph;
  readonly vector: GraphVector;
  readonly vectorIndex: number;
}

interface SemanticPromptProjectionReviewCase {
  readonly graphFunctionName: string;
  readonly edgeRef: string;
  readonly graphFunctionId: string;
  readonly graphId: string;
  readonly graphVectorId: string;
  readonly vectorIndex: number;
  readonly targetAssetType: string;
  readonly outputCarrierKind: string;
  readonly contractRef: string;
  readonly contractDigest: string;
  readonly promptProjection: SdlcRenderedPromptProjection;
}

interface SemanticPromptProjectionReviewSummary {
  readonly graphVectorCount: number;
  readonly promptProjectionCount: number;
  readonly nonPromptVectorCount: number;
  readonly promptCases: readonly SemanticPromptProjectionReviewCase[];
  readonly nonPromptVectorRefs: readonly string[];
  readonly issues: readonly SdlcPromptProjectionReviewIssue[];
}

export interface SdlcSemanticCompilerPromptReviewPackage {
  readonly kind: "sdlc_semantic_compiler_prompt_review_package";
  readonly packageVersion: "ts-semantic-compiler-prompt-review-v1";
  readonly subjectRef: string;
  readonly deterministicReportDigest: string;
  readonly graphVectorCount: number;
  readonly promptProjectionCount: number;
  readonly nonPromptVectorCount: number;
  readonly deterministicIssueCount: number;
  readonly deterministicIssues: readonly SdlcPromptProjectionReviewIssue[];
  readonly promptProjections: readonly {
    readonly graphFunctionName: string;
    readonly edgeRef: string;
    readonly vectorIndex: number;
    readonly targetAssetType: string;
    readonly outputCarrierKind: string;
    readonly contractRef: string;
    readonly contractDigest: string;
    readonly promptFamily: string;
    readonly stage: string;
    readonly renderedPromptDigest: string;
    readonly promptText: string;
  }[];
}

export interface SdlcSemanticCompilerFpReviewGateReport {
  readonly kind: "sdlc_semantic_compiler_fp_review_gate_report";
  readonly gateVersion: "ts-semantic-compiler-fp-review-gate-v1";
  readonly mode: "skipped" | "required";
  readonly passed: boolean;
  readonly reviewResultPath: string | null;
  readonly deterministicReportDigest: string;
  readonly reason: string;
}

export interface SdlcSemanticSourceAuthorityIssue {
  readonly code:
    | "design_depth_archive_status_authority"
    | "review_grade_retryable_postflight_short_circuit"
    | "workspace_gaps_read_model_authors_runtime_truth"
    | "workspace_gaps_read_model_invokes_runtime_control"
    | "post_transform_report_uses_broad_manifest_scope"
    | "product_materialization_lineage_unbounded_requirement_marker_scan"
    | "consequence_reentry_target_uses_abg_graph_reentry_point";
  readonly surfaceRef: string;
  readonly detail: string;
}

export interface SdlcSemanticCarrierClosureIssue {
  readonly code:
    | "design_depth_content_register_semantic_floor_missing"
    | "design_depth_materialization_fixture_unadmitted"
    | "design_depth_materialization_semantic_floor_regression"
    | "blocked_fp_evaluator_outcome_without_dispatch_publication"
    | "close_proposed_emits_continuation_refs";
  readonly surfaceRef: string;
  readonly detail: string;
}

export interface SdlcSemanticCarrierClosureReviewReport {
  readonly kind: "sdlc_semantic_carrier_closure_review_report";
  readonly reportVersion: "ts-semantic-carrier-closure-review-v1";
  readonly passed: boolean;
  readonly issueCount: number;
  readonly issues: readonly SdlcSemanticCarrierClosureIssue[];
}

interface SdlcSemanticSourceAuthoritySurface {
  readonly surfaceRef: string;
  readonly text: string;
}

interface SdlcGtlProgramSourceAuthorityPolicyRow {
  readonly policyRef: string;
  readonly sourceSurfaceRefs: readonly string[];
  readonly sourceSurfaceRefPrefixes: readonly string[];
  readonly forbiddenTokens: readonly string[];
  readonly forbiddenMatch: "any" | "all";
  readonly requiredMitigationTokens: readonly string[];
  readonly message: string;
  readonly evidenceRefs: readonly string[];
}

interface SdlcGtlProgramSemanticReviewGateRow {
  readonly gateRef: string;
  readonly subjectRef: string;
  readonly deterministicReportDigest: string;
  readonly reviewResultKind: "sdlc_semantic_compiler_fp_review_result";
  readonly reviewVersion: "ts-semantic-compiler-fp-review-result-v1";
  readonly status: "passed";
  readonly findingCount: 0;
  readonly reviewerProfileRef: string;
  readonly reviewedAt: string;
  readonly evidenceRefs: readonly string[];
}

const SDLC_SOURCE_AUTHORITY_DESIGN_DEPTH_REGISTER_REF =
  "build_tenants/typescript/code/src/operator/plugins/evaluate/design_depth_register.ts";
const SDLC_SOURCE_AUTHORITY_INSTALLED_OPERATOR_REF =
  "build_tenants/typescript/code/src/operator/installed_operator.ts";
const SDLC_SOURCE_AUTHORITY_WORKSPACE_API_ENTRY_REF =
  "build_tenants/typescript/code/src/workspace_api/entry.ts";
const SDLC_SOURCE_AUTHORITY_TRANSFORM_RESULT_PROJECTION_REF =
  "build_tenants/typescript/code/src/operator/plugins/transform/result_projection.ts";
const SDLC_SOURCE_AUTHORITY_POSTFLIGHT_CHECKS_REF =
  "build_tenants/typescript/code/src/operator/plugins/evaluate/postflight_checks.ts";
const SDLC_SOURCE_AUTHORITY_TRAVERSAL_CONSEQUENCE_REF =
  "build_tenants/typescript/code/src/operator/traversal_consequence.ts";

const SDLC_PACKAGED_SOURCE_AUTHORITY_SURFACE_REFS = Object.freeze([
  SDLC_SOURCE_AUTHORITY_DESIGN_DEPTH_REGISTER_REF,
  SDLC_SOURCE_AUTHORITY_INSTALLED_OPERATOR_REF,
  SDLC_SOURCE_AUTHORITY_WORKSPACE_API_ENTRY_REF,
  SDLC_SOURCE_AUTHORITY_TRANSFORM_RESULT_PROJECTION_REF,
  SDLC_SOURCE_AUTHORITY_POSTFLIGHT_CHECKS_REF,
  SDLC_SOURCE_AUTHORITY_TRAVERSAL_CONSEQUENCE_REF
] as const);

export interface SdlcGtlProgramConformanceInputOptions {
  readonly packageRoot?: string | undefined;
  readonly repoRoot?: string | undefined;
  readonly subjectRef?: string | undefined;
  readonly featureCoverageManifestRef?: string | undefined;
  readonly activeScanRoots?: readonly string[] | undefined;
  readonly excludedScanSurfaces?: readonly string[] | undefined;
}

function packageRootFromOptions(
  input: Pick<SdlcGtlProgramConformanceInputOptions, "packageRoot"> = {}
): string {
  return resolve(input.packageRoot ?? PACKAGE_ROOT_FROM_BUILD);
}

function repoRootFromOptions(input: SdlcGtlProgramConformanceInputOptions): string {
  return resolve(input.repoRoot ?? resolve(packageRootFromOptions(input), "../.."));
}

function currentAbgFoldRef(): string {
  const currentAbgVersion =
    ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.packageVersion;
  return (
    `package:@abiogenesis/typescript-tenant@${currentAbgVersion}` +
    "#abg/m03/iteration_state_action/deriveIterationOutcomeFromRows"
  );
}

function repoRelative(input: {
  readonly repoRoot: string;
  readonly filePath: string;
}): string {
  return path.relative(input.repoRoot, input.filePath).split(path.sep).join("/");
}

function walkActiveFiles(input: {
  readonly repoRoot: string;
  readonly rootRelativePath: string;
  readonly excludedScanSurfaces: ReadonlySet<string>;
}): readonly string[] {
  const root = path.join(input.repoRoot, input.rootRelativePath);
  if (!existsSync(root)) {
    return Object.freeze([]);
  }
  const files: string[] = [];
  const stack = [root];
  const activeExtensions = new Set<string>(
    SDLC_GTL_PROGRAM_CONFORMANCE_ACTIVE_SCAN_EXTENSIONS
  );
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) {
      continue;
    }
    const stat = statSync(current);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(current)) {
        if (entry === "build" || entry === "node_modules") {
          continue;
        }
        stack.push(path.join(current, entry));
      }
      continue;
    }
    if (!stat.isFile()) {
      continue;
    }
    const relative = repoRelative({
      repoRoot: input.repoRoot,
      filePath: current
    });
    if (input.excludedScanSurfaces.has(relative)) {
      continue;
    }
    if (activeExtensions.has(path.extname(current))) {
      files.push(current);
    }
  }
  return Object.freeze(files.sort());
}

function packagedBuildSurfacePathForSourceRef(input: {
  readonly packageRoot: string;
  readonly sourceRef: string;
}): string | null {
  const sourcePrefix = "build_tenants/typescript/code/src/";
  if (!input.sourceRef.startsWith(sourcePrefix)) {
    return null;
  }
  const semanticRelative = input.sourceRef
    .slice(sourcePrefix.length)
    .replace(/\.ts$/u, ".js");
  return path.join(
    input.packageRoot,
    "build/semantic/code/src",
    semanticRelative
  );
}

function packagedSourceAuthoritySurfaces(input: {
  readonly packageRoot: string;
}): readonly (SdlcSemanticSourceAuthoritySurface & {
  readonly evidenceRefs: readonly string[];
})[] {
  const rows = [];
  for (const sourceRef of SDLC_PACKAGED_SOURCE_AUTHORITY_SURFACE_REFS) {
    const filePath = packagedBuildSurfacePathForSourceRef({
      packageRoot: input.packageRoot,
      sourceRef
    });
    if (
      filePath === null ||
      !existsSync(filePath) ||
      !statSync(filePath).isFile()
    ) {
      continue;
    }
    const packageRelative = path
      .relative(input.packageRoot, filePath)
      .split(path.sep)
      .join("/");
    rows.push(
      Object.freeze({
        surfaceRef: sourceRef,
        text: readFileSync(filePath, "utf8"),
        evidenceRefs: Object.freeze([
          `workspace://${sourceRef}`,
          `package://@odd-sdlc/typescript-tenant/${packageRelative}`
        ])
      })
    );
  }
  return Object.freeze(rows);
}

export function activeSdlcSourceIdentitySurfaces(
  input: SdlcGtlProgramConformanceInputOptions = {}
) {
  const repoRoot = repoRootFromOptions(input);
  const packageRoot = packageRootFromOptions(input);
  const excludedScanSurfaces = new Set<string>([
    ...SDLC_GTL_PROGRAM_CONFORMANCE_EXCLUDED_SCAN_SURFACES,
    ...(input.excludedScanSurfaces ?? [])
  ]);
  const rows = [];
  for (const root of input.activeScanRoots ??
    SDLC_GTL_PROGRAM_CONFORMANCE_ACTIVE_SCAN_ROOTS) {
    for (const filePath of walkActiveFiles({
      repoRoot,
      rootRelativePath: root,
      excludedScanSurfaces
    })) {
      const relative = repoRelative({ repoRoot, filePath });
      rows.push(
        Object.freeze({
          surfaceRef: relative,
          text: readFileSync(filePath, "utf8"),
          evidenceRefs: Object.freeze([`workspace://${relative}`])
        })
      );
    }
  }
  const scannedSurfaceRefs = new Set(rows.map((row) => row.surfaceRef));
  rows.push(
    ...packagedSourceAuthoritySurfaces({
      packageRoot
    }).filter((row) => !scannedSurfaceRefs.has(row.surfaceRef))
  );
  if (rows.length === 0) {
    const packageJsonPath = path.join(packageRoot, "package.json");
    const packageJsonText = existsSync(packageJsonPath)
      ? readFileSync(packageJsonPath, "utf8")
      : "{}";
    rows.push(
      Object.freeze({
        surfaceRef: "package://@odd-sdlc/typescript-tenant/current",
        text: [
          "# Packaged SDLC Source Identity",
          "",
          `subjectRef: ${SDLC_GTL_PROGRAM_CONFORMANCE_SUBJECT_REF}`,
          `abiPackageVersion: ${ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.packageVersion}`,
          "",
          "```json",
          packageJsonText,
          "```"
        ].join("\n"),
        evidenceRefs: Object.freeze([
          "package://@odd-sdlc/typescript-tenant",
          "workspace://build_tenants/typescript/package.json"
        ])
      })
    );
  }
  return Object.freeze(rows);
}

function sourceAuthoritySurfaceForPath(
  surfaces: readonly SdlcSemanticSourceAuthoritySurface[],
  relativePath: string
): SdlcSemanticSourceAuthoritySurface | null {
  return (
    surfaces.find(
      (surface) =>
        surface.surfaceRef === relativePath ||
        surface.surfaceRef.endsWith(`/${relativePath}`)
    ) ?? null
  );
}

function functionSourceForName(input: {
  readonly source: string;
  readonly functionName: string;
}): string | null {
  const nameIndex = input.source.indexOf(`function ${input.functionName}`);
  if (nameIndex < 0) {
    return null;
  }
  const bodyStart = input.source.indexOf("{", nameIndex);
  if (bodyStart < 0) {
    return null;
  }
  let depth = 0;
  for (let index = bodyStart; index < input.source.length; index += 1) {
    const char = input.source[index];
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return input.source.slice(nameIndex, index + 1);
      }
    }
  }
  return null;
}

function assignmentWindow(input: {
  readonly source: string;
  readonly startToken: string;
  readonly endToken: string;
}): string | null {
  const start = input.source.indexOf(input.startToken);
  if (start < 0) {
    return null;
  }
  const end = input.source.indexOf(input.endToken, start);
  return input.source.slice(start, end < 0 ? undefined : end);
}

function sourceIncludesAny(
  source: string,
  tokens: readonly string[]
): boolean {
  return tokens.some((token) => source.includes(token));
}

function designDepthFragmentValueForCompilerFixture(
  section: SdlcDesignDepthRegisterFragmentSection
): unknown {
  switch (section) {
    case "stackProfileRows":
      return Object.freeze([
        Object.freeze({
          kind: "sdlc_stack_profile_row" as const,
          stackRef: "stack://odd-sdlc/compiler-fixture",
          language: "typescript",
          buildTool: "npm"
        })
      ]);
    case "implementationModuleRows":
      return Object.freeze([
        Object.freeze({
          kind: "sdlc_implementation_module_row" as const,
          moduleName: "semantic-compiler-fixture",
          moduleRef: "module://odd-sdlc/compiler-fixture"
        })
      ]);
    case "componentTopologyRows":
      return Object.freeze([
        Object.freeze({
          kind: "sdlc_component_topology_row" as const,
          componentId: "component://odd-sdlc/compiler-fixture",
          moduleName: "semantic-compiler-fixture",
          relativePath: "src/compiler-fixture.ts",
          publicBoundary: "compileFixture",
          concernRole: "other",
          requirementIds: Object.freeze(["REQ-T204-CARRIER-CLOSURE"]),
          sourceAssetRefs: Object.freeze(["fixture://odd-sdlc/t204"])
        })
      ]);
    case "componentRealizationRows":
      return Object.freeze([
        Object.freeze({
          kind: "sdlc_component_realization_row" as const,
          componentId: "component://odd-sdlc/compiler-fixture",
          moduleName: "semantic-compiler-fixture",
          relativePath: "src/compiler-fixture.ts",
          publicBoundary: "compileFixture",
          trancheId: "tranche://odd-sdlc/compiler-fixture",
          firstProductFileToChange: "src/compiler-fixture.ts",
          upstreamComponentIds: Object.freeze([]),
          requirementIds: Object.freeze(["REQ-T204-CARRIER-CLOSURE"]),
          sourceAssetRefs: Object.freeze(["fixture://odd-sdlc/t204"])
        })
      ]);
    case "fileTargetRows":
      return Object.freeze([
        Object.freeze({
          kind: "sdlc_file_target_row" as const,
          relativePath: "src/compiler-fixture.ts",
          role: "source"
        })
      ]);
    case "aggregateDomainModel":
      return Object.freeze({
        kind: "sdlc_aggregate_domain_model" as const,
        modelVersion: "ts-design-depth-v1",
        entities: Object.freeze([]),
        operations: Object.freeze([]),
        crossModuleReferences: Object.freeze([]),
        evidenceRefs: Object.freeze(["fixture://odd-sdlc/t204"])
      });
    case "aggregateSunnyDaySequence":
      return Object.freeze({
        kind: "sdlc_aggregate_sunny_day_sequence" as const,
        sequenceVersion: "ts-design-depth-v1",
        steps: Object.freeze([]),
        evidenceRefs: Object.freeze(["fixture://odd-sdlc/t204"])
      });
    case "designCompletenessVerdict":
      return Object.freeze({
        kind: "sdlc_design_completeness_verdict" as const,
        verdictVersion: "ts-design-depth-v1",
        entity: Object.freeze({
          kind: "sdlc_design_completeness_axis_verdict" as const,
          axis: "entity" as const,
          status: "partial" as const,
          reasons: Object.freeze(["fixture intentionally lacks entity depth"]),
          evidenceRefs: Object.freeze(["fixture://odd-sdlc/t204"])
        }),
        attribute: Object.freeze({
          kind: "sdlc_design_completeness_axis_verdict" as const,
          axis: "attribute" as const,
          status: "partial" as const,
          reasons: Object.freeze(["fixture intentionally lacks attribute depth"]),
          evidenceRefs: Object.freeze(["fixture://odd-sdlc/t204"])
        }),
        flow: Object.freeze({
          kind: "sdlc_design_completeness_axis_verdict" as const,
          axis: "flow" as const,
          status: "partial" as const,
          reasons: Object.freeze(["fixture intentionally lacks flow depth"]),
          evidenceRefs: Object.freeze(["fixture://odd-sdlc/t204"])
        })
      });
    case "aggregateDomainModelRows":
    case "moduleSchemaFragments":
    case "moduleStateDiagramFragments":
    case "sunnyDaySequenceRows":
      return Object.freeze([]);
    default: {
      const exhaustive: never = section;
      throw new TypeError(`unsupported design-depth section ${exhaustive}`);
    }
  }
}

function designDepthCarrierMaterializationIssues():
  readonly SdlcSemanticCarrierClosureIssue[] {
  const selectedIdentity = Object.freeze({
    selectedCompositionRef:
      "composition://odd-sdlc/compiler/design-depth-materialization",
    selectedCompositionDigest: "sha256:compiler-design-depth-materialization",
    selectedCompositionSelectionRef:
      "selection://odd-sdlc/compiler/design-depth-materialization",
    selectedRegimeBindingRef: null
  });
  const tempRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-carrier-closure-"));
  try {
    const contentRegisterPath = path.join(
      tempRoot,
      "design_depth_fp_evaluator_content_register.json"
    );
    const registerPath = path.join(
      tempRoot,
      "design_depth_fp_evaluator_register.json"
    );
    const sections: readonly SdlcDesignDepthRegisterFragmentSection[] =
      Object.freeze([
        "stackProfileRows",
        "implementationModuleRows",
        "aggregateDomainModelRows",
        "moduleSchemaFragments",
        "moduleStateDiagramFragments",
        "aggregateDomainModel",
        "sunnyDaySequenceRows",
        "aggregateSunnyDaySequence",
        "componentTopologyRows",
        "componentRealizationRows",
        "fileTargetRows",
        "designCompletenessVerdict"
      ]);
    writeFileSync(
      contentRegisterPath,
      `${JSON.stringify(
        {
          kind: "sdlc_evaluate_content_ledger",
          ledgerVersion: "ts-evaluate-content-ledger-v1",
          stage: "evaluate.C",
          ruleRef: "evaluation-rule://odd-sdlc/design-depth-register/fp",
          ruleRole: "semantic_judgment",
          computeMeans: "F_P",
          authorityFunction: "synthesize_model",
          selectedCompositionRef: selectedIdentity.selectedCompositionRef,
          selectedCompositionDigest: selectedIdentity.selectedCompositionDigest,
          selectedCompositionSelectionRef:
            selectedIdentity.selectedCompositionSelectionRef,
          selectedRegimeBindingRef: selectedIdentity.selectedRegimeBindingRef,
          compositionContributionRef: selectedIdentity.selectedCompositionRef,
          sourceBasisRefs: ["fixture://odd-sdlc/t204"],
          candidateArtifactRefs: ["fixture://odd-sdlc/t204/design"],
          evidenceRefs: ["fixture://odd-sdlc/t204"],
          contentRows: sections.map((section, index) => ({
            kind: "sdlc_evaluate_content_ledger_row",
            rowRef: `content-ledger-row://odd-sdlc/compiler-fixture/${section}`,
            authorityFunction: "synthesize_model",
            carrierFamily: "ProductAssetModel",
            contentKind: "sdlc_design_depth_register_fragment",
            payload: {
              kind: "sdlc_design_depth_register_fragment",
              fragmentVersion: "ts-design-depth-fragment-v1",
              targetAssetType: "implementation_design_surface",
              section,
              sequence: index + 1,
              mergeMode: "replace",
              value: designDepthFragmentValueForCompilerFixture(section)
            },
            sourceBasisRefs: ["fixture://odd-sdlc/t204"],
            evidenceRefs: ["fixture://odd-sdlc/t204"]
          }))
        },
        null,
        2
      )}\n`,
      "utf8"
    );
    const admission = admitSdlcEvaluateContentRegisterArtifactForSelectedIdentity({
      registerPath: contentRegisterPath,
      selectedIdentity,
      ruleRef: "evaluation-rule://odd-sdlc/design-depth-register/fp",
      authorityFunction: "synthesize_model",
      computeMeans: "F_P"
    });
    if (admission.status !== "admitted" || admission.register === null) {
      return Object.freeze([
        Object.freeze({
          code: "design_depth_materialization_fixture_unadmitted" as const,
          surfaceRef: "compiler://odd-sdlc/t204/carrier-closure-fixture",
          detail:
            admission.blockingReasons.join("; ") ||
            "syntactic evaluate content ledger fixture was rejected"
        })
      ]);
    }
    try {
      writeDesignDepthRegisterProjectionFromEvaluateContentRegister({
        register: admission.register,
        archiveRoot: tempRoot,
        registerPath
      });
      return Object.freeze([
        Object.freeze({
          code:
            "design_depth_materialization_semantic_floor_regression" as const,
          surfaceRef:
            "build_tenants/typescript/code/src/operator/plugins/evaluate/content_register.ts",
          detail:
            "structurally complete but semantically shallow design-depth F_P content ledger projected as an admitted register"
        })
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      return /semantic floor missing/u.test(message)
        ? Object.freeze([])
        : Object.freeze([
            Object.freeze({
              code:
                "design_depth_materialization_semantic_floor_regression" as const,
              surfaceRef:
                "build_tenants/typescript/code/src/operator/plugins/evaluate/content_register.ts",
              detail:
                `shallow design-depth F_P content ledger failed for the wrong reason: ${message}`
            })
          ]);
    }
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

export function semanticCarrierClosureIssuesForSurfaces(
  surfaces: readonly SdlcSemanticSourceAuthoritySurface[]
): readonly SdlcSemanticCarrierClosureIssue[] {
  const issues: SdlcSemanticCarrierClosureIssue[] = [
    ...designDepthCarrierMaterializationIssues()
  ];
  const contentRegister = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/operator/plugins/evaluate/content_register.ts"
  );
  if (
    contentRegister !== null &&
    (!contentRegister.text.includes("assertDesignDepthRegisterSemanticFloor(payload)") ||
      !contentRegister.text.includes(
        "evaluate_content_ledger_design_depth_payload_invalid"
      ))
  ) {
    issues.push({
      code: "design_depth_content_register_semantic_floor_missing",
      surfaceRef: contentRegister.surfaceRef,
      detail:
        "materialized design-depth F_P content ledgers must pass the semantic floor before register projection or admission"
    });
  }

  const installedOperator = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/operator/installed_operator.ts"
  );
  if (installedOperator !== null) {
    const blockedOutcomeStart = installedOperator.text.indexOf(
      "dispatchState.current = stateWithBlockedDesignDepthFpEvaluatorOutcome({"
    );
    const blockedOutcomeEnd =
      blockedOutcomeStart < 0
        ? -1
        : installedOperator.text.indexOf("return outcome;", blockedOutcomeStart);
    const publicationIndex =
      blockedOutcomeStart < 0
        ? -1
        : installedOperator.text.indexOf(
            "publishDispatchState(dispatchState.current);",
            blockedOutcomeStart
          );
    if (
      blockedOutcomeStart < 0 ||
      blockedOutcomeEnd < 0 ||
      publicationIndex < 0 ||
      publicationIndex > blockedOutcomeEnd
    ) {
      issues.push({
        code: "blocked_fp_evaluator_outcome_without_dispatch_publication",
        surfaceRef: installedOperator.surfaceRef,
        detail:
          "blocked design-depth F_P evaluator outcomes must publish dispatch state so postflight, closure, and residual-pressure artifacts materialize"
      });
    }
  }

  const postflight = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/operator/plugins/evaluate/postflight.ts"
  );
  if (postflight !== null) {
    const continuationAssignment = assignmentWindow({
      source: postflight.text,
      startToken: "const continuationRefs =",
      endToken: "const finding:"
    });
    if (
      continuationAssignment === null ||
      !postflight.text.includes(
        "const emptyContinuationRefs: readonly string[] = Object.freeze([]);"
      ) ||
      !continuationAssignment.includes('closeDisposition === "close_proposed"') ||
      !continuationAssignment.includes("? emptyContinuationRefs")
    ) {
      issues.push({
        code: "close_proposed_emits_continuation_refs",
        surfaceRef: postflight.surfaceRef,
        detail:
          "close-proposed F_P evaluations must emit no continuation refs; continuation refs imply non-close pressure"
      });
    }
  }

  return Object.freeze(issues);
}

function assertSemanticCarrierClosureReviewPassed(
  surfaces: readonly SdlcSemanticSourceAuthoritySurface[]
): void {
  const issues = semanticCarrierClosureIssuesForSurfaces(surfaces);
  if (issues.length > 0) {
    throw new TypeError(
      [
        "SDLC semantic carrier-closure compiler review failed:",
        ...issues.map(
          (issue) =>
            `- ${issue.code} at ${issue.surfaceRef}: ${issue.detail}`
        )
      ].join("\n")
    );
  }
}

export function constructCurrentSdlcSemanticCarrierClosureReviewReport(
  input: SdlcGtlProgramConformanceInputOptions = {}
): SdlcSemanticCarrierClosureReviewReport {
  const issues = semanticCarrierClosureIssuesForSurfaces(
    activeSdlcSourceIdentitySurfaces(input)
  );
  return Object.freeze({
    kind: "sdlc_semantic_carrier_closure_review_report" as const,
    reportVersion: "ts-semantic-carrier-closure-review-v1" as const,
    passed: issues.length === 0,
    issueCount: issues.length,
    issues
  });
}

export function assertCurrentSdlcSemanticCarrierClosureReview(
  input: SdlcGtlProgramConformanceInputOptions = {}
): SdlcSemanticCarrierClosureReviewReport {
  const report = constructCurrentSdlcSemanticCarrierClosureReviewReport(input);
  if (!report.passed) {
    throw new TypeError(
      [
        "SDLC semantic carrier-closure compiler review failed:",
        ...report.issues.map(
          (issue) =>
            `- ${issue.code} at ${issue.surfaceRef}: ${issue.detail}`
        )
      ].join("\n")
    );
  }
  return report;
}

export function semanticSourceAuthorityIssuesForSurfaces(
  surfaces: readonly SdlcSemanticSourceAuthoritySurface[]
): readonly SdlcSemanticSourceAuthorityIssue[] {
  const issues: SdlcSemanticSourceAuthorityIssue[] = [];
  const designDepthRegister = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/operator/plugins/evaluate/design_depth_register.ts"
  );
  if (
    designDepthRegister !== null &&
    sourceIncludesAny(designDepthRegister.text, [
      "predecessorDesignRegisterArchiveIsAccepted",
      "acceptedArchiveRoots",
      "sdlc_edge_closure_decision.json",
      "postflight.json"
    ])
  ) {
    issues.push({
      code: "design_depth_archive_status_authority",
      surfaceRef: designDepthRegister.surfaceRef,
      detail:
        "design-depth predecessor selection must not treat archive status files as acceptance authority"
    });
  }

  const installedOperator = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/operator/installed_operator.ts"
  );
  if (installedOperator !== null) {
    const filterBody = functionSourceForName({
      source: installedOperator.text,
      functionName: "currentPostflightBlocksReviewGradeEvaluator"
    });
    const blockerAssignment = assignmentWindow({
      source: installedOperator.text,
      startToken: "const currentPostflightBlockers",
      endToken: "if (currentPostflightBlockers.length > 0)"
    });
    const retryableReentriesRemainExcluded =
      filterBody !== null &&
      filterBody.includes('lawfulReentryPoint !== "same_edge_retry"') &&
      filterBody.includes('lawfulReentryPoint !== "repair_worker_output"') &&
      filterBody.includes('lawfulReentryPoint !== "escalate_to_fp"') &&
      blockerAssignment !== null &&
      blockerAssignment.includes(".filter(") &&
      blockerAssignment.includes("currentPostflightBlocksReviewGradeEvaluator");
    if (
      installedOperator.text.includes("currentPostflightBlockers") &&
      installedOperator.text.includes(
        "activePostflightBlockingReasonCarriers(input.currentPostflight)"
      ) &&
      !retryableReentriesRemainExcluded
    ) {
      issues.push({
        code: "review_grade_retryable_postflight_short_circuit",
        surfaceRef: installedOperator.surfaceRef,
        detail:
          "review-grade current-postflight short-circuit must exclude retryable reentry before constructing a triage gap"
      });
    }
  }

  const workspaceApi = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/workspace_api/entry.ts"
  );
  if (
    workspaceApi !== null &&
    sourceIncludesAny(workspaceApi.text, [
      "sdlc_edge_closure_decision.json",
      "sdlc_next_action_projection.json",
      "postflight.json",
      "fp_evaluate_result.json"
    ])
  ) {
    if (
      sourceIncludesAny(workspaceApi.text, [
        "writeSdlcSystemArtifact",
        "constructSdlcEdgeClosureDecision",
        "deriveSdlcNextActionProjection"
      ])
    ) {
      issues.push({
        code: "workspace_gaps_read_model_authors_runtime_truth",
        surfaceRef: workspaceApi.surfaceRef,
        detail:
          "workspace gaps archive reads may be diagnostic read-model input only; they must not author closure, next-action, or artifact truth"
      });
    }
    if (
      sourceIncludesAny(workspaceApi.text, [
        "executeInstalledOperatorStart",
        "publicStartOnce",
        "runEngineIterate"
      ])
    ) {
      issues.push({
        code: "workspace_gaps_read_model_invokes_runtime_control",
        surfaceRef: workspaceApi.surfaceRef,
        detail:
          "workspace gaps archive reads may not invoke local traversal/start/control"
      });
    }
  }

  const transformResultProjection = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/operator/plugins/transform/result_projection.ts"
  );
  if (transformResultProjection !== null) {
    const lineageBody = functionSourceForName({
      source: transformResultProjection.text,
      functionName: "materializedFileRequirementLineage"
    });
    if (
      lineageBody !== null &&
      lineageBody.includes("contentCarriesRequirementObligation({") &&
      !lineageBody.includes("contentCarriesRequirementObligationWithMarkers({")
    ) {
      issues.push({
        code: "product_materialization_lineage_unbounded_requirement_marker_scan",
        surfaceRef: transformResultProjection.surfaceRef,
        detail:
          "product-materialization lineage projection must cache requirement markers per materialized file before checking obligation equivalence"
      });
    }
    const postTransformAssessmentBody = functionSourceForName({
      source: transformResultProjection.text,
      functionName: "postTransformObligationAssessments"
    });
    if (
      postTransformAssessmentBody !== null &&
      postTransformAssessmentBody.includes(
        "traversalObligationContext.obligations.map"
      ) &&
      !postTransformAssessmentBody.includes(
        "activeReportObligationsForPostTransform"
      )
    ) {
      issues.push({
        code: "post_transform_report_uses_broad_manifest_scope",
        surfaceRef: transformResultProjection.surfaceRef,
        detail:
          "post-transform worker_result_report assessments must use admitted active report scope, not broad traversal obligations"
      });
    }
    if (
      postTransformAssessmentBody !== null &&
      postTransformAssessmentBody.includes("contentCarriesRequirementObligation({") &&
      !postTransformAssessmentBody.includes("contentCarriesRequirementObligationWithMarkers({")
    ) {
      issues.push({
        code: "product_materialization_lineage_unbounded_requirement_marker_scan",
        surfaceRef: transformResultProjection.surfaceRef,
        detail:
          "post-transform obligation assessment must cache requirement markers per evidence file before checking every obligation"
      });
    }
  }

  const postflightChecks = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/operator/plugins/evaluate/postflight_checks.ts"
  );
  if (postflightChecks !== null) {
    const productFileBody = functionSourceForName({
      source: postflightChecks.text,
      functionName: "evaluateMaterializedProductFiles"
    });
    if (
      productFileBody !== null &&
      productFileBody.includes("contentCarriesRequirementObligation({") &&
      !productFileBody.includes("contentCarriesRequirementObligationWithMarkers({")
    ) {
      issues.push({
        code: "product_materialization_lineage_unbounded_requirement_marker_scan",
        surfaceRef: postflightChecks.surfaceRef,
        detail:
          "product-materialization postflight must cache requirement markers per materialized file before checking obligation equivalence"
      });
    }
  }

  const traversalConsequence = sourceAuthoritySurfaceForPath(
    surfaces,
    "build_tenants/typescript/code/src/operator/traversal_consequence.ts"
  );
  if (traversalConsequence !== null) {
    const graphReentryTargetBody = functionSourceForName({
      source: traversalConsequence.text,
      functionName: "constructSdlcGraphReentryTargetRef"
    });
    if (
      graphReentryTargetBody !== null &&
      (graphReentryTargetBody.includes('? "odd-sdlc"') ||
        !traversalConsequence.text.includes("GRAPH_REENTRY_POINT_VALUES"))
    ) {
      issues.push({
        code: "consequence_reentry_target_uses_abg_graph_reentry_point",
        surfaceRef: traversalConsequence.surfaceRef,
        detail:
          "consequence traversal re-entry target refs must use ABG GraphReentryPoint values, not product namespaces"
      });
    }
  }

  return Object.freeze(issues);
}

function assertSemanticSourceAuthorityReviewPassed(
  surfaces: readonly SdlcSemanticSourceAuthoritySurface[]
): void {
  const issues = semanticSourceAuthorityIssuesForSurfaces(surfaces);
  if (issues.length > 0) {
    throw new TypeError(
      [
        "SDLC semantic source-authority compiler review failed:",
        ...issues.map(
          (issue) =>
            `- ${issue.code} at ${issue.surfaceRef}: ${issue.detail}`
        )
      ].join("\n")
    );
  }
}

function sourceAuthorityPolicyRows(): readonly SdlcGtlProgramSourceAuthorityPolicyRow[] {
  return Object.freeze([
    Object.freeze({
      policyRef:
        "abg://gtl-program/source-authority/no-design-depth-archive-status-acceptance",
      sourceSurfaceRefs: Object.freeze([
        SDLC_SOURCE_AUTHORITY_DESIGN_DEPTH_REGISTER_REF
      ]),
      sourceSurfaceRefPrefixes: Object.freeze([]),
      forbiddenTokens: Object.freeze([
        "predecessorDesignRegisterArchiveIsAccepted",
        "acceptedArchiveRoots",
        "sdlc_edge_closure_decision.json",
        "postflight.json"
      ]),
      forbiddenMatch: "any" as const,
      requiredMitigationTokens: Object.freeze([]),
      message:
        "design-depth predecessor selection must not treat archive status files as acceptance authority",
      evidenceRefs: Object.freeze(["ticket://odd-sdlc/T-204"])
    }),
    Object.freeze({
      policyRef:
        "abg://gtl-program/source-authority/no-unfiltered-current-postflight-review-grade-downgrade",
      sourceSurfaceRefs: Object.freeze([
        SDLC_SOURCE_AUTHORITY_INSTALLED_OPERATOR_REF
      ]),
      sourceSurfaceRefPrefixes: Object.freeze([]),
      forbiddenTokens: Object.freeze([
        "activePostflightBlockingReasonCarriers(input.currentPostflight)",
        "currentPostflightBlockers"
      ]),
      forbiddenMatch: "all" as const,
      requiredMitigationTokens: Object.freeze([
        'lawfulReentryPoint !== "same_edge_retry"',
        'lawfulReentryPoint !== "repair_worker_output"',
        'lawfulReentryPoint !== "escalate_to_fp"'
      ]),
      message:
        "review-grade current-postflight shortcut must exclude retryable reentry before constructing triage pressure",
      evidenceRefs: Object.freeze(["ticket://odd-sdlc/T-204"])
    }),
    Object.freeze({
      policyRef:
        "abg://gtl-program/source-authority/workspace-gaps-read-model-does-not-author-runtime-truth",
      sourceSurfaceRefs: Object.freeze([
        SDLC_SOURCE_AUTHORITY_WORKSPACE_API_ENTRY_REF
      ]),
      sourceSurfaceRefPrefixes: Object.freeze([]),
      forbiddenTokens: Object.freeze([
        "writeSdlcSystemArtifact",
        "constructSdlcEdgeClosureDecision",
        "deriveSdlcNextActionProjection"
      ]),
      forbiddenMatch: "any" as const,
      requiredMitigationTokens: Object.freeze([]),
      message:
        "workspace gaps archive reads may be diagnostic input only; they must not author closure, next-action, or artifact truth",
      evidenceRefs: Object.freeze(["ticket://odd-sdlc/T-204"])
    }),
    Object.freeze({
      policyRef:
        "abg://gtl-program/source-authority/workspace-gaps-read-model-does-not-invoke-runtime-control",
      sourceSurfaceRefs: Object.freeze([
        SDLC_SOURCE_AUTHORITY_WORKSPACE_API_ENTRY_REF
      ]),
      sourceSurfaceRefPrefixes: Object.freeze([]),
      forbiddenTokens: Object.freeze([
        "executeInstalledOperatorStart",
        "publicStartOnce",
        "runEngineIterate"
      ]),
      forbiddenMatch: "any" as const,
      requiredMitigationTokens: Object.freeze([]),
      message:
        "workspace gaps archive reads may not invoke local traversal, start, or iteration control",
      evidenceRefs: Object.freeze(["ticket://odd-sdlc/T-204"])
    }),
    Object.freeze({
      policyRef:
        "abg://gtl-program/source-authority/product-materialization-lineage-caches-requirement-markers",
      sourceSurfaceRefs: Object.freeze([
        SDLC_SOURCE_AUTHORITY_TRANSFORM_RESULT_PROJECTION_REF,
        SDLC_SOURCE_AUTHORITY_POSTFLIGHT_CHECKS_REF
      ]),
      sourceSurfaceRefPrefixes: Object.freeze([]),
      forbiddenTokens: Object.freeze([
        "contentCarriesRequirementObligation({",
        "REQUIREMENT_MARKER_EXPRESSION"
      ]),
      forbiddenMatch: "all" as const,
      requiredMitigationTokens: Object.freeze([
        "normalizedRequirementMarkersForContent",
        "contentCarriesRequirementObligationWithMarkers"
      ]),
      message:
        "product-materialization lineage checks must not rescan requirement markers for every obligation/file pairing",
      evidenceRefs: Object.freeze(["ticket://odd-sdlc/T-204"])
    }),
    Object.freeze({
      policyRef:
        "abg://gtl-program/source-authority/post-transform-report-uses-active-report-scope",
      sourceSurfaceRefs: Object.freeze([
        SDLC_SOURCE_AUTHORITY_TRANSFORM_RESULT_PROJECTION_REF
      ]),
      sourceSurfaceRefPrefixes: Object.freeze([]),
      forbiddenTokens: Object.freeze([
        "traversalObligationContext.obligations.map",
        "postTransformObligationAssessments"
      ]),
      forbiddenMatch: "all" as const,
      requiredMitigationTokens: Object.freeze([
        "activeReportObligationsForPostTransform",
        "activeReportObligationIds"
      ]),
      message:
        "post-transform worker_result_report assessments must use admitted active report scope, not broad traversal obligations",
      evidenceRefs: Object.freeze(["ticket://odd-sdlc/T-204"])
    }),
    Object.freeze({
      policyRef:
        "abg://gtl-program/source-authority/consequence-reentry-target-uses-abg-graph-reentry-point",
      sourceSurfaceRefs: Object.freeze([
        SDLC_SOURCE_AUTHORITY_TRAVERSAL_CONSEQUENCE_REF
      ]),
      sourceSurfaceRefPrefixes: Object.freeze([]),
      forbiddenTokens: Object.freeze([
        '? "odd-sdlc"',
        "graph-reentry-point://"
      ]),
      forbiddenMatch: "all" as const,
      requiredMitigationTokens: Object.freeze([
        "GRAPH_REENTRY_POINT_VALUES"
      ]),
      message:
        "consequence traversal re-entry target refs must use ABG GraphReentryPoint values, not product namespaces",
      evidenceRefs: Object.freeze([
        "ticket://odd-sdlc/T-204",
        "ticket://abiogenesis/T-159"
      ])
    })
  ]);
}

function promptSection(title: string) {
  return sdlcPromptSectionFromLines({
    role: "purpose",
    title,
    textLines: [
      "Construct or evaluate the declared SDLC carrier through the typed prompt asset boundary."
    ],
    intent: "Prove prompt construction is a GTL AssetSurface/Node view.",
    expectedOutcome:
      "The prompt projection preserves typed constructor, authority, proof, and digest refs.",
    failureModeAddressed:
      "Prompt prose or MCP-shaped schema becomes the source of contract truth.",
    appliesWhen:
      "The SDLC program inventory is typechecked for GTL program conformance.",
    provenanceRefs: ["ticket://odd-sdlc/T-197"],
    authorityBasisRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"]
  });
}

function evaluationGridContractForConformance() {
  return constructSdlcEvaluationGridContract({
    logicalGridRef: "evaluation-grid://odd-sdlc/program-conformance/current",
    physicalExecution: "fused_prompt",
    transformUnits: [
      {
        kind: "sdlc_transform_unit_ref",
        unitRef: "transform-unit://odd-sdlc/program-conformance/current/one",
        segmentKey: "single",
        sourceAssetRefs: ["workspace://source"],
        targetAssetRefs: ["workspace://target"],
        obligationRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"]
      }
    ],
    evaluationDimensions: [
      {
        kind: "sdlc_evaluation_dimension_ref",
        dimensionRef:
          "evaluation-dimension://odd-sdlc/program-conformance/current/cell-quality",
        scope: "cell",
        expectedFindingRef:
          "evaluation-finding://odd-sdlc/program-conformance/current/cell-quality"
      }
    ],
    disambiguationCarriers: [
      {
        kind: "sdlc_disambiguation_carrier_ref",
        carrierRef:
          "carrier://odd-sdlc/program-conformance/current/cell-quality",
        scopeRef: "evaluation-scope://odd-sdlc/program-conformance/current/single",
        authoritySnapshotRefs: ["authority://odd-sdlc/product"],
        priorFindingRefs: [],
        lineageRefs: ["lineage://odd-sdlc/program-conformance/current"]
      }
    ],
    expectedFindingRefs: [
      "evaluation-finding://odd-sdlc/program-conformance/current/cell-quality"
    ],
    abgOutcomeFoldRef: currentAbgFoldRef(),
    provenanceRefs: ["ticket://odd-sdlc/T-197"]
  });
}

function promptAssetRowFromProjection(input: {
  readonly surfaceRef: string;
  readonly projection: SdlcRenderedPromptProjection;
  readonly evidenceRefs?: readonly string[] | undefined;
}) {
  return Object.freeze({
    surfaceRef: input.surfaceRef,
    assetSurface: input.projection.invocationAsset.gtlNode.assetSurface,
    gtlNode: input.projection.invocationAsset.gtlNode,
    renderedViewDigest: input.projection.invocationAsset.renderedPromptDigest,
    currentAbgFoldRefs:
      input.projection.invocationAsset.evaluationGridContract === null
        ? Object.freeze([])
        : Object.freeze([
            input.projection.invocationAsset.evaluationGridContract.abgOutcomeFoldRef
          ]),
    evidenceRefs: Object.freeze([
      ...(input.evidenceRefs ?? Object.freeze([
        "workspace://build_tenants/typescript/code/src/operator/prompt_assets.ts",
        "workspace://build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts"
      ]))
    ])
  });
}

function promptProjectionRows(
  promptCases: readonly SemanticPromptProjectionReviewCase[]
) {
  const transformProjection = constructSdlcPromptInvocationProjection({
    promptFamily: "transform",
    stage: "transform.C",
    recipient: "transformer",
    targetAssetType: "sdlc_transform_candidate",
    constructorRef: "constructor://odd-sdlc/program-conformance/transform-prompt",
    authorityPacketRefs: ["authority://odd-sdlc/product"],
    obligationRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"],
    toolEffectPolicyRefs: ["tool-policy://odd-sdlc/program-conformance/read-write-output-only"],
    outputCarrierRefs: ["carrier://odd-sdlc/transform-candidate"],
    proofObligationRefs: ["proof://odd-sdlc/program-conformance/transform-prompt"],
    evaluationGridContract: null,
    promptSections: [promptSection("SDLC Transform Prompt Boundary")]
  });

  const evaluationProjection = constructSdlcPromptInvocationProjection({
    promptFamily: "evaluate_review_grade",
    stage: "evaluate.C",
    recipient: "evaluator",
    targetAssetType: "sdlc_review_grade_assessment",
    constructorRef: "constructor://odd-sdlc/program-conformance/evaluate-prompt",
    authorityPacketRefs: ["authority://odd-sdlc/product"],
    obligationRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"],
    toolEffectPolicyRefs: ["tool-policy://odd-sdlc/program-conformance/read-only"],
    outputCarrierRefs: ["carrier://odd-sdlc/review-grade-assessment"],
    proofObligationRefs: ["proof://odd-sdlc/program-conformance/evaluate-prompt"],
    evaluationGridContract: evaluationGridContractForConformance(),
    promptSections: [promptSection("SDLC Evaluate Prompt Boundary")]
  });

  const designDepthProjection = constructSdlcPromptInvocationProjection({
    promptFamily: "evaluate_design_depth",
    stage: "evaluate.C",
    recipient: "evaluator_subworkstream",
    targetAssetType: "implementation_design_surface",
    constructorRef:
      "constructor://odd-sdlc/program-conformance/design-depth-prompt",
    authorityPacketRefs: ["authority://odd-sdlc/product"],
    obligationRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"],
    toolEffectPolicyRefs: [
      "tool-policy://odd-sdlc/program-conformance/design-depth-output-only"
    ],
    outputCarrierRefs: [
      "carrier://odd-sdlc/design-depth-register",
      "carrier://odd-sdlc/implementation-design-surface"
    ],
    proofObligationRefs: [
      "proof://odd-sdlc/program-conformance/design-depth-prompt"
    ],
    evaluationGridContract: evaluationGridContractForConformance(),
    promptSections: [promptSection("SDLC Design-Depth Prompt Boundary")]
  });

  const genericPromptRows = [transformProjection, designDepthProjection, evaluationProjection]
    .map((projection) =>
      promptAssetRowFromProjection({
        surfaceRef:
          `prompt://odd-sdlc/${projection.invocationAsset.promptFamily}` +
          `/${projection.invocationAsset.stage}`,
        projection
      })
    );
  const materializedPromptRows = promptCases.map((promptCase) =>
    promptAssetRowFromProjection({
      surfaceRef:
        `prompt://odd-sdlc/materialized` +
        `/${stringForRef(promptCase.graphFunctionName)}` +
        `/${promptCase.vectorIndex}` +
        `/${stringForRef(promptCase.edgeRef)}`,
      projection: promptCase.promptProjection,
      evidenceRefs: Object.freeze([
        "workspace://build_tenants/typescript/code/src/gtl_conformance/program.ts",
        "workspace://build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts",
        "workspace://build_tenants/typescript/code/src/operator/prompt_assets.ts"
      ])
    })
  );
  return Object.freeze([...genericPromptRows, ...materializedPromptRows]);
}

export interface SdlcPromptProjectionReviewIssue {
  readonly edgeRef: string;
  readonly code:
    | "prompt_materialization_failed"
    | "prompt_asset_missing_target_carrier_ref"
    | "prompt_asset_missing_work_category"
    | "prompt_asset_missing_sections"
    | "prompt_missing_selected_target_carrier_envelope"
    | "prompt_contradicts_selected_target_carrier_envelope"
    | "prompt_inner_register_claims_top_level_authority"
    | "prompt_contradicts_worker_tool_write_policy"
    | "prompt_empty_liveness_packet_claims_semantic_progress"
    | "prompt_missing_design_depth_incremental_progress_protocol"
    | "prompt_missing_review_grade_progress_protocol"
    | "prompt_missing_review_grade_immediate_final_write_protocol"
    | "prompt_missing_review_grade_final_output_ban"
    | "prompt_missing_review_grade_read_only_workspace_boundary"
    | "prompt_missing_component_depth_whole_file_carrier_boundary"
    | "prompt_component_test_scope_contradiction"
    | "prompt_transform_scope_label_contradiction"
    | "fp_review_gate_result_missing"
    | "fp_review_gate_result_invalid";
  readonly detail: string;
}

function makeSemanticPromptReviewWorkspace(): string {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-prompt-review-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants/typescript/spec"), { recursive: true });
  writeFileSync(path.join(root, "README.md"), "# Prompt Review Fixture\n", "utf8");
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-PROMPT-REVIEW: Prove prompt projections before runtime.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    "# Requirements\n\nREQ-PROMPT-REVIEW-001: Rendered prompts must not contradict target-carrier contract law.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-prompt-review.md"),
    "# Prompt Review Requirements\n\nREQ-PROMPT-REVIEW-001: Rendered prompts must not contradict target-carrier contract law.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "## Active Tenant",
      "",
      "- **Tenant**: typescript",
      "- **Output Root**: `build_tenants/typescript`",
      "",
      "## Expected Files",
      "",
      "- `build_tenants/typescript/package.json` (role: `build_config`)",
      "- `build_tenants/typescript/src/index.ts` (role: `source`)",
      "- `build_tenants/typescript/test/index.test.ts` (role: `test`)",
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: prompt_review_fixture",
      "active_tenant: typescript",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript",
      "    language: typescript",
      "    build_tool: npm",
      "    build_command: npm run build",
      "    test_command: npm test",
      "    module_structure:",
      "      - app"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/typescript/spec/TECH_STACK.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_tenant_technology_stack_description",
        buildConfigTargets: ["package.json"],
        moduleLayout: { sourceRoots: ["src"] },
        testingTechStack: {
          testRoots: ["test"],
          testRunner: "npm test",
          proofCommands: ["npm test"],
          evidenceFormat: "tap"
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function reviewRenderedPromptProjection(input: {
  readonly edgeRef: string;
  readonly promptText: string;
  readonly outputCarrierKind: string;
  readonly contractRef: string;
  readonly contractDigest: string;
  readonly promptProjection: SdlcRenderedPromptProjection;
  readonly promptFamily?: string | undefined;
}): readonly SdlcPromptProjectionReviewIssue[] {
  const issues: SdlcPromptProjectionReviewIssue[] = [];
  const invocationAsset = input.promptProjection.invocationAsset;
  const promptFamily = input.promptFamily ?? invocationAsset.promptFamily;
  for (const required of [input.outputCarrierKind, input.contractRef]) {
    if (!invocationAsset.outputCarrierRefs.includes(required)) {
      issues.push({
        edgeRef: input.edgeRef,
        code: "prompt_asset_missing_target_carrier_ref",
        detail:
          `prompt asset outputCarrierRefs does not carry ${required}`
      });
    }
  }
  if (invocationAsset.workCategory !== input.edgeRef) {
    issues.push({
      edgeRef: input.edgeRef,
      code: "prompt_asset_missing_work_category",
      detail:
        `prompt asset workCategory=${invocationAsset.workCategory ?? "<null>"} does not match edge ${input.edgeRef}`
    });
  }
  if (invocationAsset.promptSections.length === 0) {
    issues.push({
      edgeRef: input.edgeRef,
      code: "prompt_asset_missing_sections",
      detail: "prompt invocation asset has no typed prompt sections"
    });
  }
  if (
    input.outputCarrierKind === "sdlc_test_design_surface_target_carrier"
  ) {
    const selectedEnvelopeDirective =
      `selected target-carrier envelope with \`kind:"${input.outputCarrierKind}"\``;
    if (!input.promptText.includes(selectedEnvelopeDirective)) {
      issues.push({
        edgeRef: input.edgeRef,
        code: "prompt_missing_selected_target_carrier_envelope",
        detail: `rendered prompt does not name ${selectedEnvelopeDirective}`
      });
    }
    for (const required of [
      `edgeRef:"${input.edgeRef}"`,
      `contractRef:"${input.contractRef}"`,
      `contractDigest:"${input.contractDigest}"`,
      'payload.kind:"sdlc_test_design_register"'
    ]) {
      if (!input.promptText.includes(required)) {
        issues.push({
          edgeRef: input.edgeRef,
          code: "prompt_missing_selected_target_carrier_envelope",
          detail: `rendered prompt does not carry ${required}`
        });
      }
    }
  }
  if (
    input.promptText.includes("Do not wrap the fenced register in a target-carrier envelope")
  ) {
    issues.push({
      edgeRef: input.edgeRef,
      code: "prompt_contradicts_selected_target_carrier_envelope",
      detail:
        "rendered prompt requests the selected target-carrier envelope and also forbids wrapping the fenced register"
    });
  }
  if (input.promptText.includes("top-level kind is sdlc_test_design_register")) {
    issues.push({
      edgeRef: input.edgeRef,
      code: "prompt_inner_register_claims_top_level_authority",
      detail:
        "rendered prompt assigns top-level authority to the inner register instead of the selected target-carrier envelope"
    });
  }
  if (
    input.outputCarrierKind === "sdlc_component_test_surface_target_carrier" &&
    input.promptText.includes(
      "Every admitted requirement obligation in workerInvocationPackage.traversalObligationContext.obligations"
    )
  ) {
    issues.push({
      edgeRef: input.edgeRef,
      code: "prompt_component_test_scope_contradiction",
      detail:
        "component-test prompt expands scoped test lineage to every traversal requirement obligation"
    });
  }
  if (
    promptFamily === "transform" &&
    input.promptText.includes("obligations in scope:") &&
    !input.promptText.includes("active report scope from inlineObligationIds:")
  ) {
    issues.push({
      edgeRef: input.edgeRef,
      code: "prompt_transform_scope_label_contradiction",
      detail:
        "transform prompt labels broad traversal obligations as in-scope without naming the admitted inlineObligationIds report scope"
    });
  }
  if (
    promptFamily === "transform" &&
    input.promptText.includes("whole-file JSON component_depth_register")
  ) {
    for (const required of [
      "The output file content must be exactly that selected-carrier JSON object",
      "first non-whitespace character `{`",
      "final non-whitespace character `}`",
      "no Markdown headings, tables, prose preamble, fenced code blocks, or trailing text outside the JSON object"
    ]) {
      if (!input.promptText.includes(required)) {
        issues.push({
          edgeRef: input.edgeRef,
          code: "prompt_missing_component_depth_whole_file_carrier_boundary",
          detail:
            `component-depth transform prompt does not carry exact whole-file selected-carrier boundary marker: ${required}`
        });
      }
    }
  }
  if (promptFamily === "evaluate_design_depth") {
    if (input.promptText.includes("Do not Read anything before this Write")) {
      issues.push({
        edgeRef: input.edgeRef,
        code: "prompt_contradicts_worker_tool_write_policy",
        detail:
          "design-depth evaluator prompt forbids the read required before overwriting the pre-created ledger slot"
      });
    }
    if (input.promptText.includes("intentionally carries empty/null partial values")) {
      issues.push({
        edgeRef: input.edgeRef,
        code: "prompt_empty_liveness_packet_claims_semantic_progress",
        detail:
          "design-depth evaluator prompt treats an empty/null liveness packet as semantic progress instead of a typed partial verdict"
      });
    }
    for (const required of [
      "Progress-timeout protection:",
      "component/file-target semantic checkpoint",
      "Minimum semantic checkpoint:",
      "Minimum semantic checkpoint JSON packet:",
      "every design-depth fragment section must be present",
      "stackProfileRows, implementationModuleRows, componentTopologyRows, componentRealizationRows, and fileTargetRows must be non-empty",
      "Do not wait to enumerate every component/module before this checkpoint",
      "Precomputed ADR implementation-design evidence summary:",
      "The next progress checkpoint after the first update is the component/file-target semantic checkpoint",
      "do not write a plan or checklist",
      '"section": "stackProfileRows"',
      '"section": "implementationModuleRows"',
      '"section": "fileTargetRows"',
      '"section": "componentTopologyRows"',
      '"section": "componentRealizationRows"'
    ]) {
      if (!input.promptText.includes(required)) {
        issues.push({
          edgeRef: input.edgeRef,
          code: "prompt_missing_design_depth_incremental_progress_protocol",
          detail:
            `design-depth evaluator prompt does not carry required incremental progress protocol marker: ${required}`
        });
      }
    }
  }
  if (promptFamily === "evaluate_review_grade") {
    for (const required of [
      "The evaluator is read-only over workspace and product files",
      "Do not use Write, Edit",
      "Any Write/Edit tool path must equal the assessment artifact path",
      "every other workspace path is read-only"
    ]) {
      if (!input.promptText.includes(required)) {
        issues.push({
          edgeRef: input.edgeRef,
          code: "prompt_missing_review_grade_read_only_workspace_boundary",
          detail:
            `review-grade evaluator prompt does not carry required read-only workspace boundary marker: ${required}`
        });
      }
    }
    for (const required of [
      "Progress-timeout protection:",
      "First assessment checkpoint:",
      "First assessment checkpoint JSON must be valid whole-file JSON",
      "Final assessment write precedes optional schema verification",
      "Do not write a plan or checklist before the first assessment checkpoint"
    ]) {
      if (!input.promptText.includes(required)) {
        issues.push({
          edgeRef: input.edgeRef,
          code: "prompt_missing_review_grade_progress_protocol",
          detail:
            `review-grade evaluator prompt does not carry required progress protocol marker: ${required}`
        });
      }
    }
    if (
      !input.promptText.includes(
        "Final decision immediate-write rule:"
      ) ||
      !input.promptText.includes(
        "your next tool call must overwrite the assessment JSON"
      )
    ) {
      issues.push({
        edgeRef: input.edgeRef,
        code: "prompt_missing_review_grade_immediate_final_write_protocol",
        detail:
          "review-grade evaluator prompt does not bind final semantic decision to the next durable assessment write"
      });
    }
    if (
      !input.promptText.includes("Final decision output ban:") ||
      !input.promptText.includes("emit no assistant text") ||
      !input.promptText.includes(
        "the next emitted item must be the Write tool call"
      )
    ) {
      issues.push({
        edgeRef: input.edgeRef,
        code: "prompt_missing_review_grade_final_output_ban",
        detail:
          "review-grade evaluator prompt does not forbid final-decision prose before the durable assessment write"
      });
    }
  }
  return Object.freeze(issues);
}

export function semanticPromptProjectionIssuesForRenderedPrompt(input: {
  readonly edgeRef: string;
  readonly promptFamily: SdlcPromptFamily;
  readonly promptText: string;
  readonly outputCarrierKind: string;
  readonly contractRef: string;
  readonly contractDigest: string;
}): readonly SdlcPromptProjectionReviewIssue[] {
  const promptProjection: SdlcRenderedPromptProjection =
    constructSdlcPromptInvocationProjection({
      promptFamily: input.promptFamily,
      stage: input.promptFamily === "transform" ? "transform.C" : "evaluate.C",
      recipient: input.promptFamily === "transform" ? "transformer" : "evaluator",
      targetAssetType: input.outputCarrierKind,
      workCategory: input.edgeRef,
      edgePolicyRef: null,
      constructorRef:
        "constructor://odd-sdlc/semantic-prompt-projection-review",
      authorityPacketRefs: Object.freeze([]),
      obligationRefs: Object.freeze([]),
      toolEffectPolicyRefs: Object.freeze([]),
      outputCarrierRefs: Object.freeze([
        input.outputCarrierKind,
        input.contractRef
      ]),
      proofObligationRefs: Object.freeze([input.contractDigest]),
      promptSections: Object.freeze([
        sdlcPromptSectionFromLines({
          role: "prompt_body",
          title: "Rendered Prompt Under Review",
          textLines: Object.freeze([input.promptText]),
          intent: "Review a rendered prompt projection for semantic regressions.",
          authorityKindRefs: Object.freeze(["tool_effect_policy"]),
          expectedOutcome: "The prompt review emits deterministic issues.",
          failureModeAddressed:
            "Prompt projection review must use a typed prompt asset carrier.",
          appliesWhen: "semantic prompt projection tests provide rendered text"
        })
      ])
    });
  return reviewRenderedPromptProjection({
    edgeRef: input.edgeRef,
    promptText: input.promptText,
    outputCarrierKind: input.outputCarrierKind,
    contractRef: input.contractRef,
    contractDigest: input.contractDigest,
    promptFamily: input.promptFamily,
    promptProjection
  });
}

function semanticPromptProjectionReview(
  vectorRows: readonly MaterializedGraphVectorRow[]
): SemanticPromptProjectionReviewSummary {
  const workspaceRoot = makeSemanticPromptReviewWorkspace();
  try {
    const issues: SdlcPromptProjectionReviewIssue[] = [];
    const promptCases: SemanticPromptProjectionReviewCase[] = [];
    const nonPromptVectorRefs: string[] = [];
    vectorRows.forEach((row) => {
      let contract;
      try {
        contract = hookContractByEdgeName(row.vector.name);
      } catch {
        nonPromptVectorRefs.push(
          `${row.graphFunction.name}:${row.vector.name}`
        );
        return;
      }
      try {
        const manifest = deriveWorkerHandoffManifest({
          workspaceRoot,
          graphFunctionName: row.graphFunction.name,
          edgeName: contract.edgeName,
          vectorIndex: row.vectorIndex,
          contract,
          runId:
            `semantic-prompt-review` +
            `-${stringForRef(row.graphFunction.name)}` +
            `-${row.vectorIndex}` +
            `-${stringForRef(row.vector.name)}`
        });
        const promptProjection = promptForHandoffProjection(manifest);
        promptCases.push(Object.freeze({
          graphFunctionName: row.graphFunction.name,
          edgeRef: row.vector.name,
          graphFunctionId: row.graphFunction.id,
          graphId: row.graph.id,
          graphVectorId: row.vector.id,
          vectorIndex: row.vectorIndex,
          targetAssetType: manifest.targetAssetType,
          outputCarrierKind:
            manifest.targetCarrierProjection.outputCarrierKind,
          contractRef:
            manifest.targetCarrierProjection.targetCarrierContractRef,
          contractDigest:
            manifest.targetCarrierProjection.targetCarrierContractDigest,
          promptProjection
        }));
        issues.push(
          ...reviewRenderedPromptProjection({
            edgeRef: row.vector.name,
            promptText: promptProjection.promptText,
            outputCarrierKind:
              manifest.targetCarrierProjection.outputCarrierKind,
            contractRef:
              manifest.targetCarrierProjection.targetCarrierContractRef,
            contractDigest:
              manifest.targetCarrierProjection.targetCarrierContractDigest,
            promptProjection
          })
        );
      } catch (error) {
        issues.push({
          edgeRef: row.vector.name,
          code: "prompt_materialization_failed",
          detail:
            error instanceof Error
              ? error.message
              : "unknown prompt materialization failure"
        });
      }
    });
    return Object.freeze({
      graphVectorCount: vectorRows.length,
      promptProjectionCount: promptCases.length,
      nonPromptVectorCount: nonPromptVectorRefs.length,
      promptCases: Object.freeze(promptCases),
      nonPromptVectorRefs: Object.freeze(nonPromptVectorRefs.sort()),
      issues: Object.freeze(issues)
    });
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
}

function assertSemanticPromptProjectionReviewPassed(
  review: SemanticPromptProjectionReviewSummary
): void {
  if (review.issues.length > 0) {
    throw new TypeError(
      [
        "SDLC semantic prompt projection review failed:",
        ...review.issues.map(
          (issue) => `- ${issue.edgeRef}: ${issue.code}: ${issue.detail}`
        )
      ].join("\n")
    );
  }
}

function semanticPromptReviewPackageFromSummary(input: {
  readonly subjectRef: string;
  readonly review: SemanticPromptProjectionReviewSummary;
}): SdlcSemanticCompilerPromptReviewPackage {
  const promptProjections = Object.freeze(
    input.review.promptCases.map((promptCase) => Object.freeze({
      graphFunctionName: promptCase.graphFunctionName,
      edgeRef: promptCase.edgeRef,
      vectorIndex: promptCase.vectorIndex,
      targetAssetType: promptCase.targetAssetType,
      outputCarrierKind: promptCase.outputCarrierKind,
      contractRef: promptCase.contractRef,
      contractDigest: promptCase.contractDigest,
      promptFamily:
        promptCase.promptProjection.invocationAsset.promptFamily,
      stage: promptCase.promptProjection.invocationAsset.stage,
      renderedPromptDigest:
        promptCase.promptProjection.invocationAsset.renderedPromptDigest,
      promptText: promptCase.promptProjection.promptText
    }))
  );
  const deterministicDigestBasis = JSON.stringify({
    subjectRef: input.subjectRef,
    graphVectorCount: input.review.graphVectorCount,
    promptProjectionCount: input.review.promptProjectionCount,
    nonPromptVectorCount: input.review.nonPromptVectorCount,
    deterministicIssues: input.review.issues,
    promptProjections: promptProjections.map((projection) => ({
      graphFunctionName: projection.graphFunctionName,
      edgeRef: projection.edgeRef,
      vectorIndex: projection.vectorIndex,
      targetAssetType: projection.targetAssetType,
      outputCarrierKind: projection.outputCarrierKind,
      contractRef: projection.contractRef,
      contractDigest: projection.contractDigest,
      promptFamily: projection.promptFamily,
      stage: projection.stage,
      renderedPromptDigest: projection.renderedPromptDigest
    }))
  });
  return Object.freeze({
    kind: "sdlc_semantic_compiler_prompt_review_package" as const,
    packageVersion: "ts-semantic-compiler-prompt-review-v1" as const,
    subjectRef: input.subjectRef,
    deterministicReportDigest: sha256Text(deterministicDigestBasis),
    graphVectorCount: input.review.graphVectorCount,
    promptProjectionCount: input.review.promptProjectionCount,
    nonPromptVectorCount: input.review.nonPromptVectorCount,
    deterministicIssueCount: input.review.issues.length,
    deterministicIssues: input.review.issues,
    promptProjections
  });
}

function semanticCompilerFpReviewEnabled(): boolean {
  const value =
    process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL"] ??
    process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW"] ??
    "";
  return /^(?:1|true|required|release)$/iu.test(value.trim());
}

function admittedSemanticCompilerFpReviewResult(input: {
  readonly value: unknown;
  readonly expectedDigest: string;
}): {
  readonly passed: boolean;
  readonly reason: string;
} {
  if (!isRecord(input.value)) {
    return Object.freeze({
      passed: false,
      reason: "review result is not a JSON object"
    });
  }
  if (
    input.value["kind"] !== "sdlc_semantic_compiler_fp_review_result" ||
    input.value["reviewVersion"] !==
      "ts-semantic-compiler-fp-review-result-v1"
  ) {
    return Object.freeze({
      passed: false,
      reason: "review result kind/version is not admitted"
    });
  }
  if (input.value["deterministicReportDigest"] !== input.expectedDigest) {
    return Object.freeze({
      passed: false,
      reason: "review result digest does not match current deterministic package"
    });
  }
  if (input.value["status"] !== "passed") {
    return Object.freeze({
      passed: false,
      reason: "review result status is not passed"
    });
  }
  if (input.value["findingCount"] !== 0) {
    return Object.freeze({
      passed: false,
      reason: "review result carries open findings"
    });
  }
  for (const field of ["reviewerProfileRef", "reviewedAt"]) {
    if (
      typeof input.value[field] !== "string" ||
      input.value[field].trim().length === 0
    ) {
      return Object.freeze({
        passed: false,
        reason: `${field} is missing`
      });
    }
  }
  return Object.freeze({
    passed: true,
    reason: "admitted F_P semantic compiler review result passed"
  });
}

function semanticCompilerReviewResultPath(): string {
  return process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT"] ?? "";
}

function readSemanticCompilerFpReviewResult(input: {
  readonly reviewPackage: SdlcSemanticCompilerPromptReviewPackage;
}): {
  readonly path: string;
  readonly parsed: Readonly<Record<string, unknown>>;
  readonly reason: string;
} {
  const reviewResultPath = semanticCompilerReviewResultPath();
  if (reviewResultPath.trim().length === 0) {
    throw new TypeError(
      [
        "SDLC semantic compiler F_P.eval review gate requires an admitted review result.",
        `Set ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT to a JSON result for deterministicReportDigest=${input.reviewPackage.deterministicReportDigest}.`,
        "Expected result kind=sdlc_semantic_compiler_fp_review_result, reviewVersion=ts-semantic-compiler-fp-review-result-v1, status=passed, findingCount=0."
      ].join("\n")
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(reviewResultPath, "utf8"));
  } catch (error) {
    throw new TypeError(
      [
        "SDLC semantic compiler F_P.eval review gate could not read review result.",
        `path=${reviewResultPath}`,
        error instanceof Error ? error.message : "unknown read/parse failure"
      ].join("\n")
    );
  }
  const admission = admittedSemanticCompilerFpReviewResult({
    value: parsed,
    expectedDigest: input.reviewPackage.deterministicReportDigest
  });
  if (!admission.passed || !isRecord(parsed)) {
    throw new TypeError(
      [
        "SDLC semantic compiler F_P.eval review gate failed:",
        admission.reason,
        `path=${reviewResultPath}`,
        `deterministicReportDigest=${input.reviewPackage.deterministicReportDigest}`
      ].join("\n")
    );
  }
  return Object.freeze({
    path: reviewResultPath,
    parsed,
    reason: admission.reason
  });
}

function semanticReviewGateRowsForPackage(input: {
  readonly reviewPackage: SdlcSemanticCompilerPromptReviewPackage;
}): readonly SdlcGtlProgramSemanticReviewGateRow[] {
  if (!semanticCompilerFpReviewEnabled()) {
    return Object.freeze([]);
  }
  const reviewResult = readSemanticCompilerFpReviewResult(input);
  const row: SdlcGtlProgramSemanticReviewGateRow = Object.freeze({
      gateRef:
        "semantic-review-gate://odd-sdlc/t204/materialized-prompts/fp-code-review",
      subjectRef: input.reviewPackage.subjectRef,
      deterministicReportDigest:
        input.reviewPackage.deterministicReportDigest,
      reviewResultKind:
        "sdlc_semantic_compiler_fp_review_result",
      reviewVersion: "ts-semantic-compiler-fp-review-result-v1",
      status: "passed",
      findingCount: 0,
      reviewerProfileRef:
        semanticCompilerReviewResultStringField({
          reviewResult,
          fieldName: "reviewerProfileRef"
        }),
      reviewedAt: semanticCompilerReviewResultStringField({
        reviewResult,
        fieldName: "reviewedAt"
      }),
      evidenceRefs: Object.freeze([`file://${reviewResult.path}`])
  });
  return Object.freeze([row]);
}

function semanticCompilerReviewResultStringField(input: {
  readonly reviewResult: ReturnType<typeof readSemanticCompilerFpReviewResult>;
  readonly fieldName: "reviewerProfileRef" | "reviewedAt";
}): string {
  const value = input.reviewResult.parsed[input.fieldName];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(
      `semantic compiler review result ${input.fieldName} is missing`
    );
  }
  return value;
}

export function constructCurrentSdlcSemanticCompilerPromptReviewPackage(
  input: Pick<
    SdlcGtlProgramConformanceInputOptions,
    "subjectRef" | "packageRoot"
  > = {}
): SdlcSemanticCompilerPromptReviewPackage {
  const module = constructSdlcGtlModule();
  const vectorRows = materializedGraphVectorRows(module);
  const review = semanticPromptProjectionReview(vectorRows);
  assertSemanticPromptProjectionReviewPassed(review);
  return semanticPromptReviewPackageFromSummary({
    subjectRef: input.subjectRef ?? SDLC_GTL_PROGRAM_CONFORMANCE_SUBJECT_REF,
    review
  });
}

export function assertCurrentSdlcSemanticCompilerFpReviewGate(
  input: Pick<
    SdlcGtlProgramConformanceInputOptions,
    "subjectRef" | "packageRoot"
  > = {}
): SdlcSemanticCompilerFpReviewGateReport {
  const reviewPackage =
    constructCurrentSdlcSemanticCompilerPromptReviewPackage(input);
  if (!semanticCompilerFpReviewEnabled()) {
    return Object.freeze({
      kind: "sdlc_semantic_compiler_fp_review_gate_report" as const,
      gateVersion: "ts-semantic-compiler-fp-review-gate-v1" as const,
      mode: "skipped" as const,
      passed: true,
      reviewResultPath: null,
      deterministicReportDigest: reviewPackage.deterministicReportDigest,
      reason:
        "ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL is not enabled; deterministic semantic compiler review passed"
    });
  }
  const reviewResult = readSemanticCompilerFpReviewResult({ reviewPackage });
  return Object.freeze({
    kind: "sdlc_semantic_compiler_fp_review_gate_report" as const,
    gateVersion: "ts-semantic-compiler-fp-review-gate-v1" as const,
    mode: "required" as const,
    passed: true,
    reviewResultPath: reviewResult.path,
    deterministicReportDigest: reviewPackage.deterministicReportDigest,
    reason: reviewResult.reason
  });
}

function materializedGraphVectorRows(module: Module): readonly MaterializedGraphVectorRow[] {
  return Object.freeze(
    module.graphFunctions.flatMap((graphFunction) => {
      const graph = materializeGraphFunction(graphFunction);
      return graph.vectors.map((vector, vectorIndex) => Object.freeze({
        graphFunction,
        graph,
        vector,
        vectorIndex
      }));
    })
  );
}

function stringForRef(value: string): string {
  return value.replace(/[^A-Za-z0-9_.:-]+/gu, "-");
}

function digestForRef(ref: string): string {
  return `sha256:${stringForRef(ref)}`;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHookRefLike(value: unknown): value is HookRefLike {
  return isRecord(value) && typeof value["ref"] === "string";
}

function hookRefEntries(
  entries: readonly HookConfigEntryLike[],
  key: string | null = null
): readonly {
  readonly key: string;
  readonly hookRef: HookRefLike;
}[] {
  return Object.freeze(entries
    .filter((entry) => key === null || entry.key === key)
    .filter((entry) => entry.value?.kind === "hook_ref")
    .map((entry) => {
      const hookRef = entry.value?.value;
      return isHookRefLike(hookRef)
        ? Object.freeze({ key: entry.key, hookRef })
        : null;
    })
    .filter((entry): entry is { readonly key: string; readonly hookRef: HookRefLike } =>
      entry !== null
    ));
}

function uniqueRows<T>(
  rows: readonly T[],
  keyForRow: (row: T) => string
): readonly T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const row of rows) {
    const key = keyForRow(row);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(row);
  }
  return Object.freeze(unique);
}

function graphVectorRowIdentityKey(input: {
  readonly graphFunctionId: string;
  readonly graphId: string;
  readonly graphVectorId: string;
}): string {
  return `${input.graphFunctionId}:${input.graphId}:${input.graphVectorId}`;
}

function operatorDeclarationRows(vectorRows: readonly MaterializedGraphVectorRow[]) {
  return Object.freeze(
    vectorRows.flatMap((row) =>
      row.vector.operators.map((operator, index) => Object.freeze({
        operatorRef:
          `operator://odd-sdlc/${row.graphFunction.name}` +
          `/${row.vector.name}/${index}/${operator.name}`,
        name: operator.name,
        regime: operator.regime,
        binding: operator.binding,
        hostKind: "graph_vector" as const,
        hostRef: row.vector.id,
        tagRefs: operator.tags,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/graph/module.ts"
        ])
      }))
    )
  );
}

function evaluatorDeclarationRows(vectorRows: readonly MaterializedGraphVectorRow[]) {
  return Object.freeze(
    vectorRows.flatMap((row) =>
      row.vector.evaluators.map((evaluator, index) => Object.freeze({
        evaluatorRef:
          `evaluator://odd-sdlc/${row.graphFunction.name}` +
          `/${row.vector.name}/${index}/${evaluator.name}`,
        name: evaluator.name,
        regime: evaluator.regime,
        description: evaluator.description,
        binding: evaluator.binding,
        consumedFieldRefs: evaluator.consumedFieldRefs,
        hostKind: "graph_vector" as const,
        hostRef: row.vector.id,
        tagRefs: evaluator.tags,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/graph/module.ts"
        ])
      }))
    )
  );
}

function ruleDeclarationRows(vectorRows: readonly MaterializedGraphVectorRow[]) {
  return Object.freeze(
    vectorRows.flatMap((row) => {
      if (row.vector.rule === null) {
        return [];
      }
      return [Object.freeze({
        ruleRef:
          `rule://odd-sdlc/${row.graphFunction.name}` +
          `/${row.vector.name}/${row.vector.rule.name}`,
        name: row.vector.rule.name,
        ruleKind: row.vector.rule.kind,
        configDigest: digestForRef(
          `rule:${row.graphFunction.name}:${row.vector.name}:${row.vector.rule.name}`
        ),
        hostKind: "graph_vector" as const,
        hostRef: row.vector.id,
        tagRefs: row.vector.rule.tags,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/graph/module.ts"
        ])
      })];
    })
  );
}

function computeCompositionRows(vectorRows: readonly MaterializedGraphVectorRow[]) {
  return uniqueRows(
    vectorRows.flatMap((row) =>
      hookRefEntries(row.vector.declarations.entries, "abg.fn_composition")
        .map(() => {
          const compositionSelection = resolveAbgFnCompositionSelection({
            vector: row.vector,
            graphFunction: row.graphFunction
          });
          const compositionRef = compositionSelection.contract.contractRef;
          const closureContractRef =
            compositionSelection.contract.closureContractRef;
          const regimeBindingRefs = Object.freeze([
            ...row.vector.operators.map((operator) => operator.binding),
            ...row.vector.evaluators.map((evaluator) => evaluator.binding)
          ]);
          return Object.freeze({
            compositionRef,
            compositionDigest: compositionSelection.contract.contractDigest,
            hostKind: "graph_vector" as const,
            hostRef: row.vector.id,
            declarationSourceKind: "graph_vector_declaration" as const,
            declarationSourceRef: compositionSelection.contract.hookRef,
            notationRefs: Object.freeze([
              "fn<SourceAsset,TargetAsset>.C",
              "transform.C",
              "evaluate.C",
              "consequence.C"
            ]),
            regimeBindingRefs,
            stageBindingRefs: Object.freeze([
              `stage-binding://odd-sdlc/${stringForRef(compositionRef)}/transform.C`,
              `stage-binding://odd-sdlc/${stringForRef(compositionRef)}/evaluate.C`,
              `stage-binding://odd-sdlc/${stringForRef(compositionRef)}/evaluate.F_D`,
              `stage-binding://odd-sdlc/${stringForRef(compositionRef)}/consequence.C`
            ]),
            closureContractRef,
            evidenceRefs: Object.freeze([
              "workspace://build_tenants/typescript/code/src/graph/module.ts"
            ])
          });
        })
    ),
    (row) => `${row.hostRef}:${row.compositionRef}`
  );
}

function regimeBindingRefsFor(
  composition: GtlProgramComputeCompositionRow,
  regime: Regime
): readonly string[] {
  const matchingRefs = composition.regimeBindingRefs.filter((ref) => {
    switch (regime) {
      case "F_D":
        return ref.startsWith("fd://");
      case "F_P":
        return ref.startsWith("fp://") || ref.startsWith("agent://");
      case "F_H":
        return ref.startsWith("human://");
    }
  });
  return Object.freeze(
    matchingRefs.length === 0
      ? [`${composition.compositionRef}#${regime}`]
      : matchingRefs
  );
}

function regimeDispositionRows(input: {
  readonly composition: GtlProgramComputeCompositionRow;
  readonly stageBindingRef: string;
  readonly participatingRegime: Regime;
}) {
  return Object.freeze(
    (["F_D", "F_P", "F_H"] as const).map((regime) => {
      if (regime === input.participatingRegime) {
        return Object.freeze({
          regime,
          disposition: "participates" as const,
          selectedRegimeBindingRefs: regimeBindingRefsFor(input.composition, regime),
          reasonRefs: Object.freeze([]),
          evidenceRefs: Object.freeze([
            input.composition.compositionRef,
            input.stageBindingRef
          ])
        });
      }
      return Object.freeze({
        regime,
        disposition: "not_used" as const,
        selectedRegimeBindingRefs: Object.freeze([]),
        reasonRefs: Object.freeze([
          `reason://odd-sdlc/typescript/${stringForRef(input.stageBindingRef)}/${regime}/not-used`
        ]),
        evidenceRefs: Object.freeze([])
      });
    })
  );
}

function pluginRefsForStage(
  pluginContracts: readonly EnginePluginContract[],
  stageRole: "transform" | "evaluate" | "consequence",
  computeMeans: Regime
): readonly string[] {
  return Object.freeze(
    pluginContracts
      .filter((contract) =>
        contract.computeStageRole === stageRole &&
        contract.computeMeans === computeMeans
      )
      .map((contract) => contract.ref)
      .sort()
  );
}

function pluginOutputCarriersForStage(
  pluginContracts: readonly EnginePluginContract[],
  stageRole: "transform" | "evaluate" | "consequence",
  computeMeans: Regime
): readonly string[] {
  return Object.freeze(
    pluginContracts
      .filter((contract) =>
        contract.computeStageRole === stageRole &&
        contract.computeMeans === computeMeans
      )
      .map((contract) => contract.outputCarrier)
      .sort()
  );
}

function computeStageBindingRows(input: {
  readonly computeCompositions: readonly GtlProgramComputeCompositionRow[];
  readonly pluginContracts: readonly EnginePluginContract[];
}): readonly GtlProgramComputeStageBindingRow[] {
  return Object.freeze(
    input.computeCompositions.flatMap((composition) => {
      const transformStageRef = composition.stageBindingRefs[0];
      const evaluateStageRef = composition.stageBindingRefs[1];
      const fdEvaluateStageRef = composition.stageBindingRefs[2];
      const consequenceStageRef = composition.stageBindingRefs[3];
      if (
        transformStageRef === undefined ||
        evaluateStageRef === undefined ||
        fdEvaluateStageRef === undefined ||
        consequenceStageRef === undefined
      ) {
        throw new TypeError(
          `${composition.compositionRef} must publish transform/evaluate/evaluate.F_D/consequence stage refs`
        );
      }
      return [
        Object.freeze({
          stageBindingRef: transformStageRef,
          compositionRef: composition.compositionRef,
          compositionDigest: composition.compositionDigest,
          stageRole: "transform" as const,
          stageNotationRef: `transform.C:${composition.compositionRef}`,
          stagePurpose: "candidate_construction" as const,
          computeMeans: "F_P" as const,
          inputCarrierRefs: Object.freeze(["EnginePluginInput"]),
          outputCarrierRefs: pluginOutputCarriersForStage(
            input.pluginContracts,
            "transform",
            "F_P"
          ),
          predecessorStageBindingRefs: Object.freeze([]),
          pluginContractRefs: pluginRefsForStage(
            input.pluginContracts,
            "transform",
            "F_P"
          ),
          hookRefs: Object.freeze([composition.declarationSourceRef]),
          regimeDispositions: regimeDispositionRows({
            composition,
            stageBindingRef: transformStageRef,
            participatingRegime: "F_P"
          }),
          mayWriteLedgers: false as const,
          mayEmitRuntimeEvents: false as const,
          maySelectTraversal: false as const,
          mayCloseTraversal: false as const,
          mayOwnIterationLoop: false as const,
          evidenceRefs: Object.freeze([
            "workspace://build_tenants/typescript/code/src/operator/plugins/plugin_set.ts"
          ])
        }),
        Object.freeze({
          stageBindingRef: evaluateStageRef,
          compositionRef: composition.compositionRef,
          compositionDigest: composition.compositionDigest,
          stageRole: "evaluate" as const,
          stageNotationRef: `evaluate.C:${composition.compositionRef}`,
          stagePurpose: "candidate_evaluation" as const,
          computeMeans: "F_P" as const,
          inputCarrierRefs: Object.freeze(["EnginePluginInput"]),
          outputCarrierRefs: pluginOutputCarriersForStage(
            input.pluginContracts,
            "evaluate",
            "F_P"
          ),
          predecessorStageBindingRefs: Object.freeze([transformStageRef]),
          pluginContractRefs: pluginRefsForStage(
            input.pluginContracts,
            "evaluate",
            "F_P"
          ),
          hookRefs: Object.freeze([composition.declarationSourceRef]),
          regimeDispositions: regimeDispositionRows({
            composition,
            stageBindingRef: evaluateStageRef,
            participatingRegime: "F_P"
          }),
          mayWriteLedgers: false as const,
          mayEmitRuntimeEvents: false as const,
          maySelectTraversal: false as const,
          mayCloseTraversal: false as const,
          mayOwnIterationLoop: false as const,
          evidenceRefs: Object.freeze([
            "workspace://build_tenants/typescript/code/src/operator/plugins/plugin_set.ts"
          ])
        }),
        Object.freeze({
          stageBindingRef: fdEvaluateStageRef,
          compositionRef: composition.compositionRef,
          compositionDigest: composition.compositionDigest,
          stageRole: "evaluate" as const,
          stageNotationRef: `evaluate.C:${composition.compositionRef}:F_D`,
          stagePurpose: "candidate_evaluation" as const,
          computeMeans: "F_D" as const,
          inputCarrierRefs: Object.freeze(["EnginePluginInput"]),
          outputCarrierRefs: pluginOutputCarriersForStage(
            input.pluginContracts,
            "evaluate",
            "F_D"
          ),
          predecessorStageBindingRefs: Object.freeze([transformStageRef]),
          pluginContractRefs: pluginRefsForStage(
            input.pluginContracts,
            "evaluate",
            "F_D"
          ),
          hookRefs: Object.freeze([composition.declarationSourceRef]),
          regimeDispositions: regimeDispositionRows({
            composition,
            stageBindingRef: fdEvaluateStageRef,
            participatingRegime: "F_D"
          }),
          mayWriteLedgers: false as const,
          mayEmitRuntimeEvents: false as const,
          maySelectTraversal: false as const,
          mayCloseTraversal: false as const,
          mayOwnIterationLoop: false as const,
          evidenceRefs: Object.freeze([
            "workspace://build_tenants/typescript/code/src/operator/plugins/plugin_set.ts"
          ])
        }),
        Object.freeze({
          stageBindingRef: consequenceStageRef,
          compositionRef: composition.compositionRef,
          compositionDigest: composition.compositionDigest,
          stageRole: "consequence" as const,
          stageNotationRef: `consequence.C:${composition.compositionRef}`,
          stagePurpose: "consequence_projection" as const,
          computeMeans: "F_D" as const,
          inputCarrierRefs: Object.freeze(["EnginePluginInput"]),
          outputCarrierRefs: pluginOutputCarriersForStage(
            input.pluginContracts,
            "consequence",
            "F_D"
          ),
          predecessorStageBindingRefs: Object.freeze([
            transformStageRef,
            evaluateStageRef,
            fdEvaluateStageRef
          ]),
          pluginContractRefs: pluginRefsForStage(
            input.pluginContracts,
            "consequence",
            "F_D"
          ),
          hookRefs: Object.freeze([composition.declarationSourceRef]),
          regimeDispositions: regimeDispositionRows({
            composition,
            stageBindingRef: consequenceStageRef,
            participatingRegime: "F_D"
          }),
          mayWriteLedgers: false as const,
          mayEmitRuntimeEvents: false as const,
          maySelectTraversal: false as const,
          mayCloseTraversal: false as const,
          mayOwnIterationLoop: false as const,
          evidenceRefs: Object.freeze([
            "workspace://build_tenants/typescript/code/src/operator/plugins/plugin_set.ts"
          ])
        })
      ];
    })
  );
}

const PLUGIN_RESULT_INTERFACE_IDENTITY_FIELD_REFS = Object.freeze([
  "compositionRef",
  "compositionDigest",
  "compositionSelectionRef",
  "stageRole",
  "computeMeans",
  "outputCarrierRefs",
  "evidenceRefs"
]);

function pluginResultInterfaceRows(
  computeStageBindings: readonly GtlProgramComputeStageBindingRow[]
): readonly GtlProgramPluginResultInterfaceRow[] {
  return Object.freeze(
    computeStageBindings.map((row) => {
      const stageKey = stringForRef(row.stageBindingRef);
      const resultCarrierKind = row.outputCarrierRefs[0];
      if (resultCarrierKind === undefined) {
        throw new TypeError(
          `missing plugin result output carrier for ${row.stageBindingRef}`
        );
      }
      return Object.freeze({
        resultInterfaceRef:
          `result-interface://odd-sdlc/typescript/${stageKey}`,
        stageBindingRef: row.stageBindingRef,
        compositionRef: row.compositionRef,
        compositionDigest: row.compositionDigest,
        stageRole: row.stageRole,
        computeMeans: row.computeMeans,
        resultEnvelopeContractRef:
          `result-envelope://odd-sdlc/typescript/${stageKey}`,
        resultCarrierKind,
        outputCarrierRefs: row.outputCarrierRefs,
        producedCarrierRefs: Object.freeze(
          row.outputCarrierRefs.map(
            (carrierRef) =>
              `carrier://odd-sdlc/typescript/${stageKey}/${stringForRef(carrierRef)}`
          )
        ),
        requiredIdentityFieldRefs: PLUGIN_RESULT_INTERFACE_IDENTITY_FIELD_REFS,
        selectorAuthorityRefs: Object.freeze([
          `gtl://plugin-result-interface/odd-sdlc/typescript/${stageKey}`
        ]),
        evidenceRefs: Object.freeze([
          row.stageBindingRef,
          "workspace://build_tenants/typescript/code/src/gtl_conformance/program.ts"
        ]),
        mayWriteLedgers: false as const,
        mayEmitRuntimeEvents: false as const,
        maySelectTraversal: false as const,
        mayCloseTraversal: false as const,
        mayOwnIterationLoop: false as const
      });
    })
  );
}

const ODD_SDLC_OBLIGATION_DELTA_FAMILIES:
  readonly GtlProgramObligationDeltaFamily[] =
    GTL_PROGRAM_OBLIGATION_DELTA_FAMILY_VALUES;

function traversalBindConservationRows(input: {
  readonly vectorRows: readonly MaterializedGraphVectorRow[];
  readonly targetCarrierContracts: readonly GtlProgramTargetCarrierRow[];
  readonly computeCompositions: readonly GtlProgramComputeCompositionRow[];
  readonly computeStageBindings: readonly GtlProgramComputeStageBindingRow[];
}): readonly GtlProgramTraversalBindConservationRow[] {
  const targetCarrierByIdentity = new Map<string, GtlProgramTargetCarrierRow>();
  for (const targetCarrier of input.targetCarrierContracts) {
    const key = graphVectorRowIdentityKey(targetCarrier);
    if (targetCarrierByIdentity.has(key)) {
      throw new TypeError(
        `${targetCarrier.graphFunctionId}/${targetCarrier.graphVectorId}: duplicate target-carrier row for traversal bind conservation`
      );
    }
    targetCarrierByIdentity.set(key, targetCarrier);
  }
  const stageBindingRefsByVectorId = new Map<string, readonly string[]>();
  for (const composition of input.computeCompositions) {
    const stageBindingRefs = input.computeStageBindings
      .filter((row) => row.compositionRef === composition.compositionRef)
      .map((row) => row.stageBindingRef)
      .sort();
    stageBindingRefsByVectorId.set(composition.hostRef, Object.freeze(stageBindingRefs));
  }
  return Object.freeze(
    input.vectorRows.map((row) => {
      const targetCarrier = targetCarrierByIdentity.get(
        graphVectorRowIdentityKey({
          graphFunctionId: row.graphFunction.id,
          graphId: row.graph.id,
          graphVectorId: row.vector.id
        })
      );
      if (targetCarrier === undefined) {
        throw new TypeError(
          `${row.graphFunction.name}/${row.vector.name}: missing target-carrier row for traversal bind conservation`
        );
      }
      const refBase =
        `odd-sdlc/${stringForRef(row.graphFunction.name)}` +
        `/${stringForRef(row.vector.name)}`;
      return Object.freeze({
        conservationRef:
          `bind-conservation://odd-sdlc/typescript/${refBase}`,
        graphFunctionRef: row.graphFunction.name,
        graphRef: row.graph.name,
        graphVectorRef: row.vector.name,
        graphFunctionId: row.graphFunction.id,
        graphId: row.graph.id,
        graphVectorId: row.vector.id,
        intentLineageRefs: Object.freeze([
          `intent-lineage://odd-sdlc/typescript/${refBase}/input`,
          `lineage://odd-sdlc/typescript/${refBase}/authority`
        ]),
        targetCarrierBindingRefs: Object.freeze([
          targetCarrier.targetCarrierContractRef
        ]),
        materializationBindingRefs: Object.freeze([
          targetCarrier.materializationPolicyRef
        ]),
        carriedObligationRefs: Object.freeze([
          `obligation://odd-sdlc/typescript/${refBase}/target-contract`
        ]),
        residualPressureRefs: Object.freeze([
          `pressure://odd-sdlc/typescript/${refBase}/open-obligation`
        ]),
        stagedAuthorityRefs:
          stageBindingRefsByVectorId.get(row.vector.id) ?? Object.freeze([]),
        admissionStrengthRefs: Object.freeze([
          GTL_PROGRAM_BIND_ADMISSION_STRENGTH_COMPATIBILITY_REF
        ]),
        downstreamTerminalPressureRefs: Object.freeze([
          `terminal-pressure://odd-sdlc/typescript/${refBase}/terminal`
        ]),
        allowedObligationDeltaFamilies: ODD_SDLC_OBLIGATION_DELTA_FAMILIES,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/gtl_conformance/program.ts",
          "REQ-L-GTL3-CONTRACT-LAW-API-017",
          "REQ-R-ABG3-FN-COMP-023"
        ])
      });
    })
  );
}

function runtimeBindingRows(input: {
  readonly module: Module;
  readonly pluginContracts: readonly EnginePluginContract[];
  readonly computeStageBindings: readonly GtlProgramComputeStageBindingRow[];
}): readonly GtlProgramRuntimeBindingRow[] {
  return Object.freeze([
    Object.freeze({
      bindingRef: "runtime-binding://odd-sdlc/typescript/abg-cli/start",
      runtimeBindingKind: "abg_cli_runtime_binding" as const,
      moduleRef: input.module.name,
      publicStartRef: "bootstrap_release_self_test",
      commandRef:
        "genesis-ts start --workspace . --target graph_function:bootstrap_release_self_test --until converged",
      pluginContractRefs: Object.freeze(
        input.pluginContracts.map((contract) => contract.ref).sort()
      ),
      stageBindingRefs: Object.freeze(
        input.computeStageBindings.map((row) => row.stageBindingRef).sort()
      ),
      consumesPluginsThroughAbg: true as const,
      forbidsProductLocalIteration: true as const,
      evidenceRefs: Object.freeze([
        "workspace://build_tenants/typescript/code/src/install/installer.ts",
        "workspace://build_tenants/typescript/code/src/install/instruction_files.ts"
      ])
    })
  ]);
}

function hookBoundaryRows(vectorRows: readonly MaterializedGraphVectorRow[]) {
  return uniqueRows(
    vectorRows.flatMap((row) =>
      hookRefEntries(row.vector.declarations.entries).map(({ key, hookRef }, index) =>
        Object.freeze({
          hookRef: hookRef.ref,
          hookKey: key,
          hostKind: "graph_vector" as const,
          hostRef: row.vector.id,
          declarationSourceKind: "graph_vector_declaration" as const,
          declarationRef: `${row.vector.id}:declarations:${index}:${key}`,
          precedenceRank: index,
          concernRefs: Object.freeze([key]),
          pluginContractRefs: Object.freeze([]),
          evidenceRefs: Object.freeze([
            "workspace://build_tenants/typescript/code/src/graph/module.ts"
          ])
        })
      )
    ),
    (row) => `${row.hostRef}:${row.hookKey}:${row.hookRef}`
  );
}

function jobBindingRows(module: Module) {
  const graphFunctionNameById = new Map(
    module.graphFunctions.map((graphFunction) => [
      graphFunction.id,
      graphFunction.name
    ])
  );
  return Object.freeze(
    module.jobs.map((job) => {
      const contractTargetRefs = Object.freeze(
        job.contracts
          .map((contract) => graphFunctionNameById.get(contract.targetId) ?? null)
          .filter((targetRef): targetRef is string => targetRef !== null)
      );
      return Object.freeze({
        jobRef: job.name,
        contractTargetRefs,
        roleRefs: Object.freeze(job.roles.map((role) => role.name)),
        policyHookRefs: Object.freeze(
          job.policyHooks.entries.map((entry) => entry.key)
        ),
        publicCallableGraphFunctionRefs: contractTargetRefs,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/graph/module.ts"
        ])
      });
    })
  );
}

function roleBindingRows(module: Module) {
  return Object.freeze(
    module.roles.map((role) => Object.freeze({
      roleRef: role.name,
      capabilityRefs: Object.freeze([
        `capability://odd-sdlc/role/${role.name}`
      ]),
      policyHookRefs: Object.freeze(
        role.policyHooks.entries.map((entry) => entry.key)
      ),
      evidenceRefs: Object.freeze([
        "workspace://build_tenants/typescript/code/src/graph/module.ts"
      ])
    }))
  );
}

function featureCoverageManifest(input: {
  readonly presentFeatureKinds: ReadonlySet<GtlProgramT153FeatureKind>;
  readonly manifestRef: string;
}): GtlProgramFeatureCoverageManifest {
  return Object.freeze({
    kind: "gtl_program_feature_coverage_manifest" as const,
    manifestRef: input.manifestRef,
    t153RequirementRef: "REQ-L-GTL3-CONTRACT-LAW-API" as const,
    rows: Object.freeze(
      GTL_PROGRAM_T153_FEATURE_KINDS.map((featureKind) => {
        const disposition = input.presentFeatureKinds.has(featureKind)
          ? "present"
          : "not_used";
        return Object.freeze({
          featureKind,
          disposition,
          ownerClassification:
            GTL_PROGRAM_T153_FEATURE_OWNER_CLASSIFICATIONS[featureKind],
          requirementRefs: T153_REQUIREMENT_REFS,
          evidenceRefs: disposition === "present"
            ? Object.freeze([
                `${SDLC_GTL_PROGRAM_CONFORMANCE_SUBJECT_REF}/${featureKind}`
              ])
            : Object.freeze([]),
          reasonRefs: disposition === "not_used"
            ? Object.freeze([
                `reason://odd-sdlc/typescript/current/not-used/${featureKind}`
              ])
            : Object.freeze([])
        });
      })
    )
  });
}

function graphFunctionTemplateRefStartsWith(
  graphFunction: GraphFunction,
  prefix: string
): boolean {
  return graphFunction.template.ref.startsWith(prefix);
}

function graphFunctionNameStartsWith(
  graphFunction: GraphFunction,
  prefix: string
): boolean {
  return graphFunction.name.startsWith(prefix);
}

function graphFunctionDeclarationHasKey(
  graphFunction: GraphFunction,
  key: string
): boolean {
  return graphFunction.declarations.entries.some((entry) => entry.key === key);
}

function presentT153FeatureKinds(input: {
  readonly module: Module;
  readonly sameObjectProofs: readonly unknown[];
  readonly operatorDeclarations: readonly unknown[];
  readonly evaluatorDeclarations: readonly unknown[];
  readonly ruleDeclarations: readonly unknown[];
  readonly computeCompositions: readonly unknown[];
  readonly computeStageBindings: readonly unknown[];
  readonly hookBoundaries: readonly unknown[];
  readonly selectionBoundaries: readonly unknown[];
  readonly jobBindings: readonly unknown[];
  readonly roleBindings: readonly unknown[];
  readonly externalToolGates: readonly unknown[];
  readonly publicStartTargets: readonly unknown[];
  readonly runtimeBindings: readonly unknown[];
}): ReadonlySet<GtlProgramT153FeatureKind> {
  const present = new Set<GtlProgramT153FeatureKind>([
    "graph_structure_interface",
    "graph_algebra_edge",
    "target_carrier_contract_law",
    "edge_closure_contract_law",
    "prompt_typed_asset_law",
    "module_publication",
    "active_source_identity"
  ]);
  const graphFunctions = input.module.graphFunctions;
  if (input.operatorDeclarations.length > 0) {
    present.add("operator_declarations");
  }
  if (input.evaluatorDeclarations.length > 0) {
    present.add("evaluator_declarations");
  }
  if (input.ruleDeclarations.length > 0) {
    present.add("rule_declarations");
  }
  if (
    input.computeCompositions.length > 0 &&
    input.computeStageBindings.length > 0
  ) {
    present.add("f_star_compute_composition");
  }
  if (input.publicStartTargets.length > 0 && input.runtimeBindings.length > 0) {
    present.add("public_start_binding");
  }
  if (input.hookBoundaries.length > 0) {
    present.add("hook_boundaries");
  }
  if (input.selectionBoundaries.length > 0) {
    present.add("selection_refinement_synthesis_subwork");
  }
  if (input.jobBindings.length > 0) {
    present.add("job_binding");
  }
  if (input.roleBindings.length > 0) {
    present.add("role_binding");
  }
  if (input.externalToolGates.length > 0) {
    present.add("external_tool_gates");
  }
  if (input.sameObjectProofs.length > 0) {
    present.add("graph_algebra_same_object");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionTemplateRefStartsWith(graphFunction, "compose:")
  )) {
    present.add("graph_algebra_compose");
  }
  if (input.module.graphs.some((graph) =>
    graph.tags.some((tag) => tag.startsWith("substituted:"))
  )) {
    present.add("graph_algebra_substitute");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionDeclarationHasKey(graphFunction, "recursion") ||
    graphFunctionNameStartsWith(graphFunction, "recurse(")
  )) {
    present.add("graph_algebra_recurse");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionNameStartsWith(graphFunction, "fan_out(")
  )) {
    present.add("graph_algebra_fan_out");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionNameStartsWith(graphFunction, "fan_in(")
  )) {
    present.add("graph_algebra_fan_in");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionDeclarationHasKey(graphFunction, "gate") ||
    graphFunctionNameStartsWith(graphFunction, "gate(")
  )) {
    present.add("graph_algebra_gate");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionTemplateRefStartsWith(graphFunction, "promote:") ||
    graphFunctionNameStartsWith(graphFunction, "promote(")
  )) {
    present.add("graph_algebra_promote");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionNameStartsWith(graphFunction, "identity:")
  )) {
    present.add("graph_algebra_identity");
  }
  return present;
}

function requireProductionTargetCarrierRow(
  registry: ReturnType<typeof constructSdlcTargetCarrierRegistry>,
  row: MaterializedGraphVectorRow
) {
  const targetCarrierRow = registry.rowByEdgeRef[row.vector.name] ?? null;
  if (targetCarrierRow === null) {
    throw new TypeError(
      `missing production target-carrier row for ${row.vector.name}`
    );
  }
  if (targetCarrierRow.targetAssetType !== row.vector.target.name) {
    throw new TypeError(`target-carrier target mismatch for ${row.vector.name}`);
  }
  return targetCarrierRow;
}

function requireProductionEdgeClosureContract(
  contractByEdgeRef: ReadonlyMap<string, (typeof SDLC_EDGE_GAIN_CLOSURE_CONTRACTS)[number]>,
  row: MaterializedGraphVectorRow
) {
  const contract = contractByEdgeRef.get(row.vector.name) ?? null;
  if (contract === null) {
    throw new TypeError(
      `missing production edge gain/closure contract for ${row.vector.name}`
    );
  }
  if (contract.targetAssetType !== row.vector.target.name) {
    throw new TypeError(`edge gain/closure target mismatch for ${row.vector.name}`);
  }
  return contract;
}

export function constructCurrentSdlcGtlProgramConformanceInput(
  input: SdlcGtlProgramConformanceInputOptions = {}
): GtlProgramConformanceInput {
  const catalog = constructSdlcGraphFunctionCatalog();
  const module = constructSdlcGtlModule();
  const catalogGraphFunctionRefs = Object.freeze([
    ...new Set([
      ...catalog.libraryFunctions.map((entry) => entry.name),
      ...catalog.functions.map((entry) => entry.backingGraphFunction),
      ...catalog.executives.map((entry) => entry.backingGraphFunction)
    ])
  ].sort());
  const vectorRows = materializedGraphVectorRows(module);
  const graphVectorCount = vectorRows.length;
  const overlayCatalog = constructSdlcTraversalOverlayCatalog({
    module,
    graphCatalog: catalog
  });
  const targetCarrierRegistry = constructSdlcTargetCarrierRegistry({ module });
  if (targetCarrierRegistry.diagnostics.length > 0) {
    throw new TypeError(
      `production target-carrier registry diagnostics: ${targetCarrierRegistry.diagnostics.join(", ")}`
    );
  }
  const productionVectorRefs = new Set(vectorRows.map((row) => row.vector.name));
  if (productionVectorRefs.size !== targetCarrierRegistry.rows.length) {
    throw new TypeError(
      "production target-carrier registry must cover every unique graph vector ref"
    );
  }
  const contractByEdgeRef = new Map(
    SDLC_EDGE_GAIN_CLOSURE_CONTRACTS.map((contract) => [
      contract.edgeRef,
      contract
    ])
  );
  if (productionVectorRefs.size !== contractByEdgeRef.size) {
    throw new TypeError(
      "production edge gain/closure contracts must cover every unique graph vector ref"
    );
  }
  const startTargets = publicSdlcOverlayStartTargets({
    module,
    catalog: overlayCatalog,
    projectConformanceStatus: null
  });
  const targetCarrierContracts = Object.freeze(
    vectorRows.map((row) => {
      const targetCarrierRow =
        requireProductionTargetCarrierRow(targetCarrierRegistry, row);
      return Object.freeze({
        edgeRef: row.vector.name,
        graphVectorRef: row.vector.name,
        graphFunctionId: row.graphFunction.id,
        graphId: row.graph.id,
        graphVectorId: row.vector.id,
        targetAssetType: row.vector.target.name,
        targetCarrierContractRef: targetCarrierRow.targetCarrierContractRef,
        targetCarrierContractDigest: targetCarrierRow.targetCarrierContractDigest,
        targetCarrierTemplateRef: targetCarrierRow.targetCarrierTemplateRef,
        outputSurfaceRef: targetCarrierRow.outputSurfaceRef,
        outputCarrierFamilyRef: targetCarrierRow.outputCarrierFamilyRef,
        outputCarrierKind: targetCarrierRow.outputCarrierKind,
        envelopeContractRef: targetCarrierRow.binding.envelopeContractRef,
        nestedPayloadPath: targetCarrierRow.nestedPayloadPath,
        requiredFieldRefs: targetCarrierRow.requiredFieldRefs,
        optionalFieldRefs: targetCarrierRow.optionalFieldRefs,
        fixedProtocolFieldRefs: targetCarrierRow.fixedProtocolFieldRefs,
        workerFillableFieldRefs: targetCarrierRow.workerFillableFieldRefs,
        literalDomainRefs: targetCarrierRow.literalDomainRefs,
        enumDomainRefs: targetCarrierRow.enumDomainRefs,
        schemaRef: targetCarrierRow.schemaRef,
        admissionRef: targetCarrierRow.admissionRef,
        payloadLedgerBindingRef: targetCarrierRow.payloadLedgerBindingRef,
        edgeAssuranceBindingRef: targetCarrierRow.edgeAssuranceBindingRef,
        handoffProjectionRef: targetCarrierRow.handoffProjectionRef,
        constructionTemplateRef: targetCarrierRow.constructionTemplateRef,
        replayDigestPolicyRef: targetCarrierRow.replayDigestPolicyRef,
        materializationPolicyRef: targetCarrierRow.materializationPolicyRef,
        closurePreconditionRef: targetCarrierRow.closurePreconditionRef
      });
    })
  );
  const edgeClosureContracts = Object.freeze(
    vectorRows.map((row) => {
      const contract = requireProductionEdgeClosureContract(contractByEdgeRef, row);
      return Object.freeze({
        edgeRef: contract.edgeRef,
        graphFunctionId: row.graphFunction.id,
        graphId: row.graph.id,
        graphVectorId: row.vector.id,
        targetAssetType: contract.targetAssetType
      });
    })
  );
  const overlays = Object.freeze(
    overlayCatalog.overlays.map((overlay) => Object.freeze({
      overlayRef: overlay.overlayRef,
      graphFunctionRefs: overlay.graphFunctionRefs,
      graphVectorRefs: overlay.graphVectorRefs,
      publicStartTargets: overlay.publicStartTargets,
      defaultStartTarget: overlay.defaultStartTarget
    }))
  );
  const publicStartTargetRows = Object.freeze(
    startTargets.map((target) => Object.freeze({
      name: target.name,
      graphFunctionRef: target.graphFunctionRef,
      overlayRefs: target.overlayRefs,
      defaultForOverlayRefs: target.defaultForOverlayRefs
    }))
  );
  const subjectRef =
    input.subjectRef ?? SDLC_GTL_PROGRAM_CONFORMANCE_SUBJECT_REF;
  const promptProjectionReview = semanticPromptProjectionReview(vectorRows);
  assertSemanticPromptProjectionReviewPassed(promptProjectionReview);
  const semanticPromptReviewPackage = semanticPromptReviewPackageFromSummary({
    subjectRef,
    review: promptProjectionReview
  });
  const semanticReviewGates = semanticReviewGateRowsForPackage({
    reviewPackage: semanticPromptReviewPackage
  });
  const promptAssets = promptProjectionRows(promptProjectionReview.promptCases);
  const pluginContracts = Object.freeze([
    fpDispatchPluginContract(),
    fpEvaluatorPluginContract(),
    designDepthFpEvaluatorRuleContract(),
    reviewGradeEdgeFulfillmentRuleContract(),
    ticketWorkflowFdRuleContract(),
    consequenceProjectionPluginContract()
  ]);
  const sourceIdentitySurfaces = activeSdlcSourceIdentitySurfaces(input);
  assertSemanticSourceAuthorityReviewPassed(sourceIdentitySurfaces);
  assertSemanticCarrierClosureReviewPassed(sourceIdentitySurfaces);
  const sourceAuthorityPolicies = sourceAuthorityPolicyRows();
  const sameObjectProofs = Object.freeze([]);
  const operatorDeclarations = operatorDeclarationRows(vectorRows);
  const evaluatorDeclarations = evaluatorDeclarationRows(vectorRows);
  const ruleDeclarations = ruleDeclarationRows(vectorRows);
  const computeCompositions = computeCompositionRows(vectorRows);
  const computeStageBindings = computeStageBindingRows({
    computeCompositions,
    pluginContracts
  });
  const pluginResultInterfaces =
    pluginResultInterfaceRows(computeStageBindings);
  const traversalBindConservation = traversalBindConservationRows({
    vectorRows,
    targetCarrierContracts,
    computeCompositions,
    computeStageBindings
  });
  const hookBoundaries = hookBoundaryRows(vectorRows);
  const selectionBoundaries = Object.freeze([]);
  const jobBindings = jobBindingRows(module);
  const roleBindings = roleBindingRows(module);
  const externalToolGates = Object.freeze([]);
  const runtimeBindings = runtimeBindingRows({
    module,
    pluginContracts,
    computeStageBindings
  });
  const presentFeatureKinds = presentT153FeatureKinds({
    module,
    sameObjectProofs,
    operatorDeclarations,
    evaluatorDeclarations,
    ruleDeclarations,
    computeCompositions,
    computeStageBindings,
    hookBoundaries,
    selectionBoundaries,
    jobBindings,
    roleBindings,
    externalToolGates,
    publicStartTargets: publicStartTargetRows,
    runtimeBindings
  });

  const conformanceInput: GtlProgramConformanceInput = Object.freeze({
    subjectRef,
    abiPackageVersion: ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.packageVersion,
    expectedCoverage: Object.freeze({
      catalogGraphFunctionCount: catalogGraphFunctionRefs.length,
      publishedGraphFunctionCount: module.graphFunctions.length,
      graphVectorCount,
      targetCarrierContractCount: targetCarrierContracts.length,
      edgeClosureContractCount: edgeClosureContracts.length,
      overlayCount: overlays.length,
      publicStartTargetCount: publicStartTargetRows.length,
      promptAssetCount: promptAssets.length,
      pluginContractCount: pluginContracts.length,
      sourceIdentitySurfaceCount: sourceIdentitySurfaces.length
    }),
    featureCoverageManifest: featureCoverageManifest({
      presentFeatureKinds,
      manifestRef:
        input.featureCoverageManifestRef ??
        SDLC_GTL_PROGRAM_CONFORMANCE_FEATURE_COVERAGE_REF
    }),
    catalogGraphFunctionRefs,
    modules: Object.freeze([module]),
    targetCarrierContracts,
    edgeClosureContracts,
    overlays,
    publicStartTargets: publicStartTargetRows,
    promptAssets,
    pluginContracts,
    pluginResultInterfaces,
    traversalBindConservation,
    sourceIdentitySurfaces,
    sourceAuthorityPolicies,
    semanticReviewGates,
    sameObjectProofs,
    operatorDeclarations,
    evaluatorDeclarations,
    ruleDeclarations,
    computeCompositions,
    computeStageBindings,
    hookBoundaries,
    selectionBoundaries,
    jobBindings,
    roleBindings,
    externalToolGates,
    runtimeBindings
  });
  return conformanceInput;
}

export function admitCurrentSdlcGtlProgramConformanceInput(
  input: SdlcGtlProgramConformanceInputOptions = {}
): GtlProgramConformanceInputAdmission {
  return admitGtlProgramConformanceInput(
    constructCurrentSdlcGtlProgramConformanceInput(input)
  );
}

export function typecheckSdlcGtlProgramConformanceInput(
  input: unknown
): GtlProgramConformanceReport {
  const admission = admitGtlProgramConformanceInput(input);
  return typecheckGtlProgram(
    admission.issues.length === 0 ? admission.input : input
  );
}

export function typecheckCurrentSdlcGtlProgram(
  input: SdlcGtlProgramConformanceInputOptions = {}
): GtlProgramConformanceReport {
  const admission = admitCurrentSdlcGtlProgramConformanceInput(input);
  return typecheckGtlProgram(
    admission.issues.length === 0
      ? admission.input
      : constructCurrentSdlcGtlProgramConformanceInput(input)
  );
}

export function assertSdlcGtlProgramConformanceReportPassed(
  report: GtlProgramConformanceReport
): GtlProgramConformanceReport {
  if (!report.passed || report.issueCount > 0) {
    throw new TypeError(
      `SDLC GTL program conformance failed:\n${formatGtlProgramConformanceIssues(report.issues)}`
    );
  }
  return report;
}

export function assertCurrentSdlcGtlProgramConformance(
  input: SdlcGtlProgramConformanceInputOptions = {}
): GtlProgramConformanceReport {
  const report = assertSdlcGtlProgramConformanceReportPassed(
    typecheckCurrentSdlcGtlProgram(input)
  );
  if (semanticCompilerFpReviewEnabled()) {
    assertCurrentSdlcSemanticCompilerFpReviewGate(input);
  }
  return report;
}
