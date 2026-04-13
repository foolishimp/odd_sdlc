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

`odd_sdlc` is the first live domain package on that line and the current
software-domain package under build-out.

`odd_service` is the next incubating product line on that same method line.
It is not a second runtime. It is the proposed enduring orchestration plane
above `odd_sdlc` and below peer clients such as CLI agents and `odd_manager`.

It gives a project a lawful way to declare:

- assets addressed by URI
- asset types with explicit semantic role
- asset collections and typed asset nodes
- named functions over asset graphs
- executive GTL graph functions over the function catalog
- a governed SDLC worksite lifecycle over request, specification, design,
  implementation, qualification, release, deployment, runtime return, and
  retrofit work
- explicit technology capability and execution contracts for test execution,
  deployment, CI/CD, and runtime return where those stages are in scope
- explicit software work acts and operational-return evidence with attributable
  provenance
- deterministic install-and-normalize behavior over imported or stale workspaces
- policy over evaluation, escalation, proof, and closure
- evidence and proving lanes
- an orchestration/service boundary for session lifecycle, worker registry,
  dispatch routing, and client-safe observation that remains subordinate to ABG
  runtime truth

It adopts a singleton constitutional specification together with a standard
project-owned realization topology rooted in `build_tenants/`.

`specification/` defines the governing `WHAT`.

`build_tenants/` carries one or more realization instances of `HOW`.

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

### Technology Capability Asset

A tenant-local realization asset that declares the executable technology
dependency required for a side-effecting edge.

Examples include:

- build tools and test runners
- deployment contracts
- environment contracts
- runtime-return channels

Without the required capability asset, an executional or operational edge may
not converge.

### Requirement Closure Register

A machine-readable governed asset that records the live requirement inventory,
its current closure state, and the current code and test evidence that justifies
that state.

The requirement closure register exists so unresolved constitutional work
remains active future pressure across iterations rather than disappearing after
one bounded wave.

### Trace Authority

The explicit requirement and design references carried by generated source files
and generated test files.

At minimum this includes:

- `Implements:` tags for generated source files
- `Validates:` tags for generated test files

Where file-level ownership is too coarse, the active build tenant may extend
this to finer-grained function or symbol-level trace anchors.

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

### Orchestration Plane

A service-owned coordination layer above domain graph functions and below
clients.

An orchestration plane may own:

- session lifecycle
- worker registry
- transport execution
- async dispatch routing
- observation-friendly client APIs

It does not own run truth, convergence, or provenance.

### Service Session

A reconnectable service-owned coordination record around one workspace and one
ABG run.

A service session may track worker assignments, client subscriptions, and
dispatch state, but it does not replace ABG runtime facts.

### Worker Registry

A service-owned directory of named local or remote workers that can satisfy
declared dispatch contracts.

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

### Software-Domain Package

A realization that governs software-delivery work over explicit SDLC assets,
typed graph edges, and runtime-returned operational evidence.

### Worksite Lifecycle

The governed software-domain cycle of request, gate, specify, design,
implement, qualify, release, deploy, observe, return, retrofit, and relaunch.

The project is therefore treated as an active worksite rather than as a
generate-once surface tree.

Executional or operational stages inside that lifecycle are conditional on the
declared technology capability of the active build-tenant realization.

### Software Work Act

A provenance-bearing constructive act over software-domain assets.

The first lawful act classes include generated, adopted, imported, repaired,
retrofitted, released, deployed, and returned work.

### Runtime Return

Operational evidence that comes back from execution, qualification, deployment,
or live use into the governed SDLC line.

Runtime return is a first-class domain input, not commentary outside the graph.

## Goal Model

`GOALS.md` focuses one bounded wave of work.

Goals orient current repricing and bootstrap activity.

Intent sets direction.

Product defines the current realization being built.

Requirements then decompose that product realization into constitutional truth.

## Product End State

The intended end-state product shape is:

This section describes the `odd_method` source repository as the product under
development.

The source-repository realization rules below do not redefine downstream
installed-workspace topology. Downstream project topology is governed
separately by `REQ-F-ODDSDLC-032`.

Downstream installed workspaces are governed separately by
`REQ-F-ODDSDLC-032`: their constitutional `WHAT` remains under
`specification/`, their project-owned realization `HOW` lands under
`build_tenants/<tenant>/`, and released `odd_sdlc` runtime/software remains
under `.odd_sdlc/`.

1. install `odd_method` clean as a GTL/ABG-native product
2. author project-owned intent, product, and requirements surfaces
3. maintain project-owned realization structure beneath `build_tenants/`
4. within the `odd_method` source repository, keep design under
   `build_tenants/common/design/` or a tenant-local
   `build_tenants/<tenant>/design/` root rather than under `specification/`
5. within the `odd_method` source repository, keep shared bootstrap
   realization law in `build_tenants/common/` until real tenant-local
   divergence appears
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
12. support an enduring orchestration plane that can coordinate named workers,
    browser observation, and reconnectable sessions over the same GTL/ABG and
    `odd_sdlc` execution law used by direct local CLI execution
13. bring runtime-returned evidence back into the governed SDLC line as lawful
    input to repair, retrofit, repricing, and maintenance-release work
14. relaunch through the same governed line rather than treating release as the
    end of the project

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
- carrying `odd_sdlc` as the first live software-domain realization
- repricing `odd_sdlc` from the current first-slice bootstrap toy into the
  generic software-domain package on the line
- treating an ODD project as an active SDLC worksite with build, qualify,
  launch, return, retrofit, and relaunch acts
- expanding the first-slice asset model toward request, implementation,
  qualification, release, deployment, runtime-return, and maintenance assets
- moving toward explicit per-edge transform dependency, configured `F_P`, and
  layered `F_D` as domain law
- keeping the current bootstrap-to-release toy subgraph as a proving subset
  rather than the whole software-domain definition
- publishing a top-level executive GTL graph function over the current toy subgraph
- publishing reusable higher-order graph-function harnesses as ordinary GTL
  carriers rather than as hidden product-local engines
- able to install itself into an imported workspace and normalize the canonical
  bootstrap surfaces it needs for operation
- incubating `odd_service` as the next product line for orchestration,
  session, worker, and client coordination above `odd_sdlc`
- explicit in adoption of any carried-forward truth

The currently proven bounded subset for `odd_sdlc` is the bootstrap-to-release
chain over:

- intent
- product
- goals
- requirements
- feature decomposition and UAT testcase fan-out
- design and scenario fan-out
- bounded implementation recursion
- bounded test recursion
- testcase authority
- release preparation

The exact tenant-local file layout, proving paths, and package names for that
subset are realization `HOW` and belong under `build_tenants/`.

The current top-level executive graph function over that subgraph is:

- `bootstrap_release_self_test`

The current reusable consensus graph-function surfaces are:

- `review_design_consensus_round`
- `review_design_by_consensus`

It acts as the current runtime authority above the leaf asset functions:

- it carries cumulative environment truth from `input_set` through
  `release_surface`
- it materializes the current ordered internal vectors for bootstrap, recursive
  implementation, recursive test, authority, and release work
- one explicit job binds to that executive carrier and drives the bounded
  constructor turn for each open call
- it ingests the resulting F_P assessment back through ABG
- it stops only when the current toy subgraph converges at `release_surface`

The tenant still exposes a machine-readable `bootstrap_release_self_test`
program surface, but that surface is a projection of the executive graph
function rather than an app-owned controller with independent authority.

The consensus surfaces establish the first higher-order harness pattern:

- `review_design_consensus_round` is the isolated executable round over
  `design_surface -> review_assessment_surface -> consensus_decision_surface -> reviewed_design_surface`
- `review_design_by_consensus` is the reusable higher-order carrier over GTL
  `promote`, `fan_out`, `fan_in`, `gate`, and `recurse`
- the harness publishes its outer contract and injected review/reduce/apply
  stages as graph-function declaration truth
- the same higher-order shape is intended to be reusable later for schema,
  DQ-rules, release, and other review-governed subject assets

The current build focus is to reprice the first real `odd_sdlc` realization slice
into the generic software-domain package:

- ratify the software-domain doctrine and worksite lifecycle
- expand the asset and provenance model beyond the bootstrap toy
- replace placeholder implementation, release, and archive assumptions with
  governed target binding and evidence truth
- keep the proven bootstrap-plus-fanout chain as the first bounded proving
  subset while the fuller domain is built out

The current canonical bootstrap-plus-fanout subgraph proven in the toy sandbox is:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`
- `derive_design_surface`
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
