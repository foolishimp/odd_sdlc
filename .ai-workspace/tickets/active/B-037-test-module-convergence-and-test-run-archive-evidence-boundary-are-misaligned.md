---
id: B-037
title: Test module convergence and test run archive evidence boundary are misaligned
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: active
goal: lawful-test-module-to-test-run-archive-boundary
change_intent: Rebind the odd_sdlc test-lane boundary so derive_test_module_surface, derive_test_run_archive_surface, and downstream testcase/release gates share one lawful truth about when planned test allocation is sufficient and when realized test source plus governed execution evidence are required.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc test-module construction, test-run-archive convergence, testcase-authority qualification, release preparation, installation proof lanes, and generated scala_spark test surfaces in inherited workspaces
priority: high
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-23
dependencies: B-035 completed; B-036 completed; T-023 completed; T-024 completed
intake_source: post-fix installed RC walkthrough over data_mapper.test38 where public start advanced lawfully through test-module generation, then yielded at derive_test_run_archive_surface because the archive required realized *Spec.scala source files and governed sbt test evidence while the upstream test-module edge had already converged on a planned-only markdown surface
target_truth: the odd_sdlc test lane publishes one lawful boundary between planned validation allocation, realized test source, and governed test execution evidence. derive_test_module_surface, derive_test_run_archive_surface, prepare_release_surface, and the later operational test-execution lane must agree about when planned allocation is sufficient, when realized source is required, and when governed execution evidence first becomes lawful. The graph must not require execution evidence at an edge that still precedes the operational execution lane, and it must not require realized source unless some earlier or same-edge carrier is actually responsible for materializing it.
superseded_truth: derive_test_module_surface currently converges on planned validation allocation (`planned_test_module_coverage`), while derive_test_run_archive_surface is configured as a realized-validation edge (`realized_validation_projection` / `realized_test_execution_evidence`) even though the graph still places it before `prepare_release_surface`, `prepare_test_execution_surface`, and `derive_test_execution_result_surface`. A runtime prompt context (`REALIZED_TEST_SOURCE_OBLIGATION.md`) also injects actual-source requirements into the archive edge, while deterministic closure and traceability surfaces still use archive refs as a proxy for realized evidence. The lane is therefore split across graph order, obligation-ledger law, runtime prompt law, and operator-facing archive text.
closure_law: this migration closes only when the test-module edge, test-run-archive edge, release edge, and operational test-execution lane share one explicit source-carrier law for planned vs realized test evidence; data_mapper.test38-style installed runs no longer stall on an archive edge that asks for evidence produced only by later operational traversal; and the resulting proof shows one non-contradictory sequence for planned allocation, realized source, and governed execution evidence.
evaluation_criteria:
  - one authoritative carrier boundary names what derive_test_module_surface must produce and what derive_test_run_archive_surface may demand from it
  - the graph does not mark derive_test_module_surface converged if derive_test_run_archive_surface immediately blocks on unmet truth that belongs to the test-module edge
  - if realized *Spec.scala files are required before run-archive convergence, the upstream lane materializes and proves them explicitly
  - if realized test execution evidence belongs only to the operational execution lane, derive_test_run_archive_surface does not counterfeit a proof failure that really means planned-only archive state
  - source and installed proofs exercise the boundary on a data_mapper-style scala_spark workspace and distinguish lawful planned carry, lawful realized source materialization, and lawful operational execution evidence
  - transport-salvage behavior remains explicitly separate unless the investigation proves it changes the test-module / test-run-archive boundary itself
non_closure_conditions:
  - derive_test_module_surface still converges while derive_test_run_archive_surface blocks only because no realized *Spec.scala files exist
  - derive_test_run_archive_surface still requires governed sbt test execution evidence before the operational execution lane is admitted or run
  - proofs only assert that the lane yielded, without proving whether the yielded stop was semantically lawful
  - ticket closure depends on ad hoc explanation instead of one carrier-owned definition of planned vs realized test evidence
proof_surface:
  - source reproducer covering derive_test_module_surface -> derive_test_run_archive_surface boundary truth
  - installed reproduction over data_mapper.test38-style scala_spark workspace
  - generated surface inspection for 40-generated-test-modules.md and 50-generated-run-archive.md
  - event-forensic review around proof_failed / continuation_opened / run_yielded on derive_test_run_archive_surface
  - repriced installation or sandbox proof for the resolved boundary
---

## Migration Declaration

- old_truth_path: derive_test_module_surface converges on a planned markdown test allocation surface, while derive_test_run_archive_surface immediately demands realized *Spec.scala source files and governed sbt test execution evidence, so the handoff between the two edges is semantically split and the next edge can only fail or yield on truth the prior edge never carried
- new_truth_path: the odd_sdlc test lane carries one explicit planned-vs-realized evidence law across derive_test_module_surface, derive_test_run_archive_surface, and the operational execution tail, so the next edge demands only what the prior edge is responsible for carrying and any requirement for realized test source or execution evidence appears at the correct edge with the correct proof surface
- producers_old:
  - `odd_sdlc.constructor` generation of `40-generated-test-modules.md`
  - `odd_sdlc.constructor` generation of `50-generated-run-archive.md`
  - test-lane evaluators and declared-obligation projection
  - downstream result-ingest / continuation projection after archive proof failure
- producers_new:
  - one typed or otherwise authoritative test-lane carrier defining planned allocation vs realized source vs execution evidence
  - derive_test_module_surface and derive_test_run_archive_surface consuming that same carrier definition
  - proofs that validate the handoff explicitly on installed workspaces
- consumers_old:
  - public `start --target next --until converged`
  - generated run archive surface
  - testcase-authority and release-preparation edges
  - operator interpretation of whether the lane has lawfully progressed or hit a bug
- consumers_new:
  - public `start --target next --until converged`
  - test archive and testcase-authority edges
  - installed RC review over data_mapper-style workspaces
  - operator interpretation of planned vs realized test evidence
- derived_surfaces:
  - `build_tenants/scala_spark/test_env/tests/40-generated-test-modules.md`
  - `build_tenants/scala_spark/test_env/50-generated-run-archive.md`
  - `.ai-workspace/events/events.jsonl`
  - `.ai-workspace/fp_manifests/*derive_test_run_archive_surface*.json`
  - `.ai-workspace/fp_results/*derive_test_run_archive_surface*.json`
  - gap dossier surface

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection and read-model surfaces are listed
- [ ] old truth path is removed or explicitly demoted from authority
- [ ] mixed-state behavior is no longer accepted as closure evidence
- [ ] tests proving mixed old and new behavior are removed or repriced
- [ ] ticket wording, design wording, and proof claims are reconciled before closure

## Existing Live Reproduction

Installed workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test38`

Observed sequence on the post-fix line:

1. public `start --scope workspace --target next --until converged --fh-mode human-proxy` lawfully clears the initial constitutional gate and advances through:
   - intent
   - product
   - goals
   - requirements
   - feature decomp
   - UAT
   - design
   - scenario
   - implementation design
   - implementation modules
   - code
   - test design
   - test stack
   - test modules
2. `derive_test_run_archive_surface` then emits `proof_failed`
3. ABG opens `continuation_opened(kind=repair)` and the run yields rather than hard-failing
4. the current generated run archive states:
   - zero realized `*Spec.scala` files
   - zero governed `sbt test` evidence
   - archive kind `construction_complete_pending_execution`
5. the current generated test-module surface still states `Converged — derive_test_module_surface`

This is the reproducing symptom:

- the upstream edge says the test-module surface is converged
- the immediate downstream edge blocks only because realized test source and realized execution evidence are absent
- the seam between the two edges therefore appears semantically misaligned

## Design Diagnosis

Current best diagnosis from the installed workspace walk and source-repo review:

- `derive_test_module_surface` is explicitly configured for planned validation allocation:
  - graph function obligation ledger uses `derivation_rule="validation_module_projection"`
  - `fulfillment_rule="test_module_surface_coverage"`
  - `evidence_policy="planned_test_module_coverage"`
- `derive_test_run_archive_surface` is explicitly configured for realized validation:
  - graph function obligation ledger uses `derivation_rule="realized_validation_projection"`
  - `fulfillment_rule="realized_test_evidence"`
  - `evidence_policy="realized_test_execution_evidence"`
  - runtime prompt contexts switch from `_realization_builder_contexts` to `_realized_test_builder_contexts`, which includes `REALIZED_TEST_SOURCE_OBLIGATION.md`
- the graph then places `prepare_release_surface` after `derive_test_run_archive_surface`, and the operational lane only appears later:
  - `prepare_release_surface` requires `test_run_archive_surface`
  - `prepare_test_execution_surface` depends on `release_surface`
  - `derive_test_execution_result_surface` depends on `test_execution_surface`
- requirement/design law already says honest bounded states such as `construction_complete_pending_execution` and `pending_evidence` are lawful before operational execution evidence exists
- the generated archive in `data_mapper.test38` truthfully reports planned-only carry plus zero realized source / zero execution evidence, but the archive edge is still being evaluated against the stricter realized-evidence law

This means the current bug is not just "test module and archive disagree." The stronger root cause is:

1. **graph-order contradiction**
   - `derive_test_run_archive_surface` currently asks for realized execution evidence before the graph has even admitted the operational execution lane that could produce it
2. **missing constructive boundary for realized test source**
   - there is no dedicated graph edge whose admitted job is "materialize realized test source under the governed code root" between planned test-module allocation and archive/evidence projection
3. **split carrier semantics**
   - runtime prompt law says the archive edge is not satisfied by archive prose alone and demands real test files on disk
   - deterministic traceability / closure code still uses archive refs as the carrier for `realized_test_evidence`
   - operator-facing generated archive text already models `construction_complete_pending_execution` honestly

So there are still two broad fix directions, but the source review now strongly favors one over the other:

1. **Deepen test-module realization**
   - `derive_test_module_surface` must materialize realized `src/test/scala/**/*.scala` files, not only planned markdown allocation
   - and the graph must then add or name that constructive boundary explicitly before the archive edge
   - even under this direction, governed execution evidence still belongs later to `derive_test_execution_result_surface`, not to the archive edge itself
2. **Demote archive evidence demands** (currently the more likely lawful target under existing requirement/design law)
   - `derive_test_run_archive_surface` archives planned allocation plus current realized-source / execution status honestly, including `construction_complete_pending_execution`
   - realized execution evidence is first demanded only in `derive_test_execution_result_surface`
   - release may remain a bounded `pending_evidence` projection until the operational test-execution lane runs

This ticket exists to determine which target is correct under current requirement and design law, then implement it cleanly.

## Root Cause Slice

The current installed reproduction and source review support this root-cause statement:

- the test lane was repriced edge-locally instead of as one end-to-end handoff
- `derive_test_module_surface` certifies planned validation allocation
- `derive_test_run_archive_surface` was later upgraded to a realized-evidence edge by obligation-ledger and runtime-context law
- but the graph order and release semantics were not repriced with it

So the algebra allowed the mismatch because it still composes the lane as:

1. planned allocation edge closes
2. archive edge requires realized source / execution evidence
3. release depends on archive
4. operational test execution only appears after release

That composition is internally contradictory. The archive edge is currently carrying truth that belongs partly to a missing source-realization boundary and partly to the later operational result boundary.

## Functional Review Criteria

Review this ticket as a test-lane boundary migration, not as a generic runtime retry issue.

Every implementation and review pass must ask:

1. Does the lane have one carrier-owned statement of planned allocation vs realized test source vs governed execution evidence?
2. Is the edge that first demands realized `*Spec.scala` source also the edge responsible for materializing it?
3. Is the edge that first demands governed `sbt test` evidence also the edge that lawfully follows admitted test-execution preparation?
4. Are proof failures on `derive_test_run_archive_surface` distinguishing semantic misalignment from normal missing downstream execution evidence?
5. Under `DESIGN_MODULE_METHOD.md`, is the boundary expressed as one source-carrier law rather than controller-local explanation, runtime-context folklore, or post hoc operator reasoning?
6. Do proofs show both the positive lawful path and the negative mismatched path?
7. Does the review keep ABG transport-salvage separate unless it directly changes the archive-boundary truth?
8. Does the chosen fix remove the current graph-order contradiction where `derive_test_run_archive_surface` can require evidence that is only produced after `prepare_release_surface` and `derive_test_execution_result_surface`?

## Impacted Interface Review Checklist

- [ ] `odd_sdlc.constructor` test-module generation
- [ ] `odd_sdlc.constructor` test-run-archive generation
- [ ] declared-obligation projection used by test run archive
- [ ] requirement closure / traceability carrier for `realized_test_evidence`
- [ ] runtime prompt context `REALIZED_TEST_SOURCE_OBLIGATION.md`
- [ ] test-lane evaluators for test-module and run-archive convergence
- [ ] testcase-authority qualification dependence on run-archive truth
- [ ] release dependence on run-archive truth
- [ ] operational test-execution lane (`prepare_test_execution_surface` / `derive_test_execution_result_surface`)
- [ ] installation proof over scala_spark inherited workspaces
- [ ] sandbox or source proof that isolates the boundary

## Required Break Order

1. reproduce the boundary explicitly in source or installed proof over a data_mapper-style workspace
2. classify the current seam: planned-only handoff, realized-source handoff, or operational-evidence handoff
3. resolve the graph-order contradiction between run archive, release, and operational test execution
4. choose and ratify the lawful target boundary
5. rebind the upstream and downstream edges to that single boundary
6. reprice proofs so the old mismatched seam is impossible
7. confirm installed progression no longer stops on a semantically split archive boundary

## Mixed-State Negative Proof

Closure requires proof that the following mixed state is impossible:

1. `derive_test_module_surface` reports converged
2. the immediate next edge `derive_test_run_archive_surface` blocks only because no realized `*Spec.scala` files exist or because governed `sbt test` evidence is absent before the operational execution lane
3. no explicit carrier law says that this missing truth belongs to a later edge

If that mixed state still exists, this ticket remains open.
