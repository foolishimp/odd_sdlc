# odd_sdlc Software-Domain Buildout

**Status**: Active
**Date**: 2026-04-08
**Implements**: REQ-F-ODDSDLC-009, REQ-F-ODDSDLC-010, REQ-F-ODDSDLC-011, REQ-F-ODDSDLC-012, REQ-F-ODDSDLC-013, REQ-F-ODDSDLC-014, REQ-F-ODDSDLC-015, REQ-F-ODDSDLC-016, REQ-F-ODDSDLC-017, REQ-F-ODDSDLC-018, REQ-F-ODDSDLC-019, REQ-F-ODDSDLC-020, REQ-F-ODDSDLC-021, REQ-F-ODDSDLC-022, REQ-F-ODDSDLC-023, REQ-F-ODDSDLC-024, REQ-F-ODDSDLC-025, REQ-F-ODDSDLC-026, REQ-F-ODDSDLC-029, REQ-F-ODDSDLC-030, REQ-F-ODDSDLC-031
**Derives From**: `specification/PRODUCT.md`, `specification/requirements/03-runtime-governance.md`, `specification/requirements/07-asset-typing-and-binding.md`, `specification/requirements/08-odd-sdlc-first-slice.md`, `specification/requirements/10-odd-sdlc-software-domain-buildout.md`, `build_tenants/common/design/ODD_SDLC_TRANSLATION.md`

## Position

`odd_sdlc` is no longer treated only as the first executable realization slice.

It is built out as the generic software-domain package on the `odd_method`
line.

The already-proven bootstrap-to-release chain remains important, but it is a
bounded proving subset rather than the whole domain definition.

This build-out is treated as a transformation wave under the live spec method.
Mixed realization state may exist while the wave is in flight, but the landing
state is one operative software-domain model. First-slice-only operative paths
do not remain as ambient legacy behavior.

The design direction is:

- keep GTL graph functions as the execution carrier
- keep ABG as runtime-truth authority
- keep software-domain semantics in tenant law
- build out the software lifecycle as governed assets and graph edges rather
  than as a narrative around placeholder surfaces
- delete superseded placeholder code paths and process assumptions when the new
  operative model is ready unless they are explicitly retained as compatibility
  features

## Migration And Legacy Boundary

The first `odd_sdlc` slice is prior operative source material for this wave.

It remains useful for:

- proving the GTL/ABG carrier
- preserving early tenant facts in version control and test evidence
- supplying bounded subset behavior while the transformation is incomplete

It does not remain lawful as a passive legacy model.

When the wave lands:

- placeholder implementation, archive, release, and process defaults are
  removed
- first-slice-only traversal assumptions are removed
- inherited material survives only if explicitly re-adopted into the current
  software-domain design
- compatibility behavior, if any, is named, justified, bounded, and tested as
  a current feature

Retained from the first slice into the current active surface:

- the machine-readable catalog and query contract
- the executive GTL carrier over the proving subset
- install-and-normalize behavior for imported workspaces
- the reusable consensus harness and its proof lane

These remain active only because they are intentionally re-adopted here.

## Domain Boundary

`odd_sdlc` governs software-delivery work.

Its subject is:

- requests for software work
- governing specification and design
- implementation realization
- qualification and proof
- release and deployment
- runtime-returned operational evidence
- repair, retrofit, and relaunch

It is intentionally generic at the software-domain layer.

Language-, framework-, and platform-specific behavior belongs in profiles,
bindings, and specialized deterministic authorities rather than in the core
software-domain model.

## Worksite Lifecycle

The tenant-local lifecycle is:

1. request
2. gate
3. specify
4. design
5. implement
6. qualify
7. release
8. deploy
9. observe
10. return
11. retrofit
12. relaunch

This means:

- release is not terminal project completion
- runtime-returned evidence is a first-class governed input
- maintenance work remains inside the same constitutional and runtime line
- executional and operational stages are capability-gated rather than assumed
- when execution capability is absent, lawful closure occurs at the last
  satisfied construction boundary rather than through false operational
  convergence

## Asset Families

The first-slice shared translation already covers bootstrap, design,
implementation, qualification, and release surfaces.

The software-domain build-out expands that into these minimum family groups:

- request and gate assets
- specification and design assets
- implementation profile and implementation asset surfaces
- build and packaging artifacts
- technology-capability and execution-contract assets
- qualification design, testcase-authority, run, and report assets
- release and deployment assets
- runtime observation and incident or gap assets
- retrofit and maintenance-release assets

Representative live asset families for the build-out are:

- `request_surface`
- `gate_decision_surface`
- `intent_surface`
- `product_surface`
- `goal_surface`
- `requirement_surface`
- `design_surface`
- `review_surface`
- `implementation_design_surface`
- `implementation_profile_surface`
- `execution_capability_surface`
- `deployment_contract_surface`
- `runtime_return_contract_surface`
- `implementation_module_surface`
- `implementation_asset_surface`
- `build_artifact_surface`
- `test_design_surface`
- `test_module_surface`
- `test_run_surface`
- `test_report_surface`
- `testcase_authority_surface`
- `release_surface`
- `deployment_surface`
- `runtime_observation_surface`
- `incident_or_gap_surface`
- `retrofit_plan_surface`
- `maintenance_release_surface`

The exact file layout for those surfaces remains tenant-local realization law.
Their existence and graph role is the design commitment.

## Reusable Workflow Forms Over Typed Asset Lanes

`odd_sdlc` keeps graph-function workflow forms reusable while preserving typed
asset distinction.

This means structurally similar workflow forms may be instantiated over
different software-domain lanes, for example:

- implementation design -> implementation module -> code
- test design -> test module -> test code or archive
- release -> deployment -> runtime observation

The reusable form is not the asset identity.

Each instantiated lane still carries its own:

- typed assets
- evaluator contracts
- output contracts
- stack profile or transform profile
- technology capability dependencies where side effects are involved

## Work Acts And Provenance

The build-out ratifies explicit software work acts:

- `generated`
- `adopted`
- `imported`
- `repaired`
- `retrofitted`
- `validated`
- `released`
- `deployed`
- `observed`
- `returned`

These are not commentary labels.

They are part of how software-domain assets remain attributable through:

- asset identity
- current checkpoint
- constructive history
- runtime-returned evidence

This design therefore rejects silent equivalence between:

- freshly generated implementation
- imported implementation
- adopted implementation
- repaired implementation

They may converge to the same target role, but they do not have the same
provenance.

## Edge Contract Model

Each `odd_sdlc` edge is designed as an explicit traversal contract.

The minimum contract surface is:

- source asset set
- target asset
- transform dependency or transform profile
- technology capability dependency where execution, deployment, or runtime
  interaction is implied
- preflight `F_D`
- configured `F_P`
- postflight `F_D`
- optional `Capability F_D`
- optional `F_H`
- work-report contract
- proof policy
- closure policy

This design keeps the graph explicit while allowing generic software-domain
traversal to stay mostly constructive rather than overfitted to deterministic
checks.

## Capability-Gated Operational Convergence

Construction and operational convergence are not the same thing.

Constructional lanes may converge over specification, design, implementation,
test design, testcase authority, and release-readiness assets without implying
that executable technology capability is present.

Executional or operational lanes such as:

- test execution
- deployment
- runtime observation
- CI/CD or packaging enactment
- runtime-return ingestion

may converge only when the governing build tenant declares the corresponding
technology capability dependency explicitly.

## Requirement Closure Register

`odd_sdlc` publishes a machine-readable requirement closure register as current
workspace truth.

That register exists to keep iteration self-healing rather than forgetful.

The register records, for each live requirement:

- whether it is still present in live authority
- whether it is still present in the current generated requirement surface
- which implementation or test planning surfaces currently claim it
- which generated source files currently `Implement` it
- which generated test files currently `Validate` it
- whether it is realized, partially realized, planned, specified, or missing
  from the current generated requirement surface

This means a bounded partial wave may close lawfully without allowing the
unresolved live requirement set to fall out of future closure pressure.

## Generated Traceability Chain

`odd_sdlc` treats generated realization traceability as part of the operative
asset chain, not as optional review commentary.

The minimum active chain is:

- live requirement authority
- generated implementation and qualification planning surfaces
- generated source files with `Implements:` tags
- generated test files with `Validates:` tags
- requirement closure register summarizing the resulting closure state

File-level trace authority is mandatory.

Where one generated file owns materially different requirement families, the
tenant-local design may extend the trace contract to function or symbol level.

## Deterministic Scope And Traceability Gates

`odd_sdlc` uses deterministic authority checks to keep iteration honest.

Those checks are expected to verify at least:

- goal surface retains imported intent identifiers
- generated requirement surface carries forward the live requirement inventory
- generated code retains explicit trace authority for claimed implementation
  requirements
- generated tests retain explicit trace authority for claimed verification
  requirements
- orphan generated source or test files are treated as ungoverned realization
  rather than as closure evidence

Representative capabilities include:

- build tool or runner contracts such as `sbt`, `pytest`, or equivalent
- deployment contracts such as cluster submission or service rollout documents
- runtime-return channels and report contracts

Configured `F_P` may interpret and exercise a declared capability.

Configured `F_P` may not invent a missing capability.

If a required operational capability is absent:

- the operational edge does not converge
- traversal stops at the last lawful construction boundary
- the visible state is an honest bounded state such as
  `construction_complete_pending_execution`
- release readiness may still be published as a projection over the completed
  construction wave, but deployment/runtime closure may not be claimed

## Ambiguity Register And Disambiguation Boundaries

`odd_sdlc` should treat the SDLC as a disambiguation pipeline, not merely as an
asset-generation chain.

That means major ambiguity is governed domain truth.

The package should therefore publish an `ambiguity_register_surface` as a
machine-readable worksite asset.

Its role is to record major ambiguity such as:

- project identity conflict
- missing canonical surfaces
- competing realization roots
- declared root versus realized root mismatch
- declared topology versus realized topology mismatch
- governance-surface truth drifting from artifact truth
- absent execution capability for a stage that implies side effects

This register is not meant to capture every local build decision.

The design distinction is:

- major ambiguity changes the meaning, topology, lifecycle, or admissibility of
  later traversal
- micro ambiguity remains local to bounded implementation work unless it
  escapes its boundary and threatens a declared invariant

The first active publication point is deterministic normalization.

That seeded register may then be updated at major graph boundaries such as:

- imported authority and bootstrap foundation
- implementation branch materialization
- qualification branch materialization
- release readiness
- deployment
- runtime return
- retrofit planning

At those boundaries the register should show whether ambiguity was:

- introduced
- reduced
- resolved
- carried
- decided by `F_P`
- escalated to `F_H`
- blocked
- pending capability

This makes disambiguation explicit and prevents silent topology recovery or
silent capability assumptions from hiding important project-state truth.

Ambiguity detection is mandatory. Blocking is policy.

That means the register must also carry, for each major ambiguity:

- the active risk appetite
- the policy action chosen for that ambiguity class at the current boundary
- the decision owner when work has proceeded, such as deterministic policy,
  `F_P`, or `F_H`
- the decision basis or selected interpretation when a lawful choice was made

The governing rule is:

- lower risk appetite escalates more major ambiguity to `F_H`
- higher risk appetite permits more bounded `F_P` decision-making
- hard-stop prerequisite classes remain fail-closed regardless of appetite

## Generic Software Traversal

For the generic software domain, configured `F_P` is the normal supervisory
transform on an open edge.

`F_P` is expected to:

- interpret the edge contract
- update the actual governed target artifacts
- resolve bounded local build problems within the declared edge scope
- emit a machine-readable work report
- classify the work act it performed
- attach produced evidence

The default design stance is:

- generic software-domain edges rely heavily on configured `F_P`
- deterministic authority remains at the boundary and grows with domain
  specificity

This keeps the tenant truthful about where semantic determinism is actually
available.

## Layered Deterministic Authority

`F_D` is stratified into four layers.

### Core F_D

Universal deterministic checks over:

- asset binding
- target identity
- provenance shape
- work-report shape
- evidence existence
- cross-surface consistency

### Capability F_D

Optional specialized deterministic authorities for a stack, subsystem, or
domain profile.

Examples include schema compilers, lineage analyzers, migration planners, and
packaging validators.

### Postflight F_D

Deterministic validation of what `F_P` claims to have produced, adopted,
repaired, or retrofitted.

This is the layer that ties proof to actual target truth rather than to
assessment prose alone.

### Operational F_D

Deterministic validation over returned runtime, release, qualification, and
maintenance evidence.

This is the layer that makes the worksite lifecycle govern runtime return and
relaunch lawfully.

## Work-Report Boundary

Every `F_P`-supervised edge is designed to produce a machine-readable work
report.

The minimum report shape is:

- target asset id
- target binding or target path
- work-act classification
- input identity or digest summary
- output identity or digest summary
- evidence references
- claimed contract satisfaction

The report is a domain contract.

It is not a second runtime.

ABG remains the source of runtime fact truth for dispatch, assessment ingest,
proof, closure, continuation, and projection.

## Retained Active Capabilities

The current active software-domain package still retains several capabilities
first proven in the first slice.

### Query And Catalog Surface

`odd_sdlc` continues to publish a machine-readable domain read model.

That read model is active because it exposes current software-domain truth,
including:

- asset and asset-family descriptors
- work-act descriptors
- edge-contract descriptors
- function and graph-function catalogs
- ABG-aligned gap and projection views

### Executive GTL Carrier

The executive GTL graph-function carrier remains active as the lawful runtime
entry over the current proving chain.

It survives because it is still the correct carrier boundary, not because the
first slice is still live law.

### Install And Normalize

Deterministic install-and-normalize remains active as the entry path for
imported or stale workspaces.

Its redesign obligation is:

- preserve imported project authority
- preserve substrate ownership boundaries
- adopt or import existing implementation truth honestly
- stop manufacturing false generated defaults

### Reusable Consensus Harness

The reusable consensus harness remains active software-domain capability.

It continues to prove that higher-order review and decision loops can remain
ordinary GTL graph functions over typed assets.

## Current Transformation Classification

The current implementation inventory is classified as follows.

### Active

- `build_tenants/python/code/odd_sdlc/app.py`
  Active as the package bootstrap, runtime entry, and machine-readable catalog
  surface, but subject to further edge and install refactor
- `build_tenants/python/code/odd_sdlc/query.py`
  Active as the ABG-aligned domain query surface
- `build_tenants/python/code/odd_sdlc/gtl_module.py`
  Active as the current executive and reusable-harness carrier over the proving
  subset
- deployment, runtime-return, and retrofit graph edges
  Active as operative GTL traversal through `prepare_deployment_surface`,
  `derive_runtime_observation_surface`, and `derive_retrofit_plan_surface`
  under the current software-domain package

### Superseded

- `build_tenants/python/code/odd_sdlc/workspace_assets.py`
  superseded in its current hard-coded first-slice path assumptions and
  placeholder target bindings
- `build_tenants/python/code/odd_sdlc/constructor.py`
  superseded where it manufactures placeholder implementation, archive, and
  release surfaces as if they were current software-domain truth
- `build_tenants/python/code/odd_sdlc/fd_checks.py`
  superseded where it proves only marker-presence on first-slice placeholder
  surfaces rather than current target truth and provenance

### Orphaned

- first-slice-only placeholder defaults that continue to act as operative
  software-domain truth after supersession

These are not a compatibility feature.

They are deletion targets in the landed model.

## First-Slice Subset Boundary

The current shared first slice remains valid as a proving subset.

That subset still includes:

- bootstrap specification derivation
- implementation-design and qualification-design derivation
- recursive implementation and test branches
- testcase-authority qualification
- release preparation
- reusable consensus harness proof

But the build-out reclassifies that subset as:

- first published carrier
- first proving lane
- not the entire software-domain ontology

This prevents the tenant from freezing the toy branch into accidental law.

## Substrate Boundary

The software-domain build-out does not require a broad ABG redesign.

The substrate remains:

- declarative
- fail-closed
- overrideable through declared policy surfaces
- authoritative for runtime truth

The tenant-local boundary is:

- `odd_sdlc` owns software-domain semantics, asset families, work acts, and
  traversal law
- GTL/ABG owns graph-function algebra, traversal execution, event truth, and
  generic hook execution

If a substrate fix is required, it must be expressible in generic runtime or
hook terms rather than in software-delivery-specific artifact names.

## Consequences

- the bootstrap-to-release toy no longer defines the whole domain by accident
- imported, adopted, repaired, and returned software truth can be governed
  explicitly
- `odd_sdlc` can expand into a true SDLC worksite without becoming a shadow
  runtime above ABG
- future stack-specific profiles can add richer deterministic authority without
  repricing the regime model
