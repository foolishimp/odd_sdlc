# B-016 Stop Normalization From Silently Defaulting Malformed Or Missing Inputs

- id: B-016
- title: Make normalization fail closed or explicitly defaulted-with-provenance instead of silently rewriting missing/malformed inputs
- type: bug
- status: completed
- goal: build-reliability-and-boundary-integrity
- priority: high
- created_at: 2026-04-18
- updated_at: 2026-04-18
- dependencies:
- change_intent: remove silent fail-open normalization paths so imported and installed workspaces do not appear healthier than their actual input state
- change_class: realization_refactor
- re_entry_point: realization
- triaged_at: 2026-04-18
- intake_source: odd_sdlc review follow-up; extracted from former T-011 umbrella `G7`
- affected_boundary: normalization, imported workspace shaping, installed-dev proof honesty, and ambiguity/default provenance publication

## Why This Ticket Exists

`normalization.py` still contains paths where a missing or malformed input is
silently rewritten to a default shape.

That is a reliability defect:

- it can make an imported workspace look healthier than it is
- it can hide real ambiguity or missing source truth
- it weakens the meaning of later proving results because the operator cannot
  always tell whether the workspace was normalized lawfully or merely coerced

For the next quality/reliability wave, normalization must stop being a quiet
rewriter.

## Intended Direction

Each normalization path must do one of two things only:

1. fail closed and surface the defect/ambiguity, or
2. emit an explicit `defaulted_with_provenance` style value that makes the
   fallback visible and queryable

Silent rewrite is not lawful.

## Task List

- [ ] Inventory the current fail-open normalization paths, especially the
  reviewed regions in `normalization.py`.
- [ ] Classify each path as:
  - fail-closed required
  - explicit default with provenance allowed
- [ ] Implement the chosen behavior for each path.
- [ ] Add tests proving missing/malformed inputs no longer normalize silently.
- [ ] Confirm downstream install/sandbox proofs still behave honestly.

## Acceptance

- missing or malformed inputs are never silently rewritten
- each remaining default path is explicit, queryable, and provenance-carrying
- imported/install proof no longer depends on hidden normalization coercions

## Links

- review source: extracted from former `T-011` umbrella task `G7`
- related: `T-012` (sandbox/worksite lifecycle), because proving honesty depends
  on normalization honesty
