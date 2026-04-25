---
id: B-065
title: Close operational build proof against the declared build contract
type: bug
ticket_category: ordinary
status: completed
goal: rc-operational-convergence-must-match-executable-build-truth
change_intent: data_mapper.test40 exposed a false operational closure. The installed project profile declared `build_execution_contract: sbt clean assembly`, the generated build execution surfaces converged, and final gap analysis reported `gap_count=0`; but running the declared build contract failed because the generated SBT project does not define the `assembly` task.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: operational execution result closure, generated Scala/SBT tenant build surface, release readiness proof
priority: high
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
completed_at: 2026-04-25
dependencies:
  - B-058 completed
  - B-061 completed
  - B-063 completed
intake_source: observed data_mapper.test40 RC run from `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test40`
target_truth: Operational build convergence is tied to the declared build execution contract. A project declaring `sbt clean assembly` must either materialize an SBT build where `assembly` is available and runnable, or the build execution result must remain open/blocked with governed evidence of the failing command.
superseded_truth: `build_execution_result_surface` can satisfy its generated-asset contract and allow workspace convergence while carrying `status: pending_external_evidence`, `dispatch_binding: none`, no build artifacts, and no proof that the declared build command is executable.
closure_law: this ticket closes when a clean data_mapper template run cannot report zero gaps while the declared build contract fails, and the generated Scala tenant either passes `sbt clean assembly` or produces a governed open gap/blocking result for the failed build execution.
evaluation_criteria:
  - generated Scala/SBT tenant build files match the admitted `build_execution_contract`
  - `sbt clean assembly` is valid when inferred from `fat_jar: true` / `sbt-assembly` capability cues
  - build execution result closure records executed command evidence, exit code, and artifact observation, or remains open/blocked
  - final `odd_sdlc gaps` does not return `gap_count=0` when the declared build contract is unexecuted or failed
  - data_mapper RC run still passes the declared test contract `sbt test`
proof_surface:
  - clean data_mapper template install and converged run with attached local worker
  - `sbt clean assembly` from `build_tenants/scala_spark`
  - `sbt test` from `build_tenants/scala_spark`
  - post-run `odd_sdlc gaps --scope workspace --workspace .`
non_closure_conditions:
  - weakening the inferred build contract to avoid `assembly` while `fat_jar` remains declared
  - treating `pending_external_evidence` as final operational closure
  - adding a hand-edited fix only inside `data_mapper.test40`
  - allowing release/deployment/runtime surfaces to hide failed build execution
---

## Observed Failure

In `data_mapper.test40`, odd_sdlc reached:

- `start --until converged`: `status=converged`
- `gaps`: `gap_count=0`
- `mixed_truth_classes=false`
- `sbt test`: success

But the declared build contract failed:

```text
$ sbt clean assembly
[error] Not a valid command: assembly
[error] Not a valid project ID: assembly
[error] Expected ':'
[error] Not a valid key: assembly
[error] assembly
```

The generated `build.sbt` declares a multi-module Scala build and ScalaTest, but
does not add `sbt-assembly`. The template authority declares `fat_jar: true` and
`spark_submit_compatible: true`, and normalization/project-profile inference
therefore admits `sbt clean assembly` as the build execution contract.

## Prior-Run Baseline

The prior data-mapper runs show that this is not a one-off test40 artifact.

`data_mapper.test35` is still the strongest single-shot realization baseline:

- `sbt test` still passes locally
- 105 main Scala files and 35 Scala test/support files are present under the
  governed Scala tenant
- release/test execution surfaces record `execution_evidence_recorded` /
  `execution_evidence_present`
- 33 governed JUnit report files are present from the test run
- the run archive records 181 ScalaTest methods passed across 33 suites

But test35 is not proof of the fat-JAR build contract:

- `sbt clean assembly` fails with `assembly` not a valid SBT task
- `project/plugins.sbt` is absent
- the run reached release/test execution proof, not the modern operational
  build-result edge family that test40 now traverses

`data_mapper.test38` is the strongest build-tooling precedent:

- `project/plugins.sbt` declares `sbt-assembly`
- `sbt clean assembly` makes `assembly` a valid task and builds several module
  jars
- the run still fails assembly on duplicate
  `META-INF/versions/9/module-info.class` entries from `bcprov-jdk18on` and
  `snakeyaml`
- this points to a missing generated `assemblyMergeStrategy`, not merely a
  missing plugin

`data_mapper.test40` combines the newer odd_sdlc operational traversal with a
minimal generated Scala tenant:

- generated tests compile and pass under `sbt test`
- no generated `sbt-assembly` plugin is present
- final odd_sdlc gaps report zero even though the admitted build contract fails

The fix should therefore learn from both successful prior lines:

- test35: do not regress real test-source and execution-evidence discipline
- test38: regenerate the build plugin/task shape, then close the merge-strategy
  gap so the declared assembly command exits 0
- test40: keep the modern operational edge family, but make build-result
  convergence depend on executed contract evidence

## Root

There are two coupled defects:

1. the Scala tenant generator does not materialize the build plugin/task required
   by the admitted build execution contract
2. operational build-result convergence is satisfied by generated surface shape,
   not by executed command evidence or an explicit open blocked state

The prior-run comparison refines the first defect: merely adding
`sbt-assembly` is insufficient. test38 proves the task becomes available but can
still fail without merge strategy. The generated build must encode the runnable
fat-JAR contract, not just the plugin reference.

The second defect is the release-blocking one. Even if the missing plugin is
fixed, operational convergence must remain impossible when declared execution
evidence is absent or failed.

## Closure

Closed by the B-065 realization change in the odd_sdlc Python tenant.

Implemented behavior:

- generated Scala/SBT tenants that declare `sbt clean assembly` or `fat_jar:
  true` now include `sbt-assembly`
- generated assembly settings include a merge strategy for
  `META-INF/versions/9/module-info.class`, all `META-INF`, and root
  `module-info.class`
- operational SBT dispatch runs from the governed code root instead of the
  workspace root
- `build_execution_result_surface` fulfillment is blocked when a declared
  build contract has no successful dispatch evidence
- failed build dispatch records `build_execution_contract_failed` and does not
  admit fulfilled build-result closure

Proof:

- source focused tests:
  `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_fd_evidence.py -k 'code_surface_construction_does_not_delete_tenant_governance_surfaces or declared_build_result_requires_successful_dispatch_evidence'`
  passed `2 passed, 26 deselected`
- clean sandbox:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test43`
- pre-dispatch public start stopped at
  `derive_build_execution_result_surface` with
  `build_execution_evidence_missing`
- generated `build_tenants/scala_spark/build.sbt` includes `sbt-assembly`
  settings and the merge strategy required by the prior test38 failure
- generated `build_tenants/scala_spark/project/plugins.sbt` declares
  `com.eed3si9n:sbt-assembly:2.1.5`
- direct declared build proof:
  `sbt clean assembly` exited `0` and built the root assembly jar plus module
  assembly jars
- direct declared test proof:
  `sbt test` exited `0` with `103` generated ScalaTest checks passing
- governed operational build dispatch recorded:
  lane `build`, contract `sbt clean assembly`, cwd
  `build_tenants/scala_spark`, exit code `0`, status `succeeded`
- governed operational test dispatch recorded:
  lane `test`, contract `sbt test`, cwd `build_tenants/scala_spark`, exit code
  `0`, status `succeeded`
- post-build/test `odd_sdlc gaps --scope workspace --workspace .` no longer
  reports build or test evidence as the frontier; it reports
  `prepare_deployment_surface`, `gap_count=5`, `mixed_truth_classes=false`

Residual:

- the current data_mapper RC gap after B-065 is deployment/runtime projection
  scope, not false build/test operational closure
- SBT prints a lint warning for `Global / autoStartServer`; the declared build
  and test commands still exit successfully
