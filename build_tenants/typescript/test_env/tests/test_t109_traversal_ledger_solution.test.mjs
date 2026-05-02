// Validates: REQ-F-ODDSDLC-055
// Validates: T-109

import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  appendProjectConstructionLedgerEntrySync,
  buildPostTransformWorkerResultReport,
  classifyRetry,
  constructEdgeFulfillmentLedger,
  deriveWorkerHandoffManifest,
  edgeConverged,
  evaluateWorkerResultPostflight,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  projectConstructionLedger,
  selectCurrentEdgeLedger,
  sha256Text,
  snapshotProductMaterializationRoot
} from "../../build/semantic/code/src/index.js";

const TEST35_LEDGER_ROOT =
  "/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_ledgers";

function writeConstraints(root) {
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t109_ledger_solution",
      "active_tenant: typescript",
      "selected_output_root: build_tenants/typescript",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript",
      "    language: TypeScript",
      "    build_tool: npm",
      "    module_structure:",
      "      - ledger-core"
    ].join("\n"),
    "utf8"
  );
}

function workspaceWithRequirement() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t109-"));
  mkdirSync(path.join(root, "specification/requirements"), { recursive: true });
  writeConstraints(root);
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nConstruct deterministic traversal ledger truth.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/PRODUCT.md"),
    "# Product\n\nT-109 ledger fixture.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/GOALS.md"),
    "# Goals\n\n- prove closure through edge ledger predicates\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/requirements/01-ledger.md"),
    [
      "# Ledger Requirements",
      "",
      "REQ-T109-001: Close an edge only when all ledger convergence predicates pass."
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function manifestFor(workspaceRoot) {
  const contract = hookContractByEdgeName("derive_intent_surface");
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: "bootstrap_release_self_test",
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId: "t109-ledger-solution"
  });
}

function writeOutput(manifest) {
  const content = [
    "# Intent Surface",
    "",
    "The material output represents the active ledger requirement without relying on lexical IDs.",
    ""
  ].join("\n");
  mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
  writeFileSync(manifest.outputFile, content, "utf8");
  return sha256Text(content);
}

function closeSatisfaction() {
  return {
    kind: "sdlc_traversal_requirement_satisfaction",
    status: "close_allowed",
    ledgers: [],
    missingRequiredDimensions: [],
    blockingReasons: [],
    repriceReasons: [],
    gapReasons: [],
    satisfiedDimensions: ["materialization", "semantic_convergence"],
    notApplicableDimensions: [],
    retryHandoff: {
      kind: "sdlc_traversal_retry_handoff",
      obligationRefs: [],
      reasonCodes: [],
      evidenceRefs: []
    }
  };
}

function blockedSatisfaction(reasonCode) {
  return {
    ...closeSatisfaction(),
    status: "retry_same_edge",
    gapReasons: [
      {
        kind: "sdlc_assurance_ledger_reason",
        code: reasonCode,
        message: reasonCode,
        evidenceRefs: [],
        lawfulReentryPoint: "same_edge_retry"
      }
    ],
    retryHandoff: {
      kind: "sdlc_traversal_retry_handoff",
      obligationRefs: [],
      reasonCodes: [reasonCode],
      evidenceRefs: []
    }
  };
}

function reportFor(manifest) {
  const digest = writeOutput(manifest);
  return {
    kind: "odd_sdlc.worker_result_report",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile,
    digest,
    summary: "Generated ledger fixture.",
    unresolvedReasons: [],
    materializedFiles: [],
    executionEvidence: null,
    executionEvidenceErrors: [],
    obligationAssessments: manifest.traversalObligationContext.obligations.map(
      (obligation) => ({
        kind: "sdlc_worker_obligation_assessment",
        obligationId: obligation.obligationId,
        fulfillmentStatus: "fulfilled",
        evidenceRefs: [manifest.outputFile],
        blockingReasons: []
      })
    )
  };
}

function passedPostflight(manifest, report) {
  const postflight = evaluateWorkerResultPostflight({ manifest, report });
  assert.equal(postflight.status, "passed");
  return postflight;
}

function ledgerFor(manifest, report, options = {}) {
  const result = constructEdgeFulfillmentLedger({
    manifest,
    report,
    postflight: passedPostflight(manifest, report),
    assuranceSatisfaction: options.satisfaction ?? closeSatisfaction(),
    supersedesRefs: options.supersedesRefs ?? [],
    targetCertificationPassed: options.targetCertificationPassed ?? true,
    fdRecheckPassed: options.fdRecheckPassed ?? true,
    workKey: "bootstrap_release_self_test/derive_intent_surface/0/intent_surface",
    specHash: manifest.traversalIntentPackage.packageDigest,
    runId: "run",
    callId: "call"
  });
  assert.equal(result.kind, "ok");
  return result.value;
}

function constructionEntry(sequence, manifest, ledger, payloadRefs = [ledger.ledgerId]) {
  return {
    kind: "sdlc_project_construction_ledger_entry",
    entryKind: "edge_fulfillment_ledger_admitted",
    entryId: `entry:${sequence}`,
    sequence,
    eventTime: `2026-05-02T00:00:0${sequence}.000Z`,
    entryDigest: `sha256:entry-${sequence}`,
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    vectorIndex: manifest.vectorIndex,
    targetAssetType: manifest.targetAssetType,
    workKey: "bootstrap_release_self_test/derive_intent_surface/0/intent_surface",
    specHash: manifest.traversalIntentPackage.packageDigest,
    runId: "run",
    callId: "call",
    actorRef: null,
    processRef: null,
    parentEntryRefs: [],
    basisRefs: [],
    payloadRefs,
    reasonCodes: [],
    supersedesRefs: []
  };
}

function readTest35Ledger(fileName) {
  return JSON.parse(readFileSync(path.join(TEST35_LEDGER_ROOT, fileName), "utf8"));
}

test("T-109 edge convergence is the complete five-term predicate", () => {
  const base = {
    carryConverged: true,
    fulfillmentConverged: true,
    admitted: true,
    targetCertificationPassed: true,
    fdRecheckPassed: true
  };
  assert.equal(edgeConverged(base), true);
  for (const key of Object.keys(base)) {
    assert.equal(edgeConverged({ ...base, [key]: false }), false, key);
  }
});

test("T-109 retry eligibility is typed and allowlisted", () => {
  assert.equal(
    classifyRetry({
      failureClass: "transport_failure",
      retryBudgetRemaining: true,
      semanticGapPreserved: true
    }).kind,
    "retry_same_edge"
  );
  assert.equal(
    classifyRetry({
      failureClass: "silent_worker_inactivity",
      retryBudgetRemaining: false,
      semanticGapPreserved: true
    }).kind,
    "retry_exhausted"
  );
  assert.equal(
    classifyRetry({
      failureClass: "proof_failure",
      retryBudgetRemaining: true,
      semanticGapPreserved: true
    }).kind,
    "blocked"
  );
});

test("T-109 generated post-transform reports observe requirements materially, not lexically", () => {
  const manifest = manifestFor(workspaceWithRequirement());
  const before = snapshotProductMaterializationRoot(manifest.productMaterialization);
  writeOutput(manifest);
  assert.equal(
    readFileSync(manifest.outputFile, "utf8").includes("REQ-T109-001"),
    false
  );

  const report = buildPostTransformWorkerResultReport({ manifest, before });
  const requirementAssessments = report.obligationAssessments.filter((assessment) =>
    assessment.obligationId.startsWith("requirement:")
  );
  assert(requirementAssessments.length > 0);
  assert(
    requirementAssessments.every(
      (assessment) => assessment.fulfillmentStatus === "fulfilled"
    )
  );
  assert.equal(
    evaluateWorkerResultPostflight({ manifest, report }).status,
    "passed"
  );
});

test("T-109 edge ledger carries closure decision instead of assurance side closure", () => {
  const manifest = manifestFor(workspaceWithRequirement());
  const report = reportFor(manifest);
  const closed = ledgerFor(manifest, report);
  assert.equal(closed.edgeConverged, true);
  assert.equal(closed.lawfulNextAction, "close_allowed");

  const fdBlocked = ledgerFor(manifest, report, {
    satisfaction: blockedSatisfaction("semantic_gap:open_obligation"),
    fdRecheckPassed: false
  });
  assert.equal(fdBlocked.edgeConverged, false);
  assert.equal(fdBlocked.carryConverged, true);
  assert.equal(fdBlocked.fulfillmentConverged, true);
  assert.equal(fdBlocked.admitted, true);
  assert.equal(fdBlocked.lawfulNextAction, "retry_same_edge");
});

test("T-109 project ledger projection selects latest admitted ledger and fails conflicting supersession", () => {
  const manifest = manifestFor(workspaceWithRequirement());
  const report = reportFor(manifest);
  const first = ledgerFor(manifest, report);
  const conflicting = ledgerFor(manifest, report, {
    supersedesRefs: ["edge-ledger:wrong"]
  });
  const admitted = projectConstructionLedger({
    workspaceRoot: manifest.workspaceRoot,
    entries: [
      constructionEntry(1, manifest, first),
      constructionEntry(2, manifest, conflicting)
    ]
  });
  assert.equal(admitted.kind, "ok");
  const conflict = selectCurrentEdgeLedger({
    constructionLedger: admitted.value,
    edgeLedgers: [first, conflicting],
    slice: {
      edgeName: manifest.edgeName,
      workKey: "bootstrap_release_self_test/derive_intent_surface/0/intent_surface",
      specHash: manifest.traversalIntentPackage.packageDigest,
      runId: "run",
      callId: "call"
    }
  });
  assert.equal(conflict.kind, "contradictory_events");

  const second = ledgerFor(manifest, report, {
    supersedesRefs: [first.ledgerId]
  });
  const projected = projectConstructionLedger({
    workspaceRoot: manifest.workspaceRoot,
    entries: [
      constructionEntry(1, manifest, first),
      constructionEntry(2, manifest, second)
    ]
  });
  assert.equal(projected.kind, "ok");
  const selected = selectCurrentEdgeLedger({
    constructionLedger: projected.value,
    edgeLedgers: [first, second],
    slice: {
      edgeName: manifest.edgeName,
      workKey: "bootstrap_release_self_test/derive_intent_surface/0/intent_surface",
      specHash: manifest.traversalIntentPackage.packageDigest,
      runId: "run",
      callId: "call"
    }
  });
  assert.equal(selected.kind, "ok");
  assert.equal(selected.value.ledgerId, second.ledgerId);
});

test("T-109 project construction ledger append is parent-linked by default", () => {
  const workspace = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t109-ledger-"));
  const first = appendProjectConstructionLedgerEntrySync({
    workspaceRoot: workspace,
    entry: {
      entryKind: "manifest_created",
      graphFunctionName: "bootstrap_release_self_test",
      edgeName: "derive_intent_surface",
      vectorIndex: 0,
      targetAssetType: "intent_surface",
      payloadRefs: ["file://first"]
    }
  });
  const second = appendProjectConstructionLedgerEntrySync({
    workspaceRoot: workspace,
    entry: {
      entryKind: "output_observed",
      graphFunctionName: "bootstrap_release_self_test",
      edgeName: "derive_intent_surface",
      vectorIndex: 0,
      targetAssetType: "intent_surface",
      payloadRefs: ["file://second"]
    }
  });

  assert.deepEqual(first.parentEntryRefs, []);
  assert.deepEqual(second.parentEntryRefs, [first.entryId]);
});

test(
  "T-109 characterizes selected test35 fulfillment ledgers as discovery fixtures",
  { skip: existsSync(TEST35_LEDGER_ROOT) ? false : "test35 fixture workspace not present" },
  () => {
    const implementationClosed = readTest35Ledger(
      "derive_implementation_design_surface_20260419T103335367453Z.json"
    );
    assert.equal(implementationClosed.edge, "derive_implementation_design_surface");
    assert.equal(implementationClosed.expected_count, 77);
    assert.equal(implementationClosed.fulfilled_count, 77);
    assert.equal(implementationClosed.edge_converged, true);

    const implementationBlocked = readTest35Ledger(
      "derive_implementation_design_surface_20260419T180828511506Z.json"
    );
    assert.equal(implementationBlocked.expected_count, 81);
    assert.equal(implementationBlocked.fulfilled_count, 80);
    assert.equal(implementationBlocked.edge_converged, false);
    assert.deepEqual(implementationBlocked.blocking_reasons, [
      "dbt_build_artifacts_not_present"
    ]);

    for (const [fileName, edge, expectedCount] of [
      ["derive_code_surface_20260419T121644750776Z.json", "derive_code_surface", 77],
      [
        "derive_test_run_archive_surface_20260419T130433671620Z.json",
        "derive_test_run_archive_surface",
        77
      ],
      ["prepare_release_surface_20260418T223618220160Z.json", "prepare_release_surface", 71]
    ]) {
      const ledger = readTest35Ledger(fileName);
      assert.equal(ledger.edge, edge);
      assert.equal(ledger.expected_count, expectedCount);
      assert.equal(ledger.fulfilled_count, expectedCount);
      assert.equal(ledger.edge_converged, true);
      assert.deepEqual(ledger.blocking_reasons, []);
    }
  }
);
