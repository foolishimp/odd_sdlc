// Validates: T-194
// SDLC supplies its production inventory; ABG owns GTL program conformance law.

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  formatGtlProgramConformanceIssues
} from "@abiogenesis/typescript-tenant";
import {
  STALE_ABG_IDENTITY_PATTERN,
  assertCurrentSdlcSemanticCompilerFpReviewGate,
  assertCurrentSdlcSemanticCarrierClosureReview,
  activeSdlcSourceIdentitySurfaces,
  constructCurrentSdlcGtlProgramConformanceInput,
  constructCurrentSdlcSemanticCarrierClosureReviewReport,
  constructCurrentSdlcSemanticCompilerPromptReviewPackage,
  semanticCarrierClosureIssuesForSurfaces,
  semanticSourceAuthorityIssuesForSurfaces,
  semanticPromptProjectionIssuesForRenderedPrompt,
  typecheckCurrentSdlcGtlProgram
} from "../../build/semantic/code/src/index.js";

function assertConformancePassed(report) {
  assert.equal(
    report.passed,
    true,
    formatGtlProgramConformanceIssues(report.issues)
  );
  assert.equal(report.issueCount, 0);
}

function assertTraversalUnitProjection({ input, report }) {
  const projection = report.traversalUnitProjection;
  assert.equal(
    projection.kind,
    "gtl_program_traversal_unit_projection"
  );
  assert.equal(
    projection.units.length,
    input.expectedCoverage.graphVectorCount
  );
  assert.equal(
    projection.entryUnits.length,
    input.expectedCoverage.publicStartTargetCount
  );

  const unitRefs = new Set(projection.units.map((unit) => unit.unitRef));
  assert.equal(unitRefs.size, projection.units.length);
  for (const unit of projection.units) {
    assert.equal(unit.kind, "gtl_program_traversal_unit_projection_row");
    assert.match(unit.unitRef, /^abg:\/\/gtl-program\/traversal-unit\/sha256:/u);
    assert.equal(unit.targetCarrierContractRefs.length, 1);
    assert.equal(unit.edgeClosureRefs.length, 1);
    assert.ok(unit.computeCompositionRefs.length > 0);
    assert.ok(unit.computeStageBindingRefs.length > 0);
    assert.ok(unit.pluginResultInterfaceRefs.length > 0);
    assert.ok(unit.consequencePluginResultInterfaceRefs.length > 0);
  }

  const entryByPublicStart = new Map(
    projection.entryUnits.map((entry) => [entry.publicStartRef, entry])
  );
  for (const entry of projection.entryUnits) {
    assert.equal(
      entry.kind,
      "gtl_program_traversal_entry_unit_projection_row"
    );
    assert.ok(entry.overlayRefs.length > 0);
    assert.ok(entry.entryUnitRefs.length > 0);
    for (const unitRef of entry.entryUnitRefs) {
      assert.equal(
        unitRefs.has(unitRef),
        true,
        `${entry.publicStartRef} resolves unknown traversal unit ${unitRef}`
      );
    }
  }

  for (const publicStartRef of [
    "bootstrap_release_self_test",
    "route_ticket_work_item"
  ]) {
    const entry = entryByPublicStart.get(publicStartRef);
    assert.notEqual(entry, undefined);
    assert.ok(entry.entryUnitRefs.length > 0);
  }
}

test("T-194 typechecks the current production SDLC GTL inventory", () => {
  const input = constructCurrentSdlcGtlProgramConformanceInput();
  const report = typecheckCurrentSdlcGtlProgram();

  assertConformancePassed(report);
  assertTraversalUnitProjection({ input, report });
  assert.equal(
    input.expectedCoverage.graphVectorCount,
    input.expectedCoverage.targetCarrierContractCount
  );
  assert.equal(
    input.expectedCoverage.graphVectorCount,
    input.expectedCoverage.edgeClosureContractCount
  );
  assert.equal(input.expectedCoverage.promptAssetCount, 102);
  assert.equal(input.expectedCoverage.pluginContractCount, 6);
  assert.ok(input.expectedCoverage.sourceIdentitySurfaceCount > 0);
  assert.ok(input.featureCoverageManifest.rows.length >= 26);
});

test("T-204 semantic compiler materializes all prompt-bearing graph projections", () => {
  const input = constructCurrentSdlcGtlProgramConformanceInput();
  const reviewPackage = constructCurrentSdlcSemanticCompilerPromptReviewPackage();

  assert.equal(reviewPackage.graphVectorCount, input.expectedCoverage.graphVectorCount);
  assert.equal(reviewPackage.promptProjectionCount, 99);
  assert.equal(reviewPackage.nonPromptVectorCount, 26);
  assert.equal(reviewPackage.deterministicIssueCount, 0);
  assert.equal(
    input.expectedCoverage.promptAssetCount,
    reviewPackage.promptProjectionCount + 3
  );
  assert.equal(
    reviewPackage.promptProjectionCount + reviewPackage.nonPromptVectorCount,
    reviewPackage.graphVectorCount
  );
  assert.match(reviewPackage.deterministicReportDigest, /^sha256:/u);
  assert.ok(
    reviewPackage.promptProjections.some(
      (projection) =>
        projection.graphFunctionName === "bootstrap_release_self_test" &&
        projection.edgeRef === "derive_test_design_surface" &&
        projection.outputCarrierKind === "sdlc_test_design_surface_target_carrier" &&
        projection.promptText.includes(
          'payload.kind:"sdlc_test_design_register"'
        )
    )
  );
});

test("T-204 semantic compiler rejects impossible design-depth first-update prompts", () => {
  const issues = semanticPromptProjectionIssuesForRenderedPrompt({
    edgeRef: "derive_lite_design_adr_surface",
    promptFamily: "evaluate_design_depth",
    outputCarrierKind: "sdlc_implementation_design_surface_target_carrier",
    contractRef:
      "target-carrier-contract://odd-sdlc/implementation-design-surface",
    contractDigest: "sha256:t194",
    promptText: [
      "Immediate first-update protocol:",
      "- First tool action: write the exact first-update JSON packet below to the durable evaluation artifact path. Do not Read anything before this Write.",
      "- The packet contains one semantic design-depth fragment row per pre-seeded draft section and intentionally carries empty/null partial values. It is a typed liveness carrier, not final design truth."
    ].join("\n")
  });

  assert.deepEqual(
    issues.map((issue) => issue.code).sort(),
    [
      "prompt_contradicts_worker_tool_write_policy",
      "prompt_empty_liveness_packet_claims_semantic_progress",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol",
      "prompt_missing_design_depth_incremental_progress_protocol"
    ].sort()
  );
});

test("T-204 semantic compiler rejects review-grade prompts without progress checkpoint", () => {
  const issues = semanticPromptProjectionIssuesForRenderedPrompt({
    edgeRef: "derive_lite_component_code_surface",
    promptFamily: "evaluate_review_grade",
    outputCarrierKind: "sdlc_review_grade_assessment",
    contractRef:
      "target-carrier-contract://odd-sdlc/review-grade-edge-fulfillment",
    contractDigest: "sha256:t194-review-grade",
    promptText: [
      "Review the generated asset.",
      "Read the construction brief, invocation package, worker report, generated product files, and then write the final assessment JSON.",
      "Final response must summarize review counts."
    ].join("\n")
  });

  assert.deepEqual(
    issues.map((issue) => issue.code).sort(),
    [
      "prompt_missing_review_grade_progress_protocol",
      "prompt_missing_review_grade_progress_protocol",
      "prompt_missing_review_grade_progress_protocol",
      "prompt_missing_review_grade_progress_protocol",
      "prompt_missing_review_grade_progress_protocol",
      "prompt_missing_review_grade_immediate_final_write_protocol",
      "prompt_missing_review_grade_final_output_ban",
      "prompt_missing_review_grade_read_only_workspace_boundary",
      "prompt_missing_review_grade_read_only_workspace_boundary",
      "prompt_missing_review_grade_read_only_workspace_boundary",
      "prompt_missing_review_grade_read_only_workspace_boundary"
    ].sort()
  );
});

test("T-204 semantic compiler rejects review-grade prompts that do not bind final decisions to writes", () => {
  const issues = semanticPromptProjectionIssuesForRenderedPrompt({
    edgeRef: "derive_lite_component_code_surface",
    promptFamily: "evaluate_review_grade",
    outputCarrierKind: "sdlc_review_grade_assessment",
    contractRef:
      "target-carrier-contract://odd-sdlc/review-grade-edge-fulfillment",
    contractDigest: "sha256:t194-review-grade",
    promptText: [
      "Progress-timeout protection:",
      "First assessment checkpoint:",
      "First assessment checkpoint JSON must be valid whole-file JSON",
      "Final assessment write precedes optional schema verification",
      "Do not write a plan or checklist before the first assessment checkpoint",
      "The evaluator is read-only over workspace and product files",
      "Do not use Write, Edit",
      "Any Write/Edit tool path must equal the assessment artifact path",
      "every other workspace path is read-only"
    ].join("\n")
  });

  assert.deepEqual(
    issues.map((issue) => issue.code).sort(),
    [
      "prompt_missing_review_grade_immediate_final_write_protocol",
      "prompt_missing_review_grade_final_output_ban"
    ].sort()
  );
});

test("T-204 semantic compiler rejects review-grade prompts that allow final decision prose", () => {
  const issues = semanticPromptProjectionIssuesForRenderedPrompt({
    edgeRef: "derive_lite_component_code_surface",
    promptFamily: "evaluate_review_grade",
    outputCarrierKind: "sdlc_review_grade_assessment",
    contractRef:
      "target-carrier-contract://odd-sdlc/review-grade-edge-fulfillment",
    contractDigest: "sha256:t194-review-grade",
    promptText: [
      "Progress-timeout protection:",
      "First assessment checkpoint:",
      "First assessment checkpoint JSON must be valid whole-file JSON",
      "Final assessment write precedes optional schema verification",
      "Do not write a plan or checklist before the first assessment checkpoint",
      "The evaluator is read-only over workspace and product files",
      "Do not use Write, Edit",
      "Any Write/Edit tool path must equal the assessment artifact path",
      "every other workspace path is read-only",
      "Final decision immediate-write rule: once you know the final status and finding set, your next tool call must overwrite the assessment JSON before any more reasoning, source inspection, schema verification, or stdout summary."
    ].join("\n")
  });

  assert.deepEqual(
    issues.map((issue) => issue.code),
    ["prompt_missing_review_grade_final_output_ban"]
  );
});

test("T-204 semantic compiler rejects component-test prompts with full traversal scope", () => {
  const issues = semanticPromptProjectionIssuesForRenderedPrompt({
    edgeRef: "derive_lite_component_test_surface",
    promptFamily: "transform",
    outputCarrierKind: "sdlc_component_test_surface_target_carrier",
    contractRef:
      "gtl://target-carrier-contract/odd-sdlc/derive_lite_component_test_surface/component_test_surface",
    contractDigest: "sha256:t194-component-test",
    promptText:
      "Every admitted requirement obligation in workerInvocationPackage.traversalObligationContext.obligations must be traceable from at least one generated test file comment."
  });

  assert.deepEqual(
    issues.map((issue) => issue.code),
    ["prompt_component_test_scope_contradiction"]
  );
});

test("T-204 semantic compiler rejects transform prompts with ambiguous obligation scope", () => {
  const issues = semanticPromptProjectionIssuesForRenderedPrompt({
    edgeRef: "derive_lite_uat_test_source_surface",
    promptFamily: "transform",
    outputCarrierKind: "sdlc_uat_test_source_surface_target_carrier",
    contractRef:
      "gtl://target-carrier-contract/odd-sdlc/derive_lite_uat_test_source_surface/uat_test_source_surface",
    contractDigest: "sha256:t194-uat-source",
    promptText:
      "- obligations in scope: 170; feature scope=full_breadth; included modules=cdme-compiler"
  });

  assert.deepEqual(
    issues.map((issue) => issue.code),
    ["prompt_transform_scope_label_contradiction"]
  );
});

test("T-204 semantic compiler rejects component-depth transform prompts without exact whole-file carrier boundary", () => {
  const issues = semanticPromptProjectionIssuesForRenderedPrompt({
    edgeRef: "derive_lite_uat_test_source_surface",
    promptFamily: "transform",
    outputCarrierKind: "sdlc_uat_test_source_surface_target_carrier",
    contractRef:
      "gtl://target-carrier-contract/odd-sdlc/derive_lite_uat_test_source_surface/uat_test_source_surface",
    contractDigest: "sha256:t194-uat-source",
    promptText:
      'Emit a whole-file JSON component_depth_register selected target-carrier envelope with `kind:"sdlc_uat_test_source_surface_target_carrier"` and `payload.kind:"sdlc_component_depth_register"`. Do not wrap the component_depth_register carrier in Markdown fences.'
  });

  assert.deepEqual(
    [...new Set(issues.map((issue) => issue.code))],
    ["prompt_missing_component_depth_whole_file_carrier_boundary"]
  );
});

test("T-204 semantic compiler rejects review-grade prompts without read-only workspace boundary", () => {
  const issues = semanticPromptProjectionIssuesForRenderedPrompt({
    edgeRef: "derive_lite_component_test_surface",
    promptFamily: "evaluate_review_grade",
    outputCarrierKind: "sdlc_review_grade_assessment",
    contractRef:
      "target-carrier-contract://odd-sdlc/review-grade-edge-fulfillment",
    contractDigest: "sha256:t194-review-grade",
    promptText: [
      "Progress-timeout protection:",
      "First assessment checkpoint:",
      "First assessment checkpoint JSON must be valid whole-file JSON",
      "Final assessment write precedes optional schema verification",
      "Do not write a plan or checklist before the first assessment checkpoint",
      "Final decision immediate-write rule: once you know the final status and finding set, your next tool call must overwrite the assessment JSON before any more reasoning, source inspection, schema verification, or stdout summary.",
      "Final decision output ban: after the final status and finding set are known, emit no assistant text; the next emitted item must be the Write tool call."
    ].join("\n")
  });

  assert.deepEqual(
    [...new Set(issues.map((issue) => issue.code))],
    ["prompt_missing_review_grade_read_only_workspace_boundary"]
  );
});

test("T-204 F_P semantic compiler review gate is switched and fail-closed", () => {
  const originalSwitch = process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL"];
  const originalResult =
    process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT"];
  const tempRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t204-fp-review-"));
  try {
    delete process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL"];
    delete process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT"];
    const skipped = assertCurrentSdlcSemanticCompilerFpReviewGate();
    assert.equal(skipped.mode, "skipped");
    assert.equal(skipped.passed, true);

    process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL"] = "required";
    assert.throws(
      () => assertCurrentSdlcSemanticCompilerFpReviewGate(),
      /F_P\.eval review gate requires an admitted review result/u
    );

    const reviewPackage = constructCurrentSdlcSemanticCompilerPromptReviewPackage();
    const resultPath = path.join(tempRoot, "review-result.json");
    writeFileSync(
      resultPath,
      `${JSON.stringify(
        {
          kind: "sdlc_semantic_compiler_fp_review_result",
          reviewVersion: "ts-semantic-compiler-fp-review-result-v1",
          deterministicReportDigest:
            reviewPackage.deterministicReportDigest,
          status: "passed",
          findingCount: 0,
          reviewerProfileRef: "reviewer-profile://odd-sdlc/codex",
          reviewedAt: "2026-06-23T00:00:00.000Z"
        },
        null,
        2
      )}\n`,
      "utf8"
    );
    process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT"] = resultPath;
    const required = assertCurrentSdlcSemanticCompilerFpReviewGate();
    assert.equal(required.mode, "required");
    assert.equal(required.passed, true);
    assert.equal(
      required.deterministicReportDigest,
      reviewPackage.deterministicReportDigest
    );
    const conformanceInput = constructCurrentSdlcGtlProgramConformanceInput();
    assert.equal(conformanceInput.semanticReviewGates.length, 1);
    assert.equal(
      conformanceInput.semanticReviewGates[0].deterministicReportDigest,
      reviewPackage.deterministicReportDigest
    );
    assert.equal(
      conformanceInput.semanticReviewGates[0].reviewResultKind,
      "sdlc_semantic_compiler_fp_review_result"
    );
  } finally {
    if (originalSwitch === undefined) {
      delete process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL"];
    } else {
      process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_EVAL"] = originalSwitch;
    }
    if (originalResult === undefined) {
      delete process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT"];
    } else {
      process.env["ODD_SDLC_SEMANTIC_COMPILER_FP_REVIEW_RESULT"] = originalResult;
    }
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("T-204 semantic compiler enforces carrier materialization and closure totality", () => {
  const report = constructCurrentSdlcSemanticCarrierClosureReviewReport();

  assert.equal(report.kind, "sdlc_semantic_carrier_closure_review_report");
  assert.equal(report.passed, true);
  assert.equal(report.issueCount, 0);
  assert.deepEqual(report.issues, []);

  const asserted = assertCurrentSdlcSemanticCarrierClosureReview();
  assert.equal(asserted.passed, true);
  assert.equal(asserted.issueCount, 0);
});

test("T-204 semantic compiler rejects carrier-closure regressions", () => {
  const issues = semanticCarrierClosureIssuesForSurfaces([
    {
      surfaceRef:
        "build_tenants/typescript/code/src/operator/plugins/evaluate/content_register.ts",
      text:
        "export function writeDesignDepthRegisterProjectionFromEvaluateContentRegister() { return 'projected'; }",
      evidenceRefs: []
    },
    {
      surfaceRef:
        "build_tenants/typescript/code/src/operator/installed_operator.ts",
      text: [
        "async function evaluateDesignDepth() {",
        "  dispatchState.current = stateWithBlockedDesignDepthFpEvaluatorOutcome({});",
        "  return outcome;",
        "}"
      ].join("\n"),
      evidenceRefs: []
    },
    {
      surfaceRef:
        "build_tenants/typescript/code/src/operator/plugins/evaluate/postflight.ts",
      text: [
        "function constructGtlFpEvaluation() {",
        "  const closeDisposition = 'close_proposed';",
        "  const continuationRefs = Object.freeze(['continuation://odd-sdlc/stale']);",
        "  return { closeDisposition, continuationRefs };",
        "}"
      ].join("\n"),
      evidenceRefs: []
    }
  ]);

  assert.deepEqual(
    issues.map((issue) => issue.code).sort(),
    [
      "blocked_fp_evaluator_outcome_without_dispatch_publication",
      "close_proposed_emits_continuation_refs",
      "design_depth_content_register_semantic_floor_missing"
    ].sort()
  );
});

test("T-204 semantic compiler rejects source authority regressions", () => {
  const currentInput = constructCurrentSdlcGtlProgramConformanceInput();
  assert.equal(currentInput.sourceAuthorityPolicies.length, 7);
  assert.ok(
    currentInput.sourceAuthorityPolicies.some(
      (policy) =>
        policy.policyRef ===
        "abg://gtl-program/source-authority/no-design-depth-archive-status-acceptance"
    )
  );
  assert.ok(
    currentInput.sourceAuthorityPolicies.some(
      (policy) =>
        policy.policyRef ===
        "abg://gtl-program/source-authority/product-materialization-lineage-caches-requirement-markers"
    )
  );
  assert.ok(
    currentInput.sourceAuthorityPolicies.some(
      (policy) =>
        policy.policyRef ===
        "abg://gtl-program/source-authority/post-transform-report-uses-active-report-scope"
    )
  );
  assert.ok(
    currentInput.sourceAuthorityPolicies.some(
      (policy) =>
        policy.policyRef ===
        "abg://gtl-program/source-authority/consequence-reentry-target-uses-abg-graph-reentry-point"
    )
  );

  assert.deepEqual(
    semanticSourceAuthorityIssuesForSurfaces(activeSdlcSourceIdentitySurfaces()),
    []
  );

  const issues = semanticSourceAuthorityIssuesForSurfaces([
    {
      surfaceRef:
        "build_tenants/typescript/code/src/operator/plugins/evaluate/design_depth_register.ts",
      text: [
        "function predecessorDesignRegisterArchiveIsAccepted() {",
        "  return readFileSync('sdlc_edge_closure_decision.json', 'utf8') ||",
        "    readFileSync('postflight.json', 'utf8');",
        "}",
        "const acceptedArchiveRoots = [];"
      ].join("\n")
    },
    {
      surfaceRef:
        "build_tenants/typescript/code/src/operator/installed_operator.ts",
      text: [
        "function materializeReviewGradeEdgeFulfillmentWithFpEvaluator(input) {",
        "  const currentPostflightBlockers =",
        "    activePostflightBlockingReasonCarriers(input.currentPostflight);",
        "  if (currentPostflightBlockers.length > 0) {",
        "    return constructEvaluationRuleOutcome('triage_gap');",
        "  }",
        "}"
      ].join("\n")
    },
    {
      surfaceRef: "build_tenants/typescript/code/src/workspace_api/entry.ts",
      text: [
        "const archive = 'sdlc_edge_closure_decision.json';",
        "writeSdlcSystemArtifact({ relativePath: archive });",
        "publicStartOnce({});"
      ].join("\n")
    },
    {
      surfaceRef:
        "build_tenants/typescript/code/src/operator/plugins/evaluate/postflight_checks.ts",
      text: [
        "function evaluateMaterializedProductFiles() {",
        "  contentCarriesRequirementObligation({ content, obligationId, displayId });",
        "}"
      ].join("\n")
    },
    {
      surfaceRef:
        "build_tenants/typescript/code/src/operator/plugins/transform/result_projection.ts",
      text: [
        "function postTransformObligationAssessments(input) {",
        "  return input.manifest.traversalObligationContext.obligations.map((obligation) => obligation);",
        "}"
      ].join("\n")
    },
    {
      surfaceRef:
        "build_tenants/typescript/code/src/operator/traversal_consequence.ts",
      text: [
        "function constructSdlcGraphReentryTargetRef(input) {",
        "  const authorityNamespaceRef =",
        "    input.authorityNamespaceRef === undefined",
        "      ? \"odd-sdlc\"",
        "      : input.authorityNamespaceRef;",
        "  return `graph-reentry-point://${authorityNamespaceRef}/${String(input.targetVectorIndex)}`;",
        "}"
      ].join("\n")
    }
  ]);
  assert.deepEqual(
    issues.map((issue) => issue.code).sort(),
    [
      "consequence_reentry_target_uses_abg_graph_reentry_point",
      "design_depth_archive_status_authority",
      "post_transform_report_uses_broad_manifest_scope",
      "product_materialization_lineage_unbounded_requirement_marker_scan",
      "review_grade_retryable_postflight_short_circuit",
      "workspace_gaps_read_model_authors_runtime_truth",
      "workspace_gaps_read_model_invokes_runtime_control"
    ].sort()
  );
});

test("T-204 semantic compiler resolves source-authority surfaces in installed packages", () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t204-installed-source-"));
  try {
    const packageRoot = path.join(tempRoot, "package");
    const repoRoot = path.join(tempRoot, "workspace-without-source");
    const files = new Map([
      [
        "operator/plugins/evaluate/design_depth_register.js",
        "export function selectDesignDepthRegister() { return 'designCompletenessVerdict'; }\n"
      ],
      [
        "operator/installed_operator.js",
        [
          "export function materializeReviewGradeEdgeFulfillmentWithFpEvaluator() {",
          "  return 'lawfulReentryPoint !== \"same_edge_retry\"';",
          "}"
        ].join("\n")
      ],
      [
        "workspace_api/entry.js",
        "export function projectOddSdlcWorkspaceGaps() { return { readOnly: true }; }\n"
      ],
      [
        "operator/plugins/transform/result_projection.js",
        [
          "export function postTransformObligationAssessments() {",
          "  return activeReportObligationsForPostTransform().map((row) => row.activeReportObligationIds);",
          "}",
          "export function contentCarriesRequirementObligationWithMarkers() { return true; }",
          "export function normalizedRequirementMarkersForContent() { return []; }"
        ].join("\n")
      ],
      [
        "operator/plugins/evaluate/postflight_checks.js",
        [
          "export function evaluateMaterializedProductFiles() {",
          "  return contentCarriesRequirementObligationWithMarkers(normalizedRequirementMarkersForContent());",
          "}",
          "export function contentCarriesRequirementObligationWithMarkers() { return true; }",
          "export function normalizedRequirementMarkersForContent() { return []; }"
        ].join("\n")
      ],
      [
        "operator/traversal_consequence.js",
        [
          "export const GRAPH_REENTRY_POINT_VALUES = ['realization'];",
          "export function constructSdlcGraphReentryTargetRef(input) {",
          "  const authorityNamespaceRef =",
          "    input.authorityNamespaceRef === undefined",
          "      ? \"realization\"",
          "      : input.authorityNamespaceRef;",
          "  if (!GRAPH_REENTRY_POINT_VALUES.includes(authorityNamespaceRef)) throw new TypeError('ABG GraphReentryPoint');",
          "  return `graph-reentry-point://${authorityNamespaceRef}/${String(input.targetVectorIndex)}`;",
          "}"
        ].join("\n")
      ]
    ]);
    for (const [relative, text] of files) {
      const filePath = path.join(packageRoot, "build/semantic/code/src", relative);
      mkdirSync(path.dirname(filePath), { recursive: true });
      writeFileSync(filePath, text, "utf8");
    }
    writeFileSync(
      path.join(packageRoot, "package.json"),
      `${JSON.stringify({ name: "@odd-sdlc/typescript-tenant" }, null, 2)}\n`,
      "utf8"
    );
    mkdirSync(path.join(repoRoot, "specification"), { recursive: true });
    writeFileSync(
      path.join(repoRoot, "specification/PRODUCT.md"),
      "# Downstream Product\n",
      "utf8"
    );

    const surfaces = activeSdlcSourceIdentitySurfaces({
      packageRoot,
      repoRoot
    });
    const surfaceRefs = new Set(surfaces.map((surface) => surface.surfaceRef));
    const input = constructCurrentSdlcGtlProgramConformanceInput();
    for (const policy of input.sourceAuthorityPolicies) {
      for (const sourceRef of policy.sourceSurfaceRefs) {
        assert.equal(
          surfaceRefs.has(sourceRef),
          true,
          `${policy.policyRef} unresolved source surface ${sourceRef}`
        );
      }
    }
    assert.deepEqual(semanticSourceAuthorityIssuesForSurfaces(surfaces), []);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("T-194 active SDLC source surfaces contain no stale ABG 3.x identities", () => {
  for (const sample of [
    "abg-3.7 policy carrier",
    "ABIogenesis 3.7.1-rc.1",
    "runtime://abg/3.8/saga-frontier",
    "@abiogenesis/typescript-tenant@3.9.0-rc.13",
    "old rc13 package alias"
  ]) {
    assert.match(sample, STALE_ABG_IDENTITY_PATTERN);
  }

  const staleHits = activeSdlcSourceIdentitySurfaces()
    .filter((row) => STALE_ABG_IDENTITY_PATTERN.test(row.text))
    .map((row) => row.surfaceRef);

  assert.deepEqual(staleHits, []);
});
