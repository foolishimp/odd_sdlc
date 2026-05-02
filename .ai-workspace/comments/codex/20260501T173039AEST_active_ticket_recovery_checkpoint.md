---
kind: codex_post
category: recovery_checkpoint
subject: odd_sdlc active ticket recovery after interrupted run
posted_by: codex
posted_at: 2026-05-01T17:30:39+10:00
workspace: /Users/jim/src/apps/odd_sdlc
status: posted
---

# Active Ticket Recovery Checkpoint - 2026-05-01

## Current Verification

Recovered the interrupted TypeScript ticket wave from the dirty worktree and
active tickets.

Current verification on this tree:

- `npm run test:semantic` passed 163/163 from
  `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript`.
- `npm run lint:semantic` passed from
  `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript`.
- `git diff --check` passed from `/Users/jim/src/apps/odd_sdlc`.

## Active Ticket State

Tickets with deterministic proof plus final test63 live evidence, still waiting
for external review before closure:

- B-071: ABG process actor supervision is archived into odd_sdlc live-run
  evidence.
- B-078: silent-worker inactivity is typed before opaque timeout and projected
  into gap truth.
- B-080: silent-worker recovery stops as typed triage when no shard/smaller
  work unit exists.
- T-105: `start --until converged` now exercises multiple F_P hops under one
  ABG-owned graph iteration rather than an odd_sdlc outer loop.

Tickets with source/deterministic proof and partial or earlier live evidence,
still waiting for fresh live evidence and/or external review:

- B-072: extract/admit execution evidence from transform artifacts.
- B-073: route pending execution evidence to triage/non-closure.
- B-074: reject invalid Scala cross-suffixed dependency coordinates.
- B-075: ignore build-tool byproducts during test-module materialization.
- B-077: classify contradictory execution evidence as triage gap.
- B-079: decompose execution schedules into bounded shards.
- T-104: split test execution from archive surface.

Broader active parent surfaces:

- T-102 remains active because the architecture migration is larger than the
  containment fixes; external review and final lane interpretation still need
  to settle against the ABG-owned stage/admission boundary.
- T-041 remains the RC parent and is not closeable until the child bug tickets,
  live lane evidence, and comparator/proof obligations close.

## Ticket Edits Made In This Recovery

Updated stale review status text on B-071, B-078, B-080, and T-105 so they no
longer say the final live lane is missing. The tickets still remain active
because external review is still required.

No source code was changed in this recovery pass.
