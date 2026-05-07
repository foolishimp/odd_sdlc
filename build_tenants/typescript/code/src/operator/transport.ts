// Implements: REQ-F-ODDSDLC-052
// Implements: REQ-F-ODDSDLC-053

import { readFileSync } from "node:fs";
import { basename } from "node:path";
import {
  claudeStreamJsonArgs,
  type TracedProcessExecutorProfile,
  type TracedProcessParser
} from "@abiogenesis/typescript-tenant";
import type {
  SdlcWorkerHandoffManifest,
  SdlcWorkerTransportContract
} from "./carriers.js";

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

function parseEffort(
  rawEffort: string | null
): "low" | "medium" | "high" | "xhigh" | "max" | null {
  if (rawEffort === null || rawEffort.trim().length === 0) {
    return null;
  }
  const effort = rawEffort.trim();
  if (
    effort === "low" ||
    effort === "medium" ||
    effort === "high" ||
    effort === "xhigh" ||
    effort === "max"
  ) {
    return effort;
  }
  throw new TypeError(
    "SdlcWorkerTransportContract.effort: expected low, medium, high, xhigh, or max"
  );
}

function normalizedWorkerTransportUrl(rawTransport: string): string {
  const trimmed = rawTransport.trim();
  const alias = /^(claude|codex|gemini|node)(\?.*)?$/u.exec(trimmed);
  if (alias !== null) {
    return `process://${alias[1]}${alias[2] ?? ""}`;
  }
  return trimmed;
}

export function admitWorkerTransport(
  rawTransport: string
): SdlcWorkerTransportContract {
  let parsed: URL;
  try {
    parsed = new URL(normalizedWorkerTransportUrl(rawTransport));
  } catch (error: unknown) {
    throw new TypeError(
      `SdlcWorkerTransportContract.url: expected process:// transport or known worker alias; ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
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
  const rawModel = parsed.searchParams.get("model");
  const model =
    rawModel === null || rawModel.trim().length === 0 ? null : rawModel.trim();
  const effort = parseEffort(parsed.searchParams.get("effort"));
  const agentKey = transportAgentKey(command);
  return Object.freeze({
    kind: "sdlc_worker_transport_contract",
    raw: rawTransport,
    scheme: "process",
    agentKey,
    command,
    args,
    model,
    effort,
    workerId: `worker://odd-sdlc/${agentKey}`,
    backendId: `backend://process/${agentKey}`
  });
}

function codexArgs(input: {
  readonly workspaceRoot: string;
  readonly promptPath: string;
  readonly outputLastMessagePath: string;
  readonly model: string | null;
}): readonly string[] {
  const modelArgs =
    input.model === null ? Object.freeze([]) : Object.freeze(["--model", input.model]);
  return Object.freeze([
    "exec",
    ...modelArgs,
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

function claudeArgs(input: {
  readonly promptPath: string;
  readonly model: string | null;
  readonly effort: "low" | "medium" | "high" | "xhigh" | "max" | null;
}): readonly string[] {
  const args = claudeStreamJsonArgs(readFileSync(input.promptPath, "utf8"));
  if (input.model === null && input.effort === null) {
    return args;
  }
  const [head, ...tail] = args;
  if (head === undefined) {
    throw new TypeError("Claude worker argv contract returned no executable arguments");
  }
  const modelArgs =
    input.model === null ? Object.freeze([]) : Object.freeze(["--model", input.model]);
  const effortArgs =
    input.effort === null ? Object.freeze([]) : Object.freeze(["--effort", input.effort]);
  return Object.freeze([head, ...modelArgs, ...effortArgs, ...tail]);
}

export function argsForWorker(input: {
  readonly transport: SdlcWorkerTransportContract;
  readonly manifestPath: string;
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly promptPath: string;
  readonly outputLastMessagePath: string;
}): readonly string[] {
  if (input.transport.args.length === 0) {
    if (input.transport.agentKey === "codex") {
      return codexArgs({
        workspaceRoot: input.manifest.workspaceRoot,
        promptPath: input.promptPath,
        outputLastMessagePath: input.outputLastMessagePath,
        model: input.transport.model
      });
    }
    if (input.transport.agentKey === "claude") {
      return claudeArgs({
        promptPath: input.promptPath,
        model: input.transport.model,
        effort: input.transport.effort
      });
    }
  }
  return Object.freeze([...input.transport.args, input.manifestPath]);
}

export function stdinForWorker(input: {
  readonly transport: SdlcWorkerTransportContract;
  readonly promptPath: string;
}): string | null {
  void input;
  return null;
}

export function parserForWorkerTransport(
  transport: SdlcWorkerTransportContract
): TracedProcessParser {
  return transport.agentKey === "claude" && transport.args.length === 0
    ? "claude-stream-json"
    : "generic-text";
}

export function selectedWorkerExecutorProfile(
  env: Readonly<Record<string, string | undefined>> = process.env
): TracedProcessExecutorProfile {
  const raw =
    env["ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE"] ??
    env["ABG_TS_AGENT_EXECUTOR_PROFILE"];
  return raw === "pty-terminal" || raw === "local-spawn" ? raw : "local-spawn";
}
