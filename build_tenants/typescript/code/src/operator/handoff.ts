// Implements: REQ-F-ODDSDLC-053
// Implements: REQ-F-ODDSDLC-054
// Implements: REQ-F-ODDSDLC-055
// Implements: REQ-F-ODDSDLC-058
// Implements: REQ-F-ODDSDLC-059
// Implements: REQ-F-ODDSDLC-060
// Implements: REQ-F-ODDSDLC-061
// Implements: REQ-F-ODDSDLC-063
// Implements: REQ-F-ODDSDLC-064

import { createHash } from "node:crypto";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readSync,
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
  constructSdlcTargetCarrierRegistry,
  constructSdlcGtlModule,
  FG_DERIVE_LITE_COMPONENT_CODE_SURFACE,
  FG_DERIVE_LITE_DESIGN_ADR_SURFACE,
  FG_FRAMEWORK_SMOKE_MIN_FP_EXECUTIVE,
  FG_CONFORM_PROJECT_AUTHORITY,
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  requireSdlcTargetCarrierRow,
  type SdlcTargetCarrierContractRow
} from "../graph/index.js";
import {
  constructSdlcArchiveWritePlan,
  constructSdlcOperatorRunArtifactArchiveWritePlan,
  executeSdlcArchiveWritePlan
} from "../effects/archive_store.js";
import {
  operatorRunArtifactRowForRelativePath,
  requireOperatorRunArtifactRowForArtifactRef
} from "../contracts/operator_run_artifact_catalog.js";
import {
  constructSdlcWriteTextFilePlan,
  executeSdlcFileStoreEffectPlan
} from "../effects/file_store.js";
import {
  constructSdlcProcessRunPlan,
  executeSdlcProcessRunPlan
} from "../effects/process_runner.js";
import { decideSdlcTenantStackAuthorityStatus } from "../contracts/blocking_reason_catalog.js";
import {
  constructSdlcTenantTechnologyStackAuthority,
  type SdlcTenantTechnologyStackAuthority
} from "../authority/tenant_stack_authority.js";
import {
  deriveSdlcPostflightGapActions,
  SDLC_POSTFLIGHT_GAP_ACTIONS,
  sdlcPostflightGapRetryEligible
} from "../postflight/gap_dossier_plan.js";
import {
  parseClosedRecord,
  parseBoolean,
  parseEnumValue,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import { admitExactContractEnum } from "../shared/fd_admission.js";
import { admitDesignDepthRegisterFromArtifact } from "./design_depth_register.js";
import {
  selectSdlcWorkCategoryGovernance
} from "./work_category_governance.js";
import {
  deriveSdlcTestDependencyMapFromImplementationDependencyMap,
  deriveSdlcStagedImplementationTopologyAuthority,
  deriveSdlcStagedTestTopologyAuthority,
  selectSdlcDependencyMapTraversal
} from "./decomposition_admission.js";
import { admitTestExecutionSurfaceRegisterFromArtifact } from "./test_execution_surface_register.js";
import {
  admitSdlcBlockingReason,
  canonicalSdlcPriorGapReasonCode,
  legacyBlockingReasonCode,
  makeSdlcBlockingReason,
  SDLC_BLOCKING_REASON_CODES,
  sdlcBlockingReasonFromLegacy,
  type SdlcBlockingReason,
  type SdlcBlockingReasonCode
} from "../shared/blocking_reason.js";
import {
  deriveSdlcFeatureScope,
  sdlcTraversalObligationInFeatureScope
} from "./feature_scope.js";
import {
  digestSdlcEdgeGainClosureContract,
  resolveSdlcEdgeGainClosureContract,
  sdlcEdgeAssuranceContractRef
} from "./edge_gain_closure.js";
import { admitComponentDepthRegisterFromArtifact } from "./component_depth_register.js";
import { admitTestDesignRegisterFromArtifact } from "./test_design_register.js";
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
import {
  isPlaceholderRequirementMarker,
  localRequirementMarker,
  requirementAuthorityIdentityForMarker
} from "../workspace/source_input.js";
import {
  SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE,
  SDLC_COMPONENT_CONCERN_ROLES,
  SDLC_COMPONENT_REPAIR_SCHEDULE_STATUSES,
  SDLC_COMPONENT_REPAIR_TARGETS,
  SDLC_DESIGN_COMPLETENESS_AXES,
  SDLC_DESIGN_COMPLETENESS_STATUSES,
  SDLC_DOMAIN_ATTRIBUTE_CARDINALITIES,
  SDLC_DOMAIN_ENTITY_OWNERSHIP,
  SDLC_REVIEW_GRADE_FAILURE_CLASSES
} from "./carriers.js";
import type {
  SdlcMaterializedProductFile,
  SdlcMaterializedProductFileRole,
  SdlcPostflightResult,
  SdlcPostflightGapDossier,
  SdlcPostflightGapReason,
  SdlcPostflightGapReasonClass,
  SdlcComponentDepthRegister,
  SdlcComponentExecutionFailureRegister,
  SdlcComponentExecutionFailureRow,
  SdlcComponentRealizationRow,
  SdlcComponentRepairReentryPlan,
  SdlcComponentRepairSchedule,
  SdlcComponentRepairScheduleRow,
  SdlcComponentTestQualificationRow,
  SdlcComponentTestRealizationRow,
  SdlcDesignDepthRegister,
  SdlcDesignDepthRegisterAdmission,
  SdlcTestDesignRegister,
  SdlcTestExecutionPreparationRow,
  SdlcTestExecutionSurfaceRegister,
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
  SdlcWorkerTargetCarrierConstructionTemplate,
  SdlcWorkerTargetCarrierObjectTemplate,
  SdlcWorkerInvocationObligation,
  SdlcWorkerInvocationPackage,
  SdlcWorkerTargetCarrierProjection,
  SdlcWorkerTargetCarrierPromptProjection,
  SdlcWorkerConstructionBrief,
  SdlcWorkerRetryRepairInstruction,
  SdlcWorkerRetryRepairScope,
  SdlcWorkerHandoffManifest,
  SdlcWorkerExecutionEvidence,
  SdlcWorkerExecutionShardEvidence,
  SdlcWorkerObligationAssessment,
  SdlcWorkerRetryContext,
  SdlcWorkerResultMaterializationDiagnostic,
  SdlcWorkerResultReport,
  SdlcDecompositionSummary,
  SdlcDependencyTraversalSelection,
  SdlcModuleDependencyMap,
  SdlcTestDependencyMap
} from "./carriers.js";

export interface SdlcObservedProductFileSnapshot {
  readonly relativePath: string;
  readonly absolutePath: string;
  readonly digest: string;
  readonly byteCount: number;
}

export interface SdlcStagedConstructionAuditCarrier {
  readonly artifactRef: string;
  readonly relativePath: string;
  readonly payload:
    | SdlcDecompositionSummary
    | SdlcModuleDependencyMap
    | SdlcTestDependencyMap
    | SdlcDependencyTraversalSelection;
}

export interface SdlcProductMaterializationSnapshot {
  readonly kind: "sdlc_product_materialization_snapshot";
  readonly tenantRoot: string;
  readonly files: readonly SdlcObservedProductFileSnapshot[];
}

const REPORT_FIELDS = Object.freeze([
  "kind",
  "projectionRole",
  "authoritativeStageResultRef",
  "graphFunctionName",
  "edgeName",
  "targetAssetType",
  "outputFile",
  "digest",
  "summary",
  "unresolvedReasons",
  "materializedFiles",
  "materializationDiagnostics",
  "executionEvidence",
  "executionEvidenceErrors",
  "obligationAssessments",
  "fpTransformRequestRef",
  "fpTransformResultRef",
  "fpTransformStatusSnapshot",
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
  component_code_surface: "design/component_code_surface.md",
  component_realization_qualification_surface:
    "design/component_realization_qualification_surface.md",
  code_surface: "design/code_surface.md",
  test_design_surface: "design/adrs/ADR-003-test-design-surface.md",
  component_test_surface: "design/component_test_surface.md",
  component_test_qualification_surface:
    "design/component_test_qualification_surface.md",
  component_repair_schedule_surface: "design/component_repair_schedule_surface.md",
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

const WORKSPACE_LOCAL_SDLC_SURFACE_OUTPUT_PATHS = Object.freeze({
  intent_surface: "specification/INTENT.md",
  product_surface: "specification/PRODUCT.md",
  goal_surface: "specification/GOALS.md",
  requirement_surface: "specification/requirements/10-generated-bootstrap.md",
  uat_testcases_surface: "specification/scenarios/20-generated-uat-testcases.md",
  testcase_authority_surface:
    "specification/scenarios/30-generated-testcase-authority.md"
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

const REQUIREMENT_MARKER_TOKEN_EXPRESSION =
  /\b(?:RF-[A-Z0-9]+(?:-[A-Z0-9]+)*|REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*)\b(?!-)/;
const REQUIREMENT_MARKER_EXPRESSION =
  /\b(?:RF-[A-Z0-9]+(?:-[A-Z0-9]+)*|REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*)\b(?!-)/g;
const LOCAL_REQUIREMENT_HEADING_EXPRESSION =
  /^[ \t]{0,3}(?:#{1,6}\s+|[-*]\s+)?(R-\d{1,4})(?:\s*[:.-]\s*|\s+)([^\n]+?)\s*$/gimu;
const MAX_INVOCATION_PACKAGE_REQUIREMENT_TRACE_IDS = 80;

const TRAVERSAL_AUTHORITY_PATHS = Object.freeze([
  "specification/INTENT.md",
  "specification/PRODUCT.md",
  "specification/GOALS.md",
  "specification/REQUIREMENTS.md",
  "specification/mapper_requirements.md",
  "bootstrap.md",
  ".ai-workspace/context/project_bootstrap.md",
  ".ai-workspace/context/project_constraints.yml"
] as const);

const PROJECT_BOOTSTRAP_RELATIVE_PATH =
  ".ai-workspace/context/project_bootstrap.md" as const;

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

function workspaceLocalSdlcSurfaceRelativePath(targetAssetType: string): string | null {
  for (const [assetType, relativePath] of Object.entries(
    WORKSPACE_LOCAL_SDLC_SURFACE_OUTPUT_PATHS
  )) {
    if (assetType === targetAssetType) {
      return relativePath;
    }
  }
  return null;
}

function isTenantLocalSdlcSurfaceRelativePath(relativePath: string): boolean {
  const normalized = normalizedRelativePath(relativePath);
  const tenantLocalPaths: readonly string[] = Object.values(
    TENANT_LOCAL_SDLC_SURFACE_OUTPUT_PATHS
  );
  return tenantLocalPaths.includes(normalized);
}

function deriveOutputFileForTarget(input: {
  readonly defaultOutputRoot: string;
  readonly workspaceRoot: string;
  readonly targetAssetType: string;
  readonly materialization: SdlcProductMaterializationContract;
}): string {
  const workspaceRelativePath = workspaceLocalSdlcSurfaceRelativePath(
    input.targetAssetType
  );
  if (workspaceRelativePath !== null) {
    return join(input.workspaceRoot, workspaceRelativePath);
  }
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

function installedOperatorOwnsEvaluationOutput(targetAssetType: string): boolean {
  return (
    targetAssetType === "component_realization_qualification_surface" ||
    targetAssetType === "test_execution_surface" ||
    targetAssetType === "test_execution_result_surface" ||
    targetAssetType === "component_test_qualification_surface" ||
    targetAssetType === "test_run_archive_surface" ||
    targetAssetType === "release_depth_parity_surface"
  );
}

function workerAuthoredTargetCarrierProtocolRequired(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  if (installedOperatorOwnsEvaluationOutput(manifest.targetAssetType)) {
    return false;
  }
  return (
    manifest.targetAssetType === "component_code_surface" ||
    manifest.targetAssetType === "component_test_surface" ||
    manifest.targetAssetType === "test_design_surface" ||
    manifest.targetAssetType === "component_repair_schedule_surface"
  );
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
  return productMaterializationHasExecutionRepairScope({
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    productMaterialization: manifest.productMaterialization
  });
}

function productMaterializationHasExecutionRepairScope(input: {
  readonly edgeName: string;
  readonly targetAssetType: string;
  readonly productMaterialization: SdlcProductMaterializationContract;
}): boolean {
  if (
    input.targetAssetType === "test_execution_result_surface" &&
    declaredExecutionContract(input.productMaterialization.testExecutionContract)
  ) {
    return true;
  }
  return (
    (input.edgeName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET ||
      input.edgeName === FG_DERIVE_LITE_COMPONENT_CODE_SURFACE) &&
    input.targetAssetType === "component_code_surface" &&
    input.productMaterialization.required &&
    declaredExecutionContract(input.productMaterialization.testExecutionContract)
  );
}

function manifestAdmitsTestExecutionEvidence(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return targetAdmitsTestExecutionEvidence(manifest.targetAssetType);
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

function targetCarrierRowForEdge(edgeName: string): SdlcTargetCarrierContractRow {
  return requireSdlcTargetCarrierRow({
    registry: constructSdlcTargetCarrierRegistry({
      module: constructSdlcGtlModule()
    }),
    edgeRef: edgeName
  });
}

function targetCarrierObjectTemplate(input: {
  readonly templateRef: string;
  readonly requiredFields: readonly string[];
  readonly fieldTypes: Readonly<Record<string, string>>;
  readonly enumDomains?: Readonly<Record<string, readonly string[]>>;
  readonly example: Readonly<Record<string, unknown>>;
}): SdlcWorkerTargetCarrierObjectTemplate {
  return Object.freeze({
    kind: "sdlc_worker_target_carrier_object_template" as const,
    templateRef: input.templateRef,
    closed: true as const,
    requiredFields: Object.freeze([...input.requiredFields]),
    fieldTypes: Object.freeze({ ...input.fieldTypes }),
    enumDomains: Object.freeze({ ...(input.enumDomains ?? {}) }),
    example: Object.freeze({ ...input.example })
  });
}

function implementationDesignConstructionTemplate(
  row: SdlcTargetCarrierContractRow
): SdlcWorkerTargetCarrierConstructionTemplate {
  const modulePlaceholder = "<module>";
  const entityPlaceholder = "<entity>";
  const attributePlaceholder = `attr:${modulePlaceholder}.${entityPlaceholder}.runtime`;
  const attributeExample = Object.freeze({
    kind: "sdlc_domain_attribute",
    attributeId: attributePlaceholder,
    name: "runtime",
    valueType: "string",
    cardinality: "one",
    invariantRefs: ["<requirement-or-invariant-ref>"]
  });
  const operationExample = Object.freeze({
    kind: "sdlc_domain_operation",
    operationId: "<operation>",
    moduleName: modulePlaceholder,
    inputEntityIds: [],
    outputEntityIds: [entityPlaceholder],
    requiredAttributeIds: [attributePlaceholder]
  });
  return Object.freeze({
    kind: "sdlc_worker_target_carrier_construction_template" as const,
    templateRef: row.constructionTemplateRef,
    targetAssetType: row.targetAssetType,
    carrierKind: row.outputCarrierKind,
    nestedPayloadPath: row.nestedPayloadPath,
    carrierEnvelope: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/carrier-envelope`,
      requiredFields: row.requiredFieldRefs,
      fieldTypes: Object.freeze({
        kind: "literal",
        targetAssetType: "literal",
        edgeRef: "literal",
        contractRef: "literal",
        contractDigest: "sha256",
        payload: "sdlc_design_depth_register"
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze([row.outputCarrierKind]),
        targetAssetType: Object.freeze([row.targetAssetType]),
        edgeRef: Object.freeze([row.edgeRef]),
        contractRef: Object.freeze([row.targetCarrierContractRef])
      }),
      example: Object.freeze({
        kind: row.outputCarrierKind,
        targetAssetType: row.targetAssetType,
        edgeRef: row.edgeRef,
        contractRef: row.targetCarrierContractRef,
        contractDigest: row.targetCarrierContractDigest,
        payload: "<design_depth_register>"
      })
    }),
    payloadTemplate: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/payload/design-depth-register`,
      requiredFields: Object.freeze([
        "kind",
        "registerVersion",
        "targetAssetType",
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
      ]),
      fieldTypes: Object.freeze({
        kind: "literal:sdlc_design_depth_register",
        registerVersion: "literal:ts-design-depth-v1",
        targetAssetType: "literal:implementation_design_surface",
        stackProfileRows: "sdlc_stack_profile_row[]",
        implementationModuleRows: "sdlc_implementation_module_row[]",
        aggregateDomainModelRows: "sdlc_aggregate_domain_model_row[]",
        moduleSchemaFragments: "sdlc_module_schema_fragment[]",
        moduleStateDiagramFragments: "sdlc_module_state_diagram_fragment[]",
        aggregateDomainModel: "sdlc_aggregate_domain_model",
        sunnyDaySequenceRows: "sdlc_sunny_day_sequence_row[]",
        aggregateSunnyDaySequence: "sdlc_aggregate_sunny_day_sequence",
        componentTopologyRows: "sdlc_component_topology_row[]",
        componentRealizationRows: "sdlc_component_realization_row[]",
        fileTargetRows: "sdlc_file_target_row[]",
        designCompletenessVerdict: "sdlc_design_completeness_verdict"
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze(["sdlc_design_depth_register"]),
        registerVersion: Object.freeze(["ts-design-depth-v1"]),
        targetAssetType: Object.freeze(["implementation_design_surface"])
      }),
      example: Object.freeze({
        kind: "sdlc_design_depth_register",
        registerVersion: "ts-design-depth-v1",
        targetAssetType: "implementation_design_surface",
        stackProfileRows: ["<sdlc_stack_profile_row>"],
        implementationModuleRows: ["<sdlc_implementation_module_row>"],
        aggregateDomainModelRows: ["<sdlc_aggregate_domain_model_row>"],
        moduleSchemaFragments: ["<sdlc_module_schema_fragment>"],
        moduleStateDiagramFragments: ["<sdlc_module_state_diagram_fragment>"],
        aggregateDomainModel: "<sdlc_aggregate_domain_model>",
        sunnyDaySequenceRows: ["<sdlc_sunny_day_sequence_row>"],
        aggregateSunnyDaySequence: "<sdlc_aggregate_sunny_day_sequence>",
        componentTopologyRows: ["<sdlc_component_topology_row>"],
        componentRealizationRows: ["<sdlc_component_realization_row>"],
        fileTargetRows: ["<sdlc_file_target_row>"],
        designCompletenessVerdict: "<sdlc_design_completeness_verdict>"
      })
    }),
    rowTemplates: Object.freeze([
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/stack-profile`,
        requiredFields: Object.freeze([
          "kind",
          "stackRef",
          "language",
          "buildTool"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_stack_profile_row",
          stackRef: "uri",
          language: "string",
          buildTool: "string"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_stack_profile_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_stack_profile_row",
          stackRef: "<stack-ref>",
          language: "<language>",
          buildTool: "<tool>"
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/implementation-module`,
        requiredFields: Object.freeze([
          "kind",
          "moduleName",
          "moduleRef"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_implementation_module_row",
          moduleName: "string",
          moduleRef: "uri"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_implementation_module_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_implementation_module_row",
          moduleName: modulePlaceholder,
          moduleRef: `module://${modulePlaceholder}`
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/aggregate-domain-model-row`,
        requiredFields: Object.freeze([
          "kind",
          "modelRef"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_aggregate_domain_model_row",
          modelRef: "uri"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_aggregate_domain_model_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_aggregate_domain_model_row",
          modelRef: `<model-ref>`
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/domain-attribute`,
        requiredFields: Object.freeze([
          "kind",
          "attributeId",
          "name",
          "valueType",
          "cardinality",
          "invariantRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_domain_attribute",
          attributeId: "string",
          name: "string",
          valueType: "string",
          cardinality: "enum",
          invariantRefs: "string[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_domain_attribute"]),
          cardinality: SDLC_DOMAIN_ATTRIBUTE_CARDINALITIES
        }),
        example: attributeExample
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/module-schema-fragment`,
        requiredFields: Object.freeze([
          "kind",
          "moduleName",
          "entities",
          "operations",
          "requirementIds",
          "sourceAssetRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_module_schema_fragment",
          moduleName: "string",
          entities: "sdlc_domain_entity[]",
          operations: "sdlc_domain_operation[]",
          requirementIds: "string[]",
          sourceAssetRefs: "workspace-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_module_schema_fragment"])
        }),
        example: Object.freeze({
          kind: "sdlc_module_schema_fragment",
          moduleName: modulePlaceholder,
          entities: [
            {
              kind: "sdlc_domain_entity",
              entityId: entityPlaceholder,
              moduleName: modulePlaceholder,
              ownership: "owned",
              attributes: [attributeExample],
              invariants: [],
              sourceAssetRefs: ["workspace://..."]
            }
          ],
          operations: [operationExample],
          requirementIds: ["<requirement-id>"],
          sourceAssetRefs: ["workspace://..."]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/domain-entity`,
        requiredFields: Object.freeze([
          "kind",
          "entityId",
          "moduleName",
          "ownership",
          "attributes",
          "invariants",
          "sourceAssetRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_domain_entity",
          entityId: "string",
          moduleName: "string",
          ownership: "enum",
          attributes: "sdlc_domain_attribute[]",
          invariants: "string[]",
          sourceAssetRefs: "workspace-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_domain_entity"]),
          ownership: SDLC_DOMAIN_ENTITY_OWNERSHIP
        }),
        example: Object.freeze({
          kind: "sdlc_domain_entity",
          entityId: entityPlaceholder,
          moduleName: modulePlaceholder,
          ownership: "owned",
          attributes: [attributeExample],
          invariants: [],
          sourceAssetRefs: ["workspace://..."]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/domain-operation`,
        requiredFields: Object.freeze([
          "kind",
          "operationId",
          "moduleName",
          "inputEntityIds",
          "outputEntityIds",
          "requiredAttributeIds"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_domain_operation",
          operationId: "string",
          moduleName: "string",
          inputEntityIds: "string[]",
          outputEntityIds: "string[]",
          requiredAttributeIds: "attributeId[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_domain_operation"])
        }),
        example: operationExample
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/aggregate-domain-model`,
        requiredFields: Object.freeze([
          "kind",
          "modelVersion",
          "entities",
          "operations",
          "crossModuleReferences",
          "evidenceRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_aggregate_domain_model",
          modelVersion: "literal:ts-design-depth-v1",
          entities: "sdlc_aggregate_domain_entity[]",
          operations: "sdlc_domain_operation[]",
          crossModuleReferences: "sdlc_cross_module_reference[]",
          evidenceRefs: "workspace-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_aggregate_domain_model"]),
          modelVersion: Object.freeze(["ts-design-depth-v1"])
        }),
        example: Object.freeze({
          kind: "sdlc_aggregate_domain_model",
          modelVersion: "ts-design-depth-v1",
          entities: [
            {
              kind: "sdlc_aggregate_domain_entity",
              entityId: entityPlaceholder,
              ownerModuleName: modulePlaceholder,
              attributes: [attributeExample],
              sourceModuleNames: [modulePlaceholder]
            }
          ],
          operations: [operationExample],
          crossModuleReferences: [],
          evidenceRefs: ["workspace://..."]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/aggregate-domain-entity`,
        requiredFields: Object.freeze([
          "kind",
          "entityId",
          "ownerModuleName",
          "attributes",
          "sourceModuleNames"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_aggregate_domain_entity",
          entityId: "string",
          ownerModuleName: "string",
          attributes: "sdlc_domain_attribute[]",
          sourceModuleNames: "string[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_aggregate_domain_entity"])
        }),
        example: Object.freeze({
          kind: "sdlc_aggregate_domain_entity",
          entityId: entityPlaceholder,
          ownerModuleName: modulePlaceholder,
          attributes: [attributeExample],
          sourceModuleNames: [modulePlaceholder]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/cross-module-reference`,
        requiredFields: Object.freeze([
          "fromModuleName",
          "toModuleName",
          "entityId"
        ]),
        fieldTypes: Object.freeze({
          fromModuleName: "string",
          toModuleName: "string",
          entityId: "string"
        }),
        enumDomains: Object.freeze({}),
        example: Object.freeze({
          fromModuleName: "<from-module>",
          toModuleName: "<to-module>",
          entityId: entityPlaceholder
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/state-transition`,
        requiredFields: Object.freeze([
          "kind",
          "transitionId",
          "fromState",
          "toState",
          "operationId",
          "entityId"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_entity_state_transition",
          transitionId: "string",
          fromState: "string",
          toState: "string",
          operationId: "string",
          entityId: "string"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_entity_state_transition"])
        }),
        example: Object.freeze({
          kind: "sdlc_entity_state_transition",
          transitionId: "<transition>",
          fromState: "<from>",
          toState: "<to>",
          operationId: operationExample.operationId,
          entityId: entityPlaceholder
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/module-state-diagram-fragment`,
        requiredFields: Object.freeze([
          "kind",
          "moduleName",
          "entityId",
          "stateless",
          "states",
          "transitions",
          "requirementIds",
          "sourceAssetRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_module_state_diagram_fragment",
          moduleName: "string",
          entityId: "string",
          stateless: "boolean",
          states: "string[]",
          transitions: "sdlc_entity_state_transition[]",
          requirementIds: "string[]",
          sourceAssetRefs: "workspace-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_module_state_diagram_fragment"])
        }),
        example: Object.freeze({
          kind: "sdlc_module_state_diagram_fragment",
          moduleName: modulePlaceholder,
          entityId: entityPlaceholder,
          stateless: true,
          states: [],
          transitions: [],
          requirementIds: ["<requirement-id>"],
          sourceAssetRefs: ["workspace://..."]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/sunny-day-sequence-row`,
        requiredFields: Object.freeze([
          "kind",
          "sequenceRef"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_sunny_day_sequence_row",
          sequenceRef: "uri"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_sunny_day_sequence_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_sunny_day_sequence_row",
          sequenceRef: "<sequence-ref>"
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/sunny-day-sequence-step`,
        requiredFields: Object.freeze([
          "kind",
          "stepId",
          "moduleName",
          "operationId",
          "inputEntityIds",
          "outputEntityIds",
          "stateTransitionIds"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_sunny_day_sequence_step",
          stepId: "string",
          moduleName: "string",
          operationId: "string",
          inputEntityIds: "string[]",
          outputEntityIds: "string[]",
          stateTransitionIds: "string[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_sunny_day_sequence_step"])
        }),
        example: Object.freeze({
          kind: "sdlc_sunny_day_sequence_step",
          stepId: "<step>",
          moduleName: modulePlaceholder,
          operationId: operationExample.operationId,
          inputEntityIds: [],
          outputEntityIds: [entityPlaceholder],
          stateTransitionIds: []
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/aggregate-sunny-day-sequence`,
        requiredFields: Object.freeze([
          "kind",
          "sequenceVersion",
          "steps",
          "evidenceRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_aggregate_sunny_day_sequence",
          sequenceVersion: "literal:ts-design-depth-v1",
          steps: "sdlc_sunny_day_sequence_step[]",
          evidenceRefs: "workspace-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_aggregate_sunny_day_sequence"]),
          sequenceVersion: Object.freeze(["ts-design-depth-v1"])
        }),
        example: Object.freeze({
          kind: "sdlc_aggregate_sunny_day_sequence",
          sequenceVersion: "ts-design-depth-v1",
          steps: [
            {
              kind: "sdlc_sunny_day_sequence_step",
              stepId: "<step>",
              moduleName: modulePlaceholder,
              operationId: operationExample.operationId,
              inputEntityIds: [],
              outputEntityIds: [entityPlaceholder],
              stateTransitionIds: []
            }
          ],
          evidenceRefs: ["workspace://..."]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/component-topology`,
        requiredFields: Object.freeze([
          "kind",
          "componentId",
          "moduleName",
          "relativePath",
          "publicBoundary",
          "concernRole",
          "requirementIds",
          "sourceAssetRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_component_topology_row",
          componentId: "string",
          moduleName: "string",
          relativePath: "workspace-relative-path",
          publicBoundary: "string",
          concernRole: "enum",
          requirementIds: "string[]",
          sourceAssetRefs: "workspace-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_component_topology_row"]),
          concernRole: SDLC_COMPONENT_CONCERN_ROLES
        }),
        example: Object.freeze({
          kind: "sdlc_component_topology_row",
          componentId: "<component>",
          moduleName: modulePlaceholder,
          relativePath: "<source-file>",
          publicBoundary: "<boundary>",
          concernRole: "io_adapter",
          requirementIds: ["<requirement-id>"],
          sourceAssetRefs: ["workspace://..."]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/component-realization`,
        requiredFields: Object.freeze([
          "kind",
          "componentId",
          "moduleName",
          "relativePath",
          "publicBoundary",
          "trancheId",
          "firstProductFileToChange",
          "upstreamComponentIds",
          "requirementIds",
          "sourceAssetRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_component_realization_row",
          componentId: "string",
          moduleName: "string",
          relativePath: "workspace-relative-path",
          publicBoundary: "string",
          trancheId: "string|null",
          firstProductFileToChange: "workspace-relative-path|null",
          upstreamComponentIds: "string[]",
          requirementIds: "string[]",
          sourceAssetRefs: "workspace-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_component_realization_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_component_realization_row",
          componentId: "<component>",
          moduleName: modulePlaceholder,
          relativePath: "<source-file>",
          publicBoundary: "<boundary>",
          trancheId: null,
          firstProductFileToChange: "<source-file>",
          upstreamComponentIds: [],
          requirementIds: ["<requirement-id>"],
          sourceAssetRefs: ["workspace://..."]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/file-target`,
        requiredFields: Object.freeze([
          "kind",
          "relativePath",
          "role"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_file_target_row",
          relativePath: "workspace-relative-path",
          role: "string"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_file_target_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_file_target_row",
          relativePath: "<source-file>",
          role: "source"
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/design-completeness-axis-verdict`,
        requiredFields: Object.freeze([
          "kind",
          "axis",
          "status",
          "reasons",
          "evidenceRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_design_completeness_axis_verdict",
          axis: "enum",
          status: "enum",
          reasons: "string[]",
          evidenceRefs: "workspace-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_design_completeness_axis_verdict"]),
          axis: SDLC_DESIGN_COMPLETENESS_AXES,
          status: SDLC_DESIGN_COMPLETENESS_STATUSES
        }),
        example: Object.freeze({
          kind: "sdlc_design_completeness_axis_verdict",
          axis: "entity",
          status: "satisfied",
          reasons: [],
          evidenceRefs: ["workspace://..."]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/design-completeness-verdict`,
        requiredFields: Object.freeze([
          "kind",
          "verdictVersion",
          "entity",
          "attribute",
          "flow"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_design_completeness_verdict",
          verdictVersion: "literal:ts-design-depth-v1",
          entity: "sdlc_design_completeness_axis_verdict",
          attribute: "sdlc_design_completeness_axis_verdict",
          flow: "sdlc_design_completeness_axis_verdict"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_design_completeness_verdict"]),
          verdictVersion: Object.freeze(["ts-design-depth-v1"])
        }),
        example: Object.freeze({
          kind: "sdlc_design_completeness_verdict",
          verdictVersion: "ts-design-depth-v1",
          entity: {
            kind: "sdlc_design_completeness_axis_verdict",
            axis: "entity",
            status: "satisfied",
            reasons: [],
            evidenceRefs: ["workspace://..."]
          },
          attribute: {
            kind: "sdlc_design_completeness_axis_verdict",
            axis: "attribute",
            status: "satisfied",
            reasons: [],
            evidenceRefs: ["workspace://..."]
          },
          flow: {
            kind: "sdlc_design_completeness_axis_verdict",
            axis: "flow",
            status: "satisfied",
            reasons: [],
            evidenceRefs: ["workspace://..."]
          }
        })
      })
    ])
  });
}

function testDesignConstructionTemplate(
  row: SdlcTargetCarrierContractRow
): SdlcWorkerTargetCarrierConstructionTemplate {
  const testCaseRef = "<test-case-ref>";
  const obligationRef = "<source-design-obligation-ref>";
  const authorityRef = "<testcase-authority-ref>";
  const frameworkRef = "<framework-ref>";
  const shardId = "<shard-id>";
  return Object.freeze({
    kind: "sdlc_worker_target_carrier_construction_template" as const,
    templateRef: row.constructionTemplateRef,
    targetAssetType: row.targetAssetType,
    carrierKind: row.outputCarrierKind,
    nestedPayloadPath: row.nestedPayloadPath,
    carrierEnvelope: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/carrier-envelope`,
      requiredFields: row.requiredFieldRefs,
      fieldTypes: Object.freeze({
        kind: "literal",
        targetAssetType: "literal",
        edgeRef: "literal",
        contractRef: "literal",
        contractDigest: "sha256",
        payload: "sdlc_test_design_register"
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze([row.outputCarrierKind]),
        targetAssetType: Object.freeze([row.targetAssetType]),
        edgeRef: Object.freeze([row.edgeRef]),
        contractRef: Object.freeze([row.targetCarrierContractRef])
      }),
      example: Object.freeze({
        kind: row.outputCarrierKind,
        targetAssetType: row.targetAssetType,
        edgeRef: row.edgeRef,
        contractRef: row.targetCarrierContractRef,
        contractDigest: row.targetCarrierContractDigest,
        payload: "<test_design_register>"
      })
    }),
    payloadTemplate: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/payload/test-design-register`,
      requiredFields: Object.freeze([
        "kind",
        "registerVersion",
        "targetAssetType",
        "designConsumptionRows",
        "uatTestcaseRows",
        "testcaseAuthorityRows",
        "testStackProfileRows",
        "testModuleRows",
        "testComponentTopologyRows",
        "testDataBindings",
        "expectedResultBindings",
        "uatIntegrationBindings",
        "testExecutionScheduleRows"
      ]),
      fieldTypes: Object.freeze({
        kind: "literal:sdlc_test_design_register",
        registerVersion: "literal:ts-test-design-v1",
        targetAssetType: "literal:test_design_surface",
        designConsumptionRows: "sdlc_design_consumption_contract[]",
        uatTestcaseRows: "sdlc_test_case_row[]",
        testcaseAuthorityRows: "sdlc_test_case_row[]",
        testStackProfileRows: "sdlc_test_stack_profile_row[]",
        testModuleRows: "sdlc_test_module_row[]",
        testComponentTopologyRows: "sdlc_test_component_topology_row[]",
        testDataBindings: "sdlc_test_data_binding[]",
        expectedResultBindings: "sdlc_expected_result_binding[]",
        uatIntegrationBindings: "sdlc_uat_integration_binding[]",
        testExecutionScheduleRows: "sdlc_test_execution_schedule_row[]"
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze(["sdlc_test_design_register"]),
        registerVersion: Object.freeze(["ts-test-design-v1"]),
        targetAssetType: Object.freeze(["test_design_surface"])
      }),
      example: Object.freeze({
        kind: "sdlc_test_design_register",
        registerVersion: "ts-test-design-v1",
        targetAssetType: "test_design_surface",
        designConsumptionRows: ["<sdlc_design_consumption_contract>"],
        uatTestcaseRows: ["<sdlc_test_case_row>"],
        testcaseAuthorityRows: ["<sdlc_test_case_row>"],
        testStackProfileRows: ["<sdlc_test_stack_profile_row>"],
        testModuleRows: ["<sdlc_test_module_row>"],
        testComponentTopologyRows: ["<sdlc_test_component_topology_row>"],
        testDataBindings: ["<sdlc_test_data_binding>"],
        expectedResultBindings: ["<sdlc_expected_result_binding>"],
        uatIntegrationBindings: ["<sdlc_uat_integration_binding>"],
        testExecutionScheduleRows: ["<sdlc_test_execution_schedule_row>"]
      })
    }),
    rowTemplates: Object.freeze([
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/design-consumption`,
        requiredFields: Object.freeze([
          "kind",
          "contractRef",
          "sourceDesignObligationRefs",
          "authorityBasisRefs",
          "consumerGraphFunctionRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_design_consumption_contract",
          contractRef: "uri",
          sourceDesignObligationRefs: "ref[]",
          authorityBasisRefs: "ref[]",
          consumerGraphFunctionRefs: "graph-function-ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_design_consumption_contract"])
        }),
        example: Object.freeze({
          kind: "sdlc_design_consumption_contract",
          contractRef: "design-consumption://<tenant>/test-design",
          sourceDesignObligationRefs: [obligationRef],
          authorityBasisRefs: ["workspace://<design-asset>"],
          consumerGraphFunctionRefs: [
            "derive_component_test_surface",
            "prepare_test_execution_surface",
            "derive_test_execution_result_surface",
            "qualify_component_test_execution_surface"
          ]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/test-case`,
        requiredFields: Object.freeze([
          "kind",
          "testCaseRef",
          "caseKind",
          "executionLane",
          "sourceDesignObligationRefs",
          "testcaseAuthorityRefs",
          "expectedBehavior"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_test_case_row",
          testCaseRef: "uri",
          caseKind: "positive|negative|boundary|integration|uat|regression",
          executionLane: "unit|integration|uat",
          sourceDesignObligationRefs: "ref[]",
          testcaseAuthorityRefs: "ref[]",
          expectedBehavior: "string"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_test_case_row"]),
          caseKind: Object.freeze([
            "positive",
            "negative",
            "boundary",
            "integration",
            "uat",
            "regression"
          ]),
          executionLane: Object.freeze(["unit", "integration", "uat"])
        }),
        example: Object.freeze({
          kind: "sdlc_test_case_row",
          testCaseRef,
          caseKind: "uat",
          executionLane: "integration",
          sourceDesignObligationRefs: [obligationRef],
          testcaseAuthorityRefs: [authorityRef],
          expectedBehavior: "<observable behavior>"
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/test-stack-profile`,
        requiredFields: Object.freeze([
          "kind",
          "stackRef",
          "frameworkRef",
          "buildTool"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_test_stack_profile_row",
          stackRef: "uri",
          frameworkRef: "uri",
          buildTool: "string"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_test_stack_profile_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_test_stack_profile_row",
          stackRef: "stack://<tenant>/tests",
          frameworkRef,
          buildTool: "<declared-tool>"
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/test-module`,
        requiredFields: Object.freeze([
          "kind",
          "moduleName",
          "moduleRef",
          "testRoot"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_test_module_row",
          moduleName: "string",
          moduleRef: "uri",
          testRoot: "relative-path"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_test_module_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_test_module_row",
          moduleName: "<module-tests>",
          moduleRef: "module://<module-tests>",
          testRoot: "<tenant-test-root>"
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/test-component-topology`,
        requiredFields: Object.freeze([
          "kind",
          "testClassId",
          "relativePath",
          "testcaseIds",
          "componentIds",
          "requirementIds",
          "shardId"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_test_component_topology_row",
          testClassId: "string",
          relativePath: "relative-path",
          testcaseIds: "ref[]",
          componentIds: "ref[]",
          requirementIds: "ref[]",
          shardId: "string|null"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_test_component_topology_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_test_component_topology_row",
          testClassId: "<test-class-id>",
          relativePath: "<tenant-test-root>/<test-file>",
          testcaseIds: [testCaseRef],
          componentIds: ["<component-id>"],
          requirementIds: ["<requirement-id>"],
          shardId
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/test-data-binding`,
        requiredFields: Object.freeze([
          "kind",
          "testDataRef",
          "testCaseRef",
          "inputFixtureRefs",
          "generationPolicyRef",
          "expectedResultRef",
          "sourceDesignObligationRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_test_data_binding",
          testDataRef: "uri",
          testCaseRef: "uri",
          inputFixtureRefs: "ref[]",
          generationPolicyRef: "uri",
          expectedResultRef: "uri",
          sourceDesignObligationRefs: "ref[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_test_data_binding"])
        }),
        example: Object.freeze({
          kind: "sdlc_test_data_binding",
          testDataRef: "test-data://<tenant>/<case>",
          testCaseRef,
          inputFixtureRefs: ["fixture://<tenant>/<case>"],
          generationPolicyRef: "generation-policy://<tenant>/test-data",
          expectedResultRef: "expected-result://<tenant>/<case>",
          sourceDesignObligationRefs: [obligationRef]
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/expected-result`,
        requiredFields: Object.freeze([
          "kind",
          "expectedResultRef",
          "testCaseRef",
          "assertionRefs",
          "expectedResultSummary",
          "verificationPolicyRef"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_expected_result_binding",
          expectedResultRef: "uri",
          testCaseRef: "uri",
          assertionRefs: "ref[]",
          expectedResultSummary: "string",
          verificationPolicyRef: "uri"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_expected_result_binding"])
        }),
        example: Object.freeze({
          kind: "sdlc_expected_result_binding",
          expectedResultRef: "expected-result://<tenant>/<case>",
          testCaseRef,
          assertionRefs: ["assertion://<tenant>/<case>"],
          expectedResultSummary: "<expected result>",
          verificationPolicyRef: "verification-policy://<tenant>/<framework>"
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/uat-integration`,
        requiredFields: Object.freeze([
          "kind",
          "uatTestCaseRef",
          "integrationTestCaseRef",
          "executionLane"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_uat_integration_binding",
          uatTestCaseRef: "uri",
          integrationTestCaseRef: "uri",
          executionLane: "unit|integration|uat"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_uat_integration_binding"]),
          executionLane: Object.freeze(["unit", "integration", "uat"])
        }),
        example: Object.freeze({
          kind: "sdlc_uat_integration_binding",
          uatTestCaseRef: testCaseRef,
          integrationTestCaseRef: testCaseRef,
          executionLane: "integration"
        })
      }),
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/test-execution-schedule`,
        requiredFields: Object.freeze([
          "kind",
          "scheduleRef",
          "testCaseRefs",
          "command",
          "frameworkRef",
          "shardId"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_test_execution_schedule_row",
          scheduleRef: "uri",
          testCaseRefs: "ref[]",
          command: "string",
          frameworkRef: "uri",
          shardId: "string|null"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_test_execution_schedule_row"])
        }),
        example: Object.freeze({
          kind: "sdlc_test_execution_schedule_row",
          scheduleRef: "test-schedule://<tenant>/<framework>",
          testCaseRefs: [testCaseRef],
          command: "<declared test command>",
          frameworkRef,
          shardId
        })
      })
    ])
  });
}

function testExecutionSurfaceConstructionTemplate(
  row: SdlcTargetCarrierContractRow
): SdlcWorkerTargetCarrierConstructionTemplate {
  return Object.freeze({
    kind: "sdlc_worker_target_carrier_construction_template" as const,
    templateRef: row.constructionTemplateRef,
    targetAssetType: row.targetAssetType,
    carrierKind: row.outputCarrierKind,
    nestedPayloadPath: row.nestedPayloadPath,
    carrierEnvelope: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/carrier-envelope`,
      requiredFields: row.requiredFieldRefs,
      fieldTypes: Object.freeze({
        kind: "literal",
        targetAssetType: "literal",
        edgeRef: "literal",
        contractRef: "literal",
        contractDigest: "sha256",
        payload: "sdlc_test_execution_surface_register"
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze([row.outputCarrierKind]),
        targetAssetType: Object.freeze([row.targetAssetType]),
        edgeRef: Object.freeze([row.edgeRef]),
        contractRef: Object.freeze([row.targetCarrierContractRef])
      }),
      example: Object.freeze({
        kind: row.outputCarrierKind,
        targetAssetType: row.targetAssetType,
        edgeRef: row.edgeRef,
        contractRef: row.targetCarrierContractRef,
        contractDigest: row.targetCarrierContractDigest,
        payload: "<test_execution_surface_register>"
      })
    }),
    payloadTemplate: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/payload/test-execution-surface-register`,
      requiredFields: Object.freeze([
        "kind",
        "registerVersion",
        "targetAssetType",
        "testExecutionPreparationRows",
        "evidenceRefs"
      ]),
      fieldTypes: Object.freeze({
        kind: "literal:sdlc_test_execution_surface_register",
        registerVersion: "literal:ts-test-execution-v1",
        targetAssetType: "literal:test_execution_surface",
        testExecutionPreparationRows: "sdlc_test_execution_preparation_row[]",
        evidenceRefs: "uri[]",
        summary: "string"
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze(["sdlc_test_execution_surface_register"]),
        registerVersion: Object.freeze(["ts-test-execution-v1"]),
        targetAssetType: Object.freeze(["test_execution_surface"])
      }),
      example: Object.freeze({
        kind: "sdlc_test_execution_surface_register",
        registerVersion: "ts-test-execution-v1",
        targetAssetType: "test_execution_surface",
        testExecutionPreparationRows: [],
        evidenceRefs: ["workspace://build_tenants/<tenant>/test/<file>"],
        summary: "<test execution preparation summary>"
      })
    }),
    rowTemplates: Object.freeze([
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/test-execution-preparation`,
        requiredFields: Object.freeze([
          "kind",
          "scheduleRef",
          "moduleName",
          "testClassId",
          "testcaseIds",
          "command",
          "workingDirectory",
          "frameworkRef",
          "shardId",
          "sourceTestFileRefs",
          "requirementIds",
          "status",
          "evidenceRefs"
        ]),
        fieldTypes: Object.freeze({
          kind: "literal:sdlc_test_execution_preparation_row",
          scheduleRef: "uri",
          moduleName: "string",
          testClassId: "uri",
          testcaseIds: "uri[]",
          command: "string",
          workingDirectory: "workspace-relative-path",
          frameworkRef: "uri",
          shardId: "string|null",
          sourceTestFileRefs: "workspace-uri[]",
          requirementIds: "ref[]",
          status: "prepared|blocked|pending",
          evidenceRefs: "uri[]"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze(["sdlc_test_execution_preparation_row"]),
          status: Object.freeze(["prepared", "blocked", "pending"])
        }),
        example: Object.freeze({
          kind: "sdlc_test_execution_preparation_row",
          scheduleRef: "test-schedule://<tenant>/<runner>",
          moduleName: "<module>",
          testClassId: "test-class://<tenant>/<class>",
          testcaseIds: ["test-case://<tenant>/<case>"],
          command: "<declared test command>",
          workingDirectory: "build_tenants/<tenant>",
          frameworkRef: "framework://node-test",
          shardId: "<shard-id>",
          sourceTestFileRefs: ["workspace://build_tenants/<tenant>/test/<file>"],
          requirementIds: ["REQ-..."],
          status: "prepared",
          evidenceRefs: ["workspace://build_tenants/<tenant>/test/<file>"]
        })
      })
    ])
  });
}

function workspaceSpecSurfaceConstructionTemplate(
  row: SdlcTargetCarrierContractRow
): SdlcWorkerTargetCarrierConstructionTemplate {
  const payloadKindByTarget: Readonly<Record<string, string>> = Object.freeze({
    intent_surface: "sdlc_intent_surface_register",
    product_surface: "sdlc_product_surface_register",
    goal_surface: "sdlc_goal_surface_register",
    requirement_surface: "sdlc_requirement_surface_register",
    uat_testcases_surface: "sdlc_uat_testcase_register",
    testcase_authority_surface: "sdlc_testcase_authority_register"
  });
  const rowKindByTarget: Readonly<Record<string, string>> = Object.freeze({
    intent_surface: "sdlc_intent_row",
    product_surface: "sdlc_product_definition_row",
    goal_surface: "sdlc_goal_row",
    requirement_surface: "sdlc_requirement_row",
    uat_testcases_surface: "sdlc_test_case_row",
    testcase_authority_surface: "sdlc_testcase_authority_row"
  });
  const payloadKind =
    payloadKindByTarget[row.targetAssetType] ?? "sdlc_workspace_spec_surface_register";
  const rowKind =
    rowKindByTarget[row.targetAssetType] ?? "sdlc_workspace_spec_surface_row";
  return Object.freeze({
    kind: "sdlc_worker_target_carrier_construction_template" as const,
    templateRef: row.constructionTemplateRef,
    targetAssetType: row.targetAssetType,
    carrierKind: row.outputCarrierKind,
    nestedPayloadPath: row.nestedPayloadPath,
    carrierEnvelope: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/carrier-envelope`,
      requiredFields: row.requiredFieldRefs,
      fieldTypes: Object.freeze({
        kind: "literal",
        targetAssetType: "literal",
        edgeRef: "literal",
        contractRef: "literal",
        contractDigest: "sha256",
        payload: payloadKind
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze([row.outputCarrierKind]),
        targetAssetType: Object.freeze([row.targetAssetType]),
        edgeRef: Object.freeze([row.edgeRef]),
        contractRef: Object.freeze([row.targetCarrierContractRef])
      }),
      example: Object.freeze({
        kind: row.outputCarrierKind,
        targetAssetType: row.targetAssetType,
        edgeRef: row.edgeRef,
        contractRef: row.targetCarrierContractRef,
        contractDigest: row.targetCarrierContractDigest,
        payload: {
          kind: payloadKind,
          registerVersion: "ts-workspace-spec-surface-v1",
          targetAssetType: row.targetAssetType,
          authorityRefs: ["workspace://specification/..."],
          rows: []
        }
      })
    }),
    payloadTemplate: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/payload`,
      requiredFields: Object.freeze([
        "kind",
        "registerVersion",
        "targetAssetType",
        "authorityRefs",
        "rows"
      ]),
      fieldTypes: Object.freeze({
        kind: `literal:${payloadKind}`,
        registerVersion: "literal:ts-workspace-spec-surface-v1",
        targetAssetType: "literal",
        authorityRefs: "uri[]",
        rows: `${rowKind}[]`,
        summary: "string"
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze([payloadKind]),
        registerVersion: Object.freeze(["ts-workspace-spec-surface-v1"]),
        targetAssetType: Object.freeze([row.targetAssetType])
      }),
      example: Object.freeze({
        kind: payloadKind,
        registerVersion: "ts-workspace-spec-surface-v1",
        targetAssetType: row.targetAssetType,
        authorityRefs: ["workspace://specification/..."],
        rows: [],
        summary: "<content summary>"
      })
    }),
    rowTemplates: Object.freeze([
      targetCarrierObjectTemplate({
        templateRef: `${row.constructionTemplateRef}/row/${rowKind}`,
        requiredFields: Object.freeze([
          "kind",
          "rowRef",
          "title",
          "sourceRefs",
          "content"
        ]),
        fieldTypes: Object.freeze({
          kind: `literal:${rowKind}`,
          rowRef: "uri",
          title: "string",
          sourceRefs: "uri[]",
          content: "string",
          requirementRefs: "ref[]",
          expectedBehavior: "string",
          verificationPolicyRef: "uri"
        }),
        enumDomains: Object.freeze({
          kind: Object.freeze([rowKind])
        }),
        example: Object.freeze({
          kind: rowKind,
          rowRef: `workspace-spec-row://${row.targetAssetType}/<id>`,
          title: "<row title>",
          sourceRefs: ["workspace://specification/..."],
          content: "<row content>",
          requirementRefs: ["REQ-..."]
        })
      })
    ])
  });
}

function targetCarrierConstructionTemplateForRow(
  row: SdlcTargetCarrierContractRow
): SdlcWorkerTargetCarrierConstructionTemplate {
  if (row.targetAssetType === "implementation_design_surface") {
    return implementationDesignConstructionTemplate(row);
  }
  if (row.targetAssetType === "test_design_surface") {
    return testDesignConstructionTemplate(row);
  }
  if (row.targetAssetType === "test_execution_surface") {
    return testExecutionSurfaceConstructionTemplate(row);
  }
  if (workspaceLocalSdlcSurfaceRelativePath(row.targetAssetType) !== null) {
    return workspaceSpecSurfaceConstructionTemplate(row);
  }
  return Object.freeze({
    kind: "sdlc_worker_target_carrier_construction_template" as const,
    templateRef: row.constructionTemplateRef,
    targetAssetType: row.targetAssetType,
    carrierKind: row.outputCarrierKind,
    nestedPayloadPath: row.nestedPayloadPath,
    carrierEnvelope: targetCarrierObjectTemplate({
      templateRef: `${row.constructionTemplateRef}/carrier-envelope`,
      requiredFields: row.requiredFieldRefs,
      fieldTypes: Object.freeze({
        kind: "literal",
        targetAssetType: "literal",
        edgeRef: "literal",
        contractRef: "literal",
        contractDigest: "sha256",
        payload: "object"
      }),
      enumDomains: Object.freeze({
        kind: Object.freeze([row.outputCarrierKind]),
        targetAssetType: Object.freeze([row.targetAssetType]),
        edgeRef: Object.freeze([row.edgeRef]),
        contractRef: Object.freeze([row.targetCarrierContractRef])
      }),
      example: Object.freeze({
        kind: row.outputCarrierKind,
        targetAssetType: row.targetAssetType,
        edgeRef: row.edgeRef,
        contractRef: row.targetCarrierContractRef,
        contractDigest: row.targetCarrierContractDigest,
        payload: {}
      })
    }),
    payloadTemplate: null,
    rowTemplates: Object.freeze([])
  });
}

function targetCarrierProjectionForRow(
  row: SdlcTargetCarrierContractRow
): SdlcWorkerTargetCarrierProjection {
  return Object.freeze({
    kind: "sdlc_worker_target_carrier_projection" as const,
    targetCarrierContractRef: row.targetCarrierContractRef,
    targetCarrierContractDigest: row.targetCarrierContractDigest,
    targetCarrierTemplateRef: row.targetCarrierTemplateRef,
    constructionDepthRole: row.constructionDepthRole,
    producedStagedAuthorityRefs: row.producedStagedAuthorityRefs,
    requiredStagedAuthorityRefs: row.requiredStagedAuthorityRefs,
    outputCarrierKind: row.outputCarrierKind,
    nestedPayloadPath: row.nestedPayloadPath,
    requiredFieldRefs: row.requiredFieldRefs,
    fixedProtocolFieldRefs: row.fixedProtocolFieldRefs,
    workerFillableFieldRefs: row.workerFillableFieldRefs,
    literalDomainRefs: row.literalDomainRefs,
    schemaRef: row.schemaRef,
    handoffProjectionRef: row.handoffProjectionRef,
    constructionTemplateRef: row.constructionTemplateRef,
    constructionTemplate: targetCarrierConstructionTemplateForRow(row),
    closurePreconditionRef: row.closurePreconditionRef,
    testCaseGenerationRef: row.testCaseGenerationRef
  });
}

function targetCarrierPromptProjectionFor(
  projection: SdlcWorkerTargetCarrierProjection
): SdlcWorkerTargetCarrierPromptProjection {
  return Object.freeze({
    kind: "sdlc_worker_target_carrier_prompt_projection" as const,
    targetCarrierContractRef: projection.targetCarrierContractRef,
    targetCarrierContractDigest: projection.targetCarrierContractDigest,
    targetCarrierTemplateRef: projection.targetCarrierTemplateRef,
    constructionDepthRole: projection.constructionDepthRole,
    producedStagedAuthorityRefs: projection.producedStagedAuthorityRefs,
    requiredStagedAuthorityRefs: projection.requiredStagedAuthorityRefs,
    outputCarrierKind: projection.outputCarrierKind,
    nestedPayloadPath: projection.nestedPayloadPath,
    requiredFieldRefs: projection.requiredFieldRefs,
    fixedProtocolFieldRefs: projection.fixedProtocolFieldRefs,
    workerFillableFieldRefs: projection.workerFillableFieldRefs,
    literalDomainRefs: projection.literalDomainRefs,
    schemaRef: projection.schemaRef,
    handoffProjectionRef: projection.handoffProjectionRef,
    constructionTemplateRef: projection.constructionTemplateRef,
    closurePreconditionRef: projection.closurePreconditionRef,
    testCaseGenerationRef: projection.testCaseGenerationRef
  });
}

function executionCommandMatchesContract(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly command: string;
}): boolean {
  const observedCommand = normalizeExecutionCommand(input.command);
  const declaredCommand =
    normalizeExecutionCommand(
      input.manifest.productMaterialization.testExecutionContract
    );
  if (
    executionCommandMatchesDeclaredRunner({
      declaredCommand,
      observedCommand
    })
  ) {
    return true;
  }
  const shards = installedOperatorExecutionShards(input.manifest);
  return (
    shards.length === 1 &&
    executionCommandMatchesDeclaredRunner({
      declaredCommand: normalizeExecutionCommand(shards[0]?.command ?? ""),
      observedCommand
    })
  );
}

function normalizeExecutionCommand(command: string): string {
  return command.trim().replace(/\s+/gu, " ");
}

function executionCommandMatchesDeclaredRunner(input: {
  readonly declaredCommand: string;
  readonly observedCommand: string;
}): boolean {
  const declaredCommand = input.declaredCommand.trim();
  const observedCommand = input.observedCommand.trim();
  if (observedCommand === declaredCommand) {
    return true;
  }
  if (declaredCommand === "undeclared" || declaredCommand.length === 0) {
    return false;
  }
  return shellCommandSegments(observedCommand).some((segment) =>
    shellCommandSegmentMatchesDeclaredRunner({
      declaredCommand,
      segment
    })
  );
}

function shellCommandSegments(command: string): readonly string[] {
  return Object.freeze(
    command
      .split(/\s*(?:&&|\|\||;|\s&\s)\s*/u)
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0)
  );
}

function shellCommandSegmentMatchesDeclaredRunner(input: {
  readonly declaredCommand: string;
  readonly segment: string;
}): boolean {
  const segment = stripLeadingEnvironmentAssignments(input.segment);
  if (segment === input.declaredCommand) {
    return true;
  }
  return (
    /^\S+$/u.test(input.declaredCommand) &&
    segment.startsWith(`${input.declaredCommand} `)
  );
}

function stripLeadingEnvironmentAssignments(command: string): string {
  const parts = command.trim().split(/\s+/u);
  let index = parts[0] === "env" ? 1 : 0;
  while (
    index < parts.length &&
    /^[A-Za-z_][A-Za-z0-9_]*=.+/u.test(parts[index] ?? "")
  ) {
    index += 1;
  }
  return parts.slice(index).join(" ");
}

function productMaterializationContract(input: {
  readonly workspaceRoot: string;
  readonly archiveRoot: string;
  readonly edgeName: string;
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
      edgeName: input.edgeName,
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

type DeclaredProductTargetSeed = Pick<
  SdlcProductMaterializationAuthorityTarget,
  "path" | "targetKind"
> & {
  readonly requiredRole: SdlcMaterializedProductFileRole | null;
  readonly policyRef: string | null;
};

type TenantStackTargetSeed = DeclaredProductTargetSeed & {
  readonly sourceRef: string;
  readonly stackSection: "implementation" | "testing";
};

function materializedProductFileRoleFromText(
  input: string
): SdlcMaterializedProductFileRole | null {
  const normalized = input.trim().toLowerCase().replace(/[-\s]+/gu, "_");
  switch (normalized) {
    case "source":
      return "source";
    case "test":
      return "test";
    case "build_config":
    case "build_plugin":
    case "manifest":
    case "package_manifest":
      return "build_config";
    case "design":
    case "documentation":
    case "other":
      return normalized;
    default:
      return null;
  }
}

function explicitRoleFromTargetText(input: string): {
  readonly value: string;
  readonly requiredRole: SdlcMaterializedProductFileRole | null;
} {
  const roleMatch =
    /\brole\s*[:=]\s*`?(source|test|build[-_\s]config|build[-_\s]plugin|design|documentation|other)\b`?/iu.exec(
      input
    );
  const requiredRole =
    roleMatch?.[1] === undefined
      ? null
      : materializedProductFileRoleFromText(roleMatch[1]);
  const value = input
    .replace(
      /\s*(?:[|;,]\s*)?\(?\s*\brole\s*[:=]\s*`?(?:source|test|build[-_\s]config|build[-_\s]plugin|design|documentation|other)\b`?\s*\)?/iu,
      ""
    )
    .trim();
  return Object.freeze({ value, requiredRole });
}

function declaredProductTargetLooksLikeDirectory(input: string): boolean {
  const normalized = input.replace(/\\/gu, "/").replace(/\/+$/u, "");
  const lower = normalized.toLowerCase();
  const basename = path.posix.basename(lower);
  if (input.endsWith("/")) {
    return true;
  }
  if (lower === "src" || lower.endsWith("/src")) {
    return true;
  }
  if (lower === "project" || lower.endsWith("/project")) {
    return true;
  }
  if (
    (lower.startsWith("src/") || lower.includes("/src/")) &&
    path.posix.extname(basename).length === 0
  ) {
    return true;
  }
  return false;
}

function normalizeDeclaredProductFileTarget(input: {
  readonly value: string;
  readonly selectedOutputRoot: string;
}): DeclaredProductTargetSeed | null {
  const parsedRole = explicitRoleFromTargetText(input.value);
  const withoutComment = parsedRole.value.replace(/\s+#.*$/u, "");
  const trimmed = withoutComment
    .trim()
    .replace(/^[-*]\s+/u, "")
    .replace(/^["'`]+|["'`]+$/gu, "")
    .replace(/\\/gu, "/")
    .replace(/^workspace:\/\//u, "")
    .replace(/^\.\//u, "");
  const targetKind = declaredProductTargetLooksLikeDirectory(trimmed)
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
      targetKind,
      requiredRole: parsedRole.requiredRole,
      policyRef:
        parsedRole.requiredRole === null
          ? null
          : `target-role-policy://odd-sdlc/explicit/${parsedRole.requiredRole}`
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
}): readonly DeclaredProductTargetSeed[] {
  const targets = new Map<string, DeclaredProductTargetSeed>();
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
    let addedCodeSpan = false;
    for (const match of line.matchAll(/`([^`]+)`/gu)) {
      const codeSpan = match[1];
      if (codeSpan !== undefined) {
        addTarget(codeSpan);
        addedCodeSpan = true;
      }
    }
    if (!fenced) {
      const bullet = /^\s*[-*]\s+(.+)$/u.exec(line);
      if (bullet !== null && !addedCodeSpan) {
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

function targetsFromProductAuthorityFields(input: {
  readonly markdown: string;
  readonly selectedOutputRoot: string;
}): readonly DeclaredProductTargetSeed[] {
  const targets = new Map<string, DeclaredProductTargetSeed>();
  const addTarget = (candidate: string): void => {
    let addedCodeSpan = false;
    for (const match of candidate.matchAll(/`([^`]+)`/gu)) {
      const codeSpan = match[1];
      if (codeSpan === undefined) {
        continue;
      }
      const normalized = normalizeDeclaredProductFileTarget({
        value: codeSpan,
        selectedOutputRoot: input.selectedOutputRoot
      });
      if (
        normalized !== null &&
        normalized.path !== input.selectedOutputRoot
      ) {
        targets.set(normalized.path, normalized);
        addedCodeSpan = true;
      }
    }
    if (addedCodeSpan) {
      return;
    }
    const normalized = normalizeDeclaredProductFileTarget({
      value: candidate,
      selectedOutputRoot: input.selectedOutputRoot
    });
    if (
      normalized !== null &&
      normalized.path !== input.selectedOutputRoot
    ) {
      targets.set(normalized.path, normalized);
    }
  };
  const fieldPattern =
    /^(?:(?:declared|expected)\s+)?(?:(?:product|source|test)\s+)?files?$/iu;
  for (const line of input.markdown.split(/\r?\n/u)) {
    const cells = markdownTableCells(line);
    if (cells !== null && cells.length >= 2) {
      const field = cells[0]?.replace(/[*_`]/gu, "").trim() ?? "";
      if (fieldPattern.test(field)) {
        addTarget(cells.slice(1).join(" "));
      }
      continue;
    }
    const fieldMatch =
      /^\s*(?:[-*]\s*)?(?:\*\*)?((?:(?:declared|expected)\s+)?(?:(?:product|source|test)\s+)?files?)(?:\*\*)?\s*:\s*(.+?)\s*$/iu.exec(
        line
      );
    if (fieldMatch === null) {
      continue;
    }
    addTarget(fieldMatch[2] ?? "");
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
}): readonly DeclaredProductTargetSeed[] {
  const targets = new Map<string, DeclaredProductTargetSeed>();
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
    titlePattern: /^(?:(?:(?:declared|expected)\s+)?product\s+files|(?:declared|expected)\s+files)$/iu
  });
  const declaredModuleSections = markdownSectionBodies({
    markdown: product,
    titlePattern: /^(?:declared\s+module\s+targets|module\s+structure)$/iu
  });
  const sourceRef = pathToFileURL(productPath).href;
  const targets = targetContractsFromSeeds({
    source: "product_authority",
    sourceRef,
    manifest,
    seeds: [
      ...targetsFromProductAuthorityFields({
        markdown: product,
        selectedOutputRoot: manifest.productMaterialization.selectedOutputRoot
      }),
      ...sections.flatMap((body) =>
        targetsFromProductAuthoritySection({
          body,
          selectedOutputRoot: manifest.productMaterialization.selectedOutputRoot
        })
      ),
      ...declaredModuleSections.flatMap((body) =>
        targetsFromDeclaredModuleTargets({
          body,
          selectedOutputRoot: manifest.productMaterialization.selectedOutputRoot
        })
      )
    ]
  });
  return Object.freeze({
    targets,
    sourceRefs: Object.freeze([sourceRef])
  });
}

function requirementAuthorityFiles(root: string): readonly string[] {
  if (!existsSync(root)) {
    return Object.freeze([]);
  }
  const files: string[] = [];
  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".md")) {
        continue;
      }
      const relativePath = relative(root, absolutePath).split(path.sep).join("/");
      if (
        relativePath === "README.md" ||
        relativePath === "00-imported-sources.md"
      ) {
        continue;
      }
      files.push(absolutePath);
    }
  };
  visit(root);
  return Object.freeze(files.sort());
}

function requirementAuthorityTargetsFor(
  manifest: SdlcWorkerHandoffManifest
): {
  readonly targets: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly sourceRefs: readonly string[];
} {
  const requirementRoot = join(manifest.workspaceRoot, "specification/requirements");
  const targets = new Map<string, SdlcProductMaterializationAuthorityTarget>();
  const sourceRefs = new Set<string>();
  for (const requirementPath of requirementAuthorityFiles(requirementRoot)) {
    const markdown = readFileSync(requirementPath, "utf8");
    const sections = markdownSectionBodies({
      markdown,
      titlePattern: /\b(?:declared\s+|expected\s+)?product\s+files?\b/iu
    });
    if (sections.length === 0) {
      continue;
    }
    const sourceRef = pathToFileURL(requirementPath).href;
    const contracts = targetContractsFromSeeds({
      source: "requirement_authority",
      sourceRef,
      manifest,
      seeds: sections.flatMap((body) =>
        targetsFromProductAuthoritySection({
          body,
          selectedOutputRoot:
            manifest.productMaterialization.selectedOutputRoot
        })
      )
    });
    if (contracts.length === 0) {
      continue;
    }
    sourceRefs.add(sourceRef);
    for (const contract of contracts) {
      targets.set(contract.path, contract);
    }
  }
  return Object.freeze({
    targets: Object.freeze(
      [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
    ),
    sourceRefs: Object.freeze([...sourceRefs].sort())
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
            path: normalized.path,
            targetKind: normalized.targetKind,
            ...materializationRolePolicyForTarget({
              manifest,
              seed: normalized
            }),
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

function materializationRolePolicyForTarget(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly seed: DeclaredProductTargetSeed;
}): Pick<SdlcProductMaterializationAuthorityTarget, "requiredRole" | "policyRef"> {
  if (input.seed.requiredRole !== null && input.seed.policyRef !== null) {
    return Object.freeze({
      requiredRole: input.seed.requiredRole,
      policyRef: input.seed.policyRef
    });
  }
  const relativeTarget = targetRelativeToSelectedOutputRoot({
    targetPath: input.seed.path,
    selectedOutputRoot: input.manifest.productMaterialization.selectedOutputRoot
  }).toLowerCase();
  if (
    tenantStackBuildConfigTargetCoversRelativePath({
      manifest: input.manifest,
      relativePath: relativeTarget
    })
  ) {
    return Object.freeze({
      requiredRole: "build_config" as const,
      policyRef: "target-role-policy://odd-sdlc/tenant-stack/build-config"
    });
  }
  if (
    relativeTarget === "src" ||
    relativeTarget.startsWith("src/") ||
    relativeTarget.endsWith("/src") ||
    relativeTarget.includes("/src/")
  ) {
    return Object.freeze({
      requiredRole: "source" as const,
      policyRef: "target-role-policy://odd-sdlc/product-source-tree"
    });
  }
  if (
    relativeTarget === "test" ||
    relativeTarget === "tests" ||
    relativeTarget.startsWith("test/") ||
    relativeTarget.startsWith("tests/") ||
    relativeTarget.includes("/test/") ||
    relativeTarget.includes("/tests/") ||
    relativeTarget.endsWith("/test") ||
    relativeTarget.endsWith("/tests")
  ) {
    return Object.freeze({
      requiredRole: "test" as const,
      policyRef: "target-role-policy://odd-sdlc/product-test-tree"
    });
  }
  if (
    relativeTarget === "design" ||
    relativeTarget.startsWith("design/") ||
    relativeTarget.endsWith("/design")
  ) {
    return Object.freeze({
      requiredRole: "design" as const,
      policyRef: "target-role-policy://odd-sdlc/product-design-surface"
    });
  }
  if (/\.(?:md|markdown)$/u.test(relativeTarget)) {
    return Object.freeze({
      requiredRole: "documentation" as const,
      policyRef: "target-role-policy://odd-sdlc/product-documentation"
    });
  }
  return Object.freeze({
    requiredRole: "other" as const,
    policyRef: "target-role-policy://odd-sdlc/declared-other"
  });
}

function targetContractsFromSeeds(input: {
  readonly source: SdlcProductMaterializationAuthorityTarget["source"];
  readonly sourceRef: string;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly seeds: readonly DeclaredProductTargetSeed[];
}): readonly SdlcProductMaterializationAuthorityTarget[] {
  const targets = new Map<string, SdlcProductMaterializationAuthorityTarget>();
  for (const seed of input.seeds) {
    const rolePolicy = materializationRolePolicyForTarget({
      manifest: input.manifest,
      seed
    });
    targets.set(
      seed.path,
      Object.freeze({
        kind: "sdlc_product_materialization_authority_target" as const,
        path: seed.path,
        targetKind: seed.targetKind,
        requiredRole: rolePolicy.requiredRole,
        policyRef: rolePolicy.policyRef,
        source: input.source,
        sourceRef: input.sourceRef
      })
    );
  }
  return Object.freeze(
    [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
  );
}

interface TenantStackAuthority {
  readonly buildConfigSeeds: readonly TenantStackTargetSeed[];
  readonly sourceRefs: readonly string[];
  readonly reasonRefs: readonly string[];
  readonly carrier: SdlcTenantTechnologyStackAuthority;
}

interface TenantStackSeedReadResult {
  readonly seeds: readonly TenantStackTargetSeed[];
  readonly reasonRefs: readonly string[];
  readonly declaresStackSemantics: boolean;
}

function tenantStackSpecRoot(manifest: SdlcWorkerHandoffManifest): string {
  return join(
    manifest.workspaceRoot,
    manifest.productMaterialization.selectedOutputRoot,
    "spec"
  );
}

function tenantStackAuthorityCanonicalSpecFile(
  manifest: SdlcWorkerHandoffManifest
): string {
  return join(tenantStackSpecRoot(manifest), "TECH_STACK.json");
}

function materializationAuthorityNeedsTenantStackRepair(
  authority: Pick<SdlcProductMaterializationAuthorityReconciliation, "reasonRefs">
): boolean {
  return (
    authority.reasonRefs.includes("tenant_stack_authority_missing") ||
    authority.reasonRefs.includes("tenant_stack_authority_invalid")
  );
}

function tenantStackSpecFiles(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const specRoot = tenantStackSpecRoot(manifest);
  if (!existsSync(specRoot)) {
    return Object.freeze([]);
  }
  return Object.freeze(
    readdirSync(specRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => join(specRoot, entry.name))
      .filter((filePath) =>
        /(?:^|\/)(?:TECH_STACK|tech_stack|TESTING_TECH_STACK|testing_tech_stack|PRODUCT_TARGETS|product_targets|EXECUTION_CONTRACT|execution_contract)\.(?:json|md|markdown)$/u.test(
          filePath.split(path.sep).join("/")
        )
      )
      .sort()
  );
}

function stringListFromUnknown(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return Object.freeze(
      value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
    );
  }
  if (typeof value !== "string") {
    return Object.freeze([]);
  }
  return Object.freeze(
    value
      .split(/[,\n]/u)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)
  );
}

function objectFieldsStringList(
  record: Record<string, unknown>,
  keys: readonly string[]
): readonly string[] {
  return Object.freeze(keys.flatMap((key) => stringListFromUnknown(record[key])));
}

function unknownDeclaresTenantStackSemantics(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some((entry) => unknownDeclaresTenantStackSemantics(entry));
  }
  const record = objectRecord(value);
  if (record === null) {
    return false;
  }
  return Object.entries(record).some(([key, entry]) =>
    key === "kind" ? false : unknownDeclaresTenantStackSemantics(entry)
  );
}

function markdownDeclaresTenantStackSemantics(markdown: string): boolean {
  return markdown.split(/\r?\n/u).some((line) => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("```") &&
      /[A-Za-z0-9]/u.test(trimmed)
    );
  });
}

function tenantStackTargetSeed(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly sourceRef: string;
  readonly stackSection: TenantStackTargetSeed["stackSection"];
  readonly value: string;
  readonly role: SdlcMaterializedProductFileRole;
}): TenantStackTargetSeed | null {
  const selectedOutputRoot = normalizedSelectedOutputRoot(
    input.manifest.productMaterialization.selectedOutputRoot
  );
  const rawValue = input.value.replace(/\\/gu, "/").trim();
  const tenantRelativeValue = rawValue
    .replace(/\\/gu, "/")
    .replace(/^workspace:\/\//u, "")
    .replace(/^\.\//u, "")
    .trim();
  if (
    tenantRelativeValue.length === 0 ||
    tenantRelativeValue.startsWith("/") ||
    /^[A-Za-z][A-Za-z0-9+.-]*:\/\//u.test(tenantRelativeValue)
  ) {
    return null;
  }
  const candidate = tenantRelativeValue.startsWith(`${selectedOutputRoot}/`)
    ? tenantRelativeValue
    : `${selectedOutputRoot}/${tenantRelativeValue}`;
  const normalized = normalizeDeclaredProductFileTarget({
    value: candidate,
    selectedOutputRoot
  });
  if (normalized === null || normalized.path === selectedOutputRoot) {
    return null;
  }
  return Object.freeze({
    ...normalized,
    requiredRole: input.role,
    policyRef: `target-role-policy://odd-sdlc/tenant-stack/${input.stackSection}/${input.role}`,
    sourceRef: input.sourceRef,
    stackSection: input.stackSection
  });
}

function tenantStackBuildConfigSeedsFromJson(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly sourceRef: string;
  readonly parsed: unknown;
}): TenantStackSeedReadResult {
  const record = objectRecord(input.parsed);
  if (record === null) {
    return Object.freeze({
      seeds: Object.freeze([]),
      reasonRefs: Object.freeze(["tenant_stack_spec_not_object"]),
      declaresStackSemantics: false
    });
  }
  const implementationBuildConfigKeys = [
    "buildConfigTargets",
    "build_config_targets",
    "requiredBuildConfigTargets",
    "required_build_config_targets",
    "buildConfigFiles",
    "build_config_files"
  ];
  const testingBuildConfigKeys = [
    "testBuildConfigTargets",
    "test_build_config_targets",
    "testingBuildConfigTargets",
    "testing_build_config_targets",
    "testBuildConfigFiles",
    "test_build_config_files",
    "testingBuildConfigFiles",
    "testing_build_config_files"
  ];
  const nestedTestingStackKeys = [
    "testingTechStack",
    "testing_tech_stack",
    "testTechStack",
    "test_tech_stack",
    "testStack",
    "test_stack"
  ];
  const values = [
    ...objectFieldsStringList(record, implementationBuildConfigKeys).map((value) =>
      Object.freeze({ value, stackSection: "implementation" as const })
    ),
    ...objectFieldsStringList(record, testingBuildConfigKeys).map((value) =>
      Object.freeze({ value, stackSection: "testing" as const })
    ),
    ...nestedTestingStackKeys.flatMap((key) => {
      const nested = objectRecord(record[key]);
      return nested === null
        ? Object.freeze<readonly {
            readonly value: string;
            readonly stackSection: TenantStackTargetSeed["stackSection"];
          }[]>([])
        : objectFieldsStringList(nested, [
            ...implementationBuildConfigKeys,
            ...testingBuildConfigKeys
          ]).map((value) =>
            Object.freeze({ value, stackSection: "testing" as const })
          );
    })
  ];
  return tenantStackBuildConfigSeedsFromValues({
    manifest: input.manifest,
    sourceRef: input.sourceRef,
    values,
    declaresStackSemantics: unknownDeclaresTenantStackSemantics(record)
  });
}

function tenantStackBuildConfigSeedsFromMarkdown(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly sourceRef: string;
  readonly markdown: string;
}): TenantStackSeedReadResult {
  const sections = markdownSectionBodies({
    markdown: input.markdown,
    titlePattern:
      /^(?:required\s+)?(?:(?:test(?:ing)?[-\s_]+)?build[-\s_]?config|build\s+configuration|manifest)\s+(?:targets?|files?)$/iu
  });
  const values: string[] = [];
  for (const section of sections) {
    let fenced = false;
    for (const line of section.split(/\r?\n/u)) {
      if (/^\s*```/u.test(line)) {
        fenced = !fenced;
        continue;
      }
      let addedCodeSpan = false;
      for (const match of line.matchAll(/`([^`]+)`/gu)) {
        const codeSpan = match[1];
        if (codeSpan !== undefined) {
          values.push(codeSpan);
          addedCodeSpan = true;
        }
      }
      if (addedCodeSpan) {
        continue;
      }
      if (fenced) {
        values.push(line);
        continue;
      }
      const bullet = /^\s*[-*]\s+(.+)$/u.exec(line);
      if (bullet?.[1] !== undefined) {
        values.push(bullet[1]);
      }
    }
  }
  return tenantStackBuildConfigSeedsFromValues({
    manifest: input.manifest,
    sourceRef: input.sourceRef,
    values: values.map((value) =>
      Object.freeze({
        value,
        stackSection: input.sourceRef.includes("TESTING_TECH_STACK")
          ? "testing" as const
          : "implementation" as const
      })
    ),
    declaresStackSemantics: markdownDeclaresTenantStackSemantics(input.markdown)
  });
}

function tenantStackBuildConfigSeedsFromValues(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly sourceRef: string;
  readonly values: readonly {
    readonly value: string;
    readonly stackSection: TenantStackTargetSeed["stackSection"];
  }[];
  readonly declaresStackSemantics: boolean;
}): TenantStackSeedReadResult {
  const seeds = new Map<string, TenantStackTargetSeed>();
  const reasonRefs = new Set<string>();
  for (const entry of input.values) {
    const seed = tenantStackTargetSeed({
      manifest: input.manifest,
      sourceRef: input.sourceRef,
      stackSection: entry.stackSection,
      value: entry.value,
      role: "build_config"
    });
    if (seed === null) {
      reasonRefs.add(
        `tenant_stack_invalid_target:${input.sourceRef}:${entry.value}`
      );
      continue;
    }
    const prior = seeds.get(seed.path);
    if (
      prior?.stackSection === "implementation" &&
      seed.stackSection === "testing"
    ) {
      continue;
    }
    seeds.set(seed.path, seed);
  }
  return Object.freeze({
    seeds: Object.freeze(
      [...seeds.values()].sort((left, right) => left.path.localeCompare(right.path))
    ),
    reasonRefs: Object.freeze([...reasonRefs].sort()),
    declaresStackSemantics: input.declaresStackSemantics
  });
}

function tenantStackAuthorityFor(
  manifest: SdlcWorkerHandoffManifest
): TenantStackAuthority {
  const buildConfigSeeds = new Map<string, TenantStackTargetSeed>();
  const sourceRefs = new Set<string>();
  const reasonRefs = new Set<string>();
  let declaresStackSemantics = false;
  for (const filePath of tenantStackSpecFiles(manifest)) {
    const sourceRef = pathToFileURL(filePath).href;
    sourceRefs.add(sourceRef);
    const content = readFileSync(filePath, "utf8");
    const normalizedFile = filePath.toLowerCase();
    let result: TenantStackSeedReadResult = Object.freeze({
      seeds: Object.freeze([]),
      reasonRefs: Object.freeze([]),
      declaresStackSemantics: false
    });
    if (normalizedFile.endsWith(".json")) {
      try {
        result = tenantStackBuildConfigSeedsFromJson({
          manifest,
          sourceRef,
          parsed: JSON.parse(content)
        });
      } catch {
        reasonRefs.add(`tenant_stack_spec_parse_failed:${filePath}`);
      }
    } else {
      result = tenantStackBuildConfigSeedsFromMarkdown({
        manifest,
        sourceRef,
        markdown: content
      });
    }
    for (const reasonRef of result.reasonRefs) {
      reasonRefs.add(reasonRef);
    }
    declaresStackSemantics = declaresStackSemantics || result.declaresStackSemantics;
    for (const seed of result.seeds) {
      const prior = buildConfigSeeds.get(seed.path);
      if (
        prior?.stackSection === "implementation" &&
        seed.stackSection === "testing"
      ) {
        continue;
      }
      buildConfigSeeds.set(seed.path, seed);
    }
  }
  if (sourceRefs.size > 0 && !declaresStackSemantics) {
    reasonRefs.add("tenant_stack_authority_undefined");
  }
  const orderedBuildConfigSeeds = Object.freeze(
    [...buildConfigSeeds.values()].sort((left, right) =>
      left.path.localeCompare(right.path)
    )
  );
  const orderedSourceRefs = Object.freeze([...sourceRefs].sort());
  const orderedReasonRefs = Object.freeze([...reasonRefs].sort());
  return Object.freeze({
    buildConfigSeeds: orderedBuildConfigSeeds,
    sourceRefs: orderedSourceRefs,
    reasonRefs: orderedReasonRefs,
    carrier: constructSdlcTenantTechnologyStackAuthority({
      required: manifest.productMaterialization.required,
      buildConfigTargets: orderedBuildConfigSeeds.map((seed) =>
        Object.freeze({
          path: seed.path,
          stackSection: seed.stackSection,
          sourceRef: seed.sourceRef
        })
      ),
      sourceRefs: orderedSourceRefs,
      reasonRefs: orderedReasonRefs
    })
  });
}

function tenantStackAuthorityTargetsFor(
  manifest: SdlcWorkerHandoffManifest
): {
  readonly targets: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly sourceRefs: readonly string[];
  readonly reasonRefs: readonly string[];
} {
  const authority = tenantStackAuthorityFor(manifest);
  if (authority.buildConfigSeeds.length === 0) {
    return Object.freeze({
      targets: Object.freeze([]),
      sourceRefs: authority.sourceRefs,
      reasonRefs: authority.reasonRefs
    });
  }
  return Object.freeze({
    targets: tenantStackTargetContractsFromSeeds({ manifest, seeds: authority.buildConfigSeeds }),
    sourceRefs: authority.sourceRefs,
    reasonRefs: authority.reasonRefs
  });
}

function tenantStackTargetContractsFromSeeds(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly seeds: readonly TenantStackTargetSeed[];
}): readonly SdlcProductMaterializationAuthorityTarget[] {
  const targets = new Map<string, SdlcProductMaterializationAuthorityTarget>();
  for (const seed of input.seeds) {
    const prior = targets.get(seed.path);
    if (
      prior?.policyRef?.includes("/tenant-stack/implementation/") &&
      seed.stackSection === "testing"
    ) {
      continue;
    }
    const rolePolicy = materializationRolePolicyForTarget({
      manifest: input.manifest,
      seed
    });
    targets.set(
      seed.path,
      Object.freeze({
        kind: "sdlc_product_materialization_authority_target" as const,
        path: seed.path,
        targetKind: seed.targetKind,
        requiredRole: rolePolicy.requiredRole,
        policyRef: rolePolicy.policyRef,
        source: "tenant_stack_authority" as const,
        sourceRef: seed.sourceRef
      })
    );
  }
  return Object.freeze(
    [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
  );
}

function tenantStackBuildConfigTargetCoversRelativePath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
}): boolean {
  const relativePath = input.relativePath.replace(/\\/gu, "/").toLowerCase();
  return tenantStackAuthorityFor(input.manifest).buildConfigSeeds.some((seed) => {
    if (!tenantStackTargetAppliesToCurrentMaterialization({ manifest: input.manifest, target: seed })) {
      return false;
    }
    const targetRelative = targetRelativeToSelectedOutputRoot({
      targetPath: seed.path,
      selectedOutputRoot:
        input.manifest.productMaterialization.selectedOutputRoot
    }).toLowerCase();
    return (
      relativePath === targetRelative ||
      relativePath.startsWith(`${targetRelative}/`)
    );
  });
}

function tenantStackTargetAppliesToCurrentMaterialization(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly target: { readonly policyRef: string | null };
}): boolean {
  if (!input.target.policyRef?.includes("/tenant-stack/testing/")) {
    return true;
  }
  return (
    input.manifest.targetAssetType === "component_test_surface" ||
    productMaterializationRequiresTestExecutionEvidence(input.manifest)
  );
}

function testTargetSeedFromDesignRelativePath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
}): DeclaredProductTargetSeed | null {
  const normalizedRelativePath = input.relativePath
    .replace(/\\/gu, "/")
    .replace(/^workspace:\/\//u, "")
    .replace(/^\.\//u, "")
    .replace(/^\/+/u, "");
  const selectedOutputRoot = normalizedSelectedOutputRoot(
    input.manifest.productMaterialization.selectedOutputRoot
  );
  const candidate = normalizedRelativePath.startsWith(`${selectedOutputRoot}/`)
    ? normalizedRelativePath
    : `${selectedOutputRoot}/${normalizedRelativePath}`;
  const relativeToOutputRoot = targetRelativeToSelectedOutputRoot({
    targetPath: candidate,
    selectedOutputRoot
  });
  if (
    relativeToOutputRoot === ".ai-workspace" ||
    relativeToOutputRoot.startsWith(".ai-workspace/") ||
    relativeToOutputRoot.includes("/.ai-workspace/")
  ) {
    return null;
  }
  const normalized = normalizeDeclaredProductFileTarget({
    value: candidate,
    selectedOutputRoot
  });
  if (normalized === null) {
    return null;
  }
  return Object.freeze({
    ...normalized,
    requiredRole: "test" as const,
    policyRef: "target-role-policy://odd-sdlc/product-test-tree"
  });
}

function designTargetSeedFromFileTargetRow(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
  readonly role: string;
}): DeclaredProductTargetSeed | null {
  const normalizedRelativePath = input.relativePath
    .replace(/\\/gu, "/")
    .replace(/^workspace:\/\//u, "")
    .replace(/^\.\//u, "")
    .replace(/^\/+/u, "");
  const selectedOutputRoot = normalizedSelectedOutputRoot(
    input.manifest.productMaterialization.selectedOutputRoot
  );
  const candidate = normalizedRelativePath.startsWith(`${selectedOutputRoot}/`)
    ? normalizedRelativePath
    : `${selectedOutputRoot}/${normalizedRelativePath}`;
  const relativeToOutputRoot = targetRelativeToSelectedOutputRoot({
    targetPath: candidate,
    selectedOutputRoot
  });
  if (
    relativeToOutputRoot === ".ai-workspace" ||
    relativeToOutputRoot.startsWith(".ai-workspace/") ||
    relativeToOutputRoot.includes("/.ai-workspace/")
  ) {
    return null;
  }
  const normalized = normalizeDeclaredProductFileTarget({
    value: candidate,
    selectedOutputRoot
  });
  if (normalized === null) {
    return null;
  }
  const requiredRole = materializedProductFileRoleFromText(input.role);
  return Object.freeze({
    ...normalized,
    requiredRole,
    policyRef:
      requiredRole === null
        ? null
        : `target-role-policy://odd-sdlc/implementation-design/${requiredRole}`
  });
}

function designSourceTargetSeedFromComponentRelativePath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
}): DeclaredProductTargetSeed | null {
  const normalizedRelativePath = input.relativePath
    .replace(/\\/gu, "/")
    .replace(/^workspace:\/\//u, "")
    .replace(/^\.\//u, "")
    .replace(/^\/+/u, "");
  const selectedOutputRoot = normalizedSelectedOutputRoot(
    input.manifest.productMaterialization.selectedOutputRoot
  );
  const candidate = normalizedRelativePath.startsWith(`${selectedOutputRoot}/`)
    ? normalizedRelativePath
    : `${selectedOutputRoot}/${normalizedRelativePath}`;
  const relativeToOutputRoot = targetRelativeToSelectedOutputRoot({
    targetPath: candidate,
    selectedOutputRoot
  });
  const lowerRelative = relativeToOutputRoot.toLowerCase();
  if (
    lowerRelative.length === 0 ||
    lowerRelative === ".ai-workspace" ||
    lowerRelative.startsWith(".ai-workspace/") ||
    lowerRelative.includes("/.ai-workspace/") ||
    lowerRelative === "test" ||
    lowerRelative.startsWith("test/") ||
    lowerRelative.includes("/test/") ||
    lowerRelative.includes(".test.") ||
    lowerRelative.includes(".spec.")
  ) {
    return null;
  }
  const looksLikeSourceFile =
    lowerRelative.includes(".") ||
    lowerRelative.startsWith("src/") ||
    lowerRelative.startsWith("lib/") ||
    lowerRelative.startsWith("app/") ||
    lowerRelative.startsWith("code/");
  if (!looksLikeSourceFile) {
    return null;
  }
  return designTargetSeedFromFileTargetRow({
    manifest: input.manifest,
    relativePath: candidate,
    role: "source"
  });
}

function mergeTargetSeeds(
  primary: readonly DeclaredProductTargetSeed[],
  additions: readonly DeclaredProductTargetSeed[]
): readonly DeclaredProductTargetSeed[] {
  const seeds = new Map<string, DeclaredProductTargetSeed>();
  for (const seed of primary) {
    seeds.set(seed.path, seed);
  }
  for (const seed of additions) {
    if (!seeds.has(seed.path)) {
      seeds.set(seed.path, seed);
    }
  }
  return Object.freeze(
    [...seeds.values()].sort((left, right) => left.path.localeCompare(right.path))
  );
}

function componentCodeSurfaceConsumesDesignFileTargetRole(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly role: string;
}): boolean {
  const normalizedRole = materializedProductFileRoleFromText(input.role);
  if (normalizedRole === "source" || normalizedRole === "build_config") {
    return true;
  }
  return (
    input.manifest.graphFunctionName === FG_FRAMEWORK_SMOKE_MIN_FP_EXECUTIVE &&
    normalizedRole === "test"
  );
}

function designAssetAuthorityTargetsFor(
  manifest: SdlcWorkerHandoffManifest
): {
  readonly targets: readonly SdlcProductMaterializationAuthorityTarget[];
  readonly sourceRefs: readonly string[];
} {
  if (manifest.targetAssetType === "component_code_surface") {
    const register = readAdmittedImplementationDesign(manifest);
    if (register === null) {
      return Object.freeze({
        targets: Object.freeze([]),
        sourceRefs: Object.freeze([])
      });
    }
    const sourceFile = componentDepthSurfaceFile(
      manifest,
      "implementation_design_surface"
    );
    const sourceRef =
      sourceFile === null
        ? pathToFileURL(manifest.outputFile).href
        : pathToFileURL(sourceFile).href;
    const fileTargetSeeds = register.fileTargetRows
      .filter((row) =>
        componentCodeSurfaceConsumesDesignFileTargetRole({
          manifest,
          role: row.role
        })
      )
      .map((row) =>
        designTargetSeedFromFileTargetRow({
          manifest,
          relativePath: row.relativePath,
          role: row.role
        })
      )
      .filter((seed): seed is DeclaredProductTargetSeed => seed !== null);
    const componentSourceSeeds = register.componentRealizationRows
      .map((row) =>
        designSourceTargetSeedFromComponentRelativePath({
          manifest,
          relativePath: row.relativePath
        })
      )
      .filter((seed): seed is DeclaredProductTargetSeed => seed !== null);
    const seeds = mergeTargetSeeds(fileTargetSeeds, componentSourceSeeds);
    return Object.freeze({
      targets: targetContractsFromSeeds({
        source: "design_asset_authority",
        sourceRef,
        manifest,
        seeds
      }),
      sourceRefs: Object.freeze([sourceRef])
    });
  }
  if (manifest.targetAssetType !== "component_test_surface") {
    return Object.freeze({
      targets: Object.freeze([]),
      sourceRefs: Object.freeze([])
    });
  }
  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile
  });
  if (admission.status !== "admitted" || admission.register === null) {
    return Object.freeze({
      targets: Object.freeze([]),
      sourceRefs: Object.freeze([])
    });
  }
  const sourceRef = admission.evidenceRefs[0] ?? pathToFileURL(manifest.outputFile).href;
  const seeds = admission.register.componentTestRows
    .map((row) =>
      testTargetSeedFromDesignRelativePath({
        manifest,
        relativePath: row.relativePath
      })
    )
    .filter((seed): seed is DeclaredProductTargetSeed => seed !== null);
  return Object.freeze({
    targets: targetContractsFromSeeds({
      source: "design_asset_authority",
      sourceRef,
      manifest,
      seeds
    }),
    sourceRefs: Object.freeze([sourceRef])
  });
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
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly target: SdlcProductMaterializationAuthorityTarget;
}): boolean {
  const relativeTarget = targetRelativeToSelectedOutputRoot({
    targetPath: input.target.path,
    selectedOutputRoot: input.manifest.productMaterialization.selectedOutputRoot
  });
  return (
    relativeTarget === "" ||
    tenantStackBuildConfigTargetCoversRelativePath({
      manifest: input.manifest,
      relativePath: relativeTarget
    })
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
  const includedAllDeclaredModules =
    input.manifest.productMaterialization.declaredModuleNames.length > 0 &&
    input.manifest.productMaterialization.declaredModuleNames.every((moduleName) =>
      input.manifest.featureScope.includedModuleNames.includes(moduleName)
    );
  return Object.freeze(
    input.targets.filter(
      (target) =>
        (includedAllDeclaredModules &&
          targetRelativeToSelectedOutputRoot({
            targetPath: target.path,
            selectedOutputRoot:
              input.manifest.productMaterialization.selectedOutputRoot
          }) !== "") ||
        productAuthorityTargetIsSharedForFeatureScope({
          manifest: input.manifest,
          target
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

function targetsForCurrentMaterializationEdge(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly targets: readonly SdlcProductMaterializationAuthorityTarget[];
}): readonly SdlcProductMaterializationAuthorityTarget[] {
  return Object.freeze(
    input.targets.filter(
      (target) =>
        tenantStackTargetAppliesToCurrentMaterialization({
          manifest: input.manifest,
          target
        }) &&
        (input.manifest.targetAssetType !== "component_test_surface" ||
          target.requiredRole === "test" ||
          target.requiredRole === "build_config")
    )
  );
}

function mergeAuthorityTargets(
  primary: readonly SdlcProductMaterializationAuthorityTarget[],
  additions: readonly SdlcProductMaterializationAuthorityTarget[]
): readonly SdlcProductMaterializationAuthorityTarget[] {
  const targets = new Map<string, SdlcProductMaterializationAuthorityTarget>();
  for (const target of primary) {
    targets.set(target.path, target);
  }
  for (const target of additions) {
    if (!targets.has(target.path)) {
      targets.set(target.path, target);
    }
  }
  return Object.freeze(
    [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))
  );
}

export function reconcileSdlcProductMaterializationAuthority(
  manifest: SdlcWorkerHandoffManifest
): SdlcProductMaterializationAuthorityReconciliation {
  const context = contextExpectedFileTargetsFor(manifest);
  const design = designAssetAuthorityTargetsFor(manifest);
  const tenantStack = tenantStackAuthorityTargetsFor(manifest);
  const requirement = requirementAuthorityTargetsFor(manifest);
  const product = productAuthorityTargetsFor(manifest);
  const contextTargets = scopeProductMaterializationAuthorityTargets({
    manifest,
    targets: context.targets
  });
  const designTargets = scopeProductMaterializationAuthorityTargets({
    manifest,
    targets: design.targets
  });
  const tenantStackTargets = scopeProductMaterializationAuthorityTargets({
    manifest,
    targets: tenantStack.targets
  });
  const requirementTargets = scopeProductMaterializationAuthorityTargets({
    manifest,
    targets: requirement.targets
  });
  const productTargets = scopeProductMaterializationAuthorityTargets({
    manifest,
    targets: product.targets
  });
  const currentDesignTargets = targetsForCurrentMaterializationEdge({
    manifest,
    targets: designTargets
  });
  const currentTenantStackTargets = targetsForCurrentMaterializationEdge({
    manifest,
    targets: tenantStackTargets
  });
  const currentRequirementTargets = targetsForCurrentMaterializationEdge({
    manifest,
    targets: requirementTargets
  });
  const currentProductTargets = targetsForCurrentMaterializationEdge({
    manifest,
    targets: productTargets
  });
  const contextTargetPaths = uniqueSorted(contextTargets.map((target) => target.path));
  const designTargetPaths = uniqueSorted(designTargets.map((target) => target.path));
  const tenantStackTargetPaths = uniqueSorted(
    tenantStackTargets.map((target) => target.path)
  );
  const requirementTargetPaths = uniqueSorted(
    requirementTargets.map((target) => target.path)
  );
  const productTargetPaths = uniqueSorted(productTargets.map((target) => target.path));
  const baseDeclaredProductTargetContracts =
    currentRequirementTargets.length > 0
      ? currentRequirementTargets
      : currentDesignTargets.length > 0
        ? currentDesignTargets
        : currentProductTargets;
  const declaredProductTargetContracts = mergeAuthorityTargets(
    baseDeclaredProductTargetContracts,
    currentTenantStackTargets
  );
  const declaredProductFileTargets = uniqueSorted(
    declaredProductTargetContracts.map((target) => target.path)
  );
  const reasonRefs = new Set<string>(context.reasonRefs);
  const tenantStackStatus = decideSdlcTenantStackAuthorityStatus({
    required: manifest.productMaterialization.required,
    sourceRefs: tenantStack.sourceRefs,
    reasonRefs: tenantStack.reasonRefs
  });
  if (tenantStackStatus.status === "missing") {
    reasonRefs.add("tenant_stack_authority_missing");
  }
  if (tenantStackStatus.status === "invalid") {
    reasonRefs.add("tenant_stack_authority_invalid");
  }
  if (contextTargetPaths.length > 0) {
    reasonRefs.add("context_expected_files_observation_only");
  }
  if (
    contextTargets.length !== context.targets.length ||
    designTargets.length !== design.targets.length ||
    tenantStackTargets.length !== tenantStack.targets.length ||
    requirementTargets.length !== requirement.targets.length ||
    productTargets.length !== product.targets.length
  ) {
    reasonRefs.add(
      `product_targets_scoped_by_feature_scope:${manifest.featureScope.includedModuleNames.join(",")}`
    );
  }
  if (designTargetPaths.length > 0) {
    reasonRefs.add("design_asset_materialization_targets");
  }
  if (tenantStackTargetPaths.length > 0) {
    reasonRefs.add("tenant_stack_materialization_targets");
  }
  if (
    requirementTargetPaths.length > 0 &&
    designTargetPaths.length > 0 &&
    !sameTargetSet(requirementTargetPaths, designTargetPaths)
  ) {
    reasonRefs.add("requirement_design_target_mismatch");
  }
  if (
    requirementTargetPaths.length > 0 &&
    productTargetPaths.length > 0 &&
    !sameTargetSet(requirementTargetPaths, productTargetPaths)
  ) {
    reasonRefs.add("requirement_product_target_mismatch");
  }
  if (
    contextTargetPaths.length > 0 &&
    declaredProductFileTargets.length > 0 &&
    !sameTargetSet(contextTargetPaths, declaredProductFileTargets)
  ) {
    reasonRefs.add(
      requirementTargetPaths.length > 0
        ? "declared_context_target_mismatch"
        : "product_context_target_mismatch"
    );
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
      : tenantStackStatus.status === "missing" ||
          tenantStackStatus.status === "invalid"
        ? "ambiguous"
        : declaredProductFileTargets.length > 0
          ? "passed"
          : "missing",
    selectedOutputRoot: manifest.productMaterialization.selectedOutputRoot,
    contextExpectedFileTargets: contextTargetPaths,
    designAssetAuthorityTargets: designTargetPaths,
    tenantStackAuthorityTargets: tenantStackTargetPaths,
    requirementAuthorityTargets: requirementTargetPaths,
    productAuthorityTargets: productTargetPaths,
    declaredProductFileTargets,
    contextExpectedTargetContracts: contextTargets,
    designAssetAuthorityTargetContracts: designTargets,
    tenantStackAuthorityTargetContracts: tenantStackTargets,
    requirementAuthorityTargetContracts: requirementTargets,
    productAuthorityTargetContracts: productTargets,
    declaredProductTargetContracts,
    sourceRefs: uniqueSorted([
      ...context.sourceRefs,
      ...design.sourceRefs,
      ...tenantStack.sourceRefs,
      ...requirement.sourceRefs,
      ...product.sourceRefs
    ]),
    reasonRefs: Object.freeze([...reasonRefs].sort())
  });
}

export function declaredProductFileTargets(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return reconcileSdlcProductMaterializationAuthority(manifest)
    .declaredProductFileTargets;
}

function effectiveProductMaterializationRequiredRoles(
  manifest: SdlcWorkerHandoffManifest
): readonly SdlcMaterializedProductFileRole[] {
  const roles = new Set<SdlcMaterializedProductFileRole>(
    manifest.productMaterialization.requiredRoles
  );
  for (const target of reconcileSdlcProductMaterializationAuthority(manifest)
    .declaredProductTargetContracts) {
    roles.add(target.requiredRole);
  }
  return Object.freeze(
    MATERIALIZED_PRODUCT_FILE_ROLES.filter((role) => roles.has(role))
  );
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
    dirname(manifest.outputFile)
  ]);
  for (const target of authority.declaredProductTargetContracts) {
    const absoluteTarget = resolve(manifest.workspaceRoot, target.path);
    roots.add(target.targetKind === "directory" ? absoluteTarget : absoluteTarget);
  }
  return Object.freeze([...roots].sort());
}

function materializationAuthorityRepairWriteRoots(
  manifest: SdlcWorkerHandoffManifest,
  roots: readonly string[]
): readonly string[] {
  const authority = reconcileSdlcProductMaterializationAuthority(manifest);
  if (!materializationAuthorityNeedsTenantStackRepair(authority)) {
    return roots;
  }
  return Object.freeze(
    uniqueSorted([...roots, tenantStackSpecRoot(manifest)])
  );
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

function npmWorkspacePatterns(input: unknown): readonly string[] {
  if (Array.isArray(input)) {
    return Object.freeze(
      input.filter((value): value is string => typeof value === "string")
    );
  }
  const record = objectRecord(input);
  if (record === null) {
    return Object.freeze([]);
  }
  const packages = record["packages"];
  return Array.isArray(packages)
    ? Object.freeze(
        packages.filter((value): value is string => typeof value === "string")
      )
    : Object.freeze([]);
}

function npmWorkspacePatternMatchesModule(input: {
  readonly pattern: string;
  readonly moduleName: string;
}): boolean {
  const pattern = input.pattern.trim();
  const moduleName = input.moduleName.trim();
  return (
    pattern === moduleName ||
    pattern === `./${moduleName}` ||
    pattern === `${moduleName}/` ||
    pattern === `${moduleName}/**` ||
    pattern === "*/**" ||
    (pattern.endsWith("/*") &&
      moduleName.startsWith(`${pattern.slice(0, -2)}/`))
  );
}

function tenantDeclaresNpmWorkspace(input: {
  readonly tenantRoot: string;
  readonly moduleName: string;
}): boolean {
  const packageJsonPath = join(input.tenantRoot, "package.json");
  if (!existsSync(packageJsonPath)) {
    return false;
  }
  try {
    const record = objectRecord(JSON.parse(readFileSync(packageJsonPath, "utf8")));
    if (record === null) {
      return false;
    }
    return npmWorkspacePatterns(record["workspaces"]).some((pattern) =>
      npmWorkspacePatternMatchesModule({
        pattern,
        moduleName: input.moduleName
      })
    );
  } catch {
    return false;
  }
}

function executionShardCommand(input: {
  readonly moduleName: string;
  readonly tenantRoot: string;
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
    return tenantDeclaresNpmWorkspace({
      tenantRoot: input.tenantRoot,
      moduleName
    })
      ? `npm test --workspace ${shellToken(moduleName)}`
      : contract;
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
  if (contract === "node") {
    const testFiles = discoverNodeTestFilePaths(input.tenantRoot);
    if (testFiles.length > 0) {
      return `node --test ${testFiles.map(shellToken).join(" ")}`;
    }
  }
  return contract;
}

function discoverNodeTestFilePaths(tenantRoot: string): readonly string[] {
  if (!existsSync(tenantRoot) || !statSync(tenantRoot).isDirectory()) {
    return Object.freeze([]);
  }
  const results: string[] = [];
  const ignoredDirs = new Set([
    ".git",
    ".ai-workspace",
    "node_modules",
    "dist",
    "coverage",
    "target"
  ]);
  function walk(dir: string): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) {
          walk(join(dir, entry.name));
        }
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      const absolutePath = join(dir, entry.name);
      const relativePath = relative(tenantRoot, absolutePath).split(path.sep).join("/");
      if (
        /(?:^|\/)(?:test|tests)\//u.test(relativePath) &&
        /\.(?:test|spec)\.(?:mjs|js|cjs)$/u.test(relativePath)
      ) {
        results.push(relativePath);
      }
    }
  }
  walk(tenantRoot);
  return Object.freeze(results.sort());
}

function executionShardsFor(input: {
  readonly edgeName: string;
  readonly targetAssetType: string;
  readonly tenantRoot: string;
  readonly declaredModuleNames: readonly string[];
  readonly testExecutionContract: string;
}): SdlcProductMaterializationContract["executionShards"] {
  if (
    input.targetAssetType !== "component_test_surface" &&
    !(
      input.edgeName === FG_DERIVE_LITE_COMPONENT_CODE_SURFACE &&
      input.targetAssetType === "component_code_surface" &&
      declaredExecutionContract(input.testExecutionContract)
    ) &&
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
          tenantRoot: input.tenantRoot,
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

function assertEdgeAssuranceSourceAssetPolicy(input: {
  readonly edgeName: string;
  readonly sourceAssetPolicy: "strict" | "subset_allowed";
  readonly edgeSourceAssetTypes: readonly string[];
  readonly hookSourceAssetTypes: readonly string[];
}): void {
  const edgeSources = uniqueSorted(input.edgeSourceAssetTypes);
  const hookSources = uniqueSorted(input.hookSourceAssetTypes);
  const hookSourceSet = new Set(hookSources);
  const strictMatch =
    edgeSources.length === hookSources.length &&
    edgeSources.every((sourceAssetType) => hookSourceSet.has(sourceAssetType));
  if (input.sourceAssetPolicy === "strict") {
    if (!strictMatch) {
      throw new TypeError(
        [
          "edge assurance contract source set does not match hook contract",
          input.edgeName,
          input.sourceAssetPolicy,
          edgeSources.join(","),
          hookSources.join(",")
        ].join(":")
      );
    }
    return;
  }
  const edgeSourcesCovered = edgeSources.every((sourceAssetType) =>
    hookSourceSet.has(sourceAssetType)
  );
  if (!edgeSourcesCovered) {
    throw new TypeError(
      [
        "edge assurance contract source set is not covered by hook contract",
        input.edgeName,
        input.sourceAssetPolicy,
        edgeSources.join(","),
        hookSources.join(",")
      ].join(":")
    );
  }
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
  const collect = (currentRelativeDir: string, currentAbsoluteDir: string): string[] =>
    readdirSync(currentAbsoluteDir).flatMap((entryName) => {
      const entryPath = join(currentAbsoluteDir, entryName);
      const entryRelativePath = `${currentRelativeDir}/${entryName}`;
      let entryStat: ReturnType<typeof statSync>;
      try {
        entryStat = statSync(entryPath);
      } catch {
        return [];
      }
      if (entryStat.isDirectory()) {
        return collect(entryRelativePath, entryPath);
      }
      if (entryStat.isFile() && entryName.endsWith(".md")) {
        return [entryRelativePath];
      }
      return [];
    });
  return Object.freeze(collect(relativeDir, absoluteDir).sort());
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

function workspaceRootForImportedSourceRef(sourceFilePath: string): string | null {
  const normalizedPath = sourceFilePath.split(path.sep).join("/");
  for (const suffix of [
    "/specification/requirements/00-imported-sources.md",
    `/${PROJECT_BOOTSTRAP_RELATIVE_PATH}`
  ]) {
    if (normalizedPath.endsWith(suffix)) {
      return sourceFilePath.slice(0, sourceFilePath.length - suffix.length);
    }
  }
  return null;
}

function importedSourceRefsFromMarkdownRef(ref: string): readonly string[] {
  const source = readableFileRef(ref);
  if (source === null) {
    return Object.freeze([]);
  }
  const workspaceRoot = workspaceRootForImportedSourceRef(source.filePath);
  const refs: string[] = [];
  for (const line of source.content.split("\n")) {
    const trimmed = line.trim();
    const bulletMatch = /^-\s+`?([^`]+?)`?\s*$/u.exec(trimmed);
    const bulletRef = bulletMatch?.[1]?.trim();
    if (bulletRef === undefined) {
      continue;
    }
    if (bulletRef.startsWith("file://")) {
      refs.push(bulletRef);
      continue;
    }
    if (workspaceRoot !== null && bulletRef.startsWith("workspace://")) {
      const relativeRef = bulletRef
        .slice("workspace://".length)
        .trim()
        .replace(/^\/+/u, "");
      const absoluteRefPath = join(workspaceRoot, relativeRef);
      if (existsSync(absoluteRefPath) && statSync(absoluteRefPath).isFile()) {
        refs.push(pathToFileURL(absoluteRefPath).href);
      }
    }
  }
  return uniqueSorted(refs);
}

function importedSourceRefsFromLedger(ref: string): readonly string[] {
  return importedSourceRefsFromMarkdownRef(ref);
}

function sourceContainsRequirementAuthority(ref: string): boolean {
  const source = readableFileRef(ref);
  if (source === null) {
    return false;
  }
  return (
    REQUIREMENT_MARKER_TOKEN_EXPRESSION.test(source.content) ||
    [...source.content.matchAll(LOCAL_REQUIREMENT_HEADING_EXPRESSION)].length > 0
  );
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
    if (
      !filePath.includes("/specification/requirements/") &&
      !filePath.endsWith("/specification/REQUIREMENTS.md") &&
      !filePath.endsWith("/specification/mapper_requirements.md") &&
      !filePath.endsWith(`/${PROJECT_BOOTSTRAP_RELATIVE_PATH}`) &&
      !sourceContainsRequirementAuthority(ref)
    ) {
      continue;
    }
    if (filePath.endsWith(`/${PROJECT_BOOTSTRAP_RELATIVE_PATH}`)) {
      expanded.push(...importedSourceRefsFromMarkdownRef(ref));
      continue;
    }
    if (filePath.endsWith("/specification/requirements/00-imported-sources.md")) {
      const importedRefs = importedSourceRefsFromLedger(ref);
      if (importedRefs.length > 0) {
        expanded.push(...importedRefs);
        continue;
      }
    }
    expanded.push(ref);
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

function concreteRequirementBodySnippet(input: {
  readonly content: string;
  readonly offset: number;
  readonly marker: string;
}): string | null {
  const nextNewline = input.content.indexOf("\n", input.offset);
  const bodyStart = nextNewline < 0 ? input.content.length : nextNewline + 1;
  const requirementId = normalizeRequirementId(input.marker);
  for (const rawLine of input.content.slice(bodyStart).split("\n")) {
    const line = rawLine.replace(/\s+/gu, " ").trim();
    if (line.length === 0) {
      continue;
    }
    if (/^---+$/u.test(line) || /^#{1,6}\s+/u.test(line)) {
      return null;
    }
    if (
      /^\*\*(?:Priority|Type|Traces To|Design Component|Status)\*\*:/iu.test(line)
    ) {
      continue;
    }
    const descriptionMatch = /^\*\*Description\*\*:\s*(.+)$/iu.exec(line);
    if (descriptionMatch?.[1] !== undefined) {
      return `${requirementId}: ${descriptionMatch[1]}`.slice(0, 320);
    }
    if (/^\*\*Acceptance Criteria\*\*:/iu.test(line)) {
      continue;
    }
    const nextMarker = REQUIREMENT_MARKER_TOKEN_EXPRESSION.exec(line)?.[0];
    if (
      nextMarker !== undefined &&
      markerOnlySnippet(line, nextMarker)
    ) {
      return null;
    }
    const bulletMatch = /^[-*]\s+(.+)$/u.exec(line);
    return `${requirementId}: ${bulletMatch?.[1] ?? line}`.slice(0, 320);
  }
  return null;
}

function requirementMarkerSnippet(input: {
  readonly content: string;
  readonly offset: number;
  readonly marker: string;
}): string {
  const snippet = lineSnippetForOffset(input.content, input.offset);
  if (!markerOnlySnippet(snippet, input.marker)) {
    return snippet;
  }
  return concreteRequirementBodySnippet(input) ?? snippet;
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
  const directRefs = uniqueSorted(
    candidatePaths.flatMap((relativePath) => {
      const ref = fileRef(input.workspaceRoot, relativePath);
      return ref === null ? [] : [ref];
    })
  );
  return uniqueSorted([
    ...directRefs,
    ...directRefs.flatMap((ref) => {
      const source = readableFileRef(ref);
      if (
        source === null ||
        !source.filePath.endsWith(`/${PROJECT_BOOTSTRAP_RELATIVE_PATH}`)
      ) {
        return [];
      }
      return importedSourceRefsFromMarkdownRef(ref);
    })
  ]);
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

function tenantLocalSdlcSurfaceAssetTypeForAuthorityPath(
  filePath: string
): string | null {
  const normalized = filePath.split(path.sep).join("/");
  for (const [assetType, relativePath] of Object.entries(
    TENANT_LOCAL_SDLC_SURFACE_OUTPUT_PATHS
  )) {
    if (normalized.endsWith(`/${relativePath}`)) {
      return assetType;
    }
  }
  return null;
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
      const surfaceAssetType =
        tenantLocalSdlcSurfaceAssetTypeForAuthorityPath(source.filePath);
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
          tags: Object.freeze(
            surfaceAssetType === null ? [category] : [category, surfaceAssetType]
          )
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
    input.contract.targetAssetType === "test_design_surface" ||
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
      const trancheMatch = input.trancheKeys.some((key) => {
        const categoryMatch = key === entry.category || key.startsWith(`${entry.category}:`);
        const keySegments = key.split(":").filter((segment) => segment.length > 0);
        const assetTagMatch = entry.tags
          .filter((tag) => tag !== entry.category)
          .some((tag) => keySegments.includes(tag));
        return categoryMatch || assetTagMatch;
      });
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
        !ref.includes("/specification/requirements/00-imported-sources.md") ||
        usedRefs.has(ref)
    )
  );
}

function requirementObligations(input: {
  readonly workspaceRoot: string;
  readonly authorityRefs: readonly string[];
}): readonly SdlcTraversalObligation[] {
  const projectSlug = deriveSdlcConformProjectProfileFromWorkspace(
    input.workspaceRoot
  ).projectSlug;
  const byAuthorityRef = new Map<
    string,
    {
      readonly displayId: string;
      readonly refs: Set<string>;
      readonly digests: Set<string>;
      readonly snippets: Set<string>;
      readonly concreteSnippets: Set<string>;
      readonly derivationRefs: Set<string>;
    }
  >();
  const recordRequirement = (input: {
    readonly marker: string;
    readonly sourceRef: string;
    readonly sourceRelativePath: string;
    readonly sourceDigest: string;
    readonly snippet: string;
  }): void => {
    if (isPlaceholderRequirementMarker(input.marker)) {
      return;
    }
    const identity = requirementAuthorityIdentityForMarker({
      marker: input.marker,
      projectSlug,
      sourceRelativePath: input.sourceRelativePath,
      sourceUri: input.sourceRef,
      sourceDigest: input.sourceDigest
    });
    if (identity === null) {
      return;
    }
    const entry = byAuthorityRef.get(identity.requirementAuthorityRef) ?? {
      displayId: identity.requirementDisplayId,
      refs: new Set<string>(),
      digests: new Set<string>(),
      snippets: new Set<string>(),
      concreteSnippets: new Set<string>(),
      derivationRefs: new Set<string>()
    };
    entry.refs.add(input.sourceRef);
    entry.digests.add(input.sourceDigest);
    for (const ref of identity.authorityDerivationRefs) {
      entry.derivationRefs.add(ref);
    }
    if (input.snippet.length > 0) {
      entry.snippets.add(input.snippet);
      if (!markerOnlySnippet(input.snippet, input.marker)) {
        entry.concreteSnippets.add(input.snippet);
      }
    }
    byAuthorityRef.set(identity.requirementAuthorityRef, entry);
  };
  for (const ref of expandedRequirementAuthorityRefs(input.authorityRefs)) {
    const source = readableFileRef(ref);
    if (source === null) {
      continue;
    }
    const sourceRelativePath = relative(input.workspaceRoot, source.filePath)
      .split(path.sep)
      .join("/");
    const digest = sha256Text(source.content);
    for (const match of source.content.matchAll(REQUIREMENT_MARKER_EXPRESSION)) {
      const marker = match[0] ?? "";
      if (isPlaceholderRequirementMarker(marker)) {
        continue;
      }
      const snippet = requirementMarkerSnippet({
        content: source.content,
        offset: match.index ?? 0,
        marker
      });
      recordRequirement({
        marker,
        sourceRef: ref,
        sourceRelativePath,
        sourceDigest: digest,
        snippet
      });
    }
    for (const match of source.content.matchAll(LOCAL_REQUIREMENT_HEADING_EXPRESSION)) {
      const marker = localRequirementMarker({
        requirementId: match[1] ?? "R-000",
        title: match[2] ?? "requirement"
      });
      const snippet = lineSnippetForOffset(source.content, match.index ?? 0);
      recordRequirement({
        marker,
        sourceRef: ref,
        sourceRelativePath,
        sourceDigest: digest,
        snippet
      });
    }
  }
  return Object.freeze(
    [...byAuthorityRef.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([requirementAuthorityRef, entry]) => {
        const concreteSnippets = [...entry.concreteSnippets].sort();
        const snippets = concreteSnippets.length > 0
          ? concreteSnippets
          : [...entry.snippets].sort();
        const status = concreteSnippets.length > 0 ? "concrete" : "reference_only";
        const summary = concreteSnippets.length > 0
          ? `Fulfill ${entry.displayId}: ${concreteSnippets[0]}`
          : `Fulfill live requirement ${entry.displayId}.`;
        return Object.freeze({
          kind: "sdlc_traversal_obligation" as const,
          obligationId: `requirement:${requirementAuthorityRef}`,
          obligationKind: "requirement" as const,
          summary,
          evidenceRefs: Object.freeze(
            [...new Set([...entry.refs, ...entry.derivationRefs])].sort()
          ),
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
      const record = readArchivedWorkerResultReportRecord({
        filePath: reportPath,
        label: "PriorWorkerResultReport"
      });
      if (
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
  readonly edgeAssuranceContractRef: string;
  readonly edgeAssuranceContractDigest: string;
  readonly targetCarrierProjection: SdlcWorkerTargetCarrierProjection;
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
    edgeAssuranceContractRef: input.edgeAssuranceContractRef,
    edgeAssuranceContractDigest: input.edgeAssuranceContractDigest,
    targetCarrierContractRef:
      input.targetCarrierProjection.targetCarrierContractRef,
    targetCarrierContractDigest:
      input.targetCarrierProjection.targetCarrierContractDigest,
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
  readonly overlayRef?: string | null | undefined;
  readonly overlayBindingRef?: string | null | undefined;
  readonly graphCatalogDigestRef?: string | null | undefined;
  readonly edgeAssuranceContractRef: string;
  readonly edgeAssuranceContractDigest: string;
  readonly targetCarrierProjection: SdlcWorkerTargetCarrierProjection;
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
    overlayRef: input.overlayRef ?? null,
    overlayBindingRef: input.overlayBindingRef ?? null,
    graphCatalogDigestRef: input.graphCatalogDigestRef ?? null,
    edgeAssuranceContractRef: input.edgeAssuranceContractRef,
    edgeAssuranceContractDigest: input.edgeAssuranceContractDigest,
    targetCarrierContractRef:
      input.targetCarrierProjection.targetCarrierContractRef,
    targetCarrierContractDigest:
      input.targetCarrierProjection.targetCarrierContractDigest,
    targetCarrierProjection: input.targetCarrierProjection,
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
    pkg.overlayRef !== manifest.overlayRef ||
    pkg.overlayBindingRef !== manifest.overlayBindingRef ||
    pkg.graphCatalogDigestRef !== manifest.graphCatalogDigestRef ||
    pkg.edgeAssuranceContractRef !== manifest.edgeAssuranceContractRef ||
    pkg.edgeAssuranceContractDigest !== manifest.edgeAssuranceContractDigest ||
    pkg.targetCarrierContractRef !== manifest.targetCarrierContractRef ||
    pkg.targetCarrierContractDigest !== manifest.targetCarrierContractDigest ||
    pkg.targetAssetType !== manifest.targetAssetType ||
    pkg.outputFile !== manifest.outputFile ||
    pkg.reportFile !== manifest.reportFile
  ) {
    throw new TypeError("traversal intent package identity does not match manifest");
  }
  if (
    JSON.stringify(pkg.targetCarrierProjection) !==
    JSON.stringify(manifest.targetCarrierProjection)
  ) {
    throw new TypeError("traversal intent package target carrier projection drift");
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
  const concreteRequirementObligations =
    manifest.traversalObligationContext.obligations.filter(
      (obligation) =>
        obligation.obligationKind === "requirement" &&
        obligation.payload.status === "concrete"
    );
  if (
    manifest.productMaterialization.required &&
    concreteRequirementObligations.length === 0
  ) {
    throw new TypeError("traversal intent package missing concrete requirement lineage");
  }
  if (
    manifest.productMaterialization.required &&
    !concreteRequirementObligations.every((obligation) =>
      pkg.obligationIds.includes(obligation.obligationId)
    )
  ) {
    throw new TypeError("traversal intent package missing concrete requirement obligation");
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
  readonly overlayRef?: string | null | undefined;
  readonly overlayBindingRef?: string | null | undefined;
  readonly graphCatalogDigestRef?: string | null | undefined;
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
    edgeName: input.edgeName,
    targetAssetType: input.contract.targetAssetType,
    conformedProject,
    projectConstraints: input.projectConstraints
  });
  const edgeAssuranceContract = resolveSdlcEdgeGainClosureContract(input.edgeName);
  if (edgeAssuranceContract.targetAssetType !== input.contract.targetAssetType) {
    throw new TypeError(
      [
        "edge assurance contract target does not match hook contract",
        input.edgeName,
        edgeAssuranceContract.targetAssetType,
        input.contract.targetAssetType
      ].join(":")
    );
  }
  assertEdgeAssuranceSourceAssetPolicy({
    edgeName: input.edgeName,
    sourceAssetPolicy: edgeAssuranceContract.sourceAssetPolicy,
    edgeSourceAssetTypes: edgeAssuranceContract.sourceAssetTypes,
    hookSourceAssetTypes: input.contract.sourceAssetTypes
  });
  const edgeAssuranceContractRef =
    sdlcEdgeAssuranceContractRef(edgeAssuranceContract);
  const edgeAssuranceContractDigest =
    digestSdlcEdgeGainClosureContract(edgeAssuranceContract);
  const targetCarrierProjection = targetCarrierProjectionForRow(
    targetCarrierRowForEdge(input.edgeName)
  );
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
    workspaceRoot: input.workspaceRoot,
    targetAssetType: input.contract.targetAssetType,
    materialization
  });
  const outputFileIsTenantLocal = pathIsInside(
    resolve(outputFile),
    resolve(materialization.tenantRoot)
  );
  const outputFileIsWorkspaceLocal =
    workspaceLocalSdlcSurfaceRelativePath(input.contract.targetAssetType) !== null;
  const baseAllowedWriteRoots = (() => {
    if (
      productMaterializationHasExecutionRepairScope({
        edgeName: input.edgeName,
        targetAssetType: input.contract.targetAssetType,
        productMaterialization: materialization
      })
    ) {
      return Object.freeze([outputRoot, archiveRoot, materialization.tenantRoot]);
    }
    if (installedOperatorOwnsEvaluationOutput(input.contract.targetAssetType)) {
      return Object.freeze([outputRoot, archiveRoot]);
    }
    if (materialization.required || outputFileIsTenantLocal) {
      return Object.freeze([outputRoot, archiveRoot, materialization.tenantRoot]);
    }
    if (outputFileIsWorkspaceLocal) {
      return Object.freeze([outputRoot, archiveRoot, dirname(outputFile)]);
    }
    if (input.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY) {
      return Object.freeze([
        outputRoot,
        archiveRoot,
        join(input.workspaceRoot, ".ai-workspace", "context"),
        join(input.workspaceRoot, "specification")
      ]);
    }
    return Object.freeze([outputRoot, archiveRoot]);
  })();
  const traversalObligationContext = deriveTraversalObligationContext({
    workspaceRoot: input.workspaceRoot,
    contract: input.contract,
    edgeAssuranceContractRef,
    edgeAssuranceContractDigest,
    targetCarrierProjection,
    materialization,
    featureScope,
    retryContext
  });
  const traversalIntentPackage = constructTraversalIntentPackage({
    overlayRef: input.overlayRef ?? null,
    overlayBindingRef: input.overlayBindingRef ?? null,
    graphCatalogDigestRef: input.graphCatalogDigestRef ?? null,
    edgeAssuranceContractRef,
    edgeAssuranceContractDigest,
    targetCarrierProjection,
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
    overlayRef: input.overlayRef ?? null,
    overlayBindingRef: input.overlayBindingRef ?? null,
    graphCatalogDigestRef: input.graphCatalogDigestRef ?? null,
    edgeAssuranceContractRef,
    edgeAssuranceContractDigest,
    targetCarrierContractRef:
      targetCarrierProjection.targetCarrierContractRef,
    targetCarrierContractDigest:
      targetCarrierProjection.targetCarrierContractDigest,
    targetCarrierProjection,
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
    allowedWriteRoots: materializationAuthorityRepairWriteRoots(
      manifest,
      scopedMaterializationWriteRoots(
        manifest,
        baseAllowedWriteRoots
      )
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
  const requirementSlice = canonicalRequirementTraceObligationsForPrompt(manifest).slice(
    0,
    12
  );
  return Object.freeze([...structural, ...requirementSlice]);
}

function requirementTraceObligationIdsForPrompt(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return Object.freeze(
    canonicalRequirementTraceObligationsForPrompt(manifest)
      .slice(0, MAX_INVOCATION_PACKAGE_REQUIREMENT_TRACE_IDS)
      .map((obligation) => obligation.obligationId)
  );
}

function requirementTraceObligationIdsForProductLineage(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return Object.freeze(
    canonicalRequirementTraceObligationsForPrompt(manifest).map(
      (obligation) => obligation.obligationId
    )
  );
}

function omittedRequirementTraceObligationCount(
  manifest: SdlcWorkerHandoffManifest
): number {
  return Math.max(
    0,
    canonicalRequirementTraceObligationsForPrompt(manifest).length -
      MAX_INVOCATION_PACKAGE_REQUIREMENT_TRACE_IDS
  );
}

function compactRetrievalHints(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  hints: readonly SdlcRetrievalHint[]
): readonly SdlcRetrievalHint[] {
  const rankedHints = hints
    .map((hint, index) => ({ hint, index }))
    .sort((left, right) => {
      const leftTargeted =
        left.hint.reason === "targeted_authority_for_current_traversal" ? 1 : 0;
      const rightTargeted =
        right.hint.reason === "targeted_authority_for_current_traversal" ? 1 : 0;
      return rightTargeted - leftTargeted || left.index - right.index;
    })
    .map((entry) => entry.hint);
  return Object.freeze(
    rankedHints.slice(0, 12).map((hint) =>
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
  const envelope = [
    "kind=sdlc_component_depth_register",
    "registerVersion=ts-component-depth-v1",
    `targetAssetType=${targetAssetType}`
  ];
  if (targetAssetType === "implementation_design_surface") {
    return Object.freeze([
      ...envelope,
      "stackProfileRows[]",
      "implementationModuleRows[]",
      "aggregateDomainModelRows[]",
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
    targetAssetType === "component_code_surface" ||
    targetAssetType === "component_realization_qualification_surface"
  ) {
    return Object.freeze([
      ...envelope,
      "componentRealizationRows[].kind=sdlc_component_realization_row",
      "componentRealizationRows[].componentId",
      "componentRealizationRows[].moduleName",
      "componentRealizationRows[].relativePath",
      "componentRealizationRows[].publicBoundary",
      "componentRealizationRows[].requirementIds",
      "componentRealizationRows[].sourceAssetRefs"
    ]);
  }
  if (targetAssetType === "component_test_surface") {
    return Object.freeze([
      ...envelope,
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
      ...envelope,
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
      ...envelope,
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
      ...envelope,
      "releaseDepthParity.kind",
      "releaseDepthParity.status",
      "releaseDepthParity.evidenceRefs"
    ]);
  }
  return Object.freeze(envelope);
}

function designDepthFieldSetForTarget(targetAssetType: string): readonly string[] {
  if (targetAssetType === "implementation_design_surface") {
    return Object.freeze([
      "kind",
      "registerVersion",
      "targetAssetType",
      "stackProfileRows[].kind=sdlc_stack_profile_row",
      "stackProfileRows[].stackRef",
      "stackProfileRows[].language",
      "stackProfileRows[].buildTool",
      "implementationModuleRows[].kind=sdlc_implementation_module_row",
      "implementationModuleRows[].moduleName",
      "implementationModuleRows[].moduleRef",
      "aggregateDomainModelRows[].kind=sdlc_aggregate_domain_model_row",
      "aggregateDomainModelRows[].modelRef",
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
      "moduleStateDiagramFragments[].sourceAssetRefs",
      "aggregateDomainModel.kind=sdlc_aggregate_domain_model",
      "aggregateDomainModel.modelVersion",
      "aggregateDomainModel.entities[].kind=sdlc_aggregate_domain_entity",
      "aggregateDomainModel.entities[].entityId",
      "aggregateDomainModel.entities[].ownerModuleName",
      "aggregateDomainModel.entities[].attributes[].kind",
      "aggregateDomainModel.entities[].attributes[].attributeId",
      "aggregateDomainModel.entities[].attributes[].name",
      "aggregateDomainModel.entities[].attributes[].valueType",
      "aggregateDomainModel.entities[].attributes[].cardinality",
      "aggregateDomainModel.entities[].attributes[].invariantRefs",
      "aggregateDomainModel.entities[].sourceModuleNames",
      "aggregateDomainModel.operations[].kind=sdlc_domain_operation",
      "aggregateDomainModel.operations[].operationId",
      "aggregateDomainModel.operations[].moduleName",
      "aggregateDomainModel.operations[].inputEntityIds",
      "aggregateDomainModel.operations[].outputEntityIds",
      "aggregateDomainModel.operations[].requiredAttributeIds",
      "aggregateDomainModel.crossModuleReferences[].fromModuleName",
      "aggregateDomainModel.crossModuleReferences[].toModuleName",
      "aggregateDomainModel.crossModuleReferences[].entityId",
      "aggregateDomainModel.evidenceRefs",
      "sunnyDaySequenceRows[].kind=sdlc_sunny_day_sequence_row",
      "sunnyDaySequenceRows[].sequenceRef",
      "aggregateSunnyDaySequence.kind=sdlc_aggregate_sunny_day_sequence",
      "aggregateSunnyDaySequence.sequenceVersion",
      "aggregateSunnyDaySequence.steps[].kind=sdlc_sunny_day_sequence_step",
      "aggregateSunnyDaySequence.steps[].stepId",
      "aggregateSunnyDaySequence.steps[].moduleName",
      "aggregateSunnyDaySequence.steps[].operationId",
      "aggregateSunnyDaySequence.steps[].inputEntityIds",
      "aggregateSunnyDaySequence.steps[].outputEntityIds",
      "aggregateSunnyDaySequence.steps[].stateTransitionIds",
      "aggregateSunnyDaySequence.evidenceRefs",
      "componentTopologyRows[].kind=sdlc_component_topology_row",
      "componentTopologyRows[].componentId",
      "componentTopologyRows[].moduleName",
      "componentTopologyRows[].relativePath",
      "componentTopologyRows[].publicBoundary",
      "componentTopologyRows[].concernRole",
      "componentTopologyRows[].requirementIds",
      "componentTopologyRows[].sourceAssetRefs",
      "componentRealizationRows[].kind=sdlc_component_realization_row",
      "componentRealizationRows[].componentId",
      "componentRealizationRows[].moduleName",
      "componentRealizationRows[].relativePath",
      "componentRealizationRows[].publicBoundary",
      "componentRealizationRows[].trancheId",
      "componentRealizationRows[].firstProductFileToChange",
      "componentRealizationRows[].upstreamComponentIds",
      "componentRealizationRows[].requirementIds",
      "componentRealizationRows[].sourceAssetRefs",
      "fileTargetRows[].kind=sdlc_file_target_row",
      "fileTargetRows[].relativePath",
      "fileTargetRows[].role",
      "designCompletenessVerdict.kind=sdlc_design_completeness_verdict",
      "designCompletenessVerdict.verdictVersion",
      "designCompletenessVerdict.entity.kind=sdlc_design_completeness_axis_verdict",
      "designCompletenessVerdict.entity.axis",
      "designCompletenessVerdict.entity.status",
      "designCompletenessVerdict.entity.reasons",
      "designCompletenessVerdict.entity.evidenceRefs",
      "designCompletenessVerdict.attribute.kind=sdlc_design_completeness_axis_verdict",
      "designCompletenessVerdict.attribute.axis",
      "designCompletenessVerdict.attribute.status",
      "designCompletenessVerdict.attribute.reasons",
      "designCompletenessVerdict.attribute.evidenceRefs",
      "designCompletenessVerdict.flow.kind=sdlc_design_completeness_axis_verdict",
      "designCompletenessVerdict.flow.axis",
      "designCompletenessVerdict.flow.status",
      "designCompletenessVerdict.flow.reasons",
      "designCompletenessVerdict.flow.evidenceRefs"
    ]);
  }
  return Object.freeze(["kind", "registerVersion", "targetAssetType"]);
}

function testDesignFieldSetForTarget(targetAssetType: string): readonly string[] {
  return Object.freeze([
    "kind=sdlc_test_design_register",
    "registerVersion=ts-test-design-v1",
    `targetAssetType=${targetAssetType}`,
    "designConsumptionRows[].kind=sdlc_design_consumption_contract",
    "designConsumptionRows[].contractRef",
    "designConsumptionRows[].sourceDesignObligationRefs",
    "designConsumptionRows[].authorityBasisRefs",
    "designConsumptionRows[].consumerGraphFunctionRefs",
    "uatTestcaseRows[].kind=sdlc_test_case_row",
    "uatTestcaseRows[].testCaseRef",
    "uatTestcaseRows[].caseKind",
    "uatTestcaseRows[].executionLane",
    "uatTestcaseRows[].sourceDesignObligationRefs",
    "uatTestcaseRows[].testcaseAuthorityRefs",
    "uatTestcaseRows[].expectedBehavior",
    "testcaseAuthorityRows[].kind=sdlc_test_case_row",
    "testcaseAuthorityRows[].testCaseRef",
    "testcaseAuthorityRows[].caseKind",
    "testcaseAuthorityRows[].executionLane",
    "testcaseAuthorityRows[].sourceDesignObligationRefs",
    "testcaseAuthorityRows[].testcaseAuthorityRefs",
    "testcaseAuthorityRows[].expectedBehavior",
    "testStackProfileRows[].kind=sdlc_test_stack_profile_row",
    "testStackProfileRows[].stackRef",
    "testStackProfileRows[].frameworkRef",
    "testStackProfileRows[].buildTool",
    "testModuleRows[].kind=sdlc_test_module_row",
    "testModuleRows[].moduleName",
    "testModuleRows[].moduleRef",
    "testModuleRows[].testRoot",
    "testComponentTopologyRows[].kind=sdlc_test_component_topology_row",
    "testComponentTopologyRows[].testClassId",
    "testComponentTopologyRows[].relativePath",
    "testComponentTopologyRows[].testcaseIds",
    "testComponentTopologyRows[].componentIds",
    "testComponentTopologyRows[].requirementIds",
    "testComponentTopologyRows[].shardId",
    "testDataBindings[].kind=sdlc_test_data_binding",
    "testDataBindings[].testDataRef",
    "testDataBindings[].testCaseRef",
    "testDataBindings[].inputFixtureRefs",
    "testDataBindings[].generationPolicyRef",
    "testDataBindings[].expectedResultRef",
    "testDataBindings[].sourceDesignObligationRefs",
    "expectedResultBindings[].kind=sdlc_expected_result_binding",
    "expectedResultBindings[].expectedResultRef",
    "expectedResultBindings[].testCaseRef",
    "expectedResultBindings[].assertionRefs",
    "expectedResultBindings[].expectedResultSummary",
    "expectedResultBindings[].verificationPolicyRef",
    "uatIntegrationBindings[].kind=sdlc_uat_integration_binding",
    "uatIntegrationBindings[].uatTestCaseRef",
    "uatIntegrationBindings[].integrationTestCaseRef",
    "uatIntegrationBindings[].executionLane",
    "testExecutionScheduleRows[].kind=sdlc_test_execution_schedule_row",
    "testExecutionScheduleRows[].scheduleRef",
    "testExecutionScheduleRows[].testCaseRefs",
    "testExecutionScheduleRows[].command",
    "testExecutionScheduleRows[].frameworkRef",
    "testExecutionScheduleRows[].shardId"
  ]);
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
    input.reason.startsWith("design_depth_") ||
    input.reason.startsWith("design_attribute_missing:") ||
    input.reason.startsWith("design_flow_") ||
    input.reason.startsWith("design_state_") ||
    input.reason.startsWith("design_entity_") ||
    input.reason.startsWith("design_module_") ||
    input.reason.startsWith("design_cross_module_") ||
    input.reason.startsWith("design_operation_")
  ) {
    return Object.freeze({
      schemaRef: "schema://odd_sdlc/design_depth_register",
      fieldSet: designDepthFieldSetForTarget(input.targetAssetType)
    });
  }
  if (
    input.reason.startsWith("test_design_register_invalid:") ||
    input.reason === "test_design_register_missing" ||
    input.reason.startsWith("test_design_register_")
  ) {
    return Object.freeze({
      schemaRef: "schema://odd_sdlc/test_design_register",
      fieldSet: testDesignFieldSetForTarget(input.targetAssetType)
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
      targetEdgeName: "derive_test_design_surface",
      targetAssetType: "test_design_surface"
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
    "blockerDetail",
    "Security Manager",
    "java.security.manager",
    "Could not accept connection from test agent"
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
    "Do not run odd_sdlc, abiogenesis, genesis, start, gaps, analyze-run, install, traversal, or resume commands; the framework controls traversal after this worker exits.",
    "Do not spawn another worker or resume traversal; this process is the worker.",
    "worker_construction_brief.json is the single prompt-source carrier. Archive package files are replay/audit projections for evaluator and analyzer surfaces.",
    "Do not inspect odd_sdlc framework source code or installed runtime source to infer carrier schemas; evaluator-owned carrier contracts stay in framework archives unless this prompt explicitly asks for a structured register carrier.",
    "Do not render target-carrier protocol fields such as kind, contractRef, contractDigest, payload path, construction template refs, targetCarrierProjection, or selected-target-carrier metadata in Markdown product/design surfaces unless an outcome directive explicitly asks for a structured carrier block.",
    "Read boundary: use only relative paths under the current workspace; do not glob, read, cite, or copy sibling sandboxes, historical test_runs, home memory, or absolute paths outside the active workspace.",
    "Temporary execution logs are workspace evidence: do not create, read, or write outside-workspace temporary files such as /tmp; write transient logs only under allowed write roots.",
    "Allowed write roots are workspace-root-relative unless already absolute; if a command changes cwd, resolve allowed write roots to workspace-root absolute paths before writing evidence logs.",
    "Do not use PTY transcripts, runtime logs, or worker archives as product authority unless a package ref names them.",
    "Start the output artifact with ## Execution Plan naming read authority, bounded steps, and first materialization target.",
    "Large artifact rule: never emit one monolithic tool payload for a generated register or ADR. Keep each write/edit payload bounded; use compact rows and stable references to source authority instead of duplicating entire upstream surfaces.",
    "When requirementTraceObligationIds is non-empty, include ## Requirement Trace Register with those exact ids. Use traversal_intent_package as audit context, not as extra product-file tag pressure."
  ]);
}

function manifestUsesSbt(manifest: SdlcWorkerHandoffManifest): boolean {
  return (
    /\bsbt\b/iu.test(manifest.productMaterialization.buildExecutionContract) ||
    /\bsbt\b/iu.test(manifest.productMaterialization.testExecutionContract)
  );
}

function sbtRuntimeCompatibilityDirectives(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  if (!manifestUsesSbt(manifest)) {
    return Object.freeze([]);
  }
  return Object.freeze([
    "SBT/JDK compatibility law: do not write `-Djava.security.manager`, `-Djava.security.manager=allow`, or any java.security.manager option into build.sbt, project files, .jvmopts, or generated test commands. Modern JDKs reject Security Manager enable/allow options before ScalaTest starts.",
    "If Spark/ScalaTest needs JVM module access, keep only required `--add-opens` options; remove Security Manager options instead of repairing unrelated source or test assertions.",
    "If execution evidence contains `Security Manager`, `java.security.manager`, or `Could not accept connection from test agent`, treat it as build/test-runner configuration pressure and repair tenant build config or execution preparation before scheduling component test assertion repair."
  ]);
}

function compactComponentDepthDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  const projection = manifest.targetCarrierProjection;
  const envelopeDirective =
    `Emit a fenced \`json component_depth_register\` selected target-carrier envelope with ` +
    `\`kind:"${projection.outputCarrierKind}"\`, ` +
    `\`targetAssetType:"${manifest.targetAssetType}"\`, ` +
    `\`edgeRef:"${manifest.edgeName}"\`, ` +
    `\`contractRef:"${projection.targetCarrierContractRef}"\`, ` +
    `\`contractDigest:"${projection.targetCarrierContractDigest}"\`, and ` +
    `\`payload.kind:"sdlc_component_depth_register"\`, ` +
    `\`payload.registerVersion:"ts-component-depth-v1"\`, ` +
    `\`payload.targetAssetType:"${manifest.targetAssetType}"\`.`;
  const componentRealizationRowsDirective =
    "Emit payload.componentRealizationRows with kind=sdlc_component_realization_row, componentId, moduleName, relativePath, publicBoundary, requirementIds, and sourceAssetRefs; order rows by dependency reason and keep progress component-addressable.";
  switch (manifest.targetAssetType) {
    case "component_code_surface":
      if (manifest.graphFunctionName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET) {
        return "No component-depth schema is required for declared-product materialization; close over observed product files, requirement trace evidence, and traversal consequence.";
      }
      return [
        envelopeDirective,
        componentRealizationRowsDirective,
        "For component_code_surface, payload.componentRealizationRows must contain only source/implementation rows whose product file role is source. Role=test targets, test/ paths, proof-test targets, and execution evidence belong to component_test_surface or later test-execution edges, not to this carrier.",
        "Do not emit payload.componentRepairSchedule on component_code_surface. If Current evaluated gaps mention componentRepairSchedule on this target, remove the stale optional schedule from the component-code carrier; repair scheduling belongs only to component_repair_schedule_surface and release_depth_parity_surface.",
        "Materialize source only against the admitted implementation decomposition summary and module dependency map named by targetCarrierProjection.requiredStagedAuthorityRefs.",
        "Preserve source component boundaries from the composite implementation design authority.",
        "On re-entry with Current evaluated gaps, make the listed blocker the first materialization target: inspect the cited product file and its nearest dependency authority, perform the minimal source repair, then update the component_depth_register evidence for that repaired row.",
        "Bounded repair order: before the first edit, read at most worker_construction_brief plus the cited gap evidence file, the target source file, and one directly imported dependency file when needed."
      ].join(" ");
    case "component_realization_qualification_surface":
      return "Qualification edge worker role: read admitted component realization evidence and return bounded observations. The installed operator publishes the component_realization_qualification_surface carrier.";
    case "component_test_surface":
      return [
        envelopeDirective,
        "Emit payload.componentTestRows with row kind `sdlc_component_test_realization_row` and fields testClassId, relativePath, testcaseIds, componentIds, requirementIds, and shardId.",
        "componentTestRows[].requirementIds is the carrier field and must be a string array; product-file materialization records may use requirementTraceObligationIds, but componentTestRows must not.",
        "Materialize tests only against the admitted testcase authority, test stack profile, test decomposition summary, and test dependency map named by targetCarrierProjection.requiredStagedAuthorityRefs.",
        "Preserve testClassId/testcase allocation from the composite test design authority.",
        "On schema-local re-entry, repair the rejected component_depth_register fields first, then update only the affected test-file tags or register rows named by Current evaluated gaps."
      ].join(" ");
    case "component_test_qualification_surface":
      return "Qualification edge worker role: read admitted component-test and test-execution evidence and return bounded observations. The installed operator publishes the component_test_qualification_surface carrier.";
    case "component_repair_schedule_surface":
      return [
        envelopeDirective,
        "Emit payload.componentRepairSchedule with kind=sdlc_component_repair_schedule, registerVersion=ts-component-depth-v1, scheduleStatus, repairRows, and evidenceRefs.",
        `payload.componentRepairSchedule.scheduleStatus must be one of: ${SDLC_COMPONENT_REPAIR_SCHEDULE_STATUSES.join(", ")}.`,
        "Each repair row must carry kind=sdlc_component_repair_schedule_row, scheduleId, failureId, repairTarget, lawfulReentryPoint, attributionConfidence, testcaseIds, componentIds, requirementIds, sourceRefs, testRefs, and evidenceRefs.",
        `repairRows[].repairTarget must be one of: ${SDLC_COMPONENT_REPAIR_TARGETS.join(", ")}.`,
        `repairRows[].attributionConfidence must be one of: ${SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE.join(", ")}.`,
        "Use admitted component test qualification rows, component execution failure rows, test execution evidence, and component realization evidence to bind each repair row to the smallest owned component/test/source subsurface.",
        "Set attributionConfidence=high only when the row binds concrete failed testcaseIds, componentIds, requirementIds, sourceRefs or testRefs, and execution evidence refs. If that evidence is absent or contradictory, use scheduleStatus=triage_gap with evidenceRefs that name the missing authority instead of emitting medium-confidence repair rows.",
        "On re-entry after component_repair_schedule_not_high_confidence or component_repair_schedule_triage_gap, treat the gap as the work queue: bind the row to concrete evidence and emit high-confidence repair rows when the evidence exists; otherwise preserve explicit residual pressure instead of pretending closure.",
        "If diagnostics contain `Security Manager`, `java.security.manager`, or `Could not accept connection from test agent`, schedule build/test-runner configuration repair with repairTarget=component_code and sourceRefs naming the tenant build config; do not schedule assertion/test-file repair for that runner failure.",
        "Do not infer ecosystem-specific root cause as framework law. The schedule owns generic repair depth: failed executable obligation -> component/test/source ownership -> bounded repair target -> evidence refs."
      ].join(" ");
    case "release_depth_parity_surface":
      return "Release-depth edge worker role: read admitted realization, test, repair, archive, and execution evidence and return bounded observations. The installed operator publishes the release_depth_parity_surface carrier.";
    default:
      return null;
  }
}

function compactTestDesignDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  if (manifest.targetAssetType !== "test_design_surface") {
    return null;
  }
  const trivialProductDirective = manifestRequiresTrivialDegenerateProduct(manifest)
    ? "Trivial product profile is active: emit the degenerate test topology only. Produce one test module row, one test component topology row, one testcase authority row, one execution schedule row, and one shard for the declared test command. Do not fan out runtime, source, assertion, or execution-evidence facts into separate test-owned obligations."
    : null;
  return [
    `Materialize the target test-design ADR at ${workerFacingPath(manifest, manifest.outputFile)} with a bounded file-write or editor operation. Use the write/edit operation as the drafting surface; assistant-visible output is only compact progress.`,
    "Use worker_construction_brief.targetCarrierProjection construction refs and the row fields listed here as the authoritative test-design carrier shape; do not derive row field names from prose tables.",
    "Emit a fenced `json test_design_register` carrier with `kind:\"sdlc_test_design_register\"`, `registerVersion:\"ts-test-design-v1\"`, and `targetAssetType:\"test_design_surface\"`.",
    "The fenced `sdlc_test_design_register` top-level field set is closed to the register fields named here: target-carrier envelope fields such as summary and evidenceRefs are outside the fenced register unless the top-level object is a selected target-carrier envelope with payload.kind=sdlc_test_design_register.",
    "Use one composite test design carrier with designConsumptionRows, uatTestcaseRows, testcaseAuthorityRows, testStackProfileRows, testModuleRows, testComponentTopologyRows, testDataBindings, expectedResultBindings, uatIntegrationBindings, and testExecutionScheduleRows.",
    "Bound the carrier for first-pass construction: do not duplicate every scenario row, every component row, or full source/design text. Preserve breadth by module and requirement family, carry sourceDesignObligationRefs/evidenceRefs to the complete upstream surfaces, and keep row counts small enough to fit in bounded write/edit payloads.",
    "Prefer one representative executable unit/integration case per module family plus UAT-to-integration bindings over a giant exhaustive register. Later graph edges and residual pressure may expand coverage; this edge must create the typed test-design authority without exhausting worker output.",
    "Use exact row kinds: `sdlc_design_consumption_contract`, `sdlc_test_case_row`, `sdlc_test_stack_profile_row`, `sdlc_test_module_row`, `sdlc_test_component_topology_row`, `sdlc_test_data_binding`, `sdlc_expected_result_binding`, `sdlc_uat_integration_binding`, and `sdlc_test_execution_schedule_row`.",
    "Use exact row fields from the construction template: contractRef/sourceDesignObligationRefs/authorityBasisRefs/consumerGraphFunctionRefs for design consumption, caseKind/executionLane/expectedBehavior for test cases, testClassId/relativePath/testcaseIds/componentIds for test topology, inputFixtureRefs/generationPolicyRef for test data, assertionRefs/expectedResultSummary/verificationPolicyRef for expected results, and uatTestCaseRef/integrationTestCaseRef for UAT integration.",
    "testExecutionScheduleRows must bind scheduleRef, testCaseRefs, command, frameworkRef, and shardId to the declared test execution contract.",
    trivialProductDirective
  ].filter((directive): directive is string => directive !== null).join(" ");
}

function compactTestExecutionSurfaceDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  if (manifest.targetAssetType !== "test_execution_surface") {
    return null;
  }
  if (installedOperatorOwnsEvaluationOutput(manifest.targetAssetType)) {
    return "Test-execution-surface carrier protocol is evaluator-owned; do not emit a selected target-carrier envelope. Read the declared test execution contract and current workspace state only for bounded observations before the installed operator publishes the preparation carrier.";
  }
  const projection = manifest.targetCarrierProjection;
  return [
    "Use worker_construction_brief.targetCarrierProjection construction refs and the row fields listed here as the authoritative test-execution preparation carrier shape; do not inspect framework source code to infer row fields.",
    `Emit a fenced \`json test_execution_surface_register\` selected target-carrier envelope with \`kind:"${projection.outputCarrierKind}"\`, \`targetAssetType:"${manifest.targetAssetType}"\`, \`edgeRef:"${manifest.edgeName}"\`, \`contractRef:"${projection.targetCarrierContractRef}"\`, \`contractDigest:"${projection.targetCarrierContractDigest}"\`, and \`payload.kind:"sdlc_test_execution_surface_register"\`, \`payload.registerVersion:"ts-test-execution-v1"\`, \`payload.targetAssetType:"test_execution_surface"\`.`,
    "Emit payload.testExecutionPreparationRows with row kind `sdlc_test_execution_preparation_row`.",
    "Each preparation row must carry scheduleRef, moduleName, testClassId, testcaseIds, command, workingDirectory, frameworkRef, shardId, sourceTestFileRefs, requirementIds, status, and evidenceRefs.",
    "Use status `prepared` only when the declared command, workspace-relative workingDirectory, and graph-generated test files are present; use `blocked` or `pending` with evidenceRefs when they are not.",
    "Do not run the test command in this edge; derive_test_execution_result_surface is the only graph edge that emits execution evidence."
  ].join(" ");
}

function compactWorkspaceSpecSurfaceDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  const workspacePath =
    workspaceLocalSdlcSurfaceRelativePath(manifest.targetAssetType);
  if (workspacePath === null) {
    return null;
  }
  if (
    manifest.targetAssetType !== "requirement_surface" &&
    manifest.targetAssetType !== "uat_testcases_surface" &&
    manifest.targetAssetType !== "testcase_authority_surface"
  ) {
    return "Use evaluator-supplied construction hints as shape guidance for the workspace specification surface; write the Markdown authority surface at the declared output path. The construction hints are construction/disambiguation support, not product-closure authority, and their protocol metadata must not be rendered into the artifact.";
  }
  const trivialProductDirective =
    manifestRequiresTrivialDegenerateProduct(manifest) &&
    manifest.targetAssetType === "requirement_surface"
      ? "Trivial product profile is active: collapse implementation, runtime, test, and execution facts into the smallest lawful requirement set. A hello-world style product should normally emit one product requirement row plus target-surface protocol rows, not one requirement per execution detail."
      : null;
  return [
    `Write the graph-owned workspace specification surface at \`${workspacePath}\`; do not treat this as conformance output.`,
    "Use construction brief authority refs and construction hints to organize content rows and preserve stable row refs; do not render target-carrier protocol fields into the Markdown artifact.",
    "Current-workspace authority refs and the selected construction template are sufficient when this output is absent; derive the surface from those refs without mining prior generated examples.",
    "The construction template is GTL typed construction shape for F_P clarity; it is not an assurance gate and does not close product meaning.",
    "Materialize the target file as the working surface after reading the listed authority refs. Use a bounded file-write command or editor operation for the Markdown surface, keep assistant-visible narration to compact progress notes, keep the Markdown artifact under 250 lines, and prefer compact tables with stable refs over copied authority text.",
    manifest.targetAssetType === "requirement_surface"
      ? "For requirement_surface, derive requirement rows from imported authority and current intent/product/goal pressure."
      : manifest.targetAssetType === "uat_testcases_surface"
        ? "For uat_testcases_surface, derive user-acceptance testcase rows directly from requirement pressure before design construction."
        : "For testcase_authority_surface, bind testcase authority rows to requirements and UAT testcase refs so downstream design/test implementation consumes declared test pressure.",
    trivialProductDirective
  ].filter((directive): directive is string => directive !== null).join(" ");
}

function compactDesignDepthDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  switch (manifest.targetAssetType) {
    case "implementation_design_surface":
      const trivialProductDirective = manifestRequiresTrivialDegenerateProduct(manifest)
        ? "Trivial product profile is active: emit the degenerate implementation topology only. Produce one module row, one implementation component topology row, one source realization row, one source file target, tenant-declared build config targets when present, test file targets only when the product declares test artifacts, at most one entity, and at most one stateless state row. Map build-config, source, runtime, and proof-subject requirement refs to the single implementation component when they describe the same one-file product. Keep proof execution as downstream residual pressure. One source file remains one component row."
        : null;
      return [
        "Write the implementation design ADR as the candidate transform artifact; the ADR carries design decisions, module boundary, product file targets, and requirement lineage.",
        "Evaluator-owned outputs stay with the framework: design-depth register, selected target-carrier payload, evaluator verdict, decomposition summary, dependency map, and admission JSON.",
        "The evaluate.C/F_P design-depth evaluator populates the design-depth register from the ADR, source authority, product file targets, requirement lineage, and post-transform evidence after this worker exits; deterministic framework code admits and validates that register before closure.",
        "Use ordinary ADR sections and compact Markdown tables for module boundary, product file targets, and requirement lineage; these are design artifact content, not evaluator-owned carrier JSON.",
        "Write the ADR as bounded sections: header/status, context, decision, module boundary, product file targets, requirement lineage, and consequences.",
        "Hard output bound: keep the Markdown artifact under 450 lines, keep each write/edit payload under 180 lines, and use compact rows with source refs rather than copying upstream authority text.",
        "Keep the ADR proportional to immediate implementation structure: identify only the stack, module boundary, component/file targets, requirement lineage, and design decisions needed to materialize the declared product surface from current source assets.",
        "A substantive implementation design must preserve decomposition proportionality: no component should own more than 8 requirement refs in the requirement-lineage table; split coarse facade/engine/validator decisions into narrower public-boundary components before materialization.",
        "Before code can close, implementation design must explicitly decompose requirement pressure to the asset granularity it demands. If requirements imply separable public, runtime, data-contract, or test boundaries, name those boundaries in component-level rows instead of hiding them inside one coarse module facade.",
        "Implementation component topology rows admitted by the evaluator use componentTopologyRows[].componentId/moduleName/relativePath/publicBoundary/concernRole with row kind=sdlc_component_topology_row; publicBoundary and concernRole are string fields.",
        "Use the Product File Targets section to name every declared product file and role. Source/implementation realization belongs to source file targets; proof-test targets belong to test design and component-test surfaces.",
        "Graph-generated tests are declared as product file targets with role=test, then realized by test_design_surface and component_test_surface. Component_code_surface realization rows own source and implementation files.",
        "Map requirement obligations, runtime execution proof, process archives, test assertions, downstream evidence, and audit lineage to the owning design decision or carry them as residual pressure. Promote them into implementation modules only when the source design declares them as product modules or product data.",
        "For a single-file or script product, one module boundary, one primary source/program responsibility, and one materialization/invocation decision are sufficient.",
        trivialProductDirective
      ].filter((directive): directive is string => directive !== null).join(" ");
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
  if (manifest.targetAssetType === "test_execution_result_surface") {
    return [
      "Execution-result edge worker role: read the declared test execution contract and current workspace state for installed-operator execution.",
      "The installed operator runs the declared execution shards and publishes the sdlc_worker_execution_evidence carrier."
    ].join(" ");
  }
  return [
    "Emit sdlc_worker_execution_evidence JSON for the declared test execution contract; executable product materialization must run or explicitly fail/pending its test contract before closure.",
    "Use this exact closed carrier shape: {\"kind\":\"sdlc_worker_execution_evidence\",\"lane\":\"test\",\"command\":\"<declared test command>\",\"status\":\"succeeded|failed|pending\",\"reportRefs\":[\"file://...\"],\"testsObserved\":1,\"passedCount\":1,\"failedCount\":0,\"shardEvidence\":[{\"kind\":\"sdlc_worker_execution_shard_evidence\",\"shardId\":\"<stable shard id>\",\"moduleName\":\"<module>\",\"lane\":\"test\",\"command\":\"<shard command>\",\"status\":\"succeeded|failed|pending\",\"reportRefs\":[\"file://...\"],\"testsObserved\":1,\"passedCount\":1,\"failedCount\":0}]}.",
    "No other executionEvidence or shardEvidence fields are admitted; shardEvidence[].kind MUST be exactly \"sdlc_worker_execution_shard_evidence\".",
    "executionEvidence.status MUST be one of: succeeded, failed, pending. Do not use status values such as not_run.",
    "executionEvidence.lane MUST be exactly \"test\".",
    "executionEvidence.testsObserved, passedCount, and failedCount MUST be numbers or null.",
    "For non-failed executable test evidence, testsObserved MUST be greater than zero; add or run a real discoverable test for the declared test contract rather than reporting zero observed tests.",
    "For shardEvidence rows, use the declared test execution contract when present: copy shardId, moduleName, command, and workingDirectory rather than inventing shorthand shard refs.",
    manifest.targetAssetType === "test_execution_result_surface"
      ? "If compile, discovery, or test execution exits non-zero, diagnose and repair the product source/test/build files within allowed write roots, then rerun the declared shard/contract until it succeeds or a hard external blocker remains."
      : "If execution exits non-zero during compile, discovery, or test phases, record failed, not pending.",
    manifest.targetAssetType === "test_execution_result_surface"
      ? "Do not emit failed execution evidence merely for a repairable compile, discovery, or test failure. Emit failed only after bounded in-edge repair attempts have been exhausted, and include the repair attempts plus final failing logs as evidence."
      : null,
    "Capture stdout/stderr and report files under allowed write roots from worker_brief.allowedWriteRoots; never use /tmp or any outside-workspace path for test logs.",
    "allowedWriteRoots are workspace-root-relative unless already absolute; if a shard command changes cwd, resolve them to workspace-root absolute paths before redirecting stdout/stderr.",
    "Use pending only when execution did not run or external evidence is still unavailable. Pending evidence is a lawful non-closure carrier for triage or repricing; do not present a not-run document as release closure evidence."
  ].filter((directive): directive is string => directive !== null).join(" ");
}

function compactScheduleDirective(
  manifest: SdlcWorkerHandoffManifest
): string | null {
  if (!manifest.targetAssetType.endsWith("_schedule_surface")) {
    return null;
  }
  return "Emit schedule truth with dependency graph, tranches, shard register where relevant, obligation ledger, gap ledger, and next tranche selector.";
}

function tenantStackAuthorityRepairDirectives(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly authority: SdlcProductMaterializationAuthorityReconciliation;
}): readonly string[] {
  if (!materializationAuthorityNeedsTenantStackRepair(input.authority)) {
    return Object.freeze([]);
  }
  const target = workerFacingPath(
    input.manifest,
    tenantStackAuthorityCanonicalSpecFile(input.manifest)
  );
  return Object.freeze([
    `Tenant-stack authority repair target: ${target}.`,
    "When tenant_stack_authority_missing or tenant_stack_authority_invalid is present, materialize or repair that TECH_STACK.json file as the canonical tenant technology-stack authority surface before returning product materialization.",
    "Do not embed tenant-stack authority inside component_depth_register, target-carrier payloads, worker reports, or runtime archives; the evaluator reads it from the tenant spec authority surface.",
    "Populate the tenant stack authority from current product/context facts such as language, build tool, build execution contract, test runner, and test execution contract; declare buildConfigTargets or testBuildConfigTargets only when those config files are declared or materialized."
  ]);
}

function retryDefectDirectivesForWorker(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const reasons = manifest.retryContext.priorGapDossiers.flatMap((dossier) =>
    dossier.reasons.map((reason) => {
      const detail = workerFacingDiagnosticText(
        manifest,
        reason.blockingReason.detail ?? reason.reason
      );
      const message = workerFacingDiagnosticText(
        manifest,
        reason.blockingReason.message
      );
      return `${reason.blockingReason.lawfulReentryPoint}: ${message} (${detail})`;
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
  const frameworkOwnedEvaluationOutput = installedOperatorOwnsEvaluationOutput(
    manifest.targetAssetType
  );
  const workerAuthoredTargetCarrierProtocol =
    workerAuthoredTargetCarrierProtocolRequired(manifest);
  const targetCarrierProtocolDirectives =
    workerAuthoredTargetCarrierProtocol
      ? [
          `Target carrier contract: ${manifest.targetCarrierProjection.targetCarrierContractRef}.`,
          `Target carrier digest: ${manifest.targetCarrierProjection.targetCarrierContractDigest}.`,
          `Target carrier kind: ${manifest.targetCarrierProjection.outputCarrierKind}; nested payload path: ${manifest.targetCarrierProjection.nestedPayloadPath}.`,
          `Construction depth role: ${manifest.targetCarrierProjection.constructionDepthRole}.`,
          ...(manifest.targetCarrierProjection.producedStagedAuthorityRefs.length === 0
            ? []
            : [
                `Produced staged authority refs: ${manifest.targetCarrierProjection.producedStagedAuthorityRefs.join(", ")}.`
              ]),
          ...(manifest.targetCarrierProjection.requiredStagedAuthorityRefs.length === 0
            ? []
            : [
                `Required staged authority refs: ${manifest.targetCarrierProjection.requiredStagedAuthorityRefs.join(", ")}.`
              ]),
          `Target carrier required fields: ${manifest.targetCarrierProjection.requiredFieldRefs.join(", ")}.`,
          `Target carrier fixed protocol fields: ${manifest.targetCarrierProjection.fixedProtocolFieldRefs.join(", ")}.`,
          `Worker-fillable target carrier fields: ${manifest.targetCarrierProjection.workerFillableFieldRefs.join(", ")}.`,
          `Target carrier construction template ref: ${manifest.targetCarrierProjection.constructionTemplateRef}; exact carrier admission remains evaluator-owned.`
        ]
      : [
          "Target-carrier protocol is evaluator-owned for this edge; do not render kind, contractRef, contractDigest, payload path, construction-template refs, targetCarrierProjection, or selected-target-carrier metadata in the output artifact."
        ];
  const directives: string[] = [
    `Outcome: ${manifest.graphFunctionName} -> ${manifest.targetAssetType}.`,
    ...(frameworkOwnedEvaluationOutput
      ? [
          `Framework-owned evaluation artifact: ${workerFacingPath(manifest, manifest.outputFile)}.`,
          "The installed operator derives and writes the selected evaluation artifact after this process exits.",
          "Return after any allowed repair checks; do not fill target-carrier payload, summary, or evidence fields for this framework-owned artifact."
        ]
      : [
          `Write output artifact: ${workerFacingPath(manifest, manifest.outputFile)}.`,
          ...(manifest.outputFile.toLowerCase().endsWith(".md")
            ? [
                "Markdown output artifact: materialize the target file with a bounded file-write command or editor operation. After reading the listed authority refs, make the file-write operation the next worker action. Keep assistant-visible narration to compact progress notes, and use compact tables/sections with stable refs instead of copied authority text."
              ]
            : [])
        ]),
    `Do not write framework result report: ${workerFacingPath(manifest, manifest.reportFile)}.`,
    ...targetCarrierProtocolDirectives
  ];
  if (manifest.targetAssetType === "implementation_design_surface") {
    directives.push(
      "evaluate.C/F_P design-depth evaluator populates the design-depth register from workspace authority, the ADR transform artifact, worker result report, construction brief, invocation package, and admitted ledgers.",
      "Deterministic framework code admits and validates the evaluator register shape, identity, source file targets, evidence refs, and staged authority carriers; it does not derive replacement design-depth content."
    );
  }
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
  const executionRepairMaterialization =
    productMaterializationRequiresTestExecutionEvidence(manifest);
  if (!manifest.productMaterialization.required) {
    if (executionRepairMaterialization) {
      directives.push(
        "Product materialization is execution-repair scoped for this edge: you may edit product source/test/build files under the tenant root only to make the declared test execution contract compile and pass.",
        "Do not add unrelated product scope; keep repairs limited to compile, discovery, or test failures observed by this execution edge.",
        `Tenant root: ${workerFacingPath(manifest, manifest.productMaterialization.tenantRoot)}.`,
        `Allowed write roots: ${listForPrompt(manifest.allowedWriteRoots.map((root) => workerFacingPath(manifest, root)))}.`
      );
    } else if (installedOperatorOwnsEvaluationOutput(manifest.targetAssetType)) {
      directives.push(
        "Product materialization is not part of this edge.",
        "Worker role is observation over the selected evaluation inputs."
      );
    } else {
      directives.push(
        "Product materialization is not required for this edge.",
        "Do not write product source/test files for this edge."
      );
    }
    if (tenantOutputArtifact !== null) {
      if (frameworkOwnedEvaluationOutput) {
        directives.push(
          `Framework-owned tenant-local SDLC surface path for current replay/admission: ${tenantOutputArtifact}; do not write this path and do not list it in materializedFiles.`
        );
      } else {
        directives.push(
          `tenant-local SDLC surface artifact path: ${tenantOutputArtifact}; do not list it in materializedFiles.`
        );
      }
      if (tenantOutputArtifact.startsWith("design/adrs/")) {
        directives.push(
          "ADR/design output must carry Status:, Implements:, Derives from:, Supersedes:, Superseded by:, and retained-special-case fields."
        );
      }
    }
    if (manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY) {
      directives.push(
        "This legacy authority-audit edge is not allowed to create replacement authority surfaces.",
        "Use the deterministic project bootstrap read model and imported specification files as current state.",
        "Do not write specification/INTENT.md, specification/PRODUCT.md, specification/GOALS.md, or specification/requirements/* from this edge.",
        "If authority is missing or ambiguous, report residual pressure in the worker assessment; do not synthesize a conformant script or substitute authority.",
        "Current-full traversal should normally enter through Fg_conform_project and derive_intent_surface, not this edge."
      );
    }
    if (manifest.edgeName === FG_DERIVE_LITE_DESIGN_ADR_SURFACE) {
      directives.push(
        "This is the lite design/ADR edge.",
        "Produce a compact implementation design/ADR from current workspace authority; evaluate.C/F_P will convert it plus the admitted ledgers into the design-depth register.",
        "Give the evaluator enough product intent to infer topology: decision, module boundary, product file target, execution command, requirement lineage, and any stack/module pressure are required even when the product is a single script.",
        "When declaring JavaScript .js file targets under an existing nearest package.json with type=module, choose module-compatible source/test syntax or declare an extension path that matches the intended module system."
      );
    }
    if (manifest.targetAssetType === "code_surface") {
      directives.push(
        "For code_surface, produce a compatibility rollup over admitted component_code_surface and component_realization_qualification_surface evidence."
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
      `Required roles: ${listForPrompt(effectiveProductMaterializationRequiredRoles(manifest))}.`,
      `Build/test contracts: ${manifest.productMaterialization.buildExecutionContract} / ${manifest.productMaterialization.testExecutionContract}.`,
      productFileTargets.length === 0
        ? manifest.targetAssetType === "component_test_surface"
          ? "Declared product file targets: pending component-test register; componentTestRows[].relativePath becomes the test product target set for this edge."
          : "Declared product file targets: none."
        : `Declared product file targets: ${productFileTargets.join(", ")}.`,
      productMaterializationAuthority.declaredProductTargetContracts.length === 0
        ? "Declared product target role policy: none."
        : `Declared product target role policy: ${productMaterializationAuthority.declaredProductTargetContracts
            .map(
              (target) =>
                `${target.path} (${target.targetKind}, role=${target.requiredRole}, policy=${target.policyRef})`
            )
            .join("; ")}.`,
      productFileTargets.length === 0
        ? manifest.targetAssetType === "component_test_surface"
          ? "Component test files required by this edge are product materialization under the selected output root; operator-run asset archives may hold evidence, but they do not satisfy role=test product materialization."
          : "Declared product file target set is empty; do not leave tenant-root build/test byproducts as product materialization."
        : "Declared product file targets are the exact product surface for this edge. Build/test byproducts not listed as declared product targets, including Cargo.lock, target/, node_modules/, __pycache__/, dist/, and coverage/, must not remain under the tenant root when returning; write transient evidence under operator-run roots or clean byproducts after capturing execution evidence.",
      `Product authority reconciliation: ${productMaterializationAuthority.status}; reasons: ${listForPrompt(productMaterializationAuthority.reasonRefs)}.`,
      `Allowed write roots: ${listForPrompt(manifest.allowedWriteRoots.map((root) => workerFacingPath(manifest, root)))}.`,
      "Do not use /tmp or any outside-workspace path for temporary build/test evidence; write transient logs under allowed write roots.",
      "Allowed write roots are workspace-root-relative unless already absolute; if you change cwd into a tenant or shard directory, resolve allowed write roots to workspace-root absolute paths before writing logs.",
      "Do not create or modify product files outside the declared product file targets and allowed shared build roots for this edge.",
      "Apply requirementTraceObligationIds as the prompt-visible required product-file requirement tag set for this edge.",
      "On retry, requirement ids named by Current evaluated gaps are also admissible repair tags even when they are omitted from the prompt-limited requirementTraceObligationIds list; do not remove a current evaluated gap id solely because it is absent from that list.",
      "Do not expand product file tags from traversal_intent_package alone; it is audit context for the broader graph.",
      "When a product file is evidence for a fulfilled requirement, carry parseable requirement tags in that file and list the cited obligation ids on materializedFiles[].requirementTraceObligationIds.",
      "For source files, put the requirement tags at the top of the file using valid native comment syntax, one exact id per line, for example `// requirement:<canonical-id>`; do not rely on the report alone for product-file lineage."
    );
    directives.push(
      ...tenantStackAuthorityRepairDirectives({
        manifest,
        authority: productMaterializationAuthority
      })
    );
    directives.push(...sbtRuntimeCompatibilityDirectives(manifest));
    if (
      productMaterializationAuthority.status === "missing" ||
      productMaterializationAuthority.status === "ambiguous"
    ) {
      directives.push(
        "If product target inventory is missing or ambiguous, inspect PRODUCT.md, requirements, and construction brief authority refs; derive the product topology and report the rationale in the worker result."
      );
    }
    if (manifest.targetAssetType === "test_design_surface") {
      directives.push(
        "Generated test plan rows must define discoverable tests for the declared test execution contract.",
        "Emit a fenced ```test_design_register JSON block whose top-level kind is sdlc_test_design_register and whose row fields match the prompt-listed row contract exactly."
      );
    }
    if (manifest.targetAssetType === "component_code_surface") {
      directives.push(
        manifest.graphFunctionName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
          ? "For declared product materialization, materialize product files under the declared product file targets. The output artifact is the traversal summary carrier, not a substitute for source/build files. Use minimal source structure only when no topology authority is present."
          : manifest.graphFunctionName === FG_FRAMEWORK_SMOKE_MIN_FP_EXECUTIVE
          ? "For framework-smoke Min(F_P) component_code_surface, materialize the source product files declared by the admitted F_P design-depth register and stagePressure. Run the declared test contract only when this edge carries execution-repair scope. Keep componentRealizationRows source-role only; test files are materialized execution-proof files for the trivial graph variant, not separate component-code topology rows."
          : manifest.edgeName === FG_DERIVE_LITE_COMPONENT_CODE_SURFACE
          ? "For lite component_code_surface, materialize only the bounded source implementation files declared by construction_brief.stagePressure.designDepthEvaluatorRegisterRefs and the required staged authority refs. Do not infer topology from ADR prose alone and do not expand into release or test-execution surfaces."
          : "For component_code_surface, materialize implementation/source files for each source-role declared component and record Component Realization Register evidence. Do not create test files, test component rows, repair schedules, or execution evidence on this edge."
      );
      if (
        manifest.inputAssetTypes.includes("implementation_design_surface") &&
        manifest.targetCarrierProjection.requiredStagedAuthorityRefs.length > 0
      ) {
        directives.push(
          "Treat the admitted design-depth evaluator register as the highest implementation-design semantic pressure; read construction_brief.stagePressure.designDepthEvaluatorRegisterRefs before source edits.",
          "Use its source-role fileTargetRows/componentRealizationRows as source targets; if absent, report missing admitted design pressure.",
          "For each source-role realization, materialize or repair the named source file and carry componentId, publicBoundary, requirementIds, source tags, and materializedFiles[].requirementTraceObligationIds.",
          "Do not satisfy multiple accepted component rows by collapsing them back into one coarse facade unless the admitted register gives that shared-component rationale."
        );
      }
      if (
        manifest.graphFunctionName !== FG_MATERIALIZE_DECLARED_PRODUCT_ASSET &&
        manifest.edgeName !== FG_DERIVE_LITE_COMPONENT_CODE_SURFACE
      ) {
        directives.push(
          "When declared product file targets are empty, derive the product source target set from admitted composite implementation design authority and materialize source files at payload.componentRealizationRows[].relativePath.",
          "Exclude role=test fileTargetRows, validator/proof-test component topology rows, and any test/ path from component_code_surface componentRealizationRows; those targets are consumed by component_test_surface.",
          "Build config files alone never satisfy required role source for component_code_surface; create source-role product files first, then add build/project files only as supporting materialization declared by admitted design authority."
        );
      }
      if (manifest.graphFunctionName !== FG_MATERIALIZE_DECLARED_PRODUCT_ASSET) {
        directives.push(
          "For JavaScript .js product files under an existing nearest package.json with type=module, emit module-compatible source and test syntax or use an extension path declared by admitted design authority."
        );
      }
    }
    if (manifest.targetAssetType === "component_test_surface") {
      directives.push(
        "For component_test_surface, materialize developer test files for each declared test class/file and record Component Test Register evidence.",
	        "On component_test_surface re-entry after partial materialization, first inventory existing framework-discoverable test files under the selected output root, then complete missing declared test classes and the component_test_surface carrier before broad source review.",
	        "When declared product file targets are empty, derive test product file targets from admitted composite test design and materialize them under selected output root; for node/javascript use test/<testClassId>.test.js unless admitted design names another tenant-root test path, and for other stacks choose a framework-discoverable test path under selected output root.",
	        "payload.componentTestRows[].relativePath must name the tenant-relative or selected-output-root-prefixed product test file path. Do not point componentTestRows at .ai-workspace/runtime asset paths; those paths are evidence archives, not product test files.",
	        "Generated test files are authored for the matching workerInvocationPackage.productMaterialization.executionShards[].workingDirectory; the installed operator executes the declared shard command after this transform returns.",
	        "For node/javascript tests, derive tenant and workspace paths inside the generated test from import.meta.url or process.cwd() plus the shard workingDirectory; keep module compatibility inside declared source/test files or admitted design-declared support files.",
	        "Materialized tests must preserve declared testClassId; avoid local identifiers that collide with matcher words; prefer shouldEqual or parenthesized shouldBe RHS."
	      );
    }
  }
  for (const directive of [
    compactDesignDepthDirective(manifest),
    compactTestDesignDirective(manifest),
    compactTestExecutionSurfaceDirective(manifest),
    compactWorkspaceSpecSurfaceDirective(manifest),
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
  const workCategoryGovernance = selectSdlcWorkCategoryGovernance(input.manifest);
  const base = Object.freeze({
    kind: "sdlc_worker_invocation_package" as const,
    packageVersion: "ts-invocation-v1" as const,
    ...(input.manifest.edgeAssuranceContractRef === undefined
      ? {}
      : { edgeAssuranceContractRef: input.manifest.edgeAssuranceContractRef }),
    ...(input.manifest.edgeAssuranceContractDigest === undefined
      ? {}
      : { edgeAssuranceContractDigest: input.manifest.edgeAssuranceContractDigest }),
    ...(input.manifest.targetCarrierContractRef === undefined
      ? {}
      : { targetCarrierContractRef: input.manifest.targetCarrierContractRef }),
    ...(input.manifest.targetCarrierContractDigest === undefined
      ? {}
      : { targetCarrierContractDigest: input.manifest.targetCarrierContractDigest }),
    targetCarrierProjection: targetCarrierPromptProjectionFor(
      input.manifest.targetCarrierProjection
    ),
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    vectorIndex: input.manifest.vectorIndex,
    sourceAssetTypes: input.manifest.inputAssetTypes,
    targetAssetType: input.manifest.targetAssetType,
    workCategoryGovernance,
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
      declaredProductTargetContracts: workerFacingTargetContracts(
        input.manifest,
        productMaterializationAuthority.declaredProductTargetContracts
      ),
      requiredRoles: effectiveProductMaterializationRequiredRoles(input.manifest),
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
    omittedRequirementTraceObligationCount:
      omittedRequirementTraceObligationCount(input.manifest),
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
    ...(input.manifest.edgeAssuranceContractRef === undefined
      ? {}
      : { edgeAssuranceContractRef: input.manifest.edgeAssuranceContractRef }),
    ...(input.manifest.edgeAssuranceContractDigest === undefined
      ? {}
      : { edgeAssuranceContractDigest: input.manifest.edgeAssuranceContractDigest }),
    ...(input.manifest.targetCarrierContractRef === undefined
      ? {}
      : { targetCarrierContractRef: input.manifest.targetCarrierContractRef }),
    ...(input.manifest.targetCarrierContractDigest === undefined
      ? {}
      : { targetCarrierContractDigest: input.manifest.targetCarrierContractDigest }),
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

export function constructWorkerConstructionBrief(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly constructionBriefPath: string;
  readonly invocationPackage: SdlcWorkerInvocationPackage;
}): SdlcWorkerConstructionBrief {
  const authorityRefs =
    input.manifest.traversalObligationContext.authorityRefs ??
    input.manifest.traversalIntentPackage.authorityRefs;
  const authorityIndex =
    input.manifest.traversalObligationContext.authorityIndex ??
    authorityIndexFor(authorityRefs);
  const packageDispositions = Object.freeze([
    Object.freeze({
      kind: "sdlc_worker_construction_brief_package_disposition" as const,
      packageName: "worker_construction_brief.json",
      path: workerFacingPath(input.manifest, input.constructionBriefPath),
      digest: "<self>",
      disposition: "canonical" as const,
      role: "single prompt source carrier"
    })
  ]);
  const designDepthEvaluatorRegisterRefs = promptSourceRefs(
    workerFacingRefs(
      input.manifest,
      predecessorDesignDepthFpEvaluatorRegisterPaths(input.manifest).map(
        (filePath) => pathToFileURL(filePath).href
      )
    )
  );
  const base = Object.freeze({
    kind: "sdlc_worker_construction_brief" as const,
    briefVersion: "ts-worker-construction-brief-v1" as const,
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    vectorIndex: input.manifest.vectorIndex,
    sourceAssetTypes: input.manifest.inputAssetTypes,
    targetAssetType: input.manifest.targetAssetType,
    workCategoryGovernance: input.invocationPackage.workCategoryGovernance,
    targetCarrierProjection: targetCarrierPromptProjectionFor(
      input.manifest.targetCarrierProjection
    ),
    canonicalPromptCarrierPath: workerFacingPath(
      input.manifest,
      input.constructionBriefPath
    ),
    promptSourcePolicyRef:
      "policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1",
    packageDispositions,
    currentState: Object.freeze({
      workspaceRoot: workerFacingPath(input.manifest, input.manifest.workspaceRoot),
      archiveRoot: workerFacingPath(input.manifest, input.manifest.archiveRoot),
      authorityRefs,
      authorityIndex,
      priorEdgeRefs: promptSourceRefs(input.invocationPackage.priorEdgeRefs),
      omittedPriorEdgeRefCount: omittedPromptSourceRefCount(
        input.invocationPackage.priorEdgeRefs
      ),
      runtimeContextRefs: promptSourceRefs(input.invocationPackage.runtimeContextRefs),
      omittedRuntimeContextRefCount: omittedPromptSourceRefCount(
        input.invocationPackage.runtimeContextRefs
      )
    }),
    stagePressure: Object.freeze({
      producedStagedAuthorityRefs:
        input.manifest.targetCarrierProjection.producedStagedAuthorityRefs,
      requiredStagedAuthorityRefs:
        input.manifest.targetCarrierProjection.requiredStagedAuthorityRefs,
      designDepthEvaluatorRegisterRefs,
      expectedDesignDepthEvaluatorRegisterPath:
        input.manifest.targetAssetType === "implementation_design_surface"
          ? workerFacingPath(
              input.manifest,
              designDepthFpEvaluatorRegisterPath(input.manifest)
            )
          : null
    }),
    targetState: Object.freeze({
      outputFile: workerFacingPath(input.manifest, input.manifest.outputFile),
      reportFile: workerFacingPath(input.manifest, input.manifest.reportFile),
      materializationRequired: input.manifest.productMaterialization.required,
      tenantRoot: workerFacingPath(
        input.manifest,
        input.manifest.productMaterialization.tenantRoot
      ),
      selectedOutputRoot: input.manifest.productMaterialization.selectedOutputRoot,
      declaredProductFileTargets:
        input.invocationPackage.outputContract.declaredProductFileTargets,
      requiredRoles: input.invocationPackage.outputContract.requiredRoles,
      buildExecutionContract:
        input.manifest.productMaterialization.buildExecutionContract,
      testExecutionContract:
        input.manifest.productMaterialization.testExecutionContract
    }),
    authority: Object.freeze({
      edgeAssuranceContractRef:
        input.manifest.edgeAssuranceContractRef ?? null,
      edgeAssuranceContractDigest:
        input.manifest.edgeAssuranceContractDigest ?? null,
      targetCarrierContractRef:
        input.manifest.targetCarrierContractRef ?? null,
      targetCarrierContractDigest:
        input.manifest.targetCarrierContractDigest ?? null,
      targetCarrierProjectionRef:
        input.manifest.targetCarrierProjection.handoffProjectionRef,
      traversalStrategyDecisionRef:
        input.manifest.traversalStrategyDecision.strategyPlanRef,
      featureScopeRef: input.manifest.featureScope.scopeRef
    }),
    obligations: Object.freeze({
      inlineObligationIds: input.invocationPackage.inlineObligationIds,
      requirementTraceObligationIds:
        input.invocationPackage.requirementTraceObligationIds,
      omittedObligationCount: input.invocationPackage.omittedObligationCount,
      omittedRequirementTraceObligationCount:
        input.invocationPackage.omittedRequirementTraceObligationCount,
      obligationDeltaSummary: input.invocationPackage.obligationDeltaSummary
    }),
    retryAndRepair: Object.freeze({
      retryAttemptRefs: input.invocationPackage.retryFrontier.retryAttemptRefs,
      gapDossierRefs: input.invocationPackage.retryFrontier.dossierRefs,
      retryInstructionCount:
        input.invocationPackage.retryRepairInstructions.length,
      repairReentryPlanCount:
        input.invocationPackage.repairReentryPlans.length
    })
  });
  const packageDigest = sha256Text(stableOperatorJson(base));
  return Object.freeze({
    ...base,
    packageDispositions: Object.freeze(
      base.packageDispositions.map((disposition) =>
        disposition.packageName === "worker_construction_brief.json"
          ? Object.freeze({ ...disposition, digest: packageDigest })
          : disposition
      )
    ),
    packageDigest
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

function workerFacingDiagnosticPath(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  rawPath: string
): string {
  const relativePath = workerFacingPath(manifest, rawPath);
  if (relativePath !== rawPath) {
    return relativePath;
  }
  return `[outside-workspace-path:${path.basename(rawPath)}]`;
}

function workerFacingDiagnosticText(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  text: string
): string {
  return text
    .replace(/file:\/\/\/[^\s;),"]+/gu, (candidate) => {
      try {
        const filePath = fileURLToPath(candidate);
        const relativePath = workerFacingPath(manifest, filePath);
        if (relativePath !== filePath) {
          return `workspace://${relativePath}`;
        }
        return `[outside-workspace-file:${path.basename(filePath)}]`;
      } catch {
        return "[outside-workspace-file]";
      }
    })
    .replace(
      /(^|[\s;,(="'])\/(?!\/)[A-Za-z0-9._~!$&'*+=:@%/-]+/gu,
      (match, prefix: string) =>
        `${prefix}${workerFacingDiagnosticPath(
          manifest,
          match.slice(prefix.length)
        )}`
    );
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

const WORKER_CONSTRUCTION_BRIEF_REF_LIMIT = 12;
const WORKER_CONSTRUCTION_BRIEF_REF_MAX_BYTES = 240;

function isPromptSourceRef(ref: string): boolean {
  const trimmed = ref.trim();
  if (
    trimmed.length === 0 ||
    Buffer.byteLength(trimmed, "utf8") >
      WORKER_CONSTRUCTION_BRIEF_REF_MAX_BYTES ||
    trimmed.includes("{") ||
    trimmed.includes("\\\"")
  ) {
    return false;
  }
  return (
    trimmed.startsWith("workspace://") ||
    trimmed.startsWith("file://") ||
    trimmed.startsWith("asset://") ||
    trimmed.startsWith("requirement:") ||
    trimmed.startsWith("surface://") ||
    trimmed.startsWith("decomposition-summary://")
  );
}

function promptSourceRefs(refs: readonly string[]): readonly string[] {
  return Object.freeze(
    uniqueSorted(refs.filter(isPromptSourceRef)).slice(
      0,
      WORKER_CONSTRUCTION_BRIEF_REF_LIMIT
    )
  );
}

function omittedPromptSourceRefCount(refs: readonly string[]): number {
  const retained = promptSourceRefs(refs);
  return Math.max(0, refs.length - retained.length);
}

function workerFacingTargetContracts(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  targets: readonly SdlcProductMaterializationAuthorityTarget[]
): readonly SdlcProductMaterializationAuthorityTarget[] {
  return Object.freeze(
    targets.map((target) =>
      Object.freeze({
        ...target,
        sourceRef: workerFacingRef(manifest, target.sourceRef)
      })
    )
  );
}

function workerFacingProductMaterializationAuthority(
  manifest: Pick<SdlcWorkerHandoffManifest, "workspaceRoot">,
  reconciliation: SdlcProductMaterializationAuthorityReconciliation
): SdlcProductMaterializationAuthorityReconciliation {
  return Object.freeze({
    ...reconciliation,
    contextExpectedTargetContracts: workerFacingTargetContracts(
      manifest,
      reconciliation.contextExpectedTargetContracts
    ),
    designAssetAuthorityTargetContracts: workerFacingTargetContracts(
      manifest,
      reconciliation.designAssetAuthorityTargetContracts
    ),
    tenantStackAuthorityTargetContracts: workerFacingTargetContracts(
      manifest,
      reconciliation.tenantStackAuthorityTargetContracts
    ),
    requirementAuthorityTargetContracts: workerFacingTargetContracts(
      manifest,
      reconciliation.requirementAuthorityTargetContracts
    ),
    productAuthorityTargetContracts: workerFacingTargetContracts(
      manifest,
      reconciliation.productAuthorityTargetContracts
    ),
    declaredProductTargetContracts: workerFacingTargetContracts(
      manifest,
      reconciliation.declaredProductTargetContracts
    ),
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
        reason: workerFacingDiagnosticText(manifest, instruction.reason),
        blockingReasonDetail: workerFacingDiagnosticText(
          manifest,
          instruction.blockingReasonDetail
        ),
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

const CURRENT_EVALUATED_GAP_PROMPT_REASON_LIMIT = 64;
const CURRENT_EVALUATED_GAP_PROMPT_EVIDENCE_LIMIT = 6;

function currentEvaluatedGapRequirementIds(
  manifest: SdlcWorkerHandoffManifest,
  dossier: SdlcPostflightGapDossier
): readonly string[] {
  const ids = new Set<string>();
  const candidateTexts = dossier.reasons.flatMap((reason) => [
    reason.reason,
    reason.blockingReason.message,
    reason.blockingReason.detail ?? ""
  ]);
  for (const obligation of manifest.traversalObligationContext.obligations) {
    if (obligation.obligationKind !== "requirement") {
      continue;
    }
    const authorityRef = requirementIdForObligation(obligation.obligationId);
    const displayId = displayIdForRequirementObligation(obligation);
    const variants = uniqueSorted([
      obligation.obligationId,
      ...(authorityRef === null ? [] : [authorityRef]),
      ...(displayId === null ? [] : [displayId])
    ]).filter((variant) => variant.length > 0);
    if (
      variants.some((variant) =>
        candidateTexts.some((candidate) => candidate.includes(variant))
      )
    ) {
      ids.add(obligation.obligationId);
    }
  }
  const fallbackPattern =
    /(?:requirement:)?[A-Za-z][A-Za-z0-9_-]*(?:\.[A-Za-z0-9_-]+){2,}/gu;
  for (const reason of dossier.reasons) {
    const candidates = [
      reason.reason,
      reason.blockingReason.message,
      reason.blockingReason.detail ?? ""
    ];
    for (const candidate of candidates) {
      for (const match of candidate.matchAll(fallbackPattern)) {
        const raw = match[0];
        ids.add(raw.startsWith("requirement:") ? raw : `requirement:${raw}`);
      }
    }
  }
  return uniqueSorted([...ids]);
}

function currentEvaluatedGapPromptLines(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const priorGapDossiers = manifest.retryContext.priorGapDossiers;
  if (priorGapDossiers.length === 0) {
    return Object.freeze([]);
  }
  const dossier = priorGapDossiers[priorGapDossiers.length - 1];
  if (dossier === undefined) {
    return Object.freeze([]);
  }
  const requirementIds = currentEvaluatedGapRequirementIds(manifest, dossier);
  const evidenceRefs = workerFacingRefs(
    manifest,
    uniqueSorted([
      ...dossier.evidenceRefs,
      ...dossier.reasons.flatMap((reason) => reason.blockingReason.evidenceRefs)
    ])
  );
  const reasonLines = dossier.reasons
    .slice(0, CURRENT_EVALUATED_GAP_PROMPT_REASON_LIMIT)
    .map((reason, index) => {
      const detail = reason.blockingReason.detail ?? "";
      const diagnostic =
        detail.length > 0 && detail !== reason.reason
          ? `${reason.reason} detail=${detail}`
          : reason.reason;
      return [
        `${index + 1}. ${workerFacingDiagnosticText(manifest, diagnostic)}`,
        `[class=${reason.reasonClass}; code=${reason.blockingReason.code}; reentry=${reason.blockingReason.lawfulReentryPoint}]`
      ].join(" ");
    });
  return Object.freeze([
    "",
    "Current evaluated gaps:",
    "- These are your current evaluated gaps for this retry. This is your work queue: work through it until the queue is empty or every remaining row is explicitly blocked with evidence.",
    "- Repair these concrete evaluator blockers before adding new scope.",
    `- gapDossierRef: ${workerFacingRef(manifest, dossier.currentGapDossierRef)}`,
    `- evaluated edge=${dossier.edgeName}; target=${dossier.targetAssetType}; retryEligible=${dossier.retryEligible}; reasonCount=${dossier.reasons.length}`,
    ...(requirementIds.length > 0
      ? [
          "- blocked requirement obligations:",
          ...requirementIds.map((id) => `  - ${workerFacingDiagnosticText(manifest, id)}`),
          "- retry coverage contract:",
          "  - Treat the blocked requirement obligations as your agentic repair ledger and work queue, not a one-shot answer prompt.",
          "  - Build a Current Gap Repair Checklist from every blocked requirement obligation above before editing.",
          "  - Work through the checklist in bounded batches: choose rows, repair artifacts, update trace evidence, run the local coverage check, then continue with remaining rows.",
          "  - For each blocked requirement obligation, assign an owning componentId, source file path, source requirement tag, componentRealizationRows entry, and materializedFiles[].requirementTraceObligationIds entry.",
          "  - Do not return while any blocked requirement obligation is unmapped. If an obligation cannot lawfully be mapped on this edge, report it as explicit blocked residual pressure with evidence refs.",
          "  - Before final response, run a local check over the changed source files and result report proving every blocked requirement obligation is present in source tags and materialization trace entries.",
          "  - Final response must give counts only: gapObligations=<n> mapped=<n> blocked=<n> sourceFilesTouched=<n>."
        ]
      : []),
    ...(evidenceRefs.length > 0
      ? [
          `- evidence refs: ${evidenceRefs
            .slice(0, CURRENT_EVALUATED_GAP_PROMPT_EVIDENCE_LIMIT)
            .join(", ")}`
        ]
      : []),
    "- evaluator reasons:",
    ...reasonLines.map((reason) => `  - ${reason}`),
    ...(dossier.reasons.length > CURRENT_EVALUATED_GAP_PROMPT_REASON_LIMIT
      ? [
          `  - omitted reason count: ${
            dossier.reasons.length - CURRENT_EVALUATED_GAP_PROMPT_REASON_LIMIT
          }`
        ]
      : [])
  ]);
}

export function promptForHandoff(manifest: SdlcWorkerHandoffManifest): string {
  const manifestPath = join(manifest.archiveRoot, "handoff_manifest.json");
  const constructionBriefPath = join(
    manifest.archiveRoot,
    "worker_construction_brief.json"
  );
  const invocationPackagePath = join(
    manifest.archiveRoot,
    "worker_invocation_package.json"
  );
  const workerBriefPath = join(manifest.archiveRoot, "worker_brief.json");
  const workCategoryGovernance = selectSdlcWorkCategoryGovernance(manifest);
  const governancePath = workCategoryGovernance.workerPath;
  const traversalIntentPath = join(
    manifest.archiveRoot,
    "traversal_intent_package.json"
  );
  const productMaterializationAuthority =
    reconcileSdlcProductMaterializationAuthority(manifest);
  const declaredProductFileTargetLine =
    productMaterializationAuthority.declaredProductFileTargets.length === 0
      ? "declared product file targets: none"
      : `declared product file targets: ${listForPrompt(
          productMaterializationAuthority.declaredProductFileTargets
        )}`;
  const outcomeSummary = [
    `edge=${manifest.edgeName}`,
    `target=${manifest.targetAssetType}`,
    `materialization=${
      manifest.productMaterialization.required
        ? "required"
        : productMaterializationRequiresTestExecutionEvidence(manifest)
          ? "execution_repair_scoped"
          : "not_required"
    }`,
    `output=${workerFacingPath(manifest, manifest.outputFile)}`
  ].join("; ");
  const outcomeDirectives = outcomeDirectivesForWorker(manifest).map(
    (directive) => `- ${directive}`
  );
  const currentEvaluatedGaps = currentEvaluatedGapPromptLines(manifest);
  const workerAuthoredTargetCarrierProtocol =
    workerAuthoredTargetCarrierProtocolRequired(manifest);
  const targetCarrierIntentLine = workerAuthoredTargetCarrierProtocol
    ? `- selected target carrier: kind=${manifest.targetCarrierProjection.outputCarrierKind}; contract=${manifest.targetCarrierProjection.targetCarrierContractRef}; digest=${manifest.targetCarrierProjection.targetCarrierContractDigest}; payload path=${manifest.targetCarrierProjection.nestedPayloadPath}`
    : "- target carrier protocol: evaluator-owned; do not copy carrier metadata into the output artifact";
  const constructionBriefFieldLines = [
    "- targetState",
    "- stagePressure.requiredStagedAuthorityRefs / designDepthEvaluatorRegisterRefs.",
    ...(workerAuthoredTargetCarrierProtocol
      ? ["- targetCarrierProjection"]
      : [
          "- targetCarrierProjection: evaluator-owned protocol; do not render fields."
        ]),
    "- currentState.authorityIndex",
    "- obligations.requirementTraceObligationIds exactly when present.",
    "- retryAndRepair and current evaluated gaps when present.",
    "- retryRepairInstructions and repairReentryPlans when present.",
    "- traversalIntentPackage by ref."
  ];
  const workerPackageFieldLines = [
    "- worker_invocation_package.outcomeDirectives as worker action contract.",
    "- retryRepairInstructions and repairReentryPlans when present.",
    "- acceptedCarrierSchemaRef / acceptedCarrierFieldSet for schema-local retry.",
    "- traversalIntentPackageRef by ref; do not inline package JSON into artifacts."
  ];
  return [
    "odd_sdlc F_P.transform launch contract.",
    `Outcome: ${outcomeSummary}`,
    "",
    "Primary transform intent:",
    `- graph function: ${manifest.graphFunctionName}`,
    `- edge: ${manifest.edgeName} (${manifest.inputAssetTypes.join(", ")} -> ${manifest.targetAssetType})`,
    targetCarrierIntentLine,
    `- output surface: ${workerFacingPath(manifest, manifest.outputFile)}`,
    `- materialization: ${
      manifest.productMaterialization.required
        ? `required; tenant=${workerFacingPath(
            manifest,
            manifest.productMaterialization.tenantRoot
          )}; outputRoot=${manifest.productMaterialization.selectedOutputRoot}; roles=${listForPrompt(
            effectiveProductMaterializationRequiredRoles(manifest)
          )}`
        : productMaterializationRequiresTestExecutionEvidence(manifest)
          ? `execution-repair scoped; tenant=${workerFacingPath(
              manifest,
              manifest.productMaterialization.tenantRoot
            )}`
          : "not required"
    }`,
    `- ${declaredProductFileTargetLine}`,
    `- execution contracts: build=${manifest.productMaterialization.buildExecutionContract}; test=${manifest.productMaterialization.testExecutionContract}`,
    `- obligations in scope: ${manifest.traversalObligationContext.obligations.length}; feature scope=${manifest.featureScope.mode}; included modules=${listForPrompt(manifest.featureScope.includedModuleNames)}`,
    "This section is the core F_P transform. The construction brief is the structured carrier for these same facts, not a replacement for reading the transform intent.",
    "",
    "Read in order:",
    `1. compressed work-category governance (${workCategoryGovernance.configRef}): ${governancePath}`,
    `2. construction brief: ${workerFacingPath(manifest, constructionBriefPath)}`,
    `3. worker brief projection: ${workerFacingPath(manifest, workerBriefPath)}`,
    `4. invocation package projection: ${workerFacingPath(manifest, invocationPackagePath)}`,
    `5. traversal intent projection: ${workerFacingPath(manifest, traversalIntentPath)}`,
    `6. forensic manifest only when a package ref requires it: ${workerFacingPath(manifest, manifestPath)}`,
    "7. current authority refs listed by the construction brief for this edge.",
    "8. declared product/design/tenant files named by the construction brief or current evaluated gap.",
    "",
    "Terse axioms:",
    "- Apply worker_construction_brief.json as the single prompt source carrier.",
    "- Archive package files and manifests are replay/audit projections. Evaluated gaps cite needed diagnostics.",
    "- Apply the transform axioms projected in this launch contract and construction brief.",
    "- First action: build a Requirement/Authority/Asset Checklist from requirement ids, accepted authority rows, target rows, expected artifacts, and evaluated gaps.",
    "- Treat the checklist as the work queue. Do not return success while required checklist rows are unmapped or unreported as blocked residual pressure with evidence.",
    "- Do not inspect odd_sdlc framework source code or installed runtime source to infer carrier schemas; evaluator-owned carrier contracts stay in framework archives unless this prompt explicitly asks for a structured register carrier.",
    "- Do not render target-carrier protocol fields in Markdown product/design surfaces unless an outcome directive explicitly asks for a structured carrier block.",
    "- Read boundary: stay under the current workspace; do not glob/read sibling sandboxes or historical test_runs.",
    "- Control boundary: do not run `odd-sdlc-ts`, `abiogenesis-ts`, `genesis-ts`, `start`, `gaps`, `analyze-run`, install, traversal, or resume commands from inside this worker.",
    "- Do not spawn another worker or resume traversal. This process is the worker.",
    "- Write only the contracted output/product artifacts, then exit; the framework evaluates the artifact after this process exits.",
    "- Do not inspect or act on sibling operator-run directories.",
    "- Do not add local axiom variants from this launch frame.",
    "",
    "Outcome directives:",
    ...outcomeDirectives,
    "",
    "Construction brief fields to apply:",
    ...constructionBriefFieldLines,
    "",
    "Worker package fields to apply:",
    ...workerPackageFieldLines,
    ...currentEvaluatedGaps,
    "",
    manifest.productMaterialization.required
      ? "Product materialization is REQUIRED for this edge."
      : productMaterializationRequiresTestExecutionEvidence(manifest)
        ? "Product materialization is execution-repair scoped for this edge."
        : "Product materialization is not required for this edge.",
    "The framework writes reports, evidence carriers, ledgers, and closure after this process exits."
  ].join("\n");
}

export function writeHandoffFiles(manifest: SdlcWorkerHandoffManifest): {
  readonly manifestPath: string;
  readonly promptPath: string;
  readonly constructionBriefPath: string;
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
  const constructionBriefPath = join(
    manifest.archiveRoot,
    "worker_construction_brief.json"
  );
  const promptPath = join(manifest.archiveRoot, "worker_prompt.md");
  const conformedProjectPath = join(manifest.archiveRoot, "conformed_project.json");
  const traversalIntentPath = join(manifest.archiveRoot, "traversal_intent_package.json");
  const handoffReplayIndexPathForRun = handoffReplayIndexPath(manifest.archiveRoot);
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
  const constructionBrief = constructWorkerConstructionBrief({
    manifest,
    constructionBriefPath,
    invocationPackage
  });
  writeHandoffFile(manifestPath, stableOperatorJson(manifest));
  writeHandoffFile(
    handoffReplayIndexPathForRun,
    stableOperatorJson(handoffReplayIndexForManifest(manifest))
  );
  writeHandoffFile(invocationPackagePath, stableOperatorJson(invocationPackage));
  writeHandoffFile(workerBriefPath, stableOperatorJson(workerBrief));
  writeHandoffFile(
    constructionBriefPath,
    stableOperatorJson(constructionBrief)
  );
  writeHandoffFile(promptPath, promptForHandoff(manifest));
  writeHandoffFile(conformedProjectPath, stableOperatorJson(manifest.conformedProject));
  writeHandoffFile(
    traversalIntentPath,
    stableOperatorJson(manifest.traversalIntentPackage)
  );
  if (manifest.fpTransformRequest !== null) {
    writeHandoffFile(
      manifest.fpTransformRequestFile,
      stableOperatorJson(manifest.fpTransformRequest)
    );
  }
  return Object.freeze({
    manifestPath,
    promptPath,
    constructionBriefPath,
    invocationPackagePath,
    workerBriefPath
  });
}

function writeHandoffFile(absolutePath: string, content: string): void {
  executeSdlcFileStoreEffectPlan(
    constructSdlcWriteTextFilePlan({
      absolutePath,
      content
    })
  );
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

function expectedFpEvaluateResultRef(
  manifest: SdlcWorkerHandoffManifest
): string {
  return pathToFileURL(manifest.fpEvaluateResultFile).href;
}

function admitWorkerReportProjectionRole(
  input: unknown
): SdlcWorkerResultReport["projectionRole"] {
  const role = parseNonEmptyString(
    input,
    "SdlcWorkerResultReport.projectionRole"
  );
  if (role !== "typed_fp_stage_projection") {
    throw new TypeError(
      "SdlcWorkerResultReport.projectionRole: expected typed_fp_stage_projection"
    );
  }
  return role;
}

function admitAuthoritativeStageResultRef(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly ref: unknown;
}): string {
  const ref = parseNonEmptyString(
    input.ref,
    "SdlcWorkerResultReport.authoritativeStageResultRef"
  );
  const expected = expectedFpEvaluateResultRef(input.manifest);
  if (ref !== expected) {
    throw new TypeError(
      "SdlcWorkerResultReport.authoritativeStageResultRef: expected same-archive fp_evaluate_result.json"
    );
  }
  return ref;
}

function expectedArchivedFpEvaluateResultRef(reportFile: string): string {
  return pathToFileURL(join(dirname(reportFile), "fp_evaluate_result.json")).href;
}

function readArchivedWorkerResultReportRecord(input: {
  readonly filePath: string;
  readonly label: string;
}): Record<string, unknown> {
  const record = parseClosedRecord(
    JSON.parse(readFileSync(input.filePath, "utf8")),
    input.label,
    REPORT_FIELDS
  );
  const kind = parseNonEmptyString(record["kind"], `${input.label}.kind`);
  if (kind !== "odd_sdlc.worker_result_report") {
    throw new TypeError(`${input.label}.kind: unexpected report kind`);
  }
  const projectionRole = parseNonEmptyString(
    record["projectionRole"],
    `${input.label}.projectionRole`
  );
  if (projectionRole !== "typed_fp_stage_projection") {
    throw new TypeError(
      `${input.label}.projectionRole: expected typed_fp_stage_projection`
    );
  }
  const authoritativeStageResultRef = parseNonEmptyString(
    record["authoritativeStageResultRef"],
    `${input.label}.authoritativeStageResultRef`
  );
  if (authoritativeStageResultRef !== expectedArchivedFpEvaluateResultRef(input.filePath)) {
    throw new TypeError(
      `${input.label}.authoritativeStageResultRef: expected same-archive fp_evaluate_result.json`
    );
  }
  return record;
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

function admitWorkerResultMaterializationDiagnostic(
  input: unknown,
  label: string
): SdlcWorkerResultMaterializationDiagnostic {
  const record = parseClosedRecord(input, label, [
    "kind",
    "code",
    "detail",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_worker_result_materialization_diagnostic") {
    throw new TypeError(`${label}.kind: unexpected materialization diagnostic kind`);
  }
  return Object.freeze({
    kind: "sdlc_worker_result_materialization_diagnostic" as const,
    code: parseEnumValue(
      record["code"],
      `${label}.code`,
      SDLC_BLOCKING_REASON_CODES
    ),
    detail: parseNonEmptyString(record["detail"], `${label}.detail`),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
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
    "byteCount",
    "materializationSource",
    "sourceManifestRef",
    "sourceHandoffManifestRef",
    "sourceAttemptRef",
    "overwritesMaterializationRef",
    "rolePolicyRef",
    "requirementTraceObligationIds"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_materialized_product_file") {
    throw new TypeError(`${label}.kind: unexpected materialized file kind`);
  }
  const materializationSource =
    record["materializationSource"] === undefined
      ? "current_attempt"
      : parseEnumValue(
          record["materializationSource"],
          `${label}.materializationSource`,
          ["current_attempt", "replay"] as const
        );
  const sourceManifestRef =
    record["sourceManifestRef"] === undefined
      ? undefined
      : parseNonEmptyString(record["sourceManifestRef"], `${label}.sourceManifestRef`);
  const sourceHandoffManifestRef =
    record["sourceHandoffManifestRef"] === undefined
      ? undefined
      : parseNonEmptyString(
          record["sourceHandoffManifestRef"],
          `${label}.sourceHandoffManifestRef`
        );
  const sourceAttemptRef =
    record["sourceAttemptRef"] === undefined
      ? undefined
      : parseNonEmptyString(record["sourceAttemptRef"], `${label}.sourceAttemptRef`);
  const overwritesMaterializationRef =
    record["overwritesMaterializationRef"] === undefined
      ? undefined
      : parseNonEmptyString(
          record["overwritesMaterializationRef"],
          `${label}.overwritesMaterializationRef`
        );
  if (
    materializationSource === "replay" &&
    overwritesMaterializationRef !== undefined
  ) {
    throw new TypeError(
      `${label}.overwritesMaterializationRef: replayed files cannot overwrite predecessor materialization`
    );
  }
  const base = {
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
    byteCount: parseNonNegativeInteger(record["byteCount"], `${label}.byteCount`),
    ...(record["rolePolicyRef"] === undefined
      ? {}
      : {
          rolePolicyRef: parseNonEmptyString(
            record["rolePolicyRef"],
            `${label}.rolePolicyRef`
          )
        }),
    ...(record["requirementTraceObligationIds"] === undefined
      ? {}
      : {
          requirementTraceObligationIds: parseStringList(
            record["requirementTraceObligationIds"],
            `${label}.requirementTraceObligationIds`
          )
        })
  } satisfies Pick<
    SdlcMaterializedProductFile,
    | "kind"
    | "role"
    | "relativePath"
    | "absolutePath"
    | "digest"
    | "byteCount"
  > & {
    readonly rolePolicyRef?: string;
    readonly requirementTraceObligationIds?: readonly string[];
  };
  if (materializationSource === "replay") {
    if (
      sourceManifestRef === undefined ||
      sourceHandoffManifestRef === undefined ||
      sourceAttemptRef === undefined
    ) {
      throw new TypeError(`${label}: replayed materialized files require source lineage refs`);
    }
    return Object.freeze({
      ...base,
      materializationSource,
      sourceManifestRef,
      sourceHandoffManifestRef,
      sourceAttemptRef
    });
  }
  return Object.freeze({
    ...base,
    materializationSource,
    ...(sourceManifestRef === undefined ? {} : { sourceManifestRef }),
    ...(sourceHandoffManifestRef === undefined ? {} : { sourceHandoffManifestRef }),
    ...(sourceAttemptRef === undefined ? {} : { sourceAttemptRef }),
    ...(overwritesMaterializationRef === undefined
      ? {}
      : { overwritesMaterializationRef })
  });
}

function admitReplayManifestMaterializedProductFile(
  input: unknown,
  label: string
): SdlcMaterializedProductFile {
  const record = parseOpenRecord(input, label);
  if (
    record["materializationSource"] === "replay" &&
    record["overwritesMaterializationRef"] !== undefined
  ) {
    const projected: Record<string, unknown> = { ...record };
    delete projected["overwritesMaterializationRef"];
    return admitMaterializedProductFile(projected, label);
  }
  return admitMaterializedProductFile(input, label);
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
    "blockingReasons",
    "reviewGrade",
    "reviewFailureClass",
    "requiredAction",
    "semanticEvidenceRefs",
    "acceptedAuthorityRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_worker_obligation_assessment") {
    throw new TypeError(`${label}.kind: unexpected obligation assessment kind`);
  }
  const reviewFailureClass =
    record["reviewFailureClass"] === undefined ||
    record["reviewFailureClass"] === null
      ? null
      : parseEnumValue(
          record["reviewFailureClass"],
          `${label}.reviewFailureClass`,
          SDLC_REVIEW_GRADE_FAILURE_CLASSES
        );
  const reviewGrade =
    record["reviewGrade"] === undefined
      ? undefined
      : parseBoolean(record["reviewGrade"], `${label}.reviewGrade`);
  const requiredAction = parseOptionalNonEmptyString(
    record["requiredAction"],
    `${label}.requiredAction`
  );
  const semanticEvidenceRefs =
    record["semanticEvidenceRefs"] === undefined
      ? undefined
      : parseStringList(record["semanticEvidenceRefs"], `${label}.semanticEvidenceRefs`);
  const acceptedAuthorityRefs =
    record["acceptedAuthorityRefs"] === undefined
      ? undefined
      : parseStringList(record["acceptedAuthorityRefs"], `${label}.acceptedAuthorityRefs`);
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
    ),
    ...(reviewGrade === undefined ? {} : { reviewGrade }),
    ...(record["reviewFailureClass"] === undefined
      ? {}
      : { reviewFailureClass }),
    ...(record["requiredAction"] === undefined ? {} : { requiredAction }),
    ...(semanticEvidenceRefs === undefined ? {} : { semanticEvidenceRefs }),
    ...(acceptedAuthorityRefs === undefined ? {} : { acceptedAuthorityRefs })
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
    projectionRole: admitWorkerReportProjectionRole(record["projectionRole"]),
    authoritativeStageResultRef: admitAuthoritativeStageResultRef({
      manifest,
      ref: record["authoritativeStageResultRef"]
    }),
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
    materializationDiagnostics: parseArray(
      record["materializationDiagnostics"] ?? [],
      "SdlcWorkerResultReport.materializationDiagnostics",
      admitWorkerResultMaterializationDiagnostic
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
    fpTransformStatusSnapshot: parseOptionalFpTransformStatus(
      record["fpTransformStatusSnapshot"],
      "SdlcWorkerResultReport.fpTransformStatusSnapshot"
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

const WORKER_AUTHORITY_READ_LOG_FILES = Object.freeze([
  "worker_stdout.log",
  "worker_process_events.jsonl"
] as const);

const WORKER_AUTHORITY_PATH_KEYS = new Set([
  "command",
  "cwd",
  "directory",
  "filepath",
  "filenames",
  "glob",
  "path",
  "paths",
  "pattern",
  "root",
  "workspaceroot"
]);

const WORKER_AUTHORITY_RUNTIME_METADATA_PATH_KEYS = new Set([
  "persistedoutputpath"
]);

interface WorkerAuthorityBoundaryViolation {
  readonly sourceFile: string;
  readonly fieldPath: string;
  readonly path: string;
  readonly violationClass: "outside_workspace" | "runtime_source";
}

interface WorkerAuthorityRuntimeMetadataContext {
  readonly executorSessionIds: ReadonlySet<string>;
}

function normalizedAuthorityPathKey(input: string): string {
  return input.replace(/[-_]/gu, "").toLowerCase();
}

function workerAuthorityPathKeyCarriesFilesystemRef(input: string): boolean {
  const normalized = normalizedAuthorityPathKey(input);
  if (WORKER_AUTHORITY_RUNTIME_METADATA_PATH_KEYS.has(normalized)) {
    return false;
  }
  return (
    WORKER_AUTHORITY_PATH_KEYS.has(normalized) ||
    normalized.endsWith("path") ||
    normalized.endsWith("paths")
  );
}

function trimmedFilesystemPathCandidate(input: string): string {
  return input.replace(/[),.;\]}]+$/u, "");
}

function looksLikeAnchoredFilesystemPath(input: string): boolean {
  return /^(?:\/Users|\/private|\/tmp|\/var|\/opt|\/Volumes|\/home)(?:\/|$)/u.test(
    input
  );
}

function normalizedWorkerRuntimePath(input: string): string {
  return resolve(input).split(path.sep).join("/");
}

function collectExecutorSessionIdsFromWorkerEvent(
  input: unknown,
  sessionIds: Set<string>
): void {
  if (Array.isArray(input)) {
    for (const item of input) {
      collectExecutorSessionIdsFromWorkerEvent(item, sessionIds);
    }
    return;
  }
  const record = objectRecord(input);
  if (record === null) {
    return;
  }
  for (const [key, value] of Object.entries(record)) {
    if (
      normalizedAuthorityPathKey(key) === "sessionid" &&
      typeof value === "string" &&
      value.length > 0
    ) {
      sessionIds.add(value);
    }
    collectExecutorSessionIdsFromWorkerEvent(value, sessionIds);
  }
}

function workerAuthorityRuntimeMetadataContextFromEvents(
  events: readonly unknown[]
): WorkerAuthorityRuntimeMetadataContext {
  const executorSessionIds = new Set<string>();
  for (const event of events) {
    collectExecutorSessionIdsFromWorkerEvent(event, executorSessionIds);
  }
  return Object.freeze({
    executorSessionIds
  });
}

function isWorkerRuntimeMetadataPath(input: {
  readonly candidate: string;
  readonly context: WorkerAuthorityRuntimeMetadataContext;
}): boolean {
  const normalized = normalizedWorkerRuntimePath(input.candidate);
  if (!normalized.includes("/tool-results/")) {
    return false;
  }
  for (const sessionId of input.context.executorSessionIds) {
    if (normalized.includes(`/${sessionId}/tool-results/`)) {
      return true;
    }
  }
  return false;
}

function isInstalledRuntimeSourcePath(input: {
  readonly candidate: string;
  readonly workspaceRoot: string;
}): boolean {
  if (!pathIsInside(input.candidate, input.workspaceRoot)) {
    return false;
  }
  const relativePath = relative(input.workspaceRoot, input.candidate)
    .split(path.sep)
    .join("/");
  return /^(?:\.abiogenesis|\.genesis)\/odd_sdlc\/[^/]+\/(?:package-extract|code\/src|build\/semantic\/code\/src)\//u.test(
    relativePath
  );
}

function candidateFilesystemPathsFromWorkerField(input: string): readonly string[] {
  const candidates = new Set<string>();
  const trimmed = trimmedFilesystemPathCandidate(input.trim());
  if (trimmed.startsWith("file://")) {
    try {
      candidates.add(resolve(fileURLToPath(trimmed)));
    } catch {
      // Ignore malformed file refs; postflight has separate admission checks.
    }
  }
  if (isAbsolute(trimmed) && looksLikeAnchoredFilesystemPath(trimmed)) {
    candidates.add(resolve(trimmed));
  }
  const fileUrlExpression = /file:\/\/[^\s"'`<>)]*/gu;
  for (const match of input.matchAll(fileUrlExpression)) {
    const candidate = trimmedFilesystemPathCandidate(match[0] ?? "");
    try {
      candidates.add(resolve(fileURLToPath(candidate)));
    } catch {
      // Ignore malformed file refs; postflight has separate admission checks.
    }
  }
  const absolutePathExpression =
    /(?:^|[\s"'`([{,=])((?:\/Users|\/private|\/tmp|\/var|\/opt|\/Volumes|\/home)\/[^\s"'`<>)]*)/gu;
  for (const match of input.matchAll(absolutePathExpression)) {
    const candidate = trimmedFilesystemPathCandidate(match[1] ?? "");
    if (isAbsolute(candidate)) {
      candidates.add(resolve(candidate));
    }
  }
  return Object.freeze([...candidates]);
}

function collectWorkerAuthorityPathViolations(input: {
  readonly value: unknown;
  readonly sourceFile: string;
  readonly fieldPath: string;
  readonly workspaceRoot: string;
  readonly pathKeyContext: boolean;
  readonly runtimeMetadataContext: WorkerAuthorityRuntimeMetadataContext;
  readonly violations: WorkerAuthorityBoundaryViolation[];
}): void {
  if (typeof input.value === "string") {
    if (!input.pathKeyContext) {
      return;
    }
    for (const candidate of candidateFilesystemPathsFromWorkerField(input.value)) {
      if (isInstalledRuntimeSourcePath({
        candidate,
        workspaceRoot: input.workspaceRoot
      })) {
        input.violations.push(
          Object.freeze({
            sourceFile: input.sourceFile,
            fieldPath: input.fieldPath,
            path: candidate,
            violationClass: "runtime_source" as const
          })
        );
        continue;
      }
      if (
        !pathIsInside(candidate, input.workspaceRoot) &&
        !isWorkerRuntimeMetadataPath({
          candidate,
          context: input.runtimeMetadataContext
        })
      ) {
        input.violations.push(
          Object.freeze({
            sourceFile: input.sourceFile,
            fieldPath: input.fieldPath,
            path: candidate,
            violationClass: "outside_workspace" as const
          })
        );
      }
    }
    return;
  }
  if (Array.isArray(input.value)) {
    input.value.forEach((item, index) =>
      collectWorkerAuthorityPathViolations({
        value: item,
        sourceFile: input.sourceFile,
        fieldPath: `${input.fieldPath}[${index}]`,
        workspaceRoot: input.workspaceRoot,
        pathKeyContext: input.pathKeyContext,
        runtimeMetadataContext: input.runtimeMetadataContext,
        violations: input.violations
      })
    );
    return;
  }
  const record = objectRecord(input.value);
  if (record === null) {
    return;
  }
  for (const [key, value] of Object.entries(record)) {
    collectWorkerAuthorityPathViolations({
      value,
      sourceFile: input.sourceFile,
      fieldPath: `${input.fieldPath}.${key}`,
      workspaceRoot: input.workspaceRoot,
      pathKeyContext:
        input.pathKeyContext ||
        workerAuthorityPathKeyCarriesFilesystemRef(key),
      runtimeMetadataContext: input.runtimeMetadataContext,
      violations: input.violations
    });
  }
}

function workerAuthorityPayloadsFromEvent(input: unknown): readonly {
  readonly fieldPath: string;
  readonly value: unknown;
}[] {
  const record = objectRecord(input);
  if (record === null) {
    return Object.freeze([]);
  }
  const payloads: { fieldPath: string; value: unknown }[] = [];
  if (record["tool_use_result"] !== undefined) {
    payloads.push({
      fieldPath: "tool_use_result",
      value: record["tool_use_result"]
    });
  }
  if (record["input"] !== undefined && record["type"] === "tool_use") {
    payloads.push({
      fieldPath: "input",
      value: record["input"]
    });
  }
  const message = objectRecord(record["message"]);
  const content = Array.isArray(message?.["content"])
    ? message["content"]
    : [];
  content.forEach((item, index) => {
    const itemRecord = objectRecord(item);
    if (itemRecord?.["type"] === "tool_use" && itemRecord["input"] !== undefined) {
      payloads.push({
        fieldPath: `message.content[${index}].input`,
        value: itemRecord["input"]
      });
    }
  });
  return Object.freeze(payloads);
}

function evaluateWorkerAuthorityReadBoundary(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
}): void {
  const workspaceRoot = resolve(input.manifest.workspaceRoot);
  const violationsByKey = new Map<string, WorkerAuthorityBoundaryViolation>();
  const evidenceRefs = new Set<string>();
  for (const fileName of WORKER_AUTHORITY_READ_LOG_FILES) {
    const logFile = join(input.manifest.archiveRoot, fileName);
    if (!existsSync(logFile) || !statSync(logFile).isFile()) {
      continue;
    }
    evidenceRefs.add(pathToFileURL(logFile).href);
    const lines = readFileSync(logFile, "utf8").split(/\r?\n/u);
    const parsedEvents: { readonly lineIndex: number; readonly value: unknown }[] = [];
    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        return;
      }
      const parsed = parseJsonCandidate(trimmed);
      if (!parsed.ok) {
        return;
      }
      parsedEvents.push({ lineIndex, value: parsed.value });
    });
    const runtimeMetadataContext = workerAuthorityRuntimeMetadataContextFromEvents(
      parsedEvents.map((event) => event.value)
    );
    for (const parsedEvent of parsedEvents) {
      for (const payload of workerAuthorityPayloadsFromEvent(parsedEvent.value)) {
        const violations: WorkerAuthorityBoundaryViolation[] = [];
        collectWorkerAuthorityPathViolations({
          value: payload.value,
          sourceFile: logFile,
          fieldPath: `${fileName}:${parsedEvent.lineIndex + 1}.${payload.fieldPath}`,
          workspaceRoot,
          pathKeyContext: false,
          runtimeMetadataContext,
          violations
        });
        for (const violation of violations) {
          violationsByKey.set(
            `${violation.sourceFile}\n${violation.fieldPath}\n${violation.path}`,
            violation
          );
        }
      }
    }
  }
  const violations = [...violationsByKey.values()];
  if (violations.length === 0) {
    return;
  }
  const pushReason = (
    code: "worker_authority_read_outside_workspace" | "worker_runtime_source_read",
    selected: readonly WorkerAuthorityBoundaryViolation[]
  ) => {
    if (selected.length === 0) {
      return;
    }
    const displayed = selected
      .slice(0, 5)
      .map((violation) => `${violation.fieldPath}=${violation.path}`);
    const omitted = selected.length - displayed.length;
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code,
        detail: omitted > 0
          ? `${displayed.join("; ")}; omitted=${omitted}`
          : displayed.join("; "),
        evidenceRefs: Object.freeze([...evidenceRefs])
      })
    );
  };
  pushReason(
    "worker_authority_read_outside_workspace",
    violations.filter((violation) => violation.violationClass === "outside_workspace")
  );
  pushReason(
    "worker_runtime_source_read",
    violations.filter((violation) => violation.violationClass === "runtime_source")
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

function isSdlcWorkerHandoffManifest(
  value: unknown
): value is SdlcWorkerHandoffManifest {
  const record = objectRecord(value);
  return (
    record !== null &&
    record["kind"] === "sdlc_worker_handoff_manifest" &&
    typeof record["reportFile"] === "string" &&
    typeof record["targetAssetType"] === "string" &&
    objectRecord(record["productMaterialization"]) !== null
  );
}

function readArchivedWorkerHandoffManifestForReport(input: {
  readonly reportFile: string;
  readonly label: string;
}): SdlcWorkerHandoffManifest {
  const manifestPath = join(dirname(input.reportFile), "handoff_manifest.json");
  if (!existsSync(manifestPath) || !statSync(manifestPath).isFile()) {
    throw new TypeError(`${input.label}.handoffManifest: missing sibling handoff_manifest.json`);
  }
  const parsed = parseJsonCandidate(readFileSync(manifestPath, "utf8"));
  if (!parsed.ok) {
    throw new TypeError(`${input.label}.handoffManifest: invalid JSON`);
  }
  const record = objectRecord(parsed.value);
  if (record === null) {
    throw new TypeError(`${input.label}.handoffManifest: expected object`);
  }
  if (!isSdlcWorkerHandoffManifest(parsed.value)) {
    throw new TypeError(
      `${input.label}.handoffManifest: expected sdlc worker handoff manifest shape`
    );
  }
  const kind = parseNonEmptyString(
    record["kind"],
    `${input.label}.handoffManifest.kind`
  );
  if (kind !== "sdlc_worker_handoff_manifest") {
    throw new TypeError(
      `${input.label}.handoffManifest.kind: expected sdlc_worker_handoff_manifest`
    );
  }
  const reportFile = parseNonEmptyString(
    record["reportFile"],
    `${input.label}.handoffManifest.reportFile`
  );
  if (resolve(reportFile) !== resolve(input.reportFile)) {
    throw new TypeError(
      `${input.label}.handoffManifest.reportFile: expected same-archive worker_result_report.json`
    );
  }
  return parsed.value;
}

function readExecutionResultEvidenceFromReportRef(ref: string): {
  readonly executionEvidence: SdlcWorkerExecutionEvidence | null;
  readonly sourceManifest: SdlcWorkerHandoffManifest | null;
  readonly error: string | null;
} {
  const filePath = filePathFromEvidenceRef(ref);
  if (filePath === null || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return Object.freeze({
      executionEvidence: null,
      sourceManifest: null,
      error: "not a readable file evidence ref"
    });
  }
  try {
    const record = readArchivedWorkerResultReportRecord({
      filePath,
      label: "SourceWorkerResultReport"
    });
    const targetAssetType = parseNonEmptyString(
      record["targetAssetType"],
      "SourceWorkerResultReport.targetAssetType"
    );
    if (targetAssetType !== "test_execution_result_surface") {
      return Object.freeze({
        executionEvidence: null,
        sourceManifest: null,
        error: `unexpected source target ${targetAssetType}`
      });
    }
    const sourceManifest = readArchivedWorkerHandoffManifestForReport({
      reportFile: filePath,
      label: "SourceWorkerResultReport"
    });
    if (sourceManifest.targetAssetType !== "test_execution_result_surface") {
      return Object.freeze({
        executionEvidence: null,
        sourceManifest: null,
        error: `source manifest target mismatch ${sourceManifest.targetAssetType}`
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
        sourceManifest: null,
        error: executionEvidenceErrors.length > 0
          ? `execution evidence invalid: ${executionEvidenceErrors.join("; ")}`
          : "execution evidence missing"
      });
    }
    return Object.freeze({ executionEvidence, sourceManifest, error: null });
  } catch (error) {
    return Object.freeze({
      executionEvidence: null,
      sourceManifest: null,
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
    const sourceManifest = readResult.sourceManifest;
    if (sourceManifest === null) {
      attempts.push(`${ref}: source handoff manifest missing`);
      continue;
    }
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
        manifest: sourceManifest,
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
      manifest: sourceManifest,
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

function isExecutionGeneratedBuildPropertiesPath(relativePath: string): boolean {
  const normalized = normalizedRelativePath(relativePath).toLowerCase();
  return (
    normalized === "project/build.properties" ||
    normalized.endsWith("/project/build.properties")
  );
}

function isSbtRuntimeConfigurationPath(relativePath: string): boolean {
  const normalized = normalizedRelativePath(relativePath).toLowerCase();
  return (
    normalized === "build.sbt" ||
    normalized.endsWith("/build.sbt") ||
    normalized === ".jvmopts" ||
    normalized.endsWith("/.jvmopts") ||
    normalized === ".sbtopts" ||
    normalized.endsWith("/.sbtopts") ||
    normalized === "project/build.properties" ||
    normalized.endsWith("/project/build.properties") ||
    /^project\/[^/]+\.sbt$/u.test(normalized) ||
    /\/project\/[^/]+\.sbt$/u.test(normalized)
  );
}

function declaredBuildConfigRoleForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly normalizedRelativePath: string;
}): SdlcMaterializedProductFileRole | null {
  if (
    tenantStackBuildConfigTargetCoversRelativePath({
      manifest: input.manifest,
      relativePath: input.normalizedRelativePath
    })
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
  return target.requiredRole;
}

function materializedRoleForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
}): SdlcMaterializedProductFileRole {
  const normalized = input.relativePath.split(path.sep).join("/");
  const declaredAuthorityRole = declaredProductAuthorityRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalized
  });
  if (declaredAuthorityRole !== null) {
    return declaredAuthorityRole;
  }
  const declaredBuildConfigRole = declaredBuildConfigRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalized
  });
  if (declaredBuildConfigRole !== null) {
    return declaredBuildConfigRole;
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
  if (targetAdmitsTestExecutionEvidence(input.manifest.targetAssetType)) {
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
  const normalized = input.file.relativePath.split(path.sep).join("/");
  const role = declaredProductAuthorityRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalized
  });
  if (role === null) {
    return false;
  }
  if (!effectiveProductMaterializationRequiredRoles(input.manifest).includes(role)) {
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
    byteCount: input.file.byteCount,
    materializationSource: "current_attempt" as const
  });
}

function manifestRequiresStagedAuthority(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly authorityRef: string;
}): boolean {
  return (
    input.manifest.targetCarrierProjection?.requiredStagedAuthorityRefs.includes(
      input.authorityRef
    ) ?? false
  );
}

function stagedSurfaceEvidenceRefs(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly targetAssetType: string;
}): readonly string[] {
  const outputFile = componentDepthSurfaceFile(
    input.manifest,
    input.targetAssetType
  );
  return Object.freeze(
    outputFile === null
      ? [pathToFileURL(input.manifest.workspaceRoot).href]
      : [pathToFileURL(outputFile).href]
  );
}

function manifestCapabilityValue(
  manifest: SdlcWorkerHandoffManifest,
  name: string
): string | null {
  return (
    manifest.conformedProject.capabilityContracts?.find(
      (contract) => contract.name === name
    )?.value ?? null
  );
}

function truthyCapabilityValue(value: string | null): boolean {
  const normalized = value?.trim().toLowerCase() ?? "";
  return (
    normalized === "1" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

function manifestRequiresTrivialDegenerateProduct(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return truthyCapabilityValue(manifestCapabilityValue(manifest, "trivial_product"));
}

function pushStagedTopologyBlockingReason(input: {
  readonly blockingReasonCarriers: SdlcBlockingReason[];
  readonly code: SdlcBlockingReasonCode;
  readonly detail: string;
  readonly evidenceRefs: readonly string[];
}): void {
  input.blockingReasonCarriers.push(
    makeSdlcBlockingReason({
      code: input.code,
      detail: input.detail,
      evidenceRefs: input.evidenceRefs
    })
  );
}

function stagedSummaryRefs(refs: readonly string[]): string {
  return refs.length === 0 ? "none" : refs.join("|");
}

function stagedSummaryRowCountDetail(
  summary: SdlcDecompositionSummary,
  downstreamId: string
): string {
  const row = summary.rows.find((candidate) => candidate.downstreamId === downstreamId);
  if (row === undefined) {
    return `${downstreamId}:ownedUpstreamCount=unknown`;
  }
  return [
    `${downstreamId}:ownedUpstreamCount=${row.ownedUpstreamCount}`,
    `maxOwnedUpstreamPerDownstream=${summary.maxOwnedUpstreamPerDownstream}`,
    `ownedUpstreamRefs=${stagedSummaryRefs(row.ownedUpstreamRefs)}`
  ].join(" ");
}

function stagedDecompositionBlockingDetail(
  summary: SdlcDecompositionSummary
): string {
  const details = [...summary.blockingReasons];
  if (summary.overloadedDownstreamIds.length > 0) {
    details.push(
      `overloadedDownstreamRows=${summary.overloadedDownstreamIds
        .map((downstreamId) => stagedSummaryRowCountDetail(summary, downstreamId))
        .join("; ")}`
    );
  }
  if (
    summary.blockingReasons.includes(
      "decomposition_compression_ratio_exceeds_threshold"
    )
  ) {
    details.push(
      `upstreamPerDownstreamRatio=${summary.upstreamPerDownstreamRatio}`,
      `maxUpstreamPerDownstreamRatio=${summary.maxUpstreamPerDownstreamRatio}`
    );
  }
  if (summary.explosionUpstreamRefs.length > 0) {
    details.push(
      `explosionUpstreamRefs=${stagedSummaryRefs(summary.explosionUpstreamRefs)}`,
      `maxDownstreamPerUpstream=${summary.maxDownstreamPerUpstream}`
    );
  }
  if (summary.unownedDownstreamIds.length > 0) {
    details.push(
      `unownedDownstreamRows=${stagedSummaryRefs(summary.unownedDownstreamIds)}`
    );
  }
  if (summary.facadeDownstreamIds.length > 0) {
    details.push(
      `facadeDownstreamRows=${stagedSummaryRefs(summary.facadeDownstreamIds)}`
    );
  }
  if (summary.underDecomposedParentIds.length > 0) {
    details.push(
      `underDecomposedParentRows=${stagedSummaryRefs(summary.underDecomposedParentIds)}`
    );
  }
  if (summary.residualOutsideSubsurfaceRefs.length > 0) {
    details.push(
      `residualOutsideSubsurfaceRefs=${stagedSummaryRefs(summary.residualOutsideSubsurfaceRefs)}`
    );
  }
  if (summary.invalidReferenceFields.length > 0) {
    details.push(
      `invalidReferenceFields=${stagedSummaryRefs(summary.invalidReferenceFields)}`
    );
  }
  return details.join("; ");
}

function stagedAuditCarrier(
  artifactRef: string,
  payload: SdlcStagedConstructionAuditCarrier["payload"]
): SdlcStagedConstructionAuditCarrier {
  const artifact = requireOperatorRunArtifactRowForArtifactRef(artifactRef);
  return Object.freeze({
    artifactRef: artifact.artifactRef,
    relativePath: artifact.relativePath,
    payload
  });
}

export function deriveSdlcStagedConstructionAuditCarriers(
  manifest: SdlcWorkerHandoffManifest,
  fpEvaluatorAdmissionEvidenceRefs: readonly string[] = Object.freeze([])
): readonly SdlcStagedConstructionAuditCarrier[] {
  const carriers: SdlcStagedConstructionAuditCarrier[] = [];
  const requireTrivialDegenerateProduct =
    manifestRequiresTrivialDegenerateProduct(manifest);
  let implementationDependencyMap: SdlcModuleDependencyMap | null = null;
  const implementationRegister = readAdmittedImplementationDesign(
    manifest,
    fpEvaluatorAdmissionEvidenceRefs
  );
  if (implementationRegister !== null) {
    const authority = deriveSdlcStagedImplementationTopologyAuthority({
      register: implementationRegister,
      requireTrivialDegenerateProduct
    });
    implementationDependencyMap = authority.dependencyMap;
    carriers.push(
      stagedAuditCarrier(
        "operator-run-artifact://implementation-decomposition-summary",
        authority.summary
      ),
      stagedAuditCarrier(
        "operator-run-artifact://module-dependency-map",
        authority.dependencyMap
      ),
      stagedAuditCarrier(
        "operator-run-artifact://module-dependency-traversal-selection",
        selectSdlcDependencyMapTraversal({
          selectionRef: "selection://odd-sdlc/component-code/staged-topology",
          dependencyMap: authority.dependencyMap,
          policy: "parallel_when_partitioned",
          basisRefs: Object.freeze([
            "surface://implementation-decomposition-summary",
            "surface://module-dependency-map"
          ])
        })
      )
    );
  }

  const testRegister = readAdmittedTestDesign(manifest);
  if (testRegister !== null) {
    const authority = deriveSdlcStagedTestTopologyAuthority({
      register: testRegister,
      requireTrivialDegenerateProduct
    });
    carriers.push(
      stagedAuditCarrier(
        "operator-run-artifact://test-decomposition-summary",
        authority.summary
      ),
      stagedAuditCarrier(
        "operator-run-artifact://test-dependency-map",
        authority.dependencyMap
      ),
      stagedAuditCarrier(
        "operator-run-artifact://test-dependency-traversal-selection",
        selectSdlcDependencyMapTraversal({
          selectionRef: "selection://odd-sdlc/component-test/staged-topology",
          dependencyMap: authority.dependencyMap,
          policy: "parallel_when_partitioned",
          basisRefs: Object.freeze([
            "surface://test-decomposition-summary",
            "surface://test-dependency-map"
          ])
        })
      )
    );
  } else if (implementationDependencyMap !== null) {
    const derivedTestDependencyMap =
      deriveSdlcTestDependencyMapFromImplementationDependencyMap({
        moduleDependencyMap: implementationDependencyMap
      });
    if (derivedTestDependencyMap !== null) {
      carriers.push(
        stagedAuditCarrier(
          "operator-run-artifact://test-dependency-map",
          derivedTestDependencyMap
        ),
        stagedAuditCarrier(
          "operator-run-artifact://test-dependency-traversal-selection",
          selectSdlcDependencyMapTraversal({
            selectionRef:
              "selection://odd-sdlc/component-test/implementation-derived-topology",
            dependencyMap: derivedTestDependencyMap,
            policy: "parallel_when_partitioned",
            basisRefs: Object.freeze([
              implementationDependencyMap.mapRef,
              "surface://module-dependency-map",
              "surface://test-dependency-map"
            ])
          })
        )
      );
    }
  }

  return Object.freeze(carriers);
}

function evaluateImplementationDesignProducerAuthority(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
  readonly fpEvaluatorAdmissionEvidenceRefs: readonly string[];
}): void {
  if (input.manifest.targetAssetType !== "implementation_design_surface") {
    return;
  }
  const evidenceRefs = stagedSurfaceEvidenceRefs({
    manifest: input.manifest,
    targetAssetType: "implementation_design_surface"
  });
  const outputFile = componentDepthSurfaceFile(
    input.manifest,
    "implementation_design_surface"
  );
  if (outputFile === null || !existsSync(outputFile)) {
    pushStagedTopologyBlockingReason({
      blockingReasonCarriers: input.blockingReasonCarriers,
      code: "staged_authority_missing",
      detail: "implementation_design_surface",
      evidenceRefs
    });
    return;
  }
  const admission =
    input.fpEvaluatorAdmissionEvidenceRefs.length > 0
      ? admitImplementationDesignRegisterForRuntimeEvaluation({
          manifest: input.manifest,
          fpEvaluatorAdmissionEvidenceRefs: input.fpEvaluatorAdmissionEvidenceRefs
        })
      : admitImplementationDesignRegisterForManifest({
          manifest: input.manifest
        });
  if (admission.status !== "admitted" || admission.register === null) {
    pushStagedTopologyBlockingReason({
      blockingReasonCarriers: input.blockingReasonCarriers,
      code: "staged_authority_admission_invalid",
      detail:
        admission.blockingReasons.length === 0
          ? "implementation_design_surface_admission_rejected"
          : admission.blockingReasons.join("; "),
      evidenceRefs: uniqueSorted([...evidenceRefs, ...admission.evidenceRefs])
    });
    return;
  }
  const register = admission.register;
  const authority = deriveSdlcStagedImplementationTopologyAuthority({
    register,
    requireTrivialDegenerateProduct:
      manifestRequiresTrivialDegenerateProduct(input.manifest)
  });
  if (authority.summary.admissionDecision === "reject") {
    pushStagedTopologyBlockingReason({
      blockingReasonCarriers: input.blockingReasonCarriers,
      code: "staged_decomposition_rejected",
      detail: stagedDecompositionBlockingDetail(authority.summary),
      evidenceRefs: [
        ...evidenceRefs,
        "surface://implementation-decomposition-summary"
      ]
    });
  }
}

function evaluateTestDesignProducerAuthority(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
}): void {
  if (input.manifest.targetAssetType !== "test_design_surface") {
    return;
  }
  const evidenceRefs = stagedSurfaceEvidenceRefs({
    manifest: input.manifest,
    targetAssetType: "test_design_surface"
  });
  const outputFile = componentDepthSurfaceFile(
    input.manifest,
    "test_design_surface"
  );
  if (outputFile === null || !existsSync(outputFile)) {
    pushStagedTopologyBlockingReason({
      blockingReasonCarriers: input.blockingReasonCarriers,
      code: "staged_authority_missing",
      detail: "test_design_surface",
      evidenceRefs
    });
    return;
  }
  const admission = admitTestDesignRegisterFromArtifact({
    targetAssetType: "test_design_surface",
    outputFile
  });
  if (admission.status !== "admitted" || admission.register === null) {
    pushStagedTopologyBlockingReason({
      blockingReasonCarriers: input.blockingReasonCarriers,
      code: "staged_authority_admission_invalid",
      detail:
        admission.blockingReasons.length === 0
          ? "test_design_surface_admission_rejected"
          : admission.blockingReasons.join("; "),
      evidenceRefs: uniqueSorted([...evidenceRefs, ...admission.evidenceRefs])
    });
    return;
  }
  const register = admission.register;
  const authority = deriveSdlcStagedTestTopologyAuthority({
    register,
    requireTrivialDegenerateProduct:
      manifestRequiresTrivialDegenerateProduct(input.manifest)
  });
  if (authority.summary.admissionDecision === "reject") {
    pushStagedTopologyBlockingReason({
      blockingReasonCarriers: input.blockingReasonCarriers,
      code: "staged_decomposition_rejected",
      detail: stagedDecompositionBlockingDetail(authority.summary),
      evidenceRefs: [...evidenceRefs, "surface://test-decomposition-summary"]
    });
  }
}

function evaluateStagedConstructionAuthority(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
  readonly fpEvaluatorAdmissionEvidenceRefs: readonly string[];
}): void {
  evaluateImplementationDesignProducerAuthority(input);
  evaluateTestDesignProducerAuthority(input);
  if (
    input.manifest.targetAssetType === "component_code_surface" &&
    manifestRequiresStagedAuthority({
      manifest: input.manifest,
      authorityRef: "surface://implementation-decomposition-summary"
    })
  ) {
    const evidenceRefs = stagedSurfaceEvidenceRefs({
      manifest: input.manifest,
      targetAssetType: "implementation_design_surface"
    });
    const register = readAdmittedImplementationDesign(
      input.manifest,
      input.fpEvaluatorAdmissionEvidenceRefs
    );
    if (register === null) {
      pushStagedTopologyBlockingReason({
        blockingReasonCarriers: input.blockingReasonCarriers,
        code: "staged_authority_missing",
        detail: "implementation_design_surface",
        evidenceRefs
      });
      return;
    }
    const authority = deriveSdlcStagedImplementationTopologyAuthority({
      register,
      requireTrivialDegenerateProduct:
        manifestRequiresTrivialDegenerateProduct(input.manifest)
    });
    if (authority.summary.admissionDecision === "reject") {
      pushStagedTopologyBlockingReason({
        blockingReasonCarriers: input.blockingReasonCarriers,
        code: "staged_decomposition_rejected",
        detail: stagedDecompositionBlockingDetail(authority.summary),
        evidenceRefs: [
          ...evidenceRefs,
          "surface://implementation-decomposition-summary"
        ]
      });
    }
    if (authority.dependencyMap.nodes.length === 0) {
      pushStagedTopologyBlockingReason({
        blockingReasonCarriers: input.blockingReasonCarriers,
        code: "staged_dependency_map_missing",
        detail: "module-dependency-map",
        evidenceRefs: [...evidenceRefs, "surface://module-dependency-map"]
      });
      return;
    }
    const traversal = selectSdlcDependencyMapTraversal({
      selectionRef: "selection://odd-sdlc/component-code/staged-topology",
      dependencyMap: authority.dependencyMap,
      policy: "parallel_when_partitioned",
      basisRefs: evidenceRefs
    });
    if (traversal.selectedMethod === "blocked") {
      pushStagedTopologyBlockingReason({
        blockingReasonCarriers: input.blockingReasonCarriers,
        code: "staged_dependency_traversal_blocked",
        detail: traversal.blockingReasons.join(", "),
        evidenceRefs: [
          ...evidenceRefs,
          "surface://module-dependency-map",
          traversal.selectionRef
        ]
      });
    }
    return;
  }
  if (
    input.manifest.targetAssetType === "component_test_surface" &&
    manifestRequiresStagedAuthority({
      manifest: input.manifest,
      authorityRef: "surface://test-decomposition-summary"
    })
  ) {
    const evidenceRefs = stagedSurfaceEvidenceRefs({
      manifest: input.manifest,
      targetAssetType: "test_design_surface"
    });
    const register = readAdmittedTestDesign(input.manifest);
    if (register === null) {
      pushStagedTopologyBlockingReason({
        blockingReasonCarriers: input.blockingReasonCarriers,
        code: "staged_authority_missing",
        detail: "test_design_surface",
        evidenceRefs
      });
      return;
    }
    const authority = deriveSdlcStagedTestTopologyAuthority({
      register,
      requireTrivialDegenerateProduct:
        manifestRequiresTrivialDegenerateProduct(input.manifest)
    });
    if (authority.summary.admissionDecision === "reject") {
      pushStagedTopologyBlockingReason({
        blockingReasonCarriers: input.blockingReasonCarriers,
        code: "staged_decomposition_rejected",
        detail: stagedDecompositionBlockingDetail(authority.summary),
        evidenceRefs: [...evidenceRefs, "surface://test-decomposition-summary"]
      });
    }
    if (authority.dependencyMap.nodes.length === 0) {
      pushStagedTopologyBlockingReason({
        blockingReasonCarriers: input.blockingReasonCarriers,
        code: "staged_dependency_map_missing",
        detail: "test-dependency-map",
        evidenceRefs: [...evidenceRefs, "surface://test-dependency-map"]
      });
      return;
    }
    const traversal = selectSdlcDependencyMapTraversal({
      selectionRef: "selection://odd-sdlc/component-test/staged-topology",
      dependencyMap: authority.dependencyMap,
      policy: "parallel_when_partitioned",
      basisRefs: evidenceRefs
    });
    if (traversal.selectedMethod === "blocked") {
      pushStagedTopologyBlockingReason({
        blockingReasonCarriers: input.blockingReasonCarriers,
        code: "staged_dependency_traversal_blocked",
        detail: traversal.blockingReasons.join(", "),
        evidenceRefs: [
          ...evidenceRefs,
          "surface://test-dependency-map",
          traversal.selectionRef
        ]
      });
    }
  }
}

function targetContractForMaterializedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly relativePath: string;
}): SdlcProductMaterializationAuthorityTarget | null {
  const normalized = input.relativePath.split(path.sep).join("/");
  const authority = reconcileSdlcProductMaterializationAuthority(input.manifest);
  return (
    authority.declaredProductTargetContracts.find((candidate) =>
      productAuthorityTargetCoversRelativePath({
        manifest: input.manifest,
        target: candidate,
        normalizedRelativePath: normalized
      })
    ) ?? null
  );
}

function isAdmissibleAuxiliaryBuildConfig(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcMaterializedProductFile;
}): boolean {
  return (
    input.file.role === "build_config" &&
    declaredBuildConfigRoleForObservedFile({
      manifest: input.manifest,
      normalizedRelativePath: normalizedRelativePath(input.file.relativePath)
    }) === "build_config"
  );
}

function materializedFileLineageRef(input: {
  readonly manifestRef: string;
  readonly relativePath: string;
  readonly digest: string;
}): string {
  return [
    "materialized-product-file://odd-sdlc",
    encodeURIComponent(input.manifestRef),
    encodeURIComponent(input.relativePath),
    encodeURIComponent(input.digest)
  ].join("/");
}

function handoffManifestRefForArchiveRoot(archiveRoot: string): string {
  return pathToFileURL(join(archiveRoot, "handoff_manifest.json")).href;
}

function attemptRefForArchiveRoot(archiveRoot: string): string {
  return pathToFileURL(archiveRoot).href;
}

function rolePolicyRefForMaterializedRole(
  role: SdlcMaterializedProductFileRole
): string {
  if (role === "source") {
    return "target-role-policy://odd-sdlc/product-source-tree";
  }
  if (role === "test") {
    return "target-role-policy://odd-sdlc/product-test-tree";
  }
  if (role === "build_config") {
    return "target-role-policy://odd-sdlc/reported-build-config";
  }
  if (role === "design") {
    return "target-role-policy://odd-sdlc/product-design-surface";
  }
  if (role === "documentation") {
    return "target-role-policy://odd-sdlc/product-documentation";
  }
  return "target-role-policy://odd-sdlc/reported-other";
}

function fileWithMaterializationProvenance(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcMaterializedProductFile;
  readonly materializationSource: "current_attempt" | "replay";
  readonly sourceManifestRef: string;
  readonly sourceHandoffManifestRef: string;
  readonly sourceAttemptRef: string;
  readonly overwritesMaterializationRef?: string | null | undefined;
}): SdlcMaterializedProductFile {
  const targetContract = targetContractForMaterializedFile({
    manifest: input.manifest,
    relativePath: input.file.relativePath
  });
  const buildConfigRole = declaredBuildConfigRoleForObservedFile({
    manifest: input.manifest,
    normalizedRelativePath: normalizedRelativePath(input.file.relativePath)
  });
  const authorityRole = targetContract?.requiredRole ?? buildConfigRole ?? null;
  const effectiveRole =
    input.file.role === "other" && authorityRole !== null
      ? authorityRole
      : input.file.role;
  const rolePolicyRef =
    input.materializationSource === "replay"
      ? effectiveRole === input.file.role
        ? input.file.rolePolicyRef
        : targetContract?.policyRef ?? rolePolicyRefForMaterializedRole(effectiveRole)
      : input.file.rolePolicyRef ??
        targetContract?.policyRef ??
        rolePolicyRefForMaterializedRole(effectiveRole);
  return Object.freeze({
    kind: input.file.kind,
    role: effectiveRole,
    relativePath: input.file.relativePath,
    absolutePath: input.file.absolutePath,
    digest: input.file.digest,
    byteCount: input.file.byteCount,
    ...(input.file.requirementTraceObligationIds === undefined
      ? {}
      : { requirementTraceObligationIds: input.file.requirementTraceObligationIds }),
    materializationSource: input.materializationSource,
    sourceManifestRef: input.sourceManifestRef,
    sourceHandoffManifestRef: input.sourceHandoffManifestRef,
    sourceAttemptRef: input.sourceAttemptRef,
    ...(input.overwritesMaterializationRef === null ||
    input.overwritesMaterializationRef === undefined
      ? {}
      : { overwritesMaterializationRef: input.overwritesMaterializationRef }),
    ...(rolePolicyRef === undefined ? {} : { rolePolicyRef })
  });
}

function currentAttemptMaterializedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcMaterializedProductFile;
  readonly overwritesMaterializationRef?: string | null | undefined;
}): SdlcMaterializedProductFile {
  return fileWithMaterializationProvenance({
    manifest: input.manifest,
    file: input.file,
    materializationSource: "current_attempt",
    sourceManifestRef: pathToFileURL(
      input.manifest.productMaterialization.manifestFile
    ).href,
    sourceHandoffManifestRef: handoffManifestRefForArchiveRoot(input.manifest.archiveRoot),
    sourceAttemptRef: attemptRefForArchiveRoot(input.manifest.archiveRoot),
    overwritesMaterializationRef: input.overwritesMaterializationRef
  });
}

function replayMaterializedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcMaterializedProductFile;
  readonly sourceManifestRef: string;
  readonly sourceHandoffManifestRef: string;
  readonly sourceAttemptRef: string;
}): SdlcMaterializedProductFile {
  return fileWithMaterializationProvenance({
    manifest: input.manifest,
    file: input.file,
    materializationSource: "replay",
    sourceManifestRef: input.sourceManifestRef,
    sourceHandoffManifestRef: input.sourceHandoffManifestRef,
    sourceAttemptRef: input.sourceAttemptRef
  });
}

function currentAttemptMaterializedFileFromReplayPath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly observedFile: SdlcObservedProductFileSnapshot;
  readonly replayedFile: SdlcMaterializedProductFile;
  readonly sourceManifestRef: string;
}): SdlcMaterializedProductFile {
  return currentAttemptMaterializedFile({
    manifest: input.manifest,
    file: Object.freeze({
      ...input.replayedFile,
      relativePath: input.observedFile.relativePath,
      absolutePath: input.observedFile.absolutePath,
      digest: input.observedFile.digest,
      byteCount: input.observedFile.byteCount
    }),
    overwritesMaterializationRef: materializedFileLineageRef({
      manifestRef: input.sourceManifestRef,
      relativePath: input.replayedFile.relativePath,
      digest: input.replayedFile.digest
    })
  });
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

interface ProductMaterializationObservationDelta {
  readonly materializedFiles: readonly SdlcMaterializedProductFile[];
  readonly diagnostics: readonly SdlcWorkerResultMaterializationDiagnostic[];
}

function priorAdmittedMaterializedFileForObservedFile(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
}): PriorAdmittedObservedMaterializedFileLookup {
  for (const archiveRoot of productMaterializationReplayArchives(input.manifest)) {
    if (
      !priorHandoffManifestMatchesCurrent({
        archiveRoot,
        currentManifest: input.manifest
      })
    ) {
      continue;
    }
    const replayManifest = readProductMaterializationReplayManifest({
      archiveRoot,
      currentManifest: input.manifest
    });
    if (replayManifest.kind === "diagnostic") {
      return Object.freeze({
        kind: "diagnostic" as const,
        diagnostics: Object.freeze([
          Object.freeze({
            kind: "sdlc_worker_result_materialization_diagnostic" as const,
            code: replayManifest.code,
            detail: replayManifest.detail,
            evidenceRefs: replayManifest.evidenceRefs
          })
        ])
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
        file: replayMaterializedFile({
          manifest: input.manifest,
          file: matched,
          sourceManifestRef: pathToFileURL(replayManifest.manifestFile).href,
          sourceHandoffManifestRef: handoffManifestRefForArchiveRoot(archiveRoot),
          sourceAttemptRef: attemptRefForArchiveRoot(archiveRoot)
        })
      });
    }
  }
  return Object.freeze({ kind: "none" as const });
}

function priorAdmittedMaterializedFileForObservedPath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
}): PriorAdmittedObservedMaterializedFileLookup {
  let latest:
    | {
        readonly archiveRoot: string;
        readonly manifestFile: string;
        readonly file: SdlcMaterializedProductFile;
      }
    | null = null;
  for (const archiveRoot of productMaterializationReplayArchives(input.manifest)) {
    if (
      !priorHandoffManifestMatchesCurrent({
        archiveRoot,
        currentManifest: input.manifest
      })
    ) {
      continue;
    }
    const replayManifest = readProductMaterializationReplayManifest({
      archiveRoot,
      currentManifest: input.manifest
    });
    if (replayManifest.kind === "diagnostic") {
      return Object.freeze({
        kind: "diagnostic" as const,
        diagnostics: Object.freeze([
          Object.freeze({
            kind: "sdlc_worker_result_materialization_diagnostic" as const,
            code: replayManifest.code,
            detail: replayManifest.detail,
            evidenceRefs: replayManifest.evidenceRefs
          })
        ])
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
    file: currentAttemptMaterializedFileFromReplayPath({
      manifest: input.manifest,
      observedFile: input.file,
      replayedFile: latest.file,
      sourceManifestRef: pathToFileURL(latest.manifestFile).href
    })
  });
}

function priorAdmittedMaterializedFileForObservedProductLineage(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcObservedProductFileSnapshot;
  readonly postflightStatus?: "blocked" | "passed";
}): PriorAdmittedObservedMaterializedFileLookup {
  const expectedPostflightStatus = input.postflightStatus ?? "passed";
  for (const archiveRoot of productMaterializationReplayArchives(input.manifest)) {
    const replayStatus = replayArchivePostflightStatus(archiveRoot);
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
        admitReplayManifestMaterializedProductFile
      );
      const matched = files.find(
        (candidate) =>
          candidate.relativePath === input.file.relativePath &&
          candidate.digest === input.file.digest
      );
      if (matched !== undefined) {
        return Object.freeze({
          kind: "file" as const,
          file: replayMaterializedFile({
            manifest: input.manifest,
            file: matched,
            sourceManifestRef: pathToFileURL(manifestFile).href,
            sourceHandoffManifestRef: handoffManifestRefForArchiveRoot(archiveRoot),
            sourceAttemptRef: attemptRefForArchiveRoot(archiveRoot)
          })
        });
      }
    } catch {
      continue;
    }
  }
  return Object.freeze({ kind: "none" as const });
}

function observeProductMaterializationDeltaWithDiagnostics(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly before: SdlcProductMaterializationSnapshot;
}): ProductMaterializationObservationDelta {
  const after = snapshotProductMaterializationRoot(
    input.manifest.productMaterialization
  );
  const beforeByPath = snapshotByRelativePath(input.before);
  const observedByPath = new Map<string, SdlcMaterializedProductFile>();
  const diagnosticsByKey = new Map<
    string,
    SdlcWorkerResultMaterializationDiagnostic
  >();
  for (const file of after.files) {
    if (resolve(file.absolutePath) === resolve(input.manifest.outputFile)) {
      continue;
    }
    if (
      targetIgnoresExecutionByproducts(input.manifest.targetAssetType) &&
      (isExecutionByproductPath(file.relativePath) ||
        (targetAdmitsTestExecutionEvidence(input.manifest.targetAssetType) &&
          isExecutionGeneratedBuildPropertiesPath(file.relativePath)))
    ) {
      continue;
    }
    if (
      !input.manifest.productMaterialization.required &&
      isTenantLocalSdlcSurfaceRelativePath(file.relativePath)
    ) {
      continue;
    }
    const changed = beforeByPath.get(file.relativePath)?.digest !== file.digest;
    const priorAdmitted =
      input.manifest.productMaterialization.required && !changed
        ? priorAdmittedMaterializedFileForObservedFile({
            manifest: input.manifest,
            file
          })
        : !input.manifest.productMaterialization.required
          ? priorAdmittedMaterializedFileForObservedProductLineage({
              manifest: input.manifest,
              file
            })
          : Object.freeze({ kind: "none" as const });
    if (priorAdmitted.kind === "file") {
      if (input.manifest.productMaterialization.required) {
        if (
          effectiveProductMaterializationRequiredRoles(input.manifest).includes(
            priorAdmitted.file.role
          )
        ) {
          observedByPath.set(file.relativePath, priorAdmitted.file);
        }
      }
      continue;
    }
    if (priorAdmitted.kind === "diagnostic") {
      for (const diagnostic of priorAdmitted.diagnostics) {
        diagnosticsByKey.set(
          `${diagnostic.code}\n${diagnostic.detail}\n${diagnostic.evidenceRefs.join("\n")}`,
          diagnostic
        );
      }
      continue;
    }
    const priorRejected =
      !input.manifest.productMaterialization.required && !changed
        ? priorAdmittedMaterializedFileForObservedProductLineage({
            manifest: input.manifest,
            file,
            postflightStatus: "blocked"
          })
        : Object.freeze({ kind: "none" as const });
    if (priorRejected.kind === "file") {
      observedByPath.set(file.relativePath, priorRejected.file);
      continue;
    }
    if (priorRejected.kind === "diagnostic") {
      for (const diagnostic of priorRejected.diagnostics) {
        diagnosticsByKey.set(
          `${diagnostic.code}\n${diagnostic.detail}\n${diagnostic.evidenceRefs.join("\n")}`,
          diagnostic
        );
      }
      continue;
    }
    const priorPathAdmitted =
      input.manifest.productMaterialization.required && !changed
        ? priorAdmittedMaterializedFileForObservedPath({
            manifest: input.manifest,
            file
          })
        : Object.freeze({ kind: "none" as const });
    if (priorPathAdmitted.kind === "file") {
      observedByPath.set(file.relativePath, priorPathAdmitted.file);
      continue;
    }
    if (priorPathAdmitted.kind === "diagnostic") {
      for (const diagnostic of priorPathAdmitted.diagnostics) {
        diagnosticsByKey.set(
          `${diagnostic.code}\n${diagnostic.detail}\n${diagnostic.evidenceRefs.join("\n")}`,
          diagnostic
        );
      }
      continue;
    }
    const satisfiesRequiredRole = observedFileSatisfiesRequiredRole({
      manifest: input.manifest,
      file
    });
    if (!changed && !input.manifest.productMaterialization.required) {
      continue;
    }
    if (!changed && !satisfiesRequiredRole) {
      continue;
    }
    const materialized = materializedFileFromObservedFile({
      manifest: input.manifest,
      file
    });
    if (
      changed ||
      effectiveProductMaterializationRequiredRoles(input.manifest).includes(
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

export function observeProductMaterializationDelta(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly before: SdlcProductMaterializationSnapshot;
}): readonly SdlcMaterializedProductFile[] {
  return observeProductMaterializationDeltaWithDiagnostics(input).materializedFiles;
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

function executionEvidenceCandidatesFromTransformArtifact(input: {
  readonly content: string;
}): readonly unknown[] {
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
  return Object.freeze(candidates);
}

function executionEvidenceCandidatePresentInTransformArtifact(content: string): boolean {
  return executionEvidenceCandidatesFromTransformArtifact({ content }).some(
    (candidate) => {
      const normalized = normalizeExecutionEvidenceCandidate(candidate);
      const normalizedRecord = objectRecord(normalized);
      return (
        normalizedRecord !== null &&
        normalizedRecord["kind"] === "sdlc_worker_execution_evidence"
      );
    }
  );
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
      errors: executionEvidenceCandidatePresentInTransformArtifact(input.content)
        ? Object.freeze([
            "transform artifact carries sdlc_worker_execution_evidence on a non-execution edge"
          ])
        : Object.freeze([])
    });
  }
  const artifactRef = pathToFileURL(input.manifest.outputFile).href;
  const candidates = executionEvidenceCandidatesFromTransformArtifact({
    content: input.content
  });
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

function writeStableJsonFile(filePath: string, payload: unknown): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, stableOperatorJson(payload), "utf8");
}

function componentDepthSurfaceFile(
  manifest: SdlcWorkerHandoffManifest,
  targetAssetType: string
): string | null {
  const relativePath = tenantLocalSdlcSurfaceRelativePath(targetAssetType);
  if (relativePath === null) {
    return null;
  }
  return join(manifest.productMaterialization.tenantRoot, relativePath);
}

export function designDepthFpEvaluatorRegisterPath(
  manifest: SdlcWorkerHandoffManifest
): string {
  return join(manifest.archiveRoot, "design_depth_fp_evaluator_register.json");
}

function designDepthFpEvaluatorRegisterPathForArchiveRoot(
  archiveRoot: string
): string {
  return join(archiveRoot, "design_depth_fp_evaluator_register.json");
}

function shouldDeferImplementationDesignRegisterToFpEvaluator(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return (
    manifest.targetAssetType === "implementation_design_surface" &&
    !existsSync(designDepthFpEvaluatorRegisterPath(manifest))
  );
}

function decodedRefVariants(input: string): readonly string[] {
  const variants = [input];
  let current = input;
  for (let index = 0; index < 4; index += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) {
        break;
      }
      variants.push(decoded);
      current = decoded;
    } catch {
      break;
    }
  }
  return Object.freeze([...new Set(variants)]);
}

function operatorRunArchiveRootsFromRef(input: string): readonly string[] {
  const roots: string[] = [];
  for (const variant of decodedRefVariants(input)) {
    for (const match of variant.matchAll(
      /file:\/\/\/.*?\/operator-runs\/[0-9]{8}T[0-9]{9}Z(?:_pid[0-9]+)?/gu
    )) {
      const url = match[0];
      try {
        roots.push(fileURLToPath(url));
      } catch {
        continue;
      }
    }
  }
  return uniqueSorted(roots);
}

function implementationDesignSourceAssetRefs(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return uniqueSorted(
    manifest.traversalObligationContext.obligations
      .filter(
        (obligation) =>
          obligation.obligationKind === "source_asset" &&
          obligation.obligationId === "source_asset:implementation_design_surface"
      )
      .flatMap((obligation) => [
        ...obligation.evidenceRefs,
        ...obligation.payload.sourceRefs
      ])
  );
}

function predecessorDesignRegisterArchiveRoots(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return uniqueSorted(
    [
      ...manifest.traversalObligationContext.priorEdgeRefs,
      ...implementationDesignSourceAssetRefs(manifest)
    ].flatMap((ref) => operatorRunArchiveRootsFromRef(ref))
  );
}

function predecessorDesignRegisterArchiveMatchesCurrent(input: {
  readonly archiveRoot: string;
  readonly manifest: SdlcWorkerHandoffManifest;
}): boolean {
  const manifestPath = join(input.archiveRoot, "handoff_manifest.json");
  if (!existsSync(manifestPath) || !statSync(manifestPath).isFile()) {
    return false;
  }
  try {
    const record = parseOpenRecord(
      JSON.parse(readFileSync(manifestPath, "utf8")),
      "DesignDepthFpEvaluatorPredecessorHandoffManifest"
    );
    const productMaterialization = parseOpenRecord(
      record["productMaterialization"],
      "DesignDepthFpEvaluatorPredecessorHandoffManifest.productMaterialization"
    );
    return (
      record["targetAssetType"] === "implementation_design_surface" &&
      typeof record["workspaceRoot"] === "string" &&
      resolve(record["workspaceRoot"]) === resolve(input.manifest.workspaceRoot) &&
      typeof productMaterialization["tenantRoot"] === "string" &&
      resolve(productMaterialization["tenantRoot"]) ===
        resolve(input.manifest.productMaterialization.tenantRoot)
    );
  } catch {
    return false;
  }
}

function predecessorDesignDepthFpEvaluatorRegisterPaths(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  if (!manifest.inputAssetTypes.includes("implementation_design_surface")) {
    return Object.freeze([]);
  }
  return uniqueSorted(
    predecessorDesignRegisterArchiveRoots(manifest)
      .filter((archiveRoot) =>
        predecessorDesignRegisterArchiveMatchesCurrent({ archiveRoot, manifest })
      )
      .map(designDepthFpEvaluatorRegisterPathForArchiveRoot)
      .filter((filePath) => existsSync(filePath) && statSync(filePath).isFile())
  );
}

const DESIGN_DEPTH_FP_EVALUATOR_RULE_REF =
  "evaluation-rule://odd-sdlc/design-depth-register/fp";
const DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE =
  "design_depth_fp_evaluator_rule_outcome.json";

function nonEmptyStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function nullableStringValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return nonEmptyStringValue(value);
}

function refToExistingFilePath(ref: string): string | null {
  if (!ref.startsWith("file://")) {
    return null;
  }
  try {
    const filePath = fileURLToPath(ref);
    return existsSync(filePath) && statSync(filePath).isFile() ? filePath : null;
  } catch {
    return null;
  }
}

function selectedFpEvaluateResultEvidenceRefs(input: {
  readonly registerPath: string;
}): readonly string[] {
  const registerRef = pathToFileURL(input.registerPath).href;
  const fpEvaluateResultPath = join(dirname(input.registerPath), "fp_evaluate_result.json");
  if (!existsSync(fpEvaluateResultPath) || !statSync(fpEvaluateResultPath).isFile()) {
    return Object.freeze([]);
  }
  try {
    const record = parseOpenRecord(
      JSON.parse(readFileSync(fpEvaluateResultPath, "utf8")),
      "SdlcFpEvaluateResult"
    );
    if (
      record["kind"] !== "sdlc_fp_evaluate_result" ||
      record["stage"] !== "F_P.evaluate" ||
      record["computeNotationStage"] !== "evaluate.C" ||
      record["stageAuthority"] !== "typed_fp_stage_carriers" ||
      record["postflightStatus"] !== "passed" ||
      record["status"] === "blocked"
    ) {
      return Object.freeze([]);
    }
    const compositionRef = nonEmptyStringValue(record["compositionRef"]);
    const compositionDigest = nonEmptyStringValue(record["compositionDigest"]);
    const compositionSelectionRef = nonEmptyStringValue(
      record["compositionSelectionRef"]
    );
    const selectedRegimeBindingRef = nullableStringValue(
      record["selectedRegimeBindingRef"]
    );
    if (
      compositionRef === null ||
      compositionDigest === null ||
      compositionSelectionRef === null
    ) {
      return Object.freeze([]);
    }
    const selectedComposition = objectRecord(record["selectedComposition"]);
    if (
      selectedComposition === null ||
      selectedComposition["compositionRef"] !== compositionRef ||
      selectedComposition["compositionDigest"] !== compositionDigest ||
      selectedComposition["compositionSelectionRef"] !== compositionSelectionRef ||
      (selectedComposition["selectedRegimeBindingRef"] ?? null) !==
        selectedRegimeBindingRef
    ) {
      return Object.freeze([]);
    }
    const findings = Array.isArray(record["findings"])
      ? record["findings"]
      : Object.freeze([]);
    const matchingFindingRefs: string[] = [];
    for (const finding of findings) {
      const findingRecord = objectRecord(finding);
      if (findingRecord === null) {
        continue;
      }
      if (
        findingRecord["compositionRef"] !== compositionRef ||
        findingRecord["compositionDigest"] !== compositionDigest
      ) {
        continue;
      }
      const authorityRefs = stringListFromUnknown(findingRecord["authorityRefs"]);
      const evidenceRefs = stringListFromUnknown(findingRecord["evidenceRefs"]);
      if (
        !authorityRefs.includes(registerRef) &&
        !evidenceRefs.includes(registerRef)
      ) {
        continue;
      }
      const findingRef = nonEmptyStringValue(findingRecord["findingRef"]);
      if (findingRef !== null) {
        matchingFindingRefs.push(findingRef);
      }
      matchingFindingRefs.push(...authorityRefs, ...evidenceRefs);
    }
    if (matchingFindingRefs.length === 0) {
      return Object.freeze([]);
    }
    return uniqueSorted([
      pathToFileURL(fpEvaluateResultPath).href,
      registerRef,
      ...matchingFindingRefs
    ]);
  } catch {
    return Object.freeze([]);
  }
}

function runtimeEvaluationRuleOutcomeEvidenceRefs(input: {
  readonly registerPath: string;
  readonly explicitEvidenceRefs?: readonly string[] | undefined;
}): readonly string[] {
  const registerRef = pathToFileURL(input.registerPath).href;
  for (const ref of uniqueSorted(input.explicitEvidenceRefs ?? [])) {
    const filePath = refToExistingFilePath(ref);
    if (
      filePath === null ||
      filePath !== join(dirname(input.registerPath), DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE)
    ) {
      continue;
    }
    try {
      const record = parseOpenRecord(
        JSON.parse(readFileSync(filePath, "utf8")),
        "DesignDepthFpEvaluatorRuleOutcome"
      );
      if (
        record["kind"] !== "evaluation_rule_outcome" ||
        record["status"] !== "accepted" ||
        record["ruleRef"] !== DESIGN_DEPTH_FP_EVALUATOR_RULE_REF ||
        record["ruleRole"] !== "semantic_judgment" ||
        record["computeMeans"] !== "F_P"
      ) {
        continue;
      }
      const producedRegisterRefs = stringListFromUnknown(
        record["producedRegisterRefs"]
      );
      if (!producedRegisterRefs.includes(registerRef)) {
        continue;
      }
      const selectedCompositionRef = nonEmptyStringValue(
        record["selectedCompositionRef"]
      );
      const selectedCompositionDigest = nonEmptyStringValue(
        record["selectedCompositionDigest"]
      );
      const selectedCompositionSelectionRef = nonEmptyStringValue(
        record["selectedCompositionSelectionRef"]
      );
      if (
        selectedCompositionRef === null ||
        selectedCompositionDigest === null ||
        selectedCompositionSelectionRef === null
      ) {
        continue;
      }
      return uniqueSorted([
        ref,
        registerRef,
        ...producedRegisterRefs,
        ...stringListFromUnknown(record["evidenceRefs"]),
        ...stringListFromUnknown(record["findingRefs"])
      ]);
    } catch {
      continue;
    }
  }
  return Object.freeze([]);
}

function admittedDesignDepthFpEvaluatorRegisterEvidenceRefs(
  manifest: SdlcWorkerHandoffManifest,
  fpEvaluatorAdmissionEvidenceRefs: readonly string[] = Object.freeze([])
): readonly string[] {
  const admission =
    fpEvaluatorAdmissionEvidenceRefs.length > 0
      ? admitImplementationDesignRegisterForRuntimeEvaluation({
          manifest,
          fpEvaluatorAdmissionEvidenceRefs
        })
      : admitImplementationDesignRegisterForManifest({
          manifest
        });
  return admission.status === "admitted"
    ? admission.evidenceRefs
    : Object.freeze([]);
}

function implementationDesignRegisterPathsForManifest(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const currentEvaluatorRegisterPath = designDepthFpEvaluatorRegisterPath(manifest);
  return manifest.targetAssetType === "implementation_design_surface" &&
    existsSync(currentEvaluatorRegisterPath)
    ? Object.freeze([currentEvaluatorRegisterPath])
    : predecessorDesignDepthFpEvaluatorRegisterPaths(manifest);
}

function admitSingleImplementationDesignRegisterPath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly evaluatorRegisterPath: string;
  readonly fpEvaluatorAdmissionEvidenceRefs?: readonly string[] | undefined;
}): SdlcDesignDepthRegisterAdmission {
  const admission = admitDesignDepthRegisterFromArtifact({
    targetAssetType: "implementation_design_surface",
    outputFile: input.evaluatorRegisterPath,
    archiveRoot: input.manifest.archiveRoot,
    requireSourceFileTargets: true
  });
  return admission.status === "admitted"
    ? Object.freeze({
        ...admission,
        evidenceRefs: uniqueSorted([
          ...admission.evidenceRefs,
          ...(input.fpEvaluatorAdmissionEvidenceRefs ?? [])
        ])
      })
    : admission;
}

export function admitDesignDepthFpEvaluatorRegisterArtifact(input: {
  readonly registerPath: string;
  readonly archiveRoot?: string | null | undefined;
}): SdlcDesignDepthRegisterAdmission {
  const admission = admitDesignDepthRegisterFromArtifact({
    targetAssetType: "implementation_design_surface",
    outputFile: input.registerPath,
    archiveRoot: input.archiveRoot ?? null,
    requireSourceFileTargets: true
  });
  if (admission.status !== "admitted") {
    return admission;
  }
  const fpEvaluatorAdmissionEvidenceRefs = selectedFpEvaluateResultEvidenceRefs({
    registerPath: input.registerPath
  });
  if (fpEvaluatorAdmissionEvidenceRefs.length === 0) {
    return Object.freeze({
      kind: "sdlc_design_depth_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: "implementation_design_surface",
      register: null,
      blockingReasons: Object.freeze([
        "design_depth_fp_evaluator_register_unadmitted"
      ]),
      evidenceRefs: Object.freeze([pathToFileURL(input.registerPath).href])
    });
  }
  return Object.freeze({
    ...admission,
    evidenceRefs: uniqueSorted([
      ...admission.evidenceRefs,
      ...fpEvaluatorAdmissionEvidenceRefs
    ])
  });
}

export function admitImplementationDesignRegisterCandidateForManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
}): SdlcDesignDepthRegisterAdmission {
  const currentEvaluatorRegisterPath = designDepthFpEvaluatorRegisterPath(
    input.manifest
  );
  return admitSingleImplementationDesignRegisterPath({
    manifest: input.manifest,
    evaluatorRegisterPath: currentEvaluatorRegisterPath
  });
}

export function admitImplementationDesignRegisterForRuntimeEvaluation(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly fpEvaluatorAdmissionEvidenceRefs?: readonly string[] | undefined;
}): SdlcDesignDepthRegisterAdmission {
  const currentEvaluatorRegisterPath = designDepthFpEvaluatorRegisterPath(
    input.manifest
  );
  const evaluatorRegisterPaths = implementationDesignRegisterPathsForManifest(
    input.manifest
  );
  if (evaluatorRegisterPaths.length > 1) {
    return Object.freeze({
      kind: "sdlc_design_depth_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: "implementation_design_surface",
      register: null,
      blockingReasons: Object.freeze([
        "design_depth_fp_evaluator_register_ambiguous"
      ]),
      evidenceRefs: Object.freeze(
        evaluatorRegisterPaths.map((filePath) => pathToFileURL(filePath).href)
      )
    });
  }
  const evaluatorRegisterPath = evaluatorRegisterPaths[0] ?? null;
  if (evaluatorRegisterPath !== null) {
    const structuralAdmission = admitSingleImplementationDesignRegisterPath({
      manifest: input.manifest,
      evaluatorRegisterPath
    });
    if (structuralAdmission.status !== "admitted") {
      return structuralAdmission;
    }
    const fpEvaluatorAdmissionEvidenceRefs =
      runtimeEvaluationRuleOutcomeEvidenceRefs({
        registerPath: evaluatorRegisterPath,
        explicitEvidenceRefs: input.fpEvaluatorAdmissionEvidenceRefs
      });
    if (fpEvaluatorAdmissionEvidenceRefs.length === 0) {
      return Object.freeze({
        kind: "sdlc_design_depth_register_admission" as const,
        status: "rejected" as const,
        targetAssetType: "implementation_design_surface",
        register: null,
        blockingReasons: Object.freeze([
          "design_depth_fp_evaluator_register_unadmitted"
        ]),
        evidenceRefs: Object.freeze([pathToFileURL(evaluatorRegisterPath).href])
      });
    }
    return Object.freeze({
      ...structuralAdmission,
      evidenceRefs: uniqueSorted([
        ...structuralAdmission.evidenceRefs,
        ...fpEvaluatorAdmissionEvidenceRefs
      ])
    });
  }
  return Object.freeze({
    kind: "sdlc_design_depth_register_admission" as const,
    status: "rejected" as const,
    targetAssetType: "implementation_design_surface",
    register: null,
    blockingReasons: Object.freeze([
      "design_depth_fp_evaluator_register_missing"
    ]),
    evidenceRefs: Object.freeze([
      pathToFileURL(currentEvaluatorRegisterPath).href
    ])
  });
}

export function admitImplementationDesignRegisterForManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
}): SdlcDesignDepthRegisterAdmission {
  const currentEvaluatorRegisterPath = designDepthFpEvaluatorRegisterPath(
    input.manifest
  );
  const evaluatorRegisterPaths = implementationDesignRegisterPathsForManifest(
    input.manifest
  );
  if (evaluatorRegisterPaths.length > 1) {
    return Object.freeze({
      kind: "sdlc_design_depth_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: "implementation_design_surface",
      register: null,
      blockingReasons: Object.freeze([
        "design_depth_fp_evaluator_register_ambiguous"
      ]),
      evidenceRefs: Object.freeze(
        evaluatorRegisterPaths.map((filePath) => pathToFileURL(filePath).href)
      )
    });
  }
  const evaluatorRegisterPath = evaluatorRegisterPaths[0] ?? null;
  if (evaluatorRegisterPath !== null) {
    const structuralAdmission = admitSingleImplementationDesignRegisterPath({
      manifest: input.manifest,
      evaluatorRegisterPath
    });
    if (structuralAdmission.status !== "admitted") {
      return structuralAdmission;
    }
    const fpEvaluatorAdmissionEvidenceRefs = selectedFpEvaluateResultEvidenceRefs({
      registerPath: evaluatorRegisterPath
    });
    if (fpEvaluatorAdmissionEvidenceRefs.length === 0) {
      return Object.freeze({
        kind: "sdlc_design_depth_register_admission" as const,
        status: "rejected" as const,
        targetAssetType: "implementation_design_surface",
        register: null,
        blockingReasons: Object.freeze([
          "design_depth_fp_evaluator_register_unadmitted"
        ]),
        evidenceRefs: Object.freeze([pathToFileURL(evaluatorRegisterPath).href])
      });
    }
    return Object.freeze({
      ...structuralAdmission,
      evidenceRefs: uniqueSorted([
        ...structuralAdmission.evidenceRefs,
        ...fpEvaluatorAdmissionEvidenceRefs
      ])
    });
  }
  return Object.freeze({
    kind: "sdlc_design_depth_register_admission" as const,
    status: "rejected" as const,
    targetAssetType: "implementation_design_surface",
    register: null,
    blockingReasons: Object.freeze([
      "design_depth_fp_evaluator_register_missing"
    ]),
    evidenceRefs: Object.freeze([
      pathToFileURL(currentEvaluatorRegisterPath).href
    ])
  });
}

function readAdmittedComponentDepthSurface(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly targetAssetType: string;
}): SdlcComponentDepthRegister | null {
  const outputFile = componentDepthSurfaceFile(
    input.manifest,
    input.targetAssetType
  );
  if (outputFile === null || !existsSync(outputFile)) {
    return null;
  }
  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: input.targetAssetType,
    outputFile
  });
  return admission.status === "admitted" ? admission.register : null;
}

function readAdmittedImplementationDesign(
  manifest: SdlcWorkerHandoffManifest,
  fpEvaluatorAdmissionEvidenceRefs: readonly string[] = Object.freeze([])
): SdlcDesignDepthRegister | null {
  const admission =
    fpEvaluatorAdmissionEvidenceRefs.length > 0
      ? admitImplementationDesignRegisterForRuntimeEvaluation({
          manifest,
          fpEvaluatorAdmissionEvidenceRefs
        })
      : admitImplementationDesignRegisterForManifest({
          manifest
        });
  return admission.status === "admitted" ? admission.register : null;
}

function readAdmittedTestDesign(
  manifest: SdlcWorkerHandoffManifest
): SdlcTestDesignRegister | null {
  const outputFile = componentDepthSurfaceFile(manifest, "test_design_surface");
  if (outputFile === null || !existsSync(outputFile)) {
    return null;
  }
  const admission = admitTestDesignRegisterFromArtifact({
    targetAssetType: "test_design_surface",
    outputFile
  });
  return admission.status === "admitted" ? admission.register : null;
}

function baseComponentDepthRegister(input: {
  readonly targetAssetType: string;
  readonly componentTopologyRows?: readonly SdlcComponentDepthRegister["componentTopologyRows"][number][];
  readonly componentRealizationRows?: readonly SdlcComponentRealizationRow[];
  readonly componentTestRows?: readonly SdlcComponentTestRealizationRow[];
  readonly componentTestQualificationRows?: readonly SdlcComponentTestQualificationRow[];
  readonly componentExecutionFailureRegister?: SdlcComponentExecutionFailureRegister | null;
  readonly componentRepairSchedule?: SdlcComponentRepairSchedule | null;
  readonly releaseDepthParity?: SdlcComponentDepthRegister["releaseDepthParity"];
}): SdlcComponentDepthRegister {
  return Object.freeze({
    kind: "sdlc_component_depth_register" as const,
    registerVersion: "ts-component-depth-v1" as const,
    targetAssetType: input.targetAssetType,
    componentTopologyRows: Object.freeze([
      ...(input.componentTopologyRows ?? [])
    ]),
    componentRealizationRows: Object.freeze([
      ...(input.componentRealizationRows ?? [])
    ]),
    testComponentTopologyRows: Object.freeze([]),
    componentTestRows: Object.freeze([...(input.componentTestRows ?? [])]),
    componentTestQualificationRows: Object.freeze([
      ...(input.componentTestQualificationRows ?? [])
    ]),
    componentExecutionFailureRegister:
      input.componentExecutionFailureRegister ?? null,
    componentRepairSchedule: input.componentRepairSchedule ?? null,
    releaseDepthParity: input.releaseDepthParity ?? null
  });
}

function latestExecutionResultReportRefs(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const operatorRunsRoot = join(
    manifest.workspaceRoot,
    deriveSdlcConformProjectProfileFromWorkspace(manifest.workspaceRoot)
      .runtimeLayout.operatorRunRoot
  );
  if (!existsSync(operatorRunsRoot) || !statSync(operatorRunsRoot).isDirectory()) {
    return Object.freeze([]);
  }
  const reports: { readonly filePath: string; readonly mtimeMs: number }[] = [];
  for (const runId of readdirSync(operatorRunsRoot)) {
    const filePath = join(operatorRunsRoot, runId, "worker_result_report.json");
    if (
      resolve(filePath) === resolve(manifest.reportFile) ||
      !existsSync(filePath) ||
      !statSync(filePath).isFile()
    ) {
      continue;
    }
    try {
      const record = readArchivedWorkerResultReportRecord({
        filePath,
        label: "LatestExecutionResultReport"
      });
      if (
        record["targetAssetType"] === "test_execution_result_surface"
      ) {
        reports.push(Object.freeze({ filePath, mtimeMs: statSync(filePath).mtimeMs }));
      }
    } catch {
      continue;
    }
  }
  return Object.freeze(
    reports
      .sort((left, right) => right.mtimeMs - left.mtimeMs)
      .map((report) => pathToFileURL(report.filePath).href)
  );
}

function latestAdmittedExecutionEvidence(
  manifest: SdlcWorkerHandoffManifest
): SdlcWorkerExecutionEvidence | null {
  for (const ref of latestExecutionResultReportRefs(manifest)) {
    const readResult = readExecutionResultEvidenceFromReportRef(ref);
    if (readResult.executionEvidence !== null) {
      return readResult.executionEvidence;
    }
  }
  return null;
}

function sanitizedCarrierId(input: string): string {
  const sanitized = input
    .trim()
    .replace(/[^A-Za-z0-9_.:-]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  return sanitized.length > 0 ? sanitized : "unnamed";
}

function testRefForRow(
  manifest: SdlcWorkerHandoffManifest,
  row: SdlcComponentTestRealizationRow
): string {
  const normalizedRelativePath = path.normalize(row.relativePath);
  const selectedOutputRoot = path.normalize(
    manifest.productMaterialization.selectedOutputRoot
  );
  const absolutePath = isAbsolute(normalizedRelativePath)
    ? normalizedRelativePath
    : normalizedRelativePath === selectedOutputRoot ||
        normalizedRelativePath.startsWith(`${selectedOutputRoot}${path.sep}`)
      ? join(manifest.workspaceRoot, normalizedRelativePath)
      : join(manifest.productMaterialization.tenantRoot, normalizedRelativePath);
  return pathToFileURL(absolutePath).href;
}

function failureKindForExecutionEvidence(
  evidence: SdlcWorkerExecutionEvidence | null
): SdlcComponentExecutionFailureRow["failureKind"] {
  if (evidence === null || evidence.status === "pending") {
    return "execution_evidence_missing";
  }
  if ((evidence.failedCount ?? 0) > 0) {
    return "assertion_failure";
  }
  return evidence.status === "failed" ? "runtime_exception" : "triage_gap";
}

function failureRowsForComponentTests(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly componentTestRows: readonly SdlcComponentTestRealizationRow[];
  readonly executionEvidence: SdlcWorkerExecutionEvidence | null;
}): readonly SdlcComponentExecutionFailureRow[] {
  if (
    input.executionEvidence?.status === "succeeded" &&
    (input.executionEvidence.failedCount ?? 0) === 0 &&
    (input.executionEvidence.testsObserved ?? 0) > 0
  ) {
    return Object.freeze([]);
  }
  const evidenceRefs =
    input.executionEvidence?.reportRefs ??
    Object.freeze([pathToFileURL(input.manifest.outputFile).href]);
  const failureKind = failureKindForExecutionEvidence(input.executionEvidence);
  const rows =
    input.componentTestRows.length > 0
      ? input.componentTestRows
      : Object.freeze([
          {
            kind: "sdlc_component_test_realization_row" as const,
            testClassId: "component-test-surface-missing",
            relativePath: "design/component_test_surface.md",
            testcaseIds: Object.freeze([]),
            componentIds: Object.freeze([]),
            requirementIds: Object.freeze([]),
            shardId: null
          }
        ]);
  return Object.freeze(
    rows.map((row, index) => {
      const shardId =
        row.shardId ??
        input.executionEvidence?.shardEvidence[index]?.shardId ??
        input.executionEvidence?.shardEvidence[0]?.shardId ??
        "unsharded";
      return Object.freeze({
        kind: "sdlc_component_execution_failure_row" as const,
        failureId: `failure:${sanitizedCarrierId(row.testClassId)}:${sanitizedCarrierId(shardId)}`,
        shardId,
        moduleName:
          input.executionEvidence?.shardEvidence.find(
            (shard) => shard.shardId === shardId
          )?.moduleName ?? "component-test",
        testClassId: row.testClassId,
        testcaseIds: row.testcaseIds,
        componentIds: row.componentIds,
        requirementIds: row.requirementIds,
        failureKind,
        repairTarget:
          failureKind === "execution_evidence_missing"
            ? "test_execution_surface"
            : "component_code",
        lawfulReentryPoint: "repair_worker_output",
        attributionConfidence: "medium" as const,
        sourceRefs: Object.freeze(row.componentIds.map((id) => `component:${id}`)),
        testRefs: Object.freeze([testRefForRow(input.manifest, row)]),
        evidenceRefs
      });
    })
  );
}

function qualificationRowsForComponentTests(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly componentTestRows: readonly SdlcComponentTestRealizationRow[];
  readonly executionEvidence: SdlcWorkerExecutionEvidence | null;
}): readonly SdlcComponentTestQualificationRow[] {
  function statusForEvidence(
    evidence: SdlcWorkerExecutionEvidence | SdlcWorkerExecutionShardEvidence | null
  ): SdlcComponentTestQualificationRow["status"] {
    return evidence === null
      ? "unproven"
      : evidence.status === "pending"
        ? "pending"
        : evidence.status === "failed"
          ? "failed"
          : (evidence.failedCount ?? 0) === 0 &&
              (evidence.testsObserved ?? 0) > 0
            ? "passed"
            : "blocked";
  }
  function evidenceForRow(
    row: SdlcComponentTestRealizationRow,
    index: number
  ): SdlcWorkerExecutionEvidence | SdlcWorkerExecutionShardEvidence | null {
    if (input.executionEvidence === null) {
      return null;
    }
    return (
      input.executionEvidence.shardEvidence.find(
        (shard) => row.shardId !== null && shard.shardId === row.shardId
      ) ??
      input.executionEvidence.shardEvidence[index] ??
      input.executionEvidence
    );
  }
  return Object.freeze(
    input.componentTestRows.map((row, index) => {
      const evidence = evidenceForRow(row, index);
      const evidenceRefs =
        evidence?.reportRefs ??
        input.executionEvidence?.reportRefs ??
        Object.freeze([pathToFileURL(input.manifest.outputFile).href]);
      return Object.freeze({
        kind: "sdlc_component_test_qualification_row" as const,
        testClassId: row.testClassId,
        testcaseIds: row.testcaseIds,
        componentIds: row.componentIds,
        requirementIds: row.requirementIds,
        status: statusForEvidence(evidence),
        evidenceRefs
      });
    })
  );
}

function repairScheduleForFailures(
  failureRows: readonly SdlcComponentExecutionFailureRow[],
  evidenceRefs: readonly string[]
): SdlcComponentRepairSchedule {
  return Object.freeze({
    kind: "sdlc_component_repair_schedule" as const,
    registerVersion: "ts-component-depth-v1" as const,
    scheduleStatus:
      failureRows.length > 0 ? "repair_required" as const : "no_repair_required" as const,
    repairRows: Object.freeze(
      failureRows.map((row) =>
        Object.freeze({
          kind: "sdlc_component_repair_schedule_row" as const,
          scheduleId: `repair:${sanitizedCarrierId(row.failureId)}`,
          failureId: row.failureId,
          repairTarget: row.repairTarget,
          lawfulReentryPoint: row.lawfulReentryPoint,
          attributionConfidence: row.attributionConfidence,
          testcaseIds: row.testcaseIds,
          componentIds: row.componentIds,
          requirementIds: row.requirementIds,
          sourceRefs: row.sourceRefs,
          testRefs: row.testRefs,
          evidenceRefs: row.evidenceRefs
        })
      )
    ),
    evidenceRefs: uniqueSorted([
      ...evidenceRefs,
      ...failureRows.flatMap((row) => row.evidenceRefs)
    ])
  });
}

function latestAdmittedTestExecutionSurfaceRegister(
  manifest: SdlcWorkerHandoffManifest
): SdlcTestExecutionSurfaceRegister | null {
  const operatorRunsRoot = join(
    manifest.workspaceRoot,
    deriveSdlcConformProjectProfileFromWorkspace(manifest.workspaceRoot)
      .runtimeLayout.operatorRunRoot
  );
  if (!existsSync(operatorRunsRoot) || !statSync(operatorRunsRoot).isDirectory()) {
    return null;
  }
  const reports: { readonly filePath: string; readonly mtimeMs: number }[] = [];
  for (const runId of readdirSync(operatorRunsRoot)) {
    const filePath = join(operatorRunsRoot, runId, "worker_result_report.json");
    if (
      resolve(filePath) === resolve(manifest.reportFile) ||
      !existsSync(filePath) ||
      !statSync(filePath).isFile()
    ) {
      continue;
    }
    try {
      const record = readArchivedWorkerResultReportRecord({
        filePath,
        label: "PriorTestExecutionSurfaceReport"
      });
      if (record["targetAssetType"] === "test_execution_surface") {
        reports.push(Object.freeze({ filePath, mtimeMs: statSync(filePath).mtimeMs }));
      }
    } catch {
      continue;
    }
  }
  for (const report of reports.sort((left, right) => right.mtimeMs - left.mtimeMs)) {
    try {
      const record = readArchivedWorkerResultReportRecord({
        filePath: report.filePath,
        label: "PriorTestExecutionSurfaceReport"
      });
      const outputFile = parseNonEmptyString(
        record["outputFile"],
        "PriorTestExecutionSurfaceReport.outputFile"
      );
      const admission = admitTestExecutionSurfaceRegisterFromArtifact({
        targetAssetType: "test_execution_surface",
        outputFile
      });
      if (admission.status === "admitted") {
        return admission.register;
      }
    } catch {
      continue;
    }
  }
  return null;
}

function testExecutionFrameworkRef(manifest: SdlcWorkerHandoffManifest): string {
  const testDesign = readAdmittedTestDesign(manifest);
  const profileRef = testDesign?.testStackProfileRows[0]?.frameworkRef;
  if (profileRef !== undefined && profileRef.length > 0) {
    return profileRef;
  }
  const command = manifest.productMaterialization.testExecutionContract.toLowerCase();
  if (command.includes("sbt")) {
    return "framework://sbt";
  }
  if (command.includes("npm")) {
    return "framework://npm";
  }
  if (command.includes("node")) {
    return "framework://node-test";
  }
  return "framework://declared-test-runner";
}

function workspaceRelativeExecutionDirectory(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly workingDirectory: string;
}): string {
  const workspaceRoot = resolve(input.manifest.workspaceRoot);
  const workingDirectory = resolve(input.workingDirectory);
  if (pathIsInside(workingDirectory, workspaceRoot)) {
    return relative(workspaceRoot, workingDirectory).split(path.sep).join("/");
  }
  return input.workingDirectory;
}

function testExecutionPreparationRowsForManifest(
  manifest: SdlcWorkerHandoffManifest
): readonly SdlcTestExecutionPreparationRow[] {
  const testDesign = readAdmittedTestDesign(manifest);
  const frameworkRef = testExecutionFrameworkRef(manifest);
  const fallbackRequirementIds: readonly string[] = Object.freeze([]);
  const rowsFromShard = manifest.productMaterialization.executionShards.map(
    (shard): SdlcTestExecutionPreparationRow => {
      const matchingTopologyRows = Object.freeze(
        testDesign?.testComponentTopologyRows.filter(
          (row) =>
            row.shardId === shard.shardId ||
            row.componentIds.includes(shard.moduleName)
        ) ?? []
      );
      const matchingSchedule = testDesign?.testExecutionScheduleRows.find(
        (row) => row.shardId === shard.shardId || row.command === shard.command
      );
      const testClassId =
        matchingTopologyRows[0]?.testClassId ??
        `test-class://${manifest.productMaterialization.activeTenant}/${shardIdPart(
          shard.moduleName
        )}`;
      const sourceTestFileRefs = uniqueSorted(
        matchingTopologyRows.map((row) => `workspace://${row.relativePath}`)
      );
      return Object.freeze({
        kind: "sdlc_test_execution_preparation_row" as const,
        scheduleRef:
          matchingSchedule?.scheduleRef ??
          `test-schedule://${manifest.productMaterialization.activeTenant}/${shard.shardId}`,
        moduleName: shard.moduleName,
        testClassId,
        testcaseIds: uniqueSorted(
          matchingTopologyRows.flatMap((row) => row.testcaseIds)
        ),
        command: shard.command,
        workingDirectory: workspaceRelativeExecutionDirectory({
          manifest,
          workingDirectory: shard.workingDirectory
        }),
        frameworkRef: matchingSchedule?.frameworkRef ?? frameworkRef,
        shardId: shard.shardId,
        sourceTestFileRefs,
        requirementIds:
          matchingTopologyRows.length === 0
            ? fallbackRequirementIds
            : uniqueSorted(matchingTopologyRows.flatMap((row) => row.requirementIds)),
        status: "prepared" as const,
        evidenceRefs: uniqueSorted([
          pathToFileURL(manifest.outputFile).href,
          ...sourceTestFileRefs,
          ...shard.expectedReportRefs
        ])
      });
    }
  );
  if (rowsFromShard.length > 0) {
    return Object.freeze(rowsFromShard);
  }
  const command = manifest.productMaterialization.testExecutionContract.trim();
  return Object.freeze([
    Object.freeze({
      kind: "sdlc_test_execution_preparation_row" as const,
      scheduleRef: `test-schedule://${manifest.productMaterialization.activeTenant}/declared`,
      moduleName: manifest.productMaterialization.activeTenant,
      testClassId: `test-class://${manifest.productMaterialization.activeTenant}/declared`,
      testcaseIds: Object.freeze([]),
      command: command.length === 0 ? "undeclared" : command,
      workingDirectory: manifest.productMaterialization.selectedOutputRoot,
      frameworkRef,
      shardId: null,
      sourceTestFileRefs: Object.freeze([]),
      requirementIds: fallbackRequirementIds,
      status: command.length === 0 ? "blocked" as const : "prepared" as const,
      evidenceRefs: Object.freeze([pathToFileURL(manifest.outputFile).href])
    })
  ]);
}

function writeInstalledOperatorTestExecutionSurface(
  manifest: SdlcWorkerHandoffManifest
): void {
  const preparationRows = testExecutionPreparationRowsForManifest(manifest);
  writeStableJsonFile(
    manifest.outputFile,
    Object.freeze({
      kind: "sdlc_test_execution_surface_register" as const,
      registerVersion: "ts-test-execution-v1" as const,
      targetAssetType: "test_execution_surface" as const,
      testExecutionPreparationRows: preparationRows,
      evidenceRefs: uniqueSorted([
        pathToFileURL(manifest.outputFile).href,
        ...preparationRows.flatMap((row) => row.evidenceRefs)
      ]),
      summary: "Framework-prepared test execution surface from declared shards."
    } satisfies SdlcTestExecutionSurfaceRegister)
  );
}

function writeInstalledOperatorTestRunArchiveSurface(
  manifest: SdlcWorkerHandoffManifest
): void {
  const executionResultReportRefs = latestExecutionResultReportRefs(manifest);
  const executionEvidenceLines = executionResultReportRefs.flatMap((ref) => {
    const readResult = readExecutionResultEvidenceFromReportRef(ref);
    if (readResult.executionEvidence === null) {
      return [`- ${ref} status=invalid detail=${readResult.error ?? "missing"}`];
    }
    const evidence = readResult.executionEvidence;
    return [
      [
        `- ${ref}`,
        `status=${evidence.status}`,
        `command=${evidence.command}`,
        `testsObserved=${evidence.testsObserved ?? "n/a"}`,
        `passed=${evidence.passedCount ?? "n/a"}`,
        `failed=${evidence.failedCount ?? "n/a"}`
      ].join(" ")
    ];
  });
  const content = [
    "# test_run_archive_surface",
    "",
    "source_function: installed_operator.writeInstalledOperatorTestRunArchiveSurface",
    "worker_dispatch_allowed: false",
    "",
    "Archived dependencies:",
    ...manifest.inputAssetTypes.map((assetType) => `- ${assetType}`),
    "",
    "Execution result report refs:",
    ...(executionResultReportRefs.length === 0
      ? ["- none"]
      : executionResultReportRefs.map((ref) => `- ${ref}`)),
    "",
    "Execution evidence:",
    ...(executionEvidenceLines.length === 0 ? ["- none"] : executionEvidenceLines),
    ""
  ].join("\n");
  mkdirSync(dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, content, "utf8");
}

function resolvePreparedExecutionWorkingDirectory(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly workingDirectory: string;
}): string {
  if (isAbsolute(input.workingDirectory)) {
    return input.workingDirectory;
  }
  return resolve(input.manifest.workspaceRoot, input.workingDirectory);
}

function installedOperatorExecutionShards(
  manifest: SdlcWorkerHandoffManifest
): SdlcProductMaterializationContract["executionShards"] {
  if (manifest.targetAssetType !== "test_execution_result_surface") {
    return manifest.productMaterialization.executionShards;
  }
  const register = latestAdmittedTestExecutionSurfaceRegister(manifest);
  const preparedRows =
    register?.testExecutionPreparationRows.filter((row) => row.status === "prepared") ??
    Object.freeze([]);
  if (preparedRows.length === 0) {
    return manifest.productMaterialization.executionShards;
  }
  return Object.freeze(
    preparedRows.map((row, index) =>
      Object.freeze({
        kind: "sdlc_execution_shard" as const,
        shardId:
          row.shardId ??
          `test-shard-${String(index + 1).padStart(2, "0")}-${shardIdPart(row.moduleName)}`,
        lane: "test" as const,
        moduleName: row.moduleName,
        command: row.command,
        workingDirectory: resolvePreparedExecutionWorkingDirectory({
          manifest,
          workingDirectory: row.workingDirectory
        }),
        timeoutMs: DEFAULT_EXECUTION_SHARD_TIMEOUT_MS,
        inactivityTimeoutMs: DEFAULT_EXECUTION_SHARD_INACTIVITY_TIMEOUT_MS,
        expectedReportRefs: Object.freeze([row.scheduleRef]),
        allowedByproductGlobs: Object.freeze(["target/**", ".bsp/**"]),
        requiredEvidenceKind: "sdlc_worker_execution_evidence" as const,
        retryPolicy: "same_shard_then_triage" as const
      })
    )
  );
}

function installedOperatorShardTimeoutMs(shardTimeoutMs: number): number {
  const override = Number.parseInt(
    process.env["ODD_SDLC_INSTALLED_OPERATOR_SHARD_TIMEOUT_MS"] ?? "",
    10
  );
  if (Number.isFinite(override) && override > 0) {
    return Math.min(shardTimeoutMs, override);
  }
  return shardTimeoutMs;
}

const INSTALLED_OPERATOR_SHARD_RUNNER_SOURCE = `
const { spawn } = require("node:child_process");
const input = JSON.parse(process.argv[1]);
const child = spawn(input.command, {
  cwd: input.cwd,
  shell: true,
  detached: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: input.env
});
let stdout = "";
let stderr = "";
let timedOut = false;
let settled = false;
function killGroup(signal) {
  try {
    process.kill(-child.pid, signal);
  } catch {}
}
function finish(result) {
  if (settled) return;
  settled = true;
  clearTimeout(timeoutTimer);
  clearTimeout(forceKillTimer);
  clearTimeout(forceFinishTimer);
  process.stdout.write(JSON.stringify({ ...result, stdout, stderr }));
}
const timeoutTimer = setTimeout(() => {
  timedOut = true;
  killGroup("SIGTERM");
}, input.timeoutMs);
const forceKillTimer = setTimeout(() => {
  if (timedOut) killGroup("SIGKILL");
}, input.timeoutMs + 1000);
const forceFinishTimer = setTimeout(() => {
  finish({ status: null, signal: "SIGKILL", error: "timeout", timedOut: true });
}, input.timeoutMs + 3000);
child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
child.on("error", (error) => {
  finish({ status: null, signal: null, error: error.message, timedOut });
});
child.on("close", (status, signal) => {
  finish({ status, signal, error: null, timedOut });
});
`;

function runInstalledOperatorShardCommand(input: {
  readonly command: string;
  readonly cwd: string;
  readonly timeoutMs: number;
}): {
  readonly status: number | null;
  readonly signal: string | null;
  readonly error: string | null;
  readonly timedOut: boolean;
  readonly stdout: string;
  readonly stderr: string;
} {
  const env = installedOperatorShardEnvironment();
  const result = executeSdlcProcessRunPlan(
    constructSdlcProcessRunPlan({
      command: process.execPath,
      args: Object.freeze([
        "-e",
        INSTALLED_OPERATOR_SHARD_RUNNER_SOURCE,
        JSON.stringify({
          command: input.command,
          cwd: input.cwd,
          timeoutMs: input.timeoutMs,
          env
        })
      ]),
      cwd: input.cwd,
      env,
      maxBufferBytes: 1024 * 1024 * 20,
      timeoutMs: input.timeoutMs + 5000
    })
  );
  const raw = result.stdout.trim();
  if (raw.length > 0) {
    try {
      const record = parseOpenRecord(JSON.parse(raw), "InstalledOperatorShardRun");
      return Object.freeze({
        status:
          typeof record["status"] === "number" ? record["status"] : null,
        signal:
          typeof record["signal"] === "string" ? record["signal"] : null,
        error:
          typeof record["error"] === "string" ? record["error"] : null,
        timedOut: record["timedOut"] === true,
        stdout: typeof record["stdout"] === "string" ? record["stdout"] : "",
        stderr: typeof record["stderr"] === "string" ? record["stderr"] : ""
      });
    } catch {
      // Fall through to the wrapper-level result below.
    }
  }
  return Object.freeze({
    status: result.status,
    signal: result.signal,
    error: result.errorMessage,
    timedOut: result.errorMessage === "spawnSync node ETIMEDOUT",
    stdout: result.stdout,
    stderr: result.stderr
  });
}

function installedOperatorShardEnvironment(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value !== "string") {
      continue;
    }
    if (key === "NODE_TEST_CONTEXT") {
      continue;
    }
    env[key] = value;
  }
  return env;
}

function writeInstalledOperatorExecutionEvidence(
  manifest: SdlcWorkerHandoffManifest
): void {
  const shards = installedOperatorExecutionShards(manifest);
  const reportRefs: string[] = [];
  const shardEvidence: SdlcWorkerExecutionShardEvidence[] = [];
  for (const shard of shards) {
    const result = runInstalledOperatorShardCommand({
      command: shard.command,
      cwd: shard.workingDirectory,
      timeoutMs: installedOperatorShardTimeoutMs(shard.timeoutMs)
    });
    const shardRoot = `installed_operator_execution/${sanitizedCarrierId(shard.shardId)}`;
    const stdoutPath = writeOperatorArchiveFile({
      archiveRoot: manifest.archiveRoot,
      relativePath: `${shardRoot}.stdout.log`,
      payload: result.stdout ?? ""
    });
    const stderrPath = writeOperatorArchiveFile({
      archiveRoot: manifest.archiveRoot,
      relativePath: `${shardRoot}.stderr.log`,
      payload: result.stderr ?? ""
    });
    const summaryPath = writeOperatorArchiveFile({
      archiveRoot: manifest.archiveRoot,
      relativePath: `${shardRoot}.summary.json`,
      payload: {
        kind: "sdlc_installed_operator_execution_shard_summary",
        shardId: shard.shardId,
        command: shard.command,
        workingDirectory: shard.workingDirectory,
        status: result.status,
        signal: result.signal,
        error: result.error,
        timedOut: result.timedOut
      }
    });
    const refs = Object.freeze([
      pathToFileURL(summaryPath).href,
      pathToFileURL(stdoutPath).href,
      pathToFileURL(stderrPath).href
    ]);
    reportRefs.push(...refs);
    const status: SdlcWorkerExecutionShardEvidence["status"] =
      result.status === 0 ? "succeeded" : "failed";
    shardEvidence.push(
      Object.freeze({
        kind: "sdlc_worker_execution_shard_evidence" as const,
        shardId: shard.shardId,
        moduleName: shard.moduleName,
        lane: "test" as const,
        command: shard.command,
        status,
        reportRefs: refs,
        testsObserved: 1,
        passedCount: status === "succeeded" ? 1 : 0,
        failedCount: status === "succeeded" ? 0 : 1
      })
    );
  }
  const aggregate = aggregateShardExecutionEvidence(shardEvidence);
  const status: SdlcWorkerExecutionEvidence["status"] =
    shards.length === 0
      ? "pending"
      : shardEvidence.every((shard) => shard.status === "succeeded")
        ? "succeeded"
        : "failed";
  if (shards.length === 0) {
    const summaryPath = writeOperatorArchiveFile({
      archiveRoot: manifest.archiveRoot,
      relativePath: "installed_operator_execution/pending.summary.json",
      payload: {
        kind: "sdlc_installed_operator_execution_summary",
        status: "pending",
        reason: "no declared execution shards"
      }
    });
    reportRefs.push(pathToFileURL(summaryPath).href);
  }
  const declaredCommand =
    declaredExecutionContract(manifest.productMaterialization.testExecutionContract)
      ? manifest.productMaterialization.testExecutionContract
      : shardEvidence.map((shard) => shard.command).join(" && ") || "undeclared";
  const executionEvidence: SdlcWorkerExecutionEvidence = Object.freeze({
    kind: "sdlc_worker_execution_evidence" as const,
    lane: "test" as const,
    command: declaredCommand,
    status,
    reportRefs: uniqueSorted(reportRefs),
    testsObserved: aggregate?.testsObserved ?? null,
    passedCount: aggregate?.passedCount ?? null,
    failedCount: aggregate?.failedCount ?? null,
    shardEvidence: Object.freeze(shardEvidence)
  });
  writeStableJsonFile(manifest.outputFile, executionEvidence);
}

function writeInstalledOperatorComponentEvaluation(
  manifest: SdlcWorkerHandoffManifest
): void {
  const artifactRef = pathToFileURL(manifest.outputFile).href;
  if (manifest.targetAssetType === "component_realization_qualification_surface") {
    const componentCode = readAdmittedComponentDepthSurface({
      manifest,
      targetAssetType: "component_code_surface"
    });
    const implementationDesign = readAdmittedImplementationDesign(manifest);
    writeStableJsonFile(
      manifest.outputFile,
      baseComponentDepthRegister({
        targetAssetType: manifest.targetAssetType,
        componentTopologyRows:
          componentCode?.componentTopologyRows ??
          implementationDesign?.componentTopologyRows ??
          Object.freeze([]),
        componentRealizationRows:
          componentCode?.componentRealizationRows ??
          implementationDesign?.componentRealizationRows ??
          Object.freeze([])
      })
    );
    return;
  }
  if (manifest.targetAssetType === "component_test_qualification_surface") {
    const componentTest = readAdmittedComponentDepthSurface({
      manifest,
      targetAssetType: "component_test_surface"
    });
    const componentTestRows = componentTest?.componentTestRows ?? Object.freeze([]);
    const executionEvidence = latestAdmittedExecutionEvidence(manifest);
    const failureRows = failureRowsForComponentTests({
      manifest,
      componentTestRows,
      executionEvidence
    });
    writeStableJsonFile(
      manifest.outputFile,
      baseComponentDepthRegister({
        targetAssetType: manifest.targetAssetType,
        componentTestRows,
        componentTestQualificationRows: qualificationRowsForComponentTests({
          manifest,
          componentTestRows,
          executionEvidence
        }),
        componentExecutionFailureRegister:
          failureRows.length === 0
            ? null
            : Object.freeze({
                kind: "component_execution_failure_register" as const,
                registerVersion: "ts-component-depth-v1" as const,
                failureRows
              })
      })
    );
    return;
  }
  if (manifest.targetAssetType === "component_repair_schedule_surface") {
    const qualification = readAdmittedComponentDepthSurface({
      manifest,
      targetAssetType: "component_test_qualification_surface"
    });
    const componentTestRows = qualification?.componentTestRows ?? Object.freeze([]);
    const executionEvidence = latestAdmittedExecutionEvidence(manifest);
    const derivedFailureRows =
      executionEvidence === null
        ? Object.freeze([])
        : failureRowsForComponentTests({
            manifest,
            componentTestRows,
            executionEvidence
          });
    const qualifiedFailureRows =
      qualification?.componentExecutionFailureRegister?.failureRows ??
      Object.freeze([]);
    const failureRows =
      executionEvidence === null ? qualifiedFailureRows : derivedFailureRows;
    const componentExecutionFailureRegister =
      failureRows.length === 0
        ? null
        : Object.freeze({
            kind: "component_execution_failure_register" as const,
            registerVersion: "ts-component-depth-v1" as const,
            failureRows
          });
    writeStableJsonFile(
      manifest.outputFile,
      baseComponentDepthRegister({
        targetAssetType: manifest.targetAssetType,
        componentTestRows,
        componentTestQualificationRows:
          qualification?.componentTestQualificationRows ?? Object.freeze([]),
        componentExecutionFailureRegister,
        componentRepairSchedule: repairScheduleForFailures(failureRows, [
          componentDepthSurfaceFile(
            manifest,
            "component_test_qualification_surface"
          ) ?? artifactRef
        ].map((ref) => ref.startsWith("file://") ? ref : pathToFileURL(ref).href))
      })
    );
    return;
  }
  if (manifest.targetAssetType === "release_depth_parity_surface") {
    const repairRegister = readAdmittedComponentDepthSurface({
      manifest,
      targetAssetType: "component_repair_schedule_surface"
    });
    const executionEvidence = latestAdmittedExecutionEvidence(manifest);
    const executionEvidencePassed =
      executionEvidence?.status === "succeeded" &&
      (executionEvidence.failedCount ?? 0) === 0 &&
      (executionEvidence.testsObserved ?? 0) > 0;
    const schedule = executionEvidencePassed
      ? repairScheduleForFailures(
          Object.freeze([]),
          executionEvidence?.reportRefs ?? Object.freeze([])
        )
      : repairRegister?.componentRepairSchedule ?? null;
    const blockingReasons =
      schedule === null
        ? Object.freeze(["component_repair_schedule_missing"])
        : executionEvidencePassed
          ? Object.freeze([])
          : schedule.scheduleStatus === "repair_required" ||
            schedule.scheduleStatus === "triage_gap" ||
            schedule.repairRows.length > 0
          ? Object.freeze(schedule.repairRows.map((row) => row.failureId))
          : Object.freeze([]);
    writeStableJsonFile(
      manifest.outputFile,
      baseComponentDepthRegister({
        targetAssetType: manifest.targetAssetType,
        componentRepairSchedule: schedule,
        releaseDepthParity: Object.freeze({
          kind: "sdlc_release_depth_parity_assessment" as const,
          status: blockingReasons.length === 0 ? "met" as const : "blocked" as const,
          summary:
            blockingReasons.length === 0
              ? "Release depth parity is met by admitted component repair evidence."
              : "Release depth parity is blocked by admitted component repair evidence.",
          blockingReasons,
          evidenceRefs: uniqueSorted([
            artifactRef,
            ...(executionEvidence?.reportRefs ?? []),
            ...(schedule?.evidenceRefs ?? [])
          ])
        })
      })
    );
  }
}

export function writeInstalledOperatorOwnedEvaluationArtifact(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
}): string | null {
  if (!installedOperatorOwnsEvaluationOutput(input.manifest.targetAssetType)) {
    return null;
  }
  if (input.manifest.targetAssetType === "test_execution_surface") {
    writeInstalledOperatorTestExecutionSurface(input.manifest);
  } else if (input.manifest.targetAssetType === "test_run_archive_surface") {
    writeInstalledOperatorTestRunArchiveSurface(input.manifest);
  } else if (input.manifest.targetAssetType === "test_execution_result_surface") {
    writeInstalledOperatorExecutionEvidence(input.manifest);
  } else {
    writeInstalledOperatorComponentEvaluation(input.manifest);
  }
  return input.manifest.outputFile;
}

function requirementIdForObligation(obligationId: string): string | null {
  if (!obligationId.startsWith("requirement:")) {
    return null;
  }
  const rawRef = obligationId.slice("requirement:".length);
  return /^(?:REQ|RF|R)-/iu.test(rawRef) ? normalizeRequirementId(rawRef) : rawRef;
}

function displayIdForRequirementObligation(
  obligation: SdlcTraversalObligation
): string | null {
  const concreteMatch = /^Fulfill ([^:]+):/u.exec(obligation.summary);
  if (concreteMatch?.[1] !== undefined) {
    return normalizeRequirementId(concreteMatch[1]);
  }
  const referenceMatch = /^Fulfill live requirement ([^.]+)\./u.exec(
    obligation.summary
  );
  if (referenceMatch?.[1] !== undefined) {
    return normalizeRequirementId(referenceMatch[1]);
  }
  return null;
}

function requirementLineageAuthorityRank(obligation: SdlcTraversalObligation): number {
  const refs = obligation.payload.sourceRefs;
  if (
    refs.some(
      (ref) =>
        ref.includes("/specification/requirements/") &&
        !ref.endsWith("/specification/requirements/README.md") &&
        !ref.endsWith("/specification/requirements/00-imported-sources.md")
    )
  ) {
    return 0;
  }
  if (
    refs.some(
      (ref) =>
        ref.endsWith("/specification/REQUIREMENTS.md") ||
        ref.endsWith("/specification/mapper_requirements.md")
    )
  ) {
    return 1;
  }
  if (
    refs.some((ref) =>
      ref.endsWith("/specification/requirements/00-imported-sources.md")
    )
  ) {
    return 2;
  }
  if (refs.some((ref) => ref.endsWith("/README.md"))) {
    return 4;
  }
  return 3;
}

function canonicalRequirementTraceObligationsForPrompt(
  manifest: SdlcWorkerHandoffManifest
): readonly SdlcTraversalObligation[] {
  const byDisplayId = new Map<string, SdlcTraversalObligation>();
  for (const obligation of manifest.traversalObligationContext.obligations) {
    if (obligation.obligationKind !== "requirement") {
      continue;
    }
    const displayId =
      displayIdForRequirementObligation(obligation) ?? obligation.obligationId;
    const existing = byDisplayId.get(displayId);
    if (
      existing === undefined ||
      requirementLineageAuthorityRank(obligation) <
        requirementLineageAuthorityRank(existing) ||
      (requirementLineageAuthorityRank(obligation) ===
        requirementLineageAuthorityRank(existing) &&
        obligation.obligationId.localeCompare(existing.obligationId) < 0)
    ) {
      byDisplayId.set(displayId, obligation);
    }
  }
  return Object.freeze([...byDisplayId.values()]);
}

function canonicalRequirementLineageMap(
  manifest: SdlcWorkerHandoffManifest
): ReadonlyMap<string, string> {
  const canonicalByDisplayId = new Map<string, string>();
  for (const obligation of canonicalRequirementTraceObligationsForPrompt(manifest)) {
    const displayId =
      displayIdForRequirementObligation(obligation) ?? obligation.obligationId;
    canonicalByDisplayId.set(displayId, obligation.obligationId);
  }
  const byObligationId = new Map<string, string>();
  for (const obligation of manifest.traversalObligationContext.obligations) {
    if (obligation.obligationKind !== "requirement") {
      continue;
    }
    const displayId =
      displayIdForRequirementObligation(obligation) ?? obligation.obligationId;
    const canonicalId = canonicalByDisplayId.get(displayId);
    if (canonicalId !== undefined) {
      byObligationId.set(obligation.obligationId, canonicalId);
    }
  }
  return byObligationId;
}

function equivalentRequirementLineageIdsByCanonical(
  manifest: SdlcWorkerHandoffManifest
): ReadonlyMap<string, readonly string[]> {
  const canonicalByObligationId = canonicalRequirementLineageMap(manifest);
  const byCanonical = new Map<string, Set<string>>();
  for (const [obligationId, canonicalId] of canonicalByObligationId.entries()) {
    const existing = byCanonical.get(canonicalId) ?? new Set<string>();
    existing.add(obligationId);
    byCanonical.set(canonicalId, existing);
  }
  return new Map(
    [...byCanonical.entries()].map(([canonicalId, equivalentIds]) => [
      canonicalId,
      uniqueSorted([...equivalentIds])
    ])
  );
}

function canonicalizeRequirementLineageIds(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly obligationIds: readonly string[];
}): readonly string[] {
  const canonicalByObligationId = canonicalRequirementLineageMap(input.manifest);
  return uniqueSorted(
    input.obligationIds.map(
      (obligationId) => canonicalByObligationId.get(obligationId) ?? obligationId
    )
  );
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
      if (isPlaceholderRequirementMarker(marker)) {
        continue;
      }
      ids.add(normalizeRequirementId(marker));
    }
  }
  return ids;
}

function observedRequirementEvidenceContents(input: {
  readonly outputFile: string;
  readonly materializedFiles: readonly SdlcMaterializedProductFile[];
}): readonly { readonly ref: string; readonly content: string }[] {
  const candidatePaths = uniqueSorted([
    input.outputFile,
    ...input.materializedFiles.map((file) => file.absolutePath)
  ]);
  return Object.freeze(
    candidatePaths.flatMap((filePath) => {
      if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        return [];
      }
      return [
        Object.freeze({
          ref: pathToFileURL(filePath).href,
          content: readFileSync(filePath, "utf8")
        })
      ];
    })
  );
}

function evidenceRefsCarryingRequirement(input: {
  readonly evidenceContents: readonly {
    readonly ref: string;
    readonly content: string;
  }[];
  readonly obligationId: string;
  readonly displayId: string | null;
  readonly equivalentObligationIds?: readonly string[] | undefined;
}): readonly string[] {
  const equivalentObligationIds = input.equivalentObligationIds ?? [];
  return uniqueSorted(
    input.evidenceContents.flatMap((entry) =>
      [
        input.obligationId,
        ...equivalentObligationIds.filter((id) => id !== input.obligationId)
      ].some((obligationId) =>
        contentCarriesRequirementObligation({
          content: entry.content,
          obligationId,
          displayId: input.displayId
        })
      )
        ? [entry.ref]
        : []
    )
  );
}

function requirementDisplayIdByObligationId(
  manifest: SdlcWorkerHandoffManifest
): ReadonlyMap<string, string> {
  const byObligationId = new Map<string, string>();
  for (const obligation of manifest.traversalObligationContext.obligations) {
    if (obligation.obligationKind !== "requirement") {
      continue;
    }
    const displayId = displayIdForRequirementObligation(obligation);
    if (displayId !== null) {
      byObligationId.set(obligation.obligationId, displayId);
    }
  }
  return byObligationId;
}

function contentCarriesRequirementObligation(input: {
  readonly content: string;
  readonly obligationId: string;
  readonly displayId: string | null;
}): boolean {
  if (input.content.includes(input.obligationId)) {
    return true;
  }
  if (input.obligationId.startsWith("requirement:")) {
    const authorityRef = input.obligationId.slice("requirement:".length);
    if (authorityRef.length > 0 && input.content.includes(authorityRef)) {
      return true;
    }
  }
  if (input.displayId === null) {
    return false;
  }
  const normalizedDisplayId = normalizeRequirementId(input.displayId);
  return (input.content.match(REQUIREMENT_MARKER_EXPRESSION) ?? []).some((marker) => {
    if (isPlaceholderRequirementMarker(marker)) {
      return false;
    }
    return normalizeRequirementId(marker) === normalizedDisplayId;
  });
}

function materializedFileRequirementLineage(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): ReadonlyMap<string, readonly string[]> {
  if (!productMaterializationRequirementLineageRequired(input.manifest)) {
    return new Map();
  }
  const lineageByPath = new Map<string, Set<string>>();
  const canonicalByObligationId = canonicalRequirementLineageMap(input.manifest);
  const requirementDisplayIds = requirementDisplayIdByObligationId(input.manifest);
  const equivalentRequirementIdsByCanonical =
    equivalentRequirementLineageIdsByCanonical(input.manifest);
  const fileRefByPath = new Map(
    input.report.materializedFiles.map((file) => [
      resolve(file.absolutePath),
      pathToFileURL(resolve(file.absolutePath)).href
    ])
  );
  for (const file of input.report.materializedFiles) {
    if (file.requirementTraceObligationIds !== undefined) {
      const existing = lineageByPath.get(resolve(file.absolutePath)) ?? new Set<string>();
      for (const requirementId of file.requirementTraceObligationIds) {
        existing.add(canonicalByObligationId.get(requirementId) ?? requirementId);
      }
      lineageByPath.set(resolve(file.absolutePath), existing);
    }
  }
  for (const assessment of input.report.obligationAssessments) {
    if (
      !assessment.obligationId.startsWith("requirement:") ||
      assessment.fulfillmentStatus !== "fulfilled"
    ) {
      continue;
    }
    const evidenceRefs = new Set(
      assessment.evidenceRefs.flatMap((ref) => coverageRefAliases(ref))
    );
    for (const [absolutePath, fileRef] of fileRefByPath.entries()) {
      const fileAliases = [
        ...coverageRefAliases(fileRef),
        ...coverageRefAliases(absolutePath)
      ];
      if (!fileAliases.some((alias) => evidenceRefs.has(alias))) {
        continue;
      }
      const content =
        existsSync(absolutePath) && statSync(absolutePath).isFile()
          ? readFileSync(absolutePath, "utf8")
          : "";
      const canonicalRequirementId =
        canonicalByObligationId.get(assessment.obligationId) ??
        assessment.obligationId;
      const equivalentIds =
        equivalentRequirementIdsByCanonical.get(canonicalRequirementId) ??
        Object.freeze([assessment.obligationId, canonicalRequirementId]);
      if (
        !equivalentIds.some((obligationId) =>
          contentCarriesRequirementObligation({
            content,
            obligationId,
            displayId:
              requirementDisplayIds.get(obligationId) ??
              requirementDisplayIds.get(assessment.obligationId) ??
              requirementDisplayIds.get(canonicalRequirementId) ??
              null
          })
        )
      ) {
        continue;
      }
      const existing = lineageByPath.get(absolutePath) ?? new Set<string>();
      existing.add(canonicalRequirementId);
      lineageByPath.set(absolutePath, existing);
    }
  }
  return new Map(
    [...lineageByPath.entries()].map(([absolutePath, ids]) => [
      absolutePath,
      uniqueSorted([...ids])
    ])
  );
}

function requirementObligationBelongsToDownstreamSurface(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly obligation: SdlcTraversalObligation;
}): boolean {
  if (
    input.manifest.targetAssetType !== "component_code_surface" ||
    input.obligation.obligationKind !== "requirement"
  ) {
    return false;
  }
  const requirementText = [
    input.obligation.summary,
    ...input.obligation.payload.sourceSnippets
  ]
    .join("\n")
    .toLowerCase();
  if (/\b(?:test|uat|acceptance|execution\s+proof|smoke\s+proof)\b/u.test(requirementText)) {
    return true;
  }
  return input.obligation.payload.sourceRefs.some((ref) => {
    const lower = ref.toLowerCase();
    return (
      lower.includes("adr-003-test-design-surface.md") ||
      lower.includes("/component_test_surface.md") ||
      lower.includes("/component_test_") ||
      lower.includes("test-design-surface")
    );
  });
}

function productMaterializationRequirementLineageRequired(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return (
    manifest.productMaterialization.required &&
    requirementTraceObligationIdsForPrompt(manifest).length > 0 &&
    (manifest.targetAssetType === "component_code_surface" ||
      manifest.targetAssetType === "component_test_surface" ||
      manifest.targetAssetType === "code_surface")
  );
}

function materializedFileRequiresRequirementLineage(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcMaterializedProductFile;
  readonly requiredProductRoles: ReadonlySet<SdlcMaterializedProductFileRole>;
}): boolean {
  if (!productMaterializationRequirementLineageRequired(input.manifest)) {
    return false;
  }
  if (!input.requiredProductRoles.has(input.file.role)) {
    return false;
  }
  if (
    isAdmissibleAuxiliaryBuildConfig({
      manifest: input.manifest,
      file: input.file
    })
  ) {
    return false;
  }
  return true;
}

function workerReportWithMaterializedRequirementLineage(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): SdlcWorkerResultReport {
  const lineageByPath = materializedFileRequirementLineage(input);
  if (lineageByPath.size === 0) {
    return input.report;
  }
  return Object.freeze({
    ...input.report,
    materializedFiles: Object.freeze(
      input.report.materializedFiles.map((file) => {
        const requirementTraceObligationIds = lineageByPath.get(
          resolve(file.absolutePath)
        );
        if (
          requirementTraceObligationIds === undefined ||
          requirementTraceObligationIds.length === 0
        ) {
          return file;
        }
        return Object.freeze({
          ...file,
          requirementTraceObligationIds
        });
      })
    )
  });
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
  const observedRequirementContents = observedRequirementEvidenceContents({
    outputFile: input.manifest.outputFile,
    materializedFiles: input.materializedFiles
  });
  const canonicalByObligationId = canonicalRequirementLineageMap(input.manifest);
  const equivalentIdsByCanonical =
    equivalentRequirementLineageIdsByCanonical(input.manifest);
  const assessments = input.manifest.traversalObligationContext.obligations.map((obligation) => {
      const requirementId = requirementIdForObligation(obligation.obligationId);
    if (requirementId !== null) {
        const displayId = displayIdForRequirementObligation(obligation);
        const canonicalRequirementId =
          canonicalByObligationId.get(obligation.obligationId) ??
          obligation.obligationId;
        const evidenceRefs = evidenceRefsCarryingRequirement({
          evidenceContents: observedRequirementContents,
          obligationId: obligation.obligationId,
          displayId,
          equivalentObligationIds:
            equivalentIdsByCanonical.get(canonicalRequirementId) ??
            Object.freeze([canonicalRequirementId])
        });
        const observed = evidenceRefs.length > 0;
        const recordsRequirementSurfaceOnly =
          input.manifest.targetAssetType === "requirement_surface";
        const carriesAuthorityRequirementForward =
          input.manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY &&
          !input.manifest.productMaterialization.required &&
          !recordsRequirementSurfaceOnly;
        const carriesNonMaterializedRequirementForward =
          !input.manifest.productMaterialization.required &&
          !recordsRequirementSurfaceOnly;
        const carriesDownstreamSurfaceRequirement =
          !observed &&
          requirementObligationBelongsToDownstreamSurface({
            manifest: input.manifest,
            obligation
          });
        const fulfillmentStatus =
          observed && recordsRequirementSurfaceOnly
            ? "partial"
            : observed
              ? "fulfilled"
              : carriesDownstreamSurfaceRequirement
                ? "partial"
              : carriesAuthorityRequirementForward ||
                  carriesNonMaterializedRequirementForward
                ? "partial"
                : "blocked";
        return Object.freeze({
          kind: "sdlc_worker_obligation_assessment" as const,
          obligationId: obligation.obligationId,
          fulfillmentStatus,
          evidenceRefs: observed ? evidenceRefs : obligation.evidenceRefs,
          blockingReasons:
            fulfillmentStatus === "fulfilled"
              ? Object.freeze([])
              : Object.freeze([
                  carriesAuthorityRequirementForward
                    ? `requirement_carried_for_downstream_closure:${requirementId}`
                    : carriesNonMaterializedRequirementForward
                    ? `requirement_carried_for_downstream_closure:${requirementId}`
                    : carriesDownstreamSurfaceRequirement
                    ? `requirement_carried_for_downstream_closure:${requirementId}`
                    : observed
                    ? `requirement_recorded_for_future_closure:${requirementId}`
                    : `requirement_trace_not_observed:${requirementId}`
                ])
        });
      }
      if (obligation.obligationKind === "source_asset") {
        const fulfilled = existsSync(input.manifest.outputFile);
        const sourceAssetType = obligation.obligationId.slice("source_asset:".length);
        const derivedEvidenceRefs =
          input.manifest.targetAssetType === "test_run_archive_surface" &&
          sourceAssetType === "test_execution_result_surface"
            ? latestExecutionResultReportRefs(input.manifest)
            : Object.freeze([]);
        const evidenceRefs = fulfilled
          ? uniqueSorted([
              ...baseEvidenceRefs,
              ...obligation.evidenceRefs,
              ...derivedEvidenceRefs
            ])
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
    const existingRequirementIds = new Set<string>();
    for (const obligation of input.manifest.traversalObligationContext.obligations) {
      const requirementId = requirementIdForObligation(obligation.obligationId);
      if (requirementId !== null) {
        existingRequirementIds.add(requirementId);
      }
      const displayId =
        obligation.obligationKind === "requirement"
          ? displayIdForRequirementObligation(obligation)
          : null;
      if (displayId !== null) {
        existingRequirementIds.add(displayId);
      }
    }
    for (const requirementId of [...observedRequirements].sort()) {
      if (existingRequirementIds.has(requirementId)) {
        continue;
      }
      const evidenceRefs = evidenceRefsCarryingRequirement({
        evidenceContents: observedRequirementContents,
        obligationId: `requirement:${requirementId}`,
        displayId: requirementId
      });
      assessments.push(
        Object.freeze({
          kind: "sdlc_worker_obligation_assessment" as const,
          obligationId: `requirement:${requirementId}`,
          fulfillmentStatus: "fulfilled" as const,
          evidenceRefs: evidenceRefs.length > 0 ? evidenceRefs : [outputRef],
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
  const materializationObservation =
    observeProductMaterializationDeltaWithDiagnostics(input);
  const materializedFiles = materializationObservation.materializedFiles;
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
    projectionRole: "typed_fp_stage_projection" as const,
    authoritativeStageResultRef: expectedFpEvaluateResultRef(input.manifest),
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    targetAssetType: input.manifest.targetAssetType,
    outputFile: resolve(input.manifest.outputFile),
    digest: sha256Text(content),
    summary: "framework-generated post-transform report from observed artifacts",
    unresolvedReasons: Object.freeze([]),
    materializedFiles,
    materializationDiagnostics: materializationObservation.diagnostics,
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
    fpTransformStatusSnapshot:
      input.manifest.fpTransformRequest === null ? null : "returned",
    fpEvaluateResultRef: expectedFpEvaluateResultRef(input.manifest)
  });
}

function reportEvidenceRefs(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): readonly string[] {
  const report = workerResultReportWithReplayedProductMaterialization(input);
  return uniqueSorted([
    pathToFileURL(report.outputFile).href,
    pathToFileURL(input.manifest.reportFile).href,
    pathToFileURL(input.manifest.productMaterialization.manifestFile).href,
    ...report.materializedFiles.map((file) =>
      pathToFileURL(file.absolutePath).href
    ),
    ...(report.executionEvidence?.reportRefs ?? []),
    ...(report.executionEvidence?.shardEvidence.flatMap(
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

function isOpenRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function parseOpenRecord(input: unknown, label: string): Record<string, unknown> {
  if (!isOpenRecord(input)) {
    throw new TypeError(`${label}: expected object`);
  }
  return input;
}

function sameSortedStrings(
  left: readonly string[],
  right: readonly string[]
): boolean {
  return (
    [...left].sort().join("\n") === [...right].sort().join("\n")
  );
}

function priorMaterializationContractMatchesCurrent(input: {
  readonly priorContract: unknown;
  readonly currentContract: SdlcProductMaterializationContract;
}): boolean {
  try {
    const prior = parseOpenRecord(
      input.priorContract,
      "productMaterializationReplay.contract"
    );
    const current = input.currentContract;
    return (
      prior["kind"] === current.kind &&
      prior["required"] === current.required &&
      prior["activeTenant"] === current.activeTenant &&
      prior["selectedOutputRoot"] === current.selectedOutputRoot &&
      resolve(
        parseNonEmptyString(
          prior["tenantRoot"],
          "productMaterializationReplay.contract.tenantRoot"
        )
      ) === resolve(current.tenantRoot) &&
      prior["relativePathBasis"] === current.relativePathBasis &&
      sameSortedStrings(
        parseStringList(
          prior["declaredModuleNames"],
          "productMaterializationReplay.contract.declaredModuleNames"
        ),
        current.declaredModuleNames
      ) &&
      parseNonEmptyString(
        prior["buildExecutionContract"],
        "productMaterializationReplay.contract.buildExecutionContract"
      ) === current.buildExecutionContract &&
      parseNonEmptyString(
        prior["testExecutionContract"],
        "productMaterializationReplay.contract.testExecutionContract"
      ) === current.testExecutionContract &&
      sameSortedStrings(
        parseStringList(
          prior["requiredRoles"],
          "productMaterializationReplay.contract.requiredRoles"
        ),
        current.requiredRoles
      )
    );
  } catch {
    return false;
  }
}

const HANDOFF_REPLAY_INDEX_FILE = "handoff_replay_index.json";
const HANDOFF_REPLAY_INDEX_VERSION = "ts-handoff-replay-index-v1";
const HANDOFF_REPLAY_MANIFEST_PREFIX_BYTES = 128 * 1024;

interface SdlcHandoffReplayIndex {
  readonly kind: "sdlc_handoff_replay_index";
  readonly indexVersion: typeof HANDOFF_REPLAY_INDEX_VERSION;
  readonly workspaceRoot: string;
  readonly graphFunctionName: string;
  readonly edgeName: string;
  readonly vectorIndex: number;
  readonly targetAssetType: string;
}

function handoffReplayIndexPath(archiveRoot: string): string {
  return join(archiveRoot, HANDOFF_REPLAY_INDEX_FILE);
}

function handoffReplayIndexForManifest(
  manifest: SdlcWorkerHandoffManifest
): SdlcHandoffReplayIndex {
  return Object.freeze({
    kind: "sdlc_handoff_replay_index" as const,
    indexVersion: HANDOFF_REPLAY_INDEX_VERSION,
    workspaceRoot: manifest.workspaceRoot,
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    vectorIndex: manifest.vectorIndex,
    targetAssetType: manifest.targetAssetType
  });
}

function readFilePrefix(filePath: string, maxBytes: number): string {
  const fd = openSync(filePath, "r");
  try {
    const buffer = Buffer.alloc(maxBytes);
    const bytesRead = readSync(fd, buffer, 0, maxBytes, 0);
    return buffer.subarray(0, bytesRead).toString("utf8");
  } finally {
    closeSync(fd);
  }
}

function topLevelJsonString(prefix: string, field: string): string | null {
  const match = new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`, "u").exec(prefix);
  return match?.[1] ?? null;
}

function topLevelJsonNumber(prefix: string, field: string): number | null {
  const match = new RegExp(`"${field}"\\s*:\\s*(-?\\d+)`, "u").exec(prefix);
  if (match === null) {
    return null;
  }
  const raw = match[1];
  if (raw === undefined) {
    return null;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isInteger(parsed) ? parsed : null;
}

function readHandoffReplayIndexFromManifestPrefix(
  manifestFile: string
): SdlcHandoffReplayIndex | null {
  if (!existsSync(manifestFile) || !statSync(manifestFile).isFile()) {
    return null;
  }
  const prefix = readFilePrefix(
    manifestFile,
    HANDOFF_REPLAY_MANIFEST_PREFIX_BYTES
  );
  if (topLevelJsonString(prefix, "kind") !== "sdlc_worker_handoff_manifest") {
    return null;
  }
  const workspaceRoot = topLevelJsonString(prefix, "workspaceRoot");
  const graphFunctionName = topLevelJsonString(prefix, "graphFunctionName");
  const edgeName = topLevelJsonString(prefix, "edgeName");
  const vectorIndex = topLevelJsonNumber(prefix, "vectorIndex");
  const targetAssetType = topLevelJsonString(prefix, "targetAssetType");
  if (
    workspaceRoot === null ||
    graphFunctionName === null ||
    edgeName === null ||
    vectorIndex === null ||
    targetAssetType === null
  ) {
    return null;
  }
  return Object.freeze({
    kind: "sdlc_handoff_replay_index" as const,
    indexVersion: HANDOFF_REPLAY_INDEX_VERSION,
    workspaceRoot,
    graphFunctionName,
    edgeName,
    vectorIndex,
    targetAssetType
  });
}

function readHandoffReplayIndex(
  archiveRoot: string
): SdlcHandoffReplayIndex | null {
  const indexPath = handoffReplayIndexPath(archiveRoot);
  if (existsSync(indexPath) && statSync(indexPath).isFile()) {
    try {
      const record = parseOpenRecord(
        JSON.parse(readFileSync(indexPath, "utf8")),
        "productMaterializationReplay.handoffReplayIndex"
      );
      if (
        record["kind"] === "sdlc_handoff_replay_index" &&
        record["indexVersion"] === HANDOFF_REPLAY_INDEX_VERSION
      ) {
        return Object.freeze({
          kind: "sdlc_handoff_replay_index" as const,
          indexVersion: HANDOFF_REPLAY_INDEX_VERSION,
          workspaceRoot: parseNonEmptyString(
            record["workspaceRoot"],
            "productMaterializationReplay.handoffReplayIndex.workspaceRoot"
          ),
          graphFunctionName: parseNonEmptyString(
            record["graphFunctionName"],
            "productMaterializationReplay.handoffReplayIndex.graphFunctionName"
          ),
          edgeName: parseNonEmptyString(
            record["edgeName"],
            "productMaterializationReplay.handoffReplayIndex.edgeName"
          ),
          vectorIndex: parseNonNegativeInteger(
            record["vectorIndex"],
            "productMaterializationReplay.handoffReplayIndex.vectorIndex"
          ),
          targetAssetType: parseNonEmptyString(
            record["targetAssetType"],
            "productMaterializationReplay.handoffReplayIndex.targetAssetType"
          )
        });
      }
    } catch {
      return null;
    }
  }
  return readHandoffReplayIndexFromManifestPrefix(
    join(archiveRoot, "handoff_manifest.json")
  );
}

function priorHandoffManifestMatchesCurrent(input: {
  readonly archiveRoot: string;
  readonly currentManifest: SdlcWorkerHandoffManifest;
}): boolean {
  const replayIndex = readHandoffReplayIndex(input.archiveRoot);
  if (replayIndex === null) {
    return false;
  }
  return (
    resolve(replayIndex.workspaceRoot) === resolve(input.currentManifest.workspaceRoot) &&
    replayIndex.graphFunctionName === input.currentManifest.graphFunctionName &&
    replayIndex.edgeName === input.currentManifest.edgeName &&
    replayIndex.vectorIndex === input.currentManifest.vectorIndex &&
    replayIndex.targetAssetType === input.currentManifest.targetAssetType
  );
}

function materializationReplayIsNeeded(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): boolean {
  const contract = input.manifest.productMaterialization;
  if (!contract.required) {
    return false;
  }
  const productFiles = input.report.materializedFiles.filter(
    (file) => resolve(file.absolutePath) !== resolve(input.manifest.outputFile)
  );
  const authority = reconcileSdlcProductMaterializationAuthority(input.manifest);
  if (authority.declaredProductTargetContracts.length > 0) {
    return authority.declaredProductTargetContracts.some(
      (target) =>
        !productFiles.some((file) =>
          materializedProductFileSatisfiesDeclaredTarget({
            manifest: input.manifest,
            file,
            target
          })
        )
    );
  }
  return (
    productFiles.length === 0 ||
    contract.requiredRoles.some(
      (requiredRole) => !productFiles.some((file) => file.role === requiredRole)
    )
  );
}

function materializedProductFileSatisfiesDeclaredTarget(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcMaterializedProductFile;
  readonly target: SdlcProductMaterializationAuthorityTarget;
}): boolean {
  return (
    input.file.role === input.target.requiredRole &&
    productAuthorityTargetCoversRelativePath({
      manifest: input.manifest,
      target: input.target,
      normalizedRelativePath: input.file.relativePath.split(path.sep).join("/")
    })
  );
}

function candidateArchivePrecedesCurrent(input: {
  readonly archiveRoot: string;
  readonly currentArchiveRoot: string;
}): boolean {
  const archiveName = path.basename(input.archiveRoot);
  const currentName = path.basename(input.currentArchiveRoot);
  if (archiveName < currentName) {
    return true;
  }
  try {
    return (
      statSync(input.archiveRoot).mtimeMs <=
      statSync(input.currentArchiveRoot).mtimeMs
    );
  } catch {
    return false;
  }
}

function productMaterializationReplayArchives(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const currentArchiveRoot = resolve(manifest.archiveRoot);
  const parent = dirname(currentArchiveRoot);
  if (!existsSync(parent) || !statSync(parent).isDirectory()) {
    return Object.freeze([]);
  }
  return Object.freeze(
    readdirSync(parent)
      .map((entry) => join(parent, entry))
      .filter((archiveRoot) => resolve(archiveRoot) !== currentArchiveRoot)
      .filter((archiveRoot) => {
        try {
          return statSync(archiveRoot).isDirectory();
        } catch {
          return false;
        }
      })
      .filter((archiveRoot) =>
        candidateArchivePrecedesCurrent({ archiveRoot, currentArchiveRoot })
      )
      .sort()
  );
}

function replayArchivePostflightStatus(
  archiveRoot: string
): "absent" | "blocked" | "invalid" | "passed" {
  const postflightFile = join(archiveRoot, "postflight.json");
  if (!existsSync(postflightFile) || !statSync(postflightFile).isFile()) {
    return "absent";
  }
  try {
    const postflight = parseOpenRecord(
      JSON.parse(readFileSync(postflightFile, "utf8")),
      "productMaterializationReplay.postflight"
    );
    return postflight["status"] === "passed"
      ? "passed"
      : postflight["status"] === "blocked"
        ? "blocked"
        : "invalid";
  } catch {
    return "invalid";
  }
}

function replayArchivePostflightPassedOrAbsent(archiveRoot: string): boolean {
  const status = replayArchivePostflightStatus(archiveRoot);
  return status === "absent" || status === "passed";
}

type ProductMaterializationReplayManifestRead =
  | {
      readonly kind: "manifest";
      readonly manifestFile: string;
      readonly files: readonly SdlcMaterializedProductFile[];
    }
  | {
      readonly kind: "absent";
    }
  | {
      readonly kind: "diagnostic";
      readonly code: SdlcBlockingReasonCode;
      readonly detail: string;
      readonly evidenceRefs: readonly string[];
    };

function readProductMaterializationReplayManifest(input: {
  readonly archiveRoot: string;
  readonly currentManifest: SdlcWorkerHandoffManifest;
}): ProductMaterializationReplayManifestRead {
  const manifestFile = join(input.archiveRoot, "product_materialization_manifest.json");
  if (!existsSync(manifestFile) || !statSync(manifestFile).isFile()) {
    return Object.freeze({ kind: "absent" as const });
  }
  if (!replayArchivePostflightPassedOrAbsent(input.archiveRoot)) {
    return Object.freeze({ kind: "absent" as const });
  }
  const manifestRef = pathToFileURL(manifestFile).href;
  try {
    const manifest = parseOpenRecord(
      JSON.parse(readFileSync(manifestFile, "utf8")),
      "productMaterializationReplay.manifest"
    );
    if (manifest["kind"] !== "sdlc_product_materialization_manifest") {
      return Object.freeze({
        kind: "diagnostic" as const,
        code: "materialized_product_manifest_replay_kind_mismatch",
        detail: "product materialization replay manifest has an unexpected kind",
        evidenceRefs: Object.freeze([manifestRef])
      });
    }
    if (
      !priorMaterializationContractMatchesCurrent({
        priorContract: manifest["contract"],
        currentContract: input.currentManifest.productMaterialization
      })
    ) {
      return Object.freeze({
        kind: "diagnostic" as const,
        code: "materialized_product_manifest_replay_target_mismatch",
        detail: "product materialization replay contract does not match the current materialization contract",
        evidenceRefs: Object.freeze([manifestRef])
      });
    }
    const files = parseArray(
      manifest["files"],
      "productMaterializationReplay.manifest.files",
      admitReplayManifestMaterializedProductFile
    );
    if (files.length === 0) {
      return Object.freeze({
        kind: "diagnostic" as const,
        code: "materialized_product_manifest_replay_empty",
        detail: "product materialization replay manifest has no admitted file rows",
        evidenceRefs: Object.freeze([manifestRef])
      });
    }
    return Object.freeze({
      kind: "manifest" as const,
      manifestFile,
      files
    });
  } catch (error) {
    return Object.freeze({
      kind: "diagnostic" as const,
      code: "materialized_product_manifest_replay_parse_failed",
      detail: error instanceof Error ? error.message : "failed to parse replay manifest",
      evidenceRefs: Object.freeze([manifestRef])
    });
  }
}

function mergeMaterializedProductFiles(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly replayedFiles: readonly SdlcMaterializedProductFile[];
  readonly currentFiles: readonly SdlcMaterializedProductFile[];
}): readonly SdlcMaterializedProductFile[] {
  const byAbsolutePath = new Map<string, SdlcMaterializedProductFile>();
  for (const file of input.replayedFiles) {
    byAbsolutePath.set(resolve(file.absolutePath), file);
  }
  for (const file of input.currentFiles) {
    const replayed = byAbsolutePath.get(resolve(file.absolutePath));
    const replayedRef =
      replayed?.sourceManifestRef === undefined
        ? null
        : materializedFileLineageRef({
            manifestRef: replayed.sourceManifestRef,
            relativePath: replayed.relativePath,
            digest: replayed.digest
          });
    byAbsolutePath.set(
      resolve(file.absolutePath),
      currentAttemptMaterializedFile({
        manifest: input.manifest,
        file,
        overwritesMaterializationRef: replayedRef
      })
    );
  }
  return Object.freeze(
    [...byAbsolutePath.values()].sort((left, right) => {
      const relativeOrder = left.relativePath.localeCompare(right.relativePath);
      if (relativeOrder !== 0) {
        return relativeOrder;
      }
      return resolve(left.absolutePath).localeCompare(resolve(right.absolutePath));
    })
  );
}

function resolveProductMaterializationReplay(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): {
  readonly report: SdlcWorkerResultReport;
  readonly diagnostics: readonly {
    readonly code: SdlcBlockingReasonCode;
    readonly detail: string;
    readonly evidenceRefs: readonly string[];
  }[];
  readonly replay: {
    readonly currentAttemptMaterializedFileCount: number;
    readonly replayedMaterializedFileCount: number;
    readonly effectiveMaterializedFileCount: number;
    readonly lineageRefs: readonly string[];
  } | null;
} {
  const reportWithLineage = workerReportWithMaterializedRequirementLineage(input);
  const currentFiles = reportWithLineage.materializedFiles.map((file) =>
    file.materializationSource === "replay"
      ? file
      : currentAttemptMaterializedFile({
          manifest: input.manifest,
          file
        })
  );
  if (!materializationReplayIsNeeded(input)) {
    return Object.freeze({
      report: Object.freeze({
        ...reportWithLineage,
        materializedFiles: Object.freeze(currentFiles)
      }),
      diagnostics: Object.freeze([]),
      replay: null
    });
  }
  const replayedFiles: SdlcMaterializedProductFile[] = [];
  const lineageRefs: string[] = [];
  const diagnostics: {
    code: SdlcBlockingReasonCode;
    detail: string;
    evidenceRefs: readonly string[];
  }[] = [];
  for (const archiveRoot of productMaterializationReplayArchives(input.manifest)) {
    if (
      !priorHandoffManifestMatchesCurrent({
        archiveRoot,
        currentManifest: input.manifest
      })
    ) {
      continue;
    }
    const replayManifest = readProductMaterializationReplayManifest({
      archiveRoot,
      currentManifest: input.manifest
    });
    if (replayManifest.kind === "absent") {
      continue;
    }
    if (replayManifest.kind === "diagnostic") {
      diagnostics.push({
        code: replayManifest.code,
        detail: replayManifest.detail,
        evidenceRefs: replayManifest.evidenceRefs
      });
      continue;
    }
    const manifestRef = pathToFileURL(replayManifest.manifestFile).href;
    const handoffManifestRef = handoffManifestRefForArchiveRoot(archiveRoot);
    const attemptRef = attemptRefForArchiveRoot(archiveRoot);
    replayedFiles.push(
      ...replayManifest.files.map((file) =>
        replayMaterializedFile({
          manifest: input.manifest,
          file,
          sourceManifestRef: manifestRef,
          sourceHandoffManifestRef: handoffManifestRef,
          sourceAttemptRef: attemptRef
        })
      )
    );
    lineageRefs.push(manifestRef);
    lineageRefs.push(handoffManifestRef);
  }
  if (replayedFiles.length === 0) {
    const supersededDiagnostics = new Set<SdlcBlockingReasonCode>(
      currentFiles.length > 0
        ? ["materialized_product_manifest_replay_empty"]
        : []
    );
    return Object.freeze({
      report: Object.freeze({
        ...reportWithLineage,
        materializedFiles: Object.freeze(currentFiles)
      }),
      diagnostics: Object.freeze(
        diagnostics.filter((diagnostic) => !supersededDiagnostics.has(diagnostic.code))
      ),
      replay: null
    });
  }
  const materializedFiles = mergeMaterializedProductFiles({
    manifest: input.manifest,
    replayedFiles,
    currentFiles
  });
  const supersededDiagnostics = new Set<SdlcBlockingReasonCode>([
    "materialized_product_manifest_replay_empty"
  ]);
  const report = Object.freeze({
    ...reportWithLineage,
    materializedFiles
  });
  return Object.freeze({
    report,
    diagnostics: Object.freeze(
      diagnostics.filter((diagnostic) => !supersededDiagnostics.has(diagnostic.code))
    ),
    replay: Object.freeze({
      currentAttemptMaterializedFileCount:
        reportWithLineage.materializedFiles.length,
      replayedMaterializedFileCount: replayedFiles.length,
      effectiveMaterializedFileCount: materializedFiles.length,
      lineageRefs: Object.freeze(uniqueSorted(lineageRefs))
    })
  });
}

export function workerResultReportWithReplayedProductMaterialization(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): SdlcWorkerResultReport {
  return resolveProductMaterializationReplay(input).report;
}

export function workerResultReportWithFpStageRefs(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): SdlcWorkerResultReport {
  return Object.freeze({
    ...input.report,
    projectionRole: "typed_fp_stage_projection" as const,
    authoritativeStageResultRef: expectedFpEvaluateResultRef(input.manifest),
    fpTransformRequestRef:
      input.report.fpTransformRequestRef ??
      input.manifest.fpTransformRequest?.requestRef ??
      null,
    fpTransformResultRef:
      input.report.fpTransformResultRef ??
      (input.manifest.fpTransformRequest === null
        ? null
        : pathToFileURL(input.manifest.fpTransformResultFile).href),
    fpTransformStatusSnapshot:
      input.report.fpTransformStatusSnapshot ??
      (input.manifest.fpTransformRequest === null
        ? null
        : transformStatusForReport(input.report)),
    fpEvaluateResultRef:
      input.report.fpEvaluateResultRef ??
      expectedFpEvaluateResultRef(input.manifest)
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
  const carriedRequirementAssessments = assessments.filter(
    (assessment) =>
      assessment.obligationId.startsWith("requirement:") &&
      (assessment.fulfillmentStatus === "fulfilled" ||
        assessment.fulfillmentStatus === "partial")
  );
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
  if (
    input.manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY &&
    carriedRequirementAssessments.length > 0
  ) {
    candidates.push({
      candidateRef: "carried_asset:requirement_surface",
      authorityRef: "asset-type://requirement_surface",
      evidenceRefs: assessmentEvidenceRefs,
      payloadClass: "sdlc_transform_carried_asset",
      contractRef: "contract://odd_sdlc/fp-transform-carried-requirement-surface",
      complete: outputArtifactAdmitted,
      shallow: !outputArtifactAdmitted,
      contradictsAuthority: false,
      deferred: false
    });
  }
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

function materializedBuildConfigContainsUnsupportedSbtSecurityManagerOption(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly file: SdlcMaterializedProductFile;
  readonly content: string;
}): boolean {
  if (
    !manifestUsesSbt(input.manifest) ||
    (input.file.role !== "build_config" &&
      !isSbtRuntimeConfigurationPath(input.file.relativePath))
  ) {
    return false;
  }
  return /-Djava\.security\.manager(?:\b|=)/u.test(input.content);
}

function sbtRuntimeConfigurationCandidateFiles(
  manifest: SdlcWorkerHandoffManifest
): readonly {
  readonly relativePath: string;
  readonly absolutePath: string;
}[] {
  if (!manifestUsesSbt(manifest)) {
    return Object.freeze([]);
  }
  const tenantRoot = resolve(manifest.productMaterialization.tenantRoot);
  const candidates = new Map<string, string>();
  const add = (relativePath: string): void => {
    const absolutePath = join(tenantRoot, relativePath);
    if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
      candidates.set(relativePath, absolutePath);
    }
  };
  add("build.sbt");
  add(".jvmopts");
  add(".sbtopts");
  add("project/build.properties");
  const projectDir = join(tenantRoot, "project");
  if (existsSync(projectDir) && statSync(projectDir).isDirectory()) {
    for (const entry of readdirSync(projectDir)) {
      if (entry.toLowerCase().endsWith(".sbt")) {
        add(`project/${entry}`);
      }
    }
  }
  return Object.freeze(
    [...candidates.entries()].map(([relativePath, absolutePath]) =>
      Object.freeze({ relativePath, absolutePath })
    )
  );
}

function evaluateMaterializedProductFiles(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly blockingReasonCarriers: SdlcBlockingReason[];
}): void {
  const contract = input.manifest.productMaterialization;
  const materializationAuthority =
    reconcileSdlcProductMaterializationAuthority(input.manifest);
  const reportedProductFiles = input.report.materializedFiles.filter(
    (file) => resolve(file.absolutePath) !== resolve(input.manifest.outputFile)
  );
  const currentAttemptReportedProductFiles = reportedProductFiles.filter(
    (file) => file.materializationSource !== "replay"
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
  const executionRepairMaterializationAllowed =
    productMaterializationRequiresTestExecutionEvidence(input.manifest);
  const tenantRoot = resolve(contract.tenantRoot);
  if (
    !contract.required &&
    currentAttemptReportedProductFiles.length > 0 &&
    !executionRepairMaterializationAllowed
  ) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "unexpected_product_materialization_for_surface_edge",
        evidenceRefs: [pathToFileURL(contract.tenantRoot).href]
      })
    );
  }
  if (!contract.required) {
    if (executionRepairMaterializationAllowed) {
      for (const file of currentAttemptReportedProductFiles) {
        const absolutePath = resolve(file.absolutePath);
        if (!pathIsInside(absolutePath, tenantRoot)) {
          input.blockingReasonCarriers.push(
            makeSdlcBlockingReason({
              code: "materialized_product_file_outside_tenant_root",
              evidenceRefs: [pathToFileURL(absolutePath).href]
            })
          );
        }
      }
    }
    return;
  }
  if (
    materializationAuthority.contextExpectedFileTargets.length > 0 &&
    materializationAuthority.declaredProductTargetContracts.length === 0
  ) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "context_expected_files_not_materialization_authority",
        evidenceRefs: materializationAuthority.sourceRefs
      })
    );
  }
  if (reportedProductFiles.length === 0) {
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "materialized_product_files_missing",
        evidenceRefs: [pathToFileURL(contract.tenantRoot).href]
      })
    );
  }
  for (const requiredRole of effectiveProductMaterializationRequiredRoles(input.manifest)) {
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
  for (const target of materializationAuthority.declaredProductTargetContracts) {
    if (
      !reportedProductFiles.some((file) =>
        materializedProductFileSatisfiesDeclaredTarget({
          manifest: input.manifest,
          file,
          target
        })
      )
    ) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_files_missing",
          detail: `declared_target:${target.path}`,
          evidenceRefs: [target.sourceRef]
        })
      );
    }
  }
  const requirementDisplayIds =
    requirementDisplayIdByObligationId(input.manifest);
  const equivalentRequirementIdsByCanonical =
    equivalentRequirementLineageIdsByCanonical(input.manifest);
  const requirementLineageRequired =
    productMaterializationRequirementLineageRequired(input.manifest);
  const requiredProductRoles = new Set(
    effectiveProductMaterializationRequiredRoles(input.manifest)
  );
  const validRequirementLineageIds = new Set(
    requirementTraceObligationIdsForProductLineage(input.manifest)
  );
  const unsupportedSbtSecurityManagerConfigRefs = new Set<string>();
  const pushUnsupportedSbtSecurityManagerOption = (inputFile: {
    readonly relativePath: string;
    readonly absolutePath: string;
  }): void => {
    const evidenceRef = pathToFileURL(inputFile.absolutePath).href;
    if (unsupportedSbtSecurityManagerConfigRefs.has(evidenceRef)) {
      return;
    }
    unsupportedSbtSecurityManagerConfigRefs.add(evidenceRef);
    input.blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "sbt_security_manager_option_unsupported",
        detail: inputFile.relativePath,
        evidenceRefs: [evidenceRef]
      })
    );
  };
  for (const candidate of sbtRuntimeConfigurationCandidateFiles(input.manifest)) {
    const content = readFileSync(candidate.absolutePath, "utf8");
    if (/-Djava\.security\.manager(?:\b|=)/u.test(content)) {
      pushUnsupportedSbtSecurityManagerOption(candidate);
    }
  }
  for (const file of input.report.materializedFiles) {
    const absolutePath = resolve(file.absolutePath);
    const fileEvidenceRef = pathToFileURL(absolutePath).href;
    if (absolutePath === resolve(input.manifest.outputFile)) {
      continue;
    }
    const targetContract = targetContractForMaterializedFile({
      manifest: input.manifest,
      relativePath: file.relativePath
    });
    if (
      file.materializationSource === "replay" &&
      file.rolePolicyRef === undefined
    ) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_replay_role_policy_missing",
          detail: file.relativePath,
          evidenceRefs: [fileEvidenceRef, ...(file.sourceManifestRef === undefined ? [] : [file.sourceManifestRef])]
        })
      );
    }
    if (targetContract !== null && file.role !== targetContract.requiredRole) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_role_policy_mismatch",
          detail: `${file.relativePath}: ${file.role} != ${targetContract.requiredRole}`,
          evidenceRefs: [fileEvidenceRef, targetContract.sourceRef]
        })
      );
    }
    if (
      targetContract !== null &&
      file.rolePolicyRef !== undefined &&
      file.rolePolicyRef !== targetContract.policyRef
    ) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_role_policy_ref_mismatch",
          detail: `${file.relativePath}: ${file.rolePolicyRef} != ${targetContract.policyRef}`,
          evidenceRefs: [fileEvidenceRef, targetContract.sourceRef]
        })
      );
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
    if (
      materializedBuildConfigContainsUnsupportedSbtSecurityManagerOption({
        manifest: input.manifest,
        file,
        content
      })
    ) {
      pushUnsupportedSbtSecurityManagerOption({
        relativePath: file.relativePath,
        absolutePath
      });
    }
    const requirementTraceObligationIds = canonicalizeRequirementLineageIds({
      manifest: input.manifest,
      obligationIds: file.requirementTraceObligationIds ?? []
    });
    const requirementLineageRequiredForFile =
      requirementLineageRequired &&
      materializedFileRequiresRequirementLineage({
        manifest: input.manifest,
        file,
        requiredProductRoles
      });
    const unrelatedRequirementLineage = requirementTraceObligationIds.filter(
      (obligationId) => !validRequirementLineageIds.has(obligationId)
    );
    const missingRequirementLineage =
      requirementLineageRequiredForFile && requirementTraceObligationIds.length === 0
        ? ["requirementTraceObligationIds"]
        : requirementLineageRequiredForFile && unrelatedRequirementLineage.length > 0
          ? unrelatedRequirementLineage.map(
              (obligationId) => `unrelated:${obligationId}`
            )
	        : requirementLineageRequiredForFile
	          ? requirementTraceObligationIds.filter(
	              (obligationId) =>
	                !(
	                  equivalentRequirementIdsByCanonical
	                    .get(obligationId)
	                    ?.some((equivalentId) =>
	                      contentCarriesRequirementObligation({
	                        content,
	                        obligationId: equivalentId,
	                        displayId:
	                          requirementDisplayIds.get(equivalentId) ??
	                          requirementDisplayIds.get(obligationId) ??
	                          null
	                      })
	                    ) ??
	                  contentCarriesRequirementObligation({
	                    content,
	                    obligationId,
	                    displayId: requirementDisplayIds.get(obligationId) ?? null
	                  })
	                )
	            )
	          : [];
    if (missingRequirementLineage.length > 0) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "materialized_product_requirement_lineage_missing",
          detail: `${file.relativePath}: ${missingRequirementLineage.join(", ")}`,
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
    const executionEvidenceErrors = input.report.executionEvidenceErrors ?? [];
    if (
      input.report.executionEvidence !== null ||
      executionEvidenceErrors.length > 0
    ) {
      input.blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "worker_execution_evidence_for_non_execution_edge",
          detail:
            executionEvidenceErrors.join("; ") ||
            "typed execution evidence is not admitted for this target asset type",
          evidenceRefs: input.evidenceRefs
        })
      );
    }
    return;
  }
  const executionEvidence = input.report.executionEvidence;
  if (executionEvidence === null) {
    const executionEvidenceErrors = input.report.executionEvidenceErrors ?? [];
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
    input.manifest.productMaterialization.required &&
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
  const expectedShards = installedOperatorExecutionShards(input.manifest);
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
    if (
      !executionCommandMatchesDeclaredRunner({
        declaredCommand: normalizeExecutionCommand(expectedShard.command),
        observedCommand: normalizeExecutionCommand(shardEvidence.command)
      })
    ) {
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

export {
  admittedDesignDepthFpEvaluatorRegisterEvidenceRefs as __handoffAdmittedDesignDepthFpEvaluatorRegisterEvidenceRefs,
  evaluateAdrOutputArtifact as __handoffEvaluateAdrOutputArtifact,
  evaluateExecutionEvidence as __handoffEvaluateExecutionEvidence,
  evaluateMaterializedProductFiles as __handoffEvaluateMaterializedProductFiles,
  evaluateObligationAssessments as __handoffEvaluateObligationAssessments,
  evaluateStagedConstructionAuthority as __handoffEvaluateStagedConstructionAuthority,
  evaluateWorkerAuthorityReadBoundary as __handoffEvaluateWorkerAuthorityReadBoundary,
  installedOperatorOwnsEvaluationOutput as __handoffInstalledOperatorOwnsEvaluationOutput,
  pathIsInside as __handoffPathIsInside,
  resolveProductMaterializationReplay as __handoffResolveProductMaterializationReplay,
  shouldDeferImplementationDesignRegisterToFpEvaluator as __handoffShouldDeferImplementationDesignRegisterToFpEvaluator
};

export function writeProductMaterializationManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): string {
  const replayResolution = resolveProductMaterializationReplay(input);
  const payload: Record<string, unknown> = {
    kind: "sdlc_product_materialization_manifest",
    contract: input.manifest.productMaterialization,
    files: replayResolution.report.materializedFiles
  };
  if (replayResolution.replay !== null) {
    payload["replay"] = {
      kind: "sdlc_product_materialization_manifest_replay",
      ...replayResolution.replay
    };
  }
  mkdirSync(dirname(input.manifest.productMaterialization.manifestFile), {
    recursive: true
  });
  writeFileSync(
    input.manifest.productMaterialization.manifestFile,
    stableOperatorJson(payload),
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
  const retryEligible = sdlcPostflightGapRetryEligible(
    input.postflight.blockingReasonCarriers
  );
  const nextLawfulActions = deriveSdlcPostflightGapActions(
    input.postflight.blockingReasonCarriers
  );
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
    nextLawfulActions
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
        parseEnumValue(item, itemLabel, SDLC_POSTFLIGHT_GAP_ACTIONS)
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
  const report = workerResultReportWithReplayedProductMaterialization(input);
  if (!existsSync(input.manifest.productMaterialization.manifestFile)) {
    writeProductMaterializationManifest({
      manifest: input.manifest,
      report: input.report
    });
  }
  const content = readFileSync(report.outputFile, "utf8");
  const digest = sha256Text(content);
  return admitSdlcConstructorResult({
    operationType: input.operationType ?? "generate",
    outputIdentity: {
      assetId: `asset://odd_sdlc/operator/${input.manifest.edgeName}/${input.manifest.targetAssetType}`,
      uri: pathToFileURL(report.outputFile).href,
      declaredType: input.manifest.targetAssetType,
      digest,
      byteCount: Buffer.byteLength(content, "utf8")
    },
    evidenceRefs: [
      {
        ref: pathToFileURL(report.outputFile).href,
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
      report.materializedFiles.map((file) => ({
        ref: pathToFileURL(file.absolutePath).href,
        evidenceType: `installed_operator_materialized_product_${file.role}`,
        digest: file.digest
      })),
      report.executionEvidence?.reportRefs.map((ref) => ({
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
        `materialized_product_file_count:${report.materializedFiles.length}`
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

function isUncatalogedEvidenceArchivePath(relativePath: string): boolean {
  return relativePath.startsWith("installed_operator_execution/");
}

export function writeOperatorArchiveFile(input: {
  readonly archiveRoot: string;
  readonly relativePath?: string | undefined;
  readonly artifactRef?: string | undefined;
  readonly payload: unknown;
}): string {
  const content =
    typeof input.payload === "string"
      ? input.payload
      : stableOperatorJson(input.payload);
  const artifact =
    input.artifactRef !== undefined
      ? requireOperatorRunArtifactRowForArtifactRef(input.artifactRef)
      : input.relativePath === undefined
        ? null
        : operatorRunArtifactRowForRelativePath(input.relativePath);
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
  if (input.relativePath === undefined) {
    throw new TypeError("operator archive write requires artifactRef or relativePath");
  }
  if (
    !isUncatalogedEvidenceArchivePath(input.relativePath) &&
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
  return executeSdlcArchiveWritePlan(
    constructSdlcArchiveWritePlan({
      archiveRoot: input.archiveRoot,
      relativePath: input.relativePath,
      content
    })
  );
}

export function relativeToWorkspace(workspaceRoot: string, filePath: string): string {
  return path.relative(workspaceRoot, filePath);
}
