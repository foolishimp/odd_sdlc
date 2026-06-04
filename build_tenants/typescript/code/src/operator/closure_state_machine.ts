// Implements: REQ-F-ODDSDLC-086
// SDLC policy adapter over an ABG-shaped invariant: ABG owns generic runtime
// transition/replay law; this module owns SDLC's typed continuation mapping.

import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  deriveRuntimeContinuationTransitionProjection,
  type ExecutionBasis,
  type RuntimeAggregateProjection,
  type RuntimeContinuationTransitionProjection
} from "@abiogenesis/typescript-tenant";
import { uniqueSorted } from "../shared/collections.js";
import {
  makeSdlcBlockingReason,
  type SdlcBlockingReason,
  type SdlcBlockingReasonLawfulReentryPoint
} from "../shared/blocking_reason.js";
import {
  deriveSdlcPostflightGapActions,
  sdlcPostflightGapRetryEligible
} from "../postflight/gap_dossier_plan.js";
import type {
  SdlcPostflightGapDossier,
  SdlcPostflightGapReason,
  SdlcWorkerHandoffManifest
} from "./carriers.js";
import type {
  SdlcEdgeClosureDecision,
  SdlcEdgeClosureDisposition,
  SdlcEdgeClosurePolicy,
  SdlcYieldResumeBasis
} from "./traversal_consequence.js";

export type SdlcClosureStateTransitionExplanation =
  | "closed"
  | "yield_progress"
  | "typed_reprice"
  | "typed_repair"
  | "typed_reenter"
  | "typed_retry"
  | "typed_block_or_triage"
  | "residual_triage"
  | "residual_repair"
  | "edge_assurance_retry"
  | "abg_terminal_retry"
  | "edge_assurance_block"
  | "unsupported_state_block";

export type SdlcClosureStateMachineBucket =
  | "retry"
  | "repair"
  | "re-enter"
  | "reprice"
  | "block";

export interface SdlcClosureStateTransition {
  readonly kind: "sdlc_closure_state_transition";
  readonly abgRuntimeTransitionProjection: RuntimeContinuationTransitionProjection;
  readonly disposition: SdlcEdgeClosureDisposition;
  readonly closurePolicy: SdlcEdgeClosurePolicy;
  readonly retryReasonRefs: readonly string[];
  readonly repairReasonRefs: readonly string[];
  readonly reenterReasonRefs: readonly string[];
  readonly repriceReasonRefs: readonly string[];
  readonly blockReasonRefs: readonly string[];
  readonly yieldResumeBasis: Omit<SdlcYieldResumeBasis, "kind"> | null;
  readonly evidenceRefs: readonly string[];
  readonly explanationCode: SdlcClosureStateTransitionExplanation;
}

export interface SdlcClosureAbgRuntimeTransitionContext {
  readonly basis: ExecutionBasis;
  readonly runtimeProjection: RuntimeAggregateProjection;
  readonly vectorIndex: number;
}

export function sdlcClosureStateBucketForLawfulReentryPoint(
  reentryPoint: SdlcBlockingReasonLawfulReentryPoint
): SdlcClosureStateMachineBucket {
  switch (reentryPoint) {
    case "same_edge_retry":
      return "retry";
    case "repair_worker_output":
      return "repair";
    case "escalate_to_fp":
      return "re-enter";
    case "reprice_requirement_or_design":
      return "reprice";
    case "attach_worker":
    case "fix_target_or_run_gaps":
    case "inspect_worker_archive":
    case "operator_blocked":
    case "repair_install":
    case "repair_installed_topology":
    case "repair_project_conformance":
    case "reprice_runtime_policy":
    case "rerun_start":
    case "triage_gap":
      return "block";
  }
}

export function sdlcClosureBlockingReasonRefsForReentry(input: {
  readonly runRef: string;
  readonly scope: string;
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
  readonly reentryPoint: SdlcBlockingReasonLawfulReentryPoint;
}): readonly string[] {
  return uniqueSorted(
    input.blockingReasonCarriers.flatMap((reason, index) =>
      reason.lawfulReentryPoint === input.reentryPoint
        ? [
            blockingReasonRef({
              runRef: input.runRef,
              scope: input.scope,
              index,
              reason
            }),
            ...reason.evidenceRefs
          ]
        : []
    )
  );
}

function blockingReasonRef(input: {
  readonly runRef: string;
  readonly scope: string;
  readonly index: number;
  readonly reason: SdlcBlockingReason;
}): string {
  return `blocking-reason://odd-sdlc/${input.runRef}/${input.scope}/${String(input.index)}/${input.reason.code}`;
}

function blockingReasonRefMap(input: {
  readonly runRef: string;
  readonly scope: string;
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
}): ReadonlyMap<string, SdlcBlockingReason> {
  return new Map(
    input.blockingReasonCarriers.map((reason, index) => [
      blockingReasonRef({
        runRef: input.runRef,
        scope: input.scope,
        index,
        reason
      }),
      reason
    ])
  );
}

function refsForBucket(input: {
  readonly runRef: string;
  readonly scope: string;
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
  readonly bucket: SdlcClosureStateMachineBucket;
}): readonly string[] {
  return uniqueSorted(
    input.blockingReasonCarriers.flatMap((reason, index) =>
      sdlcClosureStateBucketForLawfulReentryPoint(reason.lawfulReentryPoint) ===
      input.bucket
        ? [
            blockingReasonRef({
              runRef: input.runRef,
              scope: input.scope,
              index,
              reason
            }),
            ...reason.evidenceRefs
          ]
        : []
    )
  );
}

function transitionPolicy(
  disposition: SdlcEdgeClosureDisposition
): SdlcEdgeClosurePolicy {
  return Object.freeze({
    kind: "sdlc_edge_closure_policy" as const,
    policyRef: `closure-policy://odd-sdlc/typed-state-machine/${disposition}`,
    dispositionPrecedence:
      disposition === "block"
        ? Object.freeze(["block"] as const)
        : Object.freeze([disposition, "block"] as const)
  });
}

function transition(input: {
  readonly abgRuntimeTransitionProjection: RuntimeContinuationTransitionProjection;
  readonly disposition: SdlcEdgeClosureDisposition;
  readonly explanationCode: SdlcClosureStateTransitionExplanation;
  readonly retryReasonRefs?: readonly string[];
  readonly repairReasonRefs?: readonly string[];
  readonly reenterReasonRefs?: readonly string[];
  readonly repriceReasonRefs?: readonly string[];
  readonly blockReasonRefs?: readonly string[];
  readonly yieldResumeBasis?: Omit<SdlcYieldResumeBasis, "kind"> | null;
}): SdlcClosureStateTransition {
  assertSdlcDispositionAllowedByAbg({
    disposition: input.disposition,
    projection: input.abgRuntimeTransitionProjection
  });
  const retryReasonRefs = uniqueSorted(input.retryReasonRefs ?? Object.freeze([]));
  const repairReasonRefs = uniqueSorted(input.repairReasonRefs ?? Object.freeze([]));
  const reenterReasonRefs = uniqueSorted(
    input.reenterReasonRefs ?? Object.freeze([])
  );
  const repriceReasonRefs = uniqueSorted(
    input.repriceReasonRefs ?? Object.freeze([])
  );
  const blockReasonRefs = uniqueSorted(input.blockReasonRefs ?? Object.freeze([]));
  const yieldResumeBasis = input.yieldResumeBasis ?? null;
  return Object.freeze({
    kind: "sdlc_closure_state_transition" as const,
    abgRuntimeTransitionProjection: input.abgRuntimeTransitionProjection,
    disposition: input.disposition,
    closurePolicy: transitionPolicy(input.disposition),
    retryReasonRefs,
    repairReasonRefs,
    reenterReasonRefs,
    repriceReasonRefs,
    blockReasonRefs,
    yieldResumeBasis,
    evidenceRefs: uniqueSorted([
      input.abgRuntimeTransitionProjection.projectionRef,
      ...retryReasonRefs,
      ...repairReasonRefs,
      ...reenterReasonRefs,
      ...repriceReasonRefs,
      ...blockReasonRefs,
      ...(yieldResumeBasis?.admittedProgressRefs ?? Object.freeze([]))
    ]),
    explanationCode: input.explanationCode
  });
}

function assertSdlcDispositionAllowedByAbg(input: {
  readonly disposition: SdlcEdgeClosureDisposition;
  readonly projection: RuntimeContinuationTransitionProjection;
}): void {
  const allowedByAbg = new Set<SdlcEdgeClosureDisposition>();
  switch (input.projection.disposition) {
    case "close":
      allowedByAbg.add("close");
      break;
    case "retry_same_edge":
      allowedByAbg.add("retry");
      allowedByAbg.add("block");
      break;
    case "yield_continuation":
      allowedByAbg.add("yield");
      allowedByAbg.add("block");
      break;
    case "reprice":
      allowedByAbg.add("reprice");
      allowedByAbg.add("block");
      break;
    case "inspect_runtime_archive":
    case "block":
      allowedByAbg.add("block");
      allowedByAbg.add("repair");
      allowedByAbg.add("re-enter");
      break;
  }
  if (!allowedByAbg.has(input.disposition)) {
    throw new TypeError(
      `SDLC closure transition ${input.disposition} contradicts ABG runtime continuation transition ${input.projection.disposition}:${input.projection.reason}`
    );
  }
}

function decodedRef(input: string): string {
  let decoded = input;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) {
        return decoded;
      }
      decoded = next;
    } catch {
      return decoded;
    }
  }
  return decoded;
}

function sdlcClosurePressureRefRequiresTriage(reasonRef: string): boolean {
  const decoded = decodedRef(reasonRef);
  return (
    decoded.includes("triage_gap") ||
    decoded.includes("review_grade_assessment_invalid") ||
    decoded.includes("review_grade_assessment_missing") ||
    decoded.includes("review_grade_evaluator_mutated_input") ||
    decoded.includes("review_grade_evaluator_process_failed") ||
    decoded.includes("review_grade_evaluator_process_timeout")
  );
}

function sdlcClosurePressureRefRequiresRepair(reasonRef: string): boolean {
  const decoded = decodedRef(reasonRef);
  return (
    decoded.includes("component_repair_schedule_repair_required") ||
    decoded.includes("component_repair_schedule_row:")
  );
}

function repairReasonFromClosurePressureRef(reasonRef: string): string {
  const decoded = decodedRef(reasonRef);
  const repairRowPrefix = "component_repair_schedule_row:";
  const repairRowIndex = decoded.lastIndexOf(repairRowPrefix);
  if (repairRowIndex >= 0) {
    return `component_repair_row_open:${decoded.slice(
      repairRowIndex + repairRowPrefix.length
    )}`;
  }
  if (decoded.includes("component_repair_schedule_repair_required")) {
    return "component_repair_schedule_repair_required";
  }
  if (decoded.includes("component_repair_schedule_triage_gap")) {
    return "component_repair_schedule_triage_gap";
  }
  const componentDepthIndex = decoded.indexOf("/component_depth_register_invalid:");
  if (componentDepthIndex >= 0) {
    return decoded.slice(componentDepthIndex + 1);
  }
  return `edge_closure_residual_pressure:${reasonRef}`;
}

function closurePressureRefLawfulReentryPoint(
  reasonRef: string
): SdlcBlockingReasonLawfulReentryPoint {
  if (sdlcClosurePressureRefRequiresTriage(reasonRef)) {
    return "triage_gap";
  }
  if (sdlcClosurePressureRefRequiresRepair(reasonRef)) {
    return "repair_worker_output";
  }
  return "same_edge_retry";
}

function closurePressureRefMessage(reasonRef: string): string {
  if (sdlcClosurePressureRefRequiresTriage(reasonRef)) {
    return "Edge closure residual pressure requires triage rather than same-edge retry.";
  }
  if (sdlcClosurePressureRefRequiresRepair(reasonRef)) {
    return "Component repair schedule residual pressure requires repair re-entry.";
  }
  return "Edge closure residual pressure requires same-edge repair.";
}

export function deriveSdlcClosureStateTransition(input: {
  readonly abgRuntimeTransitionContext: SdlcClosureAbgRuntimeTransitionContext;
  readonly runRef: string;
  readonly blockingReasonCarriers: readonly SdlcBlockingReason[];
  readonly residualPressureRefs: readonly string[];
  readonly abgTerminalRetryRefs: readonly string[];
  readonly structuralBlockReasonRefs: readonly string[];
  readonly postActionBlockReasonRefs: readonly string[];
  readonly yieldResumeBasis: Omit<SdlcYieldResumeBasis, "kind"> | null;
  readonly edgeCanClose: boolean;
  readonly edgeAssuranceDisposition: SdlcEdgeClosureDisposition | null;
}): SdlcClosureStateTransition {
  const typedBlockReasonRefs = uniqueSorted([
    ...refsForBucket({
      runRef: input.runRef,
      scope: "state",
      blockingReasonCarriers: input.blockingReasonCarriers,
      bucket: "block"
    }),
    ...input.structuralBlockReasonRefs,
    ...input.postActionBlockReasonRefs
  ]);
  const residualTriageReasonRefs = input.residualPressureRefs.filter(
    sdlcClosurePressureRefRequiresTriage
  );
  const blockReasonRefs = uniqueSorted([
    ...typedBlockReasonRefs,
    ...residualTriageReasonRefs
  ]);
  const repriceReasonRefs = refsForBucket({
    runRef: input.runRef,
    scope: "state",
    blockingReasonCarriers: input.blockingReasonCarriers,
    bucket: "reprice"
  });

  const typedRepairReasonRefs = refsForBucket({
    runRef: input.runRef,
    scope: "state",
    blockingReasonCarriers: input.blockingReasonCarriers,
    bucket: "repair"
  });
  const residualRepairReasonRefs = input.residualPressureRefs.filter(
    sdlcClosurePressureRefRequiresRepair
  );
  const repairReasonRefs = uniqueSorted([
    ...typedRepairReasonRefs,
    ...residualRepairReasonRefs
  ]);
  const reenterReasonRefs = refsForBucket({
    runRef: input.runRef,
    scope: "state",
    blockingReasonCarriers: input.blockingReasonCarriers,
    bucket: "re-enter"
  });
  const retryReasonRefs = refsForBucket({
    runRef: input.runRef,
    scope: "state",
    blockingReasonCarriers: input.blockingReasonCarriers,
    bucket: "retry"
  });
  const edgeAssuranceRef =
    input.edgeAssuranceDisposition === null
      ? []
      : [
          `edge-assurance-disposition://odd-sdlc/${input.runRef}/${input.edgeAssuranceDisposition}`
        ];
  const abgRuntimeTransitionProjection =
    deriveRuntimeContinuationTransitionProjection({
      basis: input.abgRuntimeTransitionContext.basis,
      runtimeProjection: input.abgRuntimeTransitionContext.runtimeProjection,
      vectorIndex: input.abgRuntimeTransitionContext.vectorIndex,
      typedBlockRefs: uniqueSorted([
        ...blockReasonRefs,
        ...repairReasonRefs,
        ...reenterReasonRefs,
        ...(input.edgeAssuranceDisposition === "block" ? edgeAssuranceRef : [])
      ]),
      typedRepriceRefs: uniqueSorted([
        ...repriceReasonRefs,
        ...(input.edgeAssuranceDisposition === "reprice" ? edgeAssuranceRef : [])
      ]),
      typedYieldRefs:
        input.yieldResumeBasis === null
          ? Object.freeze([])
          : uniqueSorted([
              input.yieldResumeBasis.resumeBasisRef,
              ...input.yieldResumeBasis.admittedProgressRefs
            ]),
      typedRetryRefs: uniqueSorted([
        ...retryReasonRefs,
        ...(input.edgeAssuranceDisposition === "retry" ? edgeAssuranceRef : [])
      ]),
      terminalRetryRefs: input.abgTerminalRetryRefs,
      edgeCanClose: input.edgeCanClose
    });

  if (blockReasonRefs.length > 0) {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "block",
      explanationCode:
        typedBlockReasonRefs.length > 0
          ? "typed_block_or_triage"
          : "residual_triage",
      retryReasonRefs,
      repairReasonRefs,
      reenterReasonRefs,
      repriceReasonRefs,
      blockReasonRefs
    });
  }

  if (repairReasonRefs.length > 0) {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "repair",
      explanationCode:
        typedRepairReasonRefs.length > 0 ? "typed_repair" : "residual_repair",
      retryReasonRefs,
      repairReasonRefs,
      reenterReasonRefs,
      repriceReasonRefs
    });
  }

  if (reenterReasonRefs.length > 0) {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "re-enter",
      explanationCode: "typed_reenter",
      retryReasonRefs,
      reenterReasonRefs,
      repriceReasonRefs
    });
  }

  if (repriceReasonRefs.length > 0) {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "reprice",
      explanationCode: "typed_reprice",
      retryReasonRefs,
      repriceReasonRefs
    });
  }

  if (input.yieldResumeBasis !== null) {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "yield",
      explanationCode: "yield_progress",
      retryReasonRefs,
      yieldResumeBasis: input.yieldResumeBasis
    });
  }

  if (retryReasonRefs.length > 0) {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "retry",
      explanationCode: "typed_retry",
      retryReasonRefs
    });
  }

  if (input.edgeAssuranceDisposition === "retry") {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "retry",
      explanationCode: "edge_assurance_retry"
    });
  }

  if (input.abgTerminalRetryRefs.length > 0) {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "retry",
      explanationCode: "abg_terminal_retry",
      retryReasonRefs: input.abgTerminalRetryRefs
    });
  }

  if (input.edgeCanClose) {
    return transition({
      abgRuntimeTransitionProjection,
      disposition: "close",
      explanationCode: "closed"
    });
  }

  return transition({
    abgRuntimeTransitionProjection,
    disposition: "block",
    explanationCode:
      input.edgeAssuranceDisposition === "block"
        ? "edge_assurance_block"
        : "unsupported_state_block",
    blockReasonRefs: uniqueSorted(input.residualPressureRefs)
  });
}

export function syntheticGapDossierFromClosureRefs(input: {
  readonly manifest: Pick<
    SdlcWorkerHandoffManifest,
    "archiveRoot" | "edgeName" | "graphFunctionName" | "targetAssetType" | "vectorIndex"
  >;
  readonly decisionRef: string;
  readonly reasonRefs: readonly string[];
  readonly sourceProjectionRef: string;
  readonly blockingReasonCarriers?: readonly SdlcBlockingReason[];
  readonly runRef?: string;
  readonly scope?: string;
}): SdlcPostflightGapDossier | null {
  if (input.reasonRefs.length === 0) {
    return null;
  }
  if (
    input.manifest.archiveRoot.length === 0 ||
    input.manifest.edgeName.length === 0 ||
    input.manifest.graphFunctionName.length === 0 ||
    input.manifest.targetAssetType.length === 0
  ) {
    return null;
  }
  const currentGapDossierRef = `closure-gap-dossier://odd-sdlc/${encodeURIComponent(
    input.decisionRef
  )}`;
  const carrierRefMap =
    input.blockingReasonCarriers !== undefined &&
    input.runRef !== undefined &&
    input.scope !== undefined
      ? blockingReasonRefMap({
          runRef: input.runRef,
          scope: input.scope,
          blockingReasonCarriers: input.blockingReasonCarriers
        })
      : new Map<string, SdlcBlockingReason>();
  const carrierReasons = input.reasonRefs.flatMap((reasonRef) => {
    const carrier = carrierRefMap.get(reasonRef);
    if (carrier === undefined) {
      return [];
    }
    return [
      Object.freeze({
        kind: "sdlc_postflight_gap_reason" as const,
        reason: carrier.detail ?? carrier.code,
        reasonClass: carrier.reasonClass,
        blockingReason: carrier
      })
    ];
  });
  const fallbackReasonRefs =
    carrierRefMap.size === 0
      ? input.reasonRefs
      : input.reasonRefs.filter(
          (reasonRef) =>
            !carrierRefMap.has(reasonRef) &&
            (sdlcClosurePressureRefRequiresTriage(reasonRef) ||
              sdlcClosurePressureRefRequiresRepair(reasonRef))
        );
  const fallbackReasons = fallbackReasonRefs.map(
    (reasonRef): SdlcPostflightGapReason => {
      const lawfulReentryPoint = closurePressureRefLawfulReentryPoint(reasonRef);
      return Object.freeze({
        kind: "sdlc_postflight_gap_reason" as const,
        reason: repairReasonFromClosurePressureRef(reasonRef),
        reasonClass: "assurance" as const,
        blockingReason: makeSdlcBlockingReason({
          code: "edge_closure_residual_pressure",
          reasonClass: "assurance",
          lawfulReentryPoint,
          message: closurePressureRefMessage(reasonRef),
          detail: reasonRef,
          evidenceRefs: [input.decisionRef, input.sourceProjectionRef, reasonRef]
        })
      });
    }
  );
  const reasons = Object.freeze([...carrierReasons, ...fallbackReasons]);
  const blockingReasons = reasons.map((reason) => reason.blockingReason);
  const retryEligible = sdlcPostflightGapRetryEligible(blockingReasons);
  return Object.freeze({
    kind: "sdlc_postflight_gap_dossier" as const,
    status: "open" as const,
    graphFunctionName: input.manifest.graphFunctionName,
    edgeName: input.manifest.edgeName,
    vectorIndex: input.manifest.vectorIndex,
    targetAssetType: input.manifest.targetAssetType,
    reasons: Object.freeze(reasons),
    evidenceRefs: uniqueSorted([
      input.decisionRef,
      input.sourceProjectionRef,
      ...input.reasonRefs
    ]),
    priorManifestId: pathToFileURL(
      join(input.manifest.archiveRoot, "handoff_manifest.json")
    ).href,
    currentGapDossierRef,
    retryEligible,
    nextLawfulActions: deriveSdlcPostflightGapActions(blockingReasons)
  });
}

export function syntheticGapDossiersFromClosureDecision(input: {
  readonly manifest: SdlcWorkerHandoffManifest | null;
  readonly edgeClosureDecision: SdlcEdgeClosureDecision | null;
  readonly sourceProjectionRef: string;
}): readonly SdlcPostflightGapDossier[] {
  if (
    input.manifest === null ||
    input.edgeClosureDecision === null ||
    input.edgeClosureDecision.disposition === "close"
  ) {
    return Object.freeze([]);
  }
  const dossier = syntheticGapDossierFromClosureRefs({
    manifest: input.manifest,
    decisionRef: input.edgeClosureDecision.decisionRef,
    reasonRefs: input.edgeClosureDecision.reasonRefs,
    sourceProjectionRef: input.sourceProjectionRef
  });
  return dossier === null ? Object.freeze([]) : Object.freeze([dossier]);
}
