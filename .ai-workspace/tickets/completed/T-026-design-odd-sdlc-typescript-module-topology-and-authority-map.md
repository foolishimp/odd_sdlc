---
id: T-026
title: Design odd_sdlc TypeScript module topology and authority map
type: design
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Produce the TypeScript design pack that maps GTL program publication, ABG runtime boundary, SDLC domain hooks, projections, gap triage, workspace admission, and CLI bindings before code lands.
change_class: design_reframe
re_entry_point: design
affected_boundary: build_tenants/typescript/design, build_tenants/common/design, Python topology comparison, ABIogenesis TypeScript substrate reference
priority: critical
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-025 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: ODD/ABG topology strategy and operator requirement that SDLC.TS be rebuilt as an ODD-native app, not a Python-shaped framework
target_truth: A ratified design pack shows odd_sdlc.TS as SDLC(ABG(Iterate(SDLC.Graph, ioc(SDLC hooks)))) with read models, public starts, and hooks separated by authority.
superseded_truth: The TS tenant topology is inferred from Python modules or an informal strategy post.
closure_law: this ticket closes when the design pack includes derivation, IACS, structural carrier diagram, module ownership table, and explicit non-ownership rules for ABG, GTL, and SDLC.
evaluation_criteria:
  - design names TS module groups for graph, compute hooks, runtime adapter, domain assets, projections, CLI, qualification, and workspace admission
  - design identifies which modules may call ABG, write workspace state, or admit another traversal
  - design maps current Python functionality to ODD-native roles without preserving Python file boundaries as law
  - design distinguishes graph, graph function, graph-function typed surface, start target, and asset binding
  - design declares test categories for unit/module-derived proof and UAT/sandbox proof
proof_surface:
  - build_tenants/typescript/design/README.md
  - TypeScript derivation/IACS/structural carrier diagram
  - Python comparison matrix
non_closure_conditions:
  - design blesses hidden traversal loops
  - projections are treated as source truth
  - code lands before carrier inventory and authority map are ratified
---

## STDO Reading

This is the design-module gate for the whole build wave.

## Closure Evidence

Completed on 2026-04-26.

Changed design and trace surfaces:

- `build_tenants/typescript/design/README.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_FIRST_SLICE_IACS.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_STRUCTURAL_CARRIER_DIAGRAM.md`
- `build_tenants/typescript/design/PYTHON_DISCOVERY_TO_TYPESCRIPT_ODD_ROLE_MAP.md`
- `specification/requirements/13-odd-sdlc-typescript-tenant.md`
- `build_tenants/TENANT_REGISTRY.md`

Result:

The TypeScript tenant has an active design pack that separates GTL graph
publication, ABG runtime truth, SDLC domain carriers, workspace admission,
public start, hooks, projections, triage, operational evidence, CLI adapters,
and qualification.

Verification:

```text
git diff --check
```

STDO review:

- `S`: design derives from product and requirement authority and reciprocates
  the requirement-side `Authoring Design` field.
- `T`: ticket has closure evidence and no implementation claim.
- `D`: derivation, IACS, structural carrier diagram, and Python role map are
  present before code.
- `O`: design keeps outcome traversals and graph functions ahead of
  deterministic module realization, and blocks Python-shaped shadow runtime
  drift.
