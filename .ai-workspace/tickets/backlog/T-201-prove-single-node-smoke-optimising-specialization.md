---
id: T-201
title: Prove single-node smoke optimising specialization
type: feature
ticket_category: ordinary
status: backlog
goal: bounded-smoke-work-can-use-an-admitted-optimised-single-node-specialization
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Prove the optimized single-node smoke specialization split from T-165. The
  TypeScript tenant should admit a bounded smoke-product specialization that
  preserves target-carrier, review/evaluation, gain, closure, and replay proof,
  while falling back to generic F_P when the specialization envelope is not
  admitted.
change_class: design_reframe
re_entry_point: design
priority: medium
triaged_at: 2026-06-13
created_at: 2026-06-13
updated_at: 2026-06-13
governance_scope: STDO Method
migration_strategy: inside_out_hard_break
library_usage: extend
governing_library:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
source_ticket: .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/active/T-200-implement-depth-traversal-function-and-decomposition-trace-foldback.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/completed/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/active/T-200-implement-depth-traversal-function-and-decomposition-trace-foldback.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
excluded_boundary:
  - replacing generic F_P execution as baseline
  - bypassing edge assurance contracts
  - accepting an optimized path without admitted applicability envelope and fallback
target_truth: >-
  Bounded smoke-product work can use an admitted optimized single-node
  specialization when landscape facts, applicability envelope, edge contracts,
  and proof lane authorize it. Generic F_P remains the baseline when the
  envelope is not admitted.
superseded_truth: >-
  Smoke optimization is either hardcoded public-start branching or an
  unverified shortcut that claims closure without preserving target-carrier,
  review/evaluation, gain, closure, and replay proof.
closure_law: >-
  This ticket closes only when the TypeScript tenant publishes and proves a
  bounded optimized single-node smoke path, preserves deep proof at closure,
  proves one admitted specialization and one non-admitted fallback, and records
  enough evidence to generalize the specialization lifecycle without weakening
  generic F_P baseline law.
evaluation_criteria:
  - optimized smoke path is catalog/design visible and not public-start hardcoding
  - target carrier, review/evaluation, gain, closure, and replay artifacts remain admitted and traceable
  - one admissible deterministic smoke specialization runs
  - one non-admissible case falls back to generic F_P
  - optimization state remains a read model/admitted binding and does not become closure authority
proof_surface:
  - design update for optimized single-node smoke specialization
  - focused admissible/non-admissible tests
  - T-132-class live proof using bootstrap/proportionality plus one transform F_P and one eval F_P
non_closure_conditions:
  - smoke path is selected by public-start branch logic without admitted overlay binding
  - specialization bypasses edge assurance contracts
  - replay/closure evidence is thinner than generic F_P evidence
  - non-admissible envelope does not fall back to generic F_P
---

# T-201: Single-Node Smoke Optimising Specialization

## STDO Triage

First missing layer: design.

T-165 established the optimising-overlay foundation. This backlog ticket owns
the bounded single-node smoke proof and later generalization evidence. It stays
separate from T-200 because depth traversal is a graph expansion problem, while
smoke specialization is a bounded deterministic-envelope proof.

## Work Ledger

| id | task | proof | status |
| --- | --- | --- | --- |
| S1 | Design optimized single iterative smoke node. | design declares applicability envelope, edge contracts, fallback, and proof lane | pending |
| S2 | Implement admitted smoke specialization. | tests prove admissible specialization and non-admissible fallback | pending |
| S3 | Preserve deep closure proof. | target carrier, evaluation, gain, closure, and replay artifacts match generic proof requirements | pending |
| S4 | Run T-132-class live proof. | live run uses bootstrap/proportionality plus one transform F_P and one eval F_P | pending |
