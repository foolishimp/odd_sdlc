---
id: T-185
title: Agent-internal subworkstreams for compute-stage acceleration
type: feature
ticket_category: ordinary
status: backlog
goal: accelerate-heavy-fp-compute-without-replacing-abg-runtime-authority
build_tenant: typescript
owner: odd_sdlc
change_intent: Define and implement a Phase 1 compute-stage pattern where a parent `transform.C` or read-only `evaluate.C` worker may use agent-internal subagents over admitted work-plan and module-dependency inputs, while ABG-visible admission, event, ledger, consequence, and traversal authority remain unchanged.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-28
created_at: 2026-05-28
updated_at: 2026-05-30
governance_scope: STDO Method
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/15-odd-sdlc-scheduling-phase.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md
  - build_tenants/typescript/code/src/graph/catalog.ts
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/tests/test_t141_saga_frontier.test.mjs
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/tests/test_t141_saga_frontier_async.test.mjs
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/completed/T-172-realize-staged-disambiguation-graph-and-decomposition-admission.md
  - .ai-workspace/tickets/completed/T-173-compile-feature-dependency-dag-for-scheduling.md
  - .ai-workspace/tickets/completed/T-174-publish-live-fp-parallel-materialization-frontier.md
depends_on:
  - T-184
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SCHEDULING_PHASE.md
  - build_tenants/typescript/code/src/operator/plugins/transform/
  - build_tenants/typescript/code/src/operator/plugins/evaluate/
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/stage_carriers.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
excluded_boundary:
  - ABG-native distributed frontier execution
  - ABG event identity, event order, branch lease, fan-in, projection, replay, fold, or traversal-transition ownership
  - product-local shadow scheduling after ABG dispatch
  - direct subagent writes to ledgers, runtime events, closure decisions, or consequence projections
  - workspace writes from `evaluate.C` or any non-transform `F_P` stage
  - prompt-only behavior with no typed subworkstream manifest or proof surface
target_truth: Heavy `F_P.transform` and read-only `evaluate.C/F_P` stages may ask the active agentic coder to decompose admitted design/module/test dependency pressure into agent-internal subworkstreams. Those subworkstreams are local compute strategy only. The parent `.C` invocation owns merge, conflict reporting, typed return, and all interaction with the installed operator admission boundary. The returned subworkstream manifest is shaped so the same rows can later promote into ABG saga-frontier branch declarations when ABG moves to cloud-native distributed execution.
superseded_truth: Large SDLC construction and evaluation prompts remain monolithic, or use hidden subagents whose intermediate decisions, dependency basis, file effects, unresolved gaps, and merge decisions are not visible to the parent plugin result.
closure_law: This ticket closes only when the TypeScript tenant has a designed and tested Phase 1 subworkstream contract for parent-agent-managed subagents inside `.C`, proves that the resulting plugin output still passes through the normal transform/evaluate/admission/consequence lifecycle, and records the explicit non-claim that this is not ABG-native distributed traversal.
evaluation_criteria:
  - parent `.C` prompts grant the agentic coder permission to use any of its capabilities (subagents, parallel workstreams) as bounded compute strategy inside the current edge permission class, publish the observable WHAT (authority refs, admitted dependency pressure, acceptance criteria), and never prescribe how the worker decomposes
  - subworkstreams are derived from admitted work-plan, module dependency graph, schedule tranche, or target-carrier inputs rather than invented from source-tree shape alone
  - the parent plugin result includes a typed subworkstream manifest with stable refs, target module/interface refs, dependency refs, input evidence refs, output allocation refs, changed/proposed files, status, gaps, and merge/fan-in result
  - `transform.C` remains the only `F_P` stage that may edit workspace files, and only within the active edge permission class
  - `evaluate.C/F_P` may parallelize review internally but remains read-only over workspace state and returns findings/pressure rows through the typed carrier interface
  - subagent work cannot emit ABG events, write ledgers, close an edge, select traversal, or publish consequence projections
  - interrupted or failed parent `.C` runs leave enough parent-owned process/checkpoint evidence to explain whether subworkstream work was not started, partial, merged, blocked, or discarded
  - the implementation keeps ABG-native saga-frontier execution as Phase 2 and does not implement a product-local scheduler for admitted branch families
proof_surface:
  - design update defining Phase 1 `.C` subworkstream manifest and parent-agent merge law, positioning the manifest as an observation/provenance carrier over the worker turn (not a framework-authored plan), with its declared Irreducible Architectural Carrier Set and a module-bounded structural carrier diagram (DESIGN_MODULE §5A/§5E)
  - ODD §11.5B execution-authority audit (code/call-graph review) proving exactly one execution authority for the traversal (ABG): subagent spawn and supervision stay worker-internal, and odd_sdlc plugin code does not supervise subagent processes outside the ABG actor seam
  - deterministic test that the transform prompt/context grants capability permission and publishes admitted dependency-map pressure for decomposable heavy edges, without prescribing a decomposition method
  - deterministic test that evaluate prompt/context permits read-only subworkstream review but forbids workspace writes and system-authority writes
  - deterministic test that a returned subworkstream manifest is admitted only as part of the parent plugin result, not as independent closure truth
  - deterministic test that subworkstream rows carry Phase 2-compatible predecessor, read, write-territory, output-allocation, idempotency, and fan-in fields where available
  - live or sandbox data-mapper run showing heavy design/code construction uses subworkstream evidence without bypassing the normal GTL edge lifecycle
non_closure_conditions:
  - subagents are invoked by prompt convention without a typed returned manifest
  - subagents directly mutate ledgers, runtime events, edge closure decisions, consequence projections, or traversal transitions
  - `evaluate.C/F_P` writes workspace files or product targets
  - SDLC implements its own runtime-ready queue, lease model, or replay truth instead of ABG saga-frontier semantics
  - module dependency maps are ignored and workstreams are split only by filenames, directories, or arbitrary token-size chunks
  - successful subagent output is treated as edge closure without parent merge, system admission, selected evaluate.C, consequence.C, and ABG traversal transition
  - Phase 1 is presented as proof of cloud-native distributed ABG execution
---

# T-185: Agent-Internal Subworkstreams For Compute-Stage Acceleration

## STDO Triage

First missing layer: design.

The product already has the dependency-pressure surfaces needed to split large
realization work:

```text
requirements
  -> design surfaces
  -> implementation work-plan rows
  -> module dependency graph
  -> dependency-ordered tranches
  -> component/code/test materialization pressure
```

ABG also has substrate proof for dependency-frontier execution. That is the
right Phase 2 model for cloud-native distributed ABG execution.

This ticket owns the nearer Phase 1 path: use the active agentic coder's own
subagent or workstream capability inside one selected `.C` invocation, while
keeping ABG-visible runtime authority exactly where it is.

It sequences behind T-184: it edits `installed_operator.ts` and the
`plugins/transform` / `plugins/evaluate` surfaces T-184 is partitioning, and its
data-mapper-live proof inherits T-184's open compute-stage boundary.

## Design Claim

Subagents inside `.C` are compute strategy, not system authority.

This ticket acknowledges the exponential, fast-moving capability of agentic
coders. The framework does not chase that capability and does not prescribe how
work is done. The space between the admitted input invariant and the produced
output is a black box; it becomes truth only when `evaluate.C` and system
admission judge it. The framework is the WHAT, the observer, and the gatekeeper
at that evaluation/admission boundary: it governs the contract, the published
authority, and the gate, but it does not own the worker's internal solution
path (ODD_METHOD §5). The prompt therefore grants the agentic coder permission
to maximize delivery through all its capabilities and publishes the observable
WHAT; it does not narrate the HOW.

The lawful Phase 1 lifecycle is:

```text
GTL edge
  -> SDLC EdgePolicy
  -> ABG selected composition
  -> plugin.transform.C
       -> parent agent reads admitted dependency pressure
       -> parent agent derives local subworkstreams
       -> parent agent may use subagents inside the same compute boundary
       -> parent agent merges outputs into one transform result
  -> system admission/write
  -> plugin.evaluate.C
       -> parent evaluator may split read-only review by module/interface
       -> parent evaluator returns one evaluation result
  -> system admission/write
  -> plugin.consequence.C
  -> traversal transition
```

The parent `.C` invocation is the only boundary the installed operator admits.
Subagents do not get a separate ABG identity, lease, event stream, ledger
writer, closure authority, or traversal transition.

## Phase 1 Workstream Manifest

This manifest is observation and provenance of the worker turn — the
gatekeeper's record of what the agent reported it did — not a plan the worker
must follow. The framework declares the shape it wants to observe; the worker
owns how it actually decomposed and executed. Because it is observation over an
already-authorized traversal, it stays within existing evidence and provenance
law and introduces no second planning, scheduling, or closure authority. Its
predecessor, read, write-territory, output-allocation, idempotency, and fan-in
fields reuse the admitted dependency-DAG vocabulary (T-173/T-174) so a row can
promote to an ABG saga-frontier branch declaration later; reconcile this shape
against that admitted carrier rather than forking a third one.

The parent plugin result should be able to return:

```text
subworkstreams:
  - workstreamRef
  - stageRef
  - selectedEdgeRef
  - targetCarrierRef
  - targetModuleRef or targetInterfaceRef
  - predecessorWorkstreamRefs
  - dependencyInputRefs
  - authorityInputRefs
  - evidenceRefs
  - readRefs
  - writeTerritoryRefs
  - outputAllocationRefs
  - idempotencyKey
  - fanInScopeRef
  - changedFileRefs or proposedFileRefs
  - status: not_started | running | done | blocked | failed | discarded
  - blockingReasonRefs
  - residualGapRefs
  - mergeDisposition
mergeResult:
  - mergedOutputRefs
  - conflictRefs
  - discardedOutputRefs
  - carryForwardGapRefs
  - parentResultRef
```

When fields such as `writeTerritoryRefs`, `outputAllocationRefs`, or
`fanInScopeRef` are not yet known, the parent should mark them missing rather
than infer runtime authority. This keeps the row useful now and promotable to
ABG saga-frontier declarations later.

## Authority Boundary

This ticket must preserve the current construction algebra:

```text
transform.C output
  -> system admission/write
  -> evaluate.C/F_P result
  -> system admission/write
  -> consequence.C projection
  -> ABG traversal transition
```

Allowed:

- parent `F_P.transform` worker uses subagents to build independent module,
  interface, test, or repair packets inside the active edge permission class
- parent `evaluate.C/F_P` worker uses subagents to perform read-only review
  over independent modules, obligation slices, or evidence packets
- parent worker records partial subworkstream state in a non-authoritative
  process/checkpoint surface for debugging and crash analysis
- parent result returns a manifest that explains how subworkstreams were split,
  completed, merged, blocked, or discarded

Not allowed:

- subagents emit ABG runtime events
- subagents write fulfillment ledgers or closure decisions
- subagents publish consequence projections
- subagents select next traversal
- evaluator subagents write workspace targets
- the operator treats subworkstream success as closure without normal admission,
  evaluation, consequence, and traversal transition

## Phase 2 Boundary

Phase 2 is ABG-native distributed frontier execution.

That belongs to the cloud-native ABG line, where each workstream can become an
ABG-visible branch with declared predecessors, read refs, write territory,
output allocation, idempotency, leases, payload admission, fan-in events, retry
isolation, and replay truth.

Phase 1 must not fake that. It should only produce rows that make later
promotion straightforward.

## Candidate Implementation Steps

1. Define the TypeScript subworkstream manifest type and admission role.
2. Extend transform prompt/context construction for decomposable heavy edges to
   grant the worker permission to use subagents or parallel workstreams and to
   publish the admitted dependency-map and work-plan pressure as observable
   WHAT, without prescribing how the worker decomposes.
3. Extend evaluate prompt/context construction to allow read-only parallel
   module/interface review with one parent result.
4. Persist parent-owned process/checkpoint evidence early enough to diagnose
   interrupted subworkstream runs.
5. Admit the subworkstream manifest only as part of the parent typed stage
   result.
6. Add deterministic tests for manifest shape, prompt boundary, write
   prohibition outside `F_P.transform`, and Phase 2-compatible declaration
   fields.
7. Use a watched data-mapper sandbox/live run as the first high-scale
   exploratory proof.

## Product Fit

This work aligns with the product mandate because it uses the graph-owned
sequence to reduce ambiguity:

```text
What
  -> how to test What
  -> How / design
  -> module dependency map
  -> bounded implementation packets
  -> evidence and residual pressure
```

The point is acceleration without losing visibility. The framework still gets
one lawful edge lifecycle, while the agent can spend less wall-clock time on
large designs by doing independent compute internally.