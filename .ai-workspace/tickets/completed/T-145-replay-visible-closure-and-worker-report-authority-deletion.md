---
id: T-145
title: Replay-visible closure and worker report authority deletion
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: refactor_existing_spec_method_and_worker_report_consumers
governing_library: odd_sdlc TypeScript replay, gaps projection, worker evidence admission, and traversal consequence surfaces
status: completed
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Remove archive-derived closure and worker narrative authority so closure, blocking, routing, retry, repair, and next-action selection derive only from replay-visible admitted ledger/event truth.
change_class: design_reframe
re_entry_point: design
priority: critical
execution_phase: axiomatic_setting
execution_order: 1
execution_order_reason: Deletes rival closure/report authority so the one-truth-surface axiom can govern every later ticket.
triaged_at: 2026-05-11
created_at: 2026-05-11
completed_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: new_replaces_old
authority_ruling:
  - archive_derived_terminal_closure_replaced_as_authority
  - worker_result_report_prose_authority_consumers_deleted
  - gap_dossier_action_string_authority_deleted
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-109 traversal consequence ledger/decision/evaluator split
  - T-135 evaluator-owned runner traversal spine
  - T-139 public gaps read-only evaluator view
  - T-140 local forced-iteration retirement
  - T-144 repairable assurance and tenant grammar boundary cleanup
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/test_env/tests/
---

# T-145: Replay-Visible Closure And Worker Report Authority Deletion

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

The May 9 test35 breakdown showed that successful parity requires one route
from transform output to next action:

```text
Admitted evidence
-> SdlcEdgeFulfillmentLedger
-> SdlcEdgeClosureDecision
-> SdlcNextActionProjection
```

The T-144 follow-on strategy found two remaining rival authority paths:
operator-run archive state can override gaps to converged, and
`worker_result_report.json` narrative can still appear authority-like.

## Target Truth

Archive files and worker report prose are raw evidence or diagnostics only until
admitted into typed evidence. The old code paths that interpret archive-only
state or worker prose as closure/routing authority are deleted. A rendered
diagnostic may remain only when it is generated from the single governing truth
surface.

Closure truth is replay-visible runtime/event/ledger truth.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This changes the realization authority path
  for closure and routing while preserving the product intent.
- Ledger ruling: `new replaces old`. Under spec method, replacement means
  deletion of the old authority-producing code path. The replacing authority is
  the existing
  `SdlcEdgeFulfillmentLedger -> SdlcEdgeClosureDecision -> SdlcNextActionProjection`
  chain, not a new ledger family.
- Replaced authority: archive-only terminal closure, worker report prose, and
  gap-dossier action strings when they are not backed by replay-visible
  consequence truth.
- Retained artifacts: archive files, worker reports, postflight output, and gap
  dossiers may remain as raw evidence, diagnostics, or projections generated
  from consequence truth. They cannot carry independent closure/routing logic.
- Governing consistency rule: W can only influence closure through admitted L/E
  truth. Archive state is not L/E merely because it is persisted.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A1, A1a, A1b
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Delete archive-derived closure authority in `build_tenants/typescript/code/src/spec_method/entry.ts`, especially `terminalClosedGraphFunctionFromArchive`, `withTerminalClosedProjection`, and `withTerminalClosedDossier`.
- Audit postflight gap dossier authority in `build_tenants/typescript/code/src/operator/handoff.ts`, especially `constructPostflightGapDossier`, `writePostflightGapDossier`, and parsed `nextLawfulActions`.
- Keep truth derived from `build_tenants/typescript/code/src/operator/traversal_consequence.ts`.
- Check installed-runner consumers in `build_tenants/typescript/code/src/operator/installed_operator.ts`.

## Migration Plan

1. Inventory every consumer of terminal archive closure, `worker_result_report`
   narrative fields, postflight gap-dossier action strings, and archive
   rehydration status.
2. Delete old authority helpers and branches, including archive-derived terminal
   closure rewrites and worker-prose closure/routing consumers.
3. Replace closure and routing reads with
   `SdlcEdgeFulfillmentLedger`, `SdlcEdgeClosureDecision`, and
   `SdlcNextActionProjection` refs.
4. Re-expose archive-only terminal closure only as raw diagnostic/import input
   generated outside the truth path, never as projection truth.
5. Keep compatibility files written where needed, but regenerate any display
   from consequence truth rather than preserving the old calculation.
6. Add contradiction tests where archive/report state disagrees with the
   consequence chain and the chain wins.

## Closure Criteria

- `gaps` cannot report convergence from operator archive files unless the same
  closure is present in replay-visible runtime truth.
- Changing only `worker_result_report.summary` or `unresolvedReasons` cannot
  change closure, blocking, routing, retry, repair, or next-action selection.
- Terminal closure found only in an archive is exposed as diagnostic evidence or
  an import candidate, not as projection truth.
- Negative tests prove archive-only closure and worker-narrative changes cannot
  override the ledger/decision/evaluator chain.
- `spec_method/entry.ts` no longer rewrites `SdlcGapProjection` or
  `SdlcGapDossier` to `converged` from archive-only terminal closure.
- Archive rehydration status cannot alter fulfillment, gap, closure, or
  next-action truth. Any retained status is raw diagnostic/import evidence only.
- A test mutates archive terminal closure while leaving the current run's
  consequence chain non-closed; public gaps stay non-closed.
- A test mutates worker report prose while preserving typed evidence and
  consequence truth; routing and closure are unchanged.
- The old archive-derived closure helper and public-projection override are
  deleted, not retained as a lower-priority branch.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t058_spec_method_entrypoint.test.mjs`
- `node --test test_env/tests/test_t138_traversal_consequence_replayability.test.mjs`
- `node --test test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs`
- Add and run a focused `test_env/tests/test_t145_replay_visible_closure_authority.test.mjs` proving archive-only closure and worker-prose mutation cannot alter closure or routing.

## Non-Closure Conditions

- `spec_method/entry.ts` can still turn archive-local terminal closure into
  `converged`.
- A worker report field can alter closure or next-action behavior without
  admitted typed evidence changing.
- The old authority path remains present but is merely labelled read-only or
  lower priority.
- A passing test only checks rendered output and does not prove the replay chain
  wins when archive/report state disagrees.

## Closure Evidence

Implementation:

- Removed archive-derived terminal closure authority from
  `build_tenants/typescript/code/src/spec_method/entry.ts`.
- Deleted `terminalClosedGraphFunctionFromArchive`,
  `withTerminalClosedProjection`, `withTerminalClosedDossier`, and the public
  gaps branch that rewrote replay projections and dossiers to `converged` from
  archive-only state.
- Added `test_env/tests/test_t145_replay_visible_closure_authority.test.mjs`
  and `npm run test:t145`.
- Updated the stale T-143 public-gap assertion in
  `test_t058_spec_method_entrypoint.test.mjs` so archive-only terminal closure
  remains non-converged unless replay truth closes the edge.

Verification from `build_tenants/typescript`:

- `npm run test:t145` passed.
- `npm run test:t058` passed.
- `npm run test:t138` passed.
- `npm run test:t139` passed.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed: 390 tests.
