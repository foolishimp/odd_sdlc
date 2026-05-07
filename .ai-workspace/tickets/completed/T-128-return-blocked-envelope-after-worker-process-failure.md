---
id: T-128
title: Return blocked envelope after worker process failure
type: bug
ticket_category: worker_failure_envelope
status: completed
goal: typescript-installed-worker-failure-return-envelope
change_intent: Return a bounded blocked/worker_failed CLI envelope after worker process failure postflight completes instead of leaving the parent command alive.
change_class: realization_refactor
re_entry_point: realization
triaged_at: 2026-05-05T00:00:00+10:00
created_at: 2026-05-05T00:00:00+10:00
updated_at: 2026-05-07T00:00:00+10:00
completed_at: 2026-05-07T00:00:00+10:00
review_status: completed_codex_rc_format_and_evidence_review
owning_repo: odd_sdlc
affected_boundary:
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/test_env/tests/test_t064_installed_operator_ux.test.mjs
evidence_refs:
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test70.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T110956236Z_pid42442
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test70.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T123118988Z_pid15169
consumed_substrate:
  - abiogenesis 3.6.0-rc.1 local source runtime
related_tickets:
  - T-125
  - T-126
  - T-127
  - abiogenesis:T-114
---

# T-128 Return blocked envelope after worker process failure

## Problem

During the test70 Claude run, the worker subprocess exited after a fully observed API retry storm:

- command: `claude -p --model claude-sonnet-4-7 --effort max ...`
- executor profile: `local-spawn`
- edge: `derive_intent_surface`
- outcome: `exited`, status `1`
- `apiRetryCount`: `10`
- final Claude result: `API Error: Unable to connect to API (FailedToOpenSocket)`
- gap dossier: written
- retry eligibility: `false`

After this complete blocked evidence was written, the parent `odd-sdlc-ts start` process remained alive with no Claude child process. It had to be terminated manually.

That is a framework reliability bug. Once a worker failure has produced a postflight gap dossier, the public start command must return a blocked JSON envelope instead of hanging.

## Root cause

The failed edge was running under a traversal attempt envelope with `mustExitAfterBoundedAttempt: true`. The worker failure postflight was complete, but ABG's blocked attached F_P result path could still enter retry continuation logic instead of terminalizing the bounded attempt. That left the downstream public command without a returned terminal envelope even though the worker archive and gap dossier existed.

The one-stop fix is owned in ABG T-114: honor `mustExitAfterBoundedAttempt` for blocked attached F_P results in both sync and async runner paths, then reinstall the downstream sandbox.

## Lawful re-entry

`realization_refactor`.

The graph semantics are unchanged. The defect is in command/operator completion after a completed worker-process-failure postflight.

## Required behavior

- Worker process failure must write `worker_run.json`, `worker_process_summary.json`, `worker_process_failure_postflight.json`, and `gap_dossier.json`.
- The CLI must then return an `odd_sdlc_cli_result` envelope with status `ok` and payload status `worker_failed` or `blocked`.
- The CLI must not keep the parent Node process alive after the worker child exits and the gap dossier is complete.

## Closure evidence

- ABG T-114 added the bounded blocked attached-artifact regression in `test_t107_traversal_modulation_unit.test.mjs`.
- `npm run build:semantic` passed in `build_tenants/abiogenesis/typescript`.
- `npm run build:semantic` passed in `build_tenants/typescript`.
- The test70 sandbox was reinstalled after the ABG fix.
- Live run `20260505T123118988Z_pid15169` reproduced the same Claude retry-storm failure class (`apiRetryCount: 10`, status `1`) and the public `odd-sdlc-ts start` command returned a `worker_failed` JSON envelope instead of hanging.

## Codex RC Completeness Review - 2026-05-07

Status: completed.

Observations:

- The implementation path now writes worker failure postflight and returns
  `status: "worker_failed"` from `installed_operator.ts` after worker process
  failure. Existing tests in `test_t064_installed_operator_ux.test.mjs`,
  `test_t110_abg35_callout_projection.test.mjs`, and
  `test_t066_product_materialization_contract.test.mjs` assert worker-failure
  envelopes.
- Focused proof added and refreshed on 2026-05-07: `node --test
  test_env/tests/test_t064_installed_operator_ux.test.mjs` passed with 9 tests,
  including `T-128 installed start returns worker_failed envelope after process
  failure`.
- Ticket frontmatter now carries the current `TICKET_METHOD` fields.
- The consumed local ABG substrate is `3.6.0-rc.1`, verified from
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/package.json`.
- Live evidence remains the test70 operator run
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test70.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T123118988Z_pid15169`:
  `worker_run.json` shows `status: 1`, `command: claude`,
  `apiRetryCount: 10`, and `gap_dossier.json` shows `status: open`,
  `retryEligible: false`, `nextLawfulActions: ["triage_gap"]`.

Closure checklist:

- [x] Complete the STDO ticket header fields.
- [x] Add a focused T-128 deterministic or installed test for the no-hang
      worker-failure envelope.
- [x] Record the ABG version/release cut that supplies the bounded blocked
      attached-result fix.
- [x] Confirm deterministic installed command returns the `worker_failed`
      envelope and cite the live worker archive/gap dossier evidence.
