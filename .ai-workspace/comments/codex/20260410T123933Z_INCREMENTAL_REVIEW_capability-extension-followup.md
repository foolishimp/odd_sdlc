# Incremental Review: capability-extension follow-up

## Findings

### 1. `test_execution_contract` is still modeled as a hard-stop ambiguity but not enforced as a graph/FD gate

Severity: high

The new doctrine and ambiguity register now correctly classify missing `test_execution_contract` as a hard-stop class, but the executable graph still includes `derive_test_run_archive_surface` unconditionally in the bootstrap executive.

Evidence:

- `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py:938-956` keeps `GF_DERIVE_TEST_RUN_ARCHIVE` inside `LEAF_GRAPH_FUNCTIONS`.
- `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py:1204-1212` always builds `bootstrap_release_self_test` from `active_leaf_functions`, and `_configured_leaf_graph_functions(...)` only injects extra `F_H` evaluators; it does not remove the edge.
- `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py:96-110` adds profile-field gating for deployment/runtime/retrofit only. `test-run-archive-dependency-surfaces-present` has no `required_profile_fields=("test_execution_contract",)`.
- `build_tenants/odd_sdlc/python/code/odd_sdlc/project_profile.py:191-279` emits both `missing-test-execution-capability` and `execution-evidence-without-declared-capability` as `hard_stop: True`, so the governance model says “hard block” while the graph shape still says “run the qualification edge.”
- `build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_capability_gating_usecase.py:33-89` proves the current intended behavior only omits deployment/runtime/retrofit. The blank-capability case still converges through the bootstrap lane.

Runtime repro against the historical proving bed still shows the inconsistency. With current source-tree code:

- `data_mapper.test22` has blank `test_execution_contract` in `.ai-workspace/context/project_constraints.yml`.
- `python -m odd_sdlc query-domain --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test22` now reports `missing-test-execution-capability` and `execution-evidence-without-declared-capability` as blocking/hard-blocked in `ambiguity_register`.
- The same query still publishes `derive_test_run_archive_surface` inside `bootstrap_release_self_test`, and `python -m odd_sdlc gaps --workspace .../data_mapper.test22` still considers 18 jobs including that edge.

This leaves the model in a contradictory state: policy says the stage is a hard-stop prerequisite, but the executable bootstrap graph still traverses the stage class.

### 2. The canonical installed-sandbox proof surface was not repriced to the new v6 / ambiguity-register API

Severity: medium

The runtime/catalog surface changed correctly, but one of the canonical installed-workspace proving tests still asserts the old shape.

Evidence:

- `build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py:193` still expects `len(catalog["assets"]) == 24`, but the ambiguity register is now published as a real asset, so the count is 25.
- `build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py:303-341` still expects the pre-change query payload:
  - no `ambiguity_register` top-level key
  - `query_contract.version == "v5"`
  - the old `top_level_keys` list

Observed failure:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py`
- Result: `1 failed, 5 passed`
- Failing test: `test_canonical_sandbox_usecase_runs_from_installed_workspace`

This is a proving-surface defect rather than a runtime defect, but it matters because the installed-sandbox lane is supposed to be a primary reviewer aid and regression signal.

## Closed Since Prior Review

- The process-level ambiguity doctrine in `specification_methodology/specification/standards/SPEC_METHOD.md` is now correct and minimal: ambiguity detection mandatory, blocking policy-driven, and the small hard-stop class preserved.
- The workspace-root / `cwd` dependence is fixed for app-owned runtime surfaces. `catalog()` and `scope()` now build the module from the explicit workspace root.
- `query-domain` catalog honesty is fixed for deployment/runtime/retrofit publication. `functions`, `programs`, and `graph_functions` now follow the active gated module metadata rather than the static catalog.
- Missing `project_constraints.yml` now fails closed for operational edges.
- New risk-appetite proving tests are present and passed in the targeted suite.

## Verification

Passed:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_capability_gating_usecase.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_disambiguation_usecase.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_first_slice.py`
- Result: `23 passed in 314.89s`

Failed:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py`
- Result: `1 failed, 5 passed in 244.53s`

Additional manual probes:

- `python -m odd_sdlc gaps --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test22`
- `python -m odd_sdlc query-domain --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test22`

