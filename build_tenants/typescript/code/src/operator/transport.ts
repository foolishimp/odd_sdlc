// Implements: REQ-F-ODDSDLC-052
// Implements: REQ-F-ODDSDLC-053

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { performance } from "node:perf_hooks";
import type {
  SdlcWorkerHandoffManifest,
  SdlcWorkerRunResult,
  SdlcWorkerTransportContract
} from "./carriers.js";
import { stableOperatorJson } from "./handoff.js";

function transportAgentKey(command: string): string {
  const name = basename(command).toLowerCase();
  if (name.includes("codex")) {
    return "codex";
  }
  if (name.includes("claude")) {
    return "claude";
  }
  if (name.includes("gemini")) {
    return "gemini";
  }
  if (name.includes("node")) {
    return "node";
  }
  return "generic";
}

export function admitWorkerTransport(
  rawTransport: string
): SdlcWorkerTransportContract {
  const parsed = new URL(rawTransport);
  if (parsed.protocol !== "process:") {
    throw new TypeError("SdlcWorkerTransportContract.scheme: expected process://");
  }
  const command =
    parsed.hostname.length > 0
      ? parsed.hostname
      : decodeURIComponent(parsed.pathname);
  if (command.length === 0 || command === "/") {
    throw new TypeError("SdlcWorkerTransportContract.command: expected command");
  }
  const script = parsed.searchParams.get("script");
  const args: readonly string[] =
    script === null || script.trim().length === 0
      ? Object.freeze([])
      : Object.freeze([script]);
  const agentKey = transportAgentKey(command);
  return Object.freeze({
    kind: "sdlc_worker_transport_contract",
    raw: rawTransport,
    scheme: "process",
    agentKey,
    command,
    args,
    workerId: `worker://odd-sdlc/${agentKey}`,
    backendId: `backend://process/${agentKey}`
  });
}

function codexArgs(input: {
  readonly workspaceRoot: string;
  readonly promptPath: string;
  readonly outputLastMessagePath: string;
}): readonly string[] {
  return Object.freeze([
    "exec",
    "--skip-git-repo-check",
    "--ephemeral",
    "--sandbox",
    "workspace-write",
    "--cd",
    input.workspaceRoot,
    "--output-last-message",
    input.outputLastMessagePath,
    readFileSync(input.promptPath, "utf8")
  ]);
}

function argsForWorker(input: {
  readonly transport: SdlcWorkerTransportContract;
  readonly manifestPath: string;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly promptPath: string;
  readonly outputLastMessagePath: string;
}): readonly string[] {
  if (input.transport.agentKey === "codex" && input.transport.args.length === 0) {
    return codexArgs({
      workspaceRoot: input.manifest.workspaceRoot,
      promptPath: input.promptPath,
      outputLastMessagePath: input.outputLastMessagePath
    });
  }
  return Object.freeze([...input.transport.args, input.manifestPath]);
}

export function invokeWorkerTransport(input: {
  readonly transport: SdlcWorkerTransportContract;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly manifestPath: string;
  readonly promptPath: string;
  readonly timeoutMs?: number;
}): SdlcWorkerRunResult {
  mkdirSync(input.manifest.archiveRoot, { recursive: true });
  const stdoutPath = join(input.manifest.archiveRoot, "worker_stdout.log");
  const stderrPath = join(input.manifest.archiveRoot, "worker_stderr.log");
  const outputLastMessagePath =
    input.transport.agentKey === "codex"
      ? join(input.manifest.archiveRoot, "worker_last_message.txt")
      : null;
  const args = argsForWorker({
    transport: input.transport,
    manifestPath: input.manifestPath,
    manifest: input.manifest,
    promptPath: input.promptPath,
    outputLastMessagePath: outputLastMessagePath ?? ""
  });
  const startedAt = performance.now();
  const run = spawnSync(input.transport.command, args, {
    cwd: input.manifest.workspaceRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      ODD_SDLC_OPERATOR_MANIFEST: input.manifestPath,
      ODD_SDLC_OPERATOR_REPORT: input.manifest.reportFile,
      ODD_SDLC_OPERATOR_OUTPUT: input.manifest.outputFile,
      ODD_SDLC_OPERATOR_MATERIALIZATION_ROOT:
        input.manifest.productMaterialization.tenantRoot,
      ODD_SDLC_OPERATOR_MATERIALIZATION_MANIFEST:
        input.manifest.productMaterialization.manifestFile
    },
    maxBuffer: 1024 * 1024 * 20,
    timeout: input.timeoutMs ?? 1000 * 60 * 10
  });
  const elapsedMs = performance.now() - startedAt;
  writeFileSync(stdoutPath, run.stdout, "utf8");
  writeFileSync(stderrPath, run.stderr, "utf8");
  const result: SdlcWorkerRunResult = Object.freeze({
    kind: "sdlc_worker_run_result",
    command: input.transport.command,
    args,
    cwd: input.manifest.workspaceRoot,
    status: run.status,
    signal: run.signal,
    elapsedMs,
    stdoutPath,
    stderrPath,
    outputLastMessagePath,
    error: run.error?.message ?? null
  });
  writeFileSync(
    join(input.manifest.archiveRoot, "worker_run.json"),
    stableOperatorJson(result),
    "utf8"
  );
  return result;
}
