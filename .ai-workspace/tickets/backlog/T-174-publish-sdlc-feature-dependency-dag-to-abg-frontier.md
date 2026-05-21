---
id: T-174
title: Publish SDLC feature dependency DAG to ABG frontier
type: feature
ticket_category: design_reframe
status: backlog
proof_status: backlog_requirements_intake
priority: critical
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-21
updated_at: 2026-05-21
triaged_at: 2026-05-21
activated_at: 2026-05-21
backlogged_at: 2026-05-21
goal: prove Option 2 by establishing how odd_sdlc derives feature/module/test dependency DAGs and publishes them as ABG-executable frontiers
change_class: requirement_reprice
re_entry_point: requirements
first_missing_layer: requirements
governance_scope: STDO Method / odd_sdlc TypeScript feature-dependency DAG publication to ABG frontier
source_documents:
  - specification/GOALS.md
  - specification/INTENT.md
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SCHEDULING_PHASE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-141-declare-event-sourced-saga-frontier-and-runtime-realization-transparency.md
related_tickets:
  - .ai-workspace/tickets/active/T-172-realize-staged-disambiguation-graph-and-decomposition-admission.md
  - .ai-workspace/tickets/active/T-173-realize-complexity-admitted-min-fp-traversal-selection.md
  - .ai-workspace/tickets/completed/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md
affected_boundary:
  requirements:
    - specification/requirements/02-graph-functions.md
    - specification/requirements/03-runtime-governance.md
    - specification/requirements/16-edge-gain-closure-contract.md
    - specification/requirements/18-typed-construction-algebra.md
  product:
    - specification/PRODUCT.md
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SCHEDULING_PHASE.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  graph_code:
    - build_tenants/typescript/code/src/graph/catalog.ts
    - build_tenants/typescript/code/src/graph/overlays.ts
    - build_tenants/typescript/code/src/graph/edge_accounting.ts
  operator_code:
    - build_tenants/typescript/code/src/operator/installed_operator.ts
    - build_tenants/typescript/code/src/operator/traversal_consequence.ts
    - build_tenants/typescript/code/src/operator/handoff.ts
    - build_tenants/typescript/code/src/operator/carriers.ts
  analyzer_code:
    - build_tenants/typescript/code/src/analysis/run_analysis.ts
    - build_tenants/typescript/code/src/analysis/render_markdown.ts
  tests:
    - build_tenants/typescript/test_env/tests
    - build_tenants/typescript/test_env/sandbox
target_truth: odd_sdlc tracks feature/module/test construction work in admitted ledgers, then translates those ledger rows into a product-specific dependency DAG plus `start_nodes[]`. The DAG identifies the dependency relation for the tracked feature work; `start_nodes[]` identifies the currently dependency-free dispatch frontier. odd_sdlc publishes `{ start_nodes[], DAG }` as ABG frontier declarations with declared predecessor, successor, read, write, output-allocation, and fan-in relations. ABG owns `parallel(start_nodes[], DAG)`: ready-frontier selection, branch leasing, bounded concurrency, retries, fan-out/fan-in event merge, and replay truth. A serial topological order may exist as a projection, but the SDLC-owned dependency DAG is the construction bridge that lets ABG exploit inherent product parallelism.
superseded_truth: odd_sdlc either depends on a pre-authored GTL node DAG independent of SDLC meaning, or keeps module/test parallelism as design intent, prompt text, or standalone ABG proof outside the installed SDLC operator.
closure_law: This ticket closes only when requirements, design, graph catalog, runtime dispatch, event archives, analyzer output, and live sandbox proof demonstrate that odd_sdlc can translate admitted feature/module/test ledgers into `{ start_nodes[], DAG }` and publish that structure to ABG. The proof must show ABG selecting independent ready branches from SDLC-derived dependencies, not the live harness or SDLC operator manually stepping each stage. Module implementation must be schedulable by `module_dependency_map`; test-case/test materialization must be able to run as a parallel branch family from admitted testcase/test topology where write territories are independent; running tests remains downstream fan-in over implementation and test artifacts.
evaluation_criteria:
  - requirements/product/design distinguish Option 1 substrate DAGs from Option 2 SDLC-derived feature dependency DAGs
  - feature/module/test construction ledgers identify the work items to dispatch and the dependency DAG for those items
  - SDLC publishes `{ start_nodes[], DAG }`, not a branch execution loop
  - `module_dependency_map` is admitted as the authority for module implementation branch dependencies and steel-thread derivation
  - test-case/test topology is admitted as the authority for the test branch family
  - graph catalog exposes the sequential SDLC disambiguation prefix and the product-specific parallel branch families it can publish to ABG
  - every selected graph function is normalized to a DAG while preserving existing behavior for serial chains
  - edge traversal type selects the collective feature ledger input set, not the execution mode
  - dependency evaluation derives ready rows from admitted graph declarations, ledger predecessor refs, module/test dependency maps, and write/output conflict checks
  - the current serial executive step array is demoted to a topological projection or deleted as execution authority for admitted branch families
  - test design and test materialization are split or refactored so tests can be built from admitted testcase/test-topology/API authority without requiring completed component source files
  - any code-dependent test adaptation is a fan-in/qualification/projection step, not a precondition that serializes the test branch family behind all code build
  - module implementation and test materialization branches declare disjoint write territories and output allocations before concurrent dispatch
  - installed operator submits admitted SDLC DAG ready branches to ABG event-sourced saga frontier and records branch leases, payload admissions, retry isolation, and fan-in events
  - live harnesses only start the traversal and inspect archived proof; they do not select individual stages or branch order
  - analyzer reports the selected DAG, ready-frontier batches, parallel branches, fan-in nodes, branch worker refs, write-territory conflicts, and any serializing dependency that prevents parallelism
  - the minimal four-lane hello-world sandbox proves two implementation lanes and two test lanes from an SDLC-derived dependency DAG before fan-in under installed SDLC plus installed ABG packages
  - a full-graph deterministic proof shows every retained selected edge is reachable in the DAG and no cycle or unaccounted serial-only dependency remains
abg_dependency_boundary: ABG owns the generic event-sourced saga frontier capability. odd_sdlc must not reimplement branch scheduling. odd_sdlc derives product-specific feature/module/test dependency topology, compiles admitted ledger rows, dependency maps, start nodes, and write territories into ABG frontier declarations, then consumes ABG events as runtime truth.
non_closure_conditions:
  - Option 2 is claimed from ABG standalone tests without proving installed odd_sdlc derives and submits SDLC-owned `{ start_nodes[], DAG }` to ABG
  - a live scenario script runs the stages one by one or selects branch order outside ABG
  - module implementation ignores `module_dependency_map` and runs as one broad materialization edge
  - test branch materialization still depends on completed component code when admitted testcase/test topology authority is sufficient to build tests
  - module implementation and test branches write to overlapping workspace roots without ABG-visible territory declarations and merge admission
  - analyzer reports only the old serial edge list and cannot show ready-frontier batches or fan-in events
  - branch leases, branch payload admissions, retries, and fan-in are not replay-visible runtime events
  - a custom odd_sdlc parallel runner bypasses ABG's frontier, lease, retry, or event-store law
---

# T-174: Publish SDLC Feature Dependency DAG To ABG Frontier

## STDO Intake

Smallest lawful re-entry point: `requirements`.

Reason: this changes the bridge between SDLC domain topology and ABG execution
topology. The defect is not a local four-lane fixture problem. ABG already proves
that a declared DAG frontier can execute in parallel. The missing SDLC law is the
convention by which odd_sdlc derives a feature/module/test dependency DAG from
its own admitted construction surfaces and publishes that DAG into ABG's frontier
structure.

## Current Finding

Option 1 is proven as ABG substrate behavior. ABG can execute a declared
dependency frontier with bounded parallelism, branch leases, output allocation,
fan-in, and replayable events.

Option 2 is not yet proven as the current SDLC construction path.

The TypeScript line can derive module and test dependency maps, and T-172/T-173
can select parallel traversal from those maps. The missing convention is how
ledger-tracked feature/module/test work becomes:

```text
SDLC.dependency_graph(feature_ledger) -> { start_nodes[], DAG }
ABG.parallel(start_nodes[], DAG)
```

The DAG identifies dependencies among the feature work items being tracked in
the ledger. `start_nodes[]` is the current dependency-free dispatch frontier.
ABG, not odd_sdlc, advances from that frontier.

The current catalog also carries serializing dependencies: it places
`derive_component_code_surface` before `derive_test_design_surface` and
`derive_component_test_surface`, and makes test surfaces consume
`component_code_surface`. That shape prevents the intended parallel branch
family:

```text
Seq(requirements -> uat_testcases -> design -> modules -> module_dependency_map)
  -> Parallel(
       module_implementation_by_dependency_dag,
       test_cases_or_test_materialization
     )
  -> running_tests
```

T-174 must establish the convention that `module_dependency_map` is the authority
for module implementation branch dependencies and steel-thread derivation, while
testcase/test topology is the authority for the parallel test branch family.
Both are dispatch projections over admitted ledger rows.

## Graph Function DAG Convention

Every selected graph function is represented as a DAG, even when the DAG happens
to be a single chain. The existing underlying graph is walked and normalized into
node and dependency declarations. Graph functions must preserve their current
behavior after normalization: a serial chain still runs serially; a graph with
independent ready nodes can expose those nodes to ABG as one dispatch batch.

```text
graph_function
  -> DAG(nodes, dependencies)
  -> edge_traversal_type selects collective ledger inputs
  -> dependency_eval derives ready rows
  -> if graph admits parallel ready rows:
       ABG.parallel(ready_rows, DAG)
     else:
       ABG.parallel([next_ready_row], DAG)
```

The edge traversal type does not decide whether execution is parallel. It
decides the collective input set from the ledger:

```text
min(features) / targeted(features) -> minimal selected_rows
steel_thread(features)             -> dependency-closed selected_rows
full_breadth(features)             -> maximal selected_rows
```

The graph decides whether those selected rows can run together. A ledger may
track ten features while dependency evaluation partitions them as:

```text
dep(1,2,3,4,5)
dep(6,7,8,9)
dep(10)
```

If the graph admits those dependency groups as independent, ABG may run the
current ready rows for each group in parallel. If the graph declares a serial
relation, ABG receives the same DAG but only one row or one dependency group is
ready at a time.

Dependency evaluation comes from admitted SDLC authority, not prompt discretion:

- published graph-function node/edge declarations for the selected graph
- feature/module/test ledger rows and their predecessor refs
- `module_dependency_map` for module implementation dependencies
- test dependency map for test branch dependencies
- write-territory and output-allocation conflict checks before branch leasing
- evaluator policy that selects `min`, `targeted`, `steel_thread`, or
  `full_breadth` rows without dropping deferred residual rows

## Target DAG Shape

The SDLC-derived target shape is:

```text
requirements
  -> uat_testcases
  -> design
  -> modules
  -> module_dependency_map
  -> (
       module_implementation_by_dependency_dag,
       test_case_or_test_materialization_branches
     )
  -> fan-in over source and test artifacts
  -> running_tests
  -> execution evidence / qualification / release
```

Module implementation branches are ordered by `module_dependency_map`. Independent
modules become parallel ABG branches; dependent modules become downstream ABG
branches. The steel thread is derivable from the same map.

Test-case or test-materialization branches may run beside module implementation
when their admitted testcase/test-topology/API authority is sufficient and their
write territories are disjoint. Running tests is not a sibling branch. It waits
for fan-in over source and test artifacts.

## Ledger To Frontier Convention

The feature/module/test ledger is the source of the parallelism array.

```text
parallel_array[] = ledger.rows where unmet_predecessor_refs == []
DAG.nodes = ledger.rows
DAG.edges = ledger row dependency refs
ABG.parallel(parallel_array[], DAG)
```

The ledger rows identify work items. The dependency graph identifies the
ordering relation among those rows. The current dependency-free ledger rows are
the ABG start nodes. odd_sdlc publishes the translation; ABG executes the
frontier.

The traversal labels are collective input-set selectors over the same ledger and
DAG. They are not separate execution models.

```text
min(features) / targeted(features):
  selected_rows = the minimal feature set needed for the scoped outcome or
  repair pressure

steel_thread(features):
  selected_rows = dependency-closed feature set for the selected steel thread

full_breadth(features):
  selected_rows = all admitted feature rows for the edge

for every selector:
  selected_subgraph = DAG restricted to selected_rows plus required dependencies
  parallel_array[] = currently dependency-free rows inside selected_subgraph

edge requirement batch:
  union(row.ownedRequirementRefs for row in parallel_array[])
```

That batch is the pressure passed to the edge traversal. Parallelism comes from
the size and dependency relation of the admitted batch. `min(features)` and
`targeted(features)` are equivalent selectors with different basis pressure:
one starts from the scoped product outcome, the other starts from repair or
failure pressure. Steel thread is `dependent(features)`: it selects a coherent
dependency-closed feature set and can still contain `n` rows. Full breadth is
`max(features)`: it selects the whole admitted feature set. Each selector is
lawful only when deferred ledger rows remain visible as residual pressure
instead of being dropped.

Current TypeScript steel-thread behavior is only a partial precursor to this
model. The older `SdlcFeatureScope` path narrows a worker handoff to included
module names and defers the rest. The newer dependency-map path can name
`steelThreadCandidateNodeIds`. Neither is yet the full T-174 convention until
the selected ledger rows, owned requirement batch, deferred residual rows,
`start_nodes[]`, and ABG frontier declarations are one replay-visible carrier
chain.

```mermaid
sequenceDiagram
    participant Harness as Live Harness
    participant SDLC as odd_sdlc Runtime
    participant Ledger as Feature Ledger
    participant Compiler as SDLC DAG Compiler
    participant ABG as ABG Frontier
    participant FP as F_P Workers
    participant Archive as Runtime Archive
    participant Eval as Evaluators

    Harness->>SDLC: start traversal
    SDLC->>Ledger: admit feature/module/test ledger rows
    SDLC->>Compiler: compile dependency graph from ledger rows
    Compiler->>Ledger: read dependency refs and row status
    Compiler-->>SDLC: publish { start_nodes[], DAG }
    SDLC->>ABG: ABG.parallel(start_nodes[], DAG)

    loop while DAG has incomplete nodes
        ABG->>ABG: select ready rows from DAG predecessors
        ABG->>ABG: lease ready branches under policy
        par ready ledger row branches
            ABG->>FP: dispatch branch transform with row refs
            FP-->>ABG: branch payload and evidence refs
            ABG->>Archive: record lease, payload admission, retry/failure events
        end
        ABG-->>SDLC: replay-visible frontier events
        SDLC->>Ledger: admit completed row projection
        ABG->>ABG: derive next start_nodes[] from completed predecessors
    end

    ABG-->>SDLC: fan-in payload complete
    SDLC->>Eval: run downstream test/execution evaluators
    Eval->>Archive: publish execution evidence, qualification, release refs
```

## Required Design Decisions

1. Define the SDLC dependency DAG carrier.

   The carrier must include node refs, edge names, predecessor refs, successor
   refs, source asset refs, target asset refs, read refs, write-territory refs,
   output-allocation refs, fan-in refs, and edge-accounting refs.

   It must also carry the ledger refs that own the work items and the
   `start_nodes[]` projection derived from dependency-free rows.

2. Reframe the serial executive step list.

   A serial topological order may remain as a read model for CLI display,
   deterministic replay, and older tests. It must not remain the authority that
   selects branch order after an SDLC dependency DAG is admitted.

3. Split the test-build dependency that currently serializes the graph.

   Test design and test materialization must consume admitted testcase,
   test-topology, tenant test-stack, and public API/design authority. They must
   not require completed component source files merely to write test files. Any
   real code-dependent test adaptation belongs after module/test fan-in as a
   qualification or projection node.

4. Compile SDLC dependency DAG nodes into ABG frontier declarations.

   odd_sdlc publishes branch identity, dependency, read/write/output allocation,
   and edge contract refs. ABG owns ready selection, concurrency caps, lease
   ordering, retry isolation, cancellation, and fan-in event merge.

5. Preserve auditability.

   The archive must show how a branch became ready, what lease ABG granted, what
   worker/evaluator produced the payload, how retries were isolated, and how
   fan-in merged payloads into downstream evidence.

## Work Plan

1. Requirements/product: state that odd_sdlc derives feature/module/test
   dependency DAGs from admitted ledger rows and publishes `{ start_nodes[], DAG
   }` to ABG when dependencies expose parallel ready sets.
2. Design: define the full traversal DAG carrier and the ABG frontier compilation
   contract.
3. Graph catalog: walk existing graph functions and normalize each selected graph
   function into a DAG, preserving current behavior for serial chains while
   exposing independent ready nodes where the graph allows them.
4. Traversal collection: make edge traversal type choose the collective ledger
   input rows (`min`, `targeted`, `steel_thread`, `full_breadth`) before
   dependency evaluation derives the current ready rows.
5. Module implementation: compile `module_dependency_map` into ABG branch
   declarations so independent modules run concurrently and dependent modules
   wait for predecessors.
6. Test pipeline: remove the unconditional `component_code_surface` dependency
   from test-design/test-materialization authority, or split the code-dependent
   portion into a downstream fan-in node.
7. Runtime: make installed operator submit all currently ready SDLC DAG branches
   to ABG frontier execution instead of selecting one `nextGraphVectorRef` by
   serial order.
8. Events/archive: persist branch declarations, ABG lease events, worker process
   refs, payload admissions, retry isolation, fan-in projections, and resulting
   edge fulfillment refs.
9. Analyzer: report DAG nodes, frontier batches, parallel branches, fan-in nodes,
   blocked dependencies, write-territory conflicts, and serializing edges.
10. Tests: add deterministic catalog/DAG/frontier-compiler tests and live sandbox
   assertions that reject harness-selected stage order.
11. Live proof: run the four-lane hello-world sandbox as an installed SDLC run
    where odd_sdlc derives two module implementation lanes and two test lanes,
    then ABG chooses the ready batch before fan-in.

## Proof Plan

Static proof:

- `npm run lint:semantic`
- `npm run build:semantic`

Focused proof:

- `npm run test:t174:dag-catalog`
- `npm run test:t174:frontier-compiler`
- `npm run test:t174:parallel-hello-world-sandbox`
- `npm run test:t174:four-lane-frontier-sandbox`

Live proof:

- `npm run test:scenario:t174-four-lane-hello-world-js-live`

Accepted live proof must show:

- the live harness starts traversal only
- the installed operator publishes admitted SDLC-derived `{ start_nodes[], DAG }`
- ABG selects the first ready batch with four branches: two dev branches and two
  test branches
- each branch carries disjoint write-territory refs and output-allocation refs
- four branch worker/evaluator refs are archived before fan-in
- fan-in waits for all four branch payloads
- downstream test execution waits for fan-in
- analyzer output renders the same batches and event refs from archive truth

## Acceptance

- Option 2 is proven in the installed SDLC line: odd_sdlc translates admitted
  feature/module/test ledger rows into `{ start_nodes[], DAG }` and publishes
  that structure to ABG frontier execution.
- `module_dependency_map` governs module implementation branch dependencies and
  steel-thread derivation.
- Module implementation and test build can run as sibling branch families when
  admitted authority and territories allow it.
- Test execution remains a fan-in successor over source and test artifacts.
- No live harness or odd_sdlc-local loop selects each stage or branch order.
- Analyzer and archive output make proportionality, Min(F_P), branch readiness,
  ABG lease selection, and fan-in decisions replay-auditable.
