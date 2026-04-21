# odd_sdlc Ticket And Work-Item Re-entry Routing

**Status**: Current
**Implements**: REQ-F-ODDSDLC-035, REQ-F-ODDSDLC-037
**Derives From**: `specification/PRODUCT.md`, `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`, `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`, `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`

## Position

Triaged ticket and work-item intake is current odd_sdlc operator law through
the existing `asset:` family.

The current public `start` contract remains:

- `next`
- `graph_function:<published_handle>`
- `asset:<published_handle>`

Ticket/work-item routing must extend that current contract without creating a
second target grammar or a manual side-channel.

## Current Boundary

Current product truth publishes triaged ticket/work-item assets as
operator-addressable `asset:` handles when they are present in the triaged
ticket surface.

Manual ticket interpretation is no longer authoritative execution truth for
those routed handles.

## Target Grammar Rule

Ticket/work-item intake extends the existing `asset:` family.

The current operator shape is:

- `odd_sdlc start --target asset:ticket/<ticket_id> ...`

There is no new parallel top-level `ticket:` grammar.

This keeps one target grammar:

- graph-function handles resolve through `start_target_catalog`
- asset handles resolve through `asset_ownership_index`

Ticket/work-item routing therefore remains a domain-owned asset publication
problem, not a second operator parser family.

## Published Asset Contract

A triaged ticket/work-item publishes as a current operator-addressable asset
entry with at least:

- `handle = ticket/<ticket_id>`
- `asset_id = ticket/<ticket_id>`
- `asset_type = work_request_surface`
- `uri`
- `relative_path`
- `change_class`
- `re_entry_point`
- `affected_boundary`
- `operator_target`
- `route_contract`

The published `asset_ownership_index` entry remains the one authoritative
resolution surface for this handle.

## Route Contract

The published `route_contract` exists so the asset handle does not resolve only
to a raw graph function id.

It carries at least:

- `route_kind = odd_sdlc.work_item_reentry`
- `change_class`
- `re_entry_point`
- `reentry_vector`
- `reentry_target_asset`
- `operator_target_handle`
- `scope_binding`

The first routing source is the triaged ticket metadata already recorded in the
ticket surface:

- `change_class`
- `re_entry_point`

The route contract makes that metadata executable domain truth instead of
leaving it as commentary for a human operator to interpret.

## Current Carrier

The current routing carrier is the published odd_sdlc executive graph function
already exposed through the existing `asset_ownership_index`:

- admits a triaged work-item asset as source
- reads the published route contract
- opens the declared re-entry boundary by binding `diagnostic_edge_override`
  to the routed re-entry vector
- carries the work-item as manifest provenance and prompt execution context

## Re-entry Mapping

The current route contract maps declared `re_entry_point` to the live odd_sdlc
re-entry surface, at minimum across:

- `goals`
- `intent`
- `product_definition`
- `requirements`
- `design_surface`

Lower realized re-entry layers may be added later, but they must still route
through one published domain contract rather than hidden operator folklore.

## Provenance Rule

Ticket/work-item traversal preserves provenance across:

- ticket/work-item asset identity
- routed re-entry decision
- resulting manifest prompt and dispatch provenance
- downstream routed start metadata

Manual out-of-band edits do not satisfy that law.

## Fail-Closed Guard

The current live boundary still fails closed:

- only triaged tickets with a published route contract become addressable
  `asset:ticket/<ticket_id>` handles
- unsupported `re_entry_point` values do not publish a live route contract
- unpublished ticket handles are rejected by `odd_sdlc start`
- there is still no parallel top-level `ticket:` grammar
