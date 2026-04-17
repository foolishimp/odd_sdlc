# T-005 Reprice Consensus As Reusable Graph-Function Plugin

- id: T-005
- title: Reprice consensus review as a shared reusable graph-function plugin with host bindings instead of odd_sdlc-owned product capability
- type: feature
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-13
- updated_at: 2026-04-17
- dependencies: T-004

## Triage

- intake: strategy / operator use case / architectural repricing
- lawful_change_class: requirement_reprice
- affected_boundary: shared graph-function capability, consensus harness ownership, host binding in odd_sdlc, and later service-boundary proving
- lawful_re_entry: odd_sdlc product and requirement surfaces, shared design/realization placement, and odd_sdlc host binding
- downstream_proof_span: shared plugin catalog proof, odd_sdlc comment-review host proof, and explicit boundary with later odd_service proving

## Why This Ticket Exists

The current consensus carrier points in the right direction but is still framed
too much as `odd_sdlc`-owned capability.

That is too narrow for the actual use case.

The driving operator flow is:

1. a comment or review note exists
2. the operator says "get consensus"
3. one reusable consensus graph function is selected
4. the review stage fans out to two configured reviewers/workers
5. the reducer evaluates returned assessments under declared policy
6. the graph recurses until consensus is reached or the policy exhausts and escalates

This is not only an `odd_sdlc` design-review feature.

It is a reusable line capability that may be used for:

- design review
- schema review
- strategy/comment review
- other typed review subjects published by future hosts

Under `SPEC_METHOD.md`, this should therefore live as shared line capability
inside the current project rather than as:

- a new top-level project by default
- a recursive constitutional subproject by default
- an `odd_sdlc`-owned special case

## Design Position

This ticket adopts the following split:

- `specification/` defines the shared constitutional `WHAT`
- shared consensus plugin capability is specified at the line level
- design chooses registry shape, package placement, and binding mechanism
- host packages such as `odd_sdlc` bind their own subject assets to that plugin

The reusable capability is a `HOW` surface, not a second constitutional center.

The intended ownership split is:

- the plugin owns review / reduce / apply / termination law
- `odd_service` owns worker, session, fan-out, and transport orchestration when
  real multi-worker proving is activated
- the host owns subject typing and downstream use of the reviewed result

## Scope Boundary

This ticket is in scope for:

- repricing shared requirement and product surfaces so consensus review is a
  reusable graph-function plugin capability on the `odd_sdlc` line
- extracting or reshaping the current consensus harness into a generic
  subject-based plugin contract
- choosing explicit shared design and realization placement for the plugin and
  future registry path
- binding `odd_sdlc` to that plugin for at least one concrete review subject,
  with comment review as the driving use case
- proving that the shared plugin is catalog-visible and host-consumable without
  pretending that `odd_sdlc` owns consensus itself

This ticket is not in scope for:

- making `odd_service` the owner of runtime truth
- full remote transport, remote snapshot verification, or odd_manager client
  completion
- treating service fan-out as a special-case consensus engine instead of shared
  graph-function law

Those service-boundary proving concerns remain linked follow-on work.

## Intended Direction

The current consensus harness should be repriced from design-specific,
tenant-owned framing toward a generic reusable plugin shape.

Target public shape:

- `review_subject_consensus_round`
- `review_subject_by_consensus`

Target stable outer contract:

- `subject_surface`
- `review_assessment_surface`
- `consensus_decision_surface`
- `reviewed_subject_surface`

Injected stage expectations:

- `review_subject_assessment_round`
- `reduce_subject_consensus_decision`
- `apply_subject_consensus_decision`

The plugin must remain:

- an ordinary GTL graph-function carrier
- inspectable in the graph-function catalog
- reusable across hosts
- recursively or compositionally lawful where the policy requires multiple rounds

`odd_sdlc` should then expose a host binding over that plugin instead of owning
the capability itself.

## Comment-Review Use Case

The first host use case that should drive the design is comment review.

The intended host path is:

1. a strategy or review comment is materialized as a typed review subject
2. `odd_sdlc` selects the reusable consensus plugin
3. the plugin executes review, reduction, and apply stages over that subject
4. a reviewed comment or reviewed strategy artifact is published
5. later service-backed fan-out may replace local reviewer realization without
   changing the plugin contract

This keeps the reusable capability generic while still proving one concrete
operator flow end to end.

## Task List

- [x] Reprice shared product and requirement surfaces so the line explicitly
  supports reusable graph-function plugins and names consensus review as one
  such capability.
- [x] Decide whether the shared law lives as an extension of
  `02-graph-functions.md` or as a new dedicated requirement family, and make the
  choice explicit rather than ambient.
- [x] Reprice `REQ-F-ODDSDLC-023` so `odd_sdlc` is a host/proving consumer of
  the reusable consensus plugin rather than the unique owner of the harness.
- [x] Choose shared design and realization placement for the plugin and future
  registry path, likely under a shared realization surface such as
  `build_tenants/common/` or another explicitly shared package root.
- [x] Generalize the current consensus asset contract from design-specific lanes
  to subject-based lanes with stable outer naming and catalog visibility.
- [x] Publish the reusable plugin with explicit stage and policy metadata so the
  caller can consume the outer contract without hidden engine folklore.
- [x] Add one concrete `odd_sdlc` host binding for comment or strategy review.
- [x] Prove that the host binding can invoke the shared plugin without making
  `odd_sdlc` the constitutional owner of consensus.
- [x] Link, but do not absorb, the later odd_service multi-worker proving lane.

## Acceptance

- shared specification surfaces explicitly state that consensus review is a
  reusable graph-function plugin capability on the `odd_sdlc` line
- the line publishes a generic consensus plugin contract over subject,
  assessment, decision, and reviewed-subject assets
- the graph-function catalog distinguishes the shared plugin from host-specific
  bindings
- `odd_sdlc` proves at least one concrete host binding over the plugin for the
  comment-review use case
- the host proof does not require treating `odd_sdlc` as the unique owner of
  consensus capability
- the service-boundary follow-on remains explicit and linked rather than being
  silently folded into this ticket

## Proof Required

- shared requirement proof:
  - the governing requirement family explicitly allows registry-published or
    otherwise shared reusable graph-function plugins
- product proof:
  - `PRODUCT.md` describes reusable graph-function plugins as line capability
    and positions `odd_sdlc` as a host/proving consumer for consensus review
- catalog proof:
  - the shared plugin appears as catalog-visible reusable capability with stable
    outer contract and inspectable stage/policy metadata
- host-binding proof:
  - `odd_sdlc` exposes one concrete comment-review or strategy-review binding
    over the plugin
- boundary proof:
  - service orchestration remains distinct from plugin law and is not required
    to understand the plugin contract
- extensibility proof:
  - the chosen shape leaves room for future graphfunction-registry selection and
    later service-backed reviewer fan-out without changing the outer plugin
    contract

## Links

- strategy: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260413T144430Z_STRATEGY_consensus-as-reusable-graph-function-plugin.md`
- related: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/B-004-track-odd-service-remote-client-and-consensus-scope-debt.md`
- requirement: `/Users/jim/src/apps/odd_sdlc/specification/requirements/02-graph-functions.md`
- requirement: `/Users/jim/src/apps/odd_sdlc/specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- adr: `/Users/jim/src/apps/odd_sdlc/build_tenants/common/design/adrs/ADR-008-consensus-plugin-host-binding-boundary.md`
