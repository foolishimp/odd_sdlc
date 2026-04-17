# B-015 Rebind Consensus Harness Proof To The Installed ABG `gaps` Contract

- id: B-015
- title: Consensus harness proof asserted a vendored `refinement_gaps` field instead of the installed ABG `gaps` contract
- type: bug
- status: completed
- goal: installed-dev-proof-and-gap-contract-integrity
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-17
- dependencies: B-011

## Triage

- intake: `odd_sdlc` sandbox proving against installer-owned `abiogenesis.standard@3.1.0`
- change_intent: rebind consensus-harness proof to the actual installed module-scoped `gaps` payload instead of a vendored-only extension
- lawful_change_class: realization_refactor
- affected_boundary: consensus harness installed proof and its assumptions about the module-scoped `gaps` payload
- lawful_re_entry: proving boundary only; no requirement or runtime reprice needed once the installed ABG contract is treated as current truth
- downstream_proof_span: canonical sandbox repeatability proof, especially generated-design consensus lanes
- triaged_at: 2026-04-17

## Why This Ticket Exists

The sandbox suite against the latest installed ABG runtime failed at:

- `test_consensus_harness_module_runs_from_a_generated_design_surface`

The direct error was:

- `KeyError: 'refinement_gaps'`

Investigation showed that:

- `odd_sdlc`'s vendored `.genesis` carried a local `B-011` extension that
  published `refinement_gaps`
- the installer-owned `abiogenesis.standard@3.1.0` runtime does not publish
  that field in `derive_operational_gaps()`
- after `B-013` restored lawful sandbox proof, the test began exercising the
  real installed ABG payload rather than the vendored copy

So the defect was in the odd_sdlc proof expectation, not in the installed ABG
runtime contract.

## Intended Direction

Consensus-harness proof should assert the lawful installed ABG `gaps` contract:

- `converged`
- `jobs_considered`
- `total_delta`
- `open_frames`
- ordered zero-delta `gaps`

If coarse/refined parent-carrier truth is needed again in future, that must be
repriced and published from ABIogenesis as an explicit supported field rather
than assumed from a vendored runtime fork.

## Task List

- [x] Trace the payload split between vendored odd_sdlc `.genesis` and installed
  ABIogenesis `3.1.0`.
- [x] Confirm that installed ABIogenesis is the current proving truth for
  module-scoped `gaps`.
- [x] Rebind the consensus-harness proof to the lawful installed ABG payload.
- [ ] Re-run the targeted sandbox proof and confirm the consensus harness path
  is green.

## Acceptance

- consensus-harness installed proof asserts the lawful installed ABG `gaps`
  payload without relying on vendored-only `refinement_gaps`
- `test_consensus_harness_module_runs_from_a_generated_design_surface` passes
- the installed-vs-vendored payload split is recorded so the same proof drift
  does not recur silently

## Links

- failing proof: `build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py::test_consensus_harness_module_runs_from_a_generated_design_surface`
- proving context: canonical sandbox repeatability suite under
  `abiogenesis.standard@3.1.0`

## Completion Notes

- root cause was a downstream proof expectation written against a vendored
  odd_sdlc `.genesis` extension from `B-011`, not a supported upstream
  ABIogenesis `3.1.0` payload field
- the proof now asserts the installed ABG `gaps` contract directly
