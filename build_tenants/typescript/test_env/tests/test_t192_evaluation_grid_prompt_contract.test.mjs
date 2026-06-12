// Validates: T-192 (evaluation grid prompt contract)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  constructSdlcEvaluationGridContract
} from "../../build/semantic/code/src/index.js";
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

function minimalManifest(targetAssetType = "component_code_surface") {
  return {
    graphFunctionName: "derive_component_code_surface",
    edgeName: "derive_component_code_surface",
    targetAssetType,
    inputAssetTypes: ["implementation_design_surface"],
    outputFile: "build_tenants/rust_hello_service/src/main.rs",
    traversalObligationContext: {
      obligations: [
        { obligationId: "requirement:req_t192_001" },
        { obligationId: "requirement:req_t192_002" }
      ]
    }
  };
}

function compactManifest(targetAssetType = "component_code_surface") {
  return {
    ...minimalManifest(targetAssetType),
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

function reviewGradeProjection() {
  return reviewGradeEdgeFulfillmentPromptProjection({
    manifest: minimalManifest("component_code_surface"),
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
        "package:@abiogenesis/typescript-tenant@4.0.0-rc.16#abg/m03/iteration_state_action/deriveIterationOutcomeFromRows",
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

test("T-192 small admitted handoffs render compact fused-grid prompts", () => {
  const broadReview = reviewGradeProjection();
  const compactReview = reviewGradeEdgeFulfillmentPromptProjection({
    manifest: compactManifest("component_code_surface"),
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
  assert(compactReview.promptText.length < 20000);
  assert(compactDesign.promptText.length < 25000);
  assert.match(compactReview.promptText, /Small fused evaluation grid mode:/u);
  assert.match(compactDesign.promptText, /Small fused evaluation grid mode:/u);
  assert.doesNotMatch(
    compactReview.promptText,
    /carrier selection, authority compression, trace binding/u
  );
  assert.match(compactReview.promptText, /ABG will fold lawful wrong_stage carryover/u);
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
