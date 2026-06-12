#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  configuredLiveTimeoutMs,
  liveOperatorRuntimePolicy
} from "./operator_runtime_policy.mjs";
import { canonicalDataMapperFixtureRoot } from "../fixtures/data_mapper_fixture.mjs";
import {
  FG_CONFORM_PROJECT,
  FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE
} from "../../build/semantic/code/src/index.js";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(SCRIPT_DIR, "../..");
const RUNTIME_POLICY = liveOperatorRuntimePolicy();
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const DEFAULT_TEST_RUN_ROOT = resolve(PACKAGE_ROOT, "test_env/test_runs");
const LANE_NAME =
  process.env["ODD_SDLC_TS_DATA_MAPPER_LANE_NAME"] ??
  "full_external_data_mapper_sandbox";
const DATA_MAPPER_TEMPLATE_ROOT = canonicalDataMapperFixtureRoot();
const WORKER_TRANSPORT = RUNTIME_POLICY.liveHarnessDataMapperWorkerTransport;
const DATA_MAPPER_WORKER_MINIMUM_OPERATOR_TIMEOUT_MS =
  process.env["ODD_SDLC_TS_DATA_MAPPER_WORKER_MINIMUM_OPERATOR_TIMEOUT_MS"] ??
  "60000";
const DATA_MAPPER_WORKER_INACTIVITY_TIMEOUT_MS =
  process.env["ODD_SDLC_TS_DATA_MAPPER_WORKER_INACTIVITY_TIMEOUT_MS"] ??
  "900000";
const COMMAND_TIMEOUT_MS = configuredLiveTimeoutMs(
  "ODD_SDLC_TS_DATA_MAPPER_COMMAND_TIMEOUT_MS",
  RUNTIME_POLICY.liveHarnessFullCapabilityCommandTimeoutMs
);
const TARGET_GRAPH_FUNCTION =
  process.env["ODD_SDLC_TS_DATA_MAPPER_TARGET_GRAPH_FUNCTION"] ??
  FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE;

function archiveTimestamp() {
  return new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(".", "");
}

function writeJson(filePath, payload) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function assertExists(filePath, label) {
  if (!existsSync(filePath)) {
    throw new Error(`missing ${label}: ${filePath}`);
  }
}

function freshWorkspace(archiveRoot) {
  assertExists(DATA_MAPPER_TEMPLATE_ROOT, "data_mapper template root");
  const workspace = path.join(archiveRoot, "workspace");
  cpSync(DATA_MAPPER_TEMPLATE_ROOT, workspace, { recursive: true });
  for (const relativePath of [
    ".ai-workspace/events",
    ".ai-workspace/runtime",
    ".abiogenesis",
    ".genesis",
    ".npm-cache",
    "node_modules"
  ]) {
    rmSync(path.join(workspace, relativePath), { recursive: true, force: true });
  }
  return workspace;
}

function runCommand(input) {
  const startedAt = new Date().toISOString();
  const processRecordPath = path.join(input.archiveRoot, `${input.label}.process.json`);
  writeJson(processRecordPath, {
    kind: "odd_sdlc_live_sandbox_process_result",
    lifecycleStatus: "started",
    label: input.label,
    command: input.command,
    args: input.args,
    cwd: input.cwd,
    status: null,
    signal: null,
    error: null,
    stdoutBytes: 0,
    stderrBytes: 0,
    commandTimeoutMs: COMMAND_TIMEOUT_MS,
    startedAt,
    endedAt: null,
    hostPid: process.pid
  });
  const result = spawnSync(input.command, input.args, {
    cwd: input.cwd,
    encoding: "utf8",
    env: input.env,
    maxBuffer: 1024 * 1024 * 100,
    timeout: COMMAND_TIMEOUT_MS
  });
  const endedAt = new Date().toISOString();
  const record = {
    kind: "odd_sdlc_live_sandbox_process_result",
    lifecycleStatus: "completed",
    label: input.label,
    command: input.command,
    args: input.args,
    cwd: input.cwd,
    status: result.status,
    signal: result.signal,
    error: result.error?.message ?? null,
    stdoutBytes: Buffer.byteLength(result.stdout ?? "", "utf8"),
    stderrBytes: Buffer.byteLength(result.stderr ?? "", "utf8"),
    commandTimeoutMs: COMMAND_TIMEOUT_MS,
    startedAt,
    endedAt,
    hostPid: process.pid
  };
  writeJson(processRecordPath, record);
  writeFileSync(
    path.join(input.archiveRoot, `${input.label}.stdout.json`),
    result.stdout ?? "",
    "utf8"
  );
  writeFileSync(
    path.join(input.archiveRoot, `${input.label}.stderr.log`),
    result.stderr ?? "",
    "utf8"
  );
  const acceptedStatuses = input.acceptedStatuses ?? Object.freeze([0]);
  if (!acceptedStatuses.includes(result.status)) {
    throw new Error(
      `${input.label} failed: ${result.stderr || JSON.stringify(record, null, 2)}`
    );
  }
  return result.stdout === "" ? null : JSON.parse(result.stdout);
}

function specPayload(parsed, label) {
  if (parsed?.kind !== "odd_sdlc_spec_method_result" || parsed.status !== "ok") {
    throw new Error(`${label} returned non-ok spec-method result: ${JSON.stringify(parsed, null, 2)}`);
  }
  return parsed.payload;
}

function installedCommandFromInstallPayload(payload, workspace) {
  const commandPath = payload.commandPaths?.find(
    (candidate) => path.basename(candidate) === "odd-sdlc-ts"
  );
  if (commandPath !== undefined) {
    return commandPath;
  }
  return path.join(workspace, "node_modules/.bin/odd-sdlc-ts");
}

function installedAbgCommandFromInstallPayload(payload, workspace, commandName) {
  const commandPath = payload.commandPaths?.find(
    (candidate) => path.basename(candidate) === commandName
  );
  if (commandPath !== undefined) {
    return commandPath;
  }
  return path.join(workspace, "node_modules/.bin", commandName);
}

function copyCacheSeedIfPresent(input) {
  if (input.source.length === 0 || !existsSync(input.source)) {
    return null;
  }
  mkdirSync(dirname(input.destination), { recursive: true });
  cpSync(input.source, input.destination, {
    recursive: true,
    force: true,
    errorOnExist: false
  });
  return Object.freeze({
    source: input.source,
    destination: input.destination
  });
}

function seedSandboxToolCache(input) {
  const home = process.env["HOME"] ?? "";
  const hostSbtBoot =
    process.env["ODD_SDLC_TS_HOST_SBT_BOOT_CACHE"] ??
    (home.length === 0 ? "" : path.join(home, ".sbt/boot"));
  const hostCoursierV1 =
    process.env["ODD_SDLC_TS_HOST_COURSIER_V1_CACHE"] ??
    (home.length === 0 ? "" : path.join(home, "Library/Caches/Coursier/v1"));
  const seeded = [
    copyCacheSeedIfPresent({
      source: hostSbtBoot,
      destination: input.sbtBootDirectory
    }),
    copyCacheSeedIfPresent({
      source: path.join(hostCoursierV1, "https/repo1.maven.org/maven2/org/scala-sbt"),
      destination: path.join(input.coursierCache, "https/repo1.maven.org/maven2/org/scala-sbt")
    }),
    copyCacheSeedIfPresent({
      source: path.join(hostCoursierV1, "https/repo1.maven.org/maven2/org/scala-lang"),
      destination: path.join(input.coursierCache, "https/repo1.maven.org/maven2/org/scala-lang")
    })
  ].filter((entry) => entry !== null);
  return Object.freeze(seeded);
}

function sandboxToolCache(input) {
  const toolCacheRoot = path.join(
    input.workspace,
    ".ai-workspace/runtime/odd_sdlc/tool-cache"
  );
  const sbtBootDirectory = path.join(toolCacheRoot, "sbt-boot");
  const sbtGlobalBase = path.join(toolCacheRoot, "sbt-global");
  const sbtIvyHome = path.join(toolCacheRoot, "ivy2");
  const coursierCache = path.join(toolCacheRoot, "coursier");
  const archiveToolCacheRoot = path.join(input.archiveRoot, "tool-cache");
  for (const dirPath of [
    toolCacheRoot,
    sbtBootDirectory,
    sbtGlobalBase,
    sbtIvyHome,
    coursierCache
  ]) {
    mkdirSync(dirPath, { recursive: true });
  }
  const seededCacheRefs = seedSandboxToolCache({
    sbtBootDirectory,
    coursierCache
  });
  const sbtProperties = [
    `-Dsbt.boot.directory=${sbtBootDirectory}`,
    `-Dsbt.global.base=${sbtGlobalBase}`,
    `-Dsbt.ivy.home=${sbtIvyHome}`,
    `-Divy.home=${sbtIvyHome}`
  ].join(" ");
  return Object.freeze({
    toolCacheRoot,
    archiveToolCacheRoot,
    sbtBootDirectory,
    sbtGlobalBase,
    sbtIvyHome,
    coursierCache,
    seededCacheRefs,
    env: Object.freeze({
      COURSIER_CACHE: coursierCache,
      IVY_HOME: sbtIvyHome,
      SBT_OPTS: [process.env["SBT_OPTS"] ?? "", sbtProperties].join(" ").trim()
    })
  });
}

function dataMapperWorkerRuntimeEnv() {
  return Object.freeze({
    ODD_SDLC_TEST_ONLY_MINIMUM_OPERATOR_TIMEOUT_MS:
      DATA_MAPPER_WORKER_MINIMUM_OPERATOR_TIMEOUT_MS,
    ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS:
      DATA_MAPPER_WORKER_INACTIVITY_TIMEOUT_MS
  });
}

function findProductMaterializationPackages(workspace) {
  const runsRoot = path.join(workspace, ".ai-workspace/runtime/odd_sdlc/operator-runs");
  if (!existsSync(runsRoot)) {
    return [];
  }
  const packages = [];
  const stack = [runsRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readDirEntries(current)) {
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(child);
      } else if (entry.isFile() && entry.name === "worker_invocation_package.json") {
        const pkg = readJsonFile(child);
        if (pkg.outputContract?.materializationRequired === true) {
          packages.push({
            path: child,
            edgeName: pkg.edgeName,
            targetAssetType: pkg.targetAssetType,
            declaredProductFileTargets:
              pkg.outputContract?.declaredProductFileTargets ?? [],
            productMaterializationAuthority: pkg.productMaterializationAuthority ?? null
          });
        }
      }
    }
  }
  return packages.sort((left, right) => left.path.localeCompare(right.path));
}

function readDirEntries(dirPath) {
  return existsSync(dirPath)
    ? [...readdirSync(dirPath, { withFileTypes: true })]
    : [];
}

function abgStartArgs(targetGraphFunction) {
  return [
    "start",
    "--workspace",
    ".",
    "--scope",
    "workspace",
    "--target",
    `graph_function:${targetGraphFunction}`,
    "--until",
    "converged"
  ];
}

function summaryStepFromStart(phase, start) {
  return {
    phase,
    status: start.status ?? null,
    target: start.target ?? null,
    resolvedTarget: start.resolved_target ?? null,
    edge: start.edge ?? null,
    stoppedBy: start.stopped_by ?? null,
    stopClass: start.stop_class ?? null,
    liveStatus: start.live_status ?? null,
    eventKinds: start.event_kinds ?? []
  };
}

function isLawfulAbgGapStop(start) {
  return (
    start?.status === "blocked" &&
    start?.stopped_by === "blocked" &&
    start?.control_outcome?.kind === "blocked" &&
    start?.control_outcome?.stopDetail?.kind === "gap_stop" &&
    start?.live_status?.runStatus === "blocked" &&
    start?.live_status?.reason === "gap_stop" &&
    start?.stop_class?.kind === "blocked"
  );
}

function terminalReasonFromStart(start) {
  if (start?.status === "converged") {
    return "abg_reported_converged";
  }
  if (isLawfulAbgGapStop(start)) {
    return "abg_reported_lawful_gap_stop";
  }
  throw new Error(
    `ABG start returned non-lawful terminal: ${JSON.stringify(start, null, 2)}`
  );
}

function main() {
  const testRunRoot = resolve(
    process.env["ODD_SDLC_TS_TEST_RUN_ROOT"] ?? DEFAULT_TEST_RUN_ROOT
  );
  const archiveRoot = path.join(testRunRoot, LANE_NAME, `${archiveTimestamp()}_pid${process.pid}`);
  mkdirSync(archiveRoot, { recursive: true });
  const workspace = freshWorkspace(archiveRoot);
  const sourceCli = path.join(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");
  assertExists(sourceCli, "built source odd-sdlc-ts CLI");
  const toolCache = sandboxToolCache({ archiveRoot, workspace });

  const baseEnv = {
    ...process.env,
    ...dataMapperWorkerRuntimeEnv(),
    ...toolCache.env,
    ODD_SDLC_TS_OUTPUT: "json",
    ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
    ABG_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
    ODD_SDLC_TS_WORKER_TRANSPORT: WORKER_TRANSPORT,
    ODD_SDLC_TS_DATA_MAPPER_WORKER: WORKER_TRANSPORT
  };
  const summary = {
    kind: "odd_sdlc_full_external_data_mapper_sandbox_run",
    commandBinding: "abg_cli_start_until_converged",
    archiveRoot,
    workspace,
    templateRoot: DATA_MAPPER_TEMPLATE_ROOT,
    workerTransport: WORKER_TRANSPORT,
    workerRuntimeEnv: dataMapperWorkerRuntimeEnv(),
    sandboxToolCache: {
      toolCacheRoot: toolCache.toolCacheRoot,
      archiveToolCacheRoot: toolCache.archiveToolCacheRoot,
      sbtBootDirectory: toolCache.sbtBootDirectory,
      sbtGlobalBase: toolCache.sbtGlobalBase,
      sbtIvyHome: toolCache.sbtIvyHome,
      coursierCache: toolCache.coursierCache,
      seededCacheRefs: toolCache.seededCacheRefs
    },
    targetGraphFunction: TARGET_GRAPH_FUNCTION,
    steps: []
  };
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);

  const installPayload = specPayload(
    runCommand({
      label: "install",
      command: process.execPath,
      args: [
        sourceCli,
        "install",
        "--target",
        ".",
        "--package-source",
        PACKAGE_ROOT,
        "--abg-package-source",
        ABG_TYPESCRIPT_ROOT,
        "--installed-package-name",
        "odd-sdlc-full-external-data-mapper-sandbox"
      ],
      cwd: workspace,
      env: baseEnv,
      archiveRoot
    }),
    "install"
  );
  const installedCommand = installedCommandFromInstallPayload(installPayload, workspace);
  assertExists(installedCommand, "installed odd-sdlc-ts command");
  const installManifest =
    installPayload.manifest ??
    (typeof installPayload.installManifestPath === "string"
      ? readJsonFile(installPayload.installManifestPath)
      : null);
  const abgRuntimeBindingPath = installManifest?.abgRuntimeBindingPath ?? null;
  const genesisCommand = installedAbgCommandFromInstallPayload(
    installPayload,
    workspace,
    "genesis-ts"
  );
  assertExists(genesisCommand, "installed genesis-ts command");
  assertExists(abgRuntimeBindingPath, "installed ABG runtime binding");
  summary.installedCommand = installedCommand;
  summary.abgCommand = genesisCommand;
  summary.installManifestPath = installPayload.installManifestPath ?? null;
  summary.abgRuntimeBindingPath = abgRuntimeBindingPath;
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);

  const conformStart = runCommand({
    label: "abg-conform-project-until-converged",
    command: genesisCommand,
    args: abgStartArgs(FG_CONFORM_PROJECT),
    cwd: workspace,
    env: baseEnv,
    archiveRoot
  });
  summary.steps.push(summaryStepFromStart("abg-conform-project", conformStart));
  summary.abgConformProject = conformStart;
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);

  const start = runCommand({
    label: "abg-start-until-converged",
    command: genesisCommand,
    args: abgStartArgs(TARGET_GRAPH_FUNCTION),
    cwd: workspace,
    env: baseEnv,
    archiveRoot,
    acceptedStatuses: Object.freeze([0, 4])
  });
  summary.steps.push(summaryStepFromStart("abg-start", start));
  summary.abgStart = start;
  summary.productMaterializationPackages = findProductMaterializationPackages(workspace);
  summary.terminalReason = terminalReasonFromStart(start);
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
