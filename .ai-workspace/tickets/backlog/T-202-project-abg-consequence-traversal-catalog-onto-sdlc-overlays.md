---
id: T-202
title: Project ABG consequence traversal catalog onto SDLC overlays
type: feature
ticket_category: consequence_traversal_algebra
status: backlog
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
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DEPTH_TRAVERSAL_FUNCTION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md
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

## Work Ledger

| id | task | proof | status |
| --- | --- | --- | --- |
| D1 | Update overlay design with T-156 declaration mapping. | design explains overlay rows -> GTL declarations -> ABG catalog. | pending |
| D2 | Add overlay carrier fields for allowed consequence traversal families and route constraints. | carrier/admission tests reject unknown families, duplicate rows, storage-target ticket traversal, and annotation-only effects. | pending |
| D3 | Lower overlay declarations into GTL graph-function/vector declarations. | catalog/query tests prove declarations appear on the intended edge and not globally. | pending |
| D4 | Make SDLC consequence.C consume the ABG-provided catalog when constructing traversal action bindings. | tests prove catalog-present depth/ticket selection succeeds and catalog-absent selection blocks. | pending |
| D5 | Preserve authority boundary. | tests prove no SDLC runtime events, cursor moves, local loops, ticket storage mutation, or closure truth are introduced. | pending |
| D6 | Run focused regressions and ABG conformance/typecheck proof. | semantic build, focused T-202 tests, T-160/T-162/T-165/T-197/T-200 regressions, ABG gate. | pending |
| D7 | Run live builder proof after substrate release pin. | data-mapper builder route uses deep overlay for code/test build depth and creates lawful ticket pressure for generated-product defects. | pending |

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
