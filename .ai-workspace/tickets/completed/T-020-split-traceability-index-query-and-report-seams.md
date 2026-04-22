---
id: T-020
title: Split traceability index build, query, and report rendering into explicit seams
type: chore
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: keep odd_sdlc traceability and requirement-closure logic reviewable without one giant mixed-concern traceability module
change_intent: Replace the current mixed `traceability.py` surface with explicit index-build, obligation-ledger, query, and report seams while preserving one published requirement-closure truth and eliminating repeated edge re-entry caused by stale or split obligation carry
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc requirement closure register, traceability scan, obligation-ledger publication, and traceability query/report cohesion
priority: medium
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-22
dependencies:
  - odd_sdlc T-022 completed
  - odd_sdlc T-023 completed
  - ABG 3.2.0 runtime carrier line completed
old_path_classification: traceability.py mixed scan/register/ledger/report helpers, FD raw-helper imports, span/gap open-dict closure rows, and prompt/report closure wording = replace; query/report read models retained only as pure projections after carrier rebinding
governing_design:
  - ABG 3.2.0 runtime carrier and event-first line
  - ABG ADR-034 runtime execution law is carrier and event owned
  - ABG ADR-036 runtime advancement uses execution basis and advancement transition
  - odd_sdlc requirement-closure carrier and projection boundary
  - odd_sdlc T-020 impacted-interface review checklist
constitutional_requirements:
  - REQ-F-ODDSDLC-004
  - REQ-F-ODDSDLC-026
  - REQ-F-ODDSDLC-029
  - REQ-F-ODDSDLC-030
  - REQ-F-ODDSDLC-031
authoritative_contract: odd_sdlc requirement-closure / obligation-ledger carrier, public gaps/query read models, FD proof checks, and prompt/report projections remain public surfaces while their source truth migrates to one carrier
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
- projection_read_model_surfaces:
  - published requirement-closure register read model
  - requirement-closure prompt context markdown
  - query-domain `requirement_closure_register` payload
  - public `gaps` canonical gap rows and aggregate closure summary
  - `span_analysis.py` canonical span rows and aggregate closure summary
  - gap dossier register and markdown context
  - repair frontier register and prompt context
  - traceability report markdown rendering

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

1. Make `RequirementTraceabilityIndex` load-bearing: scan, requirement-family
   publication, expected/missing/unexpected derivation, and source-scan
   projections must be index-owned rather than freestanding helper authority.
2. Rebind `build_requirement_closure_register(...)` to a prebuilt index so the
   register does not rescan or recompute through helper functions after the
   carrier exists.
3. Rebind declared obligation-ledger computation to the same carrier/register so
   edge carry and fulfillment are pure projections rather than a second engine.
4. Rebind F_D checks, constructor/proving-subset selection, and gap/span
   consumers to that same carrier/projection family.
5. Fail close query/prompt/report consumers when the published carrier is
   missing or stale; do not silently rebuild current truth on read paths.
6. Remove or explicitly justify compatibility shims and residual helper paths
   that still act as independent authority.
7. Reprice usecase and installation tests toward carrier-obligation evidence and
   add mixed-state negative proof over all named public consumers.

## Break-To-Closure Map

- Breaks 1-2 close the requirement identity/source-carrier clause.
- Break 3 closes the declared-obligation pure-projection clause.
- Break 4 closes the F_D / constructor / gap consumer clause.
- Break 5 closes the fail-closed query/prompt/report clause.
- Breaks 6-7 close the proof and bridge-removal clause.

## Old Seam Inventory By Break

- Break 1 severs freestanding traceability helper authority outside
  `RequirementTraceabilityIndex`, so expected/missing/unexpected derivation and
  source-scan publication stop acting as independent live truth.
- Break 2 severs closure-register rebuild authority inside
  `build_requirement_closure_register(...)`, so the register cannot recompute
  closure through helper scans after the carrier exists.
- Break 3 severs declared obligation as a second closure engine, so
  `declared_requirement_edge_gap(...)`,
  `obligation_gap_from_declaration(...)`, and
  `collect_declared_obligation_gaps(...)` cannot rescan or reinterpret
  requirement truth outside the carrier/register family.
- Break 4 severs downstream consumer-local closure interpretation, so
  `fd_checks.py`, constructor requirement selection, `app.gaps(...)`, and
  `span_analysis.py` cannot consume raw helper truth or open dict rows as an
  independent authority path.
- Break 5 severs read-path rebuild fallback, so query, prompt, and report
  consumers cannot silently rebuild current requirement/closure truth when the
  published carrier is stale or missing.
- Break 6 severs residual compatibility/helper authority, so `traceability.py`
  and any remaining helper or facade paths are removed or explicitly demoted
  from authority.
- Break 7 severs stale mixed-state proof, so tests and usecase lanes cannot
  certify closure through raw helper scraping, legacy facade bypass, or mixed
  old/new behavior.

## Per-Break Negative Proof

- Break 1: if the index-backed carrier methods are unavailable, downstream
  derivation does not fall back to freestanding helper authority.
- Break 2: a closure-register build without the prebuilt index cannot silently
  rescan current truth and still count as the same closure surface.
- Break 3: declared obligation projection cannot compute carry/fulfillment from
  raw scans when the carrier/register path is absent or intentionally
  contradicted.
- Break 4: named consumers (`fd_checks.py`, constructor selection,
  `app.gaps(...)`, and `span_analysis.py`) fail closed or honor carrier truth
  when raw helper truth is intentionally divergent.
- Break 5: query-domain, requirement-closure read model, prompt context, and
  report surfaces return unavailable/fail closed when publication is stale or
  missing instead of rebuilding current truth.
- Break 6: legacy facade/helper paths are unreachable or explicitly
  non-authoritative in normal execution.
- Break 7: tests that pass only through mixed old/new truth, raw `REQ-*`
  scraping, or facade bypass are removed, repriced, or converted into negative
  proof.

## Impacted Interface Review Checklist

Every implementation and review pass must walk this list before tests are used
as closure evidence. A checked item means the interface consumes the published
traceability / requirement-closure carrier, or is explicitly demoted to a pure
projection over that carrier. A path that can still reconstruct requirement
identity, carry, fulfillment, or closure from raw markdown/helper reads blocks
ticket closure.

- [x] `RequirementTraceabilityIndex` / `build_requirement_traceability_index(...)`
  owns requirement refs as source input without becoming a second closure engine.
- [x] `build_requirement_closure_register(...)` consumes the carrier and does
  not recompute closure through independent `traceability_scan(...)` /
  `missing_*` helper paths.
- [x] `declared_requirement_edge_gap(...)`,
  `obligation_gap_from_declaration(...)`, and
  `collect_declared_obligation_gaps(...)` are pure projections over the
  requirement-closure carrier.
- [x] `fd_checks.py` consumes carrier/projection truth for all traceability and
  obligation-ledger checks; it does not import raw traceability helpers as
  authority.
- [x] `span_analysis.py` consumes typed carrier/projection rows and does not
  aggregate open dict graph/ledger rows into an independent closure decision.
- [x] `app.gaps(...)` and gap dossier construction publish one carrier-derived
  closure truth; ABG `edge_converged` and odd_sdlc carry closure cannot disagree
  silently.
- [x] `query_requirement_closure_register(...)`, `query-domain`, and
  `query-assets` expose read models only and do not decide carry, fulfillment,
  or closure.
- [x] `analysis.refresh_analysis(...)` republishes carrier truth and prompt
  contexts without re-running old helper closure logic.
- [x] `traceability_report.py` and requirement prompt-context builders render
  carrier truth only; report wording cannot imply closure absent from the
  carrier.
- [x] `repair_frontier.py` and repair/gap routing consume the same carrier truth
  as FD checks and gap dossiers.
- [x] constructor surfaces that generate requirement, design, code, or test
  assets preserve live `REQ-*` carry at the source boundary rather than patching
  it in reports or tests.
- [x] proof lanes cover a mixed-state negative case: removing or corrupting the
  carrier makes FD checks, gap dossiers, query-domain, and prompt/report
  contexts fail closed instead of falling back to raw helper truth.

## Mixed-State Negative Proof

Closure requires a negative proof that a missing or stale traceability carrier
does not let FD checks, gap dossiers, query-domain, or prompt/report contexts
reconstruct requirement carry from raw markdown and pass. If a generated asset
omits live `REQ-*` carry, the failure must surface at the source constructor or
carrier boundary, not as an infinite traversal loop.

## Reopened After Closure Review - 2026-04-22

T-020 was closed too early. The split landed, but the closure claim violated the
 inside-out migration bar because mixed authority still passed on the current
 tree.

Confirmed closure defects:

- `build_requirement_closure_register(...)` still rebuilt closure through helper
  scans and missing/unexpected helper paths after the carrier existed.
- declared obligation closure still acted as a second engine through helper
  reads and source scans, and that path fed `app.gaps(...)` and
  `span_analysis.py`.
- `fd_checks.py` still imported raw traceability helpers as live authority.
- query/read-model consumers still rebuilt from workspace scans when the
  published carrier was absent or stale instead of failing closed.
- constructor planning still imported raw traceability helpers for requirement
  selection.
- the cited negative proof only proved that the legacy `traceability.py` facade
  was bypassed; it did not prove that the live authority path failed closed when
  the carrier was missing or corrupted.

Current reopening rule:

- this ticket remains active until the checked interface list is true on the
  current tree and the negative proof covers the named public consumers
  (`fd_checks.py`, gap/query surfaces, and prompt/report readers).

## Why This Ticket Exists

`build_tenants/python/code/odd_sdlc/traceability.py` mixed:

- traceability scanning and index build
- requirement closure / obligation-ledger assembly
- query helpers and report rendering

That module became too large for one mixed realization seam.

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

## Progress Notes - 2026-04-22

Structural carrier migration now landed on the current tree:

- `RequirementTraceabilityIndex` now stores source scan and requirement-family
  publication and owns expected/missing/unexpected derivation helpers as
  index-backed methods rather than free authority paths.
- `build_requirement_closure_register(...)` now builds from one prebuilt index
  through `_build_requirement_closure_register_from_index(...)` instead of
  rebuilding through helper scans after the carrier exists.
- `declared_requirement_edge_gap(...)` now projects expected/carried/extra ids
  from that same index/register family instead of rescanning workspace state as
  a separate engine.
- `fd_checks.py` and constructor requirement-selection now build one
  `RequirementTraceabilityIndex` and consume that carrier instead of importing
  raw traceability helper authority.
- public requirement-closure read paths now split builder from reader:
  query/read-model surfaces consume a published register read model and return
  an explicit unavailable projection when analysis is unpublished or stale;
  they no longer rebuild current truth on read.
- prompt-context building now requires an explicit register payload and no
  longer rescans the workspace when called without one.
- `span_analysis.py` now projects raw graph rows and declared obligation rows
  into typed carrier families before canonical edge-gap and aggregate closure
  truth is computed.
- `gap_dossier.py` now consumes typed canonical edge-gap projections and the
  aggregate truth summary instead of taking dict-shaped closure truth as its
  semantic input.
- `repair_frontier.py` now consumes an explicit requirement-closure register and
  explicit repair-frontier payload for prompt-context rendering instead of
  rebuilding truth implicitly.
- `app.gaps(...)` now fails closed when declared-obligation carrier truth is
  unavailable instead of silently degrading to graph-only closure.
- constructor requirement-authority lines now read directly from
  `RequirementTraceabilityIndex.authority_refs` rather than through a stale
  helper name.
- free helper proxies exported from `traceability_index.py` and
  `requirement_closure.py` are removed; the source carrier is no longer
  shadowed by a second helper-shaped API.
- `traceability.py` is now a bounded compatibility facade with explicit exports
  instead of a wildcard mirror over the new carrier/projection modules.
- source-style installation proof now prices `query-domain` as a read-model
  surface: without published analysis it returns an unavailable
  `requirement_closure_register` projection instead of rebuilding current truth.

New proof added in this slice:

- `test_requirement_closure_prompt_context_requires_explicit_register`
- `test_repair_frontier_prompt_context_requires_explicit_frontier`
- `test_gap_dossier_projects_typed_input_from_canonical_gap_carriers`
- `test_gaps_fail_closed_when_declared_obligation_carrier_is_unavailable`
- `test_query_domain_is_read_only_when_analysis_has_not_been_published`
- `test_t020_fd_and_closure_fail_closed_when_traceability_index_carrier_is_unavailable`
- F_P result ingest now runs the manifest FD recheck after materialization,
  records `fd_recheck_passed` / `fd_recheck_failures` in the ledger, and yields
  an observer handoff through events instead of allowing post-write FD failures
  to be hidden behind a converged edge.
- Software-mode generated test-design surfaces now carry planned `REQ-*`
  authority through explicit `Validates:` tags and a requirement-carry section,
  so the post-materialization FD recheck evaluates the same requirement identity
  the constructor claimed in the F_P result.
- The `query-assets` command and bootstrap sanitization landed as in-flight
  hygiene during this pass. Formal ownership of source-runtime asset-binding
  authority belongs to T-024 Break 1; this note records the behavioral landing
  that enabled the yield-lane proof.
- The certified-edge skip, terminal-probe, gap-projection, and F_P result-ingest
  FD recheck fixes are upstream ABG 3.2.0 substrate changes consumed by
  odd_sdlc. T-020 owns the odd_sdlc-side traceability/obligation carrier split.
- T-020 Break 4 produces the obligation-ledger carrier that T-024 Break 6 must
  consume alongside the execution-contract admission carrier.

Proof run after these fixes:

- `test_odd_sdlc_fd_evidence.py`: 24 passed.
- `test_odd_sdlc_yield_usecase.py`: 5 passed in 653.92s.
- Targeted yield-chain proof:
  `test_data_mapper_yield_chain_surfaces_asset_event_and_result_truth`: passed
  in 42.03s.
- Targeted first-slice carrier/query/gap/repair bundle: 10 passed,
  58 deselected.
- Targeted installation read-model / source-style proof bundle: 7 passed,
  25 deselected.
- Post-facade bounded-compatibility sanity bundle: 3 passed, 24 deselected.

Closure disposition:

- The broader T-020 proof surface named by the ticket is now green on the
  current tree.
- The inside-out break order is satisfied through Break 7: source carrier,
  closure register, declared obligation projection, downstream consumers,
  fail-closed read paths, bounded compatibility facade, and repriced mixed-state
  proof are all landed.
- T-020 now closes as completed.

## Contract Assurance Residuals - 2026-04-21

The ABG 3.2 / B-027 review bar requires a direct consumer walk before this
ticket can close. Passing tests do not count if any consumer still reconstructs
requirement or obligation truth from raw helpers.

Required residual audit:

- `fd_checks.py` must not import or call raw traceability helpers as authority.
  It must consume the published traceability / requirement-closure carrier or a
  single projection over that carrier.
- `span_analysis.py` and gap dossier construction must not aggregate open dict
  rows as independent closure truth. Rows may be read models only after the
  obligation carrier owns the closure decision.
- `query-domain` may project traceability, requirement closure, and gap dossier
  truth, but it must not become a second closure engine.
- prompt/report rendering helpers may render the carrier; they must not decide
  carry, fulfillment, or closure.
- mixed-state negative proof must show that removing or corrupting the carrier
  prevents FD checks, gap dossiers, query-domain, and prompt/report contexts from
  passing through raw markdown/helper fallback.

Out of scope for T-020:

- typed execution-contract carrier and graph-owned admission binding
- source runtime `query-assets` binding fallback
- work-item `route_contract` publication on the asset carrier

Those surfaces are tracked by successor ticket T-024 because they extend the
completed T-023 execution-contract migration rather than the traceability split.

## Closure Evaluation - 2026-04-22

T-020 is closure-ready on the current tree.

Real landed progress:

- `traceability_index.py` now owns the source carrier inputs and index-backed
  derivation helpers.
- `requirement_closure.py` now builds the closure register from one prebuilt
  index and projects declared edge gaps from that same source carrier.
- `traceability.py` is demoted to a compatibility facade only. Normal runtime
  code no longer imports it or publishes `odd_sdlc.traceability:*` adapter refs.
- `traceability.py` is now bounded to explicit compatibility exports rather
  than wildcard re-exports over the carrier/projection modules.
- `fd_checks.py` and `constructor.py` now consume the traceability index rather
  than importing raw helper authority.
- `query-domain` now reads the published requirement-closure read model and no
  longer rebuilds current truth on the public read path when analysis is stale
  or unpublished.
- `span_analysis.py` now consumes typed graph-gap and declared-obligation
  projections before canonical gap truth is computed.
- `gap_dossier.py` now consumes typed canonical gap projections and aggregate
  summary truth instead of dict-shaped closure semantics.
- prompt/report surfaces now fail closed through explicit register/frontier
  inputs rather than rebuilding current truth implicitly.
- `gaps()` now fails closed when declared-obligation carrier truth is
  unavailable.
- free helper wrappers that previously mirrored carrier methods in
  `traceability_index.py` / `requirement_closure.py` are removed, and tests now
  exercise the carrier methods directly.

Closure evidence:

- impacted-interface checklist: satisfied on the current tree.
- mixed-state negative proof: satisfied through carrier-unavailability and
  fail-closed read-model tests.
- broader proof surface: green across focused first-slice, FD evidence,
  installation read-model/source-style, and full yield/usecase bundles.

Current proof disposition:

- targeted read-boundary, gap-dossier, repair-frontier, query-domain, and
  mixed-state negative proofs are green for this slice.
- they are sufficient to confirm the structural migration on the current tree.
- the repriced installation and yield/usecase bundles now extend that proof to
  the named public read-model and carry surfaces, so the ticket no longer has
  an open proof or bridge-removal blocker.
