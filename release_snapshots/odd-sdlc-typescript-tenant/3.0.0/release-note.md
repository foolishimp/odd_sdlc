# odd_sdlc 3.0.0 Release Note

This is the formal `odd_sdlc` TypeScript tenant v3 release.

It promotes the v3 line from `3.0.0-rc.1` to `3.0.0` after the T-204
orchestration-boundary closure work landed on `main`.

## Release Claim

The TypeScript tenant is `@odd-sdlc/typescript-tenant@3.0.0`.

The consumed ABG substrate is the immutable
`@abiogenesis/typescript-tenant@4.1.0-rc.7` release snapshot:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.7/abiogenesis-typescript-tenant-4.1.0-rc.7.tgz
```

This release records the T-204 boundary as closed:

- `odd_sdlc` no longer publishes a product-local orchestration CLI surface;
- start/control, retry, continuation, replay, runtime events, result ingress,
  process tracing, and generic infrastructure stay ABG-owned;
- `odd_sdlc` retains SDLC graph declarations, product plugins, typed carriers,
  prompt and policy overlays, query/read-model overlays, and proof
  interpretation;
- static GTL program conformance gates the product/substrate contract before
  runtime proof is claimed;
- target-carrier, evaluation, and closure evidence is admitted through the
  governed ABG/GTL boundary rather than local archive shape.

## Data Mapper Proof Boundary

The final Data Mapper proof used for T-204 closure fulfilled the scoped
UAT-depth validation slice. The run admitted the active
`derive_lite_uat_test_source_surface` edge with 22 expected obligations, 22
fulfilled obligations, review-grade pass, converged ledger, and close
decision.

That proof establishes that `odd_sdlc` can build and admit the governed
Data Mapper depth slice under the current boundary. It does not claim the
external Data Mapper product itself is complete against every original
requirement.

## Versioned Artifacts

- Release identity: `3.0.0`
- Package version: `3.0.0`
- Release tag: `v3.0.0`
- Predecessor candidate: `v3.0.0-rc.1`
- ABG substrate: `4.1.0-rc.7`

## Qualification Bundle

The release is qualified by:

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
the ABG `4.1.0-rc.7` snapshot in `release-snapshot-manifest.json`.
