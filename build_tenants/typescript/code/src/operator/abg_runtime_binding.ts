// Implements: T-197

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type {
  ExecutionBasis,
  EngineRunnerPluginSet,
  RuntimeEvent,
  RuntimeRegime
} from "@abiogenesis/typescript-tenant";
import { admitResolvedPolicyIdentity } from "@abiogenesis/typescript-tenant";
import {
  constructSdlcGtlModule,
  FG_CONFORM_PROJECT
} from "../graph/index.js";
import { projectSdlcQueryDomain } from "../projection/index.js";
import {
  projectSdlcWorkerAttachment,
  publicStartOnce,
  type SdlcPublicStartUntil
} from "../start/index.js";
import {
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcConformProjectReportFromWorkspace,
  deriveSdlcProjectConstraintsFromWorkspace,
  collectSdlcWorkspaceSourceInputs,
  deriveSdlcWorkspaceIngressReport
} from "../workspace/index.js";
import { createSdlcInstalledOperatorAbgPluginSession } from "./installed_operator.js";

export interface OddSdlcAbgRuntimeBindingPluginFactoryInput {
  readonly workspaceRoot: string;
  readonly targetGraphFunction: string;
  readonly until?: SdlcPublicStartUntil | undefined;
  readonly replayEvents: readonly RuntimeEvent[];
  readonly eventSink: (event: RuntimeEvent) => void;
  readonly workerTransport?: string | null | undefined;
}

export interface OddSdlcAbgRuntimeBindingPolicyInput {
  readonly targetGraphFunction: string;
}

export function oddSdlcAbgRuntimeWorkerTransportFromEnv(
  env: Record<string, string | undefined> = process.env
): string | null {
  return (
    env["ODD_SDLC_TS_WORKER_TRANSPORT"] ??
    env["ODD_SDLC_TS_DATA_MAPPER_WORKER"] ??
    env["ODD_SDLC_WORKER_TRANSPORT"] ??
    null
  );
}

function defaultRegimeForGraphFunction(graphFunctionName: string): RuntimeRegime {
  return graphFunctionName === FG_CONFORM_PROJECT ? "F_D" : "F_P";
}

export function resolveOddSdlcAbgRuntimeBindingPolicy(
  input: OddSdlcAbgRuntimeBindingPolicyInput
): ExecutionBasis["resolvedPolicy"] {
  const defaultRegime = defaultRegimeForGraphFunction(input.targetGraphFunction);
  return admitResolvedPolicyIdentity({
    resolvedPolicyBundleRef: `policy://odd-sdlc/start/${defaultRegime}`,
    defaultRegime,
    dispatchRef:
      defaultRegime === "F_P" ? "dispatch://odd-sdlc/public-start" : null,
    approvalSubjectRef: null
  });
}

export function createOddSdlcAbgRuntimeBindingPlugins(
  input: OddSdlcAbgRuntimeBindingPluginFactoryInput
): EngineRunnerPluginSet {
  const workspaceRoot = resolve(input.workspaceRoot);
  const module = constructSdlcGtlModule();
  const conformedProject =
    deriveSdlcConformProjectProfileFromWorkspace(workspaceRoot);
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: pathToFileURL(workspaceRoot).href,
    projectConstraints: deriveSdlcProjectConstraintsFromWorkspace(workspaceRoot),
    sourceInputs: collectSdlcWorkspaceSourceInputs(workspaceRoot)
  });
  const queryDomain = projectSdlcQueryDomain({
    module,
    ingressReport,
    projectConformance: deriveSdlcConformProjectReportFromWorkspace(workspaceRoot)
  });
  const workerTransport = input.workerTransport ?? null;
  const start = publicStartOnce({
    request: {
      kind: "sdlc_public_start_request",
      workspaceRoot,
      target: {
        kind: "graph_function",
        handle: input.targetGraphFunction
      },
      until: input.until ?? "converged",
      defaultRegime: defaultRegimeForGraphFunction(input.targetGraphFunction)
    },
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({
      transportContract: workerTransport
    })
  });
  if (start.executionContract === null) {
    const blockingReason =
      "blockingReason" in start ? start.blockingReason : start.kind;
    throw new TypeError(
      `odd_sdlc ABG runtime binding could not construct an execution contract: ${blockingReason}`
    );
  }
  return createSdlcInstalledOperatorAbgPluginSession({
    workspaceRoot,
    start,
    workerTransport,
    replayEvents: input.replayEvents,
    effectiveReplayEvents: input.replayEvents,
    basis: start.executionContract.basis,
    eventSink: input.eventSink
  }).plugins;
}
