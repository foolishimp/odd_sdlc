---
id: T-067
title: Repair TypeScript installed-operator operation-type propagation for qualification edges
type: bug
ticket_category: rc_blocker
status: completed
goal: data-mapper-test46-installed-graph-convergence
change_intent: The live installed operator reaches `derive_test_run_archive_surface`, the worker succeeds, and worker postflight passes, but hook postflight blocks because the installed operator converts every worker output into `operationType: generate` even when hook policy requests `qualify`.
change_class: realization_refactor
re_entry_point: code
affected_boundary: installed operator handoff, constructor result construction, hook invocation/work-report consistency, live data_mapper qualification edge
priority: high
triaged_at: 2026-04-27T10:21:15Z
created_at: 2026-04-27T10:21:15Z
updated_at: 2026-04-27T10:39:00Z
dependencies:
  - T-041
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: live installed `data_mapper.test46.ts` archive `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T101529348Z_pid79099`.
target_truth: installed operator constructor results preserve the hook policy requested operation for qualification, release, deploy, return, and other non-generate edges.
superseded_truth: all installed F_P worker outputs can be represented as `operationType: generate`.
closure_law: this ticket closes when source tests prove non-generate operation propagation and the live data_mapper run advances past `derive_test_run_archive_surface` without `requested_operation_mismatch`.
evaluation_criteria:
  - `constructorResultFromWorkerOutput` or equivalent receives the policy-selected operation type
  - `derive_test_run_archive_surface` produces a work report where `requestedOperation === operationType === qualify`
  - existing mismatch negative tests still fail when a constructor result truly uses the wrong operation
  - blocked archives still remain inspectable
proof_surface:
  - source test for non-generate installed operator output
  - rerun of `npm run test:t064` or equivalent installed-operator test lane
  - live data_mapper archive proving advancement past vector 15
non_closure_conditions:
  - postflight mismatch is suppressed rather than corrected
  - qualification policy is weakened to `generate`
  - only the test fixture is changed without fixing the installed operator path
---

## Root Cause

`test_run_archive_surface` has `defaultOperation: "qualify"` in hook policy.
The installed operator builds a minimal hook invocation from that policy, but
the constructor result created from worker output hardcodes
`operationType: "generate"`. Hook postflight correctly rejects the mismatch.

## Live Evidence

Archive:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T101529348Z_pid79099`

Observed:

- worker status: `0`
- worker postflight: `passed`
- hook postflight: `blocked`
- blocking reason: `requested_operation_mismatch`
- requested operation: `qualify`
- operation type: `generate`

## Closure Evidence

Source fix:

- `build_tenants/typescript/code/src/operator/handoff.ts` now accepts the
  operation type used for constructor-result construction.
- `build_tenants/typescript/code/src/operator/installed_operator.ts` passes
  the hook policy operation from `defaultOperationForTarget(...)` into the
  constructor result.
- `build_tenants/typescript/test_env/tests/test_t064_installed_operator_ux.test.mjs`
  adds a T-067 proof for `derive_test_run_archive_surface`.

Verification:

- `npm run test:t064` passed: 2 tests.

Live proof:

- After reinstalling the patched package into `data_mapper.test46.ts` and
  restoring the event log from successful archives, the rerun archive
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T103003896Z_pid29542`
  passed `derive_test_run_archive_surface`.
- Its `hook_outcome.json` records
  `requestedOperation: "qualify"` and `operationType: "qualify"`.
  Postflight status is `passed`.
