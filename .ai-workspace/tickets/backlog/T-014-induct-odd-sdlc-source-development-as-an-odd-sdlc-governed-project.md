# T-014 Induct odd_sdlc Source Development As An odd_sdlc-Governed Project

- id: T-014
- title: Establish a lawful self-induction lane where released odd_sdlc governs mutable odd_sdlc source development without boundary collapse
- type: feature
- status: backlog
- goal: self-governance-and-self-hosting
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-17
- dependencies: T-012, T-013, T-015
- change_intent: Promote odd_sdlc source development from a partly special-cased source workspace into a conformant odd_sdlc-governed development project using released/installed odd_sdlc products over explicit worksite topology.
- change_class: product_reprice
- re_entry_point: product
- triaged_at: 2026-04-17
- intake_source: self-hosting/topology review after sandbox runtime-surface correction and worksite-topology discussion
- affected_boundary: odd_sdlc product definition, self-hosting boundary, installed-worksite governance, source-vs-installed split, future proving scenarios for released odd_sdlc governing mutable odd_sdlc, and eventual propagation into the shared constitutional chain defined by `SPEC_METHOD.md` and `ODD_METHOD.md`

## Context

`odd_domain` already demonstrates the intended downstream pattern:

- a released installed `odd_sdlc` product governs a mutable `odd_domain` source
  project
- the boundary between released product, installed payload, and mutable source
  project remains explicit

`odd_sdlc` should eventually hold itself to the same standard.

The target is **not**:

- collapsing the mutable odd_sdlc source workspace into the released odd_sdlc
  product
- treating repo-root `.genesis` as source-development authority
- pretending the current source tree is already a lawful installed self-hosted
  worksite

The target **is**:

- a released odd_sdlc product governing mutable odd_sdlc source development
  through an installed worksite lane
- the same source/install/product/worksite distinctions that odd_sdlc expects
  from downstream odd projects
- explicit topology for immutable installed payloads and mutable tenant
  workspaces

This ticket is governed by the shared constitutional chain:

- `SPEC_METHOD.md`
- `ODD_METHOD.md`

It is not intended to define a rival odd_sdlc-local constitutional doctrine.

This is the odd_sdlc self-induction analogue of what has already been proven
for `odd_domain`.

## Why This Ticket Exists

Today `odd_sdlc` has a real constitutional chain as a source project:

- `GOALS.md`
- `INTENT.md`
- `PRODUCT.md`
- `specification/requirements/`
- scenarios and testcase authority

So the missing step is **not** “create a constitutional chain from scratch.”

The missing step is to make odd_sdlc development itself conform to odd_sdlc’s
own project/worksite law:

- released product governs mutable source development
- install payload and source authority remain distinct
- development instances are explicit worksites rather than ad hoc local state
- proving lanes use installed odd_sdlc product behavior, not ambient source
  shortcuts

That makes this a self-governance/self-hosting induction problem, not a blank
bootstrap problem.

## Intended Direction

The eventual governing pattern should be:

```text
released odd_sdlc product
  -> installs immutable payloads under .genesis/
  -> governs one mutable odd_sdlc tenant workspace/worksite
  -> odd_sdlc source project remains the mutable project under governance
```

The required boundary must stay explicit:

- mutable odd_sdlc source project
- released odd_sdlc product
- installed odd_sdlc payload
- mutable odd_sdlc development worksite instance

The correct mental model is the same one already used for downstream products:

- released odd_sdlc governs development of the next odd_sdlc line
- but released/install/source/instance do not collapse into one filesystem
  identity

## Scope Boundary

This ticket is in scope for:

- defining the product-level self-induction boundary for odd_sdlc
- adding scenarios/UAT/testcase authority proving that released odd_sdlc can
  govern mutable odd_sdlc source development without boundary collapse
- binding the self-induction lane to the worksite topology introduced by the
  `.genesis` and tenant `workspaces/` repricing
- proving that odd_sdlc development can run through odd_sdlc-governed install,
  analysis, and proving surfaces rather than ambient source shortcuts
- documenting the explicit source/install/product/worksite distinction for
  self-hosting odd_sdlc
- identifying any local pattern that must be repriced upward into
  `ODD_METHOD.md` once proven and ratified as shared ODD law

This ticket is not in scope for:

- claiming that the current source tree is already a released odd_sdlc product
- collapsing repo-root `.genesis` into source-development authority
- deleting source-level tests or source-level development lanes
- forcing immediate full self-host replacement of all existing developer flows

## Design Constraints

The implementation must preserve:

- source authority remains in `specification/` and `build_tenants/`
- installed payloads remain under `.genesis/`
- mutable worksite/operator state remains outside installed immutable payloads
- released odd_sdlc product may govern mutable odd_sdlc without becoming the
  mutable source project itself
- self-induction must use the same law odd_sdlc applies to downstream odd
  projects
- shared constitutional law remains in `SPEC_METHOD.md` and `ODD_METHOD.md`,
  not in ticket-local invention

## Relationship To Existing Tickets

- `T-012` promotes sandbox/worksite lifecycle into the first-class carrier.
- `T-013` reprices `.genesis` and tenant `workspaces/` topology.
- `T-015` implements that repriced install/workspace topology in code.

This ticket depends on those because self-induction needs:

- a lawful mutable worksite layer
- a lawful immutable install layer
- first-class sandbox/worksite behavior
- an implemented install/workspace topology rather than reprice-only authority

Only then can odd_sdlc govern odd_sdlc development in the same way it governs
downstream odd projects.

## Candidate Proof Shape

The likely first proving scenarios should look like:

1. A released installed odd_sdlc product is stamped into a mutable odd_sdlc
   development worksite.
2. The worksite retains explicit boundaries between:
   - released odd_sdlc product
   - installed odd_sdlc payload
   - mutable odd_sdlc source project
   - mutable odd_sdlc worksite state
3. Installed odd_sdlc analysis/gaps/start/proving surfaces operate over that
   mutable worksite.
4. The worksite produces governed development/proof outputs without treating
   source shortcuts as constitutional truth.

This should mirror the odd_domain dogfood proof shape, but applied to
odd_sdlc’s own source-development line.

## Task List

- [ ] Reprice product language so odd_sdlc self-induction is named explicitly
  as a target behavior rather than only an implied future.
- [ ] Add scenarios/UAT/testcase authority for released odd_sdlc governing
  mutable odd_sdlc source development without boundary collapse.
- [ ] Bind the self-induction lane to tenant workspaces and `.genesis` install
  topology.
- [ ] Define which odd_sdlc operator surfaces are authoritative for self-hosted
  development worksites.
- [ ] Prove one concrete self-induction worksite flow using installed odd_sdlc
  over mutable odd_sdlc.
- [ ] Document the resulting source/install/product/worksite split so future
  odd projects inherit the same law.

## Acceptance

- odd_sdlc self-induction is described as a real product behavior, not only as
  commentary
- released odd_sdlc can govern mutable odd_sdlc source development through an
  installed worksite lane
- the source/install/product/worksite boundary remains explicit
- odd_sdlc applies to itself the same governance law it applies to downstream
  odd projects like odd_domain
- self-hosting no longer depends on hidden ambient shortcuts that collapse
  source and installed runtime truth

## Notes On Priority

This is valuable, but it is not a “do immediately before anything else” ticket.

It becomes worth pulling once:

- sandbox/worksite lifecycle is first-class (`T-012`)
- install/root/workspace topology is repriced (`T-013`)
- install/root/workspace topology is implemented (`T-015`)

At that point it becomes the clean next step in making odd_sdlc development
itself conform to odd_sdlc project law.

## Links

- downstream analogue:
  `/Users/jim/src/apps/odd_domain/specification/scenarios/40-generated-scenarios.md`
- shared constitutional chain:
  `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- shared ODD constitutional method:
  `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- topology context:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-013-reprice-installed-topology-around-genesis-root-and-tenant-workspaces.md`
- sandbox/worksite promotion:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-012-promote-sandbox-worksite-lifecycle-into-the-first-class-odd-sdlc-carrier.md`
