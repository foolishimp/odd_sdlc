// Implements: T-161

import path from "node:path";
import { existsSync, statSync } from "node:fs";

import { operatorRunRef } from "./archive_reader.js";
import type { OperatorRunCarriers } from "./carrier_loaders.js";
import type { DiagnosticDraft } from "./diagnostics.js";
import type { SdlcFdRunAnalysisRuntimeArtifactGap } from "./types.js";

const REQUIRED_ARTIFACTS_FOR_PRESENT_EDGE: readonly string[] = Object.freeze([
  "worker_run.json",
  "worker_invocation_package.json",
  "handoff_manifest.json",
  "fp_evaluate_result.json",
  "sdlc_edge_closure_decision.json",
  "sdlc_edge_fulfillment_ledger.json",
  "sdlc_next_action_projection.json"
]);

function fileExists(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}

export function deriveRuntimeArtifactGaps(input: {
  readonly carriers: readonly OperatorRunCarriers[];
}): {
  readonly gaps: readonly SdlcFdRunAnalysisRuntimeArtifactGap[];
  readonly diagnostics: readonly DiagnosticDraft[];
} {
  const gaps: SdlcFdRunAnalysisRuntimeArtifactGap[] = [];
  const diagnostics: DiagnosticDraft[] = [];
  for (let index = 0; index < input.carriers.length; index += 1) {
    const carriers = input.carriers[index];
    if (carriers === undefined) {
      continue;
    }
    const operatorRunRefValue = operatorRunRef(carriers.operatorRunRoot);
    const closure = carriers.edgeClosure.status === "present"
      ? carriers.edgeClosure.data
      : null;
    const requiresProductManifest =
      closure?.disposition === "close" &&
      carriers.handoffManifest.status === "present" &&
      typeof carriers.handoffManifest.data.targetAssetType === "string" &&
      carriers.handoffManifest.data.targetAssetType !==
        "feature_decomp_surface";
    for (const artifact of REQUIRED_ARTIFACTS_FOR_PRESENT_EDGE) {
      const filePath = path.join(carriers.operatorRunRoot, artifact);
      if (!fileExists(filePath)) {
        gaps.push(Object.freeze({
          operatorRunRef: operatorRunRefValue,
          artifact,
          status: "missing" as const,
          detail: null
        }));
        diagnostics.push({
          code: "runtime_artifact_missing",
          severity: "warn",
          detail: `${artifact} missing in ${operatorRunRefValue}`,
          evidenceRefs: Object.freeze([operatorRunRefValue]),
          operatorRunRef: operatorRunRefValue,
          edgeName: null
        });
      }
    }
    if (requiresProductManifest && carriers.productManifest.status === "missing") {
      const refPath = path.join(carriers.operatorRunRoot, "product_materialization_manifest.json");
      gaps.push(Object.freeze({
        operatorRunRef: operatorRunRefValue,
        artifact: "product_materialization_manifest.json",
        status: "missing" as const,
        detail: "product edge with no materialization manifest"
      }));
      diagnostics.push({
        code: "runtime_artifact_missing",
        severity: "warn",
        detail: `product_materialization_manifest.json missing in ${operatorRunRefValue}`,
        evidenceRefs: Object.freeze([refPath]),
        operatorRunRef: operatorRunRefValue,
        edgeName: null
      });
    }
    const malformedCarrierEntries: { readonly artifact: string; readonly detail: string }[] = [];
    if (carriers.operatorSummary.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "operator_summary.json",
        detail: carriers.operatorSummary.detail
      });
    }
    if (carriers.workerRun.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "worker_run.json",
        detail: carriers.workerRun.detail
      });
    }
    if (carriers.postflight.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "postflight.json",
        detail: carriers.postflight.detail
      });
    }
    if (carriers.edgeClosure.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "sdlc_edge_closure_decision.json",
        detail: carriers.edgeClosure.detail
      });
    }
    if (carriers.edgeFulfillmentLedger.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "sdlc_edge_fulfillment_ledger.json",
        detail: carriers.edgeFulfillmentLedger.detail
      });
    }
    if (carriers.nextActionProjection.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "sdlc_next_action_projection.json",
        detail: carriers.nextActionProjection.detail
      });
    }
    if (carriers.productManifest.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "product_materialization_manifest.json",
        detail: carriers.productManifest.detail
      });
    }
    if (carriers.handoffManifest.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "handoff_manifest.json",
        detail: carriers.handoffManifest.detail
      });
    }
    if (carriers.runtimeEvents.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "runtime_events.json",
        detail: carriers.runtimeEvents.detail
      });
    }
    if (carriers.workerProcessEvents.status === "malformed") {
      malformedCarrierEntries.push({
        artifact: "worker_process_events.jsonl",
        detail: carriers.workerProcessEvents.detail
      });
    }
    for (const entry of malformedCarrierEntries) {
      gaps.push(Object.freeze({
        operatorRunRef: operatorRunRefValue,
        artifact: entry.artifact,
        status: "malformed" as const,
        detail: entry.detail
      }));
      diagnostics.push({
        code: "runtime_artifact_malformed",
        severity: "warn",
        detail: `${entry.artifact} malformed in ${operatorRunRefValue}: ${entry.detail}`,
        evidenceRefs: Object.freeze([operatorRunRefValue]),
        operatorRunRef: operatorRunRefValue,
        edgeName: null
      });
    }
  }
  return Object.freeze({
    gaps: Object.freeze(gaps),
    diagnostics: Object.freeze(diagnostics)
  });
}
