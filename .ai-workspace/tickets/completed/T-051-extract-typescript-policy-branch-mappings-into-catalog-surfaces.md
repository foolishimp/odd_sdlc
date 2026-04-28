---
id: T-051
title: Extract TypeScript policy branch mappings into catalog surfaces
type: task
ticket_category: refactor
status: completed
goal: reduce-custom-typescript-framework-policy-branches
change_intent: The graph-purity review found multiple policy mappings encoded as TypeScript branches. Move these toward declared catalog/policy surfaces while keeping TypeScript as validator/projector.
change_class: design_reframe
re_entry_point: design
affected_boundary: hook edge-class policy, default operation policy, triage route policy, operational lane policy, start target policy
priority: medium
triaged_at: 2026-04-26
created_at: 2026-04-26
completed_at: 2026-04-26T17:14:45Z
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: `.ai-workspace/comments/codex/20260426T065121Z_REVIEW_odd_sdlc_typescript_against_odd_method_graph_purity.md`
target_truth: Policy mappings are declared data surfaces where practical, with TypeScript validating/projecting rather than owning policy branches.
superseded_truth: route, operation, edge-class, lane, and start-target mappings can remain scattered branch logic.
closure_law: This ticket closes when at least hook target classification and default operation policy move to declared catalog data, with tests proving unchanged behavior.
evaluation_criteria:
  - hook target asset -> edge class is catalog/policy data
  - hook target asset -> default operation is catalog/policy data
  - tests prove unchanged behavior
  - follow-up tickets exist for triage/start/operational policy extraction if not completed here
proof_surface:
  - `build_tenants/typescript/code/src/hooks/policy.ts`
  - `build_tenants/typescript/code/src/hooks/catalog.ts`
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_HOOK_CONTRACTS.md`
  - `build_tenants/typescript/test_env/tests/test_t034_hook_set.test.mjs`
  - `.ai-workspace/tickets/backlog/T-057-extract-remaining-typescript-route-start-operational-policy-surfaces.md`
non_closure_conditions:
  - mappings remain private branch logic
  - policy data duplicates catalog truth without coherence tests
---

# T-051: Extract Policy Branch Mappings

## Completion Record

Completed 2026-04-26T17:14:45Z.

Changes:

- added `hooks/policy.ts` as the declared hook target policy catalog
- moved target asset -> hook edge class policy out of branch logic
- moved target asset -> default operation policy out of branch logic
- made `hooks/catalog.ts` consume declared policy data
- made hook fixture construction consume declared default-operation policy
- added a T-051 test proving the policy table exactly covers
  `SDLC_FUNCTION_CATALOG` outputs and matches constructed hook contracts
- created `T-057` for remaining triage/start/operational policy surfaces

Design Module Method review:

- `hooks/policy.ts` is a policy catalog module, not a semantic kernel
- the policy table has one source of truth for hook target mapping
- catalog construction validates missing policy by failing closed
- route, start, and operational policies are not silently folded into hook
  policy because they belong to separate module boundaries

Verification:

```text
npm run test:t034
npm run test:semantic
npm run lint:semantic
```

Result:

```text
test:t034: 9 tests passed
test:semantic: 60 tests passed
lint:semantic: passed
```
