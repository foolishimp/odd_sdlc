# odd_sdlc RC Release Note

## RC Identity

- product: `odd_sdlc`
- candidate: `v1.0.0-rc.1`
- RC branch: `rc/1.0.0`
- release state: first published release candidate for the `1.0.0` line

This RC publishes the current odd_sdlc source cut after the inside-out repair
wave that:

- moved runtime execution law onto a typed execution-contract carrier
- moved requirement and obligation truth onto a traceability-index /
  requirement-closure carrier family
- collapsed duplicate helper families under one prime owner per semantic job

## What Shipped

### Typed Execution-Contract Runtime Binding

- source bootstrap now publishes explicit `query-assets` asset-binding truth
  for the source line instead of inventing runtime authority from
  `runtime_config.domain_package`
- work-item `route_contract` is published on the asset ownership carrier and
  consumed from there by execution-contract admission
- `execution_contract_surface` now uses typed execution-contract carrier
  variants rather than normal-execution `dict[str, Any]` payloads
- public `start` binds from admitted execution-contract carrier truth rather
  than reconstructing target law from local controller branches
- query/read-model surfaces publish execution-contract projection from the
  runtime contract and fail closed when admitted execution truth is absent

### Requirement Closure And Traceability Carrier Split

- `RequirementTraceabilityIndex` is now the load-bearing source carrier for
  requirement refs and source-scan publication
- `requirement_closure.py` owns the requirement-closure register and declared
  obligation projection family
- `fd_checks.py`, constructor selection, prompt/report context, query-domain,
  and gap-analysis surfaces consume the carrier or a single projection family
  rather than raw helper rescans
- source-line read paths no longer rebuild current requirement truth on demand;
  missing publication returns an unavailable read model or fails closed

### Prime-Law Helper Consolidation

- duplicate helper families were collapsed into one owner per semantic job
  across:
  - operational dispatch classification and register loading
  - project-profile parsing, quote stripping, default slugging, and
    project-constraints interpretation
  - workspace-mode detection
  - write-if-changed publication
  - gap scope selector, declared-obligation spec extraction, and capability-gap
    projection
- constructor-side rescans of `project_constraints.yml` for module, tool, and
  version interpretation were removed in favor of `ProjectProfile`

### Source/Install Boundary Hygiene

- the source repo no longer relies on a source-local `.odd_sdlc/release`
  runtime mirror as release authority
- installed runtime truth remains a downstream `.genesis/odd_sdlc/release`
  concern created by install/reinstall flows, not by source-repo mirroring

## Qualification Bundle

This RC was qualified on the exact source cut published as `v1.0.0-rc.1`.

- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'query_domain_is_read_only_when_analysis_has_not_been_published or requirement_closure_prompt_context_requires_explicit_register or span_analysis_projects_typed_canonical_gap_carriers or t021_gap_support_helpers_have_one_authoritative_owner or refresh_analysis_publishes_deterministic_repair_frontier or refresh_analysis_publishes_distinct_analysis_manifest or execution_contract_projection_carries_route_contract_for_ticket_target or start_projection_fails_closed_without_admitted_execution_contract_surface or query_domain_publishes_execution_contract_surface_from_runtime_contract_projection or execution_contract_surface_rebuild_fails_closed_without_published_runtime_contract'`
- result: `6 passed, 63 deselected in 3.03s`

- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q -k 't020_fd_and_closure_fail_closed_when_traceability_index_carrier_is_unavailable or constructor_bootstrap or code_surface_construction_does_not_delete_tenant_governance_surfaces or t020_fd_and_closure_do_not_fallback_to_traceability_facade or fd_evaluator_reports_expected_requirement_gap_details or fd_evaluator_reports_expected_traceability_family_details or fd_evaluator_reports_expected_orphan_code_details'`
- result: `3 passed, 24 deselected in 0.08s`

- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'installed_query_domain_is_read_only_when_analysis_has_not_been_published or installed_normalize_workspace_without_platform_preserves_existing_active_tenant or normalize_workspace_preserves_onboarded_secondary_tenant_without_topology_migration or normalize_workspace_fails_closed_for_malformed_project_constraints or load_project_profile_preserves_realized_declared_output_root_for_source_style_workspace or data_mapper_template_as_is_requires_scope_and_traceability_work_before_auto_convergence or installed_live_fp_retry_uses_query_assets_contract'`
- result: `5 passed, 27 deselected in 22.25s`

- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_yield_usecase.py -q`
- result: `5 passed in 122.36s (0:02:02)`

## RC Scope

This RC certifies the current source and installed-workspace governance line for
odd_sdlc.

It does not claim that every future orchestration, service, or external live
agent lane is part of this source-cut qualification. Accepted RC-scoped
behavior and caveats are recorded in
[ODD_SDLC_RC_NOTES.md](/Users/jim/src/apps/odd_sdlc/docs/ODD_SDLC_RC_NOTES.md).
