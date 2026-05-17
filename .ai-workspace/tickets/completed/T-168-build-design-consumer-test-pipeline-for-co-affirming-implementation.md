---
id: T-168
title: Build design-consumer test pipeline for co-affirming implementation
type: feature
ticket_category: test_pipeline
status: completed
review_status: closed_superseded_by_strategy_2026-05-16
closure_disposition: superseded_not_implemented
superseded_by:
  - .ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md
goal: tests-and-implementation-co-affirm-design-interpretation
build_tenant: typescript
owner: odd_sdlc
change_intent: Make the TypeScript SDLC test pipeline a first-class direct consumer of admitted design assets, so implementation code and test assets independently interpret the same design authority and co-affirm each other through admitted test execution evidence.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-15
created_at: 2026-05-15
updated_at: 2026-05-16
activated_at: 2026-05-15
governance_scope: STDO Method
first_missing_layer: design
stdo_re_entry_decision: design_reframe over the TypeScript SDLC test-pipeline model before implementation
ticket_status_authority: this ticket file plus admitted closure proof; comments and forensic posts are evidence only
execution_contract_policy: operator-admitted active ticket work on 2026-05-15; active execution must derive a run-scoped contract from this ticket
source_documents:
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/15-odd-sdlc-scheduling-phase.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260515_t164_data_mapper_full_capability_vs_test35_forensic.md
  - .ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md
  - .ai-workspace/tickets/completed/T-093-add-governed-scheduling-phase-between-design-and-realization.md
  - .ai-workspace/tickets/completed/T-094-normalize-test-run-archive-execution-evidence-status-contract.md
  - .ai-workspace/tickets/completed/T-095-require-governed-live-test-execution-for-test-run-archive-edge.md
  - .ai-workspace/tickets/completed/T-100-require-test-module-materialization-discoverable-by-declared-test-contract.md
  - .ai-workspace/tickets/completed/T-104-split-test-execution-from-test-run-archive-surface.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
related_tickets:
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-093-add-governed-scheduling-phase-between-design-and-realization.md
  - .ai-workspace/tickets/completed/T-100-require-test-module-materialization-discoverable-by-declared-test-contract.md
  - .ai-workspace/tickets/completed/T-104-split-test-execution-from-test-run-archive-surface.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/graph/overlays.ts
  - build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts
  - build_tenants/typescript/code/src/graph/boundary_refs.ts
  - build_tenants/typescript/code/src/graph/library.ts
  - build_tenants/typescript/code/src/domain/software_domain_catalog.ts
  - build_tenants/typescript/code/src/domain/carriers.ts
  - build_tenants/typescript/code/src/domain/admission.ts
  - build_tenants/typescript/code/src/workspace/project_profile.ts
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/operator/traversal_strategy.ts
  - build_tenants/typescript/code/src/operator/component_depth_register.ts
  - build_tenants/typescript/code/src/operator/edge_gain_closure.ts
  - build_tenants/typescript/code/src/operator/assurance_gate.ts
  - build_tenants/typescript/code/src/assurance/component_depth.ts
  - build_tenants/typescript/code/src/shared/traversal_strategy_plan.ts
  - build_tenants/typescript/code/src/shared/blocking_reason.ts
  - build_tenants/typescript/code/src/operational/policy.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/projection/requirement_closure.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/fixtures/
  - build_tenants/typescript/test_env/sandbox/
  - build_tenants/typescript/test_env/test_surface_map.md
excluded_boundary:
  - treating tests as incidental source files emitted by the implementation-code worker
  - treating UATs as unit tests
  - allowing component-code closure to clear downstream test or release pressure
  - allowing `product_converged` before admitted test execution evidence
  - adding a second runtime or test controller outside ABG-owned traversal and replay truth
target_truth: Unit tests, integration tests, and UAT tests are first-class product assets built from admitted design assets. Implementation and tests independently consume the same design authority, then co-affirm their interpretations through compile/test execution evidence, obligation ledgers, and closure decisions.
superseded_truth: Tests may be generated opportunistically by the code-materialization worker, derived from produced code, left as pending skeletons, or skipped when component code closes.
closure_law: This ticket closes only when the TypeScript tenant preserves design assets as active transformation inputs for both implementation and test construction, runs the test lifecycle edges after component/code materialization, admits compile/test execution evidence, and blocks product convergence until implementation and tests co-affirm the same design obligations.
evaluation_criteria:
  - unit and integration tests are built from design assets, not from worker memory or emitted code shape alone
  - UAT tests are built from UAT test cases, and UATs are classified as integration tests over product behavior
  - design assets remain active transformation assets after implementation-code closure
  - component-code closure cannot clear downstream test-design, component-test, test-execution, or release-depth pressure
  - test lifecycle graph functions are selected by the installed runtime after code materialization
  - test handoff packages name the consumed design assets, UAT test cases, target test assets, and execution contracts
  - test implementation output is admitted separately from implementation source output
  - `sbt compile` and `sbt test` evidence are first-class closure inputs when declared
  - generated test cases include generated or selected test data bound to the
    case, expected result, and source design obligation
  - test execution runs through the declared framework or command contract, not
    through a harness assertion that bypasses the product test path
  - result verification covers the declared test-case range, including
    representative positive, negative, boundary, and integration/UAT cases
  - every test-case execution phase correlates to a cataloged graph node and
    named producer/consumer edge, or the ticket explicitly adds that node/edge
  - co-affirmation ledgers connect design obligations to implementation evidence, test evidence, and execution evidence
  - query-domain and run archives show remaining test/release pressure until those edges close
proof_surface:
  - design module for the test pipeline carrier family and graph flow
  - deterministic fixture proving component-code close leaves test pipeline pressure active
  - deterministic fixture proving unit/integration test assets are derived from design assets
  - deterministic fixture proving UAT cases produce UAT integration tests
  - deterministic fixture proving test data is generated or selected for a
    declared range of test cases and bound to expected results
  - deterministic fixture proving declared framework execution and result
    verification are admitted as closure evidence
  - live or live-equivalent data_mapper run that observes test lifecycle edge handoffs after component-code close
  - archive evidence for `derive_test_design_surface`, `derive_component_test_surface`, `prepare_test_execution_surface`, `derive_test_execution_result_surface`, and `derive_test_run_archive_surface`
  - negative fixture where `executionEvidenceStatus: null` cannot close product convergence for executable code/test edges
non_closure_conditions:
  - test files exist only because the component-code worker wrote them
  - tests are pending skeletons and still count as fulfilled test implementation
  - UAT tests are not traceable to UAT test case assets
  - UAT tests are classified as unit tests or detached from integration behavior
  - design assets are included only as prompt context and not carried as transformation-set refs
  - final component-code ledgers have empty downstream test pressure while test lifecycle edges are still unrun
  - `product_converged` appears before test execution evidence is admitted
  - compile/test contracts appear in prompts but not in closure law
  - test cases exist without admitted test data or expected-result bindings
  - the declared test framework/command contract is absent or bypassed by the
    harness
  - test data, expected results, framework execution, observed results, or
    verification rows exist only as prose and do not correlate to typed graph
    nodes/assets and named graph-function edges
  - result verification is limited to source existence, zero-test output, or a
    single happy-path case when the design requires broader coverage
  - resume/live harness accepts runtime `converged` while required test lifecycle edge handoffs are absent
---

# T-168: Design-Consumer Test Pipeline

## Supersession Closure - 2026-05-16

This ticket is closed as superseded, not implemented and not invalid.

The superseding surface is:

`.ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md`

The valid content from this ticket is absorbed by the strategy:

- implementation and tests must co-affirm design interpretation;
- executable test obligations require admitted execution evidence;
- component-code closure cannot clear downstream test or release pressure;
- UAT cases produce integration-test behavior evidence.

The ticket no longer stands as an independent active implementation surface
because its scope must be recast under the broader authority-placement strategy:
`F_D` admits, folds, and routes evidence; `F_P` constructs and judges ambiguous
content; execution returns product truth; iteration closes completeness.

Any future implementation must start from the superseding strategy, not from
this retired ticket's original closure law.

## STDO Triage

First missing layer: design.

Smallest lawful re-entry point: design.

Change class: design_reframe.

The latest T-164 forensic archive shows that the TypeScript runtime can close a
full-breadth component-code edge while the assurance/test pipeline produces no
first-class traversal evidence. The final component-code ledger had empty
downstream pressure refs, the next-action projection selected no action, and
every downstream test/release lifecycle edge had zero handoff archives.

That is not only a harness bug. The deeper design gap is that implementation
and tests are not yet modeled as sibling constructive consumers of the same
design assets.

The product needs this law:

```text
design assets
  -> implementation construction
  -> implementation evidence

design assets
  -> unit/integration test construction
  -> test evidence

UAT test cases
  -> UAT tests
  -> integration-test evidence

implementation evidence + test evidence + execution evidence
  -> co-affirmed design interpretation
  -> product closure
```

## STDO Governance

Operator admission: on 2026-05-15 the operator reviewed this ticket and
authorized active execution. T-162 remains active as the broader first-class
ticket-workflow implementation; this ticket is admitted as the design-consumer
test-pipeline work item and must keep its own closure proof.

This ticket is the durable work authority for the design-consumer test-pipeline
repair. The forensic post is evidence and intake; it is not status authority.
Chat phrasing is intake; it is not an execution contract.

The authority chain for this work is:

```text
GOALS / INTENT / PRODUCT
-> requirements for software-domain buildout, installed product contract,
   scheduling, and edge closure
-> TypeScript traversal / assurance design
-> T-168 ticket authority
-> admitted run-scoped execution contract
-> code / tests / events / ledgers / projections
-> closure or residual pressure
```

The work must not begin from code alone. The first implementation step is a
design module that declares how design assets become active transformation
inputs for both implementation and test construction.

The ticket is admitted for implementation only after the design module names:

- the test-pipeline graph shape;
- the design-consumption carrier;
- the UAT-case-to-integration-test carrier;
- the co-affirmation ledger;
- execution-evidence admission;
- non-close behavior when implementation and tests disagree;
- the rule that product convergence cannot clear unrun test/release pressure.

Until that design exists, code changes are premature except for read-only probes
or tests that prove the current defect.

## Status Authority

The ticket status is `active` by explicit operator admission. A runtime run,
comment, review note, or green local check cannot make this ticket completed by
implication.

Completion requires an admitted closure review against this ticket's
`closure_law`, `evaluation_criteria`, `proof_surface`, and
`non_closure_conditions`.

Evidence that may support closure:

- design module diff;
- graph/catalog/overlay/runtime diffs;
- deterministic test output;
- live or live-equivalent data_mapper archive;
- admitted ledgers and next-action projections proving remaining test pressure
  survives component-code closure;
- compile/test execution evidence for executable code/test edges.

Evidence that cannot support closure by itself:

- a worker summary;
- source files existing under `build_tenants/`;
- pending test files;
- prompt text mentioning `sbt test`;
- `product_converged` without observed downstream test lifecycle handoffs;
- a forensic comment or chat statement saying the issue is understood.

## STDO Invariants

1. Design assets are source inputs to the test pipeline, not prompt decoration.
2. Implementation and tests are sibling consumers of the same admitted design
   authority.
3. UAT test cases produce UAT integration tests, not unit tests.
4. Test assets are admitted separately from implementation assets.
5. Execution evidence is admitted separately from source materialization.
6. Product convergence requires co-affirmation between implementation evidence,
   test evidence, and execution evidence.
7. Missing test lifecycle traversal is residual pressure, not success.
8. ABG remains the owner of traversal, events, continuations, replay, and raw
   runtime truth.

## Problem Statement

The current runtime can treat component-code materialization as terminal product
convergence. In the T-164 data_mapper archive, this caused the run to stop after
`derive_component_code_surface` even though the original full-capability harness
listed test and release lifecycle edges.

The result was false convergence:

- source files existed;
- component-code obligations were marked fulfilled;
- test files existed only as pending skeletons;
- no test design edge ran;
- no component test edge ran;
- no test execution result edge ran;
- no test-run archive edge ran;
- no `sbt compile` or `sbt test` evidence was admitted.

The missing model is not "generate more tests from code." The missing model is
that tests are independent consumers of design authority. They should challenge
and co-affirm the implementation's interpretation of the design.

## Required Model

### 1. Unit And Integration Tests From Design Assets

Unit and integration tests must be built from admitted design assets:

- feature decomposition;
- design surface;
- scenario surface;
- implementation design;
- implementation module surface;
- aggregate domain model;
- component topology;
- sunny-day sequence;
- realization schedule;
- UAT test case assets when the test is UAT/integration scoped.

The implementation path and test path may share those design assets, but neither
path should derive its truth solely from the other path's emitted files.

### 2. UAT Test Cases Produce UAT Integration Tests

UATs are integration tests over product behavior. The pipeline must make this
explicit:

```text
UAT test cases -> UAT tests -> integration test execution evidence
```

UATs are not unit tests. They should bind scenario/business acceptance behavior,
exercise integrated product boundaries, and produce execution evidence that can
co-affirm or reject implementation interpretation.

### 3. Co-Affirmation Closure

Product closure must require co-affirmation:

```text
implementation satisfies design obligations
+ tests derived from the same design obligations exist
+ tests execute against implementation
+ execution evidence is admitted
+ unresolved design/test/implementation interpretation conflicts are absent
-> close
```

If tests and implementation disagree about a design obligation, the edge should
yield, repair, re-enter, or reprice with typed residual pressure. It should not
clear the pressure by declaring product convergence.

## Implementation Direction

The ticket should introduce a design module such as:

```text
build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
```

The design should define carriers in this family:

```text
SdlcDesignConsumptionContract
SdlcImplementationDesignBinding
SdlcTestDesignBinding
SdlcUatCaseToIntegrationTestBinding
SdlcCoAffirmationLedger
SdlcTestExecutionEvidenceAdmission
```

Names may change, but the boundaries must remain:

- design-consumption binding is not prompt prose;
- implementation and tests bind to the same admitted design refs;
- UAT test cases bind to integration tests;
- execution evidence is admitted separately from source materialization;
- product convergence depends on the co-affirmation ledger.

## Required Graph Flow

The current graph must preserve downstream pressure after implementation-code
closure:

```text
derive_component_code_surface
  -> qualify_component_realization_surface
  -> derive_code_surface
  -> derive_test_design_surface
  -> derive_component_test_surface
  -> prepare_test_execution_surface
  -> derive_test_execution_result_surface
  -> qualify_component_test_execution_surface
  -> derive_component_repair_schedule_surface
  -> derive_test_run_archive_surface
  -> derive_release_depth_parity_surface
  -> prepare_release_surface
```

The exact edge sequence may be repriced, but the product must not collapse
component-code closure into product convergence while test pressure remains.

## Implementation Gate

Implementation must proceed in this order unless repriced in the ticket before
work starts:

1. Design the test-pipeline carrier family and graph flow.
2. Add deterministic tests that reproduce the current defect: component-code
   close clearing test pressure.
3. Implement pressure preservation so component-code close selects the next
   test/release edge when required.
4. Implement design-consumption binding for test edges.
5. Implement UAT-case-to-integration-test binding.
6. Admit compile/test execution evidence as closure input for executable
   code/test edges.
7. Run live or live-equivalent data_mapper proof through the test lifecycle.

The ticket should be split if step 1 exposes separate requirement-level
repricing, shared-method changes, or ABG substrate changes.

## Forensic Trigger

This ticket is created from the T-164 data_mapper forensic finding:

```text
Latest T-164: platform/edge-assurance proof passed.
test35 completeness: not yet passed.
```

The reason was not only missing execution evidence. The runtime failed to carry
design-derived downstream test pressure after component-code closure. The test
pipeline therefore did not act as a consumer of design assets.

## Acceptance

T-168 is complete only when a live or live-equivalent data_mapper proof shows:

- component-code closure does not end the run;
- test design and test implementation edges run after code materialization;
- UAT test case assets produce UAT integration tests;
- test files are not merely pending skeletons;
- compile/test execution evidence is admitted;
- product convergence appears only after implementation and tests co-affirm the
  same design obligations.

## Complete Work Register

This section is the ticket register for the work to be done. If implementation
discovers an additional required surface, update this register before widening
the patch. Closure must account for every registered surface as implemented,
proved unnecessary, or split into a new ticket.

The TypeScript tenant is graph-function-first today:
`constructSdlcGtlModule` publishes graph functions and jobs, while the
module-level `graphs` collection is currently empty. The graph functions below
still materialize GTL graphs/vectors through ABG graph-function materialization
and are the concrete traversal surfaces for this work.

### 1. STDO Design Work

- Create `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md`.
- Define the design-consumer test-pipeline graph shape.
- Define the carrier family for:
  - `SdlcDesignConsumptionContract`;
  - `SdlcImplementationDesignBinding`;
  - `SdlcTestDesignBinding`;
  - `SdlcUatCaseToIntegrationTestBinding`;
  - `SdlcCoAffirmationLedger`;
  - `SdlcTestExecutionEvidenceAdmission`.
- Define how design assets remain active transformation inputs for both
  implementation and test construction after component-code closure.
- Define how UAT testcase authority produces UAT integration tests.
- Define how implementation evidence, test evidence, and execution evidence
  co-affirm one design interpretation.
- Define the test-case execution contract: test-case generation, test-data
  generation or selection, declared framework execution, result verification,
  and coverage range admission.
- Define non-close behavior when implementation/test/execution evidence
  disagrees.
- Reprice or update related TypeScript design documents only where they
  contradict the new test-pipeline design:
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`;
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md`;
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SCHEDULING_PHASE.md`.

### 2. Graph Publication And Overlay Work

- `build_tenants/typescript/code/src/graph/catalog.ts`
  - Register any new graph-function entries needed by the design.
  - Update inputs/outputs for existing test and release graph functions where
    design-consumption refs, UAT testcase refs, co-affirmation refs, or
    execution-evidence refs must become explicit assets.
  - Keep implementation and test paths as sibling consumers of design assets.
- `build_tenants/typescript/code/src/graph/module.ts`
  - Publish any new graph functions through `constructSdlcGtlModule`.
  - Update executive membership and jobs if graph-function membership changes.
  - Preserve the graph-function-first publication model unless separately
    repriced.
- `build_tenants/typescript/code/src/graph/overlays.ts`
  - Update `overlay://odd-sdlc/current-full-traversal` so it cannot emit
    `product_converged` while required test/release pressure remains.
  - Update `overlay://odd-sdlc/solution-architecture` as the design authority
    producer for implementation/test design binding.
  - Update `overlay://odd-sdlc/uat-test-cases` as the UAT testcase authority
    producer for UAT-to-integration-test binding.
  - Update `overlay://odd-sdlc/lite-design-module-implementation` so lite
    component-code output preserves next test/release traversal pressure.
  - Update asset templates, remaining pressure, terminal graph functions, and
    next-eligible overlay refs as required.
- `build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts`
  - Add or update source asset policies, residual pressure refs, proof lanes,
    and closure classification for every test/release edge in this register.
  - Prevent component-code closure from erasing test-design, component-test,
    test-execution, archive, parity, or release pressure.
- `build_tenants/typescript/code/src/graph/boundary_refs.ts`
  - Add boundary refs only if new graph-function, vector, carrier, or ledger
    refs require typed publication.
- `build_tenants/typescript/code/src/graph/library.ts`
  - Touch only if reusable graph-function catalog metadata must name the new
    design-consumption or co-affirmation closure contract.

### 3. Graph Function Register

Every graph function below is in scope for this ticket. If a graph function is
unchanged by implementation, the closure review must state why the existing
function already satisfies the new design-consumer test-pipeline law.

Executive graph functions:

- `bootstrap_release_self_test`
- `release_operational_cycle`
- `bootstrap_requirements`
- `solution_architecture`
- `uat_test_cases`
- `lite_design_module_implementation`

Upstream source-authority graph functions:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_feature_decomp_surface`
- `derive_design_surface`
- `derive_scenario_surface`
- `derive_implementation_design_surface`

Implementation sibling graph functions:

- `derive_component_code_surface`
- `qualify_component_realization_surface`
- `derive_code_surface`

Test construction, execution, archive, and UAT qualification graph functions:

- `derive_test_design_surface`
- `derive_component_test_surface`
- `prepare_test_execution_surface`
- `derive_test_execution_result_surface`
- `qualify_component_test_execution_surface`
- `derive_component_repair_schedule_surface`
- `derive_test_run_archive_surface`

Release and execution-evidence graph functions:

- `derive_release_depth_parity_surface`
- `prepare_release_surface`
- `prepare_build_execution_surface`
- `derive_build_execution_result_surface`
- `derive_runtime_observation_surface`

Reusable/supporting graph functions whose contracts or ledger interpretation
may be touched, without transferring ABG-owned traversal/runtime truth into the
product layer:

- `Fg_single_typed_traversal`
- `Fg_materialize_declared_product_asset`
- `Fg_materialization_assurance_ledger`
- `Fg_semantic_convergence_assurance_ledger`
- `Fg_obligation_carry_assurance_ledger`
- `Fg_requirement_fulfillment_assurance_ledger`
- `Fg_capability_assurance_ledger`
- `Fg_shallow_realization_assurance_ledger`
- `Fg_traversal_assurance_fold`

Triage graph functions are conditional scope. Touch them only if the new
test-pipeline residual pressure must route through gap/ticket triage rather
than normal next-action projection:

- `observe_gap_pressure`
- `classify_gap_triage`
- `bind_gap_route`
- `route_ticket_work_item`
- `retire_gap_after_loopback`

### 4. Carrier, Domain, And Admission Work

- `build_tenants/typescript/code/src/operator/carriers.ts`
  - Add or update carrier types for design consumption, implementation/test
    design binding, UAT integration-test binding, co-affirmation ledger rows,
    and test execution evidence admission.
  - Ensure test assets and execution evidence are admitted separately from
    implementation source materialization.
- `build_tenants/typescript/code/src/domain/software_domain_catalog.ts`
  - Register any new asset families or asset types needed by the test-pipeline
    carrier family.
  - Keep UATs in the qualification/integration lane, not the unit-test lane.
- `build_tenants/typescript/code/src/domain/carriers.ts`
  - Add or update domain-level carrier refs used by query-domain, public start,
    or operator projections.
- `build_tenants/typescript/code/src/domain/admission.ts`
  - Admit and validate any new carrier fields, refs, and closure evidence rows.
- `build_tenants/typescript/code/src/workspace/project_profile.ts`
  - Ensure test execution capability contracts and tenant test contracts are
    projected into worker handoffs when declared by the worksite.
- `build_tenants/typescript/code/src/operator/component_depth_register.ts`
  - Preserve component-code, component-test, component-test-qualification, and
    release-depth rows independently.
- `build_tenants/typescript/code/src/assurance/component_depth.ts`
  - Evaluate component test realization, test qualification, repair schedule,
    and release-depth parity without treating code materialization as enough.

### 5. Handoff And Worker Contract Work

- `build_tenants/typescript/code/src/operator/handoff.ts`
  - Add design-consumption refs to implementation and test handoff manifests.
  - Add UAT testcase refs to UAT/integration test handoff manifests.
  - Require component test handoffs to materialize real test files or admit a
    typed non-close/yield/repair disposition.
  - Require `prepare_test_execution_surface` and
    `derive_test_execution_result_surface` handoffs to carry execution
    contracts and returned execution evidence.
  - Preserve `sbt compile` and `sbt test` as execution evidence only when they
    are declared by the tenant/worksite contract.
  - Reject prompt-only design context that is not carried as transformation-set
    refs or typed design-consumption refs.
  - Update retry/repair instructions so evaluated gaps are included as current
    gap registers, not just conversational prose.
- `build_tenants/typescript/code/src/operator/edge_gain_closure.ts`
  - Ensure edge gain and closure functions read the new design/test/evidence
    refs when deciding close, retry, repair, yield, re-enter, or reprice.
- `build_tenants/typescript/code/src/operator/assurance_gate.ts`
  - Gate closure on admitted ledger and evidence refs, not source-file
    existence.

### 6. Runtime Progression And Closure Work

- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - Preserve downstream pressure after `derive_component_code_surface` and
    `derive_code_surface`.
  - Select the next required test/release edge after component-code closure.
  - Prevent `product_converged` when test-design, component-test,
    test-execution, test-run archive, release-depth-parity, or release
    pressure remains.
  - Distinguish missing execution evidence from product convergence.
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  - Carry downstream pressure, target bindings, edge ledgers, closure decisions,
    overlay segment completion, and next-action projections through replay.
  - Make `product_converged` impossible when remaining graph/requirement/asset
    pressure or next-eligible overlay refs exist.
- `build_tenants/typescript/code/src/operator/traversal_strategy.ts`
  - Ensure retry/local repair and selected traversal strategy can select test
    and release edges after implementation closes.
- `build_tenants/typescript/code/src/shared/traversal_strategy_plan.ts`
  - Keep the default/full-breadth and steel-thread profiles aligned with the
    complete test/release lifecycle.
- `build_tenants/typescript/code/src/shared/blocking_reason.ts`
  - Add or update typed blocking reasons for missing design-consumption refs,
    missing UAT integration binding, missing test execution evidence, failed
    co-affirmation, and premature convergence.
- `build_tenants/typescript/code/src/operational/policy.ts`
  - Ensure test execution evidence policy remains separate from build,
    deployment, and runtime-return policy.

### 7. Projection, Public Start, And Method Entry Work

- `build_tenants/typescript/code/src/projection/query_domain.ts`
  - Publish graph functions, vectors, overlays, pressure refs, design/test
    bindings, closure decisions, and execution evidence in read models.
  - Show remaining test/release pressure after component-code closure.
- `build_tenants/typescript/code/src/projection/requirement_closure.ts`
  - Prevent requirement closure from ignoring unrun test/release lifecycle
    pressure when the requirement declares executable proof.
- `build_tenants/typescript/code/src/start/public_start.ts`
  - Ensure start/resume/replay chooses the next required graph function instead
    of stopping after component-code close.
  - Preserve overlay selection and next-eligible overlay refs for the lite and
    full traversal paths.
- `build_tenants/typescript/code/src/spec_method/entry.ts`
  - Keep method-level projections consistent with the new closure law and
    replay-visible next-action truth.

### 8. Deterministic Test Register

- Add a new deterministic lane, expected path:
  `build_tenants/typescript/test_env/tests/test_t168_design_consumer_test_pipeline.test.mjs`.
- Add package script `test:t168`.
- The new T-168 deterministic lane must prove:
  - component-code closure leaves downstream test/release pressure active;
  - test design and component test edges are selected after code materialization;
  - unit/integration test assets carry design-consumption refs;
  - UAT testcase assets produce UAT integration-test binding;
  - test cases include admitted test data or data-generation instructions;
  - expected results are bound to each test case before execution;
  - declared framework/command execution is the source of execution evidence;
  - verification checks actual results against expected results across the
    declared range of cases;
  - component-test files are not accepted as pending skeletons;
  - missing or failed test execution evidence blocks closure;
  - co-affirmation ledger rows connect design obligations to implementation,
    test, and execution evidence;
  - `product_converged` cannot appear before the required test/release edges
    close.
- Update existing deterministic lanes where their asserted contract changes:
  - `test_env/tests/test_t030_graph_catalog_module.test.mjs`;
  - `test_env/tests/test_t032_query_gap_projection.test.mjs`;
  - `test_env/tests/test_t033_public_start.test.mjs`;
  - `test_env/tests/test_t037_operational_transition_runtime_return.test.mjs`;
  - `test_env/tests/test_t039_query_domain_structural_drift.test.mjs`;
  - `test_env/tests/test_t089_traversal_pressure_enforcement.test.mjs`;
  - `test_env/tests/test_t093_scheduling_phase.test.mjs`;
  - `test_env/tests/test_t113_component_depth_register_admission.test.mjs`;
  - `test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`;
  - `test_env/tests/test_t138_traversal_consequence_replayability.test.mjs`;
  - `test_env/tests/test_t153_non_close_disposition_parity.test.mjs`;
  - `test_env/tests/test_t158_consequence_admission_regression.test.mjs`;
  - `test_env/tests/test_t160_traversal_overlays.test.mjs`;
  - `test_env/tests/test_t164_edge_gain_closure_contract.test.mjs`.

### 9. Test Case Execution Register

This ticket covers execution of generated test cases, not only generation of
test assets. The test pipeline must construct and admit the full execution
chain:

```text
design obligations
-> test cases
-> test data / input fixtures
-> expected results / assertions
-> declared framework or command execution
-> observed results
-> verification rows
-> co-affirmation or typed residual pressure
```

These phases must correlate to actual graph nodes and graph-function edges. The
implementation must not leave them as informal prompt sections, worker summary
phrases, or harness-only assertions.

Current graph-node correlation:

- design obligations: `requirement_surface`, `design_surface`,
  `scenario_surface`, `implementation_design_surface`;
- test design, UAT testcase rows, testcase authority rows, module/allocation
  rows, topology rows, data bindings, expected-result bindings, and execution
  schedule rows: `test_design_surface`, produced by
  `derive_test_design_surface`;
- materialized component tests: `component_test_surface`, produced by
  `derive_component_test_surface`;
- declared framework or command execution: `test_execution_surface`, produced
  by `prepare_test_execution_surface`;
- observed execution result: `test_execution_result_surface`, produced by
  `derive_test_execution_result_surface`;
- verification rows: `component_test_qualification_surface`, produced by
  `qualify_component_test_execution_surface`;
- repair pressure: `component_repair_schedule_surface`, produced by
  `derive_component_repair_schedule_surface`;
- archived test proof: `test_run_archive_surface`, produced by
  `derive_test_run_archive_surface`;
- release co-qualification: `release_depth_parity_surface`, produced by
  `derive_release_depth_parity_surface`;
- release readiness: `release_surface`, produced by `prepare_release_surface`.

Required node/edge additions or explicit typed bindings:

- test cases must be represented as typed rows on `test_design_surface` with
  stable refs consumed by downstream test edges;
- test data / input fixtures must be represented as typed rows on
  `test_design_surface` with stable refs consumed by execution and verification
  edges;
- expected results / assertions must be represented as typed rows on
  `test_design_surface` with stable refs consumed by
  `derive_test_execution_result_surface` and
  `qualify_component_test_execution_surface`;
- co-affirmation must be represented either as a new first-class ledger node or
  as typed rows linking `implementation` evidence, `component_test_surface`,
  `test_execution_result_surface`, and `component_test_qualification_surface`.

Required work:

- Generate or select test data for each generated unit, integration, and UAT
  test case.
- Bind each test datum to the source design obligation, testcase ref, expected
  result, and target execution lane.
- Declare the test framework or command contract for each execution lane, for
  example `sbt test` only when the installed worksite declares that Scala/SBT
  test contract.
- Execute tests through the declared framework/command contract and admit the
  resulting evidence as `test_execution_result_surface` truth.
- Verify observed results against expected results and produce verification
  rows that can be read by closure, projection, and run-archive surfaces.
- Cover a range of cases appropriate to the design obligation:
  - positive/sunny-day cases;
  - negative/error cases;
  - boundary/edge cases;
  - integration/UAT cases spanning product behavior;
  - regression cases derived from prior residual pressure or repair history.
- Block closure when the case range is missing, test data is absent,
  framework execution is bypassed, zero tests run, or result verification is
  not admitted.

### 10. Fixture, Scenario, And Live-Proof Register

- Update or add portable fixture material under
  `build_tenants/typescript/test_env/fixtures/` so deterministic tests can
  prove design-consumer behavior without relying on a live agent.
- Update scenario harness material under
  `build_tenants/typescript/test_env/sandbox/` only where scenario proof must
  observe the new graph pressure and next-action behavior.
- Update `build_tenants/typescript/test_env/test_surface_map.md` with the
  T-168 proof lane after the deterministic lane exists.
- Update the data_mapper live lane only as a proof consumer:
  - `test_env/live/test_t164_data_mapper_full_capability_live.test.mjs`;
  - `test_env/live/resume_t164_data_mapper_full_capability_live.mjs`;
  - `test_env/live/run_full_external_data_mapper_sandbox.mjs`.
- The live harness must not push the runtime graph forward by assumption. The
  operator/test driver may act as the user only by responding to runtime-selected
  handoffs; the installed runtime must select the next graph function.
- Live or live-equivalent data_mapper proof must show handoff archives for:
  - `derive_test_design_surface`;
  - `derive_component_test_surface`;
  - `prepare_test_execution_surface`;
  - `derive_test_execution_result_surface`;
  - `derive_test_run_archive_surface`;
  - `derive_release_depth_parity_surface`;
  - `prepare_release_surface`.

### 11. Validation Register

- `npm run build:semantic`
- `npm run lint:semantic`
- `npm run test:t168`
- `npm run test:t030`
- `npm run test:t033`
- `npm run test:t089`
- `npm run test:t093`
- `npm run test:t113`
- `npm run test:t115`
- `npm run test:t138`
- `npm run test:t153`
- `npm run test:t158`
- `npm run test:t160`
- `npm run test:t164:edge-contract`
- Live or live-equivalent data_mapper proof through the test lifecycle.

### 12. Split Conditions

Split the ticket before implementation widens if the design proves any of the
following are required:

- shared-method changes in `specification_methodology`;
- ABG traversal/runtime changes outside the installed dependency boundary;
- a separate operational execution subsystem;
- a requirement-level reprice of what counts as SDLC product closure;
- a separate release-cut methodology change.

### 13. Explicit Non-Work

- Do not add a second runtime controller outside ABG traversal/replay truth.
- Do not treat generated test files as proof unless they are admitted through
  the test design/module/execution evidence path.
- Do not classify UATs as unit tests.
- Do not let the harness advance the graph when the runtime did not select the
  next graph function.
- Do not close the ticket from source existence, worker summary text, or prompt
  mentions of test commands.

### 14. Execution Checkpoint - 2026-05-15

Implemented source surfaces:

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md`
  records the T-168 graph-node and graph-function test-pipeline design.
- `build_tenants/typescript/code/src/operator/carriers.ts` defines typed
  design-consumption, testcase, test-data, expected-result, execution-evidence,
  verification-row, and co-affirmation carriers.
- `build_tenants/typescript/code/src/operator/test_pipeline.ts` validates graph
  correlation and constructs the co-affirmation ledger from test cases, data,
  expected results, declared execution evidence, and verification rows.
- `build_tenants/typescript/code/src/graph/catalog.ts` declares the test-data,
  expected-result, framework-execution, verification, and co-affirmation meaning
  on the existing test and release graph edges.
- `build_tenants/typescript/code/src/graph/overlays.ts`,
  `build_tenants/typescript/code/src/operator/installed_operator.ts`, and
  `build_tenants/typescript/code/src/operator/traversal_consequence.ts` prevent
  a full overlay run from treating a non-terminal edge such as
  `derive_component_code_surface` as product convergence.
- `build_tenants/typescript/test_env/tests/test_t168_design_consumer_test_pipeline.test.mjs`
  is the deterministic proof lane.
- `build_tenants/typescript/test_env/test_surface_map.md` and
  `build_tenants/typescript/package.json` publish the proof lane as
  `npm run test:t168`.

Passed validation:

- `npm run build:semantic`
- `npm run lint:semantic`
- `npm run test:t168`
- `npm run test:t030`
- `npm run test:t160`
- `npm run test:t164:edge-contract`
- `npm run test:semantic` (`573` tests, `573` passed)

Residual closure work:

- Run the live or live-equivalent `data_mapper` proof through the test lifecycle
  once the installed runtime is ready to prove handoff archives for the
  test-design, component-test, test-execution, result, archive,
  release-depth-parity, and release edges.
