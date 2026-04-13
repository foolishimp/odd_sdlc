# STRATEGY: Consensus As Reusable Graph-Function Plugin

**Author**: codex
**Date**: 2026-04-13T14:44:30Z
**Addresses**: `SPEC_METHOD.md` incorporation of reusable consensus review; boundary between shared line capability and `odd_sdlc` host usage
**Status**: Draft

## Driving Use Case

The design pressure is concrete.

The operator posts a comment or review note and then says:

- "get consensus"

The expected runtime behavior is:

1. the comment becomes a reviewable subject
2. the system triggers one reusable consensus graph function
3. the graph function fans out review to two configured workers/reviewers
4. the reducer evaluates the returned assessments under declared policy
5. the graph recurses until consensus is reached or the policy exhausts and escalates

This is not a toy proof request.

This is a reusable operational capability:

- one host package may use it for design review
- another may use it for schema review
- another may use it for comment or strategy review

So the capability should not be modeled as an `odd_sdlc`-owned product feature.

It should be modeled as a reusable graph-function plugin that `odd_sdlc` can invoke.

## Position

Under `SPEC_METHOD.md`, this should be incorporated as a shared reusable `HOW`
capability inside the current project line, not as a new top-level project and
not as recursive constitutional subprojects by default.

The right split is:

- `specification/` defines the shared constitutional `WHAT`
- shared graph-function plugin capability is specified at the line level
- design chooses registry shape, package placement, and binding mechanism
- host packages such as `odd_sdlc` bind their own subject assets to that plugin

This fits the existing method exactly:

- one shared constitutional surface
- one or more independent realizations under `build_tenants/`
- no rival constitution inside a host package

## Why Not A New Project

A new project is overkill unless consensus review has its own independent:

- goals
- intent
- product
- release line
- adoption lifecycle

That is not the current situation.

Right now consensus is a reusable capability on the `odd_method` line whose
first serious host/use case happens to be `odd_sdlc`.

Making it a separate project too early would create:

- needless release and topology overhead
- duplicated constitutional surfaces
- confusion about whether the capability is owned by a new project or by the
  current line

## Why Not Recursive Subprojects By Default

Recursive subprojects are the wrong default because the method already gives a
cleaner mechanism:

- shared `WHAT` in `specification/`
- shared and tenant-local `HOW` in design and `build_tenants/`

If we create a nested subproject just to host a reusable graph-function
capability, we risk creating a second constitutional center inside one project.

That would cut across the method's strict split:

- `specification/` governs `WHAT`
- design and realization govern `HOW`

The consensus plugin is a `HOW` capability.

It should therefore be incorporated through design and realization, not through
a second embedded constitution unless it truly becomes an independent line.

## Method Incorporation

### 1. Line-Level Requirement

Add or extend a shared graph-function requirement family so the line explicitly
allows registry-published reusable graph-function plugins.

The existing requirement family already points the right way:

- the graph-function catalog is explicit and machine-readable
- reusable higher-order harnesses remain ordinary GTL carriers with explicit
  outer contracts

The needed repricing is to make "reusable higher-order harness" clearly include
registry-published plugins that may be consumed by host packages.

### 2. Product Definition

`PRODUCT.md` should state that the line supports reusable graph-function
plugins, and that consensus review is one such reusable capability.

`odd_sdlc` should be described as:

- a host/proving domain for the capability
- not the unique owner of the capability

### 3. Design Placement

Design should choose the concrete placement and registry shape.

The most natural placement is under shared realization law, for example a
`build_tenants/common/`-owned plugin/registry surface, because the capability is
shared across hosts rather than tenant-local to `odd_sdlc`.

That keeps the constitutional direction clean:

- shared requirement truth in `specification/`
- shared realization law in `build_tenants/common/`
- host-specific bindings in the consuming package

### 4. Host Binding

`odd_sdlc` should bind the plugin to its own domain-specific subject assets.

For the comment-review use case, that means `odd_sdlc` does not "own consensus."
It binds a review subject to the reusable plugin.

## Target Shape

The current published consensus harness is too design-specific.

Today it is hard-coded around:

- `design_surface`
- `review_assessment_surface`
- `consensus_decision_surface`
- `reviewed_design_surface`

The reusable plugin shape should instead be generic, for example:

- `subject_surface`
- `review_assessment_surface`
- `consensus_decision_surface`
- `reviewed_subject_surface`

And the public graph functions should look like:

- `review_subject_consensus_round`
- `review_subject_by_consensus`

with injected stages like:

- `review_subject_assessment_round`
- `reduce_subject_consensus_decision`
- `apply_subject_consensus_decision`

The outer contract should stay stable.

The host package then maps its own subject lane into that contract.

## Operator Flow

For the concrete use case that drove this:

1. the operator posts a strategy comment
2. the host package materializes a typed review subject for that comment
3. the operator says "get consensus"
4. route binding selects the reusable consensus plugin
5. `odd_service` fans out the review stage to two named workers
6. each worker returns a review assessment
7. the reducer derives a consensus decision
8. if still open, the harness recurses
9. if quorum is reached, the reviewed subject is applied
10. if rounds exhaust, the harness escalates according to policy

The important point is:

- the plugin owns the review/reduce/apply/termination law
- the service owns worker/session/dispatch orchestration
- the host owns subject typing and downstream use of the reviewed result

## Boundary With odd_service

This strategy does not make the plugin responsible for worker orchestration.

The plugin should remain:

- an ordinary GTL graph function
- reusable
- inspectable
- recursive where needed

`odd_service` should handle:

- named worker registry
- dispatch routing
- fan-out to multiple workers
- snapshot and transport concerns
- resumed observation of long-running consensus work

That keeps the service from becoming a special-case consensus engine while still
allowing the plugin to execute real multi-worker consensus rounds.

## Concrete Recommendation

The next repricing should say:

- consensus review is a reusable graph-function plugin capability on the
  `odd_method` line
- the capability is specified at the shared requirement/product level
- design places its registry and shared realization under `build_tenants/common/`
  or another explicitly shared realization surface
- `odd_sdlc` is the first serious host/proving consumer
- comment review is a first-class host use case for the plugin

## Decision Rule

Use the current project plus shared plugin realization unless and until all of
the following become true:

- consensus review has independent goals and product identity
- it must ship on an independent release cadence
- it must be adopted outside the current line as its own constitutional body of work

Until then:

- no new project
- no recursive subproject constitution by default
- yes to shared reusable plugin capability
- yes to host-specific binding in `odd_sdlc`

## Immediate Ticket Implication

`odd_sdlc`'s current consensus requirement should be repriced from:

- "odd_sdlc owns a reusable consensus harness"

to:

- "`odd_sdlc` exposes and proves a host binding over the reusable consensus
  plugin capability on the line"

That keeps the host proof without misplacing ownership.
