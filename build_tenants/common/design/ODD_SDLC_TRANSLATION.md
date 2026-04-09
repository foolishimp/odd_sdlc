# ODD SDLC Translation

**Status**: Active
**Date**: 2026-04-07
**Implements**: REQ-F-UPSTREAM-001, REQ-F-UPSTREAM-002, REQ-F-UPSTREAM-003, REQ-F-GFUNC-001, REQ-F-GFUNC-002, REQ-F-GFUNC-003, REQ-F-GFUNC-004, REQ-F-GFUNC-005, REQ-F-RUNTIME-001, REQ-F-RUNTIME-002, REQ-F-RUNTIME-004, REQ-F-ASSET-001, REQ-F-ASSET-002, REQ-F-ASSET-003, REQ-F-ASSET-004
**Derives From**: `specification/INTENT.md`, `specification/PRODUCT.md`, `specification/requirements/01-upstream-adoption.md`, `specification/requirements/02-graph-functions.md`, `specification/requirements/03-runtime-governance.md`, `specification/requirements/06-bootstrap-assets-and-recursive-edges.md`

## Position

This document records the shared ODD SDLC translation law adopted beneath the
current tenant line.

The translation re-expresses the active ODD SDLC domain as:

- URI-addressed assets
- typed asset nodes
- named functions
- GTL graph functions
- ABG graph calls over bound asset scope

This shared translation document does not define the current tenant-local
software-domain package shape. The active `odd_sdlc` package surface lives
under `build_tenants/odd_sdlc/python/design/`.

The active tenant may prove these shared patterns through a bounded proving
subset, but that proving shape is tenant-local design law rather than common
present truth.

## Translation Boundary

The translation carries forward method surfaces. It does not carry forward
runtime-control baggage by default.

The translation therefore preserves:

- intent, product, goals, requirements, design, scenarios, testcase
  authority, and qualification surfaces
- explicit proving and release surfaces when present
- their domain meaning as assets and convergence targets

The translation does not presume:

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

### AssetType Semantics

`AssetType` is ratified here as a semantic library surface rather than a flat
label.

That means an asset type may carry reusable domain semantics for:

- deterministic evaluation
- probabilistic gap evaluation
- probabilistic descriptive framing
- proof and closure expectations
- compatibility with producing and consuming functions

This library direction is intentionally bounded to ODD.

GTL changes remain out of scope until ODD proves which type semantics are truly
universal and load-bearing.

The first live library should stay small and use a few composed domain types
rather than a large flat register.

### Asset Provenance And State Model

An instantiated asset without provenance and the repeated constructive events
that evolved it is not governed correctly.

`odd_sdlc` therefore adopts this state model:

- asset identity is durable
- provenance is part of the asset model
- the current visible asset surface may be mutable
- mutable assets are treated as projected checkpoints over constructive history
- immutable assets are allowed as stable imported, adopted, or published
  surfaces

This borrows the useful compromise behind CQRS without copying CQRS wholesale:

- governing history and runtime fact truth remain authoritative
- the operator usually works against the current projected checkpoint

The design implication is:

- ODD should never treat the current file contents alone as the whole truth of
  an asset
- repeated turns over one asset must remain attributable by provenance and
  runtime fact history
- mutation is allowed, but mutation without attributable history is not

### First AssetType Library

The first ODD asset-type library should begin with a small generic layer and a
small sharpened layer for the current toy.

Foundational semantic types:

- `structured_document`
- `spec_surface`
- `verification_surface`
- `authority_surface`
- `argument_surface`
- `singleton_surface`
- `collection_surface`
- `generated_surface`

Generic `odd_sdlc` library types:

- `spec_document`
- `singleton_spec_document = spec_document + singleton_surface`
- `requirement_collection_surface = spec_surface + collection_surface`
- `proof_artifact = verification_surface + authority_surface`

Current toy sharpenings:

- `intent_doc = singleton_spec_document + argument_surface + generated_surface`
- `product_doc = singleton_spec_document + generated_surface`
- `goal_surface = singleton_spec_document + generated_surface`
- `requirement_surface = requirement_collection_surface + generated_surface`
- `design_surface = spec_document`
- `scenario_bundle = structured_document + verification_surface`
- `testcase_authority_surface = structured_document + authority_surface + verification_surface`
- `proof_surface = proof_artifact`
- `release_surface = structured_document + authority_surface`

This is enough structure to prove composition without overbuilding taxonomy too
early.

## Surface Translation

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

## Executive Carrier Boundary

A tenant may publish an explicit executive graph function above internal
vectors when it needs one public carrier over a bounded subgraph.

This is not a replacement for GTL graph functions. It is one lawful way to:

- carry cumulative environment truth across a bounded subgraph
- publish an ordered vector chain for operator or service use
- bind one explicit job for a bounded constructive turn at each open call
- ingest the resulting `F_P` assessment back through ABG

The active executive carrier chosen by `odd_sdlc` is tenant-local design law,
not common present truth in this document.

## Asset Nodes

Typed asset nodes give the structural loci used in functions and graphs.

The first translation should use nodes equivalent to:

- `input_set`
- `intent_surface`
- `product_surface`
- `goal_surface`
- `requirement_surface`
- `design_surface`
- `review_assessment_surface`
- `consensus_decision_surface`
- `reviewed_design_surface`
- `scenario_surface`
- `implementation_design_surface`
- `implementation_stack_profile`
- `implementation_module_surface`
- `code_surface`
- `test_design_surface`
- `test_stack_profile`
- `test_module_surface`
- `test_run_archive_surface`
- `testcase_authority_surface`
- `release_surface`

## Function Catalog

`odd_sdlc` should publish named functions over those typed nodes.

The first catalog should include:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`
- `derive_design_surface`
- `derive_review_assessment_surface`
- `derive_consensus_decision_surface`
- `derive_reviewed_design_surface`
- `derive_scenario_surface`
- `derive_implementation_design_surface`
- `select_implementation_stack_profile`
- `derive_implementation_module_surface`
- `derive_code_surface`
- `derive_test_design_surface`
- `select_test_stack_profile`
- `derive_test_module_surface`
- `derive_test_run_archive_surface`
- `qualify_testcase_authority`
- `prepare_release_surface`

The first higher-order harness surfaces should include:

- `review_design_consensus_round`
- `review_design_by_consensus`

`review_design_consensus_round` is the isolated executable round. It proves the
typed `design -> review_assessment -> consensus_decision -> reviewed_design`
contract in one bounded lane.

`review_design_by_consensus` is the reusable higher-order carrier. It is built
from GTL `promote`, `fan_out`, `fan_in`, `gate`, and `recurse`, together with
injected review, reduction, and apply stages and explicit consensus policy.

These are domain functions.

Each is realized as a GTL `GraphFunction`.

### Bootstrap Functions

The bootstrap translation starts with the bounded upstream edges already
required on the `odd_method` line.

The first explicit bootstrap contracts are:

- `{input_set} -> {intent_surface}`
- `{input_set, intent_surface} -> {product_surface}`
- `{input_set, intent_surface, product_surface} -> {goal_surface}`
- `{input_set, intent_surface, product_surface, goal_surface} -> {requirement_surface}`

The goal surface is included in the translation because goals are a first-class
method surface on the active line.

### Downstream Functions

The first live downstream translation adds:

- `{requirement_surface} -> {feature_decomp_surface}`
- `{requirement_surface} -> {uat_testcases_surface}`
- `{requirement_surface, feature_decomp_surface} -> {design_surface}`
- `{requirement_surface, design_surface} -> {scenario_surface}`
- `{design_surface, scenario_surface} -> {implementation_design_surface}`
- `{implementation_design_surface} -> {implementation_stack_profile}`
- `{implementation_design_surface, implementation_stack_profile} -> {implementation_module_surface}`
- `{implementation_module_surface, implementation_stack_profile} -> {code_surface}`
- `{design_surface, scenario_surface} -> {test_design_surface}`
- `{test_design_surface} -> {test_stack_profile}`
- `{test_design_surface, test_stack_profile} -> {test_module_surface}`
- `{test_module_surface, test_stack_profile} -> {test_run_archive_surface}`
- `{uat_testcases_surface, scenario_surface} -> {testcase_authority_surface}`
- `{requirement_surface, design_surface, scenario_surface, code_surface, testcase_authority_surface, test_run_archive_surface} -> {release_surface}`

Later downstream translation can refine:

- `{scenario_surface} -> {testcase_authority_surface}`

These are translation targets for `odd_sdlc`. They are not yet executable
claims.

## Asset Graph

The `odd_sdlc` asset graph is the dependency topology over those nodes.

The first graph shape is:

`input_set -> intent_surface`

`input_set -> product_surface`

`input_set -> goal_surface`

`input_set + intent_surface + product_surface + goal_surface -> requirement_surface`

`requirement_surface -> feature_decomp_surface`

`requirement_surface -> uat_testcases_surface`

`requirement_surface + feature_decomp_surface -> design_surface`

`requirement_surface + design_surface -> scenario_surface`

`design_surface + scenario_surface -> implementation_design_surface`

`implementation_design_surface -> implementation_stack_profile`

`implementation_design_surface + implementation_stack_profile -> implementation_module_surface`

`implementation_module_surface + implementation_stack_profile -> code_surface`

`design_surface + scenario_surface -> test_design_surface`

`test_design_surface -> test_stack_profile`

`test_design_surface + test_stack_profile -> test_module_surface`

`test_module_surface + test_stack_profile -> test_run_archive_surface`

`uat_testcases_surface + scenario_surface -> testcase_authority_surface`

`requirement_surface + design_surface + scenario_surface + code_surface + testcase_authority_surface + test_run_archive_surface -> release_surface`

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
`build_tenants/common/design/` for cross-tenant translation concerns.

The current tenant-local root is:

`build_tenants/odd_sdlc/python/`

Expected tenant-local surfaces:

- `build_tenants/odd_sdlc/design/`
- `build_tenants/odd_sdlc/test_env/`
- `build_tenants/odd_sdlc/python/design/`
- `build_tenants/odd_sdlc/python/code/`

Tenant-local package shape, proving-lane shape, and software-domain expansion
belong in tenant-local design once they stop being common translation law.

## Consequences

- `odd_sdlc` becomes the current concrete ODD software-domain package built on
  these shared rules
- method surfaces become typed assets rather than ambient project files
- execution moves to named graph-function calls over bound asset scope
- runtime truth remains attributable to ABG
- gap and convergence become operator-visible over assets and collections
