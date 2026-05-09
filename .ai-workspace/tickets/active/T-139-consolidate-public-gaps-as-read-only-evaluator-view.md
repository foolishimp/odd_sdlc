---
id: T-139
title: Consolidate public gaps as read-only evaluator view
type: feature
ticket_category: implementation_migration
status: active
review_status: triaged_pending_implementation
goal: typescript-rc-one-public-evaluator-surface
build_tenant: typescript
owner: odd_sdlc
change_intent: Ensure `gaps`, query-domain, live status, and CLI summaries render the same evaluator projection consumed by the runner without creating local ranking, local action refs, or executable traversal authority.
change_class: realization_refactor
re_entry_point: code
affected_boundary:
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/cli/command.ts
  - build_tenants/typescript/code/src/qualification/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
priority: high
rc_blocker: true
release_blocker_reason: Public gaps/query-domain can still become a second ranking/action surface unless migrated to read-only evaluator projection.
migration_strategy: inside_out_hard_break
library_usage: consume
governing_library: T-109 traversal consequence carriers and ABG 3.7.1 construction evaluator projection
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-109 publish authoritative edge ledger lineage chain
  - T-135 realize evaluator-owned runner traversal spine
related_tickets:
  - T-129 ABG 3.7.1 evaluator and liveness substrate migration
  - T-133 create minimum overhead Rust hello-world live lane
  - T-134 define bootstrap_sdlc induction graph function
intake_source: The T-109 axiom review states that public gaps is a read-only evaluator view. It must display the same truth the runner consumes but must not append events, invoke workers, admit intent, or choose traversal by itself.
target_truth: Public gaps, query-domain, live status, and RC summaries project the evaluator consequence surface. They may expose candidate actions, ranking reasons, closure dispositions, yield/resume state, and target bindings as read-only rows. They do not fabricate action refs or own ranking law.
superseded_truth: Public surfaces compute local `nextLawfulActions`, local priority ordering, or local action refs that can drift from evaluator/runner truth.
closure_law: This ticket closes only when public surfaces render evaluator truth through one adapter, deterministic tests prove no local ranking/action fabrication remains, and CLI output explicitly marks read-only projections as non-executable.
evaluation_criteria:
  - Public gaps consumes EvaluatorProjection or its odd_sdlc adapter as the single source of ranking truth.
  - Query-domain uses the same projection for candidate action display.
  - CLI summaries do not synthesize retry context or traversal choice.
  - Public rows carry `readOnly: true` or equivalent non-executable disposition.
  - Public rows expose `choosesNextTraversal: false` unless the actual runner has admitted an executable intent.
  - Public action refs are refs to published action catalog/evaluator rows, not fabricated read-model ids.
  - Priority policy refs/digests are visible when ranking is displayed.
  - A negative test proves changing local lexical/status order cannot change public ranking when evaluator projection is unchanged.
  - A negative test proves a public gaps candidate cannot be fed directly into runner invocation without admitted intent.
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t139_public_gaps_read_only_evaluator_view.test.mjs
  - focused CLI/gaps JSON fixtures showing evaluator refs and read-only disposition
non_closure_conditions:
  - `gaps` computes a separate local sort or priority law.
  - `nextLawfulActions` is treated as executable traversal authority.
  - Public gaps fabricates action/catalog refs instead of projecting published/evaluator refs.
  - CLI command code owns retry or re-entry control.
  - RC/live-status summaries disagree with evaluator/closure truth.
---

# T-139: Consolidate Public Gaps As Read-Only Evaluator View

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

Change-class note: this is a realization refactor only under the T-109 design
surface. This ticket cannot close until T-109 ratifies public gaps as read-only
evaluator view.

The product rule is settled: gaps is a read-only interface over the evaluator.
This ticket makes the public surfaces obey that rule.

## Migration Declaration

- migration strategy: `inside_out_hard_break`
- old truth path: gaps/query-domain/live-status/CLI summaries derive local
  ranking, local `nextLawfulActions`, fabricated action refs, or executable
  traversal hints.
- new truth path: public surfaces render `EvaluatorProjection` and related
  T-109 consequence carriers as read-only rows.
- old producers: query-domain local sorting, gaps action-list builders, CLI
  summary synthesis, RC/live-status local projection code.
- new producers: evaluator projection, closure decision, target binding, visible
  policy refs, published action catalog refs.
- old consumers: CLI users, live harnesses, RC reports, operator summaries,
  downstream automation reading `nextLawfulActions`.
- new consumers: CLI/rendering only, public gaps read-only JSON, RC/live-status
  summaries derived from evaluator refs.
- projections/proof surfaces: gaps JSON, query-domain output, CLI output,
  live-status/RC summaries, read-only evaluator tests.
- migration closure: public surfaces can display candidate actions but cannot
  fabricate, rank, or execute traversal truth.

## Migration Checklist

- [ ] old truth path is named explicitly
- [ ] new truth path is named explicitly
- [ ] producer set for the new truth is listed
- [ ] consumer set for the new truth is listed
- [ ] projection/read-model surfaces are listed
- [ ] old truth path is removed or explicitly demoted from authority
- [ ] mixed-state behavior is no longer accepted as closure evidence
- [ ] tests proving mixed old/new behavior are removed or repriced
- [ ] recurring realization patterns are checked against existing library/commonization surfaces
- [ ] ticket declares library usage and names the governing library or rationale
- [ ] if the work exists in more than one build tenant, this backlog/active ticket carries only one tenant lifecycle and any sibling tenant work lives on its own suffixed ticket
- [ ] ticket wording, product wording, and proof claims are reconciled before closure

## Functional Review Criteria

- [ ] Gaps/query-domain/CLI outputs derive from evaluator projection.
- [ ] Public rows identify their evaluator/closure/target-binding source refs.
- [ ] Public outputs are read-only and non-executable by construction.
- [ ] Local lexical/status sorting cannot alter ranking.
- [ ] Public action refs are projected catalog/evaluator refs, not fabricated
      read-model ids.

## Impacted Interface Review Checklist

- [ ] `projection/query_domain.ts`: no local ranking law or fabricated action
      authority.
- [ ] `spec_method/entry.ts`: gaps output preserves read-only evaluator refs.
- [ ] `cli/command.ts`: renders public truth only; does not synthesize retry or
      traversal choice.
- [ ] RC report/live status: derived from evaluator/closure truth.
- [ ] tests/fixtures: legacy `nextLawfulActions` expectations are repriced to
      read-only candidate display where needed.

## Required Break Order

1. Inventory public surfaces that expose next-action/candidate/ranking data.
2. Publish/consume evaluator projection as the one read-model source.
3. Break local ranking/action-ref fabrication in gaps/query-domain.
4. Rebind CLI, live status, and RC reports to the evaluator projection.
5. Reprice tests that treated public gaps as executable authority.

## Break-To-Closure Map

- Breaking local ranking closes the one-public-evaluator-surface clause.
- Breaking fabricated action refs closes the published-action-ref clause.
- Rebinding CLI/live/RC summaries closes the public consumer clause.

## Mixed-State Negative Proof

At least one test must make old local ranking disagree with evaluator ranking.
The public output must follow evaluator truth or fail closed; local ranking must
not win.

## Boundary

Public gaps may show:

- current closure disposition
- target obligation bindings
- candidate action refs
- ranking reasons
- yield/resume state
- block/reprice reasons

Public gaps may not:

- append events
- admit intent
- invoke workers
- decide traversal
- invent action refs
- compute a separate ranking law
