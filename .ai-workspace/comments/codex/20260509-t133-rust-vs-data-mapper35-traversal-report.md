# T133 Rust Hello World vs data_mapper.test35 Traversal Report

Date: 2026-05-09

Compared workspaces:

- Python embedded framework baseline: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`
- TypeScript live sandbox: `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260509T061257371Z_pid46744`

## Executive Finding

The two lanes failed in different ways.

`data_mapper.test35` is heavy, but its old embedded Python framework exposes a
clear runtime model: event log, manifests, ledgers, results, continuations, and
repair retries are all visible in the workspace. When proof failed, the system
opened continuation records and retried or repaired the implicated edge.

T133 eventually materialized Rust files, but only after walking the broad
`bootstrap_release_self_test` graph through SDLC document edges. It did not use
the bootstrap-declared `build_hello_world_rust_minimal` graph function as the
controlling action. It also did not raise a typed evaluator-binding defect when
the requested product asset was absent and non-product documentation kept
advancing. That is the core bug for the minimum-overhead lane.

## Inventory

| Surface | data_mapper.test35 | T133 Rust sandbox |
| --- | ---: | ---: |
| Runtime framework | Embedded Python `.genesis` install | TypeScript installed package under sandbox `node_modules` |
| `.genesis` files | 183 files / 2.9 MB | none in sandbox |
| `.ai-workspace` files | 1,110 files / 33.8 MB | 940 files / 144.8 MB at snapshot |
| Product/build tenant files | 1,178 files / 7.6 MB | 4 product files at snapshot |
| Non-target source/test files | 140 Scala files plus 10 docs in `scala_spark` | `Cargo.toml`, `src/main.rs`, `src/proof_contract.rs` |
| Primary event stream | `.ai-workspace/events/events.jsonl` | `.ai-workspace/runtime/odd_sdlc/operator-runs/*` plus process/event archives |
| Ledger model | `.ai-workspace/fp_manifests`, `fp_ledgers`, `fp_results` | per-run `handoff_manifest.json`, `worker_result_report.json`, `product_materialization_manifest.json`, `run.json` |

## data_mapper.test35 Runtime Shape

The embedded Python lane has these durable runtime surfaces:

- `.genesis/genesis/*.py`
- `.genesis/odd_sdlc/python/code/odd_sdlc/*.py`
- `.genesis/gtl/*.py`
- `.ai-workspace/events/events.jsonl`
- `.ai-workspace/fp_manifests/*.json`
- `.ai-workspace/fp_ledgers/*.json`
- `.ai-workspace/fp_results/*.json`

Event log summary:

| Metric | Count |
| --- | ---: |
| Events | 4,662 |
| Time span | 2026-04-18T17:12:48Z to 2026-04-19T18:16:33Z |
| `run_started` | 86 |
| `run_completed` | 79 |
| `run_failed` | 13 |
| `graph_call_failed` | 10 |
| `continuation_opened` | 10 |
| `proof_failed` | 9 |
| `worker_turn_salvaged` | 83 |

The key pattern is explicit repair pressure:

```text
proof_failed
  -> graph_call_failed
  -> continuation_opened(kind=repair or retry)
  -> run_failed
  -> later edge retry / repair attempt
```

Examples:

- `derive_test_run_archive_surface` failed repeatedly on
  `proof_incomplete`, then later closed with executed `sbt test` evidence.
- `derive_code_surface` had a transport failure, opened a retry continuation,
  then later produced code-surface closure.
- `qualify_testcase_authority` failed once on proof incompleteness and later
  completed.
- The latest recorded failure is `derive_implementation_design_surface`, with
  `dbt_build_artifacts_not_present` / obligation carry convergence pressure.

## data_mapper.test35 Edge Traversal And Retries

| Edge | Runs | Completed | Failed | Salvaged Turns | Avg Duration |
| --- | ---: | ---: | ---: | ---: | ---: |
| derive_intent_surface | 7 | 4 | 3 | 4 | 180.1s |
| derive_product_surface | 4 | 4 | 0 | 4 | 231.0s |
| derive_goal_surface | 4 | 4 | 0 | 4 | 128.6s |
| derive_requirement_surface | 6 | 6 | 0 | 6 | 123.2s |
| derive_feature_decomp_surface | 4 | 4 | 0 | 4 | 182.6s |
| derive_uat_testcases_surface | 4 | 4 | 0 | 4 | 209.6s |
| derive_design_surface | 5 | 5 | 0 | 5 | 266.3s |
| derive_scenario_surface | 4 | 4 | 0 | 4 | 232.5s |
| derive_implementation_design_surface | 4 | 3 | 1 | 4 | 476.6s |
| select_implementation_stack_profile | 2 | 2 | 0 | 2 | 168.6s |
| derive_implementation_module_surface | 3 | 3 | 0 | 3 | 396.4s |
| derive_code_surface | 16 | 14 | 1 | 14 | 358.6s |
| derive_test_design_surface | 3 | 3 | 0 | 3 | 463.3s |
| select_test_stack_profile | 2 | 2 | 0 | 2 | 161.0s |
| derive_test_module_surface | 3 | 3 | 0 | 3 | 336.2s |
| derive_test_run_archive_surface | 9 | 2 | 6 | 8 | 525.1s |
| qualify_testcase_authority | 3 | 2 | 1 | 2 | 464.3s |
| prepare_release_surface | 1 | 1 | 0 | 1 | 551.2s |
| prepare_test_execution_surface | 1 | 1 | 0 | 0 | 64.7s |
| derive_test_execution_result_surface | 1 | 1 | 0 | 0 | 59.2s |

This was expensive, but the expense has a recorded cause: real product breadth,
retries, proof incompleteness, transport salvage, and later execution evidence.

## T133 Runtime Shape

T133 was intended to be:

```text
bootstrap -> install odd_sdlc -> build Cargo.toml/src/main.rs -> cargo run
```

The actual installed start target was:

```text
graph_function:bootstrap_release_self_test
```

The bootstrap fixture declares `build_hello_world_rust_minimal`, but the live
harness and fixture command path still substitute the broad release-bootstrap
executive.

At the snapshot:

| Metric | Value |
| --- | ---: |
| Test process alive | yes |
| Wall time | over 1 hour |
| Operator runs | 25 |
| Operator archive bytes | 117.4 MB |
| Product files | 4 |
| Bloat flags | 23/25 operator runs over screenlog budget |
| Largest screenlog | 1.3 MB on `derive_component_code_surface` |
| Product materialization true | only at `derive_component_code_surface` |

Generated files eventually appeared:

- `build_tenants/hello_world_rust/Cargo.toml`
- `build_tenants/hello_world_rust/src/main.rs`
- `build_tenants/hello_world_rust/src/proof_contract.rs`

That means T133 did eventually create the product source, but not through the
minimum graph path. It reached product materialization only after deriving many
intermediate SDLC document surfaces.

## T133 Edge Traversal

| Edge | Runs | Materialization Required |
| --- | ---: | ---: |
| derive_intent_surface | 3 | 0/3 |
| derive_product_surface | 2 | 0/2 |
| derive_goal_surface | 1 | 0/1 |
| derive_requirement_surface | 2 | 0/2 |
| derive_feature_decomp_surface | 1 | 0/1 |
| derive_uat_testcases_surface | 1 | 0/1 |
| derive_design_surface | 1 | 0/1 |
| derive_scenario_surface | 1 | 0/1 |
| derive_implementation_design_surface | 1 | 0/1 |
| select_implementation_stack_profile | 1 | 0/1 |
| derive_implementation_module_surface | 2 | 0/2 |
| derive_aggregate_domain_model_surface | 2 | 0/2 |
| derive_implementation_component_topology_surface | 1 | 0/1 |
| derive_aggregate_sunny_day_sequence_surface | 2 | 0/2 |
| derive_component_realization_schedule_surface | 2 | 0/2 |
| derive_component_code_surface | 1 | 1/1 |

This is not a minimum-overhead path. It is the broad SDLC path reaching code
after vector 15.

## Core Difference

| Question | data_mapper.test35 | T133 Rust lane |
| --- | --- | --- |
| Did the graph target match the product shape? | Yes, broad data-mapper construction was the intended target. | No, one Rust hello world was mapped to broad `bootstrap_release_self_test`. |
| Did failures become visible runtime truth? | Yes, failures opened continuations and retry/repair pressure. | No typed evaluator-binding failure was raised for the graph mismatch. |
| Did assets materialize? | Yes, many Scala source/test/design assets plus test reports. | Yes eventually, but only after broad document traversal. |
| Was retry meaning inspectable? | Yes: proof failure, transport retry, repair continuation. | Mostly no: repeated runs were same-edge retries/normal broad traversal, not an explicit correction of the target mismatch. |
| Did liveness behave? | Old Python relied on event/log model and salvage. | New liveness keeps the run alive because heartbeats and runtime activity probes continue. |
| Main problem | Heavy but explainable; current gaps remain in older traceability/proof surfaces. | Wrong action selection for a minimal product; no fail-closed evaluator binding. |

## Root Cause

T133 exposed a product-intent-to-graph-action binding defect.

The start document names a minimal lifecycle graph and a product asset:

```text
build_hello_world_rust_minimal
build_tenants/hello_world_rust/Cargo.toml
build_tenants/hello_world_rust/src/main.rs
```

The executable harness instead invokes:

```text
bootstrap_release_self_test
```

The installed runtime then does exactly what it was told: follow the broad
release-bootstrap executive. Because broad SDLC document edges can keep passing,
the system records progress even though the operator-requested product files
remain absent until vector 15.

Under the evaluator model, this should fail earlier:

```text
observed gap: requested Rust product files absent
available graph actions: published graph/action catalog
selected action: build the Rust product asset or fail closed if no lawful action exists
not: derive unrelated broad documentation as progress
```

## Required Fix

T133 should not be closed until these are true:

- The harness derives its start target from the bootstrap contract.
- `build_hello_world_rust_minimal` is either a published lawful graph action or
  the run fails closed before traversal.
- The first post-conformance evaluator projection binds the missing Rust product
  files as the highest-value asset gap.
- Non-product documentation traversal cannot count as progress while the
  requested product files are absent.
- `productMaterialization.required` becomes true before the Rust product-file
  closure check can pass.
- The live proof includes `cargo run --quiet` output evidence, not just source
  materialization.

## Conclusion

`data_mapper.test35` proves that the old embedded Python framework was
expensive but had visible repair semantics. It generated many real assets and
encoded retry/repair as event and ledger truth.

T133 proves that the current TypeScript lane can eventually generate a tiny Rust
product, but it does not yet prove minimum overhead. It followed the wrong
executive graph and allowed broad document traversal to masquerade as progress
toward a single product asset.

The bug is not that Rust hello world is hard. The bug is that the evaluator did
not own the binding from observed product gap to graph action strongly enough.
