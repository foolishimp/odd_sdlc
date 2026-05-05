---
id: T-117
title: Migrate odd_sdlc live agent lanes to ABG sticky-session executor
type: migration
ticket_category: abg_substrate_adoption
status: backlog
review_status: pending
goal: typescript-rc-live-lane-performance-and-retry-robustness
build_tenant: typescript
owner: unassigned
change_intent: Adopt the ABG sticky-session executor from abiogenesis T-110 for odd_sdlc live agent lanes, starting with same-edge retry reuse and preserving one archive per call-out attempt.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: process://claude worker invocation, installed start loop, live data-mapper harness, PTY executor profile selection, per-call archive lineage, retry attempts
priority: high
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-04
governance_scope: STDO Method
depends_on:
  - abiogenesis T-110 sticky-session agent pool executor
  - abiogenesis T-111 literal PTY/xterm executor, if T-110 keeps PTY pooling as its first backend
  - odd_sdlc T-109 authoritative edge ledger lineage chain
intake_source: T-109 data-mapper PTY live run 20260504T121722717Z_pid84330 reached repeated process://claude invocations and same-edge retry pressure. The run pays cold-start and context rediscovery cost at every edge and every retry even when the retry is over the same workspace, graph function, vector, edge, and prompt contract.
target_truth: odd_sdlc live agent lanes can opt into ABG sticky-session execution without changing closure authority. Same-edge retries reuse the same ABG-owned session when the affinity key matches, while each attempt still receives its own archive, postflight result, gap dossier, and edge ledger entry.
superseded_truth: Each odd_sdlc live worker call must launch a fresh agent process even when retrying the same typed postflight failure.
closure_law: This ticket closes only after odd_sdlc consumes the ABG sticky executor through the shared call-out interface, not through an odd_sdlc-local pool or shell wrapper.
evaluation_criteria:
  - same-edge retry affinity key is derived from workspace, graph function, vector index, edge name, and prompt contract digest
  - live harness can select local-spawn, pty-terminal, or sticky-session through the same executor profile interface
  - each retry attempt keeps a distinct per-call archive and gap dossier
  - shared sticky session transcript is sliced into per-call archive views
  - hidden session state is never treated as closure authority
  - prompt-cache metrics and session reuse classification are visible in the operator archive
proof_surface:
  - deterministic retry fixture with first attempt rejected by typed postflight and second attempt repaired under the same affinity key
  - live data-mapper run comparing local PTY cold-start wall time against sticky same-edge retry wall time
  - archive inspection proving per-attempt separation
non_closure_conditions:
  - odd_sdlc implements its own pool instead of consuming ABG T-110
  - a retry reuses session state but overwrites the prior attempt archive
  - closure depends on conversational memory rather than typed artifact output and postflight admission
  - tests cannot force local-spawn or pty-terminal isolation
---

# T-117: Migrate odd_sdlc Live Agent Lanes To ABG Sticky Sessions

## STDO Triage

The missing layer is realization adoption. ABG owns the executor substrate.
odd_sdlc owns selecting and consuming that substrate for software-domain live
lanes.

This ticket is not a request to invent another local runtime. It is a migration
ticket over the ABG call-out interface.

## Implementation Notes

The first lawful policy is same-edge retry reuse. Cross-edge reuse is future
optimization and must not be used as proof until authority-boundary tests show
hidden session memory cannot influence closure.

The live data-mapper lane is the proving surface because it already exposes the
cost profile: large worker context, PTY traces, repeated `gaps`, repeated
`start`, and typed same-edge retry blockers.
