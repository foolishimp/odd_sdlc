# ADR-007 - Declarative Operational Command, Result, And State Boundary

**Status**: Active
**Date**: 2026-04-16
**Implements**: REQ-F-ODDSDLC-038, REQ-F-ODDSDLC-039

## Context

The current `odd_sdlc` software-domain model already treats deployment and
runtime return as governed lifecycle phases.

That is directionally correct, but it is still too easy to collapse:

- requested operational intent
- admitted returned result/evidence
- current projected operational state

into one vague operational surface.

That ambiguity is tolerable for early capability gating, but it is too weak for
the intended architectural promise:

- ABG-owned event truth
- ODD domain projections
- event-sourced progression
- CQRS-style current read models
- saga-shaped operational work with explicit reopen/retry/failure handling

If `odd_sdlc` keeps operational work as one blended lifecycle document, then:

- requested deployment can be mistaken for observed deployment
- intended test execution can be mistaken for returned evidence
- runtime-return projections can be mistaken for the runtime authority itself
- operator recovery semantics remain folklore instead of declared law

## Decision

`odd_sdlc` adopts an explicit operational-transition boundary:

- ABG remains the sole event, continuation, and correlation substrate
- `odd_sdlc` owns the software-domain meaning of operational transitions
- every operational lane distinguishes:
  - command-side transition intent
  - admitted result/evidence
  - current projected state

The canonical model is:

```text
command surface -> dispatch/progress on ABG truth -> admitted result surface -> current projected state
```

This is an event-sourced and CQRS-friendly compromise:

- ABG event truth is authoritative
- current domain-facing state remains a projection
- command-side and result-side surfaces are not conflated

## Operational Surface Model

For operational lanes such as build, test execution, deployment, and runtime
return, `odd_sdlc` should publish surfaces in three roles.

### 1. Command-Side Transition Surface

This surface declares:

- current bounded input state
- target bounded state
- required capability/substrate contract
- expected returned evidence contract

Examples:

- `build_execution_surface`
- `test_execution_surface`
- `deployment_surface` as the transition request for release-to-deploy

Command-side surfaces ask for side effects. They do not prove that those side
effects happened.

### 2. Admitted Result/Evidence Surface

This surface records the governed returned result of the operational transition.

Examples:

- `build_execution_result_surface`
- `test_execution_result_surface`
- `deployment_result_surface`
- `runtime_observation_surface` when it is acting as admitted returned evidence

Admitted result/evidence surfaces are the lawful bridge back into the governed
SDLC line.

### 3. Current Projected State Surface

This is the query/read-model layer projected from admitted result/evidence and
ABG runtime fact truth.

Examples:

- `deployed_environment_surface`
- current operational status summaries exposed through domain query surfaces

Projected state is operator-facing and useful, but it is not the underlying
runtime authority.

## Saga Progression

Operational transitions advance as bounded saga progress over ABG truth.

The first required progress states are conceptually:

- prepared
- dispatched
- result_admitted
- failed
- deferred
- reopened

Additional bounded states such as retrying, rollback/compensation, or
pending_external_completion are allowed where the product requires them.

What matters is that:

- operational progress is explicit
- failure does not silently collapse into success
- external incompleteness does not masquerade as closure

## Consequences

This boundary gives `odd_sdlc`:

- a stronger fit with event sourcing
- CQRS-style read models without a second runtime
- clearer operational saga semantics
- explicit recovery/reopen behavior
- substrate-agnostic builder behavior over declared contracts

It also constrains future implementation:

- no ambient shell command becomes constitutional truth by itself
- no deployment request may be treated as a deployment result
- no current operational state may be projected from intended command state
  alone
- returned evidence must be admitted explicitly before it can close the lane

## Transitional Note

The current `deployment_surface -> runtime_observation_surface ->
retrofit_plan_surface` lane is an early operational projection, not yet the
full command/result/state model.

`T-006` is the wave that should reprice that lane into the stronger
command/result/state boundary rather than abandoning it.
