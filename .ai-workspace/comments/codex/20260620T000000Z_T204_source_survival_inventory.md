# T-204 Source Survival Inventory

Generated from the current `build_tenants/typescript/code/src` tree after the T-204 command-surface cut.

## 2026-06-24 Closure Refresh

The live tree now contains 175 TypeScript source files under
`build_tenants/typescript/code/src`.

- The current tree has no `effects/*` source files.
- The current tree has no `operator/event_store.ts`.
- `operator/register_purpose.ts` is classified as a product projection
  carrier catalog and is covered by the register-purpose gate.
- `start/*` survives as product start-intent, target-policy, and
  runtime-binding contract projection consumed by the ABG CLI/runtime binding;
  it is not a package command, local executor, retry loop, or replay controller.
- `operator/installed_operator.ts` survives as an ABG-consumed plugin/session
  adapter. Public start/control exports and installed start executors are gone;
  ABG owns command/control, retry, replay, continuation, and runtime truth.
- `operator/traversal_consequence.ts` survives as an SDLC consequence
  candidate/read-model surface over admitted evidence. ABG owns final bind,
  terminal status, runtime transition, replay, and continuation truth.
- `test_t197_product_gtl_gate` now parses this inventory and fails if any
  current `code/src` file is missing, marked `move_to_abg`, marked `delete`, or
  still has `survival_pending` action.

## 2026-06-21 Correction (claude reclassification review)

Two corrections to this read-model after a constitution check:

1. **`analysis/*` (15 files) reclassified `move_to_abg/survival_pending` → `product_projection/survive`.** It is not generic ABG-facing debt: it is the product's **closure-proof harness**, bound by live requirement **REQ-F-ODDSDLC-081** (AC-6 analyzer reports missing/extra edge-accounting rows; AC-7 "T-172 closure is blocked while any selected executive edge is unaccounted"; AC-9 analyzer output is the read-only traversal-selection projection), by ratified design **`ODD_SDLC_TYPESCRIPT_STAGED_COMPUTE_BOUNDARY.md:56,60`** ("analyzer proof: projections over admitted carriers" as an in-tenant common surface), and by product gates **t197/t180** which read `code/src/analysis/*.ts` by path. Ratified design + live requirements outrank this read-model, so the original `move_to_abg` tag was the defect. KEEP in tenant. (`runtime_gaps.ts` and `requirement_lineage.ts` are the most product-specific via catalog coupling.)
2. **`effects/environment.ts` + `effects/index.ts` deleted** (orphaned, zero consumers in source or tests; build + focused gates green).
3. **Isolated dead exports deleted**: `writeTestExecutionResultSystemTransformOutput(...)`, `SdlcTicketDeclaredStatus`, and the unused closed-F_D mechanics descriptor object/check-list types. The retained `SDLC_ASSURANCE_CLOSED_FD_MECHANICS_CLASS_REF` remains live assurance predecessor truth.
4. **`effects/file_store.ts` narrowed**: the unused read-plan branch and `read_text_file` effect kind were removed; the write-plan path remains live through `operator/plugins/consequence/edge_projection.ts` and T-175.

## Counts

- gtl_program: 10
- plugin: 25
- product_carrier: 43
- product_projection: 72
- test_or_release_plumbing: 25
- move_to_abg: 0
- delete/noncurrent historical rows: 6
- total current source files: 175

## Inventory

| file | classification | action | survival proof / debt |
| --- | --- | --- | --- |
| `admission/codecs.ts` | product_carrier | survive | product carrier admission codecs for SDLC-owned values; no runtime control, command parsing, replay, or traversal authority |
| `admission/index.ts` | product_carrier | survive | product carrier admission barrel for SDLC-owned values; no runtime control, command parsing, replay, or traversal authority |
| `analysis/analyze.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/archive_reader.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/bloat_slope.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/carrier_loaders.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/diagnostics.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/edge_attempts.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/index.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/liveness.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/profiles.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/render_markdown.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/requirement_lineage.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/retry_forensics.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/runtime_gaps.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/summary_drift.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `analysis/types.ts` | product_projection | survive | product closure-proof harness bound by REQ-F-ODDSDLC-081 (AC-6/7/9) + ratified STAGED_COMPUTE_BOUNDARY design + gates t197/t180; KEEP in tenant |
| `assurance/ambiguity.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/capability.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/carriers.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/component_depth.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/design_completeness.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/fold.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/index.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/materialization.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/obligation_carry.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/requirement_fulfillment.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/semantic_convergence.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/shallow_realization.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `assurance/shared.ts` | product_carrier | survive | SDLC assurance carriers/folds over product meaning |
| `authority/index.ts` | product_carrier | survive | tenant/product authority carriers |
| `authority/tenant_stack_authority.ts` | product_carrier | survive | tenant/product authority carriers |
| `contracts/blocking_reason_catalog.ts` | product_carrier | survive | published product contract catalogs |
| `contracts/carrier_domain_catalog.ts` | product_carrier | survive | published product contract catalogs |
| `contracts/index.ts` | product_carrier | survive | published product contract catalogs |
| `contracts/operator_run_artifact_catalog.ts` | product_carrier | survive | published product contract catalogs |
| `contracts/product_graph_contract_catalog.ts` | product_carrier | survive | published product contract catalogs |
| `domain/admission.ts` | product_carrier | survive | domain carriers and catalog |
| `domain/carriers.ts` | product_carrier | survive | domain carriers and catalog |
| `domain/index.ts` | product_carrier | survive | domain carriers and catalog |
| `domain/operational_projection.ts` | product_carrier | survive | domain carriers and catalog |
| `domain/software_domain_catalog.ts` | product_carrier | survive | domain carriers and catalog |
| `effects/archive_store.ts` | delete | done 2026-06-24 | deleted with the local effects shell; no current source file |
| `effects/environment.ts` | delete | done 2026-06-21 | orphaned, zero consumers in source or tests; deleted |
| `effects/file_store.ts` | delete | done 2026-06-24 | deleted with the local effects shell; no current source file |
| `effects/index.ts` | delete | done 2026-06-21 | unused barrel (live effects imported by direct path); deleted |
| `effects/process_runner.ts` | delete | done 2026-06-24 | deleted with the local effects shell; no current source file |
| `graph/boundary_refs.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/catalog.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/edge_accounting.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/edge_gain_closure_contracts.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/index.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/library.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/module.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/optimising_overlay.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/overlays.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `graph/target_carrier_contracts.ts` | gtl_program | survive | published graph program, overlays, and GTL target contracts |
| `gtl_conformance/index.ts` | test_or_release_plumbing | survive | semantic conformance gate over GTL program |
| `gtl_conformance/program.ts` | test_or_release_plumbing | survive | semantic conformance gate over GTL program |
| `hooks/admission.ts` | plugin | survive | hook contracts and product hook catalog |
| `hooks/carriers.ts` | plugin | survive | hook contracts and product hook catalog |
| `hooks/catalog.ts` | plugin | survive | hook contracts and product hook catalog |
| `hooks/evaluators.ts` | plugin | survive | hook contracts and product hook catalog |
| `hooks/fixtures.ts` | plugin | survive | hook contracts and product hook catalog |
| `hooks/hook_set.ts` | plugin | survive | hook contracts and product hook catalog |
| `hooks/index.ts` | plugin | survive | hook contracts and product hook catalog |
| `hooks/policy.ts` | plugin | survive | hook contracts and product hook catalog |
| `hooks/work_report.ts` | plugin | survive | hook contracts and product hook catalog |
| `index.ts` | test_or_release_plumbing | survive | public package barrel with no CLI/spec-method/start command exports |
| `install/admission.ts` | test_or_release_plumbing | survive | install artifact/guidance plumbing, no traversal control |
| `install/carriers.ts` | test_or_release_plumbing | survive | install artifact/guidance plumbing, no traversal control |
| `install/index.ts` | test_or_release_plumbing | survive | install artifact/guidance plumbing, no traversal control |
| `install/installer.ts` | test_or_release_plumbing | survive | install artifact/guidance plumbing, no traversal control |
| `install/instruction_files.ts` | test_or_release_plumbing | survive | install artifact/guidance plumbing, no traversal control |
| `operational/carriers.ts` | product_carrier | survive | operational policy/carriers |
| `operational/index.ts` | product_carrier | survive | operational policy/carriers |
| `operational/operational.ts` | product_carrier | survive | operational policy/carriers |
| `operational/policy.ts` | product_carrier | survive | operational policy/carriers |
| `operator/abg_runtime_binding.ts` | plugin | survive | ABG runtime plugin binding factory |
| `operator/assurance_gate.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/carriers.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/closure_state_machine.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/component_depth_register.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/composition_identity.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/compute_subworkstreams.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/decomposition_admission.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/depth_traversal.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/design_depth_register.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/edge_gain_closure.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/edge_output_policy.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/event_store.ts` | delete | done 2026-06-24 | deleted; ABG owns runtime event storage/replay truth |
| `operator/feature_dependency_dag.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/feature_scope.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/index.ts` | test_or_release_plumbing | survive | internal barrel only; no command/control exports |
| `operator/installed_operator.ts` | plugin | survive | ABG-consumed plugin/session adapter; command/start executors are removed, worker invocation goes through the ABG supervised process actor, and source gates reject local start/control/reentry/runtime-event authorship |
| `operator/live_fp_parallel_materialization_frontier.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/plugins/consequence/constructor_projection.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/consequence/edge_projection.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/consequence/repair_reentry.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/evaluate/content_register.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/evaluate/design_depth_register.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/evaluate/index.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/evaluate/postflight.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/evaluate/postflight_checks.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/evaluate/prompts.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/plugin_contracts.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/plugin_set.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/transform/launch_contract.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/transform/prompt_edge_policy.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/plugins/transform/result_projection.ts` | plugin | survive | ABG-consumed plugin transform/evaluate/consequence support |
| `operator/postflight/gap_dossier.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/product_materialization/authority.ts` | product_projection | survive | product materialization authority/read-model logic |
| `operator/product_materialization/manifest.ts` | product_projection | survive | product materialization authority/read-model logic |
| `operator/product_materialization/observation.ts` | product_projection | survive | product materialization authority/read-model logic |
| `operator/product_materialization/replay.ts` | product_projection | survive | product materialization authority/read-model logic |
| `operator/product_materialization/staged_authority.ts` | product_projection | survive | product materialization authority/read-model logic |
| `operator/product_materialization/surface_paths.ts` | product_projection | survive | product materialization authority/read-model logic |
| `operator/prompt_assets.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/register_purpose.ts` | product_projection | survive | register-purpose catalog over SDLC product carrier/read-model ownership; gate proves every surviving register/ledger has one explicit purpose |
| `operator/review_grade_edge_fulfillment.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/runtime_policy.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/system_artifacts.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/test_design_register.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/test_execution_surface_register.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/test_pipeline.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/tool_environment.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/transport.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/traversal_complexity.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/traversal_consequence.ts` | product_projection | survive | SDLC consequence candidate/read model over admitted evidence; ABG owns final bind, terminal status, runtime transition, replay, and continuation truth |
| `operator/traversal_strategy.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/work_category_governance.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/worker_tool_profile.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `package_api/index.ts` | test_or_release_plumbing | survive | package source resolution API |
| `package_binding/carriers.ts` | test_or_release_plumbing | survive | package binding/install support |
| `package_binding/index.ts` | test_or_release_plumbing | survive | package binding/install support |
| `package_binding/node_package.ts` | test_or_release_plumbing | survive | package binding/install support |
| `postflight/gap_dossier_plan.ts` | product_projection | survive | product postflight plan projection |
| `postflight/index.ts` | product_projection | survive | product postflight plan projection |
| `projection/index.ts` | product_projection | survive | query-domain and requirement closure projections |
| `projection/query_domain.ts` | product_projection | survive | query-domain and requirement closure projections |
| `projection/requirement_closure.ts` | product_projection | survive | query-domain and requirement closure projections |
| `qualification/enterprise_core_inventory.ts` | test_or_release_plumbing | survive | qualification/proof reporting |
| `qualification/enterprise_core_iteration_sandbox.ts` | test_or_release_plumbing | survive | qualification/proof reporting |
| `qualification/index.ts` | test_or_release_plumbing | survive | qualification/proof reporting |
| `qualification/installed_initial_state.ts` | test_or_release_plumbing | survive | qualification/proof reporting |
| `qualification/rc_qualification.ts` | test_or_release_plumbing | survive | qualification/proof reporting |
| `qualification/sandbox_proof.ts` | test_or_release_plumbing | survive | qualification/proof reporting |
| `release/carriers.ts` | test_or_release_plumbing | survive | release cut/snapshot support |
| `release/index.ts` | test_or_release_plumbing | survive | release cut/snapshot support |
| `release/release_cut.ts` | test_or_release_plumbing | survive | release cut/snapshot support |
| `release/release_snapshot.ts` | test_or_release_plumbing | survive | release cut/snapshot support |
| `runtime/abiogenesis_substrate.ts` | test_or_release_plumbing | survive | ABG substrate version/contract binding |
| `runtime/index.ts` | test_or_release_plumbing | survive | ABG substrate version/contract binding |
| `shared/blocking_reason.ts` | product_carrier | survive | shared typed helpers; review for ABG migration if generic |
| `shared/collections.ts` | product_carrier | survive | shared typed helpers; review for ABG migration if generic |
| `shared/digest.ts` | product_carrier | survive | shared typed helpers; review for ABG migration if generic |
| `shared/fd_admission.ts` | product_carrier | survive | shared typed helpers; review for ABG migration if generic |
| `shared/overlay_strategy.ts` | product_carrier | survive | shared typed helpers; review for ABG migration if generic |
| `shared/path.ts` | product_carrier | survive | shared typed helpers; review for ABG migration if generic |
| `shared/traversal_strategy_plan.ts` | product_carrier | survive | shared typed helpers; review for ABG migration if generic |
| `shared/validation.ts` | product_carrier | survive | shared typed helpers; review for ABG migration if generic |
| `start/index.ts` | product_projection | survive | package-internal barrel for start-intent/runtime-binding projection; not exported as a public package command surface |
| `start/policy.ts` | product_projection | survive | SDLC target-policy projection consumed by ABG runtime binding; no command parsing, stop predicate, retry loop, or runtime controller |
| `start/public_start.ts` | product_projection | survive | product start-intent and runtime-binding contract projection consumed by ABG CLI/runtime binding; ABG owns start execution, worker attachment truth, retry, replay, and continuation |
| `tickets/index.ts` | product_projection | survive | ticket workflow projection/admission |
| `tickets/workflow.ts` | product_projection | survive | ticket workflow projection/admission |
| `triage/carriers.ts` | product_carrier | survive | product triage policy/carriers |
| `triage/index.ts` | product_carrier | survive | product triage policy/carriers |
| `triage/policy.ts` | product_carrier | survive | product triage policy/carriers |
| `triage/triage.ts` | product_carrier | survive | product triage policy/carriers |
| `workspace/bootstrap_lineage.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace/carriers.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace/index.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace/ingress.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace/project_authority_conformance.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace/project_constraints.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace/project_profile.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace/runtime_layout.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace/source_input.ts` | product_projection | survive | workspace authority ingress/read models |
| `workspace_api/entry.ts` | product_projection | survive | commandless query/gaps/ticket read-model API |
| `workspace_api/index.ts` | product_projection | survive | commandless query/gaps/ticket read-model API |
