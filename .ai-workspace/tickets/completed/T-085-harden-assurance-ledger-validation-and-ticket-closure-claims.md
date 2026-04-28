---
id: T-085
title: Harden assurance ledger validation and ticket closure claims
type: bug
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Align the completed assurance-ledger ticket claims with executable proof by either implementing the listed validation obligations or explicitly repricing/deferring obligations that exceed the current first-slice ledger design.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: assurance ledgers, graph-function catalog proof, traversal satisfaction fold, T-066/T-076 RC proof chain
priority: critical
triaged_at: 2026-04-27T16:59:41Z
created_at: 2026-04-27T16:59:41Z
updated_at: 2026-04-27T17:42:23Z
completed_at: 2026-04-27T17:15:07Z
dependencies:
  - T-076
  - T-077 completed
  - T-078 completed
  - T-079 completed
  - T-080 completed
  - T-081 completed
  - T-082 completed
  - T-083 completed
  - T-084 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: STDO audit `20260427T165941Z_AUDIT_assurance_ledger_wave_against_stdo.md`
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
active_module_refs:
  - build_tenants/typescript/code/src/assurance/
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs
  - build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs
target_truth: Assurance ledgers used as RC proof have executable validation coverage matching their ticket contracts, or their ticket contracts explicitly defer unimplemented deeper evaluator dimensions into active follow-up tickets.
superseded_truth: A completed ticket plus one representative unit test is sufficient proof for all validation bullets listed in the ticket.
closure_law: this ticket closes only when every T-077 through T-084 validation claim is either backed by executable tests and implementation or explicitly reclassified as residual scope, and T-066/T-076 no longer cite first-slice ledger proof as deeper data_mapper RC assurance.
non_scope:
  - ABG engine changes
  - product-local retry runner loops
  - full data_mapper RC qualification run
---

## STDO Triage

First missing layer: realization refactor.

The requirements and design authority already exist for typed assurance ledgers,
the total transition fold, and ABG-owned traversal truth. The current defect is
that completed ticket closure claims exceed the realized code/test proof in
several ledger dimensions.

## Required Work

1. Review the validation sections of T-077 through T-084 against actual code and
   tests.
2. Add missing deterministic tests for each validation bullet that remains in
   scope.
3. Extend prime ledger modules only where the missing test requires new typed
   input or verdict logic.
4. If a validation bullet is intentionally deferred to T-066 or another active
   RC ticket, record that as residual scope rather than leaving it implied by a
   completed ticket.
5. Strengthen T-030 so every assurance graph function in the reusable catalog is
   directly asserted in the GTL module publication.

## Known Gaps To Resolve

- T-079: blocked and reprice obligation states are claimed but not represented
  by the current obligation-carry logic.
- T-080: outside-edge requirement evidence and ambiguous/contradictory
  requirement authority are claimed but not represented by the current
  requirement-fulfillment input model.
- T-081: missing required evidence versus incomplete repairable ambiguity is
  claimed but not represented by the current ambiguity finding model.
- T-082: contradictory capability authority and placeholder/identity code as
  capability evidence are claimed but not represented by the current capability
  ledger.
- T-030: module publication proof should directly assert every assurance graph
  function, not only catalog membership plus representative module entries.

## Validation Tests

- T-077 through T-084 test coverage maps one-to-one to each retained validation
  claim.
- T-030 directly proves every assurance graph function is materialized in
  `constructSdlcGtlModule()`.
- `npm run test:t030` passes.
- `npm run test:t077-t083` passes.
- `npm run test:t084` passes.
- `npm run test:semantic` passes.
- `npm run lint:semantic` passes.

## Completion Evidence

- `build_tenants/typescript/code/src/assurance/shared.ts` now applies blocked
  precedence before repricing inside shared verdict derivation.
- `build_tenants/typescript/code/src/assurance/obligation_carry.ts` now admits
  expected prior dossiers, omitted handoff obligations, contradictory
  obligations, and stale/unactionable reprice obligations.
- `build_tenants/typescript/code/src/assurance/requirement_fulfillment.ts` now
  admits edge-authority scope and ambiguous/contradictory requirement authority.
- `build_tenants/typescript/code/src/assurance/ambiguity.ts` now distinguishes
  blocked, repairable, and reprice ambiguity findings.
- `build_tenants/typescript/code/src/assurance/capability.ts` now distinguishes
  capability evidence quality and contradictory capability authority.
- `build_tenants/typescript/test_env/tests/test_t077_t083_assurance_ledgers.test.mjs`
  now carries 14 tests covering the retained T-077 through T-083 validation
  claims.
- `build_tenants/typescript/test_env/tests/test_t030_graph_catalog_module.test.mjs`
  directly asserts every assurance graph function exists in the GTL module.
- `npm run test:t030` passed: 7 tests.
- `npm run test:t076` passed: 1 test.
- `npm run test:t077-t083` passed: 14 tests.
- `npm run test:t084` passed: 8 tests.
- `npm run test:semantic` passed: 104 tests.
- `npm run lint:semantic` passed.

## Post-Review Addendum

Claude review
`.ai-workspace/comments/claude/20260427T230000Z_REVIEW_active-tickets-and-assurance-ledger-wave.md`
correctly separated carrier-level assurance proof from traversal-level wiring.

T-085 remains closed for carrier/fold validation. The traversal wiring is owned
by active ticket `T-066`, not by this completed carrier-hardening ticket.

Additional hardening after the review:

- `test_t030_graph_catalog_module.test.mjs` now fetches every reusable graph
  function from `constructSdlcGtlModule()` and asserts its inputs/outputs match
  the reusable catalog entry, not only name membership.
- `T-066` now owns and implements the first integration slice through
  `ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md` and
  `code/src/operator/assurance_gate.ts`.

Additional verification:

- `npm run test:t030` passed: 8 tests.
- `npm run test:semantic` passed: 109 tests.
