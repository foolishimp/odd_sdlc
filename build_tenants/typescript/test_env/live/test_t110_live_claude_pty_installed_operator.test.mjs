// Validates: T-110
// Validates: ABG-3.5-live-Claude-PTY-installed-operator

import test from "node:test";
import assert from "node:assert/strict";
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
  runOddSdlcCliAsync
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const LIVE_ENABLED = process.env["ODD_SDLC_TS_T110_LIVE"] === "1";

function archiveTimestamp() {
  return new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(".", "");
}

function writeJson(filePath, payload) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
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
      "This workspace proves the installed odd_sdlc TypeScript operator can invoke Claude through the ABG 3.5 pty-terminal callout substrate."
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
      "- prove ABG 3.5 pty-terminal execution through process://claude",
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
    const archiveRoot = path.join(
      PACKAGE_ROOT,
      "test_env/test_runs/t110_live_claude_pty_installed_operator",
      `${archiveTimestamp()}_pid${process.pid}`
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

    const previousOddProfile = process.env["ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE"];
    const previousAbgProfile = process.env["ABG_TS_AGENT_EXECUTOR_PROFILE"];
    process.env["ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE"] = "pty-terminal";
    process.env["ABG_TS_AGENT_EXECUTOR_PROFILE"] = "pty-terminal";
    try {
      const gaps = await runOddSdlcCliAsync(["gaps", "--workspace", workspace]);
      writeJson(path.join(archiveRoot, "gaps_result.json"), gaps);
      assert.equal(gaps.status, "ok");

      const start = await runOddSdlcCliAsync([
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
      const traceResult = JSON.parse(readFileSync(traceResultPath, "utf8"));
      writeJson(path.join(archiveRoot, "trace_result_snapshot.json"), traceResult);
      assert.equal(traceResult.executorProfile, "pty-terminal");
      assert.equal(traceResult.streamModel, "terminal-transcript");
      assert.equal(traceResult.outcome.kind, "exited");
      assert.equal(traceResult.outcome.status, 0);
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
