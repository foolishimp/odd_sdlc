---
id: T-142
title: Prove autonomous product materialization from the traversal consequence chain
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: extend_existing_odd_sdlc_traversal_consequence_and_graph_catalog_surfaces
governing_library: odd_sdlc TypeScript traversal consequence carriers over ABG evaluator substrate
status: completed
review_status: closed_implemented
goal: typescript-rc-bounded-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Make the post-authority/post-requirements product-materialization step arise from observation, target binding, ledger, closure decision, and evaluator projection without a harness-supplied product target.
change_class: design_reframe
re_entry_point: design
priority: critical
triaged_at: 2026-05-10
created_at: 2026-05-10
updated_at: 2026-05-10
completed_at: 2026-05-10
governance_scope: STDO Method
dependencies:
  - T-109 ratifies the traversal consequence ledger/decision/evaluator split.
  - T-134 defines project-authority conformance from declared authority input.
  - T-135 provides evaluator-owned runner traversal spine.
  - T-137 provides target-obligation binding and published-action law.
  - T-139 exposes public gaps as read-only evaluator view.
  - T-140 retires local forced-iteration action authority.
  - T-141 restores the GTL transform boundary between requirement induction and product materialization.
related_tickets:
  - T-133 remains the minimum-overhead live lane that should prove this behavior.
  - T-041 remains the full data_mapper parity lane after this controlled proof.
affected_boundary:
  - build_tenants/typescript/code/src/graph/library.ts
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/assurance_gate.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/assurance/component_depth.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
intake_source: The final test35 parity analysis shows that TypeScript now has many of the carrier names, but has not yet proven the Python-equivalent loop as the only route from transform output to next action. The highest-value missing feature is autonomous continuation after project authority and requirement induction: the runner must observe product pressure, bind it to a published product-materialization graph action, admit intent, invoke F_P, publish the fulfillment ledger, close or fail closed, and continue from replay-visible consequence truth.
target_truth: A fresh defined workspace with bootstrap/source documents can run project-authority conformance as `{bootstrap documents} -> F_P.transform -> {conformed project}`, then autonomously select and invoke product materialization from the admitted traversal consequence chain. JSON/YAML/Markdown/prose input shapes are source fragments, not privileged fixture law. No harness target argument, gap dossier action list, postflight status, assurance report, compact CLI output, or run summary may independently close the edge or select the next action.
superseded_truth: Product materialization is triggered by a live-test harness target, by a broad bootstrap/release fallback, by gap dossier next-action strings, by compact CLI output, or by local installed-operator branching that does not pass through SdlcEdgeFulfillmentLedger -> SdlcEdgeClosureDecision -> SdlcNextActionProjection.
closure_law: This ticket closes only when a functional and live proof show that the runner can progress from conformed authority and requirement transformation-set pressure to declared product materialization without an explicit product target, and that closure/continuation is derived from the admitted SdlcEdgeFulfillmentLedger, SdlcEdgeClosureDecision, and SdlcNextActionProjection chain.
non_closure_conditions:
  - A product-materialization action is selected only because the live harness supplied asset:component_code_surface or an equivalent target.
  - Requirement induction closes by suppressing product pressure rather than carrying it as downstream transformation-set pressure.
  - Missing product files are treated as requirement-edge failure after the requirement edge has produced its induction output.
  - Product materialization is selected from gap dossier strings, compact CLI output, postflight status, assurance status, run summary, or local branch names rather than SdlcNextActionProjection.
  - The runner can close or continue when SdlcEdgeFulfillmentLedger is absent, non-converged, unadmitted, or contradicted by evidence.
  - Tests prove only helper construction or source-grep shape without executing the continuation behavior.
---

# T-142: Prove Autonomous Product Materialization From The Traversal Consequence Chain

## STDO Triage

First missing layer: design-to-runner realization.

The product requirement is not changing. The intended computational loop is
already ratified in the test35 parity analysis:

```text
observe current worksite
  -> bind missing/required work to current edge obligations
  -> invoke the bounded worker/action
  -> ingest result evidence
  -> publish fulfillment ledger
  -> compute edge_converged = carry && fulfillment && admitted
  -> decide close / yield / retry / continuation
  -> continue from replay-visible state
```

The TS/ABG carrier target is:

```text
ObservationSnapshot
-> TargetObligationBinding
-> PriorityProjection
-> ConstructionIntent
-> WorksiteEvidence
-> SdlcEdgeFulfillmentLedger
-> SdlcEdgeClosureDecision
-> SdlcNextActionProjection
```

This ticket exists because the current line has the names of most carriers but
still needs the first end-to-end proof that those carriers are the only route
from authority/requirement induction to product materialization.

## Constitutional Target

This ticket is governed by A16 Constitutional Override in:

```text
.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
```

Ticket-local closure wording cannot weaken the axiom set. The following
artifacts may provide evidence or diagnostics only:

```text
gap dossier
postflight report
assurance report
materialization manifest
runtime liveness projection
run summary
worker prose
screen/PTY transcript
prompt package
harness target argument
source-grep test
CLI branch or compact output
```

If any of those conflict with
`SdlcEdgeFulfillmentLedger -> SdlcEdgeClosureDecision -> SdlcNextActionProjection`,
the traversal consequence chain wins. If that chain is absent, the edge has not
constitutionally closed and no next action has been selected.

## Feature Consolidation Decision

Consolidate these features in this ticket because they are one computation:

1. No-target post-bootstrap observation.
2. F_P-induced requirement surfaces carried as downstream transformation-set
   pressure after deterministic admission, without treating F_D as the project
   author.
3. Product pressure bound to `component_code_surface` through
   `SdlcTargetObligationBinding`.
4. `evaluate_next` selection of the published product-materialization graph
   action.
5. Construction intent admission from the selected evaluator row.
6. Worker invocation with exact target binding, worksite refs, and
   transformation-set obligations.
7. Ledger/decision/projection archive proof and negative conflict tests.

Do not consolidate these into this ticket:

1. Global prompt/package slimming. That is important, but it is a separate
   token-budget and operator-input hygiene fix.
2. Full retirement of every legacy ledger/counter. This ticket only demotes or
   retires surfaces that conflict with the product-materialization path.
3. Multi-tenant/five-language circuit breakers. That is a separate scheduling
   and batch-product capability.
4. Full data_mapper live parity. This ticket creates the controlled proof the
   data_mapper lane should later consume.
5. Public UX polish beyond exposing read-only consequence refs needed for proof.

## Required Behavior

Starting condition:

```text
defined workspace
bootstrap/source documents
no explicit product target argument
```

Required progression:

```text
Fg_conform_project_authority
  -> F_P.transform reads bootstrap/source fragments in any admitted form
  -> conformed project authority surfaces materialize
  -> induced requirements are admitted as downstream transformation-set pressure
evaluate_next
  -> selects Fg_materialize_declared_product_asset
construction intent
  -> admits selected product-materialization action
F_P worker
  -> applies the requirement transformation set to the current worksite
  -> materializes declared product files
F_D/runner admission
  -> observes files and report evidence
  -> constructs WorksiteEvidence
  -> constructs SdlcEdgeFulfillmentLedger
  -> derives SdlcEdgeClosureDecision
  -> constructs SdlcNextActionProjection
replay
  -> reconstructs the same decision from refs
```

## Existing Ledgers And Counters Disposition

Keep/promote:

- `SdlcEdgeFulfillmentLedger`
- `SdlcEdgeClosureDecision`
- `SdlcNextActionProjection`
- `SdlcTargetObligationBinding`
- `SdlcWorksiteEvidence`
- `SdlcConstructionIntent`

Repurpose as evidence/read models:

- gap dossier rows
- requirement closure registers
- postflight reports
- assurance reports
- materialization manifests
- runtime liveness projections
- run summaries
- worker archives and PTY logs

Retire as traversal authority in this path:

- harness target argument as proof of product pressure
- compact CLI next-action output as executable decision
- local installed-operator branch names as action authority
- duplicated closure counters not citing a ledger version ref
- worker prose or worker result status as closure truth
- component-depth topology as a required schema for the declared-product
  materialization action when no topology authority was selected

## Required Tests

Add focused functional tests before live proof:

1. Requirement induction closes with downstream transformation-set pressure and
   does not require product files on the requirement edge.
2. Post-requirement observation with downstream pressure selects
   `Fg_materialize_declared_product_asset` through `SdlcNextActionProjection`.
3. Selected product-materialization action admits a `SdlcConstructionIntent`
   whose predecessor refs include the selected evaluator projection row.
4. A postflight-passed result with a non-converged ledger does not close.
5. Materialized product files without admitted `WorksiteEvidence` do not close.
6. Product materialization cannot be selected from gap dossier strings or
   compact CLI output when the consequence chain has no selected action.
7. Replay reconstructs the product-materialization decision from archived
   `ConstructionIntent -> WorksiteEvidence -> Ledger -> ClosureDecision ->
   SdlcNextActionProjection`.
8. The declared-product materialization action does not require
   component-depth topology when no component topology authority was selected.

Add one live proof:

```text
npm run test:t133:rust-live
```

or its renamed successor must run without a product target supplied by the
harness. The run must archive the authority edge, requirement edge, product
materialization edge, ledger counts, closure decisions, next-action projections,
and replay proof.

## Required File Review

Implementation should start by reviewing these surfaces:

- `build_tenants/typescript/code/src/operator/installed_operator.ts`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
- `build_tenants/typescript/code/src/start/public_start.ts`
- `build_tenants/typescript/code/src/projection/query_domain.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/code/src/graph/module.ts`
- `build_tenants/typescript/test_env/live/`
- `build_tenants/typescript/test_env/tests/`

## Closure Evidence

Closed 2026-05-10.

Proof commands:

- `npm run build:semantic`: passed.
- `npm run test:t142`: passed 2/2.
- `npm run test:t141`: passed 4/4.
- `npm run test:t133`: passed 2/2 with live lane skipped when live env is unset.
- `npm run test:t133:rust-live`: passed 3/3.
- `git diff --check -- <T-142 touched files>`: passed.
- Full `git diff --check`: blocked by pre-existing unrelated conflict markers
  in the dirty worktree.

Live archive:

```text
build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260510T055508920Z_pid18047
```

Per-edge summary:

- `Fg_conform_project`: installed conformance setup converged.
- `Fg_conform_project_authority`: `F_P.transform` read bootstrap/source
  fragments, materialized conformed authority surfaces, postflight passed,
  closure disposition `close`.
- Authority edge ledger counts:
  `expected=7 fulfilled=7 partial=0 blocked=0 unfulfilled=0 missing=0 extra=0`,
  `edgeConverged=true`.
- Authority edge carried downstream pressure refs for induced
  `REQ-T133-001` through `REQ-T133-007`, plus
  `graph-function:odd_sdlc:Fg_materialize_declared_product_asset`, with
  `target-binding://odd-sdlc/component_code_surface`.
- Authority edge next-action projection selected
  `graph-function:odd_sdlc:Fg_materialize_declared_product_asset` with
  `choosesNextTraversal=true`.
- `Fg_materialize_declared_product_asset`: `F_P.transform` applied the
  requirement transformation set to the worksite and materialized
  `build_tenants/hello_world_rust/Cargo.toml` and
  `build_tenants/hello_world_rust/src/main.rs`; postflight passed and closure
  disposition was `close`.
- Product-materialization ledger counts:
  `expected=20 fulfilled=20 partial=0 blocked=0 unfulfilled=0 missing=0 extra=0`,
  `edgeConverged=true`.
- Product-materialization next-action projection had
  `choosesNextTraversal=false`, `nextGraphFunctionRef=null`,
  `selectedActionRef=null`.
- Runtime proof executed `cargo run --quiet` from the generated tenant with
  `status=0` and `stdoutTrimmed="Hello, world!"`.

Negative proof:

- The live harness did not supply `asset:component_code_surface` or equivalent
  product target after authority conformance; it used `--target next`.
- The product-materialization worker prompt explicitly marked component-depth
  topology as not required for this declared-product action when no topology
  authority was selected.
- Focused T-142 coverage proves the declared-product action is not blocked by
  absent component-depth topology.
