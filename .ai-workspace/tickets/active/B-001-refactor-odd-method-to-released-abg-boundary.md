# B-001 Refactor odd_method To Released ABG Boundary

- id: B-001
- title: Refactor odd_method to the released ABG runtime boundary
- type: bug
- status: active
- goal: ambiguity-governance-and-traceability
- priority: critical
- created_at: 2026-04-11
- updated_at: 2026-04-11

## Triage

- intake: bug / regression / release blocker / downstream interface cut
- parent_ticket: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/B-001-reprice-abg-provenance-runtime-boundary-wave.md`
- lawful_change_class: design_reframe
- affected_boundary: odd_sdlc install composition, runtime assumptions, graph/test branch behavior, and downstream qualification surfaces
- lawful_re_entry: odd_method design and realization surfaces for install, runtime composition, graph functions, test branch contracts, and qualification proof
- downstream_proof_span: full odd_method suite plus fresh installed `data_mapper.test27`

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

- the released ABG boundary is now at commit `9bcc8f2`
- ABG automated tests are green at `258 passed, 5 deselected`
- `odd_method` has been refreshed from that released boundary through installer composition

Downstream:

- the downstream refactor to the released ABG boundary is implemented in source
- the full `odd_method` suite is green against the installed ABG RC
- fresh downstream proof has not yet been run on `data_mapper.test27`

## Task List

- [x] Release the current `abiogenesis` RC wave and treat that cut as the only valid upstream dependency surface.
- [x] Refresh `odd_method` runtime state only through `odd_method`'s installer path consuming the released ABG RC.
- [x] Reconcile `odd_method` install composition with the ABG provenance-ready runtime contract.
- [x] Refactor `odd_sdlc` source and qualification lanes so they no longer rely on pre-cut ABG runtime assumptions.
- [x] Reconcile graph/test expectations with the current explicit test branch shape, including the installed runtime behavior that follows from the ABG cut.
- [x] Run the full `odd_method` automated suite against the installed ABG RC and close resulting failures.
- [ ] Update `odd_method` RC notes and release note for the downstream refactor wave.
- [ ] Commit the `odd_method` RC wave.
- [ ] Create fresh `data_mapper.test27` from template.
- [ ] Install the released `odd_method` RC into `data_mapper.test27`.
- [ ] Run the full proving traversal in `data_mapper.test27`.
- [ ] Compare `test27` against `test26` and record which remaining gaps are domain-truth gaps rather than substrate/runtime drift.

## Acceptance

- `odd_method` consumes only the released ABG RC through install composition
- no downstream proof depends on source-vendored `.genesis`
- full `odd_method` suite is green against the installed ABG RC
- `odd_method` RC notes/release note record the downstream refactor and active remaining truth gaps accurately
- fresh `data_mapper.test27` proves the downstream wave from installed runtime truth

## Links

- parent: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/B-001-reprice-abg-provenance-runtime-boundary-wave.md`
- goal: `/Users/jim/src/apps/odd_method/specification/GOALS.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
