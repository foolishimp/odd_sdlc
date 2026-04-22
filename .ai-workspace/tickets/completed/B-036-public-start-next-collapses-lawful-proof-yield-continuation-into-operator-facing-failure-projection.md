---
id: B-036
title: Public odd_sdlc start next collapses lawful proof-yield continuation into operator-facing failure projection
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: lawful-yielded-repair-continuation
change_intent: Rebind public odd_sdlc start so proof-driven repair and review continuations surface through the public yield contract instead of being projected as operator-facing failure, preserving lawful progression under the same published carrier model.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: public odd_sdlc start until=converged, ABG dispatch/result-ingest continuation semantics, recovery contract projection, live run status, and RC operator proof lanes
priority: high
triaged_at: 2026-04-22
created_at: 2026-04-22
updated_at: 2026-04-23
dependencies: B-035 active
intake_source: RC forensic comparison over data_mapper.test35 and data_mapper.test36 showing that test36 stops on derive_test_run_archive_surface proof failure even though result-ingest opens a repair continuation, while user clarified that yield exists to provide the lawful progression surface and that F_P processing does not define a separate true-terminal branch here
target_truth: when public odd_sdlc start encounters a proof-driven continuation such as repair or fh_review while traversing target=next, it yields a governed recovery contract with the lawful next step; the public boundary must not reinterpret that yielded continuation as operator-facing failure, so progression remains carrier-owned and inspectable
superseded_truth: public odd_sdlc start currently collapses continuation-opened truth into a failure-shaped public result when dispatch_result is projected through the app boundary, forcing operators to infer the next lawful step from raw events or manually inspect artifacts rather than receiving a yielded recovery contract
closure_law: this migration closes only when proof-driven repair or review continuations are surfaced through the public yield contract, source and installed proofs show the yielded recovery path, and run forensics no longer require replaying raw event internals to discover that lawful continuation existed or whether the public surface misprojected it as failure
evaluation_criteria:
  - public odd_sdlc start distinguishes true runtime failure with no lawful continuation from lawful continuation-opened states
  - when result-ingest emits continuation_opened kind=repair or kind=fh_review during start target=next until=converged, the public result surfaces yield semantics rather than failure-shaped public projection
  - yielded results expose the governing continuation identity, failure class, and lawful next-step contract without requiring manual event-log archaeology
  - the yielded recovery contract remains derived from published carrier truth rather than controller-local heuristics
  - source and installed proofs show that proof failure on a later edge can stop constructive traversal for the current call while still preserving lawful progression through yield
  - transport-failure-preserved-artifact normalization is treated as a separate residual boundary unless this ticket's proof demonstrates it directly changes yielded repair semantics
non_closure_conditions:
  - public start returns status=error or stopped_by=fp_runtime_failure when a repair or fh_review continuation is already open and lawful next-step information exists
  - the only way to discover lawful continuation is by manually replaying continuation_opened events in events.jsonl
  - proof lanes still treat current-call stop as the same thing as absence of lawful continuation
  - source and installed proofs diverge on whether yielded continuation is surfaced
proof_surface:
  - source reproducer for proof_failed -> continuation_opened(kind=repair) under public start next until=converged
  - installed reproduction over data_mapper.test36 style workspace after B-035 is installed
  - live run status / recovery contract inspection proving that yield is surfaced at the public boundary
  - regression proof that true transport failure without lawful continuation still returns failure projection and does not counterfeit yield
---

## Process-Model Declaration

This ticket adopts the stronger design-method reading of the public process
model:

- F_P processing does not create a separate public semantic branch of "complete
  or terminal error" for proof-driven continuation cases
- proof failure may stop the current constructive call, but if ABG opens a
  lawful continuation the correct public semantic is `yield`
- public failure projection is lawful only when no continuation-owned next step
  exists

So the defect is not "F_P terminality." The defect is public misprojection of
continuation-owned truth.

## Migration Declaration

- old_truth_path: ABG result-ingest opens `continuation_opened` for `repair` or `fh_review`, but public `odd_sdlc start --target next --until converged` projects that yielded continuation as failure-shaped result when the app boundary sees `dispatch_result.status == error`, so the lawful continuation contract is hidden behind raw event replay
- new_truth_path: public `start` consumes one domain-owned public-start iteration carrier in `odd_sdlc.public_start`, so `gen_start` and dispatch results are each projected exactly once into typed outcomes (`republish_and_continue`, `dispatch_required`, `human_gate_required`, `return`). Proof-driven continuation-opened states surface yielded progression through that carrier, while true no-continuation defects preserve failure projection
- producers_old:
  - `genesis.result_ingest.ingest_fp_result(...)`
  - `genesis.dispatch_runtime.dispatch_bound_manifest_via_transport(...)`
  - `odd_sdlc.app._run_public_next_start(...)` terminal error branch
- producers_new:
  - continuation-opened projection from ABG result-ingest
  - `odd_sdlc.public_start.project_public_start_gen_start_outcome(...)`
  - `odd_sdlc.public_start.project_public_start_dispatch_outcome(...)`
  - operator-facing live run status and installed CLI surface
- consumers_old:
  - public `odd_sdlc start --target next --until converged`
  - RC operator review over `events.jsonl`
  - sandbox/install proofs that only see failure-shaped public result
- consumers_new:
  - public `odd_sdlc start --target next --until converged`
  - yielded recovery/usecase flows
  - RC operator review over public recovery contract
- derived_surfaces:
  - `.ai-workspace/events/events.jsonl`
  - `.ai-workspace/runtime/active-workflow.json`
  - fp manifests / fp results
  - live run status projection
  - public start payload

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection and read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old and new behavior are removed or repriced
- [x] ticket wording, design wording, and proof claims are reconciled before closure

## Progress Notes

### 2026-04-23 - Lane 3 Slice 1 Landed

- `odd_sdlc.public_start` now owns the typed public-start iteration outcome
  contract
- `odd_sdlc.app._run_public_next_start(...)` consumes that contract instead of
  classifying yield/failure/progress inline over raw `status` strings
- source proofs now cover:
  - dispatch-required -> proof-hold stop before dispatch
  - yielded dispatch result through `start(next)`
- true no-continuation runtime failure through `start(next)`
- installed yielded-handoff proof remains green after the refactor

### 2026-04-23 - Continuation Re-Entry Carrier Slice Landed

- `odd_sdlc.continuation.continue_with_result(...)` now refreshes analysis,
  republishes the workspace gap-dossier carrier, and derives its returned
  `gap_snapshot` / `status` from that published carrier instead of a separate
  unpublished `gap_snapshot(app)` path
- this closes the installed divergence where `continue` reported
  `gap_snapshot.converged = false` but the next public `start(next)` consumed a
  stale dossier and returned `converged`
- source proof now locks the continuation seam:
  `test_continue_with_result_publishes_workspace_gap_surface_and_uses_published_status`
- installed proof now locks the public re-entry path:
  `test_data_mapper_continue_command_admits_result_refreshes_analysis_and_advances_start`
- the remaining installed yield-usecase lane is green under the current line:
  - `test_data_mapper_yield_chain_surfaces_asset_event_and_result_truth`
  - `test_data_mapper_yield_chain_projects_run_continuation_and_gap_truth`
  - `test_data_mapper_continue_command_preserves_yielded_handoff_truth`
  - `test_data_mapper_yield_chain_reissues_fresh_handoff_on_a_fresh_workspace`

## Closure Note

This ticket closes on the current `odd_sdlc` source line because the public
yield boundary and the continuation re-entry boundary now agree on one carrier
story:

- public `start(next)` yields lawful continuation for proof-driven continuation
  states through `odd_sdlc.public_start`
- true no-continuation runtime failure still projects as failure
- public `continue` republishes and returns the same published gap-dossier
  carrier that the next public `start` consumes

Closure proof on the current source line:

- source public-start / continuation bundle:
  - `test_project_public_start_gen_start_outcome_projects_proof_hold_before_dispatch`
  - `test_start_next_converged_surfaces_yielded_dispatch_contract`
  - `test_start_next_converged_preserves_true_runtime_failure_without_continuation`
  - `test_continue_with_result_publishes_workspace_gap_surface_and_uses_published_status`
  - result: `4 passed, 79 deselected`
- installed yield-usecase proofs:
  - `test_data_mapper_continue_command_admits_result_refreshes_analysis_and_advances_start`
    -> `1 passed, 4 deselected`
  - `test_data_mapper_yield_chain_surfaces_asset_event_and_result_truth`
    -> `1 passed, 4 deselected`
  - `test_data_mapper_yield_chain_projects_run_continuation_and_gap_truth`
  - `test_data_mapper_continue_command_preserves_yielded_handoff_truth`
  - `test_data_mapper_yield_chain_reissues_fresh_handoff_on_a_fresh_workspace`
    -> `3 passed, 2 deselected`

## Existing Live Reproduction

`data_mapper.test36` demonstrates the problem after unlawful B-035 admission and later proof failure:

1. constructive work progresses through later bootstrap edges
2. `derive_test_run_archive_surface` emits `proof_failed`
3. the same run also emits `continuation_opened` with `continuation_kind=repair`
4. the public run is still reported as terminal failure rather than as a yielded lawful next step

This means the event stream already contains a continuation contract, but the
public progression surface collapses that contract into a failure-shaped stop.

## Expected Yield Flow

When a later constructive edge fails proof but opens a lawful continuation:

1. the current call may stop progressing further constructive work
2. result-ingest emits `continuation_opened`
3. public `start` returns a yielded recovery contract, not a failure-shaped public result
4. the yielded contract names:
   - continuation id
   - continuation kind
   - failing edge
   - failure class
   - lawful next step (`continue`, `assess-result`, FH review, or equivalent)
5. operator or agent can resume through the yielded contract without replaying raw event internals

## Functional Review Criteria

Review this ticket as a yield-contract migration and public-process-model fix,
not as a generic retry loop.

Every implementation and review pass must ask:

1. Did the slice surface an existing lawful continuation through the public contract, or did it silently auto-repair?
2. Does yield remain the governing progression surface after proof-driven failure?
3. Is the recovery contract derived from emitted continuation truth rather than controller-local guesses?
4. Does the public result distinguish failure with no lawful continuation from lawful continuation-opened states?
5. Under `DESIGN_MODULE_METHOD.md`, is continuation meaning carried by one typed projection rather than duplicated in app/controller branches and ad hoc CLI text?
6. Do tests prove both the positive yield case and the negative true-terminal-failure case?
7. Does the review keep transport-salvage masking separate unless it directly changes whether a lawful continuation exists?

## Required Break Order

1. write minimal source proof for `proof_failed -> continuation_opened(kind=repair)` under public `start(next)`
2. project continuation-opened runtime truth into one typed public recovery carrier
3. rebind public `start(next) --until converged` so repair/fh_review continuation-opened states return yield rather than terminal error
4. prove that true transport failure with no lawful continuation still returns failure projection
5. reprice installed RC proof over `data_mapper.test36` style workspaces
6. reconcile operator/live-status surfaces to the yielded recovery contract

## Break-To-Closure Map

- Break 1 closes the reproduction clause
- Breaks 2-3 close the public-yield semantic clause
- Break 4 closes the negative-proof clause
- Break 5 closes the installed-proof clause
- Break 6 closes the operator-forensics clause

## Mixed-State Negative Proof

Closure requires proof that the following mixed state is impossible:

1. `continuation_opened(kind=repair|fh_review)` exists for the current public run
2. the public start result still reports only failure-shaped output with no yielded recovery contract

If that mixed state is still observable, this ticket remains open.

## Initial Design Diagnosis

Current root-cause diagnosis:

- ABG result-ingest already distinguishes proof-driven continuation from bare runtime failure by emitting `continuation_opened`
- public `odd_sdlc start` currently collapses those states together because it returns immediately on `dispatch_result.status == error`
- this defeats the purpose of yield as a lawful progression surface and pushes operator recovery back into raw event archaeology

The next lawful surface is therefore not “auto retry everything.” It is:

- one public yielded recovery contract
- derived from emitted continuation truth
- preserving manual/agent-governed progression through the next lawful step
