import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import path from "node:path";

function readJsonFile(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function writeJson(filePath, payload) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function commandPathFromWorkspace(workspaceRoot, commandName) {
  const projection = readJsonFile(
    path.join(
      workspaceRoot,
      ".ai-workspace/runtime/odd_sdlc-typescript-installation.json"
    )
  );
  const commandPath = projection?.commandPaths?.find?.(
    (candidate) => path.basename(candidate) === commandName
  );
  if (typeof commandPath !== "string" || commandPath.length === 0) {
    throw new Error(`installed ${commandName} command path missing`);
  }
  return commandPath;
}

function latestOperatorRunRoot(workspaceRoot) {
  const operatorRunRoot = path.join(
    workspaceRoot,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  if (!existsSync(operatorRunRoot)) return null;
  const roots = readdirSync(operatorRunRoot)
    .map((entry) => path.join(operatorRunRoot, entry))
    .filter((entryPath) => statSync(entryPath).isDirectory())
    .sort((left, right) => statSync(right).mtimeMs - statSync(left).mtimeMs);
  return roots[0] ?? null;
}

function eventCount(workspaceRoot) {
  const eventLog = path.join(workspaceRoot, ".ai-workspace/events/events.jsonl");
  if (!existsSync(eventLog)) return 0;
  const text = readFileSync(eventLog, "utf8").trim();
  return text.length === 0 ? 0 : text.split(/\r?\n/u).length;
}

function targetArg(target) {
  if (target === undefined || target === null) {
    return "graph_function:Fg_conform_project";
  }
  if (target.kind === "graph_function") {
    return `graph_function:${target.handle}`;
  }
  if (target.kind === "asset") {
    return `asset:${target.handle}`;
  }
  if (target.kind === "next") {
    return "next";
  }
  throw new Error(`unsupported ABG CLI test target kind: ${target.kind}`);
}

function graphFunctionNameFromPayload(payload) {
  if (typeof payload?.edge === "string" && payload.edge.length > 0) {
    return payload.edge;
  }
  if (
    typeof payload?.resolved_target === "string" &&
    payload.resolved_target.startsWith("graph_function:")
  ) {
    return payload.resolved_target.slice("graph_function:".length);
  }
  if (
    typeof payload?.graph_function_id === "string" &&
    payload.graph_function_id.startsWith("graph-function:odd_sdlc:")
  ) {
    return payload.graph_function_id.slice("graph-function:odd_sdlc:".length);
  }
  return null;
}

function readArchivePayloads(archiveRoot) {
  if (archiveRoot === null) {
    return {
      manifest: null,
      workerRun: null,
      postflight: null,
      gapDossier: null
    };
  }
  const postflight =
    readJsonFile(path.join(archiveRoot, "postflight.json")) ??
    readJsonFile(path.join(archiveRoot, "worker_process_failure_postflight.json"));
  return {
    manifest: readJsonFile(path.join(archiveRoot, "handoff_manifest.json")),
    workerRun:
      readJsonFile(path.join(archiveRoot, "worker_process_summary.json")) ??
      readJsonFile(path.join(archiveRoot, "worker_run.json")),
    postflight,
    gapDossier:
      readJsonFile(path.join(archiveRoot, "gap_dossier.json")) ??
      readJsonFile(path.join(archiveRoot, "postflight_gap_dossier.json"))
  };
}

function statusFromPayloads(payload, archivePayloads) {
  const workerRun = archivePayloads.workerRun;
  if (
    workerRun !== null &&
    (workerRun.status !== 0 ||
      workerRun.timedOut === true ||
      workerRun.outcome?.kind === "process_error" ||
      workerRun.outcome?.kind === "hard_timeout")
  ) {
    return "worker_failed";
  }
  return typeof payload?.status === "string" ? payload.status : "blocked";
}

function parseAbgCliStdout(stdout) {
  const text = (stdout ?? "").trim();
  if (text.length === 0) {
    return {
      status: "missing",
      payload: {}
    };
  }
  try {
    return {
      status: "parsed",
      payload: JSON.parse(text)
    };
  } catch (error) {
    return {
      status: "invalid",
      payload: {},
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function executeOddSdlcWorkspaceStartViaAbgCliForTest(input) {
  const workspaceRoot = input.workspaceRoot;
  const replayEventCountBefore = eventCount(workspaceRoot);
  const genesisCommand = commandPathFromWorkspace(workspaceRoot, "genesis-ts");
  const args = [
    "start",
    "--workspace",
    workspaceRoot,
    "--scope",
    "workspace",
    "--target",
    targetArg(input.target),
    "--until",
    input.until ?? "converged"
  ];
  const env = {
    ...process.env,
    ...(typeof input.workerTransport === "string" && input.workerTransport.length > 0
      ? {
          ODD_SDLC_TS_WORKER_TRANSPORT: input.workerTransport,
          ODD_SDLC_TS_DATA_MAPPER_WORKER: input.workerTransport,
          ODD_SDLC_WORKER_TRANSPORT: input.workerTransport
        }
      : {})
  };
  const result = spawnSync(genesisCommand, args, {
    cwd: workspaceRoot,
    encoding: "utf8",
    env,
    maxBuffer: 1024 * 1024 * 100
  });
  const archiveRoot = latestOperatorRunRoot(workspaceRoot);
  if (archiveRoot !== null) {
    writeJson(path.join(archiveRoot, "abg_cli_start_process.json"), {
      kind: "odd_sdlc_test_abg_cli_start_process",
      command: genesisCommand,
      args,
      status: result.status,
      signal: result.signal,
      error: result.error?.message ?? null
    });
  }
  const parsedStdout = parseAbgCliStdout(result.stdout);
  if (parsedStdout.status !== "parsed") {
    const stderrExcerpt = (result.stderr ?? "").slice(0, 4000);
    throw new Error(
      [
        "ABG CLI start failed without parseable stdout",
        `status=${String(result.status)}`,
        `signal=${String(result.signal)}`,
        `parse=${parsedStdout.status}`,
        `stderr=${stderrExcerpt}`
      ].join(" ")
    );
  }
  const payload = parsedStdout.payload;
  const archivePayloads = readArchivePayloads(archiveRoot);
  const status = statusFromPayloads(payload, archivePayloads);
  const blockingReasons =
    archivePayloads.postflight?.blockingReasonCarriers ??
    archivePayloads.postflight?.blockingReasons ??
    [];
  const firstBlockingReason = Array.isArray(blockingReasons)
    ? blockingReasons[0]
    : null;
  const graphFunctionName =
    graphFunctionNameFromPayload(payload) ??
    archivePayloads.manifest?.graphFunctionName ??
    null;
  return Object.freeze({
    kind: "odd_sdlc_abg_cli_start_test_projection",
    status,
    abgCli: Object.freeze({
      command: genesisCommand,
      args: Object.freeze([...args]),
      processStatus: result.status,
      processSignal: result.signal,
      processError: result.error?.message ?? null,
      stdoutParseStatus: parsedStdout.status,
      stdoutParseError: parsedStdout.error ?? null
    }),
    summary: Object.freeze({
      workspaceRoot: archivePayloads.manifest?.workspaceRoot ?? workspaceRoot,
      graphFunctionName,
      currentEdge: archivePayloads.manifest?.edgeName ?? graphFunctionName,
      blockingReason:
        firstBlockingReason?.code ??
        archivePayloads.postflight?.blockingReasons?.[0] ??
        payload?.stop_class?.detail ??
        null,
      blockingReasons: Array.isArray(blockingReasons)
        ? Object.freeze([...blockingReasons])
        : Object.freeze([]),
      nextLawfulAction:
        archivePayloads.gapDossier?.nextLawfulActions?.[0] ??
        (status === "blocked" ? "triage_gap" : null)
    }),
    emittedRuntimeEventKinds: Object.freeze(
      Array.isArray(payload?.event_kinds) ? payload.event_kinds : []
    ),
    archiveRoot,
    manifest: archivePayloads.manifest,
    workerRun: archivePayloads.workerRun,
    postflight: archivePayloads.postflight,
    gapDossier: archivePayloads.gapDossier,
    replayEventCountBefore,
    replayEventCountAfter: eventCount(workspaceRoot),
    processStatus: result.status,
    processSignal: result.signal,
    processError: result.error?.message ?? null,
    eventLogPath: payload?.events_path ?? null
  });
}
