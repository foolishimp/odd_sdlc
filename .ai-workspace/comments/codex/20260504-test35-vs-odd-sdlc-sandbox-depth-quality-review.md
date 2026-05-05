# Test35 vs Latest odd_sdlc Sandbox Data Mapper Depth/Quality Review

Date: 2026-05-04

Reviewed evidence:

- Test35 project: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`
- Test35 comparison note: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/EDGE_COMPARISON_test35_vs_test65_vs_test66.md`
- Latest odd_sdlc sandbox live archive: `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260504T033959560Z_pid59143`
- Latest odd_sdlc sandbox workspace: `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260504T033959560Z_pid59143/workspace`

## Verdict

The latest odd_sdlc sandbox run restored the missing depth mechanism, but it has not yet restored full test35 quality.

The important distinction is this:

- Test35 is still the stronger production-shaped realization: 105 source Scala files, 35 test Scala files, 7 module groups, explicit implementation-module obligation allocation, explicit test-module obligation allocation, and lifecycle closure through test execution/archive/release.
- The latest odd_sdlc sandbox is now the stronger typed traversal substrate: component-depth is explicit, admitted through typed registers, rejected on schema errors, retried lawfully, materialized into real source/test files, and observed through traced process archives.
- The latest odd_sdlc sandbox stopped after `prepare_test_execution_surface`; it did not prove `derive_test_execution_result_surface`, `derive_test_run_archive_surface`, `qualify_testcase_authority`, or `prepare_release_surface`.

Do not call the latest sandbox a test35-equivalent yet. It is a major recovery of the depth mechanics, not a full parity result.

## Quantitative comparison

| Measure | Test35 | Latest odd_sdlc sandbox |
|---|---:|---:|
| Source Scala files | 105 | 24 |
| Test Scala files | 35 | 51 |
| All Scala files | 140 | 75 |
| Source LOC | 5218 | 704 |
| Test LOC | 2663 | 2139 |
| Case classes | 120 | 43 |
| Sealed ADTs | 11 | 5 |
| Classes | 203 | 94 |
| Traits | 15 | 29 |
| Objects | 67 | 35 |
| Assertion markers | 314 | 229 |
| Requirement/obligation markers | 813 | 871 |
| Runtime event lines | 4662 | traced operator-runs per edge |
| FP manifests/results/ledgers | 82 / 81 / 80 | ABG typed runtime artifacts per edge |
| Lifecycle reached | release surface | prepare test execution surface |

Interpretation:

- Test35 has more implementation density and more actual domain code.
- Latest odd_sdlc has stronger requirement/reference density relative to code size, but much of the source code is still skeletal.
- Latest odd_sdlc has more tests than test35 by file count, but less proof authority because the test execution/result/archive/release edges were not reached.

## Module-shape comparison

Test35 module distribution:

| Module | Source files | Test files | Source LOC | Test LOC |
|---|---:|---:|---:|---:|
| cdme-accounting | 6 | 3 | 209 | 178 |
| cdme-adjoint | 18 | 5 | 814 | 462 |
| cdme-assurance | 5 | 1 | 152 | 100 |
| cdme-compiler | 24 | 9 | 1539 | 655 |
| cdme-engine | 2 | 1 | 641 | 106 |
| cdme-executor | 24 | 10 | 1103 | 636 |
| cdme-fidelity | 26 | 6 | 760 | 526 |

Latest odd_sdlc sandbox module distribution:

| Module | Source files | Test files | Source LOC | Test LOC |
|---|---:|---:|---:|---:|
| cdme-accounting | 4 | 10 | 130 | 366 |
| cdme-adjoint | 6 | 10 | 137 | 348 |
| cdme-assurance | 2 | 6 | 55 | 252 |
| cdme-compiler | 3 | 5 | 102 | 303 |
| cdme-engine | 3 | 7 | 91 | 321 |
| cdme-executor | 3 | 5 | 76 | 231 |
| cdme-fidelity | 3 | 8 | 113 | 318 |

Quality finding:

Test35 gives heavyweight implementation modules for compiler, executor, adjoint, and fidelity. The latest sandbox distributes tests broadly, but source realization is thin in the core modules. For example, latest sandbox `cdme-compiler` has only 3 source files versus test35's 24; `cdme-executor` has 3 versus 24; `cdme-fidelity` has 3 versus 26. That is the remaining production-depth gap.

## Edge-by-edge review

| Edge | Test35 behavior | Latest odd_sdlc sandbox behavior | Quality verdict |
|---|---|---|---|
| `derive_product_surface` | Closed in historical FP flow. | Closed; typed operator run recorded. | Equivalent enough. |
| `derive_goal_surface` | Closed in historical FP flow. | Closed. | Equivalent enough. |
| `derive_requirement_surface` | Closed; requirements later allocate into implementation/test modules. | Closed; imported many split requirement surfaces. | Equivalent or stronger in source import breadth. |
| `derive_feature_decomp_surface` | Closed. | Closed. | Equivalent enough. |
| `derive_uat_testcases_surface` | Closed. | Closed. | Equivalent enough. |
| `derive_design_surface` | Closed. | Closed. | Equivalent enough. |
| `derive_scenario_surface` | Closed. | Closed. | Equivalent enough. |
| `derive_implementation_design_surface` | Closed. | Closed. | Equivalent enough as a surface; not sufficient for code depth by itself. |
| `select_implementation_stack_profile` | Closed; Scala/Spark/SBT shape carried forward. | Closed; Scala/Spark/SBT shape carried forward. | Equivalent enough. |
| `derive_implementation_module_surface` | Strong: explicit module boundary surface, 7 SBT sub-projects, owned components, package roots, dependencies, requirement obligation set. | Closed; feeds the new component-topology edge. | Test35 stronger in authored module detail; latest stronger because it now has downstream typed component enforcement. |
| `derive_implementation_component_topology_surface` | No separate typed edge; component depth was implicit inside module/code generation. | First attempt rejected: `component_depth_register_missing`; retry admitted with `componentTopologyRows:24`, `registerVersion:ts-component-depth-v1`. | Latest is mechanically stronger. Rejection proves the guard works. Prompt still needs tightening because first attempt missed the register. |
| `derive_component_realization_schedule_surface` | No separate typed edge. | First attempt rejected: wrong/missing register version (`ts-component-realization-v1`); retry admitted with 24 realization rows and `ts-component-depth-v1`. | Latest is mechanically stronger, but schema/prompt pressure remains. The engine correctly rejected drift. |
| `derive_component_code_surface` | Strong: 105 source files, high domain density, substantial implementation modules. | Closed with `materializedFiles:24`, required role `source`; source files are real but much thinner. | Latest restores the mechanism; test35 still wins quality/depth. |
| `qualify_component_realization_surface` | No separate typed edge. | First attempt rejected: `component_depth_register_missing`; retry closed. | Latest is mechanically stronger. Prompt/schema robustness still needs improvement. |
| `derive_realization_schedule_surface` | Closed. | Closed after component qualification. | Equivalent enough. |
| `derive_code_surface` | Closed; source code already materially deep. | Closed but no additional materialized files at this edge. | Latest relies on component-code edge for source files. That is acceptable if documented as the new mechanism. |
| `derive_test_design_surface` | Closed. | Closed. | Equivalent enough. |
| `select_test_stack_profile` | Closed. | Closed. | Equivalent enough. |
| `derive_test_module_surface` | Strong: 33 test classes, 80 test cases, obligation ledger allocation by module. | Closed; feeds typed test component topology. | Test35 stronger as a readable obligation-allocation document. Latest stronger only if downstream typed rows remain admitted. |
| `derive_test_component_topology_surface` | No separate typed edge. | First attempt rejected: unexpected field `coveredComponentIds`; retry admitted with `testComponentTopologyRows:51`. | Latest is mechanically stronger; schema strictness works. Prompt must forbid undeclared fields. |
| `derive_component_test_surface` | Strong: 35 tests, 2663 LOC, historical execution evidence. | First attempt hit `worker_hard_timeout`; retry closed with `componentTestRows:51` and `materializedFiles:51`. | Latest restores breadth, but timeout indicates the edge is heavy and needs monitoring/budget review. Test execution still unproven. |
| `derive_test_schedule_surface` | Closed. | Closed; emitted 7 execution shards. | Equivalent as scheduling, latest has clearer shard contract. |
| `prepare_test_execution_surface` | Closed. | Closed; this is the last reached edge in latest sandbox. | Latest reached preparation only, not execution. |
| `derive_test_execution_result_surface` | Closed; historical result edge exists. | Not reached. | Test35 wins. Must be rerun with sufficient step budget. |
| `derive_test_run_archive_surface` | Closed repeatedly in historical FP artifacts. | Not reached. | Test35 wins. |
| `qualify_testcase_authority` | Closed. | Not reached. | Test35 wins. |
| `prepare_release_surface` | Closed. | Not reached. | Test35 wins. |

## Mechanism-by-mechanism review

### Graph-function pressure

Test35 forced production shape through the older function graph and generated module/test surfaces. The pressure was real: implementation modules and test modules explicitly carried requirement obligations into named components and classes.

Latest odd_sdlc now adds the missing explicit component-depth pressure:

- `componentTopologyRows:24`
- `componentRealizationRows:24`
- `testComponentTopologyRows:51`
- `componentTestRows:51`
- source/test materialization roles checked by `product_materialization_manifest.json`

This is the right direction. The old problem was that the graph could close while generating shallow code. The new graph has depth-specific edges that can block closure.

### Typed admission

Latest odd_sdlc is better than test35 on admission mechanics.

The latest run rejected:

- missing component-depth register,
- wrong/unknown register version,
- undeclared field `coveredComponentIds`,
- hard timeout during component test generation.

Those are good failures. They prove the substrate is not just accepting prose. The cost is that prompts still need tightening so the first attempts are less likely to drift.

### Source-code quality

Test35 is still substantially better.

Observed latest sandbox source style includes small traits, case classes, and default implementations that often return `Vector.empty` or simple placeholders. That is valid scaffold code, but it is not the same as test35's production-shaped compiler/executor/fidelity implementation density.

This is the core remaining gap: latest odd_sdlc restored file/component breadth, but source semantics are still skeletal relative to test35.

### Test quality

Latest odd_sdlc has more test files, but test35 still has stronger proof authority.

Latest sandbox:

- 51 test files.
- 229 assertion markers.
- Test classes split into construct/preflight/postflight shapes.
- No execution result surface reached in the latest run.

Test35:

- 35 test files.
- 293 assertion markers.
- Test module surface allocates 80 test cases across requirement IDs.
- Historical execution/result/archive/release edges exist.

Until latest odd_sdlc reaches and passes test execution/result/archive, its test surface is planned/generated evidence, not closure evidence.

### Observability and failure classification

Latest odd_sdlc is stronger.

The traced process / PTY substrate records per-edge operator runs, worker process events, worker stdout/stderr, worker result reports, materialization manifests, assurance satisfaction, gap dossiers, and lawful retry decisions. Test35 has historical FP artifacts and event logs, but not the newer traced process callout substrate.

This is the major improvement over test35 and over test65/test66.

### Sandbox hygiene

The latest reviewed sandbox archive predates the B-083 source-root hygiene fix. Its output is still sandbox-contained under the run workspace, but the rerun must use the B-083 guard so `.scala-build`, `.metals`, `build_tenants/scala_spark`, `target`, `.bloop`, and root `cdme-*` directories cannot leak into the odd_sdlc source root.

## Root reason test35 still looks better

Test35 did not merely generate more files. It forced a richer intermediate structure before code:

- module topology,
- owned component list,
- package structure,
- external/internal dependency mapping,
- requirement obligation allocation per module,
- test class allocation per requirement/test case,
- execution and release closure.

The latest odd_sdlc now has the machinery to force this, but the source realization still needs deeper semantic obligations per component. The component-depth rows need to require production-shaped methods, invariants, data model boundaries, error ADTs, and non-empty behavioral implementations, not only file materialization.

## Rerun readiness

Do not rerun to claim parity until the rerun is configured to reach the full lifecycle tail.

Required rerun conditions:

- Use the post-B-083 sandbox hygiene guard.
- Increase the live harness step budget beyond the old stop point so it reaches execution/result/archive/release.
- Keep component-depth closure required at implementation topology, realization schedule, code, qualification, test topology, and component test edges.
- Treat any component-depth open gap as a real failure, not a workaround condition.
- Treat worker hard timeout at component test generation as retryable evidence, but root-cause repeated timeouts.
- Confirm final run produces test execution result, test run archive, testcase authority, and release surface.

Quality conditions for parity with test35:

- Source files should materially exceed the latest 24-file scaffold and approach the test35 module density, or otherwise demonstrate equivalent component behavior with fewer files.
- Core modules must contain non-trivial implementations, not only traits/default empty vectors.
- Tests must execute and produce result/archive evidence.
- Release surface must close.

## Bottom line

The latest odd_sdlc sandbox restored the mechanism that test65/test66 lacked: typed component-depth traversal with materialization enforcement. It has not yet restored the full depth and quality of test35. The next rerun should prove two things: full lifecycle closure and stronger source semantics, not just successful traversal.
