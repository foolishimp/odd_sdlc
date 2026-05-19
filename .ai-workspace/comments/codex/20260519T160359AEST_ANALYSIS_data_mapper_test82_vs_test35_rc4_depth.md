# Data Mapper Test82 vs Test35 RC4 Depth Analysis

**Date**: 2026-05-19  
**Author**: Codex  
**Status**: commentary / forensic comparison, not ratified specification  
**Workspace under review**: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl`  
**Reference workspace**: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`

## Sources

- Prior comparison basis:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/EDGE_COMPARISON_test35_vs_test65_vs_test66_vs_t109_pty_live.md`
- Accepted T-171 / RC4 proof summary:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/release-cuts/typescript/20260519T051709Z_t171_data_mapper_test82_rc4/t171-data-mapper-test82-rc4-proof-summary.json`
- Accepted `test82` terminal archive:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T045221059Z_pid80159`
- Accepted `test82` execution-result archive:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T042607954Z_pid80159`
- `test82` read-only analyzer:
  `odd-sdlc-ts analyze-run --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl --format markdown`

## Claim

`data_mapper.test82.TS.cl` is the first TypeScript/ABG data-mapper run in this line that should be treated as a real successor to the old `test35` lifecycle proof.

It closes the decisive runtime gap that the prior comparison found in earlier TS runs: it reaches the full graph tail, admits governed execution evidence before release closure, carries typed F_P stage authority, and records closure through the installed operator's ledgers rather than worker assertion or postflight shape alone.

It does not close the code-depth gap with `test35`. `test35` remains the deeper production-shaped Scala implementation. `test82` is stronger than the older TS/T109 run in runtime law and closure authority, but its generated code is still much more compact: seven modules are present, but most modules are represented by one or two source files rather than the many component/service files present in `test35`.

## Run-Level Comparison

| Surface | `test35` reference | `test82.TS.cl` RC4 |
|---|---:|---:|
| Runtime family | Python `fp_*` manifests/results/ledgers | TypeScript installed-operator archives |
| Main proof shape | broad Python lifecycle with later `sbt test` archive | typed ABG/TS operator run with closure decision, fulfillment ledger, F_P stage carriers |
| Operator/archive count | many `fp_*` files across repeated edge attempts | 36 operator-run rows in analyzer |
| Graph edge sequence | test35 conceptual lifecycle reached | 22-edge TS graph sequence through `prepare_release_surface` |
| Same-edge retries | visible through repeated `fp_*` manifests | 4 same-edge retries |
| Repair attempts | visible through repeated `fp_*` manifests | 5 repair attempts |
| Blocked attempts | historical ledgers/results | 6 blocked attempts |
| Aborted attempts | not the same carrier model | 3 incomplete/aborted run dirs retained as forensic evidence |
| Final closure | release/test tail reached | `prepare_release_surface`, `close`, terminal status `converged` |
| Execution evidence | `sbt test`, 181 test methods passed in JUnit reports | installed-operator `sbt test`, 7 shards succeeded; 51 JUnit test cases passed |
| Runtime observability | event log plus `fp_*` directories | worker prompts, construction briefs, reports, postflight, F_P evaluate result, closure decision, fulfillment ledger, analyzer |

The old comparison concluded that T109 restored practical lifecycle reach but remained a forensic live run with repair pressure. `test82` moves the TS line forward: the accepted final segment is post-fix RC4 evidence, and the run carries typed-stage authority in the archive shape.

## Accepted Test82 Final Segment

| Run | Edge | Target | Closure | Ledger counts |
|---|---|---|---|---:|
| `20260519T042607954Z_pid80159` | `derive_test_execution_result_surface` | `test_execution_result_surface` | close | 437/437 |
| `20260519T043817048Z_pid80159` | `qualify_component_test_execution_surface` | `component_test_qualification_surface` | close | 932/932 |
| `20260519T044158522Z_pid80159` | `derive_component_repair_schedule_surface` | `component_repair_schedule_surface` | close | 932/932 |
| `20260519T044538672Z_pid80159` | `derive_test_run_archive_surface` | `test_run_archive_surface` | close | 1052/1052 |
| `20260519T044848013Z_pid80159` | `derive_release_depth_parity_surface` | `release_depth_parity_surface` | close | 1/1 |
| `20260519T045221059Z_pid80159` | `prepare_release_surface` | `release_surface` | close | 1048/1048 |

The final archive reports `status = converged`, `sdlc_edge_closure_decision.disposition = close`, and a fulfillment ledger with:

```json
{
  "admitted": true,
  "targetCertificationPassed": true,
  "edgeConverged": true,
  "fulfillmentConverged": true,
  "carryConverged": true,
  "fdRecheckPassed": true,
  "counts": {
    "expected": 1048,
    "fulfilled": 1048,
    "partial": 0,
    "blocked": 0,
    "unfulfilled": 0,
    "missing": 0,
    "extra": 0
  }
}
```

## Execution Evidence

`test82` accepted execution archive:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T042607954Z_pid80159`

The worker-result projection carries:

```json
{
  "executionEvidence": {
    "lane": "test",
    "command": "sbt test",
    "status": "succeeded",
    "testsObserved": 7,
    "passedCount": 7,
    "failedCount": 0
  }
}
```

The seven installed-operator shards all succeeded:

- `test-shard-01-cdme-compiler`
- `test-shard-02-cdme-assurance`
- `test-shard-03-cdme-executor`
- `test-shard-04-cdme-adjoint`
- `test-shard-05-cdme-accounting`
- `test-shard-06-cdme-fidelity`
- `test-shard-07-cdme-engine`

The JUnit/ScalaTest reports under `build_tenants/scala_spark/*/target/test-reports` record a finer-grained test count:

| Workspace | JUnit XML reports | Test cases | Failures | Errors | Skipped | Passed |
|---|---:|---:|---:|---:|---:|---:|
| `test35` | 33 | 181 | 0 | 0 | 0 | 181 |
| `test82` | 7 | 51 | 0 | 0 | 0 | 51 |

Interpretation: the installed operator currently counts one successful shard per module in `executionEvidence.testsObserved`; the underlying ScalaTest reports show 51 individual test cases. This is still substantially narrower than the 181 test cases in `test35`, but it is governed execution evidence, not a worker assertion.

## Test35 Stage Coverage Under Test82

The `test82` analyzer maps the test35 conceptual stages as follows:

| test35 conceptual stage | `test82` mapped edge | Status |
|---|---|---|
| feature decomposition | `derive_feature_decomp_surface` | mapped |
| scenario / UAT pressure | `derive_scenario_surface` | mapped |
| UAT testcases | `derive_uat_testcases_surface` | mapped |
| implementation design | `derive_implementation_design_surface` | mapped |
| component code | `derive_component_code_surface` | mapped |
| test design | `derive_test_design_surface` | mapped |
| component test | `derive_component_test_surface` | mapped |
| test execution prep | `prepare_test_execution_surface` | mapped |
| test execution result | `derive_test_execution_result_surface` | mapped |
| test run archive | `derive_test_run_archive_surface` | mapped |
| code rollup | `derive_code_surface` | mapped as rollup |
| release preparation | `prepare_release_surface` | mapped as rollup |

The analyzer also reports TS runtime edges that do not have a one-to-one old test35 stage: `derive_intent_surface`, `derive_product_surface`, `derive_goal_surface`, `derive_requirement_surface`, `derive_testcase_authority_surface`, `derive_design_surface`, `qualify_component_realization_surface`, `qualify_component_test_execution_surface`, `derive_component_repair_schedule_surface`, and `derive_release_depth_parity_surface`.

Those are not hidden failures. They are the TS/ABG line's explicit graph products and qualification/rollup surfaces. The relevant comparison point is that the old test35 pressure regions are no longer hidden behind a bounded stop condition; they are mapped or intentionally represented by newer explicit edges.

## Typed-Stage Authority Difference

The old comparison was written before the T-102 typed-stage authority repair. `test82` carries the repaired shape:

```json
{
  "worker_result_report.projectionRole": "typed_fp_stage_projection",
  "worker_result_report.authoritativeStageResultRef": "file:///.../fp_evaluate_result.json",
  "fp_evaluate_result.stageAuthority": "typed_fp_stage_carriers",
  "fp_evaluate_result.workerReportProjectionRef": "file:///.../worker_result_report.json"
}
```

This matters because the `test82` report is not closure authority by itself. The report is a projection over typed F_P stage carriers. The fulfillment ledger cites the installed-operator-published evaluation result as the governing predecessor/admission fact. That is the category of bug the old TS runs did not yet close.

## Code-Depth Metrics

The code metrics below count Scala/SBT/build files under `build_tenants/scala_spark`, excluding generated `target/` output.

| Dimension | `test35` | `test82.TS.cl` | Ratio |
|---|---:|---:|---:|
| CDME modules | 7 | 7 | equal |
| Product/build files | 142 | 20 | 14% |
| Source files | 105 | 10 | 10% |
| Test files | 35 | 7 | 20% |
| Source LOC | 5967 | 1588 | 27% |
| Test LOC | 3179 | 827 | 26% |
| Build/config LOC | 105 | 97 | 92% |
| Requirement markers | 797 | 94 | 12% |
| `case class` markers | 120 | 41 | 34% |
| `case object` markers | 31 | 59 | 190% |
| `sealed trait` markers | 11 | 15 | 136% |
| Test assertion markers | 382 | 78 | 20% |
| JUnit/ScalaTest cases passed | 181 | 51 | 28% |

The code-depth verdict is clear:

- `test82` matches `test35` at module-family coverage: compiler, assurance, executor, adjoint, accounting, fidelity, and engine are all present.
- `test82` is much thinner at component/service decomposition: 10 source files versus 105.
- `test82` has a stronger closed-ADT signal than its file count suggests: 15 sealed traits and 59 case objects, often modelling closed protocol/status surfaces.
- `test82` has materially weaker requirement trace density than `test35`: 94 requirement markers versus 797.
- `test82` has real tests and real execution evidence, but the test surface is still module-level: 7 test files and 51 JUnit test cases versus `test35`'s 35 test files and 181 cases.

## Per-Module Code Depth

| Module | `test35` source files | `test35` test files | `test35` source LOC | `test35` test LOC | `test82` source files | `test82` test files | `test82` source LOC | `test82` test LOC |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `cdme-accounting` | 6 | 3 | 241 | 212 | 1 | 1 | 160 | 90 |
| `cdme-adjoint` | 18 | 5 | 935 | 586 | 1 | 1 | 156 | 98 |
| `cdme-assurance` | 5 | 1 | 176 | 110 | 1 | 1 | 147 | 107 |
| `cdme-compiler` | 24 | 9 | 1730 | 780 | 2 | 1 | 307 | 137 |
| `cdme-engine` | 2 | 1 | 726 | 123 | 2 | 1 | 356 | 156 |
| `cdme-executor` | 24 | 10 | 1260 | 769 | 2 | 1 | 275 | 153 |
| `cdme-fidelity` | 26 | 6 | 899 | 599 | 1 | 1 | 187 | 86 |

The per-module table explains the gap better than the aggregate totals. `test82` builds all seven modules, but most modules are a single source file and one test file. `test35` decomposes compiler, executor, adjoint, and fidelity into many domain and service files.

## Product Code Shape

`test35` contains production-shaped component decomposition. Examples:

- `cdme-compiler`: `TopologicalCompiler`, `GrainChecker`, `TypeResolver`, `TypeUnifier`, `CastRegistry`, `ImplementationFunctor`, `TemporalBindingResolver`, `SheafManager`, `MonoidLawValidator`, `AdjointCompositionValidator`, `DryRunExecutor`, `AggregationFunctionRegistry`, `EntityRegistry`, and domain carriers.
- `cdme-executor`: `MorphismExecutor`, `RunManifestManager`, `ArtifactVersionStore`, `RunReplayService`, `LookupVersionResolver`, `CostEstimator`, `SynthesisEngine`, `BusinessLogicRegistry`, `ExternalMorphismRegistry`, `ResidueCollector`, `LateArrivalHandler`, and domain carriers.
- `cdme-fidelity`: covariance contracts, invariant engines, profilers, quality rules, breach handling, verification services, certificate chains, and domain carriers.

`test82` contains compact but real module implementations:

- `cdme-compiler`: `TopologyCompiler.scala` plus `package.scala`.
- `cdme-executor`: `DataFrameExecutor.scala` plus `ErrorSink.scala`.
- `cdme-engine`: `CdmeEngineImpl.scala` plus `CdmeEngineRunner.scala`.
- accounting, adjoint, assurance, and fidelity each have one source file and one test file.

This is not a placeholder-only result. `test82` has a Spark-backed executor surface, engine integration, assurance checks, accounting verification, fidelity service, adjoint registry, and module tests. But it is still a compact module-level realization, not a production component graph at `test35` depth.

## Code Quality Notes

`test82` strengths:

- All seven CDME modules are present and build under one SBT graph.
- The test execution result is admitted by the installed operator after `F_P.transform` returns.
- The final execution result succeeded across all seven shards.
- The generated tests are runnable and produce JUnit XML reports with 51 passing test cases.
- The code uses closed typed carriers heavily: 41 case classes, 59 case objects, and 15 sealed traits.
- Runtime proof is much stronger than `test35`: prompt source identity, construction brief identity, postflight, fulfillment ledger, closure decision, execution evidence, and F_P evaluate carrier are all archived per run.

`test82` weaknesses relative to `test35`:

- It has only 10 source files; `test35` has 105.
- Requirement trace density is far lower: 94 markers versus 797.
- Several runtime-service concepts are compressed into module files rather than decomposed into named service/domain classes.
- There are mutable `var` markers in executor, adjoint, engine, and test fixtures. Some are ordinary Spark/test-fixture state, but `test35` has less mutable surface overall.
- There are direct `throw` markers in engine/executor/accounting paths. Some are edge adapters or unsupported runtime placeholders; they should be reviewed before claiming production depth.
- Test breadth is real but not comparable to `test35`: 51 JUnit test cases versus 181.

## Why Test35 Is Still Deeper

The prior comparison's core diagnosis still applies: `test35` was deeper because it forced component topology and test-class topology before code. It did not merely ask for a module implementation.

The mechanics were:

1. `implementation_module_surface` owned concrete component/file topology before code generation.
2. Requirements were decomposed to named component-level fulfillment boundaries.
3. `derive_code_surface` ran many realization passes over the high-code region.
4. `derive_test_module_surface` allocated many TC IDs to concrete test classes before test code generation.
5. Runtime services were materialized as named services, registries, stores, and domain carriers.

`test82` now proves the stronger runtime law: full lifecycle, typed-stage authority, execution-result admission, release closure, and continuation through repair. But its code-generation shape still permits compact module-level realization. That is why the right conclusion is not "test82 supersedes test35 code depth." The right conclusion is: `test82` finally closes the lifecycle-proof gap; a separate production-depth uplift would need to restore test35-style component/file topology pressure inside the TS graph.

## Bottom Line

`test82` is the correct T-171 / RC4 closure proof. It satisfies the runtime and closure-law comparison that earlier TS runs failed:

- full graph tail reached
- execution-result evidence admitted before release closure
- downstream test/run/release surfaces closed
- typed F_P stage authority is live
- release closure is ledger/evaluator backed, not worker-asserted

`test35` remains the code-depth reference:

- 105 source files vs 10
- 35 test files vs 7
- 181 JUnit test cases vs 51
- 797 requirement markers vs 94
- many named service/domain components versus compact module files

The next meaningful work is not another T-171 closure proof. It is a new production-depth requirement/design pass: make the TS graph carry component/file topology and test-class allocation strongly enough that the code edge cannot collapse a seven-module product into ten source files when the reference depth requires dozens of service/domain components.
