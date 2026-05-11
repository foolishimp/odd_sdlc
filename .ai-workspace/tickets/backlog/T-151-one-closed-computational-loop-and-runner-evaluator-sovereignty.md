---
id: T-151
title: One closed computational loop and runner evaluator sovereignty
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: consolidate_existing_runner_action_paths_onto_traversal_consequence_chain
governing_library: odd_sdlc TypeScript installed operator, ABG evaluator substrate, traversal consequence carriers
status: backlog
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Ensure the runner consumes evaluator/decision truth as the sole route from work output to next action, eliminating local gap-dossier action strings and branch-derived traversal authority.
change_class: design_reframe
re_entry_point: design
priority: critical
execution_phase: axiomatic_setting
execution_order: 2
execution_order_reason: Makes the installed runner consume the single consequence truth surface after rival closure authority is deleted.
triaged_at: 2026-05-11
created_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: evolves_old_and_replaces_local_action_authority
authority_ruling:
  - traversal_consequence_chain_evolves_existing_spine
  - runner_local_branch_strings_replaced_as_authority
  - gap_dossier_next_lawful_actions_authority_deleted
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-135 evaluator-owned runner traversal spine
  - T-136 yield closure disposition and resume basis
  - T-139 public gaps read-only evaluator view
  - T-140 local forced-iteration tech-debt retirement
  - T-145 replay-visible closure and worker report authority deletion
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
  - .ai-workspace/comments/codex/20260511T042940Z_CLOSURE_t143_internal_authoritative_data_mapper.md
affected_boundary:
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/test_env/tests/
---

# T-151: One Closed Computational Loop And Runner Evaluator Sovereignty

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

The May 9 source document states the target loop:

```text
observe current workspace state
-> bind gap to exact target asset obligations
-> choose a lawful graph action
-> invoke that action
-> admit worker/process/product evidence
-> publish one edge ledger
-> project close/yield/retry/repair/re-enter/reprice/block
-> select next action only when the disposition calls for one
```

This ticket makes that loop sovereign in runner behavior.

## Target Truth

The installed runner consumes:

```text
SdlcEdgeFulfillmentLedger
-> SdlcEdgeClosureDecision
-> SdlcNextActionProjection
```

as the only route from transform output to next work. The old code paths that
select work from gap dossiers, compact CLI summaries, postflight reports,
assurance reports, run summaries, or local branch names are deleted. Any
remaining display surface is generated from the consequence chain.

## Regression Archive

T-143 closure produced a live installed-runner regression seed:

```text
build_tenants/typescript/test_env/test_runs/internal_data_mapper_t143_repair_live/20260511T034123994Z_pid43155
```

The first materialization attempt was:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T034543101Z_pid78309
```

It correctly failed closed:

```text
postflight.status = blocked
blockingReasons =
  - test_execution_evidence_invalid:transformArtifact.executionEvidence.command: expected string
lawfulReentryPoint = repair_worker_output
```

The bug is that the same installed `start --target next --until first_traversal`
process continued into same-edge repair/reentry instead of returning the
admitted non-close consequence to the caller. It launched follow-up
`Fg_materialize_declared_product_asset` attempts in:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T041049121Z_pid78309
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T041342457Z_pid78309
```

The T-151 regression test should replay or fixture this shape and prove that
runner continuation is selected only from
`SdlcEdgeFulfillmentLedger -> SdlcEdgeClosureDecision -> SdlcNextActionProjection`.
Gap-dossier `nextLawfulActions`, postflight status strings, compact summaries,
and local branch names must not keep the same edge alive inside a
`first_traversal` invocation.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This consolidates installed-runner authority
  onto the traversal consequence chain.
- Ledger ruling: `evolves old`. The existing `SdlcEdgeFulfillmentLedger`,
  `SdlcEdgeClosureDecision`, and `SdlcNextActionProjection` are the governing
  chain. Do not add a second runner-evaluator ledger.
- Replacement ruling: local branch names, compact summary action strings,
  gap-dossier `nextLawfulActions`, postflight statuses, and assurance fold
  statuses are replaced as action-selection authority. Under spec method this
  means deletion of the old authority-producing/consuming branches.
- Retained artifacts: summaries may remain only as raw evidence or projections
  generated from `SdlcEdgeClosureDecision` and `SdlcNextActionProjection`.
- W/L/E/Ev rule: runner action selection must consume admitted evaluator output
  from L/E, not ambient workspace state or controller memory.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A0, A1, A1a, A1b, A4
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Consolidate runner selection in `build_tenants/typescript/code/src/operator/installed_operator.ts`, especially consequence derivation, `nextLawfulAction`, retry context, current-edge/status, and terminal handling.
- Keep authority carriers in `build_tenants/typescript/code/src/operator/traversal_consequence.ts`.
- Remove public-gap/archive authority influence in `build_tenants/typescript/code/src/spec_method/entry.ts`.
- Check public start contract in `build_tenants/typescript/code/src/start/public_start.ts`.
- Audit postflight dossier action strings in `build_tenants/typescript/code/src/operator/handoff.ts` only as deleted authority inputs or projected display.

## Migration Plan

1. Inventory installed-runner paths that set `nextLawfulAction`, current edge,
   retry/repair/re-entry, block, or reprice from local status strings.
2. Derive runner continuation only from `SdlcEdgeClosureDecision` and
   `SdlcNextActionProjection`.
3. Delete gap-dossier and postflight action-string routing inputs. If action
   strings are still rendered, derive them from the consequence chain.
4. Ensure retry context and re-entry refs cite closure decision and next-action
   projection authority.
5. Add contradiction tests where public gap dossier, compact output, or local
   terminal status disagrees with the consequence chain and the chain wins.

## Closure Criteria

- `installed_operator.ts` no longer maps local booleans into authoritative
  `retry_same_edge_with_gap_dossier`, `escalate_to_fp_with_gap_dossier`,
  `plan_repair_reentry_with_gap_dossier`, or archive-inspection action routes.
- Runner action selection consumes `SdlcEdgeClosureDecision` and
  `SdlcNextActionProjection`.
- Public gaps can render the same evaluator truth but cannot route work.
- Negative tests prove conflicting gap dossier, run summary, or compact output
  cannot override the ledger/decision/evaluator chain.
- At least one functional test executes the loop through evidence admission,
  closure decision, and next-action projection rather than helper-only shape.
- `nextLawfulAction` or its replacement in installed outcomes is derived from
  `SdlcNextActionProjection.selectedActionRef` or the closure disposition, not
  from gap-dossier strings.
- Retry context predecessor refs cite `SdlcEdgeClosureDecision` and
  `SdlcNextActionProjection`.
- A negative test proves assurance fold status cannot route work unless it has
  been admitted into closure/evaluator consequence truth.
- No installed-runner branch can choose retry, repair, re-entry, reprice, block,
  or next graph work from gap dossier, postflight, run summary, compact output,
  or local terminal status without consequence-chain authority.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t135_evaluator_owned_runner_spine.test.mjs`
- `node --test test_env/tests/test_t136_yield_closure_disposition.test.mjs`
- `node --test test_env/tests/test_t138_traversal_consequence_replayability.test.mjs`
- `node --test test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs`
- `node --test test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs`
- `node --test test_env/tests/test_t142_autonomous_product_materialization.test.mjs`
- Add and run a focused `test_env/tests/test_t151_runner_evaluator_sovereignty.test.mjs`.

## Non-Closure Conditions

- Any runner path selects retry, repair, re-entry, block, or next action from
  gap-dossier strings or local branch names.
- The old action-selection code remains present but is merely marked read-only,
  legacy, fallback, or lower priority.
- A test can pass while `SdlcEdgeClosureDecision` is absent or contradicted.
- Public gaps and runner action selection can disagree on the governing
  evaluator truth.
