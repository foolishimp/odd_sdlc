---
id: T-200
title: Implement depth traversal function and decomposition trace foldback
type: feature
ticket_category: implementation_migration
status: active
goal: residual-feature-depth-pressure-expands-into-admitted-child-graph-traversals
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Implement the depth traversal path split from T-165. Residual feature-depth
  pressure must become an admitted decomposition trace over existing graph
  nodes, child obligations, graph-function refs, evidence refs, closure
  criteria, and parent consolidation instead of remaining advisory review text
  or becoming an SDLC-local recursive controller.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-06-13
created_at: 2026-06-13
updated_at: 2026-06-13
activated_at: 2026-06-13
governance_scope: STDO Method
migration_strategy: inside_out_additive_sibling
library_usage: extend
governing_library:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
source_ticket: .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/07-asset-typing-and-binding.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md
  - .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/backlog/T-201-prove-single-node-smoke-optimising-specialization.md
  - .ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md
  - .ai-workspace/tickets/completed/T-199-data-mapper-code-depth-resume-proof.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-155-define-first-class-gtl-graph-function-zoom-plan.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/projection/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
excluded_boundary:
  - ABG graph-call, frame, event, continuation, projection, replay, or traversal authority
  - an SDLC-owned recursive controller, retry loop, cursor move, or event store
  - closing parent feature-depth pressure from command success alone
  - generated-sandbox patching as proof of product depth
target_truth: >-
  Residual feature-depth pressure can be escalated proportionally from simple
  traversal into an admitted depth traversal over existing graph nodes. The
  existing `overlay://odd-sdlc/current-full-traversal` remains the baseline full
  SDLC overlay. A sibling `overlay://odd-sdlc/deep-sdlc-traversal` carries the
  depth/decomposition annotation while preserving the same full traversal graph
  shape. The product overlay selects the domain-meaningful depth action, but
  ABG owns execution, graph-function zoom, graph-vector re-entry, child
  traversal events, replay, and closure foldback. Parent closure reads admitted
  child evidence and the decomposition trace register, not consequence prose.
superseded_truth: >-
  Feature-depth pressure may remain downstream-deferred review text, may close
  from successful build/test commands alone, or may be forced by an SDLC-local
  recursive loop instead of admitted ABG graph traversal.
closure_law: >-
  This ticket closes only when the TypeScript tenant publishes and tests a
  depth traversal graph-function path over existing graph nodes, admits a
  decomposition trace register, persists downstream-deferred review rows into
  that register, makes downstream design/build/test closure consume the child
  rows, rejects parent closure when requirement-bound tests/source refs/shards
  or admitted evidence are missing, proves the REQ-ENG-003 data-mapper
  regression cannot converge through command-only sbt evidence, and runs a live
  high-zoom proof showing ABG start/resume, child events, foldback, and parent
  consolidation.
evaluation_criteria:
  - `Fg_decompose_depth_between_nodes` is catalog-visible as a graph function over existing graph nodes
  - `sdlc_decomposition_trace_register` or an equivalent admitted carrier records parent/child obligations, owner edge, graph-function refs, closure criteria, evidence refs, and consolidation refs
  - downstream-deferred review rows are persisted into the register and are not left as advisory prose
  - design, build, and test edges consume register rows and block parent closure on untraced or open child rows
  - feature-depth closure rejects missing requirement-bound test rows, source test refs, execution shard refs, or admitted evidence
  - `SdlcTraversalStrategyDecision` can select simple traversal, depth traversal, simple-then-depth, depth-then-simple, or non-admit by proportionality
  - SDLC never executes the selected traversal locally; selected actions enter ABG through admitted construction/re-entry carriers
  - the data-mapper regression for `REQ-ENG-003` proves command-only `sbt test` evidence cannot close the feature obligation
  - live high-zoom proof records admitted strategy decision, depth traversal start/resume, child graph-function execution, child event/provenance capture, child closure fold, and parent consolidation
  - the deep SDLC overlay is a sibling of current-full, not a mutation of it; focused tests prove it duplicates current-full graph scope and carries the decomposition annotation
proof_surface:
  - design update for depth traversal graph function and decomposition trace register
  - focused carrier/admission tests for the register and depth outcome
  - focused consequence-to-depth traversal test using ABG runner consumption
  - data-mapper regression for REQ-ENG-003 command-only evidence rejection
  - live high-zoom proof archive
  - focused overlay/query-domain tests for the deep sibling overlay selection surface
non_closure_conditions:
  - downstream-deferred pressure is only summarized in comments, prompts, or review prose
  - parent closure ignores unclosed child obligation rows
  - command success is accepted without requirement-bound source test and admitted execution evidence
  - SDLC performs graph cursor movement, retry, recursion, or event emission locally
  - ABG/GTL gaps discovered by the high-zoom proof are hidden by SDLC workarounds
---

# T-200: Depth Traversal Function And Decomposition Trace Foldback

## STDO Triage

First missing layer: design.

T-165 implemented the optimising-overlay foundation and the lawful bridge from
SDLC consequence selection into ABI/ABG construction and graph-vector re-entry.
It did not implement the graph function that expands residual feature-depth
pressure into child obligations. This ticket owns that depth path.

The intended motion is:

```text
simple traversal
  -> residual feature-depth pressure
  -> Fg_decompose_depth_between_nodes
  -> child graph-function starts/resumes
  -> child closure evidence
  -> parent consolidation
```

The product may decide that depth is proportionate. It must not own the runtime
mechanics. ABG remains the owner of graph calls, vectors, re-entry, events,
replay, continuation, and closure fold.

## Required Shape

The depth traversal function is a graph function over an existing graph:

```text
Fg_decompose_depth_between_nodes(
  sourceNodeRef,
  targetNodeRef,
  parentObligationRef,
  graphCatalogDigestRef,
  edgeContractRefs,
  depthPolicyRef,
  evidencePolicyRef
) -> DepthTraversalOutcome
```

`DepthTraversalOutcome` must include:

```text
status: admitted | rejected | blocked
depthPlanRef
decompositionTraceRegisterRef
childObligationRefs
graphVectorRefs
requiredLedgerRefs
consolidationRef
nonAdmissionReasonRefs
```

The decomposition trace register must bind each child obligation to the parent
obligation, owner edge, graph-function ref, closure criteria, evidence refs,
and consolidation refs. Parent closure must be derived from child evidence, not
from consequence prose.

## Refinement - Deep Overlay Sibling, 2026-06-13

Do not break or mutate the existing full SDLC overlay to introduce depth
pressure. Publish an additive sibling overlay:

```text
overlay://odd-sdlc/current-full-traversal
  baseline full SDLC route

overlay://odd-sdlc/deep-sdlc-traversal
  same graph-function/public-start/terminal-asset shape
  annotation: deep_sdlc_traversal_candidate
  parentOverlayRef: overlay://odd-sdlc/current-full-traversal
  depthTraversalEligible: true
  decompositionTraceRequired: true
  abgRuntimeAuthorityOnly: true
```

The optimizing overlay may list the deep overlay as a child candidate, but the
generic fallback remains current-full. Explicit public start may select the deep
overlay. That selection is not a runtime loop, cursor move, or F_D authority
breach. It is a typed route marker for later T-200 depth graph-function and
decomposition-trace work over ABG/GTL zoom.

## Work Ledger

| id | task | proof | status |
| --- | --- | --- | --- |
| D0 | Publish additive deep SDLC overlay sibling without mutating current-full. | `test_t160_traversal_overlays.test.mjs` proves duplicated graph scope, annotation, explicit public-start selection; `test_t165_optimising_overlay.test.mjs` proves optimizer read model lists the candidate while fallback remains current-full. | done |
| D1 | Design depth traversal graph function and register carriers. | `ODD_SDLC_TYPESCRIPT_DEPTH_TRAVERSAL_FUNCTION.md`; `test_t200_depth_traversal_design.test.mjs` proves carriers, owners, ABG handoff, and non-closure signals. | done |
| D2 | Implement carrier admission and projection. | `depth_traversal.ts`; `test_t200_depth_traversal_carriers.test.mjs` rejects missing parent/child/evidence/consolidation refs and closed-shape runtime-authority payloads. | done |
| D3 | Publish `Fg_decompose_depth_between_nodes`. | `test_t200_depth_traversal_catalog.test.mjs` proves catalog, module, query-domain candidate, target-carrier row, edge-gain contract, semantic build, and GTL preflight. | done |
| D4 | Persist downstream-deferred review rows into the register. | `constructSdlcDecompositionTraceRegisterFromReviewGrade(...)`; `test_t200_review_decomposition_trace.test.mjs` proves downstream-deferred review pressure becomes register rows and current-edge prose is refused. | done |
| D5 | Make design/build/test closure consume child rows. | `evaluateSdlcDecompositionTraceClosure(...)`; `test_t200_decomposition_trace_closure.test.mjs` blocks on untraced/open child rows and closes only after expected children close. | done |
| D6 | Prove REQ-ENG-003 command-only rejection. | `test_t200_req_eng_003_command_only_closure.test.mjs` proves command-only `sbt test` evidence cannot close requirement-bound depth; source test refs, execution shard refs, and non-command admitted evidence are required. | done |
| D7 | Run high-zoom live proof. | archive records admitted strategy, depth traversal, child events, foldback, parent consolidation | pending |

## Non-Live Implementation Proof, 2026-06-13

Implemented D1-D6 without adding an SDLC-local runtime loop, cursor movement, or
event store. The depth path is now expressed as typed graph-function
publication, admitted decomposition trace carriers, review-pressure projection,
and closure foldback over child rows.

Verification:

```text
cd build_tenants/typescript
npm run build:semantic
node --test \
  test_env/tests/test_t200_depth_traversal_design.test.mjs \
  test_env/tests/test_t200_depth_traversal_carriers.test.mjs \
  test_env/tests/test_t200_depth_traversal_catalog.test.mjs \
  test_env/tests/test_t200_review_decomposition_trace.test.mjs \
  test_env/tests/test_t200_decomposition_trace_closure.test.mjs \
  test_env/tests/test_t200_req_eng_003_command_only_closure.test.mjs
```

Result: semantic build and GTL preflight clean; focused non-live proof pack
11/11 passing. Affected regression set
`test_t160_traversal_overlays.test.mjs`,
`test_t165_optimising_overlay.test.mjs`,
`test_t169_target_carrier_contracts.test.mjs`, and
`test_t197_product_gtl_gate.test.mjs` passes 63/63 after adding the required
hook target policy for `sdlc_depth_traversal_outcome`. Full non-live
`npm run test:semantic` passes 1010/1010. D7 remains open for the deferred live
high-zoom proof.

## Non-Goals

- no SDLC-local recursive controller
- no prompt-only obligation list as proof
- no command-success-only feature closure
- no ABG/GTL workaround in product code
