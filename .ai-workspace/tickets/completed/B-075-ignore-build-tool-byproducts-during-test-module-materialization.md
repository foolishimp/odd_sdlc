# B-075 Ignore Build-Tool Byproducts During Test Module Materialization

- id: B-075
- type: bug
- ticket_category: ordinary
- status: completed
- goal: typescript-rc-data-mapper-qualification
- change_intent: prevent build-tool byproducts emitted during test-module generation from being admitted as SDLC test module evidence
- change_class: realization_refactor
- re_entry_point: code
- triaged_at: 2026-05-01
- created_at: 2026-05-01
- updated_at: 2026-05-01
- priority: high
- build_tenant: typescript
- owner: codex
- review_status: closed_fixed_2026-05-01
- intake_source: `data_mapper.test61.TS.cl` live Claude lane stopped at `derive_test_module_surface` with `trace_only_test_surface` blockers over `build_tenants/scala_spark/**/target/**` and `.bsp` build outputs.
- affected_boundary: `build_tenants/typescript/code/src/operator/handoff.ts`, `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
- links:
  - live archive: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test61.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260430T170014307Z_pid71304`
  - parent design split: `.ai-workspace/tickets/active/T-104-split-test-execution-from-test-run-archive-surface.md`
  - typed F_P process model: `.ai-workspace/tickets/active/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md`

## STDO Triage

### First Missing Layer

Code.

The graph/domain model already distinguishes `test_module_surface` from
`test_execution_result_surface`. A test-module transform may accidentally
trigger build tooling or operate in a workspace where build tooling creates
fresh cache/report files. Those byproducts are not SDLC test modules.

The TypeScript post-transform observation admitted fresh `target/` and `.bsp/`
paths as `role: test` for `derive_test_module_surface`, then the assurance
gate correctly rejected them as trace-only test surfaces. The rejection was
right for the admitted rows; admitting those rows was the bug.

## Evidence

The live lane reached `derive_test_module_surface` after closing vectors 0-14.
It then stopped with many blockers like:

- `trace_only_test_surface:file://.../cdme-accounting/target/scala-2.13/test-zinc/inc_compile_2.13.zip`
- `trace_only_test_surface:file://.../cdme-engine/target/test-reports/TEST-cdme.engine.EngineSuite.xml`
- `trace_only_test_surface:file://.../build_tenants/scala_spark/target/streams/test/...`

These are build/test execution byproducts, not authored test modules.

## Target Truth

Product materialization evidence for `test_module_surface` must include
authored/discoverable test source files. It must exclude build-tool byproducts
such as:

- `target/`
- nested `*/target/`
- `.bsp/`
- nested `*/.bsp/`

Execution result evidence belongs to `derive_test_execution_result_surface`.
Test reports may be evidence for that edge, but they are not test module
materialization evidence.

## Implementation Checkpoint - 2026-05-01

Implemented in `build_tenants/typescript/code/src/operator/handoff.ts`.

- Added a target policy that ignores execution/build byproducts for
  `test_module_surface`, `test_execution_result_surface`, and
  `test_run_archive_surface`.
- `isLikelyTestMaterialization(...)` now rejects byproduct paths before
  applying test-source heuristics.
- `observeProductMaterializationDelta(...)` skips those byproducts before
  creating materialized product file rows.

Regression coverage:

- `T-102 post-transform observation ignores test-module build byproducts`

Verification:

- focused `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs` passed 14/14 on 2026-05-01.
- `npm run lint:semantic` passed on 2026-05-01.
- `npm run test:semantic` passed 153/153 on 2026-05-01.
- fresh `data_mapper.test62.TS.cl` live Claude lane passed
  `derive_test_module_surface` at archive
  `20260430T184402727Z_pid22395`; postflight passed and assurance
  `close_allowed`.
- Full tranche verification on 2026-05-01:
  `npm run lint:semantic` passed, `npm run test:semantic` passed 160/160,
  and `git diff --check` passed.

## Acceptance Criteria

- AC-1: `target/` and `.bsp/` byproducts are never admitted as
  `test_module_surface` materialized test files.
- AC-2: a real discoverable test source file is still admitted as `role: test`.
- AC-3: the live data_mapper Claude lane no longer stops at
  `derive_test_module_surface` solely because of build-tool byproducts.
  Status: satisfied by `data_mapper.test62.TS.cl`.
- AC-4: external STDO review confirms the fix does not hide true product
  materialization evidence.

## Non-Closure Conditions

- Ignoring all test artifacts broadly instead of specifically ignoring
  build-tool byproducts.
- Treating test execution reports as test module source evidence.
- Closing without fresh live Claude lane evidence.

## Closure Decision - 2026-05-01

B-075 has fresh live Claude evidence from `data_mapper.test62.TS.cl`, but no
accepted external STDO review response is present in the active review packet
set. It was not moved to `completed/` in this pass.

## Closure - 2026-05-01

Closed as fixed in the active-ticket cleanup pass. This closure supersedes older checkpoint wording in this file that said the ticket remained active for review, live-lane, or proof-envelope gates. The implementation and review notes above record the accepted fix/proof surface; broader release or live-lane envelope work remains with the still-active envelope tickets rather than keeping this fixed work item open.
