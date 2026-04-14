# odd_sdlc Query Plugin Contract

**Status**: Active
**Date**: 2026-04-06
**Implements**: REQ-F-ODDSDLC-020, REQ-F-ODDSDLC-033, REQ-F-ODDSDLC-037
**Derives From**: `build_tenants/common/design/adrs/ADR-006-abg-runtime-and-odd-query-plugin-boundary.md`, `specification/requirements/10-odd-sdlc-software-domain-buildout.md`, `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`, `build_tenants/odd_sdlc/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`

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
  edge-scoped observation, triage, route, and gated constitutional state

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
- `assets`
- `functions`
- `bindings`
- `gaps`

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

### `gaps`

The current domain gap picture for the tenant.

At minimum this field must be rich enough to expose:

- current analysis identity and freshness state
- current edge-scoped observation state
- current edge-scoped triage state
- current route binding or unresolved-route state
- current gated constitutional proposal state where applicable

This remains current-state domain projection.

It does not replace ABG event truth for full history, causation, or approval
lineage.

## Consumer Model

`odd_manager` should compose:

1. ABG events and ABG projectors for runtime truth
2. `query-domain` for ODD domain semantics

The UI should not treat `query-domain` as a replacement runtime model.

## Transitional Note

Any current `observe` command is transitional composition only.

The stable plugin contract is `query-domain`.
