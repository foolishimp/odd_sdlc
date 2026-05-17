// Validates: T-158

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname } from "node:path";

import { materializeGraphFunction } from "@abiogenesis/typescript-tenant";

import {
  admitSdlcProjectConstraints,
  constructSdlcGtlModule,
  deriveSdlcPostProductMaterializationActionInput,
  deriveSdlcPostProductMaterializationActionResolution,
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcWorkspaceIngressReport,
  executeInstalledOperatorStart,
  invokeOddSdlcSpecMethodCommandSync,
  materializeSdlcProjectConformance,
  projectSdlcQueryDomain,
  projectSdlcWorkerAttachment,
  publicStartOnce
} from "../../build/semantic/code/src/index.js";

function graphTrackRefs(graphFunctionName) {
  const graphFunction = constructSdlcGtlModule().graphFunctions.find(
    (candidate) => candidate.name === graphFunctionName
  );
  assert(graphFunction);
  const vector = materializeGraphFunction(graphFunction).vectors[0];
  assert(vector);
  return Object.freeze({
    graphFunctionRef: graphFunction.name,
    graphVectorRef: vector.name
  });
}

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t158-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# T-158 Fixture", "", "Build a governed product slice."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    ["# Intent", "", "Create a typed downstream implementation."].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-fixture.md"),
    [
      "# Requirements",
      "",
      "REQ-T158-001: Non-close F_P dispatch publishes admitted consequence truth."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t158_consequence_admission",
      "active_tenant: scala_spark",
      "selected_output_root: build_tenants/scala_spark",
      "ambiguity_risk_appetite: medium"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function makeStart(workspaceRoot) {
  const module = constructSdlcGtlModule();
  const ingressReport = deriveSdlcWorkspaceIngressReport({
    workspaceRootUri: `file://${workspaceRoot}`,
    projectConstraints: admitSdlcProjectConstraints({
      projectSlug: "t158",
      activeTenant: "scala_spark",
      selectedOutputRoot: "build_tenants/scala_spark",
      ambiguityRiskAppetite: "medium",
      capabilityContracts: []
    }),
    sourceInputs: []
  });
  const queryDomain = projectSdlcQueryDomain({ module, ingressReport });
  const conformedProject =
    deriveSdlcConformProjectProfileFromWorkspace(workspaceRoot);
  const start = publicStartOnce({
    request: {
      kind: "sdlc_public_start_request",
      workspaceRoot,
      target: {
        kind: "graph_function",
        handle: "bootstrap_release_self_test"
      },
      until: "first_traversal",
      defaultRegime: "F_P"
    },
    module,
    queryDomain,
    conformedProject,
    workerAttachment: projectSdlcWorkerAttachment({
      transportContract: "process://node"
    })
  });
  assert.equal(start.kind, "sdlc_public_start_projected");
  return start;
}

function assessedEventForVector(basis, vector, index) {
  return {
    kind: "assessed",
    assessmentKind: "fp",
    edge: vector.name,
    obligationId: `t158-preclosed-${index}`,
    publishedLedgerRef: `proof://t158/preclosed/${index}`,
    actor: "test",
    specHash: `sha256:t158preclosed${index}`,
    manifestId: `manifest:t158:preclosed:${index}`,
    workflowVersion: "t158-preclosed",
    runId: basis.runId,
    workKey: basis.workKey,
    selectedWorkerId: null,
    selectedBackend: null,
    roleId: null,
    authorityRef: null,
    assignmentSource: null,
    resolvedRuntimeRef: null
  };
}

function vectorClosedEventForVector(basis, vector, index) {
  return {
    kind: "vector_closed",
    basisId: basis.id,
    graphCallId: `graph-call:${basis.id}`,
    frameId: `frame:${basis.id}:root`,
    vectorIndex: index,
    edge: vector.name,
    closureKind: "advanced"
  };
}

function preclosedEventsBeforeEdge(basis, edgeName) {
  const targetIndex = basis.graph.vectors.findIndex(
    (vector) => vector.name === edgeName
  );
  assert.notEqual(targetIndex, -1, `${edgeName} vector must exist`);
  return Object.freeze(
    basis.graph.vectors
      .slice(0, targetIndex)
      .flatMap((vector, index) => [
        assessedEventForVector(basis, vector, index),
        vectorClosedEventForVector(basis, vector, index)
      ])
  );
}

function writeUnassessedObligationWorkerScript(workspaceRoot) {
  const workerPath = path.join(workspaceRoot, "t158_unassessed_obligation_worker.mjs");
  writeFileSync(
    workerPath,
    [
      "import { createHash } from 'node:crypto';",
      "import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
      "import path, { dirname } from 'node:path';",
      "const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));",
      "const output = [`# ${manifest.targetAssetType}`, '', `edge: ${manifest.edgeName}`].join('\\n') + '\\n';",
      "mkdirSync(dirname(manifest.outputFile), { recursive: true });",
      "writeFileSync(manifest.outputFile, output, 'utf8');",
      "const tenantRelative = 'src/main/scala/generated/Core.scala';",
      "const sourcePath = path.join(manifest.productMaterialization.tenantRoot, tenantRelative);",
      "mkdirSync(dirname(sourcePath), { recursive: true });",
      "const source = 'package generated\\nobject Core { def transform(value: String): String = value.reverse + value.length.toString }\\n';",
      "writeFileSync(sourcePath, source, 'utf8');",
      "const outputDigest = `sha256:${createHash('sha256').update(output, 'utf8').digest('hex')}`;",
      "const sourceDigest = `sha256:${createHash('sha256').update(source, 'utf8').digest('hex')}`;",
      "const materializedFiles = [{ kind: 'sdlc_materialized_product_file', role: 'source', relativePath: tenantRelative, absolutePath: sourcePath, digest: sourceDigest, byteCount: Buffer.byteLength(source, 'utf8') }];",
      "writeFileSync(manifest.reportFile, `${JSON.stringify({ kind: 'odd_sdlc.worker_result_report', graphFunctionName: manifest.graphFunctionName, edgeName: manifest.edgeName, targetAssetType: manifest.targetAssetType, outputFile: manifest.outputFile, digest: outputDigest, summary: 'generated source without traversal obligation assessments', unresolvedReasons: [], materializedFiles, executionEvidence: null }, null, 2)}\\n`, 'utf8');"
    ].join("\n"),
    "utf8"
  );
  return workerPath;
}

function writePostCloseNextActionArchive(workspaceRoot, input) {
  const archiveRoot = path.join(
    workspaceRoot,
    ".ai-workspace/runtime/odd_sdlc/operator-runs",
    input.name
  );
  mkdirSync(archiveRoot, { recursive: true });
  const decisionRef = `closure-decision://t158/${input.name}`;
  writeFileSync(
    path.join(archiveRoot, "sdlc_edge_closure_decision.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_edge_closure_decision",
        decisionRef,
        disposition: "close"
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "sdlc_edge_fulfillment_ledger.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_edge_fulfillment_ledger",
        ledgerRef: `ledger://t158/${input.name}`,
        ledgerVersionRef: `ledger-version://t158/${input.name}/1`,
        counts: {
          expected: 1,
          fulfilled: 1,
          partial: 0,
          blocked: 0,
          unfulfilled: 0,
          missing: 0,
          extra: 0
        },
        edgeConverged: true
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    path.join(archiveRoot, "sdlc_next_action_projection.json"),
    `${JSON.stringify(
      {
        kind: "sdlc_next_action_projection",
        choosesNextTraversal: true,
        selectedActionRef:
          "construction-action://t158/Fg_materialize_declared_product_asset/component-code",
        nextActionProjectionRef:
          `construction-priority-projection://t158/${input.name}`,
        nextGraphFunctionRef: input.nextGraphFunctionRef,
        nextGraphVectorRef: input.nextGraphVectorRef ?? null,
        predecessorRefs: [decisionRef]
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

test("T-158 non-close F_P dispatch publishes consequence before returning dispatch truth", async () => {
  const workspace = makeWorkspace();
  const start = makeStart(workspace);
  const basis = start.executionContract.basis;
  const workerScript = writeUnassessedObligationWorkerScript(workspace);

  const outcome = await executeInstalledOperatorStart({
    workspaceRoot: workspace,
    start,
    workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
    replayEvents: preclosedEventsBeforeEdge(basis, "derive_component_code_surface")
  });

  assert.equal(outcome.status, "postflight_failed");
  assert.equal(outcome.summary.currentEdge, "derive_component_code_surface");
  assert(outcome.archiveRoot);
  assert(outcome.traversalConsequence);
  assert.equal(outcome.traversalConsequence.edgeClosureDecision.disposition, "retry");

  const closurePath = path.join(outcome.archiveRoot, "sdlc_edge_closure_decision.json");
  const nextActionPath = path.join(outcome.archiveRoot, "sdlc_next_action_projection.json");
  assert.equal(existsSync(closurePath), true);
  assert.equal(existsSync(nextActionPath), true);

  const closureDecision = JSON.parse(readFileSync(closurePath, "utf8"));
  const nextActionProjection = JSON.parse(readFileSync(nextActionPath, "utf8"));
  assert.equal(closureDecision.disposition, "retry");
  assert.equal(
    nextActionProjection.nextActionProjectionRef,
    outcome.traversalConsequence.nextActionProjection.nextActionProjectionRef
  );
  assert.equal(
    outcome.summary.nextLawfulAction,
    nextActionProjection.selectedActionRef
  );

  const runtimeEvents = JSON.parse(
    readFileSync(path.join(outcome.archiveRoot, "runtime_events.json"), "utf8")
  );
  assert.equal(runtimeEvents.kind, "sdlc_runtime_event_archive_projection");
  const closedInvocation = runtimeEvents.events
    .filter((event) => event.kind === "actor_invocation_closed")
    .at(-1);
  assert(closedInvocation);
  assert.equal(
    closedInvocation.resultRef,
    outcome.gapDossier.currentGapDossierRef
  );

  const gaps = invokeOddSdlcSpecMethodCommandSync(["gaps", "--workspace", workspace]);
  assert.equal(gaps.status, "ok");
  assert.equal(
    gaps.payload.requirementFulfillment.archiveRehydration.status,
    "rehydrated"
  );
  assert.equal(
    gaps.payload.requirementFulfillment.edgeClosureDisposition,
    "retry"
  );
  assert(
    gaps.payload.requirementFulfillment.rows.some((row) =>
      row.evaluatorSourceRefs.includes(nextActionProjection.nextActionProjectionRef)
    )
  );
});

test("T-158 replayed Eval_Action must carry graph-vector track authority", () => {
  const workspace = makeWorkspace();
  const staleMaterializer = graphTrackRefs("Fg_materialize_declared_product_asset");
  writePostCloseNextActionArchive(workspace, {
    name: "20260512T000000000Z_pid158",
    nextGraphFunctionRef: staleMaterializer.graphFunctionRef,
    nextGraphVectorRef: null
  });

  const stale = invokeOddSdlcSpecMethodCommandSync(["gaps", "--workspace", workspace]);
  assert.equal(stale.status, "ok");
  assert.equal(stale.payload.blockingReason, "next_action_projection_graph_vector_missing");
  assert(
    stale.payload.blockingReasonCarriers.some(
      (reason) => reason.code === "next_action_projection_graph_vector_missing"
    )
  );

  const componentCode = graphTrackRefs("derive_component_code_surface");
  writePostCloseNextActionArchive(workspace, {
    name: "20260512T000100000Z_pid158",
    nextGraphFunctionRef: componentCode.graphFunctionRef,
    nextGraphVectorRef: componentCode.graphVectorRef
  });

  const replayed = invokeOddSdlcSpecMethodCommandSync(["gaps", "--workspace", workspace]);
  assert.equal(replayed.status, "ok");
  assert.equal(
    replayed.payload.start.executionContract.targetGraphFunction,
    "derive_component_code_surface"
  );
  assert.equal(
    replayed.payload.start.executionContract.nextActionProjection.nextGraphVectorRef,
    componentCode.graphVectorRef
  );
  assert.equal(replayed.payload.projection.currentEdge, "derive_component_code_surface");
});

test("T-158 replayed Eval_Action boundary refs fail as typed diagnostics", () => {
  const valid = graphTrackRefs("derive_component_code_surface");
  const cases = [
    {
      name: "legacy-function",
      code: "legacy_graph_function_boundary_ref",
      nextGraphFunctionRef: `graph-function:${valid.graphFunctionRef}`,
      nextGraphVectorRef: valid.graphVectorRef
    },
    {
      name: "unknown-function",
      code: "unknown_graph_function_boundary_ref",
      nextGraphFunctionRef: "missing_graph_function",
      nextGraphVectorRef: valid.graphVectorRef
    },
    {
      name: "legacy-vector",
      code: "legacy_graph_vector_boundary_ref",
      nextGraphFunctionRef: valid.graphFunctionRef,
      nextGraphVectorRef: `graph-vector:${valid.graphVectorRef}`
    },
    {
      name: "unknown-vector",
      code: "unknown_graph_vector_boundary_ref",
      nextGraphFunctionRef: valid.graphFunctionRef,
      nextGraphVectorRef: "missing_graph_vector"
    }
  ];

  for (const testCase of cases) {
    const workspace = makeWorkspace();
    writePostCloseNextActionArchive(workspace, {
      name: `20260512T000200000Z_pid158_${testCase.name}`,
      nextGraphFunctionRef: testCase.nextGraphFunctionRef,
      nextGraphVectorRef: testCase.nextGraphVectorRef
    });

    const result = invokeOddSdlcSpecMethodCommandSync(["gaps", "--workspace", workspace]);

    assert.equal(result.status, "ok");
    assert.equal(result.payload.blockingReason, testCase.code);
    assert(
      result.payload.blockingReasonCarriers.some(
        (reason) => reason.code === testCase.code
      ),
      JSON.stringify(result.payload, null, 2)
    );
  }
});

test("T-158 product materialization Eval_Action fails closed on unresolved graph track", () => {
  const module = constructSdlcGtlModule();
  const withoutComponentCodeTrack = {
    ...module,
    graphFunctions: Object.freeze(
      module.graphFunctions.filter(
        (graphFunction) => graphFunction.name !== "derive_component_code_surface"
      )
    )
  };

  const resolution = deriveSdlcPostProductMaterializationActionResolution({
    module: withoutComponentCodeTrack,
    runRef: "run://t158/unresolved-track",
    downstreamPressureRefs: ["downstream-pressure://t158/component-code"],
    admittedAssetTypes: ["implementation_design_surface"],
    downstreamTargetBindingRefs: [
      "target-binding://odd-sdlc/component_code_surface"
    ]
  });

  assert.equal(resolution.status, "blocked");
  assert.equal(
    resolution.blockingReason.code,
    "post_materialization_graph_track_unresolved"
  );
  assert.match(
    resolution.blockingReason.detail,
    /graph_track_target_unresolved_for_product_materialization_action/u
  );
  assert.equal(
    deriveSdlcPostProductMaterializationActionInput({
      module: withoutComponentCodeTrack,
      runRef: "run://t158/unresolved-track",
      downstreamPressureRefs: ["downstream-pressure://t158/component-code"],
      admittedAssetTypes: ["implementation_design_surface"],
      downstreamTargetBindingRefs: [
        "target-binding://odd-sdlc/component_code_surface"
      ]
    }),
    null
  );
});

test("T-158 product materialization Eval_Action walks graph prerequisites before terminal code", () => {
  const module = constructSdlcGtlModule();
  const uatTestcases = graphTrackRefs("derive_uat_testcases_surface");

  const action = deriveSdlcPostProductMaterializationActionInput({
    module,
    runRef: "run://t158/prerequisite-track",
    downstreamPressureRefs: ["downstream-pressure://t158/component-code"],
    downstreamTargetBindingRefs: [
      "target-binding://odd-sdlc/component_code_surface"
    ],
    admittedAssetTypes: [
      "project_bootstrap_surface",
      "intent_surface",
      "product_surface",
      "goal_surface",
      "requirement_surface",
      "project_authority_conformance_projection",
      "project_authority_next_action_projection"
    ]
  });

  assert(action);
  assert.equal(action.graphFunctionRef, uatTestcases.graphFunctionRef);
  assert.equal(action.graphVectorRef, uatTestcases.graphVectorRef);
  assert(
    action.eligibleReasonRefs.includes(
      "graph_track_requested_target:component_code_surface"
    )
  );
  assert(
    action.eligibleReasonRefs.includes(
      "graph_track_selected_target:uat_testcases_surface"
    )
  );
});

test("T-171 post-intent continuation admits source basis before selecting product", () => {
  const module = constructSdlcGtlModule();
  const product = graphTrackRefs("derive_product_surface");

  const blockedWithoutSourceBasis =
    deriveSdlcPostProductMaterializationActionResolution({
      module,
      runRef: "run://t171/post-intent-without-source",
      downstreamPressureRefs: ["downstream-pressure://t171/component-code"],
      downstreamTargetBindingRefs: [
        "target-binding://odd-sdlc/component_code_surface"
      ],
      admittedAssetTypes: ["intent_surface"]
    });

  assert.equal(blockedWithoutSourceBasis.status, "blocked");
  assert.equal(
    blockedWithoutSourceBasis.blockingReason.code,
    "post_materialization_graph_track_unresolved"
  );
  assert.match(blockedWithoutSourceBasis.blockingReason.detail, /input_set/u);

  const action = deriveSdlcPostProductMaterializationActionInput({
    module,
    runRef: "run://t171/post-intent-with-source",
    downstreamPressureRefs: ["downstream-pressure://t171/component-code"],
    downstreamTargetBindingRefs: [
      "target-binding://odd-sdlc/component_code_surface"
    ],
    admittedAssetTypes: ["input_set", "intent_surface"]
  });

  assert(action);
  assert.equal(action.graphFunctionRef, product.graphFunctionRef);
  assert.equal(action.graphVectorRef, product.graphVectorRef);
  assert(
    action.eligibleReasonRefs.includes(
      "graph_track_selected_target:product_surface"
    )
  );
});

test("T-158 product materialization Eval_Action stops when requested target is admitted", () => {
  const module = constructSdlcGtlModule();

  const resolution = deriveSdlcPostProductMaterializationActionResolution({
    module,
    runRef: "run://t158/satisfied-target",
    downstreamPressureRefs: [
      "construction-action://odd-sdlc/post-action/Fg_materialize_declared_product_asset/post_downstream_product_materialization/target-outcome://odd-sdlc/post-action/Fg_materialize_declared_product_asset/component_code_surface/run"
    ],
    downstreamTargetBindingRefs: [
      "target-binding://odd-sdlc/component_code_surface"
    ],
    admittedAssetTypes: [
      "project_bootstrap_surface",
      "intent_surface",
      "product_surface",
      "goal_surface",
      "requirement_surface",
      "project_authority_conformance_projection",
      "project_authority_next_action_projection",
      "feature_decomp_surface",
      "design_surface",
      "scenario_surface",
      "implementation_design_surface",
      "component_code_surface"
    ]
  });

  assert.equal(resolution.status, "no_pressure");
  assert.equal(
    deriveSdlcPostProductMaterializationActionInput({
      module,
      runRef: "run://t158/satisfied-target",
      downstreamPressureRefs: [
        "construction-action://odd-sdlc/post-action/Fg_materialize_declared_product_asset/post_downstream_product_materialization/target-outcome://odd-sdlc/post-action/Fg_materialize_declared_product_asset/component_code_surface/run"
      ],
      downstreamTargetBindingRefs: [
        "target-binding://odd-sdlc/component_code_surface"
      ],
      admittedAssetTypes: ["component_code_surface"]
    }),
    null
  );
});

test("T-158 product materialization Eval_Action fails closed on ambiguous graph track", () => {
  const module = constructSdlcGtlModule();
  const componentCode = module.graphFunctions.find(
    (graphFunction) => graphFunction.name === "derive_component_code_surface"
  );
  assert(componentCode);
  const duplicateComponentCode = Object.freeze({
    ...componentCode,
    id: "graph-function:odd_sdlc:t158_duplicate_component_code_surface",
    name: "t158_duplicate_component_code_surface"
  });
  const ambiguousModule = {
    ...module,
    graphFunctions: Object.freeze([...module.graphFunctions, duplicateComponentCode])
  };

  const resolution = deriveSdlcPostProductMaterializationActionResolution({
    module: ambiguousModule,
    runRef: "run://t158/ambiguous-track",
    downstreamPressureRefs: ["downstream-pressure://t158/component-code"],
    admittedAssetTypes: ["implementation_design_surface"],
    downstreamTargetBindingRefs: [
      "target-binding://odd-sdlc/component_code_surface"
    ]
  });

  assert.equal(resolution.status, "blocked");
  assert.equal(
    resolution.blockingReason.code,
    "post_materialization_graph_track_unresolved"
  );
  assert.match(
    resolution.blockingReason.detail,
    /graph_track_target_ambiguous_for_product_materialization_action/u
  );
});

test("T-158 product materialization graph track treats untagged peers as ambiguous", () => {
  const module = constructSdlcGtlModule();
  const componentCode = module.graphFunctions.find(
    (graphFunction) => graphFunction.name === "derive_component_code_surface"
  );
  assert(componentCode);
  const untaggedPeer = Object.freeze({
    ...componentCode,
    id: "graph-function:odd_sdlc:t158_untagged_peer_component_code_surface",
    name: "t158_untagged_peer_component_code_surface",
    tags: Object.freeze([])
  });
  const ambiguousModule = {
    ...module,
    graphFunctions: Object.freeze([...module.graphFunctions, untaggedPeer])
  };

  const resolution = deriveSdlcPostProductMaterializationActionResolution({
    module: ambiguousModule,
    runRef: "run://t158/untagged-peer-track",
    downstreamPressureRefs: ["downstream-pressure://t158/component-code"],
    admittedAssetTypes: ["implementation_design_surface"],
    downstreamTargetBindingRefs: [
      "target-binding://odd-sdlc/component_code_surface"
    ]
  });

  assert.equal(resolution.status, "blocked");
  assert.match(
    resolution.blockingReason.detail,
    /graph_track_target_ambiguous_for_product_materialization_action/u
  );
});

test("T-158 installed operator admits non-close consequence before dispatch return", () => {
  const source = readFileSync(
    new URL("../../code/src/operator/installed_operator.ts", import.meta.url),
    "utf8"
  );
  const publishMarkers =
    source.match(/const consequence = publishDispatchState\(current\);/gu) ?? [];
  assert.equal(publishMarkers.length, 6);

  for (const branchStatus of [
    'status: "worker_failed"',
    'status: "worker_report_rejected"',
    'status: "postflight_failed"',
    'status:\n            assuranceGate.satisfaction.status === "fp_escalation"',
    'status: "worker_invoked"'
  ]) {
    const branchIndex = source.indexOf(branchStatus);
    assert.notEqual(branchIndex, -1, branchStatus);
    const publishIndex = source.indexOf(
      "const consequence = publishDispatchState(current);",
      branchIndex
    );
    const returnIndex = source.indexOf("return constructFpDispatchOutcome", branchIndex);
    assert(publishIndex > branchIndex, branchStatus);
    assert(returnIndex > publishIndex, branchStatus);
    const branchBody = source.slice(publishIndex, returnIndex + 800);
    assert.match(
      branchBody,
      /consequence\.nextActionProjection\.nextActionProjectionRef/u,
      branchStatus
    );
  }
});
