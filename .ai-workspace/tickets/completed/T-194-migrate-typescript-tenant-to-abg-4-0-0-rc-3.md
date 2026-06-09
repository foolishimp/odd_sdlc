---
id: T-194
title: Migrate TypeScript tenant to ABIogenesis 4.0.0-rc.3
type: chore
ticket_category: implementation_migration
status: completed
proof_status: passed
build_tenant: typescript
owner: odd_sdlc
created_at: 2026-06-08
updated_at: 2026-06-08
triaged_at: 2026-06-08
completed_at: 2026-06-08
priority: high
change_class: requirement_reprice
re_entry_point: runtime_governance
migration_strategy: inside_out_hard_break
library_usage: consume
governing_library: /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.3/release-snapshot-manifest.json
governance_scope: SPEC_METHOD process constitution / ODD Method refinement / TypeScript tenant
source_documents:
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - specification/PRODUCT.md
  - specification/requirements/17-target-carrier-contracts.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/package.json
  - build_tenants/typescript/package-lock.json
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.3/release-snapshot-manifest.json
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.3/checksums.sha256
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-150-promote-prompt-assets-into-gtl-typed-asset-interface.md
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/gtl_program_conformance.ts
upstream_authority:
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.3/release-snapshot-manifest.json
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.3/checksums.sha256
affected_boundary:
  - specification/PRODUCT.md
  - specification/requirements/17-target-carrier-contracts.md
  - build_tenants/typescript/package.json
  - build_tenants/typescript/package-lock.json
  - build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/prompt_assets.ts
  - build_tenants/typescript/code/src/operator/plugins/plugin_contracts.ts
  - build_tenants/typescript/code/src/operator/plugins/plugin_set.ts
  - build_tenants/typescript/code/src/operator/review_grade_edge_fulfillment.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
  - build_tenants/typescript/test_env/tests/test_t194_gtl_program_conformance.test.mjs
  - build_tenants/typescript/test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs
  - build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs
  - build_tenants/typescript/test_env/tests/test_t180_abg_4_current_staged_compute_boundary.test.mjs
  - build_tenants/typescript/test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs
  - build_tenants/typescript/test_env/tests/test_t192_evaluation_grid_prompt_contract.test.mjs
target_truth: odd_sdlc.TS consumes ABIogenesis `@abiogenesis/typescript-tenant@4.0.0-rc.3` from the immutable clean ABIogenesis release snapshot, and SDLC tests prove the installed package exposes the ABG4 contract surfaces SDLC consumes, including the GTL contract-fulfillment binding used at handoff/review-grade boundaries and the ABG-owned `typecheckGtlProgram(...)` function used to typecheck graph functions, prompt construction, and ABG plugin contracts.
superseded_truth: odd_sdlc.TS may consume the dirty local `3.9.0-rc.13` ABIogenesis snapshot, keep rc13 fold refs, prove only the version string while relying on stale config paths and unvalidated scoped redispatch rows, or down-convert ABG4 handoff contracts into SDLC-local lookalike carriers.
closure_law: This ticket closes when package metadata, product substrate law, runtime substrate contract, prompt fold refs, review-grade handoff contracts, install adapter tests, staged-compute tests, and the ABG-owned GTL program conformance tool all name and consume ABIogenesis 4.0.0-rc.3; the ABI snapshot checksum verifies; the program conformance function reports zero active graph, prompt, plugin, and source-identity issues; focused migration tests pass; the full semantic suite passes; and at least one installed hello-world live lane proves the migrated substrate in the operator path.
non_closure_conditions:
  - active TypeScript source, graph declarations, runtime policy carriers, prompt refs, or tests still publish old ABIogenesis 3.x/rc3/rc13 identities as current truth
  - migration proof lacks a guard that rejects stale active ABIogenesis identity refs outside explicitly historical archives/prose
  - SDLC owns GTL program conformance rules locally instead of supplying inventory to an ABG-owned program conformance function
  - the consumed ABIogenesis package snapshot does not export `typecheckGtlProgram` and `formatGtlProgramConformanceIssues`
  - prompt construction is not included in the GTL program conformance inventory as GTL `AssetSurface` / `Node` truth with rendered digest and current fold refs
  - ABG plugin contracts are not included in the GTL program conformance inventory
  - current graph/function/vector/overlay inventory rows are treated as preservation requirements instead of being dispositioned as keep, reprice, reclassify, merge, or delete
  - any legacy graph row remains published after being dispositioned as delete, or any deletion leaves stale overlay, target carrier, edge contract, query, start, archive, or test references
  - package metadata, product substrate text, runtime contract, prompt refs, or current tests still name rc13 as the consumed substrate
  - lockfile or installed node_modules resolve to any ABIogenesis package other than 4.0.0-rc.3
  - release-adapter checksum/source metadata does not match the 4.0.0-rc.3 manifest
  - tests accept the old `.abiogenesis/config/abg.fallbacks.json` path as current ABI install truth
  - scoped redispatch tests omit ABG basis/runtime projection validation
  - SDLC invents local ABG4 carriers instead of consuming ABIogenesis
  - review-grade handoff findings publish SDLC-local fulfillment bindings instead of ABIogenesis `GtlContractFulfillmentBinding`
---

# T-194: Migrate TypeScript Tenant To ABIogenesis 4.0.0-rc.3

## Intake

Smallest lawful re-entry point: `requirement_reprice`.

Reason: the consumed ABIogenesis release snapshot is declared product/runtime
truth for the TypeScript tenant. ABIogenesis 4.0.0-rc.3 replaces the dirty
rc13 local snapshot with a clean release snapshot and carries the ABG defaults,
temporal runtime scope, iteration-state-action, prompt asset, scoped
redispatch, and contract-fulfillment API surfaces that `odd_sdlc.TS` consumes.
The handoff/review-grade boundary shall consume ABIogenesis
`GtlContractFulfillmentBinding` directly instead of keeping an SDLC-local
contract lookalike.

## Migration Declaration

Migration strategy: `inside_out_hard_break`.

Library usage: `consume`.

Governing library:
`/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.3/release-snapshot-manifest.json`.

Old truth path:

```text
@abiogenesis/typescript-tenant@3.9.0-rc.13
  -> dirty local release snapshot
  -> rc13 product/runtime contract
  -> rc13 fold refs and install-config tests
```

New truth path:

```text
@abiogenesis/typescript-tenant@4.0.0-rc.3
  -> clean ABIogenesis release snapshot
  -> package dependency and lockfile
  -> runtime substrate contract
  -> prompt fold refs
  -> GTL handoff/review-grade fulfillment binding
  -> install, staged compute, grid, semantic, and live proofs
```

Old producer set:

- ABIogenesis rc13 tarball and manifest.
- SDLC rc13 dependency pin and runtime contract.
- SDLC tests that allowed the old fallback config path and row-only scoped
  redispatch helper call.

New producer set:

- ABIogenesis 4.0.0-rc.3 tarball, manifest, and checksum file.
- ABIogenesis GTL program conformance tool:
  `typecheckGtlProgram(...)` and `formatGtlProgramConformanceIssues(...)`.
- SDLC dependency pin and lockfile.
- SDLC runtime substrate contract and prompt fold ref.
- SDLC install and staged-compute tests updated for ABI4 config and scoped
  projection validation.
- SDLC review-grade handoff parser and prompt updated to emit and admit ABG4
  `GtlContractFulfillmentBinding` truth.

Consumer set:

- TypeScript build and package resolver.
- SDLC public install adapter.
- SDLC runtime substrate report.
- SDLC evaluator prompt sidecars.
- SDLC prompt construction inventory projected as GTL `AssetSurface` / `Node`
  rows for the GTL program conformance tool.
- SDLC ABG plugin contract inventory projected to the GTL program conformance tool.
- SDLC review-grade fulfillment assessment.
- SDLC staged-compute and evaluation-grid proof tests.
- Installed hello-world live lane.

Projection, report, status, and proof surfaces:

- `ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT`
- package dependency and lockfile
- ABI release manifest/checksum
- T-028 substrate report
- T-059 install/release adapter report
- T-180 staged compute proof
- T-182 review-grade handoff fulfillment proof
- T-192 evaluation grid prompt proof
- T-194 GTL program conformance report
- installed hello-world operator archive

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] recurring realization patterns are checked against the existing ABI release-snapshot framework
- [x] ticket declares library usage and names the governing library
- [x] old truth path is removed from current product/runtime/test truth
- [x] active TypeScript policy/carrier identities no longer publish stale ABIogenesis 3.x/rc3/rc13 refs as current truth
- [x] ABG package exports the GTL program conformance tool used by this ticket
- [x] SDLC `test:t194` supplies graph, target-carrier, edge-contract, overlay, public-start, prompt-construction, plugin-contract, and source-identity inventories to the ABG tool
- [x] GTL program conformance report rejects stale active ABIogenesis identity refs outside explicitly historical archives/prose
- [x] GTL program conformance report rejects prompt construction that is not a GTL `AssetSurface` / `Node` view with rendered digest and current fold refs
- [x] GTL program conformance report rejects plugin contracts that fail ABG plugin admission or try to own engine authority
- [x] every current graph/function/vector/overlay row has an explicit disposition: keep, reprice, reclassify, merge, or delete
- [x] every dispositioned legacy graph is deleted from catalog, module publication, overlays, target carrier rows, edge contracts, query/start projections, tests, and archived-current proof expectations
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving old rc13 behavior are removed, renamed, or repriced
- [x] review-grade handoff contracts consume ABG4 `GtlContractFulfillmentBinding`
- [x] focused migration proof passes
- [x] full semantic suite passes
- [x] installed hello-world live proof passes

## Reopen Audit

Reopened on 2026-06-08 after TS-only graph/GTL audit.

The ABIogenesis package pin and ABG4 handoff binding consumption are real, but
the ticket overclaimed closure. Active TypeScript runtime and graph surfaces
still publish old ABIogenesis identity refs:

- `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts` publishes
  `policy-carrier://odd-sdlc/evaluate-next/source-default/abg-3.7`,
  `hook-resolution://odd-sdlc/source-default/abg-3.7`, and related `abg-3.7`
  digests.
- `build_tenants/typescript/code/src/graph/module.ts` publishes
  `policy://odd-sdlc/abg-3.9-rc3-staged-compute` in graph-vector composition
  declarations.
- `build_tenants/typescript/code/src/operator/installed_operator.ts` publishes
  `policy://odd-sdlc/installed-worker-runtime/abg-3.7.1` as a live runtime
  watchdog policy ref.

The focused proof pack passed, but it does not prove the stronger migration
property. Some active tests still assert old labels, so the proof currently
misses stale active identity classes. Closure now requires either repricing
these live refs to version-neutral SDLC policy IDs with explicit ABG4 source
refs, or renaming them directly to ABG 4.0.0-rc.3 identities, plus a
deterministic stale-identity guard.

## SPEC_METHOD One-Truth Boundary

`SPEC_METHOD.md` is the process constitution and the single method truth
surface for this ticket. T-194 does not introduce a local method standard.
ODD/Graph/GTL method sources may refine the product shape, but they do not
replace `SPEC_METHOD.md` as process law.

The GTL program conformance tool introduced for this ticket is not a method-law
publisher. It is an ABIogenesis contract-conformance tool over already typed
GTL/ABG surfaces: graph functions, graph vectors, target carriers, edge
contracts, prompt `AssetSurface` / `Node` rows, plugin contracts, and active
source-identity rows. SDLC supplies inventory. ABIogenesis owns the GTL/ABG
contract checks. `SPEC_METHOD.md` remains the only process constitution.

## Scope Reframe

This reopened ticket is the cleanup of accumulated TypeScript SDLC graph tech
debt that accrued across the ABG 3.7, 3.9 rc3, rc13, and ABG4 migration line.
It is not closed by the package pin alone.

Closure requires a full audit and cleanup of the current TypeScript graph
catalog, graph-function publications, graph vectors, target carrier rows, edge
gain/closure contracts, output asset types, overlays, public start targets, and
active policy/prompt/test identities. Every active graph-facing surface must
either consume ABG 4.0.0-rc.3 directly or publish version-neutral SDLC policy
identity with explicit ABG4 source refs. Active current-truth surfaces must not
publish ABG 3.x, rc3, rc13, or SDLC-local lookalike GTL authority.

The inventory below is the current surface to audit, not the target surface to
preserve. Some rows are expected to be deleted as legacy graph debt. For each
row, the implementation must record one disposition:

- `keep`: retained as current graph truth with ABG4-compliant identities
- `reprice`: retained but renamed or rebound to ABG4/version-neutral identity
- `reclassify`: retained as projection-only, library-only, historical, or test
  fixture truth rather than active graph truth
- `merge`: folded into another current graph/function/vector with preserved
  target-carrier and edge-contract meaning
- `delete`: removed from graph catalog/module publication and every dependent
  overlay, start target, target carrier, edge contract, query projection, test,
  prompt, archive-current proof expectation, and read model

Deletion is the expected outcome for legacy graphs that exist only to preserve
old ABG 3.x/rc3/rc13 migration shape, split-edge scaffolding, or product-local
truth that ABG4 now owns.

Python tenant graph debt is explicitly out of scope for this ticket.

## ABG4 Graph/GTL Program Typecheck Audit Checklist

Generated from the current TypeScript `constructSdlcGraphFunctionCatalog()`,
`constructSdlcGtlModule()`, `constructSdlcTraversalOverlayCatalog()`,
`constructSdlcTargetCarrierRegistry()`, and
`SDLC_EDGE_GAIN_CLOSURE_CONTRACTS`, then submitted to the ABIogenesis
`typecheckGtlProgram(...)` tool. SDLC owns inventory projection only. ABG
owns the deterministic typecheck rules.

Checklist rule for every row: verify the surface consumes ABG 4.0.0-rc.3 or
version-neutral SDLC policy refs with explicit ABG4 source refs, uses ABG/GTL
carriers instead of SDLC-local lookalikes, and does not publish ABG
3.x/rc3/rc13 current truth. Then record the disposition as keep, reprice,
reclassify, merge, or delete. A checked row means the disposition was applied,
not merely reviewed.

Inventory counts:

- [x] 13 reusable library graph functions audited
- [x] 37 product leaf graph functions audited
- [x] 6 executive graph functions audited
- [x] 56 module graph-function publications audited
- [x] 111 materialized graph-vector identities audited
- [x] 64 unique production target-carrier rows audited
- [x] 64 unique edge gain/closure contracts audited
- [x] 52 output asset types audited
- [x] 5 traversal overlays audited
- [x] 7 public start targets audited
- [x] 3 prompt construction families audited through GTL `AssetSurface` / `Node`
- [x] 5 ABG plugin contracts audited through `EnginePluginContract` admission
- [x] ABG-owned program conformance function added to the ABI package and consumed by SDLC
- [x] active stale-identity scan supplied to ABG function and passing
- [x] legacy graph deletion cascade guard added and passing

### ABG Program Conformance Function Control Point

- [x] ABIogenesis source now defines `typecheckGtlProgram(...)` under
  `abg/m03/contracts`.
- [x] ABIogenesis focused proof covers graph closure, graph rows, prompt
  assets, plugin contracts, coverage admission, ABI version admission, report
  identity binding, and stale source identities.
- [x] ABIogenesis CLI wrapper delegates to `typecheckGtlProgram(...)` through
  `abiogenesis-ts typecheck-gtl-program --input <json>`.
- [x] SDLC T-194 test consumes the ABIogenesis function rather than embedding the
  rule engine locally.
- [x] consumed ABIogenesis release snapshot contains the program conformance function export.
- [x] `npm run test:t194` passes from a clean SDLC install pinned to the release
  snapshot.
- [x] full semantic suite includes the GTL program conformance tool gate.
- [x] typecheck input is generated from the real SDLC module/catalog/registry:
  56 published graph functions, 111 materialized graph-vector identities,
  64 unique target-carrier rows, 64 unique edge contracts, 5 overlays, 7 public
  start targets, 3 prompt asset rows, and 5 plugin contracts.

### Disposition Audit Closure

- [x] each retained reusable graph function has a written keep/reprice/reclassify rationale
- [x] each retained product leaf graph function has a written keep/reprice/reclassify rationale
- [x] each retained executive graph function has a written keep/reprice/reclassify rationale
- [x] each deleted graph function is absent from `graph/catalog.ts`, `graph/module.ts`, `graph/overlays.ts`, `projection/query_domain.ts`, `start/public_start.ts`, target carrier rows, edge contracts, and tests
- [x] each merged graph function has preserved source asset, target asset, target carrier, edge contract, overlay, start target, and replay identity
- [x] no target carrier row remains for a deleted vector
- [x] no edge gain/closure contract remains for a deleted vector
- [x] no overlay names a deleted graph function or vector
- [x] no public start target names a deleted graph function
- [x] no query-domain asset ownership row advertises a deleted producer
- [x] no test asserts deleted graph names, old ABG identities, or legacy split-edge scaffolding as current truth

### Reusable Library Graph Functions

- [x] `Fg_single_typed_traversal`
- [x] `Fg_ingress_project`
- [x] `Fg_conform_project`
- [x] `Fg_conform_project_authority`
- [x] `Fg_materialize_declared_product_asset`
- [x] `Fg_materialization_assurance_ledger`
- [x] `Fg_semantic_convergence_assurance_ledger`
- [x] `Fg_obligation_carry_assurance_ledger`
- [x] `Fg_requirement_fulfillment_assurance_ledger`
- [x] `Fg_ambiguity_assurance_ledger`
- [x] `Fg_capability_assurance_ledger`
- [x] `Fg_shallow_realization_assurance_ledger`
- [x] `Fg_traversal_assurance_fold`

### Product Leaf Graph Functions

- [x] `derive_intent_surface` -> `intent_surface`
- [x] `derive_product_surface` -> `product_surface`
- [x] `derive_goal_surface` -> `goal_surface`
- [x] `derive_requirement_surface` -> `requirement_surface`
- [x] `derive_uat_testcases_surface` -> `uat_testcases_surface`
- [x] `derive_testcase_authority_surface` -> `testcase_authority_surface`
- [x] `derive_feature_decomp_surface` -> `feature_decomp_surface`
- [x] `derive_design_surface` -> `design_surface`
- [x] `derive_scenario_surface` -> `scenario_surface`
- [x] `derive_implementation_design_surface` -> `implementation_design_surface`
- [x] `derive_component_code_surface` -> `component_code_surface`
- [x] `qualify_component_realization_surface` -> `component_realization_qualification_surface`
- [x] `derive_code_surface` -> `code_surface`
- [x] `derive_test_design_surface` -> `test_design_surface`
- [x] `derive_component_test_surface` -> `component_test_surface`
- [x] `prepare_test_execution_surface` -> `test_execution_surface`
- [x] `derive_test_execution_result_surface` -> `test_execution_result_surface`
- [x] `qualify_component_test_execution_surface` -> `component_test_qualification_surface`
- [x] `derive_component_repair_schedule_surface` -> `component_repair_schedule_surface`
- [x] `derive_test_run_archive_surface` -> `test_run_archive_surface`
- [x] `derive_release_depth_parity_surface` -> `release_depth_parity_surface`
- [x] `prepare_release_surface` -> `release_surface`
- [x] `derive_lite_design_adr_surface` -> `implementation_design_surface`
- [x] `derive_lite_component_code_surface` -> `component_code_surface`
- [x] `prepare_build_execution_surface` -> `build_execution_surface`
- [x] `derive_build_execution_result_surface` -> `build_execution_result_surface`
- [x] `prepare_deployment_surface` -> `deployment_surface`
- [x] `derive_deployment_result_surface` -> `deployment_result_surface`
- [x] `derive_deployed_environment_surface` -> `deployed_environment_surface`
- [x] `derive_runtime_observation_surface` -> `runtime_observation_surface`
- [x] `derive_retrofit_plan_surface` -> `retrofit_plan_surface`
- [x] `observe_gap_pressure` -> `gap_observation_surface`
- [x] `classify_gap_triage` -> `gap_triage_surface`
- [x] `bind_gap_route` -> `gap_route_surface`
- [x] `propose_constitutional_repricing` -> `repricing_proposal_surface`
- [x] `route_ticket_work_item` -> `ticket_work_item_route_surface`
- [x] `retire_gap_after_loopback` -> `gap_retirement_surface`

### Executive Graph Functions

- [x] `bootstrap_release_self_test`
- [x] `release_operational_cycle`
- [x] `bootstrap_requirements`
- [x] `solution_architecture`
- [x] `lite_design_module_implementation`
- [x] `framework_smoke_min_fp`

### Published Module Graph Functions

- [x] `Fg_single_typed_traversal`
- [x] `Fg_ingress_project`
- [x] `Fg_conform_project`
- [x] `Fg_conform_project_authority`
- [x] `Fg_materialize_declared_product_asset`
- [x] `Fg_materialization_assurance_ledger`
- [x] `Fg_semantic_convergence_assurance_ledger`
- [x] `Fg_obligation_carry_assurance_ledger`
- [x] `Fg_requirement_fulfillment_assurance_ledger`
- [x] `Fg_ambiguity_assurance_ledger`
- [x] `Fg_capability_assurance_ledger`
- [x] `Fg_shallow_realization_assurance_ledger`
- [x] `Fg_traversal_assurance_fold`
- [x] `bootstrap_release_self_test`
- [x] `release_operational_cycle`
- [x] `bootstrap_requirements`
- [x] `solution_architecture`
- [x] `lite_design_module_implementation`
- [x] `framework_smoke_min_fp`
- [x] `derive_intent_surface`
- [x] `derive_product_surface`
- [x] `derive_goal_surface`
- [x] `derive_requirement_surface`
- [x] `derive_uat_testcases_surface`
- [x] `derive_testcase_authority_surface`
- [x] `derive_feature_decomp_surface`
- [x] `derive_design_surface`
- [x] `derive_scenario_surface`
- [x] `derive_implementation_design_surface`
- [x] `derive_component_code_surface`
- [x] `qualify_component_realization_surface`
- [x] `derive_code_surface`
- [x] `derive_test_design_surface`
- [x] `derive_component_test_surface`
- [x] `prepare_test_execution_surface`
- [x] `derive_test_execution_result_surface`
- [x] `qualify_component_test_execution_surface`
- [x] `derive_component_repair_schedule_surface`
- [x] `derive_test_run_archive_surface`
- [x] `derive_release_depth_parity_surface`
- [x] `prepare_release_surface`
- [x] `derive_lite_design_adr_surface`
- [x] `derive_lite_component_code_surface`
- [x] `prepare_build_execution_surface`
- [x] `derive_build_execution_result_surface`
- [x] `prepare_deployment_surface`
- [x] `derive_deployment_result_surface`
- [x] `derive_deployed_environment_surface`
- [x] `derive_runtime_observation_surface`
- [x] `derive_retrofit_plan_surface`
- [x] `observe_gap_pressure`
- [x] `classify_gap_triage`
- [x] `bind_gap_route`
- [x] `propose_constitutional_repricing`
- [x] `route_ticket_work_item`
- [x] `retire_gap_after_loopback`

### Graph Vectors, Target Carriers, And Edge Contracts

- [x] `Fg_single_typed_traversal` -> `typed_traversal_closure_surface` / `library_only`
- [x] `Fg_ingress_project` -> `project_surface` / `close_capable`
- [x] `Fg_conform_project` -> `conform_project_profile` / `close_capable`
- [x] `Fg_conform_project_authority` -> `project_bootstrap_surface` / `close_capable`
- [x] `Fg_materialize_declared_product_asset` -> `component_code_surface` / `close_capable`
- [x] `Fg_materialization_assurance_ledger` -> `assurance_ledger` / `library_only`
- [x] `Fg_semantic_convergence_assurance_ledger` -> `assurance_ledger` / `library_only`
- [x] `Fg_obligation_carry_assurance_ledger` -> `assurance_ledger` / `library_only`
- [x] `Fg_requirement_fulfillment_assurance_ledger` -> `assurance_ledger` / `library_only`
- [x] `Fg_ambiguity_assurance_ledger` -> `assurance_ledger` / `library_only`
- [x] `Fg_capability_assurance_ledger` -> `assurance_ledger` / `library_only`
- [x] `Fg_shallow_realization_assurance_ledger` -> `assurance_ledger` / `library_only`
- [x] `Fg_traversal_assurance_fold` -> `traversal_requirement_satisfaction` / `library_only`
- [x] `derive_intent_surface` -> `intent_surface` / `close_capable`
- [x] `derive_product_surface` -> `product_surface` / `close_capable`
- [x] `derive_goal_surface` -> `goal_surface` / `close_capable`
- [x] `derive_requirement_surface` -> `requirement_surface` / `close_capable`
- [x] `derive_uat_testcases_surface` -> `uat_testcases_surface` / `close_capable`
- [x] `derive_testcase_authority_surface` -> `testcase_authority_surface` / `close_capable`
- [x] `derive_feature_decomp_surface` -> `feature_decomp_surface` / `close_capable`
- [x] `derive_design_surface` -> `design_surface` / `close_capable`
- [x] `derive_scenario_surface` -> `scenario_surface` / `close_capable`
- [x] `derive_implementation_design_surface` -> `implementation_design_surface` / `close_capable`
- [x] `derive_component_code_surface` -> `component_code_surface` / `close_capable`
- [x] `qualify_component_realization_surface` -> `component_realization_qualification_surface` / `close_capable`
- [x] `derive_code_surface` -> `code_surface` / `close_capable`
- [x] `derive_test_design_surface` -> `test_design_surface` / `close_capable`
- [x] `derive_component_test_surface` -> `component_test_surface` / `close_capable`
- [x] `prepare_test_execution_surface` -> `test_execution_surface` / `close_capable`
- [x] `derive_test_execution_result_surface` -> `test_execution_result_surface` / `close_capable`
- [x] `qualify_component_test_execution_surface` -> `component_test_qualification_surface` / `close_capable`
- [x] `derive_component_repair_schedule_surface` -> `component_repair_schedule_surface` / `close_capable`
- [x] `derive_test_run_archive_surface` -> `test_run_archive_surface` / `close_capable`
- [x] `derive_release_depth_parity_surface` -> `release_depth_parity_surface` / `close_capable`
- [x] `prepare_release_surface` -> `release_surface` / `close_capable`
- [x] `derive_lite_design_adr_surface` -> `implementation_design_surface` / `close_capable`
- [x] `derive_lite_component_code_surface` -> `component_code_surface` / `close_capable`
- [x] `prepare_build_execution_surface` -> `build_execution_surface` / `close_capable`
- [x] `derive_build_execution_result_surface` -> `build_execution_result_surface` / `close_capable`
- [x] `prepare_deployment_surface` -> `deployment_surface` / `close_capable`
- [x] `derive_deployment_result_surface` -> `deployment_result_surface` / `close_capable`
- [x] `derive_deployed_environment_surface` -> `deployed_environment_surface` / `close_capable`
- [x] `derive_runtime_observation_surface` -> `runtime_observation_surface` / `close_capable`
- [x] `derive_retrofit_plan_surface` -> `retrofit_plan_surface` / `close_capable`
- [x] `observe_gap_pressure` -> `gap_observation_surface` / `projection_only`
- [x] `classify_gap_triage` -> `gap_triage_surface` / `projection_only`
- [x] `bind_gap_route` -> `gap_route_surface` / `projection_only`
- [x] `propose_constitutional_repricing` -> `repricing_proposal_surface` / `projection_only`
- [x] `route_ticket_work_item` -> `ticket_work_item_route_surface` / `projection_only`
- [x] `retire_gap_after_loopback` -> `gap_retirement_surface` / `projection_only`

### Output / Leaf Asset Types

- [x] `ambiguity_register`
- [x] `assurance_ledger`
- [x] `bootstrap_gap_set`
- [x] `build_execution_result_surface`
- [x] `build_execution_surface`
- [x] `capability_contract_surface`
- [x] `code_surface`
- [x] `component_code_surface`
- [x] `component_realization_qualification_surface`
- [x] `component_repair_schedule_surface`
- [x] `component_test_qualification_surface`
- [x] `component_test_surface`
- [x] `conform_project_profile`
- [x] `conformance_gap_set`
- [x] `deployed_environment_surface`
- [x] `deployment_result_surface`
- [x] `deployment_surface`
- [x] `design_surface`
- [x] `execution_contract_surface`
- [x] `feature_decomp_surface`
- [x] `gap_observation_surface`
- [x] `gap_retirement_surface`
- [x] `gap_route_surface`
- [x] `gap_triage_surface`
- [x] `goal_surface`
- [x] `implementation_design_surface`
- [x] `intent_surface`
- [x] `lineage_map`
- [x] `module_inventory_surface`
- [x] `product_surface`
- [x] `project_authority_conformance_projection`
- [x] `project_authority_next_action_projection`
- [x] `project_bootstrap_surface`
- [x] `project_surface`
- [x] `release_depth_parity_surface`
- [x] `release_surface`
- [x] `repricing_proposal_surface`
- [x] `requirement_surface`
- [x] `retrofit_plan_surface`
- [x] `runtime_observation_surface`
- [x] `scenario_surface`
- [x] `selected_tenant_surface`
- [x] `source_input_ledger`
- [x] `test_design_surface`
- [x] `test_execution_result_surface`
- [x] `test_execution_surface`
- [x] `test_run_archive_surface`
- [x] `testcase_authority_surface`
- [x] `ticket_work_item_route_surface`
- [x] `traversal_requirement_satisfaction`
- [x] `typed_traversal_closure_surface`
- [x] `uat_testcases_surface`

### Traversal Overlays

- [x] `overlay://odd-sdlc/current-full-traversal` / `current_full_traversal`
- [x] `overlay://odd-sdlc/framework-smoke-min-fp` / `framework_smoke_min_fp`
- [x] `overlay://odd-sdlc/lite-design-module-implementation` / `lite_design_module_implementation`
- [x] `overlay://odd-sdlc/solution-architecture` / `solution_architecture`
- [x] `overlay://odd-sdlc/bootstrap-requirements` / `bootstrap_requirements`

### Public Start Targets

- [x] `derive_intent_surface`
- [x] `bootstrap_release_self_test`
- [x] `release_operational_cycle`
- [x] `framework_smoke_min_fp`
- [x] `lite_design_module_implementation`
- [x] `solution_architecture`
- [x] `bootstrap_requirements`

### Active Stale-Identity Audit Surface

- [x] `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts` has no active `abg-3.7` policy/digest refs unless renamed historical and removed from runtime carrier truth.
- [x] `build_tenants/typescript/code/src/graph/module.ts` has no active `abg-3.9-rc3-staged-compute` graph-vector policy context.
- [x] `build_tenants/typescript/code/src/operator/installed_operator.ts` has no active `abg-3.7.1` runtime watchdog policy ref.
- [x] `build_tenants/typescript/code/src/analysis/*` stage-truth names are repriced from RC3 current truth or explicitly scoped as historical read-models.
- [x] tests no longer assert old ABG 3.x/rc3 labels as current expected truth.
- [x] migration guard scans active TS source/spec/test/design surfaces and rejects `abg-3.7`, `abg-3.7.1`, `abg-3.9-rc3`, `rc13`, and `3.9.0-rc.13` outside explicit historical allowlist paths.

## Closure Proof Update - 2026-06-08

Implemented and proved this round:

- ABIogenesis `4.0.0-rc.3` is the current immutable ABG4 snapshot consumed by
  SDLC. It supersedes RC2 by carrying the strengthened T-152 stale source
  identity scanner for ABG URI and package forms while preserving the
  ABG-owned GTL program conformance gate:
  `typecheckGtlProgram(...)`,
  `admitGtlProgramConformanceInput(...)`, and
  `formatGtlProgramConformanceIssues(...)`.
- SDLC package metadata and lockfile resolve
  `@abiogenesis/typescript-tenant@4.0.0-rc.3` from the release snapshot, not
  from ABIogenesis source or a temporary pack.
- `test_t194_gtl_program_conformance.test.mjs` supplies the full current
  TypeScript graph program inventory to the ABG function: catalog graph
  functions, module publications, materialized graph vectors, target-carrier
  rows, edge gain/closure rows, overlays, public start targets, prompt
  construction assets, ABG plugin contracts, and active source-identity
  surfaces.
- The ABG function returns zero issues over the current SDLC inventory. The
  report proves one target-carrier row and one edge gain/closure row per
  graph-vector identity, graph output derivability from graph inputs, no stale
  active ABG 3.x/rc3/rc13 current-truth identities in the scanned roots, typed
  prompt construction through GTL `AssetSurface` / `Node` views, and admitted
  ABG plugin contracts.
- Active TypeScript runtime, graph, prompt, package, product, design, and test
  surfaces now name ABIogenesis `4.0.0-rc.3` or version-neutral SDLC policy
  identity with explicit ABG4 source refs.
- RC2 is superseded for this closure: it did not carry the final T-152
  stale-identity scanner fixes. T-194 closes against `4.0.0-rc.3`, the
  immutable snapshot that carries the required function, scanner fix, and
  release evidence.

## Release Snapshot Evidence

- package: `@abiogenesis/typescript-tenant@4.0.0-rc.3`
- snapshot root:
  `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.3`
- tarball:
  `abiogenesis-typescript-tenant-4.0.0-rc.3.tgz`
- sha256:
  `ac67091ef1707a6f5aafb96b37c6f22dbb935628ed969ce5b4b917a3e497ae32`
- npm integrity:
  `sha512-+Drq2f7g42De/DSWEQcgrA8lakjaSqLQaWsqD3wmCJLpzaoPYnpNF5EfENH4qouMygoCMMrNrNC+aSl41jvpEQ==`
- manifest source ref: `HEAD`
- manifest source commit: `89b37e8b50c60d3a2d32aa93f44bf29642dc9f2b`
- manifest dirty flag: `false`

## Acceptance Evidence

- checksum verified against
  `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.0.0-rc.3/checksums.sha256`
- package install resolved `@abiogenesis/typescript-tenant@4.0.0-rc.3` from
  SDLC `node_modules`
- package export proof: `typecheckGtlProgram`,
  `admitGtlProgramConformanceInput`, and
  `formatGtlProgramConformanceIssues` resolve as functions from the installed
  package
- active stale-identity scan is now enforced by
  `build_tenants/typescript/test_env/tests/test_t194_gtl_program_conformance.test.mjs`
  across `specification`, TypeScript source, TypeScript design,
  `test_env/tests`, and `test_env/live`, excluding only that guard's own
  self-test sample strings.
- GTL program conformance proof: `npm run test:t194` passed `3/3` with
  `promptAssetCount === 3`, including `evaluate_design_depth`.
- T-194 RC3 closing commit revision: pending atomic commit of the RC3
  migration/proof slice.
- focused migration and prompt/GTL proof passed:
  `npm run test:t194` `3/3`,
  `npm run test:t028` `3/3`,
  `npm run test:t059` `10/10`,
  `npm run test:t180` `9/9`,
  `npm run test:t192` `4/4`
- focused review-grade handoff proof: `npm run test:t182` passed `18/18`
- lint proof: `npm run lint:semantic` passed
- lint proof: `npm run lint:test-harness` passed
- semantic proof: `npm run test:semantic` passed `940/940`
- diff hygiene: `git diff --check` passed
- live proof:
  `npm run test:scenario:t132-hello-world-js-live` passed `1/1` at
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260607T180503016Z_pid68130`
  in `987636.184625` ms
- live edge proof:
  `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260607T180510821Z_pid68130`
  closed `derive_lite_design_adr_surface` with worker status `0`, design-depth
  status `0`, review-grade status `0`, and closure disposition `close`
- live edge proof:
  `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260607T181301433Z_pid68130`
  closed `derive_lite_component_code_surface` with worker status `0`,
  review-grade status `0`, `operator_summary.json.status=converged`, and
  closure disposition `close`
- generated application proof:
  `node src/hello.js` in the generated hello-world tenant printed
  `Hello, world!`
- generated test proof:
  `node --test test/hello.test.js` in the generated hello-world tenant passed
  `1/1`
