# STRATEGY: Domain Builder As Pre-Mapping Bounded-Context Construction

**Author**: codex
**Date**: 2026-04-14T01:14:08Z
**Addresses**: `specification/PRODUCT.md`; `specification/GOALS.md`; boundary between the current `data_mapper` proving corpus and a future bounded-context-construction domain
**Status**: Draft

## Summary

This post describes both current reality and target direction.

Current reality:

- `odd_method` currently defines one active product line centered on outcome-driven
  development, explicit asset meaning, asset graphs, asset bindings, and
  homeostatic SDLC work on the live `odd_sdlc` line; see
  [PRODUCT.md](/Users/jim/src/apps/odd_method/specification/PRODUCT.md).
- the current wave keeps inherited-project qualification centered on
  `data_mapper` as the standing regression corpus; see
  [GOALS.md](/Users/jim/src/apps/odd_method/specification/GOALS.md).

Target direction:

- add a complementary domain tentatively named `domain_builder`
- use that domain to construct a complete bounded context from an
  organisation's business systems before downstream mapping work
- treat `data_mapper` as the domain that maps between bounded contexts, not the
  domain that first discovers what those contexts really are

The strategy claim is simple:

- bounded-context construction should be modeled as its own domain concern
- mapping should consume that contextual truth rather than guessing it from
  schemas and payload shapes alone

## Analysis

### Findings

`odd_method` already has the right product primitives for this direction.

[PRODUCT.md](/Users/jim/src/apps/odd_method/specification/PRODUCT.md) already
defines:

- assets as durable surfaces with semantic type, provenance, and convergence
  context
- asset graphs over typed asset nodes
- asset bindings as the mapping from concrete assets into typed nodes
- technology capability assets and policy surfaces
- homeostatic observation, gap triage, lawful re-entry, and constitutional
  repricing

Those primitives are sufficient to model more than software build artifacts.
They can also model business-system truth if the line chooses to.

The current wave does not yet name bounded-context construction as a first-class
domain.

[GOALS.md](/Users/jim/src/apps/odd_method/specification/GOALS.md) keeps the
current proving corpus centered on `data_mapper`, but that file does not yet
separate two distinct problem classes:

- constructing the bounded context itself
- mapping between already-understood bounded contexts

That missing split matters because those are not the same act.

If the line starts with mapping too early, it tends to infer meaning from the
wrong surfaces:

- tables
- field names
- JSON payloads
- transport contracts

That is useful but insufficient.

The more prior question is:

- how does a business concept or attribute actually exist inside the
  organisation's world model

That requires surfaces such as:

- business systems and operational ownership
- workflows and state transitions
- events that create or change the concept
- policy and constraint sources
- reports, APIs, forms, and persistence surfaces
- copied, derived, stale, and overloaded representations

So the likely strategic split is:

- `domain_builder` constructs one bounded context as a governed current truth
- `data_mapper` maps between two or more bounded contexts using that truth

### Implications

If this direction is adopted, `domain_builder` should not be framed as generic
enterprise documentation.

It should be framed as a bounded-context-construction SDLC with explicit output
surfaces such as:

- concept inventory
- authority and ownership surfaces
- attribute existence and derivation surfaces
- event and lifecycle surfaces
- boundary and adjacency surfaces
- declared loss/enrichment notes for later cross-context mapping

At attribute level, the domain should answer questions like:

- where is this attribute authoritative
- what business event creates it
- what makes it valid
- where is it copied or transformed
- where is it stale, inferred, or overloaded

That is the contextual substrate `data_mapper` would later consume.

This also fits the current `odd_method` line better than forcing more pressure
into `data_mapper`.

The live line already distinguishes:

- constitutional `WHAT` in `specification/`
- realization `HOW` in `build_tenants/`
- homeostatic observation and repricing rather than one-shot completion

A bounded-context-construction domain is therefore a lawful expansion of the
line, not a break from it.

## Recommended Action

Keep this as commentary until the line decides whether bounded-context
construction is in scope as a first-class domain.

If the direction is accepted, the next lawful steps are:

1. Reprice [PRODUCT.md](/Users/jim/src/apps/odd_method/specification/PRODUCT.md)
   so the line explicitly distinguishes bounded-context construction from
   downstream cross-context mapping.
2. Add a strategy or requirement surface that states the proposed outputs of a
   bounded-context-construction domain and its boundary with `data_mapper`.
3. Decide whether `domain_builder` is:
   - a new `odd_method` domain package parallel to `odd_sdlc`
   - or a future proving domain that first matures through commentary and ticket
     layers before package instantiation.
4. Keep `data_mapper` focused on inter-context mapping and use the new domain to
   answer the earlier question of how a concept actually exists in the
   organisation before mapping is attempted.
