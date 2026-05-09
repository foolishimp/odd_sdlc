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
  FG_CONFORM_PROJECT,
  ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH,
  ODD_SDLC_RUNTIME_ROOT_RELATIVE_PATH,
  ODD_SDLC_TRANSFORM_ASSET_ROOT_RELATIVE_PATH
} from "../../build/semantic/code/src/index.js";
import { liveTestArchiveRoot } from "./archive_root.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const FIXTURE_ROOT = path.join(PACKAGE_ROOT, "test_env/fixtures/t132_hello_world_five_languages");
const BOOTSTRAP_PATH = path.join(FIXTURE_ROOT, "bootstrap.md");
const SOURCE_ODD_SDLC_CLI = path.join(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");
const LIVE_ENABLED = process.env["ODD_SDLC_TS_T132_HELLO_WORLD_SUITE_LIVE"] === "1";
const LIVE_WORKER =
  process.env["ODD_SDLC_TS_T132_HELLO_WORLD_SUITE_WORKER"] ??
  "process://codex?model=gpt-5.5&effort=medium";
const INSTALL_COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_T132_HELLO_WORLD_SUITE_INSTALL_TIMEOUT_MS"] ?? `${1000 * 60 * 20}`,
  10
);
const INSTALLED_COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_T132_HELLO_WORLD_SUITE_INSTALLED_COMMAND_TIMEOUT_MS"] ?? "0",
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

function assertIncludesEvery(actual, expected, label) {
  const actualSet = new Set(actual);
  for (const value of expected) {
    assert.equal(actualSet.has(value), true, `${label} must include ${value}`);
  }
}

function assertScenarioContract(contract) {
  assert.equal(contract.schemaVersion, "t132.hello_world_five_tenant_suite.v1");
  assert.equal(contract.scenarioId, "t132_hello_world_five_tenant_suite");
  assert.equal(contract.product.name, "hello_world_suite");
  assert.equal(contract.builderHarness.builder, "odd_sdlc");
  assert.equal(contract.builderHarness.notRuntimeDependency, true);
  assert.equal(contract.suite.expectedOutput, "Hello, world!");
  assert.equal(
    contract.sandbox.expectedRuntimeRoot,
    ODD_SDLC_RUNTIME_ROOT_RELATIVE_PATH
  );
  assert.equal(
    contract.sandbox.expectedTransformAssetRoot,
    ODD_SDLC_TRANSFORM_ASSET_ROOT_RELATIVE_PATH
  );
  assert.equal(
    contract.sandbox.expectedOperatorRunRoot,
    ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH
  );

  assert.equal(Array.isArray(contract.suite.tenants), true);
  assert.equal(contract.suite.tenants.length, 5);
  assertUnique(
    contract.suite.tenants.map((tenant) => tenant.id),
    "suite.tenants.id"
  );
  assertUnique(
    contract.suite.tenants.map((tenant) => tenant.tenantName),
    "suite.tenants.tenantName"
  );
  assertUnique(
    contract.suite.tenants.map((tenant) => tenant.selectedOutputRoot),
    "suite.tenants.selectedOutputRoot"
  );
  assertIncludesEvery(
    contract.suite.tenants.map((tenant) => tenant.id),
    ["javascript", "python", "ruby", "bash", "java"],
    "suite.tenants"
  );

  const expectedGeneratedFiles = [];
  for (const tenant of contract.suite.tenants) {
    assertNonEmptyString(tenant.displayName, `${tenant.id}.displayName`);
    assertNonEmptyString(tenant.tenantName, `${tenant.id}.tenantName`);
    assertNonEmptyString(tenant.runtime, `${tenant.id}.runtime`);
    assertNonEmptyString(tenant.selectedOutputRoot, `${tenant.id}.selectedOutputRoot`);
    assert.equal(
      tenant.selectedOutputRoot,
      `build_tenants/${tenant.tenantName}`,
      `${tenant.id}.selectedOutputRoot must be tenant rooted`
    );
    assert.equal(
      tenant.selectedOutputRoot.startsWith("build_tenants/hello_world_suite"),
      false,
      `${tenant.id}.selectedOutputRoot must not collapse into hello_world_suite`
    );
    assertNonEmptyString(tenant.sourceFile, `${tenant.id}.sourceFile`);
    assertNonEmptyString(tenant.moduleDesignFile, `${tenant.id}.moduleDesignFile`);
    assertNonEmptyString(tenant.adrFile, `${tenant.id}.adrFile`);
    for (const relativePath of [
      tenant.moduleDesignFile,
      tenant.adrFile,
      tenant.sourceFile
    ]) {
      assert.equal(
        relativePath.startsWith(`${tenant.selectedOutputRoot}/`),
        true,
        `${tenant.id} generated file must live below selectedOutputRoot`
      );
      expectedGeneratedFiles.push(relativePath);
    }
    assert.equal(
      contract.expectedFiles.includes(tenant.sourceFile),
      true,
      `${tenant.id}.sourceFile must be listed in expectedFiles`
    );
    assert.equal(
      contract.expectedFiles.includes(tenant.moduleDesignFile),
      true,
      `${tenant.id}.moduleDesignFile must be listed in expectedFiles`
    );
    assert.equal(
      contract.expectedFiles.includes(tenant.adrFile),
      true,
      `${tenant.id}.adrFile must be listed in expectedFiles`
    );
    assertNonEmptyString(tenant.run.command, `${tenant.id}.run.command`);
    assert.equal(Array.isArray(tenant.run.args), true, `${tenant.id}.run.args must be an array`);
    if (tenant.id === "java") {
      assert.equal(tenant.compiler, "javac");
      assert.equal(tenant.run.compileCommand, "javac");
      assert.equal(tenant.run.cwd, "build_tenants/hello_world_java/src");
    }
  }

  assert.equal(Array.isArray(contract.expectedFiles), true);
  assert.equal(contract.expectedFiles.length, 15);
  assertUnique(contract.expectedFiles, "expectedFiles");
  assertIncludesEvery(contract.expectedFiles, expectedGeneratedFiles, "expectedFiles");
  assert.equal(
    contract.expectedFiles.some((file) => file.startsWith("build_tenants/hello_world_suite/")),
    false,
    "expectedFiles must not use the flat hello_world_suite tenant"
  );

  const nodeIds = contract.lifecycleGraph.nodes.map((node) => node.id);
  const vectorIds = contract.lifecycleGraph.vectors.map((vector) => vector.id);
  assertUnique(nodeIds, "lifecycleGraph.nodes.id");
  assertUnique(vectorIds, "lifecycleGraph.vectors.id");
  assertIncludesEvery(
    nodeIds,
    [
      "asset:start_document",
      "asset:sandbox_workspace",
      "asset:installed_odd_sdlc",
      "asset:suite_contract",
      "asset:tenant_designs",
      "asset:implementation",
      "asset:test_execution",
      "asset:release_readiness"
    ],
    "lifecycleGraph.nodes"
  );
  for (const vector of contract.lifecycleGraph.vectors) {
    assert.equal(nodeIds.includes(vector.target), true, `${vector.id} target must be a node`);
    for (const source of vector.source) {
      assert.equal(nodeIds.includes(source), true, `${vector.id} source ${source} must be a node`);
    }
  }
  assert.equal(Array.isArray(contract.lawfulActions), true);
  assert.equal(contract.lawfulActions.length, contract.lifecycleGraph.vectors.length);
  assertUnique(
    contract.lawfulActions.map((action) => action.id),
    "lawfulActions.id"
  );
  for (const action of contract.lawfulActions) {
    assert.equal(vectorIds.includes(action.vector), true, `${action.id} vector must be declared`);
    assertNonEmptyString(action.graphFunction, `${action.id}.graphFunction`);
    assertNonEmptyString(action.expectedCarrier, `${action.id}.expectedCarrier`);
    assertNonEmptyString(action.donePredicate, `${action.id}.donePredicate`);
    assertNonEmptyString(action.retryAction, `${action.id}.retryAction`);
  }

  assertIncludesEvery(
    contract.commands.installOddSdlc,
    ["odd-sdlc-ts install --target <workspace> --package-source <odd_sdlc_source>"],
    "commands.installOddSdlc"
  );
  assert.equal(
    contract.commands.buildSuite.some((command) => command.includes("odd-sdlc-ts start")),
    true,
    "commands.buildSuite must include odd-sdlc-ts start"
  );
  assertIncludesEvery(
    contract.commands.testSuite,
    [
      "node build_tenants/hello_world_javascript/src/hello.js",
      "python3 build_tenants/hello_world_python/src/hello.py",
      "ruby build_tenants/hello_world_ruby/src/hello.rb",
      "bash build_tenants/hello_world_bash/src/hello.sh",
      "cd build_tenants/hello_world_java/src && javac HelloWorld.java && java HelloWorld"
    ],
    "commands.testSuite"
  );
}

function writeBootstrapWorkspace(workspace, bootstrapMarkdown, contract) {
  rmSync(workspace, { recursive: true, force: true });
  mkdirSync(path.join(workspace, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(workspace, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(workspace, "gtl"), { recursive: true });
  mkdirSync(path.join(workspace, "build_tenants"), { recursive: true });
  writeFileSync(path.join(workspace, "README.md"), `# ${contract.product.name}\n`, "utf8");
  writeFileSync(path.join(workspace, "bootstrap.md"), bootstrapMarkdown, "utf8");
  writeFileSync(path.join(workspace, "specification/INTENT.md"), `# Intent\n\n${contract.product.intent}\n`, "utf8");
  writeFileSync(
    path.join(workspace, "specification/PRODUCT.md"),
    `# Product\n\n${contract.product.definition}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/GOALS.md"),
    [
      "# Goals",
      "",
      "- build a generated hello-world suite in five languages",
      "- run every generated program",
      "- admit exact stdout evidence before release-readiness projection"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/requirements/00-start-document.md"),
    bootstrapMarkdown,
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "specification/requirements/01-hello-world-suite.md"),
    [
      "# Hello-World Suite Requirements",
      "",
      `REQ-T132-001: Generate ${contract.suite.tenants.length} language tenants.`,
      `REQ-T132-002: Each program must emit ${contract.suite.expectedOutput}.`,
      "REQ-T132-003: The proof must be process execution evidence.",
      "REQ-T132-004: Runtime transform assets remain under .ai-workspace/runtime/odd_sdlc/assets; product files are materialized under each tenant root."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_bootstrap.md"),
    bootstrapMarkdown,
    "utf8"
  );
  writeFileSync(
    path.join(workspace, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      `  name: ${contract.sandbox.workspaceSlug}`,
      `active_tenant: ${contract.suite.tenants[0].tenantName}`,
      `selected_output_root: ${contract.suite.tenants[0].selectedOutputRoot}`,
      "ambiguity_risk_appetite: low",
      "runtime:",
      `  root: ${ODD_SDLC_RUNTIME_ROOT_RELATIVE_PATH}`,
      `  transform_asset_root: ${ODD_SDLC_TRANSFORM_ASSET_ROOT_RELATIVE_PATH}`,
      `  operator_run_root: ${ODD_SDLC_OPERATOR_RUN_ROOT_RELATIVE_PATH}`,
      "  product_materialization_root_policy: selected_output_root",
      "build_tenants:",
      ...contract.suite.tenants.flatMap((tenant) => [
        `  ${tenant.tenantName}:`,
        `    output_dir: ${tenant.selectedOutputRoot}/`,
        `    language: ${tenant.displayName}`,
        "    build_tool: process",
        `    test_runner: ${tenant.run.compileCommand ? `${tenant.run.compileCommand}/${tenant.run.command}` : tenant.run.command}`,
        "    module_structure:",
        `      - ${tenant.tenantName}`
      ])
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspace, "build_tenants/TENANT_REGISTRY.md"),
    [
      "# Tenant Registry",
      "",
      ...contract.suite.tenants.map(
        (tenant) => `- tenant: ${tenant.tenantName} (${tenant.displayName})`
      ),
      ""
    ].join("\n"),
    "utf8"
  );
  writeJson(path.join(workspace, "gtl/graph.json"), {
    kind: "t132_hello_world_five_language_builder_graph_projection",
    sourceBootstrapDigest: sha256Text(bootstrapMarkdown),
    role: contract.lifecycleGraph.role,
    moduleName: contract.lifecycleGraph.moduleName,
    graphFunction: contract.lifecycleGraph.graphFunction,
    nodes: contract.lifecycleGraph.nodes,
    vectors: contract.lifecycleGraph.vectors,
    lawfulActions: contract.lawfulActions
  });
  writeJson(path.join(workspace, ".ai-workspace/context/hello_world_suite_contract.json"), {
    kind: "t132_hello_world_five_tenant_suite_contract",
    sourceBootstrapDigest: sha256Text(bootstrapMarkdown),
    suite: contract.suite,
    expectedFiles: contract.expectedFiles
  });
}

function assertNoPrebuiltSuiteImplementation(workspace, contract) {
  const generatedTargetsPresent = contract.expectedFiles
    .filter((relativePath) => existsSync(path.join(workspace, relativePath)))
    .sort();
  assert.deepEqual(
    generatedTargetsPresent,
    [],
    `bootstrap sandbox must not start with generated hello-world files: ${generatedTargetsPresent.join(", ")}`
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
    "odd-sdlc-t132-hello-world-suite"
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

function executeTenant(workspace, archiveRoot, contract, tenant) {
  const expected = contract.suite.expectedOutput;
  if (tenant.run.compileCommand) {
    runProcess(
      workspace,
      archiveRoot,
      `hello-world-${tenant.id}-compile`,
      tenant.run.compileCommand,
      tenant.run.compileArgs,
      { cwd: tenant.run.compileCwd }
    );
  }
  const run = runProcess(
    workspace,
    archiveRoot,
    `hello-world-${tenant.id}-run`,
    tenant.run.command,
    tenant.run.args,
    tenant.run.cwd ? { cwd: tenant.run.cwd } : {}
  );
  assert.equal(run.stdoutTrimmed, expected, `${tenant.id} stdout must match expected output`);
  return {
    tenantId: tenant.id,
    tenantName: tenant.tenantName,
    sourceFile: tenant.sourceFile,
    stdout: run.stdoutTrimmed,
    status: run.status
  };
}

function generatedSuiteState(workspace, contract) {
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

test("T-132 bootstrap document is a complete five-language hello-world contract", () => {
  const bootstrapMarkdown = readFileSync(BOOTSTRAP_PATH, "utf8");
  const contract = extractScenarioContract(bootstrapMarkdown);
  assertScenarioContract(contract);

  const archiveRoot = resolve(
    liveTestArchiveRoot("t132_hello_world_five_languages_contract", archiveTimestamp(), process.pid)
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
    liveTestArchiveRoot(
      "t132_hello_world_five_languages_bootstrap_fixture",
      archiveTimestamp(),
      process.pid
    )
  );
  const workspace = path.join(archiveRoot, "workspace");
  writeBootstrapWorkspace(workspace, bootstrapMarkdown, contract);
  assertNoPrebuiltSuiteImplementation(workspace, contract);
  writeJson(path.join(archiveRoot, "bootstrap_sandbox_snapshot.json"), {
    workspace,
    bootstrapDigest: sha256Text(bootstrapMarkdown),
    absentTargetFiles: contract.expectedFiles
  });
});

test(
  "T-132 live build installs odd_sdlc, generates five tenant outputs, and proves output",
  { skip: LIVE_ENABLED ? false : "ODD_SDLC_TS_T132_HELLO_WORLD_SUITE_LIVE=1 not set" },
  async () => {
    const bootstrapMarkdown = readFileSync(BOOTSTRAP_PATH, "utf8");
    const contract = extractScenarioContract(bootstrapMarkdown);
    assertScenarioContract(contract);

    const archiveRoot = resolve(
      liveTestArchiveRoot(
        "t132_hello_world_five_languages_bootstrap_sandbox",
        archiveTimestamp(),
        process.pid
      )
    );
    const workspace = path.join(archiveRoot, "workspace");
    writeBootstrapWorkspace(workspace, bootstrapMarkdown, contract);
    assertNoPrebuiltSuiteImplementation(workspace, contract);
    writeJson(path.join(archiveRoot, "scenario_contract_snapshot.json"), {
      bootstrapPath: BOOTSTRAP_PATH,
      bootstrapDigest: sha256Text(bootstrapMarkdown),
      contract
    });

    const install = runSourceInstallCommand(workspace, archiveRoot);
    const commandPath = installedOddSdlcCommand(install);
    assert.equal(existsSync(path.join(workspace, "node_modules/.bin/odd-sdlc-ts")), true);

    const steps = [];
    const target = "graph_function:bootstrap_release_self_test";
    let terminalState = generatedSuiteState(workspace, contract);
    writeJson(path.join(archiveRoot, "initial_generated_suite_state.json"), terminalState);
    assert.equal(terminalState.expectedFilesPresent, false);

    let step = 0;
    let terminalReason = "not_terminal";
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
        terminalReason = "odd_sdlc_reported_no_current_edge";
        break;
      }
      const startArgs =
        currentEdge === FG_CONFORM_PROJECT
          ? ["start", "--workspace", workspace, "--until", "blocked"]
          : [
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
      const start = runInstalled(
        commandPath,
        startArgs,
        workspace,
        archiveRoot,
        `step-${String(step).padStart(2, "0")}-start-${currentEdge}`
      );
      const startSummary = edgeSummary(start);
      steps.push({ step, phase: "start", requestedEdge: currentEdge, ...startSummary });
      terminalState = generatedSuiteState(workspace, contract);
      writeJson(
        path.join(archiveRoot, `step-${String(step).padStart(2, "0")}-generated-suite-state.json`),
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

    terminalState = generatedSuiteState(workspace, contract);
    writeJson(path.join(archiveRoot, "terminal_generated_suite_state.json"), terminalState);
    if (!terminalState.expectedFilesPresent) {
      writeJson(path.join(archiveRoot, "run_summary.json"), {
        verdict: "failed_expected_files_missing",
        terminalReason,
        workspace,
        worker: LIVE_WORKER,
        completionController: "odd_sdlc_current_edge_or_scenario_proof",
        installCommandTimeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
        installedCommandTimeoutMs:
          INSTALLED_COMMAND_TIMEOUT_MS > 0 ? INSTALLED_COMMAND_TIMEOUT_MS : null,
        steps,
        generatedSuiteState: terminalState
      });
    }
    assert.equal(
      terminalState.expectedFilesPresent,
      true,
      `live build did not produce all expected hello-world files: ${JSON.stringify(terminalState.expectedFiles, null, 2)}`
    );
    const tenantProofs = contract.suite.tenants.map((tenant) =>
      executeTenant(workspace, archiveRoot, contract, tenant)
    );
    writeJson(path.join(archiveRoot, "hello_world_execution_proof.json"), {
      kind: "t132_hello_world_five_tenant_execution_proof",
      expectedOutput: contract.suite.expectedOutput,
      tenantProofs
    });
    writeJson(path.join(archiveRoot, "run_summary.json"), {
      verdict: "passed",
      workspace,
      worker: LIVE_WORKER,
      completionController: "odd_sdlc_current_edge_or_scenario_proof",
      installCommandTimeoutMs: INSTALL_COMMAND_TIMEOUT_MS,
      installedCommandTimeoutMs: INSTALLED_COMMAND_TIMEOUT_MS > 0 ? INSTALLED_COMMAND_TIMEOUT_MS : null,
      steps,
      generatedSuiteState: terminalState,
      tenantProofs
    });
  }
);
