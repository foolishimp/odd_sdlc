# WHAT/HOW Boundary Audit

**Status**: Active commentary
**Date**: 2026-04-09T17:53:10Z
**Workspace**: `/Users/jim/src/apps/odd_method`
**Purpose**: First-pass audit to tighten the boundary `specification = WHAT`, `build_tenants = HOW` without a topology rewrite

## Decision

Use this rule:

- `specification/` defines `WHAT`
- `build_tenants/` contains one or more instances of `HOW`
- `build_tenants/common/` is shared `HOW`
- `docs/` and `.ai-workspace/comments/` are supporting explanation, not authority

This keeps the SDLC domain stable while allowing multiple realization lines and
future stack rebuilds.

## Tightening Applied In This Pass

The live authority and orientation surfaces were tightened so the boundary is
now explicit in:

- `specification/INTENT.md`
- `specification/requirements/05-realization-topology.md`
- `README.md`
- `build_tenants/README.md`
- `build_tenants/TENANT_REGISTRY.md`
- `build_tenants/odd_sdlc/python/README.md`
- `build_tenants/odd_service/python/README.md`

## Move Down To HOW

These are the clearest active examples of `HOW` detail still living too high in
specification-owned surfaces.

### `specification/PRODUCT.md`

The explicit toy-graph path listing is realization detail and should move down
into tenant-local design or proving surfaces over time:

- concrete path-level graph edges rooted at:
  - `build_tenants/common/design/20-generated-feature-decomp.md`
  - `build_tenants/odd_sdlc/python/design/40-generated-implementation-design.md`
  - `build_tenants/odd_sdlc/python/code/odd_sdlc_proving_impl/`
  - `build_tenants/odd_sdlc/python/test_env/50-generated-run-archive.md`
  - `docs/40-generated-release.md`

The product should keep the domain commitments and executive/public contract.
The exact file-path proving graph is tenant-local `HOW`.

### Path-Precise Proving-Subset Naming

Where spec surfaces still talk in exact package or path names such as
`odd_sdlc_proving_impl`, that is `HOW` unless the name itself is part of a
public contract. Those references should migrate to tenant-local proving/design
law.

## Move Up To WHAT

No urgent active `WHAT` leak was found that is missing entirely from
`specification/`.

The main live tenant design surfaces already derive from spec and mostly behave
as translation or realization law rather than rival authority:

- `build_tenants/odd_sdlc/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/odd_service/python/design/ODD_SERVICE_TRANSLATION.md`

That said, every future tenant-local design change should be checked against
this rule:

- if it defines domain meaning, lifecycle truth, asset semantics, public
  contracts, or acceptance truth, move it up into `specification/`
- if it defines layout, binding, stack choice, runtime wiring, install shape,
  package layout, or proof lane shape, keep it in `build_tenants/`

## Leave In Place

These surfaces are correctly placed if they continue to behave as derived
realization law:

- `build_tenants/TENANT_REGISTRY.md`
- `build_tenants/common/design/ODD_SDLC_TRANSLATION.md`
- `build_tenants/odd_sdlc/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/odd_service/python/design/ODD_SERVICE_TRANSLATION.md`
- tenant-local `README.md` files describing code/design/test layout and run
  commands

## Working Review Rule

For every section under review, classify it with one question:

`Does this tell us what odd_method is, or how one realization currently does it?`

If it answers:

- `what it is` -> `specification/`
- `how it is realized` -> `build_tenants/`

## Next Safe Pass

1. Rework `specification/PRODUCT.md` so it keeps product/domain `WHAT` but
   stops carrying the current path-exact proving graph as authoritative text.
2. Audit `specification/scenarios/` for path-exact proving-subset references
   that are really tenant-local `HOW`.
3. Audit tenant-local design only for accidental new `WHAT` additions during
   future work. Do not flatten tenant-local design into spec by reflex.

## Bottom Line

This is not a topology rewrite.

It is a discipline refactor:

- keep `specification` clean as `WHAT`
- keep `build_tenants` clean as multiple instances of `HOW`
- allow the SDLC domain to stay stable while `HOW` can be rebuilt across
  changing stacks and product lines
