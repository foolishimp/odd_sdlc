---
id: T-165
title: Define optimising overlay for landscape-conditioned F_D specialization
type: feature
ticket_category: implementation_migration
status: active
proof_status: p1_bootstrap_prestart_contract_implemented_p2_p3_pending
goal: implement-phased-optimising-overlays-that-specialize-generic-sdlc-work-without-rival-runtime-truth
build_tenant: typescript
owner: odd_sdlc
migration_strategy: inside_out_hard_break
library_usage: extend
governing_library: build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
change_intent: >-
  Define and implement an optimising graph overlay line in phases. Phase 1
  treats bootstrap as a specialization of the base typed traversal shape:
  admitted type.unstructured workspace/source surfaces into a typed SDLC entry
  node carrying typed intent, product, optional requirements, project
  conformance, optional initial tenant surfaces, and a proportionality report.
  Before implementation begins, the ticket must expose the planned graph,
  carrier, public-start, projection, and test changes for review. Later phases
  add single-node smoke execution and broader landscape-conditioned F_D
  specialization.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-14
created_at: 2026-05-14
updated_at: 2026-06-12
governance_scope: STDO Method
source_ticket: .ai-workspace/tickets/backlog/T-162-first-class-ticket-workflow-for-governed-change.md
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/06-bootstrap-assets-and-recursive-edges.md
  - specification/requirements/07-asset-typing-and-binding.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_WORKSPACE_INGRESS_SEAMS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_MANAGED_TRAVERSAL_BOOTSTRAP.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - .ai-workspace/tickets/backlog/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/backlog/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - .ai-workspace/tickets/backlog/T-161-read-only-fd-run-analysis-linter.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/graph/overlays.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/workspace/carriers.ts
  - build_tenants/typescript/code/src/workspace/source_input.ts
  - build_tenants/typescript/code/src/workspace/project_profile.ts
  - build_tenants/typescript/code/src/workspace/bootstrap_lineage.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/test_env/tests/
excluded_boundary:
  - ABG graph-call, frame, event, continuation, projection, replay, or traversal authority
  - a product-local optimizer loop that selects next work outside admitted overlay binding truth
  - replacing generic F_P construction as the baseline SDLC execution contract
  - treating successful deterministic checks as authority to bypass missing ticket, requirement, design, edge-contract, or proof surfaces
  - creating a second graph catalog, overlay catalog, ticket database, event store, or closure authority
target_truth: odd_sdlc can publish hierarchical and composable overlays. Bootstrap/proportionality is a graph-function traversal from type.unstructured input into an admitted bootstrap traversal outcome over a typed SDLC entry node or an admitted entry non-admission carrier, not a public-start branch. An optimising overlay is a parent overlay that observes declared landscape facts, capability assets, prior ledgers, ticket/work objective, and edge assurance contracts, then admits an optimized overlay binding or deterministic edge specialization only inside a declared applicability envelope. Existing execution overlays and graph functions still perform the SDLC work.
superseded_truth: Optimization is handled by hardcoded public-start routing, ad hoc linter advice, local controller logic, or convenience F_D paths that bypass the generic F_P baseline without a declared overlay, applicability envelope, edge contract, and proof lane.
closure_law: This ticket closes only when the TypeScript design and implementation define optimising overlays as composable parent overlays over existing graph overlays and graph functions, implement the bootstrap/proportionality phase as an ABG-owned type.unstructured-to-typed SDLC entry graph-function traversal with admitted outcome/non-admission carriers, declare the F_P-to-F_D specialization lifecycle, name the candidate graph-function family and environment law, and prove that no optimizer path becomes a rival runtime, hidden controller, or undeclared closure authority.
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
  - pre-implementation review pack showing proposed files, code changes, behavior changes, and tests before implementation starts
  - typed SDLC entry node, traversal outcome, entry non-admission, and proportionality report carrier admission tests
  - public-start proof that the admitted traversal outcome selects the smallest lawful path or explicit fallback and preserves fallback truth
  - graph catalog or overlay catalog design diff showing how parent overlays compose child overlays/functions
  - deterministic tests for admissible and non-admissible optimization envelopes
  - deterministic tests proving generic F_P baseline selection when optimization is not admitted
  - replay/closure proof that optimized bindings preserve selected edge contract identity and residual pressure
non_closure_conditions:
  - P1 implementation begins before the pre-implementation review gate records the proposed code/test changes for review
  - public start directly executes `Fg_bootstrap_sdlc_entry` outside ABG-owned graph traversal or an admitted pre-start execution contract
  - optimization is implemented as public-start branching without an admitted overlay binding
  - bootstrap/proportionality is implemented as public-start route logic without an admitted type.unstructured-to-typed graph-function result
  - an F_D specialization runs when its landscape facts or applicability envelope are missing
  - deterministic transform success bypasses required F_P evidence for a generic edge whose contract has not admitted deterministic authority
  - optimized execution hides intermediate residual pressure from child execution overlays
  - optimizer diagnostics become ticket status, closure, or route authority
  - optimized overlay selection depends on chat memory, comment prose, file naming convention, or unregistered local precedent
  - optimized overlay creates a new runtime loop or event/projection truth source
---

# T-165: Optimising Overlay For Landscape-Conditioned F_D Specialization

## STDO Triage

First missing layer: design, followed by phased implementation.

T-162 exposed the parent-overlay shape for governed ticket work: a ticket can
drive targeted build-out without replacing the existing execution overlay or
the existing graph functions. That same shape generalizes to optimization.

An optimising overlay is a parent overlay that selects and configures existing
execution overlays or graph functions when the observed workspace landscape is
declared enough to make a generic F_P edge deterministic.

This is not part of T-162 closure. T-162 owns first-class ticket workflow. This
ticket now owns the follow-on design and implementation line: hierarchical
overlays that tune a generic SDLC path into an optimized deterministic path
without creating a second controller or weakening ABG runtime ownership.

## Migration Declaration

Migration strategy: `inside_out_hard_break`.

Library usage: `extend`.

Governing library:
`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md`.

Old truth path:

```text
deriveSdlcConformProjectProfileFromWorkspace
  -> frontDoorTraversalSelection
  -> optional SDLC_FRAMEWORK_SMOKE_MIN_FP_OVERLAY_REF
  -> overlay binding construction
```

That path lets public start derive route authority from local profile/capability
checks before one admitted bootstrap traversal outcome exists.

New truth path:

```text
ABG-owned Fg_bootstrap_sdlc_entry traversal
  -> SdlcBootstrapTraversalOutcome
  -> admitted TypedSdlcEntryNode or admitted SdlcBootstrapEntryNonAdmission
  -> admitted SdlcBootstrapProportionalityReport when entry is admitted
  -> SdlcOptimisingOverlay binding
  -> selected child overlay / graph function / graph vector
```

Old producer set:

- `workspace/project_profile.ts` derives the conformed project profile
- `start/public_start.ts` derives front-door traversal selection
- `graph/overlays.ts` provides the framework-smoke overlay selected by branch
  logic

New producer set:

- `workspace/source_input.ts` admits the source surface
- `workspace/carriers.ts` publishes typed traversal, entry, report, and
  non-admission carriers
- `workspace/bootstrap_lineage.ts` contributes lineage/replay identity
- `graph/catalog.ts` and `graph/module.ts` publish the bootstrap entry graph
  functions and composition
- ABG dispatch owns execution of `Fg_bootstrap_sdlc_entry`

Old consumer set:

- `start/public_start.ts`
- overlay binding construction
- query-domain selection projections
- operator archives and replay validation surfaces

New consumer set:

- `start/public_start.ts` consumes admitted bootstrap traversal outcomes
- `graph/overlays.ts` consumes entry/report refs for parent overlay binding
- `projection/query_domain.ts` exposes entry/report/outcome refs as read models
- `operator/traversal_consequence.ts` carries refs into next-action and replay
  projections
- tests consume admitted carriers, not public-start branch results

Projection, report, status, and proof surfaces:

- `SdlcBootstrapTraversalOutcome`
- `TypedSdlcEntryNode`
- `SdlcBootstrapEntryNonAdmission`
- `SdlcBootstrapProportionalityReport`
- selected overlay binding
- query-domain optimization projection
- operator-run archive refs
- replay validation refs
- deterministic admission and fallback tests

Migration closure law:

P1 closes only when public-start route authority is no longer accepted as
closure or replay evidence. Normal `next` execution must consume an admitted
bootstrap traversal outcome produced by ABG-owned graph traversal, or it must
fall back through an admitted non-admission carrier. Mixed old/new routing does
not count as closure evidence.

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [ ] old truth path is removed or explicitly demoted from authority
- [ ] mixed-state behavior is no longer accepted as closure evidence
- [ ] tests proving mixed old/new behavior are removed or repriced
- [x] recurring realization patterns are checked against existing library/commonization surfaces
- [x] ticket declares library usage and names the governing library or rationale
- [x] if the work exists in more than one build tenant, this backlog/active ticket carries only one tenant lifecycle and any sibling tenant work lives on its own suffixed ticket
- [ ] ticket wording, product wording, and proof claims are reconciled before closure

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

## Traversal Base Class Law

Every proposed change in this ticket must preserve the same base abstraction:

```text
TypedTraversal<Source, Target>
  sourceTypeRef
  targetTypeRef
  graphFunctionRef
  transformContractRef
  evaluationContractRef
  admissionContractRef
  closureContractRef
  fallbackContractRef
  replayIdentity
```

The base traversal shape applies to bootstrap, design, implementation, test,
release, and later optimized subclasses. A special case may specialize source
and target types, admission rules, proportionality policy, and selected child
graph functions. It may not bypass the base traversal obligations.

Bootstrap is a boundary-condition specialization of that base:

```text
BoundaryIngressTraversal
  extends TypedTraversal<type.unstructured, TypedSdlcEntryNode>
```

It is special because the source side is unstructured, partial, stale, or
imported. It is not special in runtime authority. It still uses graph-function
publication, typed source and target refs, F_P construction where meaning is
ambiguous, F_D admission at the boundary, ABG traversal truth, and T-164 edge
closure contracts downstream.

This ticket must not introduce a bootstrap-only interface that cannot be reused
as a typed traversal. `TypedSdlcEntryNode` and
`SdlcBootstrapProportionalityReport` are specialized target carriers under the
base traversal family.

## Phased Implementation

### Phase 1: Bootstrap Entry Traversal And Proportionality

Bootstrap is a general-purpose graph-function boundary:

```text
type.unstructured
  -> Fg_bootstrap_sdlc_entry
  -> type.typed
```

For `odd_sdlc`, the concrete target type is `TypedSdlcEntryNode`. It is the
typed node that makes a cold, partial, stale, or imported workspace lawful
enough for downstream SDLC traversal.

`Fg_bootstrap_sdlc_entry` is a composition over the existing bootstrap library
shape:

```text
Fg_ingress_project
  -> Fg_conform_project
  -> Fg_select_proportional_sdlc_entry
```

The first two functions already express the ingress/conformance split. This
ticket adds the entry-node and proportionality selection as the single point of
control consumed by public start.

The F_P boundary may interpret unstructured source material and construct the
declared typed entry surfaces. F_D admits those surfaces, admits the
proportionality report, rejects impossible or contradictory claims, and exposes
only the admitted node to public start.

Phase 1 target node:

```text
TypedSdlcEntryNode
  sourceInputSetRef
  intentSurfaceRef
  productSurfaceRef
  goalsSurfaceRef
  requirementFamilySurfaceRefs
  projectBootstrapSurfaceRef
  projectProfileRef
  initialBuildTenantSurfaceRefs
  proportionalityReportRef
  selectedNextPathRef
  fallbackPathRef
  evidenceRefs
  authorityRefs
  stableDigest
```

Phase 1 traversal outcome:

```text
SdlcBootstrapTraversalOutcome
  status: entry_admitted | entry_rejected
  entryNodeRef?
  entryNonAdmissionRef?
  sourceInputSetRef
  objectiveRef
  fallbackPathRef
  evidenceRefs
  authorityRefs
  stableDigest
```

Phase 1 entry non-admission carrier:

```text
SdlcBootstrapEntryNonAdmission
  sourceInputSetRef
  objectiveRef
  rejectedCandidateRef
  nonAdmissionReasonRefs
  fallbackPathRef
  evidenceRefs
  authorityRefs
  stableDigest
```

Phase 1 proportionality report:

```text
SdlcBootstrapProportionalityReport
  conformanceStatus
  landscapeClass
  outcomeClass
  hopClass
  selectedOverlayRef
  selectedGraphFunctionRef
  selectedGraphVectorRef
  applicabilityEnvelopeRef
  pressurePreservationMechanismRefs
  rejectedAlternativeRefs
  fallbackPathRef
  optimizationNonAdmissionReasonRefs
  evidenceRefs
  authorityRefs
```

The F_P output is not route authority by itself. The admitted
`SdlcBootstrapTraversalOutcome` is route input. Public start consumes an
admitted entry node only when the outcome status is `entry_admitted`. When the
outcome status is `entry_rejected`, public start consumes the admitted
`SdlcBootstrapEntryNonAdmission` fallback carrier instead. Public start uses
those admitted refs when constructing the overlay binding, execution contract,
next-action projection, ledgers, closure basis, archive, and replay identity.

Phase 1 acceptance:

- public start has one admitted SDLC entry-node surface for cold or uncertain
  workspaces
- public start has one admitted non-admission carrier when the entry node is
  rejected
- deterministic replay or already-admitted workspace state may skip F_P
  bootstrap/proportionality and reuse the admitted traversal outcome by ref
- the proportionality report must be admitted before it can select an optimized
  path
- entry non-admission or optimization non-admission selects the generic
  execution overlay by explicit fallback, not by hidden branch
- the selected overlay binding carries the entry node ref, proportionality
  report ref, outcome ref, and stable digest
- tests prove hello-world-class work selects the minimum lawful path and
  domain-product work does not
- tests prove stale, missing, or contradictory landscape facts fail closed to
  generic F_P baseline

### Current Bootstrap Delta

The current implementation spreads bootstrap/proportionality across project
profile derivation, public-start capability checks, and hardcoded
framework-smoke routing. Phase 1 replaces that split with these changes:

- move cold-workspace interpretation behind `Fg_bootstrap_sdlc_entry`
- keep `Fg_ingress_project` as broad source ingress and `Fg_conform_project` as
  deterministic conformance
- add `SdlcBootstrapTraversalOutcome` as the admitted union over entry
  admission and entry non-admission
- add `SdlcBootstrapEntryNonAdmission` as the admitted fallback carrier when
  entry admission rejects
- add `SdlcBootstrapProportionalityReport` as a typed field of the admitted
  entry node
- make public start consume the admitted traversal outcome instead of deriving
  landscape class locally
- carry outcome, entry-node, non-admission, and report refs through overlay
  binding, ledgers, next-action projection, archives, and replay validation

### Proposed Graph Changes

Current graph shape:

```text
operator target: next
  -> deriveSdlcConformProjectProfileFromWorkspace
  -> frontDoorTraversalSelection
  -> optional SDLC_FRAMEWORK_SMOKE_MIN_FP_OVERLAY_REF
  -> overlay binding construction
  -> selected execution overlay / graph function
  -> ABG graph traversal
```

The current shape is partially typed but not graph-owned at the bootstrap
boundary. `ConformProjectProfile` is a typed input surface, but public start
still derives landscape class and route selection directly. That is the
handoff defect: route selection is not carried by one admitted graph-function
output.

Target phase-1 graph shape:

```text
operator objective
  + UnstructuredWorkspaceSurface
  -> Fg_bootstrap_sdlc_entry
       -> Fg_ingress_project
       -> Fg_conform_project
       -> Fg_select_proportional_sdlc_entry
  -> SdlcBootstrapTraversalOutcome
       -> entry_admitted: TypedSdlcEntryNode
       -> entry_rejected: SdlcBootstrapEntryNonAdmission
  -> SdlcOptimisingOverlay or generic fallback binding
  -> selected child overlay / graph function / graph vector
  -> ABG graph traversal
```

Target phase-2 graph shape for hello-world-class work:

```text
TypedSdlcEntryNode
  + admitted SdlcBootstrapProportionalityReport
  -> SdlcOptimisingOverlay
  -> Fg_single_iterative_smoke_node
       -> F_P.transform design + build + test
       -> F_P.evaluate semantic adequacy
       -> F_D admission, gain, closure, replay
```

Catalog changes:

- add `Fg_bootstrap_sdlc_entry` as a composed graph function with source type
  `type.unstructured` and target type `TypedSdlcEntryNode`, whose admission
  publishes `SdlcBootstrapTraversalOutcome`
- add `Fg_select_proportional_sdlc_entry` as the proportionality-report
  function consumed by the entry node
- add `SdlcBootstrapEntryNonAdmission` as the fallback carrier when entry
  admission rejects before an entry node can be admitted
- keep `Fg_ingress_project` and `Fg_conform_project` as the lower bootstrap
  library functions instead of duplicating their authority
- add `SdlcOptimisingOverlay` as the parent overlay that consumes the admitted
  entry node and selects a child execution overlay or graph function
- keep `framework_smoke_min_fp` as a child execution overlay until phase 2,
  then add `Fg_single_iterative_smoke_node` for the fused smoke path
- require overlay bindings selected through `next` to carry traversal-outcome,
  entry-node or non-admission, proportionality-report refs, and stable digests

Implementation moves:

- `start/public_start.ts`: replace `frontDoorTraversalSelection` route
  authority with admitted traversal-outcome consumption
- `workspace/project_profile.ts`: keep conformance derivation as
  `Fg_conform_project` input/output support, not as route authority
- `workspace/carriers.ts`: add `TypedSdlcEntryNode`,
  `SdlcBootstrapTraversalOutcome`, `SdlcBootstrapEntryNonAdmission`, and
  `SdlcBootstrapProportionalityReport`
- `graph/catalog.ts` and `graph/module.ts`: publish the new graph functions
  and composition
- `graph/overlays.ts`: publish the parent optimising overlay and bind child
  execution overlays through admitted refs
- `projection/query_domain.ts`: expose outcome/entry/non-admission/report
  optimization state as a read model only
- tests: prove admissible entry-node selection, admitted non-admission fallback,
  stale replay rejection, and hello-world minimum-path selection

### Bootstrap Execution Ownership

Public start does not directly execute `Fg_bootstrap_sdlc_entry`.

When no replay-valid `SdlcBootstrapTraversalOutcome` exists, public start must
construct an ABG graph-call request or consume an admitted pre-start execution
contract that names:

- graph function ref: `Fg_bootstrap_sdlc_entry`
- source surface ref: `UnstructuredWorkspaceSurface`
- objective ref
- expected outcome type: `SdlcBootstrapTraversalOutcome`
- fallback contract ref
- replay identity inputs

ABG owns the bootstrap graph call, runtime events, payload ledgers, projection,
fold, continuation, correction, and replay. Public start resumes only from the
admitted bootstrap traversal outcome projection. That outcome may cite an
admitted `TypedSdlcEntryNode` or an admitted
`SdlcBootstrapEntryNonAdmission`; both are data consumed by public start, not
instructions public start produced for itself.

### Pre-Implementation Review Gate

No P1 code implementation begins until this ticket or a linked review comment
presents a reviewable change pack and the work ledger records the gate as
complete.

The review pack must include:

- exact files to be changed
- proposed exported types and function names
- graph catalog and overlay rows to add or revise
- public-start behavior before and after
- query/read-model behavior before and after
- deterministic tests to add or update
- explicit non-changes to ABG runtime, closure fold, event emission, and replay
  ownership

The first implementation pack must be split so it can be reviewed before code:

| slice | files | proposed change | review question |
| --- | --- | --- | --- |
| P1-A traversal carriers | `workspace/carriers.ts`, `workspace/source_input.ts`, `workspace/bootstrap_lineage.ts` | define `TypedTraversal<Source, Target>`-compatible entry, outcome, non-admission, and report carriers plus admission helpers | do the carriers specialize the base traversal without creating a bootstrap-only side API? |
| P1-B graph publication | `graph/catalog.ts`, `graph/module.ts`, `graph/overlays.ts` | publish `Fg_bootstrap_sdlc_entry`, `Fg_select_proportional_sdlc_entry`, and `SdlcOptimisingOverlay` as graph/overlay truth | are all new functions catalog-visible and compositional over existing traversal functions? |
| P1-C public start consumption | `start/public_start.ts` | replace local `frontDoorTraversalSelection` authority with admitted traversal-outcome consumption and explicit fallback | does public start consume graph truth instead of deriving route truth? |
| P1-D projections | `projection/query_domain.ts`, `operator/traversal_consequence.ts` | carry outcome, entry, non-admission, and report refs into read models, next-action projection, archives, and replay validation | are projections read models over admitted refs rather than route or closure authority? |
| P1-E tests | `build_tenants/typescript/test_env/tests/` | prove admitted selection, admitted non-admission fallback, stale replay rejection, and smoke/domain split | do tests prove better determinism without weakening generic traversal behavior? |

Implementation must proceed in the same order. A later slice may not begin if
an earlier slice changes the base traversal law or the review pack becomes
stale.

### Base Traversal Specialization Checklist

Before review can approve a slice, the proposed change must answer:

- what is the base `TypedTraversal<Source, Target>` contract?
- what is the source type?
- what is the target type?
- what graph function owns the constructive carrier?
- which fields are inherited from the base traversal carrier?
- which fields are bootstrap/proportionality specialization fields?
- what F_P process, if any, may construct candidate target surfaces?
- what F_D admission rule admits or rejects the target?
- what fallback path is explicit when admission fails?
- which refs prove replay identity?
- which T-164 edge assurance contract owns downstream closure?
- which code path prevents public start from becoming a hidden controller?

### Proposed Graph Functions

| graph function | phase | source | target | constructive role | admission/conformance role |
| --- | --- | --- | --- | --- | --- |
| `Fg_bootstrap_sdlc_entry` | P1 | `UnstructuredWorkspaceSurface` + objective refs | `SdlcBootstrapTraversalOutcome` over `TypedSdlcEntryNode` or `SdlcBootstrapEntryNonAdmission` | outer reusable bootstrap traversal executed by ABG | must cite source digests, accepted entry or rejection carrier, fallback refs, and stable digest |
| `Fg_ingress_project` | P1 reused | `IngressSourceSet` | typed project ingress refs, lineage, ambiguity, bootstrap gaps | broad input interpretation | preserves existing workspace ingress design and does not select traversal |
| `Fg_conform_project` | P1 reused | ingress refs + constraints + topology policy | `ConformProjectProfile` and conformance gaps | deterministic conformance | canonicalizes tenant, output root, capabilities, execution contracts, and realization mode |
| `Fg_select_proportional_sdlc_entry` | P1 new | conformance refs + objective refs + edge assurance contracts | `SdlcBootstrapProportionalityReport` | evaluates smallest lawful next path after entry admission | requires selected refs, applicability envelope, pressure-preservation refs, fallback refs, and rejected alternatives |
| `Fg_select_optimized_overlay_binding` | P1/P3 | admitted outcome/report + candidate overlays/functions | selected overlay binding | binds the optimized child path | binding must carry outcome, entry/report or non-admission refs and digests |
| `Fg_single_iterative_smoke_node` | P2 new | admitted entry node + smoke objective | smoke product candidate + proof refs | fuses design/build/test for bounded smoke work | lawful only when report proves bounded input and preserved pressure |
| `Fg_evaluate_optimized_overlay_closure` | P3 | child execution proof + optimized contract | close/residual/non-admission finding refs | evaluates optimized path closure | consumes T-164 edge assurance contracts, never creates a second closure law |

### Revised Behavior

| scenario | current behavior | revised behavior |
| --- | --- | --- |
| cold `next` on unknown workspace | public start derives profile and routes directly from local checks | public start requests ABG-owned `Fg_bootstrap_sdlc_entry` execution or reuses an admitted traversal outcome |
| replayed `next` | profile and routing may be recomputed from workspace state | replay reuse requires source/objective digest match for the admitted outcome and its entry/report or non-admission refs |
| hello-world/framework-smoke | hardcoded smoke overlay may be selected from capability booleans | phase 1 selects smoke only through admitted proportionality; phase 2 may select `Fg_single_iterative_smoke_node` |
| domain product | public start declines smoke path by local classification | proportionality report records rejected smoke alternatives and explicit generic fallback |
| missing or contradictory conformance | behavior falls through branch logic or blocks indirectly | entry-node admission rejects into `SdlcBootstrapEntryNonAdmission` with reason refs and generic fallback |
| query-domain inspection | query can expose derived selection state without one carrier root | query exposes outcome/entry/non-admission/report refs as read-model projection, not authority |
| closure | selected child overlay closes under existing edge contracts | T-164 edge assurance remains closure authority; optimization only selects/binds lawful child paths |

### Conformance Matrix

| authority | conformance requirement | ticket response |
| --- | --- | --- |
| `specification/PRODUCT.md` configured `F_P` / `F_D` split | generic `F_P` constructs, `F_D` admits/routes/projects, ABG owns runtime truth | bootstrap interpretation stays `F_P`; outcome/entry/non-admission/report admission and route binding are `F_D`; ABG keeps traversal/fold/replay |
| REQ-F-GFUNC-001 | every operative constructive step is one named graph function or lawful composition | bootstrap becomes `Fg_bootstrap_sdlc_entry`; smoke fusion becomes `Fg_single_iterative_smoke_node` |
| REQ-F-GFUNC-004 | graph-function catalog is explicit and machine-readable | catalog/module must publish new functions, types, composition, and overlay bindings |
| REQ-F-GFUNC-006 | overlays compose typed vector traversal contracts and do not own closure law | `SdlcOptimisingOverlay` selects child overlays/functions; T-164 contracts still own close/residual pressure |
| REQ-F-ASSET-001..004 | bootstrap assets and recursive bootstrap graph are explicit | entry node carries intent, product, goals, requirement-family, project bootstrap, and tenant/profile refs |
| REQ-F-ASSETMODEL-001..004 | concrete assets bind into typed asset nodes and named functions | source input, outcome, entry node, non-admission, report, and selected path refs are typed assets consumed by graph functions |
| REQ-F-ODDSDLC-074 | construction, admission, evaluation, projection, closure, and continuation stay separated | `F_P` produces candidate entry/report surfaces; `F_D` admits outcomes; public start binds admitted refs; ABG executes bootstrap and downstream traversals |
| Workspace ingress seams design | ingress and conformance are typed admission boundaries, not filesystem controllers | `Fg_ingress_project` and `Fg_conform_project` remain lower functions; public start stops deriving route truth from raw profile checks |
| T-164 edge assurance | deterministic authority must be declared by selected edge contract | optimized smoke or later deterministic paths require edge assurance contract refs and pressure-preservation proof |
| This ticket closure law | no hidden controller or undeclared route authority | route selection is legal only through admitted entry/report refs and explicit fallback refs |

### Phase 2: Single-Node Smoke Execution

For hello-world-class and similar bounded products, the minimum lawful path is
a single iterative node:

```text
single_iterative_smoke_node
  -> design + build + test in one transform F_P
  -> semantic adequacy in one eval F_P
  -> F_D admission, target-carrier validation, edge gain, closure
```

This phase reduces the current framework-smoke path from five F_P subprocesses
to three F_P boundaries for cold starts:

```text
bootstrap/proportionality F_P
transform F_P
eval F_P
```

When the bootstrap entry node and proportionality report are replay-admitted,
the same path can reduce to two F_P calls:

```text
transform F_P
eval F_P
```

### Phase 3: General Landscape-Conditioned F_D Specialization

After the bootstrap/proportionality and single-node smoke phases are proven,
the optimising overlay may admit broader F_D specializations for deterministic
subclasses of SDLC work. These specializations must satisfy the applicability
envelope in this ticket and must preserve generic F_P fallback.

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

The initial phased family is:

```text
Fg_bootstrap_sdlc_entry
  type.unstructured workspace/source input + objective refs
  -> admitted SdlcBootstrapTraversalOutcome

Fg_select_proportional_sdlc_entry
  admitted project ingress/conformance refs + objective refs + edge contracts
  -> admitted SdlcBootstrapProportionalityReport

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
  admitted bootstrap traversal outcome ref when present
  admitted SDLC entry node ref when present
  workspace observation/fingerprint refs
  candidate child overlay refs
  candidate graph-function refs
  candidate edge assurance contract refs
  capability asset refs
  relevant prior ledger/event/proof refs

environment.provides
  bootstrap traversal outcome ref
  typed SDLC entry node ref
  bootstrap entry non-admission ref when entry admission rejects
  bootstrap proportionality report ref
  optimization landscape ref
  candidate specialization refs
  admitted optimized edge contract refs
  selected optimized overlay binding ref
  non-admission reason refs

environment.carries
  ticket/work objective refs
  bootstrap traversal outcome ref and digest
  SDLC entry node ref and digest
  bootstrap entry non-admission ref and digest when present
  bootstrap proportionality report ref and digest
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

- P1 implementation does not begin until the pre-implementation review gate
  presents and approves the file-level change pack
- every bootstrap/proportionality carrier is modeled as a specialization of
  `TypedTraversal<Source, Target>` rather than as a standalone bootstrap API
- Phase 1 implements and tests `SdlcBootstrapTraversalOutcome`,
  `TypedSdlcEntryNode`, `SdlcBootstrapEntryNonAdmission`, and
  `SdlcBootstrapProportionalityReport` carriers, admission, public-start
  consumption, fallback behavior, and replay identity
- public start obtains missing bootstrap outcomes only through ABG-owned graph
  traversal or an explicitly admitted pre-start execution contract
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

This ticket now authorizes phased implementation beginning with
bootstrap entry traversal and proportionality. Each phase must keep
optimization as an admitted graph-function, overlay, traversal-outcome,
entry-node, non-admission, or report surface and must not add hidden route
authority.

Any implementation slice outside the phases declared here must open or activate
a separate ticket with affected code boundaries, tests, migration/proof
surfaces, and closure conditions.

## Work Ledger

| id | phase | task | closure proof | status |
| --- | --- | --- | --- | --- |
| P1-000 | Bootstrap entry design | Document proposed graph changes, graph functions, revised behavior, and conformance matrix. | ticket names current graph, target graph, catalog deltas, implementation moves, behavior changes, and conformance authorities | complete |
| P1-001 | Pre-implementation review gate | Present file-level implementation slices before code begins and confirm each slice specializes the base typed traversal contract. | review pack covers carriers, graph publication, public-start consumption, projections, tests, non-changes, and base traversal checklist | complete |
| P1-010 | Bootstrap entry traversal | Define `SdlcBootstrapTraversalOutcome`, `TypedSdlcEntryNode`, `SdlcBootstrapEntryNonAdmission`, `SdlcBootstrapProportionalityReport`, and admission rules. | `test_t165_optimising_overlay` admits traversal outcome, optimized overlay binding, optimized edge specialization, and rejects mixed entry/non-admission outcomes | complete |
| P1-020 | Bootstrap entry traversal | Wire public start to consume the admitted traversal outcome when selecting the initial overlay/graph function or fallback. | public-start optimization now carries `SdlcBootstrapPreStartExecutionContract`, selected outcome refs, entry/report or non-admission refs, fallback refs, and replay identity refs | complete |
| P1-030 | Bootstrap/proportionality | Prove minimum lawful path selection. | hello-world-class workspace selects the smoke minimum through the optimized bootstrap outcome | complete |
| P1-040 | Bootstrap/proportionality | Preserve generic F_P fallback by admitted non-admission. | domain-product workspace falls back to generic execution overlay through explicit non-admission reason refs and admitted pre-start contract | complete |
| P2-010 | Single-node smoke | Add optimized single iterative smoke node for design/build/test. | T-132-class live run uses bootstrap/proportionality + one transform F_P + one eval F_P | pending |
| P2-020 | Single-node smoke | Preserve deep proof at closure. | target carrier, review/eval, gain, closure, and replay artifacts remain admitted and traceable | pending |
| P3-010 | General specialization | Generalize optimizing overlay candidates beyond smoke products. | at least one deterministic specialization admits and at least one non-admissible case falls back to generic F_P | pending |

## Implementation Evidence 2026-06-11

P1 is implemented for the TypeScript tenant:

- `graph/catalog.ts` publishes `Fg_bootstrap_sdlc_entry`.
- `graph/optimising_overlay.ts` defines and admits the bootstrap outcome,
  entry node, entry non-admission, proportionality report, pre-start execution
  contract, optimized overlay binding, and optimized edge specialization.
- `start/public_start.ts` carries the bootstrap optimization bundle into the
  execution contract for both optimized smoke and generic fallback paths.
- `projection/query_domain.ts` exposes the optimising overlay as a read-only
  projection.

Validation:

```bash
npm run build:semantic
node --test test_env/tests/test_t165_optimising_overlay.test.mjs
```

Remaining scope is P2/P3 only. This ticket stays active until the single-node
smoke path and general deterministic specialization phases are either
implemented here or split into successor tickets with this ticket repriced to
P1 closure.

## Workflow Addendum 2026-06-12: ABG-Owned Zoom-In Decomposition

The data-mapper live lane exposed a depth defect in the current workflow shape:
an upstream review edge can lawfully mark feature pressure as
`downstream_deferred`, but that pressure is not yet forced into a durable child
graph. The run can therefore reach build/test command success while the
feature obligation has not decomposed into requirement-bound design, code, test,
execution, and evidence rows.

The optimizer must embed a repeatable zoom-in workflow over graph functions.
This sits above ABG as an SDLC/product overlay that selects and constructs the
next graph-function zoom-in. It does not become a runtime loop, event store,
dispatcher, closure authority, or substitute for ABG traversal truth. ABG still
owns graph calls, frames, vectors, continuations, payload ledgers, event
lineage, replay, projection mechanics, and closure fold. SDLC owns the domain
meaning of the decomposition and consolidation carriers.

The lawful motion is:

```text
req[1]
  -> req.n.dec[m]
  -> ledger.req.n.dec[m]
  -> design.consolidate.req[n]
  -> req.n.consolidate[]
  -> recurse while any child remains non-leaf
```

Meaning:

- `req[1]` is the parent requirement pressure.
- `req.n.dec[m]` is a depth-n decomposition into child obligations.
- `ledger.req.n.dec[m]` is the durable parent/child edge ledger, carrying owner
  stage, closure criteria, graph-function refs, ABG run refs, and evidence refs.
- `design.consolidate.req[n]` commits child obligations into target design,
  source, test, execution, and proof assets.
- `req.n.consolidate[]` is a derived roll-up from closed child rows. It is not
  an authored assertion and cannot close the parent while any child is open or
  untraced.

Each child decomposition row is an ABG-addressable graph-function start or
resume over existing graph functions, or over an admitted generated subgraph
overlay. The zoom-in is therefore a repeatable expansion of a graph-function
edge into ABG atomic units:

```text
graph call
  -> frame
  -> vector
  -> payload observation/admission
  -> evaluation
  -> closure or continuation
  -> provenance/event refs
```

The workflow guarantee is edge traversal, not prose obligation tracking. A
downstream-deferred row must emit a decomposition mandate. The mandate must
trace:

```text
parent obligation
  -> child obligation
  -> design target
  -> code target
  -> test case
  -> source test file
  -> execution shard
  -> admitted evidence
  -> child closure
  -> parent consolidation
```

Closure law additions:

- Parent closure is derived only from child closure evidence and ABG
  event/provenance refs.
- `downstream_deferred` is not a terminal status. It must create or reference a
  decomposition row.
- Build or test command success can close materialization proof only. It cannot
  close feature depth unless requirement-bound test rows, source test refs,
  execution shard refs, and admitted evidence are present.
- A test-execution surface with empty `testcaseIds`, `sourceTestFileRefs`, or
  `requirementIds` cannot close a feature child row.
- Consolidation must name the child rows it closes and the parent pressure it
  re-prices.

Data-mapper example:

```text
REQ-ENG-003
  -> ENG-003.dec.1.load-topology
  -> ENG-003.dec.2.spark-read
  -> ENG-003.dec.3.transform-edge
  -> ENG-003.dec.4.ledger-write
  -> ENG-003.consolidate.engine-execution
```

The 2026-06-12 data-mapper run showed why this matters. `REQ-ENG-003` carried
real engine-execution pressure, but the generated code used local file loading
and fabricated topology while the downstream test surface admitted generic
`sbt test` success without requirement-bound source tests. The future optimized
workflow must prevent that convergence path by turning the deferred engine
pressure into child rows before code/test closure can be admitted.

### Traversal Strategy Proportionality

The simple implementation would explode every current traversal into a fixed
multistage traversal. That is not the target design. Fixed explosion preserves
depth only by making every edge expensive and loses the distinction between a
small lawful edge and a large edge that needs recursive decomposition.

The consequence surface must instead admit a traversal strategy decision:

```text
SdlcTraversalStrategyDecision
  parentObligationRef
  sourceNodeRef
  targetNodeRef
  selectedStrategy:
    simple_traversal
    depth_traversal
    simple_then_depth
    depth_then_simple
    non_admit
  selectedGraphFunctionRef
  fallbackGraphFunctionRef
  depthTraversalFunctionRef?
  proportionalityBasisRefs
  edgeContractRefs
  evidencePolicyRef
  stopPolicyRef
  escalationPolicyRef
  nonAdmissionReasonRefs
```

The decision is an admitted carrier, not an imperative branch. It lets the
optimizer select the cheapest lawful path while preserving a replayable
fallback:

```text
gap / consequence pressure
  -> F_D admit traversal strategy
  -> simple traversal or depth traversal
  -> ABG executes selected graph function
  -> simple close, lawful stop, or residual pressure
  -> residual pressure may admit depth traversal
```

### Required Feature: Consequence-To-Construction Zoom Bridge

The missing implementation feature is the typed handoff from consequence
selection to ABG construction/re-entry execution.

The consequence plugin is allowed to inspect residual pressure, the current
traversal strategy envelope, the graph-function catalog, candidate families,
refinement boundaries, overlays, and prior execution evidence. It must not run
the selected child traversal itself. Its job is to admit or reject a traversal
action selection that ABG can execute through construction intent, graph-call,
graph-span re-entry, or child-frame mechanics.

The required bridge is:

```text
residual consequence pressure
  -> SdlcTraversalStrategyDecision
  -> SdlcConsequenceTraversalAction
  -> ABG construction intent admission
  -> graph function invocation / graph-span re-entry / child frame
  -> child traversal events and provenance
  -> foldback to parent consolidation
```

`SdlcConsequenceTraversalAction` must be a typed carrier, or a direct lawful
projection into the equivalent ABG construction action/intention carrier. It
must include:

```text
SdlcConsequenceTraversalAction
  consequenceRef
  strategyDecisionRef
  parentObligationRef
  actionKind:
    invoke_graph_function
    continue_graph_call
    repair_same_edge
    reenter_graph_span
    invoke_prior_vector
    invoke_later_vector
    non_admit
  selectedGraphFunctionRef
  selectedOverlayRef?
  selectedCandidateFamilyRef?
  selectedRefinementBoundaryRef?
  selectedTraversalTargetRef?
  sourceNodeRef
  targetNodeRef
  graphVectorRef?
  graphSpanRef?
  reentryTargetRef?
  inputAssetRefs
  expectedOutputAssetRefs
  requiredAuthorityRefs
  proportionalityBasisRefs
  evidencePolicyRef
  foldbackPolicyRef
  nonAdmissionReasonRefs
```

The bridge must preserve this separation:

- SDLC/product consequence selects the domain-meaningful traversal action.
- F_D admits the selected action and its authority refs.
- ABG owns execution: graph call, frame, vector cursor, graph-span re-entry,
  child traversal, events, replay, projection, and foldback.
- Parent closure reads the admitted child/foldback evidence. It does not read
  consequence prose.

This is the place where the optimizer chooses between simple and depth
traversal. The consequence plugin may pick the most appropriate graph function
for the overlay, but that selection becomes executable only after it is admitted
as a construction/re-entry action. ABG now has the executable action bridge;
this ticket owns the SDLC optimizer/data-mapper consumption of that bridge in
P2/P3.

ABG follow-through status, 2026-06-12:

- `abiogenesis` T-152 now implements the ABG substrate bridge as
  `ConsequenceTraversalAction`, carried by admitted `ConsequenceProjectionOutcome`
  and projected into existing construction action/intent carriers.
- T-152 now also implements runner consumption: `engine_runner.ts` consumes
  `ConsequenceProjectionOutcome.traversalAction`, projects it into construction
  observation/action/binding/priority/admitted-intent carriers, and invokes
  `runConstructionIntentStep(...)` so ABG applies graph-span re-entry through
  replay-visible events.
- The focused ABG regression is
  `build_tenants/abiogenesis/typescript/test_env/tests/test_t152_consequence_traversal_action_bridge.test.mjs`.
- This proves the substrate handoff: consequence selection -> admission ->
  construction action/intent -> graph re-entry execution -> replay-visible child
  provenance. It does not by itself wire the SDLC optimizer/data-mapper lane to
  consume the bridge; that remains P2/P3 SDLC work below.

`simple_then_depth` is the important operating mode for feature work. The
system may first attempt the normal edge. If the edge leaves residual feature
pressure, missing child obligations, or missing requirement-bound test evidence,
the consequence must be allowed to admit the depth traversal function between
the existing source and target graph nodes:

```text
Fg_single_typed_traversal
  -> residual feature-depth pressure
  -> Fg_decompose_depth_between_nodes
  -> child graph-function starts/resumes
  -> child closure evidence
  -> parent consolidation
```

This makes depth a proportional escalation, not the default cost of every
traversal.

The depth traversal function should be specified as a graph function over an
existing graph:

```text
Fg_decompose_depth_between_nodes(
  sourceNodeRef,
  targetNodeRef,
  parentObligationRef,
  graphCatalogDigestRef,
  edgeContractRefs,
  depthPolicyRef,
  evidencePolicyRef
) -> DepthTraversalOutcome
```

`DepthTraversalOutcome` must include:

```text
status: admitted | rejected | blocked
depthPlanRef
decompositionTraceRegisterRef
childObligationRefs
graphVectorRefs
requiredLedgerRefs
consolidationRef
nonAdmissionReasonRefs
```

The expected ABG position is that the required atomic mechanics already exist:
graph functions and vectors are addressable, graph calls can start or resume
from admitted refs, payloads/events/provenance can be carried through child
executions, and closure can fold over child execution evidence. This ticket
must not assume that the high-zoom use case is proven merely because those
lower-level mechanics exist. P2/P3 must include a proof gate that exercises the
depth traversal function live. If ABG cannot start/resume the child graph
function path, preserve child event/provenance refs, or fold child closure back
into parent consolidation, the correct outcome is an ABG/GTL gap ticket or
patch. SDLC must not compensate by adding a local recursive controller.

Acceptance additions for P2/P3:

- Introduce or ratify a `sdlc_decomposition_trace_register` equivalent for
  parent/child requirement decomposition, owner edge, graph-function refs,
  closure criteria, evidence refs, and consolidation refs.
- Introduce or ratify `SdlcTraversalStrategyDecision` so consequence can admit
  `simple_traversal`, `depth_traversal`, `simple_then_depth`,
  `depth_then_simple`, or `non_admit` by proportionality.
- Introduce or ratify `SdlcConsequenceTraversalAction`, or bind directly to the
  ABG `ConsequenceTraversalAction`/construction-intent bridge, so a consequence
  decision can become an executable ABG graph-function invocation, graph-span
  re-entry, or child-frame traversal without an SDLC-owned runtime loop.
- Introduce or ratify `Fg_decompose_depth_between_nodes` as a graph function
  over existing graph nodes, not as an SDLC-owned loop.
- Persist downstream-deferred review rows into that register instead of leaving
  them as advisory review text.
- Add a focused SDLC bridge test where `operator/traversal_consequence.ts`
  observes residual feature-depth pressure, emits or binds to the ABG
  consequence traversal action, ABG applies graph cursor/re-entry or child
  graph-function invocation, and the emitted child event/provenance refs fold
  back to parent consolidation.
- Make downstream design, build, and test edges consume the register and block
  parent closure on untraced or unclosed child rows.
- Reject feature-depth closure when requirement-bound test rows, source test
  refs, execution shard refs, or admitted evidence are absent.
- Prove with a data-mapper focused regression that `REQ-ENG-003` cannot converge
  through command-only `sbt test` evidence.
- Prove the ABG high-zoom path live: admitted strategy decision, depth traversal
  start/resume, child graph-function execution, child event/provenance capture,
  child closure fold, and parent consolidation.
- If the high-zoom path exposes missing ABG/GTL mechanics, open or patch the
  ABG/GTL gap rather than implementing a local SDLC traversal controller.

Non-goals:

- no external orchestrator above ABG
- no SDLC-owned ABG runtime loop
- no generated-sandbox product patching as proof
- no generic obligation prose masquerading as feature-depth evidence
