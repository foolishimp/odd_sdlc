---
id: T-030
title: Publish TypeScript GTL function catalog and executive programs
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Implement the TypeScript graph-function catalog, GTL module publication, jobs, target graph functions, and executive programs over the typed SDLC carriers.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: build_tenants/typescript graph publication, function catalog, program catalog, GTL module, jobs
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-029 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Python `function_catalog.py`, `program_catalog.py`, `gtl_module.py`, current `bootstrap_release_self_test`, and `release_operational_cycle`
target_truth: SDLC.TS publishes graph functions as the primary program surface, with explicit nodes, vectors, compute-basis declarations, jobs, and executive carriers.
superseded_truth: SDLC programs are hidden service methods or CLI branches that only project as graph functions after execution.
closure_law: this ticket closes when the TS module publishes the retained bootstrap-to-release graph, software-domain operational graph functions, and at least one executive program addressable through a job.
evaluation_criteria:
  - graph-function catalog is machine-readable and typed
  - graph functions include declared inputs, outputs, environment, vectors, tags, and proof obligations
  - executive program includes the retained bootstrap-to-release subset
  - jobs bind only published graph functions
  - tests materialize the graph functions through ABIogenesis GTL carriers
proof_surface:
  - graph/module code
  - catalog tests
  - materialization tests
  - negative tests for unpublished job targets
non_closure_conditions:
  - imperative service methods are the only executable program surface
  - graph-function typed surfaces replace source publication truth
  - query projections are used as module authority
---

## STDO Reading

This ticket creates the SDLC.TS programs before public execution.

## Closure Evidence

Completed on 2026-04-26.

Changed realization and proof surfaces:

- `build_tenants/typescript/code/src/graph/catalog.ts`
- `build_tenants/typescript/code/src/graph/module.ts`
- `build_tenants/typescript/code/src/graph/index.ts`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/test_env/test_surface_map.md`
- `build_tenants/typescript/test_env/tests/test_t030_graph_catalog_module.test.mjs`

Result:

The TypeScript tenant publishes the retained bootstrap-to-release function
catalog, operational function catalog, two executive graph functions, and
module jobs bound to published graph functions. Executive graph functions are
ABI-admitted inline GTL graphs over published leaf vectors; the operational
cycle is represented as a DAG-shaped carrier with external release/archive
inputs rather than a hidden controller loop.

Verification:

```text
npm run test:t030
npm run test:semantic
npm run lint:semantic
git diff --check
```

STDO review:

- `S`: graph publication derives from active software-domain and operational
  transition requirements.
- `T`: ticket closes with catalog, module, materialization, and negative job
  target proof.
- `D`: graph-function catalog and module publication are realized before public
  start or workspace mutation.
- `O`: graph functions are the primary program surface and ABG/GTL carriers
  remain the publication authority.
