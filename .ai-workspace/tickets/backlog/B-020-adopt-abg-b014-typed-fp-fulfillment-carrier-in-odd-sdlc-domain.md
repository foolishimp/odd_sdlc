# B-020 Finish odd_sdlc Domain Adoption Of The ABG Fulfillment Carrier

- id: B-020
- title: Remove mixed fulfillment truth by migrating the remaining early authoring edges off evaluator-shaped static ledgers
- type: bug
- status: backlog
- goal: fulfillment-carrier-adoption
- change_intent: Complete odd_sdlc-side adoption of the ABG fulfillment carrier so the graph stops mixing evaluator-shaped static ledgers with domain-declared requirement ledgers.
- change_class: realization_refactor
- re_entry_point: realized_surface
- priority: high
- dependencies: abiogenesis B-013 completed; abiogenesis B-014 completed; odd_sdlc B-019 active
- intake_source: `data_mapper.test35` forensic analysis 2026-04-19; the archived ledger set proved the graph was still split between `static_obligations` and `adapter_driven`
- affected_boundary: odd_sdlc GTL graph-function declarations, remaining evaluator-fallback obligation topology, F_P manifest obligation identity, domain ledger adoption on early authoring edges
- triaged_at: 2026-04-18
- created_at: 2026-04-18
- updated_at: 2026-04-19

## Scope Correction

This ticket originally assumed the main remaining problem was ABG-side manifest
population from evaluator-derived obligations.

That is no longer the operative truth.

ABIogenesis now carries both lawful declaration families. The remaining defect
is odd_sdlc-local: the graph still publishes two fulfillment-truth models at
once.

## Context

`data_mapper.test35` archived both of these simultaneously:

1. early authoring edges on static evaluator-shaped ledgers:
   - `derive_feature_decomp_surface`
   - `derive_uat_testcases_surface`
   - `derive_design_surface`
   - `derive_scenario_surface`

2. later realization/release edges on adapter-driven requirement ledgers:
   - `qualify_testcase_authority`
   - `derive_implementation_design_surface`
   - `derive_implementation_module_surface`
   - `derive_code_surface`
   - `derive_test_design_surface`
   - `derive_test_module_surface`
   - `derive_test_run_archive_surface`
   - `prepare_release_surface`

That mixed state violates the one-truth rule for fulfillment closure.

The problem is no longer “ABG cannot carry domain-ledger truth.” The problem is
“odd_sdlc still publishes two fulfillment-truth models in one graph.”

## Bug Statement

The remaining early authoring edges do not declare domain obligation topology.
They fall back through `_declared_fp_evaluator_obligation_ledger(...)`, which
synthesizes one static obligation from the F_P evaluator name.

The later edges already declare requirement-ledger truth via
`_requirement_edge_obligation_ledger(...)`.

So the graph still mixes:

- `static_obligations`
- `adapter_driven`

for constructive fulfillment truth.

## Required Direction

1. Add domain `obligation_ledger` declarations to the remaining early
   authoring edges
2. Remove the expectation that evaluator-shaped static fallback is an accepted
   long-term odd_sdlc closure model
3. Prove that the same graph no longer publishes both:
   - `static_obligations`
   - `adapter_driven`
   for comparable constructive fulfillment lanes
4. Keep ABG carrier code domain-blind; this ticket is odd_sdlc-side graph
   truth, not a new ABG carrier change

## Acceptance

- the remaining early authoring edges publish domain-declared obligation
  ledgers
- `data_mapper.test35`-class workspaces no longer show a mixed static-vs-domain
  fulfillment carrier split across the graph
- fulfillment closure truth in odd_sdlc is graph-wide and singular

## Links

- fallback static ledger helper:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py`
- migrated later edges:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py`
- ABG carrier tickets:
  `abiogenesis B-013`, `B-014`, `B-015`
