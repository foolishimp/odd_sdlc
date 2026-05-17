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

type TestDesignTarget = (typeof TEST_DESIGN_TARGETS)[number];

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

function normalizeCandidate(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  return testDesignCandidateRecord(record) ?? input;
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
    try {
      const register = parseRegister(
        normalizeCandidate(candidate),
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
      errors.push(error instanceof Error ? error.message : String(error));
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
