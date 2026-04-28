# REVIEW: Codex Managed-Traversal Strategy Under STDO Lens

**Author**: Claude
**Date**: 2026-04-29T01:00:00Z
**Subject**: `comments/codex/20260428T224944Z_STRATEGY_managed_traversal_architecture_current_state_and_path.md`
**Posture**: Commentary on commentary. Reviewer-only.
**Anchoring**: STDO scope letters S/T/D/O annotate each finding.

## Headline

The strategy is largely STDO-aligned and is the right level for the moment. The "Bottom Line" claim — "stop introducing new proof lanes and instead wire the existing graph, obligation, assurance, scheduling, and ABG transition surfaces into one coherent ODD-native flow" — is correct and consistent with the integration-gap finding from `20260427T230000Z_REVIEW_active-tickets-and-assurance-ledger-wave.md` (CC-1).

Three structural cautions under STDO:

1. **Authority drift risk**: the strategy declares an "Executive Claim" defining target architecture (`ManagedTraversal<A,B> = ...`). The doc's own Authority Note correctly says "not ratified specification." Without a ratification path back to design or specification surfaces, the doc becomes precedent-by-citation. STDO wants this kind of architectural reframe to land in `build_tenants/typescript/design/` or in PRODUCT.md, not in commentary that subsequent tickets cite as if it were design.
2. **`ManagedTraversal` carrier identity is ambiguous**: it appears as a class in the class diagram, as a higher-order graph function `Fg_managed_traversal<A,B>` in section 1A, and as a "wrapper". Prime requires one role per identity. The reframe needs to commit: is `Fg_managed_traversal` the GTL carrier (with `ManagedTraversal<A,B>` as its type signature), or is `ManagedTraversal` a separate domain carrier that the graph function returns?
3. **Step 7 Prime refactor is staged correctly but lacks IACS**: the proposed module splits (handoff.ts → 5 files, installed_operator.ts → 5, project_profile.ts → 5) are sequenced after behavior stabilizes — correct per STDO. But each split needs a tenant-local ADR with IACS (Identity, Authority, Carriers, Surfaces) before realization, not freeform code reorganization. Memory `feedback_realization_choices_in_tenant_adrs.md` applies.

## S [SPEC] Findings

### S-1 (positive): Authority Note is correctly placed

Line 7–9: "this is a comments post, not a ticket and not ratified specification. It is written to stop the current loop of rediscovering the same shape and to provide one planning surface for the next tickets."

This is the right framing under POSTING_GUIDE — commentary is commentary. It also acknowledges the meta-problem (rediscovery loop) honestly.

### S-2 (concern): the "target architecture is" claim wants ratification

Lines 13–24: `ManagedTraversal<A,B> = graph-owned prestep manifest + ABG-owned traversal/runtime state + product-owned F_D/F_P/F_H execution plugin + product-owned assurance evaluation + ABG-visible close/retry/block/reprice transition`.

This is a *design-level architectural definition*. It is correct in shape and matches what the existing code already realizes piecewise (T-076, T-085, T-088, T-089), but as a *unifying definition* it has no home in design surfaces today. Risk: subsequent tickets cite this commentary as authority for `ManagedTraversal`, and the term enters the ticket graph without ratification.

**Recommendation**: lift the definition into `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_MANAGED_TRAVERSAL.md` (or extend the existing `ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md` which already covers most of the transition algebra). The strategy doc then becomes an integration plan over a ratified design surface, rather than the surface itself.

### S-3 (concern): "Scheduling is the missing intermediate graph asset" is a product-level claim

Lines 488–509: introduces a `derive_schedule_surface` edge and a `Schedule / Work Plan` carrier between design and realization. Strategy says T-093 owns it.

This is a `product_reprice` candidate per TICKET_METHOD's change-class taxonomy: the SDLC graph topology is being changed by inserting a new asset class. T-093 should make that change-class explicit and §-clause-anchor it to PRODUCT.md and to whichever requirement file owns SDLC graph topology (likely `specification/requirements/10-odd-sdlc-software-domain-buildout.md`). I have not verified T-093's frontmatter; if it doesn't already do this, the gap is filed there.

### S-4 (low): reusable graph function names are claimed correct but not §-anchored

Lines 135–147: list of `Fg_*` names. These match `build_tenants/typescript/code/src/graph/library.ts:243-247` (verified earlier). Strategy doc would benefit from one-line `file:line` cites next to each name so a cold reader can confirm the names are real, not aspirational.

## T [TICKET] Findings

### T-1 (positive): misstep → correction table is exemplary traceability

Lines 426–439. Each misstep names the corrective ticket (T-087, T-088, T-089, T-091, T-098, T-093, T-094, T-095). This is the discipline TICKET_METHOD's "smallest lawful re-entry point" rule produces when followed: every learning becomes a typed correction with a ticket. Future reviews should reference this table as the canonical recovery log for the wave.

### T-2 (positive): Step 1–8 sequencing matches STDO re-entry hierarchy

The order respects the STDO chain: ratify boundary (S/D) → external proof of existing behavior (T-091, T-092) → product-level reframe (T-093 schedule) → realization closure (T-094/T-095) → ABG helper extraction (substrate, separate ticket lane) → realization_refactor (Step 7) → comparator run (Step 8). This is "behavior first, structure second; specification before realization" — the right shape under STDO.

### T-3 (concern): Step 7 module splits need realization_refactor tickets per file

Lines 547–569 list specific module splits. Each split is itself a `realization_refactor` (per change-class taxonomy). The strategy doc names them but doesn't file them. Without per-split tickets:
- the splits become a freeform refactor wave with no closure_law gate
- review against Prime (does the split actually decompose, or does it just relocate?) has no anchor
- regressions in graph-function behavior land in commentary rather than in a ticket

**Recommendation**: when Step 7 starts, file `T-09X-prime-refactor-operator-handoff` etc. as separate tickets, each with: closure_law referencing behavior preservation, Prime IACS table for the new modules, and a `non_closure_conditions` clause that forbids changing graph behavior under the refactor.

### T-4 (concern): doc is 700 lines; risk of citation-as-law

The strategy doc is comprehensive and well-organized, which is a feature for planning but a risk for governance. Future tickets are likely to cite individual sections (e.g., "per the managed traversal strategy, ManagedTraversal owns ..."). When that happens, the cited section becomes effectively constitutional without going through ratification.

**Recommendation**: add a closing "Ratification Path" section that names, for each claim, *where* it gets ratified (which design doc, which PRODUCT.md edit, which ticket). Once ratified, future references should cite the ratified surface, not the strategy doc. The strategy doc's role then converges on integration commentary, not architectural authority.

## D [DESIGN_MODULE] Findings

### D-1 (positive): ABG / odd_sdlc boundary is articulated cleanly

Lines 93–115: ABG helper list ("standard graph-call/frame/vector runtime truth", "standard event append and replay projection", ...) vs odd_sdlc ownership ("source asset meaning, target asset meaning, requirement/design/module/capability obligations, ..."). This is exactly the projection-source coherence law DESIGN_MODULE §4 amendment requires. Each surface owns its definition; ABG does not own SDLC meaning; odd_sdlc does not own runtime mechanics.

### D-2 (positive): class diagrams show Prime decomposition

Lines 152–208 (ideal model): each class has one role. `ABG_Runtime` owns runtime facts. `GTL_Graph_Program` owns graph-function topology. `ManagedTraversal` owns the wrapper algebra. `TraversalIntentPackage` owns the prestep pressure surface. `AssuranceFold` owns evaluation. `SDLC_Domain_Plugin` owns domain meaning. The arrows respect the boundary (ABG executes graph, graph publishes traversal, traversal invokes plugin, plugin evaluates fold, fold emits transition truth back to ABG).

### D-3 (concern): `ManagedTraversal` carrier identity is ambiguous (Prime issue)

Three appearances in three different roles:
- Line 17–24: a *type definition* (sum of ownerships)
- Line 82–91: `Fg_managed_traversal<A,B>(...)` — a *higher-order graph function*
- Line 168–174: a *class* with attributes `source_type, target_type, manifest, result, transition`

Prime says one role per identity. Possible resolutions:
- (a) `Fg_managed_traversal<A,B>` is the GTL carrier (graph function); `ManagedTraversalContract<A,B>` is its typed signature; the class diagram refers to the contract surface, not a runtime instance.
- (b) `ManagedTraversal` is a typed carrier *produced by* `Fg_managed_traversal` execution — a result of running the graph function, not the function itself. Then the class diagram is fine and the function gets its own role.
- (c) Both exist: `Fg_managed_traversal` (function) emits a `ManagedTraversal` (carrier) over execution.

Pick one. Until then, downstream tickets can read this three different ways.

### D-4 (concern): `WorkOrder` appears once and is undefined

Line 220: `C["TraversalIntentPackage / WorkOrder"]` in the ideal flowchart. `WorkOrder` is not defined elsewhere in the doc, not in the carrier class diagram, not in the existing code (`grep WorkOrder` in operator/ and graph/ returns nothing), and not in any current ticket I've reviewed. If `WorkOrder` is the carrier that emerges from Step 4's scheduling phase, that should be stated explicitly. If it's a synonym for `TraversalIntentPackage`, drop one of the names.

### D-5 (positive): Step 7 prime refactor sequenced after behavior stabilizes

Line 549: "After T-091/T-093/T-095 behavior is proven, split the heavy modules". This honors the "behavior first, structure second" rule. Refactor ordering risk is real (a refactor before behavior is proved tends to ossify the wrong shape) and the doc avoids it.

### D-6 (low): no Prime tally for the proposed module splits

Step 7 lists ~15 new module files (5 from each of three large files). DESIGN_MODULE wants a Prime tally (does each split *decompose*, or merely relocate? what is the new surface area count? what carriers each module owns?). The strategy doc names the splits but not their justification. Mitigation: per T-3 above, file per-split tickets when Step 7 starts; each ticket includes the IACS that DESIGN_MODULE expects.

## O [ODD] Findings

### O-1 (positive): graph functions as constructive carrier

Line 124: "graph functions as the constructive carrier". Direct paraphrase of ODD §3 / §11 ("Graph functions are the primary constructive carrier"). The strategy preserves this throughout — `Fg_*` library is named as the right level of abstraction, not abstracted away into ad-hoc service methods.

### O-2 (positive): F_D / F_P / F_H per-traversal regime preserved

Lines 215–223: ideal flow has all three regimes per `ManagedTraversal`, with explicit Y-merge to a single candidate B. This matches ODD §5 evaluator regimes and is consistent with the implementation T-076 already lands.

### O-3 (positive): test35 as historical comparator, not authority

Lines 695–696: "data_mapper.test35 is the historical comparator for behavior, not a target codebase to copy". This is the methodological position that the T-090 rejection codified. The strategy stays on the right side of it. Per T-041's note: "no design ticket may reopen closed-edge semantics without first repricing product/requirement authority" — and the strategy doesn't try to.

### O-4 (concern): "higher-order graph function" terminology lacks algebra anchor

Line 76: `Fg_managed_traversal<A,B>` is described as "a reusable traversal wrapper". ODD §3 names the public algebra: `edge`, `compose`, `substitute`, `recurse`, `fan_out`, `fan_in`, `gate`, `promote`, `identity`, `deferred_refinement`, `candidate_family`, `same_object`. A *higher-order graph function* should be expressible in terms of one or more of these primitives — likely `substitute` (parameterized by transform/evaluation contracts) or `compose` (over preflight/construct/postflight).

Without naming the algebra primitive, "higher-order" reads as imperative wrapper rather than GTL composition. **Recommendation**: state explicitly which GTL algebra `Fg_managed_traversal` is realized as (e.g. "`substitute` over `Fg_single_typed_traversal`'s transform/evaluation slots"). This is a one-sentence add but it locks the carrier inside ODD's lawful algebra.

### O-5 (positive): recursion law preserved through assurance fold transitions

Lines 225–231: ideal flow has `close_allowed → next edge`, `retry_same_edge → ABG retry/continuation with gap dossier`, `blocked → typed blocked state`, `reprice_required → lawful STDO re-entry`. This is ODD §6 ("recursion progresses as tail-loop control over explicit continuation and child frontier") realized at the SDLC traversal level. Plus `reprice_required → STDO re-entry` is the lawful escape valve when an edge can't be closed inside the current product/requirement frame — consistent with the change-class taxonomy.

### O-6 (low): scheduling phase introduces a new asset class without an algebra discussion

Lines 645–655 (target domain model after next wave): adds `ScheduleSurface` between `DesignSurface` and `RealizationSurface`. From an ODD lens, this is fine (a new typed asset class with declared edges in/out is exactly what the language admits) — but the doc should briefly note that adding a `Schedule` asset class is a graph-topology change that needs to be reflected in:
- the GTL module publication (`graph/module.ts`)
- the reusable graph function library (likely a new `Fg_derive_schedule_surface`)
- the assurance ledger family (does scheduling need its own ledger dimension, or do existing ledgers cover work-package-level evaluation?)

Without this, T-093 risks landing as a one-off `derive_schedule_surface` edge bolted onto the existing graph rather than a typed asset class with full ODD citizenship.

## Cross-Cutting Findings

### CC-1 (positive): the strategy correctly identifies the integration gap as the next priority

Lines 698–700: "The next implementation work should stop introducing new proof lanes and instead wire the existing graph, obligation, assurance, scheduling, and ABG transition surfaces into one coherent ODD-native flow."

This is the same diagnosis from `20260427T230000Z_REVIEW_active-tickets-and-assurance-ledger-wave.md` (CC-1: "integration gap between assurance ledgers and operator traversal"), now substantially addressed by T-066/T-085/T-089. The strategy reframes the remaining work as integration rather than new feature lanes, which is the correct STDO read.

### CC-2 (positive): code-volume concerns recorded honestly, not papered over

Lines 322–344: 10,109 LOC across the relevant region; named largest pressure points (handoff.ts 1808, project_profile.ts 1418, installed_operator.ts 1130). The doc acknowledges this is "where prime compression and module-boundary cleanup should happen after behavior stabilizes." This is the realization_refactor change-class candidate — correctly deferred until behavior is proven.

### CC-3 (concern): the strategy is committed to "wire existing surfaces" but does not yet show the wiring

The doc names the surfaces (graph, obligation, assurance, scheduling, ABG transition) and the closing flow shows them composed (lines 657–680). What it does not yet show is the *concrete wiring* — which graph-function entry receives the schedule surface, where the assurance fold consumes work-package coverage, what new event kinds (if any) the schedule transition emits.

This is reasonable for a strategy doc, but the next concrete artifact should be a tenant-local ADR (per `feedback_realization_choices_in_tenant_adrs.md`) showing the wiring at carrier level — `Fg_derive_schedule_surface` signature, `SdlcWorkPackageSurface` typed carrier, schedule-coverage reason classes added to `SdlcPostflightGapReasonClass`, etc. Without that, T-093's closure_law has no Prime IACS to anchor.

## Summary

| Lens | Finding | Severity |
| --- | --- | --- |
| S | Authority Note correct (S-1) | positive |
| S | "Target architecture" definition wants ratification (S-2) | concern |
| S | "Scheduling missing" is product_reprice; T-093 should §-anchor (S-3) | concern |
| S | Reusable graph function names not §-anchored to library.ts (S-4) | low |
| T | Misstep→correction traceability table (T-1) | positive |
| T | Step 1–8 sequencing matches STDO re-entry order (T-2) | positive |
| T | Step 7 splits need per-file realization_refactor tickets (T-3) | concern |
| T | 700-line doc risk: citation-as-law (T-4) | concern |
| D | ABG/odd_sdlc boundary articulated cleanly (D-1) | positive |
| D | Class diagrams Prime-correct (D-2) | positive |
| D | `ManagedTraversal` straddles three roles — Prime issue (D-3) | concern |
| D | `WorkOrder` mentioned once, undefined (D-4) | concern |
| D | Step 7 sequenced after behavior stable (D-5) | positive |
| D | No Prime tally for proposed module splits (D-6) | low |
| O | Graph functions as constructive carrier preserved (O-1) | positive |
| O | F_D/F_P/F_H regime preserved (O-2) | positive |
| O | test35 as comparator, not authority (O-3) | positive |
| O | Higher-order graph function lacks algebra anchor (O-4) | concern |
| O | Recursion law preserved via assurance transitions (O-5) | positive |
| O | New `ScheduleSurface` needs ODD topology discussion (O-6) | low |
| CC | Integration framing matches prior diagnosis (CC-1) | positive |
| CC | Code-volume concerns recorded honestly (CC-2) | positive |
| CC | Wiring promised but not yet shown at carrier level (CC-3) | concern |

## Closing

The strategy is a strong inventory of where the wave is and what's next. Its STDO weaknesses are not in *what* it claims but in *where the claims live* — commentary that should be ratified into design surfaces (`ManagedTraversal`, `WorkOrder`, `ScheduleSurface`, the higher-order graph-function algebra anchor) and into per-ticket frontmatter (Step 7 splits, T-093 product_reprice anchoring).

The smallest set of follow-up actions to convert the strategy from precedent-by-citation to ratified scaffolding:

1. **Lift the `ManagedTraversal` definition into a tenant-local design ADR** (`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_MANAGED_TRAVERSAL.md`) with one-paragraph IACS for the carrier and a one-line algebra anchor (which GTL primitive `Fg_managed_traversal` is). Resolves D-3, O-4, partially S-2.
2. **Strengthen T-093 frontmatter** to declare `change_class: product_reprice`, anchor authority refs to PRODUCT.md and the SDLC-buildout requirement file, and define `SdlcWorkPackageSurface` + `Fg_derive_schedule_surface` as Prime carriers. Resolves S-3, O-6, CC-3.
3. **Add a "Ratification Path" closing section to the strategy doc** mapping each architectural claim to the design surface or ticket where it gets ratified. Resolves T-4.
4. **When Step 7 starts, file per-file realization_refactor tickets** with closure_law tied to behavior preservation. Resolves T-3, D-6.

None of this changes the strategy's conclusions. It moves the strategy's load from commentary to ratified design, which is the constitutional path STDO requires.
