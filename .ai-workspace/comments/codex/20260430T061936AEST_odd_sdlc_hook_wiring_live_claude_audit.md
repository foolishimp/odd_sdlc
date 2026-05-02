---
kind: codex_post
type: live_hook_audit
date: 2026-04-30
workspace: odd_sdlc
scenario: data_mapper.test59.fp.cl
status: posted
---

# odd_sdlc Hook Wiring Live Claude Audit

## Question

Did the odd_sdlc TypeScript operator wire all ABG/GTL-facing hooks needed for
the current Claude F_P lane?

## Short Answer

The main hook surfaces are now wired in source and have deterministic test
coverage:

- accepted F_P reports emit ABG payload/evidence/result-assessment events and
  explicit `vector_evaluated` + `vector_closed`;
- postflight, worker-report-admission, assurance, and hook postflight failures
  emit a gap dossier and retry/runtime events;
- worker process failures now emit a blocked postflight, gap dossier, archived
  stdout/stderr refs, and retry-stop/runtime events instead of crashing or
  stopping archive-only;
- Claude prompt delivery now uses stdin rather than a giant argv payload.

This is not RC-ready yet. The live lane exposed a prompt-pressure gap at the
test-module retry: the replay/ledger pressure grew to a 2.7 MB prompt and the
Claude CLI returned `Prompt is too long`.

## Source Changes

Source paths changed in this pass:

- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - added explicit `vector_evaluated` / `vector_closed` on accepted F_P closure;
  - scoped retry context to the current vector;
  - added `worker_process_failure_postflight`;
  - emits gap dossier + runtime retry events for non-zero worker process exits.
- `build_tenants/typescript/code/src/cli/command.ts`
  - autonomous loop now continues retry-eligible `worker_failed` outcomes and
    only stops when retry repair stops.
- `build_tenants/typescript/code/src/operator/transport.ts`
  - Claude uses `claude -p` with prompt content on stdin;
  - stdout/stderr archiving tolerates undefined spawn output.
- `build_tenants/typescript/code/src/operator/handoff.ts`
  - generated asset refs such as
    `asset://requirement_surface@.ai-workspace/.../requirement_surface.md`
    count as output-coverage evidence.
- `build_tenants/typescript/code/src/start/public_start.ts`
  - execution basis identity stays canonical with `until: "converged"`;
    CLI `--until` remains an outer stop predicate.
- `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts`
  - substrate contract expectation is `3.4.0-rc.3`.

Regression coverage added/updated:

- `test_b070_claude_worker_argv.test.mjs`
- `test_t064_installed_operator_ux.test.mjs`
- `test_t091_traversal_obligation_payload.test.mjs`
- `test_t101_retry_report_rejection_loop.test.mjs`
- existing rc.3 expectation updates in T-028, T-066, and T-076 tests.

## Deterministic Verification

Ran from `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript`:

- `npm run test:semantic -- test_env/tests/test_b070_claude_worker_argv.test.mjs test_env/tests/test_t064_installed_operator_ux.test.mjs`
  - result: 145/145 passing
- `npm run lint:semantic`
  - result: pass

The semantic script currently runs the full `test_env/tests/*.test.mjs` set
before the named files, so the reported pass count is the full semantic suite.

## Live Claude Evidence

Scenario workspace:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test59.fp.cl`

Live command:

`env ODD_SDLC_TS_OUTPUT=json node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://claude`

Key archives:

| Archive | Edge | Result | Evidence |
|---|---:|---|---|
| `20260429T192759913Z_pid55223` | `derive_code_surface` | closed | 39 materialized files; `assurance_satisfaction.status: close_allowed`; runtime events include payload/evidence admissions, `assessed`, `vector_evaluated`, `vector_closed`. |
| `20260429T193545411Z_pid55223` | `derive_test_design_surface` | closed | retry context from prior code edge was correctly empty after vector-scoping fix. |
| `20260429T194953770Z_pid55223` | `derive_test_module_surface` | retry | first test-module attempt materialized 11 ScalaTest specs but assurance produced partial obligation rows and retried. |
| `20260429T200446387Z_pid55223` | `derive_test_module_surface` | retry | 966 obligations, 2 prior gap dossiers, worker exited 0, postflight passed, assurance forced `retry_same_edge`; runtime events ended with `retry_repair_planned` / `retry_attempt_opened`. |
| `20260429T201622696Z_pid55223` | `derive_test_module_surface` | operator crash before patch | 2,471 obligations, 2.7 MB prompt; old installed transport passed prompt as argv and crashed before worker archive. |
| `20260429T201824164Z_pid76292` | `derive_test_module_surface` | lawful worker failure after patch | Claude received stdin prompt but returned `Prompt is too long`; operator archived stdout/stderr, wrote blocked postflight + gap dossier, and emitted `retry_attempt_stopped`. |

Latest live stop:

- status: `worker_failed`
- current edge: `derive_test_module_surface`
- next lawful action: `inspect_worker_archive`
- worker stdout: `Prompt is too long`
- emitted runtime events:
  - `graph_call_opened`
  - `frame_opened`
  - `vector_traversal_planned`
  - `vector_evaluated`
  - `retry_attempt_stopped`

`odd-sdlc-ts gaps --workspace .` now projects:

- status: `partial`
- current edge: `derive_test_module_surface`
- closed vectors: `0..14`

## RC Impact

This is a successful hook-wiring pass, but not a successful RC traversal.

The remaining blocker is not "missing hook" now. It is prompt-pressure control:
the retry ledger can grow faster than the Claude worker can accept. The next
design change should compact retry input into a bounded worker packet:

- project a current-edge obligation register instead of replaying all expanded
  rows into the prompt;
- send prior gap dossiers as summarized deltas with file refs, not full nested
  payload expansion;
- page large obligation sets or route them through an artifact/register that the
  worker reads selectively;
- preserve ABG event/log truth as the source while making the F_P handoff a
  bounded view.

Until that lands, the TS lane can prove deepening and non-premature closure, but
large scenarios can lawfully block on prompt size before convergence.

## 2026-04-30 Follow-up: Retry Frontier Compaction

The prompt-pressure blocker above was addressed in source and reinstalled into
`data_mapper.test59.fp.cl`.

Additional source changes:

- `build_tenants/typescript/code/src/shared/blocking_reason.ts`
  - added shared canonicalization for SDLC prior-gap reason identity.
- `build_tenants/typescript/code/src/operator/handoff.ts`
  - no longer expands prior gaps into `prior_gap:*` obligations;
  - publishes a bounded `priorGapFrontier` with reason count, dossier refs, and
    sample reason codes.
- `build_tenants/typescript/code/src/assurance/obligation_carry.ts`
  - accepts the current projected reason frontier as carry evidence.
- `build_tenants/typescript/code/src/operator/assurance_gate.ts`
  - folds current assurance reason identity through the same canonicalization
    before deriving carried or closed prior gaps.
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - compacts multiple retry gap dossiers into one linked frontier dossier.

Regression coverage:

- `test_t077_t083_assurance_ledgers.test.mjs`
  - proves obligation carry accepts projected current reason frontier, including
    nested prior-gap wrapper forms.
- `test_t088_traversal_intent_package.test.mjs`
  - proves retry pressure stays linked and does not expand into prior-gap
    obligations or nested wrapper prompt text.
- `test_t076_deterministic_traversal_state_machine.test.mjs`
  - updated deterministic retry expectations.
- `test_t101_retry_report_rejection_loop.test.mjs`
  - continues to prove retry-eligible worker-report rejection loops.

Verification:

- `npm run test:semantic -- test_env/tests/test_t077_t083_assurance_ledgers.test.mjs test_env/tests/test_t088_traversal_intent_package.test.mjs test_env/tests/test_t076_deterministic_traversal_state_machine.test.mjs test_env/tests/test_t101_retry_report_rejection_loop.test.mjs`
  - result: 147/147 passing.
- `npm run lint:semantic`
  - result: pass.

Fresh live handoff artifact after reinstall:

`data_mapper.test59.fp.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260429T223352918Z_pid75371`

| Metric | Before compaction | After compaction |
|---|---:|---:|
| obligations | 2,471 | 106 |
| prior-gap obligations | 2,365 | 0 |
| retry frontier reasons | 2,365+ expanded rows | 215 canonical reasons |
| wrapped prior-gap reason leaks | present | 0 |
| handoff manifest | 24.2 MB | 597 KB |
| worker prompt | 2.7 MB | 64 KB |

The live command was started through the Claude lane and the corrected handoff
was archived. The spawned Claude worker did not return a report after several
minutes, so I stopped the stale parent process rather than leave it running.
That is a live-dispatch completion gap, not renewed prompt growth: the reviewed
artifact proves the handoff packet is bounded and wrapper-stable at the current
retry edge.
