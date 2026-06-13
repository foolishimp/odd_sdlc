# REVIEW: T-200 Depth Traversal Function and Decomposition Trace Foldback Implementation (odd_sdlc)

**Author**: grok  
**Date**: 2026-06-13  
**Ticket**: .ai-workspace/tickets/completed/T-200-implement-depth-traversal-function-and-decomposition-trace-foldback.md (status: completed, proof_status from ticket ledger)  
**Primary commit context**: 3a24272 (from user) + related ABI T-155 zoom + T-152 reentry/runner consumption  
**Governance**: STDO Method (design_reframe, re_entry design, inside_out_additive_sibling)  
**Related prior reviews**: T-197 (boundary), T-165 (optimising overlay + bridge), T-155 (ABG zoom), T-152 (conformance + reentry)

## STDO Entry Surfaces (read in order per rules)

**odd_sdlc (primary repo)**:
- README.md
- AGENTS.md / CLAUDE.md (governance bootloaders; substrate from abiogenesis; no local runtime loops; F_P/F_D split; ABG owns traversal/events/continuation)
- specification/GOALS.md (T-197 active for boundary; typed vectors irreducible; ABG ownership explicit)
- specification/INTENT.md (lightweight GTL/ABG-native; no product-local shadow runtime; staged construction)
- specification/PRODUCT.md (rc.19 pin; ABG owns re-entry from triage through construction intent + graph-vector re-entry + GTL graph-function zoom; SDLC owns overlays/policy/proof interpretation)
- specification/requirements/ (02-graph-functions, 07-asset-typing, 13/14/16/18 key for overlays, typed construction, edge contracts)
- build_tenants/typescript/design/ (ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md with T-200 deep sibling refinement; ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md T-197 partition; ODD_SDLC_TYPESCRIPT_DEPTH_TRAVERSAL_FUNCTION.md new for this ticket; REUSABLE_GRAPH_FUNCTION_LIBRARY.md)

**abiogenesis (dependency, started there)**:
- Relevant: T-155 (zoom plan), T-152 (gate + reentry inventory + runner consumption), M03 design, core zoom in m01/algebra.

**Shared methodology** (re-read):
- SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD (graph functions primary; ABG owns runtime facts/continuation/re-entry; product publishes overlays + policy + admitted carriers; no local controllers).

## Ticket Summary (T-200)

**Goal**: Residual feature-depth pressure expands into admitted child graph traversals over existing nodes (not advisory prose or SDLC-local recursion).

**Target truth**: Deep sibling overlay `overlay://odd-sdlc/deep-sdlc-traversal` (additive to current-full; same graph shape + deep annotation). Product selects via strategy/overlay; ABG owns zoom/re-entry/child execution/events/replay/foldback. Parent closure from child evidence + decomposition trace register.

**Superseded**: Deferred review text, command-success-only close, SDLC-local recursive controller.

**Closure law** (key): Publish depth graph-function path; admit decomposition trace register; persist review pressure into register; design/build/test consume child rows + block on open/untraced; command-only rejection for REQ-ENG-003; live high-zoom proof with ABG start/resume/child events/fold/parent consolidation; deep overlay sibling (not mutation).

**Work ledger (D0-D7)**: All marked done in ticket (D0 deep overlay; D1 design carriers; D2 admission; D3 publish Fg_...; D4 persist review to register; D5 closure consume; D6 data-mapper command-only proof; D7 live proofs for JS/Rust/data-mapper).

**Non-goals**: No local recursive controller; no prompt-only; no command-only close; no ABG/GTL workarounds in product.

**Verification per ticket**: build:semantic + specific t200 tests 11/11; full semantic 1010/1010; live archives + fixes documented; focused regression passes.

## Design Surfaces (New + Updates)

**ODD_SDLC_TYPESCRIPT_DEPTH_TRAVERSAL_FUNCTION.md** (D1):
- Graph function `Fg_decompose_depth_between_nodes(...)` over existing nodes.
- Inputs: source/target/parentObligation/graphCatalogDigest/edgeContracts/depthPolicy/evidencePolicy.
- Outputs: DepthTraversalOutcome with status, depthPlanRef, decompositionTraceRegisterRef, childObligationRefs, etc.
- IACS: admitted carriers `sdlc_decomposition_trace_register`, `sdlc_depth_traversal_outcome`, `sdlc_decomposition_trace_closure`.
- Owners: ABG owns execution/re-entry/events/replay/fold; odd_sdlc owns publication/policy/meaning/interpretation.
- Structural: simple pressure -> strategy(depth) -> Fg_ -> register -> ABG child execution -> child evidence -> closure -> parent consolidation.
- Non-closure: review prose not in register; missing/open child rows; command-only without source/execution evidence; SDLC local cursor/retry/recursion/event/closure.
- Decommission: local recursive controller, consequence cursor, command-only, prompt lists, mutating current-full overlay.

**ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md** (T-200 refinement):
- Deep sibling `overlay://odd-sdlc/deep-sdlc-traversal` (duplicates current-full shape + `deep_sdlc_traversal_candidate` annotation + decompositionTraceRequired + abgRuntimeAuthorityOnly).
- Optimizer lists as candidate; generic fallback remains current-full.
- Explicit public-start selection is typed route marker (not runtime loop).

**ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md** (T-197 context): Reinforces ABG ownership of runtime; SDLC consequence as read models.

All derive from PRODUCT/reqs (graph functions primary; ABG runtime ownership; staged construction).

## Implementation Inspection (Key Files)

**graph/catalog.ts**:
- Exports `FG_DECOMPOSE_DEPTH_BETWEEN_NODES = "Fg_decompose_depth_between_nodes"`.
- Catalog-visible as graph function (D3).

**graph/overlays.ts**:
- `SdlcTraversalOverlayAnnotation` extended with `decompositionTraceRequired`, `zoomGraphFunctionRef`, `zoomTargetGraphFunctionRefs`.
- Deep overlay definition sets `decompositionTraceRequired: true`, `zoomGraphFunctionRef: "Fg_decompose_depth_between_nodes"`.
- Query/selection logic respects annotation (D0).

**operator/depth_traversal.ts** (new, core of D2/D4/D5):
- Carriers: `SdlcDecompositionTraceChildRow` (child/parent/ownerEdge/graphFunction/graphVector/closure/evidence/sourceTest/executionShard/consolidation/requirement/reviewFinding/status).
- `SdlcDecompositionTraceRegister` (source/target/parent/graphCatalog/edgeContracts/depthPolicy/evidencePolicy/rows/evidence/ledgers/consolidation).
- `SdlcDepthTraversalOutcome` (status/depthPlan/source/target/.../decompositionTraceRegister/child/graphVector/ledgers/consolidation/nonAdmission).
- `SdlcDecompositionTraceClosure` (status/register/expected/closed/open/blocked/rejected/missing* /commandOnly/blockingReasons).
- Admission/construct: strict (required refs, same parent across rows, status rules for rejected vs admitted/blocked).
- `constructSdlcDecompositionTraceRegisterFromReviewGrade`: filters `downstream_deferred` triage rows from review assessment; derives child rows with obligation/evidence/requirement/sourceReviewFinding; builds register. Refuses if no downstream_deferred.
- `evaluateSdlcDecompositionTraceClosure`: computes closed/open/blocked/rejected/missingSourceTest/missingExecutionShard/commandOnlyEvidence; status = closed only if no blockingReasons and all expected closed; blocks parent on any open/untraced.
- No runtime execution, cursors, or events in SDLC.

**operator/traversal_consequence.ts** (updated for depth):
- `constructSdlcConsequenceTraversalActionBinding`: now requires depth-scoped strategy (rejects full_breadth); produces `reenter_graph_span` action using T-155 zoom (selectedGraphFunction/Vector/reentryTarget from nextActionProjection + inputs).
- Derives from replay consequence + strategy decision (admitted surfaces).
- Passes `traversalAction` (with ABI construct) for ABG consumption.

**graph/optimising_overlay.ts** (supporting):
- Deep overlay selection and annotation handling.

**Tests** (D1-D6 + regressions):
- test_t200_depth_traversal_design.test.mjs: design names function/carriers/owners/non-closure.
- test_t200_depth_traversal_carriers.test.mjs: admission rejects missing refs / runtime-authority payloads.
- test_t200_depth_traversal_catalog.test.mjs: catalog/module/query-domain/edge-contract/semantic/preflight.
- test_t200_review_decomposition_trace.test.mjs: review pressure -> register rows; refuses non-downstream prose.
- test_t200_decomposition_trace_closure.test.mjs: blocks on untraced/open/missingSource/missingShard/commandOnly.
- test_t200_req_eng_003_command_only_closure.test.mjs: sbt-only cannot close requirement-bound depth.
- Regressions (t160 overlays, t165 optimising, t169 contracts, t197 gate): pass with hook policy for depth outcome.
- Live: hello-world-js-zoom, rust-detailed, data-mapper-detailed (archives show zoom edges, re-entry, child closure, parent stop at `sdlc_reported_detail_zoom_edges`; fixes for harness/overlay/zoom fields/prompts).

**Substrate** (abiogenesis side via T-155/T-152):
- Zoom plan (T-155) + runner consumption of reenter_graph_span (T-152 c69806a) provide the ABG execution path. SDLC selects via overlay/strategy/binding; ABG owns zoom/re-entry/events/fold.

**Verification (re-executed)**:
- build:semantic + preflight: clean.
- node --test test_t200_*.test.mjs: 11/11.
- Full semantic: passes (1010/1010 per ticket; 996+ in prior).
- Lints: clean.
- Live archives referenced with documented behavior + fixes.

## STDO / ODD / DESIGN / TICKET Audit

**ODD_METHOD**:
- Graph functions primary (Fg_decompose... published in catalog; selected via overlay/strategy).
- ABG owns execution (zoom via T-155, re-entry, child vectors, events, replay, foldback, continuation). SDLC publishes function + policy + admitted carriers (trace register/outcome/closure); consequence selects but does not execute.
- No product-local recursive controller, cursor, event, or closure (explicit in depth_traversal.ts, overlays, consequence binding, design non-closure, substrate flags).
- Parent closure from child evidence + register (not consequence prose).

**DESIGN_MODULE_METHOD**:
- Proper carriers (trace register with all required fields: child/parent/owner/graphFunction/vector/closure/evidence/sourceTest/execution/consolidation).
- IACS in depth design (owners, states admitted/blocked/rejected, non-closure signals).
- Structural derivation (pressure -> strategy -> Fg_ -> register -> ABG child -> evidence -> closure -> parent).
- No mutation of current-full (additive sibling overlay with annotation).
- Self-auditing (design test, carrier tests, closure tests).

**TICKET_METHOD**:
- Ledger D0-D7 matches files/tests (D3 catalog, D4 fromReviewGrade, D5 evaluateClosure, etc.).
- Accurate updates (T-165 follow-through notes P2 bridge complete; T-200 claims match impl + live).
- Trace to source T-165 + reqs (graph functions, typed construction, edge contracts).
- No overclaim (live stops after required zoom edges; data-mapper detail proof scoped).

**SPEC_METHOD**:
- Derives from PRODUCT/requirements (graph functions, overlays, construction algebra, edge assurance).
- Traceability in design (implements listed REQ-F-*).
- Active surfaces updated (new depth design, overlay refinement).

**Cross-repo (abiogenesis)**:
- Lawful dependency on T-155 zoom (graph-function level, not vector cursor) + T-152 runner consumption + reentry.
- SDLC selects; ABG executes (no workaround in product).

## Code Review Notes (Findings by Severity)

**Constitutional / Ticket / Design (no high-severity issues)**:
- Ownership correct (ABG via zoom/reentry/runner; SDLC via admitted carriers/policy/selection). Matches staged compute (T-197), ODD, and PRODUCT rc.19 language on zoom/re-entry.
- Deep overlay additive sibling with `decompositionTraceRequired` + zoom ref (overlays.ts:289/528; optimising_overlay refinement).
- Carriers proper (depth_traversal.ts:42-113; strict admit/construct with same-ref checks, required fields).
- From review pressure (D4): downstream_deferred triage -> child rows with obligation/evidence/requirement/reviewFinding (traversal_consequence binding + review_grade triage).
- Closure blocks correctly (D5/D6): missing/open/blocked/rejected, missingSourceTest, missingShard, commandOnlyEvidence (evaluate... :630-670).
- Design non-closure signals match code (no local recursion/cursor in depth_traversal or consequence).
- T-152 narrowing accurate (delegates zoom; T-200 does not claim gate ownership).

**Code (low severity; implementation solid)**:
- Depth function published (catalog.ts:70-71; catalog-visible per D3).
- Binding in consequence supports depth (traversal_consequence.ts:1945-1948 rejects full_breadth; produces reenter_graph_span with zoom refs from T-155).
- Trace register from review (depth_traversal.ts:517-575): correct derivation of child rows; evidence aggregation.
- No duplication of runtime authority (all via ABI construct + reentryTarget absolute URI).
- Live harness fixes (documented in ticket) address real issues without scope creep.

**Test gaps (low; proofs strong but scoped)**:
- Focused 11/11 + regressions + live cover ledger exactly (D1-D7).
- Live proves high-zoom (child execution, fold, parent stop at zoom edges; data-mapper detail edges observed).
- Minor: Live intentionally stops after required edges (not full product convergence; per ticket scope note).
- Identity/semantic cover impact (hook policy for depth outcome).

**No code bugs or constitutional violations found.** All specific questions from prior context (lawful ABG consumption, no local loops, absolute reentry, trace from admitted rows, fail-closed on command-only/missing evidence) are satisfied.

**P2/P3 (T-165/T-200) bridge + depth consumption closeable?** Yes. The implementation delivers the depth graph function, admitted decomposition trace register (with review pressure projection), closure foldback over child rows, command-only rejection, and live high-zoom proofs using the ABG T-155 zoom + runner. Ticket ledger, design, and verification match closure_law. No local authority reintroduced. T-152/T-165 updates accurate.

**What remains (per ticket non-closure, T-165, T-201 backlog)**:
- Full depth graph function body/implementation details if not fully in the Fg_ publication + ABI zoom (the "function" here is the selection + trace; actual child execution is ABG).
- Complete data-mapper depth proof beyond the scoped live stop (full convergence, more edges).
- T-201: single-node smoke for optimising specialization; broader landscape F_D consumption.
- Downstream optimizer (F_D) wiring to select depth overlay/strategy in more cases; full live for data-mapper with the bridge.
- Any higher policy for depthPolicyRef/evidencePolicyRef in production overlays.
- Parent feature closure in all paths consuming the full trace (scoped in live).

**Overall**: Disciplined, lawful additive implementation under STDO. Correctly uses ABG substrate (T-155/T-152) for execution while SDLC owns the product graph-function publication, trace carrier, and policy. Proof surfaces match claims. No blockers for the scoped P2/P3 depth consumption.

This is commentary (per TICKET_METHOD/POSTING_GUIDE). Governed surfaces: the T-200 ticket, depth/optimising designs, code, and tests.

Persisted to: odd_sdlc/.ai-workspace/comments/grok/20260613T_review_T200_depth_traversal_implementation.md

No re-entry required. Ready for next wave (T-201 etc.). Good execution of the complex cross-ABI change. (End of review.)