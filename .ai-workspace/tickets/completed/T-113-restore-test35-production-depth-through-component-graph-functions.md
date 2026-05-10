---
id: T-113
title: Restore test35 production-depth realization through component-forcing graph functions
type: feature
ticket_category: rc_blocker
status: completed
goal: odd-sdlc-typescript-production-depth-parity-with-test35
change_intent: Add odd_sdlc graph functions and postflight law that force concrete component topology, component code materialization, test-class topology, TC allocation, and component-level execution evidence before a TypeScript data-mapper traversal can claim test35-depth parity.
change_class: design_reframe
re_entry_point: design
affected_boundary: odd_sdlc TypeScript graph-function catalog, installed operator handoff prompts, product materialization contract, postflight assurance, data_mapper live qualification lane, component/test topology surfaces
priority: critical
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-10
completed_at: 2026-05-10
build_tenant: typescript
owner: unassigned
review_status: closed_superseded_retired
governance_scope: STDO Method and ODD_SDLC
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
depends_on:
  - T-102 completed typed F_P transform/evaluate carrier split
  - T-110 completed ABG 3.5.0-rc.1 traced callout substrate migration
  - T-109 active traversal-ledger and live data_mapper evidence lane
  - T-112 active complete semantic lifecycle model
related_evidence:
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/EDGE_COMPARISON_test35_vs_test65_vs_test66.md
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/EDGE_COMPARISON_test35_vs_test65_vs_test66_vs_t109_pty_live.md
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/build_tenants/scala_spark/design/40-generated-implementation-modules.md
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/build_tenants/scala_spark/test_env/tests/40-generated-test-modules.md
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_manifests/
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_results/
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_ledgers/
  - /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260503T155635602Z_pid10142
target_truth: odd_sdlc TypeScript restores test35 production-depth pressure by publishing graph functions that make concrete component topology and concrete test topology mandatory traversal products; code and test generation must materialize those declared components and TC allocations, and postflight must reject collapsed one-file-per-module realization unless the collapse is explicitly and lawfully justified.
superseded_truth: closing the full lifecycle graph with compact per-module source files and module-level tests is sufficient to claim test35 parity.
non_abg_bump_reason: ABG 3.5 already supplies traversal, traced callouts, typed process outcomes, retries, archives, transform/evaluate carriers, and postflight substrate; the missing work is odd_sdlc graph-function pressure and domain assurance law.
closure_law: This ticket closes only when odd_sdlc publishes and proves graph functions that force component/file/class topology and test-class/TC topology before code/test/release closure, and a fresh data_mapper live run demonstrates materially deeper generated Scala code than T109 while preserving T109's ABG 3.5 traced-callout observability.
evaluation_criteria:
  - implementation-module closure requires concrete component/file/class topology, not only module ownership.
  - code closure requires every declared component/file group to be materialized or lawfully deferred.
  - test-module closure requires concrete test class and TC allocation.
  - test execution closure maps runnable results back to declared test classes, TC IDs, components, and requirements.
  - collapsed one-file-per-module realization is blocked unless explicitly admitted by a typed deferral carrier.
  - proof uses existing ABG 3.5 substrate; no ABG version bump or runtime carrier expansion is accepted as the primary solution.
proof_surface:
  - design update for component-forcing graph functions
  - graph-function catalog update
  - handoff/prompt pressure update
  - typed carriers or extensions for component topology and TC allocation
  - postflight tests for missing component files, missing public boundaries, missing TC IDs, and collapsed implementation
  - sandbox data_mapper proof
  - fresh live data_mapper PTY proof
non_closure_conditions:
  - Closing by adding prose to implementation_module_surface without graph-function pressure.
  - Closing by making prompts longer while still allowing one source file per module.
  - Closing by comparing line counts only.
  - Closing by treating T109's forensic hot-patched run as pristine proof.
  - Closing by requiring an ABG bump instead of using the ABG 3.5 substrate already available.
  - Closing without a live data_mapper run that reaches code/test/release with component-depth evidence.
---

## Closure Note - 2026-05-06

Closed under STDO for the component-depth graph-function and repair-flow
surface. This is not a release-success claim.

Current proof:

- `npm run test:semantic` passed: 216/216.
- `npm run test:sandbox` passed: 15/15.
- Focused component-depth bundle passed with
  `test_t113_component_depth_register_admission`,
  `test_t115_component_execution_failure_repair_flow`, and the product
  materialization contract tests.
- Live installed proof passed:
  `ODD_SDLC_TS_T115_DATA_MAPPER_LIVE=1 npm run test:t115:data-mapper-repair-live`.
  The archive
  `build_tenants/typescript/test_env/test_runs/t115_live_installed_data_mapper_repair_flow/20260505T210813256Z_pid33268`
  reached failed governed execution, component execution failure attribution,
  and `repair_required` component repair schedule truth.
- The live T-109 PTY workspace reached `derive_release_depth_parity_surface`
  with component-depth evidence and now blocks lawfully on failed test evidence.

Open release work remains in `T-041` and `T-112`.

# T-113: Restore test35 Production-Depth Realization Through Component-Forcing Graph Functions

## STDO Triage

### First Missing Layer

Design.

The TypeScript/ABG line now has the runtime substrate needed to observe and
recover live worker execution. The remaining depth gap is not runtime. It is
odd_sdlc graph-function pressure.

`test35` produced deeper production-shaped Scala code because its SDLC graph
forced component topology and test topology before code and release closure.
The latest T109 PTY live run restored full traversal reach, but it still
allowed compact realization: one source file per module and one test file per
module.

The smallest lawful re-entry point is `design_reframe`: product intent remains
stable, ABG substrate remains stable, but the odd_sdlc realization graph must
gain new mandatory graph functions and postflight laws.

### Boundary

ABG owns:

- graph traversal and iteration
- worker process/callout execution
- PTY/local-spawn executor profiles
- typed process outcomes
- trace archives
- transform/evaluate carrier substrate
- retry and reentry mechanics

odd_sdlc owns:

- SDLC graph-function catalog
- SDLC asset taxonomy
- implementation/test/release domain meaning
- worker handoff pressure
- product materialization contract
- component/test topology closure law
- data_mapper proof interpretation

This ticket must not ask for an ABG bump unless implementation proves that the
existing ABG 3.5 carrier substrate cannot express the needed odd_sdlc domain
facts. Current evidence says it can.

## Problem Statement

The latest PTY live data_mapper run closed the full
`bootstrap_release_self_test` graph, including code, tests, archive,
testcase-authority, and release. That is necessary but not sufficient.

The generated code is not `test35`-depth code.

Observed comparison:

| Run | Source files | Test files | Product shape |
| --- | ---: | ---: | --- |
| `test35` | 105 | 35 | production-shaped component/service decomposition |
| `test65` | 0 | 0 | did not reach product code |
| `test66` | 14 | 0 | partial compiler/adjoint typed source |
| T109 PTY live | 7 | 7 | compact one-source-file-per-module baseline |

The important gap is structural:

- `test35` forced concrete components such as `TopologicalCompiler`,
  `TypeResolver`, `RunManifestManager`, `ArtifactVersionStore`,
  `ResidueCollector`, `FidelityCertificateChain`, and many others.
- T109 forced typed module ownership and requirement traceability, but still
  permitted each module to collapse into one implementation file.
- `test35` forced test-class allocation before test code generation.
- T109 generated one test file per module and 34 live tests. Useful baseline,
  not production-depth parity.

## test35 Discovery Mechanics To Restore

### Component Topology Before Code

`test35` implementation-module output declared concrete owned components,
package structure, module dependencies, and requirement fulfillment boundaries.

Examples:

- `cdme-compiler`: `TopologicalCompiler`, `GrainChecker`, `TypeResolver`,
  `TypeUnifier`, `CastRegistry`, `ImplementationFunctor`,
  `TemporalBindingResolver`, `SheafManager`, `MonoidLawValidator`,
  `AdjointCompositionValidator`, `DryRunExecutor`,
  `AggregationFunctionRegistry`, `EntityRegistry`, plus domain carriers.
- `cdme-executor`: `MorphismExecutor`, `RunManifestManager`,
  `ArtifactVersionStore`, `RunReplayService`, `LookupVersionResolver`,
  `CostEstimator`, `SynthesisEngine`, `BusinessLogicRegistry`,
  `ExternalMorphismRegistry`, `ResidueCollector`, `LateArrivalHandler`, plus
  domain carriers.
- `cdme-fidelity`: covariance contract manager, propagation engine, data
  profiler, quality monitor, rule registry, certificate chain, invariant
  engine, verification service, breach handler, and domain carriers.

### Requirement Fulfillment At Component Boundaries

`test35` mapped requirements to concrete fulfillment boundaries:

- `REQ-PDM-004` -> `LookupVersionResolver.resolve`
- `REQ-TRV-005-A` -> `RunManifestManager` and `ArtifactVersionStore`
- `REQ-INT-008` -> `ResidueCollector.collect`
- `REQ-AI-003` -> `DryRunExecutor`
- `REQ-SHF-001` -> `SheafManager.validateConsistency`

T109 maps requirements to modules and typed carriers. T-113 must restore
component-level fulfillment mapping.

### Test Topology Before Test Code

`test35` test-module output allocated 80 test cases across 33 concrete test
classes. That forced production decomposition because every component had a
corresponding executable pressure surface.

T109's 34 tests are useful but too coarse. T-113 must make concrete test class
and TC allocation a graph-function product before test code generation.

## Required Graph Functions

The exact names may be adjusted during implementation, but the graph must gain
equivalent force. These are not passive commentary surfaces; each is a graph
function edge with typed inputs, typed output, and postflight law.

| Graph function edge | Inputs | Output | Forced work |
| --- | --- | --- | --- |
| `derive_implementation_component_topology_surface` | implementation design, stack profile, requirement surface, scenario surface | component topology surface | concrete components, file paths, class/object names, public boundaries, domain carrier files, requirement-to-component mapping |
| `derive_component_realization_schedule_surface` | component topology, implementation module surface, stack profile | component realization schedule | per-component/file-group tranches and dependency order |
| `derive_component_code_surface` | component topology, component schedule, stack profile | source materialization + code surface | materialize source files per declared component/file group |
| `qualify_component_realization_surface` | component topology, materialized source snapshot, code surface | component realization qualification | prove declared components, boundaries, and requirement markers exist in source |
| `derive_test_component_topology_surface` | test design, component topology, requirement surface | test component topology surface | concrete test classes, TC IDs, component coverage map, requirement coverage map |
| `derive_component_test_surface` | test component topology, component code surface | test source materialization + test module surface | materialize runnable tests per declared test class and TC allocation |
| `qualify_component_test_execution_surface` | test execution result, test topology, source/test snapshot | component test qualification | map execution evidence back to test classes, TC IDs, components, and requirements |
| `derive_release_depth_parity_surface` | release surface, component qualification, test qualification, data_mapper baseline refs | release depth parity surface | explicit parity judgment against test35 production-depth baseline |

## Required Postflight Law

### Component Realization

Closure must fail when:

- a declared component has no materialized source file;
- a declared file group is absent;
- a declared public boundary symbol is absent;
- a declared domain carrier file is absent;
- a requirement-to-component mapping lacks source evidence;
- the materialized code collapses to one file per module when the topology
  declares multiple components, unless an explicit typed deferral carrier
  admits the collapse.

### Test Realization

Closure must fail when:

- a declared test class is absent;
- a declared TC ID is absent from runnable test source;
- a component has no mapped test evidence;
- a requirement has no mapped TC evidence;
- test execution evidence reports aggregate counts but cannot map results back
  to test classes and TC IDs.

### Release Depth

Release closure must fail when:

- full lifecycle closure exists but production-depth parity is unassessed;
- production-depth parity is assessed only by line count;
- component/test topology has lawful gaps that are not carried into release
  interpretation.

## Implementation Notes

Use existing substrate:

- ABG 3.5 traced callouts for worker execution.
- ABG/odd_sdlc transform/evaluate carriers from T-102.
- Existing product materialization snapshots.
- Existing post-transform worker result report generation.
- Existing gap dossier and blocking-reason carriers.
- Existing PTY live lane for data_mapper.

The implementation should add or extend odd_sdlc carriers only where needed for
domain meaning:

- component topology rows
- component realization rows
- public boundary symbol rows
- test class / TC allocation rows
- component/test qualification rows
- release depth parity rows

## Required Implementation Detail: Typed Component-Depth Carriers

The first slice may publish graph functions and prompt pressure, but this
ticket does not close on markdown convention. Test35-depth restoration requires
typed component-depth carriers admitted and compared by the framework.

Required carrier move:

- Add typed component topology rows, not prose-only registers.
- Add typed test component topology rows, not prose-only registers.
- Require machine-readable register blocks in worker transform artifacts.
- Parse those registers in odd_sdlc after F_P.transform.
- Compare parsed register rows to prior surfaces, materialized files, testcase
  allocation, and admitted execution evidence.
- Fold the comparison into `component_depth` assurance and
  `release_depth_parity_surface`.

Minimum carrier shapes:

```ts
interface SdlcComponentTopologyRow {
  componentId: string;
  moduleName: string;
  relativePath: string;
  publicBoundary: string;
  concernRole:
    | "parser"
    | "validator"
    | "mapper"
    | "error_model"
    | "io_adapter"
    | "reporting"
    | "domain_model"
    | "other";
  requirementIds: readonly string[];
  sourceAssetRefs: readonly string[];
}

interface SdlcTestComponentTopologyRow {
  testClassId: string;
  relativePath: string;
  testcaseIds: readonly string[];
  componentIds: readonly string[];
  requirementIds: readonly string[];
  shardId: string | null;
}
```

The worker may include markdown, but postflight reads only the typed register
carrier for closure. A prompt saying "include a register" is not sufficient.

Required parser/admission surface:

- Add a framework parser such as
  `build_tenants/typescript/code/src/operator/component_depth_register.ts`.
- Locate a fenced JSON carrier, for example
  `component_depth_register`.
- Parse and validate required fields.
- Normalize ids and paths.
- Return either an admitted typed carrier or typed blocking reasons.
- Do not use LLM judgement for register admission.

Required postflight comparisons:

- `component_code_surface` must compare declared component ids to realized
  component ids and materialized source paths.
- `component_test_surface` must compare declared test class ids, testcase ids,
  and component ids to realized test files.
- `component_test_qualification_surface` must compare admitted test execution
  evidence to declared test classes, testcase ids, component ids, and
  requirement ids.
- `release_depth_parity_surface` must close only when declared components,
  declared source paths, declared test classes, declared testcase allocation,
  and declared component-test mappings are realized or explicitly blocked.

Typed non-closure reason examples:

- `component_missing_source_file:<componentId>`
- `component_declared_path_not_materialized:<relativePath>`
- `component_collapsed_into_unowned_file:<componentId>`
- `component_requirement_allocation_missing:<componentId>`
- `test_class_missing_file:<testClassId>`
- `testcase_allocation_missing:<testcaseId>`
- `test_class_component_mapping_missing:<testClassId>`
- `execution_test_class_unproven:<testClassId>`
- `execution_testcase_unproven:<testcaseId>`
- `execution_component_coverage_unproven:<componentId>`

Legacy surface repricing:

- `code_surface` must become a rollup over `component_code_surface`, or a
  compatibility summary that cannot close without
  `component_realization_qualification_surface`.
- `test_module_surface` must not remain the sole test materialization
  authority once `component_test_surface` exists.
- `test_run_archive_surface` must not be sufficient release authority without
  `component_test_qualification_surface` and
  `release_depth_parity_surface`.

Closure guard:

This ticket is not closed by marker checks, prompt text, or a passing command.
It closes only when typed carrier parsing and set comparison enforce the same
work test35 forced: component topology before code, test topology before tests,
TC allocation through execution, and release parity over realized production
shape.

These are odd_sdlc domain payloads over ABG truth, not a new runtime substrate.

## Acceptance Criteria

- AC-1: The graph-function catalog includes component topology, component
  schedule, component code, component realization qualification, test component
  topology, component test realization, component test qualification, and
  release depth parity edges or their accepted equivalent.
- AC-2: `derive_implementation_module_surface` or its successor no longer
  explicitly defers concrete file/class/component shape without a downstream
  graph function that forces it before code closure.
- AC-3: `derive_code_surface` cannot close with collapsed one-source-file-per-
  module output when component topology declares multiple components.
- AC-4: source postflight proves declared components and public boundaries are
  present in materialized source.
- AC-5: `derive_test_module_surface` or its successor allocates concrete test
  classes and TC IDs before test source generation.
- AC-6: test postflight proves declared test classes and TC IDs are present in
  runnable test source.
- AC-7: test execution evidence maps back to declared test classes, TC IDs,
  components, and requirements.
- AC-8: release qualification consumes component/test qualification evidence
  and produces a depth parity judgment.
- AC-9: deterministic tests cover missing component file, missing boundary
  symbol, missing TC ID, aggregate-only test evidence, and collapsed module
  realization.
- AC-10: a fresh live data_mapper PTY run reaches code/test/release and
  produces deeper component-shaped code than T109 without manual hot-patching.

## Proof Commands

Initial expected proof lanes:

```text
npm run build:semantic
node --test test_env/tests/test_t113_component_depth_graph_functions.test.mjs
ODD_SDLC_TS_T113_DATA_MAPPER_LIVE=1 npm run test:t113:data-mapper-live
```

The exact live test name may be introduced by this ticket. The live proof must
use a fresh installed workspace and the `pty-terminal` executor profile.

## Non-Goals

- Do not copy Python `test35` file-for-file.
- Do not use `test35` as architecture authority.
- Do not weaken T109's typed traceability and PTY observability.
- Do not add tenant-specific Scala rules to generic odd_sdlc core unless they
  are behind tenant-owned validation policy.
- Do not require an ABG bump unless the existing ABG 3.5 substrate is proven
  insufficient.

## Closure Review Questions

- Did the graph functions force component work, or did the worker merely choose
  to write more files?
- Can postflight reject one-file-per-module collapse deterministically?
- Can postflight name the missing component, boundary, test class, or TC ID?
- Does live evidence show component-depth code materially closer to `test35`
  than T109?
- Does release qualification carry any remaining depth gap as lawful pressure
  instead of hiding it behind full graph traversal success?

## Codex RC Completeness Review - 2026-05-07

Status: reopened to active for RC completeness review.

Observations:

- Focused proof refreshed on 2026-05-07: component-depth admission and repair
  flow tests passed (`test_t113_component_depth_register_admission.test.mjs`
  plus `test_t115_component_execution_failure_repair_flow.test.mjs`).
- The code has real T-113 traceability in `component_depth_register.ts`,
  `component_depth.ts`, and focused tests.
- The closure note narrows the claim to component-depth graph-function and
  repair-flow surfaces, but the ticket closure law requires a fresh data-mapper
  live run that demonstrates materially deeper generated Scala code than T109.
  The cited T115 repair-flow proof reaches governed failed execution and repair
  scheduling; it does not prove successful production-depth parity.
- The ticket's own proof commands expect a T113 live PTY lane. Closure evidence
  cites a T115 live lane instead.
- Re-close needs a current check that generic `odd_sdlc` core is not embedding
  tenant-specific Scala/CDME rules outside tenant-owned validation policy.

Checklist before re-closing:

- [ ] Either narrow the ticket target truth/closure law to the proven component
      depth slice or supply the missing fresh T113 live PTY production-depth
      proof.
- [ ] Add or cite evidence that generated code/test topology is materially
      deeper than the T109 baseline.
- [ ] Verify component-depth enforcement remains product-domain policy over ABG
      runtime truth, not a hidden local traversal controller.
- [ ] Re-run focused component-depth tests and the live lane selected for
      closure.

## Supersession Closure Note - 2026-05-10

Closed as superseded/retired, not as restored test35 production-depth parity.

T-113 attempted to use a single RC-blocker ticket to restore test35 production
depth, component topology, test topology, data_mapper live parity, release-depth
qualification, and anti-collapse assurance. That scope no longer provides useful
guidance for the current TypeScript line. It also keeps stale ABG 3.5 and T-041
/ T-112 dependencies active after the line has moved to ABG 3.7.1 evaluator
truth and narrower live proof lanes.

The useful part of T-113 is retained as future pressure: component/test
topology, requirement-to-component binding, and execution evidence mapping are
real capabilities. They should not be tracked here as a broad data_mapper parity
umbrella.

Closure disposition:

- closed reason: superseded by current evaluator/consequence-chain and focused
  live-lane tickets;
- not claimed: test35 production-depth parity;
- not claimed: successful data_mapper live production-depth run;
- not claimed: release-depth closure;
- carried forward: if component/test topology depth becomes the next active
  work, open a narrow current-line ticket that names the exact graph function,
  obligation carrier, assurance fold, and live proof lane without coupling it
  to a stale all-of-test35 parity claim.
