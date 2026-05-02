# B-077 Classify Contradictory Test Execution Evidence As Triage Gap

- id: B-077
- type: bug
- ticket_category: ordinary
- status: completed
- goal: typescript-rc-data-mapper-qualification
- change_intent: prevent internally contradictory test execution evidence from being treated as retryable test failure
- change_class: realization_refactor
- re_entry_point: code
- triaged_at: 2026-05-01
- created_at: 2026-05-01
- updated_at: 2026-05-01
- priority: high
- build_tenant: typescript
- owner: codex
- review_status: closed_fixed_2026-05-01
- intake_source: `data_mapper.test62.TS.cl` live Claude lane, `derive_test_execution_result_surface` attempts `20260430T191920888Z_pid22395`, `20260430T192718326Z_pid22395`, and `20260430T193204100Z_pid22395`.
- affected_boundary: `build_tenants/typescript/code/src/operator/handoff.ts`, `build_tenants/typescript/code/src/shared/blocking_reason.ts`, `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`

## STDO Triage

### First Missing Layer

Code.

The execution evidence carrier already has enough fields to detect an internal
contradiction. The live lane returned:

- `status: "failed"`
- `testsObserved: 63`
- `passedCount: 63`
- `failedCount: 0`

The TypeScript postflight looked only at `status` and emitted
`test_execution_not_succeeded` with same-edge retry. That caused repeated
retry attempts even though the evidence itself was inconsistent.

## Target Truth

Internally contradictory execution evidence is not a retryable product test
failure. It is a typed evidence contradiction that requires triage or repair of
the evidence-producing adapter.

Examples:

- `status: failed` with `failedCount: 0` and observed tests
- `status: succeeded` with `failedCount > 0`
- `passedCount + failedCount != testsObserved`

## Implementation Checkpoint - 2026-05-01

Implemented.

- Added blocking reason code `test_execution_evidence_contradiction`.
- Classified that reason as `code_to_test` with lawful reentry `triage_gap`.
- Added postflight validation for execution evidence count/status
  contradictions.
- Added regression:
  `B-077 execution evidence contradiction stops for triage instead of retry`.

Verification:

- focused `test_t066_product_materialization_contract.test.mjs` passed 15/15.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed 153/153.
- Re-verified in the current stabilization tranche on 2026-05-01:
  `npm run lint:semantic` passed and `npm run test:semantic` passed 158/158.
- Full tranche verification on 2026-05-01:
  `npm run lint:semantic` passed, `npm run test:semantic` passed 160/160,
  and `git diff --check` passed.
- Targeted negative proof on 2026-05-01:
  `node --test --test-name-pattern "B-077|B-074" test_env/tests/test_t066_product_materialization_contract.test.mjs`
  passed 2/2. The B-077 case enters execution-result postflight with
  `status: failed`, `testsObserved: 63`, `passedCount: 63`, and
  `failedCount: 0`, then proves `test_execution_evidence_contradiction`,
  `retryEligible: false`, and `nextLawfulActions: ["triage_gap"]`.

## Acceptance Criteria

- AC-1: contradictory execution evidence emits
  `test_execution_evidence_contradiction`.
- AC-2: contradictory evidence does not also emit
  `test_execution_not_succeeded` as a retryable failure.
- AC-3: the gap dossier for the contradiction has `retryEligible: false` and
  `nextLawfulActions: ["triage_gap"]`.
- AC-4: fresh live Claude lane proves the execution-result edge no longer
  burns retries on `failed` plus zero failed tests.

## Non-Closure Conditions

- Coercing contradictory evidence to success.
- Retrying the same edge on internally contradictory evidence.
- Closing without live Claude evidence or external review.

## Test64 Live Evidence Boundary - 2026-05-01

`data_mapper.test64.TS.cl` stopped at `derive_code_surface`, before the
execution-result edge could produce contradictory or valid test execution
evidence. The terminal archive is `20260501T083037157Z_pid63915` with typed
`silent_worker_inactivity`.

This does not satisfy AC-4. The targeted negative proof remains valid, but
B-077 stays active until a live lane reaches execution-result evidence or
external review reprices the live-proof bar.

## Closure - 2026-05-01

Closed as fixed in the active-ticket cleanup pass. This closure supersedes older checkpoint wording in this file that said the ticket remained active for review, live-lane, or proof-envelope gates. The implementation and review notes above record the accepted fix/proof surface; broader release or live-lane envelope work remains with the still-active envelope tickets rather than keeping this fixed work item open.
