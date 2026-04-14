# Tenant Registry

`build_tenants/` is the project-owned realization root beneath the project
specification.

This file is the canonical registry surface for realization roots and their
activity state.

The constitutional `specification/` surface is singleton project truth.

`specification/` defines `WHAT`.

`build_tenants/` records the `HOW` that realizes that truth.

## Structure

- `common/` holds shared realization/design law adopted across realizations.
- `python/` is the primary realization of `odd_sdlc`.
- additional tenant-local roots may be added alongside when a realization needs
  law that should not remain common.

## Registry

| Entry | Kind | Path | Status | Notes |
| --- | --- | --- | --- | --- |
| `common` | shared root | `build_tenants/common/` | Active | Shared realization root |
| `python` | primary realization | `build_tenants/python/` | Active | Primary `odd_sdlc` realization |
| `odd_service` | service realization | `build_tenants/odd_service/python/` | Incubating | Proposed enduring orchestration plane above `odd_sdlc`, still subordinate to ABG runtime truth |

## Active Focus

`python/` is the active realization of `odd_sdlc`.

`common/` is the shared realization root.

`odd_service/` is the current incubating service line.
