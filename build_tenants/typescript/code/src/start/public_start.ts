// Implements: REQ-F-ODDSDLC-003
// Implements: REQ-F-ODDSDLC-021
// Implements: REQ-F-ODDSDLC-029

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  admitExecutionBasis,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  admitStartIntent,
  constructConstructionPriorityRule,
  constructConstructionPriorityScheme,
  deriveAdvancementTransition,
  type AdvancementTransition,
  type GraphFunction,
  type ExecutionBasis,
  type Module,
  type RuntimeEvent,
  type RuntimeRegime
} from "@abiogenesis/typescript-tenant";
import {
  parseClosedRecord,
  parseEnumValue,
  parseNonEmptyString
} from "../shared/validation.js";
import {
  deriveSdlcTargetObligationBinding,
  type SdlcQueryDomainProjection
} from "../projection/index.js";
import {
  constructSdlcOverlayBinding,
  constructSdlcTraversalOverlayCatalog,
  FG_CONFORM_PROJECT,
  publicSdlcOverlayStartTargets,
  resolveSdlcTraversalOverlay,
  SDLC_FRAMEWORK_SMOKE_MIN_FP_OVERLAY_REF,
  sdlcGraphFunctionBoundaryRef,
  sdlcPublishedActionRef,
  sdlcTraversalOverlayForGraphFunction,
  type SdlcOverlayBinding,
  type SdlcTraversalOverlay,
  type SdlcTraversalOverlayRef
} from "../graph/index.js";
import {
  deriveOddSdlcEvaluateNextReport,
  type OddSdlcEvaluateNextActionInput
} from "../runtime/index.js";
import {
  constructSdlcConstructionIntent,
  constructSdlcNextActionProjection,
  type SdlcConstructionIntent,
  type SdlcNextActionProjection
} from "../operator/traversal_consequence.js";
import { deriveSdlcPreRuntimePlanningCompositionIdentity } from "../operator/composition_identity.js";
import {
  deriveSdlcDecompositionSummary,
  SDLC_DEFAULT_DECOMPOSITION_SUMMARY_THRESHOLDS
} from "../operator/decomposition_admission.js";
import { deriveSdlcTraversalHopSelection } from "../operator/traversal_complexity.js";
import { resolveSdlcTraversalOutcomeClass } from "../contracts/carrier_domain_catalog.js";
import type {
  SdlcDecompositionSummary,
  SdlcTraversalHopSelection,
  SdlcTraversalOutcomeClass
} from "../operator/carriers.js";
import type { SdlcConformProjectProfile } from "../workspace/index.js";
import { publicStartTargetPolicyFor } from "./policy.js";

export const SDLC_PUBLIC_START_TARGET_KIND_VALUES = Object.freeze([
  "next",
  "graph_function",
  "asset",
  "overlay"
] as const);

export type SdlcPublicStartTargetKind =
  (typeof SDLC_PUBLIC_START_TARGET_KIND_VALUES)[number];

export const SDLC_PUBLIC_START_UNTIL_VALUES = Object.freeze([
  "first_traversal",
  "blocked",
  "converged"
] as const);

export type SdlcPublicStartUntil =
  (typeof SDLC_PUBLIC_START_UNTIL_VALUES)[number];

export interface SdlcPublicStartRequest {
  readonly kind: "sdlc_public_start_request";
  readonly workspaceRoot: string;
  readonly outputWorkspaceRoot?: string | null;
  readonly target: {
    readonly kind: SdlcPublicStartTargetKind;
    readonly handle: string;
  };
  readonly until: SdlcPublicStartUntil;
  readonly defaultRegime: RuntimeRegime;
  readonly replayNextActionProjectionRef?: string | null;
  readonly replaySelectedActionRef?: string | null;
  readonly replayNextGraphFunctionRef?: string | null;
  readonly replayNextGraphVectorRef?: string | null;
  readonly replayClosureDecisionRef?: string | null;
  readonly replayOverlayRef?: string | null;
  readonly replayOverlayBindingRef?: string | null;
}

export interface SdlcWorkerAttachment {
  readonly kind: "sdlc_worker_attachment";
  readonly status: "attached" | "unattached";
  readonly transportContract: string | null;
  readonly blockingReason: "fp_worker_unattached" | null;
}

export interface SdlcExecutionContract {
  readonly kind: "sdlc_execution_contract";
  readonly targetGraphFunction: string;
  readonly overlayRef: string;
  readonly overlayBindingRef: string;
  readonly overlayBinding: SdlcOverlayBinding;
  readonly requestedUntil: SdlcPublicStartUntil;
  readonly conformedProject: SdlcConformProjectProfile;
  readonly basis: ExecutionBasis;
  readonly workerAttachment: SdlcWorkerAttachment;
  readonly nextActionProjection: SdlcNextActionProjection;
  readonly constructionIntent: SdlcConstructionIntent;
  readonly traversalDecompositionSummary: SdlcDecompositionSummary | null;
  readonly traversalHopSelection: SdlcTraversalHopSelection | null;
}

export type SdlcPublicStartOutcome =
  | {
      readonly kind: "sdlc_public_start_blocked";
      readonly status: "blocked";
      readonly blockingReason:
        | "fp_worker_unattached"
        | "target_unavailable"
        | "stale_query_domain"
        | "project_conformance_blocked";
      readonly stopPredicate: "worker_attachment_required" | "gap_stop";
      readonly executionContract: SdlcExecutionContract | null;
      readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
    }
  | {
      readonly kind: "sdlc_public_start_projected";
      readonly status: "dispatch_required" | "advanced" | "converged";
      readonly executionContract: SdlcExecutionContract;
      readonly transition: AdvancementTransition;
      readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
    };

export function admitSdlcPublicStartRequest(
  input: unknown,
  label = "SdlcPublicStartRequest"
): SdlcPublicStartRequest {
  const record = parseClosedRecord(input, label, [
    "workspaceRoot",
    "outputWorkspaceRoot",
    "target",
    "until",
    "defaultRegime",
    "replayNextActionProjectionRef",
    "replaySelectedActionRef",
    "replayNextGraphFunctionRef",
    "replayNextGraphVectorRef",
    "replayClosureDecisionRef",
    "replayOverlayRef",
    "replayOverlayBindingRef"
  ]);
  const target = parseClosedRecord(record["target"], `${label}.target`, [
    "kind",
    "handle"
  ]);
  return Object.freeze({
    kind: "sdlc_public_start_request",
    workspaceRoot: parseNonEmptyString(record["workspaceRoot"], `${label}.workspaceRoot`),
    outputWorkspaceRoot: record["outputWorkspaceRoot"] === undefined ||
      record["outputWorkspaceRoot"] === null
      ? null
      : parseNonEmptyString(
          record["outputWorkspaceRoot"],
          `${label}.outputWorkspaceRoot`
        ),
    target: Object.freeze({
      kind: parseEnumValue(
        target["kind"],
        `${label}.target.kind`,
        SDLC_PUBLIC_START_TARGET_KIND_VALUES
      ),
      handle: parseNonEmptyString(target["handle"], `${label}.target.handle`)
    }),
    until: parseEnumValue(record["until"], `${label}.until`, SDLC_PUBLIC_START_UNTIL_VALUES),
    defaultRegime: parseEnumValue(
      record["defaultRegime"],
      `${label}.defaultRegime`,
      ["F_D", "F_P", "F_H"]
    ),
    replayNextActionProjectionRef:
      record["replayNextActionProjectionRef"] === undefined ||
      record["replayNextActionProjectionRef"] === null
        ? null
        : parseNonEmptyString(
            record["replayNextActionProjectionRef"],
            `${label}.replayNextActionProjectionRef`
          ),
    replaySelectedActionRef:
      record["replaySelectedActionRef"] === undefined ||
      record["replaySelectedActionRef"] === null
        ? null
        : parseNonEmptyString(
            record["replaySelectedActionRef"],
            `${label}.replaySelectedActionRef`
          ),
    replayNextGraphFunctionRef:
      record["replayNextGraphFunctionRef"] === undefined ||
      record["replayNextGraphFunctionRef"] === null
        ? null
        : parseNonEmptyString(
            record["replayNextGraphFunctionRef"],
            `${label}.replayNextGraphFunctionRef`
          ),
    replayNextGraphVectorRef:
      record["replayNextGraphVectorRef"] === undefined ||
      record["replayNextGraphVectorRef"] === null
        ? null
        : parseNonEmptyString(
            record["replayNextGraphVectorRef"],
            `${label}.replayNextGraphVectorRef`
          ),
    replayClosureDecisionRef:
      record["replayClosureDecisionRef"] === undefined ||
      record["replayClosureDecisionRef"] === null
        ? null
        : parseNonEmptyString(
            record["replayClosureDecisionRef"],
            `${label}.replayClosureDecisionRef`
          ),
    replayOverlayRef:
      record["replayOverlayRef"] === undefined ||
      record["replayOverlayRef"] === null
        ? null
        : parseNonEmptyString(
            record["replayOverlayRef"],
            `${label}.replayOverlayRef`
          ),
    replayOverlayBindingRef:
      record["replayOverlayBindingRef"] === undefined ||
      record["replayOverlayBindingRef"] === null
        ? null
        : parseNonEmptyString(
            record["replayOverlayBindingRef"],
            `${label}.replayOverlayBindingRef`
          )
  });
}

export function projectSdlcWorkerAttachment(input: {
  readonly transportContract?: string | null;
}): SdlcWorkerAttachment {
  const rawTransportContract = input.transportContract ?? null;
  const transportContract =
    rawTransportContract === null
      ? null
      : parseNonEmptyString(
          rawTransportContract.trim(),
          "SdlcWorkerAttachment.transportContract"
        );
  return Object.freeze({
    kind: "sdlc_worker_attachment",
    status: transportContract === null ? "unattached" : "attached",
    transportContract,
    blockingReason: transportContract === null ? "fp_worker_unattached" : null
  });
}

interface PublicStartActionCandidate {
  readonly graphFunctionName: string;
  readonly graphFunctionRef: string;
  readonly actionRef: string;
  readonly targetOutcomeRef: string;
}

interface PublicStartEvaluation {
  readonly targetGraphFunction: string | null;
  readonly blockingReason: "target_unavailable" | "stale_query_domain" | null;
  readonly overlayBinding: SdlcOverlayBinding | null;
  readonly nextActionProjection: SdlcNextActionProjection | null;
  readonly constructionIntent: SdlcConstructionIntent | null;
  readonly traversalDecompositionSummary: SdlcDecompositionSummary | null;
  readonly traversalHopSelection: SdlcTraversalHopSelection | null;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function statSafe(target: string) {
  try {
    return statSync(target);
  } catch {
    return null;
  }
}

function jsonRecordFromFile(filePath: string): Readonly<Record<string, unknown>> | null {
  const stats = statSafe(filePath);
  if (stats === null || !stats.isFile()) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function stringField(
  record: Readonly<Record<string, unknown>> | null,
  field: string
): string | null {
  const value = record?.[field];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function isSdlcTraversalOverlayRef(value: string): value is SdlcTraversalOverlayRef {
  return value.startsWith("overlay://odd-sdlc/") &&
    value.length > "overlay://odd-sdlc/".length;
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)]);
}

function capabilityValue(
  profile: SdlcConformProjectProfile,
  name: string
): string | null {
  return profile.capabilityContracts.find((contract) => contract.name === name)
    ?.value ?? null;
}

function truthyCapability(profile: SdlcConformProjectProfile, name: string): boolean {
  const normalized = capabilityValue(profile, name)?.trim().toLowerCase() ?? "";
  return (
    normalized === "1" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

function traversalOutcomeClassForPublicStart(
  profile: SdlcConformProjectProfile
): SdlcTraversalOutcomeClass {
  return resolveSdlcTraversalOutcomeClass({
    explicitValue: capabilityValue(profile, "sdlc_outcome_class"),
    trivialProduct: truthyCapability(profile, "trivial_product")
  }).outcomeClass;
}

function frontDoorTraversalSelection(input: {
  readonly request: SdlcPublicStartRequest;
  readonly profile: SdlcConformProjectProfile;
}): {
  readonly summary: SdlcDecompositionSummary;
  readonly selection: SdlcTraversalHopSelection;
} | null {
  if (input.request.target.kind !== "next") {
    return null;
  }
  const outcomeClass = traversalOutcomeClassForPublicStart(input.profile);
  if (outcomeClass === "domain_product") {
    return null;
  }
  const upstreamRef = `requirement://odd-sdlc/public-start/${input.profile.projectSlug}/framework-smoke`;
  const summary = deriveSdlcDecompositionSummary({
    stageId: "public_start_framework_smoke_min_fp",
    upstreamKind: "requirement",
    downstreamKind: "component",
    thresholds: SDLC_DEFAULT_DECOMPOSITION_SUMMARY_THRESHOLDS,
    stageUpstreamUniverseRefs: [upstreamRef],
    requireTrivialDegenerateProduct: true,
    rows: [
      {
        downstreamId: "component://framework-smoke/hello-world",
        parentId: "module://framework-smoke",
        ownedUpstreamRefs: [upstreamRef],
        publicBoundaryRefs: [
          `${input.profile.selectedOutputRoot}/src`
        ],
        substantiveResponsibilityRefs: ["behavior://framework-smoke/hello-world"],
        materializationTargetRefs: [
          `${input.profile.selectedOutputRoot}/src`
        ]
      }
    ]
  });
  const selection = deriveSdlcTraversalHopSelection({
    selectionRef: `selection://odd-sdlc/public-start/${input.profile.projectSlug}/framework-smoke-min-fp`,
    outcomeClass,
    decompositionSummary: summary,
    bundleEligible: true,
    skippedEdgeRefs: [
      "edge://odd-sdlc/current-full-traversal/derive_intent_surface",
      "edge://odd-sdlc/current-full-traversal/derive_product_surface",
      "edge://odd-sdlc/current-full-traversal/derive_goal_surface",
      "edge://odd-sdlc/current-full-traversal/derive_requirement_surface",
      "edge://odd-sdlc/current-full-traversal/derive_uat_testcases_surface",
      "edge://odd-sdlc/current-full-traversal/derive_testcase_authority_surface",
      "edge://odd-sdlc/current-full-traversal/derive_feature_decomp_surface",
      "edge://odd-sdlc/current-full-traversal/derive_design_surface",
      "edge://odd-sdlc/current-full-traversal/derive_scenario_surface",
      "edge://odd-sdlc/current-full-traversal/derive_implementation_design_surface",
      "edge://odd-sdlc/current-full-traversal/derive_component_code_surface",
      "edge://odd-sdlc/current-full-traversal/derive_component_test_surface",
      "edge://odd-sdlc/current-full-traversal/derive_test_execution_result_surface",
      "edge://odd-sdlc/current-full-traversal/prepare_release_surface"
    ],
    evidenceRefs: [
      "capability://odd-sdlc/trivial_product",
      "overlay://odd-sdlc/framework-smoke-min-fp"
    ]
  });
  return Object.freeze({ summary, selection });
}

function workspaceRootsForMaterialObservation(
  request: SdlcPublicStartRequest
): readonly string[] {
  return uniqueStrings([
    ...(request.outputWorkspaceRoot === null ||
    request.outputWorkspaceRoot === undefined
      ? []
      : [request.outputWorkspaceRoot]),
    request.workspaceRoot
  ]);
}

function observedOverlayMaterialAssetRefs(input: {
  readonly request: SdlcPublicStartRequest;
  readonly overlay: SdlcTraversalOverlay;
  readonly observationRef: string;
}): readonly {
  readonly assetType: string;
  readonly assetRef: string;
  readonly relativePath: string;
  readonly evidenceRefs: readonly string[];
}[] {
  const observed: {
    readonly assetType: string;
    readonly assetRef: string;
    readonly relativePath: string;
    readonly evidenceRefs: readonly string[];
  }[] = [];
  for (const template of input.overlay.assetTemplates) {
    for (const root of workspaceRootsForMaterialObservation(input.request)) {
      const absolutePath = path.resolve(root, template.defaultPath);
      const stats = statSafe(absolutePath);
      if (stats === null || (!stats.isFile() && !stats.isDirectory())) {
        continue;
      }
      const assetRef = pathToFileURL(absolutePath).href;
      observed.push(Object.freeze({
        assetType: template.assetType,
        assetRef,
        relativePath: template.defaultPath,
        evidenceRefs: Object.freeze([
          input.observationRef,
          assetRef
        ])
      }));
      break;
    }
  }
  return Object.freeze(observed);
}

function operatorRunRootsNewestFirst(workspaceRoot: string): readonly string[] {
  const root = path.join(
    workspaceRoot,
    ".ai-workspace/runtime/odd_sdlc/operator-runs"
  );
  if (!existsSync(root) || statSafe(root)?.isDirectory() !== true) {
    return Object.freeze([]);
  }
  return Object.freeze(
    readdirSync(root)
      .map((entry) => path.join(root, entry))
      .filter((entryPath) => statSafe(entryPath)?.isDirectory() === true)
      .sort((left, right) =>
        (statSafe(right)?.mtimeMs ?? 0) - (statSafe(left)?.mtimeMs ?? 0)
      )
  );
}

function priorOverlayTruthRefs(input: {
  readonly request: SdlcPublicStartRequest;
  readonly overlay: SdlcTraversalOverlay;
}): {
  readonly priorLedgerRefs: readonly string[];
  readonly priorEventRefs: readonly string[];
} {
  if (input.overlay.predecessorOverlayRefs.length === 0) {
    return Object.freeze({
      priorLedgerRefs: Object.freeze([]),
      priorEventRefs: Object.freeze([])
    });
  }
  const predecessorOverlayRefs = new Set<SdlcTraversalOverlayRef>(
    input.overlay.predecessorOverlayRefs
  );
  const ledgerRefs: string[] = [];
  const eventRefs: string[] = [];
  for (const root of workspaceRootsForMaterialObservation(input.request)) {
    for (const archiveRoot of operatorRunRootsNewestFirst(root)) {
      const ledger = jsonRecordFromFile(
        path.join(archiveRoot, "sdlc_edge_fulfillment_ledger.json")
      );
      const closure = jsonRecordFromFile(
        path.join(archiveRoot, "sdlc_edge_closure_decision.json")
      );
      const projection = jsonRecordFromFile(
        path.join(archiveRoot, "sdlc_next_action_projection.json")
      );
      const overlayRef =
        stringField(ledger, "overlayRef") ??
        stringField(closure, "overlayRef") ??
        stringField(projection, "overlayRef");
      if (
        overlayRef === null ||
        !isSdlcTraversalOverlayRef(overlayRef) ||
        !predecessorOverlayRefs.has(overlayRef)
      ) {
        continue;
      }
      if (stringField(closure, "disposition") !== "close") {
        continue;
      }
      const ledgerRef =
        stringField(ledger, "ledgerVersionRef") ?? stringField(ledger, "ledgerRef");
      if (ledgerRef !== null) {
        ledgerRefs.push(ledgerRef);
      }
      const runtimeEventArchive = path.join(archiveRoot, "runtime_events.json");
      if (statSafe(runtimeEventArchive)?.isFile() === true) {
        eventRefs.push(pathToFileURL(runtimeEventArchive).href);
      }
    }
  }
  return Object.freeze({
    priorLedgerRefs: uniqueStrings(ledgerRefs),
    priorEventRefs: uniqueStrings(eventRefs)
  });
}

function graphFunctionByName(
  module: Module,
  graphFunctionName: string
): GraphFunction | null {
  return module.graphFunctions.find(
    (graphFunction) => graphFunction.name === graphFunctionName
  ) ?? null;
}

function candidateForGraphFunction(input: {
  readonly module: Module;
  readonly graphFunctionName: string;
  readonly sourceRef: string;
}): PublicStartActionCandidate | null {
  const graphFunction = graphFunctionByName(
    input.module,
    input.graphFunctionName
  );
  if (graphFunction === null) {
    return null;
  }
  const safeName = input.graphFunctionName.replaceAll("/", "_");
  const graphFunctionRef = sdlcGraphFunctionBoundaryRef(graphFunction);
  return Object.freeze({
    graphFunctionName: input.graphFunctionName,
    graphFunctionRef,
    actionRef:
      `construction-action://odd-sdlc/public-start/${safeName}`,
    targetOutcomeRef:
      `outcome://odd-sdlc/public-start/${input.sourceRef}/${safeName}`
  });
}

function publicStartIntentRef(request: SdlcPublicStartRequest): string {
  return [
    "event://odd-sdlc/public-start-intent",
    request.target.kind,
    request.target.handle
  ].join("/");
}

function publicStartProductModelRef(request: SdlcPublicStartRequest): string {
  return [
    "product-asset-model://odd-sdlc/public-start",
    request.target.kind,
    request.target.handle
  ].join("/");
}

function workspaceIdentityRefFor(request: SdlcPublicStartRequest): string {
  return [
    "workspace://odd-sdlc/public-start",
    encodeURIComponent(request.workspaceRoot)
  ].join("/");
}

function workspaceFingerprintRefFor(input: {
  readonly request: SdlcPublicStartRequest;
  readonly observationRef: string;
}): string {
  return [
    "workspace-fingerprint://odd-sdlc/public-start",
    encodeURIComponent(input.request.workspaceRoot),
    encodeURIComponent(input.observationRef)
  ].join("/");
}

function evaluateInitialPublicStartAction(input: {
  readonly request: SdlcPublicStartRequest;
  readonly module: Module;
  readonly queryDomain: SdlcQueryDomainProjection;
  readonly conformedProject: SdlcConformProjectProfile;
}): PublicStartEvaluation {
  const targetPolicy = publicStartTargetPolicyFor(input.request.target.kind);
  let overlayCatalog: ReturnType<typeof constructSdlcTraversalOverlayCatalog> | null = null;
  const getOverlayCatalog = (): ReturnType<typeof constructSdlcTraversalOverlayCatalog> => {
    if (overlayCatalog === null) {
      overlayCatalog = constructSdlcTraversalOverlayCatalog({
        module: input.module
      });
    }
    return overlayCatalog;
  };
  let candidates: readonly PublicStartActionCandidate[];
  let blockingReason: "target_unavailable" | "stale_query_domain" | null = null;
  let preferredTargetOutcomeRef: string | null = null;
  let requestedOverlay: SdlcTraversalOverlay | null = null;
  const selectedTraversal = frontDoorTraversalSelection({
    request: input.request,
    profile: input.conformedProject
  });
  const sourceRef = `${input.request.target.kind}/${input.request.target.handle}`;
  const replayNextGraphFunctionRef =
    input.request.replayNextGraphFunctionRef ?? null;
  if (targetPolicy.resolver === "published_start_targets") {
    const conformanceStatus = input.queryDomain.projectConformance?.status ?? null;
    if (replayNextGraphFunctionRef !== null) {
      const candidate = candidateForGraphFunction({
        module: input.module,
        graphFunctionName: replayNextGraphFunctionRef,
        sourceRef
      });
      candidates = Object.freeze(candidate === null ? [] : [candidate]);
      blockingReason = candidate === null ? "stale_query_domain" : null;
      preferredTargetOutcomeRef = candidate?.targetOutcomeRef ?? null;
    } else {
      const minFpOverlay =
        selectedTraversal === null
          ? null
          : resolveSdlcTraversalOverlay({
              catalog: getOverlayCatalog(),
              overlayRef: SDLC_FRAMEWORK_SMOKE_MIN_FP_OVERLAY_REF
            });
      const profileOverlay =
        conformanceStatus === "blocked"
          ? null
          : minFpOverlay ?? resolveSdlcTraversalOverlay({
              catalog: getOverlayCatalog(),
              overlayRef: input.conformedProject.overlayRef
            });
      if (profileOverlay !== null) {
        requestedOverlay = profileOverlay;
        const candidate = candidateForGraphFunction({
          module: input.module,
          graphFunctionName: profileOverlay.defaultStartTarget,
          sourceRef
        });
        candidates = Object.freeze(candidate === null ? [] : [candidate]);
        blockingReason = candidate === null ? "stale_query_domain" : null;
        preferredTargetOutcomeRef = candidate?.targetOutcomeRef ?? null;
      } else {
        const startTargets = publicSdlcOverlayStartTargets({
          module: input.module,
          catalog: getOverlayCatalog(),
          projectConformanceStatus: conformanceStatus
        });
        candidates = Object.freeze(
          startTargets
            .map((target) =>
              candidateForGraphFunction({
                module: input.module,
                graphFunctionName: target.name,
                sourceRef
              })
            )
            .filter(
              (
                candidate
              ): candidate is PublicStartActionCandidate => candidate !== null
            )
        );
        blockingReason =
          startTargets.length === 0 ? "target_unavailable" : null;
        preferredTargetOutcomeRef = candidates[0]?.targetOutcomeRef ?? null;
      }
    }
  } else if (targetPolicy.resolver === "named_graph_function") {
    const published = input.queryDomain.graphFunctions.some(
      (graphFunction) => graphFunction.name === input.request.target.handle
    );
    const candidate = candidateForGraphFunction({
      module: input.module,
      graphFunctionName: input.request.target.handle,
      sourceRef
    });
    if (published && candidate === null) {
      return Object.freeze({
        targetGraphFunction: input.request.target.handle,
        blockingReason: "stale_query_domain",
        overlayBinding: null,
        nextActionProjection: null,
        constructionIntent: null,
        traversalDecompositionSummary: null,
        traversalHopSelection: null
      });
    }
    candidates = Object.freeze(candidate === null ? [] : [candidate]);
    blockingReason = candidate === null ? "target_unavailable" : null;
  } else if (targetPolicy.resolver === "overlay_catalog_binding") {
    requestedOverlay = resolveSdlcTraversalOverlay({
      catalog: getOverlayCatalog(),
      overlayRef: input.request.target.handle
    });
    if (requestedOverlay === null) {
      return Object.freeze({
        targetGraphFunction: null,
        blockingReason: "target_unavailable",
        overlayBinding: null,
        nextActionProjection: null,
        constructionIntent: null,
        traversalDecompositionSummary: null,
        traversalHopSelection: null
      });
    }
    let selectedGraphFunctionName = requestedOverlay.defaultStartTarget;
    if (input.queryDomain.projectConformance?.status === "blocked") {
      const conformGraphFunction = graphFunctionByName(input.module, FG_CONFORM_PROJECT);
      const conformGraphFunctionRef =
        conformGraphFunction === null
          ? null
          : sdlcGraphFunctionBoundaryRef(conformGraphFunction);
      if (
        conformGraphFunctionRef !== null &&
        requestedOverlay.graphFunctionRefs.includes(conformGraphFunctionRef)
      ) {
        selectedGraphFunctionName = FG_CONFORM_PROJECT;
      }
    }
    const candidate = candidateForGraphFunction({
      module: input.module,
      graphFunctionName: selectedGraphFunctionName,
      sourceRef
    });
    candidates = Object.freeze(candidate === null ? [] : [candidate]);
    blockingReason = candidate === null ? "stale_query_domain" : null;
    preferredTargetOutcomeRef = candidate?.targetOutcomeRef ?? null;
  } else {
    const binding = deriveSdlcTargetObligationBinding({
      queryDomain: input.queryDomain,
      targetAssetType: input.request.target.handle,
      evidenceRefs: ["public-start://odd-sdlc/target-request"]
    });
    candidates = Object.freeze(
      binding.admissibleGraphFunctionNames
        .map((name) =>
          candidateForGraphFunction({
            module: input.module,
            graphFunctionName: name,
            sourceRef
          })
        )
        .filter(
          (
            candidate
          ): candidate is PublicStartActionCandidate => candidate !== null
        )
    );
    blockingReason =
      binding.status === "stale_action_publication"
        ? "stale_query_domain"
        : binding.status === "no_published_action"
          ? "target_unavailable"
          : candidates.length === 0
            ? "stale_query_domain"
            : null;
  }
  if (candidates.length === 0) {
    return Object.freeze({
      targetGraphFunction: null,
      blockingReason: blockingReason ?? "target_unavailable",
      overlayBinding: null,
      nextActionProjection: null,
      constructionIntent: null,
      traversalDecompositionSummary: null,
      traversalHopSelection: null
    });
  }
  const targetOutcomeRefs = Object.freeze(
    candidates.map((candidate) => candidate.targetOutcomeRef)
  );
  const actions: readonly OddSdlcEvaluateNextActionInput[] = Object.freeze(
    candidates.map((candidate) =>
        Object.freeze({
          actionRef: candidate.actionRef,
          actionKind: "invoke_graph_function" as const,
          graphFunctionRef: candidate.graphFunctionRef,
          graphVectorRef: null,
          publishedTraversalTargetRef: sdlcPublishedActionRef({
            graphFunctionRef: candidate.graphFunctionRef
          }),
          targetOutcomeRef: candidate.targetOutcomeRef,
          inputAssetRefs: Object.freeze([]),
          expectedOutputAssetRefs: Object.freeze([candidate.targetOutcomeRef]),
          requiredAuthorityRefs: Object.freeze([
            sdlcPublishedActionRef({ graphFunctionRef: candidate.graphFunctionRef })
          ]),
        eligibleReasonRefs: Object.freeze([
          "public_start_evaluate_next_initial_selection"
        ])
      })
    )
  );
  const evaluator = deriveOddSdlcEvaluateNextReport({
    basis: admitExecutionBasis({
      startIntent: admitStartIntent({
        scope: {
          kind: "workspace",
          workspaceRoot: input.request.workspaceRoot,
          moduleName: input.module.name
        },
        target: {
          kind: "graph_function",
          handle: candidates[0]?.graphFunctionName ?? ""
        },
        until: input.request.until
      }),
      module: input.module,
      runtimeIdentity: admitResolvedRuntimeIdentity({
        workerId: "worker://odd-sdlc/typescript",
        backendId: "backend://node",
        buildId: "build://odd-sdlc/typescript",
        resolvedRuntimeRef: "runtime://abiogenesis/typescript"
      }),
      resolvedPolicy: admitResolvedPolicyIdentity({
        resolvedPolicyBundleRef: `policy://odd-sdlc/public-start/evaluate-next/${input.request.defaultRegime}`,
        defaultRegime: input.request.defaultRegime,
        dispatchRef:
          input.request.defaultRegime === "F_P"
            ? "dispatch://odd-sdlc/public-start/evaluate-next"
            : null,
        approvalSubjectRef:
          input.request.defaultRegime === "F_H"
            ? "approval://odd-sdlc/public-start/evaluate-next"
            : null
      }),
      runId: "run://odd-sdlc/public-start/evaluate-next",
      workKey: "wk://odd-sdlc/public-start/evaluate-next",
      frameId: null,
      frameLineageId: null
    }),
    events: Object.freeze([]),
    nextActionBasisKind: "initial_selection",
    intentEventRefs: Object.freeze([publicStartIntentRef(input.request)]),
    productAssetModelRef: publicStartProductModelRef(input.request),
    episodeId:
      `construction-episode://odd-sdlc/public-start/${sourceRef}`,
    observationId:
      `construction-observation://odd-sdlc/public-start/${sourceRef}`,
    pressures: Object.freeze([
      {
        pressureRef:
          `pressure://odd-sdlc/public-start/${sourceRef}`,
        pressureKind: "gap_row",
        sourceRef: publicStartIntentRef(input.request),
        affectedAssetRefs: targetOutcomeRefs,
        targetOutcomeRefs,
        evidenceRefs: Object.freeze(["public-start://odd-sdlc/target-request"]),
        severity: 1
      }
    ]),
    actions,
    ...(preferredTargetOutcomeRef === null
      ? {}
      : {
          priorityScheme: constructConstructionPriorityScheme({
            schemeRef:
              `priority-scheme://odd-sdlc/public-start/${sourceRef}`,
            sourcePolicyRef: "policy://odd-sdlc/public-start/published-order",
            rules: Object.freeze([
              constructConstructionPriorityRule({
                priorityRuleRef:
                  `priority-rule://odd-sdlc/public-start/${sourceRef}/preferred`,
                axis: "gap_repair",
                weight: 1000,
                appliesToActionKinds: Object.freeze(["invoke_graph_function"]),
                appliesToOutcomeRefs: Object.freeze([preferredTargetOutcomeRef]),
                sourcePolicyRef:
                  "policy://odd-sdlc/public-start/published-order",
                strategyLabel: "public_start_published_target_order"
              })
            ])
          })
        })
  });
  const selected = evaluator.selectedPriorityRow;
  const selectedCandidate =
    selected === null
      ? null
      : candidates.find((candidate) => candidate.actionRef === selected.actionRef) ??
        null;
  if (selected === null || selectedCandidate === null) {
    return Object.freeze({
      targetGraphFunction: null,
      blockingReason: blockingReason ?? "target_unavailable",
      overlayBinding: null,
      nextActionProjection: null,
      constructionIntent: null,
      traversalDecompositionSummary: null,
      traversalHopSelection: null
    });
  }
  const selectedActionRef =
    input.request.replaySelectedActionRef ?? selected.actionRef;
  const replayOverlay =
    input.request.replayOverlayRef === null ||
    input.request.replayOverlayRef === undefined
      ? null
      : resolveSdlcTraversalOverlay({
          catalog: getOverlayCatalog(),
          overlayRef: input.request.replayOverlayRef
        });
  const selectedOverlay = requestedOverlay ?? replayOverlay ??
    sdlcTraversalOverlayForGraphFunction({
      catalog: getOverlayCatalog(),
      graphFunctionRef: selectedCandidate.graphFunctionRef
    });
  if (
    (requestedOverlay !== null || replayOverlay !== null) &&
    !selectedOverlay.graphFunctionRefs.includes(selectedCandidate.graphFunctionRef)
  ) {
    return Object.freeze({
      targetGraphFunction: selectedCandidate.graphFunctionName,
      blockingReason: "stale_query_domain",
      overlayBinding: null,
      nextActionProjection: null,
      constructionIntent: null,
      traversalDecompositionSummary: null,
      traversalHopSelection: null
    });
  }
  const selectedGraphVectorRef = input.request.replayNextGraphVectorRef ?? null;
  const selectedComposition = deriveSdlcPreRuntimePlanningCompositionIdentity({
    graphFunctionRef: selectedCandidate.graphFunctionRef,
    graphVectorRef:
      selectedGraphVectorRef ?? `public-start:${selectedCandidate.graphFunctionRef}`,
    compositionSelectionScopeRef:
      input.request.replayNextActionProjectionRef ??
      evaluator.priorityProjection.projectionRef,
    carrierContextRefs: Object.freeze([
      evaluator.priorityProjection.projectionRef,
      evaluator.observation.observationId
    ]),
    assuranceContextRefs: Object.freeze([selectedOverlay.overlayRef])
  });
  const priorTruthRefs = priorOverlayTruthRefs({
    request: input.request,
    overlay: selectedOverlay
  });
  const overlayBinding = constructSdlcOverlayBinding({
    catalog: getOverlayCatalog(),
    overlay: selectedOverlay,
    workspaceRootUri: pathToFileURL(input.request.workspaceRoot).href,
    workspaceIdentityRef: workspaceIdentityRefFor(input.request),
    preActionWorkspaceObservationRef: evaluator.observation.observationId,
    preActionWorkspaceFingerprintRef: workspaceFingerprintRefFor({
      request: input.request,
      observationRef: evaluator.observation.observationId
    }),
    selectedGraphFunctionRef: selectedCandidate.graphFunctionRef,
    selectedGraphVectorRef,
    selectedStartTargetRef: selectedCandidate.graphFunctionName,
    requestedBy:
      input.request.replayNextActionProjectionRef === null ||
      input.request.replayNextActionProjectionRef === undefined
        ? "public_start"
        : "archive_replay",
    materialAssetRefs: observedOverlayMaterialAssetRefs({
      request: input.request,
      overlay: selectedOverlay,
      observationRef: evaluator.observation.observationId
    }),
    priorLedgerRefs: priorTruthRefs.priorLedgerRefs,
    priorEventRefs: priorTruthRefs.priorEventRefs
  });
  if (
    input.request.replayOverlayBindingRef !== null &&
    input.request.replayOverlayBindingRef !== undefined &&
    input.request.replayOverlayBindingRef !== overlayBinding.bindingRef
  ) {
    return Object.freeze({
      targetGraphFunction: selectedCandidate.graphFunctionName,
      blockingReason: "stale_query_domain",
      overlayBinding: null,
      nextActionProjection: null,
      constructionIntent: null,
      traversalDecompositionSummary: null,
      traversalHopSelection: null
    });
  }
  const replayClosureDecision =
    input.request.replayClosureDecisionRef === undefined ||
    input.request.replayClosureDecisionRef === null
      ? null
      : Object.freeze({
          kind: "sdlc_edge_closure_decision" as const,
          selectedComposition,
          compositionRef: selectedComposition.compositionRef,
          compositionDigest: selectedComposition.compositionDigest,
          compositionSelectionRef: selectedComposition.compositionSelectionRef,
          selectedRegimeBindingRef: selectedComposition.selectedRegimeBindingRef,
          decisionRef: input.request.replayClosureDecisionRef,
          ledgerRef: `ledger://odd-sdlc/public-start/replay/${encodeURIComponent(input.request.replayClosureDecisionRef)}`,
          ledgerVersionRef:
            `ledger-version://odd-sdlc/public-start/replay/${encodeURIComponent(input.request.replayClosureDecisionRef)}`,
          disposition: "close" as const,
          overlayRef: overlayBinding.overlayRef,
          overlayBindingRef: overlayBinding.bindingRef,
          graphCatalogDigestRef: overlayBinding.graphCatalogDigestRef,
          edgeAssuranceContractRef: null,
          edgeAssuranceContractDigest: null,
          targetCarrierContractRef: null,
          targetCarrierContractDigest: null,
          targetCarrierAdmissionStatus: "not_required",
          targetCarrierAdmissionRef: null,
          edgeGainRef: null,
          edgeClosureFunctionRef: null,
          edgeResidualPressureRefs: Object.freeze([]),
          basisRefs: Object.freeze([input.request.replayClosureDecisionRef]),
          reasonRefs: Object.freeze([]),
          yieldResumeBasis: null,
          predecessorRefs: Object.freeze([input.request.replayClosureDecisionRef])
        });
  const nextActionProjection = constructSdlcNextActionProjection({
    selectedComposition,
    nextActionProjectionRef:
      input.request.replayNextActionProjectionRef ??
      evaluator.priorityProjection.projectionRef,
    ...(replayClosureDecision === null
      ? { nextActionBasisKind: "initial_selection" as const }
      : { closureDecision: replayClosureDecision }),
    intentEventRefs: evaluator.intentEventRefs,
    productAssetModelRef: evaluator.productAssetModelRef,
    gapPressureRefs: evaluator.gapPressureRefs,
    targetBindingRefs: evaluator.targetBindingRefs,
    observationRef: evaluator.observation.observationId,
    policyRefs: Object.freeze([
      evaluator.policyCarrierRef,
      evaluator.priorityProjection.prioritySchemeRef
    ]),
    actionCatalogRefs: evaluator.actionCatalogRefs,
    overlayRef: overlayBinding.overlayRef,
    overlayBindingRef: overlayBinding.bindingRef,
    graphCatalogDigestRef: overlayBinding.graphCatalogDigestRef,
    selectedActionRef,
    nextGraphFunctionRef: selectedCandidate.graphFunctionRef,
    // Null means no automatic graph-track replay; current Eval_Action chooses the edge.
    nextGraphVectorRef: selectedGraphVectorRef
  });
  const constructionIntent = constructSdlcConstructionIntent({
    intentRef:
      `construction-intent://odd-sdlc/public-start/${selectedCandidate.graphFunctionName}`,
    intentEventRefs: nextActionProjection.intentEventRefs,
    productAssetModelRef: nextActionProjection.productAssetModelRef,
    selectedPriorityRowRef: selected.rankInputRef,
    nextActionProjectionRef: nextActionProjection.nextActionProjectionRef,
    selectedActionRef,
    basisRefs: Object.freeze([
      overlayBinding.bindingRef,
      ...nextActionProjection.predecessorRefs
    ]),
    predecessorRefs: Object.freeze([
      overlayBinding.bindingRef,
      nextActionProjection.nextActionProjectionRef
    ])
  });
  return Object.freeze({
    targetGraphFunction: selectedCandidate.graphFunctionName,
    blockingReason,
    overlayBinding,
    nextActionProjection,
    constructionIntent,
    traversalDecompositionSummary: selectedTraversal?.summary ?? null,
    traversalHopSelection: selectedTraversal?.selection ?? null
  });
}

function constructExecutionContract(input: {
  readonly request: SdlcPublicStartRequest;
  readonly module: Module;
  readonly targetGraphFunction: string;
  readonly overlayBinding: SdlcOverlayBinding;
  readonly conformedProject: SdlcConformProjectProfile;
  readonly workerAttachment: SdlcWorkerAttachment;
  readonly nextActionProjection: SdlcNextActionProjection;
  readonly constructionIntent: SdlcConstructionIntent;
  readonly traversalDecompositionSummary: SdlcDecompositionSummary | null;
  readonly traversalHopSelection: SdlcTraversalHopSelection | null;
}): SdlcExecutionContract {
  const requestedOutputs =
    input.request.outputWorkspaceRoot === undefined ||
    input.request.outputWorkspaceRoot === null
      ? undefined
      : Object.freeze([
          Object.freeze({
            outputName: "conform_project",
            outputAssetType: "constitutional_bootstrap",
            relativePath: "conform_project_report.json",
            outputWorkspace: Object.freeze({
              workspaceRef: "workspace://odd-sdlc/output",
              workspaceRoot: input.request.outputWorkspaceRoot,
              authorityRef: "cli://odd-sdlc-ts/output-workspace"
            })
          })
        ]);
  const basis = admitExecutionBasis({
    startIntent: admitStartIntent({
      scope: {
        kind: "workspace",
        workspaceRoot: input.request.workspaceRoot,
        moduleName: input.module.name
      },
      target: {
        kind: "graph_function",
        handle: input.targetGraphFunction
      },
      until: input.request.until,
      ...(requestedOutputs === undefined ? {} : { requestedOutputs })
    }),
    module: input.module,
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: "worker://odd-sdlc/typescript",
      backendId: "backend://node",
      buildId: "build://odd-sdlc/typescript",
      resolvedRuntimeRef: "runtime://abiogenesis/typescript"
    }),
    resolvedPolicy: admitResolvedPolicyIdentity({
      resolvedPolicyBundleRef: `policy://odd-sdlc/start/${input.request.defaultRegime}`,
      defaultRegime: input.request.defaultRegime,
      dispatchRef:
        input.request.defaultRegime === "F_P"
          ? "dispatch://odd-sdlc/public-start"
          : null,
      approvalSubjectRef:
        input.request.defaultRegime === "F_H"
          ? "approval://odd-sdlc/public-start"
          : null
    }),
    runId: "run://odd-sdlc/public-start",
    workKey: "wk://odd-sdlc/public-start",
    frameId: null,
    frameLineageId: input.overlayBinding.bindingRef
  });
  return Object.freeze({
    kind: "sdlc_execution_contract",
    targetGraphFunction: input.targetGraphFunction,
    overlayRef: input.overlayBinding.overlayRef,
    overlayBindingRef: input.overlayBinding.bindingRef,
    overlayBinding: input.overlayBinding,
    requestedUntil: input.request.until,
    conformedProject: input.conformedProject,
    basis,
    workerAttachment: input.workerAttachment,
    nextActionProjection: input.nextActionProjection,
    constructionIntent: input.constructionIntent,
    traversalDecompositionSummary: input.traversalDecompositionSummary,
    traversalHopSelection: input.traversalHopSelection
  });
}

function moduleHasGraphFunction(module: Module, graphFunctionName: string): boolean {
  return module.graphFunctions.some(
    (graphFunction) => graphFunction.name === graphFunctionName
  );
}

function statusFromTransition(
  transition: AdvancementTransition
): "dispatch_required" | "advanced" | "converged" {
  if (transition.kind === "fp_dispatch" || transition.kind === "fh_escalation") {
    return "dispatch_required";
  }
  if (transition.kind === "terminal") {
    return "converged";
  }
  return "advanced";
}

export function publicStartOnce(input: {
  readonly request: SdlcPublicStartRequest;
  readonly module: Module;
  readonly queryDomain: SdlcQueryDomainProjection;
  readonly conformedProject: SdlcConformProjectProfile;
  readonly workerAttachment: SdlcWorkerAttachment;
}): SdlcPublicStartOutcome {
  const targetResolution = evaluateInitialPublicStartAction({
    request: input.request,
    module: input.module,
    queryDomain: input.queryDomain,
    conformedProject: input.conformedProject
  });
  if (
    targetResolution.targetGraphFunction === null ||
    targetResolution.overlayBinding === null ||
    targetResolution.nextActionProjection === null ||
    targetResolution.constructionIntent === null
  ) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: targetResolution.blockingReason ?? "target_unavailable",
      stopPredicate: "gap_stop",
      executionContract: null,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  if (
    input.queryDomain.projectConformance?.status === "blocked" &&
    targetResolution.targetGraphFunction !== FG_CONFORM_PROJECT
  ) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: "project_conformance_blocked",
      stopPredicate: "gap_stop",
      executionContract: null,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  if (!moduleHasGraphFunction(input.module, targetResolution.targetGraphFunction)) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: "stale_query_domain",
      stopPredicate: "gap_stop",
      executionContract: null,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  const executionContract = constructExecutionContract({
    request: input.request,
    module: input.module,
    targetGraphFunction: targetResolution.targetGraphFunction,
    overlayBinding: targetResolution.overlayBinding,
    conformedProject: input.conformedProject,
    workerAttachment: input.workerAttachment,
    nextActionProjection: targetResolution.nextActionProjection,
    constructionIntent: targetResolution.constructionIntent,
    traversalDecompositionSummary: targetResolution.traversalDecompositionSummary,
    traversalHopSelection: targetResolution.traversalHopSelection
  });
  if (
    input.request.defaultRegime === "F_P" &&
    input.workerAttachment.status === "unattached" &&
    targetResolution.targetGraphFunction !== FG_CONFORM_PROJECT
  ) {
    return Object.freeze({
      kind: "sdlc_public_start_blocked",
      status: "blocked",
      blockingReason: "fp_worker_unattached",
      stopPredicate: "worker_attachment_required",
      executionContract,
      emittedRuntimeEventKinds: Object.freeze([])
    });
  }
  const transition = deriveAdvancementTransition(executionContract.basis);
  return Object.freeze({
    kind: "sdlc_public_start_projected",
    status: statusFromTransition(transition),
    executionContract,
    transition,
    emittedRuntimeEventKinds: Object.freeze([])
  });
}
