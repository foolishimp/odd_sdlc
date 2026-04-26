---
id: T-027
title: Scaffold odd_sdlc TypeScript package strict lane and test harness
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Create the minimal TypeScript tenant package, strict compiler lane, lint lane, test runner, export boundaries, and package metadata without implementing domain behavior yet.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: build_tenants/typescript package scaffold, build scripts, test harness, tenant registry
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-026 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: build wave sequencing after TypeScript tenant authority and topology design
target_truth: The TS tenant has a package-first skeleton with strict typing and test surfaces ready for module-derived implementation tickets.
superseded_truth: Domain code can be added into an ungoverned TypeScript folder with no tenant package boundary or strict lane.
closure_law: this ticket closes when the tenant package builds, lints, runs an empty/smoke test lane, exports only the declared public surface, and carries no SDLC behavior beyond scaffold contracts.
evaluation_criteria:
  - package has TypeScript config with strict mode
  - lint/test/build scripts exist and run
  - package root exports are explicit and minimal
  - test_env and test_surface_map exist
  - scaffold does not copy Python runtime behavior
proof_surface:
  - npm build/lint/test commands
  - package.json
  - tsconfig/eslint/test harness files
  - test surface map
non_closure_conditions:
  - scaffold includes hidden domain behavior
  - package exports internal carriers prematurely
  - strict typing is weakened to accommodate early code
---

## STDO Reading

This ticket creates the empty but governed implementation substrate.

## Closure Evidence

Completed on 2026-04-26.

Changed realization and proof surfaces:

- `build_tenants/typescript/README.md`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/package-lock.json`
- `build_tenants/typescript/tsconfig.semantic-strict.json`
- `build_tenants/typescript/eslint.config.mjs`
- `build_tenants/typescript/.gitignore`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/test_env/test_surface_map.md`
- `build_tenants/typescript/test_env/tests/test_t027_scaffold.test.mjs`

Result:

The TypeScript tenant has a package boundary, strict TypeScript lane, lint
lane, smoke test lane, explicit public export, and ignored generated dependency
and build surfaces. The exported code carries scaffold identity only and does
not realize SDLC domain behavior.

Verification:

```text
npm run test:t027
npm run lint:semantic
git diff --check
```

STDO review:

- `S`: realization stays under the TypeScript tenant product/requirement
  authority and does not change upstream WHAT surfaces.
- `T`: ticket closes with explicit proof surfaces and no hidden non-closure
  condition.
- `D`: strict lane and test-surface map establish the implementation scaffold
  before module behavior lands.
- `O`: scaffold preserves the ODD carrier boundary; graph programs, ABG
  runtime binding, and SDLC hooks remain future governed tickets.
