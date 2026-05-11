// Validates: T-133

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FG_CONFORM_PROJECT,
  FG_CONFORM_PROJECT_AUTHORITY,
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH,
  ODD_SDLC_RUNTIME_ROOT_RELATIVE_PATH,
  ODD_SDLC_TRANSFORM_ASSET_ROOT_RELATIVE_PATH
} from "../../build/semantic/code/src/index.js";
import { liveTestArchiveRoot } from "./archive_root.mjs";
import {
  evaluateHelloWorldAuthorityConformance,
  evaluateHelloWorldProductExecution
} from "./hello_world_live_validation.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const FIXTURE_ROOT = path.join(PACKAGE_ROOT, "test_env/fixtures/t133_rust_hello_world_minimal");
const BOOTSTRAP_PATH = path.join(FIXTURE_ROOT, "bootstrap.md");
const SOURCE_ODD_SDLC_CLI = path.join(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");
const LIVE_ENABLED = process.env["ODD_SDLC_TS_T133_RUST_HELLO_WORLD_LIVE"] === "1";
const CONFORMANCE_ONLY = process.env["ODD_SDLC_TS_LIVE_CONFORMANCE_ONLY"] === "1";
const LIVE_WORKER =
  process.env["ODD_SDLC_TS_T133_RUST_HELLO_WORLD_WORKER"] ??
  "process://codex?model=gpt-5.5&effort=medium";
const INSTALL_COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_T133_RUST_HELLO_WORLD_INSTALL_TIMEOUT_MS"] ?? `${1000 * 60 * 20}`,
  10
);
const INSTALLED_COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_T133_RUST_HELLO_WORLD_INSTALLED_COMMAND_TIMEOUT_MS"] ?? "0",
  10
);

function archiveTimestamp() {
  return new Date().toISOString().replace(/[-:]/gu, "").replace(".", "").replace("Z", "Z");
}

function writeJson(filePath, payload) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function sha256Text(text) {
  return Buffer.from(text, "utf8").toString("base64url");
}

function extractScenarioContract(markdown) {
  const match = /```json scenario_contract\s*([\s\S]*?)\s*```/u.exec(markdown);
  assert(match, "bootstrap.md must contain a json scenario_contract fenced block");
  return JSON.parse(match[1]);
}

function assertNonEmptyString(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.notEqual(value.trim(), "", `${label} must be non-empty`);
}

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    assert.equal(seen.has(value), false, `${label} contains duplicate value ${value}`);
    seen.add(value);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function assertTextContains(text, value, label) {
  assert.match(text, new RegExp(escapeRegExp(value), "u"), `${label} must contain ${value}`);
}

function assertScenarioContract(contract) {
  assert.equal(contract.schemaVersion, "t133.rust_hello_world_minimal.v1");
  assert.equal(contract.scenarioId, "t133_rust_hello_world_minimal");
  assert.equal(contract.product.name, "hello_world_rust_minimal");
  assert.equal(contract.builderHarness.builder, "odd_sdlc");
  assert.equal(contract.builderHarness.notRuntimeDependency, true);
  assert.deepEqual(contract.authorityInput, {
    kind: "source_file",
    path: "bootstrap.md",
    graphFunction: FG_CONFORM_PROJECT_AUTHORITY
  });
  assert.equal(contract.expectedOutput, "Hello, world!");
  assert.equal(contract.sandbox.expectedRuntimeRoot, ODD_SDLC_RUNTIME_ROOT_RELATIVE_PATH);
  assert.equal(
    contract.sandbox.expectedTransformAssetRoot,
    ODD_SDLC_TRANSFORM_ASSET_ROOT_RELATIVE_PATH
  );
  assert.equal(contract.sandbox.expectedOperatorRunRoot, ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH);

  const tenant = contract.tenant;
  assert.equal(tenant.id, "rust");
  assert.equal(tenant.tenantName, "hello_world_rust");
  assert.equal(tenant.runtime, "cargo");
  assert.equal(tenant.selectedOutputRoot, "build_tenants/hello_world_rust");
  assert.equal(tenant.manifestFile, "build_tenants/hello_world_rust/Cargo.toml");
  assert.equal(tenant.sourceFile, "build_tenants/hello_world_rust/src/main.rs");
  assert.equal(tenant.run.command, "cargo");
  assert.deepEqual(tenant.run.args, ["run", "--quiet"]);
  assert.equal(tenant.run.cwd, tenant.selectedOutputRoot);

  assert.equal(Array.isArray(contract.expectedFiles), true);
  assert.deepEqual(contract.expectedFiles, [tenant.manifestFile, tenant.sourceFile]);
  assertUnique(contract.expectedFiles, "expectedFiles");
  assert.deepEqual(contract.expectedRequirementIds, [
    "REQ-T133-001",
    "REQ-T133-002",
    "REQ-T133-003",
    "REQ-T133-004",
    "REQ-T133-005"
  ]);
  assertUnique(contract.expectedRequirementIds, "expectedRequirementIds");
  assert.equal(Array.isArray(contract.requirements), true);
  assert.deepEqual(
    contract.requirements.map((requirement) => requirement.id),
    contract.expectedRequirementIds
  );
  for (const requirement of contract.requirements) {
    assertNonEmptyString(requirement.title, `${requirement.id}.title`);
    assertNonEmptyString(requirement.text, `${requirement.id}.text`);
  }
  for (const expectedFile of contract.expectedFiles) {
    assert.equal(
      expectedFile.startsWith(`${tenant.selectedOutputRoot}/`),
      true,
      `${expectedFile} must live under selectedOutputRoot`
    );
  }

  const nodeIds = contract.lifecycleGraph.nodes.map((node) => node.id);
  const vectorIds = contract.lifecycleGraph.vectors.map((vector) => vector.id);
  assertUnique(nodeIds, "lifecycleGraph.nodes.id");
  assertUnique(vectorIds, "lifecycleGraph.vectors.id");
  for (const vector of contract.lifecycleGraph.vectors) {
    assert.equal(nodeIds.includes(vector.target), true, `${vector.id} target must be declared`);
    for (const source of vector.source) {
      assert.equal(nodeIds.includes(source), true, `${vector.id} source must be declared`);
    }
  }
  assert.equal(Array.isArray(contract.lawfulActions), true);
  assert.equal(contract.lawfulActions.length, contract.lifecycleGraph.vectors.length);
  for (const action of contract.lawfulActions) {
    assert.equal(vectorIds.includes(action.vector), true, `${action.id} vector must be declared`);
    assertNonEmptyString(action.graphFunction, `${action.id}.graphFunction`);
    assertNonEmptyString(action.expectedCarrier, `${action.id}.expectedCarrier`);
    assertNonEmptyString(action.donePredicate, `${action.id}.donePredicate`);
    assertNonEmptyString(action.retryAction, `${action.id}.retryAction`);
  }
  assert.equal(
    contract.commands.conformProjectAuthority.some((command) =>
      command.includes(`graph_function:${FG_CONFORM_PROJECT_AUTHORITY}`)
    ),
    true,
    "commands.conformProjectAuthority must include Fg_conform_project_authority"
  );
  assert.equal(
    contract.commands.buildProduct.some((command) => command.includes("odd-sdlc-ts start")),
    true,
    "commands.buildProduct must include odd-sdlc-ts start"
  );
  assert.equal(
    contract.commands.buildProduct.some((command) =>
      command.includes("bootstrap_release_self_test")
    ),
    false,
    "commands.buildProduct must not use bootstrap_release_self_test as bootstrap"
  );
  assert.equal(
    contract.commands.buildProduct.some((command) =>
      command.includes("asset:component_code_surface")
    ),
    false,
    "commands.buildProduct must not inject the product target"
  );
  assert.deepEqual(contract.commands.testProduct, [
    "cd build_tenants/hello_world_rust && cargo run --quiet"
  ]);
}

function projectConstraintsText(contract) {
  return [
    "project:",
    `  name: ${contract.sandbox.workspaceSlug}`,
    `active_tenant: ${contract.tenant.tenantName}`,
    `selected_output_root: ${contract.tenant.selectedOutputRoot}`,
    "ambiguity_risk_appetite: low",
    "runtime:",
    `  root: ${ODD_SDLC_RUNTIME_ROOT_RELATIVE_PATH}`,
    `  transform_asset_root: ${ODD_SDLC_TRANSFORM_ASSET_ROOT_RELATIVE_PATH}`,
    `  operator_run_root: ${ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH}`,
    "  product_materialization_root_policy: selected_output_root",
    "build_tenants:",
    `  ${contract.tenant.tenantName}:`,
    `    output_dir: ${contract.tenant.selectedOutputRoot}/`,
    "    language: Rust",
    "    build_tool: cargo",
    "    test_runner: cargo",
    "    module_structure:",
    `      - ${contract.tenant.tenantName}`
  ].join("\n");
}

function writeBootstrapWorkspace(workspace, bootstrapMarkdown, contract) {
  rmSync(workspace, { recursive: true, force: true });
  mkdirSync(path.join(workspace, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(workspace, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(workspace, "gtl"), { recursive: true });
  mkdirSync(path.join(workspace, "build_tenants"), { recursive: true });
  writeFileSync(path.join(workspace, "README.md"), `# ${contract.product.name}\n`, "utf8");
  writeFileSync(path.join(workspace, "bootstrap.md"), bootstrapMarkdown, "utf8");
  const constraintsText = projectConstraintsText(contract);
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    constraintsText,
    "utf8"
  );
  writeJson(path.join(workspace, "gtl/graph.json"), {
    kind: "t133_rust_hello_world_minimal_graph_projection",
    sourceBootstrapDigest: sha256Text(bootstrapMarkdown),
    role: contract.lifecycleGraph.role,
    moduleName: contract.lifecycleGraph.moduleName,
    graphFunction: contract.lifecycleGraph.graphFunction,
    nodes: contract.lifecycleGraph.nodes,
    vectors: contract.lifecycleGraph.vectors,
    lawfulActions: contract.lawfulActions
  });
  writeJson(path.join(workspace, ".ai-workspace/context/rust_hello_world_contract.json"), {
    kind: "t133_rust_hello_world_minimal_contract",
    sourceBootstrapDigest: sha256Text(bootstrapMarkdown),
    tenant: contract.tenant,
    expectedOutput: contract.expectedOutput,
    expectedFiles: contract.expectedFiles
  });
}

function assertBootstrapSourceWorkspace(workspace, contract) {
  assert.equal(existsSync(path.join(workspace, "bootstrap.md")), true);
  assert.equal(
    existsSync(path.join(workspace, ".ai-workspace/context/project_constraints.yml")),
    true
  );
  assert.equal(
    existsSync(path.join(workspace, ".ai-workspace/context/project_bootstrap.md")),
    false,
    "sandbox must not pre-materialize conformed project bootstrap"
  );
  for (const relativePath of [
    "specification/INTENT.md",
    "specification/PRODUCT.md",
    "specification/GOALS.md",
    "specification/requirements/01-rust-hello-world.md"
  ]) {
    assert.equal(
      existsSync(path.join(workspace, relativePath)),
      false,
      `sandbox must not pre-materialize ${relativePath}`
    );
  }
  assertNoPrebuiltRustImplementation(workspace, contract);
}

function assertConformedProjectWorkspace(workspace, contract) {
  for (const relativePath of [
    ".ai-workspace/context/project_bootstrap.md",
    "specification/INTENT.md",
    "specification/PRODUCT.md",
    "specification/GOALS.md"
  ]) {
    assert.equal(
      existsSync(path.join(workspace, relativePath)),
      true,
      `F_P authority conformance must materialize ${relativePath}`
    );
  }
  const requirementDir = path.join(workspace, "specification/requirements");
  const requirementFiles = readdirSync(requirementDir)
    .filter((entry) => entry.endsWith(".md"))
    .sort();
  assert.ok(
    requirementFiles.length > 0,
    "F_P authority conformance must induce at least one requirement surface"
  );
}

function assertNoPrebuiltRustImplementation(workspace, contract) {
  const generatedTargetsPresent = contract.expectedFiles
    .filter((relativePath) => existsSync(path.join(workspace, relativePath)))
    .sort();
  assert.deepEqual(
    generatedTargetsPresent,
    [],
    `bootstrap sandbox must not start with generated Rust files: ${generatedTargetsPresent.join(", ")}`
  );
}

function installedCommandEnv() {
  const env = { ...process.env };
  delete env.ODD_SDLC_TS_TEST_RUN_ROOT;
  delete env.ODD_SDLC_TS_LIVE_TEST_RUN_ROOT;
  return {
    ...env,
    ODD_SDLC_TS_OUTPUT: "json",
    ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
    ABG_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal"
  };
}

function installedOddSdlcCommand(install) {
  const commandPath = install.commandPaths.find(
    (candidate) => path.basename(candidate) === "odd-sdlc-ts"
  );
  assert(commandPath, "odd-sdlc-ts command path missing");
  return commandPath;
}

function runSourceInstallCommand(workspace, archiveRoot) {
  const args = [
    SOURCE_ODD_SDLC_CLI,
    "install",
    "--target",
    workspace,
    "--package-source",
    PACKAGE_ROOT,
    "--abg-package-source",
    ABG_TYPESCRIPT_ROOT,
    "--installed-package-name",
    "odd-sdlc-t133-rust-hello-world"
  ];
  const run = spawnSync(process.execPath, args, {
    cwd: PACKAGE_ROOT,
    encoding: "utf8",
    env: installedCommandEnv(),
    maxBuffer: 1024 * 1024 * 50,
    timeout: INSTALL_COMMAND_TIMEOUT_MS
  });
  writeJson(path.join(archiveRoot, "install.process.json"), {
    label: "install",
    commandPath: process.execPath,
    args,
    cwd: PACKAGE_ROOT,
    status: run.status,
    signal: run.signal,
    error: run.error?.message ?? null,
    timeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
    stdoutBytes: Buffer.byteLength(run.stdout ?? "", "utf8"),
    stderrBytes: Buffer.byteLength(run.stderr ?? "", "utf8")
  });
  writeFileSync(path.join(archiveRoot, "install.stdout.json"), run.stdout ?? "", "utf8");
  writeFileSync(path.join(archiveRoot, "install.stderr.log"), run.stderr ?? "", "utf8");
  assert.equal(run.status, 0, run.stderr || run.error?.message);
  const result = JSON.parse(run.stdout);
  writeJson(path.join(archiveRoot, "install_result.json"), result);
  assert.equal(result.kind, "odd_sdlc_spec_method_result");
  assert.equal(result.command, "install");
  assert.equal(result.status, "ok");
  assert.equal(result.payload?.kind, "installed");
  return result.payload;
}

function runInstalled(commandPath, args, workspace, archiveRoot, label) {
  const options = {
    cwd: workspace,
    encoding: "utf8",
    env: installedCommandEnv(),
    maxBuffer: 1024 * 1024 * 50
  };
  if (INSTALLED_COMMAND_TIMEOUT_MS > 0) {
    options.timeout = INSTALLED_COMMAND_TIMEOUT_MS;
  }
  const run = spawnSync(commandPath, args, options);
  writeJson(path.join(archiveRoot, `${label}.process.json`), {
    label,
    commandPath,
    args,
    cwd: workspace,
    status: run.status,
    signal: run.signal,
    error: run.error?.message ?? null,
    timeoutMs: INSTALLED_COMMAND_TIMEOUT_MS > 0 ? INSTALLED_COMMAND_TIMEOUT_MS : null,
    stdoutBytes: Buffer.byteLength(run.stdout ?? "", "utf8"),
    stderrBytes: Buffer.byteLength(run.stderr ?? "", "utf8")
  });
  writeFileSync(path.join(archiveRoot, `${label}.stdout.json`), run.stdout ?? "", "utf8");
  writeFileSync(path.join(archiveRoot, `${label}.stderr.log`), run.stderr ?? "", "utf8");
  assert.equal(run.status, 0, run.stderr || run.error?.message);
  const parsed = JSON.parse(run.stdout);
  assert.equal(parsed.kind, "odd_sdlc_spec_method_result");
  assert.equal(parsed.status, "ok", JSON.stringify(parsed, null, 2));
  return parsed.payload;
}

function runProcess(workspace, archiveRoot, label, command, args, options = {}) {
  const cwd = options.cwd ? path.join(workspace, options.cwd) : workspace;
  const run = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: installedCommandEnv(),
    maxBuffer: 1024 * 1024 * 20,
    timeout: INSTALL_COMMAND_TIMEOUT_MS
  });
  const record = {
    label,
    command,
    args,
    cwd,
    status: run.status,
    signal: run.signal,
    error: run.error?.message ?? null,
    timeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
    stdout: run.stdout ?? "",
    stderr: run.stderr ?? "",
    stdoutTrimmed: (run.stdout ?? "").trim()
  };
  writeJson(path.join(archiveRoot, `${label}.process.json`), record);
  assert.equal(run.status, 0, run.stderr || run.error?.message || JSON.stringify(record, null, 2));
  return record;
}

function executeRustTenant(workspace, archiveRoot, contract) {
  const run = runProcess(
    workspace,
    archiveRoot,
    "hello-world-rust-run",
    contract.tenant.run.command,
    contract.tenant.run.args,
    { cwd: contract.tenant.run.cwd }
  );
  assert.equal(run.stdoutTrimmed, contract.expectedOutput);
  return {
    tenantId: contract.tenant.id,
    tenantName: contract.tenant.tenantName,
    manifestFile: contract.tenant.manifestFile,
    sourceFile: contract.tenant.sourceFile,
    stdout: run.stdoutTrimmed,
    status: run.status
  };
}

function generatedProductState(workspace, contract) {
  const expectedFiles = contract.expectedFiles.map((relativePath) => ({
    relativePath,
    exists: existsSync(path.join(workspace, relativePath))
  }));
  const runtimeRoot = path.join(workspace, ODD_SDLC_RUNTIME_ROOT_RELATIVE_PATH);
  const runtimeAssetRoot = path.join(workspace, ODD_SDLC_TRANSFORM_ASSET_ROOT_RELATIVE_PATH);
  const operatorRunRoot = path.join(workspace, ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH);
  return {
    expectedFiles,
    expectedFilesPresent: expectedFiles.every((row) => row.exists),
    expectedFilesPresentCount: expectedFiles.filter((row) => row.exists).length,
    runtimeFileCount: countFiles(runtimeRoot),
    runtimeAssetFileCount: countFiles(runtimeAssetRoot),
    operatorRunFileCount: countFiles(operatorRunRoot),
    generatedAtMtimeMs: statSync(workspace).mtimeMs
  };
}

function countFiles(root) {
  if (!existsSync(root)) {
    return 0;
  }
  let count = 0;
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(child);
      } else if (entry.isFile()) {
        count += 1;
      }
    }
  }
  return count;
}

function edgeSummary(payload) {
  return {
    status: payload.status,
    currentEdge: payload.projection?.currentEdge ?? payload.summary?.currentEdge ?? null,
    graphFunction: payload.summary?.graphFunctionName ?? null,
    nextLawfulAction: payload.summary?.nextLawfulAction ?? null,
    postflight: payload.postflight?.status ?? null,
    assurance: payload.assuranceSatisfaction?.status ?? null,
    blockingReason: payload.summary?.blockingReason ?? payload.blockingReason ?? null,
    archiveRoot: payload.archiveRoot ?? payload.summary?.archiveRoot ?? null
  };
}

function readJsonIfExists(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function productMaterializationConsequenceRows(workspace) {
  const runRoot = path.join(workspace, ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH);
  if (!existsSync(runRoot)) {
    return [];
  }
  return readdirSync(runRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const archiveRoot = path.join(runRoot, entry.name);
      const ledger = readJsonIfExists(path.join(archiveRoot, "sdlc_edge_fulfillment_ledger.json"));
      const closureDecision = readJsonIfExists(
        path.join(archiveRoot, "sdlc_edge_closure_decision.json")
      );
      const nextActionProjection = readJsonIfExists(
        path.join(archiveRoot, "sdlc_next_action_projection.json")
      );
      return {
        archiveRoot,
        ledger,
        closureDecision,
        nextActionProjection
      };
    })
    .filter((row) =>
      row.ledger !== null &&
      row.closureDecision !== null &&
      row.nextActionProjection !== null &&
      row.closureDecision.disposition === "close" &&
      row.ledger.downstreamPressureRefs?.length > 0 &&
      row.nextActionProjection.choosesNextTraversal === true &&
      row.nextActionProjection.nextGraphFunctionRef ===
        `graph-function:odd_sdlc:${FG_MATERIALIZE_DECLARED_PRODUCT_ASSET}`
    );
}

function productMaterializationRequiredRows(workspace) {
  const runRoot = path.join(workspace, ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH);
  if (!existsSync(runRoot)) {
    return [];
  }
  return readdirSync(runRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const archiveRoot = path.join(runRoot, entry.name);
      const handoffManifest = readJsonIfExists(path.join(archiveRoot, "handoff_manifest.json"));
      const workerPackage = readJsonIfExists(
        path.join(archiveRoot, "worker_invocation_package.json")
      );
      return {
        archiveRoot,
        graphFunctionName:
          handoffManifest?.graphFunctionName ?? workerPackage?.graphFunctionName ?? null,
        targetAssetType:
          handoffManifest?.targetAssetType ?? workerPackage?.targetAssetType ?? null,
        required:
          handoffManifest?.productMaterialization?.required ??
          workerPackage?.workerBrief?.materializationRequired ??
          workerPackage?.materializationRequired ??
          null,
        requiredRoles:
          handoffManifest?.productMaterialization?.requiredRoles ??
          workerPackage?.workerBrief?.requiredRoles ??
          Object.freeze([])
      };
    })
    .filter((row) =>
      row.graphFunctionName === FG_MATERIALIZE_DECLARED_PRODUCT_ASSET ||
      row.targetAssetType === "component_code_surface"
    );
}

test("T-133 bootstrap document is a complete one-tenant Rust hello-world contract", () => {
  const bootstrapMarkdown = readFileSync(BOOTSTRAP_PATH, "utf8");
  const contract = extractScenarioContract(bootstrapMarkdown);
  assertScenarioContract(contract);

  const archiveRoot = resolve(
    liveTestArchiveRoot("t133_rust_hello_world_contract", archiveTimestamp(), process.pid)
  );
  writeJson(path.join(archiveRoot, "scenario_contract_snapshot.json"), {
    bootstrapPath: BOOTSTRAP_PATH,
    bootstrapDigest: sha256Text(bootstrapMarkdown),
    contract
  });
});

test("T-133 bootstrap-only sandbox has no prebuilt Rust implementation", () => {
  const bootstrapMarkdown = readFileSync(BOOTSTRAP_PATH, "utf8");
  const contract = extractScenarioContract(bootstrapMarkdown);
  assertScenarioContract(contract);

  const archiveRoot = resolve(
    liveTestArchiveRoot("t133_rust_hello_world_bootstrap_fixture", archiveTimestamp(), process.pid)
  );
  const workspace = path.join(archiveRoot, "workspace");
  writeBootstrapWorkspace(workspace, bootstrapMarkdown, contract);
  assertBootstrapSourceWorkspace(workspace, contract);
  writeJson(path.join(archiveRoot, "bootstrap_sandbox_snapshot.json"), {
    workspace,
    bootstrapDigest: sha256Text(bootstrapMarkdown),
    absentTargetFiles: contract.expectedFiles
  });
});

test(
  "T-133 live build installs odd_sdlc, generates one Rust tenant, and proves output",
  { skip: LIVE_ENABLED ? false : "ODD_SDLC_TS_T133_RUST_HELLO_WORLD_LIVE=1 not set" },
  async () => {
    assert.notEqual(spawnSync("cargo", ["--version"], { encoding: "utf8" }).status, null);

    const bootstrapMarkdown = readFileSync(BOOTSTRAP_PATH, "utf8");
    const contract = extractScenarioContract(bootstrapMarkdown);
    assertScenarioContract(contract);

    const archiveRoot = resolve(
      liveTestArchiveRoot("t133_rust_hello_world_bootstrap_sandbox", archiveTimestamp(), process.pid)
    );
    const workspace = path.join(archiveRoot, "workspace");
    writeBootstrapWorkspace(workspace, bootstrapMarkdown, contract);
    assertBootstrapSourceWorkspace(workspace, contract);
    writeJson(path.join(archiveRoot, "scenario_contract_snapshot.json"), {
      bootstrapPath: BOOTSTRAP_PATH,
      bootstrapDigest: sha256Text(bootstrapMarkdown),
      contract
    });

    const install = runSourceInstallCommand(workspace, archiveRoot);
    const commandPath = installedOddSdlcCommand(install);
    assert.equal(existsSync(path.join(workspace, "node_modules/.bin/odd-sdlc-ts")), true);

    const steps = [];
    let terminalState = generatedProductState(workspace, contract);
    writeJson(path.join(archiveRoot, "initial_generated_product_state.json"), terminalState);
    assert.equal(terminalState.expectedFilesPresent, false);

    const conformance = runInstalled(
      commandPath,
      ["start", "--workspace", workspace, "--until", "blocked"],
      workspace,
      archiveRoot,
      "bootstrap-conform-project-start"
    );
    const conformanceSummary = edgeSummary(conformance);
    steps.push({ step: -2, phase: "conform_project", ...conformanceSummary });
    writeJson(path.join(archiveRoot, "bootstrap_conform_project_summary.json"), conformanceSummary);
    assert.notEqual(
      conformanceSummary.blockingReason,
      "target_unavailable",
      "Fg_conform_project must be available before project authority conformance"
    );

    const bootstrap = runInstalled(
      commandPath,
      [
        "start",
        "--workspace",
        workspace,
        "--target",
        `graph_function:${FG_CONFORM_PROJECT_AUTHORITY}`,
        "--until",
        "first_traversal",
        "--worker",
        LIVE_WORKER
      ],
      workspace,
      archiveRoot,
      "bootstrap-authority-start"
    );
    const bootstrapSummary = edgeSummary(bootstrap);
    steps.push({ step: -1, phase: "bootstrap_authority", ...bootstrapSummary });
    writeJson(path.join(archiveRoot, "bootstrap_authority_summary.json"), bootstrapSummary);
    assert.notEqual(
      bootstrapSummary.blockingReason,
      "target_unavailable",
      "Fg_conform_project_authority must be a published bootstrap target"
    );
    assertConformedProjectWorkspace(workspace, contract);
    const authorityValidation = evaluateHelloWorldAuthorityConformance({
      scenarioId: contract.scenarioId,
      workspace,
      contract,
      conformanceGraphFunction: FG_CONFORM_PROJECT_AUTHORITY,
      languageAnchors: ["Rust"],
      expectedRequirementIds: contract.expectedRequirementIds
    });
    writeJson(path.join(archiveRoot, "authority_conformance_live_validation.json"), authorityValidation);
    assert.equal(authorityValidation.verdict, "passed", JSON.stringify(authorityValidation, null, 2));
    assertTextContains(
      bootstrapSummary.nextLawfulAction ?? "",
      FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
      "completed authority conformance next action"
    );
    if (CONFORMANCE_ONLY) {
      writeJson(path.join(archiveRoot, "steps.json"), steps);
      writeJson(path.join(archiveRoot, "run_summary.json"), {
        verdict: "conformance_passed",
        workspace,
        worker: LIVE_WORKER,
        completionController: "authority_conformance_only",
        installCommandTimeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
        installedCommandTimeoutMs:
          INSTALLED_COMMAND_TIMEOUT_MS > 0 ? INSTALLED_COMMAND_TIMEOUT_MS : null,
        steps,
        generatedProductState: terminalState,
        authorityValidation
      });
      return;
    }

    let step = 0;
    let terminalReason = "not_terminal";
    let autonomousNextStartAttempted = false;
    const startedAtMs = Date.now();
    while (true) {
      const gaps = runInstalled(
        commandPath,
        ["gaps", "--workspace", workspace],
        workspace,
        archiveRoot,
        `step-${String(step).padStart(2, "0")}-gaps`
      );
      const currentEdge = gaps.projection.currentEdge;
      steps.push({ step, phase: "gaps", ...edgeSummary(gaps) });
      writeJson(path.join(archiveRoot, "steps.json"), steps);
      if (currentEdge === null) {
        terminalState = generatedProductState(workspace, contract);
        if (terminalState.expectedFilesPresent) {
          terminalReason = "scenario_expected_files_present";
          break;
        }
        if (autonomousNextStartAttempted) {
          terminalReason = "odd_sdlc_reported_no_current_edge_after_autonomous_next";
          break;
        }
      }
      const startArgs =
        currentEdge === FG_CONFORM_PROJECT
          ? ["start", "--workspace", workspace, "--until", "blocked"]
          : [
            "start",
            "--workspace",
            workspace,
            "--target",
            "next",
            "--until",
            "first_traversal",
            "--worker",
            LIVE_WORKER
          ];
      const requestedEdge = currentEdge ?? "target:next";
      if (currentEdge === null) {
        autonomousNextStartAttempted = true;
      }
      const start = runInstalled(
        commandPath,
        startArgs,
        workspace,
        archiveRoot,
        `step-${String(step).padStart(2, "0")}-start-${requestedEdge.replace(/[^a-z0-9_-]/giu, "_")}`
      );
      const startSummary = edgeSummary(start);
      steps.push({ step, phase: "start", requestedEdge, ...startSummary });
      terminalState = generatedProductState(workspace, contract);
      writeJson(
        path.join(archiveRoot, `step-${String(step).padStart(2, "0")}-generated-product-state.json`),
        terminalState
      );
      writeJson(path.join(archiveRoot, "steps.json"), steps);
      if (terminalState.expectedFilesPresent) {
        terminalReason = "scenario_expected_files_present";
        break;
      }
      if (startSummary.blockingReason !== null || startSummary.status === "blocked") {
        terminalReason = "odd_sdlc_reported_blocked";
        break;
      }
      step += 1;
    }

    terminalState = generatedProductState(workspace, contract);
    const elapsedMs = Date.now() - startedAtMs;
    writeJson(path.join(archiveRoot, "terminal_generated_product_state.json"), terminalState);
    if (!terminalState.expectedFilesPresent) {
      writeJson(path.join(archiveRoot, "run_summary.json"), {
        verdict: "failed_expected_files_missing",
        terminalReason,
        elapsedMs,
        workspace,
        worker: LIVE_WORKER,
        completionController: "odd_sdlc_autonomous_consequence_chain_or_minimal_product_files",
        installCommandTimeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
        installedCommandTimeoutMs:
          INSTALLED_COMMAND_TIMEOUT_MS > 0 ? INSTALLED_COMMAND_TIMEOUT_MS : null,
        steps,
        generatedProductState: terminalState
      });
    }
    assert.equal(
      steps.some((row) => row.requestedEdge === "asset:component_code_surface"),
      false,
      "live harness must not inject the product target; evaluate_next must select it"
    );
    const productMaterializationConsequences = productMaterializationConsequenceRows(workspace);
    writeJson(
      path.join(archiveRoot, "autonomous_product_materialization_consequence_rows.json"),
      productMaterializationConsequences
    );
    assert.ok(
      productMaterializationConsequences.length > 0,
      "conformance/requirement evidence must publish a close decision whose next action selects product materialization"
    );
    const productMaterializationRequired = productMaterializationRequiredRows(workspace);
    writeJson(
      path.join(archiveRoot, "product_materialization_required_rows.json"),
      productMaterializationRequired
    );
    assert.ok(
      productMaterializationRequired.some((row) => row.required === true),
      "materialization handoff must mark productMaterialization.required true before Rust product files can close"
    );
    assert.equal(
      terminalState.expectedFilesPresent,
      true,
      `live build did not produce minimal Rust files: ${JSON.stringify(terminalState.expectedFiles, null, 2)}`
    );

    const tenantProof = executeRustTenant(workspace, archiveRoot, contract);
    const productExecutionValidation = evaluateHelloWorldProductExecution({
      scenarioId: contract.scenarioId,
      workspace,
      contract,
      terminalState,
      tenantProof
    });
    writeJson(
      path.join(archiveRoot, "product_execution_live_validation.json"),
      productExecutionValidation
    );
    assert.equal(
      productExecutionValidation.verdict,
      "passed",
      JSON.stringify(productExecutionValidation, null, 2)
    );
    writeJson(path.join(archiveRoot, "rust_hello_world_execution_proof.json"), {
      kind: "t133_rust_hello_world_execution_proof",
      expectedOutput: contract.expectedOutput,
      tenantProof
    });
    writeJson(path.join(archiveRoot, "run_summary.json"), {
      verdict: "passed",
      elapsedMs,
      workspace,
      worker: LIVE_WORKER,
      completionController: "odd_sdlc_autonomous_consequence_chain_or_minimal_product_files",
      installCommandTimeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
      installedCommandTimeoutMs: INSTALLED_COMMAND_TIMEOUT_MS > 0 ? INSTALLED_COMMAND_TIMEOUT_MS : null,
      steps,
      autonomousProductMaterializationConsequenceCount:
        productMaterializationConsequences.length,
      generatedProductState: terminalState,
      authorityValidation,
      tenantProof,
      productExecutionValidation
    });
  }
);
