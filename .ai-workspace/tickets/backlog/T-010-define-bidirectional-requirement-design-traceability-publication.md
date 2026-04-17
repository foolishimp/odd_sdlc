# T-010 Define Bidirectional Requirement/Design Traceability Publication

- id: T-010
- title: Define and publish the local requirement ↔ design traceability convention instead of relying on ad hoc grep history
- type: bug
- status: backlog
- goal: traceability-completeness
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-18
- dependencies:
- change_intent: make requirement/design traceability explicit, queryable, and locally published without relying on false assumptions about current headers
- change_class: requirement_reprice
- re_entry_point: requirement
- triaged_at: 2026-04-18
- intake_source: external review plus follow-up verification against the live requirement files
- affected_boundary: requirement headers, design/ADR reference publication, traceability projection, and future F_D traceability checks

## Triage

- intake: external review of odd_sdlc against `SPEC_METHOD.md` traceability
  rules
- lawful_change_class: requirement_reprice
- affected_boundary: requirement header publication and requirement/design traceability projection
- lawful_re_entry: requirement layer first, then traceability projection and evaluators
- downstream_proof_span: traceability report, requirement closure register, and explicit missing-trace checks over active requirement/design surfaces

## Why This Ticket Exists

The previous version of this ticket was not trustworthy enough to build from.
It asserted facts that are not true of the live files:

- the current requirement files do not consistently publish upstream `Carries:`
  lines
- the current requirement files also do not consistently publish authoring
  design/ADR references

So the real problem is broader and cleaner:

- odd_sdlc does not yet publish one explicit local convention for
  requirement/design traceability
- traceability currently depends too much on file archaeology and grep history
- future checks would be built on unstable assumptions unless the publication
  rule is defined first

This is a defect in traceability law and traceability publication, not a
stylistic cleanup.

## Intended Direction

Define one local, explicit requirement/design traceability convention and then
back-fill the live files to match it.

Concretely:

- decide the local publication shape for:
  - upstream carries into requirements
  - requirement back-pointers into authoring design/ADR surfaces
- document that local rule in odd_sdlc authority rather than pretending it is
  already present everywhere
- back-fill the active requirement files against the chosen rule
- add F_D checks so future drift is fail-closed

This ticket does not assume that the final convention must immediately become
shared method law. It only requires odd_sdlc to publish one lawful local rule
first. If the pattern later proves broadly useful, it can be repriced upward
into shared authority.

## Task List

- [ ] Inventory the active requirement files and the currently published
  traceability fields they actually contain.
- [ ] Define the local publication shape for upstream carries and authoring
  design/ADR references.
- [ ] Document that convention in odd_sdlc-local authority and template
  guidance.
- [ ] Back-fill the active requirement files against the chosen convention.
- [ ] Add F_D checks for:
  - missing upstream carries where required
  - missing authoring design/ADR references where required
- [ ] Wire those checks into the existing traceability projection/reporting
  path.

## Acceptance

- odd_sdlc publishes one explicit local convention for requirement/design
  traceability
- active requirement files conform to that convention
- future traceability drift is caught by explicit F_D checks rather than by
  manual grep archaeology
- this ticket no longer depends on false claims about the current headers

## Links

- review source: external code review of `/Users/jim/src/apps/odd_sdlc`
- standards: `specification_methodology/specification/standards/SPEC_METHOD.md`
- bootloader rule: `CLAUDE.md` §9 LLM Operating Rule, item 5
