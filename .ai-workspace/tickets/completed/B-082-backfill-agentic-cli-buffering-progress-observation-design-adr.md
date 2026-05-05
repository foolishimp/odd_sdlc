# B-082 Backfill Agentic CLI Buffering Progress Observation Design And ADR

- id: B-082
- type: bug
- ticket_category: ordinary
- status: consolidated
- goal: typescript-rc-data-mapper-qualification
- change_intent: backfill the design and ADR authority for agentic CLI worker progress observation after test66 proved text-mode stdout buffering can hide healthy worker progress from ABG process supervision
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-05-03
- created_at: 2026-05-03
- updated_at: 2026-05-04
- closed_at: 2026-05-04
- priority: high
- build_tenant: typescript
- owner: unassigned
- review_status: consolidated_into_t110_abg35_callout_substrate
- intake_source: `data_mapper.test66.TS.cl` live Claude lane, archives `20260503T040705129Z_pid69518` and `20260503T041632016Z_pid69518`
- affected_boundary: `process://claude` transport argv, ABG process actor stream observation, odd_sdlc worker inactivity policy, installed operator design, ADR runtime/progress boundary
- consolidated_into: `.ai-workspace/tickets/active/T-110-migrate-typescript-to-abg-3-5-traced-agent-callout-substrate.md`
- related:
  - `.ai-workspace/tickets/completed/B-070-realize-typescript-claude-process-worker-argv-headless-prompt-delivery.md`
  - `.ai-workspace/tickets/completed/B-071-consume-abg-streamed-process-actor-supervision-for-live-claude-lanes.md`
  - `.ai-workspace/tickets/completed/B-078-add-silent-worker-inactivity-policy-for-live-fp-processes.md`
  - `.ai-workspace/tickets/completed/B-080-self-heal-silent-live-workers-through-inactivity-recovery.md`
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md`
  - target ADR: `build_tenants/common/design/adrs/ADR-009-agentic-cli-worker-progress-observation-boundary.md`

## Consolidation Decision - 2026-05-04

B-082 is consolidated into T-110.

The original defect was process-progress blindness caused by text-mode agentic
CLI buffering. ABG 3.5.0-rc.1 replaces the local odd_sdlc progress-observation
surface with the traced agent actor/worker callout substrate: shared Claude
stream-json parsing, typed process outcomes, local-spawn and pty-terminal
executor profiles, trace archive truth, api-retry/tool-call observation, hard
timeout, inactivity timeout, executor-unavailable, and lost-terminal outcomes.

B-082 no longer owns a separate implementation or proof lane. T-110 owns the
remaining closure work: installed-operator live Claude `pty-terminal` proof,
negative/forced-failure proof for typed outcomes, archive projection evidence,
and any progress-observation ADR/design residue needed to document the ABG 3.5
boundary.

This consolidation does not close T-110.

## STDO Triage

### First Missing Layer

Design and ADR.

The implementation symptoms were observed in `process://claude`, but the defect
is not "Claude needs a longer timer" and not a semantic SDLC closure gap. The
missing authority is the process-progress design law for modern agentic CLI
workers whose stdout may be buffered until final response.

B-071 established ABG process actor supervision as the runtime authority for
child process lifecycle, stream observation, heartbeat, timeout, signal, and
exit events. B-078 and B-080 then built inactivity and recovery policy over
that evidence. The test66 run shows that this design is incomplete when it
treats stdout/stderr stream activity as the only live progress plane.

### Observed Defect

In `data_mapper.test66.TS.cl`, vector 10
`derive_implementation_module_surface` was run with the plan-first prompt and
ABG RC6 build `3.4.0-rc.6+build.20260503.1`.

The worker process was healthy:

- ABG wrote `actor_process_started`.
- ABG emitted heartbeats every 30 seconds.
- `lsof` showed active HTTPS connections for the Claude child.
- the worker eventually wrote
  `.ai-workspace/runtime/odd_sdlc/assets/20260503T040705129Z_pid69518/implementation_module_surface.md`
  with the required `## Execution Plan` section.
- the process exited `status: 0`, `timedOut: false`, `elapsedMs: 566868`.

But the process actor saw no stdout/stderr progress for almost the whole run:

- `worker_stdout.log` stayed `0` bytes until the final response chunk.
- `worker_stderr.log` stayed `0` bytes.
- `actor_process_stream_observed` appeared only near process exit.

That is compatible with CLI buffering in Claude's text output mode:

```text
claude -p ... --output-format text
```

The worker was doing useful work, but ABG could not see live work because the
transport exposed only a final buffered text response.

Vector 11 `derive_realization_schedule_surface` repeated the same pattern under
the already-spawned text-mode transport: no stdout/stderr and no artifact for
the early running window, followed by a produced schedule artifact.

## Target Truth

Agentic CLI process supervision must distinguish three progress planes:

1. process/protocol progress: stdout/stderr or structured protocol chunks from
   the worker process;
2. artifact progress: mtime/digest/byte changes on declared output refs such as
   `manifest.outputFile` or a declared progress/plan carrier;
3. closure progress: admitted report, postflight, ledgers, and edge closure.

Only the third plane can close a graph edge. The first two are liveness and
diagnostic evidence. They can prevent false silent-worker classification, but
they must not substitute for F_P semantic fulfillment or deterministic
postflight admission.

## Boundary Rule

ABG owns:

- child process lifecycle
- process stdout/stderr stream events
- process heartbeat, timeout, signal, and exit events
- generic process/protocol progress observation

odd_sdlc owns:

- the worker transport binding for agentic coder CLIs
- the manifest refs that name SDLC output, report, prompt, and archive files
- the domain interpretation of output/report artifacts after the worker exits
- the F_P/F_D boundary and semantic postflight interpretation

ABG must not decide SDLC semantic fulfillment from artifact progress. odd_sdlc
must not replace ABG process supervision with a private SDLC polling loop.

## Design Work Required

1. Update `ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md` with an explicit
   worker-progress section covering:
   - buffered CLI stdout as a known transport condition;
   - process/protocol progress versus artifact progress versus closure
     progress;
   - why heartbeats prove actor wrapper liveness, not worker semantic
     productivity;
   - why output/report refs in `worker_process_started_context.json` are
     progress-observation refs, not closure authority.
2. Add ADR-009 under `build_tenants/common/design/adrs/` declaring the
   agentic CLI worker progress observation boundary.
3. Reconcile B-071/B-078/B-080 closure wording in this ticket's evidence notes
   without reopening those closed tickets unless their acceptance criteria are
   contradicted. The defect is a backfill over a new empirical transport
   behavior, not proof that the ABG actor itself failed to start or supervise.

## Implementation Work Required

1. Change default `process://claude` argv from text final-output mode to
   structured streaming mode:

   ```text
   claude -p ... --output-format stream-json --include-partial-messages --verbose
   ```

2. Preserve prompt delivery on stdin and the existing workspace/permission
   binding from B-070.
3. Add deterministic transport tests proving the default Claude argv uses
   realtime stream JSON and partial message chunks.
4. Repack the TypeScript tenant into `data_mapper.test66.TS.cl` and rerun a
   live hop so the archive proves pre-exit process/protocol progress or, if the
   CLI still buffers, produces evidence that artifact-progress observation is
   the next required substrate capability.
5. When a timed-out worker preserved a declared output artifact or product
   materialization files, do not classify the result as
   `silent_worker_inactivity`. Either salvage the preserved artifact through
   normal postflight/ledger admission, or emit a typed
   artifact-progress-without-report blocker that points at the preserved
   output/product refs.
6. Do not claim closure by increasing `ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS`
   alone.

## Acceptance Criteria

- AC-1: the TypeScript installed-operator design has a dedicated progress
  observation section that names process/protocol progress, artifact progress,
  and closure progress as distinct planes.
- AC-2: ADR-009 is added and ratifies the agentic CLI worker progress
  observation boundary.
- AC-3: `process://claude` default argv uses `--output-format stream-json`,
  `--include-partial-messages`, and `--verbose`; deterministic tests assert all
  three flags.
- AC-4: B-070 prompt-on-stdin behavior remains unchanged.
- AC-5: `process://codex` and `process://node?script=...` transport semantics
  remain unchanged.
- AC-6: live test66 or successor evidence proves one of:
  - pre-exit `actor_process_stream_observed` events arrive from Claude
    stream-json mode; or
  - structured stream mode is still insufficient and the next ticket must add
    ABG generic artifact-progress observation over declared refs.
- AC-7: no acceptance claim treats heartbeat alone as productive worker
  progress.
- AC-8: no acceptance claim treats output-file existence or mtime as semantic
  edge closure without report/postflight/ledger admission.
- AC-9: a timeout with preserved declared output/product artifacts is not
  reported as `silent_worker_inactivity`; it is salvaged through postflight if
  admissible, otherwise reported as typed artifact-progress-without-report
  evidence.

## Non-Closure Conditions

- increasing the worker inactivity timeout without changing the progress
  observation design;
- keeping Claude in `--output-format text` and calling the resulting silence a
  normal long-running worker;
- treating heartbeats as proof of transform progress;
- treating artifact writes as edge closure without admitted F_P result and
  deterministic postflight;
- classifying a run with preserved output/product artifacts as
  `silent_worker_inactivity`;
- adding an odd_sdlc-local private polling loop that bypasses ABG actor truth;
- closing without design and ADR updates.

## Current Implementation Checkpoint

As of 2026-05-03, the design/ADR backfill and stream-json transport patch are in
place, but the ticket remains active because artifact-progress salvage is not
implemented:

- `build_tenants/common/design/adrs/ADR-009-agentic-cli-worker-progress-observation-boundary.md`
  has been added.
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md`
  now names process/protocol progress, artifact progress, and closure progress
  as separate planes.
- `build_tenants/typescript/code/src/operator/handoff.ts` now asks workers to
  start output artifacts with `## Execution Plan`.
- `build_tenants/typescript/code/src/operator/transport.ts` has been patched
  locally so default Claude argv uses `stream-json`, partial messages, and the
  required Claude `--verbose` flag.
- focused tests passing locally:
  - `npm run test:t099`
  - `node --test test_env/tests/test_b070_claude_worker_argv.test.mjs`
- live vector 10 under the prior text-mode package completed successfully but
  proved text stdout buffering: one stdout chunk arrived only at final response.
- live vector 12 under the prior text-mode package hit the defect directly:
  `derive_code_surface` wrote `code_surface.md` and 17 product files under
  `build_tenants/scala_spark`, but the process was killed at the 600s
  inactivity cap and reported as `silent_worker_inactivity` because stdout and
  stderr stayed at zero bytes.
- the first stream-json retry failed immediately with stderr
  `Error: When using --print, --output-format=stream-json requires --verbose`;
  the transport argv was corrected to include `--verbose`.
- live vector 12 under the corrected stream-json package produced pre-exit
  protocol evidence in archive `20260503T043749120Z_pid95586`:
  - `worker_process_summary.json` records `--output-format stream-json`,
    `--include-partial-messages`, and `--verbose`;
  - `worker_stdout.log` recorded 5431 bytes before completion;
  - `worker_process_events.jsonl` recorded `actor_process_stream_observed`
    events during the run;
  - the run failed after 188070ms with `worker_process_failed`, not
    `silent_worker_inactivity`, because Claude returned
    `API Error: Unable to connect to API (ConnectionRefused)`.
- AC-6 is therefore satisfied for the buffering backfill: stream-json mode gives
  ABG pre-exit process/protocol progress. The failed code edge remains a
  worker/API availability failure, not evidence that actor supervision is still
  blind.
- AC-9 remains open: the prior text-mode vector 12 archive proves preserved
  output/product artifacts can still be misclassified as
  `silent_worker_inactivity` unless artifact-progress salvage or a typed
  artifact-progress-without-report blocker is implemented.

The ticket remains active until AC-9 is implemented or split into a narrower
follow-up with explicit STDO authority.
