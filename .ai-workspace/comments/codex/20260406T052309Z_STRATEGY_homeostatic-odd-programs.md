# STRATEGY: Homeostatic ODD Programs

**Author**: codex
**Date**: 2026-04-06T05:23:09Z
**Addresses**: `odd_program` as the operative programming unit in `odd_method`
**Status**: Draft

## Summary

`odd_method` is not adding orchestration around ordinary programs.
It is moving toward a programming paradigm where programs themselves become
ODD-aware participants in a governed convergence system.

In that model, a program is no longer an isolated utility with inputs and
outputs interpreted elsewhere. It becomes a managed callable transformation over
typed asset dependencies, executed through ABG evaluator regimes and made
legible through replayable runtime truth.

## Analysis

This direction becomes visible once `Asset`, `AssetType`, asset dependency
topology, and named functions are treated as first-class ODD carriers.

The old pattern is:

- write a deterministic script or service
- wrap it in orchestration
- observe it from outside
- reconstruct meaning after the fact from data, logs, and side effects

The emerging ODD pattern is:

- declare a world of typed assets and dependency relations
- define an `odd_program` as a managed callable transformation over that world
- bind concrete assets into the declared topology
- execute through ABG regimes:
  - `F_D` for deterministic checks and construction
  - `F_P` for bounded probabilistic construction or evaluation
  - `F_H` where human attestation is required
- emit runtime fact truth as the authoritative execution history
- project current checkpoints and gaps from that history

This means a deterministic program is not merely “called by the system.”
It participates in the larger convergence enterprise. It has:

- declared semantic inputs and outputs
- asset-type meaning
- attributable runtime effects
- a lawful place in proof, closure, correction, and replay

At the invocation boundary, the clean shape is:

```text
CLI
-> odd_program invocation
-> asset binding over dependency topology
-> ABG(F_D, F_P, F_H)
-> emitted runtime truth
-> projection / audit / proof
```

The outer CLI is just an invocation surface.
The semantics live in the `odd_program`, the typed asset world, and the ABG
runtime model.

This is why the direction looks like orchestration while actually replacing a
large part of the normal programming stack. The ordinary split:

- program
- orchestration
- monitoring
- review

starts collapsing into one governed construct:

```text
ODD program
= typed asset world
+ dependency topology
+ callable transformation
+ evaluator-regime participation
+ runtime truth
+ correction / proof / closure
```

That is a stronger and more ambitious position than “workflow tooling.”
It suggests `odd_method` is a candidate programming paradigm in which
deterministic utilities, bounded probabilistic work, and human attestation all
participate in one homeostatic system trying to restore or maintain convergence
over a declared world model.

The main discipline this requires is strict resistance to hidden imperative
fallbacks. If the real program becomes an ambient script and ODD only wraps it,
the paradigm collapses. The deterministic or probabilistic worker may still use
ordinary tools internally, but the governing abstraction must remain the
`odd_program` and its declared role in the asset topology.

## Recommended Action

1. Start naming the operative unit explicitly as `odd_program` in ODD design
   work when the intent is “managed callable transformation over typed asset
   dependencies.”
2. Keep `F_D` utilities and constructors subordinate to declared ODD programs,
   not as hidden competing programs.
3. As `odd_sdlc` grows, evaluate every new deterministic tool by asking whether
   it is:
   - a lawful ODD program participant
   - or an accidental shadow runtime
4. Defer any GTL change until repeated ODD use shows that this program model is
   universal and load-bearing rather than domain-specific.
