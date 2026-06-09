# REVIEW: T-195 Proof Hygiene Status

**Author**: grok
**Date**: 2026-06-08T06:55:43Z
**Addresses**:
  - `.ai-workspace/tickets/completed/T-195-close-t194-proof-and-release-hygiene.md`
  - `.ai-workspace/tickets/completed/T-194-migrate-typescript-tenant-to-abg-4-0-0-rc-2.md`
**Status**: Open

## Summary

T-195 is **active** and **not closeable**. No work items from the ticket body
have landed yet. Focused proofs pass on the current working tree, but every
`non_closure_condition` in the ticket frontmatter still holds. The ticket
correctly scopes Tests/Proof residual pressure from T-194; execution has not
started.

## Current Reality

### Ticket metadata

| Field | Value |
| --- | --- |
| `status` | `active` |
| `proof_status` | `pending` |
| `change_class` | `realization_refactor` |
| `re_entry_point` | `tests_proof` |
| `source_ticket` | T-194 |
| `created_at` / `updated_at` | 2026-06-08 |

### Proof run (2026-06-08)

Executed from `build_tenants/typescript`:

| Command | Result |
| --- | --- |
| `npm run test:t194` | 3/3 pass |
| `npm run test:t028` | 3/3 pass |
| `npm run test:t182` | 16/16 pass |

`test:t194` passes **despite** `promptAssetCount === 2` because the third test
covers stale-identity scan only; it does not yet assert three prompt families.

### Repository state

- **87** porcelain entries in working tree at review time
- **68** paths differ from `HEAD`
- Latest commit on branch: `94c013b release odd_sdlc v2.0.0-rc.8`
- T-194 migration surface is **not** bound to an immutable revision

## Analysis

### Work-item checklist

| # | Work item | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Atomic commit of T-194 surface | **Open** | Working tree dirty; no T-194 closure commit |
| 2 | Three prompt families in `test:t194` | **Open** | `test_t194_gtl_program_conformance.test.mjs:409` asserts `promptAssetCount === 2`; `evaluate_design_depth` not in `promptProjectionRows()` |
| 3 | Reprice or gate T-110 live | **Open** | `test_t110_live_agent_pty_installed_operator.test.mjs:29` pins `3.7.1-rc.1`; line 170 expects `abg.fallbacks.json`; `test:t110:typed-callout-live` still in `package.json` |
| 4 | Extend stale-identity guard to live | **Open** | `ACTIVE_SCAN_ROOTS` excludes `test_env/live`; no `EXPECTED_ABG_VERSION` guard |
| 5 | T-028 asserts T-149 and T-152 | **Open** | `test_t028_abiogenesis_substrate_binding.test.mjs` asserts through T-151 only; no T-149 or T-152 assertions |
| 6 | Remove `rows[0]` fallback in review-grade binding | **Open** | `review_grade_edge_fulfillment.ts:650,664,674` still fall back to `rows[0]` |
| 7 | Refresh T-194 acceptance evidence | **Open** | T-194 acceptance still cites `test:t194` **2/2** at line 645 |

**Score: 0/7 work items complete.**

### Non-closure conditions (all still true)

1. T-194 migration files remain uncommitted.
2. `test:t194` hard-asserts `promptAssetCount === 2`.
3. T-110 live expects `3.7.1-rc.1` / `abg.fallbacks.json` without gate.
4. Stale scan excludes `test_env/live` while live harness is stale.
5. `selectComponentRowForObligation` still uses `rows[0]` fallback.
6. T-194 acceptance cites `test:t194` 2/2.

### What is already green (does not close T-195)

These pass today and reduce execution risk, but do not satisfy closure law:

- Constitutional substrate repricing from T-194 (package pin, substrate contract,
  policy repricing, `GtlContractFulfillmentBinding`) on working tree
- `test:t194` stale scan over active roots (`specification`, `code/src`,
  `design`, `test_env/tests`)
- `postflight: reviewGradePostflight` restored in `installed_operator.ts`
- T-191/T-192 cover production prompt families outside the T-194 conformance
  inventory

The gap is **proof completeness and revision binding**, not substrate migration
correctness.

### STDO alignment

T-195 triage remains lawful:

- First missing layer: **Tests/Proof**
- Symptom (tests pass, ticket marked done) ≠ authority (immutable revision +
  complete proof inventory)
- T-194 stays completed at requirement layer; T-195 must not reprice product or
  requirements

## Recommended Action

Execute work items in this order:

1. **Code fixes** (items 2, 4, 5, 6) — can land in one implementation pass
2. **T-110** (item 3) — reprice to mirror `test_t059` or gate script with
   documented deferral in T-195 body
3. **Commit** (item 1) — single atomic revision for T-194 + T-195 proof fixes
4. **Evidence refresh** (item 7) — update T-194 acceptance; close T-195 with
   commit hash and full proof_surface commands

Suggested execution estimate: one focused implementation session plus semantic
suite run.

### Close criteria reminder

T-195 closes only when **all** of the following hold on the **same commit**:

```bash
git status --porcelain   # clean for migration surface
npm run test:t194        # 3/3, promptAssetCount === 3
npm run test:t028        # includes T-149 and T-152 assertions
npm run test:t182        # after rows[0] removal
npm run test:semantic
```

Optional if T-110 repriced:

```bash
ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:typed-callout-live
```

## References

- Prior strategy post:
  `.ai-workspace/comments/grok/20260608T042453Z_REVIEW_t194-abg4-migration-stdo-triage.md`
- Upstream ticket:
  `.ai-workspace/tickets/completed/T-194-migrate-typescript-tenant-to-abg-4-0-0-rc-2.md`