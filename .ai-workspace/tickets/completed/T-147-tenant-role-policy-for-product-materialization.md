---
id: T-147
title: Tenant role policy and exact product materialization target binding
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: refactor_existing_product_materialization_contract_and_role_inference
governing_library: odd_sdlc TypeScript target-obligation binding, product materialization authority, and technology capability policy
status: completed
goal: typescript-test35-parity-follow-on
build_tenant: typescript
owner: odd_sdlc
change_intent: Move product-file role satisfaction and exact materialization targets into declared target/capability policy instead of core ecosystem/path heuristics.
change_class: design_reframe
re_entry_point: design
priority: high
execution_phase: axiomatic_setting
execution_order: 5
execution_order_reason: Establishes exact target and product-materialization authority before assurance and proof work rely on it.
triaged_at: 2026-05-11
created_at: 2026-05-11
completed_at: 2026-05-11
governance_scope: STDO Method
ledger_ruling: evolves_old_and_replaces_context_scan_authority
authority_ruling:
  - target_obligation_binding_evolves_existing_carrier
  - product_materialization_contract_evolves_existing_contract_family
  - context_expected_file_scanning_authority_deleted
design_review_ref: .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
dependencies:
  - T-137 target obligation binding and published action law
  - T-142 autonomous product materialization from consequence chain
  - T-143 product materialization targets from conformed authority
  - T-144 tenant grammar boundary cleanup
source_documents:
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md
affected_boundary:
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/test_env/tests/
---

# T-147: Tenant Role Policy And Exact Product Materialization Target Binding

## STDO Triage

Smallest lawful re-entry: `design_reframe`.

The May 9 test35 breakdown identifies durable materialization shape as:

```text
SdlcTargetObligationBinding / ProductMaterializationContract
-> exact expected files and evidence roles
-> prompt rendering
-> post-worker observation
-> ledger closure
```

T-144 reduced stack grammar, but product materialization still has
closure-relevant role inference in core code.

## Target Truth

Core SDLC owns role taxonomy and deterministic mechanics. Product authority,
tenant policy, or technology capability contracts assign roles to paths, file
families, and target materialization obligations.

Known ecosystem filenames do not satisfy roles by name alone. Unknown ecosystem
files may satisfy roles when declared by policy and admitted evidence.

## STDO Method Governance

- STDO re-entry: `design_reframe`. This moves materialization authority from
  core heuristics into declared target/capability policy.
- Ledger ruling: `evolves old`. The work evolves `SdlcTargetObligationBinding`,
  `SdlcProductMaterializationContract`, and materialization authority
  reconciliation. It must not create a parallel product-materialization ledger.
- Replacement ruling: context expected-file scanning, extension rules, and
  ecosystem filename heuristics are replaced as authority. Authority-producing
  code for those paths must be deleted, not retained as a lower-priority branch.
  Raw observations may remain only after target/capability policy has supplied
  the truth surface.
- Authority boundary: exact product-file targets and roles must be bound before
  F_P invocation and then cited by `SdlcWorksiteEvidence` and
  `SdlcEdgeFulfillmentLedger`.
- Product/domain split: core SDLC owns the role taxonomy and deterministic
  mechanics. Product authority, tenant policy, or technology capability
  contracts assign roles to paths and file families.

## Cold Start Executor Context

Read these before editing:

- `.ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md`
- `.ai-workspace/comments/codex/20260511T012031Z_STRATEGY_t144_follow_on_fd_overreach_next_steps.md`
- `.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md` A1a/A1b and A2
- `build_tenants/typescript/package.json` scripts

Current code surfaces:

- Evolve materialization contract types in `build_tenants/typescript/code/src/operator/carriers.ts`, especially `SdlcProductMaterializationContract`, `SdlcWorkerInvocationOutputContract`, and materialization authority reconciliation.
- Update target binding in `build_tenants/typescript/code/src/projection/query_domain.ts`.
- Update worker prompt/invocation rendering and post-worker observation in `build_tenants/typescript/code/src/operator/handoff.ts`.
- Keep closure proof through `build_tenants/typescript/code/src/operator/traversal_consequence.ts`.

## Migration Plan

1. Extend the existing product materialization contract family with exact target
   file/directory contracts, role assignments, source refs, and policy refs.
2. Derive required roles from target/capability policy when available.
3. Render worker prompt obligations from the target contract, not ambient
   context scanning.
4. Delete context-derived expected-file authority. If context-derived file data
   is still displayed, derive it as observation against the declared target
   contract.
5. Add admission checks that product evidence satisfies declared target roles
   before edge closure can pass.

## Closure Criteria

- Product materialization contracts expose exact expected files and evidence
  roles through declared target/capability policy.
- Required roles derive from target contracts when available.
- Hard-coded extension, build-tool, and path heuristics are non-authoritative
  compatibility observation only.
- The worker prompt renders target obligations from the contract, not from
  ambient context scanning.
- Tests prove both sides:
  - unknown ecosystem file satisfies a role when declared by policy;
  - known ecosystem file does not satisfy a role when undeclared.
- Worker invocation packages carry target obligations from the contract family,
  including path, target kind, required role, source ref, and policy ref.
- `SdlcEdgeFulfillmentLedger.targetBindingRefs` or predecessor refs cite the
  admitted target binding used for materialization closure.
- A negative test proves `.ai-workspace/context/*.json` expected-file state
  cannot close materialization without target/capability policy.
- The code path that lets context expected-file scanning define closure-relevant
  targets is removed.
- A positive test proves a declared unknown file family can satisfy a product
  role when policy and admitted evidence agree.

## Verification Commands

Run from `build_tenants/typescript`:

- `npm run build:semantic`
- `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs`
- `node --test test_env/tests/test_t137_target_obligation_binding.test.mjs`
- `node --test test_env/tests/test_t143_product_materialization_authority_targets.test.mjs`
- Add and run a focused `test_env/tests/test_t147_tenant_role_policy_materialization.test.mjs`.

## Closure Evidence

Completed on 2026-05-11.

Implementation moved product materialization role satisfaction behind declared
target policy:

- Worker invocation contracts now carry declared product target obligations
  with path, target kind, required role, source ref, and policy ref.
- Declared product targets are derived from conformed `PRODUCT.md` authority
  and module structure. `.ai-workspace/context/expected_files.json` remains
  observation only and cannot define closure-relevant targets.
- Materialized product evidence must bind to a declared target contract before
  it can satisfy a required product role.
- Role assignment is policy-visible through product target declarations and
  deterministic capability policy refs, rather than direct closure authority
  from ecosystem filenames or path heuristics.
- Worker prompt/package rendering now names declared target role policy.

Regression coverage:

- `test_t147_tenant_role_policy_materialization.test.mjs` proves an unknown
  file family can satisfy a source role when explicitly declared by product
  target policy.
- The same test proves known ecosystem files cannot satisfy undeclared product
  roles and context expected files alone cannot define materialization targets.
- Existing T-066, T-118, and T-143 tests were updated to consume declared
  product target authority instead of context-derived targets.

Verification from `build_tenants/typescript`:

- `npm run build:semantic` passed.
- `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs` passed.
- `node --test test_env/tests/test_t137_target_obligation_binding.test.mjs` passed.
- `node --test test_env/tests/test_t143_product_materialization_authority_targets.test.mjs` passed.
- `node --test test_env/tests/test_t147_tenant_role_policy_materialization.test.mjs` passed.
- `node --test test_env/tests/test_t118_worker_invocation_package.test.mjs` passed after updating the fixture to declare product targets through `PRODUCT.md`.
- `npm run test:semantic` passed on 2026-05-11 with 400 tests, 0 failures.

## Non-Closure Conditions

- `build.sbt`, `Cargo.toml`, `pom.xml`, `build.gradle`, `src/`, or file
  extensions can satisfy closure-relevant roles without target/capability policy.
- `.ai-workspace/context/*.json` scanning is the only source of expected files.
- Tests prove hello-world output but not exact target-obligation binding.
