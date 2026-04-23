---
id: B-043
title: Close broad query plugin and operational-dispatch open projection surfaces outside the public-start family
type: bug
status: completed
priority: medium
change_class: design_reframe
re_entry_point: design_surface
created_at: 2026-04-23
updated_at: 2026-04-24
dependencies: B-040 completed
affected_boundary: odd_sdlc broad query-domain plugin projections outside the closed public-start family, plus operational_dispatch.py unpublished projection law
goal: close or explicitly bound the remaining open query/plugin and operational-dispatch projection carriers after B-040
target_truth: B-040 closes only the public-start carrier family and its direct query/start-target projection seam. This follow-on closes the remaining broad query-domain object projections and operational-dispatch unpublished local projection boundary so they either become typed/downstream lawful carriers or are explicitly justified foreign boundaries.
closure_law: this ticket closes when query-domain no longer republishes unrelated broad object surfaces as anonymous semantic bags, and operational_dispatch is reduced to a single-step cooperative adapter that publishes one admissible tenant-owned operational advance and returns control to ABG. It does not close by teaching odd_sdlc to own a multi-step operational continuation loop.
proof_surface:
  - source proof over query-domain broad projection surfaces
  - source and install proof over single-step operational dispatch semantics
  - bounded static typing lane for the follow-on slice
---

## Context

B-040 closed the public-start carrier family itself:

- published gap dossier
- public start admission/outcome
- admitted execution contract
- yielded ingress adapter
- direct query/start-target projection seam

It did not lawfully close the broader query-domain plugin payload family or the
`operational_dispatch.py` unpublished projection seam. Those remain active debt
and are tracked here so B-040 does not have to overclaim them.

This ticket is also governed by the shared ODD method principle, now ratified
in `specification_methodology/specification/standards/ODD_METHOD.md`, that
GTL/ABG applications are cooperative bounded-step subsystems and must not
replace ABG continuation with tenant-local orchestration.

For `odd_sdlc`, that shared law is bound locally in
`build_tenants/python/design/adrs/ADR-002-abg-continuation-authority-and-cooperative-operational-dispatch.md`:
ABG owns continuation and re-entry, while `odd_sdlc` operational command
surfaces publish one bounded advance and return.

## Scope

In scope:

- `build_tenants/python/code/odd_sdlc/query.py`
  non-public-start broad plugin payload fields still carried as `object` or
  anonymous dict/list structures
- `build_tenants/python/code/odd_sdlc/query_contract.py`
  if the query contract still overstates a closed surface relative to the
  actual plugin payload family
- `build_tenants/python/code/odd_sdlc/operational_dispatch.py`
  open dict projection carriers, direct unpublished gap consumption, and any
  tenant-local multi-step operational continuation logic

Out of scope:

- the public-start carrier family already closed under B-040
- the separate route-law issue around `prepare_release_surface` tracked by `B-044`

## Initial Direction

1. Decide whether each remaining broad query/plugin field is:
   - promoted into a typed downstream payload
   - kept dynamic but collapsed immediately behind a named foreign boundary
2. Rebind `operational_dispatch.py` so it is a one-step cooperative adapter:
   - ABG owns current operational continuation truth
   - odd_sdlc executes at most one admissible tenant-owned operational step
   - odd_sdlc publishes evidence/read-model updates and returns
3. Reprice tests and proof claims so they do not require odd_sdlc to drive a
   multi-step operational continuation loop inside one invocation
4. Reprice proof and typing lanes for the narrower follow-on boundary

## Closure Note

Closed on the narrowed shared-method line.

What landed:

- `operational_dispatch.py` no longer mixes public `next` with explicit
  operational-program authority and no longer owns a tenant-local continuation
  loop
- operational dispatch now resolves only
  `graph_function:release_operational_cycle`, performs exactly one admissible
  tenant-owned step, republishes truth, and returns control
- the tactical multi-step projection walker is removed; prepare, dispatch, and
  projection edges now each consume one invocation
- broad GTL declaration payloads in the query/start-target lane are no longer
  carried as anonymous `object` bags; they are bound behind named opaque GTL
  declaration payloads in the typed query/start-target contract
- the local tenant ADR now derives from shared `ODD_METHOD.md §11.5A` instead of
  inventing this IoC rule locally

Proof used for closure:

- package strict lane
  - `python -m mypy --config-file mypy.ini -p odd_sdlc`
  - `Success: no issues found in 48 source files`
- source proof
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'test_query_domain_exposes_domain_views_without_runtime_duplication or test_b043_operational_dispatch_is_a_single_step_cooperative_adapter'`
  - `2 passed, 96 deselected`
- sandbox install proof
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py -q -k 'test_dispatch_operational_runs_declared_local_bindings_end_to_end'`
  - `1 passed, 12 deselected`

This closure intentionally uses harnessed source and sandbox-install proofs
only. Live tests are deferred until the active ticket set is cleared.
