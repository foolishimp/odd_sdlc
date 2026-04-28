---
id: T-066
title: Refactor downstream materialization and closure evaluators over active design
type: feature
ticket_category: rc_blocker
status: completed
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Refactor the downstream materialization and evaluator implementation so it conforms to the active graph-function, hook, operator, and total-transition designs. The traversal must generate, evaluate, deepen, test, and qualify the target product implementation, not merely describe it.
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: installed operator handoff contract, graph-function catalog, implementation/code/test realization edges, downstream workspace write contract, capability inventory, behavioral test inventory, shallow-realization evaluators, governed execution evidence, ABG event/projection proof, data_mapper qualification lane
priority: critical
triaged_at: 2026-04-27T10:21:15Z
created_at: 2026-04-27T10:21:15Z
updated_at: 2026-04-28T00:00:00Z
completed_at: 2026-04-28T00:00:00Z
dependencies:
  - T-087 completed
  - T-088 completed
  - T-086 completed
  - T-069 completed
  - T-076 completed
  - T-085 completed
  - T-084 completed
  - T-072 consolidated
  - T-073 consolidated
  - T-074 consolidated
  - B-068 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: live installed `data_mapper.test46.ts` run on 2026-04-27 and operator correction that product-code materialization is the core reason for odd_sdlc existence.
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_HOOK_CONTRACTS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_BLOCKING_REASON_CARRIERS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_INTENT_PACKAGE.md
active_module_refs:
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/hooks/
  - build_tenants/typescript/code/src/operator/
target_truth: odd_sdlc.TS materializes downstream product source, tests, capability inventory, behavioral test inventory, and governed execution proof through graph-function-owned realization edges, with generated files and evaluator results feeding the active total transition function as typed pass, gap, retry, reprice, or close state.
superseded_truth: a single generated runtime asset, non-empty file manifest, trace-bearing test shell, or file count is sufficient evidence that downstream product realization is complete.
closure_law: this ticket closes only when an installed independent data_mapper run creates non-trivial `build_tenants/<active_tenant>/` source and test files from graph-function traversal, derives capability and behavioral-test inventories from admitted truth, executes the declared downstream test contract, rejects shallow realization patterns, records ABG/runtime archive evidence, and emits all materialization/evaluator failures as typed gap pressure consumed by the total transition function.
evaluation_criteria:
  - `derive_code_surface` has an explicit realization-output contract that admits a downstream tenant root, file manifest, digests, and generated-source inventory
  - generated code is written under `build_tenants/<active_tenant>/` and not only under `.ai-workspace/runtime/odd_sdlc/assets`
  - generated tests are written under the same tenant proof/test surface and trace to requirements, scenarios, and module/design surfaces
  - capability inventory evaluates authority-to-code coverage
  - behavioral test inventory and execution evidence evaluate code-to-test coverage
  - shallow-realization evaluators reject placeholder source, constant-success logic, identity-only transforms, unused inputs, missing validation wiring, empty tests, trace-only tests, and zero-report execution
  - postflight rejects code/test realization edges when only markdown summary surfaces are produced
  - postflight and evaluator findings are admitted as typed gap evidence rather than terminal prose
  - ABG runtime events and odd_sdlc projections expose the generated file manifest as replayable evidence
  - live `data_mapper.test46.ts` or successor reaches a product-code inventory, behavioral-test inventory, execution-evidence surface, and cumulative obligation-closure surface sufficient to support or reprice the full operational RC claim
proof_surface:
  - implementation conformance note against active materialization/evaluator designs
  - installed operator handoff/archive proof
  - deterministic source/test/capability/shallow-evaluator checks
  - downstream execution report parser tests
  - live data_mapper run archive
  - T-041 RC blocker map update
non_closure_conditions:
  - `code_surface.md` exists but no tenant source files exist
  - generated files exist but required capability families are missing
  - generated tests exist but no governed execution dispatch occurs
  - execution reports are absent, zero-count, failed, or not parsed
  - shallow findings are warnings only
  - generated files are created by ad hoc script outside graph-function/ABG authority
  - postflight still labels a single markdown surface as product-code materialization
  - evidence is based only on source-tree unit tests without an installed independent workspace run
---

## STDO Triage

First missing layer: product definition.

The current product claim distinguishes bounded TypeScript package RC from full
operational replacement, but the live run shows a sharper product-level gap:
the TypeScript line can operate as a governed surface traversal engine while
not yet acting as an SDLC capable of constructing the downstream product.

This must not be patched as a larger prompt alone. The graph program, handoff
manifest, postflight law, evaluator surfaces, and archive projection already
have active design authority; this ticket refactors implementation and proof to
conform to that authority.

## Dependency Correction

T-041 is the full operational RC envelope and therefore depends on this ticket.
It is not a blocking dependency for this ticket. T-076 remains the prerequisite
for total-transition event/gap behavior consumed by this materialization and
evaluator refactor.

## Live Evidence

Independent workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts`

Installed run evidence:

- `derive_code_surface` archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T095902442Z_pid38741`
- output:
  `.ai-workspace/runtime/odd_sdlc/assets/20260427T095902442Z_pid38741/code_surface.md`
- source-tree check:
  `find build_tenants -maxdepth 4 -type f` failed because `build_tenants/`
  did not exist.

The run did produce useful upstream surfaces and advanced through multiple
vectors, but it did not generate the product implementation.

## Additional Live Evidence

The same installed run was repaired past two incidental blockers:

- `completed/T-067-repair-typescript-installed-operator-operation-type-propagation-for-qualification-edges.md`
- abiogenesis `completed/T-083-preserve-runtime-event-log-on-typescript-installer-refresh.md`

After those repairs, the graph converged:

- final archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T103548128Z_pid44432`
- final edge: `prepare_release_surface`
- `odd-sdlc-ts gaps --workspace .` reported `status: converged`
- closed vectors: `0..17`
- `find build_tenants -maxdepth 5 -type f` still failed with
  `find: build_tenants: No such file or directory`

This proves the defect is stronger than "the graph stopped before code." The
current graph can produce a release surface and converge without downstream
product source files. Full operational RC must reject that state.

## Design Notes

The likely carrier set is:

- `GeneratedProductFileManifest`
- `GeneratedProductFileDigest`
- `GeneratedProductSourceInventory`
- `GeneratedProductTestInventory`
- `RealizationOutputContract`
- `RealizationPostflightResult`

The materialization contract should be graph-function-owned and ABG-visible.
The F_P worker may construct files, but the allowed output roots, manifest
schema, target tenant root, and postflight rejection rules must be deterministic
and replayable.

## 2026-04-27 First Contract Slice

Implemented first deterministic product-materialization guard:

- `SdlcWorkerHandoffManifest` now carries
  `SdlcProductMaterializationContract`
- `code_surface` requires a materialized `source` file role
- `test_module_surface` requires a materialized `test` file role
- worker reports now carry `materializedFiles`
- postflight rejects required realization edges when the worker returns only the
  markdown surface
- constructor evidence now includes product materialization manifest and
  materialized product files

Focused verification:

- `npm run test:t066` passed, 2 tests
- `npm run test:t064` passed, 2 tests
- `npm run test:semantic` passed, 77 tests
- `npm run lint:semantic` passed
- `npm run test:sandbox` passed, 6 tests

Installed smoke verification:

- bad first smoke:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test47.ts`
  exposed that missing `selected_output_root` defaulted to
  `build_tenants/typescript` even with `active_tenant: scala_spark`
- fix:
  `workspace/project_constraints.ts` now derives default
  `selectedOutputRoot` as `build_tenants/<activeTenant>`
- clean smoke:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test48.ts`
  converged through vectors `0..17`
- source materialized:
  `build_tenants/scala_spark/src/main/scala/generated/DataMapper.scala`
- test materialized:
  `build_tenants/scala_spark/src/test/scala/generated/DataMapperSpec.scala`
- code archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T111948573Z_pid84859`
- test-module archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T111949264Z_pid84943`

This is not ticket closure. It prevents the specific false positive observed in
`data_mapper.test46.ts`, but full closure still requires a fresh installed
external data_mapper run that produces a non-trivial source/test inventory and
execution evidence under `build_tenants/<active_tenant>/`.

## 2026-04-27 Assurance Integration Slice

Claude review
`.ai-workspace/comments/claude/20260427T230000Z_REVIEW_active-tickets-and-assurance-ledger-wave.md`
correctly identified that the assurance ledgers existed but were not yet on the
installed operator traversal path.

Implemented integration:

- Added `ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`.
- Added `code/src/operator/assurance_gate.ts`.
- Extended installed operator outcomes with `assuranceSatisfaction`.
- Wired materialization, shallow-realization, and declared capability ledgers
  into the operator after worker postflight and before hook postflight/edge
  closure.
- Hardened shallow realization so constant-success test assertions are rejected
  as shallow proof, not accepted as behavioral tests.
- Assurance fold failures now create `assurance_postflight.json`,
  `postflight_gap_dossier.json`, runtime retry/continuation events, and
  same-edge retry pressure.
- Hook-postflight failures now use the same gap/event path rather than
  returning archive-only failure.
- T-066 now has an operator-level negative test where tenant-root source
  materialization passes path/digest postflight but shallow placeholder source
  fails closure and keeps `derive_code_surface` open.
- T-066 now has an operator-level negative test where source materialization
  passes path/digest and shallow checks but fails declared capability evidence,
  producing capability gap pressure.
- T-066 now has a fresh installed `data_mapper` successor proof that advances
  with the installed command through code and test materialization, producing
  tenant-root source and test files with `close_allowed` assurance status, then
  admits a test-run archive with structured non-zero execution evidence.
- T-066 now rejects `test_run_archive_surface` when execution evidence is
  missing, zero-count, failed, command-mismatched, or report-ref-free.

Focused verification:

- `npm run test:t066` passed, 6 tests
- `npm run test:t077-t083` passed, 14 tests
- `npm run test:t064` passed, 2 tests
- `npm run test:t069` passed, 3 tests
- `npm run test:t076` passed, 2 tests
- `npm run lint:semantic` passed
- `npm run test:semantic` passed, 113 tests

Residual scope:

- Fresh installed external data_mapper run still must prove non-trivial
  live external execution evidence before T-066 can close.
- Full behavioral test execution/report parsing remains part of this ticket's
  closure bar through consolidated T-073.

## 2026-04-27 T-068 Correction

Operator review found that this ticket's first slice still attached product
materialization too late. The lawful bootstrap is:

```text
{ documents } -> conform project -> graph program execution
```

`T-068` owns the missing conform-project profile. T-066 remains the downstream
materialization ticket.

## 2026-04-28 Project Induction Blocker

Fresh `data_mapper.test51.ts` evidence repriced the blocker earlier than
downstream materialization. The TypeScript line entered downstream traversal
without first conforming the imported workspace into spec_method topology:

- no `specification/PRODUCT.md`
- no `specification/GOALS.md`
- no `specification/requirements/`
- no `specification/scenarios/`
- no `build_tenants/TENANT_REGISTRY.md`

`T-087` now blocks this ticket. Product-code materialization cannot be judged
until `{ documents } -> Fg_conform_project[F_D] -> Project` is implemented and
downstream traversal is gated on passed project conformance.

After T-087, T-066 remains the downstream product-file postflight guard. It
must not be cited as generic project conformance or as data_mapper
qualification by itself.

## Consolidated Scope

`T-072`, `T-073`, and `T-074` are consolidated into this ticket. They are
materialization evaluator slices over the active design, not separate active
design tickets.

## 2026-04-28 STDO Re-Triage: Cumulative Traversal Obligation Contract

First missing layer: requirements.

Problem statement:

Product realization can generate files and still be unlawful if the traversal
does not carry the full obligation chain for the edge being closed. The current
artifact is not the whole closure basis. Requirements, design/module authority,
prior edge evidence, retry gaps, runtime contexts, and current delta state are
part of the graph-function result surface.

Required solution surface:

`TraversalObligationContext` is a manifest-carried carrier for one
graph-function edge. It contains:

- source asset types and target asset type
- requirement authority references
- design and module authority references
- prior edge evidence references
- runtime context references
- retry gap dossiers
- current delta summary
- declared obligations derived from those surfaces

`SdlcWorkerResultReport` must assess every declared obligation. The installed
operator may not close a product-realization edge unless deterministic
assurance folds worker assessments, materialized evidence, requirement
fulfillment, prior-gap carry, and shallow-realization checks into `close`.

The TypeScript line had pieces of that model, but the installed operator
handoff still lacked the cumulative traversal obligation context and the
assurance gate did not require worker-declared fulfillment of that context
before closing a product-realization edge.

This ticket now includes the governed translation:

- update `REQ-F-ODDSDLC-053` and `REQ-F-ODDSDLC-055` so handoff manifests and
  result ingestion explicitly carry and evaluate cumulative traversal
  obligations
- update `ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md` to define
  the cumulative obligation contract as current design, not historical story
- add `SdlcTraversalObligationContext` to the worker handoff manifest
- add worker obligation assessments as the explicit fulfillment assessment
  surface
- fold requirement fulfillment and retry-obligation carry into the installed
  operator assurance gate before edge closure

Non-closure condition added:

- convergence where generated files exist but the worker did not assess the
  cumulative requirement/design/module/prior-edge obligation context is not
  sufficient product-realization closure.

Focused verification:

- `npm run test:t066` passed, 7 tests
- `npm run test:t076` passed, 2 tests
- `npm run test:t077-t083` passed, 14 tests
- `npm run test:t084` passed, 8 tests
- `npm run lint:semantic` passed
- `npm run test:semantic` passed, 114 tests

## 2026-04-28 T-087/T-088 Integration

Project induction is now an explicit predecessor to downstream realization.

The installed data_mapper successor proof was updated so `Fg_conform_project`
runs before `bootstrap_release_self_test` when the imported workspace lacks
spec_method topology. After induction, `derive_code_surface`,
`derive_test_module_surface`, and `derive_test_run_archive_surface` continue
to materialize source, tests, and execution evidence through the installed
operator path.

The handoff manifest now carries `SdlcTraversalIntentPackage`, which gives the
worker a typed cumulative pressure surface rather than relying on prompt prose.

Verification:

- `npm run test:t066` passed
- `npm run test:t076` passed
- `npm run test:t087` passed
- `npm run test:t088` passed

## 2026-04-28 Closure

Closed after the dependency chain became explicit and green:

- `T-087` gates downstream traversal behind project induction.
- `T-088` admits one typed cumulative traversal intent package before worker
  archive creation.
- `T-086` promotes postflight, gap, summary, and install failures into typed
  blocking-reason carriers.

Realized proof:

- downstream product source files are materialized under the selected tenant
  root
- behavioral test inventory and execution evidence are materialized and
  postflight-checked
- shallow source, missing capability evidence, and unassessed traversal
  obligations block closure
- failed code materialization enters ABG retry truth and same-edge re-entry
  carries prior gap refs through the intent package
- installed data_mapper successor materializes product source and behavioral
  test inventory through the installed operator path

Final verification:

- `npm run lint:semantic` passed
- `npm run test:t066` passed
- `npm run test:t076` passed
- `npm run test:t086` passed
- `npm run test:t087` passed
- `npm run test:t088` passed
- `npm run test:semantic` passed, 121 tests

The remaining full operational RC claim is intentionally left to `T-041`.
