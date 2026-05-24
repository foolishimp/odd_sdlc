// Implements: T-182

import { existsSync, readFileSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import {
  SDLC_REVIEW_GRADE_FAILURE_CLASSES,
  type SdlcReviewGradeEdgeFulfillmentAdmission,
  type SdlcReviewGradeEdgeFulfillmentAssessment,
  type SdlcReviewGradeObligationFinding,
  type SdlcWorkerHandoffManifest
} from "./carriers.js";

export const REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE =
  "review_grade_edge_fulfillment_assessment.json";

export const REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF =
  "evaluation-rule://odd-sdlc/review-grade-edge-fulfillment/fp";

function frameworkOwnedEvaluationTarget(targetAssetType: string): boolean {
  return (
    targetAssetType === "component_realization_qualification_surface" ||
    targetAssetType === "test_execution_surface" ||
    targetAssetType === "test_execution_result_surface" ||
    targetAssetType === "component_test_qualification_surface" ||
    targetAssetType === "test_run_archive_surface" ||
    targetAssetType === "release_depth_parity_surface"
  );
}

export function reviewGradeEdgeFulfillmentAssessmentRequired(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return (
    manifest.fpTransformRequest !== null &&
    !frameworkOwnedEvaluationTarget(manifest.targetAssetType) &&
    manifest.outputFile.trim().length > 0 &&
    manifest.traversalObligationContext.obligations.length > 0
  );
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

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort((left, right) => left.localeCompare(right)));
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
