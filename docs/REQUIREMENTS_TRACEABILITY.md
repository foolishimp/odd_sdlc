# Requirements Traceability Audit

Generated: 2026-04-10T01:20:00Z

This support report traces `odd_method` requirements to the active `odd_sdlc` code and test surfaces. It is non-constitutional commentary in the sense of `SPEC_METHOD`.

## Scope

- Requirements source: `specification/requirements/*.md`
- Code scope: `build_tenants/python/code/**/*.py`
- Test scope: `build_tenants/python/test_env/tests/**/*.py`
- Scenario authority: `specification/scenarios/*.md` `**Validates**` lines

## Summary

- total requirements traced: `66`
- requirements with code + tests: `16`
- requirements with code + scenario only: `17`
- requirements with code only: `0`
- requirements with scenario only: `25`
- requirements with spec only: `6`
- requirements without code trace: `33`
- requirements without test trace: `6`
- code files without `Implements` tags: `0`
- test modules without `Validates`/`usecase_id` tags: `0`
- support helpers without trace tags: `1`

## Requirements Without Code Trace

- `REQ-F-GFUNC-002` — Work vectors are productized views over graph functions
- `REQ-F-GFUNC-003` — Composition and recursion are first-class adopted capabilities
- `REQ-F-GFUNC-005` — Higher-order graph-function harnesses remain ordinary GTL carriers
- `REQ-F-ODDSDLC-008` — odd_sdlc publishes the first reusable higher-order consensus harness
- `REQ-F-ODDSDLC-017` — odd_sdlc keeps the substrate boundary minimal and domain-neutral
- `REQ-F-ODDSDLC-018` — the software-domain build-out lands as one operative model without passive legacy retention
- `REQ-F-ODDSDLC-019` — inherited odd_sdlc material is explicitly classified during the transformation wave
- `REQ-F-ODDSDLC-021` — odd_sdlc publishes the current executive GTL carrier over its active software-domain graph
- `REQ-F-ODDSDLC-023` — odd_sdlc retains reusable higher-order review and consensus harnesses as active software-domain capability
- `REQ-F-ODDSDLC-024` — active odd_sdlc qualification proves the current software-domain model rather than first-slice habit
- `REQ-F-ODDSVC-001` — odd_service is incubated as an odd_method product line before standalone promotion
- `REQ-F-ODDSVC-002` — odd_service owns orchestration and worker-session authority, not runtime truth
- `REQ-F-ODDSVC-003` — odd_service wraps the existing local execution path rather than redefining execution law
- `REQ-F-ODDSVC-004` — odd_service exposes peer client surfaces for CLI and browser clients
- `REQ-F-ODDSVC-005` — odd_service provides named worker registration and contract-driven dispatch routing
- `REQ-F-ODDSVC-006` — odd_service keeps conversation history as observation state, not runtime truth
- `REQ-F-ODDSVC-007` — remote transport requires explicit workspace snapshot provenance and fail-closed verification
- `REQ-F-ODDSVC-008` — odd_manager consumes odd_service as a client, not as a competing session owner
- `REQ-F-ODDSVC-009` — consensus is the first serious proving lane for odd_service
- `REQ-F-REALIZATION-001` — `odd_method` adopts the tenanted realization model from bootstrap
- `REQ-F-REALIZATION-002` — `build_tenants/` is the project-owned realization root beneath singleton specification
- `REQ-F-REALIZATION-003` — Shared and tenant-local realization law are explicit
- `REQ-F-REALIZATION-004` — Supporting documentation has a non-constitutional home
- `REQ-F-RUNTIME-001` — ABG owns raw runtime fact truth
- `REQ-F-RUNTIME-002` — `odd_method` configures policy but does not implement a shadow runtime
- `REQ-F-RUNTIME-004` — Runtime topology is GTL/ABG-native and project-owned
- `REQ-F-UPSTREAM-001` — Source material is not live authority until re-adopted
- `REQ-F-UPSTREAM-002` — Imported truth is classified explicitly before downstream use
- `REQ-F-UPSTREAM-003` — Prior runtime/control-plane baggage does not carry forward by default
- `REQ-F-VERIFY-001` — Every live requirement has written testcase authority
- `REQ-F-VERIFY-002` — Capability claims are proved through scenario bundles and significant paths
- `REQ-F-VERIFY-003` — Installed-dev proof is the decisive proving lane
- `REQ-F-VERIFY-004` — The first proving lane exercises the first constructive edge under substrate fact truth

## Requirements Without Test Trace

- `REQ-F-ODDSDLC-018` — the software-domain build-out lands as one operative model without passive legacy retention
- `REQ-F-ODDSDLC-019` — inherited odd_sdlc material is explicitly classified during the transformation wave
- `REQ-F-ODDSDLC-021` — odd_sdlc publishes the current executive GTL carrier over its active software-domain graph
- `REQ-F-ODDSDLC-023` — odd_sdlc retains reusable higher-order review and consensus harnesses as active software-domain capability
- `REQ-F-ODDSDLC-024` — active odd_sdlc qualification proves the current software-domain model rather than first-slice habit
- `REQ-F-VERIFY-001` — Every live requirement has written testcase authority

## Orphan Candidates

- code files without `Implements`: none
- test modules without `Validates`/`usecase_id`: none
- support helpers without trace tags: `build_tenants/python/test_env/tests/fake_fp_agent.py`
- unknown `Implements` references: none
- unknown `Validates` references: `REQ-R-ABG3-POLICY`

## Full Matrix

| Requirement | Status | Spec File | Scenario Authority | Code | Tests | Use Cases |
| --- | --- | --- | --- | --- | --- | --- |
| `REQ-F-ASSET-001` | code+scenario | `specification/requirements/06-bootstrap-assets-and-recursive-edges.md` | `specification/scenarios/05-bootstrap-assets-and-recursive-edges.md` | `build_tenants/python/code/odd_sdlc/gtl_module.py` | — | — |
| `REQ-F-ASSET-002` | code+scenario | `specification/requirements/06-bootstrap-assets-and-recursive-edges.md` | `specification/scenarios/05-bootstrap-assets-and-recursive-edges.md` | `build_tenants/python/code/odd_sdlc/gtl_module.py` | — | — |
| `REQ-F-ASSET-003` | code+scenario | `specification/requirements/06-bootstrap-assets-and-recursive-edges.md` | `specification/scenarios/05-bootstrap-assets-and-recursive-edges.md` | `build_tenants/python/code/odd_sdlc/gtl_module.py` | — | — |
| `REQ-F-ASSET-004` | code+scenario | `specification/requirements/06-bootstrap-assets-and-recursive-edges.md` | `specification/scenarios/05-bootstrap-assets-and-recursive-edges.md` | `build_tenants/python/code/odd_sdlc/gtl_module.py` | — | — |
| `REQ-F-ASSETMODEL-001` | code+tests | `specification/requirements/07-asset-typing-and-binding.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/domain_model.py`<br>`build_tenants/python/code/odd_sdlc/workspace_assets.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py` | — |
| `REQ-F-ASSETMODEL-002` | code+tests | `specification/requirements/07-asset-typing-and-binding.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/asset_types.py`<br>`build_tenants/python/code/odd_sdlc/domain_model.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py` | — |
| `REQ-F-ASSETMODEL-003` | code+tests | `specification/requirements/07-asset-typing-and-binding.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/domain_model.py`<br>`build_tenants/python/code/odd_sdlc/workspace_assets.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py` | — |
| `REQ-F-ASSETMODEL-004` | code+tests | `specification/requirements/07-asset-typing-and-binding.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/domain_model.py`<br>`build_tenants/python/code/odd_sdlc/function_catalog.py`<br>`build_tenants/python/code/odd_sdlc/gtl_module.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py` | — |
| `REQ-F-ASSETMODEL-005` | code+tests | `specification/requirements/07-asset-typing-and-binding.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/asset_types.py`<br>`build_tenants/python/code/odd_sdlc/constructor.py`<br>`build_tenants/python/code/odd_sdlc/domain_model.py`<br>`build_tenants/python/code/odd_sdlc/observer.py`<br>`build_tenants/python/code/odd_sdlc/query.py`<br>`build_tenants/python/code/odd_sdlc/workspace_assets.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py` | — |
| `REQ-F-GFUNC-001` | code+scenario | `specification/requirements/02-graph-functions.md` | `specification/scenarios/02-graph-function-carrier.md` | `build_tenants/python/code/odd_sdlc/gtl_module.py` | — | — |
| `REQ-F-GFUNC-002` | scenario-only | `specification/requirements/02-graph-functions.md` | `specification/scenarios/02-graph-function-carrier.md` | — | — | — |
| `REQ-F-GFUNC-003` | scenario-only | `specification/requirements/02-graph-functions.md` | `specification/scenarios/02-graph-function-carrier.md` | — | — | — |
| `REQ-F-GFUNC-004` | code+scenario | `specification/requirements/02-graph-functions.md` | `specification/scenarios/02-graph-function-carrier.md` | `build_tenants/python/code/odd_sdlc/consensus_harness_module.py`<br>`build_tenants/python/code/odd_sdlc/consensus_module.py`<br>`build_tenants/python/code/odd_sdlc/gtl_module.py` | — | — |
| `REQ-F-GFUNC-005` | scenario-only | `specification/requirements/02-graph-functions.md` | `specification/scenarios/02-graph-function-carrier.md` | — | — | — |
| `REQ-F-ODDSDLC-001` | code+tests | `specification/requirements/08-odd-sdlc-first-slice.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/__init__.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py` | — |
| `REQ-F-ODDSDLC-002` | code+tests | `specification/requirements/08-odd-sdlc-first-slice.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/function_catalog.py`<br>`build_tenants/python/code/odd_sdlc/gtl_module.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py` | — |
| `REQ-F-ODDSDLC-003` | code+tests | `specification/requirements/08-odd-sdlc-first-slice.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/__main__.py`<br>`build_tenants/python/code/odd_sdlc/app.py`<br>`build_tenants/python/code/odd_sdlc/constructor.py`<br>`build_tenants/python/code/odd_sdlc/normalization.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_installation.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_live_codex.py` | `data_mapper_template_inherited_e2e`<br>`live_codex_code_edge`<br>`live_codex_first_edge`<br>`live_codex_two_worker_consensus_round`<br>`live_consensus_harness_two_worker_round` |
| `REQ-F-ODDSDLC-004` | code+tests | `specification/requirements/08-odd-sdlc-first-slice.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md`<br>`specification/scenarios/07-canonical-sandbox-repeatability.md` | `build_tenants/python/code/odd_sdlc/app.py`<br>`build_tenants/python/code/odd_sdlc/consensus_harness_module.py`<br>`build_tenants/python/code/odd_sdlc/consensus_module.py`<br>`build_tenants/python/code/odd_sdlc/constructor.py`<br>`build_tenants/python/code/odd_sdlc/fd_checks.py`<br>`build_tenants/python/code/odd_sdlc/fd_contracts.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_live_codex.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_test19_regression.py` | `canonical_sandbox_repeatability`<br>`data_mapper_test19_topology_regression`<br>`live_codex_code_edge`<br>`live_codex_first_edge`<br>`live_codex_two_worker_consensus_round`<br>`live_consensus_harness_two_worker_round` |
| `REQ-F-ODDSDLC-005` | code+scenario | `specification/requirements/08-odd-sdlc-first-slice.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | `build_tenants/python/code/odd_sdlc/observer.py`<br>`build_tenants/python/code/odd_sdlc/query.py`<br>`build_tenants/python/code/odd_sdlc/query_contract.py` | — | — |
| `REQ-F-ODDSDLC-006` | code+tests | `specification/requirements/08-odd-sdlc-first-slice.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md`<br>`specification/scenarios/07-canonical-sandbox-repeatability.md` | `build_tenants/python/code/odd_sdlc/program_catalog.py`<br>`build_tenants/python/code/odd_sdlc/self_test.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_live_codex.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py` | `canonical_sandbox_repeatability`<br>`live_codex_code_edge`<br>`live_codex_first_edge`<br>`live_codex_two_worker_consensus_round`<br>`live_consensus_harness_two_worker_round` |
| `REQ-F-ODDSDLC-007` | code+tests | `specification/requirements/08-odd-sdlc-first-slice.md` | — | `build_tenants/python/code/odd_sdlc/normalization.py`<br>`build_tenants/python/code/odd_sdlc/release/__init__.py`<br>`build_tenants/python/code/odd_sdlc/release/install.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_installation.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_test19_regression.py` | `data_mapper_template_inherited_e2e`<br>`data_mapper_test19_topology_regression` |
| `REQ-F-ODDSDLC-008` | scenario-only | `specification/requirements/08-odd-sdlc-first-slice.md` | `specification/scenarios/06-first-odd-sdlc-asset-function-call.md` | — | — | — |
| `REQ-F-ODDSDLC-009` | code+scenario | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/project_profile.py`<br>`build_tenants/python/code/odd_sdlc/software_domain_catalog.py` | — | — |
| `REQ-F-ODDSDLC-010` | code+scenario | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/software_domain_catalog.py` | — | — |
| `REQ-F-ODDSDLC-011` | code+scenario | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/software_domain_catalog.py` | — | — |
| `REQ-F-ODDSDLC-012` | code+scenario | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/software_domain_catalog.py` | — | — |
| `REQ-F-ODDSDLC-013` | code+scenario | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/project_profile.py`<br>`build_tenants/python/code/odd_sdlc/software_domain_catalog.py` | — | — |
| `REQ-F-ODDSDLC-014` | code+scenario | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/software_domain_catalog.py` | — | — |
| `REQ-F-ODDSDLC-015` | code+scenario | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/software_domain_catalog.py` | — | — |
| `REQ-F-ODDSDLC-016` | code+scenario | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/software_domain_catalog.py` | — | — |
| `REQ-F-ODDSDLC-017` | scenario-only | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | — | — | — |
| `REQ-F-ODDSDLC-018` | spec-only | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | — | — | — | — |
| `REQ-F-ODDSDLC-019` | spec-only | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | — | — | — | — |
| `REQ-F-ODDSDLC-020` | code+tests | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md` | `build_tenants/python/code/odd_sdlc/app.py`<br>`build_tenants/python/code/odd_sdlc/query.py`<br>`build_tenants/python/code/odd_sdlc/query_contract.py`<br>`build_tenants/python/code/odd_sdlc/workspace_assets.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py` | — |
| `REQ-F-ODDSDLC-021` | spec-only | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | — | — | — | — |
| `REQ-F-ODDSDLC-022` | code+tests | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | — | `build_tenants/python/code/odd_sdlc/normalization.py`<br>`build_tenants/python/code/odd_sdlc/release/install.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_installation.py` | `data_mapper_template_inherited_e2e` |
| `REQ-F-ODDSDLC-023` | spec-only | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | — | — | — | — |
| `REQ-F-ODDSDLC-024` | spec-only | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | — | — | — | — |
| `REQ-F-ODDSDLC-025` | code+tests | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/10-capability-gated-operational-convergence.md` | `build_tenants/python/code/odd_sdlc/gtl_module.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_capability_gating_usecase.py` | `capability_gated_operational_convergence` |
| `REQ-F-ODDSDLC-026` | code+tests | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/10-capability-gated-operational-convergence.md` | `build_tenants/python/code/odd_sdlc/fd_checks.py`<br>`build_tenants/python/code/odd_sdlc/gtl_module.py`<br>`build_tenants/python/code/odd_sdlc/project_profile.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_capability_gating_usecase.py` | `capability_gated_operational_convergence` |
| `REQ-F-ODDSDLC-027` | code+tests | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/11-ambiguity-register-disambiguation-pipeline.md` | `build_tenants/python/code/odd_sdlc/ambiguity.py`<br>`build_tenants/python/code/odd_sdlc/app.py`<br>`build_tenants/python/code/odd_sdlc/normalization.py`<br>`build_tenants/python/code/odd_sdlc/project_profile.py`<br>`build_tenants/python/code/odd_sdlc/query.py`<br>`build_tenants/python/code/odd_sdlc/workspace_assets.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_disambiguation_usecase.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_installation.py` | `ambiguity_register_disambiguation_pipeline` |
| `REQ-F-ODDSDLC-028` | code+tests | `specification/requirements/10-odd-sdlc-software-domain-buildout.md` | `specification/scenarios/11-ambiguity-register-disambiguation-pipeline.md` | `build_tenants/python/code/odd_sdlc/ambiguity.py`<br>`build_tenants/python/code/odd_sdlc/project_profile.py` | `build_tenants/python/test_env/tests/test_odd_sdlc_disambiguation_usecase.py` | `ambiguity_register_disambiguation_pipeline` |
| `REQ-F-ODDSVC-001` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-ODDSVC-002` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-ODDSVC-003` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-ODDSVC-004` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-ODDSVC-005` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-ODDSVC-006` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-ODDSVC-007` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-ODDSVC-008` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-ODDSVC-009` | scenario-only | `specification/requirements/09-odd-service-orchestration-plane.md` | `specification/scenarios/08-odd-service-orchestration-plane.md` | — | — | — |
| `REQ-F-REALIZATION-001` | scenario-only | `specification/requirements/05-realization-topology.md` | `specification/scenarios/04-tenant-realization-topology.md` | — | — | — |
| `REQ-F-REALIZATION-002` | scenario-only | `specification/requirements/05-realization-topology.md` | `specification/scenarios/04-tenant-realization-topology.md` | — | — | — |
| `REQ-F-REALIZATION-003` | scenario-only | `specification/requirements/05-realization-topology.md` | `specification/scenarios/04-tenant-realization-topology.md` | — | — | — |
| `REQ-F-REALIZATION-004` | scenario-only | `specification/requirements/05-realization-topology.md` | `specification/scenarios/04-tenant-realization-topology.md` | — | — | — |
| `REQ-F-RUNTIME-001` | scenario-only | `specification/requirements/03-runtime-governance.md` | `specification/scenarios/03-first-constructive-edge-runtime-facts.md` | — | — | — |
| `REQ-F-RUNTIME-002` | scenario-only | `specification/requirements/03-runtime-governance.md` | `specification/scenarios/03-first-constructive-edge-runtime-facts.md` | — | — | — |
| `REQ-F-RUNTIME-003` | code+scenario | `specification/requirements/03-runtime-governance.md` | `specification/scenarios/03-first-constructive-edge-runtime-facts.md` | `build_tenants/python/code/odd_sdlc/fd_checks.py`<br>`build_tenants/python/code/odd_sdlc/fd_contracts.py` | — | — |
| `REQ-F-RUNTIME-004` | scenario-only | `specification/requirements/03-runtime-governance.md` | `specification/scenarios/03-first-constructive-edge-runtime-facts.md` | — | — | — |
| `REQ-F-UPSTREAM-001` | scenario-only | `specification/requirements/01-upstream-adoption.md` | `specification/scenarios/01-upstream-adoption-boundary.md` | — | — | — |
| `REQ-F-UPSTREAM-002` | scenario-only | `specification/requirements/01-upstream-adoption.md` | `specification/scenarios/01-upstream-adoption-boundary.md` | — | — | — |
| `REQ-F-UPSTREAM-003` | scenario-only | `specification/requirements/01-upstream-adoption.md` | `specification/scenarios/01-upstream-adoption-boundary.md` | — | — | — |
| `REQ-F-VERIFY-001` | spec-only | `specification/requirements/04-verification.md` | — | — | — | — |
| `REQ-F-VERIFY-002` | scenario-only | `specification/requirements/04-verification.md` | `specification/scenarios/03-first-constructive-edge-runtime-facts.md` | — | — | — |
| `REQ-F-VERIFY-003` | test-only | `specification/requirements/04-verification.md` | `specification/scenarios/03-first-constructive-edge-runtime-facts.md`<br>`specification/scenarios/07-canonical-sandbox-repeatability.md` | — | `build_tenants/python/test_env/tests/conftest.py`<br>`build_tenants/python/test_env/tests/run_archive.py`<br>`build_tenants/python/test_env/tests/sandbox_runtime.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py` | `canonical_sandbox_repeatability` |
| `REQ-F-VERIFY-004` | test-only | `specification/requirements/04-verification.md` | `specification/scenarios/03-first-constructive-edge-runtime-facts.md`<br>`specification/scenarios/07-canonical-sandbox-repeatability.md` | — | `build_tenants/python/test_env/tests/conftest.py`<br>`build_tenants/python/test_env/tests/run_archive.py`<br>`build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py` | `canonical_sandbox_repeatability` |
