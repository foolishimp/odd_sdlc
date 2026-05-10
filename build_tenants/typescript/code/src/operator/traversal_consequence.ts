// Implements: T-136
// Implements: T-138

export type SdlcEdgeClosureDisposition =
  | "close"
  | "yield"
  | "retry"
  | "repair"
  | "re-enter"
  | "reprice"
  | "block";

export type SdlcYieldKind =
  | "process_active_under_liveness_observer"
  | "budget_checkpoint_with_admitted_progress"
  | "awaiting_external_execution_evidence"
  | "awaiting_fh_input"
  | "partial_product_evidence_admitted_current_edge_should_resume"
  | "operator_requested_bounded_stop";

export type SdlcNextActionBasisKind =
  | "initial_selection"
  | "post_yield_resume"
  | "post_close_graph_continuation"
  | "post_retry"
  | "post_repair"
  | "post_reenter"
  | "post_reprice"
  | "post_block";

export interface SdlcTraversalConsequenceRefs {
  readonly kind: "sdlc_traversal_consequence_refs";
  readonly constructionIntentRef: string;
  readonly worksiteEvidenceRef: string;
  readonly edgeFulfillmentLedgerRef: string;
  readonly edgeClosureDecisionRef: string;
  readonly nextActionProjectionRef: string;
}

export interface SdlcConstructionIntent {
  readonly kind: "sdlc_construction_intent";
  readonly intentRef: string;
  readonly intentEventRefs: readonly string[];
  readonly productAssetModelRef: string;
  readonly selectedPriorityRowRef: string;
  readonly nextActionProjectionRef: string;
  readonly selectedActionRef: string;
  readonly basisRefs: readonly string[];
  readonly predecessorRefs: readonly string[];
}

export interface SdlcWorksiteEvidence {
  readonly kind: "sdlc_worksite_evidence";
  readonly evidenceBundleRef: string;
  readonly intentRef: string;
  readonly invocationRef: string;
  readonly processEventRefs: readonly string[];
  readonly productEvidenceRefs: readonly string[];
  readonly admittedProgressRefs: readonly string[];
  readonly livenessProjectionRefs: readonly string[];
  readonly predecessorRefs: readonly string[];
}

export interface SdlcEdgeFulfillmentCounts {
  readonly expected: number;
  readonly fulfilled: number;
  readonly partial: number;
  readonly blocked: number;
  readonly unfulfilled: number;
  readonly missing: number;
  readonly extra: number;
}

export type SdlcObligationCarryDirection =
  | "edge_local"
  | "downstream_transformation_set";

export type SdlcEdgeFulfillmentAssessmentStatus =
  | "fulfilled"
  | "partial"
  | "blocked"
  | "unassessed";

export interface SdlcEdgeFulfillmentAssessmentInput {
  readonly obligationId: string;
  readonly fulfillmentStatus: SdlcEdgeFulfillmentAssessmentStatus;
  readonly evidenceRefs?: readonly string[];
  readonly carryDirection?: SdlcObligationCarryDirection;
  readonly downstreamGraphFunctionRefs?: readonly string[];
  readonly targetBindingRefs?: readonly string[];
}

export interface SdlcEdgeFulfillmentCountProjection {
  readonly counts: SdlcEdgeFulfillmentCounts;
  readonly assessmentCount: number;
  readonly edgeLocalObligationIds: readonly string[];
  readonly downstreamTransformationSetRefs: readonly string[];
  readonly downstreamPressureRefs: readonly string[];
  readonly downstreamTargetBindingRefs: readonly string[];
  readonly nonConvergedReasonRefs: readonly string[];
}

export interface SdlcEdgeFulfillmentLedger {
  readonly kind: "sdlc_edge_fulfillment_ledger";
  readonly ledgerRef: string;
  readonly ledgerVersionRef: string;
  readonly edgeRef: string;
  readonly attemptRef: string;
  readonly targetBindingRefs: readonly string[];
  readonly evidenceBundleRefs: readonly string[];
  readonly materializationRefs: readonly string[];
  readonly livenessProjectionRefs: readonly string[];
  readonly admissionRefs: readonly string[];
  readonly downstreamTransformationSetRefs: readonly string[];
  readonly downstreamPressureRefs: readonly string[];
  readonly downstreamTargetBindingRefs: readonly string[];
  readonly counts: SdlcEdgeFulfillmentCounts;
  readonly assessmentCount: number;
  readonly carryConverged: boolean;
  readonly fulfillmentConverged: boolean;
  readonly admitted: boolean;
  readonly targetCertificationPassed: boolean;
  readonly fdRecheckPassed: boolean;
  readonly edgeConverged: boolean;
  readonly predecessorRefs: readonly string[];
}

export interface SdlcYieldResumeBasis {
  readonly kind: "sdlc_yield_resume_basis";
  readonly yieldKind: SdlcYieldKind;
  readonly resumeBasisRef: string;
  readonly currentEdgeRef: string;
  readonly admittedProgressRefs: readonly string[];
  readonly livenessProjectionRef: string | null;
  readonly resumePolicyRef: string | null;
}

export interface SdlcEdgeClosureDecision {
  readonly kind: "sdlc_edge_closure_decision";
  readonly decisionRef: string;
  readonly ledgerRef: string;
  readonly ledgerVersionRef: string;
  readonly disposition: SdlcEdgeClosureDisposition;
  readonly basisRefs: readonly string[];
  readonly reasonRefs: readonly string[];
  readonly yieldResumeBasis: SdlcYieldResumeBasis | null;
  readonly predecessorRefs: readonly string[];
}

export interface SdlcEdgeClosurePolicy {
  readonly kind: "sdlc_edge_closure_policy";
  readonly policyRef: string;
  readonly dispositionPrecedence: readonly SdlcEdgeClosureDisposition[];
}

export interface SdlcNextActionProjection {
  readonly kind: "sdlc_next_action_projection";
  readonly evaluationFunction: "evaluate_next";
  readonly nextActionBasisKind: SdlcNextActionBasisKind;
  readonly nextActionProjectionRef: string;
  readonly intentEventRefs: readonly string[];
  readonly productAssetModelRef: string;
  readonly gapPressureRefs: readonly string[];
  readonly targetBindingRefs: readonly string[];
  readonly closureDecisionRef: string | null;
  readonly observationRef: string;
  readonly policyRefs: readonly string[];
  readonly actionCatalogRefs: readonly string[];
  readonly selectedActionRef: string | null;
  readonly nextGraphFunctionRef: string | null;
  readonly nextGraphVectorRef: string | null;
  readonly choosesNextTraversal: boolean;
  readonly readOnly: boolean;
  readonly predecessorRefs: readonly string[];
}

export interface SdlcTraversalConsequenceReplay {
  readonly kind: "sdlc_traversal_consequence_replay";
  readonly refs: SdlcTraversalConsequenceRefs;
  readonly constructionIntent: SdlcConstructionIntent;
  readonly worksiteEvidence: SdlcWorksiteEvidence;
  readonly edgeFulfillmentLedger: SdlcEdgeFulfillmentLedger;
  readonly edgeClosureDecision: SdlcEdgeClosureDecision;
  readonly nextActionProjection: SdlcNextActionProjection;
}

function requireNonEmptyString(value: string, label: string): string {
  if (value.trim().length === 0) {
    throw new TypeError(`${label} must be non-empty`);
  }
  return value;
}

function nonNegativeInteger(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${label} must be a non-negative integer`);
  }
  return value;
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function obligationReasonRef(input: {
  readonly obligationId: string;
  readonly reason: string;
}): string {
  return [
    "obligation://odd-sdlc",
    encodeURIComponent(input.obligationId),
    encodeURIComponent(input.reason)
  ].join("/");
}

function obligationDownstreamPressureRef(obligationId: string): string {
  return obligationReasonRef({
    obligationId,
    reason: "downstream_transformation_set"
  });
}

function nonEmptyUniqueSorted(
  values: readonly string[],
  label: string
): readonly string[] {
  const refs = uniqueSorted(values.filter((value) => value.trim().length > 0));
  if (refs.length === 0) {
    throw new TypeError(`${label} must contain at least one ref`);
  }
  return refs;
}

function requireRefsContain(input: {
  readonly refs: readonly string[];
  readonly requiredRefs: readonly string[];
  readonly label: string;
}): void {
  const refs = new Set(input.refs);
  const missing = input.requiredRefs.filter((ref) => !refs.has(ref));
  if (missing.length > 0) {
    throw new TypeError(`${input.label} missing predecessor refs: ${missing.join(", ")}`);
  }
}

function edgeConvergedFromCounts(counts: SdlcEdgeFulfillmentCounts): boolean {
  return (
    carryConvergedFromCounts(counts) &&
    fulfillmentConvergedFromCounts(counts)
  );
}

function carryConvergedFromCounts(counts: SdlcEdgeFulfillmentCounts): boolean {
  return counts.missing === 0 && counts.extra === 0;
}

function fulfillmentConvergedFromCounts(
  counts: SdlcEdgeFulfillmentCounts
): boolean {
  return (
    counts.expected >= 0 &&
    counts.fulfilled === counts.expected &&
    counts.partial === 0 &&
    counts.blocked === 0 &&
    counts.unfulfilled === 0
  );
}

export function deriveSdlcEdgeFulfillmentCountsFromAssessments(input: {
  readonly declaredObligationIds: readonly string[];
  readonly assessments: readonly SdlcEdgeFulfillmentAssessmentInput[];
  readonly fallbackStatus?: SdlcEdgeFulfillmentAssessmentStatus;
}): SdlcEdgeFulfillmentCountProjection {
  const declaredObligationIds = uniqueSorted(
    input.declaredObligationIds.filter((obligationId) => obligationId.trim().length > 0)
  );
  if (declaredObligationIds.length === 0) {
    const extraRefs = input.assessments
      .filter((assessment) => assessment.obligationId.trim().length > 0)
      .map((assessment) =>
        obligationReasonRef({
          obligationId: assessment.obligationId,
          reason: "extra"
        })
      );
    const counts = Object.freeze({
      expected: 1,
      fulfilled: 0,
      partial: 0,
      blocked: 1,
      unfulfilled: 0,
      missing: 0,
      extra: extraRefs.length
    });
    return Object.freeze({
      counts,
      assessmentCount: input.assessments.length,
      edgeLocalObligationIds: Object.freeze([]),
      downstreamTransformationSetRefs: Object.freeze([]),
      downstreamPressureRefs: Object.freeze([]),
      downstreamTargetBindingRefs: Object.freeze([]),
      nonConvergedReasonRefs: uniqueSorted([
        obligationReasonRef({
          obligationId: "declared_obligation_set",
          reason: "no_declared_obligations"
        }),
        ...extraRefs
      ])
    });
  }

  const declared = new Set(declaredObligationIds);
  const assessmentByObligationId = new Map<
    string,
    SdlcEdgeFulfillmentAssessmentInput
  >();
  const downstreamAssessmentByObligationId = new Map<
    string,
    SdlcEdgeFulfillmentAssessmentInput
  >();
  const duplicateRefs: string[] = [];
  const extraRefs: string[] = [];

  for (const assessment of input.assessments) {
    if (!declared.has(assessment.obligationId)) {
      extraRefs.push(
        obligationReasonRef({
          obligationId: assessment.obligationId,
          reason: "extra"
        })
      );
      continue;
    }
    const carryDirection = assessment.carryDirection ?? "edge_local";
    if (carryDirection === "downstream_transformation_set") {
      if (
        downstreamAssessmentByObligationId.has(assessment.obligationId) ||
        assessmentByObligationId.has(assessment.obligationId)
      ) {
        duplicateRefs.push(
          obligationReasonRef({
            obligationId: assessment.obligationId,
            reason: "duplicate"
          })
        );
        continue;
      }
      downstreamAssessmentByObligationId.set(assessment.obligationId, assessment);
      continue;
    }
    if (assessmentByObligationId.has(assessment.obligationId)) {
      duplicateRefs.push(
        obligationReasonRef({
          obligationId: assessment.obligationId,
          reason: "duplicate"
        })
      );
      continue;
    }
    assessmentByObligationId.set(assessment.obligationId, assessment);
  }

  let fulfilled = 0;
  let partial = 0;
  let blocked = 0;
  let unfulfilled = 0;
  const nonConvergedReasonRefs: string[] = [];
  const edgeLocalObligationIds = declaredObligationIds.filter(
    (obligationId) => !downstreamAssessmentByObligationId.has(obligationId)
  );

  for (const obligationId of edgeLocalObligationIds) {
    const assessment = assessmentByObligationId.get(obligationId);
    if (assessment === undefined) {
      nonConvergedReasonRefs.push(
        obligationReasonRef({ obligationId, reason: "missing" })
      );
      continue;
    }
    if (assessment.fulfillmentStatus === "fulfilled") {
      fulfilled += 1;
      continue;
    }
    if (assessment.fulfillmentStatus === "partial") {
      partial += 1;
    } else if (assessment.fulfillmentStatus === "blocked") {
      blocked += 1;
    } else {
      unfulfilled += 1;
    }
    nonConvergedReasonRefs.push(
      obligationReasonRef({
        obligationId,
        reason: assessment.fulfillmentStatus
      })
    );
  }

  const missing = edgeLocalObligationIds.length - assessmentByObligationId.size;
  const downstreamAssessments = [...downstreamAssessmentByObligationId.values()];
  const downstreamPressureRefs = uniqueSorted(
    downstreamAssessments.flatMap((assessment) => [
      obligationDownstreamPressureRef(assessment.obligationId),
      ...(assessment.evidenceRefs ?? []),
      ...(assessment.downstreamGraphFunctionRefs ?? [])
    ])
  );
  const downstreamTargetBindingRefs = uniqueSorted(
    downstreamAssessments.flatMap(
      (assessment) => assessment.targetBindingRefs ?? []
    )
  );
  const counts = Object.freeze({
    expected: edgeLocalObligationIds.length,
    fulfilled,
    partial,
    blocked,
    unfulfilled,
    missing,
    extra: extraRefs.length + duplicateRefs.length
  });
  return Object.freeze({
    counts,
    assessmentCount: input.assessments.length,
    edgeLocalObligationIds: uniqueSorted(edgeLocalObligationIds),
    downstreamTransformationSetRefs: uniqueSorted(
      downstreamAssessments.map((assessment) =>
        obligationDownstreamPressureRef(assessment.obligationId)
      )
    ),
    downstreamPressureRefs,
    downstreamTargetBindingRefs,
    nonConvergedReasonRefs: uniqueSorted([
      ...nonConvergedReasonRefs,
      ...extraRefs,
      ...duplicateRefs
    ])
  });
}

export const SDLC_DEFAULT_EDGE_CLOSURE_POLICY: SdlcEdgeClosurePolicy =
  Object.freeze({
    kind: "sdlc_edge_closure_policy" as const,
    policyRef: "closure-policy://odd-sdlc/default-edge-closure",
    dispositionPrecedence: Object.freeze([
      "close",
      "yield",
      "reprice",
      "repair",
      "re-enter",
      "retry",
      "block"
    ] satisfies readonly SdlcEdgeClosureDisposition[])
  });

function validateClosurePolicy(policy: SdlcEdgeClosurePolicy): void {
  const allowed = new Set<SdlcEdgeClosureDisposition>([
    "close",
    "yield",
    "retry",
    "repair",
    "re-enter",
    "reprice",
    "block"
  ]);
  const seen = new Set<string>();
  for (const disposition of policy.dispositionPrecedence) {
    if (!allowed.has(disposition)) {
      throw new TypeError(`unknown closure disposition in policy: ${disposition}`);
    }
    if (seen.has(disposition)) {
      throw new TypeError(`duplicate closure disposition in policy: ${disposition}`);
    }
    seen.add(disposition);
  }
  if (!seen.has("block")) {
    throw new TypeError("closure policy must include block fallback");
  }
}

function dispositionFromPolicy(input: {
  readonly policy: SdlcEdgeClosurePolicy;
  readonly candidates: ReadonlySet<SdlcEdgeClosureDisposition>;
}): SdlcEdgeClosureDisposition {
  validateClosurePolicy(input.policy);
  for (const disposition of input.policy.dispositionPrecedence) {
    if (input.candidates.has(disposition)) {
      return disposition;
    }
  }
  return "block";
}

function assertYieldProgressNotOnlyLiveness(input: {
  readonly admittedProgressRefs: readonly string[];
  readonly livenessProjectionRef: string | null;
  readonly ledgerLivenessProjectionRefs: readonly string[];
}): void {
  const livenessRefs = new Set([
    ...input.ledgerLivenessProjectionRefs,
    ...(input.livenessProjectionRef === null ? [] : [input.livenessProjectionRef])
  ]);
  if (input.admittedProgressRefs.every((ref) => livenessRefs.has(ref))) {
    throw new TypeError("yield requires admitted progress beyond liveness refs");
  }
}

export function constructSdlcConstructionIntent(input: {
  readonly intentRef: string;
  readonly intentEventRefs: readonly string[];
  readonly productAssetModelRef: string;
  readonly selectedPriorityRowRef: string;
  readonly nextActionProjectionRef: string;
  readonly selectedActionRef: string;
  readonly basisRefs: readonly string[];
  readonly predecessorRefs?: readonly string[];
}): SdlcConstructionIntent {
  const intentEventRefs = nonEmptyUniqueSorted(
    input.intentEventRefs,
    "intentEventRefs"
  );
  const productAssetModelRef = requireNonEmptyString(
    input.productAssetModelRef,
    "productAssetModelRef"
  );
  return Object.freeze({
    kind: "sdlc_construction_intent" as const,
    intentRef: requireNonEmptyString(input.intentRef, "intentRef"),
    intentEventRefs,
    productAssetModelRef,
    selectedPriorityRowRef: requireNonEmptyString(
      input.selectedPriorityRowRef,
      "selectedPriorityRowRef"
    ),
    nextActionProjectionRef: requireNonEmptyString(
      input.nextActionProjectionRef,
      "nextActionProjectionRef"
    ),
    selectedActionRef: requireNonEmptyString(
      input.selectedActionRef,
      "selectedActionRef"
    ),
    basisRefs: uniqueSorted(input.basisRefs),
    predecessorRefs: uniqueSorted([
      ...intentEventRefs,
      productAssetModelRef,
      input.selectedPriorityRowRef,
      input.nextActionProjectionRef,
      ...input.basisRefs,
      ...(input.predecessorRefs ?? [])
    ])
  });
}

export function constructSdlcWorksiteEvidence(input: {
  readonly evidenceBundleRef: string;
  readonly intentRef: string;
  readonly invocationRef: string;
  readonly processEventRefs?: readonly string[];
  readonly productEvidenceRefs?: readonly string[];
  readonly admittedProgressRefs?: readonly string[];
  readonly livenessProjectionRefs?: readonly string[];
  readonly predecessorRefs?: readonly string[];
}): SdlcWorksiteEvidence {
  const evidence = Object.freeze({
    kind: "sdlc_worksite_evidence" as const,
    evidenceBundleRef: requireNonEmptyString(
      input.evidenceBundleRef,
      "evidenceBundleRef"
    ),
    intentRef: requireNonEmptyString(input.intentRef, "intentRef"),
    invocationRef: requireNonEmptyString(input.invocationRef, "invocationRef"),
    processEventRefs: uniqueSorted(input.processEventRefs ?? []),
    productEvidenceRefs: uniqueSorted(input.productEvidenceRefs ?? []),
    admittedProgressRefs: uniqueSorted(input.admittedProgressRefs ?? []),
    livenessProjectionRefs: uniqueSorted(input.livenessProjectionRefs ?? []),
    predecessorRefs: uniqueSorted([
      input.intentRef,
      input.invocationRef,
      ...(input.predecessorRefs ?? [])
    ])
  });
  requireRefsContain({
    refs: evidence.predecessorRefs,
    requiredRefs: [evidence.intentRef, evidence.invocationRef],
    label: evidence.evidenceBundleRef
  });
  return evidence;
}

export function constructSdlcEdgeFulfillmentLedger(input: {
  readonly ledgerRef: string;
  readonly ledgerVersionRef: string;
  readonly edgeRef: string;
  readonly attemptRef: string;
  readonly targetBindingRefs: readonly string[];
  readonly evidenceBundleRefs: readonly string[];
  readonly materializationRefs?: readonly string[];
  readonly livenessProjectionRefs?: readonly string[];
  readonly admissionRefs?: readonly string[];
  readonly downstreamTransformationSetRefs?: readonly string[];
  readonly downstreamPressureRefs?: readonly string[];
  readonly downstreamTargetBindingRefs?: readonly string[];
  readonly counts: SdlcEdgeFulfillmentCounts;
  readonly assessmentCount?: number;
  readonly admitted?: boolean;
  readonly targetCertificationPassed?: boolean;
  readonly fdRecheckPassed?: boolean;
  readonly predecessorRefs?: readonly string[];
}): SdlcEdgeFulfillmentLedger {
  const counts = Object.freeze({
    expected: nonNegativeInteger(input.counts.expected, "counts.expected"),
    fulfilled: nonNegativeInteger(input.counts.fulfilled, "counts.fulfilled"),
    partial: nonNegativeInteger(input.counts.partial, "counts.partial"),
    blocked: nonNegativeInteger(input.counts.blocked, "counts.blocked"),
    unfulfilled: nonNegativeInteger(
      input.counts.unfulfilled,
      "counts.unfulfilled"
    ),
    missing: nonNegativeInteger(input.counts.missing, "counts.missing"),
    extra: nonNegativeInteger(input.counts.extra, "counts.extra")
  });
  const targetBindingRefs = nonEmptyUniqueSorted(
    input.targetBindingRefs,
    "targetBindingRefs"
  );
  const evidenceBundleRefs = nonEmptyUniqueSorted(
    input.evidenceBundleRefs,
    "evidenceBundleRefs"
  );
  const carryConverged = carryConvergedFromCounts(counts);
  const fulfillmentConverged = fulfillmentConvergedFromCounts(counts);
  const admitted = input.admitted ?? true;
  const targetCertificationPassed = input.targetCertificationPassed ?? true;
  const fdRecheckPassed = input.fdRecheckPassed ?? true;
  const downstreamTransformationSetRefs = uniqueSorted(
    input.downstreamTransformationSetRefs ?? []
  );
  const downstreamPressureRefs = uniqueSorted(input.downstreamPressureRefs ?? []);
  const downstreamTargetBindingRefs = uniqueSorted(
    input.downstreamTargetBindingRefs ?? []
  );
  const ledger = Object.freeze({
    kind: "sdlc_edge_fulfillment_ledger" as const,
    ledgerRef: requireNonEmptyString(input.ledgerRef, "ledgerRef"),
    ledgerVersionRef: requireNonEmptyString(
      input.ledgerVersionRef,
      "ledgerVersionRef"
    ),
    edgeRef: requireNonEmptyString(input.edgeRef, "edgeRef"),
    attemptRef: requireNonEmptyString(input.attemptRef, "attemptRef"),
    targetBindingRefs,
    evidenceBundleRefs,
    materializationRefs: uniqueSorted(input.materializationRefs ?? []),
    livenessProjectionRefs: uniqueSorted(input.livenessProjectionRefs ?? []),
    admissionRefs: uniqueSorted(input.admissionRefs ?? []),
    downstreamTransformationSetRefs,
    downstreamPressureRefs,
    downstreamTargetBindingRefs,
    counts,
    assessmentCount: nonNegativeInteger(
      input.assessmentCount ?? evidenceBundleRefs.length,
      "assessmentCount"
    ),
    carryConverged,
    fulfillmentConverged,
    admitted,
    targetCertificationPassed,
    fdRecheckPassed,
    edgeConverged:
      edgeConvergedFromCounts(counts) &&
      admitted &&
      targetCertificationPassed &&
      fdRecheckPassed,
    predecessorRefs: uniqueSorted([
      ...targetBindingRefs,
      ...downstreamTargetBindingRefs,
      ...downstreamTransformationSetRefs,
      ...downstreamPressureRefs,
      ...evidenceBundleRefs,
      ...(input.predecessorRefs ?? [])
    ])
  });
  requireRefsContain({
    refs: ledger.predecessorRefs,
    requiredRefs: [...ledger.targetBindingRefs, ...ledger.evidenceBundleRefs],
    label: ledger.ledgerRef
  });
  return ledger;
}

export function deriveSdlcEdgeClosureDecision(input: {
  readonly decisionRef: string;
  readonly ledger: SdlcEdgeFulfillmentLedger;
  readonly currentEdgeLawful: boolean;
  readonly retryReasonRefs?: readonly string[];
  readonly repairReasonRefs?: readonly string[];
  readonly reenterReasonRefs?: readonly string[];
  readonly repriceReasonRefs?: readonly string[];
  readonly blockReasonRefs?: readonly string[];
  readonly yieldResumeBasis?: Omit<SdlcYieldResumeBasis, "kind"> | null;
  readonly closurePolicy?: SdlcEdgeClosurePolicy;
}): SdlcEdgeClosureDecision {
  const yieldResumeBasis =
    input.yieldResumeBasis === undefined ? null : input.yieldResumeBasis;
  if (yieldResumeBasis !== null) {
    if (!input.currentEdgeLawful) {
      throw new TypeError("yield requires the current edge to remain lawful");
    }
    requireNonEmptyString(yieldResumeBasis.resumeBasisRef, "resumeBasisRef");
    requireNonEmptyString(yieldResumeBasis.currentEdgeRef, "currentEdgeRef");
    const admittedProgressRefs = nonEmptyUniqueSorted(
      yieldResumeBasis.admittedProgressRefs,
      "admittedProgressRefs"
    );
    assertYieldProgressNotOnlyLiveness({
      admittedProgressRefs,
      livenessProjectionRef: yieldResumeBasis.livenessProjectionRef,
      ledgerLivenessProjectionRefs: input.ledger.livenessProjectionRefs
    });
  }
  const candidates = new Set<SdlcEdgeClosureDisposition>(["block"]);
  if (input.ledger.edgeConverged) {
    candidates.add("close");
  }
  if (yieldResumeBasis !== null) {
    candidates.add("yield");
  }
  if ((input.repriceReasonRefs ?? []).length > 0) {
    candidates.add("reprice");
  }
  if ((input.repairReasonRefs ?? []).length > 0) {
    candidates.add("repair");
  }
  if ((input.reenterReasonRefs ?? []).length > 0) {
    candidates.add("re-enter");
  }
  if ((input.retryReasonRefs ?? []).length > 0) {
    candidates.add("retry");
  }
  const policy = input.closurePolicy ?? SDLC_DEFAULT_EDGE_CLOSURE_POLICY;
  const disposition = dispositionFromPolicy({ policy, candidates });
  const reasonRefs = uniqueSorted([
    ...(input.retryReasonRefs ?? []),
    ...(input.repairReasonRefs ?? []),
    ...(input.reenterReasonRefs ?? []),
    ...(input.repriceReasonRefs ?? []),
    ...(input.blockReasonRefs ?? []),
    ...(yieldResumeBasis?.admittedProgressRefs ?? [])
  ]);
  const normalizedYieldResumeBasis =
    yieldResumeBasis === null
      ? null
      : Object.freeze({
          kind: "sdlc_yield_resume_basis" as const,
          yieldKind: yieldResumeBasis.yieldKind,
          resumeBasisRef: yieldResumeBasis.resumeBasisRef,
          currentEdgeRef: yieldResumeBasis.currentEdgeRef,
          admittedProgressRefs: nonEmptyUniqueSorted(
            yieldResumeBasis.admittedProgressRefs,
            "admittedProgressRefs"
          ),
          livenessProjectionRef: yieldResumeBasis.livenessProjectionRef,
          resumePolicyRef: yieldResumeBasis.resumePolicyRef
        });
  return Object.freeze({
    kind: "sdlc_edge_closure_decision" as const,
    decisionRef: requireNonEmptyString(input.decisionRef, "decisionRef"),
    ledgerRef: input.ledger.ledgerRef,
    ledgerVersionRef: input.ledger.ledgerVersionRef,
    disposition,
    basisRefs: uniqueSorted([
      input.ledger.ledgerRef,
      input.ledger.ledgerVersionRef,
      policy.policyRef,
      ...(normalizedYieldResumeBasis === null
        ? []
        : [
            normalizedYieldResumeBasis.resumeBasisRef,
            normalizedYieldResumeBasis.currentEdgeRef,
            ...normalizedYieldResumeBasis.admittedProgressRefs,
            ...(normalizedYieldResumeBasis.livenessProjectionRef === null
              ? []
              : [normalizedYieldResumeBasis.livenessProjectionRef]),
            ...(normalizedYieldResumeBasis.resumePolicyRef === null
              ? []
              : [normalizedYieldResumeBasis.resumePolicyRef])
          ])
    ]),
    reasonRefs,
    yieldResumeBasis: normalizedYieldResumeBasis,
    predecessorRefs: uniqueSorted([
      input.ledger.ledgerRef,
      input.ledger.ledgerVersionRef,
      policy.policyRef
    ])
  });
}

export function constructSdlcNextActionProjection(input: {
  readonly nextActionProjectionRef: string;
  readonly nextActionBasisKind?: SdlcNextActionBasisKind;
  readonly intentEventRefs: readonly string[];
  readonly productAssetModelRef: string;
  readonly gapPressureRefs: readonly string[];
  readonly targetBindingRefs: readonly string[];
  readonly closureDecision?: SdlcEdgeClosureDecision | null;
  readonly observationRef: string;
  readonly policyRefs: readonly string[];
  readonly actionCatalogRefs: readonly string[];
  readonly selectedActionRef?: string | null;
  readonly nextGraphFunctionRef?: string | null;
  readonly nextGraphVectorRef?: string | null;
  readonly readOnly?: boolean;
}): SdlcNextActionProjection {
  const selectedActionRef = input.selectedActionRef ?? null;
  const intentEventRefs = nonEmptyUniqueSorted(
    input.intentEventRefs,
    "intentEventRefs"
  );
  const productAssetModelRef = requireNonEmptyString(
    input.productAssetModelRef,
    "productAssetModelRef"
  );
  const gapPressureRefs = nonEmptyUniqueSorted(
    input.gapPressureRefs,
    "gapPressureRefs"
  );
  const targetBindingRefs = nonEmptyUniqueSorted(
    input.targetBindingRefs,
    "targetBindingRefs"
  );
  const nextActionBasisKind =
    input.nextActionBasisKind ??
    nextActionBasisKindForClosure(input.closureDecision ?? null);
  validateNextActionBasis({
    nextActionBasisKind,
    closureDecision: input.closureDecision ?? null
  });
  const closureDecisionRef = input.closureDecision?.decisionRef ?? null;
  if (
    (nextActionBasisKind === "post_yield_resume" ||
      nextActionBasisKind === "post_reprice" ||
      nextActionBasisKind === "post_block") &&
    selectedActionRef !== null
  ) {
    throw new TypeError(
      `${nextActionBasisKind} basis cannot select a next action`
    );
  }
  return Object.freeze({
    kind: "sdlc_next_action_projection" as const,
    evaluationFunction: "evaluate_next" as const,
    nextActionBasisKind,
    nextActionProjectionRef: requireNonEmptyString(
      input.nextActionProjectionRef,
      "nextActionProjectionRef"
    ),
    intentEventRefs,
    productAssetModelRef,
    gapPressureRefs,
    targetBindingRefs,
    closureDecisionRef,
    observationRef: requireNonEmptyString(input.observationRef, "observationRef"),
    policyRefs: uniqueSorted(input.policyRefs),
    actionCatalogRefs: uniqueSorted(input.actionCatalogRefs),
    selectedActionRef,
    nextGraphFunctionRef: input.nextGraphFunctionRef ?? null,
    nextGraphVectorRef: input.nextGraphVectorRef ?? null,
    choosesNextTraversal: selectedActionRef !== null,
    readOnly: input.readOnly ?? false,
    predecessorRefs: uniqueSorted([
      ...intentEventRefs,
      productAssetModelRef,
      ...gapPressureRefs,
      ...targetBindingRefs,
      ...(closureDecisionRef === null ? [] : [closureDecisionRef]),
      input.observationRef,
      ...input.policyRefs,
      ...input.actionCatalogRefs
    ])
  });
}

function byRef<T>(
  values: readonly T[],
  refOf: (value: T) => string,
  ref: string,
  label: string
): T {
  const found = values.find((value) => refOf(value) === ref);
  if (found === undefined) {
    throw new TypeError(`${label} not found: ${ref}`);
  }
  return found;
}

function firstBySortedRef<T>(
  values: readonly T[],
  refOf: (value: T) => string,
  label: string
): T {
  const sorted = [...values].sort((left, right) =>
    refOf(left).localeCompare(refOf(right))
  );
  const first = sorted[0];
  if (first === undefined) {
    throw new TypeError(`${label} must contain at least one row`);
  }
  return first;
}

function nextActionBasisKindForClosure(
  closureDecision: SdlcEdgeClosureDecision | null
): SdlcNextActionBasisKind {
  if (closureDecision === null) {
    return "initial_selection";
  }
  switch (closureDecision.disposition) {
    case "close":
      return "post_close_graph_continuation";
    case "yield":
      return "post_yield_resume";
    case "retry":
      return "post_retry";
    case "repair":
      return "post_repair";
    case "re-enter":
      return "post_reenter";
    case "reprice":
      return "post_reprice";
    case "block":
      return "post_block";
  }
}

function validateNextActionBasis(input: {
  readonly nextActionBasisKind: SdlcNextActionBasisKind;
  readonly closureDecision: SdlcEdgeClosureDecision | null;
}): void {
  if (input.nextActionBasisKind === "initial_selection") {
    if (input.closureDecision !== null) {
      throw new TypeError("initial_selection basis cannot cite a closure decision");
    }
    return;
  }
  if (input.closureDecision === null) {
    throw new TypeError(`${input.nextActionBasisKind} basis requires a closure decision`);
  }
  const expected = nextActionBasisKindForClosure(input.closureDecision);
  if (input.nextActionBasisKind !== expected) {
    throw new TypeError(
      `${input.nextActionBasisKind} basis does not match ${input.closureDecision.disposition} closure decision`
    );
  }
}

export function replaySdlcTraversalConsequence(input: {
  readonly constructionIntents: readonly SdlcConstructionIntent[];
  readonly worksiteEvidence: readonly SdlcWorksiteEvidence[];
  readonly edgeFulfillmentLedgers: readonly SdlcEdgeFulfillmentLedger[];
  readonly edgeClosureDecisions: readonly SdlcEdgeClosureDecision[];
  readonly nextActionProjections: readonly SdlcNextActionProjection[];
  readonly finalNextActionProjectionRef?: string;
}): SdlcTraversalConsequenceReplay {
  const nextActionProjection =
    input.finalNextActionProjectionRef === undefined
      ? firstBySortedRef(
          input.nextActionProjections,
          (projection) => projection.nextActionProjectionRef,
          "nextActionProjections"
        )
      : byRef(
          input.nextActionProjections,
          (projection) => projection.nextActionProjectionRef,
          input.finalNextActionProjectionRef,
          "nextActionProjection"
        );
  if (nextActionProjection.closureDecisionRef === null) {
    throw new TypeError(
      `${nextActionProjection.nextActionProjectionRef} is an initial next-action projection and cannot replay an action consequence`
    );
  }
  const edgeClosureDecision = byRef(
    input.edgeClosureDecisions,
    (decision) => decision.decisionRef,
    nextActionProjection.closureDecisionRef,
    "edgeClosureDecision"
  );
  requireRefsContain({
    refs: nextActionProjection.predecessorRefs,
    requiredRefs: [
      ...nextActionProjection.intentEventRefs,
      nextActionProjection.productAssetModelRef,
      ...nextActionProjection.gapPressureRefs,
      ...nextActionProjection.targetBindingRefs,
      edgeClosureDecision.decisionRef,
      nextActionProjection.observationRef,
      ...nextActionProjection.policyRefs,
      ...nextActionProjection.actionCatalogRefs
    ],
    label: nextActionProjection.nextActionProjectionRef
  });
  const edgeFulfillmentLedger = byRef(
    input.edgeFulfillmentLedgers,
    (ledger) => ledger.ledgerVersionRef,
    edgeClosureDecision.ledgerVersionRef,
    "edgeFulfillmentLedger"
  );
  requireRefsContain({
    refs: edgeClosureDecision.predecessorRefs,
    requiredRefs: [
      edgeFulfillmentLedger.ledgerRef,
      edgeFulfillmentLedger.ledgerVersionRef
    ],
    label: edgeClosureDecision.decisionRef
  });
  requireRefsContain({
    refs: edgeFulfillmentLedger.predecessorRefs,
    requiredRefs: [
      ...edgeFulfillmentLedger.targetBindingRefs,
      ...edgeFulfillmentLedger.evidenceBundleRefs
    ],
    label: edgeFulfillmentLedger.ledgerRef
  });
  requireRefsContain({
    refs: edgeFulfillmentLedger.targetBindingRefs,
    requiredRefs: nextActionProjection.targetBindingRefs,
    label: edgeFulfillmentLedger.ledgerRef
  });
  const worksiteEvidenceRows = edgeFulfillmentLedger.evidenceBundleRefs.map(
    (evidenceRef) => {
      const evidence = byRef(
        input.worksiteEvidence,
        (row) => row.evidenceBundleRef,
        evidenceRef,
        "worksiteEvidence"
      );
      requireRefsContain({
        refs: evidence.predecessorRefs,
        requiredRefs: [evidence.intentRef, evidence.invocationRef],
        label: evidence.evidenceBundleRef
      });
      return evidence;
    }
  );
  const worksiteEvidence = worksiteEvidenceRows[0];
  if (worksiteEvidence === undefined) {
    throw new TypeError("edge fulfillment ledger must reference worksite evidence");
  }
  const intentRefs = uniqueSorted(
    worksiteEvidenceRows.map((evidence) => evidence.intentRef)
  );
  if (intentRefs.length !== 1) {
    throw new TypeError(
      `${edgeFulfillmentLedger.ledgerRef} references evidence from multiple intents: ${intentRefs.join(", ")}`
    );
  }
  const constructionIntent = byRef(
    input.constructionIntents,
    (intent) => intent.intentRef,
    intentRefs[0] ?? "",
    "constructionIntent"
  );
  requireRefsContain({
    refs: constructionIntent.predecessorRefs,
    requiredRefs: [
      constructionIntent.selectedPriorityRowRef,
      constructionIntent.nextActionProjectionRef,
      ...constructionIntent.intentEventRefs,
      constructionIntent.productAssetModelRef
    ],
    label: constructionIntent.intentRef
  });
  requireRefsContain({
    refs: constructionIntent.intentEventRefs,
    requiredRefs: nextActionProjection.intentEventRefs,
    label: constructionIntent.intentRef
  });
  requireRefsContain({
    refs: [constructionIntent.productAssetModelRef],
    requiredRefs: [nextActionProjection.productAssetModelRef],
    label: constructionIntent.intentRef
  });
  return Object.freeze({
    kind: "sdlc_traversal_consequence_replay" as const,
    refs: Object.freeze({
      kind: "sdlc_traversal_consequence_refs" as const,
      constructionIntentRef: constructionIntent.intentRef,
      worksiteEvidenceRef: worksiteEvidence.evidenceBundleRef,
      edgeFulfillmentLedgerRef: edgeFulfillmentLedger.ledgerVersionRef,
      edgeClosureDecisionRef: edgeClosureDecision.decisionRef,
      nextActionProjectionRef: nextActionProjection.nextActionProjectionRef
    }),
    constructionIntent,
    worksiteEvidence,
    edgeFulfillmentLedger,
    edgeClosureDecision,
    nextActionProjection
  });
}

export function assertSdlcTraversalConsequenceReplayable(input: {
  readonly constructionIntents: readonly SdlcConstructionIntent[];
  readonly worksiteEvidence: readonly SdlcWorksiteEvidence[];
  readonly edgeFulfillmentLedgers: readonly SdlcEdgeFulfillmentLedger[];
  readonly edgeClosureDecisions: readonly SdlcEdgeClosureDecision[];
  readonly nextActionProjections: readonly SdlcNextActionProjection[];
  readonly finalNextActionProjectionRef?: string;
}): SdlcTraversalConsequenceReplay {
  return replaySdlcTraversalConsequence(input);
}
