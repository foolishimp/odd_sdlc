---
id: T-154
title: No-harness-target data_mapper parity proof
type: feature
ticket_category: live_proof
migration_strategy: inside_out_hard_break
library_usage: prove_current_typescript_traversal_consequence_chain_against_data_mapper_scale_workspace
governing_library: odd_sdlc TypeScript evaluator-owned runner, traversal consequence, target binding, and data_mapper parity lane
status: backlog
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Prove the TypeScript line can start from a source/specification-only data_mapper-scale workspace, derive product pressure without an explicit harness product target, and replay every decision from the consequence chain.
change_class: design_reframe
re_entry_point: design
priority: critical
execution_phase: final_integration_proof
execution_order: 10
execution_order_reason: Final no-harness data_mapper parity proof after axioms, scale partition, and non-close behavior are established.
triaged_at: 2026-05-11
created_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: proof_over_existing_chain_and_replaces_harness_target_authority
authority_ruling:
  - no_harness_target_authority
  - evaluator_consequence_chain_evolves_existing_spine
  - source_specification_workspace_derives_product_pressure
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-141 requirement-to-product transform boundary
  - T-142 autonomous product materialization from consequence chain
  - T-151 one closed computational loop and runner evaluator sovereignty
  - T-152 data_mapper-scale transformation-set partition proof
  - T-153 live non-close disposition parity proof
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
---

# T-154: No-Harness-Target data_mapper Parity Proof

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

The May 9 test35 source document says the controlling proof is not another
hello-world target. The TypeScript line must prove the data_mapper-scale loop:

```text
real data_mapper worksite
-> observe expected-vs-realized mismatch
-> classify the lawful gap route
-> continue/yield/retry/repair/reprice from replay-visible consequence truth
```

## Target Truth

A source/specification-only workspace can conform authority, derive requirements
as transformation-set pressure, select product materialization or another
lawful next action without an explicit harness target, admit construction
intent, invoke F_P, publish ledger/decision/projection truth, and replay every
decision.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This proves the target operating model for a
  source/specification-only workspace and may expose design gaps in target
  binding or runner selection.
- Ledger ruling: proof over existing chain and replacement of harness target
  authority. The proof must use the current consequence chain; it must not
  introduce a new parity ledger.
- Replacement ruling: explicit harness product target arguments are replaced as
  authority by conformed workspace/requirement truth, downstream pressure,
  target binding, catalog, policy, and admitted evaluator output. Replacement
  means the harness-target authority path is deleted for this proof lane, not
  retained as fallback.
- Authority boundary: every decision must replay from W observed through L/E and
  evaluator output admitted back into L/E.
- Product route rule: product materialization may be selected only after target
  binding and policy/catalog eligibility are visible in the consequence chain.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A0, A1, A1a, A1b, A2, A4
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Use `build_tenants/typescript/code/src/spec_method/entry.ts` and `build_tenants/typescript/code/src/start/public_start.ts` for source/specification-only start behavior.
- Use `build_tenants/typescript/code/src/operator/installed_operator.ts` for runner proof and deletion of harness target authority.
- Use `build_tenants/typescript/code/src/operator/traversal_consequence.ts` for replayable chain artifacts.
- Use `build_tenants/typescript/code/src/projection/query_domain.ts` for target binding and product pressure derivation.
- Use `build_tenants/typescript/test_env/live/run_full_external_data_mapper_sandbox.mjs` and existing data_mapper live tests as references, but do not satisfy this ticket by passing a harness target.

## Migration Plan

1. Prepare a data_mapper-scale workspace with source/specification inputs and no
   explicit product-materialization harness target.
2. Run authority conformance to derive requirement/lineage/target pressure from
   workspace truth.
3. Invoke `evaluate_next` from target binding, catalog, policy, and consequence
   truth.
4. Invoke F_P and admit construction intent, worksite evidence, edge ledger,
   closure decision, and next-action projection.
5. Replay the decision chain and prove no gap dossier, compact output,
   postflight report, run summary, local operator special case, or harness target
   argument selected the next action.

## Closure Criteria

- A live or live-equivalent data_mapper-scale lane starts without an explicit
  product-materialization harness target.
- After authority conformance, observation derives product pressure from
  workspace/requirements truth.
- `evaluate_next` selects the next action from target binding, catalog, policy,
  and consequence truth.
- Construction intent cites the selected action and predecessor refs.
- Product ledger closure or non-close disposition derives from admitted
  evidence and replays.
- The proof shows that no gap dossier, compact output, postflight report, run
  summary, or harness target argument selected the next action.
- Replay artifacts include construction intent, worksite evidence, edge ledger,
  closure decision, and next-action projection for the decisive step.
- Target binding cites source/specification-derived pressure and published
  catalog/policy eligibility.
- The test fails if a harness target argument is provided or required for product
  materialization selection.
- No proof code path can infer product materialization from a harness target
  argument after source/specification pressure has been conformed.
- The proof includes at least one product-pressure path derived from requirement
  or transformation-set truth, not a hard-coded product target.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t141_gtl_transform_boundary.test.mjs`
- `node --test test_env/tests/test_t142_autonomous_product_materialization.test.mjs`
- `node --test test_env/tests/test_t143_product_materialization_authority_targets.test.mjs`
- Add and run a focused `test_env/tests/test_t154_no_harness_target_data_mapper_parity.test.mjs` or a narrow live-equivalent test under `test_env/live/`.
- If a sandbox lane is used, run `npm run live:data-mapper-steel-thread-sandbox` and prove no explicit harness product target selected product materialization.

## Non-Closure Conditions

- The proof depends on `asset:component_code_surface` or equivalent harness
  target input.
- Replay cannot reconstruct the decision chain.
- Product materialization is reached through local installed-operator special
  cases instead of the evaluator/ledger/decision/projection chain.
