// Implements: T-168
// Implements: T-169

import { existsSync, readFileSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString,
  parseNullableNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import { parseTestComponentTopologyRow } from "./component_depth_register.js";
import type {
  SdlcDesignConsumptionContract,
  SdlcExpectedResultBinding,
  SdlcTestCaseRow,
  SdlcTestDataBinding,
  SdlcTestDesignRegister,
  SdlcTestDesignRegisterAdmission,
  SdlcTestExecutionScheduleRow,
  SdlcTestModuleRow,
  SdlcTestStackProfileRow,
  SdlcUatIntegrationBinding
} from "./carriers.js";
import {
  SDLC_TEST_CASE_KINDS,
  SDLC_TEST_EXECUTION_LANES
} from "./carriers.js";

const TEST_DESIGN_TARGETS = Object.freeze([
  "test_design_surface"
] as const);

const TEST_DESIGN_SHAPE_ERROR_LIMIT = 40;

const TEST_DESIGN_REGISTER_ROW_KEYS = Object.freeze({
  designConsumptionRows: Object.freeze([
    "kind",
    "contractRef",
    "sourceDesignObligationRefs",
    "authorityBasisRefs",
    "consumerGraphFunctionRefs"
  ]),
  uatTestcaseRows: Object.freeze([
    "kind",
    "testCaseRef",
    "caseKind",
    "executionLane",
    "sourceDesignObligationRefs",
    "testcaseAuthorityRefs",
    "expectedBehavior"
  ]),
  testcaseAuthorityRows: Object.freeze([
    "kind",
    "testCaseRef",
    "caseKind",
    "executionLane",
    "sourceDesignObligationRefs",
    "testcaseAuthorityRefs",
    "expectedBehavior"
  ]),
  testStackProfileRows: Object.freeze([
    "kind",
    "stackRef",
    "frameworkRef",
    "buildTool"
  ]),
  testModuleRows: Object.freeze([
    "kind",
    "moduleName",
    "moduleRef",
    "testRoot"
  ]),
  testComponentTopologyRows: Object.freeze([
    "kind",
    "testClassId",
    "relativePath",
    "testcaseIds",
    "componentIds",
    "requirementIds",
    "shardId"
  ]),
  testDataBindings: Object.freeze([
    "kind",
    "testDataRef",
    "testCaseRef",
    "inputFixtureRefs",
    "generationPolicyRef",
    "expectedResultRef",
    "sourceDesignObligationRefs"
  ]),
  expectedResultBindings: Object.freeze([
    "kind",
    "expectedResultRef",
    "testCaseRef",
    "assertionRefs",
    "expectedResultSummary",
    "verificationPolicyRef"
  ]),
  uatIntegrationBindings: Object.freeze([
    "kind",
    "uatTestCaseRef",
    "integrationTestCaseRef",
    "executionLane"
  ]),
  testExecutionScheduleRows: Object.freeze([
    "kind",
    "scheduleRef",
    "testCaseRefs",
    "command",
    "frameworkRef",
    "shardId"
  ])
} as const);

type TestDesignTarget = (typeof TEST_DESIGN_TARGETS)[number];

type TestDesignRegisterRowCollection =
  keyof typeof TEST_DESIGN_REGISTER_ROW_KEYS;

const TEST_DESIGN_REGISTER_ROW_COLLECTIONS: readonly TestDesignRegisterRowCollection[] =
  Object.freeze([
    "designConsumptionRows",
    "uatTestcaseRows",
    "testcaseAuthorityRows",
    "testStackProfileRows",
    "testModuleRows",
    "testComponentTopologyRows",
    "testDataBindings",
    "expectedResultBindings",
    "uatIntegrationBindings",
    "testExecutionScheduleRows"
  ]);

function isTestDesignTarget(
  targetAssetType: string
): targetAssetType is TestDesignTarget {
  return TEST_DESIGN_TARGETS.some((target) => target === targetAssetType);
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

function parseDesignConsumptionRow(
  input: unknown,
  label: string
): SdlcDesignConsumptionContract {
  const record = parseClosedRecord(input, label, [
    "kind",
    "contractRef",
    "sourceDesignObligationRefs",
    "authorityBasisRefs",
    "consumerGraphFunctionRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_design_consumption_contract") {
    throw new TypeError(`${label}.kind: expected sdlc_design_consumption_contract`);
  }
  return Object.freeze({
    kind: "sdlc_design_consumption_contract" as const,
    contractRef: parseNonEmptyString(record["contractRef"], `${label}.contractRef`),
    sourceDesignObligationRefs: parseStringList(
      record["sourceDesignObligationRefs"],
      `${label}.sourceDesignObligationRefs`
    ),
    authorityBasisRefs: parseStringList(
      record["authorityBasisRefs"],
      `${label}.authorityBasisRefs`
    ),
    consumerGraphFunctionRefs: parseStringList(
      record["consumerGraphFunctionRefs"],
      `${label}.consumerGraphFunctionRefs`
    )
  });
}

function parseTestCaseRow(input: unknown, label: string): SdlcTestCaseRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "testCaseRef",
    "caseKind",
    "executionLane",
    "sourceDesignObligationRefs",
    "testcaseAuthorityRefs",
    "expectedBehavior"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_case_row") {
    throw new TypeError(`${label}.kind: expected sdlc_test_case_row`);
  }
  return Object.freeze({
    kind: "sdlc_test_case_row" as const,
    testCaseRef: parseNonEmptyString(record["testCaseRef"], `${label}.testCaseRef`),
    caseKind: parseEnumValue(record["caseKind"], `${label}.caseKind`, SDLC_TEST_CASE_KINDS),
    executionLane: parseEnumValue(
      record["executionLane"],
      `${label}.executionLane`,
      SDLC_TEST_EXECUTION_LANES
    ),
    sourceDesignObligationRefs: parseStringList(
      record["sourceDesignObligationRefs"],
      `${label}.sourceDesignObligationRefs`
    ),
    testcaseAuthorityRefs: parseStringList(
      record["testcaseAuthorityRefs"],
      `${label}.testcaseAuthorityRefs`
    ),
    expectedBehavior: parseNonEmptyString(
      record["expectedBehavior"],
      `${label}.expectedBehavior`
    )
  });
}

function parseTestStackProfileRow(
  input: unknown,
  label: string
): SdlcTestStackProfileRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "stackRef",
    "frameworkRef",
    "buildTool"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_stack_profile_row") {
    throw new TypeError(`${label}.kind: expected sdlc_test_stack_profile_row`);
  }
  return Object.freeze({
    kind: "sdlc_test_stack_profile_row" as const,
    stackRef: parseNonEmptyString(record["stackRef"], `${label}.stackRef`),
    frameworkRef: parseNonEmptyString(record["frameworkRef"], `${label}.frameworkRef`),
    buildTool: parseNonEmptyString(record["buildTool"], `${label}.buildTool`)
  });
}

function parseTestModuleRow(input: unknown, label: string): SdlcTestModuleRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "moduleName",
    "moduleRef",
    "testRoot"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_module_row") {
    throw new TypeError(`${label}.kind: expected sdlc_test_module_row`);
  }
  return Object.freeze({
    kind: "sdlc_test_module_row" as const,
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    moduleRef: parseNonEmptyString(record["moduleRef"], `${label}.moduleRef`),
    testRoot: parseNonEmptyString(record["testRoot"], `${label}.testRoot`)
  });
}

function parseTestDataBinding(
  input: unknown,
  label: string
): SdlcTestDataBinding {
  const record = parseClosedRecord(input, label, [
    "kind",
    "testDataRef",
    "testCaseRef",
    "inputFixtureRefs",
    "generationPolicyRef",
    "expectedResultRef",
    "sourceDesignObligationRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_data_binding") {
    throw new TypeError(`${label}.kind: expected sdlc_test_data_binding`);
  }
  return Object.freeze({
    kind: "sdlc_test_data_binding" as const,
    testDataRef: parseNonEmptyString(record["testDataRef"], `${label}.testDataRef`),
    testCaseRef: parseNonEmptyString(record["testCaseRef"], `${label}.testCaseRef`),
    inputFixtureRefs: parseStringList(
      record["inputFixtureRefs"],
      `${label}.inputFixtureRefs`
    ),
    generationPolicyRef: parseNonEmptyString(
      record["generationPolicyRef"],
      `${label}.generationPolicyRef`
    ),
    expectedResultRef: parseNonEmptyString(
      record["expectedResultRef"],
      `${label}.expectedResultRef`
    ),
    sourceDesignObligationRefs: parseStringList(
      record["sourceDesignObligationRefs"],
      `${label}.sourceDesignObligationRefs`
    )
  });
}

function parseExpectedResultBinding(
  input: unknown,
  label: string
): SdlcExpectedResultBinding {
  const record = parseClosedRecord(input, label, [
    "kind",
    "expectedResultRef",
    "testCaseRef",
    "assertionRefs",
    "expectedResultSummary",
    "verificationPolicyRef"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_expected_result_binding") {
    throw new TypeError(`${label}.kind: expected sdlc_expected_result_binding`);
  }
  return Object.freeze({
    kind: "sdlc_expected_result_binding" as const,
    expectedResultRef: parseNonEmptyString(
      record["expectedResultRef"],
      `${label}.expectedResultRef`
    ),
    testCaseRef: parseNonEmptyString(record["testCaseRef"], `${label}.testCaseRef`),
    assertionRefs: parseStringList(record["assertionRefs"], `${label}.assertionRefs`),
    expectedResultSummary: parseNonEmptyString(
      record["expectedResultSummary"],
      `${label}.expectedResultSummary`
    ),
    verificationPolicyRef: parseNonEmptyString(
      record["verificationPolicyRef"],
      `${label}.verificationPolicyRef`
    )
  });
}

function parseUatIntegrationBinding(
  input: unknown,
  label: string
): SdlcUatIntegrationBinding {
  const record = parseClosedRecord(input, label, [
    "kind",
    "uatTestCaseRef",
    "integrationTestCaseRef",
    "executionLane"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_uat_integration_binding") {
    throw new TypeError(`${label}.kind: expected sdlc_uat_integration_binding`);
  }
  return Object.freeze({
    kind: "sdlc_uat_integration_binding" as const,
    uatTestCaseRef: parseNonEmptyString(
      record["uatTestCaseRef"],
      `${label}.uatTestCaseRef`
    ),
    integrationTestCaseRef: parseNonEmptyString(
      record["integrationTestCaseRef"],
      `${label}.integrationTestCaseRef`
    ),
    executionLane: parseEnumValue(
      record["executionLane"],
      `${label}.executionLane`,
      SDLC_TEST_EXECUTION_LANES
    )
  });
}

function parseTestExecutionScheduleRow(
  input: unknown,
  label: string
): SdlcTestExecutionScheduleRow {
  const record = parseClosedRecord(input, label, [
    "kind",
    "scheduleRef",
    "testCaseRefs",
    "command",
    "frameworkRef",
    "shardId"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_execution_schedule_row") {
    throw new TypeError(`${label}.kind: expected sdlc_test_execution_schedule_row`);
  }
  return Object.freeze({
    kind: "sdlc_test_execution_schedule_row" as const,
    scheduleRef: parseNonEmptyString(record["scheduleRef"], `${label}.scheduleRef`),
    testCaseRefs: parseStringList(record["testCaseRefs"], `${label}.testCaseRefs`),
    command: parseNonEmptyString(record["command"], `${label}.command`),
    frameworkRef: parseNonEmptyString(record["frameworkRef"], `${label}.frameworkRef`),
    shardId:
      record["shardId"] === undefined
        ? null
        : parseNullableNonEmptyString(record["shardId"], `${label}.shardId`)
  });
}

function parseRegister(input: unknown, label: string): SdlcTestDesignRegister {
  const record = parseClosedRecord(input, label, [
    "kind",
    "registerVersion",
    "targetAssetType",
    "designConsumptionRows",
    "uatTestcaseRows",
    "testcaseAuthorityRows",
    "testStackProfileRows",
    "testModuleRows",
    "testComponentTopologyRows",
    "testDataBindings",
    "expectedResultBindings",
    "uatIntegrationBindings",
    "testExecutionScheduleRows"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_test_design_register") {
    throw new TypeError(`${label}.kind: expected sdlc_test_design_register`);
  }
  const registerVersion = parseNonEmptyString(
    record["registerVersion"],
    `${label}.registerVersion`
  );
  if (registerVersion !== "ts-test-design-v1") {
    throw new TypeError(`${label}.registerVersion: expected ts-test-design-v1`);
  }
  return Object.freeze({
    kind: "sdlc_test_design_register" as const,
    registerVersion: "ts-test-design-v1" as const,
    targetAssetType: parseNonEmptyString(
      record["targetAssetType"],
      `${label}.targetAssetType`
    ),
    designConsumptionRows: parseArray(
      record["designConsumptionRows"],
      `${label}.designConsumptionRows`,
      parseDesignConsumptionRow
    ),
    uatTestcaseRows: parseArray(
      record["uatTestcaseRows"],
      `${label}.uatTestcaseRows`,
      parseTestCaseRow
    ),
    testcaseAuthorityRows: parseArray(
      record["testcaseAuthorityRows"],
      `${label}.testcaseAuthorityRows`,
      parseTestCaseRow
    ),
    testStackProfileRows: parseArray(
      record["testStackProfileRows"],
      `${label}.testStackProfileRows`,
      parseTestStackProfileRow
    ),
    testModuleRows: parseArray(
      record["testModuleRows"],
      `${label}.testModuleRows`,
      parseTestModuleRow
    ),
    testComponentTopologyRows: parseArray(
      record["testComponentTopologyRows"],
      `${label}.testComponentTopologyRows`,
      parseTestComponentTopologyRow
    ),
    testDataBindings: parseArray(
      record["testDataBindings"],
      `${label}.testDataBindings`,
      parseTestDataBinding
    ),
    expectedResultBindings: parseArray(
      record["expectedResultBindings"],
      `${label}.expectedResultBindings`,
      parseExpectedResultBinding
    ),
    uatIntegrationBindings: parseArray(
      record["uatIntegrationBindings"],
      `${label}.uatIntegrationBindings`,
      parseUatIntegrationBinding
    ),
    testExecutionScheduleRows: parseArray(
      record["testExecutionScheduleRows"],
      `${label}.testExecutionScheduleRows`,
      parseTestExecutionScheduleRow
    )
  });
}

function objectRecord(input: unknown): Record<string, unknown> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  return Object.fromEntries(Object.entries(input));
}

function unknownArrayValue(input: unknown): readonly unknown[] {
  if (!Array.isArray(input)) {
    return Object.freeze([]);
  }
  return Object.freeze(input.map((item: unknown): unknown => item));
}

function pushUniqueCapped(errors: string[], error: string): void {
  if (errors.includes(error)) {
    return;
  }
  if (errors.length < TEST_DESIGN_SHAPE_ERROR_LIMIT) {
    errors.push(error);
    return;
  }
  const overflowIndex = errors.findIndex((item) =>
    item.startsWith("test_design_register_additional_shape_errors:")
  );
  if (overflowIndex === -1) {
    errors.push("test_design_register_additional_shape_errors:1");
    return;
  }
  const overflowValue = errors[overflowIndex] ?? "";
  const count = Number.parseInt(overflowValue.split(":")[1] ?? "0", 10);
  errors[overflowIndex] = `test_design_register_additional_shape_errors:${count + 1}`;
}

function collectClosedObjectShapeErrors(input: {
  readonly record: Record<string, unknown>;
  readonly label: string;
  readonly allowedKeys: readonly string[];
  readonly errors: string[];
}): void {
  const allowed = new Set(input.allowedKeys);
  for (const key of Object.keys(input.record)) {
    if (!allowed.has(key)) {
      pushUniqueCapped(input.errors, `${input.label}.${key}: unexpected field`);
    }
  }
  for (const key of input.allowedKeys) {
    if (input.record[key] === undefined) {
      pushUniqueCapped(input.errors, `${input.label}.${key}: missing field`);
    }
  }
}

function collectStringFieldShapeError(input: {
  readonly record: Record<string, unknown>;
  readonly label: string;
  readonly key: string;
  readonly errors: string[];
}): void {
  const value = input.record[input.key];
  if (value === undefined) {
    return;
  }
  if (typeof value !== "string") {
    pushUniqueCapped(
      input.errors,
      `${input.label}.${input.key}: expected string`
    );
    return;
  }
  if (value.length === 0) {
    pushUniqueCapped(
      input.errors,
      `${input.label}.${input.key}: expected non-empty string`
    );
  }
}

function collectStringListFieldShapeError(input: {
  readonly record: Record<string, unknown>;
  readonly label: string;
  readonly key: string;
  readonly errors: string[];
}): void {
  const value = input.record[input.key];
  if (value === undefined) {
    return;
  }
  if (!Array.isArray(value)) {
    pushUniqueCapped(
      input.errors,
      `${input.label}.${input.key}: expected array`
    );
    return;
  }
  value.forEach((item, index) => {
    if (typeof item !== "string") {
      pushUniqueCapped(
        input.errors,
        `${input.label}.${input.key}[${index}]: expected string`
      );
      return;
    }
    if (item.length === 0) {
      pushUniqueCapped(
        input.errors,
        `${input.label}.${input.key}[${index}]: expected non-empty string`
      );
    }
  });
}

function collectEnumFieldShapeError<T extends string>(input: {
  readonly record: Record<string, unknown>;
  readonly label: string;
  readonly key: string;
  readonly values: readonly T[];
  readonly errors: string[];
}): void {
  const value = input.record[input.key];
  if (value === undefined) {
    return;
  }
  if (typeof value !== "string" || !input.values.some((item) => item === value)) {
    pushUniqueCapped(
      input.errors,
      `${input.label}.${input.key}: expected one of ${input.values
        .map((item) => JSON.stringify(item))
        .join(", ")}`
    );
  }
}

function collectTestCaseRowShapeErrors(input: {
  readonly record: Record<string, unknown>;
  readonly label: string;
  readonly errors: string[];
}): void {
  collectStringFieldShapeError({
    record: input.record,
    label: input.label,
    key: "testCaseRef",
    errors: input.errors
  });
  collectEnumFieldShapeError({
    record: input.record,
    label: input.label,
    key: "caseKind",
    values: SDLC_TEST_CASE_KINDS,
    errors: input.errors
  });
  collectEnumFieldShapeError({
    record: input.record,
    label: input.label,
    key: "executionLane",
    values: SDLC_TEST_EXECUTION_LANES,
    errors: input.errors
  });
  collectStringListFieldShapeError({
    record: input.record,
    label: input.label,
    key: "sourceDesignObligationRefs",
    errors: input.errors
  });
  collectStringListFieldShapeError({
    record: input.record,
    label: input.label,
    key: "testcaseAuthorityRefs",
    errors: input.errors
  });
  collectStringFieldShapeError({
    record: input.record,
    label: input.label,
    key: "expectedBehavior",
    errors: input.errors
  });
}

function collectKnownRowShapeErrors(input: {
  readonly collection: TestDesignRegisterRowCollection;
  readonly record: Record<string, unknown>;
  readonly label: string;
  readonly errors: string[];
}): void {
  if (
    input.collection === "uatTestcaseRows" ||
    input.collection === "testcaseAuthorityRows"
  ) {
    collectTestCaseRowShapeErrors({
      record: input.record,
      label: input.label,
      errors: input.errors
    });
  }
}

function testDesignRegisterShapeErrors(input: unknown): readonly string[] {
  const record = objectRecord(input);
  if (record?.["kind"] !== "sdlc_test_design_register") {
    return Object.freeze([]);
  }
  const errors: string[] = [];
  for (const collection of TEST_DESIGN_REGISTER_ROW_COLLECTIONS) {
    const rows = record[collection];
    const collectionLabel = `test_design_register.${collection}`;
    if (rows === undefined) {
      pushUniqueCapped(errors, `${collectionLabel}: missing field`);
      continue;
    }
    if (!Array.isArray(rows)) {
      pushUniqueCapped(errors, `${collectionLabel}: expected array`);
      continue;
    }
    rows.forEach((item, index) => {
      const rowLabel = `${collectionLabel}[${index}]`;
      const rowRecord = objectRecord(item);
      if (rowRecord === null) {
        pushUniqueCapped(errors, `${rowLabel}: expected closed object`);
        return;
      }
      collectClosedObjectShapeErrors({
        record: rowRecord,
        label: rowLabel,
        allowedKeys: TEST_DESIGN_REGISTER_ROW_KEYS[collection],
        errors
      });
      collectKnownRowShapeErrors({
        collection,
        record: rowRecord,
        label: rowLabel,
        errors
      });
    });
  }
  return Object.freeze(errors);
}

function testDesignCandidateRecord(input: Record<string, unknown>): unknown {
  if (input["test_design_register"] !== undefined) {
    return input["test_design_register"];
  }
  if (input["testDesignRegister"] !== undefined) {
    return input["testDesignRegister"];
  }
  const payload = objectRecord(input["payload"]);
  if (payload?.["kind"] === "sdlc_test_design_register") {
    return input["payload"];
  }
  if (input["kind"] === "sdlc_test_design_register") {
    return input;
  }
  return null;
}

function stringValue(input: unknown): string | null {
  return typeof input === "string" && input.trim().length > 0
    ? input.trim()
    : null;
}

function stringListValue(input: unknown): readonly string[] {
  if (!Array.isArray(input)) {
    return Object.freeze([]);
  }
  return Object.freeze(
    input
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  );
}

function slugRefPart(input: string): string {
  return encodeURIComponent(
    input
      .trim()
      .replace(/[^A-Za-z0-9]+/gu, "-")
      .replace(/^-+|-+$/gu, "")
      .toLowerCase() || "unnamed"
  );
}

function normalizeTestCaseKind(input: unknown): string {
  const value = stringValue(input)?.toLowerCase() ?? "";
  if (SDLC_TEST_CASE_KINDS.some((candidate) => candidate === value)) {
    return value;
  }
  if (value === "unit" || value === "smoke" || value === "happy_path") {
    return "positive";
  }
  return "positive";
}

function normalizeExecutionLane(input: unknown): string {
  const value = stringValue(input)?.toLowerCase() ?? "";
  if (SDLC_TEST_EXECUTION_LANES.some((candidate) => candidate === value)) {
    return value;
  }
  if (value.includes("uat") || value.includes("fan_in") || value.includes("terminal")) {
    return "uat";
  }
  if (value.includes("integration") || value.includes("composition")) {
    return "integration";
  }
  return "unit";
}

function testCaseRefFromRecord(record: Record<string, unknown>): string {
  return (
    stringValue(record["testCaseRef"]) ??
    stringValue(record["testCaseId"]) ??
    `testcase://odd-sdlc/${slugRefPart(JSON.stringify(record))}`
  );
}

function normalizeTestCaseRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const testCaseRef = testCaseRefFromRecord(record);
  const sourceDesignObligationRefs = stringListValue(
    record["sourceDesignObligationRefs"] ?? record["requirementIds"]
  );
  const testcaseAuthorityRefs = stringListValue(
    record["testcaseAuthorityRefs"] ?? record["scenarioRefs"]
  );
  return Object.freeze({
    kind: "sdlc_test_case_row",
    testCaseRef,
    caseKind: normalizeTestCaseKind(record["caseKind"]),
    executionLane: normalizeExecutionLane(record["executionLane"]),
    sourceDesignObligationRefs,
    testcaseAuthorityRefs,
    expectedBehavior:
      stringValue(record["expectedBehavior"]) ??
      `Expected behavior for ${testCaseRef}`
  });
}

function normalizeTestStackProfileRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const runner =
    stringValue(record["frameworkRef"]) ??
    stringValue(record["testRunner"]) ??
    stringValue(record["runtime"]) ??
    "test-runner";
  return Object.freeze({
    kind: "sdlc_test_stack_profile_row",
    stackRef:
      stringValue(record["stackRef"]) ??
      stringValue(record["stackProfileRef"]) ??
      `stack://test/${slugRefPart(runner)}`,
    frameworkRef: runner.startsWith("framework://")
      ? runner
      : `framework://${slugRefPart(runner)}`,
    buildTool:
      stringValue(record["buildTool"]) ??
      stringValue(record["testRunner"]) ??
      stringValue(record["runtime"]) ??
      "unspecified"
  });
}

function normalizeTestModuleRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const moduleName =
    stringValue(record["moduleName"]) ??
    stringValue(record["testModuleKey"]) ??
    stringValue(record["owningComponentId"]) ??
    "test_module";
  const rawRoot = stringValue(record["testRoot"]) ?? stringValue(record["relativePath"]);
  return Object.freeze({
    kind: "sdlc_test_module_row",
    moduleName,
    moduleRef:
      stringValue(record["moduleRef"]) ?? `module://test/${slugRefPart(moduleName)}`,
    testRoot: rawRoot ?? `runtime-evidence://${slugRefPart(moduleName)}`
  });
}

function normalizeTestComponentTopologyRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const testClassId =
    stringValue(record["testClassId"]) ??
    stringValue(record["testClassRef"]) ??
    stringValue(record["testModuleKey"]) ??
    "test_class";
  const rawPath = stringValue(record["relativePath"]);
  return Object.freeze({
    kind: "sdlc_test_component_topology_row",
    testClassId,
    relativePath: rawPath ?? `runtime-evidence://${slugRefPart(testClassId)}`,
    testcaseIds: stringListValue(record["testcaseIds"] ?? record["testCaseRefs"]),
    componentIds: stringListValue(record["componentIds"] ?? record["coversComponentIds"]),
    requirementIds: stringListValue(record["requirementIds"]),
    shardId: stringValue(record["shardId"])
  });
}

function normalizeTestDataBinding(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const testCaseRef = testCaseRefFromRecord(record);
  return Object.freeze({
    kind: "sdlc_test_data_binding",
    testDataRef:
      stringValue(record["testDataRef"]) ??
      `test-data://${slugRefPart(testCaseRef)}`,
    testCaseRef,
    inputFixtureRefs: stringListValue(record["inputFixtureRefs"]),
    generationPolicyRef:
      stringValue(record["generationPolicyRef"]) ??
      "policy://odd-sdlc/test-data/default",
    expectedResultRef:
      stringValue(record["expectedResultRef"]) ??
      `expected-result://${slugRefPart(testCaseRef)}`,
    sourceDesignObligationRefs: stringListValue(
      record["sourceDesignObligationRefs"] ?? record["requirementIds"]
    )
  });
}

function normalizeExpectedResultBinding(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  const testCaseRef = testCaseRefFromRecord(record);
  return Object.freeze({
    kind: "sdlc_expected_result_binding",
    expectedResultRef:
      stringValue(record["expectedResultRef"]) ??
      `expected-result://${slugRefPart(testCaseRef)}`,
    testCaseRef,
    assertionRefs: stringListValue(record["assertionRefs"]),
    expectedResultSummary:
      stringValue(record["expectedResultSummary"]) ??
      `Expected result for ${testCaseRef}`,
    verificationPolicyRef:
      stringValue(record["verificationPolicyRef"]) ??
      "policy://odd-sdlc/expected-result/default"
  });
}

function normalizeUatIntegrationBinding(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return Object.freeze({
    kind: "sdlc_uat_integration_binding",
    uatTestCaseRef: stringValue(record["uatTestCaseRef"]) ?? "uat://default",
    integrationTestCaseRef:
      stringValue(record["integrationTestCaseRef"]) ?? "integration://default",
    executionLane: normalizeExecutionLane(record["executionLane"] ?? "uat")
  });
}

function normalizeTestExecutionScheduleRow(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return Object.freeze({
    kind: "sdlc_test_execution_schedule_row",
    scheduleRef:
      stringValue(record["scheduleRef"]) ??
      `schedule://test/${slugRefPart(JSON.stringify(record))}`,
    testCaseRefs: stringListValue(record["testCaseRefs"]),
    command: stringValue(record["command"]) ?? "node --test",
    frameworkRef:
      stringValue(record["frameworkRef"]) ?? "framework://test-runner",
    shardId: stringValue(record["shardId"])
  });
}

function normalizeRegisterCandidate(input: unknown): unknown {
  const record = objectRecord(input);
  if (record?.["kind"] !== "sdlc_test_design_register") {
    return input;
  }
  return Object.freeze({
    kind: "sdlc_test_design_register",
    registerVersion: "ts-test-design-v1",
    targetAssetType: stringValue(record["targetAssetType"]) ?? "test_design_surface",
    designConsumptionRows: unknownArrayValue(record["designConsumptionRows"]),
    uatTestcaseRows: Array.isArray(record["uatTestcaseRows"])
      ? Object.freeze(record["uatTestcaseRows"].map(normalizeTestCaseRow))
      : Object.freeze([]),
    testcaseAuthorityRows: Array.isArray(record["testcaseAuthorityRows"])
      ? Object.freeze(record["testcaseAuthorityRows"].map(normalizeTestCaseRow))
      : Object.freeze([]),
    testStackProfileRows: Array.isArray(record["testStackProfileRows"])
      ? Object.freeze(record["testStackProfileRows"].map(normalizeTestStackProfileRow))
      : Object.freeze([]),
    testModuleRows: Array.isArray(record["testModuleRows"])
      ? Object.freeze(record["testModuleRows"].map(normalizeTestModuleRow))
      : Object.freeze([]),
    testComponentTopologyRows: Array.isArray(record["testComponentTopologyRows"])
      ? Object.freeze(
          record["testComponentTopologyRows"].map(normalizeTestComponentTopologyRow)
        )
      : Object.freeze([]),
    testDataBindings: Array.isArray(record["testDataBindings"])
      ? Object.freeze(record["testDataBindings"].map(normalizeTestDataBinding))
      : Object.freeze([]),
    expectedResultBindings: Array.isArray(record["expectedResultBindings"])
      ? Object.freeze(
          record["expectedResultBindings"].map(normalizeExpectedResultBinding)
        )
      : Object.freeze([]),
    uatIntegrationBindings: Array.isArray(record["uatIntegrationBindings"])
      ? Object.freeze(record["uatIntegrationBindings"].map(normalizeUatIntegrationBinding))
      : Object.freeze([]),
    testExecutionScheduleRows: Array.isArray(record["testExecutionScheduleRows"])
      ? Object.freeze(
          record["testExecutionScheduleRows"].map(normalizeTestExecutionScheduleRow)
        )
      : Object.freeze([])
  });
}

function normalizeCandidate(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return normalizeRegisterCandidate(testDesignCandidateRecord(record) ?? input);
}

function jsonCandidates(content: string): readonly unknown[] {
  const candidates: unknown[] = [];
  const trimmed = content.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      candidates.push(JSON.parse(trimmed));
    } catch {
      // Invalid top-level JSON is reported only if no later candidate admits.
    }
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
      language !== "test_design_register" &&
      language !== "testDesignRegister" &&
      !infoParts.includes("test_design_register") &&
      !infoParts.includes("testDesignRegister")
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
      // Invalid JSON blocks are reported only if no later candidate admits.
    }
  }
  return Object.freeze(candidates);
}

function requiredRowsPresent(
  register: SdlcTestDesignRegister
): readonly string[] {
  return Object.freeze([
    ...(register.designConsumptionRows.length > 0
      ? []
      : ["test_design_register_design_consumption_rows_missing"]),
    ...(register.uatTestcaseRows.length > 0
      ? []
      : ["test_design_register_uat_testcase_rows_missing"]),
    ...(register.testcaseAuthorityRows.length > 0
      ? []
      : ["test_design_register_testcase_authority_rows_missing"]),
    ...(register.testStackProfileRows.length > 0
      ? []
      : ["test_design_register_test_stack_profile_rows_missing"]),
    ...(register.testModuleRows.length > 0
      ? []
      : ["test_design_register_test_module_rows_missing"]),
    ...(register.testComponentTopologyRows.length > 0
      ? []
      : ["test_design_register_test_component_topology_rows_missing"]),
    ...(register.testDataBindings.length > 0
      ? []
      : ["test_design_register_test_data_bindings_missing"]),
    ...(register.expectedResultBindings.length > 0
      ? []
      : ["test_design_register_expected_result_bindings_missing"]),
    ...(register.uatIntegrationBindings.length > 0
      ? []
      : ["test_design_register_uat_integration_bindings_missing"]),
    ...(register.testExecutionScheduleRows.length > 0
      ? []
      : ["test_design_register_test_execution_schedule_rows_missing"])
  ]);
}

export function admitTestDesignRegisterFromArtifact(input: {
  readonly targetAssetType: string;
  readonly outputFile: string;
}): SdlcTestDesignRegisterAdmission {
  const evidenceRefs = Object.freeze([pathToFileURL(input.outputFile).href]);
  if (!isTestDesignTarget(input.targetAssetType)) {
    return Object.freeze({
      kind: "sdlc_test_design_register_admission" as const,
      status: "not_required" as const,
      targetAssetType: input.targetAssetType,
      register: null,
      blockingReasons: Object.freeze([]),
      evidenceRefs
    });
  }
  if (!existsSync(input.outputFile) || !statSync(input.outputFile).isFile()) {
    return Object.freeze({
      kind: "sdlc_test_design_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: input.targetAssetType,
      register: null,
      blockingReasons: Object.freeze(["test_design_output_missing"]),
      evidenceRefs
    });
  }
  const content = readFileSync(input.outputFile, "utf8");
  const errors: string[] = [];
  for (const candidate of jsonCandidates(content)) {
    const normalizedCandidate = normalizeCandidate(candidate);
    try {
      const register = parseRegister(
        normalizedCandidate,
        "test_design_register"
      );
      if (register.targetAssetType !== input.targetAssetType) {
        errors.push(`test_design_register_target_mismatch:${register.targetAssetType}`);
        continue;
      }
      const rowReasons = requiredRowsPresent(register);
      if (rowReasons.length > 0) {
        return Object.freeze({
          kind: "sdlc_test_design_register_admission" as const,
          status: "rejected" as const,
          targetAssetType: input.targetAssetType,
          register,
          blockingReasons: rowReasons,
          evidenceRefs
        });
      }
      return Object.freeze({
        kind: "sdlc_test_design_register_admission" as const,
        status: "admitted" as const,
        targetAssetType: input.targetAssetType,
        register,
        blockingReasons: Object.freeze([]),
        evidenceRefs
      });
    } catch (error) {
      pushUniqueCapped(
        errors,
        error instanceof Error ? error.message : String(error)
      );
      for (const shapeError of testDesignRegisterShapeErrors(normalizedCandidate)) {
        pushUniqueCapped(errors, shapeError);
      }
    }
  }
  return Object.freeze({
    kind: "sdlc_test_design_register_admission" as const,
    status: "rejected" as const,
    targetAssetType: input.targetAssetType,
    register: null,
    blockingReasons: Object.freeze(
      errors.length === 0
        ? ["test_design_register_missing"]
        : [`test_design_register_invalid:${errors.join("; ")}`]
    ),
    evidenceRefs
  });
}
