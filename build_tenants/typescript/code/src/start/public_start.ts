// Implements: REQ-F-ODDSDLC-003
// Implements: REQ-F-ODDSDLC-021
// Implements: REQ-F-ODDSDLC-029

import {
  admitExecutionBasis,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  admitStartIntent,
  constructConstructionPriorityRule,
  constructConstructionPriorityScheme,
  deriveAdvancementTransition,
  type AdvancementTransition,
  type GraphFunction,
  type ExecutionBasis,
  type Module,
  type RuntimeEvent,
  type RuntimeRegime
} from "@abiogenesis/typescript-tenant";
import {
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString
} from "../shared/validation.js";
import {
  deriveSdlcTargetObligationBinding,
  type SdlcQueryDomainProjection
} from "../projection/index.js";
import { FG_CONFORM_PROJECT } from "../graph/index.js";
import {
  deriveOddSdlcEvaluateNextReport,
  type OddSdlcEvaluateNextActionInput
} from "../runtime/index.js";
import {
  constructSdlcConstructionIntent,
  constructSdlcNextActionProjection,
  type SdlcConstructionIntent,
  type SdlcNextActionProjection
} from "../operator/traversal_consequence.js";
import type { SdlcConformProjectProfile } from "../workspace/index.js";
import { publicStartTargetPolicyFor } from "./policy.js";

export const SDLC_PUBLIC_START_TARGET_KIND_VALUES = Object.freeze([
  "next",
  "graph_function",
  "asset"
] as const);

export type SdlcPublicStartTargetKind =
  (typeof SDLC_PUBLIC_START_TARGET_KIND_VALUES)[number];

export const SDLC_PUBLIC_START_UNTIL_VALUES = Object.freeze([
  "first_traversal",
  "blocked",
  "converged"
] as const);

export type SdlcPublicStartUntil =
  (typeof SDLC_PUBLIC_START_UNTIL_VALUES)[number];

export interface SdlcPublicStartRequest {
  readonly kind: "sdlc_public_start_request";
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
  readonly target: {
    readonly kind: SdlcPublicStartTargetKind;
    readonly handle: string;
  };
  readonly until: SdlcPublicStartUntil;
  readonly defaultRegime: RuntimeRegime;
}

export interface SdlcWorkerAttachment {
  readonly kind: "sdlc_worker_attachment";
  readonly status: "attached" | "unattached";
  readonly transportContract: string | null;
  readonly blockingReason: "fp_worker_unattached" | null;
}

export interface SdlcExecutionContract {
  readonly kind: "sdlc_execution_contract";
  readonly targetGraphFunction: string;
  readonly requestedUntil: SdlcPublicStartUntil;
  readonly conformedProject: SdlcConformProjectProfile;
  readonly basis: ExecutionBasis;
  readonly workerAttachment: SdlcWorkerAttachment;
  readonly nextActionProjection: SdlcNextActionProjection;
  readonly constructionIntent: SdlcConstructionIntent;
}

export type SdlcPublicStartOutcome =
  | {
      readonly kind: "sdlc_public_start_blocked";
      readonly status: "blocked";
      readonly blockingReason:
        | "fp_worker_unattached"
        | "target_unavailable"
        | "stale_query_domain"
        | "project_conformance_blocked";
      readonly stopPredicate: "worker_attachment_required" | "gap_stop";
      readonly executionContract: SdlcExecutionContract | null;
      readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
    }
  | {
      readonly kind: "sdlc_public_start_projected";
      readonly status: "dispatch_required" | "advanced" | "converged";
      readonly executionContract: SdlcExecutionContract;
      readonly transition: AdvancementTransition;
      readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
    };

export function admitSdlcPublicStartRequest(
  input: unknown,
  label = "SdlcPublicStartRequest"
): SdlcPublicStartRequest {
  const record = parseClosedRecord(input, label, [
    "workspaceRoot",
    "outputWorkspaceRoot",
    "target",
    "until",
    "defaultRegime"
  ]);
  const target = parseClosedRecord(record["target"], `${label}.target`, [
    "kind",
    "handle"
  ]);
  return Object.freeze({
    kind: "sdlc_public_start_request",
    workspaceRoot: parseNonEmptyString(record["workspaceRoot"], `${label}.workspaceRoot`),
    outputWorkspaceRoot: record["outputWorkspaceRoot"] === undefined ||
      record["outputWorkspaceRoot"] === null
      ? null
      : parseNonEmptyString(
          record["outputWorkspaceRoot"],
          `${label}.outputWorkspaceRoot`
        ),
    target: Object.freeze({
      kind: parseEnumValue(
        target["kind"],
        `${label}.target.kind`,
        SDLC_PUBLIC_START_TARGET_KIND_VALUES
      ),
      handle: parseNonEmptyString(target["handle"], `${label}.target.handle`)
    }),
    until: parseEnumValue(record["until"], `${label}.until`, SDLC_PUBLIC_START_UNTIL_VALUES),
    defaultRegime: parseEnumValue(
      record["defaultRegime"],
      `${label}.defaultRegime`,
      ["F_D", "F_P", "F_H"]
    )
  });
}

export function projectSdlcWorkerAttachment(input: {
  readonly transportContract?: string | null;
}): SdlcWorkerAttachment {
  const rawTransportContract = input.transportContract ?? null;
  const transportContract =
    rawTransportContract === null
      ? null
      : parseNonEmptyString(
          rawTransportContract.trim(),
          "SdlcWorkerAttachment.transportContract"
        );
  return Object.freeze({
    kind: "sdlc_worker_attachment",
    status: transportContract === null ? "unattached" : "attached",
    transportContract,
    blockingReason: transportContract === null ? "fp_worker_unattached" : null
  });
}

interface PublicStartActionCandidate {
  readonly graphFunctionName: string;
  readonly graphFunctionId: string;
  readonly actionRef: string;
  readonly targetOutcomeRef: string;
}

interface PublicStartEvaluation {
  readonly targetGraphFunction: string | null;
  readonly blockingReason: "target_unavailable" | "stale_query_domain" | null;
  readonly nextActionProjection: SdlcNextActionProjection | null;
  readonly constructionIntent: SdlcConstructionIntent | null;
}

function graphFunctionByName(
  module: Module,
  graphFunctionName: string
): GraphFunction | null {
  return module.graphFunctions.find(
    (graphFunction) => graphFunction.name === graphFunctionName
  ) ?? null;
}

function candidateForGraphFunction(input: {
  readonly module: Module;
  readonly graphFunctionName: string;
  readonly sourceRef: string;
}): PublicStartActionCandidate | null {
  const graphFunction = graphFunctionByName(
    input.module,
    input.graphFunctionName
  );
  if (graphFunction === null) {
    return null;
  }
  const safeName = input.graphFunctionName.replaceAll("/", "_");
  return Object.freeze({
    graphFunctionName: input.graphFunctionName,
    graphFunctionId: graphFunction.id,
    actionRef:
      `construction-action://odd-sdlc/public-start/${safeName}`,
    targetOutcomeRef:
      `outcome://odd-sdlc/public-start/${input.sourceRef}/${safeName}`
  });
}

function publicStartIntentRef(request: SdlcPublicStartRequest): string {
  return [
    "event://odd-sdlc/public-start-intent",
    request.target.kind,
    request.target.handle
  ].join("/");
}

function publicStartProductModelRef(request: SdlcPublicStartRequest): string {
  return [
    "product-asset-model://odd-sdlc/public-start",
    request.target.kind,
    request.target.handle
  ].join("/");
}

function evaluateInitialPublicStartAction(input: {
  readonly request: SdlcPublicStartRequest;
  readonly module: Module;
  readonly queryDomain: SdlcQueryDomainProjection;
}): PublicStartEvaluation {
  const targetPolicy = publicStartTargetPolicyFor(input.request.target.kind);
  let candidates: readonly PublicStartActionCandidate[];
  let blockingReason: "target_unavailable" | "stale_query_domain" | null = null;
  let preferredTargetOutcomeRef: string | null = null;
  const sourceRef = `${input.request.target.kind}/${input.request.target.handle}`;
  if (targetPolicy.resolver === "published_start_targets") {
    candidates = Object.freeze(
      input.queryDomain.startTargets
        .map((target) =>
          candidateForGraphFunction({
            module: input.module,
            graphFunctionName: target.name,
            sourceRef
          })
        )
        .filter(
          (
            candidate
          ): candidate is PublicStartActionCandidate => candidate !== null
        )
    );
    blockingReason =
      input.queryDomain.startTargets.length === 0 ? "target_unavailable" : null;
    preferredTargetOutcomeRef = candidates[0]?.targetOutcomeRef ?? null;
  } else if (targetPolicy.resolver === "named_graph_function") {
    const published = input.queryDomain.graphFunctions.some(
      (graphFunction) => graphFunction.name === input.request.target.handle
    );
    const candidate = candidateForGraphFunction({
      module: input.module,
      graphFunctionName: input.request.target.handle,
      sourceRef
    });
    if (published && candidate === null) {
      return Object.freeze({
        targetGraphFunction: input.request.target.handle,
        blockingReason: "stale_query_domain",
        nextActionProjection: null,
        constructionIntent: null
      });
    }
    candidates = Object.freeze(candidate === null ? [] : [candidate]);
    blockingReason = candidate === null ? "target_unavailable" : null;
  } else {
    const binding = deriveSdlcTargetObligationBinding({
      queryDomain: input.queryDomain,
      targetAssetType: input.request.target.handle,
      evidenceRefs: ["public-start://odd-sdlc/target-request"]
    });
    candidates = Object.freeze(
      binding.admissibleGraphFunctionNames
        .map((name) =>
          candidateForGraphFunction({
            module: input.module,
            graphFunctionName: name,
            sourceRef
          })
        )
        .filter(
          (
            candidate
          ): candidate is PublicStartActionCandidate => candidate !== null
        )
    );
    blockingReason =
      binding.status === "stale_action_publication"
        ? "stale_query_domain"
        : binding.status === "no_published_action"
          ? "target_unavailable"
          : candidates.length === 0
            ? "stale_query_domain"
            : null;
  }
  if (candidates.length === 0) {
    return Object.freeze({
      targetGraphFunction: null,
      blockingReason: blockingReason ?? "target_unavailable",
      nextActionProjection: null,
      constructionIntent: null
    });
  }
  const targetOutcomeRefs = Object.freeze(
    candidates.map((candidate) => candidate.targetOutcomeRef)
  );
  const actions: readonly OddSdlcEvaluateNextActionInput[] = Object.freeze(
    candidates.map((candidate) =>
      Object.freeze({
        actionRef: candidate.actionRef,
        actionKind: "invoke_graph_function" as const,
        graphFunctionRef: candidate.graphFunctionId,
        graphVectorRef: null,
        publishedTraversalTargetRef:
          `published-action://odd-sdlc/graph-function/${candidate.graphFunctionName}`,
        targetOutcomeRef: candidate.targetOutcomeRef,
        inputAssetRefs: Object.freeze([]),
        expectedOutputAssetRefs: Object.freeze([candidate.targetOutcomeRef]),
        requiredAuthorityRefs: Object.freeze([
          `published-action://odd-sdlc/graph-function/${candidate.graphFunctionName}`
        ]),
        eligibleReasonRefs: Object.freeze([
          "public_start_evaluate_next_initial_selection"
        ])
      })
    )
  );
  const evaluator = deriveOddSdlcEvaluateNextReport({
    basis: admitExecutionBasis({
      startIntent: admitStartIntent({
        scope: {
          kind: "workspace",
          workspaceRoot: input.request.workspaceRoot,
          moduleName: input.module.name
        },
        target: {
          kind: "graph_function",
          handle: candidates[0]?.graphFunctionName ?? ""
        },
        until: input.request.until
      }),
      module: input.module,
      runtimeIdentity: admitResolvedRuntimeIdentity({
        workerId: "worker://odd-sdlc/typescript",
        backendId: "backend://node",
        buildId: "build://odd-sdlc/typescript",
        resolvedRuntimeRef: "runtime://abiogenesis/typescript"
      }),
      resolvedPolicy: admitResolvedPolicyIdentity({
        resolvedPolicyBundleRef: `policy://odd-sdlc/public-start/evaluate-next/${input.request.defaultRegime}`,
        defaultRegime: input.request.defaultRegime,
        dispatchRef:
          input.request.defaultRegime === "F_P"
            ? "dispatch://odd-sdlc/public-start/evaluate-next"
            : null,
        approvalSubjectRef:
          input.request.defaultRegime === "F_H"
            ? "approval://odd-sdlc/public-start/evaluate-next"
            : null
      }),
      runId: "run://odd-sdlc/public-start/evaluate-next",
      workKey: "wk://odd-sdlc/public-start/evaluate-next",
      frameId: null,
      frameLineageId: null
    }),
    events: Object.freeze([]),
    nextActionBasisKind: "initial_selection",
    intentEventRefs: Object.freeze([publicStartIntentRef(input.request)]),
    productAssetModelRef: publicStartProductModelRef(input.request),
    episodeId:
      `construction-episode://odd-sdlc/public-start/${sourceRef}`,
    observationId:
      `construction-observation://odd-sdlc/public-start/${sourceRef}`,
    pressures: Object.freeze([
      {
        pressureRef:
          `pressure://odd-sdlc/public-start/${sourceRef}`,
        pressureKind: "gap_row",
        sourceRef: publicStartIntentRef(input.request),
        affectedAssetRefs: targetOutcomeRefs,
        targetOutcomeRefs,
        evidenceRefs: Object.freeze(["public-start://odd-sdlc/target-request"]),
        severity: 1
      }
    ]),
    actions,
    ...(preferredTargetOutcomeRef === null
      ? {}
      : {
          priorityScheme: constructConstructionPriorityScheme({
            schemeRef:
              `priority-scheme://odd-sdlc/public-start/${sourceRef}`,
            sourcePolicyRef: "policy://odd-sdlc/public-start/published-order",
            rules: Object.freeze([
              constructConstructionPriorityRule({
                priorityRuleRef:
                  `priority-rule://odd-sdlc/public-start/${sourceRef}/preferred`,
                axis: "gap_repair",
                weight: 1000,
                appliesToActionKinds: Object.freeze(["invoke_graph_function"]),
                appliesToOutcomeRefs: Object.freeze([preferredTargetOutcomeRef]),
                sourcePolicyRef:
                  "policy://odd-sdlc/public-start/published-order",
                strategyLabel: "public_start_published_target_order"
              })
            ])
          })
        })
  });
  const selected = evaluator.selectedPriorityRow;
  const selectedCandidate =
    selected === null
      ? null
      : candidates.find((candidate) => candidate.actionRef === selected.actionRef) ??
        null;
  if (selected === null || selectedCandidate === null) {
    return Object.freeze({
      targetGraphFunction: null,
      blockingReason: blockingReason ?? "target_unavailable",
      nextActionProjection: null,
      constructionIntent: null
    });
  }
  const selectedActionRef = selected.actionRef;
  const nextActionProjection = constructSdlcNextActionProjection({
    nextActionProjectionRef: evaluator.priorityProjection.projectionRef,
    nextActionBasisKind: "initial_selection",
    intentEventRefs: evaluator.intentEventRefs,
    productAssetModelRef: evaluator.productAssetModelRef,
    gapPressureRefs: evaluator.gapPressureRefs,
    targetBindingRefs: evaluator.targetBindingRefs,
    observationRef: evaluator.observation.observationId,
    policyRefs: Object.freeze([
      evaluator.policyCarrierRef,
      evaluator.priorityProjection.prioritySchemeRef
    ]),
    actionCatalogRefs: evaluator.actionCatalogRefs,
    selectedActionRef,
    nextGraphFunctionRef: selectedCandidate.graphFunctionId,
    nextGraphVectorRef: null
  });
  const constructionIntent = constructSdlcConstructionIntent({
    intentRef:
      `construction-intent://odd-sdlc/public-start/${selectedCandidate.graphFunctionName}`,
    intentEventRefs: nextActionProjection.intentEventRefs,
    productAssetModelRef: nextActionProjection.productAssetModelRef,
    selectedPriorityRowRef: selected.rankInputRef,
    nextActionProjectionRef: nextActionProjection.nextActionProjectionRef,
    selectedActionRef,
    basisRefs: nextActionProjection.predecessorRefs,
    predecessorRefs: Object.freeze([nextActionProjection.nextActionProjectionRef])
  });
  return Object.freeze({
    targetGraphFunction: selectedCandidate.graphFunctionName,
    blockingReason,
    nextActionProjection,
    constructionIntent
  });
}

function constructExecutionContract(input: {
  readonly request: SdlcPublicStartRequest;
  readonly module: Module;
  readonly targetGraphFunction: string;
  readonly conformedProject: SdlcConformProjectProfile;
  readonly workerAttachment: SdlcWorkerAttachment;
  readonly nextActionProjection: SdlcNextActionProjection;
  readonly constructionIntent: SdlcConstructionIntent;
}): SdlcExecutionContract {
  const requestedOutputs =
    input.request.outputWorkspaceRoot === undefined ||
    input.request.outputWorkspaceRoot === null
      ? undefined
      : Object.freeze([
          Object.freeze({
            outputName: "conform_project",
            outputAssetType: "constitutional_bootstrap",
            relativePath: "conform_project_report.json",
            outputWorkspace: Object.freeze({
              workspaceRef: "workspace://odd-sdlc/output",
              workspaceRoot: input.request.outputWorkspaceRoot,
              authorityRef: "cli://odd-sdlc-ts/output-workspace"
            })
          })
        ]);
  const basis = admitExecutionBasis({
    startIntent: admitStartIntent({
      scope: {
        kind: "workspace",
        workspaceRoot: input.request.workspaceRoot,
        moduleName: input.module.name
      },
      target: {
        kind: "graph_function",
        handle: input.targetGraphFunction
      },
      until: input.request.until,
      ...(requestedOutputs === undefined ? {} : { requestedOutputs })
    }),
    module: input.module,
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: "worker://odd-sdlc/typescript",
      backendId: "backend://node",
      buildId: "build://odd-sdlc/typescript",
      resolvedRuntimeRef: "runtime://abiogenesis/typescript"
    }),
    resolvedPolicy: admitResolvedPolicyIdentity({
      resolvedPolicyBundleRef: `policy://odd-sdlc/start/${input.request.defaultRegime}`,
      defaultRegime: input.request.defaultRegime,
      dispatchRef:
        input.request.defaultRegime === "F_P"
          ? "dispatch://odd-sdlc/public-start"
          : null,
      approvalSubjectRef:
        input.request.defaultRegime === "F_H"
          ? "approval://odd-sdlc/public-start"
          : null
    }),
    runId: "run://odd-sdlc/public-start",
    workKey: "wk://odd-sdlc/public-start",
    frameId: null,
    frameLineageId: null
  });
  return Object.freeze({
    kind: "sdlc_execution_contract",
    targetGraphFunction: input.targetGraphFunction,
    requestedUntil: input.request.until,
    conformedProject: input.conformedProject,
    basis,
    workerAttachment: input.workerAttachment,
    nextActionProjection: input.nextActionProjection,
    constructionIntent: input.constructionIntent
  });
}

function moduleHasGraphFunction(module: Module, graphFunctionName: string): boolean {
  return module.graphFunctions.some(
    (graphFunction) => graphFunction.name === graphFunctionName
  );
}

function statusFromTransition(
  transition: AdvancementTransition
): "dispatch_required" | "advanced" | "converged" {
  if (transition.kind === "fp_dispatch" || transition.kind === "fh_escalation") {
    return "dispatch_required";
  }
  if (transition.kind === "terminal") {
    return "converged";
  }
  return "advanced";
}

export function publicStartOnce(input: {
  readonly request: SdlcPublicStartRequest;
  readonly module: Module;
  readonly queryDomain: SdlcQueryDomainProjection;
  readonly conformedProject: SdlcConformProjectProfile;
  readonly workerAttachment: SdlcWorkerAttachment;
}): SdlcPublicStartOutcome {
  const targetResolution = evaluateInitialPublicStartAction({
    request: input.request,
    module: input.module,
    queryDomain: input.queryDomain
  });
  if (
    targetResolution.targetGraphFunction === null ||
    targetResolution.nextActionProjection === null ||
    targetResolution.constructionIntent === null
  ) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: targetResolution.blockingReason ?? "target_unavailable",
      stopPredicate: "gap_stop",
      executionContract: null,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  if (
    input.queryDomain.projectConformance?.status === "blocked" &&
    targetResolution.targetGraphFunction !== FG_CONFORM_PROJECT
  ) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: "project_conformance_blocked",
      stopPredicate: "gap_stop",
      executionContract: null,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  if (!moduleHasGraphFunction(input.module, targetResolution.targetGraphFunction)) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: "stale_query_domain",
      stopPredicate: "gap_stop",
      executionContract: null,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  const executionContract = constructExecutionContract({
    request: input.request,
    module: input.module,
    targetGraphFunction: targetResolution.targetGraphFunction,
    conformedProject: input.conformedProject,
    workerAttachment: input.workerAttachment,
    nextActionProjection: targetResolution.nextActionProjection,
    constructionIntent: targetResolution.constructionIntent
  });
  if (
    input.request.defaultRegime === "F_P" &&
    input.workerAttachment.status === "unattached"
  ) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: "fp_worker_unattached",
      stopPredicate: "worker_attachment_required",
      executionContract,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  const transition = deriveAdvancementTransition(executionContract.basis);
  return Object.freeze({
    kind: "sdlc_public_start_projected",
    status: statusFromTransition(transition),
    executionContract,
    transition,
    emittedRuntimeEventKinds: Object.freeze([])
  });
}
