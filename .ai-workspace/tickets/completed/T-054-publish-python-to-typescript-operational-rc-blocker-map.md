---
id: T-054
title: Publish Python-to-TypeScript operational RC blocker map
type: governance
ticket_category: rc_quality_gate
status: completed
goal: build-odd-sdlc-typescript-as-operational-candidate
change_intent: Create one durable map of Python-owned capabilities that are missing, partial, intentionally different, or already closed in odd_sdlc.TS before any full operational RC claim proceeds.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript RC qualification, Python parity assessment, backlog dependency ordering, live/sandbox/release proof surfaces
priority: high
triaged_at: 2026-04-26T16:30:18Z
created_at: 2026-04-26T16:30:18Z
updated_at: 2026-04-26T16:30:18Z
completed_at: 2026-04-26T16:30:18Z
dependencies:
  - T-041
  - T-053
  - T-052 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Operator request for a single map of missing Python features in TypeScript that block full operational RC.
target_truth: A single maintained blocker map names each Python capability relevant to operational RC, the current TypeScript status, the owning ticket, proof required, proof present, residual gap, and whether it blocks bounded package RC or full operational RC.
superseded_truth: The Python-to-TypeScript RC blocker state can remain scattered across T-041, T-053, the RC report, and review comments.
closure_law: This ticket closes only when the blocker map exists, is referenced by the RC qualification report and T-041, separates bounded package RC from full operational RC, and assigns every blocking gap to an owning backlog or completed ticket.
---

# T-054: Python-to-TypeScript Operational RC Blocker Map

## Problem

The current blocker state is real but scattered.

The TypeScript RC report has a Python comparison section. T-041 owns the broad
full operational replacement gap. T-053 owns the missing live `F_P` test lane.
T-052 closed ABG-populated installed sandbox proof. Review comments also carry
important findings.

That is not enough for controlled execution. Before working through the full
operational RC backlog, there must be one map that says what Python can do,
what TypeScript can do, what is intentionally different, what is missing, and
which gaps block which RC claim.

## Target Artifact

Create:

- `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_PYTHON_PARITY_RC_BLOCKER_MAP.md`

The map should be a current qualification surface, not historical commentary.

## Required Rows

At minimum, the map must cover:

- install and workspace normalization
- public CLI command grammar
- public start/gaps/release command flow
- ABG-installed sandbox population
- live external `F_P` data_mapper traversal
- graph-function program composition and ABG handoff
- constructor/evaluator hook execution
- traceability and requirement closure
- gap dossier/query/span projections
- triage and ticket-routing proposal
- operational build/test/runtime-return projection
- release-cut packaging and binary binding
- Python live archive comparison and postmortem

## Required Columns

Each row must state:

- Python capability
- TypeScript current status
- status class: `closed`, `bounded_parity`, `partial`, `missing`,
  `intentional_difference`, or `not_claimed`
- blocks bounded package RC: yes/no
- blocks full operational RC: yes/no
- owning ticket
- current proof surface
- required proof to close
- residual risk

## Evaluation Criteria

- The map is referenced from
  `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT.md`.
- T-041 references the map as the control surface for full operational RC.
- Every full operational blocker has an owning ticket.
- Closed proof, such as T-052 installed sandbox population, is marked closed
  rather than rediscovered as open debt.
- The missing live TypeScript lane is assigned to T-053.
- The map clearly distinguishes bounded TypeScript package RC from full
  operational Python-replacement RC.

## Non-Closure Conditions

- The map is only posted as a comment and not referenced by qualification.
- A blocker is listed without an owning ticket.
- Python live tests are treated as TypeScript proof.
- Sandbox proof is treated as live external `F_P` proof.
- Full operational RC blockers are hidden under the bounded package RC claim.

## Relationship To T-041 And T-053

T-041 remains the full operational Python-replacement envelope. T-053 owns the
missing live `F_P` data_mapper qualification lane. This ticket owns the map that
orders those and any other blockers before implementation proceeds.

## Completion Record

Delivered:

- `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_PYTHON_PARITY_RC_BLOCKER_MAP.md`
- RC report backlink to the blocker map
- T-041 backlink to the blocker map
- T-038 guard test asserting the map exists, is referenced, assigns live TS
  proof to T-053, marks installed sandbox proof closed through T-052, and keeps
  Python live proof separate from TypeScript proof

Verification:

- `npm run test:t038` passed: 4 tests.
