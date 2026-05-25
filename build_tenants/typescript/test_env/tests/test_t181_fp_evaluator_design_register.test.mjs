// Validates: T-181

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
import { pathToFileURL } from "node:url";

import {
  designDepthFpEvaluatorContentLedgerPath,
  admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity,
  constructSdlcFpEvaluateResult,
  constructWorkerConstructionBrief,
  constructWorkerInvocationPackage,
  deriveWorkerHandoffManifest,
  deriveSdlcOperatorAssuranceGate,
  evaluateSdlcComputeStage,
  hookContractByEdgeName,
  materializeSdlcProjectConformance,
  promptForHandoff,
  SDLC_FUNCTION_CATALOG,
  SDLC_OPERATOR_RUN_ARTIFACT_CATALOG,
  sha256Text,
  selectSdlcWorkCategoryGovernance,
  writeHandoffFiles
} from "../../build/semantic/code/src/index.js";
import {
  admitImplementationDesignRegisterCandidateForManifest,
  admitImplementationDesignRegisterForManifest,
  designDepthFpEvaluatorRegisterPath
} from "../../build/semantic/code/src/operator/plugins/evaluate/design_depth_register.js";
import { readOperatorRunCarriers } from "../../build/semantic/code/src/analysis/carrier_loaders.js";

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

test("T-183 ticket is the admitted deletion-first implementation migration contract", () => {
  const ticket = readRepoFile(
    ".ai-workspace/tickets/completed/T-183-delete-fd-semantic-registers-and-restore-bare-admission.md"
  );

  assert.match(ticket, /ticket_category: implementation_migration/u);
  assert.match(ticket, /change_intent:/u);
  assert.match(ticket, /triaged_at: \d{4}-\d{2}-\d{2}/u);
  assert.match(ticket, /migration_strategy:/u);
  assert.match(ticket, /target_truth:/u);
  assert.match(ticket, /superseded_truth:/u);
  assert.match(ticket, /closure_law:/u);
  assert.match(ticket, /evaluation_criteria:/u);
  assert.match(ticket, /non_closure_conditions:/u);
  assert.match(ticket, /proof_surface:/u);
  assert.match(ticket, /## Design Module Method Refactor Ledger/u);
  assert.match(ticket, /single authoritative truth surface/u);
  assert.match(ticket, /R-010/u);
  assert.match(ticket, /R-030/u);
  assert.match(ticket, /R-040/u);
  assert.match(ticket, /no compatibility bridge for default live execution/u);
});

test("T-181 design module declares evaluator register IACS carrier truth", () => {
  const design = readRepoFile(
    "build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md"
  );

  assert.match(design, /#### Design-Depth Evaluator Register Rule/u);
  assert.match(design, /SdlcDesignDepthRegister/u);
  assert.match(design, /design_depth_fp_evaluator_register\.json/u);
  assert.match(design, /SdlcEvaluatePluginAdapter/u);
  assert.match(design, /requireSourceFileTargets=true/u);
  assert.match(design, /System owner: ABG owns/u);
  assert.match(design, /Product owner: ODD_SDLC owns/u);
  assert.match(design, /Bridge: none in default live execution/u);
  assert.match(design, /do not synthesize semantic\s+design-depth truth for closure/u);
  assert.match(design, /not a final ledger write/u);
  assert.match(design, /not closure authority/u);
  assert.match(design, /flowchart TD/u);
  assert.match(design, /Source-text\s+guards may remain as drift detection/u);
});

test("T-181 common config carries one compressed governance doc per work category", () => {
  const categories = [
    "requirements_build",
    "design_build",
    "coding_build",
    "uat_test_case_build",
    "unit_test_build"
  ];
  for (const category of categories) {
    const doc = readRepoFile(
      `build_tenants/typescript/config/work-category-governance/${category}.md`
    );
    assert.match(doc, /Spec method constraints:/u);
    assert.match(doc, /Design module method constraints:/u);
    assert.match(doc, /Agentic work policy:/u);
    assert.match(doc, /one truth/u);
    assert.match(doc, /Stdout is work trace only/u);
    assert.match(doc, /Keep tool IO bounded/u);
    assert.match(doc, /targeted edits rather than whole-file replacement/u);
  }
  for (const entry of SDLC_FUNCTION_CATALOG) {
    assert.ok(
      categories.includes(entry.workCategoryGovernanceCategory),
      `${entry.name} has work-category governance`
    );
  }
  assert.deepEqual(
    selectSdlcWorkCategoryGovernance({
      edgeName: "derive_requirement_surface",
      targetAssetType: "requirement_surface"
    }),
    {
      kind: "sdlc_work_category_governance_selection",
      category: "requirements_build",
      configRef:
        "config://odd-sdlc/work-category-governance/requirements_build/v1",
      workerPath:
        "node_modules/@odd-sdlc/typescript-tenant/config/work-category-governance/requirements_build.md",
      selectionSource: "graph_function_catalog",
      edgeName: "derive_requirement_surface",
      targetAssetType: "requirement_surface"
    }
  );
  assert.equal(
    selectSdlcWorkCategoryGovernance({
      edgeName: "derive_component_code_surface",
      targetAssetType: "component_code_surface"
    }).category,
    "coding_build"
  );
});

test("T-181 worker prompts prevent whole-file Write drift in live PTY execution", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForEdge({
      workspaceRoot,
      runId: "20260523T000000006Z_pid18107",
      graphFunctionName: "derive_requirement_surface",
      edgeName: "derive_requirement_surface"
    });
    const prompt = promptForHandoff(manifest);

    assert.match(prompt, /Keep tool IO bounded/u);
    assert.match(prompt, /large authority files/u);
    assert.match(prompt, /targeted read ranges/u);
    assert.match(prompt, /do not use the Claude Write tool for whole-file replacement/u);
    assert.match(prompt, /targeted Edit operations/u);
    assert.doesNotMatch(prompt, /make the file-write operation the next worker action/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

function makeWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t181-fp-eval-"));
  mkdirSync(path.join(root, "specification"), { recursive: true });
  mkdirSync(path.join(root, ".ai-workspace/context"), { recursive: true });
  writeFileSync(path.join(root, "README.md"), "# T-181 Fixture\n", "utf8");
  writeFileSync(
    path.join(root, "specification/INTENT.md"),
    "# Intent\n\nINT-T181: Prove F_P evaluator populated registers.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, "specification/REQUIREMENTS.md"),
    "# Requirements\n\nREQ-T181-001: Populate design-depth register in evaluate.C/F_P.\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".ai-workspace/context/project_constraints.yml"),
    [
      "project:",
      "  name: t181_fixture",
      "active_tenant: typescript",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript",
      "    language: typescript",
      "    build_tool: npm"
    ].join("\n"),
    "utf8"
  );
  materializeSdlcProjectConformance({ workspaceRoot: root });
  return root;
}

function manifestForImplementationDesign(workspaceRoot, runId) {
  return manifestForEdge({
    workspaceRoot,
    runId,
    graphFunctionName: "derive_implementation_design_surface",
    edgeName: "derive_implementation_design_surface"
  });
}

function manifestForEdge({
  workspaceRoot,
  runId,
  graphFunctionName,
  edgeName,
  retryContext = undefined
}) {
  const contract = hookContractByEdgeName("derive_implementation_design_surface");
  const selectedContract =
    edgeName === "derive_implementation_design_surface"
      ? contract
      : hookContractByEdgeName(edgeName);
  return deriveWorkerHandoffManifest({
    workspaceRoot,
    graphFunctionName,
    edgeName: selectedContract.edgeName,
    vectorIndex: 0,
    contract: selectedContract,
    runId,
    retryContext
  });
}

function implementationDesignAdr(componentId) {
  return [
    "# ADR-002 Implementation Design Surface",
    "",
    "## Module Boundary",
    "",
    "| module | component | path | public boundary |",
    "|---|---|---|---|",
    `| app | ${componentId} | src/${componentId}.js | Emits fixture output |`,
    "",
    "## Product File Targets",
    "",
    "| role | file | expected behavior |",
    "|---|---|---|",
    `| source | src/${componentId}.js | generated source |`,
    "",
    "## Requirement Lineage",
    "",
    "| requirement id | component | source file |",
    "|---|---|---|",
    `| REQ-T181-001 | ${componentId} | src/${componentId}.js |`,
    ""
  ].join("\n");
}

function implementationDesignRegister(componentId, evidenceRef) {
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
    componentTopologyRows: [
      {
        kind: "sdlc_component_topology_row",
        componentId,
        moduleName: "app",
        relativePath: `src/${componentId}.js`,
        publicBoundary: "Emits fixture output",
        concernRole: "other",
        requirementIds: ["REQ-T181-001"],
        sourceAssetRefs: [evidenceRef]
      }
    ],
    componentRealizationRows: [
      {
        kind: "sdlc_component_realization_row",
        componentId,
        moduleName: "app",
        relativePath: `src/${componentId}.js`,
        publicBoundary: "Emits fixture output",
        trancheId: null,
        firstProductFileToChange: `src/${componentId}.js`,
        upstreamComponentIds: [],
        requirementIds: ["REQ-T181-001"],
        sourceAssetRefs: [evidenceRef]
      }
    ],
    fileTargetRows: [
      {
        kind: "sdlc_file_target_row",
        relativePath: `src/${componentId}.js`,
        role: "source"
      }
    ],
    designCompletenessVerdict: null
  };
}

function surfaceReport({ manifest, content }) {
  return {
    kind: "odd_sdlc.worker_result_report",
    projectionRole: "typed_fp_stage_projection",
    authoritativeStageResultRef: pathToFileURL(
      path.join(manifest.archiveRoot, "fp_evaluate_result.json")
    ).href,
    graphFunctionName: manifest.graphFunctionName,
    edgeName: manifest.edgeName,
    targetAssetType: manifest.targetAssetType,
    outputFile: manifest.outputFile,
    digest: sha256Text(content),
    summary: "fixture",
    unresolvedReasons: [],
    materializedFiles: [],
    materializationDiagnostics: [],
    executionEvidence: null,
    executionEvidenceErrors: [],
    obligationAssessments: []
  };
}

function writePriorWorkerResultReport({ manifest, content }) {
  const report = surfaceReport({ manifest, content });
  writeFileSync(
    path.join(manifest.archiveRoot, "worker_result_report.json"),
    `${JSON.stringify(
      {
        ...report,
        fpTransformRequestRef: null,
        fpTransformResultRef: null,
        fpTransformStatusSnapshot: null,
        fpEvaluateResultRef: pathToFileURL(
          path.join(manifest.archiveRoot, "fp_evaluate_result.json")
        ).href
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

function selectedComposition() {
  return {
    kind: "sdlc_selected_abg_fn_composition_identity",
    compositionRef: "abg.fn_composition://t181/selected",
    compositionDigest: "digest://t181/selected",
    compositionSelectionRef: "abg.fn_composition_selection://t181/selected",
    selectedRegimeBindingRef: "abg.fn_composition.regime_binding://t181/evaluate/fp",
    graphFunctionRef: "Fg_t181",
    graphVectorRef: "derive_implementation_design_surface",
    basisRef: "basis://t181"
  };
}

function writeDesignDepthFpEvaluatorRuleOutcomeProof({ manifest, registerPath }) {
  const composition = selectedComposition();
  const registerRef = pathToFileURL(registerPath).href;
  const contentLedgerRef = pathToFileURL(
    designDepthFpEvaluatorContentLedgerPath({ archiveRoot: manifest.archiveRoot })
  ).href;
  const proofPath = path.join(
    manifest.archiveRoot,
    "design_depth_fp_evaluator_rule_outcome.json"
  );
  writeFileSync(
    proofPath,
    `${JSON.stringify(
      {
        kind: "evaluation_rule_outcome",
        status: "accepted",
        ruleRef: "evaluation-rule://odd-sdlc/design-depth-register/fp",
        ruleRole: "semantic_judgment",
        computeMeans: "F_P",
        producedRegisterRefs: [contentLedgerRef, registerRef],
        evidenceRefs: [contentLedgerRef, registerRef],
        findingRefs: [
          `finding://odd-sdlc/${manifest.runId}/evaluate/design-depth-register`
        ],
        humanResponseRefs: [],
        residualPressureRefs: [],
        continuationRefs: [],
        diagnosticRefs: [],
        selectedCompositionRef: composition.compositionRef,
        selectedCompositionDigest: composition.compositionDigest,
        selectedCompositionSelectionRef: composition.compositionSelectionRef,
        selectedRegimeBindingRef: composition.selectedRegimeBindingRef,
        compositionContributionRef: composition.selectedRegimeBindingRef,
        reason: null
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  return pathToFileURL(proofPath).href;
}

function fpEvaluateResultPayloadForRegister(registerPath, options = {}) {
  const composition = selectedComposition();
  const scalarSelectedRegimeBindingRef =
    options.selectedRegimeBindingRef ?? composition.selectedRegimeBindingRef;
  const scalarComposition = {
    ...composition,
    selectedRegimeBindingRef: scalarSelectedRegimeBindingRef
  };
  const registerRef = pathToFileURL(registerPath).href;
  const contentLedgerRef = pathToFileURL(
    path.join(path.dirname(registerPath), "design_depth_fp_evaluator_content_ledger.json")
  ).href;
  const ruleOutcomeRef = pathToFileURL(
    path.join(path.dirname(registerPath), "design_depth_fp_evaluator_rule_outcome.json")
  ).href;
  return {
    kind: "sdlc_fp_evaluate_result",
    stage: "F_P.evaluate",
    computeNotationStage: "evaluate.C",
    stageAuthority: "typed_fp_stage_carriers",
    selectedComposition: scalarComposition,
    compositionRef: composition.compositionRef,
    compositionDigest: composition.compositionDigest,
    compositionSelectionRef: composition.compositionSelectionRef,
    selectedRegimeBindingRef: scalarSelectedRegimeBindingRef,
    evaluationRef: "evaluation://t181/fp",
    findings: [
      {
        findingRef: "finding://t181/evaluate/design-depth-register",
        compositionRef: composition.compositionRef,
        compositionDigest: composition.compositionDigest,
        authorityRefs: [contentLedgerRef, registerRef, ruleOutcomeRef],
        evidenceRefs: [contentLedgerRef, registerRef, ruleOutcomeRef]
      }
    ],
    evaluation: {
      evaluationRef: "evaluation://t181/fp",
      status: "passed",
      findingRefs: ["finding://t181/evaluate/design-depth-register"]
    },
    status: "passed",
    postflightStatus: "passed",
    blockingReasons: [],
    evidenceRefs: [contentLedgerRef, registerRef, ruleOutcomeRef]
  };
}

function writeDesignDepthFpEvaluatorContentLedger({ manifest, registerPath }) {
  const composition = selectedComposition();
  const register = JSON.parse(readFileSync(registerPath, "utf8"));
  const contentLedgerPath = designDepthFpEvaluatorContentLedgerPath({
    archiveRoot: manifest.archiveRoot
  });
  const contentLedgerRef = pathToFileURL(contentLedgerPath).href;
  const registerRef = pathToFileURL(registerPath).href;
  writeFileSync(
    contentLedgerPath,
    `${JSON.stringify(
      {
        kind: "sdlc_evaluate_content_ledger",
        ledgerVersion: "ts-evaluate-content-v1",
        stage: "evaluate.C",
        ruleRef: "evaluation-rule://odd-sdlc/design-depth-register/fp",
        ruleRole: "semantic_judgment",
        computeMeans: "F_P",
        authorityFunction: "synthesize_model",
        selectedCompositionRef: composition.compositionRef,
        selectedCompositionDigest: composition.compositionDigest,
        selectedCompositionSelectionRef: composition.compositionSelectionRef,
        selectedRegimeBindingRef: composition.selectedRegimeBindingRef,
        compositionContributionRef: composition.selectedRegimeBindingRef,
        sourceBasisRefs: [pathToFileURL(manifest.outputFile).href],
        candidateArtifactRefs: [pathToFileURL(manifest.outputFile).href],
        evidenceRefs: [pathToFileURL(manifest.outputFile).href, registerRef],
        contentRows: [
          {
            kind: "sdlc_evaluate_content_ledger_row",
            rowRef: `content-ledger-row://t181/${manifest.runId}/design-depth`,
            authorityFunction: "synthesize_model",
            carrierFamily: "ProductAssetModel",
            contentKind: "sdlc_design_depth_register",
            payload: register,
            sourceBasisRefs: [pathToFileURL(manifest.outputFile).href],
            evidenceRefs: [pathToFileURL(manifest.outputFile).href, registerRef]
          }
        ]
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  return contentLedgerRef;
}

test("T-183 evaluate content ledger rejects bridge-shaped extra semantic surfaces", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForImplementationDesign(
      workspaceRoot,
      "t183-content-ledger-closed-shape"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    writeFileSync(manifest.outputFile, implementationDesignAdr("fp-sidecar"), "utf8");
    const registerPath = designDepthFpEvaluatorRegisterPath(manifest);
    mkdirSync(path.dirname(registerPath), { recursive: true });
    writeFileSync(
      registerPath,
      `${JSON.stringify(
        implementationDesignRegister(
          "fp-sidecar",
          pathToFileURL(manifest.outputFile).href
        ),
        null,
        2
      )}\n`,
      "utf8"
    );
    writeDesignDepthFpEvaluatorContentLedger({ manifest, registerPath });
    const contentLedgerPath = designDepthFpEvaluatorContentLedgerPath({
      archiveRoot: manifest.archiveRoot
    });
    const composition = selectedComposition();
    const selectedIdentity = {
      selectedCompositionRef: composition.compositionRef,
      selectedCompositionDigest: composition.compositionDigest,
      selectedCompositionSelectionRef: composition.compositionSelectionRef,
      selectedRegimeBindingRef: composition.selectedRegimeBindingRef
    };
    const admissionInput = {
      ledgerPath: contentLedgerPath,
      selectedIdentity,
      ruleRef: "evaluation-rule://odd-sdlc/design-depth-register/fp",
      authorityFunction: "synthesize_model"
    };

    const cleanLedger = JSON.parse(readFileSync(contentLedgerPath, "utf8"));
    assert.equal(
      admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity(admissionInput)
        .status,
      "admitted"
    );

    writeFileSync(
      contentLedgerPath,
      `${JSON.stringify(
        {
          ...cleanLedger,
          legacySemanticRows: []
        },
        null,
        2
      )}\n`,
      "utf8"
    );
    const topLevelExtra =
      admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity(admissionInput);
    assert.equal(topLevelExtra.status, "rejected");
    assert.match(
      topLevelExtra.blockingReasons.join("\n"),
      /unexpected keys legacySemanticRows/u
    );

    writeFileSync(
      contentLedgerPath,
      `${JSON.stringify(
        {
          ...cleanLedger,
          contentRows: cleanLedger.contentRows.map((row) => ({
            ...row,
            legacyScore: 1
          }))
        },
        null,
        2
      )}\n`,
      "utf8"
    );
    const rowExtra =
      admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity(admissionInput);
    assert.equal(rowExtra.status, "rejected");
    assert.match(rowExtra.blockingReasons.join("\n"), /unexpected keys legacyScore/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-181 handoff names evaluate.C/F_P as design-depth register population", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForImplementationDesign(workspaceRoot, "t181-prompt");
    const files = writeHandoffFiles(manifest);
    const prompt = readFileSync(files.promptPath, "utf8");

    assert.match(
      prompt,
      /evaluate\.C\/F_P design-depth evaluator populates the design-depth register/u
    );
    assert.match(prompt, /Deterministic framework code admits and validates/u);
    assert.doesNotMatch(
      prompt,
      /framework evaluator derives and publishes the design-depth register/u
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-181 evaluator sidecar is preferred over legacy ADR derivation", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForImplementationDesign(
      workspaceRoot,
      "t181-sidecar-preferred"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    const content = implementationDesignAdr("fd-derived");
    writeFileSync(manifest.outputFile, content, "utf8");
    const registerPath = designDepthFpEvaluatorRegisterPath(manifest);
    mkdirSync(path.dirname(registerPath), { recursive: true });
    writeFileSync(
      registerPath,
      `${JSON.stringify(
        implementationDesignRegister(
          "fp-sidecar",
          pathToFileURL(manifest.outputFile).href
        ),
        null,
        2
      )}\n`,
      "utf8"
    );

    const admission = admitImplementationDesignRegisterCandidateForManifest({
      manifest
    });

    assert.equal(admission.status, "admitted");
    assert.equal(admission.register.componentTopologyRows[0].componentId, "fp-sidecar");
    assert.notEqual(
      admission.register.componentTopologyRows[0].componentId,
      "fd-derived"
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-181 evaluator sidecar must be admitted JSON, not Markdown fallback", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForImplementationDesign(
      workspaceRoot,
      "t181-sidecar-markdown"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    writeFileSync(manifest.outputFile, implementationDesignAdr("fd-derived"), "utf8");
    const registerPath = designDepthFpEvaluatorRegisterPath(manifest);
    mkdirSync(path.dirname(registerPath), { recursive: true });
    writeFileSync(registerPath, implementationDesignAdr("markdown-sidecar"), "utf8");

    const admission = admitImplementationDesignRegisterCandidateForManifest({
      manifest
    });

    assert.equal(admission.status, "rejected");
    assert.deepEqual(admission.blockingReasons, [
      "design_depth_register_json_required"
    ]);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-183 evaluator sidecar admission is structural and does not replace F_P semantic judgment", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForImplementationDesign(
      workspaceRoot,
      "t181-sidecar-quality"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    writeFileSync(manifest.outputFile, implementationDesignAdr("fp-sidecar"), "utf8");
    const registerPath = designDepthFpEvaluatorRegisterPath(manifest);
    mkdirSync(path.dirname(registerPath), { recursive: true });
    const evidenceRef = pathToFileURL(manifest.outputFile).href;
    const register = implementationDesignRegister("fp-sidecar", evidenceRef);
    register.componentTopologyRows[0].publicBoundary = "module-root";
    register.componentRealizationRows[0].publicBoundary = "module-root";
    register.fileTargetRows = [
      ...register.fileTargetRows,
      {
        kind: "sdlc_file_target_row",
        relativePath: register.fileTargetRows[0].relativePath,
        role: "runtime_binding"
      }
    ];
    writeFileSync(registerPath, `${JSON.stringify(register, null, 2)}\n`, "utf8");

    const admission = admitImplementationDesignRegisterCandidateForManifest({
      manifest
    });

    assert.equal(admission.status, "admitted");
    assert.equal(
      admission.register.componentTopologyRows[0].publicBoundary,
      "module-root"
    );
    const runtimeAdmission = admitImplementationDesignRegisterForManifest({
      manifest
    });
    assert.equal(runtimeAdmission.status, "rejected");
    assert.deepEqual(runtimeAdmission.blockingReasons, [
      "design_depth_fp_evaluator_register_unadmitted"
    ]);

    const missingSourceTargetRegister = implementationDesignRegister(
      "fp-sidecar",
      evidenceRef
    );
    missingSourceTargetRegister.fileTargetRows = [
      {
        kind: "sdlc_file_target_row",
        relativePath: "package.json",
        role: "build_config"
      }
    ];
    writeFileSync(
      registerPath,
      `${JSON.stringify(missingSourceTargetRegister, null, 2)}\n`,
      "utf8"
    );
    const missingSourceTargetAdmission =
      admitImplementationDesignRegisterCandidateForManifest({
        manifest
      });
    assert.equal(missingSourceTargetAdmission.status, "admitted");
    assert.deepEqual(
      missingSourceTargetAdmission.register.fileTargetRows.map((row) => row.role),
      ["build_config"]
    );

    const emptyTopologyRegister = implementationDesignRegister(
      "fp-sidecar",
      evidenceRef
    );
    emptyTopologyRegister.componentTopologyRows = [];
    emptyTopologyRegister.componentRealizationRows = [];
    emptyTopologyRegister.fileTargetRows = [
      {
        kind: "sdlc_file_target_row",
        relativePath: "package.json",
        role: "build_config"
      }
    ];
    writeFileSync(
      registerPath,
      `${JSON.stringify(emptyTopologyRegister, null, 2)}\n`,
      "utf8"
    );
    const emptyTopologyAdmission =
      admitImplementationDesignRegisterCandidateForManifest({
        manifest
      });
    assert.equal(emptyTopologyAdmission.status, "admitted");
    assert.deepEqual(emptyTopologyAdmission.register.componentTopologyRows, []);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-181 F_P evaluator register truth defers transform postflight and validates after sidecar", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForImplementationDesign(
      workspaceRoot,
      "t181-sidecar-required"
    );
    mkdirSync(path.dirname(manifest.outputFile), { recursive: true });
    const content = implementationDesignAdr("fd-derived");
    writeFileSync(manifest.outputFile, content, "utf8");
    const report = surfaceReport({ manifest, content });

    const directAdmission = admitImplementationDesignRegisterForManifest({
      manifest
    });
    assert.equal(directAdmission.status, "rejected");
    assert.deepEqual(directAdmission.blockingReasons, [
      "design_depth_fp_evaluator_register_missing"
    ]);

    const before = evaluateSdlcComputeStage({ manifest, report });
    assert.equal(
      before.blockingReasonCarriers.some((reason) =>
        reason.code.startsWith("staged_")
      ),
      false,
      JSON.stringify(before.blockingReasonCarriers, null, 2)
    );
    const preEvaluateAssuranceGate = deriveSdlcOperatorAssuranceGate({
      manifest,
      report,
      postflight: before
    });
    assert.equal(
      JSON.stringify(preEvaluateAssuranceGate).includes("design_depth_register_missing"),
      false,
      JSON.stringify(preEvaluateAssuranceGate, null, 2)
    );
    assert.equal(
      preEvaluateAssuranceGate.requiredDimensions.includes("design_completeness"),
      false,
      JSON.stringify(preEvaluateAssuranceGate.requiredDimensions, null, 2)
    );

    const registerPath = designDepthFpEvaluatorRegisterPath(manifest);
    mkdirSync(path.dirname(registerPath), { recursive: true });
    writeFileSync(
      registerPath,
      `${JSON.stringify(
        implementationDesignRegister(
          "fp-sidecar",
          pathToFileURL(manifest.outputFile).href
        ),
        null,
        2
      )}\n`,
      "utf8"
    );

    const filesystemOnly = evaluateSdlcComputeStage({ manifest, report });
    assert.equal(filesystemOnly.status, "passed");
    assert.deepEqual(filesystemOnly.blockingReasons, []);
    assert.match(
      JSON.stringify(filesystemOnly.blockingReasonCarriers),
      /design_depth_fp_evaluator_register_unadmitted/u
    );

    const fpEvaluatorAdmissionEvidenceRefs = Object.freeze([
      writeDesignDepthFpEvaluatorRuleOutcomeProof({ manifest, registerPath })
    ]);
    const missingContentLedger = evaluateSdlcComputeStage({
      manifest,
      report,
      fpEvaluatorAdmissionEvidenceRefs
    });
    assert.equal(missingContentLedger.status, "passed");
    assert.deepEqual(missingContentLedger.blockingReasons, []);
    assert.match(
      JSON.stringify(missingContentLedger.blockingReasonCarriers),
      /design_depth_fp_evaluator_register_unadmitted/u
    );

    writeDesignDepthFpEvaluatorContentLedger({ manifest, registerPath });
    const after = evaluateSdlcComputeStage({
      manifest,
      report,
      fpEvaluatorAdmissionEvidenceRefs
    });
    assert.equal(
      after.blockingReasonCarriers.some((reason) =>
        reason.code.startsWith("staged_")
      ),
      false,
      JSON.stringify(after.blockingReasonCarriers, null, 2)
    );
    assert.ok(
      after.evidenceRefs.some((ref) =>
        ref.endsWith("/design_depth_fp_evaluator_register.json")
      ),
      JSON.stringify(after.evidenceRefs, null, 2)
    );
    const fpEvaluateResult = constructSdlcFpEvaluateResult({
      manifest,
      selectedComposition: selectedComposition(),
      report,
      postflight: after
    });
    assert.equal(
      fpEvaluateResult.selectedRegimeBindingRef,
      "abg.fn_composition.regime_binding://t181/evaluate/fp"
    );
    assert.ok(
      fpEvaluateResult.evidenceRefs.some((ref) =>
        ref.endsWith("/design_depth_fp_evaluator_register.json")
      ),
      JSON.stringify(fpEvaluateResult.evidenceRefs, null, 2)
    );
    assert.ok(
      fpEvaluateResult.findings[0].authorityRefs.some((ref) =>
        ref.endsWith("/design_depth_fp_evaluator_register.json")
      ),
      JSON.stringify(fpEvaluateResult.findings[0].authorityRefs, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-181 component edges read evaluator register from source-asset lineage refs", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const graphFunctionName = "Fg_t181_product";
    const prior = manifestForEdge({
      workspaceRoot,
      runId: "20260523T000000000Z_pid18101",
      graphFunctionName,
      edgeName: "derive_lite_design_adr_surface"
    });
    writeHandoffFiles(prior);
    mkdirSync(path.dirname(prior.outputFile), { recursive: true });
    const priorContent = implementationDesignAdr("fp-predecessor");
    writeFileSync(prior.outputFile, priorContent, "utf8");
    const priorRegisterPath = designDepthFpEvaluatorRegisterPath(prior);
    mkdirSync(path.dirname(priorRegisterPath), { recursive: true });
    writeFileSync(
      priorRegisterPath,
      `${JSON.stringify(
        implementationDesignRegister(
          "fp-predecessor",
          pathToFileURL(prior.outputFile).href
        ),
        null,
        2
      )}\n`,
      "utf8"
    );
    writeDesignDepthFpEvaluatorContentLedger({
      manifest: prior,
      registerPath: priorRegisterPath
    });
    writeDesignDepthFpEvaluatorRuleOutcomeProof({
      manifest: prior,
      registerPath: priorRegisterPath
    });
    writeFileSync(
      path.join(prior.archiveRoot, "fp_evaluate_result.json"),
      `${JSON.stringify(
        fpEvaluateResultPayloadForRegister(priorRegisterPath, {
          selectedRegimeBindingRef:
            "regime-binding://odd-sdlc/derive_lite_design_adr_surface/transform/F_P"
        }),
        null,
        2
      )}\n`,
      "utf8"
    );
    writePriorWorkerResultReport({ manifest: prior, content: priorContent });

    const current = manifestForEdge({
      workspaceRoot,
      runId: "20260523T000000001Z_pid18102",
      graphFunctionName,
      edgeName: "derive_lite_component_code_surface"
    });

    const admission = admitImplementationDesignRegisterForManifest({
      manifest: current
    });

    assert.equal(admission.status, "admitted");
    assert.equal(
      admission.register.componentTopologyRows[0].componentId,
      "fp-predecessor"
    );
    assert.ok(
      admission.evidenceRefs.some((ref) =>
        ref.endsWith("/design_depth_fp_evaluator_register.json")
      ),
      JSON.stringify(admission.evidenceRefs, null, 2)
    );
    const invocationPackage = constructWorkerInvocationPackage({ manifest: current });
    const constructionBrief = constructWorkerConstructionBrief({
      manifest: current,
      constructionBriefPath: path.join(
        current.archiveRoot,
        "worker_construction_brief.json"
      ),
      invocationPackage
    });
    const prompt = promptForHandoff(current);
    assert.ok(
      constructionBrief.stagePressure.designDepthEvaluatorRegisterRefs.some((ref) =>
        ref.endsWith("/design_depth_fp_evaluator_register.json")
      ),
      JSON.stringify(constructionBrief.stagePressure, null, 2)
    );
    assert.match(
      prompt,
      /Treat the admitted design-depth evaluator register as the highest implementation-design semantic pressure/u
    );
    assert.match(
      prompt,
      /connect the product behavior to that source file's runtime entrypoint/u
    );
    assert.match(
      prompt,
      /Tenant stack authority must match the product files actually emitted/u
    );
    assert.match(
      prompt,
      /Pre-return syntax check: every emitted source, test, and build\/config product file must use the language, module\/import system, file extension, test framework, and command shape declared by tenant stack authority/u
    );
    assert.match(
      prompt,
      /When admitted design authority puts role=test product targets in this component-code materialization edge, treat those tests as proof materialization for this edge/u
    );
    assert.match(
      prompt,
      /If the declared test command fails because emitted test files use a different module\/import\/test syntax than tenant stack authority, repair the product files before returning/u
    );
    assert.match(prompt, /construction_brief\.stagePressure\.designDepthEvaluatorRegisterRefs/u);
    assert.match(prompt, /compressed work-category governance/u);
    assert.match(prompt, /config\/work-category-governance\/coding_build\.md/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-181 component-code edge accepts implementation-design evaluator register across graph functions", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const prior = manifestForImplementationDesign(
      workspaceRoot,
      "20260523T000000003Z_pid18105"
    );
    writeHandoffFiles(prior);
    mkdirSync(path.dirname(prior.outputFile), { recursive: true });
    const priorContent = implementationDesignAdr("fp-cross-edge");
    writeFileSync(prior.outputFile, priorContent, "utf8");
    const priorRegisterPath = designDepthFpEvaluatorRegisterPath(prior);
    mkdirSync(path.dirname(priorRegisterPath), { recursive: true });
    writeFileSync(
      priorRegisterPath,
      `${JSON.stringify(
        implementationDesignRegister(
          "fp-cross-edge",
          pathToFileURL(prior.outputFile).href
        ),
        null,
        2
      )}\n`,
      "utf8"
    );
    writeDesignDepthFpEvaluatorContentLedger({
      manifest: prior,
      registerPath: priorRegisterPath
    });
    writeDesignDepthFpEvaluatorRuleOutcomeProof({
      manifest: prior,
      registerPath: priorRegisterPath
    });
    writeFileSync(
      path.join(prior.archiveRoot, "fp_evaluate_result.json"),
      `${JSON.stringify(
        fpEvaluateResultPayloadForRegister(priorRegisterPath),
        null,
        2
      )}\n`,
      "utf8"
    );
    writePriorWorkerResultReport({ manifest: prior, content: priorContent });

    const current = manifestForEdge({
      workspaceRoot,
      runId: "20260523T000000004Z_pid18106",
      graphFunctionName: "derive_component_code_surface",
      edgeName: "derive_component_code_surface"
    });

    assert.notEqual(current.graphFunctionName, prior.graphFunctionName);
    assert.deepEqual(current.inputAssetTypes, ["implementation_design_surface"]);

    const invocationPackage = constructWorkerInvocationPackage({ manifest: current });
    const constructionBrief = constructWorkerConstructionBrief({
      manifest: current,
      constructionBriefPath: path.join(
        current.archiveRoot,
        "worker_construction_brief.json"
      ),
      invocationPackage
    });

    assert.ok(
      constructionBrief.stagePressure.designDepthEvaluatorRegisterRefs.some((ref) =>
        ref.endsWith("/design_depth_fp_evaluator_register.json")
      ),
      JSON.stringify(constructionBrief.stagePressure, null, 2)
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-181 analyzer uses runtime admission for evaluator sidecar", () => {
  const workspaceRoot = makeWorkspace();
  try {
    const manifest = manifestForImplementationDesign(
      workspaceRoot,
      "20260523T000000002Z_pid18103"
    );
    mkdirSync(manifest.archiveRoot, { recursive: true });
    writeFileSync(
      path.join(manifest.archiveRoot, "design_depth_fp_evaluator_register.json"),
      implementationDesignAdr("markdown-sidecar"),
      "utf8"
    );

    const carriers = readOperatorRunCarriers(manifest.archiveRoot);
    const sidecar =
      carriers.artifactStateByRef[
        "operator-run-artifact://design-depth-fp-evaluator-register"
      ];

    assert.equal(sidecar.status, "malformed");
    assert.match(sidecar.detail, /design_depth_register_json_required/u);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("T-181 installed operator declares an F_P evaluation rule for register population", () => {
  const source = readRepoFile("build_tenants/typescript/code/src/operator/installed_operator.ts");
  const handoffSource = readRepoFile("build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts");
  const operatorIndex = readRepoFile("build_tenants/typescript/code/src/operator/index.ts");
  const evaluatePluginSource = readRepoFile(
    "build_tenants/typescript/code/src/operator/plugins/evaluate/index.ts"
  );
  const evaluatePostflightSource = readRepoFile(
    "build_tenants/typescript/code/src/operator/plugins/evaluate/postflight.ts"
  );
  const evaluateDesignDepthSource = readRepoFile(
    "build_tenants/typescript/code/src/operator/plugins/evaluate/design_depth_register.ts"
  );

  assert.match(source, /DESIGN_DEPTH_FP_EVALUATOR_RULE_REF/u);
  assert.match(source, /function designDepthFpEvaluatorRuleContract\(\)/u);
  assert.match(source, /outputCarrier: "SdlcDesignDepthRegister"/u);
  assert.match(source, /computeStageRole: "evaluate"/u);
  assert.match(source, /computeMeans: "F_P"/u);
  assert.match(source, /evaluationRules: Object\.freeze\(\[\s*designDepthFpEvaluatorRule,\s*reviewGradeEdgeFulfillmentRule\s*\]\)/u);
  assert.match(source, /requiredEvaluationRuleRefs: Object\.freeze\(\[/u);
  assert.match(source, /REVIEW_GRADE_EDGE_FULFILLMENT_RULE_REF/u);
  assert.doesNotMatch(source, /designDepthFpEvaluatorRuleEnabled/u);
  assert.doesNotMatch(handoffSource, /designDepthFpEvaluatorRegistersEnabled/u);
  assert.doesNotMatch(handoffSource, /allowLegacyImplementationDesignDerivation/u);
  assert.doesNotMatch(handoffSource, /allowLegacyDerivation/u);
  assert.doesNotMatch(handoffSource, /node\/javascript/u);
  assert.doesNotMatch(handoffSource, /SBT\/JDK/u);
  assert.doesNotMatch(handoffSource, /java\.security\.manager/u);
  assert.doesNotMatch(operatorIndex, /admitImplementationDesignRegisterForManifest/u);
  assert.match(operatorIndex, /export \* from "\.\/plugins\/evaluate\/index\.js"/u);
  assert.doesNotMatch(operatorIndex, /export \* from "\.\/handoff\.js"/u);
  assert.match(evaluatePluginSource, /SDLC_EVALUATE_C_PLUGIN_SURFACE/u);
  assert.match(evaluatePluginSource, /evaluateSdlcComputeStage/u);
  assert.doesNotMatch(
    evaluatePluginSource,
    /admitImplementationDesignRegisterForManifest/u
  );
  assert.doesNotMatch(
    evaluatePluginSource,
    /admitImplementationDesignRegisterCandidateForManifest/u
  );
  assert.match(evaluatePostflightSource, /export function evaluateSdlcComputeStage/u);
  assert.match(evaluatePostflightSource, /export function constructSdlcFpEvaluateResult/u);
  assert.match(evaluatePostflightSource, /export function writeSdlcFpEvaluateResult/u);
  assert.doesNotMatch(evaluatePluginSource, /evaluateWorkerResultPostflight/u);
  assert.doesNotMatch(evaluatePluginSource, /constructFpEvaluateResult/u);
  assert.doesNotMatch(evaluatePluginSource, /writeFpEvaluateResult/u);
  assert.doesNotMatch(handoffSource, /export function evaluateWorkerResultPostflight/u);
  assert.doesNotMatch(handoffSource, /export function constructFpEvaluateResult/u);
  assert.doesNotMatch(handoffSource, /export function writeFpEvaluateResult/u);
  assert.doesNotMatch(handoffSource, /function evaluateWorkerResultPostflight/u);
  assert.doesNotMatch(handoffSource, /function constructFpEvaluateResult/u);
  assert.doesNotMatch(handoffSource, /function writeFpEvaluateResult/u);
  assert.doesNotMatch(handoffSource, /export function evaluateSdlcComputeStage/u);
  assert.doesNotMatch(handoffSource, /export function constructSdlcFpEvaluateResult/u);
  assert.doesNotMatch(handoffSource, /export function writeSdlcFpEvaluateResult/u);
  assert.doesNotMatch(handoffSource, /function evaluateSdlcComputeStage/u);
  assert.doesNotMatch(handoffSource, /function constructSdlcFpEvaluateResult/u);
  assert.doesNotMatch(handoffSource, /function writeSdlcFpEvaluateResult/u);
  assert.match(source, /from "\.\/plugins\/evaluate\/index\.js"/u);
  assert.doesNotMatch(
    /import \{[\s\S]*evaluateSdlcComputeStage[\s\S]*\} from "\.\/handoff\.js"/u.exec(source)?.[0] ?? "",
    /evaluateSdlcComputeStage/u
  );
  assert.doesNotMatch(
    /import \{[\s\S]*evaluateWorkerResultPostflight[\s\S]*\} from "\.\/handoff\.js"/u.exec(source)?.[0] ?? "",
    /evaluateWorkerResultPostflight/u
  );
  assert.doesNotMatch(
    readRepoFile("build_tenants/typescript/code/src/operator/design_depth_register.ts"),
    /allowMarkdownDerivation/u
  );
  assert.match(source, /Allowed componentTopologyRows\[\]\.concernRole values/u);
  assert.match(source, /concernRole must be one of the allowed values exactly/u);
  assert.match(source, /Do not turn test, proof-test, package, runtime-config/u);
  assert.match(source, /fileTargetRows to materialized product file roles/u);
  assert.match(source, /A source row marked deferred is still a materialized product target/u);
  assert.match(source, /Do not collapse the register to manifest-only/u);
  assert.match(source, /Staged decomposition admission is mandatory/u);
  assert.match(source, /must own no more than 8 requirementIds/u);
  assert.match(source, /split it into multiple component rows/u);
  assert.match(source, /component-row pressure density remains 8 or less/u);
  assert.match(source, /Keep upstreamComponentIds as component ids only/u);
  assert.match(source, /Register size budget is part of correctness/u);
  assert.match(source, /bounded pressure map, not an exhaustive copy/u);
  assert.match(source, /Do not derive one component per requirement/u);
  assert.match(source, /20 to 32 componentTopologyRows\/componentRealizationRows/u);
  assert.match(source, /no more than 16 aggregate entities/u);
  assert.match(source, /no more than 24 aggregate operations/u);
  assert.match(source, /no more than 18 steps/u);
  assert.match(source, /3 to 8 local\/high-signal requirementIds per component row/u);
  assert.match(source, /Do not repeat the same large requirement id list/u);
  assert.match(source, /Do not print, cat, tail, grep, or paste full authority files into stdout/u);
  assert.match(source, /Do not display worker_invocation_package\.json/u);
  assert.match(source, /Do not use cat, sed, head, tail, grep, jq '\.'/u);
  assert.match(source, /run Node snippets that read silently/u);
  assert.match(source, /The content ledger path is the durable evaluation artifact/u);
  assert.match(source, /not a single-shot JSON response/u);
  assert.match(source, /Agentic F_P work loop/u);
  assert.match(source, /Start by writing a short plan and checklist/u);
  assert.match(source, /create the content ledger file before doing deep exploratory review/u);
  assert.match(source, /Do not use the Read tool on the handoff manifest/u);
  assert.match(source, /Precomputed worker result report summary/u);
  assert.match(source, /Do not inspect the worker result report/u);
  assert.match(source, /Do not use the Read tool on the worker invocation package/u);
  assert.match(source, /At most one bounded summary script is allowed before the first ledger write/u);
  assert.match(source, /must not inspect worker_result_report\.json/u);
  assert.match(source, /the next tool call must create or overwrite the content ledger file/u);
  assert.match(source, /Do not say .*writing the ledger.* until that file write has succeeded/u);
  assert.doesNotMatch(source, /Use the provided .*seed script/u);
  assert.doesNotMatch(source, /First register materialization recipe/u);
  assert.doesNotMatch(source, /parses the ADR component topology table/u);
  assert.doesNotMatch(source, /designDepthFpEvaluatorSeedScript/u);
  assert.doesNotMatch(source, /design_depth_fp_evaluator_seed_register/u);
  assert.doesNotMatch(source, /moduleName\.startsWith\("cdme-"\)/u);
  assert.doesNotMatch(source, /src\/main\/scala/u);
  assert.doesNotMatch(source, /stack:scala-spark-sbt/u);
  assert.doesNotMatch(source, /model:cdme-data-mapper/u);
  assert.match(source, /First register materialization rule/u);
  assert.match(source, /selected evaluate\.C\/F_P semantic pressure map/u);
  assert.match(source, /mandatory bounded target-path reconciliation pass/u);
  assert.match(source, /If those sources name exact product paths, the final register must preserve those exact paths/u);
  assert.match(source, /Do not use scripts to deterministically construct semantic register rows/u);
  assert.match(source, /Do not spend the run enumerating every requirement id before writing the register/u);
  assert.match(source, /Missing-ledger timeout is worse than an admitted pressure map/u);
  assert.match(source, /Script output budget before first ledger write: no more than 40/u);
  assert.match(source, /Bounded first-pass register target/u);
  assert.match(source, /It is acceptable to rewrite the content ledger multiple times while converging/u);
  assert.match(source, /Stdout is an agent work trace, not evaluation truth/u);
  assert.match(source, /compressed work-category governance/u);
  assert.match(source, /selectSdlcWorkCategoryGovernance/u);
  assert.match(source, /Durable evaluation artifact to create and validate/u);
  assert.match(source, /partial or blocked designCompletenessVerdict axes/u);
  assert.match(source, /DEFAULT_DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS/u);
  assert.match(source, /ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS/u);
  assert.match(source, /ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_STDOUT_BUDGET_BYTES/u);
  assert.match(source, /stdoutBudgetBytes/u);
  assert.match(source, /write the content ledger file first, then validate that file/u);
  assert.match(source, /highest semantic design-depth truth/u);
  assert.match(source, /sdlc_evaluate_content_ledger/u);
  assert.match(source, /contentRows\[0\]\.rowRef/u);
  assert.match(source, /contentRows\[0\]\.sourceBasisRefs\[\]/u);
  assert.match(source, /contentRows\[0\]\.evidenceRefs\[\]/u);
  assert.match(source, /Ledger rows are closed carriers/u);
  assert.match(source, /contentRows\[0\]\.payload must be the full design-depth register object/u);
  assert.match(source, /F_D will only project that exact payload to the legacy register path after admission/u);
  assert.match(
    source,
    /preserve that executable-entrypoint obligation in publicBoundary/u
  );
  assert.match(source, /Evaluate the workspace, admitted transform evidence/u);
  assert.match(source, /compact pressure map from design state A to implementation state B/u);
  assert.match(source, /Nested closed-object contract/u);
  assert.match(source, /Do not use string shorthand for typed rows/u);
  assert.match(source, /moduleSchemaFragments\[\]\.entities\[\] must contain closed sdlc_domain_entity objects/u);
  assert.match(source, /moduleSchemaFragments\[\]\.operations\[\] and aggregateDomainModel\.operations\[\] must contain closed sdlc_domain_operation objects/u);
  assert.match(source, /aggregateDomainModel\.entities\[\]\.attributes\[\] must contain full closed sdlc_domain_attribute objects/u);
  assert.match(source, /never emit attribute id strings, names, or summaries in this array/u);
  assert.match(source, /aggregateDomainModel\.modelVersion must be exactly "ts-design-depth-v1"/u);
  assert.match(source, /aggregateSunnyDaySequence\.sequenceVersion must be exactly "ts-design-depth-v1"/u);
  assert.match(source, /verdictVersion must be exactly "ts-design-depth-v1"/u);
  assert.match(source, /Allowed designCompletenessVerdict\.\*\.status values/u);
  assert.match(source, /Use "satisfied" for a complete axis; never use "complete"/u);
  assert.match(source, /re-open the JSON you wrote and verify that every typed nested item above is an object/u);
  assert.match(source, /bounded path-integrity self-check/u);
  assert.match(source, /structural validity alone is not enough if exact product file paths drift/u);
  assert.match(source, /Required self-check before final response/u);
  assert.match(source, /contentRows\[0\] has exactly kind, rowRef, authorityFunction/u);
  assert.match(source, /payload\.aggregateDomainModel\.modelVersion/u);
  assert.match(source, /aggregateDomainModel\.entities\[\]\.attributes, aggregateDomainModel\.operations/u);
  assert.match(source, /Do not mark an axis partial or blocked merely because/u);
  assert.doesNotMatch(
    readRepoFile("build_tenants/typescript/code/src/operator/design_depth_register.ts"),
    /component_realization_source_file_target_missing/u
  );
  assert.match(source, /function shouldDeferDispatchConsequenceToFpEvaluator/u);
  assert.match(source, /\? null\s*:\s*publishDispatchState\(current\)/u);
  assert.match(source, /dispatchState\.current = current/u);
  assert.match(source, /ABG process actor invocation requires actor ref/u);
  assert.doesNotMatch(source, /fallbackStageRole/u);
  assert.match(source, /designDepthFpEvaluatorAdmissionEvidenceByArchiveRoot/u);
  assert.match(source, /design-depth evaluator rule not applicable to non-design edge/u);
  assert.doesNotMatch(source, /design-depth evaluator rule selected for non-design edge/u);
  assert.doesNotMatch(handoffSource, /latestDesignDepthFpEvaluatorRegisterPath/u);
  assert.match(evaluateDesignDepthSource, /source_asset:implementation_design_surface/u);
  assert.match(evaluateDesignDepthSource, /design_depth_fp_evaluator_register_unadmitted/u);
  assert.match(evaluateDesignDepthSource, /export function admitImplementationDesignRegisterForManifest/u);
  assert.doesNotMatch(handoffSource, /export function admitImplementationDesignRegisterForManifest/u);
  assert.match(handoffSource, /stagePressure\.designDepthEvaluatorRegisterRefs/u);
});

test("T-181 evaluator artifacts are cataloged operator-run truth", () => {
  const rowsByPath = new Map(
    SDLC_OPERATOR_RUN_ARTIFACT_CATALOG.map((row) => [row.relativePath, row])
  );
  const expected = [
    "design_depth_fp_evaluator_run.json",
    "design_depth_fp_evaluator_content_ledger.json",
    "design_depth_fp_evaluator_register.json",
    "design_depth_fp_evaluator_prompt.md",
    "design_depth_fp_evaluator_stdout.log",
    "design_depth_fp_evaluator_stderr.log",
    "design_depth_fp_evaluator_last_message.txt",
    "design_depth_fp_evaluator_process_started.json",
    "design_depth_fp_evaluator_process_events.jsonl",
    "fp_evaluator_postflight.json"
  ];

  for (const relativePath of expected) {
    assert.ok(rowsByPath.has(relativePath), `${relativePath} has catalog row`);
  }

  assert.equal(
    rowsByPath.get("design_depth_fp_evaluator_content_ledger.json").carrierKind,
    "sdlc_evaluate_content_ledger"
  );
  assert.equal(
    rowsByPath.get("design_depth_fp_evaluator_content_ledger.json").sourceOwner,
    "fp_evaluator"
  );
  assert.equal(
    rowsByPath.get("design_depth_fp_evaluator_register.json").carrierKind,
    "sdlc_design_depth_register"
  );
  assert.equal(
    rowsByPath.get("design_depth_fp_evaluator_register.json").sourceOwner,
    "fp_evaluator"
  );
  assert.equal(
    rowsByPath.get("design_depth_fp_evaluator_process_events.jsonl").carrierKind,
    "jsonl:runtime_event"
  );
});
