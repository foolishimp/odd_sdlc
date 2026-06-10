// Implements: T-182

import { existsSync, readFileSync, statSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import {
  admitGtlContractFulfillmentBinding,
  constructGtlContractFulfillmentBinding,
  type GtlContractFulfillmentBinding
} from "@abiogenesis/typescript-tenant";
import {
  parseArray,
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import { uniqueLocaleSorted as uniqueSorted } from "../shared/collections.js";
import {
  SDLC_REVIEW_GRADE_FAILURE_CLASSES,
  type SdlcReviewGradeEdgeFulfillmentAdmission,
  type SdlcReviewGradeEdgeFulfillmentAssessment,
  type SdlcReviewGradeDimensionObservation,
  type SdlcReviewGradeObligationCoverageFold,
  type SdlcReviewGradeObligationFinding,
  type SdlcComponentDepthRegister,
  type SdlcComponentRealizationRow,
  type SdlcComponentTopologyRow,
  type SdlcRequirementFunctionFulfillmentBinding,
  type SdlcWorkerObligationAssessment,
  type SdlcWorkerHandoffManifest
} from "./carriers.js";
import {
  sdlcReviewGradeEdgeFulfillmentAssessmentRequired
} from "./edge_output_policy.js";
import { sha256Text } from "../shared/digest.js";
import { admitComponentDepthRegisterFromArtifact } from "./component_depth_register.js";

export const REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE =
  "review_grade_edge_fulfillment_assessment.json";

export const REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF =
  "evaluation-rule://odd-sdlc/review-grade-edge-fulfillment/fp";

const REVIEW_GRADE_PROMPT_NULL_BINDING_REF_PREFIX =
  "prompt-null://odd-sdlc/review-grade/fulfillment-binding";

export interface SdlcReviewGradeReadOnlyInputFileState {
  readonly path: string;
  readonly state: "file" | "missing" | "not_file" | "unreadable";
  readonly digest: string | null;
  readonly detail: string | null;
}

export interface SdlcReviewGradeReadOnlyInputSnapshot {
  readonly kind: "sdlc_review_grade_read_only_input_snapshot";
  readonly files: readonly SdlcReviewGradeReadOnlyInputFileState[];
}

function readOnlyInputFileState(filePath: string): SdlcReviewGradeReadOnlyInputFileState {
  const resolvedPath = resolve(filePath);
  try {
    if (!existsSync(resolvedPath)) {
      return Object.freeze({
        path: resolvedPath,
        state: "missing" as const,
        digest: null,
        detail: null
      });
    }
    const stat = statSync(resolvedPath);
    if (!stat.isFile()) {
      return Object.freeze({
        path: resolvedPath,
        state: "not_file" as const,
        digest: null,
        detail: null
      });
    }
    return Object.freeze({
      path: resolvedPath,
      state: "file" as const,
      digest: sha256Text(readFileSync(resolvedPath, "utf8")),
      detail: null
    });
  } catch (error) {
    return Object.freeze({
      path: resolvedPath,
      state: "unreadable" as const,
      digest: null,
      detail: error instanceof Error ? error.message : String(error)
    });
  }
}

export function snapshotReviewGradeReadOnlyInputFiles(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: {
    readonly outputFile: string;
    readonly materializedFiles: readonly {
      readonly absolutePath: string;
    }[];
  };
  readonly additionalInputFiles?: readonly string[];
}): SdlcReviewGradeReadOnlyInputSnapshot {
  const paths = uniqueSorted([
    input.manifest.outputFile,
    input.report.outputFile,
    ...input.report.materializedFiles.map((file) => file.absolutePath),
    ...(input.additionalInputFiles ?? [])
  ].map((filePath) => resolve(filePath)));
  return Object.freeze({
    kind: "sdlc_review_grade_read_only_input_snapshot" as const,
    files: Object.freeze(paths.map(readOnlyInputFileState))
  });
}

function readOnlyInputFileStateChanged(input: {
  readonly before: SdlcReviewGradeReadOnlyInputFileState;
  readonly after: SdlcReviewGradeReadOnlyInputFileState;
}): boolean {
  return (
    input.before.state !== input.after.state ||
    input.before.digest !== input.after.digest ||
    input.before.detail !== input.after.detail
  );
}

export function reviewGradeReadOnlyInputMutationReasons(input: {
  readonly snapshot: SdlcReviewGradeReadOnlyInputSnapshot;
}): readonly string[] {
  return uniqueSorted(
    input.snapshot.files.flatMap((before) => {
      const after = readOnlyInputFileState(before.path);
      return readOnlyInputFileStateChanged({ before, after })
        ? [
            `review_grade_evaluator_mutated_input:${pathToFileURL(before.path).href}`
          ]
        : [];
    })
  );
}

export function reviewGradeEdgeFulfillmentAssessmentRequired(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return sdlcReviewGradeEdgeFulfillmentAssessmentRequired(manifest);
}

function reviewGradeFindingIsDownstreamStagePressure(input: {
  readonly finding: SdlcReviewGradeObligationFinding;
  readonly targetAssetType?: string | undefined;
}): boolean {
  const nonMaterializedPlanningSurface = reviewGradeTargetAllowsRequirementCarryover(
    input.targetAssetType
  );
  const carryoverStatus =
    input.finding.fulfillmentStatus === "partial" ||
    input.finding.fulfillmentStatus === "blocked";
  if (
    !input.finding.obligationId.startsWith("requirement:") ||
    !carryoverStatus
  ) {
    return false;
  }
  const action = input.finding.requiredAction?.toLowerCase() ?? "";
  const actionNamesDownstreamTestOrExecution =
    (action.includes("downstream") ||
      action.includes("later") ||
      action.includes("carry")) &&
    (action.includes("test") ||
      action.includes("execution") ||
      action.includes("execution evidence") ||
      action.includes("executionevidence") ||
      action.includes("test carrier") ||
      action.includes("test/execution") ||
      action.includes("derive_test_execution_result_surface") ||
      action.includes("prepare_test_execution_surface"));
  const actionNamesDownstreamRequirementRealization =
    (action.includes("downstream") ||
      action.includes("later") ||
      action.includes("carry")) &&
    (action.includes("design") ||
      action.includes("materialization") ||
      action.includes("component") ||
      action.includes("code") ||
      action.includes("test") ||
      action.includes("execution") ||
      action.includes("realization") ||
      action.includes("closure"));
  if (input.finding.failureClass === "wrong_stage") {
    return (
      (input.targetAssetType === "component_code_surface" &&
        actionNamesDownstreamTestOrExecution) ||
      (nonMaterializedPlanningSurface &&
        reviewGradePlanningTargetActionNamesLawfulDownstream({
          targetAssetType: input.targetAssetType,
          action,
          actionNamesDownstreamRequirementRealization,
          actionNamesDownstreamTestOrExecution
        }))
    );
  }
  if (
    input.targetAssetType === "component_code_surface" &&
    (input.finding.failureClass === "test_overlap_missing" ||
      input.finding.failureClass === "execution_environment")
  ) {
    return (
      action.includes("component_test_surface") ||
      action.includes("test-execution") ||
      action.includes("test execution") ||
      action.includes("execution evidence") ||
      action.includes("executionevidence") ||
      action.includes("process-exit-plus-stdout") ||
      action.includes("generated test")
    );
  }
  if (
    input.targetAssetType === "component_test_surface" &&
    input.finding.failureClass === "execution_environment"
  ) {
    return (
      action.includes("test-execution") ||
      action.includes("test execution") ||
      action.includes("execution evidence") ||
      action.includes("execution_result_surface") ||
      action.includes("runtime_execution_surface")
    );
  }
  return false;
}

function reviewGradePlanningTargetActionNamesLawfulDownstream(input: {
  readonly targetAssetType: string | undefined;
  readonly action: string;
  readonly actionNamesDownstreamRequirementRealization: boolean;
  readonly actionNamesDownstreamTestOrExecution: boolean;
}): boolean {
  if (input.targetAssetType === "test_design_surface") {
    return (
      input.action.includes("component_test_surface") ||
      input.action.includes("component test surface") ||
      input.action.includes("test-execution") ||
      input.action.includes("test execution") ||
      input.action.includes("execution evidence") ||
      input.action.includes("executionevidence") ||
      input.action.includes("derive_test_execution_result_surface") ||
      input.action.includes("prepare_test_execution_surface")
    );
  }
  return input.actionNamesDownstreamRequirementRealization;
}

function reviewGradeTargetAllowsRequirementCarryover(
  targetAssetType: string | undefined
): boolean {
  return (
    targetAssetType === "intent_surface" ||
    targetAssetType === "product_surface" ||
    targetAssetType === "goal_surface" ||
    targetAssetType === "requirement_surface" ||
    targetAssetType === "uat_testcases_surface" ||
    targetAssetType === "testcase_authority_surface" ||
    targetAssetType === "feature_decomp_surface" ||
    targetAssetType === "design_surface" ||
    targetAssetType === "scenario_surface" ||
    targetAssetType === "implementation_design_surface" ||
    targetAssetType === "test_design_surface" ||
    targetAssetType === "component_repair_schedule_surface"
  );
}

export function reviewGradeFindingsAreDownstreamStagePressure(
  findings: readonly SdlcReviewGradeObligationFinding[],
  input: { readonly targetAssetType?: string | undefined } = {}
): boolean {
  return (
    findings.length > 0 &&
    findings.every((finding) =>
      reviewGradeFindingIsDownstreamStagePressure({
        finding,
        targetAssetType: input.targetAssetType
      })
    )
  );
}

export function reviewGradeEdgeFulfillmentOpenPressureRefs(input: {
  readonly runRef: string;
  readonly assessments: readonly SdlcWorkerObligationAssessment[];
}): readonly string[] {
  return uniqueSorted(
    input.assessments.flatMap((assessment) => {
      const downstreamCarryover =
        assessment.reviewFailureClass === "wrong_stage" &&
        assessment.blockingReasons.some((reason) =>
          reason.startsWith("requirement_carried_for_downstream_closure:")
        );
      return assessment.reviewGrade === true &&
        assessment.fulfillmentStatus !== "fulfilled" &&
        !downstreamCarryover
          ? [
              `pressure://odd-sdlc/review-grade/${input.runRef}/${encodeURIComponent(assessment.obligationId)}`
            ]
          : [];
    })
  );
}

export function reviewGradeEdgeFulfillmentAssessmentPressureRefs(input: {
  readonly runRef: string;
  readonly targetAssetType?: string | undefined;
  readonly assessment: SdlcReviewGradeEdgeFulfillmentAssessment;
}): readonly string[] {
  const openFindings = input.assessment.findings.filter(
    (finding) => finding.fulfillmentStatus !== "fulfilled"
  );
  if (
    reviewGradeFindingsAreDownstreamStagePressure(openFindings, {
      targetAssetType: input.targetAssetType
    })
  ) {
    return Object.freeze([]);
  }
  if (openFindings.length === 0 && input.assessment.status === "passed") {
    return Object.freeze([]);
  }
  const openPressureRefs = uniqueSorted(
    openFindings.map(
      (finding) =>
        `pressure://odd-sdlc/review-grade/${input.runRef}/${encodeURIComponent(finding.obligationId)}`
    )
  );
  return openPressureRefs.length > 0
    ? openPressureRefs
    : Object.freeze([
        `pressure://odd-sdlc/review-grade/${input.runRef}/assessment-status/${input.assessment.status}`
      ]);
}

function parseNullableFailureClass(
  input: unknown,
  label: string
): SdlcReviewGradeObligationFinding["failureClass"] {
  if (input === null) {
    return null;
  }
  return parseEnumValue(input, label, SDLC_REVIEW_GRADE_FAILURE_CLASSES);
}

function parseNullableRequiredAction(
  input: unknown,
  label: string
): string | null {
  if (input === null) {
    return null;
  }
  return parseNonEmptyString(input, label);
}

function parseFulfillmentBinding(
  input: unknown,
  label: string,
  context: { readonly obligationId?: string } = {}
): GtlContractFulfillmentBinding {
  const record = parseClosedRecord(input, label, [
    "bindingRef",
    "kind",
    "obligationRef",
    "requirementRef",
    "productRequirementRef",
    "designObligationRef",
    "componentRef",
    "productTargetRef",
    "outputSurfaceRef",
    "functionOrEntrypointRef",
    "realizationEvidenceRefs",
    "testOrExecutionEvidenceRefs",
    "evaluatorFindingRef",
    "authorityRefs",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "gtl_contract_fulfillment_binding") {
    throw new TypeError(`${label}.kind: unexpected fulfillment binding kind`);
  }
  const nullSentinel = (fieldName: string): string =>
    `${REVIEW_GRADE_PROMPT_NULL_BINDING_REF_PREFIX}/${encodeURIComponent(
      context.obligationId ?? "unknown-obligation"
    )}/${fieldName}`;
  const parseBindingString = (
    value: unknown,
    fieldLabel: string,
    fieldName: string
  ): string => {
    if (value === null) {
      return nullSentinel(fieldName);
    }
    return parseNonEmptyString(value, fieldLabel);
  };
  const obligationRef = context.obligationId ?? "";
  const bindingObligationRef =
    obligationRef.length > 0
      ? obligationRef
      : parseBindingString(
          record["obligationRef"],
          `${label}.obligationRef`,
          "obligationRef"
        );
  const nonRequirementObligation =
    !bindingObligationRef.startsWith("requirement:");
  const nonRequirementFallbackRef = (fieldName: string): string =>
    `binding-fallback://odd-sdlc/review-grade/${encodeURIComponent(
      bindingObligationRef
    )}/${fieldName}`;
  const parseBindingStringWithFallback = (
    value: unknown,
    fieldLabel: string,
    fieldName: string,
    fallback: string | null,
    options: { readonly admitNullAsFallback?: boolean } = {}
  ): string => {
    if (
      (value === undefined || (options.admitNullAsFallback === true && value === null)) &&
      fallback !== null
    ) {
      return fallback;
    }
    return parseBindingString(value, fieldLabel, fieldName);
  };
  const parseBindingStringList = (
    value: unknown,
    fieldLabel: string,
    fieldName: string
  ): readonly string[] => {
    if (value === null) {
      return Object.freeze([nullSentinel(fieldName)]);
    }
    return uniqueSorted(parseStringList(value, fieldLabel));
  };
  const productTargetRef = parseBindingString(
    record["productTargetRef"],
    `${label}.productTargetRef`,
    "productTargetRef"
  );
  const productTargetFieldFallback = (fieldName: string): string =>
    `${productTargetRef}#${fieldName}`;
  const requirementRef = parseBindingStringWithFallback(
    record["requirementRef"],
    `${label}.requirementRef`,
    "requirementRef",
    nonRequirementObligation ? bindingObligationRef : null,
    { admitNullAsFallback: nonRequirementObligation }
  );
  const binding = constructGtlContractFulfillmentBinding({
    bindingRef:
      record["bindingRef"] === undefined
        ? undefined
        : parseBindingString(record["bindingRef"], `${label}.bindingRef`, "bindingRef"),
    obligationRef: bindingObligationRef,
    requirementRef,
    productRequirementRef: parseBindingStringWithFallback(
      record["productRequirementRef"],
      `${label}.productRequirementRef`,
      "productRequirementRef",
      nonRequirementObligation ? requirementRef : null,
      { admitNullAsFallback: nonRequirementObligation }
    ),
    designObligationRef: parseBindingStringWithFallback(
      record["designObligationRef"],
      `${label}.designObligationRef`,
      "designObligationRef",
      nonRequirementObligation
        ? nonRequirementFallbackRef("designObligationRef")
        : productTargetFieldFallback("designObligationRef"),
      { admitNullAsFallback: true }
    ),
    componentRef: parseBindingStringWithFallback(
      record["componentRef"],
      `${label}.componentRef`,
      "componentRef",
      nonRequirementObligation
        ? nonRequirementFallbackRef("componentRef")
        : productTargetFieldFallback("componentRef"),
      { admitNullAsFallback: true }
    ),
    productTargetRef,
    outputSurfaceRef: parseBindingString(
      record["outputSurfaceRef"],
      `${label}.outputSurfaceRef`,
      "outputSurfaceRef"
    ),
    functionOrEntrypointRef: parseBindingStringWithFallback(
      record["functionOrEntrypointRef"],
      `${label}.functionOrEntrypointRef`,
      "functionOrEntrypointRef",
      nonRequirementObligation
        ? nonRequirementFallbackRef("functionOrEntrypointRef")
        : productTargetRef,
      { admitNullAsFallback: true }
    ),
    realizationEvidenceRefs: parseBindingStringList(
      record["realizationEvidenceRefs"],
      `${label}.realizationEvidenceRefs`,
      "realizationEvidenceRefs"
    ),
    testOrExecutionEvidenceRefs: parseBindingStringList(
      record["testOrExecutionEvidenceRefs"],
      `${label}.testOrExecutionEvidenceRefs`,
      "testOrExecutionEvidenceRefs"
    ),
    evaluatorFindingRef: parseBindingString(
      record["evaluatorFindingRef"],
      `${label}.evaluatorFindingRef`,
      "evaluatorFindingRef"
    ),
    authorityRefs: parseBindingStringList(
      record["authorityRefs"],
      `${label}.authorityRefs`,
      "authorityRefs"
    ),
    evidenceRefs: parseBindingStringList(
      record["evidenceRefs"],
      `${label}.evidenceRefs`,
      "evidenceRefs"
    )
  });
  return admitGtlContractFulfillmentBinding(binding);
}

function parseNullableFulfillmentBinding(
  input: unknown,
  label: string,
  context: { readonly obligationId?: string } = {}
): SdlcRequirementFunctionFulfillmentBinding | null {
  if (input === null) {
    return null;
  }
  return parseFulfillmentBinding(input, label, context);
}

function parseReviewFinding(
  input: unknown,
  label: string
): SdlcReviewGradeObligationFinding {
  const record = parseClosedRecord(input, label, [
    "kind",
    "obligationId",
    "fulfillmentStatus",
    "failureClass",
    "requiredAction",
    "evidenceRefs",
    "acceptedAuthorityRefs",
    "fulfillmentBinding",
    "rationale"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_review_grade_obligation_finding") {
    throw new TypeError(`${label}.kind: unexpected review finding kind`);
  }
  const obligationId = parseNonEmptyString(
    record["obligationId"],
    `${label}.obligationId`
  );
  return Object.freeze({
    kind: "sdlc_review_grade_obligation_finding" as const,
    obligationId,
    fulfillmentStatus: parseEnumValue(
      record["fulfillmentStatus"],
      `${label}.fulfillmentStatus`,
      ["fulfilled", "partial", "blocked", "unassessed"] as const
    ),
    failureClass: parseNullableFailureClass(record["failureClass"], `${label}.failureClass`),
    requiredAction: parseNullableRequiredAction(record["requiredAction"], `${label}.requiredAction`),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`),
    acceptedAuthorityRefs: parseStringList(
      record["acceptedAuthorityRefs"],
      `${label}.acceptedAuthorityRefs`
    ),
    fulfillmentBinding: parseNullableFulfillmentBinding(
      record["fulfillmentBinding"],
      `${label}.fulfillmentBinding`,
      { obligationId }
    ),
    rationale: parseNonEmptyString(record["rationale"], `${label}.rationale`)
  });
}

function parseNonNegativeInteger(input: unknown, label: string): number {
  if (typeof input !== "number" || !Number.isInteger(input) || input < 0) {
    throw new TypeError(`${label}: expected non-negative integer`);
  }
  return input;
}

function parseOptionalReviewGradeDimensionObservation(
  input: unknown,
  label: string
): SdlcReviewGradeDimensionObservation | null {
  if (input === undefined || input === null) {
    return null;
  }
  const record = parseClosedRecord(input, label, [
    "dimension",
    "status",
    "rationale"
  ]);
  return Object.freeze({
    dimension: parseNonEmptyString(record["dimension"], `${label}.dimension`),
    status: parseNonEmptyString(record["status"], `${label}.status`),
    rationale: parseNonEmptyString(record["rationale"], `${label}.rationale`)
  });
}

function parseOptionalReviewGradeObligationCoverageFold(
  input: unknown,
  label: string
): SdlcReviewGradeObligationCoverageFold | null {
  if (input === undefined || input === null) {
    return null;
  }
  const record = parseClosedRecord(input, label, [
    "dimension",
    "coveredCount",
    "totalCount",
    "status",
    "rationale"
  ]);
  return Object.freeze({
    dimension: parseNonEmptyString(record["dimension"], `${label}.dimension`),
    coveredCount: parseNonNegativeInteger(
      record["coveredCount"],
      `${label}.coveredCount`
    ),
    totalCount: parseNonNegativeInteger(record["totalCount"], `${label}.totalCount`),
    status: parseNonEmptyString(record["status"], `${label}.status`),
    rationale: parseNonEmptyString(record["rationale"], `${label}.rationale`)
  });
}

function parseReviewAssessment(
  input: unknown,
  label: string
): SdlcReviewGradeEdgeFulfillmentAssessment {
  const record = parseClosedRecord(input, label, [
    "kind",
    "assessmentVersion",
    "graphFunctionName",
    "edgeName",
    "targetAssetType",
    "status",
    "reviewedObligationIds",
    "findings",
    "stageBoundaryConformance",
    "materializationBindingRelation",
    "obligationCoverageFold",
    "evidenceRefs",
    "summary"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_review_grade_edge_fulfillment_assessment") {
    throw new TypeError(`${label}.kind: unexpected review-grade assessment kind`);
  }
  const version = parseNonEmptyString(
    record["assessmentVersion"],
    `${label}.assessmentVersion`
  );
  if (version !== "ts-review-grade-v1") {
    throw new TypeError(`${label}.assessmentVersion: unsupported version`);
  }
  return Object.freeze({
    kind: "sdlc_review_grade_edge_fulfillment_assessment" as const,
    assessmentVersion: "ts-review-grade-v1" as const,
    graphFunctionName: parseNonEmptyString(
      record["graphFunctionName"],
      `${label}.graphFunctionName`
    ),
    edgeName: parseNonEmptyString(record["edgeName"], `${label}.edgeName`),
    targetAssetType: parseNonEmptyString(
      record["targetAssetType"],
      `${label}.targetAssetType`
    ),
    status: parseEnumValue(record["status"], `${label}.status`, [
      "passed",
      "blocked"
    ] as const),
    reviewedObligationIds: parseStringList(
      record["reviewedObligationIds"],
      `${label}.reviewedObligationIds`
    ),
    findings: parseArray(record["findings"], `${label}.findings`, parseReviewFinding),
    stageBoundaryConformance: parseOptionalReviewGradeDimensionObservation(
      record["stageBoundaryConformance"],
      `${label}.stageBoundaryConformance`
    ),
    materializationBindingRelation: parseOptionalReviewGradeDimensionObservation(
      record["materializationBindingRelation"],
      `${label}.materializationBindingRelation`
    ),
    obligationCoverageFold: parseOptionalReviewGradeObligationCoverageFold(
      record["obligationCoverageFold"],
      `${label}.obligationCoverageFold`
    ),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`),
    summary: parseNonEmptyString(record["summary"], `${label}.summary`)
  });
}

function fulfillmentBindingRequirementRefAdmitted(input: {
  readonly obligationId: string;
  readonly requirementRef: string;
  readonly productRequirementRef: string;
  readonly declaredRequirementRefs: ReadonlySet<string>;
}): boolean {
  if (input.requirementRef === input.obligationId) {
    return true;
  }
  if (input.obligationId.startsWith("requirement:")) {
    return false;
  }
  return (
    input.productRequirementRef === input.requirementRef &&
    input.declaredRequirementRefs.has(input.requirementRef)
  );
}

function fulfillmentBindingContainsPromptNullSentinel(
  binding: SdlcRequirementFunctionFulfillmentBinding
): boolean {
  const refs = [
    binding.bindingRef,
    binding.obligationRef,
    binding.requirementRef,
    binding.productRequirementRef,
    binding.designObligationRef,
    binding.componentRef,
    binding.productTargetRef,
    binding.outputSurfaceRef,
    binding.functionOrEntrypointRef,
    binding.evaluatorFindingRef,
    ...binding.realizationEvidenceRefs,
    ...binding.testOrExecutionEvidenceRefs,
    ...binding.authorityRefs,
    ...binding.evidenceRefs
  ];
  return refs.some((ref) =>
    ref.startsWith(REVIEW_GRADE_PROMPT_NULL_BINDING_REF_PREFIX)
  );
}

function slashPath(input: string): string {
  return input.split(sep).join("/");
}

function workspaceRefForPath(input: {
  readonly workspaceRoot: string;
  readonly absolutePath: string;
}): string {
  return `workspace://${slashPath(relative(input.workspaceRoot, input.absolutePath))}`;
}

function requirementRefMatches(left: string, right: string): boolean {
  return left === right || left.replace(/^requirement:/u, "") === right.replace(/^requirement:/u, "");
}

function rowRequirementRefs(
  row: SdlcComponentRealizationRow | SdlcComponentTopologyRow
): readonly string[] {
  return row.requirementIds;
}

function componentRowsForBinding(
  register: SdlcComponentDepthRegister
): readonly (SdlcComponentRealizationRow | SdlcComponentTopologyRow)[] {
  return Object.freeze([
    ...register.componentRealizationRows,
    ...register.componentTopologyRows
  ]);
}

function selectComponentRowForObligation(input: {
  readonly register: SdlcComponentDepthRegister;
  readonly obligationId: string;
  readonly requirementRef: string;
}): SdlcComponentRealizationRow | SdlcComponentTopologyRow | null {
  const rows = componentRowsForBinding(input.register);
  if (rows.length === 0) {
    return null;
  }
  if (input.obligationId.startsWith("module:")) {
    const moduleName = input.obligationId.slice("module:".length);
    return rows.find((row) => row.moduleName === moduleName) ?? null;
  }
  if (input.obligationId.startsWith("requirement:")) {
    return (
      rows.find((row) =>
        rowRequirementRefs(row).some((candidate) =>
          requirementRefMatches(candidate, input.obligationId)
        )
      ) ??
      rows.find((row) =>
        rowRequirementRefs(row).some((candidate) =>
          requirementRefMatches(candidate, input.requirementRef)
        )
      ) ?? null
    );
  }
  return (
    rows.find((row) =>
      rowRequirementRefs(row).some((candidate) =>
        requirementRefMatches(candidate, input.requirementRef)
      )
    ) ?? null
  );
}

function moduleRootWorkspaceRef(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly row: SdlcComponentRealizationRow | SdlcComponentTopologyRow;
}): string {
  const outputRef = workspaceRefForPath({
    workspaceRoot: input.manifest.workspaceRoot,
    absolutePath: input.manifest.outputFile
  }).slice("workspace://".length);
  const moduleRoot = `build_tenants/${input.row.moduleName}/`;
  const moduleIndex = outputRef.indexOf(moduleRoot);
  return moduleIndex >= 0 ? outputRef.slice(0, moduleIndex + moduleRoot.length) : "";
}

function productTargetRefForRow(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly row: SdlcComponentRealizationRow | SdlcComponentTopologyRow;
}): string {
  return `workspace://${moduleRootWorkspaceRef(input)}${slashPath(input.row.relativePath)}`;
}

function requirementRefForBinding(input: {
  readonly obligationId: string;
  readonly row: SdlcComponentRealizationRow | SdlcComponentTopologyRow;
  readonly declaredRequirementRefs: readonly string[];
}): string | null {
  if (input.obligationId.startsWith("requirement:")) {
    return input.obligationId;
  }
  const rowRef = rowRequirementRefs(input.row).find((candidate) =>
    input.declaredRequirementRefs.some((declared) =>
      requirementRefMatches(candidate, declared)
    )
  );
  if (rowRef !== undefined) {
    return input.declaredRequirementRefs.find((declared) =>
      requirementRefMatches(rowRef, declared)
    ) ?? rowRef;
  }
  return input.declaredRequirementRefs.length === 1
    ? input.declaredRequirementRefs[0] ?? null
    : null;
}

function deriveFulfillmentBindingForFinding(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly register: SdlcComponentDepthRegister;
  readonly finding: SdlcReviewGradeObligationFinding;
  readonly declaredRequirementRefs: readonly string[];
}): GtlContractFulfillmentBinding | null {
  const requirementRefForRowSelection = input.finding.obligationId.startsWith(
    "requirement:"
  )
    ? input.finding.obligationId
    : input.declaredRequirementRefs[0] ?? input.finding.obligationId;
  const row = selectComponentRowForObligation({
    register: input.register,
    obligationId: input.finding.obligationId,
    requirementRef: requirementRefForRowSelection
  });
  if (row === null) {
    return null;
  }
  const requirementRef = requirementRefForBinding({
    obligationId: input.finding.obligationId,
    row,
    declaredRequirementRefs: input.declaredRequirementRefs
  });
  const designObligationRef =
    row.sourceAssetRefs[0] ??
    input.finding.acceptedAuthorityRefs[0] ??
    input.finding.evidenceRefs[0] ??
    null;
  if (requirementRef === null || designObligationRef === null) {
    return null;
  }
  const outputSurfaceRef = workspaceRefForPath({
    workspaceRoot: input.manifest.workspaceRoot,
    absolutePath: input.manifest.outputFile
  });
  const productTargetRef = productTargetRefForRow({
    manifest: input.manifest,
    row
  });
  const gtlBinding = constructGtlContractFulfillmentBinding({
    obligationRef: input.finding.obligationId,
    requirementRef,
    productRequirementRef: requirementRef,
    designObligationRef,
    componentRef: row.componentId,
    productTargetRef,
    outputSurfaceRef,
    functionOrEntrypointRef: `${productTargetRef}#component:${row.componentId}`,
    realizationEvidenceRefs: Object.freeze([productTargetRef, outputSurfaceRef]),
    testOrExecutionEvidenceRefs: input.finding.evidenceRefs,
    evaluatorFindingRef: `evaluation-finding://odd-sdlc/review-grade/${encodeURIComponent(input.finding.obligationId)}`,
    authorityRefs: input.finding.acceptedAuthorityRefs,
    evidenceRefs: input.finding.evidenceRefs
  });
  return admitGtlContractFulfillmentBinding(gtlBinding);
}

function canonicalizeReviewAssessmentFulfillmentBindings(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly assessment: SdlcReviewGradeEdgeFulfillmentAssessment;
}): SdlcReviewGradeEdgeFulfillmentAssessment {
  if (input.manifest.targetAssetType !== "component_code_surface") {
    return input.assessment;
  }
  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: input.manifest.targetAssetType,
    outputFile: input.manifest.outputFile
  });
  if (admission.status !== "admitted" || admission.register === null) {
    return input.assessment;
  }
  const register = admission.register;
  const declaredRequirementRefs = input.manifest.traversalObligationContext.obligations
    .filter(
      (obligation) =>
        obligation.obligationKind === "requirement" ||
        obligation.obligationId.startsWith("requirement:")
    )
    .map((obligation) => obligation.obligationId);
  return Object.freeze({
    ...input.assessment,
    findings: Object.freeze(
      input.assessment.findings.map((finding) => {
        if (finding.fulfillmentStatus !== "fulfilled") {
          return finding;
        }
        const fulfillmentBinding = deriveFulfillmentBindingForFinding({
          manifest: input.manifest,
          register,
          finding,
          declaredRequirementRefs
        });
        return fulfillmentBinding === null
          ? finding
          : Object.freeze({
              ...finding,
              fulfillmentBinding
            });
      })
    )
  });
}

function assessmentValidationErrors(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly assessment: SdlcReviewGradeEdgeFulfillmentAssessment;
}): readonly string[] {
  const errors: string[] = [];
  const { manifest, assessment } = input;
  if (assessment.graphFunctionName !== manifest.graphFunctionName) {
    errors.push("review_grade_graph_function_mismatch");
  }
  if (assessment.edgeName !== manifest.edgeName) {
    errors.push("review_grade_edge_mismatch");
  }
  if (assessment.targetAssetType !== manifest.targetAssetType) {
    errors.push("review_grade_target_asset_mismatch");
  }
  const declared = new Set(
    manifest.traversalObligationContext.obligations.map(
      (obligation) => obligation.obligationId
    )
  );
  const declaredRequirementRefs = new Set(
    manifest.traversalObligationContext.obligations
      .filter(
        (obligation) =>
          obligation.obligationKind === "requirement" ||
          obligation.obligationId.startsWith("requirement:")
      )
      .map((obligation) => obligation.obligationId)
  );
  const reviewed = new Set(assessment.reviewedObligationIds);
  const findingsById = new Map(
    assessment.findings.map((finding) => [finding.obligationId, finding])
  );
  if (assessment.evidenceRefs.length === 0) {
    errors.push("review_grade_assessment_evidence_missing");
  }
  if (reviewed.size !== assessment.reviewedObligationIds.length) {
    errors.push("review_grade_reviewed_obligation_duplicate");
  }
  if (findingsById.size !== assessment.findings.length) {
    errors.push("review_grade_finding_duplicate");
  }
  const sparseRequirementCarryoverAllowed =
    reviewGradeTargetAllowsRequirementCarryover(manifest.targetAssetType);
  for (const obligation of manifest.traversalObligationContext.obligations) {
    const requirementObligation =
      obligation.obligationKind === "requirement" ||
      obligation.obligationId.startsWith("requirement:");
    if (
      !reviewed.has(obligation.obligationId) &&
      !(sparseRequirementCarryoverAllowed && requirementObligation)
    ) {
      errors.push(`review_grade_obligation_unreviewed:${obligation.obligationId}`);
    }
  }
  for (const obligationId of assessment.reviewedObligationIds) {
    if (!declared.has(obligationId)) {
      errors.push(`review_grade_obligation_extra:${obligationId}`);
    }
  }
  for (const finding of assessment.findings) {
    if (!declared.has(finding.obligationId)) {
      errors.push(`review_grade_finding_extra:${finding.obligationId}`);
    }
    if (finding.evidenceRefs.length === 0) {
      errors.push(`review_grade_finding_evidence_missing:${finding.obligationId}`);
    }
    if (finding.acceptedAuthorityRefs.length === 0) {
      errors.push(`review_grade_finding_authority_missing:${finding.obligationId}`);
    }
    if (
      finding.fulfillmentBinding !== null &&
      fulfillmentBindingContainsPromptNullSentinel(finding.fulfillmentBinding)
    ) {
      errors.push(`review_grade_fulfillment_binding_prompt_null:${finding.obligationId}`);
    }
    if (
      finding.fulfillmentBinding !== null &&
      !fulfillmentBindingRequirementRefAdmitted({
        obligationId: finding.obligationId,
        requirementRef: finding.fulfillmentBinding.requirementRef,
        productRequirementRef: finding.fulfillmentBinding.productRequirementRef,
        declaredRequirementRefs
      })
    ) {
      errors.push(`review_grade_fulfillment_binding_requirement_mismatch:${finding.obligationId}`);
    }
    if (
      manifest.targetAssetType === "component_code_surface" &&
      finding.fulfillmentStatus === "fulfilled" &&
      finding.fulfillmentBinding === null
    ) {
      errors.push(`review_grade_function_binding_missing:${finding.obligationId}`);
    }
    if (
      finding.fulfillmentBinding !== null &&
      finding.fulfillmentBinding.realizationEvidenceRefs.length === 0
    ) {
      errors.push(`review_grade_realization_evidence_missing:${finding.obligationId}`);
    }
    if (finding.fulfillmentStatus === "fulfilled") {
      if (finding.failureClass !== null) {
        errors.push(`review_grade_fulfilled_failure_class:${finding.obligationId}`);
      }
      if (finding.requiredAction !== null) {
        errors.push(`review_grade_fulfilled_required_action:${finding.obligationId}`);
      }
    } else {
      if (finding.failureClass === null) {
        errors.push(`review_grade_open_failure_class_missing:${finding.obligationId}`);
      }
      if (finding.requiredAction === null) {
        errors.push(`review_grade_open_required_action_missing:${finding.obligationId}`);
      }
    }
  }
  for (const obligationId of assessment.reviewedObligationIds) {
    if (!findingsById.has(obligationId)) {
      errors.push(`review_grade_finding_missing:${obligationId}`);
    }
  }
  if (
    assessment.status === "passed" &&
    assessment.findings.some((finding) => finding.fulfillmentStatus !== "fulfilled")
  ) {
    errors.push("review_grade_passed_with_open_findings");
  }
  if (
    assessment.status === "blocked" &&
    assessment.findings.every((finding) => finding.fulfillmentStatus === "fulfilled")
  ) {
    errors.push("review_grade_blocked_without_open_findings");
  }
  return uniqueSorted(errors);
}

export function admitReviewGradeEdgeFulfillmentAssessmentFromArtifact(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly outputFile: string;
}): SdlcReviewGradeEdgeFulfillmentAdmission {
  const evidenceRefs = Object.freeze([pathToFileURL(input.outputFile).href]);
  if (!reviewGradeEdgeFulfillmentAssessmentRequired(input.manifest)) {
    return Object.freeze({
      kind: "sdlc_review_grade_edge_fulfillment_admission" as const,
      status: "not_required" as const,
      targetAssetType: input.manifest.targetAssetType,
      assessment: null,
      blockingReasons: Object.freeze([]),
      evidenceRefs
    });
  }
  if (!existsSync(input.outputFile) || !statSync(input.outputFile).isFile()) {
    return Object.freeze({
      kind: "sdlc_review_grade_edge_fulfillment_admission" as const,
      status: "rejected" as const,
      targetAssetType: input.manifest.targetAssetType,
      assessment: null,
      blockingReasons: Object.freeze(["review_grade_assessment_missing"]),
      evidenceRefs
    });
  }
  let candidate: unknown;
  try {
    candidate = JSON.parse(readFileSync(input.outputFile, "utf8"));
  } catch {
    return Object.freeze({
      kind: "sdlc_review_grade_edge_fulfillment_admission" as const,
      status: "rejected" as const,
      targetAssetType: input.manifest.targetAssetType,
      assessment: null,
      blockingReasons: Object.freeze(["review_grade_assessment_json_required"]),
      evidenceRefs
    });
  }
  try {
    const assessment = canonicalizeReviewAssessmentFulfillmentBindings({
      manifest: input.manifest,
      assessment: parseReviewAssessment(candidate, "review_grade_assessment")
    });
    const errors = assessmentValidationErrors({
      manifest: input.manifest,
      assessment
    });
    if (errors.length > 0) {
      return Object.freeze({
        kind: "sdlc_review_grade_edge_fulfillment_admission" as const,
        status: "rejected" as const,
        targetAssetType: input.manifest.targetAssetType,
        assessment,
        blockingReasons: errors,
        evidenceRefs: uniqueSorted([...evidenceRefs, ...assessment.evidenceRefs])
      });
    }
    return Object.freeze({
      kind: "sdlc_review_grade_edge_fulfillment_admission" as const,
      status: "admitted" as const,
      targetAssetType: input.manifest.targetAssetType,
      assessment,
      blockingReasons: Object.freeze([]),
      evidenceRefs: uniqueSorted([...evidenceRefs, ...assessment.evidenceRefs])
    });
  } catch (error) {
    return Object.freeze({
      kind: "sdlc_review_grade_edge_fulfillment_admission" as const,
      status: "rejected" as const,
      targetAssetType: input.manifest.targetAssetType,
      assessment: null,
      blockingReasons: Object.freeze([
        `review_grade_assessment_invalid:${error instanceof Error ? error.message : String(error)}`
      ]),
      evidenceRefs
    });
  }
}
