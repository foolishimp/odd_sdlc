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

## Design Commitments

- Graph functions remain the constructive carrier.
- ABG owns traversal, zoom, events, replay, continuation, and re-entry truth.
- `odd_sdlc` owns the code-builder graph-function publication, overlay
  annotations, target-carrier interpretation, worker policy, ticket triage
  meaning, and proof interpretation over admitted ABG evidence.
- Consequence plugins may select only from allowed GTL/ABG traversal catalog
  rows; they do not create route authority, move cursors, write tickets
  directly, or close work.

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
- [x] Add focused tests proving the graph-code-builder specialization, UAT test
      source generation inputs, deep overlay depth eligibility, and command-only
      non-closure shape.
- [x] Run semantic verification.

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
- `node --test test_env/tests/test_t174_feature_dependency_dag_frontier.test.mjs
  test_env/tests/test_t175_source_truth_migration.test.mjs
  test_env/tests/test_t188_data_mapper_live_boundary_guard.test.mjs` passed
  36/36 after adding the UAT ABG-frontier branch and source-only module
  dependency regression.
- `npm run test:semantic` passed 1048/1048 after the UAT frontier hardening
  and source-only module dependency regression.
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
- `component_test_surface` closure remains blocked when generated source tests
  are missing, even if a test command ran or returned success.
- Test-run failures are routed to admitted ticket triage/re-entry pressure
  rather than sandbox source patches.
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

`derive_scenario_surface` is UAT-bound scenario authority derived from
requirements, UAT testcase pressure, testcase authority, and design. It is not
a replacement for `derive_uat_testcases_surface`; it is the design/scenario
carrier that later test-design and generated-test paths consume.

`prepare_test_execution_surface` and `derive_test_execution_result_surface` are
staged execution surfaces. They do not prove source/test consistency by
themselves. `qualify_component_test_execution_surface` is the first fan-in edge
that must see generated component code, generated test source, execution truth,
and expected-result authority together before test closure can advance.
