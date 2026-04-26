---
id: T-034
title: Realize TypeScript SDLC constructor and evaluator hook set
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Implement the first SDLC-owned TypeScript IoC hooks for bounded construction and evaluation over core graph-function edges.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: constructor hooks, deterministic evaluators, probabilistic evaluator contracts, work reports, generated asset contracts
priority: critical
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-033 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Python `constructor.py`, `fd_checks.py`, `fd_contracts.py`, `repair_frontier.py`, ABIogenesis TypeScript scenario catalog for extraction/synthesis/transform/fan-out/ambiguity/gap evaluation
target_truth: SDLC.TS can perform one bounded constructor/evaluator turn for each selected edge class and return evidence to ABG without owning next traversal.
superseded_truth: Constructor logic is one broad imperative function that decides asset work, writes files, assesses completion, and implies the next action.
closure_law: this ticket closes when the first hook set supports bootstrap specification, design, implementation, qualification, release, and operational-return edges through declared work-report/evaluator contracts.
evaluation_criteria:
  - each hook has typed input, output, work report, and evidence contract
  - F_D preflight and postflight checks are separate from F_P construction
  - generated asset contract failures block closure
  - ambiguity/candidate surfaces are preserved instead of hidden merges
  - tests would fail against traceability-only shell outputs
proof_surface:
  - hook contract code
  - constructor/evaluator tests
  - generated asset contract tests
  - data_mapper behavioral fixture proof candidate
non_closure_conditions:
  - hooks select future graph traversal
  - trace tags or comments are accepted as behavioral fulfillment
  - constructor writes untyped surfaces outside admitted asset bindings
---

## STDO Reading

This ticket is the SDLC domain HOW, bounded inside ABG-selected edges.

## Closure Evidence

Completed on 2026-04-26.

Changed realization and proof surfaces:

- `build_tenants/typescript/code/src/hooks/hook_set.ts`
- `build_tenants/typescript/code/src/hooks/index.ts`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_HOOK_CONTRACTS.md`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/test_env/test_surface_map.md`
- `build_tenants/typescript/test_env/tests/test_t034_hook_set.test.mjs`

Result:

The TypeScript tenant now publishes an SDLC-owned hook contract catalog over
the active graph-function edge classes, admits bounded hook invocations and
work reports, separates F_D preflight and postflight from F_P construction,
blocks trace-only shell outputs through generated-asset contract failure, and
preserves ambiguity candidates instead of merging them away.

Correction update: work reports now carry graph-function authority for the
generated asset, carry both requested and returned operation, and postflight
blocks when requested and returned operation disagree. Serialized work-report
admission also rejects the wrong carrier kind.

Verification:

```text
npm run test:t034
npm run test:semantic
npm run lint:semantic
git diff --check
```

STDO review:

- `S`: the work realizes software-domain traversal requirements without
  changing runtime authority.
- `T`: ticket closes with hook contracts, evaluator proof, generated-asset
  authority/failure proof, requested-operation proof, ambiguity proof, wrong
  kind proof, and full semantic lane.
- `D`: `SdlcWorkReport` is a prime hook carrier with closed input/output and
  evidence contracts.
- `O`: hooks operate only for one ABG-selected edge and do not select the next
  traversal or emit ABG runtime events.
