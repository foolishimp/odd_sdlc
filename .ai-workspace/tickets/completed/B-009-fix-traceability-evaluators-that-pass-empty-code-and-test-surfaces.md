# B-009 Fix Traceability Evaluators That Pass Empty Code And Test Surfaces

- id: B-009
- title: Make odd_sdlc traceability evaluators fail lawfully when governed code or test surfaces are absent
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-16
- updated_at: 2026-04-16
- dependencies: B-002

## Triage

- intake: downstream comparative dogfood review / evaluator false positive / proof-certification defect
- lawful_change_class: interface_reprice
- affected_boundary: odd_sdlc proof-evaluator semantics for `code_traceability_present` and `realized_test_traceability_present` over governed tenant code roots
- lawful_re_entry: odd_sdlc evaluator law, gap/proof admission semantics, and downstream replay on empty-surface, broad-main-only, and converged-runtime workspaces
- downstream_proof_span: replay on `data_mapper.test31`, `data_mapper.test28`, and `data_mapper.test32`

## Why This Ticket Exists

A comparative review across:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test11`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test28`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test31`
- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`

exposed a real `odd_sdlc` evaluator bug.

On `data_mapper.test31`, the governed Scala tenant contains:

- `0` governed main Scala files
- `0` governed test Scala files

But the current live gap snapshot still reports:

- `code_traceability_present` as passing on `derive_code_surface`
- `realized_test_traceability_present` as passing on `derive_test_run_archive_surface`

That is a false positive.

The evaluator is certifying traceability even when the governed realized surface
does not exist.

This is not a `data_mapper.test31` local product bug. The workspace is empty
exactly where the evaluator claims traceability is present.

This is an `odd_sdlc` proof-law bug because it weakens the meaning of:

- traceability deltas
- closure failure diagnosis
- release/readiness signals downstream of missing realized code or tests

## Concrete Reproduction

Using:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test31`

1. Confirm the governed tenant is empty:
   - `find build_tenants/scala_spark -type f -path '*/src/main/scala/*.scala' | wc -l`
   - `find build_tenants/scala_spark -type f -path '*/src/test/scala/*.scala' | wc -l`
2. Run:
   - `PYTHONPATH=.genesis python -m genesis gaps --workspace .`
3. Observe:
   - `derive_code_surface` still lists `code_traceability_present` under `passing`
   - `derive_test_run_archive_surface` still lists `realized_test_traceability_present` under `passing`

This is the wrong outcome. Those evaluators should fail when the governed
realized surface is empty.

## Intended Direction

`odd_sdlc` should make these laws explicit:

1. `code_traceability_present` cannot pass unless at least one governed code
   artifact exists in the selected code root.
2. `realized_test_traceability_present` cannot pass unless at least one
   governed realized test artifact exists in the selected test root.
3. When the surface is empty, the evaluator should emit a direct zero-surface
   failure reason instead of silently passing.

The positive control should remain intact:

- `planned_test_traceability_present` may still pass on planned test surfaces
  before realized tests exist
- `data_mapper.test32` should continue to pass once real code/tests exist
- `data_mapper.test28` should continue to fail the realized test traceability
  check because it has broad code but no realized tests

## Scope Boundary

This ticket is in scope for:

- tightening proof evaluator semantics for empty governed code/test surfaces
- improving failure evidence so the gap report states why traceability is
  absent
- replaying the evaluator behavior on representative negative and positive
  controls

This ticket is not in scope for:

- redesigning the whole gap model
- changing downstream project requirements or trace headers
- repricing planned-vs-realized test authority generally

## Task List

- [x] Make `code_traceability_present` fail when the governed code surface is
  empty.
- [x] Make `realized_test_traceability_present` fail when the governed test
  surface is empty.
- [x] Emit explicit evidence for zero-surface failure so the gap report is
  directly diagnosable.
- [x] Replay on `data_mapper.test31` and confirm the false-positive passes are
  removed.
- [x] Replay on `data_mapper.test28` and confirm realized-test failure remains
  lawful.
- [x] Replay on `data_mapper.test32` and confirm the evaluator tightening does
  not invent a false empty-surface diagnosis on a workspace with real code and
  tests.

## Acceptance

- an empty governed code tree can no longer pass `code_traceability_present`
- an empty governed realized test tree can no longer pass
  `realized_test_traceability_present`
- the gap report explains the zero-surface condition explicitly
- `data_mapper.test31` now fails the relevant traceability checks lawfully
- positive-control workspaces with real code/tests do not fail under a false
  empty-surface diagnosis after the evaluator tightening

## Links

- downstream comparison set: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper`
- empty-surface repro: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test31`
- broad-main-only control: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test28`
- converged positive control: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`
- related bug: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-002-emit-repair-usable-fd-evidence-from-odd-sdlc-evaluators.md`

## Completion Notes

- `traceability_scan()` now records governed code/test file counts, so the
  traceability evaluators can distinguish empty realized surfaces from ordinary
  missing-tag or missing-id gaps.
- `code_traceability_present` and `realized_test_traceability_present` now fail
  with explicit `zero_surface_gap` detail when the governed realized surface is
  empty.
- Focused proof is green:
  `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
- Negative-control replay is green:
  - `data_mapper.test31` now fails `code-traceability-present` with
    `surface_failure_reason: governed_code_surface_empty`
  - `data_mapper.test31` now fails `realized-test-traceability-present` with
    `surface_failure_reason: governed_realized_test_surface_empty`
  - `data_mapper.test28` still fails `realized-test-traceability-present`
    lawfully as `realized_test_gap`, not as a fake zero-surface case
- Positive-control note:
  `data_mapper.test32` still has real code/test surfaces after this change;
  later B-010 normalization work may reopen other honest requirement/test gaps,
  but not via a false empty-surface diagnosis.
