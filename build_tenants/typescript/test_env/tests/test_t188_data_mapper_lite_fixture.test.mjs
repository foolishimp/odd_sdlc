// Validates: T-188

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_MAPPER_LITE_FIXTURE_ROOT,
  DATA_MAPPER_LITE_SELECTED_REQUIREMENT_IDS,
  DATA_MAPPER_LITE_SOURCE_FILES,
  assertDataMapperLiteFixtureTraceability
} from "../fixtures/data_mapper_lite_fixture.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, "../..");

test("T-188 data_mapper-lite fixture is sourced from canonical requirement IDs", () => {
  assertDataMapperLiteFixtureTraceability();
  for (const rel of DATA_MAPPER_LITE_SOURCE_FILES) {
    assert.equal(
      existsSync(path.join(DATA_MAPPER_LITE_FIXTURE_ROOT, rel)),
      true,
      rel
    );
  }
  for (const rel of [
    "build_tenants/data_mapper_lite_javascript/package.json",
    "build_tenants/data_mapper_lite_javascript/src/topology.js",
    "build_tenants/data_mapper_lite_javascript/test/topology.test.js"
  ]) {
    assert.equal(
      existsSync(path.join(DATA_MAPPER_LITE_FIXTURE_ROOT, rel)),
      false,
      `fixture must not include generated product file ${rel}`
    );
  }
});

test("T-188 data_mapper-lite lifecycle runner binds the lite fixture and test lifecycle", () => {
  const runner = readFileSync(
    path.join(PACKAGE_ROOT, "test_env/live/run_t188_data_mapper_lite_lifecycle.mjs"),
    "utf8"
  );
  const fixtureRequirements = readFileSync(
    path.join(DATA_MAPPER_LITE_FIXTURE_ROOT, "specification/REQUIREMENTS.md"),
    "utf8"
  );
  assert.match(runner, /ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT/u);
  assert.match(runner, /DATA_MAPPER_LITE_FIXTURE_ROOT/u);
  assert.match(runner, /derive_test_execution_result_surface/u);
  assert.match(runner, /executionEvidenceTestsObserved/u);
  for (const requirementId of DATA_MAPPER_LITE_SELECTED_REQUIREMENT_IDS) {
    assert.match(fixtureRequirements, new RegExp(requirementId, "u"));
  }
});
