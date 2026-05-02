---
kind: codex_post
category: external_review_packet
subject: STDO review packet for B-071 B-078 B-080 T-105
posted_by: codex
posted_at: 2026-05-01T18:09:41+10:00
workspace: /Users/jim/src/apps/odd_sdlc
status: posted
review_requested_for:
  - B-071
  - B-078
  - B-080
  - T-105
---

# External STDO Review Packet - B-071 / B-078 / B-080 / T-105

## Review Ask

Review the four live-proven tickets for STDO closure readiness.

The narrow question is not whether the full TypeScript RC closes. It does not.
The question is whether these four tickets have reduced their own boundary
defects without leaving hidden odd_sdlc execution authority in the normal path.

## Governing Method

- `SPEC_METHOD.md`: intake must use the smallest lawful re-entry point and no
  gate may close while active surfaces are internally inconsistent.
- `TICKET_METHOD.md`: implementation migrations require named old/new truth
  paths, producer/consumer inventories, projection surfaces, closure law, and
  non-closure checks.
- `ODD_METHOD.md`: ABG owns traversal, actor invocation, process supervision,
  retry, continuation, runtime events, projection, and closure fold.
- `DESIGN_MODULE_METHOD.md`: authority seams must reduce duplicate truth
  surfaces and fail closed when admitted carriers are absent or drift.

## Tickets Under Review

### B-071

Claim:

odd_sdlc consumes ABG supervised process actor truth for live Claude workers
instead of using opaque synchronous process execution as the evidence surface.

Evidence:

- `process://claude` live lane produced `worker_process_started.json`,
  `worker_process_events.jsonl`, `worker_stdout.log`, and
  `worker_stderr.log` per attempt.
- Final test63 archive:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test63.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260501T060923716Z_pid95556`
- Final blocker is typed process evidence, not terminal-transcript inference.

Review questions:

- Does odd_sdlc still supervise process lifecycle outside the ABG actor seam?
- Are process events and logs archived early enough to satisfy live
  observability before worker completion?
- Are B-070 argv/stdin semantics preserved?

### B-078

Claim:

silent live workers are classified by an inactivity policy distinct from global
actor timeout. Heartbeats no longer count as productive progress.

Evidence:

- Final test63 gap dossier reports `silent_worker_inactivity`.
- Detail carries elapsed time, stdout/stderr byte counts, signal,
  `priorSilentAttempts`, and shard count.
- `retryEligible: false` and `nextLawfulActions: ["triage_gap"]` for the
  no-shard terminal path.

Review questions:

- Does the policy distinguish actor liveness from worker progress?
- Does the evidence come from ABG process facts plus odd_sdlc domain policy,
  rather than ad hoc polling?
- Does the ticket correctly leave recovery behavior to B-080?

### B-080

Claim:

silent-worker recovery is governed: same-edge retry is allowed only when a
smaller or sharper unit exists, repeated/no-shard silence stops as typed triage,
and the silent attempt remains visible in gap/retry truth.

Evidence:

- Final test63 archive stopped at `derive_test_module_surface` with typed
  `silent_worker_inactivity`.
- The no-shard case stopped before spending blind retries.
- B-080 now carries migration strategy, old/new truth paths,
  producers/consumers, projection surfaces, and migration checklist.

Review questions:

- Is repeated silence prevented from consuming the full retry budget?
- Is no-shard recovery correctly triaged instead of blindly retried?
- Does any compatibility path still treat timeout as a successful or retryable
  closure signal?

### T-105

Claim:

`start --until converged` no longer uses an odd_sdlc outer traversal loop. The
installed operator invokes ABG whole-graph iteration once and preserves
per-attempt archives as an effect surface.

Evidence:

- `oneTraversalBasis(...)`, `AUTONOMOUS_START_STEP_GUARD`,
  `stopReasonForOutcome(...)`, and `SdlcAutonomousStartLoopTrace` are removed
  from the implementation path.
- test63 shows multiple F_P hops under one parent process `pid95556`.
- T-105 now carries implementation-migration authority surfaces.

Review questions:

- Does normal `start --until converged` have exactly one traversal authority?
- Are retry budget, vector advancement, and closure fold owned by ABG?
- Are per-attempt forensic archives preserved without recreating odd_sdlc loop
  semantics?

## Current Verification

Current tree verification before this review packet:

- `npm run test:semantic` passed 163/163 from
  `build_tenants/typescript`.
- `npm run lint:semantic` passed from `build_tenants/typescript`.
- `git diff --check` passed from the repo root.

## Expected Review Outcome

Accepted review can move B-071, B-078, B-080, and T-105 to completed.

Rejected review should name the precise active non-closure condition and the
smallest lawful re-entry point. Do not broaden this review into T-041 RC
closure or historical Python parity.
