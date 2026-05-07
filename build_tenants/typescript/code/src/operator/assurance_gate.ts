// Implements: REQ-F-ODDSDLC-013
// Implements: REQ-F-ODDSDLC-051
// Implements: REQ-F-ODDSDLC-055

import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  deriveCapabilityAssuranceLedger,
  deriveMaterializationAssuranceLedger,
  deriveObligationCarryAssuranceLedger,
  deriveRequirementFulfillmentAssuranceLedger,
  deriveShallowRealizationAssuranceLedger,
  deriveComponentDepthAssuranceLedger,
  deriveDesignCompletenessAssuranceLedger,
  foldSdlcAssuranceLedgers,
  type SdlcAssuranceLedger,
  type SdlcAssuranceLedgerDimension,
  type SdlcAssuranceLedgerReason,
  type SdlcTraversalRequirementSatisfaction,
  type SdlcObservedCapability,
  type SdlcRealizationTextSurface,
  type SdlcRequiredCapability
} from "../assurance/index.js";
import {
  assuranceLedger,
  assuranceReason,
  uniqueSorted,
  verdictFromReasons
} from "../assurance/shared.js";
import {
  canonicalSdlcPriorGapReasonCode,
  legacyBlockingReasonCode,
  makeSdlcBlockingReason
} from "../shared/blocking_reason.js";
import type { SdlcRequirementClosureRegister } from "../projection/index.js";
import type {
  SdlcPostflightResult,
  SdlcTraversalObligation,
  SdlcWorkerHandoffManifest,
  SdlcWorkerObligationAssessment,
  SdlcWorkerResultReport
} from "./carriers.js";

export interface SdlcOperatorAssuranceGateResult {
  readonly kind: "sdlc_operator_assurance_gate_result";
  readonly requiredDimensions: readonly SdlcAssuranceLedgerDimension[];
  readonly ledgers: readonly SdlcAssuranceLedger[];
  readonly satisfaction: SdlcTraversalRequirementSatisfaction;
  readonly blockingPostflight: SdlcPostflightResult | null;
}

function isPositiveCapabilityValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.length > 0 &&
    normalized !== "false" &&
    normalized !== "0" &&
    normalized !== "no" &&
    normalized !== "off"
  );
}

function normalizedSearchText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/gu, "");
}

function capabilityTokens(input: {
  readonly capabilityId: string;
  readonly evidenceContract: string;
}): readonly string[] {
  const tokens = [
    input.capabilityId,
    input.capabilityId.replaceAll("_", " "),
    input.capabilityId.replaceAll("_", ""),
    input.evidenceContract
  ].filter((token) => token.trim().length > 0);
  return Object.freeze([...new Set(tokens.map(normalizedSearchText))]);
}

function materializedTextSurfaces(
  report: SdlcWorkerResultReport
): readonly SdlcRealizationTextSurface[] {
  return Object.freeze(
    report.materializedFiles
      .filter((file) => existsSync(file.absolutePath))
      .map((file) =>
        Object.freeze({
          kind: "sdlc_realization_text_surface" as const,
          role: file.role,
          ref: pathToFileURL(file.absolutePath).href,
          content: readFileSync(file.absolutePath, "utf8")
        })
      )
  );
}

function requiredCapabilitiesFromManifest(
  manifest: SdlcWorkerHandoffManifest
): readonly SdlcRequiredCapability[] {
  return Object.freeze(
    manifest.conformedProject.capabilityContracts
      .filter((contract) => isPositiveCapabilityValue(contract.value))
      .map((contract) =>
        Object.freeze({
          kind: "sdlc_required_capability" as const,
          capabilityId: contract.name,
          evidenceContract: contract.value,
          requirementRefs: Object.freeze([
            `capability-contract://${manifest.conformedProject.activeTenant}/${contract.name}`
          ])
        })
      )
  );
}

function observedCapabilities(input: {
  readonly requiredCapabilities: readonly SdlcRequiredCapability[];
  readonly surfaces: readonly SdlcRealizationTextSurface[];
}): readonly SdlcObservedCapability[] {
  const observed: SdlcObservedCapability[] = [];
  for (const capability of input.requiredCapabilities) {
    const tokens = capabilityTokens(capability);
    const matchingSurfaces = input.surfaces.filter((surface) => {
      const text = normalizedSearchText(surface.content);
      return tokens.some((token) => token.length > 0 && text.includes(token));
    });
    if (matchingSurfaces.length > 0) {
      observed.push(
        Object.freeze({
          kind: "sdlc_observed_capability" as const,
          capabilityId: capability.capabilityId,
          evidenceRefs: Object.freeze(matchingSurfaces.map((surface) => surface.ref)),
          substantive: true,
          evidenceQuality: "substantive" as const
        })
      );
    }
  }
  return Object.freeze(observed);
}

function assessmentByObligationId(
  report: SdlcWorkerResultReport
): ReadonlyMap<string, SdlcWorkerObligationAssessment> {
  return new Map(
    report.obligationAssessments.map((assessment) => [
      assessment.obligationId,
      assessment
    ])
  );
}

function deriveDeclaredObligationAssuranceLedger(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): SdlcAssuranceLedger {
  const obligations = input.manifest.traversalObligationContext.obligations;
  if (obligations.length === 0) {
    return assuranceLedger({
      dimension: "semantic_convergence",
      verdict: "not_applicable",
      required: false
    });
  }
  const byId = assessmentByObligationId(input.report);
  const obligationIds = new Set(obligations.map((obligation) => obligation.obligationId));
  const missing = obligations.filter(
    (obligation) => !byId.has(obligation.obligationId)
  );
  const extra = input.report.obligationAssessments.filter(
    (assessment) => !obligationIds.has(assessment.obligationId)
  );
  const blocked = input.report.obligationAssessments.filter(
    (assessment) =>
      obligationIds.has(assessment.obligationId) &&
      assessment.fulfillmentStatus === "blocked"
  );
  const open = input.report.obligationAssessments.filter(
    (assessment) =>
      obligationIds.has(assessment.obligationId) &&
      (assessment.fulfillmentStatus === "partial" ||
        assessment.fulfillmentStatus === "unassessed")
  );
  const fulfilledWithoutEvidence = input.report.obligationAssessments.filter(
    (assessment) =>
      obligationIds.has(assessment.obligationId) &&
      assessment.fulfillmentStatus === "fulfilled" &&
      assessment.evidenceRefs.length === 0
  );
  const blockedReasonCodes = [
    ...missing.map(
      (obligation) => `obligation_assessment_missing:${obligation.obligationId}`
    ),
    ...extra.map(
      (assessment) => `obligation_assessment_extra:${assessment.obligationId}`
    ),
    ...blocked.map(
      (assessment) => `obligation_assessment_blocked:${assessment.obligationId}`
    )
  ];
  const openGapReasonCodes = [
    ...open.map(
      (assessment) => `obligation_assessment_open:${assessment.obligationId}`
    ),
    ...fulfilledWithoutEvidence.map(
      (assessment) => `obligation_assessment_evidence_missing:${assessment.obligationId}`
    )
  ];
  return assuranceLedger({
    dimension: "semantic_convergence",
    verdict: verdictFromReasons({
      blockedReasonCodes,
      openGapReasonCodes
    }),
    reasons: [
      ...missing.map((obligation) =>
        assuranceReason({
          code: `obligation_assessment_missing:${obligation.obligationId}`,
          message: `Traversal obligation ${obligation.obligationId} was not assessed by the worker.`,
          evidenceRefs: obligation.evidenceRefs,
          lawfulReentryPoint: "operator_blocked"
        })
      ),
      ...extra.map((assessment) =>
        assuranceReason({
          code: `obligation_assessment_extra:${assessment.obligationId}`,
          message: `Worker assessed undeclared obligation ${assessment.obligationId}.`,
          evidenceRefs: assessment.evidenceRefs,
          lawfulReentryPoint: "operator_blocked"
        })
      ),
      ...blocked.map((assessment) =>
        assuranceReason({
          code: `obligation_assessment_blocked:${assessment.obligationId}`,
          message: `Traversal obligation ${assessment.obligationId} is blocked.`,
          evidenceRefs: assessment.evidenceRefs,
          lawfulReentryPoint: "operator_blocked"
        })
      ),
      ...open.map((assessment) =>
        assuranceReason({
          code: `obligation_assessment_open:${assessment.obligationId}`,
          message: `Traversal obligation ${assessment.obligationId} remains ${assessment.fulfillmentStatus}.`,
          evidenceRefs: assessment.evidenceRefs,
          lawfulReentryPoint: "same_edge_retry"
        })
      ),
      ...fulfilledWithoutEvidence.map((assessment) =>
        assuranceReason({
          code: `obligation_assessment_evidence_missing:${assessment.obligationId}`,
          message: `Traversal obligation ${assessment.obligationId} was fulfilled without evidence refs.`,
          lawfulReentryPoint: "same_edge_retry"
        })
      )
    ],
    evidenceRefs: uniqueSorted(
      input.report.obligationAssessments.flatMap((assessment) => assessment.evidenceRefs)
    ),
    carryForwardObligationRefs: uniqueSorted(
      [...missing.map((obligation) => obligation.obligationId), ...open.map((assessment) => assessment.obligationId)]
    )
  });
}

function requirementIdFromObligation(obligation: SdlcTraversalObligation): string | null {
  if (obligation.obligationKind !== "requirement") {
    return null;
  }
  const prefix = "requirement:";
  return obligation.obligationId.startsWith(prefix)
    ? obligation.obligationId.slice(prefix.length)
    : obligation.obligationId;
}

function requirementClosureRegisterFromObligations(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): SdlcRequirementClosureRegister | null {
  const requirementObligations = input.manifest.traversalObligationContext.obligations
    .map((obligation) => ({
      obligation,
      requirementId: requirementIdFromObligation(obligation)
    }))
    .filter(
      (entry): entry is { readonly obligation: SdlcTraversalObligation; readonly requirementId: string } =>
        entry.requirementId !== null && entry.requirementId.length > 0
    );
  if (requirementObligations.length === 0) {
    return null;
  }
  const byId = assessmentByObligationId(input.report);
  const entries = requirementObligations.map(({ obligation, requirementId }) => {
    const assessment = byId.get(obligation.obligationId);
    const fulfilled = assessment?.fulfillmentStatus === "fulfilled";
    const openReasons =
      assessment === undefined
        ? Object.freeze(["obligation_assessment_missing"])
        : fulfilled
          ? Object.freeze([])
          : uniqueSorted([
              `obligation_${assessment.fulfillmentStatus}`,
              ...assessment.blockingReasons
            ]);
    const evidenceRefs = uniqueSorted([
      ...obligation.evidenceRefs,
      ...(assessment?.evidenceRefs ?? [])
    ]);
    return Object.freeze({
      kind: "sdlc_requirement_closure_entry" as const,
      requirementId,
      sourceInputUris: obligation.evidenceRefs,
      assetIds: Object.freeze(
        input.report.materializedFiles.map((file) => file.absolutePath)
      ),
      producedByGraphFunctions: Object.freeze([input.manifest.graphFunctionName]),
      proofKinds: Object.freeze(
        fulfilled ? (["runtime_result"] as const) : ([] as const)
      ),
      authorityVerbs: Object.freeze(
        fulfilled ? (["implements"] as const) : ([] as const)
      ),
      evidenceRefs,
      traceabilityStatus: fulfilled ? "behavioral_evidence" as const : "absent" as const,
      fulfillmentStatus: fulfilled ? "fulfilled" as const : "partial" as const,
      carryStatus: fulfilled ? "fulfilled" as const : "carried_forward" as const,
      openReasons
    });
  });
  return Object.freeze({
    kind: "sdlc_requirement_closure_register" as const,
    entries: Object.freeze(entries),
    fulfilledRequirementIds: uniqueSorted(
      entries
        .filter((entry) => entry.fulfillmentStatus === "fulfilled")
        .map((entry) => entry.requirementId)
    ),
    carriedForwardRequirementIds: uniqueSorted(
      entries
        .filter((entry) => entry.carryStatus === "carried_forward")
        .map((entry) => entry.requirementId)
    ),
    unresolvedRequirementIds: uniqueSorted(
      entries
        .filter((entry) => entry.fulfillmentStatus !== "fulfilled")
        .map((entry) => entry.requirementId)
    ),
    emittedRuntimeEventKinds: Object.freeze([] as const)
  });
}

function closedPriorGapReasonCodes(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
}): readonly string[] {
  const fulfilledAssessmentIds = new Set(
    input.report.obligationAssessments
      .filter((assessment) => assessment.fulfillmentStatus === "fulfilled")
      .map((assessment) =>
        canonicalSdlcPriorGapReasonCode(assessment.obligationId)
      )
  );
  return uniqueSorted(
    input.manifest.retryContext.priorGapDossiers.flatMap((dossier) =>
      dossier.reasons.flatMap((reason) => {
        const reasonCode = canonicalSdlcPriorGapReasonCode(reason.reason);
        return fulfilledAssessmentIds.has(reasonCode) ? [reasonCode] : [];
      })
    )
  );
}

function priorGapReasonCodes(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return uniqueSorted(
    manifest.retryContext.priorGapDossiers.flatMap((dossier) =>
      dossier.reasons.map((reason) =>
        canonicalSdlcPriorGapReasonCode(reason.reason)
      )
    )
  );
}

function currentAssuranceReasonCodes(
  ledgers: readonly SdlcAssuranceLedger[]
): readonly string[] {
  return uniqueSorted(
    ledgers.flatMap((ledger) =>
      ledger.reasons.map((reason) =>
        canonicalSdlcPriorGapReasonCode(reason.code)
      )
    )
  );
}

function blockingReentryForAssuranceReason(
  reason: SdlcAssuranceLedgerReason
):
  | "same_edge_retry"
  | "escalate_to_fp"
  | "repair_worker_output"
  | "reprice_requirement_or_design"
  | "operator_blocked" {
  if (
    reason.lawfulReentryPoint === "requirement_reprice" ||
    reason.lawfulReentryPoint === "design_reframe"
  ) {
    return "reprice_requirement_or_design";
  }
  return reason.lawfulReentryPoint;
}

function orderedSatisfactionReasons(
  satisfaction: SdlcTraversalRequirementSatisfaction
): readonly SdlcAssuranceLedgerReason[] {
  const reasonByCode = new Map<string, SdlcAssuranceLedgerReason>();
  for (const reason of [
    ...satisfaction.gapReasons,
    ...satisfaction.blockingReasons,
    ...satisfaction.repriceReasons,
    ...satisfaction.fpEscalationReasons
  ]) {
    reasonByCode.set(reason.code, reason);
  }
  return Object.freeze(
    satisfaction.retryHandoff.reasonCodes.map((reasonCode) => {
      const reason = reasonByCode.get(reasonCode);
      if (reason === undefined) {
        return assuranceReason({
          code: reasonCode,
          message: `Assurance ledger reason ${reasonCode} was present in retry handoff without full reason detail.`,
          evidenceRefs: satisfaction.retryHandoff.evidenceRefs,
          lawfulReentryPoint:
            satisfaction.status === "reprice_required"
              ? "requirement_reprice"
              : satisfaction.status === "fp_escalation"
                ? "escalate_to_fp"
              : "same_edge_retry"
        });
      }
      return reason;
    })
  );
}

function postflightFromSatisfaction(
  satisfaction: SdlcTraversalRequirementSatisfaction
): SdlcPostflightResult | null {
  if (
    satisfaction.status === "close_allowed" ||
    satisfaction.status === "not_applicable"
  ) {
    return null;
  }
  const carriers = orderedSatisfactionReasons(satisfaction).map((reason) =>
    makeSdlcBlockingReason({
      code: "assurance_ledger_reason",
      detail: reason.code,
      evidenceRefs: uniqueSorted([
        ...satisfaction.retryHandoff.evidenceRefs,
        ...reason.evidenceRefs
      ]),
      lawfulReentryPoint: blockingReentryForAssuranceReason(reason),
      message: reason.message,
      reasonClass: "assurance"
    })
  );
  return Object.freeze({
    kind: "sdlc_operator_postflight_result" as const,
    status: "blocked" as const,
    blockingReasons: Object.freeze(carriers.map(legacyBlockingReasonCode)),
    blockingReasonCarriers: Object.freeze(carriers),
    evidenceRefs: satisfaction.retryHandoff.evidenceRefs
  });
}

export function deriveSdlcOperatorAssuranceGate(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly postflight: SdlcPostflightResult;
}): SdlcOperatorAssuranceGateResult {
  const materialization = deriveMaterializationAssuranceLedger({
    manifest: input.manifest,
    report: input.report,
    postflight: input.postflight
  });
  const ledgers: SdlcAssuranceLedger[] = [materialization];
  const requiredDimensions: SdlcAssuranceLedgerDimension[] = ["materialization"];

  if (input.manifest.productMaterialization.required) {
    const surfaces = materializedTextSurfaces(input.report);
    ledgers.push(
      deriveShallowRealizationAssuranceLedger({
        surfaces,
        synthesisRequired: input.manifest.targetAssetType === "code_surface",
        executableProofRequired:
          input.manifest.targetAssetType === "test_module_surface"
      })
    );
    requiredDimensions.push("shallow_realization");

    const requiredCapabilities =
      input.manifest.targetAssetType === "code_surface"
        ? requiredCapabilitiesFromManifest(input.manifest)
        : Object.freeze([]);
    if (requiredCapabilities.length > 0) {
      ledgers.push(
        deriveCapabilityAssuranceLedger({
          requiredCapabilities,
          observedCapabilities: observedCapabilities({
            requiredCapabilities,
            surfaces
          }),
          inventoryRequired: true
        })
      );
      requiredDimensions.push("capability");
    }
  }

  if (input.manifest.traversalObligationContext.obligations.length > 0) {
    ledgers.push(
      deriveDeclaredObligationAssuranceLedger({
        manifest: input.manifest,
        report: input.report
      })
    );
    requiredDimensions.push("semantic_convergence");
  }

  const componentDepth = deriveComponentDepthAssuranceLedger({
    manifest: input.manifest,
    report: input.report
  });
  if (componentDepth !== null) {
    ledgers.push(componentDepth);
    requiredDimensions.push("component_depth");
  }

  const designCompleteness = deriveDesignCompletenessAssuranceLedger({
    manifest: input.manifest,
    report: input.report
  });
  if (designCompleteness !== null) {
    ledgers.push(designCompleteness);
    requiredDimensions.push("design_completeness");
  }

  const requirementClosureRegister = requirementClosureRegisterFromObligations({
    manifest: input.manifest,
    report: input.report
  });
  if (requirementClosureRegister !== null) {
    ledgers.push(
      deriveRequirementFulfillmentAssuranceLedger({
        closureRegister: requirementClosureRegister
      })
    );
    requiredDimensions.push("requirement_fulfillment");
  }

  if (input.manifest.retryContext.priorGapDossiers.length > 0) {
    const currentReasonCodes = currentAssuranceReasonCodes(ledgers);
    const closedReasonCodes = uniqueSorted([
      ...closedPriorGapReasonCodes({
        manifest: input.manifest,
        report: input.report
      }),
      ...priorGapReasonCodes(input.manifest).filter(
        (reasonCode) => !currentReasonCodes.includes(reasonCode)
      )
    ]);
    ledgers.push(
      deriveObligationCarryAssuranceLedger({
        manifest: input.manifest,
        currentGapDossier: null,
        currentReasonCodes,
        closedReasonCodes
      })
    );
    requiredDimensions.push("obligation_carry");
  }

  const satisfaction = foldSdlcAssuranceLedgers({
    ledgers,
    requiredDimensions
  });

  return Object.freeze({
    kind: "sdlc_operator_assurance_gate_result" as const,
    requiredDimensions: Object.freeze(requiredDimensions),
    ledgers: Object.freeze(ledgers),
    satisfaction,
    blockingPostflight: postflightFromSatisfaction(satisfaction)
  });
}
