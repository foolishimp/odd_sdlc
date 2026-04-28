# Review: data_mapper.test52 Bootstrap Induction Bug

**Status**: current diagnostic, not closure evidence
**Workspace**: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts`
**Governing ticket**: `active/T-091-harden-typescript-traversal-closure-against-lossy-obligation-carriers.md`

## Summary

`data_mapper.test52.ts` proves the installer topology and first induction edge
now run in the correct order, but it also exposes a remaining bootstrap defect:
project induction can close after creating a single imported-source marker
ledger, while downstream prompt edges receive generic requirement IDs rather
than concrete imported requirement pressure.

This is before code. Continuing to `derive_code_surface` would only bury the
real failure.

## What Ran

Installed current `odd_sdlc.TS` into:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts
```

The install topology was correct:

- `.abiogenesis/odd_sdlc/typescript/install-manifest.json`
- `.abiogenesis/typescript-installer-manifest.json`
- `AGENTS.md`
- `CLAUDE.md`
- `node_modules/.bin/odd-sdlc-ts`
- `node_modules/.bin/abiogenesis-ts`

Initial `gaps` selected:

- graph function: `Fg_conform_project`
- current edge: `Fg_conform_project`

`Fg_conform_project` run:

- archive:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T051318024Z_pid24636`
- status: `converged`
- runtime sequence:
  `graph_call_opened -> frame_opened -> vector_traversal_planned -> vector_evaluated -> vector_closed`

The first live prompt edge `derive_intent_surface` then closed after running
with an escalated worker because the local sandbox blocks direct access to
Codex session files:

- archive:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T051442847Z_pid25331`
- status: `worker_invoked`
- postflight: `passed`
- obligation assessments: `97/97`
- next edge: `derive_product_surface`

The next `derive_product_surface` run was stopped deliberately after this
bootstrap finding.

## Defect

The graph now creates `specification/requirements/`, but the content is too
thin:

```text
specification/requirements/00-imported-sources.md
```

That file lists source refs and requirement markers, but it does not preserve
requirement text, family allocation, or useful summaries as first-class
requirement authority. It is a lineage/index ledger acting as the only
requirements surface.

The conformance report is also incomplete as an evidence surface:

```text
conform_project_report.json
```

It reports `status: passed`, but its `sourceRefs` list only:

- `project_constraints.yml`
- `specification/PRODUCT.md`
- `specification/GOALS.md`
- `specification/requirements/00-imported-sources.md`

The imported ledger itself lists eleven admitted sources, including
`README.md`, `specification/INTENT.md`, `specification/REQUIREMENTS.md`,
`specification/mapper_requirements.md`, and the Frobenius appendix. The report
should expose that full admitted source set or distinguish topology refs from
input-source refs.

The downstream traversal intent package proves the pressure loss:

```text
traversal_intent_package.json
```

It contains 97 obligations, including 90 requirements, but the requirement
summaries are generic ID stubs such as:

```text
Fulfill live requirement REQ-LDM-004.
```

Evidence for those obligations points back to the single imported ledger.
That is not enough pressure for a prompt edge to evaluate the project against
the actual imported requirements.

## Root Cause

`T-087` fixed the missing topology failure, but closure stayed too shallow.
The system treats `00-imported-sources.md` as enough requirement authority when
the method requires folderized, separate requirement-family surfaces and
materially useful imported-project readback.

The first missing layer is design: `Fg_conform_project` has a conformance
profile and gap set, but no closed imported-requirement-authority carrier rich
enough to drive downstream graph computation.

## Required Correction

`Fg_conform_project` must either:

1. materialize deterministic requirement-family files under
   `specification/requirements/`, or
2. publish a typed conformance gap and block downstream traversal.

The imported requirement authority carrier must preserve:

- source ref
- source digest
- marker and normalized marker
- requirement family
- extracted requirement text or bounded summary
- ambiguity status
- evidence refs

Downstream prompt-bearing edges must consume that carrier. They must not reduce
project authority to marker IDs and a single ledger file.
