// Validates: T-197

import test from "node:test";
import assert from "node:assert/strict";
import {
  readdirSync,
  readFileSync,
  statSync
} from "node:fs";
import path from "node:path";
import {
  formatGtlProgramConformanceIssues
} from "@abiogenesis/typescript-tenant";
import {
  assertCurrentSdlcGtlProgramConformance,
  admitSdlcProjectConstraints,
  constructCurrentSdlcGtlProgramConformanceInput,
  deriveSdlcInstalledOperatorStatusFromAbgTerminal,
  deriveSdlcSourceInput,
  deriveSdlcWorkspaceIngressReport,
  typecheckCurrentSdlcGtlProgram,
  typecheckSdlcGtlProgramConformanceInput
} from "../../build/semantic/code/src/index.js";

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

function repoFile(relativePath) {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

function sourceFunction(source, functionName) {
  const nameIndex = source.indexOf(`function ${functionName}`);
  assert.notEqual(nameIndex, -1, `${functionName} must exist`);
  const signatureEnd = source.indexOf("):", nameIndex);
  assert.notEqual(signatureEnd, -1, `${functionName} must have a return type`);
  const bodyStart = source.indexOf("{", signatureEnd);
  assert.notEqual(bodyStart, -1, `${functionName} must have a body`);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(nameIndex, index + 1);
      }
    }
  }
  assert.fail(`${functionName} body was not closed`);
}

function repoFilesUnder(relativePath) {
  const root = path.join(REPO_ROOT, relativePath);
  const files = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    const stat = statSync(current);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(current)) {
        if (entry === "build" || entry === "node_modules") {
          continue;
        }
        stack.push(path.join(current, entry));
      }
      continue;
    }
    if (stat.isFile()) {
      files.push(current);
    }
  }
  return files.sort();
}

function assertConformancePassed(report) {
  assert.equal(
    report.passed,
    true,
    formatGtlProgramConformanceIssues(report.issues)
  );
  assert.equal(report.issueCount, 0);
}

function constructEventSites() {
  const sites = [];
  const callPattern = /\b(construct[A-Za-z0-9_]*Event)\s*\(/gu;
  for (const filePath of repoFilesUnder("build_tenants/typescript/code/src")) {
    if (path.extname(filePath) !== ".ts") {
      continue;
    }
    const relativePath = path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
    const source = readFileSync(filePath, "utf8");
    for (const match of source.matchAll(callPattern)) {
      const constructorName = match[1];
      if (constructorName === undefined) {
        continue;
      }
      sites.push(`${relativePath}:${constructorName}`);
    }
  }
  return sites.sort();
}

test("T-197 product gate typechecks the live SDLC graph inventory", () => {
  const input = constructCurrentSdlcGtlProgramConformanceInput();
  const report = typecheckCurrentSdlcGtlProgram();

  assertConformancePassed(report);
  assert.doesNotThrow(() => assertCurrentSdlcGtlProgramConformance());

  assert.ok(input.expectedCoverage.catalogGraphFunctionCount > 0);
  assert.ok(input.expectedCoverage.publishedGraphFunctionCount > 0);
  assert.ok(input.expectedCoverage.graphVectorCount > 0);
  assert.equal(
    input.expectedCoverage.graphVectorCount,
    input.expectedCoverage.targetCarrierContractCount
  );
  assert.equal(
    input.expectedCoverage.graphVectorCount,
    input.expectedCoverage.edgeClosureContractCount
  );
  assert.equal(input.expectedCoverage.promptAssetCount, 3);
  assert.equal(input.expectedCoverage.pluginContractCount, 5);
  assert.ok(input.expectedCoverage.overlayCount > 0);
  assert.ok(input.expectedCoverage.publicStartTargetCount > 0);
  assert.ok(input.expectedCoverage.sourceIdentitySurfaceCount > 0);
  assert.ok(input.featureCoverageManifest.rows.length >= 26);
});

test("T-197 product gate fails closed when target-carrier rows are missing", () => {
  const input = constructCurrentSdlcGtlProgramConformanceInput();
  const report = typecheckSdlcGtlProgramConformanceInput({
    ...input,
    targetCarrierContracts: Object.freeze([]),
    expectedCoverage: Object.freeze({
      ...input.expectedCoverage,
      targetCarrierContractCount: 0
    })
  });

  assert.equal(report.passed, false);
  assert.ok(report.issueCount > 0);
  assert.ok(
    report.issues.some(
      (issue) => issue.surfaceKind === "target_carrier_contract"
    )
  );
});

test("T-197 product entry points call the GTL conformance gate", () => {
  const entrySources = [
    "build_tenants/typescript/code/src/start/public_start.ts",
    "build_tenants/typescript/code/src/spec_method/entry.ts",
    "build_tenants/typescript/code/src/release/release_cut.ts",
    "build_tenants/typescript/code/src/release/release_snapshot.ts"
  ];

  for (const source of entrySources) {
    assert.match(
      repoFile(source),
      /\bassertCurrentSdlcGtlProgramConformance\b/u,
      `${source} must call the product GTL conformance gate`
    );
  }

  const packageJson = JSON.parse(
    repoFile("build_tenants/typescript/package.json")
  );
  assert.match(packageJson.scripts["build:semantic"], /\bpreflight:gtl\b/u);
  assert.match(
    packageJson.scripts["preflight:gtl"],
    /\bassertCurrentSdlcGtlProgramConformance\b/u
  );
});

test("T-197 product gate keeps installed-package source identity nonempty", () => {
  const input = constructCurrentSdlcGtlProgramConformanceInput({
    packageRoot: path.join(REPO_ROOT, "build_tenants/typescript"),
    repoRoot: path.join(REPO_ROOT, "test_env/no-source-checkout"),
    activeScanRoots: ["missing-active-source-root"]
  });
  const report = typecheckSdlcGtlProgramConformanceInput(input);

  assertConformancePassed(report);
  assert.equal(input.expectedCoverage.sourceIdentitySurfaceCount, 1);
  assert.equal(
    input.sourceIdentitySurfaces[0]?.surfaceRef,
    "package://@odd-sdlc/typescript-tenant/current"
  );
});

test("T-197 design ratifies owner partition assets before Wave 1 code", () => {
  const design = repoFile(
    "build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md"
  );

  for (const required of [
    "## T-197 Owner Partition And Decommission Register",
    "### T-197 IACS",
    "### Structural Carrier Diagram",
    "classDiagram",
    "<<prime>>",
    "<<authoritative>>",
    "<<downstream>>",
    "<<subordinate>>",
    "<<effect-edge>>",
    "<<deferred>>",
    "### Reference-To-Target Derivation",
    "### Decommission Register",
    "### W-105 Construct-Site Sufficiency Inventory",
    "ABG route / dependency",
    "ABI 4.0.0-rc.14",
    "runtime continuation transition projection refs",
    "22/22 edge-contract tests and 1/1 Rust-service sandbox proof",
    "must-not-name-governed-target",
    "Horizontal ingress rule:"
  ]) {
    assert.match(design, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
  }

  for (const rowId of [
    "A1", "A2", "A3", "A4", "A5",
    "B1", "B2", "B3", "B4a", "B4b",
    "C1a", "C1b", "C2", "C3",
    "D1", "D2", "D3", "D4", "D5", "D6",
    "H1", "H2", "H3", "H4", "H5", "H6",
    "H7", "H8", "H9", "H10", "H11", "H12",
    "E1", "E2", "E3", "E4", "E5",
    "P1", "P2", "P3"
  ]) {
    assert.match(design, new RegExp(`\\| ${rowId} \\|`, "u"));
  }

  const ticket = repoFile(
    ".ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md"
  );
  assert.match(ticket, /\| W-105 \| Wave 1 pre-realization gate \|/u);
  assert.match(ticket, /\| W-115 \| A2 command\/control hard break \|/u);
  assert.match(ticket, /\| W-116 \| Retire or rehome legacy local re-entry helper \|/u);
  assert.match(ticket, /ABG T-154 filed and completed for explicit resume cursor/u);
  assert.match(ticket, /npm run test:t164` passed 22\/22 edge-contract \+ 1\/1 Rust-service sandbox/u);
});

test("T-197 W-105 classifies every source runtime event constructor site", () => {
  assert.deepEqual(constructEventSites(), [
    "build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts:constructRetryProgressRecordedEvent",
    "build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts:constructVectorClosedEvent",
    "build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts:constructVectorEvaluatedEvent",
    "build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts:constructVectorEvaluatedEvent"
  ]);
});

test("T-197 H1 keeps target-specific requirements filenames out of framework law", () => {
  const forbiddenPath = "specification/mapper_requirements.md";
  const sourceHits = repoFilesUnder("build_tenants/typescript/code/src")
    .filter((filePath) => path.extname(filePath) === ".ts")
    .filter((filePath) => readFileSync(filePath, "utf8").includes(forbiddenPath))
    .map((filePath) => path.relative(REPO_ROOT, filePath).split(path.sep).join("/"));

  assert.deepEqual(sourceHits, []);

  const sourceInput = deriveSdlcSourceInput({
    uri: "file:///workspace/specification/mapper_requirements.md",
    relativePath: forbiddenPath,
    content: "# Target-specific requirements filename\nREQ-X Target-local truth."
  });
  assert.equal(sourceInput.detectedRole, "unstructured");

  const genericRequirement = deriveSdlcSourceInput({
    uri: "file:///workspace/specification/requirements/01-domain.md",
    relativePath: "specification/requirements/01-domain.md",
    content: "# Requirements\nREQ-X Generic requirement truth."
  });
  assert.equal(genericRequirement.detectedRole, "requirement_surface");

  const importedSources = deriveSdlcSourceInput({
    uri: "file:///workspace/specification/requirements/00-imported-sources.md",
    relativePath: "specification/requirements/00-imported-sources.md",
    content: [
      "# Imported Sources",
      "",
      "- `workspace://specification/mapper_requirements.md`"
    ].join("\n")
  });
  const importedRequirement = deriveSdlcSourceInput({
    uri: "file:///workspace/specification/mapper_requirements.md",
    relativePath: forbiddenPath,
    content: "# Target-specific requirements filename\nREQ-X Target-local truth."
  });
  const report = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: "file:///workspace",
    projectConstraints: admitSdlcProjectConstraints({
      kind: "sdlc_project_constraints",
      projectSlug: "target_specific_fixture",
      activeTenant: "typescript",
      selectedOutputRoot: "build_tenants/typescript",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: []
    }),
    sourceInputs: [importedSources, importedRequirement]
  });
  assert.equal(importedRequirement.detectedRole, "unstructured");
  assert(
    report.importedRequirementAuthorities.some(
      (authority) => authority.requirementId === "REQ-X"
    )
  );
});

test("T-197 W-110 keeps traversal selection as projection, not SDLC-authored F_D runtime truth", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/installed_operator.ts"
  );

  assert.match(source, /sdlc_traversal_hop_selection\.json/u);
  assert.match(source, /sdlc_frontdoor_traversal_hop_selection\.json/u);
  assert.doesNotMatch(source, /\bconstructFdAuthorityOutcomeAdmittedEvent\b/u);
  assert.doesNotMatch(source, /odd-sdlc-frontdoor-traversal-hop-selection/u);
  assert.doesNotMatch(source, /emitted\.push\(frontDoorTraversalAuditEvent\)/u);
  assert.doesNotMatch(source, /input\.eventSink\(traversalAuditEvent\)/u);
});

test("T-197 W-110 routes conform-project F_D advance through ABG runner ownership", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/installed_operator.ts"
  );
  const conformVectorGuard = sourceFunction(
    source,
    "isConformProjectGraphVectorEdge"
  );

  assert.match(source, /\bappendFdConformanceRuntimeEvents\b/u);
  assert.match(source, /\brunEngineIterateAsync\b/u);
  assert.match(source, /\bconstructFdEvaluationOutcome\b/u);
  assert.match(source, /\bdefaultFdEvaluatorPlugin\.contract\b/u);
  assert.match(source, /until:\s*"first_traversal"/u);
  assert.match(source, /\bisConformProjectGraphVectorEdge\(pluginInput\.edge\)/u);
  assert.match(conformVectorGuard, /\bCONFORM_PROJECT_OUTPUTS\.some\b/u);
  assert.match(conformVectorGuard, /`\$\{FG_CONFORM_PROJECT\}__\$\{targetAssetType\}`/u);
  assert.doesNotMatch(
    source,
    /pluginInput\.edge === FG_CONFORM_PROJECT && pluginInput\.regime === "F_D"/u
  );
  assert.doesNotMatch(source, /\bruntimeEventsForIterationDecision\b/u);
});

test("T-197 W-110 consumes ABI runtime authorship routes for cursor and graph-span reentry", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/installed_operator.ts"
  );

  assert.match(source, /\bapplyExplicitGraphVectorResumeCursor\b/u);
  assert.match(source, /\bapplyGraphSpanReentryRoute\b/u);
  assert.match(source, /reason:\s*"odd_sdlc_post_close_graph_continuation_cursor"/u);
  assert.doesNotMatch(source, /\bconstructVectorTraversalPlannedEvent\b/u);
  assert.doesNotMatch(source, /\bconstructVectorEvaluatedEvent\b/u);
  assert.doesNotMatch(source, /\bconstructVectorClosedEvent\b/u);
  assert.doesNotMatch(source, /\bconstructGraphSpanEvaluationScheduledEvent\b/u);
  assert.doesNotMatch(source, /\bconstructGraphSpanAssessedEvent\b/u);
  assert.doesNotMatch(source, /\bconstructGraphSpanFoldbackEvaluatedEvent\b/u);
  assert.doesNotMatch(source, /\bconstructGraphReentryPlannedEvent\b/u);
  assert.doesNotMatch(source, /\bconstructGraphReentryAppliedEvent\b/u);
});

test("T-197 A3 ratifies live parallel materialization as thin ABG frontier caller", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/installed_operator.ts"
  );
  const frontierCarrier = repoFile(
    "build_tenants/typescript/code/src/operator/live_fp_parallel_materialization_frontier.ts"
  );

  assert.match(source, /\bcompileSdlcFeatureDependencyDagToAbgFrontier\b/u);
  assert.match(source, /\brunEventedNativeSagaFrontier\b/u);
  assert.match(source, /\bconstructBranchExecutionPolicy\b/u);
  assert.match(source, /executionAuthority:\s*"abg_evented_saga_frontier"/u);
  assert.match(source, /parallelismControl:\s*"abg_branch_execution_policy"/u);
  assert.doesNotMatch(source, /\brunNativeSagaFrontier\b/u);
  assert.match(
    frontierCarrier,
    /executionAuthority:\s*oneOf\(\["abg_evented_saga_frontier"\] as const\)/u
  );
  assert.match(
    frontierCarrier,
    /parallelismControl:\s*oneOf\(\["abg_branch_execution_policy"\] as const\)/u
  );
});

test("T-197 A5 gates installed convergence on ABG terminal convergence", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/installed_operator.ts"
  );

  assert.equal(
    deriveSdlcInstalledOperatorStatusFromAbgTerminal({
      stateStatus: "worker_invoked",
      closureDisposition: "close",
      terminalKind: "gap_stop"
    }),
    "blocked"
  );
  assert.equal(
    deriveSdlcInstalledOperatorStatusFromAbgTerminal({
      stateStatus: "worker_invoked",
      closureDisposition: "close",
      terminalKind: "converged"
    }),
    "converged"
  );
  assert.equal(
    deriveSdlcInstalledOperatorStatusFromAbgTerminal({
      stateStatus: "worker_invoked",
      closureDisposition: "retry",
      terminalKind: "converged"
    }),
    "worker_invoked"
  );
  assert.equal(
    deriveSdlcInstalledOperatorStatusFromAbgTerminal({
      stateStatus: "worker_invoked",
      closureDisposition: "close",
      terminalKind: null
    }),
    "worker_invoked"
  );

  assert.match(
    source,
    /\bfunction abgTerminalAllowsInstalledConvergence\b/u
  );
  assert.match(
    source,
    /input\.terminalKind === "converged"/u
  );
  assert.match(
    source,
    /input\.terminalKind === "gap_stop"[\s\S]*?return "blocked";/u
  );
  assert.match(
    source,
    /\bderiveRuntimeContinuationTransitionProjectionFromDisposition\b/u
  );
  assert.match(
    source,
    /\bfunction abgTraversalTransitionProjectionRef\b/u
  );
  assert.match(source, /\bruntimeEventsForBasis\b/u);
  assert.doesNotMatch(
    source,
    /deriveRuntimeAggregateProjection\(\s*input\.basis,\s*Object\.freeze\(\[\.\.\.input\.replayEvents,\s*\.\.\.input\.emittedEvents\]\)/u
  );
  assert.match(
    source,
    /const basisScopedProcessEvents\s*=\s*runtimeEventsForBasis\(\s*input\.basis,\s*input\.processResult\.events\s*\)/u
  );
  assert.doesNotMatch(
    source,
    /deriveRuntimeAggregateProjection\(\s*input\.basis,\s*input\.processResult\.events\s*\)/u
  );
  assert.match(source, /events:\s*basisScopedProcessEvents/u);
  assert.match(
    source,
    /traversalTransitionRef\s*=\s*abgTraversalTransitionProjectionRef/u
  );
  assert.match(
    source,
    /closureDisposition:\s*closureDecision\.disposition/u
  );
  assert.match(
    source,
    /input\.closureDisposition === "close"[\s\S]*?disposition:\s*"close"[\s\S]*?reason:\s*"edge_close"/u
  );
  assert.match(
    source,
    /const effectiveTerminalKind\s*=[\s\S]*?closureDisposition === "close"[\s\S]*?\?\s*"converged"/u
  );
  assert.match(
    source,
    /traversalTransitionRef,\s*\n\s*domainReadModelRefs/u
  );
  assert.doesNotMatch(source, /\bclosedWithoutNextTraversal\b/u);
  assert.doesNotMatch(
    source,
    /traversalTransitionRef:\s*nextActionProjection\.nextActionProjectionRef/u
  );
  assert.doesNotMatch(
    source,
    /terminal(?:\?\.terminalKind|Kind) === "gap_stop"[\s\S]{0,120}return "converged";/u
  );
});

test("T-197 A2 keeps SDLC start as shell over one admitted ABG boundary", () => {
  const product = repoFile("specification/PRODUCT.md");
  const entry = repoFile(
    "build_tenants/typescript/code/src/spec_method/entry.ts"
  );
  const installedStartPayload = sourceFunction(entry, "installedStartPayloadFor");
  const instructions = repoFile(
    "build_tenants/typescript/code/src/install/instruction_files.ts"
  );

  assert.match(product, /control remains in ABG until ABG exits/u);
  assert.match(product, /must not implement a product-local loop/u);
  assert.match(installedStartPayload, /\bexecuteInstalledOperatorStart\(/u);
  assert.doesNotMatch(
    installedStartPayload,
    /\bexecuteInstalledOperatorStartWithReentry\b/u
  );
  assert.doesNotMatch(installedStartPayload, /\brefreshReplayState\b/u);
  assert.doesNotMatch(
    installedStartPayload,
    /\binstalledStartShouldContinueForRequestedUntil\b/u
  );
  assert.doesNotMatch(
    entry,
    /import\s*\{[\s\S]*executeInstalledOperatorStartWithReentry/u
  );
  assert.match(
    instructions,
    /\$\{genesisCommand\} start --workspace \. --scope workspace --target graph_function:\$\{FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE\} --until converged/u
  );
  assert.match(
    instructions,
    /import \{ FG_LITE_DESIGN_MODULE_IMPLEMENTATION_EXECUTIVE \} from "\.\.\/graph\/catalog\.js";/u
  );
  assert.doesNotMatch(instructions, /\$\{oddSdlcCommand\}[^`]*--until converged/u);
});

test("T-197 review-grade semantic gaps remain ABG retry pressure, not evaluator stop", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/installed_operator.ts"
  );
  const openFindingsBranch = source.match(
    /if \(admission\.assessment\.status === "blocked" \|\| openFindings\.length > 0\) \{[\s\S]*?return constructEvaluationRuleOutcome\(\{[\s\S]*?\n    \}\);\n  \}/u
  );

  assert.notEqual(openFindingsBranch, null);
  assert.match(openFindingsBranch[0], /code:\s*"review_grade_edge_fulfillment_blocked"/u);
  assert.match(openFindingsBranch[0], /status:\s*"accepted"/u);
  assert.match(openFindingsBranch[0], /\bresidualPressureRefs\b/u);
  assert.doesNotMatch(openFindingsBranch[0], /status:\s*"blocked"/u);
});

test("T-197 B2 keeps component-depth as GTL target-carrier read model", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/component_depth_register.ts"
  );

  assert.match(source, /\bSDLC_COMPONENT_DEPTH_REGISTER_CONTRACT_TRACE\b/u);
  assert.match(source, /owner:\s*"downstream_product_read_model"/u);
  assert.match(source, /"REQ-L-GTL3-CONTRACT-LAW-API"/u);
  assert.match(source, /"REQ-L-GTL3-GRAPHVECTOR"/u);
  assert.match(source, /\bsdlcTargetCarrierOutputKind\b/u);
  assert.match(source, /\bsdlcTargetCarrierContractRef\b/u);
  assert.match(
    source,
    /expected:\s*sdlcTargetCarrierContractRef\(\{\s*edgeRef,\s*targetAssetType\s*\}\)/u
  );
  assert.doesNotMatch(source, /export\s+(?:interface|type)\s+Gtl/u);
  assert.doesNotMatch(source, /constructGtlContract/u);
});

test("T-197 B3 keeps prompt assets as GTL AssetSurface rows plus SDLC policy", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/prompt_assets.ts"
  );
  const input = constructCurrentSdlcGtlProgramConformanceInput();

  assert.match(source, /\badmitAssetSurface\b/u);
  assert.match(source, /\bconstructAssetSurface\b/u);
  assert.match(source, /\bconstructNode\b/u);
  assert.match(source, /rendered Markdown is a view over a GTL Node\/AssetSurface/u);
  assert.doesNotMatch(source, /export\s+interface\s+AssetSurface\b/u);

  assert.equal(input.promptAssets.length, 3);
  for (const row of input.promptAssets) {
    assert.match(row.assetSurface.kind, /^gtl\.asset_surface\/odd_sdlc\.prompt\//u);
    assert.equal(row.gtlNode.assetSurface, row.assetSurface);
    assert.match(row.gtlNode.id, /^node:\/\/odd-sdlc\/prompt\//u);
    assert.match(row.renderedViewDigest, /^sha256:/u);
    assert.ok(row.assetSurface.constructorRefs.length > 0);
    assert.ok(row.assetSurface.rendererRefs.length > 0);
    assert.ok(row.assetSurface.proofObligationRefs.length > 0);
    assert.ok(row.assetSurface.authoritySlots.length > 0);
  }
});

test("T-197 B4b keeps review-grade routing off tenant command grammar", () => {
  const source = repoFile(
    "build_tenants/typescript/code/src/operator/review_grade_edge_fulfillment.ts"
  );

  assert.doesNotMatch(source, /action\.includes\("node --test"\)/u);
  assert.doesNotMatch(source, /action\.includes\("npm test"\)/u);
  assert.match(source, /\bfailureClass\s*===\s*"test_overlap_missing"/u);
  assert.match(source, /\bfailureClass\s*===\s*"execution_environment"/u);
  assert.match(source, /action\.includes\("component_test_surface"\)/u);
  assert.match(source, /action\.includes\("execution evidence"\)/u);
});

test("T-197 H2 keeps F_D run analysis profiles open and capability-driven", () => {
  const typesSource = repoFile(
    "build_tenants/typescript/code/src/analysis/types.ts"
  );
  const profilesSource = repoFile(
    "build_tenants/typescript/code/src/analysis/profiles.ts"
  );
  const analyzeSource = repoFile(
    "build_tenants/typescript/code/src/analysis/analyze.ts"
  );

  assert.doesNotMatch(typesSource, /"hello_world",\s*\n\s*"data_mapper"/u);
  assert.doesNotMatch(profilesSource, /\bcase\s+"hello_world"\b/u);
  assert.doesNotMatch(profilesSource, /\bcase\s+"data_mapper"\b/u);
  assert.doesNotMatch(analyzeSource, /profile\s*===\s*"hello_world"/u);
  assert.match(profilesSource, /\btruthyCapability\(/u);
  assert.match(profilesSource, /"trivial_product"/u);
  assert.match(analyzeSource, /\bprofileCapabilityContracts\b/u);
});

test("T-197 H5/H7 keep prompt pressure policy off tenant command grammar", () => {
  const promptPolicySource = repoFile(
    "build_tenants/typescript/code/src/operator/plugins/transform/prompt_edge_policy.ts"
  );
  const reviewPromptSource = repoFile(
    "build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts"
  );

  assert.doesNotMatch(promptPolicySource, /text\.includes\("npm test"\)/u);
  assert.doesNotMatch(reviewPromptSource, /npm test execution/u);
  assert.match(promptPolicySource, /text\.includes\("component_test_surface"\)/u);
  assert.match(promptPolicySource, /text\.includes\("execution evidence"\)/u);
  assert.match(reviewPromptSource, /declared test-execution-contract proof/u);
});
