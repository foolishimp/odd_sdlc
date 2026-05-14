---
id: T-167
title: Define review graph function for multi-reviewer ticket generation
type: feature
ticket_category: ordinary
status: backlog
goal: reusable-review-graph-functions-that-route-surface-findings-into-ticketed-work
build_tenant: typescript
owner: odd_sdlc
change_intent: Define a reusable review graph-function family where one or more configured reviewers assess any typed surface, produce structured findings, and route those findings into decision rows, draft tickets, split tickets, deferments, or rejected findings under TICKET_METHOD authority.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-14
created_at: 2026-05-14
updated_at: 2026-05-14
governance_scope: STDO Method
source_documents:
  - specification/requirements/02-graph-functions.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - build_tenants/common/design/adrs/ADR-008-consensus-plugin-host-binding-boundary.md
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/backlog/T-166-define-adaptable-consensus-graph-function-for-submitter-reviewer-rounds.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/backlog/T-166-define-adaptable-consensus-graph-function-for-submitter-reviewer-rounds.md
  - .ai-workspace/tickets/completed/T-005-reprice-consensus-as-reusable-graph-function-plugin.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_REVIEW_GRAPH_FUNCTION.md
  - build_tenants/typescript/code/src/review/
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/graph/overlay.ts
  - build_tenants/typescript/code/src/tickets/
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/test_env/tests/
excluded_boundary:
  - ABG runtime ownership of frames, events, continuations, projection, replay, or traversal truth
  - direct ticket status mutation from review output
  - direct implementation of review findings without T-162 ticket workflow admission
  - consensus same-surface refinement law owned by T-166
  - comment-only, chat-only, or prompt-only review decisions
target_truth: Review is a reusable higher-order graph-function family over any typed surface. It fans out assessment to one or more configured reviewer profiles, reduces findings into explicit rulings, and emits TICKET_METHOD-shaped decision rows, draft tickets, split tickets, deferments, or rejected findings for the host ticket workflow to admit or reject.
superseded_truth: Review findings remain comments, prose summaries, chat memory, or ad hoc implementation choices where some findings are silently applied, ignored, or split without a ticket-shaped decision surface.
closure_law: This backlog closes only when the TypeScript design defines Review separately from Consensus, declares its multi-reviewer assessment carriers, finding/ruling schema, ticket-generation policy, host-binding law, and proof obligations, and proves that T-162 can consume review output as ticket workflow input without review output becoming ticket status authority.
evaluation_criteria:
  - review graph function supports multiple reviewers over any typed surface
  - reviewer selection is supplied by configured reviewer profiles or review panel bindings, not ad hoc prompt names
  - review preserves reviewer profile id, profile config digest, invocation ref, output digest, and evidence refs
  - review outputs structured findings and rulings rather than refactoring the reviewed surface directly
  - review can emit zero, one, or many TICKET_METHOD-shaped draft tickets or split-ticket refs
  - accepted, rejected, deferred, split-ticket, and needs-consensus rulings remain visible
  - review output can route a finding into T-166 consensus when same-surface refinement is required before a ticket is generated
  - T-162 admits or rejects review-produced tickets and decision rows before implementation begins
  - query-domain can distinguish review projections, consensus projections, and ticket workflow projections
proof_surface:
  - design module for reusable review graph-function family
  - catalog projection showing reusable review function and at least two host bindings
  - deterministic test for multi-reviewer findings over a ticket surface producing decision rows
  - deterministic test for configured `codex` and `claude` reviewer profiles producing separately attributed findings
  - deterministic test for code-review findings producing accepted/deferred/split-ticket outputs
  - deterministic test that review output cannot change ticket status without T-162 admission
  - deterministic test that a needs-consensus finding routes to the T-166 same-surface consensus path
non_closure_conditions:
  - review is implemented as comment parsing without graph-function carriers
  - review selects Claude, Codex, or any reviewer by hardcoded branch, current chat identity, or ambient environment default
  - review accepts reviewer output without a matching reviewer profile, config digest, invocation ref, and output schema
  - review emits prose findings with no typed finding ids, reviewer refs, ruling refs, or ticket refs
  - review directly mutates ticket status, code, specification, product assets, or closure decisions
  - implementation starts from review output before T-162 admits the ticket or decision row
  - review and consensus are collapsed into one ambiguous mechanism
  - rejected, deferred, or split findings disappear from the projection
---

# T-167: Review Graph Function For Ticket Generation

## STDO Triage

First missing layer: design.

Review and consensus share reviewer participation, but their product shapes are
different.

Review is a graph function over a surface that produces work classification:

```text
surface A
  -> configured reviewer_1 findings
  -> configured reviewer_n findings
  -> finding reduction and rulings
  -> decision rows / draft tickets / split tickets / deferments / rejections
```

Consensus is a same-surface refinement loop owned by T-166:

```text
surface A
  -> reviewer feedback
  -> submitter response
  -> surface A' | done | recurse
```

This ticket owns the first path. It makes review reusable across ticket review,
code review, design review, strategy review, schema review, and proof review
without turning review comments into status authority.

## Design Claim

Review is not implementation permission by itself.

Review produces typed work-routing artifacts. The host workflow decides whether
those artifacts become admitted work.

For `odd_sdlc`, the primary host is T-162:

```text
Review(surface)
  -> SdlcReviewFindingDecisionRow[]
  -> draft ticket(s) or split-ticket refs
  -> T-162 ticket workflow validation/admission
  -> implementation only after admission
```

Review may also decide that a finding requires consensus rather than immediate
ticket generation:

```text
finding
  -> needs_consensus
  -> T-166 consensus over the subject surface
  -> reviewed/refined surface
  -> review resumes or ticket workflow admits work
```

## Candidate Graph-Function Family

Exact names can be refined during design, but the family should start here:

```text
Fg_review_surface
  subject surface + review panel binding + review policy -> findings and rulings

Fg_reduce_review_findings
  reviewer findings + routing policy -> decision rows

Fg_route_review_to_tickets
  decision rows + TICKET_METHOD policy -> draft tickets / split ticket refs

Fg_review_until_routed
  composed review function that ends when all findings are rejected, deferred,
  ticketed, split, or routed to consensus
```

## Carrier Set

The design should define at least:

- `ReviewSubjectRef`
- `ReviewReviewerProfile`
- `ReviewReviewerRef`
- `ReviewReviewerSet`
- `ReviewAssignment`
- `ReviewPanelBinding`
- `ReviewReviewerInvocationRef`
- `ReviewFinding`
- `ReviewFindingSet`
- `ReviewReductionPolicy`
- `ReviewFindingDecisionRow`
- `ReviewTicketDraft`
- `ReviewSplitTicketRef`
- `ReviewResidualPressure`
- `ReviewHostBinding`

`ReviewFindingDecisionRow` should support at least:

- `accepted`
- `rejected`
- `deferred`
- `split_ticket`
- `needs_consensus`
- `blocked`

`ReviewReviewerProfile` should cover stable reviewer identity, reviewer kind,
capabilities, transport contract, prompt or policy reference, output schema,
evidence contract, availability state, and scope limits. Concrete profiles may
include `reviewer://odd-sdlc/codex`, `reviewer://odd-sdlc/claude`, human
reviewers, or service reviewers, but the graph function must treat them through
the same configured profile contract.

## T-162 Use Case

Under T-162, Review is the graph-function family for code-review findings and
ticket review findings:

```text
code review artifact or ticket surface
  -> selected reviewer profiles or review panel binding
  -> multiple reviewer findings
  -> accepted / rejected / deferred / split / needs_consensus rulings
  -> draft tickets or ticket decision rows
  -> T-162 validation and admission
```

The review output is evidence and work-routing input. It cannot close a ticket
or authorize implementation until T-162 admits the result.

Under T-162, short operator names such as `codex` and `claude` resolve through
the reviewer profile registry before Review executes. A missing, unavailable, or
schema-incompatible reviewer blocks the review act with typed reasons instead of
falling back to the current operator or silently dropping that reviewer.

## Boundary

This ticket enables future graph overlays and graph functions. It does not
authorize a review bot, UI workflow, or implementation behavior change before
the reusable review design is ratified.
