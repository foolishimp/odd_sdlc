---
id: T-195
title: Close T-194 proof and release hygiene
type: chore
ticket_category: ordinary
status: completed
proof_status: passed
build_tenant: typescript
owner: odd_sdlc
source_ticket: T-194
goal: t164-edge-assurance-wave
change_intent: Finish the Tests/Proof and release-hygiene layers that T-194 left open after constitutional substrate repricing to ABIogenesis 4.0.0-rc.4
change_class: realization_refactor
re_entry_point: tests_proof
first_missing_layer: tests_proof
triaged_at: 2026-06-08
created_at: 2026-06-08
updated_at: 2026-06-09
completed_at: 2026-06-09
closing_commit: 6af364e
successor_ticket: .ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md
priority: high
dependencies:
  - T-194
governance_scope: TICKET_METHOD execution closure / TypeScript tenant proof surfaces
source_documents:
  - .ai-workspace/tickets/completed/T-194-migrate-typescript-tenant-to-abg-4-0-0-rc-3.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - build_tenants/typescript/test_env/tests/test_t194_gtl_program_conformance.test.mjs
  - build_tenants/typescript/test_env/live/test_t110_live_agent_pty_installed_operator.test.mjs
  - build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs
  - build_tenants/typescript/test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs
  - build_tenants/typescript/code/src/operator/review_grade_edge_fulfillment.ts
affected_boundary:
  - .ai-workspace/tickets/completed/T-194-migrate-typescript-tenant-to-abg-4-0-0-rc-3.md
  - build_tenants/typescript/test_env/tests/test_t194_gtl_program_conformance.test.mjs
  - build_tenants/typescript/test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs
  - build_tenants/typescript/test_env/live/test_t110_live_agent_pty_installed_operator.test.mjs
  - build_tenants/typescript/code/src/operator/review_grade_edge_fulfillment.ts
  - build_tenants/typescript/package.json
target_truth: T-194 migration changes are committed as one immutable revision; proof surfaces cover all three production prompt families, live harness pins match ABIogenesis 4.0.0-rc.4 install truth, stale-identity guards include live harness constants, review-grade obligation binding does not silently fall back to the first component row, and T-194 acceptance evidence records test:t194 as 3/3 on that revision.
superseded_truth: T-194 may be marked completed while ~80 working-tree files remain uncommitted; test:t194 inventories only two prompt families; test_env/live may still pin ABG 3.7.1-rc.1 and abg.fallbacks.json outside the automated stale scan; T-028 asserts T-151 but not T-152 substrate assumptions; review-grade fulfillment may bind unmatched obligations to rows[0].
closure_law: This ticket closes when the T-194 affected boundary is committed as a discrete revision, npm run test:t194 passes 3/3 on that revision after prompt-inventory repricing, test:t028 asserts T-152 (and T-149 if still absent), test_t110 live harness matches test_t059 ABG4 install truth or is explicitly gated out of active scripts with documented rationale, stale-identity guarding rejects live harness version pins older than ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.packageVersion, selectComponentRowForObligation returns null instead of rows[0] on unmatched module/requirement obligations, and T-194 acceptance evidence is refreshed to cite 3/3 and the commit revision.
evaluation_criteria:
  - git status is clean for the T-194 migration surface after one atomic commit
  - test:t194 passes with promptAssetCount === 3 including evaluate_design_depth
  - test:t028 asserts substrate assumptions for T-152 and T-149 where documented in ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT
  - test_t110 live repriced to 4.0.0-rc.4 and abg.config.json or removed from active npm scripts with explicit non-closure documentation
  - stale identity scan or companion guard fails if test_env/live publishes EXPECTED_ABG_VERSION older than current substrate contract
  - test:t182 still passes after review-grade rows[0] fallback removal
  - T-194 ticket acceptance section updated to 3/3 and names the closing commit
non_closure_conditions:
  - T-194 migration files remain split across uncommitted working-tree edits
  - test:t194 still hard-asserts promptAssetCount === 2
  - test_t110 live still expects 3.7.1-rc.1 or abg.fallbacks.json without an explicit gate
  - stale scan roots still exclude test_env/live while live harness constants remain stale
  - selectComponentRowForObligation still falls back to rows[0] for unmatched obligations
  - T-194 acceptance evidence still cites test:t194 2/2
proof_surface:
  - git log -1 --oneline on the T-194 closure commit
  - npm run test:t194
  - npm run test:t028
  - npm run test:t059
  - npm run test:t182
  - npm run test:semantic
  - optional ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:typed-callout-live when live harness is repriced rather than gated
---

# T-195: Close T-194 Proof And Release Hygiene

## Closure / Hygiene Close - 2026-06-09

T-195 is completed as T-194 proof and release hygiene. Checkpoint revision
`6af364e` recorded the RC3/RC4 migration proof bundle and the T-194 acceptance
evidence now cites that immutable revision instead of a pending commit.

This ticket does not own the broader in-product GTL conformance hook. The open
PRODUCT gate requiring `typecheckGtlProgram(...)` in `code/src` build/start or
publish preflight is transferred to
`.ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md`
as P0/B1.

## STDO Triage

First missing layer: **Tests/Proof** (not Product, Requirements, or Design).

Symptom: T-194 is marked `completed` with `proof_status: passed`, but the
migration surface remains largely uncommitted, live harness pins still name
ABG `3.7.1-rc.1`, and `test:t194` inventories only two of three production
prompt families.

Authority gap: constitutional substrate repricing (Product + Requirements) is
already lawful under T-194. What remains is **realization proof and release
hygiene** — proving the repriced truth on an immutable revision and closing
proof-surface gaps that do not require another requirement reprice.

Lawful re-entry: `realization_refactor` at `tests_proof`.

Upstream ticket: T-194 (`requirement_reprice` at `runtime_governance`) stays
completed for the constitutional migration. T-195 closes residual pressure
without reopening product or requirement law.

## Position

T-194 correctly repriced:

- `@abiogenesis/typescript-tenant@4.0.0-rc.4` as consumed substrate
- version-neutral SDLC policy identities in active graph/runtime surfaces
- ABG-owned `typecheckGtlProgram(...)` with SDLC-supplied inventory
- `GtlContractFulfillmentBinding` at review-grade handoff boundaries

STDO review found the constitutional layers sound. This ticket owns only the
remaining proof and process defects.

## Work Items

### 1. Atomic commit of T-194 migration surface

Commit the T-194 affected boundary as one revision so closure evidence binds
to immutable git truth. Record the commit hash in T-194 acceptance evidence.

### 2. Complete T-194 prompt conformance inventory

Extend `test_t194_gtl_program_conformance.test.mjs` so
`promptProjectionRows()` includes `evaluate_design_depth` (via
`designDepthFpEvaluatorPromptProjection` or equivalent production constructor).
Update `promptAssetCount` assertion to `3`.

Optionally add a representative `launch_contract` transform projection if
production transform prompts are not already covered by T-191.

### 3. Reprice or gate T-110 live harness

`test_t110_live_agent_pty_installed_operator.test.mjs` still expects:

- `EXPECTED_ABG_VERSION = "3.7.1-rc.1"`
- `.abiogenesis/config/abg.fallbacks.json`

Reprice to mirror `test_t059_install_release_adapter.test.mjs`:

- `4.0.0-rc.4`
- `abg.config.json`
- current config digest

If live repricing is deferred, gate the script out of active `package.json`
scripts and document the non-closure rationale in this ticket.

### 4. Extend stale-identity guarding to live harness constants

Either:

- add `build_tenants/typescript/test_env/live` to `ACTIVE_SCAN_ROOTS`, or
- add a focused guard that fails when any live harness
  `EXPECTED_ABG_VERSION` is older than
  `ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.packageVersion`

The self-test regex samples in `test_t194` must remain excluded from the scan.

### 5. T-028 substrate-binding assertions

Add assertions in `test_t028_abiogenesis_substrate_binding.test.mjs` for
substrate assumptions that name:

- T-149 (primitive iteration-outcome projection)
- T-152 (static GTL program conformance gate)

### 6. Review-grade obligation binding safety

In `review_grade_edge_fulfillment.ts`, change
`selectComponentRowForObligation` so unmatched `module:` and `requirement:`
obligations return `null` instead of falling back to `rows[0]`. Preserve
T-182 proof coverage; extend tests if multi-component fixtures are needed.

### 7. Refresh T-194 acceptance evidence

Update `.ai-workspace/tickets/completed/T-194-migrate-typescript-tenant-to-abg-4-0-0-rc-3.md`
acceptance section:

- `test:t194` **3/3** (not 2/2)
- closing commit revision
- note that any remaining product-code GTL gate pressure is outside T-195 and
  owned by T-197

## Implementation Update - 2026-06-08

- `test_t194_gtl_program_conformance.test.mjs` now includes the production
  `evaluate_design_depth` prompt projection and asserts
  `promptAssetCount === 3`.
- The stale-identity guard now scans `build_tenants/typescript/test_env/live`.
- The T-110 live harness now expects ABIogenesis `4.0.0-rc.4` and the
  installed `.abiogenesis/config/abg.config.json` digest.
- The older T-102/T-109 live semantic-ledger harness no longer publishes
  ABG 3.x active identity strings in the live scan root.
- `test_t028_abiogenesis_substrate_binding.test.mjs` now asserts T-149 and
  T-152 substrate assumptions.
- `selectComponentRowForObligation` no longer falls back to the first
  component row; unmatched module and requirement obligations fail closed.
- T-194 acceptance evidence now records `npm run test:t194` as `3/3` and
  names checkpoint commit `6af364e` as the closing revision.

Remaining cleanup pressure is no longer T-195 scope. T-197 owns the product-code
GTL gate and wider authority-leakage remediation.

## Out Of Scope

- New ABIogenesis package version beyond `4.0.0-rc.4`
- T-164 edge-assurance semantic kernel work
- Python tenant migration
- Reopening T-194 `change_class` to `requirement_reprice`

## Proof Commands

```bash
cd build_tenants/typescript
npm run test:t194
npm run test:t028
npm run test:t059
npm run test:t182
npm run test:semantic
```

Optional after T-110 repricing:

```bash
ODD_SDLC_TS_T110_LIVE=1 npm run test:t110:typed-callout-live
```
