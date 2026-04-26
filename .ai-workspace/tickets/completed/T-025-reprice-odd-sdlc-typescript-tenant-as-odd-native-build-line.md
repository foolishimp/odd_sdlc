---
id: T-025
title: Reprice odd_sdlc TypeScript tenant as ODD-native build line
type: design
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Open the SDLC.TS build line as a governed tenant of odd_sdlc, with Python treated as discovery evidence and ABIogenesis TypeScript treated as substrate proof rather than architecture to copy blindly.
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: specification product/requirements, build tenant registry, TypeScript tenant authority, Python comparison boundary
priority: critical
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies: []
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: operator request to create the build-ticket set required to build odd_sdlc.TS, using recent odd_sdlc.python iterations as functionality evidence and ODD-native TypeScript as the rebuild target
target_truth: odd_sdlc.TS is an ODD-native tenant build line whose public claim, tenant registry entry, and authority chain are explicit before implementation starts.
superseded_truth: TypeScript work can begin as a file-by-file Python port or as an ABIogenesis qualification experiment without a local odd_sdlc product re-entry.
closure_law: this ticket closes when the product/tenant authority states what odd_sdlc.TS is, what it is not, what Python evidence it may consume, and what substrate truth it inherits from ABIogenesis TypeScript.
evaluation_criteria:
  - tenant registry names a TypeScript tenant or explicitly admits the planned tenant line
  - product definition distinguishes odd_sdlc.python discovery behavior from odd_sdlc.TS target behavior
  - requirements or design state that odd_sdlc.TS is graph-function-first and ABG-subordinate
  - Python source material is classified as evidence, not architecture authority
  - the build wave has a ticket/dependency chain before implementation tickets proceed
proof_surface:
  - product/tenant registry diff
  - requirements/design diff if required
  - ticket dependency chain
non_closure_conditions:
  - TS tenant appears only as code without product authority
  - Python file layout is treated as the target architecture
  - ABIogenesis TypeScript substrate proof is confused with odd_sdlc.TS product completion
---

## STDO Reading

This is the lawful re-entry ticket for the TS build line. Do not implement
tenant code before this authority is accepted or superseded.

## Closure Evidence

Completed on 2026-04-26.

Changed authority surfaces:

- `specification/GOALS.md`
- `specification/PRODUCT.md`
- `specification/requirements/13-odd-sdlc-typescript-tenant.md`
- `specification/requirements/README.md`
- `build_tenants/README.md`
- `build_tenants/TENANT_REGISTRY.md`

Result:

`odd_sdlc.TS` is now a governed planned TypeScript tenant line over the
singleton `odd_sdlc` product specification. Python is classified as operational
discovery evidence, not TypeScript architecture authority. ABIogenesis
TypeScript is classified as substrate proof, not SDLC product completion.

Verification:

```text
git diff --check
```

STDO review:

- `S`: lawful product reprice; product, goals, requirements, and tenant
  registry now state the authority chain.
- `T`: ticket has closure evidence and remains one durable work item.
- `D`: no realization module closure is claimed; this ticket only opens the
  product/tenant authority layer.
- `O`: TypeScript line is constrained to graph functions, typed assets, and
  ABG runtime truth rather than Python-shaped imperative porting.
