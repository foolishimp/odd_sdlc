# odd_method Product

**Status**: Active
**Derived From**: [GOALS.md](./GOALS.md),
[INTENT.md](./INTENT.md),
`.genesis/docs/standards/SPEC_METHOD.md`
**Purpose**: Define the current product realization and product terms for
`odd_method`

## Product Position

`odd_method` is an installed outcome-driven development product.

It provides an outcome-driven development domain expressed through GTL and
executed through ABG.

`odd_sdlc` is the first live domain package on that line.

It gives a project a lawful way to declare:

- assets addressed by URI
- asset types with explicit semantic role
- asset collections and typed asset nodes
- named functions over asset graphs
- executive GTL graph functions over the function catalog
- policy over evaluation, escalation, proof, and closure
- evidence and proving lanes

It adopts a singleton constitutional specification together with a standard
project-owned realization topology rooted in `build_tenants/`.

## Product Terms

### Outcome-Driven Development

A graph-native development method where declared outcomes and lawful transitions
govern delivery, evidence, and repricing.

### Outcome

A declared product state that has explicit meaning and explicit closure
expectations.

### Asset

A named durable surface of product truth or produced delivery state.

An asset is not governed correctly as an isolated payload.

An asset carries:

- URI identity
- semantic type
- provenance
- current convergence context

The current materialized form of an asset may be mutable, but mutable assets are
treated as current checkpoints over a constructive history rather than as
context-free blobs.

### Asset Type

The semantic role an asset fulfills in the domain.

An asset type may carry deterministic evaluation, probabilistic gap
evaluation, probabilistic descriptive framing, and proof or closure hints.

Asset types are semantic library surfaces, not flat labels.

### Asset Collection

A named working set of assets treated as one bound scope.

### Asset Node

A typed locus in the domain topology that receives one asset or one asset
collection binding.

### Asset Graph

The dependency topology over typed asset nodes.

### Asset Binding

The mapping from one concrete asset or asset collection into one typed asset
node at function-call time.

### Mutable Asset

An asset whose current materialized form may be rewritten as work converges.

Mutable assets are governed through provenance and constructive history.

### Immutable Asset

An asset whose content is treated as fixed once adopted, imported, or published.

Immutable assets serve as stable references, evidence, or snapshots.

### Asset Projection

The current visible checkpoint of an asset derived from its governing history.

ODD may borrow from CQRS here:

- runtime and constructive history are authoritative for governance
- the current materialized asset surface is the projected checkpoint operators
  usually edit or inspect

### Requirement Family Surface

The folderized asset surface rooted at `specification/requirements/` that
carries live requirement truth as separate family files.

### Graph Function

The executable constructive carrier over declared graph contracts.

### Function

The domain-level named callable transformation over typed asset nodes.

A domain function is realized as a GTL `GraphFunction`.

### Input Set

A bounded set of imported or authored source surfaces supplied to a graph
function boundary.

### Runtime Fact

An event or equivalent substrate truth emitted by ABG during traversal and
execution.

### Policy Surface

A declarative configuration surface that constrains evaluation, escalation,
worker/backend selection, or closure expectations without redefining graph law.

### Gap

The projected delta from convergence for one asset, asset collection, or
function boundary.

### Convergence Target

The declared condition under which one asset or asset collection counts as
converged.

### Dedicated Release

A release cut derived for one bounded operator, customer, team, or context from
an existing application line.

A dedicated release preserves provenance to the governing product line while
opening a lawful surface for local tuning, repricing, and deployment.

## Goal Model

`GOALS.md` focuses one bounded wave of work.

Goals orient current repricing and bootstrap activity.

Intent sets direction.

Product defines the current realization being built.

Requirements then decompose that product realization into constitutional truth.

## Product End State

The intended end-state product shape is:

1. install `odd_method` clean as a GTL/ABG-native product
2. author project-owned intent, product, and requirements surfaces
3. maintain project-owned realization structure beneath `build_tenants/`
4. keep design under `build_tenants/common/design/` or a tenant-local
   `build_tenants/<tenant>/design/` root rather than under `specification/`
5. keep shared bootstrap realization law in `build_tenants/common/` until real
   tenant-local divergence appears
6. publish graph functions and lawful higher-order compositions directly over
   GTL
7. execute through ABG without a product-local shadow runtime
8. prove capability claims through written scenario bundles and installed-dev
   qualification
9. accept a bounded request against a new or existing application and gate it
   before execution work opens
10. run the full ODD SDLC from the gated request through release preparation
    and deployment
11. derive dedicated releases from existing application lines so one operator,
    customer, or team can tune the resulting application to local taste

## Current Product Definition

The current product definition of `odd_method` is:

- a fresh constitutional line
- an outcome-driven development product
- lightweight by design
- graph-function-first in execution
- centered on assets, asset types, asset graphs, and named functions
- beginning from an explicit bootstrap asset set and recursive edge contracts
- subordinate to GTL and ABG for runtime substrate truth
- standardized on the `build_tenants/` realization model from bootstrap
- carrying `odd_sdlc` as the first live tenant package
- publishing a top-level executive GTL graph function over the current toy subgraph
- explicit in adoption of any carried-forward truth

The current asset graph proven in the toy sandbox for `odd_sdlc` is:

- `{input_set} -> {specification/INTENT.md}`
- `{input_set, specification/INTENT.md} -> {specification/PRODUCT.md}`
- `{input_set, specification/INTENT.md, specification/PRODUCT.md} -> {specification/GOALS.md}`
- `{input_set, specification/INTENT.md, specification/PRODUCT.md, specification/GOALS.md} -> {specification/requirements/}`
- `{specification/requirements/} -> {build_tenants/common/design/20-generated-feature-decomp.md}`
- `{specification/requirements/} -> {specification/scenarios/20-generated-uat-testcases.md}`
- `{specification/requirements/, build_tenants/common/design/20-generated-feature-decomp.md} -> {build_tenants/common/design/30-generated-odd-design.md}`
- `{specification/requirements/, build_tenants/common/design/30-generated-odd-design.md} -> {specification/scenarios/40-generated-scenarios.md}`
- `{specification/scenarios/20-generated-uat-testcases.md, specification/scenarios/40-generated-scenarios.md} -> {specification/scenarios/30-generated-testcase-authority.md}`
- `{build_tenants/common/design/30-generated-odd-design.md, specification/scenarios/40-generated-scenarios.md} -> {build_tenants/odd_sdlc/python/design/40-generated-test-design.md}`
- `{build_tenants/odd_sdlc/python/design/40-generated-test-design.md} -> {build_tenants/odd_sdlc/python/test_env/40-generated-test-stack.md}`
- `{build_tenants/odd_sdlc/python/design/40-generated-test-design.md, build_tenants/odd_sdlc/python/test_env/40-generated-test-stack.md} -> {build_tenants/odd_sdlc/python/test_env/tests/40-generated-test-modules.md}`
- `{build_tenants/odd_sdlc/python/test_env/tests/40-generated-test-modules.md, build_tenants/odd_sdlc/python/test_env/40-generated-test-stack.md} -> {build_tenants/odd_sdlc/python/test_env/50-generated-run-archive.md}`
- `{specification/requirements/, build_tenants/common/design/30-generated-odd-design.md, specification/scenarios/40-generated-scenarios.md, specification/scenarios/30-generated-testcase-authority.md, build_tenants/odd_sdlc/python/test_env/50-generated-run-archive.md} -> {docs/40-generated-release.md}`

The current top-level executive graph function over that subgraph is:

- `bootstrap_release_self_test`

It acts as the current runtime authority above the leaf asset functions:

- it carries cumulative environment truth from `input_set` through
  `release_surface`
- it materializes the current ordered internal vectors for bootstrap, recursive
  test, authority, and release work
- one explicit job binds to that executive carrier and drives the bounded
  constructor turn for each open call
- it ingests the resulting F_P assessment back through ABG
- it stops only when the current toy subgraph converges at `release_surface`

The tenant still exposes a machine-readable `bootstrap_release_self_test`
program surface, but that surface is a projection of the executive graph
function rather than an app-owned controller with independent authority.

The current build focus is to establish the first real `odd_sdlc` tenant slice:

- publish the first asset-typed function catalog
- bind workspace assets by URI
- execute the first bootstrap-plus-fanout dependency chain through ABG
- prove the resulting runtime facts by post-mortem audit

The current canonical bootstrap-plus-fanout subgraph proven in the toy sandbox is:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`
- `derive_design_surface`
- `derive_scenario_surface`
- `derive_test_design_surface`
- `select_test_stack_profile`
- `derive_test_module_surface`
- `derive_test_run_archive_surface`
- `qualify_testcase_authority`
- `prepare_release_surface`
