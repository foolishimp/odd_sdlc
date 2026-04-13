# odd_sdlc Tenant Design

Tenant-local design for `odd_sdlc` lives here.

Adopted common law:

- `build_tenants/common/design/ODD_SDLC_TRANSLATION.md`
- `build_tenants/common/design/adrs/ADR-002-graph-function-first-carrier-and-runtime-boundary.md`
- `build_tenants/common/design/adrs/ADR-004-standard-tenant-realization-topology.md`
- `build_tenants/common/design/adrs/ADR-005-bootstrap-asset-set-and-recursive-edge-contracts.md`

Tenant-local design law:

- `build_tenants/odd_sdlc/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/odd_sdlc/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`
- `build_tenants/odd_sdlc/python/design/QUERY_PLUGIN_CONTRACT.md`

`SOFTWARE_DOMAIN_BUILDOUT.md` and
`HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md` are the current operative
tenant-local design surfaces for `odd_sdlc`.

`QUERY_PLUGIN_CONTRACT.md` is the versioned query-surface contract derived from
that tenant-local design.

The shared translation remains adopted common law only where it still provides
current cross-tenant truth. First-slice-only content does not remain active by
inertia.

This tenant now realizes the active software-domain package, with the retained
proving subset treated only as a bounded proof lane inside that package:

- URI-addressed bootstrap assets
- typed asset nodes
- named functions over the bootstrap asset graph
- ABG runtime over the first graph-function call
- a versioned ODD query plugin contract for UI composition
- a tenant-local software-domain build-out over the full SDLC lifecycle
- a tenant-local homeostatic reverse path over observation, triage, route, and
  constitutional repricing
