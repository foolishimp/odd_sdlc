---
id: T-188
title: Force F_P depth through same-sandbox iteration and prompt control
type: bug
ticket_category: implementation_migration
status: active
proof_status: pending
build_tenant: typescript
owner: odd_sdlc
goal: make data-mapper-scale depth emerge from repeated F_P construct/evaluate/repair turns instead of one-shot closure or F_D compensation
change_intent: Preserve the T-185/T-187 authority decisions while making broad SDLC work converge through agentic F_P iteration: transform workers may use subagents/workstreams, evaluators must emit concrete depth gaps, and ABG/F_D must admit, fold, and route those findings without evaluating product depth itself.
change_class: design_reframe
re_entry_point: design
priority: critical
triaged_at: 2026-06-01
created_at: 2026-06-01
updated_at: 2026-06-02
governance_scope: STDO Method
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/completed/T-185-agent-internal-subworkstreams-for-compute-stage-acceleration.md
  - .ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md
  - .ai-workspace/comments/codex/20260601T122142AEST_data_mapper_latest_vs_test35_depth_review.md
related_tickets:
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/completed/T-185-agent-internal-subworkstreams-for-compute-stage-acceleration.md
  - .ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md
  - .ai-workspace/tickets/completed/T-189-close-t188-runtime-authority-bug-ledger-and-abg-handoff.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-147-realize-t188-runtime-authority-invariants-in-abg.md
affected_boundary:
  - build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/operator/component_depth_register.ts
  - build_tenants/typescript/code/src/operator/plugins/consequence/edge_projection.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/fixtures/
  - build_tenants/typescript/test_env/sandbox/
  - build_tenants/typescript/test_env/live/
excluded_boundary:
  - F_D semantic evaluation of product depth
  - deterministic ADR/source/test parsing that decides product meaning in core SDLC
  - external patches to generated data_mapper product code
  - stack-specific defaults in SDLC core
  - new sandbox starts when same-sandbox repair/resume is possible
target_truth: Broad/data-mapper-scale work is expected to need many bounded F_P turns. `F_P.transform` may use agent-internal subagents or workstreams to materialize a tranche and return honest residual pressure. `evaluate.C/F_P` judges depth and emits fulfilled/partial/blocked findings with concrete repair actions. ABG/F_D admits those returned facts, folds residual pressure, and routes same-sandbox re-entry. It never decides product depth itself and never compensates for shallow product work.
superseded_truth: A data-mapper-scale lane can close from a shallow one-shot product artifact because broad obligations were cited, because partial findings were converted into unowned downstream carry, or because a blocked depth/parity carrier was structurally admitted while its blocked status was ignored.
closure_law: T-188 closes only when admitted evaluator open obligations and blocked depth/parity carriers cannot disappear during closure; broad prompts explicitly normalize tranche-based F_P iteration; same-sandbox repair is the default for depth gaps; and a live or sandbox data-mapper-scale proof shows depth pressure forcing F_P iteration without F_D semantic compensation or external product-code patches.
evaluation_criteria:
  - transform prompts for broad/domain-product work tell the worker to work in bounded tranches, use subagents/workstreams when useful, and return honest residual pressure rather than claiming final parity in one pass
  - evaluate prompts require concrete depth findings: missing behavior/test overlap is partial or blocked with specific repair actions, not fulfilled by tag/path/schema/test-smoke evidence alone
  - `fp_evaluate_result.status: admitted_with_open_obligations` contributes closure residual pressure unless every open finding is lawfully bound to a concrete downstream edge that still exists in the active graph
  - proof/release/terminal edges cannot hide open obligations as future pressure
  - `releaseDepthParity.status: blocked` or component repair schedule `triage_gap` remains valid admitted truth but prevents edge/route close until repaired or lawfully repriced
  - downstream carry requires explicit downstream graph-function refs, target binding refs, and ownership; otherwise the open obligation remains edge-local residual pressure
  - same-sandbox retry/repair preserves the active workspace and resumes from the failed edge when the defect is product-worksite depth, not framework/runtime failure
  - delivery includes a dedicated data_mapper-lite lifecycle sandbox/lane that is small enough for tight proof but still traverses requirement, design, component code, test design, component test, test execution result, repair if required, and release surfaces
  - data_mapper-lite bootstrap is sourced from the canonical data_mapper requirements document, selecting a small explicit requirement subset sufficient to prove depth, rather than inventing a toy product brief
  - the data_mapper-lite proof must generate product tests and run them through the normal installed operator test-execution evidence path
  - tests prove the above through synthetic bad-depth fixtures before any data-mapper live run is accepted as proof
proof_surface:
  - deterministic fixture for the latest-run failure shape: `fp_evaluate_result` has fulfilled plus partial obligations, and operator closure must not be `close`
  - deterministic fixture for blocked `releaseDepthParity` showing structural admission without closure
  - prompt-boundary tests proving broad workers receive tranche/iteration guidance but no F_D semantic recipe
  - consequence/closure tests proving downstream carry cannot erase open obligations without concrete downstream ownership
  - checked-in data_mapper-lite fixture generated from a documented subset of canonical data_mapper requirements, plus live/sandbox lifecycle runner that proves generated tests execute through the standard test lifecycle, not by a harness shortcut
  - same-sandbox live or sandbox data-mapper proof that shows multiple F_P iterations caused by admitted depth findings and no external product-code patching
non_closure_conditions:
  - F_D/core SDLC decides whether generated data_mapper code is behaviorally deep enough
  - a blocked/partial evaluator finding is accepted as closure because it has an evidence ref, source digest, or requirement marker
  - `release_depth_parity_surface` can close while its admitted payload says blocked
  - data-mapper product bugs are patched from outside the F_P sandbox
  - a new sandbox is started to avoid a repairable same-sandbox depth gap
  - only full data_mapper, hello-world, or synthetic fixtures are used as proof while no data_mapper-lite lifecycle lane exists
  - data_mapper-lite uses invented requirements or an untraceable mini-brief instead of a declared subset of the canonical data_mapper requirements document
  - data_mapper-lite closes without generated tests being executed through admitted test-execution evidence
  - prompt text reintroduces exact semantic construction scripts or stack-specific product repair recipes
---

# T-188: Force F_P Depth Through Same-Sandbox Iteration And Prompt Control

## Intake

The 2026-05-31 data-mapper-scale run proved the modern TypeScript lane can
reach release and execute tests, but it did not prove test35-level depth. The
run also exposed a closure defect: admitted open or blocked depth facts could be
narrowed away.

This is not a request for F_D to judge product depth. `PRODUCT.md` is explicit:
generic constructive SDLC gates expect F_P; F_D may validate, admit, fold, and
route admitted truth, but cannot replace product-changing judgment.

The desired behavior is the test35 pattern in lawful TS form:

```text
F_P transform bounded tranche
-> evaluate.C/F_P emits concrete depth gaps
-> ABG admits the findings
-> consequence routes same-sandbox repair/retry
-> F_P transform next tranche
-> repeat until evaluator passes
```

## Latest-Run Evidence

Latest completed archive under review:

`build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260531T154243945Z_pid19975`

Observed failure patterns:

- `derive_test_execution_result_surface` had `fp_evaluate_result` status
  `admitted_with_open_obligations` with 49 fulfilled and 150 partial, but the
  operator summary closed the edge as 49/49.
- `derive_component_repair_schedule_surface` materialized a triage-gap schedule
  over an unowned component-test qualification failure, but closure narrowed to
  the target asset row.
- `derive_release_depth_parity_surface` wrote `releaseDepthParity.status:
  blocked` with `component_repair_schedule_missing`, but the edge and final
  release surface closed.

These are framework closure/routing defects. They are not generated
data_mapper product defects.

## Design Direction

- F_P owns product depth work and semantic findings.
- F_D/ABG owns admission, event truth, ledger fold, closure fold, replay, and
  routing from admitted truth.
- Broad prompts must make iteration normal: tranche, assess, repair, continue.
- Closure must honor admitted evaluator/depth facts even when the target carrier
  is structurally valid.
- Downstream carry is a typed obligation handoff, not a way to delete pressure.
- A dedicated data_mapper-lite lifecycle lane is part of this ticket delivery:
  it must be smaller than the full data_mapper run by selecting a few explicit
  requirements from the canonical data_mapper requirements document, but must
  still be deep enough to force design, implementation, generated tests, test
  execution evidence, and repair/release pressure through the normal
  installed-operator lifecycle.

## Initial Work Plan

1. Add the two failing deterministic closure fixtures from the latest run.
2. Patch closure folding so selected open evaluator results remain residual
   pressure unless lawfully owned downstream.
3. Patch blocked depth/parity carrier handling so admitted blocked truth blocks
   close without becoming F_D semantic evaluation.
4. Add a data_mapper-lite lifecycle fixture sourced from a small explicit
   subset of canonical data_mapper requirements, plus a runner that traverses
   through generated test execution evidence.
5. Tighten broad transform/evaluate prompts around tranche iteration, subagent
   permission, depth-gap findings, and same-sandbox repair.
6. Re-run focused proof, then run a same-sandbox data-mapper proof only after
   the deterministic failures cannot close.

## Implementation Progress

### 2026-06-01 Slice 1

Status: landed source + deterministic proof, live proof still pending.

Changes:

- Added `test_t188_fp_depth_iteration_closure.test.mjs` for:
  - unowned downstream carry cannot erase partial obligation pressure;
  - owned downstream carry remains lawful when graph-function and target-binding
    refs are explicit;
  - `fp_evaluate_result.status: admitted_with_open_obligations` becomes edge
    residual pressure and blocks close.
- Tightened `deriveSdlcEdgeFulfillmentCountsFromAssessments` so downstream
  carry requires explicit downstream graph-function refs and target-binding
  refs. Missing ownership remains edge-local pressure.
- Added `sdlcFpEvaluateOpenObligationPressureRefs` and folded the
  installed-operator-published `fp_evaluate_result.json` status/counts into
  closure residual pressure. This is structural admission/fold only: it reads
  typed F_P evaluate facts and does not inspect product source, tests, logs, or
  tenant-language semantics.
- Added a checked-in `data_mapper_lite_lifecycle` fixture sourced from
  canonical data_mapper requirement IDs `REQ-LDM-01`, `REQ-LDM-02`, and
  `REQ-LDM-03`.
- Added `run_t188_data_mapper_lite_lifecycle.mjs`, a dedicated lifecycle runner
  that points the existing data_mapper sandbox runner at the lite fixture and
  asserts traversal through generated test execution evidence.
- Added `test_t188_data_mapper_lite_fixture.test.mjs` to prove the lite fixture
  is traceable to canonical requirements and contains no prebuilt generated
  product files.

Proof run:

```bash
npm run test:t188
node --test test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs test_env/tests/test_t148_collision_safe_requirement_authority_refs.test.mjs test_env/tests/test_t152_data_mapper_transformation_set_partition.test.mjs test_env/tests/test_t171_execution_backed_closure_law.test.mjs test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
```

Result:

- `test:t188`: passed, 10/10 checks across build, guard, closure, and lite-fixture
  tests.
- Related closure/downstream tests: passed, 39/39.

Remaining:

- Run the T-188 data_mapper-lite lifecycle proof with a live worker:

```bash
npm run test:t188:data-mapper-lite-lifecycle-live
```

- If the lite lane exposes a product-worksite depth gap, preserve the sandbox
  and let F_P repair it; patch only framework/runtime/prompt/admission defects.

### 2026-06-01 Slice 2

Status: landed source + focused proof; live proof still pending.

Closure-gap fix:

- `component_depth_register.ts` now admits component-depth registers carried as
  Markdown-fenced JSON target carriers, matching the live
  `component_repair_schedule_surface.md` and `release_depth_parity_surface.md`
  shape.
- Added `componentDepthResidualPressureRefs`, an ABG/F_D structural fold over
  admitted component-depth status. It does not inspect product source or decide
  product semantics. It turns rejected component-depth admission,
  `componentRepairSchedule.scheduleStatus: triage_gap|repair_required`, repair
  rows, `releaseDepthParity.status: blocked`, and `releaseDepthParity.status:
  repriced` into closure residual pressure.
- `installed_operator.ts` folds those pressure refs into both selected F_P
  evaluation close disposition and edge residual pressure, so a structurally
  admitted blocked/triage carrier cannot close the edge.

Proof run:

```bash
npm run build:semantic
node --test test_env/tests/test_t113_component_depth_register_admission.test.mjs
node --test test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
npm run test:t188
git diff --check
```

Result:

- `build:semantic`: passed.
- Component-depth admission regression: passed, 7/7.
- T-188 closure regression: passed, 8/8.
- `test:t188`: passed, 12/12 after the new closure cases.
- `git diff --check`: clean.

### 2026-06-02 T-189 Runtime-Authority Carry-Forward

Status: landed source + focused proof against ABG 3.9.0-rc.6; T-189 is
completed with proof passed.

Final data_mapper-lite proof archive:

`build_tenants/typescript/test_env/test_runs/t188_data_mapper_lite_lifecycle_live/20260601T133648251Z_pid66015`

Final observed operator run:

`.ai-workspace/runtime/odd_sdlc/operator-runs/20260601T191101732Z_pid13926`

Bug ledger disposition:

- SDLC-owned fixed bugs remain in T-189: worker tool boundary, component-depth
  carrier shape, bootstrap runtime/control path exclusion, and downstream
  obligation role filtering.
- ABG-shaped bugs are linked to ABG T-147 and carried forward through RC6:
  fresh retry context projection, target-carrier output admission before
  closure/transition, and admitted output-authority projection for source
  assets.
- odd_sdlc now consumes `EnginePluginInput.retryContext` for worker retry
  context projection and `EnginePluginInput.outputAuthorityProjections` for
  source-asset authority refs. Local code remains SDLC domain mapping over
  ABG-admitted facts, not generic replay/payload law.

Proof run:

```bash
npm run build:semantic
node --test test_env/tests/test_t180_abg_3_9_current_staged_compute_boundary.test.mjs test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs
node --test test_env/tests/test_b070_claude_worker_argv.test.mjs test_env/tests/test_t087_project_induction.test.mjs test_env/tests/test_t113_component_depth_register_admission.test.mjs test_env/tests/test_t120_retry_local_repair_prompt.test.mjs test_env/tests/test_t188_data_mapper_lite_fixture.test.mjs test_env/tests/test_t188_fp_depth_iteration_closure.test.mjs
git diff --check
```

Result:

- `build:semantic`: passed.
- T-066/T-140/T-180 focused pack: passed, 102/102.
- T-189 listed regression pack: passed, 58/58.
- `git diff --check`: clean.
