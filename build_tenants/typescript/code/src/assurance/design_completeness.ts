// Implements: T-116
// Implements: T-121

import { admitDesignDepthRegisterFromArtifact } from "../operator/design_depth_register.js";
import type {
  SdlcAggregateDomainModel,
  SdlcAggregateSunnyDaySequence,
  SdlcDesignCompletenessAxisVerdict,
  SdlcDesignDepthRegister,
  SdlcDesignDepthRegisterAdmission,
  SdlcFeatureScope,
  SdlcModuleSchemaFragment,
  SdlcModuleStateDiagramFragment,
  SdlcWorkerHandoffManifest,
  SdlcWorkerResultReport
} from "../operator/carriers.js";
import {
  assuranceLedger,
  assuranceReason,
  uniqueSorted,
  verdictFromReasons
} from "./shared.js";
import type {
  SdlcAssuranceLedger,
  SdlcAssuranceLedgerReason
} from "./carriers.js";

const DESIGN_COMPLETENESS_TARGETS = Object.freeze([
  "implementation_module_surface",
  "aggregate_domain_model_surface",
  "aggregate_sunny_day_sequence_surface"
] as const);

function targetRequiresDesignCompleteness(targetAssetType: string): boolean {
  return DESIGN_COMPLETENESS_TARGETS.includes(
    targetAssetType as (typeof DESIGN_COMPLETENESS_TARGETS)[number]
  );
}

function reason(input: {
  readonly code: string;
  readonly message: string;
  readonly evidenceRefs: readonly string[];
}): SdlcAssuranceLedgerReason {
  return assuranceReason({
    code: input.code,
    message: input.message,
    evidenceRefs: input.evidenceRefs,
    lawfulReentryPoint: "same_edge_retry"
  });
}

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return uniqueSorted([...duplicates]);
}

function admissionReasons(
  admission: SdlcDesignDepthRegisterAdmission
): readonly SdlcAssuranceLedgerReason[] {
  if (admission.status === "admitted" || admission.status === "not_required") {
    return Object.freeze([]);
  }
  return Object.freeze(
    admission.blockingReasons.map((blockingReason) =>
      reason({
        code: blockingReason,
        message: `Design-depth register admission rejected: ${blockingReason}`,
        evidenceRefs: admission.evidenceRefs
      })
    )
  );
}

function moduleSchemaReasons(input: {
  readonly schemas: readonly SdlcModuleSchemaFragment[];
  readonly diagrams: readonly SdlcModuleStateDiagramFragment[];
  readonly featureScope: SdlcFeatureScope;
  readonly evidenceRefs: readonly string[];
}): readonly SdlcAssuranceLedgerReason[] {
  const schemaModules = new Set(input.schemas.map((schema) => schema.moduleName));
  const diagramModules = new Set(input.diagrams.map((diagram) => diagram.moduleName));
  return Object.freeze([
    ...duplicateValues(input.schemas.map((schema) => schema.moduleName)).map(
      (moduleName) =>
        reason({
          code: `design_module_schema_duplicate:${moduleName}`,
          message: `Module schema fragment is duplicated for ${moduleName}.`,
          evidenceRefs: input.evidenceRefs
        })
    ),
    ...input.schemas
      .filter((schema) => schema.entities.length === 0)
      .map((schema) =>
        reason({
          code: `design_entity_missing_for_module:${schema.moduleName}`,
          message: `Module ${schema.moduleName} declares no entities.`,
          evidenceRefs: input.evidenceRefs
        })
      ),
    ...input.schemas.flatMap((schema) =>
      schema.entities
        .filter((entity) => entity.ownership === "owned" && entity.attributes.length === 0)
        .map((entity) =>
          reason({
            code: `design_attribute_missing:${entity.entityId}`,
            message: `Owned entity ${entity.entityId} has no typed attributes.`,
            evidenceRefs: input.evidenceRefs
          })
        )
    ),
    ...input.schemas
      .filter((schema) => !diagramModules.has(schema.moduleName))
      .map((schema) =>
        reason({
          code: `design_state_diagram_missing_for_module:${schema.moduleName}`,
          message: `Module ${schema.moduleName} has no state diagram fragment.`,
          evidenceRefs: input.evidenceRefs
        })
      ),
    ...input.diagrams
      .filter((diagram) => !schemaModules.has(diagram.moduleName))
      .map((diagram) =>
        reason({
          code: `design_state_diagram_unowned_module:${diagram.moduleName}`,
          message: `State diagram fragment references undeclared module ${diagram.moduleName}.`,
          evidenceRefs: input.evidenceRefs
        })
      ),
    ...input.diagrams
      .filter((diagram) => !diagram.stateless && diagram.transitions.length === 0)
      .map((diagram) =>
        reason({
          code: `design_state_transition_missing:${diagram.entityId}`,
          message: `Stateful entity ${diagram.entityId} has no declared transitions.`,
          evidenceRefs: input.evidenceRefs
        })
      )
  ]);
}

function moduleInScope(input: {
  readonly featureScope: SdlcFeatureScope;
  readonly moduleName: string;
}): boolean {
  if (input.featureScope.mode === "full_breadth") {
    return true;
  }
  if (input.featureScope.includedModuleNames.length === 0) {
    return true;
  }
  return input.featureScope.includedModuleNames.includes(input.moduleName);
}

function aggregateEntityInScope(input: {
  readonly featureScope: SdlcFeatureScope;
  readonly entity: SdlcAggregateDomainModel["entities"][number];
}): boolean {
  if (input.featureScope.mode === "full_breadth") {
    return true;
  }
  if (input.featureScope.includedEntityIds.includes(input.entity.entityId)) {
    return true;
  }
  return (
    moduleInScope({
      featureScope: input.featureScope,
      moduleName: input.entity.ownerModuleName
    }) ||
    input.entity.sourceModuleNames.some((moduleName) =>
      moduleInScope({ featureScope: input.featureScope, moduleName })
    )
  );
}

function domainEntityInScope(input: {
  readonly featureScope: SdlcFeatureScope;
  readonly entity: SdlcModuleSchemaFragment["entities"][number];
}): boolean {
  if (input.featureScope.mode === "full_breadth") {
    return true;
  }
  if (input.featureScope.includedEntityIds.includes(input.entity.entityId)) {
    return true;
  }
  return moduleInScope({
    featureScope: input.featureScope,
    moduleName: input.entity.moduleName
  });
}

function operationInScope(input: {
  readonly featureScope: SdlcFeatureScope;
  readonly operation: SdlcAggregateDomainModel["operations"][number];
}): boolean {
  if (input.featureScope.mode === "full_breadth") {
    return true;
  }
  if (input.featureScope.includedOperationIds.includes(input.operation.operationId)) {
    return true;
  }
  return moduleInScope({
    featureScope: input.featureScope,
    moduleName: input.operation.moduleName
  });
}

function sequenceStepInScope(input: {
  readonly featureScope: SdlcFeatureScope;
  readonly step: SdlcAggregateSunnyDaySequence["steps"][number];
}): boolean {
  if (input.featureScope.mode === "full_breadth") {
    return true;
  }
  if (input.featureScope.includedOperationIds.includes(input.step.operationId)) {
    return true;
  }
  return moduleInScope({
    featureScope: input.featureScope,
    moduleName: input.step.moduleName
  });
}

function scopedModuleSchemaReasons(input: {
  readonly register: SdlcDesignDepthRegister;
  readonly featureScope: SdlcFeatureScope;
  readonly evidenceRefs: readonly string[];
}): readonly SdlcAssuranceLedgerReason[] {
  const scopedSchemas = input.register.moduleSchemaFragments
    .filter((schema) =>
      moduleInScope({
        featureScope: input.featureScope,
        moduleName: schema.moduleName
      })
    )
    .map((schema) =>
      Object.freeze({
        ...schema,
        entities: Object.freeze(
          schema.entities.filter((entity) =>
            domainEntityInScope({ featureScope: input.featureScope, entity })
          )
        ),
        operations: Object.freeze(
          schema.operations.filter((operation) =>
            operationInScope({ featureScope: input.featureScope, operation })
          )
        )
      })
    );
  const scopedDiagrams = input.register.moduleStateDiagramFragments.filter((diagram) =>
    moduleInScope({
      featureScope: input.featureScope,
      moduleName: diagram.moduleName
    })
  );
  return Object.freeze([
    ...input.featureScope.mode === "steel_thread"
      ? input.featureScope.includedModuleNames
          .filter((moduleName) =>
            !scopedSchemas.some((schema) => schema.moduleName === moduleName)
          )
          .map((moduleName) =>
            reason({
              code: `design_module_schema_missing_for_scope:${moduleName}`,
              message: `Feature scope includes module ${moduleName}, but no module schema fragment was emitted for it.`,
              evidenceRefs: input.evidenceRefs
            })
          )
      : [],
    ...moduleSchemaReasons({
      schemas: scopedSchemas,
      diagrams: scopedDiagrams,
      featureScope: input.featureScope,
      evidenceRefs: input.evidenceRefs
    })
  ]);
}

function aggregateDomainReasons(input: {
  readonly model: SdlcAggregateDomainModel | null;
  readonly featureScope: SdlcFeatureScope;
  readonly evidenceRefs: readonly string[];
}): readonly SdlcAssuranceLedgerReason[] {
  if (input.model === null) {
    return Object.freeze([]);
  }
  const scopedEntities = input.model.entities.filter((entity) =>
    aggregateEntityInScope({ featureScope: input.featureScope, entity })
  );
  const scopedOperations = input.model.operations.filter((operation) =>
    operationInScope({ featureScope: input.featureScope, operation })
  );
  const entityIds = new Set(input.model.entities.map((entity) => entity.entityId));
  return Object.freeze([
    ...(input.featureScope.mode === "steel_thread"
      ? input.featureScope.includedModuleNames
          .filter((moduleName) =>
            !scopedEntities.some(
              (entity) =>
                entity.ownerModuleName === moduleName ||
                entity.sourceModuleNames.includes(moduleName)
            )
          )
          .map((moduleName) =>
            reason({
              code: `design_aggregate_entity_missing_for_scope_module:${moduleName}`,
              message: `Feature scope includes module ${moduleName}, but no aggregate entity was emitted for it.`,
              evidenceRefs: input.evidenceRefs
            })
          )
      : []),
    ...duplicateValues(scopedEntities.map((entity) => entity.entityId)).map(
      (entityId) =>
        reason({
          code: `design_aggregate_entity_duplicate:${entityId}`,
          message: `Aggregate domain model declares duplicate entity ${entityId}.`,
          evidenceRefs: input.evidenceRefs
        })
    ),
    ...scopedEntities
      .filter((entity) => entity.attributes.length === 0)
      .map((entity) =>
        reason({
          code: `design_attribute_missing:${entity.entityId}`,
          message: `Aggregate entity ${entity.entityId} has no attributes.`,
          evidenceRefs: input.evidenceRefs
        })
      ),
    ...scopedOperations
      .filter((operation) => operation.requiredAttributeIds.length === 0)
      .map((operation) =>
        reason({
          code: `design_operation_required_attributes_missing:${operation.operationId}`,
          message: `Operation ${operation.operationId} declares no required attributes.`,
          evidenceRefs: input.evidenceRefs
        })
      ),
    ...input.model.crossModuleReferences
      .filter(
        (ref) =>
          input.featureScope.mode === "full_breadth" ||
          input.featureScope.includedEntityIds.includes(ref.entityId) ||
          moduleInScope({
            featureScope: input.featureScope,
            moduleName: ref.fromModuleName
          }) ||
          moduleInScope({
            featureScope: input.featureScope,
            moduleName: ref.toModuleName
          })
      )
      .filter((ref) => !entityIds.has(ref.entityId))
      .map((ref) =>
        reason({
          code: `design_cross_module_entity_missing:${ref.entityId}`,
          message: `Cross-module reference names undeclared entity ${ref.entityId}.`,
          evidenceRefs: input.evidenceRefs
        })
      )
  ]);
}

function sunnyDaySequenceReasons(input: {
  readonly model: SdlcAggregateDomainModel | null;
  readonly sequence: SdlcAggregateSunnyDaySequence | null;
  readonly featureScope: SdlcFeatureScope;
  readonly evidenceRefs: readonly string[];
}): readonly SdlcAssuranceLedgerReason[] {
  if (input.sequence === null || input.model === null) {
    return Object.freeze([]);
  }
  const operationIds = new Set(input.model.operations.map((operation) => operation.operationId));
  const entityIds = new Set(input.model.entities.map((entity) => entity.entityId));
  const scopedSteps = input.sequence.steps.filter((step) =>
    sequenceStepInScope({ featureScope: input.featureScope, step })
  );
  return Object.freeze([
    ...scopedSteps
      .filter((step) => !operationIds.has(step.operationId))
      .map((step) =>
        reason({
          code: `design_flow_operation_missing:${step.operationId}`,
          message: `Sunny-day step ${step.stepId} calls undeclared operation ${step.operationId}.`,
          evidenceRefs: input.evidenceRefs
        })
      ),
    ...scopedSteps.flatMap((step) =>
      [...step.inputEntityIds, ...step.outputEntityIds]
        .filter((entityId) => !entityIds.has(entityId))
        .map((entityId) =>
          reason({
            code: `design_flow_entity_missing:${entityId}`,
            message: `Sunny-day step ${step.stepId} exchanges undeclared entity ${entityId}.`,
            evidenceRefs: input.evidenceRefs
          })
        )
    )
  ]);
}

function axisReasonMentionsScope(input: {
  readonly featureScope: SdlcFeatureScope;
  readonly axisReason: string;
}): boolean {
  if (input.featureScope.mode === "full_breadth") {
    return true;
  }
  return [
    ...input.featureScope.includedModuleNames,
    ...input.featureScope.includedEntityIds,
    ...input.featureScope.includedOperationIds
  ].some((token) => token.length > 0 && input.axisReason.includes(token));
}

function axisVerdictReasons(input: {
  readonly axis: SdlcDesignCompletenessAxisVerdict;
  readonly featureScope: SdlcFeatureScope;
  readonly evidenceRefs: readonly string[];
}): readonly SdlcAssuranceLedgerReason[] {
  if (input.axis.status === "satisfied") {
    return Object.freeze([]);
  }
  if (
    input.featureScope.mode === "steel_thread" &&
    !input.axis.reasons.some((axisReason) =>
      axisReasonMentionsScope({
        featureScope: input.featureScope,
        axisReason
      })
    )
  ) {
    return Object.freeze([]);
  }
  return Object.freeze([
    reason({
      code: `design_completeness_${input.axis.axis}_${input.axis.status}`,
      message: `Design completeness axis ${input.axis.axis} is ${input.axis.status}.`,
      evidenceRefs: uniqueSorted([...input.evidenceRefs, ...input.axis.evidenceRefs])
    }),
    ...input.axis.reasons
      .filter((axisReason) =>
        axisReasonMentionsScope({
          featureScope: input.featureScope,
          axisReason
        })
      )
      .map((axisReason) =>
        reason({
          code: `design_completeness_${input.axis.axis}_reason:${axisReason}`,
          message: `Design completeness axis ${input.axis.axis} reason: ${axisReason}`,
          evidenceRefs: uniqueSorted([...input.evidenceRefs, ...input.axis.evidenceRefs])
        })
      )
  ]);
}

function verdictReasons(input: {
  readonly register: SdlcDesignDepthRegister;
  readonly featureScope: SdlcFeatureScope;
  readonly evidenceRefs: readonly string[];
}): readonly SdlcAssuranceLedgerReason[] {
  const verdict = input.register.designCompletenessVerdict;
  if (verdict === null) {
    return Object.freeze([]);
  }
  return Object.freeze([
    ...axisVerdictReasons({
      axis: verdict.entity,
      featureScope: input.featureScope,
      evidenceRefs: input.evidenceRefs
    }),
    ...axisVerdictReasons({
      axis: verdict.attribute,
      featureScope: input.featureScope,
      evidenceRefs: input.evidenceRefs
    }),
    ...axisVerdictReasons({
      axis: verdict.flow,
      featureScope: input.featureScope,
      evidenceRefs: input.evidenceRefs
    })
  ]);
}

function registerReasons(input: {
  readonly register: SdlcDesignDepthRegister;
  readonly featureScope: SdlcFeatureScope;
  readonly evidenceRefs: readonly string[];
}): readonly SdlcAssuranceLedgerReason[] {
  return Object.freeze([
    ...scopedModuleSchemaReasons({
      register: input.register,
      featureScope: input.featureScope,
      evidenceRefs: input.evidenceRefs
    }),
    ...aggregateDomainReasons({
      model: input.register.aggregateDomainModel,
      featureScope: input.featureScope,
      evidenceRefs: input.evidenceRefs
    }),
    ...sunnyDaySequenceReasons({
      model: input.register.aggregateDomainModel,
      sequence: input.register.aggregateSunnyDaySequence,
      featureScope: input.featureScope,
      evidenceRefs: input.evidenceRefs
    }),
    ...verdictReasons(input)
  ]);
}

function defaultFullBreadthScope(targetAssetType: string): SdlcFeatureScope {
  return Object.freeze({
    kind: "sdlc_feature_scope" as const,
    scopeVersion: "ts-scope-v1" as const,
    mode: "full_breadth" as const,
    scopeRef: `scope://odd_sdlc/${targetAssetType}/legacy-full-breadth`,
    basisRefs: Object.freeze([]),
    includedModuleNames: Object.freeze([]),
    includedEntityIds: Object.freeze([]),
    includedOperationIds: Object.freeze([]),
    deferredModuleNames: Object.freeze([])
  });
}

export function deriveDesignCompletenessAssuranceLedger(input: {
  readonly manifest: Pick<SdlcWorkerHandoffManifest, "targetAssetType"> &
    Partial<Pick<SdlcWorkerHandoffManifest, "featureScope">>;
  readonly report: Pick<SdlcWorkerResultReport, "outputFile">;
}): SdlcAssuranceLedger | null {
  if (!targetRequiresDesignCompleteness(input.manifest.targetAssetType)) {
    return null;
  }
  const admission = admitDesignDepthRegisterFromArtifact({
    targetAssetType: input.manifest.targetAssetType,
    outputFile: input.report.outputFile
  });
  const evidenceRefs = admission.evidenceRefs;
  const featureScope =
    input.manifest.featureScope ??
    defaultFullBreadthScope(input.manifest.targetAssetType);
  const reasons = Object.freeze([
    ...admissionReasons(admission),
    ...(admission.register === null
      ? []
      : registerReasons({
          register: admission.register,
          featureScope,
          evidenceRefs
        }))
  ]);
  return assuranceLedger({
    dimension: "design_completeness",
    verdict: verdictFromReasons({
      blockedReasonCodes: Object.freeze([]),
      openGapReasonCodes: reasons.map((item) => item.code)
    }),
    reasons,
    evidenceRefs,
    carryForwardObligationRefs:
      featureScope.mode === "steel_thread"
        ? featureScope.deferredModuleNames.map((moduleName) => `module:${moduleName}`)
        : Object.freeze([])
  });
}
