// Validates: T-120

import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  sdlcBlockingReasonFromLegacy,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";

function writeConstraints(root) {
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t120_retry_local_repair",
      "active_tenant: scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark",
      "    language: scala",
      "    build_tool: sbt",
      "    module_structure:",
      "      - retry-core"
    ].join("\n"),
    "utf8"
  );
}

function workspaceRoot() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t120-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeConstraints(root);
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-120: repair local typed carrier gaps.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    "# Requirements\n\nREQ-T120-001: Retry prompts must include exact typed carrier repair pressure.\n",
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function retryDossier() {
  const reason =
    "component_depth_register_invalid:component_depth_register.bindingId: unexpected field";
  const blockingReason = sdlcBlockingReasonFromLegacy({ reason });
  return {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_implementation_component_topology_surface",
    vectorIndex: 12,
    targetAssetType: "implementation_component_topology_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason
      }
    ],
    evidenceRefs: [
      "file:///tmp/t120/implementation_component_topology_surface.md",
      "file:///tmp/t120/postflight.json"
    ],
    priorManifestId: "file:///tmp/t120/handoff_manifest.json",
    currentGapDossierRef: "file:///tmp/t120/gap_dossier.json",
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge", "repair_worker_output"]
  };
}

function designRetryDossier() {
  const reason =
    "design_depth_register_invalid:design_depth_register.moduleSchemaFragments[0].entities[0].attributes[0].type: unexpected field";
  const blockingReason = sdlcBlockingReasonFromLegacy({ reason });
  return {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_implementation_module_surface",
    vectorIndex: 10,
    targetAssetType: "implementation_module_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason
      }
    ],
    evidenceRefs: [
      "file:///tmp/t120/implementation_module_surface.md",
      "file:///tmp/t120/design_depth_candidate_0_normalized.json",
      "file:///tmp/t120/postflight.json"
    ],
    priorManifestId: "file:///tmp/t120/handoff_manifest.json",
    currentGapDossierRef: "file:///tmp/t120/gap_dossier.json",
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge"]
  };
}

function designAttributeMissingRetryDossier() {
  const reason = "design_attribute_missing:entity:cdme-compiler.compilationjob";
  const blockingReason = sdlcBlockingReasonFromLegacy({ reason });
  return {
    kind: "sdlc_postflight_gap_dossier",
    status: "open",
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: "derive_implementation_module_surface",
    vectorIndex: 10,
    targetAssetType: "implementation_module_surface",
    reasons: [
      {
        kind: "sdlc_postflight_gap_reason",
        reason,
        reasonClass: "assurance",
        blockingReason
      }
    ],
    evidenceRefs: [
      "file:///tmp/t120/implementation_module_surface.md",
      "file:///tmp/t120/design_depth_candidate_0_normalized.json"
    ],
    priorManifestId: "file:///tmp/t120/handoff_manifest.json",
    currentGapDossierRef: "file:///tmp/t120/gap_dossier.json",
    retryEligible: true,
    nextLawfulActions: ["retry_same_edge"]
  };
}

function retryManifest() {
  const contract = hookContractByEdgeName(
    "derive_implementation_component_topology_surface"
  );
  return deriveWorkerHandoffManifest({
    workspaceRoot: workspaceRoot(),
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 12,
    contract,
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [retryDossier()]
    },
    runId: "t120-retry-local-repair"
  });
}

function designRetryManifest() {
  const contract = hookContractByEdgeName("derive_implementation_module_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot: workspaceRoot(),
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [designRetryDossier()]
    },
    runId: "t120-retry-design-depth"
  });
}

function designAttributeMissingRetryManifest() {
  const contract = hookContractByEdgeName("derive_implementation_module_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot: workspaceRoot(),
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [designAttributeMissingRetryDossier()]
    },
    runId: "t120-retry-design-attribute-missing"
  });
}

function executionRetryManifest() {
  const contract = hookContractByEdgeName("derive_test_execution_result_surface");
  const reason = "test_execution_evidence_missing";
  const blockingReason = sdlcBlockingReasonFromLegacy({ reason });
  return deriveWorkerHandoffManifest({
    workspaceRoot: workspaceRoot(),
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 26,
    contract,
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [
        {
          kind: "sdlc_postflight_gap_dossier",
          status: "open",
          graphFunctionName: "bootstrap_release_self_test",
          edgeName: "derive_test_execution_result_surface",
          vectorIndex: 26,
          targetAssetType: "test_execution_result_surface",
          reasons: [
            {
              kind: "sdlc_postflight_gap_reason",
              reason,
              reasonClass: "code_to_test",
              blockingReason
            }
          ],
          evidenceRefs: ["file:///tmp/t120/test_execution_result_surface.md"],
          priorManifestId: "file:///tmp/t120/handoff_manifest.json",
          currentGapDossierRef: "file:///tmp/t120/gap_dossier.json",
          retryEligible: true,
          nextLawfulActions: ["retry_same_edge", "repair_worker_output"]
        }
      ]
    },
    runId: "t120-retry-execution-evidence"
  });
}

function repairScheduleRetryManifest() {
  const contract = hookContractByEdgeName("derive_component_repair_schedule_surface");
  const reason =
    "component_repair_schedule_unbound:repair:cdme-compiler:module-build-definition";
  const blockingReason = {
    ...sdlcBlockingReasonFromLegacy({ reason }),
    lawfulReentryPoint: "repair_worker_output"
  };
  return deriveWorkerHandoffManifest({
    workspaceRoot: workspaceRoot(),
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 28,
    contract,
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [
        {
          kind: "sdlc_postflight_gap_dossier",
          status: "open",
          graphFunctionName: "bootstrap_release_self_test",
          edgeName: "derive_component_repair_schedule_surface",
          vectorIndex: 28,
          targetAssetType: "component_repair_schedule_surface",
          reasons: [
            {
              kind: "sdlc_postflight_gap_reason",
              reason,
              reasonClass: "assurance",
              blockingReason
            }
          ],
          evidenceRefs: [
            "file:///tmp/t120/component_repair_schedule_surface.md",
            "file:///tmp/t120/gap_dossier.json"
          ],
          priorManifestId: "file:///tmp/t120/handoff_manifest.json",
          currentGapDossierRef: "file:///tmp/t120/gap_dossier.json",
          retryEligible: true,
          nextLawfulActions: ["repair_worker_output"]
        }
      ]
    },
    runId: "t120-retry-repair-schedule"
  });
}

function componentRepairRowOpenRetryManifest() {
  const root = workspaceRoot();
  const releaseAssetRoot = path.join(
    root,
    ".ai-workspace/runtime/odd_sdlc/assets/t120-prior-release-depth"
  );
  const executionAssetRoot = path.join(
    root,
    ".ai-workspace/runtime/odd_sdlc/assets/t120-prior-test-execution"
  );
  mkdirSync(releaseAssetRoot, { recursive: true });
  mkdirSync(executionAssetRoot, { recursive: true });
  const releaseDepthPath = path.join(
    releaseAssetRoot,
    "release_depth_parity_surface.md"
  );
  const testExecutionPath = path.join(
    executionAssetRoot,
    "test_execution_result_surface.md"
  );
  writeFileSync(
    releaseDepthPath,
    [
      "# Release Depth Parity Surface",
      "",
      "```json component_depth_register",
      JSON.stringify(
        {
          kind: "sdlc_component_depth_register",
          registerVersion: "ts-component-depth-v1",
          targetAssetType: "release_depth_parity_surface",
          componentRepairSchedule: {
            kind: "sdlc_component_repair_schedule",
            registerVersion: "ts-component-depth-v1",
            scheduleStatus: "repair_required",
            repairRows: [
              {
                kind: "sdlc_component_repair_schedule_row",
                scheduleId: "schedule.compiler.diagnostics.scalac.001",
                failureId: "fail.compiler.diagnostics.scalac.001",
                repairTarget:
                  "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala",
                lawfulReentryPoint: "realization_refactor",
                attributionConfidence: "high",
                testcaseIds: ["TC-DM-DIAG-001"],
                componentIds: ["cdme-diagnostics"],
                requirementIds: ["REQ-T115-001"],
                sourceRefs: [
                  "build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/diagnostics/CompileDiagnostic.scala"
                ],
                testRefs: [
                  "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala"
                ],
                evidenceRefs: [`file://${testExecutionPath}`]
              }
            ],
            evidenceRefs: [`file://${testExecutionPath}`]
          },
          releaseDepthParity: {
            kind: "sdlc_release_depth_parity_assessment",
            status: "blocked",
            scope: "release_surface",
            blockerCodes: [
              "shard_compile_failed_no_test_evidence",
              "blocked_test_classes_have_no_pass_evidence"
            ],
            blockerDetail: "test shard failed at test_compile",
            decisionBasis: [`file://${testExecutionPath}`],
            metPrecondition: false,
            repricedRequested: false
          }
        },
        null,
        2
      ),
      "```"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    testExecutionPath,
    [
      "# Test Execution Result Surface",
      "",
      "```",
      "[error] .../DiagnosticsFinalizeSpec.scala:14:42: type mismatch;",
      "[error]  found   : cdme.compiler.diagnostics.CompileDiagnostic",
      "[error]  required: DiagnosticsFinalizeSpec.this.AWord",
      "[error] .../DiagnosticsFinalizeSpec.scala:53:14: Cannot prove that Int <:< AnyRef.",
      "[error]     out.size shouldBe in.size",
      "```"
    ].join("\n"),
    "utf8"
  );
  const contract = hookContractByEdgeName("derive_component_test_surface");
  const reason = "component_repair_row_open:fail.compiler.diagnostics.scalac.001";
  const evidenceRefs = [`file://${releaseDepthPath}`, `file://${testExecutionPath}`];
  return deriveWorkerHandoffManifest({
    workspaceRoot: root,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 22,
    contract,
    retryContext: {
      kind: "sdlc_worker_retry_context",
      retryAttemptRefs: [],
      priorGapDossiers: [
        {
          kind: "sdlc_postflight_gap_dossier",
          status: "open",
          graphFunctionName: "bootstrap_release_self_test",
          edgeName: "derive_release_depth_parity_surface",
          vectorIndex: 31,
          targetAssetType: "release_depth_parity_surface",
          reasons: [
            {
              kind: "sdlc_postflight_gap_reason",
              reason,
              reasonClass: "assurance",
              blockingReason: {
                ...sdlcBlockingReasonFromLegacy({ reason }),
                code: "assurance_ledger_reason",
                detail: reason,
                evidenceRefs,
                lawfulReentryPoint: "repair_worker_output"
              }
            }
          ],
          evidenceRefs,
          priorManifestId: "file:///tmp/t120/release-depth-handoff_manifest.json",
          currentGapDossierRef: "file:///tmp/t120/release-depth-gap_dossier.json",
          retryEligible: true,
          nextLawfulActions: ["repair_worker_output"]
        }
      ]
    },
    runId: "t120-component-repair-row-open"
  });
}

test("T-120 retry prompt projects exact schema-local carrier repair pressure", () => {
  const files = writeHandoffFiles(retryManifest());
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const prompt = readFileSync(files.promptPath, "utf8");
  const [instruction] = invocationPackage.retryRepairInstructions;

  assert(instruction);
  assert.equal(instruction.kind, "sdlc_worker_retry_repair_instruction");
  assert.equal(instruction.repairScope, "schema_local");
  assert.equal(
    instruction.reason,
    "component_depth_register_invalid:component_depth_register.bindingId: unexpected field"
  );
  assert.equal(instruction.reasonClass, "assurance");
  assert.equal(
    instruction.acceptedCarrierSchemaRef,
    "schema://odd_sdlc/component_depth_register"
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes(
      "componentTopologyRows[].componentId"
    )
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes(
      "componentTopologyRows[].sourceAssetRefs"
    )
  );
  assert(
    instruction.rejectedArtifactRefs.includes(
      "file:///tmp/t120/implementation_component_topology_surface.md"
    )
  );
  assert.match(prompt, /retryRepairInstructions and repairReentryPlans when present/u);
  assert.match(prompt, /Worker package fields to apply/u);
});

test("T-120 component carrier retry instructions fail closed if schema fields are omitted", () => {
  const files = writeHandoffFiles(retryManifest());
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const [instruction] = invocationPackage.retryRepairInstructions;

  assert(instruction);
  assert.equal(instruction.repairScope, "schema_local");
  assert.notEqual(instruction.acceptedCarrierSchemaRef, null);
  assert(instruction.acceptedCarrierFieldSet.length >= 10);
});

test("T-120 design-depth retries carry nested canonical attribute fields", () => {
  const files = writeHandoffFiles(designRetryManifest());
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const prompt = readFileSync(files.promptPath, "utf8");
  const [instruction] = invocationPackage.retryRepairInstructions;

  assert(instruction);
  assert.equal(instruction.repairScope, "schema_local");
  assert.equal(
    instruction.acceptedCarrierSchemaRef,
    "schema://odd_sdlc/design_depth_register"
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes(
      "moduleSchemaFragments[].entities[].attributes[].name"
    )
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes(
      "moduleSchemaFragments[].entities[].attributes[].valueType"
    )
  );
  assert(
    !instruction.acceptedCarrierFieldSet.includes(
      "moduleSchemaFragments[].entities[].attributes[].type"
    )
  );
  assert.match(prompt, /retryRepairInstructions and repairReentryPlans when present/u);
});

test("T-120 design attribute repair retries carry the design-depth carrier schema", () => {
  const files = writeHandoffFiles(designAttributeMissingRetryManifest());
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const prompt = readFileSync(files.promptPath, "utf8");
  const [instruction] = invocationPackage.retryRepairInstructions;

  assert(instruction);
  assert.equal(instruction.repairScope, "semantic_local");
  assert.equal(
    instruction.acceptedCarrierSchemaRef,
    "schema://odd_sdlc/design_depth_register"
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes(
      "moduleSchemaFragments[].entities[].attributes[].valueType"
    )
  );
  assert(
    instruction.nonClosureRules.some((rule) =>
      rule.includes("Add, remove, rename, or map")
    )
  );
  assert.match(prompt, /retryRepairInstructions and repairReentryPlans when present/u);
});

test("T-120 execution-evidence retries carry the accepted JSON carrier schema", () => {
  const files = writeHandoffFiles(executionRetryManifest());
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const prompt = readFileSync(files.promptPath, "utf8");
  const [instruction] = invocationPackage.retryRepairInstructions;

  assert(instruction);
  assert.equal(instruction.repairScope, "schema_local");
  assert.equal(
    instruction.acceptedCarrierSchemaRef,
    "schema://odd_sdlc/test_execution_evidence"
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes("shardEvidence[].shardId")
  );
  assert.match(prompt, /retryRepairInstructions and repairReentryPlans when present/u);
});

test("T-120 repair-schedule semantic retries carry strict component carrier repair law", () => {
  const files = writeHandoffFiles(repairScheduleRetryManifest());
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const prompt = readFileSync(files.promptPath, "utf8");
  const [instruction] = invocationPackage.retryRepairInstructions;

  assert(instruction);
  assert.equal(instruction.repairScope, "semantic_local");
  assert.equal(
    instruction.acceptedCarrierSchemaRef,
    "schema://odd_sdlc/component_depth_register"
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes(
      "componentRepairSchedule.repairRows[].repairTarget"
    )
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes(
      "componentRepairSchedule.repairRows[].componentIds"
    )
  );
  assert.match(prompt, /retryRepairInstructions and repairReentryPlans when present/u);
});

test("B-085 component repair row open becomes typed component-test repair reentry law", () => {
  const files = writeHandoffFiles(componentRepairRowOpenRetryManifest());
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const prompt = readFileSync(files.promptPath, "utf8");
  const [instruction] = invocationPackage.retryRepairInstructions;
  const [plan] = invocationPackage.repairReentryPlans;

  assert(instruction);
  assert(plan);
  assert.equal(instruction.repairScope, "semantic_local");
  assert.equal(plan.targetEdgeName, "derive_component_test_surface");
  assert.equal(plan.targetAssetType, "component_test_surface");
  assert.equal(plan.repairTarget, "component_test");
  assert.equal(plan.failureId, "fail.compiler.diagnostics.scalac.001");
  assert.equal(plan.scheduleId, "schedule.compiler.diagnostics.scalac.001");
  assert.equal(plan.noBroadRegeneration, true);
  assert(
    plan.testRefs.includes(
      "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala"
    )
  );
  assert.match(plan.diagnosticExcerpt, /type mismatch/u);
  assert.match(plan.diagnosticExcerpt, /Cannot prove that Int <:< AnyRef/u);
  assert.equal(
    instruction.acceptedCarrierSchemaRef,
    "schema://odd_sdlc/component_depth_register"
  );
  assert(
    instruction.acceptedCarrierFieldSet.includes(
      "componentTestRows[].relativePath"
    )
  );
  assert.equal(
    instruction.repairReentryPlanId,
    "component_repair_reentry:fail.compiler.diagnostics.scalac.001"
  );
  assert.equal(instruction.repairReentryPlanId, plan.planId);
  assert(
    instruction.nonClosureRules.some((rule) =>
      rule.includes("Do not broadly regenerate")
    )
  );
  assert.match(prompt, /retryRepairInstructions and repairReentryPlans when present/u);
  assert.match(prompt, /Worker package fields to apply/u);
});

test("T-120 Spec Method entry does not own installed retry control", () => {
  const packageRoot = process.cwd();
  assert.equal(
    existsSync(path.join(packageRoot, "code/src/cli/command.ts")),
    false
  );
  const entry = readFileSync(
    path.join(packageRoot, "code/src/spec_method/entry.ts"),
    "utf8"
  );
  const installedOperator = readFileSync(
    path.join(packageRoot, "code/src/operator/installed_operator.ts"),
    "utf8"
  );

  assert(!entry.includes("retryContextOverride"));
  assert(!entry.includes("MAX_INSTALLED_START_SELF_HEAL_ATTEMPTS"));
  assert(!entry.includes("sdlc_installed_operator_start_loop_attempt"));
  assert.match(installedOperator, /executeInstalledOperatorStartWithReentry/u);
  assert.match(installedOperator, /MAX_INSTALLED_RETRY_REENTRY_ATTEMPTS/u);
});
