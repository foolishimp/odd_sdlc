---
id: T-110
title: Migrate odd_sdlc TypeScript to ABG 3.5.0-rc.1 traced agent callout substrate
type: migration
ticket_category: implementation_migration
status: completed
goal: typescript-rc-runtime-architecture
change_intent: Rebase odd_sdlc TypeScript onto ABG 3.5.0-rc.1 and replace local worker shell/process semantics with the ABG traced agent actor/worker callout substrate.
change_class: design_reframe
re_entry_point: design
affected_boundary: build_tenants/typescript package dependency, installed operator transport, worker process archive projection, live Claude lanes, ABG substrate contract documentation
priority: critical
triaged_at: 2026-05-03
created_at: 2026-05-03
updated_at: 2026-05-04
closed_at: 2026-05-04
build_tenant: typescript
owner: unassigned
review_status: closed_with_live_claude_pty_and_forced_failure_proof
library_usage: consume
governing_library: ABG 3.5.0-rc.1 traced process and agent actor/worker callout substrate
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
dependencies:
  - ABG release cut v3.5.0-rc.1
  - ABG T-108 traced process substrate
  - ABG T-109 universal agent actor/worker callout interface
  - ABG T-111 literal PTY terminal executor
  - odd_sdlc T-105 ABG-owned whole-graph iteration migration
  - odd_sdlc T-102 typed F_P stage/admission boundary
consolidated_tickets:
  - B-082 backfill agentic CLI buffering progress observation design and ADR
intake_source: ABG 3.5.0-rc.1 cut introduced typed traced callout outcomes, shared Claude stream-json parsing, local-spawn and pty-terminal executor profiles, and a single runAgentActorWorkerCallout interface for framework-owned agent.actor and agent.worker shell-outs.
target_truth: odd_sdlc TypeScript consumes ABG 3.5.0-rc.1 for all framework-owned agent worker process invocation, supervision, parser observation, timeout classification, and trace archive truth; odd_sdlc retains SDLC domain mapping, postflight, gap dossier, and operator-facing projection only.
superseded_truth: odd_sdlc TypeScript owns Claude argv shape, stream-json parsing assumptions, process timeout/inactivity semantics, and worker process archive truth independently from ABG.
closure_law: This ticket closes only when odd_sdlc TypeScript depends on ABG 3.5.0-rc.1, routes worker process execution through the ABG traced agent callout API, maps ABG typed outcomes into odd_sdlc blocking carriers, preserves existing odd_sdlc archive/read-model consumers as projections over ABG trace truth, and proves the path with deterministic plus live Claude PTY evidence.
evaluation_criteria:
  - ABG dependency and substrate contract surfaces name 3.5.0-rc.1 as the governing substrate.
  - process://claude no longer carries odd_sdlc-owned Claude argv or stream-json parser law.
  - local worker process supervision consumes ABG TracedProcessOutcome and trace refs.
  - pty-terminal executor selection is explicit adapter ingress, not hidden semantic runtime law.
  - existing odd_sdlc archive files remain read-model projections and do not compete with ABG trace archive authority.
  - live data-mapper evidence proves at least the Claude PTY path after migration.
proof_surface:
  - package and lockfile dependency update
  - substrate contract design update
  - progress-observation ADR/design update carried from B-082
  - installed operator transport refactor
  - worker process summary/outcome projection tests
  - agent callout negative/forced-failure tests
  - live data-mapper Claude PTY lane
non_closure_conditions:
  - Leaving process://claude argv construction as odd_sdlc-owned runtime law.
  - Keeping --include-partial-messages as a local odd_sdlc parser assumption.
  - Mapping all ABG process outcomes back into generic worker_process_failed.
  - Claiming migration by bumping package-lock only.
  - Treating ABG trace archives and odd_sdlc worker archives as two independent truth surfaces.
  - Hiding executor profile selection in ambient env after request admission.
  - Closing without a live Claude lane using pty-terminal.
---

# T-110: Migrate odd_sdlc TypeScript to ABG 3.5.0-rc.1 Traced Agent Callout Substrate

## Dependency Checkpoint - 2026-05-04

T-102 is closed for the scoped typed `F_P.transform` / `F_P.evaluate` carrier
split. That satisfies the transform/evaluate carrier dependency for this
ticket, but it does not close T-110.

B-082 is consolidated into this ticket. Its text-mode buffering and progress
observation concern is no longer a separate active implementation lane; T-110
owns the ABG 3.5 one-stop substrate proof and any remaining ADR/design residue
for the progress-observation boundary.

T-110 remained active until the installed operator proved the ABG 3.5 callout
substrate through:

- a live `process://claude` lane using `pty-terminal`;
- deterministic negative/forced-failure evidence for typed ABG outcomes;
- archive evidence showing odd_sdlc worker summaries are projections over ABG
  trace truth rather than independent process truth;
- confirmation that any env-selected executor profile is admitted into the ABG
  callout request as a typed executor profile before invocation.

## Proof Checkpoint - 2026-05-04

Deterministic forced-failure proof passed:

```text
npm run test:t110:abg35-sandbox
```

Evidence:

- `test_env/tests/test_t110_abg35_callout_projection.test.mjs`
- missing worker command projects typed ABG `process_error` through
  `worker_process_error`, not generic `worker_process_failed`
- timed worker projects typed ABG `hard_timeout` through
  `worker_hard_timeout`, not `silent_worker_inactivity` or generic
  `worker_process_failed`

The negative proof found and fixed one classifier-order defect:
`hard_timeout` now outranks legacy silent-inactivity collapse in
`build_tenants/typescript/code/src/operator/installed_operator.ts`.

Live Claude PTY proof passed outside the Codex filesystem sandbox:

```text
ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:abg35-live
```

Accepted archive:

- `build_tenants/typescript/test_env/test_runs/t110_live_claude_pty_installed_operator/20260503T150743250Z_pid75696`

Observed live proof summary:

- installed operator invoked `process://claude`
- executor profile: `pty-terminal`
- stream model: `terminal-transcript`
- typed outcome: `{ kind: "exited", status: 0 }`
- elapsed: `93308ms`
- structured Claude event count: `19`
- structured parse failure count: `1`
- api retry count: `0`
- tool call count: `6`
- trace result:
  `file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t110_live_claude_pty_installed_operator/20260503T150743250Z_pid75696/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260503T150744375Z_pid75696/worker_process_events.jsonl.trace/result.json`
- terminal transcript:
  `file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t110_live_claude_pty_installed_operator/20260503T150743250Z_pid75696/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260503T150744375Z_pid75696/worker_process_events.jsonl.trace/terminal.transcript`

The same live test run inside the Codex filesystem sandbox failed before
Claude/API work with `worker_executor_unavailable`: ABG reported
`pty-terminal executor unavailable: screen started but /bin/sh did not write
the capability probe marker`. This is retained as environment evidence, not as
product failure. The accepted live proof is the escalated run above.

ADR/design residue from B-082 is consolidated here and updated in:

- `build_tenants/common/design/adrs/ADR-009-agentic-cli-worker-progress-observation-boundary.md`

## Closure Decision - 2026-05-04

Closed.

`odd_sdlc.TS` now consumes ABG 3.5.0-rc.1 for framework-owned agent worker
callouts, Claude stream-json argv/parser law, PTY terminal execution, trace
archive truth, typed process outcomes, and progress observation. odd_sdlc
retains the SDLC domain mapping, handoff manifests, archive/read-model
projection, blocking-reason projection, postflight, and gap dossier semantics.

This closure does not close the first-traversal induction packet
(`T-087/T-091/T-096`), the traversal-ledger solution (`T-109`), or the final RC
envelope (`T-041`).

## STDO Triage

### First Missing Layer

Design.

This is not a product reprice. `odd_sdlc` remains the SDLC governance/runtime
package over ABG. The missing layer is a realization-boundary update: ABG now
publishes the process/callout substrate that `odd_sdlc` previously had to
approximate locally.

The smallest lawful re-entry point is `design_reframe` because the realization
structure for worker invocation changes while the product direction remains
stable.

### Correct Boundary

ABG owns:

- framework-owned agent actor/worker process invocation
- local process and PTY executor profiles
- Claude stream-json parsing
- retry/tool-call/structured-event observation
- process timeout and inactivity timeout fact truth
- typed process outcomes
- trace archive contract

`odd_sdlc` owns:

- SDLC graph/function publication
- SDLC worker handoff manifest content
- domain postflight and assurance interpretation
- gap dossier and blocking-reason projection
- installed operator UX
- local proof lanes over SDLC lifecycle behavior

The migration must not turn ABG process facts into a second odd_sdlc runtime.
It must project ABG facts into existing odd_sdlc surfaces where those surfaces
remain useful for users and tests.

## Current State

The TypeScript tenant currently consumes ABG by local file dependency:

- `build_tenants/typescript/package.json`
- `build_tenants/typescript/package-lock.json`

The lockfile still records the sibling ABG package as an older RC line.

The current design contract still names an obsolete substrate version:

- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`

The current worker transport layer still owns agent-specific process details:

- `build_tenants/typescript/code/src/operator/transport.ts`
  - derives `agentKey`
  - constructs local `claude` argv
  - passes prompt through stdin for Claude
  - includes `--include-partial-messages`
  - chooses local argv semantics for `process://claude`

The installed operator consumes ABG process actor supervision but still projects
worker process summary from older local process assumptions:

- `build_tenants/typescript/code/src/operator/installed_operator.ts`

Active migration tickets still describe the ABG substrate as ABG 3.5/ABG 3.5:

- `.ai-workspace/tickets/active/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md`
- `.ai-workspace/tickets/active/T-109-publish-authoritative-edge-ledger-lineage-chain-for-typescript-traversal-parity.md`

## ABG 3.5.0-rc.1 Surfaces To Consume

ABG 3.5.0-rc.1 publishes these relevant substrate surfaces:

| ABG surface | odd_sdlc use |
| --- | --- |
| `runAgentActorWorkerCallout` | single framework-owned callout interface for agent actors/workers |
| `TracedProcessOutcome` | canonical process result classifier |
| `TracedProcessExecutorProfile` | explicit `local-spawn` or `pty-terminal` executor selection |
| `TracedProcessStreamModel` | distinguishes `stdio` from `terminal-transcript` |
| `TracedProcessPaths` | authoritative trace archive refs |
| `claude-stream-json` parser | shared parser for Claude stream-json observations |
| `apiRetryEvents` / `toolCallEvents` | transport observation evidence |
| `structuredParseFailureCount` | parser health evidence |
| `executor_unavailable` | missing or unusable executor environment |
| `lost_terminal` | PTY/session disappeared before lawful completion |
| `hard_timeout` | total callout timeout |
| `inactivity_timeout` | no-output active-turn timeout |

## Required Features

### F1: Dependency And Source-Truth Rebase

Update the TypeScript dependency and documentation surfaces to ABG
`3.5.0-rc.1`.

Required updates:

- `build_tenants/typescript/package-lock.json`
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
- active ticket references that still state ABG 3.5/ABG 3.5 as current substrate truth
- installed guidance if it names older ABG versions or old process semantics

`package.json` may remain a sibling file dependency if the release workflow
continues to consume the local ABG source root, but the resolved package
identity must report `3.5.0-rc.1`.

### F2: One Agent Callout Interface

Replace local framework-owned process execution semantics with ABG's traced
agent callout interface.

The intended call shape is:

```text
SdlcWorkerTransportContract
  -> SdlcWorkerHandoffManifest + prompt
  -> ABG AgentActorWorkerCalloutRequest
  -> ABG runAgentActorWorkerCallout(...)
  -> ABG TracedProcessResult
  -> odd_sdlc worker process read-model projection
```

The local transport layer may still admit the operator's `process://...`
worker binding and derive SDLC worker identity. It must not own Claude process
semantics that ABG owns.

### F3: Claude Transport Law Moves To ABG

`process://claude` must no longer encode a local odd_sdlc-owned Claude transport
contract.

Retire as odd_sdlc law:

- local `claudeArgs(...)`
- local `stdinForWorker(...)` Claude branch
- `--include-partial-messages`
- local assumptions about how stream-json text is extracted

ABG's Claude callout path must own stream-json args, parser extraction,
api-retry observation, tool-call observation, and final output extraction.

### F4: Explicit Executor Profile Ingress

Add an explicit adapter ingress for executor profile selection.

Accepted profiles:

- `local-spawn`
- `pty-terminal`

The installed operator and live harness may read env such as
`ABG_TS_AGENT_EXECUTOR_PROFILE` or an odd_sdlc-specific equivalent, but that
read must be adapter ingress only. After request admission, the executor
profile must be a typed request field passed to ABG.

Recommended operator shape:

```text
odd-sdlc-ts start ... --worker process://claude --executor-profile pty-terminal
```

If the CLI flag is deferred, the live harness must still pass an explicit
typed executor profile into the installed operator call path before ABG
invocation.

### F5: Typed Outcome Mapping

Map ABG `TracedProcessOutcome` into odd_sdlc blocking carriers without
collapsing distinct causes.

Required mapping baseline:

| ABG outcome | odd_sdlc projection |
| --- | --- |
| `exited`, status `0` | continue to postflight/admission |
| `exited`, nonzero | contract/runtime failure; preserve stderr/stdout and artifact refs |
| `signaled` | transport/runtime failure with signal evidence |
| `hard_timeout` | timeout blocker; retry according to existing retry policy |
| `inactivity_timeout` | silent-worker/inactivity blocker |
| `executor_unavailable` | infrastructure blocker, not semantic worker failure |
| `launch_failed` | transport failure |
| `process_error` | transport failure with process error detail |
| `lost_terminal` | PTY/session failure, not semantic failure |

The projection may retain legacy codes such as `worker_process_failed` for
operator compatibility only if the typed ABG outcome is also preserved in
evidence and blocking detail.

### F6: Archive Projection Over ABG Trace Truth

Preserve user-facing odd_sdlc archive files as projections where downstream
tests and operator UX depend on them.

Existing read-model files may remain:

- `worker_process_started_context.json`
- `worker_process_summary.json`
- `worker_process_events.jsonl`
- `worker_stdout.log`
- `worker_stderr.log`
- `worker_result_report.json`
- `worker_process_failure_postflight.json`

But their source must be ABG traced result/trace refs, not an independent
process truth surface.

Required projected fields:

- `executorProfile`
- `terminalSessionId`
- `streamModel`
- `outcome`
- `traceRoot`
- `tracePaths`
- `structuredEventCount`
- `structuredParseFailureCount`
- `apiRetryCount`
- `toolCallCount`
- `finalOutputRef`
- `terminalTranscriptRef` when present

### F7: Negative And Forced-Failure Robustness

Add deterministic tests that prove the new boundary fails with typed evidence.

Minimum cases:

- missing command or launch failure maps to typed transport failure
- short hard timeout maps to `hard_timeout`
- inactivity timeout maps to `inactivity_timeout`
- unavailable PTY executor maps to `executor_unavailable` when screen is absent
  or shell execution is unavailable
- generic nonzero worker with stderr remains contract/runtime failure, not
  silent transport failure
- malformed Claude stream-json increments structured parse failure evidence
  without deleting raw stdout/stderr evidence

### F8: Live Claude PTY Proof

Run at least one live data-mapper lane through the migrated path with:

```text
worker: process://claude
executorProfile: pty-terminal
```

The live proof must show:

- ABG traced callout path used
- `executorProfile: "pty-terminal"`
- `streamModel: "terminal-transcript"` or the expected ABG result value for the
  selected backend
- typed `outcome.kind`
- trace archive refs present
- odd_sdlc archive projection present
- no exact natural-language response matching in the evaluator unless the
  prompt explicitly requires exact output

## Required Refactoring Points

### R1: Transport Adapter Split

Refactor `operator/transport.ts` into two responsibilities:

- admit `process://...` as odd_sdlc operator binding
- lower admitted binding plus prompt/manifest into ABG callout request

Do not keep per-agent process execution semantics in this module after the
lowering boundary.

### R2: Installed Operator ABG Result Consumption

Refactor `operator/installed_operator.ts` to consume ABG `TracedProcessResult`
or `SupervisedProcessActorResult.outcome` as canonical.

The installed operator should derive worker summaries from:

- ABG traced process result
- ABG event callbacks
- SDLC handoff manifest
- observed files/postflight facts

It should not infer process truth from local nullable status/signal/error
triples when `outcome.kind` is available.

### R3: Failure-Class Compatibility Layer

Create a small explicit compatibility function:

```text
ABG TracedProcessOutcome + trace observations
  -> SdlcBlockingReason / legacy blocking code / retry eligibility
```

This keeps old user-facing summaries stable while making the typed ABG outcome
the authority.

### R4: Test Repricing

Reprice tests that assert old local transport behavior.

Known target:

- `build_tenants/typescript/test_env/tests/test_b070_claude_worker_argv.test.mjs`

The test should assert one of:

- `process://claude` lowers to ABG `agent_worker` callout with
  `claude-stream-json` parser; or
- the installed operator records ABG trace result fields for a deterministic
  fake worker.

It must not assert `--include-partial-messages` as product law.

### R5: RC Lane Naming

Rename or reprice ABG 3.5/ABG 3.5-specific test labels where they now represent the
current ABG substrate lane.

Known candidates:

- `test:t102-t109:abg35-sandbox`
- `test:t102-t109:abg35-live`

Recommended names:

- `test:t102-t110:abg35-sandbox`
- `test:t102-t110:abg35-live`

or neutral names that do not drift with each ABG cut:

- `test:t102-t110:abg-substrate-sandbox`
- `test:t102-t110:abg-substrate-live`

### R6: Design Surface Update

Update design docs to say:

- ABG owns traced process and PTY executor truth.
- odd_sdlc archives are projection/read-model evidence.
- executor profile is adapter ingress, not runtime law.
- PTY terminal execution is a supported robust live-agent executor, not a
  sticky-session/pool feature.
- T-110 sticky/warm session reuse remains out of scope.

## Migration Declaration

- old truth path: odd_sdlc admitted `process://claude`, constructed Claude argv
  locally, supervised worker execution through ABG process actor plus local
  archive assumptions, and projected timeout/inactivity through legacy worker
  process summary codes.
- new truth path: odd_sdlc admits worker binding and SDLC handoff truth, then
  delegates process execution to ABG `runAgentActorWorkerCallout` /
  supervised process actor backed by the traced process substrate. ABG emits
  typed process/callout truth; odd_sdlc projects SDLC operator archives and
  blocking reasons from that truth.
- old producers: `operator/transport.ts` Claude argv helpers, local
  status/signal/error interpretation, local stdout/stderr archive assumptions.
- new producers: ABG traced callout result, `TracedProcessOutcome`, trace
  archive paths, parser observations, terminal transcript refs, ABG runtime
  events, SDLC handoff/postflight evaluators.
- old consumers: installed operator summary, postflight, gap dossier, blocking
  reason projection, live lane assertions, operator archive readers.
- new consumers: same odd_sdlc read models, but their process facts are
  projected from ABG trace truth.
- projection/read-model surfaces: odd_sdlc operator archive files, CLI compact
  output, gap dossier, runtime events, live run summaries, RC notes.
- closure law: mixed old/new process authority is not acceptable closure
  evidence. The migration closes only after no normal worker-backed
  `process://claude` path depends on odd_sdlc-owned process semantics.

## Acceptance Criteria

- AC-1: `build_tenants/typescript/package-lock.json` resolves
  `@abiogenesis/typescript-tenant` to `3.5.0-rc.1`.
- AC-2: substrate design and active ticket references no longer state ABG 3.5/ABG 3.5
  as current governing substrate truth.
- AC-3: `process://claude` execution routes through ABG traced agent callout
  semantics.
- AC-4: odd_sdlc no longer owns `--include-partial-messages` or Claude
  stream-json parsing behavior.
- AC-5: installed operator archive summaries preserve ABG `outcome.kind`.
- AC-6: timeout, inactivity timeout, lost terminal, executor unavailable,
  launch failure, and nonzero worker contract failure remain distinguishable.
- AC-7: PTY executor profile can be selected explicitly for live Claude runs.
- AC-8: deterministic tests cover success, hard timeout, inactivity timeout,
  launch failure, and generic nonzero contract failure.
- AC-9: a live Claude data-mapper lane passes through `pty-terminal` and leaves
  ABG trace refs plus odd_sdlc projections.
- AC-10: no test or design text treats odd_sdlc worker archives as a rival
  process-truth archive independent of ABG.

## Proof Commands

Deterministic minimum:

```bash
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run build:semantic
npm run lint:semantic
npm run test:t028
npm run test:t064
npm run test:t101
npm run test:semantic
git diff --check
```

Focused migrated substrate lanes:

```bash
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run test:t102-t110:abg35-sandbox
ODD_SDLC_TS_LIVE=1 ODD_SDLC_TS_LIVE_WORKER_COMMAND=claude ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE=pty-terminal npm run test:t102-t110:abg35-live
```

If the final script names are neutralized instead of versioned, record the
actual commands in the closure evidence section.

## Live Evidence Requirement

At least one live archive must cite:

- installed odd_sdlc command
- ABG package version `3.5.0-rc.1`
- worker transport `process://claude`
- executor profile `pty-terminal`
- ABG trace root
- ABG traced process result
- typed `outcome.kind`
- odd_sdlc worker process summary projection
- postflight/gap dossier result

If the live lane fails, the failure is not to be worked around by weakening
the evaluator. It must be classified from the ABG trace evidence and root
caused.

## Out Of Scope

- Sticky session reuse.
- Warm agent pools.
- Long-lived Claude terminal reuse.
- AWS/distributed executor backend implementation.
- Full replacement of legacy `worker_result_report.json` with final
  first-class `F_P.transform_result` / `F_P.evaluate_result` carriers.

Those remain T-102 or future executor-policy work. This ticket is the
substrate migration needed before those higher-level changes can be evaluated
reliably.

## Implementation Notes

Prefer a one-stop refactor:

1. update dependency and design truth;
2. introduce the ABG callout lowering seam;
3. consume typed ABG outcomes in installed operator summary/postflight;
4. preserve old archive file names as projections;
5. update tests from old argv assertions to callout/outcome assertions;
6. run deterministic proof;
7. run live Claude PTY proof.

Do not build a second compatibility transport layer. Compatibility belongs in
projection from ABG truth to odd_sdlc read models, not in a duplicate executor.

## Implementation Checkpoint - 2026-05-03

The first implementation pass is applied.

Changed realization surfaces:

- `build_tenants/typescript/code/src/operator/transport.ts`
  - `process://claude` now lowers through ABG `claudeStreamJsonArgs`.
  - local `--include-partial-messages` transport law was removed.
  - Claude stdin prompt delivery was removed as odd_sdlc-owned law.
  - `parserForWorkerTransport(...)` makes Claude stream-json parser selection
    explicit at the ABG request boundary.
  - `selectedWorkerExecutorProfile(...)` lowers
    `ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE` / `ABG_TS_AGENT_EXECUTOR_PROFILE` into
    a typed executor profile field.
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - `invokeSupervisedProcessActor(...)` now receives the ABG parser and
    executor profile explicitly.
  - worker run and summary archives now project ABG trace root, trace result
    ref, executor profile, stream model, typed process outcome, structured
    event counts, parse failure counts, api retry counts, tool call counts,
    final output refs, and terminal transcript refs where present.
  - worker failure postflight maps ABG typed outcomes into distinct
    odd_sdlc blocking codes rather than collapsing them all into
    `worker_process_failed`.
- `build_tenants/typescript/code/src/operator/carriers.ts`
  - worker run and process summary carriers gained optional ABG trace/outcome
    projection fields.
- `build_tenants/typescript/code/src/shared/blocking_reason.ts`
  - added typed worker process blocker codes for ABG hard timeout, executor
    unavailable, launch failure, process error, and lost terminal.
- `build_tenants/typescript/test_env/tests/test_b070_claude_worker_argv.test.mjs`
  - repriced the Claude argv test from local transport law to ABG-owned
    stream-json callout lowering.
- `build_tenants/typescript/package.json`
  - renamed the focused ABG substrate script labels to `abg35`.
- `build_tenants/typescript/package-lock.json`
  - updated resolved ABG dependency identity to `3.5.0-rc.1`.
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
  - records ABG 3.5 process/callout substrate ownership.

Closure is intentionally pending proof. Do not move this ticket to completed
until the deterministic proof commands pass, and do not claim live closure until
the Claude PTY lane leaves archive evidence under the migrated path.
