# ODD SDLC TypeScript Design-Consumer Test Pipeline

**Status**: Active design input for T-171 lifecycle parity
**Date**: 2026-05-15
**Owner Ticket**:
`.ai-workspace/tickets/active/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md`
**Superseded Ticket**:
`.ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md`
**Superseding Strategy**:
`.ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md`
**Decommission Register**:
`ODD_SDLC_TYPESCRIPT_DECOMMISSION_REGISTER.md`
**Implements**: REQ-F-ODDSDLC-010, REQ-F-ODDSDLC-011,
REQ-F-ODDSDLC-013, REQ-F-ODDSDLC-014, REQ-F-ODDSDLC-015,
REQ-F-ODDSDLC-020, REQ-F-ODDSDLC-021, REQ-F-ODDSDLC-040,
REQ-F-ODDSDLC-043, REQ-F-ODDSDLC-063, REQ-F-ODDSDLC-064,
REQ-F-ODDSDLC-065, REQ-F-ODDSDLC-066
**Derives From**: `specification/PRODUCT.md`,
`specification/requirements/10-odd-sdlc-software-domain-buildout.md`,
`specification/requirements/13-odd-sdlc-typescript-tenant.md`,
`specification/requirements/16-edge-gain-closure-contract.md`,
`ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md`,
`ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`,
`ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md`,
`ODD_SDLC_TYPESCRIPT_SCHEDULING_PHASE.md`

T-171 repairs this design where test-pipeline conformance could become a
substitute for execution-backed co-affirmation and F_P/content judgment.

## STDO Re-Triage

T-168 is a design reframe before it is a runtime refactor.

The failing behavior is not that the TypeScript tenant lacks any test-related
files. The failing behavior is that implementation-code closure can appear as
terminal product convergence while test design, test materialization, test data,
test execution, result verification, archive, and release qualification remain
unrun or unadmitted.

The missing layer is the declared graph law that makes implementation and tests
sibling consumers of the same admitted design authority:

```text
design authority
  -> implementation construction
  -> implementation evidence

design authority
  -> test-case and test-data construction
  -> test execution
  -> result verification
  -> test evidence

implementation evidence + test evidence + execution evidence
  -> co-affirmed design interpretation or typed residual pressure
```

This belongs in the TypeScript tenant because `odd_sdlc` owns software-domain
asset meaning, edge meaning, evidence admission, and closure interpretation.
ABG owns traversal substrate truth, graph-call frames, continuations, events,
runtime replay, and raw runtime projection.

## Design Claim

Test construction and test execution are graph-owned product behavior. They are
not incidental files emitted by the implementation worker, not prompt-only
instructions, and not harness-only assertions.

Every test-pipeline phase must resolve to one of these forms:

- a published graph node / typed asset surface;
- a named graph-function edge that produces or consumes that node;
- a typed row on an admitted node with stable refs consumed by a downstream
  graph-function edge.

If a phase cannot be represented that way, the implementation must add the node
or row type before claiming closure.

## Graph Node And Edge Correlation

The current graph already publishes the spine needed for a first complete
test-pipeline pass:

| Phase | Node / Asset Surface | Producer Edge |
| --- | --- | --- |
| design obligations | `requirement_surface`, `design_surface`, `scenario_surface`, `implementation_design_surface` | existing upstream authority edges |
| test plan, UAT testcase rows, testcase authority rows, module/allocation rows, topology rows, data bindings, expected-result bindings, and execution schedule rows | `test_design_surface` | `derive_test_design_surface` |
| component test source | `component_test_surface` | `derive_component_test_surface` |
| declared framework / command execution | `test_execution_surface` | `prepare_test_execution_surface` |
| observed test result | `test_execution_result_surface` | `derive_test_execution_result_surface` |
| verification rows | `component_test_qualification_surface` | `qualify_component_test_execution_surface` |
| repair pressure | `component_repair_schedule_surface` | `derive_component_repair_schedule_surface` |
| archived test proof | `test_run_archive_surface` | `derive_test_run_archive_surface` |
| release co-qualification | `release_depth_parity_surface` | `derive_release_depth_parity_surface` |
| release readiness | `release_surface` | `prepare_release_surface` |

The current graph does not yet make test cases, test data, expected results, or
co-affirmation independently visible enough for T-168 closure. The first
implementation may represent them as typed rows on existing nodes instead of
new graph nodes, but the refs must be stable and must be consumed by downstream
edges.

## Irreducible Carrier Set

| Carrier | Owns | Does Not Own |
| --- | --- | --- |
| `SdlcDesignConsumptionContract` | Source design obligation refs, authority basis refs, digest refs, and the graph edges that must consume them. | Prompt wording or worker memory. |
| `SdlcImplementationDesignBinding` | Binding between implementation outputs and consumed design obligations. | Test proof or release proof. |
| `SdlcTestDesignBinding` | Binding between test design/module/test source and consumed design obligations. | Implementation closure. |
| `SdlcTestCaseRow` | One generated or admitted test case, its source obligation refs, case kind, expected behavior, and downstream execution refs. | Raw framework result rows without design lineage. |
| `SdlcTestDataBinding` | Test input data or fixture refs, generation policy, testcase refs, and expected-result refs. | Arbitrary fixture files that are not admitted by graph edges. |
| `SdlcExpectedResultBinding` | Expected result/assertion refs, source testcase refs, and verification policy refs. | Observed runtime result truth. |
| `SdlcUatCaseToIntegrationTestBinding` | UAT testcase refs mapped to integration test cases and execution lanes. | Unit-test classification. |
| `SdlcTestExecutionEvidenceAdmission` | Declared framework/command contract, observed execution result, report refs, and admission diagnostics. | Product convergence by itself. |
| `SdlcTestResultVerificationRow` | Expected-vs-observed result comparison, pass/fail status, failure refs, and obligation refs. | Raw execution command status. |
| `SdlcCoAffirmationLedger` | Join rows connecting design obligations, implementation evidence, test evidence, execution evidence, and verification rows. | ABG traversal advancement. |

These carriers may serialize into existing asset surfaces for the first T-168
implementation. If the implementation keeps them as rows, the parent surfaces
must name the row refs:

- `test_design_surface` carries `SdlcDesignConsumptionContract`,
  `SdlcTestDesignBinding`, `SdlcTestCaseRow`, `SdlcTestDataBinding`,
  `SdlcExpectedResultBinding`, `SdlcUatCaseToIntegrationTestBinding`, and
  test execution schedule refs.
- `test_execution_result_surface` may carry
  `SdlcTestExecutionEvidenceAdmission` refs.
- `component_test_qualification_surface` may carry
  `SdlcTestResultVerificationRow` refs.
- `release_depth_parity_surface` or `release_surface` may carry
  `SdlcCoAffirmationLedger` refs.

If a later slice needs independent graph vectors for test data, expected
results, or co-affirmation, that is a graph-publication change and must update
the graph catalog, edge assurance matrix, overlay catalog, and tests together.

## Structural Flow

The full-breadth traversal must preserve this order unless a future ticket
reprices the graph:

```text
derive_design_surface
derive_scenario_surface
derive_implementation_design_surface
derive_component_code_surface
qualify_component_realization_surface
derive_code_surface
derive_test_design_surface
derive_component_test_surface
prepare_test_execution_surface
derive_test_execution_result_surface
qualify_component_test_execution_surface
derive_component_repair_schedule_surface
derive_test_run_archive_surface
derive_release_depth_parity_surface
prepare_release_surface
```

`derive_component_code_surface` and `derive_code_surface` are not terminal
product closure points. They produce implementation evidence for later
co-affirmation. If any downstream test/release node is required by the active
overlay or edge contract, their closure decision must carry residual pressure or
next-action truth rather than causing `product_converged`.

`derive_code_surface` is a compatibility rollup over admitted
`component_code_surface` and `component_realization_qualification_surface`
evidence. The rollup may summarize or package those facts for downstream
consumers, but it must not synthesize new implementation truth, bypass the
component realization qualification, or substitute for later generated-test,
execution-result, archive, parity, or release evidence.

## Test Case Execution Contract

Test execution means the whole graph-owned chain:

```text
design obligation
-> testcase row
-> test data binding
-> expected result binding
-> component test source
-> test execution command
-> observed execution result
-> verification row
-> co-affirmation ledger row
```

The declared command or framework is part of the graph state:

- `prepare_test_execution_surface` declares the framework/command execution
  contract from the admitted test schedule and worksite capability contract.
- `derive_test_execution_result_surface` admits returned execution evidence
  under that command contract.
- `qualify_component_test_execution_surface` verifies observed results against
  expected results and materialized tests.
- `derive_test_run_archive_surface` archives the admitted execution and
  verification truth.

For Scala/SBT workspaces, `sbt test` is closure evidence only when the installed
worksite declares that test execution contract. A prompt mention of `sbt test`
or a harness-side assertion that files exist is not execution evidence.

## Case Range Law

A test design must declare the case range expected for each design obligation.
The minimum range vocabulary is:

- `positive`;
- `negative`;
- `boundary`;
- `integration`;
- `uat`;
- `regression`.

The range is obligation-scoped. A single happy-path test cannot close an
obligation whose design calls for boundary, negative, integration, UAT, or
regression behavior.

Closure blocks when:

- no testcase row exists for a required obligation;
- testcase rows lack test data or expected results;
- test data exists without stable refs consumed by execution or verification;
- expected results exist only in prose;
- framework execution is bypassed by the harness;
- zero tests are observed;
- observed results are not compared to expected results;
- co-affirmation rows are absent for executable obligations.

## Co-Affirmation Closure

Product closure requires agreement across three evidence families:

```text
implementation evidence
+ test construction evidence
+ execution/verification evidence
-> co-affirmation ledger
-> release readiness
```

The co-affirmation ledger is not a second runtime. It is a product-owned
semantic ledger read by edge gain/closure functions. It records whether the
implementation, tests, and observed execution interpret the same design
obligation consistently.

If implementation and tests disagree, the result is typed pressure:

- `retry` when the same edge can repair local evidence;
- `repair` when component source or test source must be changed;
- `re-enter` when an earlier design/testcase/schedule node must be regenerated;
- `reprice` when requirements or product law are inconsistent;
- `block` when required authority or execution capability is missing.

## Overlay And Next-Action Law

The full traversal overlay must not treat a terminal component-code asset as
`product_converged` when any required test/release pressure remains.

The lite implementation overlay may stop with `overlay_segment_complete`, but
it must publish next-eligible pressure into the full traversal when the product
still requires test design, test execution, archive, parity, or release
qualification.

The runtime next action must come from replay-visible graph/overlay/closure
truth. The harness may act as the operator by answering a selected handoff; it
may not push the graph to a downstream edge that the installed runtime did not
select.

## Proof Obligations

The deterministic T-168 lane must prove:

- component-code closure leaves downstream test/release pressure active;
- test data and expected-result bindings are typed graph assets or typed rows
  with stable refs;
- UAT testcases map to integration tests, not unit tests;
- declared framework execution is required before execution evidence admits;
- observed results are verified against expected results;
- co-affirmation rows link design, implementation, test, and execution evidence;
- `product_converged` cannot appear before required test/release edges close.

The live or live-equivalent data_mapper proof must show the installed runtime
selecting the test lifecycle edges after code materialization. It is not enough
for the harness to create files or continue the graph outside runtime-selected
truth.
