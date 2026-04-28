---
id: T-072
title: Derive downstream capability inventory from requirements, design, and modules
type: feature
ticket_category: rc_blocker
status: completed
resolution: consolidated_into_T-066
completion_type: consolidation_only_not_implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Replace file-count or one-file smoke proof with a graph-derived downstream capability inventory that requires the same functional capability families test35 realized, implemented correctly through TypeScript ODD graph functions and deterministic evaluators.
change_class: design_reframe
re_entry_point: design
affected_boundary: requirement/design/module traceability, authority-to-code gap analysis, implementation profile, realization output contract, deterministic inventory evaluator, data_mapper qualification comparator
priority: critical
triaged_at: 2026-04-27T12:12:00Z
created_at: 2026-04-27T12:12:00Z
updated_at: 2026-04-27T12:12:00Z
dependencies:
  - T-041
  - T-066
  - T-070
governance_scope: STDO Method
consolidated_into:
  - T-066
consolidation_reason: capability inventory is an evaluator/input surface for downstream product materialization closure under the active domain model, not a separate design track.
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260427T120602Z_AUDIT_data_mapper_test35_traversal_vs_current_ts_success_gap.md
test35_observed_capability: the realized downstream product has domain-shaped CDME modules and broad requirement-scale assessments, not a single generated source file.
current_ts_status: T-066 requires materialized source/test files, but current smoke proves only one source file and one test file.
gap: TypeScript has no explicit capability inventory requiring the test35 functional families: compiler, fidelity, adjoint, assurance, accounting, executor, and engine.
fill: derive a capability and module inventory from admitted requirements/design/module/profile truth, bind it to realization postflight, and emit authority-to-code findings as retry-driving gap evidence.
target_truth: source realization closes against a declared downstream capability inventory matching test35 functionality, not against the mere presence of files.
superseded_truth: any non-empty source file manifest is sufficient product-code realization.
closure_law: this ticket closes only when TypeScript derives a downstream capability inventory from admitted upstream truth, rejects missing required families, and records explicit repricing for any intentionally omitted test35 capability family.
evaluation_criteria:
  - inventory carrier names required capability families, module roots, expected source roles, and trace authorities
  - data_mapper successor inventory includes compiler, fidelity, adjoint, assurance, accounting, executor, and engine capability families unless a separate requirement-level repricing ticket explicitly withdraws one
  - inventory is derived from admitted requirements/design/module/profile surfaces
  - inventory evaluator compares authority obligations against realized code inventory, public exports, implementation roles, and trace declarations
  - postflight rejects source inventory missing required families unless a repricing record is admitted
  - missing or weak capability coverage emits authority-to-code gap dossier entries consumable by recursive realization
  - data_mapper comparator requires functional coverage of the test35 capability families; exact file counts are secondary diagnostics, not permission to omit functionality
  - tests include a same-file-count/different-capability negative case
proof_surface:
  - design update for capability inventory carrier
  - deterministic inventory evaluator tests
  - installed data_mapper successor inventory report
  - update to T-041 blocker map
non_closure_conditions:
  - hardcoded data_mapper/CDME module names are treated as generic product law
  - exact test35 file counts become the closure rule
  - source inventory closes on file count without capability role coverage
  - missing capabilities are silently ignored
---

## Design Method Notes

This ticket is the local/global optimization guard against blindly porting
Python output shape. It must preserve capability equivalence while allowing
ODD-native TypeScript to be smaller where lawful.

This is also the authority-to-code gap-analysis ticket. Its output is not just
a report; it is one of the closure-pressure carriers that tells the graph
whether to stop, retry, deepen, or reprice.

Design Module Method obligations:

- publish a carrier diagram for requirement/design/module to capability inventory
- make inventory evaluation deterministic and replayable
- separate generic inventory law from data_mapper-specific comparator fixtures
- document any local/global optimization that reduces surface area versus test35
