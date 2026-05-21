// Validates: T-171

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  admitComponentDepthRegisterFromArtifact,
  admitTestDesignRegisterFromArtifact
} from "../../build/semantic/code/src/index.js";

function writeArtifact(content) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t171-component-envelope-"));
  const outputFile = path.join(root, "component_code_surface.md");
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, content, "utf8");
  return outputFile;
}

test("T-171 admits component-depth payload from selected target-carrier envelope", () => {
  const register = {
    kind: "sdlc_component_depth_register",
    registerVersion: "ts-component-depth-v1",
    targetAssetType: "component_code_surface",
    componentRealizationRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId: "hello_world_javascript.hello",
        moduleName: "hello_world_javascript",
        relativePath: "build_tenants/hello_world_javascript/src/hello.js",
        publicBoundary: "node-script-stdout",
        requirementIds: [
          "requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_001"
        ],
        sourceAssetRefs: [
          "workspace://build_tenants/hello_world_javascript/design/adrs/ADR-002-implementation-design-surface.md"
        ]
      }
    ]
  };
  const carrier = {
    kind: "sdlc_component_code_surface_target_carrier",
    targetAssetType: "component_code_surface",
    edgeRef: "derive_lite_component_code_surface",
    contractRef:
      "gtl://target-carrier-contract/odd-sdlc/derive_lite_component_code_surface/component_code_surface",
    contractDigest: "sha256:component-code-contract",
    payload: register,
    summary: "Component code carrier emitted by the worker.",
    evidenceRefs: [
      "workspace://build_tenants/hello_world_javascript/src/hello.js"
    ]
  };
  const executionEvidence = {
    kind: "sdlc_worker_execution_evidence",
    lane: "test",
    command: "node build_tenants/hello_world_javascript/src/hello.js",
    status: "succeeded",
    reportRefs: [
      "file://.ai-workspace/runtime/odd_sdlc/operator-runs/t171/stdout.log"
    ],
    testsObserved: 1,
    passedCount: 1,
    failedCount: 0
  };
  const outputFile = writeArtifact([
    "# Component Code Surface",
    "",
    "```json component_depth_register",
    JSON.stringify(carrier, null, 2),
    "```",
    "",
    "```json execution_evidence",
    JSON.stringify(executionEvidence, null, 2),
    "```",
    ""
  ].join("\n"));

  const admission = admitComponentDepthRegisterFromArtifact({
    targetAssetType: "component_code_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.targetAssetType, "component_code_surface");
  assert.equal(admission.register.componentRealizationRows.length, 1);
  assert.equal(
    admission.register.componentRealizationRows[0].componentId,
    "hello_world_javascript.hello"
  );
});

test("T-171 admits test-design payload from selected target-carrier envelope", () => {
  const testCase = {
    kind: "sdlc_test_case_row",
    testCaseRef: "test-case://hello-world/says-hello",
    caseKind: "uat",
    executionLane: "uat",
    sourceDesignObligationRefs: [
      "workspace-design-row://design_surface/says-hello"
    ],
    testcaseAuthorityRefs: [
      "workspace-spec-row://requirement_surface/says-hello"
    ],
    expectedBehavior: "The generated test observes Hello, world! output."
  };
  const register = {
    kind: "sdlc_test_design_register",
    registerVersion: "ts-test-design-v1",
    targetAssetType: "test_design_surface",
    designConsumptionRows: [
      {
        kind: "sdlc_design_consumption_contract",
        contractRef: "design-consumption://hello-world/test-design",
        sourceDesignObligationRefs: [
          "workspace-design-row://design_surface/says-hello"
        ],
        authorityBasisRefs: [
          "workspace://build_tenants/hello_world_javascript/design/adrs/ADR-001-design-surface.md"
        ],
        consumerGraphFunctionRefs: [
          "derive_component_test_surface",
          "prepare_test_execution_surface",
          "derive_test_execution_result_surface"
        ]
      }
    ],
    uatTestcaseRows: [testCase],
    testcaseAuthorityRows: [testCase],
    testStackProfileRows: [
      {
        kind: "sdlc_test_stack_profile_row",
        stackRef: "stack://node",
        frameworkRef: "framework://node-test",
        buildTool: "undeclared"
      }
    ],
    testModuleRows: [
      {
        kind: "sdlc_test_module_row",
        moduleName: "hello_world_javascript",
        moduleRef: "module://hello_world_javascript",
        testRoot: "build_tenants/hello_world_javascript/test"
      }
    ],
    testComponentTopologyRows: [
      {
        kind: "sdlc_test_component_topology_row",
        testClassId: "HelloWorldTest",
        relativePath: "build_tenants/hello_world_javascript/test/hello.test.js",
        testcaseIds: [testCase.testCaseRef],
        componentIds: ["hello_world_javascript.hello"],
        requirementIds: ["REQ-T132-001"],
        shardId: null
      }
    ],
    testDataBindings: [
      {
        kind: "sdlc_test_data_binding",
        testDataRef: "test-data://hello-world/default",
        testCaseRef: testCase.testCaseRef,
        inputFixtureRefs: ["fixture://hello-world/default"],
        generationPolicyRef: "generation-policy://hello-world/static",
        expectedResultRef: "expected-result://hello-world/says-hello",
        sourceDesignObligationRefs: [
          "workspace-design-row://design_surface/says-hello"
        ]
      }
    ],
    expectedResultBindings: [
      {
        kind: "sdlc_expected_result_binding",
        expectedResultRef: "expected-result://hello-world/says-hello",
        testCaseRef: testCase.testCaseRef,
        assertionRefs: ["assertion://hello-world/stdout"],
        expectedResultSummary: "Hello, world!",
        verificationPolicyRef: "verification-policy://node-test/assert"
      }
    ],
    uatIntegrationBindings: [
      {
        kind: "sdlc_uat_integration_binding",
        uatTestCaseRef: testCase.testCaseRef,
        integrationTestCaseRef: testCase.testCaseRef,
        executionLane: "uat"
      }
    ],
    testExecutionScheduleRows: [
      {
        kind: "sdlc_test_execution_schedule_row",
        scheduleRef: "test-schedule://hello-world/node-test",
        testCaseRefs: [testCase.testCaseRef],
        command: "node --test test/hello.test.js",
        frameworkRef: "framework://node-test",
        shardId: null
      }
    ]
  };
  const carrier = {
    kind: "sdlc_test_design_surface_target_carrier",
    targetAssetType: "test_design_surface",
    edgeRef: "derive_test_design_surface",
    contractRef:
      "gtl://target-carrier-contract/odd-sdlc/derive_test_design_surface/test_design_surface",
    contractDigest: "sha256:test-design-contract",
    payload: register,
    summary: "Test design carrier emitted by the worker.",
    evidenceRefs: [
      "workspace://build_tenants/hello_world_javascript/test/hello.test.js"
    ]
  };
  const outputFile = writeArtifact([
    "# Test Design Surface",
    "",
    "```json test_design_register",
    JSON.stringify(carrier, null, 2),
    "```",
    ""
  ].join("\n"));

  const admission = admitTestDesignRegisterFromArtifact({
    targetAssetType: "test_design_surface",
    outputFile
  });

  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.targetAssetType, "test_design_surface");
  assert.equal(admission.register.testExecutionScheduleRows.length, 1);
  assert.equal(
    admission.register.testExecutionScheduleRows[0].command,
    "node --test test/hello.test.js"
  );
});

test("T-171 rejects malformed test-design rows with bounded aggregate shape feedback", () => {
  const malformedRegister = {
    kind: "sdlc_test_design_register",
    registerVersion: "ts-test-design-v1",
    targetAssetType: "test_design_surface",
    designConsumptionRows: [],
    uatTestcaseRows: [
      {
        kind: "sdlc_test_case_row",
        caseId: "UAT-DM-001",
        testCaseRef: 7,
        caseKind: "authority",
        executionLane: "cdme-compiler",
        expectedBehavior: ""
      }
    ],
    testcaseAuthorityRows: [
      {
        kind: "sdlc_test_case_row",
        caseId: "AUTH-DM-001",
        caseKind: "unit",
        executionLane: "unit",
        sourceDesignObligationRefs: ["REQ-DM-001"],
        testcaseAuthorityRefs: ["REQ-DM-001"],
        expectedBehavior: "authority row"
      }
    ],
    testStackProfileRows: [],
    testModuleRows: [],
    testComponentTopologyRows: [],
    testDataBindings: [],
    expectedResultBindings: [],
    uatIntegrationBindings: [],
    testExecutionScheduleRows: []
  };
  const outputFile = writeArtifact([
    "# Test Design Surface",
    "",
    "```json test_design_register",
    JSON.stringify(malformedRegister, null, 2),
    "```",
    ""
  ].join("\n"));

  const admission = admitTestDesignRegisterFromArtifact({
    targetAssetType: "test_design_surface",
    outputFile
  });

  assert.equal(admission.status, "rejected");
  const reason = admission.blockingReasons.join("\n");
  assert.match(reason, /uatTestcaseRows\[0\]\.caseId: unexpected field/);
  assert.match(reason, /uatTestcaseRows\[0\]\.testCaseRef: expected string/);
  assert.match(reason, /uatTestcaseRows\[0\]\.caseKind: expected one of/);
  assert.match(reason, /uatTestcaseRows\[0\]\.executionLane: expected one of/);
  assert.match(
    reason,
    /uatTestcaseRows\[0\]\.sourceDesignObligationRefs: missing field/
  );
  assert.match(
    reason,
    /testcaseAuthorityRows\[0\]\.testCaseRef: missing field/
  );
});
