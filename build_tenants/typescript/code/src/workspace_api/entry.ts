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
  admitExecutionBasis,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  admitStartIntent,
  materializeGraphFunction
} from "@abiogenesis/typescript-tenant";
import { isPlainRecord } from "../admission/index.js";
import { constructSdlcGtlModule } from "../graph/index.js";
import { assertCurrentSdlcGtlProgramConformance } from "../gtl_conformance/index.js";
import {
  constructSdlcRequirementFulfillmentArchiveRehydration,
  deriveSdlcGapDossier,
  projectSdlcQueryDomain,
  projectSdlcRequirementFulfillmentPublicViewFromPriorProjection,
  withSdlcRequirementFulfillmentArchiveRehydration,
  type SdlcRequirementFulfillmentAssessmentPublicInput,
  type SdlcRequirementFulfillmentClosureSource,
  type SdlcRequirementFulfillmentEdgeLedgerSource,
  type SdlcRequirementFulfillmentNextActionSource,
  type SdlcRequirementFulfillmentPublicProjection
} from "../projection/index.js";
import { parseClosedRecord, parseNonEmptyString } from "../shared/validation.js";
import { admitSdlcTicketExecutionContract } from "../tickets/index.js";
import {
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcConformProjectReportFromWorkspace,
  deriveSdlcConformProjectReportFromWorkspaces,
  deriveSdlcProjectConstraintsFromWorkspace,
  deriveSdlcWorkspaceIngressReport,
  collectSdlcWorkspaceSourceInputs,
  type SdlcConformProjectReport,
  type SdlcConformProjectProfile,
  type SdlcProjectConstraints,
  type SdlcWorkspaceIngressReport
} from "../workspace/index.js";

interface OddSdlcWorkspaceProjectionInput {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
}

interface AdmittedOddSdlcWorkspaceProjectionInput {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot: string | null;
}

interface OddSdlcWorkspaceTicketAdmissionInput
  extends OddSdlcWorkspaceProjectionInput {
  readonly ticketId: string;
}

interface AdmittedOddSdlcWorkspaceTicketAdmissionInput
  extends AdmittedOddSdlcWorkspaceProjectionInput {
  readonly ticketId: string;
}

interface OddSdlcWorkspaceApiContext {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot: string;
  readonly ingressReport: SdlcWorkspaceIngressReport;
  readonly conformedProject: SdlcConformProjectProfile;
  readonly conformanceReport: SdlcConformProjectReport;
}

export interface SdlcWorkspaceGapArchiveDiagnostic {
  readonly kind: "sdlc_workspace_gap_archive_diagnostic";
  readonly code:
    | "missing_bind_outcome_after_passed_compute"
    | "traversal_consequence_artifacts_missing"
    | "next_action_projection_graph_vector_missing"
    | "legacy_graph_function_boundary_ref"
    | "unknown_graph_function_boundary_ref"
    | "legacy_graph_vector_boundary_ref"
    | "unknown_graph_vector_boundary_ref";
  readonly archiveRef: string;
  readonly evidenceRefs: readonly string[];
}

interface SdlcWorkspaceGapsArchiveReadModel {
  readonly archiveRoot: string;
  readonly archiveRef: string;
  readonly edgeFulfillmentLedger: SdlcRequirementFulfillmentEdgeLedgerSource | null;
  readonly edgeClosureDecision: SdlcRequirementFulfillmentClosureSource | null;
  readonly nextActionProjection: SdlcRequirementFulfillmentNextActionSource | null;
  readonly passedComputeEvidenceRefs: readonly string[];
  readonly assessments: readonly SdlcRequirementFulfillmentAssessmentPublicInput[];
}

const WORKSPACE_API_MODULE_ROOT = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PACKAGE_SOURCE_ROOT = resolve(WORKSPACE_API_MODULE_ROOT, "../../../../..");

function abgSourceCheckoutIsUsable(candidateRoot: string): boolean {
  return (
    existsSync(resolve(candidateRoot, "package.json")) &&
    existsSync(resolve(candidateRoot, "../../..", "docs/LLM_GTL_APP_BUILDER_GUIDE.md"))
  );
}

function abgPackageDependencyIsPresent(candidateRoot: string): boolean {
  return existsSync(resolve(candidateRoot, "package.json"));
}

function abgDocsSourceIsUsable(candidateRoot: string): boolean {
  return (
    existsSync(resolve(candidateRoot, "README.md")) &&
    existsSync(resolve(candidateRoot, "LLM_GTL_APP_BUILDER_GUIDE.md")) &&
    existsSync(resolve(candidateRoot, "USER_GUIDE.md"))
  );
}

function standardsSourceIsUsable(candidateRoot: string): boolean {
  return (
    existsSync(resolve(candidateRoot, "SPEC_METHOD.md")) &&
    existsSync(resolve(candidateRoot, "ODD_METHOD.md")) &&
    existsSync(resolve(candidateRoot, "RELEASE_METHOD.md"))
  );
}

export function resolveDefaultAbgPackageSourceRoot(
  packageSourceRoot: string = DEFAULT_PACKAGE_SOURCE_ROOT
): string {
  const packageLocalDependency = resolve(
    packageSourceRoot,
    "node_modules/@abiogenesis/typescript-tenant"
  );
  if (abgPackageDependencyIsPresent(packageLocalDependency)) {
    return packageLocalDependency;
  }

  const siblingSourceCheckout = resolve(
    packageSourceRoot,
    "../../..",
    "abiogenesis/build_tenants/abiogenesis/typescript"
  );
  if (abgSourceCheckoutIsUsable(siblingSourceCheckout)) {
    return siblingSourceCheckout;
  }

  return resolve(packageSourceRoot, "../..", "@abiogenesis/typescript-tenant");
}

export function resolveDefaultAbgStandardsSourceRoot(
  packageSourceRoot: string = DEFAULT_PACKAGE_SOURCE_ROOT
): string | null {
  const siblingStandards = resolve(
    packageSourceRoot,
    "../../..",
    "specification_methodology/specification/standards"
  );
  if (standardsSourceIsUsable(siblingStandards)) {
    return siblingStandards;
  }
  const installedStandards = resolve(
    packageSourceRoot,
    ".abiogenesis/docs/standards"
  );
  if (standardsSourceIsUsable(installedStandards)) {
    return installedStandards;
  }
  return null;
}

export function resolveDefaultAbgDocsSourceRoot(
  packageSourceRoot: string = DEFAULT_PACKAGE_SOURCE_ROOT
): string | null {
  const siblingDocs = resolve(packageSourceRoot, "../../..", "abiogenesis/docs");
  if (abgDocsSourceIsUsable(siblingDocs)) {
    return siblingDocs;
  }
  const installedDocs = resolve(packageSourceRoot, ".abiogenesis/docs");
  if (abgDocsSourceIsUsable(installedDocs)) {
    return installedDocs;
  }
  return null;
}

function projectConstraints(workspaceRoot: string): SdlcProjectConstraints {
  return deriveSdlcProjectConstraintsFromWorkspace(workspaceRoot);
}

function admitWorkspaceProjectionInput(
  input: OddSdlcWorkspaceProjectionInput,
  label: string
): AdmittedOddSdlcWorkspaceProjectionInput {
  const record = parseClosedRecord(input, label, [
    "workspaceRoot",
    "outputWorkspaceRoot"
  ]);
  const workspaceRoot = parseNonEmptyString(
    record["workspaceRoot"],
    `${label}.workspaceRoot`
  );
  const outputWorkspaceRoot =
    record["outputWorkspaceRoot"] === undefined ||
    record["outputWorkspaceRoot"] === null
      ? null
      : parseNonEmptyString(
          record["outputWorkspaceRoot"],
          `${label}.outputWorkspaceRoot`
        );
  return Object.freeze({
    workspaceRoot,
    outputWorkspaceRoot
  });
}

function admitWorkspaceTicketInput(
  input: OddSdlcWorkspaceTicketAdmissionInput
): AdmittedOddSdlcWorkspaceTicketAdmissionInput {
  const record = parseClosedRecord(input, "OddSdlcWorkspaceTicketAdmissionInput", [
    "workspaceRoot",
    "outputWorkspaceRoot",
    "ticketId"
  ]);
  const base = admitWorkspaceProjectionInput(
    {
      workspaceRoot: parseNonEmptyString(
        record["workspaceRoot"],
        "OddSdlcWorkspaceTicketAdmissionInput.workspaceRoot"
      ),
      outputWorkspaceRoot:
        record["outputWorkspaceRoot"] === undefined ||
        record["outputWorkspaceRoot"] === null
          ? null
          : parseNonEmptyString(
              record["outputWorkspaceRoot"],
              "OddSdlcWorkspaceTicketAdmissionInput.outputWorkspaceRoot"
            )
    },
    "OddSdlcWorkspaceTicketAdmissionInput"
  );
  return Object.freeze({
    ...base,
    ticketId: parseNonEmptyString(
      record["ticketId"],
      "OddSdlcWorkspaceTicketAdmissionInput.ticketId"
    )
  });
}

function workspaceContext(
  input: AdmittedOddSdlcWorkspaceProjectionInput
): OddSdlcWorkspaceApiContext {
  const root = resolve(input.workspaceRoot);
  const outputRoot = resolve(input.outputWorkspaceRoot ?? root);
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: pathToFileURL(root).href,
    projectConstraints: projectConstraints(root),
    sourceInputs: collectSdlcWorkspaceSourceInputs(root)
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

function queryDomainFor(
  context: OddSdlcWorkspaceApiContext
): ReturnType<typeof projectSdlcQueryDomain> {
  assertCurrentSdlcGtlProgramConformance();
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
    return isPlainRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
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
  return isPlainRecord(value) ? value : null;
}

function operatorRunArchiveRootsNewestFirst(
  context: OddSdlcWorkspaceApiContext
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

function archiveRefForRoot(archiveRoot: string): string {
  return pathToFileURL(archiveRoot).href;
}

function archiveFileRef(input: {
  readonly archiveRoot: string;
  readonly fileName: string;
}): string {
  return pathToFileURL(path.join(input.archiveRoot, input.fileName)).href;
}

function archiveRecordHasKind(input: {
  readonly archiveRoot: string;
  readonly fileName: string;
  readonly kind: string;
}): boolean {
  return (
    jsonRecordFromFile(path.join(input.archiveRoot, input.fileName))?.["kind"] ===
    input.kind
  );
}

function archivePostflightPassed(archiveRoot: string): boolean {
  const record = jsonRecordFromFile(path.join(archiveRoot, "postflight.json"));
  return (
    record?.["kind"] === "sdlc_operator_postflight_result" &&
    stringField(record, "status") === "passed"
  );
}

function archiveFpEvaluatePassed(archiveRoot: string): boolean {
  const record = jsonRecordFromFile(path.join(archiveRoot, "fp_evaluate_result.json"));
  return (
    record?.["kind"] === "sdlc_fp_evaluate_result" &&
    stringField(record, "status") === "passed"
  );
}

function passedComputeEvidenceRefs(archiveRoot: string): readonly string[] {
  const workerReportRef = archiveRecordHasKind({
    archiveRoot,
    fileName: "worker_result_report.json",
    kind: "odd_sdlc.worker_result_report"
  })
    ? archiveFileRef({ archiveRoot, fileName: "worker_result_report.json" })
    : null;
  const postflightRef = archivePostflightPassed(archiveRoot)
    ? archiveFileRef({ archiveRoot, fileName: "postflight.json" })
    : null;
  const fpEvaluateRef = archiveFpEvaluatePassed(archiveRoot)
    ? archiveFileRef({ archiveRoot, fileName: "fp_evaluate_result.json" })
    : null;
  if (workerReportRef === null || postflightRef === null || fpEvaluateRef === null) {
    return Object.freeze([]);
  }
  return Object.freeze([workerReportRef, postflightRef, fpEvaluateRef]);
}

function operatorRunArchiveReadModel(
  archiveRoot: string
): SdlcWorkspaceGapsArchiveReadModel {
  return Object.freeze({
    archiveRoot,
    archiveRef: archiveRefForRoot(archiveRoot),
    edgeFulfillmentLedger: edgeFulfillmentLedgerFromArchive(archiveRoot),
    edgeClosureDecision: edgeClosureDecisionFromArchive(archiveRoot),
    nextActionProjection: nextActionProjectionFromArchive(archiveRoot),
    passedComputeEvidenceRefs: passedComputeEvidenceRefs(archiveRoot),
    assessments: requirementAssessmentsFromArchive(archiveRoot)
  });
}

function missingBindOutcomeAfterPassedComputeRefs(
  archive: SdlcWorkspaceGapsArchiveReadModel
): readonly string[] {
  if (
    archive.edgeFulfillmentLedger !== null &&
    archive.edgeClosureDecision !== null &&
    archive.nextActionProjection !== null
  ) {
    return Object.freeze([]);
  }
  if (archive.passedComputeEvidenceRefs.length === 0) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [
      ...archive.passedComputeEvidenceRefs,
      archive.edgeFulfillmentLedger === null
        ? "sdlc_edge_fulfillment_ledger.json"
        : null,
      archive.edgeClosureDecision === null
        ? "sdlc_edge_closure_decision.json"
        : null,
      archive.nextActionProjection === null
        ? "sdlc_next_action_projection.json"
        : null
    ]
      .filter((refOrFileName): refOrFileName is string => refOrFileName !== null)
      .map((refOrFileName) =>
        refOrFileName.startsWith("file:")
          ? refOrFileName
          : archiveFileRef({
              archiveRoot: archive.archiveRoot,
              fileName: refOrFileName
            })
      )
  );
}

function missingTraversalConsequenceArtifactRefs(
  archive: SdlcWorkspaceGapsArchiveReadModel
): readonly string[] {
  const missing: string[] = [];
  if (archive.edgeFulfillmentLedger === null) {
    missing.push("sdlc_edge_fulfillment_ledger.json");
  }
  if (archive.edgeClosureDecision === null) {
    missing.push("sdlc_edge_closure_decision.json");
  }
  if (archive.nextActionProjection === null) {
    missing.push("sdlc_next_action_projection.json");
  }
  return Object.freeze(
    missing.map((fileName) =>
      archiveFileRef({
        archiveRoot: archive.archiveRoot,
        fileName
      })
    )
  );
}

function graphFunctionByBoundaryRef(input: {
  readonly module: ReturnType<typeof constructSdlcGtlModule>;
  readonly graphFunctionRef: string;
}): ReturnType<typeof constructSdlcGtlModule>["graphFunctions"][number] | null {
  return (
    input.module.graphFunctions.find(
      (graphFunction) =>
        graphFunction.name === input.graphFunctionRef ||
        graphFunction.id === input.graphFunctionRef
    ) ?? null
  );
}

function graphVectorBoundaryRefAdmitted(input: {
  readonly graphFunction: ReturnType<typeof constructSdlcGtlModule>["graphFunctions"][number];
  readonly graphVectorRef: string;
}): boolean {
  return materializeGraphFunction(input.graphFunction).vectors.some(
    (vector) =>
      vector.name === input.graphVectorRef ||
      vector.id === input.graphVectorRef
  );
}

function nextActionProjectionArchiveDiagnosticCode(input: {
  readonly archiveRoot: string;
  readonly module: ReturnType<typeof constructSdlcGtlModule>;
}): SdlcWorkspaceGapArchiveDiagnostic["code"] | null {
  const record = jsonRecordFromFile(
    path.join(input.archiveRoot, "sdlc_next_action_projection.json")
  );
  if (record?.["kind"] !== "sdlc_next_action_projection") {
    return null;
  }
  if (record["choosesNextTraversal"] !== true) {
    return null;
  }
  const nextGraphFunctionRef = stringField(record, "nextGraphFunctionRef");
  const nextGraphVectorRef = stringField(record, "nextGraphVectorRef");
  if (nextGraphFunctionRef === null) {
    return null;
  }
  if (nextGraphFunctionRef.startsWith("graph-function:")) {
    return "legacy_graph_function_boundary_ref";
  }
  const graphFunction = graphFunctionByBoundaryRef({
    module: input.module,
    graphFunctionRef: nextGraphFunctionRef
  });
  if (graphFunction === null) {
    return "unknown_graph_function_boundary_ref";
  }
  if (nextGraphVectorRef === null) {
    return "next_action_projection_graph_vector_missing";
  }
  if (nextGraphVectorRef.startsWith("graph-vector:")) {
    return "legacy_graph_vector_boundary_ref";
  }
  return graphVectorBoundaryRefAdmitted({
    graphFunction,
    graphVectorRef: nextGraphVectorRef
  })
    ? null
    : "unknown_graph_vector_boundary_ref";
}

function nextActionProjectionArchiveDiagnostics(input: {
  readonly archive: SdlcWorkspaceGapsArchiveReadModel;
  readonly module: ReturnType<typeof constructSdlcGtlModule>;
}): readonly SdlcWorkspaceGapArchiveDiagnostic[] {
  const code = nextActionProjectionArchiveDiagnosticCode({
    archiveRoot: input.archive.archiveRoot,
    module: input.module
  });
  return code === null
    ? Object.freeze([])
    : Object.freeze([
        Object.freeze({
          kind: "sdlc_workspace_gap_archive_diagnostic" as const,
          code,
          archiveRef: input.archive.archiveRef,
          evidenceRefs: Object.freeze([
            archiveFileRef({
              archiveRoot: input.archive.archiveRoot,
              fileName: "sdlc_next_action_projection.json"
            })
          ])
        })
      ]);
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
      if (!isPlainRecord(assessment)) {
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

function requirementFulfillmentForGaps(input: {
  readonly context: OddSdlcWorkspaceApiContext;
  readonly module: ReturnType<typeof constructSdlcGtlModule>;
  readonly sourceProjection: SdlcRequirementFulfillmentPublicProjection;
}): {
  readonly projection: SdlcRequirementFulfillmentPublicProjection;
  readonly archiveDiagnostics: readonly SdlcWorkspaceGapArchiveDiagnostic[];
} {
  const archiveRoots = operatorRunArchiveRootsNewestFirst(input.context);
  if (archiveRoots.length === 0) {
    return Object.freeze({
      projection: withSdlcRequirementFulfillmentArchiveRehydration({
        projection: input.sourceProjection,
        archiveRehydration: constructSdlcRequirementFulfillmentArchiveRehydration({
          status: "no_operator_runs"
        })
      }),
      archiveDiagnostics: Object.freeze([])
    });
  }
  const archiveDiagnostics: SdlcWorkspaceGapArchiveDiagnostic[] = [];
  const scannedArchiveRefs = Object.freeze(archiveRoots.map(archiveRefForRoot));
  const missingArtifactRefs: string[] = [];
  for (const archiveRoot of archiveRoots) {
    const archive = operatorRunArchiveReadModel(archiveRoot);
    const missingBindOutcomeRefs =
      missingBindOutcomeAfterPassedComputeRefs(archive);
    if (missingBindOutcomeRefs.length > 0) {
      missingArtifactRefs.push(...missingBindOutcomeRefs);
      archiveDiagnostics.push(
        Object.freeze({
          kind: "sdlc_workspace_gap_archive_diagnostic" as const,
          code: "missing_bind_outcome_after_passed_compute" as const,
          archiveRef: archive.archiveRef,
          evidenceRefs: missingBindOutcomeRefs
        })
      );
      continue;
    }
    if (
      archive.edgeFulfillmentLedger === null ||
      archive.edgeClosureDecision === null ||
      archive.nextActionProjection === null
    ) {
      const missingTraversalRefs =
        missingTraversalConsequenceArtifactRefs(archive);
      missingArtifactRefs.push(...missingTraversalRefs);
      archiveDiagnostics.push(
        Object.freeze({
          kind: "sdlc_workspace_gap_archive_diagnostic" as const,
          code: "traversal_consequence_artifacts_missing" as const,
          archiveRef: archive.archiveRef,
          evidenceRefs: missingTraversalRefs
        })
      );
      continue;
    }
    const nextActionDiagnostics = nextActionProjectionArchiveDiagnostics({
      archive,
      module: input.module
    });
    if (nextActionDiagnostics.length > 0) {
      missingArtifactRefs.push(
        ...nextActionDiagnostics.flatMap((diagnostic) => diagnostic.evidenceRefs)
      );
      archiveDiagnostics.push(...nextActionDiagnostics);
      continue;
    }
    return Object.freeze({
      projection: projectSdlcRequirementFulfillmentPublicViewFromPriorProjection({
        sourceProjection: input.sourceProjection,
        assessments: archive.assessments,
        edgeFulfillmentLedger: archive.edgeFulfillmentLedger,
        edgeClosureDecision: archive.edgeClosureDecision,
        nextActionProjection: archive.nextActionProjection,
        sourceRegisterRef: `requirement-fulfillment-public://odd-sdlc/${encodeURIComponent(archiveRoot)}`,
        archiveRehydration: constructSdlcRequirementFulfillmentArchiveRehydration({
          status: "rehydrated",
          archiveRef: archive.archiveRef,
          scannedArchiveRefs,
          missingArtifactRefs
        })
      }),
      archiveDiagnostics: Object.freeze([...archiveDiagnostics])
    });
  }
  return Object.freeze({
    projection: withSdlcRequirementFulfillmentArchiveRehydration({
      projection: input.sourceProjection,
      archiveRehydration: constructSdlcRequirementFulfillmentArchiveRehydration({
        status: "no_archive_with_consequence_triple",
        scannedArchiveRefs,
        missingArtifactRefs
      })
    }),
    archiveDiagnostics: Object.freeze([...archiveDiagnostics])
  });
}

function gapsReadModelBasis(input: {
  readonly context: OddSdlcWorkspaceApiContext;
  readonly module: ReturnType<typeof constructSdlcGtlModule>;
}) {
  return admitExecutionBasis({
    startIntent: admitStartIntent({
      scope: {
        kind: "workspace",
        workspaceRoot: input.context.workspaceRoot,
        moduleName: input.module.name
      },
      target: {
        kind: "graph_function",
        handle: "bootstrap_release_self_test"
      },
      until: "blocked"
    }),
    module: input.module,
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: "worker://odd-sdlc/typescript/read-model",
      backendId: "backend://node",
      buildId: "build://odd-sdlc/typescript/read-model",
      resolvedRuntimeRef: "runtime://abiogenesis/typescript"
    }),
    resolvedPolicy: admitResolvedPolicyIdentity({
      resolvedPolicyBundleRef: "policy://odd-sdlc/workspace-gaps/read-model",
      defaultRegime: "F_P",
      dispatchRef: "dispatch://odd-sdlc/workspace-gaps/read-model",
      approvalSubjectRef: null
    }),
    runId: "run://odd-sdlc/workspace-gaps/read-model",
    workKey: "wk://odd-sdlc/workspace-gaps/read-model",
    frameId: null,
    frameLineageId: null
  });
}

export function projectOddSdlcWorkspaceTickets(input: {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
}): ReturnType<typeof projectSdlcQueryDomain>["ticketWorkflow"] {
  return queryDomainFor(
    workspaceContext(
      admitWorkspaceProjectionInput(input, "OddSdlcWorkspaceTicketsInput")
    )
  ).ticketWorkflow;
}

export function projectOddSdlcWorkspaceQueryDomain(input: {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
}): ReturnType<typeof projectSdlcQueryDomain> {
  return queryDomainFor(
    workspaceContext(
      admitWorkspaceProjectionInput(input, "OddSdlcWorkspaceQueryDomainInput")
    )
  );
}

export function projectOddSdlcWorkspaceGaps(input: {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
}): {
  readonly dossier: ReturnType<typeof deriveSdlcGapDossier>;
  readonly archiveDiagnostics: readonly SdlcWorkspaceGapArchiveDiagnostic[];
  readonly requirementFulfillment: SdlcRequirementFulfillmentPublicProjection;
} {
  const context = workspaceContext(
    admitWorkspaceProjectionInput(input, "OddSdlcWorkspaceGapsInput")
  );
  const module = constructSdlcGtlModule();
  assertCurrentSdlcGtlProgramConformance();
  const queryDomain = projectSdlcQueryDomain({
    module,
    ingressReport: context.ingressReport,
    projectConformance: context.conformanceReport
  });
  const requirementFulfillment = requirementFulfillmentForGaps({
    context,
    module,
    sourceProjection: queryDomain.requirementFulfillment
  });
  const dossier = deriveSdlcGapDossier({
    basis: gapsReadModelBasis({ context, module }),
    events: Object.freeze([]),
    triageInput: "workspace_api:gaps_read_model",
    evidenceRefs: ["workspace-api://odd-sdlc/gaps-read-model"],
    requirementFulfillment: requirementFulfillment.projection,
    domainDefaults: queryDomain.domainDefaults
  });
  return Object.freeze({
    dossier,
    archiveDiagnostics: requirementFulfillment.archiveDiagnostics,
    requirementFulfillment: requirementFulfillment.projection
  });
}

export function admitOddSdlcWorkspaceTicket(input: {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
  readonly ticketId: string;
}): ReturnType<typeof admitSdlcTicketExecutionContract> {
  const admitted = admitWorkspaceTicketInput(input);
  return admitSdlcTicketExecutionContract({
    workflow: projectOddSdlcWorkspaceTickets({
      workspaceRoot: admitted.workspaceRoot,
      outputWorkspaceRoot: admitted.outputWorkspaceRoot
    }),
    ticketId: admitted.ticketId
  });
}
