# ADR-004 - Standard Tenant Realization Topology

**Status**: Active
**Date**: 2026-04-05
**Implements**: REQ-F-REALIZATION-001, REQ-F-REALIZATION-002, REQ-F-REALIZATION-003, REQ-F-REALIZATION-004

## Context

`odd_method` is intentionally a fresh constitutional line, but that does not justify
inventing a special flat bootstrap topology.

The project direction now favors standardization over early optimization.

At the same time, a named tenant root with no tenant-local realization law is
fake structure.

## Decision

`odd_method` adopts the standard tenanted realization topology from bootstrap.

The structural split is:

- `specification/` remains the singleton constitutional specification root
- `build_tenants/` is the project-owned realization root beneath that shared
  specification
- `build_tenants/common/` carries the active bootstrap realization law
- `build_tenants/common/design/` carries shared design law that is not yet
  tenant-local
- tenant-local roots are added only when they carry real local realization or
  design law that should not remain common
- `docs/` is the non-constitutional root for supporting project documentation

Tenant-local realization or design detail belongs under a tenant-local root in
`build_tenants/` only once such a root is justified by real divergence.

## Consequences

- `odd_method` no longer implies that tenant structure is optional or deferred
- `odd_method` also does not invent a nominal tenant before tenant-local law exists
- shared design law lives with shared realization law rather than under
  `specification/`
- later domain-specific realizations can add tenant-local roots without
  repricing the singleton constitutional surface
- supporting documentation has an explicit home that does not compete with live
  authority
