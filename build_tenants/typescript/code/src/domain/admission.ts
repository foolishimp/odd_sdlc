import {
  parseBoolean,
  parseClosedRecord,
  parseEnumValue,
  parseKind,
  parseNonEmptyString,
  parseNullableNonEmptyString,
  parseOptionalField,
  parseStringList
} from "../shared/validation.js";
import {
  SDLC_ASSET_MUTABILITY_VALUES,
  SDLC_ASSET_PROVENANCE_MODEL_VALUES,
  SDLC_CAPABILITY_FAMILY_VALUES,
  SDLC_OPERATIONAL_LANE_VALUES,
  SDLC_OPERATIONAL_RESULT_STATUS_VALUES,
  SDLC_WORKSITE_STATE_VALUES,
  type SdlcAsset,
  type SdlcAssetBinding,
  type SdlcAssetCheckpoint,
  type SdlcAssetFamily,
  type SdlcAssetProvenance,
  type SdlcAssetType,
  type SdlcCapability,
  type SdlcOperationalResult,
  type SdlcOperationalTransitionCommand,
  type SdlcWorkAct,
  type SdlcWorkActDescriptor,
  type SdlcWorksite
} from "./carriers.js";

function parseNullableNumber(input: unknown, label: string): number | null {
  if (input === null) {
    return null;
  }
  if (typeof input !== "number" || !Number.isInteger(input) || input < 0) {
    throw new TypeError(`${label}: expected non-negative integer or null`);
  }
  return input;
}

export function admitSdlcAssetType(
  input: unknown,
  label = "SdlcAssetType"
): SdlcAssetType {
  const record = parseClosedRecord(input, label, [
    "name",
    "description",
    "semanticFacets",
    "libraryLevel",
    "mutableDefault",
    "proofHints",
    "closureHints"
  ]);
  return Object.freeze({
    kind: "sdlc_asset_type",
    name: parseNonEmptyString(record["name"], `${label}.name`),
    description: parseNonEmptyString(record["description"], `${label}.description`),
    semanticFacets: parseStringList(record["semanticFacets"], `${label}.semanticFacets`),
    libraryLevel: parseNonEmptyString(record["libraryLevel"], `${label}.libraryLevel`),
    mutableDefault: parseBoolean(record["mutableDefault"], `${label}.mutableDefault`),
    proofHints: parseStringList(record["proofHints"], `${label}.proofHints`),
    closureHints: parseStringList(record["closureHints"], `${label}.closureHints`)
  });
}

export function admitSdlcAssetFamily(
  input: unknown,
  label = "SdlcAssetFamily"
): SdlcAssetFamily {
  const record = parseClosedRecord(input, label, [
    "name",
    "description",
    "lifecycleRole",
    "representativeAssetTypes",
    "realizationStatus"
  ]);
  return Object.freeze({
    kind: "sdlc_asset_family",
    name: parseNonEmptyString(record["name"], `${label}.name`),
    description: parseNonEmptyString(record["description"], `${label}.description`),
    lifecycleRole: parseNonEmptyString(record["lifecycleRole"], `${label}.lifecycleRole`),
    representativeAssetTypes: parseStringList(
      record["representativeAssetTypes"],
      `${label}.representativeAssetTypes`
    ),
    realizationStatus: parseNonEmptyString(
      record["realizationStatus"],
      `${label}.realizationStatus`
    )
  });
}

export function admitSdlcAssetProvenance(
  input: unknown,
  label = "SdlcAssetProvenance"
): SdlcAssetProvenance {
  const record = parseClosedRecord(input, label, [
    "model",
    "source",
    "mutable",
    "historyBasis"
  ]);
  return Object.freeze({
    kind: "sdlc_asset_provenance",
    model: parseEnumValue(
      record["model"],
      `${label}.model`,
      SDLC_ASSET_PROVENANCE_MODEL_VALUES
    ),
    source: parseNonEmptyString(record["source"], `${label}.source`),
    mutable: parseBoolean(record["mutable"], `${label}.mutable`),
    historyBasis: parseNonEmptyString(record["historyBasis"], `${label}.historyBasis`)
  });
}

export function admitSdlcAssetCheckpoint(
  input: unknown,
  label = "SdlcAssetCheckpoint"
): SdlcAssetCheckpoint {
  const record = parseClosedRecord(input, label, [
    "exists",
    "pathKind",
    "contentDigest",
    "byteCount"
  ]);
  return Object.freeze({
    kind: "sdlc_asset_checkpoint",
    exists: parseBoolean(record["exists"], `${label}.exists`),
    pathKind: parseNonEmptyString(record["pathKind"], `${label}.pathKind`),
    contentDigest: parseNullableNonEmptyString(
      record["contentDigest"],
      `${label}.contentDigest`
    ),
    byteCount: parseNullableNumber(record["byteCount"], `${label}.byteCount`)
  });
}

export function admitSdlcAsset(
  input: unknown,
  label = "SdlcAsset"
): SdlcAsset {
  const record = parseClosedRecord(input, label, [
    "assetId",
    "uri",
    "declaredType",
    "family",
    "mutability",
    "provenance",
    "checkpoint"
  ]);
  const checkpointInput = parseOptionalField(record, "checkpoint");
  return Object.freeze({
    kind: "sdlc_asset",
    assetId: parseNonEmptyString(record["assetId"], `${label}.assetId`),
    uri: parseNonEmptyString(record["uri"], `${label}.uri`),
    declaredType: parseNonEmptyString(record["declaredType"], `${label}.declaredType`),
    family: parseNonEmptyString(record["family"], `${label}.family`),
    mutability: parseEnumValue(
      record["mutability"],
      `${label}.mutability`,
      SDLC_ASSET_MUTABILITY_VALUES
    ),
    provenance: admitSdlcAssetProvenance(
      record["provenance"],
      `${label}.provenance`
    ),
    checkpoint:
      checkpointInput === null
        ? null
        : admitSdlcAssetCheckpoint(checkpointInput, `${label}.checkpoint`)
  });
}

export function admitSdlcAssetBinding(
  input: unknown,
  label = "SdlcAssetBinding"
): SdlcAssetBinding {
  const record = parseClosedRecord(input, label, ["nodeName", "assetIds"]);
  return Object.freeze({
    kind: "sdlc_asset_binding",
    nodeName: parseNonEmptyString(record["nodeName"], `${label}.nodeName`),
    assetIds: parseStringList(record["assetIds"], `${label}.assetIds`)
  });
}

export function admitSdlcWorksite(
  input: unknown,
  label = "SdlcWorksite"
): SdlcWorksite {
  const record = parseClosedRecord(input, label, [
    "worksiteId",
    "rootUri",
    "lifecycleState",
    "activeAssetIds"
  ]);
  return Object.freeze({
    kind: "sdlc_worksite",
    worksiteId: parseNonEmptyString(record["worksiteId"], `${label}.worksiteId`),
    rootUri: parseNonEmptyString(record["rootUri"], `${label}.rootUri`),
    lifecycleState: parseEnumValue(
      record["lifecycleState"],
      `${label}.lifecycleState`,
      SDLC_WORKSITE_STATE_VALUES
    ),
    activeAssetIds: parseStringList(record["activeAssetIds"], `${label}.activeAssetIds`)
  });
}

export function admitSdlcWorkActDescriptor(
  input: unknown,
  label = "SdlcWorkActDescriptor"
): SdlcWorkActDescriptor {
  const record = parseClosedRecord(input, label, [
    "name",
    "description",
    "mutatesWorkspace",
    "producesGovernedEvidence",
    "typicalAssetFamilies",
    "realizationStatus"
  ]);
  return Object.freeze({
    kind: "sdlc_work_act_descriptor",
    name: parseNonEmptyString(record["name"], `${label}.name`),
    description: parseNonEmptyString(record["description"], `${label}.description`),
    mutatesWorkspace: parseBoolean(
      record["mutatesWorkspace"],
      `${label}.mutatesWorkspace`
    ),
    producesGovernedEvidence: parseBoolean(
      record["producesGovernedEvidence"],
      `${label}.producesGovernedEvidence`
    ),
    typicalAssetFamilies: parseStringList(
      record["typicalAssetFamilies"],
      `${label}.typicalAssetFamilies`
    ),
    realizationStatus: parseNonEmptyString(
      record["realizationStatus"],
      `${label}.realizationStatus`
    )
  });
}

export function admitSdlcWorkAct(
  input: unknown,
  label = "SdlcWorkAct"
): SdlcWorkAct {
  const record = parseClosedRecord(input, label, [
    "workActId",
    "descriptorName",
    "inputAssetIds",
    "outputAssetIds",
    "evidenceAssetIds",
    "provenance"
  ]);
  return Object.freeze({
    kind: "sdlc_work_act",
    workActId: parseNonEmptyString(record["workActId"], `${label}.workActId`),
    descriptorName: parseNonEmptyString(
      record["descriptorName"],
      `${label}.descriptorName`
    ),
    inputAssetIds: parseStringList(record["inputAssetIds"], `${label}.inputAssetIds`),
    outputAssetIds: parseStringList(record["outputAssetIds"], `${label}.outputAssetIds`),
    evidenceAssetIds: parseStringList(
      record["evidenceAssetIds"],
      `${label}.evidenceAssetIds`
    ),
    provenance: admitSdlcAssetProvenance(
      record["provenance"],
      `${label}.provenance`
    )
  });
}

export function admitSdlcCapability(
  input: unknown,
  label = "SdlcCapability"
): SdlcCapability {
  const record = parseClosedRecord(input, label, [
    "capabilityId",
    "family",
    "binding",
    "supportsAssetFamilies",
    "evidenceExpectation"
  ]);
  return Object.freeze({
    kind: "sdlc_capability",
    capabilityId: parseNonEmptyString(record["capabilityId"], `${label}.capabilityId`),
    family: parseEnumValue(record["family"], `${label}.family`, SDLC_CAPABILITY_FAMILY_VALUES),
    binding: parseNonEmptyString(record["binding"], `${label}.binding`),
    supportsAssetFamilies: parseStringList(
      record["supportsAssetFamilies"],
      `${label}.supportsAssetFamilies`
    ),
    evidenceExpectation: parseNonEmptyString(
      record["evidenceExpectation"],
      `${label}.evidenceExpectation`
    )
  });
}

export function admitSdlcOperationalTransitionCommand(
  input: unknown,
  label = "SdlcOperationalTransitionCommand"
): SdlcOperationalTransitionCommand {
  const record = parseClosedRecord(input, label, [
    "commandId",
    "lane",
    "requiredSubstrateBinding",
    "capabilityContract",
    "returnedEvidenceExpectation",
    "targetAssetIds"
  ]);
  return Object.freeze({
    kind: "sdlc_operational_transition_command",
    commandId: parseNonEmptyString(record["commandId"], `${label}.commandId`),
    lane: parseEnumValue(record["lane"], `${label}.lane`, SDLC_OPERATIONAL_LANE_VALUES),
    requiredSubstrateBinding: parseNonEmptyString(
      record["requiredSubstrateBinding"],
      `${label}.requiredSubstrateBinding`
    ),
    capabilityContract: parseNonEmptyString(
      record["capabilityContract"],
      `${label}.capabilityContract`
    ),
    returnedEvidenceExpectation: parseNonEmptyString(
      record["returnedEvidenceExpectation"],
      `${label}.returnedEvidenceExpectation`
    ),
    targetAssetIds: parseStringList(record["targetAssetIds"], `${label}.targetAssetIds`)
  });
}

export function admitSdlcOperationalResult(
  input: unknown,
  label = "SdlcOperationalResult"
): SdlcOperationalResult {
  const record = parseClosedRecord(input, label, [
    "kind",
    "resultId",
    "commandId",
    "status",
    "evidenceAssetIds",
    "returnedAt"
  ]);
  parseKind(record["kind"], "sdlc_operational_result", `${label}.kind`);
  return Object.freeze({
    kind: "sdlc_operational_result",
    resultId: parseNonEmptyString(record["resultId"], `${label}.resultId`),
    commandId: parseNonEmptyString(record["commandId"], `${label}.commandId`),
    status: parseEnumValue(
      record["status"],
      `${label}.status`,
      SDLC_OPERATIONAL_RESULT_STATUS_VALUES
    ),
    evidenceAssetIds: parseStringList(
      record["evidenceAssetIds"],
      `${label}.evidenceAssetIds`
    ),
    returnedAt: parseNullableNonEmptyString(record["returnedAt"], `${label}.returnedAt`)
  });
}
