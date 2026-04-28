---
id: T-082
title: Implement capability assurance ledger
type: feature
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Implement the capability assurance ledger as an explicit odd_sdlc GTL graph asset and graph function so generated product behavior is checked against the required capability inventory.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: capability inventory, generated source inventory, graph-function catalog, traversal satisfaction fold, data_mapper qualification
priority: critical
triaged_at: 2026-04-27T16:24:29Z
created_at: 2026-04-27T16:24:29Z
updated_at: 2026-04-27T16:47:50Z
completed_at: 2026-04-27T16:47:50Z
dependencies:
  - T-066
  - T-076
  - T-072 consolidated
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
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/graph/
non_scope:
  - ABG engine changes
  - hard-coding data_mapper-specific capability names as framework law
  - equating file count with capability depth
---

## Triage

First missing layer: realization refactor.

Test35 succeeded because repeated traversals produced a domain-shaped
capability set, not because a single artifact existed. This ticket implements
the generic ledger that evaluates capability coverage without baking
data_mapper-specific code into the framework.

## Ledger Contract

`CapabilityAssuranceLedger` evaluates generated product source and evidence
against an admitted capability inventory.

Inputs:

- derived capability inventory
- generated source inventory
- generated test inventory when authority exists
- candidate result dossier
- prior requirement and semantic ledger outputs

Outputs:

- `satisfied`
- `open_gap`
- `blocked`
- `reprice_required`
- `not_applicable`

The ledger must preserve missing capabilities, weak implementations, unused
declared capabilities, and evidence references.

## Validation Tests

- accepts a generated source inventory that covers all required capabilities
- rejects a generated source inventory with missing required capabilities
- rejects placeholder or identity-only code as capability evidence
- classifies missing capability inventory as `blocked`
- classifies contradictory capability authority as `reprice_required`
- emits machine-readable reasons that can be folded by T-084

## Closure Law

This ticket closes only when capability coverage is evaluated by typed generic
ledger logic and data_mapper qualification can use it without data_mapper
special-case control flow.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/capability.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs`
- `npm run test:t077-t083` passed
- `npm run test:t084` passed
- `npm run test:semantic` passed: 97 tests
