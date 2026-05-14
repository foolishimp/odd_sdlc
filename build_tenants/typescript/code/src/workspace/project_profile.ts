// Implements: REQ-F-ODDSDLC-026
// Implements: REQ-F-ODDSDLC-027
// Implements: REQ-F-ODDSDLC-028
// Implements: REQ-F-ODDSDLC-032
// Implements: REQ-F-ODDSDLC-053

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { FG_CONFORM_PROJECT } from "../graph/library.js";
import {
  parseClosedRecord,
  parseEnumValue,
  parseKind,
  parseNonEmptyString,
  parseString,
  parseStringList
} from "../shared/validation.js";
import {
  SDLC_REALIZATION_MODE_VALUES,
  type SdlcCapabilityContract,
  type SdlcConformProjectProfile,
  type SdlcConformProjectReport,
  type SdlcManagedTraversalLedger,
  type SdlcManagedTraversalManifest,
  type SdlcManagedTraversalPhase,
  type SdlcManagedTraversalPhaseContract,
  type SdlcManagedTraversalPhaseVerdict,
  type SdlcProjectConstraints,
  type SdlcRealizationMode
} from "./carriers.js";
import {
  admitSdlcRuntimeLayout,
  standardSdlcRuntimeLayout
} from "./runtime_layout.js";
import { isPlaceholderRequirementMarker } from "./source_input.js";

const PROJECT_CONSTRAINTS_RELATIVE_PATH =
  ".ai-workspace/context/project_constraints.yml" as const;
const INTENT_RELATIVE_PATH = "specification/INTENT.md" as const;
const PRODUCT_RELATIVE_PATH = "specification/PRODUCT.md" as const;
const GOALS_RELATIVE_PATH = "specification/GOALS.md" as const;
const REQUIREMENTS_DIR_RELATIVE_PATH = "specification/requirements" as const;
const IMPORTED_SOURCES_RELATIVE_PATH =
  "specification/requirements/00-imported-sources.md" as const;
const PROJECT_BOOTSTRAP_RELATIVE_PATH =
  ".ai-workspace/context/project_bootstrap.md" as const;
const TENANT_REGISTRY_RELATIVE_PATH = "build_tenants/TENANT_REGISTRY.md" as const;
const CONFORM_PROJECT_EXPECTED_OUTPUT_RELATIVE_PATHS = Object.freeze([
  INTENT_RELATIVE_PATH,
  PRODUCT_RELATIVE_PATH,
  GOALS_RELATIVE_PATH,
  IMPORTED_SOURCES_RELATIVE_PATH,
  PROJECT_BOOTSTRAP_RELATIVE_PATH,
  PROJECT_CONSTRAINTS_RELATIVE_PATH,
  TENANT_REGISTRY_RELATIVE_PATH
] as const);
const CONFORM_PROJECT_PHASE_CONTRACTS: readonly SdlcManagedTraversalPhaseContract[] =
  Object.freeze([
    Object.freeze({
      kind: "sdlc_managed_traversal_phase_contract",
      phase: "prestep",
      contract: "admit unordered source refs and project constraints before materialization"
    }),
    Object.freeze({
      kind: "sdlc_managed_traversal_phase_contract",
      phase: "execute",
      contract: "materialize intent, product, requirement family, bootstrap, constraints, and tenant registry surfaces"
    }),
    Object.freeze({
      kind: "sdlc_managed_traversal_phase_contract",
      phase: "postprocess",
      contract: "evaluate actual topology against conform project report and expose residual gaps"
    })
  ]);
const IMPORT_SOURCE_EXTENSIONS = Object.freeze([
  ".md",
  ".markdown",
  ".txt",
  ".yml",
  ".yaml"
] as const);
const IMPORT_SOURCE_EXTENSION_SET: ReadonlySet<string> = new Set(
  IMPORT_SOURCE_EXTENSIONS
);
const IMPORT_SOURCE_IGNORED_DIRS = Object.freeze([
  ".abiogenesis",
  ".genesis",
  ".git",
  "build_tenants",
  "node_modules"
] as const);
const REQUIREMENT_MARKER_EXPRESSION =
  /\b(?:RF-[A-Z0-9]+(?:-[A-Z0-9]+)*|REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*)\b(?!-)/g;
const DEFAULT_AMBIGUITY_RISK_APPETITE = "medium" as const;
const UNDECLARED_EXECUTION_CONTRACT = "undeclared" as const;
const SOURCE_EXTENSIONS = Object.freeze([
  ".py",
  ".scala",
  ".java",
  ".kt",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".rs",
  ".go"
] as const);
const BUILD_MARKERS = Object.freeze([
  "build.sbt",
  "pom.xml",
  "pyproject.toml",
  "setup.py",
  "package.json",
  "Cargo.toml",
  "go.mod"
] as const);
const IGNORED_DIR_NAMES = Object.freeze([
  ".ai-workspace",
  ".abiogenesis",
  ".genesis",
  ".git",
  ".venv",
  "__pycache__",
  "dist",
  "node_modules",
  "target",
  "venv"
] as const);

interface MutableTenant {
  readonly name: string;
  readonly values: Record<string, string>;
  readonly lists: Record<string, string[]>;
  readonly capabilityContracts: Record<string, string>;
}

interface ParsedConstraints {
  readonly values: Record<string, string>;
  readonly buildTenants: readonly MutableTenant[];
  readonly designTenants: readonly MutableTenant[];
}

function sha256Text(content: string): string {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
}

function stripScalarQuotes(value: string): string {
  const stripped = value.trim();
  if (stripped.length >= 2) {
    const first = stripped[0];
    const last = stripped[stripped.length - 1];
    if ((first === "\"" || first === "'") && first === last) {
      return stripped.slice(1, -1);
    }
  }
  return stripped;
}

function stripInlineComment(value: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (char === "\"" && !inSingle) {
      inDouble = !inDouble;
    } else if (char === "#" && !inSingle && !inDouble) {
      return value.slice(0, index).trimEnd();
    }
  }
  return value;
}

function normalizedScalar(value: string): string {
  return stripScalarQuotes(stripInlineComment(value)).trim();
}

function canonicalTenantName(value: string): string {
  const normalized = value.trim();
  if (normalized === "spark_scala") {
    return "scala_spark";
  }
  return normalized;
}

function nonEmpty(value: string | undefined, fallback = ""): string {
  return value === undefined || value.trim().length === 0 ? fallback : value.trim();
}

function tenantRoot(activeTenant: string): string {
  return `build_tenants/${activeTenant}`;
}

function normalizeDeclaredOutputRoot(value: string, activeTenant: string): string {
  const normalized = nonEmpty(value, tenantRoot(activeTenant)).replace(/\\/g, "/");
  const trimmed = normalized.replace(/\/+$/u, "");
  return trimmed.length === 0 ? tenantRoot(activeTenant) : trimmed;
}

function canonicalSelectedOutputRoot(value: string, activeTenant: string): string {
  const declared = normalizeDeclaredOutputRoot(value, activeTenant);
  return declared.startsWith("build_tenants/") ? declared : tenantRoot(activeTenant);
}

function newTenant(name: string): MutableTenant {
  return {
    name: canonicalTenantName(name),
    values: {},
    lists: {},
    capabilityContracts: {}
  };
}

function upsertList(record: Record<string, string[]>, key: string, value: string): void {
  const list = record[key] ?? [];
  if (value.length > 0) {
    list.push(value);
  }
  record[key] = list;
}

function parseConstraintsText(content: string): ParsedConstraints {
  const values: Record<string, string> = {};
  const buildTenants = new Map<string, MutableTenant>();
  const designTenants: MutableTenant[] = [];
  let section = "";
  let inDesignTenants = false;
  let currentDesignTenant: MutableTenant | null = null;
  let currentBuildTenant: MutableTenant | null = null;
  let currentNestedKey = "";

  const flushDesignTenant = (): void => {
    if (currentDesignTenant !== null) {
      designTenants.push(currentDesignTenant);
      currentDesignTenant = null;
    }
  };

  for (const rawLine of content.split("\n")) {
    const stripped = rawLine.trim();
    if (stripped.length === 0 || stripped.startsWith("#")) {
      continue;
    }
    const indent = rawLine.length - rawLine.trimStart().length;

    if (indent === 0 && stripped === "project:") {
      flushDesignTenant();
      section = "project";
      inDesignTenants = false;
      currentBuildTenant = null;
      currentNestedKey = "";
      continue;
    }
    if (indent === 0 && stripped === "structure:") {
      flushDesignTenant();
      section = "structure";
      inDesignTenants = false;
      currentBuildTenant = null;
      currentNestedKey = "";
      continue;
    }
    if (indent === 0 && stripped === "constraints:") {
      flushDesignTenant();
      section = "constraints";
      inDesignTenants = false;
      currentBuildTenant = null;
      currentNestedKey = "";
      continue;
    }
    if (indent === 0 && stripped === "build_tenants:") {
      flushDesignTenant();
      section = "build_tenants";
      inDesignTenants = false;
      currentBuildTenant = null;
      currentNestedKey = "";
      continue;
    }
    if (indent === 0 && stripped === "runtime:") {
      flushDesignTenant();
      section = "runtime";
      inDesignTenants = false;
      currentBuildTenant = null;
      currentNestedKey = "";
      continue;
    }

    if (section === "structure" && stripped === "design_tenants:") {
      inDesignTenants = true;
      currentNestedKey = "";
      continue;
    }
    if (section === "structure" && stripped.startsWith("root_code_policy:")) {
      values["root_code_policy"] = normalizedScalar(splitKeyValue(stripped)[1]);
      inDesignTenants = false;
      flushDesignTenant();
      currentNestedKey = "";
      continue;
    }

    if (inDesignTenants && stripped.startsWith("- name:")) {
      flushDesignTenant();
      currentDesignTenant = newTenant(normalizedScalar(splitKeyValue(stripped)[1]));
      currentNestedKey = "";
      continue;
    }
    if (currentDesignTenant !== null && stripped === "capability_contracts:") {
      currentNestedKey = "capability_contracts";
      continue;
    }
    if (
      currentDesignTenant !== null &&
      currentNestedKey === "capability_contracts" &&
      indent >= 6 &&
      stripped.includes(":")
    ) {
      const [key, value] = splitKeyValue(stripped);
      currentDesignTenant.capabilityContracts[key] = normalizedScalar(value);
      continue;
    }
    if (
      currentDesignTenant !== null &&
      (currentNestedKey === "module_structure" || currentNestedKey === "frameworks") &&
      stripped.startsWith("- ")
    ) {
      upsertList(
        currentDesignTenant.lists,
        currentNestedKey,
        normalizedScalar(stripped.slice(2))
      );
      continue;
    }
    if (currentDesignTenant !== null && stripped.includes(":")) {
      const [key, value] = splitKeyValue(stripped);
      const normalized = normalizedScalar(value);
      if (normalized.length > 0) {
        currentDesignTenant.values[key] = normalized;
        currentNestedKey = "";
      } else {
        currentNestedKey = key;
      }
      continue;
    }

    if (section === "build_tenants" && indent === 2 && stripped.endsWith(":")) {
      const tenant = newTenant(stripped.slice(0, -1));
      buildTenants.set(tenant.name, tenant);
      currentBuildTenant = tenant;
      currentNestedKey = "";
      continue;
    }
    if (section === "build_tenants" && currentBuildTenant !== null && indent === 4 && stripped.includes(":")) {
      const [key, value] = splitKeyValue(stripped);
      const normalized = normalizedScalar(value);
      if (normalized.length > 0) {
        currentBuildTenant.values[key] = normalized;
        currentNestedKey = "";
      } else {
        currentNestedKey = key;
        if (key === "module_structure" || key === "frameworks") {
          currentBuildTenant.lists[key] = [];
        }
      }
      continue;
    }
    if (section === "build_tenants" && currentBuildTenant !== null && indent >= 6) {
      if (
        (currentNestedKey === "module_structure" || currentNestedKey === "frameworks") &&
        stripped.startsWith("- ")
      ) {
        upsertList(
          currentBuildTenant.lists,
          currentNestedKey,
          normalizedScalar(stripped.slice(2))
        );
        continue;
      }
      if (currentNestedKey === "capability_contracts" && stripped.includes(":")) {
        const [key, value] = splitKeyValue(stripped);
        currentBuildTenant.capabilityContracts[key] = normalizedScalar(value);
        continue;
      }
    }

    if (section === "runtime" && indent === 2 && stripped.includes(":")) {
      const [key, value] = splitKeyValue(stripped);
      values[`runtime_${key}`] = normalizedScalar(value);
      continue;
    }

    if ((section === "project" || section === "constraints" || indent === 0) && stripped.includes(":")) {
      const [key, value] = splitKeyValue(stripped);
      values[key] = normalizedScalar(value);
    }
  }
  flushDesignTenant();
  return Object.freeze({
    values,
    buildTenants: Object.freeze([...buildTenants.values()]),
    designTenants: Object.freeze(designTenants)
  });
}

function splitKeyValue(value: string): readonly [string, string] {
  const separatorIndex = value.indexOf(":");
  if (separatorIndex < 0) {
    return Object.freeze([value.trim(), ""]);
  }
  return Object.freeze([
    value.slice(0, separatorIndex).trim(),
    value.slice(separatorIndex + 1)
  ]);
}

function selectTenant(input: ParsedConstraints): MutableTenant {
  const tenantPool =
    input.buildTenants.length > 0 ? input.buildTenants : input.designTenants;
  const active = canonicalTenantName(
    nonEmpty(input.values["active_tenant"], nonEmpty(input.values["tenant_name"], ""))
  );
  const selected =
    tenantPool.find((tenant) => tenant.name === active) ?? tenantPool[0];
  if (selected !== undefined) {
    return selected;
  }
  return newTenant(nonEmpty(active, "typescript"));
}

function stringFrom(
  tenant: MutableTenant,
  values: Record<string, string>,
  tenantKey: string,
  valueKey = tenantKey
): string {
  return nonEmpty(tenant.values[tenantKey], nonEmpty(values[valueKey], ""));
}

function moduleStructureFor(tenant: MutableTenant, values: Record<string, string>): string {
  const tenantModules = tenant.lists["module_structure"];
  if (tenantModules !== undefined && tenantModules.length > 0) {
    return `(${tenantModules.join(", ")})`;
  }
  return nonEmpty(
    tenant.values["module_structure"],
    nonEmpty(values["module_structure"], nonEmpty(values["tenant_module_structure"], ""))
  );
}

export function declaredModuleNamesFromStructure(moduleStructure: string): readonly string[] {
  const raw = moduleStructure.trim();
  const bracketed =
    raw.includes("(") && raw.includes(")")
      ? raw.slice(raw.indexOf("(") + 1, raw.lastIndexOf(")"))
      : raw;
  const modules = bracketed
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  return Object.freeze(modules.length > 0 ? modules : ["app-core"]);
}

function normalizeExecutionContractDeclaration(value: string): string {
  const normalized = normalizedScalar(value);
  return normalized.length > 0 ? normalized : UNDECLARED_EXECUTION_CONTRACT;
}

function truthyCapability(
  capabilities: readonly SdlcCapabilityContract[],
  name: string
): boolean {
  const capability = capabilities.find((item) => item.name === name);
  const normalized = capability?.value.trim().toLowerCase() ?? "";
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function capabilityContractsFor(tenant: MutableTenant): readonly SdlcCapabilityContract[] {
  return Object.freeze(
    Object.entries(tenant.capabilityContracts)
      .filter(([name, value]) => name.trim().length > 0 && value.trim().length > 0)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, value]) =>
        Object.freeze({
          kind: "sdlc_capability_contract" as const,
          name,
          value
        })
      )
  );
}

function inferExecutionContracts(input: {
  readonly activeTenant: string;
  readonly language: string;
  readonly tool: string;
  readonly testRunner: string;
  readonly capabilityContracts: readonly SdlcCapabilityContract[];
  readonly buildExecutionContract: string;
  readonly testExecutionContract: string;
  readonly deploymentContract: string;
  readonly runtimeObservationContract: string;
  readonly sourceText: string;
}): {
  readonly buildExecutionContract: string;
  readonly testExecutionContract: string;
  readonly deploymentContract: string;
  readonly runtimeObservationContract: string;
} {
  let buildExecutionContract = normalizeExecutionContractDeclaration(
    input.buildExecutionContract
  );
  let testExecutionContract = normalizeExecutionContractDeclaration(
    input.testExecutionContract
  );
  let deploymentContract = normalizeExecutionContractDeclaration(
    input.deploymentContract
  );
  let runtimeObservationContract = normalizeExecutionContractDeclaration(
    input.runtimeObservationContract
  );
  const language = input.language.trim().toLowerCase();
  const tool = input.tool.trim().toLowerCase();
  const activeTenant = input.activeTenant.trim().toLowerCase();
  const sourceLower = input.sourceText.toLowerCase();
  const scalaExecutionSignal =
    tool === "sbt" ||
    language === "scala" ||
    (activeTenant === "scala_spark" &&
      (truthyCapability(input.capabilityContracts, "fat_jar") ||
        truthyCapability(input.capabilityContracts, "spark_session") ||
        truthyCapability(input.capabilityContracts, "spark_submit_compatible")));

  if (buildExecutionContract === UNDECLARED_EXECUTION_CONTRACT) {
    if (scalaExecutionSignal) {
      buildExecutionContract = truthyCapability(input.capabilityContracts, "fat_jar")
        ? "sbt clean assembly"
        : "sbt compile";
    } else if (tool === "dbt" || activeTenant === "dbt") {
      buildExecutionContract = "dbt compile";
    } else if (tool === "npm" || tool === "pnpm" || tool === "yarn") {
      buildExecutionContract = `${tool} run build`;
    } else if (tool === "maven" || tool === "mvn") {
      buildExecutionContract = "mvn package";
    } else if (tool === "gradle") {
      buildExecutionContract = "gradle build";
    } else if (language === "python") {
      buildExecutionContract = "python -m build";
    }
  }

  if (testExecutionContract === UNDECLARED_EXECUTION_CONTRACT) {
    const testRunner = normalizeExecutionContractDeclaration(input.testRunner);
    if (testRunner !== UNDECLARED_EXECUTION_CONTRACT) {
      testExecutionContract = testRunner;
    } else if (tool === "dbt" || activeTenant === "dbt") {
      testExecutionContract = "dbt test";
    } else if (scalaExecutionSignal) {
      testExecutionContract = "sbt test";
    } else if (tool === "npm" || tool === "pnpm" || tool === "yarn") {
      testExecutionContract = `${tool} test`;
    } else if (language === "python") {
      testExecutionContract = "pytest";
    }
  }

  if (deploymentContract === UNDECLARED_EXECUTION_CONTRACT) {
    if (truthyCapability(input.capabilityContracts, "spark_submit_compatible")) {
      deploymentContract = "spark-submit";
    } else if (tool === "dbt" || activeTenant === "dbt") {
      deploymentContract = "dbt run";
    }
  }

  if (runtimeObservationContract === UNDECLARED_EXECUTION_CONTRACT) {
    if (sourceLower.includes("openlineage")) {
      runtimeObservationContract = "OpenLineage";
    } else if (truthyCapability(input.capabilityContracts, "ledger_json")) {
      runtimeObservationContract = "ledger.json";
    }
  }

  return Object.freeze({
    buildExecutionContract,
    testExecutionContract,
    deploymentContract,
    runtimeObservationContract
  });
}

function realizationModeFor(workspaceRoot: string, selectedOutputRoot: string, hasConstraints: boolean): {
  readonly realizationMode: SdlcRealizationMode;
  readonly resolutionReason: string;
} {
  if (!hasConstraints) {
    return Object.freeze({
      realizationMode: "generated_proving_subset",
      resolutionReason: "constraints_missing_default_profile"
    });
  }
  const absoluteRoot = path.join(workspaceRoot, selectedOutputRoot);
  if (realizationRootHasSignal(absoluteRoot)) {
    return Object.freeze({
      realizationMode: "selected_output_tree",
      resolutionReason: "selected_tenant_root"
    });
  }
  return Object.freeze({
    realizationMode: "planned_output_tree",
    resolutionReason: "selected_tenant_root_planned"
  });
}

function realizationRootHasSignal(root: string): boolean {
  if (!existsSync(root)) {
    return false;
  }
  const stat = statSync(root);
  if (!stat.isDirectory()) {
    return false;
  }
  if (BUILD_MARKERS.some((marker) => existsSync(path.join(root, marker)))) {
    return true;
  }
  return countSourceFiles(root, 4) > 0;
}

function runtimeLayoutFromValues(values: Record<string, string>) {
  const standard = standardSdlcRuntimeLayout();
  return admitSdlcRuntimeLayout({
    kind: "sdlc_runtime_layout",
    runtimeRoot: nonEmpty(values["runtime_root"], standard.runtimeRoot),
    transformAssetRoot: nonEmpty(
      values["runtime_transform_asset_root"],
      standard.transformAssetRoot
    ),
    operatorRunRoot: nonEmpty(values["runtime_operator_run_root"], standard.operatorRunRoot),
    productMaterializationRootPolicy: nonEmpty(
      values["runtime_product_materialization_root_policy"],
      standard.productMaterializationRootPolicy
    )
  });
}

function countSourceFiles(root: string, limit: number): number {
  let count = 0;
  const ignored = new Set<string>(IGNORED_DIR_NAMES);
  const visit = (current: string): void => {
    if (count >= limit) {
      return;
    }
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (count >= limit) {
        return;
      }
      if (entry.isDirectory()) {
        if (!ignored.has(entry.name)) {
          visit(path.join(current, entry.name));
        }
      } else if (SOURCE_EXTENSIONS.some((extension) => extension === path.extname(entry.name))) {
        count += 1;
      }
    }
  };
  visit(root);
  return count;
}

export function conformProjectProfileFromConstraintsText(input: {
  readonly workspaceRoot: string;
  readonly constraintsText: string;
}): SdlcConformProjectProfile {
  const parsed = parseConstraintsText(input.constraintsText);
  const tenant = selectTenant(parsed);
  const activeTenant = canonicalTenantName(nonEmpty(tenant.name, "typescript"));
  const explicitSelectedOutputRoot = nonEmpty(parsed.values["selected_output_root"], "");
  const declaredTenantOutputRoot = nonEmpty(tenant.values["output_dir"], "");
  const selectedOutputRoot = explicitSelectedOutputRoot.length > 0
    ? normalizeDeclaredOutputRoot(explicitSelectedOutputRoot, activeTenant)
    : canonicalSelectedOutputRoot(declaredTenantOutputRoot, activeTenant);
  const declaredOutputRoot = normalizeDeclaredOutputRoot(
    nonEmpty(declaredTenantOutputRoot, selectedOutputRoot),
    activeTenant
  );
  const ambiguityRiskAppetite = normalizeRiskAppetite(
    nonEmpty(parsed.values["ambiguity_risk_appetite"], DEFAULT_AMBIGUITY_RISK_APPETITE)
  );
  const moduleStructure = moduleStructureFor(tenant, parsed.values);
  const capabilityContracts = capabilityContractsFor(tenant);
  const language = stringFrom(tenant, parsed.values, "language");
  const tool = stringFrom(tenant, parsed.values, "build_tool", "tool");
  const testRunner = stringFrom(tenant, parsed.values, "test_runner");
  const executionContracts = inferExecutionContracts({
    activeTenant,
    language,
    tool,
    testRunner,
    capabilityContracts,
    buildExecutionContract: stringFrom(
      tenant,
      parsed.values,
      "build_execution_contract",
      "tenant_build_execution_contract"
    ),
    testExecutionContract: stringFrom(
      tenant,
      parsed.values,
      "test_execution_contract",
      "tenant_test_execution_contract"
    ),
    deploymentContract: stringFrom(
      tenant,
      parsed.values,
      "deployment_contract",
      "tenant_deployment_contract"
    ),
    runtimeObservationContract: stringFrom(
      tenant,
      parsed.values,
      "runtime_observation_contract",
      "tenant_runtime_observation_contract"
    ),
    sourceText: input.constraintsText
  });
  const realization = realizationModeFor(
    input.workspaceRoot,
    selectedOutputRoot,
    input.constraintsText.trim().length > 0
  );
  const runtimeLayout = runtimeLayoutFromValues(parsed.values);
  return Object.freeze({
    kind: "sdlc_conform_project_profile",
    workspaceName: path.basename(input.workspaceRoot),
    projectSlug: projectSlugFromValues(parsed.values, input.workspaceRoot),
    projectKind: nonEmpty(parsed.values["kind"], ""),
    language,
    testRunner,
    tool,
    version: nonEmpty(parsed.values["version"], ""),
    moduleStructure,
    declaredModuleNames: declaredModuleNamesFromStructure(moduleStructure),
    ambiguityRiskAppetite,
    activeTenant,
    selectedOutputRoot,
    declaredOutputRoot,
    runtimeLayout,
    buildExecutionContract: executionContracts.buildExecutionContract,
    testExecutionContract: executionContracts.testExecutionContract,
    deploymentContract: executionContracts.deploymentContract,
    runtimeObservationContract: executionContracts.runtimeObservationContract,
    capabilityContracts,
    rootCodePolicy: nonEmpty(parsed.values["root_code_policy"], ""),
    realizationMode: realization.realizationMode,
    resolutionReason: realization.resolutionReason,
    sourceConstraintDigest: sha256Text(input.constraintsText)
  });
}

function projectSlugFromValues(values: Record<string, string>, workspaceRoot: string): string {
  const rawName = nonEmpty(values["name"], path.basename(workspaceRoot));
  const slug = rawName.replace(/[^a-zA-Z0-9_]+/gu, "_");
  return slug.length === 0 ? "imported_project" : slug;
}

function normalizeRiskAppetite(value: string): "low" | "medium" | "high" {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return DEFAULT_AMBIGUITY_RISK_APPETITE;
}

export function deriveSdlcConformProjectProfileFromWorkspace(
  workspaceRoot: string
): SdlcConformProjectProfile {
  const constraintsPath = path.join(workspaceRoot, PROJECT_CONSTRAINTS_RELATIVE_PATH);
  const constraintsText = existsSync(constraintsPath)
    ? readFileSync(constraintsPath, "utf8")
    : "";
  return conformProjectProfileFromConstraintsText({
    workspaceRoot,
    constraintsText
  });
}

export function projectConstraintsFromConformProjectProfile(
  profile: SdlcConformProjectProfile
): SdlcProjectConstraints {
  return Object.freeze({
    kind: "sdlc_project_constraints",
    projectSlug: profile.projectSlug,
    activeTenant: profile.activeTenant,
    selectedOutputRoot: profile.selectedOutputRoot,
    runtimeLayout: profile.runtimeLayout,
    ambiguityRiskAppetite: profile.ambiguityRiskAppetite,
    capabilityContracts: Object.freeze(
      profile.capabilityContracts.map((contract) => contract.name)
    )
  });
}

export function deriveSdlcConformProjectReportFromWorkspace(
  workspaceRoot: string
): SdlcConformProjectReport {
  return deriveSdlcConformProjectReportFromWorkspaces({
    sourceWorkspaceRoot: workspaceRoot,
    outputWorkspaceRoot: workspaceRoot
  });
}

export function deriveSdlcConformProjectReportFromWorkspaces(input: {
  readonly sourceWorkspaceRoot: string;
  readonly outputWorkspaceRoot: string;
}): SdlcConformProjectReport {
  const sourceWorkspaceRoot = input.sourceWorkspaceRoot;
  const outputWorkspaceRoot = input.outputWorkspaceRoot;
  const profile = deriveSdlcConformProjectProfileFromWorkspace(sourceWorkspaceRoot);
  const topologyRelativePaths = CONFORM_PROJECT_EXPECTED_OUTPUT_RELATIVE_PATHS;
  const importedRelativePaths = importedSourceRelativePaths(sourceWorkspaceRoot);
  const sourceRefs: readonly string[] = Object.freeze(
    [...new Set([
      PROJECT_CONSTRAINTS_RELATIVE_PATH,
      ...importedRelativePaths,
      INTENT_RELATIVE_PATH,
      PRODUCT_RELATIVE_PATH,
      GOALS_RELATIVE_PATH,
      IMPORTED_SOURCES_RELATIVE_PATH
    ])].flatMap((relativePath) => {
      const absolutePath = path.join(sourceWorkspaceRoot, relativePath);
      return existsSync(absolutePath) && statSync(absolutePath).isFile()
        ? [pathToFileURL(absolutePath).href]
        : [];
    })
  );
  const materializedTopologyRefs = Object.freeze(
    topologyRelativePaths.flatMap((relativePath) => {
      const absolutePath = path.join(outputWorkspaceRoot, relativePath);
      return existsSync(absolutePath) && statSync(absolutePath).isFile()
        ? [pathToFileURL(absolutePath).href]
        : [];
    })
  );
  const conformanceGaps: string[] = [];
  if (sourceRefs.length === 0) {
    conformanceGaps.push("project_constraints_missing");
  }
  if (!existsSync(path.join(outputWorkspaceRoot, PROJECT_CONSTRAINTS_RELATIVE_PATH))) {
    conformanceGaps.push("project_constraints_missing");
  }
  if (!existsSync(path.join(outputWorkspaceRoot, INTENT_RELATIVE_PATH))) {
    conformanceGaps.push("intent_surface_missing");
  }
  if (!existsSync(path.join(outputWorkspaceRoot, PRODUCT_RELATIVE_PATH))) {
    conformanceGaps.push("product_surface_missing");
  }
  if (!existsSync(path.join(outputWorkspaceRoot, GOALS_RELATIVE_PATH))) {
    conformanceGaps.push("goals_surface_missing");
  }
  const requirementsRoot = path.join(outputWorkspaceRoot, REQUIREMENTS_DIR_RELATIVE_PATH);
  if (!existsSync(requirementsRoot) || !statSync(requirementsRoot).isDirectory()) {
    conformanceGaps.push("requirements_family_missing");
  }
  if (!existsSync(path.join(outputWorkspaceRoot, IMPORTED_SOURCES_RELATIVE_PATH))) {
    conformanceGaps.push("imported_sources_requirement_missing");
  }
  if (!existsSync(path.join(outputWorkspaceRoot, PROJECT_BOOTSTRAP_RELATIVE_PATH))) {
    conformanceGaps.push("project_bootstrap_missing");
  }
  if (!existsSync(path.join(outputWorkspaceRoot, TENANT_REGISTRY_RELATIVE_PATH))) {
    conformanceGaps.push("tenant_registry_missing");
  }
  if (profile.selectedOutputRoot.startsWith("build_tenants/") === false) {
    conformanceGaps.push("selected_output_root_outside_build_tenants");
  }
  return Object.freeze({
    kind: "sdlc_conform_project_report",
    governingGraphFunction: FG_CONFORM_PROJECT,
    status: conformanceGaps.length === 0 ? "passed" : "blocked",
    workspaceRootUri: pathToFileURL(outputWorkspaceRoot).href,
    sourceRefs,
    materializedTopologyRefs,
    profile,
    conformanceGaps: Object.freeze([...new Set(conformanceGaps)].sort())
  });
}

export function deriveConformProjectManagedTraversalManifest(input: {
  readonly workspaceRoot: string;
  readonly sourceWorkspaceRoot?: string;
}): SdlcManagedTraversalManifest {
  const report = deriveSdlcConformProjectReportFromWorkspaces({
    sourceWorkspaceRoot: input.sourceWorkspaceRoot ?? input.workspaceRoot,
    outputWorkspaceRoot: input.workspaceRoot
  });
  return Object.freeze({
    kind: "sdlc_managed_traversal_manifest",
    graphFunctionName: FG_CONFORM_PROJECT,
    sourceType: "unordered_source_set",
    targetType: "constitutional_bootstrap",
    workspaceRootUri: pathToFileURL(input.workspaceRoot).href,
    sourceRefs: Object.freeze([...report.sourceRefs]),
    expectedOutputRelativePaths: Object.freeze([
      ...CONFORM_PROJECT_EXPECTED_OUTPUT_RELATIVE_PATHS
    ]),
    phaseContracts: Object.freeze([...CONFORM_PROJECT_PHASE_CONTRACTS])
  });
}

function existingOutputRefs(input: {
  readonly workspaceRoot: string;
  readonly relativePaths: readonly string[];
}): readonly string[] {
  return Object.freeze(
    input.relativePaths.flatMap((relativePath) => {
      const absolutePath = path.join(input.workspaceRoot, relativePath);
      return existsSync(absolutePath) && statSync(absolutePath).isFile()
        ? [pathToFileURL(absolutePath).href]
        : [];
    })
  );
}

function missingOutputRelativePaths(input: {
  readonly workspaceRoot: string;
  readonly relativePaths: readonly string[];
}): readonly string[] {
  return Object.freeze(
    input.relativePaths.filter((relativePath) => {
      const absolutePath = path.join(input.workspaceRoot, relativePath);
      return !existsSync(absolutePath) || !statSync(absolutePath).isFile();
    })
  );
}

function managedTraversalPhaseVerdict(input: {
  readonly phase: SdlcManagedTraversalPhase;
  readonly evidenceRefs: readonly string[];
  readonly gaps: readonly string[];
}): SdlcManagedTraversalPhaseVerdict {
  return Object.freeze({
    kind: "sdlc_managed_traversal_phase_verdict",
    phase: input.phase,
    status: input.gaps.length === 0 ? "satisfied" : "blocked",
    evidenceRefs: Object.freeze([...input.evidenceRefs]),
    gaps: Object.freeze([...input.gaps])
  });
}

export function deriveConformProjectManagedTraversalLedger(input: {
  readonly workspaceRoot: string;
  readonly manifest: SdlcManagedTraversalManifest;
  readonly report?: SdlcConformProjectReport;
}): SdlcManagedTraversalLedger {
  const report =
    input.report ?? deriveSdlcConformProjectReportFromWorkspace(input.workspaceRoot);
  const missingOutputs = missingOutputRelativePaths({
    workspaceRoot: input.workspaceRoot,
    relativePaths: input.manifest.expectedOutputRelativePaths
  });
  const actualOutputRefs = existingOutputRefs({
    workspaceRoot: input.workspaceRoot,
    relativePaths: input.manifest.expectedOutputRelativePaths
  });
  const phaseVerdicts = Object.freeze([
    managedTraversalPhaseVerdict({
      phase: "prestep",
      evidenceRefs: input.manifest.sourceRefs,
      gaps: input.manifest.sourceRefs.length === 0
        ? Object.freeze(["unordered_source_set_missing"])
        : Object.freeze([])
    }),
    managedTraversalPhaseVerdict({
      phase: "execute",
      evidenceRefs: actualOutputRefs,
      gaps: missingOutputs.map((relativePath) => `missing_output:${relativePath}`)
    }),
    managedTraversalPhaseVerdict({
      phase: "postprocess",
      evidenceRefs: report.materializedTopologyRefs,
      gaps: report.conformanceGaps
    })
  ]);
  const residualGaps = Object.freeze([
    ...new Set(phaseVerdicts.flatMap((verdict) => verdict.gaps))
  ].sort());
  return Object.freeze({
    kind: "sdlc_managed_traversal_ledger",
    graphFunctionName: input.manifest.graphFunctionName,
    sourceType: input.manifest.sourceType,
    targetType: input.manifest.targetType,
    status: residualGaps.length === 0 ? "satisfied" : "blocked",
    workspaceRootUri: input.manifest.workspaceRootUri,
    actualOutputRefs,
    phaseVerdicts,
    residualGaps
  });
}

function ensureParent(filePath: string): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeIfMissing(filePath: string, content: string): boolean {
  if (existsSync(filePath)) {
    return false;
  }
  ensureParent(filePath);
  writeFileSync(filePath, content, "utf8");
  return true;
}

function writeIfChanged(filePath: string, content: string): boolean {
  if (existsSync(filePath) && readFileSync(filePath, "utf8") === content) {
    return false;
  }
  ensureParent(filePath);
  writeFileSync(filePath, content, "utf8");
  return true;
}

function canonicalProjectConstraints(profile: SdlcConformProjectProfile): string {
  return [
    "project:",
    `  name: ${profile.projectSlug}`,
    profile.projectKind.length > 0 ? `  kind: ${profile.projectKind}` : "  kind: imported_workspace",
    `active_tenant: ${profile.activeTenant}`,
    `selected_output_root: ${profile.selectedOutputRoot}`,
    `ambiguity_risk_appetite: ${profile.ambiguityRiskAppetite}`,
    "runtime:",
    `  root: ${profile.runtimeLayout.runtimeRoot}`,
    `  transform_asset_root: ${profile.runtimeLayout.transformAssetRoot}`,
    `  operator_run_root: ${profile.runtimeLayout.operatorRunRoot}`,
    `  product_materialization_root_policy: ${profile.runtimeLayout.productMaterializationRootPolicy}`,
    "build_tenants:",
    `  ${profile.activeTenant}:`,
    `    output_dir: ${profile.selectedOutputRoot}`,
    profile.language.length > 0 ? `    language: ${profile.language}` : "    language: unknown",
    profile.tool.length > 0 ? `    build_tool: ${profile.tool}` : "    build_tool: undeclared",
    profile.testRunner.length > 0 ? `    test_runner: ${profile.testRunner}` : "    test_runner: undeclared",
    "    module_structure:",
    ...profile.declaredModuleNames.map((moduleName) => `      - ${moduleName}`),
    ""
  ].join("\n");
}

function importedSourceRelativePaths(workspaceRoot: string): readonly string[] {
  const ignored = new Set<string>(IMPORT_SOURCE_IGNORED_DIRS);
  const paths: string[] = [];
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
        IMPORT_SOURCE_EXTENSION_SET.has(path.extname(entry.name).toLowerCase()) &&
        relativePath !== IMPORTED_SOURCES_RELATIVE_PATH
      ) {
        paths.push(relativePath);
      }
    }
  };
  visit(workspaceRoot, "");
  return Object.freeze([...new Set(paths)].sort());
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function importedSelectedOutputTargetPaths(input: {
  readonly workspaceRoot: string;
  readonly relativePaths: readonly string[];
  readonly selectedOutputRoot: string;
}): readonly string[] {
  const selectedOutputRoot = input.selectedOutputRoot.replace(/\\/gu, "/").replace(/\/+$/u, "");
  const targetPattern = new RegExp(
    `${escapeRegExp(selectedOutputRoot)}(?:/[A-Za-z0-9._@+=:-]+)+`,
    "gu"
  );
  const targets: string[] = [];
  for (const relativePath of input.relativePaths) {
    const absolutePath = path.join(input.workspaceRoot, relativePath);
    if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
      continue;
    }
    const content = readFileSync(absolutePath, "utf8").replace(/\\/gu, "/");
    for (const match of content.matchAll(targetPattern)) {
      const candidate = match[0]
        ?.replace(/[),.;:]+$/u, "")
        .replace(/\/+$/u, "");
      if (
        candidate !== undefined &&
        candidate.length > selectedOutputRoot.length &&
        candidate !== selectedOutputRoot
      ) {
        targets.push(candidate);
      }
    }
  }
  return Object.freeze([...new Set(targets)].sort());
}

function importedProductAuthorityContent(input: {
  readonly sourceWorkspaceRoot: string;
  readonly relativePaths: readonly string[];
  readonly profile: SdlcConformProjectProfile;
}): string {
  const sourceRefs = input.relativePaths.map((relativePath) =>
    pathToFileURL(path.join(input.sourceWorkspaceRoot, relativePath)).href
  );
  const productFileTargets = importedSelectedOutputTargetPaths({
    workspaceRoot: input.sourceWorkspaceRoot,
    relativePaths: input.relativePaths,
    selectedOutputRoot: input.profile.selectedOutputRoot
  });
  return [
    "# Product",
    "",
    "**Status**: Active",
    "**Derived From**: `Fg_conform_project`",
    "",
    `${input.profile.projectSlug} is an imported project inducted into spec_method topology.`,
    "",
    "Project-owned `WHAT` lives under `specification/`.",
    "Project-owned realization `HOW` lives under `build_tenants/`.",
    "",
    "## Product Definition",
    "",
    `Product name: ${input.profile.projectSlug}`,
    `Active tenant: ${input.profile.activeTenant}`,
    `Selected output root: \`${input.profile.selectedOutputRoot}\``,
    `Build Tool: ${input.profile.tool.length > 0 ? input.profile.tool : "undeclared"}`,
    input.profile.language.length > 0
      ? `Language: ${input.profile.language}`
      : "Language: undeclared",
    "",
    "## Product Files",
    "",
    ...(productFileTargets.length > 0
      ? productFileTargets.map((target) => `- \`${target}\``)
      : ["- none_declared_from_imported_sources"]),
    "",
    "## Source Authority Refs",
    "",
    ...(sourceRefs.length > 0 ? sourceRefs.map((ref) => `- ${ref}`) : ["- none"]),
    ""
  ].join("\n");
}

function requirementMarkersFromImportedSources(input: {
  readonly workspaceRoot: string;
  readonly relativePaths: readonly string[];
}): readonly string[] {
  const markers: string[] = [];
  for (const relativePath of input.relativePaths) {
    const absolutePath = path.join(input.workspaceRoot, relativePath);
    if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
      const content = readFileSync(absolutePath, "utf8");
      for (const match of content.matchAll(REQUIREMENT_MARKER_EXPRESSION)) {
      const marker = match[0];
      if (marker !== undefined && !isPlaceholderRequirementMarker(marker)) {
        markers.push(marker);
      }
      }
    }
  }
  return Object.freeze([...new Set(markers)].sort());
}

function normalizeRequirementMarker(marker: string): string {
  const parts = marker.toUpperCase().split("-");
  const head = parts[0] === "RF" ? "REQ" : parts[0];
  const tail = parts.slice(1).map((part) =>
    /^\d+$/u.test(part) && part.length < 3 ? part.padStart(3, "0") : part
  );
  return [head, ...tail].join("-");
}

function requirementFamilyFromId(requirementId: string): string {
  const parts = requirementId.toLowerCase().split("-");
  const rawFamily =
    parts.length >= 3 && parts[0] === "req" ? (parts[1] ?? "general") : "general";
  const family = rawFamily.replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");
  return family.length === 0 ? "general" : family;
}

function lineSnippetForOffset(content: string, offset: number): string {
  const lineStart = content.lastIndexOf("\n", offset) + 1;
  const nextNewline = content.indexOf("\n", offset);
  const lineEnd = nextNewline < 0 ? content.length : nextNewline;
  return content
    .slice(lineStart, lineEnd)
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, 320);
}

function requirementSnippetForOffset(content: string, offset: number): string {
  const lineStart = content.lastIndexOf("\n", offset) + 1;
  const nextNewline = content.indexOf("\n", offset);
  const lineEnd = nextNewline < 0 ? content.length : nextNewline;
  const line = content.slice(lineStart, lineEnd);
  const heading = /^(#{1,6})\s+.+$/u.exec(line);
  if (heading === null) {
    return lineSnippetForOffset(content, offset);
  }
  const depth = heading[1]?.length ?? 6;
  let sectionEnd = content.length;
  let cursor = nextNewline < 0 ? content.length : nextNewline + 1;
  while (cursor < content.length) {
    const candidateEnd = content.indexOf("\n", cursor);
    const currentEnd = candidateEnd < 0 ? content.length : candidateEnd;
    const candidateLine = content.slice(cursor, currentEnd);
    const candidateHeading = /^(#{1,6})\s+.+$/u.exec(candidateLine);
    if ((candidateHeading?.[1]?.length ?? Number.POSITIVE_INFINITY) <= depth) {
      sectionEnd = cursor;
      break;
    }
    cursor = candidateEnd < 0 ? content.length : candidateEnd + 1;
  }
  return content
    .slice(lineStart, sectionEnd)
    .trim()
    .replace(/\n{3,}/gu, "\n\n")
    .slice(0, 2400);
}

function markerOnlySnippet(snippet: string, marker: string): boolean {
  const normalized = snippet
    .replace(/^#+\s*/u, "")
    .replace(/^[-*]\s*/u, "")
    .replaceAll("`", "")
    .trim();
  return normalized === marker || normalized === normalizeRequirementMarker(marker);
}

function importedRequirementFamilyContents(input: {
  readonly workspaceRoot: string;
  readonly relativePaths: readonly string[];
}): readonly {
  readonly relativePath: string;
  readonly content: string;
}[] {
  const byFamily = new Map<
    string,
    {
      readonly requirementId: string;
      readonly sourceRef: string;
      readonly sourceDigest: string;
      readonly snippet: string;
    }[]
  >();
  for (const relativePath of input.relativePaths) {
    const absolutePath = path.join(input.workspaceRoot, relativePath);
    if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
      continue;
    }
    const content = readFileSync(absolutePath, "utf8");
    const sourceDigest = sha256Text(content);
    const sourceRef = pathToFileURL(absolutePath).href;
    for (const match of content.matchAll(REQUIREMENT_MARKER_EXPRESSION)) {
      const marker = match[0];
      if (
        marker === undefined ||
        isPlaceholderRequirementMarker(marker)
      ) {
        continue;
      }
      const snippet = requirementSnippetForOffset(content, match.index ?? 0);
      if (snippet.length === 0 || markerOnlySnippet(snippet, marker)) {
        continue;
      }
      const requirementId = normalizeRequirementMarker(marker);
      const family = requirementFamilyFromId(requirementId);
      const entries = byFamily.get(family) ?? [];
      entries.push({
        requirementId,
        sourceRef,
        sourceDigest,
        snippet
      });
      byFamily.set(family, entries);
    }
  }
  return Object.freeze(
    [...byFamily.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([family, entries], index) => {
        const uniqueEntries = [
          ...new Map(
            entries
              .sort((left, right) =>
                `${left.requirementId}:${left.sourceRef}:${left.snippet}`.localeCompare(
                  `${right.requirementId}:${right.sourceRef}:${right.snippet}`
                )
              )
              .map((entry) => [
                `${entry.requirementId}:${entry.sourceRef}:${entry.snippet}`,
                entry
              ])
          ).values()
        ];
        const content = [
          `# ${family.toUpperCase()} Requirements`,
          "",
          "**Status**: Active",
          "**Derived From**: `Fg_conform_project`",
          "",
          "This file is a deterministic requirement-family projection from",
          "imported bootstrap authority. It preserves concrete source pressure",
          "for downstream prompt-bearing traversals.",
          "",
          ...uniqueEntries.flatMap((entry) => [
            `## ${entry.requirementId}`,
            "",
            entry.snippet,
            "",
            `Source: ${entry.sourceRef}`,
            `Source Digest: ${entry.sourceDigest}`,
            ""
          ])
        ].join("\n");
        return {
          relativePath:
            `${REQUIREMENTS_DIR_RELATIVE_PATH}/${String(index + 1).padStart(2, "0")}-${family}-requirements.md`,
          content
        };
      })
  );
}

function importedSourcesContent(input: {
  readonly sourceWorkspaceRoot: string;
  readonly before: SdlcConformProjectReport;
}): string {
  const relativePaths = importedSourceRelativePaths(input.sourceWorkspaceRoot);
  const refs = relativePaths.length > 0
    ? relativePaths.map((relativePath) =>
        pathToFileURL(path.join(input.sourceWorkspaceRoot, relativePath)).href
      )
    : input.before.sourceRefs.length > 0
      ? input.before.sourceRefs
      : [pathToFileURL(input.sourceWorkspaceRoot).href];
  const requirementMarkers = requirementMarkersFromImportedSources({
    workspaceRoot: input.sourceWorkspaceRoot,
    relativePaths
  });
  return [
    "# Imported Sources",
    "",
    "**Status**: Active",
    "**Derived From**: `Fg_conform_project`",
    "",
    "This file is the deterministic induction ledger for imported or loose",
    "bootstrap documents admitted before downstream traversal.",
    "",
    "## Source Refs",
    "",
    ...refs.map((ref) => `- ${ref}`),
    "",
    "## Imported Requirement Markers",
    "",
    ...(requirementMarkers.length > 0
      ? requirementMarkers.map((marker) => `- ${marker}`)
      : ["- none_detected"]),
    ""
  ].join("\n");
}

export function materializeSdlcProjectConformance(input: {
  readonly workspaceRoot: string;
  readonly sourceWorkspaceRoot?: string;
}): SdlcConformProjectReport {
  const sourceWorkspaceRoot = input.sourceWorkspaceRoot ?? input.workspaceRoot;
  const before = deriveSdlcConformProjectReportFromWorkspaces({
    sourceWorkspaceRoot,
    outputWorkspaceRoot: input.workspaceRoot
  });
  const profile = before.profile;
  const written: string[] = [];
  const write = (relativePath: string, content: string): void => {
    const absolutePath = path.join(input.workspaceRoot, relativePath);
    if (writeIfMissing(absolutePath, content)) {
      written.push(pathToFileURL(absolutePath).href);
    }
  };
  const writeCanonical = (relativePath: string, content: string): void => {
    const absolutePath = path.join(input.workspaceRoot, relativePath);
    if (writeIfChanged(absolutePath, content)) {
      written.push(pathToFileURL(absolutePath).href);
    }
  };

  mkdirSync(path.join(input.workspaceRoot, REQUIREMENTS_DIR_RELATIVE_PATH), {
    recursive: true
  });
  mkdirSync(path.join(input.workspaceRoot, "build_tenants"), { recursive: true });

  write(INTENT_RELATIVE_PATH, [
    "# Intent",
    "",
    "**Status**: Active",
    "**Derived From**: `Fg_conform_project`",
    "",
    `${profile.projectSlug} exists to transform admitted unordered source documents into governed project surfaces.`,
    "",
    "The current bootstrap target is a conformant constitutional project",
    "surface containing intent, product definition, and requirement-family",
    "authority before downstream traversal opens.",
    ""
  ].join("\n"));

  const importedRelativePaths = importedSourceRelativePaths(sourceWorkspaceRoot);

  write(PRODUCT_RELATIVE_PATH, importedProductAuthorityContent({
    sourceWorkspaceRoot,
    relativePaths: importedRelativePaths,
    profile
  }));

  write(GOALS_RELATIVE_PATH, [
    "# Goals",
    "",
    "**Status**: Active",
    "**Derived From**: `Fg_conform_project`",
    "",
    "- preserve imported authority as governed source truth",
    "- realize the selected tenant under `build_tenants/`",
    "- keep downstream traversal blocked until project conformance passes",
    ""
  ].join("\n"));

  write(IMPORTED_SOURCES_RELATIVE_PATH, importedSourcesContent({
    sourceWorkspaceRoot,
    before
  }));
  for (const familyFile of importedRequirementFamilyContents({
    workspaceRoot: sourceWorkspaceRoot,
    relativePaths: importedRelativePaths
  })) {
    write(familyFile.relativePath, familyFile.content);
  }

  write(PROJECT_BOOTSTRAP_RELATIVE_PATH, [
    "# Project Bootstrap",
    "",
    `project_slug: ${profile.projectSlug}`,
    `active_tenant: ${profile.activeTenant}`,
    `selected_output_root: ${profile.selectedOutputRoot}`,
    `runtime_root: ${profile.runtimeLayout.runtimeRoot}`,
    `runtime_transform_asset_root: ${profile.runtimeLayout.transformAssetRoot}`,
    `runtime_operator_run_root: ${profile.runtimeLayout.operatorRunRoot}`,
    "governing_graph_function: Fg_conform_project",
    "",
    "This is an installed read model. It does not outrank specification truth.",
    ""
  ].join("\n"));

  writeCanonical(PROJECT_CONSTRAINTS_RELATIVE_PATH, canonicalProjectConstraints(profile));

  write(TENANT_REGISTRY_RELATIVE_PATH, [
    "# Tenant Registry",
    "",
    `- tenant: ${profile.activeTenant}`,
    `  root: ${profile.selectedOutputRoot}`,
    `  status: selected`,
    ""
  ].join("\n"));

  const after = deriveSdlcConformProjectReportFromWorkspaces({
    sourceWorkspaceRoot,
    outputWorkspaceRoot: input.workspaceRoot
  });
  return Object.freeze({
    ...after,
    materializedTopologyRefs: Object.freeze([
      ...new Set([...after.materializedTopologyRefs, ...written])
    ].sort())
  });
}

function admitCapabilityContract(
  input: unknown,
  label: string
): SdlcCapabilityContract {
  const record = parseClosedRecord(input, label, ["kind", "name", "value"]);
  parseKind(record["kind"], "sdlc_capability_contract", `${label}.kind`);
  return Object.freeze({
    kind: "sdlc_capability_contract",
    name: parseNonEmptyString(record["name"], `${label}.name`),
    value: parseNonEmptyString(record["value"], `${label}.value`)
  });
}

function parseCapabilityContractList(
  input: unknown,
  label: string
): readonly SdlcCapabilityContract[] {
  if (!Array.isArray(input)) {
    throw new TypeError(`${label}: expected array`);
  }
  return Object.freeze(
    input.map((item, index) => admitCapabilityContract(item, `${label}[${index}]`))
  );
}

export function admitSdlcConformProjectProfile(
  input: unknown,
  label = "SdlcConformProjectProfile"
): SdlcConformProjectProfile {
  const record = parseClosedRecord(input, label, [
    "kind",
    "workspaceName",
    "projectSlug",
    "projectKind",
    "language",
    "testRunner",
    "tool",
    "version",
    "moduleStructure",
    "declaredModuleNames",
    "ambiguityRiskAppetite",
    "activeTenant",
    "selectedOutputRoot",
    "declaredOutputRoot",
    "runtimeLayout",
    "buildExecutionContract",
    "testExecutionContract",
    "deploymentContract",
    "runtimeObservationContract",
    "capabilityContracts",
    "rootCodePolicy",
    "realizationMode",
    "resolutionReason",
    "sourceConstraintDigest"
  ]);
  parseKind(record["kind"], "sdlc_conform_project_profile", `${label}.kind`);
  const selectedOutputRoot = parseNonEmptyString(
    record["selectedOutputRoot"],
    `${label}.selectedOutputRoot`
  );
  if (!selectedOutputRoot.startsWith("build_tenants/")) {
    throw new TypeError(`${label}.selectedOutputRoot: expected build_tenants/*`);
  }
  return Object.freeze({
    kind: "sdlc_conform_project_profile",
    workspaceName: parseNonEmptyString(record["workspaceName"], `${label}.workspaceName`),
    projectSlug: parseNonEmptyString(record["projectSlug"], `${label}.projectSlug`),
    projectKind: parseString(record["projectKind"], `${label}.projectKind`),
    language: parseString(record["language"], `${label}.language`),
    testRunner: parseString(record["testRunner"], `${label}.testRunner`),
    tool: parseString(record["tool"], `${label}.tool`),
    version: parseString(record["version"], `${label}.version`),
    moduleStructure: parseString(record["moduleStructure"], `${label}.moduleStructure`),
    declaredModuleNames: parseStringList(
      record["declaredModuleNames"],
      `${label}.declaredModuleNames`
    ),
    ambiguityRiskAppetite: parseEnumValue(
      record["ambiguityRiskAppetite"],
      `${label}.ambiguityRiskAppetite`,
      ["low", "medium", "high"]
    ),
    activeTenant: parseNonEmptyString(record["activeTenant"], `${label}.activeTenant`),
    selectedOutputRoot,
    declaredOutputRoot: parseNonEmptyString(
      record["declaredOutputRoot"],
      `${label}.declaredOutputRoot`
    ),
    runtimeLayout:
      record["runtimeLayout"] === undefined
        ? standardSdlcRuntimeLayout()
        : admitSdlcRuntimeLayout(record["runtimeLayout"], `${label}.runtimeLayout`),
    buildExecutionContract: parseNonEmptyString(
      record["buildExecutionContract"],
      `${label}.buildExecutionContract`
    ),
    testExecutionContract: parseNonEmptyString(
      record["testExecutionContract"],
      `${label}.testExecutionContract`
    ),
    deploymentContract: parseNonEmptyString(
      record["deploymentContract"],
      `${label}.deploymentContract`
    ),
    runtimeObservationContract: parseNonEmptyString(
      record["runtimeObservationContract"],
      `${label}.runtimeObservationContract`
    ),
    capabilityContracts: parseCapabilityContractList(
      record["capabilityContracts"],
      `${label}.capabilityContracts`
    ),
    rootCodePolicy: parseString(record["rootCodePolicy"], `${label}.rootCodePolicy`),
    realizationMode: parseEnumValue(
      record["realizationMode"],
      `${label}.realizationMode`,
      SDLC_REALIZATION_MODE_VALUES
    ),
    resolutionReason: parseNonEmptyString(
      record["resolutionReason"],
      `${label}.resolutionReason`
    ),
    sourceConstraintDigest: parseNonEmptyString(
      record["sourceConstraintDigest"],
      `${label}.sourceConstraintDigest`
    )
  });
}
