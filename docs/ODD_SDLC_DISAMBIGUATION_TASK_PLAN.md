# odd_sdlc Disambiguation Task Plan

**Status**: Active task plan
**Purpose**: Break the disambiguation-pipeline goal into implementation work packages for `odd_sdlc`
**Derives From**: `specification/GOALS.md`, `docs/ODD_SDLC_DISAMBIGUATION_STRATEGY.md`, `specification/requirements/10-odd-sdlc-software-domain-buildout.md`, `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`

# Position

This task plan implements the current goal of making `odd_sdlc` a governed
disambiguation pipeline.

It is a capability-extension plan, not a broad topology rewrite.

Refactoring should happen only where required to inject the new capability
cleanly into the active domain model, runtime behavior, and qualification
surfaces.

# Work Packages

## WP-1: Ratify the domain requirements and scenario proof

### Purpose

Make the disambiguation capability explicit in current domain law before deeper
implementation lands.

### Tasks

- add active requirements for:
  - a governed ambiguity register
  - major-boundary ambiguity reduction and carry semantics
  - ambiguity-aware convergence for capability-gated stages
- add one or more complete scenario surfaces proving the new requirements
- update testcase authority so the new requirements trace to complete use cases

### Done when

- the new requirements are present in
  [10-odd-sdlc-software-domain-buildout.md](/Users/jim/src/apps/odd_sdlc/specification/requirements/10-odd-sdlc-software-domain-buildout.md)
- the new scenarios are present in
  [specification/scenarios](/Users/jim/src/apps/odd_sdlc/specification/scenarios)
- testcase authority names the new proving lanes

## WP-2: Extend tenant design with an ambiguity asset model

### Purpose

Define the ambiguity register as a real domain asset and describe its place in
the lifecycle.

### Tasks

- extend tenant-local design to define:
  - `ambiguity_register_surface`
  - ambiguity classes
  - ambiguity status transitions
  - the distinction between major and micro ambiguity
- define which major graph boundaries update the register
- define how `pending_capability` and `construction_complete_pending_execution`
  interact with ambiguity state

### Done when

- the design exists in
  [SOFTWARE_DOMAIN_BUILDOUT.md](/Users/jim/src/apps/odd_sdlc/build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md)
- the ambiguity asset and its lifecycle are described in current tenant law

## WP-3: Seed the ambiguity register during normalization

### Purpose

Make ambiguity visible from the first deterministic workspace pass.

### Tasks

- extend
  [normalization.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/normalization.py)
  to write an initial machine-readable ambiguity register
- optionally add a human-readable ambiguity projection beside
  `project_bootstrap.md`
- capture first-wave ambiguity such as:
  - project identity conflict
  - missing canonical surfaces
  - multiple realization roots
  - declared root versus recovered root mismatch
  - capability declarations that are blank for later side-effect stages

### Done when

- imported workspaces get an initial ambiguity register at install/normalize
- the register can be regenerated deterministically

## WP-4: Surface ambiguity through profile and topology resolution

### Purpose

Stop silent topology recovery from hiding important ambiguity facts.

### Tasks

- extend
  [project_profile.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/project_profile.py)
  so recovery logic emits ambiguity facts instead of only choosing a root
- extend
  [workspace_assets.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/workspace_assets.py)
  so topology-guard findings can be recorded in the ambiguity register
- define stable ambiguity classes for:
  - competing realization roots
  - framework payload versus product payload overlap
  - declared topology versus realized topology mismatch
  - artifact truth versus governance-surface truth drift

### Done when

- the system can explain why a root was selected
- topology divergence becomes governed ambiguity state instead of an implicit
  side effect of profile resolution

## WP-5: Publish ambiguity as current domain truth

### Purpose

Make ambiguity visible through ordinary domain queries and catalog surfaces.

### Tasks

- extend the domain model with a descriptor for ambiguity entries or an
  ambiguity register asset
- publish the ambiguity asset through:
  - catalog
  - query surfaces
  - asset inventories
- expose ambiguity status so operator and UI surfaces can consume it without
  re-scanning the filesystem

### Done when

- ambiguity is returned from
  [query.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/query.py)
- the ambiguity asset is part of the active machine-readable domain surface

## WP-6: Update ambiguity only at major graph boundaries

### Purpose

Keep the model legible by tracking major ambiguity reduction rather than every
local realization choice.

### Tasks

- bind ambiguity updates to major edge-contract groups such as:
  - bootstrap/spec foundation
  - implementation branch
  - qualification branch
  - release readiness
  - deployment
  - runtime return
  - retrofit
- for each boundary, record:
  - introduced ambiguity
  - reduced ambiguity
  - resolved ambiguity
  - carried ambiguity
  - blocked ambiguity

### Done when

- ambiguity state changes are visible at major lifecycle boundaries
- micro-edge churn does not flood the register

## WP-7: Make convergence semantics ambiguity-aware

### Purpose

Prevent false convergence where required major ambiguity remains open.

### Tasks

- define which ambiguities are blocking for each major stage
- prevent executional or operational convergence when required capability is not
  declared
- make release and completion reporting ambiguity-aware
- preserve lawful stop states such as
  `construction_complete_pending_execution`

### Done when

- the system can distinguish:
  - construction converged
  - execution admissible
  - execution pending capability
  - execution pending evidence
- downstream stages cannot silently converge while a required major ambiguity is
  still open

## WP-8: Qualify through complete use cases

### Purpose

Prove the new capability through end-to-end behavior, not only unit logic.

### Tasks

- add complete use-case tests for:
  - ambiguous imported workspace normalization
  - realization-root ambiguity
  - capability absent for executional stages
  - governance-surface truth drift versus artifact truth
  - major ambiguity reduction across a real inherited project
- keep `data_mapper` as the primary inherited-project corpus
- add regression assertions that ambiguity state is preserved and reduced
  correctly across runs

### Done when

- each new requirement is proven by a complete use case
- `data_mapper` demonstrates the capability in practice

## WP-9: Extend bidirectional traceability

### Purpose

Ensure the capability is fully traceable from requirements to code and tests,
and back from code/tests to requirements.

### Tasks

- extend
  [REQUIREMENTS_TRACEABILITY.md](/Users/jim/src/apps/odd_sdlc/docs/REQUIREMENTS_TRACEABILITY.md)
  with the new ambiguity requirements, code paths, and test lanes
- mark any ambiguity logic that lacks a requirement as orphaned
- mark any ambiguity requirement that lacks code/tests as unimplemented

### Done when

- the ambiguity capability participates in the same bidirectional traceability
  regime as the rest of `odd_sdlc`

# Recommended Order

1. `WP-1` ratify requirements and scenarios
2. `WP-2` define the tenant design
3. `WP-3` seed ambiguity at normalization
4. `WP-4` connect profile and topology findings
5. `WP-5` publish query and catalog surfaces
6. `WP-6` update at major graph boundaries
7. `WP-7` make convergence ambiguity-aware
8. `WP-8` prove through complete use cases
9. `WP-9` finish traceability

# First Practical Slice

The first implementation slice should stay narrow:

- create the ambiguity register during normalization
- populate it from existing profile and topology logic
- expose it in query/catalog
- add one real `data_mapper` use case proving the initial register and one
  reduced ambiguity transition

That first slice will establish the asset, the semantics, and the query surface
without yet requiring the full boundary-update model.

# Success Measure

This plan succeeds when a live workspace can answer, in current domain truth:
- what is still ambiguous
- why it is ambiguous
- which major gate should resolve it
- whether the ambiguity is blocking
- whether downstream convergence is lawful
