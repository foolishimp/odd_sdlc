# STDO Review: T-032 Query And Gap Projections

**Date**: 2026-04-26
**Ticket**: `T-032`
**Status**: Completed review

## Result

Pass.

The TypeScript tenant now has read-only query-domain, gap, dossier, and span
analysis projections over SDLC carriers, GTL publication, and ABI replay truth.

## STDO Checks

| Method | Review |
| --- | --- |
| `SPEC_METHOD.md` | Pass. The projection layer realizes visibility requirements without changing source truth. |
| `TICKET_METHOD.md` | Pass. Closure evidence names projection code, proof lane, full semantic lane, and lint. |
| `DESIGN_MODULE_METHOD.md` | Pass. The read model is separated from graph publication and execution. |
| `ODD_METHOD.md` | Pass. Current edge and gap status derive from ABI replay projection; SDLC projection does not emit events or pick hidden traversal. |

## Residual Risk

Future CLI/API adapters must call these projection functions instead of
reconstructing the query or gap story from filesystem state.

## Correction Addendum

The corrective review flagged a possible split between the supplied GTL module
and the reconstructed SDLC catalog. `projectSdlcQueryDomain` now fails closed
when the admitted module is missing catalog graph functions, and
`test_t032_query_gap_projection.test.mjs` proves the stale-module case.
