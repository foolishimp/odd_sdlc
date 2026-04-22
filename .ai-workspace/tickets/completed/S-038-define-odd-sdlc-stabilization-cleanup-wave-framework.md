# S-038 Define odd_sdlc Stabilization Cleanup And Lawful Traversal Framework

- id: S-038
- title: Define odd_sdlc stabilization cleanup and lawful traversal framework
- type: spike
- ticket_category: ordinary
- status: completed
- goal: odd_sdlc-core-stabilization
- change_intent: turn the S-037 review findings into a durable cleanup-wave framework with explicit dependency order, fault classes, refactor boundaries, and lawful traversal steel threads so the next odd_sdlc fixes follow one stable design map instead of ad hoc bug patching
- change_class: design_reframe
- re_entry_point: design_surface
- triaged_at: 2026-04-23
- created_at: 2026-04-23
- updated_at: 2026-04-23
- priority: high
- dependencies:
  - S-037
- links:
  - `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
  - `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
  - `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/S-037-review-odd-sdlc-core-domain-model-sequence-fault-lines.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T140500Z_S037_01_core_domain_model.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T141000Z_S037_02_source_carriers_and_closure.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T141500Z_S037_03_homeostatic_triage_and_dossiers.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T142000Z_S037_04_public_control_and_admission.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T142500Z_S037_05_projections_and_materialization.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T143000Z_S037_06_fault_line_synthesis.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004227Z_REVIEW_s037-02-start-admission-family.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004228Z_REVIEW_s037-03-public-control-and-query-family.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004229Z_REVIEW_s037-04-homeostatic-and-publication-family.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004230Z_REVIEW_s037-05-traceability-closure-and-gap-kernels.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004231Z_REVIEW_s037-06-constructor-materialization.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T004232Z_MATRIX_s037-fault-line-synthesis.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T000000Z_REVIEW_s037-01-core-domain-model.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T000100Z_REVIEW_s037-02-public-control-cluster.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T000200Z_REVIEW_s037-03-homeostatic-carrier-cluster.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T000300Z_REVIEW_s037-04-analysis-projection-cluster.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T000400Z_REVIEW_s037-05-closure-proof-cluster.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T000500Z_REVIEW_s037-06-constructor.md`
  - `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260423T000600Z_MATRIX_s037-07-fault-line-synthesis.md`

## Context

S-037 established that the current odd_sdlc instability is not random bug
churn and not mainly GTL config drift.

The repeated break pattern is:

- a lawful source carrier or published read model exists
- one public wrapper, control path, or helper still reinterprets or bypasses it
- semantic authority becomes split between carrier truth and controller logic
- the defect then appears only in a sandbox, install, or event-forensic review

The current wave therefore needs a cleanup framework before more bug-local
patches accumulate.

This framework is exhaustive by design. It treats the reviewed odd_sdlc core as
one migration surface whose lawful code paths must be walked explicitly.

The goal is not only to name file families. The goal is to name the legitimate
runtime and publication traversals that a correct odd_sdlc line must preserve
while old controller-owned or mixed-authority seams are severed.

## Framework Purpose

This ticket does not implement the cleanup itself.

It defines the cleanup wave as a governed sequence so later implementation
tickets can be opened, repriced, and closed in dependency order.

It also defines the steel-thread traversal map for the migration:

- every lawful core path is named
- every path has an authoritative carrier and owning file family
- every path can be walked end-to-end as part of the cleanup
- no migration is treated as complete until the valid path still works and the
  superseded path fails closed

The framework must preserve the design method position from S-037:

- GTL owns publication/catalog topology
- ABG owns generic runtime/process law
- odd_sdlc owns domain-governance, homeostatic classification, public start/gap
  control, constitutional re-entry, and software-domain projections

## Reconciled Review Baseline

This framework consumes two S-037 review corpora:

- the later consolidated review posts
- the earlier backup family reviews and synthesis matrix

S-038 is the reconciled baseline over those inputs.

The corpora do not remain as rival authorities once their findings are folded
here. If they differ in emphasis, this ticket resolves the difference by
adopting the stricter inside-out reading and the sharper closure blocker.

Once reconciled here, later references to the review posts are evidence handles
only. The cleanup framework in this ticket is the single authority for lane
order, traversal ownership, and fault-class normalization.

The backup review corpus added several findings that the reconciled baseline
keeps explicitly:

- the public-control cluster still contains critical B-035/B-036 fault lines
  beyond the already-landed slices
- the next cleanup wave should think in terms of named fault ids and lawful
  traversals, not only file families

## Additional Findings Adopted Into The Baseline

The backup S-037 review corpus introduced these additional framework-level
findings, and S-038 adopts them as part of its baseline:

- the review corpus names `F-01 … F-57`, with some ids retired during
  consolidation; the important point for this framework is not the exact count
  but that the fault set is large enough that migration work must be traversal-
  based rather than anecdotal
- critical finding `F-01`: the public head-gap consult is still too narrow if it
  only protects `target == "next"`; B-035 must be treated as a public-start
  admission law, not a one-target patch
- critical findings `F-02/F-03/F-04`: yield-vs-failure projection in
  `_run_public_next_start` is the B-036 defect surface
- recommended follow-on tickets from the backup corpus:
  - `B-037`: typed `PublicStartIterationOutcome` carrier, optional fold into
    B-036
  - `B-038`: `refresh_analysis` atomicity
  - `B-039`: constitutional-surface write discipline
- the backup corpus also proposes a seven-step typed-carrier refactor slice
  after B-035/B-036 land:
  - `EdgeTriageProjection`
  - `TriageCase` ADT
  - `FulfillmentRule` / `DerivationRule` enums
  - `RequirementEntry` carrier
  - shared gap-surface builder
  - extracted `ReleaseAssessment`
  - capability-gap unification

## Active Consumer Tickets

This framework is upstream guidance for the active repair tickets. The current
primary consumers are:

- `B-035`
- `B-036`

Those tickets are not prerequisites for this framework. They are expected to
consume it.

## Target Truth

The odd_sdlc stabilization wave proceeds as one explicit cleanup framework:

1. remove controller bypasses of published carriers
2. stabilize homeostatic identity and reprojection
3. keep admission and target-binding hard breaks explicit
4. keep projections read-only and fail-closed
5. defer large file or convenience refactors until semantic ownership is stable
6. verify all legitimate core traversals as steel threads while old paths are
   being severed

## Superseded Truth

Fixing odd_sdlc as a sequence of isolated wiring bugs without a named category
map, boundary model, or dependency order.

## Closure Law

This ticket closes only when the cleanup framework is explicit enough that a
later implementor can open or reprice focused tickets without rediscovering the
same ownership questions.

That means this ticket must leave behind:

1. named cleanup lanes
2. the dependency order between those lanes
3. the file families owned by each lane
4. the failure categories each lane is intended to remove
5. explicit non-goals so the wave does not collapse into premature convenience
   refactors
6. a lawful traversal checklist mapping the valid migration paths that must be
   walked during the cleanup
7. an explicit steel-thread rule: valid paths must remain operable while old
   paths fail closed

This ticket is not closure evidence for the underlying bugs. Those remain in
their own repair tickets.

## Evaluation Criteria

- the cleanup wave is divided into bounded lanes with explicit file ownership
- each lane is classified by the S-037 fault categories
- the sequence order starts at the highest-risk semantic-center surfaces and
  moves outward
- the framework distinguishes semantic cleanup from later convenience/file-size
  cleanup
- the framework clearly states what should not be touched until earlier lanes
  land
- later bug tickets can cite this framework without inventing a new ordering
- the framework names each valid core traversal as a migration path
- each traversal names its authoritative carrier, owning files, and the old seam
  that must fail closed

## Non-Closure Conditions

This ticket remains open if:

- the wave is still described only as “clean up wiring”
- file-size refactors are mixed into semantic hard-break work
- GTL, ABG, and odd_sdlc boundary ownership are blurred again
- control-surface fixes are attempted before the carrier boundary is named
- the framework does not explain which cleanup classes are primary and which are
  secondary
- the valid core traversals are not mapped explicitly
- migration work closes a bug without proving the old path is severed and the
  lawful steel thread still works

## Proof Surface

- this ticket records the cleanup lanes and sequence
- S-037 comment set remains the review evidence for the named fault lines
- later implementation tickets must cite the specific lane they are landing
- this ticket carries the lawful traversal checklist for steel-thread review

## Critical Ticket Mapping From The Review Corpus

### B-035

Treat B-035 as the public-start head-gap admission law, not as a `target == next`
only patch.

Framework implication:

- B-035 directly owns traversal hardening for:
  - `T3`
  - `T5`
  - `T6`
  - `T7`
  - and any other public-start admission path that admits execution while a
    published head gap is still blocked

### B-036

Treat B-036 as the public continuation/yield projection law at the odd_sdlc
boundary.

Framework implication:

- B-036 directly owns traversal hardening for:
  - `T13`
  - `T14`
- if a typed public-start iteration carrier is needed to land B-036 cleanly,
  that carrier may either:
  - be introduced inside B-036, or
  - be split into `B-037` if narrower ticketing helps the migration

### Recommended Follow-On Tickets

The framework accepts the backup review’s recommended follow-ons as lawful next
tickets if they are still needed after B-035/B-036 land:

- `B-037`: typed `PublicStartIterationOutcome` carrier
- `B-038`: `refresh_analysis` atomicity
- `B-039`: constitutional-surface write discipline

## Lawful Traversal Checklist

All valid paths below must be walked during the cleanup wave. A path is only
considered migrated when:

- the authoritative carrier is still the source of meaning
- the end-to-end path still works
- the superseded seam is blocked, rejected, or no longer authoritative

### T1: Analysis Publication And Readiness Gate

- [ ] walk `refresh_analysis(...) -> write_analysis_manifest(...) -> write_workspace_state(...) -> ensure_workspace_ready(...)`
- owning files:
  - `analysis.py`
- authoritative carrier:
  - published analysis manifest
  - published workspace state
- superseded seam to sever:
  - ad hoc readiness inference outside published analysis state

### T2: Gap Publication Steel Thread

- [ ] walk `app.gaps(...) -> _build_gap_surface(...) -> triage.enrich_gap_snapshot(...) -> gap_dossier.build_gap_dossier_register(...) -> publish_gap_dossier_surfaces(...) -> project_gap_dossier_surface(...)`
- owning files:
  - `app.py`
  - `triage.py`
  - `gap_dossier.py`
  - `span_analysis.py`
  - `requirement_closure.py`
- authoritative carrier:
  - published gap dossier read model
- superseded seam to sever:
  - private controller reconstruction of the head gap

### T3: Public `next` Blocked Head-Gate Path

- [ ] walk `start(target=next) -> load_gap_dossier_read_model(...) -> project_public_next_start_resolution(...) -> PendingConstitutionalStartGate/PublicNextStartBlock`
- owning files:
  - `app.py`
  - `gap_dossier.py`
- authoritative carrier:
  - published gap dossier head-dossier projection
- superseded seam to sever:
  - `next` admission without published head-gap authority

### T4: Constitutional Human-Proxy Apply And Re-entry Path

- [ ] walk `pending_fh -> apply_constitutional_proposal(...) -> proposal_applied -> refresh_analysis(...) -> republished head-gap truth`
- owning files:
  - `app.py`
  - `homeostatic_loop.py`
  - `triage.py`
  - `analysis.py`
- authoritative carrier:
  - current edge triage artifact + published refreshed homeostatic surfaces
- superseded seam to sever:
  - generic ABG FH approval helper standing in for odd_sdlc constitutional application

### T5: Public `next` Admitted Traversal Path

- [ ] walk `project_public_next_start_resolution(...) -> admit_bound_execution_start(...)`
- owning files:
  - `gap_dossier.py`
  - `execution_contract.py`
  - `start_targeting.py`
  - `app.py`
- authoritative carrier:
  - `PublicNextStartDirective`
  - admitted execution contract
- superseded seam to sever:
  - stale or guessed `next` intent admitted without one published directive

### T6: Explicit Graph-Function Start Path

- [ ] walk `public start(graph_function:...) -> published head-gap consult -> resolve_start_target(graph_function:...) -> derive_execution_contract_surface(...) -> admit_execution_contract_surface(...) -> bound_execution_start_from_contract(...)`
- owning files:
  - `app.py`
  - `start_targeting.py`
  - `execution_contract.py`
- authoritative carrier:
  - published head-gap carrier
  - published start target catalog
  - admitted execution contract
- superseded seam to sever:
  - raw graph-function inference outside the published catalog

### T7: Explicit Asset / Work-Item Start Path

- [ ] walk `public start(asset:...) -> published head-gap consult -> published_asset_ownership_index(...) -> resolve_start_target(asset:...) -> route_contract/admitted execution source -> bound start`
- owning files:
  - `app.py`
  - `start_targeting.py`
  - `execution_contract.py`
- authoritative carrier:
  - published head-gap carrier
  - published asset ownership index
  - work-item route contract when applicable
- superseded seam to sever:
  - implicit asset routing by controller convention

### T8: Requirement Closure Publication Path

- [ ] walk `build_requirement_traceability_index(...) -> _build_requirement_closure_register_from_index(...) -> build_requirement_closure_register(...) -> load_requirement_closure_register_read_model(...)`
- owning files:
  - `traceability_index.py`
  - `requirement_closure.py`
  - `analysis.py`
- authoritative carrier:
  - `RequirementTraceabilityIndex`
  - published requirement closure register
- superseded seam to sever:
  - fresh source-scan reconstruction in downstream public paths

### T9: Declared Obligation / Canonical Gap Kernel Path

- [ ] walk `collect_declared_obligation_gaps(...) -> canonical_edge_gaps(...) -> aggregate_edge_gap_truth(...) -> span_gap_analysis(...)`
- owning files:
  - `requirement_closure.py`
  - `span_analysis.py`
- authoritative carrier:
  - declared obligation gap projections
  - canonical edge-gap carriers
- superseded seam to sever:
  - raw dict convergence logic independent of the declared carrier family

### T10: Query Read-Only Projection Path

- [ ] walk `query_domain(...) -> catalog(...) -> load_gap_dossier_read_model(...) -> load_requirement_closure_register_read_model(...)`
- owning files:
  - `query.py`
  - `app.py`
  - `gap_dossier.py`
  - `requirement_closure.py`
- authoritative carrier:
  - published read models only
- superseded seam to sever:
  - query-time source-truth reconstruction

### T11: Repair Frontier Projection Path

- [ ] walk `build_repair_frontier_register(...) -> build_repair_frontier_prompt_context(...)`
- owning files:
  - `repair_frontier.py`
  - `analysis.py`
- authoritative carrier:
  - published requirement closure register
- superseded seam to sever:
  - repair frontier deciding requirement closure truth for itself

### T12: Constructor / Materialization Path

- [ ] walk `construct_manifest(...) -> _constructed_content(...) / _replace_generated_code_surface(...) -> asset_checkpoint_updated -> fp result payload`
- owning files:
  - `constructor.py`
- authoritative carrier:
  - admitted construction manifest
  - generated-asset attestation
- superseded seam to sever:
  - historical dual-shape materialization logic becoming ongoing semantic authority

### T13: Yielded Continuation Public Re-entry Path

- [ ] walk `public start -> ABG yield -> public yielded result -> continue command / resumed start -> lawful next step`
- owning files:
  - `build_tenants/python/code/odd_sdlc/app.py`
  - `build_tenants/python/code/odd_sdlc/execution_contract.py`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/continuation.py`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/run.py`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/cli_adapter.py`
- authoritative carrier:
  - yielded continuation contract
  - public yielded result path
- superseded seam to sever:
  - operator-facing failure projection for lawful continuation-owned yield

### T14: Public Admitted Iteration Projection Path

- [ ] walk `admitted execution basis -> gen_start(...) / dispatch/proof-hold handling -> public complete|yield|blocked projection`
- owning files:
  - `build_tenants/python/code/odd_sdlc/app.py`
  - `build_tenants/python/code/odd_sdlc/execution_contract.py`
  - `build_tenants/python/code/odd_sdlc/public_start.py`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/dispatch_runtime.py`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/result_ingest.py`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/run.py`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code/genesis/cli_adapter.py`
- authoritative carrier:
  - admitted execution contract
  - `YieldedContinuationContract`
  - `PublicStartIterationOutcome`
- superseded seam to sever:
  - result-dict string inspection as the public iteration semantic center

## Traversal-To-Fault-Line Mapping

This map turns the review corpus into a steel-thread checklist. Each traversal
below is where the named fault families should be expected and audited.

### T1 / T2 / T4

- dominant fault families:
  - unstable identity or refresh semantics
  - incorrect boundary ownership
  - effect leakage or hidden mutation
- review anchors:
  - `20260423T000200Z_REVIEW_s037-03-homeostatic-carrier-cluster.md`
  - `20260423T004229Z_REVIEW_s037-04-homeostatic-and-publication-family.md`

### T3 / T14 / T13

- dominant fault families:
  - incomplete migration
  - hidden semantic center
  - split-brain carrier vs controller authority
  - interface bleed
- review anchors:
  - `20260423T000100Z_REVIEW_s037-02-public-control-cluster.md`
  - `20260423T004228Z_REVIEW_s037-03-public-control-and-query-family.md`
  - `20260423T000600Z_MATRIX_s037-07-fault-line-synthesis.md`

### T6 / T7

- dominant fault families:
  - split-brain carrier vs controller authority
  - proxy compatibility authority
- review anchors:
  - `20260423T000100Z_REVIEW_s037-02-public-control-cluster.md`
  - `20260423T004227Z_REVIEW_s037-02-start-admission-family.md`

### T8 / T9 / T10 / T11

- dominant fault families:
  - interface bleed
  - lawful but over-coupled
  - split-brain carrier vs controller authority
  - hidden semantic center
- review anchors:
  - `20260423T000300Z_REVIEW_s037-04-analysis-projection-cluster.md`
  - `20260423T000400Z_REVIEW_s037-05-closure-proof-cluster.md`
  - `20260423T004230Z_REVIEW_s037-05-traceability-closure-and-gap-kernels.md`

### T12

- dominant fault families:
  - lawful but over-coupled
  - unstable identity or refresh semantics
  - hidden semantic center
- review anchors:
  - `20260423T000500Z_REVIEW_s037-06-constructor.md`
  - `20260423T004231Z_REVIEW_s037-06-constructor-materialization.md`

## Cleanup Lanes

### Lane 1: Homeostatic Carrier Publication And Identity Stability

- primary files:
  - `build_tenants/python/code/odd_sdlc/analysis.py`
  - `build_tenants/python/code/odd_sdlc/app.py`
  - `build_tenants/python/code/odd_sdlc/triage.py`
  - `build_tenants/python/code/odd_sdlc/gap_dossier.py`
  - `build_tenants/python/code/odd_sdlc/homeostatic_loop.py`
- primary fault classes:
  - incomplete migration
  - incorrect boundary ownership
  - hidden semantic center
  - unstable identity or refresh semantics
  - effect leakage or hidden mutation
- purpose:
  - keep homeostatic publication deterministic and identity-stable
  - keep dossier/head-gap truth published before public control consumes it
  - keep constitutional application odd_sdlc-owned and replay-safe
- expected result:
  - published homeostatic carriers become the stable upstream basis for later
    public-start and admission work
- traversal coverage:
  - T1
  - T2
  - T3
  - T4
- backup review emphasis:
  - proposal identity stability
  - route identity stability
  - replay-safe reprojection
  - `refresh_analysis` transactionality if `B-038` is opened

### Lane 2: Admission And Target-Binding Hardening

- primary files:
  - `build_tenants/python/code/odd_sdlc/execution_contract.py`
  - `build_tenants/python/code/odd_sdlc/start_targeting.py`
  - `build_tenants/python/code/odd_sdlc/app.py`
- primary fault classes:
  - incomplete migration
  - split-brain carrier vs controller authority
  - hidden semantic center
  - proxy compatibility authority
- purpose:
  - keep one admitted execution basis derived from published target authority
  - prevent raw or guessed public targets from bypassing the hard-break
    admission path
  - make the head-gap consult target-type-agnostic at admission time
- expected result:
  - all public execution admission stays carrier-first and explicit
- traversal coverage:
  - T5
  - T6
  - T7
- backup review emphasis:
  - `F-01`
  - fail-closed explicit target admission
  - target-type-agnostic head-gap consult

### Lane 3: Public Control And Continuation Projection Cleanup

- primary files:
  - `build_tenants/python/code/odd_sdlc/app.py`
  - `build_tenants/python/code/odd_sdlc/gap_dossier.py`
  - `build_tenants/python/code/odd_sdlc/execution_contract.py`
  - `build_tenants/python/code/odd_sdlc/public_start.py`
- primary fault classes:
  - hidden semantic center
  - interface bleed
  - split-brain carrier vs controller authority
  - effect leakage or hidden mutation
- purpose:
  - keep the post-admission public loop as thin orchestration over admitted and
    yielded carriers
  - consume admission truth from Lane 2 rather than reopening or reclassifying
    admission semantics inside public control
  - remove result-dict string inspection as the public iteration semantic
    center
- expected result:
  - public odd_sdlc start projects complete, blocked, and yield states from one
    lawful iteration outcome family
- traversal coverage:
  - T13
  - T14
- backup review emphasis:
  - `F-02`
  - `F-03`
  - `F-04`
  - typed public-start iteration outcome in `public_start.py`, with narrower follow-on ticketing only if later hardening still needs a separate slice

### Lane 4: Carrier Compression and Projection Discipline

- primary files:
  - `build_tenants/python/code/odd_sdlc/traceability_index.py`
  - `build_tenants/python/code/odd_sdlc/requirement_closure.py`
  - `build_tenants/python/code/odd_sdlc/span_analysis.py`
  - `build_tenants/python/code/odd_sdlc/query.py`
  - `build_tenants/python/code/odd_sdlc/repair_frontier.py`
- primary fault classes:
  - interface bleed
  - split-brain carrier vs controller authority
  - lawful but over-coupled
  - hidden semantic center
- purpose:
  - keep traceability and requirement closure as the sole source family
  - keep span, query, and repair-frontier surfaces as downstream projections
    only
- expected result:
  - public read models fail closed when source carriers are absent or stale, and
    no projection silently rebuilds source truth
- traversal coverage:
  - T8
  - T9
  - T10
  - T11
- backup review emphasis:
  - `refresh_analysis` transactionality if `B-038` is opened
  - typed rule families in `requirement_closure.py`

### Lane 5: Materialization Compression After Semantic Stabilization

- primary files:
  - `build_tenants/python/code/odd_sdlc/constructor.py`
- primary fault classes:
  - lawful but over-coupled
  - unstable identity or refresh semantics
  - hidden semantic center
- purpose:
  - compress or split constructor only after the upstream semantic lanes are
    stable
  - preserve one materialization boundary while separating honest roles if
    needed
- expected result:
  - constructor stays a constructor/materializer, not a place where route or
    requirement law is rediscovered
- traversal coverage:
  - T12
- backup review emphasis:
  - delete historical dual-shape logic before splitting for readability

## Required Lane Order

The cleanup wave runs in this order:

1. Lane 1: Homeostatic Carrier Publication And Identity Stability
2. Lane 2: Admission And Target-Binding Hardening
3. Lane 3: Public Control And Continuation Projection Cleanup
4. Lane 4: Carrier Compression and Projection Discipline
5. Lane 5: Materialization Compression After Semantic Stabilization

Reason:

- Lane 1 stabilizes the published homeostatic carriers and identity semantics
  that every later public-start path depends on
- Lane 2 hardens admission and target binding over those published carriers
- Lane 3 cleans up the downstream public-control and yield projection only after
  the admission basis is stable and no longer decided in controller glue
- Lane 4 then tightens downstream projections around the stabilized carriers
- Lane 5 is intentionally last so file-size refactors do not obscure active
  semantic bugs

## Explicit Non-Goals

This framework forbids the following until the earlier lanes land:

- broad file splitting for readability alone
- new wrapper/helper layers that preserve old authority paths behind new names
- moving odd_sdlc constitutional semantics into ABG substrate helpers
- fixing query or report output by silently rebuilding missing source truth
- treating constructor cleanup as the first stabilization task
- opening “refactor” tickets that do not name their traversal ids and fault
  classes

## Follow-On Ticket Rule

Every follow-on cleanup ticket in this wave should:

- cite the lane it belongs to
- name the exact fault class or classes from S-037
- state which old seam is being severed
- state which authoritative carrier or module remains after the break
- state which traversal ids from the checklist above are directly affected
- cite the adopted S-038 finding or lane rule it is implementing
- use underlying review posts only as evidence handles when needed, never as a
  parallel authority that reopens S-038’s reconciled baseline

No later ticket in this wave should use only “wiring issue” or “cleanup” as its
problem statement.

## Progress Notes

- 2026-04-23: opened to convert the S-037 review set into one durable
  stabilization cleanup framework for the next odd_sdlc ticket wave
- 2026-04-23: expanded to exhaustive scope; the ticket now treats the full S-037
  review corpus as input and maps the lawful core traversals as a steel-thread
  migration checklist
- 2026-04-23: incorporated the backup codex/claude S-037 corpus, including the
  named critical findings around `F-01` and `F-02/F-03/F-04`, the recommended
  B-037/B-038/B-039 follow-ons, and the traversal-to-fault-line mapping
- 2026-04-23: reconciled the framework after ticket-level review; normalized
  fault classes back to the S-037 taxonomy, kept B-035/B-036 as consumer
  tickets rather than dependencies, tightened B-036 to downstream public
  projection ownership, and made S-038 the single baseline over the dual review
  corpus
- 2026-04-23: tightened downstream authority wording so follow-on tickets cite
  adopted S-038 findings rather than raw review-post authority, made T13/T14
  continuation ownership concrete across odd_sdlc and ABG modules, and removed
  the remaining Lane 4 `triage.py` boundary bleed
- 2026-04-23: reconciled the framework to the landed public-start design by
  adding `public_start.py` to Lane 3 / T14, widening explicit start traversals
  T6/T7 to include the app-owned published head-gap consult, and adding
  `app.py` to Lane 1 where traversal ownership already depended on it

## Closure Note

S-038 closes as the durable framework surface for the current odd_sdlc repair
wave.

It now provides:

- one reconciled baseline over the S-037 review corpora
- the lawful traversal checklist for the active migration wave
- lane order and fault-class normalization for follow-on tickets
- explicit GTL / ABG / odd_sdlc ownership boundaries

The remaining implementation work stays in the consumer tickets:

- `B-035`
- `B-036`
