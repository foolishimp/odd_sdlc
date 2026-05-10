---
id: T-135
title: Realize evaluate_next-owned runner traversal spine
type: feature
ticket_category: implementation_migration
status: completed
review_status: completed_with_requirement_obligation_spine_amendment
goal: typescript-rc-one-traversal-consequence-surface
build_tenant: typescript
owner: odd_sdlc
change_intent: Implement the T-109 axiomatic traversal consequence surface so the installed runner consumes evaluate_next/evaluate_action truth to decide graph invocation instead of local retry strings, prompt prose, CLI loops, or installed-operator summaries.
change_class: realization_refactor
re_entry_point: code
affected_boundary:
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts
  - build_tenants/typescript/code/src/assurance/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
priority: critical
rc_blocker: true
release_blocker_reason: Runner traversal still has local action-selection authority instead of the T-109 evaluate_next/evaluate_action surface.
migration_strategy: inside_out_hard_break
library_usage: consume
governing_library: T-109 traversal consequence carriers and ABG 3.7.1 construction evaluator substrate (ABG priority carrier consumed as evaluate_next)
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-10
completed_at: 2026-05-10
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-109 publish authoritative edge ledger lineage chain
  - T-136 add yield closure disposition and resume basis
  - T-137 enforce target obligation binding and published action law
  - T-138 preserve causal chain and replayability for traversal consequence
related_tickets:
  - T-129 ABG 3.7.1 evaluator and liveness substrate migration
  - T-134 conform project authority from defined workspace
  - T-133 create minimum overhead Rust hello-world live lane
  - abiogenesis T-130 define recorded hook-action typing model for F_P evals
intake_source: The T-109 axiom review established that the target homeostasis loop is synthesize_model -> eval_gap -> TargetObligationBinding -> evaluate_next -> ConstructionIntent -> WorksiteEvidence -> evaluate_action -> SdlcEdgeFulfillmentLedger -> SdlcEdgeClosureDecision -> evaluate_next. The installed runner still has local branch authority and must be changed to consume this one consequence surface.
target_truth: The installed runner invokes graph work only from an admitted ConstructionIntent derived from event-log-derived IntentLineage, ProductAssetModel, gap pressure, and evaluate_next over published action authority. Every consequential F_P eval has one owning admitted record surface: F_P returns findings, ABG/F_D admits or rejects them, and the owning ledger/register/projection records the deterministic result for later evaluation. Default graph following is itself an evaluate_next decision. Closure of the just-executed action is evaluate_action over admitted evidence into SdlcEdgeFulfillmentLedger and SdlcEdgeClosureDecision. Requirement obligations are product obligations, not marker echoes; a requirement-producing edge may record requirement pressure but does not fulfill that requirement unless admitted evidence proves the obligation is satisfied. No local string branch, CLI loop, prompt instruction, postflight summary, public gap row, legacy traversal ledger, or gap-dossier action list can independently decide the next traversal.
superseded_truth: installed_operator.ts locally chooses retry_same_edge, repair, re-entry, archive inspection, or broad graph continuation from gap-action strings and local loop state.
closure_law: This ticket closes only when the installed start path consumes one next-action projection for next traversal, deterministic tests prove no rival decision path can invoke work, and a live/sandbox runner proof shows a non-close edge continues through evaluate_next-owned intent rather than local installed-operator branching.
evaluation_criteria:
  - Runner entry obtains an explicit `NextActionBasis`: `initial_selection` when
    no edge has run yet, or one post-action basis derived from the current
    `SdlcEdgeClosureDecision`.
  - Runner carries intent event refs and `ProductAssetModel` refs into gap, intent, and next-action replay truth.
  - Runner uses `eval_gap` for model-versus-reality gap pressure and never treats it as action selection.
  - Runner re-observes runtime/worksite truth after evidence admission before `evaluate_next`.
  - Runner calls `evaluate_next` to select a next-action projection when the
    basis allows an action; a separate admission constructor admits the selected
    `ConstructionIntent`.
  - Runner calls `evaluate_action` to fold admitted evidence into ledger and closure decision; this path cannot select the next graph action.
  - `evaluate_action` derives ledger counts from declared obligations and
    admitted worker/F_D obligation assessments. It never collapses
    `worker_invoked` into fulfilled edge closure.
  - Requirement-surface generation records requirement obligations as future
    pressure unless the action's admitted evidence proves fulfillment of the
    requirement itself.
  - Every runner-consumed F_P eval result is recorded through its owning
    admitted ledger/register/projection surface; raw F_P findings, event-log
    projection alone, or worker prose cannot stand in for that record.
  - Default sequential graph following is expressed as an `evaluate_next` selected action.
  - `yield` returns control without invoking a new graph action.
  - `close` closes the current edge, then `evaluate_next(post_close_graph_continuation)`
    may select the next graph edge or no action when the graph is complete.
  - `retry`, `repair`, `re-enter`, and `reprice` can only invoke work through published graph/action catalog rows.
  - Local strings such as `retry_same_edge_with_gap_dossier`, `plan_repair_reentry_with_gap_dossier`, and `inspect_worker_archive` are removed as traversal authorities or reduced to display labels over evaluate_next truth.
  - Public start and Spec Method command code parse intent and render/consume
    projection; they do not own retry iteration or synthesize retry context.
  - A negative test proves a locally fabricated gap-dossier action cannot cause runner invocation without evaluate_next/admission truth.
  - A positive test proves a current graph edge is followed when no higher-priority lawful action exists and no yield disposition is active.
  - A positive test proves a higher-priority lawful action selected by evaluate_next overrides ordinary graph following.
  - A negative test proves a requirement edge cannot fulfill product
    requirements by merely echoing `REQ-*` identifiers in a requirement
    surface.
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t135_evaluator_owned_runner_spine.test.mjs
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md
  - runtime operator-run event archives showing admitted intent, evidence, ledger, closure decision, next-action projection, and graph invocation refs
non_closure_conditions:
  - installed_operator.ts still decides the next traversal by inspecting local action strings.
  - Spec Method command code loops over start attempts and injects retry context as business logic.
  - A worker prompt or postflight text can directly choose retry/repair/re-entry.
  - A runner consumes raw F_P findings or event-log projections without the
    owning admitted ledger/register/projection record.
  - A legacy traversal ledger, register, or public gap row remains a rival action
    selector instead of a source/read model feeding the T-109 spine.
  - Public gaps read-only output is reused as executable runner authority.
  - Default graph following bypasses next-action projection.
  - `synthesize_model`, `eval_gap`, `evaluate_next`, or `evaluate_action` performs another function's authority.
  - `evaluate_action` closes an edge from worker invocation state without
    folding declared obligation assessments.
  - A generated requirement surface marks source/product requirements fulfilled
    only because requirement identifiers were observed in output text.
---

# T-135: Realize Evaluate_Next-Owned Runner Traversal Spine

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

Change-class note: this is a realization refactor only under the T-109 design
surface. This ticket cannot close until T-109 ratifies the axiomatic closure
target it implements.

The T-109 design target is now explicit. The missing implementation is the
runner consequence path. Current code can preserve gap/evaluate-next/action
closure truth and still invoke the next step through local installed-operator
branching. That violates the one-surface axiom.

## Homeostasis Function Split

This ticket consumes the ODD Method homeostasis loop and must use the precise
constitutional functions:

- `synthesize_model`: synthesizes `ProductAssetModel` from event-log-derived
  `IntentLineage`, prior model, and admitted product truth. It does not observe
  the worksite, select action, or close action.
- `eval_gap`: compares desired product/model truth to observed reality and emits
  gap pressure. It does not select action and does not close action.
- `evaluate_next`: binds gap pressure to target obligations, ranks published
  lawful graph actions, and publishes `NextActionProjection` with a selected
  action when lawful. It does not admit construction intent.
- `evaluate_action`: folds admitted evidence for the action just taken into
  `SdlcEdgeFulfillmentLedger` and `SdlcEdgeClosureDecision`. It does not select
  the next graph action.

Construction intent is admitted from gap-derived action selection. The product
intent document is not unrelated to construction intent; it is part of the
external intent events whose `IntentLineage` projection seeds the product model.
`eval_gap` compares that model to observed reality. `evaluate_next` selects a
published graph action from the resulting gap pressure. A distinct admission
constructor admits current construction intent from the selected action.

## F_P Evaluation Record Model

This ticket tightens the runner around recorded `F_P` evaluation.

The governing invariant is:

```text
F_P.<role>.eval(input_basis) -> Findings<role>
ABG/F_D.admit(Findings<role>) -> RecordSurface<role>
RecordSurface<role> -> later evaluation input
```

For the requirements lane, the owning record is not the requirement document
itself. The requirement document is product/model truth. The action-closure
record is the edge fulfillment ledger over declared obligations and admitted
assessments:

```text
declared requirements + target obligations
-> worker/F_P findings
-> F_D/admission checks
-> obligation assessments
-> evaluate_action
-> SdlcEdgeFulfillmentLedger
-> SdlcEdgeClosureDecision
```

Therefore a requirement surface can create or update requirement truth while
leaving requirement obligations open. Recording `REQ-*` identifiers is evidence
that requirement pressure exists; it is not proof that the requirement has been
fulfilled by the product.

`RecordSurface<role>` may be called a ledger, register, projection, or admitted
event depending on the role. The name is not authority. The authority is the
admitted deterministic record of the `F_P` evaluation.

The installed runner must not consume raw worker prose, raw `F_P` findings, or
event-log projection alone as if they were the admitted evaluation record. Event
truth says what happened. The ledger/register/projection records what the
admitted evaluator concluded about target obligations, observed worksite state,
evidence, ambiguity, and policy.

The current surfaces reconcile as follows:

| Surface | T-135 role |
|---|---|
| ABG event log | Prime runtime fact authority for hook calls, findings, admissions, selected intents, graph invocation, evidence, and interruption events. |
| ABG `PayloadLedgerProjection` | ABG projection over admitted payload/evidence/closure-input events. It may feed SDLC evaluation but must not replace the SDLC edge fulfillment record. |
| ABG `ObligationLedgerAsset` | Admitted obligation source truth. It feeds `eval_gap` and `evaluate_action`; it does not select traversal. |
| ABG `ConstructionProgressLedger` | ABG construction progress/stagnation record. It can inform yield/closure pressure, but it is not the SDLC edge fulfillment ledger. |
| odd_sdlc `SdlcEdgeFulfillmentLedger` | Owning admitted record for `evaluate_action` over an edge attempt: target bindings, worksite/evidence, counts, admission gates, and convergence. |
| odd_sdlc `SdlcEdgeClosureDecision` | Disposition over `SdlcEdgeFulfillmentLedger`: `close`, `yield`, `retry`, `repair`, `re-enter`, `reprice`, or `block`. It does not select a graph action. |
| odd_sdlc `SdlcManagedTraversalLedger` | Legacy/conformance traversal surface. Under T-135/T-140 it must be demoted, derived, or folded into the T-109 consequence spine; it must not remain an executable selector. |
| odd_sdlc ingress/source ledger rows | Source lineage and conformance input to `synthesize_model` / `eval_gap`. They are not closure or traversal-selection authority. |
| public gaps / query-domain rows | Read-only evaluator view. They may display evaluator truth but cannot be consumed as runner invocation authority. |

This is how T-135 preserves one truth surface while allowing multiple ledgers
and registers to exist: each record surface has one evaluation role, and only
the T-109 spine composes those roles into traversal consequence.

Initial selection and post-action selection are both `evaluate_next`; they
differ only by `NextActionBasis`:

```text
initial_selection
post_yield_resume
post_close_graph_continuation
post_retry
post_repair
post_reenter
post_reprice
post_block
```

## Migration Declaration

- migration strategy: `inside_out_hard_break`
- old truth path: installed-operator local branches, gap-dossier action strings,
  CLI retry/context injection, prompt-pressure route prose, and postflight
  summaries decide follow-up traversal.
- new truth path: `synthesize_model` emits `ProductAssetModel`, `eval_gap`
  emits gap pressure and target-binding findings into an admitted record,
  `evaluate_next` emits `NextActionProjection` over a published graph action,
  a separate admission constructor admits `ConstructionIntent`,
  `evaluate_action` folds admitted worksite/evidence findings into
  `SdlcEdgeFulfillmentLedger` and `SdlcEdgeClosureDecision`, and fresh
  `evaluate_next` selects any follow-up work; the runner invokes graph work only
  from admitted construction intent.
- old producers: `installed_operator.ts`, CLI start loops, handoff prompt
  assembly, gap dossier action lists, assurance/postflight summary strings.
- new producers: admitted hook/eval findings, target-obligation binding records,
  T-109 edge fulfillment ledger, T-109 closure decision fold, ABG/odd_sdlc
  evaluate_next projection, admitted construction intent, runtime event/evidence
  admission.
- old consumers: installed start runner, CLI command adapter, live harness,
  public gap summaries, RC report summaries.
- new consumers: installed runner, public gaps/read models, CLI rendering, live
  harness reports, RC reports.
- projections/proof surfaces: operator-run event archive, F_P evaluation record
  surfaces, edge fulfillment ledger, closure decision projection, evaluate_next
  projection, CLI/gaps JSON, live/sandbox runner tests.
- migration closure: no production invocation path can dispatch graph work from
  local strings, prompt prose, CLI loop state, or public read-only gaps output.

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] recurring realization patterns are checked against existing library/commonization surfaces
- [x] ticket declares library usage and names the governing library or rationale
- [x] if the work exists in more than one build tenant, this backlog/active ticket carries only one tenant lifecycle and any sibling tenant work lives on its own suffixed ticket
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Functional Review Criteria

- [x] Traversal selection is carrier-owned by closure/evaluate_next/intent truth,
      not control-flow-owned by installed-operator branches.
- [x] The runner consumes admitted carriers directly and does not reconstruct
      authority from strings, payload fallback, prompt text, or public gaps rows.
- [x] Every consequential `F_P` eval consumed by the runner has an owning
      admitted record surface; event-log projection alone is not treated as
      worksite/edge evaluation truth.
- [x] Legacy ledgers/registers are explicitly demoted, derived, or folded into
      the T-109 spine before they can influence traversal.
- [x] Effects remain at the edge: worker invocation happens after admitted
      intent, not during evaluate_next/source-truth interpretation.
- [x] Positive tests prove default graph following and priority override through
      evaluate_next projection.
- [x] Negative tests prove local fabricated actions and public read-only gaps
      rows cannot invoke work.

## Impacted Interface Review Checklist

- [x] `installed_operator.ts`: dispatches only from admitted evaluate_next-selected
      construction intent.
- [x] `start/public_start.ts`: resolves public start intent into
      `initial_selection` / target-binding projection only; no local ordering
      can become the runner traversal selector.
- [x] `spec_method/entry.ts`: parses command intent and renders projection; no
      retry business loop or retry-context synthesis.
- [x] `operator/handoff.ts`: prompt packages may carry context, but not route
      authority.
- [x] `projection/query_domain.ts`: read-only display only; no executable action
      authority.
- [x] live harness: proves non-close continuation through evaluate_next-owned
      intent, not installed-operator local branch.
- [x] RC report: summarizes closure/evaluate_next truth and does not derive its own
      traversal decision.

## Required Break Order

1. Inventory every production path that can dispatch a follow-up traversal.
2. Publish/consume the T-109 closure decision and evaluate_next projection carrier.
3. Break one installed-operator local branch and keep it broken until rebound
   through admitted intent.
4. Rebind the runner dispatch kernel to admitted `ConstructionIntent`.
5. Remove or demote old branch producers and display-only strings.
6. Rebind CLI, gaps, live harness, and RC summaries to the evaluate_next projection.
7. Reprice tests that accepted mixed local/evaluate_next authority.

## Break-To-Closure Map

- Breaking installed-operator local action branches closes the no-rival-runner
  clause.
- Breaking CLI retry/context injection closes the no-CLI-controller clause.
- Breaking prompt/postflight route authority closes the no-prompt-prose clause.
- Rebinding live harness and RC reports closes the public proof/read-model
  clause.

## Mixed-State Negative Proof

At least one test must construct a fixture where the old local branch says
`retry_same_edge` or repair while the evaluate_next projection does not select
that action. The run must fail closed or follow evaluate_next truth; the old
path must not dispatch work.

## Functional Spine

The runner must consume:

```text
synthesize_model(IntentLineage projection from event log, prior ProductAssetModel, admitted product truth)
-> ProductAssetModel
-> eval_gap(ProductAssetModel, RuntimeEventLog, RuntimeProjection, Worksite)
-> ObservationSnapshot
-> GapPressureRow
-> TargetObligationBinding
-> evaluate_next(NextActionBasis, gap, binding, ActionCatalog, Policy)
-> PriorityProjection
-> NextActionProjection
-> admit ConstructionIntent
-> ConstructionIntent
-> WorksiteEvidence
-> evaluate_action
-> SdlcEdgeFulfillmentLedger(declared obligations + admitted assessments)
-> SdlcEdgeClosureDecision
-> evaluate_next
-> NextActionProjection
```

The runner may invoke work only from admitted `ConstructionIntent`.

## State Flow Diagram

```mermaid
stateDiagram-v2
  [*] --> IntentEventsAdmitted

  IntentEventsAdmitted: ABG event log has StartIntent / construction intent / selected-intent events
  IntentEventsAdmitted --> IntentLineageProjected: project IntentLineage from event log

  IntentLineageProjected --> ProductModelSynthesized: synthesize_model
  ProductModelSynthesized: ProductAssetModel is product-owned model truth

  ProductModelSynthesized --> GapEvaluated: eval_gap
  GapEvaluated: ObservationSnapshot + GapPressureRow

  GapEvaluated --> TargetBound: bind gap pressure to exact target obligations
  TargetBound: TargetObligationBinding

  TargetBound --> InitialNextAction: evaluate_next(initial_selection)
  InitialNextAction: PriorityProjection + NextActionProjection

  InitialNextAction --> BlockedNoAction: no published lawful action
  InitialNextAction --> IntentAdmitted: selected published action

  IntentAdmitted: ConstructionIntent cites intent event refs, model ref, binding ref, next-action projection, selected action
  IntentAdmitted --> GraphActionInvoked: invoke admitted graph action

  GraphActionInvoked --> EvidenceAdmitted: admit worker/process/product/runtime evidence
  EvidenceAdmitted --> ActionEvaluated: evaluate_action
  ActionEvaluated: SdlcEdgeFulfillmentLedger + SdlcEdgeClosureDecision

  ActionEvaluated --> Closed: close
  ActionEvaluated --> Yielded: yield
  ActionEvaluated --> NeedsRetry: retry
  ActionEvaluated --> NeedsRepair: repair
  ActionEvaluated --> NeedsReentry: re-enter
  ActionEvaluated --> NeedsReprice: reprice
  ActionEvaluated --> Blocked: block

  Blocked --> [*]
  NeedsReprice --> [*]

  Closed --> PostActionNext: evaluate_next(post_close_graph_continuation)
  Yielded --> PostActionNext: evaluate_next(post_yield_resume)
  NeedsRetry --> PostActionNext: evaluate_next(post_retry)
  NeedsRepair --> PostActionNext: evaluate_next(post_repair)
  NeedsReentry --> PostActionNext: evaluate_next(post_reenter)

  PostActionNext: consumes closure decision + fresh eval_gap + binding + catalog + policy
  PostActionNext --> BlockedNoAction
  PostActionNext --> IntentAdmitted
  PostActionNext --> [*]: graph complete or no lawful action
```

State constraints:

- `IntentLineageProjected` is not a new ledger. It is a read model over admitted
  ABG events. Every action is still grounded in the event log.
- `ProductModelSynthesized` is product-owned model truth; it does not authorize
  traversal by itself.
- `InitialNextAction` and `PostActionNext` are the same `evaluate_next`
  function with explicit `NextActionBasis` values.
- `ActionEvaluated` emits dispositions only. Repair, retry, and re-entry become
  invocations only after `evaluate_next` selects a published graph action.
- `Closed` is not terminal by itself. It closes the current edge; whole-graph
  continuation is selected only by `evaluate_next(post_close_graph_continuation)`.
- `Yielded` returns control without failure classification and without local
  CLI looping.

## Design Constraint

This ticket does not invent a new ledger. T-109 owns
`SdlcEdgeFulfillmentLedger` and `SdlcEdgeClosureDecision`. This ticket wires the
installed runner to those carriers and classifies every other ledger/register as
an input record, derived read model, or legacy surface that cannot select
traversal.

This ticket also does not create a separate requirement-closure path. Requirement
truth feeds product/model/gap evaluation. Requirement fulfillment is evaluated
through the same declared-obligation assessment fold as every other edge. That
is the constitutional purpose of T-135: one total loop for observation,
obligation binding, action selection, evidence admission, edge closure, and next
action.

## Constitutional Amendment - 2026-05-10

T-135 is the constitutional runner-spine ticket, not just a local branch-removal
ticket. Its implementation target is the total consequence loop:

```text
transform action
-> F_P/F_D evaluation findings
-> admitted obligation assessments
-> SdlcEdgeFulfillmentLedger
-> SdlcEdgeClosureDecision
-> evaluate_next
-> admitted ConstructionIntent
-> next transform action
```

The bug found in the requirements lane was that an edge could treat
`worker_invoked` or requirement-marker echo as fulfillment. That made
requirements appear closed when the worksite only contained a requirement
surface. The amended rule is:

- `evaluate_action` owns closure.
- `evaluate_action` reads declared obligations and admitted assessments.
- Requirement documents are product/model truth, not closure truth.
- Requirement obligations remain pressure until admitted evidence proves
  fulfillment of the obligation.
- A worker invocation with no declared obligations fails closed; there is no
  synthetic fallback obligation that can convert process completion into edge
  fulfillment.
- Runner continuation consumes `SdlcEdgeClosureDecision` and
  `evaluate_next`; no requirement lane may bypass this fold.

## Codex Feedback Disposition - 2026-05-10

- [x] Reconciled close and graph continuation: `close` closes the current edge,
      while `evaluate_next(post_close_graph_continuation)` owns any next-edge
      selection.
- [x] Removed evaluator-as-admitter wording: `evaluate_next` emits
      `NextActionProjection`; a separate admission constructor admits
      `ConstructionIntent`.
- [x] Made initial traversal explicit: `initial_selection` does not fabricate a
      prior closure decision.
- [x] Added `start/public_start.ts` to the migration surface because public start
      currently resolves executable graph-function targets and must not remain a
      rival selector.
- [x] Replaced stale `cli/command.ts` checklist wording with current
      `spec_method/entry.ts` and `start/public_start.ts` surfaces.

Verification for the carrier-law correction:

```bash
npm run build:semantic
npm run lint:semantic
node --test test_env/tests/test_t136_yield_closure_disposition.test.mjs
node --test test_env/tests/test_t138_traversal_consequence_replayability.test.mjs
npm run test:t032
npm run test:t033
npm run test:t129
```

Passed build, lint, T-136 9/9, T-138 8/8, T-032 4/4, T-033 8/8, and T-129 10/10.

## Implementation Evidence - 2026-05-10

T-135 is implemented as the runner migration slice over the T-109 consequence
spine.

Applied changes:

- `start/public_start.ts` now resolves public start through
  `evaluate_next(initial_selection)`, constructs `SdlcNextActionProjection`,
  and admits `SdlcConstructionIntent` before an execution contract can dispatch
  graph work.
- `operator/installed_operator.ts` now archives admitted construction intent,
  worksite evidence, edge fulfillment ledger, closure decision, and follow-up
  next-action projection for each installed run.
- Installed-operator continuation now consumes
  `installedStartHasEvaluateNextTraversalTruth`; legacy local strings such as
  same-edge retry, repair re-entry, archive inspection, and F_P escalation are
  no longer traversal authority.
- `spec_method/entry.ts` preserves replay basis for observed starts by matching
  replayed graph-function runs instead of re-resolving `next` against current
  workspace state.
- Existing semantic/sandbox expectations were repriced where they encoded the
  old broad bootstrap/release path instead of the current published graph action
  selected by the evaluate_next path.
- `deriveSdlcEdgeFulfillmentCountsFromAssessments` now fails closed when an
  edge has no declared obligations, even if the worker invocation completed.

Focused proof:

```bash
npm run test:t135
# 7/7 passed

npm run test:t033
# 8/8 passed

npm run test:t137
# 5/5 passed

npm run test:t091
# 5/5 passed

node --test test_env/tests/test_t136_yield_closure_disposition.test.mjs
# 9/9 passed

node --test test_env/tests/test_t138_traversal_consequence_replayability.test.mjs
# 8/8 passed
```

Regression proof:

```bash
npm run lint:semantic
# passed

npm run test:t058
# 8/8 passed

npm run test:t064
# 9/9 passed

npm run test:t066
# 27/27 passed

npm run test:t076
# 2/2 passed

npm run test:t087
# 1/1 passed

npm run test:t096
# 1/1 passed

npm run test:t098
# 1/1 passed

npm run test:semantic
# 319/319 passed on 2026-05-10

npm run test:sandbox
# 15/15 passed on 2026-05-10 after no-declared-obligation fail-closed patch

git diff --check
# passed
```

Closure finding: T-135's implementation no longer has a production runner path
that can dispatch graph work from public gaps rows, gap-dossier action strings,
prompt prose, CLI loop state, or postflight summary text. Runner dispatch is
now rooted in admitted construction intent derived from evaluate_next over the
published action surface.

## Implementation Notes

- Start by locating every call path that can cause a follow-up traversal.
- Replace local branch selection with evaluate_next-selected intent consumption.
- Preserve effect boundaries: ABG/odd_sdlc admission writes events/evidence;
  F_P workers do not write ledger truth.
- Keep public gaps read-only. It can display evaluate_next truth, not execute it.
