// Implements: REQ-F-ODDSDLC-013
// Implements: REQ-F-ODDSDLC-014
// Implements: REQ-F-ODDSDLC-015
// Implements: REQ-F-ODDSDLC-017

import {
  parseBoolean,
  parseClosedRecord,
  parseEnumValue,
  parseKind,
  parseNonEmptyString,
  parseStringList
} from "../shared/validation.js";
import type { SdlcAssetBinding } from "../domain/index.js";
import { admitSdlcAssetBinding } from "../domain/index.js";
import { SDLC_FUNCTION_CATALOG } from "../graph/index.js";

export const SDLC_HOOK_EDGE_CLASS_VALUES = Object.freeze([
  "bootstrap_specification",
  "design",
  "implementation",
  "qualification",
  "release",
  "operational_return"
] as const);

export type SdlcHookEdgeClass = (typeof SDLC_HOOK_EDGE_CLASS_VALUES)[number];

export const SDLC_WORK_OPERATION_VALUES = Object.freeze([
  "generate",
  "adopt",
  "import",
  "repair",
  "qualify",
  "release",
  "deploy",
  "return",
  "retrofit"
] as const);

export type SdlcWorkOperation = (typeof SDLC_WORK_OPERATION_VALUES)[number];

export const SDLC_EVALUATOR_PHASE_VALUES = Object.freeze([
  "preflight_fd",
  "postflight_fd"
] as const);

export type SdlcEvaluatorPhase = (typeof SDLC_EVALUATOR_PHASE_VALUES)[number];

export const SDLC_EVALUATOR_STATUS_VALUES = Object.freeze([
  "passed",
  "blocked"
] as const);

export type SdlcEvaluatorStatus = (typeof SDLC_EVALUATOR_STATUS_VALUES)[number];

export interface SdlcHookTransformProfile {
  readonly kind: "sdlc_hook_transform_profile";
  readonly preflightFd: readonly string[];
  readonly constructiveFp: string;
  readonly capabilityFd: readonly string[];
  readonly postflightFd: readonly string[];
  readonly fhGate: string | null;
}

export interface SdlcWorkReportContract {
  readonly kind: "sdlc_work_report_contract";
  readonly requiredFields: readonly string[];
  readonly requireGraphFunctionAuthority: true;
  readonly requireTargetBinding: true;
  readonly requireEvidenceRefs: true;
  readonly requireInputOutputIdentity: true;
  readonly requireGeneratedAssetAttestation: true;
  readonly preserveAmbiguityCandidates: true;
}

export interface SdlcHookClosurePolicy {
  readonly kind: "sdlc_hook_closure_policy";
  readonly postflightFdRequired: true;
  readonly generatedAssetContractMustPass: true;
  readonly traceTagsAloneSufficient: false;
  readonly maySelectNextTraversal: false;
}

export interface SdlcHookContract {
  readonly kind: "sdlc_hook_contract";
  readonly edgeName: string;
  readonly edgeClass: SdlcHookEdgeClass;
  readonly sourceAssetTypes: readonly string[];
  readonly targetAssetType: string;
  readonly transformProfile: SdlcHookTransformProfile;
  readonly workReportContract: SdlcWorkReportContract;
  readonly closurePolicy: SdlcHookClosurePolicy;
}

export interface SdlcAssetIdentity {
  readonly kind: "sdlc_asset_identity";
  readonly assetId: string;
  readonly uri: string;
  readonly declaredType: string;
  readonly digest: string;
  readonly byteCount: number;
}

export interface SdlcEvidenceRef {
  readonly kind: "sdlc_evidence_ref";
  readonly ref: string;
  readonly evidenceType: string;
  readonly digest: string;
}

export interface SdlcAmbiguityCandidate {
  readonly kind: "sdlc_ambiguity_candidate";
  readonly candidateId: string;
  readonly affectedAssetId: string;
  readonly relativePath: string;
  readonly reason: string;
}

export interface SdlcGeneratedAssetContractAttestation {
  readonly kind: "sdlc_generated_asset_contract_attestation";
  readonly contractName: string;
  readonly targetAssetId: string;
  readonly satisfied: boolean;
  readonly materialized: boolean;
  readonly diagnostics: readonly string[];
  readonly foreignRealizationCandidates: readonly SdlcAmbiguityCandidate[];
}

export interface SdlcGeneratedAssetAuthority {
  readonly kind: "sdlc_generated_asset_authority";
  readonly graphFunctionName: string;
  readonly selectedBy: "abg_selected_edge";
  readonly targetAssetType: string;
  readonly targetAssetId: string;
}

export interface SdlcHookInvocation {
  readonly kind: "sdlc_hook_invocation";
  readonly hookName: string;
  readonly edgeName: string;
  readonly edgeClass: SdlcHookEdgeClass;
  readonly sourceBindings: readonly SdlcAssetBinding[];
  readonly targetBinding: SdlcAssetBinding;
  readonly inputIdentities: readonly SdlcAssetIdentity[];
  readonly requestedOperation: SdlcWorkOperation;
  readonly fpWorkerContractRef: string | null;
}

export interface SdlcConstructorResult {
  readonly kind: "sdlc_constructor_result";
  readonly operationType: SdlcWorkOperation;
  readonly outputIdentity: SdlcAssetIdentity;
  readonly evidenceRefs: readonly SdlcEvidenceRef[];
  readonly generatedAssetContract: SdlcGeneratedAssetContractAttestation;
  readonly ambiguityCandidates: readonly SdlcAmbiguityCandidate[];
}

export interface SdlcWorkReport {
  readonly kind: "sdlc_work_report";
  readonly hookName: string;
  readonly edgeName: string;
  readonly edgeClass: SdlcHookEdgeClass;
  readonly targetBinding: SdlcAssetBinding;
  readonly requestedOperation: SdlcWorkOperation;
  readonly operationType: SdlcWorkOperation;
  readonly inputIdentities: readonly SdlcAssetIdentity[];
  readonly outputIdentity: SdlcAssetIdentity;
  readonly evidenceRefs: readonly SdlcEvidenceRef[];
  readonly generatedAssetAuthority: SdlcGeneratedAssetAuthority;
  readonly generatedAssetContract: SdlcGeneratedAssetContractAttestation;
  readonly ambiguityCandidates: readonly SdlcAmbiguityCandidate[];
  readonly emittedRuntimeEventKinds: readonly [];
}

export interface SdlcEvaluatorResult {
  readonly kind: "sdlc_evaluator_result";
  readonly phase: SdlcEvaluatorPhase;
  readonly status: SdlcEvaluatorStatus;
  readonly checkedEvaluatorNames: readonly string[];
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface SdlcHookTurnOutcome {
  readonly kind: "sdlc_hook_turn_outcome";
  readonly contract: SdlcHookContract;
  readonly preflight: SdlcEvaluatorResult;
  readonly workReport: SdlcWorkReport | null;
  readonly postflight: SdlcEvaluatorResult | null;
  readonly emittedRuntimeEventKinds: readonly [];
}

const BOOTSTRAP_SPECIFICATION_TARGETS = new Set([
  "intent_surface",
  "product_surface",
  "goal_surface",
  "requirement_surface"
]);

const DESIGN_TARGETS = new Set([
  "feature_decomp_surface",
  "design_surface",
  "scenario_surface",
  "implementation_design_surface",
  "test_design_surface"
]);

const IMPLEMENTATION_TARGETS = new Set([
  "implementation_stack_profile",
  "implementation_module_surface",
  "code_surface"
]);

const QUALIFICATION_TARGETS = new Set([
  "uat_testcases_surface",
  "test_stack_profile",
  "test_module_surface",
  "test_run_archive_surface",
  "testcase_authority_surface"
]);

const RELEASE_TARGETS = new Set([
  "release_surface",
  "build_execution_surface",
  "test_execution_surface",
  "deployment_surface"
]);

const EMPTY_RUNTIME_EVENT_KINDS: readonly [] = Object.freeze([]);

function parseNullableNonEmptyStringLocal(
  input: unknown,
  label: string
): string | null {
  if (input === null) {
    return null;
  }
  return parseNonEmptyString(input, label);
}

function parseNonNegativeInteger(input: unknown, label: string): number {
  if (typeof input !== "number" || !Number.isInteger(input) || input < 0) {
    throw new TypeError(`${label}: expected non-negative integer`);
  }
  return input;
}

function parseArray<T>(
  input: unknown,
  label: string,
  parseItem: (item: unknown, itemLabel: string) => T
): readonly T[] {
  if (!Array.isArray(input)) {
    throw new TypeError(`${label}: expected array`);
  }
  return Object.freeze(
    input.map((item, index) => parseItem(item, `${label}[${index}]`))
  );
}

function normalizeSurfaceName(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

function surfaceNamesMatch(left: string, right: string): boolean {
  return normalizeSurfaceName(left) === normalizeSurfaceName(right);
}

function edgeClassForTarget(targetAssetType: string): SdlcHookEdgeClass {
  if (BOOTSTRAP_SPECIFICATION_TARGETS.has(targetAssetType)) {
    return "bootstrap_specification";
  }
  if (DESIGN_TARGETS.has(targetAssetType)) {
    return "design";
  }
  if (IMPLEMENTATION_TARGETS.has(targetAssetType)) {
    return "implementation";
  }
  if (QUALIFICATION_TARGETS.has(targetAssetType)) {
    return "qualification";
  }
  if (RELEASE_TARGETS.has(targetAssetType)) {
    return "release";
  }
  return "operational_return";
}

function defaultOperationForTarget(targetAssetType: string): SdlcWorkOperation {
  if (targetAssetType === "release_surface") {
    return "release";
  }
  if (targetAssetType === "deployment_surface") {
    return "deploy";
  }
  if (
    targetAssetType === "build_execution_result_surface" ||
    targetAssetType === "test_execution_result_surface" ||
    targetAssetType === "runtime_observation_surface"
  ) {
    return "return";
  }
  if (targetAssetType === "retrofit_plan_surface") {
    return "retrofit";
  }
  if (
    targetAssetType === "test_run_archive_surface" ||
    targetAssetType === "testcase_authority_surface"
  ) {
    return "qualify";
  }
  return "generate";
}

function evaluatorPrefixForClass(edgeClass: SdlcHookEdgeClass): string {
  return edgeClass.replaceAll("_", "-");
}

function constructHookContract(input: {
  readonly edgeName: string;
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
}): SdlcHookContract {
  const targetAssetType = input.outputs[0];
  if (targetAssetType === undefined) {
    throw new TypeError(`${input.edgeName}: expected at least one target output`);
  }
  const edgeClass = edgeClassForTarget(targetAssetType);
  const evaluatorPrefix = evaluatorPrefixForClass(edgeClass);
  return Object.freeze({
    kind: "sdlc_hook_contract",
    edgeName: input.edgeName,
    edgeClass,
    sourceAssetTypes: Object.freeze([...input.inputs]),
    targetAssetType,
    transformProfile: Object.freeze({
      kind: "sdlc_hook_transform_profile",
      preflightFd: Object.freeze([
        "core-binding-identity-provenance-fd",
        `${evaluatorPrefix}-dependency-surfaces-present`
      ]),
      constructiveFp: "fp://odd-sdlc/generic-software-domain-constructor",
      capabilityFd: Object.freeze([]),
      postflightFd: Object.freeze([
        "core-work-report-shape-fd",
        "generated-asset-contract-fd",
        `${evaluatorPrefix}-postflight-consistency`
      ]),
      fhGate: null
    }),
    workReportContract: Object.freeze({
      kind: "sdlc_work_report_contract",
      requiredFields: Object.freeze([
        "targetBinding",
        "operationType",
        "evidenceRefs",
        "inputIdentities",
        "outputIdentity",
        "generatedAssetAuthority",
        "generatedAssetContract",
        "ambiguityCandidates"
      ]),
      requireGraphFunctionAuthority: true,
      requireTargetBinding: true,
      requireEvidenceRefs: true,
      requireInputOutputIdentity: true,
      requireGeneratedAssetAttestation: true,
      preserveAmbiguityCandidates: true
    }),
    closurePolicy: Object.freeze({
      kind: "sdlc_hook_closure_policy",
      postflightFdRequired: true,
      generatedAssetContractMustPass: true,
      traceTagsAloneSufficient: false,
      maySelectNextTraversal: false
    })
  });
}

export function constructSdlcHookContractCatalog(): readonly SdlcHookContract[] {
  return Object.freeze(
    SDLC_FUNCTION_CATALOG.map((entry) =>
      constructHookContract({
        edgeName: entry.name,
        inputs: entry.inputs,
        outputs: entry.outputs
      })
    )
  );
}

export function hookContractByEdgeName(edgeName: string): SdlcHookContract {
  const matched = constructSdlcHookContractCatalog().find(
    (contract) => contract.edgeName === edgeName
  );
  if (matched === undefined) {
    throw new TypeError(`SdlcHookContractCatalog: unknown edge ${edgeName}`);
  }
  return matched;
}

export function admitSdlcAssetIdentity(
  input: unknown,
  label = "SdlcAssetIdentity"
): SdlcAssetIdentity {
  const record = parseClosedRecord(input, label, [
    "assetId",
    "uri",
    "declaredType",
    "digest",
    "byteCount"
  ]);
  return Object.freeze({
    kind: "sdlc_asset_identity",
    assetId: parseNonEmptyString(record["assetId"], `${label}.assetId`),
    uri: parseNonEmptyString(record["uri"], `${label}.uri`),
    declaredType: parseNonEmptyString(record["declaredType"], `${label}.declaredType`),
    digest: parseNonEmptyString(record["digest"], `${label}.digest`),
    byteCount: parseNonNegativeInteger(record["byteCount"], `${label}.byteCount`)
  });
}

export function admitSdlcEvidenceRef(
  input: unknown,
  label = "SdlcEvidenceRef"
): SdlcEvidenceRef {
  const record = parseClosedRecord(input, label, ["ref", "evidenceType", "digest"]);
  return Object.freeze({
    kind: "sdlc_evidence_ref",
    ref: parseNonEmptyString(record["ref"], `${label}.ref`),
    evidenceType: parseNonEmptyString(record["evidenceType"], `${label}.evidenceType`),
    digest: parseNonEmptyString(record["digest"], `${label}.digest`)
  });
}

export function admitSdlcAmbiguityCandidate(
  input: unknown,
  label = "SdlcAmbiguityCandidate"
): SdlcAmbiguityCandidate {
  const record = parseClosedRecord(input, label, [
    "candidateId",
    "affectedAssetId",
    "relativePath",
    "reason"
  ]);
  return Object.freeze({
    kind: "sdlc_ambiguity_candidate",
    candidateId: parseNonEmptyString(record["candidateId"], `${label}.candidateId`),
    affectedAssetId: parseNonEmptyString(
      record["affectedAssetId"],
      `${label}.affectedAssetId`
    ),
    relativePath: parseNonEmptyString(record["relativePath"], `${label}.relativePath`),
    reason: parseNonEmptyString(record["reason"], `${label}.reason`)
  });
}

export function admitSdlcGeneratedAssetContractAttestation(
  input: unknown,
  label = "SdlcGeneratedAssetContractAttestation"
): SdlcGeneratedAssetContractAttestation {
  const record = parseClosedRecord(input, label, [
    "contractName",
    "targetAssetId",
    "satisfied",
    "materialized",
    "diagnostics",
    "foreignRealizationCandidates"
  ]);
  return Object.freeze({
    kind: "sdlc_generated_asset_contract_attestation",
    contractName: parseNonEmptyString(record["contractName"], `${label}.contractName`),
    targetAssetId: parseNonEmptyString(record["targetAssetId"], `${label}.targetAssetId`),
    satisfied: parseBoolean(record["satisfied"], `${label}.satisfied`),
    materialized: parseBoolean(record["materialized"], `${label}.materialized`),
    diagnostics: parseStringList(record["diagnostics"], `${label}.diagnostics`),
    foreignRealizationCandidates: parseArray(
      record["foreignRealizationCandidates"],
      `${label}.foreignRealizationCandidates`,
      admitSdlcAmbiguityCandidate
    )
  });
}

export function admitSdlcGeneratedAssetAuthority(
  input: unknown,
  label = "SdlcGeneratedAssetAuthority"
): SdlcGeneratedAssetAuthority {
  const record = parseClosedRecord(input, label, [
    "graphFunctionName",
    "selectedBy",
    "targetAssetType",
    "targetAssetId"
  ]);
  return Object.freeze({
    kind: "sdlc_generated_asset_authority",
    graphFunctionName: parseNonEmptyString(
      record["graphFunctionName"],
      `${label}.graphFunctionName`
    ),
    selectedBy: parseEnumValue(
      record["selectedBy"],
      `${label}.selectedBy`,
      ["abg_selected_edge"]
    ),
    targetAssetType: parseNonEmptyString(
      record["targetAssetType"],
      `${label}.targetAssetType`
    ),
    targetAssetId: parseNonEmptyString(
      record["targetAssetId"],
      `${label}.targetAssetId`
    )
  });
}

export function admitSdlcHookInvocation(
  input: unknown,
  label = "SdlcHookInvocation"
): SdlcHookInvocation {
  const record = parseClosedRecord(input, label, [
    "hookName",
    "edgeName",
    "edgeClass",
    "sourceBindings",
    "targetBinding",
    "inputIdentities",
    "requestedOperation",
    "fpWorkerContractRef"
  ]);
  return Object.freeze({
    kind: "sdlc_hook_invocation",
    hookName: parseNonEmptyString(record["hookName"], `${label}.hookName`),
    edgeName: parseNonEmptyString(record["edgeName"], `${label}.edgeName`),
    edgeClass: parseEnumValue(
      record["edgeClass"],
      `${label}.edgeClass`,
      SDLC_HOOK_EDGE_CLASS_VALUES
    ),
    sourceBindings: parseArray(
      record["sourceBindings"],
      `${label}.sourceBindings`,
      admitSdlcAssetBinding
    ),
    targetBinding: admitSdlcAssetBinding(
      record["targetBinding"],
      `${label}.targetBinding`
    ),
    inputIdentities: parseArray(
      record["inputIdentities"],
      `${label}.inputIdentities`,
      admitSdlcAssetIdentity
    ),
    requestedOperation: parseEnumValue(
      record["requestedOperation"],
      `${label}.requestedOperation`,
      SDLC_WORK_OPERATION_VALUES
    ),
    fpWorkerContractRef: parseNullableNonEmptyStringLocal(
      record["fpWorkerContractRef"],
      `${label}.fpWorkerContractRef`
    )
  });
}

export function admitSdlcConstructorResult(
  input: unknown,
  label = "SdlcConstructorResult"
): SdlcConstructorResult {
  const record = parseClosedRecord(input, label, [
    "operationType",
    "outputIdentity",
    "evidenceRefs",
    "generatedAssetContract",
    "ambiguityCandidates"
  ]);
  return Object.freeze({
    kind: "sdlc_constructor_result",
    operationType: parseEnumValue(
      record["operationType"],
      `${label}.operationType`,
      SDLC_WORK_OPERATION_VALUES
    ),
    outputIdentity: admitSdlcAssetIdentity(
      record["outputIdentity"],
      `${label}.outputIdentity`
    ),
    evidenceRefs: parseArray(
      record["evidenceRefs"],
      `${label}.evidenceRefs`,
      admitSdlcEvidenceRef
    ),
    generatedAssetContract: admitSdlcGeneratedAssetContractAttestation(
      record["generatedAssetContract"],
      `${label}.generatedAssetContract`
    ),
    ambiguityCandidates: parseArray(
      record["ambiguityCandidates"],
      `${label}.ambiguityCandidates`,
      admitSdlcAmbiguityCandidate
    )
  });
}

export function admitSdlcWorkReport(
  input: unknown,
  label = "SdlcWorkReport"
): SdlcWorkReport {
  const record = parseClosedRecord(input, label, [
    "kind",
    "hookName",
    "edgeName",
    "edgeClass",
    "targetBinding",
    "requestedOperation",
    "operationType",
    "inputIdentities",
    "outputIdentity",
    "evidenceRefs",
    "generatedAssetAuthority",
    "generatedAssetContract",
    "ambiguityCandidates",
    "emittedRuntimeEventKinds"
  ]);
  const emittedRuntimeEventKinds = parseStringList(
    record["emittedRuntimeEventKinds"],
    `${label}.emittedRuntimeEventKinds`
  );
  if (emittedRuntimeEventKinds.length !== 0) {
    throw new TypeError(`${label}.emittedRuntimeEventKinds: expected empty array`);
  }
  parseKind(record["kind"], "sdlc_work_report", `${label}.kind`);
  return Object.freeze({
    kind: "sdlc_work_report",
    hookName: parseNonEmptyString(record["hookName"], `${label}.hookName`),
    edgeName: parseNonEmptyString(record["edgeName"], `${label}.edgeName`),
    edgeClass: parseEnumValue(
      record["edgeClass"],
      `${label}.edgeClass`,
      SDLC_HOOK_EDGE_CLASS_VALUES
    ),
    targetBinding: admitSdlcAssetBinding(
      record["targetBinding"],
      `${label}.targetBinding`
    ),
    requestedOperation: parseEnumValue(
      record["requestedOperation"],
      `${label}.requestedOperation`,
      SDLC_WORK_OPERATION_VALUES
    ),
    operationType: parseEnumValue(
      record["operationType"],
      `${label}.operationType`,
      SDLC_WORK_OPERATION_VALUES
    ),
    inputIdentities: parseArray(
      record["inputIdentities"],
      `${label}.inputIdentities`,
      admitSdlcAssetIdentity
    ),
    outputIdentity: admitSdlcAssetIdentity(
      record["outputIdentity"],
      `${label}.outputIdentity`
    ),
    evidenceRefs: parseArray(record["evidenceRefs"], `${label}.evidenceRefs`, admitSdlcEvidenceRef),
    generatedAssetAuthority: admitSdlcGeneratedAssetAuthority(
      record["generatedAssetAuthority"],
      `${label}.generatedAssetAuthority`
    ),
    generatedAssetContract: admitSdlcGeneratedAssetContractAttestation(
      record["generatedAssetContract"],
      `${label}.generatedAssetContract`
    ),
    ambiguityCandidates: parseArray(
      record["ambiguityCandidates"],
      `${label}.ambiguityCandidates`,
      admitSdlcAmbiguityCandidate
    ),
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

function evaluatorResult(input: {
  readonly phase: SdlcEvaluatorPhase;
  readonly status: SdlcEvaluatorStatus;
  readonly checkedEvaluatorNames: readonly string[];
  readonly blockingReasons: readonly string[];
  readonly evidenceRefs: readonly string[];
}): SdlcEvaluatorResult {
  return Object.freeze({
    kind: "sdlc_evaluator_result",
    phase: input.phase,
    status: input.status,
    checkedEvaluatorNames: Object.freeze([...input.checkedEvaluatorNames]),
    blockingReasons: Object.freeze([...input.blockingReasons]),
    evidenceRefs: Object.freeze([...input.evidenceRefs])
  });
}

function bindingCoversAssetType(
  binding: SdlcAssetBinding,
  assetType: string
): boolean {
  return surfaceNamesMatch(binding.nodeName, assetType);
}

function targetBindingContainsOutputAsset(input: {
  readonly targetBinding: SdlcAssetBinding;
  readonly outputIdentity: SdlcAssetIdentity;
}): boolean {
  return input.targetBinding.assetIds.includes(input.outputIdentity.assetId);
}

function assetBindingPayload(binding: SdlcAssetBinding): {
  readonly nodeName: string;
  readonly assetIds: readonly string[];
} {
  return Object.freeze({
    nodeName: binding.nodeName,
    assetIds: Object.freeze([...binding.assetIds])
  });
}

function assetIdentityPayload(identity: SdlcAssetIdentity): {
  readonly assetId: string;
  readonly uri: string;
  readonly declaredType: string;
  readonly digest: string;
  readonly byteCount: number;
} {
  return Object.freeze({
    assetId: identity.assetId,
    uri: identity.uri,
    declaredType: identity.declaredType,
    digest: identity.digest,
    byteCount: identity.byteCount
  });
}

function evidenceRefPayload(evidence: SdlcEvidenceRef): {
  readonly ref: string;
  readonly evidenceType: string;
  readonly digest: string;
} {
  return Object.freeze({
    ref: evidence.ref,
    evidenceType: evidence.evidenceType,
    digest: evidence.digest
  });
}

function ambiguityCandidatePayload(candidate: SdlcAmbiguityCandidate): {
  readonly candidateId: string;
  readonly affectedAssetId: string;
  readonly relativePath: string;
  readonly reason: string;
} {
  return Object.freeze({
    candidateId: candidate.candidateId,
    affectedAssetId: candidate.affectedAssetId,
    relativePath: candidate.relativePath,
    reason: candidate.reason
  });
}

function generatedAssetContractPayload(
  attestation: SdlcGeneratedAssetContractAttestation
): {
  readonly contractName: string;
  readonly targetAssetId: string;
  readonly satisfied: boolean;
  readonly materialized: boolean;
  readonly diagnostics: readonly string[];
  readonly foreignRealizationCandidates: readonly ReturnType<
    typeof ambiguityCandidatePayload
  >[];
} {
  return Object.freeze({
    contractName: attestation.contractName,
    targetAssetId: attestation.targetAssetId,
    satisfied: attestation.satisfied,
    materialized: attestation.materialized,
    diagnostics: Object.freeze([...attestation.diagnostics]),
    foreignRealizationCandidates: Object.freeze(
      attestation.foreignRealizationCandidates.map(ambiguityCandidatePayload)
    )
  });
}

function generatedAssetAuthorityPayload(input: {
  readonly contract: SdlcHookContract;
  readonly outputIdentity: SdlcAssetIdentity;
}): {
  readonly graphFunctionName: string;
  readonly selectedBy: "abg_selected_edge";
  readonly targetAssetType: string;
  readonly targetAssetId: string;
} {
  return Object.freeze({
    graphFunctionName: input.contract.edgeName,
    selectedBy: "abg_selected_edge",
    targetAssetType: input.contract.targetAssetType,
    targetAssetId: input.outputIdentity.assetId
  });
}

function missingSourceAssetTypes(input: {
  readonly contract: SdlcHookContract;
  readonly invocation: SdlcHookInvocation;
}): readonly string[] {
  return Object.freeze(
    input.contract.sourceAssetTypes.filter(
      (assetType) =>
        !input.invocation.sourceBindings.some((binding) =>
          bindingCoversAssetType(binding, assetType)
        )
    )
  );
}

export function evaluateSdlcHookPreflight(input: {
  readonly contract: SdlcHookContract;
  readonly invocation: SdlcHookInvocation;
}): SdlcEvaluatorResult {
  const blockingReasons: string[] = [];
  if (input.contract.edgeName !== input.invocation.edgeName) {
    blockingReasons.push("edge_contract_mismatch");
  }
  if (input.contract.edgeClass !== input.invocation.edgeClass) {
    blockingReasons.push("edge_class_mismatch");
  }
  if (
    !bindingCoversAssetType(
      input.invocation.targetBinding,
      input.contract.targetAssetType
    )
  ) {
    blockingReasons.push("target_binding_not_declared_for_contract_output");
  }
  const missingSources = missingSourceAssetTypes(input);
  if (missingSources.length > 0) {
    blockingReasons.push("source_binding_missing");
  }
  if (input.invocation.fpWorkerContractRef === null) {
    blockingReasons.push("fp_worker_contract_missing");
  }
  return evaluatorResult({
    phase: "preflight_fd",
    status: blockingReasons.length === 0 ? "passed" : "blocked",
    checkedEvaluatorNames: input.contract.transformProfile.preflightFd,
    blockingReasons,
    evidenceRefs: input.invocation.inputIdentities.map((identity) => identity.uri)
  });
}

export function constructSdlcWorkReport(input: {
  readonly contract: SdlcHookContract;
  readonly invocation: SdlcHookInvocation;
  readonly constructorResult: SdlcConstructorResult;
}): SdlcWorkReport {
  return admitSdlcWorkReport({
    kind: "sdlc_work_report",
    hookName: input.invocation.hookName,
    edgeName: input.contract.edgeName,
    edgeClass: input.contract.edgeClass,
    targetBinding: assetBindingPayload(input.invocation.targetBinding),
    requestedOperation: input.invocation.requestedOperation,
    operationType: input.constructorResult.operationType,
    inputIdentities: input.invocation.inputIdentities.map(assetIdentityPayload),
    outputIdentity: assetIdentityPayload(input.constructorResult.outputIdentity),
    evidenceRefs: input.constructorResult.evidenceRefs.map(evidenceRefPayload),
    generatedAssetAuthority: generatedAssetAuthorityPayload({
      contract: input.contract,
      outputIdentity: input.constructorResult.outputIdentity
    }),
    generatedAssetContract: generatedAssetContractPayload(
      input.constructorResult.generatedAssetContract
    ),
    ambiguityCandidates: input.constructorResult.ambiguityCandidates.map(
      ambiguityCandidatePayload
    ),
    emittedRuntimeEventKinds: []
  });
}

export function evaluateSdlcHookPostflight(input: {
  readonly contract: SdlcHookContract;
  readonly report: SdlcWorkReport;
}): SdlcEvaluatorResult {
  const blockingReasons: string[] = [];
  if (input.contract.edgeName !== input.report.edgeName) {
    blockingReasons.push("edge_contract_mismatch");
  }
  if (input.contract.edgeClass !== input.report.edgeClass) {
    blockingReasons.push("edge_class_mismatch");
  }
  if (
    !bindingCoversAssetType(input.report.targetBinding, input.contract.targetAssetType)
  ) {
    blockingReasons.push("target_binding_not_declared_for_contract_output");
  }
  if (
    !surfaceNamesMatch(
      input.report.outputIdentity.declaredType,
      input.contract.targetAssetType
    )
  ) {
    blockingReasons.push("output_identity_type_mismatch");
  }
  if (
    !targetBindingContainsOutputAsset({
      targetBinding: input.report.targetBinding,
      outputIdentity: input.report.outputIdentity
    })
  ) {
    blockingReasons.push("output_identity_not_bound_to_target");
  }
  if (input.report.evidenceRefs.length === 0) {
    blockingReasons.push("evidence_refs_missing");
  }
  if (input.report.requestedOperation !== input.report.operationType) {
    blockingReasons.push("requested_operation_mismatch");
  }
  if (input.report.generatedAssetAuthority.graphFunctionName !== input.contract.edgeName) {
    blockingReasons.push("generated_asset_not_bound_to_graph_function");
  }
  if (
    !surfaceNamesMatch(
      input.report.generatedAssetAuthority.targetAssetType,
      input.contract.targetAssetType
    )
  ) {
    blockingReasons.push("generated_asset_authority_type_mismatch");
  }
  if (
    input.report.generatedAssetAuthority.targetAssetId !==
    input.report.outputIdentity.assetId
  ) {
    blockingReasons.push("generated_asset_authority_target_mismatch");
  }
  if (input.report.generatedAssetContract.targetAssetId !== input.report.outputIdentity.assetId) {
    blockingReasons.push("generated_contract_target_mismatch");
  }
  if (!input.report.generatedAssetContract.materialized) {
    blockingReasons.push("generated_asset_not_materialized");
  }
  if (!input.report.generatedAssetContract.satisfied) {
    blockingReasons.push("generated_asset_contract_failed");
  }
  if (
    input.report.generatedAssetContract.foreignRealizationCandidates.length > 0 ||
    input.report.ambiguityCandidates.length > 0
  ) {
    blockingReasons.push("ambiguity_candidates_preserved");
  }
  return evaluatorResult({
    phase: "postflight_fd",
    status: blockingReasons.length === 0 ? "passed" : "blocked",
    checkedEvaluatorNames: input.contract.transformProfile.postflightFd,
    blockingReasons,
    evidenceRefs: input.report.evidenceRefs.map((evidence) => evidence.ref)
  });
}

export function runSdlcHookTurn(input: {
  readonly contract: SdlcHookContract;
  readonly invocation: SdlcHookInvocation;
  readonly constructorResult: SdlcConstructorResult;
}): SdlcHookTurnOutcome {
  const preflight = evaluateSdlcHookPreflight({
    contract: input.contract,
    invocation: input.invocation
  });
  if (preflight.status === "blocked") {
    return Object.freeze({
      kind: "sdlc_hook_turn_outcome",
      contract: input.contract,
      preflight,
      workReport: null,
      postflight: null,
      emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
    });
  }
  const workReport = constructSdlcWorkReport(input);
  const postflight = evaluateSdlcHookPostflight({
    contract: input.contract,
    report: workReport
  });
  return Object.freeze({
    kind: "sdlc_hook_turn_outcome",
    contract: input.contract,
    preflight,
    workReport,
    postflight,
    emittedRuntimeEventKinds: EMPTY_RUNTIME_EVENT_KINDS
  });
}

export function minimalSdlcHookInvocationForContract(input: {
  readonly contract: SdlcHookContract;
  readonly targetAssetId: string;
  readonly fpWorkerContractRef: string;
}): SdlcHookInvocation {
  const sourceBindings = input.contract.sourceAssetTypes.map((assetType) =>
    Object.freeze({
      nodeName: assetType,
      assetIds: [`asset://${assetType}`]
    })
  );
  const inputIdentities = input.contract.sourceAssetTypes.map((assetType) =>
    Object.freeze({
      assetId: `asset://${assetType}`,
      uri: `file:///workspace/${assetType}`,
      declaredType: assetType,
      digest: `sha256:${assetType}`,
      byteCount: assetType.length
    })
  );
  return admitSdlcHookInvocation({
    hookName: `hook://${input.contract.edgeName}`,
    edgeName: input.contract.edgeName,
    edgeClass: input.contract.edgeClass,
    sourceBindings,
    targetBinding: {
      nodeName: input.contract.targetAssetType,
      assetIds: [input.targetAssetId]
    },
    inputIdentities,
    requestedOperation: defaultOperationForTarget(input.contract.targetAssetType),
    fpWorkerContractRef: input.fpWorkerContractRef
  });
}
