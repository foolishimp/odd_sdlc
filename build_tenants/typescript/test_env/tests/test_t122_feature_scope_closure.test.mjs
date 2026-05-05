// Validates: T-122

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  deriveDesignCompletenessAssuranceLedger,
  deriveSdlcFeatureScope,
  sdlcTraversalObligationInFeatureScope
} from "../../build/semantic/code/src/index.js";

const compilerAttribute = Object.freeze({
  kind: "sdlc_domain_attribute",
  attributeId: "attr:MappingPlan.planId",
  name: "planId",
  valueType: "String",
  cardinality: "one",
  invariantRefs: ["REQ-T122-001"]
});

const compilerEntity = Object.freeze({
  kind: "sdlc_domain_entity",
  entityId: "entity:MappingPlan",
  moduleName: "cdme-compiler",
  ownership: "owned",
  attributes: [compilerAttribute],
  invariants: ["planId is stable"],
  sourceAssetRefs: ["fixture://t122/compiler"]
});

const deferredEntityWithoutAttributes = Object.freeze({
  kind: "sdlc_domain_entity",
  entityId: "entity:DeferredJournal",
  moduleName: "cdme-accounting",
  ownership: "owned",
  attributes: [],
  invariants: [],
  sourceAssetRefs: ["fixture://t122/accounting"]
});

const compilerOperation = Object.freeze({
  kind: "sdlc_domain_operation",
  operationId: "operation:compileMappingPlan",
  moduleName: "cdme-compiler",
  inputEntityIds: ["entity:MappingPlan"],
  outputEntityIds: ["entity:MappingPlan"],
  requiredAttributeIds: ["attr:MappingPlan.planId"]
});

function axis(axisName, status = "satisfied", reasons = []) {
  return {
    kind: "sdlc_design_completeness_axis_verdict",
    axis: axisName,
    status,
    reasons,
    evidenceRefs: ["fixture://t122/verdict"]
  };
}

function verdict(overrides = {}) {
  return {
    kind: "sdlc_design_completeness_verdict",
    verdictVersion: "ts-design-depth-v1",
    entity: overrides.entity ?? axis("entity"),
    attribute: overrides.attribute ?? axis("attribute"),
    flow: overrides.flow ?? axis("flow")
  };
}

function steelThreadScope() {
  return {
    kind: "sdlc_feature_scope",
    scopeVersion: "ts-scope-v1",
    mode: "steel_thread",
    scopeRef: "scope://odd_sdlc/aggregate-domain-model-surface/steel-thread/cdme-compiler",
    basisRefs: ["strategy://odd_sdlc/derive_aggregate_domain_model_surface/single_vertical_slice"],
    includedModuleNames: ["cdme-compiler"],
    includedEntityIds: [],
    includedOperationIds: [],
    deferredModuleNames: ["cdme-accounting"]
  };
}

function fullBreadthScope() {
  return {
    ...steelThreadScope(),
    mode: "full_breadth",
    scopeRef: "scope://odd_sdlc/aggregate-domain-model-surface/full-breadth",
    includedModuleNames: ["cdme-accounting", "cdme-compiler"],
    deferredModuleNames: []
  };
}

function designDepthArtifact(register) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t122-"));
  const outputFile = path.join(root, `${register.targetAssetType}.md`);
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(
    outputFile,
    [
      `# ${register.targetAssetType}`,
      "",
      "```design_depth_register",
      JSON.stringify(register, null, 2),
      "```",
      ""
    ].join("\n"),
    "utf8"
  );
  return outputFile;
}

function moduleRegister({ includeCompilerDiagram }) {
  return {
    kind: "sdlc_design_depth_register",
    registerVersion: "ts-design-depth-v1",
    targetAssetType: "implementation_module_surface",
    moduleSchemaFragments: [
      {
        kind: "sdlc_module_schema_fragment",
        moduleName: "cdme-compiler",
        entities: [compilerEntity],
        operations: [compilerOperation],
        requirementIds: ["REQ-T122-001"],
        sourceAssetRefs: ["fixture://t122/compiler"]
      },
      {
        kind: "sdlc_module_schema_fragment",
        moduleName: "cdme-accounting",
        entities: [deferredEntityWithoutAttributes],
        operations: [],
        requirementIds: ["REQ-T122-002"],
        sourceAssetRefs: ["fixture://t122/accounting"]
      }
    ],
    moduleStateDiagramFragments: includeCompilerDiagram
      ? [
          {
            kind: "sdlc_module_state_diagram_fragment",
            moduleName: "cdme-compiler",
            entityId: "entity:MappingPlan",
            stateless: false,
            states: ["draft", "compiled"],
            transitions: [
              {
                kind: "sdlc_entity_state_transition",
                transitionId: "transition:MappingPlan.draft.compiled",
                fromState: "draft",
                toState: "compiled",
                operationId: "operation:compileMappingPlan",
                entityId: "entity:MappingPlan"
              }
            ],
            requirementIds: ["REQ-T122-001"],
            sourceAssetRefs: ["fixture://t122/compiler-state"]
          }
        ]
      : [],
    aggregateDomainModel: null,
    aggregateSunnyDaySequence: null,
    designCompletenessVerdict: null
  };
}

function aggregateRegister({ compilerAttributes = [compilerAttribute] } = {}) {
  return {
    kind: "sdlc_design_depth_register",
    registerVersion: "ts-design-depth-v1",
    targetAssetType: "aggregate_domain_model_surface",
    moduleSchemaFragments: [],
    moduleStateDiagramFragments: [],
    aggregateDomainModel: {
      kind: "sdlc_aggregate_domain_model",
      modelVersion: "ts-design-depth-v1",
      entities: [
        {
          kind: "sdlc_aggregate_domain_entity",
          entityId: "entity:MappingPlan",
          ownerModuleName: "cdme-compiler",
          attributes: compilerAttributes,
          sourceModuleNames: ["cdme-compiler"]
        },
        {
          kind: "sdlc_aggregate_domain_entity",
          entityId: "entity:DeferredJournal",
          ownerModuleName: "cdme-accounting",
          attributes: [],
          sourceModuleNames: ["cdme-accounting"]
        }
      ],
      operations: [compilerOperation],
      crossModuleReferences: [],
      evidenceRefs: ["fixture://t122/aggregate"]
    },
    aggregateSunnyDaySequence: null,
    designCompletenessVerdict: verdict({
      attribute: axis("attribute", "partial", [
        "cdme-accounting deferred module attributes incomplete"
      ])
    })
  };
}

function ledgerFor(register, featureScope) {
  const outputFile = designDepthArtifact(register);
  return deriveDesignCompletenessAssuranceLedger({
    manifest: {
      targetAssetType: register.targetAssetType,
      featureScope
    },
    report: { outputFile }
  });
}

test("T-122 derives a small steel-thread scope from strategy and declared modules", () => {
  const scope = deriveSdlcFeatureScope({
    targetAssetType: "aggregate_domain_model_surface",
    strategyDirectiveRef:
      "strategy://odd_sdlc/derive_aggregate_domain_model_surface/single_vertical_slice",
    selectedScheduleItemRefs: ["schedule://odd_sdlc/aggregate/primary"],
    requiredProgressArtifactRefs: [],
    declaredModuleNames: ["cdme-compiler", "cdme-accounting"],
    materializedEntityIds: ["entity:MappingPlan"],
    materializedOperationIds: ["operation:compileMappingPlan"]
  });
  assert.equal(scope.mode, "steel_thread");
  assert.deepStrictEqual(scope.includedModuleNames, ["cdme-compiler"]);
  assert.deepStrictEqual(scope.deferredModuleNames, ["cdme-accounting"]);
  assert.deepStrictEqual(scope.includedEntityIds, []);
  assert.deepStrictEqual(scope.includedOperationIds, []);
});

test("T-122 steel-thread scope does not block on deferred module diagrams", () => {
  const ledger = ledgerFor(
    moduleRegister({ includeCompilerDiagram: true }),
    steelThreadScope()
  );
  assert(ledger);
  assert.equal(ledger.verdict, "satisfied");
  assert.deepStrictEqual(ledger.carryForwardObligationRefs, [
    "module:cdme-accounting"
  ]);
});

test("T-122 steel-thread scope blocks on missing in-scope module diagram", () => {
  const ledger = ledgerFor(
    moduleRegister({ includeCompilerDiagram: false }),
    steelThreadScope()
  );
  assert(ledger);
  assert.equal(ledger.verdict, "open_gap");
  assert(
    ledger.reasons.some(
      (reason) =>
        reason.code === "design_state_diagram_missing_for_module:cdme-compiler"
    )
  );
});

test("T-122 steel-thread scope blocks on missing in-scope aggregate attributes", () => {
  const ledger = ledgerFor(
    aggregateRegister({ compilerAttributes: [] }),
    steelThreadScope()
  );
  assert(ledger);
  assert.equal(ledger.verdict, "open_gap");
  assert(
    ledger.reasons.some(
      (reason) => reason.code === "design_attribute_missing:entity:MappingPlan"
    )
  );
});

test("T-122 full-breadth scope still blocks on deferred breadth", () => {
  const ledger = ledgerFor(
    moduleRegister({ includeCompilerDiagram: true }),
    fullBreadthScope()
  );
  assert(ledger);
  assert.equal(ledger.verdict, "open_gap");
  assert(
    ledger.reasons.some(
      (reason) =>
        reason.code === "design_state_diagram_missing_for_module:cdme-accounting"
    )
  );
});

test("T-122 worker-authored verdict cannot force deferred breadth to block steel-thread closure", () => {
  const ledger = ledgerFor(aggregateRegister(), steelThreadScope());
  assert(ledger);
  assert.equal(ledger.verdict, "satisfied");
  assert(
    !ledger.reasons.some((reason) => reason.code.includes("cdme-accounting"))
  );
});

function obligation(obligationId, obligationKind, text) {
  return {
    kind: "sdlc_traversal_obligation",
    obligationId,
    obligationKind,
    summary: text,
    evidenceRefs: [`fixture://${obligationId}`],
    payload: {
      kind: "sdlc_traversal_obligation_payload",
      status: "concrete",
      sourceRefs: [`fixture://${obligationId}`],
      sourceDigests: ["sha256:t122"],
      sourceSnippets: [text],
      coverageExpectation: text
    }
  };
}

test("T-122 steel-thread pressure excludes deferred-module requirement obligations", () => {
  const scope = steelThreadScope();
  assert.equal(
    sdlcTraversalObligationInFeatureScope({
      featureScope: scope,
      obligation: obligation(
        "requirement:REQ-TYP-001",
        "requirement",
        "The compiler must compile a typed mapping plan from source declarations."
      )
    }),
    true
  );
  assert.equal(
    sdlcTraversalObligationInFeatureScope({
      featureScope: scope,
      obligation: obligation(
        "requirement:REQ-ADJ-001",
        "requirement",
        "The adjoint module must support reverse traversal reconciliation."
      )
    }),
    false
  );
  assert.equal(
    sdlcTraversalObligationInFeatureScope({
      featureScope: scope,
      obligation: obligation(
        "module:cdme-accounting",
        "design_or_module",
        "Preserve accounting module breadth."
      )
    }),
    false
  );
  assert.equal(
    sdlcTraversalObligationInFeatureScope({
      featureScope: scope,
      obligation: obligation(
        "target_asset:feature_decomp_surface",
        "target_asset",
        "Produce the current feature decomposition artifact."
      )
    }),
    true
  );
});
