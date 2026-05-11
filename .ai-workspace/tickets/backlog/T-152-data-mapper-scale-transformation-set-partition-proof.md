---
id: T-152
title: data_mapper-scale transformation-set partition proof
type: feature
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: extend_existing_requirement_transform_boundary_and_product_pressure_carriers
governing_library: odd_sdlc TypeScript requirement closure, transformation-set pressure, product materialization binding, and data_mapper parity lane
status: backlog
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Prove that requirements, design, topology, and schedules can close locally while remaining downstream transformation pressure for product materialization at data_mapper scale.
change_class: design_reframe
re_entry_point: design
priority: high
execution_phase: scale_proof
execution_order: 8
execution_order_reason: Proves downstream transformation-set partition after identity, target, and runner authority are lawful.
triaged_at: 2026-05-11
created_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: evolves_old
authority_ruling:
  - downstream_transformation_set_partition_evolves_existing_edge_ledger
  - no_new_transformation_set_ledger_without_replacing_existing_chain
  - product_materialization_consumes_downstream_pressure_through_target_binding
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-141 requirement-to-product transform boundary
  - T-142 autonomous product materialization from consequence chain
  - T-148 collision-safe local requirement authority refs
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/code/src/projection/requirement_closure.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
---

# T-152: data_mapper-Scale Transformation-Set Partition Proof

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

The May 9 source document states the model:

```text
A -> B(requirements, design, topology, schedules)
B.workspace -> traverse.F_P -> C(product files)
```

Some B assets are not merely documents to close for their own edge. They are the
transformation set for C.

## Target Truth

`edge_local` obligations gate the current edge. `downstream_transformation_set`
obligations carry visible pressure into product materialization without falsely
blocking the requirement/design/topology edge that produced them.

This must hold beyond the single-tenant hello-world slice.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This proves and tightens the existing
  obligation-carry model across data_mapper-scale source material.
- Ledger ruling: `evolves old`. The current edge fulfillment assessment/count
  model already has `edge_local` and `downstream_transformation_set`; this ticket
  proves and hardens that carrier.
- No-fork rule: do not introduce a separate transformation-set ledger unless it
  replaces the current edge-ledger downstream refs.
- Authority boundary: local requirement/design/topology closure may pass while
  downstream product pressure remains visible and actionable.
- Product route rule: product materialization consumes downstream pressure
  through target binding and catalog/policy selection, not harness target
  arguments or broad graph fallback.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A1a/A1b and A2
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Use `build_tenants/typescript/code/src/operator/traversal_consequence.ts` for `edge_local` vs `downstream_transformation_set` assessment/count behavior.
- Use `build_tenants/typescript/code/src/projection/requirement_closure.ts` for local closure and carried pressure rows.
- Use `build_tenants/typescript/code/src/projection/query_domain.ts` for target binding and public projections.
- Check product materialization route in `build_tenants/typescript/code/src/operator/installed_operator.ts`.

## Migration Plan

1. Build data_mapper-scale fixture or live-equivalent source material with more
   than one requirement and product file family.
2. Classify obligations as `edge_local` or `downstream_transformation_set` in
   edge fulfillment assessment input.
3. Ensure local closure counts exclude downstream-only obligations while
   preserving downstream pressure refs and target binding refs.
4. Feed downstream pressure into product materialization target binding.
5. Add replay assertions proving downstream pressure survives local edge closure
   and is consumed by the next lawful materialization action.

## Closure Criteria

- Requirement/design/topology/schedule rows can close local obligations while
  emitting downstream product pressure.
- Product materialization consumes downstream transformation-set pressure through
  target binding, not broad graph fallback.
- data_mapper-scale fixtures or live-equivalent lanes prove the partition over
  more than one requirement/file family.
- Tests prove downstream pressure remains visible and actionable after local
  edge closure.
- Edge fulfillment counts prove downstream obligations do not falsely block the
  producing edge.
- Downstream pressure refs and downstream target binding refs are present in the
  edge ledger for product-relevant obligations.
- Product materialization selection cites downstream pressure and target binding,
  not a harness target argument.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t141_gtl_transform_boundary.test.mjs`
- `node --test test_env/tests/test_t142_autonomous_product_materialization.test.mjs`
- `node --test test_env/tests/test_t143_product_materialization_authority_targets.test.mjs`
- Add and run a focused `test_env/tests/test_t152_data_mapper_transformation_set_partition.test.mjs`.
- If using the sandbox proof lane, run `npm run live:data-mapper-steel-thread-sandbox`.

## Non-Closure Conditions

- Requirement edges fail because downstream product files are still missing
  after the requirement edge produced its transformation set.
- Requirement edges close by suppressing downstream product pressure.
- Product materialization is selected from harness target arguments instead of
  downstream transformation-set pressure.
