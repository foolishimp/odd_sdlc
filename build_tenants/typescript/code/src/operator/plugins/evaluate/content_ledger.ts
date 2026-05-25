// Implements: T-183

import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { EnginePluginInput, RuntimeRegime } from "@abiogenesis/typescript-tenant";
import type { SdlcDesignDepthRegister } from "../../carriers.js";
import { writeSdlcSystemArtifact } from "../../system_artifacts.js";

export const SDLC_EVALUATE_AUTHORITY_FUNCTIONS = Object.freeze([
  "synthesize_model",
  "eval_gap",
  "evaluate_action",
  "evaluate_next"
] as const);

export type SdlcEvaluateAuthorityFunction =
  (typeof SDLC_EVALUATE_AUTHORITY_FUNCTIONS)[number];

export const SDLC_EVALUATE_CONTENT_CARRIER_FAMILIES = Object.freeze([
  "ProductAssetModel",
  "ObservationSnapshot",
  "GapPressureRow",
  "EdgeFulfillmentLedger",
  "EdgeClosureDecision",
  "NextActionProjection"
] as const);

export type SdlcEvaluateContentCarrierFamily =
  (typeof SDLC_EVALUATE_CONTENT_CARRIER_FAMILIES)[number];

export interface SdlcEvaluateContentLedgerRow {
  readonly kind: "sdlc_evaluate_content_ledger_row";
  readonly rowRef: string;
  readonly authorityFunction: SdlcEvaluateAuthorityFunction;
  readonly carrierFamily: SdlcEvaluateContentCarrierFamily;
  readonly contentKind: string;
  readonly payload: unknown;
  readonly sourceBasisRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcEvaluateContentLedger {
  readonly kind: "sdlc_evaluate_content_ledger";
  readonly ledgerVersion: "ts-evaluate-content-v1";
  readonly stage: "evaluate.C";
  readonly ruleRef: string;
  readonly ruleRole: "semantic_judgment";
  readonly computeMeans: RuntimeRegime;
  readonly authorityFunction: SdlcEvaluateAuthorityFunction;
  readonly selectedCompositionRef: string;
  readonly selectedCompositionDigest: string;
  readonly selectedCompositionSelectionRef: string;
  readonly selectedRegimeBindingRef: string | null;
  readonly compositionContributionRef: string;
  readonly sourceBasisRefs: readonly string[];
  readonly candidateArtifactRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly contentRows: readonly SdlcEvaluateContentLedgerRow[];
}

export interface SdlcEvaluateContentLedgerAdmission {
  readonly kind: "sdlc_evaluate_content_ledger_admission";
  readonly status: "admitted" | "rejected";
  readonly ledger: SdlcEvaluateContentLedger | null;
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcEvaluateContentLedgerSelectedIdentity {
  readonly selectedCompositionRef: string;
  readonly selectedCompositionDigest: string;
  readonly selectedCompositionSelectionRef: string;
  readonly selectedRegimeBindingRef: string | null;
}

function stableJson(input: unknown): string {
  if (Array.isArray(input)) {
    return `[${input.map((entry) => stableJson(entry)).join(",")}]`;
  }
  if (input !== null && typeof input === "object") {
    return `{${Object.entries(input)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${JSON.stringify(key)}:${stableJson(value)}`)
      .join(",")}}`;
  }
  return JSON.stringify(input);
}

function prettyStableJson(input: unknown): string {
  return `${JSON.stringify(JSON.parse(stableJson(input)), null, 2)}\n`;
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort((left, right) => left.localeCompare(right)));
}

function objectRecord(input: unknown): Record<string, unknown> | null {
  return typeof input === "object" && input !== null && !Array.isArray(input)
    ? Object.fromEntries(Object.entries(input))
    : null;
}

function isSdlcDesignDepthRegister(input: unknown): input is SdlcDesignDepthRegister {
  const record = objectRecord(input);
  return (
    record !== null &&
    record["kind"] === "sdlc_design_depth_register" &&
    record["registerVersion"] === "ts-design-depth-v1"
  );
}

function requireExactKeys(
  record: Record<string, unknown>,
  allowedKeys: readonly string[],
  label: string
): void {
  const allowed = new Set(allowedKeys);
  const unexpected = Object.keys(record)
    .filter((key) => !allowed.has(key))
    .sort((left, right) => left.localeCompare(right));
  const missing = allowedKeys.filter((key) => !(key in record));
  if (unexpected.length > 0 || missing.length > 0) {
    const details = [
      ...(unexpected.length === 0
        ? []
        : [`unexpected keys ${unexpected.join(", ")}`]),
      ...(missing.length === 0 ? [] : [`missing keys ${missing.join(", ")}`])
    ].join("; ");
    throw new TypeError(`${label}: exact carrier keys required${details.length === 0 ? "" : ` (${details})`}`);
  }
}

function parseNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${label}: expected non-empty string`);
  }
  return value;
}

function parseNullableString(value: unknown, label: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return parseNonEmptyString(value, label);
}

function parseStringArray(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label}: expected string array`);
  }
  return Object.freeze(
    value.map((item, index) => parseNonEmptyString(item, `${label}[${index}]`))
  );
}

function parseEnumValue<T extends string>(
  value: unknown,
  label: string,
  allowed: readonly T[]
): T {
  const parsed = parseNonEmptyString(value, label);
  const matched = allowed.find((candidate) => candidate === parsed);
  if (matched === undefined) {
    throw new TypeError(`${label}: expected one of ${allowed.join(", ")}`);
  }
  return matched;
}

function parseComputeMeans(value: unknown, label: string): RuntimeRegime {
  return parseEnumValue(value, label, Object.freeze(["F_D", "F_P", "F_H"]));
}

function parseRow(input: unknown, label: string): SdlcEvaluateContentLedgerRow {
  const record = objectRecord(input);
  if (record === null) {
    throw new TypeError(`${label}: expected object`);
  }
  requireExactKeys(
    record,
    [
      "kind",
      "rowRef",
      "authorityFunction",
      "carrierFamily",
      "contentKind",
      "payload",
      "sourceBasisRefs",
      "evidenceRefs"
    ],
    label
  );
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_evaluate_content_ledger_row") {
    throw new TypeError(`${label}.kind: expected sdlc_evaluate_content_ledger_row`);
  }
  return Object.freeze({
    kind: "sdlc_evaluate_content_ledger_row" as const,
    rowRef: parseNonEmptyString(record["rowRef"], `${label}.rowRef`),
    authorityFunction: parseEnumValue(
      record["authorityFunction"],
      `${label}.authorityFunction`,
      SDLC_EVALUATE_AUTHORITY_FUNCTIONS
    ),
    carrierFamily: parseEnumValue(
      record["carrierFamily"],
      `${label}.carrierFamily`,
      SDLC_EVALUATE_CONTENT_CARRIER_FAMILIES
    ),
    contentKind: parseNonEmptyString(record["contentKind"], `${label}.contentKind`),
    payload: record["payload"],
    sourceBasisRefs: parseStringArray(
      record["sourceBasisRefs"],
      `${label}.sourceBasisRefs`
    ),
    evidenceRefs: parseStringArray(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseLedger(input: unknown): SdlcEvaluateContentLedger {
  const record = objectRecord(input);
  if (record === null) {
    throw new TypeError("sdlc_evaluate_content_ledger: expected object");
  }
  requireExactKeys(
    record,
    [
      "kind",
      "ledgerVersion",
      "stage",
      "ruleRef",
      "ruleRole",
      "computeMeans",
      "authorityFunction",
      "selectedCompositionRef",
      "selectedCompositionDigest",
      "selectedCompositionSelectionRef",
      "selectedRegimeBindingRef",
      "compositionContributionRef",
      "sourceBasisRefs",
      "candidateArtifactRefs",
      "evidenceRefs",
      "contentRows"
    ],
    "sdlc_evaluate_content_ledger"
  );
  const kind = parseNonEmptyString(record["kind"], "ledger.kind");
  if (kind !== "sdlc_evaluate_content_ledger") {
    throw new TypeError("ledger.kind: expected sdlc_evaluate_content_ledger");
  }
  const ledgerVersion = parseNonEmptyString(
    record["ledgerVersion"],
    "ledger.ledgerVersion"
  );
  if (ledgerVersion !== "ts-evaluate-content-v1") {
    throw new TypeError("ledger.ledgerVersion: expected ts-evaluate-content-v1");
  }
  const stage = parseNonEmptyString(record["stage"], "ledger.stage");
  if (stage !== "evaluate.C") {
    throw new TypeError("ledger.stage: expected evaluate.C");
  }
  const ruleRole = parseNonEmptyString(record["ruleRole"], "ledger.ruleRole");
  if (ruleRole !== "semantic_judgment") {
    throw new TypeError("ledger.ruleRole: expected semantic_judgment");
  }
  const contentRows = Array.isArray(record["contentRows"])
    ? Object.freeze(
        record["contentRows"].map((row, index) =>
          parseRow(row, `ledger.contentRows[${index}]`)
        )
      )
    : (() => {
        throw new TypeError("ledger.contentRows: expected array");
      })();
  if (contentRows.length === 0) {
    throw new TypeError("ledger.contentRows: expected at least one row");
  }
  return Object.freeze({
    kind: "sdlc_evaluate_content_ledger" as const,
    ledgerVersion: "ts-evaluate-content-v1" as const,
    stage: "evaluate.C" as const,
    ruleRef: parseNonEmptyString(record["ruleRef"], "ledger.ruleRef"),
    ruleRole: "semantic_judgment" as const,
    computeMeans: parseComputeMeans(record["computeMeans"], "ledger.computeMeans"),
    authorityFunction: parseEnumValue(
      record["authorityFunction"],
      "ledger.authorityFunction",
      SDLC_EVALUATE_AUTHORITY_FUNCTIONS
    ),
    selectedCompositionRef: parseNonEmptyString(
      record["selectedCompositionRef"],
      "ledger.selectedCompositionRef"
    ),
    selectedCompositionDigest: parseNonEmptyString(
      record["selectedCompositionDigest"],
      "ledger.selectedCompositionDigest"
    ),
    selectedCompositionSelectionRef: parseNonEmptyString(
      record["selectedCompositionSelectionRef"],
      "ledger.selectedCompositionSelectionRef"
    ),
    selectedRegimeBindingRef: parseNullableString(
      record["selectedRegimeBindingRef"],
      "ledger.selectedRegimeBindingRef"
    ),
    compositionContributionRef: parseNonEmptyString(
      record["compositionContributionRef"],
      "ledger.compositionContributionRef"
    ),
    sourceBasisRefs: parseStringArray(
      record["sourceBasisRefs"],
      "ledger.sourceBasisRefs"
    ),
    candidateArtifactRefs: parseStringArray(
      record["candidateArtifactRefs"],
      "ledger.candidateArtifactRefs"
    ),
    evidenceRefs: parseStringArray(record["evidenceRefs"], "ledger.evidenceRefs"),
    contentRows
  });
}

export function sdlcEvaluateContentLedgerPath(input: {
  readonly archiveRoot: string;
  readonly ruleFilePrefix: string;
}): string {
  return join(input.archiveRoot, `${input.ruleFilePrefix}_content_ledger.json`);
}

export function designDepthFpEvaluatorContentLedgerPath(input: {
  readonly archiveRoot: string;
}): string {
  return sdlcEvaluateContentLedgerPath({
    archiveRoot: input.archiveRoot,
    ruleFilePrefix: "design_depth_fp_evaluator"
  });
}

export function admitSdlcEvaluateContentLedgerArtifact(input: {
  readonly ledgerPath: string;
  readonly pluginInput: EnginePluginInput;
  readonly ruleRef: string;
  readonly authorityFunction: SdlcEvaluateAuthorityFunction;
  readonly computeMeans?: RuntimeRegime | undefined;
}): SdlcEvaluateContentLedgerAdmission {
  return admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity({
    ledgerPath: input.ledgerPath,
    selectedIdentity: Object.freeze({
      selectedCompositionRef: input.pluginInput.selectedCompositionRef,
      selectedCompositionDigest: input.pluginInput.selectedCompositionDigest,
      selectedCompositionSelectionRef:
        input.pluginInput.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.pluginInput.selectedRegimeBindingRef ?? null
    }),
    ruleRef: input.ruleRef,
    authorityFunction: input.authorityFunction,
    computeMeans: input.computeMeans
  });
}

export function admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity(input: {
  readonly ledgerPath: string;
  readonly selectedIdentity: SdlcEvaluateContentLedgerSelectedIdentity;
  readonly ruleRef: string;
  readonly authorityFunction: SdlcEvaluateAuthorityFunction;
  readonly computeMeans?: RuntimeRegime | undefined;
}): SdlcEvaluateContentLedgerAdmission {
  const evidenceRefs = Object.freeze([pathToFileURL(input.ledgerPath).href]);
  if (!existsSync(input.ledgerPath) || !statSync(input.ledgerPath).isFile()) {
    return Object.freeze({
      kind: "sdlc_evaluate_content_ledger_admission" as const,
      status: "rejected" as const,
      ledger: null,
      blockingReasons: Object.freeze(["evaluate_content_ledger_missing"]),
      evidenceRefs
    });
  }
  try {
    const ledger = parseLedger(JSON.parse(readFileSync(input.ledgerPath, "utf8")));
    const blockingReasons: string[] = [];
    if (ledger.ruleRef !== input.ruleRef) {
      blockingReasons.push("evaluate_content_ledger_rule_ref_mismatch");
    }
    if (ledger.authorityFunction !== input.authorityFunction) {
      blockingReasons.push("evaluate_content_ledger_authority_function_mismatch");
    }
    if ((input.computeMeans ?? "F_P") !== ledger.computeMeans) {
      blockingReasons.push("evaluate_content_ledger_compute_means_mismatch");
    }
    if (
      ledger.selectedCompositionRef !==
      input.selectedIdentity.selectedCompositionRef
    ) {
      blockingReasons.push("evaluate_content_ledger_selected_composition_ref_mismatch");
    }
    if (
      ledger.selectedCompositionDigest !==
      input.selectedIdentity.selectedCompositionDigest
    ) {
      blockingReasons.push("evaluate_content_ledger_selected_composition_digest_mismatch");
    }
    if (
      ledger.selectedCompositionSelectionRef !==
      input.selectedIdentity.selectedCompositionSelectionRef
    ) {
      blockingReasons.push(
        "evaluate_content_ledger_selected_composition_selection_ref_mismatch"
      );
    }
    if (
      ledger.selectedRegimeBindingRef !==
      input.selectedIdentity.selectedRegimeBindingRef
    ) {
      blockingReasons.push("evaluate_content_ledger_selected_regime_binding_ref_mismatch");
    }
    if (ledger.contentRows.some((row) => row.authorityFunction !== ledger.authorityFunction)) {
      blockingReasons.push("evaluate_content_ledger_row_authority_function_mismatch");
    }
    if (blockingReasons.length > 0) {
      return Object.freeze({
        kind: "sdlc_evaluate_content_ledger_admission" as const,
        status: "rejected" as const,
        ledger: null,
        blockingReasons: Object.freeze(blockingReasons),
        evidenceRefs
      });
    }
    return Object.freeze({
      kind: "sdlc_evaluate_content_ledger_admission" as const,
      status: "admitted" as const,
      ledger,
      blockingReasons: Object.freeze([]),
      evidenceRefs: uniqueSorted([...evidenceRefs, ...ledger.evidenceRefs])
    });
  } catch (error) {
    return Object.freeze({
      kind: "sdlc_evaluate_content_ledger_admission" as const,
      status: "rejected" as const,
      ledger: null,
      blockingReasons: Object.freeze([
        `evaluate_content_ledger_invalid:${error instanceof Error ? error.message : "unknown"}`
      ]),
      evidenceRefs
    });
  }
}

export function designDepthRegisterPayloadFromEvaluateContentLedger(
  ledger: SdlcEvaluateContentLedger
): SdlcDesignDepthRegister | null {
  const row = ledger.contentRows.find(
    (candidate) =>
      candidate.authorityFunction === "synthesize_model" &&
      candidate.carrierFamily === "ProductAssetModel" &&
      candidate.contentKind === "sdlc_design_depth_register"
  );
  if (row === undefined || !isSdlcDesignDepthRegister(row.payload)) {
    return null;
  }
  return row.payload;
}

export function writeDesignDepthRegisterProjectionFromEvaluateContentLedger(input: {
  readonly ledger: SdlcEvaluateContentLedger;
  readonly archiveRoot: string;
  readonly registerPath: string;
}): string {
  const payload = designDepthRegisterPayloadFromEvaluateContentLedger(input.ledger);
  if (payload === null) {
    throw new TypeError("evaluate content ledger has no design-depth register payload");
  }
  writeSdlcSystemArtifact({
    archiveRoot: input.archiveRoot,
    absolutePath: input.registerPath,
    payload: prettyStableJson(payload)
  });
  return pathToFileURL(input.registerPath).href;
}
