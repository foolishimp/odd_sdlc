// Validates: T-194
// SDLC supplies its production inventory; ABG owns GTL program conformance law.

import test from "node:test";
import assert from "node:assert/strict";
import {
  formatGtlProgramConformanceIssues
} from "@abiogenesis/typescript-tenant";
import {
  STALE_ABG_IDENTITY_PATTERN,
  activeSdlcSourceIdentitySurfaces,
  constructCurrentSdlcGtlProgramConformanceInput,
  typecheckCurrentSdlcGtlProgram
} from "../../build/semantic/code/src/index.js";

function assertConformancePassed(report) {
  assert.equal(
    report.passed,
    true,
    formatGtlProgramConformanceIssues(report.issues)
  );
  assert.equal(report.issueCount, 0);
}

test("T-194 typechecks the current production SDLC GTL inventory", () => {
  const input = constructCurrentSdlcGtlProgramConformanceInput();
  const report = typecheckCurrentSdlcGtlProgram();

  assertConformancePassed(report);
  assert.equal(
    input.expectedCoverage.graphVectorCount,
    input.expectedCoverage.targetCarrierContractCount
  );
  assert.equal(
    input.expectedCoverage.graphVectorCount,
    input.expectedCoverage.edgeClosureContractCount
  );
  assert.equal(input.expectedCoverage.promptAssetCount, 3);
  assert.equal(input.expectedCoverage.pluginContractCount, 6);
  assert.ok(input.expectedCoverage.sourceIdentitySurfaceCount > 0);
  assert.ok(input.featureCoverageManifest.rows.length >= 26);
});

test("T-194 active SDLC source surfaces contain no stale ABG 3.x identities", () => {
  for (const sample of [
    "abg-3.7 policy carrier",
    "ABIogenesis 3.7.1-rc.1",
    "runtime://abg/3.8/saga-frontier",
    "@abiogenesis/typescript-tenant@3.9.0-rc.13",
    "old rc13 package alias"
  ]) {
    assert.match(sample, STALE_ABG_IDENTITY_PATTERN);
  }

  const staleHits = activeSdlcSourceIdentitySurfaces()
    .filter((row) => STALE_ABG_IDENTITY_PATTERN.test(row.text))
    .map((row) => row.surfaceRef);

  assert.deepEqual(staleHits, []);
});
