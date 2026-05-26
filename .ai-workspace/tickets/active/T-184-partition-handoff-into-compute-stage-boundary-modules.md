# T-184 Partition Handoff Into Compute-Stage Boundary Modules

- id: T-184
- title: Partition handoff into compute-stage boundary modules
- type: realization_refactor
- ticket_category: implementation_migration
- status: active
- proof_status: pending
- build_tenant: typescript
- goal: delete `operator/handoff.ts` as an architectural home by moving each surviving interface into its owning `transform.C`, `evaluate.C`, `consequence.C`, product-materialization, postflight, ledger, or system-artifact module
- change_intent: preserve the T-183 F_P semantic authority boundary while removing the monolithic file that still lets launch, prompt, materialization, diagnostic, replay, test-execution, and closure-adjacent side effects drift together
- change_class: design_reframe
- re_entry_point: runtime_governance
- first_missing_layer: module ownership for transform/evaluate/consequence/system artifact side effects
- triaged_at: 2026-05-26
- created_at: 2026-05-26
- updated_at: 2026-05-26
- migration_strategy: deletion_first_no_bridge
- target_truth: every system artifact write goes through the ABG/system artifact writer, the transformer/evaluator process is the only writer of contracted work-surface product artifacts, and each SDLC compute-stage helper lives under the module that owns its authority
- superseded_truth: `operator/handoff.ts` as a shared utility bag for prompt generation, product topology, materialization observation, evaluator/register support, postflight diagnostics, replay, installed-operator-owned artifacts, and archive writes
- closure_law: `operator/handoff.ts` has no public exports and is deleted or reduced to a temporary empty shell before completion; no generated-asset closure, retry, repair, next action, evaluator admission, or system artifact write may depend on a helper whose authority is hidden in handoff
- evaluation_criteria: focused tests prove no public import from `./handoff.js`, no raw `.ai-workspace` writes outside `system_artifacts.ts`/effect executors, no framework work-surface writer except declared transformer/evaluator output, and live JS/Rust/data-mapper archives close through the selected F_P evaluation path
- non_closure_conditions: retaining `handoff.ts` as a shrinking adapter with public behavior, adding compatibility aliases, moving code without changing ownership, keeping direct work-surface writes from installed operator F_D helpers, preserving node-specific source language branches, or leaving analyzer/runtime duplicate admission paths
- proof_surface: this ticket, T-183, RC3 compute-stage design module, new T-184 source tests, semantic suite, JS hello-world live, Rust server hello-world live, and data mapper live
- depends_on:
  - T-183

## Intake

T-183 closed the current semantic-register deletion round. It also exposed the
remaining structural risk: `operator/handoff.ts` is not one concept. It still
contains legitimate transform launch code, legitimate read-only diagnostics,
system artifact writes, product-materialization observation, replay helpers,
installed-operator-owned artifacts, gap dossier logic, and closure-adjacent
projections.

That file shape makes every future bug look local while the authority boundary
is actually global. T-184 removes that ambiguity by partitioning the file by
compute-stage authority and deleting the monolith.

The rule is:

```text
ABG.start(fn<A, B>.C)
  .bind(system.openGraphCall)
  .bind(system.openFrame)
  .bind(plugin.transform.C)
  .bind(system.admitTransform)
  .bind(system.writeTransformEventsAndLedgers)
  .bind(plugin.evaluate.C)
  .bind(system.admitEvaluation)
  .bind(system.writeEvaluationLedgers)
  .bind(system.assuranceFold)
  .bind(plugin.consequence.C)
  .bind(system.admitConsequenceProjection)
  .bind(system.traversalTransition)
  .bind(system.replayContinuation)
```

T-184 must make the file/module topology reflect that flow.

## Probability Engine Invariant

Every live SDLC edge must conform to this single functional interface:

```text
GTL graph function edge
  -> SDLC EdgePolicy
  -> ABG selected composition
  -> plugin.transform.C
  -> system admission/write
  -> plugin.evaluate.C
  -> system admission/write
  -> plugin.consequence.C
  -> traversal transition
```

Anything that cannot be classified as one of those binds, or as declarative
policy consumed by one of those binds, is T-184 tech debt. The generic common
solution must provide equivalent capability for all current edge situations by
moving variation into declared `SDLC EdgePolicy` / node policy / plugin policy,
not by preserving target-specific imperative branches.

## Defect Shape

The live data-mapper run made the recurring defect shape concrete. The bug is
not one failed writer or one bad target surface. The defect class is any code
path that can interpret, materialize, admit, close, retry, or route an SDLC edge
outside the single compute-stage spine.

The recurring shapes are:

- generic launch/evaluate/consequence code branching on target asset names
  instead of consuming an edge-declared producer/evaluator/projection policy
- framework F_D code writing work-surface product artifacts or transform output
  candidates that should be written by `transform.C` / selected project policy
- parser bridges accepting stale, fenced, wrapped, aliased, or legacy carrier
  shapes as authority
- selected composition identity synthesized locally instead of consumed from ABG
- deterministic diagnostic/postflight carriers able to become block/retry/close
  pressure before selected `evaluate.C/F_P` authority evaluates the work
- tests importing or constructing legacy helpers and thereby preserving the old
  surface as executable proof

The deletion rule is therefore broader than deleting `handoff.ts`: any remaining
helper must name its owning stage and must not create a second truth surface for
the same edge decision.

## Known Current Side Effects

Current legitimate side effects:

- transformer/evaluator processes may write their contracted output and product
  work surface within allowed write roots
- ABG/system may write runtime, event, ledger, prompt, report, manifest,
  evaluator, gap, and projection artifacts under `.ai-workspace`
- declared execution wrappers may run admitted commands and write execution
  evidence through ABG/system artifacts

Current suspect side effects to eliminate or rehome:

- `ensureObservedTransformOutput(...)` writes a transform output when the worker
  did not write one
- `writeInstalledOperatorNoDispatchArtifact(...)` writes deterministic
  no-dispatch work-surface artifacts
- `writeInstalledOperatorOwnedEvaluationArtifact(...)` writes multiple target
  outputs from framework code
- `writeWorkspaceTargetJsonFile(...)` is a local product-surface writer that
  should collapse behind the generic edge-output projection/materialization
  surface
- `plugins/evaluate/postflight.ts` still imports `__handoff*` helpers from the
  transform launch module
- selected-composition fallback helpers still exist for replay/test paths and
  must be removed from live closure paths

## Target Module Ownership

| responsibility | target module | authority rule |
| --- | --- | --- |
| stable artifact JSON, archive-root containment, cataloged system writes | `operator/system_artifacts.ts` | only ABG/system writes `.ai-workspace` artifacts |
| run ids and hash helpers if still needed | `operator/runtime_identity.ts` or existing carrier utility | no semantic authority |
| worker launch manifest, invocation package, brief, construction brief, prompt, and file emission | `operator/plugins/transform/launch_contract.ts` | `transform.C` launch contract only |
| product materialization authority and declared file targets | `operator/product_materialization/authority.ts` | declared product/tenant authority only |
| product materialization snapshot/delta observation | `operator/product_materialization/observation.ts` | read-only evidence diagnostics |
| product materialization replay and manifest projection | `operator/product_materialization/replay.ts` and `manifest.ts` | projection over admitted transform truth |
| post-transform worker report and `FpTransformResult` projection | `operator/plugins/transform/result_projection.ts` | candidate/evidence projection only |
| installed test execution wrapper | `operator/plugins/evaluate/execution_evidence.ts` or `operator/effects/execution.ts` | runs admitted commands and writes evidence, not semantics |
| test execution preparation and qualification projections | `operator/plugins/evaluate/test_execution.ts` | evaluator/projection surface, not source-specific command synthesis |
| gap dossier and retry diagnostic projection | `operator/postflight/gap_dossier.ts` | diagnostic/read model; no closure authority |
| repair re-entry projection | `operator/plugins/consequence/repair_reentry.ts` | consequence over admitted closure truth |
| staged construction audit carriers | `operator/nodes/staged_construction.ts` or `operator/product_materialization/staged_authority.ts` | graph-node pressure/read model, no local semantic evaluator |
| archive writer public export | delete from `handoff.ts`; export `writeSdlcSystemArtifact` directly | one system artifact write surface |

## Interface Inventory

| current `handoff.ts` export | target action |
| --- | --- |
| `stableOperatorJson` | move to `system_artifacts.ts` or `runtime_identity.ts` |
| `sha256Text`, `sha256File`, `operatorRunId` | move to `runtime_identity.ts` |
| `reconcileSdlcProductMaterializationAuthority`, `declaredProductFileTargets` | move to `product_materialization/authority.ts` |
| `assertTraversalIntentPackagePressure` | move to `plugins/transform/launch_contract.ts` or traversal-intent module |
| `deriveWorkerHandoffManifest` | move to `plugins/transform/launch_contract.ts` |
| `constructWorkerInvocationPackage`, `constructWorkerBrief`, `constructWorkerConstructionBrief`, `promptForHandoff`, `writeHandoffFiles` | move to `plugins/transform/launch_contract.ts`; rename away from handoff if useful |
| `admitWorkerResultReport`, `readWorkerResultReport` | move to `plugins/transform/result_projection.ts` |
| `snapshotProductMaterializationRoot`, `observeProductMaterializationDelta` | move to `product_materialization/observation.ts` |
| `deriveSdlcStagedConstructionAuditCarriers` | move to `nodes/staged_construction.ts` or product-materialization staged authority module |
| `writeInstalledOperatorOwnedEvaluationArtifact` | split by target asset, then rehome or delete; no generic F_D work-surface writer may remain |
| `buildPostTransformWorkerResultReport`, `workerResultReportWithReplayedProductMaterialization`, `workerResultReportWithFpStageRefs` | move to `plugins/transform/result_projection.ts` and product-materialization replay helpers |
| `constructWorkerFpTransformResult`, `writeWorkerFpTransformResult` | move to `plugins/transform/result_projection.ts` |
| `writeProductMaterializationManifest` | move to `product_materialization/manifest.ts` |
| `gapDossierPathForManifest`, `constructPostflightGapDossier`, `writePostflightGapDossier`, `admitPostflightGapDossier`, `readPostflightGapDossierRef` | move to `postflight/gap_dossier.ts` |
| `componentRepairReentryPlansForGapDossier` | move to `plugins/consequence/repair_reentry.ts` |
| `constructorResultFromWorkerOutput` | move to consequence/constructor projection module after checking closure authority |
| `writeOperatorArchiveFile` | delete; replace call sites with `writeSdlcSystemArtifact` |
| `relativeToWorkspace` | move to small path utility only if still needed |

## Work Ledger

| id | task | closure proof | status |
| --- | --- | --- | --- |
| H-001 | Add a source test that enumerates current `handoff.ts` public exports and fails if new exports are added during migration. | test fails on new public handoff export | done: `test_t184_handoff_partition_boundary.test.mjs` fails if `handoff.ts`, public imports, `writeOperatorArchiveFile`, or raw operator file writers return |
| H-010 | Move stable JSON/hash/run-id helpers out of handoff. | build passes; no installed operator import for these helpers from handoff | planned |
| H-020 | Move product-materialization authority helpers into `product_materialization/authority.ts`. | tests still prove tenant stack/product target authority; no source-specific branch added | planned |
| H-030 | Move transform launch contract helpers into `plugins/transform/launch_contract.ts`. | worker prompt/package tests pass; prompt still uses one governance reference and typed work queue | first slice done: former `handoff.ts` moved under transform plugin ownership; finer extraction still belongs to H-040/H-050/H-070/H-080 |
| H-040 | Move materialization observation/replay/manifest helpers into `product_materialization/*`. | observation is read-only; no output artifact synthesis remains | planned |
| H-050 | Move worker result and `FpTransformResult` projection into `plugins/transform/result_projection.ts`. | generated-asset closure still requires selected F_P review evidence | planned |
| H-060 | Split or delete installed-operator-owned evaluation artifacts. | no deterministic work-surface writer remains except declared execution evidence through ABG/system | in progress: data-mapper exposed a workspace/system boundary bug at `component_realization_qualification_surface`; installed-operator-owned product target surfaces now write through the file-store effect to the declared workspace target path, while operator-run artifacts stay on `writeSdlcSystemArtifact`; covered by `test:t184` |
| H-070 | Move gap dossier and retry diagnostic projection into `postflight/gap_dossier.ts`. | gap dossier remains diagnostic/read model; it cannot select next action directly | planned |
| H-080 | Move repair re-entry projection into consequence module. | repair action derives from closure decision plus `ActionCatalog` | planned |
| H-090 | Replace `writeOperatorArchiveFile` with direct `writeSdlcSystemArtifact` imports. | grep proves no `writeOperatorArchiveFile` export/import remains | done: source imports direct system writer and public wrapper export is removed |
| H-100 | Delete `handoff.ts` and update `operator/index.ts`. | build fails if any consumer imports `./handoff.js`; file removed | done: `operator/index.ts` exports the transform launch contract and system artifact writer directly |
| H-110 | Add raw-write audit tests for operator modules. | raw writes only in effect executors or approved product transformer/evaluator boundary | done for operator source: T-184 test rejects `writeFileSync`, `appendFileSync`, and `createWriteStream` in `operator/` |
| H-120 | Run clean JS hello-world live with PTY. | final close, no retry/block, expected CLIs/evaluator artifacts | done: current clean PTY live pass at `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260526T123226778Z_pid20615` after the edge-output-policy refactor; prior clean pass at `20260525T183305414Z_pid95270` remains historical evidence |
| H-130 | Run clean Rust server hello-world live with PTY. | final close, no retry/block, expected CLIs/evaluator artifacts | done: current clean PTY live pass at `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260526T124757862Z_pid37895`; product files were materialized by transform.C and closure passed through F_P evaluate/review-grade artifacts |
| H-140 | Run clean data mapper live with PTY. | final close or lawful block, no source-specific F_D compensations | in progress: `20260526T050928948Z_pid56692` reached `qualify_component_realization_surface` after implementation-design/component-code retries, then failed on a generic workspace/system artifact writer bug; patch landed locally, fresh live rerun required |
| H-141 | Audit worker-runtime blocking reasons through the common consequence path. | `worker_output_limit_exceeded`, provider connection failures, and similar retryable process failures write diagnostics but select `retry`, not terminal `block`; hard protocol blocks remain protected | in progress: fixed closure disposition so explicit same-edge retry pressure outranks diagnostic assurance block; added `worker_connection_failed` for `ECONNRESET`/socket failures; covered by `test:t153` and `test:t184`; data-mapper live must be rerun |
| H-150 | Collapse stage-boundary aliases left after `handoff.ts` deletion. | no `__handoff*` export/import remains; evaluate/postflight imports owning evaluate, product-materialization, postflight, or effect modules directly | fixed: `__handoff*` aliases removed; postflight imports direct helpers; source grep covered by `test:t184` |
| H-160 | Remove bridge parser admission for component-depth carriers. | component-depth target carriers are admitted from exact whole-file/project/evaluator carrier truth only; stale fenced JSON under fresh prose cannot satisfy authority | fixed: fenced component-depth bridge parsing removed; T-171/T-183 tests now admit exact whole-file carrier and reject fenced carriers |
| H-170 | Delete live selected-composition synthesis fallback. | runtime closure and next-action projections fail closed without ABG-selected composition ref/digest/selection/regime identity; replay fixtures use explicit fixture identity only | fixed: closure/next-action construction now require selected composition identity and the legacy replay-only fallback is removed |
| H-180 | Remove target-asset governance fallback from live prompt category selection. | every live edge resolves work-category governance from graph/function catalog authority; missing catalog row fails closed or emits diagnostic, not hidden target fallback | fixed: work-category governance now comes only from graph/function catalog; missing row throws |
| H-190 | Remove framework-generated transform-output synthesis. | if the worker/evaluator did not write the contracted output, the run carries diagnostic evidence and selected evaluate/consequence decides; F_D does not create a substitute output artifact | fixed: `ensureObservedTransformOutput(...)` deleted; missing output artifact remains diagnostic evidence |
| H-200 | Reclassify deterministic no-dispatch edge output. | no-dispatch edges are declared projection edges with a generic edge-output projector, not installed-operator-owned ad hoc markdown/product writers | fixed: `writeInstalledOperatorNoDispatchArtifact(...)` deleted; every no-dispatch edge must resolve to shared `system_projection` edge-output policy or fail closed |
| H-210 | Collapse framework-owned evaluation target policy to one edge policy surface. | `installedOperatorOwnsEvaluationOutput`, review-grade required/exempt logic, postflight output exceptions, and artifact writer policy read one cataloged edge-output policy | partial: operator review-grade/postflight/writer decisions use `sdlcEdgeOutputPolicyForTargetAssetType(...)`; product graph contract catalog still carries a separate projection/review-grade exemption list and must be collapsed into a pure contract-level policy module |
| H-220 | Move installed-operator plugin prompts/contracts into plugin modules or plugin-set factory. | `installed_operator.ts` wires ABG plugin set from `operator/plugins/*` surfaces; it does not own F_P evaluator prompts, rule contracts, or semantic rule selection | discovered: design-depth/review-grade prompts and plugin contracts remain in `installed_operator.ts` |
| H-230 | Audit F_D postflight/blocking carriers as diagnostic-only. | deterministic report/admission failures are system diagnostics or ABG contract failures only; product retry/block/close still derives from selected evaluate/consequence authority | discovered: worker report admission postflight functions still return `status: "blocked"` with `legacyBlockingReasonCode(...)` |
| H-240 | Refactor compatibility tests that preserve legacy surfaces. | tests exercise production-path carriers or are deleted; no test imports public legacy writer helpers or embeds fenced component-depth carriers as accepted proof | discovered: `test:t184` imports `writeInstalledOperatorOwnedEvaluationArtifact`, and older tests still emit fenced `component_depth_register` blocks |

## Live Discovery Ledger

The data-mapper live lane is a defect-discovery lane for `odd_sdlc`, not a goal
to finish data mapper by compensating locally. Every block, retry, stale branch,
or duplicate surface discovered during the live run is tracked here.

| id | archive evidence | discovery | authority verdict | status |
| --- | --- | --- | --- | --- |
| LD-001 | `t164_data_mapper_full_capability_live/20260525T231651480Z_pid17089` | `worker_output_limit_exceeded` was typed as retryable worker runtime pressure, but diagnostic target-carrier absence could still suppress retry and terminal-block the edge. | F_D diagnostics may write information only; explicit same-edge retry pressure must flow through the common consequence path. | fixed: retry pressure outranks diagnostic assurance block; covered by `test:t153` |
| LD-002 | `t164_data_mapper_full_capability_live/20260526T013108934Z_pid89085` | provider `ECONNRESET` was classified as generic `worker_process_failed` and selected terminal inspection/block instead of retry. | transient worker transport failures are runtime pressure, not product semantic failure. | fixed: `worker_connection_failed`; covered by `test:t184` |
| LD-003 | `t164_data_mapper_full_capability_live/20260526T050928948Z_pid56692`, run `20260526T101301157Z_pid56862` | `component_realization_qualification_surface.md` was a workspace product target but was written through the system artifact writer, which enforces operator-run archive containment. | `.ai-workspace` runtime artifacts use `writeSdlcSystemArtifact`; declared workspace product targets use the file-store effect at `manifest.outputFile`. | fixed: workspace target JSON writer uses file-store effect; covered by `test:t184` |
| LD-004 | code trace in `operator/plugins/transform/launch_contract.ts` around installed-operator-owned evaluation artifacts | no-dispatch qualification/projection surfaces are implemented as target-specific branches (`component_realization_qualification_surface`, `component_test_qualification_surface`, `release_depth_parity_surface`) even though they share the same A -> B projection pattern. | multi-surface projection code is legacy debt; every edge should use one generic edge-output projection/materialization flow with edge-declared producer policy. | open: collapse into `edge_projection` / product-materialization projection module; no new target-specific branch allowed |
| LD-005 | code trace in `operator/plugins/transform/launch_contract.ts` | local helper name `writeStableJsonFile` hid the system/workspace boundary after LD-003. | helper names must expose authority boundary, not serialization detail. | fixed locally: renamed to `writeWorkspaceTargetJsonFile`; covered by source grep and `test:t184` |
| LD-006 | source trace: `operator/plugins/evaluate/postflight.ts` imports `__handoffEvaluate*`, `__handoffResolveProductMaterializationReplay`, and `__handoffInstalledOperatorOwnsEvaluationOutput` from `operator/plugins/transform/launch_contract.ts` | deleting `handoff.ts` moved the coupling but did not fully partition it; evaluate/postflight still reaches through transform launch internals for replay, diagnostics, and framework-owned output policy. | stage modules must bind through owning surfaces: transform launch, product-materialization observation/replay, evaluate/postflight diagnostics, and effects. Cross-stage `__handoff*` aliases are compatibility debt. | fixed: `__handoff` source grep is clean and `test:t184` enforces it |
| LD-007 | source trace: `operator/component_depth_register.ts` `fencedComponentDepthCandidates(...)` and `jsonCandidates(...)` | component-depth admission still accepts fenced JSON blocks when whole-file JSON parsing fails. That can preserve the stale-structured-carrier-under-fresh-prose failure pattern T-183 was meant to delete. | semantic component-depth rows must come from selected `evaluate.C/F_P` content ledger or explicit project authority, then be admitted as exact carrier truth; Markdown/fenced bridge parsing cannot satisfy authority. | fixed: fenced bridge removed; `test:t183` now rejects fenced component-depth carriers |
| LD-008 | source trace: `operator/traversal_consequence.ts` `legacyReplayOnlyCompositionIdentityForInput(...)`; design acceptance at `ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md` says synthesized identity fails closed | closure and next-action projections can still fall back to locally synthesized selected composition identity when no ABG-selected identity is supplied. | live runtime closure must preserve ABG-selected `abg.fn_composition` ref/digest/selection/regime identity; replay fixture support must not be reachable from live closure. | fixed: selected composition is required in closure/next-action constructors; legacy fallback removed |
| LD-009 | source trace: `operator/work_category_governance.ts` `TARGET_ASSET_GOVERNANCE_CATEGORY` and `target_asset_catalog_fallback` | prompt governance category can be selected from a target-asset fallback map when the graph/function catalog has no entry. This is a second categorization surface beside the graph catalog. | live edge work-category governance should come from graph/function catalog truth; target fallback is at most a migration diagnostic or test fixture behavior. | fixed: target-asset fallback removed; graph/function catalog is required |
| LD-010 | source trace: `operator/index.ts` still exports `writeInstalledOperatorOwnedEvaluationArtifact`; `test_t184_handoff_partition_boundary.test.mjs` imports it as public API | the framework-owned product-surface writer is still a public operator API and is currently blessed by T-184 tests. | product-surface projection/materialization should be selected by the edge-output projection surface, not a public helper named for installed-operator ownership. | fixed: old public writer export removed; tests consume shared edge-output policy |
| LD-011 | source trace: `operator/plugins/transform/launch_contract.ts` `componentDepthFieldSetForTarget(...)`, `compactComponentDepthDirective(...)`, and target-specific outcome directives | node/asset-specific prompt semantics still live inside the generic transform launch contract, including stale repair-schedule instructions as prose. | prompt semantics must be declared by node/edge pressure modules or selected evaluate/transform rule configuration; generic launch code should package declared pressure, not own semantic target rules. | open: move per-target directives into `operator/nodes/*` or catalog-backed prompt fragments and add source proof that launch contract has no semantic target switch |
| LD-012 | source trace: `operator/plugins/transform/launch_contract.ts` `ensureObservedTransformOutput(...)` writes `manifest.outputFile` when it is missing | if a worker materializes files but omits the contracted transform artifact, F_D can synthesize an output artifact from observed filesystem state. | transform output candidates belong to `transform.C`; F_D materialization observation may write diagnostics but must not substitute the transform artifact. | fixed: synthesis helper deleted; missing output artifact is not replaced |
| LD-013 | source trace: `operator/installed_operator.ts` `writeInstalledOperatorNoDispatchArtifact(...)` and `noDispatchReport(...)` | no-dispatch edges can synthesize markdown output and worker-result reports under installed-operator authority. | no-dispatch is a declared projection/qualification policy, not a special installed-operator product writer. It must route through the same generic edge-output projection surface as every other A -> B edge. | fixed for product output: no-dispatch artifact writer deleted; report is diagnostic projection over `writeDeclaredEdgeProjectionOutput(...)` |
| LD-014 | source trace: `operator/review_grade_edge_fulfillment.ts` `frameworkOwnedEvaluationTarget(...)`; compare `operator/plugins/transform/launch_contract.ts` `installedOperatorOwnsEvaluationOutput(...)` | framework-owned target sets are duplicated in separate modules, so review-grade requirement policy can drift from output-writer policy. | one edge-output policy surface must say whether an edge is worker-authored, evaluator-authored, projection-only, review-grade-required, or no-close. | partial: operator decisions consume `edge_output_policy.ts`; remaining duplicate lives in `contracts/product_graph_contract_catalog.ts` and should be moved to a pure contract-level policy |
| LD-015 | source trace: `operator/installed_operator.ts` `fpDispatchPluginContract()`, `fpEvaluatorPluginContract()`, `designDepthFpEvaluatorPrompt(...)`, and `reviewGradeEdgeFulfillmentPrompt(...)` | `installed_operator.ts` still owns plugin contracts and evaluator prompts instead of consuming a plugin-set boundary from `operator/plugins/*`. | installed operator should bind ABG to declared plugin modules; F_P evaluator prompts and rule contracts belong to `plugins/evaluate/*`, not the runtime loop file. | open: introduce `createSdlcAbgPluginSet()` / plugin registry module and move prompts/contracts under owning plugin modules |
| LD-016 | source trace: `operator/assurance_gate.ts` builds materialization, shallow-realization, capability, obligation, component-depth, design-completeness, requirement-closure, and carry ledgers, then marks them diagnostic-only | the ledgers no longer block directly, but the file still contains target-specific semantic-looking F_D evaluations that can be accidentally promoted again. | F_D assurance ledgers must be explicit diagnostics/read models; any semantic adequacy judgment must be selected `evaluate.C/F_P` output. | open: split diagnostic writers by owner, add source proof that assurance ledgers cannot feed required closure dimensions |
| LD-017 | source trace: `operator/installed_operator.ts` `workerReportAdmissionPostflight(...)` and `deterministicReportAdmissionPostflight(...)` return `status: "blocked"` using `legacyBlockingReasonCode(...)` | deterministic report/admission failures still look like postflight closure blockers in the runtime state shape. | malformed reports are system contract diagnostics or ABG admission failures; they must not be confused with product semantic block/retry authority. | open: classify these through one system-failure consequence path with explicit non-semantic status |
| LD-018 | source trace: `build_tenants/typescript/test_env/tests/test_t184_handoff_partition_boundary.test.mjs` imports `writeInstalledOperatorOwnedEvaluationArtifact`; older tests such as `test_t076...` and `test_t120...` embed fenced `component_depth_register` blocks | some tests still prove compatibility with the very surfaces T-184 is deleting. | tests are proof surfaces; if they require legacy interfaces, the legacy interface remains alive. Refactor to production-path fixtures or delete redundant tests. | fixed for focused proof: `test:t184` rejects old public writer imports and `test:t183` rejects fenced component-depth bridges; broader legacy fixture sweep remains in LD-019 if future full suite exposes more |
| LD-019 | source/test audit after deleting fenced component-depth admission | other historical tests may still carry legacy fenced component-depth fixtures even if focused T-183/T-184 proof is now corrected. | stale tests must be refactored to exact carriers or deleted when discovered; no test may keep a deleted authority path alive. | open watch item: run broader semantic suite before ticket closure and update/delete any stale fixture that fails due to the intended bridge removal |
| LD-020 | data-mapper live trace `20260526T131037710Z_pid64804`, retry run `20260526T132002672Z_pid64999`; source trace `operator/plugins/transform/launch_contract.ts` retry instructions | retry prompt called selected review-grade residual pressure a "prior deterministic defect" even though the retry came from `evaluate.C/F_P`. | prompt language is part of the authority boundary; F_D diagnostics can write facts, but retry work queues are evaluated residual pressure from selected evaluation/consequence truth. | fixed: shared retry instruction now says "evaluated residual pressure" and `npm run build:semantic` passes after the patch |

## Source Walkthrough Audit

| path | current observation | verdict |
| --- | --- | --- |
| `installed_operator.ts` plugin setup | ABG plugin contracts, design-depth prompt, review-grade prompt, no-dispatch writer, worker report admission, and many system artifact writes remain in one runtime loop file. | runtime loop still owns too much; split into plugin registry, effects, diagnostics, and consequence modules |
| `plugins/transform/launch_contract.ts` | former handoff body now carries transform launch, prompt fragments, materialization observation/replay, component-depth admission calls, execution evidence, target-specific writers, postflight helper exports, and product materialization manifest writing. | file move deleted the old name, not the old coupling; this is the main partition target |
| `plugins/evaluate/postflight.ts` | evaluate/postflight imports direct helper names and no `__handoff*` aliases remain. | fixed for alias surface; still needs deeper partition of product-materialization replay helpers out of transform launch |
| `component_depth_register.ts` | exact parser remains; fenced Markdown candidates no longer admit. | fixed for bridge admission |
| `review_grade_edge_fulfillment.ts` | review-grade required/exempt policy now delegates to operator edge-output policy. | fixed inside operator; remaining duplicate in product graph contract catalog |
| `work_category_governance.ts` | graph catalog category lookup is required; target-asset fallback removed. | fixed for live prompt governance |
| `traversal_consequence.ts` | closure/next-action projection requires selected composition identity. | fixed for live selected-composition truth |
| `assurance_gate.ts` | deterministic ledgers are now forced diagnostic-only, but semantic-looking F_D ledgers remain. | keep as transitional diagnostics only; split and prove non-closure |
| `test_env/tests/*` | focused T-183/T-184 tests now reject old public writer names and fenced component-depth bridges; broader T-066/T-115 still encode old F_D-blocking expectations. | remaining test debt; refactor/delete stale broad fixtures without restoring F_D semantic authority |

## Current Verification

- `npm run build:semantic`: pass
- `npm run test:t183`: pass, 63 tests
- `npm run test:t184`: pass, 5 tests
- `npm run lint:semantic`: pass
- `git diff --check`: pass
- `npm run build:semantic`: pass after LD-020 retry wording fix
- JS hello-world live, PTY Claude Sonnet 4.6 xhigh:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260526T123226778Z_pid20615`
  passed in `861476.893417ms`; both implementation-design and component-code
  edges ran through transform/evaluate/consequence with F_P review-grade
  evaluator artifacts present.
- Rust service hello-world live, PTY Claude Sonnet 4.6 xhigh:
  `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260526T124757862Z_pid37895`
  passed in `1297255.520666ms`; the service lane materialized `Cargo.toml`
  and `src/main.rs`, then closed through F_P evaluate/review-grade and live
  HTTP proof.
- Targeted stale-test probe:
  `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs test_env/tests/test_t180_abg_3_9_rc3_staged_compute_boundary.test.mjs`
  now compiles/imports the generic projection surface, but still fails old
  T-066/T-115 expectations that deterministic diagnostics, repair schedules,
  and materialization replay block directly. Those failures are tracked under
  LD-019/LD-017 as stale proof surfaces to refactor or delete before final
  closure; they should not be used to restore F_D semantic authority.

## Closure Checklist

- [x] `handoff.ts` has no public exports and is deleted or empty.
- [x] `operator/index.ts` no longer re-exports from `./handoff.js`.
- [ ] `installed_operator.ts` imports transform launch, result projection,
  materialization, postflight, consequence, and system artifact helpers from
  their owning modules.
- [x] No `writeFileSync` remains in `operator/` except approved process-local
  transformer/evaluator output handling if explicitly documented.
- [x] `.ai-workspace` artifacts route through `writeSdlcSystemArtifact(...)`
  and catalog validation where applicable.
- [x] No framework helper writes a transform output because a worker omitted it.
- [ ] No F_D installed-operator helper writes semantic work-surface truth.
- [ ] Product materialization observation is read-only and diagnostic-only.
- [ ] Generated-asset closure still requires selected `evaluate.C/F_P`
  evidence.
- [x] `npm run build:semantic` passes.
- [x] `npm run test:t183` passes.
- [x] `npm run test:t184` exists and passes.
- [x] `npm run lint:semantic` passes.
- [x] `git diff --check` passes.
- [x] JS hello-world live is clean.
- [x] Rust server hello-world live is clean.
- [ ] Data mapper live is clean or blocks lawfully without source-specific F_D
  compensation.

## Non-Goals

- Do not rename GTL/ABG carriers.
- Do not add compatibility layers for old `handoff.ts` imports.
- Do not reintroduce deterministic semantic register population.
- Do not add JS/Rust/Scala/Python/data-mapper-specific logic to generic SDLC.
- Do not change the ABG runner contract unless a separate ABG ticket requires
  it.
