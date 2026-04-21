---
id: T-022
title: Publish one gap-analysis dossier surface for operator review and prompt consumption
type: feature
ticket_category: implementation_migration
status: completed
goal: gap-dossier-one-truth
change_intent: Replace mixed consumption of workspace state, analysis manifest, current triage, route binding, and constitutional proposal with one published gap-analysis dossier that can drive operator review and any future prompt-bearing gap work
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc gap-analysis publication, edge-scoped triage/read-model surfaces, future prompt-boundary law for gap review and lawful re-entry
priority: high
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-21
completed_at: 2026-04-21
dependencies: odd_sdlc T-021 completed; odd_sdlc T-023 completed
intake_source: step-back audit after the odd_sdlc homeostatic triage and ticket-routing wave
target_truth: one published gap-analysis dossier is the singular downstream review surface for current edge pressure, query-domain consumes that dossier without a parallel top-level analysis-manifest review path, and any prompt-bearing gap workflow consumes that dossier only after T-023 admits the execution_contract_surface source carrier
superseded_truth: operator review, query-domain review, and any future prompt-bearing gap workflow reconstruct the current gap story from multiple partial read models such as workspace_state, analysis_manifest, triage artifacts, route binding, and raw gaps payload rows
closure_law: this downstream migration cannot close while T-023 remains open, closes only when the dossier is the singular downstream review surface, and mixed old/new gap review proofs do not count as closure evidence
evaluation_criteria:
  - one dossier builder publishes the current edge pressure story without manual reconstruction across multiple read models
  - gaps and query-domain read from the dossier or one shared dossier builder instead of re-assembling their own gap story
  - any prompt-bearing gap workflow consumes the dossier as a downstream consumer of the admitted execution_contract_surface source carrier
non_closure_conditions:
  - T-023 remains open or execution_contract_surface is not yet the admitted upstream source carrier
  - operator review still depends on reconstructing multiple partial read models by hand
  - prompt-bearing gap work reads raw ticket or raw runtime phrasing instead of the dossier
  - mixed old/new dossier and non-dossier proofs are still accepted as closure evidence
proof_surface:
  - odd_sdlc gaps payload and query-domain proof over one dossier builder
  - prompt-bearing gap workflow proof only after T-023 source-carrier admission is live
---

## Migration Declaration

- old_truth_path: gap analysis truth is materially present but spread across `workspace_state`, `analysis_manifest`, edge-scoped triage artifacts, `gaps` payload rows, and direct app/query projections; operator or prompt consumers must reconstruct the real gap story by reading multiple surfaces
- new_truth_path: odd_sdlc publishes one edge-scoped gap-analysis dossier that carries the current observation, triage, route binding, constitutional proposal state, freshness basis, and resumption trigger as one reviewable current-state contract for operator review, and later prompt consumption reads that dossier only after the admitted execution-contract source carrier exists
- producers_old:
  - `odd_sdlc.analysis`
  - `odd_sdlc.triage`
  - `odd_sdlc.app.gaps`
  - `odd_sdlc.query.query_domain`
- producers_new:
  - published gap-analysis dossier builder
  - existing workspace-state, analysis-manifest, and triage projections as source truth
- consumers_old:
  - operator `gaps` review
  - query-domain review
  - future prompt-boundary or comment-boundary gap handling
- consumers_new:
  - operator `gaps` review
  - query-domain review
  - any prompt-bearing gap review or lawful re-entry assistance
- derived_surfaces:
  - published gap-analysis dossier register / context
  - `gaps` payload rows
  - query-domain current gap projection
  - future prompt or review surfaces
- closure_law: this downstream migration cannot close while `T-023` remains open; it closes only when the gap story no longer depends on reconstructing multiple partial read models by hand, the dossier is the singular downstream review surface, prompt consumption reads it as a downstream consumer of the admitted execution-contract source carrier, and mixed old/new gap review proofs do not count as closure evidence

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

## Interface Inventory

Best-guess migration surface based on a direct code walk. This is audit scope,
not closure evidence.

- dossier source and publication
  - `odd_sdlc.gap_dossier.build_gap_dossier_register(...)`
  - `odd_sdlc.gap_dossier.build_gap_dossier_context(...)`
  - `odd_sdlc.gap_dossier.publish_gap_dossier_surfaces(...)`
- operator review surface
  - `odd_sdlc.app.gaps(...)`
  - `_build_gap_surface(...)`
- query-domain consumer surface
  - `odd_sdlc.query.query_domain(...)`
  - `odd_sdlc.query_contract.query_domain_contract()`
- current evidence inputs
  - `odd_sdlc.analysis`
  - `odd_sdlc.triage`
  - canonical gap rows from span/gap truth
- proof surfaces to reprice
  - `test_odd_sdlc_first_slice.py`
  - `test_odd_sdlc_installation.py`
  - downstream usecase lanes that still encode the old mixed query/review shape
- remaining legacy interfaces to break first
  - none for this ticket's dossier authority
  - stale yield-observer handoff lanes remain broader usecase repricing work:
    their current timeout follows from old expectations that fake constructor
    traversal must yield at `derive_implementation_design_surface`; current
    traversal lawfully closes that edge and advances through deeper software
    buildout edges instead

## Functional Review Criteria

Review this ticket as a downstream implementation migration that depends on
`T-023`.

Every implementation and review pass must ask:

1. Did the slice replace mixed gap reconstruction with one published
   gap-analysis dossier as the downstream review truth?
2. Did it reduce a semantic center, or only rename the old `gaps`,
   `analysis_manifest`, triage, or query-domain assembly path?
3. Is the dossier a closed review carrier with explicit observation, triage,
   route binding, constitutional proposal state, freshness basis, and resumption
   trigger rather than a loose dict that each consumer reinterprets differently?
4. Is dossier construction a pure projection over current domain truth, or does
   it make independent closure or execution decisions?
5. Are effects limited to dossier register/context publication, with runtime
   execution truth still owned upstream by `T-023`?
6. Do `gaps`, `query-domain`, and future prompt-bearing gap workflows consume
   the dossier or shared dossier builder, or do they rebuild their own gap story
   from partial read models?
7. Are query/review projections downstream of the same dossier truth rather than
   second closure surfaces?
8. Does deterministic gap pressure inform operator review without pretending to
   be the upstream execution contract?

Passing query tests do not satisfy this section by themselves. A slice that
keeps both top-level raw gaps and dossier truth as independent normal review
authorities fails review even if both surfaces are populated.

## Required Break Order

This ticket is downstream of `T-023`; prompt-bearing closure cannot land before
the execution-contract source carrier is admitted.

The required order is:

1. publish the dossier builder/register/context as one downstream carrier
2. make `gaps` read the dossier or shared dossier builder
3. make `query-domain` read the dossier or shared dossier builder
4. remove or demote old mixed review fields that act as independent authority
5. connect any prompt-bearing gap workflow only as a downstream consumer of the
   admitted execution contract from `T-023`
6. reprice tests and documentation from raw `gaps["gaps"]` authority to
   dossier-led review truth

## Break-To-Closure Map

- Break 1 closes the dossier-publication clause:
  - there is one reviewable current-state carrier for edge pressure
- Breaks 2-3 close the consumer clause:
  - public review/query surfaces consume the same dossier truth
- Break 4 closes the bridge clause:
  - old partial read models no longer act as competing review authority
- Breaks 5-6 close the prompt/proof clause:
  - prompt-bearing gap work is downstream of `T-023`, and mixed old/new proofs
    are removed or repriced

## Mixed-State Negative Proof

Closure requires proof that `gaps` and `query-domain` cannot independently
claim a different gap story when the dossier is absent, stale, or disagrees with
old partial read models. If a consumer can still pass by reconstructing gap truth
from raw rows, analysis manifests, or route helpers, this ticket remains open.

## Why This Ticket Exists

Homeostatic triage is now one of the strongest parts of the odd_sdlc line, but
its current truth is still spread across several good surfaces rather than one
review-ready dossier.

That is acceptable for direct code access. It is weaker for:

- operator review
- future prompt-bearing gap handling
- replayable “why is this edge open” explanation

The ticket method works well because it gives one inspectable surface with:

- identity
- current claim
- current migration law
- acceptance

Gap analysis should get the same treatment.

Under inside-out migration discipline, this ticket is downstream of
`T-023`. The operator-review dossier may harden now, but prompt-consumption
closure stays open until the admitted execution-contract source carrier exists.
Current in-flight dossier code is exploratory non-closure evidence until that
upstream carrier is admitted and authoritative.

## Required Direction

1. Publish one edge-scoped gap-analysis dossier derived from current domain
   truth.
2. Make the dossier carry, at minimum:
   - edge identity
   - analysis freshness basis
   - current observation
   - current triage
   - current route binding
   - constitutional proposal state
   - current resumption trigger
   - evidence bundle references
3. Reuse that dossier in `gaps` and `query-domain` instead of making those
   surfaces reconstruct the story independently.
4. Make future review flows consume the dossier instead of scraping multiple
   runtime artifacts.
5. Keep prompt-consumption closure downstream of `T-023`; do not let dossier
   consumers become a substitute source of execution truth.

## Acceptance

- odd_sdlc publishes one gap-analysis dossier per current edge pressure
- `gaps` and `query-domain` both read from that dossier or from one shared
  builder for it
- the dossier is sufficient for operator review without manual reconstruction
  across multiple runtime files
- any future prompt-bearing gap workflow consumes the dossier as one current
  downstream contract after `T-023` admits the execution-contract source
  surface

## Closure Evidence

Completed on 2026-04-21 after `T-023` admitted the execution-contract source
carrier.

Implemented closure:

- `odd_sdlc.gap_dossier` publishes the dossier register and markdown context as
  the one review surface for edge pressure.
- Public `odd_sdlc gaps --scope workspace` returns dossier-led truth through
  `dossiers` and `summary`; top-level raw `gaps` is no longer the public review
  authority.
- `query-domain` carries `gap_dossier` as the downstream read model instead of
  reconstructing a parallel gap story.
- Prompt-bearing traversal now consumes the admitted T-023 execution contract
  before start; T-022 does not create an alternative execution source.
- The software-mode scenario constructor now carries live `REQ-*` authority so
  declared obligation checks do not reopen scenario work after ABG closure.

Proof run:

- `python -m pytest -q build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py`
  passed: 57 passed in 166.80s.

Residual note:

- `test_odd_sdlc_yield_usecase.py` still contains observer-handoff expectations
  from the older fake-constructor traversal. The current run reaches
  `derive_implementation_design_surface`, `select_implementation_stack_profile`,
  `derive_implementation_module_surface`, and `derive_code_surface`; it does not
  stop at the old yield seam. That is broader usecase repricing, not competing
  gap-dossier authority.

## Post-Closure ODD_METHOD Review - 2026-04-21

Review recorded in:

- `.ai-workspace/comments/codex/20260421T212949Z_REVIEW_completed-active-wave-tickets-odd-method-graph-requirements.md`

Verdict:

- ODD_METHOD graph requirements are satisfied for downstream dossier
  projection.
- `gaps` and `query-domain` consume the same dossier builder/projection path,
  and the dossier remains downstream of the T-023 admitted execution-contract
  source carrier.

Residual review risk:

- A stronger future regression should create a stale or contradictory raw gap
  read-model fixture and prove public review cannot accept it independently of
  the dossier.
