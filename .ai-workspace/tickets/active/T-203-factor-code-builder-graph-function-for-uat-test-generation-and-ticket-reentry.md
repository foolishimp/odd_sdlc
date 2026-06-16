---
id: T-203
title: Factor code-builder graph function for UAT test generation and ticket re-entry
status: active
change_class: design_reframe
re_entry_point: design
owner: odd_sdlc
created: 2026-06-15
source: data_mapper deep SDLC live review, missing generated source tests
related_tickets:
  - .ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md
  - .ai-workspace/tickets/completed/T-172-realize-staged-disambiguation-graph-and-decomposition-admission.md
  - .ai-workspace/tickets/completed/T-200-implement-depth-traversal-function-and-decomposition-trace-foldback.md
  - .ai-workspace/tickets/completed/T-202-project-abg-consequence-traversal-catalog-onto-sdlc-overlays.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-158-admit-gtl-plugin-result-interface-contracts.md
governance_scope: STDO Method, ODD_METHOD, DESIGN_MODULE_METHOD
---

# T-203: Code-Builder Graph Function For UAT Test Generation And Ticket Re-Entry

## Intake

The latest data-mapper deep SDLC run generated substantive component code but
no source tests. The run then reached command/runtime proof pressure where
`sbt test` could be green or externally blocked without proving that
UAT-derived tests had been generated as product source. That is an SDLC graph
configuration defect, not a permission to patch the generated data-mapper
sandbox outside the builder lane.

## Target Truth

1. `Fg_graph_code_builder` is the reusable graph function for code workspace
   materialization. It takes any lawful starting requirement pressure, including
   ordinary requirement/design pressure and `req.uat_tests` pressure, plus the
   selected build tenant and design authority, and returns the requested code
   workspace target.
2. `derive_component_code_surface`, `derive_component_test_surface`, and
   `derive_uat_test_source_surface` are target specializations of
   `Fg_graph_code_builder`, not unrelated prompt modes. The overlay-scoped
   `derive_lite_component_code_surface` is a bounded lite/smoke profile of the
   same builder, not a fallback path for full traversal. Source code generation
   keeps the established implementation-design source edge while citing the
   reusable code-builder contract and staged authority/repair pressure for
   tenant, testcase, and requirement context. Unit/component test generation is
   requirement + design + module specific; when the implementation dependency
   map has source-only module targets, those module definitions still derive
   unit-test materialization lanes rather than waiting for pre-existing test
   files. UAT executable test generation is requirement / UAT-testcase specific
   and becomes framework-discoverable source through
   `derive_uat_test_source_surface`. Completed
   `component_code_surface` is consumed at downstream qualification/execution
   fan-in, not as a blanket precondition for generated test source.
3. Code build and test build are sibling code-builder materialization paths
   when admitted dependency maps select parallel traversal under the ABG
   frontier. The test-run / qualification fan-in consumes generated code and
   generated tests. Its job is to run validations and surface failures as
   admitted bug/ticket pressure; command success without generated source tests
   is non-closure.
4. Ticket triage and re-entry are the lawful consequence path after test-run
   failure. Triage chooses the proper re-entry point: same code-builder edge
   iteration for code/test/env materialization defects, deeper code/test zoom
   for underdecomposed implementation or test obligations, or upstream design
   re-entry when the failure proves design/test authority is wrong.
5. Existing confused graph paths are cleaned up rather than preserved as tech
   debt. The release line has one designed solution path for code-builder
   source/test materialization, test-run validation, ticket triage, and lawful
   re-entry.
6. Proportionality is expressed by matching graph functions, not by skipping
   a facet. Lite/smoke overlays use overlay-only proportional graph functions
   for lite test design, lite unit/component test source, and lite UAT test
   source before test execution. A profile that does not generate tests must
   publish preserved test pressure as no-close/projection truth rather than
   claiming command execution proof.
7. Prompt-bearing code-builder and evaluator turns begin with the SPEC_METHOD
   planning invariant: make a plan from governing authority, rank work by
   contextual closure priority, and work through that priority order before
   returning or yielding residual pressure. Contextual priority means critical
   behavior, highest-dependency modules, and shared/common-library foundations
   before leaf-only rows when the edge has a choice.
8. Full-breadth retry is a bounded backoff, not a repeat of the same broad
   prompt. Code-builder/test-builder edges declare a ten-attempt same-edge
   retry/yield window, and replay-visible prior gaps narrow full-breadth retry
   to targeted repair before terminal ticket triage.
9. Steel-thread is a runtime traversal strategy, not a static GTL/module
   rebuild profile. SDLC chooses the dependency window from admitted
   requirement/module/test dependency maps, for example `req-04` plus the
   dependent requirement rows needed for an MVP thread, and passes those
   selected refs through `StartIntent.runtimeTraversalSelections`. ABG owns the
   runtime envelope, traversal facts, replay, retry, yield, and continuation.
   Full breadth still means fan out over the admitted frontier; steel thread
   means run the coherent bounded dependency slice selected at start time.
10. The SDLC steel-thread dependency window is predecessor-closed. A selected
   requirement or dependency node resolves through admitted module, unit-test,
   and UAT dependency maps to the dependency nodes, requirement refs, ordering
   refs, and required progress artifacts that must run together. That selected
   window is carried only as ABG `StartIntent.runtimeTraversalSelections`;
   SDLC does not continue the traversal locally.

## Superseded Truth

- Treating test generation as a downstream command/proof side effect.
- Letting `sbt test`, `npm test`, or another test command pass with zero
  generated source tests.
- Generating source code with depth annotations while leaving UAT-derived test
  code on a thinner graph path.
- Keeping legacy or confused graph paths alive as fallback behavior after the
  designed code-builder graph path exists.
- Patching generated data-mapper code outside the SDLC builder lane to make the
  proof pass.
- Treating `ODD_SDLC_TS_TRAVERSAL_STRATEGY_PROFILE` as the steel-thread runtime
  mechanism by rebuilding GTL vector declarations for a run.

## Design Commitments

- Graph functions remain the constructive carrier.
- ABG owns traversal, zoom, events, replay, continuation, and re-entry truth.
- `odd_sdlc` owns the code-builder graph-function publication, overlay
  annotations, target-carrier interpretation, worker policy, ticket triage
  meaning, and proof interpretation over admitted ABG evidence.
- Consequence plugins may select only from allowed GTL/ABG traversal catalog
  rows; they do not create route authority, move cursors, write tickets
  directly, or close work.
- Runtime strategy selection is admitted by ABG through start intent. SDLC may
  compute selected dependency refs from product maps; it must not own the
  runtime traversal envelope or continue work with a local loop.
- Plugin result identity, output-carrier selection, and stage-interface
  conformance must be GTL-declared and ABG-admitted. SDLC may consume admitted
  result envelopes and fail closed when they are missing, but it must not
  reconstruct `F_P`/evaluator plugin APIs from local result-file shapes,
  sidecar filenames, or archive scans.
- Static `pluginResultInterfaces` rows supplied to
  `typecheckGtlProgram(...)` are GTL program declarations only. They prove that
  the current SDLC graph program declares its plugin result interfaces; they do
  not prove runtime plugin output admission and must not be used as a local
  selector, compatibility layer, or "latest run wins" archive rule.

## Implementation Checklist

- [x] Publish `Fg_graph_code_builder` in the reusable graph-function catalog.
- [x] Mark `derive_component_code_surface` as a source-code specialization of
      `Fg_graph_code_builder`.
- [x] Mark `derive_component_test_surface` as a module-definition-dependent
      unit/component test-code
      specialization of `Fg_graph_code_builder`.
- [x] Mark `derive_uat_test_source_surface` as the requirement-specific
      UAT-test-code specialization of `Fg_graph_code_builder`.
- [x] Update graph-function inputs and edge closure contracts so
      `component_test_surface` consumes requirement/testcase authority,
      selected tenant/build authority, test design, and implementation design,
      with generated component code consumed downstream at qualification
      fan-in.
- [x] Update target-carrier/staged authority refs so code/test
      materialization cannot close without the applicable tenant-stack,
      testcase, implementation, module-dependency, and test-topology authority
      for that branch.
- [x] Update depth/overlay design text so deep annotations apply equally to the
      source-code, unit/component-test, and UAT-test-code specializations.
- [x] Add matching overlay-only proportional lite graph functions for
      lite/smoke test design, unit/component-test source, and UAT-test source
      so Min(F_P) profiles do not jump directly from source code to execution.
- [x] Remove or retire confused legacy graph declarations that let test
      generation bypass the designed code-builder path.
- [x] Reconcile the STDO tech-debt review: `derive_lite_component_code_surface`
      is documented as an overlay-scoped lite/smoke code-builder profile, not a
      full-traversal fallback, and `prepare/derive test execution` are staged
      execution surfaces whose source/test consistency closes at
      `qualify_component_test_execution_surface`.
- [x] Declare parallel code/test build semantics: source-code and generated-test
      code-builder paths are sibling materialization branches when admitted
      dependency maps select `parallel`; ABG owns the frontier and
      qualification owns source/test fan-in. Closure fails if the frontier does
      not include the UAT test-source branch alongside source-code and
      unit/component-test branches.
- [x] Emit durable staged authority for the UAT branch:
      `operator-run-artifact://uat-test-dependency-map`,
      `operator-run-artifact://uat-test-dependency-traversal-selection`, and
      `sdlc_live_fp_parallel_materialization_frontier` rows with nonzero
      `uatTestLaneCount`.
- [x] Derive unit/component-test dependency maps from source-only module
      definitions when explicit test topology is absent, then derive the UAT
      test-source dependency map from that test authority so code, unit-test,
      and UAT-test branches can appear in one ABG frontier.
- [x] Preserve tenant test-root discoverability for generated UAT test-source
      targets; UAT branches may specialize under the declared test source root
      but must not move outside the tenant's framework-discoverable test tree.
- [x] Make the typed prompt renderer start transform and evaluator prompts with
      the SPEC_METHOD planning invariant so full-breadth, steel-thread, and
      targeted-repair workers all plan, prioritize, and work through evaluated
      pressure before yielding.
- [x] Add focused tests proving the graph-code-builder specialization, UAT test
      source generation inputs, deep overlay depth eligibility, and command-only
      non-closure shape.
- [x] Run semantic verification.
- [x] Consume ABIogenesis `4.0.0-rc.23` runtime start traversal selection.
- [x] Thread public-start/CLI runtime traversal selection into ABG
      `StartIntent.runtimeTraversalSelections`.
- [x] Replace the data-mapper steel-thread live script's static
      `ODD_SDLC_TS_TRAVERSAL_STRATEGY_PROFILE` path with a runtime start
      selection over real requirement refs.
- [x] Add focused tests proving runtime steel-thread selected requirement refs
      are admitted at public start, appear in ABG-derived attempt envelopes, and
      remain SDLC feature-scope refs without falling back to full breadth.
- [x] Add an SDLC dependency-window resolver that turns a selected requirement
      or dependency node into a predecessor-closed runtime steel-thread
      selection with requirement refs, node refs, ordering constraints, progress
      artifacts, and the ten-attempt retry/yield continuation policy.
- [x] Preserve concrete requirement lineage during targeted repair retry
      backoff when no explicit requirement window is present, so retry
      narrowing cannot erase the product-materialization requirement authority
      needed for closure.

## Proof

- `npm run build:semantic` passed with current GTL conformance.
- `node --test test_env/tests/test_t030_graph_catalog_module.test.mjs` passed
  10/10.
- `npm run test:t168` passed 10/10, including
  `T-203 code-builder graph function owns source and UAT test materialization`.
- `npm run test:t172:staged-contracts` passed 22/22.
- `npm run test:t202` passed 6/6, including deep overlay depth rows for both
  component code and component test graph-code-builder specializations.
- `npm run test:t160` passed 26/26, proving overlay regressions stay intact.
- `node --test test_env/tests/test_t191_typed_prompt_assets.test.mjs` proves
  transform, design-depth evaluator, and review-grade evaluator prompts start
  with the SPEC_METHOD planning invariant while preserving GTL prompt-asset
  rendering.
- `node --test test_env/tests/test_t174_feature_dependency_dag_frontier.test.mjs
  test_env/tests/test_t175_source_truth_migration.test.mjs
  test_env/tests/test_t188_data_mapper_live_boundary_guard.test.mjs` passed
  36/36 after adding the UAT ABG-frontier branch and source-only module
  dependency regression.
- `npm run test:semantic` passed 1051/1051 after the UAT frontier hardening,
  source-only module dependency regression, runtime steel-thread
  dependency-window resolver, rc.23 prompt expectation, and targeted-repair
  requirement-lineage preservation.
- `npm run test:t203` passed, proving CLI admission of
  `--runtime-traversal-selection`, public-start threading into ABG
  `StartIntent.runtimeTraversalSelections`, ABG-derived
  `TraversalAttemptEnvelope.strategySelectionSource = runtime_start`, and SDLC
  feature scope preserving runtime-selected requirement refs without
  broadening to full breadth.
- `node --test test_env/tests/test_t122_feature_scope_closure.test.mjs
  test_env/tests/test_t203_runtime_start_steel_thread.test.mjs
  test_env/tests/test_b086_fd_disambiguation_sweep.test.mjs
  test_env/tests/test_t191_typed_prompt_assets.test.mjs
  test_env/tests/test_t151_runner_evaluator_sovereignty.test.mjs
  test_env/tests/test_t158_consequence_admission_regression.test.mjs` passed
  68/68 after adding the predecessor-closed runtime dependency-window proof,
  the rc.23 prompt asset expectation, retry-backoff expectation, and targeted
  repair requirement-lineage preservation.
- ABIogenesis `4.0.0-rc.23` is consumed from the clean immutable release
  snapshot with `sourceDirty: false`; SDLC substrate identity and release
  adapter tests passed against the rc.23 tarball and checksum.
- `test_t174_feature_dependency_dag_frontier` now includes the live failure
  regression where source-only module dependency maps derive unit/component
  test lanes and UAT test-source lanes without requiring pre-existing test
  files.
- `npm run test:t200:data-mapper-detailed-live` passed on
  `test_env/test_runs/data_mapper_deep_sdlc_detail_sandbox/20260615T103908264Z_pid10036`.
  The run observed 14 detail zoom edges against 11 required edges, emitted
  `sdlc_module_dependency_map.json`, `sdlc_test_dependency_map.json`, and
  `sdlc_uat_test_dependency_map.json` from
  `derive_implementation_design_surface`, and proved 8 module, 8
  unit/component-test, and 8 UAT-test dependency nodes. The UAT materialization
  targets remained inside the discoverable JVM test source root, for example
  `build_tenants/scala_spark/cdme-accounting/src/test/scala/uat/CdmeAccountingSpecUatSpec.scala`.
- The same data-mapper live run emitted
  `sdlc_live_fp_parallel_materialization_frontier.json` from
  `derive_component_code_surface` with `devLaneCount = 8`,
  `componentTestLaneCount = 8`, `uatTestLaneCount = 8`, and a first
  ABG-ready batch containing source-code, unit/component-test, and UAT-test
  branches together.
- The data-mapper live run did not patch generated product source manually.
  After component-code repair exhausted the retry budget, the run created
  sandbox tickets `asset:ticket/T-001` and `asset:ticket/T-002` from the
  terminal review-grade gap, admitted ticket execution contracts for both, and
  started `asset:ticket/T-001` through `route_ticket_work_item` on
  `overlay://odd-sdlc/ticket-workflow` to a converged ticket-route result.
- 2026-06-16 steel-thread live follow-up exposed an SDLC admission hygiene bug:
  `GtlContractFulfillmentBinding.testOrExecutionEvidenceRefs` could carry
  duplicate refs from review-grade evidence and make an otherwise admitted
  review-grade assessment invalid. Source fix deduplices review-grade
  fulfillment-binding evidence refs before ABG admission. Verification:
  `npm run build:semantic && node --test
  test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs
  test_env/tests/test_t188_data_mapper_live_boundary_guard.test.mjs
  test_env/tests/test_t203_runtime_start_steel_thread.test.mjs` passed 46/46.
- 2026-06-16 ABIogenesis `4.0.0-rc.29` is consumed for the T-158 compiler and
  result-envelope ingress slice. SDLC supplies `pluginResultInterfaces` only as
  GTL program conformance declarations, consumes the compiler-returned
  `pluginResultInterfaceCatalog` at runtime, and accepts persisted F_P
  evaluator output only when ABG replay exposes an admitted result-envelope
  event whose authority and contract digest match the admitted interface
  contract.
- 2026-06-16 Product drift guard added: the GTL/product gate now asserts that
  Product.md and this ticket keep runtime plugin result envelope admission
  ABG-owned/open and that SDLC does not introduce local `fp_evaluate_result`
  compatibility selectors such as latest-run or alias fallback logic.

## Current Substrate Drift Finding

The 2026-06-16 data-mapper steel-thread live run exposed a real boundary defect:
component-code frontier derivation can see multiple predecessor design-depth
`F_P.evaluate` registers through SDLC artifact lineage, while the accepted rule
outcome that should identify the selected register is not carried as a single
GTL-declared, ABG-admitted plugin result envelope.

The local source paths involved are:

- `build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts`
  source-asset authority discovery, which can add prior operator-run artifacts
  from archive scans.
- `build_tenants/typescript/code/src/operator/plugins/evaluate/design_depth_register.ts`
  design-depth evaluator register admission, which currently reasons over local
  result files and rule-outcome sidecars.
- `build_tenants/typescript/code/src/operator/product_materialization/staged_authority.ts`
  frontier carrier derivation, which correctly fails to produce module/test/UAT
  dependency carriers when implementation-design register admission is
  ambiguous or unadmitted.

This is not a data-mapper product bug and not a prompt-tuning issue. It is also
not a license to add "latest run wins", tolerate old result shapes, or make SDLC
the compiler for `F_P` plugin output APIs. The lawful path is abiogenesis T-158:
GTL declares the plugin result interface, ABG admits one result envelope, and
SDLC consumes that admitted envelope or fails closed.

## Closure Criteria

- `constructSdlcGraphFunctionCatalog()` exposes `Fg_graph_code_builder`, and
  both source-code and component-test materialization edges cite it as their
  specialization.
- The SDLC GTL module and edge-gain closure contracts agree that
  `derive_component_test_surface` consumes requirement/testcase authority,
  selected tenant/build authority, test design, and implementation design;
  generated component code is consumed by downstream
  qualification/execution fan-in.
- Product graph policy marks both source-code and generated-test materialization
  as ABG-frontier eligible when parallel dependency traversal is selected, with
  source-code rows requiring module dependency artifacts, unit/component-test
  rows requiring module and test dependency artifacts, and UAT-test rows
  requiring test dependency artifacts without module-dependency preconditions.
- The live parallel frontier artifact exposes source-code,
  unit/component-test, and UAT-test branches in one ABG-owned frontier and
  records nonzero `uatTestLaneCount` when UAT test-source work is admitted.
- Source-only module definitions still produce unit/component-test branch
  authority; absence of pre-existing test materialization targets is not a
  reason to omit unit-test or UAT-test lanes from the code-builder frontier.
- Generated UAT test-source targets remain under the tenant's discoverable test
  source root for the selected implementation stack.
- Deep overlay declarations expose depth traversal for all three full
  code-builder specializations.
- Lite and framework-smoke overlays expose matching proportional graph
  functions for lite test design, lite unit/component-test source, and lite UAT
  test source before test execution.
- `component_test_surface` closure remains blocked when generated source tests
  are missing, even if a test command ran or returned success.
- Test-run failures are routed to admitted ticket triage/re-entry pressure
  rather than sandbox source patches.
- Transform and evaluator prompts start with the SPEC_METHOD planning invariant:
  make a plan from governing authority, rank the work by contextual closure
  priority, and work through that priority order with critical behavior,
  highest-dependency modules, and shared/common-library foundations first.
- ABG attached F_P retry attempts are configured at 10 for installed SDLC
  starts; SDLC does not run a local retry loop.
- Steel-thread live starts use `StartIntent.runtimeTraversalSelections` and do
  not rebuild the GTL module with a steel-thread profile.
- Runtime-selected requirement refs are visible in the ABG attempt envelope and
  SDLC handoff feature scope.
- A runtime steel-thread selected from a requirement closes over predecessor
  dependency nodes and carries both selected dependency-node refs and
  normalized `requirement://...` refs rather than broadening to unrelated
  branches.
- Replay-visible prior gaps over a full-breadth code/test-builder edge produce
  a `retry_backoff` strategy decision and targeted repair scope before ticket
  triage.
- Design/evaluator plugin output consumed by code/test-builder frontier
  derivation is selected from GTL-declared, ABG-admitted result-interface truth.
  If SDLC must identify the current register by local archive scan, raw
  `fp_evaluate_result.json` shape probing, sidecar filename convention, or
  compatibility alias, this ticket remains open and the substrate gap is tracked
  by abiogenesis T-158.
- Static `pluginResultInterfaces` conformance rows alone are not enough to
  close this criterion. SDLC must consume the ABG-admitted
  `pluginResultInterfaceCatalog` plus replay-visible result-envelope events for
  persisted evaluator output.
- No fallback graph declaration, overlay edge, worker policy, or target-carrier
  row lets this behavior bypass the single designed code-builder path.
- Focused tests and `npm run build:semantic` pass.

## Non-Closure Conditions

- Any command-only test proof with no generated source tests.
- Any product-local recursive controller, cursor movement, event emission,
  ticket write, or closure decision outside ABG admission/re-entry.
- Any direct generated data-mapper patch used as proof for this ticket.
- Any SDLC path where code generation gets depth annotations but UAT-derived
  test code generation does not.
- Any lite/smoke profile that jumps from lite component code directly to test
  execution without either generated test-source branches or admitted
  preserved no-close test pressure.
- Any prompt-bearing transform/evaluate path whose rendered prompt does not
  start with the SPEC_METHOD planning invariant.
- Any steel-thread run that depends on static GTL/module regeneration instead
  of runtime start traversal selection.
- Any runtime-selected requirement dependency window that is broadened back to
  full breadth before the worker handoff.
- Any SDLC code path that treats local result-file shape probing, sidecar
  filename conventions, or archive scans as the authoritative plugin result
  interface instead of consuming GTL-declared, ABG-admitted result truth.
- Any unresolved duplicate/confused graph path for source/test materialization,
  test-run validation, ticket triage, or re-entry.

## STDO Tech-Debt Review

Current duplicate-output rows are intentional profile variants, not alternate
truth paths:

- `derive_component_code_surface` is the full-traversal implementation-source
  builder specialization.
- `derive_component_test_surface` is the full-traversal unit/component test
  builder specialization. It is requirement + design + module specific.
- `derive_uat_test_source_surface` is the full-traversal UAT executable test
  builder specialization. It is requirement / UAT-testcase specific and must run
  as a peer branch when parallel dependency traversal is selected.
- `derive_lite_component_code_surface` is overlay-only for lite/smoke
  traversals. It may produce `component_code_surface` for that bounded overlay,
  but it is not eligible as a fallback route for current-full or deep
  source/test materialization.
- `derive_lite_test_design_surface`, `derive_lite_component_test_surface`, and
  `derive_lite_uat_test_source_surface` are overlay-only proportional lite
  profiles. They output the same typed test carriers as the full path while
  consuming the bounded lite design authority available to smoke profiles.

`derive_scenario_surface` is UAT-bound scenario authority derived from
requirements, UAT testcase pressure, testcase authority, and design. It is not
a replacement for `derive_uat_testcases_surface`; it is the design/scenario
carrier that later test-design and generated-test paths consume.

`prepare_test_execution_surface` and `derive_test_execution_result_surface` are
staged execution surfaces. They do not prove source/test consistency by
themselves. `qualify_component_test_execution_surface` is the first fan-in edge
that must see generated component code, generated test source, execution truth,
and expected-result authority together before test closure can advance.
