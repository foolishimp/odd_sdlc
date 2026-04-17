# T-013 Reprice Installed Topology Around `.genesis` Root And Tenant `workspaces/`

- id: T-013
- title: Define `.genesis` as the immutable installed root for GTL/ABG and installed ODD products, and define tenant-local `workspaces/` as the mutable instance layer
- type: feature
- status: backlog
- goal: topology-and-installed-runtime-governance
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-17
- dependencies: B-013, T-012

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

- [ ] Reprice odd_sdlc product and topology requirements around the new
  installed-root and tenant-workspace split.
- [ ] Define the installed `.genesis` root as immutable installed payload
  topology for substrate and odd products.
- [ ] Define tenant `workspaces/` as the mutable instance layer beneath source
  realization tenants.
- [ ] Define the relationship between tenant workspaces and stack-local
  environment tooling such as `.venv`.
- [ ] Reprice sandbox/dev/test language so they become workspace flavors, not
  competing topologies.
- [ ] Decide whether any source-repo root `.genesis` usage must be renamed,
  constrained, or documented more sharply as operational-only.
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

It should orient later implementation work such as:

- sandbox/worksite promotion into the carrier (`T-012`)
- install/runtime packaging cleanup
- tenant-local workspace support
- eventual shared-method topology ratification

The point of this ticket is to hold the whole concept in one place so the work
can be followed through without the context drifting across multiple bug notes.

## Links

- sandbox runtime-surface correction:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-013-stop-sandbox-proof-from-overwriting-installer-owned-abg-runtime.md`
- sandbox lifecycle promotion:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-012-promote-sandbox-worksite-lifecycle-into-the-first-class-odd-sdlc-carrier.md`
- governing process method:
  `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
