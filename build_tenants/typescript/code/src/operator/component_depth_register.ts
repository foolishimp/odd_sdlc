// Implements: T-113

import { existsSync, readFileSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  parseClosedRecord,
  parseNonEmptyString,
  parseNullableNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import {
  admitDeclaredAlias,
  admitExactContractEnum,
  admitExactProtocolString,
  admitExactProtocolVersion
} from "../shared/fd_admission.js";
import type {
  SdlcComponentDepthRegister,
  SdlcComponentDepthRegisterAdmission,
  SdlcComponentExecutionFailureRegister,
  SdlcComponentExecutionFailureRow,
  SdlcComponentRepairSchedule,
  SdlcComponentRepairScheduleRow,
  SdlcComponentRepairTarget,
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
  "component_code_surface",
  "component_realization_qualification_surface",
  "component_test_surface",
  "component_test_qualification_surface",
  "component_repair_schedule_surface",
  "release_depth_parity_surface"
] as const);

type ComponentDepthTarget = (typeof COMPONENT_DEPTH_TARGETS)[number];

function isComponentDepthTarget(
  targetAssetType: string
): targetAssetType is ComponentDepthTarget {
  return COMPONENT_DEPTH_TARGETS.some((target) => target === targetAssetType);
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

export function parseComponentTopologyRow(
  input: unknown,
  label: string
): SdlcComponentTopologyRow {
  const record = parseClosedRecord(normalizeComponentTopologyRow(input), label, [
    "kind",
    "componentId",
    "moduleName",
    "relativePath",
    "publicBoundary",
    "concernRole",
    "requirementIds",
    "sourceAssetRefs"
  ]);
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_component_topology_row"
  });
  return Object.freeze({
    kind: "sdlc_component_topology_row" as const,
    componentId: parseNonEmptyString(record["componentId"], `${label}.componentId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    relativePath: parseNonEmptyString(record["relativePath"], `${label}.relativePath`),
    publicBoundary: parseNonEmptyString(record["publicBoundary"], `${label}.publicBoundary`),
    concernRole: admitExactContractEnum({
      value: record["concernRole"],
      label: `${label}.concernRole`,
      values: SDLC_COMPONENT_CONCERN_ROLES
    }),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    sourceAssetRefs: parseStringList(record["sourceAssetRefs"], `${label}.sourceAssetRefs`)
  });
}

export function parseComponentRealizationRow(
  input: unknown,
  label: string
): SdlcComponentRealizationRow {
  const record = parseClosedRecord(normalizeComponentRealizationRow(input), label, [
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
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_component_realization_row"
  });
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

export function parseTestComponentTopologyRow(
  input: unknown,
  label: string
): SdlcTestComponentTopologyRow {
  const record = parseClosedRecord(normalizeTestComponentTopologyRow(input), label, [
    "kind",
    "testClassId",
    "relativePath",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "shardId"
  ]);
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_test_component_topology_row"
  });
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
  const record = parseClosedRecord(normalizeComponentTestRealizationRow(input), label, [
    "kind",
    "testClassId",
    "relativePath",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "shardId"
  ]);
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_component_test_realization_row"
  });
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
  const record = parseClosedRecord(
    normalizeComponentTestQualificationRow(input),
    label,
    [
    "kind",
    "testClassId",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "status",
    "evidenceRefs"
    ]
  );
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_component_test_qualification_row"
  });
  return Object.freeze({
    kind: "sdlc_component_test_qualification_row" as const,
    testClassId: parseNonEmptyString(record["testClassId"], `${label}.testClassId`),
    testcaseIds: parseStringList(record["testcaseIds"], `${label}.testcaseIds`),
    componentIds: parseStringList(record["componentIds"], `${label}.componentIds`),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    status: admitExactContractEnum({
      value: record["status"],
      label: `${label}.status`,
      values: [
        "passed",
        "failed",
        "blocked",
        "pending",
        "unproven"
      ] as const
    }),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseComponentExecutionFailureRow(
  input: unknown,
  label: string
): SdlcComponentExecutionFailureRow {
  const record = parseClosedRecord(normalizeComponentExecutionFailureRow(input), label, [
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
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_component_execution_failure_row"
  });
  return Object.freeze({
    kind: "sdlc_component_execution_failure_row" as const,
    failureId: parseNonEmptyString(record["failureId"], `${label}.failureId`),
    shardId: parseNonEmptyString(record["shardId"], `${label}.shardId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    testClassId: parseNonEmptyString(record["testClassId"], `${label}.testClassId`),
    testcaseIds: parseStringList(record["testcaseIds"], `${label}.testcaseIds`),
    componentIds: parseStringList(record["componentIds"], `${label}.componentIds`),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    failureKind: admitExactContractEnum({
      value: record["failureKind"],
      label: `${label}.failureKind`,
      values: SDLC_COMPONENT_EXECUTION_FAILURE_KINDS
    }),
    repairTarget: admitDeclaredAlias({
      value: record["repairTarget"],
      label: `${label}.repairTarget`,
      values: SDLC_COMPONENT_REPAIR_TARGETS,
      aliases: repairTargetAliasesFor(record)
    }),
    lawfulReentryPoint: parseNonEmptyString(
      record["lawfulReentryPoint"],
      `${label}.lawfulReentryPoint`
    ),
    attributionConfidence: admitExactContractEnum({
      value: record["attributionConfidence"],
      label: `${label}.attributionConfidence`,
      values: SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE
    }),
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
  const record = parseClosedRecord(normalizeComponentExecutionFailureRegister(input), label, [
    "kind",
    "registerVersion",
    "failureRows"
  ]);
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "component_execution_failure_register"
  });
  admitExactProtocolVersion({
    value: record["registerVersion"],
    label: `${label}.registerVersion`,
    expected: "ts-component-depth-v1"
  });
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
  const record = parseClosedRecord(normalizeComponentRepairScheduleRow(input), label, [
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
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_component_repair_schedule_row"
  });
  return Object.freeze({
    kind: "sdlc_component_repair_schedule_row" as const,
    scheduleId: parseNonEmptyString(record["scheduleId"], `${label}.scheduleId`),
    failureId: parseNonEmptyString(record["failureId"], `${label}.failureId`),
    repairTarget: admitDeclaredAlias({
      value: record["repairTarget"],
      label: `${label}.repairTarget`,
      values: SDLC_COMPONENT_REPAIR_TARGETS,
      aliases: repairTargetAliasesFor(record)
    }),
    lawfulReentryPoint: parseNonEmptyString(
      record["lawfulReentryPoint"],
      `${label}.lawfulReentryPoint`
    ),
    attributionConfidence: admitExactContractEnum({
      value: record["attributionConfidence"],
      label: `${label}.attributionConfidence`,
      values: SDLC_COMPONENT_ATTRIBUTION_CONFIDENCE
    }),
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
  const record = parseClosedRecord(normalizeComponentRepairSchedule(input), label, [
    "kind",
    "registerVersion",
    "scheduleStatus",
    "repairRows",
    "evidenceRefs"
  ]);
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_component_repair_schedule"
  });
  admitExactProtocolVersion({
    value: record["registerVersion"],
    label: `${label}.registerVersion`,
    expected: "ts-component-depth-v1"
  });
  return Object.freeze({
    kind: "sdlc_component_repair_schedule" as const,
    registerVersion: "ts-component-depth-v1" as const,
    scheduleStatus: admitExactContractEnum({
      value: record["scheduleStatus"],
      label: `${label}.scheduleStatus`,
      values: SDLC_COMPONENT_REPAIR_SCHEDULE_STATUSES
    }),
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
  const record = parseClosedRecord(normalizeReleaseDepthParity(input), label, [
    "kind",
    "status",
    "summary",
    "blockingReasons",
    "evidenceRefs"
  ]);
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_release_depth_parity_assessment"
  });
  return Object.freeze({
    kind: "sdlc_release_depth_parity_assessment" as const,
    status: admitExactContractEnum({
      value: record["status"],
      label: `${label}.status`,
      values: ["met", "blocked", "repriced"] as const
    }),
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
  admitExactProtocolString({
    value: record["kind"],
    label: `${label}.kind`,
    expected: "sdlc_component_depth_register"
  });
  const targetAssetType = parseNonEmptyString(record["targetAssetType"], `${label}.targetAssetType`);
  const registerVersion = parseNonEmptyString(record["registerVersion"], `${label}.registerVersion`);
  admitExactProtocolVersion({
    value: registerVersion,
    label: `${label}.registerVersion`,
    expected: "ts-component-depth-v1"
  });
  const repairSchedule =
    targetAssetType === "component_repair_schedule_surface" ||
    targetAssetType === "release_depth_parity_surface"
      ? parseComponentRepairSchedule(
          record["componentRepairSchedule"] ?? record["component_repair_schedule"],
          `${label}.componentRepairSchedule`
        )
      : null;
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
    componentRepairSchedule: repairSchedule,
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

function optionalTrimmedString(input: unknown): string | null {
  if (typeof input !== "string") {
    return null;
  }
  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeComponentPublicBoundary(input: unknown): unknown {
  if (typeof input === "boolean") {
    return input ? "public" : "internal";
  }
  return input;
}

function normalizeComponentConcernRole(input: unknown): unknown {
  const value = optionalTrimmedString(input);
  if (value === null) {
    return input;
  }
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "_")
    .replace(/^_+|_+$/gu, "");
  const aliases: Readonly<Record<string, string>> = Object.freeze({
    parse: "parser",
    parsing: "parser",
    parser: "parser",
    validate: "validator",
    validation: "validator",
    validator: "validator",
    map: "mapper",
    mapping: "mapper",
    mapper: "mapper",
    error: "error_model",
    error_model: "error_model",
    error_reporting: "reporting",
    reporting: "reporting",
    report: "reporting",
    io: "io_adapter",
    io_adapter: "io_adapter",
    adapter: "io_adapter",
    domain: "domain_model",
    domain_model: "domain_model",
    model: "domain_model",
    other: "other",
    public_boundary: "other"
  });
  return aliases[normalized] ?? input;
}

function normalizeComponentTopologyRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const concernRole =
    record["concernRole"] ??
    record["concern"] ??
    record["domainCarrier"] ??
    record["adapter"];
  return Object.freeze({
    kind: record["kind"] ?? "sdlc_component_topology_row",
    componentId: record["componentId"],
    moduleName: record["moduleName"],
    relativePath: record["relativePath"],
    publicBoundary: normalizeComponentPublicBoundary(record["publicBoundary"]),
    concernRole: normalizeComponentConcernRole(concernRole),
    requirementIds: record["requirementIds"],
    sourceAssetRefs: record["sourceAssetRefs"]
  });
}

function normalizeComponentTopologyRows(input: unknown): unknown {
  if (input === undefined || !Array.isArray(input)) {
    return input;
  }
  return Object.freeze(input.map((item) => normalizeComponentTopologyRow(item)));
}

function normalizeComponentRealizationRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return Object.freeze({
    kind: record["kind"],
    componentId: record["componentId"],
    moduleName: record["moduleName"],
    relativePath: record["relativePath"],
    publicBoundary: normalizeComponentPublicBoundary(record["publicBoundary"]),
    trancheId: record["trancheId"],
    firstProductFileToChange: record["firstProductFileToChange"],
    upstreamComponentIds: record["upstreamComponentIds"],
    requirementIds: record["requirementIds"],
    sourceAssetRefs: record["sourceAssetRefs"]
  });
}

function normalizeComponentRealizationRows(input: unknown): unknown {
  if (input === undefined || !Array.isArray(input)) {
    return input;
  }
  return Object.freeze(input.map((item) => normalizeComponentRealizationRow(item)));
}

function normalizeTestComponentTopologyRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return Object.freeze({
    kind: record["kind"],
    testClassId: record["testClassId"],
    relativePath: record["relativePath"],
    testcaseIds: record["testcaseIds"],
    componentIds: record["componentIds"] ?? record["coveredComponentIds"],
    requirementIds: record["requirementIds"],
    shardId:
      record["shardId"] ??
      record["expectedExecutionShard"] ??
      record["executionShard"] ??
      null
  });
}

function normalizeTestComponentTopologyRows(input: unknown): unknown {
  if (input === undefined || !Array.isArray(input)) {
    return input;
  }
  return Object.freeze(input.map((item) => normalizeTestComponentTopologyRow(item)));
}

function normalizeComponentTestRealizationRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const kind =
    record["kind"] === "sdlc_component_test_row"
      ? "sdlc_component_test_realization_row"
      : record["kind"];
  return Object.freeze({
    kind,
    testClassId: record["testClassId"],
    relativePath: record["relativePath"],
    testcaseIds: record["testcaseIds"],
    componentIds: record["componentIds"] ?? record["coveredComponentIds"],
    requirementIds: record["requirementIds"],
    shardId:
      record["shardId"] ??
      record["shard"] ??
      record["expectedExecutionShard"] ??
      record["executionShard"] ??
      null
  });
}

function normalizeComponentTestRealizationRows(input: unknown): unknown {
  if (input === undefined || !Array.isArray(input)) {
    return input;
  }
  return Object.freeze(input.map((item) => normalizeComponentTestRealizationRow(item)));
}

function normalizeComponentTestQualificationRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return Object.freeze({
    kind: record["kind"],
    testClassId: record["testClassId"],
    testcaseIds: record["testcaseIds"],
    componentIds: record["componentIds"] ?? record["coveredComponentIds"],
    requirementIds: record["requirementIds"],
    status: record["status"],
    evidenceRefs: record["evidenceRefs"]
  });
}

function normalizeComponentTestQualificationRows(input: unknown): unknown {
  if (input === undefined || !Array.isArray(input)) {
    return input;
  }
  return Object.freeze(
    input.map((item) => normalizeComponentTestQualificationRow(item))
  );
}

function normalizeRepairTarget(input: unknown, record: Record<string, unknown>): unknown {
  void record;
  if (input === "component_code" || input === "component_test") {
    return input;
  }
  if (typeof input === "string" && input.includes("/src/test/")) {
    return "component_test";
  }
  if (typeof input === "string" && input.includes("/src/main/")) {
    return "component_code";
  }
  return input;
}

function repairTargetAliasesFor(
  record: Record<string, unknown>
): Readonly<Record<string, SdlcComponentRepairTarget>> {
  void record;
  return Object.freeze({});
}

function normalizeComponentExecutionFailureRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return Object.freeze({
    kind: record["kind"],
    failureId: record["failureId"],
    shardId: record["shardId"],
    moduleName: record["moduleName"],
    testClassId: record["testClassId"],
    testcaseIds: record["testcaseIds"],
    componentIds: record["componentIds"],
    requirementIds: record["requirementIds"],
    failureKind: record["failureKind"],
    repairTarget: normalizeRepairTarget(record["repairTarget"], record),
    lawfulReentryPoint: record["lawfulReentryPoint"],
    attributionConfidence: record["attributionConfidence"],
    sourceRefs: record["sourceRefs"],
    testRefs: record["testRefs"],
    evidenceRefs: record["evidenceRefs"]
  });
}

function normalizeComponentExecutionFailureRegister(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return Object.freeze({
    kind: record["kind"],
    registerVersion: record["registerVersion"],
    failureRows: parseArray(
      record["failureRows"],
      "componentExecutionFailureRegister.failureRows",
      (item) => normalizeComponentExecutionFailureRow(item)
    )
  });
}

function stringValues(input: unknown): readonly string[] {
  if (!Array.isArray(input)) {
    return Object.freeze([]);
  }
  return Object.freeze(input.filter((item): item is string => typeof item === "string"));
}

function uniqueSortedStrings(input: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(input)].sort());
}

function normalizeComponentRepairScheduleRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return Object.freeze({
    kind: record["kind"],
    scheduleId: record["scheduleId"],
    failureId: record["failureId"],
    repairTarget: normalizeRepairTarget(record["repairTarget"], record),
    lawfulReentryPoint: record["lawfulReentryPoint"],
    attributionConfidence: record["attributionConfidence"],
    testcaseIds: record["testcaseIds"],
    componentIds: record["componentIds"],
    requirementIds: record["requirementIds"],
    sourceRefs: record["sourceRefs"],
    testRefs: record["testRefs"],
    evidenceRefs: record["evidenceRefs"]
  });
}

function normalizeComponentRepairSchedule(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const repairRows = parseArray(
    record["repairRows"],
    "componentRepairSchedule.repairRows",
    (item) => normalizeComponentRepairScheduleRow(item)
  );
  const derivedEvidenceRefs = uniqueSortedStrings(
    repairRows.flatMap((row) =>
      stringValues(objectRecord(row)?.["evidenceRefs"])
    )
  );
  return Object.freeze({
    kind: record["kind"],
    registerVersion: record["registerVersion"],
    scheduleStatus: record["scheduleStatus"],
    repairRows,
    evidenceRefs: record["evidenceRefs"] ?? derivedEvidenceRefs
  });
}

function normalizeReleaseDepthParity(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const reasonCodes = stringValues(record["reasonCodes"]);
  const blockerCodes = stringValues(record["blockerCodes"]);
  const derivedBlockingReasons =
    reasonCodes.length > 0 ? reasonCodes : blockerCodes;
  const blockingReasons =
    record["blockingReasons"] === undefined
      ? derivedBlockingReasons
      : record["blockingReasons"];
  const evidenceRefs =
    record["evidenceRefs"] === undefined
      ? stringValues(record["decisionBasis"])
      : record["evidenceRefs"];
  const summary =
    record["summary"] ??
    record["blockerDetail"] ??
    (derivedBlockingReasons.length > 0
      ? `Release depth parity blocked by ${derivedBlockingReasons.join(", ")}.`
      : "Release depth parity assessment emitted by worker.");
  return Object.freeze({
    kind: record["kind"],
    status: record["status"],
    summary,
    blockingReasons,
    evidenceRefs
  });
}

function componentDepthCandidateRecord(input: Record<string, unknown>): unknown {
  if (input["component_depth_register"] !== undefined) {
    return input["component_depth_register"];
  }
  if (input["componentDepthRegister"] !== undefined) {
    return input["componentDepthRegister"];
  }
  const payload = objectRecord(input["payload"]);
  if (payload?.["kind"] === "sdlc_component_depth_register") {
    return input["payload"];
  }
  if (
    input["kind"] === "sdlc_component_depth_register"
  ) {
    return input;
  }
  return null;
}

function normalizeCandidate(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const candidate = componentDepthCandidateRecord(record);
  const candidateRecord = objectRecord(candidate);
  if (candidateRecord !== null) {
    return Object.freeze({
      kind: candidateRecord["kind"],
      registerVersion: candidateRecord["registerVersion"],
      targetAssetType: candidateRecord["targetAssetType"],
      componentTopologyRows: normalizeComponentTopologyRows(
        candidateRecord["componentTopologyRows"]
      ),
      componentRealizationRows: normalizeComponentRealizationRows(
        candidateRecord["componentRealizationRows"]
      ),
      testComponentTopologyRows: normalizeTestComponentTopologyRows(
        candidateRecord["testComponentTopologyRows"]
      ),
      componentTestRows: normalizeComponentTestRealizationRows(
        candidateRecord["componentTestRows"]
      ),
      componentTestQualificationRows: normalizeComponentTestQualificationRows(
        candidateRecord["componentTestQualificationRows"]
      ),
      componentExecutionFailureRegister:
        normalizeComponentExecutionFailureRegister(
          candidateRecord["componentExecutionFailureRegister"]
        ),
      component_execution_failure_register:
        normalizeComponentExecutionFailureRegister(
          candidateRecord["component_execution_failure_register"]
        ),
      componentRepairSchedule: normalizeComponentRepairSchedule(
        candidateRecord["componentRepairSchedule"]
      ),
      component_repair_schedule:
        normalizeComponentRepairSchedule(
          candidateRecord["component_repair_schedule"]
        ),
      releaseDepthParity: normalizeReleaseDepthParity(
        candidateRecord["releaseDepthParity"]
      )
    });
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
    /^```([^\r\n`]*)\r?\n([\s\S]*?)^```[^\S\r\n]*$/gmu;
  for (const match of content.matchAll(fencedBlockExpression)) {
    const infoString = match[1]?.trim() ?? "";
    const infoParts = infoString.split(/\s+/u).filter((part) => part.length > 0);
    const language = infoParts[0] ?? "";
    if (
      infoString !== "" &&
      language !== "json" &&
      language !== "component_depth_register" &&
      language !== "componentDepthRegister" &&
      !infoParts.includes("component_depth_register") &&
      !infoParts.includes("componentDepthRegister")
    ) {
      continue;
    }
    const block = match[2]?.trim() ?? "";
    if (
      infoString === "" &&
      !block.startsWith("{") &&
      !block.startsWith("[")
    ) {
      continue;
    }
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
    case "component_code_surface":
    case "component_realization_qualification_surface":
      return input.register.componentRealizationRows.length > 0
        ? Object.freeze([])
        : Object.freeze(["component_depth_register_component_realization_rows_missing"]);
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
