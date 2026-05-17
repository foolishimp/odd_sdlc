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
  admitComponentDepthRegisterFromArtifact
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
