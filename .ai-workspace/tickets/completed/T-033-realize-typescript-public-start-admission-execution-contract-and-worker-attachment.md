---
id: T-033
title: Realize TypeScript public start admission execution contract and worker attachment
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Implement the TypeScript public start chain for scope, target, until, execution contract admission, worker attachment, and ABG handoff without replacing ABG iteration.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: CLI start, public start carriers, start target resolution, execution contract source carrier, F_P worker readiness, ABG start adapter
priority: critical
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-032 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Python `public_start.py`, `start_targeting.py`, `execution_contract.py`, `worker_attachment.py`, ABIogenesis TypeScript M03/M04 start and iteration proofs
target_truth: SDLC.TS can admit `next`, `graph_function:<handle>`, and `asset:<handle>` starts, bind one execution contract, verify worker readiness for F_P, call ABG, and project one truthful stop/block/dispatch/converged result.
superseded_truth: Public start is implemented as a tenant-local loop that inspects state, decides next steps, and summarizes the outcome as if ABG owned it.
closure_law: this ticket closes when public start admits exactly one lawful boundary per call, blocks on missing worker/capability truth, and returns control after ABG outcome projection.
evaluation_criteria:
  - start request grammar is closed over scope + target + until plus orthogonal policy modes
  - target resolution consumes query-domain/start-target catalog truth
  - execution contract is admitted before prompt-bearing or dispatch-bearing work
  - F_P worker unattached condition blocks before silent wait
  - tests prove public start does not own internal graph-function iteration
proof_surface:
  - start carrier/admission code
  - execution contract tests
  - worker attachment tests
  - integration test over one graph_function target
non_closure_conditions:
  - public start runs hidden multi-step SDLC traversal
  - worker dispatch happens without admitted execution contract
  - asset target resolution bypasses ownership index
---

## STDO Reading

This is the lawful ignition boundary, not the runtime engine.

## Closure Evidence

Completed on 2026-04-26.

Changed realization and proof surfaces:

- `build_tenants/typescript/code/src/start/public_start.ts`
- `build_tenants/typescript/code/src/start/index.ts`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/test_env/test_surface_map.md`
- `build_tenants/typescript/test_env/tests/test_t033_public_start.test.mjs`

Result:

The TypeScript tenant now admits a closed public-start request, resolves
`next`, `graph_function`, and `asset` targets through query-domain read models,
constructs one execution contract over ABI `ExecutionBasis`, blocks F_P starts
when worker attachment is missing, and projects one ABI advancement handoff
without tenant-local iteration.

Correction update: public start now validates that the resolved query-domain
target is still present in the admitted module before execution-contract
construction. Stale query-domain/module pairs return a typed blocked result
instead of throwing through ABI admission.

Verification:

```text
npm run test:t033
npm run test:semantic
npm run lint:semantic
git diff --check
```

STDO review:

- `S`: public start realizes the active ignition/worker-attachment
  requirements without changing runtime ownership.
- `T`: ticket closes with request grammar, worker blocking, stale-read-model
  blocking, and one-handoff proof.
- `D`: execution contract and worker attachment are closed carriers before
  dispatch projection.
- `O`: ABG owns advancement; public start is a safe entry point only.
