---
id: T-080
title: Implement requirement fulfillment assurance ledger
type: feature
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Implement the requirement fulfillment assurance ledger as an explicit odd_sdlc GTL graph asset and graph function so traversal results are evaluated against admitted requirement authority before closure.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: requirement closure projection, graph-function catalog, candidate result dossier, traversal satisfaction fold
priority: critical
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
  - build_tenants/typescript/code/src/projection/
  - build_tenants/typescript/code/src/traceability/
  - build_tenants/typescript/code/src/graph/
non_scope:
  - ABG engine changes
  - requirements rewrites hidden inside implementation
  - behavioral test adequacy unless a requirement owns the test
---

## Triage

First missing layer: realization refactor.

The constitutional question for a traversal is whether the result satisfies the
authority that opened the edge. This ticket makes that question an explicit
ledger dimension.

## Ledger Contract

`RequirementFulfillmentAssuranceLedger` evaluates candidate evidence against
admitted requirement obligations.

Inputs:

- requirement references admitted for the edge
- design/module references derived from those requirements
- candidate result dossier
- traceability projection
- prior materialization and semantic ledger outputs

Outputs:

- `satisfied`
- `open_gap`
- `blocked`
- `reprice_required`
- `not_applicable`

The ledger must preserve missing requirement coverage, weak evidence,
contradictory evidence, and requirements that need repricing.

## Validation Tests

- accepts a candidate with complete typed evidence for all admitted
  requirements in scope
- rejects a candidate with missing requirement coverage
- rejects a candidate whose evidence references a requirement outside the edge
  authority
- classifies ambiguous or contradictory requirement authority as
  `reprice_required`
- classifies missing traceability basis as `blocked`
- emits machine-readable reasons that can be folded by T-084

## Closure Law

This ticket closes only when requirement satisfaction is computed as a typed
ledger surface and cannot be inferred from artifact existence alone.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/requirement_fulfillment.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `npm run test:t077-t083` passed
- `npm run test:t084` passed
- `npm run test:semantic` passed: 97 tests
