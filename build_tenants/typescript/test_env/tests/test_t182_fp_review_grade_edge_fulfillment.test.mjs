// Validates: T-182

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE,
  admitReviewGradeEdgeFulfillmentAssessmentFromArtifact,
  constructSdlcGtlModule,
  constructSdlcProductGraphContractCatalog,
  constructSdlcTargetCarrierRegistry,
  constructSdlcTraversalOverlayCatalog,
  designDepthFpEvaluatorRegisterPath,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  isSdlcOperatorRunArtifactRequiredForContext,
  materializeSdlcProjectConformance,
  requireSdlcProductGraphContractRow,
  reviewGradeEdgeFulfillmentAssessmentRequired,
  SDLC_EDGE_GAIN_CLOSURE_CONTRACTS,
  SDLC_OPERATOR_RUN_ARTIFACT_CATALOG,
  SDLC_PRODUCT_GRAPH_EDGE_POLICY_ROWS,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";
import { admitImplementationDesignRegisterCandidateForManifest } from "../../build/semantic/code/src/operator/handoff.js";

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t182-review-grade-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(path.join(root, "README.md"), "# T-182 Fixture\n", "utf8");
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-T182: Review-grade generated assets against requirements.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    [
      "# Requirements",
      "",
      "REQ-T182-001: Implement a source component that maps accepted design depth.",
      "REQ-T182-002: Provide tests that overlap the implemented source behavior.",
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t182_fixture",
      "active_tenant: typescript",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript",
      "    language: typescript",
      "    build_tool: npm"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function manifestForEdge(workspaceRoot, edgeName, runId) {
  const contract = hookContractByEdgeName(edgeName);
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: edgeName,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    fpTransformRequest: {
      kind: "fp_transform_request",
      requestRef: `fp-request://t182/${runId}`,
      basisId: `basis://t182/${runId}`,
      graphFunctionId: `graph-function://t182/${edgeName}`,
      jobId: `job://t182/${runId}`,
      graphCallId: `graph-call://t182/${runId}`,
      frameId: `frame://t182/${runId}`,
      vectorIndex: 0,
      edge: edgeName,
      actorInvocationId: `actor-invocation://t182/${runId}`,
      attemptIndex: 0,
      dispatchRef: `dispatch://t182/${runId}`,
      workerId: "worker://t182/synthetic",
      backendId: "backend://t182/synthetic",
      resultRef: `fp-result://t182/${runId}`,
      sourceProjectionRef: `projection://t182/${runId}`,
      expectedAssessmentIds: [],
      retryFrontierRef: `retry-frontier://t182/${runId}`,
      retryReasonClasses: [],
      pluginTraversalObserverBindingRef: null,
      observerPromptRef: null,
      promptTemplateRef: null,
      defaultsBundleRef: null,
      defaultsBundleDigest: null
    },
    runId
  });
}

function reviewGradeAssessment(manifest, overrides = {}) {
  const obligationIds = manifest.traversalObligationContext.obligations.map(
    (obligation) => obligation.obligationId
  );
  const evidenceRef = pathToFileURL(manifest.outputFile).href;
  const acceptedAuthorityRef =
    "authority://odd-sdlc/t182/accepted-implementation-depth";
  const findings = obligationIds.map((obligationId) => ({
    kind: "sdlc_review_grade_obligation_finding",
    obligationId,
    fulfillmentStatus: "fulfilled",
    failureClass: null,
    requiredAction: null,
    evidenceRefs: [evidenceRef],
    acceptedAuthorityRefs: [acceptedAuthorityRef],
    rationale:
      "Reviewed generated asset semantics against the accepted implementation-depth authority row."
  }));
  return {
    kind: "sdlc_review_grade_edge_fulfillment_assessment",
    assessmentVersion: "ts-review-grade-v1",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    status: "passed",
    reviewedObligationIds: obligationIds,
    findings,
    evidenceRefs: [evidenceRef, acceptedAuthorityRef],
    summary:
      "Every traversal obligation was reviewed against accepted upstream authority and generated asset evidence.",
    ...overrides
  };
}

function writeAssessment(manifest, assessment) {
  mkdirSync(manifest.archiveRoot, { recursive: true });
  const outputFile = path.join(
    manifest.archiveRoot,
    REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE
  );
  writeFileSync(outputFile, `${JSON.stringify(assessment, null, 2)}\n`, "utf8");
  return outputFile;
}

function shallowImplementationDesignRegister(manifest) {
  const evidenceRef = pathToFileURL(manifest.outputFile).href;
  return {
    kind: "sdlc_design_depth_register",
    registerVersion: "ts-design-depth-v1",
    targetAssetType: "implementation_design_surface",
    stackProfileRows: [],
    implementationModuleRows: [
      {
        kind: "sdlc_implementation_module_row",
        moduleName: "app",
        moduleRef: "module://app"
      }
    ],
    aggregateDomainModelRows: [],
    moduleSchemaFragments: [],
    moduleStateDiagramFragments: [],
    aggregateDomainModel: null,
    sunnyDaySequenceRows: [],
    aggregateSunnyDaySequence: null,
    componentTopologyRows: [
      {
        kind: "sdlc_component_topology_row",
        componentId: "app",
        moduleName: "app",
        relativePath: "src/app.js",
        publicBoundary: "Program entrypoint",
        concernRole: "other",
        requirementIds: ["REQ-T182-001"],
        sourceAssetRefs: []
      }
    ],
    componentRealizationRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId: "app",
        moduleName: "app",
        relativePath: "src/app.js",
        publicBoundary: "Program entrypoint",
        trancheId: null,
        firstProductFileToChange: "src/app.js",
        upstreamComponentIds: [],
        requirementIds: ["REQ-T182-001"],
        sourceAssetRefs: [evidenceRef]
      }
    ],
    fileTargetRows: [
      {
        kind: "sdlc_file_target_row",
        relativePath: "src/app.js",
        role: "source"
      }
    ],
    designCompletenessVerdict: null
  };
}

test("T-182 ticket and design declare one review-grade fulfillment surface", () => {
  const ticket = readRepoFile(
    ".ai-workspace/tickets/active/T-182-strengthen-fp-review-grade-edge-fulfillment-assessments.md"
  );
  const design = readRepoFile(
    "build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md"
  );

  assert.match(ticket, /There is no new `code_review_ledger`/u);
  assert.match(ticket, /SdlcWorkerObligationAssessment rows/u);
  assert.match(ticket, /SdlcEdgeFulfillmentLedger/u);
  assert.match(ticket, /F_P owns semantic asset adequacy review/u);
  assert.match(design, /#### Review-Grade Edge Fulfillment Rule/u);
  assert.match(design, /SdlcReviewGradeEdgeFulfillmentAssessment/u);
  assert.match(
    design,
    /existing\s+`SdlcWorkerObligationAssessment -> SdlcEdgeFulfillmentLedger`\s+path/u
  );
});

test("T-182 review-grade assessment is required for generated worker assets", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const intentManifest = manifestForEdge(
      workspaceRoot,
      "derive_intent_surface",
      "t182-required-intent"
    );
    const codeManifest = manifestForEdge(
      workspaceRoot,
      "derive_component_code_surface",
      "t182-required-code"
    );
    const testManifest = manifestForEdge(
      workspaceRoot,
      "derive_component_test_surface",
      "t182-required-test"
    );
    const designManifest = manifestForEdge(
      workspaceRoot,
      "derive_implementation_design_surface",
      "t182-required-design"
    );
    assert.equal(reviewGradeEdgeFulfillmentAssessmentRequired(intentManifest), true);
    assert.equal(reviewGradeEdgeFulfillmentAssessmentRequired(codeManifest), true);
    assert.equal(reviewGradeEdgeFulfillmentAssessmentRequired(testManifest), true);
    assert.equal(reviewGradeEdgeFulfillmentAssessmentRequired(designManifest), true);

    const artifact = SDLC_OPERATOR_RUN_ARTIFACT_CATALOG.find(
      (row) =>
        row.artifactRef ===
        "operator-run-artifact://review-grade-edge-fulfillment-assessment"
    );
    const processStartedArtifact = SDLC_OPERATOR_RUN_ARTIFACT_CATALOG.find(
      (row) =>
        row.artifactRef ===
        "operator-run-artifact://review-grade-edge-fulfillment-process-started"
    );
    assert.ok(artifact);
    assert.ok(processStartedArtifact);
    const module = constructSdlcGtlModule();
    const targetCarrierRegistry = constructSdlcTargetCarrierRegistry({ module });
    const overlayCatalog = constructSdlcTraversalOverlayCatalog({ module });
    const productGraph = constructSdlcProductGraphContractCatalog({
      module,
      edgeContracts: SDLC_EDGE_GAIN_CLOSURE_CONTRACTS,
      targetCarrierRows: targetCarrierRegistry.rows,
      overlays: overlayCatalog.overlays
    });
    const intentPolicy = requireSdlcProductGraphContractRow({
      catalog: productGraph,
      edgeRef: "derive_intent_surface"
    });
    const designPolicy = requireSdlcProductGraphContractRow({
      catalog: productGraph,
      edgeRef: "derive_implementation_design_surface"
    });
    const codePolicy = SDLC_PRODUCT_GRAPH_EDGE_POLICY_ROWS.find(
      (row) => row.edgeRef === "derive_component_code_surface"
    );
    const testPolicy = SDLC_PRODUCT_GRAPH_EDGE_POLICY_ROWS.find(
      (row) => row.edgeRef === "derive_component_test_surface"
    );
    assert.ok(codePolicy);
    assert.ok(testPolicy);
    assert.ok(
      codePolicy.requiredArtifactRefs.includes(
        "operator-run-artifact://review-grade-edge-fulfillment-assessment"
      )
    );
    assert.ok(
      intentPolicy.requiredArtifactRefs.includes(
        "operator-run-artifact://review-grade-edge-fulfillment-assessment"
      )
    );
    assert.ok(
      intentPolicy.requiredArtifactRefs.includes(
        "operator-run-artifact://review-grade-edge-fulfillment-process-started"
      )
    );
    assert.ok(
      designPolicy.requiredArtifactRefs.includes(
        "operator-run-artifact://review-grade-edge-fulfillment-assessment"
      )
    );
    assert.ok(
      designPolicy.requiredArtifactRefs.includes(
        "operator-run-artifact://review-grade-edge-fulfillment-process-started"
      )
    );
    assert.ok(
      testPolicy.requiredArtifactRefs.includes(
        "operator-run-artifact://review-grade-edge-fulfillment-assessment"
      )
    );
    assert.equal(
      isSdlcOperatorRunArtifactRequiredForContext({
        artifact,
        context: {
          edgeRef: "derive_intent_surface",
          targetAssetType: "intent_surface",
          closureDisposition: "close",
          selectedDependencyTraversalMethods: [],
          productGraphRequiredArtifactRefs: intentPolicy.requiredArtifactRefs
        }
      }),
      true
    );
    assert.equal(
      isSdlcOperatorRunArtifactRequiredForContext({
        artifact: processStartedArtifact,
        context: {
          edgeRef: "derive_intent_surface",
          targetAssetType: "intent_surface",
          closureDisposition: "close",
          selectedDependencyTraversalMethods: [],
          productGraphRequiredArtifactRefs: intentPolicy.requiredArtifactRefs
        }
      }),
      true
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-182 admits full review-grade findings and rejects missing or weak assessment rows", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_component_code_surface",
      "t182-admission"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    writeFileSync(
      manifest.outputFile,
      "export function main() { return 'hello'; }\n",
      "utf8"
    );

    const acceptedPath = writeAssessment(manifest, reviewGradeAssessment(manifest));
    const accepted = admitReviewGradeEdgeFulfillmentAssessmentFromArtifact({
      manifest,
      outputFile: acceptedPath
    });
    assert.equal(accepted.status, "admitted");
    assert.equal(accepted.assessment.status, "passed");
    assert.equal(accepted.blockingReasons.length, 0);

    const base = reviewGradeAssessment(manifest);
    const missingReviewed = {
      ...base,
      reviewedObligationIds: base.reviewedObligationIds.slice(1)
    };
    const missingPath = writeAssessment(manifest, missingReviewed);
    const missing = admitReviewGradeEdgeFulfillmentAssessmentFromArtifact({
      manifest,
      outputFile: missingPath
    });
    assert.equal(missing.status, "rejected");
    assert.match(
      missing.blockingReasons.join("\n"),
      /review_grade_obligation_unreviewed/u
    );

    const tagOnlyPretendPass = {
      ...base,
      status: "passed",
      findings: base.findings.map((finding, index) =>
        index === 0
          ? {
              ...finding,
              fulfillmentStatus: "partial",
              failureClass: "semantic_not_realized",
              requiredAction:
                "Replace tag-only evidence with implementation that realizes the accepted component responsibility."
            }
          : finding
      )
    };
    const weakPath = writeAssessment(manifest, tagOnlyPretendPass);
    const weak = admitReviewGradeEdgeFulfillmentAssessmentFromArtifact({
      manifest,
      outputFile: weakPath
    });
    assert.equal(weak.status, "rejected");
    assert.match(weak.blockingReasons.join("\n"), /review_grade_passed_with_open_findings/u);

    const duplicateCoverage = {
      ...base,
      reviewedObligationIds: [
        base.reviewedObligationIds[0],
        ...base.reviewedObligationIds
      ],
      findings: [base.findings[0], ...base.findings],
      evidenceRefs: []
    };
    const duplicatePath = writeAssessment(manifest, duplicateCoverage);
    const duplicate = admitReviewGradeEdgeFulfillmentAssessmentFromArtifact({
      manifest,
      outputFile: duplicatePath
    });
    assert.equal(duplicate.status, "rejected");
    assert.match(
      duplicate.blockingReasons.join("\n"),
      /review_grade_assessment_evidence_missing/u
    );
    assert.match(
      duplicate.blockingReasons.join("\n"),
      /review_grade_reviewed_obligation_duplicate/u
    );
    assert.match(
      duplicate.blockingReasons.join("\n"),
      /review_grade_finding_duplicate/u
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-182 admits blocked semantic review as retry pressure with required action", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_component_test_surface",
      "t182-blocked-pressure"
    );
    const base = reviewGradeAssessment(manifest);
    const blockedAssessment = {
      ...base,
      status: "blocked",
      findings: base.findings.map((finding, index) =>
        index === 0
          ? {
              ...finding,
              fulfillmentStatus: "blocked",
              failureClass: "test_overlap_missing",
              requiredAction:
                "Add a test that executes the accepted component responsibility and cites the requirement id."
            }
          : finding
      )
    };
    const outputFile = writeAssessment(manifest, blockedAssessment);
    const admission = admitReviewGradeEdgeFulfillmentAssessmentFromArtifact({
      manifest,
      outputFile
    });
    assert.equal(admission.status, "admitted");
    assert.equal(admission.assessment.status, "blocked");
    assert.equal(
      admission.assessment.findings[0].requiredAction,
      "Add a test that executes the accepted component responsibility and cites the requirement id."
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-182 transformer prompts use accepted authority rows and evaluated gaps as the work queue", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_component_code_surface",
      "t182-prompt-pressure"
    );
    const files = writeHandoffFiles(manifest);
    const prompt = readFileSync(files.promptPath, "utf8");

    assert.match(prompt, /Requirement\/Authority\/Asset Checklist/u);
    assert.match(prompt, /work queue/u);
    assert.match(prompt, /Do not return success while required checklist rows are unmapped/u);
    assert.match(prompt, /materialize or repair the named source file/u);
    assert.match(prompt, /Do not satisfy multiple accepted component rows by collapsing them back into one coarse facade/u);

    const installedOperatorSource = readRepoFile(
      "build_tenants/typescript/code/src/operator/installed_operator.ts"
    );
    assert.match(installedOperatorSource, /No other top-level keys are allowed/u);
    assert.match(installedOperatorSource, /No other finding keys are allowed/u);
    assert.match(
      installedOperatorSource,
      /sourceAssetCarryover, sourceAssetStatus, confidence/u
    );
    assert.match(
      installedOperatorSource,
      /Verify every finding key set is exactly kind, obligationId, fulfillmentStatus/u
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-182 design-depth admission rejects source rows without accepted evidence refs", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_implementation_design_surface",
      "t182-depth-evidence"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    writeFileSync(manifest.outputFile, "# Implementation design\n", "utf8");
    const registerPath = designDepthFpEvaluatorRegisterPath(manifest);
    mkdirSync(path.dirname(registerPath), { recursive: true });
    writeFileSync(
      registerPath,
      `${JSON.stringify(shallowImplementationDesignRegister(manifest), null, 2)}\n`,
      "utf8"
    );

    const admission = admitImplementationDesignRegisterCandidateForManifest({
      manifest
    });
    assert.equal(admission.status, "rejected");
    assert.match(
      admission.blockingReasons.join("\n"),
      /component_topology_evidence_refs_missing:app/u
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
