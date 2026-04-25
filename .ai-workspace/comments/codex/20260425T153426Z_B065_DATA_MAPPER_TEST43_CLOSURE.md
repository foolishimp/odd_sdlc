# B-065 Data Mapper Test43 Closure

## Claim

B-065 is closed. The data_mapper false build closure bug is fixed in source and
proved on a clean template sandbox.

## Source Fix

- generated Scala tenants now emit `sbt-assembly` when the active project
  profile declares `sbt clean assembly` or `fat_jar: true`
- generated `build.sbt` now carries an assembly merge strategy for the
  duplicate module-info/META-INF failure observed in test38
- operational SBT dispatch runs from the governed code root
- `build_execution_result_surface` cannot fulfill a declared build contract
  without successful dispatch evidence
- failed build dispatch remains blocked as `build_execution_contract_failed`

## Clean Sandbox Proof

Sandbox:
`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test43`

Observed:

- `start --until converged` stopped at
  `derive_build_execution_result_surface`
- fulfillment was blocked with `build_execution_evidence_missing`
- generated `build_tenants/scala_spark/project/plugins.sbt` declares
  `com.eed3si9n:sbt-assembly:2.1.5`
- generated `build_tenants/scala_spark/build.sbt` declares assembly settings
  and merge strategy
- `sbt clean assembly` exits `0`
- `sbt test` exits `0` with `103` generated ScalaTest checks passing
- governed build dispatch records lane `build`, contract
  `sbt clean assembly`, cwd `build_tenants/scala_spark`, exit code `0`
- governed test dispatch records lane `test`, contract `sbt test`, cwd
  `build_tenants/scala_spark`, exit code `0`

## Current Gap

After build/test evidence admission, the public gap frontier is:

- edge: `prepare_deployment_surface`
- summary: `gap_count=5`, `mixed_truth_classes=false`

That remaining gap is now tracked as B-066. It is deployment/runtime projection
closure after admitted build/test evidence, not false build/test convergence.

## Residual Note

SBT prints a lint warning for `Global / autoStartServer`. The generated build
and test commands still exit successfully. This warning is not the B-065 closure
condition, but it is worth cleaning if the generated build should be warning-free.
