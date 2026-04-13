# Realization Topology Requirements

**Family**: REQ-F-REALIZATION-*
**Status**: Active
**Category**: Governance

This family defines the standard realization topology for the `odd_method`
source repository.

Downstream installed workspaces are governed separately by
`REQ-F-ODDSDLC-032`.

Nothing in this family authorizes downstream installed workspaces to place
project realization under `build_tenants/common/` or to treat released
`odd_sdlc` runtime as a project tenant.

### REQ-F-REALIZATION-001 — `odd_method` adopts the tenanted realization model from bootstrap

`odd_method` adopts the standard tenanted realization model from the start rather
than deferring it as a later optimization.

**Acceptance Criteria**:
- AC-1: the live project tree includes `build_tenants/` as an active root
- AC-2: no flat one-off realization root remains implied as the default product
  shape
- AC-3: live product and design surfaces describe the realization model in
  present tense

### REQ-F-REALIZATION-002 — `build_tenants/` is the project-owned realization root beneath singleton specification

The constitutional `specification/` surface remains singleton project truth,
while `build_tenants/` carries project-owned realization structure beneath that
truth.

In short:

- `specification/` defines `WHAT`
- `build_tenants/` realizes `HOW`

**Acceptance Criteria**:
- AC-1: `specification/` remains the sole live constitutional specification
  root
- AC-2: `build_tenants/TENANT_REGISTRY.md` records active realization roots and
  any adopted tenant families or variants
- AC-3: in the source repository, the shared realization root exists even
  before tenant-local variants are introduced
- AC-4: no build-tenant surface claims co-equal authority over domain meaning
  defined in `specification/`

### REQ-F-REALIZATION-003 — Shared and tenant-local realization law are explicit

`odd_method` keeps shared realization law and tenant-local realization law in
explicit separate surfaces inside the source repository.

**Acceptance Criteria**:
- AC-1: in the source repository, `build_tenants/common/` exists as the shared
  realization root
- AC-2: tenant-local roots are added only when they carry real local
  realization law that should not remain common
- AC-3: tenant-local design can evolve without collapsing into shared law by
  default
- AC-4: each tenant root is understood as one instance of `HOW`, not as a
  second constitutional `WHAT`

### REQ-F-REALIZATION-004 — Supporting documentation has a non-constitutional home

`odd_method` maintains a `docs/` root for project-owned supporting documentation that
should not become accidental constitutional authority.

**Acceptance Criteria**:
- AC-1: `docs/` exists as a live root in the project topology
- AC-2: documents under `docs/` are not treated as co-equal with
  `specification/` or `build_tenants/`
- AC-3: supporting documentation can accumulate without polluting the
  constitutional or realization-law surfaces
