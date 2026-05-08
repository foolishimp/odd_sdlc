// Validates: T-110
// Validates: ABG-3.7-typed-callout-outcome-projection

import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  installOddSdlcTypescript,
  invokeOddSdlcSpecMethodCommand
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t110-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# T-110 Fixture", "", "Exercise typed ABG callout outcome projection."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    ["# Intent", "", "Prove typed worker process outcome projection."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    ["# Product", "", "T-110 deterministic callout projection fixture."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    ["# Goals", "", "- prove non-generic callout failure projection"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    ["# Imported Sources", "", "- fixture://t110"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-fixture.md"),
    ["# Requirements", "", "REQ-T110-001: Preserve typed ABG process outcome evidence."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    ["# Project Bootstrap", "", "project_slug: t110_fixture"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t110_fixture",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "ambiguity_risk_appetite: low"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/TENANT_REGISTRY.md"),
    ["# Tenant Registry", "", "- tenant: typescript"].join("\n"),
    "utf8"
  );
  return root;
}

async function installWorkspace(workspace) {
  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot: PACKAGE_ROOT,
    abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
    installedPackageName: "odd-sdlc-t110"
  });
  assert.equal(install.kind, "installed");
}

function withEnv(overrides, callback) {
  const previous = new Map();
  for (const [key, value] of Object.entries(overrides)) {
    previous.set(key, process.env[key]);
    process.env[key] = value;
  }
  return Promise.resolve()
    .then(callback)
    .finally(() => {
      for (const [key, value] of previous.entries()) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    });
}

async function runStart(workspace, worker) {
  return invokeOddSdlcSpecMethodCommand([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:bootstrap_release_self_test",
    "--until",
    "first_traversal",
    "--worker",
    worker
  ]);
}

test("T-110 missing worker command projects typed ABG process error instead of generic worker failure", async () => {
  const workspace = makeWorkspace();
  await installWorkspace(workspace);
  const start = await withEnv(
    {
      ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "local-spawn",
      ABG_TS_AGENT_EXECUTOR_PROFILE: "local-spawn"
    },
    () => runStart(workspace, "process://odd-sdlc-t110-missing-worker-command")
  );

  assert.equal(start.status, "ok");
  assert.equal(start.payload.status, "worker_failed");
  assert.equal(start.payload.summary.blockingReason, "worker_process_error");
  assert.equal(start.payload.workerRun.executorProfile, "local-spawn");
  assert.equal(start.payload.workerRun.outcome.kind, "process_error");
  assert.equal(
    start.payload.summary.blockingReasons[0].detail.includes("outcome=process_error"),
    true
  );
  assert.notEqual(start.payload.summary.blockingReason, "worker_process_failed");
});

test("T-110 timed worker projects ABG hard timeout instead of generic worker failure", async () => {
  const workspace = makeWorkspace();
  await installWorkspace(workspace);
  const workerPath = path.join(workspace, "t110_timeout_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "setTimeout(() => {",
      "  process.stdout.write('late output after timeout');",
      "}, 30000);"
    ].join("\n"),
    "utf8"
  );

  const start = await withEnv(
    {
      ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "local-spawn",
      ABG_TS_AGENT_EXECUTOR_PROFILE: "local-spawn",
      ODD_SDLC_WORKER_TIMEOUT_MS: "1000",
      ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS: "10000",
      ODD_SDLC_WORKER_HEARTBEAT_MS: "250"
    },
    () => runStart(workspace, `process://node?script=${encodeURIComponent(workerPath)}`)
  );

  assert.equal(start.status, "ok");
  assert.equal(start.payload.status, "worker_failed");
  assert.equal(start.payload.summary.blockingReasons[0].code, "worker_hard_timeout");
  assert.equal(start.payload.workerRun.executorProfile, "local-spawn");
  assert.equal(start.payload.workerRun.outcome.kind, "hard_timeout");
  assert.equal(start.payload.workerRun.timedOut, true);
  assert.equal(
    start.payload.summary.blockingReasons[0].detail.includes("outcome=hard_timeout"),
    true
  );
  assert.notEqual(start.payload.summary.blockingReason, "worker_process_failed");
});
