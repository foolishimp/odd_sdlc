# ADR-005 - Bootstrap Asset Set And Recursive Edge Contracts

**Status**: Active
**Date**: 2026-04-05
**Implements**: REQ-F-ASSET-001, REQ-F-ASSET-002, REQ-F-ASSET-003, REQ-F-ASSET-004

## Context

`odd_sdlc` needs a smallest lawful recursive graph that is worth publishing.

The boundary needs to be explicit about:

- which assets govern the first derivation
- which upstream and downstream graph contracts are published first
- how requirements appear as folderized requirement families rather than one
  monolith

## Decision

The bootstrap asset set is:

- `input_set`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- the requirement-family surface rooted at `specification/requirements/`

The first upstream graph-function contracts are:

- `{input_set} -> {specification/INTENT.md}`
- `{input_set} -> {specification/PRODUCT.md}`

The first downstream requirements contract is:

`{input_set, specification/INTENT.md, specification/PRODUCT.md} -> {specification/requirements/}`

The output requirements surface is carried as one or more family files under
`specification/requirements/`.

## Consequences

- the bootstrap graph is defined by explicit asset law rather than ambient
  folder habit
- the first recursive graph contracts are small enough to publish clearly
- the first output shape already matches the project's non-monolithic
  requirements model
