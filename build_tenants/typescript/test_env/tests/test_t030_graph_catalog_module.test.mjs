// Validates: REQ-F-ODDSDLC-013
// Validates: REQ-F-ODDSDLC-014
// Validates: REQ-F-ODDSDLC-015
// Validates: REQ-F-ODDSDLC-021
// Validates: REQ-F-ODDSDLC-038
// Investigates: T-030

import test from "node:test";
import assert from "node:assert/strict";

import {
  admitExecutionBasis,
  admitModule,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  admitStartIntent,
  deriveTraversalStructureProbe
} from "@abiogenesis/typescript-tenant";

import {
  BOOTSTRAP_RELEASE_FUNCTION_CATALOG,
  OPERATIONAL_FUNCTION_CATALOG,
  TRIAGE_FUNCTION_CATALOG,
  assertSdlcModuleJobsTargetPublishedGraphFunctions,
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule
} from "../../build/semantic/code/src/index.js";

function basisFor(module, handle) {
  return admitExecutionBasis({
    startIntent: admitStartIntent({
      scope: {
        kind: "workspace",
        workspaceRoot: "/workspace/odd-sdlc-typescript-gtl-module",
        moduleName: module.name
      },
      target: {
        kind: "graph_function",
        handle
      },
      until: "converged"
    }),
    module,
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: "worker://odd-sdlc/typescript",
      backendId: "backend://node",
      buildId: "build://odd-sdlc/typescript",
      resolvedRuntimeRef: "runtime://abiogenesis/typescript"
    }),
    resolvedPolicy: admitResolvedPolicyIdentity({
      resolvedPolicyBundleRef: "policy://odd-sdlc/t030/F_P",
      defaultRegime: "F_P",
      dispatchRef: "dispatch://odd-sdlc/t030",
      approvalSubjectRef: null
    }),
    runId: "run://odd-sdlc/t030",
    workKey: "wk://odd-sdlc/t030",
    frameId: null,
    frameLineageId: null
  });
}

test("T-030 publishes machine-readable function and executive catalogs", () => {
  const catalog = constructSdlcGraphFunctionCatalog();

  assert.equal(catalog.kind, "sdlc_graph_function_catalog");
  assert.equal(
    catalog.functions.length,
    BOOTSTRAP_RELEASE_FUNCTION_CATALOG.length +
      OPERATIONAL_FUNCTION_CATALOG.length +
      TRIAGE_FUNCTION_CATALOG.length
  );
  assert(catalog.functions.some((entry) => entry.name === "observe_gap_pressure"));
  assert(catalog.functions.some((entry) => entry.name === "retire_gap_after_loopback"));
  assert.deepStrictEqual(
    catalog.executives.map((entry) => entry.name),
    ["bootstrap_release_self_test", "release_operational_cycle"]
  );
  assert.deepStrictEqual(
    catalog.executives[0].steps,
    BOOTSTRAP_RELEASE_FUNCTION_CATALOG.map((entry) => entry.name)
  );
  assert.deepStrictEqual(
    catalog.executives[1].steps,
    OPERATIONAL_FUNCTION_CATALOG.map((entry) => entry.name)
  );
});

test("T-030 materializes executive graph functions through ABIogenesis GTL carriers", () => {
  const module = constructSdlcGtlModule();
  const graphFunctionNames = module.graphFunctions.map((graphFunction) => graphFunction.name);

  assert(graphFunctionNames.includes("bootstrap_release_self_test"));
  assert(graphFunctionNames.includes("release_operational_cycle"));
  assert.equal(module.jobs.length, 2);
  assertSdlcModuleJobsTargetPublishedGraphFunctions(module);

  const bootstrapBasis = basisFor(module, "bootstrap_release_self_test");
  const operationalBasis = basisFor(module, "release_operational_cycle");
  const bootstrapProbe = deriveTraversalStructureProbe(bootstrapBasis);
  const operationalProbe = deriveTraversalStructureProbe(operationalBasis);

  assert.equal(bootstrapBasis.graph.vectors.length, 18);
  assert.equal(operationalBasis.graph.vectors.length, 9);
  assert.equal(bootstrapProbe.edge, "derive_intent_surface");
  assert.equal(operationalProbe.edge, "prepare_build_execution_surface");
  assert.equal(bootstrapProbe.transitionKind, "fp_dispatch");
  assert.equal(operationalProbe.transitionKind, "fp_dispatch");
});

test("T-030 rejects jobs targeting unpublished graph functions", () => {
  const module = constructSdlcGtlModule();

  assert.throws(
    () =>
      admitModule({
        name: "odd_sdlc_typescript_bad_job",
        graphs: [],
        graphFunctions: module.graphFunctions,
        refinementBoundaries: [],
        candidateFamilies: [],
        jobs: [
          {
            id: "job:bad",
            name: "bad_job",
            contracts: [{ kind: "graph_function", targetId: "missing" }],
            roles: [],
            tags: []
          }
        ],
        roles: [],
        operators: [],
        evaluators: [],
        rules: [],
        imports: [],
        metadata: { entries: [] }
      }),
    /unpublished graph function/
  );
});
