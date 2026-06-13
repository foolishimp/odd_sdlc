// Implements: T-162

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync
} from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const SDLC_TICKET_WORKFLOW_DIRECTORIES = Object.freeze([
  "backlog",
  "active",
  "completed"
] as const);

export const SDLC_TICKET_WORKFLOW_FD_RULE_REF =
  "evaluation-rule://odd-sdlc/ticket-workflow/fd" as const;

export type SdlcTicketWorkflowDirectory =
  (typeof SDLC_TICKET_WORKFLOW_DIRECTORIES)[number];

export const SDLC_TICKET_REQUIRED_FIELDS = Object.freeze([
  "id",
  "title",
  "type",
  "ticket_category",
  "status",
  "goal",
  "change_intent",
  "change_class",
  "re_entry_point",
  "triaged_at",
  "created_at",
  "updated_at"
] as const);

export type SdlcTicketRequiredField =
  (typeof SDLC_TICKET_REQUIRED_FIELDS)[number];

export type SdlcTicketDeclaredStatus =
  | "backlog"
  | "active"
  | "blocked"
  | "completed";

export type SdlcTicketWorkflowRowStatus =
  | "valid"
  | "blocked"
  | "malformed"
  | "stale";

export type SdlcTicketExecutionBlockingReason =
  | "ticket_missing"
  | "ticket_malformed"
  | "ticket_not_active"
  | "ticket_stale"
  | "ticket_unadmitted";

export type SdlcTicketReviewDecisionRuling =
  | "accepted"
  | "rejected"
  | "deferred"
  | "split_ticket";

export type SdlcTicketBugFirstMissingLayer =
  | "goal"
  | "intent"
  | "product"
  | "requirement"
  | "design"
  | "realization"
  | "runtime"
  | "proof";

export type SdlcOverlayContinuationRuling =
  | "close"
  | "repair"
  | "split_ticket"
  | "depth_traversal"
  | "defer"
  | "block"
  | "unruled";

export interface SdlcTicketWorkflowDiagnostic {
  readonly kind: "sdlc_ticket_workflow_diagnostic";
  readonly code:
    | "missing_required_field"
    | "invalid_status"
    | "directory_status_mismatch"
    | "duplicate_ticket_id"
    | "invalid_ticket_id"
    | "missing_governing_requirement"
    | "missing_governing_design"
    | "unknown_reviewer_profile"
    | "unavailable_reviewer_profile"
    | "schema_incompatible_reviewer_profile"
    | "missing_review_decision_ruling"
    | "missing_bug_triage_field"
    | "missing_spec_change_field"
    | "missing_overlay_continuation_field";
  readonly field: string | null;
  readonly detail: string;
}

export interface SdlcReviewFindingDecisionRow {
  readonly kind: "sdlc_review_finding_decision_row";
  readonly decisionRef: string;
  readonly findingRef: string;
  readonly reviewerProfileId: string | null;
  readonly reviewerProfileConfigDigest: string | null;
  readonly panelBindingRef: string | null;
  readonly invocationRef: string | null;
  readonly outputDigest: string | null;
  readonly severity: string;
  readonly ruling: SdlcTicketReviewDecisionRuling;
  readonly acceptedChangeScope: string | null;
  readonly proofRequired: string | null;
  readonly splitTicketRef: string | null;
  readonly evidenceRefs: readonly string[];
}

export interface SdlcBugTriageRow {
  readonly kind: "sdlc_bug_triage_row";
  readonly bugRef: string;
  readonly expectedBehavior: string;
  readonly actualBehavior: string;
  readonly reproductionRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly firstMissingLayer: SdlcTicketBugFirstMissingLayer;
  readonly changeClass: string;
  readonly reEntryPoint: string;
  readonly governingRequirementRefs: readonly string[];
  readonly governingDesignRefs: readonly string[];
}

export interface SdlcSpecChangeRow {
  readonly kind: "sdlc_spec_change_row";
  readonly specChangeRef: string;
  readonly targetSpecSurface: string;
  readonly currentTruth: string;
  readonly targetTruth: string;
  readonly sourceDocumentRefs: readonly string[];
  readonly changeClass: string;
  readonly reEntryPoint: string;
  readonly proofSurface: string;
  readonly closureLaw: string;
}

export interface SdlcOverlaySegmentContinuationRow {
  readonly kind: "sdlc_overlay_segment_continuation_row";
  readonly continuationRef: string;
  readonly sourceSegmentCompletionRef: string;
  readonly productConverged: false;
  readonly terminalGraphFunctionRefs: readonly string[];
  readonly terminalAssetRefs: readonly string[];
  readonly remainingGraphPressureRefs: readonly string[];
  readonly remainingRequirementPressureRefs: readonly string[];
  readonly remainingAssetPressureRefs: readonly string[];
  readonly nextEligibleOverlayRefs: readonly string[];
  readonly selectedStartTargetRef: "overlay://odd-sdlc/current-full-traversal";
  readonly ruling: SdlcOverlayContinuationRuling;
  readonly proofExpectation: string;
}

export interface SdlcReviewerProfile {
  readonly kind: "sdlc_reviewer_profile";
  readonly profileId: "codex" | "claude";
  readonly profileRef: string;
  readonly displayName: string;
  readonly available: boolean;
  readonly outputSchemaRef: string;
  readonly configDigest: string;
  readonly evidenceContractRefs: readonly string[];
}

export interface SdlcReviewPanelBinding {
  readonly kind: "sdlc_review_panel_binding";
  readonly panelBindingRef: string;
  readonly ticketId: string;
  readonly requiredReviewerProfileIds: readonly string[];
  readonly optionalReviewerProfileIds: readonly string[];
  readonly reductionPolicy: "all_required" | "single_required" | "manual_ruling";
  readonly fallbackPolicy: "block" | "defer" | "manual_review";
  readonly reviewerProfileRefs: readonly string[];
  readonly reviewerProfileConfigDigests: readonly string[];
  readonly blockingReasons: readonly SdlcTicketExecutionBlockingReason[];
  readonly diagnostics: readonly SdlcTicketWorkflowDiagnostic[];
}

export interface SdlcTicketWorkflowRow {
  readonly kind: "sdlc_ticket_workflow_row";
  readonly rowRef: string;
  readonly ticketId: string;
  readonly title: string | null;
  readonly type: string | null;
  readonly ticketCategory: string | null;
  readonly declaredStatus: string | null;
  readonly directory: SdlcTicketWorkflowDirectory;
  readonly workflowStatus: SdlcTicketWorkflowRowStatus;
  readonly nextLawfulAction:
    | "admit_execution_contract"
    | "resolve_blocking_ticket_truth"
    | "promote_or_reopen_before_execution"
    | "closed_read_only";
  readonly filePath: string;
  readonly fileUri: string;
  readonly ticketDigest: string;
  readonly missingRequiredFields: readonly SdlcTicketRequiredField[];
  readonly diagnostics: readonly SdlcTicketWorkflowDiagnostic[];
  readonly sourceDocuments: readonly string[];
  readonly targetTruth: string | null;
  readonly supersededTruth: string | null;
  readonly closureLaw: string | null;
  readonly evaluationCriteria: readonly string[];
  readonly nonClosureConditions: readonly string[];
  readonly changeClass: string | null;
  readonly reEntryPoint: string | null;
  readonly reviewDecisionRows: readonly SdlcReviewFindingDecisionRow[];
  readonly bugTriageRows: readonly SdlcBugTriageRow[];
  readonly specChangeRows: readonly SdlcSpecChangeRow[];
  readonly overlayContinuationRows: readonly SdlcOverlaySegmentContinuationRow[];
  readonly reviewPanelBinding: SdlcReviewPanelBinding | null;
}

export interface SdlcTicketWorkflowProjection {
  readonly kind: "sdlc_ticket_workflow_projection";
  readonly readOnly: true;
  readonly choosesNextTraversal: false;
  readonly sourceRoot: string;
  readonly sourceRootUri: string;
  readonly sourceDirectories: readonly SdlcTicketWorkflowDirectory[];
  readonly requiredFields: readonly SdlcTicketRequiredField[];
  readonly rows: readonly SdlcTicketWorkflowRow[];
  readonly reviewerProfiles: readonly SdlcReviewerProfile[];
  readonly counts: {
    readonly backlog: number;
    readonly active: number;
    readonly blocked: number;
    readonly completed: number;
    readonly malformed: number;
    readonly stale: number;
  };
  readonly diagnostics: readonly SdlcTicketWorkflowDiagnostic[];
  readonly emittedRuntimeEventKinds: readonly [];
}

export interface SdlcTicketExecutionContract {
  readonly kind: "sdlc_ticket_execution_contract";
  readonly executionContractRef: string;
  readonly ticketId: string;
  readonly ticketRef: string;
  readonly ticketPath: string;
  readonly ticketUri: string;
  readonly ticketDigest: string;
  readonly sourceDocuments: readonly string[];
  readonly targetTruth: string;
  readonly supersededTruth: string | null;
  readonly closureLaw: string;
  readonly evaluationCriteria: readonly string[];
  readonly nonClosureConditions: readonly string[];
  readonly changeClass: string;
  readonly reEntryPoint: string;
  readonly reviewPanelBinding: SdlcReviewPanelBinding | null;
  readonly reviewDecisionRows: readonly SdlcReviewFindingDecisionRow[];
  readonly bugTriageRows: readonly SdlcBugTriageRow[];
  readonly specChangeRows: readonly SdlcSpecChangeRow[];
  readonly overlayContinuationRows: readonly SdlcOverlaySegmentContinuationRow[];
  readonly rulingRefs: readonly string[];
  readonly reviewerProfileIds: readonly string[];
  readonly reviewerProfileConfigDigests: readonly string[];
  readonly overlayContinuationRefs: readonly string[];
}

export type SdlcTicketAssetStartResolution =
  | {
      readonly kind: "not_ticket_asset";
    }
  | {
      readonly kind: "admitted";
      readonly contract: SdlcTicketExecutionContract;
    }
  | {
      readonly kind: "blocked";
      readonly blockingReason: SdlcTicketExecutionBlockingReason;
      readonly diagnostics: readonly SdlcTicketWorkflowDiagnostic[];
    };

type FieldValue = string | readonly string[];

type FieldMap = ReadonlyMap<string, FieldValue>;

const SDLC_TICKET_DECLARED_STATUS_VALUES = Object.freeze([
  "backlog",
  "active",
  "blocked",
  "completed"
] as const);

const SDLC_TICKET_DECLARED_STATUS_SET: ReadonlySet<string> = new Set(
  SDLC_TICKET_DECLARED_STATUS_VALUES
);

function sha256Text(content: string): string {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
}

function refPart(input: string): string {
  return encodeURIComponent(input.replace(/^sha256:/u, ""));
}

function normalizeTicketId(input: string): string {
  return input.trim().toUpperCase();
}

function isStringList(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === "string")
  );
}

function fieldString(fields: FieldMap, key: string): string | null {
  const value = fields.get(key);
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }
  if (isStringList(value)) {
    const joined = value.join("\n").trim();
    return joined.length === 0 ? null : joined;
  }
  return null;
}

function fieldList(fields: FieldMap, key: string): readonly string[] {
  const value = fields.get(key);
  if (isStringList(value)) {
    return Object.freeze(value.map((item) => item.trim()).filter(Boolean));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length === 0 ? Object.freeze([]) : Object.freeze([trimmed]);
  }
  return Object.freeze([]);
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseBracketList(value: string): readonly string[] | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return null;
  }
  const body = trimmed.slice(1, -1).trim();
  if (body.length === 0) {
    return Object.freeze([]);
  }
  return Object.freeze(body.split(",").map(stripQuotes).filter(Boolean));
}

function parseTicketFrontMatter(content: string): FieldMap {
  if (!content.startsWith("---")) {
    return new Map();
  }
  const lines = content.split(/\r?\n/u);
  let index = 1;
  const fields = new Map<string, FieldValue>();
  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.trim() === "---") {
      break;
    }
    const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/u.exec(line);
    if (match === null) {
      index += 1;
      continue;
    }
    const key = match[1] ?? "";
    const rawValue = match[2] ?? "";
    if (rawValue === "|" || rawValue === ">") {
      const blockLines: string[] = [];
      index += 1;
      while (index < lines.length) {
        const candidate = lines[index] ?? "";
        if (candidate.trim() === "---") {
          break;
        }
        if (/^[A-Za-z0-9_-]+:/u.test(candidate)) {
          index -= 1;
          break;
        }
        blockLines.push(candidate.replace(/^\s{2}/u, ""));
        index += 1;
      }
      fields.set(key, blockLines.join("\n").trim());
    } else if (rawValue.trim().length === 0) {
      const values: string[] = [];
      index += 1;
      while (index < lines.length) {
        const candidate = lines[index] ?? "";
        const listMatch = /^\s*-\s+(.*)$/u.exec(candidate);
        if (listMatch === null) {
          index -= 1;
          break;
        }
        values.push(stripQuotes(listMatch[1] ?? ""));
        index += 1;
      }
      fields.set(key, Object.freeze(values));
    } else {
      fields.set(key, parseBracketList(rawValue) ?? stripQuotes(rawValue));
    }
    index += 1;
  }
  return fields;
}

function parseBulletMetadata(content: string): FieldMap {
  const fields = new Map<string, FieldValue>();
  for (const line of content.split(/\r?\n/u)) {
    const match = /^-\s+([A-Za-z0-9_-]+):\s*(.*)$/u.exec(line);
    if (match === null) {
      continue;
    }
    fields.set(match[1] ?? "", stripQuotes(match[2] ?? ""));
  }
  return fields;
}

function mergeFields(frontMatter: FieldMap, bulletMetadata: FieldMap): FieldMap {
  const fields = new Map<string, FieldValue>(bulletMetadata);
  for (const [key, value] of frontMatter) {
    fields.set(key, value);
  }
  return fields;
}

function fieldsFromContent(content: string): FieldMap {
  return mergeFields(parseTicketFrontMatter(content), parseBulletMetadata(content));
}

function diagnostic(input: {
  readonly code: SdlcTicketWorkflowDiagnostic["code"];
  readonly field?: string | null;
  readonly detail: string;
}): SdlcTicketWorkflowDiagnostic {
  return Object.freeze({
    kind: "sdlc_ticket_workflow_diagnostic" as const,
    code: input.code,
    field: input.field ?? null,
    detail: input.detail
  });
}

function requiredFieldDiagnostics(fields: FieldMap): readonly SdlcTicketWorkflowDiagnostic[] {
  return Object.freeze(
    SDLC_TICKET_REQUIRED_FIELDS.flatMap((field) =>
      fieldString(fields, field) === null
        ? [
            diagnostic({
              code: "missing_required_field",
              field,
              detail: `ticket missing required TICKET_METHOD field ${field}`
            })
          ]
        : []
    )
  );
}

function statusDiagnostics(input: {
  readonly fields: FieldMap;
  readonly directory: SdlcTicketWorkflowDirectory;
}): readonly SdlcTicketWorkflowDiagnostic[] {
  const status = fieldString(input.fields, "status");
  if (status === null) {
    return Object.freeze([]);
  }
  if (!SDLC_TICKET_DECLARED_STATUS_SET.has(status)) {
    return Object.freeze([
      diagnostic({
        code: "invalid_status",
        field: "status",
        detail: `ticket declares unsupported status ${status}`
      })
    ]);
  }
  if (status === "blocked" && input.directory !== "active") {
    return Object.freeze([
      diagnostic({
        code: "directory_status_mismatch",
        field: "status",
        detail: "blocked tickets must remain in the active ticket directory"
      })
    ]);
  }
  if (status !== "blocked" && status !== input.directory) {
    return Object.freeze([
      diagnostic({
        code: "directory_status_mismatch",
        field: "status",
        detail: `ticket status ${status} does not match ${input.directory} directory`
      })
    ]);
  }
  return Object.freeze([]);
}

function ticketIdDiagnostics(ticketId: string | null): readonly SdlcTicketWorkflowDiagnostic[] {
  if (ticketId === null) {
    return Object.freeze([]);
  }
  if (/^[A-Z]-\d+$/u.test(normalizeTicketId(ticketId))) {
    return Object.freeze([]);
  }
  return Object.freeze([
    diagnostic({
      code: "invalid_ticket_id",
      field: "id",
      detail: `ticket id ${ticketId} does not match governed ticket id shape`
    })
  ]);
}

function reviewDecisionRows(input: {
  readonly ticketId: string;
  readonly fields: FieldMap;
}): readonly SdlcReviewFindingDecisionRow[] {
  const findingRefs = fieldList(input.fields, "review_finding_refs");
  const rulingValues = fieldList(input.fields, "review_finding_rulings");
  const severities = fieldList(input.fields, "review_finding_severities");
  const evidenceRefs = fieldList(input.fields, "review_evidence_refs");
  const reviewerProfileId = fieldString(input.fields, "reviewer_profile_id");
  const reviewerProfileConfigDigest = fieldString(
    input.fields,
    "reviewer_profile_config_digest"
  );
  const panelBindingRef = fieldString(input.fields, "review_panel_binding_ref");
  const invocationRef = fieldString(input.fields, "reviewer_invocation_ref");
  const outputDigest = fieldString(input.fields, "reviewer_output_digest");
  const acceptedScopes = fieldList(input.fields, "accepted_change_scopes");
  const proofRequired = fieldList(input.fields, "review_proof_required");
  const splitTickets = fieldList(input.fields, "split_ticket_refs");
  return Object.freeze(
    findingRefs.map((findingRef, index) => {
      const ruling = reviewRuling(rulingValues[index] ?? "deferred");
      return Object.freeze({
        kind: "sdlc_review_finding_decision_row" as const,
        decisionRef: `review-decision://odd-sdlc/${input.ticketId}/${index + 1}`,
        findingRef,
        reviewerProfileId,
        reviewerProfileConfigDigest,
        panelBindingRef,
        invocationRef,
        outputDigest,
        severity: severities[index] ?? "unspecified",
        ruling,
        acceptedChangeScope: acceptedScopes[index] ?? null,
        proofRequired: proofRequired[index] ?? null,
        splitTicketRef:
          splitTickets[index] ??
          (ruling === "split_ticket" ? splitTickets[0] ?? null : null),
        evidenceRefs
      });
    })
  );
}

function reviewRuling(input: string): SdlcTicketReviewDecisionRuling {
  if (
    input === "accepted" ||
    input === "rejected" ||
    input === "deferred" ||
    input === "split_ticket"
  ) {
    return input;
  }
  return "deferred";
}

function bugFirstMissingLayer(input: string | null): SdlcTicketBugFirstMissingLayer {
  if (
    input === "goal" ||
    input === "intent" ||
    input === "product" ||
    input === "requirement" ||
    input === "design" ||
    input === "realization" ||
    input === "runtime" ||
    input === "proof"
  ) {
    return input;
  }
  return "proof";
}

function bugTriageRows(input: {
  readonly ticketId: string;
  readonly fields: FieldMap;
}): readonly SdlcBugTriageRow[] {
  const expectedBehavior = fieldString(input.fields, "expected_behavior");
  const actualBehavior = fieldString(input.fields, "actual_behavior");
  const reproductionRefs = fieldList(input.fields, "reproduction_refs");
  const evidenceRefs = fieldList(input.fields, "bug_evidence_refs");
  if (
    expectedBehavior === null &&
    actualBehavior === null &&
    reproductionRefs.length === 0 &&
    evidenceRefs.length === 0
  ) {
    return Object.freeze([]);
  }
  return Object.freeze([
    Object.freeze({
      kind: "sdlc_bug_triage_row" as const,
      bugRef: `bug-triage://odd-sdlc/${input.ticketId}/1`,
      expectedBehavior: expectedBehavior ?? "",
      actualBehavior: actualBehavior ?? "",
      reproductionRefs,
      evidenceRefs,
      firstMissingLayer: bugFirstMissingLayer(
        fieldString(input.fields, "first_missing_layer")
      ),
      changeClass: fieldString(input.fields, "change_class") ?? "",
      reEntryPoint: fieldString(input.fields, "re_entry_point") ?? "",
      governingRequirementRefs: fieldList(input.fields, "governing_requirement_refs"),
      governingDesignRefs: fieldList(input.fields, "governing_design_refs")
    })
  ]);
}

function specChangeRows(input: {
  readonly ticketId: string;
  readonly fields: FieldMap;
}): readonly SdlcSpecChangeRow[] {
  const targetSpecSurface = fieldString(input.fields, "target_spec_surface");
  const currentTruth = fieldString(input.fields, "current_truth");
  const targetTruth = fieldString(input.fields, "target_truth");
  const proofSurface = fieldString(input.fields, "proof_surface");
  if (
    targetSpecSurface === null &&
    currentTruth === null &&
    proofSurface === null
  ) {
    return Object.freeze([]);
  }
  return Object.freeze([
    Object.freeze({
      kind: "sdlc_spec_change_row" as const,
      specChangeRef: `spec-change://odd-sdlc/${input.ticketId}/1`,
      targetSpecSurface: targetSpecSurface ?? "",
      currentTruth: currentTruth ?? "",
      targetTruth: targetTruth ?? "",
      sourceDocumentRefs: fieldList(input.fields, "source_documents"),
      changeClass: fieldString(input.fields, "change_class") ?? "",
      reEntryPoint: fieldString(input.fields, "re_entry_point") ?? "",
      proofSurface: proofSurface ?? "",
      closureLaw: fieldString(input.fields, "closure_law") ?? ""
    })
  ]);
}

function overlayContinuationRuling(input: string | null): SdlcOverlayContinuationRuling {
  if (
    input === "close" ||
    input === "repair" ||
    input === "split_ticket" ||
    input === "depth_traversal" ||
    input === "defer" ||
    input === "block"
  ) {
    return input;
  }
  return "unruled";
}

function overlayContinuationRows(input: {
  readonly ticketId: string;
  readonly fields: FieldMap;
}): readonly SdlcOverlaySegmentContinuationRow[] {
  const sourceSegmentCompletionRef = fieldString(
    input.fields,
    "source_overlay_segment_completion_ref"
  );
  const remainingGraphPressureRefs = fieldList(
    input.fields,
    "remaining_graph_pressure_refs"
  );
  const remainingRequirementPressureRefs = fieldList(
    input.fields,
    "remaining_requirement_pressure_refs"
  );
  const remainingAssetPressureRefs = fieldList(
    input.fields,
    "remaining_asset_pressure_refs"
  );
  const nextEligibleOverlayRefs = fieldList(
    input.fields,
    "next_eligible_overlay_refs"
  );
  if (
    sourceSegmentCompletionRef === null &&
    remainingGraphPressureRefs.length === 0 &&
    remainingRequirementPressureRefs.length === 0 &&
    remainingAssetPressureRefs.length === 0 &&
    nextEligibleOverlayRefs.length === 0
  ) {
    return Object.freeze([]);
  }
  return Object.freeze([
    Object.freeze({
      kind: "sdlc_overlay_segment_continuation_row" as const,
      continuationRef: `overlay-continuation://odd-sdlc/${input.ticketId}/1`,
      sourceSegmentCompletionRef: sourceSegmentCompletionRef ?? "",
      productConverged: false as const,
      terminalGraphFunctionRefs: fieldList(
        input.fields,
        "terminal_graph_function_refs"
      ),
      terminalAssetRefs: fieldList(input.fields, "terminal_asset_refs"),
      remainingGraphPressureRefs,
      remainingRequirementPressureRefs,
      remainingAssetPressureRefs,
      nextEligibleOverlayRefs,
      selectedStartTargetRef:
        "overlay://odd-sdlc/current-full-traversal" as const,
      ruling: overlayContinuationRuling(
        fieldString(input.fields, "overlay_continuation_ruling")
      ),
      proofExpectation:
        fieldString(input.fields, "overlay_continuation_proof_expectation") ??
        "review/triage must rule the continuation before product convergence"
    })
  ]);
}

function defaultReviewerProfiles(): readonly SdlcReviewerProfile[] {
  const profiles = [
    {
      profileId: "codex" as const,
      displayName: "Codex",
      available: true,
      outputSchemaRef: "schema://odd-sdlc/reviewer-output/ticket-review-v1",
      evidenceContractRefs: Object.freeze([
        "evidence-contract://odd-sdlc/reviewer/findings",
        "evidence-contract://odd-sdlc/reviewer/line-citations"
      ])
    },
    {
      profileId: "claude" as const,
      displayName: "Claude",
      available: true,
      outputSchemaRef: "schema://odd-sdlc/reviewer-output/ticket-review-v1",
      evidenceContractRefs: Object.freeze([
        "evidence-contract://odd-sdlc/reviewer/findings",
        "evidence-contract://odd-sdlc/reviewer/line-citations"
      ])
    }
  ];
  return Object.freeze(
    profiles.map((profile) => {
      const digest = sha256Text(JSON.stringify(profile));
      return Object.freeze({
        kind: "sdlc_reviewer_profile" as const,
        profileId: profile.profileId,
        profileRef: `reviewer-profile://odd-sdlc/${profile.profileId}`,
        displayName: profile.displayName,
        available: profile.available,
        outputSchemaRef: profile.outputSchemaRef,
        configDigest: digest,
      evidenceContractRefs: profile.evidenceContractRefs
      });
    })
  );
}

function reviewPanelBinding(input: {
  readonly ticketId: string;
  readonly fields: FieldMap;
  readonly profiles: readonly SdlcReviewerProfile[];
}): SdlcReviewPanelBinding | null {
  const requiredReviewerProfileIds = fieldList(
    input.fields,
    "required_reviewer_profile_ids"
  );
  const optionalReviewerProfileIds = fieldList(
    input.fields,
    "optional_reviewer_profile_ids"
  );
  if (
    requiredReviewerProfileIds.length === 0 &&
    optionalReviewerProfileIds.length === 0
  ) {
    return null;
  }
  const byId = new Map<string, SdlcReviewerProfile>(
    input.profiles.map((profile) => [profile.profileId, profile])
  );
  const diagnostics: SdlcTicketWorkflowDiagnostic[] = [];
  const selectedProfiles = [...requiredReviewerProfileIds, ...optionalReviewerProfileIds]
    .map((profileId) => {
      const profile = byId.get(profileId) ?? null;
      if (profile === null) {
        diagnostics.push(
          diagnostic({
            code: "unknown_reviewer_profile",
            field: "required_reviewer_profile_ids",
            detail: `unknown reviewer profile ${profileId}`
          })
        );
        return null;
      }
      if (!profile.available) {
        diagnostics.push(
          diagnostic({
            code: "unavailable_reviewer_profile",
            field: "required_reviewer_profile_ids",
            detail: `reviewer profile ${profileId} is unavailable`
          })
        );
      }
      if (profile.outputSchemaRef.length === 0) {
        diagnostics.push(
          diagnostic({
            code: "schema_incompatible_reviewer_profile",
            field: "required_reviewer_profile_ids",
            detail: `reviewer profile ${profileId} has no output schema`
          })
        );
      }
      return profile;
    })
    .filter((profile): profile is SdlcReviewerProfile => profile !== null);
  return Object.freeze({
    kind: "sdlc_review_panel_binding" as const,
    panelBindingRef: `review-panel-binding://odd-sdlc/${input.ticketId}`,
    ticketId: input.ticketId,
    requiredReviewerProfileIds,
    optionalReviewerProfileIds,
    reductionPolicy: "all_required",
    fallbackPolicy: "block",
    reviewerProfileRefs: Object.freeze(
      selectedProfiles.map((profile) => profile.profileRef)
    ),
    reviewerProfileConfigDigests: Object.freeze(
      selectedProfiles.map((profile) => profile.configDigest)
    ),
    blockingReasons: Object.freeze(
      diagnostics.length === 0 ? [] : ["ticket_unadmitted" as const]
    ),
    diagnostics: Object.freeze(diagnostics)
  });
}

function rowStatus(input: {
  readonly declaredStatus: string | null;
  readonly diagnostics: readonly SdlcTicketWorkflowDiagnostic[];
}): SdlcTicketWorkflowRowStatus {
  if (
    input.diagnostics.some(
      (entry) =>
        entry.code === "missing_required_field" ||
        entry.code === "invalid_status" ||
        entry.code === "invalid_ticket_id"
    )
  ) {
    return "malformed";
  }
  if (
    input.diagnostics.some((entry) => entry.code === "directory_status_mismatch")
  ) {
    return "stale";
  }
  if (input.declaredStatus === "blocked") {
    return "blocked";
  }
  return "valid";
}

function nextLawfulAction(input: {
  readonly directory: SdlcTicketWorkflowDirectory;
  readonly workflowStatus: SdlcTicketWorkflowRowStatus;
}): SdlcTicketWorkflowRow["nextLawfulAction"] {
  if (input.workflowStatus === "malformed" || input.workflowStatus === "stale") {
    return "resolve_blocking_ticket_truth";
  }
  if (input.workflowStatus === "blocked") {
    return "resolve_blocking_ticket_truth";
  }
  if (input.directory === "active") {
    return "admit_execution_contract";
  }
  if (input.directory === "completed") {
    return "closed_read_only";
  }
  return "promote_or_reopen_before_execution";
}

function projectTicketFile(input: {
  readonly workspaceRoot: string;
  readonly directory: SdlcTicketWorkflowDirectory;
  readonly filePath: string;
  readonly profiles: readonly SdlcReviewerProfile[];
}): SdlcTicketWorkflowRow {
  const content = readFileSync(input.filePath, "utf8");
  const fields = fieldsFromContent(content);
  const ticketDigest = sha256Text(content);
  const ticketId = normalizeTicketId(
    fieldString(fields, "id") ?? path.basename(input.filePath, ".md")
  );
  const requiredDiagnostics = requiredFieldDiagnostics(fields);
  const diagnostics = [
    ...requiredDiagnostics,
    ...statusDiagnostics({
      fields,
      directory: input.directory
    }),
    ...ticketIdDiagnostics(fieldString(fields, "id"))
  ];
  const panelBinding = reviewPanelBinding({
    ticketId,
    fields,
    profiles: input.profiles
  });
  if (panelBinding !== null) {
    diagnostics.push(...panelBinding.diagnostics);
  }
  const bugs = bugTriageRows({ ticketId, fields });
  for (const bug of bugs) {
    if (bug.expectedBehavior.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_bug_triage_field",
          field: "expected_behavior",
          detail: "bug triage requires expected behavior"
        })
      );
    }
    if (bug.actualBehavior.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_bug_triage_field",
          field: "actual_behavior",
          detail: "bug triage requires actual behavior"
        })
      );
    }
    if (bug.reproductionRefs.length === 0 && bug.evidenceRefs.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_bug_triage_field",
          field: "reproduction_refs",
          detail: "bug triage requires reproduction or evidence refs"
        })
      );
    }
    if (bug.changeClass === "realization_refactor") {
      if (bug.governingRequirementRefs.length === 0) {
        diagnostics.push(
          diagnostic({
            code: "missing_governing_requirement",
            field: "governing_requirement_refs",
            detail: "realization_refactor bug admission requires requirement authority"
          })
        );
      }
      if (bug.governingDesignRefs.length === 0) {
        diagnostics.push(
          diagnostic({
            code: "missing_governing_design",
            field: "governing_design_refs",
            detail: "realization_refactor bug admission requires design authority"
          })
        );
      }
    }
  }
  const specs = specChangeRows({ ticketId, fields });
  for (const spec of specs) {
    if (spec.targetSpecSurface.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_spec_change_field",
          field: "target_spec_surface",
          detail: "spec-change row requires target specification surface"
        })
      );
    }
    if (spec.currentTruth.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_spec_change_field",
          field: "current_truth",
          detail: "spec-change row requires current truth"
        })
      );
    }
    if (spec.targetTruth.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_spec_change_field",
          field: "target_truth",
          detail: "spec-change row requires target truth"
        })
      );
    }
    if (spec.sourceDocumentRefs.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_spec_change_field",
          field: "source_documents",
          detail: "spec-change row requires source documents"
        })
      );
    }
    if (spec.proofSurface.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_spec_change_field",
          field: "proof_surface",
          detail: "spec-change row requires proof surface"
        })
      );
    }
  }
  const continuations = overlayContinuationRows({ ticketId, fields });
  for (const continuation of continuations) {
    if (continuation.sourceSegmentCompletionRef.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_overlay_continuation_field",
          field: "source_overlay_segment_completion_ref",
          detail: "overlay continuation requires source segment completion ref"
        })
      );
    }
    if (
      continuation.remainingGraphPressureRefs.length === 0 &&
      continuation.remainingRequirementPressureRefs.length === 0 &&
      continuation.remainingAssetPressureRefs.length === 0
    ) {
      diagnostics.push(
        diagnostic({
          code: "missing_overlay_continuation_field",
          field: "remaining_graph_pressure_refs",
          detail: "overlay continuation requires remaining pressure refs"
        })
      );
    }
    if (continuation.nextEligibleOverlayRefs.length === 0) {
      diagnostics.push(
        diagnostic({
          code: "missing_overlay_continuation_field",
          field: "next_eligible_overlay_refs",
          detail: "overlay continuation requires next eligible overlay refs"
        })
      );
    }
    if (continuation.ruling === "unruled") {
      diagnostics.push(
        diagnostic({
          code: "missing_overlay_continuation_field",
          field: "overlay_continuation_ruling",
          detail:
            "overlay continuation requires a close, repair, split_ticket, depth_traversal, defer, or block ruling"
        })
      );
    }
  }
  const declaredStatus = fieldString(fields, "status");
  const workflowStatus = rowStatus({ declaredStatus, diagnostics });
  const sourceDocuments = fieldList(fields, "source_documents");
  const evaluationCriteria = fieldList(fields, "evaluation_criteria");
  const nonClosureConditions = fieldList(fields, "non_closure_conditions");
  return Object.freeze({
    kind: "sdlc_ticket_workflow_row" as const,
    rowRef: `ticket-workflow-row://odd-sdlc/${ticketId}/${refPart(ticketDigest)}`,
    ticketId,
    title: fieldString(fields, "title"),
    type: fieldString(fields, "type"),
    ticketCategory: fieldString(fields, "ticket_category"),
    declaredStatus,
    directory: input.directory,
    workflowStatus,
    nextLawfulAction: nextLawfulAction({
      directory: input.directory,
      workflowStatus
    }),
    filePath: input.filePath,
    fileUri: pathToFileURL(input.filePath).href,
    ticketDigest,
    missingRequiredFields: Object.freeze(
      SDLC_TICKET_REQUIRED_FIELDS.filter((field) => fieldString(fields, field) === null)
    ),
    diagnostics: Object.freeze(diagnostics),
    sourceDocuments,
    targetTruth: fieldString(fields, "target_truth"),
    supersededTruth: fieldString(fields, "superseded_truth"),
    closureLaw: fieldString(fields, "closure_law"),
    evaluationCriteria,
    nonClosureConditions,
    changeClass: fieldString(fields, "change_class"),
    reEntryPoint: fieldString(fields, "re_entry_point"),
    reviewDecisionRows: reviewDecisionRows({ ticketId, fields }),
    bugTriageRows: bugs,
    specChangeRows: specs,
    overlayContinuationRows: continuations,
    reviewPanelBinding: panelBinding
  });
}

function ticketFiles(input: {
  readonly workspaceRoot: string;
  readonly directory: SdlcTicketWorkflowDirectory;
}): readonly string[] {
  const directoryPath = path.join(
    input.workspaceRoot,
    ".ai-workspace",
    "tickets",
    input.directory
  );
  if (!existsSync(directoryPath) || !statSync(directoryPath).isDirectory()) {
    return Object.freeze([]);
  }
  return Object.freeze(
    readdirSync(directoryPath)
      .filter((entry) => entry.endsWith(".md"))
      .map((entry) => path.join(directoryPath, entry))
      .filter((entryPath) => statSync(entryPath).isFile())
      .sort((left, right) => left.localeCompare(right))
  );
}

function duplicateIdDiagnostics(
  rows: readonly SdlcTicketWorkflowRow[]
): readonly SdlcTicketWorkflowDiagnostic[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.ticketId, (counts.get(row.ticketId) ?? 0) + 1);
  }
  return Object.freeze(
    [...counts.entries()].flatMap(([ticketId, count]) =>
      count > 1
        ? [
            diagnostic({
              code: "duplicate_ticket_id",
              field: "id",
              detail: `${ticketId} appears in ${count} ticket workflow rows`
            })
          ]
        : []
    )
  );
}

export function projectSdlcTicketWorkflow(input: {
  readonly workspaceRoot: string;
}): SdlcTicketWorkflowProjection {
  const profiles = defaultReviewerProfiles();
  const rows = Object.freeze(
    SDLC_TICKET_WORKFLOW_DIRECTORIES.flatMap((directory) =>
      ticketFiles({ workspaceRoot: input.workspaceRoot, directory }).map((filePath) =>
        projectTicketFile({
          workspaceRoot: input.workspaceRoot,
          directory,
          filePath,
          profiles
        })
      )
    )
  );
  const diagnostics = duplicateIdDiagnostics(rows);
  return Object.freeze({
    kind: "sdlc_ticket_workflow_projection" as const,
    readOnly: true as const,
    choosesNextTraversal: false as const,
    sourceRoot: path.join(input.workspaceRoot, ".ai-workspace", "tickets"),
    sourceRootUri: pathToFileURL(
      path.join(input.workspaceRoot, ".ai-workspace", "tickets")
    ).href,
    sourceDirectories: SDLC_TICKET_WORKFLOW_DIRECTORIES,
    requiredFields: SDLC_TICKET_REQUIRED_FIELDS,
    rows,
    reviewerProfiles: profiles,
    counts: Object.freeze({
      backlog: rows.filter((row) => row.directory === "backlog").length,
      active: rows.filter((row) => row.directory === "active").length,
      blocked: rows.filter((row) => row.workflowStatus === "blocked").length,
      completed: rows.filter((row) => row.directory === "completed").length,
      malformed: rows.filter((row) => row.workflowStatus === "malformed").length,
      stale: rows.filter((row) => row.workflowStatus === "stale").length
    }),
    diagnostics,
    emittedRuntimeEventKinds: Object.freeze([] as const)
  });
}

function admittedTicketRow(input: {
  readonly workflow: SdlcTicketWorkflowProjection;
  readonly ticketId: string;
}): SdlcTicketWorkflowRow {
  const ticketId = normalizeTicketId(input.ticketId);
  const row = input.workflow.rows.find((candidate) => candidate.ticketId === ticketId);
  if (row === undefined) {
    throw new TypeError(`ticket ${ticketId}: missing`);
  }
  if (row.workflowStatus === "malformed") {
    throw new TypeError(`ticket ${ticketId}: malformed`);
  }
  if (row.workflowStatus === "stale") {
    throw new TypeError(`ticket ${ticketId}: stale`);
  }
  if (row.directory !== "active" || row.declaredStatus !== "active") {
    throw new TypeError(`ticket ${ticketId}: not active`);
  }
  if (
    row.targetTruth === null ||
    row.closureLaw === null ||
    row.changeClass === null ||
    row.reEntryPoint === null
  ) {
    throw new TypeError(`ticket ${ticketId}: unadmitted`);
  }
  if (row.reviewPanelBinding?.diagnostics.length) {
    throw new TypeError(`ticket ${ticketId}: reviewer profile admission failed`);
  }
  if (
    row.diagnostics.some(
      (entry) =>
        entry.code === "missing_governing_requirement" ||
        entry.code === "missing_governing_design" ||
        entry.code === "missing_bug_triage_field" ||
        entry.code === "missing_spec_change_field" ||
        entry.code === "missing_overlay_continuation_field" ||
        entry.code === "unknown_reviewer_profile" ||
        entry.code === "unavailable_reviewer_profile" ||
        entry.code === "schema_incompatible_reviewer_profile"
    )
  ) {
    throw new TypeError(`ticket ${ticketId}: unadmitted`);
  }
  return row;
}

export function constructSdlcTicketExecutionContract(input: {
  readonly row: SdlcTicketWorkflowRow;
}): SdlcTicketExecutionContract {
  if (
    input.row.targetTruth === null ||
    input.row.closureLaw === null ||
    input.row.changeClass === null ||
    input.row.reEntryPoint === null
  ) {
    throw new TypeError(`${input.row.ticketId}: cannot admit incomplete ticket`);
  }
  const ticketDigestPart = refPart(input.row.ticketDigest);
  const reviewerProfileIds =
    input.row.reviewPanelBinding?.requiredReviewerProfileIds ?? Object.freeze([]);
  const reviewerProfileConfigDigests =
    input.row.reviewPanelBinding?.reviewerProfileConfigDigests ?? Object.freeze([]);
  return Object.freeze({
    kind: "sdlc_ticket_execution_contract" as const,
    executionContractRef:
      `ticket-execution-contract://odd-sdlc/${input.row.ticketId}/${ticketDigestPart}`,
    ticketId: input.row.ticketId,
    ticketRef: `asset:ticket/${input.row.ticketId}`,
    ticketPath: input.row.filePath,
    ticketUri: input.row.fileUri,
    ticketDigest: input.row.ticketDigest,
    sourceDocuments: input.row.sourceDocuments,
    targetTruth: input.row.targetTruth,
    supersededTruth: input.row.supersededTruth,
    closureLaw: input.row.closureLaw,
    evaluationCriteria: input.row.evaluationCriteria,
    nonClosureConditions: input.row.nonClosureConditions,
    changeClass: input.row.changeClass,
    reEntryPoint: input.row.reEntryPoint,
    reviewPanelBinding: input.row.reviewPanelBinding,
    reviewDecisionRows: input.row.reviewDecisionRows,
    bugTriageRows: input.row.bugTriageRows,
    specChangeRows: input.row.specChangeRows,
    overlayContinuationRows: input.row.overlayContinuationRows,
    rulingRefs: Object.freeze([
      ...input.row.reviewDecisionRows.map((row) => row.decisionRef),
      ...input.row.overlayContinuationRows.map((row) => row.continuationRef)
    ]),
    reviewerProfileIds,
    reviewerProfileConfigDigests,
    overlayContinuationRefs: Object.freeze(
      input.row.overlayContinuationRows.map((row) => row.continuationRef)
    )
  });
}

export function admitSdlcTicketExecutionContract(input: {
  readonly workflow: SdlcTicketWorkflowProjection;
  readonly ticketId: string;
}): SdlcTicketExecutionContract {
  return constructSdlcTicketExecutionContract({
    row: admittedTicketRow(input)
  });
}

export function acceptedSdlcReviewDecisionRows(input: {
  readonly contract: SdlcTicketExecutionContract;
}): readonly SdlcReviewFindingDecisionRow[] {
  return Object.freeze(
    input.contract.reviewDecisionRows.filter((row) => row.ruling === "accepted")
  );
}

export function sdlcTicketExecutionContractRefs(
  contract: SdlcTicketExecutionContract | null | undefined
): readonly string[] {
  if (contract === null || contract === undefined) {
    return Object.freeze([]);
  }
  return Object.freeze([
    ...new Set([
      contract.executionContractRef,
      contract.ticketRef,
      contract.ticketUri,
      contract.ticketDigest,
      ...(contract.reviewPanelBinding === null
        ? []
        : [contract.reviewPanelBinding.panelBindingRef]),
      ...contract.rulingRefs,
      ...contract.reviewDecisionRows.flatMap((row) => [
        ...(row.panelBindingRef === null ? [] : [row.panelBindingRef]),
        ...(row.invocationRef === null ? [] : [row.invocationRef]),
        ...(row.outputDigest === null ? [] : [row.outputDigest]),
        ...row.evidenceRefs
      ]),
      ...contract.reviewerProfileIds.map(
        (profileId) => `reviewer-profile://odd-sdlc/${profileId}`
      ),
      ...contract.reviewerProfileConfigDigests,
      ...contract.overlayContinuationRefs
    ])
  ]);
}

export function isSdlcTicketAssetHandle(handle: string): boolean {
  return handle.startsWith("ticket/");
}

function ticketIdFromAssetHandle(handle: string): string {
  return normalizeTicketId(handle.slice("ticket/".length));
}

export function resolveSdlcTicketExecutionContractForAssetHandle(input: {
  readonly workflow: SdlcTicketWorkflowProjection;
  readonly handle: string;
}): SdlcTicketAssetStartResolution {
  if (!isSdlcTicketAssetHandle(input.handle)) {
    return Object.freeze({ kind: "not_ticket_asset" as const });
  }
  const ticketId = ticketIdFromAssetHandle(input.handle);
  const row = input.workflow.rows.find((candidate) => candidate.ticketId === ticketId);
  if (row === undefined) {
    return Object.freeze({
      kind: "blocked" as const,
      blockingReason: "ticket_missing" as const,
      diagnostics: Object.freeze([
        diagnostic({
          code: "missing_required_field",
          field: "id",
          detail: `ticket ${ticketId} is not present under .ai-workspace/tickets`
        })
      ])
    });
  }
  if (row.workflowStatus === "malformed") {
    return Object.freeze({
      kind: "blocked" as const,
      blockingReason: "ticket_malformed" as const,
      diagnostics: row.diagnostics
    });
  }
  if (row.workflowStatus === "stale") {
    return Object.freeze({
      kind: "blocked" as const,
      blockingReason: "ticket_stale" as const,
      diagnostics: row.diagnostics
    });
  }
  if (row.directory !== "active" || row.declaredStatus !== "active") {
    return Object.freeze({
      kind: "blocked" as const,
      blockingReason: "ticket_not_active" as const,
      diagnostics: row.diagnostics
    });
  }
  try {
    return Object.freeze({
      kind: "admitted" as const,
      contract: constructSdlcTicketExecutionContract({ row })
    });
  } catch {
    return Object.freeze({
      kind: "blocked" as const,
      blockingReason: "ticket_unadmitted" as const,
      diagnostics: row.diagnostics
    });
  }
}
