---
id: T-125
title: Honor Claude worker model transport parameter
type: bug
ticket_category: worker_transport
status: completed
goal: typescript-worker-transport-contract
change_intent: Ensure admitted Claude model transport parameter affects argv lowering instead of silently falling back to the local CLI default.
change_class: realization_refactor
re_entry_point: realization
triaged_at: 2026-05-05T00:00:00+10:00
created_at: 2026-05-05T00:00:00+10:00
updated_at: 2026-05-07T00:00:00+10:00
completed_at: 2026-05-07T00:00:00+10:00
review_status: completed_codex_rc_format_and_evidence_review
owning_repo: odd_sdlc
affected_boundary:
  - build_tenants/typescript/code/src/operator/transport.ts
  - build_tenants/typescript/test_env/tests/test_b070_claude_worker_argv.test.mjs
related_requirements:
  - REQ-F-ODDSDLC-052
  - REQ-F-ODDSDLC-053
---

# T-125 Honor Claude worker model transport parameter

## Problem

`admitWorkerTransport("process://claude?model=...")` parsed and carried the model field, but `argsForWorker` ignored that model for Claude. Codex received `--model`, while Claude silently used the local CLI default.

That violates the transport contract because a typed admitted field must either affect execution or be rejected. Silent loss is not lawful.

## Lawful re-entry

`realization_refactor`.

The transport requirement is unchanged: the installed operator admits a worker transport contract and lowers it into a process callout. The defect is local lowering for Claude.

## Implementation

- Add a Claude-specific argv lowering wrapper that preserves ABG's stream-json print arguments.
- When the transport model is present, inject `--model <model>` into the Claude argv.
- Keep `process://claude` without a model on the local Claude CLI default.
- Preserve explicit `?script=` override behavior.

## Closure evidence

- Regression added: `T-125 process://claude?model=... lowers to claude --model`.
- The regression proves parser selection remains `claude-stream-json`.
- The regression proves final prompt placement remains the last positional argument.

## Codex RC Completeness Review - 2026-05-07

Status: completed.

Observations:

- Focused proof refreshed on 2026-05-07: `node --test
  test_env/tests/test_b070_claude_worker_argv.test.mjs` passed with 11 tests,
  including the T-125 Claude model regression.
- The code path is localized and plausible: `admitWorkerTransport()` carries
  `model`, and `argsForWorker()` lowers Claude transports through `claudeArgs()`
  with `--model`.
- Live installed evidence exists in
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test70.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260505T123118988Z_pid15169/worker_run.json`:
  `command` is `claude` and `args` includes `--model claude-sonnet-4-7`.
- Ticket frontmatter now carries the current `TICKET_METHOD` fields.
- Traceability is carried by the named T-125 regression and requirements
  `REQ-F-ODDSDLC-052` / `REQ-F-ODDSDLC-053`.

Closure checklist:

- [x] Complete the STDO ticket header fields.
- [x] Add or cite an installed/sandbox operator proof that the archived worker
      process args include the configured `--model`.
- [x] Add direct implementation traceability for T-125 or requirement-to-ticket
      mapping.
- [x] Re-run the focused argv test and record the result.
