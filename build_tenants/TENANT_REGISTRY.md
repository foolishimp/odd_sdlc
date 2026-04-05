# Tenant Registry

`build_tenants/` is the project-owned realization root beneath the shared
project specification.

This file is the canonical registry surface for the project's realization roots,
tenant families, variants, and activity state.

The constitutional `specification/` surface is singleton project truth.

`build_tenants/` is realization structure beneath that truth.

## Structure

- `common/` holds shared realization/design law adopted across the line.
- tenant-local roots may be added beneath `build_tenants/` when a concrete
  tenant family or variant needs realization law that should not remain common.

## Registry

| Entry | Kind | Path | Status | Notes |
| --- | --- | --- | --- | --- |
| `common` | shared root | `build_tenants/common/` | Active | Current bootstrap realization root for `odd_method` |

## Active Focus

`common` is the only active realization root at the current bootstrap stage.

No tenant-local variant is adopted yet.
