# Strategy: odd_sdlc Framework Topology Over ABG

**Status**: Commentary strategy, not ratified design law
**Project**: `odd_sdlc`
**Date**: 2026-04-25
**Basis**: implementation inspection under `build_tenants/python/code/odd_sdlc`

## Claim

`odd_sdlc` is an ODD/SDLC product scaffold over GTL and ABG.

ODD is a meta-model over compute, not a synonym for LLM execution. It models
deterministic programs, probabilistic programs, agentic programs, and mixed
programs through the same graph-native control structure.

GTL publishes the constructive graph-function program structure. ABG owns
runtime traversal, continuation, frame truth, result facts, lineage, and
provenance. `odd_sdlc` owns the SDLC domain graph, public start admission,
domain hooks, deterministic evaluation, workspace capability truth, and
operator projections.

The framework is not a second runtime around ABG. It is a governed adapter and
domain hook layer over ABG. Any code that selects hidden next steps, performs
local traversal, or treats projections as source truth crosses the boundary.

The Python tenant functions as discovery substrate. The TypeScript SDLC tenant
functions as the ODD-native rebuild target. The TS tenant preserves the insights
from Python while removing ambiguity between graph definition, graph-function
publication, ABG traversal, compute functors, projection truth, and domain HOW.

## Compute Model

A graph function is a probabilistic program. Its unit of compute is not an
imperative instruction. Its unit of compute is a bounded edge traversal with
eventual closure.

```text
Turing-machine compute:
  program = ordered instructions
  unit = instruction step
  closure = deterministic state transition

Probabilistic graph compute:
  program = graph function
  unit = edge traversal
  closure = admitted evidence, proof, projection, or governed escalation
```

More generally:

```text
ODD program:
  program = graph function
  unit = edge traversal
  compute basis = F_D -> F_P -> F_H
  closure = evidence-backed convergence, block, or escalation
```

An edge traversal owns a compute basis:

```text
Compute(edge) = Compute(F_D -> F_P -> F_H)
```

`F_D`, `F_P`, and `F_H` are not isolated phases that belong to separate
frameworks. They are the available functors for one governed compute traversal.

```text
F_D:
  deterministic proof, validation, contract check, replay check, closure check

F_P:
  probabilistic construction, transformation, repair, interpretation, proposal

F_H:
  human or governance judgement when deterministic and probabilistic closure is
  insufficient, ambiguous, unsafe, or unauthorized
```

The arrow expresses escalation and admissibility order, not a mandatory
every-time sequence. A traversal may close through `F_D`, may require `F_P` to
produce or repair a target state, or may escalate to `F_H` when the open space
requires human/governance authority.

The compute object exposes two core operations:

```text
Compute.Iterate()
Compute.Evaluate()
```

Both operations may use the same functor basis:

```text
Compute.Iterate(edge, state, context)
  may apply F_D to detect existing closure
  may apply F_P to construct or transform target state
  may apply F_H to admit, reject, or constrain traversal when governance is open

Compute.Evaluate(edge, state, evidence)
  may apply F_D to prove closure
  may apply F_P to critique, interpret, or propose repair
  may apply F_H to adjudicate unresolved ambiguity or authority gaps
```

This means `F_P` is not the whole traversal. `F_P` is one functor available to
the traversal. The traversal is the governed compute unit. The event stream must
record which functor basis is used, what evidence is produced, and how closure
is reached or deferred.

The edge traversal therefore carries:

```text
source typed nodes
target typed node
edge contract
compute basis: F_D, F_P, F_H
iteration result
evaluation result
closure state
provenance
replayable projection
```

This is the probabilistic-compute analogue of an instruction trace, except the
trace is evidence-bearing and closure may be eventual.

## ODD As Compute Meta-Model

ODD is graph-native compute governance. It is not restricted to probabilistic or
LLM-reliant work.

```text
Deterministic program:
  graph function whose edges close through F_D

Agentic / LLM-reliant program:
  graph function whose edges require F_P, with F_D and F_H used for proof,
  constraint, review, and closure

Mixed program:
  graph function whose edges select F_D, F_P, or F_H according to each edge
  contract and domain maturity
```

This makes a linter, compiler, parser, solver, test runner, LLM worker, human
review, policy gate, deployment check, or runtime observation a lawful compute
participant when it is bound to an edge contract.

The separation is:

```text
GTL:
  program shape

ABG:
  traversal runtime

ODD:
  domain and governance model over compute

F_D/F_P/F_H:
  available compute functors per edge
```

The value of ODD is one traceable program structure for deterministic,
probabilistic, and governed work. It prevents the product from splitting the
real program across code, prompts, scripts, comments, projections, and human
decisions.

## ODD Program And F_D Program

An `F_D Program` is a deterministic program. Its state space and transition
rules are sufficiently defined for deterministic execution.

Examples:

```text
linter
compiler
parser
test runner
schema validator
ABG runtime
```

ABG is an `F_D Program`. Its runtime mechanics must be deterministic,
replayable, and inspectable. ABG may dispatch probabilistic or human-governed
work, but ABG does not become probabilistic by doing so. It remains the
deterministic traversal runtime that admits starts, advances frames, records
facts, preserves provenance, and projects traversal state.

An `ODD Program` is a graph-function program. Its state space is expressed as
typed nodes. Its compute units are edge traversals. Each edge declares or
derives the compute basis available for closure:

```text
T(F_D)
T(F_D -> F_P)
T(F_D -> F_P -> F_H)
```

The relationship is:

```text
F_D Program:
  deterministic executable over a well-defined state transition

ODD Program:
  graph function composed of governed edge traversals

ABG:
  F_D runtime program that traverses ODD programs
```

An ODD program may call F_D programs as edge functors. A linter edge calls a
linter. A compiler edge calls a compiler. A schema-validation edge calls a
validator. Those deterministic programs are not themselves the ODD program; they
are compute participants bound to declared edge contracts.

The boundary is:

```text
GTL graph function:
  ODD program carrier

ABG:
  deterministic runtime for graph-function traversal

F_D program:
  deterministic edge participant or deterministic runtime implementation

F_P program:
  probabilistic edge participant

F_H judgement:
  governed human/authority participant
```

This separation prevents two errors:

```text
Error 1:
  treating ABG as the domain program rather than the deterministic runtime
  that traverses domain graph functions

Error 2:
  treating every ODD program as LLM-reliant when many ODD edges close through
  deterministic F_D programs
```

## Imperative, Declarative, And Outcome Programs

Program expression and compute basis are different axes.

```text
Program expression:
  imperative
  declarative
  outcome

Compute basis:
  F_D
  F_D -> F_P
  F_D -> F_P -> F_H
```

An imperative program prescribes ordered operations.

```text
program = instruction sequence
unit = instruction step
control = explicit flow
closure = deterministic state update when the machine and inputs are closed
```

A declarative program declares constraints, queries, schemas, rules, or desired
state. A deterministic engine derives an execution plan when the language and
domain are closed.

```text
program = declarations
unit = rule, constraint, query, or plan step
control = engine-selected plan
closure = deterministic satisfaction, validation, or materialization
```

An outcome program declares the target outcome, typed state boundary,
admissible traversal basis, evidence requirements, and closure conditions.

```text
program = graph function
unit = governed edge traversal
control = ABG traversal over GTL graph structure
closure = evidence-backed convergence, block, proof hold, or escalation
```

ODD programs are outcome programs. They can contain deterministic work,
declarative work, probabilistic construction, and human/governance judgement,
but the program expression is the governed outcome graph rather than hidden
imperative orchestration.

The relationship is:

```text
imperative program:
  says how to step

declarative program:
  says what constraints or state must hold

outcome program:
  says what typed transition must close, what evidence counts, and what compute
  basis may be used
```

This keeps `F_D Program` precise. An `F_D Program` can be imperative or
declarative. ABG is an `F_D Program` because its runtime mechanics are
deterministic. An `ODD Program` is an outcome program because its primary unit
is an edge traversal with governed closure.

## Domain Maturity And Functor Selection

Functor selection depends on how well formed the domain state and transition
are.

```text
Deterministic traversal:
  T = T(F_D)

Probabilistic traversal:
  T = T(F_D -> F_P -> F_H)
```

For a well-formed domain edge, the source state, target state, and transition
rule are sufficiently defined for `F_D` to traverse or close the edge.

Example:

```text
code_surface -> lint_result_surface
  F_D = configured language linter
```

For that edge, the linter is the deterministic traversal/evaluation function.
It consumes a typed code surface and produces a typed lint result or proof
surface. The traversal does not require `F_P` when the linter can produce and
prove the target state under the edge contract.

For a generic or open ODD domain edge, `A`, `B`, or `A -> B` is not sufficiently
closed for deterministic traversal. The edge relies more heavily on `F_P` to
search, construct, interpret, propose, or repair target state.

Example:

```text
requirement_surface -> design_surface
  F_D = check required design contract and traceability
  F_P = construct or repair the design candidate
  F_H = adjudicate unresolved ambiguity, authority, or risk
```

`F_D` remains the preferred closure path where deterministic closure exists.
`F_P` exists for underdefined state spaces and open mappings. `F_H` exists for
unresolved authority, ambiguity, judgement, risk, or policy.

For generic ODD domains, more edges rely on `F_P` because source state, target
state, and admissible transformation are often underdefined. For well-formed
domains, more edges close through `F_D`. A mature ODD application moves edges
toward deterministic closure where the domain becomes sufficiently specified,
without pretending that open domains are deterministic before they are.

## Graph Definition

The graph-definition stack is:

```text
typed node
  -> graph vector / edge
  -> graph
  -> graph function
  -> graph function typed surface
  -> public start/query surface
```

A typed node is a local typed locus in a graph. In `odd_sdlc`, nodes represent
bounded SDLC state such as:

```text
input_set
intent_surface
product_surface
requirement_surface
feature_decomp_surface
design_surface
scenario_surface
implementation_module_surface
code_surface
test_run_archive_surface
release_surface
runtime_observation_surface
retrofit_plan_surface
```

A node declares that one kind of state exists at that locus with a schema,
asset-surface contract, tags, and acceptance vocabulary. A node is not a
program. It is typed state.

A graph vector is the lawful transition between typed nodes. It declares one
edge traversal:

```text
(requirement_surface, feature_decomp_surface) -> design_surface
```

A graph is the immutable structural composition of nodes and vectors. It is the
local topology that can be traversed.

A graph function is the named reusable program carrier over a graph. It gives a
graph an outer callable contract:

```text
GF_DERIVE_DESIGN
  inputs: requirement_surface, feature_decomp_surface
  outputs: design_surface
  template: graph containing the derive_design vector
```

ABG traverses the materialized graph function. The graph function is therefore
the constructive carrier for an SDLC program.

A graph function typed surface is the published contract/read model of the
graph function. This surface is represented by the `GraphFunctionEntryPayload`
family from `start_targeting.py` and projected through `query.py`.

The graph function typed surface exposes:

```text
id
name
intent
function_kind
template_kind
tags
inputs
outputs
input_contracts
output_contracts
environment.requires
environment.provides
environment.carries
vectors
job_names
```

The typed surface is not the source graph. It is a projection over the published
graph function for control, audit, query, public targeting, and downstream
tooling.

## Graph Surface Authority

The graph terms have separate authority:

```text
Node:
  typed state locus

GraphVector:
  lawful transition between nodes

Graph:
  structural composition of nodes and vectors

GraphFunction:
  named executable/reusable program carrier

GraphFunctionTypedSurface:
  public typed projection of the graph-function contract

StartTarget:
  operator-addressable binding to a graph function

AssetBinding:
  mapping from typed node/state to workspace asset
```

The source truth for SDLC graph structure is GTL module publication. Query,
start-targeting, and asset-ownership surfaces are projections over that source
truth.

The lawful chain is:

```text
gtl_module publishes graph-function truth
  -> query-domain projects graph-function typed surfaces
  -> start-targeting binds public operator requests to graph functions
  -> asset ownership maps assets back to governing graph functions
  -> ABG traverses the materialized graph function
  -> SDLC hooks produce or evaluate one bounded node transition
```

The product does not treat the graph function typed surface as the graph
definition. The typed surface is a read/control surface. The graph function
publication is the constructive carrier. The typed nodes are the state loci
inside the carrier.

## Design Conflict

The active design conflict is a naming and authority conflict. The word
`graph` currently points at multiple surfaces:

```text
GTL graph structure
SDLC asset dependency graph
graph function program
query-domain graph function payload
start-target catalog entry
asset ownership projection
```

Those surfaces are related, but they are not interchangeable.

The risk is treating a projected typed surface as graph-definition truth. That
turns a read model into source authority and blurs the ABG/GTL/SDLC boundary.

The framework resolves the conflict by preserving the authority chain:

```text
typed nodes define state loci
graph vectors define traversable edges
graphs compose traversable structure
graph functions publish reusable programs over graphs
typed surfaces project those programs for query and control
start targets bind operator intent to graph functions
asset bindings connect graph state to workspace assets
ABG traverses the selected graph function
SDLC hooks perform bounded domain work at the selected edge
```

This distinction makes SDLC graph-native without making SDLC a shadow runtime.

## SDLC.TS Rebuild Position

`SDLC.python` contains discovery history. It exposes the ambiguities produced by
building the meta-model, the SDLC domain, runtime adapters, proof checks,
constructor hooks, query projections, and demonstration workflows in one tenant.

`SDLC.TS` is the ODD-native app target. It does not copy Python tenant shape. It
uses the Python tenant insights to make each authority boundary explicit.

Target structure:

```text
SDLC.TS = ODD-native app
GTL graph functions = programs
edge traversal = unit of compute
edge contract = compute basis declaration
ABG = runtime traversal engine
F_D/F_P/F_H = functors available per edge
query/projection = read model, not source truth
```

Every edge declares:

```text
source nodes
target node
edge contract
compute basis: F_D / F_P / F_H
iteration behavior
evaluation behavior
closure evidence
projection shape
```

Every graph function declares:

```text
name
intent
inputs
outputs
vectors
environment
start target
asset bindings
proof obligations
```

The TS module topology follows the graph-native split:

```text
graph/
  nodes.ts
  edges.ts
  graph-functions.ts
  module.ts

compute/
  compute-basis.ts
  fd/
  fp/
  fh/
  iterate.ts
  evaluate.ts

runtime/
  abg-adapter.ts
  start.ts
  continuation.ts
  events.ts

domain/
  assets.ts
  requirements.ts
  product.ts
  design.ts

projection/
  query-domain.ts
  gap-dossier.ts
  traceability.ts

cli/
  index.ts
```

The design rules are:

```text
No imperative SDLC service hides a graph function.
No orchestration loop hides an edge traversal.
No projection becomes source truth.
No F_P call occurs outside a declared edge contract.
No F_D or F_H result closes an edge without evidence.
```

This is the rebuild opportunity: convert Python discovery into TS graph-native
structure, then lift the stable principles into ODD method and constitutional
method.

## Framework Shape

```text
operator or script
  -> CLI/app shell
  -> workspace profile and runtime config
  -> GTL module publication
  -> catalog/query/gap projection
  -> public-start admission
  -> ABG start/block/converge/dispatch boundary
  -> SDLC constructor hook or worker attachment
  -> deterministic proof and closure
  -> runtime event and gap projection
  -> public-start admission for another traversal only when public policy permits
```

The framework participates before ABG, inside ABG-selected work, and after ABG.

Before ABG:

```text
publish graph functions
publish assets and function catalogs
infer workspace profile and capabilities
admit public targets
bind execution contracts
```

Inside ABG-selected work:

```text
run one bounded SDLC constructor, evaluator, or worker hook
```

After ABG:

```text
project runtime facts
publish gap and proof surfaces
expose query-domain read models
admit another traversal only through declared public-start policy
```

## Command Boundary

Primary files:

- `__main__.py`
- `app.py`

The command path is:

```text
odd_sdlc.__main__.main
  -> app.bootstrap(workspace_root)
  -> app.initialize(config)
  -> app.OddSdlcApp.scope(...)
  -> selected command surface
```

The command surface includes:

```text
catalog
programs
observe
query-assets
query-domain
refresh-analysis
gaps
start
dispatch-operational
continue
construct
normalize-workspace
install
prepare-sandbox
observe-sandbox
reset-sandbox
self-test
```

`app.py` creates `AppConfig`, loads runtime config, binds
`odd_sdlc.gtl_module.module(workspace_root)`, creates `OddSdlcApp`, exposes
`catalog`, `gaps`, `iterate`, and `start`, and constructs ABG scopes from
workspace root, runtime config, worker, runtime identity, workflow root, and
active workflow.

`app.py` also carries public-start admission, public-next looping,
human-proxy approval application, gap-surface publication, ABG invocation,
dispatch result classification, and capability-truth augmentation. This makes
`app.py` the main consolidation pressure point.

## GTL Program Publication

Primary files:

- `gtl_module.py`
- `function_catalog.py`
- `software_domain_catalog.py`
- `program_catalog.py`
- `workspace_assets.py`
- `asset_types.py`
- `domain_model.py`

`gtl_module.py` publishes the `odd_sdlc` GTL `Module`.

The publication path is:

```text
gtl_module.module(workspace_root)
  -> _build_module(workspace_root)
  -> _configured_leaf_graph_functions(workspace_root)
  -> _active_operational_leaf_graph_functions(workspace_root)
  -> load_project_profile(workspace_root)
  -> operational_capability_projection_for_profile(...)
  -> Module(...)
```

The module publishes graph functions, executive graph functions, jobs, roles,
operators, evaluators, rules, refinement boundaries, function-catalog metadata,
ambiguity-policy metadata, operational-capability metadata, and requirement
metadata.

Published graph functions include constitutional derivation, design derivation,
code derivation, test derivation, release preparation, operational execution,
execution-contract admission, and consensus review functions.

Published executive programs include:

```text
bootstrap_release_self_test
release_operational_cycle
```

Published jobs include:

```text
bootstrap_release_self_test_job
release_operational_cycle_job
```

GTL graph functions are the constructive carrier. They are the SDLC programs
that ABG traverses.

## Public Start Admission

Primary files:

- `public_start.py`
- `public_start_contract.py`
- `public_start_subcarriers.py`
- `start_targeting.py`
- `execution_contract.py`
- `worker_attachment.py`

The public start path is:

```text
odd_sdlc start --scope ... --target ... --until ...
  -> app.start(...)
  -> ensure_workspace_ready(...)
  -> parse_gap_scope_selector(...)
  -> _resolve_public_start_admission(...)
  -> start_targeting/public_start projection
  -> execution_contract.admit_bound_execution_start(...)
  -> genesis.start.gen_start(...) or ABG blocked/converged helper
  -> public_start result projection
  -> optional genesis.dispatch_runtime.auto_dispatch_from_result(...)
  -> gap/proof/runtime publication
  -> query/gaps projections over admitted state
```

Public start translates operator intent into ABG start intent. It admits
`next`, `graph_function:<handle>`, and `asset:<handle>` targets. It blocks on
unresolved public-start conditions, publishes pending constitutional start
gates, admits `BoundExecutionStart`, and classifies ABG outcomes as terminal,
blocked, worker-attachment blocked, human-gate required, dispatch required,
proof hold, yielded, or failure.

For `--target next`, `_run_public_next_start(...)` performs a bounded public
loop and republishes the gap surface between ABG outcomes when the projected
result admits another traversal. That loop is public-start policy. It is not
domain traversal authority.

## ABG Runtime Boundary

Primary files:

- `runtime_contract.py`
- `runtime_event_contract.py`
- `runtime_contexts.py`
- `runtime_effects.py`
- `continuation.py`
- `operational_dispatch.py`

This layer carries runtime identity, event contract shapes, continuation
adapters, operational dispatch adapters, and result-event projections.

ABG owns traversal, iteration, continuation, runtime frames, yielded facts,
blocked facts, dispatchable facts, terminal facts, proof-hold facts, lineage,
and provenance.

`odd_sdlc` stays on the adapter side of this boundary. It may bind an ABG start
intent, call ABG, project ABG facts, and dispatch a bounded SDLC hook when ABG
returns a dispatchable result. It may not create a hidden traversal engine.

## Domain Hook Layer

Primary file:

- `constructor.py`

`constructor.construct_manifest(manifest_path, workspace_root)` implements the
bounded constructor turn for SDLC workspaces. It reads ABG/F_P manifests,
materializes target assets, emits work reports, assesses generated asset
contracts, and preserves authoritative surfaces where preservation is declared.

The constructor hook family materializes:

```text
intent
product
goals
requirements
feature decomposition
UAT test cases
design
review assessment
consensus decision
scenarios
implementation design
implementation stack profile
implementation module surface
code surface
release surface
build execution surfaces
test execution surfaces
deployment surfaces
runtime observation
retrofit plan
test design
test stack
test module
test code
test run archive
```

This is SDLC-owned F_P domain work. It carries a large amount of domain HOW,
but it does not own ABG traversal authority.

## Deterministic Proof And Closure

Primary files:

- `fd_checks.py`
- `fd_contracts.py`
- `test_lane_evidence.py`
- `repair_frontier.py`
- `traceability.py`
- `traceability_index.py`
- `traceability_report.py`
- `requirement_closure.py`

This layer evaluates the state produced by ABG-selected graph traversals and
SDLC constructor hooks. It publishes deterministic checks, validates
requirement traceability, validates planned and realized test traceability,
checks generated asset contracts, computes requirement closure registers,
computes executability gaps, collects declared obligation gaps, and publishes
repair-frontier evidence.

This layer proves and classifies state. It does not choose hidden next
traversal steps.

## Workspace Profile And Capability Truth

Primary files:

- `normalization.py`
- `project_profile.py`
- `install_topology.py`
- `release/install.py`
- `publication_io.py`
- `imported_intent_carry_forward.py`
- `constitutional_surface.py`

This layer normalizes workspaces, infers project profile data, infers execution
contract defaults, publishes operational capability projections, declares build,
test, deploy, and runtime observation capabilities, installs release surfaces,
and preserves imported intent where required.

Capability truth enters graph publication and public-start admission through
this layer. Divergence between profile truth, normalized workspace truth, and
`app.py` capability augmentation is a framework defect.

## Query And Gap Projection

Primary files:

- `query.py`
- `query_contract.py`
- `analysis.py`
- `gap_dossier.py`
- `span_analysis.py`
- `triage.py`
- `homeostatic_loop.py`
- `observer.py`
- `work_item_routing.py`

The query path is:

```text
query.query_domain(app)
  -> app.catalog(app)
  -> load_gap_dossier_read_model(...)
  -> query_domain_contract()
  -> typed projection helpers for each public surface
```

This layer exposes assets, semantic facets, asset families, functions, jobs,
bindings, graph functions, programs, edge contracts, work-act types, start
targets, asset ownership, ambiguity register, requirement closure register,
operational capabilities, execution contract surface, and gap dossier.

Query and gap surfaces are read models over admitted truth. They do not outrank
specification, GTL publication, or ABG runtime facts.

## Ownership Boundaries

GTL owns:

- graph-function structure
- nodes, vectors, jobs, and executive programs
- constructive program publication

ABG owns:

- traversal
- iteration
- continuation
- runtime frames
- yielded, blocked, dispatchable, terminal, and proof-hold facts
- lineage and provenance of runtime movement

`odd_sdlc` owns:

- SDLC asset taxonomy
- SDLC graph functions and programs
- SDLC constructor hooks
- SDLC deterministic proof checks
- SDLC execution-contract interpretation
- SDLC query and operator projections
- SDLC policy for public starts

`odd_sdlc` does not own:

- hidden traversal loops
- local imperative orchestration presented as graph execution
- projection truth that outranks source truth
- ABG runtime fact authority

## Consolidation Pressure

The consolidation pressure is specific:

1. `app.py` combines shell, bootstrap, catalog, gap publication, public-start
   admission, ABG invocation, public-next looping, human-proxy application,
   dispatch projection, and capability augmentation.
2. `gtl_module.py` combines graph-function declaration, dynamic capability
   filtering, active executive construction, evaluator registration, module
   metadata, and job publication.
3. `public_start.py` carries many result coercions and policy projections; it
   needs one declared public result contract.
4. `constructor.py` mixes many asset constructors, preservation rules,
   materialization, work reports, and fulfillment assessment.
5. `project_profile.py` and `normalization.py` both influence workspace truth,
   capability truth, and execution contract defaults.
6. `query.py` aggregates broad read models and needs a clear separation between
   projection truth and source truth.

The cleanup order follows authority:

```text
name the role
state the source authority
state the input contract
state the output contract
state whether the role may call ABG
state whether the role may write workspace state
state whether the role may admit another traversal
then consolidate
```

## Governance Rule

The framework rule is:

```text
SDLC publishes the graph and domain hooks.
SDLC admits public starts.
ABG runs or blocks the selected traversal.
SDLC dispatches only bounded constructor or worker hooks from ABG output.
SDLC evaluates and projects admitted facts.
SDLC admits another traversal only through declared public-start policy.
```

The highest-risk module shape is:

```text
may write workspace state
may call ABG
may admit another traversal
```

That shape requires explicit design authority. Without that authority, it is a
shadow runtime risk.

## One-Hop Program: `Fg_1`

`Fg_1` is the minimum ABG substrate investigation program.

It is not an SDLC domain program. It is a generic one-edge graph function used
to expose the lowest runnable graph-function shape before `SDLC.TS` adds domain
meaning.

```text
Fg_1:
  one graph function
  one edge
  generic source node A
  generic target node B
  no transform hook
  no evaluator hook
  no domain-specific schema
```

The actual TypeScript investigation carrier is:

```ts
function genericNode(id, name) {
  return admitNode({
    id,
    name,
    schema: { kind: "symbolic", ref: "" },
    markov: [],
    assetSurface: {},
    tags: []
  });
}

function genericSingleHopGraphFunction() {
  const source = genericNode("node-t059-a", "A");
  const target = genericNode("node-t059-b", "B");
  const vector = edge([source], target, {
    id: "graph-t059-fg1",
    name: "A→B",
    operators: [],
    evaluators: [],
    contexts: [],
    rule: null,
    allowsSubwork: false,
    declarations: { entries: [] },
    tags: ["t059", "generic_single_hop"]
  }).vectors[0];

  return graphFunctionForVector(vector, {
    id: "graph-function-t059-fg1",
    name: "Fg_1",
    declarations: { entries: [] },
    tags: ["t059", "generic_single_hop"]
  });
}
```

The module publishes `Fg_1` as a job-addressable graph function:

```ts
function moduleFor(graphFunction) {
  return admitModule({
    name: "t059_generic_single_hop_module",
    graphs: [],
    graphFunctions: [graphFunction],
    refinementBoundaries: [],
    candidateFamilies: [],
    jobs: [
      {
        id: "job-t059-fg1",
        name: "Fg_1_job",
        contracts: [{ kind: "graph_function", targetId: graphFunction.id }],
        roles: [],
        tags: ["t059"]
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
```

The runtime basis supplies the compute regime:

```ts
function policyFor(regime) {
  return admitResolvedPolicyIdentity({
    resolvedPolicyBundleRef: `policy://t059/${regime}`,
    defaultRegime: regime,
    dispatchRef: regime === "F_P" ? "dispatch://t059" : null,
    approvalSubjectRef: regime === "F_H" ? "approval://t059" : null
  });
}

function basisFor(regime) {
  const graphFunction = genericSingleHopGraphFunction();
  return admitExecutionBasis({
    startIntent: admitStartIntent({
      scope: {
        kind: "workspace",
        workspaceRoot: "/workspace/t059-generic-single-hop",
        moduleName: "t059_generic_single_hop_module"
      },
      target: {
        kind: "graph_function",
        handle: "Fg_1"
      },
      until: "converged"
    }),
    module: moduleFor(graphFunction),
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: "worker://t059",
      backendId: "backend://node",
      buildId: "build://typescript",
      resolvedRuntimeRef: "runtime://typescript/node"
    }),
    resolvedPolicy: policyFor(regime),
    runId: `run://t059/${regime}`,
    workKey: `wk://t059/${regime}`,
    frameId: null,
    frameLineageId: null
  });
}
```

The observed ABG substrate behavior is:

```text
basisFor("F_D") -> fd_advance over A→B
basisFor("F_P") -> fp_dispatch over A→B
basisFor("F_H") -> fh_escalation over A→B
missing defaultRegime -> admission failure before execution basis
```

The first structural iteration projection is:

```text
graphFunction.name = Fg_1
graph.vectors.length = 1
vector.name = A→B
source.schema.ref = ""
target.schema.ref = ""
source.assetSurface.kind = ""
target.assetSurface.kind = ""
operators = []
evaluators = []
rule = null
nextVectorIndex = 0
decision.kind = advance_vector
decision.edge = A→B
```

The event sequence for the open structural edge is:

```text
graph_call_opened
frame_opened
vector_traversal_planned
```

The transition event sequences are:

```text
F_D:
  basis_admitted
  fd_advance_ready

F_P:
  basis_admitted
  fp_dispatch_requested

F_H:
  basis_admitted
  fh_escalated
```

The source proof is:

```text
abiogenesis/build_tenants/abiogenesis/typescript/test_env/tests/
  test_m03_generic_single_hop_graph_function_investigation.test.mjs
```

The ticket proof is:

```text
abiogenesis/.ai-workspace/tickets/completed/
  T-059-investigate-typescript-abg-generic-single-hop-graph-function-semantics.md
```

The substrate finding is:

```text
ABG treats a generic one-edge graph function as structurally traversable when
an execution policy basis is admitted.

The runtime policy basis selects F_D, F_P, or F_H behavior.

ABG does not require an edge-local evaluator or transform hook for F_D readiness
in the current TypeScript substrate.
```

The open method question is:

```text
Does runtime policy-supplied defaultRegime remain sufficient compute basis for
a generic edge, or does ODD/ABG method require a distinct no_edge_compute_basis
block when the edge carries no local compute declaration?
```

## ABG PoC Traversal Scenario Ladder

The ABG proof-of-concept space is a scenario ladder. Each scenario adds one
kind of authority and proves what that authority does and does not imply.

### 1. Undefined Traversal

Undefined traversal is the current `Fg_1` case.

```text
Fg_1:
  A -> B
  source schema ref = ""
  target schema ref = ""
  source asset kind = ""
  target asset kind = ""
  operators = []
  evaluators = []
  rule = null
```

It proves the bare structural morphism:

```text
edge shape exists
edge shape does not choose compute regime
runtime policy may interpret the traversal
missing runtime policy fails closed
no identity, transform, evaluation, or domain completion is implied
```

### 2. Minimum Typed Traversal

Minimum typed traversal is the next case.

```text
GF_TYPED_001:
  A_1 -> A_2
  source type = A_1
  target type = A_2
  source schema ref = schema://A_1
  target schema ref = schema://A_2
  source asset kind = A_1
  target asset kind = A_2
  operators = []
  evaluators = []
  rule = null
```

It proves typed structural traversal:

```text
the loci are typed
the outer interface is visible
the edge remains a structural morphism
type presence does not imply transform authority
type presence does not imply evaluator authority
type presence does not imply F_D or F_P fallback
runtime policy still supplies the invocation interpretation basis
```

This case separates type/interface authority from compute authority.

The current TypeScript proof is:

```text
abiogenesis/build_tenants/abiogenesis/typescript/test_env/tests/
  test_m03_minimum_typed_traversal_investigation.test.mjs
```

The ticket proof is:

```text
abiogenesis/.ai-workspace/tickets/completed/
  T-061-investigate-typescript-abg-minimum-typed-traversal-semantics.md
```

### 3. Minimum Defined Traversal

Minimum defined traversal is the first constructive program.

```text
GF_001:
  A_1 -> A_2
  source type = A_1
  target type = A_2
  T_001_FD = Transform(A_1 -> A_2, F_D)
  T_001_FP = Transform(A_1 -> A_2, F_P)
  E_001_FD = Evaluate(A_1, A_2, F_D)
  E_001_FP = Evaluate(A_1, A_2, F_P)
```

It proves declared constructive traversal:

```text
operators declare lawful production or advancement surfaces
evaluators declare lawful closure or judgment surfaces
runtime policy chooses the active interpretation path
ABG executes and records traversal evidence
domain meaning remains owned by the domain bindings
```

The progression is:

```text
undefined traversal
  -> minimum typed traversal
  -> minimum defined traversal
```

This is the smallest useful PoC ladder for SDLC.TS design. It lets the next
product design distinguish graph shape, typed interface, and declared compute
semantics before adding SDLC domain workflow structure.

## ABG Deterministic Traversal Structure Probe

The PoC ladder now has one reusable F_D probe:

```text
deriveTraversalStructureProbe(ExecutionBasis, RuntimeEvent[])
```

The probe is a pure projection. It does not emit events, read files, mutate
runtime truth, or execute domain work.

It reports:

```text
graph function identity
job identity
current vector index
edge name
source node schema and asset-surface truth
target node schema and asset-surface truth
operator surfaces
evaluator surfaces
rule surface
declared operator/evaluator regimes
runtime policy regime
transition kind
iteration event kinds
transition event kinds
allowed claims
not-allowed claims
```

It classifies the current ladder as:

```text
undefined traversal      -> undefined_structural_morphism
minimum typed traversal  -> typed_structural_morphism
minimum defined traversal -> defined_constructive_morphism
```

The point is deterministic exploration. ABG can inspect what authority exists
for one traversal and what claims are forbidden before SDLC.TS adds domain
workflow structure.

The current TypeScript proof is:

```text
abiogenesis/build_tenants/abiogenesis/typescript/test_env/tests/
  test_m03_traversal_structure_probe_unit.test.mjs
```

The ticket proof is:

```text
abiogenesis/.ai-workspace/tickets/completed/
  T-062-realize-typescript-abg-deterministic-traversal-structure-probe.md
```

## SDLC Extension: GTL Programs vs ABG IoC Bindings

The open design question is whether SDLC extends itself through higher-order
GTL graph functions, or whether ABG needs SDLC-specific IoC plugins for domain
concepts such as Gap and Triage.

The current answer is split by authority:

```text
GTL owns:
  the SDLC program shape
  published graph functions
  higher-order composition
  typed outer interfaces
  declared operator/evaluator references

ABG owns:
  start admission
  internal traversal
  current vector selection
  F_D/F_P/F_H transition routing
  event recording
  replay projection
  lawful stop, hold, yield, gap, and convergence truth

SDLC owns:
  what a domain gap means
  how triage classifies it
  what ticket shape is valid
  what consensus means
  which operators/evaluators implement SDLC semantics

IoC bindings own:
  concrete execution of declared operators and evaluators
  side effects such as writing a ticket
  deterministic checks such as lint/test/schema validation
  probabilistic or human worker dispatch
```

So the SDLC loop should be expressible as a GTL graph-function program:

```text
Gap_Eval
  -> Triage
  -> Create_Ticket | Select_Action
  -> Process_Ticket
  -> Consensus
  -> Yield | Close | Stop
```

`Create_Ticket` can be a GTL graph function. Its contract declares the source
gap shape, target ticket shape, operator binding, evaluator binding, and
expected evidence. ABG does not need to know what a ticket means. ABG needs to
know how to traverse the graph function, dispatch the declared binding, record
events, and project whether the traversal is open, blocked, yielded, closed, or
converged.

The IoC plugin boundary exists only when declared GTL work must be executed:

```text
GTL declaration:
  Operator(name="create_ticket", regime="F_D" | "F_P" | "F_H",
           binding="operator://sdlc/create-ticket")

Runtime binding:
  operator://sdlc/create-ticket
    -> concrete TypeScript function, worker, command, or adapter
```

The binding performs the domain work. The binding does not become the source of
SDLC program structure. If the binding starts choosing hidden next steps,
inventing ticket semantics outside the graph function, or bypassing ABG event
truth, it has become a second runtime and crosses the boundary.

There are two meanings of "gap" that must remain separate:

```text
ABG/public gap:
  runtime projection over open, blocked, incomplete, or non-converged traversal

SDLC domain gap:
  domain artifact produced or classified by SDLC graph functions and
  evaluators
```

ABG may project that traversal is blocked or incomplete. SDLC decides whether
that condition is a missing requirement, design ambiguity, failed proof,
ticketable defect, operator question, or no-action condition.

The current TypeScript gap is therefore not GTL language expressivity. GTL
already has graph functions, composition, identity, substitution, recursion,
fan-out, fan-in, gate, and promotion surfaces. The gap is governed runtime
proof:

```text
prove that an SDLC-shaped composed graph function can be declared in GTL,
admitted as an ABG execution basis,
traversed by ABG without SDLC-specific runtime semantics,
and stopped/yielded/closed through declared operator and evaluator bindings.
```

The Gap/Triage loop is not the next PoC. It depends on a more fundamental SDLC
primitive: conformant bootstrap ingress and derived-element lineage.

## Foundational PoC: Bootstrap Conformance And Derived-Element Lineage

This PoC is an idealized target, not a port of the Python constructor. Python
already has the behavior in pieces, but it is spread across normalization,
project-profile inference, constructor hooks, asset checkpoints, query
projections, and runtime-event publication.

The SDLC.TS target should express the primitive as one graph-function program:

```text
GF_BOOTSTRAP_PROJECT:
  BootstrapInputSet -> Project
```

This keeps the input typed without pretending it is already well-formed. The
source type is a conformant ingress envelope:

```text
BootstrapInputSet:
  unstructured inputs
  loosely structured inputs
  structured inputs
  source refs
  digests/checkpoints
  detected schemas
  imported authority markers
  confidence and ambiguity observations
```

The target type is a graph-defined project entity:

```text
Project:
  project identity
  authority surfaces
  product/intent/requirement candidates
  asset graph
  ambiguity register
  capability profile
  derivation ledger
```

The bootstrap edge is the conformant ingress traversal:

```text
BootstrapInputSet -> Project
```

It may use:

```text
F_D:
  inventory input refs
  classify obvious media/schema
  hash and checkpoint sources
  detect existing authority markers
  validate the Project output contract

F_P:
  infer project identity
  normalize loose language into candidate authority surfaces
  synthesize project graph candidates
  propose ambiguities and confidence notes

F_H:
  adjudicate project identity, authority, scope, or imported-truth conflicts
```

The second primitive is derived-element lineage. SDLC does not only transform
typed assets. It tracks which elements inside typed assets derive from which
upstream elements.

There are two lineage layers:

```text
Asset lineage:
  BootstrapInputSet -> Project
  requirement_surface -> design_surface
  design_surface -> implementation_module_surface
  implementation_module_surface -> code_surface
  code_surface -> test_run_archive_surface

Element lineage:
  source_element -> derived_element
  requirement -> design claim
  design claim -> module obligation
  module obligation -> code symbol
  code symbol -> test assertion
  test assertion -> run evidence
```

ABG owns runtime provenance:

```text
run id
graph function id
vector id
frame id
event refs
transition kind
dispatch/evaluation facts
projection state
```

SDLC owns semantic derivation:

```text
source asset id
source element id
target asset id
target element id
derivation kind
derivation claim
evidence ref
confidence/regime
closure status
```

The PoC should prove that runtime provenance and semantic derivation can be
joined without collapsing one into the other:

```text
Runtime provenance says:
  which graph function/vector/event produced movement

Semantic lineage says:
  which project element was derived from which prior element
```

The minimum proof shape is:

```text
SDLC_BOOTSTRAP_LINEAGE_001:
  input:
    one unstructured source note
    one loosely structured requirement list
    one structured project hint

  graph function:
    BootstrapInputSet -> Project

  output:
    Project entity with typed project identity and authority surfaces
    asset-level lineage entries
    element-level lineage entries
    ambiguity entries where confidence is insufficient

  ABG proof:
    traversal probe reports the edge structure and declared compute surfaces
    runtime events carry graph-function/vector provenance
    no SDLC semantics are built into ABG

  SDLC proof:
    bootstrap output is a typed Project, not loose text
    derived elements carry source refs
    lineage can answer "why does this Project element exist?"
    lineage can answer "which source input produced this element?"
```

Only after this foundation should the Gap/Triage loop PoC run:

```text
SDLC_LOOP_001:
  minimum composed graph function:
    Gap_Eval -> Triage -> Create_Ticket

Proof:
  ABG forensic probe reports the declared graph structure
  ABG transition derives from runtime policy and replay truth
  SDLC semantics remain in graph-function declarations and bindings
  ticket creation is a declared operator effect, not an ABG built-in
  public gap projection remains runtime truth, not domain triage truth
```

## Data Mapper Real Ingress Proof

The idealized `BootstrapInputSet -> Project` proof now has a real-ingress
counterpart in the Abiogenesis TypeScript tenant.

The fixture is:

```text
ai_sdlc_examples/local_projects/data_mapper/data_mapper.template
```

The sampled recent generated runs are:

```text
data_mapper.test41
data_mapper.test42
data_mapper.test43
```

The important distinction is:

```text
Python SDLC normalization:
  reads imported workspace truth
  publishes canonical read models
  mutates workspace topology into operable shape
  writes normalization, bootstrap, and analysis evidence

TypeScript M05 ingress proof:
  reads the same class of real source surfaces in a sandbox test
  computes file URIs and digests
  extracts project, intent, and requirement markers
  admits those facts into SdlcBootstrapInputSet
  derives SdlcProject through the existing carrier
  preserves semantic lineage in SdlcDerivationLedger
```

The TypeScript proof does not implement an SDLC.TS installer. It proves that
real imported authority and generated read models can enter the ABG/GTL/M05
substrate conformantly before any future SDLC.TS app shape is chosen.

The current proof command is:

```text
cd /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript
npm run test:t064
```

Current observed result:

```text
tests 3
pass 3
fail 0
duration_ms 67.277917
```

The proof asserts:

```text
data_mapper.template authority is sampled
recent generated Python SDLC run surfaces are sampled
Python normalization evidence is present
real file URIs and SHA-256 digests are admitted
project identity derives as Categorical Data Mapping & Computation Engine (CDME)
REQ-LDM-001 is normalized and traced to its real source file
runtime/context evidence without semantic authority remains ambiguity
```

This is the first useful bridge between the Python SDLC ingest lesson and the
ODD-native SDLC.TS direction. Python demonstrates the operational normalization
shape. TypeScript demonstrates the smaller algebraic substrate shape:

```text
real ingress facts -> BootstrapInputSet -> Project + derivation ledger
```
