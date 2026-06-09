// Validates: T-194
// SDLC supplies its inventory; ABG owns the GTL program conformance rules.

import test from "node:test";
import assert from "node:assert/strict";
import {
  readdirSync,
  readFileSync,
  statSync
} from "node:fs";
import path from "node:path";

import {
  GTL_PROGRAM_T153_FEATURE_KINDS,
  GTL_PROGRAM_T153_FEATURE_OWNER_CLASSIFICATIONS,
  formatGtlProgramConformanceIssues,
  materializeGraphFunction,
  typecheckGtlProgram
} from "@abiogenesis/typescript-tenant";
import {
  designDepthFpEvaluatorPromptProjection
} from "../../build/semantic/code/src/operator/plugins/evaluate/prompts.js";
import {
  constructSdlcEvaluationGridContract,
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule,
  constructSdlcPromptInvocationProjection,
  constructSdlcTargetCarrierRegistry,
  constructSdlcTraversalOverlayCatalog,
  ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT,
  SDLC_EDGE_GAIN_CLOSURE_CONTRACTS,
  publicSdlcOverlayStartTargets,
  sdlcPromptSectionFromLines
} from "../../build/semantic/code/src/index.js";
import {
  consequenceProjectionPluginContract,
  designDepthFpEvaluatorRuleContract,
  fpDispatchPluginContract,
  fpEvaluatorPluginContract,
  reviewGradeEdgeFulfillmentRuleContract
} from "../../build/semantic/code/src/operator/plugins/plugin_contracts.js";

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");
const CURRENT_ABG_VERSION =
  ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.packageVersion;
const CURRENT_ABG_FOLD_REF =
  `package:@abiogenesis/typescript-tenant@${CURRENT_ABG_VERSION}` +
  "#abg/m03/iteration_state_action/deriveIterationOutcomeFromRows";

const ACTIVE_SCAN_ROOTS = Object.freeze([
  "specification",
  "build_tenants/typescript/code/src",
  "build_tenants/typescript/design",
  "build_tenants/typescript/test_env/tests",
  "build_tenants/typescript/test_env/live"
]);

const ACTIVE_SCAN_EXTENSIONS = new Set([
  ".ts",
  ".mjs",
  ".md",
  ".json"
]);

const STALE_ABG_IDENTITY_PATTERN =
  /(?:abg[-_:/ ]?3\.|ABG[-_:/ ]?3\.|ABIogenesis[^\n`]*3\.|@abiogenesis[^\n`]*(?:@|\/)3\.|runtime:\/\/abg\/3\.|abg:\/\/3\.|3\.7\.1-rc\.1|3\.8\.0-rc\.3|3\.9-rc3|3\.9\.0-rc\.13|rc13|rc\.13)/u;

const SELF_TEST_PATH =
  "build_tenants/typescript/test_env/tests/test_t194_gtl_program_conformance.test.mjs";

const T153_REQUIREMENT_REFS = Object.freeze([
  "REQ-L-GTL3-ASSET-SURFACE",
  "REQ-L-GTL3-COMPOSE",
  "REQ-L-GTL3-COMPUTE-NOTATION",
  "REQ-L-GTL3-CONTRACT-LAW-API",
  "REQ-L-GTL3-EVALUATOR",
  "REQ-L-GTL3-GRAPH",
  "REQ-L-GTL3-GRAPHFUNCTION",
  "REQ-L-GTL3-GRAPHVECTOR",
  "REQ-L-GTL3-HOF",
  "REQ-L-GTL3-HOOKS",
  "REQ-L-GTL3-IDENTITY",
  "REQ-L-GTL3-JOB",
  "REQ-L-GTL3-LAWS",
  "REQ-L-GTL3-MODULE",
  "REQ-L-GTL3-OPERATOR",
  "REQ-L-GTL3-RECURSE",
  "REQ-L-GTL3-ROLE",
  "REQ-L-GTL3-RULE",
  "REQ-L-GTL3-SELECTION-BOUNDARY",
  "REQ-L-GTL3-SUBSTITUTE",
  "REQ-L-GTL3-SUBWORK",
  "REQ-L-GTL3-SYNTHESIS",
  "REQ-R-ABG3-ASSURANCE",
  "REQ-R-ABG3-FN-COMPOSITION",
  "REQ-R-ABG3-INTERPRET",
  "REQ-R-ABG3-RUN",
  "REQ-R-ABG3-TRANSPORT"
]);

function repoRelative(filePath) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}

function walkActiveFiles(rootRelativePath) {
  const root = path.join(REPO_ROOT, rootRelativePath);
  const files = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    const stat = statSync(current);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(current)) {
        if (entry === "build" || entry === "node_modules") {
          continue;
        }
        stack.push(path.join(current, entry));
      }
      continue;
    }
    if (!stat.isFile()) {
      continue;
    }
    const relative = repoRelative(current);
    if (relative === SELF_TEST_PATH) {
      continue;
    }
    if (ACTIVE_SCAN_EXTENSIONS.has(path.extname(current))) {
      files.push(current);
    }
  }
  return files.sort();
}

function activeSourceIdentitySurfaces() {
  const rows = [];
  for (const root of ACTIVE_SCAN_ROOTS) {
    for (const filePath of walkActiveFiles(root)) {
      const relative = repoRelative(filePath);
      rows.push(
        Object.freeze({
          surfaceRef: relative,
          text: readFileSync(filePath, "utf8"),
          evidenceRefs: Object.freeze([`workspace://${relative}`])
        })
      );
    }
  }
  return Object.freeze(rows);
}

function promptSection(title) {
  return sdlcPromptSectionFromLines({
    role: "purpose",
    title,
    textLines: [
      "Construct or evaluate the declared SDLC carrier through the typed prompt asset boundary."
    ],
    intent: "Prove T-194 prompt construction is a GTL AssetSurface/Node view.",
    expectedOutcome: "The prompt projection preserves typed constructor, authority, proof, and digest refs.",
    failureModeAddressed: "Prompt prose or MCP-shaped schema becomes the source of contract truth.",
    appliesWhen: "T-194 inventories SDLC prompt construction for GTL program conformance typechecking.",
    provenanceRefs: ["ticket://odd-sdlc/T-194"],
    authorityBasisRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"]
  });
}

function evaluationGridContractForT194() {
  return constructSdlcEvaluationGridContract({
    logicalGridRef: "evaluation-grid://odd-sdlc/t194/program-conformance",
    physicalExecution: "fused_prompt",
    transformUnits: [
      {
        kind: "sdlc_transform_unit_ref",
        unitRef: "transform-unit://odd-sdlc/t194/one",
        segmentKey: "single",
        sourceAssetRefs: ["workspace://source"],
        targetAssetRefs: ["workspace://target"],
        obligationRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"]
      }
    ],
    evaluationDimensions: [
      {
        kind: "sdlc_evaluation_dimension_ref",
        dimensionRef: "evaluation-dimension://odd-sdlc/t194/cell-quality",
        scope: "cell",
        expectedFindingRef:
          "evaluation-finding://odd-sdlc/t194/cell-quality"
      }
    ],
    disambiguationCarriers: [
      {
        kind: "sdlc_disambiguation_carrier_ref",
        carrierRef: "carrier://odd-sdlc/t194/cell-quality",
        scopeRef: "evaluation-scope://odd-sdlc/t194/single",
        authoritySnapshotRefs: ["authority://odd-sdlc/product"],
        priorFindingRefs: [],
        lineageRefs: ["lineage://odd-sdlc/t194"]
      }
    ],
    expectedFindingRefs: [
      "evaluation-finding://odd-sdlc/t194/cell-quality"
    ],
    abgOutcomeFoldRef: CURRENT_ABG_FOLD_REF,
    provenanceRefs: ["ticket://odd-sdlc/T-194"]
  });
}

function promptProjectionRows() {
  const transformProjection = constructSdlcPromptInvocationProjection({
    promptFamily: "transform",
    stage: "transform.C",
    recipient: "transformer",
    targetAssetType: "sdlc_transform_candidate",
    constructorRef: "constructor://odd-sdlc/t194/transform-prompt",
    authorityPacketRefs: ["authority://odd-sdlc/product"],
    obligationRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"],
    toolEffectPolicyRefs: ["tool-policy://odd-sdlc/t194/read-write-output-only"],
    outputCarrierRefs: ["carrier://odd-sdlc/transform-candidate"],
    proofObligationRefs: ["proof://odd-sdlc/t194/transform-prompt"],
    evaluationGridContract: null,
    promptSections: [promptSection("T-194 Transform Prompt Boundary")]
  });

  const evaluationProjection = constructSdlcPromptInvocationProjection({
    promptFamily: "evaluate_review_grade",
    stage: "evaluate.C",
    recipient: "evaluator",
    targetAssetType: "sdlc_review_grade_assessment",
    constructorRef: "constructor://odd-sdlc/t194/evaluate-prompt",
    authorityPacketRefs: ["authority://odd-sdlc/product"],
    obligationRefs: ["requirement://odd-sdlc/REQ-F-ODDSDLC-088"],
    toolEffectPolicyRefs: ["tool-policy://odd-sdlc/t194/read-only"],
    outputCarrierRefs: ["carrier://odd-sdlc/review-grade-assessment"],
    proofObligationRefs: ["proof://odd-sdlc/t194/evaluate-prompt"],
    evaluationGridContract: evaluationGridContractForT194(),
    promptSections: [promptSection("T-194 Evaluate Prompt Boundary")]
  });

  const designDepthProjection = designDepthFpEvaluatorPromptProjection({
    manifest: {
      graphFunctionName: "derive_lite_design_adr_surface",
      edgeName: "derive_lite_design_adr_surface",
      targetAssetType: "implementation_design_surface",
      traversalObligationContext: {
        obligations: [
          {
            obligationId: "requirement://odd-sdlc/REQ-F-ODDSDLC-088"
          }
        ]
      }
    },
    manifestPath: "workspace://.ai-workspace/runtime/odd_sdlc/handoff_manifest.json",
    governanceRef: "governance://odd-sdlc/t194/design-depth",
    governancePath: "workspace://specification/PRODUCT.md",
    constructionBriefPath: "workspace://.ai-workspace/runtime/odd_sdlc/construction_brief.md",
    invocationPackagePath: "workspace://.ai-workspace/runtime/odd_sdlc/worker_invocation_package.json",
    workerReportPath: "workspace://.ai-workspace/runtime/odd_sdlc/worker_result_report.json",
    workerReportSummaryLines: [
      "T-194 prompt inventory probe; no product semantics are asserted here."
    ],
    contentRegisterPath: "workspace://.ai-workspace/runtime/odd_sdlc/design_depth_fp_evaluator_content_register.json",
    registerProjectionPath: "workspace://.ai-workspace/runtime/odd_sdlc/design_depth_fp_evaluator_register.json",
    subworkstreamManifestPath: "workspace://.ai-workspace/runtime/odd_sdlc/evaluate_compute_subworkstream_manifest.json",
    selectedCompositionRef: "composition://odd-sdlc/t194/design-depth",
    selectedCompositionDigest: "sha256:t194-design-depth-prompt-projection",
    selectedCompositionSelectionRef: "composition-selection://odd-sdlc/t194/design-depth",
    selectedRegimeBindingRef: null
  });

  return Object.freeze([transformProjection, designDepthProjection, evaluationProjection].map(
    (projection) => Object.freeze({
      surfaceRef:
        `prompt://odd-sdlc/${projection.invocationAsset.promptFamily}` +
        `/${projection.invocationAsset.stage}`,
      assetSurface: projection.invocationAsset.gtlNode.assetSurface,
      gtlNode: projection.invocationAsset.gtlNode,
      renderedViewDigest: projection.invocationAsset.renderedPromptDigest,
      currentAbgFoldRefs: projection.invocationAsset.evaluationGridContract === null
        ? Object.freeze([])
        : Object.freeze([
            projection.invocationAsset.evaluationGridContract.abgOutcomeFoldRef
          ]),
      evidenceRefs: Object.freeze([
        "workspace://build_tenants/typescript/code/src/operator/prompt_assets.ts",
        "workspace://build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts"
      ])
    })
  ));
}

function materializedGraphVectorRows(module) {
  return Object.freeze(
    module.graphFunctions.flatMap((graphFunction) => {
      const graph = materializeGraphFunction(graphFunction);
      return graph.vectors.map((vector) => Object.freeze({
        graphFunction,
        graph,
        vector
      }));
    })
  );
}

function stringForRef(value) {
  return value.replace(/[^A-Za-z0-9_.:-]+/gu, "-");
}

function digestForRef(ref) {
  return `sha256:${stringForRef(ref)}`;
}

function scalarConfigValue(hookRef, key) {
  const entries = hookRef?.config?.entries ?? [];
  const entry = entries.find((candidate) => candidate.key === key);
  return entry?.value?.kind === "scalar" ? entry.value.value : null;
}

function hookRefEntries(entries, key = null) {
  return entries
    .filter((entry) => (key === null || entry.key === key))
    .filter((entry) => entry.value?.kind === "hook_ref")
    .map((entry) => Object.freeze({
      key: entry.key,
      hookRef: entry.value.value
    }));
}

function uniqueRows(rows, keyForRow) {
  const seen = new Set();
  const unique = [];
  for (const row of rows) {
    const key = keyForRow(row);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(row);
  }
  return Object.freeze(unique);
}

function operatorDeclarationRows(vectorRows) {
  return Object.freeze(
    vectorRows.flatMap((row) =>
      row.vector.operators.map((operator, index) => Object.freeze({
        operatorRef:
          `operator://odd-sdlc/${row.graphFunction.name}` +
          `/${row.vector.name}/${index}/${operator.name}`,
        name: operator.name,
        regime: operator.regime,
        binding: operator.binding,
        hostKind: "graph_vector",
        hostRef: row.vector.id,
        tagRefs: operator.tags,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/graph/module.ts"
        ])
      }))
    )
  );
}

function evaluatorDeclarationRows(vectorRows) {
  return Object.freeze(
    vectorRows.flatMap((row) =>
      row.vector.evaluators.map((evaluator, index) => Object.freeze({
        evaluatorRef:
          `evaluator://odd-sdlc/${row.graphFunction.name}` +
          `/${row.vector.name}/${index}/${evaluator.name}`,
        name: evaluator.name,
        regime: evaluator.regime,
        description: evaluator.description,
        binding: evaluator.binding,
        consumedFieldRefs: evaluator.consumedFieldRefs,
        hostKind: "graph_vector",
        hostRef: row.vector.id,
        tagRefs: evaluator.tags,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/graph/module.ts"
        ])
      }))
    )
  );
}

function ruleDeclarationRows(vectorRows) {
  return Object.freeze(
    vectorRows.flatMap((row) => {
      if (row.vector.rule === null) {
        return [];
      }
      return [Object.freeze({
        ruleRef:
          `rule://odd-sdlc/${row.graphFunction.name}` +
          `/${row.vector.name}/${row.vector.rule.name}`,
        name: row.vector.rule.name,
        ruleKind: row.vector.rule.kind,
        configDigest: digestForRef(
          `rule:${row.graphFunction.name}:${row.vector.name}:${row.vector.rule.name}`
        ),
        hostKind: "graph_vector",
        hostRef: row.vector.id,
        tagRefs: row.vector.rule.tags,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/graph/module.ts"
        ])
      })];
    })
  );
}

function computeCompositionRows(vectorRows) {
  return uniqueRows(
    vectorRows.flatMap((row) =>
      hookRefEntries(row.vector.declarations.entries, "abg.fn_composition")
        .map(({ hookRef }) => {
          const compositionRef =
            scalarConfigValue(hookRef, "contract_ref") ??
            `abg.fn_composition://odd-sdlc/${row.graphFunction.name}`;
          const closureContractRef =
            scalarConfigValue(hookRef, "closure_contract_ref") ??
            `closure://odd-sdlc/${row.graphFunction.name}/fd-evaluate`;
          const regimeBindingRefs = Object.freeze([
            ...row.vector.operators.map((operator) => operator.binding),
            ...row.vector.evaluators.map((evaluator) => evaluator.binding)
          ]);
          return Object.freeze({
            compositionRef,
            compositionDigest: digestForRef(compositionRef),
            hostKind: "graph_vector",
            hostRef: row.vector.id,
            declarationSourceKind: "graph_vector_declaration",
            declarationSourceRef: hookRef.ref,
            notationRefs: Object.freeze([
              "fn<SourceAsset,TargetAsset>.C",
              "transform.C",
              "evaluate.C",
              "consequence.C"
            ]),
            regimeBindingRefs,
            stageBindingRefs: Object.freeze([
              `stage-binding://odd-sdlc/${row.graphFunction.name}/transform.C`,
              `stage-binding://odd-sdlc/${row.graphFunction.name}/evaluate.C`,
              `stage-binding://odd-sdlc/${row.graphFunction.name}/consequence.C`
            ]),
            closureContractRef,
            evidenceRefs: Object.freeze([
              "workspace://build_tenants/typescript/code/src/graph/module.ts"
            ])
          });
        })
    ),
    (row) => row.compositionRef
  );
}

function hookBoundaryRows(vectorRows) {
  return uniqueRows(
    vectorRows.flatMap((row) =>
      hookRefEntries(row.vector.declarations.entries).map(({ key, hookRef }, index) =>
        Object.freeze({
          hookRef: hookRef.ref,
          hookKey: key,
          hostKind: "graph_vector",
          hostRef: row.vector.id,
          declarationSourceKind: "graph_vector_declaration",
          declarationRef: `${row.vector.id}:declarations:${index}:${key}`,
          precedenceRank: index,
          concernRefs: Object.freeze([key]),
          pluginContractRefs: Object.freeze([]),
          evidenceRefs: Object.freeze([
            "workspace://build_tenants/typescript/code/src/graph/module.ts"
          ])
        })
      )
    ),
    (row) => `${row.hostRef}:${row.hookKey}:${row.hookRef}`
  );
}

function jobBindingRows(module) {
  const graphFunctionNameById = new Map(
    module.graphFunctions.map((graphFunction) => [
      graphFunction.id,
      graphFunction.name
    ])
  );
  return Object.freeze(
    module.jobs.map((job) => {
      const contractTargetRefs = Object.freeze(
        job.contracts
          .map((contract) => graphFunctionNameById.get(contract.targetId) ?? null)
          .filter((targetRef) => targetRef !== null)
      );
      return Object.freeze({
        jobRef: job.name,
        contractTargetRefs,
        roleRefs: job.roles,
        policyHookRefs: Object.freeze(
          job.policyHooks.entries.map((entry) => entry.key)
        ),
        publicCallableGraphFunctionRefs: contractTargetRefs,
        evidenceRefs: Object.freeze([
          "workspace://build_tenants/typescript/code/src/graph/module.ts"
        ])
      });
    })
  );
}

function roleBindingRows(module) {
  return Object.freeze(
    module.roles.map((role) => Object.freeze({
      roleRef: role.name,
      capabilityRefs: Object.freeze([
        `capability://odd-sdlc/role/${role.name}`
      ]),
      policyHookRefs: Object.freeze(
        role.policyHooks.entries.map((entry) => entry.key)
      ),
      evidenceRefs: Object.freeze([
        "workspace://build_tenants/typescript/code/src/graph/module.ts"
      ])
    }))
  );
}

function featureCoverageManifest(presentFeatureKinds) {
  return Object.freeze({
    kind: "gtl_program_feature_coverage_manifest",
    manifestRef: "feature-coverage://odd-sdlc/typescript/T-194",
    t153RequirementRef: "REQ-L-GTL3-CONTRACT-LAW-API",
    rows: Object.freeze(
      GTL_PROGRAM_T153_FEATURE_KINDS.map((featureKind) => {
        const disposition = presentFeatureKinds.has(featureKind)
          ? "present"
          : "not_used";
        return Object.freeze({
          featureKind,
          disposition,
          ownerClassification:
            GTL_PROGRAM_T153_FEATURE_OWNER_CLASSIFICATIONS[featureKind],
          requirementRefs: T153_REQUIREMENT_REFS,
          evidenceRefs: disposition === "present"
            ? Object.freeze([`workspace://odd-sdlc/typescript/T-194/${featureKind}`])
            : Object.freeze([]),
          reasonRefs: disposition === "not_used"
            ? Object.freeze([`reason://odd-sdlc/typescript/T-194/not-used/${featureKind}`])
            : Object.freeze([])
        });
      })
    )
  });
}

function graphFunctionTemplateRefStartsWith(graphFunction, prefix) {
  return graphFunction.template.ref.startsWith(prefix);
}

function graphFunctionNameStartsWith(graphFunction, prefix) {
  return graphFunction.name.startsWith(prefix);
}

function graphFunctionDeclarationHasKey(graphFunction, key) {
  return graphFunction.declarations.entries.some((entry) => entry.key === key);
}

function presentT153FeatureKinds(input) {
  const present = new Set([
    "graph_structure_interface",
    "graph_algebra_edge",
    "target_carrier_contract_law",
    "edge_closure_contract_law",
    "prompt_typed_asset_law",
    "module_publication",
    "public_start_binding",
    "active_source_identity"
  ]);
  const graphFunctions = input.module.graphFunctions;
  if (input.operatorDeclarations.length > 0) {
    present.add("operator_declarations");
  }
  if (input.evaluatorDeclarations.length > 0) {
    present.add("evaluator_declarations");
  }
  if (input.ruleDeclarations.length > 0) {
    present.add("rule_declarations");
  }
  if (input.computeCompositions.length > 0) {
    present.add("f_star_compute_composition");
  }
  if (input.hookBoundaries.length > 0) {
    present.add("hook_boundaries");
  }
  if (input.selectionBoundaries.length > 0) {
    present.add("selection_refinement_synthesis_subwork");
  }
  if (input.jobBindings.length > 0) {
    present.add("job_binding");
  }
  if (input.roleBindings.length > 0) {
    present.add("role_binding");
  }
  if (input.externalToolGates.length > 0) {
    present.add("external_tool_gates");
  }
  if (input.sameObjectProofs.length > 0) {
    present.add("graph_algebra_same_object");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionTemplateRefStartsWith(graphFunction, "compose:")
  )) {
    present.add("graph_algebra_compose");
  }
  if (input.module.graphs.some((graph) =>
    graph.tags.some((tag) => tag.startsWith("substituted:"))
  )) {
    present.add("graph_algebra_substitute");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionDeclarationHasKey(graphFunction, "recursion") ||
    graphFunctionNameStartsWith(graphFunction, "recurse(")
  )) {
    present.add("graph_algebra_recurse");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionNameStartsWith(graphFunction, "fan_out(")
  )) {
    present.add("graph_algebra_fan_out");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionNameStartsWith(graphFunction, "fan_in(")
  )) {
    present.add("graph_algebra_fan_in");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionDeclarationHasKey(graphFunction, "gate") ||
    graphFunctionNameStartsWith(graphFunction, "gate(")
  )) {
    present.add("graph_algebra_gate");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionTemplateRefStartsWith(graphFunction, "promote:") ||
    graphFunctionNameStartsWith(graphFunction, "promote(")
  )) {
    present.add("graph_algebra_promote");
  }
  if (graphFunctions.some((graphFunction) =>
    graphFunctionNameStartsWith(graphFunction, "identity:")
  )) {
    present.add("graph_algebra_identity");
  }
  return present;
}

function requireProductionTargetCarrierRow(registry, row) {
  const targetCarrierRow = registry.rowByEdgeRef[row.vector.name] ?? null;
  assert.notEqual(
    targetCarrierRow,
    null,
    `missing production target-carrier row for ${row.vector.name}`
  );
  assert.equal(
    targetCarrierRow.targetAssetType,
    row.vector.target.name,
    `target-carrier target mismatch for ${row.vector.name}`
  );
  return targetCarrierRow;
}

function requireProductionEdgeClosureContract(contractByEdgeRef, row) {
  const contract = contractByEdgeRef.get(row.vector.name) ?? null;
  assert.notEqual(
    contract,
    null,
    `missing production edge gain/closure contract for ${row.vector.name}`
  );
  assert.equal(
    contract.targetAssetType,
    row.vector.target.name,
    `edge gain/closure target mismatch for ${row.vector.name}`
  );
  return contract;
}

function programConformanceInput() {
  const catalog = constructSdlcGraphFunctionCatalog();
  const module = constructSdlcGtlModule();
  const catalogGraphFunctionRefs = Object.freeze([
    ...new Set([
      ...catalog.libraryFunctions.map((entry) => entry.name),
      ...catalog.functions.map((entry) => entry.backingGraphFunction),
      ...catalog.executives.map((entry) => entry.backingGraphFunction)
    ])
  ].sort());
  const vectorRows = materializedGraphVectorRows(module);
  const graphVectorCount = vectorRows.length;
  const overlayCatalog = constructSdlcTraversalOverlayCatalog({
    module,
    graphCatalog: catalog
  });
  const targetCarrierRegistry = constructSdlcTargetCarrierRegistry({ module });
  assert.deepEqual(
    targetCarrierRegistry.diagnostics,
    [],
    "production target-carrier registry must have zero diagnostics"
  );
  const productionVectorRefs = new Set(vectorRows.map((row) => row.vector.name));
  assert.equal(
    productionVectorRefs.size,
    targetCarrierRegistry.rows.length,
    "production target-carrier registry must cover every unique graph vector ref"
  );
  const contractByEdgeRef = new Map(
    SDLC_EDGE_GAIN_CLOSURE_CONTRACTS.map((contract) => [
      contract.edgeRef,
      contract
    ])
  );
  assert.equal(
    productionVectorRefs.size,
    contractByEdgeRef.size,
    "production edge gain/closure contracts must cover every unique graph vector ref"
  );
  const startTargets = publicSdlcOverlayStartTargets({
    module,
    catalog: overlayCatalog,
    projectConformanceStatus: null
  });
  const targetCarrierContracts = Object.freeze(
    vectorRows.map((row) => {
      const targetCarrierRow =
        requireProductionTargetCarrierRow(targetCarrierRegistry, row);
      return Object.freeze({
        edgeRef: row.vector.name,
        graphVectorRef: row.vector.name,
        graphFunctionId: row.graphFunction.id,
        graphId: row.graph.id,
        graphVectorId: row.vector.id,
        targetAssetType: row.vector.target.name,
        targetCarrierContractRef: targetCarrierRow.targetCarrierContractRef,
        targetCarrierContractDigest: targetCarrierRow.targetCarrierContractDigest,
        targetCarrierTemplateRef: targetCarrierRow.targetCarrierTemplateRef,
        outputSurfaceRef: targetCarrierRow.outputSurfaceRef,
        outputCarrierFamilyRef: targetCarrierRow.outputCarrierFamilyRef,
        outputCarrierKind: targetCarrierRow.outputCarrierKind,
        envelopeContractRef: targetCarrierRow.binding.envelopeContractRef,
        nestedPayloadPath: targetCarrierRow.nestedPayloadPath,
        requiredFieldRefs: targetCarrierRow.requiredFieldRefs,
        optionalFieldRefs: targetCarrierRow.optionalFieldRefs,
        fixedProtocolFieldRefs: targetCarrierRow.fixedProtocolFieldRefs,
        workerFillableFieldRefs: targetCarrierRow.workerFillableFieldRefs,
        literalDomainRefs: targetCarrierRow.literalDomainRefs,
        enumDomainRefs: targetCarrierRow.enumDomainRefs,
        schemaRef: targetCarrierRow.schemaRef,
        admissionRef: targetCarrierRow.admissionRef,
        payloadLedgerBindingRef: targetCarrierRow.payloadLedgerBindingRef,
        edgeAssuranceBindingRef: targetCarrierRow.edgeAssuranceBindingRef,
        handoffProjectionRef: targetCarrierRow.handoffProjectionRef,
        constructionTemplateRef: targetCarrierRow.constructionTemplateRef,
        replayDigestPolicyRef: targetCarrierRow.replayDigestPolicyRef,
        materializationPolicyRef: targetCarrierRow.materializationPolicyRef,
        closurePreconditionRef: targetCarrierRow.closurePreconditionRef
      });
    })
  );
  const edgeClosureContracts = Object.freeze(
    vectorRows.map((row) => {
      const contract = requireProductionEdgeClosureContract(contractByEdgeRef, row);
      return Object.freeze({
        edgeRef: contract.edgeRef,
        graphFunctionId: row.graphFunction.id,
        graphId: row.graph.id,
        graphVectorId: row.vector.id,
        targetAssetType: contract.targetAssetType
      });
    })
  );
  const overlays = Object.freeze(
    overlayCatalog.overlays.map((overlay) => Object.freeze({
      overlayRef: overlay.overlayRef,
      graphFunctionRefs: overlay.graphFunctionRefs,
      graphVectorRefs: overlay.graphVectorRefs,
      publicStartTargets: overlay.publicStartTargets,
      defaultStartTarget: overlay.defaultStartTarget
    }))
  );
  const publicStartTargets = Object.freeze(
    startTargets.map((target) => Object.freeze({
      name: target.name,
      graphFunctionRef: target.graphFunctionRef,
      overlayRefs: target.overlayRefs,
      defaultForOverlayRefs: target.defaultForOverlayRefs
    }))
  );
  const promptAssets = promptProjectionRows();
  const pluginContracts = Object.freeze([
    fpDispatchPluginContract(),
    fpEvaluatorPluginContract(),
    designDepthFpEvaluatorRuleContract(),
    reviewGradeEdgeFulfillmentRuleContract(),
    consequenceProjectionPluginContract()
  ]);
  const sourceIdentitySurfaces = activeSourceIdentitySurfaces();
  const sameObjectProofs = Object.freeze([]);
  const operatorDeclarations = operatorDeclarationRows(vectorRows);
  const evaluatorDeclarations = evaluatorDeclarationRows(vectorRows);
  const ruleDeclarations = ruleDeclarationRows(vectorRows);
  const computeCompositions = computeCompositionRows(vectorRows);
  const hookBoundaries = hookBoundaryRows(vectorRows);
  const selectionBoundaries = Object.freeze([]);
  const jobBindings = jobBindingRows(module);
  const roleBindings = roleBindingRows(module);
  const externalToolGates = Object.freeze([]);
  const presentFeatureKinds = presentT153FeatureKinds({
    module,
    sameObjectProofs,
    operatorDeclarations,
    evaluatorDeclarations,
    ruleDeclarations,
    computeCompositions,
    hookBoundaries,
    selectionBoundaries,
    jobBindings,
    roleBindings,
    externalToolGates
  });

  return Object.freeze({
    subjectRef: "workspace://odd-sdlc/typescript/T-194",
    abiPackageVersion: CURRENT_ABG_VERSION,
    expectedCoverage: Object.freeze({
      catalogGraphFunctionCount: catalogGraphFunctionRefs.length,
      publishedGraphFunctionCount: module.graphFunctions.length,
      graphVectorCount,
      targetCarrierContractCount: targetCarrierContracts.length,
      edgeClosureContractCount: edgeClosureContracts.length,
      overlayCount: overlays.length,
      publicStartTargetCount: publicStartTargets.length,
      promptAssetCount: promptAssets.length,
      pluginContractCount: pluginContracts.length,
      sourceIdentitySurfaceCount: sourceIdentitySurfaces.length
    }),
    featureCoverageManifest: featureCoverageManifest(presentFeatureKinds),
    catalogGraphFunctionRefs,
    modules: Object.freeze([module]),
    targetCarrierContracts,
    edgeClosureContracts,
    overlays,
    publicStartTargets,
    promptAssets,
    pluginContracts,
    sourceIdentitySurfaces,
    sameObjectProofs,
    operatorDeclarations,
    evaluatorDeclarations,
    ruleDeclarations,
    computeCompositions,
    hookBoundaries,
    selectionBoundaries,
    jobBindings,
    roleBindings,
    externalToolGates
  });
}

test("T-194 delegates graph prompt plugin typechecking to the ABG function", () => {
  const report = typecheckGtlProgram(programConformanceInput());

  assert(report.coverage.catalogGraphFunctionCount > 0);
  assert(report.coverage.publishedGraphFunctionCount > 0);
  assert(report.coverage.graphVectorCount > 0);
  assert.equal(
    report.coverage.graphVectorCount,
    report.coverage.targetCarrierContractCount,
    "each graph vector must have one target carrier row"
  );
  assert.equal(
    report.coverage.graphVectorCount,
    report.coverage.edgeClosureContractCount,
    "each graph vector must have one edge gain/closure contract"
  );
  assert.equal(report.coverage.promptAssetCount, 3);
  assert.equal(report.coverage.pluginContractCount, 5);
  assert(report.coverage.sourceIdentitySurfaceCount > 0);
});

test("T-194 every current TypeScript graph prompt plugin surface passes GTL program typecheck", () => {
  const report = typecheckGtlProgram(programConformanceInput());

  assert.equal(
    report.issueCount,
    0,
    `T-194 GTL program conformance issues:\n${formatGtlProgramConformanceIssues(report.issues)}`
  );
});

test("T-194 stale ABIogenesis active identity scan catches known old forms", () => {
  for (const sample of [
    "ABG `3.7.1-rc.1`",
    "runtime://abg/3.8/saga-frontier",
    "abg://3.8/event-sourced-saga-frontier",
    "@abiogenesis/typescript-tenant/3.8.0-rc.3"
  ]) {
    assert.match(sample, STALE_ABG_IDENTITY_PATTERN);
  }

  const staleRows = activeSourceIdentitySurfaces().filter((row) =>
    STALE_ABG_IDENTITY_PATTERN.test(row.text)
  );
  assert.deepEqual(
    staleRows.map((row) => row.surfaceRef),
    [],
    "active source/spec/design/test roots must not publish old ABIogenesis identity refs"
  );
});
