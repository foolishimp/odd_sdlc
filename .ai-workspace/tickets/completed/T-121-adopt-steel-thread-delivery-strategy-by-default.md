---
id: T-121
title: Adopt steel-thread delivery strategy by default for odd_sdlc build waves
type: process_design
ticket_category: delivery_strategy
status: completed
review_status: closed
goal: odd-sdlc-rc-delivery-acceleration-and-fail-fast-quality
build_tenant: typescript
owner: unassigned
change_intent: Make steel-thread delivery the default odd_sdlc implementation strategy: build the smallest typed vertical slice through common carriers, admission, projection, evaluator, graph wiring, deterministic fixtures, and only then widen to full live lanes.
change_class: goal_reprice
re_entry_point: goal
affected_boundary: ticket planning, implementation slicing, proof sequencing, live test strategy, active ticket closure discipline, T-116 design-surface deepening, T-113 production-depth work, T-109 live parity evidence
priority: high
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-05
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
depends_on:
  - T-109 authoritative edge ledger lineage chain
  - T-113 production-depth through component graph functions
  - T-116 module schema/state and aggregate design surfaces
intake_source: The T-109 data-mapper PTY live run is useful as broad parity evidence but is too expensive as the primary build loop. T-116 also exposes that design deepening should not start with a full live data-mapper run. It should start with common typed carriers and a one-module vertical thread that fails fast before widening to full graph/live scope.
target_truth: odd_sdlc build waves default to steel-thread implementation. A ticket first proves the smallest typed end-to-end path through source carrier, admission, evaluator/projection, graph wiring, deterministic positive fixture, deterministic negative fixture, and compact proof report. Only after that thread passes does the implementation widen to full module counts, full data-mapper live runs, or RC closure claims.
superseded_truth: Broad live data-mapper traversal is the default feedback loop for proving new odd_sdlc mechanics before the common typed substrate is proven locally.
closure_law: This ticket closes only when the steel-thread strategy is written into the active odd_sdlc delivery surfaces and at least one active implementation ticket, preferably T-116, is repriced into explicit steel-thread slices with deterministic proof before live proof.
evaluation_criteria:
  - active ticket planning distinguishes steel-thread proof from widening proof
  - common module/carrier/admission work is implemented before broad worker prompt or live lane changes
  - each new graph mechanic has one positive deterministic vertical fixture
  - each new graph mechanic has at least one negative deterministic fixture that fails for the intended typed reason
  - live tests are treated as post-thread proving lanes, not the primary implementation loop
  - ticket closure criteria name both steel-thread closure and widening/live closure where both are required
  - T-116 is restated as a steel thread before broad data-mapper live reruns are used as closure evidence
proof_surface:
  - updated active ticket text showing steel-thread slices
  - deterministic steel-thread test for one module/entity/operation/state transition
  - deterministic negative test for missing entity, missing attribute, or missing flow
  - live proof plan that runs only after deterministic steel-thread closure
non_closure_conditions:
  - adding "steel thread" as label without changing implementation order
  - using broad live data-mapper runs as the first proof of new carrier/admission mechanics
  - implementing prompts before typed carriers and admission exist
  - closing tickets on narrative worker output without deterministic typed fixture proof
  - treating steel thread as a substitute for live proof where live proof is a closure criterion
---

# T-121: Adopt Steel-Thread Delivery Strategy By Default

## Implementation Note

The first application is T-116. The odd_sdlc goals surface now names
steel-thread delivery as the default strategy for new graph mechanics, and
T-116 has been repriced into a one-module deterministic vertical slice before
full data-mapper live proof.

## Closure Evidence

T-121 is closed by:

- `specification/GOALS.md` naming steel-thread delivery as the default strategy
  for new graph mechanics
- T-116 carrying an explicit steel-thread implementation order
- `test_env/tests/test_t116_design_depth_steel_thread.test.mjs` proving one
  positive vertical path and two negative failure paths before live widening
  proof

## STDO Triage

The first missing layer is `Goal`.

This is not a product feature and not an ABG runtime change. It reprices the
current odd_sdlc build wave: implementation should move through a smallest
typed vertical path before broad live proving.

## Default Strategy

For any new odd_sdlc graph mechanic, the default build order is:

1. Define the common typed carrier.
2. Implement admission/parsing for that carrier.
3. Add the smallest graph wiring that can carry it.
4. Add the evaluator or projection that classifies success/failure.
5. Prove one positive deterministic fixture.
6. Prove one negative deterministic fixture.
7. Widen to full graph/module/data-mapper scope.
8. Run live proof only after the deterministic thread is closed.

## T-116 Required Reprice

T-116 should be implemented as:

1. One module schema fragment.
2. One state diagram fragment.
3. One aggregate domain model over that single module.
4. One sunny-day sequence over one operation.
5. One design-completeness verdict with entity, attribute, and flow axes.
6. Negative fixture for missing entity / attribute / flow.
7. Only then widen to all modules and full data-mapper live proof.

## Non-Closure Statement

Steel thread is not a way to avoid full proof. It is a way to make full proof
meaningful. Broad live runs remain required where tickets require them, but
they are no longer the first place new mechanics are discovered to be missing.
