---
id: T-089
title: Harden traversal intent pressure enforcement on every prompt edge
type: defect
ticket_category: rc_blocker
status: completed
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Correct T-087/T-088 pressure closure by ensuring every prompt-bearing edge receives declared obligations and postflight rejects missing, unassessed, or unevidenced obligation assessments.
change_class: realization_refactor
re_entry_point: design_and_code
affected_boundary: traversal obligation derivation, worker result postflight, traversal intent package pressure, installed operator retry gaps
priority: critical
triaged_at: 2026-04-28T00:00:00Z
created_at: 2026-04-28T00:00:00Z
updated_at: 2026-04-28T00:00:00Z
completed_at: 2026-04-28T00:00:00Z
dependencies:
  - T-086 completed
  - T-087 completed
  - T-088 completed
  - T-066 completed
blocks:
  - T-041 active
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/claude/20260428T140000Z_REVIEW_T-087-T-088-intent-construction-claim-vs-pressure-loss.md
authority_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_INTENT_PACKAGE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_BLOCKING_REASON_CARRIERS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
target_truth: Every prompt-bearing edge carries target, evaluator, requirement, and prior-gap obligations in its intent package, and postflight rejects worker reports that omit declared assessments, submit unassessed obligations, or block obligations without evidence.
superseded_truth: A typed traversal intent package is sufficient pressure even when `obligationIds` is empty on early edges or obligation assessments are prompt-only expectations.
closure_law: this ticket closes only when non-materializing early edges have non-empty obligation pressure, missing obligation assessments block postflight, and the blocking reasons enter typed carrier truth without substring classification.
non_scope:
  - productive same-edge deepening after lawful closure
  - ABG substrate event vocabulary expansion
---

## STDO Triage

First missing layer: realization refactor.

The requirement and design already say prompt-bearing traversals must carry
cumulative pressure. Current realization only populates full obligations on
materializing edges and only asks the worker to assess obligations in prompt
text. That leaves early SDLC edges as typed-but-empty packages and makes worker
assessment coverage aspirational.

## Planned Fix

- lift target, evaluator, requirement, and prior-gap obligations out of the
  `materialization.required` branch
- treat obligations as a supported traversal surface pattern, not the only
  closure method: product-specific obligations may be inferred from
  authority/evaluators/types, while simple graph functions may provide literal
  checklist obligations without changing ABG ownership
- keep source-asset and module obligations materialization-specific
- add closed typed blocking reasons for missing, unassessed, extra, and
  unevidenced blocked obligation assessments
- prove an early non-materializing edge carries obligations
- prove postflight rejects missing and unassessed assessments

## Follow-On

The review's productive deepening recommendation is larger than this ticket. It
requires a transition-design update and should be tracked separately before
full T-041 RC closure.

## Implementation

- Added evaluator obligations to `SdlcTraversalObligationKind`.
- Derived target, evaluator, requirement, and prior-gap obligations for every
  prompt-bearing handoff instead of only materialization-required handoffs.
- Kept source-asset and module obligations scoped to materialization edges.
- Added closed blocking-reason carrier codes for missing, unassessed, extra,
  and unevidenced blocked obligation assessments.
- Added postflight enforcement so worker result reports cannot omit declared
  obligation assessments, report declared obligations as `unassessed`, add
  undeclared assessments, or block obligations without evidence.
- Updated traversal intent package design to state that obligation lists are a
  supported completeness carrier pattern, not the only lawful closure method.

## Verification

- `npm run test:t089` passed, 3 tests.
- `npm run test:t066` passed, 7 tests.
- `npm run test:t076` passed, 2 tests.
- `npm run test:t088` passed, 2 tests.
- `npm run test:t086` passed, 4 tests.
- `npm run test:t064` passed, 2 tests.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed, 124 tests.

## Closure

The ticket closes the pressure-enforcement defect from the T-087/T-088 review.
It does not open or close any new transition-design claim. Any future work on
productive deepening must enter through product/requirement repricing and must
treat `test35` as historical evidence/comparator only, not as an authority
surface to alter.
