---
id: T-114
title: Demote worker_result_report.json from closure authority
type: refactor
ticket_category: authority_refactor
status: completed
goal: typescript-rc-fp-worker-coverage
change_intent: Reprice worker_result_report.json as compatibility evidence/read-model output instead of a closure-authority carrier.
change_class: design_reframe
re_entry_point: design
affected_boundary: worker report admission, postflight, assurance gate, gap dossier construction, closure projection, archive compatibility
priority: high
triaged_at: 2026-05-03
created_at: 2026-05-03
updated_at: 2026-05-04
build_tenant: typescript
owner: unassigned
review_status: closed
depends_on:
  - T-110 ABG 3.5.0-rc.1 traced callout migration completed 2026-05-04
  - T-102 first-class F_P transform/evaluate carrier split completed 2026-05-04
  - T-112 complete semantic lifecycle model
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: worker_result_report.json remains useful for compatibility and archives, but it should not remain the authority that closes semantic obligations after ABG callout and F_P lifecycle carriers are available.
target_truth: worker_result_report.json is a compatibility/read-model artifact derived from admitted process, transform, evaluation, and ledger truth; closure authority comes from typed lifecycle projections.
superseded_truth: worker_result_report.json is the primary successful-worker artifact and can directly drive postflight closure or unresolved-reason acceptance.
closure_law: This ticket closes only when normal closure no longer depends on worker_result_report.json as authority, while existing archive consumers retain a projected compatibility file where needed.
evaluation_criteria:
  - report file may be absent when typed transform/evaluate carriers are present.
  - report file may be generated as a projection for compatibility.
  - report file cannot override admitted evidence or evaluation rows.
  - unresolvedReasons from a report are advisory unless admitted through typed evaluation.
  - old archive readers are either migrated or explicitly consume compatibility projection.
proof_surface:
  - postflight authority refactor
  - compatibility report projection
  - negative test where report claims closure but typed evaluation blocks
  - positive test where no report exists but typed lifecycle closes
  - archive compatibility test
non_closure_conditions:
  - Renaming worker_result_report.json without changing authority.
  - Keeping unresolvedReasons as the closure fold input.
  - Accepting worker-listed materialized files as authoritative without file/digest admission.
  - Breaking existing archive inspection with no compatibility projection.
---

# T-114: Demote worker_result_report.json From Closure Authority

## Dependency Checkpoint - 2026-05-04

T-102 is closed for the scoped transform/evaluate carrier split. The report is
now a compatibility/read-model bridge in that slice, but it is not yet fully
demoted from closure authority.

T-114 is active after T-102/T-110 because the first safe demotion slice is now
available: worker-authored report prose must not determine transform status or
postflight closure. Remaining broader lifecycle projection cleanup stays
bounded by T-112/T-108.

## Implementation Slice - 2026-05-04

This slice demotes the report at the immediate closure seam:

- `F_P.transform` status is derived from admitted output artifact existence and
  digest truth, not `worker_result_report.json.unresolvedReasons`.
- postflight no longer emits `worker_report_unresolved_reasons_present`.
- `unresolvedReasons` remains readable compatibility/debug prose.
- typed postflight checks over output file, digest, materialized-file
  admission, execution evidence, and obligation assessment carriers remain
  authoritative.

This does not remove `worker_result_report.json`. The file remains a generated
compatibility/read-model artifact for archives and old inspection flows.

The current live repair-flow proof also carries a T-114 negative assertion:
the controlled worker deliberately emits advisory `unresolvedReasons` in every
compatibility report while valid typed output continues to advance. The live
assertion fails if `worker_report_unresolved_reasons_present` reappears as a
closure authority blocker.

### Proof - 2026-05-04

- `node --test test_env/tests/test_t086_blocking_reason_carriers.test.mjs`
  passed `5/5`.
- `ODD_SDLC_TS_T115_DATA_MAPPER_LIVE=1 node --test test_env/live/test_t115_live_installed_data_mapper_repair_flow.test.mjs`
  passed `1/1` while every controlled compatibility report carried advisory
  `unresolvedReasons`.

## STDO Triage

### First Missing Layer

Design.

`worker_result_report.json` was a practical bridge while the TypeScript line
lacked typed lifecycle carriers. After T-110 and T-102, it must become a
compatibility projection, not a closure authority.

## Target Boundary

Closure authority must come from:

- ABG traced process outcome
- admitted transform payload/file evidence
- deterministic envelope checks
- F_P evaluation rows
- ledger projection
- retry/reentry/closure projection

`worker_result_report.json` may remain:

- a compatibility artifact for existing archive readers
- an operator-facing summary
- a debugging convenience
- a generated projection from typed truth

It must not remain:

- the carrier that makes obligations pass
- the source of authoritative materialized file truth
- the source of final unresolved-reason truth
- the condition that distinguishes valid transform output from failure

## Required Refactoring

1. Identify every normal closure path that reads `worker_result_report.json`.
2. Split each read into either:
   - compatibility projection read; or
   - authority read to be replaced by typed lifecycle state.
3. Generate the report from typed state where old tests/operators still expect
   the file.
4. Reject report claims that contradict admitted evidence or evaluation rows.
5. Update archive documentation to mark the report as compatibility/read-model.

## Acceptance Criteria

- AC-1: a valid typed lifecycle can close without a worker-authored report.
- AC-2: a worker-authored report cannot close a failed typed evaluation.
- AC-3: report materialized-file lists cannot bypass digest/path admission.
- AC-4: archive compatibility remains available for existing inspection flows.
- AC-5: tests explicitly distinguish report projection from closure authority.

## Out Of Scope

- Removing the file entirely.
- Redesigning the full lifecycle model. T-112 owns that.
- Process execution migration. T-110 owns that.
