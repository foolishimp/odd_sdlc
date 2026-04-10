# odd_sdlc Capability + Ambiguity Review

**Status**: Active commentary
**Date**: 2026-04-10T01:46:43Z
**Workspace**: `/Users/jim/src/apps/odd_method`
**Scope**: Review of the landed RC baseline plus the current uncommitted capability-gating and ambiguity-governance slice, using `data_mapper.test20` through `data_mapper.test22` as the proving corpus.

## Findings

### 1. High: Operational graph shape still depends on process `cwd`, not just declared tenant capability

`odd_sdlc` now tries to capability-gate the operational cycle, but the active workspace is inferred from `Path.cwd()` rather than from the workspace being operated. The gating decision therefore changes depending on where the process is launched from.

Relevant refs:
- `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py:1054-1059`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py:1229-1233`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/app.py:41-49`

Impact:
- From outside the workspace root, `python -m odd_sdlc gaps --workspace .../data_mapper.test22` still reports `jobs_considered: 21`.
- From inside `data_mapper.test22`, the same command reports `jobs_considered: 18`.
- That means graph shape is not determined solely by declared tenant capability, and source-tree invocation is no longer coherent with installed-workspace invocation.

### 2. High: Test-execution capability is modeled in the profile and ambiguity register, but it is not actually enforced

The slice adds `test_execution_contract` and emits missing-capability ambiguity entries, but the qualification lane still publishes `derive_test_run_archive_surface` unconditionally and the deterministic checks only gate deployment/runtime/retrofit.

Relevant refs:
- `build_tenants/odd_sdlc/python/code/odd_sdlc/project_profile.py:183-267`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py:96-110`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py:118-137`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py:698-727`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/software_domain_catalog.py:194-210`

Impact:
- The system can still carry real test evidence under a blank `test_execution_contract`.
- `data_mapper.test22` demonstrates the exact seam: `project_constraints.yml` leaves `test_execution_contract` blank, but the workspace still contains 38 JUnit XML reports and the release surface claims 149 executed tests.
- This is the main remaining side-effect leakage surface.

### 3. Medium: The public query/catalog surface is still operationally dishonest under capability gating

Even when the active module correctly omits the operational executive, the published catalog still advertises the gated-off operational functions and the `release_operational_cycle` program through static registries.

Relevant refs:
- `build_tenants/odd_sdlc/python/code/odd_sdlc/app.py:75-110`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/program_catalog.py:21-31`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py:1066-1094`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py:1214-1223`

Impact:
- Inside `data_mapper.test22`, current `query-domain` output omits `release_operational_cycle` from `graph_functions`, but still publishes `release_operational_cycle` in `programs` and still lists `prepare_deployment_surface`, `derive_runtime_observation_surface`, and `derive_retrofit_plan_surface` in `functions`.
- Consumers of the v6 query contract can therefore be told that operational steps are available when the active executable graph has already gated them off.

### 4. Medium: Ambiguity handling is still implemented as unconditional blocking, not as policy-driven governance

The methodology and current goal surface now say "ambiguity detection is mandatory; blocking is policy", but the emitted ambiguity entries are still hard-coded as blocking and there is no runtime policy or risk-appetite surface in the code path that computes them.

Relevant refs:
- `specification_methodology/specification/standards/SPEC_METHOD.md:206-229`
- `odd_method/specification/GOALS.md:62-67`
- `odd_method/specification/GOALS.md:91-97`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/project_profile.py:124-267`
- `build_tenants/odd_sdlc/python/code/odd_sdlc/ambiguity.py:80-96`

Impact:
- Every current ambiguity class sets `"blocking": True`.
- The register summary therefore treats all active ambiguity as blocking.
- There is still no code path where declared risk appetite can turn a major ambiguity into "carried", "decided by `F_P`", or "escalated to `F_H`" instead of "blocked".
- Capability ambiguities also set `expected_resolving_edge` to `None`, so the register cannot yet answer the "which edge resolves this?" question consistently.

## Notes

### Method authority

`specification_methodology/specification/standards/SPEC_METHOD.md` is now correct at the process level:
- SDLC is framed as a governed disambiguation pipeline.
- ambiguity detection is mandatory.
- blocking/escalation is risk-appetite driven.
- a small hard-stop class is preserved.

I did not find a second methodology authority surface in `specification_methodology` carrying this doctrine. In that repository, the ambiguity-governance rule appears only in `SPEC_METHOD.md`.

### Proof gap in the inherited-project corpus

The new code and tests are ahead of the historical proving corpus.

`ai_sdlc_examples/local_projects/data_mapper.test22` still shows the pre-slice installed package shape:
- no persisted `.ai-workspace/runtime/odd_sdlc-ambiguity-register.json`
- blank capability contracts in `.ai-workspace/context/project_constraints.yml`
- baseline installed query behavior still on `odd_sdlc.query-domain` `v5`

So `test22` remains a strong baseline for the capability-gating problem, but it is not yet a complete end-to-end proof artifact for the new ambiguity-governance slice.

## Verification

- Targeted current-code tests passed:
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_capability_gating_usecase.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_disambiguation_usecase.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_first_slice.py`
  - result: `18 passed in 206.53s`
- Direct runtime probes confirmed the `cwd` coherence seam and the query/catalog mismatch described above.
