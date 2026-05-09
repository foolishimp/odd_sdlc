# REVIEW: T-131 Edge Traversal Analysis

**Author**: codex
**Date**: 2026-05-09T10:52:04+10:00
**Addresses**: T-131 guided odd_chat live build archive
**Status**: Open

## Summary

Current reality: the 20260508T232834683Z T-131 run was not hung and was not stopped by ABG liveness timeout. It was a live installed odd_sdlc traversal over `graph_function:bootstrap_release_self_test`, using `process://codex?model=gpt-5.5&effort=medium`, and it kept iterating because each edge either closed or produced a typed retryable gap. The final run summary is `incomplete` because the harness reached its configured step budget and the expected odd_chat product file contract was not yet satisfied.

The important defect is target shape, not liveness. The run used the broad `bootstrap_release_self_test` graph, so it behaved like a full SDLC bootstrap lane rather than a bounded odd_chat product-build proof. It advanced through 17 productive vectors and stopped after `qualify_component_realization_surface` advanced the graph to `derive_realization_schedule_surface`.

Evidence root:

```text
build_tenants/typescript/test_env/test_runs/t131_guided_odd_chat_bootstrap_sandbox/20260508T232834683Z_pid97709
```

Runtime root:

```text
build_tenants/typescript/test_env/test_runs/t131_guided_odd_chat_bootstrap_sandbox/20260508T232834683Z_pid97709/workspace/.ai-workspace/runtime/odd_sdlc
```

## Run Facts

| Item | Value |
| --- | --- |
| Installed odd_sdlc command | `workspace/node_modules/.bin/odd-sdlc-ts` |
| Installed ABG package | `@abiogenesis/typescript-tenant@3.7.1-rc.1` |
| Worker | `process://codex?model=gpt-5.5&effort=medium` |
| Graph function | `bootstrap_release_self_test` |
| Harness max steps | 18 |
| Installed command timeout | `null` |
| Run summary verdict | `incomplete` |
| Archive time span | about 63 minutes from scenario snapshot to `run_summary.json` |
| Last closed vector | vector 16, `qualify_component_realization_surface` |
| Next current edge after last traversal | `derive_realization_schedule_surface` |

The public `gaps` calls were read-only evaluator views. For each step they projected `rankingAuthority: abiogenesis_construction_priority_projection`, `localRankingAuthority: false`, and `choosesNextTraversal: false`. The projected best action followed the current graph vector under the default follow-graph priority scheme.

## Edge Traversal Table

| Step | Vector | Edge | Target Asset | Strategy | Attempts | Assurance | What Kept It Moving |
| --- | ---: | --- | --- | --- | ---: | --- | --- |
| 0 | induction | `Fg_conform_project` | conformed project | n/a | 1 | converged | Installed workspace conformed and graph induction selected `derive_intent_surface`. |
| 1 | 0 | `derive_intent_surface` | `intent_surface` | full breadth | 1 | close allowed | Semantic convergence and requirement fulfillment were satisfied; materialization was not applicable. |
| 2 | 1 | `derive_product_surface` | `product_surface` | full breadth | 1 | close allowed | Same pattern: worker output admitted, postflight passed, assurance closed. |
| 3 | 2 | `derive_goal_surface` | `goal_surface` | full breadth | 1 | close allowed | Goal surface closed and gaps projected the next vector. |
| 4 | 3 | `derive_requirement_surface` | `requirement_surface` | full breadth | 1 | close allowed | Requirement surface closed against bootstrap and requirement refs. |
| 5 | 4 | `derive_feature_decomp_surface` | `feature_decomp_surface` | steel thread | 1 | close allowed | Steel-thread traversal still ran with full-breadth feature scope in the archive and closed. |
| 6 | 5 | `derive_uat_testcases_surface` | `uat_testcases_surface` | steel thread | 1 | close allowed | UAT test-case surface closed; no retry dossier. |
| 7 | 6 | `derive_design_surface` | `design_surface` | steel thread | 1 | close allowed | Design surface closed; no gap reasons. |
| 8 | 7 | `derive_scenario_surface` | `scenario_surface` | steel thread | 1 | close allowed | Scenario surface closed; no gap reasons. |
| 9 | 8 | `derive_implementation_design_surface` | `implementation_design_surface` | steel thread | 1 | close allowed | Implementation design closed; no gap reasons. |
| 10 | 9 | `select_implementation_stack_profile` | `implementation_stack_profile` | full breadth | 1 | close allowed | Stack profile closed; no gap reasons. |
| 11 | 10 | `derive_implementation_module_surface` | `implementation_module_surface` | steel thread | 2 | retry, then close | First attempt opened 14 design-completeness gaps for owned entities with no typed attributes. Reentry was `same_edge_retry`. Second attempt carried the prior gap dossier and closed design completeness. |
| 12 | 11 | `derive_aggregate_domain_model_surface` | `aggregate_domain_model_surface` | steel thread | 1 | close allowed | Design completeness stayed satisfied and the aggregate domain model closed. |
| 13 | 12 | `derive_implementation_component_topology_surface` | `implementation_component_topology_surface` | steel thread | 1 | close allowed | Component-depth assurance was satisfied; no retry. |
| 14 | 13 | `derive_aggregate_sunny_day_sequence_surface` | `aggregate_sunny_day_sequence_surface` | steel thread | 1 | close allowed | Design completeness and requirement fulfillment closed. |
| 15 | 14 | `derive_component_realization_schedule_surface` | `component_realization_schedule_surface` | full breadth | 1 | close allowed | Component-depth schedule closed. |
| 16 | 15 | `derive_component_code_surface` | `component_code_surface` | full breadth | 2 | repair, then close | First attempt materialized 17 source files, but component-depth admission rejected the register because `componentRealizationRows[0].kind` was missing. Reentry was `repair_worker_output`. Second attempt carried the repair dossier and closed. |
| 17 | 16 | `qualify_component_realization_surface` | `component_realization_qualification_surface` | full breadth | 2 | repair, then close | First attempt failed component-depth admission because `componentRealizationRows[0].kind` had an unexpected protocol value. Reentry was `repair_worker_output`. Second attempt carried the repair dossier and closed. |

## Retry Details

### Vector 10: Implementation Module

First archive:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260508T234926456Z_pid86639
```

Gap dossier:

- `status: open`
- `retryEligible: true`
- `nextLawfulActions: ["retry_same_edge"]`
- 14 reasons, all `design_attribute_missing:*`
- examples:
  - `entity:app-core.oddchatcommandcontext`
  - `entity:app-core.oddchatcommandresult`
  - `entity:app-core.oddchatdomainadapter`
  - `entity:app-core.oddchatdomainnode`
  - `entity:app-core.oddchatgraphinvocationrequest`

Second archive:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260508T235409100Z_pid86639
```

The retry context carried the prior gap dossier. Assurance changed from `design_completeness:open_gap` to `design_completeness:satisfied`, and the edge closed. This is a valid same-edge self-healing loop.

### Vector 15: Component Code

First archive:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260509T001422852Z_pid31183
```

Gap dossier:

- `status: open`
- `retryEligible: true`
- `nextLawfulActions: ["repair_worker_output"]`
- reason: `component_depth_register_invalid:component_depth_register.componentRealizationRows[0].kind: expected string`
- materialized files: 17

Second archive:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260509T002032807Z_pid31183
```

The repair retry admitted the component-depth register and preserved the 17 materialized product files. Assurance changed from `component_depth:open_gap` to `component_depth:satisfied`, and the edge closed.

### Vector 16: Component Realization Qualification

First archive:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260509T002414896Z_pid68145
```

Gap dossier:

- `status: open`
- `retryEligible: true`
- `nextLawfulActions: ["repair_worker_output"]`
- reason: `component_depth_register_invalid:component_depth_register.componentRealizationRows[0].kind: unexpected protocol value`

Second archive:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260509T002759314Z_pid68145
```

The repair retry produced a register accepted by component-depth assurance. The edge closed and the graph advanced to `derive_realization_schedule_surface`.

## Liveness And Events

The runtime liveness observer was active on every worker traversal. Each edge archive contains `runtime_liveness_observer_projection.json`, `worker_process_events.jsonl`, PTY trace files, and worker stdout/stderr refs.

Representative liveness facts:

| Edge Archive | Activity Rows | Heartbeats | Stream Activity | Disposition |
| --- | ---: | ---: | ---: | --- |
| `20260508T232837349Z_pid97871` | 40 | 6 | 32 | `continue_waiting`, `activity_recent` |
| `20260508T234926456Z_pid86639` | 58 | 18 | 38 | `continue_waiting`, `activity_recent` |
| `20260509T001422852Z_pid31183` | 94 | 24 | 68 | `continue_waiting`, `activity_recent` |
| `20260509T002032807Z_pid31183` | 56 | 14 | 40 | `continue_waiting`, `activity_recent` |
| `20260509T002414896Z_pid68145` | 60 | 14 | 44 | `continue_waiting`, `activity_recent` |
| `20260509T002759314Z_pid68145` | 56 | 14 | 40 | `continue_waiting`, `activity_recent` |

The liveness policy did not issue the stop. The observed disposition during worker activity was `continue_waiting` with reason `activity_recent`. The installed command had no flat timeout in this harness run (`installedCommandTimeoutMs: null`).

## Generated Product State

At the end of step 17, the generated source tree contained:

```text
build_tenants/typescript/src/app/carrierValidation.ts
build_tenants/typescript/src/app/domainProjection.ts
build_tenants/typescript/src/app/evidenceLedger.ts
build_tenants/typescript/src/app/invocationService.ts
build_tenants/typescript/src/app/workspaceStore.ts
build_tenants/typescript/src/cli.ts
build_tenants/typescript/src/commands/actions.ts
build_tenants/typescript/src/commands/domain.ts
build_tenants/typescript/src/commands/evidence.ts
build_tenants/typescript/src/commands/graphFunctions.ts
build_tenants/typescript/src/commands/intent.ts
build_tenants/typescript/src/commands/invoke.ts
build_tenants/typescript/src/commands/workspace.ts
build_tenants/typescript/src/domain/defaultDomainAdapter.ts
build_tenants/typescript/src/domain/domainAdapter.ts
build_tenants/typescript/src/render.ts
build_tenants/typescript/src/types.ts
```

The harness expected file contract for that run still required stale or missing package/test paths:

```text
build_tenants/typescript/package.json
build_tenants/typescript/tsconfig.json
build_tenants/typescript/src/domain/invocation.ts
build_tenants/typescript/src/domain/package.ts
build_tenants/typescript/src/domain/projection.ts
build_tenants/typescript/src/evidence/ledger.ts
build_tenants/typescript/src/evidence/status.ts
build_tenants/typescript/src/workspace/store.ts
build_tenants/typescript/test/odd_chat.test.ts
```

So the generated code shape and the harness expectation were not aligned in that run. Later T-131 harness edits partially corrected the expected source layout, but the run analyzed here predates those corrections.

## Why The Run Kept Iterating

There were three iteration causes:

1. Normal graph progression. `gaps` projected the next open vector with ABG construction priority projection. The harness then invoked `start --until first_traversal` for that edge. When postflight and assurance returned `close_allowed`, the harness looped to `gaps` again.
2. Same-edge retry. Vector 10 produced design-completeness gaps. The gap dossier declared `retry_same_edge`, and the next attempt consumed the prior dossier and closed the edge.
3. Repair-worker-output retry. Vectors 15 and 16 produced component-depth register admission failures. Each gap dossier declared `repair_worker_output`, and the next attempt consumed the repair context and closed the edge.

This is meaningful self-healing evidence, but it is evidence for the broad bootstrap graph. It is not yet the compact odd_chat live-build proof T-131 was intended to create.

## Why It Did Not Finish T-131

The run did not finish because the live target and the harness success predicate were too broad and partly stale:

- The target was `graph_function:bootstrap_release_self_test`, which is a full lifecycle graph, not a bounded odd_chat build graph.
- The harness stopped at `MAX_STEPS=18`; after step 17 the graph still had more release lifecycle vectors to traverse.
- The expected file contract in that run still demanded package/test files and several old source paths that were not produced by the current generated layout.
- Because the expected files were not all present, generated odd_chat `npm install`, `npm run build`, `npm test`, and CLI command proofs were never run.

The root cause is not a liveness failure and not a stuck worker. It is that T-131 was exercising the wrong unit of proof: full SDLC lifecycle traversal instead of a bounded graph function or evaluator-selected slice that builds the odd_chat package and stops when product build/test proof is admitted.

## Later Interrupted Run

There is a later archive:

```text
build_tenants/typescript/test_env/test_runs/t131_guided_odd_chat_bootstrap_sandbox/20260509T003529228Z_pid77690
```

That run reached only step 5, `derive_feature_decomp_surface`, before being interrupted from the terminal. It should not be used as the main edge-traversal evidence for this analysis.

## Recommended Action

Keep this post as forensic evidence for the live traversal. Update T-131 implementation around a bounded proof target:

1. Do not rerun the broad `bootstrap_release_self_test` graph as the T-131 closure proof.
2. Add or select a lawful bounded graph function for odd_chat package construction.
3. Stop the harness when odd_chat package scaffold, source, test, build, and CLI smoke evidence are admitted.
4. Preserve the runtime liveness/event/log capture pattern, because the probes worked and were useful.
5. Preserve the retry evidence path, but make retries repair the bounded odd_chat asset set rather than continuing through the full release lifecycle.
