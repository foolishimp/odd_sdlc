// Validates: T-116
// Validates: T-121

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
  BOOTSTRAP_RELEASE_FUNCTION_CATALOG,
  admitDesignDepthRegisterFromArtifact,
  deriveDesignCompletenessAssuranceLedger,
  hookContractByEdgeName
} from "../../build/semantic/code/src/index.js";

const attribute = Object.freeze({
  kind: "sdlc_domain_attribute",
  attributeId: "attr:MappingPlan.planId",
  name: "planId",
  valueType: "String",
  cardinality: "one",
  invariantRefs: ["REQ-T116-001"]
});

const entity = Object.freeze({
  kind: "sdlc_domain_entity",
  entityId: "entity:MappingPlan",
  moduleName: "cdme-compiler",
  ownership: "owned",
  attributes: [attribute],
  invariants: ["planId is stable for one compiled mapping"],
  sourceAssetRefs: ["fixture://t116/module-schema"]
});

const operation = Object.freeze({
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
    evidenceRefs: ["fixture://t116/verdict"]
  };
}

function satisfiedVerdict() {
  return {
    kind: "sdlc_design_completeness_verdict",
    verdictVersion: "ts-design-depth-v1",
    entity: axis("entity"),
    attribute: axis("attribute"),
    flow: axis("flow")
  };
}

function aggregateDomainModel(entities = [
  {
    kind: "sdlc_aggregate_domain_entity",
    entityId: entity.entityId,
    ownerModuleName: entity.moduleName,
    attributes: entity.attributes,
    sourceModuleNames: [entity.moduleName]
  }
]) {
  return {
    kind: "sdlc_aggregate_domain_model",
    modelVersion: "ts-design-depth-v1",
    entities,
    operations: [operation],
    crossModuleReferences: [],
    evidenceRefs: ["fixture://t116/aggregate-domain-model"]
  };
}

function sunnyDaySequence() {
  return {
    kind: "sdlc_aggregate_sunny_day_sequence",
    sequenceVersion: "ts-design-depth-v1",
    steps: [
      {
        kind: "sdlc_sunny_day_sequence_step",
        stepId: "step:compileMappingPlan",
        moduleName: "cdme-compiler",
        operationId: operation.operationId,
        inputEntityIds: [entity.entityId],
        outputEntityIds: [entity.entityId],
        stateTransitionIds: ["transition:MappingPlan.draft.compiled"]
      }
    ],
    evidenceRefs: ["fixture://t116/sunny-day-sequence"]
  };
}

function moduleRegister() {
  return {
    kind: "sdlc_design_depth_register",
    registerVersion: "ts-design-depth-v1",
    targetAssetType: "implementation_module_surface",
    moduleSchemaFragments: [
      {
        kind: "sdlc_module_schema_fragment",
        moduleName: "cdme-compiler",
        entities: [entity],
        operations: [operation],
        requirementIds: ["REQ-T116-001"],
        sourceAssetRefs: ["fixture://t116/module-schema"]
      }
    ],
    moduleStateDiagramFragments: [
      {
        kind: "sdlc_module_state_diagram_fragment",
        moduleName: "cdme-compiler",
        entityId: entity.entityId,
        stateless: false,
        states: ["draft", "compiled"],
        transitions: [
          {
            kind: "sdlc_entity_state_transition",
            transitionId: "transition:MappingPlan.draft.compiled",
            fromState: "draft",
            toState: "compiled",
            operationId: operation.operationId,
            entityId: entity.entityId
          }
        ],
        requirementIds: ["REQ-T116-001"],
        sourceAssetRefs: ["fixture://t116/state-diagram"]
      }
    ],
    aggregateDomainModel: null,
    aggregateSunnyDaySequence: null,
    designCompletenessVerdict: null
  };
}

function aggregateDomainRegister(model = aggregateDomainModel(), verdict = satisfiedVerdict()) {
  return {
    kind: "sdlc_design_depth_register",
    registerVersion: "ts-design-depth-v1",
    targetAssetType: "aggregate_domain_model_surface",
    moduleSchemaFragments: [],
    moduleStateDiagramFragments: [],
    aggregateDomainModel: model,
    aggregateSunnyDaySequence: null,
    designCompletenessVerdict: verdict
  };
}

function sunnyDayRegister(sequence = sunnyDaySequence(), verdict = satisfiedVerdict()) {
  return {
    kind: "sdlc_design_depth_register",
    registerVersion: "ts-design-depth-v1",
    targetAssetType: "aggregate_sunny_day_sequence_surface",
    moduleSchemaFragments: [],
    moduleStateDiagramFragments: [],
    aggregateDomainModel: aggregateDomainModel(),
    aggregateSunnyDaySequence: sequence,
    designCompletenessVerdict: verdict
  };
}

function writeArtifact(targetAssetType, register) {
  const root = mkdtempSync(path.join(tmpdir(), "odd-sdlc-t116-"));
  const outputFile = path.join(root, `${targetAssetType}.md`);
  const content = [
    `# ${targetAssetType}`,
    "",
    "```design_depth_register",
    JSON.stringify(register, null, 2),
    "```",
    ""
  ].join("\n");
  mkdirSync(path.dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, content, "utf8");
  return outputFile;
}

function ledgerFor(targetAssetType, register) {
  const outputFile = writeArtifact(targetAssetType, register);
  const admission = admitDesignDepthRegisterFromArtifact({
    targetAssetType,
    outputFile
  });
  const ledger = deriveDesignCompletenessAssuranceLedger({
    manifest: { targetAssetType },
    report: { outputFile }
  });
  return { admission, ledger };
}

test("T-116 publishes aggregate design edges before realization scheduling", () => {
  const names = BOOTSTRAP_RELEASE_FUNCTION_CATALOG.map((entry) => entry.name);
  assert(
    names.indexOf("derive_implementation_module_surface") <
      names.indexOf("derive_aggregate_domain_model_surface")
  );
  assert(
    names.indexOf("derive_aggregate_domain_model_surface") <
      names.indexOf("derive_implementation_component_topology_surface")
  );
  assert(
    names.indexOf("derive_implementation_component_topology_surface") <
      names.indexOf("derive_aggregate_sunny_day_sequence_surface")
  );
  assert(
    names.indexOf("derive_aggregate_sunny_day_sequence_surface") <
      names.indexOf("derive_component_realization_schedule_surface")
  );
  assert(
    hookContractByEdgeName("derive_component_realization_schedule_surface")
      .sourceAssetTypes.includes("aggregate_domain_model_surface")
  );
  assert(
    hookContractByEdgeName("derive_component_realization_schedule_surface")
      .sourceAssetTypes.includes("aggregate_sunny_day_sequence_surface")
  );
  assert(
    hookContractByEdgeName("derive_test_schedule_surface")
      .sourceAssetTypes.includes("aggregate_sunny_day_sequence_surface")
  );
});

test("T-116 admits the steel-thread module schema and state diagram", () => {
  const { admission, ledger } = ledgerFor(
    "implementation_module_surface",
    moduleRegister()
  );
  assert.equal(admission.status, "admitted");
  assert.equal(admission.register.moduleSchemaFragments.length, 1);
  assert.equal(admission.register.moduleStateDiagramFragments.length, 1);
  assert(ledger);
  assert.equal(ledger.verdict, "satisfied");
});

test("T-116 admits aggregate domain model and sunny-day sequence steel thread", () => {
  const aggregate = ledgerFor(
    "aggregate_domain_model_surface",
    aggregateDomainRegister()
  );
  assert.equal(aggregate.admission.status, "admitted");
  assert(aggregate.ledger);
  assert.equal(aggregate.ledger.verdict, "satisfied");

  const sequence = ledgerFor(
    "aggregate_sunny_day_sequence_surface",
    sunnyDayRegister()
  );
  assert.equal(sequence.admission.status, "admitted");
  assert(sequence.ledger);
  assert.equal(sequence.ledger.verdict, "satisfied");
});

test("T-116 aggregate domain model does not retry for downstream sunny-day flow", () => {
  const downstreamOwnedFlowVerdict = {
    ...satisfiedVerdict(),
    flow: axis("flow", "partial", [
      "Sunny-day sequence projection is owned by downstream derive_aggregate_sunny_day_sequence_surface."
    ])
  };
  const { admission, ledger } = ledgerFor(
    "aggregate_domain_model_surface",
    aggregateDomainRegister(aggregateDomainModel(), downstreamOwnedFlowVerdict)
  );

  assert.equal(admission.status, "admitted");
  assert(ledger);
  assert.equal(ledger.verdict, "satisfied");
  assert.equal(
    ledger.reasons.some((reason) =>
      reason.code === "design_completeness_flow_partial"
    ),
    false
  );
});

test("T-116 blocks design completeness when an aggregate entity omits attributes", () => {
  const missingAttributeEntity = {
    kind: "sdlc_aggregate_domain_entity",
    entityId: entity.entityId,
    ownerModuleName: entity.moduleName,
    attributes: [],
    sourceModuleNames: [entity.moduleName]
  };
  const { admission, ledger } = ledgerFor(
    "aggregate_domain_model_surface",
    aggregateDomainRegister(aggregateDomainModel([missingAttributeEntity]))
  );
  assert.equal(admission.status, "admitted");
  assert(ledger);
  assert.equal(ledger.verdict, "open_gap");
  assert(
    ledger.reasons.some((reason) =>
      reason.code === `design_attribute_missing:${entity.entityId}`
    )
  );
});

test("T-116 blocks flow completeness when the sequence skips a published operation", () => {
  const badSequence = {
    ...sunnyDaySequence(),
    steps: [
      {
        ...sunnyDaySequence().steps[0],
        operationId: "operation:missing"
      }
    ]
  };
  const { admission, ledger } = ledgerFor(
    "aggregate_sunny_day_sequence_surface",
    sunnyDayRegister(badSequence)
  );
  assert.equal(admission.status, "admitted");
  assert(ledger);
  assert.equal(ledger.verdict, "open_gap");
  assert(
    ledger.reasons.some((reason) =>
      reason.code === "design_flow_operation_missing:operation:missing"
    )
  );
});
