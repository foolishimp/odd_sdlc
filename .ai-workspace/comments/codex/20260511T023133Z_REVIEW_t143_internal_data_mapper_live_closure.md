# T-143 Internal Data Mapper Shallow Closure Candidate

This note is retained as forensic evidence. It is not valid T-143 closure
evidence after the later execution-contract review. The same archive was
invalidated by
`.ai-workspace/comments/codex/20260511T024417Z_REVIEW_t143_shallow_closure_bug.md`.

## Run Boundary

This was not the named steel-thread alias.

The command run from `build_tenants/typescript` was:

```text
ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/data_mapper_induction
ODD_SDLC_TS_DATA_MAPPER_LANE_NAME=internal_data_mapper_t143_closure_sandbox
npm run live:data-mapper-sandbox
```

The runner used the full external data-mapper sandbox path, pointed at the checked-in internal controlled duplicate fixture.

Archive:

```text
build_tenants/typescript/test_env/test_runs/internal_data_mapper_t143_closure_sandbox/20260511T020342111Z_pid45018
```

Installed command:

```text
workspace/node_modules/.bin/odd-sdlc-ts
```

Worker transport:

```text
process://claude?model=sonnet&effort=xhigh
```

## Candidate Result

`run_summary.json` reports:

```text
terminalReason = odd_sdlc_reported_converged
productMaterializationPackages.length = 2
final materialization postflight = passed
final materialization assurance = close_allowed
```

The runner first invoked `Fg_materialize_declared_product_asset`, observed open `REQ-DQ-*` obligations, then performed a same-edge retry. The admitted final materialization archive is:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T022258486Z_pid90965
```

Final carrier checks:

```text
worker_run.status = 0
worker_run.timedOut = false
worker_result_report.fpTransformStatus = returned
worker_result_report.obligationAssessments = 93 fulfilled / 93 total
worker_result_report.unresolvedReasons = []
worker_result_report.executionEvidenceErrors = []
postflight.status = passed
assurance_satisfaction.status = close_allowed
sdlc_edge_closure_decision.disposition = close
sdlc_next_action_projection.choosesNextTraversal = false
sdlc_next_action_projection.selectedActionRef = null
sdlc_next_action_projection.nextGraphFunctionRef = null
```

## Product Authority

The worker package carried PRODUCT-derived target authority:

```text
productMaterializationAuthority.status = passed
selectedOutputRoot = build_tenants/scala_spark
declaredProductFileTargets:
  - build_tenants/scala_spark/build.sbt
  - build_tenants/scala_spark/project
sourceRefs:
  - workspace://specification/PRODUCT.md
```

The final product materialization manifest reports:

```text
kind = sdlc_product_materialization_manifest
fileCount = 20
sourceCount = 19
requiredRoles = source
buildExecutionContract = sbt compile
testExecutionContract = sbt test
```

Observed final source/build carriers include:

```text
cdme-ai-assurance/src/main/scala/com/cdme/ai/AiAssuranceGate.scala
cdme-api/src/main/scala/com/cdme/api/MorphismRegistry.scala
cdme-api/src/main/scala/com/cdme/api/OpenLineageEmitter.scala
cdme-compiler/src/main/scala/com/cdme/compiler/AdjointCompiler.scala
cdme-compiler/src/main/scala/com/cdme/compiler/CompilationError.scala
cdme-compiler/src/main/scala/com/cdme/compiler/TopologicalCompiler.scala
cdme-context/src/main/scala/com/cdme/context/SheafManager.scala
cdme-lineage/src/main/scala/com/cdme/lineage/ResidueCollector.scala
cdme-lineage/src/main/scala/com/cdme/lineage/RunManifestManager.scala
cdme-model/src/main/scala/com/cdme/model/Adjoint.scala
cdme-model/src/main/scala/com/cdme/model/CdmeType.scala
cdme-model/src/main/scala/com/cdme/model/ErrorDomain.scala
cdme-model/src/main/scala/com/cdme/model/Grain.scala
cdme-model/src/main/scala/com/cdme/model/LdmEntity.scala
cdme-model/src/main/scala/com/cdme/model/LdmGraph.scala
cdme-runtime/src/main/scala/com/cdme/runtime/DataProfiler.scala
cdme-runtime/src/main/scala/com/cdme/runtime/DataQualityMonitor.scala
cdme-runtime/src/main/scala/com/cdme/runtime/MorphismExecutor.scala
cdme-runtime/src/test/scala/com/cdme/runtime/DataQualitySpec.scala
cdme-spark/src/main/scala/com/cdme/spark/ImplementationFunctor.scala
```

## Invalidated Closure Read

This does not satisfy the T-143 closure law for the controlled internal
data-mapper duplicate. The original read accepted file materialization and
fulfilled obligation assessments, but it missed the declared executable product
contract:

```text
buildExecutionContract = sbt compile
testExecutionContract = sbt test
worker_result_report.executionEvidence = null
```

The following candidate properties remain useful forensic evidence, but they
are not sufficient for executable product closure:

- conformance ran in a fresh installed sandbox workspace;
- product materialization received a non-empty typed target contract from conformed `PRODUCT.md`;
- product files were observed under `build_tenants/scala_spark`;
- framework carriers admitted the result with no unresolved worker reasons;
- the edge closed with no next traversal selected;
- the runner returned converged rather than looping or replaying stale materialization pressure.
