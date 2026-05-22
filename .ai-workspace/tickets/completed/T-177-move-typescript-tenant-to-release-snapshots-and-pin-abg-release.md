---
id: T-177
title: Move TypeScript tenant to release snapshots and pin ABG release consumption
type: release_migration
ticket_category: implementation_migration
status: completed
proof_status: full_verified
priority: high
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-22
updated_at: 2026-05-23
triaged_at: 2026-05-22
activated_at: 2026-05-22
closed_at: 2026-05-23
goal: align odd_sdlc TypeScript release handling with the abiogenesis release-snapshot framework and consume explicit ABG release artifacts
change_class: design_reframe
re_entry_point: release_design
first_missing_layer: design
governance_scope: STDO Method / Release Method / ODD Method / odd_sdlc TypeScript tenant
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/RELEASE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.3/release-snapshot-manifest.json
related_tickets:
  - .ai-workspace/tickets/active/T-175-collapse-design-method-source-of-truth-inconsistencies.md
  - .ai-workspace/tickets/active/T-176-ratify-odd-project-constitutional-structure-and-derived-starter-surfaces.md
affected_boundary:
  product_spec:
    - specification/PRODUCT.md
    - specification/requirements/13-odd-sdlc-typescript-tenant.md
    - specification/requirements/14-odd-sdlc-installed-product-contract.md
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md
  release_code:
    - build_tenants/typescript/code/src/release
    - build_tenants/typescript/code/src/spec_method
  install_code:
    - build_tenants/typescript/code/src/install
  package_binding:
    - build_tenants/typescript/package.json
    - build_tenants/typescript/package-lock.json
  tests:
    - build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs
  release_snapshots:
    - release_snapshots/odd-sdlc-typescript-tenant
target_truth: odd_sdlc TypeScript release evidence is a versioned immutable snapshot under release_snapshots/odd-sdlc-typescript-tenant/<release>, and the TypeScript tenant consumes a specific ABG release snapshot tarball from abiogenesis/release_snapshots/abiogenesis-typescript-tenant/<release> instead of the mutable ABIogenesis source checkout.
superseded_truth: odd_sdlc release-cut evidence may live only in ad hoc .ai-workspace/release-cuts archives, and the TypeScript package may bind @abiogenesis/typescript-tenant to a sibling source path whose current worktree state silently defines the substrate.
closure_law: This ticket closes only when package dependency, default install resolution, release-snapshot command, release manifest, design, and focused tests prove that odd_sdlc consumes a named ABG release snapshot and can publish its own versioned release snapshot without relying on mutable sibling source as substrate truth.
non_closure_conditions:
  - package.json continues to depend on ../../../abiogenesis/build_tenants/abiogenesis/typescript
  - install defaults prefer sibling ABG source over package-local release dependency
  - ABG docs or standards discovery accidentally resolves odd_sdlc docs as ABG docs
  - release evidence is only a release-cut archive and not a versioned release snapshot with manifest and checksums
  - release-snapshot output omits the consumed ABG release identity, tarball path, digest, or manifest reference
  - tests accept an unpinned ABG source checkout as the default substrate
proof_surface:
  static:
    - npm run build:semantic
  focused:
    - npm run test:t059
  release_smoke:
    - odd-sdlc-ts release-snapshot --release-identity 0.0.0-dev --snapshot-root <tmp> --expected-package-name @odd-sdlc/typescript-tenant --expected-package-version 0.0.0-dev
---

# T-177: Move TypeScript Tenant To Release Snapshots And Pin ABG Release Consumption

## STDO Intake

Smallest lawful re-entry point: `design_reframe` at the release/install
boundary.

Reason: the TypeScript tenant currently has two mutable release truths:

- `odd_sdlc` release evidence is an ad hoc archive under
  `.ai-workspace/release-cuts/...`;
- ABG substrate consumption is a `file:` dependency on the sibling ABIogenesis
  source checkout.

That means the source checkout state can silently redefine the substrate under
`odd_sdlc`, and release evidence does not create a durable product snapshot
that downstream projects can pin.

## Target State

`odd_sdlc.TS` uses the same release framework now present in ABIogenesis:

- package-first release snapshots live under
  `release_snapshots/odd-sdlc-typescript-tenant/<release>/`;
- each snapshot contains the package tarball, `release-snapshot-manifest.json`,
  optional `release-note.md`, and `checksums.sha256`;
- snapshot creation runs `build:semantic`, packs with `npm pack --json`, and
  fails closed on dirty source, package-name mismatch, package-version
  mismatch, release-identity mismatch, existing snapshot root, build failure,
  pack failure, or invalid pack output;
- the snapshot manifest records the ABG substrate release consumed by this
  odd_sdlc cut.

## ABG Substrate Pin

The current ABIogenesis TypeScript release snapshot is:

```text
/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.3
```

The package dependency for `@abiogenesis/typescript-tenant` must point at:

```text
file:../../../abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.3/abiogenesis-typescript-tenant-3.8.0-rc.3.tgz
```

Default install resolution must prefer the package-local dependency installed
from that tarball. The mutable sibling source checkout may remain an explicit
developer override, but it must not be the default substrate truth.

## Implementation Slices

1. Update package dependency and lockfile to the ABG `3.8.0-rc.3` snapshot
   tarball.
2. Change default ABG package-source resolution to prefer the package-local
   installed dependency before any sibling source checkout.
3. Pass explicit ABG docs and standards source roots into the public ABG
   installer so package-local release consumption does not accidentally resolve
   `odd_sdlc/docs` as ABG docs.
4. Add `odd-sdlc-ts release-snapshot` with ABIogenesis-style snapshot
   semantics.
5. Add release-snapshot carriers/manifest output that record the consumed ABG
   release snapshot.
6. Update requirements/design/docs and focused tests.

## Initial Proof Plan

- `npm install`
- `npm run build:semantic`
- `npm run test:t059`
- release-snapshot smoke into a temporary root using `0.0.0-dev`

## Implementation Pass: 2026-05-22

Implemented the first release-framework migration slice:

- `build_tenants/typescript/package.json` now pins
  `@abiogenesis/typescript-tenant` to the ABIogenesis `3.8.0-rc.3` release
  snapshot tarball instead of the sibling source checkout.
- `package-lock.json` and `node_modules` now resolve that dependency as a real
  package artifact with npm integrity, not as a symlink.
- `resolveDefaultAbgPackageSourceRoot()` now prefers the package-local ABG
  dependency before falling back to a sibling source checkout.
- Install admission and CLI parsing now carry optional ABG docs and standards
  source roots through to the public ABG installer.
- Default CLI install passes explicit ABG docs and shared standards roots so
  package-local release consumption cannot accidentally resolve `odd_sdlc/docs`
  as ABG docs.
- The installer rewrites the installed odd_sdlc package's ABG dependency to the
  installed ABG package tarball and repacks the installed odd_sdlc tarball so
  target-workspace `npm install` replay remains valid.
- `odd-sdlc-ts release-snapshot` now writes ABIogenesis-style versioned
  snapshot evidence with package tarball, manifest, optional release note, and
  checksums.
- The new odd_sdlc release-snapshot manifest records the consumed ABG release
  package version, snapshot root, manifest path, tarball path, tarball digest,
  source ref, and source commit.
- Requirements, product wording, design, and getting-started guidance now
  state release-snapshot substrate consumption.

Focused proof:

- `npm install`
- `npm run build:semantic`
- `npm run test:t059`
- `npm run test:t175`
- `npm run lint:semantic`
- `git diff --check`

Closure note: the framework and ABG pin are implemented. New odd_sdlc release
candidates use `odd-sdlc-ts release-snapshot` under
`release_snapshots/odd-sdlc-typescript-tenant/<release>/`; historical
release-cut archives have been migrated into the same root as legacy snapshots.

## Closure Pass: 2026-05-23

Completed the root release-snapshot alignment requested for T-177:

- moved the former `.ai-workspace/release-cuts/typescript/*` archives into
  `release_snapshots/odd-sdlc-typescript-tenant/<legacy-release-id>/`;
- each migrated snapshot now has a root package tarball,
  `release-snapshot-manifest.json`, `release-note.md`,
  `legacy-release-cut-manifest.json`, preserved proof artifacts, and
  `checksums.sha256`;
- removed the old `.ai-workspace/release-cuts` tree so the repository has one
  active release snapshot root;
- typed the legacy migrated snapshot manifest separately from the current
  ABG-pinned release-snapshot manifest so missing historical ABG substrate pins
  are not invented;
- updated product, design, getting-started, and RC release note references; and
- added focused regression coverage proving the old path is absent and migrated
  snapshot manifests/checksums are coherent.

Verification:

- `npm run test:t059`
- `npm run build:semantic`
- `npm run lint:semantic`
- `git diff --check`
