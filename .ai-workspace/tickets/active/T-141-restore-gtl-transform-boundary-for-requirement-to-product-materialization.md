---
id: T-141
title: Restore GTL transform boundary from requirement induction to product materialization
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: extend_existing_odd_sdlc_carriers_and_graph_catalog
governing_library: odd_sdlc TypeScript graph/operator/projection carriers over ABG 3.7.1 evaluator substrate
status: active
review_status: implemented_pending_review
goal: typescript-rc-bounded-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Restore the test35-style GTL boundary where requirements are an induction/transformation set for later product materialization, not proof that the requirement edge failed.
change_class: design_reframe
re_entry_point: design
priority: critical
triaged_at: 2026-05-10
created_at: 2026-05-10
updated_at: 2026-05-10
completed_at: null
governance_scope: STDO Method
dependencies:
  - T-109 ratifies the traversal consequence ledger/decision/evaluator split.
  - T-134 conforms project authority and stops before requirements by default.
  - T-135 provides evaluator-owned runner traversal spine.
  - T-137 provides target-obligation binding and published-action law.
  - T-139 exposes public gaps as read-only evaluator view.
  - T-140 retires local forced-iteration action authority.
related_tickets:
  - T-133 exposed the miss through the minimal live product lane.
  - T-041 remains the full data_mapper parity lane.
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
  - build_tenants/typescript/code/src/hooks/catalog.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/package.json
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
intake_source: The T-133 live run showed that the TypeScript runner can derive project authority and requirement documents, but then treats missing product files as partial fulfillment on derive_requirement_surface and retries the same edge. The operator clarified the intended model: A -> B creates typed induction assets; B.workspace plus its requirement transformation set drives traverse.F_P over the worksite to produce C.
target_truth: odd_sdlc has one evaluator-owned traversal path in which project/requirement induction closes as induction output, requirements become a typed transformation set for downstream product materialization, and evaluate_next selects a published product-materialization graph action when a declared product target remains unbuilt.
superseded_truth: Missing product files are a failure of derive_requirement_surface, or the runner may retry requirement generation until product implementation appears, or the broad bootstrap_release_self_test executive may stand in for a missing narrow product-materialization action.
closure_law: This ticket closes only when a live or functional proof shows that a fresh defined workspace can derive requirement authority, close the requirement edge without product files, carry those requirements as the transformation set for a later product-materialization graph action, select that action through evaluate_next, invoke the action with target asset and worksite binding, and close or fail closed from the product edge rather than retrying the requirement edge.
non_closure_conditions:
  - derive_requirement_surface remains open solely because product source files are missing.
  - Missing product files produce retry_same_edge, post_retry, or equivalent retry on derive_requirement_surface.
  - Product materialization pressure is carried only in prompt prose, gap dossier strings, or broad executive fallback.
  - A declared product target falls back to bootstrap_release_self_test when no narrow product-materialization action is published.
  - The worker prompt for product materialization does not name the target asset, worksite root, selected graph action, and requirement transformation set.
  - Public gaps presents product-file pressure as requirement-edge failure.
  - Tests pass only by source grep without exercising the induction-close to materialization-select behavior.
---

# T-141: Restore GTL Transform Boundary From Requirement Induction To Product Materialization

## STDO Triage

First missing layer: design.

The product requirements are not changing. The defect is the realization model:
the TypeScript runner collapsed two different graph transformations into one
edge.

Correct model:

```text
A -> B
unknown or sparse workspace -> induced authority bundle

B.workspace + TransformationSet(B.requirements) -> C
apply requirements over the worksite -> declared product asset
```

The first edge creates typed induction assets. The second edge uses those assets
as the transformation set for product construction.

Vocabulary: in this ticket, "induction" means the asset class produced by
`Fg_conform_project_authority` plus `derive_requirement_surface`. It is not a
separate bootstrap executive.

Named composition chain:

```text
Fg_conform_project_authority
  -> derive_requirement_surface
  -> Fg_materialize_declared_product_asset
```

## Prior Miss

`data_mapper.test35` already had the useful distinction.

The local GTL module published graph functions with typed input assets, target
assets, required contexts, evaluators, and output contract refs. Its invocation
manifest then bound the current work:

```text
edge: derive_code_surface
source_asset: implementation_module_surface + implementation_stack_profile
target_asset: code_surface
fulfillment_obligations: requirement rows
obligation_ledger_policy.fulfillment_rule: behavioral_code_realization
```

The runner did not treat requirements as the code edge itself. Requirements
were carried as obligations used to evaluate the code-surface transform.

When we pushed too much of this into generic ABG/evaluator machinery, we lost
the product-owned GTL boundary. ABG saw typed gaps and ranking pressure, but the
odd_sdlc graph/action layer no longer clearly said:

```text
requirements are the transformation set for the product edge;
requirements are not proof that the requirement edge failed.
```

## Current Miss

The T-133 live run exposed the current miss.

Observed sequence:

```text
Fg_conform_project
Fg_conform_project_authority
derive_product_surface
derive_goal_surface
derive_requirement_surface
derive_requirement_surface retry
derive_requirement_surface retry
...
```

The requirement edge produced requirement assets and passed postflight, but the
edge ledger still reported partial fulfillment because product files such as
the declared tenant manifest/source were absent. The closure decision became
`retry`, and evaluate_next selected the same requirement vector again.

This is not an F_P failure. The worker was explicitly told:

```text
Product materialization is not required for this edge.
Do not write product source/test files for this edge.
```

The framework then evaluated product-file absence against the requirement edge.
That is the semantic bug.

## Target Functional Spine

The corrected spine is:

```text
observe workspace
  -> bind induction outputs
  -> derive requirements as TransformationSet
  -> close induction edge
  -> observe product target pressure
  -> evaluate_next over published product actions
  -> invoke materialize_declared_product_asset
  -> admit product evidence
  -> publish edge fulfillment ledger
  -> derive close/yield/retry/repair/re-enter/reprice/block
```

The key boundary is this:

```text
derive_requirement_surface closes B.
materialize_declared_product_asset constructs C from B.
```

## Why This Should Work

This should work because it restores the same computational shape that made
test35 productive:

- GTL owns the typed action law: named graph function, source assets, target
  asset, contexts, and closure contract.
- odd_sdlc owns domain meaning: requirements are transformation obligations for
  downstream product construction.
- ABG owns traversal mechanics: observation, evaluator ranking, intent,
  invocation, event admission, liveness, replay, and projection.
- F_P receives a bounded transform prompt: selected graph action, target asset,
  worksite, and transformation set.
- F_D/admission owns canonical publication and closure evidence.

The worker is no longer asked to infer whether it should write product files
while running a requirement edge. The selected action tells it the transform.

## Required Design Model

Add or ratify these carrier meanings in odd_sdlc TypeScript:

```text
InductionAsset
  project_bootstrap_surface
  intent_surface
  product_surface
  goal_surface
  requirement_surface

TransformationSet
  source: requirement_surface
  rows: requirement obligations
  targetBindingRefs: SdlcTargetObligationBinding refs
  appliesTo: product-materialization graph action

SdlcTargetObligationBinding
  existing T-137 binding carrier
  extend only if needed with expectedProductFileRefs or executionProofContractRef
  do not create a second TargetAssetBinding truth surface

ProductMaterializationGraphFunctionCatalogEntry
  SdlcReusableGraphFunctionCatalogEntry named Fg_materialize_declared_product_asset
  inputs: InductionAsset + TransformationSet + Worksite
  outputs: declared product asset
```

Names may change during implementation, but the boundary must not.

### Type-Level Closure Partition

The implementation must add an explicit type-level discriminator so every
obligation row states whether it gates the current edge or is carried as
downstream transformation pressure.

Preferred carrier shape:

```ts
type SdlcObligationCarryDirection =
  | "edge_local"
  | "downstream_transformation_set";

interface SdlcEdgeFulfillmentAssessment {
  obligationId: string;
  fulfillmentStatus: SdlcEdgeFulfillmentAssessmentStatus;
  carryDirection: SdlcObligationCarryDirection;
  downstreamGraphFunctionRefs: readonly string[];
  targetBindingRefs: readonly string[];
}
```

Ledger fold rule:

```text
edge_local rows:
  participate in expected/fulfilled/partial/blocked/unfulfilled/missing/extra
  and determine edge_converged

downstream_transformation_set rows:
  do not block the current edge
  produce transformation-set refs and product_materialization_pressure
  are consumed by evaluate_next for the next graph action
```

Do not encode this as a local projection convention. T-135 closure, T-139
public gaps, and T-141 product-materialization selection must all read the same
carrier field.

## Files That Need To Change

### GTL Graph Publication

- `build_tenants/typescript/code/src/graph/library.ts`
  - publish a product-materialization graph function catalog entry such as
    `Fg_materialize_declared_product_asset` using the existing
    `SdlcReusableGraphFunctionCatalogEntry` pattern;
  - declare inputs as authority/requirement transformation set plus worksite and
    target binding;
  - declare outputs as declared product asset/materialization evidence, not
    requirement surface.

- `build_tenants/typescript/code/src/graph/module.ts`
  - expose the new graph function as a lawful action;
  - ensure broad `bootstrap_release_self_test` is not the fallback for declared
    product targets.

### Public Start / Evaluator Binding

- `build_tenants/typescript/code/src/start/public_start.ts`
  - bind declared product targets to the materialization action after induction;
  - pass existing `SdlcTargetObligationBinding` refs and transformation-set refs
    into the execution contract;
  - fail closed with typed no-action/reprice when no published action can build
    the declared target.

- `build_tenants/typescript/code/src/projection/query_domain.ts`
  - stop rendering missing product files as requirement-edge failure;
  - expose downstream product materialization pressure as read-only evaluator
    truth;
  - keep public gaps read-only and source it from the same evaluator/ledger
    chain.

### Runner / Consequence

- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - after requirement edge closure, route downstream product pressure back
    through evaluate_next;
  - invoke the selected product-materialization action when chosen;
  - do not retry `derive_requirement_surface` for missing product files.

- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  - add the `carryDirection` or equivalent partition to assessment/obligation
    rows;
  - fold only `edge_local` rows into current-edge convergence;
  - emit downstream transformation-set/product-materialization pressure from
    `downstream_transformation_set` rows.

- `build_tenants/typescript/code/src/operator/carriers.ts`
  - add or update carrier types for transformation set and materialization
    action refs if existing carriers cannot express them cleanly;
  - reuse `SdlcTargetObligationBinding` for target binding authority and extend
    it only for missing expected-file or execution-proof refs.

### Worker Handoff

- `build_tenants/typescript/code/src/operator/handoff.ts`
  - requirement edge prompt remains bounded to requirement artifact creation;
  - product edge prompt names:
    - selected graph action;
    - target asset;
    - selected output root/worksite;
    - requirement transformation set;
    - exact expected product files/proof command when declared.

### CLI / Spec Method

- `build_tenants/typescript/code/src/spec_method/entry.ts`
  - compact gaps/start output must show requirement induction closed separately
    from downstream product materialization pressure.

### Tests / Live Harness

- `build_tenants/typescript/test_env/tests/`
  - add focused functional tests for induction close and materialization action
    selection.

- `build_tenants/typescript/test_env/live/`
  - update T-133 live lane or add a focused T-141 live proof that reaches the
    product-materialization action without broad executive fallback.

## Evaluation Criteria

- A requirement edge that writes a valid requirement surface closes even when
  declared product files are still absent.
- Missing declared product files become downstream
  `product_materialization_pressure`, not `derive_requirement_surface` partial
  fulfillment.
- Obligation/assessment rows carry an explicit `edge_local` versus
  `downstream_transformation_set` discriminator, and the edge ledger fold uses
  that discriminator to compute convergence.
- The requirement surface is exposed as a `TransformationSet` or equivalent
  carrier for downstream product construction.
- `evaluate_next` selects a published product-materialization graph action when
  target binding and requirement transformation set exist.
- Target binding authority reuses `SdlcTargetObligationBinding`; no new
  duplicate target-binding carrier is introduced.
- If the materialization action is not published, the evaluator returns typed
  `no_action` or `reprice_required`; it must not fall back to
  `bootstrap_release_self_test`.
- The product-materialization worker prompt includes selected graph action,
  worksite root, target asset binding, and requirement transformation set.
- The product edge, not the requirement edge, owns product-file evidence and
  execution proof.
- Public gaps reports:
  - requirement induction status;
  - downstream product materialization pressure;
  - ledger and closure refs;
  - read-only evaluator source refs.
- The live or functional proof demonstrates the full transition:

```text
requirements produced
  -> requirement edge closed
  -> materialization pressure projected
  -> materialization graph action selected
  -> product action invoked or typed no-action emitted
```

## Required Tests

- `test_t141_requirement_edge_closes_with_downstream_product_pressure.test.mjs`
  - constructs a workspace where requirements are generated and product files are
    absent;
  - asserts requirement edge closure;
  - asserts carried product pressure.

- `test_t141_evaluate_next_selects_product_materialization_action.test.mjs`
  - supplies target binding plus transformation set;
  - asserts selected action is the product-materialization graph function.

- `test_t141_no_broad_fallback_for_declared_product_target.test.mjs`
  - removes or withholds the product-materialization action;
  - asserts typed no-action/reprice;
  - asserts no `bootstrap_release_self_test` fallback.

- `test_t141_product_handoff_uses_transformation_set.test.mjs`
  - exercises handoff generation;
  - asserts prompt/package contains action, worksite, target asset, and
    transformation set;
  - asserts requirement-edge prompt still says product materialization is not
    required.

- Live proof or live-equivalent proof:
  - run a fresh small product lane through requirement induction;
  - show the next selected action is product materialization, not requirement
    retry;
  - archive the consequence ledger, closure decision, next-action projection,
    handoff package, and product materialization manifest.

## Migration Declaration

Old truth path:

```text
missing product file
  -> requirement obligation partial
  -> derive_requirement_surface retry
```

New truth path:

```text
missing product file
  -> downstream product materialization pressure
  -> evaluate_next
  -> materialize_declared_product_asset
```

This is an inside-out hard break. Do not preserve both action-selection paths.
Compatibility aliases may exist only as inert labels in archived evidence; they
must not decide traversal.

## Migration Checklist

- [x] Inventory every place that treats requirement obligations as current-edge
  product fulfillment.
- [x] Add the edge-local/downstream transformation-set partition to the owning
  carrier surface.
- [x] Update the ledger fold so current-edge convergence uses only edge-local
  rows.
- [x] Update downstream product pressure derivation to consume
  downstream-transformation rows.
- [x] Reuse or minimally extend `SdlcTargetObligationBinding` rather than
  adding a duplicate target-binding carrier.
- [x] Publish `Fg_materialize_declared_product_asset` as a graph catalog entry.
- [x] Wire evaluate_next to select the published materialization action.
- [x] Update worker handoff for product-materialization prompts/packages.
- [x] Update public gaps/spec-method display to show induction closure and
  downstream pressure separately.
- [x] Add focused functional tests and one live or live-equivalent proof.

## Functional Review Criteria

- The implementation has one source of truth for whether an obligation gates
  the current edge or is carried downstream.
- The ledger is evidence/convergence truth only; it does not choose the next
  action.
- The closure decision is derived from the ledger fold and preserves
  close/yield/retry/repair/re-enter/reprice/block semantics.
- evaluate_next selects product materialization from published action rows and
  target binding truth.
- Public gaps is read-only and cannot become an executable action selector.
- F_P prompts receive deterministic target/action/worksite/transformation-set
  refs and do not infer product action from prose.

## Impacted Interface Review Checklist

- [x] `SdlcEdgeFulfillmentAssessment` or equivalent assessment row has explicit
  carry direction.
- [x] `SdlcEdgeFulfillmentLedger` counts document whether they count only
  edge-local rows or expose both local and downstream partitions.
- [x] `SdlcEdgeClosureDecision` cannot retry the requirement edge solely because
  downstream product files are missing.
- [x] `SdlcNextActionProjection` receives downstream transformation-set refs and
  target binding refs.
- [x] `SdlcTargetObligationBinding` remains the target-binding authority.
- [x] `SdlcRequirementFulfillmentPublicProjection` and gaps output distinguish
  requirement induction status from product materialization pressure.
- [x] Worker handoff package carries product-materialization action refs without
  embedding a second action decision in prompt prose.

## Break-To-Closure Map

| Break | Closure Proof |
| --- | --- |
| Add carry-direction partition | Unit test proves downstream rows do not block requirement-edge convergence. |
| Reuse target binding surface | Unit test proves selected product action uses `SdlcTargetObligationBinding` refs. |
| Publish materialization graph function | Catalog/module test proves action is visible and broad executive is not fallback. |
| Wire evaluate_next | Functional test proves requirement close leads to materialization selection. |
| Update handoff | Handoff test proves product prompt has action, target, worksite, and transformation set. |
| Update public gaps | T-139-style test proves read-only projection separates induction closure from downstream pressure. |
| Live/live-equivalent proof | Archive includes ledger, decision, next-action projection, handoff package, and manifest. |

## Break Order

1. Add the graph/action carrier and tests proving publication/fail-closed
   behavior.
2. Split edge-local closure from downstream carried pressure.
3. Update evaluate_next binding to select the materialization action.
4. Update worker handoff prompt/package for product materialization.
5. Update public gaps/spec-method output.
6. Run focused tests.
7. Run one live or live-equivalent proof.

## Current Evidence

The T-133 live archive
`build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260509T173433676Z_pid427`
shows the defect:

- requirement edge worker prompt says product materialization is not required;
- product materialization manifest has `required: false`;
- requirement ledger has partial fulfillment and `edgeConverged: false`;
- closure decision is `retry`;
- evaluate_next selects the same requirement vector.

That archive is the regression seed for this ticket.

## Implementation Evidence - 2026-05-10

Implemented:

- `SdlcObligationCarryDirection` now partitions obligation assessments into
  `edge_local` and `downstream_transformation_set` rows.
- `SdlcEdgeFulfillmentLedger` carries downstream transformation pressure,
  downstream target-binding refs, and downstream graph-function refs while
  computing current-edge convergence over edge-local rows.
- Requirement rows with
  `requirement_recorded_for_future_closure:*` are admitted as downstream
  transformation-set pressure, not same-edge requirement failure.
- The assurance gate no longer converts downstream-carried requirement rows
  into retry pressure for `derive_requirement_surface`.
- `Fg_materialize_declared_product_asset` is published in the graph catalog and
  hook catalog as the narrow product-materialization graph function.
- The installed runner routes closed requirement pressure through evaluate-next
  and selects `Fg_materialize_declared_product_asset` instead of retrying the
  requirement edge or falling back to the broad executive graph.
- Product-materialization handoff includes the selected graph action, worksite
  root, target asset type, and requirement transformation set.
- Spec Method start rehydrates the selected next action from archived
  `sdlc_next_action_projection.json` so a subsequent start invokes the selected
  product-materialization graph function.

Focused verification:

```bash
npm run test:t141
# 4/4 passed

npm run test:t030
# 9/9 passed

npm run test:t134
# 9/9 passed

npm run test:t135
# 7/7 passed

npm run test:t139
# 7/7 passed

npm run test:t140
# 6/6 passed

npm run test:t133
# 2/2 non-live passed; live skipped without opt-in

git diff --check
# passed
```

Live Rust hello-world proof:

```bash
ODD_SDLC_TS_T133_RUST_HELLO_WORLD_LIVE=1 \
ODD_SDLC_TS_T133_RUST_HELLO_WORLD_WORKER='process://claude?model=claude-sonnet-4-5&effort=max' \
npm run test:t133:rust-live
# 3/3 passed
```

Live archive:

`build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260509T190543506Z_pid19083`

Observed live transition:

```text
derive_requirement_surface
  -> edge closed with downstream pressure count 6
  -> evaluate_next selected Fg_materialize_declared_product_asset
  -> product materialization worker invoked
  -> build_tenants/hello_world_rust/Cargo.toml created
  -> build_tenants/hello_world_rust/src/main.rs created
  -> cargo run --quiet produced "Hello, world!"
```

Live summary:

```json
{
  "verdict": "passed",
  "elapsedMs": 426871,
  "expectedFilesPresent": true,
  "stdout": "Hello, world!",
  "status": 0
}
```

Review boundary: implemented and live-proved, pending review. This ticket has
not been moved to completed in this pass.
