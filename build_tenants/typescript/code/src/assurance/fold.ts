// Implements: REQ-F-ODDSDLC-013
// Implements: REQ-F-ODDSDLC-051
// Implements: REQ-F-ODDSDLC-055

import {
  SDLC_ASSURANCE_LEDGER_DIMENSIONS,
  makeSdlcAssuranceLedgerReason,
  type SdlcAssuranceFoldInput,
  type SdlcAssuranceLedger,
  type SdlcAssuranceLedgerDimension,
  type SdlcAssuranceLedgerReason,
  type SdlcTraversalRequirementSatisfaction,
  type SdlcTraversalRequirementSatisfactionStatus
} from "./carriers.js";

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function requiredDimensionsFor(
  input: SdlcAssuranceFoldInput
): readonly SdlcAssuranceLedgerDimension[] {
  return Object.freeze([
    ...(input.requiredDimensions ?? SDLC_ASSURANCE_LEDGER_DIMENSIONS)
  ]);
}

function reasonsForVerdict(
  ledgers: readonly SdlcAssuranceLedger[],
  verdict: SdlcAssuranceLedger["verdict"]
): readonly SdlcAssuranceLedgerReason[] {
  return Object.freeze(
    ledgers.flatMap((ledger) =>
      ledger.verdict === verdict ? [...ledger.reasons] : []
    )
  );
}

function missingRequiredReasons(
  missingRequiredDimensions: readonly SdlcAssuranceLedgerDimension[]
): readonly SdlcAssuranceLedgerReason[] {
  return Object.freeze(
    missingRequiredDimensions.map((dimension) =>
      makeSdlcAssuranceLedgerReason({
        code: `missing_required_ledger:${dimension}`,
        message: `Missing required assurance ledger: ${dimension}`,
        lawfulReentryPoint: "operator_blocked"
      })
    )
  );
}

function statusFor(input: {
  readonly missingRequiredDimensions: readonly SdlcAssuranceLedgerDimension[];
  readonly ledgers: readonly SdlcAssuranceLedger[];
}): SdlcTraversalRequirementSatisfactionStatus {
  if (input.missingRequiredDimensions.length > 0) {
    return "blocked";
  }
  if (input.ledgers.some((ledger) => ledger.verdict === "blocked")) {
    return "blocked";
  }
  if (input.ledgers.some((ledger) => ledger.verdict === "reprice_required")) {
    return "reprice_required";
  }
  if (input.ledgers.some((ledger) => ledger.verdict === "open_gap")) {
    return "retry_same_edge";
  }
  if (input.ledgers.length === 0) {
    return "not_applicable";
  }
  return "close_allowed";
}

export function foldSdlcAssuranceLedgers(
  input: SdlcAssuranceFoldInput
): SdlcTraversalRequirementSatisfaction {
  const requiredDimensions = requiredDimensionsFor(input);
  const ledgerDimensions = new Set(
    input.ledgers.map((ledger) => ledger.dimension)
  );
  const missingRequiredDimensions = Object.freeze(
    requiredDimensions.filter((dimension) => !ledgerDimensions.has(dimension))
  );
  const missingReasons = missingRequiredReasons(missingRequiredDimensions);
  const blockedReasons = Object.freeze([
    ...missingReasons,
    ...reasonsForVerdict(input.ledgers, "blocked")
  ]);
  const repriceReasons = reasonsForVerdict(input.ledgers, "reprice_required");
  const gapReasons = reasonsForVerdict(input.ledgers, "open_gap");
  const retryReasonCodes = Object.freeze(
    [...gapReasons, ...blockedReasons, ...repriceReasons].map(
      (reason) => reason.code
    )
  );
  const retryEvidenceRefs = uniqueSorted(
    input.ledgers.flatMap((ledger) => [
      ...ledger.evidenceRefs,
      ...ledger.reasons.flatMap((reason) => reason.evidenceRefs)
    ])
  );
  const status = statusFor({
    missingRequiredDimensions,
    ledgers: input.ledgers
  });

  return Object.freeze({
    kind: "sdlc_traversal_requirement_satisfaction" as const,
    status,
    ledgers: Object.freeze([...input.ledgers]),
    missingRequiredDimensions,
    blockingReasons: blockedReasons,
    repriceReasons,
    gapReasons,
    satisfiedDimensions: Object.freeze(
      input.ledgers
        .filter((ledger) => ledger.verdict === "satisfied")
        .map((ledger) => ledger.dimension)
    ),
    notApplicableDimensions: Object.freeze(
      input.ledgers
        .filter((ledger) => ledger.verdict === "not_applicable")
        .map((ledger) => ledger.dimension)
    ),
    retryHandoff: Object.freeze({
      kind: "sdlc_traversal_retry_handoff" as const,
      obligationRefs: uniqueSorted(
        input.ledgers.flatMap((ledger) => ledger.carryForwardObligationRefs)
      ),
      reasonCodes: uniqueSorted(retryReasonCodes),
      evidenceRefs: retryEvidenceRefs
    })
  });
}
