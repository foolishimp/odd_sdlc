# REVIEW: T-194 ABG4 Migration STDO Triage And T-195 Follow-On

**Author**: grok
**Date**: 2026-06-08T04:24:53Z
**Addresses**:
  - `.ai-workspace/tickets/completed/T-194-migrate-typescript-tenant-to-abg-4-0-0-rc-2.md`
  - `.ai-workspace/tickets/completed/T-195-close-t194-proof-and-release-hygiene.md`
  - `build_tenants/typescript/` migration and proof surfaces
**Status**: Open

## Summary

T-194 lawfully repriced product and requirement truth for ABIogenesis
`4.0.0-rc.2`. Constitutional migration mechanics are sound. STDO triage
places residual pressure at **Tests/Proof**, not Product or Requirements.
T-194 should remain completed for the substrate repricing; **T-195** owns
proof hygiene, live-harness repricing, prompt-inventory completion, and atomic
commit of the migration revision.

This post records two review passes, the STDO triage verdict, and the follow-on
ticket strategy. Commentary only — not constitutional law.

## Current Reality

### What T-194 achieved

- Package pin resolves `@abiogenesis/typescript-tenant@4.0.0-rc.2` from the
  immutable release snapshot.
- `specification/PRODUCT.md` and `ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT`
  name `4.0.0-rc.2`.
- Active graph/runtime policy refs repriced to version-neutral SDLC identities
  (for example `policy://odd-sdlc/staged-compute`).
- Review-grade handoff consumes ABIogenesis `GtlContractFulfillmentBinding`.
- SDLC supplies inventory; ABG owns `typecheckGtlProgram(...)`.
- Focused proofs pass on working tree:
  - `npm run test:t194` — 3/3
  - `npm run test:t028` — 3/3
  - `npm run test:t059` — 10/10
  - `npm run test:t180` — 9/9
  - `npm run test:t182` — 16/16

### What remains open

- ~80+ files from the T-194 surface remain uncommitted at review time.
- `test_t110_live_agent_pty_installed_operator.test.mjs` still pins
  `3.7.1-rc.1` and `abg.fallbacks.json`.
- `test:t194` inventories two prompt families; production has three
  (`evaluate_design_depth` omitted).
- Stale-identity scan roots exclude `test_env/live`.
- `selectComponentRowForObligation` in
  `review_grade_edge_fulfillment.ts` still falls back to `rows[0]`.
- T-194 acceptance evidence still cites `test:t194` 2/2.

## Analysis

### Review pass 1 (initial)

Scoped review of T-194 affected_boundary vs `HEAD`.

Findings:

| Severity | Finding | State after pass 2 |
| --- | --- | --- |
| bug | `stateWithReviewGradePostflight` dropped `postflight` field | **Fixed** |
| bug | T-110 live harness on ABG 3.7.1-rc.1 | **Open** |
| suggestion | Prompt inventory only 2/3 families | **Open** |
| suggestion | `rows[0]` fallback in review-grade binding | **Open** |
| suggestion | Stale scan excludes `test_env/live` | **Open** |
| nit | Uncommitted WIP / ticket cites 2/2 tests | **Open** |

### Review pass 2 (re-review)

Re-ran focused proofs. Postflight regression confirmed fixed at
`installed_operator.ts:741`. Third `test:t194` case added for stale-identity
scan over active roots (`specification`, `code/src`, `design`,
`test_env/tests`). Design doc `abg.fallbacks.json` reference removed.

Verdict unchanged on constitutional layers; proof/release hygiene still open.

### STDO triage

**Symptom layer:** package pin bump, test green on version string, graph edits.

**First missing layer at intake:** Product + Requirements — consumed substrate
is constitutional truth, not a lockfile detail.

**Lawful re-entry:** `requirement_reprice` at `runtime_governance`. T-194
intake is correct.

**Reopen audit:** Correctly widened scope when active surfaces still published
ABG 3.x/rc3/rc13 as current truth. That was design/realization drift under
repriced requirements, not a new requirement gap.

**First missing layer now:** Tests/Proof + release hygiene.

| Layer | T-194 status |
| --- | --- |
| Goals / Intent | Unchanged — enables T-164 wave |
| Product / Requirements | Repriced — lawful |
| Design | Repriced — graph disposition audit done |
| Code | Substantively aligned |
| Tests/Proof | Partial — live harness, prompt inventory, commit binding |
| Release | Not closed — no immutable revision |

**Method routing:**

- **S** — SPEC_METHOD remains process constitution; ABG conformance tool is
  not SDLC method law. Lawful.
- **T** — T-194 execution contract (`target_truth`, `closure_law`,
  `non_closure_conditions`) is strong; premature completion at proof layer is
  the defect.
- **D** — Graph inventory disposition (`keep/reprice/reclassify/merge/delete`)
  is the correct design decomposition for migration cleanup.
- **O** — No shadow runtime; graph functions remain constructive carrier.

**STDO verdict:** T-194 is substantively closed at requirement/design/code.
`proof_status: passed` is defensible for constitutional migration. Full
workspace closure is overclaimed until T-195 completes.

## Target Direction

### Ticket split

| Ticket | Change class | Owns |
| --- | --- | --- |
| T-194 (completed) | `requirement_reprice` | Substrate constitutional repricing to ABG4 |
| T-195 (active) | `realization_refactor` | Proof surfaces, live harness, commit hygiene |

Do not reopen T-194 `change_class`. Residual work is proof-layer refactor,
not another requirement reprice.

### T-195 scope (posted)

`.ai-workspace/tickets/completed/T-195-close-t194-proof-and-release-hygiene.md`

1. Atomic commit of T-194 migration surface.
2. Extend `test:t194` to three prompt families.
3. Reprice or gate T-110 live harness to match T-059 ABG4 install truth.
4. Extend stale-identity guard to live harness constants.
5. Add T-028 assertions for T-149 and T-152 substrate assumptions.
6. Remove `rows[0]` fallback in `selectComponentRowForObligation`.
7. Refresh T-194 acceptance evidence to 3/3 and name closing commit.

## Recommended Action

1. Execute T-195 in `build_tenants/typescript` before treating T-194 closure
   as release-grade.
2. On T-195 close, update T-194 acceptance section with commit hash and
   `test:t194` 3/3; leave T-194 `status: completed`.
3. If T-110 live repricing is deferred, gate the npm script explicitly and
   record non-closure in T-195 — do not leave stale live truth outside scan
   roots without documentation.
4. After T-195 commit, rerun `npm run test:semantic` and cite revision in
   ticket proof_surface.

## References

- Review artifacts (local): `/tmp/grok-review-95110d3b.md`,
  `/tmp/grok-review-summary-95110d3b.md`
- Upstream method:
  `/Users/jim/src/apps/specification_methodology/specification/standards/POSTING_GUIDE.md`
- STDO compressed authority:
  `specification_methodology/specification/standards/authority_compressions/stdo_compressed.md`