// Validates: REQ-F-ODDSDLC-040
// Validates: REQ-F-ODDSDLC-043
// Validates: T-059

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  deriveOddSdlcTypescriptReleaseCut,
  installOddSdlcTypescript,
  oddSdlcTypescriptProductInstallRoot,
  runOddSdlcCli,
  runOddSdlcCliAsync
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);

function makeTargetWorkspace(label) {
  const targetRoot = mkdtempSync(path.join(tmpdir(), `odd-sdlc-ts-${label}-`));
  mkdirSync(path.join(targetRoot, "specification/requirements"), { recursive: true });
  writeFileSync(
    path.join(targetRoot, "README.md"),
    ["# Installed Workspace", "", "REQ-INSTALL-001: keep installed commands public."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(targetRoot, "specification/INTENT.md"),
    ["# Intent", "", "INT-INSTALL-001: exercise installed odd_sdlc.TS."].join("\n"),
    "utf8"
  );
  return targetRoot;
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function assertCommandPath(paths, commandName) {
  const commandPath = paths.find((candidate) => path.basename(candidate) === commandName);
  assert(commandPath, `missing ${commandName} command path`);
  assert.equal(existsSync(commandPath), true, `${commandName} command path does not exist`);
  return commandPath;
}

function assertPackageManagerReplayKeepsCommand(targetRoot, commandName) {
  const commandPath = path.join(targetRoot, "node_modules/.bin", commandName);
  assert.equal(existsSync(commandPath), true, `${commandName} missing before npm replay`);
  const result = spawnSync("npm", ["install", "--ignore-scripts"], {
    cwd: targetRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: path.join(targetRoot, ".npm-cache")
    },
    maxBuffer: 1024 * 1024 * 5
  });
  assert.equal(
    result.status,
    0,
    `npm install replay failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
  );
  assert.equal(existsSync(commandPath), true, `${commandName} missing after npm replay`);
}

function assertBootstrapGovernanceText(text) {
  for (const alias of [
    "STDO law",
    "STDO governance",
    "STDO Constitution",
    "STDO Method",
    "STDO-UX"
  ]) {
    assert(text.includes(alias), `missing bootstrap alias ${alias}`);
  }
  for (const methodRef of [
    "workspace://.abiogenesis/docs/standards/SPEC_METHOD.md",
    "workspace://.abiogenesis/docs/standards/TICKET_METHOD.md",
    "workspace://.abiogenesis/docs/standards/DESIGN_MODULE_METHOD.md",
    "workspace://.abiogenesis/docs/standards/ODD_METHOD.md"
  ]) {
    assert(text.includes(methodRef), `missing method reference ${methodRef}`);
  }
  assert(text.includes("Goals -> Intent -> Product -> Requirements -> Design -> Code -> Tests/Proof -> Release"));
  assert(text.includes("the symptom layer is not the re-entry authority"));
  assert(text.includes("fix the ticket execution contract before implementation"));
  assert(text.includes("Agentic Coder CLI as the user interface"));
}

function assertBootstrapGovernanceCarrier(carrier) {
  assert.equal(carrier.kind, "odd_sdlc_bootstrap_governance");
  assert.deepEqual(carrier.aliases, [
    "STDO law",
    "STDO governance",
    "STDO Constitution",
    "STDO Method",
    "STDO-UX"
  ]);
  assert.deepEqual(carrier.methodRefs, [
    "workspace://.abiogenesis/docs/standards/SPEC_METHOD.md",
    "workspace://.abiogenesis/docs/standards/TICKET_METHOD.md",
    "workspace://.abiogenesis/docs/standards/DESIGN_MODULE_METHOD.md",
    "workspace://.abiogenesis/docs/standards/ODD_METHOD.md"
  ]);
  assert.deepEqual(carrier.firstMissingLayerOrder, [
    "Goals",
    "Intent",
    "Product",
    "Requirements",
    "Design",
    "Code",
    "Tests/Proof",
    "Release"
  ]);
  assert.equal(carrier.uiAlias, "STDO-UX");
  assert.match(carrier.executionContractRule, /first missing layer/u);
}

test("T-059 API installs odd_sdlc.TS and ABG runtime into a target workspace", async () => {
  const targetRoot = makeTargetWorkspace("install-api");
  const outcome = await installOddSdlcTypescript({
    targetRoot,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t059"
  });

  assert.equal(outcome.kind, "installed");
  const expectedProductInstallRoot = oddSdlcTypescriptProductInstallRoot(targetRoot);
  assert.equal(outcome.productInstallRoot, expectedProductInstallRoot);
  assert.equal(outcome.installManifestPath, path.join(expectedProductInstallRoot, "install-manifest.json"));
  assert.equal(
    outcome.installedPackage.tarballPath.startsWith(path.join(expectedProductInstallRoot, "package-pack")),
    true
  );
  assert.equal(existsSync(path.join(expectedProductInstallRoot, "package-extract")), true);
  assert.equal(existsSync(path.join(targetRoot, ".odd_sdlc")), false);
  const oddSdlcCommand = assertCommandPath(outcome.commandPaths, "odd-sdlc-ts");
  assertCommandPath(outcome.commandPaths, "genesis-ts");
  assertCommandPath(outcome.commandPaths, "abiogenesis-ts");
  assert.equal(existsSync(outcome.installManifestPath), true);
  assert.equal(existsSync(outcome.normalizationPath), true);
  assert.equal(existsSync(outcome.bootstrapGuidePath), true);
  const packageJson = readJson(path.join(targetRoot, "package.json"));
  assert.equal(
    packageJson.dependencies["@odd-sdlc/typescript-tenant"],
    `file:${path.relative(targetRoot, outcome.installedPackage.tarballPath)}`
  );
  assert.match(
    packageJson.dependencies["@abiogenesis/typescript-tenant"],
    /^file:\.abiogenesis\/package-pack\//u
  );
  assertPackageManagerReplayKeepsCommand(targetRoot, "odd-sdlc-ts");
  for (const filename of ["AGENTS.md", "CLAUDE.md"]) {
    const instructionPath = path.join(targetRoot, filename);
    assert.equal(existsSync(instructionPath), true, `${filename} was not written`);
    const instructionText = readFileSync(instructionPath, "utf8");
    assert(instructionText.includes("<!-- ODD_SDLC_BOOTLOADER_START -->"));
    assert(instructionText.includes("<!-- ODD_SDLC_BOOTLOADER_END -->"));
    assert(instructionText.includes("odd-sdlc-ts gaps --workspace ."));
    assert(instructionText.includes("odd-sdlc-ts start --workspace . --target next --until blocked"));
    assertBootstrapGovernanceText(instructionText);
  }
  assertBootstrapGovernanceText(readFileSync(outcome.bootstrapGuidePath, "utf8"));

  const manifest = readJson(outcome.installManifestPath);
  assert.equal(manifest.kind, "odd_sdlc_typescript_install_manifest");
  assert.equal(manifest.productInstallRoot, expectedProductInstallRoot);
  assert.deepEqual(
    manifest.instructionFiles.map((entry) => [entry.filename, entry.verified]),
    [
      ["AGENTS.md", true],
      ["CLAUDE.md", true]
    ]
  );
  assert.equal(manifest.packageName, "@odd-sdlc/typescript-tenant");
  assert(manifest.runtimeIdentity.substrateRuntimeRef.includes("@abiogenesis/typescript-tenant"));
  assertBootstrapGovernanceCarrier(manifest.bootstrapGovernance);
  assertBootstrapGovernanceCarrier(readJson(outcome.normalizationPath).bootstrapGovernance);

  const run = spawnSync(oddSdlcCommand, ["gaps", "--workspace", targetRoot], {
    cwd: targetRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      ODD_SDLC_TS_OUTPUT: "json"
    },
    maxBuffer: 1024 * 1024 * 5
  });
  assert.equal(run.status, 0, run.stderr);
  const payload = JSON.parse(run.stdout);
  assert.equal(payload.kind, "odd_sdlc_cli_result");
  assert.equal(payload.command, "gaps");
  assert.equal(payload.status, "ok");
  assert.equal(payload.payload.dossier.choosesNextTraversal, false);
});

test("T-059 CLI install command uses the async bounded adapter", async () => {
  const targetRoot = makeTargetWorkspace("install-cli");
  writeFileSync(path.join(targetRoot, "AGENTS.md"), "# Existing Agents\n\nKeep this guidance.\n", "utf8");
  writeFileSync(path.join(targetRoot, "CLAUDE.md"), "# Existing Claude\n\nKeep this guidance.\n", "utf8");
  const result = await runOddSdlcCliAsync([
    "install",
    "--target",
    targetRoot,
    "--package-source",
    PACKAGE_ROOT,
    "--abg-package-source",
    ABG_TYPESCRIPT_ROOT,
    "--installed-package-name",
    "odd-sdlc-t059-cli"
  ]);

  assert.equal(result.status, "ok");
  assert.equal(result.command, "install");
  assert.equal(result.payload.kind, "installed");
  assert.equal(result.payload.productInstallRoot, oddSdlcTypescriptProductInstallRoot(targetRoot));
  assert.equal(existsSync(path.join(targetRoot, ".odd_sdlc")), false);
  assert.deepEqual(
    result.payload.instructionFiles.map((entry) => [entry.filename, entry.action, entry.verified]),
    [
      ["AGENTS.md", "prepended", true],
      ["CLAUDE.md", "prepended", true]
    ]
  );
  assert(readFileSync(path.join(targetRoot, "AGENTS.md"), "utf8").includes("Keep this guidance."));
  assert(readFileSync(path.join(targetRoot, "CLAUDE.md"), "utf8").includes("Keep this guidance."));
  assertCommandPath(result.payload.commandPaths, "odd-sdlc-ts");
  const packageJson = readJson(path.join(targetRoot, "package.json"));
  assert.match(
    packageJson.dependencies["@odd-sdlc/typescript-tenant"],
    /^file:\.abiogenesis\/odd_sdlc\/typescript\/package-pack\//u
  );
  assert.match(
    packageJson.dependencies["@abiogenesis/typescript-tenant"],
    /^file:\.abiogenesis\/package-pack\//u
  );

  const syncResult = runOddSdlcCli(["install", "--target", targetRoot]);
  assert.equal(syncResult.status, "error");
  assert.match(syncResult.payload.error, /runOddSdlcCliAsync/u);
});

test("T-059 release-cut adapter writes package artifact and binary evidence", async () => {
  const archiveRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-ts-release-"));
  const outcome = await deriveOddSdlcTypescriptReleaseCut({
    packageSourceRoot: PACKAGE_ROOT,
    archiveRoot
  });

  assert.equal(outcome.kind, "odd_sdlc_typescript_release_cut");
  assert.equal(existsSync(outcome.packedPackage.tarballPath), true);
  assert.equal(existsSync(outcome.releaseManifestPath), true);
  assert.equal(existsSync(outcome.postmortemPath), true);
  assert.equal(outcome.manifest.binaryBinding.commandName, "odd-sdlc-ts");
  assert.equal(
    outcome.manifest.binaryBinding.relativePackageCommandPath,
    "./build/semantic/code/src/cli/main.js"
  );

  const cliResult = await runOddSdlcCliAsync([
    "release-cut",
    "--archive-root",
    path.join(archiveRoot, "cli"),
    "--package-source",
    PACKAGE_ROOT
  ]);
  assert.equal(cliResult.status, "ok");
  assert.equal(cliResult.payload.kind, "odd_sdlc_typescript_release_cut");
});

test("T-059 install and release adapters do not own traversal selection", () => {
  const installSource = readFileSync(
    resolve(PACKAGE_ROOT, "code/src/install/installer.ts"),
    "utf8"
  );
  const releaseSource = readFileSync(
    resolve(PACKAGE_ROOT, "code/src/release/release_cut.ts"),
    "utf8"
  );
  assert(!installSource.includes("publicStartOnce"));
  assert(!installSource.includes("deriveAdvancementTransition"));
  assert(!releaseSource.includes("publicStartOnce"));
  assert(!releaseSource.includes("deriveAdvancementTransition"));
});
