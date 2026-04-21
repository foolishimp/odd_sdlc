# B-020 Finish odd_sdlc Domain Adoption Of The ABG Fulfillment Carrier

- id: B-020
- title: Remove mixed fulfillment truth by migrating the remaining early authoring edges off evaluator-shaped static ledgers
- type: bug
- status: completed
- goal: fulfillment-carrier-adoption
- change_intent: Complete odd_sdlc-side adoption of the ABG fulfillment carrier so the graph stops mixing evaluator-shaped static ledgers with domain-declared requirement ledgers on the in-scope requirement-bearing early authoring chain.
- change_class: realization_refactor
- re_entry_point: realized_surface
- priority: high
- dependencies: odd_sdlc B-019 active; abiogenesis B-013 completed; abiogenesis B-014 completed; abiogenesis B-015 completed
- intake_source: fulfillment-lane forensic analysis on 2026-04-19; archived ledgers proved the graph was still split between `static_obligations` and `adapter_driven`
- affected_boundary: odd_sdlc GTL graph-function declarations, remaining evaluator-fallback obligation topology, F_P manifest obligation identity, domain ledger adoption on early authoring edges
- triaged_at: 2026-04-18
- created_at: 2026-04-18
- updated_at: 2026-04-19

## Completion

This ticket is closed.

The in-scope requirement-bearing early authoring lanes now publish declared
requirement obligation ledgers instead of evaluator-shaped static fallback:

- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`
- `derive_design_surface`
- `derive_scenario_surface`

The migrated declarations are live in:

- `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py`

and direct proof exists in:

- `odd_sdlc/build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py`

## Scope Boundary

This closure does **not** imply every static obligation lane in the graph is
gone.

Out-of-scope static lanes remain explicitly classified as:

- bootstrap constitutional-authoring lanes
- selector lanes
- operational preparation / result lanes

Those are separate repricing questions, not evidence that this in-scope early
authoring migration failed to land.

## Why It Closed

The original defect was a one-truth violation across comparable
requirement-bearing constructive lanes. That defect is resolved for the lanes in
scope here:

- early authoring requirement-bearing lanes now use the same domain-declared
  ledger family as the later realization/release chain
- the graph no longer mixes evaluator-shaped fallback and requirement-ledger
  truth across those comparable lanes
