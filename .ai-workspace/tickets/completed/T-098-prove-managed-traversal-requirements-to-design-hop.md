# T-098 — Prove Managed Traversal Requirements To Design Hop

status: completed
priority: critical
change_class: design_reframe
re_entry_point: design
created: 2026-04-28
owner: codex

## Claim

`T-096` and `T-097` proved the managed traversal shape for deterministic
bootstrap induction. The next proof must apply the same wrapper to a normal
prompt-bearing SDLC edge:

```text
{ requirement_surface, feature_decomp_surface }
  -> ManagedTraversal<RequirementDesignInput, DesignSurface>
  -> design_surface
```

The existing graph edge is:

```text
derive_design_surface
```

It must remain a specialization of `Fg_single_typed_traversal`; this ticket
must not introduce a second design graph or a side-channel orchestration loop.

## STDO Triage

First missing layer: design/code/proof.

The current operator already builds a worker handoff manifest for F_P edges and
already folds postprocess truth through the assurance ledger family hardened by
`T-085`. The missing slice is not a new ledger. It is an integration proof that
`derive_design_surface` is a managed traversal using the existing manifest,
worker report, postflight, assurance ledgers, and satisfaction fold.

## Target Truth

For `derive_design_surface`, the installed operator archive must expose the
existing managed traversal surfaces:

- graph function
- edge name
- source type set
- target type
- source refs / authority refs
- expected output path
- worker result report
- postflight result
- `assurance_ledgers.json`
- `assurance_satisfaction.json`

## Closure Bar

This ticket closes only when a focused TypeScript test drives an installed
workspace through the graph until `derive_design_surface`, proves that the
design edge closes, and asserts the existing assurance ledger fold is satisfied
for that edge.

## Non-Goals

- Do not alter ABG runtime mechanics.
- Do not introduce a second postprocess ledger family; `T-085` assurance
  ledgers remain the evaluation authority for prompt-bearing traversals.
- Do not skip the existing requirement, feature decomposition, and design graph
  edges.
- Do not make design closure depend on Ticket Method tickets.

## Closure Evidence

Implemented a focused integration proof that drives an installed workspace
through:

```text
derive_intent_surface
derive_product_surface
derive_goal_surface
derive_requirement_surface
derive_feature_decomp_surface
derive_uat_testcases_surface
derive_design_surface
```

The design edge closes through the existing archive surfaces:

- `handoff_manifest.json`
- `worker_result_report.json`
- `postflight.json`
- `assurance_ledgers.json`
- `assurance_satisfaction.json`

The test explicitly asserts that `derive_design_surface` does not create a
new `managed_traversal_ledger.json`; the assurance ledger family is the
postprocess/evaluation authority for this prompt-bearing edge.

Changed surfaces:

- `build_tenants/typescript/test_env/tests/test_t098_requirements_to_design_assurance.test.mjs`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_MANAGED_TRAVERSAL_BOOTSTRAP.md`

Proof:

- `npm run test:t098` passed.
- `npm run test:t097` passed.
- `npm run test:t084` passed.
- `npm run test:t077-t083` passed.
- `npm run test:semantic` passed: 133 tests.
- `npm run lint:semantic` passed.
