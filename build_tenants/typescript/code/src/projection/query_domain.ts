// Implements: REQ-F-ODDSDLC-020
// Implements: REQ-F-ODDSDLC-035

import {
  constructConstructionPriorityRule,
  constructConstructionPriorityScheme,
  deriveRuntimeAggregateProjection,
  materializeGraphFunction,
  type ConstructionPriorityScheme,
  type ExecutionBasis,
  type GraphFunction,
  type GraphVector,
  type Module,
  type RuntimeEvent,
  type SerializedAttrs
} from "@abiogenesis/typescript-tenant";
import {
  SOFTWARE_DOMAIN_ASSET_FAMILIES,
  SOFTWARE_DOMAIN_ASSET_TYPES,
  SOFTWARE_DOMAIN_WORK_ACT_TYPES
} from "../domain/index.js";
import {
  FG_CONFORM_PROJECT,
  constructSdlcGraphFunctionCatalog,
  constructSdlcGtlModule,
  type SdlcGraphFunctionCatalog
} from "../graph/index.js";
import {
  deriveOddSdlcConstructionEvaluatorReport,
  type OddSdlcConstructionEvaluatorReport
} from "../runtime/index.js";
import type {
  SdlcConformProjectReport,
  SdlcWorkspaceIngressReport
} from "../workspace/index.js";

export interface SdlcGraphFunctionSurface {
  readonly name: string;
  readonly inputNames: readonly string[];
  readonly outputNames: readonly string[];
  readonly vectorNames: readonly string[];
  readonly source: "gtl_module";
}

export interface SdlcStartTargetSurface {
  readonly name: string;
  readonly graphFunctionId: string;
  readonly jobName: string;
}

export interface SdlcAssetOwnershipSurface {
  readonly assetType: string;
  readonly producerGraphFunctions: readonly string[];
}

export interface SdlcQueryDomainProjection {
  readonly kind: "sdlc_query_domain_projection";
  readonly contractName: "odd_sdlc.query-domain";
  readonly contractVersion: "ts-v1";
  readonly runtimeModel: "abg-native";
  readonly queryModel: "odd-domain-read-model";
  readonly readOnly: true;
  readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
  readonly workspaceRootUri: string;
  readonly assetTypes: typeof SOFTWARE_DOMAIN_ASSET_TYPES;
  readonly assetFamilies: typeof SOFTWARE_DOMAIN_ASSET_FAMILIES;
  readonly workActTypes: typeof SOFTWARE_DOMAIN_WORK_ACT_TYPES;
  readonly libraryFunctions: SdlcGraphFunctionCatalog["libraryFunctions"];
  readonly functions: SdlcGraphFunctionCatalog["functions"];
  readonly programs: SdlcGraphFunctionCatalog["executives"];
  readonly graphFunctions: readonly SdlcGraphFunctionSurface[];
  readonly startTargets: readonly SdlcStartTargetSurface[];
  readonly assetOwnership: readonly SdlcAssetOwnershipSurface[];
  readonly currentDossierRefs: readonly string[];
  readonly projectConformance: SdlcConformProjectReport | null;
}

export type SdlcGapStatus = "open" | "partial" | "converged";

export interface SdlcGapProjection {
  readonly kind: "sdlc_gap_projection";
  readonly readOnly: true;
  readonly emittedRuntimeEventKinds: readonly RuntimeEvent["kind"][];
  readonly graphFunctionName: string;
  readonly status: SdlcGapStatus;
  readonly currentEdge: string | null;
  readonly nextVectorIndex: number | null;
  readonly closedVectorIndexes: readonly number[];
}

export interface SdlcGapDossier {
  readonly kind: "sdlc_gap_dossier";
  readonly readOnly: true;
  readonly choosesNextTraversal: false;
  readonly rankingAuthority: "abiogenesis_construction_priority_projection";
  readonly localRankingAuthority: false;
  readonly edge: string | null;
  readonly status: SdlcGapStatus;
  readonly evidenceRefs: readonly string[];
  readonly triageInput: string;
  readonly evaluatorProjectionRef: string | null;
  readonly prioritySchemeRef: string | null;
  readonly bestActionRef: string | null;
  readonly bestGraphFunctionRef: string | null;
  readonly bestGraphVectorRef: string | null;
  readonly rankingReasonRefs: readonly string[];
  readonly nextLawfulActions: readonly string[];
}

export interface SdlcSpanAnalysisProjection {
  readonly kind: "sdlc_span_analysis_projection";
  readonly readOnly: true;
  readonly graphFunctionName: string;
  readonly fromEdge: string | null;
  readonly toEdge: string | null;
  readonly zoom: "edge" | "span" | "graph";
  readonly edges: readonly string[];
}

function graphFunctionSurface(module: Module): readonly SdlcGraphFunctionSurface[] {
  return Object.freeze(
    module.graphFunctions.map((graphFunction) => {
      const graph = materializeGraphFunction(graphFunction);
      return Object.freeze({
        name: graphFunction.name,
        inputNames: Object.freeze(graphFunction.inputs.map((node) => node.name)),
        outputNames: Object.freeze(graphFunction.outputs.map((node) => node.name)),
        vectorNames: Object.freeze(graph.vectors.map((vector) => vector.name)),
        source: "gtl_module"
      });
    })
  );
}

function startTargets(input: {
  readonly module: Module;
  readonly projectConformance?: SdlcConformProjectReport | null;
}): readonly SdlcStartTargetSurface[] {
  const byId = new Map(
    input.module.graphFunctions.map((graphFunction) => [graphFunction.id, graphFunction])
  );
  const targets: SdlcStartTargetSurface[] = [];
  for (const job of input.module.jobs) {
    for (const contract of job.contracts) {
      const graphFunction = byId.get(contract.targetId);
      if (graphFunction !== undefined) {
        targets.push(
          Object.freeze({
            name: graphFunction.name,
            graphFunctionId: graphFunction.id,
            jobName: job.name
          })
        );
      }
    }
  }
  if (input.projectConformance?.status === "blocked") {
    return Object.freeze(
      targets.filter((target) => target.name === FG_CONFORM_PROJECT)
    );
  }
  return Object.freeze(targets.filter((target) => target.name !== FG_CONFORM_PROJECT));
}

function assetOwnership(
  catalog: SdlcGraphFunctionCatalog
): readonly SdlcAssetOwnershipSurface[] {
  const producers = new Map<string, string[]>();
  for (const entry of catalog.functions) {
    for (const output of entry.outputs) {
      const existing = producers.get(output) ?? [];
      existing.push(entry.backingGraphFunction);
      producers.set(output, existing);
    }
  }
  return Object.freeze(
    [...producers.entries()].map(([assetType, producerGraphFunctions]) =>
      Object.freeze({
        assetType,
        producerGraphFunctions: Object.freeze([...producerGraphFunctions].sort())
      })
    )
  );
}

interface GraphFunctionStructuralSignature {
  readonly id: string;
  readonly inputNames: readonly string[];
  readonly outputNames: readonly string[];
  readonly vectorSignatures: readonly string[];
  readonly declarationSignature: string;
  readonly tags: readonly string[];
  readonly effects: readonly string[];
}

function sortedStrings(values: readonly string[]): readonly string[] {
  return Object.freeze([...values].sort());
}

function serializedAttrsSignature(attrs: SerializedAttrs): string {
  return JSON.stringify(
    [...attrs.entries]
      .map((entry) => Object.freeze({
        key: entry.key,
        value: entry.value
      }))
      .sort((left, right) => left.key.localeCompare(right.key))
  );
}

function graphVectorSignature(vector: GraphVector): string {
  return JSON.stringify({
    id: vector.id,
    name: vector.name,
    sourceNames: vector.source.map((node) => node.name),
    targetName: vector.target.name,
    operatorNames: vector.operators.map((operator) => operator.name),
    evaluatorNames: vector.evaluators.map((evaluator) => evaluator.name),
    allowsSubwork: vector.allowsSubwork,
    declarationSignature: serializedAttrsSignature(vector.declarations),
    tags: sortedStrings(vector.tags)
  });
}

function graphFunctionStructuralSignature(
  graphFunction: GraphFunction
): GraphFunctionStructuralSignature {
  let graph: ReturnType<typeof materializeGraphFunction>;
  try {
    graph = materializeGraphFunction(graphFunction);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new TypeError(
      `SdlcQueryDomainProjection: admitted module structural drift: ${graphFunction.name}.materialize: ${message}`
    );
  }
  return Object.freeze({
    id: graphFunction.id,
    inputNames: Object.freeze(graphFunction.inputs.map((node) => node.name)),
    outputNames: Object.freeze(graphFunction.outputs.map((node) => node.name)),
    vectorSignatures: Object.freeze(graph.vectors.map(graphVectorSignature)),
    declarationSignature: serializedAttrsSignature(graphFunction.declarations),
    tags: sortedStrings(graphFunction.tags),
    effects: sortedStrings(graphFunction.effects)
  });
}

function graphFunctionsByName(module: Module): ReadonlyMap<string, GraphFunction> {
  return new Map(
    module.graphFunctions.map((graphFunction) => [graphFunction.name, graphFunction])
  );
}

function compareStringArray(input: {
  readonly label: string;
  readonly actual: readonly string[];
  readonly expected: readonly string[];
  readonly mismatches: string[];
}): void {
  if (JSON.stringify(input.actual) !== JSON.stringify(input.expected)) {
    input.mismatches.push(
      `${input.label}: expected ${JSON.stringify(input.expected)} got ${JSON.stringify(input.actual)}`
    );
  }
}

function assertGraphFunctionSignature(input: {
  readonly name: string;
  readonly actual: GraphFunction;
  readonly expected: GraphFunction;
  readonly mismatches: string[];
}): void {
  const actual = graphFunctionStructuralSignature(input.actual);
  const expected = graphFunctionStructuralSignature(input.expected);
  if (actual.id !== expected.id) {
    input.mismatches.push(`${input.name}.id: expected ${expected.id} got ${actual.id}`);
  }
  compareStringArray({
    label: `${input.name}.inputNames`,
    actual: actual.inputNames,
    expected: expected.inputNames,
    mismatches: input.mismatches
  });
  compareStringArray({
    label: `${input.name}.outputNames`,
    actual: actual.outputNames,
    expected: expected.outputNames,
    mismatches: input.mismatches
  });
  compareStringArray({
    label: `${input.name}.vectorSignatures`,
    actual: actual.vectorSignatures,
    expected: expected.vectorSignatures,
    mismatches: input.mismatches
  });
  if (actual.declarationSignature !== expected.declarationSignature) {
    input.mismatches.push(`${input.name}.declarations: structural drift`);
  }
  compareStringArray({
    label: `${input.name}.tags`,
    actual: actual.tags,
    expected: expected.tags,
    mismatches: input.mismatches
  });
  compareStringArray({
    label: `${input.name}.effects`,
    actual: actual.effects,
    expected: expected.effects,
    mismatches: input.mismatches
  });
}

function startTargetStructuralSignature(module: Module): readonly string[] {
  const graphFunctionById = new Map(
    module.graphFunctions.map((graphFunction) => [graphFunction.id, graphFunction.name])
  );
  return Object.freeze(
    module.jobs
      .flatMap((job) =>
        job.contracts.map((contract) =>
          `${job.name}:${contract.targetId}:${graphFunctionById.get(contract.targetId) ?? "unpublished"}`
        )
      )
      .sort()
  );
}

function assertModuleMatchesCatalog(input: {
  readonly module: Module;
  readonly catalog: SdlcGraphFunctionCatalog;
}): void {
  const canonicalModule = constructSdlcGtlModule();
  const actualByName = graphFunctionsByName(input.module);
  const expectedByName = graphFunctionsByName(canonicalModule);
  const moduleNames = new Set(actualByName.keys());
  const expectedNames = [
    ...input.catalog.libraryFunctions.map((entry) => entry.name),
    ...input.catalog.functions.map((entry) => entry.backingGraphFunction),
    ...input.catalog.executives.map((entry) => entry.backingGraphFunction)
  ];
  const missingNames = expectedNames.filter((name) => !moduleNames.has(name));
  if (missingNames.length > 0) {
    throw new TypeError(
      `SdlcQueryDomainProjection: admitted module missing graph functions: ${missingNames.join(", ")}`
    );
  }
  const unexpectedNames = [...moduleNames].filter((name) => !expectedByName.has(name));
  if (unexpectedNames.length > 0) {
    throw new TypeError(
      `SdlcQueryDomainProjection: admitted module contains unpublished graph functions: ${unexpectedNames.join(", ")}`
    );
  }
  const mismatches: string[] = [];
  for (const name of expectedNames) {
    const actual = actualByName.get(name);
    const expected = expectedByName.get(name);
    if (actual !== undefined && expected !== undefined) {
      assertGraphFunctionSignature({ name, actual, expected, mismatches });
    }
  }
  compareStringArray({
    label: "startTargets",
    actual: startTargetStructuralSignature(input.module),
    expected: startTargetStructuralSignature(canonicalModule),
    mismatches
  });
  if (mismatches.length > 0) {
    throw new TypeError(
      `SdlcQueryDomainProjection: admitted module structural drift: ${mismatches.join("; ")}`
    );
  }
}

export function projectSdlcQueryDomain(input: {
  readonly module: Module;
  readonly ingressReport: SdlcWorkspaceIngressReport;
  readonly currentDossierRefs?: readonly string[];
  readonly projectConformance?: SdlcConformProjectReport | null;
}): SdlcQueryDomainProjection {
  const catalog = constructSdlcGraphFunctionCatalog();
  assertModuleMatchesCatalog({ module: input.module, catalog });
  return Object.freeze({
    kind: "sdlc_query_domain_projection",
    contractName: "odd_sdlc.query-domain",
    contractVersion: "ts-v1",
    runtimeModel: "abg-native",
    queryModel: "odd-domain-read-model",
    readOnly: true,
    emittedRuntimeEventKinds: Object.freeze([]),
    workspaceRootUri: input.ingressReport.workspaceRootUri,
    assetTypes: SOFTWARE_DOMAIN_ASSET_TYPES,
    assetFamilies: SOFTWARE_DOMAIN_ASSET_FAMILIES,
    workActTypes: SOFTWARE_DOMAIN_WORK_ACT_TYPES,
    libraryFunctions: catalog.libraryFunctions,
    functions: catalog.functions,
    programs: catalog.executives,
    graphFunctions: graphFunctionSurface(input.module),
    startTargets: startTargets({
      module: input.module,
      projectConformance: input.projectConformance ?? null
    }),
    assetOwnership: assetOwnership(catalog),
    currentDossierRefs: Object.freeze([...(input.currentDossierRefs ?? [])]),
    projectConformance: input.projectConformance ?? null
  });
}

function gapStatus(input: {
  readonly vectorCount: number;
  readonly closedVectorIndexes: readonly number[];
  readonly nextVectorIndex: number | null;
}): SdlcGapStatus {
  if (input.nextVectorIndex === null) {
    return "converged";
  }
  if (input.closedVectorIndexes.length > 0) {
    return "partial";
  }
  return "open";
}

export function projectSdlcGapsFromReplay(input: {
  readonly basis: ExecutionBasis;
  readonly events: readonly RuntimeEvent[];
}): SdlcGapProjection {
  const projection = deriveRuntimeAggregateProjection(input.basis, input.events);
  const currentVector =
    projection.nextVectorIndex === null
      ? undefined
      : input.basis.graph.vectors[projection.nextVectorIndex];
  return Object.freeze({
    kind: "sdlc_gap_projection",
    readOnly: true,
    emittedRuntimeEventKinds: Object.freeze([]),
    graphFunctionName: input.basis.graphFunction.name,
    status: gapStatus({
      vectorCount: projection.vectorCount,
      closedVectorIndexes: projection.closedVectorIndexes,
      nextVectorIndex: projection.nextVectorIndex
    }),
    currentEdge: currentVector?.name ?? null,
    nextVectorIndex: projection.nextVectorIndex,
    closedVectorIndexes: projection.closedVectorIndexes
  });
}

export function deriveSdlcGapDossier(input: {
  readonly basis: ExecutionBasis;
  readonly events: readonly RuntimeEvent[];
  readonly triageInput: string;
  readonly evidenceRefs: readonly string[];
  readonly priorityScheme?: ConstructionPriorityScheme;
}): SdlcGapDossier {
  const gaps = projectSdlcGapsFromReplay({
    basis: input.basis,
    events: input.events
  });
  const evaluator =
    gaps.nextVectorIndex === null
      ? null
      : deriveSdlcGapEvaluator(
          {
            basis: input.basis,
            events: input.events,
            vectorIndex: gaps.nextVectorIndex,
            closedVectorIndexes: gaps.closedVectorIndexes,
            triageInput: input.triageInput,
            evidenceRefs: input.evidenceRefs
          },
          input.priorityScheme
        );
  return Object.freeze({
    kind: "sdlc_gap_dossier",
    readOnly: true,
    choosesNextTraversal: false,
    rankingAuthority: "abiogenesis_construction_priority_projection",
    localRankingAuthority: false,
    edge: gaps.currentEdge,
    status: gaps.status,
    evidenceRefs: Object.freeze([...input.evidenceRefs]),
    triageInput: input.triageInput,
    evaluatorProjectionRef: evaluator?.priorityProjection.projectionRef ?? null,
    prioritySchemeRef: evaluator?.priorityProjection.prioritySchemeRef ?? null,
    bestActionRef: evaluator?.selectedPriorityRow?.actionRef ?? null,
    bestGraphFunctionRef: evaluator?.bestGraphFunctionRef ?? null,
    bestGraphVectorRef: evaluator?.bestGraphVectorRef ?? null,
    rankingReasonRefs: Object.freeze(
      evaluator?.selectedPriorityRow?.rankReasonRefs ?? []
    ),
    nextLawfulActions: Object.freeze(
      evaluator === null ? ["close_or_reprice"] : evaluator.nextLawfulActionRefs
    )
  });
}

function deriveSdlcGapEvaluator(
  input: {
    readonly basis: ExecutionBasis;
    readonly events: readonly RuntimeEvent[];
    readonly vectorIndex: number;
    readonly closedVectorIndexes: readonly number[];
    readonly triageInput: string;
    readonly evidenceRefs: readonly string[];
  },
  priorityScheme?: ConstructionPriorityScheme
): OddSdlcConstructionEvaluatorReport {
  const vector = input.basis.graph.vectors[input.vectorIndex];
  if (vector === undefined) {
    throw new TypeError("SdlcGapDossier evaluator requires a published graph vector");
  }
  const closedVectorIndexSet = new Set(input.closedVectorIndexes);
  const candidateVectors = input.basis.graph.vectors
    .map((candidate, index) => Object.freeze({ candidate, index }))
    .filter(({ index }) => !closedVectorIndexSet.has(index));
  const targetOutcomeRefs = Object.freeze(
    candidateVectors.map(
      ({ candidate }) =>
        `outcome://odd-sdlc/${input.basis.graphFunction.id}/${candidate.target.id}`
    )
  );
  const currentTargetOutcomeRef =
    `outcome://odd-sdlc/${input.basis.graphFunction.id}/${vector.target.id}`;
  const effectivePriorityScheme =
    priorityScheme ??
    constructConstructionPriorityScheme({
      schemeRef:
        `priority-scheme://odd-sdlc/default-follow-graph/${input.basis.graphFunction.id}/${vector.id}`,
      sourcePolicyRef: "policy://odd-sdlc/default-follow-graph",
      rules: Object.freeze([
        constructConstructionPriorityRule({
          priorityRuleRef:
            `priority-rule://odd-sdlc/default-follow-graph/${input.basis.graphFunction.id}/${vector.id}`,
          axis: "gap_repair",
          weight: 100,
          appliesToActionKinds: Object.freeze(["continue_graph_call"]),
          appliesToOutcomeRefs: Object.freeze([currentTargetOutcomeRef]),
          sourcePolicyRef: "policy://odd-sdlc/default-follow-graph",
          strategyLabel: "follow_current_graph_edge"
        })
      ])
    });
  return deriveOddSdlcConstructionEvaluatorReport({
    basis: input.basis,
    events: input.events,
    episodeId: `construction-episode://odd-sdlc/gaps/${input.basis.graphFunction.id}`,
    observationId: `construction-observation://odd-sdlc/gaps/${input.basis.graphFunction.id}/${input.vectorIndex}/${input.events.length}`,
    priorityScheme: effectivePriorityScheme,
    pressures: Object.freeze([
      {
        pressureRef: `pressure://odd-sdlc/gap/${input.basis.graphFunction.id}/${vector.id}`,
        pressureKind: "gap_row",
        sourceRef: `sdlc-gap-dossier://odd-sdlc/${input.triageInput}`,
        affectedAssetRefs: Object.freeze(
          candidateVectors.map(({ candidate }) => candidate.target.id)
        ),
        targetOutcomeRefs,
        evidenceRefs: input.evidenceRefs,
        severity: 1
      }
    ]),
    actions: Object.freeze(
      candidateVectors.map(({ candidate }) => {
        const targetOutcomeRef =
          `outcome://odd-sdlc/${input.basis.graphFunction.id}/${candidate.target.id}`;
        const publishedTraversalTargetRef =
          `published-traversal-target://odd-sdlc/${input.basis.graphFunction.id}/${candidate.id}`;
        return {
          actionKind: "continue_graph_call" as const,
          graphFunctionRef: input.basis.graphFunction.id,
          graphVectorRef: candidate.id,
          publishedTraversalTargetRef,
          targetOutcomeRef,
          inputAssetRefs: Object.freeze(candidate.source.map((node) => node.id)),
          expectedOutputAssetRefs: Object.freeze([candidate.target.id]),
          requiredAuthorityRefs: Object.freeze([publishedTraversalTargetRef]),
          eligibleReasonRefs: Object.freeze([
            "odd_sdlc_gap_dossier_read_only_evaluator_view"
          ])
        };
      })
    )
  });
}

export function projectSdlcSpanAnalysis(input: {
  readonly basis: ExecutionBasis;
  readonly fromEdge?: string | null;
  readonly toEdge?: string | null;
  readonly zoom?: "edge" | "span" | "graph";
}): SdlcSpanAnalysisProjection {
  const allEdges = input.basis.graph.vectors.map((vector) => vector.name);
  const fromIndex =
    input.fromEdge === undefined || input.fromEdge === null
      ? 0
      : allEdges.indexOf(input.fromEdge);
  const toIndex =
    input.toEdge === undefined || input.toEdge === null
      ? allEdges.length - 1
      : allEdges.indexOf(input.toEdge);
  if (fromIndex < 0 || toIndex < 0 || fromIndex > toIndex) {
    throw new TypeError("SdlcSpanAnalysisProjection requires an ordered bounded edge span");
  }
  return Object.freeze({
    kind: "sdlc_span_analysis_projection",
    readOnly: true,
    graphFunctionName: input.basis.graphFunction.name,
    fromEdge: input.fromEdge ?? null,
    toEdge: input.toEdge ?? null,
    zoom: input.zoom ?? "span",
    edges: Object.freeze(allEdges.slice(fromIndex, toIndex + 1))
  });
}
