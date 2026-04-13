# T-004 Restore Homeostatic Gap Triage And Intent Renewal

- id: T-004
- title: Restore the spec-method homeostatic loop so gap analysis triages expected-vs-realized mismatch and generates lawful next vectors including new goals or intent when needed
- type: feature
- status: active
- goal: ambiguity-governance-and-traceability
- priority: critical
- created_at: 2026-04-12
- updated_at: 2026-04-13
- dependencies: B-001, T-002, B-002, T-003

## Triage

- intake: feature / methodology recovery / operator finding
- lawful_change_class: requirement_reprice
- affected_boundary: odd_sdlc gap analysis, ambiguity governance, requirement-closure interpretation, traversal triage, and spec-method repricing path from concrete gap back into goals and intent
- lawful_re_entry: odd_method specification, design, and realization surfaces for gap analysis, triage outputs, query surfaces, and runtime continuation selection
- downstream_proof_span: focused gap-triage fixtures, reset/replay lanes, and real downstream proving on the `data_mapper` corpus

## Why This Ticket Exists

`SPEC_METHOD` already defines the homeostatic reverse path:

```text
Current spec -> real-world use case -> gap analysis -> new goals / intent
```

and makes this rule explicit:

- gap analysis identifies where real use cases hit the current model and reveal
  insufficiency
- when the insufficiency is constitutional, repricing generates new goals
  and/or intent

`odd_sdlc` already has important raw surfaces:

- an ambiguity register
- a requirement closure register
- event history
- projection and delta
- builder-side analytical capability through `F_P`

But the current operational `gaps()` path does not complete the homeostatic
loop.

Today:

- `odd_sdlc.app.gaps()` delegates directly to ABG `gen_gaps()`
- ABG `gen_gaps()` is intentionally `bind_fd` only
- the result is structural gap reporting and edge delta summary
- the result is not a true semantic triage product over the mismatch between
  expected truth and realized truth

That means the system currently under-delivers on one of the core purposes of
the method:

- gap analysis should act like spec-method bug triage
- it should classify the mismatch
- it should say whether the missing work belongs in implementation, design,
  requirements, goals, or intent
- it should inject the lawful next vector at the correct level

Without that, the homeostatic reverse path is present in the constitution but
only partially present in the runtime.

The empirical failure case is visible in `test28.02`:

- pass 2 iterated over the same realized workspace after reset/replay
- 8 of 14 module groups were unchanged and byte-identical across passes
- 4 groups received lateral additions only
- 2 groups were entirely new capability groups
- no existing Scala file was deepened

The concrete shallow survivors included:

- `JobSubmitter.submit()` still `???`
- `SparkMorphismExecutor` still `val output = input`
- `Reconciler` still hard-codes `isConsistent = true`

So the current system can observe coverage and traceability, but it does not
yet triage the gap as "shallow existing realization" and route correction
accordingly.

## Existing Surfaces To Reuse

This ticket is not a greenfield invention. The main ingredients already exist:

- ambiguity register published in `.ai-workspace/context/ambiguity_register.json`
- requirement closure register published in
  `.ai-workspace/context/requirement_closure_register.json`
- event stream and projection surfaces
- deterministic evaluator outcomes
- builder-side stateful control frame work under `T-002`

The problem is not absence of evidence. The problem is that the evidence is not
yet interpreted into a first-class homeostatic triage product.

There is also prior art for corrective-vector thinking in the historical
feedback loop model at:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test10/.ai-workspace/graph/edges/feedback_loop.yml`

That surface already classified signal sources such as:

- `runtime_deviation`
- `ecosystem_change`
- `gap_analysis`
- `test_failure`
- `refactoring_needed`
- `source_finding_escalation`
- `process_gap_escalation`

and paired them with structured intent templates. This ticket should recover
that homeostatic direction in the current governed `odd_sdlc` model rather than
reinventing it loosely.

## Intended Direction

Gap analysis at a single traversal should become a local semantic diff between
what is expected and what is real.

It should answer:

- what upstream authority or expectation is in force here
- what is currently realized
- what mismatch remains
- what kind of gap this is
- what the lawful next vector is

The gap product should behave like spec-method triage, not just evaluator
reporting.

This has two sequential layers:

1. per-edge triage
   - at the active traversal boundary, compare expected truth against realized
     truth and classify the local mismatch
2. cross-edge routing
   - interpret the set of local triage results and attach the lawful next
     vector at the correct level in the constitutional chain

The second depends on the first. `odd_sdlc` needs explicit per-edge triage
results before it can route correction into implementation, design,
requirements, goals, or intent.

Examples:

- real use case reveals the constitution cannot express the needed concern ->
  generate a new `intent_vector` or `goal_vector`
- requirement family is missing or insufficient -> generate a requirement
  repricing vector
- design no longer harmonizes with the requirement truth -> generate a design
  gap vector
- code is present but shallow -> generate a code repair vector
- test is missing as an independent implementation of the requirement ->
  generate a test realization vector
- execution result contradicts the intended guarantee -> generate an execution
  triage vector and, if constitutional, repricing upward

## Gap Triage Model

At minimum, gap triage should classify mismatches into a domain-local taxonomy
such as:

- `intent_gap`
- `goal_gap`
- `product_gap`
- `requirement_gap`
- `design_gap`
- `module_gap`
- `code_gap`
- `test_gap`
- `execution_gap`
- `topology_gap`
- `capability_gap`
- `ambiguity_gap`

Each triage result should identify:

- `gap_kind`
- `affected_assets`
- `authority_basis`
- `realized_basis`
- `evidence`
- `recommended_lawful_vector`
- `constitutional_insufficiency: true|false`

When `constitutional_insufficiency` is true, the result should support lawful
repricing into `GOALS.md` and/or `INTENT.md`.

## Analytical Capability Boundary

This ticket does not assume a missing reasoning capability.

`F_P` can already perform deep semantic review when asked. The missing pieces
are:

- a prompt contract that explicitly asks for gap triage rather than only
  builder continuation
- a durable artifact surface that captures the result as typed triage output
- lawful routing from the triage result into the next vector

So this is primarily a wiring and contract problem, not a claim that the system
cannot already reason about the mismatch.

## Existing Runtime Hook

The runtime hook needed for this behavior already exists in ABG. This ticket
should wire `odd_sdlc` triage into that hook rather than invent a new
substrate mechanism.

ABG already provides:

- continuation truth and replay-derived lifecycle under
  `abiogenesis/.../genesis/continuation.py`
- policy-bundle resolution over GTL hook surfaces under
  `abiogenesis/.../genesis/policy.py`
- candidate-family selection and profile routing, including discovery-style
  child graphfunctions, in the existing fake sandbox proving lanes

The existing fake sandbox prior art already proves:

- candidate-family selection between multiple lawful graphfunctions
- explicit route selection such as `graphfunction.discovery`
- foldback from a selected child route back into the parent lane

So the missing piece is domain wiring:

- `odd_sdlc` gap analysis does not yet emit a typed triage result
- that triage result does not yet bind to continuation selection or
  candidate-family routing
- `gaps()` still exposes raw structural delta rather than a lawful next-intent
  product

This means `T-004` should treat continuation and route selection as existing
runtime hooks and focus on producing the domain-local signal that drives them.

That signal should support both:

- fixed next intents such as repair, deepen, reopen design, reopen
  requirements, or reprice goals/intent
- dynamic next intents such as discovery, PoC, capability probe,
  source-finding, or other future graphfunctions declared lawfully in the
  module

Dynamic does not mean arbitrary. It still must resolve to typed intent vectors
and declared graphfunctions under governed selection policy.

## Task List

- [ ] Define the domain-local gap-triage contract for `odd_sdlc` as a
  first-class runtime surface rather than leaving gap meaning implicit in edge
  deltas.
- [ ] Separate the implementation into per-edge gap triage and cross-edge
  repricing/routing so the local mismatch product is explicit before the
  reverse-path vector is chosen.
- [ ] Reuse the ambiguity register, requirement closure register, event stream,
  and deterministic findings as triage evidence inputs.
- [ ] Make `odd_sdlc` able to distinguish implementation gaps from design,
  requirement, goal, and intent insufficiency.
- [ ] Define the lawful next-vector taxonomy for gap results, including upward
  repricing vectors such as new goals or intent when the gap is constitutional.
- [ ] Reconcile `odd_sdlc` gap triage with existing ABG continuation and
  candidate-family routing hooks so this ticket reuses substrate mechanisms
  instead of creating a shadow runtime path.
- [ ] Define both fixed and dynamic next-intent routing:
  - fixed intents for repair, deepen, reopen, and upward repricing
  - dynamic intents for discovery, PoC, capability probe, source-finding, and
    future domain-declared graphfunctions
- [ ] Publish a gap-triage artifact that is durable and queryable rather than
  only ephemeral prompt text.
- [ ] Reprice `gaps` output so operators can see semantic triage, not only
  failing evaluators and total delta.
- [ ] Preserve ABG as the generic runtime substrate; keep gap interpretation
  and next-vector semantics in the domain.
- [ ] Prove the reverse-path behavior on concrete cases where a real use case
  reveals:
  - missing implementation only
  - missing test only
  - missing requirement
  - missing or insufficient design
  - true constitutional insufficiency requiring new goals or intent

## Proof Required

- focused fixture proof:
  - a requirement-vs-code mismatch produces `code_gap`
  - a requirement-vs-test mismatch produces `test_gap`
  - a requirement not expressible by current product/requirements produces
    `requirement_gap` or higher repricing
- ambiguity proof:
  - unresolved major ambiguity produces `ambiguity_gap`
  - policy/risk appetite continues to govern whether that gap blocks or
    escalates
- constitutional repricing proof:
  - a concrete real-world use case can produce a triage result that lawfully
    recommends new goals and/or intent
- query-surface proof:
  - the triage artifact is available through domain query surfaces rather than
    only hidden inside logs or prompts
- downstream proof:
  - on a real downstream proving lane such as `data_mapper`, the system can
    classify at least one concrete mismatch above the implementation layer and
    route it to the correct lawful vector
- route-selection proof:
  - at least one triage result can bind lawfully into an existing continuation
    or candidate-family route such as a discovery or PoC graphfunction rather
    than only retrying the same edge
- iteration-depth proof:
  - on a reset/replay or second-pass run over an existing realized workspace,
    the triage surface makes shallow existing implementations visible as active
    gaps to deepen rather than treating mere file presence as completion
- non-regression proof:
  - existing `gaps`, `iterate`, and `start` flows still work, but with richer
    domain-local gap interpretation layered on top

## Acceptance

- the homeostatic reverse path from real use case to gap analysis to lawful
  repricing is explicit in `odd_sdlc`, not only in `SPEC_METHOD`
- `gaps` is no longer just structural evaluator reporting; it exposes semantic
  gap triage
- ambiguity and requirement-closure registers are used as live evidence inputs
  into gap interpretation
- the domain can distinguish implementation repair from requirement/design/goal
  or intent repricing
- the domain can distinguish uncovered-family expansion from shallow-existing
  realization that must be deepened in place
- constitutional insufficiency can lawfully generate new goals and/or intent
  vectors
- the resulting next vector is attached at the correct point in the method
  chain rather than forcing every mismatch into code repair
- the resulting next vector can bind through existing continuation and
  candidate-family routing hooks, including both fixed and dynamic
  graphfunction selection, without introducing a shadow orchestration path

## Links

- parent: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/B-001-refactor-odd-method-to-released-abg-boundary.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/T-002-refactor-odd-sdlc-from-pure-function-builder-framing-to-stateful-iterator.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/B-002-emit-repair-usable-fd-evidence-from-odd-sdlc-evaluators.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/T-003-enforce-spec-method-structured-build-topology-for-project-tenants.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- scenario: `/Users/jim/src/apps/odd_method/specification/scenarios/11-ambiguity-register-disambiguation-pipeline.md`
- prior_art: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test10/.ai-workspace/graph/edges/feedback_loop.yml`
- evidence: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/CODE_QUALITY_DEEP_DIVE_TEST28_PASS2.md`
- evidence: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/CODE_QUALITY_DEEP_DIVE_11_25_26_27_28.md`
