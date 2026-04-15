# LLM ODD Product Design Guide

**Status**: Active supporting documentation
**Audience**: LLM-first design and build orientation, human second
**Purpose**: Give an LLM or designer the minimum correct mental model for
authoring new ODD products that follow the same GTL graph-function discipline as
`odd_sdlc`
**Primary Use**: Read this before designing a new ODD domain package, repricing
an imperative prototype into GTL, or asking an LLM to propose product structure
**Canonical Reference Product**: `odd_sdlc`
**Keep Subordinate To**:
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/02-graph-functions.md`
- `specification/requirements/07-asset-typing-and-binding.md`
- `build_tenants/common/design/adrs/ADR-002-graph-function-first-carrier-and-runtime-boundary.md`
- `build_tenants/common/design/adrs/ADR-006-abg-runtime-and-odd-query-plugin-boundary.md`
- `build_tenants/python/code/odd_sdlc/gtl_module.py`
- `build_tenants/python/code/odd_sdlc/function_catalog.py`
- `build_tenants/python/code/odd_sdlc/query.py`
- `/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`

## 1. Position

Use `odd_sdlc` as the canonical reference implementation for how an ODD
product should be shaped.

The point is not to copy SDLC-specific asset names.

The point is to copy the structural law:

1. define typed domain assets and nodes
2. publish explicit named graph functions over those nodes
3. bind those functions into a GTL module as the operative carrier
4. expose current state through projection and query without replacing ABG
   runtime truth

If a new domain keeps its semantic chain in prose but leaves constructive work
inside product-local scripts or loops, it is not following the `odd_sdlc`
pattern yet.

## 2. What An ODD Product Is

An ODD product is a configured domain product over GTL and ABG.

The stable app boundary is:

```text
App
= Bootstrap Surface
+ Initialization Surface
+ Domain Configuration
+ GTL Program Surface
+ Policy Hook Bindings
+ ABG Runtime
+ Projection / Audit Surface
+ Proof Surface
```

Read the ownership split strictly.

### Specification

`specification/` is the only authoritative `WHAT`.

It defines:

- intent
- product position
- goals
- requirements
- scenarios

### Realization

`build_tenants/` is `HOW`.

It carries:

- design
- code
- tests
- GTL publications
- tenant-local proving surfaces

### ABG

ABG owns:

- traversal
- execution
- raw runtime facts
- runs
- graph calls
- frames
- continuations
- lineage and provenance

### ODD Domain Product

The ODD product owns:

- domain semantics
- asset meaning
- function meaning
- policy surfaces
- gap and closure interpretation
- query overlays over domain state

### Orchestration Or Service Layers

Service layers may own:

- sessions
- workers
- routing
- transport
- browser-safe observation

They do not own runtime truth.

Do not invent a shadow runtime beneath the word "service".

## 3. Non-Negotiable Structural Law

Any new ODD product should satisfy all of the following.

### 3.1 Singleton Constitutional Authority

There is one authoritative specification stack.

Do not split semantic truth between:

- prompt lore
- code comments
- local notebooks
- UI payload shapes
- an undocumented service layer

### 3.2 Typed Assets And Typed Nodes

An ODD product does not work over an unnamed project blob.

It works over:

- assets with URI identity
- asset types with semantic meaning
- typed asset nodes
- explicit bindings from concrete assets into those nodes

When an asset is a real produced or consumed boundary, declare its
`asset_surface` truth:

- `kind`
- `required_contexts`
- `standards_refs`
- `output_contract_refs`

### 3.3 Graph Functions Are The Primary Constructive Carrier

Every operative constructive step should be carried by:

- one named `GraphFunction`, or
- one lawful graph-function composition

Do not invent a second executor such as:

- a hidden imperative runner
- a product-local pipeline engine
- ad hoc Python loops that remain the real carrier

Work vectors may exist, but they are productization over graph functions, not a
separate runtime.

### 3.4 The Function Catalog Must Be Explicit

The live line must publish a machine-readable graph-function catalog.

At minimum, each published function must expose:

- name
- inputs
- outputs
- intent
- whether it is a public carrier, a reusable helper, or a higher-order harness

If the catalog only exists in prose or prompt memory, the line is under-built.

### 3.5 The GTL Module Is The Operative Publication Surface

The product must publish:

- the public graph-function carriers
- the materialized graph or graphs
- lawful traversal boundaries such as `RefinementBoundary` or
  `CandidateFamily`
- semantic jobs bound to the outer public carrier

Do not bind jobs directly to hidden internal vectors.

Do not publish a public carrier without publishing the traversable structure ABG
needs to execute it.

### 3.6 Cumulative Environment Law

Do not model composition as "the last output feeds the next input".

The real law is:

- each `GraphFunction` declares `environment.requires`
- each `GraphFunction` declares `environment.provides`
- each `GraphFunction` declares `environment.carries`
- later steps may require any binding available in the cumulative environment

That means a late function may still require upstream bindings such as:

- input set
- requirements
- design

The environment is cumulative, typed, and replay-visible.

### 3.7 Query Is A Projection Over Constructive History

Visible current state is a projection.

It is not a replacement for runtime truth.

The domain query lane may expose:

- asset views
- asset type meaning
- function catalog views
- checkpoint and provenance overlays
- gap and closure overlays

It must not redefine:

- run
- graph call
- continuation
- frame
- raw event truth

Those remain ABG-native.

### 3.8 Gap Handling Re-Enters The Constitutional Chain

An ODD product is not only a forward generator.

It must support lawful return through:

- observation
- triage
- route selection
- explicit re-entry
- constitutional repricing when needed

Do not collapse all mismatch into direct code repair.

## 4. What To Copy From odd_sdlc Exactly

Copy these patterns.

### 4.1 Copy The Structural Pattern, Not The Nouns

Do not copy `odd_sdlc` asset names into another domain.

Do copy:

- typed semantic assets
- explicit typed nodes
- named graph functions
- published GTL module carriers
- machine-readable function catalog
- projection-based query surface

### 4.2 Keep Public Carriers Explicit

`odd_sdlc` proves that graph functions are not decorative wrappers.

They are the public constructive carrier.

A new domain should therefore expose public names such as:

- `trace_source_observations`
- `assure_attribute_claims`
- `materialize_attribute_ledger`
- `project_markov_object_cut`
- `publish_domain_artifact`
- `compose_world_model`

Those names are illustrative.

The requirement is the callable pattern, not the exact vocabulary.

### 4.3 Keep Deterministic Materialization Separate From Semantic Derivation

If the domain has deterministic record materialization, keep it explicit.

Use deterministic lanes for things like:

- record assembly
- structural validation
- cheap trustworthy checks
- output packaging

Use GTL constructive carriers for semantic work such as:

- derivation
- synthesis
- review
- promotion
- composition

Do not expand a deterministic helper into a rival runtime.

### 4.4 Keep Query Projection-Based

The current visible state should be understandable as:

- current checkpoint
- current provenance
- current closure posture

without pretending prior constructive turns never happened.

## 5. Design Procedure For A New ODD Domain

If you are designing a new domain, follow this order.

### 5.1 Define The Semantic Chain First

Start by naming the real domain chain from imported or authored source to
published domain outcomes.

Example shape:

```text
source -> trace -> assurance -> ledger -> object cut -> published artifact -> composed model
```

Do not start with:

- UI screens
- API routes
- background workers
- filesystem layout

Those are downstream.

### 5.2 Define Asset Families And Node Contracts

For each major stage, define:

- asset family name
- URI identity policy
- asset type meaning
- mutable or immutable status
- provenance expectation
- `asset_surface.kind`
- `asset_surface.required_contexts`
- `asset_surface.standards_refs`
- `asset_surface.output_contract_refs`

The design question is:

"What typed truth exists at this boundary, and what context must lawfully travel
with it?"

### 5.3 Define Named Graph Functions Over That Chain

For each lawful transition, publish:

- function name
- semantic intent
- typed inputs
- typed outputs
- carried environment
- whether it is public, helper, higher-order, or recursive

The function name should describe the domain act, not the implementation
mechanism.

Prefer names like:

- `derive_design_surface`
- `qualify_testcase_authority`
- `publish_domain_artifact`

Avoid names like:

- `run_step_3`
- `process_data`
- `pipeline_main`

### 5.4 Publish One Outer Carrier For Live Work

The general publication shape is:

1. author leaf or mid-level graph functions with explicit environments
2. compose them into one public executive carrier where appropriate
3. materialize the executive graph
4. publish traversal truth through `Module.graphs`
5. publish `RefinementBoundary` or `CandidateFamily` for live internal vectors
6. bind semantic `Job` contracts to the outer public carrier

This is the point where many prototypes fail.

If the real execution still depends on a handwritten runner, the GTL line is
not finished.

### 5.5 Split F_D, F_P, And F_H Correctly

Use the execution lanes deliberately.

`F_D` is for:

- deterministic checks
- deterministic record materialization
- structural verification
- cheap trustworthy readiness tests

`F_P` is for:

- constructive semantic work
- synthesis
- review
- promotion
- composition

`F_H` is for:

- escalation
- approval
- governance intervention

Do not hide `F_P` inside `F_D`.

Do not use `F_H` as a general-purpose operator patch channel.

### 5.6 Define Query And Projection Surfaces

Define what current state the domain should expose.

Usually that includes:

- current assets
- current asset families
- current bindings
- current function catalog
- current gaps
- current closure posture
- current checkpoint and provenance overlays

Keep the boundary clean:

- ABG exposes runtime truth
- the domain exposes semantic read models

### 5.7 Define Proof And The First Proving Slice

Do not attempt whole-product completion first.

Choose one proving slice that forces the full structural law to exist:

- typed assets
- named graph functions
- published module
- query/projection
- proof lane

If one bounded slice cannot be carried end to end under GTL/ABG, the larger
design is still only aspirational.

## 6. What A Designer Should Produce

A good first-pass ODD design packet should contain all of the following.

### 6.1 Product Statement

- what domain outcome the product governs
- what the installed product is
- what the released product is
- what the builder or workspace role is

Keep those distinct.

Do not collapse:

- released product
- install
- builder project
- runtime session

### 6.2 Semantic Chain

- ordered asset chain
- transition names
- closure expectations at each stage

### 6.3 Asset Model

- asset families
- asset types
- URI model
- mutability and projection posture
- asset-surface contracts

### 6.4 Function Catalog

- public graph functions
- helper graph functions
- higher-order harnesses
- recursive carriers if any
- input and output node types
- environment contracts

### 6.5 Module Publication Plan

- public jobs
- module graphs
- refinement boundaries
- candidate families
- selection visibility rules

### 6.6 Query Plan

- domain query views
- current checkpoint views
- provenance overlays
- gap and closure views
- explicit runtime/domain boundary

### 6.7 Proof Plan

- proving scenarios
- deterministic checks
- closure evidence
- what counts as convergence

If the design packet cannot yet answer one of those sections, the missing
section is a real design gap.

## 7. Anti-Patterns

Reject these patterns when designing a new ODD product.

### 7.1 Imperative Shadow Runners

The docs describe graph functions, but actual work still happens inside:

- one custom executive loop
- one product-local iterator
- one hidden orchestration function

That is not GTL-native.

### 7.2 Hidden Global Graphs

The product talks about assets, but call sites still assume:

- ambient filesystem knowledge
- unnamed project-global graph shape
- implicit upstream availability

Bindings must be explicit.

### 7.3 Output-Piping-Only Composition

If composition assumes only "last output becomes next input", the design is too
weak.

Late steps often need older bindings.

Design for cumulative environment.

### 7.4 Query Surfaces That Recreate Runtime Truth

Do not build one monolithic observer payload that quietly duplicates ABG.

Use domain query as overlay, not runtime replacement.

### 7.5 Direct Repair Instead Of Lawful Re-Entry

Do not jump from observed mismatch directly to code edits.

The lawful chain is:

```text
observation -> triage -> route -> re-entry -> renewed forward derivation
```

### 7.6 Copying odd_sdlc Vocabulary Instead Of Pattern

Another domain should not rename its concepts until they look like SDLC.

Keep the domain's own nouns.

Copy the structure.

## 8. Prompt Contract For An LLM Designer

When you ask an LLM to design an ODD product, require it to answer these
questions explicitly.

1. What is the product's semantic chain from source to published outcome?
2. What are the typed asset families and node contracts?
3. What are the named public graph functions?
4. What cumulative environment must each function require, provide, and carry?
5. What GTL module, jobs, and traversal boundaries will be published?
6. What remains deterministic `F_D`, what is constructive `F_P`, and what is
   escalated `F_H`?
7. What query surfaces expose current checkpoints and provenance without
   replacing ABG runtime truth?
8. What is the first proving slice that demonstrates the full law?

If the LLM cannot answer those eight questions, it has not designed the product
yet.

## 9. Cross-Domain Example Reading

Use these reference readings together.

### odd_sdlc

Read `odd_sdlc` for the canonical structural law:

- typed assets and nodes
- graph-function-first execution
- explicit function catalog
- GTL module publication
- projection-based query

### odd_domain Strategy

Reference:
`/Users/jim/src/apps/odd_domain/.ai-workspace/comments/codex/20260416T000013Z_STRATEGY_odd-domain-gtl-basis-from-odd-sdlc-review.md`

Read the `odd_domain` strategy note for the correct carryover rule:

- keep the new domain's own semantic chain
- do not copy SDLC asset names
- re-express the domain as typed GTL graph functions
- keep deterministic record materialization distinct from GTL constructive work

### abiogenesis Builder Guide

Reference:
`/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`

Read the GTL app builder guide for:

- app boundary
- cumulative environment law
- module publication shape
- runtime environment resolution
- higher-order and recursive carrier patterns

## 10. Bottom Line

For a new ODD product, the deliverable is not "some code that seems aligned".

The deliverable is:

- one lawful semantic chain
- one typed asset model
- one explicit graph-function catalog
- one published GTL module
- one clean ABG runtime boundary
- one projection/query surface over constructive history
- one explicit proof and closure posture

`odd_sdlc` is the reference because it proves that shape.

Future domains should keep their own nouns and outcomes, but they should follow
the same structural law.
