# B-002 Emit Repair-Usable F_D Evidence From odd_sdlc Evaluators

- id: B-002
- title: Emit repair-usable deterministic failure evidence from odd_sdlc evaluators
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: critical
- created_at: 2026-04-12
- updated_at: 2026-04-12
- dependencies: B-001, T-003

## Triage

- intake: bug / operator finding / live `test28` proving result
- lawful_change_class: realization_refactor
- affected_boundary: odd_sdlc deterministic evaluators, traceability checks, and repair evidence surfaced to probabilistic builder turns
- lawful_re_entry: odd_method realization surfaces for odd_sdlc deterministic checks, traceability helpers, and proof lanes
- downstream_proof_span: odd_sdlc evaluator outputs, manifest-carried evidence consumed by the builder, and fresh proving-lane diagnosis on the `data_mapper` regression corpus

## Why This Ticket Exists

The live proving run shows that deterministic truth is still too weakly exposed
to the builder.

Observed in `test28`:

- failing `F_D` checks often return only `returncode: 1`
- `stdout` and `stderr` are often empty
- the builder then has to rediscover the failure shape by source inspection
  rather than receiving a usable repair signal directly from the deterministic
  evaluator

This is immediate `odd_sdlc` work, not an ABG blocker.

ABG already carries `returncode`, `stdout`, and `stderr` through manifests and
into repair prompts. The fastest improvement is for the deterministic
evaluators themselves to emit richer detail through those surfaces.

## Intended Direction

Critical deterministic evaluators should emit repair-usable detail such as:

- missing requirement ids
- orphan files
- missing directories or expected test roots
- invalid trace tags or malformed references
- concise failure summaries that tell the builder what to fix next

This should preserve the deterministic pass/fail contract while making failure
evidence materially more actionable.

Sequencing note:

- this ticket can improve current evaluators immediately
- final downstream acceptance should still be rerun after `T-003`, because
  topology migration will change many of the paths and references that the
  highest-value deterministic evaluators report

## Task List

- [x] Identify the highest-value `F_D` evaluators on the live proving path,
  starting with traceability and testcase-authority checks.
- [x] Emit repair-usable detail into `stdout` and/or `stderr` while preserving
  current return-code semantics.
- [x] Make the emitted detail specific enough that the next `F_P` turn can act
  without rediscovering the failure from scratch.
- [x] Preserve operator-readable failure output as well as builder-usable
  detail.
- [x] Add or update proof lanes covering the richer deterministic output shape.
- [x] Prove internally that the richer evaluator output is carried into the
  deterministic-failure prompt surface the builder reads.

## Proof Required

- evaluator proof:
  - key live-path deterministic checks emit non-empty, repair-usable
    `stdout`/`stderr`
- manifest/prompt proof:
  - emitted detail is visibly carried into the next builder turn
- parent-wave proving proof:
  - fresh downstream long-run proving remains under `B-001` after `T-002`
    lands, rather than blocking internal closure of this evaluator ticket

## Acceptance

- key odd_sdlc deterministic evaluators no longer fail with empty
  `stdout` / `stderr`
- failing `F_D` checks emit repair-usable detail that can be consumed by the
  next builder turn
- deterministic truth remains authoritative; richer evidence does not weaken the
  pass/fail contract
- live proof shows better diagnosis and more targeted repair from the emitted
  evidence

## Progress

- 2026-04-12: implemented structured deterministic failure payloads in
  `odd_sdlc.fd_checks` for:
  - `goal-surface-authority-validated`
  - `requirement-scope-complete`
  - `code-traceability-present`
  - `planned-test-traceability-present`
  - `realized-test-traceability-present`
  - generic dependency-gap evaluators such as
    `testcase-authority-dependency-surfaces-present`
- deterministic evaluators now emit structured JSON to `stdout` while
  preserving the non-zero return code
- internal proof added in
  `test_odd_sdlc_fd_evidence.py`
- prompt-carriage proof added by assembling the deterministic-failure section
  from the emitted `stdout` payload
- broader internal non-regression proof run with
  `test_odd_sdlc_iterative_closure_traceability_usecase.py`

## Completion

Closed 2026-04-12 on internal proof.

Internal proof completed:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
  - result: `7 passed in 0.08s`
- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_fd_evidence.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_iterative_closure_traceability_usecase.py -q`
  - result: `9 passed in 7.32s`

Fresh downstream proving against the literal `data_mapper` corpus remains
parent-wave work under `B-001` and should be rerun after `T-002` lands.

## Links

- parent: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/B-001-refactor-odd-method-to-released-abg-boundary.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/T-002-refactor-odd-sdlc-from-pure-function-builder-framing-to-stateful-iterator.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/T-003-enforce-spec-method-structured-build-topology-for-project-tenants.md`
- abg_strategy: `/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260412T161241Z_STRATEGY_abg-repair-control-plane-deferred-after-sdlc-priority-cut.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
