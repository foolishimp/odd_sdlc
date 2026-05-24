import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SDLC_FUNCTION_CATALOG,
  type SdlcWorkCategoryGovernanceCategory
} from "../graph/index.js";

export type { SdlcWorkCategoryGovernanceCategory };

export type SdlcWorkCategoryGovernanceSelectionSource =
  | "graph_function_catalog"
  | "target_asset_catalog_fallback";

export interface SdlcWorkCategoryGovernanceSelection {
  readonly kind: "sdlc_work_category_governance_selection";
  readonly category: SdlcWorkCategoryGovernanceCategory;
  readonly configRef: string;
  readonly workerPath: string;
  readonly selectionSource: SdlcWorkCategoryGovernanceSelectionSource;
  readonly edgeName: string;
  readonly targetAssetType: string;
}

const SDLC_WORK_CATEGORY_GOVERNANCE_CATEGORIES = Object.freeze([
  "requirements_build",
  "design_build",
  "coding_build",
  "uat_test_case_build",
  "unit_test_build"
] as const satisfies readonly SdlcWorkCategoryGovernanceCategory[]);

const TARGET_ASSET_GOVERNANCE_CATEGORY = Object.freeze(
  new Map<string, SdlcWorkCategoryGovernanceCategory>([
    ["intent_surface", "requirements_build"],
    ["product_surface", "requirements_build"],
    ["goal_surface", "requirements_build"],
    ["requirement_surface", "requirements_build"],
    ["repricing_proposal_surface", "requirements_build"],
    ["uat_testcases_surface", "uat_test_case_build"],
    ["testcase_authority_surface", "uat_test_case_build"],
    ["component_test_surface", "unit_test_build"],
    ["test_design_surface", "unit_test_build"],
    ["test_execution_surface", "unit_test_build"],
    ["test_execution_result_surface", "unit_test_build"],
    ["component_test_qualification_surface", "unit_test_build"],
    ["component_repair_schedule_surface", "unit_test_build"],
    ["test_run_archive_surface", "unit_test_build"],
    ["release_depth_parity_surface", "unit_test_build"],
    ["runtime_observation_surface", "unit_test_build"],
    ["component_code_surface", "coding_build"],
    ["component_realization_qualification_surface", "coding_build"],
    ["code_surface", "coding_build"],
    ["build_execution_surface", "coding_build"],
    ["build_execution_result_surface", "coding_build"],
    ["deployment_surface", "coding_build"],
    ["deployment_result_surface", "coding_build"],
    ["deployed_environment_surface", "coding_build"],
    ["feature_decomp_surface", "design_build"],
    ["design_surface", "design_build"],
    ["scenario_surface", "design_build"],
    ["implementation_design_surface", "design_build"],
    ["release_surface", "design_build"],
    ["retrofit_plan_surface", "design_build"],
    ["gap_observation_surface", "design_build"],
    ["gap_triage_surface", "design_build"],
    ["gap_route_surface", "design_build"],
    ["ticket_work_item_route_surface", "design_build"],
    ["gap_retirement_surface", "design_build"]
  ])
);

export function sdlcWorkCategoryGovernanceCategories(): readonly SdlcWorkCategoryGovernanceCategory[] {
  return SDLC_WORK_CATEGORY_GOVERNANCE_CATEGORIES;
}

export function sdlcWorkCategoryGovernanceConfigRef(
  category: SdlcWorkCategoryGovernanceCategory
): string {
  return `config://odd-sdlc/work-category-governance/${category}/v1`;
}

export function sdlcWorkCategoryGovernanceConfigPath(
  category: SdlcWorkCategoryGovernanceCategory
): string {
  return join(
    resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.."),
    "config",
    "work-category-governance",
    `${category}.md`
  );
}

export function sdlcWorkCategoryGovernanceWorkerPath(
  category: SdlcWorkCategoryGovernanceCategory
): string {
  return `node_modules/@odd-sdlc/typescript-tenant/config/work-category-governance/${category}.md`;
}

export function sdlcWorkCategoryGovernanceText(
  category: SdlcWorkCategoryGovernanceCategory
): string {
  return readFileSync(sdlcWorkCategoryGovernanceConfigPath(category), "utf8").trimEnd();
}

export function sdlcWorkCategoryForManifest(input: {
  readonly edgeName: string;
  readonly targetAssetType: string;
}): SdlcWorkCategoryGovernanceCategory {
  return selectSdlcWorkCategoryGovernance(input).category;
}

export function selectSdlcWorkCategoryGovernance(input: {
  readonly edgeName: string;
  readonly targetAssetType: string;
}): SdlcWorkCategoryGovernanceSelection {
  const catalogEntry =
    SDLC_FUNCTION_CATALOG.find((entry) => entry.name === input.edgeName) ?? null;
  const category =
    catalogEntry?.workCategoryGovernanceCategory ??
    TARGET_ASSET_GOVERNANCE_CATEGORY.get(input.targetAssetType) ??
    "design_build";
  const selectionSource: SdlcWorkCategoryGovernanceSelectionSource =
    catalogEntry === null
      ? "target_asset_catalog_fallback"
      : "graph_function_catalog";
  return Object.freeze({
    kind: "sdlc_work_category_governance_selection" as const,
    category,
    configRef: sdlcWorkCategoryGovernanceConfigRef(category),
    workerPath: sdlcWorkCategoryGovernanceWorkerPath(category),
    selectionSource,
    edgeName: input.edgeName,
    targetAssetType: input.targetAssetType
  });
}

