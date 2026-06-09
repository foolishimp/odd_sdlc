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
    "T-154-expose-runtime-authorship-routes-for-downstream-resume-and-span-reentry.md",
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
  assert.match(ticket, /ABG T-154 filed for explicit resume cursor/u);
  assert.match(ticket, /npm run test:t164` passed 22\/22 edge-contract \+ 1\/1 Rust-service sandbox/u);
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
