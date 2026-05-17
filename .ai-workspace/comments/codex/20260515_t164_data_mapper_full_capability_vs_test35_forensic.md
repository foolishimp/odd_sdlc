# T-164 Data Mapper Full-Capability Run vs test35

Date: 2026-05-15  
Author: Codex  
Status: commentary / forensic analysis  
Latest run archive:
`build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260514T105715480Z_pid16615`  
Reference report:
`.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md`  
Gold standard workspace:
`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`

## Claim

The 2026-05-14 T-164 data_mapper run is the strongest TypeScript data_mapper
run so far. It proves the T-164 edge-assurance carrier under real data_mapper
scale: ledgers, closure decisions, repair/retry/yield dispositions, liveness
observation, and a full-breadth seven-module component-code pass all appear in
one preserved archive.

It still does not reach test35 completeness.

The reason is narrower and sharper than the 2026-05-12 steel-thread finding:
this latest run is no longer only a compiler-component scaffold. It generates
all seven product modules and closes 436 component-code obligations. But it
still closes `derive_component_code_surface` with `executionEvidenceStatus:
null`, no admitted `sbt compile` / `sbt test` result, only 7 pending test
files, and 79 `???` implementation stubs across 66 Scala source files.

So the current differential is:

```text
T-164 latest proof:
  full-breadth component-code materialization
  + 436 / 436 obligation rows fulfilled
  + ledger-backed close
  + product_converged projection
  - no admitted execution evidence
  - pending tests
  - implementation stubs
  - no downstream test / release lifecycle traversal

test35 proof:
  declared requirement-surface obligations
  + behavioral code realization
  + realized test source
  + executed ScalaTest evidence
  + admitted ledger closure
  + 181 passing test methods
```

## Archive Facts

The original T-164 harness summary declared 28 required edges:

```text
Fg_conform_project_authority
derive_feature_decomp_surface
derive_design_surface
derive_scenario_surface
derive_implementation_design_surface
select_implementation_stack_profile
derive_implementation_module_surface
derive_aggregate_domain_model_surface
derive_implementation_component_topology_surface
derive_aggregate_sunny_day_sequence_surface
derive_component_realization_schedule_surface
derive_component_code_surface
qualify_component_realization_surface
derive_code_surface
derive_test_design_surface
select_test_stack_profile
derive_test_module_surface
derive_test_component_topology_surface
derive_component_test_surface
derive_test_schedule_surface
prepare_test_execution_surface
derive_test_execution_result_surface
qualify_component_test_execution_surface
derive_component_repair_schedule_surface
derive_test_run_archive_surface
qualify_testcase_authority
derive_release_depth_parity_surface
prepare_release_surface
```

The resumed run that finally converged records 12 completed edge names and
stops at `derive_component_code_surface`:

```text
Fg_conform_project_authority
derive_feature_decomp_surface
derive_design_surface
derive_scenario_surface
derive_implementation_design_surface
select_implementation_stack_profile
derive_implementation_module_surface
derive_aggregate_domain_model_surface
derive_implementation_component_topology_surface
derive_aggregate_sunny_day_sequence_surface
derive_component_realization_schedule_surface
derive_component_code_surface
```

The final resume summary says:

```json
{
  "startStatus": "converged",
  "currentEdge": null,
  "blockingReason": null,
  "commandTimeoutMs": 43200000,
  "workerTimeoutMs": 43200000,
  "workerInactivityTimeoutMs": 1800000
}
```

The archive contains 44 operator-run directories. Of those, 36 contain edge
fulfillment ledgers / closure decisions. Closure decisions across those 36
attempts are:

```text
12 close
12 repair
 3 retry
 9 yield
```

The fulfillment ledgers show:

```text
36 ledgers total
12 edgeConverged true
20 ledgers with blocked obligations
```

That is useful evidence. The run did not only take a happy path. It repeatedly
hit typed residual pressure and pushed through it.

## Why The Run Stopped

It stopped because the installed operator projected no next action after
`derive_component_code_surface` closed. It did not stop because the terminal
was dead, because the command timed out, or because a test edge failed.

The final `sdlc_overlay_segment_completion.json` says:

```json
{
  "stopDisposition": "product_converged",
  "remainingGraphPressureRefs": [],
  "remainingRequirementPressureRefs": [],
  "remainingAssetPressureRefs": [],
  "nextEligibleOverlayRefs": [],
  "productConverged": true
}
```

The final `sdlc_next_action_projection.json` then says:

```json
{
  "overlayStopDisposition": "product_converged",
  "selectedActionRef": null,
  "nextGraphFunctionRef": null,
  "nextGraphVectorRef": null,
  "choosesNextTraversal": false,
  "policyRefs": ["policy://odd-sdlc/evaluate-next/post-action/no-action"]
}
```

The immediate implementation mechanism is in
`build_tenants/typescript/code/src/operator/installed_operator.ts`. When an
edge closes and `input.nextVectorIndex === null`, the operator checks the
active overlay. If that overlay allows `product_converged` and has no
`nextEligibleOverlayRefs`, it constructs an overlay segment completion with all
remaining graph, requirement, and asset pressure refs cleared. If the
post-action candidate list is empty, it constructs a no-action next-action
projection.

That is what happened here.

The sharper issue is that the T-164 resume helper did not enforce the original
full-edge list. The full live test contains assertions that all required
test/release lifecycle edges were observed. The resume helper only ran:

```text
odd-sdlc-ts start --workspace . --target next --until converged --worker ...
```

and then wrote the observed edge names into `latest_resume_summary.json`. It
did not assert that the 28 required edges or the test lifecycle edges had all
run. Therefore the final resume could record `converged` while the lifecycle
proof was still missing.

The root cause is therefore two-layered:

1. Runtime layer: the component-code close was allowed to collapse the active
   overlay into `product_converged` with no remaining pressure.
2. Harness layer: the resume helper accepted the installed product's
   `converged` status instead of failing on the missing downstream edge set.

The full-edge requirement existed in the original harness summary. It did not
survive as active runtime pressure after the component-code edge closed.

## Final Edge Evidence

The final operator run is:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260514T172727291Z_pid11061
```

Its public summary is:

```json
{
  "graphFunctionName": "derive_component_code_surface",
  "currentEdge": null,
  "status": "converged",
  "blockingReason": null,
  "nextLawfulAction": "disposition://close"
}
```

Its final `fp_evaluate_result.json` says:

```json
{
  "status": "passed",
  "postflightStatus": "passed",
  "executionEvidenceStatus": null,
  "obligationAssessmentCounts": {
    "total": 436,
    "fulfilled": 436,
    "partial": 0,
    "blocked": 0,
    "unassessed": 0
  },
  "blockingReasons": []
}
```

Its final `sdlc_edge_fulfillment_ledger.json` says:

```json
{
  "counts": {
    "expected": 436,
    "fulfilled": 436,
    "partial": 0,
    "blocked": 0,
    "unfulfilled": 0,
    "missing": 0,
    "extra": 0
  },
  "carryConverged": true,
  "fulfillmentConverged": true,
  "admitted": true,
  "targetCertificationPassed": true,
  "fdRecheckPassed": true,
  "edgeConverged": true
}
```

Its `sdlc_next_action_projection.json` projects:

```json
{
  "nextActionBasisKind": "post_close_graph_continuation",
  "overlayStopDisposition": "product_converged",
  "remainingGraphPressureRefs": [],
  "remainingRequirementPressureRefs": [],
  "remainingAssetPressureRefs": [],
  "selectedActionRef": null,
  "nextGraphFunctionRef": null,
  "choosesNextTraversal": false
}
```

That is the TypeScript platform closure claim. The claim is internally
consistent for the current carrier predicate: materialization refs exist,
obligations are marked fulfilled, postflight passes, and the edge closes.

The test35 question is whether that predicate is strong enough. It is not.

## Product Artifact Footprint

Latest T-164 generated footprint under the preserved workspace:

```text
build_tenants/scala_spark files: 124
main Scala files: 102
test Scala files: 7
modules with product source:
  cdme-accounting
  cdme-adjoint
  cdme-assurance
  cdme-compiler
  cdme-engine
  cdme-executor
  cdme-fidelity
```

That is a large improvement over the 2026-05-12 steel-thread archive, which
was effectively a bounded compiler-component pass.

The evidence remains incomplete against test35:

```text
Scala files containing ???: 66
??? occurrences: 79
test files containing pending: 7
pending occurrences: 27
admitted execution evidence: none
admitted test-run archive: none
```

Representative emitted implementation:

```scala
def compile(topologyJson: String): CompileResult = ???
```

Representative emitted test:

```scala
"TopologicalCompiler" should "compile a valid topology" in {
  pending
}
```

The final worker invocation package also records:

```json
{
  "featureScope": {
    "mode": "full_breadth",
    "includedModuleNames": [
      "cdme-compiler",
      "cdme-assurance",
      "cdme-executor",
      "cdme-adjoint",
      "cdme-accounting",
      "cdme-fidelity",
      "cdme-engine"
    ],
    "deferredModuleNames": []
  },
  "outputContract": {
    "declaredProductFileTargets": [],
    "requiredRoles": ["source"],
    "buildExecutionContract": "sbt compile",
    "testExecutionContract": "sbt test"
  },
  "productMaterializationAuthority": {
    "status": "missing",
    "reasonRefs": ["declared_product_file_targets_missing"]
  }
}
```

This matters. The run names executable contracts, but the closure predicate does
not require their execution evidence. It also still has no declared product
file target inventory.

## Assurance/Test Pipeline Evidence Gap

The archive confirms that the assurance/test pipeline did not produce
first-class traversal evidence.

Every downstream test/release edge has zero observed handoff archives:

```text
derive_test_design_surface 0
select_test_stack_profile 0
derive_test_module_surface 0
derive_test_component_topology_surface 0
derive_component_test_surface 0
derive_test_schedule_surface 0
prepare_test_execution_surface 0
derive_test_execution_result_surface 0
qualify_component_test_execution_surface 0
derive_test_run_archive_surface 0
qualify_testcase_authority 0
derive_release_depth_parity_surface 0
prepare_release_surface 0
```

The final component-code ledger also carries no downstream continuation
pressure:

```json
{
  "downstreamPressureRefs": [],
  "downstreamTargetBindingRefs": [],
  "downstreamTransformationSetRefs": []
}
```

This is exactly the design mismatch: the upstream design and implementation
assets were used as context for the component-code materialization path, but
they were not preserved as active transformation assets for both the code path
and the test-case / test-implementation paths.

The system produced seven pending test files during component-code
materialization, but those are incidental source artifacts, not evidence that
`derive_test_design_surface`, `derive_test_module_surface`,
`derive_component_test_surface`, or `derive_test_execution_result_surface`
ran. There is no test-run archive and no admitted assurance/test execution
evidence.

## test35 Reference Completeness

test35 remains the gold standard because it contains both realization breadth
and execution proof.

Current measured test35 footprint:

```text
main Scala files: 105
test Scala files: 35
modules with product source:
  cdme-accounting
  cdme-adjoint
  cdme-assurance
  cdme-compiler
  cdme-engine
  cdme-executor
  cdme-fidelity
```

Representative fulfillment ledger:

```json
{
  "edge": "derive_code_surface",
  "target_asset": "code_surface",
  "expected_count": 77,
  "fulfilled_count": 77,
  "missing_count": 0,
  "extra_count": 0,
  "carry_converged": true,
  "fulfillment_converged": true,
  "admitted": true,
  "edge_converged": true,
  "obligation_source_kind": "requirement_surface",
  "fulfillment_rule": "behavioral_code_realization",
  "evidence_policy": "behavioral_code_evidence",
  "certification_scope": "edge"
}
```

Representative execution archive:

```text
Execution state: passed - sbt test completed 2026-04-19
Requirements covered by planned allocation: 77 / 77
Requirements with realized test source: 77 / 77
Requirements with execution evidence: 77 / 77
ScalaTest test methods executed: 181
ScalaTest test methods passed: 181
ScalaTest test methods failed: 0
Suites run: 33
```

test35 therefore proves three distinct things that the latest T-164 archive
does not yet prove:

1. behavioral implementation exists for the requirement surface
2. tests exist as realized test source, not pending placeholders
3. the declared test contract was executed and admitted as closure evidence

## Differential Table

| Capability | test35 gold standard | Latest T-164 archive | Verdict |
| --- | --- | --- | --- |
| Data-mapper breadth | Seven source modules, 105 main Scala files, 35 test Scala files | Seven source modules, 102 main Scala files, 7 test Scala files | Much closer on source breadth; still weak on tests |
| Requirement basis | 77 requirements from `requirement_surface` with behavioral code evidence policy | 436 component-code obligations with file/materialization/lineage admission | Stronger scale, different predicate |
| Ledger carrier | Fulfillment ledger computes convergence from carry, fulfillment, and admission | `SdlcEdgeFulfillmentLedger` computes equivalent carrier fields | Carrier parity is close |
| Closure decision | Code edge closes with behavioral evidence and later execution archive | Component-code edge closes with `executionEvidenceStatus: null` | Predicate still too weak |
| Runtime non-close behavior | Python model treats yielded as active and has continuation/failure machinery | Archive contains repair/retry/yield closure decisions across attempts | Useful progress, but not the same failure-continuation proof |
| Product code | Real behavior, no broad stub surface | 79 `???` stubs across 66 Scala files | Not behaviorally complete |
| Test source | 35 test files, 33 suites in execution archive, 181 methods passed | 7 test files, all pending skeletons | Not test-complete |
| Assurance/test pipeline | Design and code surfaces feed realized test modules and execution archive | Downstream test/release edges have zero handoff archives | Pipeline did not run |
| Execution proof | `sbt test` completed and admitted | No admitted compile/test execution result | Missing |
| Full lifecycle traversal | Includes test-run archive evidence | Resumed run stops at `derive_component_code_surface`; 16 originally listed downstream edges are not exercised | Missing |
| Product convergence projection | Backed by code/test execution evidence | `product_converged` after component-code close | Overclaims against test35 standard |

## What Improved Since The Earlier Report

The earlier report and the 2026-05-12 follow-up said the TypeScript path was
mostly a scoped materialization-lineage proof. That is no longer a complete
description.

This run proves several important upgrades:

- the lane can run against a real data_mapper worksite at hundreds of
  obligations, not only 15 hello-world obligations or 55 compiler-component
  obligations
- `full_breadth` scope includes all seven product modules with no deferred
  modules
- edge assurance ledgers and closure decisions are written repeatedly, not as a
  one-off happy path
- repair, retry, and yield dispositions are present in the preserved archive
- the final component-code edge reaches a clean zero-blocking ledger state

That is platform progress. It means the remaining gap is not "no ledger" or
"no data_mapper-scale traversal." The remaining gap is the closure predicate
and traversal breadth needed to match test35.

## Current False Equivalence

The false equivalence is now:

```text
full-breadth component-code source files exist
+ all component-code obligation rows are marked fulfilled
+ target certification and F_D recheck pass
-> product_converged
```

That is not equivalent to:

```text
full requirement surface is behaviorally realized
+ full test surface is realized
+ declared compile/test contracts are executed
+ execution evidence is admitted
+ no lifecycle pressure remains
-> product_converged
```

The old bug was allowing a narrow component scaffold to close as if it were a
product. The latest run improves the width of the scaffold dramatically, but it
still allows a scaffolded implementation to close as product convergence.

## Closure Assessment

T-164 can be closed as an edge-assurance and full-breadth stress proof if the
ticket acceptance target is:

```text
prove declared per-edge gain / closure carriers over a data_mapper-scale
implementation traversal, including live repair/retry/yield pressure and final
ledger-backed convergence
```

T-164 cannot be used as evidence that TypeScript has reached test35
completeness. For that claim, the archive is missing:

- admitted `sbt compile` evidence
- admitted `sbt test` evidence
- a test-run archive equivalent to test35
- non-pending test implementations
- rejection of `???` implementation stubs on executable-code closure
- downstream traversal through test design, test module, test execution,
  qualification, repair archive, release depth parity, and release preparation
- a closure predicate that treats execution evidence as mandatory when a code
  edge declares build/test contracts

## Next Parity Gate

The next test35-parity proof should not rebuild the same sandbox just to
repeat component-code materialization. The preserved T-164 archive is already a
valuable corpus.

The next gate should require:

1. `derive_component_code_surface` must not close executable code with
   `executionEvidenceStatus: null` when `buildExecutionContract` or
   `testExecutionContract` is declared.
2. Stub and pending-test evidence must become blocking or yielding pressure for
   executable product closure, unless the declared target is explicitly a
   scaffold target.
3. `product_converged` must be reserved for no remaining graph, requirement,
   asset, test, execution, and release pressure.
4. The data_mapper lane must continue beyond component code through the
   originally declared test and release edges, or explicitly reprice the proof
   as component-code-only.
5. The final proof must include a test35-style archive: planned requirements,
   realized test source, executed test evidence, and admitted pass/fail counts.
6. The harness/resume path must fail if the installed runtime returns
   `converged` before the required downstream edge set has been observed.
7. Design, module, stack, topology, and schedule assets must remain active
   transformation assets for both code and test construction, not only prompt
   context for component-code materialization.

Until that happens, the correct reading is:

```text
Latest T-164: platform/edge-assurance proof passed.
test35 completeness: not yet passed.
```
