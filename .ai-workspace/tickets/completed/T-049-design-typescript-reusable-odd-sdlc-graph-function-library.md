---
id: T-049
title: Design TypeScript reusable ODD SDLC graph-function library
type: task
ticket_category: refactor
status: completed
goal: reduce-custom-typescript-framework-weight-through-reusable-graph-programs
change_intent: The graph-purity review found that odd_sdlc.TS publishes graph functions but still implements much framework behavior in bespoke TypeScript. Define the first reusable graph-function library so SDLC framework behavior moves toward GTL/ABG programs.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript graph catalog, GTL module publication, hook contracts, ingress, closure, route binding, operational return
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
completed_at: 2026-04-26T16:42:28Z
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: `.ai-workspace/comments/codex/20260426T065121Z_REVIEW_odd_sdlc_typescript_against_odd_method_graph_purity.md`
target_truth: odd_sdlc.TS has a ratified reusable graph-function library design for common SDLC traversal forms, beginning with typed single-hop traversal and ingress-to-project.
superseded_truth: product-specific leaf graph functions plus bespoke TypeScript framework machinery are sufficient ODD-native implementation truth.
closure_law: This ticket closes when the reusable library design names carriers, graph functions, typed inputs/outputs, F_D/F_P/F_H roles, ABG ownership, and the first implementation tickets without adding tenant-local control loops.
evaluation_criteria:
  - `Fg_single_typed_traversal` is defined
  - `Fg_ingress_project` is defined
  - the design separates graph-function program truth from TypeScript adapter/proof code
  - the design states how reusable functions compose with existing SDLC product graph functions
  - the design does not widen the RC claim
proof_surface:
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md`
  - `T-055-realize-typescript-reusable-single-typed-traversal-library-slice.md`
  - `T-056-realize-typescript-ingress-project-library-slice.md`
  - `npm run test:t030`
non_closure_conditions:
  - only more TypeScript helper functions are added
  - reusable graph functions are described as comments without carrier/ABG authority
  - SDLC owns retry or continuation locally
---

# T-049: Design Reusable ODD SDLC Graph-Function Library

## Review Finding

High: graph functions are published, but not yet the dominant implementation
mechanism.

The first design target is a small reusable library, not a broad rewrite:

- `Fg_single_typed_traversal`
- `Fg_ingress_project`

The design must support later extraction of closure, routing, projection, and
operational-return patterns.

## Completion Record

Completed 2026-04-26T16:42:28Z.

Closed by publishing:

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md`
- `T-055-realize-typescript-reusable-single-typed-traversal-library-slice.md`
- `T-056-realize-typescript-ingress-project-library-slice.md`

The design names reusable graph functions, shared carriers, typed
inputs/outputs, `F_D`/`F_P`/`F_H` roles, ABG traversal ownership, and
composition with current product-specific functions. It explicitly preserves
the bounded RC claim and leaves full operational RC blocked under T-041.

Verification:

```text
npm run test:t030
```

Result:

```text
4 tests passed
```
