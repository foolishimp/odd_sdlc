# odd_sdlc First Slice Requirements

**Family**: REQ-F-ODDSDLC-*
**Status**: Superseded
**Category**: Capability
**Carries Forward From**: None
**Authoring Design**: None
**Superseded By**: `specification/requirements/10-odd-sdlc-software-domain-buildout.md`

This family records the original first real `odd_sdlc` tenant slice.

It is retained as superseded source material for the transformation into the
full software-domain package.

Its retained capability content must be re-adopted explicitly into the active
software-domain surface. Nothing in this file remains current operative law by
inertia.

Historical references here to `build_tenants/odd_sdlc/` describe the original
`odd_sdlc` source-repository proving slice only. They do not define
downstream installed-workspace topology, which is governed by
`REQ-F-ODDSDLC-032`.

The acceptance criteria below are retained as historical provenance, not as
current operative law for downstream workspaces.

### REQ-F-ODDSDLC-001 — odd_sdlc is the first live tenant package

`odd_sdlc` is the first live tenant package on the `odd_sdlc` line.

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
- AC-4: `odd_sdlc` exposes an explicit deterministic workspace-normalization
  behavior that can standardize imported or stale project surfaces for its own
  operation without discarding the imported authority

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

### REQ-F-ODDSDLC-007 — odd_sdlc can install and normalize an imported workspace into its canonical runtime shape

The first `odd_sdlc` slice provides a deterministic install-and-normalize
behavior for imported or stale workspaces. That behavior installs the current
ABG kernel, deploys the `odd_sdlc` domain package, writes the runtime contract,
and standardizes the minimal canonical surfaces required for odd_sdlc
operation.

**Acceptance Criteria**:
- AC-1: a target workspace can be installed for `odd_sdlc` operation from the
  current source checkout through one deterministic command
- AC-2: the install path writes a runtime contract so `genesis` can resolve the
  `odd_sdlc` module without a manual `--module` flag
- AC-3: normalization creates or updates the canonical odd_sdlc bootstrap
  surfaces when an imported workspace is missing `PRODUCT.md`, `GOALS.md`, the
  canonical `specification/requirements/` root, or current build-tenant
  constraint wiring
- AC-4: normalization is idempotent and leaves imported authority surfaces in
  place rather than rewriting them into a different project truth
- AC-5: the install path writes a domain-governance instruction section into
  `CLAUDE.md` and `AGENTS.md` that frames the workspace as a target project
  governed by `odd_sdlc`, while preserving the generic GTL bootloader section
  installed by `abiogenesis`
- AC-5a: the installed instruction section makes cold-agent operation explicit:
  operator `gaps` maps to the installed Spec Method entrypoint, which may be
  launched locally as `odd-sdlc-ts gaps --workspace .`; operator `start` maps
  to the same entrypoint, which may be launched locally as
  `odd-sdlc-ts start --workspace . --target next --until blocked`
- AC-5b: instruction-file delivery is marker-governed so reinstall or refresh
  can update the `odd_sdlc` section without deleting unrelated project guidance
- AC-5c: the install manifest records instruction-file verification for both
  `AGENTS.md` and `CLAUDE.md`
- AC-6: the ownership boundary over installed surfaces is explicit:
  - imported `specification/*` remains project-owned authority
  - `.abiogenesis/*` and the GTL bootloader section remain `abiogenesis`-owned
  - the `odd_sdlc` instruction section, runtime contract, normalization report,
    and generated project bootstrap read model remain installer-owned domain
    surfaces

### REQ-F-ODDSDLC-008 — odd_sdlc publishes the first reusable higher-order consensus harness

The first `odd_sdlc` slice publishes one explicit reusable higher-order graph
function for consensus. The harness is not a hidden review engine. It remains a
GTL graph function over typed subject, assessment, decision, and reviewed
output assets, with injected review, reduction, and apply stages and explicit
consensus policy.

**Acceptance Criteria**:
- AC-1: the tenant publishes one isolated round graph function together with
  one reusable higher-order library graph function for the same consensus
  contract
- AC-2: the published graph-function catalog records the consensus harness as a
  library carrier together with its subject asset, assessment asset, decision
  asset, reviewed output asset, injected stage functions, and declared policy
- AC-3: sandbox proof closes one full consensus round through ordinary ABG
  events and provenance
- AC-4: one live proof lane records two distinct reviewer identities producing
  structured assessments against the same subject asset and ingests them
  through ordinary `assess-result` flow
