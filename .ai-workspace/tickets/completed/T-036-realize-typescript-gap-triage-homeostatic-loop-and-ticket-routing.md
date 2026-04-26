---
id: T-036
title: Realize TypeScript gap triage homeostatic loop and ticket routing
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Implement TypeScript observation, triage, route binding, constitutional repricing proposal, loopback, gap retirement, and ticket/work-item routing as downstream graph-function-addressable product behavior.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: gap triage, homeostatic loop, ticket work-item routing, repricing proposals, query/gap dossier integration
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-035 completed
  - T-018 completed or adopted-as-TypeScript-design-lesson
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`; Python `triage.py`, `gap_dossier.py`, `homeostatic_loop.py`, `work_item_routing.py`; ABIogenesis T-067 gap-triage boundary; T-018 triage seam-split lesson
target_truth: SDLC.TS turns replay-derived gap truth into downstream triage decisions, tickets, actions, repricing proposals, or deferments without moving ticket-process authority into ABG.
superseded_truth: Gap triage is an imperative helper that writes route artifacts and implicitly changes process state.
closure_law: this ticket closes when gap triage is a typed graph-function-addressable workflow with explicit route contracts and TICKET_METHOD-governed ticket creation/update semantics.
evaluation_criteria:
  - observation, classification, route binding, repricing proposal, and loopback are separate carriers
  - ticket/work-item route contracts map to lawful re-entry points
  - gap retirement is replay/proof-visible
  - triage consumes gap dossiers and requirement closure truth
  - tests prove ABG gap projection remains read-only substrate truth
proof_surface:
  - triage/homeostatic carrier code
  - graph-function catalog entries for triage
  - ticket routing tests
  - repricing proposal tests
non_closure_conditions:
  - ABG creates or closes tickets as runtime law
  - triage writes process state without admitted route contract
  - constitutional repricing applies silently
---

## STDO Reading

This ticket is downstream product governance over substrate gap truth.

## Closure Evidence

- Added explicit TypeScript triage seams for observation, classification, route
  binding, constitutional repricing proposal, ticket work-item route proposal,
  and loopback retirement.
- Adopted T-018 as a TypeScript design lesson: no Python triage monolith was
  copied into the TS tenant.
- Published triage graph functions in the GTL catalog and module.
- Added governance-loop asset surfaces to the software-domain catalog.
- Triage consumes gap dossiers and requirement closure truth without emitting
  runtime events or applying ticket/constitutional process changes.
- Focused proof: `npm run test:t036` passed.
- Regression proof: `npm run test:semantic` passed with 44 tests.
- Static proof: `npm run lint:semantic` passed.
