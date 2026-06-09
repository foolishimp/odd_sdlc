// Validates: T-197

import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync
} from "node:fs";
import path from "node:path";
import {
  formatGtlProgramConformanceIssues
} from "@abiogenesis/typescript-tenant";
import {
  assertCurrentSdlcGtlProgramConformance,
  constructCurrentSdlcGtlProgramConformanceInput,
  typecheckCurrentSdlcGtlProgram,
  typecheckSdlcGtlProgramConformanceInput
} from "../../build/semantic/code/src/index.js";

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

function repoFile(relativePath) {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
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
