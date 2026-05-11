# T-143 Shallow Closure Bug

## Finding

The internal data-mapper live closure candidate was admitted too shallowly.

The product materialization contract declared:

```text
buildExecutionContract = sbt compile
testExecutionContract = sbt test
```

but the final admitted archive showed:

```text
product_materialization_manifest.executionShards = []
worker_result_report.executionEvidence = null
```

The traversal framework still emitted:

```text
postflight.status = passed
assurance_satisfaction.status = close_allowed
sdlc_edge_closure_decision.disposition = close
sdlc_next_action_projection.choosesNextTraversal = false
```

## Direct Qualification Probe

After-the-fact execution inside the generated sandbox product failed:

```text
cd build_tenants/typescript/test_env/test_runs/internal_data_mapper_t143_closure_sandbox/20260511T020342111Z_pid45018/workspace/build_tenants/scala_spark
sbt test
```

Failure classes:

```text
cdme-runtime/src/test/scala/com/cdme/runtime/MorphismExecutorSpec.scala
  missing parameter type for expanded function: _.sum

cdme-spark/src/test/scala/com/cdme/spark/ImplementationFunctorSpec.scala
  stable identifier required for spark.implicits
  toDF / $"..." implicits unavailable

io.openlineage:openlineage-java:1.9.0
  dependency resolution failed
```

Some generated suites did pass before the compile/dependency failures, but the
product did not qualify as an executable Scala/SBT surface.

## Bug Statement

For product materialization with declared build/test execution contracts,
observed files are necessary but not sufficient. Closure must require successful
execution evidence, or a visible non-close disposition when execution is absent,
pending, failed, or invalid.

T-143 is reopened on this basis.

## Repair Evidence

The framework now treats the reusable declared-product materialization edge as
execution-evidence-bearing when it carries a declared test execution contract:

```text
edgeName = Fg_materialize_declared_product_asset
targetAssetType = component_code_surface
testExecutionContract = sbt test
```

Postflight now rejects:

```text
executionEvidence = null -> test_execution_evidence_missing
executionEvidence.status = failed -> test_execution_failures_present
```

The existing `test_execution_result_surface` repair semantics are unchanged:
failed-but-structurally-valid execution evidence remains admissible there as
repair input.

Regression proof:

```text
npm run test:t143
npm run test:t066
npm run test:t142
```

Replay proof against the exact old shallow archive:

```text
graphFunctionName = Fg_materialize_declared_product_asset
edgeName = Fg_materialize_declared_product_asset
targetAssetType = component_code_surface
testExecutionContract = sbt test
reportExecutionEvidence = null
postflightStatus = blocked
blockingReasons = test_execution_evidence_missing
```

T-143 remains active for product closure because direct `sbt test` inside the
generated internal data-mapper product still fails. The framework no longer
admits that failure as closure.
