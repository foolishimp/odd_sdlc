// Implements: T-204

import { SDLC_EVALUATE_CONTENT_LEDGER_KIND } from "./plugins/evaluate/content_register.js";

export const SDLC_REGISTER_PURPOSE_CLASSES = Object.freeze([
  "product_evaluate_carrier",
  "product_target_carrier",
  "product_assurance_carrier",
  "product_projection",
  "split_boundary",
  "migration_authority"
] as const);

export type SdlcRegisterPurposeClass =
  (typeof SDLC_REGISTER_PURPOSE_CLASSES)[number];

export interface SdlcRegisterPurposeRow {
  readonly carrierKind: string;
  readonly carrierName: string;
  readonly purposeClass: SdlcRegisterPurposeClass;
  readonly owner: "odd_sdlc" | "abg" | "split";
  readonly authorityUse:
    | "authoritative_product_input"
    | "authoritative_product_interpretation"
    | "abg_admitted_runtime_truth"
    | "non_authoritative_projection"
    | "migration_target";
  readonly sourceModule: string;
  readonly replacementCarrierKind: string | null;
  readonly purpose: string;
}

function row(input: SdlcRegisterPurposeRow): SdlcRegisterPurposeRow {
  return Object.freeze(input);
}

export const SDLC_REGISTER_PURPOSE_CATALOG = Object.freeze([
  row({
    carrierKind: "sdlc_design_depth_register",
    carrierName: "SdlcDesignDepthRegister",
    purposeClass: "product_evaluate_carrier",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_input",
    sourceModule: "operator/carriers.ts",
    replacementCarrierKind: null,
    purpose:
      "evaluate.C/F_P design-depth semantic candidate for implementation design."
  }),
  row({
    carrierKind: "sdlc_review_grade_edge_fulfillment_assessment",
    carrierName: "SdlcReviewGradeEdgeFulfillmentAssessment",
    purposeClass: "product_evaluate_carrier",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_input",
    sourceModule: "operator/carriers.ts",
    replacementCarrierKind: null,
    purpose:
      "evaluate.C/F_P review-grade assessment over generated asset fulfillment."
  }),
  row({
    carrierKind: "sdlc_component_depth_register",
    carrierName: "SdlcComponentDepthRegister",
    purposeClass: "product_target_carrier",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_input",
    sourceModule: "operator/carriers.ts",
    replacementCarrierKind: null,
    purpose:
      "component topology, realization, test allocation, execution mapping, and depth parity carrier."
  }),
  row({
    carrierKind: "sdlc_component_execution_failure_register",
    carrierName: "SdlcComponentExecutionFailureRegister",
    purposeClass: "product_assurance_carrier",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_interpretation",
    sourceModule: "operator/carriers.ts",
    replacementCarrierKind: null,
    purpose:
      "component-test execution failure evidence folded into component-depth assurance."
  }),
  row({
    carrierKind: "sdlc_test_design_register",
    carrierName: "SdlcTestDesignRegister",
    purposeClass: "product_target_carrier",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_input",
    sourceModule: "operator/carriers.ts",
    replacementCarrierKind: null,
    purpose: "test-design target carrier and admission surface."
  }),
  row({
    carrierKind: "sdlc_test_execution_surface_register",
    carrierName: "SdlcTestExecutionSurfaceRegister",
    purposeClass: "product_target_carrier",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_input",
    sourceModule: "operator/carriers.ts",
    replacementCarrierKind: null,
    purpose: "test-execution target carrier and admission surface."
  }),
  row({
    carrierKind: "sdlc_decomposition_trace_register",
    carrierName: "SdlcDecompositionTraceRegister",
    purposeClass: "product_projection",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_interpretation",
    sourceModule: "operator/depth_traversal.ts",
    replacementCarrierKind: null,
    purpose:
      "product decomposition/depth evidence derived from admitted review-grade rows."
  }),
  row({
    carrierKind: "sdlc_lineage_ledger",
    carrierName: "SdlcLineageLedger",
    purposeClass: "product_projection",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_interpretation",
    sourceModule: "projection/requirement_closure.ts",
    replacementCarrierKind: null,
    purpose: "lineage projection over admitted SDLC facts."
  }),
  row({
    carrierKind: "sdlc_requirement_closure_register",
    carrierName: "SdlcRequirementClosureRegister",
    purposeClass: "product_projection",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_interpretation",
    sourceModule: "projection/requirement_closure.ts",
    replacementCarrierKind: null,
    purpose: "requirement closure read model over admitted fulfillment facts."
  }),
  row({
    carrierKind: "sdlc_co_affirmation_ledger",
    carrierName: "SdlcCoAffirmationLedger",
    purposeClass: "product_assurance_carrier",
    owner: "odd_sdlc",
    authorityUse: "authoritative_product_interpretation",
    sourceModule: "operator/carriers.ts",
    replacementCarrierKind: null,
    purpose: "product assurance ledger for co-affirmed evidence."
  }),
  row({
    carrierKind: SDLC_EVALUATE_CONTENT_LEDGER_KIND,
    carrierName: "SdlcEvaluateContentLedger",
    purposeClass: "migration_authority",
    owner: "split",
    authorityUse: "migration_target",
    sourceModule: "operator/plugins/evaluate/content_register.ts",
    replacementCarrierKind: null,
    purpose:
      "target authority carrier for evaluate.C semantic content rows before ABG admission."
  }),
  row({
    carrierKind: "sdlc_edge_fulfillment_ledger",
    carrierName: "SdlcEdgeFulfillmentLedger",
    purposeClass: "split_boundary",
    owner: "split",
    authorityUse: "abg_admitted_runtime_truth",
    sourceModule: "operator/traversal_consequence.ts",
    replacementCarrierKind: null,
    purpose:
      "SDLC edge-fulfillment interpretation whose final runtime authorship belongs to ABG."
  }),
  row({
    carrierKind: "sdlc_edge_closure_decision",
    carrierName: "SdlcEdgeClosureDecision",
    purposeClass: "split_boundary",
    owner: "split",
    authorityUse: "abg_admitted_runtime_truth",
    sourceModule: "operator/traversal_consequence.ts",
    replacementCarrierKind: null,
    purpose:
      "SDLC closure interpretation over admitted edge facts; ABG owns final consequence admission."
  }),
  row({
    carrierKind: "sdlc_next_action_projection",
    carrierName: "SdlcNextActionProjection",
    purposeClass: "split_boundary",
    owner: "split",
    authorityUse: "abg_admitted_runtime_truth",
    sourceModule: "operator/traversal_consequence.ts",
    replacementCarrierKind: null,
    purpose:
      "domain next-action projection over ABG continuation truth, not a product-local router."
  }),
  row({
    carrierKind: "sdlc_traversal_consequence_replay",
    carrierName: "SdlcTraversalConsequenceReplay",
    purposeClass: "split_boundary",
    owner: "abg",
    authorityUse: "abg_admitted_runtime_truth",
    sourceModule: "operator/traversal_consequence.ts",
    replacementCarrierKind: null,
    purpose:
      "ABG-owned replay/consequence reconstruction target; current odd_sdlc copy is migration debt."
  }),
  row({
    carrierKind: "sdlc_consequence_traversal_action_binding",
    carrierName: "SdlcConsequenceTraversalActionBinding",
    purposeClass: "split_boundary",
    owner: "abg",
    authorityUse: "abg_admitted_runtime_truth",
    sourceModule: "operator/traversal_consequence.ts",
    replacementCarrierKind: null,
    purpose:
      "ABG consequence traversal binding target; current odd_sdlc copy is migration debt."
  }),
]);

export function sdlcRegisterPurposeForCarrierKind(
  carrierKind: string
): SdlcRegisterPurposeRow | null {
  return SDLC_REGISTER_PURPOSE_CATALOG.find(
    (row) => row.carrierKind === carrierKind
  ) ?? null;
}

export function requireSdlcRegisterPurposeForCarrierKind(
  carrierKind: string
): SdlcRegisterPurposeRow {
  const purpose = sdlcRegisterPurposeForCarrierKind(carrierKind);
  if (purpose === null) {
    throw new TypeError(`unclassified SDLC register carrier: ${carrierKind}`);
  }
  return purpose;
}
