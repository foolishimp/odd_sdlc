---
id: T-021
title: Publish one constructive prompt template with section checksums for F_P execution and manifest provenance
type: feature
ticket_category: implementation_migration
status: completed
goal: prompt-contract-one-truth
change_intent: Replace ad hoc constructive prompt section assembly with one published prompt template whose sections remain free-form but whose structure and normalized content checksums are explicit execution truth
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc constructive prompt assembly, prompt-template publication, per-section checksum publication, manifest provenance, source-line and installed proof for F_P builder dispatch
priority: high
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-20
dependencies: odd_sdlc B-032 completed; odd_sdlc B-033 completed
intake_source: step-back audit after the odd_sdlc repair-frontier and ticket-routing wave
---

## Migration Declaration

- old_truth_path: `.genesis/genesis/binding.py` still assembles the constructive prompt from ad hoc local sections such as target-binding notes, raw failing evaluator summaries, deterministic failure text, inline contexts, and source snapshots, while ticket-execution discipline only appears when a routed work item happens to inject `active_work_item_context`
- new_truth_path: odd_sdlc publishes one constructive prompt template per dispatch with named sections, free-form content inside each section, and normalized per-section plus whole-template checksums; prompt assembly and manifest provenance consume that one published template instead of synthesizing the shape inline
- producers_old:
  - `.genesis/genesis/binding.py::_assemble_prompt`
  - optional `active_work_item_context` injection through `odd_sdlc.work_item_routing`
- producers_new:
  - odd_sdlc constructive prompt-template publication surface
  - repair frontier publication
  - generated-asset contract publication
  - current gap / deterministic failure projection
  - active work-item execution context when present
- consumers_old:
  - constructive F_P dispatch manifests
  - operator prompt inspection
  - source-line proof around prompt contents
- consumers_new:
  - constructive F_P dispatch manifests
  - operator prompt inspection
  - source-line and installed proof around prompt contents and provenance
- derived_surfaces:
  - published constructive prompt-template register / context
  - per-section checksum map
  - whole-template checksum
  - dispatch manifest prompt body
  - manifest provenance over the consumed template and section checksums
  - prompt-focused proof lanes
- closure_law: this migration closes only when ad hoc prompt section ordering in `binding.py` is no longer authoritative, every constructive F_P dispatch consumes one published prompt template with section checksums, and mixed old/new prompt proofs are no longer accepted as closure evidence

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Why This Ticket Exists

The current odd_sdlc wave proved that ticket execution discipline works well as
prompt law when it is made explicit.

Today that discipline is still asymmetric:

- repair-frontier law is published and injected
- generated-asset contract law is published and injected
- active ticket/work-item execution discipline is published and injected only
  for routed `asset:ticket/...` starts
- the rest of the constructive prompt is still assembled ad hoc in substrate
  binding code

That leaves the general constructive prompt path weaker than the ticket method.

The missing thing is not a rigid prose form.

The missing thing is one published template:

- fixed section names
- free-form content within those sections
- one normalized checksum/digest per section
- one whole-template checksum

That gives prompt assembly built-in integrity markers without destroying the
builder's freedom to reason inside the sections.

The checksums are not a second authority surface. They are the reviewable
"did we really consume this exact structure and content" markers for the live
prompt truth.

## Required Direction

1. Publish one domain-owned constructive prompt template for F_P dispatch.
2. Keep the template structured by named sections, but allow free-form content
   inside each section.
3. At minimum publish sections for:
   - edge identity
   - target asset identity and current checkpoint
   - source asset identities and current checkpoints
   - current gap / failing-evaluator statement
   - deterministic failure law
   - relevant published contexts
   - generated-asset contract
   - repair-frontier law
   - active work-item execution context when present
4. Publish normalized checksums for:
   - each named section
   - the whole rendered template
5. Make prompt assembly consume that one template instead of synthesizing the
   same structure ad hoc in multiple steps.
6. Carry the template identity and checksum map into manifest provenance so
   prompt behavior is explainable after the fact.
7. Prove the template on both the source line and the installed line.

## Acceptance

- odd_sdlc publishes one constructive prompt template surface for constructive
  F_P dispatch
- the existing repair-frontier and active work-item contexts are composed into
  that template rather than injected as unrelated side sections
- `.genesis/genesis/binding.py` no longer acts as the hidden authority for the
  constructive prompt shape
- manifest provenance records the consumed template identity, per-section
  checksums, and whole-template checksum
- proof shows that routed ticket starts and ordinary `target next` constructive
  starts both consume the same published prompt template structure

## Post-Closure ODD_METHOD Review - 2026-04-21

Review recorded in:

- `.ai-workspace/comments/codex/20260421T212949Z_REVIEW_completed-active-wave-tickets-odd-method-graph-requirements.md`

Verdict:

- completed as historical prompt-pressure work
- not current runtime-law authority after ABG 3.2
- superseded for current implementation by `T-023` and
  `build_tenants/python/design/PROMPT_CONTEXT_CARRIAGE.md`

Current law:

- ABG owns the generic constructive F_P prompt and manifest shape.
- odd_sdlc contributes admitted domain execution truth through the
  `odd_sdlc_execution_contract_context` declared GTL context.
- Future prompt work must not revive
  `dispatch_provenance.constructive_prompt_template` as a rival authority
  surface.
