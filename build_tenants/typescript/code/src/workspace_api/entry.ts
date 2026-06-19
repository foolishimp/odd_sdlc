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
import { constructSdlcGtlModule } from "../graph/index.js";
import { assertCurrentSdlcGtlProgramConformance } from "../gtl_conformance/index.js";
import { projectSdlcQueryDomain } from "../projection/index.js";
import { parseClosedRecord, parseNonEmptyString } from "../shared/validation.js";
import { admitSdlcTicketExecutionContract } from "../tickets/index.js";
import {
  deriveSdlcConformProjectReportFromWorkspace,
  deriveSdlcConformProjectReportFromWorkspaces,
  deriveSdlcProjectConstraintsFromWorkspace,
  deriveSdlcSourceInput,
  deriveSdlcWorkspaceIngressReport,
  type SdlcConformProjectReport,
  type SdlcProjectConstraints,
  type SdlcSourceInput,
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
  readonly conformanceReport: SdlcConformProjectReport;
}

const DEFAULT_SOURCE_PATHS = Object.freeze([
  "README.md",
  "specification/GOALS.md",
  "specification/INTENT.md",
  "specification/PRODUCT.md",
  "specification/REQUIREMENTS.md",
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
    sourceInputs: readSourceInputs(root)
  });
  return Object.freeze({
    workspaceRoot: root,
    outputWorkspaceRoot: outputRoot,
    ingressReport,
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

export function admitOddSdlcWorkspaceTicket(input: {
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
  readonly ticketId: string;
}): ReturnType<typeof admitSdlcTicketExecutionContract> {
  const admitted = admitWorkspaceTicketInput(input);
  return admitSdlcTicketExecutionContract({
    workflow: projectOddSdlcWorkspaceTickets(admitted),
    ticketId: admitted.ticketId
  });
}
