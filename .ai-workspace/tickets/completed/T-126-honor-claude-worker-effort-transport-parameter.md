---
id: T-126
title: Honor Claude worker effort transport parameter
type: bug
ticket_category: worker_transport
status: completed
goal: typescript-worker-transport-contract
change_intent: Carry and lower the admitted Claude worker effort transport parameter while rejecting invalid effort values at admission.
change_class: realization_refactor
re_entry_point: realization
triaged_at: 2026-05-05T00:00:00+10:00
created_at: 2026-05-05T00:00:00+10:00
updated_at: 2026-05-07T00:00:00+10:00
completed_at: 2026-05-07T00:00:00+10:00
review_status: completed_codex_rc_format_and_evidence_review
owning_repo: odd_sdlc
affected_boundary:
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/transport.ts
  - build_tenants/typescript/test_env/tests/test_b070_claude_worker_argv.test.mjs
related_requirements:
  - REQ-F-ODDSDLC-052
  - REQ-F-ODDSDLC-053
---

# T-126 Honor Claude worker effort transport parameter

## Problem

The local Claude CLI exposes `--effort <low|medium|high|xhigh|max>`, but the `odd_sdlc` worker transport contract did not carry effort. That made "run Claude Sonnet with max effort" impossible to express through the one worker transport interface.

## Lawful re-entry

`realization_refactor`.

The worker callout design is unchanged. The fix widens the typed transport carrier to include an execution control already supported by the underlying Claude CLI.

## Implementation

- Add `effort` to `SdlcWorkerTransportContract`.
- Admit `effort=low|medium|high|xhigh|max` from the process URL query.
- Reject invalid effort values during transport admission.
- Lower Claude effort to `claude -p --effort <level> ...`.

## Closure evidence

- Regression added: `T-126 process://claude?model=...&effort=max lowers both Claude controls`.
- The regression proves `process://claude?model=claude-sonnet-4-7&effort=max` lowers to `--model claude-sonnet-4-7 --effort max`.

## Codex RC Completeness Review - 2026-05-07

Status: completed.

Observations:

- Focused proof refreshed on 2026-05-07: `node --test
  test_env/tests/test_b070_claude_worker_argv.test.mjs` passed with 11 tests,
  including the T-126 effort regression and the invalid-effort rejection
  regression.
- The code admits `effort=low|medium|high|xhigh|max` and lowers it to Claude
  argv, so the core implementation direction is correct.
- Live installed evidence exists in
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test70.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T123118988Z_pid15169/worker_run.json`:
  `command` is `claude` and `args` includes `--effort max`.
- Ticket frontmatter now carries the current `TICKET_METHOD` fields.

Closure checklist:

- [x] Complete the STDO ticket header fields.
- [x] Add a negative invalid-effort admission regression.
- [x] Add or cite an installed/sandbox operator proof that archived worker args
      include the configured `--effort`.
- [x] Re-run the focused argv test and record the result.
