# odd_sdlc Software-Domain Buildout Requirements

**Family**: REQ-F-ODDSDLC-*
**Status**: Active
**Category**: Capability
**Carries Forward From**: `specification/requirements/08-odd-sdlc-first-slice.md`
**Authoring Design**: `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`

This family defines the build-out of `odd_sdlc` from the first realization slice
into the generic software-domain package on the `odd_sdlc` line.

This build-out is a transformation wave over mutable realization surfaces, not
an additive coexistence plan. Transitional mixed state may exist while the wave
is in flight, but the landing state must leave one current operative
software-domain model rather than a permanent mix of first-slice and full-SDLC
process.

### REQ-F-ODDSDLC-009 — odd_sdlc is the generic software-domain package on the odd_sdlc line

`odd_sdlc` is built out as the generic software-domain package for ODD work on
the `odd_sdlc` line.

**Acceptance Criteria**:
- AC-1: current product and tenant design law name `odd_sdlc` as the
  software-domain package rather than treating it only as a bootstrap toy
- AC-2: the first bootstrap-to-release proving slice remains recognized as a
  bounded proving subset rather than the whole domain definition
- AC-3: the package remains subordinate to GTL and ABG for runtime truth rather
  than becoming a product-local shadow runtime

### REQ-F-ODDSDLC-010 — odd_sdlc models the software lifecycle as an active worksite

`odd_sdlc` models software work as an active SDLC worksite rather than as a
generate-once surface tree.

**Acceptance Criteria**:
- AC-1: the live domain model includes the lifecycle acts of request, gate,
  specify, design, implement, qualify, release, deploy, observe, return,
  retrofit, and relaunch
- AC-2: release is treated as a governed transition rather than as terminal
  project completion
- AC-3: runtime-returned evidence can lawfully open further governed work on the
  same line
- AC-4: installed-dev sandbox/worksite preparation, observation, reset, and
  rerun remain first-class lifecycle acts rather than hidden proving-harness
  conventions

### REQ-F-ODDSDLC-011 — odd_sdlc expands the asset ontology across the full software lifecycle

The live `odd_sdlc` asset ontology covers the full generic software lifecycle.

**Acceptance Criteria**:
- AC-1: the live asset model includes typed families for request/gate,
  implementation, qualification, release, deployment, runtime observation, and
  retrofit work
- AC-2: those assets remain URI-addressed, typed, machine-readable, and
  inspectable through domain query surfaces
- AC-3: language- or stack-specific structure remains profile-driven rather than
  being hard-coded into the generic software-domain model

### REQ-F-ODDSDLC-012 — software work acts are governed through explicit provenance

`odd_sdlc` governs software work acts through explicit provenance and
constructive history.

**Acceptance Criteria**:
- AC-1: the live model can distinguish generated, adopted, imported, repaired,
  retrofitted, released, deployed, and returned work acts
- AC-2: mutable software assets are treated as attributable checkpoints over
  constructive history rather than as silent overwrites
- AC-3: imported or adopted software truth remains explicit rather than being
  conflated with freshly generated truth

### REQ-F-ODDSDLC-013 — odd_sdlc edges declare transform and evaluator dependencies explicitly

Every live `odd_sdlc` edge declares its traversal contract explicitly.

**Acceptance Criteria**:
- AC-1: each edge declares its source asset set and target asset
- AC-2: each edge declares its transform dependency or transform profile
- AC-3: each edge declares preflight `F_D`, configured `F_P`, postflight `F_D`,
  and any optional `Capability F_D` or `F_H` concerns
- AC-4: each edge declares its work-report, proof, and closure expectations
- AC-5: each requirement-bearing realization edge declares the cumulative
  obligation context it must traverse: required source surfaces, target asset
  type, prior-edge evidence refs, requirement/design/module authority refs,
  runtime context refs, retry gap dossiers, and current delta summary

### REQ-F-ODDSDLC-014 — generic software-domain traversal favors configured F_P under explicit work-report contract

For generic software-domain work, constructive traversal is normally supervised
by configured `F_P` under an explicit output contract.

**Acceptance Criteria**:
- AC-1: generic software-domain edges rely on configured `F_P` for constructive
  traversal where deterministic authority is not sufficient on its own
- AC-2: `F_P` is required to modify the actual governed target artifacts rather
  than only emitting descriptive assessment text
- AC-3: the output contract requires a machine-readable work report carrying at
  least target binding, operation type, evidence refs, and input/output
  identity or digest information
- AC-4: the work report carries obligation fulfillment assessments for the
  declared traversal obligation context; an artifact write without assessment
  of the declared obligations is not sufficient constructive closure
- AC-5: prompt construction favors compact current-state summaries plus stable
  references and digests for large prior surfaces, so intermediate ledgers
  distribute LLM compute while preserving the full obligation chain

### REQ-F-ODDSDLC-015 — layered F_D governs universal, specialized, postflight, and operational truth

`odd_sdlc` uses layered deterministic authority around software-domain work.

**Acceptance Criteria**:
- AC-1: `Core F_D` checks bindings, identity, provenance, report shape,
  evidence presence, and cross-surface consistency
- AC-2: `Capability F_D` can be attached for stack- or subsystem-specific
  deterministic authority without changing the regime model
- AC-3: `Postflight F_D` is required before proof can count for
  `F_P`-supervised traversal
- AC-4: `Operational F_D` validates returned runtime, release, and maintenance
  evidence where those surfaces are in scope
- AC-5: `Obligation F_D` folds declared obligations, worker fulfillment
  assessments, requirement closure registers, prior gap ledgers, and
  materialized evidence into explicit close, retry, blocked, or reprice truth
  before an edge can converge

### REQ-F-ODDSDLC-016 — runtime-returned evidence is a first-class governed domain input

`odd_sdlc` treats returned runtime and operational evidence as a first-class
input to further SDLC work.

**Acceptance Criteria**:
- AC-1: deployment, execution, or live-use evidence can bind back into the
  domain as governed assets
- AC-2: returned evidence can open repair, retrofit, or maintenance-release
  work without leaving the governed SDLC line
- AC-3: lineage and provenance remain attributable across release, runtime
  return, and relaunch

### REQ-F-ODDSDLC-017 — odd_sdlc keeps the substrate boundary minimal and domain-neutral

`odd_sdlc` uses GTL/ABG as a small declarative substrate and does not push
software-domain semantics down into the runtime by default.

**Acceptance Criteria**:
- AC-1: software-domain semantics remain declared in `odd_sdlc` asset, edge,
  design, and proving surfaces rather than in substrate-specific shadow logic
- AC-2: any substrate fixes required by `odd_sdlc` are stated in generic
  runtime or hook terms rather than software-delivery-specific artifact names
- AC-3: default substrate behavior remains overrideable through declared policy
  surfaces rather than through hidden hard-coded tenant assumptions

### REQ-F-ODDSDLC-018 — the software-domain build-out lands as one operative model without passive legacy retention

The `odd_sdlc` software-domain transformation lands as one current operative
model. First-slice-only operative code paths, placeholder assets, and legacy
process assumptions do not remain live by inertia.

**Acceptance Criteria**:
- AC-1: temporary mixed old/new realization is treated as in-flight
  transformation state rather than as the target architecture
- AC-2: when the transformation lands, first-slice-only operative paths are
  deleted or explicitly retained as named compatibility features
- AC-3: no placeholder implementation, release, archive, or process surface may
  remain an operative default once superseded by the full software-domain model
- AC-4: tests and qualification for the landed model prove current
  software-domain behavior rather than locking in stale first-slice precedent

### REQ-F-ODDSDLC-019 — inherited odd_sdlc material is explicitly classified during the transformation wave

Inherited `odd_sdlc` requirements, design choices, and realization paths are
explicitly classified during the software-domain transformation.

**Acceptance Criteria**:
- AC-1: inherited first-slice material is classified as active, deferred,
  superseded, or orphaned rather than left implicit
- AC-2: anything retained from the first slice is intentionally re-adopted into
  the new software-domain surface
- AC-3: anything not re-adopted carries no automatic authority in the landed
  software-domain model
- AC-4: the classification is visible in live requirement, design, or proving
  surfaces rather than only in implementation memory

### REQ-F-ODDSDLC-020 — odd_sdlc publishes a machine-readable software-domain query and catalog surface

The active `odd_sdlc` package publishes a machine-readable read model for the
current software-domain law and proving subset without introducing a shadow
runtime.

**Acceptance Criteria**:
- AC-1: the read model exposes the current domain asset, asset-family, work-act,
  edge-contract, binding, function, graph-function, and gap surfaces
- AC-2: runtime truth such as runs, calls, continuations, and event-derived
  projections remains ABG-native rather than being redefined by `odd_sdlc`
- AC-3: the same query surface remains suitable for direct UI composition,
  service wrapping, or MCP-style exposure without changing its core domain
  logic
- AC-4: operator-facing gap analysis may lawfully zoom over a bounded span
  between two graph points, including dependent realizing structure, without
  redefining runtime truth or forcing unconditional whole-graph solving
- AC-5: when span gap analysis aggregates dependent requirement-realization
  truth, it preserves separate carry and fulfillment judgments rather than
  collapsing them back into one blended closure signal; any combined scalar is
  derivative only

### REQ-F-ODDSDLC-021 — odd_sdlc publishes the current executive GTL carrier over its active software-domain graph

`odd_sdlc` publishes a GTL executive carrier over the active software-domain
graph rather than relying on a product-local hidden controller.

**Acceptance Criteria**:
- AC-1: the active tenant publishes one explicit executive graph function for
  the current operative software-domain proving chain
- AC-2: the published executive is the job-bound entry point for that chain and
  remains subordinate to ABG runtime truth
- AC-3: any additional executive program or read model is derived from the
  published graph-function carrier rather than acting as a rival runtime

### REQ-F-ODDSDLC-022 — odd_sdlc installs and normalizes imported workspaces into the current software-domain shape

The active `odd_sdlc` package provides deterministic install-and-normalize
behavior for imported or stale workspaces.

**Acceptance Criteria**:
- AC-1: one deterministic install path prepares a target workspace for
  `odd_sdlc` operation from the current source checkout
- AC-2: normalization preserves imported authority while bringing the workspace
  into the current software-domain governance shape
- AC-3: install-owned surfaces, project-owned surfaces, and substrate-owned
  surfaces remain explicitly separated
- AC-4: imported or adopted implementation and evidence are not rewritten into
  false generated truth

### REQ-F-ODDSDLC-023 — odd_sdlc proves reusable higher-order consensus plugins through explicit host bindings

Reusable review, reduction, and consensus harnesses remain active capability on
the `odd_sdlc` line, while the `odd_sdlc` software-domain package proves them
through explicit host bindings instead of acting as their unique owner.

**Acceptance Criteria**:
- AC-1: the line publishes one explicit reusable higher-order consensus plugin
  carrier over typed subject, assessment, decision, and reviewed-subject assets
- AC-2: `odd_sdlc` publishes host bindings over that plugin for concrete review
  subjects such as design review or comment review
- AC-3: the plugin remains an ordinary GTL graph-function publication rather
  than a hidden engine path
- AC-4: the plugin contract, injected stage functions, governing policy, and
  host-binding relationship remain inspectable through the active design and
  catalog surfaces

### REQ-F-ODDSDLC-024 — active odd_sdlc qualification proves the current software-domain model rather than first-slice habit

The active `odd_sdlc` qualification surface proves current software-domain
behavior rather than preserving first-slice precedent by inertia.

**Acceptance Criteria**:
- AC-1: proving lanes retain the bootstrap-to-release subset only as explicit
  subset proof within the larger software-domain package
- AC-2: qualification covers transformation-wave regression where placeholder or
  superseded operative paths could otherwise remain live
- AC-3: retained subset proof, install proof, and reusable harness proof all
  trace to the active software-domain requirements and design surfaces rather
  than to superseded first-slice law

### REQ-F-ODDSDLC-025 — odd_sdlc reuses workflow forms across distinct typed asset lanes

`odd_sdlc` reuses graph-function workflow forms across distinct typed asset
lanes without collapsing their asset semantics.

**Acceptance Criteria**:
- AC-1: structurally similar software-domain workflows may be published over
  distinct typed assets such as implementation design/module/code and test
  design/module/code or archive
- AC-2: reuse of workflow form does not erase the distinct asset identities,
  output contracts, or evaluator contracts of the participating lanes
- AC-3: tenant-local stack selection remains lane-specific where the
  implementation stack and the test or operational stack are materially
  different

### REQ-F-ODDSDLC-026 — executional and operational convergence is gated by declared technology capability

Edges that imply execution, deployment, runtime interaction, or other side
effects may converge only when the required technology capability is declared in
the governing build-tenant realization.

**Acceptance Criteria**:
- AC-1: executional or operational edges declare the required technology
  capability dependency explicitly, such as build tool, test runner,
  deployment contract, environment contract, or runtime-return channel
- AC-2: when the required capability dependency is absent, the edge does not
  converge and `F_P` is not allowed to invent or guess the missing capability
- AC-3: when capability is absent, traversal stops lawfully at the last
  satisfied non-execution boundary and reports an honest bounded state such as
  `construction_complete_pending_execution` or equivalent pending-capability
  status
- AC-4: deployment, runtime observation, and retrofit traversal are conditional
  on declared tenant capability and returned evidence contracts rather than
  being treated as unconditional generic closure

### REQ-F-ODDSDLC-027 — odd_sdlc publishes a governed ambiguity register across the active SDLC wave

`odd_sdlc` publishes a governed ambiguity register that records major ambiguity
in the active workspace and makes disambiguation explicit rather than implicit.

**Acceptance Criteria**:
- AC-1: deterministic normalization publishes an initial machine-readable
  ambiguity register for imported or stale workspaces
- AC-2: ambiguity entries record at least their class, affected assets, current
  status, threatened invariant or requirement refs, expected resolving boundary,
  declared risk appetite, policy action, and the current resolution or decision
  basis
- AC-3: the ambiguity register distinguishes major ambiguity from local
  implementation detail and does not collapse all micro build choices into one
  top-level governance surface
- AC-4: the ambiguity register is exposed as current domain truth through the
  active query or catalog surfaces

### REQ-F-ODDSDLC-028 — major odd_sdlc convergence is ambiguity-aware

`odd_sdlc` treats the SDLC as a disambiguation pipeline in which major
ambiguity must always be surfaced and governed explicitly at the relevant
lifecycle boundary.

**Acceptance Criteria**:
- AC-1: major SDLC gates such as imported authority, build-tenant selection,
  design, implementation structure, qualification structure, and release
  readiness may reduce, carry, or resolve major ambiguity explicitly
- AC-2: declared risk appetite governs whether an open major ambiguity is
  carried by `F_P`, escalated to `F_H`, or treated as a hard stop
- AC-3: lawful bounded stop states such as
  `construction_complete_pending_execution` remain available when ambiguity or
  missing capability prevents downstream operational closure
- AC-4: hard-stop prerequisite classes such as missing declared capability,
  absent authority, or undeclared irreversible side effects remain fail-closed
  regardless of risk appetite
- AC-5: qualification proves at least one real inherited-project use case where
  ambiguity is first recorded and later reduced or resolved without losing the
  earlier evidence, and one use case where policy causes `F_H` escalation

### REQ-F-ODDSDLC-029 — odd_sdlc carries unresolved live requirements forward across iterations

`odd_sdlc` treats full closure as an iterative outcome and therefore preserves
unresolved live requirements as active future pressure across bounded waves.

**Acceptance Criteria**:
- AC-1: `odd_sdlc` publishes a machine-readable requirement closure register for
  the active workspace
- AC-2: every live requirement is classified at least as realized, partially
  realized, planned, specified, or missing from the current generated
  requirement surface
- AC-3: unresolved live requirements remain visible and binding in later runs
  until they are explicitly realized, withdrawn, or superseded
- AC-4: wave-level completion is distinguished from full closure of the live
  requirement inventory
- AC-5: the closure register preserves a deterministic per-requirement
  obligation ledger for the current wave: which live requirements are in scope,
  which are carried forward, and which remain incomplete
- AC-6: traceability and delivery completion remain separate judgments in that
  ledger; a tagged requirement may still be incomplete
- AC-7: the active ledger publishes per-requirement carry and fulfillment
  judgments explicitly enough that downstream span or operator views can reuse
  them without re-inferring them from one blended status
- AC-8: the closure register is part of the traversal obligation context for
  downstream realization edges; unresolved live requirements remain input
  pressure to later `F_P` traversals and later `F_D` evaluators

### REQ-F-ODDSDLC-030 — generated source and test surfaces carry explicit trace authority

Generated implementation and generated tests carry explicit requirement trace
authority so the realization chain remains auditable down to the source level.

**Acceptance Criteria**:
- AC-1: generated source files carry explicit `Implements:` requirement tags
  for the requirements claimed by the current implementation branch
- AC-2: generated test files carry explicit `Validates:` requirement tags for
  the requirements claimed by the current test or authority branch
- AC-3: where one file owns materially different requirement families, the
  design may require finer-grained trace anchors below the file level
- AC-4: generated source and test files without trace authority are treated as
  orphaned realization surface rather than as governed closure

### REQ-F-ODDSDLC-031 — odd_sdlc enforces scope and traceability integrity deterministically

`odd_sdlc` uses deterministic authority checks to prevent silent scope loss and
to verify the req -> design -> module -> code or test traceability chain.

**Acceptance Criteria**:
- AC-1: the goal surface is checked against imported intent authority so live
  intent identifiers cannot silently disappear downstream
- AC-2: the generated requirement surface is checked against live requirement
  authority so carried-forward obligations do not vanish from the active wave
- AC-3: deterministic checks verify that generated code and generated tests
  satisfy the current traceability contract
- AC-4: deterministic checks identify orphan generated source or test files
  that carry no governing trace authority
<<<<<<< Updated upstream
- AC-5: gap analysis over the active requirement set does not collapse
  traceability integrity into delivery completeness; requirements that remain
  behaviorally shallow stay open even when their trace tags are present
- AC-6: any derived scalar delta published for operator convenience remains a
  projection over separate carry and fulfillment truth and is not the governing
  closure law
- AC-7: active requirement families publish explicit `Carries Forward From:`
  and `Authoring Design:` header fields instead of relying on file archaeology
  to infer upstream carry or authoring design law
- AC-8: requirement-side `Authoring Design:` publication is reciprocal with
  ratified design-surface `Implements:` and `Derives From:` publication so the
  requirement/design link is queryable in both directions
- AC-9: prior-edge evidence, intermediate ledgers, and current generated
  artifacts are evaluated as one cumulative obligation chain; no current
  artifact may close a realization edge by hiding or dropping obligations from
  earlier graph traversals
=======
>>>>>>> Stashed changes

### REQ-F-ODDSDLC-032 — odd_sdlc projects imported or unstructured workspaces into conformant downstream spec-method topology

`odd_sdlc` treats downstream installed workspaces as target projects governed by
<<<<<<< Updated upstream
the method package, not as extensions of the `odd_sdlc` source repository.
=======
the method package, not as extensions of the `odd_method` source repository.
>>>>>>> Stashed changes

Imported or understructured bootstrap input may be broad, but the first lawful
installed shape must be conformant:

- project-owned constitutional `WHAT` remains under `specification/`
- project-owned realization `HOW` lands under `build_tenants/<tenant>/`
<<<<<<< Updated upstream
- immutable installed substrate and installed odd-product payloads remain under
  `.abiogenesis/`
- released `odd_sdlc` install payload remains under
  `.abiogenesis/odd_sdlc/<build_tenant>/` rather than inside the project tenant
  topology
- mutable named instances, when used, live beneath
  `build_tenants/<tenant>/workspaces/<name>/`
=======
- immutable released `odd_sdlc` runtime/software remains under `.odd_sdlc/`
  rather than inside the project tenant topology
>>>>>>> Stashed changes

**Acceptance Criteria**:
- AC-1: downstream install and normalization project broad bootstrap input into
  `specification/` plus `build_tenants/<tenant>/` rather than into a flat
  top-level realization root such as `imp_*`
- AC-2: downstream generated design, implementation, test, and traceability
  surfaces bind to the active project tenant root rather than to
  `build_tenants/common/` or `build_tenants/odd_sdlc/` by default
<<<<<<< Updated upstream
- AC-3: released `odd_sdlc` install payload is carried under
  `.abiogenesis/odd_sdlc/<build_tenant>/` and does not masquerade as a project
  realization tenant in downstream workspaces
- AC-4: reset/replay and subsequent bounded traversals continue to operate
  against the tenant-rooted downstream workspace shape
- AC-5: mutable named downstream instances, when used, are explicit tenant
  `workspaces/` and not ad hoc competing topology roots
- AC-6: stack-local environment tools remain subordinate within a named
  workspace rather than defining the installed topology

### REQ-F-ODDSDLC-033 — imported-project feature, UAT, and design readback is materially useful on the first generated cut

For imported software projects, the first generated intermediate surfaces are
already a useful readback of the project rather than a near-generic shell.

**Acceptance Criteria**:
- AC-1: generated feature decomposition, UAT testcase, and design surfaces read
  back live imported authority rather than only generic odd_sdlc boilerplate
- AC-2: those first cuts carry forward current requirement authority explicitly
  enough that an operator can refine them without reconstructing the source
  project from scratch
- AC-3: the generated design-family surfaces name the current governed module
  boundaries and current proof/query shape when the imported workspace already
  exposes them
- AC-4: imported-project proving shows at least one installed workspace where
  the first generated feature, UAT, and design cuts are materially reviewable
  without wholesale replacement

### REQ-F-ODDSDLC-034 — released odd_sdlc can govern mutable odd_sdlc source development without boundary collapse

`odd_sdlc` may govern its own next mutable source line through an installed
worksite lane, but that self-induction does not collapse source project,
released product, installed payload, and mutable worksite identity.

**Acceptance Criteria**:
- AC-1: live product and design surfaces explicitly state that released
  odd_sdlc may govern mutable odd_sdlc source development through installed
  operator surfaces
- AC-2: installed self-induction keeps the installed payload under
  `.abiogenesis/odd_sdlc/<build_tenant>/` and keeps the mutable source
  realization under its declared `build_tenants/...` output root
- AC-3: installed query/gap or comparable operator proof over an
  odd_sdlc-like mutable source workspace attributes source code and
  requirement traceability to the source realization root rather than to the
  installed payload
- AC-4: self-induction proving preserves the same source/install/product/worksite
  split that odd_sdlc requires for downstream governed projects
=======
- AC-3: released `odd_sdlc` install payload is carried under `.odd_sdlc/` and
  does not masquerade as a project realization tenant in downstream workspaces
- AC-4: reset/replay and subsequent bounded traversals continue to operate
  against the tenant-rooted downstream workspace shape
>>>>>>> Stashed changes
