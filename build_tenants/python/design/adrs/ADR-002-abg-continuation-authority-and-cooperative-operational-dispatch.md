# ADR-002 - ABG Continuation Authority And Cooperative Operational Dispatch

**Status**: Approved
**Date**: 2026-04-24
**Implements**: `REQ-F-ODDSDLC-038`, `REQ-F-ODDSDLC-039`
**Governed By**: `specification_methodology/specification/standards/ODD_METHOD.md`, `specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
**Derives From**: `build_tenants/common/design/adrs/ADR-002-graph-function-first-carrier-and-runtime-boundary.md`, `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`, `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`, `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`

## Context

`odd_sdlc` owns domain governance and domain-facing read models. It does not own
the runtime continuation loop.

The rejected direction is a tenant-local controller that:

- resolves current operational state
- runs one operational step
- infers what the next operational step should be
- carries multi-step continuation locally across publish boundaries
- acts like a mini runtime over ABG truth

That shape creates a semantic-center leak between ABG continuation authority and
tenant-local orchestration. It lets the tenant mix:

- public `start(... target="next")` truth
- explicit `graph_function:` continuation truth
- published gap/read-model truth
- local in-process assumptions about what should happen next

That is not lawful steady-state design for this tenant.

## Decision

ABG remains the sole authority for continuation and re-entry.

`odd_sdlc` operational command surfaces are cooperative adapters, not runtime
drivers.

For operational work, the tenant may:

- expose declared operational contracts and lane bindings
- materialize the current tenant-owned prepare or projection asset
- execute one declared local operational contract for the current admitted lane
- publish result evidence, dispatch records, and read-model updates
- return control to ABG

The tenant may not:

- own a multi-step operational continuation loop
- infer later operational steps from controller-local memory
- advance from one operational lane into another without re-entry through ABG
- treat public `next` and explicit operational-program continuation as rival
  authorities inside one controller

## Operational Dispatch Rule

`dispatch_operational` is lawful only as a single-step cooperative adapter.

One invocation may perform exactly one admissible tenant-owned operational
advance:

1. resolve the current admissible operational step through ABG continuation
   truth
2. if the admissible step is a tenant-owned prepare surface, materialize it
3. if the admissible step is a tenant-owned result edge with a declared local
   contract, execute that one contract and publish the resulting evidence
4. refresh and publish tenant read models
5. return

After that return, ABG remains responsible for any further continuation.

The tenant is not allowed to chain:

- prepare
- result dispatch
- projection continuation
- next-lane prepare
- next-lane result dispatch

inside one tenant-local operational command as if it owned the loop.

## Query And Read-Model Rule

The same inversion applies to query/read-model surfaces.

`odd_sdlc` may publish:

- domain query overlays
- gap dossier read models
- operational dispatch registers
- current domain-facing state projections

Those surfaces are downstream read models over ABG truth plus admitted tenant
truth.

They do not replace ABG authority for:

- continuation
- run lifecycle
- graph-call lifecycle
- event ordering
- frame or lineage truth

## Execution Contract Boundary

Operational execution still begins from the admitted execution-contract source
carrier.

That carrier may identify:

- a public `next` start
- an explicit `graph_function:` target
- a route-bound `asset:` target

But once an explicit operational continuation graph function is admitted, the
tenant must continue to re-enter through that ABG-owned continuation target.

The tenant may not silently fall back to ambient public `next` truth to decide
later operational continuation.

## Enforcement Shape

This ADR is a tenant-local binding of the shared ODD method rule that GTL/ABG
applications are cooperative bounded-step subsystems and must not replace ABG
continuation.

This ADR is satisfied only when:

- operational continuation after a publish boundary is resolved by a fresh ABG
  re-entry
- tenant-local operational commands publish one-step evidence and return
- query and dossier surfaces remain downstream read models, not continuation
  owners
- no tenant-local controller acts as a hidden event loop over ABG truth

## Consequences

- `dispatch_operational` must be designed and tested as a one-step cooperative
  adapter
- harnessed tests that currently assume one tenant invocation may walk multiple
  operational lanes must be repriced or split across repeated ABG re-entry
- future operational helpers must publish evidence and return rather than
  accreting local continuation logic
- runtime truth remains ABG-owned; tenant read models remain tenant-owned
  downstream projections
