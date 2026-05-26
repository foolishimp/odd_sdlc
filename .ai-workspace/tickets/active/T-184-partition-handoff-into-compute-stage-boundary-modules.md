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
- `writeStableJsonFile(...)` is a local writer bypassing the system artifact
  boundary
- `handoff.ts` still imports `writeFileSync`

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
| H-060 | Split or delete installed-operator-owned evaluation artifacts. | no deterministic work-surface writer remains except declared execution evidence through ABG/system | planned |
| H-070 | Move gap dossier and retry diagnostic projection into `postflight/gap_dossier.ts`. | gap dossier remains diagnostic/read model; it cannot select next action directly | planned |
| H-080 | Move repair re-entry projection into consequence module. | repair action derives from closure decision plus `ActionCatalog` | planned |
| H-090 | Replace `writeOperatorArchiveFile` with direct `writeSdlcSystemArtifact` imports. | grep proves no `writeOperatorArchiveFile` export/import remains | done: source imports direct system writer and public wrapper export is removed |
| H-100 | Delete `handoff.ts` and update `operator/index.ts`. | build fails if any consumer imports `./handoff.js`; file removed | done: `operator/index.ts` exports the transform launch contract and system artifact writer directly |
| H-110 | Add raw-write audit tests for operator modules. | raw writes only in effect executors or approved product transformer/evaluator boundary | done for operator source: T-184 test rejects `writeFileSync`, `appendFileSync`, and `createWriteStream` in `operator/` |
| H-120 | Run clean JS hello-world live with PTY. | final close, no retry/block, expected CLIs/evaluator artifacts | done: clean PTY live pass at `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260525T183305414Z_pid95270`; bug fixed where design-depth evaluate.C/F_P shortened exact source paths from the admitted design artifact |
| H-130 | Run clean Rust server hello-world live with PTY. | final close, no retry/block, expected CLIs/evaluator artifacts | done: clean PTY live pass at `build_tenants/typescript/test_env/test_runs/scenario_t133_hello_world_rust_live/20260525T190915811Z_pid70152`; byproducts remain by execution policy only and are not admitted as product-file truth |
| H-140 | Run clean data mapper live with PTY. | final close or lawful block, no source-specific F_D compensations | planned |
| H-141 | Audit worker-runtime blocking reasons through the common consequence path. | `worker_output_limit_exceeded`, provider connection failures, and similar retryable process failures write diagnostics but select `retry`, not terminal `block`; hard protocol blocks remain protected | in progress: fixed closure disposition so explicit same-edge retry pressure outranks diagnostic assurance block; added `worker_connection_failed` for `ECONNRESET`/socket failures; covered by `test:t153` and `test:t184`; data-mapper live must be rerun |

## Closure Checklist

- [ ] `handoff.ts` has no public exports and is deleted or empty.
- [ ] `operator/index.ts` no longer re-exports from `./handoff.js`.
- [ ] `installed_operator.ts` imports transform launch, result projection,
  materialization, postflight, consequence, and system artifact helpers from
  their owning modules.
- [ ] No `writeFileSync` remains in `operator/` except approved process-local
  transformer/evaluator output handling if explicitly documented.
- [ ] `.ai-workspace` artifacts route through `writeSdlcSystemArtifact(...)`
  and catalog validation where applicable.
- [ ] No framework helper writes a transform output because a worker omitted it.
- [ ] No F_D installed-operator helper writes semantic work-surface truth.
- [ ] Product materialization observation is read-only and diagnostic-only.
- [ ] Generated-asset closure still requires selected `evaluate.C/F_P`
  evidence.
- [ ] `npm run build:semantic` passes.
- [ ] `npm run test:t183` passes.
- [ ] `npm run test:t184` exists and passes.
- [ ] `npm run lint:semantic` passes.
- [ ] `git diff --check` passes.
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
