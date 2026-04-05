# ADR-001 - Fresh Constitutional Line And Upstream Boundary

**Status**: Active
**Date**: 2026-04-05
**Implements**: REQ-F-UPSTREAM-001, REQ-F-UPSTREAM-002, REQ-F-UPSTREAM-003

## Context

`odd_method` is being created because the desired product direction no longer matches
the current `genesis_sdlc` carrier.

`genesis_sdlc` remains valuable as migration source material, but it carries
runtime, control-plane, and SDLC-specific baggage that `odd_method` does not want to
inherit by default.

## Decision

`odd_method` is a fresh constitutional line.

It owns its own:

- method surface
- intent
- product
- requirements
- design

`genesis_sdlc` is treated as upstream source material and provenance input.

Nothing carries forward by default.

Any retained upstream truth must be explicitly re-adopted and classified on the
`odd_method` line.

`odd_method` does not assume `.gsdlc` topology, `genesis_sdlc` runtime layout, or
post-dispatch product-local runtime behavior as default product law.

## Consequences

- `odd_method` can stay lightweight without hidden inherited law
- provenance to `genesis_sdlc` remains inspectable
- compatibility with `genesis_sdlc` becomes an explicit feature decision rather
  than ambient baggage
- downstream design and code must derive from `odd_method` surfaces, not from
  inherited precedent
