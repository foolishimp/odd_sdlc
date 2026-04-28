---
id: T-079
title: Implement obligation carry assurance ledger
type: feature
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Implement the obligation carry assurance ledger as an explicit odd_sdlc GTL graph asset and graph function so unresolved obligations, prior gaps, and retry reasons remain visible across same-edge re-entry.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: GTL graph-function catalog, gap dossier, continuation evidence, same-edge re-entry handoff, traversal satisfaction fold
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
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_RECURSIVE_REALIZATION_DEEPENING.md
active_module_refs:
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/projection/
non_scope:
  - ABG engine changes
  - a local odd_sdlc retry loop
  - operator prose as state
---

## Triage

First missing layer: realization refactor.

T-076 owns the total transition function. This ticket owns one input dimension
to that function: what unresolved obligations must be carried into the next
attempt.

## Ledger Contract

`ObligationCarryAssuranceLedger` evaluates whether prior unresolved obligations
were preserved, addressed, or lawfully repriced.

Inputs:

- prior gap dossier
- prior ledger set
- current worker handoff manifest
- current candidate result dossier
- current postflight/evaluator findings
- continuation or retry basis

Outputs:

- `satisfied`
- `open_gap`
- `blocked`
- `reprice_required`
- `not_applicable`

The ledger must preserve which obligations were newly opened, carried forward,
closed with evidence, or dropped without authority.

## Validation Tests

- rejects a retry result that omits prior blocking reasons from the handoff
- rejects a candidate that drops an obligation without closure evidence
- accepts an obligation closed by typed evidence from the current attempt
- classifies contradictory obligation state as `blocked`
- classifies stale or unactionable obligations as `reprice_required`
- emits machine-readable reasons that can be folded by T-084

## Closure Law

This ticket closes only when same-edge re-entry receives prior state and prior
gap pressure as typed data, and tests prove that dropped obligations cannot
silently become closure.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/obligation_carry.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t076_deterministic_traversal_state_machine.test.mjs`
- `npm run test:t077-t083` passed
- `npm run test:t076` passed
- `npm run test:semantic` passed: 97 tests
