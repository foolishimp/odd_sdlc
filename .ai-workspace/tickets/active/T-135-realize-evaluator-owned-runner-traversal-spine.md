---
id: T-135
title: Realize evaluator-owned runner traversal spine
type: feature
ticket_category: implementation_migration
status: active
review_status: triaged_pending_implementation
goal: typescript-rc-one-traversal-consequence-surface
build_tenant: typescript
owner: odd_sdlc
change_intent: Implement the T-109 axiomatic traversal consequence surface so the installed runner consumes evaluator/closure truth to decide graph invocation instead of local retry strings, prompt prose, CLI loops, or installed-operator summaries.
change_class: realization_refactor
re_entry_point: code
affected_boundary:
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts
  - build_tenants/typescript/code/src/assurance/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
priority: critical
rc_blocker: true
release_blocker_reason: Runner traversal still has local action-selection authority instead of the T-109 evaluator/closure surface.
migration_strategy: inside_out_hard_break
library_usage: consume
governing_library: T-109 traversal consequence carriers and ABG 3.7.1 construction evaluator substrate
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-109 publish authoritative edge ledger lineage chain
  - T-136 add yield closure disposition and resume basis
  - T-137 enforce target obligation binding and published action law
  - T-138 preserve causal chain and replayability for traversal consequence
related_tickets:
  - T-129 ABG 3.7.1 evaluator and liveness substrate migration
  - T-134 define bootstrap_sdlc induction graph function
  - T-133 create minimum overhead Rust hello-world live lane
intake_source: The T-109 axiom review established that the target loop is ObservationSnapshot -> TargetObligationBinding -> PriorityProjection -> ConstructionIntent -> WorksiteEvidence -> SdlcEdgeFulfillmentLedger -> SdlcEdgeClosureDecision -> EvaluatorProjection. The installed runner still has local branch authority and must be changed to consume this one consequence surface.
target_truth: The installed runner invokes graph work only from an admitted evaluator-selected ConstructionIntent derived from SdlcEdgeClosureDecision plus current observed truth. Default graph following is itself an evaluator decision. No local string branch, CLI loop, prompt instruction, postflight summary, or gap-dossier action list can independently decide the next traversal.
superseded_truth: installed_operator.ts locally chooses retry_same_edge, repair, re-entry, archive inspection, or broad graph continuation from gap-action strings and local loop state.
closure_law: This ticket closes only when the installed start path consumes one evaluator projection for next traversal, deterministic tests prove no rival decision path can invoke work, and a live/sandbox runner proof shows a non-close edge continues through evaluator-owned intent rather than local installed-operator branching.
evaluation_criteria:
  - Runner entry obtains the current SdlcEdgeClosureDecision from T-109 closure truth.
  - Runner re-observes runtime/worksite truth after evidence admission before evaluating the next action.
  - Runner calls evaluator projection to select the next ConstructionIntent when the closure disposition requires an action.
  - Default sequential graph following is expressed as an evaluator-selected action.
  - `yield` returns control without invoking a new graph action.
  - `close` closes the current edge without selecting a next graph action unless whole-graph continuation is separately selected by the evaluator.
  - `retry`, `repair`, `re-enter`, and `reprice` can only invoke work through published graph/action catalog rows.
  - Local strings such as `retry_same_edge_with_gap_dossier`, `plan_repair_reentry_with_gap_dossier`, and `inspect_worker_archive` are removed as traversal authorities or reduced to display labels over evaluator truth.
  - CLI command code parses intent and renders projection; it does not own retry iteration or synthesize retry context.
  - A negative test proves a locally fabricated gap-dossier action cannot cause runner invocation without evaluator/admission truth.
  - A positive test proves a current graph edge is followed when no higher-priority lawful action exists and no yield disposition is active.
  - A positive test proves a higher-priority lawful action selected by evaluator overrides ordinary graph following.
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t135_evaluator_owned_runner_spine.test.mjs
  - build_tenants/typescript/test_env/live/
  - runtime operator-run event archives showing admitted intent, evidence, ledger, closure decision, evaluator projection, and graph invocation refs
non_closure_conditions:
  - installed_operator.ts still decides the next traversal by inspecting local action strings.
  - CLI command code loops over start attempts and injects retry context as business logic.
  - A worker prompt or postflight text can directly choose retry/repair/re-entry.
  - Public gaps read-only output is reused as executable runner authority.
  - Default graph following bypasses evaluator projection.
---

# T-135: Realize Evaluator-Owned Runner Traversal Spine

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

Change-class note: this is a realization refactor only under the T-109 design
surface. This ticket cannot close until T-109 ratifies the axiomatic closure
target it implements.

The T-109 design target is now explicit. The missing implementation is the
runner consequence path. Current code can preserve evaluator/gap truth and still
invoke the next step through local installed-operator branching. That violates
the one-surface axiom.

## Migration Declaration

- migration strategy: `inside_out_hard_break`
- old truth path: installed-operator local branches, gap-dossier action strings,
  CLI retry/context injection, prompt-pressure route prose, and postflight
  summaries decide follow-up traversal.
- new truth path: `SdlcEdgeClosureDecision` plus current observation feeds
  `EvaluatorProjection`, which admits `ConstructionIntent`; the runner invokes
  graph work only from that admitted intent.
- old producers: `installed_operator.ts`, CLI start loops, handoff prompt
  assembly, gap dossier action lists, assurance/postflight summary strings.
- new producers: T-109 closure decision fold, ABG/odd_sdlc evaluator projection,
  admitted construction intent, runtime event/evidence admission.
- old consumers: installed start runner, CLI command adapter, live harness,
  public gap summaries, RC report summaries.
- new consumers: installed runner, public gaps/read models, CLI rendering, live
  harness reports, RC reports.
- projections/proof surfaces: operator-run event archive, edge fulfillment
  ledger, closure decision projection, evaluator projection, CLI/gaps JSON,
  live/sandbox runner tests.
- migration closure: no production invocation path can dispatch graph work from
  local strings, prompt prose, CLI loop state, or public read-only gaps output.

## Migration Checklist

- [ ] old truth path is named explicitly
- [ ] new truth path is named explicitly
- [ ] producer set for the new truth is listed
- [ ] consumer set for the new truth is listed
- [ ] projection/read-model surfaces are listed
- [ ] old truth path is removed or explicitly demoted from authority
- [ ] mixed-state behavior is no longer accepted as closure evidence
- [ ] tests proving mixed old/new behavior are removed or repriced
- [ ] recurring realization patterns are checked against existing library/commonization surfaces
- [ ] ticket declares library usage and names the governing library or rationale
- [ ] if the work exists in more than one build tenant, this backlog/active ticket carries only one tenant lifecycle and any sibling tenant work lives on its own suffixed ticket
- [ ] ticket wording, product wording, and proof claims are reconciled before closure

## Functional Review Criteria

- [ ] Traversal selection is carrier-owned by closure/evaluator/intent truth,
      not control-flow-owned by installed-operator branches.
- [ ] The runner consumes admitted carriers directly and does not reconstruct
      authority from strings, payload fallback, prompt text, or public gaps rows.
- [ ] Effects remain at the edge: worker invocation happens after admitted
      intent, not during evaluator/source-truth interpretation.
- [ ] Positive tests prove default graph following and priority override through
      evaluator projection.
- [ ] Negative tests prove local fabricated actions and public read-only gaps
      rows cannot invoke work.

## Impacted Interface Review Checklist

- [ ] `installed_operator.ts`: dispatches only from admitted evaluator-selected
      construction intent.
- [ ] `cli/command.ts`: parses command intent and renders projection; no retry
      business loop or retry-context synthesis.
- [ ] `operator/handoff.ts`: prompt packages may carry context, but not route
      authority.
- [ ] `projection/query_domain.ts`: read-only display only; no executable action
      authority.
- [ ] live harness: proves non-close continuation through evaluator-owned
      intent, not installed-operator local branch.
- [ ] RC report: summarizes closure/evaluator truth and does not derive its own
      traversal decision.

## Required Break Order

1. Inventory every production path that can dispatch a follow-up traversal.
2. Publish/consume the T-109 closure decision and evaluator projection carrier.
3. Break one installed-operator local branch and keep it broken until rebound
   through admitted intent.
4. Rebind the runner dispatch kernel to admitted `ConstructionIntent`.
5. Remove or demote old branch producers and display-only strings.
6. Rebind CLI, gaps, live harness, and RC summaries to the evaluator projection.
7. Reprice tests that accepted mixed local/evaluator authority.

## Break-To-Closure Map

- Breaking installed-operator local action branches closes the no-rival-runner
  clause.
- Breaking CLI retry/context injection closes the no-CLI-controller clause.
- Breaking prompt/postflight route authority closes the no-prompt-prose clause.
- Rebinding live harness and RC reports closes the public proof/read-model
  clause.

## Mixed-State Negative Proof

At least one test must construct a fixture where the old local branch says
`retry_same_edge` or repair while the evaluator projection does not admit that
intent. The run must fail closed or follow evaluator truth; the old path must
not dispatch work.

## Functional Spine

The runner must consume:

```text
ObservationSnapshot
-> TargetObligationBinding
-> PriorityProjection
-> ConstructionIntent
-> WorksiteEvidence
-> SdlcEdgeFulfillmentLedger
-> SdlcEdgeClosureDecision
-> EvaluatorProjection
```

The runner may invoke work only from admitted `ConstructionIntent`.

## Design Constraint

This ticket does not invent a new ledger. T-109 owns
`SdlcEdgeFulfillmentLedger` and `SdlcEdgeClosureDecision`. This ticket wires the
installed runner to those carriers.

## Implementation Notes

- Start by locating every call path that can cause a follow-up traversal.
- Replace local branch selection with evaluator-selected intent consumption.
- Preserve effect boundaries: ABG/odd_sdlc admission writes events/evidence;
  F_P workers do not write ledger truth.
- Keep public gaps read-only. It can display evaluator truth, not execute it.
