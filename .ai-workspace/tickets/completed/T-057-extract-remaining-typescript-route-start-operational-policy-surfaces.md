---
id: T-057
title: Extract remaining TypeScript route, start, and operational policy surfaces
type: task
ticket_category: refactor
status: completed
goal: reduce-custom-typescript-framework-policy-branches
change_intent: T-051 extracts hook target policy. Continue the same policy-surface discipline for triage route selection, public start target resolution, and operational lane binding where those mappings remain private branches.
change_class: design_reframe
re_entry_point: design
affected_boundary: triage route policy, public start target policy, operational lane policy, query/start projections
priority: medium
triaged_at: 2026-04-27
created_at: 2026-04-27
completed_at: 2026-04-26T17:23:13Z
dependencies:
  - T-051 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: `T-051-extract-typescript-policy-branch-mappings-into-catalog-surfaces.md`
target_truth: Route, start-target, and operational-lane policy mappings are declared data surfaces where practical, with TypeScript validating/projecting instead of owning hidden policy branches.
superseded_truth: Hook policy extraction alone resolves all TypeScript policy branch drift.
closure_law: This ticket closes when triage route selection, public start target resolution, and operational lane binding have explicit design review and either declared policy data or a documented reason why code remains the prime surface.
evaluation_criteria:
  - triage route policy is declared or explicitly justified as a semantic kernel
  - public start target policy is declared or explicitly justified as query-derived binding
  - operational lane policy is declared or explicitly justified as a carrier rule
  - tests prove unchanged behavior
  - no new tenant-local traversal authority is introduced
proof_surface:
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_POLICY_SURFACES.md`
  - `build_tenants/typescript/code/src/triage/policy.ts`
  - `build_tenants/typescript/code/src/start/policy.ts`
  - `build_tenants/typescript/code/src/operational/policy.ts`
  - `build_tenants/typescript/test_env/tests/test_t033_public_start.test.mjs`
  - `build_tenants/typescript/test_env/tests/test_t036_gap_triage_homeostatic_route.test.mjs`
  - `build_tenants/typescript/test_env/tests/test_t037_operational_transition_runtime_return.test.mjs`
non_closure_conditions:
  - private branch mappings remain unreviewed
  - policy data duplicates catalog truth without coherence checks
  - route/start/operational policy begins deciding ABG traversal internally
---

# T-057: Extract Remaining Policy Surfaces

## Completion Record

Completed 2026-04-26T17:23:13Z.

Changes:

- added `triage/policy.ts` for triage classification and route policy
- added `start/policy.ts` for public-start target resolution policy
- added `operational/policy.ts` for operational lane binding policy
- updated semantic kernels to consume declared policy data
- added `ODD_SDLC_TYPESCRIPT_POLICY_SURFACES.md` with module classifications,
  local/global optimization review, structural carrier diagram, non-ownership,
  and residual semantic-kernel boundaries

Design Module Method review:

- policy modules are catalog modules, not execution engines
- semantic kernels still inspect admitted facts and carrier state
- policy tables do not emit events, select ABG vectors, mutate tickets, apply
  constitutional changes, or execute operational commands
- the extraction reduces hidden branch-owned policy without adding duplicate
  query/runtime truth

Verification:

```text
npm run test:t033
npm run test:t036
npm run test:t037
npm run test:semantic
npm run lint:semantic
```

Result:

```text
test:t033: 8 tests passed
test:t036: 6 tests passed
test:t037: 6 tests passed
test:semantic: 63 tests passed
lint:semantic: passed
```
