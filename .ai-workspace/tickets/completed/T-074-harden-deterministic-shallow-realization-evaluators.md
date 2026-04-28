---
id: T-074
title: Harden deterministic shallow-realization evaluators
type: defect
ticket_category: rc_blocker
status: completed
resolution: consolidated_into_T-066
completion_type: consolidation_only_not_implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Extend the first T-066 markdown-only guard into deterministic evaluators that reject shallow product realization: placeholders, identity pass-throughs, constant-success paths, unused inputs, unwired validations, and trace-only tests.
change_class: design_reframe
re_entry_point: design
affected_boundary: F_D evaluators, authority-to-code gap analysis, code-to-test gap analysis, postflight law, generated product inventory, worker result admission, requirement closure
priority: critical
triaged_at: 2026-04-27T12:12:00Z
created_at: 2026-04-27T12:12:00Z
updated_at: 2026-04-27T12:12:00Z
dependencies:
  - T-041
  - T-066
  - T-072
  - T-073
governance_scope: STDO Method
consolidated_into:
  - T-066
consolidation_reason: shallow-realization rejection is a deterministic evaluator family for product materialization closure under the active domain model, not a separate design track.
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260427T120602Z_AUDIT_data_mapper_test35_traversal_vs_current_ts_success_gap.md
test35_observed_capability: the runtime deepening control frame treats placeholders, pass-throughs, constant-success paths, unused inputs, and unwired validation as unresolved realization.
current_ts_status: TypeScript rejects markdown-only product materialization, but not all shallow implementation/test patterns.
gap: generated source/test files can be present while still not representing meaningful product behavior.
fill: add deterministic shallow-realization evaluators, make them closure gates for realization edges, and feed critical findings directly into authority-to-code and code-to-test gap analysis.
target_truth: product realization closure depends on behavioral sufficiency signals and rejects known shallow patterns.
superseded_truth: file presence plus traceability is enough to close code/test realization.
closure_law: this ticket closes only when deterministic evaluator tests prove rejection of placeholder implementations, constant-success logic, identity-only transforms, unused domain inputs, missing validation wiring, empty tests, and trace-only test shells.
evaluation_criteria:
  - evaluator carrier reports shallow-pattern findings with file path, role, severity, and trace authority
  - source evaluator catches placeholders, pass-throughs, constant-success paths, unused inputs, and missing validation wiring
  - test evaluator catches empty tests, trace-only assertions, no behavior assertions, and non-executed scaffold suites
  - findings identify whether they block authority-to-code closure, code-to-test closure, or both
  - postflight blocks closure when critical shallow findings exist
  - evaluator output feeds the gap dossier for recursive deepening
  - the next realization attempt receives evaluator findings as explicit repair/deepening obligations
proof_surface:
  - evaluator design update
  - fixture corpus of shallow and acceptable generated source/test files
  - postflight rejection tests
  - installed data_mapper successor archive showing findings or pass evidence
non_closure_conditions:
  - evaluator is only a warning surface
  - evaluator relies only on line counts
  - evaluator is data_mapper-specific
  - findings are not fed back into gap/re-entry evidence
  - findings are archived but the graph is still allowed to close the edge
---

## Design Method Notes

This ticket is a deterministic module boundary under Design Module Method.
It should be functional: admitted source/test inventory in, evaluator findings
out, no hidden workspace mutation.

Design Module Method obligations:

- publish IACS or equivalent for evaluator input/output carriers
- keep evaluation total or fail-closed
- isolate filesystem reads at an explicit adapter boundary
- avoid imperative "scan and decide" code that hides semantic rules

This ticket is the hard stop against false depth. If the evaluator finds
shallow realization, the system has discovered the next traversal input.
