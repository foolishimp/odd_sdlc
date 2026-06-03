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
  admitSdlcEdgeEvidence,
  REVIEW_GRADE_EDGE_FULFILLMENT_ASSESSMENT_FILE,
  admitReviewGradeEdgeFulfillmentAssessmentFromArtifact,
  constructSdlcGtlModule,
  constructSdlcProductGraphContractCatalog,
  constructSdlcTargetCarrierRegistry,
  constructSdlcTraversalOverlayCatalog,
  deriveSdlcEdgeAssuranceCloseDecision,
  deriveSdlcEdgeObligations,
  deriveSdlcEdgeResidualPressure,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  isSdlcOperatorRunArtifactRequiredForContext,
  materializeSdlcProjectConformance,
  measureSdlcEdgeGain,
  requireSdlcProductGraphContractRow,
  reviewGradeEdgeFulfillmentAssessmentPressureRefs,
  reviewGradeEdgeFulfillmentAssessmentRequired,
  reviewGradeEdgeFulfillmentOpenPressureRefs,
  reviewGradeFindingsAreDownstreamStagePressure,
  reviewGradeReadOnlyInputMutationReasons,
  snapshotReviewGradeReadOnlyInputFiles,
  SDLC_EDGE_GAIN_CLOSURE_CONTRACTS,
  SDLC_OPERATOR_RUN_ARTIFACT_CATALOG,
  SDLC_PRODUCT_GRAPH_EDGE_POLICY_ROWS,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";
import {
  admitImplementationDesignRegisterCandidateForManifest,
  admitImplementationDesignRegisterForManifest,
  designDepthFpEvaluatorRegisterPath
} from "../../build/semantic/code/src/operator/plugins/evaluate/design_depth_register.js";

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
    fulfillmentBinding:
      manifest.targetAssetType === "component_code_surface"
        ? {
            kind: "sdlc_requirement_function_fulfillment_binding",
            requirementRef: obligationId,
            productRequirementRef: obligationId,
            designObligationRef: acceptedAuthorityRef,
            componentRef: "component://t182/app",
            productTargetRef: pathToFileURL(manifest.outputFile).href,
            codeSurfaceRef: "code-surface://t182/src/app.js",
            functionOrEntrypointRef: "entrypoint://t182/app-main",
            realizationEvidenceRefs: [evidenceRef],
            testOrExecutionEvidenceRefs: [
              `finding://t182/review-grade/${encodeURIComponent(obligationId)}`
            ],
            evaluatorFindingRef: `finding://t182/review-grade/${encodeURIComponent(obligationId)}`
          }
        : null,
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

test("T-183 ticket absorbs review-grade fulfillment into the one edge ledger surface", () => {
  const ticket = readRepoFile(
    ".ai-workspace/tickets/completed/T-183-delete-fd-semantic-registers-and-restore-bare-admission.md"
  );
  const design = readRepoFile(
    "build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md"
  );

  assert.match(ticket, /review-grade asset adequacy/u);
  assert.match(ticket, /SdlcEdgeFulfillmentLedger/u);
  assert.match(ticket, /F_P evaluates ambiguity/u);
  assert.match(ticket, /Do not create a second review ledger/u);
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
    const codeProjectionManifest = manifestForEdge(
      workspaceRoot,
      "derive_code_surface",
      "t182-projection-code"
    );
    assert.equal(reviewGradeEdgeFulfillmentAssessmentRequired(intentManifest), true);
    assert.equal(reviewGradeEdgeFulfillmentAssessmentRequired(codeManifest), true);
    assert.equal(reviewGradeEdgeFulfillmentAssessmentRequired(testManifest), true);
    assert.equal(reviewGradeEdgeFulfillmentAssessmentRequired(designManifest), true);
    assert.equal(
      reviewGradeEdgeFulfillmentAssessmentRequired(codeProjectionManifest),
      false
    );

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
    assert.equal(
      accepted.assessment.findings[0].fulfillmentBinding.functionOrEntrypointRef,
      "entrypoint://t182/app-main"
    );

    const base = reviewGradeAssessment(manifest);
    const missingFunctionBinding = {
      ...base,
      findings: base.findings.map((finding, index) =>
        index === 0
          ? {
              ...finding,
              fulfillmentBinding: null
            }
          : finding
      )
    };
    const missingBindingPath = writeAssessment(manifest, missingFunctionBinding);
    const missingBinding = admitReviewGradeEdgeFulfillmentAssessmentFromArtifact({
      manifest,
      outputFile: missingBindingPath
    });
    assert.equal(missingBinding.status, "rejected");
    assert.match(
      missingBinding.blockingReasons.join("\n"),
      /review_grade_function_binding_missing/u
    );

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

test("T-183 edge closure requires review-grade F_P evidence for generated assets", () => {
  const contract = SDLC_EDGE_GAIN_CLOSURE_CONTRACTS.find(
    (candidate) => candidate.edgeRef === "derive_component_code_surface"
  );
  assert.ok(contract);
  const obligationRefs = ["requirement://t183/review-grade-required"];
  const obligations = deriveSdlcEdgeObligations({
    contract,
    obligationRefs
  });
  const ledgerInputs = contract.ledgerInputKinds.map((ledgerInputKind) => ({
    kind: "sdlc_edge_ledger_input_ref",
    ledgerInputKind,
    ledgerRef: `ledger://t183/review-grade-required/${ledgerInputKind}`
  }));

  const rawWorkerAdmission = admitSdlcEdgeEvidence({
    contract,
    obligations,
    candidates: [
      {
        kind: "sdlc_edge_evidence_candidate",
        evidenceRef: "evidence://t183/raw-worker-self-assessment",
        sourceKind: "worker_assessment",
        obligationRefs,
        supportsBehavioralFulfillment: true
      }
    ]
  });
  assert.equal(rawWorkerAdmission.admittedEvidence.length, 1);
  const rawWorkerGain = measureSdlcEdgeGain({
    contract,
    obligations,
    admittedEvidence: rawWorkerAdmission.admittedEvidence,
    ledgerInputs,
    requiredEvidenceSourceKinds: ["review_grade_assessment"]
  });
  const rawWorkerResidual = deriveSdlcEdgeResidualPressure(rawWorkerGain);
  const rawWorkerDecision = deriveSdlcEdgeAssuranceCloseDecision({
    gain: rawWorkerGain,
    residualPressure: rawWorkerResidual
  });
  assert.equal(rawWorkerDecision.disposition, "retry");
  assert.ok(
    rawWorkerGain.residualPressureRefs.some((ref) =>
      ref.includes("missing-evidence-source") && ref.includes("review_grade_assessment")
    )
  );

  const reviewGradeAdmission = admitSdlcEdgeEvidence({
    contract,
    obligations,
    candidates: [
      {
        kind: "sdlc_edge_evidence_candidate",
        evidenceRef: "evidence://t183/selected-fp-review-grade-assessment",
        sourceKind: "review_grade_assessment",
        obligationRefs,
        supportsBehavioralFulfillment: true
      }
    ]
  });
  const reviewGradeGain = measureSdlcEdgeGain({
    contract,
    obligations,
    admittedEvidence: reviewGradeAdmission.admittedEvidence,
    ledgerInputs,
    requiredEvidenceSourceKinds: ["review_grade_assessment"]
  });
  const reviewGradeResidual = deriveSdlcEdgeResidualPressure(reviewGradeGain);
  const reviewGradeDecision = deriveSdlcEdgeAssuranceCloseDecision({
    gain: reviewGradeGain,
    residualPressure: reviewGradeResidual
  });
  assert.equal(reviewGradeDecision.disposition, "close");
});

test("T-182 wrong-stage review findings are downstream pressure, not same-edge retry", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_test_design_surface",
      "t182-wrong-stage-pressure"
    );
    const base = reviewGradeAssessment(manifest);
    const requirementFinding = base.findings.find((finding) =>
      finding.obligationId.startsWith("requirement:")
    );
    assert.notEqual(requirementFinding, undefined);
    const wrongStageFindings = [requirementFinding].map((finding) => ({
      ...finding,
      fulfillmentStatus: "partial",
      failureClass: "wrong_stage",
      requiredAction:
        "Carry this implementation obligation to the component code surface; the current test-design surface may only reference the test topology."
    }));
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure(wrongStageFindings),
      true
    );
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure([
        {
          ...wrongStageFindings[0],
          failureClass: "trace_missing",
          requiredAction:
            "Add missing accepted requirement trace evidence to the current asset."
        }
      ]),
      false
    );
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure([
        {
          ...wrongStageFindings[0],
          obligationId: "target_asset:test_design_surface",
          requiredAction:
            "Carry this target-asset problem to a downstream surface."
        }
      ]),
      false
    );
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure([
        {
          ...wrongStageFindings[0],
          fulfillmentStatus: "blocked"
        }
      ]),
      false
    );
    assert.deepEqual(
      reviewGradeEdgeFulfillmentAssessmentPressureRefs({
        runRef: "t182-wrong-stage-pressure",
        assessment: {
          ...base,
          status: "blocked",
          findings: wrongStageFindings
        }
      }),
      []
    );
    const downstreamTestFinding = {
      ...wrongStageFindings[0],
      failureClass: "test_overlap_missing",
      requiredAction:
        "Materialize the downstream component_test_surface proof target and capture npm test execution evidence."
    };
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure([downstreamTestFinding], {
        targetAssetType: "component_code_surface"
      }),
      true
    );
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure([downstreamTestFinding], {
        targetAssetType: "component_test_surface"
      }),
      false
    );
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure([downstreamTestFinding]),
      false
    );
    assert.deepEqual(
      reviewGradeEdgeFulfillmentAssessmentPressureRefs({
        runRef: "t182-code-downstream-test-pressure",
        targetAssetType: "component_code_surface",
        assessment: {
          ...base,
          status: "blocked",
          findings: [downstreamTestFinding]
        }
      }),
      []
    );
    assert.notDeepEqual(
      reviewGradeEdgeFulfillmentAssessmentPressureRefs({
        runRef: "t182-test-edge-open-test-pressure",
        targetAssetType: "component_test_surface",
        assessment: {
          ...base,
          status: "blocked",
          findings: [downstreamTestFinding]
        }
      }),
      []
    );
    const downstreamExecutionFinding = {
      ...wrongStageFindings[0],
      failureClass: "execution_environment",
      requiredAction:
        "Produce admitted test-execution edge execution evidence for the generated test shards."
    };
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure([downstreamExecutionFinding], {
        targetAssetType: "component_test_surface"
      }),
      true
    );
    assert.equal(
      reviewGradeFindingsAreDownstreamStagePressure([downstreamExecutionFinding], {
        targetAssetType: "component_code_surface"
      }),
      false
    );
    assert.deepEqual(
      reviewGradeEdgeFulfillmentAssessmentPressureRefs({
        runRef: "t182-test-downstream-execution-pressure",
        targetAssetType: "component_test_surface",
        assessment: {
          ...base,
          status: "blocked",
          findings: [downstreamExecutionFinding]
        }
      }),
      []
    );
    assert.deepEqual(
      reviewGradeEdgeFulfillmentOpenPressureRefs({
        runRef: "t182-wrong-stage-pressure",
        assessments: wrongStageFindings.map((finding) => ({
          kind: "sdlc_worker_obligation_assessment",
          obligationId: finding.obligationId,
          fulfillmentStatus: finding.fulfillmentStatus,
          evidenceRefs: finding.evidenceRefs,
          blockingReasons: [
            `requirement_carried_for_downstream_closure:${finding.obligationId.replace(/^requirement:/u, "")}`
          ],
          reviewGrade: true,
          reviewFailureClass: finding.failureClass,
          requiredAction: finding.requiredAction,
          semanticEvidenceRefs: finding.evidenceRefs,
          acceptedAuthorityRefs: finding.acceptedAuthorityRefs,
          fulfillmentBinding: null
        }))
      }),
      []
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-182 review-grade prompt routes lawful downstream carryover through wrong_stage", () => {
  const source = readRepoFile(
    "build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts"
  );
  assert.match(
    source,
    /requirement_carried_for_downstream_closure:/u
  );
  assert.match(
    source,
    /requirement_recorded_for_future_closure:/u
  );
  assert.match(
    source,
    /exact worker_result_report obligation assessment with requirement_recorded_for_future_closure:/u
  );
  assert.match(
    source,
    /mark that finding partial with failureClass wrong_stage/u
  );
  assert.match(
    source,
    /wrong_stage is only for lawful downstream carryover/u
  );
});

test("T-183 scalar F_P evaluation carries open review-grade pressure", () => {
  const pressureRefs = reviewGradeEdgeFulfillmentOpenPressureRefs({
    runRef: "t183-scalar-review-grade",
    assessments: [
      {
        kind: "sdlc_worker_obligation_assessment",
        obligationId: "requirement://t183/raw-worker-blocked",
        fulfillmentStatus: "blocked",
        evidenceRefs: ["evidence://t183/raw-worker"],
        blockingReasons: ["raw_worker_blocked"]
      },
      {
        kind: "sdlc_worker_obligation_assessment",
        obligationId: "requirement://t183/review-grade-open",
        fulfillmentStatus: "partial",
        evidenceRefs: ["evidence://t183/review-grade"],
        blockingReasons: ["semantic_not_realized"],
        reviewGrade: true,
        reviewFailureClass: "semantic_not_realized",
        requiredAction: "Connect the accepted requirement to the public runtime entrypoint.",
        semanticEvidenceRefs: ["evidence://t183/review-grade/finding"],
        acceptedAuthorityRefs: ["requirement://t183/review-grade-open"]
      },
      {
        kind: "sdlc_worker_obligation_assessment",
        obligationId: "requirement://t183/review-grade-fulfilled",
        fulfillmentStatus: "fulfilled",
        evidenceRefs: ["evidence://t183/review-grade/fulfilled"],
        blockingReasons: [],
        reviewGrade: true,
        reviewFailureClass: null,
        requiredAction: null,
        semanticEvidenceRefs: ["evidence://t183/review-grade/fulfilled/finding"],
        acceptedAuthorityRefs: ["requirement://t183/review-grade-fulfilled"]
      }
    ]
  });

  assert.deepEqual(pressureRefs, [
    "pressure://odd-sdlc/review-grade/t183-scalar-review-grade/requirement%3A%2F%2Ft183%2Freview-grade-open"
  ]);
});

test("T-184 consequence pressure follows selected review-grade assessment truth", () => {
  const fulfilledFinding = {
    kind: "sdlc_review_grade_obligation_finding",
    obligationId: "requirement://t184/review-grade-selected",
    fulfillmentStatus: "fulfilled",
    failureClass: null,
    requiredAction: null,
    evidenceRefs: ["evidence://t184/selected-review"],
    acceptedAuthorityRefs: ["authority://t184/selected-review"],
    fulfillmentBinding: null,
    rationale: "selected review-grade evaluator accepted the obligation"
  };
  const passedAssessment = {
    kind: "sdlc_review_grade_edge_fulfillment_assessment",
    assessmentVersion: "ts-review-grade-v1",
    graphFunctionName: "derive_intent_surface",
    edgeName: "derive_intent_surface",
    targetAssetType: "intent_surface",
    status: "passed",
    reviewedObligationIds: [fulfilledFinding.obligationId],
    findings: [fulfilledFinding],
    evidenceRefs: ["evidence://t184/selected-review"],
    summary: "selected review-grade assessment passed"
  };
  assert.deepEqual(
    reviewGradeEdgeFulfillmentAssessmentPressureRefs({
      runRef: "t184-selected-review",
      assessment: passedAssessment
    }),
    []
  );

  const blockedAssessment = {
    ...passedAssessment,
    status: "blocked",
    findings: [
      {
        ...fulfilledFinding,
        fulfillmentStatus: "partial",
        failureClass: "semantic_not_realized",
        requiredAction: "publish the accepted requirement in the target surface",
        rationale: "selected review-grade evaluator found residual pressure"
      }
    ]
  };
  assert.deepEqual(
    reviewGradeEdgeFulfillmentAssessmentPressureRefs({
      runRef: "t184-selected-review",
      assessment: blockedAssessment
    }),
    [
      "pressure://odd-sdlc/review-grade/t184-selected-review/requirement%3A%2F%2Ft184%2Freview-grade-selected"
    ]
  );
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
    assert.match(prompt, /runtime entrypoint/u);
    assert.match(prompt, /Tenant stack authority must match the product files actually emitted/u);
    assert.match(prompt, /Do not satisfy multiple accepted component rows by collapsing them back into one coarse facade/u);

    const promptSource = readRepoFile(
      "build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts"
    );
    assert.match(promptSource, /No other top-level keys are allowed/u);
    assert.match(promptSource, /No other finding keys are allowed/u);
    assert.match(
      promptSource,
      /sourceAssetCarryover, sourceAssetStatus, confidence/u
    );
    assert.match(
      promptSource,
      /Verify every finding key set is exactly kind, obligationId, fulfillmentStatus/u
    );
    assert.match(
      promptSource,
      /Tool-profile contract: obey the active tool list/u
    );
    assert.match(
      promptSource,
      /bounded workspace-relative read-only inspection/u
    );
    assert.match(
      promptSource,
      /must set limit <=80/u
    );
    assert.match(
      promptSource,
      /Do not manually type or stream a large findings array through stdout/u
    );
    assert.match(
      promptSource,
      /assessment path is output-only and is expected to be absent before evaluation/u
    );
    assert.match(promptSource, /evaluator is read-only over workspace and product files/u);
    assert.match(promptSource, /The only durable JSON output you may create or modify/u);
    assert.match(promptSource, /The only optional sidecar you may create or modify/u);
    assert.match(promptSource, /Do not use apply_patch/u);
    assert.match(
      promptSource,
      /do not include it in missing-input checks/u
    );
    assert.match(
      promptSource,
      /For non-executable planning\/design\/review surfaces, use bounded file inspection/u
    );
    assert.match(
      promptSource,
      /Do not run convenience grep\/count loops, command probes, helper scripts, or payload-printing commands/u
    );
    assert.match(promptSource, /Do not issue parallel tool calls/u);
    assert.match(
      promptSource,
      /Do not convert evaluator-side tool-profile, quoting, type-shape, key-shape, or schema-inspection failures into requirement\/product obligation findings/u
    );
    assert.match(
      promptSource,
      /leave the assessment absent so the framework can classify evaluator failure/u
    );
    assert.match(
      promptSource,
      /worker_construction_brief\.obligations may be an object map rather than an array/u
    );
    assert.match(
      promptSource,
      /Every finding must include at least one acceptedAuthorityRef/u
    );
    assert.match(
      promptSource,
      /For target_asset findings, use the construction brief targetCarrierProjection/u
    );
    assert.match(
      promptSource,
      /every fulfilled finding must provide it, including target_asset, source_asset, module/u
    );
    assert.match(
      promptSource,
      /module-level or source-asset-level carryover/u
    );
    assert.match(
      promptSource,
      /source only exports a helper or function and has no entrypoint path/u
    );
    assert.match(
      promptSource,
      /tenant stack authority contradicts emitted product files/u
    );
    assert.match(
      promptSource,
      /compact stack reconciliation decision/u
    );
    assert.match(
      promptSource,
      /Verify consistency among tenant stack authority, emitted product syntax\/files, declared product targets, declared execution commands, and returned execution evidence/u
    );
    assert.match(
      promptSource,
      /do not repair generated product files or mutate tenant-stack authority/u
    );
    assert.match(
      promptSource,
      /Requirement lineage is transformer-owned semantic evidence/u
    );
    assert.match(
      promptSource,
      /for non-materialized planning surfaces, also inspect the declared outputFile when materializedFiles is empty/u
    );
    assert.match(
      promptSource,
      /the declared output file is the generated asset under review/u
    );
    assert.match(
      promptSource,
      /materializedFiles=\[\] is not by itself a missing-asset blocker/u
    );
    assert.match(
      promptSource,
      /Mark trace_missing when a generated product file is used as fulfillment evidence/u
    );
    assert.match(
      promptSource,
      /compare worker_result_report\.materializedFiles and product_materialization_manifest files to declared product-file targets/u
    );
    assert.match(
      promptSource,
      /undeclared build\/test byproducts or extra product files as materialized product truth/u
    );
    assert.match(
      promptSource,
      /Build outputs, dependency caches, lockfiles, coverage directories, and transient execution artifacts are not fulfillment proof/u
    );
    assert.match(
      promptSource,
      /Allowed execution byproducts may remain only as byproducts/u
    );

    const installedOperatorSource = readRepoFile(
      "build_tenants/typescript/code/src/operator/installed_operator.ts"
    );
    assert.match(
      installedOperatorSource,
      /constrainReviewGradePlanningEvaluatorTools/u
    );
    assert.match(
      installedOperatorSource,
      /function constrainReviewGradePlanningEvaluatorTools[\s\S]*allowedTools: "Read,Write"/u
    );
    assert.doesNotMatch(
      installedOperatorSource,
      /function constrainReviewGradePlanningEvaluatorTools[\s\S]*reviewGradeEdgeRequiresShellTool/u
    );
    assert.doesNotMatch(
      installedOperatorSource,
      /function reviewGradeEdgeRequiresShellTool/u
    );
    assert.match(
      installedOperatorSource,
      /sdlcWorkerTargetUsesShellToolProfile/u
    );
    assert.match(
      readRepoFile(
        "build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts"
      ),
      /sdlcWorkerTargetUsesShellToolProfile/u
    );
    assert.match(
      readRepoFile(
        "build_tenants/typescript/code/src/operator/worker_tool_profile.ts"
      ),
      /component_code_surface[\s\S]*component_test_surface[\s\S]*test_execution_surface[\s\S]*runtime_execution_surface[\s\S]*execution_result_surface/u
    );
    assert.match(
      installedOperatorSource,
      /reason\.reasonClass === "worker_runtime"[\s\S]*reason\.reasonClass === "assurance"[\s\S]*reason\.lawfulReentryPoint === "triage_gap"/u
    );
    const transportSource = readRepoFile(
      "build_tenants/typescript/code/src/operator/transport.ts"
    );
    assert.match(transportSource, /"--tools"[\s\S]*input\.allowedTools/u);
    assert.match(installedOperatorSource, /component_code_surface/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-182 review-grade evaluator mutation guard rejects edited generated inputs", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_component_test_surface",
      "t182-evaluator-mutation"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    writeFileSync(manifest.outputFile, "generated component test surface\n", "utf8");
    const materializedFile = path.join(
      workspaceRoot,
      "build_tenants/typescript/src/app.test.ts"
    );
    mkdirSync(path.dirname(materializedFile), { recursive: true });
    writeFileSync(materializedFile, "test('surface', () => {});\n", "utf8");

    const snapshot = snapshotReviewGradeReadOnlyInputFiles({
      manifest,
      report: {
        outputFile: manifest.outputFile,
        materializedFiles: [
          {
            absolutePath: materializedFile
          }
        ]
      }
    });
    assert.deepEqual(reviewGradeReadOnlyInputMutationReasons({ snapshot }), []);

    writeFileSync(manifest.outputFile, "evaluator edited generated surface\n", "utf8");
    assert.deepEqual(
      reviewGradeReadOnlyInputMutationReasons({ snapshot }),
      [
        `review_grade_evaluator_mutated_input:${pathToFileURL(manifest.outputFile).href}`
      ]
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-183 design-depth structural admission does not become semantic evidence review", () => {
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
    assert.equal(admission.status, "admitted");
    const runtimeAdmission = admitImplementationDesignRegisterForManifest({
      manifest
    });
    assert.equal(runtimeAdmission.status, "rejected");
    assert.deepEqual(runtimeAdmission.blockingReasons, [
      "design_depth_fp_evaluator_register_unadmitted"
    ]);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
