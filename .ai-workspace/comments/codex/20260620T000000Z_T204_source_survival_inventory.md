# T-204 Source Survival Inventory

Generated from the current `build_tenants/typescript/code/src` tree after the T-204 command-surface cut. This is a checkpoint classification, not closure: rows marked `move_to_abg` or `survival_pending` remain active T-204 debt.

## Counts

- gtl_program: 10
- move_to_abg: 25
- plugin: 24
- product_carrier: 43
- product_projection: 53
- test_or_release_plumbing: 25
- total: 180

## Inventory

| file | classification | action | survival proof / debt |
| --- | --- | --- | --- |
| `admission/codecs.ts` | product_carrier | survive | admission codecs |
| `admission/index.ts` | product_carrier | survive | admission codecs |
| `analysis/analyze.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/archive_reader.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/bloat_slope.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/carrier_loaders.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/diagnostics.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/edge_attempts.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/index.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/liveness.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/profiles.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/render_markdown.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/requirement_lineage.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/retry_forensics.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/runtime_gaps.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/summary_drift.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
| `analysis/types.ts` | move_to_abg | survival_pending | archive/run analysis is generic ABG-facing proof debt unless product-specific |
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
| `effects/archive_store.ts` | move_to_abg | survival_pending | generic effect shell should move or be proven package plumbing |
| `effects/environment.ts` | move_to_abg | survival_pending | generic effect shell should move or be proven package plumbing |
| `effects/file_store.ts` | move_to_abg | survival_pending | generic effect shell should move or be proven package plumbing |
| `effects/index.ts` | move_to_abg | survival_pending | generic effect shell should move or be proven package plumbing |
| `effects/process_runner.ts` | move_to_abg | survival_pending | generic effect shell should move or be proven package plumbing |
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
| `index.ts` | test_or_release_plumbing | narrow | public package barrel with no CLI/spec-method/start command exports |
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
| `operator/event_store.ts` | move_to_abg | survival_pending | runtime event store belongs with ABG/runtime archive |
| `operator/feature_dependency_dag.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/feature_scope.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/index.ts` | test_or_release_plumbing | narrow | internal barrel only; no command/control exports |
| `operator/installed_operator.ts` | move_to_abg | survival_pending | residual installed execution/control logic under T-204 audit |
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
| `operator/review_grade_edge_fulfillment.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/runtime_policy.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/system_artifacts.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/test_design_register.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/test_execution_surface_register.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/test_pipeline.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/tool_environment.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/transport.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/traversal_complexity.ts` | product_projection | survive | product policy/carrier/projection support for plugins |
| `operator/traversal_consequence.ts` | product_projection | survival_pending | domain consequence candidate/read model; final fold remains ABG |
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
| `start/index.ts` | move_to_abg | survival_pending | public-start adapter still internal plugin-support debt |
| `start/policy.ts` | move_to_abg | survival_pending | public-start adapter still internal plugin-support debt |
| `start/public_start.ts` | move_to_abg | survival_pending | public-start adapter still internal plugin-support debt |
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
