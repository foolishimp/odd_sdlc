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
import {
  constructConstructionPriorityRule,
  constructConstructionPriorityScheme
} from "@abiogenesis/typescript-tenant";
import type {
  ConstructionPriorityScheme,
  ExecutionBasis,
  RuntimeEvent
} from "@abiogenesis/typescript-tenant";
import {
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule,
  FG_CONFORM_PROJECT
} from "../graph/index.js";
import { installOddSdlcTypescript } from "../install/index.js";
import {
  constructSdlcRequirementFulfillmentArchiveRehydration,
  deriveSdlcGapDossier,
  evalSdlcGapFromReplay,
  projectSdlcQueryDomain,
  projectSdlcRequirementFulfillmentPublicViewFromPriorProjection,
  withSdlcRequirementFulfillmentArchiveRehydration,
  type SdlcRequirementFulfillmentClosureSource,
  type SdlcRequirementFulfillmentEdgeLedgerSource,
  type SdlcRequirementFulfillmentAssessmentPublicInput,
  type SdlcRequirementFulfillmentNextActionSource,
  type SdlcRequirementFulfillmentPublicProjection
} from "../projection/index.js";
import { describeOddSdlcTypescriptRcQualification } from "../qualification/index.js";
import { deriveOddSdlcTypescriptReleaseCut } from "../release/index.js";
import {
  executeInstalledOperatorStartWithReentry,
  readOddSdlcRuntimeEvents,
  readOddSdlcRuntimeEventsSync
} from "../operator/index.js";
import {
  SDLC_PUBLIC_START_UNTIL_VALUES,
  projectSdlcWorkerAttachment,
  publicStartOnce,
  type SdlcPublicStartTargetKind,
  type SdlcPublicStartUntil
} from "../start/index.js";
import {
  deriveSdlcProjectConstraintsFromWorkspace,
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcConformProjectReportFromWorkspace,
  deriveSdlcConformProjectReportFromWorkspaces,
  deriveSdlcSourceInput,
  deriveSdlcWorkspaceIngressReport,
  type SdlcConformProjectProfile,
  type SdlcConformProjectReport,
  type SdlcProjectConstraints,
  type SdlcSourceInput,
  type SdlcWorkspaceIngressReport
} from "../workspace/index.js";

export const ODD_SDLC_SPEC_METHOD_COMMAND_VALUES = Object.freeze([
  "catalog",
  "query-domain",
  "gaps",
  "start",
  "install",
  "release-cut",
  "rc-report"
] as const);

export type OddSdlcSpecMethodCommand = (typeof ODD_SDLC_SPEC_METHOD_COMMAND_VALUES)[number];

const ODD_SDLC_SPEC_METHOD_COMMAND_SET: ReadonlySet<string> = new Set(
  ODD_SDLC_SPEC_METHOD_COMMAND_VALUES
);

export interface OddSdlcSpecMethodTraversalRequest {
  readonly kind: "odd_sdlc_spec_method_request";
  readonly command: Exclude<OddSdlcSpecMethodCommand, "install" | "release-cut">;
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot: string | null;
  readonly target: {
    readonly kind: SdlcPublicStartTargetKind;
    readonly handle: string;
  };
  readonly until: SdlcPublicStartUntil;
  readonly workerTransport: string | null;
  readonly evaluatorPriorityEdge: string | null;
}

export interface OddSdlcSpecMethodInstallRequest {
  readonly kind: "odd_sdlc_spec_method_install_request";
  readonly command: "install";
  readonly targetRoot: string;
  readonly packageSourceRoot: string;
  readonly abgPackageSourceRoot: string;
  readonly installedPackageName: string;
}

export interface OddSdlcSpecMethodReleaseCutRequest {
  readonly kind: "odd_sdlc_spec_method_release_cut_request";
  readonly command: "release-cut";
  readonly archiveRoot: string;
  readonly packageSourceRoot: string;
}

export type OddSdlcSpecMethodRequest =
  | OddSdlcSpecMethodTraversalRequest
  | OddSdlcSpecMethodInstallRequest
  | OddSdlcSpecMethodReleaseCutRequest;

export interface OddSdlcSpecMethodResult {
  readonly kind: "odd_sdlc_spec_method_result";
  readonly command: OddSdlcSpecMethodCommand | "unknown";
  readonly status: "ok" | "error";
  readonly exitCode: 0 | 2;
  readonly payload: unknown;
}

interface SpecMethodOptionReadModel {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot: string | null;
  readonly target: string;
  readonly until: SdlcPublicStartUntil;
  readonly workerTransport: string | null;
  readonly evaluatorPriorityEdge: string | null;
}

interface SpecMethodInstallOptionReadModel {
  readonly targetRoot: string;
  readonly packageSourceRoot: string;
  readonly abgPackageSourceRoot: string;
  readonly installedPackageName: string;
}

interface SpecMethodReleaseCutOptionReadModel {
  readonly archiveRoot: string;
  readonly packageSourceRoot: string;
}

interface SpecMethodWorkspaceContext {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot: string;
  readonly ingressReport: SdlcWorkspaceIngressReport;
  readonly conformedProject: SdlcConformProjectProfile;
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

const SPEC_METHOD_MODULE_ROOT = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PACKAGE_SOURCE_ROOT = resolve(SPEC_METHOD_MODULE_ROOT, "../../../../..");

function abgSourceCheckoutIsUsable(candidateRoot: string): boolean {
  return (
    existsSync(resolve(candidateRoot, "package.json")) &&
    existsSync(resolve(candidateRoot, "../../..", "docs/LLM_GTL_APP_BUILDER_GUIDE.md"))
  );
}

function abgPackageDependencyIsPresent(candidateRoot: string): boolean {
  return existsSync(resolve(candidateRoot, "package.json"));
}

export function resolveDefaultAbgPackageSourceRoot(
  packageSourceRoot: string = DEFAULT_PACKAGE_SOURCE_ROOT
): string {
  const siblingSourceCheckout = resolve(
    packageSourceRoot,
    "../../..",
    "abiogenesis/build_tenants/abiogenesis/typescript"
  );
  if (abgSourceCheckoutIsUsable(siblingSourceCheckout)) {
    return siblingSourceCheckout;
  }

  const packageLocalDependency = resolve(
    packageSourceRoot,
    "node_modules/@abiogenesis/typescript-tenant"
  );
  if (abgPackageDependencyIsPresent(packageLocalDependency)) {
    return packageLocalDependency;
  }
  return resolve(
    packageSourceRoot,
    "../..",
    "@abiogenesis/typescript-tenant"
  );
}

const DEFAULT_ABG_PACKAGE_SOURCE_ROOT = resolveDefaultAbgPackageSourceRoot();

function isCommand(value: string): value is OddSdlcSpecMethodCommand {
  return ODD_SDLC_SPEC_METHOD_COMMAND_SET.has(value);
}

function fail(command: OddSdlcSpecMethodCommand | "unknown", message: string): OddSdlcSpecMethodResult {
  return Object.freeze({
    kind: "odd_sdlc_spec_method_result",
    command,
    status: "error",
    exitCode: 2,
    payload: Object.freeze({
      error: message
    })
  });
}

function ok(command: OddSdlcSpecMethodCommand, payload: unknown): OddSdlcSpecMethodResult {
  return Object.freeze({
    kind: "odd_sdlc_spec_method_result",
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

function parseNonEmptyOptionValue(
  argv: readonly string[],
  index: number,
  option: string
): string {
  const value = requireOptionValue(argv, index, option).trim();
  if (value.length === 0) {
    throw new TypeError(`${option} requires a non-empty value`);
  }
  return value;
}

function parseOptions(
  command: OddSdlcSpecMethodCommand,
  argv: readonly string[]
): SpecMethodOptionReadModel {
  let workspaceRoot = ".";
  let outputWorkspaceRoot: string | null = null;
  let target = "next";
  let until: SdlcPublicStartUntil = "blocked";
  let workerTransport: string | null = null;
  let evaluatorPriorityEdge: string | null = null;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--workspace") {
      workspaceRoot = requireOptionValue(argv, index, "--workspace");
      index += 1;
    } else if (token === "--output-workspace") {
      outputWorkspaceRoot = requireOptionValue(argv, index, "--output-workspace");
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
    } else if (token === "--evaluator-priority-edge") {
      if (command !== "gaps") {
        throw new TypeError("--evaluator-priority-edge is only valid for gaps");
      }
      if (evaluatorPriorityEdge !== null) {
        throw new TypeError("--evaluator-priority-edge may be declared once");
      }
      evaluatorPriorityEdge = parseNonEmptyOptionValue(
        argv,
        index,
        "--evaluator-priority-edge"
      );
      index += 1;
    } else {
      throw new TypeError(`unknown option: ${token ?? ""}`);
    }
  }
  return Object.freeze({
    workspaceRoot,
    outputWorkspaceRoot,
    target,
    until,
    workerTransport,
    evaluatorPriorityEdge
  });
}

function parseInstallOptions(argv: readonly string[]): SpecMethodInstallOptionReadModel {
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

function parseReleaseCutOptions(argv: readonly string[]): SpecMethodReleaseCutOptionReadModel {
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

function parseTarget(rawTarget: string): OddSdlcSpecMethodTraversalRequest["target"] {
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

export function admitOddSdlcSpecMethodRequest(argv: readonly string[]): OddSdlcSpecMethodRequest {
  const command = argv[0];
  if (command === undefined || !isCommand(command)) {
    throw new TypeError(
      `command expected one of ${ODD_SDLC_SPEC_METHOD_COMMAND_VALUES.join(", ")}`
    );
  }
  if (command === "install") {
    const options = parseInstallOptions(argv.slice(1));
    return Object.freeze({
      kind: "odd_sdlc_spec_method_install_request",
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
      kind: "odd_sdlc_spec_method_release_cut_request",
      command,
      archiveRoot: resolve(options.archiveRoot),
      packageSourceRoot: resolve(options.packageSourceRoot)
    });
  }
  const options = parseOptions(command, argv.slice(1));
  return Object.freeze({
    kind: "odd_sdlc_spec_method_request",
    command,
    workspaceRoot: resolve(options.workspaceRoot),
    outputWorkspaceRoot:
      options.outputWorkspaceRoot === null ? null : resolve(options.outputWorkspaceRoot),
    target: parseTarget(options.target),
    until: options.until,
    workerTransport: options.workerTransport,
    evaluatorPriorityEdge: options.evaluatorPriorityEdge
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

function outputWorkspaceRootFor(request: OddSdlcSpecMethodTraversalRequest): string {
  return request.outputWorkspaceRoot ?? request.workspaceRoot;
}

function workspaceContext(input: {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
}): SpecMethodWorkspaceContext {
  const root = resolve(input.workspaceRoot);
  const outputRoot = resolve(input.outputWorkspaceRoot ?? root);
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: pathToFileURL(root).href,
    projectConstraints: projectConstraints(root),
    sourceInputs: readSourceInputs(root)
  });
  return Object.freeze({
    workspaceRoot: root,
    outputWorkspaceRoot: outputRoot,
    ingressReport,
    conformedProject: deriveSdlcConformProjectProfileFromWorkspace(root),
    conformanceReport:
      outputRoot === root
        ? deriveSdlcConformProjectReportFromWorkspace(root)
        : deriveSdlcConformProjectReportFromWorkspaces({
            sourceWorkspaceRoot: root,
            outputWorkspaceRoot: outputRoot
          })
  });
}

function queryDomainFor(context: SpecMethodWorkspaceContext): ReturnType<typeof projectSdlcQueryDomain> {
  return projectSdlcQueryDomain({
    module: constructSdlcGtlModule(),
    ingressReport: context.ingressReport,
    projectConformance: context.conformanceReport
  });
}

function jsonRecordFromFile(filePath: string): Readonly<Record<string, unknown>> | null {
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function operatorRunArchiveRootsNewestFirst(
  context: SpecMethodWorkspaceContext
): readonly string[] {
  const operatorRunRoot = path.join(
    context.outputWorkspaceRoot,
    context.conformedProject.runtimeLayout.operatorRunRoot
  );
  if (!existsSync(operatorRunRoot) || !statSync(operatorRunRoot).isDirectory()) {
    return Object.freeze([]);
  }
  return Object.freeze(
    readdirSync(operatorRunRoot)
      .map((entry) => path.join(operatorRunRoot, entry))
      .filter((entryPath) => statSync(entryPath).isDirectory())
      .sort((left, right) => statSync(right).mtimeMs - statSync(left).mtimeMs)
  );
}

function edgeFulfillmentCountsFromRecord(
  record: Readonly<Record<string, unknown>>
): SdlcRequirementFulfillmentEdgeLedgerSource["counts"] | null {
  const counts = childRecord(record, "counts");
  if (counts === null) {
    return null;
  }
  const expected = numberField(counts, "expected");
  const fulfilled = numberField(counts, "fulfilled");
  const partial = numberField(counts, "partial");
  const blocked = numberField(counts, "blocked");
  const unfulfilled = numberField(counts, "unfulfilled");
  const missing = numberField(counts, "missing");
  const extra = numberField(counts, "extra");
  if (
    expected === null ||
    fulfilled === null ||
    partial === null ||
    blocked === null ||
    unfulfilled === null ||
    missing === null ||
    extra === null
  ) {
    return null;
  }
  return Object.freeze({
    expected,
    fulfilled,
    partial,
    blocked,
    unfulfilled,
    missing,
    extra
  });
}

function edgeFulfillmentLedgerFromArchive(
  archiveRoot: string
): SdlcRequirementFulfillmentEdgeLedgerSource | null {
  const record = jsonRecordFromFile(
    path.join(archiveRoot, "sdlc_edge_fulfillment_ledger.json")
  );
  if (record?.["kind"] !== "sdlc_edge_fulfillment_ledger") {
    return null;
  }
  const ledgerRef = stringField(record, "ledgerRef");
  const ledgerVersionRef = stringField(record, "ledgerVersionRef");
  const counts = edgeFulfillmentCountsFromRecord(record);
  if (ledgerRef === null || ledgerVersionRef === null || counts === null) {
    return null;
  }
  return Object.freeze({
    ledgerRef,
    ledgerVersionRef,
    counts
  });
}

function edgeClosureDispositionFromRecord(
  record: Readonly<Record<string, unknown>>
): SdlcRequirementFulfillmentClosureSource["disposition"] | null {
  const disposition = stringField(record, "disposition");
  return disposition === "close" ||
    disposition === "yield" ||
    disposition === "retry" ||
    disposition === "repair" ||
    disposition === "re-enter" ||
    disposition === "reprice" ||
    disposition === "block"
    ? disposition
    : null;
}

function edgeClosureDecisionFromArchive(
  archiveRoot: string
): SdlcRequirementFulfillmentClosureSource | null {
  const record = jsonRecordFromFile(
    path.join(archiveRoot, "sdlc_edge_closure_decision.json")
  );
  if (record?.["kind"] !== "sdlc_edge_closure_decision") {
    return null;
  }
  const decisionRef = stringField(record, "decisionRef");
  const disposition = edgeClosureDispositionFromRecord(record);
  if (decisionRef === null || disposition === null) {
    return null;
  }
  return Object.freeze({
    decisionRef,
    disposition
  });
}

function nextActionProjectionFromArchive(
  archiveRoot: string
): SdlcRequirementFulfillmentNextActionSource | null {
  const record = jsonRecordFromFile(
    path.join(archiveRoot, "sdlc_next_action_projection.json")
  );
  if (record?.["kind"] !== "sdlc_next_action_projection") {
    return null;
  }
  const nextActionProjectionRef = stringField(record, "nextActionProjectionRef");
  const selectedActionRef = stringField(record, "selectedActionRef");
  if (nextActionProjectionRef === null) {
    return null;
  }
  return Object.freeze({
    nextActionProjectionRef,
    selectedActionRef
  });
}

function selectedNextGraphFunctionNameFromArchive(input: {
  readonly context: SpecMethodWorkspaceContext;
  readonly module: ReturnType<typeof constructSdlcGtlModule>;
}): string | null {
  const graphFunctionNameByRef = new Map(
    input.module.graphFunctions.flatMap((graphFunction) => [
      [graphFunction.id, graphFunction.name],
      [graphFunction.name, graphFunction.name]
    ])
  );
  for (const archiveRoot of operatorRunArchiveRootsNewestFirst(input.context)) {
    const decision = edgeClosureDecisionFromArchive(archiveRoot);
    if (decision?.disposition !== "close") {
      continue;
    }
    const record = jsonRecordFromFile(
      path.join(archiveRoot, "sdlc_next_action_projection.json")
    );
    if (
      record?.["kind"] !== "sdlc_next_action_projection" ||
      record["choosesNextTraversal"] !== true ||
      stringField(record, "selectedActionRef") === null
    ) {
      continue;
    }
    const nextGraphFunctionRef = stringField(record, "nextGraphFunctionRef");
    if (nextGraphFunctionRef === null) {
      continue;
    }
    const direct = graphFunctionNameByRef.get(nextGraphFunctionRef);
    if (direct !== undefined) {
      return direct;
    }
    const suffixMatch = input.module.graphFunctions.find((graphFunction) =>
      nextGraphFunctionRef.endsWith(`:${graphFunction.name}`)
    );
    if (suffixMatch !== undefined) {
      return suffixMatch.name;
    }
  }
  return null;
}

function assessmentStatusFromRecord(
  record: Readonly<Record<string, unknown>>
): SdlcRequirementFulfillmentAssessmentPublicInput["fulfillmentStatus"] | null {
  const status = stringField(record, "fulfillmentStatus");
  return status === "fulfilled" ||
    status === "partial" ||
    status === "blocked" ||
    status === "unassessed"
    ? status
    : null;
}

function requirementAssessmentsFromArchive(
  archiveRoot: string
): readonly SdlcRequirementFulfillmentAssessmentPublicInput[] {
  const report = jsonRecordFromFile(path.join(archiveRoot, "worker_result_report.json"));
  const assessments = report?.["obligationAssessments"];
  if (!Array.isArray(assessments)) {
    return Object.freeze([]);
  }
  return Object.freeze(
    assessments.flatMap((assessment): SdlcRequirementFulfillmentAssessmentPublicInput[] => {
      if (!isRecord(assessment)) {
        return [];
      }
      const obligationId = stringField(assessment, "obligationId");
      const fulfillmentStatus = assessmentStatusFromRecord(assessment);
      if (obligationId === null || fulfillmentStatus === null) {
        return [];
      }
      return [
        Object.freeze({
          obligationId,
          fulfillmentStatus,
          evidenceRefs: stringArrayField(assessment, "evidenceRefs"),
          blockingReasons: stringArrayField(assessment, "blockingReasons")
        })
      ];
    })
  );
}

function archiveRefForRoot(archiveRoot: string): string {
  return pathToFileURL(archiveRoot).href;
}

function missingTraversalConsequenceArtifactRefs(input: {
  readonly archiveRoot: string;
  readonly edgeFulfillmentLedger: SdlcRequirementFulfillmentEdgeLedgerSource | null;
  readonly edgeClosureDecision: SdlcRequirementFulfillmentClosureSource | null;
  readonly nextActionProjection: SdlcRequirementFulfillmentNextActionSource | null;
}): readonly string[] {
  const missing: string[] = [];
  if (input.edgeFulfillmentLedger === null) {
    missing.push("sdlc_edge_fulfillment_ledger.json");
  }
  if (input.edgeClosureDecision === null) {
    missing.push("sdlc_edge_closure_decision.json");
  }
  if (input.nextActionProjection === null) {
    missing.push("sdlc_next_action_projection.json");
  }
  return Object.freeze(
    missing.map((fileName) => pathToFileURL(path.join(input.archiveRoot, fileName)).href)
  );
}

function requirementFulfillmentForGaps(input: {
  readonly context: SpecMethodWorkspaceContext;
  readonly sourceProjection: SdlcRequirementFulfillmentPublicProjection;
}): SdlcRequirementFulfillmentPublicProjection {
  const archiveRoots = operatorRunArchiveRootsNewestFirst(input.context);
  if (archiveRoots.length === 0) {
    return withSdlcRequirementFulfillmentArchiveRehydration({
      projection: input.sourceProjection,
      archiveRehydration: constructSdlcRequirementFulfillmentArchiveRehydration({
        status: "no_operator_runs"
      })
    });
  }
  const scannedArchiveRefs = Object.freeze(archiveRoots.map(archiveRefForRoot));
  const missingArtifactRefs: string[] = [];
  for (const archiveRoot of archiveRoots) {
    const edgeFulfillmentLedger = edgeFulfillmentLedgerFromArchive(archiveRoot);
    const edgeClosureDecision = edgeClosureDecisionFromArchive(archiveRoot);
    const nextActionProjection = nextActionProjectionFromArchive(archiveRoot);
    if (
      edgeFulfillmentLedger === null ||
      edgeClosureDecision === null ||
      nextActionProjection === null
    ) {
      missingArtifactRefs.push(
        ...missingTraversalConsequenceArtifactRefs({
          archiveRoot,
          edgeFulfillmentLedger,
          edgeClosureDecision,
          nextActionProjection
        })
      );
      continue;
    }
    return projectSdlcRequirementFulfillmentPublicViewFromPriorProjection({
      sourceProjection: input.sourceProjection,
      assessments: requirementAssessmentsFromArchive(archiveRoot),
      edgeFulfillmentLedger,
      edgeClosureDecision,
      nextActionProjection,
      sourceRegisterRef: `requirement-fulfillment-public://odd-sdlc/${encodeURIComponent(archiveRoot)}`,
      archiveRehydration: constructSdlcRequirementFulfillmentArchiveRehydration({
        status: "rehydrated",
        archiveRef: archiveRefForRoot(archiveRoot),
        scannedArchiveRefs,
        missingArtifactRefs
      })
    });
  }
  return withSdlcRequirementFulfillmentArchiveRehydration({
    projection: input.sourceProjection,
    archiveRehydration: constructSdlcRequirementFulfillmentArchiveRehydration({
      status: "no_archive_with_consequence_triple",
      scannedArchiveRefs,
      missingArtifactRefs
    })
  });
}

function defaultRegimeFor(input: {
  readonly request: OddSdlcSpecMethodTraversalRequest;
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

function startOutcomeFor(request: OddSdlcSpecMethodTraversalRequest): ReturnType<typeof publicStartOnce> {
  const context = workspaceContext({
    workspaceRoot: request.workspaceRoot,
    outputWorkspaceRoot: request.outputWorkspaceRoot
  });
  const queryDomain = queryDomainFor(context);
  return publicStartOnce({
    request: {
      kind: "sdlc_public_start_request",
      workspaceRoot: context.workspaceRoot,
      outputWorkspaceRoot:
        context.outputWorkspaceRoot === context.workspaceRoot
          ? null
          : context.outputWorkspaceRoot,
      target: request.target,
      until: request.until,
      defaultRegime: defaultRegimeFor({ request, queryDomain })
    },
    module: constructSdlcGtlModule(),
    queryDomain,
    conformedProject: context.conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({
      transportContract: request.workerTransport
    })
  });
}

function basisIdValue(event: RuntimeEvent): string | null {
  const value: unknown = Reflect.get(event, "basisId");
  return typeof value === "string" ? value : null;
}

function hasReplayForBasis(
  basis: ExecutionBasis,
  events: readonly RuntimeEvent[]
): boolean {
  return events.some((event) => basisIdValue(event) === basis.id);
}

function startOutcomeForObservedReplay(input: {
  readonly request: OddSdlcSpecMethodTraversalRequest;
  readonly events: readonly RuntimeEvent[];
}): ReturnType<typeof publicStartOnce> {
  const context = workspaceContext({
    workspaceRoot: input.request.workspaceRoot,
    outputWorkspaceRoot: input.request.outputWorkspaceRoot
  });
  const module = constructSdlcGtlModule();
  const selectedNextGraphFunctionName = selectedNextGraphFunctionNameFromArchive({
    context,
    module
  });
  if (
    selectedNextGraphFunctionName !== null &&
    (input.request.target.kind === "next" ||
      (input.request.target.kind === "graph_function" &&
        input.request.target.handle !== selectedNextGraphFunctionName))
  ) {
    const selected = startOutcomeFor({
      ...input.request,
      target: {
        kind: "graph_function",
        handle: selectedNextGraphFunctionName
      }
    });
    if (selected.executionContract !== null) {
      return selected;
    }
  }
  const requested = startOutcomeFor(input.request);
  if (
    requested.executionContract === null ||
    hasReplayForBasis(requested.executionContract.basis, input.events)
  ) {
    return requested;
  }
  for (const until of SDLC_PUBLIC_START_UNTIL_VALUES) {
    const candidate = startOutcomeFor({
      ...input.request,
      until
    });
    if (
      candidate.executionContract !== null &&
      hasReplayForBasis(candidate.executionContract.basis, input.events)
    ) {
      return candidate;
    }
  }
  if (input.request.target.kind === "next") {
    const queryDomain = queryDomainFor(context);
    for (const target of queryDomain.startTargets) {
      for (const until of SDLC_PUBLIC_START_UNTIL_VALUES) {
        const candidate = startOutcomeFor({
          ...input.request,
          target: {
            kind: "graph_function",
            handle: target.name
          },
          until
        });
        if (
          candidate.executionContract !== null &&
          hasReplayForBasis(candidate.executionContract.basis, input.events)
        ) {
          return candidate;
        }
      }
    }
  }
  return requested;
}

function replayEventsForBasis(
  basis: ExecutionBasis,
  events: readonly RuntimeEvent[]
): readonly RuntimeEvent[] {
  return Object.freeze(
    events.filter((event) => {
      if ("basisId" in event) {
        return basisIdValue(event) === basis.id;
      }
      const runId = Reflect.get(event, "runId");
      const workKey = Reflect.get(event, "workKey");
      return (
        typeof runId === "string" &&
        typeof workKey === "string" &&
        runId === basis.runId &&
        workKey === basis.workKey
      );
    })
  );
}

function constructionPrioritySchemeForSpecMethodGaps(input: {
  readonly request: OddSdlcSpecMethodTraversalRequest;
  readonly basis: ExecutionBasis;
  readonly closedVectorIndexes: readonly number[];
}): ConstructionPriorityScheme | undefined {
  if (input.request.evaluatorPriorityEdge === null) {
    return undefined;
  }
  const matches = input.basis.graph.vectors
    .map((vector, index) => Object.freeze({ vector, index }))
    .filter(({ vector }) => vector.name === input.request.evaluatorPriorityEdge);
  if (matches.length === 0) {
    throw new TypeError(
      `--evaluator-priority-edge does not name a published graph edge: ${input.request.evaluatorPriorityEdge}`
    );
  }
  if (matches.length > 1) {
    throw new TypeError(
      `--evaluator-priority-edge is ambiguous: ${input.request.evaluatorPriorityEdge}`
    );
  }
  const selected = matches[0];
  if (selected === undefined) {
    throw new TypeError("--evaluator-priority-edge did not resolve to a graph edge");
  }
  if (input.closedVectorIndexes.includes(selected.index)) {
    throw new TypeError(
      `--evaluator-priority-edge names an already closed graph edge: ${selected.vector.name}`
    );
  }
  const sourcePolicyRef =
    `spec-method://odd-sdlc/gaps/evaluator-priority-edge/${selected.vector.name}`;
  return constructConstructionPriorityScheme({
    schemeRef:
      `priority-scheme://odd-sdlc/spec-method/gaps/${input.basis.graphFunction.id}/${selected.vector.id}`,
    sourcePolicyRef,
    rules: Object.freeze([
      constructConstructionPriorityRule({
        priorityRuleRef:
          `priority-rule://odd-sdlc/spec-method/gaps/${input.basis.graphFunction.id}/${selected.vector.id}`,
        axis: "gap_repair",
        weight: 1000,
        appliesToActionKinds: Object.freeze(["continue_graph_call"]),
        appliesToOutcomeRefs: Object.freeze([
          `outcome://odd-sdlc/${input.basis.graphFunction.id}/${selected.vector.target.id}`
        ]),
        sourcePolicyRef,
        strategyLabel: "spec_method_evaluator_priority_edge"
      })
    ])
  });
}

async function installedStartPayloadFor(
  request: OddSdlcSpecMethodTraversalRequest
): Promise<unknown> {
  const outputWorkspaceRoot = outputWorkspaceRootFor(request);
  const runtimeEvents = await readOddSdlcRuntimeEvents(outputWorkspaceRoot);
  const start = startOutcomeForObservedReplay({
    request,
    events: runtimeEvents
  });
  const deterministicTransition =
    start.kind === "sdlc_public_start_projected" &&
    start.transition.kind === "fd_advance";
  if (request.workerTransport === null && !deterministicTransition) {
    return start;
  }
  return executeInstalledOperatorStartWithReentry({
    workspaceRoot: outputWorkspaceRoot,
    sourceWorkspaceRoot: request.workspaceRoot,
    start,
    workerTransport: request.workerTransport,
    replayEvents:
      start.executionContract === null
        ? Object.freeze([])
        : replayEventsForBasis(start.executionContract.basis, runtimeEvents),
    requestedUntil: request.until,
    requireInstalledTopology: true,
    refreshReplayState: async () => {
      const refreshedEvents = await readOddSdlcRuntimeEvents(outputWorkspaceRoot);
      const refreshedStart = startOutcomeForObservedReplay({
        request,
        events: refreshedEvents
      });
      return Object.freeze({
        start: refreshedStart,
        replayEvents:
          refreshedStart.executionContract === null
            ? Object.freeze([])
            : replayEventsForBasis(
                refreshedStart.executionContract.basis,
                refreshedEvents
              )
      });
    }
  });
}

function gapsPayload(request: OddSdlcSpecMethodTraversalRequest): unknown {
  const outputWorkspaceRoot = outputWorkspaceRootFor(request);
  const context = workspaceContext({
    workspaceRoot: request.workspaceRoot,
    outputWorkspaceRoot: request.outputWorkspaceRoot
  });
  const queryDomain = queryDomainFor(context);
  const allEvents = readOddSdlcRuntimeEventsSync(outputWorkspaceRoot);
  const start = startOutcomeForObservedReplay({
    request,
    events: allEvents
  });
  if (start.executionContract === null) {
    return Object.freeze({
      start,
      dossier: null
    });
  }
  const events = replayEventsForBasis(
    start.executionContract.basis,
    allEvents
  );
  const projection = evalSdlcGapFromReplay({
    basis: start.executionContract.basis,
    events
  });
  const priorityScheme = constructionPrioritySchemeForSpecMethodGaps({
    request,
    basis: start.executionContract.basis,
    closedVectorIndexes: projection.closedVectorIndexes
  });
  const requirementFulfillment = requirementFulfillmentForGaps({
    context,
    sourceProjection: queryDomain.requirementFulfillment
  });
  const dossier = deriveSdlcGapDossier({
    basis: start.executionContract.basis,
    events,
    triageInput: "spec_method:gaps",
    evidenceRefs: ["spec-method://odd-sdlc-ts/gaps"],
    requirementFulfillment,
    ...(priorityScheme === undefined ? {} : { priorityScheme })
  });
  return Object.freeze({
    start,
    projection,
    dossier,
    requirementFulfillment
  });
}

function commandPayload(request: OddSdlcSpecMethodTraversalRequest): unknown {
  if (request.command === "catalog") {
    return constructSdlcGraphFunctionCatalog();
  }
  if (request.command === "rc-report") {
    return describeOddSdlcTypescriptRcQualification();
  }
  if (request.command === "query-domain") {
    return queryDomainFor(
      workspaceContext({
        workspaceRoot: request.workspaceRoot,
        outputWorkspaceRoot: request.outputWorkspaceRoot
      })
    );
  }
  if (request.command === "gaps") {
    return gapsPayload(request);
  }
  return startOutcomeFor(request);
}

async function commandPayloadAsync(request: OddSdlcSpecMethodRequest): Promise<unknown> {
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

export function invokeOddSdlcSpecMethodCommandSync(
  argv: readonly string[]
): OddSdlcSpecMethodResult {
  let command: OddSdlcSpecMethodCommand | "unknown" = "unknown";
  try {
    const request = admitOddSdlcSpecMethodRequest(argv);
    command = request.command;
    if (request.command === "install" || request.command === "release-cut") {
      throw new TypeError(
        `${request.command} requires invokeOddSdlcSpecMethodCommand`
      );
    }
    return ok(request.command, commandPayload(request));
  } catch (error) {
    return fail(command, error instanceof Error ? error.message : String(error));
  }
}

export async function invokeOddSdlcSpecMethodCommand(
  argv: readonly string[]
): Promise<OddSdlcSpecMethodResult> {
  let command: OddSdlcSpecMethodCommand | "unknown" = "unknown";
  try {
    const request = admitOddSdlcSpecMethodRequest(argv);
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

function numberField(
  record: Readonly<Record<string, unknown>>,
  key: string
): number | null {
  const value = record[key];
  return typeof value === "number" ? value : null;
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

function compactGapsResult(result: OddSdlcSpecMethodResult): string | null {
  if (result.command !== "gaps" || !isRecord(result.payload)) {
    return null;
  }
  const projection = childRecord(result.payload, "projection");
  const dossier = childRecord(result.payload, "dossier");
  if (projection === null) {
    return null;
  }
  const actions = dossier === null ? Object.freeze([]) : stringArrayField(dossier, "nextLawfulActions");
  const requirementFulfillment =
    dossier === null ? null : childRecord(dossier, "requirementFulfillment");
  const requirementCounts =
    requirementFulfillment === null
      ? null
      : childRecord(requirementFulfillment, "counts");
  const totalRequirements =
    requirementCounts === null ? null : numberField(requirementCounts, "total");
  const unresolvedRequirements =
    requirementCounts === null ? null : numberField(requirementCounts, "unresolved");
  return [
    "odd-sdlc-ts gaps",
    `status: ${stringField(projection, "status") ?? result.status}`,
    `graph_function: ${stringField(projection, "graphFunctionName") ?? "n/a"}`,
    `current_edge: ${stringField(projection, "currentEdge") ?? "n/a"}`,
    `closed_vectors: ${numberArrayField(projection, "closedVectorIndexes").join(",") || "none"}`,
    totalRequirements === null
      ? "requirements: inspect_json"
      : `requirements: ${unresolvedRequirements ?? 0}/${totalRequirements} unresolved`,
    "read_only: true",
    "chooses_next_traversal: false",
    `next_action: ${actions[0] ?? "inspect_json"}`,
    "json: rerun with ODD_SDLC_TS_OUTPUT=json"
  ].join("\n");
}

function compactInstalledStartResult(result: OddSdlcSpecMethodResult): string | null {
  if (result.command !== "start" || !isRecord(result.payload)) {
    return null;
  }
  const summary = childRecord(result.payload, "summary");
  if (summary === null) {
    return null;
  }
  return [
    "odd-sdlc-ts start",
    `status: ${stringField(summary, "status") ?? result.status}`,
    `graph_function: ${stringField(summary, "graphFunctionName") ?? "n/a"}`,
    `current_edge: ${stringField(summary, "currentEdge") ?? "n/a"}`,
    `blocking_reason: ${stringField(summary, "blockingReason") ?? "none"}`,
    `next_action: ${stringField(summary, "nextLawfulAction") ?? "inspect_json"}`,
    `archive: ${stringField(summary, "archiveRoot") ?? "none"}`,
    "json: rerun with ODD_SDLC_TS_OUTPUT=json"
  ].join("\n");
}

function compactPublicStartResult(result: OddSdlcSpecMethodResult): string | null {
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

export function serializeOddSdlcSpecMethodResult(result: OddSdlcSpecMethodResult): string {
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
