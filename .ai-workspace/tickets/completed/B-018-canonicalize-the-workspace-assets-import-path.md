# B-018 Canonicalize The `workspace_assets` Import Path

- id: B-018
- title: Remove the dual-path import hazard for `workspace_assets` and define one canonical module path
- type: bug
- status: completed
- goal: module-boundary-integrity
- priority: medium
- created_at: 2026-04-18
- updated_at: 2026-04-18
- dependencies:
- change_intent: remove import-path ambiguity that can produce maintenance drift and subtle runtime/test divergence
- change_class: realization_refactor
- re_entry_point: realization
- triaged_at: 2026-04-18
- intake_source: odd_sdlc review follow-up; extracted from former T-011 umbrella `G12`
- affected_boundary: module import graph, workspace asset consumers, and static maintenance safety

## Why This Ticket Exists

`workspace_assets` is currently reachable through more than one module path.

That is a maintenance hazard:

- readers cannot tell which path is canonical
- future refactors can update one path and miss the other
- test/runtime code can drift onto different import identities for the same
  logical surface

This is not the biggest ticket in the wave, but it is a real reliability and
maintainability defect.

## Intended Direction

Pick one canonical import path, move all consumers to it, and add a guard so
the dual-path state does not reappear.

## Task List

- [ ] Inventory all import sites for `workspace_assets`.
- [ ] Choose and document the canonical module path.
- [ ] Update consumers to the canonical path.
- [ ] Add a static check or focused test that fails if the alternate path
  reappears.

## Acceptance

- `workspace_assets` is reached through one canonical module path only
- consumers no longer depend on ambiguous import identity
- the guard against dual-path drift is in place

## Links

- review source: extracted from former `T-011` umbrella task `G12`
