// Validates: REQ-F-ODDSDLC-040
// Validates: REQ-F-ODDSDLC-041
// Validates: REQ-F-ODDSDLC-043
// Validates: T-058

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  runOddSdlcCli
} from "../../build/semantic/code/src/index.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const CLI_MAIN = resolve(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-ts-cli-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  mkdirSync(path.join(root, "build_tenants"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# CLI Fixture", "", "REQ-CLI-001: Fixture readme authority."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    ["# Intent", "", "**Project**: CLI Fixture", "", "INT-001: Govern CLI fixture."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-cli.md"),
    ["# Requirements", "", "REQ-CLI-002: Preserve public command adapter law."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: cli_fixture",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "ambiguity_risk_appetite: medium"
    ].join("\n"),
    "utf8"
  );
  return root;
}

function makeConformantWorkspace() {
  const root = makeWorkspace();
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    ["# Goals", "", "GOAL-CLI-001: Exercise public CLI adapter."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    ["# Product", "", "PRODUCT-CLI-001: CLI fixture product surface."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/00-imported-sources.md"),
    ["# Imported Sources", "", "- README.md", "- specification/INTENT.md"].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_bootstrap.md"),
    ["# Project Bootstrap", "", "Source package: CLI fixture."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "build_tenants/TENANT_REGISTRY.md"),
    ["# Tenant Registry", "", "- typescript: build_tenants/typescript"].join("\n"),
    "utf8"
  );
  return root;
}

test("T-058 CLI catalog command reads graph catalog without workspace mutation", () => {
  const result = runOddSdlcCli(["catalog"]);

  assert.equal(result.status, "ok");
  assert.equal(result.command, "catalog");
  assert.equal(result.exitCode, 0);
  assert(
    result.payload.functions.some(
      (entry) => entry.backingGraphFunction === "derive_code_surface"
    )
  );
  assert(
    result.payload.executives.some(
      (entry) => entry.backingGraphFunction === "bootstrap_release_self_test"
    )
  );
});

test("T-058 CLI query-domain command projects admitted workspace sources", () => {
  const workspace = makeConformantWorkspace();
  const result = runOddSdlcCli(["query-domain", "--workspace", workspace]);

  assert.equal(result.status, "ok");
  assert.equal(result.payload.kind, "sdlc_query_domain_projection");
  assert.equal(result.payload.workspaceRootUri, `file://${workspace}`);
  assert(
    result.payload.startTargets.some(
      (entry) => entry.name === "bootstrap_release_self_test"
    )
  );
  assert(
    result.payload.assetOwnership.some((entry) => entry.assetType === "code_surface")
  );
});

test("T-058 CLI gaps command emits read-only dossier without choosing traversal", () => {
  const workspace = makeConformantWorkspace();
  const result = runOddSdlcCli(["gaps", "--workspace", workspace]);

  assert.equal(result.status, "ok");
  assert.equal(result.payload.start.kind, "sdlc_public_start_blocked");
  assert.equal(result.payload.projection.kind, "sdlc_gap_projection");
  assert.equal(result.payload.dossier.kind, "sdlc_gap_dossier");
  assert.equal(result.payload.dossier.choosesNextTraversal, false);
});

test("T-058 CLI start command is a public-start adapter over worker attachment", () => {
  const workspace = makeConformantWorkspace();
  const blocked = runOddSdlcCli([
    "start",
    "--workspace",
    workspace,
    "--target",
    "graph_function:bootstrap_release_self_test",
    "--until",
    "blocked"
  ]);
  assert.equal(blocked.status, "ok");
  assert.equal(blocked.payload.kind, "sdlc_public_start_blocked");
  assert.equal(blocked.payload.blockingReason, "fp_worker_unattached");

  const attached = runOddSdlcCli([
    "start",
    "--workspace",
    workspace,
    "--target",
    "asset:code_surface",
    "--until",
    "blocked",
    "--worker",
    "process://codex"
  ]);
  assert.equal(attached.status, "ok");
  assert.equal(attached.payload.kind, "sdlc_public_start_projected");
  assert.equal(attached.payload.status, "dispatch_required");
  assert.equal(
    attached.payload.executionContract.targetGraphFunction,
    "bootstrap_release_self_test"
  );
});

test("T-058 package binary returns JSON and propagates command errors", () => {
  const okRun = spawnSync(process.execPath, [CLI_MAIN, "rc-report"], {
    cwd: PACKAGE_ROOT,
    encoding: "utf8"
  });
  assert.equal(okRun.status, 0);
  const okPayload = JSON.parse(okRun.stdout);
  assert.equal(okPayload.kind, "odd_sdlc_cli_result");
  assert.equal(okPayload.command, "rc-report");
  assert.equal(okPayload.status, "ok");

  const badRun = spawnSync(process.execPath, [CLI_MAIN, "unknown-command"], {
    cwd: PACKAGE_ROOT,
    encoding: "utf8"
  });
  assert.equal(badRun.status, 2);
  const badPayload = JSON.parse(badRun.stderr);
  assert.equal(badPayload.status, "error");
});

test("T-058 CLI module stays free of local iteration or direct ABG runner authority", () => {
  const source = readFileSync(
    resolve(PACKAGE_ROOT, "code/src/cli/command.ts"),
    "utf8"
  );
  assert(!source.includes("deriveAdvancementTransition("));
  assert(!source.includes("installAbiogenesis"));
  assert(!source.includes("while ("));
});
