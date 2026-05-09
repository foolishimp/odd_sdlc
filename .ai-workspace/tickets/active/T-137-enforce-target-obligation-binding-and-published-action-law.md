---
id: T-137
title: Enforce target obligation binding and published action law
type: feature
ticket_category: implementation_migration
status: active
review_status: triaged_pending_implementation
goal: typescript-rc-target-bound-evaluator-actions
build_tenant: typescript
owner: odd_sdlc
change_intent: Implement exact target obligation binding so declared product/document/code gaps can only be satisfied by published lawful graph actions bound to those exact target assets.
change_class: realization_refactor
re_entry_point: code
affected_boundary:
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/projection/
  - build_tenants/typescript/code/src/spec_method/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/fixtures/
priority: critical
rc_blocker: true
release_blocker_reason: Declared target assets/actions can still fall back to broad graph traversal when exact published action binding is missing.
migration_strategy: inside_out_hard_break
library_usage: extend
governing_library: T-109 traversal consequence carriers, odd_sdlc action catalog, and ABG evaluator substrate
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-109 publish authoritative edge ledger lineage chain
  - T-134 define bootstrap_sdlc induction graph function
related_tickets:
  - T-133 create minimum overhead Rust hello-world live lane
  - T-132 create hello-world five-language suite live proof lane
  - T-135 realize evaluator-owned runner traversal spine
intake_source: The hello-world/Rust lanes exposed that a declared narrow product target can fall back to a broad bootstrap/release graph when the desired action is unpublished. The T-109 axioms now state that declared target/action scope is governed by published-action law before default graph following.
target_truth: Every constructive action is preceded by TargetObligationBinding from gap pressure to exact target assets, required roles, evidence refs, and admissible graph outcomes. If a declared target action is unpublished, the evaluator emits a typed no-action disposition rather than falling back to a broad executive graph.
superseded_truth: A broad documentation or release self-test edge can be selected as a fallback for a declared product-file gap when the exact product graph action is missing.
closure_law: This ticket closes only when target binding is a typed carrier consumed by evaluator/runner selection, and deterministic regressions prove both positive target-bound action selection and negative no-action behavior for unpublished target actions.
evaluation_criteria:
  - Define or reuse a typed TargetObligationBinding carrier.
  - Bind gap pressure rows to target asset refs, target role, expected evidence, and admissible graph outcomes.
  - Bind action catalog rows to graph functions/vectors that can produce the declared target assets.
  - Declared target asset/action scope takes precedence over default graph following.
  - If a declared action is unpublished, evaluator returns typed no-action/block/reprice disposition according to policy; it does not run a broad fallback graph.
  - If a current graph edge is the lawful published action for the declared target, graph following remains lawful.
  - A regression proves Rust hello-world missing `Cargo.toml`/`src/main.rs` becomes target pressure, not broad bootstrap_release_self_test.
  - A regression proves bootstrap_sdlc can produce authority surfaces and then expose the next target action without constructing product files.
  - A regression proves a broad documentation edge cannot close a product-file target unless explicitly bound to that target.
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t137_target_obligation_binding.test.mjs
  - build_tenants/typescript/test_env/fixtures/t133_rust_hello_world_bootstrap_sandbox/
  - evaluator/gaps projection showing target-bound admissible action rows
non_closure_conditions:
  - Target binding exists only as worker prompt text.
  - Action catalog rows do not declare target assets/outcomes.
  - Unpublished narrow action falls back to bootstrap_release_self_test or another broad graph.
  - Default graph following bypasses declared target/action scope.
  - Product-file gaps are considered satisfied by unrelated documentation assets.
---

# T-137: Enforce Target Obligation Binding And Published Action Law

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

Change-class note: this is a realization refactor only under the T-109 design
surface. This ticket cannot close until T-109 ratifies target binding and
published-action precedence.

The design law is already present in T-109. This ticket implements the missing
binding carrier and evaluator guard.

## Migration Declaration

- migration strategy: `inside_out_hard_break`
- old truth path: broad graph/default edge selection can satisfy or bypass a
  declared narrow target when the exact action is unpublished or unbound.
- new truth path: `TargetObligationBinding` binds gap pressure to exact target
  assets, required evidence, and published graph/action outcomes before
  evaluator ranking or runner invocation.
- old producers: query-domain/gaps local candidates, broad bootstrap/release
  target setup, installed runner fallback, prompt pressure over target prose.
- new producers: target obligation binding carrier, graph/action catalog target
  declarations, evaluator priority projection.
- old consumers: runner dispatch, public gaps, hello-world live lanes, bootstrap
  harnesses, closure/reporting surfaces.
- new consumers: evaluator projection, runner intent admission, gaps read-only
  display, bootstrap/hello-world regression harnesses.
- projections/proof surfaces: target-bound evaluator projection, gaps JSON,
  T133/T134 fixtures, target-binding deterministic tests.
- migration closure: declared target/action scope can no longer be satisfied by
  an unrelated broad graph edge or unpublished fallback action.

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

- [ ] Target binding is a typed carrier, not prompt text or open payload prose.
- [ ] Evaluator ranking consumes target binding and published action rows.
- [ ] Declared target/action scope takes precedence over default graph
      following.
- [ ] Broad graph edges cannot satisfy product-file gaps unless explicitly bound
      to the target assets.
- [ ] Missing publication yields typed no-action/block/reprice truth, not broad
      fallback traversal.

## Impacted Interface Review Checklist

- [ ] graph catalog: declares target assets/outcomes needed for binding.
- [ ] query-domain/gaps: displays target-bound candidates without inventing
      action authority.
- [ ] installed runner: refuses broad fallback when declared target/action is
      unpublished.
- [ ] bootstrap_sdlc lane: produces authority surfaces and exposes next action
      without broad construction.
- [ ] T133 Rust hello-world lane: missing product files become target pressure,
      not bootstrap_release_self_test fallback.

## Required Break Order

1. Inventory all places that map gaps to broad graph actions.
2. Publish/consume target obligation binding over graph/action catalog rows.
3. Break broad fallback for declared target/action scope.
4. Rebind evaluator ranking to target-bound published actions.
5. Rebind runner/public gaps/bootstrap fixtures to the target-bound projection.
6. Reprice tests that accepted broad fallback as progress.

## Break-To-Closure Map

- Breaking broad fallback closes the T133 substitution defect.
- Binding graph/action rows to target assets closes the action-catalog authority
  clause.
- Rebinding gaps/runner to target binding closes the one-surface clause.

## Mixed-State Negative Proof

At least one fixture must declare a narrow product target while leaving its
graph action unpublished. A broad graph edge must be available. The evaluator
must emit typed no-action/block/reprice truth rather than selecting the broad
edge.

## Core Rule

```text
gap pressure + target assets + required roles + evidence refs
-> TargetObligationBinding
```

The evaluator may rank only published lawful actions that bind to the declared
target. Missing publication is a typed no-action disposition, not fallback.

## Implementation Notes

- Keep the carrier generic to odd_sdlc domain assets; do not hardcode Rust,
  Cargo, or hello-world as core law.
- Put Rust/hello-world only in fixtures and tests.
- The product owns target meaning. ABG owns traversal/admission mechanics.
