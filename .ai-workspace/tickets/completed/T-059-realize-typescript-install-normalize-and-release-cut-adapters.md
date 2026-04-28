---
id: T-059
title: Realize TypeScript install, normalize, and release-cut adapters
type: feature
ticket_category: build_wave_followup
status: completed
goal: future-full-python-replacement-rc
change_intent: Add bounded TypeScript side-effect adapters for installed workspace population, bootstrap command publication, and release-cut package evidence without creating a second traversal engine.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript install/normalize adapter, ABG runtime installation, package binary binding, release-cut evidence
priority: high
triaged_at: 2026-04-26T18:10:29Z
created_at: 2026-04-26T18:10:29Z
updated_at: 2026-04-26T18:10:29Z
completed_at: 2026-04-26T18:10:29Z
dependencies:
  - T-041
  - T-052 completed
  - T-058 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: T-041 blocker map rows for install/normalization, public CLI command grammar, and release-cut packaging.
target_truth: odd_sdlc.TS exposes bounded install/normalize and release-cut adapters that populate a target workspace with the TypeScript package, ABG runtime, bootstrap command guidance, binary binding, and release evidence while leaving traversal and continuation authority with GTL/ABG.
superseded_truth: semantic tests and source-local CLI commands are sufficient evidence for full operational installation or release-cut readiness.
closure_law: this ticket closes only when design, module seams, tests, and qualification maps prove install and release adapters through public TypeScript package surfaces and preserve ODD authority boundaries.
---

# T-059: TypeScript Install, Normalize, And Release-Cut Adapters

## Problem

T-058 publishes a read/query/start command adapter, but full operational RC
still lacks two side-effect boundaries:

- installing `odd_sdlc.TS` into a target workspace together with the public ABG
  TypeScript runtime installer
- producing package/release-cut evidence that proves binary binding rather than
  inferring it from source-local test execution

These are required before the TypeScript line can be evaluated as a full
operational Python-replacement candidate.

## Design Direction

The adapters must stay bounded.

They may:

- package and install the TypeScript tenant into `node_modules`
- invoke the public ABIogenesis TypeScript installer
- write installation manifests, normalization read models, and bootstrap
  command guidance
- produce release-cut package evidence and binary-binding proof

They must not:

- select graph traversal outside published GTL/ABG start surfaces
- own continuation, retry, or closure decisions
- overwrite project-owned specification truth
- import private ABIogenesis build paths

## Required Module Seams

- package binding: package identity, pack, extract, dependency link, command
  binding
- install adapter: target-root admission, ABG install invocation, bootstrap
  guidance, normalization manifest
- release adapter: package artifact and binary-binding evidence
- CLI command adapter: async shell for `install` and `release-cut`

## Acceptance

- `odd-sdlc-ts install --target <workspace>` installs the TypeScript package
  and ABG TypeScript runtime into a target workspace.
- the installed target has public `odd-sdlc-ts`, `genesis-ts`, and
  `abiogenesis-ts` command bindings.
- the install writes a TypeScript install manifest, normalization read model,
  and bootstrap command guidance without overwriting project `WHAT`.
- `odd-sdlc-ts release-cut --archive-root <dir>` writes release-cut evidence
  with package artifact path and binary-binding proof.
- tests prove installed command execution from the populated target workspace.
- tests prove no local iteration loop or traversal selection is introduced in
  the adapters.

## Non-Closure Conditions

- install succeeds only through source-local harness setup.
- the CLI gains local iteration, retry, or traversal-selection authority.
- release-cut evidence is inferred from `npm run build` alone.
- ABG installation is bypassed or replaced with odd_sdlc-owned runtime truth.

## Completion Record

Delivered:

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md`
- `build_tenants/typescript/code/src/package_binding/`
- `build_tenants/typescript/code/src/install/`
- `build_tenants/typescript/code/src/release/`
- async CLI commands `install` and `release-cut`
- package exports `./install` and `./release`
- `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`

Proof:

- installed API path populates a target workspace with
  `@odd-sdlc/typescript-tenant`
- public ABG TypeScript installer is invoked and binds `genesis-ts` and
  `abiogenesis-ts`
- installed `odd-sdlc-ts gaps --workspace <target>` executes from the target
  workspace
- install manifest, normalization projection, and bootstrap guidance are
  written
- release-cut writes a package artifact, manifest, postmortem, and binary
  binding proof
- adapters do not import public-start or advancement-transition selection

Verification:

- `npm run test:t059` passed: 4 tests.
