# REVIEW: T-131 Lane Wall-Time Comparison

**Author**: codex
**Date**: 2026-05-09T11:01:46+10:00
**Addresses**: T-131 live lane archives `20260508T175406582Z_pid4710` and `20260508T191531880Z_pid99244`
**Status**: Open

## Summary

Current reality: these two archives are separate live runs of the same broad T-131 lane. They both used `graph_function:bootstrap_release_self_test`, not a bounded odd_chat-only graph. That is why both spent most of their time walking the generic SDLC lifecycle up to component realization.

The first run did finish its configured harness loop: it wrote `run_summary.json` after 18 harness steps. It did not finish T-131. Its verdict was `incomplete` because the expected odd_chat file contract was not satisfied.

The second run did not finish. It reached step 16, `derive_component_code_surface`, then the outer harness killed the installed `odd-sdlc-ts start` process with `SIGTERM` / `ETIMEDOUT` after 20 minutes on that step. It has no `run_summary.json`.

All times below are archive UTC times derived from operator-run timestamp ids and filesystem mtimes. The archive does not carry a first-class per-step wall-clock field, so per-step elapsed is derived from:

```text
first operator-run timestamp for that step -> step process file mtime
```

## Lane Comparison

| Field | `20260508T175406582Z_pid4710` | `20260508T191531880Z_pid99244` |
| --- | --- | --- |
| Scenario snapshot | `2026-05-08T17:54:06.584Z` | `2026-05-08T19:15:31.882Z` |
| Final evidence | `run_summary.json` at `2026-05-08T19:13:59.920Z` | `step-16-start-derive_component_code_surface.process.json` at `2026-05-08T20:35:44.549Z` |
| Wall time | `1h 19m 53s` | `1h 20m 13s` |
| Run summary | present | missing |
| Harness verdict | `incomplete` | no final verdict |
| Steps file rows | 36 | 33 |
| Operator-run directories | 24 | 25 |
| Completed harness starts | 18 including induction | 16 including induction |
| Last clean edge | `qualify_component_realization_surface` advanced to `derive_realization_schedule_surface` | `derive_component_realization_schedule_surface` advanced to `derive_component_code_surface` |
| Failure / stop | expected file contract still false | outer `spawnSync` timeout killed step 16 |
| Installed worker | `process://codex?model=gpt-5.5&effort=medium` | `process://codex?model=gpt-5.5&effort=medium` |

## First Lane: Step Timing

Archive:

```text
build_tenants/typescript/test_env/test_runs/t131_guided_odd_chat_bootstrap_sandbox/20260508T175406582Z_pid4710
```

| Step | Edge | Advanced To | Attempts | Derived Elapsed | Process Result | Assurance | Attempt Path |
| ---: | --- | --- | ---: | ---: | --- | --- | --- |
| 0 | `Fg_conform_project` | `Fg_conform_project` | 1 | `0m 0s` | ok | n/a | close |
| 1 | `derive_intent_surface` | `derive_product_surface` | 1 | `1m 43s` | ok | close allowed | close |
| 2 | `derive_product_surface` | `derive_goal_surface` | 1 | `2m 36s` | ok | close allowed | close |
| 3 | `derive_goal_surface` | `derive_requirement_surface` | 1 | `1m 37s` | ok | close allowed | close |
| 4 | `derive_requirement_surface` | `derive_feature_decomp_surface` | 1 | `2m 5s` | ok | close allowed | close |
| 5 | `derive_feature_decomp_surface` | `derive_uat_testcases_surface` | 1 | `2m 20s` | ok | close allowed | close |
| 6 | `derive_uat_testcases_surface` | `derive_design_surface` | 1 | `1m 37s` | ok | close allowed | close |
| 7 | `derive_design_surface` | `derive_scenario_surface` | 1 | `2m 38s` | ok | close allowed | close |
| 8 | `derive_scenario_surface` | `derive_implementation_design_surface` | 1 | `2m 54s` | ok | close allowed | close |
| 9 | `derive_implementation_design_surface` | `select_implementation_stack_profile` | 1 | `2m 38s` | ok | close allowed | close |
| 10 | `select_implementation_stack_profile` | `derive_implementation_module_surface` | 1 | `2m 36s` | ok | close allowed | close |
| 11 | `derive_implementation_module_surface` | `derive_aggregate_domain_model_surface` | 2 | `10m 12s` | ok | close allowed | retry: `design_entity_missing_for_module:app-core`, then close |
| 12 | `derive_aggregate_domain_model_surface` | `derive_implementation_component_topology_surface` | 1 | `3m 57s` | ok | close allowed | close |
| 13 | `derive_implementation_component_topology_surface` | `derive_aggregate_sunny_day_sequence_surface` | 2 | `6m 10s` | ok | close allowed | retry: invalid `componentTopologyRows[0].concernRole`, then close |
| 14 | `derive_aggregate_sunny_day_sequence_surface` | `derive_component_realization_schedule_surface` | 2 | `9m 36s` | ok | close allowed | retry: aggregate domain model attribute was not a closed object, then close |
| 15 | `derive_component_realization_schedule_surface` | `derive_component_code_surface` | 1 | `6m 44s` | ok | close allowed | close |
| 16 | `derive_component_code_surface` | `qualify_component_realization_surface` | 3 | `14m 17s` | ok | close allowed | retry: unsupported component-depth register version; retry: missing materialized `domains/document_to_requirements/domain.json` and `test/odd_chat.test.ts`; then close |
| 17 | `qualify_component_realization_surface` | `derive_realization_schedule_surface` | 2 | `6m 4s` | ok | close allowed | retry: invalid realization-row `kind`; then close |

First-lane result: this run did not hang. It finished the configured 18-step loop and proved a lot of self-healing: six retry attempts were consumed across vectors 10, 12, 13, 15, and 16. It still returned `incomplete` because the harness success predicate expected paths that were not satisfied by the generated layout.

The expected-file mismatch in this run was:

```text
missing: build_tenants/typescript/src/domain_loader.ts
missing: build_tenants/typescript/src/evaluator.ts
missing: build_tenants/typescript/src/workspace.ts
missing: build_tenants/typescript/src/graph_function_selector.ts
missing: build_tenants/typescript/src/evidence.ts
present: build_tenants/typescript/package.json
present: build_tenants/typescript/src/cli.ts
present: build_tenants/typescript/test/odd_chat.test.ts
```

The workspace did contain generated/build artifacts under the product tenant, including `package.json`, `tsconfig.json`, `src/*`, `test/odd_chat.test.ts`, and `dist/*`. There is no separate generated odd_chat execution proof file in this archive.

## Second Lane: Step Timing

Archive:

```text
build_tenants/typescript/test_env/test_runs/t131_guided_odd_chat_bootstrap_sandbox/20260508T191531880Z_pid99244
```

| Step | Edge | Advanced To | Attempts | Derived Elapsed | Process Result | Assurance | Attempt Path |
| ---: | --- | --- | ---: | ---: | --- | --- | --- |
| 0 | `Fg_conform_project` | `Fg_conform_project` | 1 | `0m 0s` | ok | n/a | close |
| 1 | `derive_intent_surface` | `derive_product_surface` | 1 | `1m 36s` | ok | close allowed | close |
| 2 | `derive_product_surface` | `derive_goal_surface` | 1 | `2m 2s` | ok | close allowed | close |
| 3 | `derive_goal_surface` | `derive_requirement_surface` | 1 | `1m 38s` | ok | close allowed | close |
| 4 | `derive_requirement_surface` | `derive_feature_decomp_surface` | 1 | `1m 30s` | ok | close allowed | close |
| 5 | `derive_feature_decomp_surface` | `derive_uat_testcases_surface` | 1 | `2m 12s` | ok | close allowed | close |
| 6 | `derive_uat_testcases_surface` | `derive_design_surface` | 1 | `2m 29s` | ok | close allowed | close |
| 7 | `derive_design_surface` | `derive_scenario_surface` | 1 | `2m 11s` | ok | close allowed | close |
| 8 | `derive_scenario_surface` | `derive_implementation_design_surface` | 1 | `2m 22s` | ok | close allowed | close |
| 9 | `derive_implementation_design_surface` | `select_implementation_stack_profile` | 1 | `2m 7s` | ok | close allowed | close |
| 10 | `select_implementation_stack_profile` | `derive_implementation_module_surface` | 1 | `2m 24s` | ok | close allowed | close |
| 11 | `derive_implementation_module_surface` | `derive_aggregate_domain_model_surface` | 4 | `16m 56s` | ok | close allowed | retry: missing module entity; retry: unexpected `operations[0].summary`; retry: invalid entity ownership; then close |
| 12 | `derive_aggregate_domain_model_surface` | `derive_implementation_component_topology_surface` | 1 | `4m 12s` | ok | close allowed | close |
| 13 | `derive_implementation_component_topology_surface` | `derive_aggregate_sunny_day_sequence_surface` | 2 | `6m 23s` | ok | close allowed | retry: invalid `componentTopologyRows[0].concernRole`, then close |
| 14 | `derive_aggregate_sunny_day_sequence_surface` | `derive_component_realization_schedule_surface` | 2 | `7m 2s` | ok | close allowed | retry: aggregate domain model attribute was not a closed object, then close |
| 15 | `derive_component_realization_schedule_surface` | `derive_component_code_surface` | 1 | `5m 0s` | ok | close allowed | close |
| 16 | `derive_component_code_surface` | not appended to `steps.json` | 4 | `20m 0s` | `SIGTERM` / `ETIMEDOUT` | no final fold | retry: unsupported component-depth register version plus placeholder in `src/cli/parseArgs.ts`; retry: missing materialized domain and `package.json`; retry: placeholders in `parseArgs.ts` and `commands/choose.ts`; fourth attempt was interrupted before postflight/evaluate artifacts were written |

Second-lane stop evidence:

```json
{
  "status": null,
  "signal": "SIGTERM",
  "error": "spawnSync ... odd-sdlc-ts ETIMEDOUT",
  "stdoutBytes": 0,
  "stderr": ""
}
```

The final operator-run directory for the second lane is:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260508T203355267Z_pid21515
```

That directory contains worker start/prompt/event files, but it does not contain `worker_process_summary.json`, `runtime_liveness_observer_projection.json`, `fp_transform_result.json`, `fp_evaluate_result.json`, `postflight.json`, or `run.json`. That means the fourth component-code attempt was interrupted before the framework could observe and fold it.

## What The Six Hours Were

The six-hour span was not one continuous successful lane. It was a sequence of live reruns of the broad T-131 lane while the harness and expected product shape were being corrected.

| Archive | Wall Time | Result |
| --- | ---: | --- |
| `20260508T174316162Z_pid53043` | `1m 41s` | early partial setup run |
| `20260508T174721283Z_pid90110` | `0m 2s` | early partial setup run |
| `20260508T175406582Z_pid4710` | `1h 19m 53s` | finished 18-step harness loop, verdict `incomplete` |
| `20260508T191531880Z_pid99244` | `1h 20m 13s` | timed out on step 16 component code |
| `20260508T203834472Z_pid2511` | `1h 1m 24s` | no run summary; another broad-lane attempt |
| `20260508T221153715Z_pid81521` | `1h 12m 51s` | finished 18-step harness loop, verdict `incomplete` |
| `20260508T232834683Z_pid97709` | `1h 3m 10s` | finished 18-step harness loop, verdict `incomplete` |
| `20260509T003529228Z_pid77690` | `7m 9s` | later run interrupted around step 5 |

The core mistake was repeating a broad release-bootstrap graph while trying to prove a compact odd_chat lane. Each broad run spent about an hour walking normal SDLC edges before it reached the useful odd_chat implementation zone. That multiplied the cost of every harness correction.

## Interpretation

The first run is useful evidence that the installed traversal could advance through 17 vectors and self-heal several F_D/F_P gaps. It is not a T-131 closure proof.

The second run is useful evidence of a bad timeout boundary: the outer harness killed a step while worker events were still being produced. It is not a product failure proof, because the framework never reached postflight for the final attempt.

The correct T-131 fix is still to stop using the full `bootstrap_release_self_test` lifecycle as the closure lane. T-131 needs a bounded odd_chat product-build target or evaluator-selected slice whose success predicate is: package scaffold exists, source exists, tests exist, generated product builds, generated product tests pass, and the odd_chat CLI smoke commands work.
