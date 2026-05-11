# T-143 Fresh Internal Data Mapper Live Repair Run

## Run Boundary

Command run from `build_tenants/typescript`:

```text
ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/data_mapper_induction
ODD_SDLC_TS_DATA_MAPPER_LANE_NAME=internal_data_mapper_t143_repair_live
npm run live:data-mapper-sandbox
```

Archive:

```text
build_tenants/typescript/test_env/test_runs/internal_data_mapper_t143_repair_live/20260511T034123994Z_pid43155
```

Worker transport:

```text
process://claude?model=sonnet&effort=xhigh
```

## Materialization Edge

Fresh live materialization archive:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T034543101Z_pid78309
```

Manifest:

```text
graphFunctionName = Fg_materialize_declared_product_asset
edgeName = Fg_materialize_declared_product_asset
targetAssetType = component_code_surface
buildExecutionContract = sbt compile
testExecutionContract = sbt test
```

Worker process:

```text
worker_run.status = 0
worker_run.outcome.kind = exited
worker_run.outcome.status = 0
worker_run.timedOut = false
worker_run.elapsedMs = 1505906
worker_run.executorProfile = pty-terminal
```

Worker result:

```text
worker_result_report.unresolvedReasons = []
worker_result_report.materializedFiles = 25
worker_result_report.obligationAssessments = 95
worker_result_report.executionEvidence = null
worker_result_report.executionEvidenceErrors =
  - transformArtifact.executionEvidence.command: expected string
```

Product materialization manifest:

```text
fileCount = 25
sourceCount = 23
testCount = 0
buildConfigCount = 1
executionShards = []
```

Postflight:

```text
postflight.status = blocked
blockingReasons =
  - test_execution_evidence_invalid:transformArtifact.executionEvidence.command: expected string
blockingReasonCarriers[0].code = test_execution_evidence_invalid
blockingReasonCarriers[0].lawfulReentryPoint = repair_worker_output
```

## Read

The repaired execution-evidence gate is now live-proven on the internal
controlled duplicate. The run did not close shallowly. It reached the declared
product materialization edge, materialized files, and then blocked because the
worker supplied invalid execution evidence instead of a valid
`sdlc_worker_execution_evidence.command` string.

This is not T-143 product closure. It is closure-bug evidence: executable
product materialization now fails closed rather than accepting file observation
as sufficient proof.

The outer sandbox runner did not return because the installed `odd-sdlc-ts
start --target next --until first_traversal` invocation continued into same-edge
repair/reentry after the blocked postflight. It launched follow-up
`Fg_materialize_declared_product_asset` attempts in:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T041049121Z_pid78309
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T041342457Z_pid78309
```

The `20260511T041049121Z_pid78309` attempt was seeded by retry context from the
first `test_execution_evidence_invalid` gap and also blocked on invalid execution
evidence. The `20260511T041342457Z_pid78309` attempt was in progress when the
harness was terminated. Treat this as an installed-runner stop-condition/reentry
bug, not as product-materialization closure.
