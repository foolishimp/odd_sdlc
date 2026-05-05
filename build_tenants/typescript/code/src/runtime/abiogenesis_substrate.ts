// Implements: REQ-F-ODDSDLC-040
// Implements: REQ-F-ODDSDLC-042
// Implements: REQ-F-ODDSDLC-043

import {
  admitExecutionBasis,
  admitModule,
  admitNode,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  admitStartIntent,
  deriveAdvancementTransition,
  deriveIterationAdvanceDecision,
  deriveRuntimeAggregateProjection,
  deriveTraversalStructureProbe,
  edge,
  graphFunctionForVector,
  runtimeEventsForIterationDecision,
  runtimeEventsForTransition,
  type AdvancementTransition,
  type ExecutionBasis,
  type Graph,
  type GraphFunction,
  type GraphVector,
  type IterationAdvanceDecision,
  type Module,
  type RuntimeAggregateProjection,
  type RuntimeEvent,
  type RuntimeRegime,
  type TraversalStructureProbe
} from "@abiogenesis/typescript-tenant";

export const ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT = Object.freeze({
  packageName: "@abiogenesis/typescript-tenant",
  packageVersion: "3.4.0-rc.7",
  boundary: "consumed_substrate",
  runtimeTruthAuthority: "abiogenesis",
  localRuntimeEventFamilies: Object.freeze([]),
  choosesNextVectorLocally: false,
  sourceAssumptions: Object.freeze([
    "ABIogenesis T-060 no_compute_basis fails closed",
    "ABIogenesis T-065 traversal probe is complete for structural diagnostics",
    "ABIogenesis T-066 internal control loop owns iteration sufficiency",
    "ABIogenesis T-107 traversal attempt envelopes are ABG-derived from GTL qualifiers"
  ])
} as const);

export interface OddSdlcAbiogenesisExecutionBasisInput {
  readonly workspaceRoot: string;
  readonly defaultRegime: RuntimeRegime;
  readonly runId: string | null;
  readonly workKey: string | null;
  readonly frameId: string | null;
  readonly frameLineageId: string | null;
}

export interface OddSdlcAbiogenesisSubstrateReport {
  readonly contract: typeof ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT;
  readonly basis: ExecutionBasis;
  readonly projection: RuntimeAggregateProjection;
  readonly iterationDecision: IterationAdvanceDecision;
  readonly transition: AdvancementTransition;
  readonly probe: TraversalStructureProbe;
  readonly iterationEventKinds: readonly RuntimeEvent["kind"][];
  readonly transitionEventKinds: readonly RuntimeEvent["kind"][];
}

function typedSdlcNode(id: string, name: string, typeName: string) {
  return admitNode({
    id,
    name,
    schema: { kind: "symbolic", ref: `schema://odd_sdlc/${typeName}` },
    markov: [],
    assetSurface: {
      kind: typeName,
      requiredContexts: [],
      standardsRefs: [],
      outputContractRefs: []
    },
    tags: ["odd_sdlc", "substrate_probe", `type:${typeName}`]
  });
}

function firstVector(graph: Graph): GraphVector {
  const vector = graph.vectors[0];
  if (vector === undefined) {
    throw new TypeError("odd_sdlc ABIogenesis substrate probe requires one vector");
  }
  return vector;
}

export function constructOddSdlcSubstrateGraphFunction(): GraphFunction {
  const source = typedSdlcNode(
    "node-odd-sdlc-t028-worksite",
    "SdlcWorksite",
    "SdlcWorksite"
  );
  const target = typedSdlcNode(
    "node-odd-sdlc-t028-work-report",
    "SdlcWorkReport",
    "SdlcWorkReport"
  );
  const graph = edge([source], target, {
    id: "graph-odd-sdlc-t028-substrate-probe",
    name: "SdlcWorksite->SdlcWorkReport",
    operators: [],
    evaluators: [],
    contexts: [],
    rule: null,
    allowsSubwork: false,
    declarations: { entries: [] },
    tags: ["odd_sdlc", "substrate_probe"]
  });

  return graphFunctionForVector(firstVector(graph), {
    name: "ODD_SDLC_SUBSTRATE_PROBE",
    declarations: { entries: [] },
    tags: ["odd_sdlc", "substrate_probe"]
  });
}

export function constructOddSdlcSubstrateModule(): Module {
  const graphFunction = constructOddSdlcSubstrateGraphFunction();
  return admitModule({
    name: "odd_sdlc_typescript_substrate_probe",
    graphs: [],
    graphFunctions: [graphFunction],
    refinementBoundaries: [],
    candidateFamilies: [],
    jobs: [
      {
        id: "job-odd-sdlc-t028-substrate-probe",
        name: "ODD_SDLC_SUBSTRATE_PROBE_job",
        contracts: [{ kind: "graph_function", targetId: graphFunction.id }],
        roles: [],
        tags: ["odd_sdlc", "substrate_probe"]
      }
    ],
    roles: [],
    operators: [],
    evaluators: [],
    rules: [],
    imports: [],
    metadata: { entries: [] }
  });
}

export function constructOddSdlcAbiogenesisExecutionBasis(
  input: OddSdlcAbiogenesisExecutionBasisInput = {
    workspaceRoot: "/workspace/odd-sdlc-typescript-substrate-probe",
    defaultRegime: "F_D",
    runId: "run://odd-sdlc/t028/substrate-probe",
    workKey: "wk://odd-sdlc/t028/substrate-probe",
    frameId: null,
    frameLineageId: null
  }
): ExecutionBasis {
  return admitExecutionBasis({
    startIntent: admitStartIntent({
      scope: {
        kind: "workspace",
        workspaceRoot: input.workspaceRoot,
        moduleName: "odd_sdlc_typescript_substrate_probe"
      },
      target: {
        kind: "graph_function",
        handle: "ODD_SDLC_SUBSTRATE_PROBE"
      },
      until: "converged"
    }),
    module: constructOddSdlcSubstrateModule(),
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: "worker://odd-sdlc/typescript",
      backendId: "backend://node",
      buildId: "build://odd-sdlc/typescript",
      resolvedRuntimeRef: "runtime://abiogenesis/typescript"
    }),
    resolvedPolicy: admitResolvedPolicyIdentity({
      resolvedPolicyBundleRef: `policy://odd-sdlc/t028/${input.defaultRegime}`,
      defaultRegime: input.defaultRegime,
      dispatchRef:
        input.defaultRegime === "F_P" ? "dispatch://odd-sdlc/t028" : null,
      approvalSubjectRef:
        input.defaultRegime === "F_H" ? "approval://odd-sdlc/t028" : null
    }),
    runId: input.runId,
    workKey: input.workKey,
    frameId: input.frameId,
    frameLineageId: input.frameLineageId
  });
}

function eventKinds(events: readonly RuntimeEvent[]): readonly RuntimeEvent["kind"][] {
  return Object.freeze(events.map((event) => event.kind));
}

export function deriveOddSdlcAbiogenesisSubstrateReport(input: {
  readonly basis: ExecutionBasis;
  readonly events: readonly RuntimeEvent[];
}): OddSdlcAbiogenesisSubstrateReport {
  const projection = deriveRuntimeAggregateProjection(input.basis, input.events);
  const iterationDecision = deriveIterationAdvanceDecision(input.basis, projection);
  const transition = deriveAdvancementTransition(input.basis, input.events);
  const probe = deriveTraversalStructureProbe(input.basis, input.events);

  return Object.freeze({
    contract: ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT,
    basis: input.basis,
    projection,
    iterationDecision,
    transition,
    probe,
    iterationEventKinds: eventKinds(
      runtimeEventsForIterationDecision(iterationDecision)
    ),
    transitionEventKinds: eventKinds(
      runtimeEventsForTransition(input.basis, transition)
    )
  });
}
