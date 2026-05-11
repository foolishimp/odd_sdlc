---
id: T-146
title: Assurance carrier predecessor refs and closed F_D class
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: extend_existing_assurance_carriers_and_gates
governing_library: odd_sdlc TypeScript assurance carriers, assurance gates, and ODD_METHOD A1a/A1b/A13/A13a
status: backlog
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Make assurance verdicts replayable from causal predecessor refs and prevent deterministic assurance checks from becoming open-ended F_D semantic gates.
change_class: design_reframe
re_entry_point: design
priority: high
execution_phase: axiomatic_setting
execution_order: 6
execution_order_reason: Sets assurance attention and closed F_D law after identity and target authority exist.
triaged_at: 2026-05-11
created_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: evolves_old_with_new_closed_fd_class
authority_ruling:
  - assurance_ledgers_evolve_existing_dimension_ledgers
  - closed_fd_mechanics_class_is_new_design_law
  - assurance_status_may_feed_closure_decision_but_must_not_route_directly
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-077 through T-084 assurance ledger family
  - T-109 traversal consequence ledger/decision/evaluator split
  - T-144 repairable assurance and tenant grammar boundary cleanup
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/code/src/assurance/carriers.ts
  - build_tenants/typescript/code/src/assurance/
  - build_tenants/typescript/code/src/operator/assurance_gate.ts
  - build_tenants/typescript/test_env/tests/
---

# T-146: Assurance Carrier Predecessor Refs And Closed F_D Class

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

The May 9 test35 breakdown made the ledger/decision chain the only closure
route. The May 11 strategy adds ODD A1a/A1b pressure: evaluators may attend only
to admitted ledger rows reachable through lineage and predecessor refs.

Assurance ledgers currently carry dimensions, verdicts, reasons, evidence refs,
and carried obligations, but not a complete causal predecessor chain for what
they judge.

## Target Truth

Every governing assurance verdict carries predecessor refs to the admitted facts
it judges. F_D mechanics are a closed class: carrier shape, ref resolution, path
containment, file existence, digest or byte-count validation,
replay/predecessor completeness, declared deterministic validator result, and
required evidence presence.

Semantic fulfillment remains admitted F_P/evaluator work over ledger state, not
an ad hoc deterministic judgment.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This changes the design contract of
  assurance carriers and deterministic assurance gates.
- Ledger ruling: `evolves old`. `SdlcAssuranceLedger` remains the dimension
  ledger family. It is not replaced by `SdlcEdgeFulfillmentLedger`.
- New design-law ruling: the closed F_D mechanics class is new and must be named
  or carried explicitly wherever deterministic assurance is used.
- Authority boundary: assurance verdicts may feed `SdlcEdgeClosureDecision`.
  They may not independently select retry, repair, re-entry, reprice, block, or
  next graph work.
- Attention rule: an assurance evaluator may judge only admitted facts reachable
  through predecessor refs, evidence refs, target binding, policy, and event-log
  cursor.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A1a/A1b and A13/A13a
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Extend `build_tenants/typescript/code/src/assurance/carriers.ts` and constructors.
- Update folds in `build_tenants/typescript/code/src/assurance/fold.ts` only as inputs to closure, not direct routing.
- Propagate refs through `build_tenants/typescript/code/src/assurance/materialization.ts`, `semantic_convergence.ts`, `component_depth.ts`, and any capability assurance file.
- Check gate admission in `build_tenants/typescript/code/src/operator/assurance_gate.ts`.

## Migration Plan

1. Add predecessor refs to `SdlcAssuranceLedgerReason`,
   `SdlcAssuranceLedger`, and their input/constructor paths.
2. Propagate predecessor refs from materialization, semantic convergence,
   component depth, capability, and gate-level evidence.
3. Add one named closed F_D mechanics class or carrier ref and require each
   deterministic assurance check to cite it.
4. Fail closed when a governing assurance verdict lacks predecessor refs.
5. Keep semantic fulfillment as admitted F_P/evaluator output over ledger state;
   deterministic checks may validate carrier mechanics and evidence presence
   only.

## Closure Criteria

- `SdlcAssuranceLedger` and relevant assurance reasons carry predecessor refs.
- Assurance admission fails closed when a governing verdict lacks predecessor
  refs.
- F_D-class checks cite one closed mechanics class.
- Per-obligation semantic outcomes are recorded as admitted F_P/evaluator facts;
  F_D aggregation counts, validates refs, and checks required evidence without
  rejudging semantic content.
- Tests cover assurance gate, component depth, and semantic convergence
  predecessor refs and closed F_D classification.
- Existing assurance fold status remains an input to closure decision derivation,
  not a direct runner action source.
- Tests include one missing-predecessor governing verdict and prove it cannot be
  accepted as closure authority.
- Tests include one semantic convergence case proving deterministic mechanics do
  not rejudge semantic fulfillment outside admitted evaluator facts.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `node --test test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `node --test test_env/tests/test_b086_fd_disambiguation_sweep.test.mjs`
- Add and run a focused `test_env/tests/test_t146_assurance_predecessor_refs.test.mjs`.

## Non-Closure Conditions

- Assurance verdicts can still recover meaning through ambient joins.
- A deterministic helper can become a new F_D semantic gate without citing a
  closed mechanics class.
- Tests only assert verdict strings and do not prove replay reachability through
  predecessor refs.
