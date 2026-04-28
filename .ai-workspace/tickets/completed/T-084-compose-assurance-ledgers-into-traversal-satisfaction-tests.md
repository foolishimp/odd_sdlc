---
id: T-084
title: Compose assurance ledgers into traversal satisfaction tests
type: feature
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Compose the assurance ledger dimensions into a deterministic TraversalRequirementSatisfaction fold and executable tests so T-076 receives typed closure, retry, blocked, or reprice truth instead of archive-only prose.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: GTL graph-function catalog, assurance ledger assets, traversal satisfaction fold, total transition input, data_mapper qualification
priority: critical
triaged_at: 2026-04-27T16:24:29Z
created_at: 2026-04-27T16:24:29Z
updated_at: 2026-04-27T16:47:50Z
completed_at: 2026-04-27T16:47:50Z
dependencies:
  - T-077
  - T-078
  - T-079
  - T-080
  - T-081
  - T-082
  - T-083
  - T-066
  - T-076
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_RECURSIVE_REALIZATION_DEEPENING.md
active_module_refs:
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/projection/
non_scope:
  - ABG engine changes
  - odd_sdlc-local runner loops
  - collapsing all assurance into one monolithic evaluator
---

## Triage

First missing layer: realization refactor.

The active total transition design remains correct. This ticket builds the
typed satisfaction input that lets that design make deterministic decisions
from a set of graph-owned assurance ledgers.

## Composition Contract

The fold is a total function:

```text
LedgerSet -> TraversalRequirementSatisfaction
State x TraversalRequirementSatisfaction -> TransitionResult
```

The fold must preserve every dimension verdict and compute a deterministic
summary:

- `close_allowed`
- `retry_same_edge`
- `blocked`
- `reprice_required`
- `not_applicable`

Precedence:

1. `blocked` dominates closure.
2. `reprice_required` dominates retry.
3. `open_gap` produces same-edge retry or lawful repair pressure.
4. all required ledgers `satisfied` or `not_applicable` allow closure.

## Validation Tests

Create executable tests that validate the compound build shape:

- each ledger verdict kind is accepted by the fold
- one blocked ledger prevents closure
- one reprice ledger produces reprice, even when other ledgers pass
- one open-gap ledger produces retry or repair pressure
- all required ledgers satisfied allows closure
- not-applicable ledgers do not hide required failed ledgers
- prior obligation carry evidence is included in the retry handoff
- fold output is consumed by the T-076 total transition test path
- no fold path calls ABG internals or requires an ABG code change

Current executable proof:

- `build_tenants/typescript/code/src/assurance/carriers.ts`
- `build_tenants/typescript/code/src/assurance/fold.ts`
- `build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `npm run test:t084` passed: 7 tests

## Closure Law

This ticket closes only when ledger composition is executable, deterministic,
covered by tests, and integrated into the T-076 state-machine proof path. The
result must support building the assurance stack incrementally without a
monolithic evaluator.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/carriers.ts`
- `build_tenants/typescript/code/src/assurance/fold.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t076_deterministic_traversal_state_machine.test.mjs`
- `npm run test:t084` passed: 8 tests
- `npm run test:t076` passed
- `npm run test:semantic` passed: 97 tests
