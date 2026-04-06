# odd_sdlc Tenant Design

Tenant-local design for `odd_sdlc` lives here.

Adopted common law:

- `build_tenants/common/design/ODD_SDLC_TRANSLATION.md`
- `build_tenants/common/design/adrs/ADR-002-graph-function-first-carrier-and-runtime-boundary.md`
- `build_tenants/common/design/adrs/ADR-004-standard-tenant-realization-topology.md`
- `build_tenants/common/design/adrs/ADR-005-bootstrap-asset-set-and-recursive-edge-contracts.md`

This tenant realizes the first executable ODD slice:

- URI-addressed bootstrap assets
- typed asset nodes
- named functions over the bootstrap asset graph
- ABG runtime over the first graph-function call
- a versioned ODD query plugin contract for UI composition
