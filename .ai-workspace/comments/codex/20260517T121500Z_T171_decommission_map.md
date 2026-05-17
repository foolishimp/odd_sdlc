# T-171 Decommission Map

Status: active implementation audit.

Purpose: record the retain/derive/replace/delete disposition for TypeScript
surfaces touched by the T-171 test35-parity refactor. This map is G0 evidence
for the no-compatibility-lane rule. A surface not listed here is not claimed
closed by T-171.

## Disposition Table

| Surface | Original Path | Disposition | Replacement / Surviving Authority | Current Proof |
| --- | --- | --- | --- | --- |
| Conformance-authored `INTENT.md`, `PRODUCT.md`, `GOALS.md`, `specification/requirements/00-imported-sources.md`, and generated requirement-family files | `build_tenants/typescript/code/src/workspace/project_profile.ts` | replace | `Fg_conform_project` writes only `.ai-workspace/context/project_bootstrap.md`, `.ai-workspace/context/project_constraints.yml`, and `build_tenants/TENANT_REGISTRY.md`; product/spec surfaces are graph traversal outputs. | `test_t096_managed_traversal_bootstrap.test.mjs`, `test_t087_project_induction.test.mjs`, `test_t068_conform_project_profile.test.mjs` |
| Hard-coded induction lineage dependency on `specification/requirements/00-imported-sources.md` | `build_tenants/typescript/code/src/operator/handoff.ts` | replace | Product materialization handoff requires non-synthetic requirement lineage from loaded workspace authority such as `specification/REQUIREMENTS.md` or graph traversal output under `specification/requirements/*.md`; conformance-only `00-imported-sources.md` is excluded as the lineage proof. | `test_t066_product_materialization_contract.test.mjs`, `test_t088_traversal_intent_package.test.mjs`, `test_t091_traversal_obligation_payload.test.mjs`, `test_t143_product_materialization_authority_targets.test.mjs`, `test_t171_execution_backed_closure_law.test.mjs` |
| Workspace spec surface output to runtime asset archive only | `build_tenants/typescript/code/src/operator/handoff.ts` | replace | `intent_surface`, `product_surface`, `goal_surface`, `requirement_surface`, `uat_testcases_surface`, and `testcase_authority_surface` use workspace-local output paths under `specification/`. | `T-171 graph traversal owns workspace specification output paths and typed templates` in `test_t068_conform_project_profile.test.mjs` |
| Workspace graph target outputs missing materialization-ledger evidence | `build_tenants/typescript/code/src/operator/installed_operator.ts` | replace | Edge fulfillment ledgers record the selected worker output file as graph-target materialization evidence, plus product materialized files where present. Workspace spec/UAT/testcase surfaces are therefore replay-visible as traversal materializations, not harness-only files. | `test_t064_installed_operator_ux.test.mjs`; live archive `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323` |
| Missing UAT testcase and testcase-authority graph products | `build_tenants/typescript/code/src/graph/catalog.ts`, `edge_gain_closure_contracts.ts`, `hooks/policy.ts`, `operator/test_pipeline.ts`, `domain/software_domain_catalog.ts` | replace | `derive_uat_testcases_surface` and `derive_testcase_authority_surface` are explicit graph functions before design construction; `derive_test_design_surface` consumes both. | `test_t030_graph_catalog_module.test.mjs`, `test_t168_design_consumer_test_pipeline.test.mjs`, `test_t068_conform_project_profile.test.mjs` |
| GTL target-carrier template treated as closure authority | `build_tenants/typescript/code/src/operator/handoff.ts`, `graph/target_carrier_contracts.ts` | retain with corrected placement | Target-carrier construction templates remain typed F_P construction/disambiguation surfaces. They do not close product content and cannot substitute for fulfilled obligations or execution evidence. | `test_t171_execution_backed_closure_law.test.mjs` |
| Prompt meaning spread across multiple packages | `build_tenants/typescript/code/src/operator/handoff.ts`, `operator/carriers.ts` | derive | `worker_construction_brief.json` is the canonical prompt-source carrier; handoff manifest, worker invocation package, traversal intent package, worker brief, and gap dossier are derived or forensic projections. | Existing T-171/T-118 prompt package tests; analyzer fields `promptSourceCarrierRef`, `promptSourceCarrierDigest`, and `promptSourcePolicyRef` |
| Worker allowed to control traversal recursively | `build_tenants/typescript/code/src/operator/handoff.ts` | replace | Worker prompt/control boundary forbids running `odd-sdlc-ts`, `abiogenesis-ts`, `genesis-ts`, `start`, `gaps`, `analyze-run`, install, traversal, resume, or spawning another worker. | `test_t118_worker_invocation_package.test.mjs` |
| F_D/conformance/shape-only close authority | `build_tenants/typescript/code/src/operator/edge_gain_closure.ts`, `operator/traversal_consequence.ts`, `operator/assurance_gate.ts`, `operator/installed_operator.ts` | replace | Close-capable product edges require F_P fulfillment pressure to clear, execution-required edges require admitted execution evidence, and residual pressure survives fulfilled counts until explicitly cleared. | `test_t171_execution_backed_closure_law.test.mjs`, `test_t164_edge_gain_closure_contract.test.mjs`, `test_t066_product_materialization_contract.test.mjs` |
| Analyzer rollups hiding missing/mispositioned stages | `build_tenants/typescript/code/src/analysis/*` | replace | Analyzer reports traversal class, retry cause class, prompt-source identity, execution evidence status/count, residual pressure transition, and missing/unmapped conceptual stages. | `test_t161_fd_run_analysis_linter.test.mjs` |
| Harness push-along as proof authority | `build_tenants/typescript/test_env/sandbox/*`, live scenario fixtures | retain as setup only | Harness may create snapshots and launch commands, but proof must come from runtime archives, worker reports, ledgers, closure decisions, and analyzer output. | No live proof accepted until post-deterministic hello-world run; `test80` is invalid proof. |
| Bootstrap expansion as product authority | `build_tenants/typescript/test_env/fixtures/*/bootstrap.md`, `workspace/project_profile.ts` | replace | Bootstrap read model stays compact and explicitly non-authoritative; graph traversal owns product/spec construction. | `test_t096_managed_traversal_bootstrap.test.mjs`, `test_t087_project_induction.test.mjs` |

## Grep Audit Commands

Run from `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript` after the
deterministic pass:

```sh
rg -n "specification/requirements/00-imported-sources.md" code/src test_env/tests
rg -n "Derived From\\*\\*: `Fg_conform_project`|Derived From\\*: `Fg_conform_project`" code/src/workspace test_env/tests
rg -n "worker_construction_brief|promptSourcePolicyRef|canonicalPromptCarrierPath" code/src/operator code/src/analysis test_env/tests
rg -n "derive_uat_testcases_surface|derive_testcase_authority_surface" code/src test_env/tests
```

Expected interpretation:

- `00-imported-sources.md` may appear only as historical fixture input,
  excluded legacy line, or negative assertion. It must not be required as
  product-materialization lineage.
- `Fg_conform_project` may appear as a runtime/bootstrap read-model source,
  not as generated project-owned product/spec authority.
- `worker_construction_brief.json` must be the canonical prompt carrier.
- UAT/testcase authority surfaces must appear as graph functions and test
  pipeline correlations, not analyzer-only aliases.

## 2026-05-17 Audit Result

Commands run after deterministic proof:

```sh
cd /Users/jim/src/apps/odd_sdlc
rg -n 'Derived From\*\*: `Fg_conform_project`|Derived From\*: `Fg_conform_project`' build_tenants/typescript/code/src/workspace build_tenants/typescript/test_env/tests
rg -n 'traversal intent package missing non-synthetic requirement lineage ref|specification/REQUIREMENTS.md|specification/requirements/00-imported-sources.md' build_tenants/typescript/code/src/operator/handoff.ts build_tenants/typescript/test_env/tests/test_t088_traversal_intent_package.test.mjs build_tenants/typescript/test_env/tests/test_t091_traversal_obligation_payload.test.mjs build_tenants/typescript/test_env/tests/test_t143_product_materialization_authority_targets.test.mjs
rg -n 'derive_uat_testcases_surface|derive_testcase_authority_surface' build_tenants/typescript/code/src build_tenants/typescript/test_env/tests/test_t030_graph_catalog_module.test.mjs build_tenants/typescript/test_env/tests/test_t068_conform_project_profile.test.mjs build_tenants/typescript/test_env/tests/test_t168_design_consumer_test_pipeline.test.mjs
rg -n 'worker_construction_brief|promptSourcePolicyRef|canonicalPromptCarrierPath' build_tenants/typescript/code/src/operator build_tenants/typescript/code/src/analysis build_tenants/typescript/test_env/tests/test_t118_worker_invocation_package.test.mjs build_tenants/typescript/test_env/tests/test_t161_fd_run_analysis_linter.test.mjs
```

Result:

- No `Derived From: Fg_conform_project` generated-authority pattern remains under workspace materialization code or tests.
- `00-imported-sources.md` remains only in import/provenance expansion, exclusion logic, or fixtures that explicitly test legacy/import behavior.
- Active handoff assertion now requires non-synthetic lineage and names `specification/REQUIREMENTS.md` plus graph-owned requirement surfaces as valid lineage, while excluding `00-imported-sources.md`.
- `derive_uat_testcases_surface` and `derive_testcase_authority_surface` appear in graph catalog, edge closure contracts, test pipeline correlations, analyzer stage mapping, and deterministic tests.
- `worker_construction_brief.json` is the canonical prompt carrier in operator code and analyzer projection, with deterministic test coverage in T-118 and T-161.

## 2026-05-17 Post-Live Audit Result

The first post-fix hello-world live run exposed an additional decommission
surface:

- archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T024913252Z_pid54150`
- symptom: `specification/requirements/10-generated-bootstrap.md` existed, but
  the scenario harness found no materialization-ledger evidence for it.
- diagnosis: workspace-local graph outputs were being written as selected target
  files, but `sdlc_edge_fulfillment_ledger.json` only recorded
  `workerReport.materializedFiles`, which are product-source materializations.

Disposition:

- `replace`: ledger materialization evidence now includes the worker selected
  output file (`workerReport.outputFile`) for every accepted F_P graph output.
- product-source materialization remains recorded through
  `workerReport.materializedFiles`.
- this is not an assurance gate; it is replay-visible graph-output evidence.

Proof:

```sh
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run build:semantic
npm run lint:semantic
npm run lint:test-harness
node --test test_env/tests/test_t064_installed_operator_ux.test.mjs test_env/tests/test_t158_consequence_admission_regression.test.mjs test_env/tests/test_t171_execution_backed_closure_law.test.mjs
npm run test:semantic
npm run test:scenario:t132-hello-world-js-live
```

Results:

- focused deterministic slice: `26/26`
- full semantic suite: `610/610`
- live hello-world: `1/1` passed
- live archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323`
- analyzer markdown:
  `.ai-workspace/comments/codex/20260517T140000Z_T171_hello_world_live_analyze.md`
- analyzer JSON:
  `.ai-workspace/comments/codex/20260517T140000Z_T171_hello_world_live_analyze.json`
- analyzer summary: 11 operator attempts, 0 same-edge retries, 0 repairs,
  final closure `close`, execution evidence `succeeded` on
  `derive_component_code_surface`.
