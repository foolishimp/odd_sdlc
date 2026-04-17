# B-012 Restore emit() Boundary In Domain Modules

- id: B-012
- title: Domain modules call ABG `emit()` directly, breaking the GTL/ABG write-path boundary
- type: bug
- status: completed
- goal: gtl-abg-boundary-integrity
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-18
- dependencies:

## Triage

- intake: external review of odd_sdlc against `SPEC_METHOD.md` and `ODD_METHOD.md`
- lawful_change_class: realization_refactor
- affected_boundary: domain modules (`triage`, `constructor`) vs. ABG runtime write-path
- lawful_re_entry: realization layer; no requirement reprice required because the
  GTL/ABG boundary rule is already constitutional under the installed bootloader
- downstream_proof_span: ABG event-stream provenance, projection determinism,
  homeostatic loop closure (which depends on a clean emit lane)
- triaged_at: 2026-04-17

## Why This Ticket Exists

The installed GTL/ABG bootloader (CLAUDE.md §7.2) declares:

> `emit()` is the only lawful write path into runtime truth.

By construction, `emit()` belongs to the ABG runtime. Domain modules under
`odd_sdlc` (governance over the project) should declare graph functions and
operators; they should not directly mint runtime events.

Review found `emit()` called from domain modules:

- `odd_sdlc/triage.py:15` (import) and write sites at `:1063`, `:1078`,
  `:1112`, `:1143`, `:1175`
- `odd_sdlc/constructor.py:14` (import) and write site at `:2181`

Each direct call is a domain-side bypass of the runtime's sole authoritative
write path. It conflates governance authorship with runtime materialization,
and it sidesteps ABG's selection / convergence / projection contract.

## Intended Direction

Make ABG the only writer to the event stream. Domain modules should produce
declarative `Operator`/`Evaluator` outputs (or graph-function results) that the
runtime then translates into events via the runtime's own `emit()` call.

Concretely:

- introduce a domain-side seam (e.g. an operator return contract or a
  `RuntimeEffect` value) that domain modules return instead of emitting
- move the actual `emit()` invocations into the ABG-side dispatcher that
  invokes those operators
- keep domain code free of any direct import of the runtime emit module

Where an existing call site is genuinely ABG runtime control flow that has
been mis-shelved under a domain module name, relocate the file (or the
function) into the runtime layer rather than rewriting the call.

## Task List

- [ ] Inventory the 6 emit call sites and classify each as
  (a) misplaced runtime control vs.
  (b) genuine domain logic that needs an effect-return seam.
- [ ] Define the domain → runtime effect-return contract.
- [ ] Replace direct `emit()` calls in `triage.py` with effect returns;
  the corresponding runtime dispatcher emits.
- [ ] Replace the direct `emit()` call in `constructor.py` the same way.
- [ ] Remove the `emit` import from both domain modules.
- [ ] Add a static check (grep-level or import-graph) that fails CI if any
  file under the odd_sdlc domain layer imports the runtime emit symbol.
- [ ] Re-run the existing test surface and confirm no event-stream regression.

## Acceptance

- no domain-layer module under `odd_sdlc/` imports or calls ABG `emit()`
- all runtime events are produced by ABG-owned dispatch over operator/evaluator
  return values
- the static check guarding the boundary is in place and green
- existing convergence and projection behavior is preserved (no event-shape
  drift)

## Links

- review source: external code review of `/Users/jim/src/apps/odd_sdlc`
  against installed GTL/ABG bootloader and `SPEC_METHOD.md`
- bootloader rule: `CLAUDE.md` §7 Runtime Truth Rules, item 2
- requirement family: GTL/ABG boundary axioms (bootloader §4)
