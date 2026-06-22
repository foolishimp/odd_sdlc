#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
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
  FG_DECOMPOSE_DEPTH_BETWEEN_NODES,
  FG_CONFORM_PROJECT,
  FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE,
  admitOddSdlcWorkspaceTicket,
  createSdlcTerminalGapTicketsFromOperatorRun,
  installOddSdlcTypescript
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
const DATA_MAPPER_RELEASE_SNAPSHOT_ROOT =
  process.env["ODD_SDLC_TS_DATA_MAPPER_RELEASE_SNAPSHOT_ROOT"] ?? "";
const DATA_MAPPER_PACKAGE_SOURCE_ROOT =
  process.env["ODD_SDLC_TS_DATA_MAPPER_PACKAGE_SOURCE_ROOT"] ?? "";
const WORKER_TRANSPORT =
  cliStringFlag("--worker") ?? RUNTIME_POLICY.liveHarnessDataMapperWorkerTransport;
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
const START_TARGET =
  process.env["ODD_SDLC_TS_DATA_MAPPER_START_TARGET"] ??
  `graph_function:${TARGET_GRAPH_FUNCTION}`;
const DATA_MAPPER_STOP_AFTER_DETAIL_ZOOM =
  process.env["ODD_SDLC_TS_DATA_MAPPER_STOP_AFTER_DETAIL_ZOOM"] !== "false";
const DATA_MAPPER_EXERCISE_TERMINAL_GAP_TICKETS =
  process.env["ODD_SDLC_TS_DATA_MAPPER_EXERCISE_TERMINAL_GAP_TICKETS"] === "true";
const DATA_MAPPER_RUNTIME_TRAVERSAL_STRATEGY =
  process.env["ODD_SDLC_TS_DATA_MAPPER_RUNTIME_TRAVERSAL_STRATEGY"] ?? "";
const DATA_MAPPER_DETAIL_ZOOM_EDGES = Object.freeze([
  "derive_component_code_surface",
  "qualify_component_realization_surface",
  "derive_code_surface",
  "derive_test_design_surface",
  "derive_component_test_surface",
  "derive_uat_test_source_surface",
  "prepare_test_execution_surface",
  "derive_test_execution_result_surface",
  "qualify_component_test_execution_surface",
  "derive_component_repair_schedule_surface",
  "derive_test_run_archive_surface"
]);
function cliStringFlag(flagName) {
  const equalsPrefix = `${flagName}=`;
  for (let index = 2; index < process.argv.length; index += 1) {
    const arg = process.argv[index];
    if (arg === flagName) {
      const value = process.argv[index + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`${flagName}: expected value`);
      }
      return value;
    }
    if (arg.startsWith(equalsPrefix)) {
      const value = arg.slice(equalsPrefix.length);
      if (value.length === 0) {
        throw new Error(`${flagName}: expected value`);
      }
      return value;
    }
  }
  return null;
}

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

function resolveRunPath(value) {
  if (path.isAbsolute(value)) {
    return value;
  }
  const cwdRelative = resolve(value);
  if (existsSync(cwdRelative)) {
    return cwdRelative;
  }
  return resolve(REPO_ROOT, value);
}

function packageSourceForRun(archiveRoot) {
  if (
    DATA_MAPPER_RELEASE_SNAPSHOT_ROOT.length > 0 &&
    DATA_MAPPER_PACKAGE_SOURCE_ROOT.length > 0
  ) {
    throw new Error(
      "declare only one of ODD_SDLC_TS_DATA_MAPPER_RELEASE_SNAPSHOT_ROOT or ODD_SDLC_TS_DATA_MAPPER_PACKAGE_SOURCE_ROOT"
    );
  }
  if (DATA_MAPPER_PACKAGE_SOURCE_ROOT.length > 0) {
    const packageSourceRoot = resolveRunPath(DATA_MAPPER_PACKAGE_SOURCE_ROOT);
    assertExists(path.join(packageSourceRoot, "package.json"), "override package.json");
    return Object.freeze({
      kind: "package_source_override",
      packageSourceRoot,
      releaseSnapshotRoot: null,
      releaseTarballPath: null
    });
  }
  if (DATA_MAPPER_RELEASE_SNAPSHOT_ROOT.length === 0) {
    return Object.freeze({
      kind: "source_package",
      packageSourceRoot: PACKAGE_ROOT,
      releaseSnapshotRoot: null,
      releaseTarballPath: null
    });
  }

  const releaseSnapshotRoot = resolveRunPath(DATA_MAPPER_RELEASE_SNAPSHOT_ROOT);
  const manifestPath = path.join(releaseSnapshotRoot, "release-snapshot-manifest.json");
  const manifest = readJsonFile(manifestPath);
  const tarballRelativePath = manifest?.tarball?.relativePath;
  if (typeof tarballRelativePath !== "string" || tarballRelativePath.length === 0) {
    throw new Error(`release snapshot manifest does not declare a tarball: ${manifestPath}`);
  }
  const releaseTarballPath = path.join(releaseSnapshotRoot, tarballRelativePath);
  assertExists(releaseTarballPath, "release snapshot tarball");

  const packageSourceRoot = path.join(archiveRoot, "release-package-source");
  rmSync(packageSourceRoot, { recursive: true, force: true });
  mkdirSync(packageSourceRoot, { recursive: true });
  const extract = spawnSync(
    "tar",
    ["-xzf", releaseTarballPath, "-C", packageSourceRoot, "--strip-components=1"],
    {
      encoding: "utf8"
    }
  );
  if (extract.status !== 0) {
    throw new Error(
      `release snapshot package extraction failed: ${extract.stderr || extract.error?.message || extract.status}`
    );
  }
  assertExists(path.join(packageSourceRoot, "package.json"), "extracted release package.json");
  return Object.freeze({
    kind: "release_snapshot_package",
    packageSourceRoot,
    releaseSnapshotRoot,
    releaseTarballPath
  });
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
    ...(input.metadata === undefined ? {} : { metadata: input.metadata }),
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
    ...(input.metadata === undefined ? {} : { metadata: input.metadata }),
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

async function runInstallPackageApi(input) {
  const startedAt = new Date().toISOString();
  const processRecordPath = path.join(input.archiveRoot, `${input.label}.process.json`);
  const request = {
    targetRoot: input.targetRoot,
    packageSourceRoot: input.packageSourceRoot,
    abgPackageSourceRoot: input.abgPackageSourceRoot,
    installedPackageName: input.installedPackageName
  };
  writeJson(processRecordPath, {
    kind: "odd_sdlc_live_sandbox_process_result",
    lifecycleStatus: "started",
    label: input.label,
    command: "package-api:installOddSdlcTypescript",
    request,
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
  const payload = await installOddSdlcTypescript(request);
  const stdout = `${JSON.stringify(payload, null, 2)}\n`;
  const status = payload.kind === "installed" ? 0 : 1;
  const endedAt = new Date().toISOString();
  writeJson(processRecordPath, {
    kind: "odd_sdlc_live_sandbox_process_result",
    lifecycleStatus: "completed",
    label: input.label,
    command: "package-api:installOddSdlcTypescript",
    request,
    cwd: input.cwd,
    status,
    signal: null,
    error: payload.kind === "installed" ? null : payload.reason ?? "install_rejected",
    stdoutBytes: Buffer.byteLength(stdout, "utf8"),
    stderrBytes: 0,
    commandTimeoutMs: COMMAND_TIMEOUT_MS,
    startedAt,
    endedAt,
    hostPid: process.pid
  });
  writeFileSync(path.join(input.archiveRoot, `${input.label}.stdout.json`), stdout, "utf8");
  writeFileSync(path.join(input.archiveRoot, `${input.label}.stderr.log`), "", "utf8");
  if (status !== 0) {
    throw new Error(`${input.label} failed: ${JSON.stringify(payload, null, 2)}`);
  }
  return payload;
}

function abgCliStartTargetFor(input) {
  if (runtimeTraversalSelectionEnabled()) {
    throw new Error(
      "runtime traversal selections require an ABG CLI carrier; refusing odd_sdlc package start fallback"
    );
  }
  if (
    input.startTarget === "next" ||
    input.startTarget.startsWith("graph_function:") ||
    input.startTarget.startsWith("asset:")
  ) {
    return input.startTarget;
  }
  if (!isOverlayStartTarget(input.startTarget)) {
    return `graph_function:${input.startTarget}`;
  }
  throw new Error(
    "overlay start targets require ABG CLI target-carrier support; refusing odd_sdlc projection fallback"
  );
}

function runStartAbgCli(input) {
  const abgTarget = abgCliStartTargetFor(input);
  return runCommand({
    label: input.label,
    command: input.installedCommand,
    args: abgStartArgs(abgTarget, input.until),
    cwd: input.workspace,
    env: input.env,
    archiveRoot: input.archiveRoot,
    acceptedStatuses: input.acceptedStatuses,
    metadata: {
      requestedStartTarget: input.startTarget,
      abgStartTarget: abgTarget,
      commandAuthority: "abg_cli"
    }
  });
}

function ticketIdFromTicketRef(ticketRef) {
  if (typeof ticketRef !== "string") {
    throw new TypeError(`ticket ref must be a string: ${String(ticketRef)}`);
  }
  if (ticketRef.startsWith("asset:ticket/")) {
    return ticketRef.slice("asset:ticket/".length);
  }
  if (ticketRef.startsWith("ticket/")) {
    return ticketRef.slice("ticket/".length);
  }
  throw new TypeError(`ticket ref must name asset:ticket/<id>: ${ticketRef}`);
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

function operatorRunRoots(workspace) {
  const runsRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  if (!existsSync(runsRoot)) {
    return [];
  }
  return readdirSync(runsRoot)
    .map((entry) => path.join(runsRoot, entry))
    .filter((entryPath) => {
      try {
        return statSync(entryPath).isDirectory();
      } catch {
        return false;
      }
    })
    .sort();
}

function latestOperatorRunRoot(workspace) {
  return operatorRunRoots(workspace).at(-1) ?? null;
}

function readOptionalJsonFile(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  return readJsonFile(filePath);
}

function finalSdlcProofAssessment(workspace) {
  const runRoot = latestOperatorRunRoot(workspace);
  if (runRoot === null) {
    return Object.freeze({
      kind: "data_mapper_final_sdlc_proof_assessment",
      clean: false,
      reason: "operator_run_missing",
      operatorRunRoot: null
    });
  }
  const workerReport = readOptionalJsonFile(path.join(runRoot, "worker_result_report.json"));
  const postflight = readOptionalJsonFile(path.join(runRoot, "postflight.json"));
  const closureDecision = readOptionalJsonFile(
    path.join(runRoot, "sdlc_edge_closure_decision.json")
  );
  const residualPressure = readOptionalJsonFile(
    path.join(runRoot, "sdlc_edge_residual_pressure.json")
  );
  const projection = readOptionalJsonFile(
    path.join(runRoot, "sdlc_next_action_projection.json")
  );
  const executionEvidence = workerReport?.executionEvidence ?? null;
  const failedCount =
    typeof executionEvidence?.failedCount === "number" ? executionEvidence.failedCount : 0;
  const executionStatus =
    typeof executionEvidence?.status === "string" ? executionEvidence.status : null;
  const closureDisposition =
    typeof closureDecision?.disposition === "string" ? closureDecision.disposition : null;
  const residualClear =
    typeof residualPressure?.clear === "boolean" ? residualPressure.clear : null;
  const projectionChoosesNext = projection?.choosesNextTraversal === true;
  const reason =
    executionStatus === "failed" || failedCount > 0
      ? "execution_evidence_failed"
      : closureDisposition === null
        ? "closure_decision_missing"
        : closureDisposition !== "close"
          ? `closure_${closureDisposition}`
          : residualClear === false
            ? "residual_pressure_open"
            : projectionChoosesNext
              ? "next_action_projection_open"
              : "clean";
  return Object.freeze({
    kind: "data_mapper_final_sdlc_proof_assessment",
    clean: reason === "clean",
    reason,
    operatorRunRoot: runRoot,
    executionStatus,
    failedCount,
    postflightStatus: typeof postflight?.status === "string" ? postflight.status : null,
    closureDisposition,
    residualClear,
    residualPressureRefs: residualPressure?.requiredPressureRefs ?? [],
    nextActionBasisKind:
      typeof projection?.nextActionBasisKind === "string"
        ? projection.nextActionBasisKind
        : null,
    nextGraphVectorRef:
      typeof projection?.nextGraphVectorRef === "string" ? projection.nextGraphVectorRef : null,
    projectionChoosesNext
  });
}

function observedHandoffRecords(workspace) {
  return operatorRunRoots(workspace)
    .map((runRoot) => {
      const manifestPath = path.join(runRoot, "handoff_manifest.json");
      if (!existsSync(manifestPath)) {
        return null;
      }
      const manifest = readJsonFile(manifestPath);
      return Object.freeze({
        runRoot,
        edgeName: manifest.edgeName ?? null,
        overlayRef: manifest.overlayRef ?? null,
        overlayZoomGraphFunctionRefs: Object.freeze([
          ...(Array.isArray(manifest.overlayZoomGraphFunctionRefs)
            ? manifest.overlayZoomGraphFunctionRefs
            : manifest.zoomGraphFunctionRef === undefined ||
                manifest.zoomGraphFunctionRef === null
              ? []
              : [manifest.zoomGraphFunctionRef])
        ])
      });
    })
    .filter((entry) => entry !== null);
}

function observedDetailZoomEdges(workspace) {
  return observedHandoffRecords(workspace)
    .filter((entry) =>
      entry.overlayZoomGraphFunctionRefs.includes(FG_DECOMPOSE_DEPTH_BETWEEN_NODES)
    )
    .map((entry) => entry.edgeName)
    .filter((edgeName) => typeof edgeName === "string" && edgeName.length > 0);
}

function observedHandoffEdgesIncludeInOrder(observed, expected) {
  let cursor = 0;
  for (const edgeName of observed) {
    if (edgeName === expected[cursor]) {
      cursor += 1;
      if (cursor === expected.length) {
        return true;
      }
    }
  }
  return expected.length === 0;
}

function detailZoomStopSatisfied(workspace) {
  return (
    DATA_MAPPER_STOP_AFTER_DETAIL_ZOOM &&
    observedHandoffEdgesIncludeInOrder(
      observedDetailZoomEdges(workspace),
      DATA_MAPPER_DETAIL_ZOOM_EDGES
    )
  );
}

function releaseDepthParityMet(workspace) {
  const releaseDepthParityPath = path.join(
    workspace,
    "build_tenants/scala_spark/design/release_depth_parity_surface.md"
  );
  if (!existsSync(releaseDepthParityPath)) {
    return false;
  }
  let register;
  try {
    register = readJsonFile(releaseDepthParityPath);
  } catch {
    return false;
  }
  return (
    register?.releaseDepthParity?.status === "met" &&
    Array.isArray(register.releaseDepthParity.blockingReasons) &&
    register.releaseDepthParity.blockingReasons.length === 0
  );
}

function releaseSurfacePresent(workspace) {
  const releaseSurfacePath = path.join(
    workspace,
    "build_tenants/scala_spark/design/release_surface.md"
  );
  return (
    existsSync(releaseSurfacePath) &&
    readFileSync(releaseSurfacePath, "utf8").includes("# release_surface")
  );
}

function releaseProofStopSatisfied(workspace) {
  return (
    !DATA_MAPPER_STOP_AFTER_DETAIL_ZOOM &&
    observedHandoffEdgesIncludeInOrder(
      observedDetailZoomEdges(workspace),
      DATA_MAPPER_DETAIL_ZOOM_EDGES
    ) &&
    releaseDepthParityMet(workspace) &&
    releaseSurfacePresent(workspace)
  );
}

function graphFunctionFromStartTarget(startTarget) {
  return startTarget.startsWith("graph_function:")
    ? startTarget.slice("graph_function:".length)
    : null;
}

function isOverlayStartTarget(startTarget) {
  return startTarget.startsWith("overlay:");
}

function runtimeTraversalSelectionEnabled() {
  return DATA_MAPPER_RUNTIME_TRAVERSAL_STRATEGY.length > 0;
}

function abgStartArgs(startTarget, until = "converged") {
  return [
    "start",
    "--workspace",
    ".",
    "--scope",
    "workspace",
    "--target",
    startTarget,
    "--until",
    until
  ];
}

function summaryStepFromStart(phase, start) {
  const summary = start?.summary ?? null;
  return {
    phase,
    status: start?.status ?? summary?.status ?? null,
    target: start.target ?? null,
    resolvedTarget: start.resolved_target ?? null,
    edge: start.edge ?? summary?.currentEdge ?? null,
    stoppedBy: start.stopped_by ?? null,
    stopClass: start.stop_class ?? null,
    liveStatus: start.live_status ?? null,
    eventKinds: start.event_kinds ?? start.emittedRuntimeEventKinds ?? []
  };
}

function compactStartForSummary(start) {
  const summary = start?.summary ?? null;
  const executionContract = start?.start?.executionContract ?? null;
  const overlaySegmentCompletion =
    start?.traversalConsequence?.overlaySegmentCompletion ?? null;
  return Object.freeze({
    kind: start?.kind ?? null,
    status: start?.status ?? summary?.status ?? null,
    graphFunctionName:
      summary?.graphFunctionName ??
      executionContract?.targetGraphFunction ??
      graphFunctionFromStartTarget(start?.resolved_target) ??
      null,
    currentEdge: summary?.currentEdge ?? start?.edge ?? null,
    blockingReason: summary?.blockingReason ?? null,
    nextLawfulAction: summary?.nextLawfulAction ?? null,
    archiveRoot: start?.archiveRoot ?? summary?.archiveRoot ?? null,
    overlayRef: executionContract?.overlayRef ?? overlaySegmentCompletion?.overlayRef ?? null,
    overlayZoomGraphFunctionRefs:
      executionContract?.overlayBinding?.zoomGraphFunctionRefs ?? [],
    overlayZoomTargetGraphFunctionRefs:
      executionContract?.overlayBinding?.zoomTargetGraphFunctionRefs ?? [],
    overlaySegmentCompletion:
      overlaySegmentCompletion === null
        ? null
        : Object.freeze({
            stopDisposition: overlaySegmentCompletion.stopDisposition ?? null,
            productConverged: overlaySegmentCompletion.productConverged ?? null,
            remainingGraphPressureRefs:
              overlaySegmentCompletion.remainingGraphPressureRefs ?? []
          })
  });
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
  if (
    start?.kind === "sdlc_installed_operator_start_cli_projection" ||
    start?.kind === "odd_sdlc_abg_cli_start_test_projection"
  ) {
    const status = start.status ?? start.summary?.status ?? null;
    if (status === "converged") {
      return "sdlc_reported_converged";
    }
    if (status === "blocked") {
      return "sdlc_reported_blocked";
    }
    throw new Error(
      `SDLC start returned non-terminal status: ${JSON.stringify(start, null, 2)}`
    );
  }
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

function startArchiveRoot(start) {
  return start?.archiveRoot ?? start?.summary?.archiveRoot ?? null;
}

function startBlockingReason(start) {
  return start?.summary?.blockingReason ?? start?.blockingReason ?? null;
}

function startBlockingReasons(start) {
  const summaryReasons = start?.summary?.blockingReasons;
  if (Array.isArray(summaryReasons)) {
    return summaryReasons;
  }
  const directReasons = start?.blockingReasons;
  return Array.isArray(directReasons) ? directReasons : [];
}

function startClosureDisposition(start) {
  return (
    start?.summary?.admittedSemantic?.closureDisposition ??
    start?.traversalConsequence?.edgeClosureDecision?.disposition ??
    start?.edgeClosureDecision?.disposition ??
    null
  );
}

function isSameEdgeRetryStart(start) {
  const closureDisposition = startClosureDisposition(start);
  if (closureDisposition !== null) {
    return closureDisposition === "retry";
  }
  return startBlockingReasons(start).some(
    (reason) => reason?.lawfulReentryPoint === "same_edge_retry"
  );
}

function shouldRunTerminalGapTicketWorkflow(start) {
  const blockingReason = startBlockingReason(start);
  if (blockingReason === "retry_budget_exhausted") {
    return true;
  }
  const status = start?.status ?? start?.summary?.status ?? null;
  if (status !== "blocked") {
    return false;
  }
  if (isSameEdgeRetryStart(start)) {
    return false;
  }
  if (
    typeof blockingReason === "string" &&
    (blockingReason.includes("review_grade_assessment_invalid") ||
      blockingReason.includes("evaluation_set_incomplete") ||
      blockingReason.includes("triage_gap"))
  ) {
    return true;
  }
  return startBlockingReasons(start).some((reason) => {
    const code = reason?.code ?? null;
    return (
      reason?.lawfulReentryPoint === "triage_gap" ||
      code === "review_grade_assessment_invalid"
    );
  });
}

async function maybeRunTerminalGapTicketWorkflow(input) {
  const operatorRunRoot = startArchiveRoot(input.start);
  if (operatorRunRoot === null || !shouldRunTerminalGapTicketWorkflow(input.start)) {
    return null;
  }
  const requiredTicketIntakeFiles = [
    "operator_summary.json",
    "review_grade_edge_fulfillment_assessment.json",
    "sdlc_edge_closure_decision.json"
  ];
  if (
    requiredTicketIntakeFiles.some(
      (relativePath) => !existsSync(path.join(operatorRunRoot, relativePath))
    )
  ) {
    return null;
  }
  const intake = createSdlcTerminalGapTicketsFromOperatorRun({
    workspaceRoot: input.workspace,
    operatorRunRoot,
    intakeKind: "code_review_triage"
  });
  const parentTicketRef = intake?.parentTicket?.ticketRef;
  if (typeof parentTicketRef !== "string" || parentTicketRef.length === 0) {
    throw new Error(
      `ticket-intake did not return a parent ticket ref: ${JSON.stringify(intake, null, 2)}`
    );
  }
  writeJson(path.join(input.archiveRoot, "ticket-intake-terminal-gap.stdout.json"), intake);
  const admitted = admitOddSdlcWorkspaceTicket({
    workspaceRoot: input.workspace,
    ticketId: ticketIdFromTicketRef(parentTicketRef)
  });
  writeJson(path.join(input.archiveRoot, "ticket-admit-terminal-gap.stdout.json"), admitted);
  const ticketStart = runStartAbgCli({
      label: "ticket-start-terminal-gap",
      installedCommand: input.installedCommand,
      workspace: input.workspace,
      startTarget: parentTicketRef,
      until: "blocked",
      env: input.env,
      archiveRoot: input.archiveRoot,
      acceptedStatuses: Object.freeze([0, 4])
    });
  return Object.freeze({
    kind: "data_mapper_terminal_gap_ticket_workflow",
    sourceStopKind: intake.sourceStopKind ?? null,
    operatorRunRoot,
    parentTicketRef,
    createdTicketRefs: intake.createdTicketRefs ?? [],
    residualFindingRefs: intake.residualFindingRefs ?? [],
    ticketIntake: intake,
    admittedTicketExecutionContractRef: admitted.executionContractRef ?? null,
    ticketStart: compactStartForSummary(ticketStart)
  });
}

function writeTerminalGapTicketWorkflowExerciseOperatorRun(input) {
  const runRoot = path.join(
    input.workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs/t162-terminal-gap-ticket-workflow-live"
  );
  rmSync(runRoot, { recursive: true, force: true });
  mkdirSync(runRoot, { recursive: true });
  const reviewGradeRef =
    "workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/t162-terminal-gap-ticket-workflow-live/review_grade_edge_fulfillment_assessment.json";
  const stdoutRef =
    "workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/t162-terminal-gap-ticket-workflow-live/review_grade_edge_fulfillment_stdout.log";
  writeJson(path.join(runRoot, "operator_summary.json"), {
    kind: "sdlc_operator_summary",
    currentEdge: "derive_component_code_surface",
    status: "blocked",
    blockingReason:
      "evaluation_set_incomplete blocked:evaluation-rule://odd-sdlc/review-grade-edge-fulfillment/fp:review_grade_fulfillment_binding_requirement_mismatch:module:cdme-accounting",
    blockingReasons: [
      {
        kind: "sdlc_blocking_reason",
        code: "review_grade_assessment_invalid",
        reasonClass: "assurance",
        lawfulReentryPoint: "triage_gap",
        detail:
          "review_grade_fulfillment_binding_requirement_mismatch:module:cdme-accounting",
        evidenceRefs: [reviewGradeRef, stdoutRef]
      }
    ]
  });
  writeJson(path.join(runRoot, "sdlc_edge_closure_decision.json"), {
    kind: "sdlc_edge_closure_decision",
    disposition: "block"
  });
  writeJson(path.join(runRoot, "worker_result_report.json"), {
    kind: "sdlc_worker_result_report",
    edgeName: "derive_component_code_surface",
    status: "completed",
    outputAssetRefs: [
      "workspace://build_tenants/scala_spark/design/component_code_surface.md"
    ]
  });
  writeJson(path.join(runRoot, "review_grade_edge_fulfillment_assessment.json"), {
    kind: "sdlc_review_grade_edge_fulfillment_assessment",
    edgeName: "derive_component_code_surface",
    status: "blocked",
    findings: [
      {
        kind: "sdlc_review_grade_obligation_finding",
        obligationId:
          "requirement:data_mapper.ai_workspace_context_project_bootstrap.req_ldm_004_a",
        fulfillmentStatus: "blocked",
        failureClass: "trace_missing",
        requiredAction:
          "Repair component code lineage through builder workflow evidence instead of manual sandbox product edits.",
        evidenceRefs: [
          "workspace://.ai-workspace/context/project_bootstrap.md",
          "workspace://build_tenants/scala_spark/design/component_code_surface.md",
          "workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/t162-terminal-gap-ticket-workflow-live/worker_result_report.json"
        ]
      },
      {
        kind: "sdlc_review_grade_obligation_finding",
        obligationId: "requirement:data_mapper.requirements.req_int_006",
        fulfillmentStatus: "blocked",
        failureClass: "semantic_not_realized",
        requiredAction:
          "Create a governed product-gap ticket for versioned lookup lineage instead of patching the generated mapper directly.",
        evidenceRefs: [
          "workspace://specification/REQUIREMENTS.md",
          "workspace://build_tenants/scala_spark/design/component_code_surface.md"
        ]
      }
    ]
  });
  writeFileSync(
    path.join(runRoot, "review_grade_edge_fulfillment_stdout.log"),
    [
      "review grade blocked",
      "review_grade_fulfillment_binding_requirement_mismatch:module:cdme-accounting",
      "lawfulReentryPoint=triage_gap"
    ].join("\n"),
    "utf8"
  );
  return Object.freeze({
    runRoot,
    start: Object.freeze({
      kind: "sdlc_installed_operator_start_cli_projection",
      status: "blocked",
      archiveRoot: runRoot,
      summary: Object.freeze({
        status: "blocked",
        archiveRoot: runRoot,
        currentEdge: "derive_component_code_surface",
        blockingReason:
          "evaluation_set_incomplete blocked:evaluation-rule://odd-sdlc/review-grade-edge-fulfillment/fp:review_grade_fulfillment_binding_requirement_mismatch:module:cdme-accounting",
        blockingReasons: Object.freeze([
          Object.freeze({
            kind: "sdlc_blocking_reason",
            code: "review_grade_assessment_invalid",
            reasonClass: "assurance",
            lawfulReentryPoint: "triage_gap",
            detail:
              "review_grade_fulfillment_binding_requirement_mismatch:module:cdme-accounting",
            evidenceRefs: Object.freeze([reviewGradeRef, stdoutRef])
          })
        ])
      })
    })
  });
}

async function runTerminalGapTicketWorkflowExercise(input) {
  if (!DATA_MAPPER_EXERCISE_TERMINAL_GAP_TICKETS) {
    return null;
  }
  const exercise = writeTerminalGapTicketWorkflowExerciseOperatorRun({
    workspace: input.workspace
  });
  const workflow = await maybeRunTerminalGapTicketWorkflow({
    start: exercise.start,
    workspace: input.workspace,
    installedCommand: input.installedCommand,
    env: input.env,
    archiveRoot: input.archiveRoot
  });
  if (workflow === null) {
    throw new Error("terminal gap ticket workflow exercise did not run");
  }
  if (workflow.sourceStopKind !== "review_grade_triage_gap") {
    throw new Error(
      `terminal gap exercise used wrong source stop kind: ${workflow.sourceStopKind}`
    );
  }
  if (workflow.createdTicketRefs.length < 2) {
    throw new Error(
      `terminal gap exercise did not create parent/split tickets: ${JSON.stringify(workflow, null, 2)}`
    );
  }
  if (workflow.ticketStart.graphFunctionName !== "route_ticket_work_item") {
    throw new Error(
      `terminal gap ticket did not re-enter through route_ticket_work_item: ${JSON.stringify(workflow.ticketStart, null, 2)}`
    );
  }
  return Object.freeze({
    kind: "data_mapper_terminal_gap_ticket_workflow_exercise",
    exerciseOperatorRunRoot: exercise.runRoot,
    workflow
  });
}

function isSuccessfulSdlcTraversalStart(start) {
  const status = start?.status ?? start?.summary?.status ?? null;
  return (
    status === "converged" ||
    (status === "worker_invoked" &&
      start?.summary?.admittedSemantic?.closureDisposition === "close")
  );
}

async function main() {
  if (runtimeTraversalSelectionEnabled()) {
    throw new Error(
      "ODD_SDLC_TS_DATA_MAPPER_RUNTIME_TRAVERSAL_STRATEGY requires an ABG CLI runtime traversal selection carrier; T-204 forbids falling back to odd_sdlc package start"
    );
  }
  const testRunRoot = resolve(
    process.env["ODD_SDLC_TS_TEST_RUN_ROOT"] ?? DEFAULT_TEST_RUN_ROOT
  );
  const archiveRoot = path.join(testRunRoot, LANE_NAME, `${archiveTimestamp()}_pid${process.pid}`);
  mkdirSync(archiveRoot, { recursive: true });
  const workspace = freshWorkspace(archiveRoot);
  const packageSource = packageSourceForRun(archiveRoot);
  const toolCache = sandboxToolCache({ archiveRoot, workspace });

  const baseEnv = {
    ...process.env,
    ...dataMapperWorkerRuntimeEnv(),
    ...toolCache.env,
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
    packageSource,
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
    startTarget: START_TARGET,
    targetGraphFunction: TARGET_GRAPH_FUNCTION,
    stopAfterDetailZoomEdges: DATA_MAPPER_STOP_AFTER_DETAIL_ZOOM,
    exerciseTerminalGapTickets: DATA_MAPPER_EXERCISE_TERMINAL_GAP_TICKETS,
    requiredDetailZoomEdges: DATA_MAPPER_DETAIL_ZOOM_EDGES,
    steps: []
  };
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);

  const installPayload = await runInstallPackageApi({
      label: "install",
      targetRoot: workspace,
      packageSourceRoot: packageSource.packageSourceRoot,
      abgPackageSourceRoot: ABG_TYPESCRIPT_ROOT,
      installedPackageName: "odd-sdlc-full-external-data-mapper-sandbox",
      cwd: workspace,
      archiveRoot
    });
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
  summary.abgCommand = genesisCommand;
  summary.installManifestPath = installPayload.installManifestPath ?? null;
  summary.abgRuntimeBindingPath = abgRuntimeBindingPath;
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);

  const conformStart = runCommand({
    label: "abg-conform-project-until-converged",
    command: genesisCommand,
    args: abgStartArgs(`graph_function:${FG_CONFORM_PROJECT}`),
    cwd: workspace,
    env: baseEnv,
    archiveRoot
  });
  summary.steps.push(summaryStepFromStart("abg-conform-project", conformStart));
  summary.abgConformProject = conformStart;
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);

  const startResult = Object.freeze({
    start: runStartAbgCli({
      label: "abg-start-until-converged",
      installedCommand: genesisCommand,
      workspace,
      startTarget: START_TARGET,
      until: "converged",
      env: baseEnv,
      archiveRoot,
      acceptedStatuses: Object.freeze([0, 4])
    }),
    starts: Object.freeze([]),
    terminalReason: null
  });
  const start = startResult.start;
  summary.steps.push(summaryStepFromStart("abg-start", start));
  summary.abgStart = compactStartForSummary(start);
  summary.resolvedStartGraphFunction =
    graphFunctionFromStartTarget(START_TARGET) ?? start.resolved_target ?? null;
  summary.productMaterializationPackages = findProductMaterializationPackages(workspace);
  summary.observedDetailZoomEdges = observedDetailZoomEdges(workspace);
  summary.releaseProofConverged = releaseProofStopSatisfied(workspace);
  summary.releaseProofStopKind = summary.releaseProofConverged
    ? "sdlc_release_proof_converged"
    : null;
  summary.terminalReason = startResult.terminalReason ?? terminalReasonFromStart(start);
  summary.terminalGapTicketWorkflow = await maybeRunTerminalGapTicketWorkflow({
    start,
    workspace,
    installedCommand: genesisCommand,
    env: baseEnv,
    archiveRoot
  });
  summary.retryExhaustionTicketWorkflow =
    summary.terminalGapTicketWorkflow?.sourceStopKind === "retry_exhaustion"
      ? summary.terminalGapTicketWorkflow
      : null;
  summary.terminalGapTicketWorkflowExercise = await runTerminalGapTicketWorkflowExercise({
    workspace,
    installedCommand: genesisCommand,
    env: baseEnv,
    archiveRoot
  });
  summary.finalSdlcProofAssessment = finalSdlcProofAssessment(workspace);
  writeJson(path.join(archiveRoot, "run_summary.json"), summary);
  if (!summary.finalSdlcProofAssessment.clean) {
    throw new Error(
      `data_mapper live proof did not close cleanly: ${JSON.stringify(
        summary.finalSdlcProofAssessment,
        null,
        2
      )}`
    );
  }
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
