// Validates: T-192 (evaluation grid prompt contract)
import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  constructSdlcEvaluationGridContract
} from "../../build/semantic/code/src/operator/index.js";
import {
  admitSdlcEvaluateContentRegisterArtifactForSelectedIdentity,
  writeDesignDepthRegisterProjectionFromEvaluateContentRegister
} from "../../build/semantic/code/src/operator/plugins/evaluate/content_register.js";

import {
  designDepthFpEvaluatorPromptProjection,
  reviewGradeEdgeFulfillmentPromptProjection
} from "../../build/semantic/code/src/operator/plugins/evaluate/prompts.js";

const evaluatorPromptSource = readFileSync(
  fileURLToPath(
    new URL(
      "../../code/src/operator/plugins/evaluate/prompts.ts",
      import.meta.url
    )
  ),
  "utf8"
);
const launchContractSource = readFileSync(
  fileURLToPath(
    new URL(
      "../../code/src/operator/plugins/transform/launch_contract.ts",
      import.meta.url
    )
  ),
  "utf8"
);
const promptAssetSource = readFileSync(
  fileURLToPath(new URL("../../code/src/operator/prompt_assets.ts", import.meta.url)),
  "utf8"
);

function edgeNameForTargetAssetType(targetAssetType) {
  switch (targetAssetType) {
    case "component_test_surface":
      return "derive_component_test_surface";
    case "test_design_surface":
      return "derive_test_design_surface";
    case "implementation_design_surface":
      return "derive_implementation_design_surface";
    default:
      return "derive_component_code_surface";
  }
}

function minimalManifest(targetAssetType = "component_code_surface", overrides = {}) {
  const {
    edgeName = edgeNameForTargetAssetType(targetAssetType),
    graphFunctionName = edgeName,
    ...remainingOverrides
  } = overrides;
  return {
    graphFunctionName,
    edgeName,
    targetAssetType,
    inputAssetTypes: ["implementation_design_surface"],
    outputFile: "build_tenants/rust_hello_service/src/main.rs",
    traversalObligationContext: {
      obligations: [
        { obligationId: "requirement:req_t192_001" },
        { obligationId: "requirement:req_t192_002" }
      ]
    },
    ...remainingOverrides
  };
}

function materializationContract(required = true) {
  return {
    kind: "sdlc_product_materialization_contract",
    required,
    activeTenant: "t192_tenant",
    selectedOutputRoot: "build_tenants/t192_tenant",
    tenantRoot: "/tmp/t192_tenant",
    relativePathBasis: "tenant_root",
    declaredModuleNames: ["t192_tenant"],
    buildExecutionContract: "undeclared",
    testExecutionContract: "node --test",
    manifestFile: "product_materialization_manifest.json",
    requiredRoles: required ? ["source"] : [],
    executionShards: []
  };
}

function compactManifest(targetAssetType = "component_code_surface", overrides = {}) {
  return {
    ...minimalManifest(targetAssetType, overrides),
    proportionalityProfile: {
      kind: "sdlc_compute_proportionality_profile",
      profileRef: "profile://t192/compact",
      hopClass: "staged",
      selectedGraphVariantRef: "graph-variant://t192/staged",
      inputObligationCount: 2,
      outputRowCount: 1,
      profileClass: "broad",
      maxModules: null,
      maxComponents: 32
    }
  };
}

function invocationScope(inlineObligationIds) {
  return {
    kind: "sdlc_worker_invocation_package",
    featureScope: {
      kind: "sdlc_feature_scope",
      scopeVersion: "ts-scope-v1",
      mode: "full_breadth",
      scopeRef: "scope://t192/full-breadth",
      basisRefs: [],
      includedRequirementRefs: [],
      includedModuleNames: [],
      includedEntityIds: [],
      includedOperationIds: [],
      deferredModuleNames: []
    },
    inlineObligationIds
  };
}

function designDepthProjection() {
  return designDepthFpEvaluatorPromptProjection({
    manifest: minimalManifest("implementation_design_surface"),
    manifestPath: "handoff_manifest.json",
    governanceRef: "config://test/design-depth",
    governancePath: "config/work-category-governance/design_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    workerReportSummaryLines: ["status=passed"],
    contentRegisterPath: "design_depth_fp_evaluator_content_register.json",
    registerProjectionPath: "design_depth_fp_evaluator_register.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    selectedCompositionRef: "composition://t192/selected",
    selectedCompositionDigest: "sha256:t192",
    selectedCompositionSelectionRef: "selection://t192",
    selectedRegimeBindingRef: null,
    tenantToolEnvironment: null
  });
}

function extractMinimumSemanticCheckpointPacket(promptText) {
  const marker = "Minimum semantic checkpoint JSON packet:";
  const markerOffset = promptText.indexOf(marker);
  assert.notEqual(markerOffset, -1);
  const fenceStart = promptText.indexOf("```json", markerOffset);
  assert.notEqual(fenceStart, -1);
  const jsonStart = promptText.indexOf("\n", fenceStart) + 1;
  assert.notEqual(jsonStart, 0);
  const fenceEnd = promptText.indexOf("```", jsonStart);
  assert.notEqual(fenceEnd, -1);
  return JSON.parse(promptText.slice(jsonStart, fenceEnd));
}

function reviewGradeProjection() {
  return reviewGradeEdgeFulfillmentPromptProjection({
    manifest: minimalManifest("component_code_surface", {
      productMaterialization: materializationContract(true)
    }),
    governanceRef: "config://test/review-grade",
    governancePath: "config/work-category-governance/coding_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    assessmentPath: "review_grade_edge_fulfillment_assessment.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    tenantToolEnvironment: null
  });
}

test("T-192 evaluation grid rejects global coverage as a local cell", () => {
  assert.throws(
    () => constructSdlcEvaluationGridContract({
      logicalGridRef: "evaluation-grid://odd-sdlc/t192/invalid",
      physicalExecution: "fused_prompt",
      transformUnits: [
        {
          kind: "sdlc_transform_unit_ref",
          unitRef: "transform-unit://odd-sdlc/t192/unit",
          segmentKey: "unit",
          sourceAssetRefs: ["worker_construction_brief.json"],
          targetAssetRefs: ["assessment.json"],
          obligationRefs: ["requirement:req_t192_001"]
        }
      ],
      evaluationDimensions: [
        {
          kind: "sdlc_evaluation_dimension_ref",
          dimensionRef: "evaluation-dimension://odd-sdlc/t192/global-coverage",
          scope: "cell",
          expectedFindingRef: "evaluation-finding://odd-sdlc/t192/global-coverage"
        }
      ],
      disambiguationCarriers: [
        {
          kind: "sdlc_disambiguation_carrier_ref",
          carrierRef: "disambiguation-carrier://odd-sdlc/t192/unit/global-coverage",
          scopeRef: "transform-unit://odd-sdlc/t192/unit#global-coverage",
          authoritySnapshotRefs: ["worker_construction_brief.json"],
          priorFindingRefs: [],
          lineageRefs: ["requirement:req_t192_001"]
        }
      ],
      expectedFindingRefs: [
        "evaluation-finding://odd-sdlc/t192/global-coverage"
      ],
      abgOutcomeFoldRef:
        "package:@abiogenesis/typescript-tenant@4.1.0-rc.8#abg/m03/iteration_state_action/deriveIterationOutcomeFromRows",
      provenanceRefs: ["REQ-F-ODDSDLC-088"]
    }),
    /not cell dimensions/u
  );
});

test("T-192 evaluator prompt sidecars carry fused logical grids", () => {
  for (const projection of [designDepthProjection(), reviewGradeProjection()]) {
    const grid = projection.invocationAsset.evaluationGridContract;
    assert(grid, "evaluator prompt invocation asset must carry a grid contract");
    assert.equal(grid.kind, "sdlc_evaluation_grid_contract");
    assert.equal(grid.physicalExecution, "fused_prompt");
    assert.equal(grid.transformUnits.length, 1);
    assert(grid.expectedFindingRefs.length >= 4);
    assert.match(grid.abgOutcomeFoldRef, /deriveIterationOutcomeFromRows/u);
    assert.match(projection.promptText, /Evaluation grid contract:/u);
    assert.match(projection.promptText, /Coverage is a structural fold over refs/u);

    const scopes = new Set(grid.evaluationDimensions.map((row) => row.scope));
    assert(scopes.has("cell"));
    assert(scopes.has("fold"));
    assert(scopes.has("relation"));
    assert.equal(
      grid.evaluationDimensions.some(
        (row) => row.scope === "cell" && /coverage|closure|global/u.test(row.dimensionRef)
      ),
      false
    );
  }
});

test("T-192 broad design-depth prompt front-loads first update and summarizes grid refs", () => {
  const obligations = Array.from({ length: 40 }, (_, index) => ({
    obligationId: `requirement:req_t192_design_broad_${String(index + 1).padStart(3, "0")}`
  }));
  const projection = designDepthFpEvaluatorPromptProjection({
    manifest: minimalManifest("implementation_design_surface", {
      traversalObligationContext: {
        obligations
      }
    }),
    manifestPath: "handoff_manifest.json",
    governanceRef: "config://test/design-depth",
    governancePath: "config/work-category-governance/design_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    workerReportSummaryLines: ["status=passed"],
    contentRegisterPath: "design_depth_fp_evaluator_content_register.json",
    registerProjectionPath: "design_depth_fp_evaluator_register.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    selectedCompositionRef: "composition://t192/selected",
    selectedCompositionDigest: "sha256:t192",
    selectedCompositionSelectionRef: "selection://t192",
    selectedRegimeBindingRef: null,
    tenantToolEnvironment: null
  });

  assert(
    projection.promptText.indexOf("Immediate first-update protocol:") <
      projection.promptText.indexOf("Evaluation grid contract:")
  );
  assert.match(
    projection.promptText,
    /First tool action: Read only the existing draft content ledger/u
  );
  assert.match(
    projection.promptText,
    /Second tool action: write the exact first-update JSON packet/u
  );
  assert.match(
    projection.promptText,
    /Do not inspect the construction brief, ADR\/output artifact/u
  );
  assert.match(
    projection.promptText,
    /read-before-write policy/u
  );
  assert.match(
    projection.promptText,
    /"contentKind": "sdlc_design_depth_register_fragment"/u
  );
	  assert.match(
	    projection.promptText,
	    /"section": "designCompletenessVerdict"/u
	  );
	  assert.match(
	    projection.promptText,
	    /Progress-timeout protection:/u
	  );
	  assert.match(
	    projection.promptText,
	    /component\/file-target semantic checkpoint/u
	  );
	  assert.match(
	    projection.promptText,
	    /Minimum semantic checkpoint:/u
	  );
	  assert.match(
	    projection.promptText,
	    /Minimum semantic checkpoint JSON packet:/u
	  );
	  assert.match(
	    projection.promptText,
	    /every design-depth fragment section must be present/u
	  );
	  assert.match(
	    projection.promptText,
	    /stackProfileRows, implementationModuleRows, componentTopologyRows, componentRealizationRows, and fileTargetRows must be non-empty/u
	  );
	  assert.match(
	    projection.promptText,
	    /"section": "stackProfileRows"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"section": "implementationModuleRows"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"section": "fileTargetRows"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"section": "componentTopologyRows"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"section": "componentRealizationRows"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"kind": "sdlc_file_target_row"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"kind": "sdlc_stack_profile_row"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"kind": "sdlc_implementation_module_row"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"kind": "sdlc_component_topology_row"/u
	  );
	  assert.match(
	    projection.promptText,
	    /"kind": "sdlc_component_realization_row"/u
	  );
	  assert.match(
	    projection.promptText,
	    /Include stackProfileRows and implementationModuleRows in the minimum checkpoint/u
	  );
	  assert.match(
	    projection.promptText,
	    /Do not wait to enumerate every component\/module before this checkpoint/u
	  );
	  assert.match(
	    projection.promptText,
	    /precomputed ADR implementation-design evidence summary/u
	  );
	  assert.doesNotMatch(
	    projection.promptText,
	    /Full partial checkpoint JSON packet:/u
	  );
	  assert.match(
	    projection.promptText,
	    /fileTargetRows plus matching componentTopologyRows and componentRealizationRows/u
	  );
	  assert.match(
	    projection.promptText,
	    /Precomputed ADR implementation-design evidence summary:/u
	  );
	  assert.match(
	    projection.promptText,
	    /The next progress checkpoint after the first update is the component\/file-target semantic checkpoint/u
	  );
	  assert.match(
	    projection.promptText,
	    /do not write a plan or checklist/u
	  );
	  assert.doesNotMatch(
	    projection.promptText,
	    /write a short plan and checklist/u
	  );
	  assert.doesNotMatch(
	    projection.promptText,
	    /intentionally carries empty\/null partial values/u
	  );
  assert.match(
    projection.promptText,
    /obligationRefs=count=40; head=requirement:req_t192_design_broad_001/u
  );
  assert.match(
    projection.promptText,
    /tail=requirement:req_t192_design_broad_038, requirement:req_t192_design_broad_039, requirement:req_t192_design_broad_040/u
  );
	  assert.doesNotMatch(
	    projection.promptText,
	    /requirement:req_t192_design_broad_025/u
	  );
	});

test("T-192 design-depth minimum checkpoint packet is admitted and projectable", () => {
  const projection = designDepthProjection();
  const checkpoint = extractMinimumSemanticCheckpointPacket(projection.promptText);
  assert(JSON.stringify(checkpoint).length < 12500);
  const workspaceRoot = mkdtempSync(
    path.join(tmpdir(), "odd-sdlc-t192-minimum-checkpoint-")
  );

  try {
    const contentRegisterPath = path.join(
      workspaceRoot,
      "design_depth_fp_evaluator_content_register.json"
    );
    const registerPath = path.join(
      workspaceRoot,
      "design_depth_fp_evaluator_register.json"
    );
    writeFileSync(contentRegisterPath, `${JSON.stringify(checkpoint, null, 2)}\n`, "utf8");

    const admission = admitSdlcEvaluateContentRegisterArtifactForSelectedIdentity({
      registerPath: contentRegisterPath,
      selectedIdentity: {
        selectedCompositionRef: "composition://t192/selected",
        selectedCompositionDigest: "sha256:t192",
        selectedCompositionSelectionRef: "selection://t192",
        selectedRegimeBindingRef: null
      },
      ruleRef: "evaluation-rule://odd-sdlc/design-depth-register/fp",
      authorityFunction: "synthesize_model"
    });
    assert.equal(
      admission.status,
      "admitted",
      admission.blockingReasons?.join(",") ?? "checkpoint rejected"
    );
    assert.notEqual(admission.register, null);
    assert.equal(admission.register.contentRows.length, 12);

    writeDesignDepthRegisterProjectionFromEvaluateContentRegister({
      register: admission.register,
      archiveRoot: workspaceRoot,
      registerPath
    });
    const projected = JSON.parse(readFileSync(registerPath, "utf8"));

    assert.equal(projected.stackProfileRows.length, 1);
    assert.equal(projected.implementationModuleRows.length, 1);
    assert.equal(projected.fileTargetRows.length, 1);
    assert.equal(projected.componentTopologyRows.length, 1);
    assert.equal(projected.componentRealizationRows.length, 1);
    assert.equal(projected.aggregateDomainModelRows.length, 0);
    assert.equal(projected.moduleSchemaFragments.length, 0);
    assert.equal(projected.moduleStateDiagramFragments.length, 0);
    assert.equal(projected.aggregateDomainModel.entities.length, 0);
    assert.equal(projected.sunnyDaySequenceRows.length, 0);
    assert.equal(projected.aggregateSunnyDaySequence.steps.length, 0);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-192 small admitted handoffs render compact fused-grid prompts", () => {
  const broadReview = reviewGradeProjection();
  const compactReview = reviewGradeEdgeFulfillmentPromptProjection({
    manifest: compactManifest("component_code_surface", {
      productMaterialization: materializationContract(true)
    }),
    invocationScope: invocationScope([
      "requirement:req_t192_001",
      "requirement:req_t192_002"
    ]),
    governanceRef: "config://test/review-grade",
    governancePath: "config/work-category-governance/coding_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    assessmentPath: "review_grade_edge_fulfillment_assessment.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    tenantToolEnvironment: null
  });
  const compactDesign = designDepthFpEvaluatorPromptProjection({
    manifest: compactManifest("implementation_design_surface"),
    manifestPath: "handoff_manifest.json",
    governanceRef: "config://test/design-depth",
    governancePath: "config/work-category-governance/design_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    workerReportSummaryLines: ["status=passed"],
    contentRegisterPath: "design_depth_fp_evaluator_content_register.json",
    registerProjectionPath: "design_depth_fp_evaluator_register.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    selectedCompositionRef: "composition://t192/selected",
    selectedCompositionDigest: "sha256:t192",
    selectedCompositionSelectionRef: "selection://t192",
    selectedRegimeBindingRef: null,
    tenantToolEnvironment: null
  });

  assert(compactReview.promptText.length < broadReview.promptText.length);
  assert(compactReview.promptText.length < 24000);
  assert(compactDesign.promptText.length < 25000);
  assert.match(compactReview.promptText, /Small fused evaluation grid mode:/u);
  assert.match(compactDesign.promptText, /Small fused evaluation grid mode:/u);
  assert.match(compactReview.promptText, /fulfillmentBinding shape for fulfilled component_code_surface findings/u);
  assert.match(compactReview.promptText, /evaluatorFindingRef: stable finding ref inside this fulfillmentBinding only/u);
  assert.match(compactReview.promptText, /Progress-timeout protection:/u);
  assert.match(compactReview.promptText, /First assessment checkpoint:/u);
  assert.match(
    compactReview.promptText,
    /First assessment checkpoint JSON must be valid whole-file JSON/u
  );
  assert.match(
    compactReview.promptText,
    /Do not write a plan or checklist before the first assessment checkpoint/u
  );
  assert.doesNotMatch(
    compactReview.promptText,
    /carrier selection, authority compression, trace binding/u
  );
  assert.match(compactReview.promptText, /ABG will fold lawful wrong_stage carryover/u);
  assert.doesNotMatch(
    compactDesign.promptText,
    /Review coverage law: reviewedObligationIds and findings must cover/u
  );
  assert.match(
    compactDesign.promptText,
    /Do not add reviewedObligationIds, findings, summary, status, or other assessment fields to sdlc_evaluate_content_ledger/u
  );
  assert.match(
    compactDesign.promptText,
    /Top-level key set is exactly kind, ledgerVersion, stage, ruleRef, ruleRole, computeMeans, authorityFunction/u
  );
  assert.match(compactDesign.promptText, /payload.section is one of/u);
  assert.match(compactDesign.promptText, /Do not write EvaluationFinding rows/u);
  assert.match(compactDesign.promptText, /Forbidden contentKind values/u);
  assert.match(
    compactDesign.promptText,
    /stackProfileRows\[\] rows are closed objects with exactly kind, stackRef, language, buildTool/u
  );
  assert.match(
    compactDesign.promptText,
    /Entity ownership values are exactly owned, referenced/u
  );
  assert.match(
    compactDesign.promptText,
    /Attribute cardinality values are exactly one, optional, many/u
  );
  assert.match(
    compactDesign.promptText,
    /Attribute cardinality is SDLC schema multiplicity only/u
  );
  assert.match(
    compactDesign.promptText,
    /Do not use product-domain morphism values such as 1:1, N:1, 1:N, M:N, 0\.\.1, 1\.\.1, or 0\.\.\*/u
  );
  assert.match(
    compactDesign.promptText,
    /moduleSchemaFragments\[\]\.entities\[\]: kind "sdlc_domain_entity"/u
  );
  assert.match(
    compactDesign.promptText,
    /sdlc_domain_entity\.attributes\[\]: kind "sdlc_domain_attribute"/u
  );
  assert.match(
    compactDesign.promptText,
    /moduleSchemaFragments\[\]\.operations\[\] and aggregateDomainModel\.operations\[\]: kind "sdlc_domain_operation"/u
  );
  assert.match(
    compactDesign.promptText,
    /aggregateSunnyDaySequence\.steps\[\]: kind "sdlc_sunny_day_sequence_step"/u
  );
  assert.match(
    compactDesign.promptText,
    /Never emit kind "sdlc_sunny_day_step"/u
  );
  assert.match(
    compactDesign.promptText,
    /Reject and rewrite if any nested row kind is sdlc_entity_row, sdlc_attribute_row, sdlc_operation_row, or sdlc_sunny_day_step/u
  );
  assert.match(
    compactDesign.promptText,
    /componentTopologyRows\[\]\.concernRole values are exactly parser, validator, mapper, error_model, io_adapter, reporting, domain_model, other/u
  );
  assert.match(
    compactDesign.promptText,
    /Reject and rewrite if any design-depth row contains field\/value\/sourceRef summary triples/u
  );
});

test("T-204 review-grade compaction uses admitted invocation scope before broad manifest lineage", () => {
  const broadObligations = Array.from({ length: 161 }, (_, index) => ({
    obligationId: `requirement:req_t204_broad_${String(index + 1).padStart(3, "0")}`
  }));
  const scopedObligationIds = broadObligations
    .slice(0, 21)
    .map((row) => row.obligationId);
  const projection = reviewGradeEdgeFulfillmentPromptProjection({
    manifest: compactManifest("component_code_surface", {
      productMaterialization: materializationContract(true),
      traversalObligationContext: {
        obligations: broadObligations
      }
    }),
    invocationScope: invocationScope(scopedObligationIds),
    governanceRef: "config://test/review-grade",
    governancePath: "config/work-category-governance/coding_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    assessmentPath: "review_grade_edge_fulfillment_assessment.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    tenantToolEnvironment: null
  });

  assert.match(projection.promptText, /Small fused evaluation grid mode:/u);
  assert.match(
    projection.promptText,
    /First-blocker protocol: once one current-edge semantic blocker is identified/u
  );
  assert.match(
    projection.promptText,
    /source-dumping grep\/cat\/sed\/tail\/head\/nl commands/u
  );
  assert.match(projection.promptText, /obligationRefs=requirement:req_t204_broad_001/u);
  assert.doesNotMatch(projection.promptText, /requirement:req_t204_broad_022/u);
});

test("T-192 review-grade prompt schema is projected by edge profile", () => {
  const componentTestReview = reviewGradeEdgeFulfillmentPromptProjection({
    manifest: compactManifest("component_test_surface", {
      productMaterialization: materializationContract(true)
    }),
    governanceRef: "config://test/review-grade",
    governancePath: "config/work-category-governance/unit_test_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    assessmentPath: "review_grade_edge_fulfillment_assessment.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    tenantToolEnvironment: null
  });
  const testDesignReview = reviewGradeEdgeFulfillmentPromptProjection({
    manifest: compactManifest("test_design_surface", {
      productMaterialization: materializationContract(false)
    }),
    governanceRef: "config://test/review-grade",
    governancePath: "config/work-category-governance/unit_test_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    assessmentPath: "review_grade_edge_fulfillment_assessment.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    tenantToolEnvironment: null
  });

  assert.doesNotMatch(componentTestReview.promptText, /evaluatorFindingRef/u);
  assert.doesNotMatch(
    componentTestReview.promptText,
    /fulfillmentBinding shape for fulfilled component_code_surface findings/u
  );
  assert.doesNotMatch(componentTestReview.promptText, /component_code_surface/u);
  assert.match(componentTestReview.promptText, /component_test_surface/u);
  assert.match(componentTestReview.promptText, /materializationBindingRelation/u);
  assert(
    componentTestReview.invocationAsset.evaluationGridContract.evaluationDimensions.some(
      (row) => row.dimensionRef.includes("materialization-binding-relation")
    )
  );

  assert.doesNotMatch(testDesignReview.promptText, /evaluatorFindingRef/u);
  assert.doesNotMatch(testDesignReview.promptText, /component_code_surface/u);
  assert.doesNotMatch(testDesignReview.promptText, /materializationBindingRelation/u);
  assert.doesNotMatch(
    testDesignReview.promptText,
    /generated product files named by worker_result_report\.materializedFiles/u
  );
  assert.match(
    testDesignReview.promptText,
    /generated asset artifact named by worker_result_report\.outputFile/u
  );
  assert.equal(
    testDesignReview.invocationAsset.evaluationGridContract.evaluationDimensions.some(
      (row) => row.dimensionRef.includes("materialization-binding-relation")
    ),
    false
  );
});

test("T-192 scoped review prompt closes obligation refs over invocation package", () => {
  const archiveRoot = mkdtempSync(
    path.join(tmpdir(), "odd-sdlc-t192-review-scope-")
  );
  try {
    writeFileSync(
      path.join(archiveRoot, "worker_invocation_package.json"),
      JSON.stringify(
        {
          kind: "sdlc_worker_invocation_package",
          inlineObligationIds: [
            "target_asset:component_test_surface",
            "requirement:t132_hello_world_single_tenant.bootstrap.req_t132_001"
          ]
        },
        null,
        2
      ),
      "utf8"
    );
    const projection = reviewGradeEdgeFulfillmentPromptProjection({
      manifest: compactManifest("component_test_surface", {
        archiveRoot,
        featureScope: {
          mode: "steel_thread"
        },
        productMaterialization: materializationContract(true),
        traversalObligationContext: {
          obligations: [
            { obligationId: "target_asset:component_test_surface" },
            {
              obligationId:
                "requirement:t132_hello_world_single_tenant.bootstrap.req_t132_001"
            },
            {
              obligationId:
                "requirement:t132_hello_world_single_tenant.build_tenants_hello_world_javascript_design_adrs_adr_003_test_design_surface.req_t132_001"
            }
          ]
        }
      }),
      invocationScope: {
        kind: "sdlc_worker_invocation_package",
        featureScope: {
          mode: "steel_thread"
        },
        inlineObligationIds: [
          "target_asset:component_test_surface",
          "requirement:t132_hello_world_single_tenant.bootstrap.req_t132_001"
        ]
      },
      governanceRef: "config://test/review-grade",
      governancePath: "config/work-category-governance/unit_test_build.md",
      constructionBriefPath: "worker_construction_brief.json",
      invocationPackagePath: "worker_invocation_package.json",
      workerReportPath: "worker_result_report.json",
      assessmentPath: "review_grade_edge_fulfillment_assessment.json",
      subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
      tenantToolEnvironment: null
    });

    assert.match(projection.promptText, /obligationCount: 2/u);
    assert.match(projection.promptText, /target_asset:component_test_surface/u);
    assert.match(
      projection.promptText,
      /requirement:t132_hello_world_single_tenant\.bootstrap\.req_t132_001/u
    );
    assert.doesNotMatch(
      projection.promptText,
      /build_tenants_hello_world_javascript_design_adrs_adr_003_test_design_surface/u
    );
    assert.match(
      projection.promptText,
      /reviewedObligationIds and findings must cover exactly every obligationRef above and no other obligation ids/u
    );
    assert.match(
      projection.promptText,
      /cannot enlarge review scope or create findings for generated-artifact requirement aliases/u
    );
  } finally {
    rmSync(archiveRoot, { recursive: true, force: true });
  }
});

test("T-192 prompt constructors are section-first, not rendered-text slices", () => {
  assert.match(promptAssetSource, /SdlcEvaluationGridContract/u);
  assert.match(promptAssetSource, /sdlcPromptSectionForEvaluationGridContract/u);
  assert.doesNotMatch(evaluatorPromptSource, /EVALUATE_AUTHORITY_COMPRESSION_BOUNDARY/u);
  assert.doesNotMatch(evaluatorPromptSource, /\.indexOf\(/u);
  assert.doesNotMatch(evaluatorPromptSource, /bodyText\.indexOf/u);
  assert.match(evaluatorPromptSource, /lineGroups/u);
  assert.doesNotMatch(launchContractSource, /role:\s*"prompt_body"/u);
  assert.match(launchContractSource, /promptForHandoffSections/u);
});
