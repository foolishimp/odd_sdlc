// Validates: T-118

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  sha256Text,
  stableOperatorJson,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";

function writeConstraints(root) {
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t118_invocation_package",
      "active_tenant: scala_spark",
      "build_tenants:",
      "  scala_spark:",
      "    output_dir: build_tenants/scala_spark",
      "    language: scala",
      "    build_tool: sbt",
      "    module_structure:",
      "      - invocation-core"
    ].join("\n"),
    "utf8"
  );
}

function workspaceWithLargeRequirementSurface() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t118-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  writeConstraints(root);
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-118: prove compact worker package.\n",
    "utf8"
  );
  const longClause = "Preserve compact package law ".repeat(95);
  const requirements = ["# Requirements", ""];
  for (let index = 1; index <= 160; index += 1) {
    const id = String(index).padStart(3, "0");
    requirements.push(
      `REQ-T118-${id}: ${longClause}Requirement ${id} must remain traceable without requiring the worker to read the full forensic manifest first.`
    );
  }
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    requirements.join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function manifestForLargeSurface() {
  const contract = hookContractByEdgeName("derive_intent_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot: workspaceWithLargeRequirementSurface(),
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t118-worker-invocation-package"
  });
}

function writeDeclaredProductFileTargetSurface(workspaceRoot) {
  writeFileSync(
    path.join(workspaceRoot, "specification/PRODUCT.md"),
    [
      "# Product",
      "",
      "## Expected Product Files",
      "",
      "- build_tenants/scala_spark/build.sbt role=build_config",
      "- build_tenants/scala_spark/src/main/scala/generated/App.scala role=source"
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(workspaceRoot, ".ai-workspace/context/t118_expected_files.json"),
    JSON.stringify(
      {
        expectedFiles: [
          "build_tenants/scala_spark/build.sbt",
          "build_tenants/scala_spark/src/main/scala/generated/App.scala",
          "README.md"
        ]
      },
      null,
      2
    ),
    "utf8"
  );
}

function manifestWithDeclaredProductFileTargets() {
  const workspaceRoot = workspaceWithLargeRequirementSurface();
  writeDeclaredProductFileTargetSurface(workspaceRoot);
  const contract = hookContractByEdgeName("derive_component_code_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 10,
    contract,
    runId: "t118-declared-product-file-targets"
  });
}

function manifestForImplementationModuleSurface() {
  const workspaceRoot = workspaceWithLargeRequirementSurface();
  const contract = hookContractByEdgeName("derive_implementation_module_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: "derive_implementation_module_surface",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t118-implementation-module-design-depth"
  });
}

function manifestForImplementationModuleSurfaceWithNestedPredecessors() {
  const workspaceRoot = workspaceWithLargeRequirementSurface();
  mkdirSync(path.join(workspaceRoot, "build_tenants/scala_spark/design/adrs"), {
    recursive: true
  });
  for (let index = 1; index <= 20; index += 1) {
    writeFileSync(
      path.join(
        workspaceRoot,
        `build_tenants/scala_spark/design/00-distractor-${String(index).padStart(2, "0")}.md`
      ),
      `# Distractor ${index}\n\nThis file must not displace targeted predecessors from the compact handoff.\n`,
      "utf8"
    );
  }
  writeFileSync(
    path.join(
      workspaceRoot,
      "build_tenants/scala_spark/design/adrs/ADR-001-design-surface.md"
    ),
    "# Design Surface\n\nThis upstream design surface must not be targeted by implementation_design_surface substring matching.\n",
    "utf8"
  );
  writeFileSync(
    path.join(
      workspaceRoot,
      "build_tenants/scala_spark/design/adrs/ADR-002-implementation-design-surface.md"
    ),
    "# Implementation Design Surface\n\nThe module surface must derive from this admitted predecessor.\n",
    "utf8"
  );
  writeFileSync(
    path.join(workspaceRoot, "build_tenants/scala_spark/design/implementation_stack_profile.md"),
    "# Implementation Stack Profile\n\nUse Scala and sbt for the tenant implementation.\n",
    "utf8"
  );
  const contract = hookContractByEdgeName("derive_implementation_module_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: "derive_implementation_module_surface",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t118-implementation-module-nested-predecessor-hints"
  });
}

function manifestForAggregateDomainModelSurface() {
  const workspaceRoot = workspaceWithLargeRequirementSurface();
  const contract = hookContractByEdgeName("derive_aggregate_domain_model_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: "derive_aggregate_domain_model_surface",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t118-aggregate-domain-model-design-depth"
  });
}

function manifestForAggregateSunnyDaySequenceSurface() {
  const workspaceRoot = workspaceWithLargeRequirementSurface();
  const contract = hookContractByEdgeName("derive_aggregate_sunny_day_sequence_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: "derive_aggregate_sunny_day_sequence_surface",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t118-aggregate-sunny-day-sequence-design-depth"
  });
}

function manifestForDeclaredProductMaterialization() {
  const workspaceRoot = workspaceWithLargeRequirementSurface();
  writeDeclaredProductFileTargetSurface(workspaceRoot);
  const contract = hookContractByEdgeName(FG_MATERIALIZE_DECLARED_PRODUCT_ASSET);
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: FG_MATERIALIZE_DECLARED_PRODUCT_ASSET,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t118-first-pass-product-materialization"
  });
}

test("T-118 writes a compact worker invocation package while preserving the full manifest by reference", () => {
  const manifest = manifestForLargeSurface();
  const files = writeHandoffFiles(manifest);
  const relativeToWorkspace = (filePath) =>
    path.relative(manifest.workspaceRoot, filePath);
  const fullManifestSize = statSync(files.manifestPath).size;
  const invocationPackageSize = statSync(files.invocationPackagePath).size;
  const workerBriefSize = statSync(files.workerBriefPath).size;
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const workerBrief = JSON.parse(readFileSync(files.workerBriefPath, "utf8"));
  const escapedWorkspaceRoot = new RegExp(
    manifest.workspaceRoot.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"),
    "u"
  );
  const { packageDigest, ...digestBasis } = invocationPackage;

  assert(fullManifestSize > 256 * 1024);
  assert(invocationPackageSize < 32 * 1024);
  assert(workerBriefSize < 4 * 1024);
  assert.equal(invocationPackage.kind, "sdlc_worker_invocation_package");
  assert.equal(invocationPackage.packageVersion, "ts-invocation-v1");
  assert.equal(invocationPackage.manifestPath, relativeToWorkspace(files.manifestPath));
  assert.equal(
    invocationPackage.manifestRef,
    `workspace://${relativeToWorkspace(files.manifestPath)}`
  );
  assert.equal(path.isAbsolute(invocationPackage.manifestPath), false);
  assert.equal(invocationPackage.traversalIntentPackagePath.endsWith("traversal_intent_package.json"), true);
  assert(invocationPackage.transformAxioms.length >= 5);
  assert(invocationPackage.transformAxioms.some((axiom) => axiom.includes("F_P.transform only")));
  assert(invocationPackage.transformAxioms.some((axiom) => axiom.includes("Read boundary:")));
  assert(invocationPackage.outcomeDirectives.length > 0);
  assert(invocationPackage.outcomeDirectives.some((directive) => directive.includes("Outcome:")));
  assert.equal(
    invocationPackage.manifestDigest,
    sha256Text(readFileSync(files.manifestPath, "utf8"))
  );
  assert.equal(packageDigest, sha256Text(stableOperatorJson(digestBasis)));
  assert.equal(
    invocationPackage.outputContract.outputFile,
    relativeToWorkspace(manifest.outputFile)
  );
  assert.equal(
    invocationPackage.outputContract.reportFile,
    relativeToWorkspace(manifest.reportFile)
  );
  assert.deepEqual(invocationPackage.outputContract.declaredProductFileTargets, []);
  assert.deepStrictEqual(
    invocationPackage.allowedWriteRoots,
    manifest.allowedWriteRoots.map(relativeToWorkspace)
  );
  assert.equal(invocationPackage.retryFrontier.kind, "sdlc_worker_invocation_retry_frontier");
  assert(invocationPackage.inlineObligations.length <= 24);
  assert.equal(
    invocationPackage.inlineObligations.filter(
      (obligation) => obligation.obligationKind === "requirement"
    ).length,
    12
  );
  assert.equal(invocationPackage.requirementTraceObligationIds.length, 80);
  assert.equal(invocationPackage.omittedRequirementTraceObligationCount, 80);
  assert(invocationPackage.omittedObligationCount > 100);
  assert.equal(workerBrief.kind, "sdlc_worker_brief");
  assert.equal(
    workerBrief.refs.workerInvocationPackagePath,
    relativeToWorkspace(files.invocationPackagePath)
  );
  assert.equal(workerBrief.refs.handoffManifestPath, relativeToWorkspace(files.manifestPath));
  assert.equal(path.isAbsolute(workerBrief.outputFile), false);
  assert.equal(
    workerBrief.digests.workerInvocationPackageDigest,
    invocationPackage.packageDigest
  );
  assert.deepEqual(workerBrief.requiredSchema, manifest.resultReportSchema);
  assert.doesNotMatch(
    readFileSync(files.invocationPackagePath, "utf8"),
    escapedWorkspaceRoot
  );
  assert.doesNotMatch(readFileSync(files.workerBriefPath, "utf8"), escapedWorkspaceRoot);
});

test("T-118 prompt points workers to the compact package before the forensic manifest", () => {
  const manifest = manifestForLargeSurface();
  const files = writeHandoffFiles(manifest);
  const prompt = readFileSync(files.promptPath, "utf8");
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );

  assert(Buffer.byteLength(prompt, "utf8") < 3 * 1024);
  assert.doesNotMatch(prompt, new RegExp(manifest.workspaceRoot.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
  assert.match(prompt, /Read in order:/u);
  assert.match(prompt, /worker_invocation_package\.json/u);
  assert.match(prompt, /worker_brief\.json/u);
  assert.match(prompt, /forensic manifest only when a package ref requires it/u);
  assert.match(prompt, /Terse axioms:/u);
  assert.match(
    prompt,
    /Apply workerInvocationPackage\.transformAxioms as the single axiom authority/u
  );
  assert.match(prompt, /Read boundary: stay under the current workspace/u);
  assert(
    [...invocationPackage.transformAxioms, ...invocationPackage.outcomeDirectives].some(
      (entry) => entry.includes("closed schema authority")
    )
  );
  assert.doesNotMatch(prompt, /This invocation is F_P\.transform only/u);
  assert.match(prompt, /outcomeDirectives/u);
  assert.doesNotMatch(prompt, /Read the full handoff manifest before writing output/u);
  assert.match(prompt, /Use workerInvocationPackage\.requirementTraceObligationIds/u);
  assert(
    [...invocationPackage.transformAxioms, ...invocationPackage.outcomeDirectives].some(
      (entry) => entry.includes("audit context")
    )
  );
  assert.doesNotMatch(prompt, /complete transformation set for product files/u);
  assert.doesNotMatch(
    [...invocationPackage.transformAxioms, ...invocationPackage.outcomeDirectives].join("\n"),
    /complete transformation set for product files/u
  );
  assert.doesNotMatch(prompt, /Compact worker invocation package:/u);
  assert.doesNotMatch(prompt, /Legacy compact prompt pressure projection:/u);
  assert.doesNotMatch(prompt, /"kind": "sdlc_worker_invocation_package"/u);
  assert.doesNotMatch(prompt, /sdlc_worker_prompt_pressure_projection/u);
  assert.doesNotMatch(prompt, /workerInvocationPackage\.retryRepairInstructions is non-empty/u);
});

test("T-002 worker package and prompt carry declared product file targets", () => {
  const manifest = manifestWithDeclaredProductFileTargets();
  const files = writeHandoffFiles(manifest);
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const prompt = readFileSync(files.promptPath, "utf8");

  assert.deepEqual(
    invocationPackage.outputContract.declaredProductFileTargets,
    [
      "build_tenants/scala_spark/build.sbt",
      "build_tenants/scala_spark/src/main/scala/generated/App.scala"
    ]
  );
  assert.match(
    prompt,
    /Declared product file targets: build_tenants\/scala_spark\/build\.sbt, build_tenants\/scala_spark\/src\/main\/scala\/generated\/App\.scala\./u
  );
  const outcomeDirectives = invocationPackage.outcomeDirectives.join("\n");
  assert.match(
    outcomeDirectives,
    /Declared product file targets are the exact product surface/u
  );
  assert.match(outcomeDirectives, /one exact id per line/u);
  assert.match(outcomeDirectives, /do not rely on the report alone/u);
  assert.match(outcomeDirectives, /Cargo\.lock, target\//u);
  assert.doesNotMatch(prompt, /README\.md/u);
});

test("T-118 design-depth prompt carries canonical carrier kind names", () => {
  const manifest = manifestForImplementationModuleSurface();
  const files = writeHandoffFiles(manifest);
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const prompt = readFileSync(files.promptPath, "utf8");
  const outcomeDirectives = invocationPackage.outcomeDirectives.join("\n");

  assert.match(outcomeDirectives, /json design_depth_register/u);
  assert.match(outcomeDirectives, /sdlc_design_depth_register/u);
  assert.match(outcomeDirectives, /ts-design-depth-v1/u);
  assert.match(outcomeDirectives, /targetAssetType:"implementation_module_surface"/u);
  assert.match(outcomeDirectives, /moduleSchemaFragments` \(non-empty\)/u);
  assert.match(outcomeDirectives, /moduleStateDiagramFragments` \(non-empty\)/u);
  assert.match(outcomeDirectives, /aggregateDomainModel:null/u);
  assert.match(outcomeDirectives, /aggregateSunnyDaySequence:null/u);
  assert.match(outcomeDirectives, /designCompletenessVerdict:null/u);
  assert.match(outcomeDirectives, /Keep the carrier proportional to immediate implementation structure/u);
  assert.match(outcomeDirectives, /Do not flatten requirement obligations/u);
  assert.match(outcomeDirectives, /For a single-file or script product/u);
  assert.match(outcomeDirectives, /do not create one entity or stateless diagram row per requirement/u);
  assert.match(outcomeDirectives, /sdlc_module_schema_fragment/u);
  assert.match(outcomeDirectives, /sdlc_domain_entity/u);
  assert.match(outcomeDirectives, /sdlc_domain_attribute/u);
  assert.match(outcomeDirectives, /sdlc_domain_operation/u);
  assert.match(outcomeDirectives, /sdlc_module_state_diagram_fragment/u);
  assert.match(outcomeDirectives, /sdlc_entity_state_transition/u);
  assert.match(outcomeDirectives, /entities\[\]\.entityId/u);
  assert.match(outcomeDirectives, /attributes\[\]\.attributeId/u);
  assert.match(outcomeDirectives, /attributes\[\]\.valueType/u);
  assert.match(outcomeDirectives, /operations\[\]\.operationId/u);
  assert.match(outcomeDirectives, /Each `moduleSchemaFragments` item must be an object/u);
  assert.match(outcomeDirectives, /\{"kind":"sdlc_module_schema_fragment","moduleName":"<module>"/u);
  assert.match(outcomeDirectives, /"ownership":"owned\|referenced"/u);
  assert.match(outcomeDirectives, /"cardinality":"one\|optional\|many"/u);
  assert.match(outcomeDirectives, /smallest non-empty `moduleStateDiagramFragments` set/u);
  assert.match(outcomeDirectives, /\{"kind":"sdlc_module_state_diagram_fragment","moduleName":"<module>"/u);
  assert.match(outcomeDirectives, /"states":\[\]/u);
  assert.match(outcomeDirectives, /"transitions":\[\]/u);
  assert.doesNotMatch(outcomeDirectives, /design_depth_module_schema_fragment/u);
  assert.match(prompt, /sdlc_design_depth_register/u);
  assert.match(prompt, /moduleSchemaFragments/u);
  assert.match(prompt, /moduleStateDiagramFragments/u);
  assert.match(prompt, /sdlc_module_schema_fragment/u);
});

test("T-118 module handoff carries nested predecessor authority as targeted retrieval hints", () => {
  const manifest = manifestForImplementationModuleSurfaceWithNestedPredecessors();
  const files = writeHandoffFiles(manifest);
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const implementationDesignRef =
    "workspace://build_tenants/scala_spark/design/adrs/ADR-002-implementation-design-surface.md";
  const stackProfileRef =
    "workspace://build_tenants/scala_spark/design/implementation_stack_profile.md";
  const designAuthority = manifest.traversalObligationContext.authorityIndex.find(
    (entry) =>
      entry.ref.endsWith(
        "/build_tenants/scala_spark/design/adrs/ADR-002-implementation-design-surface.md"
      )
  );
  const stackAuthority = manifest.traversalObligationContext.authorityIndex.find(
    (entry) =>
      entry.ref.endsWith(
        "/build_tenants/scala_spark/design/implementation_stack_profile.md"
      )
  );
  const designSurfaceHint = manifest.traversalObligationContext.retrievalHints.find(
    (hint) =>
      hint.ref.endsWith(
        "/build_tenants/scala_spark/design/adrs/ADR-001-design-surface.md"
      )
  );
  const designHint = invocationPackage.retrievalHints.find(
    (hint) => hint.ref === implementationDesignRef
  );
  const stackHint = invocationPackage.retrievalHints.find(
    (hint) => hint.ref === stackProfileRef
  );

  assert(designAuthority);
  assert(designAuthority.tags.includes("implementation_design_surface"));
  assert(stackAuthority);
  assert(stackAuthority.tags.includes("implementation_stack_profile"));
  assert(designSurfaceHint);
  assert.equal(designSurfaceHint.reason, "available_authority_by_reference");
  assert(designHint);
  assert.equal(designHint.reason, "targeted_authority_for_current_traversal");
  assert(stackHint);
  assert.equal(stackHint.reason, "targeted_authority_for_current_traversal");
  assert(invocationPackage.retrievalHints.length <= 12);
});

test("T-118 aggregate design-depth prompts carry closed carrier object shapes", () => {
  const domainModelFiles = writeHandoffFiles(manifestForAggregateDomainModelSurface());
  const sunnyDayFiles = writeHandoffFiles(manifestForAggregateSunnyDaySequenceSurface());
  const domainModelPackage = JSON.parse(
    readFileSync(domainModelFiles.invocationPackagePath, "utf8")
  );
  const sunnyDayPackage = JSON.parse(
    readFileSync(sunnyDayFiles.invocationPackagePath, "utf8")
  );
  const domainModelDirectives = domainModelPackage.outcomeDirectives.join("\n");
  const sunnyDayDirectives = sunnyDayPackage.outcomeDirectives.join("\n");

  assert.match(domainModelDirectives, /targetAssetType:"aggregate_domain_model_surface"/u);
  assert.match(domainModelDirectives, /moduleSchemaFragments:\[\]/u);
  assert.match(domainModelDirectives, /moduleStateDiagramFragments:\[\]/u);
  assert.match(domainModelDirectives, /aggregateSunnyDaySequence:null/u);
  assert.match(domainModelDirectives, /\{"kind":"sdlc_aggregate_domain_model","modelVersion":"ts-design-depth-v1"/u);
  assert.match(domainModelDirectives, /"kind":"sdlc_aggregate_domain_entity"/u);
  assert.match(domainModelDirectives, /"ownerModuleName":"<module>"/u);
  assert.match(domainModelDirectives, /"kind":"sdlc_design_completeness_verdict"/u);
  assert.match(domainModelDirectives, /"axis":"entity"/u);
  assert.match(domainModelDirectives, /"axis":"attribute"/u);
  assert.match(domainModelDirectives, /"axis":"flow"/u);
  assert.match(
    domainModelDirectives,
    /do not mark flow partial solely because `aggregateSunnyDaySequence` is null/u
  );

  assert.match(sunnyDayDirectives, /targetAssetType:"aggregate_sunny_day_sequence_surface"/u);
  assert.match(sunnyDayDirectives, /moduleSchemaFragments:\[\]/u);
  assert.match(sunnyDayDirectives, /moduleStateDiagramFragments:\[\]/u);
  assert.match(sunnyDayDirectives, /non-null `aggregateDomainModel`/u);
  assert.match(sunnyDayDirectives, /non-null `aggregateSunnyDaySequence`/u);
  assert.match(sunnyDayDirectives, /\{"kind":"sdlc_aggregate_sunny_day_sequence","sequenceVersion":"ts-design-depth-v1"/u);
  assert.match(sunnyDayDirectives, /"kind":"sdlc_sunny_day_sequence_step"/u);
  assert.match(sunnyDayDirectives, /stateTransitionIds/u);
  assert.match(sunnyDayDirectives, /sdlc_design_completeness_verdict/u);
});

test("T-157 product materialization prompt carries first-pass execution closure law", () => {
  const manifest = manifestForDeclaredProductMaterialization();
  const files = writeHandoffFiles(manifest);
  const invocationPackage = JSON.parse(
    readFileSync(files.invocationPackagePath, "utf8")
  );
  const outcomeDirectives = invocationPackage.outcomeDirectives.join("\n");

  assert.match(
    outcomeDirectives,
    /Outcome: Fg_materialize_declared_product_asset -> component_code_surface/u
  );
  assert.match(
    outcomeDirectives,
    /Declared product file targets are the exact product surface/u
  );
  assert.match(outcomeDirectives, /Cargo\.lock, target\//u);
  assert.match(
    outcomeDirectives,
    /Use this exact closed carrier shape: \{"kind":"sdlc_worker_execution_evidence"/u
  );
  assert.match(
    outcomeDirectives,
    /shardEvidence\[\]\.kind MUST be exactly "sdlc_worker_execution_shard_evidence"/u
  );
  assert.match(
    outcomeDirectives,
    /testsObserved MUST be greater than zero/u
  );
  assert.doesNotMatch(outcomeDirectives, /Prior defect:/u);
});
