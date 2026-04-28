---
id: T-056
title: Realize TypeScript ingress-project library slice
type: task
ticket_category: refactor
status: completed
goal: govern-bootstrap-ingress-through-reusable-graph-functions
change_intent: Implement the T-049 ingress graph-function slice so broad project bootstrap input is represented as `Fg_ingress_project` rather than source-local imperative normalization.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: TypeScript graph catalog, workspace ingress, project profile, lineage, ambiguity, sandbox tests
priority: high
triaged_at: 2026-04-27
created_at: 2026-04-27
completed_at: 2026-04-26T16:52:14Z
dependencies:
  - T-049 completed
  - T-055 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md`
target_truth: odd_sdlc.TS publishes `Fg_ingress_project` as the reusable graph-function form for projecting unstructured, loosely structured, or structured bootstrap input into a conformant `Project` typed entity with lineage, ambiguity, and gap evidence.
superseded_truth: Workspace ingress and bootstrap normalization can remain a product-local TypeScript workflow without a graph-function program carrier.
closure_law: This ticket closes when `Fg_ingress_project` is published in the graph-function library, workspace ingress surfaces declare their relationship to it, and focused tests prove the carrier, lineage, ambiguity, and non-RC-widening boundaries.
evaluation_criteria:
  - `Fg_ingress_project` has an admitted catalog/library entry
  - `IngressSourceSet` and `ProjectIngressContract` carriers are public
  - workspace ingress/projection code names the reusable graph function that owns bootstrap traversal
  - lineage and ambiguity remain explicit outputs
  - the implementation does not claim live data_mapper parity
  - sandbox or semantic tests prove the installed-harness path still runs
proof_surface:
  - `build_tenants/typescript/code/src/graph/library.ts`
  - `build_tenants/typescript/code/src/graph/module.ts`
  - `build_tenants/typescript/code/src/workspace/carriers.ts`
  - `build_tenants/typescript/code/src/workspace/bootstrap_lineage.ts`
  - `build_tenants/typescript/test_env/tests/test_t030_graph_catalog_module.test.mjs`
  - `build_tenants/typescript/test_env/tests/test_t031_workspace_ingress.test.mjs`
non_closure_conditions:
  - ingress remains only a local normalization helper
  - source material is copied into generated project surfaces without lineage
  - ambiguity is silently collapsed
  - live external F_P proof is claimed without T-053 evidence
---

# T-056: Realize Ingress Project Library Slice

Implemented the reusable bootstrap graph function:

```text
Fg_ingress_project(
  unstructured | loosely_structured | structured
) -> Project
```

The slice remains harnessed. Live `data_mapper` proof belongs to `T-053`.

## Completion Record

Completed 2026-04-26T16:52:14Z.

Changes:

- added `Fg_ingress_project` to the reusable graph-function catalog and GTL
  module
- added public `IngressSourceSet`, `IngressSourceLedgerEntry`, and
  `ProjectIngressContract` carriers
- made `SdlcWorkspaceIngressReport` name `Fg_ingress_project` as its governing
  graph function
- preserved source-input ledger, lineage, ambiguity register, and bootstrap gap
  outputs explicitly
- kept the implementation as graph-program publication and deterministic
  projection, not a tenant-local traversal loop

Verification:

```text
npm run test:t030
npm run test:t031
npm run test:semantic
npm run lint:semantic
```

Result:

```text
test:t030: 6 tests passed
test:t031: 3 tests passed
test:semantic: 59 tests passed
lint:semantic: passed
```
