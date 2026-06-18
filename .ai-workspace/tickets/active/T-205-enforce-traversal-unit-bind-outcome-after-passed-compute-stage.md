---
id: T-205
title: Enforce TraversalUnit bind outcome after passed compute stage
type: bug
ticket_category: ordinary
status: active
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
updated_at: 2026-06-18
governance_scope: GTL/ABG traversal unit law, ODD_METHOD, odd_sdlc runtime boundary
source_documents:
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-159-formalize-traversal-unit-and-consequence-bind-boundary.md
  - .ai-workspace/tickets/completed/T-203-factor-code-builder-graph-function-for-uat-test-generation-and-ticket-reentry.md
  - .ai-workspace/tickets/active/T-204-decommission-odd-sdlc-cli-orchestration-surface.md
related_tickets:
  - .ai-workspace/tickets/completed/T-138-preserve-causal-chain-and-replayability-for-traversal-consequence.md
  - .ai-workspace/tickets/completed/T-140-retire-local-forced-iteration-tech-debt.md
  - .ai-workspace/tickets/completed/T-151-one-closed-computational-loop-and-runner-evaluator-sovereignty.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - .ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md
  - .ai-workspace/tickets/completed/T-203-factor-code-builder-graph-function-for-uat-test-generation-and-ticket-reentry.md
  - .ai-workspace/tickets/active/T-204-decommission-odd-sdlc-cli-orchestration-surface.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-159-formalize-traversal-unit-and-consequence-bind-boundary.md
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
  This ticket closes when the GTL/ABG compiler rejects graph/overlay programs
  whose traversable edges lack a total closure/bind law, ABG runtime fails
  closed when a passed compute stage cannot emit exactly one traversal-unit
  outcome, and odd_sdlc gates prove no product-local path can expose passed
  compute facts as final traversal state without the ABG bind carrier.
evaluation_criteria:
  - GTL validation projects each graph vector to a `TraversalUnit` row with a close law and bind outcome family
  - validator rejects any traversable vector whose successful compute result has no legal close/yield/terminal/block/retry continuation
  - overlay validation rejects entry overlays whose successful edge result has no legal next unit or terminal/yield projection
  - ABG runtime emits exactly one bind-boundary outcome for each admitted passed compute stage
  - runtime fails closed with a typed invariant violation when passed worker/postflight/evaluator evidence exists but no closure/bind carrier can be produced
  - odd_sdlc product gates reject archives that contain passed postflight/F_P evaluation for a traversable edge but lack `sdlc_edge_closure_decision.json` and the corresponding ABG traversal transition/bind projection
  - the Rust hello live scenario reaches the component-code handoff or fails with a typed traversal-unit invariant, never a silent pending run after a passed design edge
proof_surface:
  - ABIogenesis compiler negative tests for missing successful-result bind law
  - ABG runtime/interpreter negative test for passed compute facts without one traversal-unit result
  - odd_sdlc product gate over archive shape and traversalUnitProjection consumption
  - replay/analyze-run diagnostic that classifies this archive as `missing_bind_outcome_after_passed_compute`
  - rerun of Rust hello live scenario after enforcement
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
  - the compiler accepts a traversable graph vector with no total successful-result closure/bind law
  - runtime hangs, idles, or leaves a pending process after admitted passed compute facts instead of failing closed
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

## Initial Work Items

- [ ] Add an ABIogenesis compiler negative test for a graph vector with
      successful compute output but no bind outcome family.
- [ ] Add an ABG runtime negative test for passed worker/postflight/evaluator
      facts without exactly one traversal-unit result.
- [ ] Add an odd_sdlc archive diagnostic/product gate that classifies the
      captured live archive as `missing_bind_outcome_after_passed_compute`.
- [ ] Trace the live runner path between `fp_evaluate_result.status = passed`
      and closure/bind emission for `derive_lite_design_adr_surface`.
- [ ] Rerun the Rust hello live scenario after enforcement and require either
      component-code handoff or typed traversal-unit invariant failure.
