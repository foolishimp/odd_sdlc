# ADR-006 - ABG Runtime And ODD Query Plugin Boundary

**Status**: Active
**Date**: 2026-04-06
**Implements**: REQ-F-ODDSDLC-005

## Context

`odd_method` is standardized around the ABG event model.

That event model already gives the strongest understanding of realtime runtime
truth:

- `run`
- `graph_call`
- `continuation`
- `frame`

At the same time, ODD has domain comprehension that ABG does not own:

- `Asset`
- `AssetType`
- `AssetBinding`
- `Function`
- domain gap and convergence meaning

The rejected design direction is:

- ODD serving one monolithic query representation as if it were the primary UI
  truth surface

That would create:

- duplicated runtime model responsibility
- unnecessary coupling between ODD and UI shape
- comprehension drift between ABG runtime truth and ODD read models

The desired compromise is:

- `odd_manager` inherits ABG runtime understanding directly
- ODD supplies domain query logic as a Python library
- the same library may later be wrapped by a microservice or MCP surface

## Decision

`odd_method` adopts this boundary:

- ABG owns the canonical runtime event model and runtime aggregate projections
- ODD owns domain query logic as a Python library
- `odd_manager` composes ABG runtime projections with ODD query results
- ODD does not ratify a monolithic served observer payload as the primary UI
  contract

The first query-library contract is:

- in-process Python
- deterministic
- read-only
- replay-safe

The first consumer contract is:

- `odd_manager` reads ABG events directly for realtime updates
- `odd_manager` uses ABG projectors for runtime aggregates
- `odd_manager` uses ODD query plugins only for domain understanding that ABG
  cannot know

## Query Library Boundary

The ODD query library may provide:

- asset views
- asset type semantics
- binding views
- function catalog views
- domain gap and convergence overlays
- asset checkpoint and provenance interpretation

It must not redefine:

- `run`
- `graph_call`
- `continuation`
- `frame`
- raw event truth

Those remain ABG-native.

## UI Composition Model

The intended `odd_manager` composition is:

1. subscribe to or read ABG event truth directly
2. project ABG runtime aggregates from that event truth
3. invoke ODD query plugins for domain overlays
4. compose both into the UI

This gives:

- direct realtime understanding from ABG
- domain comprehension from ODD
- no duplicate runtime model

## Trigger And Cadence

The first query cadence is on-demand.

That means:

- ABG events update in realtime
- ODD domain queries are recomputed when requested by the UI or CLI
- no background synchronization or materialized query service is required yet

Later service models are allowed, but they remain wrappers around the same core
query library.

## Transitional Note

Any current helper command that composes one convenience payload is
transitional.

Such a command may exist to prove the steel thread, but it is not the ratified
primary boundary.

The ratified boundary is:

- ABG runtime truth directly
- ODD query library as plugin logic

## Consequences

- `odd_manager` can build directly on the ABG event model for realtime updates
- ODD keeps ownership of domain semantics without becoming a second runtime
- the UI avoids ad hoc domain reconstruction
- future microservice or MCP deployment remains available without repricing the
  core boundary
