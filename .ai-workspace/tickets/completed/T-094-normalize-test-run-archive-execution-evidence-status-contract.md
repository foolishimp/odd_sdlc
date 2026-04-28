# T-094 — Normalize Test Run Archive Execution Evidence Status Contract

status: completed
priority: high
change_class: design_reframe
re_entry_point: design
created: 2026-04-28
completed: 2026-04-28T15:16:56Z
owner: codex

## Claim

The TypeScript installed operator and worker prompt disagree on the lawful
execution-evidence status vocabulary for the test-run archive edge.

## Evidence

External run:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts`

One-shot command:

`ODD_SDLC_TS_OUTPUT=json node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex`

Observed stop:

- graph function: `bootstrap_release_self_test`
- current edge: `derive_test_run_archive_surface`
- closed vectors: `0..14`
- loop steps: `17`
- stop status: `worker_report_rejected`
- archive:
  `workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T092753479Z_pid94335`
- blocker:
  `SdlcWorkerResultReport.executionEvidence.status: expected one of "succeeded", "failed", "pending"`
- worker emitted:
  `executionEvidence.status = "not_run"`

## Diagnosis

The worker produced a semantically useful state: the test-run archive edge can
observe that tests were not run. The admission contract only accepts
`succeeded`, `failed`, or `pending`.

That creates a false contract failure at the archive edge instead of admitting
a governed pending/not-run test evidence carrier.

## Required Correction

Decide and enforce one closed vocabulary for execution evidence:

- either map worker `not_run` to admitted `pending`
- or extend the admitted closed enum to include `not_run`

The choice must be represented in design and tests before implementation is
closed.

## Design Constraints

- Do not make this a lenient string escape hatch.
- Preserve a closed typed carrier for execution evidence.
- Preserve the distinction between:
  - tests passed
  - tests failed
  - tests pending/not run
- Make the worker prompt, runtime admission, postflight, gap dossier, and tests
  agree on the same vocabulary.

## Required Tests

1. Unit test for admission of the chosen pending/not-run representation.
2. Worker prompt test proving the generated manifest/prompt tells the worker
   the exact admitted status vocabulary.
3. Sandbox or external replay proof showing `derive_test_run_archive_surface`
   does not stop on status vocabulary mismatch.

## Closure Bar

The ticket closes only after the status contract is unified and a fresh
external run can pass this edge or block on a real test/build finding rather
than schema disagreement.

## Closure Evidence

The closed vocabulary remains:

```text
succeeded | failed | pending
```

`not_run` is not admitted as a second terminal state. A non-executed or
unavailable test run is represented as `pending` and must remain open or
blocked until governed evidence exists.

Changed surfaces:

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`
- `build_tenants/typescript/code/src/operator/handoff.ts`
- `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`

Verification:

- `npm run test:t066`: passed, 8 tests.
- `npm run test:semantic`: passed, 137 tests.
- `npm run lint:semantic`: passed.

External live evidence:

- workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`
- first rejected archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T144014538Z_pid36703`
- retry archive after this fix:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T150145425Z_pid89422`

The retry no longer failed on schema admission for
`SdlcWorkerResultReport.executionEvidence.lane/status`. The prior
`worker_report_admission_failed` gap was assessed as fulfilled in the retry
report. The edge then blocked on real test evidence:

- `worker_report_unresolved_reasons_present`
- `test_execution_not_succeeded`
- `test_execution_zero_tests_observed`

That satisfies the closure bar: the test archive edge now blocks on real
test/build evidence rather than vocabulary mismatch.
