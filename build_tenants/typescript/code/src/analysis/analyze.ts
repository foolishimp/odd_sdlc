// Implements: T-161

import path from "node:path";

import {
  fileRef,
  operatorRunRef,
  resolveSdlcFdRunAnalysisRoot,
  type SdlcFdRunAnalysisResolvedRoot
} from "./archive_reader.js";
import { readOperatorRunCarriers, type OperatorRunCarriers } from "./carrier_loaders.js";
import {
  aggregateOperatorRunBytes,
  computeWallClockMs,
  deriveEdgeAttempt
} from "./edge_attempts.js";
import { deriveActiveRunLiveness } from "./liveness.js";
import { deriveRuntimeArtifactGaps } from "./runtime_gaps.js";
import { scanProductLineage } from "./requirement_lineage.js";
import { deriveBloatAndSlope } from "./bloat_slope.js";
import { deriveRetryForensics } from "./retry_forensics.js";
import { deriveSummaryDrift } from "./summary_drift.js";
import { buildDiagnostics, type DiagnosticDraft } from "./diagnostics.js";
import { resolveSdlcFdRunAnalysisProfile } from "./profiles.js";
import type {
  SdlcFdRunAnalysisCurrentStateTelemetry,
  SdlcFdRunAnalysisEdgeAttempt,
  SdlcFdRunAnalysisProfile,
  SdlcFdRunAnalysisResult
} from "./types.js";
import {
  SDLC_FD_RUN_ANALYSIS_KIND,
  SDLC_FD_RUN_ANALYSIS_VERSION
} from "./types.js";

export interface SdlcFdRunAnalysisOptions {
  readonly inspectedRoot: string;
  readonly profile?: SdlcFdRunAnalysisProfile;
  readonly nowMs?: number;
}

function scenarioNameFromRoot(resolved: SdlcFdRunAnalysisResolvedRoot): string | null {
  if (resolved.scenarioRunRoot !== null) {
    return path.basename(path.dirname(resolved.scenarioRunRoot));
  }
  if (resolved.inspectedKind === "workspace" && resolved.workspaceRoot !== null) {
    return path.basename(resolved.workspaceRoot);
  }
  return null;
}

function evidenceIndexFromCarriers(
  carriers: readonly OperatorRunCarriers[]
): readonly string[] {
  const out: string[] = [];
  for (const carrier of carriers) {
    out.push(operatorRunRef(carrier.operatorRunRoot));
    for (const filename of [
      "operator_summary.json",
      "worker_run.json",
      "postflight.json",
      "sdlc_edge_closure_decision.json",
      "product_materialization_manifest.json"
    ]) {
      out.push(fileRef(path.join(carrier.operatorRunRoot, filename)));
    }
  }
  return Object.freeze(out);
}

function finalClosureDispositionFromAttempts(
  attempts: readonly SdlcFdRunAnalysisEdgeAttempt[]
): string | null {
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    const candidate = attempts[index]?.closureDisposition;
    if (typeof candidate === "string") {
      return candidate;
    }
  }
  return null;
}

function countAttemptsByDisposition(
  attempts: readonly SdlcFdRunAnalysisEdgeAttempt[]
): {
  readonly sameEdgeRetryCount: number;
  readonly blockedAttemptCount: number;
  readonly repairAttemptCount: number;
  readonly yieldedAttemptCount: number;
  readonly abortedAttemptCount: number;
  readonly retryAndRepairCount: number;
} {
  let sameEdgeRetryCount = 0;
  let blockedAttemptCount = 0;
  let repairAttemptCount = 0;
  let yieldedAttemptCount = 0;
  let abortedAttemptCount = 0;
  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];
    if (attempt === undefined) {
      continue;
    }
    const isBlockedPostflight = attempt.postflightStatus === "blocked";
    switch (attempt.closureDisposition) {
      case "retry":
        sameEdgeRetryCount += 1;
        break;
      case "repair":
        repairAttemptCount += 1;
        break;
      case "yield":
        yieldedAttemptCount += 1;
        break;
      case "block":
        blockedAttemptCount += 1;
        break;
      case null:
      case undefined:
        if (attempt.postflightStatus === null) {
          abortedAttemptCount += 1;
        }
        break;
      default:
        break;
    }
    if (isBlockedPostflight && attempt.closureDisposition !== "block") {
      blockedAttemptCount += 1;
    }
  }
  return Object.freeze({
    sameEdgeRetryCount,
    blockedAttemptCount,
    repairAttemptCount,
    yieldedAttemptCount,
    abortedAttemptCount,
    retryAndRepairCount: sameEdgeRetryCount + repairAttemptCount
  });
}

function totalWorkerElapsedMsFromAttempts(
  attempts: readonly SdlcFdRunAnalysisEdgeAttempt[]
): number {
  let total = 0;
  for (const attempt of attempts) {
    if (typeof attempt.workerElapsedMs === "number" && attempt.workerElapsedMs > 0) {
      total += attempt.workerElapsedMs;
    }
  }
  return total;
}

function uniqueGraphEdgeSequence(
  attempts: readonly SdlcFdRunAnalysisEdgeAttempt[]
): readonly string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const attempt of attempts) {
    const name = attempt.graphFunctionName;
    if (typeof name === "string" && name.length > 0 && !seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return Object.freeze(out);
}

function aggregateProductFileCount(
  carriers: readonly OperatorRunCarriers[]
): number {
  const seen = new Set<string>();
  for (const carrier of carriers) {
    if (carrier.productManifest.status !== "present") {
      continue;
    }
    for (const file of carrier.productManifest.data.files ?? []) {
      if (typeof file.relativePath === "string") {
        seen.add(file.relativePath);
      }
    }
  }
  return seen.size;
}

function maxRequirementObligationCount(
  attempts: readonly SdlcFdRunAnalysisEdgeAttempt[]
): number {
  let max = 0;
  for (const attempt of attempts) {
    if (typeof attempt.requirementObligationCount === "number" && attempt.requirementObligationCount > max) {
      max = attempt.requirementObligationCount;
    }
  }
  return max;
}

export function analyzeSdlcFdRunArchive(
  options: SdlcFdRunAnalysisOptions
): SdlcFdRunAnalysisResult {
  const resolved = resolveSdlcFdRunAnalysisRoot(options.inspectedRoot);
  const profile: SdlcFdRunAnalysisProfile = options.profile ?? "generic";
  const profileSpec = resolveSdlcFdRunAnalysisProfile(profile);
  const nowMs = options.nowMs ?? Date.now();
  const operatorRunRootsOrdered = Object.freeze(
    [...resolved.operatorRunRoots].reverse()
  );
  const carriers: OperatorRunCarriers[] = operatorRunRootsOrdered.map((root) =>
    readOperatorRunCarriers(root)
  );
  const attempts: SdlcFdRunAnalysisEdgeAttempt[] = carriers.map((carrier, index) =>
    deriveEdgeAttempt(carrier, index)
  );
  const archiveBytes = aggregateOperatorRunBytes(operatorRunRootsOrdered);
  const totals = countAttemptsByDisposition(attempts);
  const totalWorkerElapsedMs = totalWorkerElapsedMsFromAttempts(attempts);
  const totalWallClockMs = computeWallClockMs(operatorRunRootsOrdered);
  const unattributedElapsedMs =
    totalWallClockMs === null ? null : Math.max(0, totalWallClockMs - totalWorkerElapsedMs);
  const lineageOutcome = scanProductLineage({
    carriers,
    forbidRawDisplayIds: profileSpec.forbidRawDisplayIdRequirementTagsInProductFiles
  });
  const runtimeGaps = deriveRuntimeArtifactGaps({ carriers });
  const livenessCarrier = carriers[carriers.length - 1] ?? null;
  const livenessOutcome = deriveActiveRunLiveness({
    carriers: livenessCarrier,
    thresholds: profileSpec.thresholds,
    nowMs
  });
  const retry = deriveRetryForensics({ carriers, attempts });
  const requirementObligationCount = maxRequirementObligationCount(attempts);
  const productFileCount = aggregateProductFileCount(carriers);
  const bloat = deriveBloatAndSlope({
    carriers,
    attempts,
    archiveBytes,
    retryCount: totals.retryAndRepairCount,
    productFileCount,
    componentCount: 0,
    requirementObligationCount,
    lineage: lineageOutcome.scan,
    thresholds: profileSpec.thresholds
  });
  const summaryDrift = deriveSummaryDrift({ carriers, attempts });
  const allDiagnosticDrafts: readonly DiagnosticDraft[] = Object.freeze([
    ...runtimeGaps.diagnostics,
    ...lineageOutcome.diagnostics,
    ...retry.diagnostics,
    ...bloat.diagnostics,
    ...summaryDrift.diagnostics,
    ...livenessOutcome.diagnostics,
    ...maybeEdgeSequenceIncomplete({ resolved, carriers, attempts })
  ]);
  const diagnostics = buildDiagnostics(
    allDiagnosticDrafts,
    profileSpec.policy.policyStatus
  );
  const telemetry: SdlcFdRunAnalysisCurrentStateTelemetry = Object.freeze({
    inspectedRoot: resolved.inspectedRoot,
    inspectedKind: resolved.inspectedKind,
    scenarioName: scenarioNameFromRoot(resolved),
    profile,
    operatorRunCount: operatorRunRootsOrdered.length,
    graphEdgeSequence: uniqueGraphEdgeSequence(attempts),
    sameEdgeRetryCount: totals.sameEdgeRetryCount,
    blockedAttemptCount: totals.blockedAttemptCount,
    repairAttemptCount: totals.repairAttemptCount,
    yieldedAttemptCount: totals.yieldedAttemptCount,
    abortedAttemptCount: totals.abortedAttemptCount,
    finalClosureDisposition: finalClosureDispositionFromAttempts(attempts),
    totalWallClockMs,
    totalWorkerElapsedMs,
    unattributedElapsedMs,
    archiveBytes,
    productFileCount,
    requirementObligationCount,
    productFileLineageCount: lineageOutcome.scan.canonicalRequirementIdCount
  });
  return Object.freeze({
    kind: SDLC_FD_RUN_ANALYSIS_KIND,
    version: SDLC_FD_RUN_ANALYSIS_VERSION,
    inspectedRoot: resolved.inspectedRoot,
    inspectedKind: resolved.inspectedKind,
    profile,
    profilePolicyRef: profileSpec.policy.profilePolicyRef,
    thresholdPolicyRef: profileSpec.policy.thresholdPolicyRef,
    policyStatus: profileSpec.policy.policyStatus,
    readOnly: true as const,
    currentStateTelemetrySummary: telemetry,
    edgeTraversal: Object.freeze(attempts),
    activeRunLiveness: livenessOutcome.liveness,
    runtimeArtifactGaps: runtimeGaps.gaps,
    diagnostics,
    bloatAndSlopeAnalysis: bloat.bloat,
    retryForensics: retry.forensics,
    summaryDrift: summaryDrift.report,
    evidenceIndex: evidenceIndexFromCarriers(carriers)
  });
}

function maybeEdgeSequenceIncomplete(input: {
  readonly resolved: SdlcFdRunAnalysisResolvedRoot;
  readonly carriers: readonly OperatorRunCarriers[];
  readonly attempts: readonly SdlcFdRunAnalysisEdgeAttempt[];
}): readonly DiagnosticDraft[] {
  if (input.attempts.length === 0) {
    return Object.freeze([]);
  }
  const lastAttempt = input.attempts[input.attempts.length - 1];
  if (lastAttempt === undefined) {
    return Object.freeze([]);
  }
  if (
    lastAttempt.closureDisposition !== null ||
    lastAttempt.postflightStatus === "passed"
  ) {
    return Object.freeze([]);
  }
  const lastCarrier = input.carriers[input.carriers.length - 1];
  if (lastCarrier === undefined) {
    return Object.freeze([]);
  }
  return Object.freeze([
    {
      code: "edge_sequence_incomplete" as const,
      severity: "warn" as const,
      detail: `final operator-run ${path.basename(lastCarrier.operatorRunRoot)} has no closure decision`,
      evidenceRefs: Object.freeze([operatorRunRef(lastCarrier.operatorRunRoot)]),
      operatorRunRef: operatorRunRef(lastCarrier.operatorRunRoot),
      edgeName: lastAttempt.graphFunctionName
    }
  ]);
}
