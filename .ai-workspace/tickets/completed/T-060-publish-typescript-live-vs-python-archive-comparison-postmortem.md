---
id: T-060
title: Publish TypeScript live versus Python archive comparison postmortem
type: governance
ticket_category: rc_quality_gate
status: completed
goal: future-full-python-replacement-rc
change_intent: Publish a side-by-side evidence postmortem comparing the current TypeScript live data_mapper qualification run against relevant Python live and data_mapper qualification archive baselines.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript RC qualification, Python comparison evidence, full operational replacement go/no-go
priority: high
triaged_at: 2026-04-26T18:10:29Z
created_at: 2026-04-26T18:10:29Z
updated_at: 2026-04-26T18:10:29Z
completed_at: 2026-04-26T18:10:29Z
dependencies:
  - T-041
  - T-053 completed
  - T-054 completed
  - T-059 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: T-041 and the Python parity blocker map require side-by-side archive comparison before any full operational replacement claim.
target_truth: The TypeScript RC line has a durable comparison postmortem that separates current TS proof, historical Python live proof, Python data_mapper qualification chain proof, intentional differences, and remaining full-RC risks without treating data_mapper as odd_sdlc product scope.
superseded_truth: Python archive comparison can remain implicit in operator memory or scattered test-run folders.
closure_law: this ticket closes only when the comparison surface exists, is referenced from the blocker map and RC report, and states whether the evidence supports bounded RC, full operational RC, or a remaining blocker.
---

# T-060: TypeScript/Python Archive Comparison

## Completion Record

Delivered:

- `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_LIVE_PYTHON_ARCHIVE_COMPARISON.md`
- RC qualification report reference
- Python parity blocker map update
- T-038 guard assertion that the comparison surface exists

Finding:

- TypeScript has current passing live `data_mapper` single-edge `F_P`
  qualification proof.
- Python has older passing live code-edge proof and richer harnessed
  `data_mapper` qualification yield-chain proof.
- The evidence is enough for bounded TypeScript RC and current install/live
  preconditions.
- The evidence is not enough to claim full operational Python replacement if
  the bar is Python's historical multi-edge data_mapper qualification depth.

Boundary:

- `data_mapper` is an independent SDLC sufficiency workload.
- It is not `odd_sdlc` product scope.

Verification:

- `npm run test:t038` passed after the comparison surface was added.
