# odd_sdlc First Slice Requirements

**Family**: REQ-F-ODDSDLC-*
**Status**: Active
**Category**: Capability

This family defines the first real `odd_sdlc` tenant slice.

### REQ-F-ODDSDLC-001 — odd_sdlc is the first live tenant package

`odd_sdlc` is the first live tenant package on the `odd_method` line.

**Acceptance Criteria**:
- AC-1: `build_tenants/odd_sdlc/` exists as an active tenant root
- AC-2: the tenant publishes its own code, design, and proving surfaces
- AC-3: the tenant is recorded explicitly in `build_tenants/TENANT_REGISTRY.md`

### REQ-F-ODDSDLC-002 — odd_sdlc publishes the first asset-function catalog

The first `odd_sdlc` slice publishes a machine-readable catalog of named
functions over the bootstrap asset graph.

**Acceptance Criteria**:
- AC-1: the catalog names the first bootstrap functions
- AC-2: each function records its typed inputs and outputs
- AC-3: the published GTL module records the same function catalog

### REQ-F-ODDSDLC-003 — odd_sdlc exposes an app-owned bootstrap and initialization surface

The first `odd_sdlc` slice provides app-owned bootstrap and initialization
surfaces above GTL and ABG.

**Acceptance Criteria**:
- AC-1: bootstrap creates or resolves the app configuration boundary
- AC-2: initialization binds the published GTL module to ABG runtime
- AC-3: the tenant does not implement a post-dispatch shadow runtime

### REQ-F-ODDSDLC-004 — The first proving lane exercises a real bootstrap-plus-fanout dependency chain

The first proving lane runs a real `odd_sdlc` bootstrap-plus-fanout
dependency chain through ABG and audits the emitted runtime facts.

**Acceptance Criteria**:
- AC-1: the proving lane runs through the tenant’s declared entry surface
- AC-2: the proving lane records ABG event truth such as graph-call and run
  lifecycle across at least the `INTENT -> PRODUCT -> GOALS -> requirements`
  bootstrap subgraph together with the first downstream fan-out to feature
  decomposition and UAT testcase surfaces, the deeper design/scenario/authority
  branch, the first recursive implementation-SDLC branch to implementation
  design, implementation stack profile, implementation modules, and code
  surfaces, and the first recursive test-SDLC branch to generated test design,
  test stack profile, test modules, test run archive, and release surfaces
- AC-3: proof is based on post-mortem event audit rather than only on direct
  return values

### REQ-F-ODDSDLC-005 — odd_sdlc provides a domain query library for UI composition

The first `odd_sdlc` slice provides a Python query library that expresses ODD
domain understanding without duplicating the ABG runtime model.

**Acceptance Criteria**:
- AC-1: the query library exposes domain views such as assets, functions,
  bindings, and gap semantics
- AC-2: runtime truth such as run, graph-call, continuation, and frame state
  remains ABG-native rather than being redefined by ODD
- AC-3: the same query library can later be wrapped by a microservice or MCP
  surface without changing its core query logic

### REQ-F-ODDSDLC-006 — odd_sdlc provides a top-level executive GTL graph function over the current asset-function catalog

The first `odd_sdlc` slice provides one public executive GTL graph function
above the current asset-function catalog. That executive is the runtime
authority: it carries cumulative environment truth, materializes the current
bootstrap-to-release chain as internal vectors, and is the single job-bound
entry point driven through the bounded constructor and assessed-result loop.

The tenant may additionally expose a machine-readable executive program read
model for UI or operator use, but that surface is derived from the executive
graph function rather than acting as an app-owned shadow runtime above ABG.

**Acceptance Criteria**:
- AC-1: the tenant publishes one public executive graph function whose
  materialized vectors name the current bootstrap, recursive implementation,
  recursive test, authority, and release steps in dependency order
- AC-2: the tenant binds one explicit job to that executive graph function and
  exposes an app command that executes the resulting chain end to end from an
  installed workspace
- AC-3: successful execution converges the current toy subgraph to the release
  surface without introducing a product-local shadow runtime beneath ABG
