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
  SDLC_DESIGN_DEPTH_REGISTER_FRAGMENT_CONTENT_KIND,
  SDLC_DESIGN_DEPTH_REGISTER_FRAGMENT_DRAFT_CONTENT_KIND,
  SDLC_DESIGN_DEPTH_REGISTER_FRAGMENT_SECTIONS,
  admitSdlcEvaluateContentRegisterArtifact,
  admitSdlcEvaluateContentRegisterArtifactForSelectedIdentity,
  designDepthFpEvaluatorContentRegisterPath,
  designDepthRegisterPayloadFromEvaluateContentRegister,
  observeDesignDepthContentRegisterFirstUpdate,
  sdlcEvaluateContentRegisterPath,
  writeDesignDepthRegisterProjectionFromEvaluateContentRegister,
  type SdlcDesignDepthContentRegisterFirstUpdateObservation,
  type SdlcEvaluateAuthorityFunction,
  type SdlcEvaluateContentCarrierFamily,
  type SdlcEvaluateContentRegister,
  type SdlcEvaluateContentRegisterAdmission,
  type SdlcEvaluateContentRegisterRow,
  type SdlcEvaluateContentRegisterSelectedIdentity,
  type SdlcDesignDepthRegisterFragment,
  type SdlcDesignDepthRegisterFragmentSection
} from "./content_register.js";
