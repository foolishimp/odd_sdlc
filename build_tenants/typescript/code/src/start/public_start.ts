// Implements: REQ-F-ODDSDLC-003
// Implements: REQ-F-ODDSDLC-021
// Implements: REQ-F-ODDSDLC-029

import {
  admitExecutionBasis,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  admitStartIntent,
  deriveAdvancementTransition,
  type AdvancementTransition,
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
import type { SdlcQueryDomainProjection } from "../projection/index.js";
import { FG_CONFORM_PROJECT } from "../graph/index.js";
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

function resolveGraphFunctionTarget(input: {
  readonly request: SdlcPublicStartRequest;
  readonly queryDomain: SdlcQueryDomainProjection;
}): string | null {
  const targetPolicy = publicStartTargetPolicyFor(input.request.target.kind);
  if (targetPolicy.resolver === "first_start_target") {
    return input.queryDomain.startTargets[0]?.name ?? null;
  }
  if (targetPolicy.resolver === "named_graph_function") {
    const matched = input.queryDomain.graphFunctions.find(
      (graphFunction) => graphFunction.name === input.request.target.handle
    );
    return matched?.name ?? null;
  }
  const producer = input.queryDomain.assetOwnership.find(
    (entry) => entry.assetType === input.request.target.handle
  );
  const producerName = producer?.producerGraphFunctions[0] ?? null;
  if (producerName === null) {
    return null;
  }
  const executive = input.queryDomain.programs.find((program) =>
    program.steps.includes(producerName)
  );
  return executive?.backingGraphFunction ?? null;
}

function constructExecutionContract(input: {
  readonly request: SdlcPublicStartRequest;
  readonly module: Module;
  readonly targetGraphFunction: string;
  readonly conformedProject: SdlcConformProjectProfile;
  readonly workerAttachment: SdlcWorkerAttachment;
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
    workerAttachment: input.workerAttachment
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
  const targetGraphFunction = resolveGraphFunctionTarget({
    request: input.request,
    queryDomain: input.queryDomain
  });
  if (targetGraphFunction === null) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: "target_unavailable",
      stopPredicate: "gap_stop",
      executionContract: null,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  if (
    input.queryDomain.projectConformance?.status === "blocked" &&
    targetGraphFunction !== FG_CONFORM_PROJECT
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
  if (!moduleHasGraphFunction(input.module, targetGraphFunction)) {
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
    targetGraphFunction,
    conformedProject: input.conformedProject,
    workerAttachment: input.workerAttachment
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
