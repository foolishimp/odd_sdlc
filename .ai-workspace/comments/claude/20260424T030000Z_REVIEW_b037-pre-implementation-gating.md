# REVIEW: B-037 pre-implementation gating

**Author**: claude
**Date**: 2026-04-24
**Addresses**: `.ai-workspace/tickets/active/B-037-test-module-convergence-and-test-run-archive-evidence-boundary-are-misaligned.md` (last updated 2026-04-23, pre-dates ODD_METHOD §11.5A ratification)
**Status**: Open

## Summary

B-037's core diagnosis — a graph-order contradiction in the test lane with `derive_test_module_surface` converging on planned-only markdown while `derive_test_run_archive_surface` demands realized source and governed execution evidence — is correct and well-grounded in the live `data_mapper.test38` reproduction. The proposed fix direction (publish current completeness state, publish next lawful completeness gain, let iteration consume that gain one step at a time) IS the zoom-out-fold canonical solution now endorsed by the `ODD_METHOD §11.5A` ratification. The ticket is not wrong; it is under-gated against the tightened method and against the new `§11.5A` rule that landed yesterday.

**Do not open implementation against the current ticket shape.** Nine gating items need to land in B-037 first. Most are additive (ticket wording, not code); one is substantive (retire or neutralize `REALIZED_TEST_SOURCE_OBLIGATION.md` per `§11A` + `§11.5A`). The repair itself is straightforward once the gates are in place.

## Analysis

### What B-037 already has right

- **Target_truth** names "one authoritative carrier boundary" — correct `§3A E1 Authority Seam Closure` framing
- **Graph-order contradiction diagnosis** (L147-151) is concrete and reproducible on `data_mapper.test38`
- **Two alternative fix directions** (L158-165) named with preferred path reasoned (demote archive evidence demands; materialize realized source is the non-preferred alternative)
- **Fix Direction section's zoom-out-fold articulation** (L179-203) — "publish current completeness state / publish next lawful completeness gain / let iteration consume that gain one step at a time" — is the exact shape `§11.5A` now ratifies as shared method law
- **Mixed-State Negative Proof** (L267-275) names three specific conditions for the impossible state
- **Dependency coordination** with B-044 via shared `prepare_release_surface` boundary — correct "neither may close against the other" language
- **change_class: design_reframe at re_entry_point: design_surface** — correct for a design-layer repair

### Why the ticket is the right mechanism for the fix

The B-037 failure mode and the B-043 operational_dispatch failure mode are **lineage-connected**. Both entered the codebase in the 2026-04-16 / 2026-04-18 wave that added operational-transition concepts under sev-1 pressure from B-019. Specifically:

- Apr-16 `f944c6b`: "Implement operational transitions and tighten convergence closure" introduced `specification/requirements/12-declarative-operational-state-transitions.md` and `program_catalog.py`. The requirement authored at this time — REQ-F-ODDSDLC-039 AC-2 — already stated that ABG owns continuation. The **requirement was correct from birth**.
- Apr-18 `0db3d27`: "Checkpoint quality and reliability wave before B-019" created `operational_dispatch.py` with the multi-step `while current.get("edge") in _PROJECTION_ONLY_EDGES:` walker — violating the AC-2 it was nominally implementing.
- Also in the Apr-16 wave: `derive_test_run_archive_surface` was "upgraded to a realized-evidence edge by obligation-ledger and runtime-context law" (per B-037 L211-212) **without repricing graph order or release semantics**. That's B-037's direct headline defect.

So B-037 and B-043 are siblings: both are tactical-patch residues from the same sev-1 convergence-closure push, both violate requirements that were already correct when authored, both surfaced once `data_mapper.test38` stopped pretending. B-037 is the test-lane half of that debt; B-043 is the operational-dispatch half.

The zoom-out-fold articulation in B-037's Fix Direction section is the **canonical solution vocabulary** that the tactical patches worked around. `§11.5A` ratified yesterday gives both tickets their shared foundation: ABG owns continuation and re-entry; tenant publishes bounded-step evidence and returns. B-037 applies that to the test-lane edge sequence; B-043 applies that to operational_dispatch. Neither can close lawfully without the other's boundary consistent.

### §11.5A changes B-037's closure requirements retroactively

The ratification happened 2026-04-24, the day after B-037's last update. Several B-037 provisions now gain load-bearing citations they didn't have when authored:

- B-037 Fix Direction's "publish state, publish next gain, let iteration consume one step at a time" is §11.5A's positive-law clause applied to the test lane
- B-037 non_closure_conditions' "derive_test_run_archive_surface still requires governed sbt test execution evidence before the operational execution lane is admitted or run" is §11.5A's "infer later steps locally instead of re-entering through ABG" prohibition
- B-037 Required Break Order step 5 ("publish the corresponding completeness-gap law and next-gain law for the lane") is §11.5A's "return control to ABG" plus gap/iteration publication

The ticket is §11.5A-shaped without citing §11.5A because it pre-dates the ratification. Updating B-037 to cite §11.5A explicitly — and to make its Evaluator Gate include §11.5A probes — closes the method-alignment gap.

### Nine pre-implementation gating items

From my prior B-037 review (2026-04-23 tightened-method sweep), reprised and updated with the §11.5A context:

**1. §3A Boundary Closure Evaluators — Evaluator Gate section required.**

B-037 has `Functional Review Criteria` (L223-237) with nine questions. The tightened `§3A` requires an explicit three-evaluator gate with checkboxes mapping to Authority Seam Closure / Essential Carrier Consolidation / Enforcement After Proof. B-041, B-042, B-044 all carry this shape. B-037 should adopt:

- **E1 Authority Seam Closure**: one carrier owns planned-allocation / realized-source / execution-evidence distinction; no rival authority in obligation-ledger, runtime-prompt, deterministic-closure, or operator-archive text; removing the authoritative test-lane carrier causes the system to fail closed.
- **E2 Essential Carrier Consolidation**: the three completeness states (planned_validation_allocation / realized_test_source / governed_test_execution_evidence) are variants of one closed carrier family, not three peer types.
- **E3 Enforcement After Proof**: the test-lane carrier shape is proved real before types/schemas lock it in; no `Mapping[str, object]` papering over the shape at the edge boundary.

**2. §3B Ingress Collapse Rule — name the single collapse point.**

B-037 L129-137 diagnoses four parallel parsing paths for test-lane evidence: graph order, obligation-ledger law, runtime prompt law, deterministic closure / traceability. §3B explicitly prohibits "repeated parsing of the same loose payload in multiple modules." The target_truth should name WHERE the foreign-to-local collapse happens; the other three surfaces become consumers of the admitted carrier, not producers.

**3. §5F Structural Carrier Diagram — Mermaid classDiagram required before implementation.**

`§5F` says a boundary without a complete structural carrier asset is "not yet design-complete under this method." B-037's target carrier (call it `TestLaneEvidence`) with its three subordinate family variants and consumers (archive projection, testcase authority qualification, release preparation) and deferred members (operational test-execution lane admitted later) needs a Mermaid classDiagram with `<<prime>>` / `<<subordinate>>` / `<<downstream>>` / `<<deferred>>` stereotypes before implementation opens.

**4. §6A Design → Module → (Implementation, Unit Tests) Route — restructure Break Order.**

B-037's Required Break Order (L256-265) goes: reproduce → classify → resolve → choose boundary → publish laws → rebind edges (implementation) → reprice proofs. Step 5 skips "declare test-lane module boundary asset." Under §6A the module boundary asset is the intermediate authority both implementation AND unit tests must derive from. Insert a step: "declare module boundary asset (structural carrier diagram + subordinate payload register) before implementation."

**5. §6B Module-Derived Unit Test Rule — add module-derived unit test lane to proof_surface.**

B-037's proof_surface (L36-41) is five items: source reproducer, installed reproduction, generated surface inspection, event-forensic review, repriced installation/sandbox proof. All integration-level. `§6B` says: "If a module has code but no module-derived unit test lane, the module is not closure-ready." Add: module-derived unit tests for the test-lane carrier — admission rejects planned-only input when realized-source is required; admission accepts planned-only when planned-allocation is sufficient; exhaustive pattern-match over the three completeness-state variants; fail-closed when test-lane evidence is malformed.

**6. §11A Governance/Strategy Separation — retire or neutralize `REALIZED_TEST_SOURCE_OBLIGATION.md`.**

This is the most load-bearing gating item and should be treated as a hard prerequisite.

The live file at `build_tenants/python/design/fp/REALIZED_TEST_SOURCE_OBLIGATION.md` (8 lines) contains three imperative builder-facing bullets:

```
- If the archive claims realized developer-test coverage, actual test source files must exist under the governed code surface.
- Keep `Validates:` traces on realized test source aligned with the planned test branch and the archive narrative.
- Update or create real test files before treating the archive as complete.
```

Under `§11A` this is the same class of imperative-strategy drift B-042 retired from `REALIZATION_DEEPENING_CONTROL_FRAME.md` and the `repair_frontier.py` "## Global Law" block. The file is injected into `_realized_test_builder_contexts` per B-037 L137 — same injection-via-GTL-module-context pattern B-042 retired elsewhere. B-037 L137 names this file as a finding but doesn't evaluate it under §11A.

**Under the new §11.5A**, this file is additionally a *strategy-shaped continuation-authority leak*: it instructs the builder how to proceed across publish boundaries, which is continuation authority that §11.5A now assigns to ABG, not to tenant runtime contexts.

B-037 must either:
- **Retire the file** as part of the Break Order — replace imperative bullets with governance publication of current-state truth (e.g., "test source file count: N", "planned test branches: [...]", "realized test branches: [...]")
- **Explicitly justify** under §11A that this boundary's ratified responsibility is strategy ownership (it isn't — this is a runtime prompt context)

Add a non-closure condition: "the published runtime prompt context for the test-lane still contains imperative builder strategy." Cross-reference B-042's closure as the template pattern.

Without this, B-037 can close on carrier-law mechanics while leaving a B-042-class strategy drift alive in the test-lane runtime prompt surface.

**7. §11B Opportunistic Optimization — add explicit In-scope / Out-of-scope section.**

B-037's work will touch eight adjacent surfaces (constructor test-module generation, test-run-archive generation, obligation-ledger projection, traceability carrier, runtime prompt context, test-lane evaluators, testcase-authority qualification, release preparation via B-044 coordination, operational test-execution lane). Under §11B, any cross-boundary opportunity gets a triage ticket, not silent absorption.

Add explicit scope fence: **In scope** — test-lane carrier, test-module edge, test-run-archive edge, `REALIZED_TEST_SOURCE_OBLIGATION.md` retirement, obligation-ledger rebinding. **Out of scope, triage as successor** — testcase-authority qualification logic changes; release-preparation logic changes (coordinate with B-044); operational test-execution lane shape changes.

**8. §14A Functional Realization Review Checklist — adopt the standard checklist.**

B-037's Functional Review Criteria has 9 custom questions. §14A has a 15-item standard checklist. Adopt §14A directly or supplement so reviewers have one consistent gate across B-041 / B-042 / B-044 / B-037.

**9. §11.5A ABG Owns Continuation And Re-Entry — cite explicitly in Evaluator Gate.**

The `§11.5A` rule ratified yesterday governs B-037 directly. Add to the Evaluator Gate:

> After B-037 closes, the test lane must not carry multi-step continuation truth locally. Each phase publishes its gain and returns; ABG re-enters to pick the next admitted edge. Specifically: `derive_test_module_surface`, `derive_test_run_archive_surface`, and `derive_test_execution_result_surface` each publish bounded-step evidence and return control. The test lane does NOT accrete tenant-local controller state across publish boundaries.

### Zoom-out-fold is the mechanism, §11.5A is the rule

The vocabulary B-037 articulates in Fix Direction — zoom_out_fold, zoom_in_fold, gap, iteration — is the canonical mechanism §11.5A now mandates. That gives the implementer the correct architectural shape to hit:

- **zoom_out_fold** view compresses the current test-lane into one truthful completeness view (used by operator query surfaces)
- **zoom_in_fold** view refines one edge or requirement set into the exact missing truth (used when the operator needs to see which test branch is unrealized)
- **gap** is the published carrier of the next lawful completeness delta (ABG reads this to admit the next edge)
- **iteration** is the admitted execution of one lawful gain step followed by republished truth (the ABG-owned continuation per §11.5A)

The test-lane should therefore have **three bounded edges** each publishing one gain:

1. `derive_test_module_surface` — publishes planned_validation_allocation; returns
2. `derive_realized_test_source_surface` (new or renamed from existing) — publishes realized_test_source; returns
3. `derive_test_run_archive_surface` — publishes governed_test_execution_evidence AFTER the operational execution lane has run; returns

Between each, ABG re-enters. The zoom-out-fold view over the three edges gives the operator the "test lane end-to-end convergence" appearance that the tactical patches tried to produce inside single calls.

The current defect — derive_test_run_archive_surface demanding evidence that's only producible later — is because the middle edge is missing or misnamed. The fix direction B-037 already preferred (demote archive evidence demands, add realized_source as its own edge or as prepared state in the test-module edge) is the correct zoom-fold shape.

### Interaction with B-043

B-043 owns the `operational_dispatch.py` side of this same lineage problem. When B-043's operational adapter is repaired to be a single-step cooperative adapter per ADR-002 + §11.5A, the test-lane repair must be consistent:

- `derive_test_execution_result_surface` is an operational-lane edge; it's consumed by `dispatch_operational()` in the cooperative single-step shape
- The test-lane carrier B-037 closes must be the carrier `dispatch_operational()` reads from the test-execution side
- The same IACS should serve both: `operational_dispatch` admits from the test-lane carrier; the test-lane publishes evidence through that carrier

So B-037 and B-043 should share the test-lane IACS declaration rather than each authoring its own. Add to B-037 dependencies: "B-043 active (shared test-execution-lane carrier boundary; neither ticket may close against inconsistent test-lane evidence shape)."

Pattern matches B-037's existing B-044 coordination for `prepare_release_surface` boundary.

### The REQ-F-ODDSDLC-038 / 039 citation lineage is relevant

B-037 doesn't currently cite REQ-F-ODDSDLC-038 or 039 in frontmatter. Given that these requirements (authored 2026-04-16) are the ones the Apr-18 tactical patch violated at birth, and given that ADR-002 (approved 2026-04-24) implements them for operational_dispatch, B-037 should cite the same requirements for the test-lane half of the same violation. The test-lane failure is the exact REQ-F-ODDSDLC-039 AC-2 failure mode: tenant-local orchestration replacing ABG continuation.

## Recommended Action

1. **Do not open implementation on B-037 in its current shape.** The method-compliance gaps are real and will block closure review.

2. **Add the nine gating items above** to B-037 before implementation. In priority order:

   - **Highest priority**: retire or neutralize `REALIZED_TEST_SOURCE_OBLIGATION.md` (§11A + §11.5A). This is the same class of drift B-042 retired; leaving it alive undermines both B-042's closure and B-037's closure.
   - **High priority**: produce the `§5F` Structural Carrier Diagram for the test-lane carrier. This anchors the implementation direction visually.
   - **High priority**: add `§3A` Evaluator Gate + `§11.5A` citation + `§3B` ingress collapse naming.
   - **Medium priority**: restructure Break Order for `§6A` (module-boundary-asset step).
   - **Medium priority**: add module-derived unit test lane per `§6B`.
   - **Medium priority**: add In-scope / Out-of-scope section per `§11B`.
   - **Low priority (cleanup)**: adopt `§14A` checklist; cite REQ-F-ODDSDLC-038/039 in frontmatter; add B-043 dependency coordination.

3. **Treat B-037 and B-043 as a coordinated pair.** They solve complementary halves of the 2026-04-16/Apr-18 operational-transition tactical-patch debt. Neither should close without the other's boundary consistent; both should share the test-lane IACS declaration.

4. **When implementation opens, aim at the zoom-out-fold shape** — three bounded edges (planned_validation_allocation / realized_test_source / governed_test_execution_evidence) each publishing one gain and returning, with ABG re-entering between them. Operator-facing "test lane end-to-end" view is produced by zoom_out_fold as a projection over the three-edge sequence, not by any single edge or adapter walking the lane.

5. **Archive the tactical-patch origins** as historical context in the ticket. The Apr-16 requirements were correct; the Apr-18 implementation was expedient; the canonical mechanism wasn't articulated yet. Future reviewers reading B-037 should see why the violation entered and what the canonical repair shape is. This prevents the "approved by usage" drift `ODD_METHOD §9` explicitly prohibits.

The ticket's *diagnosis* is ready for implementation; the ticket's *gating surfaces* are not. The gap is ticket-structure work, not design rework — most of it is wording additions + producing one Mermaid diagram + retiring one 8-line markdown file. Estimated pre-implementation work: half a day. After that, the implementation path is clean.
