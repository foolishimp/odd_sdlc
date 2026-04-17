# T-011 Address Remaining Review Cleanup After Reliability Splits

- id: T-011
- title: Residual cleanup bundle for the review items that are not part of the active quality/reliability wave
- type: chore
- status: backlog
- goal: review-debt-cleanup
- priority: medium
- created_at: 2026-04-17
- updated_at: 2026-04-18
- dependencies: B-012, B-018, T-010
- change_intent: preserve the lower-severity wording, dispatch-table, cohesion, and header-hygiene follow-ups after extracting the reliability-critical work into standalone tickets
- change_class: realization_refactor
- re_entry_point: design
- triaged_at: 2026-04-18
- intake_source: external odd_sdlc review, narrowed after reliability-critical items were split into standalone bug tickets
- affected_boundary: register wording, GTL edge dispatch publication, module cohesion, and header hygiene

## Triage

- intake: external review of odd_sdlc against `SPEC_METHOD.md` and
  `ODD_METHOD.md`; remaining items after the three high-severity tickets
  (B-012, T-009, T-010) were split out.
- lawful_change_class: realization_refactor
- affected_boundary: register wording, normalization stage, GTL edge
  dispatch, module file cohesion, file headers, self-test surface
- lawful_re_entry: design layer for wording and dispatch decisions;
  realization layer for module splits, header hygiene, and self-test
- downstream_proof_span: traceability report cleanliness, self-hosting
  consistency check coverage, future maintainability of the codebase
- triaged_at: 2026-04-17

## Why This Ticket Exists

The previous umbrella bundled together two different kinds of work:

- reliability-critical items that should be built as first-class active tickets
- lower-severity cleanup that can remain as later follow-on work

That was too muddy for the next wave.

The reliability-critical items have now been split out:

- fail-open normalization
- self-test depth for the homeostatic loop and emit boundary
- canonical `workspace_assets` import path

This ticket now holds only the remaining lower-severity cleanup so the review
is still fully posted without hiding active reliability work inside an
umbrella.

## Intended Direction

Work each task as an independent small cleanup after the active reliability
wave closes.

## Task List

- [ ] **G6 (design_reframe)** Stop describing the ambiguity register and
  requirement closure register as "durable artifacts." They are mutable
  projections over the event stream (`ambiguity.py:178-224` rebuilds them
  on each pass). Update the bootloader/CLAUDE.md wording, the README, and
  any requirement text that still calls them durable, so consumers do not
  treat them as immutable logs.

- [ ] **G8 (design_reframe)** GTL edge semantics are hard-coded in
  `operational_dispatch.py:23-42`. Move the edge-kind → dispatch mapping
  into a declarative table that is part of the GTL surface (or at least
  documented as part of the realization contract over GTL edge kinds) so a
  reader does not have to read Python control flow to learn the semantics.

- [ ] **G9 (realization_refactor)** Split the three largest mixed-concern
  modules along their natural seams:
  - `triage.py` (1333 LOC): split observation intake, classification, and
    routing.
  - `workspace_assets.py` (896 LOC): split filesystem IO, asset model,
    and projection assembly.
  - `traceability.py` (626 LOC): split index build, query, and report
    rendering.

- [ ] **G10 (chore)** Add the `# Implements:` header (or local equivalent)
  to `analysis.py` so it matches the rest of the realization layer's
  requirement-trace header convention.

## Acceptance

- each subtask above is closed independently with its own commit and
  the relevant evaluator(s) green
- the bundled umbrella ticket is closed only when all subtasks are closed,
  or split into its own follow-ups if any subtask grows beyond a small
  change

## Links

- review source: external code review of `/Users/jim/src/apps/odd_sdlc`
- companion tickets: `B-012`, `B-016`, `B-017`, `B-018`, `T-010`
- standards: `specification_methodology/specification/standards/SPEC_METHOD.md`,
  `ODD_METHOD.md`
