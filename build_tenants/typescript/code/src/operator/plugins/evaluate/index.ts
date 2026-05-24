// Implements: T-181

export const SDLC_EVALUATE_C_PLUGIN_SURFACE =
  "operator/plugins/evaluate/evaluate.C" as const;

export {
  constructSdlcFpEvaluateResult,
  evaluateSdlcComputeStage,
  writeSdlcFpEvaluateResult
} from "./postflight.js";
