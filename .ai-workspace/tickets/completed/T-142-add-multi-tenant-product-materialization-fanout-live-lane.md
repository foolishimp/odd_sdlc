---
id: T-142
title: Add multi-tenant product materialization fan-out live lane
type: feature
ticket_category: backlog
status: completed
review_status: consolidated_into_T-164_edge_gain_closure_contract
goal: typescript-rc-bounded-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Add a governed multi-tenant materialization fan-out lane after the single-tenant product materialization loop is stable.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/test_env/fixtures/
  - build_tenants/typescript/test_env/live/
priority: medium
triaged_at: 2026-05-10
created_at: 2026-05-10
updated_at: 2026-05-13
completed_at: 2026-05-13
governance_scope: STDO Method
closure_resolution: closed_as_absorbed_proof_obligation
consolidated_into: .ai-workspace/tickets/active/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
dependencies:
  - T-132 single-tenant hello-world live lane proves the current selected-output-root materialization loop.
  - T-141 restores requirement-to-product materialization as a GTL transform boundary.
intake_source: The T-132 five-tenant live run on 2026-05-10 produced one JavaScript tenant source file, then looped on `Fg_materialize_declared_product_asset` because the current product materialization action closes over one selected output root while the scenario expected five tenants plus per-tenant design/ADR/module/source files.
target_truth: odd_sdlc can express a product requirement as a set of multiple target tenant bindings, evaluate each target binding through the same requirement-to-materialization transform, materialize one tenant per lawful action or one typed batch action, and close only when all declared tenant product files and execution proofs are admitted.
superseded_truth: A five-tenant expected-file list can be used against a one-output-root materialization action and rely on harness repetition to fan out work.
closure_law: This ticket closes only after the multi-tenant target binding is typed, evaluator selection is deterministic, each tenant materialization has an admitted ledger/closure/evidence record, the harness fails closed on no-progress loops, and an opt-in live lane proves all declared tenant programs by execution.
evaluation_criteria:
  - The graph/function catalog distinguishes single-target materialization from multi-target fan-out or batch materialization.
  - Target binding rows can represent multiple declared build tenants without collapsing them into one selected output root.
  - The evaluator either selects one tenant target at a time with replay-visible remaining pressure or selects a typed batch action whose closure law names every tenant target.
  - The edge ledger partitions edge-local closure from downstream carried pressure without allowing one generated tenant to close the whole multi-tenant product.
  - Public gaps reports remaining tenant targets and fulfillment counts from the same ledger/projection surface.
  - The live harness has a typed no-progress/stall disposition when the same current edge repeats without new product files, new operator archives, or changed consequence truth.
  - The live proof archives per-tenant stdout/stderr/status and generated-file state.
non_closure_conditions:
  - The multi-tenant lane repeats a converged materialization action while expected files remain missing.
  - One tenant source file closes the whole product obligation.
  - Fan-out state is held in harness-local arrays instead of target binding, ledger, closure, and evaluator projection truth.
  - Per-tenant design/ADR/module expectations are reintroduced before their graph functions and closure law are published.
---

# T-142: Multi-Tenant Product Materialization Fan-Out

## Closure Consolidation - 2026-05-13

This ticket is closed as a standalone backlog feature and carried by T-164.

The multi-tenant fan-out bug is a specific failed-closure class: one generated
tenant or one selected output root must not close a compound product obligation
whose target outcome names multiple tenant bindings.

T-164 now carries this as the multi-tenant materialization proof row:

- the edge contract must distinguish single-target materialization from
  multi-target fan-out or typed batch materialization;
- each tenant target must have admitted evidence, or a typed batch close row
  must cover every target;
- remaining tenant targets must stay visible as residual pressure;
- harness-local expected-file arrays must not become closure truth.

Closing this ticket does not claim multi-tenant fan-out has been implemented.

## Triage

First missing layer: design.

The current materialization loop is truthful for a single selected output root.
It is not yet a multi-target fan-out engine. The T-132 five-tenant run exposed
the gap by producing one JavaScript source file and then repeatedly re-entering
the same materialization edge while the scenario-level expected-file contract
still required four additional tenants plus design/ADR/module files.

This is not a reason to weaken the single-tenant proof. It is a separate product
capability: transform one requirement set into multiple target tenant bindings
and close the multi-tenant product only when every declared target has admitted
evidence.

## Required Shape

```text
requirements_surface
  -> target_binding_set
  -> evaluate_next selects target materialization
  -> invoke materialization for target tenant or typed batch
  -> admit product evidence
  -> ledger/closure records fulfilled tenant target
  -> evaluate_next sees remaining tenant pressure or completion
```

The implementation must not put fan-out authority in the test harness. The
harness observes and proves the loop; it does not decide which tenant comes
next.
