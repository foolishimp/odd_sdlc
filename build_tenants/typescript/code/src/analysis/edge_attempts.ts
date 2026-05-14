// Implements: T-161

import path from "node:path";

import {
  dirMtimeMsOrNull,
  operatorRunRef,
  walkDirectoryFiles,
  type SdlcFdRunAnalysisFileInfo
} from "./archive_reader.js";
import type {
  OperatorRunCarriers,
  PostflightRecord,
  ProductMaterializationFileRecord,
  WorkerResultReportRecord
} from "./carrier_loaders.js";
import type {
  SdlcFdRunAnalysisByteAccount,
  SdlcFdRunAnalysisEdgeAttempt
} from "./types.js";

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringField(
  record: Readonly<Record<string, unknown>>,
  key: string
): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function blockingReasonCodesFromPostflight(
  postflight: PostflightRecord | null
): readonly string[] {
  if (postflight === null) {
    return Object.freeze([]);
  }
  const codes: string[] = [];
  const carriers = postflight.blockingReasonCarriers ?? [];
  for (const entry of carriers) {
    if (isRecord(entry)) {
      const code = stringField(entry, "code");
      if (code !== null) {
        codes.push(code);
      }
    }
  }
  const reasons = postflight.blockingReasons ?? [];
  for (const entry of reasons) {
    if (typeof entry === "string") {
      codes.push(entry);
    } else if (isRecord(entry)) {
      const code = stringField(entry, "code");
      if (code !== null) {
        codes.push(code);
      }
    }
  }
  return Object.freeze(codes);
}

function productFilesFromManifest(
  files: readonly ProductMaterializationFileRecord[] | undefined
): {
  readonly written: readonly string[];
  readonly replayed: readonly string[];
  readonly lineageCount: number;
} {
  const written: string[] = [];
  const replayed: string[] = [];
  let lineageCount = 0;
  for (const entry of files ?? []) {
    if (typeof entry.relativePath !== "string") {
      continue;
    }
    if (entry.materializationSource === "replayed_from_prior_attempt") {
      replayed.push(entry.relativePath);
    } else {
      written.push(entry.relativePath);
    }
    lineageCount += entry.requirementTraceObligationIds?.length ?? 0;
  }
  return Object.freeze({
    written: Object.freeze(written),
    replayed: Object.freeze(replayed),
    lineageCount
  });
}

function obligationCountFromWorkerReport(
  report: WorkerResultReportRecord | null
): number | null {
  if (report === null || !Array.isArray(report.obligationAssessments)) {
    return null;
  }
  return report.obligationAssessments.length;
}

function operatorRunStartMs(operatorRunRoot: string): number | null {
  const baseName = path.basename(operatorRunRoot);
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\d{3})Z/u.exec(baseName);
  if (match === null) {
    return null;
  }
  const [, y, mo, d, h, mi, s, ms] = match;
  if (
    y === undefined ||
    mo === undefined ||
    d === undefined ||
    h === undefined ||
    mi === undefined ||
    s === undefined ||
    ms === undefined
  ) {
    return null;
  }
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}.${ms}Z`;
  const parsed = Date.parse(iso);
  return Number.isFinite(parsed) ? parsed : null;
}

function edgeWindowElapsedMs(operatorRunRoot: string): number | null {
  const start = operatorRunStartMs(operatorRunRoot);
  const end = dirMtimeMsOrNull(operatorRunRoot);
  if (start === null || end === null) {
    return null;
  }
  return Math.max(0, end - start);
}

export function deriveEdgeAttempt(
  carriers: OperatorRunCarriers,
  attemptOrdinal: number
): SdlcFdRunAnalysisEdgeAttempt {
  const operatorSummary = carriers.operatorSummary.status === "present"
    ? carriers.operatorSummary.data
    : null;
  const handoff = carriers.handoffManifest.status === "present"
    ? carriers.handoffManifest.data
    : null;
  const workerRun = carriers.workerRun.status === "present"
    ? carriers.workerRun.data
    : null;
  const postflight = carriers.postflight.status === "present"
    ? carriers.postflight.data
    : null;
  const edgeClosure = carriers.edgeClosure.status === "present"
    ? carriers.edgeClosure.data
    : null;
  const fpEvaluate = carriers.fpEvaluateResult.status === "present"
    ? carriers.fpEvaluateResult.data
    : null;
  const nextAction = carriers.nextActionProjection.status === "present"
    ? carriers.nextActionProjection.data
    : null;
  const productManifest = carriers.productManifest.status === "present"
    ? carriers.productManifest.data
    : null;
  const workerReport = carriers.workerResultReport.status === "present"
    ? carriers.workerResultReport.data
    : null;
  const productFiles = productFilesFromManifest(productManifest?.files);
  const blockingReasonCodes = blockingReasonCodesFromPostflight(postflight);
  const workerElapsedMs = workerRun?.elapsedMs ?? null;
  const edgeWindowMs = edgeWindowElapsedMs(carriers.operatorRunRoot);
  const deterministicMs =
    edgeWindowMs !== null && workerElapsedMs !== null
      ? Math.max(0, edgeWindowMs - workerElapsedMs)
      : null;
  const eventBytes =
    carriers.fileSizes.runtimeEvents + carriers.fileSizes.workerProcessEvents;
  const promptContextBytes =
    carriers.fileSizes.workerPrompt +
    carriers.fileSizes.workerInvocationPackage +
    carriers.fileSizes.traversalIntentPackage;
  return Object.freeze({
    attemptOrdinal,
    operatorRunRef: operatorRunRef(carriers.operatorRunRoot),
    graphFunctionName:
      operatorSummary?.graphFunctionName ?? handoff?.graphFunctionName ?? null,
    graphVectorRef: handoff?.edgeName ?? null,
    targetAssetType: handoff?.targetAssetType ?? null,
    workerElapsedMs,
    edgeWindowElapsedMs: edgeWindowMs,
    deterministicElapsedMs: deterministicMs,
    fpEvaluateStatus: fpEvaluate?.status ?? null,
    postflightStatus: postflight?.status ?? null,
    closureDisposition: edgeClosure?.disposition ?? null,
    selectedNextActionRef: nextAction?.selectedActionRef ?? null,
    predecessorAttemptRef: null,
    blockingReasonCodes,
    productFilesWritten: productFiles.written,
    productFilesReplayed: productFiles.replayed,
    requirementObligationCount: obligationCountFromWorkerReport(workerReport),
    productLineageCount: productFiles.lineageCount,
    promptContextBytes,
    handoffBytes: carriers.fileSizes.handoffManifest,
    stdoutBytes: carriers.fileSizes.workerStdout,
    eventBytes,
    workerStatus: operatorSummary?.status ?? null
  });
}

type ByteAccountCategory =
  | "runtimeEventBytes"
  | "stdoutBytes"
  | "stderrBytes"
  | "promptContextBytes"
  | "handoffBytes"
  | "workerProcessEventBytes"
  | "workerResultReportBytes"
  | "consequenceCarrierBytes"
  | "productMaterializationManifestBytes"
  | "otherCarrierBytes";

function byteAccountForFile(
  file: SdlcFdRunAnalysisFileInfo,
  parentOperatorRunRoot: string | null
): {
  readonly category: ByteAccountCategory;
  readonly inOperatorRun: boolean;
} {
  const inOperatorRun =
    parentOperatorRunRoot !== null &&
    file.absolutePath.startsWith(`${parentOperatorRunRoot}/`);
  const base = path.basename(file.absolutePath);
  if (base === "runtime_events.json") {
    return { category: "runtimeEventBytes", inOperatorRun };
  }
  if (base === "worker_stdout.log") {
    return { category: "stdoutBytes", inOperatorRun };
  }
  if (base === "worker_stderr.log") {
    return { category: "stderrBytes", inOperatorRun };
  }
  if (
    base === "worker_prompt.md" ||
    base === "worker_invocation_package.json" ||
    base === "traversal_intent_package.json"
  ) {
    return { category: "promptContextBytes", inOperatorRun };
  }
  if (base === "handoff_manifest.json") {
    return { category: "handoffBytes", inOperatorRun };
  }
  if (base === "worker_process_events.jsonl") {
    return { category: "workerProcessEventBytes", inOperatorRun };
  }
  if (base === "worker_result_report.json") {
    return { category: "workerResultReportBytes", inOperatorRun };
  }
  if (
    base === "sdlc_edge_closure_decision.json" ||
    base === "sdlc_edge_fulfillment_ledger.json" ||
    base === "sdlc_next_action_projection.json"
  ) {
    return { category: "consequenceCarrierBytes", inOperatorRun };
  }
  if (base === "product_materialization_manifest.json") {
    return { category: "productMaterializationManifestBytes", inOperatorRun };
  }
  return { category: "otherCarrierBytes", inOperatorRun };
}

export function aggregateOperatorRunBytes(
  operatorRunRoots: readonly string[]
): SdlcFdRunAnalysisByteAccount {
  let totalBytes = 0;
  let operatorRunBytes = 0;
  let runtimeEventBytes = 0;
  let stdoutBytes = 0;
  let stderrBytes = 0;
  let promptContextBytes = 0;
  let handoffBytes = 0;
  let traversalIntentBytes = 0;
  let workerInvocationBytes = 0;
  let workerProcessEventBytes = 0;
  let workerResultReportBytes = 0;
  let consequenceCarrierBytes = 0;
  let productMaterializationManifestBytes = 0;
  let otherCarrierBytes = 0;
  for (const root of operatorRunRoots) {
    const files = walkDirectoryFiles(root);
    for (const file of files) {
      totalBytes += file.byteSize;
      operatorRunBytes += file.byteSize;
      const account = byteAccountForFile(file, root);
      switch (account.category) {
        case "runtimeEventBytes":
          runtimeEventBytes += file.byteSize;
          break;
        case "stdoutBytes":
          stdoutBytes += file.byteSize;
          break;
        case "stderrBytes":
          stderrBytes += file.byteSize;
          break;
        case "promptContextBytes":
          promptContextBytes += file.byteSize;
          if (path.basename(file.absolutePath) === "traversal_intent_package.json") {
            traversalIntentBytes += file.byteSize;
          }
          if (path.basename(file.absolutePath) === "worker_invocation_package.json") {
            workerInvocationBytes += file.byteSize;
          }
          break;
        case "handoffBytes":
          handoffBytes += file.byteSize;
          break;
        case "workerProcessEventBytes":
          workerProcessEventBytes += file.byteSize;
          break;
        case "workerResultReportBytes":
          workerResultReportBytes += file.byteSize;
          break;
        case "consequenceCarrierBytes":
          consequenceCarrierBytes += file.byteSize;
          break;
        case "productMaterializationManifestBytes":
          productMaterializationManifestBytes += file.byteSize;
          break;
        case "otherCarrierBytes":
          otherCarrierBytes += file.byteSize;
          break;
      }
    }
  }
  return Object.freeze({
    totalBytes,
    operatorRunBytes,
    runtimeEventBytes,
    stdoutBytes,
    stderrBytes,
    promptContextBytes,
    handoffBytes,
    traversalIntentBytes,
    workerInvocationBytes,
    workerProcessEventBytes,
    workerResultReportBytes,
    consequenceCarrierBytes,
    productMaterializationManifestBytes,
    otherCarrierBytes
  });
}

export function computeWallClockMs(
  operatorRunRoots: readonly string[]
): number | null {
  if (operatorRunRoots.length === 0) {
    return null;
  }
  const earliest = operatorRunRoots
    .map((root) => operatorRunStartMs(root))
    .filter((value): value is number => value !== null)
    .reduce<number | null>((acc, current) => (acc === null || current < acc ? current : acc), null);
  const latest = operatorRunRoots
    .map((root) => dirMtimeMsOrNull(root))
    .filter((value): value is number => value !== null)
    .reduce<number | null>((acc, current) => (acc === null || current > acc ? current : acc), null);
  if (earliest === null || latest === null) {
    return null;
  }
  return Math.max(0, latest - earliest);
}
