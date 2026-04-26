---
id: T-038
title: Qualify odd_sdlc TypeScript RC against Python functionality and ODD scenarios
type: qualification
ticket_category: build_wave
status: backlog
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Prove that odd_sdlc.TS reaches RC readiness through scenario, sandbox, live, and comparison evidence rather than through green unit tests alone.
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: TypeScript RC gate, qualification portfolio, data_mapper fixture, Python comparison matrix, release notes
priority: critical
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
dependencies:
  - T-037 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: operator requirement to build odd_sdlc.TS from needed Python functionality and ABIogenesis TypeScript research-lab readiness
target_truth: odd_sdlc.TS has an RC qualification report stating what is at parity with Python, what is intentionally different, what remains out of scope, and which ODD scenario proofs passed.
superseded_truth: RC readiness is inferred from compile success or a small deterministic test set.
closure_law: this ticket closes when the TS tenant passes full semantic, sandbox, and live/worker-backed qualification gates appropriate to the release claim and publishes a postmortem-style comparison to Python.
evaluation_criteria:
  - unit tests prove module-derived carriers and admission laws
  - UAT/sandbox tests prove requirements-derived workflows
  - data_mapper fixture or successor proves real imported-workspace behavior
  - live F_P worker tests prove actual probabilistic traversal where claimed
  - report compares Python functionality: install, normalize, start, gaps, triage, constructors, traceability, operational return, and release
  - every remaining gap has a backlog ticket
proof_surface:
  - test surface map
  - semantic/unit test results
  - sandbox and live run archives
  - RC readiness report
  - Python parity/gap matrix
non_closure_conditions:
  - no live/sandbox evidence for claimed F_P behavior
  - Python behavior gaps are undocumented
  - generated code only satisfies traceability shell criteria
  - release claim outruns product/design authority
---

## STDO Reading

This is the release-readiness gate for the TS build wave.
