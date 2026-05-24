# T-180 Migrate SDLC To ABG 3.9.0-rc.2 Staged Compute Boundary

- id: T-180
- title: Migrate SDLC to ABG 3.9.0-rc.2 staged compute boundary
- type: downstream_alignment
- ticket_category: specification_compliance
- status: completed
- proof_status: closed_live_passed
- build_tenant: typescript
- goal: migrate ODD SDLC runtime, installed product, evaluator, consequence, analyzer, and proof surfaces to ABIogenesis `3.9.0-rc.2` without preserving a second SDLC-owned execution authority
- change_class: requirement_reprice
- re_entry_point: runtime_governance
- first_missing_layer: SDLC runtime realization over ABG 3.9 RC2 staged compute categories
- upstream_gap_status: ABG `3.9.0-rc.2` exposes selected composition identity,
  compute-stage roles, selected regime bindings, compose/escalate regime roles,
  runner-consumed `fpEvaluator`, evaluation rules, composed stage tasks, and
  `consequenceProjection`. T-180 must migrate SDLC onto that executable
  substrate, without relabeling transform dispatch as evaluation or simulating
  ABG side effects
- created_at: 2026-05-23
- updated_at: 2026-05-23
- governance_scope: STDO Method / SPEC_METHOD / ODD Method / Design Module Method / TypeScript tenant
- upstream_authority:
  - `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.2/`
  - `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-144-align-abg-gtl-event-sourced-monad-and-sdlc-plugin-boundaries.md`
  - `/Users/jim/src/apps/abiogenesis/specification/requirements/gtl/REQ-L-GTL3-COMPUTE-NOTATION.md`
  - `/Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-FN-COMPOSITION.md`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/design/M03_ABG_PROBABILISTIC_MONAD_PLUGIN_BOUNDARY_DERIVATION.md`
- downstream_authority:
  - `specification/GOALS.md`
  - `specification/PRODUCT.md`
  - `specification/requirements/03-runtime-governance.md`
  - `specification/requirements/18-typed-construction-algebra.md`
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md`
- depends_on:
  - T-174
  - T-175
  - T-179

## STDO Intake

Smallest lawful re-entry point: `requirement_reprice`.

Reason: SDLC currently states the ABG/GTL compute epistemology in product and
requirement surfaces, but the runtime still depends on an ABG `3.8.0-rc.3`
installed package and bundles transform, evaluation, consequence derivation,
ledger writing, closure, and traversal continuation inside SDLC-local adapter
paths. The defect is not a small realization cleanup. It changes the required
runtime boundary and therefore enters through runtime-governance requirements,
then design, then code.

No code path may be patched as a compatibility bridge that keeps the old local
execution authority alive. Temporary readers may exist only to admit or migrate
old artifacts; they must be deletion-scheduled and must not become public
imports, carriers, closure paths, or replay truth.

## ABG Evaluate.C Composition Gate

This ticket inherits the T-144 model from ABG `3.9.0-rc.2`.

T-144 requires downstream products to implement `transform.C`, `evaluate.C`, and
`consequence.C` as separate product plugin stages with ABG.system side effects
between them. `evaluate.C` is the compute-stage category. Its implementation is
composed through GTL using the current compose/escalate syntax, then selected and
executed under ABG `abg.fn_composition` runtime authority. It is not a separate
public carrier or a hard-coded plugin name such as `fpEvaluate`.

The target shape is:

```text
evaluate.C = compose(
  F_D validate/evidence registers,
  F_P validate/judgment over transform + evidence + pressure + intent,
  F_H human_callout escalation when GTL composition requires it
)
```

The GTL composition may reduce to deterministic `F_D` evaluation when a
lawful deterministic closure/optimization contract is present. The general
ambiguous SDLC case selects `evaluate/F_P` as the semantic judgment regime.
`F_H` remains an external callout boundary; ABG admits the callout/response
carrier, and no product plugin performs human work inside the runner.

Current ABG `3.9.0-rc.2` exposes selected composition identity on
`EnginePluginInput`, `stageRole`, `computeMeans`, selected regime binding refs,
and `evaluate/F_P` bindings in `abg.fn_composition`. The visible runner plugin
and stage-set surface includes:

- `fdEvaluator`
- `fpEvaluator`
- `fpDispatch`
- `fhAdmission`
- `transformTasks`
- `evaluationRules`
- `consequenceTasks`
- `consequenceProjection`

Those names are implementation plugin kinds, not the public epistemology. T-180
must therefore prove the GTL-composed `evaluate.C` plugin stage is selected,
executed, and admitted through ABG-owned carriers and current hook/composition
machinery. It must not create an SDLC-local `evaluate.C` simulation, local ledger
writer, local closure path, or hidden second execution authority.

If SDLC cannot execute or admit a selected `evaluate/F_P` binding through the
ABG 3.9 RC2 surface without reusing `fpDispatch` as transform output, T-180 must
fail closed as a downstream migration defect or release mismatch. Passing SDLC
hello-world or producing SDLC output through the old bundled `fpDispatch` path
is not evidence for this gate.

## Release Snapshot Authority

The executable migration input is the immutable RC2 package snapshot:

- tarball:
  `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.2/abiogenesis-typescript-tenant-3.9.0-rc.2.tgz`
- sha256:
  `0c73ba5858d0ae3f0ac07d0c0603827a52e63016b2da074dc4b42eaf9be8459e`
- source commit:
  `05da497ecc46bc07c434f96e284d3e482756435d`
- release snapshot commit/tag:
  `3945c587050c6c4decc23794bb822b1babf423b8` / `v3.9.0-rc.2`

ABG source requirements, design, and T-144 explain the intended boundary, but the
RC2 package API and checksum govern what SDLC can execute in this migration. The
RC2 manifest records `sourceDirty: false` and the release note says this is not
the final tapped `3.9.0`; therefore T-180 may use RC2 as a release-candidate
migration input and proof surface, but it must not claim final public-release
closure from RC2 alone.

## Target Truth

SDLC is a downstream ODD product over ABIogenesis. SDLC owns product semantics:
software-domain graph meaning, pressure maps, gain interpretation, proof
interpretation, read-model overlays, target carrier meaning, analyzer views,
and product plugin code. SDLC does not own ABG side effects.

The SDLC execution boundary shall align to this ABG event-sourced bind chain:

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

`C`, `transform.C`, `evaluate.C`, and `consequence.C` are notation over selected
`abg.fn_composition` and ABG-admitted runtime truth. They are not a product-local
compute carrier, ledger writer, controller, traversal selector, replay engine,
or closure path.

`F_H` is external to the system. SDLC may surface a human callout through a
future human-facing system, but ABG must admit the callout boundary and response
carrier before a human result affects runtime truth.

## One Surface Truth

There shall be one truth surface for each boundary:

- ABG release truth: the TypeScript package dependency, lockfile, substrate
  contract, installer adapter, release tests, and installed package evidence all
  name ABIogenesis `3.9.0-rc.2`.
- selected composition truth: selected `abg.fn_composition` identity is consumed
  from ABG selected composition fields on `EnginePluginInput` and related RC2
  carriers. SDLC shall not synthesize selected composition identity from archive
  paths, graph-function names, edge names, or local context refs.
- transform truth: `plugin.transform.C` returns candidate/product/evidence refs.
  It does not evaluate, write ledgers, emit runtime events, close, select
  traversal, or replay continuation.
- evaluation truth: `plugin.evaluate.C` returns evaluation findings, metrics,
  residual pressure, diagnostics, evidence refs, authority refs, continuation
  refs, proposed dispositions, selected composition refs, and selected regime
  binding refs. It does not write ledgers, emit runtime events, close, select
  traversal, or replay continuation.
- composition truth: GTL composes `evaluate.C` from plugin-stage regime bindings
  and may compose `F_D`, `F_P`, and `F_H` regimes through the current
  compose/escalate syntax. ABG selects/admit this composition through
  `abg.fn_composition`. SDLC shall not treat `F_P` transform dispatch as the
  evaluation stage.
- consequence truth: `plugin.consequence.C` returns product read-model /
  consequence projection refs over ABG-admitted facts. It may be `F_D` because it
  is a deterministic projection over admitted runtime truth.
- side-effect truth: only ABG emits runtime events, admits transform/evaluation
  payloads, derives ledgers, folds assurance, derives traversal transition,
  closes, continues, corrects, and replays.
- analyzer truth: analyzer/loaders admit and render the same selected
  composition, stage, ledger, assurance, consequence, and traversal refs; raw
  artifact inspection must not be the only proof surface.

## Design Module Method

Design module: `ODD_SDLC_TYPESCRIPT_ABG_3_9_RC2_COMPUTE_STAGE_BOUNDARY`.

The design module must be materialized before implementation closure as:

- design surface: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC2_COMPUTE_STAGE_BOUNDARY.md`
- IACS: listed in that design and mirrored here only as ticket checklist
- structural carrier diagram: selected composition, transform payload,
  transform admission, evaluation findings, evaluation admission, assurance
  fold, consequence projection, traversal transition, replay continuation
- implementation plan: file/module ownership, deletion-scheduled migration
  readers, tests, and live proof
- design review: explicit confirmation that no hidden surface preserves the old
  bundled `fpDispatch` authority

### IACS

1. `AbgRc2SubstratePin`
   - source: `build_tenants/typescript/package.json`, lockfile,
     `runtime/abiogenesis_substrate.ts`, install release adapter, T-059 tests
   - authority: released ABG `3.9.0-rc.2`
   - defect if: any installed or source path still claims `3.8.0-rc.3`

2. `SdlcSelectedCompositionConsumption`
   - source: ABG RC2 selected composition fields and compute-stage binding on
     plugin invocation
   - authority: selected `abg.fn_composition`
   - defect if: SDLC calls a helper that invents `compositionRef`,
     `compositionDigest`, or `compositionSelectionRef`

3. `SdlcTransformPluginAdapter`
   - source: current worker invocation machinery and product materialization
     target contracts
   - output: candidate/product/evidence refs and transform result refs
   - non-authority: no evaluation, ledger writing, closure, traversal, replay

4. `SdlcEvaluatePluginAdapter`
   - source: ABG-admitted transform refs plus current deterministic evidence
     registers
   - output: `GtlEvaluationFindingRef[]`, `GtlEvaluation`, residual pressure
     refs, metrics, authority refs, continuation refs, proposed disposition,
     selected composition identity, and selected regime binding refs
   - compute role: `evaluate.C`
   - compute composition: selected `abg.fn_composition` evaluate-stage regime
     bindings, normally `F_D` evidence/validate -> `F_P` judgment for the
     ambiguous SDLC case, with `F_H` only as external human-callout escalation
   - optimization: `F_D` evaluation may close only under an explicit selected
     deterministic closure/optimization contract; otherwise it remains evidence
     for the selected `evaluate/F_P` judgment

5. `SdlcConsequenceProjectionPluginAdapter`
   - source: ABG-admitted transform/evaluation facts, ABG evaluation ledgers,
     assurance fold result, traversal transition refs, and SDLC read-model
     policy
   - output: product read-model/consequence projection refs
   - compute means: `F_D` unless a future product policy proves ambiguity at
     this projection boundary

6. `SdlcAnalyzerStageTruth`
   - source: admitted ABG/runtime artifacts and SDLC product projections
   - output: analyzer markdown/json showing selected composition, transform,
     evaluation, ledgers, assurance fold, consequence, traversal transition,
     replay continuation, parallel branch refs, fan-in rows, worker refs, and
     conflict sets

7. `HelloWorldRc2ProofHarness`
   - source: deterministic semantic tests followed by the live hello-world run
   - output: proof that the installed hello-world lane follows the RC2 staged
     boundary, not a bundled legacy adapter path

## Evaluate.C Composition Disambiguation

Current SDLC "evaluate" paths include deterministic postflight checks,
target-carrier admission, report parsing, edge-gain measurement, residual
pressure derivation, closure decision derivation, next-action projection, and
archive writers. Under this ticket those paths must be split:

- retained F_D evidence registers:
  - worker process result and liveness observations
  - worker result report shape/admission
  - product materialization manifest and file/materialization refs
  - deterministic postflight summaries
  - target-carrier contract admission summaries
  - edge-gain input rows and target binding evidence
  - feature/test dependency maps and T-174 frontier graph truth
- final general SDLC evaluation:
  - `plugin.evaluate.C` is selected from the current compose/escalate syntax over
    `F_D`, `F_P`, and `F_H` regime bindings
  - the ambiguous SDLC case includes an `evaluate/F_P` judgment regime
  - it consumes the admitted transform refs and the retained F_D evidence
    registers as evidence, not as closure authority
  - it emits evaluation findings and proposed dispositions for ABG admission
  - ABG writes evaluation ledgers and performs assurance fold after admission
- optimized deterministic evaluation:
  - allowed only when the graph function/edge declares a disambiguated F_D
    evaluation contract
  - must still pass through the ABG `evaluate.C` category and ABG admission
  - must not bypass the same analyzer/proof surface

If the full evidence bundle is too heavy for F_P evaluation, reduce the F_P input
to a minimal `SdlcEvaluationContext`:

1. selected composition ref/digest/selection ref and selected regime binding ref
2. transform request/result refs and worker result report ref
3. materialized file refs and product materialization manifest ref
4. deterministic postflight status, blocking reason carrier refs, and evidence refs
5. target-carrier admission status/ref and edge assurance contract ref/digest
6. T-174 dependency/frontier refs when the edge is parallel-frontier eligible
7. ABG runtime projection refs needed for causality and replay

The minimal context is an input projection, not a new source of truth.

## Current Code Paths To Refactor

- `build_tenants/typescript/package.json`
  - update `@abiogenesis/typescript-tenant` from `3.8.0-rc.3` to `3.9.0-rc.2`
- `build_tenants/typescript/package-lock.json`
  - regenerate the RC2 dependency pin
- `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts`
  - update package version, source assumptions, and exposed substrate contract
- `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`
  - update ABG release version/source ref/source commit/tarball digest/snapshot
    assertions
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - replace `plugins: { fpDispatch }` as the only live plugin surface with RC2
    compute-stage plugin wiring
  - split transform, evaluate, consequence, ABG admission, ledger writing,
    assurance fold, traversal transition, and replay continuation into the RC2
    ownership model
  - remove local post-ABG traversal consequence writing as execution authority
- `build_tenants/typescript/code/src/operator/handoff.ts`
  - keep worker prompt as `transform.C`
  - move `constructFpEvaluateResult` / `writeFpEvaluateResult` behind the RC2
    `evaluate.C` plugin boundary or delete if replaced
  - ensure prompt/response hygiene proves transform cannot see evaluation or
    ledger writer obligations
- `build_tenants/typescript/code/src/operator/composition_identity.ts`
  - delete or demote to migration-only reader after all live carriers consume
    ABG selected composition identity
- `build_tenants/typescript/code/src/start/public_start.ts`
  - stop synthesizing composition identity for initial selection; consume or
    carry ABG selection refs
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  - keep SDLC consequence as product read-model projection only
  - remove any independent closure/traversal authority
- `build_tenants/typescript/code/src/analysis/*`
  - admit and render RC2 stage truth; fail closed when required stage fields are
    missing or locally synthesized
- `build_tenants/typescript/test_env/sandbox/scenario_sandbox.mjs`
  - add staged-boundary assertions before accepting hello-world live closure
- `build_tenants/typescript/test_env/tests/test_t179_epistemology_compliance.test.mjs`
  - strengthen from notation/string checks to RC2 carrier and payload checks
- `build_tenants/typescript/test_env/tests/test_t174_feature_dependency_dag_frontier.test.mjs`
  - ensure T-174 frontier graph truth feeds ABG stage inputs and analyzer proof

## Interface Refactor Inventory

Every interface below must be reviewed. A listed interface either consumes ABG
3.9 RC2 truth, currently preserves SDLC-local execution authority, or appears on
the analyzer/install/proof surface that must show the staged boundary. Closure
requires each item to be updated, deleted, demoted to a deletion-scheduled
migration reader, or explicitly recorded as unchanged because it is already a
pure product projection.

### Upstream ABG/GTL Interfaces SDLC Must Consume

- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/gtl/m02/contracts/compute_notation.ts`
  - `GtlSelectedCompositionNotation`
  - `GtlFunctionCompositionNotation`
  - `GtlCompositionRegimeBinding`
  - `GtlComputePluginCategoryBinding`
  - `GtlTransformComputePluginCategoryBinding`
  - `GtlEvaluateComputePluginCategoryBinding`
  - `GtlConsequenceComputePluginCategoryBinding`
  - `GtlCandidate`
  - `GtlEvaluationFindingRef`
  - `GtlEvaluation`
  - `GtlAdmittedStateRef`
  - `GtlConsequenceProjectionRef`
  - `GtlEpistemicStageSet`
- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/plugins.ts`
  - `EnginePluginContract`
  - `EngineComputeStageBinding`
  - `EnginePluginInput`
  - `EngineRunnerPluginSet`
  - `FdEvaluatorPlugin`
  - `FpEvaluatorPlugin`
  - `FpDispatchPlugin`
  - `FhAdmissionPlugin`
  - `EvaluationRulePlugin`
  - `ComposedStageTaskPlugin`
  - `ConsequenceProjectionPlugin`
  - `FdEvaluationOutcome`
  - `FpEvaluationOutcome`
  - `FpEvaluationFinding`
  - `FpDispatchOutcome`
  - `FhAdmissionOutcome`
  - `ConsequenceProjectionOutcome`
- `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/evaluation_set.ts`
  - `EvaluationRuleDeclaration`
  - `EvaluationSetPlan`
  - `EvaluationRuleOutcome`
  - `EvaluationSetAdmission`
  - `EvaluationSetProjection`

### SDLC Substrate And Install Interfaces

- `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts`
  - `OddSdlcAbiogenesisExecutionBasisInput`
  - `OddSdlcAbiogenesisSubstrateReport`
  - `OddSdlcEvaluateNextPressureInput`
  - `OddSdlcEvaluateNextActionInput`
  - `OddSdlcEvaluateNextPolicyCarrier`
  - `OddSdlcEvaluateNextInput`
  - `OddSdlcEvaluateNextReport`
  - refactor target: remove local next-action/evaluate authority from substrate
    reports; substrate truth names ABG 3.9 RC2 and exposes only ABG-selected
    refs/projections.
- `build_tenants/typescript/code/src/install/carriers.ts`
  - `OddSdlcTypescriptInstallRequest`
  - `OddSdlcTypescriptRuntimeIdentity`
  - `OddSdlcTypescriptInstallManifest`
  - `OddSdlcTypescriptInstalledOutcome`
  - `OddSdlcTypescriptRejectedInstallOutcome`
  - refactor target: installed runtime identity and manifest must carry the ABG
    3.9 RC2 package, snapshot, source ref, tarball digest, and no older
    substrate alias.
- `build_tenants/typescript/code/src/install/instruction_files.ts`
  - `OddSdlcInstructionFilesInput`
  - refactor target: installed cold-agent instructions must name
    `transform.C`, `evaluate.C`, `consequence.C`, ABG side-effect ownership, and
    the external `F_H` callout boundary.
- `build_tenants/typescript/code/src/start/public_start.ts`
  - `SdlcPublicStartRequest`
  - `SdlcWorkerAttachment`
  - `SdlcExecutionContract`
  - `SdlcPublicStartOutcome`
  - internal `PublicStartActionCandidate`
  - internal `PublicStartEvaluation`
  - refactor target: public start may choose a graph/edge target, but must not
    synthesize selected composition identity or derive local evaluation/next
    action truth.

### SDLC Selected Composition Interfaces

- `build_tenants/typescript/code/src/operator/composition_identity.ts`
  - `SdlcSelectedAbgFnCompositionIdentity`
  - `deriveSdlcSelectedAbgFnCompositionIdentity`
  - `deriveFallbackSdlcSelectedAbgFnCompositionIdentity`
  - refactor target: delete as live authority or demote to a
    deletion-scheduled migration reader. Live runtime must consume selected
    composition ref/digest/selection/regime refs from ABG 3.9 RC2 carriers.
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  - every `selectedComposition`, `compositionRef`, `compositionDigest`, and
    `compositionSelectionRef` field in traversal/consequence carriers
  - refactor target: these fields must be ABG-selected inputs, not derived from
    SDLC path names, archives, graph-function names, edge names, or local
    context refs.

### SDLC Transform And Worker Interfaces

- `build_tenants/typescript/code/src/operator/carriers.ts`
  - `SdlcWorkerTransportContract`
  - `SdlcWorkerRunResult`
  - `SdlcWorkerProcessStartedContext`
  - `SdlcWorkerProcessSummary`
  - `SdlcProductMaterializationContract`
  - `SdlcExecutionShard`
  - `SdlcMaterializedProductFile`
  - `SdlcWorkerExecutionEvidence`
  - `SdlcWorkerExecutionShardEvidence`
  - `SdlcTraversalObligation`
  - `SdlcTraversalObligationPayload`
  - `SdlcTraversalObligationContext`
  - `SdlcTraversalStrategyPlan`
  - `SdlcTraversalStrategyDecision`
  - `SdlcWorkerInvocationPackage`
  - `SdlcWorkerInvocationOutputContract`
  - `SdlcWorkerInvocationRetryFrontier`
  - `SdlcWorkerConstructionBrief`
  - `SdlcWorkerBrief`
  - `SdlcWorkerHandoffManifest`
  - `SdlcWorkerResultReport`
  - refactor target: transform-side worker interfaces may carry request,
    candidate, materialization, and evidence refs only. They must not instruct
    the worker to evaluate, close, write ledgers, select traversal, or replay.
- `build_tenants/typescript/code/src/operator/handoff.ts`
  - prompt/response contract surfaces that build `SdlcWorkerConstructionBrief`,
    `SdlcWorkerHandoffManifest`, `SdlcWorkerResultReport`, and
    `SdlcFpEvaluateResult`
  - refactor target: split transform prompt hygiene from evaluation prompt
    hygiene. Any retained `SdlcFpEvaluateResult` builder must move behind
    `plugin.evaluate.C` or be deleted.

### SDLC Evaluation Register Interfaces

- `build_tenants/typescript/code/src/operator/carriers.ts`
  - `SdlcPostflightResult`
  - `SdlcWorkerObligationAssessment`
  - `SdlcPostflightGapDossier`
  - `SdlcComponentExecutionFailureRegister`
  - `SdlcComponentRepairSchedule`
  - `SdlcComponentDepthRegister`
  - `SdlcTestDesignRegister`
  - `SdlcTestDesignRegisterAdmission`
  - `SdlcTestExecutionSurfaceRegister`
  - `SdlcTestExecutionSurfaceRegisterAdmission`
  - `SdlcTestExecutionEvidenceAdmission`
  - `SdlcCoAffirmationLedger`
  - `SdlcDesignDepthRegister`
  - `SdlcDesignDepthRegisterAdmission`
  - `SdlcFpEvaluateResult`
  - refactor target: deterministic registers remain valuable `F_D` evidence
    producers, but their outputs become inputs to ABG-selected `evaluate.C`.
    They cannot be final closure authority or product-owned ABG ledger truth.
- `build_tenants/typescript/code/src/operator/test_execution_surface_register.ts`
  - test execution surface register target/type surfaces
  - refactor target: preserve as deterministic evidence registers feeding
    `evaluate.C`, not as a closure bypass.

### SDLC Evaluation, Closure, And Consequence Interfaces

- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  - `SdlcTraversalConsequenceRefs`
  - `SdlcConstructionIntent`
  - `SdlcWorksiteEvidence`
  - `SdlcEdgeFulfillmentAssessmentInput`
  - `SdlcEdgeFulfillmentCountProjection`
  - `SdlcEdgeFulfillmentLedger`
  - `SdlcYieldResumeBasis`
  - `SdlcEdgeClosureDecision`
  - `SdlcEdgeClosurePolicy`
  - `SdlcOverlaySegmentCompletion`
  - `SdlcNextActionProjection`
  - `SdlcTraversalConsequenceReplay`
  - refactor target: closure decision, fulfillment ledger, and next action must
    become ABG assurance/traversal/consequence projections or read models over
    ABG-admitted events. They must not write or select traversal independently.
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - `deriveInstalledTraversalConsequence`
  - `writeTraversalConsequenceArchive`
  - live `plugins: { fpDispatch }` runner construction
  - selected composition helper usages
  - refactor target: install operator must bind SDLC product plugins to ABG
    3.9 RC2 `transform.C`, `evaluate.C`, and `consequence.C`; ABG owns
    admission, ledgers, assurance, traversal, continuation, and replay.

### SDLC Parallel Frontier Interfaces

- `build_tenants/typescript/code/src/operator/carriers.ts`
  - `SdlcModuleDependencyMap`
  - `SdlcTestDependencyMap`
  - `SdlcDependencyTraversalSelection`
  - `SdlcFeatureDependencyDag`
  - `SdlcFeatureDependencyDagNode`
  - `SdlcFeatureDependencyDagEdge`
  - `SdlcAbgFrontierCompilation`
- `build_tenants/typescript/code/src/operator/feature_dependency_dag.ts`
  - `SdlcFeatureDependencyDagInput`
  - `SdlcFeatureDependencyDagFromMapsInput`
  - `SdlcAbgFrontierCompilationInput`
- `build_tenants/typescript/code/src/operator/live_fp_parallel_materialization_frontier.ts`
  - live F_P parallel materialization frontier record/guard
  - refactor target: T-174 frontier truth must feed ABG stage inputs as
    transform/evaluate evidence and analyzer proof. It must not become a
    separate branch/traversal execution authority.

### SDLC Analyzer And Runtime Gap Interfaces

- `build_tenants/typescript/code/src/analysis/carrier_loaders.ts`
  - `OperatorSummaryRecord`
  - `WorkerRunRecord`
  - `PostflightRecord`
  - `EdgeClosureDecisionRecord`
  - `EdgeFulfillmentLedgerRecord`
  - `NextActionProjectionRecord`
  - `ProductMaterializationManifestRecord`
  - `ProductMaterializationFileRecord`
  - `HandoffManifestRecord`
  - `FpEvaluateResultRecord`
  - `WorkerResultReportRecord`
  - `WorkerConstructionBriefRecord`
  - `LiveFpParallelMaterializationFrontierRecord`
  - `OperatorRunCarriers`
  - `OperatorRunFileSizes`
  - refactor target: loaders must admit ABG 3.9 RC2 selected composition,
    stage, evaluation-set, ledger, consequence, traversal, and replay refs;
    missing required fields fail closed.
- `build_tenants/typescript/code/src/analysis/types.ts`
  - frontier, carrier, attempt, and analyzer summary records that surface
    runtime proof
  - refactor target: analyzer summaries must expose staged truth without
    requiring raw artifact inspection.
- `build_tenants/typescript/code/src/analysis/edge_attempts.ts`
  - attempt projection and frontier summary builders
  - refactor target: derive analyzer rows from admitted ABG stage/projection
    carriers, not local SDLC closure artifacts.
- `build_tenants/typescript/code/src/analysis/runtime_gaps.ts`
  - `RuntimeCarrierLoadState`
  - refactor target: missing staged artifacts and malformed selected
    composition/evaluation/consequence refs must produce catalog-driven gaps.
- `build_tenants/typescript/code/src/analysis/render_markdown.ts`
  - markdown renderer proof surface
  - refactor target: render selected composition, transform, evaluation-set,
    ledgers, assurance fold, consequence projection, traversal transition, and
    replay continuation.

### Release And Test Interfaces

- `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`
  - ABG release version/source ref/source commit/tarball digest assertions
  - refactor target: prove install and package lock use `3.9.0-rc.2`.
- `build_tenants/typescript/test_env/tests/test_t179_epistemology_compliance.test.mjs`
  - refactor target: upgrade from document string checks to carrier checks for
    ABG selected composition and staged compute truth.
- `build_tenants/typescript/test_env/tests/test_t174_feature_dependency_dag_frontier.test.mjs`
  - refactor target: prove frontier topology feeds stage inputs and analyzer
    proof.
- new `build_tenants/typescript/test_env/tests/test_t180_abg_3_9_rc2_staged_compute_boundary.test.mjs`
  - refactor target: one focused T-180 proof lane for package pin, selected
    composition consumption, transform/evaluate/consequence separation,
    evaluation register evidence flow, analyzer admission, and fail-closed
    local synthesis.
- live/sandbox hello-world scenario harnesses
  - refactor target: final proof that the installed run follows the ABG 3.9 RC2
    bind chain and that prompt/response payloads are hygienic across
    transform/evaluate/consequence.

## SPEC_METHOD Execution Walkthrough

This section is the restart surface if a session is lost. Resume from the first
unchecked implementation item below, not from chat memory.

1. Goals
   - keep the work wave narrow: migrate the SDLC TypeScript tenant to ABG
     `3.9.0-rc.2` staged compute with one runtime execution authority.
   - do not broaden into GTL/ABG redesign; ABG RC2 is the executable substrate.

2. Intent
   - preserve SDLC as the downstream ODD product over ABG.
   - ABG owns runtime events, admission, ledgers, assurance fold, traversal,
     continuation, correction, closure, and replay.
   - SDLC owns product semantics, product plugins, pressure/gain
     interpretation, analyzer/read-model overlays, target-carrier meaning, and
     proof interpretation.

3. Product definition
   - update present-tense product wording only where the product currently
     implies SDLC-local evaluation, ledger, closure, traversal, or replay
     authority.
   - do not encode migration history in live product truth except release and
     substrate identity.

4. Requirements
   - update runtime-governance and typed-construction requirements so
     `transform.C`, `evaluate.C`, and `consequence.C` are separate product
     plugin computations selected through ABG `abg.fn_composition`.
   - require selected composition to be consumed from ABG carriers.
   - require deterministic SDLC registers to feed `evaluate.C` as evidence, not
     closure authority.
   - require F_P-formed evaluation for the general ambiguous SDLC case and
     permit F_D evaluation only under an explicit deterministic closure contract.

5. Design
   - materialize the ABG 3.9 RC2 design module named above.
   - list the structural carrier flow, IACS, interface refactor inventory,
     deletion-scheduled migration readers, and proof sequence.
   - design must route through T-175 common surfaces before adding any new local
     adapter, guard, enum, archive filename list, or effect shell.

6. Code
   - first pin ABG `3.9.0-rc.2` in package, lockfile, substrate contract, and
     T-059 install-release evidence.
   - then replace selected-composition synthesis with ABG-selected identity
     consumption.
   - then split installed operator runtime wiring into `transform.C`,
     `evaluate.C`, and `consequence.C` plugin boundaries.
   - then move retained F_D postflight/register work behind `evaluate.C` as
     evidence.
   - then demote local closure, next action, and traversal consequence to ABG
     assurance/traversal projections or read models.
   - then update analyzer/loaders/renderers through catalog/admission functions.

7. Events, projection, and delta
   - every old SDLC artifact must be classified as one of: admitted carrier,
     read model over ABG truth, deletion-scheduled migration input, or removed.
   - missing ABG RC2 selected composition, evaluation, ledger, consequence,
     traversal, or replay refs must produce fail-closed gaps.

8. Scenarios
   - run semantic and focused proof lanes before live hello-world.
   - live hello-world proves operational meaning; it does not substitute for
     carrier/admission tests.

## T-175 Compression Rule

T-175 consolidated duplicated semantic law so T-180 must not reintroduce local
parallel truth while migrating to ABG RC2. During every refactor, check for a
common-surface route in this order:

1. Carrier/domain values
   - use `build_tenants/typescript/code/src/contracts/carrier_domain_catalog.ts`
     for value domains and outcome classification.
   - do not add local string lists in analyzer, operator, public-start, prompt,
     or tests.

2. Operator-run artifacts
   - use `build_tenants/typescript/code/src/contracts/operator_run_artifact_catalog.ts`
     for archive filenames, kind refs, requiredness, roles, and gap policy.
   - do not add loader-only or producer-only artifact names.

3. Product graph and frontier policy
   - use `build_tenants/typescript/code/src/contracts/product_graph_contract_catalog.ts`
     for graph vector identity, edge policy, required artifacts, ABG-frontier
     eligibility, and T-174 proof expectations.
   - do not infer frontier behavior from path names or target basename
     heuristics.

4. Admission and guards
   - use `build_tenants/typescript/code/src/admission/*` and shared codecs for
     authoritative carrier ingress.
   - do not make analyzer/read-model code reconstruct missing authority.

5. Effects
   - use `build_tenants/typescript/code/src/effects/*` for archive/file/process
     effects.
   - do not mix semantic decision logic with file writes or process spawning.

6. Runtime gaps and analyzer projections
   - derive missing/malformed artifact gaps from catalogs and admitted carrier
     guards.
   - analyzer output is a read model over admitted carriers, not a fallback
     authority surface.

7. New abstraction test
   - add an abstraction only when it removes duplicated semantic law or routes
     more than one producer/consumer through a named common boundary.
   - otherwise keep the change local to the existing common surface.

Compression closure condition: every migrated interface in the inventory must
record whether it reused an existing T-175 common surface, extended one, or
created a new one. Any new common surface must name its producers, consumers,
admission function, effect boundary, and proof lane.

## Implementation Plan

1. Requirements and product law
   - update `specification/PRODUCT.md`, `specification/GOALS.md`,
     `specification/requirements/03-runtime-governance.md`, and
     `specification/requirements/18-typed-construction-algebra.md`
   - state RC2 selected composition and compute-stage category boundaries in
     present tense
   - remove legacy wording that lets SDLC "evaluate" imply local closure truth

2. Design module
   - create the RC2 compute-stage design surface
   - record IACS, structural carrier diagram, one-truth rules, and migration
     deletion schedule
   - include the F_P evaluation disambiguation and minimal evaluation context

3. Release pin
   - move the TypeScript tenant to ABG `3.9.0-rc.2`
   - update install/release snapshot adapter evidence
   - prove install still carries the ABG package dependency and installed
     package evidence

4. Runtime split
   - wire RC2 plugin stages from installed operator
   - make transform produce candidate/evidence refs only
   - make evaluate consume GTL-composed `evaluate.C` stage/regime bindings
     selected by ABG `abg.fn_composition`
   - if SDLC cannot execute/admit the selected `evaluate/F_P` binding through
     ABG 3.9 RC2 without reusing transform `fpDispatch`, fail closed as a
     downstream migration defect or release mismatch rather than simulating
     `evaluate.C` locally
   - make consequence produce read-model/consequence projection refs only
   - ensure ABG owns admission, events, ledgers, assurance fold, traversal,
     continuation, correction, and replay

5. Selected composition cleanup
   - replace local composition synthesis with ABG-selected identity consumption
   - fail closed when selected composition identity is absent, stale, mismatched,
     or locally synthesized on live runtime surfaces

6. F_D register preservation
   - retain current deterministic checks as evidence registers/processes
   - ensure they feed `plugin.evaluate.C` and do not directly close or traverse
   - reduce to minimal evaluation context only if full evidence payload creates
     prompt or latency risk

7. Analyzer and installed guidance
   - update carrier loaders and markdown rendering so RC2 stage truth is visible
   - update cold-agent installed instructions so workers understand
     transform/evaluate/consequence boundaries

8. Tests
   - add deterministic carrier tests for selected composition consumption
   - add negative tests for local composition synthesis and missing RC2 stage refs
   - add T-180 tests proving `evaluate.C` uses GTL-composed compose/escalate
     stage/regime bindings selected by ABG and does not relabel transform
     `fpDispatch` as evaluation
   - add a ledgered steel-thread test mirroring SDLC's multiple-ledger reality:
     runtime event ledger, payload/evidence ledger, evaluation/assurance ledger,
     consequence/read-model projection, and traversal/replay truth must all be
     ABG-owned or ABG-derived from admitted events
   - add prompt/response hygiene tests for transform/evaluate/consequence
   - add analyzer admission tests for RC2 stage truth
   - add synthetic multilane hello-world test that lints the full prompt and
     response payloads

9. Proof sequence
   - run `npm run build:semantic`
   - run `npm run lint:semantic`
   - run `npm run test:t059`
   - run focused RC2/T-180 semantic tests
   - run `npm run test:t174` if touched frontier/parallellane surfaces changed
   - only after semantic tests pass, run the live hello-world proof

## Execution Log

### 2026-05-23: RC2 Substrate Pin

Completed the first implementation slice:

- `build_tenants/typescript/package.json` now depends on the immutable ABG
  `3.9.0-rc.2` tarball.
- `build_tenants/typescript/package-lock.json` resolves
  `@abiogenesis/typescript-tenant` to `3.9.0-rc.2`.
- `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts` names
  the ABG `3.9.0-rc.2` substrate and records the staged compute source
  assumption from T-144/T-145/T-146.
- `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`
  asserts the ABG RC2 source ref, source commit, tarball digest, and snapshot
  root.

Proof:

```bash
npm run build:semantic
npm run test:t059
```

Result: `test:t059` passed 10 tests.

### 2026-05-23: Selected Composition Consumption Slice Started

Started the hidden-authority removal at the selected-composition boundary:

- added `sdlcSelectedAbgFnCompositionIdentityFromEnginePluginInput(...)` in
  `build_tenants/typescript/code/src/operator/composition_identity.ts`;
- the helper consumes ABG `EnginePluginInput.selectedCompositionRef`,
  `selectedCompositionDigest`, and `selectedCompositionSelectionRef` and fails
  closed when those refs are absent;
- `build_tenants/typescript/code/src/operator/installed_operator.ts` now carries
  ABG-selected composition identity into `SdlcAbgOwnedFpDispatchState`;
- installed traversal consequence derivation now reads selected composition from
  the ABG plugin-input-derived state instead of deriving it from
  manifest/archive context;
- added `npm run test:t180` and
  `test_env/tests/test_t180_abg_3_9_rc2_staged_compute_boundary.test.mjs`.

Proof:

```bash
npm run build:semantic
npm run test:t180
npm run test:t179
npm run test:t059
npm run lint:semantic
```

Result: `test:t180` passed 4 tests, `test:t179` passed 6 tests, and
`test:t059` passed 10 tests.

### 2026-05-23: Distinct Transform/Evaluate Plugin Wiring Started

Started splitting the installed operator away from a single bundled
`fpDispatch` plugin surface:

- `fpDispatchPluginContract()` now declares `computeStageRole: "transform"`,
  `computeMeans: "F_P"`, and `computeStagePurpose:
  "candidate_construction"`;
- added `fpEvaluatorPluginContract()` with `pluginKind: "fp_evaluator"`,
  `computeStageRole: "evaluate"`, `computeMeans: "F_P"`, and
  `computeStagePurpose: "candidate_evaluation"`;
- added `fpEvaluationOutcomeForDispatchState(...)` so the installed operator
  can return an ABG `FpEvaluationOutcome` from admitted transform/evidence
  state instead of relying on transform dispatch output as evaluation truth;
- `runEngineIterateAsync(...)` now receives `plugins: { fpDispatch,
  fpEvaluator }`.

Proof:

```bash
npm run build:semantic
npm run test:t180
npm run test:t179
npm run test:t059
npm run lint:semantic
npm run lint:test-harness
```

Result: `test:t180` passed 5 tests, `test:t179` passed 6 tests, and
`test:t059` passed 10 tests.

Remaining selected-composition work:

- `public_start.ts` no longer publishes a live selected-composition truth. Its
  local helper is demoted to `deriveSdlcPreRuntimePlanningCompositionIdentity`
  and is limited to pre-runtime public-start planning projections before ABG
  opens the selected `EnginePluginInput`.
- `handoff.ts` no longer derives selected composition for
  `SdlcFpEvaluateResult`. The writer now requires the ABG-selected composition
  identity supplied from the `evaluate.C` plugin invocation.
- `traversal_consequence.ts` keeps only migration/replay support through
  `deriveLegacyReplayOnlySdlcSelectedAbgFnCompositionIdentity`. Live runtime
  callers pass ABG-selected identity and fail closed on drift.

### 2026-05-23: Consequence.C, Analyzer Truth, And ABG Assurance Alignment

Closed the remaining RC2 staged-boundary blockers before live proof:

- `installed_operator.ts` now wires all three product plugin stages into
  `runEngineIterateAsync`: `fpDispatch` for `transform.C`, `fpEvaluator` for
  `evaluate.C`, and `consequenceProjection` for `consequence.C`.
- `consequenceProjection` consumes ABG-selected composition identity from
  `EnginePluginInput`, rejects selected-composition drift, writes the SDLC
  consequence/read-model archive as a deterministic product projection, and
  returns ABG `ConsequenceProjectionOutcome` refs.
- `evaluate.C` now emits an ABG `FpEvaluationOutcome` whose authority surface
  includes the ABG-selected expected assessment refs. This aligns the final
  evaluation authority snapshot with prior transform evidence rows and prevents
  valid transform evidence from becoming ABG orphan evidence during assurance
  fold.
- `evaluate.C` evidence is compacted to the source projection plus canonical
  `fp_evaluate_result.json`; the richer SDLC postflight, worker, gap, and
  consequence evidence remains diagnostic input instead of multiplying ABG
  evidence rows.
- the graph module publishes default `abg.fn_composition` declarations for SDLC
  graph vectors so RC2 selected composition is declared before runner
  invocation.
- the operator-run artifact catalog, carrier loaders, edge-attempt projection,
  analyzer types, and markdown renderer now admit and render RC2 stage truth for
  `gtl_admitted_state_ref`, `gtl_consequence_projection_ref`, selected
  composition identity, evaluate.C, consequence.C, and drift/missing/malformed
  states.

Proof:

```bash
npm run build:semantic
npm run test:t180
npm run test:t179
npm run test:t059
npm run lint:semantic
npm run lint:test-harness
npm run test:t174
npm run test:t066
```

Result: all commands passed. `test:t180` passed 7 tests, `test:t179` passed 6
tests, `test:t059` passed 10 tests, `test:t174` passed all DAG/frontier,
synthetic multilane, and sandbox frontier lanes, and `test:t066` passed 105
tests including the installed data-mapper successor regression.

### 2026-05-23: Live Hello-World Preflight Repair

The first GPT-5.3-Codex-Spark live hello-world proof reached the RC2 staged
plugin path but stopped at postflight with `tenant_stack_authority_missing`.
Root cause was generic handoff routing: the evaluator reads tenant stack
authority only from the tenant `spec/` authority surface, but the narrowed
steel-thread write roots exposed only the operator archive, design output, and
declared source/test files. The worker therefore embedded tenant-stack JSON
inside `component_depth_register`, which is not the authority surface and must
not become a second truth.

Fix:

- `handoff.ts` now exposes `build_tenants/<tenant>/spec` as an allowed write
  root only when product authority reconciliation reports
  `tenant_stack_authority_missing` or `tenant_stack_authority_invalid`.
- the worker prompt now names `build_tenants/<tenant>/spec/TECH_STACK.json` as
  the canonical tenant stack repair target and explicitly forbids embedding
  tenant-stack authority in `component_depth_register`, target-carrier payloads,
  worker reports, or runtime archives.
- `test_t143_product_materialization_authority_targets` adds a regression for
  scoped materialization repair routing through the canonical tenant spec
  surface.

Additional proof after the repair:

```bash
npm run build:semantic
node --test test_env/tests/test_t143_product_materialization_authority_targets.test.mjs
npm run test:t180
npm run test:t066
npm run lint:semantic
npm run lint:test-harness
git diff --check
```

Result: all commands passed. The live proof remains pending after this repair.

### 2026-05-23: Parser Drift Repair And Live Closure

The next live run exposed a second generic defect before closure: the
design-depth evaluator parsed a Product File Targets table shaped as
`role | file | expected behavior` by treating the role cell (`source`, `test`)
as the target path. That allowed a valid ADR to drift into
`build_tenants/<tenant>/source` instead of the fixture/product authority path
`build_tenants/<tenant>/src/hello.js`.

Fix:

- `design_depth_register.ts` now recognizes `file` as a path-column header and
  cleans Markdown code-span cells before admitting file target rows.
- `test_t172_staged_target_carrier_contract` now proves role/file Product File
  Target tables admit `src/index.ts` and `test/index.test.ts` paths instead of
  role labels.
- the T-132 live scenario proof no longer expects worker-authored execution
  evidence inside `worker_result_report.json`; that report is
  framework-generated from observed artifacts. Executable proof is now a
  sandbox process check over the generated tenant: `node src/hello.js` and
  `node --test test/hello.test.js`.

Live proof:

```bash
ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_WORKER='process://codex?model=gpt-5.3-codex-spark' \
  npm run test:scenario:t132-hello-world-js-live:pty
```

Result: passed in 163.4s.

Live run root:

```text
build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260523T085037520Z_pid36961
```

Observed closure evidence:

- `derive_lite_design_adr_surface` passed.
- first `derive_lite_component_code_surface` re-entered with
  `tenant_stack_authority_missing`, exposed
  `build_tenants/hello_world_javascript/spec`, and materialized canonical
  `spec/TECH_STACK.json`.
- second `derive_lite_component_code_surface` passed with declared product
  targets `src/hello.js` and `test/hello.test.js`.
- scenario process checks passed for `node src/hello.js` and
  `node --test test/hello.test.js`.

Final verification:

```bash
npm run build:semantic
npm run test:t172
node --test test_env/tests/test_t143_product_materialization_authority_targets.test.mjs
node --test test_env/tests/test_t180_abg_3_9_rc2_staged_compute_boundary.test.mjs
node --test test_env/tests/test_t066_product_materialization_contract.test.mjs
npm run lint:semantic
npm run lint:test-harness
git diff --check
```

Result: all commands passed. `test:t172` passed 55 tests, `test:t143` passed 27
tests, `test:t180` passed 7 tests, and `test:t066` passed 105 tests.

## Closure Checklist

- [x] ABG TypeScript package pin is `3.9.0-rc.2` in package, lockfile,
      substrate contract, release adapter tests, and installed package evidence.
- [x] Design module exists and passes design-method review.
- [x] Runtime calls RC2 compute-stage plugins rather than a single bundled
      `fpDispatch` adapter path.
- [x] `evaluate.C` is composed through GTL stage/regime bindings using the
      current compose/escalate syntax, then selected/admitted by ABG
      `abg.fn_composition`; no SDLC-local simulation of `evaluate.C` is
      introduced.
- [x] Tests prove transform `fpDispatch` output cannot be relabeled as
      evaluation truth.
- [x] Tests prove SDLC's multiple ledger surfaces are projections over
      ABG-admitted events, not product-written runtime truth.
- [x] `plugin.transform.C` cannot evaluate, write ledgers, close, select
      traversal, or replay.
- [x] `plugin.evaluate.C` is F_P-formed for the general SDLC ambiguity case and
      produces findings/proposed dispositions only.
- [x] Current F_D postflight/register processes are preserved as evidence inputs,
      not final closure authority.
- [x] `plugin.consequence.C` is a deterministic product read-model projection
      over ABG-admitted facts.
- [x] ABG owns transform admission, transform ledgers, evaluation admission,
      evaluation ledgers, assurance fold, traversal transition, replay
      continuation, correction, and closure.
- [x] SDLC no longer synthesizes selected `abg.fn_composition` identity on live
      runtime surfaces.
- [x] Analyzer admission fails closed on missing RC2 selected composition,
      stage, ledger, assurance, consequence, traversal, or replay refs.
- [x] Installed cold-agent guidance names the three plugin stages and ABG system
      side-effect boundary.
- [x] T-174 frontier truth feeds ABG stage input and analyzer proof for
      parallel hello-world.
- [x] Deterministic semantic tests pass.
- [x] Live hello-world proof passes after semantic tests.

## Proof Commands

Run in `build_tenants/typescript` after implementation:

```bash
npm run build:semantic
npm run lint:semantic
npm run test:t059
npm run test:t179
npm run test:t174
npm run test:t180
npm run test:scenario:t132-hello-world-js-live
```

If the implementation changes the intended closure proof to the four-lane
parallel hello-world lane, run this after the same semantic tests:

```bash
npm run test:scenario:t174-four-lane-hello-world-js-live
```

## Closure Law

T-180 closes only when SDLC has one execution authority: ABG. SDLC plugins
compute product values or product read-model refs. ABG admits those values,
writes runtime events and ledgers, folds assurance, selects traversal, continues,
corrects, closes, and replays. Passing hello-world output is not sufficient; the
proof must show the RC2 bind chain and fail closed if the old bundled SDLC
adapter path is restored.
