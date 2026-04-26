---
id: T-028
title: Bind odd_sdlc TypeScript to ABIogenesis TypeScript substrate contract
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Define and implement the TypeScript dependency boundary to ABIogenesis GTL/ABG carriers so odd_sdlc.TS consumes substrate truth without embedding or replacing ABG runtime law.
change_class: design_reframe
re_entry_point: design
affected_boundary: build_tenants/typescript runtime adapter, package dependency contract, ABG/GTL import boundary, fixture substrate proofs
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-027 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: ABIogenesis TypeScript readiness work proving GTL graph functions, ABG iteration, no_compute_basis, traversal probes, and bootstrap lineage
target_truth: odd_sdlc.TS imports and adapts ABIogenesis GTL/ABG public carriers through one declared contract and does not fork runtime semantics.
superseded_truth: SDLC.TS can vendor copied GTL/ABG code or reconstruct runtime state through local controller logic.
closure_law: this ticket closes when the substrate dependency is declared, adapter code admits one ExecutionBasis over a published graph function, and tests prove no hidden ABG reimplementation.
evaluation_criteria:
  - substrate version/package binding is explicit
  - adapter uses published GTL/ABG carriers and public exports
  - no odd_sdlc.TS module chooses next internal vector outside ABG projection
  - no local runtime event family duplicates ABG events
  - tests reference ABIogenesis T-060/T-065/T-066 evidence as source assumptions
proof_surface:
  - substrate contract design
  - adapter code
  - unit test over one minimal graph function basis
  - negative test against local next-vector inference
non_closure_conditions:
  - ABG runtime copied into odd_sdlc.TS
  - odd_sdlc.TS creates a shadow event/projection model
  - local controller state is accepted as runtime truth
---

## STDO Reading

This ticket is the ABG boundary lock before domain graph work starts.

## Closure Evidence

Completed on 2026-04-26.

Changed design, realization, and proof surfaces:

- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
- `build_tenants/typescript/design/README.md`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/package-lock.json`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/code/src/runtime/index.ts`
- `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts`
- `build_tenants/typescript/test_env/test_surface_map.md`
- `build_tenants/typescript/test_env/tests/test_t027_scaffold.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs`

Result:

The TypeScript tenant declares a local package dependency on ABIogenesis
TypeScript `3.4.0-rc.2`, publishes an adapter boundary, admits one ABI
`ExecutionBasis` over an SDLC-owned graph function, and derives projection,
iteration, transition, and traversal probe evidence through ABI public exports.
No local runtime event family or next-vector inference is introduced.

Verification:

```text
npm run test:t028
npm run test:semantic
npm run lint:semantic
git diff --check
```

STDO review:

- `S`: the adapter realizes the existing requirement that SDLC consumes
  ABIogenesis substrate truth without repricing product semantics.
- `T`: dependency, adapter, tests, and closure evidence are named explicitly.
- `D`: the substrate contract is documented before domain graph functions
  depend on it.
- `O`: graph functions remain constructive carriers, ABI owns runtime truth,
  and SDLC owns only domain graph/module construction over that substrate.
