---
id: T-193
title: Migrate TypeScript tenant to ABIogenesis 3.9.0-rc.13
type: downstream_alignment
ticket_category: implementation_migration
status: completed
proof_status: passed
build_tenant: typescript
owner: odd_sdlc
created_at: 2026-06-07
updated_at: 2026-06-07
triaged_at: 2026-06-07
priority: high
change_class: requirement_reprice
re_entry_point: runtime_governance
governance_scope: STDO Method / SPEC_METHOD / ODD Method / TypeScript tenant
source_documents:
  - specification/GOALS.md
  - specification/INTENT.md
  - specification/PRODUCT.md
  - specification/requirements/18-typed-construction-algebra.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-151-declare-segment-scoped-evaluation-redispatch-substrate.md
upstream_authority:
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.13/release-snapshot-manifest.json
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.13/checksums.sha256
affected_boundary:
  specification:
    - specification/PRODUCT.md
  runtime_contract:
    - build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts
    - build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
  dependency:
    - build_tenants/typescript/package.json
    - build_tenants/typescript/package-lock.json
  tests:
    - build_tenants/typescript/test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs
    - build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs
    - build_tenants/typescript/test_env/tests/test_t180_abg_3_9_current_staged_compute_boundary.test.mjs
    - build_tenants/typescript/test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs
target_truth: odd_sdlc.TS consumes ABIogenesis `@abiogenesis/typescript-tenant@3.9.0-rc.13` from the immutable ABIogenesis release snapshot, and SDLC tests prove the installed package exposes segment-scoped evaluation redispatch metadata rather than only a version string.
superseded_truth: odd_sdlc.TS may remain pinned to an older ABG snapshot after the T-151 segment-scoped redispatch substrate exists, or may claim deep evaluation coverage while its installed ABG package cannot preserve segment/dimension scope through redispatch.
closure_law: This ticket closes when the package dependency and lockfile point to the rc.13 tarball, the product substrate paragraph names the rc.13 snapshot, the runtime substrate contract declares rc.13 plus the T-151 assumption, prompt fold refs use the rc.13 package identity, and focused tests prove both dependency pinning and the actual installed scoped redispatch API.
non_closure_conditions:
  - `package.json`, `package-lock.json`, runtime contract, prompt refs, or product substrate text name different current ABG snapshots
  - SDLC tests only assert version strings and do not exercise the installed rc.13 segment-scoped redispatch API
  - release-adapter checksum/source metadata does not match the rc.13 manifest
  - SDLC invents a local segment redispatch carrier instead of consuming ABIogenesis
---

# T-193: Migrate TypeScript Tenant To ABIogenesis 3.9.0-rc.13

## Intake

Smallest lawful re-entry point: `requirement_reprice`.

Reason: the consumed ABG release snapshot is declared product/runtime truth for
the TypeScript tenant. T-151 adds substrate capability required by the SDLC
evaluation-grid follow-up: scoped evaluation findings and redispatch targets can
carry segment, dimension-cell, fold, and relation scope through ABG-owned
iteration outcome folding. That changes the downstream substrate obligation and
therefore cannot be treated as only a package-manager cleanup.

## Release Snapshot Evidence

- package: `@abiogenesis/typescript-tenant@3.9.0-rc.13`
- snapshot root:
  `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.13`
- tarball:
  `abiogenesis-typescript-tenant-3.9.0-rc.13.tgz`
- sha256:
  `f3c551261350cc5ffb0b5212dcbdf488c38dc78bf0db0202be05d6e34986d80c`
- manifest source ref: `v3.9.0-rc.12`
- manifest source commit: `51afd2f9a5754e6e9677d6e21a0d67ca001b082a`
- manifest dirty flag: `true`

The dirty flag is accepted for this local release candidate because the package
snapshot intentionally captures the uncommitted ABIogenesis T-151/B-033 work
requested for immediate downstream migration.

## Acceptance Evidence

- `build_tenants/typescript/package.json` and `package-lock.json` pin
  `file:../../../abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.13/abiogenesis-typescript-tenant-3.9.0-rc.13.tgz`
- `ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.packageVersion` is `3.9.0-rc.13`
- the SDLC evaluator fold ref uses
  `package:@abiogenesis/typescript-tenant@3.9.0-rc.13#abg/m03/iteration_state_action/deriveIterationOutcomeFromRows`
- `test_t180_abg_3_9_current_staged_compute_boundary.test.mjs` imports the
  installed ABG package, constructs a `GtlEvaluationScopeRef`, and proves
  `deriveIterationOutcomeFromRows(...)` preserves that segment scope on a
  redispatch target

## Proof

Passed in the implementation turn:

- `npm run build:semantic && node --test test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs test_env/tests/test_t059_install_release_adapter.test.mjs test_env/tests/test_t180_abg_3_9_current_staged_compute_boundary.test.mjs test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs`
  - result: 26/26 passing
- `npm run test:semantic`
  - result: 923/923 passing
- `npm run lint:semantic`
  - result: passed
- `npm run lint:test-harness`
  - result: passed

Upstream ABIogenesis proof for the consumed rc.13 snapshot:

- `npm run test:t151`
  - result: 10/10 passing, including `test_env/live/test_t151_segment_scoped_evaluation_redispatch_live.test.mjs`
- `CODEX_LIVE_FP=1 ABG_TS_LIVE_AGENT=claude npm run test:t132:live`
  - result: 1/1 passing live Claude installed sandbox
- `npm run test:semantic`
  - result: 691/691 passing
