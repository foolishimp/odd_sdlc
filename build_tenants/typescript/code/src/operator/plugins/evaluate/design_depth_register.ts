// Implements: T-183

import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type {
  SdlcDesignDepthRegisterAdmission,
  SdlcWorkerHandoffManifest
} from "../../carriers.js";
import {
  admitDesignDepthRegisterFromArtifact
} from "../../design_depth_register.js";
import {
  admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity
} from "./content_ledger.js";

export const DESIGN_DEPTH_FP_EVALUATOR_RULE_REF =
  "evaluation-rule://odd-sdlc/design-depth-register/fp" as const;

const DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE =
  "design_depth_fp_evaluator_rule_outcome.json";

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort((left, right) => left.localeCompare(right)));
}

function objectRecord(input: unknown): Record<string, unknown> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  return Object.fromEntries(Object.entries(input));
}

function parseOpenRecord(input: unknown, label: string): Record<string, unknown> {
  const record = objectRecord(input);
  if (record === null) {
    throw new TypeError(`${label}: expected JSON object`);
  }
  return record;
}

function stringListFromUnknown(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? Object.freeze(
        value.filter((item): item is string => typeof item === "string")
      )
    : Object.freeze([]);
}

function nonEmptyStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function nullableStringValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return nonEmptyStringValue(value);
}

function decodedRefVariants(input: string): readonly string[] {
  const variants = [input];
  let current = input;
  for (let index = 0; index < 4; index += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) {
        break;
      }
      variants.push(decoded);
      current = decoded;
    } catch {
      break;
    }
  }
  return Object.freeze([...new Set(variants)]);
}

function refToExistingFilePath(ref: string): string | null {
  if (!ref.startsWith("file://")) {
    return null;
  }
  try {
    const filePath = fileURLToPath(ref);
    return existsSync(filePath) && statSync(filePath).isFile() ? filePath : null;
  } catch {
    return null;
  }
}

function operatorRunArchiveRootsFromRef(input: string): readonly string[] {
  const roots: string[] = [];
  for (const variant of decodedRefVariants(input)) {
    for (const match of variant.matchAll(
      /file:\/\/\/.*?\/operator-runs\/[0-9]{8}T[0-9]{9}Z(?:_pid[0-9]+)?/gu
    )) {
      const url = match[0];
      try {
        roots.push(fileURLToPath(url));
      } catch {
        continue;
      }
    }
  }
  return uniqueSorted(roots);
}

export function designDepthFpEvaluatorRegisterPath(
  manifest: SdlcWorkerHandoffManifest
): string {
  return join(manifest.archiveRoot, "design_depth_fp_evaluator_register.json");
}

function designDepthFpEvaluatorRegisterPathForArchiveRoot(
  archiveRoot: string
): string {
  return join(archiveRoot, "design_depth_fp_evaluator_register.json");
}

function designDepthFpEvaluatorContentLedgerPathForArchiveRoot(
  archiveRoot: string
): string {
  return join(archiveRoot, "design_depth_fp_evaluator_content_ledger.json");
}

function contentLedgerRefForRegisterPath(registerPath: string): string {
  return pathToFileURL(
    designDepthFpEvaluatorContentLedgerPathForArchiveRoot(dirname(registerPath))
  ).href;
}

function contentLedgerExistsForRegisterPath(registerPath: string): boolean {
  const contentLedgerPath = designDepthFpEvaluatorContentLedgerPathForArchiveRoot(
    dirname(registerPath)
  );
  return existsSync(contentLedgerPath) && statSync(contentLedgerPath).isFile();
}

function admitContentLedgerForRegisterPath(input: {
  readonly registerPath: string;
  readonly selectedCompositionRef: string;
  readonly selectedCompositionDigest: string;
  readonly selectedCompositionSelectionRef: string;
  readonly selectedRegimeBindingRef: string | null;
}): readonly string[] {
  const contentLedgerPath = designDepthFpEvaluatorContentLedgerPathForArchiveRoot(
    dirname(input.registerPath)
  );
  const admission = admitSdlcEvaluateContentLedgerArtifactForSelectedIdentity({
    ledgerPath: contentLedgerPath,
    selectedIdentity: Object.freeze({
      selectedCompositionRef: input.selectedCompositionRef,
      selectedCompositionDigest: input.selectedCompositionDigest,
      selectedCompositionSelectionRef: input.selectedCompositionSelectionRef,
      selectedRegimeBindingRef: input.selectedRegimeBindingRef
    }),
    ruleRef: DESIGN_DEPTH_FP_EVALUATOR_RULE_REF,
    authorityFunction: "synthesize_model",
    computeMeans: "F_P"
  });
  return admission.status === "admitted"
    ? admission.evidenceRefs
    : Object.freeze([]);
}

export function shouldDeferImplementationDesignRegisterToFpEvaluator(
  manifest: SdlcWorkerHandoffManifest
): boolean {
  return (
    manifest.targetAssetType === "implementation_design_surface" &&
    !existsSync(designDepthFpEvaluatorRegisterPath(manifest))
  );
}

function implementationDesignSourceAssetRefs(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return uniqueSorted(
    manifest.traversalObligationContext.obligations
      .filter(
        (obligation) =>
          obligation.obligationKind === "source_asset" &&
          obligation.obligationId === "source_asset:implementation_design_surface"
      )
      .flatMap((obligation) => [
        ...obligation.evidenceRefs,
        ...obligation.payload.sourceRefs
      ])
  );
}

function predecessorDesignRegisterArchiveRoots(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  return uniqueSorted(
    [
      ...manifest.traversalObligationContext.priorEdgeRefs,
      ...implementationDesignSourceAssetRefs(manifest)
    ].flatMap((ref) => operatorRunArchiveRootsFromRef(ref))
  );
}

function predecessorDesignRegisterArchiveMatchesCurrent(input: {
  readonly archiveRoot: string;
  readonly manifest: SdlcWorkerHandoffManifest;
}): boolean {
  const manifestPath = join(input.archiveRoot, "handoff_manifest.json");
  if (!existsSync(manifestPath) || !statSync(manifestPath).isFile()) {
    return false;
  }
  try {
    const record = parseOpenRecord(
      JSON.parse(readFileSync(manifestPath, "utf8")),
      "DesignDepthFpEvaluatorPredecessorHandoffManifest"
    );
    const productMaterialization = parseOpenRecord(
      record["productMaterialization"],
      "DesignDepthFpEvaluatorPredecessorHandoffManifest.productMaterialization"
    );
    return (
      record["targetAssetType"] === "implementation_design_surface" &&
      typeof record["workspaceRoot"] === "string" &&
      resolve(record["workspaceRoot"]) === resolve(input.manifest.workspaceRoot) &&
      typeof productMaterialization["tenantRoot"] === "string" &&
      resolve(productMaterialization["tenantRoot"]) ===
        resolve(input.manifest.productMaterialization.tenantRoot)
    );
  } catch {
    return false;
  }
}

export function predecessorDesignDepthFpEvaluatorRegisterPaths(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  if (!manifest.inputAssetTypes.includes("implementation_design_surface")) {
    return Object.freeze([]);
  }
  return uniqueSorted(
    predecessorDesignRegisterArchiveRoots(manifest)
      .filter((archiveRoot) =>
        predecessorDesignRegisterArchiveMatchesCurrent({ archiveRoot, manifest })
      )
      .map(designDepthFpEvaluatorRegisterPathForArchiveRoot)
      .filter((filePath) => existsSync(filePath) && statSync(filePath).isFile())
  );
}

function selectedFpEvaluateResultEvidenceRefs(input: {
  readonly registerPath: string;
}): readonly string[] {
  const registerRef = pathToFileURL(input.registerPath).href;
  const contentLedgerRef = contentLedgerRefForRegisterPath(input.registerPath);
  const ruleOutcomeRef = pathToFileURL(
    join(dirname(input.registerPath), DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE)
  ).href;
  if (!contentLedgerExistsForRegisterPath(input.registerPath)) {
    return Object.freeze([]);
  }
  const fpEvaluateResultPath = join(dirname(input.registerPath), "fp_evaluate_result.json");
  if (!existsSync(fpEvaluateResultPath) || !statSync(fpEvaluateResultPath).isFile()) {
    return Object.freeze([]);
  }
  try {
    const record = parseOpenRecord(
      JSON.parse(readFileSync(fpEvaluateResultPath, "utf8")),
      "SdlcFpEvaluateResult"
    );
    if (
      record["kind"] !== "sdlc_fp_evaluate_result" ||
      record["stage"] !== "F_P.evaluate" ||
      record["computeNotationStage"] !== "evaluate.C" ||
      record["stageAuthority"] !== "typed_fp_stage_carriers" ||
      record["postflightStatus"] !== "passed" ||
      record["status"] === "blocked"
    ) {
      return Object.freeze([]);
    }
    const compositionRef = nonEmptyStringValue(record["compositionRef"]);
    const compositionDigest = nonEmptyStringValue(record["compositionDigest"]);
    const compositionSelectionRef = nonEmptyStringValue(
      record["compositionSelectionRef"]
    );
    const selectedRegimeBindingRef = nullableStringValue(
      record["selectedRegimeBindingRef"]
    );
    if (
      compositionRef === null ||
      compositionDigest === null ||
      compositionSelectionRef === null
    ) {
      return Object.freeze([]);
    }
    const selectedComposition = objectRecord(record["selectedComposition"]);
    if (
      selectedComposition === null ||
      selectedComposition["compositionRef"] !== compositionRef ||
      selectedComposition["compositionDigest"] !== compositionDigest ||
      selectedComposition["compositionSelectionRef"] !== compositionSelectionRef ||
      (selectedComposition["selectedRegimeBindingRef"] ?? null) !==
        selectedRegimeBindingRef
    ) {
      return Object.freeze([]);
    }
    const findings = Array.isArray(record["findings"])
      ? record["findings"]
      : Object.freeze([]);
    const topLevelEvidenceRefs = stringListFromUnknown(record["evidenceRefs"]);
    if (!topLevelEvidenceRefs.includes(contentLedgerRef)) {
      return Object.freeze([]);
    }
    if (!topLevelEvidenceRefs.includes(ruleOutcomeRef)) {
      return Object.freeze([]);
    }
    const evaluationRuleOutcomeEvidenceRefs =
      persistedEvaluationRuleOutcomeEvidenceRefs({
        registerPath: input.registerPath
      });
    if (evaluationRuleOutcomeEvidenceRefs.length === 0) {
      return Object.freeze([]);
    }
    const contentLedgerEvidenceRefs = evaluationRuleOutcomeEvidenceRefs.filter(
      (ref) => ref === contentLedgerRef || ref === registerRef
    );
    const admittedContentLedgerEvidenceRefs = admitContentLedgerForRegisterPath({
      registerPath: input.registerPath,
      selectedCompositionRef: compositionRef,
      selectedCompositionDigest: compositionDigest,
      selectedCompositionSelectionRef: compositionSelectionRef,
      selectedRegimeBindingRef: nullableStringValue(
        parseOpenRecord(
          JSON.parse(
            readFileSync(
              join(
                dirname(input.registerPath),
                DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE
              ),
              "utf8"
            )
          ),
          "DesignDepthFpEvaluatorRuleOutcome"
        )["selectedRegimeBindingRef"]
      )
    });
    if (admittedContentLedgerEvidenceRefs.length === 0) {
      return Object.freeze([]);
    }
    const matchingFindingRefs: string[] = [];
    for (const finding of findings) {
      const findingRecord = objectRecord(finding);
      if (findingRecord === null) {
        continue;
      }
      if (
        findingRecord["compositionRef"] !== compositionRef ||
        findingRecord["compositionDigest"] !== compositionDigest
      ) {
        continue;
      }
      const authorityRefs = stringListFromUnknown(findingRecord["authorityRefs"]);
      const evidenceRefs = stringListFromUnknown(findingRecord["evidenceRefs"]);
      const selectedEvidenceRefs = [
        ...authorityRefs,
        ...evidenceRefs,
        ...topLevelEvidenceRefs
      ];
      if (
        !selectedEvidenceRefs.includes(registerRef) ||
        !selectedEvidenceRefs.includes(contentLedgerRef)
      ) {
        continue;
      }
      const findingRef = nonEmptyStringValue(findingRecord["findingRef"]);
      if (findingRef !== null) {
        matchingFindingRefs.push(findingRef);
      }
      matchingFindingRefs.push(...authorityRefs, ...evidenceRefs);
    }
    if (matchingFindingRefs.length === 0) {
      return Object.freeze([]);
    }
    return uniqueSorted([
      pathToFileURL(fpEvaluateResultPath).href,
      contentLedgerRef,
      registerRef,
      ...evaluationRuleOutcomeEvidenceRefs,
      ...admittedContentLedgerEvidenceRefs,
      ...contentLedgerEvidenceRefs,
      ...topLevelEvidenceRefs,
      ...matchingFindingRefs
    ]);
  } catch {
    return Object.freeze([]);
  }
}

function evaluationRuleOutcomeEvidenceRefsForFile(input: {
  readonly registerPath: string;
  readonly filePath: string;
}): readonly string[] {
  const registerRef = pathToFileURL(input.registerPath).href;
  const contentLedgerRef = contentLedgerRefForRegisterPath(input.registerPath);
  if (!contentLedgerExistsForRegisterPath(input.registerPath)) {
    return Object.freeze([]);
  }
  try {
    const record = parseOpenRecord(
      JSON.parse(readFileSync(input.filePath, "utf8")),
      "DesignDepthFpEvaluatorRuleOutcome"
    );
    if (
      record["kind"] !== "evaluation_rule_outcome" ||
      record["status"] !== "accepted" ||
      record["ruleRef"] !== DESIGN_DEPTH_FP_EVALUATOR_RULE_REF ||
      record["ruleRole"] !== "semantic_judgment" ||
      record["computeMeans"] !== "F_P"
    ) {
      return Object.freeze([]);
    }
    const producedRegisterRefs = stringListFromUnknown(record["producedRegisterRefs"]);
    if (
      !producedRegisterRefs.includes(registerRef) ||
      !producedRegisterRefs.includes(contentLedgerRef)
    ) {
      return Object.freeze([]);
    }
    const selectedCompositionRef = nonEmptyStringValue(
      record["selectedCompositionRef"]
    );
    const selectedCompositionDigest = nonEmptyStringValue(
      record["selectedCompositionDigest"]
    );
    const selectedCompositionSelectionRef = nonEmptyStringValue(
      record["selectedCompositionSelectionRef"]
    );
    const selectedRegimeBindingRef = nullableStringValue(
      record["selectedRegimeBindingRef"]
    );
    if (
      selectedCompositionRef === null ||
      selectedCompositionDigest === null ||
      selectedCompositionSelectionRef === null
    ) {
      return Object.freeze([]);
    }
    const contentLedgerEvidenceRefs = admitContentLedgerForRegisterPath({
      registerPath: input.registerPath,
      selectedCompositionRef,
      selectedCompositionDigest,
      selectedCompositionSelectionRef,
      selectedRegimeBindingRef
    });
    if (contentLedgerEvidenceRefs.length === 0) {
      return Object.freeze([]);
    }
    return uniqueSorted([
      pathToFileURL(input.filePath).href,
      contentLedgerRef,
      registerRef,
      ...contentLedgerEvidenceRefs,
      ...producedRegisterRefs,
      ...stringListFromUnknown(record["evidenceRefs"]),
      ...stringListFromUnknown(record["findingRefs"])
    ]);
  } catch {
    return Object.freeze([]);
  }
}

function persistedEvaluationRuleOutcomeEvidenceRefs(input: {
  readonly registerPath: string;
}): readonly string[] {
  const filePath = join(
    dirname(input.registerPath),
    DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE
  );
  return existsSync(filePath) && statSync(filePath).isFile()
    ? evaluationRuleOutcomeEvidenceRefsForFile({
        registerPath: input.registerPath,
        filePath
      })
    : Object.freeze([]);
}

function runtimeEvaluationRuleOutcomeEvidenceRefs(input: {
  readonly registerPath: string;
  readonly explicitEvidenceRefs?: readonly string[] | undefined;
}): readonly string[] {
  for (const ref of uniqueSorted(input.explicitEvidenceRefs ?? [])) {
    const filePath = refToExistingFilePath(ref);
    if (
      filePath === null ||
      filePath !==
        join(dirname(input.registerPath), DESIGN_DEPTH_FP_EVALUATOR_RULE_OUTCOME_FILE)
    ) {
      continue;
    }
    const evidenceRefs = evaluationRuleOutcomeEvidenceRefsForFile({
      registerPath: input.registerPath,
      filePath
    });
    if (evidenceRefs.length > 0) {
      return evidenceRefs;
    }
  }
  return Object.freeze([]);
}

export function admittedDesignDepthFpEvaluatorRegisterEvidenceRefs(
  manifest: SdlcWorkerHandoffManifest,
  fpEvaluatorAdmissionEvidenceRefs: readonly string[] = Object.freeze([])
): readonly string[] {
  const admission =
    fpEvaluatorAdmissionEvidenceRefs.length > 0
      ? admitImplementationDesignRegisterForRuntimeEvaluation({
          manifest,
          fpEvaluatorAdmissionEvidenceRefs
        })
      : admitImplementationDesignRegisterForManifest({
          manifest
        });
  return admission.status === "admitted"
    ? admission.evidenceRefs
    : Object.freeze([]);
}

function implementationDesignRegisterPathsForManifest(
  manifest: SdlcWorkerHandoffManifest
): readonly string[] {
  const currentEvaluatorRegisterPath = designDepthFpEvaluatorRegisterPath(manifest);
  return manifest.targetAssetType === "implementation_design_surface" &&
    existsSync(currentEvaluatorRegisterPath)
    ? Object.freeze([currentEvaluatorRegisterPath])
    : predecessorDesignDepthFpEvaluatorRegisterPaths(manifest);
}

function admitSingleImplementationDesignRegisterPath(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly evaluatorRegisterPath: string;
  readonly fpEvaluatorAdmissionEvidenceRefs?: readonly string[] | undefined;
}): SdlcDesignDepthRegisterAdmission {
  const admission = admitDesignDepthRegisterFromArtifact({
    targetAssetType: "implementation_design_surface",
    outputFile: input.evaluatorRegisterPath,
    archiveRoot: input.manifest.archiveRoot,
    requireSourceFileTargets: true
  });
  return admission.status === "admitted"
    ? Object.freeze({
        ...admission,
        evidenceRefs: uniqueSorted([
          ...admission.evidenceRefs,
          ...(input.fpEvaluatorAdmissionEvidenceRefs ?? [])
        ])
      })
    : admission;
}

export function admitDesignDepthFpEvaluatorRegisterArtifact(input: {
  readonly registerPath: string;
  readonly archiveRoot?: string | null | undefined;
}): SdlcDesignDepthRegisterAdmission {
  const admission = admitDesignDepthRegisterFromArtifact({
    targetAssetType: "implementation_design_surface",
    outputFile: input.registerPath,
    archiveRoot: input.archiveRoot ?? null,
    requireSourceFileTargets: true
  });
  if (admission.status !== "admitted") {
    return admission;
  }
  const fpEvaluatorAdmissionEvidenceRefs = selectedFpEvaluateResultEvidenceRefs({
    registerPath: input.registerPath
  });
  if (fpEvaluatorAdmissionEvidenceRefs.length === 0) {
    return Object.freeze({
      kind: "sdlc_design_depth_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: "implementation_design_surface",
      register: null,
      blockingReasons: Object.freeze([
        "design_depth_fp_evaluator_register_unadmitted"
      ]),
      evidenceRefs: Object.freeze([pathToFileURL(input.registerPath).href])
    });
  }
  return Object.freeze({
    ...admission,
    evidenceRefs: uniqueSorted([
      ...admission.evidenceRefs,
      ...fpEvaluatorAdmissionEvidenceRefs
    ])
  });
}

export function admitImplementationDesignRegisterCandidateForManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
}): SdlcDesignDepthRegisterAdmission {
  const currentEvaluatorRegisterPath = designDepthFpEvaluatorRegisterPath(
    input.manifest
  );
  return admitSingleImplementationDesignRegisterPath({
    manifest: input.manifest,
    evaluatorRegisterPath: currentEvaluatorRegisterPath
  });
}

export function admitImplementationDesignRegisterForRuntimeEvaluation(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
  readonly fpEvaluatorAdmissionEvidenceRefs?: readonly string[] | undefined;
}): SdlcDesignDepthRegisterAdmission {
  const currentEvaluatorRegisterPath = designDepthFpEvaluatorRegisterPath(
    input.manifest
  );
  const evaluatorRegisterPaths = implementationDesignRegisterPathsForManifest(
    input.manifest
  );
  if (evaluatorRegisterPaths.length > 1) {
    return Object.freeze({
      kind: "sdlc_design_depth_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: "implementation_design_surface",
      register: null,
      blockingReasons: Object.freeze([
        "design_depth_fp_evaluator_register_ambiguous"
      ]),
      evidenceRefs: Object.freeze(
        evaluatorRegisterPaths.map((filePath) => pathToFileURL(filePath).href)
      )
    });
  }
  const evaluatorRegisterPath = evaluatorRegisterPaths[0] ?? null;
  if (evaluatorRegisterPath !== null) {
    const structuralAdmission = admitSingleImplementationDesignRegisterPath({
      manifest: input.manifest,
      evaluatorRegisterPath
    });
    if (structuralAdmission.status !== "admitted") {
      return structuralAdmission;
    }
    const fpEvaluatorAdmissionEvidenceRefs =
      runtimeEvaluationRuleOutcomeEvidenceRefs({
        registerPath: evaluatorRegisterPath,
        explicitEvidenceRefs: input.fpEvaluatorAdmissionEvidenceRefs
      });
    if (fpEvaluatorAdmissionEvidenceRefs.length === 0) {
      return Object.freeze({
        kind: "sdlc_design_depth_register_admission" as const,
        status: "rejected" as const,
        targetAssetType: "implementation_design_surface",
        register: null,
        blockingReasons: Object.freeze([
          "design_depth_fp_evaluator_register_unadmitted"
        ]),
        evidenceRefs: Object.freeze([pathToFileURL(evaluatorRegisterPath).href])
      });
    }
    return Object.freeze({
      ...structuralAdmission,
      evidenceRefs: uniqueSorted([
        ...structuralAdmission.evidenceRefs,
        ...fpEvaluatorAdmissionEvidenceRefs
      ])
    });
  }
  return Object.freeze({
    kind: "sdlc_design_depth_register_admission" as const,
    status: "rejected" as const,
    targetAssetType: "implementation_design_surface",
    register: null,
    blockingReasons: Object.freeze([
      "design_depth_fp_evaluator_register_missing"
    ]),
    evidenceRefs: Object.freeze([
      pathToFileURL(currentEvaluatorRegisterPath).href
    ])
  });
}

export function admitImplementationDesignRegisterForManifest(input: {
  readonly manifest: SdlcWorkerHandoffManifest;
}): SdlcDesignDepthRegisterAdmission {
  const currentEvaluatorRegisterPath = designDepthFpEvaluatorRegisterPath(
    input.manifest
  );
  const evaluatorRegisterPaths = implementationDesignRegisterPathsForManifest(
    input.manifest
  );
  if (evaluatorRegisterPaths.length > 1) {
    return Object.freeze({
      kind: "sdlc_design_depth_register_admission" as const,
      status: "rejected" as const,
      targetAssetType: "implementation_design_surface",
      register: null,
      blockingReasons: Object.freeze([
        "design_depth_fp_evaluator_register_ambiguous"
      ]),
      evidenceRefs: Object.freeze(
        evaluatorRegisterPaths.map((filePath) => pathToFileURL(filePath).href)
      )
    });
  }
  const evaluatorRegisterPath = evaluatorRegisterPaths[0] ?? null;
  if (evaluatorRegisterPath !== null) {
    const structuralAdmission = admitSingleImplementationDesignRegisterPath({
      manifest: input.manifest,
      evaluatorRegisterPath
    });
    if (structuralAdmission.status !== "admitted") {
      return structuralAdmission;
    }
    const fpEvaluatorAdmissionEvidenceRefs = selectedFpEvaluateResultEvidenceRefs({
      registerPath: evaluatorRegisterPath
    });
    if (fpEvaluatorAdmissionEvidenceRefs.length === 0) {
      return Object.freeze({
        kind: "sdlc_design_depth_register_admission" as const,
        status: "rejected" as const,
        targetAssetType: "implementation_design_surface",
        register: null,
        blockingReasons: Object.freeze([
          "design_depth_fp_evaluator_register_unadmitted"
        ]),
        evidenceRefs: Object.freeze([pathToFileURL(evaluatorRegisterPath).href])
      });
    }
    return Object.freeze({
      ...structuralAdmission,
      evidenceRefs: uniqueSorted([
        ...structuralAdmission.evidenceRefs,
        ...fpEvaluatorAdmissionEvidenceRefs
      ])
    });
  }
  return Object.freeze({
    kind: "sdlc_design_depth_register_admission" as const,
    status: "rejected" as const,
    targetAssetType: "implementation_design_surface",
    register: null,
    blockingReasons: Object.freeze([
      "design_depth_fp_evaluator_register_missing"
    ]),
    evidenceRefs: Object.freeze([
      pathToFileURL(currentEvaluatorRegisterPath).href
    ])
  });
}
