# T-204 Phase 4 Audit: Archive Diagnostic Boundary

Date: 2026-06-22

## Scope

Phase 4 removed the public workspace-gaps path that rehydrated requirement
fulfillment truth from raw operator-run archive JSON.

The surviving archive scan is diagnostic only:

- it detects passed compute without bind outcome;
- it detects missing consequence artifacts;
- it validates next-action graph function/vector refs for diagnostics;
- it does not author public requirement fulfillment rows, counts, closure
  disposition, or evaluator state from archive files.

## Changes

- Removed `projectSdlcRequirementFulfillmentPublicViewFromPriorProjection(...)`
  from `workspace_api/entry.ts`.
- Removed raw archive parsing of:
  - `sdlc_edge_fulfillment_ledger.json` into edge counts;
  - `sdlc_edge_closure_decision.json` into closure disposition;
  - `sdlc_next_action_projection.json` into next-action authority;
  - `worker_result_report.json` obligation assessments into public
    requirement fulfillment.
- `projectOddSdlcWorkspaceGaps(...)` now returns source/query-domain
  requirement fulfillment with `archiveRehydration.status: "not_attempted"`
  when archive runs exist.
- Archive diagnostics remain visible through `archiveDiagnostics` and
  `archiveRehydration.scannedArchiveRefs` / `missingArtifactRefs`.
- Added a source guard in `test_t160_traversal_overlays.test.mjs` rejecting
  reintroduction of raw archive fulfillment rehydration helpers.

## Metrics

After Phase 4:

- `code/src` TypeScript files: 175
- `code/src` lines: 94,932

Net source reduction from Phase 0:

- Files: -4
- Lines: -465

Current Phase 3/4 diff:

- Files changed: 10
- Insertions: 89
- Deletions: 255
- Net diff: -166

## Validation

Passed:

```sh
npm run build:semantic
node --test test_env/tests/test_t058_spec_method_entrypoint.test.mjs \
  test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs \
  test_env/tests/test_t145_replay_visible_closure_authority.test.mjs \
  test_env/tests/test_t150_visible_defaults_catalog_lookup.test.mjs \
  test_env/tests/test_t158_consequence_admission_regression.test.mjs \
  test_env/tests/test_t160_traversal_overlays.test.mjs
```

Focused gaps/projection result: 55 passed, 0 failed.

## Remaining Debt

- `analysis/*` remains as offline diagnostics over raw archives. It must stay
  out of runtime/control authority or move to ABG/common tooling.
- `product_materialization/replay.ts` still reads archive files and needs a
  product-specific survival proof or ABG projection replacement.
