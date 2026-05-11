// Validates: T-151

import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { dirname } from "node:path";

import {
  admitSdlcProjectConstraints,
  constructSdlcGtlModule,
  deriveSdlcConformProjectProfileFromWorkspace,
  deriveSdlcWorkspaceIngressReport,
  executeInstalledOperatorStartWithReentry,
  materializeSdlcProjectConformance,
  projectSdlcQueryDomain,
  projectSdlcWorkerAttachment,
  publicStartOnce
} from "../../build/semantic/code/src/index.js";

function sha256Text(text) {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t151-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    ["# T-151 Fixture", "", "Build a governed Scala product realization."].join("\n"),
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
      "REQ-T151-001: Runner first-traversal returns admitted non-close truth."
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t151_runner_sovereignty",
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
      projectSlug: "t151",
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
    obligationId: `t151-preclosed-${index}`,
    publishedLedgerRef: `proof://t151/preclosed/${index}`,
    actor: "test",
    specHash: `sha256:t151preclosed${index}`,
    manifestId: `manifest:t151:preclosed:${index}`,
    workflowVersion: "t151-preclosed",
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
  const workerPath = path.join(workspaceRoot, "t151_unassessed_obligation_worker.mjs");
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

test("T-151 first_traversal returns the first admitted non-close consequence", async () => {
  const workspace = makeWorkspace();
  const start = makeStart(workspace);
  const basis = start.executionContract.basis;
  const workerScript = writeUnassessedObligationWorkerScript(workspace);
  let refreshCalls = 0;

  const outcome = await executeInstalledOperatorStartWithReentry({
    workspaceRoot: workspace,
    start,
    workerTransport: `process://node?script=${encodeURIComponent(workerScript)}`,
    replayEvents: preclosedEventsBeforeEdge(basis, "derive_component_code_surface"),
    requestedUntil: "first_traversal",
    refreshReplayState: async () => {
      refreshCalls += 1;
      throw new Error("first_traversal must return before runner re-entry");
    }
  });

  assert.equal(refreshCalls, 0);
  assert.equal("loop" in outcome, false);
  assert.equal(outcome.status, "postflight_failed");
  assert.equal(outcome.summary.currentEdge, "derive_component_code_surface");
  assert.equal(outcome.postflight.status, "blocked");
  assert(
    outcome.postflight.blockingReasons.some((reason) =>
      reason.startsWith("obligation_unassessed:")
    )
  );
  assert(outcome.traversalConsequence);
  assert.equal(outcome.traversalConsequence.edgeClosureDecision.disposition, "retry");
  assert.equal(
    outcome.traversalConsequence.nextActionProjection.choosesNextTraversal,
    true
  );
  assert.equal(
    outcome.summary.nextLawfulAction,
    outcome.traversalConsequence.nextActionProjection.selectedActionRef
  );
  assert.equal(
    outcome.traversalConsequence.nextActionProjection.predecessorRefs.includes(
      outcome.traversalConsequence.edgeClosureDecision.decisionRef
    ),
    true
  );
  assert.equal(
    existsSync(path.join(outcome.archiveRoot, "sdlc_edge_closure_decision.json")),
    true
  );
  assert.equal(
    existsSync(path.join(outcome.archiveRoot, "sdlc_next_action_projection.json")),
    true
  );
});

test("T-151 installed runner source does not gate first_traversal on worker_invoked", () => {
  const source = readFileSync(
    new URL("../../code/src/operator/installed_operator.ts", import.meta.url),
    "utf8"
  );

  assert.equal(source.includes('latest.status === "worker_invoked"'), false);
  assert.equal(source.includes("latest.traversalConsequence !== null"), true);
  assert.equal(source.includes("completedDispatchState.nextLawfulAction"), false);
  assert.equal(source.includes("nextLawfulActions.includes"), false);
});
