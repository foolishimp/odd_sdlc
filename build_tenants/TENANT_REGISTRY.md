# Tenant Registry

`build_tenants/` is the project-owned realization root beneath the shared
project specification.

This file is the canonical registry surface for the project's realization roots,
tenant families, variants, and activity state.

The constitutional `specification/` surface is singleton project truth.

`specification/` defines `WHAT`.

`build_tenants/` records the multiple instances of `HOW` that realize that
truth.

## Structure

- `common/` holds shared realization/design law adopted across the line.
- tenant-local roots may be added beneath `build_tenants/` when a concrete
  tenant family or variant needs realization law that should not remain common.

## Registry

| Entry | Kind | Path | Status | Notes |
| --- | --- | --- | --- | --- |
| `common` | shared root | `build_tenants/common/` | Active | Current bootstrap realization root for `odd_method` |
| `odd_service` | service realization | `build_tenants/odd_service/python/` | Incubating | Proposed enduring orchestration plane above `odd_sdlc`, still subordinate to ABG runtime truth |
| `odd_sdlc` | software-domain realization | `build_tenants/odd_sdlc/python/` | Active | Current software-domain package; retained first slice is only a bounded proving subset |

## Active Focus

`common` remains the shared realization root.

`odd_sdlc` is the current active software-domain realization.

`odd_service` is the current incubating service line.
