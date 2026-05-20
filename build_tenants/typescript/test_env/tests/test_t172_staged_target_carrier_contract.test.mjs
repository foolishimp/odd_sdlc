// Validates: T-172
// Validates: REQ-F-ODDSDLC-080

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { materializeGraphFunction } from "@abiogenesis/typescript-tenant";

import {
  constructWorkerInvocationPackage,
  constructSdlcGtlModule,
  constructSdlcTargetCarrierRows,
  deriveWorkerHandoffManifest,
  evaluateWorkerResultPostflight,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  resolveSdlcEdgeGainClosureContract,
  sha256Text,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";

function makeWorkspace({ trivialProduct = false } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t172-staged-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(path.join(root, "README.md"), "# T-172 Fixture\n", "utf8");
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-T172: Prove staged construction contracts.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    "# Requirements\n\nREQ-T172-001: Materialization consumes admitted topology.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t172_fixture",
      "active_tenant: typescript",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript",
      "    language: typescript",
      "    build_tool: npm",
      ...(trivialProduct
        ? [
            "    capability_contracts:",
            "      trivial_product: true"
          ]
        : [])
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function targetCarrierRow(edgeRef) {
  const module = constructSdlcGtlModule();
  const vectors = module.graphFunctions.flatMap((graphFunction) =>
    materializeGraphFunction(graphFunction).vectors
  );
  const rows = constructSdlcTargetCarrierRows({
    vectors,
    contracts: [resolveSdlcEdgeGainClosureContract(edgeRef)]
  });
  const row = rows.find((candidate) => candidate.edgeRef === edgeRef);
  assert(row, edgeRef);
  return row;
}

function writeJsonFile(filePath, payload) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const content = `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(filePath, content, "utf8");
  return content;
}

function implementationDesignRegister(componentTopologyRows) {
  return {
    kind: "sdlc_design_depth_register",
    registerVersion: "ts-design-depth-v1",
    targetAssetType: "implementation_design_surface",
    stackProfileRows: [
      {
        kind: "sdlc_stack_profile_row",
        stackRef: "stack://node",
        language: "javascript",
        buildTool: "npm"
      }
    ],
    implementationModuleRows: [
      {
        kind: "sdlc_implementation_module_row",
        moduleName: "app",
        moduleRef: "module://app"
      }
    ],
    aggregateDomainModelRows: [],
    moduleSchemaFragments: [],
    moduleStateDiagramFragments: [],
    aggregateDomainModel: null,
    sunnyDaySequenceRows: [],
    aggregateSunnyDaySequence: null,
    componentTopologyRows,
    componentRealizationRows: [],
    fileTargetRows: [],
    designCompletenessVerdict: null
  };
}

function implementationDesignAdr(componentTopologyRows) {
  const fileTargets = [
    ...new Map(
      componentTopologyRows.map((row) => [
        row.relativePath,
        `| \`${row.relativePath}\` | source |`
      ])
    ).values()
  ];
  const lineageRows = componentTopologyRows.flatMap((row) =>
    row.requirementIds.map(
      (requirementId) =>
        `| ${requirementId} | ${row.componentId} | \`${row.relativePath}\` |`
    )
  );
  return [
    "# ADR-002 Implementation Design Surface",
    "",
    "## Decision",
    "",
    "The implementation uses the declared module and component boundaries.",
    "",
    "## Module Boundary",
    "",
    "- Module: `app`",
    "- Public boundary: `src/hello.js`",
    "- Component: `hello`",
    "",
    "## Product File Targets",
    "",
    "| Path | Role |",
    "| ---- | ---- |",
    ...fileTargets,
    "",
    "## Requirement Lineage",
    "",
    "| Requirement | Owning Component | Realization File |",
    "| ----------- | ---------------- | ---------------- |",
    ...lineageRows,
    ""
  ].join("\n");
}

function componentTopologyRow(overrides = {}) {
  return {
    kind: "sdlc_component_topology_row",
    componentId: "hello",
    moduleName: "app",
    relativePath: "src/hello.js",
    publicBoundary: "src/hello.js",
    concernRole: "other",
    requirementIds: ["REQ-T172-001"],
    sourceAssetRefs: ["asset://requirement/REQ-T172-001"],
    ...overrides
  };
}

function testDesignRegister(testcaseIds = ["TC-T172-001"]) {
  return {
    kind: "sdlc_test_design_register",
    registerVersion: "ts-test-design-v1",
    targetAssetType: "test_design_surface",
    designConsumptionRows: [
      {
        kind: "sdlc_design_consumption_contract",
        contractRef: "design-consumption://t172/test",
        sourceDesignObligationRefs: ["REQ-T172-001"],
        authorityBasisRefs: ["asset://implementation-design"],
        consumerGraphFunctionRefs: ["derive_component_test_surface"]
      }
    ],
    uatTestcaseRows: [
      {
        kind: "sdlc_test_case_row",
        testCaseRef: testcaseIds[0] ?? "TC-T172-001",
        caseKind: "uat",
        executionLane: "uat",
        sourceDesignObligationRefs: ["REQ-T172-001"],
        testcaseAuthorityRefs: ["REQ-T172-001"],
        expectedBehavior: "hello world is exact"
      }
    ],
    testcaseAuthorityRows: [
      {
        kind: "sdlc_test_case_row",
        testCaseRef: testcaseIds[0] ?? "TC-T172-001",
        caseKind: "positive",
        executionLane: "integration",
        sourceDesignObligationRefs: ["REQ-T172-001"],
        testcaseAuthorityRefs: ["REQ-T172-001"],
        expectedBehavior: "hello world is exact"
      }
    ],
    testStackProfileRows: [
      {
        kind: "sdlc_test_stack_profile_row",
        stackRef: "stack://node",
        frameworkRef: "framework://node-test",
        buildTool: "node"
      }
    ],
    testModuleRows: [
      {
        kind: "sdlc_test_module_row",
        moduleName: "app-tests",
        moduleRef: "module://app-tests",
        testRoot: "test"
      }
    ],
    testComponentTopologyRows: [
      {
        kind: "sdlc_test_component_topology_row",
        testClassId: "HelloWorldSpec",
        relativePath: "test/hello.test.js",
        testcaseIds,
        componentIds: ["hello"],
        requirementIds: ["REQ-T172-001"],
        shardId: "shard-hello"
      }
    ],
    testDataBindings: [
      {
        kind: "sdlc_test_data_binding",
        testDataRef: "test-data://t172/hello",
        testCaseRef: testcaseIds[0] ?? "TC-T172-001",
        inputFixtureRefs: ["fixture://t172/none"],
        generationPolicyRef: "generation-policy://t172/static",
        expectedResultRef: "expected://t172/hello",
        sourceDesignObligationRefs: ["REQ-T172-001"]
      }
    ],
    expectedResultBindings: [
      {
        kind: "sdlc_expected_result_binding",
        expectedResultRef: "expected://t172/hello",
        testCaseRef: testcaseIds[0] ?? "TC-T172-001",
        assertionRefs: ["assertion://t172/hello"],
        expectedResultSummary: "hello world is exact",
        verificationPolicyRef: "verification-policy://t172/hello"
      }
    ],
    uatIntegrationBindings: [
      {
        kind: "sdlc_uat_integration_binding",
        uatTestCaseRef: testcaseIds[0] ?? "TC-T172-001",
        integrationTestCaseRef: testcaseIds[0] ?? "TC-T172-001",
        executionLane: "integration"
      }
    ],
    testExecutionScheduleRows: [
      {
        kind: "sdlc_test_execution_schedule_row",
        scheduleRef: "schedule://t172/hello",
        testCaseRefs: testcaseIds,
        command: "node --test test/hello.test.js",
        frameworkRef: "framework://node-test",
        shardId: "shard-hello"
      }
    ]
  };
}

function manifestForEdge(workspaceRoot, edgeName, runId) {
  const contract = hookContractByEdgeName(edgeName);
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName: edgeName,
    edgeName: contract.edgeName,
    vectorIndex: 0,
    contract,
    runId
  });
}

function tenantSdlcSurfacePath(workspaceRoot, relativePath) {
  return path.join(workspaceRoot, "build_tenants/typescript", relativePath);
}

function materializedReport({ manifest, role, relativePath }) {
  mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
  const outputContent = `# ${manifest.targetAssetType}\n\nREQ-T172-001\n`;
  writeFileSync(manifest.outputFile, outputContent, "utf8");
  const productFile = path.join(
    manifest.productMaterialization.tenantRoot,
    relativePath
  );
  mkdirSync(path.dirname(productFile), { recursive: true });
  const requirementIds = manifest.traversalObligationContext.obligations
    .filter((obligation) => obligation.obligationKind === "requirement")
    .map((obligation) => obligation.obligationId);
  const productContent = [
    "// T-172 materialized product file",
    "REQ-T172-001",
    ...requirementIds
  ].join("\n");
  writeFileSync(productFile, `${productContent}\n`, "utf8");
  const productFileRef = `file://${productFile}`;
  return {
    kind: "odd_sdlc.worker_result_report",
    projectionRole: "typed_fp_stage_projection",
    authoritativeStageResultRef: "file:///tmp/t172/fp_evaluate_result.json",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile,
    digest: sha256Text(outputContent),
    summary: "T-172 staged materialization postflight fixture",
    unresolvedReasons: [],
    materializedFiles: [
      {
        kind: "sdlc_materialized_product_file",
        role,
        relativePath,
        absolutePath: productFile,
        digest: sha256Text(`${productContent}\n`),
        byteCount: Buffer.byteLength(`${productContent}\n`, "utf8"),
        requirementTraceObligationIds: requirementIds
      }
    ],
    materializationDiagnostics: [],
    executionEvidence: null,
    executionEvidenceErrors: [],
    obligationAssessments: manifest.traversalObligationContext.obligations.map(
      (obligation) => ({
        kind: "sdlc_worker_obligation_assessment",
        obligationId: obligation.obligationId,
        fulfillmentStatus: "fulfilled",
        evidenceRefs: [productFileRef],
        blockingReasons: []
      })
    ),
    fpTransformRequestRef: null,
    fpTransformResultRef: null,
    fpTransformStatusSnapshot: null,
    fpEvaluateResultRef: "file:///tmp/t172/fp_evaluate_result.json"
  };
}

function surfaceReport({ manifest, outputContent }) {
  return {
    kind: "odd_sdlc.worker_result_report",
    projectionRole: "typed_fp_stage_projection",
    authoritativeStageResultRef: "file:///tmp/t172/fp_evaluate_result.json",
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile,
    digest: sha256Text(outputContent),
    summary: "T-172 staged authority producer postflight fixture",
    unresolvedReasons: [],
    materializedFiles: [],
    materializationDiagnostics: [],
    executionEvidence: null,
    executionEvidenceErrors: [],
    obligationAssessments: manifest.traversalObligationContext.obligations.map(
      (obligation) => ({
        kind: "sdlc_worker_obligation_assessment",
        obligationId: obligation.obligationId,
        fulfillmentStatus: "fulfilled",
        evidenceRefs: [`file://${manifest.outputFile}`],
        blockingReasons: []
      })
    ),
    fpTransformRequestRef: null,
    fpTransformResultRef: null,
    fpTransformStatusSnapshot: null,
    fpEvaluateResultRef: "file:///tmp/t172/fp_evaluate_result.json"
  };
}

test("T-172 implementation-design carrier declares staged implementation authority output", () => {
  const row = targetCarrierRow("derive_implementation_design_surface");

  assert.equal(row.constructionDepthRole, "staged_authority_producer");
  assert.deepEqual(row.producedStagedAuthorityRefs, [
    "surface://implementation-decomposition-summary",
    "surface://module-dependency-map"
  ]);
  assert.deepEqual(row.requiredStagedAuthorityRefs, []);
});

test("T-172 component-code materialization requires admitted implementation topology authority", () => {
  const row = targetCarrierRow("derive_component_code_surface");

  assert.equal(row.constructionDepthRole, "staged_materialization_consumer");
  assert.deepEqual(row.producedStagedAuthorityRefs, []);
  assert.deepEqual(row.requiredStagedAuthorityRefs, [
    "surface://implementation-decomposition-summary",
    "surface://module-dependency-map"
  ]);
});

test("T-172 test-design carrier declares test topology and stack authority output", () => {
  const row = targetCarrierRow("derive_test_design_surface");

  assert.equal(row.constructionDepthRole, "staged_authority_producer");
  assert.deepEqual(row.producedStagedAuthorityRefs, [
    "surface://test-stack-profile",
    "surface://test-decomposition-summary",
    "surface://test-dependency-map"
  ]);
  assert.deepEqual(row.requiredStagedAuthorityRefs, []);
});

test("T-172 component-test materialization requires testcase, stack, and test topology authority", () => {
  const row = targetCarrierRow("derive_component_test_surface");

  assert.equal(row.constructionDepthRole, "staged_materialization_consumer");
  assert.deepEqual(row.producedStagedAuthorityRefs, []);
  assert.deepEqual(row.requiredStagedAuthorityRefs, [
    "surface://testcase-authority",
    "surface://test-stack-profile",
    "surface://test-decomposition-summary",
    "surface://test-dependency-map"
  ]);
});

test("T-172 projection rollups do not claim staged construction authority", () => {
  const row = targetCarrierRow("derive_code_surface");

  assert.equal(row.constructionDepthRole, "none");
  assert.deepEqual(row.producedStagedAuthorityRefs, []);
  assert.deepEqual(row.requiredStagedAuthorityRefs, []);
});

test("T-172 handoff projection carries staged authority refs into the worker package", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const contract = hookContractByEdgeName("derive_component_code_surface");
    const manifest = deriveWorkerHandoffManifest({
      workspaceRoot,
      graphFunctionName: "derive_component_code_surface",
      edgeName: contract.edgeName,
      vectorIndex: 0,
      contract,
      runId: "t172-staged-handoff"
    });
    const invocationPackage = constructWorkerInvocationPackage({ manifest });
    const outcomeDirectives = invocationPackage.outcomeDirectives.join("\n");

    assert.equal(
      manifest.targetCarrierProjection.constructionDepthRole,
      "staged_materialization_consumer"
    );
    assert.deepEqual(
      manifest.targetCarrierProjection.requiredStagedAuthorityRefs,
      [
        "surface://implementation-decomposition-summary",
        "surface://module-dependency-map"
      ]
    );
    assert.equal(
      invocationPackage.targetCarrierProjection.kind,
      "sdlc_worker_target_carrier_prompt_projection"
    );
    assert.equal(
      "constructionTemplate" in invocationPackage.targetCarrierProjection,
      false
    );
    assert.deepEqual(
      invocationPackage.targetCarrierProjection.requiredStagedAuthorityRefs,
      manifest.targetCarrierProjection.requiredStagedAuthorityRefs
    );
    assert.match(
      outcomeDirectives,
      /Required staged authority refs: surface:\/\/implementation-decomposition-summary, surface:\/\/module-dependency-map\./u
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 implementation-design prompt preserves proportional topology capacity", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const contract = hookContractByEdgeName("derive_implementation_design_surface");
    const manifest = deriveWorkerHandoffManifest({
      workspaceRoot,
      graphFunctionName: "derive_implementation_design_surface",
      edgeName: contract.edgeName,
      vectorIndex: 0,
      contract,
      runId: "t172-implementation-design-prompt"
    });
    const files = writeHandoffFiles(manifest);
    const prompt = readFileSync(files.promptPath, "utf8");

    assert.match(
      prompt,
      /The framework evaluator derives and publishes the design-depth register/u
    );
    assert.match(prompt, /no component should own more than 8 requirement refs/u);
    assert.match(prompt, /Product File Targets section/u);
    assert.match(prompt, /requirement-lineage table/u);
    assert.doesNotMatch(prompt, /Emit a fenced `json design_depth_register` carrier/u);
    assert.doesNotMatch(prompt, /componentTopologyRows\[\]/u);
    assert.doesNotMatch(prompt, /8 componentTopologyRows, 12 componentRealizationRows/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 trivial implementation-design prompt keeps single-file topology collapsed to one owned component", () => {
  const workspaceRoot = makeWorkspace({ trivialProduct: true });
  try {
    const contract = hookContractByEdgeName("derive_implementation_design_surface");
    const manifest = deriveWorkerHandoffManifest({
      workspaceRoot,
      graphFunctionName: "derive_implementation_design_surface",
      edgeName: contract.edgeName,
      vectorIndex: 0,
      contract,
      runId: "t172-trivial-implementation-design-prompt"
    });
    const files = writeHandoffFiles(manifest);
    const prompt = readFileSync(files.promptPath, "utf8");

    assert.match(prompt, /Trivial product profile is active/u);
    assert.match(prompt, /one implementation component topology row/u);
    assert.match(prompt, /Map build-config, source, runtime, and proof-subject requirement refs/u);
    assert.match(prompt, /One source file remains one component row/u);
    assert.doesNotMatch(prompt, /Emit a fenced `json design_depth_register` carrier/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 implementation-design producer derives topology from ADR instead of worker register", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_implementation_design_surface",
      "t172-implementation-design-derived-from-adr"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    const outputContent = implementationDesignAdr([
      componentTopologyRow({
        componentId: "hello",
        requirementIds: ["REQ-T172-001"]
      })
    ]);
    writeFileSync(
      manifest.outputFile,
      outputContent,
      "utf8"
    );
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(
      postflight.blockingReasonCarriers.some((reason) =>
        reason.code.startsWith("staged_")
      ),
      false,
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 implementation-design evaluator derives Rust tenant topology from generic ADR tables", () => {
  const workspaceRoot = makeWorkspace({ trivialProduct: true });
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_implementation_design_surface",
      "t172-rust-tenant-topology-derived-from-adr"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    const outputContent = [
      "# ADR-002 Implementation Design Surface",
      "",
      "## Decision",
      "",
      "The implementation uses a single Rust binary service.",
      "",
      "## Stack Profile",
      "",
      "| field | value |",
      "| ----- | ----- |",
      "| language | Rust |",
      "| build tool | cargo |",
      "",
      "## Module Boundary",
      "",
      "| module | public boundary | owns |",
      "| ------ | --------------- | ---- |",
      "| hello_world_rust_service | `cargo run` entry point; `GET /` responder | fixed response |",
      "",
      "## Component Topology",
      "",
      "| component | kind | depends on | exposes |",
      "| --------- | ---- | ---------- | ------- |",
      "| hello_world_rust_service | binary entry point | std::net | local HTTP socket |",
      "",
      "## Product File Targets",
      "",
      "| file_target_id | path | role | owning_component |",
      "| -------------- | ---- | ---- | ---------------- |",
      "| ft_cargo_manifest | build_tenants/hello_world_rust_service/Cargo.toml | build_config | cmp_hello_world_rust_service |",
      "| ft_main_rs | build_tenants/hello_world_rust_service/src/main.rs | source | cmp_hello_world_rust_service |",
      "",
      "## Requirement Lineage",
      "",
      "| requirement_id | obligation | owning_component | realization_locus |",
      "| -------------- | ---------- | ---------------- | ----------------- |",
      "| req_t164_rust_svc_001 | Cargo manifest exists | cmp_hello_world_rust_service | ft_cargo_manifest |",
      "| req_t164_rust_svc_002 | Rust source exists | cmp_hello_world_rust_service | ft_main_rs |",
      "| req_t164_rust_svc_003 | HTTP bind exists | cmp_hello_world_rust_service | ft_main_rs |",
      "| req_t164_rust_svc_005 | Live smoke proof | residual: test_design_surface / live HTTP smoke | cargo run + curl |",
      ""
    ].join("\n");
    writeFileSync(manifest.outputFile, outputContent, "utf8");
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });
    const derivedRegister = JSON.parse(
      readFileSync(
        path.join(manifest.archiveRoot, "design_depth_evaluator_derived_register.json"),
        "utf8"
      )
    );

    assert.equal(
      postflight.blockingReasonCarriers.some((reason) =>
        reason.code.startsWith("staged_")
      ),
      false,
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
    assert.deepEqual(
      derivedRegister.fileTargetRows.map((row) => row.relativePath),
      [
        "build_tenants/hello_world_rust_service/Cargo.toml",
        "build_tenants/hello_world_rust_service/src/main.rs"
      ]
    );
    assert.equal(
      derivedRegister.componentTopologyRows[0].componentId,
      "cmp_hello_world_rust_service"
    );
    assert.equal(
      derivedRegister.componentTopologyRows[0].moduleName,
      "hello_world_rust_service"
    );
    assert.deepEqual(derivedRegister.componentTopologyRows[0].requirementIds, [
      "req_t164_rust_svc_001",
      "req_t164_rust_svc_002",
      "req_t164_rust_svc_003",
      "req_t164_rust_svc_005"
    ]);
    assert.equal(
      derivedRegister.componentTopologyRows[0].relativePath,
      "build_tenants/hello_world_rust_service/src/main.rs"
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 implementation-design producer rejects worker-emitted design-depth register in ADR", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_implementation_design_surface",
      "t172-implementation-design-worker-register-rejected"
    );
    const outputContent = [
      "# ADR-002 Implementation Design Surface",
      "",
      "```json design_depth_register",
      JSON.stringify(
        implementationDesignRegister([
          componentTopologyRow({
            componentId: "hello",
            requirementIds: ["REQ-T172-001"]
          })
        ]),
        null,
        2
      ),
      "```",
      ""
    ].join("\n");
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    writeFileSync(manifest.outputFile, outputContent, "utf8");
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(postflight.status, "blocked");
    assert(
      postflight.blockingReasonCarriers.some(
        (reason) =>
          reason.code === "staged_decomposition_rejected" &&
          reason.detail.includes("design_depth_worker_emitted_register_forbidden")
      ),
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 implementation-design producer reports exact overloaded topology rows", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_implementation_design_surface",
      "t172-implementation-design-overloaded-row"
    );
    const outputContent = writeJsonFile(
      manifest.outputFile,
      implementationDesignRegister([
        componentTopologyRow({
          componentId: "compiler",
          publicBoundary: "src/compiler.js",
          sourceAssetRefs: ["asset://requirement/compiler"],
          requirementIds: Array.from(
            { length: 9 },
            (_, index) => `REQ-T172-${String(index + 1).padStart(3, "0")}`
          )
        })
      ])
    );
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });
    const reason = postflight.blockingReasonCarriers.find(
      (candidate) => candidate.code === "staged_decomposition_rejected"
    );

    assert.equal(postflight.status, "blocked");
    assert(reason, JSON.stringify(postflight.blockingReasonCarriers, null, 2));
    assert.match(reason.detail, /decomposition_high_density_downstream_rows/u);
    assert.match(reason.detail, /component:\/\/compiler/u);
    assert.match(reason.detail, /ownedUpstreamCount=9/u);
    assert.match(reason.detail, /maxOwnedUpstreamPerDownstream=8/u);
    assert.match(reason.detail, /REQ-T172-009/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 component-code postflight blocks without admitted implementation topology", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_component_code_surface",
      "t172-component-code-missing-staged-authority"
    );
    const report = materializedReport({
      manifest,
      role: "source",
      relativePath: "src/hello.js"
    });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(postflight.status, "blocked");
    assert(
      postflight.blockingReasonCarriers.some(
        (reason) =>
          reason.code === "staged_authority_missing" &&
          reason.detail === "implementation_design_surface"
      ),
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 component-code postflight rejects under-decomposed implementation topology", () => {
  const workspaceRoot = makeWorkspace();
  try {
    writeJsonFile(
      tenantSdlcSurfacePath(
        workspaceRoot,
        "design/adrs/ADR-002-implementation-design-surface.md"
      ),
      implementationDesignRegister([
        componentTopologyRow({
          componentId: "facade",
          publicBoundary: "src/facade.js",
          sourceAssetRefs: ["asset://requirement/facade"],
          requirementIds: Array.from(
            { length: 9 },
            (_, index) => `REQ-T172-${String(index + 1).padStart(3, "0")}`
          )
        })
      ])
    );
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_component_code_surface",
      "t172-component-code-rejected-staged-authority"
    );
    const report = materializedReport({
      manifest,
      role: "source",
      relativePath: "src/hello.js"
    });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(postflight.status, "blocked");
    const reason = postflight.blockingReasonCarriers.find(
      (candidate) => candidate.code === "staged_decomposition_rejected"
    );
    assert(reason, JSON.stringify(postflight.blockingReasonCarriers, null, 2));
    assert.match(reason.detail, /decomposition_high_density_downstream_rows/u);
    assert.match(reason.detail, /component:\/\/facade/u);
    assert.match(reason.detail, /ownedUpstreamCount=9/u);
    assert.match(reason.detail, /maxOwnedUpstreamPerDownstream=8/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 component-code postflight consumes admitted implementation topology", () => {
  const workspaceRoot = makeWorkspace();
  try {
    writeJsonFile(
      tenantSdlcSurfacePath(
        workspaceRoot,
        "design/adrs/ADR-002-implementation-design-surface.md"
      ),
      implementationDesignRegister([
        componentTopologyRow({
          componentId: "hello",
          requirementIds: ["REQ-T172-001"]
        })
      ])
    );
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_component_code_surface",
      "t172-component-code-admitted-staged-authority"
    );
    const report = materializedReport({
      manifest,
      role: "source",
      relativePath: "src/hello.js"
    });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(
      postflight.blockingReasonCarriers.some((reason) =>
        reason.code.startsWith("staged_")
      ),
      false,
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 trivial implementation-design producer rejects multi-component topology", () => {
  const workspaceRoot = makeWorkspace({ trivialProduct: true });
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_implementation_design_surface",
      "t172-trivial-implementation-design-rejected"
    );
    const outputContent = writeJsonFile(
      manifest.outputFile,
      implementationDesignRegister([
        componentTopologyRow({
          componentId: "hello",
          requirementIds: ["REQ-T172-001", "REQ-T172-002"]
        }),
        componentTopologyRow({
          componentId: "hello-proof",
          relativePath: "test/hello.test.js",
          requirementIds: ["REQ-T172-003"]
        })
      ])
    );
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(postflight.status, "blocked");
    assert(
      postflight.blockingReasonCarriers.some(
        (reason) =>
          reason.code === "staged_decomposition_rejected" &&
          reason.detail.includes("decomposition_trivial_product_not_single_component")
      ),
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 trivial implementation-design producer admits single-component topology with bounded requirements", () => {
  const workspaceRoot = makeWorkspace({ trivialProduct: true });
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_implementation_design_surface",
      "t172-trivial-implementation-design-admitted"
    );
    const outputContent = writeJsonFile(
      manifest.outputFile,
      implementationDesignRegister([
        componentTopologyRow({
          componentId: "hello",
          requirementIds: ["REQ-T172-001", "REQ-T172-002"]
        })
      ])
    );
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(
      postflight.blockingReasonCarriers.some((reason) =>
        reason.code.startsWith("staged_")
      ),
      false,
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 trivial test-design producer rejects non-degenerate topology", () => {
  const workspaceRoot = makeWorkspace({ trivialProduct: true });
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_test_design_surface",
      "t172-trivial-test-design-rejected"
    );
    const nonDegenerateRegister = testDesignRegister(["TC-T172-001"]);
    const outputContent = writeJsonFile(
      manifest.outputFile,
      {
        ...nonDegenerateRegister,
        testComponentTopologyRows: [
          ...nonDegenerateRegister.testComponentTopologyRows,
          {
            ...nonDegenerateRegister.testComponentTopologyRows[0],
            testClassId: "HelloWorldCliSpec",
            relativePath: "test/hello-cli.test.js"
          }
        ]
      }
    );
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(postflight.status, "blocked");
    assert(
      postflight.blockingReasonCarriers.some(
        (reason) =>
          reason.code === "staged_decomposition_rejected" &&
          reason.detail.includes("decomposition_trivial_product_not_single_component")
      ),
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 trivial test-design producer admits UAT/integration dual-hop over one requirement", () => {
  const workspaceRoot = makeWorkspace({ trivialProduct: true });
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_test_design_surface",
      "t172-trivial-test-design-dual-hop-admitted"
    );
    const outputContent = writeJsonFile(
      manifest.outputFile,
      testDesignRegister(["TC-T172-UAT", "TC-T172-INTEGRATION"])
    );
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(
      postflight.blockingReasonCarriers.some((reason) =>
        reason.code.startsWith("staged_")
      ),
      false,
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 trivial test-design producer admits explicit single-row topology", () => {
  const workspaceRoot = makeWorkspace({ trivialProduct: true });
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_test_design_surface",
      "t172-trivial-test-design-admitted"
    );
    const outputContent = writeJsonFile(
      manifest.outputFile,
      testDesignRegister(["TC-T172-001"])
    );
    const report = surfaceReport({ manifest, outputContent });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(
      postflight.blockingReasonCarriers.some((reason) =>
        reason.code.startsWith("staged_")
      ),
      false,
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-172 component-test postflight blocks without admitted test topology", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge(
      workspaceRoot,
      "derive_component_test_surface",
      "t172-component-test-missing-staged-authority"
    );
    const report = materializedReport({
      manifest,
      role: "test",
      relativePath: "tests/hello.test.js"
    });

    const postflight = evaluateWorkerResultPostflight({ manifest, report });

    assert.equal(postflight.status, "blocked");
    assert(
      postflight.blockingReasonCarriers.some(
        (reason) =>
          reason.code === "staged_authority_missing" &&
          reason.detail === "test_design_surface"
      ),
      JSON.stringify(postflight.blockingReasonCarriers, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
