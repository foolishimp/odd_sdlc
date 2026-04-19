# T-016 Reprice odd_sdlc Graph Advancement Around `start(scope, target, until)`

- id: T-016
- title: Reprice odd_sdlc graph-advancement operator semantics around `start(scope, target, until)` while keeping `gaps` as observation truth
- type: feature
- status: backlog
- goal: odd-sdlc-operator-contract
- change_intent: Make `odd_sdlc` consume the emerging ABG run-request contract as domain operator truth: `gaps` observes current graph/worksite state, and `start` advances the governed graph from a declared scope toward a declared target until a declared stopping condition. Domain-specific operational commands remain separate typed transition surfaces rather than rival traversal verbs.
- change_class: product_reprice
- re_entry_point: product_definition
- priority: high
- intake_source: operator UX carry-over from ABG start-intent discussion 2026-04-19
- dependencies: abiogenesis B-021, abiogenesis B-022
- affected_boundary: odd_sdlc installed operator contract, local CLI/readme surfaces, installed worksite guidance, `odd_service` client expectations, product/operator documentation
- triaged_at: 2026-04-19
- created_at: 2026-04-19
- updated_at: 2026-04-19

## Context

`odd_sdlc` already distinguishes:

- graph/worksite observation and convergence surfaces
- constructive graph advancement
- typed operational transition commands such as sandbox preparation,
  observation, and reset

The ABG substrate is moving toward one human run-request contract:

- `scope`
- `target`
- `until`

That should carry into `odd_sdlc`, but in domain terms.

The important domain constraint is that `odd_sdlc` still has other legitimate
typed commands. `prepare-sandbox`, `observe-sandbox`, `reset-sandbox`, and
later operational transition commands are not graph-advancement synonyms.
They are separate domain command/result/state surfaces under
`REQ-F-ODDSDLC-038`.

So the domain carry-over is narrower and cleaner than “only two commands exist.”

## Problem Statement

`odd_sdlc` does not yet publish one clear operator contract for graph
advancement over the software-domain package.

Without that product truth:

- local operator guidance risks inheriting raw substrate command structure
- graph-advancement semantics may remain split across historical verbs or
  install-time precedent
- domain-specific operational commands can be confused with graph traversal
  commands rather than remaining typed operational surfaces

## Required Direction

For graph/worksite advancement, `odd_sdlc` should publish:

- `gaps`
  - observe current graph/worksite truth
- `start(scope, target, until)`
  - advance the governed graph from a declared scope toward a declared target
    until a declared stopping condition

The target and stop-condition vocabulary should be inherited from the ABG
contract, but interpreted through the `odd_sdlc` domain package rather than as
raw substrate lore.

This ticket is only about graph/worksite advancement.

It does **not** collapse typed operational commands such as sandbox/build/test/
deployment preparation, observation, or reset into `start`.
Those remain distinct domain surfaces with their own command-side,
result-side, and current-state truth.

## Domain Reading

In `odd_sdlc`, the graph-advancement operator contract should therefore become:

- `gaps`
  - inspect the current bounded graph/worksite state
- `start`
  - enter the current governed graph at the declared scope and target
  - advance until the declared stopping condition is reached

That allows the domain to feel higher-order and asset-centered without
inventing a rival runtime or command algebra.

## Acceptance

- `odd_sdlc` product/operator surfaces describe graph advancement in terms of
  `gaps` and `start(scope, target, until)`
- the domain does not present substrate-local command overlap as product truth
- typed operational commands remain explicitly separate from graph advancement
  rather than collapsing into traversal synonyms
- installed operator guidance for `odd_sdlc` speaks in domain/worksite terms,
  not in historical substrate command lore
- the product statement remains aligned with `REQ-F-GFUNC-*`,
  `REQ-F-ODDSDLC-038`, and `REQ-F-ODDSVC-*`

