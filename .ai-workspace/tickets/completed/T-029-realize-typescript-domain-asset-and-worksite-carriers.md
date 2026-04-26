---
id: T-029
title: Realize TypeScript domain asset and worksite carriers
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Implement the TypeScript asset, asset family, asset binding, worksite lifecycle, work act, capability, and operational evidence carriers as immutable admitted domain truth.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: build_tenants/typescript domain model, asset typing, worksite lifecycle, software-domain catalog parity
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-028 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Python `domain_model.py`, `asset_types.py`, `software_domain_catalog.py`, and current product requirements for the software-domain worksite lifecycle
target_truth: TypeScript has closed immutable domain carriers for SDLC assets and worksite lifecycle semantics before graph-function publication or workspace mutation.
superseded_truth: Asset roles and lifecycle states are represented as loose strings spread across constructors, query projections, and app code.
closure_law: this ticket closes when admitted carriers and tests cover asset identity, asset type, asset family, asset binding, work act, capability asset, operational command/result/projection separation, and runtime-return evidence.
evaluation_criteria:
  - carriers validate input shape and fail closed on malformed/open payloads
  - software-domain catalog entries map to typed carriers
  - mutable and immutable asset semantics are explicit
  - operational transition command/result/projection are separate carrier families
  - tests derive from REQ-F-ODDSDLC-009 through REQ-F-ODDSDLC-016 and REQ-F-ODDSDLC-038
proof_surface:
  - domain carrier code
  - admission tests
  - catalog parity test against Python source material
  - test surface map entry
non_closure_conditions:
  - open JSON accepted inside domain kernel
  - lifecycle states inferred from filenames
  - operational result evidence collapsed into command intent
---

## STDO Reading

This is the inside-out carrier base for the SDLC domain.

## Closure Evidence

Completed on 2026-04-26.

Changed realization and proof surfaces:

- `build_tenants/typescript/code/src/shared/validation.ts`
- `build_tenants/typescript/code/src/domain/carriers.ts`
- `build_tenants/typescript/code/src/domain/admission.ts`
- `build_tenants/typescript/code/src/domain/operational_projection.ts`
- `build_tenants/typescript/code/src/domain/software_domain_catalog.ts`
- `build_tenants/typescript/code/src/domain/index.ts`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/test_env/test_surface_map.md`
- `build_tenants/typescript/test_env/tests/test_t029_domain_carriers.test.mjs`

Result:

The TypeScript tenant now has closed immutable admission for asset type, asset
family, asset provenance, asset checkpoint, asset, asset binding, worksite,
work-act descriptor, work act, capability, operational command, operational
result, and operational state projection. The software-domain catalog preserves
Python family and work-act names while expressing them as TypeScript carriers.

Verification:

```text
npm run test:t029
npm run test:semantic
npm run lint:semantic
git diff --check
```

STDO review:

- `S`: carriers derive from active software-domain and operational-transition
  requirements without changing WHAT.
- `T`: ticket closes with proof for closed admission, catalog parity, and
  operational command/result/projection separation.
- `D`: the realized carriers match the IACS prime domain carrier set and keep
  runtime facts outside the domain kernel.
- `O`: SDLC domain meaning is explicit in carriers; ABG remains the runtime
  traversal authority.
