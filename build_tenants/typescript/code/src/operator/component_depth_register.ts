// Implements: T-113

import { existsSync, readFileSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString,
  parseNullableNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import type {
  SdlcComponentDepthRegister,
  SdlcComponentDepthRegisterAdmission,
  SdlcComponentExecutionFailureRegister,
  SdlcComponentExecutionFailureRow,
  SdlcComponentRepairSchedule,
  SdlcComponentRepairScheduleRow,
  SdlcComponentRealizationRow,
  SdlcComponentTestQualificationRow,
  SdlcComponentTestRealizationRow,
  SdlcComponentTopologyRow,
  SdlcReleaseDepthParityAssessment,
  SdlcTestComponentTopologyRow
} from "./carriers.js";
import {
  SDLC_COMPONENT_CONCERN_ROLES
  , SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE,
  SDLC_COMPONENT_EXECUTION_FAILURE_KINDS,
  SDLC_COMPONENT_REPAIR_SCHEDULE_STATUSES,
  SDLC_COMPONENT_REPAIR_TARGETS
} from "./carriers.js";

const COMPONENT_DEPTH_TARGETS = Object.freeze([
  "implementation_component_topology_surface",
  "component_realization_schedule_surface",
  "component_code_surface",
  "component_realization_qualification_surface",
  "test_component_topology_surface",
  "component_test_surface",
  "component_test_qualification_surface",
  "component_repair_schedule_surface",
  "release_depth_parity_surface"
] as const);

type ComponentDepthTarget = (typeof COMPONENT_DEPTH_TARGETS)[number];

function isComponentDepthTarget(
  targetAssetType: string
): targetAssetType is ComponentDepthTarget {
  return COMPONENT_DEPTH_TARGETS.includes(targetAssetType as ComponentDepthTarget);
}

function parseArray<T>(
  input: unknown,
  label: string,
  parseItem: (item: unknown, itemLabel: string) => T
): readonly T[] {
  if (input === undefined) {
    return Object.freeze([]);
  }
  if (!Array.isArray(input)) {
    throw new TypeError(`${label}: expected array`);
  }
  return Object.freeze(
    input.map((item, index) => parseItem(item, `${label}[${index}]`))
  );
}

function parseComponentTopologyRow(
  input: unknown,
  label: string
): SdlcComponentTopologyRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "componentId",
    "moduleName",
    "relativePath",
    "publicBoundary",
    "concernRole",
    "requirementIds",
    "sourceAssetRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_component_topology_row") {
    throw new TypeError(`${label}.kind: unexpected row kind`);
  }
  return Object.freeze({
    kind: "sdlc_component_topology_row" as const,
    componentId: parseNonEmptyString(record["componentId"], `${label}.componentId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    relativePath: parseNonEmptyString(record["relativePath"], `${label}.relativePath`),
    publicBoundary: parseNonEmptyString(record["publicBoundary"], `${label}.publicBoundary`),
    concernRole: parseEnumValue(
      record["concernRole"],
      `${label}.concernRole`,
      SDLC_COMPONENT_CONCERN_ROLES
    ),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    sourceAssetRefs: parseStringList(record["sourceAssetRefs"], `${label}.sourceAssetRefs`)
  });
}

function parseComponentRealizationRow(
  input: unknown,
  label: string
): SdlcComponentRealizationRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "componentId",
    "moduleName",
    "relativePath",
    "publicBoundary",
    "trancheId",
    "firstProductFileToChange",
    "upstreamComponentIds",
    "requirementIds",
    "sourceAssetRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_component_realization_row") {
    throw new TypeError(`${label}.kind: unexpected row kind`);
  }
  const relativePath = parseNonEmptyString(record["relativePath"], `${label}.relativePath`);
  const firstProductFileToChange =
    record["firstProductFileToChange"] === undefined
      ? null
      : parseNullableNonEmptyString(
          record["firstProductFileToChange"],
          `${label}.firstProductFileToChange`
        );
  const publicBoundary =
    record["publicBoundary"] === undefined
      ? firstProductFileToChange ?? relativePath
      : parseNonEmptyString(record["publicBoundary"], `${label}.publicBoundary`);
  return Object.freeze({
    kind: "sdlc_component_realization_row" as const,
    componentId: parseNonEmptyString(record["componentId"], `${label}.componentId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    relativePath,
    publicBoundary,
    trancheId:
      record["trancheId"] === undefined
        ? null
        : parseNullableNonEmptyString(record["trancheId"], `${label}.trancheId`),
    firstProductFileToChange,
    upstreamComponentIds:
      record["upstreamComponentIds"] === undefined
        ? Object.freeze([])
        : parseStringList(record["upstreamComponentIds"], `${label}.upstreamComponentIds`),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    sourceAssetRefs: parseStringList(record["sourceAssetRefs"], `${label}.sourceAssetRefs`)
  });
}

function parseTestComponentTopologyRow(
  input: unknown,
  label: string
): SdlcTestComponentTopologyRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "testClassId",
    "relativePath",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "shardId"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_component_topology_row") {
    throw new TypeError(`${label}.kind: unexpected row kind`);
  }
  return Object.freeze({
    kind: "sdlc_test_component_topology_row" as const,
    testClassId: parseNonEmptyString(record["testClassId"], `${label}.testClassId`),
    relativePath: parseNonEmptyString(record["relativePath"], `${label}.relativePath`),
    testcaseIds: parseStringList(record["testcaseIds"], `${label}.testcaseIds`),
    componentIds: parseStringList(record["componentIds"], `${label}.componentIds`),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    shardId: parseNullableNonEmptyString(record["shardId"], `${label}.shardId`)
  });
}

function parseComponentTestRealizationRow(
  input: unknown,
  label: string
): SdlcComponentTestRealizationRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "testClassId",
    "relativePath",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "shardId"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_component_test_realization_row") {
    throw new TypeError(`${label}.kind: unexpected row kind`);
  }
  return Object.freeze({
    kind: "sdlc_component_test_realization_row" as const,
    testClassId: parseNonEmptyString(record["testClassId"], `${label}.testClassId`),
    relativePath: parseNonEmptyString(record["relativePath"], `${label}.relativePath`),
    testcaseIds: parseStringList(record["testcaseIds"], `${label}.testcaseIds`),
    componentIds: parseStringList(record["componentIds"], `${label}.componentIds`),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    shardId: parseNullableNonEmptyString(record["shardId"], `${label}.shardId`)
  });
}

function parseComponentTestQualificationRow(
  input: unknown,
  label: string
): SdlcComponentTestQualificationRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "testClassId",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "status",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_component_test_qualification_row") {
    throw new TypeError(`${label}.kind: unexpected row kind`);
  }
  return Object.freeze({
    kind: "sdlc_component_test_qualification_row" as const,
    testClassId: parseNonEmptyString(record["testClassId"], `${label}.testClassId`),
    testcaseIds: parseStringList(record["testcaseIds"], `${label}.testcaseIds`),
    componentIds: parseStringList(record["componentIds"], `${label}.componentIds`),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    status: parseEnumValue(record["status"], `${label}.status`, [
      "passed",
      "failed",
      "pending",
      "unproven"
    ]),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseComponentExecutionFailureRow(
  input: unknown,
  label: string
): SdlcComponentExecutionFailureRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "failureId",
    "shardId",
    "moduleName",
    "testClassId",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "failureKind",
    "repairTarget",
    "lawfulReentryPoint",
    "attributionConfidence",
    "sourceRefs",
    "testRefs",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_component_execution_failure_row") {
    throw new TypeError(`${label}.kind: unexpected failure row kind`);
  }
  return Object.freeze({
    kind: "sdlc_component_execution_failure_row" as const,
    failureId: parseNonEmptyString(record["failureId"], `${label}.failureId`),
    shardId: parseNonEmptyString(record["shardId"], `${label}.shardId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    testClassId: parseNonEmptyString(record["testClassId"], `${label}.testClassId`),
    testcaseIds: parseStringList(record["testcaseIds"], `${label}.testcaseIds`),
    componentIds: parseStringList(record["componentIds"], `${label}.componentIds`),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    failureKind: parseEnumValue(
      record["failureKind"],
      `${label}.failureKind`,
      SDLC_COMPONENT_EXECUTION_FAILURE_KINDS
    ),
    repairTarget: parseEnumValue(
      record["repairTarget"],
      `${label}.repairTarget`,
      SDLC_COMPONENT_REPAIR_TARGETS
    ),
    lawfulReentryPoint: parseNonEmptyString(
      record["lawfulReentryPoint"],
      `${label}.lawfulReentryPoint`
    ),
    attributionConfidence: parseEnumValue(
      record["attributionConfidence"],
      `${label}.attributionConfidence`,
      SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE
    ),
    sourceRefs: parseStringList(record["sourceRefs"], `${label}.sourceRefs`),
    testRefs: parseStringList(record["testRefs"], `${label}.testRefs`),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseComponentExecutionFailureRegister(
  input: unknown,
  label: string
): SdlcComponentExecutionFailureRegister | null {
  if (input === null || input === undefined) {
    return null;
  }
  const record = parseClosedRecord(input, label, [
    "kind",
    "registerVersion",
    "failureRows"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "component_execution_failure_register") {
    throw new TypeError(`${label}.kind: unexpected failure register kind`);
  }
  const registerVersion = parseNonEmptyString(
    record["registerVersion"],
    `${label}.registerVersion`
  );
  if (registerVersion !== "ts-component-depth-v1") {
    throw new TypeError(`${label}.registerVersion: unsupported version`);
  }
  return Object.freeze({
    kind: "component_execution_failure_register" as const,
    registerVersion: "ts-component-depth-v1" as const,
    failureRows: parseArray(
      record["failureRows"],
      `${label}.failureRows`,
      parseComponentExecutionFailureRow
    )
  });
}

function parseComponentRepairScheduleRow(
  input: unknown,
  label: string
): SdlcComponentRepairScheduleRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "scheduleId",
    "failureId",
    "repairTarget",
    "lawfulReentryPoint",
    "attributionConfidence",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "sourceRefs",
    "testRefs",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_component_repair_schedule_row") {
    throw new TypeError(`${label}.kind: unexpected repair schedule row kind`);
  }
  return Object.freeze({
    kind: "sdlc_component_repair_schedule_row" as const,
    scheduleId: parseNonEmptyString(record["scheduleId"], `${label}.scheduleId`),
    failureId: parseNonEmptyString(record["failureId"], `${label}.failureId`),
    repairTarget: parseEnumValue(
      record["repairTarget"],
      `${label}.repairTarget`,
      SDLC_COMPONENT_REPAIR_TARGETS
    ),
    lawfulReentryPoint: parseNonEmptyString(
      record["lawfulReentryPoint"],
      `${label}.lawfulReentryPoint`
    ),
    attributionConfidence: parseEnumValue(
      record["attributionConfidence"],
      `${label}.attributionConfidence`,
      SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE
    ),
    testcaseIds: parseStringList(record["testcaseIds"], `${label}.testcaseIds`),
    componentIds: parseStringList(record["componentIds"], `${label}.componentIds`),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    sourceRefs: parseStringList(record["sourceRefs"], `${label}.sourceRefs`),
    testRefs: parseStringList(record["testRefs"], `${label}.testRefs`),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseComponentRepairSchedule(
  input: unknown,
  label: string
): SdlcComponentRepairSchedule | null {
  if (input === null || input === undefined) {
    return null;
  }
  const record = parseClosedRecord(input, label, [
    "kind",
    "registerVersion",
    "scheduleStatus",
    "repairRows",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_component_repair_schedule") {
    throw new TypeError(`${label}.kind: unexpected repair schedule kind`);
  }
  const registerVersion = parseNonEmptyString(
    record["registerVersion"],
    `${label}.registerVersion`
  );
  if (registerVersion !== "ts-component-depth-v1") {
    throw new TypeError(`${label}.registerVersion: unsupported version`);
  }
  return Object.freeze({
    kind: "sdlc_component_repair_schedule" as const,
    registerVersion: "ts-component-depth-v1" as const,
    scheduleStatus: parseEnumValue(
      record["scheduleStatus"],
      `${label}.scheduleStatus`,
      SDLC_COMPONENT_REPAIR_SCHEDULE_STATUSES
    ),
    repairRows: parseArray(
      record["repairRows"],
      `${label}.repairRows`,
      parseComponentRepairScheduleRow
    ),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseReleaseDepthParity(
  input: unknown,
  label: string
): SdlcReleaseDepthParityAssessment | null {
  if (input === null || input === undefined) {
    return null;
  }
  const record = parseClosedRecord(input, label, [
    "kind",
    "status",
    "summary",
    "blockingReasons",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_release_depth_parity_assessment") {
    throw new TypeError(`${label}.kind: unexpected parity kind`);
  }
  return Object.freeze({
    kind: "sdlc_release_depth_parity_assessment" as const,
    status: parseEnumValue(record["status"], `${label}.status`, [
      "met",
      "blocked",
      "repriced"
    ]),
    summary: parseNonEmptyString(record["summary"], `${label}.summary`),
    blockingReasons: parseStringList(record["blockingReasons"], `${label}.blockingReasons`),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseRegister(input: unknown, label: string): SdlcComponentDepthRegister {
  const record = parseClosedRecord(input, label, [
    "kind",
    "registerVersion",
    "targetAssetType",
    "componentTopologyRows",
    "componentRealizationRows",
    "testComponentTopologyRows",
    "componentTestRows",
    "componentTestQualificationRows",
    "componentExecutionFailureRegister",
    "component_execution_failure_register",
    "componentRepairSchedule",
    "component_repair_schedule",
    "releaseDepthParity"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_component_depth_register") {
    throw new TypeError(`${label}.kind: unexpected register kind`);
  }
  const targetAssetType = parseNonEmptyString(record["targetAssetType"], `${label}.targetAssetType`);
  const registerVersion = parseNonEmptyString(record["registerVersion"], `${label}.registerVersion`);
  const versionIsAdmitted =
    registerVersion === "ts-component-depth-v1" ||
    (targetAssetType === "component_realization_schedule_surface" &&
      registerVersion === "ts-component-realization-v1");
  if (!versionIsAdmitted) {
    throw new TypeError(`${label}.registerVersion: unsupported version`);
  }
  return Object.freeze({
    kind: "sdlc_component_depth_register" as const,
    registerVersion: "ts-component-depth-v1" as const,
    targetAssetType,
    componentTopologyRows: parseArray(
      record["componentTopologyRows"],
      `${label}.componentTopologyRows`,
      parseComponentTopologyRow
    ),
    componentRealizationRows: parseArray(
      record["componentRealizationRows"],
      `${label}.componentRealizationRows`,
      parseComponentRealizationRow
    ),
    testComponentTopologyRows: parseArray(
      record["testComponentTopologyRows"],
      `${label}.testComponentTopologyRows`,
      parseTestComponentTopologyRow
    ),
    componentTestRows: parseArray(
      record["componentTestRows"],
      `${label}.componentTestRows`,
      parseComponentTestRealizationRow
    ),
    componentTestQualificationRows: parseArray(
      record["componentTestQualificationRows"],
      `${label}.componentTestQualificationRows`,
      parseComponentTestQualificationRow
    ),
    componentExecutionFailureRegister: parseComponentExecutionFailureRegister(
      record["componentExecutionFailureRegister"] ??
        record["component_execution_failure_register"],
      `${label}.componentExecutionFailureRegister`
    ),
    componentRepairSchedule: parseComponentRepairSchedule(
      record["componentRepairSchedule"] ?? record["component_repair_schedule"],
      `${label}.componentRepairSchedule`
    ),
    releaseDepthParity: parseReleaseDepthParity(
      record["releaseDepthParity"],
      `${label}.releaseDepthParity`
    )
  });
}

function objectRecord(input: unknown): Record<string, unknown> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  return Object.fromEntries(Object.entries(input));
}

function normalizeCandidate(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  if (record["kind"] === "sdlc_component_depth_register") {
    return input;
  }
  if (record["component_depth_register"] !== undefined) {
    return record["component_depth_register"];
  }
  if (record["componentDepthRegister"] !== undefined) {
    return record["componentDepthRegister"];
  }
  return input;
}

function jsonCandidates(content: string): readonly unknown[] {
  const candidates: unknown[] = [];
  try {
    candidates.push(JSON.parse(content));
  } catch {
    // Whole artifact is usually markdown; fenced JSON below is canonical.
  }
  const fencedBlockExpression =
    /```(?:json|component_depth_register|componentDepthRegister)?\s*\n([\s\S]*?)```/gu;
  for (const match of content.matchAll(fencedBlockExpression)) {
    const block = match[1]?.trim() ?? "";
    try {
      candidates.push(JSON.parse(block));
    } catch {
      // Invalid JSON block is reported only if no later candidate admits.
    }
  }
  return Object.freeze(candidates);
}

function requiredRowsPresent(input: {
  readonly targetAssetType: ComponentDepthTarget;
  readonly register: SdlcComponentDepthRegister;
}): readonly string[] {
  switch (input.targetAssetType) {
    case "implementation_component_topology_surface":
      return input.register.componentTopologyRows.length > 0
        ? Object.freeze([])
        : Object.freeze(["component_depth_register_component_topology_rows_missing"]);
    case "component_realization_schedule_surface":
    case "component_code_surface":
    case "component_realization_qualification_surface":
      return input.register.componentRealizationRows.length > 0
        ? Object.freeze([])
        : Object.freeze(["component_depth_register_component_realization_rows_missing"]);
    case "test_component_topology_surface":
      return input.register.testComponentTopologyRows.length > 0
        ? Object.freeze([])
        : Object.freeze(["component_depth_register_test_component_topology_rows_missing"]);
    case "component_test_surface":
      return input.register.componentTestRows.length > 0
        ? Object.freeze([])
        : Object.freeze(["component_depth_register_component_test_rows_missing"]);
    case "component_test_qualification_surface":
      return input.register.componentTestQualificationRows.length > 0 ||
        (input.register.componentExecutionFailureRegister?.failureRows.length ?? 0) > 0
        ? Object.freeze([])
        : Object.freeze(["component_depth_register_component_test_qualification_rows_missing"]);
    case "component_repair_schedule_surface":
      return input.register.componentRepairSchedule !== null
        ? Object.freeze([])
        : Object.freeze(["component_depth_register_component_repair_schedule_missing"]);
    case "release_depth_parity_surface":
      return input.register.releaseDepthParity !== null
        ? Object.freeze([])
        : Object.freeze(["component_depth_register_release_depth_parity_missing"]);
    default: {
      const exhaustive: never = input.targetAssetType;
      throw new TypeError(`Unsupported component-depth target ${exhaustive}`);
    }
  }
}

export function admitComponentDepthRegisterFromArtifact(input: {
  readonly targetAssetType: string;
  readonly outputFile: string;
}): SdlcComponentDepthRegisterAdmission {
  const evidenceRefs = Object.freeze([pathToFileURL(input.outputFile).href]);
  if (!isComponentDepthTarget(input.targetAssetType)) {
    return Object.freeze({
      kind: "sdlc_component_depth_register_admission" as const,
      status: "not_required" as const,
      targetAssetType: input.targetAssetType,
      register: null,
      blockingReasons: Object.freeze([]),
      evidenceRefs
    });
  }
  if (!existsSync(input.outputFile) || !statSync(input.outputFile).isFile()) {
    return Object.freeze({
      kind: "sdlc_component_depth_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: input.targetAssetType,
      register: null,
      blockingReasons: Object.freeze(["component_depth_output_missing"]),
      evidenceRefs
    });
  }
  const content = readFileSync(input.outputFile, "utf8");
  const errors: string[] = [];
  for (const candidate of jsonCandidates(content)) {
    try {
      const register = parseRegister(
        normalizeCandidate(candidate),
        "component_depth_register"
      );
      if (register.targetAssetType !== input.targetAssetType) {
        errors.push(
          `component_depth_register_target_mismatch:${register.targetAssetType}`
        );
        continue;
      }
      const rowReasons = requiredRowsPresent({
        targetAssetType: input.targetAssetType,
        register
      });
      if (rowReasons.length > 0) {
        return Object.freeze({
          kind: "sdlc_component_depth_register_admission" as const,
          status: "rejected" as const,
          targetAssetType: input.targetAssetType,
          register,
          blockingReasons: rowReasons,
          evidenceRefs
        });
      }
      return Object.freeze({
        kind: "sdlc_component_depth_register_admission" as const,
        status: "admitted" as const,
        targetAssetType: input.targetAssetType,
        register,
        blockingReasons: Object.freeze([]),
        evidenceRefs
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return Object.freeze({
    kind: "sdlc_component_depth_register_admission" as const,
    status: "rejected" as const,
    targetAssetType: input.targetAssetType,
    register: null,
    blockingReasons: Object.freeze(
      errors.length === 0
        ? ["component_depth_register_missing"]
        : [`component_depth_register_invalid:${errors.join("; ")}`]
    ),
    evidenceRefs
  });
}
