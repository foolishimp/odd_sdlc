# odd_sdlc Start Target Catalog And Asset Ownership Index

**Status**: Active
**Implements**: REQ-F-ASSETMODEL-005, REQ-F-ODDSDLC-029, REQ-F-ODDSVC-003
**Derives From**: `specification/requirements/07-asset-typing-and-binding.md`, `specification/requirements/09-odd-service-orchestration-plane.md`

## Purpose

`odd_sdlc start` needs one domain-owned target truth above the ABG substrate.

The public target selector now admits:

- `next`
- `graph_function:<published_handle>`
- `asset:<published_handle>`

The domain resolves those handles through two machine-readable surfaces:

- `start_target_catalog`
- `asset_ownership_index`

Neither handle family is allowed to fall back to hidden path heuristics, prompt
folklore, or runtime-config self-query bridges.

## Start Target Catalog

`start_target_catalog` is published from the live odd_sdlc graph-function set.

Each entry records:

- `handle`
- `target_id`
- `graph_function_name`
- `carrier_class`
- `template_kind`
- `job_names`
- `start_addressable`

Current carrier classes are:

- `executive_carrier`
- `host_binding`
- `higher_order_plugin`
- `edge_realization_carrier`

`start_addressable` is true only when the published graph function has one
materialized graph and one published semantic job in the live module. Symbolic
library/plugin declarations may remain visible in the catalog while staying
non-addressable.

## Asset Ownership Index

`asset_ownership_index` publishes the current operator-addressable asset
handles together with the governing traversal boundary for each asset.

Each entry records:

- `handle`
- `asset_id`
- `uri`
- `relative_path`
- `path_kind`
- `exists`
- `operator_target.kind`
- `operator_target.handle`
- `operator_target.target_id`
- `operator_target.graph_function_name`
- `operator_target.carrier_class`

The current governing ownership rules are explicit:

- bootstrap/software-build assets resolve to `bootstrap_release_self_test`
- review-decision assets resolve to `review_design_consensus_round`
- operational execution/result assets resolve to `release_operational_cycle`
  only when that executive carrier is published in the live module
- projection-only registers such as ambiguity and requirement-closure read
  models are not operator-addressable assets

Triaged ticket/work-item intake is now live through the current asset index.

Published triaged tickets extend the existing `asset:` handle family as
`asset:ticket/<ticket_id>` and remain governed by the separate routing design
in `build_tenants/python/design/TICKET_WORK_ITEM_REENTRY_ROUTING.md`.
This does not create a second top-level target grammar.

## Runtime Rule

`odd_sdlc.app.start(...)` resolves `graph_function:` and `asset:` only through
these published domain surfaces.

The app binds one domain module instance at bootstrap and reuses that module
for:

- catalog publication
- target resolution
- scoped executable-job selection

That prevents mixed identity between the published target catalog and the live
scoped jobs used by `gen_start(...)`.

## Consequence

The public odd_sdlc operator line now has one truthful target story:

- the substrate still owns traversal
- odd_sdlc owns which published targets are lawful here
- hidden substrate helper paths are not operator truth
