---
id: T-096
title: Prove managed traversal bootstrap from unordered or unknown source state
type: feature
ticket_category: rc_blocker
status: active
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Prove the first SDLC traversal as a managed graph-function hop from unknown, unordered, or nonconformant source state into an inducted constitutional bootstrap with authoritative requirements.
change_class: design_reframe
re_entry_point: design
affected_boundary: ManagedTraversal, Fg_ingress_project, Fg_conform_project, source-input carriers, induction manifest, induction ledger, conformance report, project constraints canonicalization, requirement authority projection, installed gaps/start routing
priority: critical
created_at: 2026-04-28
updated_at: 2026-05-02T14:07:30Z
reopened_at: 2026-05-02T14:07:30Z
prior_completed_at: 2026-04-28
owner: codex
dependencies:
  - T-087 active mandatory project induction traversal
  - T-091 active lossy obligation carrier hardening
  - ABG release cut `v3.4.0-rc.6` as traversal/runtime substrate
blocks:
  - T-041 active
  - T-102 active
  - T-109 active
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
target_truth: The first SDLC traversal is a managed graph-function traversal from unknown or unordered workspace state into an inducted spec_method project. It owns an explicit source set, work order, admitted runtime evidence, materialized constitutional surfaces, requirement authority surfaces, conformance gaps, and replayable closure projection.
superseded_truth: Bootstrap proof is satisfied by deterministic helper materialization or by a single happy-path test over already-compatible source files.
closure_law: This reopened ticket closes only when focused tests prove that unknown, unordered, legacy, missing, ambiguous, and contradictory source states all route through the managed induction traversal and either converge to an inducted project or remain on typed induction gaps without allowing downstream traversal.
---

# T-096 - Prove Managed Traversal Bootstrap From Unordered Source Set

prior_status: completed
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

The 2026-05-03 reopen narrows the current work to the first traversal only.
The test matrix must stress the induction boundary deeply enough to prove that
the framework can iterate before the REQ set is trustworthy.

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

The reopened target strengthens that proof surface:

```text
unknown workspace state
  + unordered source set
  + graph edge contract
  -> managed induction manifest/work order
  -> Fg_conform_project runtime traversal
  -> inducted project or typed induction gap
  -> replay projection that keeps downstream traversal closed until induction
     passes
```

The managed traversal must be total over input shape:

- already conformed workspace -> validate and admit induction closure
- unordered document set -> classify, digest, and materialize bootstrap
- legacy data_mapper/Python constraints -> canonicalize or gap
- missing constraints -> publish deterministic induction gap
- contradictory tenant/output-root claims -> publish deterministic induction gap
- ambiguous project identity or requirement meaning -> route to typed F_P
  assistance and admit the result before closure
- incomplete requirement extraction -> remain on induction and iterate

## Reopen Finding - 2026-05-03

The first managed traversal is not just a convenience proof. It is the
constitutional bootstrap for the whole SDLC graph.

If this traversal does not define the REQ set, the rest of the lifecycle is
unfounded. Therefore tests must not only prove a happy path. They must prove
that malformed, legacy, partial, and ambiguous source states are handled by the
traversal algebra and do not leak into downstream edges.

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

Reopened closure additionally requires a focused test matrix:

- unknown-empty workspace yields typed missing-authority induction gap
- unordered docs with enough data induct into stable INTENT, PRODUCT, and
  requirement-family surfaces
- legacy `project_constraints.yml` shape is canonicalized by induction or
  blocks as an induction gap
- contradictory active tenant/output root stays on induction
- ambiguous requirement source roles require F_P assistance and cannot close as
  deterministic truth
- lossy `00-imported-sources.md` alone is not enough to close induction
- repeated induction attempts preserve lineage and show prior-gap pressure
- `gaps` and `start --target next` always select or execute the induction edge
  until the inducted project passes conformance
- the internal checked-in data_mapper fixture is exercised through a live
  installed sandbox under `test_env/test_runs`, not through pure helper tests or
  an external environment variable
- cross-workspace induction is exercised with separate input and output roots:
  source refs and requirement authority remain rooted in the input workspace,
  while materialized topology refs, runtime events, archive files, and the
  managed traversal ledger are rooted in the output workspace
- multi-output induction is exercised with one input root and at least two
  independent output roots: each output closes through its own runtime events,
  archive, report, and ledger, and no output closes because another output has
  already converged

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

## Cross-Workspace Proof Addition - 2026-05-03

The managed traversal proof now includes the output-workspace allocation shape
needed by ABG RC6 and downstream odd_sdlc review lanes:

```text
{ input_workspace: unordered source set }
  -> Fg_conform_project[F_D]
  -> { output_workspace: inducted spec_method Project + runtime evidence }
```

The focused sandbox must compare that output workspace against a same-workspace
control run and prove the same requirement IDs are inducted while the input
workspace remains loose source authority. The closure carrier for this proof is
the output workspace `managed_traversal_ledger.json`; the source workspace is
not allowed to masquerade as the runtime truth surface for the induced result.

The same proof must also cover fan-out. A single input workspace can drive two
review streams:

```text
input_workspace -> output_workspace_a
input_workspace -> output_workspace_b
```

The test must prove that output A and output B are independently open before
their own traversal, independently closed after their own traversal, and
semantically equivalent in the induced requirement set.
