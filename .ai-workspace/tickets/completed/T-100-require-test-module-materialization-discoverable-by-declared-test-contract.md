# T-100 — Require Test Module Materialization Discoverable By Declared Test Contract

status: completed
priority: high
change_class: requirement_reprice
re_entry_point: requirements
created: 2026-04-28T15:16:56Z
completed: 2026-04-28T15:16:56Z
owner: codex

## Claim

`derive_test_module_surface` must materialize tests that are discoverable by the
declared test execution contract.

The current TypeScript data_mapper run generated seven Scala test source files,
but they were plain `object ... { def main(...) }` programs. `sbt test` exited
0 while discovering zero tests. That means the test archive edge correctly
blocked, but the defect should have been caught earlier at the test module
materialization edge.

## First Missing Layer

Requirements.

`REQ-F-ODDSDLC-058` governs the test-run archive edge. It says zero observed
tests block archive closure. It does not yet require the upstream test module
edge to produce tests that the declared runner can discover.

## Evidence

External workspace:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`

Generated test files exist:

- `build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/CompilerModuleSurfaceSpec.scala`
- `build_tenants/scala_spark/cdme-assurance/src/test/scala/cdme/assurance/AssuranceModuleSurfaceSpec.scala`
- `build_tenants/scala_spark/cdme-executor/src/test/scala/cdme/executor/ExecutorModuleSurfaceSpec.scala`
- `build_tenants/scala_spark/cdme-adjoint/src/test/scala/cdme/adjoint/AdjointModuleSurfaceSpec.scala`
- `build_tenants/scala_spark/cdme-accounting/src/test/scala/cdme/accounting/AccountingModuleSurfaceSpec.scala`
- `build_tenants/scala_spark/cdme-fidelity/src/test/scala/cdme/fidelity/FidelityModuleSurfaceSpec.scala`
- `build_tenants/scala_spark/cdme-engine/src/test/scala/cdme/engine/EngineModuleSurfaceSpec.scala`

But the test archive retry stopped with:

- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T151211468Z_pid89422`
- postflight status: `blocked`
- blocking reasons:
  - `worker_report_unresolved_reasons_present`
  - `test_execution_zero_tests_observed`
- worker detail:
  `sbt test exited 0 ... but no governed test cases were observed`

The root build file has no discoverable test framework binding. The generated
test files are standalone main-style objects, not `sbt test` discoverable test
classes.

## Required Correction

Add a requirement, design rule, prompt contract, and deterministic postflight
gate:

- if a conformed project declares a test execution contract, generated tests
  must be discoverable by that contract
- for `sbt test`, standalone `main` objects are not sufficient test evidence
- when the current build config lacks a test framework binding, the worker must
  materialize or update build configuration and list it as `build_config`
- `derive_test_module_surface` must block with a typed reason when generated
  tests cannot be discovered by the declared runner

## Non-Goals

- Do not hard-code data_mapper modules.
- Do not make `derive_test_run_archive_surface` silently repair tests.
- Do not make `odd_sdlc` own downstream test semantics beyond discoverability
  under the declared contract.

## Closure Bar

This ticket closes when requirements, design, prompt generation, postflight
evaluation, and tests prove that non-discoverable test modules block before the
test-run archive edge.

## Closure Evidence

Changed authority surfaces:

- `specification/requirements/14-odd-sdlc-installed-product-contract.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`

Changed realization surfaces:

- `build_tenants/typescript/code/src/operator/handoff.ts`
- `build_tenants/typescript/code/src/shared/blocking_reason.ts`
- `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
- `build_tenants/typescript/package.json`

Implemented behavior:

- worker prompts for `test_module_surface` now require generated tests to be
  discoverable by the declared test execution contract
- for `sbt test`, the prompt forbids standalone `object/main` tests as closure
  evidence
- postflight now emits `test_materialization_not_discoverable` when SBT test
  files lack a discoverable framework shape or the tenant build config lacks a
  test framework binding
- the existing installed data_mapper scripted fixture was updated to emit
  ScalaTest-style tests plus build config, proving the stricter contract remains
  satisfiable

Verification:

- `npm run test:t100`: passed, 10 tests.
- `npm run test:semantic`: passed, 139 tests.
- `npm run lint:semantic`: passed.

External failure addressed:

- workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`
- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T151211468Z_pid89422`
- observed defect:
  `sbt test` exited 0 but discovered zero tests because generated test files
  were not discoverable by the declared runner.

This closes the immediate defect class. Future runs should fail earlier at
`derive_test_module_surface` if a worker emits the same non-discoverable test
shape.
