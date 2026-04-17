# T-009 Close Homeostatic Loop With Explicit Application And Renewed Derivation

- id: T-009
- title: Add explicit constitutional application event, renewed forward derivation, and loopback retirement
- type: feature
- status: completed
- goal: homeostatic-loop-closure
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-18
- dependencies:

## Triage

- intake: external review of odd_sdlc against `SPEC_METHOD.md` and
  `ODD_METHOD.md`; refined twice — first against a user proposal to make
  tickets the loop carrier, then narrowed back per codex review which
  flagged that as overreach against `TICKET_METHOD.md` and the existing
  requirement family
- lawful_change_class: requirement_reprice
  (the homeostatic loop family `REQ-F-ODDSDLC-033..037` is repriced against
  current realization; downstream design + realization follow at their own
  re-entry points)
- affected_boundary: requirement family `REQ-F-ODDSDLC-033..037` and the
  proposal-application + derivation-reopen seam at the realization layer
- lawful_re_entry: requirement closure register, then design and
  realization for the application event, the renewed-derivation contract,
  and the loopback evaluator
- downstream_proof_span: a single replayable trace showing
  `proposal_applied → derivation_reopened → gap_retired` (or, on failure,
  a new `gap_event` with provenance back to the failed attempt)
- triaged_at: 2026-04-17

## Why This Ticket Exists

Step 5 of the homeostatic loop — *apply the proposal as constitutional
truth and re-derive forward* — is open. Steps 1–4 are present in the
current realization:

- observation (ambiguity register)
- triage (`triage.py`)
- route, including constitutional proposal authoring and operator
  resolution along defer/approve lanes (verified by
  `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py:889,981`)

What is missing is narrow:

1. an explicit `proposal_applied` event that updates the constitutional
   surface — distinct from "proposal authored"
2. a renewed forward derivation that provably reads the *updated* surface,
   not the pre-application one
3. a loopback evaluator that compares post-derivation state against the
   originating `gap_event` and either retires it or surfaces a new
   `gap_event` carrying provenance back to the failed attempt

These three together close the loop. Nothing else in the loop needs to
change.

## Rejected Framings

Two earlier framings were considered and rejected. Recorded here so they
do not reappear:

- **"events → intent vectors → processed."** Ephemeral. Intent vectors
  have no addressable identity across runs and cannot be inspected,
  audited, deduped, or escalated to a human reviewer between runs.

- **"tickets as the load-bearing artifact at every stage of the loop."**
  Overloads the ticket layer into a second homeostatic truth model that
  competes with both the constitutional surface and the existing
  requirement family `REQ-F-ODDSDLC-033..037` (declared homeostatic
  carriers: observation, triage, route, constitutional repricing, current
  query surfaces). `TICKET_METHOD.md` positions tickets as durable *work
  tracking complementary to deeper constitutional surfaces*, not as the
  primary stage carrier of governance/runtime truth. The constitutional
  surface (requirements + design files), updated by lawful proposal
  application, is already the durable artifact the loop writes. Tickets
  capture work *over* that surface, not *as* it.

The remaining useful piece of the second framing — that derived
constructive work surfaces as a normal `B-NNN` / `T-NNN` ticket once a
proposal is applied — is already covered by `TICKET_METHOD.md` as it
stands and needs no extension.

## Intended Direction

Realize the three missing elements without redesigning the existing
observation, triage, or route lanes.

- **`proposal_applied` event.** A single lawful event signature for
  "proposal authored AND approved by its required regime gate (F_D for
  gate completeness, F_H for class-gated human approval where required
  by `change_class`)." The transition flips the proposal artifact from
  `proposed` to `applied`. Application is the constitutional write — it
  is what makes the surface canonically updated.

- **Renewed forward derivation.** Bind `proposal_applied` to open a new
  derivation traversal whose input context is the post-application
  constitutional surface. The traversal must not silently reuse the
  pre-application forward graph; it must re-read.

- **Loopback evaluator.** F_D evaluator that compares post-derivation
  state against the originating `gap_event` fingerprint and emits either
  `gap_retired` (loop closed) or a fresh `gap_event` carrying provenance
  back to the failed attempt.

The emit lane for these new events should land through whatever the ABG
runtime exposes (see B-012 for the broader emit-boundary correction).
This ticket does not prescribe how many emit sites the runtime exposes;
that is realization design, not requirement law.

## Task List

- [ ] Reprice `REQ-F-ODDSDLC-033..037` against current realization;
  declare which requirements are realized today and which bind to the
  three new elements below.
- [ ] Specify the `proposal_applied` event: inputs (proposal artifact
  ref + regime gate evidence), output (constitutional artifact ref),
  evaluator binding (F_D + class-gated F_H).
- [ ] Specify the renewed-derivation contract: input (applied proposal),
  precondition (constitutional surface read after application, never
  before).
- [ ] Specify the `loopback` evaluator: comparison rule against the
  `gap_event` fingerprint; output disjunction `{gap_retired, new gap_event}`.
- [ ] Implement the three elements over the existing
  observation/triage/route surface; do not modify lanes covered by
  `test_odd_sdlc_first_slice.py:889,981`.
- [ ] Add an end-to-end self-test that drives a synthetic gap through
  the full loop and asserts: `proposal_applied` present,
  derivation read the post-application surface, `gap_retired` present.

## Acceptance

- the requirement closure register reports `REQ-F-ODDSDLC-033..037` as
  fully realized
- a single replayable trace exists showing
  `proposal_applied → derivation_reopened → gap_retired`
- the renewed derivation provably reads the post-application
  constitutional surface (covered by the self-test)
- existing observation, triage, and route behavior and tests are
  unchanged

## Links

- review source: external code review of `/Users/jim/src/apps/odd_sdlc`;
  narrowed per codex feedback that flagged ticket-as-stage-carrier
  overreach and a misfit `intent_reprice` change class
- requirement family: `REQ-F-ODDSDLC-033..037` (homeostatic loop); file
  `odd_sdlc/specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`
- existing realization evidence:
  `odd_sdlc/build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py:889,981`
  (constitutional proposal and operator-resolution events present today)
- standards:
  `specification_methodology/specification/standards/SPEC_METHOD.md`,
  `specification_methodology/specification/standards/ODD_METHOD.md`,
  `specification_methodology/specification/standards/TICKET_METHOD.md`
- related: `B-012` (emit boundary; the new events should land through the
  lawful runtime emit lane that B-012 establishes)
