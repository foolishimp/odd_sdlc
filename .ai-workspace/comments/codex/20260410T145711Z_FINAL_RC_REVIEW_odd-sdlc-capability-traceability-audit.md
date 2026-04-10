# Final RC Review: odd_sdlc capability, ambiguity, and traceability audit

## Findings

### 1. The RC proving surface is not green: required ambiguity and topology scenarios now fail under the current branch

Severity: high

The updated traceability/scope gates improved the model, but the corresponding proving lanes were not fully repriced. That leaves the RC validation surface non-green.

Current failures:

- `test_odd_sdlc_risk_appetite_usecase.py` now fails both scenarios.
  - [`test_odd_sdlc_risk_appetite_usecase.py:80`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py#L80) still expects the run to reach the ambiguity seam and stop at `select_implementation_stack_profile`.
  - In practice, the run now stops earlier at `derive_goal_surface` with `goal_surface_authority_validated` failing and return code `4`, so the ambiguity/risk-appetite behavior is no longer being proved.
- `test_odd_sdlc_test19_regression.py` is also stale under the new gates.
  - [`test_odd_sdlc_test19_regression.py:162`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test19_regression.py#L162) still drives `complete_bootstrap_chain(...)` as if each step yields an `fp_manifest_path`.
  - The current runtime can now stop on deterministic FD gaps before that path exists, so the harness raises `KeyError: 'fp_manifest_path'`.

This is not just cosmetic test churn. These files are part of the claimed proving surface for core behavior:

- ambiguity governance / risk appetite
- inherited-workspace topology regression

Until those use cases are repriced and green, I would not treat the branch as RC-ready.

### 2. `test_execution_contract` is still a hard-stop in governance but not a deterministic execution gate

Severity: high

The branch still has a model inconsistency around test execution capability.

The governance side says the stage is a hard-stop:

- [`project_profile.py:191`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/project_profile.py#L191) emits `missing-test-execution-capability` with `hard_stop: True`.
- [`project_profile.py:251`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/project_profile.py#L251) emits `execution-evidence-without-declared-capability` with `hard_stop: True`.

But the execution model still publishes the test-archive edge unconditionally:

- [`gtl_module.py:717`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py#L717) defines `GF_DERIVE_TEST_RUN_ARCHIVE`.
- [`gtl_module.py:948`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py#L948) keeps it inside `LEAF_GRAPH_FUNCTIONS`, so it remains in the bootstrap executive.
- [`fd_checks.py:116`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py#L116) does not require `test_execution_contract` for `test-run-archive-dependency-surfaces-present`, while deployment/runtime do have explicit `required_profile_fields`.

The new tests also stop short of proving real runtime gating here:

- [`test_odd_sdlc_capability_gating_usecase.py:33`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_capability_gating_usecase.py#L33) now checks `query-domain` publication only for operational edges.
- [`test_odd_sdlc_installation.py:523`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py#L523) explicitly expects the blank-contract inherited lane to remain non-converged while still listing `derive_test_run_archive_surface` in final gaps.

The historical proving bed still exposes the seam with current code:

- `data_mapper.test22` still has blank `test_execution_contract` in [project_constraints.yml](/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test22/.ai-workspace/context/project_constraints.yml).
- Current `query-domain` over that workspace reports both `missing-test-execution-capability` and `execution-evidence-without-declared-capability`, but still publishes `derive_test_run_archive_surface` in the bootstrap program.
- Current `gaps` over that workspace still considers 18 jobs and includes `derive_test_run_archive_surface`.

That means the branch is more honest about the defect, but it still does not enforce the contract boundary as tightly as the method and ambiguity register claim.

### 3. Capability-gating proof was narrowed from end-to-end behavior to static publication checks

Severity: medium

The operational gating tests no longer prove traversal behavior through runtime events and produced surfaces.

- [`test_odd_sdlc_capability_gating_usecase.py:33`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_capability_gating_usecase.py#L33) previously drove `genesis start --auto` and inspected opened edges plus produced deployment/runtime artifacts.
- The current version only asserts presence or absence in `query-domain` for `functions`, `graph_functions`, and `programs`.

That is a weaker guarantee. It proves publication honesty, but not that runtime traversal and side-effect surfaces obey the same gate under execution.

Given finding 2, that reduction in proof strength matters.

## Consistency Checks That Look Good

- `specification_methodology` is clean; no uncommitted delta remained there during this pass.
- The method-level ambiguity doctrine is now coherent and singular in `SPEC_METHOD.md`.
- `query-domain` / catalog surfaces are internally consistent with the new `requirement_closure_register` and `v7` contract.
- The sandbox proving surface was repriced to the new asset/query shape.
- The new requirement-closure / traceability slice is internally coherent and its dedicated use case passed.

## Validation Run Summary

Completed and failed:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py -vv`
  - Result: `2 failed in 19.65s`
- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test19_regression.py build_tenants/odd_sdlc/python/test_env/tests/test_abg_default_policy_hooks.py`
  - Result: `1 failed, 3 passed in 40.42s`

Historical workspace probes with current source-tree code:

- `python -m odd_sdlc query-domain --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test22`
- `python -m odd_sdlc gaps --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test22`

Observed there:

- `query_contract.version` is `v7`
- `requirement_closure_register` is published
- `missing-test-execution-capability` and `execution-evidence-without-declared-capability` are active
- `derive_test_run_archive_surface` is still present in the bootstrap lane and in current gaps

## RC Recommendation

Not yet an RC candidate.

The branch is materially closer: method authority is sound, the query/catalog surface is cleaner, and the traceability register is a meaningful improvement. But the final consistency bar is not met while:

- the required proving surface is not green
- ambiguity-risk tests are blocked by unrelated new FD gates
- `test_execution_contract` remains governance-hard-blocked without an equally strong execution gate

