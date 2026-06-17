# STRATEGY: Traversal Unit Entry Triage

**Author**: codex
**Date**: 2026-06-17T11:31:14Z
**Addresses**: `.ai-workspace/tickets/active/T-203-factor-code-builder-graph-function-for-uat-test-generation-and-ticket-reentry.md`
**Status**: Open
**Updated**: 2026-06-17T11:58:29Z

## Summary

This post captures a design discussion. It is commentary, not ratified
specification or design.

The proposed direction is to strictly name the closeable traversal unit at the
GTL/ABG level, then adopt it in `odd_sdlc`:

```text
TraversalUnit<A, B> = one selected typed graph-vector traversal attempt A -> B
```

Public start and ticket re-entry should begin with entry triage traversal units:

```text
start(next)   = traverse<bootstrap, conformant>
start(ticket) = traverse<ticket, triage>
```

The consequence fold of those units is the bind boundary. In `odd_sdlc`, that
means the scenario launcher and public-start preselection should not choose the
post-triage implementation overlay directly.

## Current Reality

The building blocks already exist.

- `GraphVector` supplies the typed `A -> B` edge boundary.
- `constructSdlcTraversalOverlayCatalog()` in
  `build_tenants/typescript/code/src/graph/overlays.ts` supplies the existing
  overlay catalog.
- `constructSdlcGraphFunctionCatalog()` and `constructSdlcGtlModule()` in
  `build_tenants/typescript/code/src/graph/catalog.ts` and
  `build_tenants/typescript/code/src/graph/module.ts` supply graph function and
  executive publication.
- `build_tenants/typescript/code/src/operator/plugins/plugin_contracts.ts`
  declares transform, evaluate, and consequence plugin roles.
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  already carries ledgers, closure decisions, next action projections, admitted
  state refs, consequence projection refs, and consequence traversal action
  bindings.
- `specification/requirements/16-edge-gain-closure-contract.md` already states
  that edge closure is not artifact existence, route completion, postflight
  success, or worker prose.
- `specification/requirements/18-typed-construction-algebra.md` already names
  typed construction algebra pressure around transform/evaluate/consequence
  staging.

The gap is not absence of pieces. The gap is that GTL/ABG does not yet name
those pieces as one strict closeable traversal unit, and `odd_sdlc` entry
selection still risks being treated as an overlay shortcut rather than as
traversal consequence.

## Analysis

The minimal traversal unit is not an overlay, graph function, worker turn,
plugin call, or file write. That statement belongs at the GTL/ABG level because
it defines the unit that graph-function composition and continuation bind over.

It is one closeable typed graph-vector attempt:

```text
TraversalUnit<A, B> =
  GraphVector<A, B>
  + selected composition identity
  + selected overlay binding
  + selected edge assurance contract
  + attempt envelope
  + admitted transform evidence
  + admitted evaluate evidence
  + worksite evidence
  + edge fulfillment ledger
  + edge closure decision
  + next action projection
  + admitted state / consequence projection commit
```

The plugin split follows from that unit:

```text
transform.C    = candidate construction
evaluate.C     = candidate judgment and rule evidence
consequence.C  = deterministic commit, closure, residual pressure, and route
```

`consequence.C` should not build product content and should not invent semantic
judgment. It should fold admitted transform/evaluate evidence into closure truth
and continuation truth. At the substrate level, this makes consequence the
formal bind point for `TraversalUnit<A, B>`.

The monadic bind boundary is consequence:

```text
bind(unit<A, B>, next<B, C>) =
  close      -> feed B into next traversal
  retry      -> retry A -> B with retry context
  repair     -> route repair pressure
  re-enter   -> project lawful graph re-entry
  reprice    -> route to the declared repricing layer
  block      -> stop with residual pressure
```

This clarifies public start:

```text
start(next) != directly choose lite/framework/full
start(next) == traverse<bootstrap, conformant>
```

After `traverse<bootstrap, conformant>` closes, its consequence can select:

```text
profile.thread       -> lite_design_module_implementation
profile.min_fp       -> framework_smoke_min_fp
profile.breadth      -> current/full or domain product route
conformance blocked  -> block with conformance gaps
```

Ticket re-entry has the same shape:

```text
start(ticket) != directly choose ticket workflow or current full
start(ticket) == traverse<ticket, triage>
```

After `traverse<ticket, triage>` closes, its consequence can select:

```text
close/defer ruling         -> stop or no-op projection
ticket workflow route      -> ticket_workflow
current-full continuation  -> current_full_traversal
repair/re-enter ruling     -> selected overlay/vector re-entry
invalid ticket authority   -> block with ticket admission gaps
```

The existing overlay catalog remains useful as `odd_sdlc` product adoption. It
should not be replaced by a new large local registry. The consequence fold
should consume graph/overlay catalogs when binding the next lawful graph entry.

## GTL/ABG Target Direction

The desired ratification target is GTL/ABG substrate law:

```text
TraversalUnit<A, B> is the closeable graph-vector traversal atom.
consequence.C is the bind boundary for TraversalUnit composition.
```

That should become a substrate-level formalism because it governs all graph
function composition, not only `odd_sdlc` public start.

The substrate definition should name:

```text
unit identity       = selected graph vector A -> B
selection identity  = selected composition/regime/plugin binding
attempt identity    = one runtime attempt envelope
evidence identity   = admitted transform/evaluate evidence
closure identity    = consequence-owned close/retry/repair/re-enter/reprice/block
bind identity       = next lawful traversal projection or terminal state
```

`odd_sdlc` then adopts that law for its two entry units:

```text
TraversalUnit<bootstrap, conformant>
TraversalUnit<ticket, triage>
```

This preserves authority direction:

```text
GTL/ABG defines traversal-unit and bind law.
odd_sdlc defines SDLC-domain entry units, overlays, edge contracts, and product
consequence semantics.
```

The payoff is compositional cleanliness. `odd_sdlc` no longer needs to encode
implicit traversal mechanics in public start, scenario launchers, or local
overlay shortcuts. It becomes a composition of substrate traversal units:

```text
odd_sdlc =
  SDLC entry units
  + SDLC graph functions
  + SDLC overlays
  + SDLC edge assurance contracts
  + SDLC product consequence policies
```

The substrate supplies the common traversal algebra. The product supplies the
domain meaning of each unit and its lawful consequences.

## Use Cases

Cold Rust hello start:

```text
next
  -> traverse<bootstrap, conformant>
  -> consequence selects lite entry for thread/trivial profile
  -> traverse<conformant, lite implementation/test result>
```

The live failure observed under T-203 showed conformance and lite selection, but
not a completed traversal unit for product materialization. The missing
`Cargo.toml` is a symptom. The deeper gap is missing attempt/evidence/ledger/
closure/commit for the selected implementation unit.

Ticket re-entry:

```text
ticket asset
  -> traverse<ticket, triage>
  -> consequence selects ticket workflow, current-full continuation, or repair
     re-entry from admitted ticket authority
```

Failed test execution:

```text
implementation/test traversal
  -> evaluate admits execution failure
  -> consequence emits repair/re-enter closure and allowed traversal action
```

Conformance blocked:

```text
traverse<bootstrap, conformant>
  -> consequence blocks with conformance gaps and durable evidence
```

## Recommended Action

Use T-203 to adopt and prove the minimal entry-unit strategy in `odd_sdlc`, but
file a GTL/ABG substrate ticket for the formal definition.

1. File an upstream GTL/ABG ticket to define `TraversalUnit<A, B>` as the
   closeable graph-vector traversal atom and `consequence.C` as the bind
   boundary.
2. In `odd_sdlc`, name `TraversalUnit<bootstrap, conformant>` and
   `TraversalUnit<ticket, triage>` as standard entry units.
3. Keep the existing graph and overlay catalogs. Add only the smallest lookup
   needed for consequence/bind to resolve selected standard entries.
4. Move cold-start and ticket-entry proportionality pressure toward
   consequence-owned next action projection, instead of scenario launcher
   sequencing or public-start direct overlay jumps.
5. Update the Rust hello live scenario to prove the unit chain:

```text
entry unit closes -> consequence selects lite -> lite unit materializes product
and execution evidence
```

The implementation should not introduce a second registry, a new runtime loop,
or a product-specific shortcut for Rust hello. The intended product fix is the
formal traversal unit and common entry triage/bind boundary.
