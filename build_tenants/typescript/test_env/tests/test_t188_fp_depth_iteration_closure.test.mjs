// Validates: T-188

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  constructSdlcEdgeFulfillmentLedger,
  deriveSdlcEdgeClosureDecision,
  deriveSdlcEdgeFulfillmentCountsFromAssessments,
  sdlcFpEvaluateOpenObligationPressureRefs
} from "../../build/semantic/code/src/index.js";

const evaluatorPromptSource = readFileSync(
  fileURLToPath(
    new URL("../../code/src/operator/plugins/evaluate/prompts.ts", import.meta.url)
  ),
  "utf8"
);

const SELECTED_COMPOSITION = Object.freeze({
  compositionRef: "composition://odd-sdlc/t188/test",
  compositionDigest: "sha256:t188-test-composition",
  compositionSelectionRef: "composition-selection://odd-sdlc/t188/test",
  selectedRegimeBindingRef: "regime-binding://odd-sdlc/t188/evaluate/fp"
});

function closeDecisionWithPressure(pressureRefs) {
  const ledger = constructSdlcEdgeFulfillmentLedger({
    selectedComposition: SELECTED_COMPOSITION,
    ledgerRef: "ledger://odd-sdlc/t188/fp-open-obligation",
    ledgerVersionRef: "ledger-version://odd-sdlc/t188/fp-open-obligation/1",
    edgeRef: "edge://odd-sdlc/t188/derive_test_execution_result_surface",
    attemptRef: "attempt://odd-sdlc/t188/derive_test_execution_result_surface/1",
    targetBindingRefs: ["target-binding://odd-sdlc/t188/test-execution"],
    evidenceBundleRefs: ["evidence://odd-sdlc/t188/test-execution"],
    edgeResidualPressureRefs: pressureRefs,
    counts: {
      expected: 1,
      fulfilled: 1,
      partial: 0,
      blocked: 0,
      unfulfilled: 0,
      missing: 0,
      extra: 0
    },
    admitted: true,
    targetCertificationPassed: true,
    fdRecheckPassed: true
  });
  return deriveSdlcEdgeClosureDecision({
    decisionRef: "closure-decision://odd-sdlc/t188/fp-open-obligation",
    ledger,
    currentEdgeLawful: true
  });
}

test("T-188 downstream carry cannot erase partial pressure without owned downstream refs", () => {
  const projection = deriveSdlcEdgeFulfillmentCountsFromAssessments({
    declaredObligationIds: ["requirement:REQ-DM-LITE-001"],
    assessments: [
      {
        obligationId: "requirement:REQ-DM-LITE-001",
        fulfillmentStatus: "partial",
        carryDirection: "downstream_transformation_set",
        evidenceRefs: ["evaluation://odd-sdlc/t188/fp-depth-gap"]
      }
    ]
  });

  assert.deepStrictEqual(projection.counts, {
    expected: 1,
    fulfilled: 0,
    partial: 1,
    blocked: 0,
    unfulfilled: 0,
    missing: 0,
    extra: 0
  });
  assert.deepStrictEqual(projection.downstreamTransformationSetRefs, []);
  assert(
    projection.nonConvergedReasonRefs.some((ref) =>
      ref.includes("downstream_ownership_missing")
    ),
    projection.nonConvergedReasonRefs.join("\n")
  );
});

test("T-188 downstream carry remains lawful when graph and target ownership are explicit", () => {
  const projection = deriveSdlcEdgeFulfillmentCountsFromAssessments({
    declaredObligationIds: ["requirement:REQ-DM-LITE-002"],
    assessments: [
      {
        obligationId: "requirement:REQ-DM-LITE-002",
        fulfillmentStatus: "partial",
        carryDirection: "downstream_transformation_set",
        downstreamGraphFunctionRefs: [
          "graph-function://odd-sdlc/derive_component_test_surface"
        ],
        targetBindingRefs: [
          "target-binding://odd-sdlc/t188/component-test-surface"
        ],
        evidenceRefs: ["evaluation://odd-sdlc/t188/fp-depth-gap"]
      }
    ]
  });

  assert.deepStrictEqual(projection.counts, {
    expected: 0,
    fulfilled: 0,
    partial: 0,
    blocked: 0,
    unfulfilled: 0,
    missing: 0,
    extra: 0
  });
  assert.equal(projection.downstreamTransformationSetRefs.length, 1);
  assert.equal(projection.downstreamPressureRefs.length, 3);
  assert.equal(projection.downstreamTargetBindingRefs.length, 1);
  assert.deepStrictEqual(projection.nonConvergedReasonRefs, []);
});

test("T-188 admitted F_P evaluate open obligations become closure pressure", () => {
  const pressureRefs = sdlcFpEvaluateOpenObligationPressureRefs({
    runRef: "20260601T000000000Z_pid188",
    status: "admitted_with_open_obligations",
    obligationAssessmentCounts: {
      total: 199,
      fulfilled: 49,
      partial: 150,
      blocked: 0,
      unassessed: 0
    }
  });

  assert(pressureRefs.length > 0);
  assert(
    pressureRefs.some((ref) => ref.includes("admitted_with_open_obligations")),
    pressureRefs.join("\n")
  );
  assert(
    pressureRefs.some((ref) => ref.includes("partial-150")),
    pressureRefs.join("\n")
  );

  const decision = closeDecisionWithPressure(pressureRefs);
  assert.notEqual(decision.disposition, "close");
  assert.deepStrictEqual(decision.edgeResidualPressureRefs, pressureRefs);
});

test("T-188 downstream carryover partials do not become edge-local closure pressure", () => {
  const pressureRefs = sdlcFpEvaluateOpenObligationPressureRefs({
    runRef: "20260601T000000000Z_pid188",
    status: "admitted_with_open_obligations",
    obligationAssessmentCounts: {
      total: 3,
      fulfilled: 1,
      partial: 2,
      blocked: 0,
      unassessed: 0
    },
    obligationAssessments: [
      {
        fulfillmentStatus: "fulfilled",
        blockingReasons: []
      },
      {
        fulfillmentStatus: "partial",
        blockingReasons: [
          "requirement_recorded_for_future_closure:data_mapper_lite_lifecycle.requirements.req_ldm_001"
        ]
      },
      {
        fulfillmentStatus: "partial",
        blockingReasons: [
          "requirement_carried_for_downstream_closure:data_mapper_lite_lifecycle.requirements.req_ldm_002"
        ]
      }
    ]
  });

  assert.deepStrictEqual(pressureRefs, []);
});

test("T-188 design-depth evaluator prompt rejects generic substitute domain rows", () => {
  assert.match(
    evaluatorPromptSource,
    /Domain vocabulary is authority-bound/u
  );
  assert.match(
    evaluatorPromptSource,
    /not from the project slug, package name, file path, examples/u
  );
  assert.match(
    evaluatorPromptSource,
    /Generic substitute nouns are semantic underproduction/u
  );
  assert.match(
    evaluatorPromptSource,
    /must not become a generic mapping-result model/u
  );
  assert.match(
    evaluatorPromptSource,
    /Do not scrape source refs, authority refs, tech-stack\/spec docs/u
  );
});
