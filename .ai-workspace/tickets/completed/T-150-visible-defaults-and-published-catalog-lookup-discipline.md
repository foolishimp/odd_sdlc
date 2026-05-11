---
id: T-150
title: Visible defaults and published-catalog lookup discipline
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: introduce_odd_sdlc_defaults_carrier_and_harden_catalog_lookup_on_touched_paths
governing_library: odd_sdlc TypeScript query-domain catalogs, domain defaults, and ABG substrate default boundary
status: completed
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Make domain defaults and handle lookup replay-visible and catalog-backed instead of hidden in helpers, literals, fallback branches, or lexical search.
change_class: design_reframe
re_entry_point: design
priority: medium
execution_phase: axiomatic_setting
execution_order: 3
execution_order_reason: Makes defaults and catalog lookup replay-visible before executor proofs rely on evaluator attention.
triaged_at: 2026-05-11
created_at: 2026-05-11
completed_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: new_is_new_and_replaces_hidden_default_authority
authority_ruling:
  - odd_sdlc_domain_defaults_carrier_is_new
  - domain_policy_defaults_must_not_move_into_abg_defaults
  - hidden_helper_defaults_and_lexical_lookup_authority_deleted
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-017 start target catalog and asset ownership index
  - T-039 query-domain structural drift closure
  - T-139 public gaps read-only evaluator view
  - T-144 tenant grammar boundary cleanup
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/test_env/tests/
---

# T-150: Visible Defaults And Published-Catalog Lookup Discipline

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

The test35 parity target requires action selection and evidence lookup to be
replayable from admitted truth. Hidden defaults and lexical handle search create
implicit attention surfaces outside the ledger/event chain.

## Target Truth

Domain defaults that affect assurance, routing, closure, or next-action
selection are versioned, digested, and replay-visible. Domain policy defaults do
not move into substrate `abg_defaults`.

Graph-function, asset, and start handles resolve through published catalogs
where those catalogs exist.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This introduces an explicit policy carrier
  because defaults can affect assurance, closure, routing, and action selection.
- Ledger ruling: `new is new`. odd_sdlc needs a typed domain-defaults carrier
  because no current carrier makes domain policy defaults replay-visible.
- Replacement ruling: hidden helper defaults, fallback literals, optional
  parameter defaults, and lexical handle search are replaced as authority when a
  published carrier exists. Replacement means deleting the old authority path,
  not keeping it as a fallback.
- Substrate boundary: domain-policy defaults do not move into ABG substrate
  `abg_defaults`. ABG defaults are substrate defaults; odd_sdlc domain defaults
  are product/domain policy.
- Attention rule: a default that affects a decision must be cited as
  replay-visible policy/evidence before the evaluator may attend to it.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A1a/A1b and A3
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Add the domain-defaults carrier near query/domain catalog carriers in `build_tenants/typescript/code/src/projection/query_domain.ts` or the established carrier module if one already exists.
- Audit hidden defaults and lexical lookup in touched paths under `build_tenants/typescript/code/src/spec_method/entry.ts` and `build_tenants/typescript/code/src/operator/`.
- Reuse existing catalogs: `start_target_catalog`, `asset_ownership_index`, `function_catalog`, and graph-function surfaces.
- Do not move odd_sdlc domain policy into ABG substrate `abg_defaults`.

## Migration Plan

1. Introduce a typed odd_sdlc domain-defaults carrier with stable ref, version,
   digest or source refs, and policy scope.
2. Thread default participation into `policyRefs`, evidence refs, or predecessor
   refs whenever it changes assurance, closure, routing, or action selection.
3. Delete touched string/glob/lexical handle lookup authority paths where a
   published carrier exists, then replace them with published
   catalogs where available.
4. Leave substrate `abg_defaults` untouched for domain policy.
5. Add negative tests proving hidden defaults and lexical search cannot silently
   select, close, or route work.

## Closure Criteria

- `odd_sdlc` has a typed domain defaults carrier before domain defaults are
  migrated into it.
- Default participation is recorded in replay-visible evidence whenever it
  changes a decision.
- Touched handle-resolution paths use `start_target_catalog`,
  `asset_ownership_index`, `function_catalog`, or another published carrier.
- New string/glob helpers are refused where a published catalog is available.
- Tests prove domain defaults do not silently select or close work.
- The domain-defaults carrier is versioned and replay-visible, with a stable ref
  that can be cited by evaluator and closure outputs.
- At least one touched default path records default participation in replay
  evidence when the decision changes.
- At least one touched handle path fails closed or emits a typed no-action result
  when a required published catalog entry is absent.
- No touched path keeps hidden defaults or lexical lookup as fallback authority
  after the published carrier is introduced.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t030_graph_catalog_module.test.mjs`
- `node --test test_env/tests/test_t039_query_domain_structural_drift.test.mjs`
- `node --test test_env/tests/test_t135_evaluator_owned_runner_spine.test.mjs`
- `node --test test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs`
- Add and run a focused `test_env/tests/test_t150_visible_defaults_catalog_lookup.test.mjs`.

## Non-Closure Conditions

- Domain-policy defaults are stored in `abg_defaults`.
- A hidden `??` fallback, optional parameter default, or helper constant changes
  closure, routing, or action selection without replay-visible evidence.
- A touched path resolves graph functions or assets by lexical search when a
  published catalog exists.

## Closure Evidence

Implementation:

- Added a versioned `odd_sdlc_domain_defaults` carrier in
  `projection/query_domain.ts` with stable ref, digest, source refs, and an
  explicit substrate boundary that keeps domain policy out of `abg_defaults`.
- Published the domain-defaults carrier on `SdlcQueryDomainProjection`.
- Threaded the carrier through public gap dossier ranking so default evaluator
  participation is cited in evidence and ranking refs when no explicit priority
  scheme is supplied.
- Kept explicit priority schemes free of implicit default evidence.
- Removed the touched suffix/lexical graph-function lookup fallback from
  `selectedNextGraphFunctionFromArchive`; archive next-action replay now
  requires a published catalog id/name ref.
- Added `test_env/tests/test_t150_visible_defaults_catalog_lookup.test.mjs`
  and `npm run test:t150`.

Verification from `build_tenants/typescript`:

- `npm run test:t150` passed.
- `npm run test:t030` passed.
- `npm run test:t039` passed.
- `npm run test:t135` passed.
- `npm run test:t139` passed.
- `npm run test:t032` passed.
- `npm run test:t129` passed.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed: 396 tests.
