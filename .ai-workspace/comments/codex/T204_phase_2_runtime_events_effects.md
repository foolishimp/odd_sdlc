# T-204 Phase 2 Audit: Runtime Events And Effects

Date: 2026-06-22

## Scope

Phase 2 removed odd_sdlc-owned generic runtime/effect infrastructure that survived
after the public command surface was deleted.

This phase is a realization refactor under the T-204 product boundary:

- ABG owns runtime events and generic effect infrastructure.
- odd_sdlc may keep product carrier publication helpers only where the helper is
  bound to SDLC catalog/product semantics.

## Changes

- Deleted `code/src/operator/event_store.ts`.
- Removed installer emission of `workspace_installation_admitted` into ABG's
  canonical runtime event log.
- Removed `appendOddSdlcRuntimeEvents` / `readOddSdlcRuntimeEvents*` exports from
  `operator/index.ts`.
- Deleted `code/src/effects/archive_store.ts`,
  `code/src/effects/file_store.ts`, and `code/src/effects/process_runner.ts`.
- Collapsed catalog-aware archive publication into
  `code/src/operator/system_artifacts.ts`.
- Localized the content-register atomic file publication helper to
  `code/src/operator/plugins/evaluate/content_register.ts`.
- Replaced generic write/process effect plans in
  `code/src/operator/plugins/consequence/edge_projection.ts` with direct local
  product-plugin operations.
- Deleted `test_env/tests/test_install_event_emission.test.mjs`, which only
  proved retired installer event behavior.
- Updated source-shape tests so they ban retired generic effect imports rather
  than preserving the old effect-plan layer.

## Metrics

Baseline from Phase 0:

- `code/src` TypeScript files: 179
- `code/src` lines: 95,397

After Phase 2:

- `code/src` TypeScript files: 175
- `code/src` lines: 95,115

Net source reduction from Phase 0:

- Files: -4
- Lines: -282

Current uncommitted diff at this phase:

- Files changed: 41
- Insertions: 304
- Deletions: 852
- Net diff: -548

## Validation

Passed:

```sh
npm run build:semantic
node --test test_env/tests/test_t175_source_truth_migration.test.mjs \
  test_env/tests/test_t183_plugin_trace_ledger.test.mjs \
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs \
  test_env/tests/test_t188_data_mapper_live_boundary_guard.test.mjs \
  test_env/tests/test_t151_runner_evaluator_sovereignty.test.mjs
```

Focused test result: 58 passed, 0 failed.

Search checks:

- No source imports remain from `code/src/effects`.
- No source or live-test references remain to `constructSdlcWriteTextFilePlan`,
  `constructSdlcProcessRunPlan`, `executeSdlcProcessRunPlan`, or
  `executeSdlcFileStoreEffectPlan`.
- Remaining runtime-event references are negative assertions or installer tests
  that confirm `workspace_installation_admitted` is no longer locally authored.

## Remaining Debt

- `installed_operator.ts` still contains consequence, retry/reentry, and archive
  truth folding that belongs in ABG or behind ABG-admitted carriers.
- `workspace_api/entry.ts` and `analysis/*` still reconstruct archive truth from
  raw JSON and need Phase 4 treatment.
- Direct product artifact writes remain in `system_artifacts.ts`,
  `content_register.ts`, and `edge_projection.ts`; they are product-scoped now,
  but the long-term target remains ABG substrate storage APIs.
