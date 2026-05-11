---
id: T-155
title: Structural requirement authority refs and proof claim admission
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: extend_existing_source_input_bootstrap_lineage_requirement_closure_and_handoff_obligations
governing_library: odd_sdlc TypeScript source input, bootstrap lineage, requirement closure, query-domain pressure, and worker handoff obligation carriers
status: completed
goal: post-t143-authority-hardening
build_tenant: typescript
owner: odd_sdlc
change_intent: Make requirement authority identity structural and globally unique at creation so proof and closure never bind through display IDs.
change_class: design_reframe
re_entry_point: design
priority: high
execution_phase: post_t143_hardening
triaged_at: 2026-05-11
created_at: 2026-05-11
completed_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: evolves_old
authority_ruling:
  - requirement_authority_ref_is_structural_identity
  - display_ids_are_operator_aliases_only
  - proof_claims_require_resolvable_authority_refs
  - unmatched_claims_are_diagnostics_not_silent_drops
dependencies:
  - T-148 collision-safe local requirement authority refs
source_documents:
  - specification/GOALS.md
  - .ai-workspace/tickets/completed/T-148-collision-safe-local-requirement-authority-refs.md
affected_boundary:
  - build_tenants/typescript/code/src/workspace/source_input.ts
  - build_tenants/typescript/code/src/workspace/bootstrap_lineage.ts
  - build_tenants/typescript/code/src/projection/requirement_closure.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/test_env/tests/
---

# T-155: Structural Requirement Authority Refs And Proof Claim Admission

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

T-148 separated display IDs from authority refs, but the current authority
shape still derives local requirement identity from source URI/digest and the
closure path still admits proof claims without a required authority ref. That
leaves proof binding too late in F_D and keeps display-ID fallback alive.

## Target Truth

Requirement authority is created as a structural dot-notation key:

```text
<project>.<stage>.<requirement>
```

The project segment is the admitted project slug. The stage segment is derived
from the requirement source stage and must be unique within the project. The
requirement segment is the normalized requirement key and must be unique within
the stage.

Display IDs such as `R-001` and `REQ-LDM-001` remain operator aliases. They do
not bind proof or closure.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This changes requirement identity shape and
  proof admission semantics without adding a new closure ledger.
- Ledger ruling: `evolves old`. `SdlcWorkspaceIngressReport`,
  `SdlcLineageLedger`, `SdlcRequirementClosureRegister`, and public
  requirement fulfillment projections remain the carriers.
- Authority boundary: requirement authority refs are admitted at creation from
  project, stage, and requirement keys. Closure never re-derives authority from
  display IDs.
- F_D boundary: closure validation may resolve a supplied authority ref. It must
  not infer one from display text.
- Failure rule: missing or unresolvable proof authority refs are fail-closed
  diagnostics, not silent omissions.

## Migration Plan

1. Derive structural authority refs at source-input/ingress time from project
   slug, source stage, and requirement key.
2. Reject duplicate authority refs in one ingress report.
3. Make `SdlcRequirementProofClaim.requirementAuthorityRef` mandatory.
4. Remove display-ID fallback from proof-claim matching.
5. Preserve unmatched claims as lineage/closure diagnostics.
6. Update handoff requirement obligations to use the same structural authority
   derivation.
7. Update focused regressions for structural authority refs and proof admission.

## Closure Criteria

- Imported requirement authorities use dot-notation refs derived from
  project/stage/requirement identity.
- Duplicate display IDs in separate stages remain distinct.
- Duplicate requirement keys inside one stage fail at ingress.
- Proof claim admission rejects missing `requirementAuthorityRef`.
- Closure does not bind proof by `requirementId` or display ID.
- Unresolvable proof authority refs are preserved as diagnostics and carried as
  unresolved closure rows.
- Query-domain obligation refs and handoff obligations use authority refs, not
  display IDs.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `npm run test:t031`
- `npm run test:t035`
- `npm run test:t038`
- `npm run test:t148`
- add and run `test_env/tests/test_t155_structural_requirement_authority_refs.test.mjs`

## Non-Closure Conditions

- A proof claim without `requirementAuthorityRef` is admitted.
- A proof claim binds through `requirementId` after authority-ref miss.
- Two requirements in the same project/stage share an authority ref.
- A missing authority claim disappears from lineage or closure output.

## Completion Evidence

Completed on 2026-05-11.

Implemented structural requirement authority refs in the TypeScript tenant:

- Requirement authority refs now derive from admitted project slug, source
  stage, and requirement key as `<project>.<stage>.<requirement>`.
- Source URI, source digest, marker ref, and heading slug remain derivation
  evidence rather than authority identity.
- Duplicate authority refs fail closed at ingress when they indicate duplicate
  local requirements in one stage or conflicting source-stage authority.
- `SdlcRequirementProofClaim` now requires `requirementAuthorityRef`.
- Requirement proof matching resolves only supplied authority refs. It no
  longer falls back to display IDs.
- Unresolvable proof claims are preserved as lineage diagnostics and projected
  into closure as unresolved diagnostic entries.
- Query-domain rows, public fulfillment projections, worker handoff
  obligations, archive rehydration, and assurance gates now carry structural
  authority refs while preserving display IDs for operator surfaces.
- Compact worker invocation packages cap inline requirement trace IDs and point
  to `traversal_intent_package` for the complete transformation set, keeping the
  package compact without weakening authority identity.

Verification passed from `build_tenants/typescript`:

- `npm run test:t031`
- `npm run test:t035`
- `npm run test:t038`
- `npm run test:t066`
- `npm run test:t088`
- `npm run test:t089`
- `npm run test:t091`
- `npm run test:t099`
- `npm run test:t135`
- `npm run test:t139`
- `npm run test:t141`
- `npm run test:t148`
- `npm run test:t152`
- `npm run test:t154`
- `npm run test:t155`
- `npm run build:semantic && node --test test_env/tests/test_t118_worker_invocation_package.test.mjs`
- `npm run build:semantic && node --test test_env/sandbox/test_t047_pre_refactor_sandbox.test.mjs`
- `npm run test:semantic` (`426` tests passed)
