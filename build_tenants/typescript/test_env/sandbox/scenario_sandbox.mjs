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

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
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

function buildStartArgs(workspace, scenario) {
  const args = ["start", "--workspace", workspace];
  if (scenario.liveWorker !== undefined && scenario.liveWorker !== null) {
    args.push("--worker", scenario.liveWorker);
  }
  if (scenario.startTarget !== undefined) {
    args.push("--target", scenario.startTarget);
  }
  if (scenario.startUntil !== undefined) {
    args.push("--until", scenario.startUntil);
  }
  return args;
}

function isStopStatus(status, stopStatuses) {
  return stopStatuses.includes(status);
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
    const start = await invokeOddSdlcSpecMethodCommand(buildStartArgs(workspace, scenario));
    advances.push({ step, gaps, start });
    lastStatus = start?.payload?.status ?? null;
    lastGapsEdge = currentGapsEdge;
    if (start.status !== "ok") {
      if (expectCommandFailure) break;
      throw new Error(
        `${scenario.scenarioId}: start command failed at step ${step}: ${JSON.stringify(start)}`
      );
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
      return [...content.matchAll(/^## (REQ-[A-Z0-9-]+)/gmu)].map((m) => m[1]);
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
}
