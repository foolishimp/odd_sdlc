// Validates: REQ-F-ODDSDLC-013
// Validates: REQ-F-ODDSDLC-014
// Validates: REQ-F-ODDSDLC-015
// Validates: REQ-F-ODDSDLC-021
// Validates: REQ-F-ODDSDLC-038
// Validates: REQ-F-ODDSDLC-057
// Investigates: T-030

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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
  SDLC_REUSABLE_GRAPH_FUNCTION_CATALOG,
  TRIAGE_FUNCTION_CATALOG,
  assertSdlcModuleJobsTargetPublishedGraphFunctions,
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule,
  FG_AMBIGUITY_ASSURANCE_LEDGER,
  FG_CAPABILITY_ASSURANCE_LEDGER,
  FG_CONFORM_PROJECT,
  FG_INGRESS_PROJECT,
  FG_MATERIALIZATION_ASSURANCE_LEDGER,
  FG_OBLIGATION_CARRY_ASSURANCE_LEDGER,
  FG_REQUIREMENT_FULFILLMENT_ASSURANCE_LEDGER,
  FG_SEMANTIC_CONVERGENCE_ASSURANCE_LEDGER,
  FG_SHALLOW_REALIZATION_ASSURANCE_LEDGER,
  FG_SINGLE_TYPED_TRAVERSAL,
  FG_TRAVERSAL_ASSURANCE_FOLD
} from "../../build/semantic/code/src/index.js";

const ASSURANCE_GRAPH_FUNCTION_NAMES = [
  FG_MATERIALIZATION_ASSURANCE_LEDGER,
  FG_SEMANTIC_CONVERGENCE_ASSURANCE_LEDGER,
  FG_OBLIGATION_CARRY_ASSURANCE_LEDGER,
  FG_REQUIREMENT_FULFILLMENT_ASSURANCE_LEDGER,
  FG_AMBIGUITY_ASSURANCE_LEDGER,
  FG_CAPABILITY_ASSURANCE_LEDGER,
  FG_SHALLOW_REALIZATION_ASSURANCE_LEDGER,
  FG_TRAVERSAL_ASSURANCE_FOLD
];

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
  assert.deepStrictEqual(
    catalog.libraryFunctions.map((entry) => entry.name),
    [
      FG_SINGLE_TYPED_TRAVERSAL,
      FG_INGRESS_PROJECT,
      FG_CONFORM_PROJECT,
      FG_MATERIALIZATION_ASSURANCE_LEDGER,
      FG_SEMANTIC_CONVERGENCE_ASSURANCE_LEDGER,
      FG_OBLIGATION_CARRY_ASSURANCE_LEDGER,
      FG_REQUIREMENT_FULFILLMENT_ASSURANCE_LEDGER,
      FG_AMBIGUITY_ASSURANCE_LEDGER,
      FG_CAPABILITY_ASSURANCE_LEDGER,
      FG_SHALLOW_REALIZATION_ASSURANCE_LEDGER,
      FG_TRAVERSAL_ASSURANCE_FOLD
    ]
  );
  assert(
    catalog.functions.every(
      (entry) => entry.specializesGraphFunction === FG_SINGLE_TYPED_TRAVERSAL
    )
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

test("T-030 reusable graph functions preserve catalog input and output signatures", () => {
  const module = constructSdlcGtlModule();
  for (const entry of SDLC_REUSABLE_GRAPH_FUNCTION_CATALOG) {
    const graphFunction = module.graphFunctions.find(
      (candidate) => candidate.name === entry.name
    );
    assert(graphFunction, entry.name);
    assert.deepStrictEqual(
      graphFunction.inputs.map((node) => node.name),
      entry.inputs,
      entry.name
    );
    assert.deepStrictEqual(
      graphFunction.outputs.map((node) => node.name),
      entry.outputs,
      entry.name
    );
  }
});

test("T-030 materializes executive graph functions through ABIogenesis GTL carriers", () => {
  const module = constructSdlcGtlModule();
  const graphFunctionNames = module.graphFunctions.map((graphFunction) => graphFunction.name);

  assert(graphFunctionNames.includes(FG_SINGLE_TYPED_TRAVERSAL));
  assert(graphFunctionNames.includes(FG_INGRESS_PROJECT));
  assert(graphFunctionNames.includes(FG_CONFORM_PROJECT));
  for (const graphFunctionName of ASSURANCE_GRAPH_FUNCTION_NAMES) {
    assert(graphFunctionNames.includes(graphFunctionName), graphFunctionName);
  }
  assert(graphFunctionNames.includes("bootstrap_release_self_test"));
  assert(graphFunctionNames.includes("release_operational_cycle"));
  assert.equal(module.jobs.length, 3);
  assert(module.jobs.some((job) => job.name === `${FG_CONFORM_PROJECT}_job`));
  assertSdlcModuleJobsTargetPublishedGraphFunctions(module);

  const bootstrapBasis = basisFor(module, "bootstrap_release_self_test");
  const operationalBasis = basisFor(module, "release_operational_cycle");
  const bootstrapProbe = deriveTraversalStructureProbe(bootstrapBasis);
  const operationalProbe = deriveTraversalStructureProbe(operationalBasis);

  assert.equal(bootstrapBasis.graph.vectors.length, 22);
  assert.equal(operationalBasis.graph.vectors.length, 7);
  assert.equal(bootstrapProbe.edge, "derive_intent_surface");
  assert.equal(operationalProbe.edge, "prepare_build_execution_surface");
  assert.equal(bootstrapProbe.transitionKind, "fp_dispatch");
  assert.equal(operationalProbe.transitionKind, "fp_dispatch");
});

test("T-055 publishes reusable single typed traversal as GTL library function", () => {
  const module = constructSdlcGtlModule();
  const libraryFunction = module.graphFunctions.find(
    (graphFunction) => graphFunction.name === FG_SINGLE_TYPED_TRAVERSAL
  );

  assert(libraryFunction);
  assert.deepStrictEqual(
    libraryFunction.inputs.map((node) => node.name),
    [
      "typed_source_asset",
      "target_type_surface",
      "traversal_transform_contract",
      "traversal_evaluation_contract"
    ]
  );
  assert.deepStrictEqual(
    libraryFunction.outputs.map((node) => node.name),
    ["typed_traversal_closure_surface"]
  );
  assert(libraryFunction.tags.includes("published_library"));
});

test("T-056 publishes ingress project as GTL library function", () => {
  const module = constructSdlcGtlModule();
  const libraryFunction = module.graphFunctions.find(
    (graphFunction) => graphFunction.name === FG_INGRESS_PROJECT
  );

  assert(libraryFunction);
  assert.deepStrictEqual(
    libraryFunction.inputs.map((node) => node.name),
    [
      "ingress_source_set",
      "project_type_surface",
      "project_ingress_contract"
    ]
  );
  assert.deepStrictEqual(
    libraryFunction.outputs.map((node) => node.name),
    [
      "project_surface",
      "source_input_ledger",
      "lineage_map",
      "ambiguity_register",
      "bootstrap_gap_set"
    ]
  );
  assert(libraryFunction.tags.includes("published_library"));
});

test("T-068 publishes conform project as GTL library function", () => {
  const module = constructSdlcGtlModule();
  const libraryFunction = module.graphFunctions.find(
    (graphFunction) => graphFunction.name === FG_CONFORM_PROJECT
  );

  assert(libraryFunction);
  assert.deepStrictEqual(
    libraryFunction.inputs.map((node) => node.name),
    [
      "ingress_source_set",
      "source_input_ledger",
      "project_constraints_source",
      "project_topology_policy"
    ]
  );
  assert.deepStrictEqual(
    libraryFunction.outputs.map((node) => node.name),
    [
      "conform_project_profile",
      "selected_tenant_surface",
      "module_inventory_surface",
      "capability_contract_surface",
      "execution_contract_surface",
      "conformance_gap_set"
    ]
  );
  assert(libraryFunction.tags.includes("published_library"));
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

test("T-049 publishes reusable graph-function library design guardrails", () => {
  const design = readFileSync(
    new URL(
      "../../design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md",
      import.meta.url
    ),
    "utf8"
  );

  assert.match(design, /Fg_single_typed_traversal/);
  assert.match(design, /Fg_ingress_project/);
  assert.match(design, /ABG owns graph-call, frames, continuation, iteration, retry/);
  assert.match(design, /tenant-local control loop/);
  assert.match(design, /does not widen the RC claim/);
  assert.match(design, /T-055-realize-typescript-reusable-single-typed-traversal-library-slice/);
  assert.match(design, /T-056-realize-typescript-ingress-project-library-slice/);
});
