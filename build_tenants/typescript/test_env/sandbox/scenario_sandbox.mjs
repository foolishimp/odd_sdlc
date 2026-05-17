// Generic scenario sandbox harness.
//
// Takes a scenario descriptor and runs the six-step recipe established by the
// internal data_mapper induction lane:
//
//   1. mint run root under archiveRoot/<scenarioId>/<timestamp>_pid<pid>/
//   2. provision an ABG installed sandbox (provisionAbgInstalledSandbox)
//   3. assert ABG sandbox evidence
//   4. copy the scenario fixture into the workspace
//   5. install odd_sdlc TS into the workspace (installOddSdlcTypescript)
//   6. loop gaps -> start until a lawful stop, maxAdvances, or error
//
// A scenario descriptor is data. New app-building sandboxes plug in by
// authoring a descriptor and a fixture directory; no harness changes required.

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync
} from "node:fs";
import { spawnSync } from "node:child_process";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  installOddSdlcTypescript,
  invokeOddSdlcSpecMethodCommand
} from "../../build/semantic/code/src/index.js";
import {
  assertAbgInstalledSandboxEvidence,
  provisionAbgInstalledSandbox
} from "./abg_installed_workspace.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(HERE, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const DEFAULT_ABG_TYPESCRIPT_ROOT = resolve(
  REPO_ROOT,
  "../abiogenesis/build_tenants/abiogenesis/typescript"
);

const DEFAULT_STOP_STATUSES = Object.freeze([
  "converged",
  "fp_worker_unattached",
  "blocked",
  "yielded"
]);

const MULTI_ADVANCE_STOP_STATUSES = Object.freeze([
  "fp_worker_unattached",
  "blocked",
  "yielded"
]);

const EDGE_ASSURANCE_ARCHIVE_ARTIFACTS = Object.freeze([
  "handoff_manifest.json",
  "worker_construction_brief.json",
  "sdlc_edge_gain.json",
  "sdlc_edge_residual_pressure.json",
  "sdlc_edge_fulfillment_ledger.json",
  "sdlc_edge_closure_decision.json",
  "sdlc_next_action_projection.json"
]);

export function mintRunId() {
  return `${new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".", "")}_pid${process.pid}`;
}

export function assertFixtureFiles(fixtureRoot, sourceFiles) {
  for (const rel of sourceFiles) {
    const abs = path.join(fixtureRoot, rel);
    if (!existsSync(abs)) {
      throw new Error(`scenario fixture missing ${rel} at ${fixtureRoot}`);
    }
  }
}

export function copyFixture(fixtureRoot, targetRoot) {
  mkdirSync(targetRoot, { recursive: true });
  cpSync(fixtureRoot, targetRoot, { recursive: true });
  return targetRoot;
}

export function scenarioStartTargetForStep(scenario, step) {
  if (Array.isArray(scenario.startTargetSequence) && step < scenario.startTargetSequence.length) {
    return scenario.startTargetSequence[step];
  }
  return scenario.startTarget;
}

export function scenarioStartUntilForStep(scenario, step) {
  if (Array.isArray(scenario.startUntilSequence) && step < scenario.startUntilSequence.length) {
    return scenario.startUntilSequence[step];
  }
  return scenario.startUntil;
}

function buildStartArgs(workspace, scenario, step) {
  const args = ["start", "--workspace", workspace];
  if (scenario.liveWorker !== undefined && scenario.liveWorker !== null) {
    args.push("--worker", scenario.liveWorker);
  }
  const startTarget = scenarioStartTargetForStep(scenario, step);
  if (typeof startTarget === "string" && startTarget.length > 0) {
    args.push("--target", startTarget);
  }
  const startUntil = scenarioStartUntilForStep(scenario, step);
  if (typeof startUntil === "string" && startUntil.length > 0) {
    args.push("--until", startUntil);
  }
  return args;
}

function isStopStatus(status, stopStatuses) {
  return stopStatuses.includes(status);
}

function workspaceFilesExist(workspace, files) {
  if (!Array.isArray(files) || files.length === 0) return false;
  return files.every((rel) => existsSync(path.join(workspace, rel)));
}

function readJsonFile(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function readRequiredJsonFile(filePath, label) {
  if (!existsSync(filePath)) {
    throw new Error(`${label} missing at ${filePath}`);
  }
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label} is not valid JSON at ${filePath}: ${error.message}`);
  }
}

function archiveClosedCleanly(archiveRoot) {
  if (typeof archiveRoot !== "string" || archiveRoot.length === 0) {
    return false;
  }
  const closure = readJsonFile(
    path.join(archiveRoot, "sdlc_edge_closure_decision.json")
  );
  const fpEvaluate = readJsonFile(
    path.join(archiveRoot, "fp_evaluate_result.json")
  );
  return (
    closure?.disposition === "close" &&
    fpEvaluate?.status === "passed" &&
    fpEvaluate?.postflightStatus === "passed"
  );
}

export function scenarioWorkspaceFileStopSatisfied(input) {
  return (
    workspaceFilesExist(input.workspace, input.files) &&
    archiveClosedCleanly(input.archiveRoot)
  );
}

function operatorRunRoots(workspace) {
  const runsRoot = path.join(
    workspace,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  if (!existsSync(runsRoot)) return [];
  return readdirSync(runsRoot)
    .map((entry) => path.join(runsRoot, entry))
    .filter((entry) => {
      try {
        return statSync(entry).isDirectory();
      } catch {
        return false;
      }
    })
    .sort();
}

function observedHandoffEdgeSequence(workspace) {
  return operatorRunRoots(workspace)
    .flatMap((archiveRoot) => {
      const manifestPath = path.join(archiveRoot, "handoff_manifest.json");
      if (!existsSync(manifestPath)) return [];
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
        return typeof manifest.edgeName === "string" ? [manifest.edgeName] : [];
      } catch {
        return [];
      }
    });
}

function handoffArchiveGroups(workspace) {
  const groups = [];
  for (const archiveRoot of operatorRunRoots(workspace)) {
    const manifest = readJsonFile(path.join(archiveRoot, "handoff_manifest.json"));
    const edgeName = typeof manifest?.edgeName === "string" ? manifest.edgeName : null;
    if (edgeName === null) continue;
    const record = { archiveRoot, edgeName };
    const last = groups.at(-1);
    if (last?.edgeName === edgeName) {
      last.records.push(record);
    } else {
      groups.push({ edgeName, records: [record] });
    }
  }
  return groups;
}

function firstHandoffManifest(workspace) {
  for (const archiveRoot of operatorRunRoots(workspace)) {
    const manifest = readJsonFile(path.join(archiveRoot, "handoff_manifest.json"));
    if (typeof manifest?.edgeName === "string") {
      return manifest;
    }
  }
  return null;
}

function latestOperatorRunRoot(workspace) {
  const entries = operatorRunRoots(workspace);
  return entries.at(-1) ?? null;
}

function compressConsecutiveValues(values) {
  const compressed = [];
  for (const value of values) {
    if (compressed[compressed.length - 1] !== value) {
      compressed.push(value);
    }
  }
  return compressed;
}

function workspaceRelativePath(workspace, candidate) {
  if (typeof candidate !== "string" || candidate.length === 0) return null;
  let absolutePath = candidate;
  if (candidate.startsWith("file://")) {
    try {
      absolutePath = fileURLToPath(candidate);
    } catch {
      return null;
    }
  }
  if (!path.isAbsolute(absolutePath)) return null;
  const rel = path.relative(workspace, absolutePath);
  if (rel.length === 0 || rel.startsWith("..") || path.isAbsolute(rel)) {
    return null;
  }
  return rel.split(path.sep).join("/");
}

function materializedWorkspaceFilesFromArchive(workspace, archiveRoot) {
  const observed = new Set();
  const manifest = readJsonFile(
    path.join(archiveRoot, "product_materialization_manifest.json")
  );
  const selectedOutputRoot = manifest?.contract?.selectedOutputRoot;
  if (Array.isArray(manifest?.files)) {
    for (const file of manifest.files) {
      const fromAbsolute = workspaceRelativePath(workspace, file?.absolutePath);
      if (fromAbsolute !== null) {
        observed.add(fromAbsolute);
        continue;
      }
      if (
        typeof selectedOutputRoot === "string" &&
        typeof file?.relativePath === "string"
      ) {
        observed.add(
          path.posix.join(selectedOutputRoot, file.relativePath)
        );
      }
    }
  }

  const ledger = readJsonFile(
    path.join(archiveRoot, "sdlc_edge_fulfillment_ledger.json")
  );
  if (Array.isArray(ledger?.materializationRefs)) {
    for (const ref of ledger.materializationRefs) {
      const rel = workspaceRelativePath(workspace, ref);
      if (rel !== null) observed.add(rel);
    }
  }
  return observed;
}

function materializedWorkspaceFiles(workspace) {
  const observed = new Set();
  for (const archiveRoot of operatorRunRoots(workspace)) {
    for (const rel of materializedWorkspaceFilesFromArchive(
      workspace,
      archiveRoot
    )) {
      observed.add(rel);
    }
  }
  return observed;
}

function archiveHasArtifacts(archiveRoot, artifacts) {
  return artifacts.every((rel) => existsSync(path.join(archiveRoot, rel)));
}

function selectedEdgeAssuranceArchive(records) {
  const complete = records.filter((record) =>
    archiveHasArtifacts(record.archiveRoot, EDGE_ASSURANCE_ARCHIVE_ARTIFACTS)
  );
  const closed = complete.filter((record) => {
    const closure = readJsonFile(
      path.join(record.archiveRoot, "sdlc_edge_closure_decision.json")
    );
    return closure?.disposition === "close";
  });
  return closed.at(-1) ?? complete.at(-1) ?? records.at(-1) ?? null;
}

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

function assertArrayEquals(observed, expected, label) {
  if (!Array.isArray(observed) || !Array.isArray(expected)) {
    throw new Error(`${label} must compare arrays`);
  }
  if (JSON.stringify(observed) !== JSON.stringify(expected)) {
    throw new Error(
      `${label} mismatch — expected ${JSON.stringify(expected)}, saw ${JSON.stringify(observed)}`
    );
  }
}

function assertEdgeAssuranceArchive(scenarioId, edgeName, archiveRoot) {
  for (const rel of EDGE_ASSURANCE_ARCHIVE_ARTIFACTS) {
    const abs = path.join(archiveRoot, rel);
    if (!existsSync(abs)) {
      throw new Error(
        `${scenarioId}: edge ${edgeName} assurance archive missing ${rel} at ${archiveRoot}`
      );
    }
  }

  const manifest = readRequiredJsonFile(
    path.join(archiveRoot, "handoff_manifest.json"),
    `${scenarioId}: edge ${edgeName} handoff manifest`
  );
  const gain = readRequiredJsonFile(
    path.join(archiveRoot, "sdlc_edge_gain.json"),
    `${scenarioId}: edge ${edgeName} gain`
  );
  const residualPressure = readRequiredJsonFile(
    path.join(archiveRoot, "sdlc_edge_residual_pressure.json"),
    `${scenarioId}: edge ${edgeName} residual pressure`
  );
  const ledger = readRequiredJsonFile(
    path.join(archiveRoot, "sdlc_edge_fulfillment_ledger.json"),
    `${scenarioId}: edge ${edgeName} fulfillment ledger`
  );
  const closureDecision = readRequiredJsonFile(
    path.join(archiveRoot, "sdlc_edge_closure_decision.json"),
    `${scenarioId}: edge ${edgeName} closure decision`
  );
  const nextAction = readRequiredJsonFile(
    path.join(archiveRoot, "sdlc_next_action_projection.json"),
    `${scenarioId}: edge ${edgeName} next action projection`
  );

  if (manifest.edgeName !== edgeName) {
    throw new Error(
      `${scenarioId}: edge assurance archive ${archiveRoot} has manifest edge ${manifest.edgeName}, expected ${edgeName}`
    );
  }
  const contractRef = assertNonEmptyString(
    gain.contractRef,
    `${scenarioId}: edge ${edgeName} gain.contractRef`
  );
  const contractDigest = assertNonEmptyString(
    gain.contractDigest,
    `${scenarioId}: edge ${edgeName} gain.contractDigest`
  );
  const edgeGainRef = assertNonEmptyString(
    gain.gainRef,
    `${scenarioId}: edge ${edgeName} gain.gainRef`
  );
  if (manifest.edgeAssuranceContractRef !== contractRef) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} manifest contract ref ${manifest.edgeAssuranceContractRef}, expected ${contractRef}`
    );
  }
  if (manifest.edgeAssuranceContractDigest !== contractDigest) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} manifest contract digest ${manifest.edgeAssuranceContractDigest}, expected ${contractDigest}`
    );
  }
  if (residualPressure.contractRef !== contractRef) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} residual pressure contract ref ${residualPressure.contractRef}, expected ${contractRef}`
    );
  }
  if (residualPressure.contractDigest !== contractDigest) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} residual pressure contract digest ${residualPressure.contractDigest}, expected ${contractDigest}`
    );
  }
  if (ledger.edgeAssuranceContractRef !== contractRef) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} ledger contract ref ${ledger.edgeAssuranceContractRef}, expected ${contractRef}`
    );
  }
  if (ledger.edgeAssuranceContractDigest !== contractDigest) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} ledger contract digest ${ledger.edgeAssuranceContractDigest}, expected ${contractDigest}`
    );
  }
  if (ledger.edgeGainRef !== edgeGainRef) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} ledger gain ref ${ledger.edgeGainRef}, expected ${edgeGainRef}`
    );
  }
  assertArrayEquals(
    ledger.edgeResidualPressureRefs,
    residualPressure.requiredPressureRefs,
    `${scenarioId}: edge ${edgeName} ledger residual pressure refs`
  );
  if (closureDecision.disposition !== "close") {
    throw new Error(
      `${scenarioId}: edge ${edgeName} closure disposition ${closureDecision.disposition}, expected close`
    );
  }
  if (closureDecision.edgeGainRef !== edgeGainRef) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} closure gain ref ${closureDecision.edgeGainRef}, expected ${edgeGainRef}`
    );
  }
  assertNonEmptyString(
    closureDecision.edgeAssuranceDecisionRef,
    `${scenarioId}: edge ${edgeName} closure edgeAssuranceDecisionRef`
  );
  if (nextAction.edgeAssuranceContractRef !== contractRef) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} next action contract ref ${nextAction.edgeAssuranceContractRef}, expected ${contractRef}`
    );
  }
  if (nextAction.edgeGainRef !== edgeGainRef) {
    throw new Error(
      `${scenarioId}: edge ${edgeName} next action gain ref ${nextAction.edgeGainRef}, expected ${edgeGainRef}`
    );
  }
  assertArrayEquals(
    nextAction.edgeResidualPressureRefs,
    residualPressure.requiredPressureRefs,
    `${scenarioId}: edge ${edgeName} next action residual pressure refs`
  );
}

function assertEdgeAssuranceArchiveSequencePrefix(result, expected) {
  const groups = handoffArchiveGroups(result.workspace);
  if (groups.length < expected.length) {
    throw new Error(
      `${result.scenarioId}: edge assurance archive sequence too short — expected prefix ${expected.join(" -> ")}, saw ${groups.map((group) => group.edgeName).join(" -> ")}`
    );
  }
  expected.forEach((edgeName, index) => {
    const group = groups[index];
    if (group?.edgeName !== edgeName) {
      throw new Error(
        `${result.scenarioId}: edge assurance archive sequence mismatch at ${index} — expected ${edgeName}, saw ${group?.edgeName}; observed=${groups.map((entry) => entry.edgeName).join(" -> ")}`
      );
    }
    const selected = selectedEdgeAssuranceArchive(group.records);
    if (selected === null) {
      throw new Error(
        `${result.scenarioId}: edge ${edgeName} has no operator archive record`
      );
    }
    assertEdgeAssuranceArchive(result.scenarioId, edgeName, selected.archiveRoot);
  });
}

function assertProcessStdoutJson(input) {
  const expectation = input.check.stdoutJson;
  if (expectation === undefined || expectation === null) return;
  let parsed;
  try {
    parsed = JSON.parse(input.stdout);
  } catch (error) {
    throw new Error(
      `${input.scenarioId}: process check ${input.command} stdout was not JSON: ${error.message}`
    );
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(
      `${input.scenarioId}: process check ${input.command} stdout JSON must be an object`
    );
  }
  if (Array.isArray(expectation.hasKeys)) {
    for (const key of expectation.hasKeys) {
      if (typeof key !== "string" || !Object.hasOwn(parsed, key)) {
        throw new Error(
          `${input.scenarioId}: process check ${input.command} stdout JSON missing key ${key}`
        );
      }
    }
  }
  if (expectation.equals !== null && typeof expectation.equals === "object") {
    for (const [key, expected] of Object.entries(expectation.equals)) {
      const observed = parsed[key];
      if (JSON.stringify(observed) !== JSON.stringify(expected)) {
        throw new Error(
          `${input.scenarioId}: process check ${input.command} stdout JSON field ${key} ${JSON.stringify(observed)}, expected ${JSON.stringify(expected)}`
        );
      }
    }
  }
  if (
    expectation.arrayIncludes !== null &&
    typeof expectation.arrayIncludes === "object"
  ) {
    for (const [key, expectedValues] of Object.entries(expectation.arrayIncludes)) {
      const observed = parsed[key];
      if (!Array.isArray(observed) || !Array.isArray(expectedValues)) {
        throw new Error(
          `${input.scenarioId}: process check ${input.command} stdout JSON field ${key} must be an array`
        );
      }
      for (const expected of expectedValues) {
        if (!observed.includes(expected)) {
          throw new Error(
            `${input.scenarioId}: process check ${input.command} stdout JSON field ${key} missing ${JSON.stringify(expected)}`
          );
        }
      }
    }
  }
  if (
    expectation.arrayEquals !== null &&
    typeof expectation.arrayEquals === "object"
  ) {
    for (const [key, expectedValues] of Object.entries(expectation.arrayEquals)) {
      const observed = parsed[key];
      if (!Array.isArray(observed) || !Array.isArray(expectedValues)) {
        throw new Error(
          `${input.scenarioId}: process check ${input.command} stdout JSON field ${key} must be an array`
        );
      }
      if (JSON.stringify(observed) !== JSON.stringify(expectedValues)) {
        throw new Error(
          `${input.scenarioId}: process check ${input.command} stdout JSON field ${key} ${JSON.stringify(observed)}, expected ${JSON.stringify(expectedValues)}`
        );
      }
    }
  }
  if (
    expectation.arrayMembers !== null &&
    typeof expectation.arrayMembers === "object"
  ) {
    for (const [key, expectedValues] of Object.entries(expectation.arrayMembers)) {
      const observed = parsed[key];
      if (!Array.isArray(observed) || !Array.isArray(expectedValues)) {
        throw new Error(
          `${input.scenarioId}: process check ${input.command} stdout JSON field ${key} must be an array`
        );
      }
      const missing = expectedValues.filter(
        (expected) => !observed.includes(expected)
      );
      const extra = observed.filter((value) => !expectedValues.includes(value));
      if (missing.length > 0 || extra.length > 0) {
        throw new Error(
          `${input.scenarioId}: process check ${input.command} stdout JSON field ${key} members ${JSON.stringify(observed)}, expected ${JSON.stringify(expectedValues)}`
        );
      }
    }
  }
}

export async function runScenarioSandbox(scenario, options = {}) {
  if (scenario === null || typeof scenario !== "object") {
    throw new Error("scenario descriptor is required");
  }
  if (typeof scenario.scenarioId !== "string" || scenario.scenarioId.length === 0) {
    throw new Error("scenario.scenarioId is required");
  }
  if (scenario.fixture === undefined || typeof scenario.fixture.root !== "string") {
    throw new Error("scenario.fixture.root is required");
  }

  const archiveRoot = options.archiveRoot ?? resolve(
    PACKAGE_ROOT,
    `test_env/test_runs/${scenario.scenarioId}`
  );
  const abgPackageSourceRoot = options.abgPackageSourceRoot ?? DEFAULT_ABG_TYPESCRIPT_ROOT;
  const packageSourceRoot = options.packageSourceRoot ?? PACKAGE_ROOT;
  const maxAdvances = scenario.maxAdvances ?? 1;
  const continueOnEdgeConverge = scenario.continueOnEdgeConverge === true;
  const defaultStopStatuses = continueOnEdgeConverge
    ? MULTI_ADVANCE_STOP_STATUSES
    : DEFAULT_STOP_STATUSES;
  const stopStatuses = scenario.stopOnLawful ?? defaultStopStatuses;

  mkdirSync(archiveRoot, { recursive: true });
  const runRoot = path.join(archiveRoot, mintRunId());
  const workspace = path.join(runRoot, "workspace");

  assertFixtureFiles(scenario.fixture.root, scenario.fixture.sourceFiles ?? []);

  const installedWorkspace = await provisionAbgInstalledSandbox({
    archiveRoot: runRoot,
    scenarioId: scenario.scenarioId
  });
  assertAbgInstalledSandboxEvidence(installedWorkspace);

  copyFixture(scenario.fixture.root, workspace);

  const install = await installOddSdlcTypescript({
    targetRoot: workspace,
    packageSourceRoot,
    abgPackageSourceRoot,
    installedPackageName: scenario.installedPackageName ?? `odd-sdlc-${scenario.scenarioId}`
  });
  if (install.kind !== "installed") {
    throw new Error(`odd_sdlc install did not complete: ${JSON.stringify(install)}`);
  }

  const advances = [];
  let lastStatus = null;
  let lastGapsEdge = null;
  let consecutiveSameEdgeAfterConverge = 0;
  let noProgressReason = null;
  const expectCommandFailure = scenario.expectCommandFailure === true;
  for (let step = 0; step < maxAdvances; step += 1) {
    const gaps = await invokeOddSdlcSpecMethodCommand([
      "gaps",
      "--workspace",
      workspace
    ]);
    if (gaps.status !== "ok" && !expectCommandFailure) {
      throw new Error(
        `${scenario.scenarioId}: gaps command failed at step ${step}: ${JSON.stringify(gaps)}`
      );
    }
    const currentGapsEdge =
      gaps?.payload?.start?.executionContract?.targetGraphFunction ?? null;
    if (
      continueOnEdgeConverge &&
      lastGapsEdge !== null &&
      currentGapsEdge !== null &&
      currentGapsEdge === lastGapsEdge &&
      lastStatus === "converged"
    ) {
      consecutiveSameEdgeAfterConverge += 1;
      if (consecutiveSameEdgeAfterConverge >= 2) {
        noProgressReason = `same_edge_after_converge_twice:${currentGapsEdge}`;
        break;
      }
    } else {
      consecutiveSameEdgeAfterConverge = 0;
    }
    const start = await invokeOddSdlcSpecMethodCommand(buildStartArgs(workspace, scenario, step));
    advances.push({ step, gaps, start });
    lastStatus = start?.payload?.status ?? null;
    lastGapsEdge = currentGapsEdge;
    if (start.status !== "ok") {
      if (expectCommandFailure) break;
      throw new Error(
        `${scenario.scenarioId}: start command failed at step ${step}: ${JSON.stringify(start)}`
      );
    }
    if (
      scenario.stopAfterWorkspaceFilesExist === true &&
      scenarioWorkspaceFileStopSatisfied({
        workspace,
        files: scenario.expectations?.workspaceFiles,
        archiveRoot: start?.payload?.archiveRoot
      })
    ) {
      break;
    }
    if (isStopStatus(lastStatus, stopStatuses)) break;
  }

  return {
    scenarioId: scenario.scenarioId,
    runRoot,
    workspace,
    installedWorkspace,
    install,
    advances,
    lastStatus,
    noProgressReason
  };
}

function findRequirementIds(workspace) {
  const requirementsRoot = path.join(workspace, "specification/requirements");
  if (!existsSync(requirementsRoot)) return [];
  return readdirSync(requirementsRoot)
    .filter((entry) => entry.endsWith(".md") && entry !== "00-imported-sources.md")
    .sort()
    .flatMap((entry) => {
      const content = readFileSync(path.join(requirementsRoot, entry), "utf8");
      return [...content.matchAll(/\b(REQ-[A-Z0-9-]+)\b/gmu)].map((m) => m[1]);
    });
}

export function assertScenarioExpectations(result, scenario) {
  const expectations = scenario.expectations ?? {};
  const firstAdvance = result.advances[0];
  if (firstAdvance === undefined) {
    throw new Error(`${scenario.scenarioId}: no advances were attempted`);
  }
  const firstGapsPayload = firstAdvance.gaps?.payload;
  const firstStartPayload = firstAdvance.start?.payload;
  const firstStartExecutionContract =
    firstStartPayload?.executionContract ??
    firstStartPayload?.start?.executionContract;

  if (expectations.firstEdge !== undefined) {
    const target = firstGapsPayload?.start?.executionContract?.targetGraphFunction;
    if (target !== expectations.firstEdge) {
      throw new Error(
        `${scenario.scenarioId}: first edge mismatch — expected ${expectations.firstEdge}, saw ${target}`
      );
    }
  }
  if (expectations.firstStartStatus !== undefined) {
    const status = firstStartPayload?.status;
    if (status !== expectations.firstStartStatus) {
      throw new Error(
        `${scenario.scenarioId}: first start status mismatch — expected ${expectations.firstStartStatus}, saw ${status}`
      );
    }
  }
  if (expectations.firstStartTargetGraphFunction !== undefined) {
    const target = firstStartExecutionContract?.targetGraphFunction;
    if (target !== expectations.firstStartTargetGraphFunction) {
      throw new Error(
        `${scenario.scenarioId}: first start target mismatch — expected ${expectations.firstStartTargetGraphFunction}, saw ${target}`
      );
    }
  }
  if (expectations.firstStartOverlayRef !== undefined) {
    const overlayRef = firstStartExecutionContract?.overlayRef;
    if (overlayRef !== expectations.firstStartOverlayRef) {
      throw new Error(
        `${scenario.scenarioId}: first start overlay mismatch — expected ${expectations.firstStartOverlayRef}, saw ${overlayRef}`
      );
    }
  }
  if (Array.isArray(expectations.firstEventKinds)) {
    const observed = firstStartPayload?.emittedRuntimeEventKinds ?? [];
    for (const kind of expectations.firstEventKinds) {
      if (!observed.includes(kind)) {
        throw new Error(
          `${scenario.scenarioId}: first start missing emitted event kind ${kind}`
        );
      }
    }
  }
  if (Array.isArray(expectations.requirementIds) && expectations.requirementIds.length > 0) {
    const observed = findRequirementIds(result.workspace);
    for (const id of expectations.requirementIds) {
      if (!observed.includes(id)) {
        throw new Error(
          `${scenario.scenarioId}: requirement ${id} not lifted into families`
        );
      }
    }
  }
  if (Array.isArray(expectations.workspaceFiles)) {
    for (const rel of expectations.workspaceFiles) {
      const abs = path.join(result.workspace, rel);
      if (!existsSync(abs)) {
        throw new Error(`${scenario.scenarioId}: expected workspace file ${rel} missing`);
      }
    }
  }
  if (Array.isArray(expectations.materializationEvidenceWorkspaceFiles)) {
    const observed = materializedWorkspaceFiles(result.workspace);
    for (const rel of expectations.materializationEvidenceWorkspaceFiles) {
      if (!observed.has(rel)) {
        throw new Error(
          `${scenario.scenarioId}: expected workspace file ${rel} has no materialization ledger evidence`
        );
      }
    }
  }
  if (Array.isArray(expectations.handoffEdgeSequencePrefix)) {
    const observed = compressConsecutiveValues(
      observedHandoffEdgeSequence(result.workspace)
    );
    const expected = expectations.handoffEdgeSequencePrefix;
    if (observed.length < expected.length) {
      throw new Error(
        `${scenario.scenarioId}: strict handoff edge sequence too short — expected prefix ${expected.join(" -> ")}, saw ${observed.join(" -> ")}`
      );
    }
    expected.forEach((edge, index) => {
      if (observed[index] !== edge) {
        throw new Error(
          `${scenario.scenarioId}: strict handoff edge sequence mismatch at ${index} — expected ${edge}, saw ${observed[index]}; observed=${observed.join(" -> ")}`
        );
      }
    });
  }
  if (expectations.firstHandoffOverlayRef !== undefined) {
    const manifest = firstHandoffManifest(result.workspace);
    const overlayRef = manifest?.overlayRef;
    if (overlayRef !== expectations.firstHandoffOverlayRef) {
      throw new Error(
        `${scenario.scenarioId}: first handoff overlay mismatch — expected ${expectations.firstHandoffOverlayRef}, saw ${overlayRef}`
      );
    }
  }
  if (Array.isArray(expectations.edgeAssuranceArchiveSequencePrefix)) {
    assertEdgeAssuranceArchiveSequencePrefix(
      result,
      expectations.edgeAssuranceArchiveSequencePrefix
    );
  }
  if (Array.isArray(expectations.processChecks)) {
    for (const check of expectations.processChecks) {
      const command = check?.command;
      if (typeof command !== "string" || command.length === 0) {
        throw new Error(`${scenario.scenarioId}: process check missing command`);
      }
      const args = Array.isArray(check.args) ? check.args : [];
      const cwd = path.join(
        result.workspace,
        typeof check.cwd === "string" ? check.cwd : "."
      );
      const executed = spawnSync(command, args, {
        cwd,
        encoding: "utf8"
      });
      if (executed.error !== undefined) {
        throw new Error(
          `${scenario.scenarioId}: process check ${command} failed to start: ${executed.error.message}`
        );
      }
      const expectedExitCode =
        typeof check.exitCode === "number" ? check.exitCode : 0;
      if (executed.status !== expectedExitCode) {
        throw new Error(
          `${scenario.scenarioId}: process check ${command} exit ${executed.status}, expected ${expectedExitCode}; stderr=${executed.stderr}`
        );
      }
      if (typeof check.stdout === "string") {
        const stdout = executed.stdout.trim();
        if (stdout !== check.stdout) {
          throw new Error(
            `${scenario.scenarioId}: process check ${command} stdout ${JSON.stringify(stdout)}, expected ${JSON.stringify(check.stdout)}`
          );
        }
      }
      assertProcessStdoutJson({
        scenarioId: scenario.scenarioId,
        command,
        check,
        stdout: executed.stdout.trim()
      });
    }
  }
  if (expectations.terminalStatus !== undefined) {
    if (result.lastStatus !== expectations.terminalStatus) {
      throw new Error(
        `${scenario.scenarioId}: terminal status mismatch — expected ${expectations.terminalStatus}, saw ${result.lastStatus}`
      );
    }
  }
  if (Array.isArray(expectations.archiveArtifacts)) {
    const archiveRoot = firstStartPayload?.archiveRoot;
    if (typeof archiveRoot !== "string") {
      throw new Error(`${scenario.scenarioId}: no archiveRoot in first start payload`);
    }
    for (const rel of expectations.archiveArtifacts) {
      const abs = path.join(archiveRoot, rel);
      if (!existsSync(abs)) {
        throw new Error(`${scenario.scenarioId}: expected archive artifact ${rel} missing`);
      }
    }
  }
  if (Array.isArray(expectations.latestArchiveArtifacts)) {
    const archiveRoot = latestOperatorRunRoot(result.workspace);
    if (archiveRoot === null) {
      throw new Error(`${scenario.scenarioId}: no operator archive root observed`);
    }
    for (const rel of expectations.latestArchiveArtifacts) {
      const abs = path.join(archiveRoot, rel);
      if (!existsSync(abs)) {
        throw new Error(`${scenario.scenarioId}: expected latest archive artifact ${rel} missing`);
      }
    }
  }
}
