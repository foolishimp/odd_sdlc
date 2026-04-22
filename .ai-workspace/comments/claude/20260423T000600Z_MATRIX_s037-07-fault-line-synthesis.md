# MATRIX: S-037 Deliverable 3 — Fault-Line Synthesis

**Author**: claude
**Date**: 2026-04-23T00:06:00Z
**Addresses**: S-037 §Deliverables 3; closes the review set by mapping recurring fault categories to files, to active tickets, and to recommended follow-on work
**Status**: Open

## Summary

Across the S-037 review set (13 files, 10 445 lines), 37 distinct fault lines were named (F-01 … F-57, with some numbers retired during consolidation). This post synthesizes them into nine categories (the S-037 §Evaluation Criteria taxonomy) and maps each to:

- the files where the fault appears
- the ticket it belongs to (existing or recommended)
- the relative priority (`critical` = blocks ticket closure; `high` = lawful refactor worth a slice; `medium` = cosmetic-adjacent but improves auditability; `low` = note-only)

The dominant patterns are **hidden semantic center** (11 instances) and **split carrier vs controller authority / interface bleed** (9 combined instances). **Proxy compatibility authority** and **effect leakage** have fewer instances but are concentrated on the two most load-bearing files. **Hidden mutation** is rare — the codebase generally publishes through explicit effect edges.

Good news: **no critical fault that requires emergency remediation outside the active ticket set was found.** B-035 and B-036 together cover the two critical defects. S-037 itself remains the right instrument for a lawful refactor slice to land after those tickets close.

## Fault-line synthesis matrix

Categories are as defined in S-037 §Evaluation Criteria. Priority reflects "how much this matters to current repair wave stability", not absolute engineering debt.

| # | Category | Files affected | Fault IDs | Related ticket | Priority |
|---|---|---|---|---|---|
| 1 | **Hidden semantic center** (controller or wrapper code decides domain meaning) | `app.py` (`_run_public_next_start`), `triage.py` (`_build_triage`), `requirement_closure.py` (`fulfillment_rule`, `derivation_rule`), `homeostatic_loop.py` (`apply_constitutional_proposal`), `start_targeting.py` (`_governing_target_handle_for_asset`), `constructor.py` (`_construct_release`, `_construct_deployment_surface`), `query.py` (asset-checkpoint folding) | F-02, F-03, F-07, F-12, F-23, F-33, F-40, F-41, F-49, F-51 | B-036, (new) **B-037 typed public-start-outcome** | high |
| 2 | **Incomplete migration** (new path exists but co-exists with old path) | `app.py` (`start` target-type split-brain), `analysis.py` (`refresh_analysis` atomicity) | F-01, F-26 | B-035 (widen scope), (new) **B-038 refresh_analysis atomicity** | critical (F-01) / medium (F-26) |
| 3 | **Split carrier vs controller authority** | `triage.py` (proposal-kind eligibility), `repair_frontier.py` (lambdas over dict shape), `start_targeting.py` (asset-id frozensets), `span_analysis.py` (capability-gap split with `app.py`), `analysis.py` (`_artifact_kind_for_path` tables), `traceability_index.py` (`_trace_paths` helpers), `constructor.py` (path-constant policy) | F-06, F-13, F-30, F-37, F-46, F-28, F-57 | S-037 follow-on refactor slice | medium |
| 4 | **Interface bleed** (one interface reconstructs or consumes another's internal shape) | `app.py` (ABG result-dict string inspection, capability augmentation), `triage.py` (runtime_config shape), `repair_frontier.py` (reads closure register dict keys), `analysis.py` (CLI prose in kernel errors), `constructor.py` (topology contract w/ edge harness, realization-language leak) | F-02, F-05, F-17, F-27, F-46, F-50, F-52 | B-036 (F-02), S-037 follow-on (rest) | high (F-02) / medium (rest) |
| 5 | **Proxy compatibility authority / proxy interface** | `homeostatic_loop.py` (`workflow_version` from fingerprint fallback, `run_homeostatic_self_check` in prod code), `constructor.py` (Python hello-world stub, proving-subset self-test) | F-24, F-25, F-50, F-54 | S-037 follow-on | medium |
| 6 | **Effect leakage into kernel / hidden mutation** | `triage.py` (shallow-findings filesystem scan, 5-event fan-out), `execution_contract.py` (prose formatter in kernel), `gap_dossier.py` (prose formatter in projection), `homeostatic_loop.py` (constitutional surface append), `constructor.py` (code-surface mutators), `analysis.py` (multi-write transaction) | F-9, F-15, F-16, F-20, F-23, F-26, F-53 | (new) **B-039 constitutional-surface write discipline** (F-23 only); rest → S-037 follow-on | high (F-23) / medium (rest) |
| 7 | **Unstable identity / refresh semantics** | `triage.py` (dict-shaped projection), `gap_dossier.py` (`head_gap` is positional), `traceability_index.py` (no fingerprint on index), `execution_contract.py` (projection round-trip lossy) | F-14, F-18, F-36, F-11 | S-037 follow-on | medium |
| 8 | **Non-prime function / helper sprawl** (Prime Law §5) | `requirement_closure.py` (`_build_edge_obligation_ledger` 5 callables), `span_analysis.py` (`span_gap_analysis` duplicates pipeline), `triage.py` (`_build_triage` cascade) | F-12, F-29, F-42 | S-037 follow-on | high (F-12, F-29) / medium (F-42) |
| 9 | **Coupling / interface under-specification** (lawful but brittle) | `gap_dossier.py` (`PublicNextStartBlock.status`/`resolution_kind` mix; gate invariant undocumented), `span_analysis.py` (tri-valued convergence bools), `requirement_closure.py` (status strings), `start_targeting.py` (fallback to bootstrap) | F-19, F-21, F-31, F-43, F-7 | S-037 follow-on | low–medium |

## Critical-path findings (block ticket closure)

Two fault lines are **critical** to the current repair wave:

1. **F-01 — `app.start` only consults the head-gap carrier for `target == "next"`.** The B-035 fix is inside the `next` branch. Explicit-target starts (`graph_function:*`, `asset:*`, work-item handles) still enter `admit_bound_execution_start` past a published `pending_fh` head. **B-035 cannot honestly close until the consult is target-type-agnostic.** See post 02 for the proposed extraction.

2. **F-02 / F-03 / F-04 — yield vs terminal-error projection in `_run_public_next_start`.** The function recognizes `dispatch_result.status == "yield"` by string inspection; the `continuation_opened` truth is not consumed as a typed carrier at the public boundary. **This is exactly B-036's defect surface.** The proposed `PublicStartIterationOutcome` carrier (post 02 §Recommended Action 2) is the correct landing site.

Both belong inside existing tickets; neither requires a new ticket. But B-035's current evaluation criterion needs its `target=next` scope widened; B-036's proof shape needs to anticipate that reproducing it on a B-035-fixed install requires pre-seeding a workspace past intent, not using `test36` as-is.

## Recommended new tickets

The review surfaces three candidates for **new tickets** beyond B-035/B-036:

### B-037 (recommended) — Typed `PublicStartIterationOutcome` carrier

- **Scope:** `app._run_public_next_start` and adjacent result-dict mutation sites.
- **Target truth:** Replace ad-hoc result-dict string inspection with a typed outcome carrier (`ConvergedResult | YieldedResult | BlockedResult | ProofHoldResult | TraversalContinue | DispatchRequiredContinue | FailureResult`). The `_run_public_next_start` loop reduces to `match outcome: case … → effect → continue-or-return`. Closes F-02, F-03, F-04.
- **Relationship to B-036:** B-037 is the *mechanism* by which B-036's yield-projection rebinding actually happens. B-036 can fold B-037 into its Required Break Order step 2 ("project continuation-opened runtime truth into one typed public recovery carrier"), or B-037 can stand alone as the kernel refactor that B-036 then consumes. Operator call on whether to split.

### B-038 (recommended) — `refresh_analysis` atomicity

- **Scope:** `analysis.refresh_analysis` — 6-write publication transaction without atomicity.
- **Target truth:** All 6 artefact writes + workspace-state flip either all succeed or the workspace remains in the prior fingerprinted state. Current behavior: partial failure leaves orphan artefacts at the new fingerprint.
- **Priority:** Medium; becomes critical only if a `refresh_analysis` failure produces mixed-fingerprint state that downstream `gaps` trusts.
- **Evidence from test36:** not directly implicated, but test36 ended in `blocked_stale_analysis` for 7 edges after the final `fp_runtime_failure`, which was handled correctly because `workspace_state.ready` wasn't flipped. A higher-order failure mode (e.g. requirement register write succeeds, repair frontier write fails) would bypass that guard.

### B-039 (recommended) — Constitutional-surface write discipline

- **Scope:** `homeostatic_loop.apply_constitutional_proposal` — the load-bearing Markdown-block append to constitutional surfaces (`specification/INTENT.md` etc.).
- **Target truth:** Constitutional surface mutation is carried by a typed `ConstitutionalApplicationPlan` and an explicit `apply(plan) → ConstitutionalApplicationResult` effect with pre/post digest, fail-closed preconditions, and a structured journal entry. Current Markdown-block append works for human-proxy workflows but is not a defensible ABG-driven auto-application path.
- **Priority:** Low if the auto-application path stays human-proxy; medium–high if odd_sdlc starts routinely applying proposals without human review.
- **Defensive footprint:** Should specify which proposal kinds may be auto-applied vs require human approval regardless of policy mode.

## Recommended refactor slice (S-037 follow-on)

Once B-035, B-036, and (optionally) B-037 land, a single lawful refactor slice would address the following as a coherent unit:

| Slice step | Fault IDs | Files |
|---|---|---|
| 1. Introduce `EdgeTriageProjection` carrier | F-14 | `triage.py`, `gap_dossier.py`, `app.py` |
| 2. Classify `_build_triage` cascade into a typed `TriageCase` ADT | F-12 | `triage.py` |
| 3. Introduce `FulfillmentRule` + `DerivationRule` enums + single dispatcher | F-40, F-41 | `requirement_closure.py` |
| 4. Typed `RequirementEntry` carrier consumed by `repair_frontier` | F-46 | `repair_frontier.py`, `requirement_closure.py` |
| 5. Extract shared `build_gap_surface_payload(..., span=None)` from `_build_gap_surface` and `span_gap_analysis` | F-29 | `app.py`, `span_analysis.py` |
| 6. Extract `ReleaseAssessment` + `OperationalBinding` classification out of `constructor.py` | F-49, F-51 | `constructor.py`, new `runtime_assessment.py` |
| 7. Move capability-gap augmentation into `span_analysis.py` (or `capability_gap.py`) | F-5, F-30 | `app.py`, `span_analysis.py` |

Order is significant: step 1 unblocks step 2 cleanly; step 2 removes the cascade; step 3 makes step 4 trivial; steps 5–7 are independent and can run parallel.

Cosmetic items (effect-edge file moves, typed errors in `ensure_workspace_ready`, prose-formatter relocations, `head_gap` explicit field) can fold into each step as encountered. No ticket required.

## Items explicitly NOT required

Despite being named in the S-037 evaluation-criteria taxonomy, the following received no qualifying instance in the review set:

- **No unsafe hidden mutation through globals or singletons.** `OddSdlcApp` is passed as a parameter, not a module singleton. All mutation is against named paths or through explicit effect functions.
- **No proxy interfaces masquerading as real migration on critical paths.** F-25 (`run_homeostatic_self_check`) and F-50 (Python hello-world stub) are the only proxy-shaped items, and neither is load-bearing for the active tickets.
- **No signs of ambient exception-driven control flow.** Failures are raised with specific exception types (`GapDossierUnavailableError`, `RequirementClosureUnavailableError`, `ExecutionContractSurfaceError`, `ValueError` with explicit messages). Effect shells return status dicts; kernels return typed carriers or raise.

## Matrix: fault line → post reference

For traceability, each fault line's home post:

| Fault | Post |
|---|---|
| F-01 to F-11 | `20260423T000100Z_REVIEW_s037-02-public-control-cluster.md` |
| F-12 to F-25 | `20260423T000200Z_REVIEW_s037-03-homeostatic-carrier-cluster.md` |
| F-26 to F-35 | `20260423T000300Z_REVIEW_s037-04-analysis-projection-cluster.md` |
| F-36 to F-48 | `20260423T000400Z_REVIEW_s037-05-closure-proof-cluster.md` |
| F-49 to F-57 | `20260423T000500Z_REVIEW_s037-06-constructor.md` |

## Recommended Action

1. **Widen B-035 closure clause** to require the head-gap consult on all target types, not just `target == "next"` (F-01). Test36 stays frozen; the new-install re-run becomes the closure artefact for the widened clause.
2. **Update B-036 proof surface** to anticipate that the canonical reproducer cannot be `test36` (it requires B-035 bypass to reach the `continuation_opened` event); specify a pre-seeded workspace recipe.
3. **Open B-037** (typed public-start-outcome carrier) — optional; can fold into B-036.
4. **Open B-038** (refresh_analysis atomicity) — medium priority; schedule after B-035/B-036.
5. **Open B-039** (constitutional-surface write discipline) — priority depends on auto-application policy trajectory.
6. **Schedule the 7-step S-037 follow-on refactor slice** as one ticket after B-035/B-036/B-037 land; name it "typed carriers across triage/requirement/gap pipeline" or similar. Timing: treat it as design-method hygiene, not urgent repair.
7. **Close S-037** once (1)–(2) are landed against B-035/B-036 and (3)–(6) are either opened or explicitly deferred with rationale. The durable artefacts left behind — this post, the 5 per-cluster reviews, the Core Domain Model post — are the S-037 Proof Surface.

## Closing note

The review did not find the odd_sdlc core to be structurally broken. It found a core that is **mid-migration**: typed carriers exist at boundaries (`gap_dossier`, `execution_contract`, `span_analysis` are clean) but have not yet propagated into the largest kernels (`triage`, `requirement_closure`, `_run_public_next_start`), where the last-mile dict-shape and string-dispatch patterns remain. That pattern is consistent with the ticket history ("implementation migration" is listed as the category on both B-035 and B-036) and does not suggest a design-method problem — it suggests the migration should finish.

The repair-wave bugs are downstream of exactly this half-migrated state: controllers still rebuild meaning from raw dicts, so a shape change in one place silently bypasses a guarantee in another. The remedy is not to rewrite the core; it is to land the last carrier-typing passes and let the Prime Law close on one consistent shape.
