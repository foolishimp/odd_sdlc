# B-071 Consume ABG Streamed Process Actor Supervision For Live Claude Lanes

- id: B-071
- type: bug
- ticket_category: ordinary
- status: completed
- goal: typescript-rc-fp-worker-coverage
- change_intent: consume the ABG supervised-process actor seam for `claude.actor -> running(claude.worker)` so odd_sdlc remains a GTL/program and plugin product rather than an execution framework
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-04-30
- created_at: 2026-04-30
- updated_at: 2026-04-30
- priority: high
- intake_source: `data_mapper.test59.fp.cl` live Claude lane, archive `20260429T223352918Z_pid75371`, operator observation that the spawned worker did not return a report and no stdout/stderr was available until process exit
- affected_boundary: `build_tenants/typescript/code/src/operator/transport.ts`, `build_tenants/typescript/code/src/operator/installed_operator.ts`, odd_sdlc F_P worker plugin adapter, ABG T-097 process actor seam
- build_tenant: typescript
- owner: unassigned
- review_status: closed_fixed_2026-05-01
- links:
  - ABG T-097 (`/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-097-design-abg-supervised-process-actor-execution-and-streamed-observation.md`)
  - ABG engine-first holistic solution (`/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260430T224308AEST_abg_engine_first_holistic_solution.md`)
  - B-070 (`.ai-workspace/tickets/completed/B-070-realize-typescript-claude-process-worker-argv-headless-prompt-delivery.md`)
  - T-101 (`.ai-workspace/tickets/completed/T-101-honor-retry-eligible-worker-report-rejection-in-autonomous-start-loop.md`)
  - comment: `.ai-workspace/comments/codex/20260430T061936AEST_odd_sdlc_hook_wiring_live_claude_audit.md`
  - scenario evidence: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test59.fp.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260429T223352918Z_pid75371`

## STDO Triage

### First Missing Layer

Design.

B-070 fixed the process-worker invocation shape for `process://claude`: the
worker prompt is delivered in headless mode and the transport no longer opens
Claude on the manifest path. T-101 fixed autonomous retry behavior after
worker-report rejection.

The remaining live-supervision defect is an ABG substrate execution gap with an
odd_sdlc consuming adapter. Process actor supervision must be ABG runtime truth.
odd_sdlc must only provide the SDLC plugin mapping.

Current odd_sdlc `invokeWorkerTransport` uses synchronous `spawnSync`. That
makes the worker process effectively opaque until it exits:

- stdout and stderr are buffered in memory and written only after return;
- no child process identity is archived while the child is alive;
- no heartbeat or running-state projection exists;
- a hung or very long-running child cannot be distinguished from a worker that
  is still making progress;
- timeout is owned by `spawnSync`, so no ABG runtime events can observe the
  process before termination.

### Ownership Boundary

The generic supervision work belongs under ABG T-097.

odd_sdlc owns the SDLC domain plugin: handoff manifest construction, prompt
content, SDLC hook/postflight interpretation, and result artifact mapping. ABG
owns actor invocation, child process lifecycle, stream observation, timeout
escalation, retry lineage, and runtime projections.

### Engine-First Relationship

B-071 is the downstream consumer ticket for the first ABG engine bug in the
holistic wave:

```mermaid
flowchart LR
  T097[ABG T-097 supervised actor] --> Events[process and stream events]
  Events --> Projection[process/liveness projection]
  Projection --> B071[odd_sdlc B-071 consumer adapter]
  B071 --> Archive[worker_process_started + events + logs]
  Archive --> Gap[SDLC postflight/gap dossier refs]
```

This ticket must not recreate process supervision in odd_sdlc. It adapts ABG
actor truth into SDLC archive and postflight surfaces.

### Constitutional Constraint

Do not close by saying "the worker eventually exits" or by relying on terminal
logs outside the archive. The actor must publish enough ABG archive/runtime
truth for an evaluator to answer: what child was spawned, what did it emit while
running, when did it last show liveness, and how did supervision end?

## Problem Statement

In `data_mapper.test59.fp.cl`, the bounded retry-frontier fix produced a valid
live handoff:

- edge: `derive_test_module_surface`
- obligations: 106
- retry frontier reasons: 215 canonical reasons
- wrapped prior-gap leaks: 0
- manifest size: 597 KB
- worker prompt size: 64 KB

The parent operator then spawned `claude.worker` and waited. After several
minutes there was no `worker_result_report.json`, no `worker_stdout.log`, and
no `worker_stderr.log`, because the synchronous transport writes stream files
only after process exit. The operator had no archive-backed way to tell whether
the worker was blocked on API/network, blocked on permission, thinking, writing
slowly, or deadlocked.

That is an observability and stabilization bug in the live worker transport, but
the reusable fix belongs in ABG.

## Target Design

Consume ABG supervised asynchronous process execution for process transports.

Minimum target shape:

1. ABG spawns with `node:child_process.spawn`, not `spawnSync`, for process
   actor transports.
2. ABG writes `worker_process_started.json` or an equivalent actor-process
   carrier immediately, including command, argv, cwd, child PID when available,
   timeout policy, started timestamp, manifest ref, prompt ref, report ref, and
   output ref.
3. ABG streams `child.stdout` to `worker_stdout.log` as chunks arrive.
4. ABG streams `child.stderr` to `worker_stderr.log` as chunks arrive.
5. ABG appends process observations to replay-admitted actor/process events.
6. ABG enforces a bounded timeout with a governed termination sequence:
   `SIGTERM`, grace period, then `SIGKILL`.
7. odd_sdlc preserves the existing `SdlcWorkerRunResult` archive contract as a
   read/adaptation surface, but populates it from ABG actor result truth.
8. When timeout or supervised failure occurs and no report carrier exists,
   odd_sdlc still writes SDLC postflight/gap surfaces from ABG evidence refs.

## Acceptance Criteria

- AC-1: `process://claude` worker stdout is visible in `worker_stdout.log`
  before the worker exits.
- AC-2: `process://claude` worker stderr is visible in `worker_stderr.log`
  before the worker exits.
- AC-3: every process-worker run writes an actor/process started carrier before
  worker completion, including child PID when the runtime exposes it.
- AC-4: a long-running worker writes heartbeat or supervision events while
  still running, without waiting for worker exit.
- AC-5: a timed-out worker produces a typed failure result and postflight/gap
  dossier with `worker_process_failed` or a more specific closed blocking
  reason, not a silent hung parent.
- AC-6: timeout termination is two-phase: `SIGTERM` first, then `SIGKILL` after
  a configured grace period if still alive.
- AC-7: existing `process://codex`, `process://claude`, and
  `process://node?script=...` argv semantics from B-070 remain unchanged.
- AC-8: deterministic tests cover streamed stdout before exit, streamed stderr
  before exit, timeout path with archived partial streams, final
  `SdlcWorkerRunResult` compatibility, and no regression to node-script
  transport.
- AC-9: a live Claude lane in `data_mapper.test59.fp.cl` or successor scenario
  proves that, while `claude.worker` is running, `claude.actor` archives
  running-state evidence before final worker return.

## Non-Closure Conditions

- Leaving `spawnSync` in the live process-worker path and adding only comments
  or polling around it.
- Writing stdout/stderr only after child process exit.
- Depending on the outer terminal transcript as evidence.
- Increasing timeout length as the primary fix.
- Treating a timeout as successful worker closure.
- Reintroducing local odd_sdlc process supervision that should be ABG runtime
  truth.
- Closing on deterministic tests only without at least one live Claude-lane
  archive demonstrating pre-exit supervision evidence.

## Implementation Plan

1. Wait for or co-develop ABG T-097 supervised process actor execution.
2. Keep `argsForWorker` and `stdinForWorker` semantics stable from B-070.
3. Bind odd_sdlc `process://claude`, `process://codex`, and
   `process://node?script=...` worker contracts to the ABG process actor seam.
4. Map ABG process outcomes back into the existing `SdlcWorkerRunResult` so
   SDLC postflight and retry plugin logic stays stable.
5. Remove or retire local odd_sdlc process-loop authority once the ABG seam is
   available.
6. Add deterministic node-script fixtures that emit stdout/stderr over time and
   intentionally exceed timeout.
7. Reinstall into a Claude-lane scenario and run one live hop to prove pre-exit
   stream/heartbeat files are visible while the worker is still running.

## Implementation Status

Deterministic implementation is in place.

- `build_tenants/typescript/code/src/operator/transport.ts` no longer owns
  `spawnSync` worker execution.
- `build_tenants/typescript/code/src/operator/installed_operator.ts` consumes
  ABG `invokeSupervisedProcessActor` from the F_P plugin path.
- The installed operator archives `worker_process_started.json`,
  `worker_process_events.jsonl`, streamed stdout, and streamed stderr.
- Worker-process failure and worker-report rejection postflights now include
  the ABG process started carrier and process event ledger refs, so gap
  dossiers can distinguish unavailable command, no-output timeout, signal path,
  stream activity, and report-admission failure.
- T-064 now asserts streamed process evidence in the installed operator archive.
- T-064/T-092 now assert that failure postflight and gap dossier evidence carry
  `worker_process_started.json` and `worker_process_events.jsonl`.

This ticket remains active because closure still requires external review and a
live Claude lane proving pre-exit stream/process evidence.

## Review Bar

Before moving to `active/`, an independent agent review must confirm:

- the ticket is correctly scoped as an odd_sdlc consumer of ABG T-097;
- the design does not duplicate ABG event calculus or process supervision;
- the acceptance criteria are sufficient to distinguish auth failure, network
  failure, prompt-too-long, no-output timeout, report-admission failure, and
  successful report return;
- the proposed implementation preserves B-070 transport argv semantics.

## Closure Evidence Required

Closure requires:

- deterministic semantic tests passing;
- `npm run lint:semantic` passing;
- full tranche verification on 2026-05-01:
  `npm run lint:semantic` passed, `npm run test:semantic` passed 160/160,
  and `git diff --check` passed;
- live Claude-lane archive with:
  - actor/process started carrier;
  - non-empty or explicitly empty-but-created `worker_stdout.log`;
  - non-empty or explicitly empty-but-created `worker_stderr.log`;
  - actor/process events showing running-state evidence before exit;
  - final worker run result or timeout result;
  - postflight/gap dossier when no worker report is produced.

## Out Of Scope

- changing Claude prompt content;
- changing retry-frontier compaction;
- changing GTL graph-function publication;
- making Claude worker output semantically correct;
- adding a Gemini lane.

## Live Checkpoint - 2026-05-01

`data_mapper.test63.TS.cl` is running a live Claude lane through the installed
operator path. The completed F_P hops so far each wrote ABG process
evidence before worker completion:

- `worker_process_started.json` with child PID, command, cwd, stdout/stderr
  refs, and timeout policy.
- `worker_process_events.jsonl` with heartbeats while the child was still
  running.
- `actor_process_stream_observed` before `actor_process_exited` once Claude
  emitted its final stdout chunk.
- `worker_stdout.log`/`worker_stderr.log` were created in each archive.

Evidence examples:

- `data_mapper.test63.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260501T035950263Z_pid95556`
- `data_mapper.test63.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260501T040418693Z_pid95556`
- `data_mapper.test63.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260501T040824608Z_pid95556`
- `data_mapper.test63.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260501T043835362Z_pid95556`

Latest observed hop:

- vector 7, `derive_scenario_surface`, emitted eight heartbeat events before
  its stdout chunk, then exited 0 at ~278s. The stream event was archived
  before `actor_process_exited`, and postflight/assurance passed.

The ticket remains active pending the final lane outcome and external review.

## Final Test63 Live Checkpoint - 2026-05-01

`data_mapper.test63.TS.cl` completed as a truthful blocked live lane at
`derive_test_module_surface`.

Final archive:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test63.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260501T060923716Z_pid95556`

Observed ABG-owned process evidence:

- `worker_process_started.json` was written before worker completion.
- `worker_process_events.jsonl` carries heartbeats, stream observations,
  timeout, signal, exit, and terminal events.
- `worker_stdout.log` and `worker_stderr.log` were created.
- the final gap dossier includes process evidence refs for worker run, stdout,
  stderr, process started, process events, and handoff manifest.
- the final worker failure is typed as `silent_worker_inactivity`, not an
  opaque terminal transcript.

This satisfies the live evidence shape for streamed/supervised process
observation. The ticket remains active only for external review and the broader
RC lane decision.

## Test64 Successor Evidence - 2026-05-01

`data_mapper.test64.TS.cl` reinforced the live process-supervision proof under
one parent `start --until converged` process, `pid63915`.

The lane produced process archives for twelve passed F_P hops before the
terminal blocked hop. The final archive at
`20260501T083037157Z_pid63915` records the supervised timeout path for
`derive_code_surface`:

- `worker_process_started.json` exists before terminal return.
- `worker_process_events.jsonl` carries heartbeats, timeout, signal, exit, and
  terminal events.
- `worker_stdout.log` and `worker_stderr.log` exist and have zero bytes, which
  is part of the typed silent-worker evidence.
- `worker_run.json` records `timedOut: true`, `status: 143`, and
  `elapsedMs: 600516`.
- `gap_dossier.json` and `worker_process_failure_postflight.json` cite the ABG
  process evidence refs.

This is additional live proof for the ABG process actor consumer seam. Closure
still waits on external STDO review.

## External Review Reconciliation - 2026-05-01

The external design-method review found the ABG `worker_process_started.json`
carrier too thin for B-071 closure because it did not carry the manifest,
prompt, report, output, inactivity/heartbeat policy, or full process summary
refs required by the target design.

Correction applied locally in odd_sdlc:

- each supervised process run now writes `worker_process_summary.json`;
- the summary carries `processStartedRef`, `processEventsRef`, `manifestRef`,
  `promptRef`, `reportRef`, `outputRef`, stdout/stderr refs, PID, hard timeout,
  inactivity timeout, heartbeat interval, latest heartbeat, signal sequence,
  and terminal process status;
- postflight and gap evidence refs now include `worker_process_summary.json`;
- focused tests prove the summary exists and carries the SDLC-specific refs.

This addresses the carrier-completeness finding without changing ABG's generic
started event shape. B-071 remains active until fresh external review accepts
the reconciled carrier set.

## Second External Review Reconciliation - 2026-05-01

The second design-method review found that `worker_process_summary.json` was
terminal-time evidence and did not satisfy the immediate process-start carrier
contract by itself.

Correction applied:

- odd_sdlc now writes `worker_process_started_context.json` from the ABG
  `actor_process_started` event while the worker is running;
- the started context carries manifest, prompt, report, output, stdout, stderr,
  PID, command, args, cwd, hard timeout, inactivity timeout, heartbeat policy,
  edge, vector index, actor invocation id, and ABG process refs;
- process postflight evidence refs include the started context as well as the
  terminal summary.

B-071 remains active pending fresh external review.

## Closure - 2026-05-01

Closed as fixed in the active-ticket cleanup pass. This closure supersedes older checkpoint wording in this file that said the ticket remained active for review, live-lane, or proof-envelope gates. The implementation and review notes above record the accepted fix/proof surface; broader release or live-lane envelope work remains with the still-active envelope tickets rather than keeping this fixed work item open.
