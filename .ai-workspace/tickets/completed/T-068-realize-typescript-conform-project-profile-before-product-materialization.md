---
id: T-068
title: Realize TypeScript conform-project profile before product materialization
type: defect
ticket_category: rc_blocker
status: completed
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Restore the missing generic bootstrap layer `{documents} -> conform project -> graph program execution` so TypeScript product materialization is driven by conformed project truth rather than shallow defaults or data-mapper-specific smoke harnesses.
change_class: design_reframe
re_entry_point: design
affected_boundary: workspace ingress, project profile canonicalization, graph-function library, installed operator handoff, product materialization postflight, data_mapper external qualification lane
priority: critical
triaged_at: 2026-04-27T11:39:32Z
created_at: 2026-04-27T11:39:32Z
updated_at: 2026-04-27T11:50:43Z
dependencies:
  - T-041
  - T-066
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: operator correction that the bootstrap must be `{ documents } -> conform project -> ...`, and that data_mapper is an external sufficiency bar rather than a product-specific target to encode.
target_truth: The TypeScript tenant admits raw bootstrap documents and project constraints into a canonical conform-project profile before worker handoff, graph execution, or product materialization can claim downstream project truth.
superseded_truth: Directly deriving `SdlcProjectConstraints` from a few scalar lines is sufficient project conformance for installed operator execution.
closure_law: This ticket closes only when TypeScript publishes a generic conform-project carrier/function, derives tenant root, module structure, capability contracts, and execution contracts from project declarations, feeds that profile into installed operator handoff, and proves the behavior with generic non-data-mapper tests.
evaluation_criteria:
  - reusable graph-function catalog names a conform-project step distinct from broad ingress
  - conformed project profile carries active tenant, selected output root, declared modules, capability contracts, execution contracts, realization mode, and provenance digest
  - `deriveSdlcProjectConstraintsFromWorkspace` projects from the conformed profile rather than rescanning raw scalar defaults
  - installed worker handoff archives and prompts the conformed project profile before materialization
  - generic tests prove arbitrary tenant/module/capability declarations without data_mapper-specific assumptions
  - T-066 remains a postflight guard and does not overclaim full generic project realization
proof_surface:
  - TypeScript design update for workspace ingress/conform-project seam
  - graph-function catalog update
  - conform-project carrier and parser tests
  - installed operator handoff test update
  - T-066 correction note
non_closure_conditions:
  - materialization succeeds by hard-coding Scala/data_mapper paths
  - worker prompt receives only `activeTenant` and `selectedOutputRoot`
  - direct YAML scalar scanning remains the operative project profile
  - data_mapper smoke evidence is cited as generic closure without the conform-project carrier
---

## STDO Triage

First missing layer: design.

The active requirements already require conformant downstream topology
(`REQ-F-ODDSDLC-032`) and graph-function-derived worker handoff
(`REQ-F-ODDSDLC-053`). The defect is that the TypeScript design and
realization skipped the canonical project profile surface between raw
documents and operator materialization.

This is not a request to add Scala/data_mapper behavior. Data mapper remains an
external qualification workload. The product change is generic project
conformance.

## Design Diagnosis

The first T-066 slice was necessary but incomplete. It rejects markdown-only
code/test realization, but it attaches the product-output contract at worker
handoff after a shallow constraints projection.

The missing carrier is:

```text
{ documents, project_constraints } -> ConformProjectProfile
```

Downstream graph edges and handoff manifests then consume:

- selected tenant
- selected output root
- declared module names
- capability contracts
- build/test/deploy/runtime execution contracts
- realization mode
- source constraint digest and conformance gaps

## Python Discovery Evidence

The Python tenant already carried this shape through `ProjectProfile`:

- v3.1 `build_tenants.<tenant>` registry admission
- v3.2 `structure.design_tenants[]` admission
- tenant output directory canonicalization
- module structure extraction
- capability contract extraction
- execution contract inference from selected tenant truth
- realization-mode classification

The TypeScript tenant must translate that into an ODD-native graph-function and
carrier slice rather than porting the Python service structure or encoding
data_mapper assumptions.

## Closure Evidence

Implemented:

- published `Fg_conform_project` in the reusable graph-function library
- added `SdlcConformProjectProfile` and `SdlcConformProjectReport`
- added deterministic TypeScript project-profile canonicalization over raw
  project constraints
- projected legacy `SdlcProjectConstraints` from the conformed profile instead
  of shallow scalar scanning
- fed `conformedProject` into installed worker handoff manifests
- archived `conformed_project.json` beside each handoff manifest
- extended product materialization contracts with declared modules and
  execution-contract evidence
- documented the conform-project seam in TypeScript ingress, reusable
  graph-function, and installed-operator designs

Generic proof:

- `test_t068_conform_project_profile.test.mjs` uses arbitrary tenant fixtures
  rather than data_mapper product assumptions
- one fixture proves arbitrary tenant/module/capability conformance
- one fixture proves selected-tenant execution contract inference
- one fixture proves installed handoff carries conformed project evidence
  before product materialization

Verification:

- `npm run test:t068` passed, 3 tests
- `npm run test:t030` passed, 7 tests
- `npm run test:t066` passed, 2 tests
- `npm run test:semantic` passed, 81 tests
- `npm run lint:semantic` passed
- `npm run test:sandbox` passed, 6 tests

Residual boundary:

This closes the missing conform-project slice. It does not close full
`data_mapper` operational RC, recursive realization depth, or test35 inventory
parity. Those remain governed by `T-041` and `T-066`.
