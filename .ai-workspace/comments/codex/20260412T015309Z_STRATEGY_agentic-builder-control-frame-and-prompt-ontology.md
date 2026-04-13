# STRATEGY: Agentic Builder Control Frame And Prompt Ontology

**Author**: codex
**Date**: 2026-04-12T01:53:09Z
**Addresses**: Requirements-first framing for ABG prompt/control-frame buildout over stateful assets, with `odd_sdlc` as the current proving domain
**Status**: Draft

## Scope Boundary

This note is not a prompt-tuning patch note.

It is a strategy note for the next requirement/design wave.

The immediate issue is visible in the live `test28` run:

- the runtime is now behaving much better
- the agentic builder is traversing deep into the graph
- but some prompts are still shaped too much like giant serialized function calls

That is no longer the right abstraction.

The model has shifted.

## Position

The builder is not a pure function executor.

It is a governed agentic builder working over a stateful asset.

So the prompt should not try to front-load the whole world as serialized state.

The prompt should define:

- the governance frame
- the ontology of the current asset
- the current obligations
- the allowed tools and references
- the delivery and assessment boundary

The asset itself, the registers, and the workspace are the state.

The prompt is the control frame.

## Core Thesis

The right prompt model for ABG is:

- references over serialization
- ontology over bulk payload
- delivery over narration
- traceability over prose completeness
- iterative repair over one-shot function-call framing

This means prompt quality should be judged by whether it gives the builder:

- situational awareness
- lawful boundaries
- a delivery target
- requirement-bearing obligations
- enough freedom to inspect, decompose, and repair

It should not be judged by how much state can be inlined.

## Control Frame

The control frame should be ordered like this.

### 0. `SPEC_METHOD` Boundary And Execution Role

This comes first.

Before the asset, before the gap, before the environment, the builder needs to know:

- this is a governed build under `SPEC_METHOD`
- the agent is acting as a bounded builder, not a free author
- it may inspect, decompose, repair, and where allowed delegate/subdivide
- it may not rewrite constitutional truth, governing method, or acceptance law
- it must work inside the declared contracts, traceability rules, and assessment lane

This is the execution identity of the agent.

### 1. Axiomatic Ontology

The builder needs to know:

- what kind of asset this is
- what it refines
- what laws it lives under
- what must remain true
- what counts as lawful transformation

This is the ontological frame.

### 2. Delivery Obligation

The builder must be forced to deliver, not merely comment.

The frame should make explicit:

- the target asset or realized descendants must be changed
- assessment alone is not sufficient
- explanation without transformation is not completion

### 3. Traceability Obligation

The builder must understand that the transformed asset is not only judged semantically.

It is judged by whether the runtime can prove requirement flow through it.

So traceability is not a reporting afterthought.

It is part of the work contract.

### 4. Tools And References

The prompt should point the builder at:

- the current target asset path
- the relevant authority surfaces
- the relevant registers
- the assessment output path
- the allowed operational tools

This should be reference-first.

The runtime should pass paths and compact summaries, not giant register dumps by default.

### 5. Iterative Repair

The builder should be allowed to:

- inspect current state
- determine what is already realized
- decompose if needed
- continue repair
- reassess
- repeat while signal changes

This is the correct builder behavior.

## Why The Old Prompt Shape Is Wrong

The older prompt shape still carries pure-function bias:

- inline the state
- serialize the inputs
- invoke one bounded transformation
- wait for a single answer

That is too narrow for a stateful builder over evolving assets.

In the current live system this shows up as:

- oversized register dumps
- large environment inventories
- repeated inert structure
- insufficiently sharp top-level mission framing

The prompt becomes long without becoming proportionally more useful.

## What The Prompt Should Actually Carry

Inline:

- control-frame identity
- asset kind, target, and ontology
- concise gap summary
- deterministic obligations that must be cleared
- concise required-context summary
- output contract and assessment lane

By reference:

- full closure registers
- full environment inventories
- long requirement catalogs
- large prior artifact sets
- other supporting materials the builder can inspect on demand

This is the right split because the workspace is already the state carrier.

## Observed In `test28`

The live `test28` run now gives useful real-world signal for the next platform-design step.

### 1. Fresh Repair Prompts Are Real

The runtime is no longer redispatching stale prompt state.

Observed on live same-edge repair:

- `derive_test_module_surface_20260412T021216994761Z`
- `derive_code_surface_20260412T021828504359Z`

In both cases the manifest was freshly minted, the target binding reflected current workspace truth, and the prompt explicitly told the builder to inspect the current target asset before proceeding.

This is an important platform baseline.

### 2. Retry And Lawful Re-entry Are Not The Same

`test28` shows two distinct phenomena:

- same-edge repair retry on `derive_test_module_surface`
- later lawful re-entry to `derive_code_surface` after downstream asset changes altered the traceability state

This distinction matters.

The platform design cannot treat every reopened edge as "just a retry".

Some reopenings are:

- retry of an unresolved attempt
- lawful re-entry because workspace truth has changed
- replacement after correction or changed authority

ABG requirements need to name those separately.

### 3. The Control Frame Is Working Better Than The Evidence Payload

The prompt control frame is now much healthier than the old pure-function-style payload.

What is working:

- current-state-first builder instructions
- fresh target bindings
- narrowed failing-set prompts
- clear output/assessment lane

What is still weak:

- deterministic evidence is often only `{'returncode': 1, 'stdout': '', 'stderr': ''}`
- some top-level status fields remain too coarse or misleading on reopened edges
- large environment/context payloads are still heavier than they need to be

So the next prompt frontier is no longer retry identity.

It is evidence quality and reference-first payload shaping.

## ABG / GTL / Domain Split

### GTL Owns

- the published graph topology
- asset families and their declared schemas
- required-context declarations
- output-contract declarations
- graph-vector policy declarations
- the lawful publication boundary the runtime must interpret

GTL is the declared build structure.

It is where the builder graph, dependency shape, and policy hooks are published.

### ABG Owns

- runtime interpretation of published GTL
- fresh manifest construction
- the generic control-frame structure
- reference-first prompt policy
- trustworthy top-level state summary
- retry, re-entry, and replacement attempt semantics
- stationarity / retry law
- generic assurance lanes
- proof / closure / escalation mechanics

### Domain Owns

- asset ontology details
- evaluator meaning
- traceability law
- domain-specific invariants
- rich edge-specific repair evidence
- any explicit hard-stop override

So:

- GTL should publish the graph, contracts, and policy hooks
- ABG should define and execute the generic builder frame against published GTL
- `odd_sdlc` should populate the domain law, asset ontology, and evaluator semantics inside that structure

## Prompt Design Goals

The builder prompt should optimize for:

1. Fast orientation
2. Correct boundary understanding
3. Immediate ability to act
4. Requirement-bearing traceability awareness
5. Confidence that the current workspace, not the prior prompt, is truth

It should not optimize for:

1. maximal serialization
2. exhaustive inline state
3. giant one-shot context payloads

## Implication For Requirements

This is not yet fully specified at the ABG requirement layer.

The next requirement wave should explicitly define:

- control-frame requirements for agentic builder invocation
- what must be inline vs reference-carried
- retry/iteration expectations for stateful assets
- retry vs lawful re-entry vs replacement semantics
- required prompt identity under `SPEC_METHOD`
- minimum delivery, traceability, and assessment instructions
- minimum structured deterministic evidence available to the builder
- domain override boundaries
- GTL publication boundary vs ABG runtime interpretation boundary

This note is the start of that requirement buildout, not its endpoint.

## Immediate Direction

The next prompt/control-frame wave should:

1. Treat the prompt as a builder charter, not a function argument
2. Put `SPEC_METHOD` and execution role first
3. Inline ontology, obligations, and target
4. Replace large serialized registers with concise summaries plus references
5. Preserve deterministic assurance outside the agent while making it visible to the agent
6. Distinguish retry from lawful re-entry when the same edge reopens
7. Let the agent inspect, subdivide, and self-iterate until signal stops changing

## Working Conclusion

The focus should now shift from "how much state can we fit in the prompt" to:

- how sharply can we define the governed builder role
- how clearly can we state the axioms of the asset
- how strongly can we force delivery and traceability
- how effectively can we give the builder references, tools, and assurance lanes
- how clearly can we separate GTL publication, ABG runtime, and domain law
- how far can we let the system self-iterate before true stationary failure

That is the right direction for the next ABG + `odd_sdlc` prompt/control-frame requirements.
