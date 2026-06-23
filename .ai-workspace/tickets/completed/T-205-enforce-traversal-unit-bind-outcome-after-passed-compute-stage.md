---
id: T-205
title: Enforce TraversalUnit bind outcome after passed compute stage
type: bug
ticket_category: ordinary
status: completed
goal: make passed worker/evaluator compute facts impossible to expose without exactly one TraversalUnit closure/bind outcome
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Capture and close the live-run defect where a worker, postflight, and F_P
  evaluator all passed, but no edge closure decision, next-action projection,
  terminal/yield/block outcome, or next TraversalUnit was emitted before the
  run stopped advancing.
change_class: design_reframe
re_entry_point: design
priority: critical
triaged_at: 2026-06-18
created_at: 2026-06-18
updated_at: 2026-06-19
completed_at: 2026-06-19
governance_scope: GTL/ABG traversal unit law, ODD_METHOD, odd_sdlc runtime boundary
source_documents:
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-159-formalize-traversal-unit-and-consequence-bind-boundary.md
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.2/release-snapshot-manifest.json
  - /Users/jim/src/apps/abiogenesis/docs/ABIOGENESIS_RC_RELEASE_NOTE.md
  - .ai-workspace/tickets/completed/T-203-factor-code-builder-graph-function-for-uat-test-generation-and-ticket-reentry.md
  - .ai-workspace/tickets/completed/T-204-decommission-odd-sdlc-cli-orchestration-surface.md
related_tickets:
  - .ai-workspace/tickets/completed/T-138-preserve-causal-chain-and-replayability-for-traversal-consequence.md
  - .ai-workspace/tickets/completed/T-140-retire-local-forced-iteration-tech-debt.md
  - .ai-workspace/tickets/completed/T-151-one-closed-computational-loop-and-runner-evaluator-sovereignty.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - .ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md
  - .ai-workspace/tickets/completed/T-203-factor-code-builder-graph-function-for-uat-test-generation-and-ticket-reentry.md
  - .ai-workspace/tickets/completed/T-204-decommission-odd-sdlc-cli-orchestration-surface.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-159-formalize-traversal-unit-and-consequence-bind-boundary.md
affected_boundary:
  - /Users/jim/src/apps/abiogenesis GTL compiler/validator traversalUnitProjection
  - /Users/jim/src/apps/abiogenesis ABG runtime/interpreter bind enforcement
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/test_env/sandbox/test_scenario_sandbox.test.mjs
  - build_tenants/typescript/test_env/tests/test_t194_gtl_program_conformance.test.mjs
  - build_tenants/typescript/test_env/tests/test_t197_product_gtl_gate.test.mjs
excluded_boundary:
  - prompt tuning
  - Rust hello service product implementation
  - treating worker_result_report, postflight, or fp_evaluate_result as traversal closure authority
  - adding another odd_sdlc local continuation controller
target_truth: >-
  `TraversalUnit<A, B>` is the closeable traversal atom. A successful compute
  stage is an internal fact, not a traversal result. Once a worker, postflight,
  and any required F_P evaluator output are admitted as passed for a traversable
  edge, ABG must fold them atomically into exactly one bind-boundary outcome:
  close with a legal next unit, yield, terminal, block, or retry/repair
  continuation. A run archive that exposes passed compute facts without a
  closure decision and corresponding bind projection is invalid.
superseded_truth: >-
  A worker/postflight/evaluator pass can stand as observable traversal progress
  while closure, next-action, terminal, yield, or block projection is missing;
  SDLC can repair this by scripting another local continuation loop; live
  scenario harnesses can tolerate a passed edge with no bind outcome as a
  merely incomplete archive.
closure_law: >-
  This odd_sdlc ticket closes when odd_sdlc consumes the ABG RC2
  traversal-unit bind boundary, rejects archives that expose passed compute
  facts without a closure/bind projection, converts pre-worker launch contract
  failures into archived blocked outcomes, and proves the changed odd_sdlc code
  paths with focused semantic, archive, product-gate, and scenario-harness
  tests. ABG compiler/runtime negative tests are upstream ABI release
  obligations and evidence sources, not implementation work owned by this
  ticket.
evaluation_criteria:
  - odd_sdlc consumes ABI RC2 traversal-unit projection and consequence bind law
  - odd_sdlc product gates reject archives that contain passed postflight/F_P evaluation for a traversable edge but lack `sdlc_edge_closure_decision.json` and the corresponding ABG traversal transition/bind projection
  - installed dispatch converts product-materialization launch blockers into archived blocked outcomes with no worker run
  - scoped review-grade admission fails closed when its invocation-scope carrier is absent
  - the odd_sdlc hello-world live scenario harness rejects retry-tainted archives when a zero-retry proof is requested
proof_surface:
  - ABIogenesis RC2 release evidence for traversal-unit and consequence bind enforcement
  - odd_sdlc product gate over archive shape and traversalUnitProjection consumption
  - replay/analyze-run diagnostic that classifies this archive as `missing_bind_outcome_after_passed_compute`
  - focused odd_sdlc tests exercising the RC2 migration, archive gate, launch-blocker, scoped review-grade, and scenario harness paths
live_evidence:
  archive: build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260618T015230354Z_pid21090
  operator_run: .ai-workspace/runtime/odd_sdlc/operator-runs/20260618T015355673Z_pid21090
  observed_edge: derive_lite_design_adr_surface
  observed_state:
    - worker_process_summary.status: 0
    - worker_process_summary.elapsedMs: 127199
    - postflight.status: passed
    - fp_evaluate_result.status: passed
    - missing: sdlc_edge_closure_decision.json
    - missing: sdlc_next_action_projection.json
    - missing: operator_summary.json
  interpretation: >-
    The proportionality selection was correct
    (`framework_smoke/single_hop/degenerate`, `steel_thread`). The defect is
    the absence of a traversal-unit closure/bind outcome after admitted passed
    compute facts.
non_closure_conditions:
  - passed worker/postflight/evaluator evidence can exist in a run archive without a typed traversal-unit outcome
  - odd_sdlc consumes an ABI release snapshot without traversal-unit bind-boundary evidence
  - odd_sdlc runtime handling leaves a pending process after admitted passed compute facts instead of failing closed
  - SDLC adds local replay/continuation scripting to paper over missing ABG bind enforcement
  - live proof relies on manually invoking the next edge after a passed edge with no bind carrier
---

# T-205: Enforce TraversalUnit Bind Outcome After Passed Compute Stage

## STDO Triage

First missing layer: GTL/ABG design and enforcement.

The live archive from the post-T-203 Rust hello-service retry shows a valid
reduced public-start selection and a passed first compute edge, but no
traversal-unit result. This is not a Rust fixture bug and not a prompt
proportionality bug.

Observed archive:

```text
build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260618T015230354Z_pid21090
  workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260618T015355673Z_pid21090
```

Observed facts:

```text
edge = derive_lite_design_adr_surface
worker_process_summary.status = 0
worker_process_summary.elapsedMs = 127199
postflight.status = passed
fp_evaluate_result.status = passed
missing sdlc_edge_closure_decision.json
missing sdlc_next_action_projection.json
missing operator_summary.json
```

The invalid construct is:

```text
passed compute facts
without exactly one TraversalUnit bind-boundary outcome
```

The legal shape is:

```text
TraversalUnit<A, B>
  -> close + next TraversalUnit<B, C>
  -> yield
  -> terminal
  -> block
  -> retry/repair continuation
```

## Design Direction

This belongs in GTL/ABG detection and enforcement.

GTL compiler/validator responsibilities:

- every traversable graph vector projects to a `TraversalUnit` row;
- every successful compute result has a total close/bind law;
- every non-terminal close has a legal next unit or continuation family;
- overlays cannot expose an entry whose successful edge has no legal bind
  projection;
- product-local hook success cannot be accepted as traversal progress unless it
  is wrapped by the ABG traversal-unit result carrier.

ABG runtime/interpreter responsibilities:

- fold admitted worker/postflight/evaluator facts atomically into exactly one
  traversal-unit outcome;
- fail closed with a typed invariant violation if passed compute facts cannot
  produce a bind result;
- never leave a run observably pending after passed compute facts.

odd_sdlc responsibilities:

- consume the ABG compiler/runtime guarantees;
- add product gates over archive/read-model surfaces so this invalid state is
  visible as `missing_bind_outcome_after_passed_compute`;
- avoid adding a local continuation controller as the fix.

## ABI RC2 Migration Lessons

The ABG T-159 frozen odd_sdlc fixture exposed product-side fixes that must move
to real odd_sdlc before the RC2 proof is meaningful:

- consume `@abiogenesis/typescript-tenant@4.1.0-rc.2` from the immutable release
  snapshot tarball, not a mutable local ABI source checkout;
- build review-grade prompt scope from the admitted worker invocation package
  projection and fail closed when scoped invocation scope is missing, rather
  than reparsing raw archive JSON inside the prompt constructor;
- preserve semantic/graph status coherence: downstream-stage pressure may be
  accepted only when the assessment status is passed, and the accepted outcome
  must carry residual pressure refs;
- key traversal-bind target-carrier joins by graph function, graph, and vector
  identity instead of array position;
- dedupe composition rows by `hostRef + compositionRef`, not composition ref
  alone;
- fail fast when design-depth or component-depth target carriers are required
  but cannot be admitted after a passed compute stage;
- keep materialized-product module-system mismatches as active postflight
  blockers;
- generalize materialization launch blocking across all required product roles,
  with tenant-stack repair as the explicit exception;
- keep pressure refs and obligation refs separate in carriers and prompts;
- prove the migration with a clean odd_sdlc hello-world live run, not only the
  ABI frozen fixture.

## T-132 Live Proof - 2026-06-19

Clean live run:

```text
build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260619T043423837Z_pid72626
```

Result:

```text
npm run test:t132:hello-world-live
tests 1
pass 1
fail 0
duration_ms 1858437.7805
```

The installed operator converged at:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260619T050521295Z_pid72626/run.json
status = converged
currentEdge = null
nextLawfulAction = disposition://close
admittedSemantic.edgeConverged = true
```

Stage summary:

```text
conform_project                       0.00  converged
derive_lite_design_adr_surface       5.44  close
derive_lite_component_code_surface   6.59  review passed, close
derive_lite_test_design_surface      3.03  review passed, close
derive_lite_component_test_surface   9.28  review blocked only by downstream_deferred execution pressure; accepted and closed
derive_lite_uat_test_source_surface  4.04  review passed, close
prepare_test_execution_surface       0.00  close
derive_test_execution_result_surface 0.01  close, terminal convergence
```

Additional RC2 migration fix proven by this run:

- `uat_test_source_surface` is a testing materialization edge. Its authority
  must admit `testingTechStack.testTargets`, filter current product targets to
  test/build-config roles, and fail before worker launch when required
  materialized roles have no declared product target.
- T-132 and T-174 fixture tenant stacks now declare execution-environment,
  source-file, and test-target authority explicitly so live proof does not
  depend on inferred product targets.
- Product materialization launch blocking is generalized across required roles,
  with tenant-stack repair as the explicit exception.

Review correction:

- This archive proves RC2 traversal convergence, but it is not sufficient by
  itself for T-205 closure. The standard `postflight.json` surface remained a
  preliminary blocked design-depth F_P state while `fp_evaluator_postflight.json`,
  `fp_evaluate_result.json`, and `sdlc_edge_closure_decision.json` closed the
  edge as passed. That created rival archive truth surfaces.
- The runtime now writes preliminary design-depth postflight truth to
  `pre_fp_evaluator_postflight.json` and reserves standard `postflight.json` for
  the final effective postflight state.
- The T-205 product gate now classifies passed worker/postflight/F_P evaluation
  facts without the traversal consequence triple as
  `missing_bind_outcome_after_passed_compute`.
- Review-grade scope authority now flows from one admitted invocation-scope
  carrier into both prompt projection and admission. Missing scoped invocation
  package data blocks before evaluator launch.

Focused regression proof after review correction:

```text
npm run build:semantic
passed

git diff --check
passed

node --test --test-name-pattern "T-205 passed compute archive without bind outcome fails closed" test_env/tests/test_t058_spec_method_entrypoint.test.mjs
tests 1
pass 1
fail 0

node --test test_env/tests/test_t064_installed_operator_ux.test.mjs test_env/tests/test_t181_fp_evaluator_design_register.test.mjs test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs test_env/tests/test_t151_runner_evaluator_sovereignty.test.mjs
tests 71
pass 71
fail 0
```

Converged live proof after review correction and prompt contradiction fix.
This is not a zero-retry clean proof because the first design worker attempt
hit an external provider `500 Internal server error` and closed as retry:

```text
npm run test:scenario:t132-hello-world-js-live
tests 1
pass 1
fail 0
duration_ms 1703537.844208
archive: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260619T084905254Z_pid16123
```

The first design worker in this run hit an external provider `500 Internal
server error`. The runner classified that attempt as retry, not pass. The retry
then completed and all later stages closed. This proves lawful retry
classification for provider transport failure and successful convergence after
retry; it does not prove a zero-retry hello-world run.

Final stage timing and archive consistency:

| Stage | Worker min.sec | Eval/review min.sec | Prompt words | Status | Closure | Prompt consistency |
|---|---:|---:|---:|---|---|---|
| conform_project |  |  |  | converged |  | not a worker prompt |
| derive_lite_design_adr_surface | 0.39 |  | 1565 | worker provider error | retry | external provider failure; not a clean-run pass |
| derive_lite_design_adr_surface | 1.37 | 4.16 | 1703 | passed | close | consistent; final postflight/F_P agree |
| derive_lite_component_code_surface | 1.41 | 5.08 | 2191 | passed | close | fixed: whole-file JSON carrier, no Markdown directive |
| derive_lite_test_design_surface | 1.17 | 2.25 | 1356 | passed | close | consistent; review-grade overwork remains |
| derive_lite_component_test_surface | 1.57 | 2.58 | 1907 | passed | close | consistent; whole-file JSON carrier |
| derive_lite_uat_test_source_surface | 1.54 | 2.17 | 1503 | passed | close | consistent; whole-file JSON carrier |
| prepare_test_execution_surface |  |  | 855 | passed | close | deterministic framework edge |
| derive_test_execution_result_surface |  |  | 879 | converged | close | deterministic framework edge |

Additional correction from the fresh run:

- `component_code_surface` prompts no longer combine the generic Markdown output
  directive with the component-depth target-carrier law. The live prompt for
  `20260619T085707272Z_pid16123` has `Markdown output artifact = false` and
  `Emit a whole-file JSON component_depth_register = true`.
- Component-depth admission remains strict. JSON inside Markdown fences is still
  rejected for target-carrier surfaces; the product prompt now emits the lawful
  whole-file carrier instead of weakening admission.
- The T-132 live descriptor now sets `forbidRetryClosureDecisions: true`, and
  the scenario harness fails the proof if any operator run emits
  `sdlc_edge_closure_decision.disposition = retry`. This prevents a
  convergence-after-retry archive from being reported as a clean proof.
- Regression proof:

```text
node --test --test-name-pattern "component-code transform prompt|T-205 component-depth carrier prompt" test_env/tests/test_t118_worker_invocation_package.test.mjs
tests 2
pass 2
fail 0

node --test --test-name-pattern "hello-world live descriptors|zero-retry expectation" test_env/sandbox/test_scenario_sandbox.test.mjs
tests 2
pass 2
fail 0
```

## Review Correction - Launch And Scope Fail-Fast

The follow-up review found two valid remaining fail-fast gaps:

- Product-materialization launch blockers still escaped the live installed
  dispatch path as uncaught exceptions because `writeHandoffFiles(manifest)`
  could throw before worker/report/postflight failure wrappers ran. The operator
  now catches that pre-worker contract violation, writes
  `worker_launch_postflight.json`, final `postflight.json`, `gap_dossier.json`,
  `sdlc_edge_closure_decision.json`, and `sdlc_next_action_projection.json`, and
  returns a blocked dispatch outcome with `workerRun = null`.
- Scoped review-grade admission still had an exported fail-open path when
  callers omitted `invocationScope`. Scoped manifests now treat both omitted and
  explicit-null invocation scope as `review_grade_invocation_scope_missing`.

The behavioral regression exposed one more authority bug while proving the
launch path: `worker_launch_postflight.json` was missing from the authoritative
operator-run artifact catalog. The catalog now admits that artifact as
`sdlc_operator_postflight_result`.

Focused proof:

```text
npm run build:semantic
passed

node --test --test-name-pattern "T-205 installed dispatch archives product-materialization launch blockers|T-143 empty component-code source target authority fails before F_P launch" test_env/tests/test_t143_product_materialization_authority_targets.test.mjs
tests 2
pass 2
fail 0

node --test --test-name-pattern "T-203 scoped review-grade admission uses invocation package inline obligations" test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs
tests 1
pass 1
fail 0

node --test --test-name-pattern "hello-world live descriptors|zero-retry expectation" test_env/sandbox/test_scenario_sandbox.test.mjs
tests 2
pass 2
fail 0

node --test --test-name-pattern "operator artifact catalog includes design-depth evaluator archive surfaces|operator-run artifact catalog" test_env/tests/test_t181_fp_evaluator_design_register.test.mjs test_env/tests/test_t175_source_truth_migration.test.mjs
tests 2
pass 2
fail 0
```

## Initial Work Items

- [x] Consume ABI RC2 release evidence for traversal-unit bind enforcement
      instead of owning ABI compiler/runtime negative tests in odd_sdlc.
- [x] Add an odd_sdlc archive diagnostic/product gate that classifies the
      captured live archive as `missing_bind_outcome_after_passed_compute`.
- [x] Migrate odd_sdlc to the ABI RC2 tarball snapshot and remove the temporary
      local ABI source dependency.
- [x] Port the ABI frozen-fixture prompt scope, bind carrier, materialization,
      and fail-fast postflight fixes into real odd_sdlc.
- [x] Convert product-materialization launch blockers on the installed dispatch
      path into archived blocked outcomes instead of uncaught exceptions.
- [x] Fail closed when scoped review-grade admission is called without an
      invocation-scope carrier.
- [x] Trace the live runner path between `fp_evaluate_result.status = passed`
      and closure/bind emission for `derive_lite_design_adr_surface`.
- [x] Exercise the changed odd_sdlc code paths with focused tests. The
      20260619T084905254Z_pid16123 archive converged after one external
      provider-transport retry; that archive is not a zero-retry proof, but a
      full zero-retry live rerun is not required for this ticket closure.
