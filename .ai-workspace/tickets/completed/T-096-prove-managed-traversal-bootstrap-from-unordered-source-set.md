# T-096 — Prove Managed Traversal Bootstrap From Unordered Source Set

status: completed
priority: critical
change_class: design_reframe
re_entry_point: design
created: 2026-04-28
owner: codex

## Claim

The first useful proof of the higher-order `ManagedTraversal<A, B>` pattern is
the bootstrap hop:

```text
{ unordered source documents }
  -> ManagedTraversal<UnorderedSourceSet, ConstitutionalBootstrap>
  -> { INTENT.md, PRODUCT.md, requirements/* }
```

If this works as a graph-function-owned traversal, the same pattern can be
generalized to later hops:

```text
requirements -> design
design -> modules
modules -> implementation
implementation -> tests
```

## STDO Triage

First missing layer: design/proof.

The product already has `Fg_conform_project`, but the current proof should be
sharpened as the first concrete managed traversal. The edge must not be treated
as installer normalization or prompt setup. It is the first graph-owned hop
that turns external context into governed surfaces.

## Target Truth

`Fg_conform_project` is the first Managed Traversal instance:

```text
prestep:
  unordered source set + graph edge contract -> traversal manifest/work order

execute:
  traversal manifest -> materialized INTENT, PRODUCT, requirements

postprocess:
  actual surfaces vs manifest/source set -> conformance report / gaps
```

For this slice, the existing installed execution contract and
`conform_project_report.json` are accepted as the manifest/ledger proof
surfaces. A later ticket may split them into explicit `ManagedTraversalManifest`
and `ManagedTraversalLedger` carriers.

## Closure Bar

This ticket closes only when a focused TypeScript test proves that an
understructured workspace containing unordered source documents and project
constraints routes through `Fg_conform_project` and produces:

- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/00-imported-sources.md`
- deterministic requirement-family files
- `conform_project_report.json` with admitted source refs and materialized
  topology refs
- downstream traversal blocked until the managed bootstrap closes

## Non-Goals

- Do not implement the full generic managed traversal higher-order function in
  this ticket.
- Do not introduce code generation or test generation.
- Do not create governance tickets from execution gaps.

## Closure Evidence

Implemented in the TypeScript tenant as the first focused proof that
`Fg_conform_project` can act as a managed traversal from unordered source
documents to constitutional bootstrap surfaces.

Changed surfaces:

- `build_tenants/typescript/code/src/workspace/project_profile.ts`
- `build_tenants/typescript/test_env/tests/test_t096_managed_traversal_bootstrap.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t068_conform_project_profile.test.mjs`
- `build_tenants/typescript/package.json`

Proof:

- `npm run test:t096` passed.
- `npm run test:t068` passed.
- `npm run test:semantic` passed: 131 tests.
- `npm run lint:semantic` passed.
