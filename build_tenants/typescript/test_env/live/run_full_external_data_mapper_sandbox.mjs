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

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(SCRIPT_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);
const DEFAULT_TEST_RUN_ROOT = resolve(PACKAGE_ROOT, "test_env/test_runs");
const LANE_NAME = "full_external_data_mapper_sandbox";
const DATA_MAPPER_TEMPLATE_ROOT =
  process.env["ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT"] ??
  "/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template";
const WORKER_TRANSPORT =
  process.env["ODD_SDLC_TS_DATA_MAPPER_WORKER"] ??
  "process://claude?model=sonnet&effort=xhigh";
const MAX_STEPS = Number.parseInt(
  process.env["ODD_SDLC_TS_DATA_MAPPER_MAX_STEPS"] ?? "56",
  10
);
const COMMAND_TIMEOUT_MS = Number.parseInt(
  process.env["ODD_SDLC_TS_DATA_MAPPER_COMMAND_TIMEOUT_MS"] ?? `${1000 * 60 * 20}`,
  10
);

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
    label: input.label,
    command: input.command,
    args: input.args,
    cwd: input.cwd,
    status: result.status,
    signal: result.signal,
    error: result.error?.message ?? null,
    stdoutBytes: Buffer.byteLength(result.stdout ?? "", "utf8"),
    stderrBytes: Buffer.byteLength(result.stderr ?? "", "utf8"),
    startedAt,
    endedAt
  };
  writeJson(path.join(input.archiveRoot, `${input.label}.process.json`), record);
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
  if (result.status !== 0) {
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

function edgeSummary(payload) {
  return {
    status: payload.status ?? null,
    currentEdge: payload.projection?.currentEdge ?? payload.summary?.currentEdge ?? null,
    graphFunctionName: payload.summary?.graphFunctionName ?? null,
    postflight: payload.postflight?.status ?? null,
    assurance: payload.assuranceSatisfaction?.status ?? null,
    blockingReason: payload.summary?.blockingReason ?? payload.blockingReason ?? null,
    archiveRoot: payload.archiveRoot ?? payload.summary?.archiveRoot ?? null
  };
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

function main() {
  const testRunRoot = resolve(
    process.env["ODD_SDLC_TS_TEST_RUN_ROOT"] ?? DEFAULT_TEST_RUN_ROOT
  );
  const archiveRoot = path.join(testRunRoot, LANE_NAME, `${archiveTimestamp()}_pid${process.pid}`);
  mkdirSync(archiveRoot, { recursive: true });
  const workspace = freshWorkspace(archiveRoot);
  const sourceCli = path.join(PACKAGE_ROOT, "build/semantic/code/src/cli/main.js");
  assertExists(sourceCli, "built source odd-sdlc-ts CLI");

  const baseEnv = {
    ...process.env,
    ODD_SDLC_TS_OUTPUT: "json",
    ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal",
    ABG_TS_AGENT_EXECUTOR_PROFILE: "pty-terminal"
  };
  const summary = {
    kind: "odd_sdlc_full_external_data_mapper_sandbox_run",
    archiveRoot,
    workspace,
    templateRoot: DATA_MAPPER_TEMPLATE_ROOT,
    workerTransport: WORKER_TRANSPORT,
    maxSteps: MAX_STEPS,
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
  summary.installedCommand = installedCommand;
  summary.installManifestPath = installPayload.installManifestPath ?? null;
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);

  let autonomousNextStartAttempted = false;
  for (let step = 0; step < MAX_STEPS; step += 1) {
    const gapsLabel = `step-${String(step).padStart(2, "0")}-gaps`;
    const gaps = specPayload(
      runCommand({
        label: gapsLabel,
        command: installedCommand,
        args: ["gaps", "--workspace", "."],
        cwd: workspace,
        env: baseEnv,
        archiveRoot
      }),
      gapsLabel
    );
    const gapsSummary = { step, phase: "gaps", ...edgeSummary(gaps) };
    summary.steps.push(gapsSummary);
    writeJson(path.join(archiveRoot, "run_summary.json"), summary);
    const currentEdge = gaps.projection?.currentEdge ?? null;
    if (currentEdge === null) {
      if (autonomousNextStartAttempted) {
        summary.terminalReason = "odd_sdlc_reported_no_current_edge_after_autonomous_next";
        break;
      }
      autonomousNextStartAttempted = true;
    }

    const startArgs =
      currentEdge === "Fg_conform_project"
        ? ["start", "--workspace", ".", "--until", "blocked"]
        : [
            "start",
            "--workspace",
            ".",
            "--target",
            "next",
            "--until",
            "first_traversal",
            "--worker",
            WORKER_TRANSPORT
          ];
    const requestedEdge = currentEdge ?? "target:next";
    const startLabel = `step-${String(step).padStart(2, "0")}-start-${requestedEdge.replace(/[^a-z0-9_-]/giu, "_")}`;
    const start = specPayload(
      runCommand({
        label: startLabel,
        command: installedCommand,
        args: startArgs,
        cwd: workspace,
        env: baseEnv,
        archiveRoot
      }),
      startLabel
    );
    summary.steps.push({
      step,
      phase: "start",
      requestedEdge,
      ...edgeSummary(start)
    });
    summary.productMaterializationPackages = findProductMaterializationPackages(workspace);
    writeJson(path.join(archiveRoot, "run_summary.json"), summary);
    if (
      start.status === "converged" ||
      (startSummary.status === "converged" && startSummary.currentEdge === null)
    ) {
      summary.terminalReason = "odd_sdlc_reported_converged";
      writeJson(path.join(archiveRoot, "run_summary.json"), summary);
      break;
    }
  }
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
