// Validates: T-143

import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath,
  pathToFileURL } from "node:url";

import {
  FG_DERIVE_LITE_UAT_TEST_SOURCE_SURFACE,
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  admitSdlcProjectConstraints,
  conformProjectProfileFromConstraintsText,
  constructSdlcGtlModule,
  deriveSdlcWorkspaceIngressReport,
  hookContractByEdgeName,
  projectSdlcQueryDomain
} from "../../build/semantic/code/src/index.js";
import {
  assertSdlcProductMaterializationLaunchable,
  declaredProductFileTargets,
  reconcileSdlcProductMaterializationAuthority,
  sdlcProductMaterializationLaunchBlocker
} from "../../build/semantic/code/src/operator/product_materialization/authority.js";
import {
  writeProductMaterializationManifest
} from "../../build/semantic/code/src/operator/product_materialization/manifest.js";
import {
  observeProductMaterializationDelta,
  snapshotProductMaterializationRoot
} from "../../build/semantic/code/src/operator/product_materialization/observation.js";
import {
  sdlcOperatorRuntimePolicy,
  sdlcOperatorRuntimePolicyConfigPath
} from "../../build/semantic/code/src/operator/runtime_policy.js";
import {
  sdlcWorkspaceLocalToolEnvironment
} from "../../build/semantic/code/src/operator/tool_environment.js";
import {
  evaluateSdlcComputeStage
} from "../../build/semantic/code/src/operator/plugins/evaluate/postflight.js";
import {
  constructWorkerInvocationPackage,
  deriveWorkerHandoffManifest,
  promptForHandoff,
  sha256Text,
  writeHandoffFiles
} from "../../build/semantic/code/src/operator/plugins/transform/launch_contract.js";
import {
  buildPostTransformWorkerResultReport,
  readWorkerResultReport
} from "../../build/semantic/code/src/operator/plugins/transform/result_projection.js";
import {
  projectSdlcWorkerAttachment,
  publicStartOnce
} from "../../build/semantic/code/src/start/index.js";

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
  writeTenantTechStackSpec(
    root,
    "build_tenants/scala_spark",
    ["build.sbt", "project/"],
    {
      sourceRoots: [
        "cdme-compiler/src",
        "cdme-assurance/src",
        "cdme-executor/src"
      ]
    }
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
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    "# Requirements\n\nREQ-BT-003: Preserve missing target authority as F_P-visible pressure.\n",
    "utf8"
  );
  writeTenantTechStackSpec(root, "build_tenants/scala_spark", []);
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
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    [
      "# Requirements",
      "",
      "REQ-BT-002: Compile the cdme-compiler module as the first steel-thread product slice."
    ].join("\n"),
    "utf8"
  );
  writeTenantTechStackSpec(
    root,
    "build_tenants/scala_spark",
    ["build.sbt", "project/"],
    {
      sourceRoots: [
        "cdme-compiler/src",
        "cdme-assurance/src",
        "cdme-executor/src"
      ]
    }
  );
  return root;
}

function workspaceWithRustExpectedFilesAuthority() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t143-rust-"));
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: hello_world_rust_t143",
      "active_tenant: hello_world_rust",
      "build_tenants:",
      "  hello_world_rust:",
      "    output_dir: build_tenants/hello_world_rust",
      "    language: Rust",
      "    build_tool: cargo",
      "    test_runner: cargo"
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
      "- **Tenant**: hello_world_rust",
      "- **Language**: Rust",
      "- **Build Tool**: cargo",
      "- **Output Root**: `build_tenants/hello_world_rust`",
      "",
      "## Expected Files",
      "",
      "- `build_tenants/hello_world_rust/Cargo.toml` (role: `build_config`)",
      "- `build_tenants/hello_world_rust/src/main.rs` (role: `source`)",
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-product-identity.md"),
    "# Product Identity\n\nREQ-RUST-HELLO-WORLD-001: Print Hello, world! from the Rust product.\n",
    "utf8"
  );
  writeTenantTechStackSpec(root, "build_tenants/hello_world_rust", [
    "Cargo.toml"
  ]);
  return root;
}

function workspaceWithSingularDeclaredProductFileAuthority() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t143-single-file-"));
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: hello_world_javascript_t143",
      "active_tenant: hello_world_javascript",
      "build_tenants:",
      "  hello_world_javascript:",
      "    output_dir: build_tenants/hello_world_javascript",
      "    language: JavaScript",
      "    test_runner: node",
      "    module_structure:",
      "      - hello_world_javascript"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "## Tenant And Realization",
      "",
      "- **Selected output root**: `build_tenants/hello_world_javascript`.",
      "- **Declared product file**: `build_tenants/hello_world_javascript/src/hello.js`.",
      "- **Execution command**: `node build_tenants/hello_world_javascript/src/hello.js`.",
      "- **Exact expected stdout**: `Hello, world!`.",
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-product-identity.md"),
    "# Product Identity\n\nREQ-JS-HELLO-WORLD-001: Print Hello, world! from the JavaScript product.\n",
    "utf8"
  );
  writeTenantTechStackSpec(root, "build_tenants/hello_world_javascript", []);
  return root;
}

function workspaceWithProseDeclaredProductFileSection() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t143-section-file-"));
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: hello_world_javascript_t143_section",
      "active_tenant: hello_world_javascript",
      "build_tenants:",
      "  hello_world_javascript:",
      "    output_dir: build_tenants/hello_world_javascript",
      "    language: JavaScript",
      "    test_runner: node"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "## Declared Product Files",
      "",
      "- `build_tenants/hello_world_javascript/src/hello.js` — the single declared",
      "  product source file.",
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-product-identity.md"),
    "# Product Identity\n\nREQ-JS-HELLO-WORLD-001: Print Hello, world! from the JavaScript product.\n",
    "utf8"
  );
  writeTenantTechStackSpec(root, "build_tenants/hello_world_javascript", []);
  return root;
}

function workspaceWithDeclaredSourceFileAuthority() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t143-source-file-"));
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: hello_world_javascript_t143_source",
      "active_tenant: hello_world_javascript",
      "build_tenants:",
      "  hello_world_javascript:",
      "    output_dir: build_tenants/hello_world_javascript",
      "    language: JavaScript",
      "    test_runner: node"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "## Identity",
      "",
      "- selected output root: `build_tenants/hello_world_javascript`",
      "- declared source file: `build_tenants/hello_world_javascript/src/hello.js`",
      "- execution command: `node build_tenants/hello_world_javascript/src/hello.js`",
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-product-identity.md"),
    "# Product Identity\n\nREQ-JS-HELLO-WORLD-001: Print Hello, world! from the JavaScript product.\n",
    "utf8"
  );
  writeTenantTechStackSpec(root, "build_tenants/hello_world_javascript", []);
  return root;
}

function writeJsonExpectedFiles(workspaceRoot, expectedFiles) {
  writeFileSync(
    path.join(workspaceRoot, ".ai-workspace/context/expected_files.json"),
    JSON.stringify({ expectedFiles }, null, 2),
    "utf8"
  );
}

function writeTenantTechStackSpec(
  workspaceRoot,
  tenantRoot,
  buildConfigTargets,
  options = {}
) {
  const stackSpecFile = path.join(workspaceRoot, tenantRoot, "spec/TECH_STACK.json");
  mkdirSync(path.dirname(stackSpecFile), { recursive: true });
  writeFileSync(
    stackSpecFile,
    `${JSON.stringify(
      {
        kind: "sdlc_tenant_technology_stack_description",
        buildConfigTargets,
        ...(options.sourceRoots === undefined
          ? {}
          : { moduleLayout: { sourceRoots: options.sourceRoots } }),
        executionEnvironment: {
          hostCachePolicy: "prohibited",
          workspaceLocalDirectories: [
            ".ai-workspace/runtime/odd_sdlc/tool-cache/example-tool",
            ".ai-workspace/runtime/odd_sdlc/tool-cache/example-home"
          ],
          environmentVariables: {
            EXAMPLE_TOOL_HOME:
              "${workspaceRoot}/.ai-workspace/runtime/odd_sdlc/tool-cache/example-home",
            EXAMPLE_TOOL_OPTS:
              "-Dexample.cache=${workspaceRoot}/.ai-workspace/runtime/odd_sdlc/tool-cache/example-tool"
          }
        },
        testingTechStack: {
          testRunner: "declared-test-runner",
          testRoots: ["src/test"],
          proofCommands: ["declared-test-runner --report json"],
          evidenceFormat: "json-report"
        }
      },
      null,
      2
    )}\n`,
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

function launchBlockerRuntimeStart(workspaceRoot) {
  const module = constructSdlcGtlModule();
  const constraintsText = readFileSync(
    path.join(workspaceRoot, ".ai-workspace/context/project_constraints.yml"),
    "utf8"
  );
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: pathToFileURL(workspaceRoot).href,
    projectConstraints: admitSdlcProjectConstraints({
      projectSlug: "t205_launch_blocker",
      activeTenant: "scala_spark",
      selectedOutputRoot: "build_tenants/scala_spark",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: ["transport_contract"]
    }),
    sourceInputs: []
  });
  const queryDomain = projectSdlcQueryDomain({ module, ingressReport });
  const conformedProject = conformProjectProfileFromConstraintsText({
    workspaceRoot,
    constraintsText
  });
  const start = publicStartOnce({
    request: {
      kind: "sdlc_public_start_request",
      workspaceRoot,
      target: {
        kind: "graph_function",
        handle: "derive_component_code_surface"
      },
      until: "first_traversal",
      defaultRegime: "F_P"
    },
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({
      transportContract: "process://node"
    })
  });
  assert.equal(start.kind, "sdlc_public_start_projected");
  return start;
}

function steelThreadEnvelope(
  edgeName = FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  moduleName = "cdme-compiler"
) {
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
      `schedule://odd_sdlc/${edgeName}/${moduleName}`
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

function writeOutputSurface(manifest, title = "component_code_surface") {
  const content = [`# ${title}`, "", `edge: ${manifest.edgeName}`].join("\n");
  const artifact = `${content}\n`;
  mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, artifact, "utf8");
  return {
    digest: sha256Text(artifact),
    byteCount: Buffer.byteLength(artifact, "utf8")
  };
}

function writeMaterializedSourceFile(
  manifest,
  relativePath = "cdme-compiler/src/main/scala/com/cdme/compiler/Probe.scala"
) {
  const content = [
    "package com.cdme.compiler",
    "",
    "final case class Probe(value: String)"
  ].join("\n");
  const artifact = `${content}\n`;
  const absolutePath = path.join(
    manifest.productMaterialization.tenantRoot,
    relativePath
  );
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, artifact, "utf8");
  return {
    kind: "sdlc_materialized_product_file",
    role: "source",
    relativePath,
    absolutePath,
    digest: sha256Text(artifact),
    byteCount: Buffer.byteLength(artifact, "utf8")
  };
}

function writeMaterializedProductFile(manifest, relativePath, content, role) {
  const artifact = `${content.replace(/\n?$/u, "\n")}`;
  const absolutePath = path.join(
    manifest.productMaterialization.tenantRoot,
    relativePath
  );
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, artifact, "utf8");
  return {
    kind: "sdlc_materialized_product_file",
    role,
    relativePath,
    absolutePath,
    digest: sha256Text(artifact),
    byteCount: Buffer.byteLength(artifact, "utf8")
  };
}

function writeComponentTestSurfaceCarrier(workspaceRoot, rows) {
  const outputFile = path.join(
    workspaceRoot,
    "build_tenants/scala_spark/design/component_test_surface.md"
  );
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(
    outputFile,
    `${JSON.stringify(
      {
        kind: "sdlc_component_depth_register",
        registerVersion: "ts-component-depth-v1",
        targetAssetType: "component_test_surface",
        componentTopologyRows: [],
        componentRealizationRows: [],
        testComponentTopologyRows: [],
        componentTestRows: rows.map((row) => ({
          kind: "sdlc_component_test_realization_row",
          testClassId: row.testClassId,
          relativePath: row.relativePath,
          testcaseIds: row.testcaseIds,
          componentIds: row.componentIds,
          requirementIds: row.requirementIds,
          shardId: row.shardId
        })),
        componentTestQualificationRows: [],
        componentExecutionFailureRegister: null,
        componentRepairSchedule: null,
        releaseDepthParity: null
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

function writeExecutionLog(manifest, filename, content) {
  const absolutePath = path.join(manifest.archiveRoot, filename);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, `${content}\n`, "utf8");
  return `file://${absolutePath}`;
}

function writeWorkerResultReport(input) {
  const outputRef = `file://${input.manifest.outputFile}`;
  const materializedRefs = input.materializedFiles.map(
    (file) => `file://${file.absolutePath}`
  );
  const executionRefs = input.executionEvidence?.reportRefs ?? [];
  const evidenceRefs = [
    outputRef,
    ...materializedRefs,
    ...executionRefs
  ];
  mkdirSync(path.dirname(input.manifest.reportFile), { recursive: true });
  writeFileSync(
    input.manifest.reportFile,
    `${JSON.stringify(
      {
        kind: "odd_sdlc.worker_result_report",
        projectionRole: "typed_fp_stage_projection",
        authoritativeStageResultRef: pathToFileURL(
          input.manifest.fpEvaluateResultFile
        ).href,
        graphFunctionName: input.manifest.graphFunctionName,
        edgeName: input.manifest.edgeName,
        targetAssetType: input.manifest.targetAssetType,
        outputFile: input.manifest.outputFile,
        digest: input.output.digest,
        summary: input.summary ?? "generated product source under tenant root",
        unresolvedReasons: [],
        materializedFiles: input.materializedFiles,
        executionEvidence: input.executionEvidence ?? null,
        executionEvidenceErrors: [],
        obligationAssessments:
          input.manifest.traversalObligationContext.obligations.map(
            (obligation) => ({
              kind: "sdlc_worker_obligation_assessment",
              obligationId: obligation.obligationId,
              fulfillmentStatus: "fulfilled",
              evidenceRefs:
                evidenceRefs.length > 0
                  ? evidenceRefs
                  : [...obligation.evidenceRefs],
              blockingReasons: []
            })
          )
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

test("T-143 runtime policy does not carry installed local-loop controls", () => {
  const policy = sdlcOperatorRuntimePolicy();
  const config = JSON.parse(
    readFileSync(sdlcOperatorRuntimePolicyConfigPath(), "utf8")
  );
  const source = installedOperatorSource();

  assert.equal("installedReentry" in config, false);
  assert.equal("installedConvergenceAttemptLimit" in policy, false);
  assert.equal("installedRetryReentryAttemptLimits" in policy, false);
  assert.equal("installedRepeatedBlockerAttemptLimits" in policy, false);
  assert.equal(source.includes("installedReentryAttemptLimit"), false);
  assert.equal(source.includes("installedReentryGuardScopeForAttempt"), false);
  assert.equal(source.includes("yield_guard_exhausted"), false);
  assert.equal(source.includes("retry_guard_exhausted"), false);
});

test("T-143 installed tool execution uses tenant tech-stack environment declarations", () => {
  const workspace = workspaceWithProductAuthority();
  const env = sdlcWorkspaceLocalToolEnvironment(workspace);
  const toolCacheRoot = path.join(
    workspace,
    ".ai-workspace",
    "runtime",
    "odd_sdlc",
    "tool-cache"
  );

  assert.equal(
    env.EXAMPLE_TOOL_HOME,
    path.join(toolCacheRoot, "example-home")
  );
  assert.match(
    env.EXAMPLE_TOOL_OPTS,
    new RegExp(
      `${toolCacheRoot.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}/example-tool`,
      "u"
    )
  );
  assert.equal(
    env.GIT_CEILING_DIRECTORIES.split(path.delimiter)[0],
    path.dirname(workspace)
  );
  assert.deepEqual(Object.keys(env).sort(), [
    "EXAMPLE_TOOL_HOME",
    "EXAMPLE_TOOL_OPTS",
    "GIT_CEILING_DIRECTORIES"
  ]);
  assert.equal(existsSync(path.join(toolCacheRoot, "example-tool")), true);
  assert.equal(existsSync(path.join(toolCacheRoot, "example-home")), true);
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
  assert.equal(
    reconciliation.sourceRefs.some((ref) => /specification\/PRODUCT\.md$/u.test(ref)),
    true
  );
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

test("T-172 tenant stack authority missing blocks executable materialization admission", () => {
  const workspace = workspaceWithProductAuthority();
  rmSync(path.join(workspace, "build_tenants/scala_spark/spec"), {
    recursive: true,
    force: true
  });
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "ambiguous");
  assert.equal(
    reconciliation.reasonRefs.includes("tenant_stack_authority_missing"),
    true
  );
  assert.deepEqual(reconciliation.tenantStackAuthorityTargets, []);
});

test("T-180 tenant stack repair routes to canonical tenant spec authority", () => {
  const workspace = workspaceWithModuleTargetProductAuthority();
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    `${readFileSync(path.join(workspace, "specification/PRODUCT.md"), "utf8")}${[
      "",
      "## Expected Product Files",
      "",
      "- `build_tenants/scala_spark/cdme-compiler/src` (role: `source`)",
      ""
    ].join("\n")}`,
    "utf8"
  );
  rmSync(path.join(workspace, "build_tenants/scala_spark/spec"), {
    recursive: true,
    force: true
  });
  const manifest = materializationManifest(
    workspace,
    "derive_component_code_surface",
    steelThreadEnvelope("derive_component_code_surface")
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const allowedWriteRoots = manifest.allowedWriteRoots
    .map((root) => path.relative(workspace, root).split(path.sep).join("/"))
    .sort();
  const prompt = promptForHandoff(manifest);

  assert.equal(
    reconciliation.reasonRefs.includes("tenant_stack_authority_missing"),
    true
  );
  assert.equal(
    sdlcProductMaterializationLaunchBlocker({
      manifest,
      authority: reconciliation
    }),
    null
  );
  assert.equal(
    allowedWriteRoots.includes("build_tenants/scala_spark/spec"),
    true
  );
  assert.match(
    prompt,
    /Tenant-stack authority repair target: build_tenants\/scala_spark\/spec\/TECH_STACK\.json/u
  );
  assert.match(
    prompt,
    /Do not embed tenant-stack authority inside component_depth_register/u
  );
  assert.match(
    prompt,
    /If the initial bootstrap names or implies stack-specific construction pressure/u
  );
  assert.match(
    prompt,
    /create or repair the tenant TECH_STACK\/TESTING_TECH_STACK authority from bootstrap facts and ADR\/design decisions/u
  );
  assert.match(
    prompt,
    /generic stack reconciliation protocol before product-file edits or tenant-stack repairs/u
  );
  assert.match(
    prompt,
    /inspect tenant stack authority surfaces, accepted bootstrap\/design\/ADR refs/u
  );
  assert.match(
    prompt,
    /Record a compact stack reconciliation decision/u
  );
  assert.match(
    prompt,
    /Do not repair tenant-stack authority from an untested local assumption/u
  );
  assert.doesNotMatch(prompt, /effective workspace runtime/u);
});

test("T-172 semantically empty tenant stack authority blocks executable materialization admission", () => {
  const workspace = workspaceWithProductAuthority();
  const stackSpecFile = path.join(
    workspace,
    "build_tenants/scala_spark/spec/TECH_STACK.json"
  );
  writeFileSync(
    stackSpecFile,
    `${JSON.stringify(
      {
        kind: "sdlc_tenant_technology_stack_description"
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "ambiguous");
  assert.equal(
    reconciliation.reasonRefs.includes("tenant_stack_authority_missing"),
    true
  );
  assert.deepEqual(reconciliation.tenantStackAuthorityTargets, []);
});

test("T-172 tenant stack rejects absolute build-config targets instead of rewriting them", () => {
  const workspace = workspaceWithProductAuthority();
  const stackSpecFile = path.join(
    workspace,
    "build_tenants/scala_spark/spec/TECH_STACK.json"
  );
  writeFileSync(
    stackSpecFile,
    `${JSON.stringify(
      {
        kind: "sdlc_tenant_technology_stack_description",
        buildConfigTargets: ["/tmp/Stackfile.fake"]
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "ambiguous");
  assert.equal(
    reconciliation.reasonRefs.includes("tenant_stack_authority_invalid"),
    true
  );
  assert.equal(
    reconciliation.tenantStackAuthorityTargets.includes(
      "build_tenants/scala_spark/tmp/Stackfile.fake"
    ),
    false
  );
});

test("T-172 tenant stack markdown admits tenant-relative testing build-config targets", () => {
  const workspace = workspaceWithProductAuthority();
  const specRoot = path.join(workspace, "build_tenants/scala_spark/spec");
  rmSync(specRoot, { recursive: true, force: true });
  mkdirSync(specRoot, { recursive: true });
  const stackSpecFile = path.join(specRoot, "TESTING_TECH_STACK.md");
  writeFileSync(
    stackSpecFile,
    [
      "# Testing Tech Stack",
      "",
      "## Execution Environment",
      "",
      "- workspaceLocalDirectories: `.ai-workspace/runtime/odd_sdlc/tool-cache/test-stack`",
      "",
      "## Testing Build Config Targets",
      "",
      "- TestHarness.fake"
    ].join("\n"),
    "utf8"
  );
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const target = reconciliation.tenantStackAuthorityTargetContracts.find(
    (candidate) =>
      candidate.path === "build_tenants/scala_spark/TestHarness.fake"
  );

  assert.equal(reconciliation.status, "passed");
  assert.notEqual(target, undefined);
  assert.equal(target?.sourceRef.endsWith("/TESTING_TECH_STACK.md"), true);
});

test("T-172 combined tenant stack keeps implementation role when testing shares build-config target", () => {
  const workspace = workspaceWithSingularDeclaredProductFileAuthority();
  const stackSpecFile = path.join(
    workspace,
    "build_tenants/hello_world_javascript/spec/TECH_STACK.json"
  );
  writeFileSync(
    stackSpecFile,
    `${JSON.stringify(
      {
        kind: "sdlc_tenant_technology_stack_description",
        buildConfigTargets: ["package.json"],
        executionEnvironment: {
          hostCachePolicy: "prohibited",
          workspaceLocalDirectories: [
            ".ai-workspace/runtime/odd_sdlc/tool-cache/js-stack"
          ],
          environmentVariables: {
            JS_STACK_HOME:
              "${workspaceRoot}/.ai-workspace/runtime/odd_sdlc/tool-cache/js-stack"
          }
        },
        testingTechStack: {
          testRunner: "node --test",
          testRoots: ["test"],
          testBuildConfigTargets: ["package.json"]
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const packageTarget = reconciliation.tenantStackAuthorityTargetContracts.find(
    (target) =>
      target.path === "build_tenants/hello_world_javascript/package.json"
  );

  assert.equal(reconciliation.status, "passed");
  assert.notEqual(packageTarget, undefined);
  assert.equal(packageTarget?.requiredRole, "build_config");
  assert.equal(
    packageTarget?.policyRef,
    "target-role-policy://odd-sdlc/tenant-stack/implementation/build_config"
  );
  assert.equal(packageTarget?.sourceRef.endsWith("/TECH_STACK.json"), true);
  assert.equal(
    declaredProductFileTargets(manifest).includes(
      "build_tenants/hello_world_javascript/package.json"
    ),
    true
  );
});

test("T-143 T-132 fixture declares UAT test source materialization target", () => {
  const workspace = fileURLToPath(
    new URL("../fixtures/t132_hello_world_single_tenant", import.meta.url)
  );
  const manifest = materializationManifest(
    workspace,
    FG_DERIVE_LITE_UAT_TEST_SOURCE_SURFACE
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.declaredProductFileTargets, [
    "build_tenants/hello_world_javascript/test/hello.test.js"
  ]);
  assert.deepEqual(
    reconciliation.declaredProductTargetContracts.map((target) => [
      target.path,
      target.requiredRole
    ]),
    [["build_tenants/hello_world_javascript/test/hello.test.js", "test"]]
  );
  assert.equal(
    reconciliation.reasonRefs.includes("tenant_stack_authority_invalid"),
    false
  );
  assert.equal(
    sdlcProductMaterializationLaunchBlocker({
      manifest,
      authority: reconciliation
    }),
    null
  );
  assert.doesNotThrow(() =>
    assertSdlcProductMaterializationLaunchable({
      manifest,
      authority: reconciliation
    })
  );
});

test("T-143 UAT test source derives product test targets from admitted component-test carrier", () => {
  const workspace = workspaceWithProductAuthority();
  try {
    writeComponentTestSurfaceCarrier(workspace, [
      {
        testClassId: "test-class://cdme/compiler/CompilerUatSpec",
        relativePath: "cdme-compiler/src/test/scala/cdme/compiler/CompilerUatSpec.scala",
        testcaseIds: [
          "testcase://cdme/uat/ai-assurance-rejects-invalid-path"
        ],
        componentIds: ["compiler-validation"],
        requirementIds: [
          "requirement:data_mapper.requirements.req_ldm_003",
          "requirement:data_mapper.requirements.req_ldm_005"
        ],
        shardId: "shard://cdme/integration"
      }
    ]);
    const manifest = materializationManifest(
      workspace,
      FG_DERIVE_LITE_UAT_TEST_SOURCE_SURFACE
    );
    const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

    assert.equal(reconciliation.status, "passed");
    assert.equal(
      reconciliation.declaredProductTargetContracts.some(
        (target) =>
          target.path ===
            "build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/CompilerUatSpec.scala" &&
          target.requiredRole === "test" &&
          target.policyRef === "target-role-policy://odd-sdlc/product-test-tree"
      ),
      true
    );
    assert.equal(
      sdlcProductMaterializationLaunchBlocker({
        manifest,
        authority: reconciliation
      }),
      null
    );
    assert.doesNotThrow(() =>
      assertSdlcProductMaterializationLaunchable({
        manifest,
        authority: reconciliation
      })
    );
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
});

test("T-143 UAT observation does not promote pre-existing module tests to current attempt", () => {
  const workspace = workspaceWithProductAuthority();
  try {
    writeComponentTestSurfaceCarrier(workspace, [
      {
        testClassId: "test-class://cdme/engine/EngineIntegrationSpec",
        relativePath: "cdme-engine/src/test/scala/cdme/engine/EngineIntegrationSpec.scala",
        testcaseIds: [
          "testcase://cdme/uat/ai-assurance-rejects-invalid-path"
        ],
        componentIds: ["engine-api", "compiler-validation"],
        requirementIds: [
          "requirement:data_mapper.requirements.req_int_002",
          "requirement:data_mapper.requirements.req_ldm_005"
        ],
        shardId: "shard://cdme/uat"
      }
    ]);
    const manifest = materializationManifest(
      workspace,
      FG_DERIVE_LITE_UAT_TEST_SOURCE_SURFACE
    );
    const preExistingModuleTest = path.join(
      manifest.productMaterialization.tenantRoot,
      "cdme-accounting/src/test/scala/cdme/accounting/AccountingSpec.scala"
    );
    mkdirSync(path.dirname(preExistingModuleTest), { recursive: true });
    writeFileSync(
      preExistingModuleTest,
      [
        "package cdme.accounting",
        "",
        "// requirement:data_mapper.mapper_requirements.req_acc_001",
        "final class AccountingSpec"
      ].join("\n") + "\n",
      "utf8"
    );
    const before = snapshotProductMaterializationRoot(
      manifest.productMaterialization
    );

    writeMaterializedProductFile(
      manifest,
      "build.sbt",
      "ThisBuild / scalaVersion := \"2.13.12\"",
      "build_config"
    );
    writeMaterializedProductFile(
      manifest,
      "project/build.properties",
      "sbt.version=1.10.11",
      "build_config"
    );
    writeMaterializedProductFile(
      manifest,
      "cdme-engine/src/test/scala/cdme/engine/EngineIntegrationSpec.scala",
      [
        "package cdme.engine",
        "",
        "// requirement:data_mapper.requirements.req_int_002",
        "// requirement:data_mapper.requirements.req_ldm_005",
        "final class EngineIntegrationSpec"
      ].join("\n"),
      "test"
    );

    const materialized = observeProductMaterializationDelta({ manifest, before });

    assert.deepEqual(
      materialized.map((file) => `${file.role}:${file.relativePath}`).sort(),
      [
        "build_config:build.sbt",
        "build_config:project/build.properties",
        "test:cdme-engine/src/test/scala/cdme/engine/EngineIntegrationSpec.scala"
      ]
    );
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
});

test("T-143 derives module source targets from tenant stack module layout", () => {
  const manifest = materializationManifest(
    workspaceWithModuleTargetProductAuthority()
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.productAuthorityTargets, []);
  assert.deepEqual(reconciliation.tenantStackAuthorityTargets, [
    "build_tenants/scala_spark/build.sbt",
    "build_tenants/scala_spark/cdme-assurance/src",
    "build_tenants/scala_spark/cdme-compiler/src",
    "build_tenants/scala_spark/cdme-executor/src",
    "build_tenants/scala_spark/project",
    "build_tenants/scala_spark/src/test"
  ]);
  assert.deepEqual(declaredProductFileTargets(manifest), [
    "build_tenants/scala_spark/build.sbt",
    "build_tenants/scala_spark/cdme-assurance/src",
    "build_tenants/scala_spark/cdme-compiler/src",
    "build_tenants/scala_spark/cdme-executor/src",
    "build_tenants/scala_spark/project"
  ]);
  assert.equal(
    reconciliation.tenantStackAuthorityTargetContracts.find(
      (target) => target.path === "build_tenants/scala_spark/cdme-compiler/src"
    )?.targetKind,
    "directory"
  );
  assert.equal(
    reconciliation.tenantStackAuthorityTargetContracts.find(
      (target) => target.path === "build_tenants/scala_spark/src/test"
    )?.requiredRole,
    "test"
  );
});

test("T-143 treats extensionless language source roots as directory targets", () => {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t143-source-root-"));
  try {
    mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
    mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
    writeFileSync(
      path.join(root, ".ai-workspace/context/project_constraints.yml"),
      [
        "project:",
        "  name: data_mapper_t143_source_root",
        "active_tenant: scala_spark",
        "build_tenants:",
        "  scala_spark:",
        "    output_dir: build_tenants/scala_spark",
        "    language: scala",
        "    build_tool: sbt",
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
        "## Expected Product Files",
        "",
        "- `build_tenants/scala_spark/cdme-compiler/src/main/scala` (role: `source`)",
        "- `build_tenants/scala_spark/build.sbt` (role: `build_config`)",
        ""
      ].join("\n"),
      "utf8"
    );
    writeTenantTechStackSpec(root, "build_tenants/scala_spark", [
      "build.sbt",
      "project/"
    ]);

    const manifest = materializationManifest(root);
    const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
    const sourceRootTarget = reconciliation.productAuthorityTargetContracts.find(
      (target) =>
        target.path === "build_tenants/scala_spark/cdme-compiler/src/main/scala"
    );

    assert.equal(reconciliation.status, "passed");
    assert.equal(sourceRootTarget?.targetKind, "directory");
    assert.equal(sourceRootTarget?.requiredRole, "source");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("T-143 derives Rust targets from Expected Files shorthand authority", () => {
  const manifest = materializationManifest(
    workspaceWithRustExpectedFilesAuthority(),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.productAuthorityTargets, [
    "build_tenants/hello_world_rust/Cargo.toml",
    "build_tenants/hello_world_rust/src/main.rs"
  ]);
  assert.deepEqual(
    declaredProductFileTargets(manifest),
    reconciliation.productAuthorityTargets
  );
  assert.equal(
    reconciliation.productAuthorityTargetContracts.find(
      (target) => target.path === "build_tenants/hello_world_rust/Cargo.toml"
    )?.requiredRole,
    "build_config"
  );
  assert.equal(
    reconciliation.productAuthorityTargetContracts.find(
      (target) => target.path === "build_tenants/hello_world_rust/src/main.rs"
    )?.requiredRole,
    "source"
  );
});

test("T-143 derives singular declared product file field authority", () => {
  const manifest = materializationManifest(
    workspaceWithSingularDeclaredProductFileAuthority(),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const invocationPackage = constructWorkerInvocationPackage({ manifest });
  const prompt = promptForHandoff(manifest);

  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.productAuthorityTargets, [
    "build_tenants/hello_world_javascript/src/hello.js"
  ]);
  assert.deepEqual(
    invocationPackage.outputContract.declaredProductFileTargets,
    reconciliation.productAuthorityTargets
  );
  assert.equal(
    reconciliation.productAuthorityTargetContracts.find(
      (target) =>
        target.path === "build_tenants/hello_world_javascript/src/hello.js"
    )?.requiredRole,
    "source"
  );
  assert.match(
    prompt,
    /Declared product file targets: build_tenants\/hello_world_javascript\/src\/hello\.js/u
  );
  assert.doesNotMatch(prompt, /Declared product file targets: none/u);
});

test("T-143 declared product files section ignores prose after code-span target", () => {
  const manifest = materializationManifest(
    workspaceWithProseDeclaredProductFileSection(),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const invocationPackage = constructWorkerInvocationPackage({ manifest });

  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.productAuthorityTargets, [
    "build_tenants/hello_world_javascript/src/hello.js"
  ]);
  assert.deepEqual(
    invocationPackage.outputContract.declaredProductFileTargets,
    reconciliation.productAuthorityTargets
  );
  assert.equal(
    reconciliation.productAuthorityTargets.some((target) =>
      target.includes("single declared")
    ),
    false
  );
});

test("T-143 derives declared source file field authority", () => {
  const manifest = materializationManifest(
    workspaceWithDeclaredSourceFileAuthority(),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const invocationPackage = constructWorkerInvocationPackage({ manifest });

  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.productAuthorityTargets, [
    "build_tenants/hello_world_javascript/src/hello.js"
  ]);
  assert.deepEqual(
    invocationPackage.outputContract.declaredProductFileTargets,
    reconciliation.productAuthorityTargets
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
  assert.deepEqual(reconciliation.productAuthorityTargets, []);
  assert.deepEqual(reconciliation.tenantStackAuthorityTargets, [
    "build_tenants/scala_spark/build.sbt",
    "build_tenants/scala_spark/cdme-compiler/src",
    "build_tenants/scala_spark/project"
  ]);
  assert.deepEqual(reconciliation.declaredProductFileTargets, [
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

test("T-159 steel-thread materialization keeps single-tenant selected-root source targets", () => {
  const workspace = workspaceWithDeclaredSourceFileAuthority();
  const baseManifest = materializationManifest(
    workspace,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    steelThreadEnvelope(
      FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
      "hello_world_javascript"
    )
  );
  const manifest = {
    ...baseManifest,
    featureScope: {
      ...baseManifest.featureScope,
      mode: "steel_thread",
      scopeRef:
        "scope://odd_sdlc/component-code-surface/steel-thread/hello-world-javascript",
      includedModuleNames: ["hello_world_javascript"],
      deferredModuleNames: []
    }
  };
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const invocationPackage = constructWorkerInvocationPackage({ manifest });
  const prompt = promptForHandoff(manifest);

  assert.equal(manifest.featureScope.mode, "steel_thread");
  assert.deepEqual(manifest.featureScope.includedModuleNames, [
    "hello_world_javascript"
  ]);
  assert.equal(reconciliation.status, "passed");
  assert.deepEqual(reconciliation.declaredProductFileTargets, [
    "build_tenants/hello_world_javascript/src/hello.js"
  ]);
  assert.deepEqual(
    invocationPackage.outputContract.declaredProductFileTargets,
    reconciliation.declaredProductFileTargets
  );
  assert.match(
    prompt,
    /Declared product file targets: build_tenants\/hello_world_javascript\/src\/hello\.js/u
  );
  assert.doesNotMatch(prompt, /Declared product file targets: none/u);
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
  const workspace = workspaceWithModuleTargetProductAuthority();
  const manifest = materializationManifest(
    workspace,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    steelThreadEnvelope()
  );
  const buildFile = path.join(workspace, "build_tenants/scala_spark/build.sbt");
  mkdirSync(path.dirname(buildFile), { recursive: true });
  writeFileSync(buildFile, "ThisBuild / scalaVersion := \"2.13.12\"\n", "utf8");

  writeHandoffFiles(manifest);

  assert.equal(statSync(buildFile).isFile(), true);
});

test("T-143 build-only files do not satisfy component source materialization", () => {
  const workspace = workspaceWithoutProductTargets();
  writeTenantTechStackSpec(workspace, "build_tenants/scala_spark", [
    "build.sbt",
    "project/"
  ]);
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
    ["build_config:build.sbt", "build_config:project/build.properties"]
  );
  assert.equal(materialized.some((file) => file.role === "source"), false);
});

test("T-143 build execution byproducts under declared config directories are not product truth", () => {
  const workspace = workspaceWithoutProductTargets();
  writeTenantTechStackSpec(workspace, "build_tenants/scala_spark", [
    "build.sbt",
    "project/"
  ]);
  const manifest = materializationManifest(workspace, FG_MATERIALIZE_DECLARED_PRODUCT_ASSET);
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  const buildFile = path.join(workspace, "build_tenants/scala_spark/build.sbt");
  const buildProperties = path.join(
    workspace,
    "build_tenants/scala_spark/project/build.properties"
  );
  const sbtTargetOutput = path.join(
    workspace,
    "build_tenants/scala_spark/project/target/config-classes/generated.class"
  );
  mkdirSync(path.dirname(buildProperties), { recursive: true });
  mkdirSync(path.dirname(sbtTargetOutput), { recursive: true });
  writeFileSync(buildFile, "ThisBuild / scalaVersion := \"2.13.12\"\n", "utf8");
  writeFileSync(buildProperties, "sbt.version=1.10.7\n", "utf8");
  writeFileSync(sbtTargetOutput, "compiled bytecode placeholder\n", "utf8");

  const materialized = observeProductMaterializationDelta({ manifest, before });

  assert.deepEqual(
    materialized.map((file) => `${file.role}:${file.relativePath}`).sort(),
    ["build_config:build.sbt", "build_config:project/build.properties"]
  );
});

test("T-143 non-materialization surface edge ignores pre-existing tenant build config", () => {
  const workspace = workspaceWithoutProductTargets();
  writeTenantTechStackSpec(workspace, "build_tenants/scala_spark", ["project/"]);
  const buildProperties = path.join(
    workspace,
    "build_tenants/scala_spark/project/build.properties"
  );
  mkdirSync(path.dirname(buildProperties), { recursive: true });
  writeFileSync(buildProperties, "sbt.version=1.10.7\n", "utf8");
  const contract = hookContractByEdgeName("derive_intent_surface");
  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: workspace,
    graphFunctionName: "derive_intent_surface",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t143-surface-preexisting-build-config"
  });
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);

  writeOutputSurface(manifest, "intent_surface");
  const report = buildPostTransformWorkerResultReport({ manifest, before });
  const postflight = evaluateSdlcComputeStage({ manifest, report });

  assert.equal(manifest.productMaterialization.required, false);
  assert.deepEqual(report.materializedFiles, []);
  assert.equal(
    postflight.blockingReasons.includes(
      "unexpected_product_materialization_for_surface_edge"
    ),
    false,
    JSON.stringify(postflight.blockingReasons, null, 2)
  );
});

test("T-143 context expected-file targets are observation beside product authority", () => {
  const workspace = workspaceWithProductAuthority();
  writeJsonExpectedFiles(workspace, [
    "build_tenants/scala_spark/build.sbt",
    "build_tenants/scala_spark/other/src"
  ]);
  const manifest = materializationManifest(workspace);
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "passed");
  assert.equal(
    reconciliation.reasonRefs.includes("product_context_target_mismatch"),
    true
  );
  assert.equal(
    reconciliation.reasonRefs.includes("context_expected_files_observation_only"),
    true
  );
  assert.equal(
    reconciliation.declaredProductTargetContracts.some(
      (target) => target.source === "context_expected_files"
    ),
    false
  );
  assert.equal(
    reconciliation.contextExpectedTargetContracts.find(
      (target) => target.path === "build_tenants/scala_spark/other/src"
    )?.source,
    "context_expected_files"
  );
  assert.equal(
    reconciliation.declaredProductTargetContracts.find(
      (target) => target.path === "build_tenants/scala_spark/cdme-compiler/src"
    )?.source,
    "tenant_stack_authority"
  );
});

test("T-143 empty component-code source target authority fails before F_P launch", () => {
  const manifest = materializationManifest(workspaceWithoutProductTargets());
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);

  assert.equal(reconciliation.status, "missing");
  assert.equal(
    sdlcProductMaterializationLaunchBlocker({
      manifest,
      authority: reconciliation
    }),
    "component_code_source_materialization_targets_missing"
  );
  assert.deepEqual(
    reconciliation.declaredProductTargetContracts,
    []
  );
  assert.throws(
    () =>
      assertSdlcProductMaterializationLaunchable({
        manifest,
        authority: reconciliation
      }),
    /sdlc_product_materialization_launch_blocked:component_code_source_materialization_targets_missing/u
  );
  assert.throws(
    () => constructWorkerInvocationPackage({ manifest }),
    /sdlc_product_materialization_launch_blocked:component_code_source_materialization_targets_missing/u
  );
  assert.throws(
    () => promptForHandoff(manifest),
    /sdlc_product_materialization_launch_blocked:component_code_source_materialization_targets_missing/u
  );
});

test("T-205 product-materialization launch blockers stay pre-dispatch under ABG control", async () => {
  const workspaceRoot = workspaceWithoutProductTargets();
  try {
    const manifest = materializationManifest(workspaceRoot);
    const source = installedOperatorSource();
    const operatorIndex = readFileSync(
      new URL("../../code/src/operator/index.ts", import.meta.url),
      "utf8"
    );

    assert.equal(source.includes("executeInstalledOperatorStart"), false);
    assert.equal(operatorIndex.includes("executeInstalledOperatorStart"), false);
    assert.throws(
      () => constructWorkerInvocationPackage({ manifest }),
      /sdlc_product_materialization_launch_blocked:component_code_source_materialization_targets_missing/u
    );
    assert.throws(
      () => promptForHandoff(manifest),
      /sdlc_product_materialization_launch_blocked:component_code_source_materialization_targets_missing/u
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-143 tenant-stack repair does not mask missing component-code source targets", () => {
  const manifest = materializationManifest(workspaceWithoutProductTargets());
  const reconciliation = reconcileSdlcProductMaterializationAuthority(manifest);
  const ambiguousAuthority = {
    ...reconciliation,
    status: "ambiguous",
    reasonRefs: [
      "declared_product_file_targets_missing",
      "tenant_stack_authority_invalid"
    ]
  };

  assert.equal(
    sdlcProductMaterializationLaunchBlocker({
      manifest,
      authority: ambiguousAuthority
    }),
    "component_code_source_materialization_targets_missing"
  );
  assert.throws(
    () =>
      assertSdlcProductMaterializationLaunchable({
        manifest,
        authority: ambiguousAuthority
      }),
    /sdlc_product_materialization_launch_blocked:component_code_source_materialization_targets_missing/u
  );
});

test("T-143 component-code materialization leaves execution evidence to downstream evaluator", () => {
  const manifest = materializationManifest(
    workspaceWithProductAuthority(),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const prompt = promptForHandoff(manifest);
  const output = writeOutputSurface(manifest);
  const materializedFiles = [writeMaterializedSourceFile(manifest)];

  writeWorkerResultReport({
    manifest,
    output,
    materializedFiles,
    executionEvidence: null
  });

  const report = readWorkerResultReport(manifest);
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateSdlcComputeStage({ manifest, report });

  assert.doesNotMatch(prompt, /sdlc_worker_execution_evidence/u);
  assert.equal(report.executionEvidence, null);
  assert.equal(
    postflight.blockingReasonCarriers.some(
      (reason) => reason.code === "test_execution_evidence_missing"
    ),
    false
  );
});

test("T-143 component-code report rejects failed execution evidence authority", () => {
  const manifest = materializationManifest(
    workspaceWithProductAuthority(),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const output = writeOutputSurface(manifest);
  const materializedFiles = [
    writeMaterializedProductFile(
      manifest,
      "build.sbt",
      "ThisBuild / scalaVersion := \"2.13.12\"",
      "build_config"
    ),
    writeMaterializedProductFile(
      manifest,
      "project/build.properties",
      "sbt.version=1.10.7",
      "build_config"
    ),
    writeMaterializedSourceFile(manifest),
    writeMaterializedSourceFile(
      manifest,
      "cdme-assurance/src/main/scala/com/cdme/assurance/Probe.scala"
    ),
    writeMaterializedSourceFile(
      manifest,
      "cdme-executor/src/main/scala/com/cdme/executor/Probe.scala"
    )
  ];
  const reportRef = writeExecutionLog(
    manifest,
    "sbt-test.log",
    "sbt test exited 1"
  );

  writeWorkerResultReport({
    manifest,
    output,
    materializedFiles,
    executionEvidence: {
      kind: "sdlc_worker_execution_evidence",
      lane: "test",
      command: manifest.productMaterialization.testExecutionContract,
      status: "failed",
      reportRefs: [reportRef],
      testsObserved: 1,
      passedCount: 0,
      failedCount: 1,
      shardEvidence: []
    }
  });

  assert.throws(
    () => readWorkerResultReport(manifest),
    /target asset type does not admit execution evidence/u
  );
});

test("T-143 component-code report rejects successful execution evidence authority", () => {
  const manifest = materializationManifest(
    workspaceWithProductAuthority(),
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const output = writeOutputSurface(manifest);
  const materializedFiles = [
    writeMaterializedProductFile(
      manifest,
      "build.sbt",
      "ThisBuild / scalaVersion := \"2.13.12\"",
      "build_config"
    ),
    writeMaterializedProductFile(
      manifest,
      "project/build.properties",
      "sbt.version=1.10.7",
      "build_config"
    ),
    writeMaterializedSourceFile(manifest),
    writeMaterializedSourceFile(
      manifest,
      "cdme-assurance/src/main/scala/com/cdme/assurance/Probe.scala"
    ),
    writeMaterializedSourceFile(
      manifest,
      "cdme-executor/src/main/scala/com/cdme/executor/Probe.scala"
    )
  ];
  const reportRef = writeExecutionLog(
    manifest,
    "sbt-test.log",
    "sbt test exited 0"
  );

  writeWorkerResultReport({
    manifest,
    output,
    materializedFiles,
    executionEvidence: {
      kind: "sdlc_worker_execution_evidence",
      lane: "test",
      command: manifest.productMaterialization.testExecutionContract,
      status: "succeeded",
      reportRefs: [reportRef],
      testsObserved: 1,
      passedCount: 1,
      failedCount: 0,
      shardEvidence: []
    }
  });

  assert.throws(
    () => readWorkerResultReport(manifest),
    /target asset type does not admit execution evidence/u
  );
});

test("T-143 Rust component-code report rejects runner-prefixed execution evidence", () => {
  const workspace = workspaceWithRustExpectedFilesAuthority();
  writeJsonExpectedFiles(workspace, [
    "build_tenants/hello_world_rust/Cargo.toml",
    "build_tenants/hello_world_rust/src/main.rs"
  ]);
  const manifest = materializationManifest(
    workspace,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const output = writeOutputSurface(manifest);
  const materializedFiles = [
    writeMaterializedProductFile(
      manifest,
      "Cargo.toml",
      [
        "# Implements: REQ-RUST-HELLO-WORLD-001",
        "[package]",
        "name = \"hello_world_rust\"",
        "version = \"0.1.0\"",
        "edition = \"2021\""
      ].join("\n"),
      "build_config"
    ),
    writeMaterializedProductFile(
      manifest,
      "src/main.rs",
      "// Implements: REQ-RUST-HELLO-WORLD-001\nfn main() {\n    println!(\"Hello, world!\");\n}",
      "source"
    )
  ];
  const reportRef = writeExecutionLog(
    manifest,
    "cargo-run.log",
    "Hello, world!\n---EXIT=0"
  );

  writeWorkerResultReport({
    manifest,
    output,
    materializedFiles,
    executionEvidence: {
      kind: "sdlc_worker_execution_evidence",
      lane: "test",
      command: "cargo run --quiet",
      status: "succeeded",
      reportRefs: [reportRef],
      testsObserved: 1,
      passedCount: 1,
      failedCount: 0,
      shardEvidence: [
        {
          kind: "sdlc_worker_execution_shard_evidence",
          shardId: "rust-hello-world",
          moduleName: "hello_world_rust",
          lane: "test",
          command: "cargo run --quiet",
          status: "succeeded",
          reportRefs: [reportRef],
          testsObserved: 1,
          passedCount: 1,
          failedCount: 0
        }
      ]
    }
  });

  assert.equal(
    manifest.productMaterialization.testExecutionContract,
    "undeclared"
  );
  assert.throws(
    () => readWorkerResultReport(manifest),
    /target asset type does not admit execution evidence/u
  );
});

test("T-143 component-code transform artifact execution evidence is diagnostic-only", () => {
  const workspace = workspaceWithRustExpectedFilesAuthority();
  writeJsonExpectedFiles(workspace, [
    "build_tenants/hello_world_rust/Cargo.toml",
    "build_tenants/hello_world_rust/src/main.rs"
  ]);
  const manifest = materializationManifest(
    workspace,
    FG_MATERIALIZE_DECLARED_PRODUCT_ASSET
  );
  const before = snapshotProductMaterializationRoot(
    manifest.productMaterialization
  );
  mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
  writeFileSync(
    manifest.outputFile,
    [
      "# component_code_surface",
      "",
      "```json sdlc_worker_execution_evidence",
      JSON.stringify(
        {
          kind: "sdlc_worker_execution_evidence",
          lane: "test",
          command: "cargo run --quiet",
          status: "succeeded",
          reportRefs: ["file://cargo-run.log"],
          testsObserved: 1,
          passedCount: 1,
          failedCount: 0,
          shardEvidence: []
	        },
	        null,
	        2
	      ),
	      "```",
	      "",
	      "## Target Carrier",
	      "",
	      JSON.stringify(
	        {
	          kind: "sdlc_component_depth_register",
	          registerVersion: "ts-component-depth-v1",
	          targetAssetType: "component_code_surface",
	          componentTopologyRows: [],
	          componentRealizationRows: [
	            {
	              kind: "sdlc_component_realization_row",
	              componentId: "hello-world-rust",
	              moduleName: "hello_world_rust",
	              relativePath: "src/main.rs",
	              publicBoundary: "main",
	              trancheId: "tranche:hello-world-rust",
	              firstProductFileToChange: "src/main.rs",
	              upstreamComponentIds: [],
	              requirementIds: ["REQ-RUST-HELLO-WORLD-001"],
	              sourceAssetRefs: ["fixture://t143/rust-hello"]
	            }
	          ],
	          testComponentTopologyRows: [],
	          componentTestRows: [],
	          componentTestQualificationRows: [],
	          componentExecutionFailureRegister: null,
	          componentRepairSchedule: null,
	          releaseDepthParity: null
	        },
	        null,
	        2
	      )
	    ].join("\n"),
    "utf8"
  );
  writeMaterializedProductFile(
    manifest,
    "Cargo.toml",
    [
      "# Implements: REQ-RUST-HELLO-WORLD-001",
      "[package]",
      "name = \"hello_world_rust\"",
      "version = \"0.1.0\"",
      "edition = \"2021\""
    ].join("\n"),
    "build_config"
  );
  writeMaterializedProductFile(
    manifest,
    "src/main.rs",
    "// Implements: REQ-RUST-HELLO-WORLD-001\nfn main() {\n    println!(\"Hello, world!\");\n}",
    "source"
  );

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  writeProductMaterializationManifest({ manifest, report });
  const postflight = evaluateSdlcComputeStage({ manifest, report });

  assert.equal(report.executionEvidence, null);
  assert.match(
    report.executionEvidenceErrors.join("\n"),
    /non-execution edge/u
  );
  assert.equal(postflight.status, "passed");
  assert.equal(
    postflight.blockingReasonCarriers.some(
      (reason) =>
        reason.code === "worker_execution_evidence_for_non_execution_edge"
    ),
    true
  );
});
