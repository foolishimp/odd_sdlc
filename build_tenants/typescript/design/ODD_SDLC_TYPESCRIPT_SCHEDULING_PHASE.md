# ODD SDLC TypeScript Scheduling Phase

**Status**: Active
**Ticket**: `T-093`
**Implements**: `REQ-F-ODDSDLC-057`, `REQ-F-ODDSDLC-059`,
`REQ-F-ODDSDLC-060`
**Derives From**:
- `specification/PRODUCT.md`
- `specification/requirements/15-odd-sdlc-scheduling-phase.md`
- `.ai-workspace/comments/codex/20260428T224944Z_STRATEGY_managed_traversal_architecture_current_state_and_path.md`

## Design Claim

The TypeScript executive graph carries schedule/work-plan rows inside composite
implementation and test design carriers before materialization and execution
edges.

```text
implementation_design_surface
  -> derive_component_code_surface
  -> qualify_component_realization_surface
  -> derive_code_surface
  -> code_surface

test_design_surface
  -> derive_component_test_surface
  -> prepare_test_execution_surface
  -> derive_test_execution_result_surface
  -> derive_test_run_archive_surface
  -> test_run_archive_surface
```

The schedule is graph state. It is not a ticket, not a manual checklist, and
not an operator-local loop.

## Module Boundary

Scheduling belongs to the `odd_sdlc` domain graph because it names the planned
work packages and dependency order for a software-domain traversal.

ABG remains responsible for runtime truth, vector closure, retry, and replay.
The schedule does not select the next vector outside ABG.

## Carrier Content

Schedule rows may represent:

- planned work packages
- dependency order
- module dependency graph
- realization and qualification tranches
- tranche obligation ledger
- tranche gap ledger
- next-tranche selector
- phase gates
- expected output surfaces
- worker lanes
- acceptance and evidence checkpoints
- current open, done, and blocked state
- same-edge re-entry conditions

## Graph Integration

`derive_implementation_design_surface` carries implementation work-plan rows
before component code and code aggregation. `derive_component_code_surface`,
`qualify_component_realization_surface`, and `derive_code_surface` consume the
composite implementation design carrier.

`derive_test_design_surface` carries test execution schedule rows before
component tests, command execution, qualification, and the run archive.

The hook contract catalog derives the new contracts from the graph catalog and
the declared target policies. Worker handoff manifests therefore cite the
composite design carrier through `inputAssetTypes` and traversal obligations.

## Local Optimization

This slice publishes schedule rows as typed carrier content and requires them
to name dependency graphs and tranche ledgers when the implementation,
test, or evidence graph is decomposable. It does not introduce a hidden
imperative execution planner.

Prompt-bearing worker handoffs carry two pressure forms:

- complete archived authority in `handoff_manifest.json` and
  `traversal_intent_package.json`
- compact prompt pressure projection containing authority index, tranche keys,
  targeted inline obligations, and retrieval hints

The compact prompt projection is not a second authority source. It keeps large
outside builds from turning every edge into one giant prompt while preserving
complete audit truth by reference.

## Global Optimization

The schedule surfaces are the product-side expression of managed traversal
prestep planning for prompt-bearing edges:

```text
prestep: graph-owned schedule/work-plan asset
execute: F_P worker handoff over the selected edge
postprocess: postflight + assurance ledgers + satisfaction fold
```

This keeps the data_mapper/test35 lesson in the graph while avoiding a Python
controller shape.

## Prompt Pressure Projection

The worker prompt shall not be the only authority carrier. It shall point to
the full handoff manifest and traversal intent package, then inline only the
local pressure needed to start the edge:

- authority index entries with digest-backed refs
- tranche keys derived from source assets, target asset, declared modules, and
  schedule/tranche roles
- compact obligation summaries for target, evaluator, source/module, prior-gap,
  and bounded requirement obligations
- retrieval hints that map authority refs back to obligation ids

The worker may open referenced authority documents when the local slice is
insufficient. The evaluator still judges the worker report against the complete
manifest obligation context.
