// Implements: T-116
// Implements: T-121

import { existsSync, readFileSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  parseBoolean,
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import type {
  SdlcAggregateDomainEntity,
  SdlcAggregateDomainModel,
  SdlcAggregateSunnyDaySequence,
  SdlcDesignCompletenessAxisVerdict,
  SdlcDesignCompletenessVerdict,
  SdlcDesignDepthRegister,
  SdlcDesignDepthRegisterAdmission,
  SdlcDomainAttribute,
  SdlcDomainEntity,
  SdlcDomainOperation,
  SdlcEntityStateTransition,
  SdlcModuleSchemaFragment,
  SdlcModuleStateDiagramFragment,
  SdlcSunnyDaySequenceStep
} from "./carriers.js";
import {
  SDLC_DESIGN_COMPLETENESS_AXES,
  SDLC_DESIGN_COMPLETENESS_STATUSES,
  SDLC_DOMAIN_ATTRIBUTE_CARDINALITIES,
  SDLC_DOMAIN_ENTITY_OWNERSHIP
} from "./carriers.js";

const DESIGN_DEPTH_TARGETS = Object.freeze([
  "implementation_module_surface",
  "aggregate_domain_model_surface",
  "aggregate_sunny_day_sequence_surface"
] as const);

type DesignDepthTarget = (typeof DESIGN_DEPTH_TARGETS)[number];

function isDesignDepthTarget(
  targetAssetType: string
): targetAssetType is DesignDepthTarget {
  return DESIGN_DEPTH_TARGETS.includes(targetAssetType as DesignDepthTarget);
}

function parseArray<T>(
  input: unknown,
  label: string,
  parseItem: (item: unknown, itemLabel: string) => T
): readonly T[] {
  if (input === undefined) {
    return Object.freeze([]);
  }
  if (!Array.isArray(input)) {
    throw new TypeError(`${label}: expected array`);
  }
  return Object.freeze(
    input.map((item, index) => parseItem(item, `${label}[${index}]`))
  );
}

function parseAttribute(input: unknown, label: string): SdlcDomainAttribute {
  const record = parseClosedRecord(input, label, [
    "kind",
    "attributeId",
    "name",
    "valueType",
    "cardinality",
    "invariantRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_domain_attribute") {
    throw new TypeError(`${label}.kind: unexpected attribute kind`);
  }
  return Object.freeze({
    kind: "sdlc_domain_attribute" as const,
    attributeId: parseNonEmptyString(record["attributeId"], `${label}.attributeId`),
    name: parseNonEmptyString(record["name"], `${label}.name`),
    valueType: parseNonEmptyString(record["valueType"], `${label}.valueType`),
    cardinality: parseEnumValue(
      record["cardinality"],
      `${label}.cardinality`,
      SDLC_DOMAIN_ATTRIBUTE_CARDINALITIES
    ),
    invariantRefs: parseStringList(record["invariantRefs"], `${label}.invariantRefs`)
  });
}

function parseEntity(input: unknown, label: string): SdlcDomainEntity {
  const record = parseClosedRecord(input, label, [
    "kind",
    "entityId",
    "moduleName",
    "ownership",
    "attributes",
    "invariants",
    "sourceAssetRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_domain_entity") {
    throw new TypeError(`${label}.kind: unexpected entity kind`);
  }
  return Object.freeze({
    kind: "sdlc_domain_entity" as const,
    entityId: parseNonEmptyString(record["entityId"], `${label}.entityId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    ownership: parseEnumValue(
      record["ownership"],
      `${label}.ownership`,
      SDLC_DOMAIN_ENTITY_OWNERSHIP
    ),
    attributes: parseArray(record["attributes"], `${label}.attributes`, parseAttribute),
    invariants: parseStringList(record["invariants"], `${label}.invariants`),
    sourceAssetRefs: parseStringList(record["sourceAssetRefs"], `${label}.sourceAssetRefs`)
  });
}

function parseOperation(input: unknown, label: string): SdlcDomainOperation {
  const record = parseClosedRecord(input, label, [
    "kind",
    "operationId",
    "moduleName",
    "inputEntityIds",
    "outputEntityIds",
    "requiredAttributeIds"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_domain_operation") {
    throw new TypeError(`${label}.kind: unexpected operation kind`);
  }
  return Object.freeze({
    kind: "sdlc_domain_operation" as const,
    operationId: parseNonEmptyString(record["operationId"], `${label}.operationId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    inputEntityIds: parseStringList(record["inputEntityIds"], `${label}.inputEntityIds`),
    outputEntityIds: parseStringList(record["outputEntityIds"], `${label}.outputEntityIds`),
    requiredAttributeIds: parseStringList(
      record["requiredAttributeIds"],
      `${label}.requiredAttributeIds`
    )
  });
}

function parseModuleSchemaFragment(
  input: unknown,
  label: string
): SdlcModuleSchemaFragment {
  const record = parseClosedRecord(input, label, [
    "kind",
    "moduleName",
    "entities",
    "operations",
    "requirementIds",
    "sourceAssetRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_module_schema_fragment") {
    throw new TypeError(`${label}.kind: unexpected schema fragment kind`);
  }
  return Object.freeze({
    kind: "sdlc_module_schema_fragment" as const,
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    entities: parseArray(record["entities"], `${label}.entities`, parseEntity),
    operations: parseArray(record["operations"], `${label}.operations`, parseOperation),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    sourceAssetRefs: parseStringList(record["sourceAssetRefs"], `${label}.sourceAssetRefs`)
  });
}

function parseTransition(input: unknown, label: string): SdlcEntityStateTransition {
  const record = parseClosedRecord(input, label, [
    "kind",
    "transitionId",
    "fromState",
    "toState",
    "operationId",
    "entityId"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_entity_state_transition") {
    throw new TypeError(`${label}.kind: unexpected transition kind`);
  }
  return Object.freeze({
    kind: "sdlc_entity_state_transition" as const,
    transitionId: parseNonEmptyString(record["transitionId"], `${label}.transitionId`),
    fromState: parseNonEmptyString(record["fromState"], `${label}.fromState`),
    toState: parseNonEmptyString(record["toState"], `${label}.toState`),
    operationId: parseNonEmptyString(record["operationId"], `${label}.operationId`),
    entityId: parseNonEmptyString(record["entityId"], `${label}.entityId`)
  });
}

function parseStateDiagramFragment(
  input: unknown,
  label: string
): SdlcModuleStateDiagramFragment {
  const record = parseClosedRecord(input, label, [
    "kind",
    "moduleName",
    "entityId",
    "stateless",
    "states",
    "transitions",
    "requirementIds",
    "sourceAssetRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_module_state_diagram_fragment") {
    throw new TypeError(`${label}.kind: unexpected state diagram fragment kind`);
  }
  return Object.freeze({
    kind: "sdlc_module_state_diagram_fragment" as const,
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    entityId: parseNonEmptyString(record["entityId"], `${label}.entityId`),
    stateless: parseBoolean(record["stateless"], `${label}.stateless`),
    states: parseStringList(record["states"], `${label}.states`),
    transitions: parseArray(record["transitions"], `${label}.transitions`, parseTransition),
    requirementIds: parseStringList(record["requirementIds"], `${label}.requirementIds`),
    sourceAssetRefs: parseStringList(record["sourceAssetRefs"], `${label}.sourceAssetRefs`)
  });
}

function parseAggregateEntity(
  input: unknown,
  label: string
): SdlcAggregateDomainEntity {
  const record = parseClosedRecord(input, label, [
    "kind",
    "entityId",
    "ownerModuleName",
    "attributes",
    "sourceModuleNames"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_aggregate_domain_entity") {
    throw new TypeError(`${label}.kind: unexpected aggregate entity kind`);
  }
  return Object.freeze({
    kind: "sdlc_aggregate_domain_entity" as const,
    entityId: parseNonEmptyString(record["entityId"], `${label}.entityId`),
    ownerModuleName: parseNonEmptyString(
      record["ownerModuleName"],
      `${label}.ownerModuleName`
    ),
    attributes: parseArray(record["attributes"], `${label}.attributes`, parseAttribute),
    sourceModuleNames: parseStringList(
      record["sourceModuleNames"],
      `${label}.sourceModuleNames`
    )
  });
}

function parseCrossModuleReference(
  input: unknown,
  label: string
): SdlcAggregateDomainModel["crossModuleReferences"][number] {
  const record = parseClosedRecord(input, label, [
    "fromModuleName",
    "toModuleName",
    "entityId"
  ]);
  return Object.freeze({
    fromModuleName: parseNonEmptyString(record["fromModuleName"], `${label}.fromModuleName`),
    toModuleName: parseNonEmptyString(record["toModuleName"], `${label}.toModuleName`),
    entityId: parseNonEmptyString(record["entityId"], `${label}.entityId`)
  });
}

function parseAggregateDomainModel(
  input: unknown,
  label: string
): SdlcAggregateDomainModel | null {
  if (input === null || input === undefined) {
    return null;
  }
  const record = parseClosedRecord(input, label, [
    "kind",
    "modelVersion",
    "entities",
    "operations",
    "crossModuleReferences",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_aggregate_domain_model") {
    throw new TypeError(`${label}.kind: unexpected aggregate model kind`);
  }
  const modelVersion = parseNonEmptyString(record["modelVersion"], `${label}.modelVersion`);
  if (modelVersion !== "ts-design-depth-v1") {
    throw new TypeError(`${label}.modelVersion: unsupported version`);
  }
  return Object.freeze({
    kind: "sdlc_aggregate_domain_model" as const,
    modelVersion: "ts-design-depth-v1" as const,
    entities: parseArray(record["entities"], `${label}.entities`, parseAggregateEntity),
    operations: parseArray(record["operations"], `${label}.operations`, parseOperation),
    crossModuleReferences: parseArray(
      record["crossModuleReferences"],
      `${label}.crossModuleReferences`,
      parseCrossModuleReference
    ),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseSequenceStep(input: unknown, label: string): SdlcSunnyDaySequenceStep {
  const record = parseClosedRecord(input, label, [
    "kind",
    "stepId",
    "moduleName",
    "operationId",
    "inputEntityIds",
    "outputEntityIds",
    "stateTransitionIds"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_sunny_day_sequence_step") {
    throw new TypeError(`${label}.kind: unexpected sequence step kind`);
  }
  return Object.freeze({
    kind: "sdlc_sunny_day_sequence_step" as const,
    stepId: parseNonEmptyString(record["stepId"], `${label}.stepId`),
    moduleName: parseNonEmptyString(record["moduleName"], `${label}.moduleName`),
    operationId: parseNonEmptyString(record["operationId"], `${label}.operationId`),
    inputEntityIds: parseStringList(record["inputEntityIds"], `${label}.inputEntityIds`),
    outputEntityIds: parseStringList(record["outputEntityIds"], `${label}.outputEntityIds`),
    stateTransitionIds: parseStringList(
      record["stateTransitionIds"],
      `${label}.stateTransitionIds`
    )
  });
}

function parseSunnyDaySequence(
  input: unknown,
  label: string
): SdlcAggregateSunnyDaySequence | null {
  if (input === null || input === undefined) {
    return null;
  }
  const record = parseClosedRecord(input, label, [
    "kind",
    "sequenceVersion",
    "steps",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_aggregate_sunny_day_sequence") {
    throw new TypeError(`${label}.kind: unexpected sunny-day sequence kind`);
  }
  const sequenceVersion = parseNonEmptyString(
    record["sequenceVersion"],
    `${label}.sequenceVersion`
  );
  if (sequenceVersion !== "ts-design-depth-v1") {
    throw new TypeError(`${label}.sequenceVersion: unsupported version`);
  }
  return Object.freeze({
    kind: "sdlc_aggregate_sunny_day_sequence" as const,
    sequenceVersion: "ts-design-depth-v1" as const,
    steps: parseArray(record["steps"], `${label}.steps`, parseSequenceStep),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseAxisVerdict(
  input: unknown,
  label: string
): SdlcDesignCompletenessAxisVerdict {
  const record = parseClosedRecord(input, label, [
    "kind",
    "axis",
    "status",
    "reasons",
    "evidenceRefs"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_design_completeness_axis_verdict") {
    throw new TypeError(`${label}.kind: unexpected axis verdict kind`);
  }
  return Object.freeze({
    kind: "sdlc_design_completeness_axis_verdict" as const,
    axis: parseEnumValue(record["axis"], `${label}.axis`, SDLC_DESIGN_COMPLETENESS_AXES),
    status: parseEnumValue(
      record["status"],
      `${label}.status`,
      SDLC_DESIGN_COMPLETENESS_STATUSES
    ),
    reasons: parseStringList(record["reasons"], `${label}.reasons`),
    evidenceRefs: parseStringList(record["evidenceRefs"], `${label}.evidenceRefs`)
  });
}

function parseCompletenessVerdict(
  input: unknown,
  label: string
): SdlcDesignCompletenessVerdict | null {
  if (input === null || input === undefined) {
    return null;
  }
  const record = parseClosedRecord(input, label, [
    "kind",
    "verdictVersion",
    "entity",
    "attribute",
    "flow"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_design_completeness_verdict") {
    throw new TypeError(`${label}.kind: unexpected completeness verdict kind`);
  }
  const verdictVersion = parseNonEmptyString(
    record["verdictVersion"],
    `${label}.verdictVersion`
  );
  if (verdictVersion !== "ts-design-depth-v1") {
    throw new TypeError(`${label}.verdictVersion: unsupported version`);
  }
  return Object.freeze({
    kind: "sdlc_design_completeness_verdict" as const,
    verdictVersion: "ts-design-depth-v1" as const,
    entity: parseAxisVerdict(record["entity"], `${label}.entity`),
    attribute: parseAxisVerdict(record["attribute"], `${label}.attribute`),
    flow: parseAxisVerdict(record["flow"], `${label}.flow`)
  });
}

function parseRegister(input: unknown, label: string): SdlcDesignDepthRegister {
  const record = parseClosedRecord(input, label, [
    "kind",
    "registerVersion",
    "targetAssetType",
    "moduleSchemaFragments",
    "moduleStateDiagramFragments",
    "aggregateDomainModel",
    "aggregateSunnyDaySequence",
    "designCompletenessVerdict"
  ]);
  const kind = parseNonEmptyString(record["kind"], `${label}.kind`);
  if (kind !== "sdlc_design_depth_register") {
    throw new TypeError(`${label}.kind: unexpected register kind`);
  }
  const registerVersion = parseNonEmptyString(
    record["registerVersion"],
    `${label}.registerVersion`
  );
  if (registerVersion !== "ts-design-depth-v1") {
    throw new TypeError(`${label}.registerVersion: unsupported version`);
  }
  return Object.freeze({
    kind: "sdlc_design_depth_register" as const,
    registerVersion: "ts-design-depth-v1" as const,
    targetAssetType: parseNonEmptyString(record["targetAssetType"], `${label}.targetAssetType`),
    moduleSchemaFragments: parseArray(
      record["moduleSchemaFragments"],
      `${label}.moduleSchemaFragments`,
      parseModuleSchemaFragment
    ),
    moduleStateDiagramFragments: parseArray(
      record["moduleStateDiagramFragments"],
      `${label}.moduleStateDiagramFragments`,
      parseStateDiagramFragment
    ),
    aggregateDomainModel: parseAggregateDomainModel(
      record["aggregateDomainModel"],
      `${label}.aggregateDomainModel`
    ),
    aggregateSunnyDaySequence: parseSunnyDaySequence(
      record["aggregateSunnyDaySequence"],
      `${label}.aggregateSunnyDaySequence`
    ),
    designCompletenessVerdict: parseCompletenessVerdict(
      record["designCompletenessVerdict"],
      `${label}.designCompletenessVerdict`
    )
  });
}

function objectRecord(input: unknown): Record<string, unknown> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  return Object.fromEntries(Object.entries(input));
}

function normalizeCandidate(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  if (record["kind"] === "sdlc_design_depth_register") {
    return input;
  }
  if (record["design_depth_register"] !== undefined) {
    return record["design_depth_register"];
  }
  if (record["designDepthRegister"] !== undefined) {
    return record["designDepthRegister"];
  }
  return input;
}

function jsonCandidates(content: string): readonly unknown[] {
  const candidates: unknown[] = [];
  try {
    candidates.push(JSON.parse(content));
  } catch {
    // Whole artifact is usually markdown; fenced JSON below is canonical.
  }
  const fencedBlockExpression =
    /```(?:json|design_depth_register|designDepthRegister)?\s*\n([\s\S]*?)```/gu;
  for (const match of content.matchAll(fencedBlockExpression)) {
    const block = match[1]?.trim() ?? "";
    try {
      candidates.push(JSON.parse(block));
    } catch {
      // Invalid JSON blocks are reported only if no later candidate admits.
    }
  }
  return Object.freeze(candidates);
}

function requiredContentPresent(input: {
  readonly targetAssetType: DesignDepthTarget;
  readonly register: SdlcDesignDepthRegister;
}): readonly string[] {
  switch (input.targetAssetType) {
    case "implementation_module_surface":
      return Object.freeze([
        ...(input.register.moduleSchemaFragments.length > 0
          ? []
          : ["design_depth_module_schema_fragments_missing"]),
        ...(input.register.moduleStateDiagramFragments.length > 0
          ? []
          : ["design_depth_module_state_diagram_fragments_missing"])
      ]);
    case "aggregate_domain_model_surface":
      return Object.freeze([
        ...(input.register.aggregateDomainModel === null
          ? ["design_depth_aggregate_domain_model_missing"]
          : []),
        ...(input.register.designCompletenessVerdict === null
          ? ["design_depth_completeness_verdict_missing"]
          : [])
      ]);
    case "aggregate_sunny_day_sequence_surface":
      return Object.freeze([
        ...(input.register.aggregateDomainModel === null
          ? ["design_depth_aggregate_domain_model_missing"]
          : []),
        ...(input.register.aggregateSunnyDaySequence === null
          ? ["design_depth_aggregate_sunny_day_sequence_missing"]
          : []),
        ...(input.register.designCompletenessVerdict === null
          ? ["design_depth_completeness_verdict_missing"]
          : [])
      ]);
    default: {
      const exhaustive: never = input.targetAssetType;
      throw new TypeError(`Unsupported design-depth target ${exhaustive}`);
    }
  }
}

export function admitDesignDepthRegisterFromArtifact(input: {
  readonly targetAssetType: string;
  readonly outputFile: string;
}): SdlcDesignDepthRegisterAdmission {
  const evidenceRefs = Object.freeze([pathToFileURL(input.outputFile).href]);
  if (!isDesignDepthTarget(input.targetAssetType)) {
    return Object.freeze({
      kind: "sdlc_design_depth_register_admission" as const,
      status: "not_required" as const,
      targetAssetType: input.targetAssetType,
      register: null,
      blockingReasons: Object.freeze([]),
      evidenceRefs
    });
  }
  if (!existsSync(input.outputFile) || !statSync(input.outputFile).isFile()) {
    return Object.freeze({
      kind: "sdlc_design_depth_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: input.targetAssetType,
      register: null,
      blockingReasons: Object.freeze(["design_depth_output_missing"]),
      evidenceRefs
    });
  }
  const content = readFileSync(input.outputFile, "utf8");
  const errors: string[] = [];
  for (const candidate of jsonCandidates(content)) {
    try {
      const register = parseRegister(normalizeCandidate(candidate), "design_depth_register");
      if (register.targetAssetType !== input.targetAssetType) {
        errors.push(`design_depth_register_target_mismatch:${register.targetAssetType}`);
        continue;
      }
      const rowReasons = requiredContentPresent({
        targetAssetType: input.targetAssetType,
        register
      });
      if (rowReasons.length > 0) {
        return Object.freeze({
          kind: "sdlc_design_depth_register_admission" as const,
          status: "rejected" as const,
          targetAssetType: input.targetAssetType,
          register,
          blockingReasons: rowReasons,
          evidenceRefs
        });
      }
      return Object.freeze({
        kind: "sdlc_design_depth_register_admission" as const,
        status: "admitted" as const,
        targetAssetType: input.targetAssetType,
        register,
        blockingReasons: Object.freeze([]),
        evidenceRefs
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return Object.freeze({
    kind: "sdlc_design_depth_register_admission" as const,
    status: "rejected" as const,
    targetAssetType: input.targetAssetType,
    register: null,
    blockingReasons: Object.freeze(
      errors.length === 0
        ? ["design_depth_register_missing"]
        : [`design_depth_register_invalid:${errors.join("; ")}`]
    ),
    evidenceRefs
  });
}
