// Validates: T-132

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
  FG_CONFORM_PROJECT_AUTHORITY,
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
const FIXTURE_ROOT = path.join(PACKAGE_ROOT, "test_env/fixtures/t132_hello_world_single_tenant");
const BOOTSTRAP_PATH = path.join(FIXTURE_ROOT, "bootstrap.md");
const SOURCE_ODD_SDLC_CLI = path.join(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");
const LIVE_ENABLED = process.env["ODD_SDLC_TS_T132_HELLO_WORLD_SINGLE_TENANT_LIVE"] === "1";
const CONFORMANCE_ONLY = process.env["ODD_SDLC_TS_LIVE_CONFORMANCE_ONLY"] === "1";
const LIVE_WORKER =
  process.env["ODD_SDLC_TS_T132_HELLO_WORLD_SINGLE_TENANT_WORKER"] ??
  "process://codex?model=gpt-5.5&effort=medium";
const INSTALL_COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_T132_HELLO_WORLD_SINGLE_TENANT_INSTALL_TIMEOUT_MS"] ??
    `${1000 * 60 * 20}`,
  10
);
const INSTALLED_COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_T132_HELLO_WORLD_SINGLE_TENANT_INSTALLED_COMMAND_TIMEOUT_MS"] ?? "0",
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

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    assert.equal(seen.has(value), false, `${label} contains duplicate value ${value}`);
    seen.add(value);
  }
}

function assertNonEmptyString(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.notEqual(value.trim(), "", `${label} must be non-empty`);
}

function assertScenarioContract(contract) {
  assert.equal(contract.schemaVersion, "t132.hello_world_single_tenant.v1");
  assert.equal(contract.scenarioId, "t132_hello_world_single_tenant");
  assert.equal(contract.product.name, "hello_world_javascript_single_tenant");
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
  assert.equal(tenant.id, "javascript");
  assert.equal(tenant.tenantName, "hello_world_javascript");
  assert.equal(tenant.runtime, "node");
  assert.equal(tenant.selectedOutputRoot, "build_tenants/hello_world_javascript");
  assert.equal(tenant.sourceFile, "build_tenants/hello_world_javascript/src/hello.js");
  assert.equal(tenant.run.command, "node");
  assert.deepEqual(tenant.run.args, [tenant.sourceFile]);

  assert.equal(Array.isArray(contract.expectedFiles), true);
  assert.deepEqual(contract.expectedFiles, [tenant.sourceFile]);
  assertUnique(contract.expectedFiles, "expectedFiles");
  assert.deepEqual(contract.expectedRequirementIds, [
    "REQ-T132-001",
    "REQ-T132-002",
    "REQ-T132-003",
    "REQ-T132-004",
    "REQ-T132-005"
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
  assert.deepEqual(contract.commands.testProduct, [
    "node build_tenants/hello_world_javascript/src/hello.js"
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
    "    language: JavaScript",
    "    build_tool: node",
    "    test_runner: node",
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
    kind: "t132_hello_world_single_tenant_graph_projection",
    sourceBootstrapDigest: sha256Text(bootstrapMarkdown),
    role: contract.lifecycleGraph.role,
    moduleName: contract.lifecycleGraph.moduleName,
    graphFunction: contract.lifecycleGraph.graphFunction,
    nodes: contract.lifecycleGraph.nodes,
    vectors: contract.lifecycleGraph.vectors,
    lawfulActions: contract.lawfulActions
  });
  writeJson(path.join(workspace, ".ai-workspace/context/hello_world_single_tenant_contract.json"), {
    kind: "t132_hello_world_single_tenant_contract",
    sourceBootstrapDigest: sha256Text(bootstrapMarkdown),
    tenant: contract.tenant,
    expectedOutput: contract.expectedOutput,
    expectedFiles: contract.expectedFiles
  });
}

function assertNoPrebuiltImplementation(workspace, contract) {
  const generatedTargetsPresent = contract.expectedFiles
    .filter((relativePath) => existsSync(path.join(workspace, relativePath)))
    .sort();
  assert.deepEqual(
    generatedTargetsPresent,
    [],
    `bootstrap sandbox must not start with generated hello-world files: ${generatedTargetsPresent.join(", ")}`
  );
}

function assertBootstrapSourceWorkspace(workspace, contract) {
  assert.equal(existsSync(path.join(workspace, "bootstrap.md")), true);
  assert.equal(
    existsSync(path.join(workspace, ".ai-workspace/context/project_constraints.yml")),
    true
  );
  for (const relativePath of [
    ".ai-workspace/context/project_bootstrap.md",
    "specification/INTENT.md",
    "specification/PRODUCT.md",
    "specification/GOALS.md"
  ]) {
    assert.equal(
      existsSync(path.join(workspace, relativePath)),
      false,
      `sandbox must not pre-materialize ${relativePath}`
    );
  }
  const requirementFiles = readdirSync(path.join(workspace, "specification/requirements"))
    .filter((entry) => entry.endsWith(".md"));
  assert.deepEqual(requirementFiles, []);
  assertNoPrebuiltImplementation(workspace, contract);
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
  const requirementText = requirementFiles
    .map((file) => readFileSync(path.join(requirementDir, file), "utf8"))
    .join("\n");
  for (const requirementId of contract.expectedRequirementIds) {
    assert.match(requirementText, new RegExp(`\\b${requirementId}\\b`, "u"));
  }
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
    "odd-sdlc-t132-hello-world-single-tenant"
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

function executeTenant(workspace, archiveRoot, contract) {
  const run = runProcess(
    workspace,
    archiveRoot,
    "hello-world-javascript-run",
    contract.tenant.run.command,
    contract.tenant.run.args
  );
  assert.equal(run.stdoutTrimmed, contract.expectedOutput);
  return {
    tenantId: contract.tenant.id,
    tenantName: contract.tenant.tenantName,
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
    postflight: payload.postflight?.status ?? null,
    assurance: payload.assuranceSatisfaction?.status ?? null,
    blockingReason: payload.summary?.blockingReason ?? payload.blockingReason ?? null,
    archiveRoot: payload.archiveRoot ?? payload.summary?.archiveRoot ?? null
  };
}

function progressSignature(state) {
  return JSON.stringify({
    expectedFiles: state.expectedFiles,
    runtimeFileCount: state.runtimeFileCount,
    runtimeAssetFileCount: state.runtimeAssetFileCount,
    operatorRunFileCount: state.operatorRunFileCount
  });
}

test("T-132 bootstrap document is a complete one-tenant hello-world contract", () => {
  const bootstrapMarkdown = readFileSync(BOOTSTRAP_PATH, "utf8");
  const contract = extractScenarioContract(bootstrapMarkdown);
  assertScenarioContract(contract);

  const archiveRoot = resolve(
    liveTestArchiveRoot("t132_hello_world_single_tenant_contract", archiveTimestamp(), process.pid)
  );
  writeJson(path.join(archiveRoot, "scenario_contract_snapshot.json"), {
    bootstrapPath: BOOTSTRAP_PATH,
    bootstrapDigest: sha256Text(bootstrapMarkdown),
    contract
  });
});

test("T-132 bootstrap-only sandbox has no prebuilt hello-world implementation", () => {
  const bootstrapMarkdown = readFileSync(BOOTSTRAP_PATH, "utf8");
  const contract = extractScenarioContract(bootstrapMarkdown);
  assertScenarioContract(contract);

  const archiveRoot = resolve(
    liveTestArchiveRoot("t132_hello_world_single_tenant_bootstrap_fixture", archiveTimestamp(), process.pid)
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
  "T-132 live build installs odd_sdlc, generates one tenant output, and proves output",
  { skip: LIVE_ENABLED ? false : "ODD_SDLC_TS_T132_HELLO_WORLD_SINGLE_TENANT_LIVE=1 not set" },
  async () => {
    assert.notEqual(spawnSync("node", ["--version"], { encoding: "utf8" }).status, null);

    const bootstrapMarkdown = readFileSync(BOOTSTRAP_PATH, "utf8");
    const contract = extractScenarioContract(bootstrapMarkdown);
    assertScenarioContract(contract);

    const archiveRoot = resolve(
      liveTestArchiveRoot("t132_hello_world_single_tenant_bootstrap_sandbox", archiveTimestamp(), process.pid)
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
    const target = "asset:component_code_surface";
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
      languageAnchors: ["JavaScript"],
      expectedRequirementIds: contract.expectedRequirementIds
    });
    writeJson(path.join(archiveRoot, "authority_conformance_live_validation.json"), authorityValidation);
    assert.equal(authorityValidation.verdict, "passed", JSON.stringify(authorityValidation, null, 2));
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
        authorityValidation
      });
      return;
    }

    let step = 0;
    let terminalReason = "not_terminal";
    let declaredProductTargetStarted = false;
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
      terminalState = generatedProductState(workspace, contract);
      if (terminalState.expectedFilesPresent) {
        terminalReason = "scenario_expected_files_present";
        break;
      }
      if (declaredProductTargetStarted) {
        terminalReason =
          currentEdge === null
            ? "odd_sdlc_reported_no_current_edge_after_declared_product_target"
            : "declared_product_target_did_not_materialize_expected_file";
        break;
      }
      const startArgs = [
        "start",
        "--workspace",
        workspace,
        "--target",
        target,
        "--until",
        "first_traversal",
        "--worker",
        LIVE_WORKER
      ];
      const requestedEdge = target;
      declaredProductTargetStarted = true;
      const start = runInstalled(
        commandPath,
        startArgs,
        workspace,
        archiveRoot,
        `step-${String(step).padStart(2, "0")}-start-${requestedEdge.replace(/[^a-z0-9_-]/giu, "_")}`
      );
      const startSummary = edgeSummary(start);
      steps.push({ step, phase: "start", requestedEdge, observedCurrentEdge: currentEdge, ...startSummary });
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
        completionController: "odd_sdlc_current_edge_or_single_tenant_product_file",
        installCommandTimeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
        installedCommandTimeoutMs:
          INSTALLED_COMMAND_TIMEOUT_MS > 0 ? INSTALLED_COMMAND_TIMEOUT_MS : null,
        steps,
        generatedProductState: terminalState
      });
    }
    assert.equal(
      terminalState.expectedFilesPresent,
      true,
      `live build did not produce the expected hello-world file: ${JSON.stringify(terminalState.expectedFiles, null, 2)}`
    );

    const tenantProof = executeTenant(workspace, archiveRoot, contract);
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
    writeJson(path.join(archiveRoot, "hello_world_execution_proof.json"), {
      kind: "t132_hello_world_single_tenant_execution_proof",
      expectedOutput: contract.expectedOutput,
      tenantProof
    });
    writeJson(path.join(archiveRoot, "run_summary.json"), {
      verdict: "passed",
      elapsedMs,
      workspace,
      worker: LIVE_WORKER,
      completionController: "odd_sdlc_current_edge_or_single_tenant_product_file",
      installCommandTimeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
      installedCommandTimeoutMs: INSTALLED_COMMAND_TIMEOUT_MS > 0 ? INSTALLED_COMMAND_TIMEOUT_MS : null,
      steps,
      generatedProductState: terminalState,
      authorityValidation,
      tenantProof,
      productExecutionValidation
    });
  }
);
