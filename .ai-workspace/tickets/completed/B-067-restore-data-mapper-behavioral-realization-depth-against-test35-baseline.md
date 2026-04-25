---
id: B-067
title: Restore data_mapper behavioral realization depth against the test35 baseline
type: bug
ticket_category: ordinary
status: completed
goal: data-mapper-rc-requires-behavioral-code-not-traceability-shells
change_intent: data_mapper.test43 proves build/test operational contracts after B-065, but the generated Scala tenant regressed to traceability-shell modules and trace-tag tests. data_mapper.test35 proves this target line previously generated real CDME code and behavioral tests. odd_sdlc must recover that realization depth before claiming data_mapper RC.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: code surface generation, test surface generation, requirement closure proof
priority: critical
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
completed_at: 2026-04-25
dependencies:
  - B-065 completed
  - B-066 completed
intake_source: forensic comparison of `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35` and `data_mapper.test43`
target_truth: odd_sdlc data_mapper generation must produce behavioral CDME implementation and behavioral test evidence comparable to the proven test35 baseline, not only traceability-bearing metadata objects that compile.
superseded_truth: A generated code surface can satisfy data_mapper realization by materializing one metadata object per module plus traceability tests, as long as `sbt clean assembly` and `sbt test` pass.
closure_law: this ticket closes when a clean data_mapper template run produces real CDME domain implementation and behavioral tests, and requirement closure distinguishes behavior from trace-token presence.
evaluation_criteria:
  - generated Scala tenant includes concrete CDME implementation carriers for compiler, executor, adjoint, accounting, fidelity, assurance, and engine responsibilities
  - generated tests include behavioral assertions that would fail against the current traceability shell
  - requirement closure does not report all imported requirements fulfilled from token/comment presence alone
  - generated code/test surface is compared against test35 as a minimum realization-depth precedent
  - build/test operational proof from B-065 remains passing
proof_surface:
  - clean data_mapper template install: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test45`
  - generated Scala source inventory and LOC/class/function summary
  - representative source review against test35 files
  - `sbt clean assembly`
  - `sbt test`
  - requirement closure register showing behavior-aware fulfillment state
non_closure_conditions:
  - preserving only traceability-shell modules
  - adding behavioral names without executable logic
  - treating requirement comments/constants as behavioral fulfillment
  - weakening imported data_mapper requirements to fit the shell implementation
---

## Closure Evidence

The generator no longer emits only module metadata objects plus trace-tag tests
for data_mapper. The clean `data_mapper.test45` run generated behavioral Scala
carriers and behavioral specs across the declared CDME module set.

- main Scala files: `8`
- main Scala LOC: `317`
- test Scala files: `14`
- test Scala LOC: `466`
- parsed JUnit report files: `14`
- tests observed: `103`
- failures observed: `0`
- errors observed: `0`

Representative behavioral carriers:

- `cdme-compiler`: governed morphism path compilation, topology validation, RBAC decisioning
- `cdme-executor`: field morphism execution and residue reporting
- `cdme-adjoint`: forward/backward image reconciliation
- `cdme-accounting`: zero-loss ledger accounting
- `cdme-fidelity`: null-rate profile verification
- `cdme-assurance`: path and dry-run validation
- `cdme-engine`: bounded request execution and ledger projection

Requirement closure now rejects trace-only shells: metadata constants,
summary wrappers, comments, and trace-token-only tests are not sufficient
behavioral fulfillment signals.

## Boundary

This closes the RC-blocking regression from traceability shell to behavioral
realization. It does not claim byte-for-byte or LOC parity with
`data_mapper.test35`; test35 remains a broader realization-depth precedent. The
RC bar here is that generated code is executable domain behavior, behavioral
tests would fail against the former shell, and the proof surface no longer
prices trace tokens as implementation.
