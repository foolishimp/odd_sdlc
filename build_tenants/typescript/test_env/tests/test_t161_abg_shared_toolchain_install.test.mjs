// Validates: T-161
// Validates: REQ-F-ODDSDLC-040

import test from "node:test";
import assert from "node:assert/strict";
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { installOddSdlcTypescript } from "../../build/semantic/code/src/index.js";
import { canonicalDataMapperFixtureRoot } from "../fixtures/data_mapper_fixture.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function parsePayload(run) {
  assert.notEqual(run.stdout.trim(), "", run.stderr);
  return JSON.parse(run.stdout);
}

test("T-161 odd_sdlc install consumes ABG shared toolchain binding and separated state roots", async () => {
  const parentRoot = await mkdtemp(path.join(tmpdir(), "odd-sdlc-t161-"));
  const workspaceRoot = path.join(parentRoot, "data_mapper.test161.ts");
  await cp(canonicalDataMapperFixtureRoot(), workspaceRoot, { recursive: true });
  const toolchainRoot = path.join(parentRoot, "abg-toolchain");
  const observerStateRoot = path.join(parentRoot, "observer", ".ai-workspace");
  const executorStateRoot = path.join(parentRoot, "executor", ".ai-workspace");
  const eventRoot = path.join(observerStateRoot, "events");
  const eventLogPath = path.join(eventRoot, "events.jsonl");
  const runtimeRoot = path.join(observerStateRoot, "runtime");
  const projectionRoot = path.join(observerStateRoot, "projections");
  const archiveRoot = path.join(observerStateRoot, "archives");
  await mkdir(parentRoot, { recursive: true });

  const install = await installOddSdlcTypescript({
    targetRoot: workspaceRoot,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    abgToolchainRoot: toolchainRoot,
    abgMutableStateRoots: {
      observedWorkspaceRoot: workspaceRoot,
      observerStateRoot,
      executorStateRoot,
      eventRoot,
      eventLogPath,
      runtimeRoot,
      projectionRoot,
      archiveRoot
    },
    installedPackageName: "odd-sdlc-t161"
  });
  assert.equal(install.kind, "installed");
  assert.equal(install.abgOutcome.kind, "installed");
  assert.equal(install.abgOutcome.packageRoot.startsWith(toolchainRoot), true);
  assert.equal(
    await pathExists(
      path.join(workspaceRoot, "node_modules", "@abiogenesis", "typescript-tenant")
    ),
    false
  );

  const manifest = await readJson(install.installManifestPath);
  assert.equal(manifest.abgToolchainRoot, toolchainRoot);
  assert.equal(manifest.abgMutableStateRoots.eventLogPath, eventLogPath);
  assert.equal(
    manifest.abgToolchainBindingPath,
    path.join(workspaceRoot, ".abiogenesis", "toolchain-binding.json")
  );

  const binding = await readJson(manifest.abgToolchainBindingPath);
  assert.equal(binding.toolchainRoot, toolchainRoot);
  assert.equal(binding.mutableStateRoots.eventLogPath, eventLogPath);
  assert.equal(binding.mutableStateRoots.executorStateRoot, executorStateRoot);

  const genesisCommand = install.abgOutcome.commandPaths.find((candidate) =>
    candidate.endsWith(`${path.sep}genesis-ts`)
  );
  assert.notEqual(genesisCommand, undefined);
  assert.equal(genesisCommand.startsWith(toolchainRoot), true);

  const gapsRun = spawnSync(
    genesisCommand,
    ["gaps", "--workspace", workspaceRoot, "--scope", "workspace"],
    {
      cwd: workspaceRoot,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 256
    }
  );
  assert.equal(gapsRun.status, 0, gapsRun.stderr);
  assert.match(gapsRun.stdout, /"command":"gaps"/u);
  assert.match(gapsRun.stdout, /"status":"(?:open|blocked|complete)"/u);
  assert.equal(await pathExists(eventLogPath), true);
});
