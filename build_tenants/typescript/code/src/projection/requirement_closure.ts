// Implements: REQ-F-ODDSDLC-029
// Implements: REQ-F-ODDSDLC-030
// Implements: REQ-F-ODDSDLC-031

import {
  parseClosedRecord,
  parseEnumValue,
  parseKind,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import type { SdlcWorkReport } from "../hooks/index.js";
import type { SdlcWorkspaceIngressReport } from "../workspace/index.js";

export const SDLC_REQUIREMENT_PROOF_KIND_VALUES = Object.freeze([
  "trace_tag",
  "design_carry",
  "planned_test",
  "behavioral_test",
  "runtime_result"
] as const);

export type SdlcRequirementProofKind =
  (typeof SDLC_REQUIREMENT_PROOF_KIND_VALUES)[number];

export const SDLC_REQUIREMENT_PROOF_AUTHORITY_VALUES = Object.freeze([
  "implements",
  "validates",
  "carries"
] as const);

export type SdlcRequirementProofAuthority =
  (typeof SDLC_REQUIREMENT_PROOF_AUTHORITY_VALUES)[number];

export interface SdlcRequirementProofClaim {
  readonly kind: "sdlc_requirement_proof_claim";
  readonly requirementId: string;
  readonly assetId: string;
  readonly proofKind: SdlcRequirementProofKind;
  readonly authorityVerb: SdlcRequirementProofAuthority;
  readonly evidenceRefs: readonly string[];
}

export interface SdlcLineageProof {
  readonly kind: "sdlc_lineage_proof";
  readonly requirementId: string;
  readonly proofKind: SdlcRequirementProofKind;
  readonly authorityVerb: SdlcRequirementProofAuthority;
  readonly evidenceRefs: readonly string[];
}

export interface SdlcLineageEntry {
  readonly kind: "sdlc_lineage_entry";
  readonly elementId: string;
  readonly elementKind: "generated_asset";
  readonly sourceInputUris: readonly string[];
  readonly requirementIds: readonly string[];
  readonly producedByGraphFunction: string;
  readonly selectedBy: "abg_selected_edge";
  readonly targetAssetType: string;
  readonly outputDigest: string;
  readonly generatedAssetContractSatisfied: boolean;
  readonly evidenceRefs: readonly string[];
  readonly proofKinds: readonly SdlcRequirementProofKind[];
  readonly authorityVerbs: readonly SdlcRequirementProofAuthority[];
  readonly proofs: readonly SdlcLineageProof[];
}

export interface SdlcLineageLedger {
  readonly kind: "sdlc_lineage_ledger";
  readonly entries: readonly SdlcLineageEntry[];
  readonly emittedRuntimeEventKinds: readonly [];
}

export type SdlcRequirementFulfillmentStatus =
  | "fulfilled"
  | "partial"
  | "planned"
  | "missing";

export type SdlcRequirementCarryStatus = "fulfilled" | "carried_forward";

export type SdlcRequirementTraceabilityStatus =
  | "absent"
  | "trace_only"
  | "behavioral_evidence";

export interface SdlcRequirementClosureEntry {
  readonly kind: "sdlc_requirement_closure_entry";
  readonly requirementId: string;
  readonly sourceInputUris: readonly string[];
  readonly assetIds: readonly string[];
  readonly producedByGraphFunctions: readonly string[];
  readonly proofKinds: readonly SdlcRequirementProofKind[];
  readonly authorityVerbs: readonly SdlcRequirementProofAuthority[];
  readonly evidenceRefs: readonly string[];
  readonly traceabilityStatus: SdlcRequirementTraceabilityStatus;
  readonly fulfillmentStatus: SdlcRequirementFulfillmentStatus;
  readonly carryStatus: SdlcRequirementCarryStatus;
  readonly openReasons: readonly string[];
}

export interface SdlcRequirementClosureRegister {
  readonly kind: "sdlc_requirement_closure_register";
  readonly entries: readonly SdlcRequirementClosureEntry[];
  readonly fulfilledRequirementIds: readonly string[];
  readonly carriedForwardRequirementIds: readonly string[];
  readonly unresolvedRequirementIds: readonly string[];
  readonly emittedRuntimeEventKinds: readonly [];
}

export type SdlcRepairFrontierLane = "requirements" | "design" | "code" | "test";

export interface SdlcRepairFrontierEntry {
  readonly kind: "sdlc_repair_frontier_entry";
  readonly lane: SdlcRepairFrontierLane;
  readonly requirementIds: readonly string[];
  readonly action: string;
}

export interface SdlcRepairFrontier {
  readonly kind: "sdlc_repair_frontier";
  readonly unmetRequirementIds: readonly string[];
  readonly preservationRequirementIds: readonly string[];
  readonly lanes: readonly SdlcRepairFrontierEntry[];
  readonly lawfulEditFrontier: string;
  readonly lawfulProofFrontier: string;
  readonly emittedRuntimeEventKinds: readonly [];
}

const EMPTY_RUNTIME_EVENT_KINDS: readonly [] = Object.freeze([]);

function uniqueSorted<T extends string>(values: readonly T[]): readonly T[] {
  return Object.freeze([...new Set(values)].sort());
}

export function admitSdlcRequirementProofClaim(
  input: unknown,
  label = "SdlcRequirementProofClaim"
): SdlcRequirementProofClaim {
  const record = parseClosedRecord(input, label, [
    "kind",
    "requirementId",
    "assetId",
    "proofKind",
    "authorityVerb",
    "evidenceRefs"
  ]);
  parseKind(record["kind"], "sdlc_requirement_proof_claim", `${label}.kind`);
  return Object.freeze({
    kind: "sdlc_requirement_proof_claim",
    requirementId: parseNonEmptyString(record["requirementId"], `${label}.requirementId`),
    assetId: parseNonEmptyString(record["assetId"], `${label}.assetId`),
    proofKind: parseEnumValue(
      record["proofKind"],
      `${label}.proofKind`,
      SDLC_REQUIREMENT_PROOF_KIND_VALUES
    ),
    authorityVerb: parseEnumValue(
      record["authorityVerb"],
      `${label}.authorityVerb`,
      SDLC_REQUIREMENT_PROOF_AUTHORITY_VALUES
    ),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function proofForClaim(claim: SdlcRequirementProofClaim): SdlcLineageProof {
  return Object.freeze({
    kind: "sdlc_lineage_proof",
    requirementId: claim.requirementId,
    proofKind: claim.proofKind,
    authorityVerb: claim.authorityVerb,
    evidenceRefs: Object.freeze([...claim.evidenceRefs])
  });
}

function sourceUrisForRequirement(input: {
  readonly ingressReport: SdlcWorkspaceIngressReport;
  readonly requirementId: string;
}): readonly string[] {
  return uniqueSorted(
    input.ingressReport.importedRequirementAuthorities
      .filter((authority) => authority.requirementId === input.requirementId)
      .map((authority) => authority.sourceUri)
  );
}

export function deriveSdlcLineageLedger(input: {
  readonly ingressReport: SdlcWorkspaceIngressReport;
  readonly workReports: readonly SdlcWorkReport[];
  readonly proofClaims: readonly SdlcRequirementProofClaim[];
}): SdlcLineageLedger {
  return Object.freeze({
    kind: "sdlc_lineage_ledger",
    entries: Object.freeze(
      input.workReports.map((report) => {
        const claims = input.proofClaims.filter(
          (claim) => claim.assetId === report.outputIdentity.assetId
        );
        const proofs = Object.freeze(claims.map(proofForClaim));
        const requirementIds = uniqueSorted(claims.map((claim) => claim.requirementId));
        return Object.freeze({
          kind: "sdlc_lineage_entry",
          elementId: report.outputIdentity.assetId,
          elementKind: "generated_asset",
          sourceInputUris: uniqueSorted(
            requirementIds.flatMap((requirementId) =>
              sourceUrisForRequirement({ ingressReport: input.ingressReport, requirementId })
            )
          ),
          requirementIds,
          producedByGraphFunction: report.generatedAssetAuthority.graphFunctionName,
          selectedBy: report.generatedAssetAuthority.selectedBy,
          targetAssetType: report.generatedAssetAuthority.targetAssetType,
          outputDigest: report.outputIdentity.digest,
          generatedAssetContractSatisfied: report.generatedAssetContract.satisfied,
          evidenceRefs: uniqueSorted([
            ...report.evidenceRefs.map((evidence) => evidence.ref),
            ...claims.flatMap((claim) => claim.evidenceRefs)
          ]),
          proofKinds: uniqueSorted(claims.map((claim) => claim.proofKind)),
          authorityVerbs: uniqueSorted(claims.map((claim) => claim.authorityVerb)),
          proofs
        });
      })
    ),
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

function liveRequirementIds(ingressReport: SdlcWorkspaceIngressReport): readonly string[] {
  return uniqueSorted(
    ingressReport.importedRequirementAuthorities.map((authority) => authority.requirementId)
  );
}

function closureForRequirement(input: {
  readonly requirementId: string;
  readonly ingressReport: SdlcWorkspaceIngressReport;
  readonly lineageLedger: SdlcLineageLedger;
}): SdlcRequirementClosureEntry {
  const entries = input.lineageLedger.entries.filter((entry) =>
    entry.requirementIds.includes(input.requirementId)
  );
  const proofs = entries.flatMap((entry) =>
    entry.proofs.filter((proof) => proof.requirementId === input.requirementId)
  );
  const proofKinds = uniqueSorted(proofs.map((proof) => proof.proofKind));
  const authorityVerbs = uniqueSorted(proofs.map((proof) => proof.authorityVerb));
  const evidenceRefs = uniqueSorted([
    ...entries.flatMap((entry) => entry.evidenceRefs),
    ...proofs.flatMap((proof) => proof.evidenceRefs)
  ]);
  const hasBehavioralEvidence =
    proofKinds.includes("behavioral_test") || proofKinds.includes("runtime_result");
  const hasTraceTag = proofKinds.includes("trace_tag");
  const hasPlannedEvidence =
    proofKinds.includes("planned_test") || proofKinds.includes("design_carry");
  const hasSatisfiedGeneratedAsset = entries.some(
    (entry) => entry.generatedAssetContractSatisfied
  );
  const openReasons: string[] = [];
  let fulfillmentStatus: SdlcRequirementFulfillmentStatus = "missing";
  let traceabilityStatus: SdlcRequirementTraceabilityStatus = "absent";

  if (entries.length === 0) {
    openReasons.push("no_generated_asset_lineage");
  } else if (hasBehavioralEvidence && hasSatisfiedGeneratedAsset) {
    fulfillmentStatus = "fulfilled";
    traceabilityStatus = "behavioral_evidence";
  } else if (hasTraceTag) {
    fulfillmentStatus = "partial";
    traceabilityStatus = "trace_only";
    openReasons.push("behavioral_evidence_missing");
  } else if (hasPlannedEvidence) {
    fulfillmentStatus = "planned";
    openReasons.push("behavioral_evidence_missing");
  } else {
    fulfillmentStatus = "partial";
    openReasons.push("proof_claim_missing");
  }

  if (entries.length > 0 && !hasSatisfiedGeneratedAsset) {
    openReasons.push("generated_asset_contract_unsatisfied");
  }

  const carryStatus: SdlcRequirementCarryStatus =
    fulfillmentStatus === "fulfilled" ? "fulfilled" : "carried_forward";

  return Object.freeze({
    kind: "sdlc_requirement_closure_entry",
    requirementId: input.requirementId,
    sourceInputUris: sourceUrisForRequirement(input),
    assetIds: uniqueSorted(entries.map((entry) => entry.elementId)),
    producedByGraphFunctions: uniqueSorted(
      entries.map((entry) => entry.producedByGraphFunction)
    ),
    proofKinds,
    authorityVerbs,
    evidenceRefs,
    traceabilityStatus,
    fulfillmentStatus,
    carryStatus,
    openReasons: uniqueSorted(openReasons)
  });
}

export function projectSdlcRequirementClosureRegister(input: {
  readonly ingressReport: SdlcWorkspaceIngressReport;
  readonly lineageLedger: SdlcLineageLedger;
}): SdlcRequirementClosureRegister {
  const entries = Object.freeze(
    liveRequirementIds(input.ingressReport).map((requirementId) =>
      closureForRequirement({
        requirementId,
        ingressReport: input.ingressReport,
        lineageLedger: input.lineageLedger
      })
    )
  );
  return Object.freeze({
    kind: "sdlc_requirement_closure_register",
    entries,
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
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

function repairLane(input: {
  readonly lane: SdlcRepairFrontierLane;
  readonly requirementIds: readonly string[];
  readonly action: string;
}): SdlcRepairFrontierEntry {
  return Object.freeze({
    kind: "sdlc_repair_frontier_entry",
    lane: input.lane,
    requirementIds: Object.freeze([...input.requirementIds]),
    action: input.action
  });
}

export function projectSdlcRepairFrontier(input: {
  readonly closureRegister: SdlcRequirementClosureRegister;
}): SdlcRepairFrontier {
  const unmetRequirementIds = input.closureRegister.unresolvedRequirementIds;
  const preservationRequirementIds = input.closureRegister.fulfilledRequirementIds;
  return Object.freeze({
    kind: "sdlc_repair_frontier",
    unmetRequirementIds,
    preservationRequirementIds,
    lanes: Object.freeze([
      repairLane({
        lane: "requirements",
        requirementIds: unmetRequirementIds,
        action: "carry unresolved requirement truth forward without erasing authority"
      }),
      repairLane({
        lane: "design",
        requirementIds: unmetRequirementIds,
        action: "bind each unmet requirement to an explicit design/module carrier"
      }),
      repairLane({
        lane: "code",
        requirementIds: unmetRequirementIds,
        action: "realize generated or adopted assets under graph-function authority"
      }),
      repairLane({
        lane: "test",
        requirementIds: unmetRequirementIds,
        action: "add behavioral or runtime proof; trace tags alone are insufficient"
      })
    ]),
    lawfulEditFrontier: "edit only unmet requirement carriers, generated assets, or design links named by the frontier",
    lawfulProofFrontier: "prove fulfillment with behavioral_test or runtime_result evidence over a satisfied generated asset contract",
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}
