---
id: T-081
title: Implement ambiguity assurance ledger
type: feature
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Implement the ambiguity assurance ledger as an explicit odd_sdlc GTL graph asset and graph function so uncertainty in authority, target meaning, evidence, or transition state becomes typed traversal truth.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: GTL graph-function catalog, gap dossier, repricing route, total transition input, installed operator proof
priority: high
triaged_at: 2026-04-27T16:24:29Z
created_at: 2026-04-27T16:24:29Z
updated_at: 2026-04-27T16:47:50Z
completed_at: 2026-04-27T16:47:50Z
dependencies:
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
active_module_refs:
  - build_tenants/typescript/code/src/triage/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/graph/
non_scope:
  - ABG engine changes
  - treating ambiguity as stochastic excuse
  - prompt-only interpretation
---

## Triage

First missing layer: realization refactor.

Ambiguity is allowed as data, not as an implicit control branch. This ticket
implements ambiguity detection as a typed ledger dimension consumed by the
total transition function.

## Ledger Contract

`AmbiguityAssuranceLedger` evaluates whether the traversal has enough authority
and evidence to make the next deterministic transition.

Inputs:

- start intent
- edge traversal contract
- admitted authority references
- candidate result dossier
- prior ledger outputs
- postflight/evaluator findings

Outputs:

- `satisfied`
- `open_gap`
- `blocked`
- `reprice_required`
- `not_applicable`

The ledger must preserve ambiguity kind, affected authority layer, available
evidence, missing evidence, and recommended lawful re-entry point.

## Validation Tests

- classifies unclear target asset identity as `reprice_required`
- classifies missing required evidence as `blocked`
- classifies incomplete but repairable evidence as `open_gap`
- accepts an unambiguous traversal basis as `satisfied`
- preserves the smallest lawful re-entry point when repricing is required
- emits machine-readable reasons that can be folded by T-084

## Closure Law

This ticket closes only when ambiguity has no hidden branch in operator code:
it is emitted as ledger state and folded deterministically.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/ambiguity.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `npm run test:t077-t083` passed
- `npm run test:t084` passed
- `npm run test:semantic` passed: 97 tests
