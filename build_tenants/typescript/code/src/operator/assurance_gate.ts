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
  canonicalSdlcPriorGapReasonCode
} from "../shared/blocking_reason.js";
import { FG_CONFORM_PROJECT_AUTHORITY } from "../graph/index.js";
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

function carriesDownstreamRequirementTransformationSet(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly postflight: SdlcPostflightResult;
  readonly assessment: SdlcWorkerObligationAssessment;
}): boolean {
  const requirementRecordedForFutureClosure =
    input.assessment.blockingReasons.some((reason) =>
      reason.startsWith("requirement_recorded_for_future_closure:")
    );
  const requirementCarriedForDownstreamClosure =
    input.assessment.blockingReasons.some((reason) =>
      reason.startsWith("requirement_carried_for_downstream_closure:")
    );
  const authorityConformanceInducedRequirement =
    input.postflight.status === "passed" &&
    input.manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY;
  const componentCodeCarriesDownstreamRequirement =
    input.manifest.productMaterialization.required &&
    input.manifest.targetAssetType === "component_code_surface" &&
    requirementCarriedForDownstreamClosure;
  return (
    input.assessment.obligationId.startsWith("requirement:") &&
    (componentCodeCarriesDownstreamRequirement ||
      (!input.manifest.productMaterialization.required &&
        (requirementCarriedForDownstreamClosure ||
          (input.manifest.targetAssetType === "requirement_surface" &&
            requirementRecordedForFutureClosure) ||
          authorityConformanceInducedRequirement)))
  );
}

function admitsAuthorityConformanceInducedRequirement(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly postflight: SdlcPostflightResult;
  readonly assessment: SdlcWorkerObligationAssessment;
}): boolean {
  return (
    input.postflight.status === "passed" &&
    input.manifest.graphFunctionName === FG_CONFORM_PROJECT_AUTHORITY &&
    !input.manifest.productMaterialization.required &&
    input.assessment.obligationId.startsWith("requirement:")
  );
}

function deriveDeclaredObligationAssuranceLedger(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly postflight: SdlcPostflightResult;
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
    (assessment) =>
      !obligationIds.has(assessment.obligationId) &&
      !admitsAuthorityConformanceInducedRequirement({
        manifest: input.manifest,
        postflight: input.postflight,
        assessment
      })
  );
  const blocked = input.report.obligationAssessments.filter(
    (assessment) =>
      obligationIds.has(assessment.obligationId) &&
      assessment.fulfillmentStatus === "blocked" &&
      !carriesDownstreamRequirementTransformationSet({
        manifest: input.manifest,
        postflight: input.postflight,
        assessment
      })
  );
  const open = input.report.obligationAssessments.filter(
    (assessment) =>
      obligationIds.has(assessment.obligationId) &&
      (assessment.fulfillmentStatus === "partial" ||
        assessment.fulfillmentStatus === "unassessed") &&
      !carriesDownstreamRequirementTransformationSet({
        manifest: input.manifest,
        postflight: input.postflight,
        assessment
      })
  );
  const downstreamCarried = input.report.obligationAssessments.filter(
    (assessment) =>
      obligationIds.has(assessment.obligationId) &&
      carriesDownstreamRequirementTransformationSet({
        manifest: input.manifest,
        postflight: input.postflight,
        assessment
      })
  );
  const fulfilledWithoutEvidence = input.report.obligationAssessments.filter(
    (assessment) =>
      obligationIds.has(assessment.obligationId) &&
      assessment.fulfillmentStatus === "fulfilled" &&
      assessment.evidenceRefs.length === 0
  );
  const openGapReasonCodes = [
    ...missing.map(
      (obligation) => `obligation_assessment_missing:${obligation.obligationId}`
    ),
    ...extra.map(
      (assessment) => `obligation_assessment_extra:${assessment.obligationId}`
    ),
    ...blocked.map(
      (assessment) => `obligation_assessment_blocked:${assessment.obligationId}`
    ),
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
      blockedReasonCodes: Object.freeze([]),
      openGapReasonCodes
    }),
    reasons: [
      ...missing.map((obligation) =>
        assuranceReason({
          code: `obligation_assessment_missing:${obligation.obligationId}`,
          message: `Traversal obligation ${obligation.obligationId} was not assessed by the worker.`,
          evidenceRefs: obligation.evidenceRefs,
          lawfulReentryPoint: "same_edge_retry"
        })
      ),
      ...extra.map((assessment) =>
        assuranceReason({
          code: `obligation_assessment_extra:${assessment.obligationId}`,
          message: `Worker assessed undeclared obligation ${assessment.obligationId}.`,
          evidenceRefs: assessment.evidenceRefs,
          lawfulReentryPoint: "repair_worker_output"
        })
      ),
      ...blocked.map((assessment) =>
        assuranceReason({
          code: `obligation_assessment_blocked:${assessment.obligationId}`,
          message: `Traversal obligation ${assessment.obligationId} is blocked.`,
          evidenceRefs: assessment.evidenceRefs,
          lawfulReentryPoint: "repair_worker_output"
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
      [
        ...missing.map((obligation) => obligation.obligationId),
        ...open.map((assessment) => assessment.obligationId),
        ...downstreamCarried.map((assessment) => assessment.obligationId)
      ]
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
  readonly postflight: SdlcPostflightResult;
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
    const carriedDownstream =
      assessment === undefined
        ? false
        : carriesDownstreamRequirementTransformationSet({
            manifest: input.manifest,
            postflight: input.postflight,
            assessment
          });
    const fulfilled = assessment?.fulfillmentStatus === "fulfilled";
    const openReasons =
      assessment === undefined
        ? Object.freeze(["obligation_assessment_missing"])
        : fulfilled || carriedDownstream
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
      requirementDisplayId: requirementId,
      requirementAuthorityRef: requirementId,
      sourceInputUris: obligation.evidenceRefs,
      assetIds: Object.freeze(
        input.report.materializedFiles.map((file) => file.absolutePath)
      ),
      producedByGraphFunctions: Object.freeze([input.manifest.graphFunctionName]),
      proofKinds: Object.freeze(
        fulfilled
          ? (["runtime_result"] as const)
          : carriedDownstream
            ? (["design_carry"] as const)
            : ([] as const)
      ),
      authorityVerbs: Object.freeze(
        fulfilled
          ? (["implements"] as const)
          : carriedDownstream
            ? (["carries"] as const)
            : ([] as const)
      ),
      evidenceRefs,
      traceabilityStatus: fulfilled
        ? "behavioral_evidence" as const
        : carriedDownstream
          ? "trace_only" as const
          : "absent" as const,
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
    fulfilledRequirementAuthorityRefs: uniqueSorted(
      entries
        .filter((entry) => entry.fulfillmentStatus === "fulfilled")
        .map((entry) => entry.requirementAuthorityRef)
    ),
    carriedForwardRequirementAuthorityRefs: uniqueSorted(
      entries
        .filter((entry) => entry.carryStatus === "carried_forward")
        .map((entry) => entry.requirementAuthorityRef)
    ),
    unresolvedRequirementAuthorityRefs: uniqueSorted(
      entries
        .filter((entry) => entry.fulfillmentStatus !== "fulfilled")
        .map((entry) => entry.requirementAuthorityRef)
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

function designCompletenessIsEvaluateOwned(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return manifest.targetAssetType === "implementation_design_surface";
}

function diagnosticOnlyAssuranceLedger(
  ledger: SdlcAssuranceLedger
): SdlcAssuranceLedger {
  return Object.freeze({
    ...ledger,
    required: false
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

  if (input.manifest.productMaterialization.required) {
    const surfaces = materializedTextSurfaces(input.report);
    ledgers.push(
      deriveShallowRealizationAssuranceLedger({
        surfaces,
        synthesisRequired: input.manifest.targetAssetType === "code_surface",
        executableProofRequired:
          input.manifest.targetAssetType === "component_test_surface"
      })
    );

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
    }
  }

  if (input.manifest.traversalObligationContext.obligations.length > 0) {
    ledgers.push(
      deriveDeclaredObligationAssuranceLedger({
        manifest: input.manifest,
        report: input.report,
        postflight: input.postflight
      })
    );
  }

  const componentDepth = deriveComponentDepthAssuranceLedger({
    manifest: input.manifest,
    report: input.report
  });
  if (componentDepth !== null) {
    ledgers.push(componentDepth);
  }

  if (!designCompletenessIsEvaluateOwned(input.manifest)) {
    const designCompleteness = deriveDesignCompletenessAssuranceLedger({
      manifest: input.manifest,
      report: input.report
    });
    if (designCompleteness !== null) {
      ledgers.push(designCompleteness);
    }
  }

  const requirementClosureRegister = requirementClosureRegisterFromObligations({
    manifest: input.manifest,
    report: input.report,
    postflight: input.postflight
  });
  if (requirementClosureRegister !== null) {
    ledgers.push(
      deriveRequirementFulfillmentAssuranceLedger({
        closureRegister: requirementClosureRegister
      })
    );
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
  }

  // Deterministic assurance ledgers are diagnostic facts. Traversal authority
  // belongs to admitted evaluate.C/F_P findings and consequence.C.
  const diagnosticLedgers = Object.freeze(
    ledgers.map((ledger) => diagnosticOnlyAssuranceLedger(ledger))
  );
  const satisfaction = foldSdlcAssuranceLedgers({
    ledgers: diagnosticLedgers,
    requiredDimensions: Object.freeze([])
  });

  return Object.freeze({
    kind: "sdlc_operator_assurance_gate_result" as const,
    requiredDimensions: Object.freeze([]),
    ledgers: diagnosticLedgers,
    satisfaction
  });
}
