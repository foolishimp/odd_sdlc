# S-037 Review odd_sdlc Core Domain Model, Sequence Flows, and Fault Lines

- id: S-037
- title: Review odd_sdlc core domain model, sequence flows, and fault lines
- type: spike
- ticket_category: ordinary
- status: completed
- goal: odd_sdlc-core-stabilization
- change_intent: stabilize the odd_sdlc core by making boundary ownership, carrier authority, sequence flow, and recurring failure categories explicit before further refactors
- change_class: design_reframe
- re_entry_point: design_surface
- triaged_at: 2026-04-23
- created_at: 2026-04-23
- updated_at: 2026-04-23
- priority: high
- intake_source: operator request after repeated repair-wave bugs exposed unclear boundary ownership between GTL publications, ABG substrate, and odd_sdlc governance code
- affected_boundary: odd_sdlc core runtime and governance modules
- links:
  - `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
  - `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
  - `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/B-035-public-start-next-bypasses-published-constitutional-pending-fh-gate.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/B-036-public-start-next-collapses-lawful-proof-yield-continuation-into-operator-facing-failure-projection.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T140500Z_S037_01_core_domain_model.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T141000Z_S037_02_source_carriers_and_closure.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T141500Z_S037_03_homeostatic_triage_and_dossiers.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T142000Z_S037_04_public_control_and_admission.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T142500Z_S037_05_projections_and_materialization.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T143000Z_S037_06_fault_line_synthesis.md`

## Context

The current repair wave has exposed recurring confusion about what kind of code
`odd_sdlc` is, where semantic authority is allowed to live, and how public
control flow is supposed to consume published carriers.

The same pattern keeps reappearing:

- a carrier or published read model exists
- one controller or wrapper path still reinterprets or bypasses it
- GTL publication truth, ABG substrate truth, and odd_sdlc domain-governance
  truth get blurred together
- reviews then discover the fault only after a bug reproducer or mixed-state
  event stream appears in a sandbox

This ticket exists to slow the wave down and make the core realization shape
explicit before more local bug fixes accumulate around an unstable mental model.

## Review Authority

This review is governed by:

- `SPEC_METHOD.md` for lawful authority flow and re-entry
- `TICKET_METHOD.md` for durable review tracking and closure discipline
- `DESIGN_MODULE_METHOD.md` for the realization review bar

The review is not commentary-only. It is a stabilization artifact that must
leave behind concrete review outputs explaining:

- the odd_sdlc domain model
- the role of each core file
- the sequence flow of each core function
- the recurring fault-line categories
- the justification for keeping or changing the present design choices

## Target Truth

`odd_sdlc` core code is understood and reviewed as domain-owned
governance/control code over published carriers, with GTL publications and ABG
substrate boundaries kept explicit and non-overlapping.

## Superseded Truth

Informal or shifting operator intuition about whether a failure belongs to GTL
config, ABG runtime, or odd_sdlc domain logic; controller-centric debugging
that does not first name the carrier boundary and file role under review.

## Closure Law

This ticket closes only when the core odd_sdlc review set has a durable review
record that:

1. defines the domain model and boundary taxonomy first
2. classifies each reviewed file using `DESIGN_MODULE_METHOD.md`
3. gives a sequence diagram for each top-level function in the named core files
   unless the function is purely constant-return or formatting-only
4. names the fault-line category for each discovered defect or ambiguity
5. justifies why the current design is lawful to keep or why it should be
   refactored
6. leaves behind a synthesis matrix that shows the repeated failure patterns
   across files

The ticket is not closed by ad hoc review comments, isolated bug patches, or
test greenness alone.

## Evaluation Criteria

- a `Core Domain Model` review post exists before file-by-file reviews
- each named core file is reviewed in its own durable post or clearly bounded
  paired post
- each review names the file role:
  - carrier module
  - semantic kernel module
  - effect shell module
  - projection module
  - binding or adapter module
  - constructor or materialization module
- each top-level function in scope has a sequence diagram showing:
  - admitted input or caller
  - carrier reads
  - semantic transforms
  - effect edges
  - downstream projections or events
- each review names whether the design choice is:
  - lawful and prime
  - lawful but over-coupled
  - incomplete migration
  - incorrect boundary ownership
  - interface bleed
  - proxy compatibility authority
  - split-brain carrier vs controller authority
  - unstable identity or refresh semantics
  - hidden semantic center
  - effect leakage or hidden mutation
- a final synthesis matrix maps recurring failure categories to the affected
  files and to any active repair tickets

## Non-Closure Conditions

The ticket remains open if:

- reviews begin with controller procedures instead of a domain model
- the file role taxonomy is omitted or guessed implicitly
- sequence diagrams are missing for semantic functions
- discovered faults are described only as “bug” or “wiring issue” without a
  category
- design choices are criticized or defended without reference to the adopted
  module taxonomy and Prime Law
- review output blurs GTL publication, ABG substrate, and odd_sdlc
  domain-governance ownership
- review output exists only in chat and is not published into the durable
  comments layer

## Proof Surface

- one `Core Domain Model` comment post under `.ai-workspace/comments/codex/`
- one file review post for each named core file or one clearly bounded post per
  paired file family
- sequence diagrams in Mermaid `sequenceDiagram` form inside those posts
- one final `Fault-Line Synthesis` post under `.ai-workspace/comments/codex/`
- ticket updates linking the produced posts

## Core Review Set

The initial core review set is:

- `build_tenants/python/code/odd_sdlc/app.py`
- `build_tenants/python/code/odd_sdlc/execution_contract.py`
- `build_tenants/python/code/odd_sdlc/start_targeting.py`
- `build_tenants/python/code/odd_sdlc/query.py`
- `build_tenants/python/code/odd_sdlc/gap_dossier.py`
- `build_tenants/python/code/odd_sdlc/triage.py`
- `build_tenants/python/code/odd_sdlc/homeostatic_loop.py`
- `build_tenants/python/code/odd_sdlc/analysis.py`
- `build_tenants/python/code/odd_sdlc/repair_frontier.py`
- `build_tenants/python/code/odd_sdlc/traceability_index.py`
- `build_tenants/python/code/odd_sdlc/requirement_closure.py`
- `build_tenants/python/code/odd_sdlc/span_analysis.py`
- `build_tenants/python/code/odd_sdlc/constructor.py`

Additional files may be added if a review proves they are acting as hidden
semantic centers or are indispensable to one of the named sequence flows.

## Review Order

The review should proceed in this order:

1. define the domain model and boundary map
2. classify source carriers and source-of-truth modules
3. review semantic kernels that transform those carriers
4. review public control surfaces and bindings
5. review projections and effect shells
6. synthesize recurring fault lines and justify design changes

Do not start by diagramming CLI or controller flow in isolation.

## Deliverables

### 1. Core Domain Model

The first review output must define:

- what odd_sdlc is responsible for semantically
- what GTL is responsible for constructively
- what ABG is responsible for generically
- what counts as the authoritative carriers in odd_sdlc
- which modules are allowed to interpret domain meaning
- which modules are only allowed to bind, project, or emit effects

### 2. Per-File Review Shape

Each file review must include:

- file purpose in one sentence
- module taxonomy role
- exported or top-level function inventory
- sequence diagram for each semantic top-level function
- explicit fault-line categories, if any
- design-choice justification:
  - why the current shape is lawful to keep, or
  - why a refactor is justified under Prime Law and no-semantic-center rules

### 3. Fault-Line Synthesis

The final synthesis must identify recurring categories such as:

- incomplete migration
- incorrect boundary ownership
- hidden semantic center
- split carrier vs controller authority
- unstable identity across refresh or reprojection
- interface bleed between admission, projection, and public control
- proxy compatibility surfaces masquerading as real migration
- effect leakage or hidden mutation

The synthesis must map each category to the reviewed files and to active or
follow-on tickets when remediation is required.

## Explicit Review Question

Every file review should answer:

`If this file were removed, what authoritative carrier or boundary would stop existing, and is that stop semantically lawful?`

If the answer is “the system would keep working because controller logic or a
projection silently rebuilds the meaning,” that is a fault line.

## Out Of Scope

- landing all resulting refactors in this ticket
- repricing requirements unless a review proves requirement ambiguity
- ratifying final design law directly from comments without a later design
  update

This ticket is the stabilization review campaign. Repair work may stay in
existing bug tickets or in follow-on tickets once the fault lines are explicit.

## Progress Notes

- 2026-04-23: ticket opened to stabilize the current odd_sdlc wave with a
  design-method review pass over the core files before more bug-local patches
  accumulate
- 2026-04-23: core domain model baseline posted at
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T000000Z_REVIEW_s037-01-core-domain-model.md`
- 2026-04-23: start admission family review posted at
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004227Z_REVIEW_s037-02-start-admission-family.md`
- 2026-04-23: public control and query family review posted at
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004228Z_REVIEW_s037-03-public-control-and-query-family.md`
- 2026-04-23: homeostatic and publication family review posted at
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004229Z_REVIEW_s037-04-homeostatic-and-publication-family.md`
- 2026-04-23: traceability, closure, and gap-kernel review posted at
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004230Z_REVIEW_s037-05-traceability-closure-and-gap-kernels.md`
- 2026-04-23: constructor/materialization review posted at
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004231Z_REVIEW_s037-06-constructor-materialization.md`
- 2026-04-23: fault-line synthesis matrix posted at
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004232Z_MATRIX_s037-fault-line-synthesis.md`
- 2026-04-23: published the core domain model, source-carrier review,
  homeostatic triage review, public control/admission review, projection and
  materialization review, and the initial fault-line synthesis into the codex
  comments lane
- 2026-04-23: closed after the review campaign produced the required durable
  comment set; cleanup sequencing continues under S-038 and the active repair
  tickets
