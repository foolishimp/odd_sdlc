# T-204 Restored Original Criteria File Walk

Date: 2026-06-25

Scope: current `build_tenants/typescript/code/src` file set.

This replaces the 2026-06-24 closure-refresh interpretation for closure
purposes. The original T-204 rule is restored:

- default answer for TypeScript source is delete or move to ABG;
- surviving source must be GTL declaration, product plugin/API action, product
  meaning that ABG must consume, or narrow test/release proof plumbing;
- generic traversal mechanics, command/control, runtime observation,
  continuation, replay, archive analysis, workspace normalization, execution
  transport, and result ingress belong in ABG;
- plugin files are not exempt if they own ABG runtime/control behavior;
- a source file can be present only as a split candidate until the ABG-owned
  mechanics are actually removed.

This is not a closure proof. It is the restored file-by-file work queue.

## Summary

Current file count: 175.

| action | files | closure meaning |
| --- | ---: | --- |
| `survive` | 12 | positive survival under original criteria |
| `survive_after_contract_audit` | 9 | likely plugin/hook contract, still prove no runtime/control |
| `survive_after_effect_audit` | 14 | plugin surface, but must be audited for effects/control |
| `survive_after_law_audit` | 37 | product carrier/policy, still prove no traversal/runtime authority |
| `survive_narrow` | 10 | narrow package/release/runtime-substrate plumbing |
| `split` | 27 | product meaning may survive; ABG-owned mechanics must move/delete |
| `split_exports` | 2 | barrel exports must stop exposing local runtime/control |
| `split_move_to_abg` | 1 | plugin/session adapter is mixed with runtime/control ownership |
| `split_or_move_to_abg` | 29 | operator-local mixed code; default is move unless split proves product meaning |
| `move_to_abg` | 20 | fails original criteria as current local source |
| `review_or_delete` | 6 | fixture/proof code must be deleted or narrowly isolated |
| `review_or_move_common` | 8 | shared helper must prove product specificity or move common/ABG |

## File Walk

| file | restored classification | action | reason |
| --- | --- | --- | --- |
| `admission/codecs.ts` | product_carrier | survive_after_law_audit | SDLC product admission helpers; must remain product-value only. |
| `admission/index.ts` | product_carrier | survive_after_law_audit | Product admission barrel; must not export runtime/control. |
| `analysis/analyze.ts` | move_to_abg | move_to_abg | Generic run/archive analysis belongs to ABG unless rebuilt as narrow product proof fixture. |
| `analysis/archive_reader.ts` | move_to_abg | move_to_abg | Archive reading is generic runtime/proof infrastructure. |
| `analysis/bloat_slope.ts` | move_to_abg | move_to_abg | Run/archive analytics, not SDLC product meaning. |
| `analysis/carrier_loaders.ts` | move_to_abg | move_to_abg | Generic artifact loader over runtime archives. |
| `analysis/diagnostics.ts` | move_to_abg | move_to_abg | Diagnostic archive interpretation belongs behind ABG proof/read APIs. |
| `analysis/edge_attempts.ts` | move_to_abg | move_to_abg | Attempt reconstruction is replay/archive analysis. |
| `analysis/index.ts` | move_to_abg | move_to_abg | Barrel for ABG-owned analysis surface. |
| `analysis/liveness.ts` | move_to_abg | move_to_abg | Runtime liveness analysis is ABG substrate behavior. |
| `analysis/profiles.ts` | move_to_abg | move_to_abg | Analysis profile machinery is generic proof tooling. |
| `analysis/render_markdown.ts` | move_to_abg | move_to_abg | Analyzer report rendering follows ABG-owned analysis. |
| `analysis/requirement_lineage.ts` | move_to_abg | move_to_abg | Archive-lineage projection must be ABG-admitted or narrowed to product carrier. |
| `analysis/retry_forensics.ts` | move_to_abg | move_to_abg | Retry forensics is replay/archive analysis. |
| `analysis/runtime_gaps.ts` | move_to_abg | move_to_abg | Runtime gap derivation belongs to ABG gaps/control truth. |
| `analysis/summary_drift.ts` | move_to_abg | move_to_abg | Summary/archive drift analysis is generic proof tooling. |
| `analysis/types.ts` | move_to_abg | move_to_abg | Types for the ABG-owned analysis surface. |
| `assurance/ambiguity.ts` | product_carrier | survive_after_law_audit | Product assurance carrier; no runtime authority allowed. |
| `assurance/capability.ts` | product_carrier | survive_after_law_audit | Product capability/assurance carrier. |
| `assurance/carriers.ts` | product_carrier | survive_after_law_audit | Product assurance carrier definitions. |
| `assurance/component_depth.ts` | product_carrier | survive_after_law_audit | Product assurance meaning over component depth. |
| `assurance/design_completeness.ts` | product_carrier | survive_after_law_audit | Product assurance meaning over design completeness. |
| `assurance/fold.ts` | product_carrier | survive_after_law_audit | Product assurance fold only if it does not close/traverse. |
| `assurance/index.ts` | product_carrier | survive_after_law_audit | Product assurance barrel. |
| `assurance/materialization.ts` | product_carrier | survive_after_law_audit | Product materialization assurance carrier. |
| `assurance/obligation_carry.ts` | product_carrier | survive_after_law_audit | Product obligation carry semantics. |
| `assurance/requirement_fulfillment.ts` | product_carrier | survive_after_law_audit | Product fulfillment semantics, not ABG closure truth. |
| `assurance/semantic_convergence.ts` | product_carrier | survive_after_law_audit | Product semantic-convergence carrier, not runtime convergence. |
| `assurance/shallow_realization.ts` | product_carrier | survive_after_law_audit | Product shallow-realization assurance. |
| `assurance/shared.ts` | product_carrier | survive_after_law_audit | Shared assurance helpers must stay product-specific. |
| `authority/index.ts` | product_carrier | survive_after_law_audit | Product authority barrel. |
| `authority/tenant_stack_authority.ts` | product_carrier | survive_after_law_audit | Tenant stack authority carrier. |
| `contracts/blocking_reason_catalog.ts` | product_carrier | survive_after_law_audit | Product blocking-reason catalog. |
| `contracts/carrier_domain_catalog.ts` | product_carrier | survive_after_law_audit | Product carrier-domain catalog. |
| `contracts/index.ts` | product_carrier | survive_after_law_audit | Product contract barrel. |
| `contracts/operator_run_artifact_catalog.ts` | product_carrier | survive_after_law_audit | Must become product artifact catalog only, not archive authority. |
| `contracts/product_graph_contract_catalog.ts` | product_carrier | survive_after_law_audit | Product graph contract catalog. |
| `domain/admission.ts` | product_carrier | survive_after_law_audit | Domain admission for SDLC product values. |
| `domain/carriers.ts` | product_carrier | survive_after_law_audit | Product domain carriers. |
| `domain/index.ts` | product_carrier | survive_after_law_audit | Product domain barrel; survives only as value exports without runtime/control authority. |
| `domain/operational_projection.ts` | product_carrier | survive_after_law_audit | Product operational meaning only; no runtime transition. |
| `domain/software_domain_catalog.ts` | product_carrier | survive_after_law_audit | Product software-domain catalog. |
| `graph/boundary_refs.ts` | gtl_program | survive | Published GTL boundary refs. |
| `graph/catalog.ts` | gtl_program | survive | Published GTL catalog. |
| `graph/edge_accounting.ts` | gtl_program | survive | GTL edge-accounting declarations. |
| `graph/edge_gain_closure_contracts.ts` | gtl_program | survive | GTL edge gain/closure contract declarations. |
| `graph/index.ts` | gtl_program | survive | GTL graph barrel exporting declarations only. |
| `graph/library.ts` | gtl_program | survive | GTL graph library declarations. |
| `graph/module.ts` | gtl_program | survive | GTL module declaration. |
| `graph/optimising_overlay.ts` | gtl_program | survive | Overlay declarations only; cannot become runtime optimizer. |
| `graph/overlays.ts` | gtl_program | survive | GTL overlay declarations. |
| `graph/target_carrier_contracts.ts` | gtl_program | survive | GTL target-carrier contract declarations. |
| `gtl_conformance/index.ts` | test_or_release_plumbing | survive | ABG compiler gate proof barrel. |
| `gtl_conformance/program.ts` | test_or_release_plumbing | survive | ABG `typecheckGtlProgram(...)` input/proof surface. |
| `hooks/admission.ts` | plugin | survive_after_contract_audit | Product hook/plugin admission. |
| `hooks/carriers.ts` | plugin | survive_after_contract_audit | Product hook/plugin carriers. |
| `hooks/catalog.ts` | plugin | survive_after_contract_audit | Product hook catalog. |
| `hooks/evaluators.ts` | plugin | survive_after_contract_audit | Hook evaluators must remain product plugin logic only. |
| `hooks/fixtures.ts` | plugin | survive_after_contract_audit | Fixture status must be isolated; no closure law. |
| `hooks/hook_set.ts` | plugin | survive_after_contract_audit | Product hook-set declaration. |
| `hooks/index.ts` | plugin | survive_after_contract_audit | Product hook barrel; survives only if exports remain contract/plugin declarations. |
| `hooks/policy.ts` | plugin | survive_after_contract_audit | Product hook policy. |
| `hooks/work_report.ts` | plugin | survive_after_contract_audit | Hook work report carrier. |
| `index.ts` | test_or_release_plumbing | split_exports | Root barrel currently exports broad local runtime/projection surfaces. |
| `install/admission.ts` | test_or_release_plumbing | split | Install admission may survive; event/runtime authorship must move to ABG. |
| `install/carriers.ts` | test_or_release_plumbing | split | Install carriers may survive narrowly. |
| `install/index.ts` | test_or_release_plumbing | split | Install barrel must not expose runtime/control. |
| `install/installer.ts` | test_or_release_plumbing | split | Installer docs/package writing may survive; runtime event authorship must move. |
| `install/instruction_files.ts` | test_or_release_plumbing | split | Installation instruction generation only. |
| `operational/carriers.ts` | product_carrier | survive_after_law_audit | Product operational carriers. |
| `operational/index.ts` | product_carrier | survive_after_law_audit | Product operational barrel; must not expose execution transition authority. |
| `operational/operational.ts` | product_carrier | survive_after_law_audit | Product operational policy, not transition execution. |
| `operational/policy.ts` | product_carrier | survive_after_law_audit | Product operational policy. |
| `operator/abg_runtime_binding.ts` | plugin | split | ABG plugin binding factory, but currently constructs local start/query/workspace state. |
| `operator/assurance_gate.ts` | move_to_abg | split_or_move_to_abg | Operator-local assurance gate must be split from ABG closure/gate truth. |
| `operator/carriers.ts` | move_to_abg | split_or_move_to_abg | Mixed operator carriers need product-only extraction. |
| `operator/closure_state_machine.ts` | move_to_abg | split_or_move_to_abg | Closure state machine belongs to ABG unless only product residual-pressure carrier remains. |
| `operator/component_depth_register.ts` | move_to_abg | split_or_move_to_abg | Product register admission may survive; operator-local control must move. |
| `operator/composition_identity.ts` | move_to_abg | split_or_move_to_abg | Selected composition identity is ABG/GTL law; local helper needs proof or deletion. |
| `operator/compute_subworkstreams.ts` | move_to_abg | split_or_move_to_abg | Subworkstream orchestration/control must move to ABG; carrier rows may survive. |
| `operator/decomposition_admission.ts` | move_to_abg | split_or_move_to_abg | Product decomposition meaning may survive; traversal selection/control must not. |
| `operator/depth_traversal.ts` | move_to_abg | split_or_move_to_abg | Traversal machinery is ABG-owned. |
| `operator/design_depth_register.ts` | move_to_abg | split_or_move_to_abg | Register admission may survive; archive/evaluator authority must not. |
| `operator/edge_gain_closure.ts` | move_to_abg | split_or_move_to_abg | Edge gain/closure local fold must move unless only product candidate remains. |
| `operator/edge_output_policy.ts` | move_to_abg | split_or_move_to_abg | Product output policy may survive after removing closure/control assumptions. |
| `operator/feature_dependency_dag.ts` | move_to_abg | split_or_move_to_abg | DAG projection may survive only as product candidate; frontier execution is ABG. |
| `operator/feature_scope.ts` | move_to_abg | split_or_move_to_abg | Product scope helper needs carrier-only extraction. |
| `operator/index.ts` | test_or_release_plumbing | split_exports | Internal barrel currently exposes local operator/session surfaces. |
| `operator/installed_operator.ts` | plugin | split_move_to_abg | Plugin callback adapter is mixed with worker dispatch, archive writes, retry/evaluate/consequence state. |
| `operator/live_fp_parallel_materialization_frontier.ts` | move_to_abg | split_or_move_to_abg | Frontier execution/control belongs to ABG; product frontier carrier only may survive. |
| `operator/plugins/consequence/constructor_projection.ts` | plugin | survive_after_effect_audit | Plugin projection; verify no closure/replay/control authorship. |
| `operator/plugins/consequence/edge_projection.ts` | plugin | survive_after_effect_audit | Plugin file currently contains execution effects; split those to ABG before closure. |
| `operator/plugins/consequence/repair_reentry.ts` | plugin | survive_after_effect_audit | Product repair-surface triage may survive; ABG owns re-entry execution. |
| `operator/plugins/evaluate/content_register.ts` | plugin | survive_after_effect_audit | Evaluate plugin content ledger; must be plugin I/O, not second contract law. |
| `operator/plugins/evaluate/design_depth_register.ts` | plugin | survive_after_effect_audit | Evaluate plugin register admission; no archive-status authority. |
| `operator/plugins/evaluate/index.ts` | plugin | survive_after_effect_audit | Evaluate plugin barrel. |
| `operator/plugins/evaluate/postflight.ts` | plugin | survive_after_effect_audit | Evaluate plugin postflight candidate only. |
| `operator/plugins/evaluate/postflight_checks.ts` | plugin | survive_after_effect_audit | Deterministic plugin checks; execution transport/generic archive checks must move. |
| `operator/plugins/evaluate/prompts.ts` | plugin | survive_after_effect_audit | Prompt projection over typed assets, not prompt-only law. |
| `operator/plugins/plugin_contracts.ts` | plugin | survive_after_effect_audit | Plugin contract declarations. |
| `operator/plugins/plugin_set.ts` | plugin | survive_after_effect_audit | Plugin registration shell; callbacks must not hide local runtime/control. |
| `operator/plugins/transform/launch_contract.ts` | plugin | survive_after_effect_audit | Transform plugin I/O contract; launch/control behavior must be ABG-owned. |
| `operator/plugins/transform/prompt_edge_policy.ts` | plugin | survive_after_effect_audit | Transform prompt policy over typed carriers. |
| `operator/plugins/transform/result_projection.ts` | plugin | survive_after_effect_audit | Result projection must consume ABG-admitted envelopes, not infer from files. |
| `operator/postflight/gap_dossier.ts` | product_projection | split | Product gap dossier candidate only; ABG owns gaps/control truth. |
| `operator/product_materialization/authority.ts` | product_projection | split | Product materialization authority may survive; generic observation/replay must move. |
| `operator/product_materialization/manifest.ts` | product_projection | split | Product materialization manifest carrier may survive. |
| `operator/product_materialization/observation.ts` | product_projection | split | Observation over runtime files must move or become ABG-admitted input. |
| `operator/product_materialization/replay.ts` | product_projection | split | Replay belongs to ABG. |
| `operator/product_materialization/staged_authority.ts` | product_projection | split | Staged product authority may survive. |
| `operator/product_materialization/surface_paths.ts` | product_projection | split | Product surface path catalog may survive if not runtime normalization. |
| `operator/prompt_assets.ts` | move_to_abg | split_or_move_to_abg | Prompt assets may survive as GTL AssetSurface projection; local schema law must not. |
| `operator/register_purpose.ts` | move_to_abg | split_or_move_to_abg | Register-purpose catalog may survive only as product carrier catalog. |
| `operator/review_grade_edge_fulfillment.ts` | move_to_abg | split_or_move_to_abg | Product review meaning may survive; retry/closure routing must move. |
| `operator/runtime_policy.ts` | move_to_abg | split_or_move_to_abg | Runtime policy belongs to ABG unless it is plugin tool capability data. |
| `operator/system_artifacts.ts` | move_to_abg | split_or_move_to_abg | Artifact writing/storage is generic system behavior. |
| `operator/test_design_register.ts` | move_to_abg | split_or_move_to_abg | Product test-design register may survive; operator admission/control must split. |
| `operator/test_execution_surface_register.ts` | move_to_abg | split_or_move_to_abg | Test-execution carrier may survive; execution/result ingress belongs to ABG. |
| `operator/test_pipeline.ts` | move_to_abg | split_or_move_to_abg | Test pipeline orchestration belongs to ABG/test harness. |
| `operator/tool_environment.ts` | move_to_abg | split_or_move_to_abg | Tool environment belongs to ABG worker/tool substrate unless product capability data. |
| `operator/transport.ts` | move_to_abg | split_or_move_to_abg | Worker transport is ABG-owned substrate. |
| `operator/traversal_complexity.ts` | move_to_abg | split_or_move_to_abg | Traversal selection/control belongs to ABG; product complexity hints only may survive. |
| `operator/traversal_consequence.ts` | move_to_abg | split_or_move_to_abg | Local closure/next-action/consequence fold violates original T-204 unless split to product candidate only. |
| `operator/traversal_strategy.ts` | move_to_abg | split_or_move_to_abg | Traversal strategy must be ABG runtime selection or product declarative policy only. |
| `operator/work_category_governance.ts` | move_to_abg | split_or_move_to_abg | Work-category policy may survive only as product plugin policy. |
| `operator/worker_tool_profile.ts` | move_to_abg | split_or_move_to_abg | Worker tool profile belongs to ABG/tool substrate unless product capability declaration. |
| `package_api/index.ts` | test_or_release_plumbing | survive_narrow | Package source resolution support only. |
| `package_binding/carriers.ts` | test_or_release_plumbing | survive_narrow | Package binding carrier. |
| `package_binding/index.ts` | test_or_release_plumbing | survive_narrow | Package binding barrel. |
| `package_binding/node_package.ts` | test_or_release_plumbing | survive_narrow | Node package binding support. |
| `postflight/gap_dossier_plan.ts` | product_projection | split | Product postflight plan candidate only; ABG owns gap routing. |
| `postflight/index.ts` | product_projection | split | Postflight barrel must not expose gap/control law. |
| `projection/index.ts` | product_projection | split | Product projection barrel; archive/runtime closure derivation must move. |
| `projection/query_domain.ts` | product_projection | split | Product query read model may survive; runtime/archive gap derivation must move. |
| `projection/requirement_closure.ts` | product_projection | split | Requirement closure product projection may survive if not runtime closure truth. |
| `qualification/enterprise_core_inventory.ts` | test_or_release_plumbing | review_or_delete | Qualification fixture/proof; keep isolated or delete. |
| `qualification/enterprise_core_iteration_sandbox.ts` | test_or_release_plumbing | review_or_delete | Sandbox proof fixture, not product runtime. |
| `qualification/index.ts` | test_or_release_plumbing | review_or_delete | Qualification barrel must not publish default gate law. |
| `qualification/installed_initial_state.ts` | test_or_release_plumbing | review_or_delete | Installed-state proof helper only. |
| `qualification/rc_qualification.ts` | test_or_release_plumbing | review_or_delete | RC proof plumbing only; must consume ABG release gates. |
| `qualification/sandbox_proof.ts` | test_or_release_plumbing | review_or_delete | Sandbox proof helper only. |
| `release/carriers.ts` | test_or_release_plumbing | survive_narrow | Release-cut carrier definitions only. |
| `release/index.ts` | test_or_release_plumbing | survive_narrow | Release barrel; survives only as packaging/proof exports. |
| `release/release_cut.ts` | test_or_release_plumbing | survive_narrow | Release-cut packaging, not runtime closure. |
| `release/release_snapshot.ts` | test_or_release_plumbing | survive_narrow | Release-snapshot packaging. |
| `runtime/abiogenesis_substrate.ts` | test_or_release_plumbing | survive_narrow | ABG substrate version/contract binding only. |
| `runtime/index.ts` | test_or_release_plumbing | survive_narrow | Runtime barrel must remain substrate binding only. |
| `shared/blocking_reason.ts` | product_carrier | review_or_move_common | Product-specific blocking reasons may survive; generic reason law moves to ABG/common. |
| `shared/collections.ts` | product_carrier | review_or_move_common | Generic helper should move common unless kept private and product-specific. |
| `shared/digest.ts` | product_carrier | review_or_move_common | Generic digest helper should move common/ABG. |
| `shared/fd_admission.ts` | product_carrier | review_or_move_common | F_D admission helper must prove product specificity. |
| `shared/overlay_strategy.ts` | product_carrier | review_or_move_common | Product overlay strategy carrier may survive. |
| `shared/path.ts` | product_carrier | review_or_move_common | Generic path helper should move common/ABG. |
| `shared/traversal_strategy_plan.ts` | product_carrier | review_or_move_common | Product strategy plan carrier may survive if declarative only. |
| `shared/validation.ts` | product_carrier | review_or_move_common | Generic validation helper should move common/ABG. |
| `start/index.ts` | move_to_abg | move_to_abg | Start runtime-binding projection belongs behind ABG start. |
| `start/policy.ts` | move_to_abg | move_to_abg | Start target policy must be ABG-consumed declaration, not local start law. |
| `start/public_start.ts` | move_to_abg | move_to_abg | Public start/worker attachment/execution contract path is ABG command/control boundary. |
| `tickets/index.ts` | product_carrier | survive_after_law_audit | Ticket workflow product carrier/projection. |
| `tickets/workflow.ts` | product_carrier | survive_after_law_audit | Ticket workflow product meaning; no command/control. |
| `triage/carriers.ts` | product_carrier | survive_after_law_audit | Product triage carriers. |
| `triage/index.ts` | product_carrier | survive_after_law_audit | Product triage barrel; must stay policy/value projection only. |
| `triage/policy.ts` | product_carrier | survive_after_law_audit | Product triage policy. |
| `triage/triage.ts` | product_carrier | survive_after_law_audit | Product triage carrier/projection only. |
| `workspace/bootstrap_lineage.ts` | product_projection | split | Product bootstrap lineage may survive; workspace normalization/generic ingress must move. |
| `workspace/carriers.ts` | product_projection | split | Product workspace carriers may survive. |
| `workspace/index.ts` | product_projection | split | Workspace barrel must not expose generic runtime/workspace controllers. |
| `workspace/ingress.ts` | product_projection | split | Product authority ingress may survive; generic workspace handling moves. |
| `workspace/project_authority_conformance.ts` | product_projection | split | Product conformance projection may survive. |
| `workspace/project_constraints.ts` | product_projection | split | Product constraints carrier may survive. |
| `workspace/project_profile.ts` | product_projection | split | Product profile carrier may survive. |
| `workspace/runtime_layout.ts` | product_projection | split | Runtime layout is ABG/workspace substrate unless product-only surface paths. |
| `workspace/source_input.ts` | product_projection | split | Source input product carrier may survive if not workspace normalization. |
| `workspace_api/entry.ts` | move_to_abg | move_to_abg | Gaps/query API currently reads runtime archives and must become ABG CLI/API surface. |
| `workspace_api/index.ts` | move_to_abg | move_to_abg | Barrel for ABG-owned gaps/query API unless narrowed to product query library. |

## Immediate Implications

1. The 2026-06-24 inventory is not closure-authoritative.
2. T-204 cannot close while `move_to_abg`, `split`, `split_exports`,
   `split_move_to_abg`, `split_or_move_to_abg`, `review_or_delete`, or
   `review_or_move_common` rows remain unresolved.
3. The first implementation slice should not start by patching evaluator prompt
   behavior. It should cut the exported/local runtime-control surface:
   `index.ts`, `operator/index.ts`, `start/*`, `workspace_api/*`,
   `analysis/*`, and `operator/installed_operator.ts`.
4. Plugin evaluation must inspect behavior, not folder path. Any plugin file
   that launches workers, runs tests, writes runtime artifacts, infers accepted
   plugin results from local files, or selects continuation/re-entry is still a
   T-204 boundary defect.
