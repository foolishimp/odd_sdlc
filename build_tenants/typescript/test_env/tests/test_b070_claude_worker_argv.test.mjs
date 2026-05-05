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
  parserForWorkerTransport,
  selectedWorkerExecutorProfile,
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

test("B-070 process://claude lowers to ABG-owned stream-json print argv", () => {
  const fx = makeFixture("CLAUDE-PROMPT-CONTENT-MARKER\nbody.\n");
  const transport = admitWorkerTransport("process://claude");
  assert.equal(transport.agentKey, "claude");
  assert.equal(parserForWorkerTransport(transport), "claude-stream-json");
  assert.equal(
    selectedWorkerExecutorProfile({
      ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal"
    }),
    "pty-terminal"
  );

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
    null,
    "Claude stdin is no longer odd_sdlc-owned transport law"
  );
  assert.ok(
    args.includes("--output-format"),
    "ABG Claude argv should include --output-format for stable stdout shape"
  );
  const outputFormatIndex = args.indexOf("--output-format");
  assert.equal(
    args[outputFormatIndex + 1],
    "stream-json",
    "ABG Claude argv must use realtime stream-json"
  );
  assert.ok(
    !args.includes("--include-partial-messages"),
    "partial-message handling is not odd_sdlc transport law"
  );
  assert.ok(
    args.includes("--verbose"),
    "ABG Claude stream-json output requires --verbose in print mode"
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
  assert.equal(
    args[args.length - 1],
    "CLAUDE-PROMPT-CONTENT-MARKER\nbody.\n",
    "prompt placement follows the ABG shared Claude callout contract"
  );
});

test("B-070 process://codex argv shape is preserved (regression guard)", () => {
  const fx = makeFixture("CODEX-PROMPT\n");
  const transport = admitWorkerTransport("process://codex");
  assert.equal(transport.agentKey, "codex");
  assert.equal(transport.model, null);

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

test("B-070 process://codex?model=... lowers to codex exec --model", () => {
  const fx = makeFixture("CODEX-SPARK-PROMPT\n");
  const transport = admitWorkerTransport(
    "process://codex?model=gpt-5.3-codex-spark"
  );
  assert.equal(transport.agentKey, "codex");
  assert.equal(transport.model, "gpt-5.3-codex-spark");

  const args = argsForWorker({
    transport,
    manifestPath: fx.manifestPath,
    manifest: fakeManifest(fx.workspaceRoot),
    promptPath: fx.promptPath,
    outputLastMessagePath: fx.outputLastMessagePath
  });

  assert.equal(args[0], "exec");
  assert.ok(args.includes("--model"));
  const modelIndex = args.indexOf("--model");
  assert.equal(args[modelIndex + 1], "gpt-5.3-codex-spark");
  assert.equal(
    args[args.length - 1],
    "CODEX-SPARK-PROMPT\n",
    "codex final positional arg remains prompt content"
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
