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
- updated_at: 2026-05-31
- migration_strategy: deletion_first_no_bridge
- target_truth: ABG/system owns runtime events, payload admission, payload ledgers, assurance fold, traversal transition, continuation, correction, and replay truth; odd_sdlc owns SDLC edge meaning and product read-model interpretation; every plugin helper lives under its owning compute-stage module
- superseded_truth: `operator/handoff.ts` as a shared utility bag for prompt generation, product topology, materialization observation, evaluator/register support, postflight diagnostics, replay, installed-operator-owned artifacts, and archive writes
- closure_law: `operator/handoff.ts` has no public exports and is deleted or reduced to a temporary empty shell before completion; no generated-asset closure, retry, repair, next action, evaluator admission, or system artifact write may depend on a helper whose authority is hidden in handoff
- evaluation_criteria: focused tests prove no public import from `./handoff.js`, no raw `.ai-workspace` writes outside ABG/system artifact or ABG emit sinks, no framework semantic work-surface writer outside selected transform/evaluate/consequence contracts, and live JS/Rust/data-mapper archives close through the selected composition and selected F_P evaluation path
- non_closure_conditions: retaining `handoff.ts` as a shrinking adapter with public behavior, adding compatibility aliases, moving code without changing ownership, keeping direct work-surface writes from installed operator F_D helpers, preserving node-specific source language branches, or leaving analyzer/runtime duplicate admission paths
- proof_surface: ABG `specification/PRODUCT.md`, odd_sdlc `specification/PRODUCT.md`, this ticket, T-183, current compute-stage design module, new T-184 source tests, semantic suite, JS hello-world live, Rust server hello-world live, and data mapper live
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

The controlling ABG product rule is:

```text
ABG.start(fn<A, B>.C)
  .bind(system.openGraphCall)
  .bind(system.openFrame)
  .bind(plugin.transform.C)
  .bind(system.admitTransform)
  .bind(system.writeTransformEventsAndLedgers)
  .bind(system.planEvaluationSet)
  .bind(plugin.evaluate.C.rule[*])
  .bind(system.admitEvaluationRuleResult[*])
  .bind(system.writeEvaluationLedgers)
  .bind(system.collectEvaluationSet)
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

## Product Authority Alignment

This ticket is aligned to ABG and odd_sdlc `PRODUCT.md` as of 2026-05-27.

| product-law surface | owner | T-184 consequence |
| --- | --- | --- |
| selected `abg.fn_composition`, runtime events, `Run`, `GraphCall`, `Frame`, `ExecutionBasis`, payload admission, payload ledgers, assurance projection, closure fold, traversal transition, continuation, correction, replay projection | ABG | odd_sdlc must call ABG/system surfaces for runtime truth; local appenders may only persist ABG-emitted events |
| SDLC edge meaning, graph overlays, typed product assets, authority surfaces, feature/test maps, pressure maps, gain/closure interpretation, query overlays, analyzer projections, proof interpretation | odd_sdlc | odd_sdlc may interpret ABG-admitted facts, but it must not create a rival runtime event log, ledger, closure fold, or traversal selector |
| `plugin.transform.C` | transform plugin module | produces candidate/evidence refs and selected product work outputs only; it does not emit runtime events, write ledgers, publish runtime projections, select traversal, or close |
| `plugin.evaluate.C.rule[*]` | evaluate plugin modules | produces read-only evaluation findings, deterministic registers, semantic findings, gain, residual pressure, diagnostics, continuation/evidence/authority refs, and proposed dispositions only |
| ABG admission/write | ABG/system | admits plugin payloads, emits events, writes payload ledgers, folds assurance, and owns closure/traversal/replay truth |
| `plugin.consequence.C` | consequence plugin module | produces product read-model projection refs over ABG-admitted state; it is not an independent action authority |
| workspace product target materialization | selected transform/projection policy plus file-store effect | may write declared workspace target files, but those files are product surfaces, not ABG runtime truth or F_D semantic closure |

The current code either conforms to this table or remains open T-184 work. A
closure item is not satisfied by moving code under a better filename; the code
must stop owning the wrong authority.

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
- declared workspace target materialization may write selected product files
  through the file-store effect when an edge-output policy names that target
- ABG/system may write runtime, event, payload-ledger, prompt, report,
  manifest, evaluator, gap, and projection artifacts under `.ai-workspace`
- odd_sdlc runtime event persistence may append only events first emitted
  through ABG `emit(...)`
- declared execution wrappers may run admitted commands and write execution
  evidence through ABG/system artifacts

Current suspect side effects to eliminate or rehome:

- `writeWorkspaceTargetJsonFile(...)` is a local product-surface writer that
  should remain a file-store effect only and collapse behind the generic
  edge-output projection/materialization surface
- `installed_operator.ts` no longer calls
  `writeDeclaredEdgeProjectionOutput(...)` from the dispatch/transform path;
  declared edge-output materialization is invoked by the consequence callback
  over the admitted dispatch/evaluate state
- `installed_operator.ts` still owns deterministic admission postflight
  functions as diagnostic carriers; plugin contracts, evaluator prompts,
  plugin-set construction, and declared edge-output projection have moved under
  `operator/plugins/*`
- target-specific prompt directives still live in generic transform launch code

## Target Module Ownership

| responsibility | target module | authority rule |
| --- | --- | --- |
| stable artifact JSON, archive-root containment, cataloged system writes | `operator/system_artifacts.ts` | only ABG/system writes `.ai-workspace` artifacts |
| installed runtime event persistence | `operator/event_store.ts` as an ABG emit sink | events are emitted through ABG before storage append |
| run ids and hash helpers if still needed | `operator/runtime_identity.ts` or existing carrier utility | no semantic authority |
| worker launch manifest, invocation package, brief, construction brief, prompt, and file emission | `operator/plugins/transform/launch_contract.ts` | `transform.C` launch contract only |
| product materialization authority and declared file targets | `operator/product_materialization/authority.ts` | declared product/tenant authority only |
| product materialization snapshot/delta observation | `operator/product_materialization/observation.ts` | read-only evidence diagnostics |
| product materialization replay and manifest projection | `operator/product_materialization/replay.ts` and `manifest.ts` | projection over admitted transform truth |
| post-transform worker report and `FpTransformResult` projection | `operator/plugins/transform/result_projection.ts` | candidate/evidence projection only |
| declared edge-output projection | `operator/plugins/consequence/edge_projection.ts` | consequence/read-model projection over admitted state; no transform semantics |
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
| H-040 | Move materialization observation/replay/manifest helpers into `product_materialization/*`. | observation is read-only; no output artifact synthesis remains | done: observation, replay, and manifest algorithms now live in `operator/product_materialization/{observation,replay,manifest}.ts`; `launch_contract.ts` retains only public adapter wrappers and transform-owned dependency wiring |
| H-050 | Move worker result and `FpTransformResult` projection into `plugins/transform/result_projection.ts`. | generated-asset closure still requires selected F_P review evidence | planned |
| H-060 | Split or delete installed-operator-owned evaluation artifacts. | no deterministic work-surface writer remains except declared execution evidence through ABG/system | partial: the old public writer is gone, declared workspace targets write through the file-store effect, declared edge projection now runs from `plugin.consequence.C` and catalogs as a consequence read model, and report/admission diagnostics are fixed under H-230; generated-asset closure still needs production-path proof |
| H-070 | Move gap dossier and retry diagnostic projection into `postflight/gap_dossier.ts`. | gap dossier remains diagnostic/read model; it cannot select next action directly | planned |
| H-080 | Move repair re-entry projection into consequence module. | repair action derives from closure decision plus `ActionCatalog` | planned |
| H-090 | Replace `writeOperatorArchiveFile` with direct `writeSdlcSystemArtifact` imports. | grep proves no `writeOperatorArchiveFile` export/import remains | done: source imports direct system writer and public wrapper export is removed |
| H-100 | Delete `handoff.ts` and update `operator/index.ts`. | build fails if any consumer imports `./handoff.js`; file removed | done: `operator/index.ts` exports the transform launch contract and system artifact writer directly |
| H-110 | Add raw-write audit tests for operator modules. | raw writes only in effect executors or approved product transformer/evaluator boundary | done for operator source: T-184 test rejects `writeFileSync`, `appendFileSync`, and `createWriteStream` in `operator/` |
| H-120 | Run clean JS hello-world live with PTY. | final close, no retry/block, expected CLIs/evaluator artifacts | done: current clean PTY live pass at `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260526T123226778Z_pid20615` after the edge-output-policy refactor; prior clean pass at `20260525T183305414Z_pid95270` remains historical evidence |
| H-130 | Run clean Rust server hello-world live with PTY. | final close, no retry/block, expected CLIs/evaluator artifacts | done: current clean PTY live pass at `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260526T124757862Z_pid37895`; product files were materialized by transform.C and closure passed through F_P evaluate/review-grade artifacts |
| H-140 | Run clean data mapper live with PTY. | final close or lawful block, no source-specific F_D compensations | in progress: current clean Sonnet-high PTY run `t164_data_mapper_full_capability_live/20260528T170316953Z_pid29551` has closed through `derive_test_design_surface`; `derive_component_test_surface` exposed LD-039/LD-040 materialization replay defects. Source fixes are staged into the same sandbox install and resume `20260528T235616980Z_pid16678` is running the same edge. |
| H-141 | Audit worker-runtime blocking reasons through the common consequence path. | `worker_output_limit_exceeded`, provider connection failures, and similar retryable process failures write diagnostics but select `retry`, not terminal `block`; hard protocol blocks remain protected | in progress: fixed closure disposition so explicit same-edge retry pressure outranks diagnostic assurance block; added `worker_connection_failed` for `ECONNRESET`/socket failures; covered by `test:t153` and `test:t184`; data-mapper live must be rerun |
| H-150 | Collapse stage-boundary aliases left after `handoff.ts` deletion. | no `__handoff*` export/import remains; evaluate/postflight imports owning evaluate, product-materialization, postflight, or effect modules directly | fixed: `__handoff*` aliases removed; postflight imports direct helpers; source grep covered by `test:t184` |
| H-160 | Remove bridge parser admission for component-depth carriers. | component-depth target carriers are admitted from exact whole-file/project/evaluator carrier truth only; stale fenced JSON under fresh prose cannot satisfy authority | fixed: fenced component-depth bridge parsing removed; T-171/T-183 tests now admit exact whole-file carrier and reject fenced carriers |
| H-170 | Delete live selected-composition synthesis fallback. | runtime closure and next-action projections fail closed without ABG-selected composition ref/digest/selection/regime identity; replay fixtures use explicit fixture identity only | fixed: closure/next-action construction now require selected composition identity and the legacy replay-only fallback is removed |
| H-180 | Remove target-asset governance fallback from live prompt category selection. | every live edge resolves work-category governance from graph/function catalog authority; missing catalog row fails closed or emits diagnostic, not hidden target fallback | fixed: work-category governance now comes only from graph/function catalog; missing row throws |
| H-190 | Remove framework-generated transform-output synthesis. | if the worker/evaluator did not write the contracted output, the run carries diagnostic evidence and selected evaluate/consequence decides; F_D does not create a substitute output artifact | fixed: `ensureObservedTransformOutput(...)` deleted; missing output artifact remains diagnostic evidence |
| H-200 | Reclassify deterministic no-dispatch edge output. | no-dispatch edges are declared projection edges with a generic edge-output projector, not installed-operator-owned ad hoc markdown/product writers | fixed: `writeInstalledOperatorNoDispatchArtifact(...)` deleted; every no-dispatch edge must resolve to shared `system_projection` edge-output policy or fail closed |
| H-210 | Collapse framework-owned evaluation target policy to one edge policy surface. | `installedOperatorOwnsEvaluationOutput`, review-grade required/exempt logic, postflight output exceptions, and artifact writer policy read one cataloged edge-output policy | partial: operator review-grade/postflight/writer decisions use `sdlcEdgeOutputPolicyForTargetAssetType(...)`; product graph contract catalog still carries a separate projection/review-grade exemption list and must be collapsed into a pure contract-level policy module |
| H-220 | Move installed-operator plugin prompts/contracts into plugin modules or plugin-set factory. | `installed_operator.ts` wires ABG plugin set from `operator/plugins/*` surfaces; it does not own F_P evaluator prompts, rule contracts, or semantic rule selection | done: plugin contracts live in `operator/plugins/plugin_contracts.ts`, plugin-set construction and rule metadata live in `operator/plugins/plugin_set.ts`, evaluator prompt bodies live in `operator/plugins/evaluate/prompts.ts`, and `installed_operator.ts` passes typed callbacks into `createSdlcAbgPluginSet(...)` |
| H-230 | Audit F_D postflight/blocking carriers as diagnostic-only. | deterministic report/admission failures are system diagnostics or ABG contract failures only; product retry/block/close still derives from selected evaluate/consequence authority | fixed: `workerReportAdmissionPostflight(...)` and `deterministicReportAdmissionPostflight(...)` return diagnostic postflight with empty `blockingReasons`, carry `worker_report_admission_failed` as `operator_blocked`, and `completeReportAdmissionFailure(...)` publishes a consequence next-action projection instead of a product gap dossier |
| H-240 | Refactor compatibility tests that preserve legacy surfaces. | tests exercise production-path carriers or are deleted; no test imports public legacy writer helpers or embeds fenced component-depth carriers as accepted proof | partial: focused T-183/T-184 proof rejects the deleted surfaces, T-151/T-158 fixtures now use current evaluator-register and review-grade authority, and the full semantic suite passes; remaining proof-quality target is behavioral LD-025/LD-030/LD-032 coverage beyond source grep |

Current scope note: T-184 remains open. `handoff.ts` deletion is literal, but
`operator/plugins/transform/launch_contract.ts` still owns transform launch,
result projection, postflight/gap dossier, repair re-entry, execution evidence,
and evaluate-adjacent helper exports. The partition is not closed until
H-010/H-020/H-050/H-070/H-080, LD-011, and the T-187 prompt-boundary decision
either land or this ticket is explicitly re-scoped to file deletion only.

This is a design-reframe / realization-HOW gap, not a product-law violation by
file size or filename. The product-law risk is indirect: one cross-stage module
keeps making the transform/evaluate/postflight/consequence authority boundary
easy to violate.

`handoff` remains valid domain vocabulary for the worker handoff manifest and
related installed-operator UX surfaces; it is not itself a forbidden word.

## Live Discovery Ledger

The data-mapper live lane is a defect-discovery lane for `odd_sdlc`, not a goal
to finish data mapper by compensating locally. Every block, retry, stale branch,
or duplicate surface discovered during the live run is tracked here.

| id | archive evidence | discovery | authority verdict | status |
| --- | --- | --- | --- | --- |
| LD-001 | `t164_data_mapper_full_capability_live/20260525T231651480Z_pid17089` | `worker_output_limit_exceeded` was typed as retryable worker runtime pressure, but diagnostic target-carrier absence could still suppress retry and terminal-block the edge. | F_D diagnostics may write information only; explicit same-edge retry pressure must flow through the common consequence path. | fixed: retry pressure outranks diagnostic assurance block; covered by `test:t153` |
| LD-002 | `t164_data_mapper_full_capability_live/20260526T013108934Z_pid89085` | provider `ECONNRESET` was classified as generic `worker_process_failed` and selected terminal inspection/block instead of retry. | transient worker transport failures are runtime pressure, not product semantic failure. | fixed: `worker_connection_failed`; covered by `test:t184` |
| LD-003 | `t164_data_mapper_full_capability_live/20260526T050928948Z_pid56692`, run `20260526T101301157Z_pid56862` | `component_realization_qualification_surface.md` was a workspace product target but was written through the system artifact writer, which enforces operator-run archive containment. | `.ai-workspace` runtime artifacts use `writeSdlcSystemArtifact`; declared workspace product targets use the file-store effect at `manifest.outputFile`. | fixed: workspace target JSON writer uses file-store effect; covered by `test:t184` |
| LD-004 | code trace in `operator/plugins/transform/launch_contract.ts` and `operator/installed_operator.ts` around installed-operator-owned evaluation artifacts | no-dispatch qualification/projection surfaces were implemented as target-specific branches (`component_realization_qualification_surface`, `component_test_qualification_surface`, `release_depth_parity_surface`) and then moved under a consequence filename while still being invoked from dispatch. | multi-surface projection code is legacy debt; every edge should use one generic edge-output projection/materialization flow with edge-declared producer policy, and declared projection materialization must run as `plugin.consequence.C` projection over admitted state. | fixed: declared projection writer and target-specific projection branches live in `operator/plugins/consequence/edge_projection.ts`, dispatch now only publishes a pending system-projection report, `projectConsequenceForInstalledOperatorState(...)` invokes the writer, and `test:t184` rejects dispatch-stage writer calls plus installed-operator evaluation cataloging |
| LD-005 | code trace in `operator/plugins/transform/launch_contract.ts` | local helper name `writeStableJsonFile` hid the system/workspace boundary after LD-003. | helper names must expose authority boundary, not serialization detail. | fixed locally: renamed to `writeWorkspaceTargetJsonFile`; covered by source grep and `test:t184` |
| LD-006 | source trace: `operator/plugins/evaluate/postflight.ts` imports `__handoffEvaluate*`, `__handoffResolveProductMaterializationReplay`, and `__handoffInstalledOperatorOwnsEvaluationOutput` from `operator/plugins/transform/launch_contract.ts` | deleting `handoff.ts` moved the coupling but did not fully partition it; evaluate/postflight still reaches through transform launch internals for replay, diagnostics, and framework-owned output policy. | stage modules must bind through owning surfaces: transform launch, product-materialization observation/replay, evaluate/postflight diagnostics, and effects. Cross-stage `__handoff*` aliases are compatibility debt. | fixed: `__handoff` source grep is clean and `test:t184` enforces it |
| LD-007 | source trace: `operator/component_depth_register.ts` `fencedComponentDepthCandidates(...)` and `jsonCandidates(...)` | component-depth admission still accepts fenced JSON blocks when whole-file JSON parsing fails. That can preserve the stale-structured-carrier-under-fresh-prose failure pattern T-183 was meant to delete. | semantic component-depth rows must come from selected `evaluate.C/F_P` content register or explicit project authority, then be admitted as exact carrier truth; Markdown/fenced bridge parsing cannot satisfy authority. | fixed: fenced bridge removed; `test:t183` now rejects fenced component-depth carriers |
| LD-008 | source trace: `operator/traversal_consequence.ts` `legacyReplayOnlyCompositionIdentityForInput(...)`; design acceptance at `ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md` says synthesized identity fails closed | closure and next-action projections can still fall back to locally synthesized selected composition identity when no ABG-selected identity is supplied. | live runtime closure must preserve ABG-selected `abg.fn_composition` ref/digest/selection/regime identity; replay fixture support must not be reachable from live closure. | fixed: selected composition is required in closure/next-action constructors; legacy fallback removed |
| LD-009 | source trace: `operator/work_category_governance.ts` `TARGET_ASSET_GOVERNANCE_CATEGORY` and `target_asset_catalog_fallback` | prompt governance category can be selected from a target-asset fallback map when the graph/function catalog has no entry. This is a second categorization surface beside the graph catalog. | live edge work-category governance should come from graph/function catalog truth; target fallback is at most a migration diagnostic or test fixture behavior. | fixed: target-asset fallback removed; graph/function catalog is required |
| LD-010 | source trace: `operator/index.ts` still exports `writeInstalledOperatorOwnedEvaluationArtifact`; `test_t184_handoff_partition_boundary.test.mjs` imports it as public API | the framework-owned product-surface writer is still a public operator API and is currently blessed by T-184 tests. | product-surface projection/materialization should be selected by the edge-output projection surface, not a public helper named for installed-operator ownership. | fixed: old public writer export removed; tests consume shared edge-output policy |
| LD-011 | source trace: `operator/plugins/transform/launch_contract.ts` `componentDepthFieldSetForTarget(...)`, `compactComponentDepthDirective(...)`, and target-specific outcome directives | node/asset-specific prompt semantics still live inside the generic transform launch contract, including stale repair-schedule instructions as prose. | Live product-law gap: prompt-bearing edges must flow through declared prompt contexts and selected edge/node pressure, not a separate prompt-template authority surface inside generic transform launch code. Generic launch should package declared pressure and bounded archive refs, not own semantic target rules or dump forensic packages into worker prompts. | open: move per-target directives into `operator/nodes/*`, graph/node pressure modules, or catalog-backed prompt fragments; add source proof that `launch_contract.ts` has no semantic target switch and no prompt-owned repair schedule constitution |
| LD-012 | source trace: `operator/plugins/transform/launch_contract.ts` `ensureObservedTransformOutput(...)` writes `manifest.outputFile` when it is missing | if a worker materializes files but omits the contracted transform artifact, F_D can synthesize an output artifact from observed filesystem state. | transform output candidates belong to `transform.C`; F_D materialization observation may write diagnostics but must not substitute the transform artifact. | fixed: synthesis helper deleted; missing output artifact is not replaced |
| LD-013 | source trace: `operator/installed_operator.ts` `writeInstalledOperatorNoDispatchArtifact(...)` and `noDispatchReport(...)` | no-dispatch edges can synthesize markdown output and worker-result reports under installed-operator authority. | no-dispatch is a declared projection/qualification policy, not a special installed-operator product writer. It must route through the same generic edge-output projection surface as every other A -> B edge. | fixed for product output: no-dispatch artifact writer deleted; dispatch writes only a pending system-projection report and consequence.C writes the declared projection output |
| LD-014 | source trace: `operator/review_grade_edge_fulfillment.ts` `frameworkOwnedEvaluationTarget(...)`; compare `operator/plugins/transform/launch_contract.ts` `installedOperatorOwnsEvaluationOutput(...)` | framework-owned target sets are duplicated in separate modules, so review-grade requirement policy can drift from output-writer policy. | one edge-output policy surface must say whether an edge is worker-authored, evaluator-authored, projection-only, review-grade-required, or no-close. | partial: operator decisions consume `edge_output_policy.ts`; remaining duplicate lives in `contracts/product_graph_contract_catalog.ts` and should be moved to a pure contract-level policy |
| LD-015 | source trace: `operator/installed_operator.ts` `fpDispatchPluginContract()`, `fpEvaluatorPluginContract()`, `designDepthFpEvaluatorPrompt(...)`, and `reviewGradeEdgeFulfillmentPrompt(...)` | `installed_operator.ts` owned plugin contracts and evaluator prompts instead of consuming a plugin-set boundary from `operator/plugins/*`. | installed operator should bind ABG to declared plugin modules; F_P evaluator prompts and rule contracts belong to `plugins/evaluate/*`, not the runtime loop file. | fixed: `createSdlcAbgPluginSet(...)` constructs ABG plugin/rule metadata from plugin modules, contracts live in `plugins/plugin_contracts.ts`, prompts live in `plugins/evaluate/prompts.ts`, and focused T-184 source proof rejects those definitions in `installed_operator.ts` |
| LD-016 | source trace: `operator/assurance_gate.ts` formerly built materialization, shallow-realization, capability, obligation, component-depth, design-completeness, requirement-closure, and carry ledgers, then marked them diagnostic-only | even diagnostic-only F_D ledgers looked like a second semantic judgment surface that could be accidentally promoted again. | F_D may admit/write system artifacts and refs only; semantic adequacy judgment belongs to selected `evaluate.C/F_P` output and consequence closure. | fixed: runtime assurance ledger construction is purged, `assurance_ledgers.json` is no longer written or cataloged, and `test:t183` proves the runtime gate cannot construct/fold assurance ledgers |
| LD-017 | source trace: `operator/installed_operator.ts` `workerReportAdmissionPostflight(...)` and `deterministicReportAdmissionPostflight(...)` returned `status: "blocked"` using `legacyBlockingReasonCode(...)` | deterministic report/admission failures looked like postflight closure blockers in the runtime state shape. | malformed reports are system contract diagnostics or ABG admission failures; they must not be confused with product semantic block/retry authority. | fixed: report admission postflight now has `status: "diagnostic"`, empty `blockingReasons`, `operator_blocked` carrier metadata, and the dispatch stop ref is the consequence next-action projection with `contract_failure` runtime artifact |
| LD-018 | source trace: `build_tenants/typescript/test_env/tests/test_t184_handoff_partition_boundary.test.mjs` imports `writeInstalledOperatorOwnedEvaluationArtifact`; older tests such as `test_t076...` and `test_t120...` embed fenced `component_depth_register` blocks | some tests still prove compatibility with the very surfaces T-184 is deleting. | tests are proof surfaces; if they require legacy interfaces, the legacy interface remains alive. Refactor to production-path fixtures or delete redundant tests. | fixed for focused proof: `test:t184` rejects old public writer imports and `test:t183` rejects fenced component-depth bridges; broader legacy fixture sweep remains in LD-019 if future full suite exposes more |
| LD-019 | source/test audit after deleting fenced component-depth admission | other historical tests may still carry legacy fenced component-depth fixtures even if focused T-183/T-184 proof is now corrected. | stale tests must be refactored to exact carriers or deleted when discovered; no test may keep a deleted authority path alive. | open watch item: run broader semantic suite before ticket closure and update/delete any stale fixture that fails due to the intended bridge removal |
| LD-020 | data-mapper live trace `20260526T131037710Z_pid64804`, retry run `20260526T132002672Z_pid64999`; source trace `operator/plugins/transform/launch_contract.ts` retry instructions | retry prompt called selected review-grade residual pressure a "prior deterministic defect" even though the retry came from `evaluate.C/F_P`. | prompt language is part of the authority boundary; F_D diagnostics can write facts, but retry work queues are evaluated residual pressure from selected evaluation/consequence truth. | fixed: shared retry instruction now says "evaluated residual pressure" and `npm run build:semantic` passes after the patch |
| LD-021 | data-mapper live trace `20260526T131037710Z_pid64804`, design-depth evaluator retry runs `20260526T165603084Z_pid20915`, `20260526T172204812Z_pid20915`, `20260527T044320358Z_pid46689`, and `20260527T050000015Z_pid51394` | design-depth `evaluate.C/F_P` spent the old 15-minute timeout in hidden register construction and never wrote `design_depth_fp_evaluator_content_register.json`; prompt-only fragment instructions still allowed hidden thinking after the first reads; an empty draft register proved observable but still left the model constructing a full write in hidden thought. | the evaluate content register is the F_D admission/write interface; F_D may pre-create nonprojectable draft rows, agents convert those rows incrementally into semantic fragment rows, and F_D assembles only admitted non-draft fragment rows into the register projection after preserving selected composition identity. | fixed locally: nonprojectable `sdlc_design_depth_register_fragment_draft` rows are seeded for every section, `sdlc_design_depth_register_fragment` rows are admitted/projected only when all sections are present and row refs are non-draft, and the prompt now instructs plan plus incremental conversion; covered by `test:t181` and `test:t184`; final full data-mapper completion still needs rerun |
| LD-022 | source trace against `/Users/jim/src/apps/abiogenesis`: `emit(...)` is the one ABG runtime-truth write boundary and installed workspaces use `.ai-workspace/events/events.jsonl` as the event stream | odd_sdlc `appendOddSdlcRuntimeEvents(...)` wrote validated runtime events directly to the canonical event stream, which made the local appender look like an event authority instead of an ABG emit sink. | `.ai-workspace/events/events.jsonl` is the ABG installed event stream; the violation is bypassing `emit(...)`, not the file path. Downstream event persistence must behave as the storage sink for ABG-emitted events. | fixed locally: `appendOddSdlcRuntimeEvents(...)` now passes every event batch through ABG `emit(...)` before appending to the canonical event stream; covered by `test:t184` source proof |
| LD-023 | Rust minimal hello-world live trace `scenario_t133_hello_world_rust_live/20260527T184751792Z_pid87016`, operator run `20260527T184800591Z_pid87016`; compare `handoff_manifest.json`, `design_depth_fp_evaluator_register.json`, and `operator_summary.json` | the design-depth evaluator emitted `design_depth_register.moduleSchemaFragments[0].entities[0].invariants[0]` as an object while the target carrier contract declares `invariants: string[]`; this is the first clean bug exposed by removing F_D-created design-depth ledgers and making selected `evaluate.C/F_P` own semantic design-depth construction; the run blocked on the ADR edge before component-code materialization, so the missing `Cargo.toml` assertion is a downstream symptom. | exact target-carrier shape is admission law; `evaluate.C/F_P` findings must satisfy the declared carrier contract before any close proposal, ledger fulfillment, or next traversal can be treated as semantic truth. F_D may seed/admit/register fragments, but it must not normalize or invent semantic depth rows behind the evaluator. | fixed locally: target-carrier admission parser is reused before legacy register projection writes, the F_P prompt now declares `sdlc_domain_entity.invariants` as `string[]` and rejects structured invariant objects, and `test:t181` proves object-valued invariants block before writing `design_depth_fp_evaluator_register.json` |
| LD-024 | Rust minimal hello-world live trace `design_depth_fp_evaluator_process_events.jsonl.trace/events.ndjson` in run `20260527T184800591Z_pid87016` | the evaluator process rewrote its own `design_depth_fp_evaluator_content_register.json`, edited `Cargo.toml` role from `build_config` to `source`, then ran a local validator that reported `errors 0` while still missing the invariant-shape defect that later blocked admission. | evaluator-write capability must be constrained to the declared register interface and checked by the same admission schema that closure uses; local self-checks cannot be a weaker substitute for system admission. | fixed for the observed live path: exact system validation now runs before projection writes, the prompt forbids using package/build-config/test/doc paths as component rows merely to satisfy source matching, and live run `20260527T193824300Z_pid33429` kept `Cargo.toml` as `build_config`, `src/main.rs` as `source`, and admitted the design-depth register |
| LD-025 | Rust minimal hello-world live trace `fp_evaluate_result.json`, `sdlc_edge_fulfillment_ledger.json`, and `sdlc_edge_closure_decision.json` in run `20260527T184800591Z_pid87016` | `fp_evaluate_result.json` proposed close and the edge fulfillment ledger reported `expected: 6`, `fulfilled: 6`, while the same run had `targetCarrierAdmissionStatus: missing`, `edgeConverged: false`, and the closure decision selected `retry`. | evaluation-set completeness and target-carrier admission must dominate the user-facing edge summary; an obligation ledger may record reviewed obligations, but it must not read as semantic close when carrier admission failed. | source fix + focused proof landed: operator summary now separates `obligationReview` from `admittedSemantic`, and `test:t184` covers the fields. Production behavioral proof over invalid carrier admission remains pending. |
| LD-026 | Rust minimal hello-world live trace `20260527T184800591Z_pid87016` | the operator summary cites `evaluation-rule://odd-sdlc/design-depth-register/fp:design_depth_register_invalid`, but the run archive does not contain `design_depth_fp_evaluator_rule_outcome.json`; the accepted JS ADR edge does persist that rule-outcome artifact. | system admission/write must persist both accepted and rejected evaluation-rule outcomes so replay can explain why a retry or block was selected without relying only on the summary string. | fixed locally: `design_depth_fp_evaluator_rule_outcome.json` is written for accepted and blocked F_P outcomes, only accepted outcomes feed admission evidence, and the artifact is cataloged as `evaluation_rule_outcome` |
| LD-027 | JS live event stream `scenario_t132_hello_world_js_live/20260527T183300968Z_pid88233/workspace/.ai-workspace/events/events.jsonl`; Rust live event stream `scenario_t133_hello_world_rust_live/20260527T184751792Z_pid87016/workspace/.ai-workspace/events/events.jsonl` | every checked event has unique `eventId`, `eventTime`, `eventTimeUnixMs`, and `eventAdmissionOrdinal`, but append order is not admission order: JS line 16 has ordinal `543` before line 17 ordinal `15`; Rust line 106 has ordinal `275` before line 107 ordinal `86`. | ABG owns replay projection and replay truth. The canonical installed event stream is append-oriented archive truth; odd_sdlc must not sort, de-duplicate, rewrite, or otherwise project replay order from the event store. | fixed and resolved for the odd_sdlc authority breach: `appendOddSdlcRuntimeEvents(...)` calls ABG `emit(...)` and appends only the emitted batch; `readOddSdlcRuntimeEvents*` returns archive order without local replay sorting; focused behavioral proof pre-seeds archive truth and proves later appends do not rewrite, sort, or de-duplicate prior bytes. ABG replay projection remains the owning layer; future live runs only exercise this resolved sink boundary. |
| LD-028 | data-mapper live trace `t164_data_mapper_full_capability_live/20260527T201905115Z_pid74878`, retry run `20260527T203039783Z_pid75044`; source trace `operator/installed_operator.ts` synthetic closure-gap retry projection | same-edge retry pressure from selected closure truth was emitted to the next worker as blocking reason code `assurance_ledger_reason` after runtime assurance ledger construction had already been purged. The retry was lawful closure residual pressure, but the worker-facing carrier still named the old ledger surface. | retry instructions must name admitted edge-closure residual pressure, not an F_D-created assurance ledger; no worker package or prompt should reintroduce ledger terminology for selected evaluate/consequence retry pressure. | fixed locally: installed operator now emits `edge_closure_residual_pressure`, preserves the closure reason detail for retry compaction, and focused retry prompt tests assert the old code is absent |
| LD-029 | data-mapper live trace `t164_data_mapper_full_capability_live/20260527T201905115Z_pid74878`, requirement retry run `20260527T210439549Z_pid75044` | the selected review-grade evaluator correctly rejected `specification/requirements/10-generated-bootstrap.md` for missing fully qualified obligation IDs and per-row acceptance criteria, but the retry package expanded that single closure decision into 406 repair instructions and a 26,610,048-byte `worker_invocation_package.json`. Each instruction repeated the dossier-wide evidence/ref list, making the retry cause hard to see and turning workspace history into duplicated prompt payload. The visible retry checklist also decoded percent-encoded obligation refs incorrectly, producing malformed `requirement:A...` ids. | retry repair instructions must carry the cause for that instruction, not the full accumulated history. History remains reachable through retry attempt refs, gap dossier refs, manifest refs, and workspace archive files; the visible current-gap prompt should decode requirement causes into canonical requirement ids. | fixed locally: per-reason retry instructions now carry only `blockingReason.evidenceRefs`; aggregate history stays in `retryFrontier`, `gapDossierRef`, and workspace files. Current evaluated gaps decode percent-encoded requirement refs before building the retry checklist. Fresh data-mapper run is required because the active sandbox was installed before the patch. |
| LD-030 | data-mapper live trace `t164_data_mapper_full_capability_live/20260527T201905115Z_pid74878`, UAT run `20260527T214021517Z_pid75044`, testcase-authority runs `20260527T215917522Z_pid75044` and `20260527T220814370Z_pid75044`; compare `review_grade_edge_fulfillment_assessment.json`, `sdlc_edge_fulfillment_ledger.json`, and `sdlc_edge_closure_decision.json` | review-grade evaluation passed all 314 obligations, the edge fulfillment ledger recorded `edgeConverged: true`, target carrier admission was `admitted`, postflight passed, and residual pressure refs were empty, but the closure decision still selected `retry` because `abgTerminalRetryReasonRefs(...)` converted the stale ABG terminal `yielded/partial_or_missing_evidence_requires_retry_or_repair` into same-edge retry pressure. The same pattern reproduced on both UAT and testcase-authority surfaces, so it is not target-specific. On testcase-authority, the unnecessary retry rewrote a passed surface into a blocked one: the retry review fulfilled 300/314 and marked 14 `REQ-TYP` obligations partial. | ABG terminal yield truth is admitted runtime evidence, but it cannot override consequence.C once the selected edge assurance decision and fulfillment ledger prove the edge is closed. The consequence fold must close over admitted edge state, not preserve an earlier evaluate.C yield as residual pressure after selected review-grade evidence has cleared it. | fixed locally: terminal retry refs are now suppressed when the constructed fulfillment ledger is converged and the selected edge assurance close decision is `close`; focused T-184 source proof covers the raw-terminal-to-converged-ledger suppression. Fresh data-mapper run is required because the active sandbox was installed before the patch. |
| LD-031 | data-mapper live trace `t164_data_mapper_full_capability_live/20260527T201905115Z_pid74878`, implementation-design run `20260527T231842411Z_pid75044`; compare `design_depth_fp_evaluator_content_register.json` and `design_depth_fp_evaluator_process_events.jsonl.trace/terminal.transcript` | the design-depth evaluator correctly received a pre-created 12-row draft content register, but after reading governance, construction brief, and bounded ADR summaries it spent over 12 minutes in hidden construction and still had only draft rows. The transcript shows it chose to hand-author the full content register with the Write tool after saying it would write the first update, instead of performing an immediate durable draft-to-fragment register update. | The evaluate.C/F_P content register is the visibility surface for probabilistic design-depth judgment. The first update must expose durable progress, but F_D still cannot prescribe semantic evaluator work through a prompt-template recipe. Pure draft-to-fragment conversion is carrier mechanics; semantic design-depth judgment belongs to selected `evaluate.C/F_P`. | reopened into T-187: the tactical prompt currently embeds exact Node for the first update. T-187 decides whether that carrier-mechanics step moves to F_D/helper code or remains a named authority-neutral helper, and removes prompt-template recipe proof before data-mapper rerun. |
| LD-032 | data-mapper live trace `t164_data_mapper_full_capability_live/20260527T201905115Z_pid74878`, final operator run `20260527T231842411Z_pid75044` | the top-level live archive has no `start-until-converged.process.json`, and the final operator run has no `run.json`, `run_compact.json`, `operator_summary.json`, `sdlc_edge_closure_decision.json`, `design_depth_fp_evaluator_register.json`, or `design_depth_fp_evaluator_rule_outcome.json`. The last evaluator event is only a supervised actor heartbeat at `2026-05-27T23:40:18.156Z` / `elapsedMs=900193`; no Claude `result`, process exit status, signal, timeout, or semantic closure artifact was persisted. | live-run archives must preserve the immediate termination cause even when the harness is interrupted externally; otherwise crash recovery cannot distinguish killed/stopped, timeout, provider failure, evaluator block, and semantic retry. | source scaffold + focused proof landed: long-process archives carry started/completed/interrupted lifecycle fields and T-184 checks the installed operator plus live harness sources. Behavioral interruption proof remains pending; LD-027 now avoids whole-file event-log rewrites that could erase interruption forensics. |
| LD-033 | clean data-mapper live trace `t164_data_mapper_full_capability_live/20260528T055846308Z_pid16439`, product edge run `20260528T061022907Z_pid16601`; compare `review_grade_edge_fulfillment_assessment.json`, `worker_result_report.json`, `sdlc_edge_residual_pressure.json`, `sdlc_edge_fulfillment_ledger.json`, and `sdlc_edge_closure_decision.json` | selected review-grade `evaluate.C/F_P` blocked product-surface closure with 3 partial `semantic_not_realized` findings, and the worker report carried those partial review-grade rows, but consequence measured only edge-local fulfilled rows. It wrote empty residual pressure, `edgeConverged: true`, and closure `close`; traversal advanced even though ABG terminal truth was `evaluation_set_incomplete`. | selected evaluation residual pressure is part of the admitted edge state consumed by `plugin.consequence.C`. Edge gain can measure fulfilled local evidence, but consequence closure must fold selected `evaluate.C/F_P` residual pressure before deriving the assurance close decision, ledger convergence, and traversal transition. | fixed locally: `deriveInstalledTraversalConsequence(...)` folds `fpEvaluationResidualPressureRefsForState(...)` into `edgeResidualPressure` before `deriveSdlcEdgeAssuranceCloseDecision(...)` and ledger construction; `test_t164_edge_gain_closure_contract` proves selected F_P pressure forces retry even when measured gain is otherwise close-ready; `test:t184` source proof covers the production handoff. Fresh clean data-mapper run required. |
| LD-034 | clean data-mapper live trace `t164_data_mapper_full_capability_live/20260528T064319515Z_pid78723`, first edge run `20260528T064325161Z_pid78887`; compare `review_grade_edge_fulfillment_assessment.json`, `worker_result_report.json`, `sdlc_edge_residual_pressure.json`, `sdlc_edge_fulfillment_ledger.json`, and retry run `20260528T065421982Z_pid78887` | selected review-grade assessment passed with open finding count 0, but merged worker report rows still carried 125 downstream/carry `reviewGrade: true` partial statuses. Consequence derived residual pressure from the merged worker report, so it marked the edge non-converged and launched a retry even though the selected F_P review-grade artifact had admitted the edge. | selected evaluation residual pressure must come from the selected review-grade assessment/rule artifact, not from the merged diagnostic worker report. Worker carryover rows can remain diagnostic/contextual, but they cannot re-open an edge after selected `evaluate.C/F_P` has accepted the review-grade assessment. | fixed locally: `reviewGradeResidualPressureRefsForState(...)` now admits `review_grade_edge_fulfillment_assessment.json` and derives pressure through `reviewGradeEdgeFulfillmentAssessmentPressureRefs(...)`; missing or rejected assessment artifacts still create pressure. Focused tests prove passed selected assessments produce no residual pressure and blocked selected assessments do. Fresh clean data-mapper run required; the `20260528T064319515Z_pid78723` sandbox was stopped as an invalid proof vehicle. |
| LD-035 | clean data-mapper live trace `t164_data_mapper_full_capability_live/20260528T070413647Z_pid85948`, no-dispatch qualification run `20260528T104330935Z_pid86113`; compare `start-until-converged.process.json`, `start-until-converged.stderr.log`, `handoff_manifest.json`, `worker_result_report.json`, and `fp_evaluate_result.json` | `qualify_component_realization_surface` reached `evaluate.C` and produced a passed F_P result over a pending system-projection report, but the process then exited status `2` with `ENOENT` reading `build_tenants/scala_spark/design/component_realization_qualification_surface.md`. The installed helper `completeReportDispatch(...)` called `constructorResultFromWorkerOutput(...)`, which reads `report.outputFile`, before `plugin.consequence.C` had written the declared projection output. | The full graph catalog is a dependency-chain ambiguity reducer: `WHAT` surfaces constrain test authority, design constrains component/interface decomposition, component code is built against admitted design, and no-dispatch qualification projections reduce ambiguity over already admitted upstream state. A projection-only/no-dispatch edge may carry a pending output ref through transform/evaluate, but only consequence owns the declared projection write; dispatch cannot read or hook consequence-owned output first. | fixed locally: no-dispatch projection edges call `completeReportDispatch(...)` with `deferConstructorUntilConsequence: true`; the helper admits post-transform diagnostics and stores dispatch state without constructor/hook reads until consequence projection exists. `test_t184_handoff_partition_boundary` proves no-dispatch projection defers output reads, and `test_t172_edge_accounting` proves executable no-dispatch edges run without `worker_run` and admit projected target carriers. Fresh clean data-mapper run required. |
| LD-036 | clean data-mapper live trace `t164_data_mapper_full_capability_live/20260528T154533878Z_pid86358`, requirement run `20260528T163918501Z_pid86498`, and retry run `20260528T164859863Z_pid86498`; compare `review_grade_edge_fulfillment_assessment.json`, `gap_dossier.json`, `sdlc_edge_closure_decision.json`, `worker_invocation_package.json`, and `worker_prompt.md` | selected review-grade `evaluate.C/F_P` blocked `derive_requirement_surface` with 278 findings, but retry-context construction lost the archived gap dossier and synthesized repair pressure from closure reason refs. The closure decision had 769 reason refs, and the next retry package expanded them into 769 repair instructions. The retry prompt was only 44 KB and the package 2.2 MB, so LD-029's 26 MB duplication was reduced, but the prompt still omitted actionable `requiredAction` cause and treated residual pressure refs as the instruction set. | retry context must prefer the current admitted gap dossier when it exists; closure residual pressure is a summary of selected evaluation gaps, not hundreds of independent work items. F_D may route the next retry and expose bounded cause/evidence, but it must not reconstruct action semantics from closure reason refs when review-grade diagnostics already recorded the current cause. | fixed locally: retry derivation now reloads the archived postflight gap dossier before falling back to synthetic closure-gap dossiers, and retry prompt/package construction consolidates same-edge `edge_closure_residual_pressure` reasons into one bounded instruction with `requiredResidualPressureRefCount`, sample refs, and `rawReasonCount`. `test_t120_retry_local_repair_prompt` proves 120 residual refs become one bounded instruction; `test:t184` still passes. Fresh clean data-mapper run required. |
| LD-037 | clean data-mapper live trace `t164_data_mapper_full_capability_live/20260528T170316953Z_pid29551`, testcase-authority run `20260528T182647549Z_pid29713`, and retry run `20260528T183616799Z_pid29713`; compare `review_grade_edge_fulfillment_assessment.json`, `worker_result_report.json`, `fp_evaluate_result.json`, and `sdlc_edge_closure_decision.json` | selected review-grade `evaluate.C/F_P` fulfilled 319 findings and marked 8 requirement findings `partial/wrong_stage` because `req_typ_006` and `req_typ_007` were bound to UAT refs and intentionally carried to later test implementation/execution. The current edge had admitted the testcase-authority binding, but review-grade residual pressure treated downstream-stage carry as same-edge residual pressure, so closure selected `retry` with 9 reason refs. The retry then passed all 327 findings and closed, proving the first retry was avoidable framework pressure. | downstream requirement carry is not current-edge semantic failure. Review-grade may record `wrong_stage` downstream obligations as diagnostic/next-stage pressure, but selected consequence must not re-enter the same edge when the current edge's declared binding was admitted and the only open findings are requirement carry to downstream transformation surfaces. | fixed locally: selected review-grade pressure refs now ignore requirement `partial/wrong_stage` downstream carry; merged worker reports preserve those review-grade rows as `requirement_carried_for_downstream_closure:*` carry reasons so edge fulfillment counts classify them as downstream transformation-set pressure; the accepted review-grade rule outcome carries those refs as diagnostics, not residual pressure. `test_t182_fp_review_grade_edge_fulfillment` covers the non-retry pressure law. The compiled fix was copied into the current sandbox install for any resume/restart; the already-running Node process had loaded the old module, but the live retry passed and advanced. |
| LD-038 | same clean data-mapper sandbox `t164_data_mapper_full_capability_live/20260528T170316953Z_pid29551`, implementation-design runs `20260528T193047558Z_pid29713`, `20260528T194036149Z_pid76473`, `20260528T194947208Z_pid49363`, and `20260528T200633745Z_pid74646`; compare `design_depth_fp_evaluator_content_register.json`, `design_depth_fp_evaluator_stdout.log`, and `design_depth_fp_evaluator_process_events.jsonl` | LD-031's first-update prompt fix converted draft rows, but the evaluator then printed ADR section/table dumps and spent hidden time in full-register or multi-table extraction without another durable section write. The content register remained 12 fragment rows with only `designCompletenessVerdict` non-empty. | first-write visibility is necessary but not sufficient. The evaluate.C/F_P content-register interface must expose incremental semantic progress, but product law does not permit F_D prompt text to prescribe ADR-table semantic extraction as the evaluator method. | reopened into T-187: the exact second-update command is not accepted as a final fix. It must be removed or replaced by a lawful compact prompt/helper boundary that preserves F_P semantic judgment and F_D carrier/admission mechanics. |
| LD-039 | same clean data-mapper sandbox `t164_data_mapper_full_capability_live/20260528T170316953Z_pid29551`, component-test runs `20260528T231248281Z_pid4831`, `20260528T233548721Z_pid64985`, and retry `20260528T235331869Z_pid64985`; compare `product_materialization_manifest.json`, `postflight.json`, and `review_grade_edge_fulfillment_assessment.json` | the first component-test attempt materialized 25 ScalaTest files under module-local `src/test/scala/...` paths, but product-materialization observation classified them as `other`, so postflight emitted `materialized_product_role_missing:test`. The same-sandbox retry then saw those test files as unchanged and reused the stale prior `other` replay rows, suppressing current path-based `test` role inference. Review-grade correctly blocked because the framework materializedFiles surface contained only build config, despite valid test files existing in the workspace. | same-edge retry must be able to recover from stale framework classification without requiring the agent to rewrite every product file. Prior replay rows are evidence, not stronger than the current materialization contract; if a prior row role does not satisfy the current required role, observation must fall through to current path/contract inference. | fixed locally and staged into the same sandbox install: component-test observation infers required `test` role from module-local `src/test` paths, and stale exact/path replay rows with non-required roles no longer suppress current required-role inference. Covered by `test_t066_product_materialization_contract.test.mjs` T-184 tests. Resume `20260528T235616980Z_pid16678` is the live proof attempt. |
| LD-040 | same clean data-mapper sandbox `t164_data_mapper_full_capability_live/20260528T170316953Z_pid29551`, component-test retry `20260528T233548721Z_pid64985`; compare `worker_result_report.json`, `product_materialization_manifest.json`, and prior manifest `20260528T231248281Z_pid4831/product_materialization_manifest.json` | materialization replay was skipped when the current attempt materialized only declared build-config files because `materializationReplayIsNeeded(...)` treated satisfied declared targets as sufficient and did not also enforce `requiredRoles: ["test"]`. The manifest therefore wrote only three build-config rows and no replay metadata, even though prior same-edge materialization existed and the current product contract still required test evidence. | declared target satisfaction and required product roles are conjunctive admission pressure. A build/config target cannot satisfy a required `test` role, and replay must remain available when current transform output omits required-role materialization already present in prior same-edge state. | fixed locally and staged into the same sandbox install: replay eligibility now checks missing `requiredRoles` even when declared target contracts exist. Covered by `test_t066_product_materialization_contract.test.mjs` T-184 replay test. Resume `20260528T235616980Z_pid16678` is the live proof attempt. |
| LD-041 | same clean data-mapper sandbox `t164_data_mapper_full_capability_live/20260528T170316953Z_pid29551`, test-execution-result runs `20260529T000433786Z_pid16678`, `20260529T000522061Z_pid16678`, `20260529T000551698Z_pid16678`, `20260529T000621617Z_pid16678`, and `20260529T000651403Z_pid16678`; compare `worker_result_report.json`, `sdlc_edge_closure_decision.json`, and `runtime_events.json` | the ABG re-entry primitive was working: every retry emitted `graph_span_evaluation_scheduled -> graph_span_assessed -> graph_span_foldback_evaluated -> graph_reentry_planned -> graph_reentry_applied`, which backs replay up to the selected edge. The edge still looped until retry guard exhaustion because `derive_test_execution_result_surface` was treated as a pending consequence projection: postflight and evaluate ran before the installed test shards wrote `sdlc_worker_execution_evidence`, so every clean same-edge reprocess observed `executionEvidence: null` and selected `test_execution_evidence_missing`. | test execution evidence is the transform/system-admission result for this no-dispatch edge, not a pure consequence read model. The test command must run and write admitted `sdlc_worker_execution_evidence` before postflight/evaluate/consequence; consequence projection may remain idempotent but must not be the first writer for this target. | fixed locally: the no-dispatch installed path special-cases `test_execution_result_surface`, runs `writeTestExecutionResultSystemTransformOutput(...)` before postflight, builds the worker report from the admitted output, and leaves the consequence projection idempotent. Covered by `npm run build:semantic`, `test_t172_edge_accounting.test.mjs`, and `test_t184_handoff_partition_boundary.test.mjs`. Patch is being staged into the same sandbox install for resume. |
| LD-042 | source trace after 2026-05-31 prompt-boundary review: `operator/plugins/evaluate/prompts.ts` exact Node command blocks and `test_t181_fp_evaluator_design_register.test.mjs` exact prompt assertions | the design-depth evaluator prompt now carries kilobytes of framework-authored Node.js, including a semantic ADR-table extraction recipe, and tests bless exact prompt snippets as proof. This came from the pre-T-185 T-181/T-183/T-184 evaluator-register reliability path, not from T-185 subworkstreams. | Prompt-bearing generic edges carry admitted refs, scope, schema, and pressure; they do not own a separate prompt-template constitution. F_D may make F_P cheaper and more observable, but it cannot stand in for semantic evaluation by prescribing row derivation through prompt scripts. | open: T-187 is the controlling ticket. No new data-mapper gate proof should run until T-187 is reviewed and either implemented or explicitly accepted as a known prompt-boundary risk. |

## Current Root-Cause Note

LD-023 is not a Rust special case. It is the root inconsistency created by the
current T-184 boundary correction becoming real.

Before this refactor, F_D-created design-depth and assurance ledgers could
normalize, summarize, or accidentally mask carrier-shape drift. After LD-016
and LD-021, that path is intentionally gone: F_P evaluation constructs the
semantic design-depth carrier, while F_D only seeds nonprojectable draft rows,
admits complete fragment rows, assembles projections from admitted rows, and
writes system evidence.

The live Rust failure proves the remaining inconsistency:

- target-carrier contract says `moduleSchemaFragments[].entities[].invariants`
  is `string[]`
- the F_P evaluator wrote structured invariant objects
- the evaluator local self-check accepted the register
- system admission/closure rejected the register late
- edge summaries still reported F_P/obligation success in adjacent artifacts

The fix must therefore align the single design-depth carrier schema across the
contract, prompt, evaluator self-check, content-register row admission,
register assembly, rule-outcome persistence, and closure summary. Restoring an
F_D semantic ledger or adding a Rust-specific normalization branch would
recreate the authority violation T-184 is deleting.

## Source Walkthrough Audit

| path | current observation | verdict |
| --- | --- | --- |
| `installed_operator.ts` plugin setup | Plugin contracts, evaluator prompt bodies, evaluation-rule metadata, plugin-set construction, and declared edge-output projection now live under `operator/plugins/*`; `installed_operator.ts` retains the stateful transform/evaluate/consequence callback bodies and worker report admission, but declared edge-output writes are deferred out of dispatch and invoked from `projectConsequenceForInstalledOperatorState(...)`. | fixed for H-220, runtime consequence-stage edge-output projection, and H-230 diagnostic admission failure classification; remaining partition target is deeper callback-body ownership |
| `plugins/transform/launch_contract.ts` | Product-materialization observation/replay/manifest algorithms moved under `operator/product_materialization/*`; declared edge-output projection moved under `operator/plugins/consequence/edge_projection.ts`; the file still carries transform launch, prompt fragments, component-depth admission calls, execution evidence helpers used by transform/report evaluation, postflight helper exports, and adapter wrappers for legacy public imports. | fixed for H-040 and declared edge projection; remaining partition target is result projection, prompt semantics, and plugin/evaluator ownership |
| `plugins/consequence/edge_projection.ts` | Owns `writeDeclaredEdgeProjectionOutput(...)`, system-projected target branches, test-execution preparation projection, test-run archive projection, execution-result projection, and component-depth/release-depth projection over admitted state. | fixed for declared edge-output projection; focused T-184 source proof rejects these branches in transform launch, rejects dispatch-stage writer calls, and verifies the artifact catalog uses consequence read-model classification |
| `plugins/evaluate/postflight.ts` | evaluate/postflight imports direct helper names and no `__handoff*` aliases remain; replay now delegates through the product-materialization module behind the public wrapper. | fixed for alias and replay implementation surface; still needs deeper partition of other postflight diagnostics |
| `event_store.ts` | `appendOddSdlcRuntimeEvents(...)` now calls ABG `emit(...)` and appends only the emitted batch to `.ai-workspace/events/events.jsonl`; `readOddSdlcRuntimeEvents*` returns stored archive order and performs no replay sorting or de-duplication; behavioral proof pre-seeds existing archive bytes and verifies append preserves them exactly. | fixed and resolved for odd_sdlc event-source authority and LD-027 local replay-authority breach; ABG replay projection remains the owning layer |
| `component_depth_register.ts` | exact parser remains; fenced Markdown candidates no longer admit. | fixed for bridge admission |
| `review_grade_edge_fulfillment.ts` | review-grade required/exempt policy now delegates to operator edge-output policy. | fixed inside operator; remaining duplicate in product graph contract catalog |
| `work_category_governance.ts` | graph catalog category lookup is required; target-asset fallback removed. | fixed for live prompt governance |
| `traversal_consequence.ts` | closure/next-action projection requires selected composition identity. | fixed for live selected-composition truth |
| `assurance_gate.ts` | runtime assurance gate no longer constructs, folds, writes, or catalogs F_D assurance ledgers. | fixed for runtime authority; any remaining assurance-library tests are historical/unit surfaces and cannot feed installed-operator closure |
| `test_env/tests/*` | focused T-183/T-184 tests reject old public writer names and fenced component-depth bridges; T-151/T-158 now use admitted evaluator-register, rule-outcome, and review-grade fixtures; the full semantic suite passes. | fixed for stale full-suite fixtures; remaining proof-quality target is behavioral LD-025/LD-030/LD-032 coverage beyond source grep |

## Current Verification

- `npm run build:semantic`: pass on 2026-05-30 after the LD-027 event-store
  append/archive-truth split.
- `node --test test_env/tests/test_t184_handoff_partition_boundary.test.mjs`:
  pass, 20 tests. The event-store proof now checks raw append order, proves the
  public reader preserves archive order without local replay sorting, and proves
  later appends do not rewrite, sort, or de-duplicate existing archive truth.
- `node --test
  test_env/tests/test_t151_runner_evaluator_sovereignty.test.mjs
  test_env/tests/test_t158_consequence_admission_regression.test.mjs`: pass,
  14 tests after refreshing the synthetic F_P review-grade fixtures to current
  evaluator-register and fulfillment-binding authority.
- `npm run test:semantic`: pass, 805 tests.
- `npm run lint:semantic`: pass.
- `npm run lint:test-harness`: pass.
- Scoped `git diff --check` over the T-184/tenant files touched by this update:
  pass. Whole-worktree `git diff --check` is still blocked only by unrelated
  trailing whitespace in `.ai-workspace/comments/jim/20260509_graphfunctions_odd`.
- Fresh data-mapper live proof remains pending after the current source
  changes. The ticket is not closed.
- 2026-05-31 ticket cleanup: T-187 now owns the evaluator prompt-boundary and
  proportional Min(F_P) repair. The old LD-031/LD-038 tactical prompt-script
  fixes are not accepted as final data-mapper gate proof.

## Verification History

- `npm run build:semantic`: pass
- `npm run build:semantic`: pass after LD-036 archived-gap-dossier retry
  context and residual-pressure consolidation.
- `node --test test_env/tests/test_t120_retry_local_repair_prompt.test.mjs`:
  pass, 16 tests, including the LD-036 proof that many residual-pressure refs
  become one bounded retry instruction with raw count preserved.
- `node --test test_env/tests/test_t184_handoff_partition_boundary.test.mjs`:
  pass, 19 tests, after LD-036.
- `npm run build:semantic`: pass after LD-037 downstream review-grade carry
  pressure fix.
- `node --test test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs`:
  pass, 10 tests, proving `partial/wrong_stage` requirement carry does not
  produce same-edge review-grade pressure.
- `npm run build:semantic`: pass after LD-038 post-first-update incremental
  register prompt fix.
- `node --test test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs`: pass, 37
  tests, after LD-038. Repeated after the exact second-update command was
  added. The compiled prompt was copied into the active sandbox install and
  checksum-matched source build output.
- `npm run build:semantic`: pass after LD-039/LD-040 component-test
  materialization replay fixes.
- `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs`:
  pass, 72 tests, after LD-039/LD-040. Compiled
  `product_materialization/observation` and `plugins/transform/launch_contract`
  patches were copied into the active sandbox install and package extract.
- clean data-mapper full capability live PTY run
  `build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260528T170316953Z_pid29551`
  used `process://claude?model=sonnet&effort=high`; it closed
  through `derive_test_design_surface`, exposed LD-037 through LD-040, and is
  being resumed in the same sandbox from `derive_component_test_surface`.
- clean data-mapper full capability live PTY run
  `build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260528T154533878Z_pid86358`
  used `process://claude?model=sonnet&effort=high`, `xterm-256color`, and
  one-hour inactivity/design-depth evaluator timeouts; it was stopped after
  exposing LD-036 and is not closure proof.
- `npm run build:semantic`: pass after the LD-023/LD-026 invariant-shape and
  blocked-rule-outcome persistence fix
- `node --test
  test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs`: pass, 32
  tests, covering object-valued invariant rejection before projection write and
  blocked/accepted rule-outcome persistence source proof
- `node --test --test-name-pattern "T-184 evaluator projection rejects
  object-valued invariants before writing register truth"
  test_env/tests/test_t181_fp_evaluator_design_register.test.mjs`: pass, 1
  test, focused guard for LD-023/LD-024 admission-before-projection behavior
- `node --test --test-name-pattern "T-088 retry pressure stays linked|T-158
  retry frontier drops stale blockers|T-164 retry frontier preserves distinct
  same-code evaluated blockers|T-164 retry prompt names current evaluated
  requirement gaps"
  test_env/tests/test_t088_traversal_intent_package.test.mjs
  test_env/tests/test_t120_retry_local_repair_prompt.test.mjs`: pass, 4
  tests, proving retry packages expose `edge_closure_residual_pressure` and do
  not expose `assurance_ledger_reason`.
- `npm run build:semantic`: pass after the LD-028 blocking-reason rename.
- `node --test --test-name-pattern "T-184 retry repair instructions carry
  only reason-local evidence|T-088 retry pressure stays linked|T-164 retry
  prompt names current evaluated requirement gaps"
  test_env/tests/test_t088_traversal_intent_package.test.mjs
  test_env/tests/test_t120_retry_local_repair_prompt.test.mjs`: pass, 3
  tests, covering the LD-029 retry-cause/history split.
- `npm run build:semantic`: pass after the LD-029 retry-cause/history split.
- `npm run build:semantic`: pass after the LD-030 ABG-terminal retry
  suppression fix.
- `node --test --test-name-pattern "T-184 ABG terminal truth controls
  non-close traversal"
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs`: pass, 1
  test, covering the LD-030 rule that terminal retry evidence cannot override a
  converged edge ledger and selected close decision.
- `npm run build:semantic`: pass after the LD-031 design-depth first-write
  prompt fix.
- `node --test --test-name-pattern "T-184 F_P evaluator prompt uses
  incremental content register writes|T-184 ABG terminal truth controls
  non-close traversal"
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs`: pass, 2
  tests, covering both LD-030 terminal retry suppression and LD-031 first
  content-register write discipline.
- `node --test test_env/tests/test_t184_handoff_partition_boundary.test.mjs`:
  pass, 14 tests, after LD-030 and LD-031.
- `npm run build:semantic`: pass after LD-033 selected-evaluation residual
  pressure fold.
- `node --test
  test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs
  test_env/tests/test_t181_fp_evaluator_design_register.test.mjs`: pass, 57
  tests, covering the LD-033 rule that selected `evaluate.C/F_P` residual
  pressure prevents consequence close even when edge-local measured gain is
  otherwise close-ready.
- `npm run build:semantic`: pass after the LD-034 selected-review assessment
  pressure fix.
- `node --test
  test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs
  test_env/tests/test_t183_plugin_trace_ledger.test.mjs
  test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs
  test_env/tests/test_t181_fp_evaluator_design_register.test.mjs`: pass, 74
  tests, covering selected review-grade assessment pressure, plugin-set
  ownership, and the T-184 selected-evaluation residual-pressure fold.
- `npm run build:semantic && node --test
  test_env/tests/test_t184_handoff_partition_boundary.test.mjs
  test_env/tests/test_t172_edge_accounting.test.mjs
  test_env/tests/test_t183_plugin_trace_ledger.test.mjs
  test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
  test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs`: pass, 67
  tests, after LD-035. Covers no-dispatch projection deferral, executable
  no-dispatch edges without `worker_run`, admitted projected target carriers,
  selected review-grade pressure, and consequence closure folding.
- data-mapper full capability live PTY run was stopped manually at
  `build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260527T201905115Z_pid74878`.
  The run reached `derive_implementation_design_surface`
  (`20260527T231842411Z_pid75044`) and exposed LD-031 in the selected
  design-depth evaluator. The sandbox was installed before LD-029 through
  LD-031 landed in source, so it was no longer a valid proof vehicle after
  those fixes; process cleanup verified no remaining data-mapper, ABG screen,
  or Claude Sonnet-high PTY processes for that run.
- `npm run test:scenario:t133-hello-world-rust-live`: pass,
  `746917.065125ms`, archive
  `build_tenants/typescript/test_env/test_runs/scenario_t133_hello_world_rust_live/20260527T193824300Z_pid33429`
  - ADR edge run `20260527T193833726Z_pid33429`: design-depth evaluator
    emitted 12 semantic fragments, invariant item types are `string`,
    `Cargo.toml` stayed `build_config`, `src/main.rs` stayed `source`,
    rule outcome accepted, postflight passed, review-grade passed
    `reviewed=6 blocked=0`, closure `close`, target carrier admitted.
  - component-code edge run `20260527T194524068Z_pid33429`: postflight
    passed, review-grade passed `reviewed=14 blocked=0`, live `cargo run`
    printed `Hello, world!`, closure `close`, target carrier admitted.
- `npm run test:scenario:t164-rust-hello-service-live`: pass,
  `879893.421708ms`, archive
  `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260527T195913594Z_pid54671`
  - latest run used `local-spawn` executor (`terminalSessionId: null`), not
    PTY.
  - intent edge run `20260527T195921151Z_pid54671`: target
    `intent_surface`, F_P evaluate passed, postflight passed, assurance
    `close_allowed`.
  - implementation-design edge run `20260527T200210637Z_pid54671`: target
    `implementation_design_surface`, design-depth evaluator wrote 12 semantic
    fragments, F_P evaluate passed `fulfilled=11 blocked=0`, review-grade
    passed `reviewed=11 blocked=0`, assurance `close_allowed`.
  - component-code edge run `20260527T200840457Z_pid54671`: transform.C
    materialized `Cargo.toml`, `src/main.rs`, and
    `design/component_code_surface.md` in the installed sandbox workspace; F_P
    evaluate passed `fulfilled=18 blocked=0`, review-grade passed
    `reviewed=18 blocked=0`, assurance `close_allowed`.
  - scenario expectation verified local Rust service `GET /` response stdout
    `helloworld`.
- `npm run test:t183`: pass, 63 tests
- `node --test test_env/tests/test_t184_handoff_partition_boundary.test.mjs`: pass, 13 tests
- `node --test test_env/tests/test_t181_fp_evaluator_design_register.test.mjs`: pass, 17 tests
- `npm run lint:semantic`: pass
- `npm run lint:test-harness`: pass
- `git diff --check`: pass
- `npm run test:t180`: pass after the ABG rc.5 substrate update; current file
  is `test_t180_abg_3_9_current_staged_compute_boundary.test.mjs`
- `npm run test:t059`: pass after the ABG rc.5 install adapter update
- `npm run build:semantic && node --test
  test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs`: pass after
  the ABG rc.5 substrate binding update
- `npm run test:semantic`: pass, 799 tests, after stale F_D direct-block /
  materialization fixtures were refactored or deleted without restoring F_D
  semantic authority
- ABG/SDLC event-source strategy post:
  `.ai-workspace/comments/codex/20260527T062118Z_T184_abg_sdlc_event_source_strategy.md`
  records the 93-kind ABG `RuntimeEvent` inventory, odd_sdlc producer
  classification, and immediate event-boundary audit targets.
- data-mapper resume probe after package refresh:
  `20260527T044320358Z_pid46689` reached design-depth evaluator with fragment
  prompt but no ledger mutation after the first reads; stopped manually.
- data-mapper resume probe after empty-draft seed:
  `20260527T050000015Z_pid51394` proved immediate
  `design_depth_fp_evaluator_content_register.json` creation with selected
  composition identity, but the evaluator still delayed converting it; stopped
  manually before adding nonprojectable per-section draft rows.
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
- Stale semantic cleanup focused probes:
  `test_t066_product_materialization_contract.test.mjs`,
  `test_t115_component_execution_failure_repair_flow.test.mjs`,
  `test_t120_retry_local_repair_prompt.test.mjs`,
  `test_t123_per_edge_traversal_strategy.test.mjs`,
  `test_t135_evaluator_owned_runner_spine.test.mjs`,
  `test_t136_yield_closure_disposition.test.mjs`,
  `test_t138_traversal_consequence_replayability.test.mjs`,
  `test_t139_public_gaps_read_only_evaluator_view.test.mjs`,
  `test_t141_gtl_transform_boundary.test.mjs` through the selected
  composition fixture band, and `test_t180_abg_3_9_current_staged_compute_boundary.test.mjs`
  now pass under the current evaluate/consequence authority model. Tests that
  only preserved deleted F_D direct-block/materialization authority were
  deleted or rewritten.

## Closure Checklist

Product-law closure requires the code to match ABG and odd_sdlc
`PRODUCT.md`. Binary state:

- [x] `handoff.ts` has no public exports and is deleted or empty.
- [x] `operator/index.ts` no longer re-exports from `./handoff.js`.
- [ ] `plugins/transform/launch_contract.ts` no longer owns cross-stage result
  projection, postflight/gap dossier, repair re-entry, execution evidence, or
  evaluate-adjacent helper exports.
- [x] `.ai-workspace` runtime event persistence calls ABG `emit(...)` before
  appending to the installed event stream.
- [x] `operator/event_store.ts` does not sort, de-duplicate, rewrite, or project
  replay order from the canonical event archive.
- [ ] Per-target prompt semantics are declared by node/edge pressure or catalog
  prompt-context surfaces, not by semantic target switches in
  `plugins/transform/launch_contract.ts`.
- [x] No framework helper writes a transform output because a worker omitted it.
- [x] Product-materialization observation behavior is read-only:
  `snapshotProductMaterializationRoot(...)` and
  `observeProductMaterializationDelta*` do not write.
- [x] Product-materialization observation/replay/manifest code lives under
  `operator/product_materialization/*` rather than
  `plugins/transform/launch_contract.ts`; `launch_contract.ts` keeps adapter
  wrappers only for existing public imports.
- [x] `installed_operator.ts` does not define plugin contracts, evaluator
  prompts, evaluation rules, or plugin-set construction; it imports those from
  `operator/plugins/*`, consequence, or system modules.
- [x] Declared edge-output projection cannot be mistaken for F_D semantic
  work-surface truth: projection-only system outputs are isolated in a
  consequence/projection module, invoked from the consequence callback rather
  than dispatch, cataloged as a consequence read model, and every
  target-specific branch is driven only by declared edge-output policy.
- [ ] Generated-asset closure is proven to require selected `evaluate.C`
  evidence and selected composition identity in all production paths, not only
  core constructors.
- [x] Deterministic worker-report/admission failures are system diagnostics or
  ABG admission failures, not product semantic `blocked` authority.
- [x] Stale semantic tests that encode F_D direct blocking/materialization
  authority are refactored or deleted without restoring that authority.
- [x] `npm run build:semantic` passes.
- [x] `npm run test:t183` passes.
- [x] `npm run test:t184` exists and passes.
- [x] `npm run test:t180` passes against the current ABG rc.5 substrate.
- [x] `npm run lint:semantic` passes.
- [ ] `git diff --check` passes for the whole dirty worktree. Current scoped
  T-184 cleanup diff check passes, but full worktree check is blocked by
  unrelated trailing whitespace in
  `.ai-workspace/comments/jim/20260509_graphfunctions_odd`.
- [x] JS hello-world live is clean.
- [x] Rust server hello-world live is clean.
- [x] Full semantic suite passes, or every remaining failure is ticketed as a
  stale proof surface rather than live authority.
- [ ] Data mapper live is clean or blocks lawfully without source-specific F_D
  compensation.

## Non-Goals

- Do not rename GTL/ABG carriers.
- Do not add compatibility layers for old `handoff.ts` imports.
- Do not reintroduce deterministic semantic register population.
- Do not add JS/Rust/Scala/Python/data-mapper-specific logic to generic SDLC.
- Do not change the ABG runner contract unless a separate ABG ticket requires
  it.
