# T-017 Publish odd_sdlc `start` Target Catalog And Asset Ownership Index

- id: T-017
- title: Publish a machine-readable odd_sdlc start-target catalog and asset-ownership index so `graph_function:` and `asset:` handles can lawfully enter higher-order traversal
- type: feature
- status: backlog
- goal: odd-sdlc-target-resolution
- change_intent: Make the `odd_sdlc` domain own the published target surfaces required by ABG `start(scope, target, until)`: a catalog of operator-addressable graph-function targets and an asset-ownership/index surface that resolves named software-domain assets into lawful traversal boundaries.
- change_class: design_reframe
- re_entry_point: design_surface
- priority: high
- intake_source: operator UX carry-over from ABG start-intent discussion 2026-04-19
- dependencies: T-016, abiogenesis B-023
- affected_boundary: graph-function catalog publication, asset ownership/index surfaces, installed query surfaces, target-resolution design, odd_service/odd_manager client targeting
- triaged_at: 2026-04-19
- created_at: 2026-04-19
- updated_at: 2026-04-19

## Context

`odd_sdlc` already claims the right conceptual pieces:

- assets addressed by URI
- typed asset nodes and asset graphs
- named functions over those assets
- reusable higher-order graph-function harnesses
- explicit plugin-versus-host graph-function publication

That is enough to support a stronger operator target language:

- `target = graph_function:<published_name>`
- `target = asset:<published_asset_ref>`

But the domain does not yet publish one machine-readable operator target
surface that makes those handles lawful and fail-closed.

## Problem Statement

Without a published domain target catalog and asset-ownership/index surface:

- `graph_function:` targeting risks leaking internal realization names
- `asset:` targeting risks collapsing into fuzzy path lore
- higher-order carriers such as consensus remain structurally reusable but not
  yet cleanly operator-addressable
- later orchestration clients cannot reliably target the same domain entry
  points without duplicating domain knowledge

## Required Direction

`odd_sdlc` should publish two domain-owned operator target surfaces.

### 1. Start Target Catalog

A machine-readable catalog of operator-addressable graph-function targets that
records at minimum:

- stable published name
- outer input/output asset contract
- whether the target is:
  - an executive carrier
  - an ordinary edge-realization carrier
  - a reusable higher-order plugin
  - a host-specific binding over a reusable plugin
- the lawful scope/boundary in which the target can be used

This catalog must distinguish:

- published names operators may target
- internal helper graph functions that remain non-addressable

### 2. Asset Ownership / Index Surface

A machine-readable surface that resolves operator-facing asset handles into the
governing traversal boundary for that asset.

The asset family should cover the current and expected domain surface:

- document assets
- code assets
- ticket/work-item assets
- comment/review assets
- URI-addressed external or imported assets

The important law is:

- `asset:<ref>` resolves through this published domain index
- not through hidden path heuristics
- not through prompt folklore
- not through substrate-local assumptions in ABG

## Higher-Order Reading

This is the domain-side contract that lets `odd_sdlc` feel like higher-order
traversal over software-domain assets:

- the operator targets a named asset or published graph function
- ABG normalizes the target into a lawful traversal plan
- `odd_sdlc` supplies the domain ownership and higher-order carrier meaning

That is especially important for reusable plugin-and-host shapes such as:

- consensus plugins and host bindings today
- later schema, design-quality, release, and review-governed subject assets

## Safety Boundary

This target surface must stay fail-closed:

- only published graph-function names are operator-addressable
- internal helper graph functions are not
- unresolved asset handles fail closed
- the index records ownership/boundary truth explicitly rather than relying on
  fuzzy inference

## Acceptance

- `odd_sdlc` publishes a machine-readable catalog of operator-addressable
  graph-function targets
- the catalog distinguishes higher-order plugins, host bindings, executive
  carriers, and ordinary edge-realization carriers
- `odd_sdlc` publishes a machine-readable asset ownership/index surface for
  operator-addressable assets
- `graph_function:` and `asset:` target handles can be resolved lawfully over
  that published domain truth
- higher-order graph-function carriers become operator-addressable without
  bypassing edge law or leaking internal realization names
- the same published target surfaces are consumable later by direct CLI use,
  installed workspaces, and `odd_service` / `odd_manager` client layers

