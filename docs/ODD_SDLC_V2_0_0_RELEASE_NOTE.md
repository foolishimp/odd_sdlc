# odd_sdlc v2.0.0 Release Note

## Release Identity

- product: `odd_sdlc`
- release: `v2.0.0`
- release branch: `release/2.0.0`
- predecessor candidate: `v2.0.0-rc.8`
- release state: final tapped major release for the `2.0.0` line
- release date: 2026-06-14

## Position

`v2.0.0` taps the TypeScript `odd_sdlc.TS` line as the current governed
software-domain package over the pinned ABIogenesis TypeScript substrate
`@abiogenesis/typescript-tenant@4.0.0-rc.19`.

The release carries the RC line through the latest ABG-owned re-entry, zoom,
depth traversal, and first-class ticket-workflow work:

- ABG-owned runtime re-entry and graph-function zoom are consumed without an
  SDLC-local cursor, retry loop, runtime-event writer, or closure authority.
- The deep SDLC overlay is a sibling traversal overlay, not a mutation of the
  existing current-full traversal.
- Depth pressure is carried through the published
  `Fg_decompose_depth_between_nodes` path and admitted decomposition trace
  foldback surfaces.
- Terminal review-grade builder pressure can create governed tickets, admit
  execution contracts, and re-enter through public `asset:ticket/<id>` starts.
- Review comments, live archives, and run summaries remain evidence until
  admitted through ticket/workflow carriers; they do not close work by
  commentary.

## Accepted Scope

This cut includes the completed release-window tickets through:

- T-165: optimising overlay bridge consumption and remaining depth work split
- T-200: deep SDLC traversal function, decomposition trace foldback, and live
  high-zoom proof
- T-162: first-class ticket workflow for governed change, final-node
  continuation, reviewer profile admission, and terminal-gap ticket intake

There are no active `odd_sdlc` tickets at the time of the release tap. Backlog
items remain future pressure and are not part of this release closure claim.

## Qualification Bundle

Release qualification for this cut uses:

- `npm run build:semantic`
- `npm run lint:semantic`
- `npm run lint:test-harness`
- `npm run guard:data-mapper-boundary`
- `npm run test:t162`
- `npm run test:t162:ticket-workflow-live`
- `npm run test:semantic`
- `git diff --check`
- `odd-sdlc-ts release-snapshot --release-identity 2.0.0`

## Data Mapper Release Proof

The final release proof for this cut is a data_mapper builder run against the
fresh `v2.0.0` release snapshot with the depth overlay enabled.

That run tests the builder of data_mapper. It is not a downstream product patch
lane. Generated data_mapper source must not be repaired directly from the
release proof. If the run exposes a defect in SDLC framework law, ABG/GTL
runtime consumption, prompt/admission/evaluator boundaries, event/replay,
projection, closure, depth traversal, ticket intake, or process supervision,
the defect belongs to `odd_sdlc` release work and the release cut must be
regenerated before publication.

## Known Limitations

- This release does not claim every backlog ticket is closed.
- Historical RC notes before `rc.8` are supporting release history only; this
  final note and the `2.0.0` release snapshot are the release-facing surfaces
  for the tapped cut.
- The package remains a local/private development-product package in this
  workspace; publication identity is represented by the release snapshot,
  branch, and tag.

## Release Boundary

- release branch: `release/2.0.0`
- release tag: `v2.0.0`
- release snapshot root:
  `release_snapshots/odd-sdlc-typescript-tenant/2.0.0`

The release tag is immutable. Further changes after this tap require a new
release process rather than mutation of `v2.0.0`.
