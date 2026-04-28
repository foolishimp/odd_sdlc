---
id: T-061
title: Repair TypeScript install topology under ABIogenesis product tenant root
type: defect
ticket_category: corrective_followup
status: completed
goal: future-full-python-replacement-rc
change_intent: Make odd_sdlc.TS install payloads land under the ABG installed substrate root using the `.abiogenesis/<product>/<build_tenant>/` topology instead of creating a peer `.odd_sdlc/` root.
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: downstream install topology, TypeScript install adapter, package extraction root, installed-workspace proof
priority: high
triaged_at: 2026-04-27T01:30:12Z
created_at: 2026-04-27T01:30:12Z
updated_at: 2026-04-27T01:30:12Z
completed_at: 2026-04-27T01:30:12Z
dependencies:
  - T-059 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: operator review of data_mapper.test46.ts install output showed ABG installing under `.abiogenesis/` while odd_sdlc.TS created a peer `.odd_sdlc/` root.
target_truth: downstream installed odd-product payloads use `.abiogenesis/<product>/<build_tenant>/...`; odd_sdlc.TS uses `.abiogenesis/odd_sdlc/typescript/...`.
superseded_truth: `.odd_sdlc/typescript/...` is an acceptable peer installed-product root beside `.abiogenesis/`.
closure_law: close only when the requirement/design wording, installer topology, package binding seam, and install tests reject the peer `.odd_sdlc/` root.
---

# T-061: TypeScript Install Topology Under ABIogenesis Root

## Problem

T-059 made the TypeScript installer operational, but it installed odd_sdlc.TS
package evidence under `.odd_sdlc/typescript/` while the ABG installer populated
`.abiogenesis/`.

That split contradicted the installed-product topology:

- the hidden install root is ABG-owned substrate
- installed odd-product payloads live below that root
- the product/build-tenant path is `.abiogenesis/<product>/<build_tenant>/...`

## Correction

- Move odd_sdlc.TS pack, extract, and manifest paths to
  `.abiogenesis/odd_sdlc/typescript/...`.
- Keep Node package mechanics generic by passing the extraction root into
  `package_binding` instead of hard-coding domain topology there.
- Publish `productInstallRoot` in the install manifest and installed outcome.
- Update the TypeScript install design and live topology requirements to name
  `.abiogenesis/<product>/<build_tenant>/...`.
- Add install tests proving `.odd_sdlc/` is not created.

## Acceptance

- `oddSdlcTypescriptProductInstallRoot(<target>)` resolves to
  `<target>/.abiogenesis/odd_sdlc/typescript`.
- `odd-sdlc-ts install` writes its manifest under that root.
- package pack/extract evidence is under that root.
- the public install API and CLI install path do not create `.odd_sdlc/`.
- ABG remains the substrate installer and command owner for `genesis-ts` /
  `abiogenesis-ts`.

## Completion Record

Changed:

- `specification/PRODUCT.md`
- `specification/requirements/05-realization-topology.md`
- `specification/requirements/08-odd-sdlc-first-slice.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/scenarios/04-tenant-realization-topology.md`
- `specification/scenarios/15-odd-sdlc-self-induction-worksite.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md`
- `build_tenants/typescript/code/src/install/`
- `build_tenants/typescript/code/src/package_binding/node_package.ts`
- `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`

Verification:

- `npm run test:t059` passed: 4 tests.
- `npm run test:semantic` passed: 73 tests.
- clean `data_mapper.test46.ts` install writes
  `.abiogenesis/odd_sdlc/typescript/install-manifest.json` and creates no
  `.odd_sdlc/` peer root.
