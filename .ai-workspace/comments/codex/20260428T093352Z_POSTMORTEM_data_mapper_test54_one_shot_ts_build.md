# Postmortem: data_mapper.test54.ts One-Shot TypeScript Build

## Scope

This was an external acceptance run, not an internal `odd_sdlc` unit test.

Workspace:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts`

Source template:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template`

Installed product:

- `odd_sdlc` TypeScript local build
- ABG TypeScript package `@abiogenesis/typescript-tenant@3.4.0-rc.2`
- installed topology under `.abiogenesis/odd_sdlc/typescript`
- cold-agent files `AGENTS.md` and `CLAUDE.md` present

Command:

```bash
ODD_SDLC_TS_OUTPUT=json node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex
```

## Outcome

The run exited naturally. No manual `start` command was issued after the first
one-shot command.

Final state:

- status: `worker_report_rejected`
- graph function: `bootstrap_release_self_test`
- current edge: `derive_test_run_archive_surface`
- closed vectors after run: `0..14`
- loop steps: `17`
- event rows: `88`
- final archive:
  `workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T092753479Z_pid94335`
- final blocker:
  `SdlcWorkerResultReport.executionEvidence.status: expected one of "succeeded", "failed", "pending"`

## Autonomous Traversal Proof

The run proved the installed TS operator can autonomously cross many graph
edges from one external command:

1. `Fg_conform_project`
2. `derive_intent_surface`
3. `derive_product_surface`
4. `derive_goal_surface`
5. `derive_requirement_surface`
6. `derive_feature_decomp_surface`
7. `derive_uat_testcases_surface`
8. `derive_design_surface`
9. `derive_scenario_surface`
10. `derive_implementation_design_surface`
11. `select_implementation_stack_profile`
12. `derive_implementation_module_surface`
13. `derive_code_surface`
14. `derive_test_design_surface`
15. `select_test_stack_profile`
16. `derive_test_module_surface`
17. `derive_test_run_archive_surface` attempted and rejected

This is materially different from the earlier manually stepped TS runs. The
operator loop is now doing the external-observer "one shot until blocked"
behavior.

## Realization Output

Generated product files under:

`build_tenants/scala_spark`

Non-generated source inventory:

- main Scala files: `7`
- main Scala LOC: `1113`
- test Scala files: `7`
- test Scala LOC: `449`
- SBT/build files: `build.sbt`, `project/plugins.sbt`,
  `project/build.properties`

The test-module worker reported:

- `sbt test:compile` passed
- 7 non-empty Scala test-role files were materialized
- one test harness per declared module

## Comparison To test35 Baseline

This run is not test35-parity.

Known test35 reference bar:

- about 105 main Scala files
- about 35 test files
- 16 `derive_code_surface` passes
- 173 passing tests
- richer CDME components such as compiler, resolver, morphism executor,
  synthesis engine, run manifest manager, and related proof surfaces

test54 achieved:

- 7 main Scala files
- 7 test Scala files
- one code edge pass
- `sbt test:compile` evidence from the test-module worker
- no admitted governed `sbt test` execution result

So test54 proves autonomous traversal and partial product synthesis. It does
not prove depth parity or RC readiness.

## Bugs / Gaps Found

### 1. Missing Scheduling Phase

The graph jumps from design/module surfaces directly into code/test synthesis.
Large builds need an explicit scheduling phase:

`design/module surfaces -> schedule/work-plan surface -> planned realization -> evaluation -> iteration`

The schedule should carry work packages, dependency order, phase gates,
expected output surfaces, planned worker lanes, acceptance checkpoints, and
re-entry conditions.

Captured as:

`workspace://.ai-workspace/tickets/active/T-093-add-governed-scheduling-phase-between-design-and-realization.md`

### 2. Execution Evidence Status Contract Mismatch

The final worker emitted:

`executionEvidence.status = "not_run"`

The admitted contract accepts only:

`succeeded | failed | pending`

Captured as:

`workspace://.ai-workspace/tickets/active/T-094-normalize-test-run-archive-execution-evidence-status-contract.md`

### 3. Test Archive Did Not Run Governed Tests

The final edge produced a test-run archive saying tests were not run, despite
the conformed project declaring:

`testExecutionContract: sbt test`

Even if the enum mismatch is fixed, `derive_test_run_archive_surface` must not
close on a non-executed placeholder archive when a test command exists.

Captured as:

`workspace://.ai-workspace/tickets/active/T-095-require-governed-live-test-execution-for-test-run-archive-edge.md`

## Assessment

The major capability recovered is autonomous graph traversal from one external
operator command. The major remaining product gap is execution planning and
depth control. The current graph can keep moving, but it needs a governed
scheduling surface so design decomposes into planned work before synthesis, and
it needs governed live test execution before the test archive can be trusted.
