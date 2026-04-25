---
id: B-066
title: Close data_mapper deployment/runtime operational projection for RC
type: bug
ticket_category: ordinary
status: completed
goal: data-mapper-rc-operational-cycle-has-no-unresolved-projection-gap
change_intent: After B-065, clean data_mapper.test43 admits build and test execution evidence correctly. The remaining public gap frontier is `prepare_deployment_surface`, followed by deployment result, deployed environment, runtime observation, and retrofit projection surfaces. RC cannot claim full operational convergence while those declared capability surfaces remain open.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: release operational cycle projection surfaces after build/test evidence
priority: high
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
completed_at: 2026-04-25
dependencies:
  - B-065 completed
intake_source: observed clean data_mapper.test43 run after B-065 closure
target_truth: When deployment/runtime capabilities are declared, odd_sdlc must either materialize explicit pending-evidence projection surfaces with governed non-closure, or admit returned execution evidence. A clean RC traversal must not leave deployment/runtime projection gaps as generic missing generated surfaces.
superseded_truth: Build/test operational evidence can pass while deployment/runtime projection surfaces remain open as unpriced missing asset gaps.
closure_law: this ticket closes when a clean data_mapper template run after admitted build and test dispatch reaches either zero RC-blocking gaps for the declared operational cycle or a governed pending-evidence state whose remaining deployment/runtime non-closure is explicit, typed, and operator-facing.
evaluation_criteria:
  - `prepare_deployment_surface` materializes a governed surface from the declared `spark-submit` deployment contract
  - deployment result, deployed environment, runtime observation, and retrofit plan surfaces do not remain generic missing generated-file gaps
  - absent external deployment/runtime evidence is represented as governed pending evidence, not as false convergence
  - `odd_sdlc gaps --scope workspace --workspace .` reports the remaining deployment/runtime state in operator terms
  - build and test evidence admitted by B-065 remains preserved
proof_surface:
  - clean data_mapper template install: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test45`
  - governed build dispatch record for `sbt clean assembly`
  - governed test dispatch record for `sbt test`
  - post-dispatch gap dossier showing `gap_count=0`
non_closure_conditions:
  - deleting or weakening the declared deployment/runtime capability cues to force gap closure
  - claiming RC while deployment/runtime surfaces are missing without governed pending-evidence state
  - regressing the B-065 build/test evidence gate
---

## Closure Evidence

Clean `data_mapper.test45` was installed from the template and current
`odd_sdlc`. The release operational cycle now converges without running the
declared external deployment command locally.

- build lane: `sbt clean assembly`, binding `local_scala_sbt`, exit code `0`
- test lane: `sbt test`, binding `local_scala_sbt`, exit code `0`
- parsed JUnit report files: `14`
- tests observed: `103`
- failures observed: `0`
- errors observed: `0`
- deployment binding: `external_spark_submit`
- deployment result status: `pending_external_evidence`
- runtime observation status: `pending_external_evidence`
- runtime completion state: `construction_complete_pending_execution`
- retrofit action: `hold deployment/runtime closure until external execution evidence is returned`
- final gap summary: `gap_count=0`, `mixed_truth_classes=false`

## Sandbox Note

The first `data_mapper.test45` build dispatch attempts failed because the Codex
sandbox denies AF_UNIX socket creation, and sbt 1.11 opens a boot server socket
before loading the build. The same installed dispatcher succeeded when rerun
outside that sandbox. That failure is not a generated-code failure.
