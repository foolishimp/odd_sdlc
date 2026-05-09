---
id: T-116
title: Add per-module attribute schema and state diagram, plus aggregate domain model and aggregate sunny-day sequence surfaces
type: feature
ticket_category: design_phase_completeness
status: completed
review_status: completed_live_aggregate_design_surface_proof
goal: typescript-rc-design-completeness-before-realization
build_tenant: typescript
owner: unassigned
change_intent: Strengthen the bootstrap_release_self_test design phase by requiring per-module attribute-level schemas and state diagrams as obligations on the existing module derivation edge, and by adding two aggregate edges that produce a collective domain model schema and a collective sunny-day sequence diagram before realization scheduling begins.
change_class: design_reframe
re_entry_point: design
affected_boundary: bootstrap_release_self_test graph topology, derive_implementation_module_surface obligations, two new derive_*_surface edges, F_P attestation criteria for design completeness, downstream schedule and realization edges that consume design outputs
priority: high
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-09
completed_at: 2026-05-09
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
depends_on:
  - T-110 ABG 3.5.0-rc.1 traced callout migration (completed 2026-05-04)
  - T-112 complete semantic lifecycle over abg35 substrate
  - T-115 ABG-prime execution-failure to component-repair flow (completed 2026-05-04)
intake_source: Live T-109 PTY data-mapper run review showed the bootstrap_release_self_test graph walks through derive_design_surface, derive_scenario_surface, derive_implementation_design_surface, derive_implementation_module_surface, and derive_implementation_component_topology_surface, but produces markdown-shaped artifacts without typed entity schemas, attribute-level coverage, lifecycle state semantics, or end-to-end call ordering. Realization scheduling and code/test materialization downstream then reason from incomplete design surfaces.
target_truth: Design completes before realization scheduling only when every module declares a typed attribute-level schema and a state diagram for its stateful entities, and when the graph publishes one aggregate domain model schema and one aggregate sunny-day sequence diagram that compose those module-local surfaces into a coherent end-to-end design. F_P attestation classifies design completeness across three axes: entity completeness, attribute completeness, and flow completeness.
superseded_truth: Module decomposition into derive_implementation_module_surface and derive_implementation_component_topology_surface, plus narrative outputs at derive_design_surface, is sufficient design depth before realization scheduling.
closure_law: This ticket closes only when each module derivation produces a typed attribute schema and a state diagram, when the two new aggregate surfaces are published as graph functions over those module outputs, and when F_P attestation rejects design close on any of entity, attribute, or flow incompleteness.
evaluation_criteria:
  - derive_implementation_module_surface produces a typed attribute schema per module covering entities, attributes, types, and invariants
  - derive_implementation_module_surface produces a state diagram per module covering lifecycle states and transitions for any stateful entity it owns
  - derive_aggregate_domain_model_surface composes per-module schemas into one aggregate schema with cross-module references resolved and ownership boundaries declared
  - derive_aggregate_sunny_day_sequence_surface composes per-module collaboration into one end-to-end happy-path sequence with each step naming module, operation, and entities exchanged
  - F_P attestation surfaces three named completeness verdicts (entity, attribute, flow) with explicit reasons when any verdict is partial or blocked
  - design close is gated on all three F_P verdicts being satisfied
  - downstream realization scheduling consumes the aggregate domain model and aggregate sunny-day sequence as authoritative inputs, not the design narrative
proof_surface:
  - graph topology amendment that adds the two new edges and binds the new module obligations
  - F_P attestation contract for entity / attribute / flow completeness
  - per-module schema and state diagram fixtures
  - aggregate domain model and aggregate sunny-day sequence fixtures
  - negative tests where one module omits an entity, omits a function-required attribute, or where the sunny-day sequence skips a published operation
  - live data-mapper lane that walks the new edges and publishes both aggregate surfaces before reaching derive_realization_schedule_surface
non_closure_conditions:
  - per-module schema produced as prose paragraphs without typed attribute declarations
  - per-module state diagram replaced by a list of states without declared transitions
  - aggregate domain model that leaves entities defined by some module unreferenced or duplicated under different names
  - aggregate sunny-day sequence that skips a published operation of any participating module
  - F_P attestation that returns a single boolean without classifying entity, attribute, and flow completeness separately
  - F_P attestation that classifies completeness as satisfied when an entity, attribute, or flow is partial
  - downstream schedule edges that bypass the aggregate surfaces and reason from derive_design_surface narrative directly
  - new edges added without binding their outputs as inputs to realization scheduling and code/test materialization
---

## Closure Note - 2026-05-09

Closed under STDO for the typed design-depth and aggregate design surface slice.

Current live evidence:

- Fresh data_mapper live archive:
  `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260508T122226315Z_pid79621`.
- The live graph traversed `derive_implementation_module_surface`,
  `derive_aggregate_domain_model_surface`, and
  `derive_aggregate_sunny_day_sequence_surface`.
- Design-depth postflight gaps were repaired and the run continued into
  component realization scheduling, component code, realization qualification,
  full code, test design, test module, and test component topology surfaces.
- Downstream surfaces consumed aggregate design outputs as authority rather than
  stopping at design narrative.

Closure boundary:

- This closes T-116's typed design-depth and aggregate design graph slice.
- The broader RC build/release proof remains with `T-041`, `T-109`, `T-112`,
  and `B-085`.

## Closure Note - 2026-05-06

Closed under STDO for the proven steel-thread design-depth slice. Full-breadth
widening is not claimed here and is carried by
`backlog/T-130-widen-design-depth-from-steel-thread-to-full-breadth.md`.

Current proof:

- `test_t116_design_depth_steel_thread.test.mjs` passed in the semantic suite.
- `test_t122_feature_scope_closure.test.mjs` passed with scoped design-depth
  positive and negative cases.
- `npm run test:semantic` passed: 216/216.
- `npm run test:sandbox` passed: 15/15.
- The live T-109 PTY workspace advanced through the aggregate domain and
  sunny-day sequence surfaces before blocking at release-depth parity.

Closure boundary: typed design-depth carriers, aggregate design edges, scoped
assurance, and live traversal through those surfaces are proven. Full-breadth
all-module widening remains backlog scope.

# T-116: Add Per-Module Domain Schema/State Diagram And Aggregate Design Surfaces

## Activation Note

Promoted to active during the T-109 PTY data-mapper live run. Current live
evidence shows the graph reaches `derive_implementation_module_surface`, but
the design phase still lacks typed per-module schema/state surfaces and
aggregate domain/sequence surfaces before realization scheduling.

T-116 may be implemented as the next design-phase deepening slice. Closure
remains dependent on T-112 unless T-112 is explicitly repriced: this ticket can
publish the concrete schema/state/aggregate carriers and gates, but it does
not by itself close the complete semantic lifecycle model.

## Steel-Thread Implementation Order

T-116 follows T-121 steel-thread delivery by default:

1. Define typed design-depth carriers once:
   `moduleSchemaFragments`, `moduleStateDiagramFragments`,
   `aggregateDomainModel`, `aggregateSunnyDaySequence`, and
   `designCompletenessVerdict`.
2. Admit those carriers from `design_depth_register` fenced JSON blocks and
   whole JSON artifacts.
3. Prove one module with one entity, one attribute, one operation, one state
   transition, one aggregate model, and one sunny-day sequence.
4. Prove negative fixtures for missing attribute and missing flow operation.
5. Wire the graph so aggregate surfaces exist before component topology and
   realization/test scheduling.
6. Only after deterministic steel-thread proof widens should the full
   data-mapper live lane be used as closure evidence.

## Implemented Steel Thread

The first implementation slice adds:

- `sdlc_design_depth_register`
- `sdlc_module_schema_fragment`
- `sdlc_module_state_diagram_fragment`
- `sdlc_aggregate_domain_model`
- `sdlc_aggregate_sunny_day_sequence`
- `sdlc_design_completeness_verdict`
- `design_completeness` assurance dimension
- graph edges:
  `derive_aggregate_domain_model_surface` and
  `derive_aggregate_sunny_day_sequence_surface`
- deterministic proof:
  `test_env/tests/test_t116_design_depth_steel_thread.test.mjs`

## Steel-Thread Proof

Passed:

- `npm run build:semantic`
- `node --test test_env/tests/test_t116_design_depth_steel_thread.test.mjs`
- `node --test test_env/tests/test_t093_scheduling_phase.test.mjs`
- `node --test test_env/tests/test_t084_assurance_ledger_composition.test.mjs`

Remaining closure work:

- widen worker prompts and live data-mapper expectations across all module
  schemas and state diagrams
- prove full aggregate domain model and sunny-day sequence on the data-mapper
  live lane
- confirm downstream realization and test schedules consume aggregate surfaces
  as authority in live archives

## STDO Triage

### First Missing Layer

Design.

The bootstrap_release_self_test graph decomposes intent down to component
topology but does not declare a typed domain model and does not publish an
end-to-end call ordering. Module derivation produces a narrative description of
what each module does, not a schema of the data it owns or a diagram of how it
behaves over time. Component topology declares wiring, not message flow. The
aggregate sunny-day path is implicit in the narrative outputs of design and
scenario surfaces, but is never published as a single artefact that downstream
realization scheduling can attest against.

This is a missing design surface, not a missing realization step.

### Lawful Change Class

`design_reframe`.

Graph topology changes (two new edges) and obligation set strengthening
(per-module schema and state diagram on the existing module edge) reframe what
"design complete" means. They do not change product intent and do not change
ABG runtime law. Existing graph functions for realization scheduling, code,
and test materialization continue to consume the design surface; the surface
is now richer.

## Current Reality

The bootstrap_release_self_test graph publishes (among others):

- `derive_design_surface`
- `derive_scenario_surface`
- `derive_implementation_design_surface`
- `derive_implementation_module_surface`
- `derive_implementation_component_topology_surface`
- `derive_realization_schedule_surface`

Live evidence from `test_env/test_runs/t109_live_installed_data_mapper_pty/20260504T101717216Z_pid39953`
shows each of these edges produces a markdown artefact under
`workspace/.ai-workspace/runtime/odd_sdlc/assets/<oprun>/`. The artefacts are
narrative. They are not typed. They do not name entities by stable identifier,
do not declare attribute types, do not specify lifecycle transitions, and do
not encode call ordering across modules.

Downstream realization scheduling (`derive_realization_schedule_surface`,
`derive_test_schedule_surface`, `derive_component_realization_schedule_surface`)
must therefore reason about *what to schedule* from a narrative description.

## Target Design Phase Shape

Two changes, applied together.

### 1. Strengthen `derive_implementation_module_surface` obligations

Per declared module, the edge produces:

- **Attribute-level schema.** Typed declaration of every entity the module
  owns or references, every attribute on each entity, attribute types,
  cardinality, and invariants. Schema is structurally addressable by stable
  entity identifier and stable attribute identifier.
- **State diagram.** For every stateful entity the module owns, the
  declaration of its lifecycle states, lawful transitions between those
  states, and the operations that drive each transition. Stateless entities
  are explicitly marked stateless.

These are obligations on the existing edge, not a new edge. The output of
`derive_implementation_module_surface` widens to carry both fragments per
module.

### 2. Add two aggregate edges

```text
derive_implementation_module_surface
  -> derive_aggregate_domain_model_surface
    -> derive_implementation_component_topology_surface
      -> derive_aggregate_sunny_day_sequence_surface
        -> derive_realization_schedule_surface
```

**`derive_aggregate_domain_model_surface`** composes the per-module schemas
into one aggregate domain model. It resolves cross-module entity references,
declares ownership boundaries (which module owns each shared entity), and
publishes a single typed schema for the system as a whole. Its output is the
authoritative input to schedule and code edges that reason about data shape.

**`derive_aggregate_sunny_day_sequence_surface`** composes the published
operations of every module into one end-to-end happy-path sequence. Each step
in the sequence names its module, the operation invoked, the entities
exchanged, and the resulting state transitions on those entities. The output
is one published sequence, not a per-module set; the per-module collaboration
fragments are obligations on the module edge or the component topology edge,
not separate artefacts at this layer.

## F_P Attestation Contract

F_D structural attestation is not sufficient for these artefacts. Schema
syntax can pass while the schema misses entities the module's function
requires. State diagrams can be syntactically valid while skipping a
transition. Sunny-day sequences can compile while omitting a critical step.

F_P attestation is the load-bearing evaluator. It produces three named
verdicts per evaluated artefact, each with explicit reasons.

### Entity completeness

Every entity that any module references, produces, consumes, or transitions
through is declared in the aggregate domain model with stable identifier and
ownership. F_P verdict surfaces unresolved cross-module references, duplicate
definitions under different names, and references to entities not declared by
any module. Verdict is `satisfied` only when no such gap exists.

### Attribute completeness

Every attribute required to fulfill a module's declared function is present
on the entity that module owns. F_P attestation reasons backward from each
module's declared operations to the attributes those operations need to read
or write, and confirms each is present with a compatible type and
cardinality. Verdict surfaces missing attributes, type mismatches, and
cardinality violations.

### Flow completeness

Every interaction in the aggregate sunny-day sequence resolves to a published
operation on a participating module, exchanges entities present in the
aggregate domain model, and respects the state diagrams of stateful entities.
F_P attestation walks the sequence step by step and surfaces missing
operations, undeclared entity exchanges, and illegal state transitions.

### Composite verdict

Design close is `allowed` only when all three verdicts are `satisfied`.
A `partial` verdict on any axis blocks design close and surfaces a typed
non-progress reason that the retrofit lane can act on.

## Implementation Slices

1. Amend the bootstrap_release_self_test graph to bind the per-module
   attribute-schema and state-diagram fragments as obligations on
   `derive_implementation_module_surface`. Update the obligation ledger
   shape to admit both fragments per module.
2. Publish the typed schema fragment carrier and the typed state-diagram
   fragment carrier under `gtl/m02/contracts/` (or the equivalent typed
   surface in odd_sdlc design model).
3. Implement `derive_aggregate_domain_model_surface` as a graph function
   over admitted module schemas. Output: one typed aggregate schema. F_P
   attestation: entity completeness.
4. Implement `derive_aggregate_sunny_day_sequence_surface` as a graph
   function over admitted module operations and aggregate domain model.
   Output: one typed end-to-end sequence. F_P attestation: flow
   completeness.
5. Extend the F_P evaluator to produce the three named verdicts (entity,
   attribute, flow) per evaluated artefact, with explicit reasons.
6. Wire downstream schedule edges (`derive_realization_schedule_surface`,
   `derive_test_schedule_surface`,
   `derive_component_realization_schedule_surface`) to consume the aggregate
   schema and aggregate sunny-day sequence as authoritative inputs.
7. Add fixtures: per-module schema with all attributes, per-module schema
   missing one attribute, aggregate sequence with skipped step, aggregate
   schema with cross-module collision.
8. Add a live data-mapper lane that walks the strengthened design phase end
   to end and publishes both aggregate surfaces before reaching
   `derive_realization_schedule_surface`.

## Closure Criteria

T-116 closes only when:

- per-module attribute schema and state diagram are obligations on
  `derive_implementation_module_surface` and are admitted as typed fragments
  per module
- `derive_aggregate_domain_model_surface` is published as a graph function
  with F_P entity-completeness attestation
- `derive_aggregate_sunny_day_sequence_surface` is published as a graph
  function with F_P flow-completeness attestation
- the F_P evaluator produces three named verdicts (entity, attribute, flow)
  with explicit reasons on partial / blocked outcomes
- design close is gated on all three verdicts satisfied
- downstream schedule edges consume the aggregate surfaces as authoritative
  input
- negative fixtures exercise each completeness axis and produce the expected
  partial verdict
- one live data-mapper run walks the strengthened design phase to terminal
  closure and publishes both aggregate surfaces before
  `derive_realization_schedule_surface`

## Non-Closure Statement

T-116 is not closed by adding two narrative artefacts at the end of design.
It closes only when every module declares typed schema and state semantics,
when the aggregate surfaces are typed compositions of those module fragments,
when F_P attestation can identify exactly which entity, attribute, or flow
is incomplete, and when downstream schedule and realization edges read the
aggregate surfaces as their authoritative input rather than the narrative
outputs of `derive_design_surface`.

## Relationship To Adjacent Work

- **T-114** (worker_result_report demoted from closure authority) established
  that closure must come from typed lifecycle projections, not narrative
  reports. T-116 extends that posture to the design phase: design close
  comes from typed schema and sequence projections, not narrative outputs.
- **T-115** (execution failure → component repair flow) established that
  realization failures convert into typed component repair traversal.
  T-116 makes the upstream design surface the typed input that repair
  traversal can reason against — without typed schema and sequence,
  component repair has no structural target to attest against.
- **DESIGN_MODULE_METHOD** is the constitutional surface that owns the
  shape of design module decomposition. A future ticket may carve a
  longer-running migration from markdown design artefacts to fully typed
  Module declarations at every design edge; T-116 is the smallest lawful
  step in that direction that does not require constitutional method
  amendment.

## Test69 Admission Bug Link

The fresh `data_mapper.test69.TS.cx` Claude PTY run exposed a lifecycle bug in
the design-depth admission boundary. `derive_implementation_module_surface`
produced useful module/entity/attribute facts, but postflight rejected them as
schema-invalid because the worker used a relational `entities[] + attributes[]`
shape and extra root metadata.

That bug is tracked by
`B-084-admit-ambiguous-design-depth-candidates-before-strict-closure.md`.

T-116 cannot close on design-depth surfaces until B-084 is proven, because
strict final closure is correct but strict first-gate rejection prevents lawful
ambiguity management and same-edge detail forcing.

## Codex RC Completeness Review - 2026-05-07

Status: reopened to active for RC completeness review.

Observations:

- Focused proof refreshed on 2026-05-07: `node --test
  test_env/tests/test_t116_design_depth_steel_thread.test.mjs` passed.
- The steel-thread implementation is real: typed design-depth carriers exist,
  aggregate edges are present, and deterministic negative tests cover missing
  attributes and skipped flow operation.
- The ticket target truth and closure law are broader than the closure note.
  They require every module to declare typed schema/state semantics and
  downstream schedule edges to consume aggregate surfaces. The closure note only
  claims a proven steel-thread slice and defers full breadth to T-130.
- Because the current ticket still states full design-phase completeness, it
  should remain active unless the ticket is repriced/narrowed and T-130 becomes
  the explicit owner of the full-breadth remainder.
- Adjacent review found design-depth admission/scope risks that affect this
  ticket's closure surface: missing module identity can be normalized to
  `unnamed-module`, and scoped completeness filtering relies on reason-text
  token matching. Those must be addressed or excluded before final T-116
  closure.

Checklist before re-closing:

- [ ] Decide whether T-116 is the full design-depth ticket or reprice it to the
      steel-thread slice with T-130 owning full breadth.
- [ ] Add full-breadth per-module schema/state tests or link the active T-130
      acceptance criteria as the owner.
- [ ] Fix or explicitly ticket the `unnamed-module` admission and token-filter
      assurance risks.
- [ ] Re-run focused design-depth tests plus the live data-mapper design-depth
      lane used for closure.
