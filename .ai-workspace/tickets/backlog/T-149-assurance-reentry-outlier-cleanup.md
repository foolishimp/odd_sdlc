---
id: T-149
title: Assurance re-entry outlier cleanup
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: refine_existing_capability_and_component_depth_assurance_dispositions
governing_library: odd_sdlc TypeScript assurance capability, component depth, and traversal consequence dispositions
status: backlog
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Finish the repairable-vs-no-basis assurance classification cleanup so evidence gaps re-enter lawfully while true no-lawful-action cases remain hard stops.
change_class: realization_refactor
re_entry_point: code
priority: medium
execution_phase: classifier_cleanup
execution_order: 7
execution_order_reason: Cleans repairable-vs-no-basis classifier outliers after assurance law is set.
triaged_at: 2026-05-11
created_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: evolves_old
authority_ruling:
  - assurance_dispositions_evolve_existing_capability_and_component_depth_checks
  - repairable_evidence_gaps_feed_edge_closure_decision
  - no_basis_cases_remain_block_or_reprice
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-082 capability assurance ledger
  - T-115 execution failure to component repair flow
  - T-136 yield closure disposition
  - T-144 repairable assurance boundary cleanup
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/code/src/assurance/capability.ts
  - build_tenants/typescript/code/src/assurance/component_depth.ts
  - build_tenants/typescript/code/src/operator/assurance_gate.ts
  - build_tenants/typescript/test_env/tests/
---

# T-149: Assurance Re-Entry Outlier Cleanup

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

T-144 repaired the main F_D-overreach slice. Two assurance paths still need
review against the same boundary: capability evidence gaps and component-depth
no-basis cases.

## Target Truth

Repairable evidence gaps enter retry, repair, or yield through replay-visible
closure decisions. True no-lawful-action cases remain `block` or `reprice`.

No path flattens admitted progress into failure, timeout, or local runner
waiting state.

## STDO Method Governance

- STDO re-entry: `realization_refactor`. This repairs classifier behavior within
  existing assurance dimensions and does not change upstream requirements.
- Ledger ruling: `evolves old`. Capability and component-depth assurance remain
  existing assurance ledger rows. They feed the edge closure decision; they do
  not create a new re-entry ledger.
- Authority boundary: repairable evidence gaps become `retry`, `repair`, or
  `yield` only through replay-visible `SdlcEdgeClosureDecision`. True no-basis
  cases remain hard `block` or `reprice`.
- Liveness rule: timeout, silence, or process state may support yield or
  interruption, but cannot classify semantic failure or semantic closure by
  itself.
- Migration scope: only capability/component-depth outliers and related gate
  routing are in scope.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A1a/A1b and A13/A13a
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Audit capability assurance in `build_tenants/typescript/code/src/assurance/capability.ts` if present, or the current capability assurance module if renamed.
- Audit `build_tenants/typescript/code/src/assurance/component_depth.ts`.
- Check closure inputs in `build_tenants/typescript/code/src/operator/assurance_gate.ts` and `build_tenants/typescript/code/src/assurance/fold.ts`.
- Verify non-close dispositions through `build_tenants/typescript/code/src/operator/traversal_consequence.ts`.

## Migration Plan

1. Audit capability and component-depth assurance outputs for evidence-gap,
   no-basis, and runtime-state cases.
2. Map repairable evidence gaps to lawful re-entry reasons that feed
   `SdlcEdgeClosureDecision`.
3. Preserve hard-stop classification for no-published-action, no constructive
   basis, and requirement/design reprice cases.
4. Add tests proving liveness and worker prose cannot convert a hard stop into a
   repairable path.
5. Add tests proving admitted progress is not flattened into blocked failure.

## Closure Criteria

- Capability evidence missing is repairable when a constructive basis exists.
- Component-depth gaps distinguish repairable evidence gaps from true no-basis
  hard stops.
- Tests prove repairable evidence gaps re-enter through admitted disposition
  truth.
- Tests prove no-lawful-action cases remain hard stops and cannot be converted
  to repair/yield by liveness or worker prose alone.
- Every changed classifier cites the assurance reason and lawful re-entry point
  that the closure decision consumes.
- A regression test covers capability evidence missing with a constructive basis
  and observes a replay-visible non-close disposition.
- A regression test covers component-depth no-basis and observes `block` or
  `reprice`, not repair.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `node --test test_env/tests/test_t113_component_depth_register_admission.test.mjs`
- `node --test test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`
- `node --test test_env/tests/test_t136_yield_closure_disposition.test.mjs`
- Add and run a focused `test_env/tests/test_t149_assurance_reentry_outliers.test.mjs`.

## Non-Closure Conditions

- Capability evidence missing still defaults to `operator_blocked`.
- Every component-depth non-design reason becomes repairable without a no-basis
  branch.
- Tests assert only reason text and not the closure disposition path.
