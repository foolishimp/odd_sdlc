# T-101 - Honor Retry-Eligible Worker Report Rejection In Autonomous Start Loop

status: completed
priority: high
change_class: requirement_reprice
re_entry_point: requirements
created: 2026-04-28T17:14:45Z
owner: codex
completed: 2026-04-28T17:26:23Z

## Claim

`start --until blocked` must continue when the operator emits retry/repair
runtime truth for a worker-report rejection.

`data_mapper.test56.ts` proved that the code edge can materialize non-trivial
tenant source files, but the worker timed out before writing the closed report
carrier. The operator correctly produced a gap dossier and retry/continuation
events, but the CLI autonomous loop stopped anyway.

## First Missing Layer

Requirements.

Current requirements define project induction, cumulative traversal pressure,
schedule surfaces, and worker report closure. They do not explicitly state that
the public autonomous loop must honor retry-eligible report-rejection outcomes
the same way it honors retry-eligible postflight failures.

## Evidence

External workspace:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test56.ts`

Final archive:

`.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T165931233Z_pid51489`

Observed facts:

- edge: `derive_code_surface`
- worker elapsed: `600011.3158749994ms`
- worker error: `spawnSync codex ETIMEDOUT`
- generated product files:
  - `build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/model/CoreModel.scala`
  - `build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/validation/TopologyCompiler.scala`
  - seven additional Scala module source files
  - `build_tenants/scala_spark/build.sbt`
  - `build_tenants/scala_spark/project/plugins.sbt`
  - `build_tenants/scala_spark/project/build.properties`
- missing carrier: `worker_result_report.json`
- emitted runtime events:
  `graph_call_opened -> frame_opened -> vector_traversal_planned -> vector_evaluated -> retry_repair_planned -> retry_attempt_opened -> continuation_terminated -> continuation_reopened`
- outcome `nextLawfulAction`: `retry_same_edge_with_gap_dossier`
- loop stopped by: `worker_report_rejected`

## Required Correction

Add requirement, design note, implementation, and tests proving:

- when `worker_report_rejected` has `nextLawfulAction:
  retry_same_edge_with_gap_dossier`, `start --until blocked` continues
- the next attempt receives the prior gap dossier through the existing
  traversal pressure path
- the loop stops only when retry policy no longer emits retry repair truth, a
  non-retryable worker/report failure occurs, a real blocked state occurs, or
  convergence occurs

## Non-Goals

- Do not treat a missing worker report as success.
- Do not bypass postflight admission.
- Do not increase the Codex timeout as the primary correction.
- Do not hard-code `data_mapper` behavior.
- Do not make `odd_sdlc` own downstream Scala semantics.

## Closure Bar

This ticket closes when semantic tests prove the autonomous loop retries a
retry-eligible worker-report rejection and stops only after the retry policy is
exhausted or the next attempt closes.

Live `data_mapper` rerun evidence should then show whether retry repair is
sufficient, or whether a separate tranche-selected materialization ticket is
needed.

## Closure Evidence

Implemented:

- `REQ-F-ODDSDLC-062` in
  `specification/requirements/14-odd-sdlc-installed-product-contract.md`
- autonomous-loop retry admission for `worker_report_rejected` with
  `nextLawfulAction: retry_same_edge_with_gap_dossier`
- T-101 fixture proving a missing worker report on `derive_code_surface` causes
  same-edge re-entry, and the second handoff receives a prior-gap obligation

Verification:

- `npm run test:t101`: 1 passed
- `npm run test:semantic`: 140 passed
- `npm run lint:semantic`: passed
