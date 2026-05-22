---
id: T-178
title: Migrate TypeScript tenant to ABG 3.8.0-rc.3
type: release_migration
ticket_category: implementation_migration
status: completed
proof_status: passed
priority: high
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-22
updated_at: 2026-05-22
completed_at: 2026-05-22
triaged_at: 2026-05-22
activated_at: 2026-05-22
goal: migrate odd_sdlc TypeScript substrate consumption from the ABG 3.8.0-rc.2 snapshot pin to the newly cut ABG 3.8.0-rc.3 release identity
change_class: implementation_migration
re_entry_point: release_design
first_missing_layer: release substrate pin
governance_scope: STDO Method / Release Method / ODD Method / odd_sdlc TypeScript tenant
upstream_release:
  repo: /Users/jim/src/apps/abiogenesis
  branch: rc/3.8.0
  tag: v3.8.0-rc.3
  commit: 96e2ef61a12ae46758d75a77508bfc2edbd18a5f
  package: "@abiogenesis/typescript-tenant"
  package_version: 3.8.0-rc.3
  dry_run_package: abiogenesis-typescript-tenant-3.8.0-rc.3.tgz
  dry_run_file_count: 382
dependencies:
  - T-177
  - upstream ABIogenesis v3.8.0-rc.3 release cut
source_documents:
  - .ai-workspace/tickets/active/T-177-move-typescript-tenant-to-release-snapshots-and-pin-abg-release.md
  - build_tenants/typescript/package.json
  - build_tenants/typescript/package-lock.json
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md
  - /Users/jim/src/apps/abiogenesis/docs/ABIOGENESIS_RC_RELEASE_NOTE.md
  - /Users/jim/src/apps/abiogenesis/docs/ABIOGENESIS_RC_NOTES.md
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.3/release-snapshot-manifest.json
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.3/checksums.sha256
related_tickets:
  - .ai-workspace/tickets/active/T-177-move-typescript-tenant-to-release-snapshots-and-pin-abg-release.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-142-create-versioned-release-snapshot-bundle-for-package-first-abg.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-143-define-gtl-compute-notation-types-over-ratified-carriers.md
affected_boundary:
  package_binding:
    - build_tenants/typescript/package.json
    - build_tenants/typescript/package-lock.json
  install_resolution:
    - build_tenants/typescript/code/src/install/**
    - build_tenants/typescript/code/src/release/**
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md
  tests:
    - build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs
    - build_tenants/typescript/test_env/tests/test_t175_source_truth_migration.test.mjs
target_truth: odd_sdlc.TS consumes ABIogenesis `@abiogenesis/typescript-tenant` 3.8.0-rc.3 as a named release substrate, and release/install evidence records the rc.3 identity, artifact path, digest, source tag, and source commit instead of relying on the mutable ABIogenesis source checkout or the older 3.8.0-rc.2 snapshot pin.
superseded_truth: the T-177 rc.2 snapshot pin remains sufficient after ABIogenesis has cut v3.8.0-rc.3, or odd_sdlc may silently consume whatever ABIogenesis sibling source state happens to be checked out.
closure_law: This ticket closes only when the TypeScript package dependency, lockfile, install default resolution, installed-package rewrite, release-snapshot manifest, and focused tests prove that odd_sdlc consumes ABG 3.8.0-rc.3 as the selected substrate and rejects or exposes stale rc.2/source-checkout fallback as non-default behavior.
non_closure_conditions:
  - package.json or package-lock.json still pins `@abiogenesis/typescript-tenant` to 3.8.0-rc.2
  - default ABG package source resolution prefers `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript`
  - installed odd_sdlc package replay rewrites ABG dependency back to a sibling source path
  - release-snapshot output omits ABG 3.8.0-rc.3 package version, tag, commit, tarball path, digest, or manifest reference
  - tests only check that some ABG dependency exists without asserting the selected rc.3 identity
  - ABG 3.8.0-rc.3 has no immutable artifact path and the migration silently falls back to mutable source
proof_surface:
  static:
    - npm install
    - npm run build:semantic
    - npm run lint:semantic
  focused:
    - npm run test:t059
    - npm run test:t175
  release_smoke:
    - odd-sdlc-ts release-snapshot --release-identity 0.0.0-dev --snapshot-root <tmp> --expected-package-name @odd-sdlc/typescript-tenant --expected-package-version 0.0.0-dev
  hygiene:
    - git diff --check
---

# T-178: Migrate TypeScript Tenant To ABG 3.8.0-rc.3

## STDO Intake

Smallest lawful re-entry point: `implementation_migration` at the release
substrate boundary.

Reason: ABG has cut `v3.8.0-rc.3` after T-142 and T-143. `odd_sdlc` now has an
active release-snapshot migration lane in T-177, but that lane currently names
the prior `3.8.0-rc.2` ABG snapshot. The next SDLC migration must consume the
new ABG release identity deliberately, not by mutable sibling source drift.

## Current State

The current dirty `odd_sdlc` TypeScript tenant already has T-177 framework work
in progress. Before this ticket, its package dependency pointed at:

```text
file:../../../abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.2/abiogenesis-typescript-tenant-3.8.0-rc.2.tgz
```

ABG `v3.8.0-rc.3` has been cut and pushed at:

```text
96e2ef61a12ae46758d75a77508bfc2edbd18a5f
```

The ABG rc.3 package dry-run produced:

```text
abiogenesis-typescript-tenant-3.8.0-rc.3.tgz
382 files
```

## Required Migration

1. Confirm or create the immutable ABG `3.8.0-rc.3` artifact path that
   `odd_sdlc` will consume. If no rc.3 release snapshot exists, do not silently
   fall back to sibling source.
2. Update `build_tenants/typescript/package.json` and `package-lock.json` to
   consume the ABG `3.8.0-rc.3` release artifact.
3. Verify default ABG package-source resolution prefers the package-local
   installed dependency produced from that release artifact.
4. Verify installed odd_sdlc package replay keeps the ABG rc.3 release
   dependency valid after repacking.
5. Update release-snapshot manifest output so the consumed ABG substrate fields
   name rc.3 identity, tag, commit, artifact path, and digest.
6. Update design/proof wording where it still names rc.2 as current substrate.
7. Add or tighten focused tests so stale rc.2 and mutable sibling source cannot
   pass as the default substrate.

## Closure Proof

Minimum proof for closure:

- `npm install`
- `npm run build:semantic`
- `npm run lint:semantic`
- `npm run test:t059`
- `npm run test:t175`
- release-snapshot smoke into a temporary root using `0.0.0-dev`
- `git diff --check`

If the ABG rc.3 snapshot artifact is not available, this ticket remains active
with a named upstream artifact blocker rather than degrading to source-checkout
consumption.

## Implementation Pass: 2026-05-22

The RC3 artifact gate passed first:

```text
cd /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.3
shasum -a 256 -c checksums.sha256
```

Result:

```text
abiogenesis-typescript-tenant-3.8.0-rc.3.tgz: OK
release-note.md: OK
release-snapshot-manifest.json: OK
```

Refactor completed:

- `build_tenants/typescript/package.json` and `package-lock.json` now consume
  `file:../../../abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.3/abiogenesis-typescript-tenant-3.8.0-rc.3.tgz`.
- `node_modules/@abiogenesis/typescript-tenant/package.json` resolves to
  `@abiogenesis/typescript-tenant 3.8.0-rc.3` after `npm install`.
- `specification/PRODUCT.md`, the install/release design note,
  `getting_started.md`, and T-177 now state RC3 as the current ABG release
  substrate pin.
- `test_t059_install_release_adapter.test.mjs` now asserts the selected ABG
  substrate by package version, dependency ref, snapshot root, manifest path,
  tarball path, tarball SHA-256, source tag, and source commit.

RC3 selected substrate facts asserted by test:

```text
packageVersion: 3.8.0-rc.3
sourceRef: v3.8.0-rc.3
sourceCommit: 96e2ef61a12ae46758d75a77508bfc2edbd18a5f
tarballSha256: 710f14449550eac0fa219e1aa322ede61db6260461ab99f0fa6dad5da992664c
```

## Closure Proof: 2026-05-22

Passed:

- `npm install`
- `npm run build:semantic`
- `npx eslint --max-warnings=0 test_env/tests/test_t059_install_release_adapter.test.mjs`
- `npm run test:t059`
- `npm run test:t175`
- `npm run lint:semantic`
- `npm run lint:test-harness`
- `node build/semantic/code/src/cli/main.js release-snapshot --release-identity 0.0.0-dev --snapshot-root /tmp/odd-sdlc-t178-release-smoke-JrRx5x/0.0.0-dev --package-source /Users/jim/src/apps/odd_sdlc/build_tenants/typescript --expected-package-name @odd-sdlc/typescript-tenant --expected-package-version 0.0.0-dev --allow-dirty-source --npm-cache-root /tmp/odd-sdlc-t178-release-smoke-JrRx5x/.npm-cache`
- `cd /tmp/odd-sdlc-t178-release-smoke-JrRx5x/0.0.0-dev && shasum -a 256 -c checksums.sha256`
- `git diff --check`

The release-snapshot smoke wrote
`/tmp/odd-sdlc-t178-release-smoke-JrRx5x/0.0.0-dev/release-snapshot-manifest.json`
with `abgSubstrate.packageVersion = 3.8.0-rc.3`,
`abgSubstrate.sourceRef = v3.8.0-rc.3`,
`abgSubstrate.sourceCommit = 96e2ef61a12ae46758d75a77508bfc2edbd18a5f`,
and the RC3 tarball SHA-256 above.
