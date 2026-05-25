// Validates: T-180
// Proves the ABG 3.9 release substrate uses the current immutable tarball and
// consumes selected composition identity from ABG plugin input.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

import {
  ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT,
  sdlcSelectedAbgFnCompositionIdentityFromEnginePluginInput
} from "../../build/semantic/code/src/index.js";

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

function readPackageJson(relativePath) {
  return JSON.parse(readFileSync(path.join(PACKAGE_ROOT, relativePath), "utf8"));
}

function readRepoFile(relativePath) {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

test("T-180 pins the TypeScript tenant to ABG 3.9.0-rc.4", () => {
  const packageJson = readPackageJson("package.json");
  const packageLock = readPackageJson("package-lock.json");
  const dependencyRef =
    "file:../../../abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.4/abiogenesis-typescript-tenant-3.9.0-rc.4.tgz";

  assert.equal(
    packageJson.dependencies["@abiogenesis/typescript-tenant"],
    dependencyRef
  );
  assert.equal(
    packageLock.packages[""].dependencies["@abiogenesis/typescript-tenant"],
    dependencyRef
  );
  assert.equal(
    packageLock.packages["node_modules/@abiogenesis/typescript-tenant"].version,
    "3.9.0-rc.4"
  );
  assert.equal(
    ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.packageVersion,
    "3.9.0-rc.4"
  );
});

test("T-180 selected composition identity is consumed from ABG plugin input", () => {
  const selected =
    sdlcSelectedAbgFnCompositionIdentityFromEnginePluginInput({
      selectedCompositionRef: "abg.fn_composition://contract/t180",
      selectedCompositionDigest: "digest://t180/selected",
      selectedCompositionSelectionRef: "abg.fn_composition_selection://t180",
      selectedRegimeBindingRef:
        "abg.fn_composition.regime_binding://t180/evaluate/fp",
      graphFunctionId: "graph_function://odd-sdlc/t180",
      jobId: "job://odd-sdlc/t180",
      vectorIndex: 2,
      edge: "derive_component_code_surface"
    });

  assert.equal(selected.compositionRef, "abg.fn_composition://contract/t180");
  assert.equal(selected.compositionDigest, "digest://t180/selected");
  assert.equal(
    selected.compositionSelectionRef,
    "abg.fn_composition_selection://t180"
  );
  assert.equal(
    selected.selectedRegimeBindingRef,
    "abg.fn_composition.regime_binding://t180/evaluate/fp"
  );
  assert.equal(selected.graphFunctionRef, "graph_function://odd-sdlc/t180");
  assert.match(selected.graphVectorRef, /job%3A%2F%2Fodd-sdlc%2Ft180/u);
  assert.match(selected.graphVectorRef, /vector-2/u);
  assert.match(selected.graphVectorRef, /derive_component_code_surface/u);
});

test("T-180 selected composition helper fails closed on missing ABG identity", () => {
  assert.throws(
    () =>
      sdlcSelectedAbgFnCompositionIdentityFromEnginePluginInput({
        selectedCompositionRef: "",
        selectedCompositionDigest: "digest://t180/selected",
        selectedCompositionSelectionRef: "abg.fn_composition_selection://t180",
        graphFunctionId: "graph_function://odd-sdlc/t180",
        jobId: "job://odd-sdlc/t180",
        vectorIndex: 2,
        edge: "derive_component_code_surface"
      }),
    /selectedCompositionRef/u
  );
});

test("T-180 installed operator uses ABG plugin input for traversal consequence composition", () => {
  const source = readRepoFile("build_tenants/typescript/code/src/operator/installed_operator.ts");

  assert.match(
    source,
    /sdlcSelectedAbgFnCompositionIdentityFromEnginePluginInput\(pluginInput\)/u
  );
  assert.doesNotMatch(source, /function selectedCompositionForManifest/u);
});

test("T-180 installed operator binds distinct transform, evaluate, and consequence plugins", () => {
  const source = readRepoFile("build_tenants/typescript/code/src/operator/installed_operator.ts");

  assert.match(source, /function fpDispatchPluginContract\(\)/u);
  assert.match(source, /computeStageRole: "transform"/u);
  assert.match(source, /computeStagePurpose: "candidate_construction"/u);
  assert.match(source, /function fpEvaluatorPluginContract\(\)/u);
  assert.match(source, /pluginKind: "fp_evaluator"/u);
  assert.match(source, /computeStageRole: "evaluate"/u);
  assert.match(source, /computeStagePurpose: "candidate_evaluation"/u);
  assert.match(source, /function consequenceProjectionPluginContract\(\)/u);
  assert.match(source, /pluginKind: "consequence_projection"/u);
  assert.match(source, /computeStageRole: "consequence"/u);
  assert.match(source, /computeStagePurpose: "consequence_projection"/u);
  assert.match(source, /fpDispatch,\s+fpEvaluator,\s+consequenceProjection,/u);
  assert.doesNotMatch(source, /plugins: \{ fpDispatch \}/u);
});

test("T-180 live evaluate and consequence paths do not synthesize selected composition", () => {
  const handoff = readRepoFile("build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts");
  const evaluatePostflight = readRepoFile(
    "build_tenants/typescript/code/src/operator/plugins/evaluate/postflight.ts"
  );
  const publicStart = readRepoFile("build_tenants/typescript/code/src/start/public_start.ts");
  const traversal = readRepoFile(
    "build_tenants/typescript/code/src/operator/traversal_consequence.ts"
  );

  assert.match(
    evaluatePostflight,
    /readonly selectedComposition: SdlcSelectedAbgFnCompositionIdentity/u
  );
  assert.doesNotMatch(handoff, /deriveSdlcSelectedAbgFnCompositionIdentity/u);
  assert.match(publicStart, /deriveSdlcPreRuntimePlanningCompositionIdentity/u);
  assert.match(traversal, /legacyReplayOnlyCompositionIdentityForInput/u);
  assert.match(traversal, /Migration-only support for historical tests\/replay fixtures/u);
});

test("T-180 analyzer admits and renders RC3 stage truth", () => {
  const catalog = readRepoFile(
    "build_tenants/typescript/code/src/contracts/operator_run_artifact_catalog.ts"
  );
  const loaders = readRepoFile("build_tenants/typescript/code/src/analysis/carrier_loaders.ts");
  const attempts = readRepoFile("build_tenants/typescript/code/src/analysis/edge_attempts.ts");
  const markdown = readRepoFile("build_tenants/typescript/code/src/analysis/render_markdown.ts");

  assert.match(catalog, /operator-run-artifact:\/\/gtl-admitted-state-ref/u);
  assert.match(catalog, /operator-run-artifact:\/\/gtl-consequence-projection-ref/u);
  assert.match(loaders, /GTL_ADMITTED_STATE_REF_GUARD/u);
  assert.match(loaders, /GTL_CONSEQUENCE_PROJECTION_REF_GUARD/u);
  assert.match(loaders, /compositionSelectionRef: isTrimmedNonEmptyString/u);
  assert.match(attempts, /rc3StageTruthFromCarriers/u);
  assert.match(attempts, /RC3 selected composition drift/u);
  assert.match(markdown, /## RC3 Stage Truth/u);
});

test("T-180 ABG release substrate passes actor invocation provenance to F_P evaluation rules", () => {
  const runner = readFileSync(
    path.join(
      PACKAGE_ROOT,
      "node_modules/@abiogenesis/typescript-tenant/build/semantic/code/src/abg/m03/runner/engine_runner.js"
    ),
    "utf8"
  );

  assert.match(
    runner,
    /const plannedEvaluationRules = plugins\.evaluationRules\.map[\s\S]*?actorInvocationRef: actorInvocationRef\(actorInvocation\)/u
  );
  assert.match(
    runner,
    /const plannedBatchWithInputs = plannedBatch\.map[\s\S]*?actorInvocationRef: actorInvocationRef\(actorInvocation\)/u
  );
});
