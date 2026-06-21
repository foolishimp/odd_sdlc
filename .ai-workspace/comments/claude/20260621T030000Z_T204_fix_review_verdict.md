# T-204 Fix-Review Verdict — H1/H2 (odd_sdlc TypeScript tenant)

Reviewing the fix for the two HIGHs in the prior cross-repo verdict (`…20260621T020000Z_T204_cross_repo_review_verdict.md`). Working tree at HEAD `d7dac6b` + uncommitted. Adversarially verified (33 agents, 19 confirmed / 8 refuted) and hand-checked. Build `build:semantic` ✓, `lint` ✓ (0), focused gates **133/133**. Commentary, not ratified.

## Verdict line
- **H1** (`currentPostflight` short-circuit): **VERACIOUS ✓ · APPROPRIATE ✓.** Repairable blockers reach a retry-eligible disposition; no residual re-code path; preserves the original F_D carriers through the gap dossier per STDO.
- **H2** (predecessor design-register scrape): **VERACIOUS ✓ · APPROPRIATE ✓.** The closure-disposition scrape is removed end-to-end; structural-match-only + fail-fast-on-ambiguity is the recommended fix and does not invert prior intent.

## H1 — veracity + test quality
- **Veracity: clean, no residual path.** `installed_operator.ts:4284-4341` sets `blockingReasonCarriers: Object.freeze(currentPostflightBlockers)` (the original carriers, no recode), returns `current_postflight_blocked:<codes>` and `return`s at `:4322` **before** any `review_grade_assessment_invalid` block (`:4348+`). `constructPostflightGapDossier` derives `retryEligible`/`nextLawfulActions` from those carriers (`gap_dossier_plan.ts:40-48` gates on `same_edge_retry`/`escalate_to_fp`/`repair_worker_output`). The pre-fix non-retryable `triage_gap` short-circuit is gone.
- **Test quality: source-text-only — MEDIUM gap.** `test_t182:3431-3497` greps `installedOperatorSource` (`assert.match(installedOperatorSource, /currentPostflightBlockers\.length > 0/)` etc.) — it never invokes `materializeReviewGradeEdgeFulfillmentWithFpEvaluator`, and the fabricated blocker (`staged_authority_missing`) isn't even a repairable `same_edge_retry` carrier, so the behavioral core is unexercised. The regex pins current spelling and breaks on refactor.

## H2 — veracity + appropriateness
- **Veracity: scrape fully removed.** `design_depth_register.ts:352-369` filters only structurally (`predecessorDesignRegisterArchiveMatchesCurrent`) + file existence; 0 hits for `disposition|sdlc_edge_closure_decision|fp_evaluate_result|acceptedArchiveRoots`. The installed-operator-side scrape (`syntheticClosureGapDossierFromArchiveRoot`) is also deleted; the surviving `syntheticGapDossiersFromClosureDecision` consumes an **in-memory** `deriveSdlcEdgeClosureDecision` over `input.state`, not a persisted-file read.
- **Appropriateness: no regression; fail-fast is intended and BEHAVIORALLY tested.** Returning all structural candidates does not admit stale design — `admitImplementationDesignRegisterForManifest:746` rejects on `>1` candidate with `design_depth_fp_evaluator_register_ambiguous` and surfaces *all* candidates' evidence (the opposite of the old drop-non-selected bug). `test_t181:1993-2186` writes a blocked **and** a closed predecessor and asserts `rejected` + ambiguous + both evidences present — proving the disposition file is deliberately not consulted.

## Two corrections to my prior verdict
1. My claim "no test rejects `sdlc_edge_closure_decision` as authority" was **wrong for the H2 path** — `test_t197:224-233` now `doesNotMatch` on `predecessorDesignRegisterArchiveIsAccepted`/`acceptedArchiveRoots`/`sdlc_edge_closure_decision.json`/`postflight.json` against `design_depth_register.ts` (source-text guard, one file).
2. The working-tree edit at `plugins/evaluate/design_depth_register.ts:355-369` is a behavior-equivalent filter-chain hoist — **H2's substantive fix is the closure-scrape deletion in `installed_operator.ts`**, not that refactor.

## Incidental risk in the 514-line `installed_operator` churn + transforms
- **Denominator narrowing — MEDIUM (test-quality).** `workerReportWithReviewGradeAssessment` now returns only `reviewedRows` (`:4226-4229`) and `edgeFulfillmentProjectionFor` (`:6207-6233`) scopes the denominator to `reviewedObligationIds`. **Bounded-safe** — `admittedReviewGradeAssessmentForState` rejects any in-scope unreviewed obligation (`review_grade_obligation_unreviewed`), and non-admission falls back to the full denominator; **no constructible input closes an edge with genuinely-in-scope unreviewed work.** But this is the most behaviorally consequential change in the diff and it has **only a source-text regex** (`test_t182:2716-2744`); `edgeFulfillmentProjectionFor` is unexported and untested.
- `launch_contract.ts:5338` retry-repair queue narrowed to `blocked` (drops `unassessed`) — requirement is not lost (falls through to the fallback as future pressure); behaviorally tested (`test_t120` 20/20). OK.
- `result_projection.ts:1204-1251` materialization-authority memo refactor (mirrors `observation.ts`); **second hunk `:1108-1114` silently reorders `rolePolicyRef` precedence** to match canonical `observation.ts:303-309` — intended alignment, not a regression, but track as distinct from H1/H2 for commit hygiene.
- `operator/design_depth_register.ts:671-715` path-escape guard + mtime idempotency — reasonable hardening, undocumented against any defect ID.

## Completeness — what the fix leaves open
- **Archive-scrape guard is per-file/per-symbol, not class-wide — MEDIUM.** Only `test_t197:224-233` (source-text, scoped to `design_depth_register.ts`). No structural gate rejects `readFileSync` of `gap_dossier.json`/`sdlc_edge_closure_decision.json`/`handoff_manifest.json` as control authority across `operator/`. The class is still live (`installed_operator.ts` reads these in retry/gap paths: `gap_dossier.json:837/983`; `handoff_manifest.json:1017/3553/5003/5028/8001`), and **the same 514-line churn added a third archive-`readFileSync` retry-control path** — `latestRuntimeAttemptRunIdForRetryContext` (`:997-1036`, reads `handoff_manifest.json`).
- **M1–M4 confirmed untouched (next-cut):** M1 ledger/closure/next-action authorship (`installed_operator.ts:8219/8224/8241`); M2 retry-context scraping (`:874/962/983`, narrowed but not eliminated); M3 gaps API (`workspace_api/entry.ts:392/429/449/541/893`); M4 installer event authorship (`event_store.ts:58/71`, `installer.ts:41`).
- **Durability:** the two HIGH symptoms are durably patched (no concrete input fails today), but the **defect class is open** — fixing the symptoms without the class-wide guard let the same diff regrow a third instance.

## Bottom line
**Fix is correct but incomplete — ship + track.** Both HIGHs are veracious and appropriate end-to-end, no residual exploit path, no regression; H2 has genuine behavioral coverage. Land it, but **do not mark T-204 closeable.**

Follow-ups, in order:
1. **Add the class-wide archive-scrape guard** (structural gate: fail when any `operator/` source reads `gap_dossier.json`/`sdlc_edge_closure_decision.json`/`handoff_manifest.json` via `readFileSync` as control-flow authority), then sequence M1–M4 behind it — folding in the new path at `installed_operator.ts:997-1036` — so remediation doesn't regrow the pattern.
2. **Replace the H1 source-text regex** (`test_t182:3484-3493`) with a behavioral test driving the materialize/dossier path with a real `same_edge_retry` carrier, asserting `retryEligible===true` + reason `current_postflight_blocked:`. Same for the denominator-narrowing wiring (`edgeFulfillmentProjectionFor`).
