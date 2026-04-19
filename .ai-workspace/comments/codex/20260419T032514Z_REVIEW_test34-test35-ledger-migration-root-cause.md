# REVIEW: test34 vs test35 ledger migration root cause

**Author**: Codex
**Date**: 2026-04-19T03:25:14Z
**Addresses**: `ai_sdlc_examples/local_projects/data_mapper/data_mapper.test34`, `ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`, `odd_sdlc` `B-019` / `B-020`, `abiogenesis` `B-013` / `B-014` / `B-015` / `T-007`
**Status**: Draft

## Summary

Current reality:

- `test34` is the old false-green line. It uses the pre-ledger F_P carrier and
  allows closure on coarse worker-authored semantic claims.
- `test35` proves two different things at once:
  - the later adapter-driven ledger path is materially more truthful
  - the graph was only partially migrated, so early authoring edges still run
    on evaluator-shaped static ledgers
- transport noise amplified the run count and retry count in `test35`, but it
  was not the primary semantic defect

The most useful comparison from the later review is `derive_test_run_archive_surface`.
That edge cleanly shows the old false-green behavior in `test34` and the newer
requirement-ledger truth in `test35`.

The stronger conclusion is broader than that review stated:

- `test34` proves the old carry-vs-fulfillment conflation
- `test35` proves the archive-edge fix
- `test35` also proves the migration was incomplete because the early
  authoring edges still used static evaluator obligations and could still
  false-converge

## Analysis

### 1. Architectural Boundary Between The Two Workspaces

The material install/runtime boundary is real:

- `test34` uses the old installed runtime under
  `data_mapper.test34/.odd_sdlc/release/genesis.yml`
- `test35` uses the repriced installed runtime under
  `data_mapper.test35/.genesis/odd_sdlc/release/genesis.yml`

The fulfillment carrier changed with that wave:

- `test34` has `fp_results/` and `fp_manifests/`, but no `fp_ledgers/`
- `test35` has `fp_results/`, `fp_manifests/`, and `fp_ledgers/`

That is the first hard proof that these two workspaces are not merely two runs
of the same truth model.

### 2. `test34` Is The Pre-Ledger False-Green

The clearest archive-edge proof is:

- `data_mapper.test34/.ai-workspace/fp_results/derive_test_run_archive_surface_20260417T103558573440Z.json`

That result artifact publishes two blended worker-authored assessments:

1. `realized_test_traceability_present`
2. `test_run_archive_surface_semantically_converged`

The second one explicitly says the archive is converged while also saying the
execution state is `construction_complete_pending_execution`.

That is the old semantic bug in one artifact:

- the system treated realized test source plus traceability plus a coherent
  archive document as enough to pass semantic convergence
- no first-class fulfillment ledger existed to force a separation between:
  - carry/accounting truth
  - fulfillment/completeness truth

This is the exact problem later captured in `odd_sdlc` ticket `B-019`:

- the old model let carry and fulfillment collapse into one coarse
  whole-surface judgment

`test34` still converged because this specific run repaired enough content to
meet the weak carrier's standard. That is not proof that the old model was
correct. It is proof that the old model could report green even while execution
evidence was still pending.

### 3. `test35` Is Not One New Honest System; It Is A Mixed Migration Graph

The later review correctly identifies the strongest fixed edge:

- failed archive ledger:
  `data_mapper.test35/.ai-workspace/fp_ledgers/derive_test_run_archive_surface_20260418T215858965549Z.json`
- converged archive ledger:
  `data_mapper.test35/.ai-workspace/fp_ledgers/derive_test_run_archive_surface_20260418T223030687437Z.json`

The failed ledger shows:

- `declaration_family: adapter_driven`
- `expected_count: 71`
- `carry_converged: true`
- `fulfilled_count: 0`
- `fulfillment_converged: false`
- blocking reason:
  `sbt test execution not available in this construction context`

That is materially more truthful than `test34`.

But `test35` is only partially migrated.

The source `odd_sdlc` graph still splits into two families:

- early authoring edges with no domain `obligation_ledger` declaration:
  - `derive_feature_decomp_surface`
  - `derive_uat_testcases_surface`
  - `derive_design_surface`
  - `derive_scenario_surface`
- later realization/release edges with domain-declared
  `_requirement_edge_obligation_ledger(...)`:
  - `qualify_testcase_authority`
  - `derive_implementation_design_surface`
  - `derive_implementation_module_surface`
  - `derive_code_surface`
  - `derive_test_design_surface`
  - `derive_test_module_surface`
  - `derive_test_run_archive_surface`
  - `prepare_release_surface`

Code anchors:

- fallback evaluator-shaped declaration helper:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py:630`
- early edges still lacking a domain ledger:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py:858`
- later edges with requirement-ledger declarations:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py:906`
  `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py:930`
  `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py:1043`

The archived `test35` ledger set proves the split:

- `static_obligations`: 38 ledgers
- `adapter_driven`: 19 ledgers

Examples:

- `derive_design_surface_20260418T205912466651Z.json`
  - `declaration_family: static_obligations`
  - `expected_count: 1`
  - `obligation_source_kind: vector_declared_fp_evaluators`
- `qualify_testcase_authority_20260418T222146600870Z.json`
  - `declaration_family: adapter_driven`
  - `expected_count: 71`
  - `adapter_ref: odd_sdlc.traceability:declared_requirement_edge_gap`

So the correct reading is:

- `test35` fixed the archive-edge truth model
- `test35` did not yet migrate the whole graph onto that truth model

### 4. ABG Still Closes Proof From Ledger State Alone

The substrate closure law is still fail-open with respect to target-asset
certification.

In `abiogenesis/build_tenants/abiogenesis/python/code/genesis/result_ingest.py`:

- line `510` sets
  `edge_converged = carry_converged and fulfillment_converged and admitted`
- line `934` derives `proof_passed` directly from `edge_converged`

The helper that would at least recheck target materialization exists:

- `_target_binding_materialization(...)`
  at `result_ingest.py:521`

But it is not part of the closure decision.

This means:

- if the published fulfillment ledger says the edge converged
- and the edge does not require unresolved F_H admission

then ABG emits the success lifecycle even if the target asset contract itself
has not been certified at closure time.

That is a substrate-level truth gap separate from the archive-edge ledger
improvement.

### 5. `odd_sdlc` Still Lacks A Producer-Edge Self-Contract Gate On Early Edges

The deterministic producer-edge dependency checks in:

- `odd_sdlc/build_tenants/python/code/odd_sdlc/fd_checks.py:43`

only require upstream generated assets on the early authoring edges.

Examples:

- `feature-decomp-dependency-surfaces-present`
  requires `requirement_surface`
- `uat-testcases-dependency-surfaces-present`
  requires `requirement_surface`
- `design-dependency-surfaces-present`
  requires `requirement_surface` and `feature_decomp_surface`

Those checks do not require the target surface they just produced.

The constructor itself does fail closed on an invalid generated asset:

- `odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:2179`
- `odd_sdlc/build_tenants/python/code/odd_sdlc/workspace_assets.py:726`

So the local construction path has the right instinct.
The problem is that the runtime closure law does not require that same target
contract attestation before success lifecycle emission.

This is why `test35` could still emit `proof_passed` and `edge_converged` on
the early static-ledger edges even while the graph as a whole was not yet on
the truthful requirement-ledger model.

### 6. The Later Review Was Right About Transport Being Secondary

The transport-resilience read is useful and materially correct.

Relevant substrate path:

- `abiogenesis/build_tenants/abiogenesis/python/code/genesis/transport.py:1369`
- `abiogenesis/build_tenants/abiogenesis/python/code/genesis/dispatch_runtime.py:422`

The runtime now distinguishes:

- transport failure with no valid artifact
- transport failure where a valid result artifact can still be salvaged

`test35` event counts show:

- `worker_turn_salvaged`: `60`
- `proof_failed`: `7`
- `run_failed`: `11`
- `graph_call_failed`: `8`

The semantic proof failures are concentrated on the archive edge before
execution evidence existed:

- all `proof_failed` events in `test35` are
  `derive_test_run_archive_surface`
  with `policy_reason: proof_incomplete`

The genuine transport defect count is much smaller:

- one `derive_code_surface` transport failure remained real because no valid
  salvage artifact existed
- three `derive_intent_surface` failures were stale/superseded manifest noise

So the better causal order is:

1. ledger migration exposed the missing execution truth on the archive edge
2. transport salvage prevented transient backend failures from hiding or
   corrupting valid emitted truth
3. transport instability increased noise but was not the reason the archive
   edge initially failed

### 7. What The Other Review Added, And What Needed Correction

Useful additions:

- it picked the best before/after edge:
  `derive_test_run_archive_surface`
- it correctly emphasized that execution evidence became mandatory in the
  adapter-driven path
- it correctly treated transport salvage as secondary support, not the primary
  semantic fix
- it surfaced the final repaired outcome:
  `173` passing tests, `71 / 71` fulfilled archive obligations

Corrections needed:

- `test35` is not uniformly "the honest version"
  - later edges are honest in a stronger way
  - early authoring edges remain on evaluator-shaped static ledgers
- the most important open defect is not just historical pre-ledger
  archive closure
  - it is also the still-open mixed-truth state inside `test35`
- `result_ingest.py:843` is where the ledger ref is written, not where proof
  truth is decided
  - the decisive closure lines are `result_ingest.py:510` and
    `result_ingest.py:934`

## Recommended Action

1. In `odd_sdlc`, migrate the early authoring edges onto domain-declared
   obligation ledgers so the whole graph stops mixing:
   - evaluator-shaped static ledgers
   - requirement-shaped adapter-driven ledgers

2. In `odd_sdlc`, add a producer-edge target contract gate for the early
   generated authoring surfaces so a producer edge cannot close without
   certifying its own target asset contract.

3. In `abiogenesis`, gate `proof_passed` and success lifecycle emission on
   target-asset certification, not only on admitted ledger convergence.

4. Keep the transport salvage model. It is not the semantic fix, but it is the
   right secondary mechanism because it preserves valid truth when backend
   transport fails after artifact materialization.

5. Treat `test34` as the proof of the old semantic bug, and `test35` as the
   proof that the migration improved one critical edge while still leaving the
   graph in a mixed closure model.
