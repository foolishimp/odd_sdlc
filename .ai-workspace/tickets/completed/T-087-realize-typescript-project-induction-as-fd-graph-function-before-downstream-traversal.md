---
id: T-087
title: Realize TypeScript project induction as mandatory first SDLC graph traversal
type: feature
ticket_category: rc_blocker
status: completed
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Make TypeScript project induction the mandatory first graph traversal of every SDLC run, where an unknown, loose, stale, or imported workspace is admitted and iterated into an inducted spec_method project before any downstream SDLC edge may open.
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: Fg_ingress_project, Fg_conform_project, installed gaps/start routing, workspace source-input carriers, project conformance materialization, traversal obligation context, installed operator handoff, data_mapper qualification lane
priority: critical
triaged_at: 2026-04-28T12:13:15Z
created_at: 2026-04-28T12:13:15Z
updated_at: 2026-05-04
closed_at: 2026-05-04
reopened_at: 2026-05-02T14:07:30Z
prior_completed_at: 2026-04-28T03:28:48Z
prior_completion_type: implementation
review_status: closed_scoped_first_traversal_induction_depth
dependencies:
  - T-068 completed
  - T-076 completed
  - T-085 completed
  - ABG release cut `v3.5.0-rc.1` as traversal/runtime substrate
blocks:
  - T-041 active
  - T-109 active
  - data_mapper.test66 qualification lane
related_tickets:
  - T-096 active managed traversal bootstrap proof
  - T-091 active lossy obligation carrier hardening
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: data_mapper.test51.ts abort and operator correction that context-to-structure synthesis is a primary graph-function act. The first project-induction edge is only the first instance; any later edge may also need to traverse from external context to structured document truth before dependent computation proceeds.
active_requirement_refs:
  - specification/requirements/06-bootstrap-assets-and-recursive-edges.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md#REQ-F-ODDSDLC-032
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md#Fg_conform_project
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_WORKSPACE_INGRESS_SEAMS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md
python_reference_surfaces:
  - build_tenants/python/code/odd_sdlc/normalization.py
  - build_tenants/python/code/odd_sdlc/workspace_assets.py
  - build_tenants/python/code/odd_sdlc/release/install.py
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test45/specification
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test45/.ai-workspace/runtime/odd_sdlc-workspace-normalization.json
target_truth: TypeScript starts every imported, understructured, stale, legacy, or unknown installed workspace with `{ unknown_or_loose_workspace_state } -> Fg_ingress_project -> Fg_conform_project[F_D] -> inducted spec_method Project` and admits the resulting conformant project surfaces, requirement authority, lineage, gaps, and topology proof as runtime-visible graph truth before downstream SDLC graph-program execution. This first traversal defines the initial REQ set for the SDLC; without it, no downstream lifecycle work has lawful requirement authority.
superseded_truth: Installing odd_sdlc.TS plus deriving an in-memory conformed profile is enough to begin downstream traversal over flat imported specification documents.
closure_law: this reopened ticket closes only when a fresh installed data_mapper successor and focused sandbox fixtures prove that unknown/nonconformant input state is always admitted into the induction traversal rather than rejected or manually normalized before traversal, `Fg_conform_project` either materializes a fully inducted spec_method project with authoritative requirement-family surfaces or emits typed induction gaps that keep the traversal on induction, and no downstream SDLC edge opens until induction passes with admitted REQ authority.
evaluation_criteria:
  - `{ unknown state } -> inducted state` is represented as a mandatory graph traversal, not an installer side effect, manual template edit, preflight parser rejection, or hidden prompt convention
  - the first graph-function level proves `{ random documents } -> structured documents` as product behavior rather than treating structured documents as a prerequisite
  - legacy Python/data_mapper-style `project_constraints.yml` shapes are accepted as loose source input and canonicalized or blocked by `Fg_conform_project`, not rejected before the induction traversal can run
  - the design states the general context-ingress law: any edge that needs external context must admit it as source input, synthesize or validate a structured document/asset carrier, record lineage, and expose unresolved gaps before dependent traversal can consume it
  - `gaps` on a freshly installed understructured workspace reports project induction/conformance as the current blocked/open edge, not `derive_intent_surface` or another downstream edge
  - `start --target next` runs the induction graph function and emits ABG/odd_sdlc runtime evidence for the induction traversal
  - induction creates or validates `specification/PRODUCT.md`, `specification/GOALS.md`, `specification/requirements/`, `specification/requirements/00-imported-sources.md`, `.ai-workspace/context/project_bootstrap.md`, `.ai-workspace/context/project_constraints.yml`, and `build_tenants/TENANT_REGISTRY.md`
  - induction can start from one input/source workspace and materialize into one or more distinct output/runtime workspaces so parallel review streams can compare induced results without mutating the source input or sharing runtime ledger state
  - imported source documents such as `specification/INTENT.md`, `specification/REQUIREMENTS.md`, `specification/mapper_requirements.md`, appendices, and project constraints are indexed with source refs, digests, detected roles, and requirement-id authority where present
  - the conformance report distinguishes deterministic topology gaps from probabilistic interpretation ambiguity and human-owned authority gaps
  - later traversal handoff manifests include induction lineage and requirement authority pressure from the conformed project, not only the immediate target asset
  - no downstream design, code, test, release, or deployment edge may close when induction topology is absent or conformance gaps are unresolved
  - Python test45 induction topology is used as reference behavior, but the TypeScript implementation is graph-function/F_D-owned rather than a hidden installer-normalization copy
  - induction can require same-edge iteration when requirement extraction, source-role classification, or tenant selection is incomplete; iteration evidence preserves the prior attempt and does not collapse to a global stop
proof_surface:
  - updated TypeScript induction design/module note
  - deterministic unit tests for source indexing, legacy constraint canonicalization, imported requirement summary, topology materialization, conformance gaps, and same-edge induction iteration
  - installed sandbox test proving `gaps -> Fg_conform_project -> inducted project or typed induction gap`
  - internal local-only live data_mapper induction sandbox copied from checked-in fixture into `test_env/test_runs`, with current product install, `gaps`, `start`, archive report assertions, canonical constraints, and concrete requirement-family surfaces
  - fresh data_mapper successor archive comparing test45 induction topology against TypeScript induction topology
  - test51 abort evidence retained as negative diagnostic
  - test66 readiness gate proving the first traversal converges or lawfully remains on induction before any downstream edge is attempted
non_closure_conditions:
  - installer writes conformance files as an untracked side effect with no graph-function event/projection proof
  - `deriveSdlcConformProjectProfileFromWorkspace` remains an in-memory profile without materialized spec_method topology
  - `requirements/` or `00-imported-sources.md` are optional for imported workspaces
  - downstream traversal opens while `specification/requirements/` is absent
  - imported bootstrap documents are referenced only in a prompt and not admitted as source-input lineage or requirement authority
  - generated requirements/scenarios/design are treated as substitute conformance when imported authority was never inducted
---

## Reopen Finding - 2026-05-03

The prior completion is reopened because current data_mapper readiness evidence
shows a nonconformant legacy workspace shape can be rejected before the
mandatory induction traversal has a chance to run.

That is a method defect, not a template cleanup task.

The first SDLC traversal is:

```text
{ unknown_or_loose_workspace_state }
  -> Fg_ingress_project
  -> Fg_conform_project[F_D]
  -> inducted spec_method Project
```

This traversal defines the initial REQ set. If it does not run, downstream
requirements, design, code, tests, release, and runtime-return work have no
lawful authority basis.

For this reopened tranche, do not progress beyond induction. The closure target
is a deep, repeatable test suite proving that nonconformant data is inducted,
iterated, or blocked as typed induction truth.

## Current Scope

In scope:

- loose, stale, imported, legacy, or unknown workspace state
- legacy data_mapper/Python template inputs such as older
  `project_constraints.yml` shapes
- checked-in internal data_mapper induction fixture under
  `build_tenants/typescript/test_env/fixtures/data_mapper_induction/`
- missing, partial, contradictory, or ambiguous project constraints
- source document discovery, role classification, digesting, and lineage
- requirement extraction, requirement family allocation, and REQ authority
  publication
- same-edge induction iteration when the REQ set cannot yet be made complete
- ABG RC6 replay/runtime evidence for the induction traversal

Out of scope for this tranche:

- progressing beyond induction into intent/product/design/code/test edges
- using manual pre-edits as proof
- treating data_mapper.test66 as a clean parity run before induction is proven
- replacing ABG runtime truth with an odd_sdlc-private traversal runtime
- relying on `/Users/jim/src/apps/ai_sdlc_examples` or
  `ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT` for the required regression lane

## STDO Triage

First missing layer: requirements.

The S layer requires explicit bootstrap assets and conformant downstream
spec_method topology, but the requirement must be sharpened: normalization is
not installer housekeeping. It is the level-1 synthesis function of an ODD
graph. If the product cannot traverse from random, loose, or imported documents
to structured documents, it has not met the first graph-function obligation.

The TypeScript design names `Fg_conform_project`, but the current
implementation only derives a conformed project profile and then lets
downstream traversal proceed over a flat imported workspace.

The lawful correction is not to hide Python-style normalization inside the
installer. The installer may provide substrate, package bindings, and
bootloader guidance. Project induction itself must be an explicit graph
function with deterministic admission, materialization, gap publication, and
runtime evidence.

## Required Function Shape

```text
{ random_or_loose_documents, project constraints, installed method refs }
  -> Fg_ingress_project
  -> Fg_conform_project[F_D]
  -> structured spec_method Project
  -> downstream SDLC graph program
```

`F_D` owns:

- source document discovery and role classification when role is deterministic
- source digesting and lineage publication
- synthesis from random or loose document sets into structured document
  families
- imported requirement-id extraction
- canonical `specification/requirements/` creation or validation
- `00-imported-sources.md` creation or validation
- `PRODUCT.md` and `GOALS.md` creation or validation when absent
- `project_bootstrap.md` read-model creation or validation
- `project_constraints.yml` canonicalization
- `build_tenants/TENANT_REGISTRY.md` creation or validation
- active tenant root selection under `build_tenants/<tenant>/`
- conformance gap publication

`F_P` is allowed only where deterministic rules cannot resolve project meaning:
project identity confidence, ambiguous authority role, missing source intent,
or human-owned destructive normalization risk. `F_P` output must be admitted
back into deterministic carriers before the graph advances.

## General Context-Ingress Law

Project induction is not special. It is the first visible instance of a general
graph-function rule:

```text
external_context -> structured_document_or_asset
```

This can occur at any graph edge, not only at bootstrap. Examples include:

- imported project documents to structured requirements
- operator notes to structured gap dossiers
- build logs to structured execution evidence
- test reports to structured proof evidence
- runtime observations to structured retrofit or repricing surfaces
- external API output to structured domain assets

The lawful pattern is the same:

1. admit the external context as source input
2. classify deterministic role and authority where possible
3. synthesize or validate the structured carrier
4. preserve source refs, digests, lineage, and obligations
5. publish unresolved ambiguity or gaps before dependent traversal consumes the
   result

No graph edge may hide external context only in a prompt and then treat the
derived result as governed truth.

## Cross-Workspace Induction Proof - 2026-05-03

The current induction proof includes a distinct input/output workspace mode:

```text
input workspace:  loose/imported data_mapper source documents
output workspace: installed odd_sdlc runtime and induced spec_method project
```

`odd-sdlc-ts start --workspace <input> --output-workspace <output>` must keep
source discovery, digests, and imported authority rooted in `<input>` while all
materialized topology, runtime archives, event truth, and managed traversal
ledger evidence are written under `<output>`.

This is part of the first-traversal closure bar because it proves induction is
a graph-function transformation from source context to governed project state,
not an in-place normalization side effect. It also creates the comparison lane
needed for parallel reviewable streams.

The multi-output proof extends this to:

```text
same input workspace -> output workspace A
same input workspace -> output workspace B
```

Each output workspace must carry its own event log, operator archive, conformance
report, managed traversal ledger, and induced requirement surfaces. Closing A
must not close B by event bleed or shared output state.

## Python Reference Behavior

Python proved the behavior in imperative form.

`normalization.py` creates or updates:

- `specification/PRODUCT.md`
- `specification/GOALS.md`
- `specification/requirements/`
- `specification/requirements/00-imported-sources.md`
- `.ai-workspace/context/project_bootstrap.md`
- `.ai-workspace/context/project_constraints.yml`
- `build_tenants/TENANT_REGISTRY.md`
- runtime analysis, ambiguity, requirement-closure, repair-frontier, and
  workspace-state surfaces

`data_mapper.test45` shows the expected installed topology. `data_mapper.test50`
and `data_mapper.test51.ts` do not: both lack `specification/requirements/`.
Those runs are therefore not valid RC induction evidence.

## Test51 Negative Evidence

Test51 was aborted after nine downstream edges because the defect was already
present at induction:

- no `specification/PRODUCT.md`
- no `specification/GOALS.md`
- no `specification/requirements/`
- no `specification/scenarios/`
- no `build_tenants/`

The first handoff manifest also showed zero obligations on the first edge even
though imported source documents existed. That is the wrong algebra: imported
bootstrap documents must become source-input lineage and requirement pressure
before downstream traversal.

## Design Rule

Every downstream edge has this precondition:

```text
ProjectConformance.status == passed
```

If it is not passed, the total transition function must select the induction
edge or report a conformance gap. It must not select downstream intent,
product, requirement, design, code, test, release, deployment, or runtime
edges.

## Prior Completion Evidence

Implemented in the TypeScript tenant:

- `Fg_conform_project` is now a published job target in the GTL module.
- query-domain projects `Fg_conform_project` as the only `next` start target
  when project conformance is blocked.
- public start blocks explicit downstream graph-function starts while project
  conformance is blocked.
- CLI source discovery now admits broader loose document sets instead of only
  a fixed source path list.
- deterministic induction materializes the required spec_method topology:
  `specification/PRODUCT.md`, `specification/GOALS.md`,
  `specification/requirements/`, `00-imported-sources.md`,
  `.ai-workspace/context/project_bootstrap.md`,
  `.ai-workspace/context/project_constraints.yml`, and
  `build_tenants/TENANT_REGISTRY.md`.
- induction writes a replay-visible F_D event sequence and archives
  `conform_project_report.json`.
- runtime replay filtering now keeps events scoped to the current execution
  basis so induction events do not corrupt later downstream graph projections.

Verification:

- `npm run test:t087` passed
- `npm run test:t030` passed
- `npm run test:t032` passed
- `npm run test:t033` passed
- `npm run test:t064` passed
- `npm run test:t066` passed
- `npm run test:t068` passed
- `npm run test:t069` passed
- `npm run test:t076` passed

## Proof Checkpoint - 2026-05-04

Focused first-traversal induction proof passed against ABG `v3.5.0-rc.1`:

```text
npm run test:t087
npm run test:t087-t096:data-mapper-sandbox
```

Evidence:

- `test_env/tests/test_t087_project_induction.test.mjs`
- `test_env/sandbox/test_t087_t091_t096_internal_data_mapper_induction_sandbox.test.mjs`
- `build_tenants/typescript/test_env/test_runs/t087_t091_t096_internal_data_mapper_induction/20260503T151102328Z_pid36499`
- `build_tenants/typescript/test_env/test_runs/t087_t091_t096_internal_data_mapper_induction/20260503T151105080Z_pid36499_cross_workspace`
- `build_tenants/typescript/test_env/test_runs/t087_t091_t096_internal_data_mapper_induction/20260503T151108594Z_pid36499_multiple_output_workspaces`

The proof covers:

- understructured installed workspace routes to `Fg_conform_project` before downstream traversal;
- internal legacy-shaped data_mapper fixture starts as loose source input;
- `gaps` reports induction/conformance as the current edge;
- `start` converges the induction traversal and emits graph/vector runtime evidence;
- induction materializes canonical project constraints and requirement-family surfaces;
- same input can be inducted into separate output workspaces for comparison;
- one input can fan out into multiple output workspaces without sharing runtime ledger state.

## Closure Decision - 2026-05-04

Closed for the reopened first-traversal induction depth scope.

This closure does not close the full RC envelope (`T-041`) or the traversal ledger solution (`T-109`).
