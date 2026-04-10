# odd_sdlc Software-Domain Buildout Requirements

**Family**: REQ-F-ODDSDLC-*
**Status**: Active
**Category**: Capability

This family defines the build-out of `odd_sdlc` from the first realization slice
into the generic software-domain package on the `odd_method` line.

This build-out is a transformation wave over mutable realization surfaces, not
an additive coexistence plan. Transitional mixed state may exist while the wave
is in flight, but the landing state must leave one current operative
software-domain model rather than a permanent mix of first-slice and full-SDLC
process.

### REQ-F-ODDSDLC-009 — odd_sdlc is the generic software-domain package on the odd_method line

`odd_sdlc` is built out as the generic software-domain package for ODD work on
the `odd_method` line.

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

### REQ-F-ODDSDLC-023 — odd_sdlc retains reusable higher-order review and consensus harnesses as active software-domain capability

Reusable review, reduction, and consensus harnesses remain active capability in
the current `odd_sdlc` software-domain package.

**Acceptance Criteria**:
- AC-1: the tenant publishes one explicit reusable higher-order consensus
  carrier over typed subject, assessment, decision, and reviewed-output assets
- AC-2: the harness remains an ordinary GTL graph-function publication rather
  than a hidden engine path
- AC-3: its contract, injected stage functions, and governing policy remain
  inspectable through the active design and catalog surfaces

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
