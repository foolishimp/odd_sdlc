---
id: T-127
title: Admit bare worker agent aliases
type: bug
ticket_category: worker_transport
status: completed
goal: typescript-worker-transport-contract
change_intent: Normalize known bare worker aliases at the transport admission boundary and return typed transport failures for malformed bare strings.
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

# T-127 Admit bare worker agent aliases

## Problem

`--worker claude` failed as raw `Invalid URL`, even though `claude` is the natural operator spelling and the framework already knows how to lower Claude process transports.

That is an admission-boundary bug. The CLI should either accept the alias or return a typed transport-admission rejection.

## Lawful re-entry

`realization_refactor`.

The public transport remains the process worker transport contract. The fix adds alias normalization at the contract boundary.

## Implementation

- Normalize `claude`, `codex`, `gemini`, and `node` to `process://<agent>`.
- Preserve query strings, so `claude?model=claude-sonnet-4-7&effort=max` is lawful.
- Replace raw URL parser failure with typed `SdlcWorkerTransportContract.url` failure for non-admissible strings.

## Closure evidence

- Regression added: `T-127 bare Claude worker alias admits as process transport`.
- The regression proves `claude?model=claude-sonnet-4-7&effort=max` carries model and effort through argv lowering.

## Codex RC Completeness Review - 2026-05-07

Status: completed.

Observations:

- Focused proof refreshed on 2026-05-07: `node --test
  test_env/tests/test_b070_claude_worker_argv.test.mjs` passed with 11 tests,
  including the T-127 bare Claude alias regression, non-Claude alias regression,
  and malformed bare alias rejection regression.
- The implementation normalizes `claude`, `codex`, `gemini`, and `node` bare
  aliases to `process://...` at the same transport admission boundary used by
  public start execution.
- Ticket frontmatter now carries the current `TICKET_METHOD` fields.
- No backwards-compatibility surface was added; this is one transport admission
  surface with typed normalization.

Closure checklist:

- [x] Complete the STDO ticket header fields.
- [x] Add alias regressions for `codex`, `gemini`, and `node`, or narrow the
      ticket claim to Claude only.
- [x] Add a negative malformed-alias test proving typed transport rejection.
- [x] Confirm the implementation is the public worker transport admission
      function consumed by installed start.
