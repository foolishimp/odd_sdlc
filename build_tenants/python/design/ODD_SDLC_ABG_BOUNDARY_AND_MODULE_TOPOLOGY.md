# odd_sdlc ABG Boundary And Module Topology

**Status**: Current
**Implements**: REQ-F-GFUNC-001, REQ-F-GFUNC-002, REQ-F-RUNTIME-001, REQ-F-RUNTIME-002, REQ-F-ODDSDLC-017, REQ-F-ODDSDLC-021, REQ-F-ODDSDLC-038, REQ-F-ODDSDLC-039
**Derives From**: `specification_methodology/specification/standards/ODD_METHOD.md`, `build_tenants/common/design/adrs/ADR-002-graph-function-first-carrier-and-runtime-boundary.md`, `build_tenants/python/design/adrs/ADR-002-abg-continuation-authority-and-cooperative-operational-dispatch.md`, `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`, `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`

## Position

`odd_sdlc` is the surrounding domain scaffold.

ABG is the traversal engine.

GTL is the graph-function program language.

The governing shape is:

```text
SDLC(
  ABG(
    Iterate(
      SDLC.Graph,
      ioc(SDLC.traversal.F_P),
      ioc(SDLC.eval.F_D),
      ioc(SDLC.eval.F_P),
      ioc(SDLC.governance.F_H)
    )
  )
)
```

The shorter form is:

```text
SDLC(ABG(Iterate(SDLC.Graph, ioc(SDLC hooks))))
```

That means:

- SDLC publishes the domain graph, assets, target catalog, policies, prompts,
  evaluators, and projections
- ABG owns iteration, continuation, re-entry, event truth, frame truth, lineage,
  and provenance
- GTL owns graph-function algebra and graph declaration shape
- SDLC-owned IoC hooks perform domain traversal, domain evaluation, and
  governance escalation at declared boundaries only
- the worker owns hidden internal constructive HOW inside one bounded F_P turn

`odd_sdlc` must not become a second runtime around ABG.

## Boundary Law

The lawful call direction is:

```text
operator or client
  -> odd_sdlc scaffold
  -> ABG traversal
  -> GTL graph function
  -> SDLC IoC hook for one bounded vector
  -> ABG event, continuation, and provenance truth
  -> SDLC projection/query over admitted truth
```

The unlawful call direction is:

```text
odd_sdlc controller
  -> inspect local state
  -> execute step
  -> infer next step
  -> execute next step
  -> summarize as if ABG owned the run
```

That second shape is a product-local shadow runtime. It is not the target
architecture.

## Runtime Ownership

ABG owns:

- run lifecycle
- graph-call lifecycle
- vector traversal state
- continuation and re-entry after publish boundaries
- frame, event, lineage, and provenance truth
- raw fulfillment and assessment events
- stop, hold, gap, yield, and completion state as runtime facts

`odd_sdlc` owns:

- software-domain asset semantics
- graph-function publication for this domain
- start-target admission and target meaning
- execution-contract source truth for one bounded dispatch
- domain prompt context and work-report contracts
- domain F_P and F_D hook declarations
- gap, triage, requirement-closure, traceability, and operator projections
- domain interpretation of ABG facts

GTL owns:

- graph function declarations
- graph function composition
- graph function recursion
- vector materialization from a graph function
- function and contract references consumed by ABG

## Iteration Contract

ABG iteration is the only runtime continuation loop.

One iteration step:

1. reads the current ABG continuation state
2. selects the next admissible GTL vector from `SDLC.Graph`
3. invokes the declared SDLC hook for that vector
4. records substrate events and lineage
5. publishes or updates the target asset checkpoint
6. evaluates stop, hold, gap, yield, or completion state
7. returns to ABG continuation authority

An SDLC hook may do bounded domain work inside that step. It may not own the next
step.

## IoC Hooks

SDLC IoC hooks are the only domain-specific work bodies ABG should invoke.

Current hook classes:

- `SDLC.traversal.F_P`
  Probabilistic constructive traversal over one declared vector. It updates the
  governed target asset and emits a work report.

- `SDLC.eval.F_D`
  Deterministic evaluation over identity, binding, provenance, evidence,
  traceability, report shape, and capability-specific proof.

- `SDLC.eval.F_P`
  Probabilistic semantic evaluation where deterministic proof is insufficient.
  It may classify gaps, assess semantic convergence, or propose lawful re-entry.

- `SDLC.governance.F_H`
  Human/governance escalation for approval, ambiguity, repricing, or policy
  gates.

The hook contract constrains the external traversal space. It does not expose or
control the worker's hidden reasoning path.

## Module Groups

### Graph Publication

These modules define the SDLC graph and its public program surfaces. They are
domain publication, not runtime continuation.

- `gtl_module.py`
  Publishes the live GTL module, graph functions, jobs, executive carriers,
  library graph functions, and operational graph-function availability.

- `function_catalog.py`
  Publishes domain function identity and backing graph-function relationships.

- `software_domain_catalog.py`
  Publishes software-domain edges, lifecycle acts, and per-edge traversal
  contracts.

- `program_catalog.py`
  Projects executable program handles from the graph-function set.

### Scaffold And Admission

These modules prepare one lawful call into ABG. They should stay thin.

- `app.py`
  Bootstraps the workspace, binds the active SDLC module, and exposes catalog,
  start, gaps, and query operations.

- `__main__.py`
  CLI adapter. It parses operator commands and delegates to the app layer.

- `public_start.py`
  Normalizes `scope`, `target`, and `until`; resolves one admitted start
  boundary; prepares one ABG-facing start result.

- `public_start_contract.py`
  Defines the public start payload and stop-state contract.

- `public_start_subcarriers.py`
  Normalizes subcarrier payloads used by start admission.

- `start_targeting.py`
  Resolves `next`, `graph_function:<handle>`, and `asset:<handle>` through
  published SDLC target surfaces.

- `execution_contract.py`
  Defines the admitted execution-contract surface for one bounded dispatch.

- `worker_attachment.py`
  Defines readiness and transport attachment at the F_P handoff boundary.

### ABG Integration

These modules translate between SDLC domain truth and ABG runtime truth. They
must not replace ABG runtime truth.

- `runtime_contract.py`
  Publishes installed runtime contract constants and shape.

- `runtime_event_contract.py`
  Validates and projects ABG-admitted runtime event payloads for SDLC use.

- `runtime_contexts.py`
  Publishes SDLC domain context into ABG prompt/manifest context shape.

- `runtime_effects.py`
  Emits SDLC-attributed runtime effects through ABG-compatible event shape.

- `continuation.py`
  Admits returned results into the ABG continuation path.

- `operational_dispatch.py`
  Executes at most one tenant-owned operational advance and returns control to
  ABG.

### Domain IoC Work And Evaluation

These modules contain SDLC-owned hook behavior. They operate inside ABG-selected
vector boundaries.

- `constructor.py`
  Materializes or repairs target domain assets for one constructive edge and
  assembles work-report/proof surfaces around that asset work.

- `fd_checks.py`
  Runs deterministic checks over binding, provenance, capability, marker,
  evidence, and convergence truth.

- `fd_contracts.py`
  Defines deterministic proof contract payloads.

- `test_lane_evidence.py`
  Admits governed test-source and test-run evidence.

- `repair_frontier.py`
  Defines the deterministic repair frontier consumed by F_P prompt contexts.

- `traceability.py`, `traceability_index.py`, `traceability_report.py`
  Publish requirement/design/code/test traceability projections and proof
  reports.

- `requirement_closure.py`
  Maintains requirement-closure truth as a governed SDLC projection.

### Domain Projection And Re-Entry

These modules read ABG truth plus SDLC-admitted truth and publish current domain
state.

- `query.py`
  Publishes the current domain query surface.

- `query_contract.py`
  Defines query payload version and shape.

- `analysis.py`
  Refreshes workspace analysis and gap input truth.

- `gap_dossier.py`
  Produces the operator-facing dossier for one current edge.

- `span_analysis.py`
  Computes bounded graph-span gap projections.

- `triage.py`
  Classifies gap pressure and proposes lawful route/re-entry state.

- `homeostatic_loop.py`
  Carries observation, proposal, application, derivation reopening, and gap
  retirement semantics.

- `observer.py`
  Publishes domain-facing observation state over runtime and sandbox evidence.

### Workspace Admission And Domain Model

These modules prepare workspaces and domain surfaces before ABG traversal.

- `normalization.py`
  Normalizes imported workspaces into the current SDLC governance shape without
  changing project identity.

- `project_profile.py`
  Admits project constraints and capability truth into a typed project profile.

- `install_topology.py`
  Defines installed product and workspace topology constants.

- `release/install.py`
  Installs the SDLC product into a target workspace.

- `workspace_assets.py`
  Locates and publishes workspace asset paths.

- `asset_types.py`
  Defines domain asset types and semantic asset roles.

- `domain_model.py`
  Defines asset, binding, collection, function, and work-act domain structures.

- `publication_io.py`
  Provides small file publication helpers for governed surfaces.

## Compression Rule

When the framework feels too large, use this compression test:

1. If a module publishes graph, asset, or target law, it belongs to SDLC.
2. If a module decides continuation, it belongs to ABG.
3. If a module describes graph-function structure, it belongs to GTL.
4. If a module performs domain work for one vector, it is an SDLC IoC hook.
5. If a module summarizes current state, it is a projection over ABG truth plus
   SDLC-admitted truth.

Any module that both owns continuation and performs domain work should be
refactored until one side is removed.

Any module that reconstructs target truth without reading the published target
catalog, asset ownership index, execution contract, or ABG facts is suspect.

Any helper that exists only to hide ABG from SDLC should be deleted or collapsed
into a thin adapter.

## Review Questions

Use these questions for future cleanup:

1. Does this code publish SDLC graph/domain truth?
2. Does this code call ABG once and return?
3. Does this code implement one declared IoC hook?
4. Does this code project current state from admitted truth?
5. Does this code secretly decide the next traversal step?

Only the first four are lawful `odd_sdlc` responsibilities. The fifth belongs
to ABG and should not live in SDLC code.
