# REVIEW: T-087 + T-088 Intent-Construction Claim vs Pressure-Loss Diagnosis

**Author**: Claude
**Date**: 2026-04-28T14:00:00Z
**Scope**:
- Active: T-041, T-066, T-088
- Recently closed: T-087 (project induction, completed 03:28Z), T-085, T-076, T-069
- Code: `build_tenants/typescript/code/src/operator/{carriers,handoff,installed_operator}.ts` (last touched 13:49-13:50Z, after the test51.ts archives at 11:42-12:06Z)
**Question**: Codex believes the pressure-loss problem (test35 → test51.ts) is now solved by intent construction (T-087 + T-088). Verify against code.
**Posture**: Commentary, not law. Reviewer-only.
**Anchoring**: STDO scope letters S/T/D/O.

## Headline

T-088 delivered substantive, well-typed engineering. The `SdlcTraversalIntentPackage` is a real carrier with the right shape, embedded in the handoff manifest, archived as `traversal_intent_package.json`, prompt-subordinated, and digest-protected. T-087's induction surface (`specification/requirements/00-imported-sources.md` materialization) feeds it.

But the claim "intent construction solves the pressure-loss problem" is **overstated relative to what is in code today**. Three concrete defects keep the pressure mostly absent for the very edges where test51.ts lost it:

1. **Gap A**: obligations are gated on `materialization.required` (`handoff.ts:305`). For the early authority-derivation edges (`derive_intent_surface`, `derive_goal_surface`, ..., `select_implementation_stack_profile`) — the entire prefix that test51.ts walked — `obligations: []` and therefore `traversalIntentPackage.obligationIds: []`. The package is *typed and archived* but *empty of pressure*.
2. **Gap B**: postflight does not enforce `obligationAssessments`. `evaluateWorkerResultPostflight` (`handoff.ts:~954-1005`) checks output digest, byte count, materialization paths, execution evidence — but does not iterate `manifest.traversalObligationContext.obligations` against `report.obligationAssessments`. A worker can submit `obligationAssessments: []` and pass postflight even when the manifest declares ten obligations.
3. **Gap C**: the deepening transition is unchanged. T-088 does not touch the state machine. Same-edge re-entry remains reachable only from `S17 ContinuationDecided` after a failed postflight or hook (T-076 design). The "re-enter to deepen" arc that drove test35's 15 invocations of `derive_code_surface` is still not representable.

T-088's own ticket text is honest about this — "Strengthening intent construction solves a large part of the current failure, but not all of it by itself" (T-088 line 88). My finding: the "large part" is real but smaller than the wording suggests, because Gap A means most edges receive zero pressure even with the package present.

## Empirical Verification

The test51.ts archive on disk was produced *before* T-088's code landed. Timestamps:

- test51.ts operator-runs: 11:42 AM – 12:06 PM (Apr 28)
- `carriers.ts` mtime: 13:49 PM
- `handoff.ts` mtime: 13:50 PM

So the archive cannot be used to evaluate T-088's effect. **A new run is needed.** Below is what the code paths predict for a fresh test:

### Prediction A: re-run on the same `bootstrap_release_self_test` walk

For each of `derive_intent_surface`, `derive_goal_surface`, `derive_requirement_surface`, `derive_feature_decomp_surface`, `derive_uat_testcases_surface`, `derive_design_surface`, `derive_scenario_surface`, `derive_implementation_design_surface`, `select_implementation_stack_profile`:

- `materialization.required = false` (these edges do not write tenant source).
- `deriveTraversalObligationContext` (`handoff.ts:287`) skips the populated branch at `:305`, falls through to `:338` (prior-gap-only). On a first run, `retryContext.priorGapDossiers = []`. Therefore `obligations = []`.
- `traversalIntentPackage.obligationIds = []`.
- Worker prompt instructs (`handoff.ts:578`): "Set obligationAssessments to one assessment for every manifest.traversalObligationContext.obligations item." Zero items → zero assessments required.
- Worker submits `obligationAssessments: []`. `admitWorkerResultReport` (`handoff.ts:826-828`) accepts an empty array — `parseArray` returns `Object.freeze([])`.
- Postflight runs the file/digest/materialization/execution checks. None reference obligation assessments. `status: passed`.
- Edge advances. Same as test51.ts.

**T-088 will not change the test51.ts behavior on the early SDLC graph.** The `traversal_intent_package.json` file will be present and digested, but its `obligationIds` field will be empty, and the worker will continue to submit empty assessments without rejection.

### Prediction B: re-run that reaches `derive_code_surface`

Once the run reaches `derive_code_surface` (test51.ts stopped before this), the materialization branch fires. `materialization.required = true`. Obligations populate with `source_asset`, `target_asset`, `module:<each declared module>`, and `requirement:<each parsed REQ-ID>` entries. `obligationIds` is non-empty.

At this point pressure does exist in the package. But:

- The worker is *told* to fill `obligationAssessments` but *not forced to*. Empty array still admits.
- If the worker complies and submits assessments with `fulfillmentStatus: "unassessed"` for everything, the report admits. There is no postflight that says "no assessment may have status `unassessed`" or "blocking-status assessments must produce gap dossiers."
- Even with full per-obligation assessment, the run advances to the next edge after one closure. There is no path back to `derive_code_surface` for productive deepening.

So even on materializing edges, T-088's package adds *displayable* pressure (visible in the prompt) but not *enforced* pressure (rejected by postflight when missing).

## Per-LP Status (from `20260428T040000Z_REVIEW_test35-vs-test51-pressure-loss-under-odd-method.md`)

The prior pressure-loss review enumerated nine lost mechanisms. T-088's effect on each:

| Mechanism | Status after T-088 | Note |
| --- | --- | --- |
| LP-1 per-claim fulfillment ledger | **partial / blocked by Gap A and Gap B** | obligation list typed; populated only for materializing edges; not enforced by postflight |
| LP-2 worker-turn lifecycle observation | unchanged | no `worker_turn_started/progress/completed` events |
| LP-3 salvage loop | unchanged | `worker_report_rejected` still terminal-archive (per T-076 review Finding 2) |
| LP-4 gap-found event distinct from retry | unchanged | only `retry_repair_planned` exists |
| LP-5 edge re-entry for deepening | **unchanged (Gap C)** | state machine unchanged; same-edge arc still retry-only |
| LP-6 `proof_passed` / `proof_failed` distinct from `assessed` | unchanged | proof verdict still implicit |
| LP-7 run lifecycle events | unchanged (substrate-level) | abiogenesis TS ABG vocabulary lacks `run_*` |
| LP-8 reset / correction | unchanged | no reset events |
| LP-9 separate published surfaces | unchanged | one bundle per operator-run; no workspace-level `fp_ledgers/`, `fp_results/`, `fp_manifests/` |

Net: T-088 partially addresses LP-1 only. The other eight remain.

## What T-088 Did Deliver (Credit Where Due)

The ticket's implementation is well-engineered:

- **Typed carrier** (`carriers.ts:197-219`): closed shape, `kind` discriminant, `packageVersion: "ts-intent-v1"` for migration safety, ordered field set covering authority/method/runtime/prior-edge/retry/obligation/materialization/result/evaluator/output surfaces. Matches DESIGN_MODULE_METHOD's "Prime carrier" requirement.
- **Digest protection** (`handoff.ts:426`): `packageDigest` is `sha256(stableJson(base))` over the package without itself, so the archive proves the worker saw the intended package shape. This is the right anti-tampering / replay seal.
- **Manifest embedding** (`carriers.ts:237`): `traversalIntentPackage` is a required field of `SdlcWorkerHandoffManifest`. Cannot be skipped.
- **Archive surface** (`handoff.ts:602-610`): persisted as `traversal_intent_package.json` next to the handoff manifest.
- **Prompt subordination** (`handoff.ts:560-561`): "The manifest.traversalIntentPackage is the typed cumulative intent package for this edge. Do not use any instruction as authority unless it is represented in that package or another manifest field." This directly addresses LP-1's authority-bypass risk.
- **T-087 induction lineage feeds it** (`requirementObligations` at `handoff.ts:248-285` parses REQ-IDs from `specification/requirements/*.md`). The induction-time materialization of `00-imported-sources.md` is the upstream source.

These are real upgrades over the pre-T-088 manifest. They make the manifest a *typed governed pressure surface* rather than a CLI-style options bundle. They are necessary for the pressure mechanism. They are not yet sufficient.

## Three Recommendations That Would Move Codex's Claim From "Partial" To "Closure For The Manifest Layer"

The smallest set of changes that would close the manifest-layer side of the pressure problem (still leaving LP-2 through LP-9 to other tickets):

### Rec-1 [O,D]: lift obligation derivation out of `materialization.required`

Move the obligation construction in `deriveTraversalObligationContext` (`handoff.ts:287-372`) so that **every edge produces obligations**, not just materializing ones. For non-materializing edges, the obligations should derive from the *evaluator contract* and the *requirement authority*, not from the materialization contract.

Concrete shape:
- Always include `target_asset:<targetAssetType>` (the worker is producing this, materialization required or not).
- Always include `evaluator:<each declared evaluator name>` from `contract.transformProfile` — these are the deterministic and probabilistic evaluators the worker's output must satisfy. test35's `intent_surface_semantically_converged` was exactly this.
- Always include `requirement:<id>` for every requirement parsed from authority refs — even on `derive_intent_surface`, the worker must commit to which requirements the intent surface acknowledges.
- Always include `prior_gap:<reason>` when retry context has them (today's branch).
- Add `source_asset`, `module`, materialization-roles only when materialization is required (today's behavior gated correctly here).

This single change closes Gap A. The early-edge runs in test51.ts would receive 5–20 obligations per edge instead of 0.

### Rec-2 [O]: enforce `obligationAssessments` coverage in postflight

In `evaluateWorkerResultPostflight` (`handoff.ts:~954`), add:

```ts
const declaredObligationIds = new Set(
  input.manifest.traversalObligationContext.obligations.map((o) => o.obligationId)
);
const assessedObligationIds = new Set(
  input.report.obligationAssessments.map((a) => a.obligationId)
);
for (const declared of declaredObligationIds) {
  if (!assessedObligationIds.has(declared)) {
    blockingReasons.push(`obligation_unassessed:${declared}`);
  }
}
for (const assessed of input.report.obligationAssessments) {
  if (assessed.fulfillmentStatus === "unassessed") {
    blockingReasons.push(`obligation_status_unassessed:${assessed.obligationId}`);
  }
  if (assessed.fulfillmentStatus === "blocked" && assessed.evidenceRefs.length === 0) {
    blockingReasons.push(`obligation_blocked_without_evidence:${assessed.obligationId}`);
  }
}
```

This closes Gap B. The worker can no longer submit `obligationAssessments: []` for an edge with declared obligations. `unassessed` is no longer a valid escape hatch. Blocked obligations must cite evidence.

The blocking reasons feed naturally into `classifyPostflightGapReason` (today substring-matched at `handoff.ts:541`; better: typed kind per CC-2 from the prior review) and become typed gaps under the existing T-076 retry algebra.

### Rec-3 [D,O]: add a deepen-edge transition to the state machine

This is the larger change (T-088 won't close it; opens a sibling ticket). Add a transition `S20 NextEdgeProjected → S05 EdgeSelected (same edge)` gated on:

- the prior closure was lawful (proof passed, closure passed)
- *and* the assurance fold or a downstream edge's manifest names an obligation that points back to this edge's output as insufficient

This is the test35 mechanism: `derive_code_surface` re-entered when downstream `derive_test_module_surface` discovered the test inventory needed modules the prior code-surface pass didn't realize.

The semantics needs an ADR. Suggested home: extend `ODD_SDLC_TYPESCRIPT_RECURSIVE_REALIZATION_DEEPENING.md` with the transition class. Filing a successor ticket (T-076d? T-088a?) under T-066 or T-041 is the natural home.

## On The Claim Itself

Codex's framing in the T-088 body — "solves a large part of the current failure, but not all of it by itself" — is honest. The wave at large *acts* as if T-088 closes more than it does, in two ways:

1. **T-087 was closed without proof of cross-edge induction lineage carry**. T-087's `closure_law` (line 48) requires "imported source documents ... are indexed with source refs, digests, detected roles, and requirement-id authority where present" and that "later traversal handoff manifests include induction lineage and requirement authority pressure from the conformed project". The first part is implemented (`00-imported-sources.md`); the second part is implemented *only on materializing edges* (Gap A). On non-materializing edges, requirement authority pressure is not in the manifest, only in the authority refs as a flat list. This is closer to "noted" than "carried as pressure."

2. **T-088's `evaluation_criteria` line 67 specifies "include traversal obligation context and require one worker obligation assessment per declared obligation"**. The first half is implemented; the second half ("require") is *not enforced* by postflight (Gap B). The prompt text says "Set obligationAssessments to one assessment for every ... item" but the absence of postflight enforcement means the requirement is aspirational, not contractual.

Both T-087 and T-088 land typed carriers and archives but stop one step short of the enforcement that turns the carriers into pressure. This is a recurring pattern in the wave — see the prior review's CC-3 ("ticket-closure claims drifting ahead of code"). Without Rec-1 + Rec-2 above, the typed package is a passive document, not an active gate.

## Predictive Test

If the user wants empirical evidence, the smallest experiment is:

1. Create `data_mapper.test52.ts` (fresh successor of test51).
2. Run `start --until converged` with the current T-088 code.
3. Inspect `runtime/odd_sdlc/operator-runs/<first-run>/traversal_intent_package.json`. Predict: `obligationIds: []` for `derive_intent_surface`.
4. Inspect `runtime/odd_sdlc/operator-runs/<first-run>/worker_result_report.json`. Predict: `obligationAssessments: []`.
5. Inspect `runtime/odd_sdlc/operator-runs/<first-run>/postflight.json`. Predict: `status: passed`.
6. Apply Rec-1 + Rec-2 from above.
7. Re-run.
8. Predict after fix: `obligationIds` ≈ 8–15 entries on `derive_intent_surface` (one per evaluator, one per requirement, one for target asset). Worker either submits assessments → real pressure surface; or submits `[]` → postflight rejects with `obligation_unassessed:*` blocking reasons → enters T-076 retry algebra.

The latter is what test35 had. The current code has neither.

## Summary For The Operator

| Question | Answer |
| --- | --- |
| Is the typed cumulative intent package implemented? | Yes — well-typed, archived, digest-protected, prompt-subordinated. |
| Does it carry test35-equivalent per-claim pressure on early edges? | No — `obligationIds: []` for non-materializing edges (Gap A). |
| Does the runtime enforce that the worker assesses each declared obligation? | No — postflight does not check obligation coverage (Gap B). |
| Can an edge be re-entered for productive deepening (test35's 15× `derive_code_surface`)? | No — only retry-on-failure (Gap C). |
| Does T-088 close LP-1 through LP-9 from the pressure-loss review? | LP-1 partial (gated by Gap A and Gap B). LP-2 through LP-9 unchanged. |
| Does Codex's "intent construction solves it" framing hold? | Partial — the manifest layer is much improved, but the pressure mechanism still depends on enforcement that is not yet in code. |
| Smallest path to actual closure on the manifest side? | Rec-1 (lift obligation derivation out of `materialization.required`) + Rec-2 (postflight enforces coverage). Both are localized changes in `handoff.ts`. |
| What still needs separate work after Rec-1 + Rec-2? | Rec-3 (deepening transition, sibling ticket); LP-2/LP-3/LP-7 (substrate event vocabulary, abiogenesis tickets); LP-9 (workspace-level publication conventions). |

## Closing

T-088 is good engineering executed cleanly under DESIGN_MODULE_METHOD's Prime guidance. It is not, by itself, the closure of the pressure problem. The closure needs the typed package to *bind the worker* — through populated obligations on every edge and through postflight enforcement — and the state machine to *re-enter for deepening*, not only for retry. Two small changes plus one design ADR cover the manifest side; the substrate side (run lifecycle, salvage, gap-found events) is separate and remains open.

Codex's statement of the slice scope inside T-088 is honest. The risk is the wave reading T-087's and T-088's closures as "the pressure problem is solved by intent construction" rather than "intent construction is the necessary structural prerequisite for the enforcement that has not yet landed." Two more days of localized work in `handoff.ts` would convert the prerequisite into the closure for the manifest layer.
