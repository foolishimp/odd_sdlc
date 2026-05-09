---
id: T-138
title: Preserve causal chain and replayability for traversal consequence
type: feature
ticket_category: ordinary
status: active
review_status: triaged_pending_implementation
goal: typescript-rc-replayable-traversal-consequence
build_tenant: typescript
owner: odd_sdlc
change_intent: Ensure every admitted carrier in the traversal consequence chain carries predecessor refs so replay can reproduce closure decisions and next-action selection without hidden state.
change_class: realization_refactor
re_entry_point: code
affected_boundary:
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/code/src/runtime/
  - build_tenants/typescript/code/src/projection/
  - build_tenants/typescript/code/src/assurance/
  - build_tenants/typescript/test_env/tests/
priority: high
rc_blocker: true
release_blocker_reason: Traversal consequence cannot be trusted while closure/evaluator truth can depend on orphaned carriers or hidden local state.
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-109 publish authoritative edge ledger lineage chain
related_tickets:
  - T-135 realize evaluator-owned runner traversal spine
  - T-136 add yield closure disposition and resume basis
  - T-137 enforce target obligation binding and published action law
intake_source: The T-109 axiom review added causal chain integrity as a first-class condition: replay reconstructs the loop by following predecessor refs across intent, evidence, ledger, closure decision, and evaluator projection. This also realizes A1: the worksite is observed, not trusted, and only admitted evidence with causal basis can influence closure.
target_truth: ConstructionIntent, WorksiteEvidence, SdlcEdgeFulfillmentLedger, SdlcEdgeClosureDecision, and EvaluatorProjection each carry causal predecessor refs sufficient to replay and falsify the decision chain.
superseded_truth: Carriers can be shape-valid but causally orphaned, basisless, or dependent on caller order/local process state.
closure_law: This ticket closes only when replay tests reconstruct the full consequence chain from event log, execution basis, admitted evidence, ledger, closure decision, and visible policy refs; and fail closed on broken or orphaned predecessor refs.
evaluation_criteria:
  - Define the predecessor ref contract for each carrier in the consequence chain.
  - ConstructionIntent references the priority/evaluator row that selected it.
  - WorksiteEvidence references the intent/invocation/process event it evidences.
  - SdlcEdgeFulfillmentLedger references admitted evidence rows and target binding refs.
  - SdlcEdgeClosureDecision references the ledger version and reason/basis refs.
  - EvaluatorProjection references the closure decision, current observation snapshot, visible policy refs, and action catalog refs.
  - Replay ignores caller array order and reconstructs order from admitted event sequence/basis refs.
  - A negative test rejects orphan evidence that has no admitted invocation/intent basis.
  - A negative test rejects or blocks closure decision when ledger predecessor refs are broken.
  - A replay determinism test shuffles input carrier arrays and gets the same closure/evaluator result.
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t138_traversal_consequence_replayability.test.mjs
  - runtime archived event/evidence/ledger/projection refs from a focused sandbox lane
non_closure_conditions:
  - Any carrier in the consequence chain is admitted without predecessor refs.
  - Replay requires local memory, wall-clock ordering outside admitted event sequence, or runner-local arrays.
  - A shape-valid but orphaned event can create progress, closure, or next-action truth.
  - Public gaps or runner output cannot cite the causal chain behind its selected action.
---

# T-138: Preserve Causal Chain And Replayability For Traversal Consequence

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

Change-class note: this is a realization refactor only under the T-109 design
surface. This ticket cannot close until T-109 ratifies causal chain integrity
and replayability as closure law.

The target truth is computational, not documentary: a decision is lawful only if
replay can reproduce it. This ticket implements the predecessor refs and fail
closed tests needed to make that falsifiable.

## Causal Chain

```text
ConstructionIntent
-> WorksiteEvidence
-> SdlcEdgeFulfillmentLedger
-> SdlcEdgeClosureDecision
-> EvaluatorProjection
```

Broken predecessor refs mean hidden state.

## Implementation Notes

- Prefer existing ABG event ids, basis ids, invocation ids, and projection refs
  over new odd_sdlc-private identifiers.
- Do not create a second traversal ledger.
- Keep display summaries derived from the replayable chain.
