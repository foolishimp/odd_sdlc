---
id: T-202
title: Project ABG consequence traversal catalog onto SDLC overlays
type: feature
ticket_category: consequence_traversal_algebra
status: completed
review_status: closed
proof_status: overlay_catalog_projection_live_builder_proven
goal: sdlc-overlays-declare-the-abg-admitted-consequence-traversal-options-for-each-edge
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Consume the ABG T-156 consequence allowed traversal catalog from SDLC graph
  overlays. SDLC overlays should declare, per selected overlay edge or graph
  function route, which consequence traversal families are lawful. The
  SDLC-owned consequence plugin remains the product policy selector, but it may
  select only from the ABG-provided catalog for the current edge.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-06-15
created_at: 2026-06-15
updated_at: 2026-06-15
governance_scope: STDO Method
migration_strategy: inside_out_additive_sibling
library_usage: extend
source_ticket: /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-156-admit-consequence-allowed-traversal-catalog.md
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DEPTH_TRAVERSAL_FUNCTION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - .ai-workspace/tickets/completed/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/completed/T-200-implement-depth-traversal-function-and-decomposition-trace-foldback.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-156-admit-consequence-allowed-traversal-catalog.md
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/design/M03_CONSEQUENCE_ALLOWED_TRAVERSAL_CATALOG_DERIVATION.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/completed/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/completed/T-200-implement-depth-traversal-function-and-decomposition-trace-foldback.md
  - .ai-workspace/tickets/backlog/T-201-prove-single-node-smoke-optimising-specialization.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-156-admit-consequence-allowed-traversal-catalog.md
dependencies:
  - ABG T-156 exposed through a released abiogenesis TypeScript tenant snapshot
  - SDLC substrate pin migrated to the ABG release containing T-156
affected_boundary:
  - specification/PRODUCT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DEPTH_TRAVERSAL_FUNCTION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md
  - build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md
  - build_tenants/typescript/package.json
  - build_tenants/typescript/package-lock.json
  - build_tenants/typescript/code/src/graph/overlays.ts
  - build_tenants/typescript/code/src/graph/optimising_overlay.ts
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
excluded_boundary:
  - ABG runtime event, replay, construction intent, graph re-entry, or closure ownership
  - SDLC-local cursor movement, retry loops, recursive controllers, or ticket creation triggers
  - treating overlay annotations as execution authority
  - making `.ai-workspace/tickets` storage an ABG substrate target
target_truth: >-
  SDLC graph overlays declare allowed consequence traversal families and route
  constraints as GTL declaration inputs consumed by ABG T-156. On each edge,
  ABG provides `allowedConsequenceTraversalCatalog` to `plugin.consequence.C`.
  The SDLC consequence plugin may use domain pressure, overlay policy, and
  strategy decisions to choose one catalog-admitted traversal family: same-edge
  retry, depth/zoom traversal, graph-span re-entry, public-start re-entry,
  ticket traversal, F_H/escalation/reprice, gap stop, or non-admit. ABG admits
  the selection and owns construction projection, runtime transition, re-entry,
  events, replay, and stop truth.
superseded_truth: >-
  SDLC consequence selection is a product-local switch that can choose depth or
  ticket traversal independently of the current GTL edge declaration; overlay
  annotations directly trigger tickets, zoom, cursor movement, or closure; or
  depth traversal and ticket traversal remain separate pipelines.
closure_law: >-
  Close only when SDLC overlays publish per-edge allowed consequence traversal
  declarations into GTL, consequence.C reads the ABG-provided catalog for the
  current edge before selecting, depth and ticket selections are siblings under
  the same admitted catalog pipeline, annotation-only effects are rejected, and
  focused plus live proof show the deep/data-mapper route can select depth for
  code/test build edges without SDLC owning runtime execution.
evaluation_criteria:
  - overlay declarations are product policy inputs to ABG catalog construction, not execution triggers
  - current-full remains the generic baseline; deep overlay remains additive and can declare depth traversal only where proportionate
  - ticket workflow overlay declares ticket traversal as a product route, not storage mutation
  - consequence.C consumes `allowedConsequenceTraversalCatalog` from ABG plugin input and rejects selections absent from that catalog
  - same-edge retry, depth traversal, ticket traversal, gap stop, and non-admit share one SDLC selection path into ABG T-156
  - graph functions remain the constructive carrier; graph vectors remain internal unless paired with admitted graph-function/re-entry/zoom authority
  - query-domain and optimizer projections expose catalog availability as read models only
  - generated sandbox product defects create SDLC ticket/retry pressure through the declared ticket traversal route rather than outside-in sandbox patching
proof_surface:
  - design update showing overlay-to-GTL declaration mapping for ABG T-156 keys
  - focused overlay catalog tests proving current-full, deep, ticket-workflow, and lite overlays declare only their lawful families
  - focused consequence tests proving catalog-present selection succeeds and catalog-absent selection blocks
  - negative tests for annotation-only ticket creation, relative vector cursor, bare vector target, and product-local recursive controller behavior
  - ABG conformance/typecheck proof against the new overlay declarations
  - live deep/data-mapper builder proof after the ABG release containing T-156 is pinned
non_closure_conditions:
  - consequence.C selects depth, ticket, retry, or stop from an SDLC-local switch without checking the ABG catalog
  - overlay annotation presence alone creates a ticket, invokes a worker, moves a vector cursor, writes a ledger, or closes work
  - ticket traversal targets `.ai-workspace/tickets` storage directly instead of a product-declared graph function or asset route
  - current-full overlay is mutated to force depth instead of using the deep sibling overlay
  - public start or query-domain becomes route authority for dynamic traversal selection
  - tests prove synthetic catalog objects but not actual overlay-derived GTL declarations
  - any "temporary" exception lets consequence.C select a traversal family without an ABG-provided catalog row
  - SDLC remains pinned to an ABG release that does not expose T-156
  - installed consequence.C keeps a local family switch instead of deriving eligibility from `EnginePluginInput.allowedConsequenceTraversalCatalog`
---

# T-202: ABG Consequence Traversal Catalog On SDLC Overlays

## STDO Triage

First missing layer: design.

ABG T-156 introduces the generic allowed consequence traversal catalog. The
SDLC forward gap is to project that generic substrate onto SDLC overlays. The
overlay remains the product route and policy surface; ABG owns admission and
runtime.

The intended shape is:

```text
SDLC overlay edge policy
  -> GTL declaration rows for allowed consequence traversal families
  -> ABG EnginePluginInput.allowedConsequenceTraversalCatalog
  -> SDLC consequence.C selects one declared family
  -> ABG admits selection against catalog
  -> ABG construction/re-entry/runtime/terminal truth
```

This ticket does not make annotations active. An annotation may permit or rank a
family. It cannot itself create tickets, zoom, move cursors, invoke workers, or
close a traversal.

## Required Design

The design must update the existing overlay design, not create a second overlay
system. It should specify:

- which overlay fields or annotation rows declare allowed consequence traversal
  families
- how those declarations lower into GTL declaration keys consumed by ABG T-156
- how `overlay://odd-sdlc/current-full-traversal`,
  `overlay://odd-sdlc/deep-sdlc-traversal`, lite overlays, and
  ticket-workflow overlays differ
- how consequence.C distinguishes policy selection from ABG admission
- how query-domain exposes catalog availability without making it route
  authority

## Required Overlay Edge Declaration Matrix

T-202 must make the edge targets explicit. "Annotated overlay" means the
overlay definition publishes declaration rows that lower into GTL attributes
for the graph function or graph vector currently being run. The annotation is
not the trigger. The only runtime trigger is ABG deriving
`allowedConsequenceTraversalCatalog` from GTL declarations and admitting the
selected `ConsequenceTraversalAction` against that catalog.

The ABG declaration keys are:

- `abg.consequence.allowed_traversal_families`
- `abg.consequence.allowed_traversals`

The SDLC overlay declaration row must lower to ABG
`AllowedConsequenceTraversalRow` fields: `traversalFamily`,
`allowedActionKinds`, `allowedGraphFunctionRefs`,
`allowedTraversalTargetRefs`, `requiredAuthorityRefs`,
`proportionalityBasisRefs`, and `declarationSourceRefs`.

Initial target matrix:

| overlay | edge/function targets | allowed families | route constraints |
| --- | --- | --- | --- |
| `overlay://odd-sdlc/current-full-traversal` | every selected full traversal graph function | `same_edge_retry`, `gap_stop`, `non_admit` | baseline only; no depth row on this overlay |
| `overlay://odd-sdlc/current-full-traversal` | code/test/review pressure functions: `derive_component_code_surface`, `qualify_component_realization_surface`, `derive_code_surface`, `derive_test_design_surface`, `derive_component_test_surface`, `prepare_test_execution_surface`, `derive_test_execution_result_surface`, `qualify_component_test_execution_surface`, `derive_component_repair_schedule_surface`, `derive_test_run_archive_surface` | `ticket_traversal` | target must be a product route: `asset:ticket/...`, `ticket-route:...`, `graph-function:route_ticket_work_item`, or `published-traversal-target:...`; direct `.ai-workspace/tickets` storage is forbidden |
| `overlay://odd-sdlc/deep-sdlc-traversal` | same code/test/review pressure functions listed above | `depth_traversal`, `ticket_traversal`, `same_edge_retry`, `gap_stop`, `non_admit` | `depth_traversal` must cite `Fg_decompose_depth_between_nodes`, the deep overlay annotation ref, the selected graph function, the selected graph vector, and a refinement/candidate/published traversal target authority; it is not a local cursor |
| `overlay://odd-sdlc/lite-design-module-implementation` | `lite_design_module_implementation`, `derive_lite_design_adr_surface`, `derive_lite_component_code_surface`, `prepare_test_execution_surface`, `derive_test_execution_result_surface` | `same_edge_retry`, `graph_span_reentry`, `public_start_reentry`, `ticket_traversal`, `gap_stop`, `non_admit` | `graph_span_reentry` is limited to declared repair routes such as test-execution-failed to component-code; `public_start_reentry` is limited to declared continuation into `overlay://odd-sdlc/current-full-traversal`; `ticket_traversal` uses the product ticket route only |
| `overlay://odd-sdlc/framework-smoke-min-fp` | `framework_smoke_min_fp`, `derive_lite_design_adr_surface`, `derive_lite_component_code_surface`, `prepare_test_execution_surface`, `derive_test_execution_result_surface` | `same_edge_retry`, `graph_span_reentry`, `gap_stop`, `non_admit` | repair re-entry is limited to the declared test-execution-failed to component-code route; no depth row |
| `overlay://odd-sdlc/ticket-workflow` | `route_ticket_work_item` | `same_edge_retry`, `public_start_reentry`, `gap_stop`, `non_admit` | this overlay is the product route after ticket traversal selection; it does not recursively create tickets unless a later declared row explicitly permits it |
| `overlay://odd-sdlc/bootstrap-requirements` | `Fg_conform_project`, `bootstrap_requirements` | `same_edge_retry`, `public_start_reentry`, `gap_stop`, `non_admit` | public-start reentry is limited to declared next-eligible overlays |
| `overlay://odd-sdlc/solution-architecture` | `solution_architecture` | `same_edge_retry`, `public_start_reentry`, `gap_stop`, `non_admit` | public-start reentry is limited to declared next-eligible overlays |

No overlay edge may receive `depth_traversal` merely because the overlay has a
depth annotation. The declared row must be present on the current ABG edge, and
ABG must provide that row back through the catalog before consequence.C can
select it.

## Consequence.C Design

The SDLC consequence plugin remains product-owned, but its traversal selection
authority is read-only and catalog bounded.

Required algorithm:

```text
input: EnginePluginInput, admitted SDLC replay/projection/read-model state

catalog = input.allowedConsequenceTraversalCatalog
eligibleFamilies = catalog.rows.traversalFamily

derive product pressure from admitted ledgers, closure decisions, strategy rows,
overlay binding, decomposition trace state, ticket workflow admission, and
review-grade evidence

rank desired family:
  1. depth_traversal when residual feature-depth pressure is present,
     selected overlay is deep-sdlc-traversal, selected edge is one of the
     code/test/review pressure targets, and the catalog contains a matching row
  2. ticket_traversal when admitted review-grade or retry-exhaustion pressure
     says generated-product defects must become governed ticket work and the
     catalog contains a product-route row
  3. graph_span_reentry or same_edge_retry only when a declared repair route
     and matching catalog row exist
  4. public_start_reentry only for declared next-eligible overlay continuation
  5. gap_stop or non_admit only when the catalog declares the terminal family

if desired family is absent from catalog:
  return blocked/non-admitted consequence evidence with no traversalAction

if selected:
  construct ConsequenceTraversalAction with explicit selectedTraversalFamily
  include only product refs as selection/proportionality evidence
  pass action through ConsequenceProjectionOutcome.traversalAction
  rely on ABG admission, construction projection, runtime transition, events,
  replay, and terminal truth
```

Consequence.C must not:

- infer permission from overlay annotation presence
- synthesize catalog rows
- target bare graph vectors without graph-function/re-entry/zoom authority
- use relative cursors such as `-2`
- write tickets or mutate `.ai-workspace/tickets` storage
- invoke workers, emit runtime events, write ledgers, or close work
- fall back to a local switch when the ABG catalog is absent or empty

## Current Review Findings

Review date: 2026-06-15.

T-202 is not fully ABG-compliant yet. The following are blockers, not accepted
exceptions or tech debt:

1. The installed `consequence.C` path must continue to return traversal
   selections only through `ConsequenceProjectionOutcome.traversalAction` after
   the active edge's ABG-derived
   `EnginePluginInput.allowedConsequenceTraversalCatalog` admits the selection.
2. Overlay annotations may remain product policy and proportionality evidence
   only. Their executable effect is the GTL declaration row lowered for the
   current graph function/vector and then re-derived by ABG T-156.
3. Depth binding must continue to carry explicit `selectedTraversalFamily =
   depth_traversal` and fail closed when the overlay-scoped ABG catalog has no
   matching row.

There are no lawful permanent exceptions. Closure requires one ABG truth:
GTL declarations -> ABG catalog -> SDLC selection over that catalog -> ABG
admission/execution/replay/terminal truth.

## Current Proof

2026-06-15 substrate pin proof:

- ABG `@abiogenesis/typescript-tenant@4.0.0-rc.21` is released from
  `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.21/`.
- rc21 includes ABG T-156 static `typecheckGtlProgram(...)` validation for
  `abg.consequence.allowed_traversal_families` and
  `abg.consequence.allowed_traversals`.
- `odd_sdlc.TS` dependency, package lock, product substrate text, and substrate
  contract now target rc21.

2026-06-15 overlay catalog implementation proof:

- `graph/module.ts` lowers SDLC overlay policy into ABG
  `abg.consequence.allowed_traversals` GTL graph-vector declarations. The
  lowering decorates the constructed SDLC GTL module, so ABG conformance sees
  the same declarations the runtime catalog derives.
- `graph/overlays.ts` exposes `allowedConsequenceTraversalDeclarations` as a
  read-only overlay projection derived from the ABG catalog rows, not as a
  second route-authority surface.
- `operator/traversal_consequence.ts` and `operator/installed_operator.ts`
  construct depth traversal actions with explicit `selectedTraversalFamily`,
  published traversal targets, and overlay-scoped ABG catalog admission before
  returning `traversalAction`.
- `test_t202_consequence_traversal_overlay_catalog.test.mjs` proves
  current-full baseline/ticket rows, deep depth/ticket rows, ticket-workflow
  non-recursive rows, real GTL declaration derivation, catalog-present
  selection admission, catalog-absent selection rejection, and current SDLC GTL
  typecheck.
- `npm run test:semantic` passes 1042/1042 after the implementation and
  closure-guard expansion.

2026-06-15 live builder proof:

- `npm run test:t200:hello-world-js-zoom-live` passes after the SDLC
  design-depth evaluator accepts/canonicalizes numeric tranche ids from live
  builder output.
- `npm run test:t200:rust-detailed-live` passes against the installed surface.
- `npm run test:t200:data-mapper-detailed-live` passes as a builder proof:
  deep overlay execution drives the data-mapper component-code edge through
  repeated governed builder retries, then preserves the remaining external
  Spark/Hadoop-on-Java-25 proof block as ticket pressure instead of outside-in
  product patching.
- Data-mapper archive:
  `build_tenants/typescript/test_env/test_runs/data_mapper_deep_sdlc_detail_sandbox/20260614T231925200Z_pid90843/run_summary.json`.
- Final component-code review assessment:
  `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260615T005410865Z_pid61394/review_grade_edge_fulfillment_assessment.json`,
  `status = blocked`, 170 reviewed findings. The block is external proof
  environment pressure: `Java 25/Spark-Hadoop runtime incompatibility`.
- Terminal gap intake creates admitted tickets `asset:ticket/T-001` and
  `asset:ticket/T-002`, cites `requirement:REQ-F-ODDSDLC-034` and
  `requirement:REQ-F-ODDSDLC-035`, and records admitted execution contracts for
  both.
- Ticket route start
  `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260615T011409585Z_pid73323`
  executes `asset:ticket/T-001` through `overlay://odd-sdlc/ticket-workflow`
  and `route_ticket_work_item`; the start projection is `status = converged`,
  `nextLawfulAction = disposition://close`, `productConverged = false`.
- Ticket-route review assessment records 162 reviewed findings: 38 fulfilled
  route obligations and 124 lawful `downstream_deferred` partials preserved for
  `asset:ticket/T-002`. This is the intended builder-of-builder result, not a
  generated data-mapper product completion claim.

2026-06-15 SDLC builder bugs fixed during live proof:

- `component_depth_register.ts` now canonicalizes live numeric `trancheId`
  values into string ids and keeps `null` legal; prompts now state the
  target-carrier contract explicitly.
- Review-grade downstream carryover no longer forces same-edge retry churn when
  all remaining open obligations are `requirement_carried_for_downstream_closure`.
- Terminal gap ticket intake now admits assessment-invalid or environment-only
  residuals that lack product requirement refs by attaching governed SDLC
  workflow requirement refs `REQ-F-ODDSDLC-034` and `REQ-F-ODDSDLC-035`.

Current closure finding:

- T-202 is complete. The ABG catalog is the single traversal-eligibility truth;
  SDLC overlays lower policy into GTL declarations, consequence.C selects only
  against the ABG-provided catalog, and live builder proof shows depth and
  ticket traversal use the same admitted path without SDLC runtime authority or
  outside-in generated-product patching.

## Work Ledger

| id | task | proof | status |
| --- | --- | --- | --- |
| D0 | Pin SDLC to ABG rc21 containing T-156 static compiler validation. | package dependency, substrate contract, product text, and identity tests name `@abiogenesis/typescript-tenant@4.0.0-rc.21`. | done |
| D1 | Update overlay design with T-156 declaration mapping and the exact overlay edge matrix. | `ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md` explains overlay rows -> GTL declarations -> ABG catalog and names the graph-function targets for current-full, deep, lite, framework-smoke, bootstrap, solution-architecture, and ticket-workflow overlays. | done |
| D2 | Add overlay carrier fields for allowed consequence traversal families and route constraints. | `SdlcTraversalOverlay.allowedConsequenceTraversalDeclarations` projects ABG-derived rows as read-only overlay data; focused tests prove current-full, deep, and ticket-workflow family availability and absence. | done |
| D3 | Lower overlay declarations into GTL graph-function/vector declarations. | `graph/module.ts` decorates the current SDLC GTL module with ABG T-156 declaration rows; focused tests prove declarations appear on intended deep/current-full code/test edges and not on unrelated vectors. | done |
| D4 | Make SDLC consequence.C consume the ABG-provided catalog when constructing traversal action bindings. | traversal binding admits against an overlay-scoped `AllowedConsequenceTraversalCatalog`; focused tests prove catalog-present depth selection succeeds and current-full catalog absence rejects depth. | done |
| D5 | Preserve authority boundary. | implementation adds no SDLC runtime events, cursor moves, local loops, ticket storage mutation, or closure truth; T-162/T-165/T-197 regressions remain clean after the catalog gate. | done |
| D6 | Run focused regressions and ABG conformance/typecheck proof. | `npm run test:t202`, T-160/T-162/T-165/T-197/T-200 focused regressions, `npm run lint:test-harness`, `npm run lint:semantic`, and `npm run test:semantic` (1042/1042) pass. | done |
| D7 | Run live builder proof after substrate release pin. | JS zoom and Rust detailed live tests pass. Data-mapper detailed live runs the deep overlay, exercises component-code depth/retry, creates admitted terminal gap tickets for the remaining external proof block, and routes `asset:ticket/T-001` through the installed ticket-workflow overlay. | done |

## Closure Criteria

Close only when:

- the SDLC substrate pin consumes an ABG release that includes T-156
- overlay declarations are the sole SDLC source for allowed traversal families
- current-full remains baseline and deep overlay remains an additive sibling
- consequence.C reads and respects the ABG catalog for the current edge
- depth traversal and ticket traversal use the same selection/admission path
- ticket traversal routes through product graph-function or asset handles
- negative tests reject annotation-only execution, product-local switches,
  relative cursors, bare vector targets, and storage-target ticket traversal
- live data-mapper builder proof demonstrates depth selection for code/test
  build edges without outside-in sandbox product patching
