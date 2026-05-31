// Validates: T-187 (F_P evaluator prompt boundary + proportional Min(F_P) dispatch)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
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

test("T-187 review-grade evaluator prompt projects tenant-declared tool boundaries", () => {
  assert.match(evaluatorPromptSource, /Tenant tool boundary/u);
  assert.match(
    evaluatorPromptSource,
    /Tenant disabled tools from currentState\.tenantToolEnvironment/u
  );
  assert.match(
    evaluatorPromptSource,
    /Apply currentState\.tenantToolEnvironment before choosing any local script runtime/u
  );
  assert.match(
    evaluatorPromptSource,
    /Do not run tenant-disabled tools for assessment JSON writing/u
  );
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
    installedOperatorSource,
    /designDepthFpEvaluatorPrompt\(\{[\s\S]*tenantToolEnvironment: tenantToolEnvironmentProjectionFor\(input\.manifest\)/u
  );
});

test("T-187 review-grade evaluator prompt avoids regex-literal sidecar failures", () => {
  assert.match(evaluatorPromptSource, /avoid JavaScript regex literals/u);
  assert.match(evaluatorPromptSource, /startsWith, includes, endsWith, split/u);
  assert.match(evaluatorPromptSource, /construct the RegExp from a quoted string constant/u);
  assert.match(
    evaluatorPromptSource,
    /regex-literal quoting mistakes are evaluator failures/u
  );
});

test("T-187 review-grade evaluator prompt does not admit evaluator helper failures as product findings", () => {
  assert.match(
    evaluatorPromptSource,
    /correct that helper once using already-read evidence and validation/u
  );
  assert.match(
    evaluatorPromptSource,
    /Do not convert evaluator helper-script failure into requirement\/product obligation findings/u
  );
  assert.match(
    evaluatorPromptSource,
    /leave the assessment absent so the framework can classify evaluator failure/u
  );
  assert.match(
    evaluatorPromptSource,
    /worker_construction_brief\.obligations may be an object map rather than an array/u
  );
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
});
