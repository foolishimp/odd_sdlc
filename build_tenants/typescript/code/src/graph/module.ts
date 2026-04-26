import {
  admitEvaluator,
  admitGraphFunction,
  admitModule,
  admitNode,
  admitOperator,
  edge,
  graphFunctionForVector,
  materializeGraphFunction,
  type Evaluator,
  type Graph,
  type GraphFunction,
  type GraphVector,
  type Module,
  type Node,
  type SerializedAttrEntry,
  type SerializedAttrValue,
  type SerializedAttrs
} from "@abiogenesis/typescript-tenant";
import {
  BOOTSTRAP_RELEASE_FUNCTION_CATALOG,
  OPERATIONAL_FUNCTION_CATALOG,
  SDLC_FUNCTION_CATALOG,
  TRIAGE_FUNCTION_CATALOG,
  type SdlcExecutiveProgramEntry,
  type SdlcFunctionCatalogEntry,
  type SdlcGraphFunctionCatalog
} from "./catalog.js";

const BUILDER_OPERATOR = admitOperator({
  name: "odd_sdlc_typescript_builder",
  regime: "F_P",
  binding: "agent://odd_sdlc/typescript-builder",
  tags: ["odd_sdlc", "builder"]
});

function scalarValue(value: string | boolean): SerializedAttrValue {
  return Object.freeze({
    kind: "scalar",
    value
  });
}

function stringListValue(value: readonly string[]): SerializedAttrValue {
  return Object.freeze({
    kind: "string_list",
    value: Object.freeze([...value])
  });
}

function attr(
  key: string,
  value: SerializedAttrValue
): SerializedAttrEntry {
  return Object.freeze({ key, value });
}

function attrs(entries: readonly SerializedAttrEntry[]): SerializedAttrs {
  return Object.freeze({
    entries: Object.freeze([...entries])
  });
}

function firstOutput(entry: SdlcFunctionCatalogEntry): string {
  const output = entry.outputs[0];
  if (output === undefined) {
    throw new TypeError(`${entry.name}: expected one output`);
  }
  return output;
}

function firstVector(graph: Graph, name: string): GraphVector {
  const vector = graph.vectors[0];
  if (vector === undefined) {
    throw new TypeError(`${name}: expected one graph vector`);
  }
  return vector;
}

function nodeFor(name: string): Node {
  return admitNode({
    id: `node:odd_sdlc:${name}`,
    name,
    schema: { kind: "symbolic", ref: `schema://odd_sdlc/${name}` },
    markov: [],
    assetSurface: {
      kind: name,
      requiredContexts: [],
      standardsRefs: [],
      outputContractRefs: [`${name}_present`]
    },
    tags: ["odd_sdlc", "asset_node", `asset:${name}`]
  });
}

function fdEvaluator(entry: SdlcFunctionCatalogEntry): Evaluator {
  return admitEvaluator({
    name: `${entry.name}_core_fd`,
    regime: "F_D",
    description: `Core deterministic validation for ${entry.name}.`,
    binding: `fd://odd_sdlc/${entry.name}/core`,
    tags: ["core_fd", entry.name]
  });
}

function fpEvaluator(entry: SdlcFunctionCatalogEntry): Evaluator {
  return admitEvaluator({
    name: `${entry.name}_semantic_fp`,
    regime: "F_P",
    description: entry.intent,
    binding: `fp://odd_sdlc/${entry.name}/construct`,
    tags: ["configured_fp", entry.name]
  });
}

function graphFunctionDeclarations(): SerializedAttrs {
  return attrs([
    attr("function_kind", scalarValue("odd_asset_function")),
    attr("default_regime", scalarValue("F_P")),
    attr("graph_function_proof_obligations", stringListValue([
      "work_report_contract",
      "core_fd_preflight",
      "configured_fp_result",
      "postflight_fd_closure"
    ])),
    attr("requirement_refs", stringListValue([
      "REQ-F-ODDSDLC-013",
      "REQ-F-ODDSDLC-014",
      "REQ-F-ODDSDLC-015"
    ]))
  ]);
}

function vectorDeclarations(entry: SdlcFunctionCatalogEntry): SerializedAttrs {
  return attrs([
    attr("intent", scalarValue(entry.intent)),
    attr("backing_graph_function", scalarValue(entry.backingGraphFunction)),
    attr("compute_basis", stringListValue([
      "preflight:F_D",
      "construct:F_P",
      "postflight:F_D"
    ])),
    attr("proof_obligations", stringListValue([
      "target_binding",
      "operation_type",
      "evidence_refs",
      "input_output_identity_or_digest"
    ]))
  ]);
}

function graphFunctionForEntry(entry: SdlcFunctionCatalogEntry): GraphFunction {
  const sourceNodes = entry.inputs.map(nodeFor);
  const target = nodeFor(firstOutput(entry));
  const graph = edge(sourceNodes, target, {
    id: `vector:odd_sdlc:${entry.name}`,
    name: entry.name,
    operators: [BUILDER_OPERATOR],
    evaluators: [fdEvaluator(entry), fpEvaluator(entry)],
    contexts: [],
    rule: null,
    allowsSubwork: false,
    declarations: vectorDeclarations(entry),
    tags: ["odd_sdlc", "leaf_graph_function"]
  });

  const graphFunction = graphFunctionForVector(firstVector(graph, entry.name), {
    name: entry.backingGraphFunction,
    declarations: graphFunctionDeclarations(),
    tags: ["odd_sdlc", "published_leaf"]
  });
  return admitGraphFunction({
    name: graphFunction.name,
    environment: graphFunction.environment,
    inputs: graphFunction.inputs,
    outputs: graphFunction.outputs,
    template: graphFunction.template,
    effects: graphFunction.effects,
    declarations: graphFunctionDeclarations(),
    tags: graphFunction.tags,
    id: graphFunction.id
  });
}

function leafFunctions(
  entries: readonly SdlcFunctionCatalogEntry[]
): readonly GraphFunction[] {
  return Object.freeze(entries.map(graphFunctionForEntry));
}

function uniqueNodes(nodes: readonly Node[]): readonly Node[] {
  const byName = new Map<string, Node>();
  for (const node of nodes) {
    if (!byName.has(node.name)) {
      byName.set(node.name, node);
    }
  }
  return Object.freeze([...byName.values()]);
}

function constructExecutive(input: {
  readonly name: string;
  readonly intent: string;
  readonly functions: readonly GraphFunction[];
  readonly outputs: readonly string[];
}): GraphFunction {
  if (input.functions.length === 0) {
    throw new TypeError(`${input.name}: expected at least one function`);
  }
  const vectors = Object.freeze(
    input.functions.flatMap((graphFunction) => [
      ...materializeGraphFunction(graphFunction).vectors
    ])
  );
  const lastVector = vectors.at(-1);
  if (lastVector === undefined) {
    throw new TypeError(`${input.name}: expected materialized vectors`);
  }
  const producedTargetNames = new Set(
    vectors.map((vector) => vector.target.name)
  );
  const inputNodes = uniqueNodes(
    vectors.flatMap((vector) =>
      vector.source.filter((node) => !producedTargetNames.has(node.name))
    )
  );
  const graph = Object.freeze({
    name: `${input.name}_graph`,
    inputs: inputNodes,
    outputs: Object.freeze([lastVector.target]),
    nodes: uniqueNodes(vectors.flatMap((vector) => [...vector.source, vector.target])),
    vectors,
    contexts: Object.freeze([]),
    rules: Object.freeze([]),
    effects: Object.freeze([]),
    tags: Object.freeze(["odd_sdlc", "executive"])
  });
  return admitGraphFunction({
    name: input.name,
    environment: {
      requires: inputNodes,
      provides: graph.outputs,
      carries: graph.nodes
    },
    inputs: inputNodes,
    outputs: graph.outputs,
    template: {
      kind: "inline_graph",
      ref: `inline:${input.name}`,
      graph,
      version: null
    },
    effects: [],
    declarations: attrs([
      attr("function_kind", scalarValue("odd_executive_graph_function")),
      attr("intent", scalarValue(input.intent)),
      attr("entrypoint", scalarValue(true)),
      attr("outputs", stringListValue(input.outputs))
    ]),
    tags: ["odd_sdlc", "executive"],
    id: `graph-function:odd_sdlc:${input.name}`
  });
}

function executiveEntry(input: {
  readonly name: string;
  readonly intent: string;
  readonly steps: readonly string[];
  readonly outputs: readonly string[];
}): SdlcExecutiveProgramEntry {
  return Object.freeze({
    kind: "sdlc_executive_program_entry",
    name: input.name,
    intent: input.intent,
    steps: Object.freeze([...input.steps]),
    outputs: Object.freeze([...input.outputs]),
    backingGraphFunction: input.name
  });
}

function functionNames(functions: readonly GraphFunction[]): readonly string[] {
  return Object.freeze(functions.map((graphFunction) => graphFunction.name));
}

function jobFor(graphFunction: GraphFunction) {
  return Object.freeze({
    id: `job:odd_sdlc:${graphFunction.name}`,
    name: `${graphFunction.name}_job`,
    contracts: Object.freeze([
      Object.freeze({
        kind: "graph_function",
        targetId: graphFunction.id
      })
    ]),
    roles: [],
    tags: ["odd_sdlc", "executive_job"]
  });
}

export function constructSdlcGraphFunctionCatalog(): SdlcGraphFunctionCatalog {
  const bootstrapFunctions = leafFunctions(BOOTSTRAP_RELEASE_FUNCTION_CATALOG);
  const operationalFunctions = leafFunctions(OPERATIONAL_FUNCTION_CATALOG);
  return Object.freeze({
    kind: "sdlc_graph_function_catalog",
    functions: SDLC_FUNCTION_CATALOG,
    executives: Object.freeze([
      executiveEntry({
        name: "bootstrap_release_self_test",
        intent: "Top-level bootstrap-to-release executive over the retained proving subset.",
        steps: functionNames(bootstrapFunctions),
        outputs: ["release_surface"]
      }),
      executiveEntry({
        name: "release_operational_cycle",
        intent: "Operational continuation executive from release through runtime return and retrofit planning.",
        steps: functionNames(operationalFunctions),
        outputs: ["retrofit_plan_surface"]
      })
    ])
  });
}

export function constructSdlcGtlModule(): Module {
  const bootstrapFunctions = leafFunctions(BOOTSTRAP_RELEASE_FUNCTION_CATALOG);
  const operationalFunctions = leafFunctions(OPERATIONAL_FUNCTION_CATALOG);
  const triageFunctions = leafFunctions(TRIAGE_FUNCTION_CATALOG);
  const bootstrapExecutive = constructExecutive({
    name: "bootstrap_release_self_test",
    intent: "Top-level bootstrap-to-release executive over the retained proving subset.",
    functions: bootstrapFunctions,
    outputs: ["release_surface"]
  });
  const operationalExecutive = constructExecutive({
    name: "release_operational_cycle",
    intent: "Operational continuation executive from release through runtime return and retrofit planning.",
    functions: operationalFunctions,
    outputs: ["retrofit_plan_surface"]
  });
  const graphFunctions = Object.freeze([
    bootstrapExecutive,
    operationalExecutive,
    ...bootstrapFunctions,
    ...operationalFunctions,
    ...triageFunctions
  ]);
  const module = admitModule({
    name: "odd_sdlc_typescript",
    graphs: [],
    graphFunctions,
    refinementBoundaries: [],
    candidateFamilies: [],
    jobs: [jobFor(bootstrapExecutive), jobFor(operationalExecutive)],
    roles: [],
    operators: [BUILDER_OPERATOR],
    evaluators: [],
    rules: [],
    imports: [],
    metadata: attrs([
      attr("domain_package", scalarValue("odd_sdlc")),
      attr("function_catalog_size", scalarValue(String(SDLC_FUNCTION_CATALOG.length))),
      attr("executive_graph_functions", stringListValue([
        bootstrapExecutive.name,
        operationalExecutive.name
      ]))
    ])
  });
  assertSdlcModuleJobsTargetPublishedGraphFunctions(module);
  return module;
}

export function assertSdlcModuleJobsTargetPublishedGraphFunctions(
  module: Module
): void {
  const graphFunctionIds = new Set(
    module.graphFunctions.map((graphFunction) => graphFunction.id)
  );
  for (const job of module.jobs) {
    for (const contract of job.contracts) {
      if (!graphFunctionIds.has(contract.targetId)) {
        throw new TypeError(
          `Job ${JSON.stringify(job.name)} targets unpublished graph function ${JSON.stringify(contract.targetId)}`
        );
      }
    }
  }
}
