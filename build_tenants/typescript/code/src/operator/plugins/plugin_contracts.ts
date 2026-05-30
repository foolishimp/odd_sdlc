// Implements: T-184

import {
  constructEnginePluginContract,
  type EnginePluginContract
} from "@abiogenesis/typescript-tenant";

export function fpDispatchPluginContract(): EnginePluginContract {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/fp-dispatch",
    pluginKind: "fp_dispatch",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "FpDispatchOutcome",
    computeStageRole: "transform",
    computeMeans: "F_P",
    computeStagePurpose: "candidate_construction"
  });
}

export function fpEvaluatorPluginContract(): EnginePluginContract {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/fp-evaluator",
    pluginKind: "fp_evaluator",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "FpEvaluationOutcome",
    computeStageRole: "evaluate",
    computeMeans: "F_P",
    computeStagePurpose: "candidate_evaluation"
  });
}

export function designDepthFpEvaluatorRuleContract(): EnginePluginContract {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/design-depth-fp-evaluator-register",
    pluginKind: "fp_evaluator",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "SdlcDesignDepthRegister",
    computeStageRole: "evaluate",
    computeMeans: "F_P",
    computeStagePurpose: "candidate_evaluation"
  });
}

export function reviewGradeEdgeFulfillmentRuleContract(): EnginePluginContract {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/review-grade-edge-fulfillment",
    pluginKind: "fp_evaluator",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "SdlcReviewGradeEdgeFulfillmentAssessment",
    computeStageRole: "evaluate",
    computeMeans: "F_P",
    computeStagePurpose: "candidate_evaluation"
  });
}

export function consequenceProjectionPluginContract(): EnginePluginContract {
  return constructEnginePluginContract({
    ref: "plugin://odd-sdlc/typescript/installed-operator/consequence-projection",
    pluginKind: "consequence_projection",
    authority: "effect_plugin",
    inputCarrier: "EnginePluginInput",
    outputCarrier: "ConsequenceProjectionOutcome",
    computeStageRole: "consequence",
    computeMeans: "F_D",
    computeStagePurpose: "consequence_projection"
  });
}
