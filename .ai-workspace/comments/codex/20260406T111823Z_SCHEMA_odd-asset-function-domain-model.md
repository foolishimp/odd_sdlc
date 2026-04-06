# SCHEMA: ODD Asset Function Domain Model

**Author**: codex
**Date**: 2026-04-06T11:18:23Z
**Addresses**: ODD domain ontology; asset identity; URI fulfillment; function and binding model; operator UX
**Status**: Draft

## Summary

This post proposes the first bounded domain model for `odd_method`.

It describes the target direction, not ratified design law.

The proposal keeps asset management intentionally narrow:

- assets are identified by URI
- fulfillment starts with `file://` and `http(s)://`
- later extension to `mcp://` is allowed
- assets are typed by domain role, not by storage format
- asset types may carry deterministic evaluation, probabilistic gap evaluation,
  and probabilistic descriptive framing
- named functions operate over typed asset nodes and collections
- runtime execution occurs through calls to those functions over bound assets

The central claim is:

`odd_method` should not collapse to one hidden project-global graph. It should expose a collection of typed assets, a dependency topology over those assets, and named callable functions that materialize GTL graph functions over bound asset scope.

## Analysis

### Position

`GTL/ABG 2.x` centered more naturally on one embedded project graph with imperative iterate traversal over project-local assets.

`GTL/ABG 3.x` changes the public carrier model:

- `GraphFunction` is the public callable carrier
- one function may be called many times with different bound inputs
- each call materializes a concrete graph from those inputs
- ABG iterates that materialized graph to closure

That means `odd_method` should not model the domain as "the project graph".

It should model the domain as:

- assets
- asset types
- asset dependency topology
- named functions over typed asset nodes
- graph calls over bound asset scope

### Minimal ODD Domain Model

The first domain model should introduce these first-class objects.

#### 1. Asset

An `Asset` is the primary domain object.

It is:

- identity-bearing
- addressed by URI
- typed by domain role
- either singular or part of a collection

Fields:

- `asset_id`
- `uri`
- `kind`
- `declared_type`
- `metadata`

Examples:

- `file://specification/INTENT.md`
- `file://docs/overview.md`
- `https://example.com/product-brief.md`
- later: `mcp://github/repo/path/to/file`

#### 2. AssetType

`AssetType` names the semantic role an asset fulfills in the domain.

This is not file extension or storage encoding.

Examples:

- `intent_doc`
- `product_doc`
- `goal_set`
- `requirement_family`
- `design_doc`
- `code_package`
- `test_lane`

`AssetType` should be stronger than a simple label.

It should be allowed to carry the domain semantics needed to evaluate and
describe assets of that type.

The proposal is that each asset type may declare:

- `F_D` evaluation profile
- `F_P` gap evaluation profile
- `F_P` descriptive framing
- optional proof or closure hints

This gives the type system real semantic force without pushing all meaning
into one global evaluator or one hidden controller surface.

##### AssetType Evaluation and Description Surfaces

`F_D` evaluation profile:

- deterministic checks
- schema and shape checks
- presence / uniqueness constraints
- structural invariants

Examples:

- exactly one `intent_doc`
- requirement ids parse and are unique
- a design doc contains declared structural headings
- a bound URI fulfills to a supported retrievable asset

`F_P` gap evaluation profile:

- probabilistic semantic evaluation where deterministic checks are not enough
- domain-specific judgment of how far an asset is from convergence

Examples:

- whether a design document actually satisfies a requirement family
- whether a product document is only notes rather than a real product surface
- whether two assets are semantically redundant or inconsistent

`F_P` descriptive framing:

- type-specific semantic framing passed to constructive or evaluative
  probabilistic work
- makes the meaning of the type explicit instead of implicit in a global
  prompt

Examples:

- what an `intent_doc` is supposed to accomplish
- what counts as a sound `design_doc`
- what evidence quality is expected for a `requirement_family`

So the stronger type model becomes:

`AssetType = identity + structural role + F_D evaluation + F_P gap evaluation + F_P descriptive framing`

This keeps type semantics local and inspectable.

#### 3. AssetCollection

An `AssetCollection` is a named set of assets treated as one working scope.

Examples:

- `project_spec_surface`
- `requirements_corpus`
- `design_surface`
- `source_asset_set`

This keeps collection handling explicit without overbuilding asset management.

#### 4. AssetNode

An `AssetNode` is the typed locus used in a transformation topology.

This is the bridge from ODD domain language into GTL node language.

Examples:

- `source_assets : source_asset_collection`
- `classified_assets : classified_asset_collection`
- `structured_spec_surface : structured_spec_surface`

The key rule is:

concrete assets do not directly equal graph structure; they are bound into typed asset nodes.

#### 5. Function

The domain should use `Function` or `WorkFunction`, not `WorkOrder`.

Reason:

- the main concept is a named callable transformation
- "work order" sounds queue-like and imperative
- GTL already gives the right substrate concept in `GraphFunction`

A domain `Function`:

- has a stable identity
- declares input asset node types
- declares output asset node types
- names one callable topology law
- is realized in GTL as a `GraphFunction`

Examples:

- `import_spec_surface`
- `classify_asset_surface`
- `derive_requirement_surface`
- `reconcile_design_surface`

#### 6. AssetGraph

The `AssetGraph` is the dependency topology between typed asset nodes.

Examples:

- source assets -> classified assets -> mapped assets -> structured surface
- requirement families -> design surfaces -> proof surface

The important distinction is:

- the asset graph is the domain dependency model
- a function binds to that topology and makes it callable

So:

`AssetGraph + Function Binding = callable GraphFunction surface`

#### 7. AssetBinding

`AssetBinding` maps concrete assets or collections into typed asset nodes at call time.

Examples:

- bind folder contents to `source_assets`
- bind current `specification/requirements/` to `requirements_surface`
- bind an external URL set to `reference_material`

This is what makes the same named function reusable over different concrete scopes.

#### 8. Gap

`Gap` is the operator-facing projection of current delta from convergence.

Examples:

- required type missing
- dependency unsatisfied
- proof incomplete
- ambiguity unresolved

This is a projection concept, not the structural law itself.

#### 9. ConvergenceTarget

`ConvergenceTarget` declares what must hold for an asset or asset collection to count as converged.

Examples:

- exactly one `intent_doc`
- every requirement family mapped
- no unresolved ambiguity continuations
- declared proof lane passed

#### 10. FunctionCall

`FunctionCall` is the runtime invocation of a named function over a bound asset scope.

This maps directly onto ABG `GraphCall`.

#### 11. AssetResolver

`AssetResolver` fulfills URIs into usable domain content and metadata.

This should start small.

First supported schemes:

- `file://`
- `http://`
- `https://`

Deferred:

- `mcp://`

This is enough to get ODD running without overdesigning asset management.

### URI Fulfillment Model

The URI model should be deliberately narrow in the first lane.

#### Supported now

- `file://`
  - local file asset
- `http://` / `https://`
  - remote retrievable asset or stable external reference

#### Supported later

- `mcp://`
  - connector-backed asset fulfillment

The rule should be:

assets are identified by URI first; fulfillment is scheme-specific and domain-owned; GTL/ABG do not own URI retrieval policy directly.

### Type-Driven Evaluation Model

The domain should allow evaluation and description law to hang primarily from
`AssetType`.

That means:

- `AssetBinding` tells you which concrete asset is in scope
- `AssetType` tells you how that asset is described and evaluated
- `Function` tells you how typed assets participate in topology

This is cleaner than:

- one global evaluation table
- one hidden controller prompt
- one app-wide imperative evaluator layer

It also gives a natural place for domain-specific enrichment over time.

Examples:

- `intent_doc` may define deterministic uniqueness checks plus probabilistic
  sufficiency checks
- `design_doc` may define deterministic heading / reference checks plus
  probabilistic architectural coherence checks
- `requirement_family` may define deterministic identifier and status checks
  plus probabilistic completeness or overlap checks

The law should remain:

- asset types may declare evaluation and description hooks
- GTL function or vector declarations may reference those hooks
- ABG resolves them through declared policy and hook binding
- no hidden evaluator logic should outrank the declared type and function
  surfaces

### Mapping to GTL/ABG

The domain model should map cleanly to GTL/ABG 3.x:

- `AssetNode` -> GTL `Node`
- `Function` -> GTL `GraphFunction`
- `AssetGraph` -> GTL graph/topology template
- `AssetBinding` -> graph-call input binding
- `FunctionCall` -> ABG `GraphCall`
- `Gap` -> ABG projection / delta view
- `Continuation` -> ABG continuation truth

The runtime law then becomes:

1. bind concrete assets into typed asset nodes
2. call a named function over that bound scope
3. materialize a graph from the function and bindings
4. let ABG iterate that graph to closure
5. project gaps, proof, and continuation state back onto the assets and collections

### Operator UX Model

The proposed UX should center on six surfaces.

#### 1. Assets

List assets and collections with:

- URI
- asset type
- current gap
- convergence state

#### 2. Functions

List named functions with:

- name
- input node types
- output node types
- callable status
- last call status

#### 3. Bindings

Show which concrete assets are currently bound to which typed nodes.

This is the middle layer that explains what a function call will operate on.

#### 4. Calls

Show active and historical calls with:

- bound scope
- terminal state
- open continuations
- proof / closure state

#### 5. Gaps

Show current delta from convergence over assets and collections.

#### 6. Audit

Show post-mortem event-derived audit over calls and continuations.

This gives a clean operator view without exposing GTL internals directly as the main UX.

### Key Law

The key ODD law proposed here is:

Concrete assets are bound into typed asset nodes; named functions over those nodes materialize GTL graph functions; ABG executes the resulting calls and projects gap, proof, and closure state.

### First Slice Boundary

The first ODD slice should keep scope bounded.

Include:

- URI-identified assets
- `file://` and `http(s)://` fulfillment
- typed assets
- typed asset nodes
- named functions
- asset bindings
- function calls
- gap projection

Do not include yet:

- rich asset lifecycle management
- generalized content-addressable storage
- large metadata taxonomies
- cross-scheme sync orchestration
- MCP fulfillment beyond explicit later adoption

## Recommended Action

1. Adopt this domain object set provisionally for ODD discussion:
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

2. Treat `AssetType` as a semantic carrier, not just a label.
   It should be allowed to define:
   - deterministic evaluation
   - probabilistic gap evaluation
   - probabilistic descriptive framing
   - optional proof / closure hints

3. Write the first ratified ODD design surface under `build_tenants/.../design/` using this structure:
   - Position
   - Domain Objects
   - Asset Type Semantics
   - URI Fulfillment
   - Function and Binding Model
   - Runtime Mapping
   - UX Model
   - First Slice Boundary

4. Keep `AssetResolver` intentionally narrow in the first lane:
   - `file://`
   - `http(s)://`
   - `mcp://` deferred

5. Use `Function`, not `WorkOrder`, as the main operator term unless later review finds a stronger domain name.

6. Preserve this as commentary until its contents are explicitly adopted into specification or ratified design.
