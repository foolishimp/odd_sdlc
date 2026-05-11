// Validates: T-147

import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  constructWorkerInvocationPackage,
  deriveWorkerHandoffManifest,
  evaluateWorkerResultPostflight,
  hookContractByEdgeName,
  promptForHandoff,
  readWorkerResultReport,
  reconcileSdlcProductMaterializationAuthority,
  sha256Text
} from "../../build/semantic/code/src/index.js";

function writeConstraints(workspaceRoot, input = {}) {
  mkdirSync(path.join(workspaceRoot, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(workspaceRoot, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t147_materialization_policy",
      `active_tenant: ${input.activeTenant ?? "custom_runtime"}`,
      `selected_output_root: build_tenants/${input.activeTenant ?? "custom_runtime"}`,
      "build_tenants:",
      `  ${input.activeTenant ?? "custom_runtime"}:`,
      `    output_dir: build_tenants/${input.activeTenant ?? "custom_runtime"}`,
      `    language: ${input.language ?? "custom"}`,
      `    build_tool: ${input.buildTool ?? "custom"}`
    ].join("\n"),
    "utf8"
  );
}

function makeWorkspace(input = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t147-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeConstraints(root, input);
  if (input.productTargets !== undefined) {
    writeFileSync(
      path.join(root, "specification/PRODUCT.md"),
      [
        "# Product",
        "",
        "## Expected Product Files",
        "",
        ...input.productTargets.map((target) => `- ${target}`)
      ].join("\n"),
      "utf8"
    );
  }
  return root;
}

function materializationManifest(workspaceRoot) {
  const contract = hookContractByEdgeName("derive_component_code_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t147-materialization-policy"
  });
}

function writeOutputSurface(manifest) {
  const content = "# component_code_surface\n\nedge: derive_component_code_surface\n";
  mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, content, "utf8");
  return {
    digest: sha256Text(content),
    ref: `file://${manifest.outputFile}`
  };
}

function writeProductFile(manifest, relativePath, content = "declared product file\n") {
  const absolutePath = path.join(manifest.productMaterialization.tenantRoot, relativePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content, "utf8");
  return {
    absolutePath,
    digest: sha256Text(content),
    byteCount: Buffer.byteLength(content, "utf8")
  };
}

function writeReport(input) {
  const output = writeOutputSurface(input.manifest);
  const materializedRefs = input.materializedFiles.map(
    (file) => `file://${file.absolutePath}`
  );
  mkdirSync(path.dirname(input.manifest.reportFile), { recursive: true });
  writeFileSync(
    input.manifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        graphFunctionName: input.manifest.graphFunctionName,
        edgeName: input.manifest.edgeName,
        targetAssetType: input.manifest.targetAssetType,
        outputFile: input.manifest.outputFile,
        digest: output.digest,
        summary: "materialized policy-bound product files",
        unresolvedReasons: [],
        materializedFiles: input.materializedFiles,
        executionEvidence: null,
        executionEvidenceErrors: [],
        obligationAssessments:
          input.manifest.traversalObligationContext.obligations.map(
            (obligation) => ({
              kind: "sdlc_worker_obligation_assessment",
              obligationId: obligation.obligationId,
              fulfillmentStatus: "fulfilled",
              evidenceRefs: [output.ref, ...materializedRefs],
              blockingReasons: []
            })
          )
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  return readWorkerResultReport(input.manifest);
}

test("T-147 declared unknown file family satisfies product source role by policy", () => {
  const workspace = makeWorkspace({
    productTargets: ["build_tenants/custom_runtime/app.widget role=source"]
  });
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const invocationPackage = constructWorkerInvocationPackage({ manifest });
  const prompt = promptForHandoff(manifest);
  const productFile = writeProductFile(
    manifest,
    "app.widget",
    "custom runtime product source\n"
  );
  const report = writeReport({
    manifest,
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "app.widget",
        absolutePath: productFile.absolutePath,
        digest: productFile.digest,
        byteCount: productFile.byteCount
      }
    ]
  });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(reconciliation.status, "passed");
  assert.equal(
    reconciliation.declaredProductTargetContracts[0]?.requiredRole,
    "source"
  );
  assert.match(
    reconciliation.declaredProductTargetContracts[0]?.policyRef ?? "",
    /explicit\/source/u
  );
  assert.deepEqual(
    invocationPackage.outputContract.declaredProductTargetContracts.map(
      (target) => ({
        path: target.path,
        targetKind: target.targetKind,
        requiredRole: target.requiredRole,
        policyRef: target.policyRef
      })
    ),
    [
      {
        path: "build_tenants/custom_runtime/app.widget",
        targetKind: "file",
        requiredRole: "source",
        policyRef: "target-role-policy://odd-sdlc/explicit/source"
      }
    ]
  );
  assert.match(prompt, /app\.widget \(file, role=source, policy=target-role-policy/u);
  assert.equal(postflight.status, "passed");
});

test("T-147 known ecosystem file cannot satisfy an undeclared product role", () => {
  const workspace = makeWorkspace({
    activeTenant: "scala_spark",
    language: "scala",
    buildTool: "sbt",
    productTargets: ["build_tenants/scala_spark/app.widget role=source"]
  });
  const manifest = materializationManifest(workspace);
  const productFile = writeProductFile(
    manifest,
    "build.sbt",
    "ThisBuild / scalaVersion := \"2.13.12\"\n"
  );
  const report = writeReport({
    manifest,
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "build.sbt",
        absolutePath: productFile.absolutePath,
        digest: productFile.digest,
        byteCount: productFile.byteCount
      }
    ]
  });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(postflight.status, "blocked");
  assert(
    postflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "materialized_product_file_unbound_to_declared_target" &&
        reason.detail === "build.sbt"
    )
  );
});

test("T-147 context expected files alone cannot define materialization targets", () => {
  const workspace = makeWorkspace({
    activeTenant: "scala_spark",
    language: "scala",
    buildTool: "sbt",
    productTargets: undefined
  });
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/expected_files.json"),
    JSON.stringify(
      {
        expectedFiles: ["build_tenants/scala_spark/src/main/scala/App.scala"]
      },
      null,
      2
    ),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    "# Product\n\nNo declared product file topology has been conformed.\n",
    "utf8"
  );
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const productFile = writeProductFile(
    manifest,
    "src/main/scala/App.scala",
    "object App\n"
  );
  const report = writeReport({
    manifest,
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role: "source",
        relativePath: "src/main/scala/App.scala",
        absolutePath: productFile.absolutePath,
        digest: productFile.digest,
        byteCount: productFile.byteCount
      }
    ]
  });
  const postflight = evaluateWorkerResultPostflight({ manifest, report });

  assert.equal(reconciliation.status, "missing");
  assert.deepEqual(reconciliation.declaredProductTargetContracts, []);
  assert.deepEqual(reconciliation.contextExpectedFileTargets, [
    "build_tenants/scala_spark/src/main/scala/App.scala"
  ]);
  assert.equal(postflight.status, "blocked");
  assert(
    postflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "context_expected_files_not_materialization_authority"
    )
  );
});
