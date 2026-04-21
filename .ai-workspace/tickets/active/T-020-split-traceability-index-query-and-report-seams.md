---
id: T-020
title: Split traceability index build, query, and report rendering into explicit seams
type: chore
ticket_category: implementation_migration
status: active
goal: keep odd_sdlc traceability and requirement-closure logic reviewable without one giant mixed-concern traceability module
change_intent: Replace the current mixed `traceability.py` surface with explicit index-build, obligation-ledger, query, and report seams while preserving one published requirement-closure truth and eliminating repeated edge re-entry caused by stale or split obligation carry
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc requirement closure register, traceability scan, obligation-ledger publication, and traceability query/report cohesion
priority: medium
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-21
dependencies: odd_sdlc T-022 completed; odd_sdlc T-023 completed; ABG 3.2.0 runtime carrier line completed
intake_source: split from completed T-011 umbrella after stale review-cleanup items were reconciled; reactivated by T-022 yield-lane forensic evidence showing repeated feature/scenario re-entry from obligation carry truth that is not isolated from traceability report/query helpers
target_truth: one requirement-closure/obligation-ledger carrier owns current requirement identity, carried IDs, fulfillment IDs, blocking obligations, and report projection; FD checks, gap dossiers, query-domain, and prompts consume that carrier instead of each recomputing traceability meaning
superseded_truth: traceability scan, requirement closure register, declared obligation ledger, report rendering, gap rows, and prompt helper functions each reconstruct requirement/edge status from ad hoc surface reads inside `traceability.py`
closure_law: closes only when obligation-ledger carry and requirement closure are produced by one source carrier, old helper paths are removed or demoted, repeated traversal cannot be caused by disagreement between ABG edge closure and odd_sdlc obligation carry, and mixed monolith/new seam proofs do not count
evaluation_criteria:
  - requirement identity and carried/fulfilled IDs are published by one traceability index or closure carrier
  - declared obligation gaps are pure projections over that carrier, not independent filesystem rescans with separate semantics
  - FD checks, gap dossier construction, query-domain, and prompt/report contexts consume the carrier or a single projection function
  - report rendering and markdown context generation do not own closure decisions
  - stale generated surfaces that omit `REQ-*` carry fail closed or are repaired at the source constructor boundary
non_closure_conditions:
  - `traceability.py` still acts as a monolithic semantic center for scan, query, ledger, and report assembly
  - any consumer can compute requirement carry from raw markdown independently of the carrier and still pass as normal proof
  - declared obligation closure can disagree with ABG `edge_converged` and cause repeated traversal of a closed edge
  - prompt/report surfaces imply requirement closure not present in the carrier
  - stale yield/usecase proofs still depend on old traceability or raw `gaps` behavior as closure evidence
proof_surface:
  - focused traceability/requirement-closure tests
  - public gap-dossier tests over requirement carry
  - yield-lane forensic proof that software-mode generated surfaces carry `REQ-*` IDs and no longer repeatedly reopen closed scenario/feature edges for missing carry
---

## Migration Declaration

- old_truth_path: `traceability.py` mixes raw filesystem scan, requirement ID
  extraction, requirement closure register assembly, declared obligation ledger
  computation, query helpers, and markdown report rendering; callers choose
  whichever helper is convenient and can silently produce split truth
- new_truth_path: one traceability/requirement-closure carrier owns requirement
  identity, surface claim refs, carry status, fulfillment status, and blocking
  obligations; downstream helpers project from that carrier only
- producers_old:
  - `traceability_scan(...)`
  - `build_requirement_closure_register(...)`
  - `declared_requirement_edge_gap(...)`
  - scattered `*_claim_refs(...)` helpers
  - report/context rendering helpers
- producers_new:
  - traceability index builder
  - requirement closure carrier builder
  - declared obligation ledger projector over the carrier
- consumers_old:
  - FD checks
  - gap dossier/span analysis
  - query-domain/read model
  - prompt context and markdown reports
  - usecase proof assertions
- consumers_new:
  - FD checks
  - gap dossier/span analysis
  - query-domain/read model
  - prompt/report renderers as pure projections
  - usecase proof assertions over carrier truth

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [ ] old truth path is removed or explicitly demoted from authority
- [ ] mixed-state behavior is no longer accepted as closure evidence
- [ ] tests proving mixed old/new behavior are removed or repriced
- [ ] ticket wording, product wording, and proof claims are reconciled before closure

## Functional Review Criteria

Every implementation and review pass must ask:

1. Did the slice reduce the traceability semantic center, or only move helpers
   into new files while preserving independent reads?
2. Is requirement identity a closed carrier consumed by downstream code, or an
   open set of markdown scans each caller can reinterpret?
3. Is the declared obligation ledger a pure projection over the carrier, or a
   second closure engine?
4. Do FD checks, gap dossiers, query-domain, and prompt/report contexts consume
   the same closure truth?
5. Can removing the carrier make requirement/obligation closure impossible,
   rather than merely falling back to raw helper functions?
6. Are generated source surfaces repaired at the constructor/source boundary
   when they miss requirement carry, instead of patched in tests or reports?
7. Does ABG edge closure stay aligned with odd_sdlc carry closure so closed
   edges cannot reopen from stale local traceability truth?
8. Are proof lanes repriced to carrier truth rather than raw `REQ-*` scraping
   expectations?

Passing tests do not satisfy this section if the old monolith and the new seams
both remain authoritative in normal execution.

## Required Break Order

1. Publish or isolate the traceability index carrier for requirement refs and
   surface claim refs.
2. Rebind requirement closure register assembly to that carrier.
3. Rebind declared obligation ledger computation to the closure carrier.
4. Rebind FD checks and gap dossier/span analysis to the same projected ledger.
5. Split report and prompt context rendering into pure projections with no
   closure decisions.
6. Reprice usecase and installation tests away from raw markdown/helper truth
   and toward carrier-obligation evidence.
7. Remove or demote legacy helper paths that still act as independent authority.

## Break-To-Closure Map

- Breaks 1-2 close the requirement identity/source-carrier clause.
- Breaks 3-4 close the obligation ledger and FD/gap consumer clause.
- Break 5 closes the report/prompt projection clause.
- Breaks 6-7 close the proof and bridge-removal clause.

## Mixed-State Negative Proof

Closure requires a negative proof that a missing or stale traceability carrier
does not let FD checks, gap dossiers, query-domain, or prompt/report contexts
reconstruct requirement carry from raw markdown and pass. If a generated asset
omits live `REQ-*` carry, the failure must surface at the source constructor or
carrier boundary, not as an infinite traversal loop.

## Why This Ticket Exists

`build_tenants/python/code/odd_sdlc/traceability.py` still mixes:

- traceability scanning and index build
- requirement closure / obligation-ledger assembly
- query helpers and report rendering

That module is now too large for one mixed realization seam.

## Required Direction

1. Split traceability scan/index build from report assembly.
2. Split report/query helpers from obligation-ledger publication.
3. Preserve one published requirement-closure truth while decomposing the
   implementation.

## Acceptance

- traceability index build, query helpers, and report/register rendering live
  in explicit seams
- current requirement-closure and traceability publication remain singular
- closed ABG edges are not reopened by a separate odd_sdlc obligation-carry
  read path
- software-mode generated surfaces carry live `REQ-*` authority through the
  source constructor boundary

## Implementation Notes - 2026-04-21

This pass fixed the observed live traversal failure without changing the ticket
closure bar.

- `derive_code_surface` materialization no longer deletes existing tenant
  surfaces. Generated files may be overwritten, but governance roots such as
  `design/`, `docs/`, `specification/`, `.ai-workspace/`, `.genesis/`,
  `test_env/`, and `workspaces/` are protected from generated writes and are not
  removed during construction.
- The yield use-case proof now prices the first lawful post-materialization gap
  at `derive_code_surface`, where generated code must carry live `REQ-*`
  authority. The earlier `derive_implementation_design_surface` expectation was
  stale after no-delete materialization made that edge satisfy its own FD
  recheck.
- ABG traversal selection now skips event-certified `(edge, work_key)` pairs
  when planning recursive frontier candidates and next traversal work.
- ABG terminal probes and gap projection now skip certified edges instead of
  recomputing deterministic bindings for already-closed work.
- `odd_sdlc query-assets` now provides a lightweight asset-binding query path,
  and bootstrap sanitization only strips stale asset-binding contracts that
  still invoke `query-domain`.
- F_P result ingest now runs the manifest FD recheck after materialization,
  records `fd_recheck_passed` / `fd_recheck_failures` in the ledger, and yields
  an observer handoff through events instead of allowing post-write FD failures
  to be hidden behind a converged edge.

Proof run after these fixes:

- `test_odd_sdlc_fd_evidence.py`: 24 passed.
- `test_odd_sdlc_yield_usecase.py`: 5 passed in 653.92s.
- Targeted yield-chain proof:
  `test_data_mapper_yield_chain_surfaces_asset_event_and_result_truth`: passed
  in 42.03s.

Remaining closure review:

- The ticket is still active. These fixes remove the deletion/re-entry failure
  and the certified-edge replay defects, but completion still requires the full
  Break-To-Closure review that the traceability index, query, report, FD, gap,
  and prompt-context seams now share one obligation-ledger carrier rather than
  reconstructing requirement truth independently.
