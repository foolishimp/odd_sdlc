# REVIEW: data_mapper.test46.ts Live TypeScript RC Bug List

## Scope

Workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts`

Installed command:

- `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex`

Governance:

- STDO Method
- T-041 full operational Python-replacement RC lane

## Current Reality

The installed TypeScript operator can traverse the full 18-vector
`bootstrap_release_self_test` graph in the independent data_mapper workspace.
`odd-sdlc-ts gaps --workspace .` reports:

- status: `converged`
- closed vectors: `0..17`
- current edge: `n/a`
- event log length: 90 events

Final archive:

- `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T103548128Z_pid44432`

This is real progress. It is not full operational RC.

## Bugs And Gaps Found

| Priority | Finding | Evidence | Status |
| --- | --- | --- | --- |
| Critical | The graph converges without materializing downstream product source or tests. | `derive_code_surface` wrote only `.ai-workspace/runtime/odd_sdlc/assets/20260427T095902442Z_pid38741/code_surface.md`; `find build_tenants -maxdepth 5 -type f` failed because `build_tenants/` does not exist. Final graph still converged. | Open: `T-066` |
| High | Workspace setup did not instantiate required data_mapper tenant constraints. | `project_constraints.yml` had empty `project.name`, `test_runner`, and `active_tenant`; `select_implementation_stack_profile` lawfully blocked until repaired to `active_tenant: "scala_spark"`. | Open as T-041 evidence; needs installer/UX normalization follow-up if not folded into T-066/T-064 |
| High | Installed operator operation type was hardcoded to `generate`, breaking qualification edges. | `derive_test_run_archive_surface` archive `20260427T101529348Z_pid79099` had requested `qualify` but operation `generate`, causing `requested_operation_mismatch`. | Fixed: `T-067` |
| High | ABG installer refresh erased runtime event history. | Refresh reset `.ai-workspace/events/events.jsonl`; next run replay count was 0 and current edge returned to `derive_product_surface`. | Fixed: abiogenesis `T-083` |
| Medium | Failed archives are less complete than successful archives. | Blocked runs did not write the same `run_compact.json` / `operator_summary.json` surfaces as successful runs. | Open follow-up candidate |
| Medium | Release-surface closure is too weak. | `prepare_release_surface` passed with no materialized source tree and no executed product tests. | Covered by `T-066` |

## Quantitative Evidence

Generated runtime surface artifacts from the successful run include:

| Surface | Lines |
| --- | ---: |
| intent | 133 |
| product | 156 |
| goal | 70 |
| requirements | 255 |
| feature decomposition | 459 |
| UAT testcases | 556 |
| design | 401 |
| implementation module | 405 |
| code surface | 238 |
| test design | 290 |
| test stack | 147 |
| test module | 307 |

The run proves surface traversal and replay, not product realization.

## RC Verdict

odd_sdlc.TS is not full operational RC ready.

The decisive blocker is T-066: an SDLC that converges without creating the
target product implementation is not satisfying the product reason for
existence. The next work should make product-source materialization a first
class graph-function output contract, with deterministic postflight rejection
when only markdown surfaces exist.
