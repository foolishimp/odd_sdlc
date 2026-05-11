---
id: T-153
title: Live non-close disposition parity proof
type: feature
ticket_category: live_proof
migration_strategy: inside_out_hard_break
library_usage: extend_existing_yield_retry_repair_reentry_reprice_block_tests_to_live_or_live_equivalent_lanes
governing_library: odd_sdlc TypeScript closure decision, liveness observer, replay, and evaluator-owned runner surfaces
status: backlog
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Prove non-close dispositions from worker evidence through replay-visible closure/evaluator truth rather than only deterministic helper tests.
change_class: realization_refactor
re_entry_point: code
priority: high
execution_phase: non_close_proof
execution_order: 9
execution_order_reason: Proves non-close dispositions after runner sovereignty and assurance classifier cleanup.
triaged_at: 2026-05-11
created_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: proof_over_existing_chain
authority_ruling:
  - non_close_dispositions_evolve_existing_edge_closure_decision
  - no_new_ledger
  - liveness_may_support_yield_but_not_semantic_failure_or_closure
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-136 yield closure disposition and resume basis
  - T-149 assurance re-entry outlier cleanup
  - T-151 runner evaluator sovereignty
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/runtime/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
---

# T-153: Live Non-Close Disposition Parity Proof

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

The clean T132/T133/T142 lanes prove `close`. The May 9 test35 source document
calls out the remaining parity gap: `yield`, `retry`, `repair`, `re-enter`,
`reprice`, and `block` must be proven from live or live-equivalent worker
evidence.

## Target Truth

Non-close dispositions are replay-visible `SdlcEdgeClosureDecision` outcomes
that feed evaluator-owned next-action projection. They are not hidden local
loops, timeout aliases, worker prose, or gap dossier action strings.

## STDO Method Governance

- STDO re-entry: `realization_refactor`. This is proof and coverage work over
  the existing non-close disposition model.
- Ledger ruling: proof over existing chain. No new ledger class is allowed for
  non-close handling.
- Authority boundary: `yield`, `retry`, `repair`, `re-enter`, `reprice`, and
  `block` must appear as replay-visible `SdlcEdgeClosureDecision` dispositions
  before they affect next action.
- Liveness rule: liveness can justify yield or interruption only when paired
  with admitted progress/resume basis. It cannot create semantic closure or
  semantic failure.
- Runner rule: retry/repair/re-entry selection is evaluator-owned and must be
  visible through `SdlcNextActionProjection`.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A1a/A1b and A4
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Prove dispositions through `build_tenants/typescript/code/src/operator/traversal_consequence.ts`.
- Check runner use of dispositions in `build_tenants/typescript/code/src/operator/installed_operator.ts`.
- Use runtime/liveness support under `build_tenants/typescript/code/src/runtime/` only as evidence, not semantic authority.
- Use existing repair and live lanes as references: T-115, T-132, T-133 live tests.

## Migration Plan

1. Select one live or live-equivalent lane for `yield`, one for retry/repair,
   and one for `block` or `reprice`.
2. Ensure each lane admits worksite/process/product evidence before deriving
   closure decision.
3. Assert each non-close disposition and next-action basis through replayed
   consequence artifacts, not helper-only objects.
4. Add negative checks for timeout-only failure, worker-prose-only failure, and
   local-loop-only yield.
5. Preserve existing close-path tests and add parity assertions for non-close
   dispositions.

## Closure Criteria

- Live or live-equivalent tests cover at least one positive `yield`, one
  repair/retry path, and one true `block` or `reprice` path.
- Yield returns control with replay-visible resume basis and does not dispatch a
  new action.
- Retry/repair/re-entry are selected through evaluator truth, not local branch
  names.
- Liveness can support yield or interruption but cannot create semantic closure
  or semantic failure by itself.
- Replay reconstructs every non-close disposition and next-action basis.
- Each non-close proof archives or asserts `SdlcEdgeFulfillmentLedger`,
  `SdlcEdgeClosureDecision`, and `SdlcNextActionProjection`.
- Yield proof includes admitted progress beyond liveness refs and a
  replay-visible resume basis.
- Retry/repair proof shows selected action refs from evaluator projection.
- Block/reprice proof shows no repair/yield conversion from worker prose or
  liveness alone.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t136_yield_closure_disposition.test.mjs`
- `node --test test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`
- `node --test test_env/tests/test_t138_traversal_consequence_replayability.test.mjs`
- Add and run a focused `test_env/tests/test_t153_non_close_disposition_parity.test.mjs`.
- If a live lane is used, run the narrow live test that the implementation adds under `test_env/live/` rather than the whole live suite by default.

## Non-Closure Conditions

- Non-close proof exists only as unit helper construction.
- Timeout, process silence, or worker prose is enough to classify semantic
  failure.
- A local loop keeps the edge alive without a replay-visible yield disposition.
