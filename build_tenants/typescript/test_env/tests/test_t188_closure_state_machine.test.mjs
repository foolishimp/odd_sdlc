// Validates: T-188

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { deriveRuntimeAggregateProjection } from "@abiogenesis/typescript-tenant";

import {
  SDLC_BLOCKING_REASON_REENTRY_POINTS,
  constructOddSdlcAbiogenesisExecutionBasis,
  deriveSdlcClosureStateTransition,
  makeSdlcBlockingReason,
  sdlcClosureStateBucketForLawfulReentryPoint,
  syntheticGapDossierFromClosureRefs
} from "../../build/semantic/code/src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, "../..");
const OPERATOR_SRC_ROOT = path.join(PACKAGE_ROOT, "code/src/operator");

const EXPECTED_BUCKET_BY_REENTRY_POINT = Object.freeze({
  same_edge_retry: "retry",
  escalate_to_fp: "re-enter",
  repair_worker_output: "repair",
  attach_worker: "block",
  repair_installed_topology: "block",
  fix_target_or_run_gaps: "block",
  repair_project_conformance: "block",
  reprice_runtime_policy: "block",
  reprice_requirement_or_design: "reprice",
  triage_gap: "block",
  rerun_start: "block",
  inspect_worker_archive: "block",
  repair_install: "block",
  operator_blocked: "block"
});

function transitionFor(patch = {}) {
  const basis = constructOddSdlcAbiogenesisExecutionBasis({
    workspaceRoot: "/workspace/odd-sdlc-t188-closure-state-machine",
    defaultRegime: "F_P",
    runId: "run://odd-sdlc/t188/closure-state-machine",
    workKey: "wk://odd-sdlc/t188/closure-state-machine",
    frameId: null,
    frameLineageId: null
  });
  return deriveSdlcClosureStateTransition({
    abgRuntimeTransitionContext: {
      basis,
      runtimeProjection: deriveRuntimeAggregateProjection(basis, []),
      vectorIndex: 0
    },
    runRef: "20260603T153222191Z_pid19186",
    blockingReasonCarriers: [],
    residualPressureRefs: [],
    abgTerminalRetryRefs: [],
    structuralBlockReasonRefs: [],
    postActionBlockReasonRefs: [],
    yieldResumeBasis: null,
    edgeCanClose: false,
    edgeAssuranceDisposition: null,
    ...patch
  });
}

function tsFilesUnder(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      return tsFilesUnder(fullPath);
    }
    return entry.isFile() && entry.name.endsWith(".ts") ? [fullPath] : [];
  });
}

test("T-188 every lawful reentry point maps to one closure-state bucket", () => {
  assert.deepStrictEqual(
    [...SDLC_BLOCKING_REASON_REENTRY_POINTS].sort(),
    Object.keys(EXPECTED_BUCKET_BY_REENTRY_POINT).sort()
  );
  for (const reentryPoint of SDLC_BLOCKING_REASON_REENTRY_POINTS) {
    assert.equal(
      sdlcClosureStateBucketForLawfulReentryPoint(reentryPoint),
      EXPECTED_BUCKET_BY_REENTRY_POINT[reentryPoint],
      reentryPoint
    );
  }
});

test("T-188 evaluator process failure blocks instead of product-transform retry", () => {
  const transition = transitionFor({
    blockingReasonCarriers: [
      makeSdlcBlockingReason({
        code: "review_grade_evaluator_process_failed",
        detail: "exitCode=null;signal=SIGTERM",
        evidenceRefs: [
          "file:///tmp/review_grade_postflight.json",
          "runtime-event://odd-sdlc/t188/abg-inactivity-timeout"
        ]
      })
    ],
    abgTerminalRetryRefs: [
      "terminal-retry://odd-sdlc/t188/review_grade_evaluator_process_failed"
    ],
    edgeAssuranceDisposition: "retry"
  });

  assert.equal(transition.disposition, "block");
  assert.equal(transition.explanationCode, "typed_block_or_triage");
  assert.equal(
    transition.abgRuntimeTransitionProjection.disposition,
    "block"
  );
  assert.equal(
    transition.abgRuntimeTransitionProjection.reason,
    "typed_block"
  );
  assert.deepStrictEqual(transition.retryReasonRefs, []);
  assert(
    transition.blockReasonRefs.some((ref) =>
      ref.includes("review_grade_evaluator_process_failed")
    ),
    transition.blockReasonRefs.join("\n")
  );
  assert(
    transition.evidenceRefs.includes(
      "runtime-event://odd-sdlc/t188/abg-inactivity-timeout"
    ),
    transition.evidenceRefs.join("\n")
  );
});

test("T-188 ABG terminal retry is only the no-typed-reason fallback", () => {
  const fallbackTransition = transitionFor({
    abgTerminalRetryRefs: ["terminal-retry://odd-sdlc/t188/abg-terminal"]
  });
  assert.equal(fallbackTransition.disposition, "retry");
  assert.equal(fallbackTransition.explanationCode, "abg_terminal_retry");
  assert.equal(
    fallbackTransition.abgRuntimeTransitionProjection.reason,
    "terminal_retry_fallback"
  );

  for (const reentryPoint of SDLC_BLOCKING_REASON_REENTRY_POINTS) {
    const transition = transitionFor({
      blockingReasonCarriers: [
        makeSdlcBlockingReason({
          code: "unknown_blocking_reason",
          reasonClass: "assurance",
          lawfulReentryPoint: reentryPoint,
          evidenceRefs: [`evidence://odd-sdlc/t188/${reentryPoint}`]
        })
      ],
      abgTerminalRetryRefs: ["terminal-retry://odd-sdlc/t188/abg-terminal"]
    });

    assert.notEqual(
      transition.explanationCode,
      "abg_terminal_retry",
      reentryPoint
    );
    assert.notEqual(
      transition.abgRuntimeTransitionProjection.reason,
      "terminal_retry_fallback",
      reentryPoint
    );
    assert.equal(
      transition.disposition,
      EXPECTED_BUCKET_BY_REENTRY_POINT[reentryPoint],
      reentryPoint
    );
    if (reentryPoint !== "same_edge_retry") {
      assert.deepStrictEqual(transition.retryReasonRefs, [], reentryPoint);
    } else {
      assert.equal(
        transition.retryReasonRefs.some((ref) => ref.includes("abg-terminal")),
        false,
        transition.retryReasonRefs.join("\n")
      );
    }
  }
});

test("T-188 SDLC repair adapters follow ABG typed-block priority", () => {
  const repriceCarrier = makeSdlcBlockingReason({
    code: "unknown_blocking_reason",
    reasonClass: "runtime_policy",
    lawfulReentryPoint: "reprice_requirement_or_design",
    evidenceRefs: ["evidence://odd-sdlc/t188/reprice"]
  });
  const repairTransition = transitionFor({
    blockingReasonCarriers: [
      makeSdlcBlockingReason({
        code: "unknown_blocking_reason",
        reasonClass: "assurance",
        lawfulReentryPoint: "repair_worker_output",
        evidenceRefs: ["evidence://odd-sdlc/t188/repair"]
      }),
      repriceCarrier
    ],
    abgTerminalRetryRefs: ["terminal-retry://odd-sdlc/t188/abg-terminal"]
  });

  assert.equal(repairTransition.disposition, "repair");
  assert.equal(
    repairTransition.abgRuntimeTransitionProjection.disposition,
    "block"
  );
  assert.equal(
    repairTransition.abgRuntimeTransitionProjection.reason,
    "typed_block"
  );
  assert(
    repairTransition.repriceReasonRefs.includes(
      "evidence://odd-sdlc/t188/reprice"
    ),
    repairTransition.repriceReasonRefs.join("\n")
  );

  const reenterTransition = transitionFor({
    blockingReasonCarriers: [
      makeSdlcBlockingReason({
        code: "unknown_blocking_reason",
        reasonClass: "assurance",
        lawfulReentryPoint: "escalate_to_fp",
        evidenceRefs: ["evidence://odd-sdlc/t188/reenter"]
      }),
      repriceCarrier
    ],
    abgTerminalRetryRefs: ["terminal-retry://odd-sdlc/t188/abg-terminal"]
  });

  assert.equal(reenterTransition.disposition, "re-enter");
  assert.equal(
    reenterTransition.abgRuntimeTransitionProjection.disposition,
    "block"
  );
  assert.equal(
    reenterTransition.abgRuntimeTransitionProjection.reason,
    "typed_block"
  );
  assert(
    reenterTransition.repriceReasonRefs.includes(
      "evidence://odd-sdlc/t188/reprice"
    ),
    reenterTransition.repriceReasonRefs.join("\n")
  );
});

test("T-188 admitted yield progress outranks ABG terminal retry fallback", () => {
  const transition = transitionFor({
    abgTerminalRetryRefs: ["terminal-retry://odd-sdlc/t188/abg-terminal"],
    yieldResumeBasis: {
      yieldKind: "partial_product_evidence_admitted_current_edge_should_resume",
      resumeBasisRef:
        "resume-basis://odd-sdlc/t188/materialized-product-lineage",
      currentEdgeRef: "edge://odd-sdlc/t188/component_code_surface",
      admittedProgressRefs: ["workspace://src/hello.js"],
      livenessProjectionRef: null,
      resumePolicyRef:
        "resume-policy://odd-sdlc/materialized-product-lineage/operator-iterate"
    }
  });

  assert.equal(transition.disposition, "yield");
  assert.equal(transition.explanationCode, "yield_progress");
  assert.deepStrictEqual(transition.retryReasonRefs, []);
  assert.equal(
    transition.yieldResumeBasis?.admittedProgressRefs[0],
    "workspace://src/hello.js"
  );
});

test("T-188 synthetic gap dossiers preserve typed carrier reentry class", () => {
  const carrier = makeSdlcBlockingReason({
    code: "unknown_blocking_reason",
    reasonClass: "runtime_policy",
    lawfulReentryPoint: "reprice_requirement_or_design",
    detail: "policy-disposition-mismatch",
    evidenceRefs: ["evidence://odd-sdlc/t188/runtime-policy"]
  });
  const dossier = syntheticGapDossierFromClosureRefs({
    manifest: {
      archiveRoot: "/tmp/t188-preserve-carrier",
      edgeName: "derive_component_code_surface",
      graphFunctionName: "derive_component_code_surface",
      targetAssetType: "component_code_surface",
      vectorIndex: 0
    },
    decisionRef: "closure-decision://odd-sdlc/t188/preserve-carrier",
    reasonRefs: [
      "blocking-reason://odd-sdlc/run-188/state/0/unknown_blocking_reason",
      "evidence://odd-sdlc/t188/runtime-policy"
    ],
    sourceProjectionRef: "source-projection://odd-sdlc/t188/preserve-carrier",
    blockingReasonCarriers: [carrier],
    runRef: "run-188",
    scope: "state"
  });

  assert.notEqual(dossier, null);
  assert.equal(dossier.reasons.length, 1);
  assert.equal(
    dossier.reasons[0].blockingReason.lawfulReentryPoint,
    "reprice_requirement_or_design"
  );
  assert.equal(dossier.reasons[0].reasonClass, "runtime_policy");
});

test("T-188 continuation decider is not reintroduced outside closure_state_machine", () => {
  const scannedSources = tsFilesUnder(OPERATOR_SRC_ROOT).filter(
    (sourcePath) => path.basename(sourcePath) !== "closure_state_machine.ts"
  );
  assert(scannedSources.length > 0);
  for (const forbidden of [
    "function blockingReasonRefsForReentry",
    "function closurePressureRefLawfulReentryPoint",
    "function closurePressureRefMessage",
    "function repairReasonFromClosurePressureRef",
    "closurePressureRefRequiresTriage",
    "closurePressureRefRequiresRepair"
  ]) {
    for (const sourcePath of scannedSources) {
      assert.equal(
        readFileSync(sourcePath, "utf8").includes(forbidden),
        false,
        `${path.relative(PACKAGE_ROOT, sourcePath)}:${forbidden}`
      );
    }
  }
});
