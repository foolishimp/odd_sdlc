// Validates: T-143

import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
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
  observeProductMaterializationDelta,
  promptForHandoff,
  reconcileSdlcProductMaterializationAuthority,
  snapshotProductMaterializationRoot,
  writeHandoffFiles,
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
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
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
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    "# Imported Sources\n\nREQ-BT-003: Preserve missing target authority as F_P-visible pressure.\n",
    "utf8"
  );
  return root;
}

function workspaceWithModuleTargetProductAuthority() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t143-modules-"));
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: data_mapper_t143_modules",
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
      "## Active Tenant",
      "",
      "- **Tenant**: scala_spark",
      "- **Language**: Scala",
      "- **Runtime**: Apache Spark",
      "- **Build Tool**: sbt",
      "- **Output Root**: `build_tenants/scala_spark`",
      "",
      "## Module Structure",
      "",
      "The scala_spark tenant realizes the following modules under `build_tenants/scala_spark/`:",
      "",
      "| Module | Responsibility |",
      "|--------|---------------|",
      "| cdme-compiler | Topological validation, path compilation, adjoint validation |",
      "| cdme-assurance | AI hallucination prevention, triangulation of assurance |",
      "| cdme-executor | Morphism execution, dry-run/live mode |",
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    [
      "# Imported Sources",
      "",
      "REQ-BT-002: Compile the cdme-compiler module as the first steel-thread product slice."
    ].join("\n"),
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

function materializationManifest(
  workspaceRoot,
  edgeName = "derive_component_code_surface",
  traversalAttemptEnvelope = null
) {
  const contract = hookContractByEdgeName(edgeName);
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    traversalAttemptEnvelope,
    runId: "t143-product-authority-targets"
  });
}

function steelThreadEnvelope(edgeName = FG_MATERIALIZE_DECLARED_PRODUCT_ASSET) {
  return {
    kind: "traversal_attempt_envelope",
    envelopeRef: "abg://envelope/t143-steel-thread",
    profileRef: "abg://profile/t143-steel-thread",
    basisId: "basis:t143-steel-thread",
    graphFunctionId: "graph:t143-steel-thread",
    graphCallId: "call:t143-steel-thread",
    frameId: "frame:t143-steel-thread",
    vectorIndex: 0,
    edge: edgeName,
    strategyDirectiveRef: "strategy://abg/selected/single_vertical_slice",
    backendProfileRef: "backend:t143-steel-thread",
    actorInvocationId: "actor:t143-steel-thread",
    selectedScheduleItemRefs: [
      `schedule://odd_sdlc/${edgeName}/cdme-compiler`
    ],
    orderingConstraintRefs: [],
    phaseGateRefs: [],
    requiredProgressArtifactRefs: [],
    gapPressureRefs: [],
    affectRefs: [],
    retryBudgetRemaining: 1,
    mustExitAfterBoundedAttempt: true
  };
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

test("T-143 derives product targets from conformed module structure", () => {
  const manifest = materializationManifest(
    workspaceWithModuleTargetProductAuthority()
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.productAuthorityTargets, [
    "build_tenants/scala_spark/build.sbt",
    "build_tenants/scala_spark/cdme-assurance/src",
    "build_tenants/scala_spark/cdme-compiler/src",
    "build_tenants/scala_spark/cdme-executor/src",
    "build_tenants/scala_spark/project"
  ]);
  assert.equal(
    reconciliation.productAuthorityTargetContracts.find(
      (target) => target.path === "build_tenants/scala_spark/cdme-compiler/src"
    )?.targetKind,
    "directory"
  );
});

test("T-143 steel-thread materialization scopes product targets to included module", () => {
  const workspace = workspaceWithModuleTargetProductAuthority();
  const manifest = materializationManifest(
    workspace,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    steelThreadEnvelope()
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const invocationPackage = constructWorkerInvocationPackage({ manifest });
  const prompt = promptForHandoff(manifest);
  const allowedWriteRoots = manifest.allowedWriteRoots
    .map((root) => path.relative(workspace, root).split(path.sep).join("/"))
    .sort();

  assert.equal(manifest.featureScope.mode, "steel_thread");
  assert.deepEqual(manifest.featureScope.includedModuleNames, [
    "cdme-compiler"
  ]);
  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.productAuthorityTargets, [
    "build_tenants/scala_spark/build.sbt",
    "build_tenants/scala_spark/cdme-compiler/src",
    "build_tenants/scala_spark/project"
  ]);
  assert.equal(
    reconciliation.reasonRefs.includes(
      "product_targets_scoped_by_feature_scope:cdme-compiler"
    ),
    true
  );
  assert.deepEqual(
    invocationPackage.outputContract.declaredProductFileTargets,
    reconciliation.declaredProductFileTargets
  );
  assert.equal(allowedWriteRoots.includes("build_tenants/scala_spark"), false);
  assert.equal(
    allowedWriteRoots.includes("build_tenants/scala_spark/build.sbt"),
    true
  );
  assert.equal(
    allowedWriteRoots.includes("build_tenants/scala_spark/cdme-compiler/src"),
    true
  );
  assert.equal(
    allowedWriteRoots.includes("build_tenants/scala_spark/project"),
    true
  );
  assert.equal(
    allowedWriteRoots.some((root) => root.includes("cdme-assurance")),
    false
  );
  assert.match(prompt, /cdme-compiler\/src/u);
  assert.match(prompt, /Included modules for this edge: cdme-compiler/u);
  assert.match(prompt, /Deferred modules are lineage only for this edge/u);
  assert.match(prompt, /Allowed write roots:/u);
  assert.match(prompt, /materialize product files under the declared product file targets/u);
  assert.doesNotMatch(prompt, /cdme-assurance\/src/u);
  assert.doesNotMatch(prompt, /cdme-executor\/src/u);
});

test("T-143 handoff preparation does not create file targets as directories", () => {
  const workspace = workspaceWithModuleTargetProductAuthority();
  const manifest = materializationManifest(
    workspace,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    steelThreadEnvelope()
  );

  writeHandoffFiles(manifest);

  const buildFile = path.join(workspace, "build_tenants/scala_spark/build.sbt");
  const projectDir = path.join(workspace, "build_tenants/scala_spark/project");
  const compilerSrcDir = path.join(
    workspace,
    "build_tenants/scala_spark/cdme-compiler/src"
  );

  assert.equal(
    manifest.allowedWriteRoots.includes(buildFile),
    true,
    "the exact build.sbt file target remains an allowed write root"
  );
  assert.equal(
    existsSync(buildFile),
    false,
    "handoff preparation must not turn a file target into a directory"
  );
  assert.equal(statSync(projectDir).isDirectory(), true);
  assert.equal(statSync(compilerSrcDir).isDirectory(), true);
});

test("T-143 handoff preparation tolerates existing shared build file", () => {
  const workspace = workspaceWithoutProductTargets();
  const manifest = materializationManifest(workspace, FG_MATERIALIZE_DECLARED_PRODUCT_ASSET);
  const buildFile = path.join(workspace, "build_tenants/scala_spark/build.sbt");
  mkdirSync(path.dirname(buildFile), { recursive: true });
  writeFileSync(buildFile, "ThisBuild / scalaVersion := \"2.13.12\"\n", "utf8");

  writeHandoffFiles(manifest);

  assert.equal(statSync(buildFile).isFile(), true);
});

test("T-143 build-only files do not satisfy component source materialization", () => {
  const workspace = workspaceWithoutProductTargets();
  const manifest = materializationManifest(workspace, FG_MATERIALIZE_DECLARED_PRODUCT_ASSET);
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  const buildFile = path.join(workspace, "build_tenants/scala_spark/build.sbt");
  const buildProperties = path.join(
    workspace,
    "build_tenants/scala_spark/project/build.properties"
  );
  mkdirSync(path.dirname(buildProperties), { recursive: true });
  writeFileSync(buildFile, "ThisBuild / scalaVersion := \"2.13.12\"\n", "utf8");
  writeFileSync(buildProperties, "sbt.version=1.10.7\n", "utf8");

  const materialized = observeProductMaterializationDelta({ manifest, before });

  assert.deepEqual(
    materialized.map((file) => `${file.role}:${file.relativePath}`).sort(),
    ["build_config:build.sbt", "other:project/build.properties"]
  );
  assert.equal(materialized.some((file) => file.role === "source"), false);
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
