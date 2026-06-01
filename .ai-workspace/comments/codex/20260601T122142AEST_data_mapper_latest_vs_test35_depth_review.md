# Data Mapper Latest TS Run vs test35 Depth Review

Date: 2026-06-01
Author: Codex
Status: commentary / forensic comparison, not ratified specification

## Scope

This post compares the last completed TypeScript data_mapper lane against the
historical Python `data_mapper.test35` baseline and the prior best TypeScript
comparison points already recorded in comments.

Current completed TS run:

`/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260531T154243945Z_pid19975`

Reference Python run:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`

Prior comparison posts used:

- `.ai-workspace/comments/codex/20260427T120602Z_AUDIT_data_mapper_test35_traversal_vs_current_ts_success_gap.md`
- `.ai-workspace/comments/codex/20260504-test35-vs-odd-sdlc-sandbox-depth-quality-review.md`
- `.ai-workspace/comments/codex/20260513T035126Z_data_mapper_test35_vs_ts_followup.md`
- `.ai-workspace/comments/codex/20260515_t164_data_mapper_full_capability_vs_test35_forensic.md`
- `.ai-workspace/comments/codex/20260519T160359AEST_ANALYSIS_data_mapper_test82_vs_test35_rc4_depth.md`
- `.ai-workspace/comments/codex/20260519T162932AEST_ANALYSIS_data_mapper_test82_vs_test35_divergent_construction_surface.md`

## Verdict

The 2026-05-31 TypeScript run is a real lifecycle improvement over the May 14
T-164 run: it reaches the test execution, test run archive, release depth parity,
and release surfaces; it records `sbt test` execution evidence; it has no broad
`???` or `pending` scaffold surface.

It still does not beat `test35` on implementation depth. It also does not beat
`test82` on executed test breadth or source LOC.

The short version:

- `test35` remains the implementation-depth baseline: 105 source files, 35 test
  files, 181 passing JUnit/ScalaTest cases, deep compiler/executor/fidelity
  component decomposition.
- `test82` remains the strongest prior TS lifecycle/code-balance point: full
  graph tail, 10 source files, 7 test files, 51 passing test cases, 1,578 source
  LOC.
- the latest TS run closes the graph tail and passes `sbt test`, but it is a
  compact product: 16 source files, 9 test files, 9 passing test cases, 892
  source LOC.
- the latest TS run exposes a proof-surface contradiction: the
  `release_depth_parity_surface.md` payload says `status: blocked`, while the
  operator summary and ledger close `derive_release_depth_parity_surface` and
  then close `prepare_release_surface`.

So this is progress, not parity. It proves the modern TS lane can complete the
full lifecycle with execution evidence. It does not prove test35-level
production depth, and the release-depth contradiction should be treated as a
gating defect before calling the run final proof.

## Comparison Set

| Run | Evidence basis | Status in this review |
| --- | --- | --- |
| Python `test35` | Actual workspace plus prior comments | Gold standard for implementation depth and executed proof. |
| TS sandbox 2026-05-04 | Prior comment only; archive path from report is no longer present locally | Historical TS depth-mechanism recovery point. |
| T-164 2026-05-14 | Actual archive plus prior forensic post | Best pre-test-tail full-breadth source materialization stress run. |
| `test82.TS.cl` RC4 | Actual workspace plus prior comments | Best prior TS full-lifecycle proof. |
| T-164 2026-05-31 | Actual completed archive | Latest completed run under review. |

## Run-Level Metrics

Counts below are measured from current files where the workspace/archive still
exists. The 2026-05-04 TS sandbox row is copied from the existing comment
because that archive path is absent in the current checkout.

| Metric | `test35` | TS 2026-05-04 reported | T-164 2026-05-14 measured | `test82.TS.cl` measured | Latest T-164 2026-05-31 measured |
| --- | ---: | ---: | ---: | ---: | ---: |
| Lifecycle tail reached | release / execution | prepare test execution | stopped at component code | prepare release | prepare release |
| Source Scala files | 105 | 24 | 102 | 10 | 16 |
| Test Scala files | 35 | 51 | 7 | 7 | 9 |
| Product/build files counted | 142 | 75 all Scala | 112 | 20 | 27 |
| Source LOC | 5,862 | 704 | 1,135 | 1,578 | 892 |
| Test LOC | 3,144 | 2,139 | 100 | 820 | 488 |
| Build/config LOC | 103 | n/a | 106 | 94 | 273 |
| JUnit XML reports | 33 | not reached | 0 | 7 | 9 |
| JUnit/ScalaTest cases | 181 | not reached | 0 | 51 | 9 |
| JUnit/ScalaTest failures/errors | 0 | n/a | n/a | 0 | 0 |
| `???` stubs | 0 | not measured | 79 | 0 | 0 |
| `pending` test markers | 0 | not measured | 27 | 0 | 0 |
| `REQ-*` occurrences | 797 | reported 871 requirement/obligation markers | 5 | 94 | 0 |
| `requirement:` comment markers | 0 | n/a | 213 | 253 | 460 |
| `case class` markers | 120 | 43 | 66 | 41 | 40 |
| `case object` markers | 31 | n/a | 30 | 59 | 13 |
| `sealed trait` markers | 11 | 5 | 15 | 15 | 3 |
| Assertion markers | 293 | 229 | 34 | 80 | 24 |

## Ratios Against test35

| Metric | `test82.TS.cl` as percent of test35 | Latest T-164 as percent of test35 |
| --- | ---: | ---: |
| Source files | 10% | 15% |
| Test files | 20% | 26% |
| Source LOC | 27% | 15% |
| Test LOC | 26% | 16% |
| Executed test cases | 28% | 5% |
| Case classes | 34% | 33% |
| Sealed traits | 136% | 27% |
| Assertion markers | 27% | 8% |

Interpretation: the latest run improves file count over `test82`, but it is
shallower in source LOC, test LOC, executed test cases, ADT richness, and test
assertion density. It is cleaner than the May 14 scaffold because it has no
`???` and no `pending`, but it is compact.

## Latest Run Runtime Shape

The latest archive contains 35 operator summaries across 22 distinct edges.

| Runtime metric | Latest T-164 value |
| --- | ---: |
| Operator summaries | 35 |
| Distinct graph edges observed | 22 |
| Summary status `converged` | 20 |
| Summary status `blocked` | 13 |
| Summary status `worker_invoked` | 2 |
| Final edge | `prepare_release_surface` |
| Final status | `converged` |
| Final obligation review | 199 / 199 fulfilled |
| Final closure disposition | `close` |

High-pressure edges:

| Edge | Attempts | Blocked attempts | Final observed status | Final reviewed obligations |
| --- | ---: | ---: | --- | ---: |
| `derive_component_code_surface` | 4 | 3 | `worker_invoked` with closure close | 185 / 185 |
| `derive_component_test_surface` | 11 | 10 | `worker_invoked` with closure close | 207 / 207 |
| `derive_test_execution_result_surface` | 1 | 0 | `converged` | 49 / 49 |
| `derive_test_run_archive_surface` | 1 | 0 | `converged` | 203 / 203 |
| `derive_release_depth_parity_surface` | 1 | 0 | `converged` | 199 / 199 |
| `prepare_release_surface` | 1 | 0 | `converged` | 199 / 199 |

This is an important improvement over the May 14 T-164 archive. The earlier run
looked wide but stopped at component code with no execution evidence. The latest
run reaches the lifecycle tail and admits test execution evidence.

## Execution Evidence

Latest T-164 execution result archive:

`workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260531T203612979Z_pid36114`

The worker result report records:

```json
{
  "command": "sbt test",
  "status": "succeeded",
  "testsObserved": 7,
  "passedCount": 7,
  "failedCount": 0
}
```

The shard evidence covers all seven modules:

- `cdme-compiler`
- `cdme-assurance`
- `cdme-executor`
- `cdme-adjoint`
- `cdme-accounting`
- `cdme-fidelity`
- `cdme-engine`

The tenant-local JUnit XML reports show 9 reports, 9 test cases, 9 passed, 0
failures, 0 errors, 0 skipped.

This is real execution evidence, but it is narrow. `test82` had 51 JUnit test
cases. `test35` had 181.

## Product Depth By Module

### Source File Count

| Module | `test35` | `test82.TS.cl` | Latest T-164 |
| --- | ---: | ---: | ---: |
| `cdme-accounting` | 6 | 1 | 2 |
| `cdme-adjoint` | 18 | 1 | 2 |
| `cdme-assurance` | 5 | 1 | 1 |
| `cdme-compiler` | 24 | 2 | 4 |
| `cdme-engine` | 2 | 2 | 2 |
| `cdme-executor` | 24 | 2 | 3 |
| `cdme-fidelity` | 26 | 1 | 2 |

### Source LOC

| Module | `test35` | `test82.TS.cl` | Latest T-164 |
| --- | ---: | ---: | ---: |
| `cdme-accounting` | 235 | 159 | 58 |
| `cdme-adjoint` | 917 | 155 | 114 |
| `cdme-assurance` | 171 | 146 | 50 |
| `cdme-compiler` | 1,706 | 305 | 316 |
| `cdme-engine` | 724 | 354 | 142 |
| `cdme-executor` | 1,236 | 273 | 133 |
| `cdme-fidelity` | 873 | 186 | 79 |

### Test File Count

| Module | `test35` | `test82.TS.cl` | Latest T-164 |
| --- | ---: | ---: | ---: |
| `cdme-accounting` | 3 | 1 | 1 |
| `cdme-adjoint` | 5 | 1 | 1 |
| `cdme-assurance` | 1 | 1 | 1 |
| `cdme-compiler` | 9 | 1 | 3 |
| `cdme-engine` | 1 | 1 | 1 |
| `cdme-executor` | 10 | 1 | 1 |
| `cdme-fidelity` | 6 | 1 | 1 |

### Test LOC

| Module | `test35` | `test82.TS.cl` | Latest T-164 |
| --- | ---: | ---: | ---: |
| `cdme-accounting` | 209 | 89 | 42 |
| `cdme-adjoint` | 581 | 97 | 63 |
| `cdme-assurance` | 109 | 106 | 46 |
| `cdme-compiler` | 771 | 136 | 161 |
| `cdme-engine` | 122 | 155 | 63 |
| `cdme-executor` | 759 | 152 | 67 |
| `cdme-fidelity` | 593 | 85 | 46 |

## Implementation Shape

The latest run is not a hollow stub. It has concrete behavior:

- `TopologyValidator` validates duplicate entities, morphism endpoints,
  aggregate empty identities, known deterministic monoids, identity laws, and
  associativity samples.
- `CdmeEngine` orchestrates topology, binding, type quality, plan build,
  fidelity, assurance, ledger, completion gate, Spark execution, processing
  report, and error-domain production.
- `SparkPlanInterpreter` checks missing input frames, classifies adjoint
  direction, records reverse metadata, unions input frames, and lifts
  Kleisli-expansion output with `explode_outer`.

That is a strong improvement over the May 14 artifact, where many files were
function signatures ending in `???` and tests used `pending`.

But the product is still compact. The old `test35` implementation had many
named services and domain components that do not exist in the latest run:

- compiler: `TopologicalCompiler`, `GrainChecker`, `TypeResolver`,
  `TypeUnifier`, `CastRegistry`, `ImplementationFunctor`,
  `TemporalBindingResolver`, `SheafManager`, `MonoidLawValidator`,
  `AdjointCompositionValidator`, `DryRunExecutor`,
  `AggregationFunctionRegistry`, `EntityRegistry`
- executor: `MorphismExecutor`, `RunManifestManager`,
  `ArtifactVersionStore`, `RunReplayService`, `LookupVersionResolver`,
  `CostEstimator`, `SynthesisEngine`, `BusinessLogicRegistry`,
  `ExternalMorphismRegistry`, `ResidueCollector`, `LateArrivalHandler`,
  `RunCompletionGate`
- fidelity: covariance contracts, invariant engines, profilers, quality rules,
  breach handling, verification services, certificate chains, and domain
  carriers

Latest T-164 is closer to `test82` than to `test35`: it has one to four files
per module, with module-level behavior folded into compact files. `test35`
has a component graph.

## Test Depth

The latest run has 9 Scala test files and 9 JUnit test cases. The tests are real
and executed. They are not `pending` placeholders.

However, the tests are single-case module proofs, not broad behavioral suites.
The compiler has 3 test files; every other module has 1. `test35` has 35 test
files and 181 executed test cases. `test82` has only 7 test files but still 51
executed test cases.

This is the clearest quantitative reason the latest run does not beat the prior
best TS run on proof depth: it reaches the same lifecycle tail, but with only
9 executed test cases.

## Proof-Surface Contradiction

There is a serious internal inconsistency in the latest archive.

The operator summary for `derive_release_depth_parity_surface` says:

```json
{
  "status": "converged",
  "obligationReview": {
    "status": "passed",
    "expected": 199,
    "fulfilled": 199
  },
  "admittedSemantic": {
    "edgeConverged": true,
    "closureDisposition": "close"
  }
}
```

But the materialized `release_depth_parity_surface.md` says:

```json
{
  "releaseDepthParity": {
    "status": "blocked",
    "summary": "Release depth parity is blocked by admitted component repair evidence.",
    "blockingReasons": ["component_repair_schedule_missing"]
  }
}
```

The previous edge also carries a residual contradiction. The
`component_test_qualification_surface.md` contains one failure row:

```text
failure:component-test-surface-missing:unsharded
failureKind: execution_evidence_missing
repairTarget: test_execution_surface
attributionConfidence: medium
```

The repair schedule then says current `sbt test` evidence succeeded and the
failure is unowned, but carries a residual triage gap:

```text
gap://component-repair-schedule/unowned-component-test-qualification-failure
```

Despite that, the operator summaries close the qualification, repair schedule,
release-depth parity, and release surfaces.

This is not an implementation-depth issue. It is a proof-quality issue. The
operator/evaluator appears to certify the presence of the release-depth surface
and requirement refs while not honoring the target carrier's own blocked status.
That should block any claim that the latest run is final gating proof.

## Comparison Against Prior TS High Points

| Dimension | May 14 T-164 | `test82.TS.cl` | Latest T-164 |
| --- | --- | --- | --- |
| Main value | Full-breadth component-code stress | Full lifecycle with execution | Full lifecycle with execution under current T-164 graph |
| Main weakness | No test/release tail; stubs and pending tests | Compact code depth | Very narrow executed tests; release-depth contradiction |
| Source shape | 102 files, 1,135 LOC, 79 stubs | 10 files, 1,578 LOC, no stubs | 16 files, 892 LOC, no stubs |
| Test shape | 7 files, 100 LOC, 27 pending markers | 7 files, 820 LOC, 51 executed cases | 9 files, 488 LOC, 9 executed cases |
| Execution evidence | none | `sbt test` succeeded | `sbt test` succeeded |
| Lifecycle | stops at component code | closes release | closes release, but contradicted by release-depth content |

The latest run is the cleanest current-framework lifecycle pass. It is not the
best TS implementation-depth result.

`test82` remains stronger when the question is: "How much executable TS-built
data_mapper behavior did we prove?" The latest run is stronger when the
question is: "Can the current T-164 lane drive through the full edge list and
exercise repair pressure until release?" It can, but its final proof has a
carrier-status contradiction.

## Bottom Line

The latest run should be recorded as:

```text
current TS full-lifecycle progress: yes
current TS beats May 14 scaffold: yes
current TS beats test82 on code/test depth: no
current TS beats Python test35: no
current TS final gating proof: no, because release-depth parity content is blocked while the operator closes it
```

The next meaningful target is not another broad run with the same depth
predicate. It is a release-depth and component-depth predicate fix:

1. A target carrier that says `status: blocked` must not be admitted as close
   merely because the file exists and cites requirement authority.
2. Unowned qualification failure rows must either be retired through admitted
   refreshed evidence or remain active pressure; they cannot be silently carried
   into release close.
3. The component topology/design stage must force deeper implementation
   decomposition when requirements imply named public boundaries, services,
   stores, validators, and domain carriers.
4. The test stage must force more than one-case-per-module proof when the
   requirement/testcase authority carries broad behavioral obligations.

Until those are fixed, the latest run is an important lifecycle proof and a
useful regression corpus. It is not the first TS run to beat `test35`.
