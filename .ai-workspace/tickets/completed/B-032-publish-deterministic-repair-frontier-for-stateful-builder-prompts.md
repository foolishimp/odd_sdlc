---
id: B-032
title: Publish a deterministic repair frontier for stateful builder prompts so generic F_P builders preserve satisfied structure and repair only unmet requirement deltas
type: bug
ticket_category: implementation_migration
status: completed
goal: stateful-minimal-repair
change_intent: Extend the landed stateful-builder model with a deterministic repair-frontier publication so generic prompt bodies can inspect enduring asset state, preserve already-satisfied structure, and repair only the unmet requirement delta unless deterministic evidence expands scope
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc stateful-builder control frames, requirement-closure prompt context, realization-deepening prompt context, deterministic traceability/closure publication, prompt-boundary law for requirement/design/code/test constructive lanes
priority: high
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-20
completed_at: 2026-04-20
dependencies: odd_sdlc T-002 completed; odd_sdlc B-019 completed; odd_sdlc B-020 completed; odd_sdlc T-010 completed
intake_source: operator requirement clarified during active builder review — generic context is acceptable, but the builder must iterate over the enduring asset under construction and only repair the missing requirement delta unless truth forces scope expansion
triage_note: this is not a “less context” ticket and not a substrate carry-forward ticket; the missing layer is domain publication of a deterministic minimal-repair frontier for stateful builder prompts
---

## Migration Declaration

- old_truth_path: generic stateful builder prompts see current state and broad context but still rely on builder discretion rather than one published deterministic repair frontier
- new_truth_path: generic builder prompts consume one published repair-frontier surface derived from requirement closure, traceability, deepening control, and gap truth so they preserve satisfied structure and repair only unmet deltas unless deterministic evidence widens scope
- producers_old:
  - generic prompt assembly over current asset plus broad context
  - realization-deepening control frame without one repair-frontier carrier
- producers_new:
  - requirement closure register and prompt context
  - realization-deepening control frame
  - future repair-frontier publication surface
- consumers_old:
  - F_P builder prompts across requirement/design/code/test constructive lanes
- consumers_new:
  - F_P builder prompts across requirement/design/code/test constructive lanes
  - downstream proof lanes that validate bounded deepening rather than broad rewrites
- derived_surfaces:
  - builder-facing prompt context
  - requirement closure prompt context
  - realization deepening control frame
  - future repair-frontier read model
- closure_law: this migration closes only when generic builders consume a published repair frontier, broad rewrites are no longer accepted as normal completion behavior, and the old builder-discretion path is no longer authoritative

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Observation

`odd_sdlc` already landed the first half of the stateful-builder model in
completed [T-002](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-002-refactor-odd-sdlc-from-pure-function-builder-framing-to-stateful-iterator.md:1):

- inspect the current target asset
- treat current workspace state as truth
- deepen existing realization before widening laterally
- keep generic builder framing instead of one-off edge-specific prompt hacks

That is necessary but not sufficient.

The remaining operator requirement is stronger:

- keep a generic prompt skeleton
- keep broad context available by reference
- make the builder operate over the enduring asset under construction
- preserve already-satisfied requirement structure
- implement only the currently missing requirement delta unless deterministic
  failure proves the scope must widen

Today the domain does not yet publish that minimal-repair frontier strongly
enough. The prompt sees current state, but it does not yet receive one
deterministic domain contract that says:

- which requirement ids remain unmet
- which satisfied ids and structures are now preservation obligations
- which sections/modules/files/tests are in the lawful repair frontier
- when widening is lawful versus when it is drift

So the system still depends too much on prompt quality and builder diligence
instead of publishing one explicit domain repair law.

## Why This Matters

This is the boundary between:

- a builder that behaves like a lazy broad rewrite engine that happens to see
  current files

and

- a builder that behaves like a governed iterative repair agent over an
  enduring asset

The product requirement is not “pass less context”.

The product requirement is:

- generic builder prompts remain generic
- context remains broadly available
- the durable asset under construction remains the thing being repaired
- already-satisfied structure becomes explicit preservation pressure
- only the missing requirement delta is actively repaired unless deterministic
  evidence expands the lawful frontier

Without that published repair frontier, the stateful-builder model remains too
soft and broad rewrites remain a behavioral risk.

## Distinction From Closed And Nearby Tickets

This ticket is **not**:

- completed [B-028](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-028-manifest-generation-does-not-scope-to-failing-gap-on-incremental-iteration.md:1)
  The invalidated framing there was “too much context” or “missing stateful
  builder axiom”. Both were wrong.
- ABG substrate carry-forward
  ABG owns event/result carriage; this ticket is odd_sdlc-local prompt/control
  framing and deterministic frontier publication.

This ticket **extends**:

- completed [T-002](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-002-refactor-odd-sdlc-from-pure-function-builder-framing-to-stateful-iterator.md:1)
  by adding a stronger deterministic repair frontier above the already-landed
  stateful-builder control frame
- completed [B-019](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-019-fp-gap-analysis-conflates-traceability-with-implementation-completeness.md:1)
  because the frontier must be grounded in truthful carry vs fulfillment
  accounting
- completed [T-010](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-010-define-bidirectional-requirement-design-traceability-publication.md:1)
  because minimal repair depends on explicit traceability publication

## Required Direction

`odd_sdlc` must publish one deterministic **repair frontier** for constructive
builder prompts.

At minimum that frontier must state:

1. the target enduring asset under construction
2. the unmet requirement ids that are still active repair pressure
3. the satisfied requirement ids that must be preserved
4. the impacted design sections / implementation modules / files / test modules
   / realized-test surfaces
5. the lawful edit frontier
6. the lawful proof frontier
7. the deterministic conditions that justify widening beyond that frontier

The builder prompt may still be generic and may still carry broad context, but
the repair frontier becomes the domain law that distinguishes:

- preserve
- deepen
- widen
- reframe upward

## Concrete Publication Direction

This does not require a new shadow tracker.

The lawful direction is to extend the already-published domain truth family:

- requirement closure register
- requirement closure prompt context
- realization-deepening control frame
- span / gap analysis surfaces
- obligation ledgers as completed by `B-020`, plus the remaining operator-gap
  cleanup under `B-019`

The new frontier should be derived from those surfaces and published as one
builder-facing read model, not invented ad hoc inside prompt assembly.

## Acceptance

- odd_sdlc publishes one deterministic repair-frontier surface for the main
  constructive lanes
- generic builder prompts consume that frontier while preserving their generic
  body
- the builder is explicitly instructed to preserve satisfied structure and
  repair only the unmet requirement delta unless deterministic evidence widens
  the frontier
- widening beyond the frontier is treated as a lawful, explainable transition,
  not an ungoverned rewrite
- proving demonstrates that a shallow existing realization is deepened under
  the frontier rather than broadly rewritten when only a bounded requirement
  delta is missing
- this publication remains domain-owned in odd_sdlc and does not create a new
  substrate tracker

## Completion

Completed in the live odd_sdlc line on 2026-04-20.

The landed closure path is:

- runtime publication in
  `build_tenants/python/code/odd_sdlc/repair_frontier.py`
- explicit analysis identity in
  `build_tenants/python/code/odd_sdlc/analysis.py`
- builder-context injection for requirement, realization, and realized-test
  constructive lanes in
  `build_tenants/python/code/odd_sdlc/gtl_module.py`
- ratified tenant-local builder design in
  `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md`

Focused proof is in:

- `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_constructive_vectors_consume_repair_frontier_context`
- `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_code_edge_prompt_includes_realization_deepening_context`
- `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_refresh_analysis_publishes_deterministic_repair_frontier`
- `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_refresh_analysis_publishes_distinct_analysis_manifest`
- `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_query_domain_exposes_published_analysis_manifest`

## Links

- stateful builder base cut:
  `odd_sdlc/.ai-workspace/tickets/completed/T-002-refactor-odd-sdlc-from-pure-function-builder-framing-to-stateful-iterator.md`
- truthful ledger split:
  `odd_sdlc/.ai-workspace/tickets/completed/B-019-fp-gap-analysis-conflates-traceability-with-implementation-completeness.md`
- remaining ledger adoption:
  `odd_sdlc/.ai-workspace/tickets/completed/B-020-adopt-abg-b014-typed-fp-fulfillment-carrier-in-odd-sdlc-domain.md`
- traceability publication:
  `odd_sdlc/.ai-workspace/tickets/completed/T-010-define-bidirectional-requirement-design-traceability-publication.md`
