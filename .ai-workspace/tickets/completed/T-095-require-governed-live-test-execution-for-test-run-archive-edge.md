# T-095 — Require Governed Live Test Execution For Test Run Archive Edge

status: completed
priority: high
change_class: requirement_reprice
re_entry_point: requirements
created: 2026-04-28
completed: 2026-04-28T15:16:56Z
owner: codex

## Claim

`derive_test_run_archive_surface` must execute or ingest governed test evidence.
It must not close by producing a document that says tests were not run when the
conformed project declares a test execution contract.

## Evidence

External run:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts`

Observed archive:

`workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T092753479Z_pid94335`

The conformed project declares:

- `testExecutionContract: sbt test`

The worker report for `derive_test_run_archive_surface` emitted:

- `executionEvidence.command: sbt test`
- `executionEvidence.status: not_run`
- `testsObserved: []`
- `passedCount: 0`
- `failedCount: 0`

The worker summary says the archive was produced "without executing tests."

## Diagnosis

The current edge name and product intent imply a governed test run archive, but
the worker prompt/contract allows a non-executed archive to be returned. Even
if T-094 fixes the status enum mismatch, admitting `not_run` as terminal proof
would undercut the live-test requirement.

## First Missing Layer

Requirements.

The live-test execution obligation must be explicit enough that design and
implementation cannot satisfy the edge with a placeholder archive.

## Required Correction

Define the test-run archive contract:

- when `conformedProject.testExecutionContract` exists, the edge must either:
  - run the command under the tenant root and capture governed evidence, or
  - emit a typed blocking reason explaining why live execution could not be run
- `not_run` or `pending` may be admitted only as a blocking/pending state, not
  as closure evidence
- the test archive must cite durable report refs, observed test counts, and
  pass/fail counts when execution occurs
- the next graph state must reflect whether test execution passed, failed, or
  is lawfully blocked

## Design Constraints

- Do not hard-code `sbt`.
- Use the conformed project test execution contract.
- Preserve tenant-root working-directory discipline.
- Preserve the external workspace as the proof surface.
- Do not hide execution as a worker side effect without report evidence.

## Required Tests

1. Unit test: test-run archive prompt requires execution when a test contract is
   declared.
2. Unit test: non-executed evidence becomes pending/blocking, not closure.
3. Sandbox test: successful fake test command admits passed execution evidence.
4. External run: fresh `data_mapper.testNN.ts` reaches test archive and either
   runs `sbt test` or blocks with a typed operational reason.

## Closure Bar

The ticket closes only when a fresh external run cannot pass the test archive
edge with `testsObserved: []` unless the edge is explicitly blocked/pending.

## Closure Evidence

Requirements and design now state that `derive_test_run_archive_surface` is a
governed test execution evidence edge. A non-executed or zero-test archive may
be admitted only as pending/blocking evidence, not closure proof.

Changed authority surfaces:

- `specification/requirements/14-odd-sdlc-installed-product-contract.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`

Changed realization surfaces:

- `build_tenants/typescript/code/src/operator/handoff.ts`
- `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`

Verification:

- `npm run test:t066`: passed, 8 tests.
- `npm run test:semantic`: passed, 137 tests.
- `npm run lint:semantic`: passed.

External live evidence:

- workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`
- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T150145425Z_pid89422`
- postflight status: `blocked`
- blocking reasons:
  - `worker_report_unresolved_reasons_present`
  - `test_execution_not_succeeded`
  - `test_execution_zero_tests_observed`
- next lawful action: `retry_same_edge_with_gap_dossier`

Second retry evidence:

- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T150742721Z_pid89422`
- postflight status: `blocked`
- remaining blocking reasons:
  - `worker_report_unresolved_reasons_present`
  - `test_execution_zero_tests_observed`

The edge did not close with `testsObserved: []`. It remained open under typed
gap/retry truth, which is the requirement-level correction this ticket owns.
