---
id: T-166
title: Define adaptable consensus graph function for submitter-reviewer rounds
type: feature
ticket_category: ordinary
status: backlog
goal: reusable-consensus-graph-functions-for-governed-review-and-decision-rounds
build_tenant: typescript
owner: odd_sdlc
change_intent: Define a highly adaptable reusable consensus graph-function family where a submitter-owned subject is fanned out to one or more reviewers, reviewer outputs are reduced into decision alternatives, the submitter responds, and the graph either closes as done or recurses through another governed consensus round.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-14
created_at: 2026-05-14
updated_at: 2026-06-13
governance_scope: STDO Method
source_documents:
  - specification/requirements/02-graph-functions.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - build_tenants/common/design/adrs/ADR-008-consensus-plugin-host-binding-boundary.md
  - build_tenants/python/code/odd_sdlc/consensus_module.py
  - build_tenants/python/code/odd_sdlc/consensus_harness_module.py
  - build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py
  - build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py
  - .ai-workspace/tickets/completed/T-005-reprice-consensus-as-reusable-graph-function-plugin.md
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/completed/T-005-reprice-consensus-as-reusable-graph-function-plugin.md
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/backlog/T-167-define-review-graph-function-for-multi-reviewer-ticket-generation.md
  - .ai-workspace/tickets/backlog/B-004-track-odd-service-remote-client-and-consensus-scope-debt.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_CONSENSUS_GRAPH_FUNCTION.md
  - build_tenants/typescript/code/src/review/
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/graph/overlay.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/test_env/tests/
excluded_boundary:
  - ABG runtime ownership of frames, events, continuations, projection, replay, or traversal truth
  - odd_service remote worker/session orchestration beyond declaring future-compatible roles and transport refs
  - treating consensus as an odd_sdlc-only design-review feature
  - hidden reviewer fan-out, hidden reducer policy, hidden submitter override, or hidden recursion control
  - comment-only, chat-only, or prompt-only consensus decisions
target_truth: The TypeScript line can publish consensus as a reusable higher-order graph-function family over one typed subject surface. Reviewers return feedback, the submitter responds by accepting or refactoring that same surface, and the graph either closes as done or recurses with the revised surface. Host products bind concrete subject and reviewer roles, while the reusable graph function owns the review/reduce/submitter-response/termination shape and remains catalog-visible, recursive, and composable.
superseded_truth: Consensus remains the older Python-era partial shape: a useful design-specific harness and symbolic shared-plugin marker, but without enough product/runtime support for fully adaptable submitter/reviewer roles, declared fan-out, submitter response, recursive round state, host-independent decisions, and replayable done-or-recurse closure.
closure_law: This backlog closes only when the TypeScript design consolidates the older Python consensus work into a reusable consensus graph-function family, declares its outer contract, recursive round law, role/environment carriers, host-binding law, and proof obligations, distinguishes consensus from ticket-producing review, and proves how T-162 can require consensus over a ticket surface before implementation without consensus becoming ticket status authority.
evaluation_criteria:
  - consensus graph function supports `w0.submitter(A) -> (w1.reviewer..wn.reviewer) -> (B1..Bn) -> w0.submitter -> done | recurse`
  - consensus treats `A` as the subject being refined; recursive feedback produces `A'` or `A2`, not one or more independent tickets as the primary output
  - reviewer fan-out, reviewer identity, assessment schema, quorum/reduction policy, submitter-response policy, and termination policy are declared carriers
  - reviewer sets can be supplied by configured reviewer profiles or panel bindings such as T-162 `codex` and `claude` selections
  - recursive consensus uses graph-function recursion or lawful graph-function composition rather than an imperative retry loop
  - host bindings can specialize subject, reviewer roles, assessment shape, decision alternatives, and reviewed output without changing the reusable outer contract
  - T-162 can inject consensus over a ticket asset before implementation so the ticket surface itself is refined or accepted before execution-contract admission
  - consensus outcomes carry proof refs, dissent/minority refs, residual pressure, and next lawful action refs into ledgers, closure decisions, projections, archives, and replay
  - query-domain can distinguish reusable consensus functions from host-specific consensus bindings
proof_surface:
  - design module for reusable consensus graph-function family
  - catalog projection showing reusable consensus function and at least two host bindings
  - deterministic test for one-round done consensus
  - deterministic test for submitter revision followed by recursive second-round consensus
  - deterministic test for non-consensus / escalation / split decision with residual pressure preserved
  - deterministic test showing ticket-surface consensus can refine a ticket before T-162 admits the execution contract
non_closure_conditions:
  - reviewer fan-out is implemented as a service loop without catalog-visible graph functions
  - reviewer identity is inferred from hardcoded Claude/Codex branches, current chat identity, or ambient defaults instead of configured profiles
  - reviewer assessment is accepted without a matching profile digest, invocation ref, and declared output/evidence contract
  - reducer policy is hardcoded or inferred from reviewer prose
  - submitter response silently overrides reviewer outcomes without a declared policy
  - recursion is implemented as local retry rather than graph-function recursion/composition through ABG-owned continuation
  - consensus close is claimed from majority text without admitted assessment, decision, response, and proof carriers
  - a consensus output directly closes a ticket, applies constitutional change, or edits product assets without the host workflow admitting that result
  - consensus is used as the ticket-producing review mechanism instead of refactoring the same subject surface through feedback
  - host bindings collapse reusable consensus law into odd_sdlc-only special cases
  - the design ignores the older Python consensus modules instead of explicitly consolidating and superseding their partial capability
---

# T-166: Adaptable Consensus Graph Function

## STDO Triage

First missing layer: design.

The line already has a retained consensus position: consensus should be a
reusable higher-order graph-function plugin with explicit host bindings. The
current missing shape is the more general submitter-reviewer round:

```text
w0.submitter(A)
  -> (w1.reviewer .. wn.reviewer)
  -> (B1 .. Bn)
  -> w0.submitter
  -> Consensus() | done
```

This ticket deepens the reusable consensus design for the TypeScript tenant. It
does not reopen the old design-specific consensus proof. It generalizes the
carrier so consensus can support ticket review resolution, design review,
strategy review, schema review, policy review, or later service-backed
multi-worker review without changing the outer graph-function contract.

## Prior Python Consolidation

This is consolidation from older Python work, not a new concept.

The Python line already carried:

- `consensus_module.py`, a standalone consensus-round module over
  `review_design_consensus_round`;
- `consensus_harness_module.py`, a composed and recursive harness over
  review, reduce, and apply stages;
- first-slice and sandbox tests that proved catalog visibility and design-review
  host binding shape.

That work was useful evidence, but the surrounding functionality was not yet
strong enough to support the full reusable model. It was still design-oriented,
symbolic in the shared-plugin layer, and not backed by the current TypeScript
overlay, edge-contract, ticket-workflow, recursive environment, and replay
carriers.

T-166 must therefore treat the Python artifacts as source evidence and partial
precedent. The TypeScript design must consolidate the useful shape, then replace
the incomplete parts with first-class graph-function, overlay, ledger, and
closure carriers.

## Design Claim

Consensus is not a voting helper and not a service fan-out loop.

Consensus is a reusable graph-function family over typed roles and artifacts:

```text
SubmitterSubject<A>
  -> ReviewAssignmentSet
  -> ReviewerAssessmentSet<B>
  -> ConsensusDecision
  -> SubmitterResponse
  -> ReviewedSubject | NextConsensusRound | Escalation
```

The submitter owns the subject and the response to review. Reviewers own their
individual assessments. The reusable graph function owns the review, reduction,
submitter-response, and termination topology. The host owns subject semantics
and how the reviewed result is consumed.

## Review Boundary

Consensus and review are related but not the same graph function.

Consensus is a same-surface refinement loop:

```text
A
  -> reviewer feedback
  -> submitter response
  -> A' | done | recurse
```

Review is an assessment and routing graph over a surface:

```text
surface A
  -> reviewer findings
  -> one or more decision rows or tickets
```

Review belongs in T-167. Consensus may be injected over a ticket, design,
comment, strategy, or code-review subject when the desired result is to refine
that subject until it is accepted or blocked. It should not be the primary
mechanism that explodes a review into multiple work tickets.

## Candidate Graph-Function Family

Exact names can be refined during design, but the family should start here:

```text
Fg_consensus_round
  submitter subject + reviewer profile set or panel binding + policy -> decision and submitter response

Fg_consensus_until_done
  recursive or composed round function that repeats until done, blocked,
  escalated, split, or exhausted

Fg_reduce_reviewer_assessments
  reviewer assessments + policy -> consensus decision alternatives

Fg_apply_submitter_response
  subject + consensus decision + submitter response -> reviewed subject or next subject
```

The graph function may be hosted by concrete bindings such as:

```text
ticket_review_consensus
design_review_consensus
comment_review_consensus
strategy_review_consensus
schema_review_consensus
```

Host bindings must not fork the reusable consensus law. They bind local subject
type, reviewer roles, assessment schema, decision vocabulary, proof lane, and
downstream consumption.

## Carrier Set

The design should define at least:

- `ConsensusSubjectRef`
- `ConsensusSubmitterRef`
- `ConsensusReviewerProfile`
- `ConsensusReviewerRef`
- `ConsensusReviewerSet`
- `ConsensusReviewAssignment`
- `ConsensusReviewerInvocationRef`
- `ConsensusReviewerAssessment`
- `ConsensusAssessmentSet`
- `ConsensusReductionPolicy`
- `ConsensusDecision`
- `ConsensusSubmitterResponse`
- `ConsensusRoundLedger`
- `ConsensusRoundCloseDecision`
- `ConsensusResidualPressure`
- `ConsensusHostBinding`

`ConsensusDecision` should support at least:

- `done`
- `revise_and_rerun`
- `accepted_with_conditions`
- `defer`
- `split`
- `escalate`
- `blocked`

The exact vocabulary may vary by host binding, but the reusable carrier must
support all of these dispositions.

`ConsensusReviewerProfile` should reuse the ticket/review profile shape where a
host needs concrete reviewers such as `reviewer://odd-sdlc/codex` or
`reviewer://odd-sdlc/claude`. Consensus must consume those reviewers through the
declared profile contract, not through special-case agent names.

## Environment Law

Each consensus graph function declares:

```text
environment.requires
  submitter ref
  subject ref and digest
  reviewer profile refs or review panel binding ref
  reviewer role refs
  reviewer profile config digests
  assessment schema refs
  reduction policy ref
  submitter-response policy ref
  termination policy ref
  host binding ref

environment.provides
  review assignment refs
  reviewer invocation refs
  reviewer assessment refs
  consensus decision ref
  submitter response ref
  round ledger ref
  reviewed subject ref or next-round subject ref

environment.carries
  prior round refs
  dissent/minority refs
  residual-pressure refs
  proof refs
  host workflow refs such as ticket execution contract or overlay binding
```

## T-162 Use Case

Under T-162, consensus can be injected over a ticket before implementation:

```text
ticket asset
  -> reviewer assessments
  -> consensus decision
  -> submitter response
  -> refined ticket asset | accepted ticket asset | blocked/escalated
```

The consensus decision is admitted evidence for the ticket workflow. It does not
directly set ticket status, close a ticket, or apply work. T-162 remains the
ticket authority surface.

## Recursion And Stop Law

`Fg_consensus_until_done` must be lawful graph-function recursion or explicit
composition. It may continue only when the previous round produced an admitted
next-round subject and the termination policy permits another round.

Stop states:

- `done`: reviewed subject is produced and accepted by policy
- `revise_and_rerun`: submitter produced a revised subject for another round
- `split`: decision creates separate work subjects or follow-up tickets
- `escalate`: policy requires F_H or external authority
- `blocked`: required reviewer, evidence, policy, or subject binding is missing
- `exhausted`: max rounds or policy budget reached without consensus

## Acceptance

- design module defines the reusable consensus graph-function family and carrier
  set
- graph-function catalog can publish reusable consensus separately from host
  bindings
- at least two host-binding examples are defined, one of which is ticket-review
  consensus for T-162 decision rows
- recursive consensus is expressed through GTL/ABG graph-function recursion or
  lawful composition, not local retry
- proof design includes done, revise/rerun, split/escalate, and blocked cases
- consensus ledgers preserve reviewer identities, decision basis, submitter
  response, dissent/minority evidence, residual pressure, and replay refs

## Boundary

This ticket enables future graph overlays and graph functions. It does not
authorize odd_service remote fan-out, UI workflows, or runtime behavior changes
before the reusable consensus design is ratified.


## Substrate-readiness addendum (2026-07-09, cross-repo note — not law)

Recorded from the abiogenesis T-217 consciousness wave; this ticket's
design remains the owning authority and none of its closure law changes.

- KERNEL LANDING SEAM EXISTS: abiogenesis T-217 Phase 1 S4 delivered
  `defect_intake_admitted` (typed triage records: owner, change_class,
  re-entry point per TICKET_METHOD, self-certified intakeRef) and
  `deriveTicketDraftFromIntake` (drafts derive FROM admitted records;
  solutioning stops at the draft behind F_H). Finding->ruling->draft
  routing has a kernel terminal to land on.
- ATTRIBUTION LAW EXISTS: the T-217 witness family (WITNESS-001..014)
  makes reviewer attribution, invocation refs, digest-bearing evidence,
  and replay-visible acts kernel admission law — the profile-digest /
  invocation-ref non-closure conditions here align with it verbatim.
- SESSION-ALLOWLIST GOVERNANCE RATIFIED (user, 2026-07-09): the
  operator grammar admits the session's ALLOWED graph-function set as
  an initial condition of the root frame (view restriction over the
  declared catalog; enforced at selection/admission; inherited down
  recursive frames). Review/consensus campaigns triggered from the CLI
  run inside that bounded catalog view.
- WORKER-BINDING DEPENDENCY UNCHANGED: configured reviewer profiles
  (`reviewer://odd-sdlc/codex`, `reviewer://odd-sdlc/claude`) still
  await the transport binding line (odd_sdlc T-117 sticky-session
  lanes / abiogenesis T-110, B-004 scope debt).
- CONSUMPTION LINKAGE: abiogenesis T-217 Phases 3/5 CONSUME this
  family for the tier's review campaigns rather than reinventing it in
  the consciousness module (three-layer ownership law).
