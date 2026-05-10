// Validates: T-140

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  deriveSdlcWorkerRetryContextFromTraversalConsequence
} from "../../build/semantic/code/src/index.js";

const installedOperatorSource = () =>
  readFileSync(
    new URL("../../code/src/operator/installed_operator.ts", import.meta.url),
    "utf8"
  );

test("T-140 retry context derives from traversal consequence projection refs", () => {
  const derivation = deriveSdlcWorkerRetryContextFromTraversalConsequence({
    attemptIndex: 3,
    outcome: {
      manifest: {
        archiveRoot: "/tmp/odd-sdlc-t140/archive",
        vectorIndex: 7
      },
      gapDossier: {
        currentGapDossierRef: "gap-dossier://t140/legacy"
      },
      traversalConsequence: {
        edgeClosureDecision: {
          decisionRef: "closure-decision://t140/retry"
        },
        nextActionProjection: {
          choosesNextTraversal: true,
          nextActionProjectionRef: "next-action://t140/evaluate-next"
        }
      }
    }
  });

  assert.equal(derivation.status, "ready");
  const retryContext = derivation.retryContext;
  assert(retryContext);
  assert.equal(
    retryContext.retryAttemptRefs[0].sourceProjectionRef,
    "next-action://t140/evaluate-next"
  );
  assert.equal(
    retryContext.retryAttemptRefs[0].priorAuthorityRef,
    "closure-decision://t140/retry"
  );
  assert.equal(retryContext.retryAttemptRefs[0].attemptIndex, 3);
  assert.equal(retryContext.retryAttemptRefs[0].vectorIndex, 7);
  assert.equal(retryContext.priorGapDossiers.length, 0);
});

test("T-140 retry context is absent without executable evaluate-next truth", () => {
  const derivation = deriveSdlcWorkerRetryContextFromTraversalConsequence({
    attemptIndex: 1,
    outcome: {
      manifest: {
        archiveRoot: "/tmp/odd-sdlc-t140/archive",
        vectorIndex: 0
      },
      traversalConsequence: {
        edgeClosureDecision: {
          decisionRef: "closure-decision://t140/block"
        },
        nextActionProjection: {
          choosesNextTraversal: false,
          nextActionProjectionRef: "next-action://t140/no-action"
        }
      }
    }
  });
  assert.equal(derivation.status, "no_executable_intent");
  assert.equal(derivation.retryContext, null);
});

test("T-140 retry context absence keeps no consequence and no manifest distinct", () => {
  const noConsequence = deriveSdlcWorkerRetryContextFromTraversalConsequence({
    attemptIndex: 1,
    outcome: {
      manifest: {
        archiveRoot: "/tmp/odd-sdlc-t140/archive",
        vectorIndex: 0
      },
      traversalConsequence: null
    }
  });
  assert.equal(noConsequence.status, "no_consequence");
  assert.equal(noConsequence.retryContext, null);

  const noManifest = deriveSdlcWorkerRetryContextFromTraversalConsequence({
    attemptIndex: 1,
    outcome: {
      manifest: null,
      traversalConsequence: {
        edgeClosureDecision: {
          decisionRef: "closure-decision://t140/no-manifest"
        },
        nextActionProjection: {
          choosesNextTraversal: true,
          nextActionProjectionRef: "next-action://t140/no-manifest"
        }
      }
    }
  });
  assert.equal(noManifest.status, "no_manifest");
  assert.equal(noManifest.retryContext, null);
});

test("T-140 installed loop names traversal consequence as retry source", () => {
  const source = installedOperatorSource();

  assert.equal(
    source.includes("deriveSdlcWorkerRetryContextFromTraversalConsequence"),
    true
  );
  assert.equal(source.includes("retryContextFromGapDossier"), false);
  assert.equal(
    source.includes(
      "deriveSdlcWorkerRetryContextFromTraversalConsequence"
    ),
    true
  );
  assert.equal(
    source.includes("latest.gapDossier === null\n        ? undefined"),
    false
  );
});

test("T-140 installed operator does not dispatch from legacy gap action strings", () => {
  const source = installedOperatorSource();

  assert.equal(source.includes("gapActionRefs"), false);
  assert.equal(source.includes("nextLawfulActions.includes"), false);
  assert.equal(source.includes("retry_same_edge_with_gap_dossier"), false);
  assert.equal(source.includes("plan_repair_reentry_with_gap_dossier"), false);
  assert.equal(source.includes("inspect_worker_archive"), false);
});

test("T-140 closure reasons use typed blocking-reason reentry points", () => {
  const source = installedOperatorSource();

  assert.equal(source.includes("blockingReasonRefsForReentry"), true);
  assert.equal(source.includes('lawfulReentryPoint: "same_edge_retry"'), true);
  assert.equal(source.includes('lawfulReentryPoint: "repair_worker_output"'), true);
  assert.equal(
    source.includes('lawfulReentryPoint: "reprice_requirement_or_design"'),
    true
  );
  assert.equal(source.includes('action: "retry_same_edge"'), false);
  assert.equal(source.includes('action: "repair_worker_output"'), false);
  assert.equal(source.includes('action: "reprice_requirement_or_design"'), false);
});
