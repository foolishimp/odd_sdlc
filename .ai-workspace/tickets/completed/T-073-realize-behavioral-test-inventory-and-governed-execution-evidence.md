---
id: T-073
title: Realize behavioral test inventory and governed execution evidence
type: feature
ticket_category: rc_blocker
status: completed
resolution: consolidated_into_T-066
completion_type: consolidation_only_not_implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Close the test35 correspondence for product tests and execution proof by requiring behavioral test inventory plus governed build/test dispatch evidence before TypeScript data_mapper realization can close.
change_class: design_reframe
re_entry_point: design
affected_boundary: test design/module realization, code-to-test gap analysis, generated test source inventory, execution contract, JUnit report parsing, qualification archive, requirement closure
priority: critical
triaged_at: 2026-04-27T12:12:00Z
created_at: 2026-04-27T12:12:00Z
updated_at: 2026-04-27T12:12:00Z
dependencies:
  - T-041
  - T-066
  - T-070
  - T-072
governance_scope: STDO Method
consolidated_into:
  - T-066
consolidation_reason: behavioral test inventory and execution evidence are closure evaluators for product materialization under the active domain model, not an independent design track.
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260427T120602Z_AUDIT_data_mapper_test35_traversal_vs_current_ts_success_gap.md
test35_observed_capability: test35 admits `sbt test` evidence with 173 passing tests, parsed reports, and requirement execution evidence.
current_ts_status: current TypeScript data_mapper smoke has one generated test file and zero JUnit reports.
gap: TypeScript can produce test-shaped source without proving behavioral coverage of realized code or executing the downstream test contract.
fill: derive a behavioral test inventory from requirements/design/modules and realized code, execute the declared test command, parse reports, bind results to closure, and emit code-to-test findings as retry-driving gap evidence.
target_truth: test realization closes only when behavioral test source and governed execution evidence are admitted.
superseded_truth: a trace-bearing generated test shell is sufficient evidence of test realization.
closure_law: this ticket closes only when a fresh installed data_mapper successor run produces non-trivial behavioral tests, executes the declared test command, parses report files, and blocks closure on failures, zero reports, or scaffold-only tests.
evaluation_criteria:
  - test inventory carrier declares behavioral obligations, not only filenames
  - generated tests trace to requirement/scenario/module truth
  - test inventory compares realized code surfaces and behaviors against behavioral tests
  - execution contract identifies working directory, command, expected report paths, and result parser
  - `sbt test` or the admitted tenant test command is dispatched under governed execution law
  - JUnit or equivalent reports are parsed into admitted execution-result carriers
  - requirement closure consumes execution evidence rather than test-source existence alone
  - missing tests, untested realized code, missing reports, failed reports, zero-count reports, and scaffold-only test suites become code-to-test gap dossier entries consumable by recursive realization
proof_surface:
  - test inventory and execution design update
  - deterministic parser/evaluator tests
  - installed data_mapper successor run archive with report evidence
  - requirement closure report update
non_closure_conditions:
  - tests exist but no governed execution dispatch occurs
  - execution reports are absent, zero-count, or not parsed
  - tests only assert generated placeholders or trace strings
  - closure relies on source-tree unit tests instead of downstream workspace execution evidence
---

## Design Method Notes

This ticket owns proof shape for tests. It must keep UAT/requirement-derived
proof distinct from module-derived unit proof while allowing both to appear in
the downstream product.

Design Module Method obligations:

- separate test inventory carriers from execution-result carriers
- keep execution dispatch as an explicit effect boundary
- make report parsing deterministic and fail-closed
- require local/global optimization review before closure

This ticket owns code-to-test honesty for iteration. A missing or weak test
result is not an operator note; it is traversal pressure.
