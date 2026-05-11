---
id: T-157
title: First-pass live product materialization closure contract
type: defect
ticket_category: realization_contract
status: completed
goal: post-t143-live-lane-hardening
build_tenant: typescript
owner: odd_sdlc
change_intent: Put the deterministic product-materialization closure law into the first F_P handoff so trivial live products do not learn schema, byproduct, and test-observation requirements by retry.
change_class: realization_refactor
re_entry_point: realization
priority: high
triaged_at: 2026-05-11
created_at: 2026-05-11
completed_at: 2026-05-11
governance_scope: STDO Method
source_documents:
  - specification/GOALS.md
  - .ai-workspace/tickets/completed/T-133-create-minimum-overhead-rust-hello-world-live-lane.md
  - build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260511T100827214Z_pid14157/run_summary.json
affected_boundary:
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs
  - build_tenants/typescript/test_env/tests/test_t118_worker_invocation_package.test.mjs
---

# T-157: First-Pass Live Product Materialization Closure Contract

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

The Rust hello-world live lane passed, but it needed four product-materialization
Claude attempts for a near-NOP product. The model was not the limiting factor.
The first F_P handoff did not expose closure law that F_D enforced later:

- undeclared build/test byproducts such as `Cargo.lock` and `target/` are not
  product materialization when the declared target set is exact
- `sdlc_worker_execution_evidence` is a closed JSON carrier with exact field
  names and exact shard kind `sdlc_worker_execution_shard_evidence`
- executable product materialization over a test contract must produce a real
  test observation (`testsObserved > 0`) unless it records failed or pending
  evidence lawfully

The retry loop eventually taught those facts through gap dossiers. That is the
wrong surface. They are deterministic closure law and must be present before
the first worker invocation.

## Target Truth

For product-materialization handoffs, `worker_invocation_package` /
`worker_prompt.md` carries the same schema and byproduct rules that postflight
will enforce. A trivial live app can close in one product-materialization worker
call when the worker follows the prompt.

## Closure Criteria

- The first product-materialization prompt names undeclared build/test
  byproducts as non-product files and instructs cleanup or isolation before
  return.
- The first product-materialization prompt gives the exact admitted execution
  evidence JSON shape, including exact parent and shard `kind` values.
- The first product-materialization prompt states that non-failed executable
  evidence must have a positive test observation count for test-contract
  closure.
- Focused semantic tests prove the prompt carries those rules without relying
  on retry context.
- Existing product-materialization and worker-invocation tests stay green.

## Non-Closure Conditions

- The fix only documents retry defects after failure.
- The fix broadens admission by accepting alias carrier kinds instead of
  exposing the exact admitted carrier.
- The fix suppresses postflight enforcement.
- The fix changes product authority or declared target binding semantics.

## Implementation

- `operator/handoff.ts` now puts first-pass product-materialization closure law
  into `worker_invocation_package.outcomeDirectives`.
- The directive is generic: declared product targets are the exact product
  surface for the edge; undeclared build/test byproducts must be isolated or
  cleaned before return.
- The directive gives the exact admitted
  `sdlc_worker_execution_evidence`/`sdlc_worker_execution_shard_evidence`
  carrier shape before worker invocation.
- The directive requires positive `testsObserved` for non-failed executable
  test evidence, instead of relying on retry dossiers to teach that rule.
- `test_t118_worker_invocation_package` now pins the first-pass law on the
  actual `Fg_materialize_declared_product_asset` handoff, not on unrelated
  declared-target packages.

## Data Mapper Generic Edge Walk

- `Fg_conform_project`: deterministic conformance edge; no product
  materialization exposure. Its job is to admit project shape and tenant
  constraints.
- `Fg_conform_project_authority`: authority worker edge; it may create or
  repair source authority, but it is not allowed to satisfy product
  materialization by writing runtime product assets.
- `Fg_materialize_declared_product_asset`: generic product-materialization
  edge. Data mapper exercises the broad case because it carries module
  directory targets, SBT build/test contracts, byproducts, and execution
  evidence. This ticket fixes the first-pass handoff for that edge without
  adding data_mapper-specific code.
- Post-materialization continuation: runner/evaluator truth must drive retry,
  yield, repair, re-entry, or closure disposition. Live liveness/prose alone
  must not advance the graph.

## Verification

From `build_tenants/typescript`:

```bash
npm run lint:semantic
```

Passed.

```bash
npm run build:semantic && node --test test_env/tests/test_t118_worker_invocation_package.test.mjs && node --test test_env/tests/test_t066_product_materialization_contract.test.mjs
```

Passed: 37 tests across the final focused runs. This includes the T-157
first-pass prompt assertion and the T-066 installed data_mapper successor
materialization case.

```bash
npm run build:semantic && node --test \
  test_env/tests/test_t143_product_materialization_authority_targets.test.mjs \
  test_env/tests/test_t151_runner_evaluator_sovereignty.test.mjs \
  test_env/tests/test_t152_data_mapper_transformation_set_partition.test.mjs \
  test_env/tests/test_t153_non_close_disposition_parity.test.mjs \
  test_env/tests/test_t154_no_harness_target_data_mapper_parity.test.mjs
```

Passed: 31 tests. This pins target derivation, evaluator-owned continuation,
data_mapper transformation-set partitioning, and no-harness data_mapper parity.

```bash
npm run test:semantic
```

Passed: 427 tests.

## Remaining Live Evidence

No fresh live data_mapper run is claimed by this ticket. The deterministic
generic preflight is green; a fresh live run remains the closure evidence for
the external data_mapper lane.
