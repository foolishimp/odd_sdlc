# STRATEGY: World-Bearing Asset Semantics

**Author**: codex
**Date**: 2026-04-06T13:57:28Z
**Addresses**: ODD domain boundary; asset semantics; asset-type library direction; GTL4 candidate pressure through ODD
**Status**: Draft

## Summary

This post describes a target direction for `odd_method`.

It is not ratified design law.

The central observation is that `odd_method` is not just adding another domain
layer over GTL/ABG. It is testing a different answer to a deep programming
boundary:

- mature programming systems usually separate `data` from its world model
- application logic then reconstructs type, provenance, context, and meaning
- that reconstruction enterprise becomes a major source of entropy

The ODD direction is stronger:

- an asset should not be treated as inert payload
- an asset should carry identity, fulfillment, type, provenance, and
  convergence context
- functions should operate over typed world fragments, not anonymous blobs
- runtime should emit fact truth over those fragments, not rely on hidden
  controller reconstruction

This is a strategic claim about target direction, not current completion.

## Analysis

### Position

`odd_method` can use the mature destination of programming constructs as
evidence without being constrained by the exact path conventional programming
took to get there.

That means:

- learn from type systems, modules, proof, and composition
- do not blindly inherit historical compromises
- especially do not inherit the assumption that "data" must be stored as an
  inert thing and later reinterpreted by controllers, services, or prompt
  bundles

This matters because ODD is already pressuring toward:

- `Asset`
- `AssetType`
- `AssetCollection`
- `AssetBinding`
- `Function`
- `FunctionCall`

Those are not merely convenience wrappers. They are candidate replacements for
the old division between payload and world model.

### The Problem With Detached Data

In most programming systems:

- data is stored as bare payload
- meaning is stripped or weakened
- code later tries to reconstruct:
  - what the thing is
  - what domain role it fulfills
  - what constraints apply
  - what transforms can consume it
  - what "done" means for it

This reconstruction burden produces:

- hidden controller logic
- duplicated schema meaning
- ambient prompt semantics
- weak provenance
- repeated ad hoc classification
- fragile runtime behavior

This is not an incidental annoyance. It is one of the core reasons application
systems accumulate entropy.

### ODD Direction: World-Bearing Assets

The ODD direction should be the opposite.

An `Asset` should not be "data plus later interpretation".

It should be a world-bearing carrier with at least:

- URI identity
- fulfillment surface
- declared semantic type
- provenance
- topology participation
- convergence context

The corresponding `AssetType` should not be a string enum.

It should become a reusable semantic library surface carrying:

- structural role
- deterministic evaluation
- probabilistic gap evaluation
- probabilistic descriptive framing
- proof and closure expectations
- compatibility with producing and consuming functions

That lets the domain say what a thing *is* without deferring all meaning to:

- controller code
- one global prompt
- one hidden policy bundle
- later ad hoc reconstruction

### Why This Matters For Graph Functions

`GraphFunction` changes the public carrier model of GTL/ABG.

In `GTL/ABG 3.x`, the public unit is not "the project graph". It is:

- a callable function
- with bound inputs
- that materializes a concrete topology
- and is then iterated by ABG

If the inputs to those functions are merely untyped payloads, the graph-function
model is weaker than it should be.

If the inputs are world-bearing assets, then functions become clearer:

- they state which kinds of world fragments they accept
- they state what they produce
- they can inherit evaluation and proof semantics from the types they operate on
- they can be reasoned about as meaningful domain transforms

This is why ODD should keep pushing toward typed assets rather than sliding back
into "folder of files plus importer logic".

### AssetType As A Library Surface

The likely long-term outcome is that `AssetType` becomes a real library, not a
flat register.

That library will eventually want:

- reusable type definitions
- composed or trait-like semantics
- taxonomy
- shared evaluation rules
- shared descriptive framing
- transform compatibility rules

Examples:

- `design_document`
- `testcase_bundle`
- `legal_brief`

These should not remain isolated leaf labels forever.

They will likely want shared parent or facet semantics such as:

- `structured_document`
- `authority_surface`
- `verification_surface`
- `argument_surface`
- `evidence_surface`

That is how ODD can grow from ad hoc asset typing into a coherent semantic
carrier system.

### Strategic Boundary With GTL

This post does **not** argue that GTL should absorb all of this now.

The cleaner strategy is:

- keep `GTL3` stable
- let `odd_method` prove the value of world-bearing asset semantics
- observe what becomes repeatedly load-bearing
- only then decide what belongs in a future GTL boundary

This is why ODD is the right proving ground for GTL4 candidate pressure.

Possible future GTL4 pressure points include:

- first-class semantic carriers
- type-driven function signatures
- richer binding semantics
- reusable evaluation descriptions attached to semantic carrier types

But those should be ratified only if ODD proves they are universal rather than
domain-local.

### Immediate Consequences For ODD

The near-term ODD design should follow these rules.

1. Treat `AssetType` as a library object, not a label.
2. Keep URI fulfillment narrow at first: `file://`, `http(s)://`, later
   `mcp://`.
3. Let functions declare accepted and produced asset-node types explicitly.
4. Do not let semantic meaning live only in prompts or controllers.
5. Treat raw payload as a degenerate case, not the primary case.
6. Keep convergence and gap semantics near the asset types and functions they
   belong to.
7. Keep proving pressure in ODD until the boundary with GTL becomes obvious.

### Current Reality vs Target Direction

Current reality:

- `odd_method` now has the first bounded ODD asset/function model in working
  commentary at
  [20260406T111823Z_SCHEMA_odd-asset-function-domain-model.md](/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260406T111823Z_SCHEMA_odd-asset-function-domain-model.md)
- `odd_sdlc` is the first concrete domain instantiation in
  [ODD_SDLC_TRANSLATION.md](/Users/jim/src/apps/odd_method/build_tenants/common/design/ODD_SDLC_TRANSLATION.md)

Target direction:

- ODD treats assets as world-bearing carriers
- asset types become a reusable semantic library
- named functions operate over typed world fragments
- ABG runtime facts describe execution over those fragments without hidden
  reconstruction logic

## Recommended Action

1. Ratify `AssetType` in ODD design as a semantic library surface rather than a
   label.
2. Add an explicit `AssetType Semantics` section to the first ratified ODD
   design document.
3. Start the first small ODD asset-type library with a few real composed domain
   types rather than a large flat list.
4. Keep GTL changes out of scope until ODD proves which type semantics are
   universal and load-bearing.
