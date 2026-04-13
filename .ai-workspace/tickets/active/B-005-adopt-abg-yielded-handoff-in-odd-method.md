# B-005 Adopt ABG Yielded Handoff In odd_method

- id: B-005
- title: Adopt the yielded post-dispatch handoff seam in odd_method consumer runtime and proofs
- type: bug
- status: active
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-13
- updated_at: 2026-04-13
- dependencies: T-004

## Triage

- intake: upstream runtime change / consumer interface migration / proving drift
- lawful_change_class: interface_reprice
- affected_boundary: installed ABG runtime surface under `.genesis/`, odd_service auto adapter behavior, and odd_sdlc proving lanes
- lawful_re_entry: odd_method installed-runtime refresh, odd_service runtime adapter, odd_sdlc scenarios, and consumer regression proofs
- downstream_proof_span: released-install refresh plus odd_sdlc and odd_service qualification against the yielded handoff seam

## Why This Ticket Exists

ABG now exposes a third lawful post-dispatch outcome:

- `fail`
- `yield`
- `ok`

`yield` means:

- the constructive turn materially advanced the stateful asset
- new observer truth over that updated asset remains unresolved but non-blocking
- control must hand off before the same constructive lane is redispatched

`odd_method` is still installed against the older vendored engine seam under
`.genesis/`, and several local consumer surfaces still encode the previous
two-state assumption:

- `odd_service.runtime_adapter.run_auto()` only understands dispatch result
  `status == "ok"` versus failure
- odd_sdlc scenario and first-slice proofs still treat `run_completed` as the
  terminal event on paths that now lawfully `yield`
- RC notes and release notes still describe post-transform deterministic
  findings as surfacing back out as `fd_gap`

This is a consumer migration bug, not a new GTL change.

## Intended Direction

`odd_method` should consume the released ABG engine through the lawful installed
surface and then reprice only the consumer strata that actually depend on the
old completion seam.

This means:

- refresh `.genesis/` from sibling `abiogenesis` source through the
  `odd_sdlc.release.install` path
- update `odd_service` auto-loop behavior to honor yielded handoff rather than
  treating dispatch success as the only non-terminal outcome
- update odd_sdlc and odd_service tests to expect `run_yielded` /
  `stopped_by = "yield"` where that is now the lawful seam
- record any remaining consumer debt as explicit follow-up, not ambient drift

## Task List

- [ ] Reinstall `odd_method` through the lawful `odd_sdlc` installer so the
  vendored `.genesis/` engine matches the released ABG yield seam.
- [ ] Reprice `odd_service.runtime_adapter` to treat yielded handoff as a first
  class non-failure outcome.
- [ ] Update odd_sdlc and odd_service tests that currently assume
  `run_completed` or a pure `ok/failure` dispatch seam where yield is now
  lawful.
- [ ] Update the affected docs/notes that still describe the old post-dispatch
  deterministic gap surfacing behavior.
- [ ] Run the full odd_method qualification surface against the yielded handoff
  engine and record the result here.

## Proof Required

- install refresh proof:
  - `.genesis/genesis/` in `odd_method` reflects the released ABG yield-aware
    engine surface
- odd_service proof:
  - `run_auto()` yields rather than redispatching blindly on yielded handoff
  - service-layer `run()` preserves yielded handoff truth and session state
- odd_sdlc proof:
  - scenario and first-slice tests observe `run_yielded` where the runtime now
    yields instead of completing
  - a canned installed-workspace yield chain proves:
    - yielded start payload truth
    - emitted event truth
    - projected run / graph_call / continuation truth
    - preserved gap visibility after handoff
    - fresh-workspace reissue with fresh run / call / continuation ids
    - exactly one `graph_call_opened` for the yielded `run_id` / `call_id`
- non-regression proof:
  - existing `fh_gate`, `fp_dispatch`, and runtime failure lanes still behave
    lawfully
  - `blocked_missing_capability` remains an explicit T-004 branch, not an
    accidental `no_lawful_route` fallthrough

## Acceptance

- odd_method consumes the yielded post-dispatch handoff seam through its
  installed engine surface
- odd_service and odd_sdlc consumer logic no longer assume the old binary
  dispatch outcome model
- qualification passes on the refreshed engine without local patching around
  the ABG change

## Progress

- 2026-04-13: refreshed the installed `.genesis/` engine surface in
  `odd_method` from the released `abiogenesis` source truth and kept the
  migration scoped to the derived kernel/runtime seam rather than accepting an
  accidental source-workspace topology rewrite
- updated `odd_service.runtime_adapter.run_auto()` to honor
  `dispatch_result.status == "yield"` as a first-class handoff outcome
- repriced consumer docs and sandbox-repeatability language away from the old
  post-constructive `fd_gap` / synthetic hard-stop framing
- fixed the stale downstream proof in
  `test_odd_sdlc_installation.py::test_data_mapper_template_as_is_requires_scope_and_traceability_work_before_auto_convergence`
  to expect exit code `6` with yielded observer handoff payload and
  `fd_findings` event truth
- focused downstream verification is green on:
  - `python -m pytest build_tenants/odd_service/python/test_env/tests/test_odd_service_first_slice.py -q`
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py::test_data_mapper_template_as_is_requires_scope_and_traceability_work_before_auto_convergence -q`
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_yield_usecase.py -q`
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'blocked_missing_capability or gap_publication_does_not_inherit_unrelated_prior_run_id or triage_divergence or shallow_code_findings or release_gap_without_declared_route_is_explicit_no_lawful_route or stale_analysis'`
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test19_regression.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test28_regression.py -x -vv`
  - targeted odd_sdlc first-slice / sandbox / risk-appetite lanes covering the
    previously suspected post-dispatch seam
- a full-suite confirmation pass progressed past the original late failure
  point after the proof fix; no second migration break surfaced in the verified
  tail bands
- 2026-04-13: added a dedicated canned downstream yield chain at
  `test_odd_sdlc_yield_usecase.py` so `data_mapper` no longer depends on a
  single heavy installation assertion for the yielded handoff seam; the canned
  chain proves result truth, event truth, observer projection truth, gap
  visibility, and fresh-workspace reissue with new ids
- added direct `odd_service` proof for yielded handoff in `runtime_adapter.run_auto()`
  and service-session preservation in `service.run()`
- added a first-slice proof that `missing_runtime_observation_contract` is
  classified as `blocked_missing_capability`, and tightened the triage
  classifier so underscore-shaped missing capability signals do not fall
  through to `no_lawful_route`

## Links

- upstream bug: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/B-003-restore-gap-first-fd-authority-and-remove-post-fp-closure-regression.md`
- upstream follow-up: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/B-004-tighten-yield-classification-and-consumption-after-b003.md`
- parent: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/T-004-restore-homeostatic-gap-triage-and-intent-renewal.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
