// Implements: T-171

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
  SdlcTestExecutionPreparationRow,
  SdlcTestExecutionSurfaceRegister,
  SdlcTestExecutionSurfaceRegisterAdmission
} from "./carriers.js";

const TEST_EXECUTION_SURFACE_TARGETS = Object.freeze([
  "test_execution_surface"
] as const);

type TestExecutionSurfaceTarget = (typeof TEST_EXECUTION_SURFACE_TARGETS)[number];

function isTestExecutionSurfaceTarget(
  targetAssetType: string
): targetAssetType is TestExecutionSurfaceTarget {
  return TEST_EXECUTION_SURFACE_TARGETS.some((target) => target === targetAssetType);
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

function parsePreparationRow(
  input: unknown,
  label: string
): SdlcTestExecutionPreparationRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "scheduleRef",
    "moduleName",
    "testClassId",
    "testcaseIds",
    "command",
    "workingDirectory",
    "frameworkRef",
    "shardId",
    "sourceTestFileRefs",
    "requirementIds",
    "status",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_execution_preparation_row") {
    throw new TypeError(`${label}.kind: expected sdlc_test_execution_preparation_row`);
  }
  return Object.freeze({
    kind,
    scheduleRef: parseNonEmptyString(record["scheduleRef"], `${label}.scheduleRef`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    testClassId: parseNonEmptyString(record["testClassId"], `${label}.testClassId`),
    testcaseIds: parseStringList(record["testcaseIds"], `${label}.testcaseIds`),
    command: parseNonEmptyString(record["command"], `${label}.command`),
    workingDirectory: parseNonEmptyString(
      record["workingDirectory"],
      `${label}.workingDirectory`
    ),
    frameworkRef: parseNonEmptyString(record["frameworkRef"], `${label}.frameworkRef`),
    shardId: parseNullableNonEmptyString(record["shardId"], `${label}.shardId`),
    sourceTestFileRefs: parseStringList(
      record["sourceTestFileRefs"],
      `${label}.sourceTestFileRefs`
    ),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    status: parseEnumValue(record["status"], `${label}.status`, [
      "prepared",
      "blocked",
      "pending"
    ]),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseRegister(
  input: unknown,
  label: string
): SdlcTestExecutionSurfaceRegister {
  const record = parseClosedRecord(input, label, [
    "kind",
    "registerVersion",
    "targetAssetType",
    "testExecutionPreparationRows",
    "evidenceRefs",
    "summary"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_execution_surface_register") {
    throw new TypeError(`${label}.kind: expected sdlc_test_execution_surface_register`);
  }
  const registerVersion = parseNonEmptyString(
    record["registerVersion"],
    `${label}.registerVersion`
  );
  if (registerVersion !== "ts-test-execution-v1") {
    throw new TypeError(`${label}.registerVersion: expected ts-test-execution-v1`);
  }
  const targetAssetType = parseNonEmptyString(
    record["targetAssetType"],
    `${label}.targetAssetType`
  );
  if (targetAssetType !== "test_execution_surface") {
    throw new TypeError(`${label}.targetAssetType: expected test_execution_surface`);
  }
  return Object.freeze({
    kind,
    registerVersion,
    targetAssetType,
    testExecutionPreparationRows: parseArray(
      record["testExecutionPreparationRows"],
      `${label}.testExecutionPreparationRows`,
      parsePreparationRow
    ),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`),
    summary:
      record["summary"] === undefined
        ? null
        : parseNullableNonEmptyString(record["summary"], `${label}.summary`)
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
  if (record["test_execution_surface_register"] !== undefined) {
    return normalizeCandidate(record["test_execution_surface_register"]);
  }
  if (record["testExecutionSurfaceRegister"] !== undefined) {
    return normalizeCandidate(record["testExecutionSurfaceRegister"]);
  }
  const payload = objectRecord(record["payload"]);
  if (payload?.["kind"] === "sdlc_test_execution_surface_register") {
    return record["payload"];
  }
  if (record["kind"] === "sdlc_test_execution_surface_register") {
    return input;
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
      language !== "test_execution_surface_register" &&
      language !== "testExecutionSurfaceRegister" &&
      !infoParts.includes("test_execution_surface_register") &&
      !infoParts.includes("testExecutionSurfaceRegister")
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

function requiredRowsPresent(
  register: SdlcTestExecutionSurfaceRegister
): readonly string[] {
  return Object.freeze([
    ...(register.testExecutionPreparationRows.length > 0
      ? []
      : ["test_execution_surface_register_preparation_rows_missing"])
  ]);
}

export function admitTestExecutionSurfaceRegisterFromArtifact(input: {
  readonly targetAssetType: string;
  readonly outputFile: string;
}): SdlcTestExecutionSurfaceRegisterAdmission {
  const evidenceRefs = Object.freeze([pathToFileURL(input.outputFile).href]);
  if (!isTestExecutionSurfaceTarget(input.targetAssetType)) {
    return Object.freeze({
      kind: "sdlc_test_execution_surface_register_admission" as const,
      status: "not_required" as const,
      targetAssetType: input.targetAssetType,
      register: null,
      blockingReasons: Object.freeze([]),
      evidenceRefs
    });
  }
  if (!existsSync(input.outputFile) || !statSync(input.outputFile).isFile()) {
    return Object.freeze({
      kind: "sdlc_test_execution_surface_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: input.targetAssetType,
      register: null,
      blockingReasons: Object.freeze(["test_execution_surface_output_missing"]),
      evidenceRefs
    });
  }
  const content = readFileSync(input.outputFile, "utf8");
  const errors: string[] = [];
  for (const candidate of jsonCandidates(content)) {
    try {
      const register = parseRegister(
        normalizeCandidate(candidate),
        "test_execution_surface_register"
      );
      const rowReasons = requiredRowsPresent(register);
      if (rowReasons.length > 0) {
        return Object.freeze({
          kind: "sdlc_test_execution_surface_register_admission" as const,
          status: "rejected" as const,
          targetAssetType: input.targetAssetType,
          register,
          blockingReasons: rowReasons,
          evidenceRefs
        });
      }
      return Object.freeze({
        kind: "sdlc_test_execution_surface_register_admission" as const,
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
    kind: "sdlc_test_execution_surface_register_admission" as const,
    status: "rejected" as const,
    targetAssetType: input.targetAssetType,
    register: null,
    blockingReasons: Object.freeze(
      errors.length === 0
        ? ["test_execution_surface_register_missing"]
        : [`test_execution_surface_register_invalid:${errors.join("; ")}`]
    ),
    evidenceRefs
  });
}
