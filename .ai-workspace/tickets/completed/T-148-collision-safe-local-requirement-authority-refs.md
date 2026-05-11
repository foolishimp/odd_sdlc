---
id: T-148
title: Collision-safe local requirement authority refs
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: extend_existing_source_input_bootstrap_lineage_and_requirement_closure
governing_library: odd_sdlc TypeScript source input, bootstrap lineage, requirement closure, and transform authority carriers
status: completed
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Separate local requirement display IDs from authority identity so imported requirements remain distinct across source files and can lawfully carry downstream product pressure.
change_class: design_reframe
re_entry_point: design
priority: high
execution_phase: axiomatic_setting
execution_order: 4
execution_order_reason: Establishes requirement authority identity before transformation-set and product-pressure proof.
triaged_at: 2026-05-11
created_at: 2026-05-11
completed_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: evolves_old
authority_ruling:
  - lineage_ledger_evolves_existing_carrier
  - requirement_closure_register_evolves_existing_carrier
  - display_ids_are_not_authority_refs
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-031 workspace ingress and bootstrap lineage
  - T-035 traceability lineage and requirement closure
  - T-141 requirement-to-product transformation boundary
  - T-144 local requirement heading import
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/code/src/workspace/source_input.ts
  - build_tenants/typescript/code/src/workspace/bootstrap_lineage.ts
  - build_tenants/typescript/code/src/projection/requirement_closure.ts
  - build_tenants/typescript/test_env/tests/
---

# T-148: Collision-Safe Local Requirement Authority Refs

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

T-144 made local requirement headings admissible. The follow-on issue is identity
loss: repeated local display IDs such as `R-01` can collapse if they become the
authority key.

## Target Truth

Local requirement display IDs remain visible to operators, but closure and
transform lineage key by stable authority refs derived from source URI, heading,
and content/source digest.

Requirement rows can close locally while still carrying downstream
transformation-set pressure into product materialization.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This repairs authority identity in existing
  source-input, lineage, and closure carriers.
- Ledger ruling: `evolves old`. `SdlcLineageLedger` and
  `SdlcRequirementClosureRegister` remain the carriers. This ticket must not add
  a second requirement-closure ledger unless it replaces the old register.
- Authority boundary: local requirement display IDs are operator labels. Stable
  authority refs derived from source URI, heading, and digest are closure and
  transform keys.
- Transformation rule: a requirement row may be locally fulfilled while still
  carrying downstream transformation-set pressure into product materialization.
- Attention rule: evaluator lineage must be able to distinguish two visible
  `R-01` labels from different source files.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A1a/A1b
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Update source input in `build_tenants/typescript/code/src/workspace/source_input.ts`.
- Update lineage derivation in `build_tenants/typescript/code/src/workspace/bootstrap_lineage.ts`.
- Update closure keys and public rows in `build_tenants/typescript/code/src/projection/requirement_closure.ts`.
- Check transformation-set pressure interactions in `build_tenants/typescript/code/src/operator/traversal_consequence.ts`.

## Migration Plan

1. Add separate display ID and authority-ref fields to source-input requirement
   carriers.
2. Update bootstrap lineage proofs to cite requirement authority refs while
   preserving display IDs for operator surfaces.
3. Update requirement closure register keys, carried-forward lists, and
   fulfillment rows to use authority refs where IDs are not globally canonical.
4. Update public projections to render display ID and authority ref distinctly.
5. Add duplicate-display-ID tests across two source files and downstream
   pressure propagation tests.

## Closure Criteria

- Source input distinguishes display ID from authority ref.
- Bootstrap lineage and requirement closure use authority refs where local IDs
  are not globally canonical.
- Operator-facing surfaces show display IDs; audit/replay surfaces show
  authority refs; the carrier links them.
- Two requirement files with `R-01` produce distinct closure rows and distinct
  downstream pressure rows.
- Existing tests for local requirement headings still pass without requiring
  canonical global ID style.
- Public requirement rows include enough evidence/source refs to replay how the
  authority ref was derived.
- Product materialization pressure consumes authority refs, not display-only
  requirement IDs.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t031_workspace_ingress.test.mjs`
- `node --test test_env/tests/test_t035_traceability_requirement_closure.test.mjs`
- `node --test test_env/tests/test_t141_gtl_transform_boundary.test.mjs`
- Add and run a focused `test_env/tests/test_t148_collision_safe_requirement_authority_refs.test.mjs`.

## Non-Closure Conditions

- `R-01` from two source files normalizes to one closure key.
- The source slug, source path, heading, or digest is discarded before closure.
- Noncanonical ID style becomes a dispatch or closure failure instead of
  nonblocking hygiene.

## Closure Evidence

Implemented in the TypeScript tenant.

- Source input now derives a stable `requirementAuthorityRef` for local
  requirement headings from source URI, display ID, heading slug, and source
  digest while preserving `requirementDisplayId` for operator surfaces.
- Imported requirement authority, bootstrap lineage, requirement transform
  authority, requirement closure entries, public fulfillment rows, and repair
  frontier rows now carry authority refs separately from display IDs.
- Requirement fulfillment public rows emit `obligationRef` using the authority
  ref, so downstream transformation-set pressure consumes authority identity
  instead of display-only IDs.
- `test_t148_collision_safe_requirement_authority_refs.test.mjs` proves two
  separate `R-01` requirement files produce distinct authority refs, distinct
  closure rows, and distinct downstream pressure refs.

Verification passed from `build_tenants/typescript` on 2026-05-11:

- `npm run build:semantic`
- `node --test test_env/tests/test_t031_workspace_ingress.test.mjs`
- `node --test test_env/tests/test_t035_traceability_requirement_closure.test.mjs`
- `node --test test_env/tests/test_t141_gtl_transform_boundary.test.mjs`
- `node --test test_env/tests/test_t148_collision_safe_requirement_authority_refs.test.mjs`
- `npm run test:semantic` (`397` tests passed)
