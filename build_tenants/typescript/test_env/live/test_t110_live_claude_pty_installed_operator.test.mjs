// Validates: T-110
// Validates: ABG-3.6-live-Claude-PTY-installed-operator

import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { fileURLToPath } from "node:url";
import path, { dirname, resolve } from "node:path";

import {
  installOddSdlcTypescript,
  invokeOddSdlcSpecMethodCommand
} from "../../build/semantic/code/src/index.js";
import { liveTestArchiveRoot } from "./archive_root.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const EXPECTED_ABG_VERSION = "3.6.0-rc.1";
const EXPECTED_FALLBACK_CONFIG_DIGEST =
  "sha256:08372a2a641f0dacaa30f1e06be72f3d28e3bb96e704b81cfb55473f62ee0245";
const LIVE_ENABLED = process.env["ODD_SDLC_TS_T110_LIVE"] === "1";

function archiveTimestamp() {
  return new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(".", "");
}

function writeJson(filePath, payload) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function sha256File(filePath) {
  return `sha256:${createHash("sha256").update(readFileSync(filePath)).digest("hex")}`;
}

function makeWorkspace(root) {
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    [
      "# T-110 Live Claude PTY Fixture",
      "",
      "This workspace proves the installed odd_sdlc TypeScript operator can invoke Claude through the ABG 3.6 pty-terminal callout substrate."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    [
      "# Intent",
      "",
      "Create a minimal governed intent surface for the T-110 live Claude PTY proof."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "T-110 live fixture product for installed-operator process callout proof."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    [
      "# Goals",
      "",
      "- prove ABG 3.6 pty-terminal execution through process://claude",
      "- preserve trace evidence without requiring an exact Claude prose response"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    ["# Imported Sources", "", "- fixture://t110-live-claude-pty"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-live-pty-proof.md"),
    [
      "# Live PTY Proof Requirements",
      "",
      "REQ-T110-001: The installed TypeScript operator invokes Claude through `process://claude` using the ABG `pty-terminal` executor profile.",
      "",
      "REQ-T110-002: The worker output preserves the phrase `T110-CLAUDE-PTY-LIVE-EVIDENCE` somewhere in the generated intent surface."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    ["# Project Bootstrap", "", "project_slug: t110_live_claude_pty"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t110_live_claude_pty",
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
}

function pathFromFileRef(fileRef) {
  assert.equal(typeof fileRef, "string");
  assert.equal(fileRef.startsWith("file://"), true, `expected file ref, got ${fileRef}`);
  return fileURLToPath(fileRef);
}

test(
  "T-110 live installed operator invokes process://claude through ABG pty-terminal trace substrate",
  { skip: LIVE_ENABLED ? false : "ODD_SDLC_TS_T110_LIVE=1 not set" },
  async () => {
    const archiveRoot = liveTestArchiveRoot(
      "t110_live_claude_pty_installed_operator",
      archiveTimestamp(),
      process.pid
    );
    const workspace = path.join(archiveRoot, "workspace");
    makeWorkspace(workspace);

    const install = await installOddSdlcTypescript({
      targetRoot: workspace,
      packageSourceRoot: PACKAGE_ROOT,
      abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
      installedPackageName: "odd-sdlc-t110-live"
    });
    assert.equal(install.kind, "installed");

    const installedAbgPackageJsonPath = path.join(
      workspace,
      "node_modules/@abiogenesis/typescript-tenant/package.json"
    );
    const installedFallbackConfigPath = path.join(
      workspace,
      ".abiogenesis/config/abg.fallbacks.json"
    );
    assert.equal(existsSync(installedAbgPackageJsonPath), true);
    assert.equal(existsSync(installedFallbackConfigPath), true);
    const installedAbgPackageJson = readJson(installedAbgPackageJsonPath);
    const fallbackConfigDigest = sha256File(installedFallbackConfigPath);
    assert.equal(installedAbgPackageJson.version, EXPECTED_ABG_VERSION);
    assert.equal(fallbackConfigDigest, EXPECTED_FALLBACK_CONFIG_DIGEST);
    writeJson(path.join(archiveRoot, "installed_abg_substrate_snapshot.json"), {
      packageJsonPath: installedAbgPackageJsonPath,
      version: installedAbgPackageJson.version,
      fallbackConfigPath: installedFallbackConfigPath,
      fallbackConfigDigest
    });

    const previousOddProfile = process.env["ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE"];
    const previousAbgProfile = process.env["ABG_TS_AGENT_EXECUTOR_PROFILE"];
    process.env["ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE"] = "pty-terminal";
    process.env["ABG_TS_AGENT_EXECUTOR_PROFILE"] = "pty-terminal";
    try {
      const gaps = await invokeOddSdlcSpecMethodCommand(["gaps", "--workspace", workspace]);
      writeJson(path.join(archiveRoot, "gaps_result.json"), gaps);
      assert.equal(gaps.status, "ok");

      const start = await invokeOddSdlcSpecMethodCommand([
        "start",
        "--workspace",
        workspace,
        "--target",
        "graph_function:bootstrap_release_self_test",
        "--until",
        "first_traversal",
        "--worker",
        "process://claude"
      ]);
      writeJson(path.join(archiveRoot, "start_result.json"), start);

      assert.equal(start.status, "ok");
      assert.equal(start.payload.kind, "sdlc_installed_operator_start_outcome");
      assert.equal(start.payload.status, "worker_invoked");
      assert.equal(start.payload.workerRun.executorProfile, "pty-terminal");
      assert.equal(start.payload.workerRun.streamModel, "terminal-transcript");
      assert.equal(typeof start.payload.workerRun.terminalSessionId, "string");
      assert.equal(start.payload.workerRun.terminalSessionId.length > 0, true);
      assert.equal(start.payload.workerRun.outcome.kind, "exited");
      assert.equal(start.payload.workerRun.outcome.status, 0);
      assert.equal(start.payload.workerRun.status, 0);
      assert.ok(start.payload.workerRun.traceRoot.includes(".trace"));
      assert.equal(start.payload.workerRun.terminalTranscriptRef !== undefined, true);
      assert.equal(start.payload.workerRun.traceResultRef !== undefined, true);
      assert.ok(
        start.payload.workerRun.structuredEventCount > 0,
        "Claude stream-json events should be observed through the PTY transcript"
      );

      const traceResultPath = pathFromFileRef(start.payload.workerRun.traceResultRef);
      assert.equal(existsSync(traceResultPath), true);
      const traceResult = readJson(traceResultPath);
      writeJson(path.join(archiveRoot, "trace_result_snapshot.json"), traceResult);
      assert.equal(traceResult.executorProfile, "pty-terminal");
      assert.equal(traceResult.streamModel, "terminal-transcript");
      assert.equal(traceResult.terminalSessionId, start.payload.workerRun.terminalSessionId);
      assert.equal(traceResult.outcome.kind, "exited");
      assert.equal(traceResult.outcome.status, 0);
      const startedContextPath = path.join(
        start.payload.archiveRoot,
        "worker_process_started_context.json"
      );
      assert.equal(existsSync(startedContextPath), true);
      const startedContext = readJson(startedContextPath);
      assert.equal(
        startedContext.terminalSessionId,
        start.payload.workerRun.terminalSessionId
      );
    } finally {
      if (previousOddProfile === undefined) {
        delete process.env["ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE"];
      } else {
        process.env["ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE"] = previousOddProfile;
      }
      if (previousAbgProfile === undefined) {
        delete process.env["ABG_TS_AGENT_EXECUTOR_PROFILE"];
      } else {
        process.env["ABG_TS_AGENT_EXECUTOR_PROFILE"] = previousAbgProfile;
      }
    }
  }
);
