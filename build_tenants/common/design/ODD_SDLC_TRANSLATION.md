# ODD SDLC Translation

**Status**: Active
**Date**: 2026-04-06
**Implements**: REQ-F-UPSTREAM-001, REQ-F-UPSTREAM-002, REQ-F-UPSTREAM-003, REQ-F-GFUNC-001, REQ-F-GFUNC-002, REQ-F-GFUNC-003, REQ-F-GFUNC-004, REQ-F-RUNTIME-001, REQ-F-RUNTIME-002, REQ-F-RUNTIME-004, REQ-F-ASSET-001, REQ-F-ASSET-002, REQ-F-ASSET-003, REQ-F-ASSET-004
**Derives From**: `specification/INTENT.md`, `specification/PRODUCT.md`, `specification/requirements/01-upstream-adoption.md`, `specification/requirements/02-graph-functions.md`, `specification/requirements/03-runtime-governance.md`, `specification/requirements/06-bootstrap-assets-and-recursive-edges.md`

## Position

`odd_sdlc` is the first concrete ODD domain translation of the
`genesis_sdlc` method line.

`genesis_sdlc` is source material for this translation. It is not hidden live
authority for `odd_method`.

The translation keeps the useful method surfaces from `genesis_sdlc` and
re-expresses them as:

- URI-addressed assets
- typed asset nodes
- named functions
- GTL graph functions
- ABG graph calls over bound asset scope

## Translation Boundary

The translation carries forward method surfaces. It does not carry forward
runtime-control baggage by default.

The translation therefore preserves:

- intent, product, goals, requirements, design, scenarios, testcase
  authority, and qualification surfaces
- explicit proving and release surfaces when present
- their domain meaning as assets and convergence targets

The translation does not presume:

- `.gsdlc` install topology
- `genesis_sdlc` control-plane artifacts
- a project-global hidden runtime graph
- post-dispatch shadow runtime logic

## Domain Objects

`odd_sdlc` adopts these first-class domain objects:

- `Asset`
- `AssetType`
- `AssetCollection`
- `AssetNode`
- `AssetGraph`
- `AssetBinding`
- `Function`
- `FunctionCall`
- `Gap`
- `ConvergenceTarget`
- `AssetResolver`

### Asset

An asset is identified by URI and typed by domain role.

First supported URI schemes:

- `file://`
- `http://`
- `https://`

Deferred:

- `mcp://`

### AssetType

Asset types are semantic carriers.

Each type may carry:

- deterministic evaluation
- probabilistic gap evaluation
- probabilistic descriptive framing
- proof or closure hints

This gives the type system domain meaning without moving semantics into one
global controller prompt or one hidden runtime layer.

## genesis_sdlc Surface Translation

The first `odd_sdlc` translation adopts this asset-type mapping.

| Source Surface | ODD Asset Type | Notes |
| --- | --- | --- |
| `specification/INTENT.md` | `intent_doc` | singleton asset |
| `specification/PRODUCT.md` | `product_doc` | singleton asset |
| `specification/GOALS.md` | `goal_surface` | singleton asset |
| `specification/requirements/*.md` | `requirement_family` | folderized family set |
| `build_tenants/.../design/...` | `design_surface` | shared or tenant-local design law |
| `specification/scenarios/*.md` | `scenario_bundle` | bounded proving surfaces |
| `specification/scenarios/TESTCASE_AUTHORITY.md` | `testcase_authority_surface` | proving-governance asset |
| qualification or release artifacts | `proof_surface` / `release_surface` | retained only when explicitly adopted |
| `.ai-workspace/comments/...` | `commentary_surface` | non-constitutional working material |

## Asset Collections

The first `odd_sdlc` translation should use these named collections:

- `bootstrap_input_set`
- `spec_surface`
- `requirement_surface`
- `design_surface_set`
- `proof_surface_set`
- `release_surface_set`

These collections are the working scopes bound into functions.

## Asset Nodes

Typed asset nodes give the structural loci used in functions and graphs.

The first translation should use nodes equivalent to:

- `input_set`
- `intent_surface`
- `product_surface`
- `goal_surface`
- `requirement_surface`
- `design_surface`
- `scenario_surface`
- `testcase_authority_surface`
- `release_surface`

## Function Catalog

`odd_sdlc` should publish named functions over those typed nodes.

The first catalog should include:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_design_surface`
- `derive_scenario_surface`
- `qualify_testcase_authority`
- `prepare_release_surface`

These are domain functions.

Each is realized as a GTL `GraphFunction`.

### Bootstrap Functions

The bootstrap translation starts with the bounded upstream edges already
required on the `odd_method` line.

The first explicit bootstrap contracts are:

- `{input_set} -> {intent_surface}`
- `{input_set} -> {product_surface}`
- `{input_set} -> {goal_surface}`
- `{input_set, intent_surface, product_surface, goal_surface} -> {requirement_surface}`

The goal surface is included in the translation because `genesis_sdlc`
already treats goals as a first-class method surface.

### Downstream Functions

The first downstream translation adds:

- `{requirement_surface} -> {design_surface}`
- `{requirement_surface, design_surface} -> {scenario_surface}`
- `{scenario_surface} -> {testcase_authority_surface}`
- `{requirement_surface, design_surface, testcase_authority_surface} -> {release_surface}`

These are translation targets for `odd_sdlc`. They are not yet executable
claims.

## Asset Graph

The `odd_sdlc` asset graph is the dependency topology over those nodes.

The first graph shape is:

`input_set -> intent_surface`

`input_set -> product_surface`

`input_set -> goal_surface`

`input_set + intent_surface + product_surface + goal_surface -> requirement_surface`

`requirement_surface -> design_surface`

`requirement_surface + design_surface -> scenario_surface`

`scenario_surface -> testcase_authority_surface`

`requirement_surface + design_surface + testcase_authority_surface -> release_surface`

This graph is decomposable. Each boundary may later refine internally while
preserving the outer contract.

## Binding Model

Concrete project material enters the domain through asset bindings.

An asset binding:

- maps one concrete asset or asset collection into one typed asset node
- uses URI identity as the stable locator
- does not require one permanent global project graph to exist before work can
  begin

This allows the same function to be called over:

- one local workspace
- one imported source corpus
- one remote set of assets

## Runtime Mapping

The runtime mapping is:

- domain `Function` -> GTL `GraphFunction`
- domain `FunctionCall` -> ABG `GraphCall`
- domain `Gap` -> ABG projection or delta view
- domain continuation -> ABG continuation truth

Execution law is:

1. bind concrete assets into typed asset nodes
2. call one named function over that bound scope
3. materialize the graph from the function and the bindings
4. let ABG execute the resulting call
5. project gap, proof, closure, and continuation state back onto the assets
   and collections

ABG owns raw runtime fact truth.

`odd_sdlc` owns domain interpretation, function publication, and asset typing.

## Evaluation Model

Evaluation and description law hangs primarily from `AssetType`.

Examples:

- `intent_doc`
  - deterministic uniqueness checks
  - probabilistic sufficiency checks
- `requirement_family`
  - deterministic id and status checks
  - probabilistic overlap and completeness checks
- `design_surface`
  - deterministic reference and heading checks
  - probabilistic architectural coherence checks

Functions and vectors may reference those type-level hooks.

ABG resolves them through declared policy and hook binding.

## Operator Surfaces

The first `odd_sdlc` operator UX should project six main surfaces:

- Assets
- Functions
- Bindings
- Calls
- Gaps
- Audit

Assets show URI, type, gap, and convergence state.

Functions show callable boundaries and current binding status.

Bindings show which assets feed which typed nodes.

Calls show execution state, proof, closure, and continuations.

Gaps show delta from convergence over assets and collections.

Audit shows event-derived post-mortem truth.

## Realization Topology

This translation document remains shared design law under
`build_tenants/common/design/` until a concrete `odd_sdlc` tenant exists.

The first concrete tenant-local root should be:

`build_tenants/odd_sdlc/`

Expected tenant-local surfaces:

- `build_tenants/odd_sdlc/design/`
- `build_tenants/odd_sdlc/code/`
- `build_tenants/odd_sdlc/test_env/`

Promote content out of common design only when `odd_sdlc` carries real local
realization law.

## Consequences

- `genesis_sdlc` becomes migration source material and comparison pressure, not
  hidden live authority
- `odd_sdlc` becomes the first concrete ODD domain package
- method surfaces become typed assets rather than ambient project files
- execution moves to named graph-function calls over bound asset scope
- runtime truth remains attributable to ABG
- gap and convergence become operator-visible over assets and collections
