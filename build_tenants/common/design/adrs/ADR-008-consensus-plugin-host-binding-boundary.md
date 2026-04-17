# ADR-008 - Consensus Plugin And Host-Binding Boundary

**Status**: Active
**Date**: 2026-04-17
**Implements**: REQ-F-GFUNC-005, REQ-F-ODDSDLC-023

## Context

The first retained consensus proof in `odd_sdlc` was published only through
design-specific graph functions:

- `review_design_consensus_round`
- `review_design_by_consensus`

That proved the higher-order shape, but it also made consensus appear to be an
`odd_sdlc`-owned design feature rather than a reusable line capability.

The current line needs a cleaner split:

- one reusable shared plugin contract
- one or more host bindings over typed local subjects
- no ambiguity about which layer owns the consensus law

## Decision

The line adopts a plugin-and-host-binding split for consensus.

- the shared reusable plugin is published through:
  - `review_subject_consensus_round`
  - `review_subject_by_consensus`
- host packages publish local bindings over that plugin for concrete subject
  types
- `odd_sdlc` currently proves two host bindings:
  - design review
  - comment review

The shared plugin owns:

- the stable subject/assessment/decision/reviewed-subject contract
- injected stage naming
- consensus policy metadata

Host bindings own:

- local subject typing
- local reviewed-output typing
- downstream consumption of the reviewed result

## Consequences

- the catalog can distinguish shared plugin capability from host-specific
  bindings
- `odd_sdlc` remains a proving consumer of consensus capability, not its unique
  constitutional owner
- later service-backed orchestration can replace worker realization without
  changing the outer plugin contract
