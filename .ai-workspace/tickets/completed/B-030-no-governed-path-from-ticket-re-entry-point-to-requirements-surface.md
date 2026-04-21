---
id: B-030
title: Ratify the design and operator-routing contract required before triaged ticket assets can lawfully enter traversal at their declared re_entry_point
type: bug
ticket_category: ordinary
status: completed
goal: ticket/work-item routing becomes lawful design truth before any product claim that ticket assets are start-addressable inputs
change_intent: Ratify the missing design and future target-routing contract needed so triaged ticket assets can eventually enter traversal and drive their declared constitutional update surface instead of requiring manual out-of-band edits
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc target catalog, asset-ownership/index surfaces, ticket/work-item routing design, graph-function publication for ticket intake
priority: high
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-20
completed_at: 2026-04-20
dependencies: T-016 completed, T-017 completed
triage_note: odd_sdlc now publishes `next`, `graph_function:`, and `asset:` target families; this ticket owns the still-missing ticket/work-item routing design required before triaged work items can become operator-addressable assets
intake_source: ticket-driven requirement reprice was resolved by manual upstream edit outside odd_sdlc traversal — 2026-04-19
---

## Design Boundary

The current live operator contract remains:

- `next`
- `graph_function:<published_handle>`
- `asset:<published_handle>`

This ticket does not make ticket/work-item intake live.

It ratifies the missing routing design required before triaged work items can
later become lawful operator-addressable assets.

## Observation

`TICKET_METHOD.md` requires every substantive ticket to declare:

- `change_class` — the lawful class of change
- `re_entry_point` — the constitutional surface where the change re-enters

A triaged work-item declared
`requirement_reprice` / `re_entry_point: requirements`.

The intake was then resolved by a manual upstream requirements edit and a
downstream successful integration test run.

That proves two things at once:

1. the intake ticket was real enough to drive upstream constitutional change
2. odd_sdlc still had no governed traversal path from the ticket asset to that
   constitutional surface

The operator had to:

1. manually read the ticket
2. manually edit the upstream requirement surface
3. manually rerun downstream workspaces to pick up the change

The ticket's `re_entry_point` remained metadata, not routing truth.

## Current Boundary

The live odd_sdlc operator contract now publishes:

- `scope`
- `target = next | graph_function:<published_handle> | asset:<published_handle>`
- `until`

Ticket/work-item assets are still outside the live published target set.

So this ticket is not “generalize start targets.”
It is the missing design/routing work required before ticket/work-item assets
can lawfully extend the already-landed `asset:` target contract.

## Why It Matters

The whole value proposition of odd_sdlc is governed, traceable construction. A
ticket-driven reprice made by manual edit:

- has no manifest
- has no F_P dispatch record
- has no obligation ledger
- is not subject to F_D or F_P convergence checks
- is not linked back to the ticket that motivated it

In the reproduced case, the downstream generated bootstrap requirements still
did not carry the new requirement family even though the upstream runtime and
test already proved it. That is the concrete symptom of the missing
ticket-to-surface routing path.

## Required Direction

The domain needs a lawful future **ticket/work-item intake routing** design that:

1. resolves a triaged ticket/work-item asset through the published odd_sdlc
   asset-ownership index
2. reads `change_class` and `re_entry_point` from the ticket asset
3. routes the traversal to the declared constitutional surface:
   - `requirements`
   - `design`
   - `product`
   - `intent`
   - `goals`
4. carries the ticket/work-item as explicit provenance through the resulting
   manifest and downstream surface update
5. lets ticket state move under governed traversal rather than by manual
   bookkeeping only

The ratified design direction is:

- ticket/work-item intake extends the existing `asset:` handle family
- there is no new top-level `ticket:` grammar
- future handles take the form `asset:ticket/<ticket_id>`
- the published `asset_ownership_index` remains the one authoritative routing
  surface
- each published work-item entry carries a `route_contract` recording
  `change_class`, `re_entry_point`, the mapped re-entry carrier, and scope
  binding

This makes `re_entry_point` future executable routing truth, not just a label.

## Upward Propagation Check

1. Is there a domain start-target and asset-routing contract broad enough to
   make ticket assets lawful traversal inputs? **Not yet.**
2. Is there a design decision realizing ticket/work-item routing into the
   declared re_entry surface? **No.**
3. Did the code deviate from design? **No.**
4. First missing layer: design and routing publication above the current
   graph_function/asset target contract.

## Acceptance

- a ratified design exists for ticket/work-item routing into declared
  constitutional re-entry surfaces
- the design names the future ticket handle shape, route contract, and
  provenance carriage required before product truth expands to published
  ticket/work-item assets
- product/operator truth does not claim ticket assets are live start targets
  until that design and realization actually land
- the reproduced manual ticket-driven reprice is explained as current evidence
  of the missing routing path, not as proof that the target family is already
  live

## Completion

Completed as a design ratification on 2026-04-20.

Landed authority:

- `build_tenants/python/design/TICKET_WORK_ITEM_REENTRY_ROUTING.md`
- `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`
- `build_tenants/python/design/README.md`
- `specification/PRODUCT.md`

Focused proof of the current non-live boundary:

- `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_start_rejects_unpublished_ticket_asset_handle`

Follow-on realization work is split into active `B-033`.

## Reproducer Evidence

- local triaged ticket:
  `ai_sdlc_examples/local_projects/dmt.test35_r001/.ai-workspace/tickets/backlog/B-003-cdme-engine-facade-missing-test-cannot-compile.md`
- upstream requirement reprice:
  `ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/specification/REQUIREMENTS.md`
- downstream passing execution proof:
  `ai_sdlc_examples/local_projects/dmt.test35_r001/build_tenants/cdme/integration_test/target/test-reports/TEST-cdme.baseline.CdmeBaselineSpec.xml`
