# odd_sdlc Query Plugin Contract

**Status**: Active
**Date**: 2026-04-06
**Implements**: REQ-F-ODDSDLC-020, REQ-F-ODDSDLC-033, REQ-F-ODDSDLC-037
**Derives From**: `build_tenants/common/design/adrs/ADR-006-abg-runtime-and-odd-query-plugin-boundary.md`, `specification/requirements/10-odd-sdlc-software-domain-buildout.md`, `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`, `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`, `build_tenants/python/design/REQUIREMENT_CLOSURE_CARRIER_AND_PROJECTION_BOUNDARY.md`

## Position

`odd_sdlc` does not serve the primary runtime model for the UI.

ABG remains the canonical runtime model for:

- `run`
- `graph_call`
- `continuation`
- `frame`
- raw event truth

`odd_sdlc` instead provides a versioned Python query plugin for domain
understanding.

The first stable plugin contract is `query-domain`.

## Contract Name

- `name`: `odd_sdlc.query-domain`
- `version`: `v1`

## Purpose

The `query-domain` contract gives `odd_manager` a stable domain overlay without
duplicating ABG runtime comprehension.

It is intended to answer:

- what assets exist
- what semantic types they carry
- what functions and bindings exist
- what the current domain gap picture is, including current analysis freshness,
  edge-scoped observation, triage, route, gated constitutional state, and one
  reviewable gap-analysis dossier per current edge

The plugin contract is a read-model surface over admitted tenant truth.

It does not own requirement closure, declared obligation, or gap semantics.

It is not intended to answer:

- live run lifecycle
- graph-call lifecycle
- continuation lifecycle
- frame lifecycle

Those remain ABG-native.

## Top-Level Payload

`query-domain` returns a JSON-serializable object with these top-level keys:

- `query_contract`
- `workspace_root`
- `semantic_facets`
- `asset_types`
- `asset_families`
- `assets`
- `start_target_catalog`
- `asset_ownership_index`
- `operational_capabilities`
- `ambiguity_register`
- `requirement_closure_register`
- `collections`
- `functions`
- `edge_contracts`
- `programs`
- `work_act_types`
- `jobs`
- `graph_functions`
- `bindings`
- `gap_dossier`

## Field Meaning

### `query_contract`

Stable descriptor of the plugin contract:

- `name`
- `version`
- `top_level_keys`
- `runtime_model`
- `query_model`

### `semantic_facets`

The reusable semantic facets used to compose `AssetType` meaning.

### `asset_types`

The first ODD asset-type library as a machine-readable surface.

### `assets`

Projected domain assets for the current workspace.

This field may use event-derived checkpoint interpretation where attributable
asset evolution exists.

### `functions`

The domain function catalog.

### `bindings`

The current asset-node binding surface.

### `gap_dossier`

The singular downstream gap-review surface for the tenant.

At minimum this field exposes:

- current analysis identity and freshness state
- the current analysis-manifest evidence bundle as dossier input, not as a
  separate top-level review surface
- current edge-scoped observation state
- current edge-scoped triage state
- current route binding or unresolved-route state
- current gated constitutional proposal state where applicable
- one edge-scoped dossier surface that packages those current states together
  with the canonical gap row and evidence references

This remains current-state domain projection.

It does not replace ABG event truth for full history, causation, or approval
lineage.

### `requirement_closure_register`

Published current read model for requirement carry, traceability, and closure
state.

This field is read-model truth only.

`query-domain` must not rebuild it from workspace scans when the published
register is absent or stale.

## Carrier Consumption Rule

`query-domain` is lawful only when:

- requirement-closure and declared-obligation truth arrive through the admitted
  carrier/projection stack
- gap dossier output is derived from the same canonical gap projection used by
  `odd_sdlc gaps`
- missing or stale requirement-closure publication yields an explicit
  unavailable projection instead of fallback reconstruction from helper scans

If `query-domain` begins rebuilding requirement carry, fulfillment, or closure
meaning from raw workspace reads, it has crossed from projection into unlawful
semantic authority.

## Consumer Model

`odd_manager` should compose:

1. ABG events and ABG projectors for runtime truth
2. `query-domain` for ODD domain semantics

The UI should not treat `query-domain` as a replacement runtime model.

## Transitional Note

Any current `observe` command is transitional composition only.

The stable plugin contract is `query-domain`.
