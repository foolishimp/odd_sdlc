// Implements: T-181

import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  type GtlEvaluation,
  type GtlEvaluationCloseDispositionKind,
  type GtlEvaluationFindingRef
} from "@abiogenesis/typescript-tenant";
import {
  legacyBlockingReasonCode,
  makeSdlcBlockingReason,
  type SdlcBlockingReason
} from "../../../shared/blocking_reason.js";
import {
  sdlcRunRefSegmentFromArchiveRoot,
  type SdlcSelectedAbgFnCompositionIdentity
} from "../../composition_identity.js";
import {
  __handoffAdmittedDesignDepthFpEvaluatorRegisterEvidenceRefs,
  __handoffEvaluateAdrOutputArtifact,
  __handoffEvaluateExecutionEvidence,
  __handoffEvaluateMaterializedProductFiles,
  __handoffEvaluateObligationAssessments,
  __handoffEvaluateStagedConstructionAuthority,
  __handoffEvaluateWorkerAuthorityReadBoundary,
  __handoffInstalledOperatorOwnsEvaluationOutput,
  __handoffPathIsInside,
  __handoffResolveProductMaterializationReplay,
  __handoffShouldDeferImplementationDesignRegisterToFpEvaluator,
  sha256Text,
  stableOperatorJson
} from "../../handoff.js";
import type {
  SdlcFpEvaluateResult,
  SdlcPostflightResult,
  SdlcWorkerHandoffManifest,
  SdlcWorkerResultReport
} from "../../carriers.js";

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort((left, right) => left.localeCompare(right)));
}

export function evaluateSdlcComputeStage(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly report: SdlcWorkerResultReport;
  readonly fpEvaluatorAdmissionEvidenceRefs?: readonly string[] | undefined;
}): SdlcPostflightResult {
  const replayResolution = __handoffResolveProductMaterializationReplay(input);
  const report = replayResolution.report;
  const blockingReasonCarriers: SdlcBlockingReason[] = [];
  const materializationDiagnostics = report.materializationDiagnostics ?? [];
  for (const diagnostic of materializationDiagnostics) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: diagnostic.code,
        detail: diagnostic.detail,
        evidenceRefs: diagnostic.evidenceRefs
      })
    );
  }
  for (const diagnostic of replayResolution.diagnostics) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: diagnostic.code,
        detail: diagnostic.detail,
        evidenceRefs: diagnostic.evidenceRefs
      })
    );
  }
  __handoffEvaluateWorkerAuthorityReadBoundary({
    manifest: input.manifest,
    blockingReasonCarriers
  });
  if (!__handoffShouldDeferImplementationDesignRegisterToFpEvaluator(input.manifest)) {
    __handoffEvaluateStagedConstructionAuthority({
      manifest: input.manifest,
      blockingReasonCarriers,
      fpEvaluatorAdmissionEvidenceRefs:
        input.fpEvaluatorAdmissionEvidenceRefs ?? Object.freeze([])
    });
  }
  const outputFile = resolve(report.outputFile);
  const outputEvidenceRef = pathToFileURL(outputFile).href;
  if (outputFile !== resolve(input.manifest.outputFile)) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "output_file_manifest_mismatch",
        evidenceRefs: [outputEvidenceRef]
      })
    );
  }
  const frameworkOwnedEvaluationOutput =
    __handoffInstalledOperatorOwnsEvaluationOutput(input.manifest.targetAssetType) &&
    outputFile === resolve(input.manifest.outputFile);
  if (
    !frameworkOwnedEvaluationOutput &&
    !input.manifest.allowedWriteRoots.some((root) =>
      __handoffPathIsInside(outputFile, root)
    )
  ) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "output_file_outside_allowed_root",
        evidenceRefs: [outputEvidenceRef]
      })
    );
  }
  if (!existsSync(outputFile)) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "output_file_missing",
        evidenceRefs: [outputEvidenceRef]
      })
    );
  } else if (!statSync(outputFile).isFile()) {
    blockingReasonCarriers.push(
      makeSdlcBlockingReason({
        code: "output_path_not_file",
        evidenceRefs: [outputEvidenceRef]
      })
    );
  } else {
    const content = readFileSync(outputFile, "utf8");
    if (content.trim().length === 0) {
      blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "output_file_empty",
          evidenceRefs: [outputEvidenceRef]
        })
      );
    }
    __handoffEvaluateAdrOutputArtifact({
      manifest: input.manifest,
      outputFile,
      blockingReasonCarriers
    });
    if (sha256Text(content) !== report.digest) {
      blockingReasonCarriers.push(
        makeSdlcBlockingReason({
          code: "output_digest_mismatch",
          evidenceRefs: [outputEvidenceRef]
        })
      );
    }
  }
  __handoffEvaluateMaterializedProductFiles({
    manifest: input.manifest,
    report,
    blockingReasonCarriers
  });
  const evidenceRefs = [
    pathToFileURL(input.manifest.outputFile).href,
    pathToFileURL(input.manifest.reportFile).href,
    pathToFileURL(input.manifest.productMaterialization.manifestFile).href,
    ...__handoffAdmittedDesignDepthFpEvaluatorRegisterEvidenceRefs(
      input.manifest,
      input.fpEvaluatorAdmissionEvidenceRefs ?? Object.freeze([])
    ),
    ...report.materializedFiles.map((file) =>
      pathToFileURL(file.absolutePath).href
    )
  ];
  __handoffEvaluateExecutionEvidence({
    manifest: input.manifest,
    report,
    blockingReasonCarriers,
    evidenceRefs
  });
  __handoffEvaluateObligationAssessments({
    manifest: input.manifest,
    report,
    blockingReasonCarriers
  });
  const blockingReasons = blockingReasonCarriers.map(legacyBlockingReasonCode);
  return Object.freeze({
    kind: "sdlc_operator_postflight_result",
    status: blockingReasons.length === 0 ? "passed" : "blocked",
    blockingReasons: Object.freeze(blockingReasons),
    blockingReasonCarriers: Object.freeze(blockingReasonCarriers),
    evidenceRefs: Object.freeze(evidenceRefs)
  });
}

function obligationAssessmentCounts(
  report: SdlcWorkerResultReport
): SdlcFpEvaluateResult["obligationAssessmentCounts"] {
  let fulfilled = 0;
  let partial = 0;
  let blocked = 0;
  let unassessed = 0;
  for (const assessment of report.obligationAssessments) {
    switch (assessment.fulfillmentStatus) {
      case "fulfilled":
        fulfilled += 1;
        break;
      case "partial":
        partial += 1;
        break;
      case "blocked":
        blocked += 1;
        break;
      case "unassessed":
        unassessed += 1;
        break;
      default: {
        const exhaustive: never = assessment.fulfillmentStatus;
        throw new TypeError(`Unsupported obligation status ${exhaustive}`);
      }
    }
  }
  return Object.freeze({
    total: report.obligationAssessments.length,
    fulfilled,
    partial,
    blocked,
    unassessed
  });
}

function fpEvaluateCloseDisposition(
  status: SdlcFpEvaluateResult["status"]
): GtlEvaluationCloseDispositionKind {
  switch (status) {
    case "passed":
      return "close_proposed";
    case "admitted_with_open_obligations":
      return "qualified_defer_proposed";
    case "blocked":
      return "block_proposed";
    default: {
      const exhaustive: never = status;
      throw new TypeError(`Unsupported F_P evaluate status ${exhaustive}`);
    }
  }
}

function fpEvaluatePressureRefs(input: {
  readonly runRef: string;
  readonly blockingReasons: readonly string[];
}): readonly string[] {
  return Object.freeze(
    input.blockingReasons.map(
      (reason) =>
        `pressure://odd-sdlc/fp-evaluate/${input.runRef}/${encodeURIComponent(reason)}`
    )
  );
}

function constructGtlFpEvaluation(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly selectedComposition: SdlcSelectedAbgFnCompositionIdentity;
  readonly workerReportProjectionRef: string;
  readonly transformResultRef: string | null;
  readonly postflightRef: string;
  readonly status: SdlcFpEvaluateResult["status"];
  readonly postflight: SdlcPostflightResult;
  readonly counts: SdlcFpEvaluateResult["obligationAssessmentCounts"];
}): {
  readonly selectedComposition: SdlcFpEvaluateResult["selectedComposition"];
  readonly evaluationRef: string;
  readonly findings: readonly GtlEvaluationFindingRef[];
  readonly evaluation: GtlEvaluation;
} {
  const runRef = sdlcRunRefSegmentFromArchiveRoot(input.manifest.archiveRoot);
  const selectedComposition = input.selectedComposition;
  const evaluationRef = `evaluation://odd-sdlc/${runRef}/fp-evaluate`;
  const residualPressureRefs = fpEvaluatePressureRefs({
    runRef,
    blockingReasons: input.postflight.blockingReasons
  });
  const diagnosticRefs = Object.freeze([
    ...residualPressureRefs,
    `metrics://odd-sdlc/${runRef}/fp-evaluate/obligations`
  ]);
  const finding: GtlEvaluationFindingRef = Object.freeze({
    kind: "gtl_evaluation_finding_ref" as const,
    findingRef: `finding://odd-sdlc/${runRef}/fp-evaluate/1`,
    evaluatorRef: `evaluator://odd-sdlc/${runRef}/evaluate.C/postflight`,
    hookActionRef: null,
    gainReportRef: null,
    metricsRef: `metrics://odd-sdlc/${runRef}/fp-evaluate/obligations/${input.counts.fulfilled}-${input.counts.total}`,
    closeDisposition: fpEvaluateCloseDisposition(input.status),
    residualPressureRefs,
    continuationRefs: Object.freeze([
      `continuation://odd-sdlc/${runRef}/evaluate.C/${input.status}`
    ]),
    evidenceRefs: input.postflight.evidenceRefs,
    authorityRefs: uniqueSorted([
      input.workerReportProjectionRef,
      input.postflightRef,
      ...(input.transformResultRef === null ? [] : [input.transformResultRef]),
      ...input.postflight.evidenceRefs.filter((ref) =>
        ref.includes("design_depth_fp_evaluator_register.json")
      )
    ]),
    compositionContributionRef:
      `composition-contribution://odd-sdlc/${runRef}/fp-evaluate/1`,
    compositionRef: selectedComposition.compositionRef,
    compositionDigest: selectedComposition.compositionDigest,
    diagnosticRefs
  });
  const findings = Object.freeze([finding]);
  return Object.freeze({
    selectedComposition,
    evaluationRef,
    findings,
    evaluation: Object.freeze({
      kind: "gtl_evaluation" as const,
      subjectRef: selectedComposition.compositionRef,
      candidateRef: input.workerReportProjectionRef,
      evaluationRef,
      findings,
      diagnosticRefs
    })
  });
}

export function constructSdlcFpEvaluateResult(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly selectedComposition: SdlcSelectedAbgFnCompositionIdentity;
  readonly report: SdlcWorkerResultReport;
  readonly postflight: SdlcPostflightResult;
  readonly postflightRef?: string | undefined;
}): SdlcFpEvaluateResult {
  const counts = obligationAssessmentCounts(input.report);
  const hasOpenObligations =
    counts.partial > 0 || counts.blocked > 0 || counts.unassessed > 0;
  const status =
    input.postflight.status === "blocked"
      ? "blocked"
      : hasOpenObligations
        ? "admitted_with_open_obligations"
        : "passed";
  const workerReportProjectionRef = pathToFileURL(input.manifest.reportFile).href;
  const transformResultRef =
    input.manifest.fpTransformRequest === null
      ? null
      : pathToFileURL(input.manifest.fpTransformResultFile).href;
  const postflightRef =
    input.postflightRef ??
    pathToFileURL(join(input.manifest.archiveRoot, "postflight.json")).href;
  const gtlEvaluation = constructGtlFpEvaluation({
    manifest: input.manifest,
    selectedComposition: input.selectedComposition,
    workerReportProjectionRef,
    transformResultRef,
    postflightRef,
    status,
    postflight: input.postflight,
    counts
  });
  return Object.freeze({
    kind: "sdlc_fp_evaluate_result" as const,
    stage: "F_P.evaluate" as const,
    computeNotationStage: "evaluate.C" as const,
    stageAuthority: "typed_fp_stage_carriers" as const,
    selectedComposition: gtlEvaluation.selectedComposition,
    compositionRef: gtlEvaluation.selectedComposition.compositionRef,
    compositionDigest: gtlEvaluation.selectedComposition.compositionDigest,
    compositionSelectionRef:
      gtlEvaluation.selectedComposition.compositionSelectionRef,
    selectedRegimeBindingRef:
      gtlEvaluation.selectedComposition.selectedRegimeBindingRef,
    workerReportProjectionRef,
    transformResultRef,
    postflightRef,
    evaluationRef: gtlEvaluation.evaluationRef,
    findings: gtlEvaluation.findings,
    evaluation: gtlEvaluation.evaluation,
    status,
    postflightStatus: input.postflight.status,
    blockingReasons: input.postflight.blockingReasons,
    evidenceRefs: input.postflight.evidenceRefs,
    obligationAssessmentCounts: counts,
    executionEvidenceStatusSnapshot: input.report.executionEvidence?.status ?? null
  });
}

export function writeSdlcFpEvaluateResult(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly selectedComposition: SdlcSelectedAbgFnCompositionIdentity;
  readonly report: SdlcWorkerResultReport;
  readonly postflight: SdlcPostflightResult;
  readonly postflightRef?: string | undefined;
}): SdlcFpEvaluateResult {
  const result = constructSdlcFpEvaluateResult(input);
  writeFileSync(
    input.manifest.fpEvaluateResultFile,
    stableOperatorJson(result),
    "utf8"
  );
  return result;
}
