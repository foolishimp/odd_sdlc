---
id: T-083
title: Implement shallow realization assurance ledger
type: feature
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Implement the shallow realization assurance ledger as an explicit odd_sdlc GTL graph asset and graph function so placeholder, constant-success, trace-only, and identity-only outputs cannot close a traversal.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: generated source inventory, generated test inventory, postflight evaluators, traversal satisfaction fold
priority: critical
triaged_at: 2026-04-27T16:24:29Z
created_at: 2026-04-27T16:24:29Z
updated_at: 2026-04-27T16:47:50Z
completed_at: 2026-04-27T16:47:50Z
dependencies:
  - T-066
  - T-076
  - T-074 consolidated
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
  - build_tenants/typescript/code/src/hooks/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/graph/
non_scope:
  - ABG engine changes
  - style lint as sufficient behavioral evidence
  - data_mapper-specific heuristics as framework law
---

## Triage

First missing layer: realization refactor.

Existing shallow-realization checks need to become an explicit assurance
dimension, not scattered evaluator heuristics. This ticket gives that dimension
a typed carrier and deterministic tests.

## Ledger Contract

`ShallowRealizationAssuranceLedger` evaluates whether produced artifacts are
substantive enough for the edge target.

Inputs:

- generated source inventory
- generated test inventory when authority exists
- candidate result dossier
- capability ledger output
- requirement fulfillment ledger output

Outputs:

- `satisfied`
- `open_gap`
- `blocked`
- `reprice_required`
- `not_applicable`

The ledger must preserve shallow patterns, affected files, violated edge
expectations, and required deepening instructions as typed evidence.

## Validation Tests

- rejects placeholder source
- rejects constant-success logic for non-trivial transforms
- rejects identity-only transforms when the edge requires synthesis
- rejects trace-only tests when executable proof is required
- accepts minimal but substantive code when the edge scope is minimal
- emits machine-readable reasons that can be folded by T-084

## Closure Law

This ticket closes only when shallow realization cannot pass as closure and the
ledger remains generic over product domains.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/shallow_realization.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `npm run test:t077-t083` passed
- `npm run test:t084` passed
- `npm run test:semantic` passed: 97 tests
