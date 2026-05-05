---
id: T-119
title: Add compact gaps projection for live harness control
type: performance
ticket_category: operator_projection
status: backlog
review_status: pending
goal: typescript-rc-live-lane-performance-and-observability
build_tenant: typescript
owner: unassigned
change_intent: Add a compact machine-readable gaps projection for live harness step control while preserving full gap output in archives for human review.
change_class: realization_refactor
re_entry_point: projection
affected_boundary: odd-sdlc-ts gaps, live data-mapper harness, step control files, gap dossier projection, operator summary projection
priority: medium
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-04
governance_scope: STDO Method
depends_on:
  - T-109 authoritative edge ledger lineage chain
  - T-112 complete semantic lifecycle over abg35 substrate
intake_source: T-109 data-mapper PTY live run writes roughly 1 MB of stdout for repeated `gaps` checks. The live harness needs a small control projection, not the full human-readable gap report, on every step.
target_truth: Live harness step control reads a compact gaps projection containing current edge, closed vectors, blocking reason summary, retry eligibility, next lawful actions, and archive refs. Full gaps output remains available as an explicit archive artifact or human command mode.
superseded_truth: Every live harness control checkpoint must parse or persist the full human gap projection.
closure_law: This ticket closes only when compact gaps is a first-class projection mode and live harnesses use it for control without losing full forensic gap output.
evaluation_criteria:
  - `gaps` exposes a compact JSON projection or equivalent machine mode
  - compact projection includes current edge, status, retry eligibility, next lawful action, and refs to full dossiers
  - live data-mapper harness uses compact projection for loop control
  - full gap output remains available for human review
  - compact and full projections agree on blocking status and next action
proof_surface:
  - deterministic projection-equivalence test
  - live harness step files showing compact gaps control output below size budget
  - negative fixture where compact and full projections disagree and the test fails
non_closure_conditions:
  - replacing full gaps output with compact output
  - compact projection drops retry frontier or lawful-action data
  - live harness still emits megabyte-scale gaps stdout for every control checkpoint
---

# T-119: Compact Gaps Projection

## STDO Triage

The missing layer is projection. This is odd_sdlc-owned because `gaps` is the
domain operator observation surface, even though its truth must remain grounded
in ABG runtime and admitted odd_sdlc ledgers.
