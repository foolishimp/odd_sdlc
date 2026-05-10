---
id: T-132
title: Create hello-world single-tenant live proof lane
type: feature
ticket_category: live_proof_lane
status: completed
review_status: closed_implemented
goal: typescript-rc-bounded-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Add a compact live proof candidate where odd_sdlc starts from one bootstrap document, builds one hello-world build tenant, and proves the generated program by executing it and asserting the emitted output.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/test_env/fixtures/t132_hello_world_single_tenant/
  - build_tenants/typescript/test_env/live/test_t132_hello_world_single_tenant_live_build.test.mjs
  - build_tenants/typescript/package.json
priority: high
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-10
completed_at: 2026-05-10
governance_scope: STDO Method
dependencies:
  - T-129 completed ABG 3.7.1 evaluator and liveness substrate migration.
  - T-141 restores requirement-to-product materialization as a GTL transform boundary.
related_tickets:
  - T-041 remains open for data_mapper end-goal/stress proof.
  - T-131 remains open for guided odd_chat product build proof.
  - T-133 remains the Rust minimum-overhead baseline.
  - T-142 owns the deferred multi-tenant fan-out feature.
intake_source: The operator requested a simpler new test rather than further unpacking the long odd_chat/data_mapper lanes. The first T-132 shape asked for five independent language tenants, but the current materialization graph function selects one output root at a time. The 2026-05-10 live attempt proved this mismatch: one JavaScript source file was created, then the harness kept re-entering because the remaining tenants/design surfaces were still missing. The operator repriced the current bug fix to a single tenant and accepted multi-tenant fan-out as backlog work.
target_truth: odd_sdlc has a compact canonical live-build candidate where a fresh sandbox starts from one bootstrap document, installs odd_sdlc, generates one JavaScript build tenant under `build_tenants/hello_world_javascript`, and proves the generated program by executing it and asserting exact `Hello, world!` output.
superseded_truth: A five-tenant expected-file contract can be used against the current one-output-root materialization action, or worker prose can count as output proof without process execution.
closure_law: This ticket closes only when the bootstrap contract is validated deterministically, the bootstrap sandbox starts without generated source files, the package exposes a focused T-132 test command, and the opt-in live lane installs odd_sdlc into a fresh sandbox, generates the JavaScript tenant source file, executes it with node, and archives output evidence under the test run root.
evaluation_criteria:
  - The bootstrap document declares product intent, one JavaScript build tenant, exact expected output, expected generated source file, lifecycle graph, lawful actions, and commands.
  - The deterministic contract test fails if tenant identity is missing, expected files are missing/duplicated, lifecycle actions are missing, or the fixture carries prebuilt source.
  - The live lane uses the installed odd_sdlc command path from the sandbox install result.
  - The live lane writes runtime/events under `build_tenants/typescript/test_env/test_runs/t132_hello_world_single_tenant_bootstrap_sandbox/<timestamp>_pid<pid>/workspace/.ai-workspace`.
  - Runtime transform assets under `.ai-workspace/runtime/odd_sdlc/assets` are not mistaken for product materialization.
  - The generated product file is required under `build_tenants/hello_world_javascript/src/hello.js`.
  - The generated program is executed with node and must emit exactly `Hello, world!` after trimming trailing whitespace.
  - The live harness fails closed with a typed no-progress terminal reason if the same traversal state repeats without new product files or runtime/operator archive movement.
proof_surface:
  - build_tenants/typescript/test_env/fixtures/t132_hello_world_single_tenant/bootstrap.md
  - build_tenants/typescript/test_env/live/test_t132_hello_world_single_tenant_live_build.test.mjs
  - npm run test:t132
  - npm run test:t132:hello-world-live for opt-in live proof
non_closure_conditions:
  - The fixture contains prebuilt hello-world implementation files.
  - The generated product collapses into `build_tenants/hello_world_suite` instead of `build_tenants/hello_world_javascript`.
  - The live lane bypasses installed odd_sdlc and writes implementation files from the harness as proof.
  - The generated source file is missing.
  - The generated program is not executed.
  - The worker narrative is treated as output proof without process execution.
  - The lane loops indefinitely after a repeated no-progress traversal state.
  - The ticket is used to close T-041, T-131, or T-142 without separate review.
---

# T-132: Hello-World Single-Tenant Live Proof Lane

## STDO Triage

First missing layer: design.

The current materialization spine is lawful for one selected output root. The
five-tenant scenario asked for fan-out behavior that has not yet been designed:

```text
requirements_surface
  -> multiple tenant target bindings
  -> materialize every tenant target
  -> close only when every target has evidence
```

That is a real feature, now tracked separately by T-142. This ticket is the
current executable proof that the installed odd_sdlc path can build one product
tenant from a bootstrap document and prove the generated output by execution.

## Target Loop

```text
bootstrap start document
  -> sandbox setup
  -> install odd_sdlc as builder
  -> traverse installed odd_sdlc
  -> materialize build_tenants/hello_world_javascript/src/hello.js
  -> execute node build_tenants/hello_world_javascript/src/hello.js
  -> archive stdout/status proof
```

The harness may observe expected product files to decide test completion, but it
must not generate those files itself.

## 2026-05-10 Reprice

The stopped five-tenant run archive was:

`build_tenants/typescript/test_env/test_runs/t132_hello_world_five_languages_bootstrap_sandbox/20260510T003908208Z_pid38934`

Observed behavior:

- T-141 worked for the requirements edge: downstream product pressure selected
  `Fg_materialize_declared_product_asset`.
- The worker produced one selected tenant file:
  `build_tenants/hello_world_javascript/src/hello.js`.
- The scenario contract still required fourteen additional files across four
  other tenants and per-tenant design/ADR/module surfaces.
- The harness kept re-entering because the scenario expected-file surface and
  the one-output-root materialization surface disagreed.

The fix is not to hide a max step. The fix is to make this lane single-tenant
and fail closed if no progress repeats. Multi-tenant target fan-out is T-142.

## Implementation Evidence - 2026-05-10

Focused deterministic proof:

```bash
npm run test:t132
```

Result:

- 2 passed
- 1 skipped because the live flag was not set

Live proof:

```bash
npm run test:t132:hello-world-live
```

Result:

- 3 passed
- duration: 564004.848083 ms
- archive:
  `build_tenants/typescript/test_env/test_runs/t132_hello_world_single_tenant_bootstrap_sandbox/20260510T010610413Z_pid11298`
- run summary verdict: `passed`
- elapsedMs: 562885
- step records: 12
- generated product file:
  `build_tenants/hello_world_javascript/src/hello.js`
- execution proof stdout: `Hello, world!`

Observed traversal:

- the run still traverses broad early SDLC edges before product
  materialization;
- it reaches `Fg_materialize_declared_product_asset`;
- it terminates when the single selected tenant source file exists;
- it does not enter the old multi-tenant no-progress loop.

## Closure Evidence - 2026-05-10

Fresh live proof:

```bash
npm run test:t132:hello-world-live
# 3/3 passed
```

Closure archive:

`build_tenants/typescript/test_env/test_runs/t132_hello_world_single_tenant_bootstrap_sandbox/20260510T084735429Z_pid82785`

Observed result:

- `Fg_conform_project` converged through the installed sandbox command path.
- `Fg_conform_project_authority` closed with `postflight: passed` and
  `assurance: close_allowed`.
- Public gaps projected `Fg_materialize_declared_product_asset` as the current
  materialization edge.
- The start command materialized
  `build_tenants/hello_world_javascript/src/hello.js`.
- Node execution produced exact stdout `Hello, world!` with exit status `0`.
- `run_summary.json` records `verdict: passed`, `elapsedMs: 136270`,
  one expected product file present, runtime file counts, operator-run counts,
  and the tenant execution proof.

Harness closure note:

- The live assertion for F_P-generated authority content now checks semantic
  content and T132 requirement markers instead of one exact wording for
  product-edge and execution-proof phrasing. This keeps the assurance on
  content completion while allowing lawful F_P wording variation.

Closure boundary:

- This closes the one-tenant JavaScript hello-world live proof lane.
- It does not close T-142 multi-tenant fan-out or T-041 data_mapper parity.
