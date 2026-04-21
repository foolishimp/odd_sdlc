---
id: B-034
title: Public odd_sdlc start does not honor ambiguity F_H escalation from the published source carrier
type: bug
ticket_category: implementation_migration
status: completed
goal: public-start-ambiguity-gate
change_intent: Rewire the public odd_sdlc start path so unresolved ambiguity entries with policy_action=escalate_fh stop traversal at fh_gate instead of silently continuing on the F_P path
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: public odd_sdlc start behavior, ambiguity-register consumption, dynamic F_H evaluator carriage, and risk-appetite proof lanes
priority: high
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-21
dependencies: odd_sdlc T-016 completed
intake_source: dossier-first refactor review while repricing risk-appetite usecases onto the live public odd_sdlc start contract
target_truth: public odd_sdlc start consumes the same ambiguity escalation truth already published in the ambiguity register and GTL module, so low-risk major ambiguity stops at fh_gate and high-risk ambiguity remains carried by F_P
superseded_truth: ambiguity escalation is published in the ambiguity register and injected into GTL leaf functions, but public odd_sdlc start still advances under a different effective execution basis and ignores the unresolved F_H gate
closure_law: this migration closes only when public odd_sdlc start stops on unresolved ambiguity entries with policy_action=escalate_fh, no parallel start path bypasses that carrier, and risk-appetite proof no longer depends on stale substrate-only invocation
evaluation_criteria:
  - public odd_sdlc start reads the ambiguity escalation carrier before continuing traversal
  - low-risk multiple-realization-roots workspaces stop with stopped_by=fh_gate at the expected resolving edge
  - high-risk workspaces continue without fh_gate while preserving carried ambiguity status
  - query-domain, ambiguity register, and public odd_sdlc start tell one consistent story
non_closure_conditions:
  - public odd_sdlc start still advances while ambiguity register entries remain status=fh_required and blocking=true
  - a substrate-only path is required to observe the correct ambiguity gate behavior
  - mixed proofs are accepted where query-domain says escalate_fh but start continues on F_P
proof_surface:
  - risk-appetite usecases over public odd_sdlc start
  - source-line proof showing start respects ambiguity policy without bypassing the published carrier
---

## Migration Declaration

- old_truth_path: ambiguity escalation is published in `odd_sdlc.ambiguity_register` and injected into GTL leaf functions, but the public odd_sdlc start path continues traversal as though that F_H gate were not authoritative
- new_truth_path: public odd_sdlc start consumes the published ambiguity carrier and stops at `fh_gate` when unresolved major ambiguity requires F_H escalation under the current risk appetite
- producers_old:
  - `odd_sdlc.ambiguity`
  - `odd_sdlc.gtl_module`
  - public odd_sdlc start with mismatched downstream behavior
- producers_new:
  - published ambiguity register
  - GTL leaf function configuration with dynamic F_H evaluators
  - public odd_sdlc start honoring that same carrier
- consumers_old:
  - public odd_sdlc start
  - risk-appetite usecase proof
- consumers_new:
  - public odd_sdlc start
  - risk-appetite usecase proof
  - operator/runtime interpretation of ambiguity escalation
- derived_surfaces:
  - ambiguity register
  - configured GTL leaf functions
  - public odd_sdlc start result
  - event stream / `fh_gate_pending`
- closure_law: this migration closes only when public odd_sdlc start and the ambiguity register no longer disagree about whether unresolved major ambiguity requires F_H escalation

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

- ambiguity source carrier
  - `odd_sdlc.ambiguity.build_ambiguity_register(...)`
  - `odd_sdlc.ambiguity.load_or_build_ambiguity_register(...)`
- GTL carrier publication
  - `odd_sdlc.gtl_module._configured_leaf_graph_functions(...)`
  - dynamic ambiguity F_H evaluators
- public start consumer
  - `odd_sdlc.app.start(...)`
  - `odd_sdlc.__main__.py` `start` command
  - current observed failure
    - `start --target next --until converged` on the ambiguous inherited workspace times out in unrelated earlier edges instead of reaching `select_implementation_stack_profile`
    - `graph_function:select_implementation_stack_profile` is not currently a published public start handle, so the ambiguity gate cannot yet be isolated through the public target surface
- proof lanes
  - `test_odd_sdlc_risk_appetite_usecase.py`

## Functional Review Criteria

Review this ticket as a carrier-consumption migration, not as a timeout or test
expectation fix.

Every implementation and review pass must ask:

1. Did the slice make public `odd_sdlc start` consume the published ambiguity
   source carrier as execution truth?
2. Did it reduce the semantic split between query-domain ambiguity truth and
   start traversal behavior, or only add a special-case stop check?
3. Is ambiguity escalation expressed as a closed carrier/evaluator contract with
   explicit status, `policy_action`, blocking state, and resolving edge rather
   than an open string or ad hoc runtime flag?
4. Is the start decision a transform over admitted ambiguity truth, or does
   public start still decide F_H escalation procedurally from unrelated runtime
   state?
5. Are effects limited to runtime traversal/event output, with ambiguity
   interpretation owned by the published carrier?
6. Do public start, query-domain, ambiguity register, and risk-appetite proof
   consume the same carrier, or do they reconstruct escalation truth
   independently?
7. Are event/runtime stop surfaces derived from the same ambiguity truth rather
   than acting as a second authority?
8. Does deterministic F_H escalation block only when the carrier says
   `policy_action=escalate_fh`, while high-risk policy continues to permit F_P
   traversal?

Passing risk-appetite tests do not satisfy this section by themselves. A slice
that requires substrate-only invocation, target-specific shortcuts, or mixed
query/start truth fails review even if one scenario becomes green.

## Required Break Order

The required order is:

1. confirm the ambiguity register and GTL dynamic F_H evaluators publish the
   same source truth
2. make public start resolve a target that can reach the ambiguity-governed edge
   without substrate-only bypass
3. rebind public start traversal to consume the published ambiguity carrier
4. prove low-risk `escalate_fh` stops with `stopped_by=fh_gate` at the expected
   edge
5. prove high-risk policy continues without `fh_gate` while carrying ambiguity
   status
6. reprice tests and wording that still accept query-domain/start disagreement

## Break-To-Closure Map

- Break 1 closes the source-carrier clause:
  - ambiguity register and GTL evaluator truth agree
- Breaks 2-3 close the public-start consumer clause:
  - public start can reach and consume the ambiguity-governed edge
- Breaks 4-5 close the risk-policy behavior clause:
  - low-risk stops at F_H, high-risk preserves lawful F_P
- Break 6 closes the proof clause:
  - mixed query-domain/start behavior no longer counts as acceptance

## Mixed-State Negative Proof

Closure requires proof that public start cannot continue when the ambiguity
carrier says an unresolved entry is `blocking=true` with
`policy_action=escalate_fh`. If query-domain reports F_H escalation while public
start still advances through a substrate-only or bypass path, this ticket
remains open.

## Why This Ticket Exists

The current line already publishes ambiguity escalation truth, but the public
odd_sdlc start path still cannot realize that truth cleanly in the proving
workspace. Query/read models say `escalate_fh`, while public `start --target
next` keeps consuming unrelated earlier edges and never reaches the expected
resolving edge inside the timeout window.

This bug surfaced only after the dossier/public-gap refactor forced the usecase
proofs onto the actual public odd_sdlc start contract instead of stale
substrate `--auto` assumptions.

## Closure Notes

Root cause was two-level carrier drift.

At the odd_sdlc layer, ambiguity-policy leaf graph functions were configured
inside the executive graph but were not published as public start handles. The
fix publishes ambiguity-policy edges through `CandidateFamily` and exposes the
affected graph function as a target-injected public handle. Low-risk policy
injects the dynamic F_H evaluator; high-risk policy publishes the same edge
without the F_H evaluator so F_P can carry the ambiguity.

At the ABG substrate layer, typed `RegimeBindingSet` already carried the open
F_H outcome, but `advance_transition_for_precomputed(...)` prioritized F_D/F_P
continuation before F_H. The fix makes `FhEscalationTransition` the typed
advancement transition whenever the admitted regime carrier contains unresolved
F_H truth. Replay planning now emits `fh_gate_pending` for that same condition
even when F_D/F_P work is also open.

Closed implementation surfaces:

- `odd_sdlc.gtl_module` publishes ambiguity-policy start handles and candidate
  families from the ambiguity register.
- `odd_sdlc.__main__` returns exit code `3` for public `start` stopped by
  `fh_gate`.
- `genesis.runtime_carrier.advance_transition_for_precomputed(...)` treats
  unresolved F_H carrier truth as the advancement transition.
- `genesis.interpret` emits `fh_gate_pending` from the same F_H carrier truth.
- `test_odd_sdlc_risk_appetite_usecase.py` proves both low-risk F_H escalation
  and high-risk F_P carriage through public odd_sdlc start.

Closure proof:

```text
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest -q build_tenants/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py -q

.. [100%]
```

## Post-Closure ODD_METHOD Review - 2026-04-21

Review recorded in:

- `.ai-workspace/comments/codex/20260421T212949Z_REVIEW_completed-active-wave-tickets-odd-method-graph-requirements.md`

Verdict:

- ODD_METHOD graph requirements are satisfied for the public-start ambiguity
  gate.
- Ambiguity truth is carried by the published ambiguity register, dynamic F_H
  evaluators, public ambiguity-policy graph-function handles, CandidateFamily
  publication, and ABG F_H regime transition.

Residual review risk:

- CandidateFamily metadata currently uses an F_H-gate phrasing for all
  ambiguity-policy start functions. This is not a behavioral closure defect,
  but future cleanup should distinguish ambiguity-policy edges from actual F_H
  gate edges.
