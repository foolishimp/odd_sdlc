// Validates: T-187 (F_P evaluator prompt boundary + proportional Min(F_P) dispatch)
import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DESIGN_DEPTH_DRAFT_FRAGMENT_UPDATE_HELPER_CONTRACT_PATH,
  DESIGN_DEPTH_DRAFT_FRAGMENT_UPDATE_HELPER_CONTRACT_REF,
  SDLC_DESIGN_DEPTH_REGISTER_FRAGMENT_DRAFT_CONTENT_KIND,
  SDLC_DESIGN_DEPTH_REGISTER_FRAGMENT_SECTIONS,
  admitSdlcEvaluateContentRegisterArtifactForSelectedIdentity,
  constructDesignDepthDraftFragmentContentRegisterUpdate,
  deriveSdlcConformProjectProfileFromWorkspace,
  writeDesignDepthDraftFragmentContentRegisterUpdate
} from "../../build/semantic/code/src/index.js";
import {
  designDepthFpEvaluatorPrompt,
  reviewGradeEdgeFulfillmentPrompt
} from "../../build/semantic/code/src/operator/plugins/evaluate/prompts.js";
import { proportionalityProfileFromHopSelection } from "../../build/semantic/code/src/operator/plugins/transform/launch_contract.js";

const evaluatorPromptSource = readFileSync(
  fileURLToPath(
    new URL("../../code/src/operator/plugins/evaluate/prompts.ts", import.meta.url)
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
const installedOperatorSource = readFileSync(
  fileURLToPath(
    new URL("../../code/src/operator/installed_operator.ts", import.meta.url)
  ),
  "utf8"
);
const workCategoryGovernanceSources = [
  "coding_build.md",
  "design_build.md",
  "requirements_build.md",
  "uat_test_case_build.md",
  "unit_test_build.md"
].map((filename) =>
  readFileSync(
    fileURLToPath(
      new URL(
        `../../config/work-category-governance/${filename}`,
        import.meta.url
      )
    ),
    "utf8"
  )
);
const requirementsGovernanceSource = readFileSync(
  fileURLToPath(
    new URL(
      "../../config/work-category-governance/requirements_build.md",
      import.meta.url
    )
  ),
  "utf8"
);
const helperContractSource = readFileSync(
  fileURLToPath(
    new URL(
      "../../config/evaluator-helper-contracts/design_depth_draft_fragment_update.md",
      import.meta.url
    )
  ),
  "utf8"
);

function hopSelection(hopClass) {
  return {
    kind: "sdlc_traversal_hop_selection",
    selectionRef: "selection://odd-sdlc/t187",
    outcomeClass: "domain_product",
    hopClass,
    selectedGraphVariantRef: `graph-variant://odd-sdlc/${hopClass}`,
    complexityAssessment: {
      kind: "sdlc_traversal_complexity_assessment",
      inputObligationCount: 1,
      outputRowCount: 1
    },
    zoomAdmission: {
      kind: "sdlc_zoom_admission_decision",
      disposition: "continue",
      reasonRefs: [],
      selectedZoomStageRef: null
    },
    pressurePreservation: {
      kind: "sdlc_min_fp_pressure_preservation_decision",
      mechanism: "outcome_class_graph_variant"
    },
    rejectedAlternativeRefs: [],
    blockingReasons: [],
    evidenceRefs: []
  };
}

function makeConformanceWorkspace(name, constraintsText) {
  const root = mkdtempSync(path.join(tmpdir(), `${name}-`));
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    `${constraintsText.trim()}\n`,
    "utf8"
  );
  return root;
}

function designDepthDraftRegister() {
  const sourceRef = "file:///tmp/t187/implementation_design_surface.md";
  return {
    kind: "sdlc_evaluate_content_register",
    registerVersion: "ts-evaluate-content-register-v1",
    stage: "evaluate.C",
    ruleRef: "evaluation-rule://odd-sdlc/design-depth-register/fp",
    ruleRole: "semantic_judgment",
    computeMeans: "F_P",
    authorityFunction: "synthesize_model",
    selectedCompositionRef: "composition://t187/selected",
    selectedCompositionDigest: "sha256:t187",
    selectedCompositionSelectionRef: "selection://t187",
    selectedRegimeBindingRef: "regime://t187/fp",
    compositionContributionRef: "regime://t187/fp",
    sourceBasisRefs: [sourceRef],
    candidateArtifactRefs: [sourceRef],
    evidenceRefs: [sourceRef],
    contentRows: SDLC_DESIGN_DEPTH_REGISTER_FRAGMENT_SECTIONS.map((section, index) => ({
      kind: "sdlc_evaluate_content_register_row",
      rowRef: `content-register-row-draft://odd-sdlc/design-depth/${section}`,
      authorityFunction: "synthesize_model",
      carrierFamily: "ProductAssetModel",
      contentKind: SDLC_DESIGN_DEPTH_REGISTER_FRAGMENT_DRAFT_CONTENT_KIND,
      payload: {
        kind: "sdlc_design_depth_register_fragment",
        fragmentVersion: "ts-design-depth-fragment-v1",
        targetAssetType: "implementation_design_surface",
        section,
        sequence: index + 1,
        mergeMode: "replace",
        value: null
      },
      sourceBasisRefs: [sourceRef],
      evidenceRefs: [sourceRef]
    }))
  };
}

function maxLineLength(text) {
  return text.split(/\r?\n/u).reduce(
    (max, line) => Math.max(max, line.length),
    0
  );
}

// A-050: the admitted Min(F_P)/proportionality fact is projected into the brief
// as a bounded profile, projected from the existing SdlcTraversalHopSelection
// (not a new authority carrier).
test("T-187 absent hop selection yields a broad unreduced budget (data-mapper/domain_product scale)", () => {
  const profile = proportionalityProfileFromHopSelection(null);
  assert.equal(profile.profileClass, "broad");
  assert.equal(profile.maxModules, null);
  assert.equal(profile.maxComponents, 32);
  assert.equal(profile.pressureMechanism, "none");
  assert.equal(profile.kind, "sdlc_compute_proportionality_profile");
});

test("T-187 trivial single_hop selection projects a degenerate budget", () => {
  const profile = proportionalityProfileFromHopSelection(hopSelection("single_hop"));
  assert.equal(profile.profileClass, "degenerate");
  assert.equal(profile.maxModules, 1);
  assert.equal(profile.maxComponents, 1);
  assert.equal(profile.hopClass, "single_hop");
  assert.equal(profile.pressureMechanism, "outcome_class_graph_variant");
  assert.equal(profile.kind, "sdlc_compute_proportionality_profile");
});

test("T-187 dual_hop selection projects a compact budget", () => {
  const profile = proportionalityProfileFromHopSelection(hopSelection("dual_hop"));
  assert.equal(profile.profileClass, "compact");
  assert.equal(profile.maxModules, 2);
  assert.equal(profile.maxComponents, 2);
});

test("T-187 staged selection projects a broad budget", () => {
  const profile = proportionalityProfileFromHopSelection(hopSelection("staged"));
  assert.equal(profile.profileClass, "broad");
  assert.equal(profile.maxModules, null);
  assert.equal(profile.maxComponents, 32);
});

test("T-187 briefs reference the admitted proportionality profile, not prose-only budgets", () => {
  assert.match(
    evaluatorPromptSource,
    /construction_brief\.stagePressure\.proportionalityProfile/u
  );
  assert.match(evaluatorPromptSource, /degenerate profile means one module/u);
  assert.match(
    launchContractSource,
    /proportionalityProfile as the admitted proportionality budget/u
  );
});

test("T-187 design-depth first-update helper is carrier mechanics only", () => {
  const draftRegister = designDepthDraftRegister();
  const updates = SDLC_DESIGN_DEPTH_REGISTER_FRAGMENT_SECTIONS.map((section) => ({
    section,
    value: section.endsWith("Rows") || section.endsWith("Fragments") ? [] : null,
    sourceBasisRefs: [`authority://t187/${section}`],
    evidenceRefs: [`evidence://t187/${section}`]
  }));
  const updated = constructDesignDepthDraftFragmentContentRegisterUpdate({
    draftRegister,
    targetAssetType: "implementation_design_surface",
    updates
  });

  assert.equal(updated.selectedCompositionRef, draftRegister.selectedCompositionRef);
  assert.equal(updated.selectedCompositionDigest, draftRegister.selectedCompositionDigest);
  assert.equal(
    updated.selectedCompositionSelectionRef,
    draftRegister.selectedCompositionSelectionRef
  );
  assert.equal(
    updated.selectedRegimeBindingRef,
    draftRegister.selectedRegimeBindingRef
  );
  assert.equal(
    updated.contentRows.some((row) => row.rowRef.startsWith("content-register-row-draft://")),
    false
  );
  assert.equal(
    updated.contentRows.every((row) => row.contentKind === "sdlc_design_depth_register_fragment"),
    true
  );

  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t187-helper-"));
  const registerPath = path.join(root, "design_depth_fp_evaluator_content_register.json");
  writeDesignDepthDraftFragmentContentRegisterUpdate({
    registerPath,
    draftRegister,
    targetAssetType: "implementation_design_surface",
    updates
  });
  const admission = admitSdlcEvaluateContentRegisterArtifactForSelectedIdentity({
    registerPath,
    selectedIdentity: {
      selectedCompositionRef: draftRegister.selectedCompositionRef,
      selectedCompositionDigest: draftRegister.selectedCompositionDigest,
      selectedCompositionSelectionRef: draftRegister.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: draftRegister.selectedRegimeBindingRef
    },
    ruleRef: draftRegister.ruleRef,
    authorityFunction: "synthesize_model",
    computeMeans: "F_P"
  });
  assert.equal(admission.status, "admitted");
});

test("T-187 broad Markdown surfaces group obligation pressure instead of listing every id", () => {
  assert.match(
    launchContractSource,
    /grouped counts plus high-signal samples/u
  );
  assert.match(
    launchContractSource,
    /do not list every id unless the target is a requirement-surface Trace Index/u
  );
  assert.match(
    launchContractSource,
    /Requirement-surface trace closure exception/u
  );
  assert.match(
    launchContractSource,
    /each id must appear verbatim/u
  );
});

test("T-187 requirements governance preserves exact trace ids on requirement surfaces", () => {
  assert.match(requirementsGovernanceSource, /Requirement-surface trace closure/u);
  assert.match(requirementsGovernanceSource, /every active obligation id/u);
  assert.match(requirementsGovernanceSource, /each id must appear verbatim/u);
});

test("T-187 worker prompts forbid outside-workspace home memory reads", () => {
  assert.match(
    launchContractSource,
    /home memory/u
  );
  assert.match(
    launchContractSource,
    /outside-workspace absolute paths/u
  );
});

test("T-187 transform prompts bound terminal output for large authority reads", () => {
  assert.match(
    launchContractSource,
    /function transformWorkerIoDisciplineLines/u
  );
  assert.match(
    launchContractSource,
    /Tool-profile contract: this planning transform process exposes bounded file tools/u
  );
  assert.match(
    launchContractSource,
    /every Read tool call over JSON, Markdown, report, manifest, or source artifacts must set limit <=80/u
  );
  assert.match(
    launchContractSource,
    /IO cap: reads <=80 lines/u
  );
  assert.match(
    launchContractSource,
    /jq\/rg\/cat\/git diff\/status end `\| head -80`/u
  );
  assert.match(
    launchContractSource,
    /sed is inclusive: end-start\+1<=80/u
  );
  assert.match(
    launchContractSource,
    /`200,299p` invalid \(100\), use `200,279p`/u
  );
  assert.match(
    launchContractSource,
    /no bare jq\/rg\/cat/u
  );
});

test("T-187 transform prompts project tenant-declared tool boundaries", () => {
  assert.match(launchContractSource, /tenantToolEnvironment/u);
  assert.match(launchContractSource, /tenant disabled tools/u);
  assert.match(
    launchContractSource,
    /do not run tools the tenant disables/u
  );
  assert.match(launchContractSource, /TECH_STACK\|tech_stack/u);
  assert.match(launchContractSource, /TESTING_TECH_STACK\|testing_tech_stack/u);
});

test("T-187 conformance does not synthesize sandbox execution contracts", () => {
  const inferredWorkspace = makeConformanceWorkspace(
    "odd-sdlc-t187-undeclared-stack",
    `
project:
  name: sandboxed stack
active_tenant: scala_spark
build_tenants:
  scala_spark:
    output_dir: build_tenants/scala_spark
    language: scala
    build_tool: sbt
    module_structure:
      - app-core
    capability_contracts:
      fat_jar: true
      spark_submit_compatible: true
      ledger_json: true
`
  );
  const inferred = deriveSdlcConformProjectProfileFromWorkspace(inferredWorkspace);
  assert.equal(inferred.buildExecutionContract, "undeclared");
  assert.equal(inferred.testExecutionContract, "undeclared");
  assert.equal(inferred.deploymentContract, "undeclared");
  assert.equal(inferred.runtimeObservationContract, "undeclared");

  const declaredWorkspace = makeConformanceWorkspace(
    "odd-sdlc-t187-declared-stack",
    `
project:
  name: declared sandbox stack
active_tenant: tenant_a
build_tenants:
  tenant_a:
    output_dir: build_tenants/tenant_a
    language: typescript
    build_tool: npm
    build_execution_contract: tenant-build-command
    test_runner: tenant-test-command
    deployment_contract: tenant-deploy-command
    runtime_observation_contract: tenant-observe-contract
`
  );
  const declared = deriveSdlcConformProjectProfileFromWorkspace(declaredWorkspace);
  assert.equal(declared.buildExecutionContract, "tenant-build-command");
  assert.equal(declared.testExecutionContract, "tenant-test-command");
  assert.equal(declared.deploymentContract, "tenant-deploy-command");
  assert.equal(declared.runtimeObservationContract, "tenant-observe-contract");
});

test("T-187 review-grade evaluator prompt projects tenant-declared tool boundaries", () => {
  assert.match(evaluatorPromptSource, /Tenant tool boundary/u);
  assert.match(
    evaluatorPromptSource,
    /Tenant disabled tools from currentState\.tenantToolEnvironment/u
  );
  assert.match(
    evaluatorPromptSource,
    /Tenant workspace-local directories from currentState\.tenantToolEnvironment/u
  );
  assert.match(
    evaluatorPromptSource,
    /Tenant environment variables from currentState\.tenantToolEnvironment/u
  );
  assert.match(
    evaluatorPromptSource,
    /Apply currentState\.tenantToolEnvironment before choosing any evaluator tool/u
  );
  assert.match(
    evaluatorPromptSource,
    /Under the default Read\/Write evaluator profile, treat tenant environment variables as declared context only/u
  );
  assert.match(
    evaluatorPromptSource,
    /Preserve their names and do not synthesize, recompute, or overwrite their values/u
  );
  assert.match(
    evaluatorPromptSource,
    /Tenant-declared environment variables are authority metadata/u
  );
  assert.match(
    evaluatorPromptSource,
    /inherit the process environment unchanged/u
  );
  assert.match(
    evaluatorPromptSource,
    /Under the default Read\/Write evaluator profile/u
  );
  assert.match(
    evaluatorPromptSource,
    /do not assign any name listed in currentState\.tenantToolEnvironment\.environmentVariableNames/u
  );
  assert.match(
    evaluatorPromptSource,
    /do not derive them from process\.cwd\(\), \/tmp, \/private\/tmp, user-home, workspace-root fallback directories, or global-cache fallbacks/u
  );
  assert.match(
    evaluatorPromptSource,
    /Do not run tenant-disabled tools for assessment JSON writing/u
  );
  assert.match(
    evaluatorPromptSource,
    /every Read tool call over JSON, Markdown, report, manifest, or source artifacts must set limit <=80/u
  );
});

test("T-187 review-grade prompt renders tenant execution environment details", () => {
  const prompt = reviewGradeEdgeFulfillmentPrompt({
    manifest: {
      graphFunctionName: "derive_component_test_surface",
      edgeName: "derive_component_test_surface",
      targetAssetType: "component_test_surface"
    },
    governanceRef: "config://test",
    governancePath: "config/work-category-governance/unit_test_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    assessmentPath: "review_grade_edge_fulfillment_assessment.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    tenantToolEnvironment: {
      kind: "sdlc_tenant_tool_environment_projection",
      sourceRefs: ["workspace://build_tenants/scala_spark/spec/TECH_STACK.json"],
      disabledTools: ["python3"],
      allowedTools: [],
      workspaceLocalDirectories: [".sbt/", ".coursier/"],
      environmentVariableNames: ["SBT_OPTS", "COURSIER_CACHE"]
    }
  });

  assert.match(prompt, /Tenant disabled tools[^:]*: python3/u);
  assert.match(prompt, /Tenant workspace-local directories[^:]*: \.sbt\/, \.coursier\//u);
  assert.match(prompt, /Tenant environment variables[^:]*: SBT_OPTS, COURSIER_CACHE/u);
  assert.match(prompt, /Tenant-declared environment variables are authority metadata/u);
  assert.match(prompt, /inherit the process environment unchanged/u);
  assert.match(prompt, /Under the default Read\/Write evaluator profile/u);
  assert.match(
    prompt,
    /do not assign any name listed in currentState\.tenantToolEnvironment\.environmentVariableNames/u
  );
  assert.equal(maxLineLength(prompt) <= 1000, true);
});

test("T-187 design-depth evaluator prompt projects tenant-declared tool and read boundaries", () => {
  assert.match(
    evaluatorPromptSource,
    /readonly tenantToolEnvironment\?: SdlcTenantToolEnvironmentProjection/u
  );
  assert.match(
    evaluatorPromptSource,
    /Tenant tool boundary:[\s\S]*tenantToolBoundaryPromptLines\(input\.tenantToolEnvironment\)/u
  );
  assert.match(
    evaluatorPromptSource,
    /explicit workspace\/run-archive paths named in this prompt/u
  );
  assert.match(
    evaluatorPromptSource,
    /every Read tool call over JSON, Markdown, report, manifest, or source artifacts must set limit <=80/u
  );
  assert.match(
    installedOperatorSource,
    /designDepthFpEvaluatorPrompt\(\{[\s\S]*tenantToolEnvironment: tenantToolEnvironmentProjectionFor\(input\.manifest\)/u
  );
});

test("T-188 evaluator prompts keep generated clauses line-inspectable", () => {
  const prompt = designDepthFpEvaluatorPrompt({
    manifest: {
      outputFile:
        "build_tenants/hello_world_javascript/design/adrs/ADR-002-implementation-design-surface.md"
    },
    manifestPath: "handoff_manifest.json",
    governanceRef: "config://test",
    governancePath: "config/work-category-governance/design_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    workerReportSummaryLines: ["status=passed", "obligations=5"],
    contentRegisterPath: "design_depth_fp_evaluator_content_register.json",
    registerProjectionPath: "design_depth_fp_evaluator_register.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    selectedCompositionRef: "composition://t188/selected",
    selectedCompositionDigest: "sha256:t188",
    selectedCompositionSelectionRef: "selection://t188",
    selectedRegimeBindingRef: null,
    tenantToolEnvironment: {
      kind: "sdlc_tenant_tool_environment_projection",
      sourceRefs: ["workspace://build_tenants/hello_world_javascript/spec/TECH_STACK.json"],
      disabledTools: ["python3"],
      allowedTools: [],
      workspaceLocalDirectories: [],
      environmentVariableNames: []
    }
  });

  assert.equal(maxLineLength(prompt) <= 1000, true);
  assert.doesNotMatch(prompt, /At minimum, verify every contentRows/u);
  assert.match(prompt, /default design-depth evaluator process exposes only Read and Write/u);
  assert.match(prompt, /must set limit <=80/u);
  assert.doesNotMatch(prompt, /Prefer bounded Node summaries/u);
  assert.doesNotMatch(prompt, /summarize selected keys with Node/u);
  assert.doesNotMatch(prompt, /run Node snippets/u);
  assert.doesNotMatch(prompt, /run a local JSON check/u);
});

test("T-188 implementation-design prompt keeps design-depth directive sectioned", () => {
  assert.match(
    launchContractSource,
    /compactDesignDepthDirective[\s\S]*\.join\("\\n"\)/u
  );
});

test("T-188 lite design prompt carries tenant stack scalars for design-depth admission", () => {
  assert.match(
    launchContractSource,
    /Implementation design ADR stack profile rows must expose tenant stack authority as scalar design facts/u
  );
  assert.match(
    launchContractSource,
    /language, runtime\/module system, build tool, build config, dependency policy, test runner, and test command/u
  );
  assert.match(
    launchContractSource,
    /Do not omit tenant-declared stack fields that the design-depth register admits/u
  );
  assert.match(
    launchContractSource,
    /not ecosystem defaults/u
  );
});

test("T-188 design-depth evaluator prompt forbids schema-invalid stack scalars", () => {
  assert.match(
    evaluatorPromptSource,
    /stackProfileRows\[\]\.language and stackProfileRows\[\]\.buildTool are required scalar strings/u
  );
  assert.match(
    evaluatorPromptSource,
    /do not emit null inside required scalar fields/u
  );
  assert.match(
    evaluatorPromptSource,
    /Never publish a schema-invalid stack row such as buildTool:null/u
  );
  assert.match(
    evaluatorPromptSource,
    /emit an empty stackProfileRows section or a partial\/blocked designCompletenessVerdict axis/u
  );
});

test("T-188 evaluator prompt does not infer build-config targets from ecosystem convention", () => {
  assert.match(
    evaluatorPromptSource,
    /Include build_config files only when the ADR Product File Targets table, tenant stack authority, or another higher accepted product authority explicitly declares that exact build\/config target/u
  );
  assert.match(
    evaluatorPromptSource,
    /do not infer package\/build files from ecosystem convention/u
  );
});

test("T-188 worker prompt distinguishes current-edge materialization from downstream target design", () => {
  assert.match(
    launchContractSource,
    /current-edge materialized product file targets: none/u
  );
  assert.doesNotMatch(
    launchContractSource,
    /declared product file targets: none/u
  );
});

test("T-187 review-grade evaluator prompt matches the Read/Write tool profile", () => {
  const prompt = reviewGradeEdgeFulfillmentPrompt({
    manifest: {
      graphFunctionName: "derive_component_code_surface",
      edgeName: "derive_component_code_surface",
      targetAssetType: "component_code_surface"
    },
    governanceRef: "config://test",
    governancePath: "config/work-category-governance/coding_build.md",
    constructionBriefPath: "worker_construction_brief.json",
    invocationPackagePath: "worker_invocation_package.json",
    workerReportPath: "worker_result_report.json",
    assessmentPath: "review_grade_edge_fulfillment_assessment.json",
    subworkstreamManifestPath: "evaluate_compute_subworkstream_manifest.json",
    tenantToolEnvironment: {
      kind: "sdlc_tenant_tool_environment_projection",
      sourceRefs: [],
      disabledTools: [],
      allowedTools: [],
      workspaceLocalDirectories: [],
      environmentVariableNames: []
    }
  });

  assert.equal(maxLineLength(prompt) <= 1000, true);
  assert.match(prompt, /default review-grade evaluator process exposes only Read and Write/u);
  assert.match(prompt, /must set limit <=80/u);
  assert.doesNotMatch(prompt, /short local script/u);
  assert.doesNotMatch(prompt, /Node sidecar script/u);
  assert.doesNotMatch(prompt, /shell heredoc/u);
  assert.doesNotMatch(prompt, /run it inside one bounded shell block/u);
  assert.doesNotMatch(prompt, /parse it back/u);
  assert.doesNotMatch(prompt, /child_process/u);
  assert.doesNotMatch(prompt, /spawn\/exec/u);
  assert.doesNotMatch(prompt, /spawning child commands/u);
  assert.match(evaluatorPromptSource, /startsWith, includes, endsWith, and split-style/u);
  assert.match(
    evaluatorPromptSource,
    /Regex quoting mistakes are evaluator failures/u
  );
});

test("T-187 review-grade evaluator prompt keeps probe evidence workspace-local", () => {
  assert.match(
    evaluatorPromptSource,
    /Do not use \/tmp, \/private\/tmp, \$TMPDIR, or outside-workspace paths for temporary probe output/u
  );
  assert.match(
    evaluatorPromptSource,
    /write it under the current operator-run archive or another explicit workspace\/run-archive path named in this prompt/u
  );
  assert.match(
    evaluatorPromptSource,
    /Writable does not mean authoritative/u
  );
});

test("T-187 review-grade evaluator prompt does not admit evaluator helper failures as product findings", () => {
  assert.match(
    evaluatorPromptSource,
    /Do not convert evaluator-side tool-profile, quoting, type-shape, key-shape, or schema-inspection failures into requirement\/product obligation findings/u
  );
  assert.match(
    evaluatorPromptSource,
    /leave the assessment absent so the framework can classify evaluator failure/u
  );
  assert.match(
    evaluatorPromptSource,
    /worker_construction_brief\.obligations may be an object map rather than an array/u
  );
  assert.doesNotMatch(evaluatorPromptSource, /child_process/u);
  assert.doesNotMatch(evaluatorPromptSource, /spawn\/exec/u);
});

test("T-187 review-grade evaluator prompt does not turn refs into obligations", () => {
  assert.match(
    evaluatorPromptSource,
    /reviewedObligationIds must contain only admitted obligation ids/u
  );
  assert.match(
    evaluatorPromptSource,
    /Do not build reviewedObligationIds by recursively collecting every string/u
  );
  assert.match(
    evaluatorPromptSource,
    /workspace:\/\/\.\.\., file:\/\/\.\.\., config:\/\/\.\.\./u
  );
  assert.match(
    evaluatorPromptSource,
    /not obligations and must not become findings/u
  );
});

test("T-187 work-category governance also bounds terminal output", () => {
  for (const source of workCategoryGovernanceSources) {
    assert.match(
      source,
      /IO cap: reads <=80 lines/u
    );
    assert.match(
      source,
      /jq\/rg\/cat\/git diff\/status end `\| head -80`/u
    );
    assert.match(source, /sed is inclusive: end-start\+1<=80/u);
    assert.match(source, /`200,299p` invalid \(100\), use `200,279p`/u);
    assert.match(source, /no bare jq\/rg\/cat/u);
    assert.doesNotMatch(source, /search plus targeted read ranges/u);
  }
});

// A-020/A-030: no framework-authored semantic construction recipe remains in the
// evaluator prompt; the F_D/F_P boundary is stated, not scripted.
test("T-187 design-depth evaluator prompt carries no framework-authored semantic recipe", () => {
  assert.doesNotMatch(evaluatorPromptSource, /node --input-type=module/u);
  assert.doesNotMatch(evaluatorPromptSource, /Exact (first|second) update command pattern/u);
  assert.doesNotMatch(evaluatorPromptSource, /tableRows|sectionText/u);
  assert.match(evaluatorPromptSource, /There is no framework-authored recipe/u);
  assert.match(evaluatorPromptSource, /F_D does not construct semantic register rows/u);
  assert.match(evaluatorPromptSource, /First-update carrier helper contract/u);
  assert.match(
    evaluatorPromptSource,
    /DESIGN_DEPTH_DRAFT_FRAGMENT_UPDATE_HELPER_CONTRACT_REF/u
  );
  assert.match(
    evaluatorPromptSource,
    /DESIGN_DEPTH_DRAFT_FRAGMENT_UPDATE_HELPER_CONTRACT_PATH/u
  );
  assert.match(helperContractSource, new RegExp(DESIGN_DEPTH_DRAFT_FRAGMENT_UPDATE_HELPER_CONTRACT_REF.replaceAll("/", "\\/"), "u"));
  assert.equal(DESIGN_DEPTH_DRAFT_FRAGMENT_UPDATE_HELPER_CONTRACT_PATH.endsWith("design_depth_draft_fragment_update.md"), true);
  assert.match(helperContractSource, /authority-neutral carrier mechanics/u);
  assert.match(helperContractSource, /temp-file then rename operation/u);
  assert.match(helperContractSource, /F_P owns the section values/u);
  assert.match(evaluatorPromptSource, /temp-then-rename/u);
});
