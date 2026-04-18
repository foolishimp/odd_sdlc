# T-013 Reprice Installed Topology Around `.genesis` Root And Tenant `workspaces/`

- id: T-013
- title: Define `.genesis` as the immutable installed root for GTL/ABG and installed ODD products, and define tenant-local `workspaces/` as the mutable instance layer
- type: feature
- status: completed
- goal: topology-and-installed-runtime-governance
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-18
- completed_at: 2026-04-18
- dependencies: B-013, T-012

## Closeout Authority

`T-013` closes as a topology reprice and authority reorganization ticket.

It does **not** claim that the current runtime/install code already implements
the new topology law.

What this ticket now owns and closes:

- repricing the authoritative `odd_sdlc` product and requirement surfaces so
  they define one source-vs-installed-vs-instance split
- repricing downstream installed topology around `.genesis/` as the immutable
  installed root
- repricing tenant-local `workspaces/` as the mutable instance layer beneath
  source realization tenants
- routing the actual filesystem/runtime migration to a follow-on implementation
  ticket

The concrete implementation move remains follow-on work:

- installed `odd_sdlc` still lives under `.odd_sdlc/` in the current runtime
  code
- that implementation migration is now owned by
  [T-015](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-015-implement-genesis-root-installed-product-topology-and-tenant-workspaces.md)

This ticket therefore supersedes the older `.odd_sdlc/`-centric topology
reading without pretending the filesystem/runtime migration is already done.

## Delivered

1. The authoritative topology reading is now:
   - `specification/` is constitutional source authority
   - `build_tenants/<tenant>/` is source realization law
   - `.genesis/` is the immutable installed root for substrate and installed
     odd products
   - `build_tenants/<tenant>/workspaces/<name>/` is the mutable instance layer
2. Installed odd products are repriced to live under `.genesis/<odd_product>`
   rather than separate dotted roots beside `.genesis/`.
3. Sandbox/dev/test are repriced as workspace flavors, not competing topology
   roots.
4. Repo-root `.genesis/` in a source repository is repriced as operational for
   that workspace only, not as a hidden development seed for downstream
   installs.
5. The authoritative `odd_sdlc` product and requirement surfaces now carry the
   new topology reading.
6. The concrete filesystem/runtime move is routed explicitly to follow-on
   implementation work instead of being left implicit.

## Specification Surfaces Updated

- [PRODUCT.md](/Users/jim/src/apps/odd_sdlc/specification/PRODUCT.md)
- [05-realization-topology.md](/Users/jim/src/apps/odd_sdlc/specification/requirements/05-realization-topology.md)
- [10-odd-sdlc-software-domain-buildout.md](/Users/jim/src/apps/odd_sdlc/specification/requirements/10-odd-sdlc-software-domain-buildout.md)
- [04-tenant-realization-topology.md](/Users/jim/src/apps/odd_sdlc/specification/scenarios/04-tenant-realization-topology.md)

## Follow-On Implementation

This ticket intentionally leaves the current implementation/code migration open.

The main code/runtime follow-on is:

- move installed `odd_sdlc` payload from `.odd_sdlc/` to `.genesis/odd_sdlc/`
- rewire runtime contracts, normalization, analysis, sandbox helpers, and
  proving lanes accordingly
- introduce/support tenant-local `workspaces/` mechanics where the runtime and
  proving lanes actually need them

That work is now owned by
[T-015](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-015-implement-genesis-root-installed-product-topology-and-tenant-workspaces.md).

## Triage

- intake: topology clarification / source-versus-installed boundary hardening / future odd-project standardization
- change_intent: define one enduring installed topology that separates immutable installed payloads from mutable instance state across GTL/ABG and future `odd_*` products
- lawful_change_class: requirement_reprice
- affected_boundary: odd_sdlc product topology, installed runtime payload placement, future odd-project install layout, tenant-local instance isolation, and the propagation path into shared method authority
- lawful_re_entry: product and requirement topology surfaces first, then design/install/runtime packaging, then method-level propagation once the pattern is proven
- downstream_proof_span: local odd_sdlc worksite topology replay plus one downstream install proving that `.genesis` and tenant `workspaces/` stay separate and lawful

## Why This Ticket Exists

Current discussion surfaced three distinct layers that must not collapse into
one filesystem story:

1. source authority
2. immutable installed runtime/product payloads
3. mutable instance state

The current state is still too muddy:

- repo-root `.genesis` has been treated at times like a development seed
- installed payloads for substrate and odd products are not yet governed by one
  simple topology law
- `.ai-workspace` collisions between multiple agents in one tenant point to a
  missing instance layer
- sandbox/dev/test instances risk being treated as ad hoc test scaffolding
  instead of as one consistent mutable workspace concept

The intended direction is now clear:

- `.genesis` is the installed immutable root
- no extra dotted names are needed beneath `.genesis`
- `build_tenants/<tenant>/` remains source realization law
- `build_tenants/<tenant>/workspaces/<name>/` is the mutable instance layer for
  dev/test/run/sandbox purposes

This should generalize across future `odd_*` products, not remain local
odd_sdlc folklore.

## Intended Direction

The governing installed shape should become:

```text
workspace/
  .genesis/
    genesis/
    gtl/
    docs/
    odd_sdlc/
    odd_domain/
    ...
  .ai-workspace/
  specification/
  build_tenants/
```

The important meaning of each layer is:

- `specification/`
  - constitutional project `WHAT`
- `build_tenants/`
  - source realization `HOW`
- `.genesis/`
  - immutable installed substrate and installed odd-product payloads
- `.ai-workspace/`
  - mutable operator/runtime state for the current instance

Within source realization, the intended instance topology becomes:

```text
build_tenants/
  <tenant>/
    code/
    design/
    test_env/
    workspaces/
      dev/
      test/
      sandbox/
      <other-named-instance>/
```

The meaning of tenant `workspaces/` is:

- derived mutable instances
- isolated `.ai-workspace`
- isolated installed `.genesis`
- optional Python/stack-local envs such as `.venv`
- build/run/test outputs and temporary runtime state

This is not a reinvention of Python environments.

It is a filesystem and authority split that allows Python tooling to continue
doing Python-env work inside an explicit instance boundary.

## Governing Rules

The intended topology law is:

1. `.genesis/` is an immutable install namespace, not a source-development
   root.
2. Contents beneath `.genesis/` use ordinary names, not nested hidden-dot
   names. Example: `.genesis/odd_sdlc`, not `.genesis/.odd_sdlc`.
3. `build_tenants/<tenant>/` is source realization law, not a mutable run
   instance.
4. `build_tenants/<tenant>/workspaces/<name>/` is the mutable instance layer.
5. Nothing under tenant `workspaces/` becomes constitutional or source
   authority.
6. Root `.genesis` in a source repo is operational for that workspace only; it
   must not be used as a hidden development seed for other workspaces.
7. Downstream or proving workspaces receive installed `.genesis` by install,
   not by copying another workspace’s runtime payload.

## Scope Boundary

This ticket is in scope for:

- repricing topology language so immutable install payloads, mutable instance
  state, and source realization are clearly separated
- defining `.genesis` as the enduring install root for substrate and installed
  odd products
- defining tenant-local `workspaces/` as the mutable instance layer
- clarifying that Python/stack-specific envs remain subordinate tools inside a
  workspace, not the topology itself
- standardizing future `odd_*` install placement beneath `.genesis/`
- defining the propagation boundary from odd_sdlc proving into shared method
  authority

This ticket is not in scope for:

- implementing all tenant `workspaces/` mechanics immediately
- replacing Python environment tooling
- collapsing build_tenant source law into installed instances
- redefining constitutional source authority into `.genesis/`

## Design Constraints

The final shape must preserve:

- one clear source-vs-installed-vs-instance split
- no silent use of repo-root `.genesis` as a development seed for other
  workspaces
- no nested dotted product names under `.genesis/`
- no accidental co-equal authority for any installed payload beneath
  `.genesis/`
- compatibility with future multiple installed odd products in one instance
- compatibility with multiple tenant-local workspaces carrying different
  installed `.genesis` versions over time

## Candidate Surface Changes

The likely repricing path includes:

- `odd_sdlc` product/requirement topology surfaces
- install/runtime design notes
- sandbox/workspace operational surfaces
- future `ODD_METHOD` / topology-method propagation if this proves to be a
  cross-project standard rather than only local odd_sdlc law

The likely concrete filesystem targets are:

- `.genesis/genesis`
- `.genesis/gtl`
- `.genesis/docs`
- `.genesis/<odd_product>`
- `build_tenants/<tenant>/workspaces/<instance>`

## Concrete Problems This Solves

This topology is meant to solve:

- confusion over whether root `.genesis` is development or operational
- collision of multiple agents in one shared `.ai-workspace`
- confusion between source tenant roots and mutable test/dev instances
- repeated ad hoc sandbox topology invention
- ambiguity about where future installed odd products belong

## Task List

- [x] Reprice odd_sdlc product and topology requirements around the new
  installed-root and tenant-workspace split.
- [x] Define the installed `.genesis` root as immutable installed payload
  topology for substrate and odd products.
- [x] Define tenant `workspaces/` as the mutable instance layer beneath source
  realization tenants.
- [x] Define the relationship between tenant workspaces and stack-local
  environment tooling such as `.venv`.
- [x] Reprice sandbox/dev/test language so they become workspace flavors, not
  competing topologies.
- [x] Decide whether any source-repo root `.genesis` usage must be renamed,
  constrained, or documented more sharply as operational-only.
- [x] Route the concrete filesystem/runtime move into a follow-on
  implementation ticket instead of leaving it implicit.
- [ ] Prove one clean odd_sdlc instance flow using the resulting topology.
- [ ] Propagate the result into shared method authority if ratified as a
  cross-project standard for future `odd_*` products.

## Acceptance

- `.genesis` is explicitly defined as the immutable install root
- installed odd products live under `.genesis/<odd_product>` without nested dot
  prefixes
- tenant `workspaces/` are explicitly defined as mutable derived instance
  layers
- build tenant roots remain source realization law, not mutable instance state
- Python environment tooling remains compatible and subordinate inside
  workspaces
- the source-vs-installed-vs-instance split is simple enough to use without
  recurring ambiguity
- future `odd_*` products can adopt the same pattern without inventing a new
  topology each time

## Notes On Sequencing

This is a context-defining topology ticket.

Its implementation follow-on now sits in `T-015`.

It should orient later implementation work such as:

- install/runtime packaging cleanup (`T-015`)
- tenant-local workspace support (`T-015`)
- eventual shared-method topology ratification

The point of this ticket is to hold the whole concept in one place so the work
can be followed through without the context drifting across multiple bug notes.

## Links

- sandbox runtime-surface correction:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-013-stop-sandbox-proof-from-overwriting-installer-owned-abg-runtime.md`
- sandbox lifecycle promotion:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-012-promote-sandbox-worksite-lifecycle-into-the-first-class-odd-sdlc-carrier.md`
- implementation follow-on:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-015-implement-genesis-root-installed-product-topology-and-tenant-workspaces.md`
- governing process method:
  `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
