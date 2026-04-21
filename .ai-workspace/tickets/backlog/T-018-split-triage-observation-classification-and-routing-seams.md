---
id: T-018
title: Split triage observation intake, classification, and routing into explicit realization seams
type: chore
ticket_category: ordinary
status: backlog
goal: keep odd_sdlc triage logic readable and locally testable without mixed-concern module sprawl
change_intent: Replace the current large mixed-concern `triage.py` surface with explicit observation, classification, and routing seams that can be reasoned about independently
change_class: realization_refactor
re_entry_point: design_surface
affected_boundary: odd_sdlc triage realization cohesion, local testability, and reviewability
priority: medium
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-20
dependencies:
intake_source: split from completed T-011 umbrella after stale review-cleanup items were reconciled
---

## Why This Ticket Exists

`build_tenants/python/code/odd_sdlc/triage.py` still mixes:

- observation intake
- gap classification
- route binding / action selection

That module is now large enough that review and local proof require too much
context for one file.

## Required Direction

1. Split observation intake from classification.
2. Split route binding from classification.
3. Keep the published triage behavior unchanged while the realization seam is
   decomposed.
4. Reprice tests so proof follows the new seams rather than the monolith.

## Acceptance

- triage observation intake, classification, and routing live in explicit
  realization seams
- no active operator or proof lane depends on the old monolith as an implicit
  mixed-concern truth surface

