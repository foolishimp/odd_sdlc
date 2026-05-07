// Implements: T-116
// Implements: T-121
// Implements: B-084

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
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
  return DESIGN_DEPTH_TARGETS.some((target) => target === targetAssetType);
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

function mutableRecord(input: unknown): Record<string, unknown> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  return Object.fromEntries(Object.entries(input));
}

function optionalString(input: unknown): string | null {
  return typeof input === "string" && input.length > 0 ? input : null;
}

function stringFromRecord(
  record: Readonly<Record<string, unknown>>,
  keys: readonly string[]
): string | null {
  for (const key of keys) {
    const value = optionalString(record[key]);
    if (value !== null) {
      return value;
    }
  }
  return null;
}

function slugPart(input: string): string {
  return input
    .trim()
    .replace(/[^A-Za-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .toLowerCase() || "unnamed";
}

function canonicalOperationId(input: string): string {
  return input.startsWith("operation:") ? input : `operation:${slugPart(input)}`;
}

function moduleScopedOperationId(input: {
  readonly moduleName: string;
  readonly operationId: string;
}): string {
  return input.operationId.startsWith("operation:")
    ? input.operationId
    : `operation:${slugPart(input.moduleName)}.${slugPart(input.operationId)}`;
}

function attributeNameFromId(attributeId: string): string {
  const withoutScheme = attributeId.startsWith("attr:")
    ? attributeId.slice("attr:".length)
    : attributeId;
  return withoutScheme.split(".").filter((part) => part.length > 0).at(-1) ??
    withoutScheme;
}

function normalizeAttributeCandidate(input: {
  readonly moduleName: string;
  readonly entityName: string;
  readonly candidate: unknown;
}): unknown {
  const record = mutableRecord(input.candidate);
  if (record === null) {
    return input.candidate;
  }
  if (record["kind"] === "sdlc_domain_attribute") {
    const cardinality = optionalString(record["cardinality"]);
    if (cardinality === null) {
      return input.candidate;
    }
    const normalizedCardinality = normalizeAttributeCardinalityCandidate(cardinality);
    return normalizedCardinality === cardinality
      ? input.candidate
      : Object.freeze({
          ...record,
          cardinality: normalizedCardinality
        });
  }
  const explicitAttributeId = stringFromRecord(record, ["attributeId", "id"]);
  const name =
    stringFromRecord(record, ["name", "attribute", "attributeName"]) ??
    (explicitAttributeId === null ? null : attributeNameFromId(explicitAttributeId));
  const valueType = stringFromRecord(record, ["valueType", "type", "baseType"]);
  if (name === null || valueType === null) {
    return input.candidate;
  }
  const attributeId =
    explicitAttributeId ??
    `attr:${slugPart(input.moduleName)}.${slugPart(input.entityName)}.${slugPart(name)}`;
  const cardinality = normalizeAttributeCardinalityCandidate(
    optionalString(record["cardinality"]) ?? "one"
  );
  const invariantRefs = Array.isArray(record["invariantRefs"])
    ? record["invariantRefs"]
    : Array.isArray(record["requirementRefs"])
      ? record["requirementRefs"]
      : [];
  return Object.freeze({
    kind: "sdlc_domain_attribute" as const,
    attributeId,
    name,
    valueType,
    cardinality,
    invariantRefs
  });
}

function normalizeAttributeCardinalityCandidate(
  input: string
): string {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/\s+/gu, "")
    .replace(/_/gu, "-");
  if (
    normalized === "one" ||
    normalized === "1" ||
    normalized === "1..1" ||
    normalized === "required" ||
    normalized === "single" ||
    normalized === "exactly-one"
  ) {
    return "one";
  }
  if (
    normalized === "optional" ||
    normalized === "0..1" ||
    normalized === "zero-or-one" ||
    normalized === "maybe"
  ) {
    return "optional";
  }
  if (
    normalized === "many" ||
    normalized === "*" ||
    normalized === "0..*" ||
    normalized === "1..*" ||
    normalized === "zero-or-more" ||
    normalized === "one-or-more" ||
    normalized === "list" ||
    normalized === "set"
  ) {
    return "many";
  }
  return input;
}

function normalizeEntityCandidate(input: {
  readonly moduleName: string;
  readonly candidate: unknown;
  readonly schemaAttributes: readonly unknown[];
  readonly sourceAssetRefs: unknown;
}): unknown {
  if (typeof input.candidate === "string" && input.candidate.length > 0) {
    const entityName = input.candidate;
    const entityAttributes = input.schemaAttributes
      .filter((attribute) => {
        const record = mutableRecord(attribute);
        const owner = record === null ? null : stringFromRecord(record, ["entity", "entityName", "entityId"]);
        return owner === entityName || owner === `entity:${input.moduleName}.${entityName}`;
      })
      .map((attribute) =>
        normalizeAttributeCandidate({
          moduleName: input.moduleName,
          entityName,
          candidate: attribute
        })
      );
    return Object.freeze({
      kind: "sdlc_domain_entity" as const,
      entityId: `entity:${slugPart(input.moduleName)}.${slugPart(entityName)}`,
      moduleName: input.moduleName,
      ownership: "owned" as const,
      attributes: Object.freeze(entityAttributes),
      invariants: Object.freeze([]),
      sourceAssetRefs: Array.isArray(input.sourceAssetRefs)
        ? input.sourceAssetRefs
        : Object.freeze([])
    });
  }
  const record = mutableRecord(input.candidate);
  if (record === null) {
    return input.candidate;
  }
  if (record["kind"] === "sdlc_domain_entity") {
    return input.candidate;
  }
  const entityName = stringFromRecord(record, ["entityId", "name", "entity"]);
  if (entityName === null) {
    return input.candidate;
  }
  const attributes = Array.isArray(record["attributes"])
    ? record["attributes"].map((attribute) =>
        normalizeAttributeCandidate({
          moduleName: input.moduleName,
          entityName,
          candidate: attribute
        })
      )
    : input.schemaAttributes
        .filter((attribute) => {
          const attributeRecord = mutableRecord(attribute);
          const owner =
            attributeRecord === null
              ? null
              : stringFromRecord(attributeRecord, ["entity", "entityName", "entityId"]);
          return owner === entityName || owner === record["entityId"];
        })
        .map((attribute) =>
          normalizeAttributeCandidate({
            moduleName: input.moduleName,
            entityName,
            candidate: attribute
          })
        );
  return Object.freeze({
    kind: "sdlc_domain_entity" as const,
    entityId: entityName.startsWith("entity:")
      ? entityName
      : `entity:${slugPart(input.moduleName)}.${slugPart(entityName)}`,
    moduleName: optionalString(record["moduleName"]) ?? input.moduleName,
    ownership: optionalString(record["ownership"]) ?? "owned",
    attributes: Object.freeze(attributes),
    invariants: Array.isArray(record["invariants"]) ? record["invariants"] : Object.freeze([]),
    sourceAssetRefs: Array.isArray(record["sourceAssetRefs"])
      ? record["sourceAssetRefs"]
      : Array.isArray(input.sourceAssetRefs)
        ? input.sourceAssetRefs
        : Object.freeze([])
  });
}

function normalizeOperationCandidate(input: {
  readonly moduleName: string;
  readonly candidate: unknown;
}): unknown {
  const record = mutableRecord(input.candidate);
  if (record === null || record["kind"] === "sdlc_domain_operation") {
    return input.candidate;
  }
  const operationId = stringFromRecord(record, ["operationId", "name", "operation"]);
  if (operationId === null) {
    return input.candidate;
  }
  return Object.freeze({
    kind: "sdlc_domain_operation" as const,
    operationId: moduleScopedOperationId({
      moduleName: input.moduleName,
      operationId
    }),
    moduleName: optionalString(record["moduleName"]) ?? input.moduleName,
    inputEntityIds: Array.isArray(record["inputEntityIds"]) ? record["inputEntityIds"] : Object.freeze([]),
    outputEntityIds: Array.isArray(record["outputEntityIds"]) ? record["outputEntityIds"] : Object.freeze([]),
    requiredAttributeIds: Array.isArray(record["requiredAttributeIds"])
      ? record["requiredAttributeIds"]
      : Object.freeze([])
  });
}

function moduleNameFromStateEntityId(
  entityId: string,
  defaultModuleName: string
): string {
  void entityId;
  return defaultModuleName;
}

function normalizeTransitionCandidate(input: {
  readonly entityId: string;
  readonly candidate: unknown;
}): unknown {
  const record = mutableRecord(input.candidate);
  if (record === null || record["kind"] === "sdlc_entity_state_transition") {
    return input.candidate;
  }
  const fromState = stringFromRecord(record, ["fromState", "from"]);
  const toState = stringFromRecord(record, ["toState", "to"]);
  const operationId = stringFromRecord(record, [
    "operationId",
    "trigger",
    "operation"
  ]);
  if (fromState === null || toState === null || operationId === null) {
    return input.candidate;
  }
  return Object.freeze({
    kind: "sdlc_entity_state_transition" as const,
    transitionId:
      stringFromRecord(record, ["transitionId", "id"]) ??
      `transition:${slugPart(input.entityId)}.${slugPart(fromState)}.${slugPart(toState)}.${slugPart(operationId)}`,
    fromState,
    toState,
    operationId: operationId.startsWith("operation:")
      ? operationId
      : `operation:${slugPart(operationId)}`,
    entityId: input.entityId
  });
}

function normalizeStateDiagramCandidate(input: {
  readonly candidate: unknown;
  readonly defaultModuleName: string;
}): unknown {
  const record = mutableRecord(input.candidate);
  if (
    record === null ||
    record["kind"] === "sdlc_module_state_diagram_fragment"
  ) {
    return input.candidate;
  }
  const entityId = stringFromRecord(record, ["entityId", "entity", "name"]);
  if (entityId === null) {
    return input.candidate;
  }
  return Object.freeze({
    kind: "sdlc_module_state_diagram_fragment" as const,
    moduleName:
      optionalString(record["moduleName"]) ??
      moduleNameFromStateEntityId(entityId, input.defaultModuleName),
    entityId,
    stateless:
      typeof record["stateless"] === "boolean" ? record["stateless"] : false,
    states: Array.isArray(record["states"]) ? record["states"] : Object.freeze([]),
    transitions: Array.isArray(record["transitions"])
      ? Object.freeze(
          record["transitions"].map((transition) =>
            normalizeTransitionCandidate({ entityId, candidate: transition })
          )
        )
      : Object.freeze([]),
    requirementIds: Array.isArray(record["requirementIds"])
      ? record["requirementIds"]
      : Object.freeze([]),
    sourceAssetRefs: Array.isArray(record["sourceAssetRefs"])
      ? record["sourceAssetRefs"]
      : Object.freeze([])
  });
}

function normalizedAggregateEntityCandidate(input: unknown): unknown {
  const record = mutableRecord(input);
  if (record === null || record["kind"] === "sdlc_aggregate_domain_entity") {
    return input;
  }
  const entityId = stringFromRecord(record, ["entityId", "id", "name"]);
  const ownerModuleName = stringFromRecord(record, [
    "ownerModuleName",
    "moduleName"
  ]);
  if (entityId === null || ownerModuleName === null) {
    return input;
  }
  return Object.freeze({
    kind: "sdlc_aggregate_domain_entity" as const,
    entityId,
    ownerModuleName,
    attributes: Array.isArray(record["attributes"])
      ? Object.freeze(
          record["attributes"].map((attribute) =>
            normalizeAttributeCandidate({
              moduleName: ownerModuleName,
              entityName: entityId,
              candidate: attribute
            })
          )
        )
      : Object.freeze([]),
    sourceModuleNames: Array.isArray(record["sourceModuleNames"])
      ? record["sourceModuleNames"]
      : Object.freeze([ownerModuleName])
  });
}

function entityIdsForTypeName(input: {
  readonly typeName: string;
  readonly entityIds: readonly string[];
}): readonly string[] {
  const normalizedType = slugPart(input.typeName);
  return Object.freeze(
    input.entityIds.filter((entityId) => {
      const tail = entityId.split(".").at(-1) ?? entityId;
      return slugPart(tail) === normalizedType || slugPart(entityId) === normalizedType;
    })
  );
}

function signatureEntityIds(input: {
  readonly signature: string | null;
  readonly entityIds: readonly string[];
  readonly side: "input" | "output";
}): readonly string[] {
  if (input.signature === null) {
    return Object.freeze([]);
  }
  const [left, right] = input.signature.split("->").map((part) => part.trim());
  const selected = input.side === "input" ? left : right;
  if (selected === undefined || selected.length === 0 || selected === "Unit") {
    return Object.freeze([]);
  }
  const resultMatch = /^Result<([^,>]+)/u.exec(selected);
  const typeText = resultMatch?.[1] ?? selected;
  return Object.freeze(
    typeText
      .split(/[|,&]/u)
      .flatMap((part) =>
        entityIdsForTypeName({
          typeName: part.replace(/(?:List|Set|Option|NonEmpty|Map)<|>/gu, "").trim(),
          entityIds: input.entityIds
        })
      )
  );
}

function normalizedAggregateOperationCandidate(input: {
  readonly candidate: unknown;
  readonly entities: readonly SdlcAggregateDomainEntity[];
}): unknown {
  const record = mutableRecord(input.candidate);
  if (record === null || record["kind"] === "sdlc_domain_operation") {
    return input.candidate;
  }
  const moduleName = stringFromRecord(record, [
    "moduleName",
    "ownerModuleName"
  ]);
  const operationId = stringFromRecord(record, [
    "operationId",
    "name",
    "operation"
  ]);
  if (moduleName === null || operationId === null) {
    return input.candidate;
  }
  const entityIds = input.entities.map((entity) => entity.entityId);
  const signature = optionalString(record["signature"]);
  const inputEntityIds = Array.isArray(record["inputEntityIds"])
    ? record["inputEntityIds"]
    : signatureEntityIds({ signature, entityIds, side: "input" });
  const outputEntityIds = Array.isArray(record["outputEntityIds"])
    ? record["outputEntityIds"]
    : signatureEntityIds({ signature, entityIds, side: "output" });
  const operationEntityIds = new Set([...inputEntityIds, ...outputEntityIds]);
  const requiredAttributeIds = Array.isArray(record["requiredAttributeIds"])
    ? record["requiredAttributeIds"]
    : input.entities
        .filter((entity) => operationEntityIds.has(entity.entityId))
        .flatMap((entity) => entity.attributes.map((attribute) => attribute.attributeId));
  return Object.freeze({
    kind: "sdlc_domain_operation" as const,
    operationId: canonicalOperationId(operationId),
    moduleName,
    inputEntityIds: Object.freeze(inputEntityIds),
    outputEntityIds: Object.freeze(outputEntityIds),
    requiredAttributeIds: Object.freeze(requiredAttributeIds)
  });
}

function normalizedCrossModuleReferences(input: {
  readonly candidate: unknown;
  readonly entityIds: readonly string[];
}): readonly { readonly fromModuleName: string; readonly toModuleName: string; readonly entityId: string }[] {
  if (!Array.isArray(input.candidate)) {
    return Object.freeze([]);
  }
  return Object.freeze(
    input.candidate.flatMap((item) => {
      const record = mutableRecord(item);
      if (record === null) {
        return [];
      }
      const fromModuleName = stringFromRecord(record, [
        "fromModuleName",
        "ownerModuleName"
      ]);
      if (fromModuleName === null) {
        return [];
      }
      const explicitToModuleName = optionalString(record["toModuleName"]);
      const explicitEntityId = optionalString(record["entityId"]);
      if (explicitToModuleName !== null && explicitEntityId !== null) {
        return [
          Object.freeze({
            fromModuleName,
            toModuleName: explicitToModuleName,
            entityId: explicitEntityId
          })
        ];
      }
      const consumers = Array.isArray(record["consumerModuleNames"])
        ? record["consumerModuleNames"].filter((value): value is string => typeof value === "string")
        : [];
      const ownerEntityIds = Array.isArray(record["ownerEntityIds"])
        ? record["ownerEntityIds"].filter((value): value is string => typeof value === "string")
        : [];
      return consumers.flatMap((toModuleName) =>
        ownerEntityIds
          .filter((entityId) => input.entityIds.includes(entityId))
          .map((entityId) =>
            Object.freeze({
              fromModuleName,
              toModuleName,
              entityId
            })
          )
      );
    })
  );
}

function normalizeAggregateDomainModelCandidate(input: unknown): unknown {
  const record = mutableRecord(input);
  if (record === null) {
    return input ?? null;
  }
  if (record["kind"] === "sdlc_aggregate_domain_model") {
    return input;
  }
  const entities = Object.freeze(
    (Array.isArray(record["entities"]) ? record["entities"] : [])
      .map(normalizedAggregateEntityCandidate)
      .filter((entity): entity is SdlcAggregateDomainEntity => {
        const entityRecord = mutableRecord(entity);
        return entityRecord?.["kind"] === "sdlc_aggregate_domain_entity";
      })
  );
  const entityIds = entities.map((entity) => entity.entityId);
  return Object.freeze({
    kind: "sdlc_aggregate_domain_model" as const,
    modelVersion: "ts-design-depth-v1" as const,
    entities,
    operations: Array.isArray(record["operations"])
      ? Object.freeze(
          record["operations"].map((operation) =>
            normalizedAggregateOperationCandidate({
              candidate: operation,
              entities
            })
          )
        )
      : Object.freeze([]),
    crossModuleReferences: normalizedCrossModuleReferences({
      candidate: record["crossModuleReferences"],
      entityIds
    }),
    evidenceRefs: Array.isArray(record["evidenceRefs"])
      ? record["evidenceRefs"]
      : Array.isArray(record["sourceAssetRefs"])
        ? record["sourceAssetRefs"]
        : Object.freeze([])
  });
}

function normalizeAxisVerdictCandidate(input: {
  readonly axis: "entity" | "attribute" | "flow";
  readonly candidate: unknown;
}): unknown {
  const record = mutableRecord(input.candidate);
  if (record === null) {
    return input.candidate;
  }
  if (record["kind"] === "sdlc_design_completeness_axis_verdict") {
    const status = optionalString(record["status"]);
    if (status === null) {
      return input.candidate;
    }
    const normalizedStatus = normalizeCompletenessStatusCandidate(status);
    return normalizedStatus === status
      ? input.candidate
      : Object.freeze({
          ...record,
          status: normalizedStatus
        });
  }
  const status = normalizeCompletenessStatusCandidate(
    stringFromRecord(record, ["status", "verdict"]) ?? "partial"
  );
  const rationale = stringFromRecord(record, ["rationale", "reason", "summary"]);
  return Object.freeze({
    kind: "sdlc_design_completeness_axis_verdict" as const,
    axis: input.axis,
    status,
    reasons: rationale === null ? Object.freeze([]) : Object.freeze([rationale]),
    evidenceRefs: Object.freeze([])
  });
}

function normalizeCompletenessStatusCandidate(
  input: string
): string {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "_")
    .replace(/^_+|_+$/gu, "");
  const compact = normalized.replace(/_/gu, "");
  if (normalized === "satisfied" || normalized.startsWith("satisfied_")) {
    return "satisfied";
  }
  if (normalized === "partial" || normalized.startsWith("partial_")) {
    return "partial";
  }
  if (normalized === "blocked" || normalized.startsWith("blocked_")) {
    return "blocked";
  }
  if (compact.startsWith("satisfiedfor")) {
    return "satisfied";
  }
  if (compact.startsWith("partialfor")) {
    return "partial";
  }
  if (compact.startsWith("blockedfor")) {
    return "blocked";
  }
  return input;
}

function normalizeCompletenessVerdictCandidate(input: unknown): unknown {
  const record = mutableRecord(input);
  if (record === null) {
    return input ?? null;
  }
  if (record["kind"] === "sdlc_design_completeness_verdict") {
    return input;
  }
  return Object.freeze({
    kind: "sdlc_design_completeness_verdict" as const,
    verdictVersion: "ts-design-depth-v1" as const,
    entity: normalizeAxisVerdictCandidate({
      axis: "entity",
      candidate: record["entity"] ?? record["entityAxis"]
    }),
    attribute: normalizeAxisVerdictCandidate({
      axis: "attribute",
      candidate: record["attribute"] ?? record["attributeAxis"]
    }),
    flow: normalizeAxisVerdictCandidate({
      axis: "flow",
      candidate: record["flow"] ?? record["flowAxis"]
    })
  });
}

function normalizeSunnyDayStepCandidate(input: unknown): unknown {
  const record = mutableRecord(input);
  if (record === null) {
    return input;
  }
  if (record["kind"] === "sdlc_sunny_day_sequence_step") {
    return input;
  }
  return Object.freeze({
    kind: record["kind"] ?? "sdlc_sunny_day_sequence_step",
    stepId: record["stepId"],
    moduleName: record["moduleName"],
    operationId:
      typeof record["operationId"] === "string"
        ? canonicalOperationId(record["operationId"])
        : record["operationId"],
    inputEntityIds: record["inputEntityIds"],
    outputEntityIds: record["outputEntityIds"],
    stateTransitionIds: record["stateTransitionIds"]
  });
}

function normalizeSunnyDaySequenceCandidate(input: unknown): unknown {
  const record = mutableRecord(input);
  if (record === null) {
    return input ?? null;
  }
  return Object.freeze({
    kind: record["kind"] ?? "sdlc_aggregate_sunny_day_sequence",
    sequenceVersion: "ts-design-depth-v1",
    steps: Array.isArray(record["steps"])
      ? Object.freeze(record["steps"].map(normalizeSunnyDayStepCandidate))
      : Object.freeze([]),
    evidenceRefs: Array.isArray(record["evidenceRefs"])
      ? record["evidenceRefs"]
      : Array.isArray(record["sourceAssetRefs"])
        ? record["sourceAssetRefs"]
        : Object.freeze([])
  });
}

function normalizeModuleSchemaCandidate(input: unknown): unknown {
  const record = mutableRecord(input);
  if (record === null) {
    return input;
  }
  const moduleName = optionalString(record["moduleName"]);
  if (moduleName === null) {
    return Object.freeze({
      kind: record["kind"] ?? "sdlc_module_schema_fragment",
      moduleName: record["moduleName"],
      entities: record["entities"],
      operations: record["operations"],
      requirementIds: record["requirementIds"],
      sourceAssetRefs: record["sourceAssetRefs"]
    });
  }
  const sourceAssetRefs = Array.isArray(record["sourceAssetRefs"])
    ? record["sourceAssetRefs"]
    : Object.freeze([]);
  const schemaAttributes = Array.isArray(record["attributes"])
    ? record["attributes"]
    : Object.freeze([]);
  return Object.freeze({
    kind: record["kind"] ?? "sdlc_module_schema_fragment",
    moduleName,
    entities: Array.isArray(record["entities"])
      ? Object.freeze(
          record["entities"].map((entity) =>
            normalizeEntityCandidate({
              moduleName,
              candidate: entity,
              schemaAttributes,
              sourceAssetRefs
            })
          )
        )
      : Object.freeze([]),
    operations: Array.isArray(record["operations"])
      ? Object.freeze(
          record["operations"].map((operation) =>
            normalizeOperationCandidate({ moduleName, candidate: operation })
          )
        )
      : Object.freeze([]),
    requirementIds: Array.isArray(record["requirementIds"])
      ? record["requirementIds"]
      : Object.freeze([]),
    sourceAssetRefs
  });
}

function normalizeRegisterCandidate(input: unknown): unknown {
  const record = mutableRecord(input);
  if (record === null) {
    return input;
  }
  const normalizedSchemas = Array.isArray(record["moduleSchemaFragments"])
    ? Object.freeze(record["moduleSchemaFragments"].map(normalizeModuleSchemaCandidate))
    : Object.freeze([]);
  const defaultModuleName =
    mutableRecord(normalizedSchemas[0]) === null
      ? ""
      : optionalString(mutableRecord(normalizedSchemas[0])?.["moduleName"]) ??
        "";
  return Object.freeze({
    kind: record["kind"],
    registerVersion: record["registerVersion"],
    targetAssetType: record["targetAssetType"],
    moduleSchemaFragments: normalizedSchemas,
    moduleStateDiagramFragments: Array.isArray(record["moduleStateDiagramFragments"])
      ? Object.freeze(
          record["moduleStateDiagramFragments"].map((diagram) =>
            normalizeStateDiagramCandidate({
              candidate: diagram,
              defaultModuleName
            })
          )
        )
      : Object.freeze([]),
    aggregateDomainModel: normalizeAggregateDomainModelCandidate(
      record["aggregateDomainModel"] ?? null
    ),
    aggregateSunnyDaySequence: normalizeSunnyDaySequenceCandidate(
      record["aggregateSunnyDaySequence"] ?? null
    ),
    designCompletenessVerdict: normalizeCompletenessVerdictCandidate(
      record["designCompletenessVerdict"] ?? null
    )
  });
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
  const moduleName = parseNonEmptyString(record["moduleName"], `${label}.moduleName`);
  const entities = parseArray(record["entities"], `${label}.entities`, parseEntity);
  const operations = parseArray(record["operations"], `${label}.operations`, parseOperation);
  const contradictoryEntity = entities.find(
    (entity) => entity.moduleName !== moduleName
  );
  if (contradictoryEntity !== undefined) {
    throw new TypeError(
      `${label}.entities: entity ${contradictoryEntity.entityId} moduleName ${contradictoryEntity.moduleName} contradicts schema moduleName ${moduleName}`
    );
  }
  const contradictoryOperation = operations.find(
    (operation) => operation.moduleName !== moduleName
  );
  if (contradictoryOperation !== undefined) {
    throw new TypeError(
      `${label}.operations: operation ${contradictoryOperation.operationId} moduleName ${contradictoryOperation.moduleName} contradicts schema moduleName ${moduleName}`
    );
  }
  return Object.freeze({
    kind: "sdlc_module_schema_fragment" as const,
    moduleName,
    entities,
    operations,
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
  return mutableRecord(input);
}

function normalizeCandidate(input: unknown): unknown {
  const record = objectRecord(input);
  if (record === null) {
    return input;
  }
  if (record["kind"] === "sdlc_design_depth_register") {
    return normalizeRegisterCandidate(input);
  }
  if (record["design_depth_register"] !== undefined) {
    return normalizeRegisterCandidate(record["design_depth_register"]);
  }
  if (record["designDepthRegister"] !== undefined) {
    return normalizeRegisterCandidate(record["designDepthRegister"]);
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
    /^```([^\r\n`]*)\r?\n([\s\S]*?)^```[^\S\r\n]*$/gmu;
  for (const match of content.matchAll(fencedBlockExpression)) {
    const infoString = match[1]?.trim() ?? "";
    const infoParts = infoString.split(/\s+/u).filter((part) => part.length > 0);
    const language = infoParts[0] ?? "";
    if (
      infoString !== "" &&
      language !== "json" &&
      language !== "design_depth_register" &&
      language !== "designDepthRegister" &&
      !infoParts.includes("design_depth_register") &&
      !infoParts.includes("designDepthRegister")
    ) {
      continue;
    }
    const block = match[2]?.trim() ?? "";
    if (
      infoString === "" &&
      !block.startsWith("{") &&
      !block.startsWith("[")
    ) {
      continue;
    }
    try {
      candidates.push(JSON.parse(block));
    } catch {
      // Invalid JSON blocks are reported only if no later candidate admits.
    }
  }
  return Object.freeze(candidates);
}

function writeDesignDepthCandidateEvidence(input: {
  readonly archiveRoot: string | null | undefined;
  readonly candidateIndex: number;
  readonly rawCandidate: unknown;
  readonly normalizedCandidate: unknown;
}): readonly string[] {
  if (input.archiveRoot === null || input.archiveRoot === undefined) {
    return Object.freeze([]);
  }
  mkdirSync(input.archiveRoot, { recursive: true });
  const rawPath = join(
    input.archiveRoot,
    `design_depth_candidate_${input.candidateIndex}_raw.json`
  );
  const normalizedPath = join(
    input.archiveRoot,
    `design_depth_candidate_${input.candidateIndex}_normalized.json`
  );
  writeFileSync(
    rawPath,
    `${JSON.stringify(input.rawCandidate, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(
    normalizedPath,
    `${JSON.stringify(input.normalizedCandidate, null, 2)}\n`,
    "utf8"
  );
  return Object.freeze([pathToFileURL(rawPath).href, pathToFileURL(normalizedPath).href]);
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
  readonly archiveRoot?: string | null;
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
  const candidateEvidenceRefs: string[] = [];
  for (const [candidateIndex, candidate] of jsonCandidates(content).entries()) {
    const normalizedCandidate = normalizeCandidate(candidate);
    candidateEvidenceRefs.push(
      ...writeDesignDepthCandidateEvidence({
        archiveRoot: input.archiveRoot,
        candidateIndex,
        rawCandidate: candidate,
        normalizedCandidate
      })
    );
    const currentEvidenceRefs = Object.freeze([
      ...evidenceRefs,
      ...candidateEvidenceRefs
    ]);
    try {
      const register = parseRegister(normalizedCandidate, "design_depth_register");
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
          status: "partial" as const,
          targetAssetType: input.targetAssetType,
          register,
          blockingReasons: rowReasons,
          evidenceRefs: currentEvidenceRefs
        });
      }
      return Object.freeze({
        kind: "sdlc_design_depth_register_admission" as const,
        status: "admitted" as const,
        targetAssetType: input.targetAssetType,
        register,
        blockingReasons: Object.freeze([]),
        evidenceRefs: currentEvidenceRefs
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
    evidenceRefs: Object.freeze([...evidenceRefs, ...candidateEvidenceRefs])
  });
}
