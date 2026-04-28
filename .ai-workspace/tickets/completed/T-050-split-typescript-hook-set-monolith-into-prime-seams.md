---
id: T-050
title: Split TypeScript hook set monolith into prime seams
type: task
ticket_category: refactor
status: completed
goal: reduce-custom-typescript-framework-weight-through-prime-hook-seams
change_intent: The graph-purity review identified `hooks/hook_set.ts` as the clearest monolith and consolidation target. Split it into prime seams before extracting catalog and graph-function policy.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: TypeScript hook carriers, admissions, catalog construction, evaluators, work report construction, tests
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
completed_at: 2026-04-26T17:02:26Z
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: `.ai-workspace/comments/codex/20260426T065121Z_REVIEW_odd_sdlc_typescript_against_odd_method_graph_purity.md`
target_truth: Hook behavior is split into carriers, admission, catalog, evaluators, work-report construction, and test fixtures while preserving current behavior and public exports.
superseded_truth: one 1000+ LOC hook module is an acceptable long-term authority surface.
closure_law: This ticket closes when the hook module is split into prime files, tests pass, and no behavior or public import surface regresses.
evaluation_criteria:
  - hook carriers live outside `hook_set.ts`
  - admissions and evaluator/work-report logic have clear seams
  - public exports remain stable through `hooks/index.ts`
  - `npm run test:t034`, `npm run test:semantic`, and `npm run lint:semantic` pass
proof_surface:
  - `build_tenants/typescript/code/src/hooks/`
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_HOOK_CONTRACTS.md`
  - `build_tenants/typescript/test_env/tests/test_t034_hook_set.test.mjs`
  - `build_tenants/typescript/test_env/test_surface_map.md`
non_closure_conditions:
  - logic is moved without tests
  - public exports break
  - behavior changes are mixed into the split without design authority
---

# T-050: Split Hook Set Monolith

## Completion Record

Completed 2026-04-26T17:02:26Z.

Changes:

- split hook carrier constants and interfaces into `hooks/carriers.ts`
- split closed admissions into `hooks/admission.ts`
- split hook catalog construction into `hooks/catalog.ts`
- split deterministic preflight and postflight evaluators into
  `hooks/evaluators.ts`
- split work-report projection into `hooks/work_report.ts`
- split module-derived fixture helper into `hooks/fixtures.ts`
- reduced `hooks/hook_set.ts` to the hook-turn facade
- moved public seam exports to `hooks/index.ts`
- updated `ODD_SDLC_TYPESCRIPT_HOOK_CONTRACTS.md` with IACS, structural carrier
  diagram, module classifications, visibility, non-ownership, and local/global
  optimization review

Design Module Method review:

- the split reduces the maximum hook source file from the prior 1000+ LOC
  monolith to 337 LOC
- each new file owns one prime responsibility
- no module emits ABG events, selects vectors, calls public start, or retries
  locally
- no new semantic truth surface was introduced; existing hook truth was moved
  to explicit owners
- T-051 remains open for policy-branch extraction from `hooks/catalog.ts`

Verification:

```text
npm run test:t034
npm run test:semantic
npm run lint:semantic
npm run test:sandbox
```

Result:

```text
test:t034: 8 tests passed
test:semantic: 59 tests passed
lint:semantic: passed
test:sandbox: 6 tests passed
```
