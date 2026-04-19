---
id: B-030
title: No governed path from ticket re_entry_point to the target constitutional surface
type: bug
status: backlog
goal: a ticket triaged as requirement_reprice has a governed pipeline path that drives the requirement update, not just a metadata field
change_intent: Add a ticket-intake edge (or intake operator) to the odd_sdlc pipeline that reads triaged tickets with a declared re_entry_point and dispatches F_P to produce the corresponding constitutional surface update
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: odd_sdlc pipeline edge set — no ticket intake edge exists; gtl_module.py — no graph vector from ticket surface to requirement/design/intent surfaces
priority: high
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
triage_note: upward propagation check — no live requirement governs "the pipeline MUST provide a governed path from a triaged ticket to the constitutional surface named by re_entry_point"; re-entry is requirements
intake_source: dmt.test35_r001 B-003 — requirement_reprice ticket with no pipeline path to requirements surface — 2026-04-19
---

## Observation

`TICKET_METHOD.md` requires every substantive ticket to declare:
- `change_class` — the lawful class of change
- `re_entry_point` — the constitutional surface where the change re-enters

B-003 (dmt.test35_r001) is triaged as `requirement_reprice` / `re_entry_point: requirements`.
When the operator wants to act on it, there is no governed odd_sdlc pipeline path from the
ticket to the requirements surface. The operator must:

1. Manually read the ticket
2. Manually edit `specification/REQUIREMENTS.md`
3. Run `genesis start --auto` to pick up the delta

Steps 1 and 2 are ungoverned — the edit is made outside the pipeline, without F_P dispatch,
without obligation tracking, and without a manifest record.

## Why It Matters

The whole value proposition of odd_sdlc is governed, traceable construction. A requirement
change made by manual edit:
- has no manifest
- has no F_P dispatch record
- has no obligation ledger
- is not subject to F_D or F_P convergence checks
- is not linked back to the ticket that motivated it

The ticket's `re_entry_point` is governance metadata with no enforcement. It declares intent
but provides no pipeline path.

## Required Pipeline Addition

The pipeline needs a **ticket intake edge** (or intake operator) that:

1. Reads triaged tickets from `.ai-workspace/tickets/backlog/` (or `active/`) with a
   declared `re_entry_point`
2. For `re_entry_point: requirements` — dispatches F_P with the ticket content + current
   requirements surface to produce an updated requirements surface
3. For `re_entry_point: design` — dispatches F_P to update the design surface
4. For `re_entry_point: intent` / `product` / `goal` — dispatches F_P at the appropriate level
5. Marks the ticket as `active` when intake dispatch is underway, `completed` when the
   downstream surface converges

This makes `re_entry_point` a routing instruction, not just a label.

## Upward Propagation Check

1. Is there a live requirement that governs a ticket-to-pipeline path? **No.**
2. Is there a design decision realizing such a path? **No.**
3. Did the code deviate from design? **No — code correctly has no ticket intake edge.**
4. First missing layer: requirements.

## Observed In

B-003 (dmt.test35_r001) — `CdmeEngine` public API contract missing — `requirement_reprice`.
After filing the ticket, the only path forward was manual edit of `REQUIREMENTS.md` followed
by an ungoverned `genesis start --auto`. The ticket's governed intent had no governed execution path.
