// Implements: REQ-F-ODDSDLC-052
// Implements: REQ-F-ODDSDLC-053

import { readFileSync } from "node:fs";
import { basename } from "node:path";
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

function claudeArgs(input: {
  readonly workspaceRoot: string;
}): readonly string[] {
  return Object.freeze([
    "-p",
    "--add-dir",
    input.workspaceRoot,
    "--permission-mode",
    "bypassPermissions",
    "--output-format",
    "text"
  ]);
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
        outputLastMessagePath: input.outputLastMessagePath
      });
    }
    if (input.transport.agentKey === "claude") {
      return claudeArgs({
        workspaceRoot: input.manifest.workspaceRoot
      });
    }
  }
  return Object.freeze([...input.transport.args, input.manifestPath]);
}

export function stdinForWorker(input: {
  readonly transport: SdlcWorkerTransportContract;
  readonly promptPath: string;
}): string | null {
  if (input.transport.args.length === 0 && input.transport.agentKey === "claude") {
    return readFileSync(input.promptPath, "utf8");
  }
  return null;
}
