---
id: T-173
title: Define evaluator zoom admission from obligation-output ratios
type: feature
ticket_category: design_reframe
status: backlog
proof_status: proposed
priority: high
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-19
updated_at: 2026-05-19
triaged_at: 2026-05-19
goal: allow future traversal evaluation to insert or select an additional staged computation when the current abstraction stage is overloaded
change_class: requirement_reprice
re_entry_point: requirements
first_missing_layer: requirements
governance_scope: STDO Method / odd_sdlc TypeScript traversal evaluation
source_documents:
  - .ai-workspace/comments/codex/20260519T164333AEST_STRATEGY_staged_construction_computation_test35_test82.md
  - .ai-workspace/tickets/active/T-172-realize-staged-disambiguation-graph-and-decomposition-admission.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/17-target-carrier-contracts.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
related_tickets:
  - .ai-workspace/tickets/active/T-172-realize-staged-disambiguation-graph-and-decomposition-admission.md
  - .ai-workspace/tickets/completed/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md
affected_boundary:
  requirements:
    - specification/requirements/16-edge-gain-closure-contract.md
    - specification/requirements/17-target-carrier-contracts.md
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  graph_code:
    - build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts
    - build_tenants/typescript/code/src/graph/target_carrier_contracts.ts
  operator_code:
    - build_tenants/typescript/code/src/operator/traversal_consequence.ts
    - build_tenants/typescript/code/src/operator/installed_operator.ts
  analyzer_code:
    - build_tenants/typescript/code/src/analysis/run_analysis.ts
target_truth: After an abstraction stage, the evaluator measures input obligation count, output row count, fan-out ratio, max owned inputs per output, residual refs per output, public boundary count, and substantive downstream responsibility count. If the measured ratio is proportional, traversal continues. If the ratio is too large or residuals are carried outside the owning subsurface, the evaluator selects another lawful zoom stage before materialization.
superseded_truth: The graph shape is fixed for all products and all obligation scales; overloaded abstraction stages must be handled by the next materialization edge or by prompt discretion.
closure_law: This backlog ticket closes only when zoom admission is promoted to active work, requirements/design define evaluator-owned zoom semantics, runtime code can select a lawful intermediate stage from measured obligation-output ratios, and deterministic tests prove both continue and zoom outcomes.
evaluation_criteria:
  - zoom admission metrics include input obligation count, output row count, fan-out ratio, max owned inputs per output, residual refs per output, public boundary count, and substantive downstream responsibility count
  - thresholds are profile or edge-contract data rather than prompt prose
  - proportional measurements continue traversal without adding an intermediate stage
  - overloaded measurements select a lawful zoom stage before materialization
  - residuals carried outside the owning subsurface select a lawful zoom stage or block with replay-visible reason
  - analyzer reports zoom candidates, selected zoom action, thresholds, and measured values
  - deterministic tests cover continue, zoom, and block outcomes
non_closure_conditions:
  - zoom selection is implemented as prompt text without evaluator-owned consequence
  - zoom thresholds are hard-coded for data_mapper or test35 filenames
  - materialization edges still absorb overloaded abstraction stages without an admitted zoom/continue decision
  - steel-thread or parallel traversal is confused with zoom admission
---

# T-173: Define Evaluator Zoom Admission From Obligation-Output Ratios

## STDO Intake

Smallest lawful re-entry point: `requirements`.

Reason: zoom admission changes traversal law. It is not only another staged
surface. It lets the evaluator decide, from measured obligation-output ratios,
whether the next lawful action is to continue, insert/select another
intermediate stage, or block before materialization.

## Scope

This ticket is backlog. It is intentionally split out of active T-172.

T-172 realizes the fixed staged disambiguation graph and decomposition
admission. T-173 defines the later dynamic traversal evaluator that can zoom
when a specific product or stage has too much residual ambiguity for the next
surface.

## Zoom Admission

After each abstraction stage, the evaluator measures:

- input obligation count
- output row count
- fan-out ratio
- max owned inputs per output
- residual refs per output
- public boundary count
- substantive downstream responsibility count

If the measured ratio is proportional, traversal continues. If the ratio is
too large or residuals are carried outside the owning subsurface, the evaluator
selects another lawful zoom stage before materialization.

## Design Notes

Zoom admission must remain distinct from steel-thread or parallel traversal.

- steel-thread/parallel traversal chooses how to traverse admitted dependency
  maps
- zoom admission chooses whether the graph needs another intermediate
  disambiguation stage before materialization

The zoom decision is evaluator-owned. It must be replay-visible and cannot live
only in worker prompt language.
