# B-004 Track Odd Service Remote Client And Consensus Scope Debt

- id: B-004
- title: Track deferred odd_service scope debt for remote verification, client boundary, and consensus proving
- type: bug
- status: active
- goal: orchestration-plane
- priority: medium
- created_at: 2026-04-13
- updated_at: 2026-04-13
- dependencies: T-004

## Triage

- intake: review / scope drift / unfinished product-line surface
- lawful_change_class: scope_reprice
- affected_boundary: odd_service specification, service boundary, and proving lanes
- lawful_re_entry: odd_service requirements, implementation, and tests after the current odd_sdlc stabilization wave
- downstream_proof_span: focused odd_service service-boundary proofs plus later remote proving lanes

## Why This Ticket Exists

The current `odd_service` implementation is still an incubating local
orchestration slice. That is enough for the present first-slice proofs, but it
does not yet satisfy the fuller active requirement surface declared in
`09-odd-service-orchestration-plane.md`.

The missing or only partially realized areas are:

- `REQ-F-ODDSVC-007`: remote snapshot verification / fail-closed provenance
- `REQ-F-ODDSVC-008`: odd_manager client boundary rather than competing owner
- `REQ-F-ODDSVC-009`: consensus as a proving lane across the service boundary
- likely partial `REQ-F-ODDSVC-004`: peer/client execution surface completeness

This is real scope debt, but it is not the right thing to pull into the current
odd_sdlc runtime-boundary and traceability stabilization slice.

## Intended Direction

Track this as explicit deferred work so the current wave can close on the
validated odd_sdlc and odd_service bugs without losing the larger odd_service
product-line gap.

When this ticket is activated, the work should:

- make remote snapshot verification explicit and fail-closed
- make odd_manager a lawful client boundary rather than a competing execution
  owner
- add a real consensus proving lane over the service boundary
- close the remaining peer/client execution contract implied by `ODDSVC-004`

## Task List

- [ ] Reprice the active odd_service requirements against the current shipped
  implementation and decide whether `007/008/009` stay active or are staged.
- [ ] Add explicit proof surfaces for remote snapshot verification.
- [ ] Add the odd_manager client boundary and consensus proving lane.
- [ ] Expand odd_service tests beyond the current `001-006` first-slice surface.

## Acceptance

- the deferred scope is explicitly preserved and linked from the current wave
- current odd_sdlc stabilization can complete without silently dropping the
  odd_service product-line debt

## Links

- parent: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/T-004-restore-homeostatic-gap-triage-and-intent-renewal.md`
- requirement: `/Users/jim/src/apps/odd_method/specification/requirements/09-odd-service-orchestration-plane.md`
