---
id: T-071
title: Realize honest-gap-driven recursive deepening over installed graph program
type: feature
ticket_category: rc_blocker
status: completed
resolution: consolidated_into_T-076
completion_type: consolidation_only_not_implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Restore the root test35 capability in the TypeScript line: an installed graph program can re-enter the same realization edge because honest gap analysis refuses shallow closure, using prior workspace state and prior gap evidence until realization reaches test35 functional parity or is explicitly repriced.
change_class: design_reframe
re_entry_point: design
affected_boundary: graph-function execution, ABG continuation/re-entry, installed operator loop, gap dossier, realization state handoff, worker result admission
priority: critical
triaged_at: 2026-04-27T12:12:00Z
created_at: 2026-04-27T12:12:00Z
updated_at: 2026-04-27T12:12:00Z
dependencies:
  - T-041
  - T-066
  - T-070
  - T-072
  - T-073
  - T-074
  - B-068 completed
  - B-069 completed
  - abiogenesis/T-084
governance_scope: STDO Method
consolidated_into:
  - T-076
consolidation_reason: recursive deepening is a fixed-point consequence of the active total transition function over admitted state and gap evidence, not a separate operator-loop design.
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260427T120602Z_AUDIT_data_mapper_test35_traversal_vs_current_ts_success_gap.md
test35_observed_capability: repeated graph runs re-enter the same workspace, repair/deepen existing artifacts, and preserve proof failures as continuation pressure. The high iteration count is positive evidence: depth emerged because closure gates kept finding real gaps.
current_ts_status: B-068/B-069 prove retry feasibility in a sandbox; the installed data_mapper smoke does not prove recursive stateful deepening.
gap: TypeScript can traverse all vectors once and materialize minimal files because current gap analysis can be too weak to create retry pressure.
fill: make recursive realization a graph/ABG-owned installed operator behavior where deterministic and probabilistic gap analysis creates machine-consumable continuation pressure.
target_truth: installed TypeScript graph execution matches test35 recursive realization functionality: it lawfully re-enters realization edges over the same workspace because honest gap analysis finds unresolved authority-to-code or code-to-test obligations; each re-entry consumes prior artifacts and prior gaps; and the run continues until downstream source, test, and execution proof reach functional parity with the test35 capability set.
superseded_truth: a sandbox retry loop or a single all-vector traversal is sufficient proof of recursive realization.
closure_law: this ticket closes only when an installed data_mapper successor run shows at least one blocked realization proof, a continuation or re-entry decision, a next attempt that receives prior artifact state plus gap reasons, and a deeper admitted output.
evaluation_criteria:
  - realization state inventory is persisted after each materializing edge
  - gap dossier records blocking reasons in a machine-consumable carrier
  - gap analysis runs after every materializing edge and emits either closure authority or retry pressure
  - authority-to-code gap analysis compares requirements, design, and module truth against realized source inventory, exported surfaces, implemented behavior, and trace declarations
  - code-to-test gap analysis compares realized source inventory and behavior against generated test inventory, test execution coverage, and parsed report evidence
  - missing capability inventory, missing behavioral tests, missing execution evidence, shallow source, shallow tests, and contradicted conformed-profile truth all become gap dossier entries
  - next edge attempt includes prior artifact inventory and gap reasons in handoff
  - worker result admission can distinguish replace, deepen, repair, and repriced-no-change outcomes
  - ABG/runtime events expose proof failure, continuation/re-entry, dispatch, admission, and closure
  - high iteration count is treated as lawful progress when each iteration consumes prior gaps and reduces unresolved obligations
  - tests assert that attempt 2 fails if attempt 1 state/gaps are absent
  - installed data_mapper successor run proves the behavior outside the source-local sandbox
proof_surface:
  - recursive deepening design update
  - carrier/module design for realization state and gap handoff
  - sandbox proof with state-consuming re-entry assertion
  - installed data_mapper successor archive
non_closure_conditions:
  - attempt sequencing is driven by a local loop counter alone
  - re-entry happens outside ABG/GTL graph authority
  - prior state is archived but not consumed
  - the run only proves repeated attempts, not deepening
  - shallow output closes because gap analysis omitted required capability, test, execution, or evaluator checks
  - iteration count is low because the graph accepted false completion rather than because all obligations closed
---

## Design Method Notes

Under ODD alignment, continuation and "what work is next" belong to graph/ABG
authority. Deterministic modules may evaluate and carry state, but they must
not become a hidden runner.

Design Module Method obligations:

- model realization state and gap evidence as immutable typed carriers
- define transforms for state + gap -> next handoff
- keep effectful filesystem writes at explicit boundaries
- require a local/global optimization review before closure

## No-Ambiguity Diagnosis

Current TypeScript does not yet prove test35-class iteration for three concrete
reasons:

1. Shallow pass: when postflight passes, ABG replay receives `assessed` events
   and closes the current vector. Current evaluators can still accept a shallow
   output, so there is no retry pressure.
2. Failed postflight stop: when postflight fails, the installed operator
   returns `postflight_failed` and archives the failure, but it does not emit
   ABG retry/repair or continuation events. The next start may rediscover the
   same vector, but the run has not proved engine-owned recursive repair.
3. One-edge installed operator: `odd-sdlc-ts start --worker ...` invokes one
   F_P edge and returns `rerun_gaps_or_start_next_edge`. The current
   all-vector smoke is achieved by repeated command invocation in the
   qualification lane, not by one ABG-owned `until=converged` loop over worker
   dispatch, result admission, evaluation, retry, and continuation.

Therefore this ticket is not optional tuning. It is the work required to make
iteration real in the TypeScript SDLC line.

## Operator Correction: Depth Comes From Honest Gaps

The solution to test35 depth is not a larger one-shot generation prompt.

The solution is honest gap analysis that keeps reopening the realization edge
until the downstream product has actually satisfied two closure gaps:

- authority-to-code: requirements, design, and module truth versus realized
  source, public surfaces, implementation behavior, and trace declarations
- code-to-test: realized code versus behavioral test inventory, actual test
  execution, parsed reports, and requirement evidence

The high iteration count in test35 is evidence of the mechanism: gap analysis
created lawful retry pressure, and each accepted retry had to consume prior
workspace state and reduce unresolved obligations.

For this ticket, iteration is only meaningful when the gap dossier is truthful.
The graph must not treat minimal files, trace prose, placeholder tests, or
unexecuted build claims as closure. Those are inputs to the next traversal.

Potential ABG substrate gap:

- If ABG cannot own the loop from F_P dispatch through result ingestion,
  postflight/gap classification, retry/continuation emission, and next-vector
  selection when a synchronous process worker is attached, this must be raised
  and fixed in abiogenesis rather than implemented as an odd_sdlc-local runner.
