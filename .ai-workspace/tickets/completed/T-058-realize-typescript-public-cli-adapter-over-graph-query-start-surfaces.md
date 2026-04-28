---
id: T-058
title: Realize TypeScript public CLI adapter over graph/query/start surfaces
type: feature
ticket_category: build_wave_followup
status: completed
goal: build-odd-sdlc-typescript-as-operational-candidate
change_intent: Add a bounded TypeScript command adapter that exposes current graph catalog, query-domain, gaps, start, and RC-report readouts without creating a second traversal engine.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript package bin, CLI adapter module, workspace authority reader, query/start projection commands, T-041 full operational RC blocker map
priority: high
triaged_at: 2026-04-26T17:58:00Z
created_at: 2026-04-26T17:58:00Z
updated_at: 2026-04-26T18:08:00Z
closed_at: 2026-04-26T18:08:00Z
dependencies:
  - T-041
  - T-052 completed
  - T-053 completed
  - T-057 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: T-041 still records missing public CLI command grammar after bounded package, sandbox, and live lanes closed.
target_truth: odd_sdlc.TS publishes a package binary whose commands are thin adapters over admitted graph catalog, query-domain, gaps, start, and qualification report carriers.
superseded_truth: TypeScript public operation can remain API-only while evaluating the full operational Python-replacement lane.
closure_law: This ticket closes only when the TypeScript package declares a binary, the CLI module has design-module review, tests prove the command adapter uses existing graph/query/start surfaces, and qualification maps distinguish this bounded CLI slice from install/normalize and release-cut replacement.
---

# T-058: TypeScript Public CLI Adapter

## Scope

This ticket owns the first TypeScript public command adapter.

It does not own:

- installed workspace mutation
- package install/normalize
- release-cut packaging
- worker execution
- ABG iteration or retry selection
- Python archive equivalence

## Required Commands

- `catalog`
- `query-domain`
- `gaps`
- `start`
- `rc-report`

## Design Law

The CLI is an adapter. It may parse operator arguments, read workspace
authority surfaces, and call public TypeScript projection APIs. It must not
become a controller loop.

## Non-Closure Conditions

- CLI code constructs graph truth outside `graph/`.
- CLI code chooses next traversal outside ABG/public start projection.
- CLI code mutates installed workspace state.
- CLI success is used to claim full T-041 operational replacement.

## Closure Evidence

Implemented surfaces:

- `build_tenants/typescript/code/src/cli/command.ts`
- `build_tenants/typescript/code/src/cli/main.ts`
- `build_tenants/typescript/code/src/cli/index.ts`
- package export `./cli`
- package binary `odd-sdlc-ts`
- package script `npm run test:t058`
- design surface
  `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_PUBLIC_CLI_ADAPTER.md`

Supported commands:

- `catalog`
- `query-domain`
- `gaps`
- `start`
- `rc-report`

Verification:

- `npm run test:t058`: passed, 6 tests

## Design Module Method Review

The new CLI seam is a public adapter module. It owns argument admission,
read-only workspace source discovery, JSON process binding, and calls into
existing graph/query/start/qualification carriers.

It does not own traversal, iteration, worker execution, install/normalize,
release-cut packaging, or graph truth.

Local optimization:

- one command module, one binary entry point, one export boundary
- no command-specific hidden service layer
- workspace reading is transformed immediately into existing source-input and
  ingress carriers

Global optimization:

- public command grammar is now present for the bounded package claim
- T-041 remains open for installed workspace mutation, release-cut packaging,
  and Python archive equivalence
- the CLI adapter cannot become a second ABG runner because tests guard against
  local iteration and install authority

## Residual Non-Claims

T-058 does not close:

- installed workspace install/normalize
- release-cut packaging or public binary distribution
- full Python operational replacement
- T-041
