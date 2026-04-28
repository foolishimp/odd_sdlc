---
id: T-078
title: Implement semantic convergence assurance ledger
type: feature
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Implement the semantic convergence assurance ledger as an explicit odd_sdlc GTL graph asset and graph function so a traversal result is checked against the declared target meaning before closure.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: GTL graph-function catalog, traversal result dossier, semantic evaluator projection, traversal satisfaction fold
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
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/hooks/
non_scope:
  - ABG engine changes
  - hidden prompt-only acceptance
  - behavioral test adequacy
---

## Triage

First missing layer: realization refactor.

The target semantics already exist in requirements, design, module, edge, and
asset surfaces. This ticket creates the explicit ledger that asks whether the
candidate result means the declared thing, rather than whether it merely
produced a syntactically present artifact.

## Ledger Contract

`SemanticConvergenceAssuranceLedger` evaluates the candidate result against the
declared semantic target for the edge.

Inputs:

- graph function identity
- source asset summary
- target asset contract
- candidate result dossier
- admitted upstream requirements/design/module references
- prior materialization ledger output

Outputs:

- `satisfied`
- `open_gap`
- `blocked`
- `reprice_required`
- `not_applicable`

The ledger must preserve semantic mismatches, underspecified targets,
contradictory targets, and insufficient evidence as structured evidence.

## Validation Tests

- accepts a candidate whose declared target meaning is covered by admitted
  evidence
- rejects a candidate that only restates the target without realizing it
- classifies missing target semantics as `reprice_required`
- classifies insufficient candidate evidence as `open_gap`
- carries prior materialization defects forward instead of hiding them
- emits machine-readable reasons that can be folded by T-084

## Closure Law

This ticket closes only when semantic convergence is a typed graph-owned ledger
surface with deterministic tests and no acceptance path based on free-form
prose alone.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/semantic_convergence.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `npm run test:t077-t083` passed
- `npm run test:t084` passed
- `npm run test:semantic` passed: 97 tests
