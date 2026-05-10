---
id: T-138
title: Preserve causal chain and replayability for traversal consequence
type: feature
ticket_category: ordinary
status: completed
review_status: completed_deterministic_replayability_proof
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
release_blocker_reason: Traversal consequence cannot be trusted while closure/next-action truth can depend on orphaned carriers or hidden local state.
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-10
completed_at: 2026-05-10
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-109 publish authoritative edge ledger lineage chain
related_tickets:
  - T-135 realize evaluate_next-owned runner traversal spine
  - T-136 add yield closure disposition and resume basis
  - T-137 enforce target obligation binding and published action law
intake_source: The T-109 axiom review added causal chain integrity as a first-class condition: replay reconstructs the loop by following predecessor refs across intent lineage, product asset model, gap pressure, target binding, construction intent, evidence, ledger, closure decision, and next-action projection. This also realizes A1: the worksite is observed, not trusted, and only admitted evidence with causal basis can influence closure.
target_truth: ConstructionIntent, WorksiteEvidence, SdlcEdgeFulfillmentLedger, SdlcEdgeClosureDecision, and NextActionProjection each carry causal predecessor refs sufficient to replay and falsify the decision chain, including IntentLineage, ProductAssetModel, GapPressureRow, TargetObligationBinding, ActionCatalog, NextActionBasis, and visible policy refs for next-action replay.
superseded_truth: Carriers can be shape-valid but causally orphaned, basisless, or dependent on caller order/local process state.
closure_law: This ticket closes only when replay tests reconstruct the full consequence chain from event log, execution basis, intent lineage, product model, gap pressure, target binding, action catalog, admitted evidence, ledger, closure decision, NextActionBasis, and visible policy refs; and fail closed on broken or orphaned predecessor refs.
evaluation_criteria:
  - Define the predecessor ref contract for each carrier in the consequence chain.
  - ConstructionIntent references the intent lineage, product asset model, priority row, and next-action projection that selected it.
  - WorksiteEvidence references the intent/invocation/process event it evidences.
  - SdlcEdgeFulfillmentLedger references admitted evidence rows and target binding refs.
  - SdlcEdgeClosureDecision references the ledger version and reason/basis refs.
  - NextActionProjection references its evaluation function, explicit NextActionBasis, intent lineage refs, product asset model ref, gap pressure refs, target binding refs, optional closure decision, current observation snapshot, visible policy refs, and action catalog refs.
  - Replay ignores caller array order and reconstructs order from admitted event sequence/basis refs.
  - A negative test rejects orphan evidence that has no admitted invocation/intent basis.
  - A negative test rejects or blocks closure decision when ledger predecessor refs are broken.
  - A replay determinism test shuffles input carrier arrays and gets the same closure/next-action result.
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
-> NextActionProjection
```

Broken predecessor refs mean hidden state.

## Implementation Notes

- Prefer existing ABG event ids, basis ids, invocation ids, and projection refs
  over new odd_sdlc-private identifiers.
- Do not create a second traversal ledger.
- Keep display summaries derived from the replayable chain.

## Session A Implementation Checkpoint - 2026-05-09

Implemented a pure typed traversal consequence carrier slice in
`build_tenants/typescript/code/src/operator/traversal_consequence.ts`.

Current T-138 coverage in that slice:

- `SdlcConstructionIntent` references intent lineage, product asset model,
  selected priority row, and next-action projection basis.
- `SdlcWorksiteEvidence` requires intent and invocation causation refs.
- `SdlcEdgeFulfillmentLedger` references target binding and admitted evidence
  refs.
- `SdlcEdgeClosureDecision` references the ledger and ledger version refs.
- `SdlcNextActionProjection` declares `evaluationFunction: evaluate_next` and
  references explicit NextActionBasis, intent lineage, product asset model, gap
  pressure, target binding, optional closure decision, observation, policy, and
  action catalog refs.
- `replaySdlcTraversalConsequence` reconstructs the consequence chain by
  following refs rather than caller array order.
- Replay validates every evidence bundle referenced by the ledger, not just the
  first evidence ref.
- Replay rejects ledgers that mix evidence from multiple intents.
- Broken predecessor refs fail closed, including broken model/gap/binding
  predecessor refs on next-action projection.

Focused test added:

- `build_tenants/typescript/test_env/tests/test_t138_traversal_consequence_replayability.test.mjs`

Verification run:

```bash
./node_modules/.bin/tsc --target ES2022 --module NodeNext --moduleResolution NodeNext --strict --noEmit code/src/operator/traversal_consequence.ts
git diff --check -- build_tenants/typescript/code/src/operator/traversal_consequence.ts build_tenants/typescript/code/src/operator/index.ts build_tenants/typescript/test_env/tests/test_t136_yield_closure_disposition.test.mjs build_tenants/typescript/test_env/tests/test_t138_traversal_consequence_replayability.test.mjs
```

Both passed.

Full `npm run build:semantic` is not yet recorded for this checkpoint because a
parallel Session B edit currently leaves
`build_tenants/typescript/code/src/workspace/bootstrap_sdlc.ts` type-invalid.
This ticket remains active pending full package build/test after Session B
stabilizes.

Superseded by 2026-05-10 closure evidence below.

Review fixes applied after initial Session A review:

- Added the full ledger convergence gates needed by downstream replay and
  closure checks.
- Made closure policy a visible predecessor ref.
- Reworked replay to validate all ledger evidence refs.
- Added negative tests for broken secondary evidence and mixed-intent evidence
  bundles.
- Added initial `NextActionProjection` support with no synthetic closure
  decision, while action-consequence replay still fails closed unless the final
  next-action projection is post-action and references a closure decision.
- Expanded next-action basis from generic `post_action` into explicit
  post-disposition basis kinds so replay can distinguish post-yield resume,
  post-close graph continuation, retry, repair, re-entry, reprice, and block.

Additional verification run after basis correction:

```bash
npm run build:semantic
npm run lint:semantic
node --test test_env/tests/test_t138_traversal_consequence_replayability.test.mjs
```

Passed build, lint, and 8/8 tests.

## Closure Evidence - 2026-05-10

Status: closed.

The traversal consequence chain is replayable through typed predecessor refs
across construction intent, worksite evidence, edge fulfillment ledger, closure
decision, and next-action projection. Replay now validates every evidence bundle
referenced by the ledger, rejects mixed-intent evidence, rejects broken
predecessor chains, and is deterministic under shuffled caller arrays.

Verification:

- `npm run test:t138` passed, 8/8.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed, 316/316.

Closure boundary:

- This ticket closes deterministic causal-chain/replayability proof for the
  traversal consequence carriers.
- Any future installed archive replay proof can be opened as a follow-up if
  release review requires live evidence beyond the deterministic carrier lane.
