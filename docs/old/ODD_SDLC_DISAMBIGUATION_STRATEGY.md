# odd_sdlc Disambiguation Strategy

**Status**: Supporting strategy
**Purpose**: Define `odd_sdlc` as a disambiguation pipeline and establish how ambiguity should be tracked, reduced, and governed across the SDLC
**Derives From**: `specification/INTENT.md`, `specification/PRODUCT.md`, `specification/GOALS.md`, `specification/requirements/03-runtime-governance.md`, `specification/requirements/10-odd-sdlc-software-domain-buildout.md`, `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`, `docs/REQUIREMENTS_TRACEABILITY.md`

# Position

`odd_sdlc` should be understood as a disambiguation pipeline, not merely a
generation pipeline.

Software work begins with materially ambiguous project truth:
- imported authority may be incomplete, overlapping, or inconsistent
- requirements may leave multiple lawful interpretations open
- technology realization may be under-constrained
- design may still admit multiple architectures
- testing and operational stages may imply side effects without declared
  execution capability

The purpose of spec-driven SDLC is to reduce that ambiguity in governed stages
until later implementation work becomes mostly deterministic relative to the
constrained problem.

This means:
- earlier stages are primarily major disambiguation gates
- later stages are primarily bounded realization over already constrained truth
- convergence should be read as closure over the current lawful ambiguity
  frontier, not as “the model wrote some files”

# Core Doctrine

## 1. The SDLC is a narrowing of lawful interpretations

Every major SDLC stage should shrink the set of admissible interpretations of
the project.

The pipeline should progressively answer:
- what project is this
- what does it mean
- what is in scope
- what technology realization is lawful
- what design is authoritative
- what implementation structure follows from that design
- what test structure follows from that design
- what executional or operational stages are admissible

Later stages should inherit a narrower ambiguity frontier than earlier stages.

## 2. Major ambiguity and micro ambiguity are different things

`odd_sdlc` should distinguish:

- **major ambiguity**
  - changes the meaning, topology, lifecycle, governing contract, or execution
    admissibility of the project
  - examples:
    - competing realization roots
    - unresolved technology stack
    - incompatible module topology
    - absent execution capability for a stage that implies side effects
    - governance surface truth diverging from artifact truth

- **micro ambiguity**
  - local realization choices inside an already governed boundary
  - examples:
    - variable names
    - helper function boundaries
    - local error message wording
    - small API shape refinements
    - minor code structure choices

Major ambiguity should be tracked as a first-class governed asset.
Micro ambiguity should normally remain local to the work report unless it
escapes its boundary and threatens an invariant.

## 3. Convergence is lawful only when the relevant major ambiguity is closed

An edge may not converge merely because an artifact exists.

An edge converges when:
- its required invariants are satisfied
- its required upstream ambiguities have been resolved or lawfully carried
- no unresolved major ambiguity remains that would make downstream meaning
  unstable

If a required execution or operational capability is not declared, convergence
must stop at the last lawful construction boundary.

# The Major Disambiguation Gates

The major gates are the places where `odd_sdlc` should explicitly reduce
ambiguity and record what changed.

## Gate 1: Imported Authority and Workspace Identity

This is the first normalization boundary.

Questions answered:
- what project is this
- what imported sources are authoritative
- what is provenance only
- what bootstrap surfaces are missing
- what topology facts are already ambiguous

Outputs:
- canonical imported-source inventory
- bootstrap read model
- initial project profile
- initial ambiguity register

This gate should explicitly record ambiguity such as:
- missing or conflicting project identity
- missing canonical surfaces
- multiple plausible implementation roots already present
- imported source overlap or conflicting headings

## Gate 2: Intent / Product / Goals

This is the first semantic narrowing of project meaning.

Questions answered:
- what problem is being solved
- what product is being built
- what goals are binding
- what ontology anchors are stable

Outputs:
- intent surface
- product surface
- goals surface
- updated ambiguity register

This gate should reduce:
- project identity ambiguity
- domain-purpose ambiguity
- goal ambiguity

It should not yet claim technology realization or detailed architecture.

## Gate 3: Requirements

This is the first major constitutional narrowing.

Questions answered:
- what obligations are binding
- what invariants must hold
- what acceptance conditions exist
- what capability dependencies are implied but not yet satisfied

Outputs:
- requirement surface
- updated ambiguity register

This gate should reduce:
- scope ambiguity
- acceptance ambiguity
- invariant ambiguity

It should make unresolved capability dependencies visible, even when they are
not yet selected or fulfilled.

## Gate 4: Build Tenant and Technology Capability Selection

This is the main realization admissibility gate.

Questions answered:
- what `HOW` is active for this workspace
- what stack is selected
- what output root is authoritative
- what execution, deployment, and runtime capabilities are declared

Outputs:
- project profile
- implementation stack profile
- test stack profile
- capability declarations
- updated ambiguity register

This gate should reduce:
- competing realization-root ambiguity
- stack ambiguity
- execution capability ambiguity

This is where the distinction between construction and execution becomes
explicit. If an execution capability is absent, the later side-effect stage is
not admissible.

## Gate 5: Design

This is the main architecture narrowing.

Questions answered:
- what structural architecture is authoritative
- what module or bounded-context split is intended
- what scenario structure constrains later implementation
- what test design follows from the same governing truth

Outputs:
- design surface
- scenario surface
- implementation design surface
- test design surface
- updated ambiguity register

This gate should reduce:
- architecture ambiguity
- scenario ambiguity
- test-strategy ambiguity

No downstream code or test module generation should reopen unresolved major
architecture ambiguity.

## Gate 6: Implementation and Qualification Structure

This is where design becomes concrete branch structure.

Questions answered:
- what implementation modules exist
- what test modules exist
- what code root is governed
- what evidence archive shape is expected

Outputs:
- implementation module surface
- code surface
- test module surface
- test run archive surface
- testcase authority surface
- updated ambiguity register

This gate should reduce:
- module topology ambiguity
- code-root ambiguity
- test-archive ambiguity

This is still major disambiguation, but it should be narrower than design.

## Gate 7: Release Readiness

This is the bounded end of generic construction.

Questions answered:
- has the project reached a lawful construction boundary
- what evidence exists
- what evidence is still missing
- is the correct stop state “construction complete, pending execution”

Outputs:
- release surface
- updated ambiguity register

This gate should reduce:
- release-readiness ambiguity
- false qualification ambiguity

It must not claim deployment, runtime, or retrofit if the required capability or
returned evidence is absent.

## Gate 8: Executional and Operational Stages

These are not generic by default. They are capability-gated.

Questions answered:
- is test execution admissible
- is deployment admissible
- is runtime observation admissible
- what concrete technology dependency is bound to the stage

Outputs, when capability is declared:
- test execution evidence
- deployment record
- runtime observation surface
- retrofit plan surface
- updated ambiguity register

If capability is not declared:
- the edge does not converge
- the system stops at the last lawful boundary
- the ambiguity register records `pending_capability` rather than allowing
  false convergence

# The Ambiguity Register

## Role

`odd_sdlc` should publish a governed ambiguity asset for the active workspace.

Suggested name:
- `ambiguity_register_surface`

Suggested initial materialization:
- `.ai-workspace/runtime/odd_sdlc-ambiguity-register.json`

Optional read model:
- `.ai-workspace/context/ambiguities.md`

The JSON should be authoritative for machine use.
The Markdown should be a convenience projection for operators.

## Why it must be a governed asset

Without a governed ambiguity asset:
- ambiguity resolution becomes invisible
- topology recovery can silently mask defects
- downstream convergence can look “clean” even when earlier stages were forced
  to guess
- comparative runs become hard to interpret because only final artifacts remain

The ambiguity register preserves the fact that disambiguation happened.

## Entry shape

Each ambiguity entry should include at least:
- `ambiguity_id`
- `class`
- `title`
- `description`
- `severity`
- `status`
- `invariant_refs`
- `affected_assets`
- `first_seen_at`
- `last_seen_at`
- `introduced_by`
- `expected_resolving_edge`
- `current_resolution`
- `observed_state`
- `competing_interpretations`
- `evidence_refs`

Suggested statuses:
- `open`
- `reduced`
- `resolved`
- `carried`
- `blocked`
- `pending_capability`
- `superseded`

## Initial ambiguity classes

The current high-value classes are:
- `project_identity_conflict`
- `missing_canonical_surface`
- `multiple_realization_roots`
- `declared_root_vs_realized_root_mismatch`
- `framework_payload_vs_product_payload_overlap`
- `declared_topology_vs_realized_topology_mismatch`
- `declared_capability_absent_but_side_effect_observed`
- `governance_surface_vs_artifact_truth_drift`
- `execution_stage_without_declared_capability`
- `release_claim_without_evidence`

# Update Strategy

## Seed at normalization

Normalization should create the first ambiguity register.

This is the right place because normalization already:
- establishes bootstrap surfaces
- writes a normalization report
- writes a bootstrap read model
- normalizes project constraints
- resolves basic topology

The ambiguity register should be created alongside those outputs, not as an
afterthought.

## Update only at major boundaries

The register should be updated at major graph boundaries, not every micro-edge.

The current boundary candidates are the published edge-contract groups:
- `bootstrap_spec_foundation`
- `materialize_implementation_branch`
- `materialize_qualification_branch`
- `prepare_release_readiness`
- `publish_deployment_record`
- `return_runtime_evidence`
- `retrofit_and_relaunch`

Each boundary update should report:
- what ambiguities were introduced
- what ambiguities were reduced
- what ambiguities were resolved
- what ambiguities remain open
- whether remaining ambiguity blocks lawful downstream convergence

## Keep micro ambiguity out unless it escapes

Code-generation micro choices should not flood the register.

A micro ambiguity should be promoted only if it creates one of:
- competing artifact roots
- competing module structures
- competing public contracts
- violation of a declared invariant
- false operational or execution claims

# Convergence Rules

## Construction

Construction may converge when:
- the required major disambiguation gates are closed
- the output contracts of the current construction boundary are satisfied
- residual ambiguity is only micro ambiguity or explicitly carried non-blocking
  ambiguity

## Execution and operations

Executional and operational stages may converge only when:
- the required technology capability is declared
- the required evidence channel is present
- the stage’s major ambiguity is closed

If capability is absent:
- the stage does not converge
- the ambiguity is recorded as `pending_capability`
- the lawful completion state is `construction_complete_pending_execution`

# What test22 taught us

`test22` is the clearest current corpus for this strategy.

It shows that ambiguity is not theoretical. It appears in live work as:
- two plausible realization roots
  - `imp_scala_spark/`
  - `build_tenants/data_mapper/spark_scala/`
- mixed meanings inside `build_tenants/`
  - framework payload
  - app-local scaffold
- declared topology not matching realized topology
- release narrative lagging behind actual artifact truth
- side effects occurring where capability declaration was still incomplete

These are exactly the kinds of facts that should become explicit ambiguity
entries instead of being inferred later from operator memory.

# Operating Benefits

If `odd_sdlc` adopts this strategy, it gains:
- a visible ambiguity burndown across the SDLC
- cleaner stop/go decisions for downstream traversal
- better comparative analysis across qualification runs
- a principled distinction between major ambiguity and micro implementation work
- more honest convergence semantics
- stronger traceability between requirements, design, runtime behavior, and
  realized artifacts

# Implementation Direction

This note is strategy, not the implementation itself, but the implementation
path is straightforward.

## First wave

- define the ambiguity register as a governed asset in tenant design and code
- create it during normalization
- expose it in query/catalog
- add deterministic ambiguity detectors based on current topology/profile logic

## Second wave

- update it at major graph boundaries
- add boundary-level status transitions such as `resolved`, `carried`, and
  `pending_capability`
- use it in convergence reporting and release semantics

## Third wave

- trace ambiguity reduction through complete use cases
- qualify that major ambiguity monotonically decreases or is explicitly carried
- use the register to detect false convergence and topology drift

# Success Condition

The strategy is successful when:
- `odd_sdlc` can tell an operator what remains ambiguous at any major boundary
- later stages cannot silently pass while a required major ambiguity remains open
- the system can distinguish “construction complete” from “execution admissible”
- comparative runs can be evaluated not only by what artifacts exist, but by how
  much ambiguity was lawfully removed

# Working Statement

`odd_sdlc` should treat the SDLC as a governed disambiguation pipeline.
The job of the framework is not merely to generate assets, but to reduce the
space of lawful interpretations in explicit stages until later realization work
is bounded, attributable, and honest.
