# odd_sdlc v2.0.0-rc.3 Release Note

## RC Identity

- product: `odd_sdlc`
- candidate: `v2.0.0-rc.3`
- RC branch: `rc/2.0.0`
- predecessor: `v2.0.0-rc.2`
- release state: third published release candidate for the `2.0.0` line

## Position

`v2.0.0-rc.3` hardens the TypeScript installed-operator boundary around typed
F_P stage authority and proves the JavaScript hello-world lifecycle through the
full release surface in a resumed live workspace.

The main repair is T-102: F_P.transform remains the workspace editor, while
evaluation evidence, reports, ledgers, and typed stage authority carriers are
owned by the TypeScript installed operator. Worker report projections now cite
the same-archive `fp_evaluate_result.json`, and cross-archive execution-result
evidence is validated against the source execution-result edge manifest rather
than the consuming archive edge.

## What Shipped Since RC2

### T-102 Typed F_P Stage Carrier Surface

- `worker_result_report.json` is admitted as a typed stage projection only when
  it carries `projectionRole: typed_fp_stage_projection` and cites the
  same-archive `fp_evaluate_result.json`.
- `fp_evaluate_result.json` carries the stage-authority side of the contract and
  refers back to the worker report projection.
- fulfillment ledgers cite `fp_evaluate_result.json` as the predecessor and
  admission authority for evaluation-owned edges.
- execution-result, qualification, repair-schedule, and release-depth edges no
  longer prompt workers to emit framework-owned evaluator carriers.

### Hello-World Lifecycle Live Proof

The RC proof uses the preserved T-132 JavaScript hello-world live workspace:

```text
build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T171756257Z_pid74330
```

The repaired same-workspace resume closed:

```text
derive_test_run_archive_surface:
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T182231248Z_pid42414

derive_release_depth_parity_surface:
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T182635841Z_pid42414

prepare_release_surface:
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T183009792Z_pid42414
```

The release-cut proof summary is archived at:

```text
.ai-workspace/release-cuts/typescript/20260518T183633Z_t102_t132_hello_world_rc3/t132-hello-world-live-proof-summary.json
```

### Archive Dependency Fix

The live failure on `derive_test_run_archive_surface` was a false retry: archive
postflight revalidated a cited execution-result report against the consuming
archive edge's generic shard schedule. RC3 reads the cited execution-result
archive's sibling `handoff_manifest.json` and validates command and shard
evidence against that source edge schedule.

## Qualification Bundle

- `npm run build:semantic` - passed
- `npm run lint:semantic` - passed
- `npm run lint:test-harness` - passed
- `node --test test_env/tests/test_t038_rc_qualification.test.mjs test_env/tests/test_t064_installed_operator_ux.test.mjs test_env/tests/test_t077_t083_assurance_ledgers.test.mjs test_env/tests/test_t118_worker_invocation_package.test.mjs test_env/tests/test_t168_design_consumer_test_pipeline.test.mjs` - 51/51 passed
- `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs` - 91/91 passed
- `git diff --check` - passed

Release-cut artifact:

```text
.ai-workspace/release-cuts/typescript/20260518T183633Z_t102_t132_hello_world_rc3/package/pack-MU5uTu/odd-sdlc-typescript-tenant-0.0.0-dev.tgz
```

## Known Limitations

- This RC proves the T-132 JavaScript hello-world full lifecycle. It does not
  claim full data_mapper parity.
- Plain `gaps` remains a read-only projection over the generic bootstrap view;
  the RC proof surface is the full-lifecycle overlay archive sequence and
  terminal `start` projection.

## RC Boundary

- RC branch: `rc/2.0.0`
- RC tag: `v2.0.0-rc.3`

This RC tag is immutable. Subsequent RC work in the `2.0.0` window will publish
new RC tags (`v2.0.0-rc.4`, ...) without mutating this cut.
