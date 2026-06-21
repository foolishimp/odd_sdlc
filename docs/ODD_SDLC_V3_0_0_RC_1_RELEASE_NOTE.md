# odd_sdlc 3.0.0-rc.1 Release Candidate Note

This checkpoint is the first TypeScript `odd_sdlc` v3 release candidate.

It follows `v2.0.0` as a breaking product-boundary candidate. The version moves
to `3.0.0-rc.1` because the T-204 refactor removes the historical
`odd_sdlc` command/control shape and prices the TypeScript package as a client
of ABG services: GTL program declarations, product plugins, product carriers,
policy overlays, query/read-model overlays, and proof interpretation remain in
`odd_sdlc`; traversal, start/control, retry, replay, runtime events,
continuation, result ingress, process tracing, and generic infrastructure
remain ABG-owned.

This is an RC candidate, not the final tapped `3.0.0` release.

## Release Claim

The TypeScript tenant is `@odd-sdlc/typescript-tenant@3.0.0-rc.1`.

The consumed ABG substrate is the immutable
`@abiogenesis/typescript-tenant@4.1.0-rc.3` release snapshot:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.3/abiogenesis-typescript-tenant-4.1.0-rc.3.tgz
```

RC1 carries the current T-204 checkpoint:

- no public `odd-sdlc-ts` orchestration bin;
- no `./spec-method` package export;
- no `code/src/cli` command surface;
- package release remains available through the `./release` package API;
- ABG rc3 supplies the traversal-unit/consequence boundary, bounded
  retry-attempt lever, and traced live-proof substrate consumed by this line;
- `odd_sdlc` remains responsible for SDLC product meaning, GTL publications,
  product plugins, prompt/policy overlays, and read-model/proof interpretation.

T-204 is still active. This release candidate does not claim that all remaining
classified `move_to_abg` or register-cleanup work has closed. It records the
first v3 package identity after the boundary break and substrate migration.

## Boundary

The governing runtime split for this candidate is:

```text
ABG:
  start/control, traversal facts, retry bounds, continuation, replay,
  runtime events, result ingress, process tracing, generic ledgers,
  generic archive/projection mechanics

odd_sdlc:
  GTL program declarations, SDLC graph overlays, product plugins,
  typed SDLC product carriers, prompt/policy overlays, query/read-model
  overlays, proof interpretation, install/release packaging
```

Any future `odd_sdlc` code that stores ledgers, reads runtime archives, launches
processes, handles retry, or projects closure must do so through ABG substrate
interfaces unless it has a written product survival proof as domain-specific
read-model or plugin I/O.

## Versioned Artifacts

- RC identity: `3.0.0-rc.1`
- Package version: `3.0.0-rc.1`
- Candidate tag: `v3.0.0-rc.1`
- ABG substrate: `4.1.0-rc.3`
- Predecessor product: `v2.0.0`

## Qualification Plan

The minimum qualification bundle for this candidate is:

```text
npm run build:semantic
npm run lint:semantic
npm run guard:pack-no-command-artifacts
npm run test:t028
npm run test:t059
npm run test:t180
npm run test:t197
npm run test:t203
git diff --check
```

Release snapshot creation must use the package `./release` API and must record
the ABG `4.1.0-rc.3` snapshot in `release-snapshot-manifest.json`.

## RC Decision

RC1 is the first v3 package-boundary candidate. It is acceptable only if the
qualification bundle passes and the release snapshot records a clean source
commit, the `3.0.0-rc.1` package identity, and the `4.1.0-rc.3` ABG substrate
pin.
