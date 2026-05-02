// Validates: REQ-F-ODDSDLC-052
// Validates: REQ-F-ODDSDLC-053
// Investigates: B-070

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  admitWorkerTransport,
  argsForWorker,
  stdinForWorker
} from "../../build/semantic/code/src/index.js";

function makeFixture(promptText) {
  const dir = mkdtempSync(join(tmpdir(), "b070-"));
  const promptPath = join(dir, "worker_prompt.md");
  writeFileSync(promptPath, promptText, "utf8");
  return {
    dir,
    promptPath,
    manifestPath: join(dir, "handoff_manifest.json"),
    outputLastMessagePath: join(dir, "worker_last_message.txt"),
    workspaceRoot: dir
  };
}

function fakeManifest(workspaceRoot) {
  return Object.freeze({ workspaceRoot });
}

test("B-070 process://claude uses headless print argv and delivers prompt on stdin", () => {
  const fx = makeFixture("CLAUDE-PROMPT-CONTENT-MARKER\nbody.\n");
  const transport = admitWorkerTransport("process://claude");
  assert.equal(transport.agentKey, "claude");

  const args = argsForWorker({
    transport,
    manifestPath: fx.manifestPath,
    manifest: fakeManifest(fx.workspaceRoot),
    promptPath: fx.promptPath,
    outputLastMessagePath: fx.outputLastMessagePath
  });

  assert.equal(args[0], "-p", "first arg should be the headless print flag");
  assert.equal(
    stdinForWorker({
      transport,
      promptPath: fx.promptPath
    }),
    "CLAUDE-PROMPT-CONTENT-MARKER\nbody.\n",
    "prompt content should be delivered through stdin to avoid argv size limits"
  );
  assert.ok(
    args.includes("--add-dir"),
    "argv should include --add-dir for workspace read access"
  );
  const addDirIndex = args.indexOf("--add-dir");
  assert.equal(args[addDirIndex + 1], fx.workspaceRoot);
  assert.ok(
    args.includes("--output-format"),
    "argv should include --output-format for stable stdout shape"
  );
  assert.ok(
    args.includes("--permission-mode"),
    "argv must declare permission mode so the worker can use Write/Read tools without interactive approval"
  );
  const pmIndex = args.indexOf("--permission-mode");
  assert.equal(args[pmIndex + 1], "bypassPermissions");

  assert.ok(
    !args.includes(fx.manifestPath),
    "argv must not be the bare manifest path fallthrough"
  );
  assert.ok(
    !args.includes("CLAUDE-PROMPT-CONTENT-MARKER\nbody.\n"),
    "argv must not carry prompt content because live retry prompts can exceed OS argv limits"
  );
});

test("B-070 process://codex argv shape is preserved (regression guard)", () => {
  const fx = makeFixture("CODEX-PROMPT\n");
  const transport = admitWorkerTransport("process://codex");
  assert.equal(transport.agentKey, "codex");

  const args = argsForWorker({
    transport,
    manifestPath: fx.manifestPath,
    manifest: fakeManifest(fx.workspaceRoot),
    promptPath: fx.promptPath,
    outputLastMessagePath: fx.outputLastMessagePath
  });

  assert.equal(args[0], "exec");
  assert.ok(args.includes("--skip-git-repo-check"));
  assert.ok(args.includes("--ephemeral"));
  assert.ok(args.includes("--cd"));
  const cdIndex = args.indexOf("--cd");
  assert.equal(args[cdIndex + 1], fx.workspaceRoot);
  assert.ok(args.includes("--output-last-message"));
  const olmIndex = args.indexOf("--output-last-message");
  assert.equal(args[olmIndex + 1], fx.outputLastMessagePath);
  assert.equal(
    args[args.length - 1],
    "CODEX-PROMPT\n",
    "codex final positional arg is prompt content"
  );
});

test("B-070 process://node?script=... falls through to manifest-path argv (regression guard)", () => {
  const fx = makeFixture("ignored prompt for node lane\n");
  const transport = admitWorkerTransport(
    `process://node?script=${encodeURIComponent("/tmp/worker.mjs")}`
  );
  assert.equal(transport.agentKey, "node");
  assert.deepEqual(transport.args, ["/tmp/worker.mjs"]);

  const args = argsForWorker({
    transport,
    manifestPath: fx.manifestPath,
    manifest: fakeManifest(fx.workspaceRoot),
    promptPath: fx.promptPath,
    outputLastMessagePath: fx.outputLastMessagePath
  });

  assert.deepEqual(args, ["/tmp/worker.mjs", fx.manifestPath]);
  assert.equal(
    stdinForWorker({
      transport,
      promptPath: fx.promptPath
    }),
    null
  );
});

test("B-070 process://claude with explicit ?script= override skips claudeArgs and uses fallthrough", () => {
  const fx = makeFixture("ignored\n");
  const transport = admitWorkerTransport(
    `process://claude?script=${encodeURIComponent("/tmp/wrap.mjs")}`
  );
  assert.equal(transport.agentKey, "claude");
  assert.deepEqual(transport.args, ["/tmp/wrap.mjs"]);

  const args = argsForWorker({
    transport,
    manifestPath: fx.manifestPath,
    manifest: fakeManifest(fx.workspaceRoot),
    promptPath: fx.promptPath,
    outputLastMessagePath: fx.outputLastMessagePath
  });

  assert.deepEqual(args, ["/tmp/wrap.mjs", fx.manifestPath]);
});
