// Implements: T-182

import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
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
  type SdlcReviewGradeObligationFinding,
  type SdlcRequirementFunctionFulfillmentBinding,
  type SdlcWorkerObligationAssessment,
  type SdlcWorkerHandoffManifest
} from "./carriers.js";
import {
  sdlcReviewGradeEdgeFulfillmentAssessmentRequired
} from "./edge_output_policy.js";
import { sha256Text } from "../shared/digest.js";

export const REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE =
  "review_grade_edge_fulfillment_assessment.json";

export const REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF =
  "evaluation-rule://odd-sdlc/review-grade-edge-fulfillment/fp";

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

export function reviewGradeFindingsAreDownstreamStagePressure(
  findings: readonly SdlcReviewGradeObligationFinding[]
): boolean {
  return (
    findings.length > 0 &&
    findings.every(
      (finding) =>
        finding.obligationId.startsWith("requirement:") &&
        finding.fulfillmentStatus === "partial" &&
        finding.failureClass === "wrong_stage"
    )
  );
}

export function reviewGradeEdgeFulfillmentOpenPressureRefs(input: {
  readonly runRef: string;
  readonly assessments: readonly SdlcWorkerObligationAssessment[];
}): readonly string[] {
  return uniqueSorted(
    input.assessments.flatMap((assessment) =>
      assessment.reviewGrade === true &&
      assessment.fulfillmentStatus !== "fulfilled" &&
      !(
        assessment.fulfillmentStatus === "partial" &&
        assessment.reviewFailureClass === "wrong_stage"
      )
        ? [
            `pressure://odd-sdlc/review-grade/${input.runRef}/${encodeURIComponent(assessment.obligationId)}`
          ]
        : []
    )
  );
}

export function reviewGradeEdgeFulfillmentAssessmentPressureRefs(input: {
  readonly runRef: string;
  readonly assessment: SdlcReviewGradeEdgeFulfillmentAssessment;
}): readonly string[] {
  const openFindings = input.assessment.findings.filter(
    (finding) => finding.fulfillmentStatus !== "fulfilled"
  );
  if (reviewGradeFindingsAreDownstreamStagePressure(openFindings)) {
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
  label: string
): SdlcRequirementFunctionFulfillmentBinding {
  const record = parseClosedRecord(input, label, [
    "kind",
    "requirementRef",
    "productRequirementRef",
    "designObligationRef",
    "componentRef",
    "productTargetRef",
    "codeSurfaceRef",
    "functionOrEntrypointRef",
    "realizationEvidenceRefs",
    "testOrExecutionEvidenceRefs",
    "evaluatorFindingRef"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_requirement_function_fulfillment_binding") {
    throw new TypeError(`${label}.kind: unexpected fulfillment binding kind`);
  }
  return Object.freeze({
    kind: "sdlc_requirement_function_fulfillment_binding" as const,
    requirementRef: parseNonEmptyString(
      record["requirementRef"],
      `${label}.requirementRef`
    ),
    productRequirementRef: parseNonEmptyString(
      record["productRequirementRef"],
      `${label}.productRequirementRef`
    ),
    designObligationRef: parseNonEmptyString(
      record["designObligationRef"],
      `${label}.designObligationRef`
    ),
    componentRef: parseNonEmptyString(record["componentRef"], `${label}.componentRef`),
    productTargetRef: parseNonEmptyString(
      record["productTargetRef"],
      `${label}.productTargetRef`
    ),
    codeSurfaceRef: parseNonEmptyString(
      record["codeSurfaceRef"],
      `${label}.codeSurfaceRef`
    ),
    functionOrEntrypointRef: parseNonEmptyString(
      record["functionOrEntrypointRef"],
      `${label}.functionOrEntrypointRef`
    ),
    realizationEvidenceRefs: parseStringList(
      record["realizationEvidenceRefs"],
      `${label}.realizationEvidenceRefs`
    ),
    testOrExecutionEvidenceRefs: parseStringList(
      record["testOrExecutionEvidenceRefs"],
      `${label}.testOrExecutionEvidenceRefs`
    ),
    evaluatorFindingRef: parseNonEmptyString(
      record["evaluatorFindingRef"],
      `${label}.evaluatorFindingRef`
    )
  });
}

function parseNullableFulfillmentBinding(
  input: unknown,
  label: string
): SdlcRequirementFunctionFulfillmentBinding | null {
  if (input === null) {
    return null;
  }
  return parseFulfillmentBinding(input, label);
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
  return Object.freeze({
    kind: "sdlc_review_grade_obligation_finding" as const,
    obligationId: parseNonEmptyString(record["obligationId"], `${label}.obligationId`),
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
      `${label}.fulfillmentBinding`
    ),
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
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`),
    summary: parseNonEmptyString(record["summary"], `${label}.summary`)
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
  for (const obligation of manifest.traversalObligationContext.obligations) {
    if (!reviewed.has(obligation.obligationId)) {
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
      finding.fulfillmentBinding.requirementRef !== finding.obligationId
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
    const assessment = parseReviewAssessment(candidate, "review_grade_assessment");
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
