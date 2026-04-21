---
id: B-033
title: Realize triaged work-item asset publication and route declared re_entry_point through odd_sdlc start
type: bug
ticket_category: implementation_migration
status: completed
goal: ticket/work-item routing becomes executable start truth over the existing asset target contract
change_intent: Land the product and realization cut that makes triaged ticket/work-item assets operator-addressable through `asset:` handles and routes them to their declared re_entry surface with manifest provenance
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: odd_sdlc asset inventory, asset_ownership_index, start target resolution, future work-item routing carrier, manifest/work-report provenance, operator/product proof
priority: high
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-20
completed_at: 2026-04-20
dependencies: B-030 completed
triage_note: B-030 ratified the routing design and non-live boundary; this ticket owns the product/realization migration that makes `asset:ticket/<ticket_id>` a live odd_sdlc start path
intake_source: follow-on work split from completed B-030 design ratification — 2026-04-20
---

## Migration Declaration

- old_truth_path: triaged work items still require manual operator interpretation and out-of-band edits even though their `change_class` and `re_entry_point` are already declared in the ticket surface
- new_truth_path: triaged work items publish as operator-addressable `asset:ticket/<ticket_id>` handles whose `route_contract` drives governed traversal to the declared re-entry surface with carried provenance
- producers_old:
  - ticket markdown under `.ai-workspace/tickets/`
  - manual operator interpretation and manual upstream edits
- producers_new:
  - published work-item asset inventory
  - published `asset_ownership_index` entries for work items
  - published work-item `route_contract`
  - published work-item routing carrier and start resolver
- consumers_old:
  - manual requirement/design/product/intent/goal edits
  - downstream rerun workspaces with no ticket provenance
- consumers_new:
  - `odd_sdlc start`
  - manifest/work-report provenance
  - downstream governed surface updates
  - later orchestration/query clients
- derived_surfaces:
  - `asset_ownership_index`
  - future work-item routing carrier publication
  - manifest/work-report provenance
  - operator docs and installed proof lanes
- closure_law: this migration closes only when triaged work items can enter odd_sdlc through published `asset:ticket/<ticket_id>` handles, the route contract governs re-entry instead of manual interpretation, and the old manual path is no longer authoritative execution truth

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

## Context

Completed B-030 ratified the routing design and the current non-live boundary:

- the current public target grammar remains `next`, `graph_function:`, and
  `asset:`
- work-item intake extends the existing `asset:` family
- future handles take the form `asset:ticket/<ticket_id>`
- work-item routing must be published through `asset_ownership_index` and a
  `route_contract`

That design is now authority. This ticket owns the actual migration.

## Required Direction

1. Publish triaged work items as current odd_sdlc assets.
2. Add `asset_ownership_index` entries for published work-item handles.
3. Publish one routing contract that carries `change_class`,
   `re_entry_point`, mapped re-entry carrier, and scope binding.
4. Make `odd_sdlc start --target asset:ticket/<ticket_id>` resolve only
   through that published domain truth and fail closed otherwise.
5. Carry the work item as provenance through the resulting manifest and
   downstream work report or asset update.

## Acceptance

- triaged work items are published as current odd_sdlc assets with stable
  `asset:ticket/<ticket_id>` handles
- `odd_sdlc start` resolves those handles only through the published
 `asset_ownership_index` and work-item `route_contract`
- the routed re-entry surface reflects the ticket's declared `change_class`
  and `re_entry_point`
- resulting traversal carries the work item as explicit provenance in the
  source-line dispatch manifest and active work-item prompt context
- product/operator truth is updated to state that ticket/work-item asset
  handles are now live
- installed proof demonstrates a ticket-driven re-entry path without manual
  upstream editing

## Completion

- triaged work items now publish as `work_request_surface` assets with stable
  `asset:ticket/<ticket_id>` handles through `bootstrap_assets(...)` and
  `asset_ownership_index`
- `odd_sdlc start --target asset:ticket/<ticket_id>` now resolves only through
  the published route contract and routes re-entry by binding the declared
  `reentry_vector`
- the routed ticket surface now publishes an active work-item execution
  context so F_P prompts dogfood the ticket's own migration declaration and
  checklist instead of treating the ticket as commentary
- source-line proof:
  - `test_query_domain_publishes_triaged_work_item_assets`
  - `test_start_routes_ticket_asset_to_declared_reentry_vector`
  - `test_ticket_asset_start_carries_ticket_execution_context_into_manifest_prompt`
  - `test_start_rejects_unpublished_ticket_asset_handle`
- installed proof:
  - `test_install_query_domain_publishes_triaged_work_item_asset_and_route_contract`
  - `test_install_start_routes_ticket_asset_without_manual_upstream_edit`
