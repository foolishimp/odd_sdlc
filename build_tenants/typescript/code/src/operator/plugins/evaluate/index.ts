// Implements: T-181

export const SDLC_EVALUATE_C_PLUGIN_SURFACE =
  "operator/plugins/evaluate/evaluate.C" as const;

export {
  constructSdlcFpEvaluateResult,
  evaluateSdlcComputeStage,
  writeSdlcFpEvaluateResult
} from "./postflight.js";
export {
  admitDesignDepthFpEvaluatorRegisterArtifact
} from "./design_depth_register.js";
export {
  SDLC_EVALUATE_AUTHORITY_FUNCTIONS,
  SDLC_EVALUATE_CONTENT_CARRIER_FAMILIES,
  admitSdlcEvaluateContentLedgerArtifact,
  admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity,
  designDepthFpEvaluatorContentLedgerPath,
  designDepthRegisterPayloadFromEvaluateContentLedger,
  sdlcEvaluateContentLedgerPath,
  writeDesignDepthRegisterProjectionFromEvaluateContentLedger,
  type SdlcEvaluateAuthorityFunction,
  type SdlcEvaluateContentCarrierFamily,
  type SdlcEvaluateContentLedger,
  type SdlcEvaluateContentLedgerAdmission,
  type SdlcEvaluateContentLedgerRow,
  type SdlcEvaluateContentLedgerSelectedIdentity
} from "./content_ledger.js";
