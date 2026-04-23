# REVIEW: B-037 post-update closure-readiness

**Author**: claude
**Date**: 2026-04-24
**Addresses**: `.ai-workspace/tickets/active/B-037-test-module-convergence-and-test-run-archive-evidence-boundary-are-misaligned.md` (updated 2026-04-24, 275 → 428 lines)
**Status**: Open

## Summary

Substantially improved and now implementation-ready. The 2026-04-24 update addresses eight of my nine prior gating items with substance, adds the Historical Context pulled from the git archaeology, cites the new ODD_METHOD §11.5A explicitly, and structures the ticket to peer-caliber with B-041 / B-042 / B-044. Remaining minor: one partial item (ingress-collapse *point* not named, though the §3B rule is present as an E3 checkbox), one cosmetic item (subordinate fields empty in the Mermaid diagram), and one standard note (`REALIZED_TEST_SOURCE_OBLIGATION.md` file is still 8 lines of imperative strategy — but now correctly gated as Break Order step 4 implementation work, not ticket-scope work).

**Recommendation: open implementation on B-037 in current shape.** The gating surfaces are in place.

## Analysis

### Gating-item deltas

Nine items flagged in my prior review. Status after the 2026-04-24 update:

| # | Gating item | Prior state | Current state |
|---|---|---|---|
| 1 | §3A Evaluator Gate with three named evaluators | missing | **Added** at L143-174 with Authority Seam Closure / Essential Carrier Consolidation / Typed Enforcement After Proof, 3-4 checkboxes each |
| 2 | §3B Ingress Collapse Rule — named single collapse point | missing | **Partial.** The rule is present as E3 checkbox L171-172: *"malformed or mixed-state evidence is rejected once at the admitted boundary instead of re-parsed in multiple consumers."* The specific collapse function/module name isn't pinned yet; that's implementation-detail and can land during Break Order step 3 |
| 3 | §5F Structural Carrier Diagram | missing | **Added** at L176-216. Mermaid classDiagram with `<<prime>>` TestLaneEvidence, 3 `<<subordinate>>` variants, 3 `<<downstream>>` consumers, 1 `<<deferred>>`, composition + association relationships |
| 4 | §6A Design → Module → Tests Route in Break Order | missing | **Added** at L394 as step 3: *"declare the module-boundary asset for the admitted test-lane carrier before implementation"* |
| 5 | §6B Module-derived unit test lane in proof_surface | missing | **Added** at L40: *"module-derived unit proof for the admitted test-lane carrier variants and malformed-boundary rejection"* |
| 6 | §11A retire or neutralize `REALIZED_TEST_SOURCE_OBLIGATION.md` | missing | **Added across four surfaces**: In-scope L104-105, Break Order step 4 L395, non-closure condition L34, Functional Review Criterion 11 L370 |
| 7 | §11B In-scope / Out-of-scope fence | missing | **Added** at L90-113 with 4 in-scope items + 3 explicit out-of-scope |
| 8 | §14A Functional Realization Review Checklist | missing | **Effectively adopted via expanded 11-question Functional Review Criteria** (up from 9), with two new questions on §11.5A compliance and REALIZED_TEST_SOURCE_OBLIGATION retirement. Not a verbatim §14A adoption but covers the same checkpoints. Defensible |
| 9 | §11.5A citation in Evaluator Gate | missing | **Added** at L154-155: *"the resulting lane obeys `ODD_METHOD.md §11.5A`: each bounded edge publishes one gain and returns control to ABG for re-entry"* |

Eight fully addressed, one partially, one effectively adopted. The one partial (§3B collapse point) is fine to resolve during Break Order step 3 rather than in ticket-wording.

### New additions beyond my prior review

Three structural additions that weren't in my gating list but materially strengthen the ticket:

**Historical Context section (L413-428)**. Directly incorporates the archaeology we did:

> The requirements were already correct before the tactical implementation drift:
> - `REQ-F-ODDSDLC-039` already assigns continuation authority to ABG
> - later tactical convergence pressure repriced `derive_test_run_archive_surface` into a realized-evidence edge without repricing graph order, release semantics, or the canonical zoom-fold mechanism
>
> So this ticket is not discovering a new rule. It is restoring the already authored rule with the now-ratified shared vocabulary.

This closes the `ODD_METHOD §9` drift risk: "no shared structural pattern becomes 'approved by usage'" / "no grey pattern becomes constitutional by drift." Naming the tactical-patch origin plus the now-ratified canonical solution in the ticket itself prevents future reviewers from treating the tactical shape as the baseline.

**Trace Boundary section (L115-141)**. Explicit method-law citation list includes SPEC_METHOD.md, ODD_METHOD.md (new), TICKET_METHOD.md, DESIGN_MODULE_METHOD.md. Ticket now demonstrates method coherence across all four surfaces.

**Dependency updates (L17)**. Adds:
- B-043 completed (shared operational test-execution boundary)
- B-044 completed (shared prepare_release_surface route-law boundary)
- B-047 completed (upstream owner review retired into this ticket)

B-047 folding into B-037 consolidates the test-design-side of the same lineage — cleaner than having two separate tickets on the same graph-order contradiction. Good scope consolidation.

### Structural carrier diagram check

The Mermaid classDiagram at L178-216:

```mermaid
class TestLaneEvidence {
  <<prime>>
  completeness_state
  next_lawful_gain
  blocking_reasons
  evidence_refs
}
```

Prime carrier has four fields pinned. Good — these are the carrier's actual identity-bearing fields (completeness-state + next-gain + blocking-reasons + evidence-refs is the zoom-out-fold / zoom-in-fold / gap / iteration vocabulary made typed).

```mermaid
class PlannedValidationAllocation { <<subordinate>> }
class RealizedTestSource { <<subordinate>> }
class GovernedTestExecutionEvidence { <<subordinate>> }
```

Three subordinates have empty field lists. Under the strictest §5F reading, one key field per subordinate would help anchor the implementation direction — e.g., `RealizedTestSource: source_file_refs, planned_branch_refs`. Optional cosmetic improvement; not blocking.

```mermaid
TestLaneEvidence *-- PlannedValidationAllocation    // composition
TestLaneEvidence *-- RealizedTestSource             // composition
TestLaneEvidence *-- GovernedTestExecutionEvidence  // composition
TestModuleSurface --> TestLaneEvidence              // downstream consumption
TestRunArchiveSurface --> TestLaneEvidence          // downstream consumption
TestExecutionResultSurface --> TestLaneEvidence     // downstream consumption (deferred)
GapFoldView --> TestLaneEvidence                    // downstream consumption
```

Relationships correct: prime composes subordinates (`*--`); downstream consumers use association (`-->`). `TestExecutionResultSurface` stereotyped `<<deferred>>` correctly — it's admitted later after the operational execution lane runs, not in this ticket's active scope.

One nit: `GapFoldView` is marked `<<downstream>>` but it's the zoom-out-fold/zoom-in-fold/gap projection surface — arguably its own prime identity as a separate concept that CONSUMES TestLaneEvidence. Under §5F strictest reading: if `GapFoldView` is the operator-facing surface that produces "appears as end-to-end convergence" for the operator, it's a downstream projection carrier, so `<<downstream>>` is right. Not a defect.

### Non-closure conditions quality check

L31-36 now has 5 bullets:

```
- derive_test_module_surface still converges while derive_test_run_archive_surface blocks only because no realized *Spec.scala files exist
- derive_test_run_archive_surface still requires governed sbt test execution evidence before the operational execution lane is admitted or run
- published runtime prompt context still injects imperative builder strategy about how to proceed across the test lane
- proofs only assert that the lane yielded, without proving whether the yielded stop was semantically lawful
- ticket closure depends on ad hoc explanation instead of one carrier-owned definition of planned vs realized test evidence
```

Bullet 3 is new and directly names the B-042-class drift pattern that was missing from the prior ticket. Good.

### Required Break Order quality check

Now 10 steps (up from 8). The critical additions:

- Step 3: *"declare the module-boundary asset for the admitted test-lane carrier before implementation"* — §6A compliance
- Step 4: *"retire or neutralize `REALIZED_TEST_SOURCE_OBLIGATION.md` as a runtime-published imperative strategy surface"* — §11A + §11.5A compliance

These insert before the implementation steps (5-9), which matches `§6A`'s required order: design → module boundary asset → implementation + unit tests.

### Remaining items to track during implementation

These are not ticket-wording gaps; they're implementation-time items the ticket correctly gates but doesn't pre-solve:

1. **REALIZED_TEST_SOURCE_OBLIGATION.md is still 8 lines of imperative strategy** on the live tree. Break Order step 4 is the instruction to retire or rewrite it. Expected outcome under §11A: replace imperative bullets with governance publication of current-state truth (test source file count, planned branches, realized branches), matching the pattern B-042 used for `REALIZATION_DEEPENING_CONTROL_FRAME.md`.

2. **The specific §3B ingress-collapse point function name** will need to be pinned during Break Order step 3 when the module-boundary asset is declared. Suggestion: if the admitted carrier is named `TestLaneEvidence`, the single collapse function should be something like `admit_test_lane_evidence(workspace_root, planned_surface_refs, realized_source_refs, execution_evidence_refs) -> TestLaneEvidence` — one parse, closed return, consumed by all four downstream surfaces (obligation-ledger, runtime-prompt, deterministic-closure, operator-archive).

3. **Module-derived unit tests** need to exist before closure (§6B). The ticket correctly names them in proof_surface. Suggestion: test names like `test_admit_test_lane_evidence_rejects_planned_only_when_realized_required`, `test_admit_test_lane_evidence_accepts_planned_only_in_planned_phase`, `test_exhaustive_match_over_completeness_state_variants`, `test_malformed_evidence_fails_closed_at_admission`.

4. **Migration Checklist items 6-9 remain unticked** — correct for an active ticket pre-implementation. Items 1-5 (truth paths named, producer/consumer sets listed) are ticked.

### Coordination with completed B-043 and B-044

Dependencies L17 now names B-043 and B-044 as completed. B-037 must share:

- **With B-043**: test-lane evidence shape. `dispatch_operational()` (now single-step cooperative per ADR-002) reads from the test-execution side of the lane. The `TestLaneEvidence` admitted carrier is the boundary B-037 closes; `operational_dispatch` is a consumer on the execution edge. Neither ticket's closure invalidates the other.

- **With B-044**: `prepare_release_surface` route boundary. B-037's repair places `prepare_release_surface` AFTER a lawful `governed_test_execution_evidence` state rather than before archive demands unrealized evidence. The release-edge route authority B-044 established is consumed by B-037's rebind; B-037 doesn't re-author that route.

Both coordination checks are implicit in the current ticket shape. Could be made explicit as "Coordination With B-043 / B-044" section similar to how B-041 has "Coordination With B-042." Minor addition; optional.

## Recommended Action

1. **Open implementation on B-037.** The ticket is now method-compliant and implementation-ready. All nine prior gating items are either addressed in ticket wording or correctly queued as implementation-time work with gate conditions.

2. **During Break Order step 3** (declare module-boundary asset), pin the specific admit-function name and location. The §3B single-collapse-point becomes explicit at that moment.

3. **During Break Order step 4** (retire `REALIZED_TEST_SOURCE_OBLIGATION.md`), match the B-042 retirement pattern: either delete the file entirely, or rewrite to non-imperative observation form (e.g., the current "rationale not runtime-published" pattern B-042 applied to `REALIZATION_DEEPENING_CONTROL_FRAME.md`). If any imperative bullets survive in the new version, §11A closure will fail.

4. **During Break Order step 8** (rebind upstream and downstream edges), preserve the zoom-out-fold vocabulary articulated in Fix Direction. The `GapFoldView` downstream carrier in the structural diagram is the operator-facing projection that replaces the tactical walker shape — make sure it's published as a real read-model surface, not just described in design.

5. **Optional cosmetic tightening** before or during implementation:
   - Add one key field to each subordinate in the Mermaid diagram
   - Add explicit "Coordination With B-043 / B-044" section
   - Add a Links section per TICKET_METHOD.md shape

None of these is closure-blocking. The ticket as it stands is ready to execute.

## Comparison to prior review state

| Axis | B-037 at 2026-04-23 | B-037 at 2026-04-24 |
|---|---|---|
| Lines | 275 | 428 |
| Evaluator Gate | no | yes (three evaluators, 10 checkboxes) |
| Structural carrier diagram | no | yes (Mermaid classDiagram) |
| §6A module-boundary-asset step in Break Order | no | yes (step 3) |
| §11A retirement of imperative strategy context | not named | in-scope + Break Order step 4 + non-closure condition + review criterion |
| §11.5A citation | pre-dates ratification | explicit in Evaluator Gate E1 |
| In-scope / Out-of-scope fence | no | yes |
| Trace Boundary method-law citations | no | yes (4 methods cited) |
| Historical Context (tactical-patch origin) | no | yes |
| Module-derived unit test lane | no | yes (in proof_surface) |
| Peer-caliber ticket shape | no | yes — matches B-041/B-042/B-044 discipline |

This is the cleanest same-day ticket uplift I've reviewed in the series. Go signal given.
