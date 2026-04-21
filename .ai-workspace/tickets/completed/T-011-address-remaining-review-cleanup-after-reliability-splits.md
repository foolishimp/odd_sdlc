---
id: T-011
title: Address remaining review cleanup after reliability splits
type: chore
ticket_category: ordinary
status: completed
goal: retire the stale cleanup umbrella and split any remaining large cleanup into real follow-on tickets
change_intent: Reconcile the stale review umbrella after the reliability and migration wave so already-landed items are not kept alive as fake debt and any remaining large cleanup is split into explicit tickets
change_class: realization_refactor
re_entry_point: design_surface
affected_boundary: odd_sdlc review-cleanup ticket hygiene, analysis header traceability, and module-split follow-on tracking
priority: medium
triaged_at: 2026-04-18
created_at: 2026-04-17
updated_at: 2026-04-20
completed_at: 2026-04-20
dependencies: B-012 completed, B-018 completed, T-010 completed
intake_source: external odd_sdlc review, narrowed after reliability-critical items were split into standalone bug tickets
---

## Why This Ticket Existed

The umbrella mixed two kinds of work:

- smaller cleanup items that could land quickly or had already gone stale
- one remaining large module-decomposition cleanup that no longer fit a single
  low-severity umbrella

Keeping them bundled was no longer truthful.

## Completion

- G6 is stale: the live surfaces no longer describe the ambiguity register or
  requirement closure register as durable artifacts
- G8 is stale: `operational_dispatch.py` already exposes the edge/lane/command
  mapping as explicit tables rather than burying it in one control-flow branch
- G10 is landed: `analysis.py` now carries explicit `# Implements:` headers
- G9 is still real, but it is not one small cleanup; it is now split into:
  - `T-018` — triage seam split
  - `T-019` — workspace_assets seam split
  - `T-020` — traceability seam split

## Links

- review source: external code review of `/Users/jim/src/apps/odd_sdlc`
- follow-ons:
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-018-split-triage-observation-classification-and-routing-seams.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-019-split-workspace-assets-filesystem-model-and-projection-seams.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-020-split-traceability-index-query-and-report-seams.md`
- companion tickets: `B-012`, `B-016`, `B-017`, `B-018`, `T-010`
