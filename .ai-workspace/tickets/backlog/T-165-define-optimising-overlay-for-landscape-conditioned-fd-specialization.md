---
id: T-165
title: Define optimising overlay for landscape-conditioned F_D specialization
type: feature
ticket_category: ordinary
status: backlog
goal: compose-parent-overlays-that-specialize-generic-sdlc-work-without-rival-runtime-truth
build_tenant: typescript
owner: odd_sdlc
change_intent: Define an optimising graph overlay that sits above existing execution overlays and graph functions, observes the declared workspace landscape, and admits deterministic F_D specializations for generic F_P edges only when the applicability envelope, edge contract, capability facts, ledgers, and proof lane make that specialization lawful.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-14
created_at: 2026-05-14
updated_at: 2026-05-14
governance_scope: STDO Method
source_ticket: .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/active/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/active/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - .ai-workspace/tickets/backlog/T-161-read-only-fd-run-analysis-linter.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/graph/overlay.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/test_env/tests/
excluded_boundary:
  - ABG graph-call, frame, event, continuation, projection, replay, or traversal authority
  - a product-local optimizer loop that selects next work outside admitted overlay binding truth
  - replacing generic F_P construction as the baseline SDLC execution contract
  - treating successful deterministic checks as authority to bypass missing ticket, requirement, design, edge-contract, or proof surfaces
  - creating a second graph catalog, overlay catalog, ticket database, event store, or closure authority
target_truth: odd_sdlc can publish hierarchical and composable overlays. An optimising overlay is a parent overlay that observes declared landscape facts, capability assets, prior ledgers, ticket/work objective, and edge assurance contracts, then admits an optimized overlay binding or deterministic edge specialization only inside a declared applicability envelope. Existing execution overlays and graph functions still perform the SDLC work.
superseded_truth: Optimization is handled by hardcoded public-start routing, ad hoc linter advice, local controller logic, or convenience F_D paths that bypass the generic F_P baseline without a declared overlay, applicability envelope, edge contract, and proof lane.
closure_law: This backlog closes only when the TypeScript design defines optimising overlays as composable parent overlays over existing graph overlays and graph functions, declares the F_P-to-F_D specialization lifecycle, names the candidate graph-function family and environment law, and proves that no optimizer path becomes a rival runtime, hidden controller, or undeclared closure authority.
evaluation_criteria:
  - overlay hierarchy distinguishes governance overlays, optimising overlays, execution overlays, and proof/read-model overlays
  - optimising overlay output is an admitted overlay binding or edge specialization contract, not an imperative route decision
  - generic F_P execution remains the lawful baseline when optimization is not admissible
  - F_D specialization requires declared landscape facts, bounded input class, deterministic transform ref, capability assets, edge assurance contract, proof lane, residual-pressure behavior, and non-admission route
  - optimized bindings carry ticket/work objective refs when invoked under T-162 ticket governance
  - optimized bindings carry selected overlay refs, selected graph-function refs, selected edge contract refs, and stable digests into handoff, ledgers, closure decisions, projections, archives, and replay
  - query-domain publishes optimization state as a read model and cannot turn optimization diagnostics into closure authority
proof_surface:
  - design module for optimising overlay carrier family
  - graph catalog or overlay catalog design diff showing how parent overlays compose child overlays/functions
  - deterministic tests for admissible and non-admissible optimization envelopes
  - deterministic tests proving generic F_P baseline selection when optimization is not admitted
  - replay/closure proof that optimized bindings preserve selected edge contract identity and residual pressure
non_closure_conditions:
  - optimization is implemented as public-start branching without an admitted overlay binding
  - an F_D specialization runs when its landscape facts or applicability envelope are missing
  - deterministic transform success bypasses required F_P evidence for a generic edge whose contract has not admitted deterministic authority
  - optimized execution hides intermediate residual pressure from child execution overlays
  - optimizer diagnostics become ticket status, closure, or route authority
  - optimized overlay selection depends on chat memory, comment prose, file naming convention, or unregistered local precedent
  - optimized overlay creates a new runtime loop or event/projection truth source
---

# T-165: Optimising Overlay For Landscape-Conditioned F_D Specialization

## STDO Triage

First missing layer: design.

T-162 exposed the parent-overlay shape for governed ticket work: a ticket can
drive targeted build-out without replacing the existing execution overlay or
the existing graph functions. That same shape generalizes to optimization.

An optimising overlay is a parent overlay that selects and configures existing
execution overlays or graph functions when the observed workspace landscape is
declared enough to make a generic F_P edge deterministic.

This is not part of T-162 closure. T-162 owns first-class ticket workflow. This
ticket records the follow-on design: hierarchical overlays that can tune a
generic SDLC path into an optimized deterministic path without creating a
second controller or weakening ABG runtime ownership.

## Design Claim

The generic SDLC execution contract remains:

```text
broad authority + open workspace state
  -> generic F_P constructive work
  -> F_D admission, evaluation, ledger, and closure support
```

The optimized contract is lawful only when the landscape has enough declared
structure:

```text
declared landscape facts
  + bounded input class
  + capability assets
  + deterministic transform law
  + edge assurance contract
  + proof lane
  -> admitted F_D specialization
```

The optimising overlay owns selection and specialization admission. It does not
own runtime truth, continuation, hidden retry, ticket closure, constitutional
application, or constructive SDLC work outside the admitted deterministic
envelope.

## Overlay Hierarchy

The intended composition is:

```text
TicketGovernedChangeOverlay
  carries ticket authority and targeted work objective

  -> SdlcOptimisingOverlay
       observes landscape and admits optimized binding when lawful

       -> ExistingExecutionOverlay
            runs the selected SDLC graph functions under ABG truth
```

The optimising overlay must also be usable without a ticket parent when a normal
operator start or scenario selects an optimization profile directly. In that
case it still carries the same environment law and still falls back to the
generic execution overlay by non-admission, not by compatibility shim.

## Candidate Graph-Function Family

The design should decide exact names, but the initial family is:

```text
Fg_observe_optimization_landscape
  workspace observation + ledgers + capability assets -> optimization landscape

Fg_classify_determinization_candidate
  landscape + edge contracts + objective -> candidate F_P-to-F_D specialization

Fg_admit_optimized_edge_contract
  candidate specialization + proof refs -> admitted optimized edge contract

Fg_select_optimized_overlay_binding
  admitted specialization + candidate child overlays -> selected overlay binding

Fg_evaluate_optimized_overlay_closure
  child execution proof + optimized contract -> close / residual pressure / non-admission
```

These functions may refine into smaller vectors during design. They must remain
published graph functions or lawful graph-function compositions, not hidden
service branches.

## Environment Law

Each optimising overlay must declare:

```text
environment.requires
  ticket/work objective refs when present
  workspace observation/fingerprint refs
  candidate child overlay refs
  candidate graph-function refs
  candidate edge assurance contract refs
  capability asset refs
  relevant prior ledger/event/proof refs

environment.provides
  optimization landscape ref
  candidate specialization refs
  admitted optimized edge contract refs
  selected optimized overlay binding ref
  non-admission reason refs

environment.carries
  ticket/work objective refs
  selected child overlay refs
  selected graph-function refs
  selected edge contract refs and digests
  residual-pressure refs
  replay validation refs
```

## Applicability Envelope

An F_D specialization is admissible only when the optimized edge contract
declares at least:

- source asset class
- target asset class
- bounded input class
- required landscape facts
- required capability assets
- deterministic transform ref
- evidence policy
- metric function
- threshold policy
- close function
- residual-pressure function
- excluded cases
- proof lane
- non-admission route back to the generic execution overlay

Successful deterministic checks are not enough. The edge contract must declare
deterministic authority for that landscape.

## Acceptance

- design module defines `SdlcOptimisingOverlay`, optimized overlay binding, and
  optimized edge specialization carriers
- graph/overlay catalog design shows how parent overlays compose child
  execution overlays and graph functions
- T-162 ticket-governance overlay can carry a ticket/work objective into the
  optimising overlay without the optimizer owning ticket status
- T-164 edge assurance contracts remain the source of close, residual pressure,
  and deterministic authority for specialized edges
- public start and query-domain can expose optimization state as admitted
  binding/projection truth without making query-domain authoritative
- non-admissible optimization routes to the generic execution overlay and
  records why optimization was not lawful
- proof includes at least one admissible deterministic specialization and one
  non-admissible case where generic F_P remains required

## Boundary

This ticket enables future graph overlays and graph functions. It does not itself
authorize an optimizer implementation that changes runtime behavior before the
design is ratified.

Any implementation slice that lands after this design must open or activate a
separate ticket with affected code boundaries, tests, migration/proof surfaces,
and closure conditions.
