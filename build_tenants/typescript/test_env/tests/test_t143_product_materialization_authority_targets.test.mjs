// Validates: T-143

import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  MAX_INSTALLED_RETRY_REENTRY_ATTEMPTS,
  MAX_INSTALLED_YIELD_REENTRY_ATTEMPTS,
  constructWorkerInvocationPackage,
  declaredProductFileTargets,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  installedReentryAttemptLimit,
  installedReentryDispositionForOutcome,
  promptForHandoff,
  reconcileSdlcProductMaterializationAuthority,
} from "../../build/semantic/code/src/index.js";

const installedOperatorSource = () =>
  readFileSync(
    new URL("../../code/src/operator/installed_operator.ts", import.meta.url),
    "utf8"
  );

function workspaceWithProductAuthority() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t143-authority-"));
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: data_mapper_t143",
      "active_tenant: scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark",
      "    language: scala",
      "    build_tool: sbt",
      "    module_structure:",
      "      - cdme-compiler",
      "      - cdme-assurance",
      "      - cdme-executor",
      "    build_command: sbt compile",
      "    test_command: sbt test"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "## Build Tenant Contract",
      "",
      "| Field | Value |",
      "|---|---|",
      "| Selected Output Root | `build_tenants/scala_spark` |",
      "",
      "## Expected Product Files",
      "",
      "Product source and test files materialize under `build_tenants/scala_spark/`:",
      "",
      "```",
      "build_tenants/scala_spark/",
      "  build.sbt                          # SBT root build definition",
      "  project/",
      "  cdme-compiler/src/                 # TopologicalCompiler",
      "  cdme-assurance/src/                # Assurance layer",
      "  cdme-executor/src/                 # Executor",
      "```",
      ""
    ].join("\n"),
    "utf8"
  );
  return root;
}

function workspaceWithoutProductTargets() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t143-empty-"));
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: empty_targets_t143",
      "active_tenant: scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark",
      "    language: scala",
      "    build_tool: sbt"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    "# Product\n\nNo product file topology has been conformed yet.\n",
    "utf8"
  );
  return root;
}

function writeJsonExpectedFiles(workspaceRoot, expectedFiles) {
  writeFileSync(
    path.join(workspaceRoot, ".ai-workspace/context/expected_files.json"),
    JSON.stringify({ expectedFiles }, null, 2),
    "utf8"
  );
}

function materializationManifest(workspaceRoot) {
  const contract = hookContractByEdgeName("derive_component_code_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t143-product-authority-targets"
  });
}

test("T-143 installed loop circuit breakers distinguish retry and yield", () => {
  assert.equal(MAX_INSTALLED_RETRY_REENTRY_ATTEMPTS, 5);
  assert.equal(MAX_INSTALLED_YIELD_REENTRY_ATTEMPTS, 20);
  assert.equal(installedReentryAttemptLimit("retry"), 5);
  assert.equal(installedReentryAttemptLimit("yield"), 20);
  assert.equal(installedReentryAttemptLimit("other"), 5);
});

test("T-143 installed loop classifies closure disposition for re-entry budget", () => {
  assert.equal(
    installedReentryDispositionForOutcome({
      traversalConsequence: {
        edgeClosureDecision: {
          disposition: "retry"
        }
      }
    }),
    "retry"
  );
  assert.equal(
    installedReentryDispositionForOutcome({
      traversalConsequence: {
        edgeClosureDecision: {
          disposition: "yield"
        }
      }
    }),
    "yield"
  );
  assert.equal(
    installedReentryDispositionForOutcome({
      traversalConsequence: {
        edgeClosureDecision: {
          disposition: "repair"
        }
      }
    }),
    "other"
  );
  assert.equal(
    installedReentryDispositionForOutcome({
      traversalConsequence: null
    }),
    null
  );
});

test("T-143 installed loop records exhausted retry or yield disposition", () => {
  const source = installedOperatorSource();

  assert.equal(source.includes("reentryDispositionCounts"), true);
  assert.equal(source.includes("yield_guard_exhausted"), true);
  assert.equal(source.includes("retry_guard_exhausted"), true);
  assert.equal(source.includes("exhaustedDisposition"), true);
});

test("T-143 derives declared product targets from conformed PRODUCT authority", () => {
  const manifest = materializationManifest(workspaceWithProductAuthority());
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.contextExpectedFileTargets, []);
  assert.deepEqual(reconciliation.productAuthorityTargets, [
    "build_tenants/scala_spark/build.sbt",
    "build_tenants/scala_spark/cdme-assurance/src",
    "build_tenants/scala_spark/cdme-compiler/src",
    "build_tenants/scala_spark/cdme-executor/src",
    "build_tenants/scala_spark/project"
  ]);
  assert.deepEqual(
    declaredProductFileTargets(manifest),
    reconciliation.productAuthorityTargets
  );
  assert.match(reconciliation.sourceRefs[0], /specification\/PRODUCT\.md$/u);
  assert.equal(
    reconciliation.productAuthorityTargetContracts.find(
      (target) => target.path === "build_tenants/scala_spark/cdme-compiler/src"
    )?.targetKind,
    "directory"
  );
});

test("T-143 worker package carries materialization authority reconciliation", () => {
  const manifest = materializationManifest(workspaceWithProductAuthority());
  const invocationPackage = constructWorkerInvocationPackage({ manifest });
  const prompt = promptForHandoff(manifest);

  assert.equal(
    invocationPackage.productMaterializationAuthority.kind,
    "sdlc_product_materialization_authority_reconciliation"
  );
  assert.equal(invocationPackage.productMaterializationAuthority.status, "passed");
  assert.deepEqual(
    invocationPackage.outputContract.declaredProductFileTargets,
    invocationPackage.productMaterializationAuthority.declaredProductFileTargets
  );
  assert.match(
    prompt,
    /Declared product file targets: build_tenants\/scala_spark\/build\.sbt/u
  );
});

test("T-143 context and PRODUCT target conflicts become typed ambiguity", () => {
  const workspace = workspaceWithProductAuthority();
  writeJsonExpectedFiles(workspace, [
    "build_tenants/scala_spark/build.sbt",
    "build_tenants/scala_spark/other/src"
  ]);
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "ambiguous");
  assert.equal(
    reconciliation.reasonRefs.includes("product_context_target_mismatch"),
    true
  );
  assert.equal(
    reconciliation.declaredProductTargetContracts.find(
      (target) => target.path === "build_tenants/scala_spark/other/src"
    )?.source,
    "context_expected_files"
  );
  assert.equal(
    reconciliation.declaredProductTargetContracts.find(
      (target) => target.path === "build_tenants/scala_spark/cdme-compiler/src"
    )?.source,
    "product_authority"
  );
});

test("T-143 empty product target authority is visible to F_P without FD role gating", () => {
  const manifest = materializationManifest(workspaceWithoutProductTargets());
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const invocationPackage = constructWorkerInvocationPackage({ manifest });
  const prompt = promptForHandoff(manifest);

  assert.equal(reconciliation.status, "missing");
  assert.equal(
    invocationPackage.productMaterializationAuthority.status,
    "missing"
  );
  assert.deepEqual(
    invocationPackage.productMaterializationAuthority.declaredProductTargetContracts,
    []
  );
  assert.match(prompt, /Product authority reconciliation: missing/u);
  assert.match(prompt, /derive the product topology/u);
});
