---
id: T-133
title: Create minimum-overhead Rust hello-world live lane
type: feature
ticket_category: live_proof_lane
status: completed
review_status: closed_implemented
goal: typescript-rc-bounded-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Add a one-build-tenant Rust hello-world live lane that measures the minimum practical overhead of bringing installed odd_sdlc to a new product.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/test_env/fixtures/t133_rust_hello_world_minimal/
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/package.json
priority: high
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-10
completed_at: 2026-05-10
governance_scope: STDO Method
dependencies:
  - T-142 records the deferred five-language/full-graph fan-out lane and motivates the smaller baseline.
related_tickets:
  - T-132 is now the JavaScript single-tenant live proof lane.
  - T-142 remains backlog as the five-language stress lane.
  - T-041 remains open for data_mapper end-goal proof.
  - T-134 defines the corrected `bootstrap_sdlc` induction graph function required before this can prove minimum bootstrap overhead.
intake_source: The operator asked for a simpler live sandbox that builds one Rust hello-world build tenant so the team can measure the minimum overhead of using odd_sdlc rather than the overhead of a broad five-language/full-SDLC graph.
target_truth: odd_sdlc has a compact one-tenant live-build candidate where a fresh sandbox starts from one bootstrap document, installs odd_sdlc, generates one Rust build tenant under `build_tenants/hello_world_rust`, and proves the product by running `cargo run --quiet` and asserting exact `Hello, world!` output.
superseded_truth: A multi-tenant or full release-style SDLC traversal is the only valid live proof for installed odd_sdlc overhead, or worker prose can count as output proof without process execution.
closure_law: This ticket closes only after the bootstrap contract validates deterministically, the bootstrap-only sandbox contains no generated Rust implementation, the package exposes focused T-133 commands, and the opt-in live lane installs odd_sdlc into a fresh sandbox, generates `Cargo.toml` and `src/main.rs` under the Rust build tenant, executes the generated Rust program, and archives process evidence under the test run root.
evaluation_criteria:
  - The bootstrap document declares one Rust build tenant, one exact expected output, selected output root, expected generated product files, lifecycle graph, lawful actions, and commands.
  - The bootstrap fixture contains only scenario authority and no prebuilt Rust source or Cargo manifest.
  - The deterministic test rejects missing tenant identity, missing expected files, duplicate expected files, and missing execution command.
  - The live lane uses the installed odd_sdlc command path from the sandbox install result.
  - The live lane invokes the scenario-declared minimum graph/action path for `build_hello_world_rust_minimal`; it must not silently substitute the broad `bootstrap_release_self_test` executive.
  - The first blocking gap after project conformance must bind the requested Rust product files as the highest-value missing product asset, or fail with an explicit evaluator/graph-binding defect.
  - Runtime transform assets remain under `.ai-workspace/runtime/odd_sdlc/assets`; generated product files must appear under `build_tenants/hello_world_rust`.
  - The live lane terminates as soon as the minimal product files exist, then executes `cargo run --quiet` from the tenant root.
  - The archived proof includes stdout, stderr, exit status, generated-file state, step summaries, and installed command timeout configuration.
  - The run summary is usable as an overhead baseline: step count, elapsed wall time, runtime file counts, operator-run counts, and generated product file count are visible.
proof_surface:
  - build_tenants/typescript/test_env/fixtures/t133_rust_hello_world_minimal/bootstrap.md
  - build_tenants/typescript/test_env/live/test_t133_rust_hello_world_minimal_live_build.test.mjs
  - npm run test:t133
  - npm run test:t133:rust-live
non_closure_conditions:
  - The fixture contains prebuilt `Cargo.toml`, `src/main.rs`, or generated proof files.
  - The lane requires design ADR/module files for closure.
  - The harness writes product files as proof instead of installed odd_sdlc traversal.
  - The harness or installed command runs `bootstrap_release_self_test` when the bootstrap contract declares `build_hello_world_rust_minimal`.
  - The run spends multiple graph traversals deriving non-product documentation while `Cargo.toml` and `src/main.rs` remain missing and no evaluator defect is raised.
  - Product materialization remains `required: false` for all traversals while the bootstrap's requested product files remain unbuilt.
  - The worker narrative is treated as execution proof.
  - Rust execution is skipped silently because `cargo` is unavailable.
  - The ticket is used to close T-132, T-142, or T-041.
---

# T-133: Minimum-Overhead Rust Hello-World Live Lane

## STDO Triage

First missing layer: design.

The deferred T-142 multi-tenant stress lane does not measure the floor cost of
using odd_sdlc. It asks the framework to derive broad SDLC surfaces for a
five-tenant suite. T-133 narrows the proof to one product tenant and one
executable claim:

```text
bootstrap start document
  -> sandbox setup
  -> install odd_sdlc as builder
  -> generate build_tenants/hello_world_rust/Cargo.toml
  -> generate build_tenants/hello_world_rust/src/main.rs
  -> run cargo
  -> archive stdout proof
```

This ticket is intentionally not a release-depth or multi-tenant proof. It is
the minimum-overhead baseline for bringing installed odd_sdlc to a new product.

## Relationship To T-132/T-142

T-133 is the Rust minimum-overhead rung in the live-proof ladder. T-132 is now
the current JavaScript single-tenant proof. T-142 owns the old five-language
fan-out use case.

```text
T-132: one JavaScript tenant, source file, node execution
T-133: one Rust tenant, Cargo manifest, Rust source, cargo execution
T-142: five language tenants, per-tenant fan-out and five executions
```

Keep T-142 active for later escalation. A clean T-133 result should tell us the
minimum overhead of installed odd_sdlc; a clean T-142 result should tell us how
that overhead grows when the same proof is expanded across multiple tenants.

## Blocking Finding - 2026-05-09

The first live T-133 run exposed a hard non-closure condition. The bootstrap
contract declares `lifecycleGraph.graphFunction:
build_hello_world_rust_minimal`, but the live harness invoked
`graph_function:bootstrap_release_self_test`. The installed run then advanced
through normal SDLC document edges:

```text
derive_intent_surface
derive_product_surface
derive_goal_surface
derive_requirement_surface
derive_feature_decomp_surface
derive_uat_testcases_surface
derive_design_surface
derive_scenario_surface
derive_implementation_design_surface
select_implementation_stack_profile
derive_implementation_module_surface
derive_aggregate_domain_model_surface
derive_implementation_component_topology_surface
derive_aggregate_sunny_day_sequence_surface
```

The run eventually passed after about 4,466,397 ms, or 74.4 minutes, and
generated the Rust product files plus `cargo run --quiet` proof. That is useful
evidence that broad release construction can eventually materialize a tiny Rust
product. It is not evidence for minimum bootstrap overhead.

The defect is semantic: the gap between the operator's first action
("bootstrap an unknown or sparse project folder") and the graph action selected
by the harness ("run the broad release self-test executive") did not close.
T-134 now owns the corrected bootstrap law: `bootstrap_sdlc` means induction,
initialization, and normalization over available assets. It should create or
update project bootstrap/profile/identity surfaces and then project the next
lawful evaluator action. It should not automatically derive requirements,
design, implementation, tests, or release surfaces.

## Implementation Checklist

- [x] Add compact Rust bootstrap fixture.
- [x] Add deterministic contract and bootstrap-only sandbox checks.
- [x] Add opt-in live sandbox test that installs odd_sdlc and uses the installed command path.
- [x] Remove the hardcoded `bootstrap_release_self_test` target from the T-133 harness; derive the target from the bootstrap contract and fail closed if it is not a published lawful graph action.
- [x] Add a regression proving completed authority content projects product materialization as the next action instead of relying on broad documentation traversal.
- [x] Add a regression proving `productMaterialization.required` becomes true before the Rust product file closure check can pass.
- [x] Require generated Rust product files under `build_tenants/hello_world_rust`.
- [x] Run generated Rust program with `cargo run --quiet`.
- [x] Archive overhead metrics and execution proof.
- [x] Run `npm run test:t133`.
- [x] Run `npm run test:t133:rust-live` for closure review after the stricter content and materialization guards.

## Conformance Evidence - 2026-05-10

The authority-conformance portion of T-133 now passes against the corrected
T-134 graph function.

Verification:

- `npm run test:t133` passed deterministic checks, 2/2, with the full live
  product test skipped because `ODD_SDLC_TS_T133_RUST_HELLO_WORLD_LIVE` was not
  set.
- `ODD_SDLC_TS_T133_RUST_HELLO_WORLD_LIVE=1 ODD_SDLC_TS_LIVE_CONFORMANCE_ONLY=1 npm run test:t133`
  passed, 3/3.
- Fresh conformance-only live archive:
  `build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260510T071801661Z_pid84063`.

Observed result:

- `Fg_conform_project` converged.
- `Fg_conform_project_authority` consumed the declared `source_file`
  authority input from `bootstrap.md`.
- Conformed authority surfaces include Rust product intent, product definition,
  goals, and induced requirements for tenant identity, expected files, exact
  output, and execution command.
- The next lawful action points at `Fg_materialize_declared_product_asset`.
- Product files are still absent by design in this conformance-only proof.

Remaining closure gate:

T-133 remains active until `npm run test:t133:rust-live` runs without
`ODD_SDLC_TS_LIVE_CONFORMANCE_ONLY=1`, materializes
`build_tenants/hello_world_rust/Cargo.toml` and
`build_tenants/hello_world_rust/src/main.rs`, executes
`cargo run --quiet`, and archives exact `Hello, world!` process evidence.

## Closure Evidence - 2026-05-10

Fresh full product live proof:

```bash
npm run test:t133:rust-live
# 3/3 passed
```

Closure archive:

`build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260510T082113534Z_pid77797`

Observed result:

- `Fg_conform_project` converged through the installed sandbox command path.
- `Fg_conform_project_authority` closed with `postflight: passed` and
  `assurance: close_allowed`.
- The authority traversal produced downstream materialization pressure and
  selected `Fg_materialize_declared_product_asset`.
- Public gaps projected `Fg_materialize_declared_product_asset` as the current
  materialization edge.
- The product materialization traversal generated:
  - `build_tenants/hello_world_rust/Cargo.toml`
  - `build_tenants/hello_world_rust/src/main.rs`
- `cargo run --quiet` produced exact stdout `Hello, world!` with exit status
  `0`.
- `run_summary.json` records `verdict: passed`, `elapsedMs: 94719`, two
  expected product files present, runtime file counts, operator-run counts, and
  the tenant execution proof.

Closure boundary:

- This closes the one-tenant Rust minimum-overhead live proof lane.
- It does not close T-132, T-142, or T-041.
