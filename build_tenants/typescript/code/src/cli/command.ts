// Implements: REQ-F-ODDSDLC-040
// Implements: REQ-F-ODDSDLC-043

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync
} from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { ExecutionBasis, RuntimeEvent } from "@abiogenesis/typescript-tenant";
import {
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule,
  FG_CONFORM_PROJECT
} from "../graph/index.js";
import { installOddSdlcTypescript } from "../install/index.js";
import {
  deriveSdlcGapDossier,
  projectSdlcGapsFromReplay,
  projectSdlcQueryDomain
} from "../projection/index.js";
import { describeOddSdlcTypescriptRcQualification } from "../qualification/index.js";
import { deriveOddSdlcTypescriptReleaseCut } from "../release/index.js";
import {
  executeInstalledOperatorStart,
  readOddSdlcRuntimeEvents,
  readOddSdlcRuntimeEventsSync,
  type SdlcInstalledOperatorStartOutcome
} from "../operator/index.js";
import {
  projectSdlcWorkerAttachment,
  publicStartOnce,
  type SdlcPublicStartTargetKind,
  type SdlcPublicStartUntil
} from "../start/index.js";
import {
  deriveSdlcProjectConstraintsFromWorkspace,
  deriveSdlcConformProjectReportFromWorkspace,
  deriveSdlcSourceInput,
  deriveSdlcWorkspaceIngressReport,
  type SdlcConformProjectReport,
  type SdlcProjectConstraints,
  type SdlcSourceInput,
  type SdlcWorkspaceIngressReport
} from "../workspace/index.js";

export const ODD_SDLC_CLI_COMMAND_VALUES = Object.freeze([
  "catalog",
  "query-domain",
  "gaps",
  "start",
  "install",
  "release-cut",
  "rc-report"
] as const);

export type OddSdlcCliCommand = (typeof ODD_SDLC_CLI_COMMAND_VALUES)[number];

const ODD_SDLC_CLI_COMMAND_SET: ReadonlySet<string> = new Set(
  ODD_SDLC_CLI_COMMAND_VALUES
);

export interface OddSdlcCliTraversalRequest {
  readonly kind: "odd_sdlc_cli_request";
  readonly command: Exclude<OddSdlcCliCommand, "install" | "release-cut">;
  readonly workspaceRoot: string;
  readonly target: {
    readonly kind: SdlcPublicStartTargetKind;
    readonly handle: string;
  };
  readonly until: SdlcPublicStartUntil;
  readonly workerTransport: string | null;
}

export interface OddSdlcCliInstallRequest {
  readonly kind: "odd_sdlc_cli_install_request";
  readonly command: "install";
  readonly targetRoot: string;
  readonly packageSourceRoot: string;
  readonly abgPackageSourceRoot: string;
  readonly installedPackageName: string;
}

export interface OddSdlcCliReleaseCutRequest {
  readonly kind: "odd_sdlc_cli_release_cut_request";
  readonly command: "release-cut";
  readonly archiveRoot: string;
  readonly packageSourceRoot: string;
}

export type OddSdlcCliRequest =
  | OddSdlcCliTraversalRequest
  | OddSdlcCliInstallRequest
  | OddSdlcCliReleaseCutRequest;

const AUTONOMOUS_START_STEP_GUARD = 64;

type SdlcAutonomousStartStopReason =
  | "first_traversal"
  | "blocked"
  | "converged"
  | "worker_required"
  | "worker_failed"
  | "worker_report_rejected"
  | "iteration_guard";

interface SdlcAutonomousStartLoopStep {
  readonly kind: "sdlc_autonomous_start_loop_step";
  readonly index: number;
  readonly status: string;
  readonly currentEdge: string | null;
  readonly nextLawfulAction: string;
  readonly archiveRoot: string | null;
  readonly emittedRuntimeEventKinds: readonly string[];
}

interface SdlcAutonomousStartLoopTrace {
  readonly kind: "sdlc_autonomous_start_loop_trace";
  readonly requestedUntil: SdlcPublicStartUntil;
  readonly stepGuard: number;
  readonly stepCount: number;
  readonly stoppedBy: SdlcAutonomousStartStopReason;
  readonly steps: readonly SdlcAutonomousStartLoopStep[];
}

type SdlcAutonomousStartOutcome = SdlcInstalledOperatorStartOutcome & {
  readonly loop: SdlcAutonomousStartLoopTrace;
};

export interface OddSdlcCliResult {
  readonly kind: "odd_sdlc_cli_result";
  readonly command: OddSdlcCliCommand | "unknown";
  readonly status: "ok" | "error";
  readonly exitCode: 0 | 2;
  readonly payload: unknown;
}

interface CliOptionReadModel {
  readonly workspaceRoot: string;
  readonly target: string;
  readonly until: SdlcPublicStartUntil;
  readonly workerTransport: string | null;
}

interface CliInstallOptionReadModel {
  readonly targetRoot: string;
  readonly packageSourceRoot: string;
  readonly abgPackageSourceRoot: string;
  readonly installedPackageName: string;
}

interface CliReleaseCutOptionReadModel {
  readonly archiveRoot: string;
  readonly packageSourceRoot: string;
}

interface CliWorkspaceContext {
  readonly workspaceRoot: string;
  readonly ingressReport: SdlcWorkspaceIngressReport;
  readonly conformanceReport: SdlcConformProjectReport;
}

const DEFAULT_SOURCE_PATHS = Object.freeze([
  "README.md",
  "specification/GOALS.md",
  "specification/INTENT.md",
  "specification/PRODUCT.md",
  "specification/REQUIREMENTS.md",
  "specification/mapper_requirements.md",
  ".ai-workspace/context/project_constraints.yml"
] as const);
const SOURCE_DISCOVERY_EXTENSIONS = Object.freeze([
  ".md",
  ".markdown",
  ".txt",
  ".yml",
  ".yaml"
] as const);
const SOURCE_DISCOVERY_EXTENSION_SET: ReadonlySet<string> = new Set(
  SOURCE_DISCOVERY_EXTENSIONS
);
const SOURCE_DISCOVERY_IGNORED_DIRS = Object.freeze([
  ".abiogenesis",
  ".genesis",
  ".git",
  "node_modules",
  "build_tenants"
] as const);

const CLI_MODULE_ROOT = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PACKAGE_SOURCE_ROOT = resolve(CLI_MODULE_ROOT, "../../../../..");

function defaultAbgPackageSourceRoot(): string {
  const packageLocalDependency = resolve(
    DEFAULT_PACKAGE_SOURCE_ROOT,
    "node_modules/@abiogenesis/typescript-tenant"
  );
  if (existsSync(packageLocalDependency)) {
    return packageLocalDependency;
  }
  return resolve(
    DEFAULT_PACKAGE_SOURCE_ROOT,
    "../..",
    "@abiogenesis/typescript-tenant"
  );
}

const DEFAULT_ABG_PACKAGE_SOURCE_ROOT = defaultAbgPackageSourceRoot();

function isCommand(value: string): value is OddSdlcCliCommand {
  return ODD_SDLC_CLI_COMMAND_SET.has(value);
}

function fail(command: OddSdlcCliCommand | "unknown", message: string): OddSdlcCliResult {
  return Object.freeze({
    kind: "odd_sdlc_cli_result",
    command,
    status: "error",
    exitCode: 2,
    payload: Object.freeze({
      error: message
    })
  });
}

function ok(command: OddSdlcCliCommand, payload: unknown): OddSdlcCliResult {
  return Object.freeze({
    kind: "odd_sdlc_cli_result",
    command,
    status: "ok",
    exitCode: 0,
    payload
  });
}

function requireOptionValue(argv: readonly string[], index: number, option: string): string {
  const value = argv[index + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new TypeError(`${option} requires a value`);
  }
  return value;
}

function parseUntil(value: string): SdlcPublicStartUntil {
  if (value === "first_traversal" || value === "blocked" || value === "converged") {
    return value;
  }
  throw new TypeError(`--until expected first_traversal, blocked, or converged`);
}

function parseOptions(argv: readonly string[]): CliOptionReadModel {
  let workspaceRoot = ".";
  let target = "next";
  let until: SdlcPublicStartUntil = "blocked";
  let workerTransport: string | null = null;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--workspace") {
      workspaceRoot = requireOptionValue(argv, index, "--workspace");
      index += 1;
    } else if (token === "--target") {
      target = requireOptionValue(argv, index, "--target");
      index += 1;
    } else if (token === "--until") {
      until = parseUntil(requireOptionValue(argv, index, "--until"));
      index += 1;
    } else if (token === "--worker") {
      workerTransport = requireOptionValue(argv, index, "--worker");
      index += 1;
    } else {
      throw new TypeError(`unknown option: ${token ?? ""}`);
    }
  }
  return Object.freeze({
    workspaceRoot,
    target,
    until,
    workerTransport
  });
}

function parseInstallOptions(argv: readonly string[]): CliInstallOptionReadModel {
  let targetRoot: string | null = null;
  let packageSourceRoot = DEFAULT_PACKAGE_SOURCE_ROOT;
  let abgPackageSourceRoot = DEFAULT_ABG_PACKAGE_SOURCE_ROOT;
  let installedPackageName = "odd-sdlc-typescript";
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--target") {
      targetRoot = requireOptionValue(argv, index, "--target");
      index += 1;
    } else if (token === "--package-source") {
      packageSourceRoot = requireOptionValue(argv, index, "--package-source");
      index += 1;
    } else if (token === "--abg-package-source") {
      abgPackageSourceRoot = requireOptionValue(argv, index, "--abg-package-source");
      index += 1;
    } else if (token === "--installed-package-name") {
      installedPackageName = requireOptionValue(argv, index, "--installed-package-name");
      index += 1;
    } else {
      throw new TypeError(`unknown install option: ${token ?? ""}`);
    }
  }
  if (targetRoot === null) {
    throw new TypeError("install requires --target <workspace>");
  }
  return Object.freeze({
    targetRoot,
    packageSourceRoot,
    abgPackageSourceRoot,
    installedPackageName
  });
}

function parseReleaseCutOptions(argv: readonly string[]): CliReleaseCutOptionReadModel {
  let archiveRoot: string | null = null;
  let packageSourceRoot = DEFAULT_PACKAGE_SOURCE_ROOT;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--archive-root") {
      archiveRoot = requireOptionValue(argv, index, "--archive-root");
      index += 1;
    } else if (token === "--package-source") {
      packageSourceRoot = requireOptionValue(argv, index, "--package-source");
      index += 1;
    } else {
      throw new TypeError(`unknown release-cut option: ${token ?? ""}`);
    }
  }
  if (archiveRoot === null) {
    throw new TypeError("release-cut requires --archive-root <directory>");
  }
  return Object.freeze({
    archiveRoot,
    packageSourceRoot
  });
}

function parseTarget(rawTarget: string): OddSdlcCliTraversalRequest["target"] {
  if (rawTarget === "next") {
    return Object.freeze({ kind: "next", handle: "next" });
  }
  if (rawTarget.startsWith("graph_function:")) {
    return Object.freeze({
      kind: "graph_function",
      handle: rawTarget.slice("graph_function:".length)
    });
  }
  if (rawTarget.startsWith("asset:")) {
    return Object.freeze({
      kind: "asset",
      handle: rawTarget.slice("asset:".length)
    });
  }
  throw new TypeError("--target expected next, graph_function:<handle>, or asset:<handle>");
}

export function admitOddSdlcCliRequest(argv: readonly string[]): OddSdlcCliRequest {
  const command = argv[0];
  if (command === undefined || !isCommand(command)) {
    throw new TypeError(
      `command expected one of ${ODD_SDLC_CLI_COMMAND_VALUES.join(", ")}`
    );
  }
  if (command === "install") {
    const options = parseInstallOptions(argv.slice(1));
    return Object.freeze({
      kind: "odd_sdlc_cli_install_request",
      command,
      targetRoot: resolve(options.targetRoot),
      packageSourceRoot: resolve(options.packageSourceRoot),
      abgPackageSourceRoot: resolve(options.abgPackageSourceRoot),
      installedPackageName: options.installedPackageName
    });
  }
  if (command === "release-cut") {
    const options = parseReleaseCutOptions(argv.slice(1));
    return Object.freeze({
      kind: "odd_sdlc_cli_release_cut_request",
      command,
      archiveRoot: resolve(options.archiveRoot),
      packageSourceRoot: resolve(options.packageSourceRoot)
    });
  }
  const options = parseOptions(argv.slice(1));
  return Object.freeze({
    kind: "odd_sdlc_cli_request",
    command,
    workspaceRoot: resolve(options.workspaceRoot),
    target: parseTarget(options.target),
    until: options.until,
    workerTransport: options.workerTransport
  });
}

function sourceFilePaths(workspaceRoot: string): readonly string[] {
  const paths = new Set<string>();
  for (const relativePath of DEFAULT_SOURCE_PATHS) {
    if (existsSync(path.join(workspaceRoot, relativePath))) {
      paths.add(relativePath);
    }
  }
  const requirementsRoot = path.join(workspaceRoot, "specification/requirements");
  if (existsSync(requirementsRoot)) {
    for (const fileName of readdirSync(requirementsRoot)) {
      const relativePath = `specification/requirements/${fileName}`;
      const absolutePath = path.join(workspaceRoot, relativePath);
      if (statSync(absolutePath).isFile() && fileName.endsWith(".md")) {
        paths.add(relativePath);
      }
    }
  }
  const ignored = new Set<string>(SOURCE_DISCOVERY_IGNORED_DIRS);
  const visit = (absoluteDir: string, relativeDir: string): void => {
    for (const entry of readdirSync(absoluteDir, { withFileTypes: true })) {
      const relativePath =
        relativeDir.length === 0 ? entry.name : `${relativeDir}/${entry.name}`;
      const absolutePath = path.join(absoluteDir, entry.name);
      if (entry.isDirectory()) {
        if (
          !ignored.has(entry.name) &&
          !relativePath.startsWith(".ai-workspace/runtime") &&
          !relativePath.startsWith(".ai-workspace/events")
        ) {
          visit(absolutePath, relativePath);
        }
      } else if (
        entry.isFile() &&
        SOURCE_DISCOVERY_EXTENSION_SET.has(path.extname(entry.name).toLowerCase())
      ) {
        paths.add(relativePath);
      }
    }
  };
  visit(workspaceRoot, "");
  return Object.freeze([...paths].sort());
}

function readSourceInputs(workspaceRoot: string): readonly SdlcSourceInput[] {
  return Object.freeze(
    sourceFilePaths(workspaceRoot).map((relativePath) => {
      const absolutePath = path.join(workspaceRoot, relativePath);
      return deriveSdlcSourceInput({
        uri: `${pathToFileURL(workspaceRoot).href}/${relativePath}`,
        relativePath,
        content: readFileSync(absolutePath, "utf8")
      });
    })
  );
}

function projectConstraints(workspaceRoot: string): SdlcProjectConstraints {
  return deriveSdlcProjectConstraintsFromWorkspace(workspaceRoot);
}

function workspaceContext(workspaceRoot: string): CliWorkspaceContext {
  const root = resolve(workspaceRoot);
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: pathToFileURL(root).href,
    projectConstraints: projectConstraints(root),
    sourceInputs: readSourceInputs(root)
  });
  return Object.freeze({
    workspaceRoot: root,
    ingressReport,
    conformanceReport: deriveSdlcConformProjectReportFromWorkspace(root)
  });
}

function queryDomainFor(context: CliWorkspaceContext): ReturnType<typeof projectSdlcQueryDomain> {
  return projectSdlcQueryDomain({
    module: constructSdlcGtlModule(),
    ingressReport: context.ingressReport,
    projectConformance: context.conformanceReport
  });
}

function defaultRegimeFor(input: {
  readonly request: OddSdlcCliTraversalRequest;
  readonly queryDomain: ReturnType<typeof projectSdlcQueryDomain>;
}): "F_D" | "F_P" {
  const firstTarget = input.queryDomain.startTargets[0]?.name ?? null;
  if (
    firstTarget === FG_CONFORM_PROJECT &&
    (input.request.target.kind === "next" ||
      (input.request.target.kind === "graph_function" &&
        input.request.target.handle === FG_CONFORM_PROJECT))
  ) {
    return "F_D";
  }
  return "F_P";
}

function startOutcomeFor(request: OddSdlcCliTraversalRequest): ReturnType<typeof publicStartOnce> {
  const context = workspaceContext(request.workspaceRoot);
  const queryDomain = queryDomainFor(context);
  return publicStartOnce({
    request: {
      kind: "sdlc_public_start_request",
      workspaceRoot: context.workspaceRoot,
      target: request.target,
      until: request.until,
      defaultRegime: defaultRegimeFor({ request, queryDomain })
    },
    module: constructSdlcGtlModule(),
    queryDomain,
    workerAttachment: projectSdlcWorkerAttachment({
      transportContract: request.workerTransport
    })
  });
}

function replayEventsForBasis(
  basis: ExecutionBasis,
  events: readonly RuntimeEvent[]
): readonly RuntimeEvent[] {
  return Object.freeze(
    events.filter((event) => {
      if ("basisId" in event) {
        return event.basisId === basis.id;
      }
      if ("runId" in event || "workKey" in event) {
        return event.runId === basis.runId && event.workKey === basis.workKey;
      }
      return false;
    })
  );
}

function loopStepForOutcome(input: {
  readonly index: number;
  readonly outcome: SdlcInstalledOperatorStartOutcome;
}): SdlcAutonomousStartLoopStep {
  return Object.freeze({
    kind: "sdlc_autonomous_start_loop_step",
    index: input.index,
    status: input.outcome.status,
    currentEdge: input.outcome.summary.currentEdge,
    nextLawfulAction: input.outcome.summary.nextLawfulAction,
    archiveRoot: input.outcome.summary.archiveRoot,
    emittedRuntimeEventKinds: input.outcome.emittedRuntimeEventKinds
  });
}

function stopReasonForOutcome(input: {
  readonly request: OddSdlcCliTraversalRequest;
  readonly outcome: SdlcInstalledOperatorStartOutcome;
}): SdlcAutonomousStartStopReason | null {
  if (input.request.until === "first_traversal") {
    return "first_traversal";
  }
  if (
    input.outcome.status === "converged" &&
    input.outcome.summary.nextLawfulAction !== "rerun_start_for_downstream_graph"
  ) {
    return "converged";
  }
  if (input.outcome.status === "worker_invoked") {
    return input.outcome.summary.currentEdge === null ? "converged" : null;
  }
  if (
    input.outcome.status === "postflight_failed" &&
    input.outcome.summary.nextLawfulAction === "retry_same_edge_with_gap_dossier"
  ) {
    return null;
  }
  if (
    input.outcome.status === "worker_report_rejected" &&
    input.outcome.summary.nextLawfulAction === "retry_same_edge_with_gap_dossier"
  ) {
    return null;
  }
  if (input.outcome.status === "blocked") {
    return "blocked";
  }
  if (input.outcome.status === "worker_failed") {
    return "worker_failed";
  }
  if (input.outcome.status === "worker_report_rejected") {
    return "worker_report_rejected";
  }
  if (input.outcome.status === "converged") {
    return null;
  }
  return "blocked";
}

function withAutonomousLoopTrace(input: {
  readonly outcome: SdlcInstalledOperatorStartOutcome;
  readonly request: OddSdlcCliTraversalRequest;
  readonly steps: readonly SdlcAutonomousStartLoopStep[];
  readonly stoppedBy: SdlcAutonomousStartStopReason;
}): SdlcAutonomousStartOutcome {
  return Object.freeze({
    ...input.outcome,
    loop: Object.freeze({
      kind: "sdlc_autonomous_start_loop_trace",
      requestedUntil: input.request.until,
      stepGuard: AUTONOMOUS_START_STEP_GUARD,
      stepCount: input.steps.length,
      stoppedBy: input.stoppedBy,
      steps: Object.freeze([...input.steps])
    })
  });
}

async function installedStartPayloadFor(
  request: OddSdlcCliTraversalRequest
): Promise<unknown> {
  const steps: SdlcAutonomousStartLoopStep[] = [];
  let lastOutcome: SdlcInstalledOperatorStartOutcome | null = null;
  for (let index = 0; index < AUTONOMOUS_START_STEP_GUARD; index += 1) {
    const start = startOutcomeFor(request);
    const deterministicTransition =
      start.kind === "sdlc_public_start_projected" &&
      start.transition.kind === "fd_advance";
    if (request.workerTransport === null && !deterministicTransition) {
      if (lastOutcome === null) {
        return start;
      }
      return withAutonomousLoopTrace({
        outcome: lastOutcome,
        request,
        steps,
        stoppedBy: "worker_required"
      });
    }
    const outcome = await executeInstalledOperatorStart({
      workspaceRoot: request.workspaceRoot,
      start,
      workerTransport: request.workerTransport,
      replayEvents:
        start.executionContract === null
          ? Object.freeze([])
          : replayEventsForBasis(
              start.executionContract.basis,
              await readOddSdlcRuntimeEvents(request.workspaceRoot)
            ),
      requireInstalledTopology: true
    });
    lastOutcome = outcome;
    steps.push(loopStepForOutcome({ index, outcome }));
    const stopReason = stopReasonForOutcome({ request, outcome });
    if (stopReason !== null) {
      return withAutonomousLoopTrace({
        outcome,
        request,
        steps,
        stoppedBy: stopReason
      });
    }
  }
  if (lastOutcome !== null) {
    return withAutonomousLoopTrace({
      outcome: lastOutcome,
      request,
      steps,
      stoppedBy: "iteration_guard"
    });
  }
  return startOutcomeFor(request);
}

function gapsPayload(request: OddSdlcCliTraversalRequest): unknown {
  const start = startOutcomeFor(request);
  if (start.executionContract === null) {
    return Object.freeze({
      start,
      dossier: null
    });
  }
  const events = replayEventsForBasis(
    start.executionContract.basis,
    readOddSdlcRuntimeEventsSync(request.workspaceRoot)
  );
  const projection = projectSdlcGapsFromReplay({
    basis: start.executionContract.basis,
    events
  });
  const dossier = deriveSdlcGapDossier({
    basis: start.executionContract.basis,
    events,
    triageInput: "cli:gaps",
    evidenceRefs: ["cli://odd-sdlc-ts/gaps"]
  });
  return Object.freeze({
    start,
    projection,
    dossier
  });
}

function commandPayload(request: OddSdlcCliTraversalRequest): unknown {
  if (request.command === "catalog") {
    return constructSdlcGraphFunctionCatalog();
  }
  if (request.command === "rc-report") {
    return describeOddSdlcTypescriptRcQualification();
  }
  if (request.command === "query-domain") {
    return queryDomainFor(workspaceContext(request.workspaceRoot));
  }
  if (request.command === "gaps") {
    return gapsPayload(request);
  }
  return startOutcomeFor(request);
}

async function commandPayloadAsync(request: OddSdlcCliRequest): Promise<unknown> {
  if (request.command === "install") {
    return installOddSdlcTypescript({
      targetRoot: request.targetRoot,
      packageSourceRoot: request.packageSourceRoot,
      abgPackageSourceRoot: request.abgPackageSourceRoot,
      installedPackageName: request.installedPackageName
    });
  }
  if (request.command === "release-cut") {
    return deriveOddSdlcTypescriptReleaseCut({
      archiveRoot: request.archiveRoot,
      packageSourceRoot: request.packageSourceRoot
    });
  }
  if (request.command === "start") {
    return installedStartPayloadFor(request);
  }
  return commandPayload(request);
}

export function runOddSdlcCli(argv: readonly string[]): OddSdlcCliResult {
  let command: OddSdlcCliCommand | "unknown" = "unknown";
  try {
    const request = admitOddSdlcCliRequest(argv);
    command = request.command;
    if (request.command === "install" || request.command === "release-cut") {
      throw new TypeError(`${request.command} requires runOddSdlcCliAsync`);
    }
    return ok(request.command, commandPayload(request));
  } catch (error) {
    return fail(command, error instanceof Error ? error.message : String(error));
  }
}

export async function runOddSdlcCliAsync(
  argv: readonly string[]
): Promise<OddSdlcCliResult> {
  let command: OddSdlcCliCommand | "unknown" = "unknown";
  try {
    const request = admitOddSdlcCliRequest(argv);
    command = request.command;
    return ok(request.command, await commandPayloadAsync(request));
  } catch (error) {
    return fail(command, error instanceof Error ? error.message : String(error));
  }
}

function isRecord(input: unknown): input is Readonly<Record<string, unknown>> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function stringField(
  record: Readonly<Record<string, unknown>>,
  key: string
): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function numberField(
  record: Readonly<Record<string, unknown>>,
  key: string
): number | null {
  const value = record[key];
  return typeof value === "number" ? value : null;
}

function numberArrayField(
  record: Readonly<Record<string, unknown>>,
  key: string
): readonly number[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    return Object.freeze([]);
  }
  return Object.freeze(
    value.filter((entry): entry is number => typeof entry === "number")
  );
}

function stringArrayField(
  record: Readonly<Record<string, unknown>>,
  key: string
): readonly string[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    return Object.freeze([]);
  }
  return Object.freeze(
    value.filter((entry): entry is string => typeof entry === "string")
  );
}

function childRecord(
  record: Readonly<Record<string, unknown>>,
  key: string
): Readonly<Record<string, unknown>> | null {
  const value = record[key];
  return isRecord(value) ? value : null;
}

function compactGapsResult(result: OddSdlcCliResult): string | null {
  if (result.command !== "gaps" || !isRecord(result.payload)) {
    return null;
  }
  const projection = childRecord(result.payload, "projection");
  const dossier = childRecord(result.payload, "dossier");
  if (projection === null) {
    return null;
  }
  const actions = dossier === null ? Object.freeze([]) : stringArrayField(dossier, "nextLawfulActions");
  return [
    "odd-sdlc-ts gaps",
    `status: ${stringField(projection, "status") ?? result.status}`,
    `graph_function: ${stringField(projection, "graphFunctionName") ?? "n/a"}`,
    `current_edge: ${stringField(projection, "currentEdge") ?? "n/a"}`,
    `closed_vectors: ${numberArrayField(projection, "closedVectorIndexes").join(",") || "none"}`,
    `next_action: ${actions[0] ?? "inspect_json"}`,
    "json: rerun with ODD_SDLC_TS_OUTPUT=json"
  ].join("\n");
}

function compactInstalledStartResult(result: OddSdlcCliResult): string | null {
  if (result.command !== "start" || !isRecord(result.payload)) {
    return null;
  }
  const summary = childRecord(result.payload, "summary");
  if (summary === null) {
    return null;
  }
  const loop = childRecord(result.payload, "loop");
  return [
    "odd-sdlc-ts start",
    `status: ${stringField(summary, "status") ?? result.status}`,
    `graph_function: ${stringField(summary, "graphFunctionName") ?? "n/a"}`,
    `current_edge: ${stringField(summary, "currentEdge") ?? "n/a"}`,
    `blocking_reason: ${stringField(summary, "blockingReason") ?? "none"}`,
    `next_action: ${stringField(summary, "nextLawfulAction") ?? "inspect_json"}`,
    ...(loop === null
      ? []
      : [
          `loop_steps: ${numberField(loop, "stepCount") ?? "n/a"}`,
          `loop_stop: ${stringField(loop, "stoppedBy") ?? "n/a"}`
        ]),
    `archive: ${stringField(summary, "archiveRoot") ?? "none"}`,
    "json: rerun with ODD_SDLC_TS_OUTPUT=json"
  ].join("\n");
}

function compactPublicStartResult(result: OddSdlcCliResult): string | null {
  if (result.command !== "start" || !isRecord(result.payload)) {
    return null;
  }
  const executionContract = childRecord(result.payload, "executionContract");
  return [
    "odd-sdlc-ts start",
    `status: ${stringField(result.payload, "status") ?? result.status}`,
    `graph_function: ${stringField(executionContract ?? {}, "targetGraphFunction") ?? "n/a"}`,
    `blocking_reason: ${stringField(result.payload, "blockingReason") ?? "none"}`,
    `stop: ${stringField(result.payload, "stopPredicate") ?? stringField(result.payload, "kind") ?? "n/a"}`,
    "json: rerun with ODD_SDLC_TS_OUTPUT=json"
  ].join("\n");
}

export function serializeOddSdlcCliResult(result: OddSdlcCliResult): string {
  if (process.env["ODD_SDLC_TS_OUTPUT"] !== "json" && result.status === "ok") {
    const compact =
      compactGapsResult(result) ??
      compactInstalledStartResult(result) ??
      compactPublicStartResult(result);
    if (compact !== null) {
      return `${compact}\n`;
    }
  }
  return `${JSON.stringify(result, null, 2)}\n`;
}
