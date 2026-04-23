---
id: B-041
title: F_P semantic-convergence failures on realization edges route to fixed-vector repair and cap realization depth at the first dispatch
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: lawful-realization-edge-deepening-through-iteration
change_intent: Stop the odd_sdlc triage-route policy from short-circuiting the F_D carry-convergence retry loop when an F_P semantic-convergence evaluator also fails on a realization-producing edge. The F_D carry-delta check already carries lawful termination semantics for realization iteration — it is non-zero while obligations remain, and it drains when the builder has nothing more to admit. The current bug is that F_P `<edge>_semantically_converged` failure routes to `repair_output_contract` fixed vectors that preempt that loop, capping the realization builder at one turn. The fix is to distinguish deepening-eligible F_P failure from structurally-terminal F_P failure (schema, missing artifact, evaluator config) and, for the deepening-eligible class, let re-dispatch continue under the existing F_D carry-convergence authority. odd_sdlc should not invent retry budgets, monotone-depth gain checks, turn counters, or any other rival assessment surface — the realization builder (Claude) already makes those judgments; odd_sdlc's job is to dispatch and to surface the prior-turn state so the builder has continuity.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc vector-declaration and triage-route policy for F_P realization-edge evaluators, evaluator classification (deepening-eligible vs structurally-terminal) for `code_surface_semantically_converged` and peer evaluators, start-target/query publication of that classification, prompt-assembly continuity (so re-dispatched realization edges see prior-turn manifest/result state), and the downstream realization-artifact surfaces (`build_tenants/<tenant>/cdme-*/src/main/**`, `build_tenants/<tenant>/test_env/tests/**`) produced by those edges. Explicitly *not* in scope: any agent-judgment surface prohibited by B-042's Governance Boundary Checklist (retry budget, turn counter, monotone-depth gain rule, depth score, or equivalent framework-owned replacement for builder judgment) — B-042 is the authoritative enumeration; B-041 must not reintroduce anything on that list under a new name.
priority: high
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-23
dependencies: B-042 completed (**governance-boundary law: odd_sdlc is governance and observability, not the agentic coder**; B-041 is a specific realization-edge instance of that broader boundary and now lands on the cleaned governance surface); B-037 active (test-lane boundary repair may interact with this ticket's realization-edge retry behavior on `derive_test_module_surface`); B-040 completed (public-start typed carrier family work closed the typed ingress seam this ticket now publishes through); independent of ABG transport salvage — this ticket is not about transport failure
intake_source: cross-workspace forensic comparison recorded at `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/CODE_QUALITY_AND_TRAVERSAL_11_28_31_32_33_34_35_38.md` §7.9 and §12.2; live evidence from `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test38/.ai-workspace/fp_manifests/derive_code_surface_20260422T192259187280Z.json` (single-dispatch run) against `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_manifests/derive_code_surface_*.json` (16 dispatches from 20260419T115454Z to 20260419T122357Z). Direct side-effect: test38 produced 48 main `.scala` files / 2,332 LOC at B/C+ depth; test35 under genesis v3.1.0+ledger produced 103 files / 5,138 LOC at A/B depth from the same design surface family
target_truth: odd_sdlc carries one explicit classification of F_P realization-edge evaluators: **deepening-eligible** (the LLM builder can heal the failure with another turn against a richer prior-turn context — `code_surface_semantically_converged`, `implementation_module_surface_semantically_converged`, `test_module_surface_semantically_converged`, `test_design_surface_semantically_converged`) versus **structurally-terminal** (an additional turn cannot heal the failure — schema violations, missing artifacts, evaluator-config defects). The triage-route policy maps deepening-eligible F_P failures back into the existing F_D carry-convergence retry path; they do not preempt that loop. F_D carry-convergence remains the authoritative termination signal for realization iteration — odd_sdlc does not introduce a parallel retry budget, turn counter, or monotone-depth-gain calculator. The realization builder's prompt continues to receive the prior-turn fp_manifest/fp_result digest so that the builder (Claude) can itself assess whether it is deepening, stalling, or done, and write accordingly. Structurally-terminal F_P failure continues to route to `repair_output_contract` fixed vectors.
superseded_truth: the current policy treats F_P `<edge>_semantically_converged` failures on realization edges as structurally terminal for the current turn and routes them to `repair_output_contract` fixed vectors. Under genesis v3.1.0+ledger, these edges ran under an F_D-only carry-convergence evaluator with implicit retry authorization, and iteration deepened the realization until delta drained. Under odd_sdlc, the addition of the F_P semantic-convergence evaluator plus the fixed-vector route caps dispatch at one turn even when the F_D carry-convergence evaluator is still failing with non-zero delta. The route policy is therefore carrying two contradictory laws simultaneously: carry-convergence says "more code needed, iterate"; semantic-convergence routes say "emit a repair vector, stop dispatching". The resulting behavior is a silent realization-depth cap that looks like disciplined convergence but is actually a retry-authorization defect.
closure_law: this migration closes only when (1) every F_P realization-edge evaluator carries an explicit `deepening_eligible` vs `structurally_terminal` classification on the current tree; (2) deepening-eligible F_P failures alongside a non-zero F_D carry-delta no longer route to `repair_output_contract` fixed vectors — the triage-route policy re-enters the existing F_D carry-convergence retry path; (3) F_D carry-convergence remains the sole termination signal for realization iteration — no retry budget, no turn counter, no monotone-depth gain calculator is introduced as a rival authority; (4) realization builder prompt assembly carries the prior-turn fp_manifest / fp_result digest into the next turn's `[CONTEXT]` so the builder has continuity and can assess its own progress; (5) a negative proof demonstrates that removing the classification collapses the route back to fixed-vector fail in a closed-fail manner, reproducing the test38 single-dispatch cap without hiding it; (6) the bounded slice runs clean under one strict static-typing lane over the classification carrier and the triage-route consumers per `DESIGN_MODULE_METHOD.md §4A`. Empirical depth-band evidence on a data_mapper-shaped workspace (test35-comparable ~5,000 LOC, ~100 cdme-* files, A/B grade) is retained as secondary calibration evidence — the closure axis is route-policy correctness, not realized depth.
evaluation_criteria:
  - every F_P evaluator registered for a realization-producing edge carries an explicit `deepening_eligible: bool` classification (or equivalent typed discriminator) on the current tree
  - the triage-route policy distinguishes the two classes: deepening-eligible F_P failure with non-zero F_D carry-delta re-enters the existing F_D retry path; structurally-terminal F_P failure routes to `repair_output_contract` as today
  - odd_sdlc introduces no new agent-judgment surface of any form named in B-042's Governance Boundary Checklist — the framework does not reproduce any assessment the LLM builder (Claude) already performs
  - F_D carry-convergence remains the sole authoritative termination signal for realization iteration, consumed directly by the dispatch loop without a parallel authority surface
  - realization-edge prompt assembly carries the prior-turn fp_manifest / fp_result digest into the next turn's `[CONTEXT]` block — this is observability (state visible to the agent), not governance (the agent decides what to do with it)
  - the triage dossier records the classification decision (deepening_eligible vs structurally_terminal, evaluator id, edge id) so operators can observe why retry did or did not continue
  - calibration (not sole closure evidence): on a fresh data_mapper-shaped workspace under odd_sdlc with fully declared execution contracts and an adopted realization method, derive_code_surface produces a realization depth band matching or exceeding test35's A/B A-grade profile (~5,000 LOC across ~100 files for the reference cdme-* module set). This corroborates the classification is correctly wired; it is not a substitute for the invariants in `closure_law`
  - negative proof: a fresh workspace where the classification is disabled reproduces test38's 48-file / 2,332-LOC / B-band outcome in a closed-fail manner, confirming the route-policy change is the cause
  - the classification is expressed as typed data on each evaluator registration per `DESIGN_MODULE_METHOD.md §4A` (no semantic `Any`, no semantic `dict[str, Any]`, no open-dict `.get(...)` chains at this seam)
  - source and installation proofs exercise the deepening-eligible vs structurally-terminal boundary on a scala_spark workspace
non_closure_conditions:
  - deepening-eligible F_P semantic-convergence failure still routes to `repair_output_contract` fixed vectors when F_D carry-delta is non-zero
  - the fix introduces any surface prohibited by B-042's Governance Boundary Checklist (retry budget, turn counter, gain rule, depth score, imperative builder strategy, builder-choice fixed vectors from local heuristics, or equivalent) — **odd_sdlc is governance and observability, not the agentic coder**
  - closure is claimed from a one-off prompt fix, a larger source-asset snapshot budget, or a context-window increase, without fixing the F_P classification and route-policy defect
  - closure is claimed while the F_D carry-convergence evaluator still reports non-zero delta at dispatch exit for a realization edge that is classified deepening-eligible
  - the policy is fixed for one edge (for example derive_code_surface) without being generalized across the realization-producing edge family (derive_implementation_module_surface, derive_test_module_surface, derive_test_design_surface, and any peer edges)
  - DESIGN_MODULE_METHOD Prime Law is cited as justification for the current behavior; the Prime Law narrows type proliferation per edge, not the number of lawful builder turns per edge
  - the prior-turn fp_manifest / fp_result digest is not carried into the next turn's `[CONTEXT]`, so re-dispatched builders regenerate blind rather than observing their own prior output
  - the classification is carried as an open `dict[str, Any]` or `Mapping[str, Any]` at the evaluator-registration seam rather than as typed data
  - B-041 closes while B-042's Drift Surface Inventory still shows unretired strategy surfaces — B-041's continuity seam runs into a builder lane that still receives strategy-bearing runtime contexts, which makes the fix pass local tests while the boundary violation remains; both tickets must close together
proof_surface:
  - source reproducer covering derive_code_surface under F_P + F_D mixed failure
  - installed reproduction over a fresh data_mapper-shaped scala_spark workspace proving repeated `derive_code_surface` dispatch, published `realization_iteration` continuity, and absence of the old single-dispatch cap on the same design input family
  - event-forensic review around `proof_failed`, `observation_recorded`, `route_recorded`, and `continuation_opened` events on realization edges for both substrates
  - dispatch-count verification across `.ai-workspace/fp_manifests/derive_code_surface_*.json` and peer realization-edge manifest families before and after the fix
  - strict static-typing proof for the evaluator-registration annotation and the triage-route consumers
  - negative proof that disabling the classification (or forcing all F_P to structurally-terminal) reproduces the single-dispatch cap in a closed-fail manner
---

## Migration Declaration

- old_truth_path: realization-edge triage routes any F_P `<edge>_semantically_converged` failure to a `repair_output_contract` fixed vector that preempts the existing F_D carry-convergence retry loop, so the realization builder is capped at one turn even when F_D carry-delta is non-zero. F_P evaluators carry no classification indicating whether an additional builder turn could heal them.
- new_truth_path: F_P evaluator registrations for realization-producing edges carry an explicit `deepening_eligible` discriminator. The triage-route policy uses that discriminator to decide whether a failure re-enters the existing F_D retry path or emits a fixed-vector repair. F_D carry-convergence remains the sole termination signal. odd_sdlc introduces no retry budget, turn counter, or gain calculator — the LLM builder's own judgment remains the agentic assessment surface, and the framework's role is to dispatch lawfully and publish prior-turn state for continuity.
- producers_old:
  - `build_tenants/python/code/odd_sdlc/triage.py` route-table mapping for `<edge>_semantically_converged` that uniformly emits fixed-vector repair
  - `build_tenants/python/code/odd_sdlc/gtl_module.py` vector declarations without deepening-eligible classification
  - realization-builder prompt assembly that does not carry the prior-turn fp_manifest / fp_result digest into `[CONTEXT]`
- producers_new:
  - `build_tenants/python/code/odd_sdlc/gtl_module.py` vector declarations annotated with typed `fp_retry_policy` per realization-edge F_P evaluator
  - `build_tenants/python/code/odd_sdlc/triage.py` consuming that annotation directly — deepening-eligible F_P with non-zero F_D carry re-enters the existing F_D loop; structurally-terminal F_P still routes to fixed-vector repair
  - `build_tenants/python/code/odd_sdlc/start_targeting.py` and `build_tenants/python/code/odd_sdlc/gap_dossier.py` publishing the classification as read-model state
  - realization-builder prompt assembly extended to include the prior-turn fp_manifest / fp_result digest in `[CONTEXT]` for re-dispatched turns (continuity, not assessment)
  - proofs over a reference realization edge that exercise the deepening-eligible route through to F_D carry drain on a fresh workspace
- consumers_old:
  - public `start --target next --until converged`
  - realization-edge triage dossiers (classification absent)
  - downstream surfaces: `build_tenants/<tenant>/cdme-*/src/main/**`, `build_tenants/<tenant>/test_env/tests/**`
  - operator interpretation of whether a realization edge has lawfully deepened or has been silently capped
- consumers_new:
  - public `start --target next --until converged`
  - realization-edge triage dossiers that record `{edge_id, evaluator_id, deepening_eligible, dispatch_index, carry_delta}` as observability state
  - realization builder prompt assembly (prior-turn continuity)
  - installed RC review over data_mapper-style workspaces exercising the deepening-eligible path
- derived_surfaces:
  - `.ai-workspace/fp_manifests/<realization_edge>_*.json` dispatch streams
  - `.ai-workspace/fp_results/<realization_edge>_*.json`
  - `.ai-workspace/events/events.jsonl` event stream (route_recorded, run_started, run_completed, proof_failed)
  - gap dossier surface for realization edges
  - `build_tenants/<tenant>/cdme-*/src/main/**` and related realization artifact trees

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection and read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority (F_P uniformly routed to fixed-vector repair is no longer authoritative)
- [x] mixed-state behavior is no longer accepted as closure evidence (single-dispatch cap on deepening-eligible F_P failure no longer silently passes)
- [x] tests proving single-dispatch convergence with non-zero F_D carry-delta are removed or repriced
- [x] no artifact in the bounded slice introduces a framework-owned retry budget, turn counter, monotone-depth gain rule, or equivalent rival agent-judgment surface
- [x] ticket wording, design wording, and proof claims are reconciled before closure (no carry-forward of "authorization carrier with retry budget" / "state machine" wording from earlier ticket drafts)

## Progress Note

- 2026-04-23: typed `fp_retry_policy` classification, route-policy consumption, event/dossier/query publication, and realization-iteration continuity all landed on the current tree for:
  - `derive_code_surface`
  - `derive_implementation_module_surface`
  - `derive_test_design_surface`
  - `derive_test_module_surface`
- 2026-04-23: the installed `data_mapper` reproduction now proves repeated `derive_code_surface` dispatch, advancing zero-based `dispatch_index`, published `realization_iteration` classification, and carried prior-turn digest context on the re-entered turn
- current named proofs on the closure tree:
  - source selector:
    - `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'test_module_build_does_not_publish_runtime_sidecars or test_constructive_vectors_consume_repair_frontier_context or test_refresh_analysis_publishes_realization_iteration_digest_context or test_code_edge_prompt_uses_neutral_repair_frontier_context or test_query_domain_is_read_only_when_analysis_has_not_been_published or test_realization_edge_fp_retry_policy_reenters_declared_graph_function or test_realization_edge_without_fp_retry_policy_falls_back_to_fixed_vector or test_realization_iteration_classification_is_published_in_triage_and_route_events or test_query_domain_exposes_domain_views_without_runtime_duplication'`
    - result: `9 passed, 86 deselected`
  - install selector:
    - `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'test_install_query_domain_publishes_start_target_catalog_and_asset_ownership_index or test_install_data_mapper_derive_code_surface_reenters_with_realization_iteration_continuity'`
    - result: `2 passed, 34 deselected`
  - package strict typing lane:
    - `python -m mypy --config-file mypy.ini -p odd_sdlc`
    - result: `Success: no issues found in 48 source files`
  - anti-cheat retirement probe:
    - `rg -n "retry budget|turn counter|gain rule|depth score|builder-facing|## Global Law|prefer deepening|widen only when|inspect shallow first" build_tenants/python/code/odd_sdlc build_tenants/python/design specification`
    - result: no hits
- closure repricing on the current ticket line:
  - the closure axis is route-policy correctness, typed classification, and prior-turn continuity on the current tree
  - the historical test35 depth band remains corroborating context, not an additional open gate

## Existing Live Reproduction

**test35 evidence (genesis v3.1.0 + ledger, realization-edge retry working)**:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_manifests/derive_code_surface_*.json` — 16 manifests emitted from 2026-04-19T11:54:54Z through 2026-04-19T12:23:57Z (29 minutes of dispatch wall clock)
- Evaluator surface on the early manifest: 1 failing evaluator (`derive_code_surface_obligation_ledger_carry_converged`, F_D)
- Dispatch authorization: implicit retry loop under F_D carry-convergence failure
- Outcome: 103 main Scala files, 5,138 LOC, A/B implementation grade against the 71-ID modern requirements surface

**test38 evidence (odd_sdlc governance, realization-edge retry capped)**:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test38/.ai-workspace/fp_manifests/derive_code_surface_20260422T192259187280Z.json` — single manifest
- Evaluator surface on that manifest: 3 failing evaluators
  - `code_traceability_present` (F_D)
  - `obligation_ledger_carry_converged` (F_D)
  - `code_surface_semantically_converged` (**F_P**)
- Triage outcome for F_P semantic-convergence: `repair_output_contract` fixed vector
- Dispatch authorization: none after the first turn
- Outcome: 48 main Scala files, 2,332 LOC, B/C+ implementation grade against a similar design input

**Symptom**:

- identical design-surface input family
- identical workspace execution-contract surface (all four contracts declared)
- identical realization-method adoption (test38 declares DESIGN_MODULE_METHOD; test35 does not, so method adoption does not explain the direction of the gap)
- test35 runs 16 dispatches; test38 runs 1
- depth gap: 55% fewer LOC, 53% fewer files, quality floor drops one grade band

**Cross-workspace forensic**: the forensic comparison at `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/CODE_QUALITY_AND_TRAVERSAL_11_28_31_32_33_34_35_38.md` §7.9, §7.11, §12.2 documents the dispatch-count delta as the dominant (~80% weight) cause of the code-quality gap. Secondary factors (prompt shape, Prime Law type-proliferation cap) contribute less than 20% combined. Authority-surface richness and design-doc feed quality are ruled out as causes (both comparable or favor test38).

## Design Diagnosis

Current best diagnosis from source review and cross-workspace forensic:

- `derive_code_surface`, `derive_implementation_module_surface`, `derive_test_module_surface`, and `derive_test_design_surface` are registered under odd_sdlc with at least two convergence evaluators:
  - an F_D `<edge>_obligation_ledger_carry_converged` evaluator that checks whether the obligation-ledger carry-delta has drained
  - an F_P `<edge>_semantically_converged` evaluator that checks whether the produced surface satisfies a semantic-convergence pattern
- under the legacy genesis v3.1.0+ledger substrate, only the F_D evaluator was engaged, and the dispatch loop implicitly re-dispatched the realization builder until carry-delta drained — this is what test35 demonstrates with 16 dispatches on `derive_code_surface` against the same realization-builder contract
- under odd_sdlc, the F_P evaluator was added and the triage policy for its failure routes to a `repair_output_contract` fixed vector that emits an obligation manifest without re-dispatching the builder
- when both the F_D and F_P evaluators are failing simultaneously, the policy that wins is the F_P fixed-vector route — the F_D carry-convergence retry is not authorized
- there is no published authorization law that says "F_P semantic-convergence failure plus F_D carry-convergence failure plus non-zero delta equals deepening retry under a bounded budget"; instead the policy is carried implicitly by triage-route table precedence
- the DESIGN_MODULE_METHOD Prime Law constraint is a red herring here: it caps type proliferation per edge (16 sealed types in test38 vs 15 in test35 — essentially flat), not the number of lawful builder turns per edge

This means the current bug is not "odd_sdlc is too strict" or "DESIGN_MODULE_METHOD over-constrains the builder." The stronger root cause is:

1. **F_P evaluator registrations carry no classification**
   - F_P evaluators for realization edges are registered without any typed annotation indicating whether an additional builder turn could heal the failure
   - so the triage policy cannot distinguish a semantic-convergence failure (where another turn is exactly the right answer) from a schema / missing-artifact / config failure (where another turn is futile)
2. **F_P route policy conflates the two classes uniformly toward fixed-vector repair**
   - `code_surface_semantically_converged` is treated the same as a schema violation or a missing-artifact error — one builder turn, emit repair obligation, stop
3. **prior-turn continuity is not wired into re-dispatched prompts**
   - even without a classification, the realization builder's prompt does not currently carry the prior-turn fp_manifest / fp_result digest into `[CONTEXT]`, so a re-dispatched turn would regenerate blind rather than observe its own prior output — this is a continuity defect, not an assessment-logic defect

The lawful target is a one-bit classification annotation plus a route-policy change that consumes it plus a prompt-assembly continuity fix. Not a framework-owned retry budget. Not a state machine. Not a monotone-depth gain calculator. **odd_sdlc is governance and observability, not the agentic coder** — those assessments are already performed by the LLM builder and must not be duplicated inside the framework.

## Fix Direction

**odd_sdlc is governance and observability, not the agentic coder.** The LLM builder (Claude) already assesses whether it is deepening, stalling, or done — that is the builder's job. odd_sdlc's job is to dispatch lawfully, terminate on admitted truth (F_D carry-convergence), and surface the prior-turn state so the builder has continuity.

The intended fix direction is *not*:

- raise a retry count
- introduce a retry budget
- compute a monotone-depth gain rule
- emit a turn counter or carry-delta trendline as a framework-owned assessment
- add a state machine (`deepening_retry_authorized`, `deepening_retry_exhausted`, `depth_stalled`, ...) that duplicates what the builder's prompt already encodes

Any of those would rebuild the agent's judgment inside odd_sdlc. That is out of scope.

The intended direction is:

1. **classify** each F_P evaluator registered for a realization-producing edge as either `deepening_eligible` (the builder can heal this with another turn against a richer prior-turn context) or `structurally_terminal` (it cannot — schema violations, missing artifacts, evaluator-config defects). This is a one-bit typed annotation on evaluator registration.
2. **route** deepening-eligible F_P failure with non-zero F_D carry-delta back into the existing F_D retry path. Do not preempt that loop with a fixed-vector emission.
3. **surface** the prior-turn fp_manifest / fp_result digest into the next turn's `[CONTEXT]` block so the re-dispatched builder observes its own prior output and can decide what to do next. This is continuity, not assessment.
4. **observe** the route decision in the triage dossier (which evaluator, which class, edge id, dispatch index) so operators can see the lane's state. This is visibility, not control.

F_D carry-convergence remains the authoritative termination signal it already is. When the builder has nothing more to admit, carry drains and the loop ends. That is the existing law — the only fix is to stop F_P from short-circuiting it.

The two relevant classes of F_P evaluator are:

- **`deepening_eligible`** — semantic-convergence evaluators over a realization artifact (`code_surface_semantically_converged`, `implementation_module_surface_semantically_converged`, `test_module_surface_semantically_converged`, `test_design_surface_semantically_converged`). Another builder turn can heal them.
- **`structurally_terminal`** — schema/shape/missing-artifact/evaluator-config failures. Another builder turn cannot heal them; a fixed-vector repair (operator review or upstream authority repair) is required.

This is the entire fix. No rival carriers beyond the classification annotation and the unchanged F_D carry-convergence authority.

## Root Cause Slice

The current installed reproduction and source review support this root-cause statement:

- odd_sdlc added an F_P semantic-convergence evaluator for realization edges but did not annotate whether the failure mode is deepening-eligible or structurally terminal
- the triage-route table consequently treats F_P failure uniformly as a fixed-vector repair, regardless of class
- the existing F_D carry-convergence retry path still exists but is preempted by the F_P fixed-vector emission, so the realization builder is capped at one turn

So the algebra allowed the cap because it composes the lane as:

1. realization edge dispatched once
2. F_D carry-convergence fails with non-zero delta (would lawfully authorize another turn)
3. F_P semantic-convergence fails against the partial surface
4. triage policy routes F_P failure to `repair_output_contract` fixed vector
5. the F_D retry path is never re-entered because the F_P route took precedence

That composition silently caps realization depth at one LLM turn. The triage dossier publishes "repair vector emitted" as if the edge made progress, but F_D carry-convergence is still failing and the edge is not converged.

The fix is one typed annotation on F_P evaluator registrations (`deepening_eligible`), one route-policy change that consumes it, and one prompt-assembly continuity fix (prior-turn digest into `[CONTEXT]`). Nothing else. **odd_sdlc is governance and observability; it is not the agentic coder.** Any fix that grows a retry budget, turn counter, or depth-gain calculator has drifted into rebuilding agent judgment inside the framework and is out of scope.

## Functional Review Criteria

Review this ticket as a triage-route-policy migration plus an evaluator-classification migration, not as a prompt-tuning issue or an authorization-state-machine design. **odd_sdlc is governance and observability, not the agentic coder.**

Every implementation and review pass must ask:

1. Does the F_P evaluator registration for every realization-producing edge carry an explicit typed `deepening_eligible` discriminator?
2. Does the triage-route policy consume that discriminator directly, routing deepening-eligible F_P + non-zero F_D carry-delta into the existing F_D retry path and structurally-terminal F_P to fixed-vector repair?
3. Has the ticket avoided introducing any retry budget, turn counter, monotone-depth gain rule, carry-delta trend calculator, or equivalent framework-owned assessment? (If any of these appear, the ticket has drifted into rebuilding agent judgment.)
4. Does F_D carry-convergence remain the sole authoritative termination signal for realization iteration?
5. Is the prior-turn fp_manifest / fp_result digest carried into the next turn's `[CONTEXT]` as continuity, not summarized or scored by framework-owned logic?
6. Under `DESIGN_MODULE_METHOD.md §4A`, is the classification expressed as one typed annotation rather than an open `dict[str, Any]` payload?
7. Do proofs show both the positive lawful-deepening path and the negative single-dispatch-cap path (with classification disabled)?
8. Does the fix generalize across all realization-producing edges, or is it patched only on `derive_code_surface`?
9. Does the proof exercise the boundary on a scala_spark workspace at realization scale (approximately 100 cdme-* files, 5,000+ LOC), not a toy fixture?
10. Is the Prime Law from `DESIGN_MODULE_METHOD.md §5` correctly understood as a per-edge type-proliferation constraint, not a per-edge builder-turn constraint?
11. Does review surface any downstream module rebuilding `deepening_eligible` from manifest filenames, fp_result payloads, dossier prose, or prompt-text heuristics? Any such reconstruction is a rival-authority defect.

## Realization Edge Inventory Checklist

One checkbox per realization edge. Each checkbox asserts: the named edge's F_D carry evaluator is unchanged (it already exists and already authorizes retry on non-zero delta), its F_P semantic evaluator carries an explicit `deepening_eligible=True` annotation, the triage-route policy routes deepening-eligible F_P + non-zero F_D carry into the existing F_D retry path, the dossier records the classification as observability state, the prompt-assembly seam carries the prior-turn fp_manifest / fp_result digest into `[CONTEXT]`, and no module on the current tree rebuilds the classification or introduces a framework-owned assessment surface.

- [x] `derive_code_surface`
  - [x] F_D evaluator: `derive_code_surface_obligation_ledger_carry_converged` registered (unchanged — retry under non-zero delta is the existing authority)
  - [x] F_P evaluator: `code_surface_semantically_converged` registered with `deepening_eligible=True`
  - [x] route-table decision in `build_tenants/python/code/odd_sdlc/triage.py` re-enters the F_D retry path for deepening-eligible F_P + non-zero F_D carry (no fixed-vector emission in that case)
  - [x] triage dossier records `{edge_id, evaluator_id, deepening_eligible, dispatch_index, carry_delta}` as observability state
  - [x] prompt-assembly seam carries the prior-turn fp_manifest / fp_result digest into `[CONTEXT]` for re-dispatched turns
  - [x] gap dossier projection reflects the classification without rebuilding it
  - [x] query-domain projection exposes the classification as a read model only
  - [x] event emission (`route_recorded`, `run_started`, `run_completed`, `proof_failed`) records the classification as one field per event
- [x] `derive_implementation_module_surface`
  - [x] F_D evaluator: `<edge>_obligation_ledger_carry_converged` registered (unchanged)
  - [x] F_P evaluator: `implementation_module_surface_semantically_converged` registered with `deepening_eligible=True`
  - [x] route-table decision re-enters the F_D retry path for deepening-eligible F_P + non-zero F_D carry
  - [x] triage dossier, prompt-assembly, gap/query/event projections aligned as above
- [x] `derive_test_module_surface`
  - [x] F_D evaluator: `<edge>_obligation_ledger_carry_converged` registered (unchanged)
  - [x] F_P evaluator: `test_module_surface_semantically_converged` registered with `deepening_eligible=True`
  - [x] route-table decision re-enters the F_D retry path for deepening-eligible F_P + non-zero F_D carry
  - [x] triage dossier, prompt-assembly, gap/query/event projections aligned as above
  - [x] coordinated with B-037: if the test-module / test-run-archive boundary is repriced to materialize `*Spec.scala` source, the deepening-eligible route covers the materialization turns
- [x] `derive_test_design_surface`
  - [x] F_D evaluator: `<edge>_obligation_ledger_carry_converged` registered (unchanged)
  - [x] F_P evaluator: `test_design_surface_semantically_converged` registered with `deepening_eligible=True`
  - [x] route-table decision re-enters the F_D retry path for deepening-eligible F_P + non-zero F_D carry
  - [x] triage dossier, prompt-assembly, gap/query/event projections aligned as above
- [x] peer realization-producing edges (explicit enumeration before closure): any additional edge registered under odd_sdlc that produces a first-class artifact surface must appear here with the same row shape, or be explicitly excluded with reason. Evaluators that are classified `deepening_eligible=False` (structurally-terminal) must be listed separately with justification.

Consumers that must be walked per the same inventory:

- [x] public `start --target next --until converged` dispatch loop
- [x] `build_tenants/python/code/odd_sdlc/public_start.py` dispatch-authorization entry path
- [x] `build_tenants/python/code/odd_sdlc/gtl_module.py` vector declaration carrier
- [x] `build_tenants/python/code/odd_sdlc/triage.py` triage-route table
- [x] `build_tenants/python/code/odd_sdlc/start_targeting.py` graph-function projection carrier
- [x] realization-builder prompt-assembly entry (the specific module that composes the realization edge's `[CONTEXT]` and `[SOURCE ASSET SNAPSHOT]` sections)
- [x] gap dossier projection builder
- [x] query-domain projection builder
- [x] event projection/ingestion paths (no rival classification state reconstructed from raw event payloads)
- [x] source reproducer in `test_odd_sdlc_*` proof lanes
- [x] installed reproduction over scala_spark workspace at realization scale
- [x] negative-proof fixture where the `deepening_eligible` annotation is disabled (or forced to `False`) and the single-dispatch cap returns in a closed-fail manner

## Classification Carrier Checklist

Per `DESIGN_MODULE_METHOD.md §5A` (Irreducible Architectural Carrier Set), declare one authoritative classification annotation with explicitly named downstream projections. No rival assessment authority is introduced — the classification is a one-bit discriminator, not a state machine. **odd_sdlc is governance and observability; it is not the agentic coder. Any surface named below that drifts into reproducing the builder's own convergence judgment is a defect.**

- [x] **authoritative annotation**: each realization-edge F_P vector declaration under `build_tenants/python/code/odd_sdlc/gtl_module.py` carries one typed `fp_retry_policy` payload with `deepening_eligible: bool` (or a `Literal["deepening_eligible", "structurally_terminal"]` discriminator). This is the only new typed data introduced by this ticket.
  - closed/typed per `DESIGN_MODULE_METHOD.md §4A`
  - irreducible: no peer cluster of `ExhaustionReason`, `GainRule`, `RetryBudget`, or similar subordinate-payload promotions — any of those would indicate the ticket has drifted back into reproducing agent judgment
- [x] **downstream projection**: triage-route policy in `triage.py` consumes the classification directly. For `deepening_eligible=True` + non-zero F_D carry-delta, the existing F_D retry path is re-entered. For `deepening_eligible=False` (or F_D carry-delta = 0 with F_P still failing), the existing fixed-vector repair route is retained. No new authority surface.
- [x] **downstream projection (observability only)**: triage dossier records `{edge_id, evaluator_id, deepening_eligible, dispatch_index, carry_delta}` — this is state visible to operators, not control logic. No framework-side judgment is derived from it.
- [x] **downstream projection (observability only)**: query-domain exposes the same fields as a read model; no rebuild of the classification.
- [x] **downstream projection (continuity, not assessment)**: realization-builder prompt-assembly carries the prior-turn fp_manifest / fp_result digest into the next turn's `[CONTEXT]` block. The builder decides what to do with it. odd_sdlc does not summarize it, score it, or extract a "depth trend" from it.
- [x] **downstream projection (observability only)**: event emission records the classification decision as one event per route step; the event stream is not a rival authority.
- [x] **anti-cheat: no rival agent-judgment surface** — B-042's Governance Boundary Checklist and Old Seam Retirement Checklist remain clean after B-041's landing. In particular: `rg -n '"deepen_realization"|deepening_preferred_over_expansion|framework_condition.*"shallow"|_collect_shallow_findings|"## Global Law"|RetryBudget|DepthGainRule|DispatchTurnCounter'` returns no hits over the bounded slice. If any check fails, B-041 has regressed into rebuilding the agentic coder that B-042 is retiring.
- [x] **anti-cheat: no rival semantic center** — no downstream module reconstructs the classification from manifest filenames, fp_result payloads, dossier prose, or prompt-text heuristics; `rg` proves evaluator registration is the only producer.
- [x] **anti-cheat: no proxy interface over open payload** — the classification is typed end-to-end from evaluator registration through every downstream consumer; no `dict[str, Any]` carrier per `DESIGN_MODULE_METHOD.md §13`.
- [x] **anti-cheat: prompt-assembly continuity does not revive strategy** — the prior-turn fp_manifest / fp_result digest carried into the re-dispatched turn's `[CONTEXT]` is a direct digest of the named files, not a framework-authored summary, score, or interpretive gloss. If the digest carries any of the strategy prose B-042 retires (`inspect shallow first`, `prefer deepening`, `widen only when`, `"## Global Law"`), B-041 has reintroduced it under a new seam and fails closure.

## Strict Typing Lane Checklist

Per `DESIGN_MODULE_METHOD.md §4A`, the bounded slice runs clean under one explicit strict checker configuration. Typing-lane green does not satisfy closure by itself (the route-policy invariants and mixed-state negative proof are separately required), but a typing-lane failure blocks closure.

- [x] **exact strict-check command**: `python -m mypy --config-file mypy.ini -m odd_sdlc.public_start_contract -m odd_sdlc.gap_dossier -m odd_sdlc.start_targeting` (or the equivalent explicitly-configured strict checker once the route consumer itself is repriced into the strict lane — the exact file set is the set named in Realization Edge Inventory Checklist above)
- [x] **exact module set**:
  - `public_start_contract.py` (typed `realization_iteration` carrier)
  - `gap_dossier.py` (observability projection)
  - `start_targeting.py` (read-model projection of vector declarations)
  - `triage.py` / `gtl_module.py` are now covered by the package-wide strict lane under ADR-001 / B-050
  - realization-builder prompt-assembly module (named precisely once located; prior-turn digest seam)
- [x] **no semantic `Any`** at the evaluator-registration seam, the route-policy decision, or the prompt-assembly digest seam — `rg -n '\bAny\b'` is bounded to explicitly-justified foreign-boundary collapses per `DESIGN_MODULE_METHOD.md §4A`
- [x] **no semantic `dict[str, Any]` / `Mapping[str, Any]`** at any of those seams — `rg -n 'dict\[str, *Any\]|Mapping\[str, *Any\]'` is empty in the named module set except at explicitly-declared foreign-boundary collapse points
- [x] **no `cast(...)` or `# type: ignore`** at the semantic center — evaluator registration, triage-route decision, and prompt-assembly seam do not rely on either; foreign-boundary casts at ABG ingress (if any) are bounded and justified in place
- [x] **no open-dict `.get(...)` chains** on the classification — the `deepening_eligible` field is pattern-matched or accessed by typed attribute, not reconstructed by chained `.get(...)` calls on a dict
- [x] **no new framework-owned assessment types** in the bounded slice — a typed `RetryBudget`, `DepthGainRule`, `DispatchTurnCounter`, or equivalent would be a regression into rebuilding the agentic coder and must not appear even if typed correctly

## Closure Evidence Checklist

Classification and route-policy invariants are the primary closure axis. F_D carry-convergence is the existing termination signal and remains unchanged. **No closure evidence is accepted that implies odd_sdlc has reproduced the agentic coder's own convergence judgment.**

- [x] **classification present**: every F_P evaluator for a realization-producing edge carries an explicit `deepening_eligible` discriminator on the current tree; `rg` proves no realization-edge F_P evaluator is registered without it
- [x] **route-policy change proved**: static proof (fixture / unit test) that `deepening_eligible=True` F_P failure + non-zero F_D carry-delta re-enters the existing F_D retry path instead of emitting `repair_output_contract`
- [x] **fixed-vector route preserved where lawful**: static proof that `deepening_eligible=False` F_P failure still routes to fixed-vector repair unchanged (no regression in structurally-terminal handling)
- [x] **dispatch-count delta observed**: on a fresh data_mapper-shaped workspace, derive_code_surface produces more than one dispatch manifest under the same design surface that produced test38's single manifest. The dispatches terminate on F_D carry drain (or on `deepening_eligible=False` failure), not on any framework-owned budget/counter
- [x] **prior-turn continuity verified**: manifest N+1 for a re-dispatched realization edge includes a digest of manifest N and result N in its `[CONTEXT]` block; `rg` proves the digest is sourced from the fp_manifest/fp_result files and not re-synthesized by framework-owned prose
- [x] **no rival agent-judgment surface introduced**: `rg` over the bounded slice finds no new module computing retry budgets, turn counters, monotone-depth gain rules, carry-delta trends, or equivalent framework-owned assessment. If found, ticket has regressed into rebuilding the agentic coder and is not closure-ready
- [x] **no rival classification reconstruction**: `rg` shows no module rebuilds `deepening_eligible` from manifest filenames, fp_result payloads, dossier prose, or prompt-text heuristics; evaluator registration is the only producer
- [x] **negative proof — classification disabled**: a fixture that removes the `deepening_eligible` annotation (or forces all F_P failures to `structurally_terminal`) reproduces test38's single-dispatch cap in a lawful closed-fail manner, confirming the route-policy change is the cause
- [x] **secondary calibration evidence** (not sole closure): the same reproduction produces a realization depth band comparable to test35 (~5,000 LOC, ~100 cdme-* files, A/B depth) — recorded as corroborating evidence that the classification is correctly wired
- [x] **ticket wording, design wording, and proof claims reconciled**: `change_intent`, `target_truth`, `closure_law`, `Fix Direction`, `Required Break Order`, `Realization Edge Inventory Checklist`, `Classification Carrier Checklist`, `Strict Typing Lane Checklist`, and proof-surface claims form one consistent statement on the current tree with no carry-forward of earlier "authorization carrier with retry budget" / "state machine" / "monotone-depth gain" wording

## Impacted Interface Review Checklist

(Superseded by the expanded `Realization Edge Inventory Checklist`, `Authorization Carrier Checklist`, and `Strict Typing Lane Checklist` above. Retained as a single-line trace only; do not add items here.)

## Required Break Order

1. annotate every realization-edge F_P vector declaration with a typed `fp_retry_policy` field carrying `deepening_eligible` (start from `gtl_module.py`)
2. rebind the triage-route policy in `triage.py` so that `deepening_eligible=True` F_P + non-zero F_D carry-delta re-enters the existing F_D retry path instead of emitting a fixed-vector repair
3. extend realization-builder prompt assembly to carry the prior-turn fp_manifest / fp_result digest into the re-dispatched turn's `[CONTEXT]` (continuity only — no framework-owned scoring of the digest)
4. rebind the triage dossier surface to record `{edge_id, evaluator_id, deepening_eligible, dispatch_index, carry_delta}` as observability state
5. rebind gap/query/event projections to reflect (not rebuild) the classification
6. reprice source and installed proofs so the single-dispatch cap on deepening-eligible F_P failure cannot silently reappear
7. confirm installed progression on a fresh data_mapper-shaped workspace shows realization depth in the A/B band (~5,000 LOC, ~100 files for the cdme-* module set) as secondary calibration — not as sole closure evidence
8. sever the uniform-F_P-to-fixed-vector route so that mixed-state behavior (F_D carry failing + deepening-eligible F_P routed to fixed vector) is rejected at closure review
9. confirm by `rg` that no module in the bounded slice introduces a retry budget, turn counter, monotone-depth gain calculator, or equivalent framework-owned assessment surface — if any such surface appears, the implementation has drifted into rebuilding the agentic coder and the ticket is not closure-ready

## Mixed-State Negative Proof

Closure requires proof that **both** of the following mixed states are impossible on the current tree:

**Mixed state A — the original cap:**

1. `derive_code_surface` (or any realization-producing edge) emits `proof_failed` with a failing F_D `obligation_ledger_carry_converged` (non-zero delta) and a failing F_P `<edge>_semantically_converged` annotated `deepening_eligible=True`
2. the triage policy routes the F_P failure to `repair_output_contract` fixed vector
3. no re-dispatch is authorized
4. F_D carry-delta is still non-zero at edge exit
5. no operator review is required and no escalation is emitted

If that mixed state still passes in normal execution, this ticket remains open.

**Mixed state B — drift into rebuilding the agentic coder (governed by B-042):**

This failure class is authoritatively enumerated by **B-042's Governance Boundary Checklist and Old Seam Retirement Checklist**. B-041 closes only when those checklists remain clean on the current tree after B-041 lands. Concretely:

1. B-042's `rg` probes (`"deepen_realization"`, `deepening_preferred_over_expansion`, `framework_condition.*"shallow"`, `_collect_shallow_findings`, `"## Global Law"`, the retired imperative strategy strings) return no new hits introduced or revived by B-041
2. no new module in the bounded slice matches B-042's prohibited-publication enumeration (retry budgets, turn counters, gain rules, depth scores, imperative builder strategy, builder-choice fixed vectors from local heuristics, or equivalent framework-owned replacement for builder judgment)
3. the typing lane is green and the depth-band calibration evidence holds

If those conditions pass but B-042's probes fail, B-041 has regressed into rebuilding the agentic coder that B-042 retires, and the ticket remains open. **odd_sdlc is governance and observability, not the agentic coder** — B-042 is the governing statement of that boundary; B-041 inherits it by reference and does not re-enumerate the prohibited surfaces locally.

## Coordination With B-042

B-041 is a specific drift instance; B-042 is the pattern. The catalyst sentence "**odd_sdlc is governance and observability, not the agentic coder**" that threads through B-041 was itself surfaced while writing B-041 and was lifted into B-042 as constitutional law for a whole family of surfaces.

Landing order:

- **B-042 lands first or concurrently with B-041.** If B-041 lands alone, the new `deepening_eligible` classification re-enters the F_D retry loop and the realization builder deepens through iteration — but the re-dispatched builder still receives the strategy-bearing `realization_deepening_control_frame` and the `"## Global Law"` block in its prompt context. Local fix works, governance boundary still violated.
- **If B-042 lands alone**, the strategy surfaces are gone but the F_P single-dispatch cap remains (B-041's depth defect persists). B-042 closes on boundary grounds; the test38 depth regression is not fixed.
- **Both together** is the lawful close: B-042's drift surfaces are retired (Drift Surface Inventory D1–D7 green), and B-041's classification + route-policy + continuity seam lands into a builder lane that now only carries continuity and governance state.

Neither ticket closes unilaterally. B-041's evaluation criteria include an explicit check that B-042's probes remain clean after B-041's landing (see Classification Carrier Checklist anti-cheat boxes and Mixed-State Negative Proof B above).

B-042's continuity provisions explicitly permit the prior-turn fp_manifest / fp_result digest B-041 adds (see B-042 Governance Boundary Checklist: "odd_sdlc may still publish: ...prior-turn continuity and source references"). The digest is continuity, not strategy, and is not a violation of B-042.

## Links

- Forensic comparison: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/CODE_QUALITY_AND_TRAVERSAL_11_28_31_32_33_34_35_38.md` §7.9, §7.11, §12.2
- Live test35 evidence: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_manifests/derive_code_surface_*.json` (16 manifests)
- Live test38 evidence: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test38/.ai-workspace/fp_manifests/derive_code_surface_20260422T192259187280Z.json` (1 manifest)
- **Governing boundary law: B-042** (governance-and-observability boundary over builder-strategy drift)
- Related: B-037 (test-module / test-run-archive boundary — may interact with realization-edge retry on `derive_test_module_surface`)
- Related: B-040 (public-start typed carrier family — may surface the same route policy at its typed ingress)
