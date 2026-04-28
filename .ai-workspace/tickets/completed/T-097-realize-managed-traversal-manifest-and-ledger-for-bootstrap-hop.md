# T-097 — Realize Managed Traversal Manifest And Ledger For Bootstrap Hop

status: completed
priority: critical
change_class: design_reframe
re_entry_point: design
created: 2026-04-28
owner: codex

## Claim

`T-096` proved that `Fg_conform_project` can turn an unordered source set into
`INTENT`, `PRODUCT`, and requirement-family surfaces. The next lawful step is
to stop treating that managed traversal shape as an implicit interpretation of
`conform_project_report.json`.

The bootstrap hop needs explicit graph-owned carriers:

```text
ManagedTraversalManifest:
  source set + target surface contract + expected topology

ManagedTraversalLedger:
  actual materialized topology + phase verdicts + residual gaps
```

## STDO Triage

First missing layer: design/code.

The product requirement already requires graph-native execution, ABG runtime
truth, explicit proof surfaces, and installed operator evidence. The missing
piece is the typed realization carrier that makes the higher-order wrapper
visible in archives and tests.

## Target Truth

For this slice, implement the carriers only for:

```text
ManagedTraversal<UnorderedSourceSet, ConstitutionalBootstrap>
```

bound to:

```text
Fg_conform_project
```

The manifest must expose:

- source type
- target type
- graph function
- source refs
- expected output topology
- prestep / execute / postprocess phase contract

The ledger must expose:

- graph function
- source and target types
- status
- actual output refs
- phase verdicts
- residual gaps

## Closure Bar

This ticket closes only when a focused TypeScript test proves that an installed
bootstrap run archives both:

- `managed_traversal_manifest.json`
- `managed_traversal_ledger.json`

and that the ledger closes only after the expected constitutional surfaces are
present.

## Non-Goals

- Do not implement the full generic higher-order wrapper for every graph edge.
- Do not alter ABG runtime mechanics.
- Do not convert execution gaps into Ticket Method tickets.

## Closure Evidence

Implemented the bootstrap managed traversal as explicit TypeScript carriers:

- `SdlcManagedTraversalManifest`
- `SdlcManagedTraversalLedger`
- phase contracts
- phase verdicts

The installed operator now archives:

- `managed_traversal_manifest.json`
- `managed_traversal_ledger.json`

for the `Fg_conform_project` deterministic bootstrap hop.

Changed surfaces:

- `build_tenants/typescript/code/src/workspace/carriers.ts`
- `build_tenants/typescript/code/src/workspace/project_profile.ts`
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_MANAGED_TRAVERSAL_BOOTSTRAP.md`
- `build_tenants/typescript/test_env/tests/test_t097_managed_traversal_carriers.test.mjs`
- `build_tenants/typescript/package.json`

Proof:

- `npm run test:t097` passed.
- `npm run test:t096` passed.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed: 132 tests.
