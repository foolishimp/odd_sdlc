# B-001 Refactor odd_method To Released ABG Boundary

- id: B-001
- title: Refactor odd_method to the released ABG runtime boundary
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: critical
- created_at: 2026-04-11
- updated_at: 2026-04-13

## Triage

- intake: bug / regression / release blocker / downstream interface cut
- parent_ticket: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/B-001-reprice-abg-provenance-runtime-boundary-wave.md`
- lawful_change_class: design_reframe
- affected_boundary: odd_sdlc install composition, runtime assumptions, graph/test branch behavior, and downstream qualification surfaces
- lawful_re_entry: odd_method design and realization surfaces for install, runtime composition, graph functions, test branch contracts, and qualification proof
- downstream_proof_span: full odd_method suite plus fresh installed proving from the literal `data_mapper.template` corpus, including reset-driven rerun behavior

## Why This Ticket Exists

`abiogenesis` owns the upstream interface cut.

`odd_method` is a separate project and therefore needs its own ticket for the
downstream refactor. The work here is not "make old assumptions still work."
The work is to consume the released ABG RC through `odd_method`'s installer
path and refactor `odd_method` until its runtime, graph, tests, and proof lanes
conform to the new boundary.

This is not a local `realization_refactor`.

The downstream wave changes the installed runtime/design boundary for
`odd_method` by:

- consuming released ABG provenance/runtime semantics through install
- removing reliance on source-synced `.genesis`
- updating graph/test expectations to the current explicit test branch shape
- reproving the active `data_mapper` regression corpus from installed runtime
  truth

Intent and product direction remain stable. The downstream realization
structure changes. Under `SPEC_METHOD.md`, that makes this wave a
`design_reframe`.

## Runtime Boundary Rule

For `odd_method`, `.genesis` is refreshed only by installer execution.

That means:

- root `.genesis` is not a release surface
- root `.genesis` is not a manual patch or mirror target
- downstream tests and proof lanes must run from sandbox/install truth
- ABG propagation is accepted only through released dependency install, not
  source copying

## Current State

Upstream:

- the released ABG boundary is now at commit `af78f94`
- ABG automated tests are green at `259 passed, 5 deselected`
- `odd_method` has been refreshed from that released boundary through installer composition

Downstream:

- the downstream refactor to the released ABG boundary is implemented in source
- the installed `data_mapper` proof lane now accepts `graph_call_failed` with
  `certification_failure` when an unresolved deterministic gap remains after
  constructive continuation
- the full `odd_method` suite was green against the installed ABG RC at the
  original boundary cut, and the current follow-on topology/evidence/iterator
  wave is being revalidated through targeted internal regressions before the
  next downstream proving run
- the downstream RC commit is `ffd0118`
- `data_mapper.test28` established the current downstream proving baseline and
  exposed the next topology/prompt/evidence debts

## Active Decomposition

The remaining downstream wave is now decomposed into these child tickets:

- `T-003`: spec-method structured-build topology and installed/runtime
  separation
- `T-002`: stateful-iterator builder framing inside the domain
- `B-002`: repair-usable deterministic evaluator evidence
- `B-003`: restore the builder-product/source-repo boundary in project-tenant
  resolution
- `T-004`: homeostatic gap triage and intent-renewal capstone after the
  current runtime/topology/control-frame wave

This parent ticket should remain active until those cuts are integrated and a
fresh downstream proving lane confirms the post-cut runtime behavior.

## Task List

- [x] Release the current `abiogenesis` RC wave and treat that cut as the only valid upstream dependency surface.
- [x] Refresh `odd_method` runtime state only through `odd_method`'s installer path consuming the released ABG RC.
- [x] Reconcile `odd_method` install composition with the ABG provenance-ready runtime contract.
- [x] Refactor `odd_sdlc` source and qualification lanes so they no longer rely on pre-cut ABG runtime assumptions.
- [x] Reconcile graph/test expectations with the current explicit test branch shape, including the installed runtime behavior that follows from the ABG cut.
- [x] Run the full `odd_method` automated suite against the installed ABG RC and close resulting failures.
- [x] Update `odd_method` RC notes and release note for the downstream refactor wave.
- [x] Commit the `odd_method` RC wave.
- [x] Establish a fresh downstream proving baseline from the literal `data_mapper.template` corpus.
- [x] Complete `T-003` so downstream workspaces conform to spec-method structured-build topology.
- [x] Complete `T-002` so builder control is stateful and reference-first rather than pure-function-shaped.
- [x] Complete `B-002` so deterministic failures emit repair-usable evidence.
- [x] Complete `B-003` so builder product source tenants no longer participate in project-tenant resolution.
- [x] Re-run fresh downstream proving on the post-cut workspace shape.
- [x] Compare the post-cut proving run against `test28` and earlier baselines and record which remaining gaps are domain-truth gaps rather than substrate/runtime drift.

## Acceptance

- `odd_method` consumes only the released ABG RC through install composition
- no downstream proof depends on source-vendored `.genesis`
- full `odd_method` suite is green against the installed ABG RC
- `odd_method` RC notes/release note record the downstream refactor and active remaining truth gaps accurately
- fresh downstream proof from the literal `data_mapper.template` corpus proves
  the downstream wave from installed runtime truth after the active child
  tickets land

## Closure Rationale

This boundary wave is complete.

Fresh downstream proving on `data_mapper.test29` and `data_mapper.test30`
confirms that the remaining live failures are no longer ABG boundary drift.
They are now domain-local SDLC behavior and gap-routing concerns inside
`odd_sdlc`, which are owned by `T-004`.

## Links

- parent: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/B-001-reprice-abg-provenance-runtime-boundary-wave.md`
- child: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/T-003-enforce-spec-method-structured-build-topology-for-project-tenants.md`
- child: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/T-002-refactor-odd-sdlc-from-pure-function-builder-framing-to-stateful-iterator.md`
- child: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/B-002-emit-repair-usable-fd-evidence-from-odd-sdlc-evaluators.md`
- child: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/B-003-keep-builder-product-source-tenants-out-of-project-tenant-resolution.md`
- child: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/T-004-restore-homeostatic-gap-triage-and-intent-renewal.md`
- goal: `/Users/jim/src/apps/odd_method/specification/GOALS.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
