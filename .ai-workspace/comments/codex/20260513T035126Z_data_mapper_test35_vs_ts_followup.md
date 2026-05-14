# Data Mapper Test35 vs TS Steel-Thread Follow-Up

**Date**: 2026-05-13  
**Author**: Codex  
**Status**: commentary / follow-up analysis  
**Related prior post**: `.ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md`

## Claim

The 2026-05-12 TS data-mapper steel-thread run did not meet the success measure from the test35 reference: completeness of working code according to spec.

It closed the materialization carrier shape for one component edge, not the executable product behavior. The decisive difference is not just scope. The decisive difference is that the TS closure allowed `passed` with no governed execution evidence.

## Compared Traversals

### test35 reference traversal

Workspace:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`

Traversal:

`derive_code_surface -> code_surface`

Representative artifacts:

- `.ai-workspace/fp_manifests/derive_code_surface_20260419T115454125068Z.json`
- `.ai-workspace/fp_results/derive_code_surface_20260419T115454125068Z.json`
- `.ai-workspace/fp_ledgers/derive_code_surface_20260419T115454125068Z.json`
- `build_tenants/scala_spark/test_env/50-generated-run-archive.md`

### TS steel-thread traversal

Archive:

`/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/data_mapper_steel_thread_sandbox/20260512T170956378Z_pid24944`

Traversal attempts:

- first attempt: `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T175634655Z_pid54035`
- retry attempt: `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T181144281Z_pid54035`

Representative artifacts:

- `worker_prompt.md`
- `worker_invocation_package.json`
- `product_materialization_manifest.json`
- `fp_evaluate_result.json`
- `sdlc_edge_fulfillment_ledger.json`
- `sdlc_edge_closure_decision.json`
- `sdlc_overlay_segment_completion.json`

## Ledger Comparison

### test35 ledger sample

From:

`.ai-workspace/fp_ledgers/derive_code_surface_20260419T115454125068Z.json`

```json
{
  "edge": "derive_code_surface",
  "target_asset": "code_surface",
  "expected_count": 77,
  "fulfilled_count": 77,
  "missing_count": 0,
  "extra_count": 0,
  "carry_converged": true,
  "fulfillment_converged": true,
  "admitted": true,
  "edge_converged": true,
  "obligation_source_kind": "requirement_surface",
  "fulfillment_rule": "behavioral_code_realization",
  "evidence_policy": "behavioral_code_evidence",
  "certification_scope": "edge"
}
```

The important part is the ledger policy:

```json
{
  "declaration_family": "adapter_driven",
  "obligation_source_kind": "requirement_surface",
  "obligation_source_ref": "requirement_surface",
  "obligation_kind": "requirement",
  "carry_rule": "deterministic_requirement_membership",
  "fulfillment_rule": "behavioral_code_realization",
  "evidence_policy": "behavioral_code_evidence",
  "obligation_source_admission_basis": "authority_or_current_surface",
  "derivation_rule": "implementation_code_projection",
  "certification_scope": "edge",
  "adapter_ref": "odd_sdlc.traceability:declared_requirement_edge_gap"
}
```

Interpretation:

The test35 ledger did not merely count worker assertions. It carried a declared requirement set from `requirement_surface`, checked deterministic membership, and required behavioral code realization evidence. Its Python ingestion path wrote a published fulfillment ledger and computed:

```python
edge_converged = carry_converged and fulfillment_converged and admitted
```

The later run archive then supplied execution evidence:

```text
Execution state: passed - sbt test completed 2026-04-19
Requirements covered by planned allocation: 77 / 77
Requirements with realized test source: 77 / 77
Requirements with execution evidence: 77 / 77
ScalaTest test methods executed: 181
ScalaTest test methods passed: 181
ScalaTest test methods failed: 0
```

### TS ledger/evaluate sample

From:

`workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T181144281Z_pid54035/fp_evaluate_result.json`

```json
{
  "status": "passed",
  "postflightStatus": "passed",
  "executionEvidenceStatus": null,
  "obligationAssessmentCounts": {
    "total": 55,
    "fulfilled": 55,
    "partial": 0,
    "blocked": 0,
    "unassessed": 0
  },
  "blockingReasons": []
}
```

From:

`workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T181144281Z_pid54035/sdlc_edge_fulfillment_ledger.json`

```json
{
  "edgeRef": "edge://odd-sdlc/derive_component_code_surface/0",
  "admitted": true,
  "targetCertificationPassed": true,
  "fdRecheckPassed": true,
  "counts": {
    "expected": 55,
    "fulfilled": 55,
    "partial": 0,
    "blocked": 0,
    "unfulfilled": 0,
    "missing": 0,
    "extra": 0
  },
  "assessmentCount": 55,
  "materializationRefs_count": 53,
  "downstreamPressureRefs": [],
  "downstreamTargetBindingRefs": []
}
```

From:

`workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T181144281Z_pid54035/sdlc_overlay_segment_completion.json`

```json
{
  "kind": "sdlc_overlay_segment_completion",
  "stopDisposition": "product_converged",
  "remainingGraphPressureRefs": [],
  "remainingRequirementPressureRefs": []
}
```

Interpretation:

The TS ledger has the newer carrier structure, but this run admitted closure without execution evidence. `targetCertificationPassed` meant postflight materialization checks passed. It did not mean `sbt compile` or `sbt test` was admitted. The edge can therefore close while the emitted source still contains a `NotImplementedError`.

This is the concrete false-positive class:

`source files exist + lineage tags parse + worker obligation assessments say fulfilled -> passed`

The missing gate is:

`declared executable code contract -> compile/test execution evidence admitted`

## Prompt Construction Difference

### test35 prompt shape

The test35 prompt was a full code-surface prompt. It named the current edge and target directly:

```text
Edge: derive_code_surface
Source asset: implementation_module_surface x implementation_stack_profile
Target asset: code_surface
Status: converged
```

It carried all relevant upstream surfaces as environment:

```text
requirement_surface [required]
implementation_stack_profile [required]
implementation_module_surface [required]
code_surface [provided]
test_design_surface [carried]
test_stack_profile [carried]
test_module_surface [carried]
test_run_archive_surface [carried]
```

It declared the obligation policy:

```text
DECLARED OBLIGATION LEDGER POLICY
declaration_family=adapter_driven
obligation_source_ref=requirement_surface
certification_scope=edge
carry_rule=deterministic_requirement_membership
fulfillment_rule=behavioral_code_realization
evidence_policy=behavioral_code_evidence
```

It supplied 77 declared fulfillment obligations from the requirement surface. The agent was asked to continue from current workspace truth and reduce the unresolved gap. Later retries were often ledger-carry retries after the code surface already had real behavior.

### TS prompt shape

The TS prompt was a component materialization prompt:

```text
Outcome: edge=derive_component_code_surface; target=component_code_surface; materialization=required
Product materialization is REQUIRED for this edge.
Included modules for this edge: cdme-compiler.
Deferred modules are lineage only for this edge; do not create or modify their files:
cdme-assurance, cdme-executor, cdme-adjoint, cdme-accounting, cdme-fidelity, cdme-engine.
Required roles: source.
Build/test contracts: sbt compile / sbt test.
Declared product file targets: none.
Product authority reconciliation: missing; reasons: declared_product_file_targets_missing.
```

The invocation package confirms the bounded scope:

```json
{
  "edgeName": "derive_component_code_surface",
  "targetAssetType": "component_code_surface",
  "featureScope": {
    "mode": "steel_thread",
    "includedModuleNames": ["cdme-compiler"],
    "deferredModuleNames": [
      "cdme-assurance",
      "cdme-executor",
      "cdme-adjoint",
      "cdme-accounting",
      "cdme-fidelity",
      "cdme-engine"
    ]
  },
  "outputContract": {
    "requiredRoles": ["source"],
    "declaredProductFileTargets": [],
    "buildExecutionContract": "sbt compile",
    "testExecutionContract": "sbt test"
  },
  "productMaterializationAuthority": "missing",
  "requirementTraceCount": 20
}
```

The prompt contained the build/test contract as text, but the runtime did not make the contract a closure gate for `derive_component_code_surface`. This is why the worker could satisfy the retry by generating source files and tags without proving executable behavior.

## Code Construction Difference

### test35 code shape

Counts:

```text
105 main Scala files
35 test Scala files
7 modules with product source
181 ScalaTest methods passed
```

Representative implementation:

`build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/TopologicalCompiler.scala`

```scala
final class TopologicalCompiler(epoch: String) {
  private val adjacency: mutable.Map[String, mutable.ListBuffer[MorphismDescriptor]] =
    mutable.Map.empty

  private val morphismIndex: mutable.Map[(String, String), mutable.ListBuffer[MorphismDescriptor]] =
    mutable.Map.empty

  def registerMorphism(descriptor: MorphismDescriptor): Either[CdmeError, Unit] = {
    for {
      _ <- validateCardinality(descriptor)
      _ <- validateEntitiesNonEmpty(descriptor)
    } yield {
      adjacency
        .getOrElseUpdate(descriptor.fromEntity, mutable.ListBuffer.empty)
        .append(descriptor)
      morphismIndex
        .getOrElseUpdate((descriptor.fromEntity, descriptor.toEntity), mutable.ListBuffer.empty)
        .append(descriptor)
    }
  }

  def compilePath(from: String, to: String, policy: RbacPolicy): Either[CdmeError, CompiledPath] = {
    ...
  }
}
```

This is real behavior: mutable registry, validation, path search, RBAC decision collection, typed errors, and executable tests.

### TS code shape

Counts:

```text
52 main Scala files
0 test Scala files
only cdme-compiler source materialized
6 modules deferred
```

Representative emitted file:

`build_tenants/scala_spark/cdme-compiler/src/main/scala/cdme/compiler/Compiler.scala`

```scala
// requirement:workspace.stage_03_ai_requirements.req_ai_001
// requirement:workspace.stage_03_ai_requirements.req_ai_003
// ...
package cdme.compiler

final case class Compiler(
  entityRegistry:               cdme.compiler.topology.EntityRegistry,
  morphismRegistry:             cdme.compiler.topology.MorphismRegistry,
  accessControlBinder:          cdme.compiler.topology.AccessControlBinder,
  typeRegistry:                 cdme.compiler.types.TypeRegistry,
  semanticCastBinder:           cdme.compiler.types.SemanticCastBinder,
  typeUnifier:                  cdme.compiler.types.TypeUnifier,
  pathResolver:                 cdme.compiler.path.PathResolver,
  grainSafetyChecker:           cdme.compiler.path.GrainSafetyChecker,
  lineageAnchorEmitter:         cdme.compiler.path.LineageAnchorEmitter,
  multiGrainFormulator:         cdme.compiler.path.MultiGrainFormulator,
  adjointInterfaceBinder:       cdme.compiler.adjoint.AdjointInterfaceBinder,
  adjointClassifier:            cdme.compiler.adjoint.AdjointClassifier,
  selfAdjointDetector:          cdme.compiler.adjoint.SelfAdjointDetector,
  adjointCompositionValidator:  cdme.compiler.adjoint.AdjointCompositionValidator,
  cardinalityBudgetBinder:      cdme.compiler.cost.CardinalityBudgetBinder,
  skewSamplerStub:              cdme.compiler.cost.SkewSamplerStub,
  topologicalValidityChecker:   cdme.compiler.ai.TopologicalValidityChecker,
  dryRunEntryPoint:             cdme.compiler.ai.DryRunEntryPoint
)

object Compiler {
  def default: Compiler = throw new NotImplementedError(
    "Compiler.default - concrete cluster wiring deferred to a downstream code-emit re-entry"
  )
}
```

This is a component API/signature shell with lineage tags. It is useful as a scaffold, but it is not equivalent to the test35 working implementation.

## Retry Difference

### test35 retry class

test35 had retry pressure, but the representative late retry was an obligation-ledger carry issue after substantial code/test behavior existed. The worker result assessed 77 requirements fulfilled, and the run archive later proved 181 tests passed.

The problematic test35 loop was noisy F_D/ledger carry pressure. It did not mean the product code was empty.

### TS retry class

The TS first attempt failed postflight because it did not materialize product source:

```json
{
  "status": "blocked",
  "postflightStatus": "blocked",
  "executionEvidenceStatus": null,
  "obligationAssessmentCounts": {
    "total": 55,
    "fulfilled": 55,
    "partial": 0,
    "blocked": 0,
    "unassessed": 0
  },
  "blockingReasons": [
    "materialized_product_role_missing:source",
    "materialized_product_requirement_lineage_missing"
  ]
}
```

The retry repaired exactly those carrier/materialization defects:

- source-role files existed
- product file lineage tags existed
- all current requirement lineage IDs appeared somewhere
- byte counts and digests matched

It did not repair or prove:

- compile success
- test success
- behavior matching requirements
- absence of stubs
- full data-mapper product completeness

## Functional Difference

The TS run should be read as:

`bounded compiler-component scaffold with lineage tags`

It should not be read as:

`data_mapper product converged`

The overlay/closure carrier saying `product_converged` is therefore overclaiming for this archive.

## Bugs / Design Gaps Exposed

1. `derive_component_code_surface` does not treat declared build/test contracts as closure gates.

   The worker prompt says `sbt compile / sbt test`, but `fp_evaluate_result.json` can still pass with `executionEvidenceStatus: null`.

2. Materialization postflight is too strong relative to its evidence and too weak relative to product correctness.

   It can prove source files exist, are under the tenant root, carry lineage IDs, and match digests. It cannot prove those files implement behavior.

3. Overlay segment completion can overclaim product convergence.

   A steel-thread component pass with six deferred modules should be `overlay_segment_complete` or `overlay_segment_complete_pending_execution`, not `product_converged`.

4. Missing product materialization authority drove inference.

   `declaredProductFileTargets: []` and `productMaterializationAuthority: missing` left the worker to infer topology. This produced a broad component skeleton rather than a minimal executable slice.

5. Prompt construction shifted from behavioral product build to carrier-compliance repair.

   The test35 prompt emphasized full code-surface behavior over 77 requirements. The TS retry prompt emphasized repairing source role and lineage defects for a scoped component.

## Proposed Fix Direction

1. For executable code-materialization edges, make execution evidence first-class when `buildExecutionContract` or `testExecutionContract` is declared.

   A result with `executionEvidenceStatus: null` should not close as `passed` for code edges. It should yield or block with a typed reason such as `test_execution_evidence_missing` or `build_execution_evidence_missing`.

2. Split overlay segment closure from product closure.

   `derive_component_code_surface` under a steel-thread overlay can close the segment, but it must preserve remaining graph/requirement pressure when modules are deferred or execution evidence is absent.

3. Require declared product target inventory or fail/yield with typed pressure.

   If product target inventory is missing, the worker can propose target topology, but closure should not treat inferred target topology as admitted product authority unless an admitted carrier records it.

4. Add analyzer checks to T-161/run analysis.

   The read-only analyzer should flag:

   - `fp_evaluate_result.status == "passed"` with `executionEvidenceStatus == null` on executable code edges
   - `sdlc_overlay_segment_completion.stopDisposition == "product_converged"` with deferred modules or remaining product graph pressure
   - source files containing `NotImplementedError`, `???`, or deferred implementation markers
   - `declaredProductFileTargets: []` on a materialization-required code edge
   - zero test files after a code-materialization edge that declares `sbt test`

## Closure Statement

The current TS data-mapper archive is useful evidence for materialization-lineage mechanics, not evidence that data_mapper has been built to the test35 standard. The follow-up bug is not that the worker needed a retry. The bug is that the retry was allowed to close on carrier repair without executable-code proof.

## Test35 Contract Axioms

1. Requirement Authority Axiom

   The closed obligation set for a code edge is derived from the live `requirement_surface`, not from worker preference, prompt inference, or emitted file structure.

2. Declared Edge Axiom

   Every constructive pass names its edge, source assets, target asset, fulfillment rule, evidence policy, and certification scope before work begins.

3. Deterministic Obligation Axiom

   The system must compute the expected obligation set deterministically from admitted authority. The worker may satisfy obligations; it may not define them.

4. Behavioral Fulfillment Axiom

   A requirement is fulfilled only by realized behavior in product code or tests. File existence, lineage tags, summaries, and worker assertions are not behavioral fulfillment.

5. Execution Evidence Axiom

   If an edge declares executable code or tests, closure requires governed execution evidence for the declared build/test contract, or a typed pending/failed/blocking state.

6. Test Evidence Axiom

   Test source is not enough. The system must distinguish planned test coverage, realized test source, and executed test evidence.

7. Ledger Closure Axiom

   Edge convergence is computed, not asserted:

   ```text
   edge_converged = carry_converged
                 && fulfillment_converged
                 && admitted
   ```

8. Admission Axiom

   Evidence only affects closure after deterministic admission. Raw worker output is proposed evidence until ingested, checked, and admitted.

9. Materialization Non-Sufficiency Axiom

   Product files under the right root with correct digests and requirement tags prove materialization shape. They do not prove product behavior.

10. No Null Evidence Pass Axiom

    A code or test edge with declared execution contracts cannot close as `passed` while execution evidence is absent or null.

11. Stub Rejection Axiom

    Stubs, deferred implementations, `NotImplementedError`, `???`, and equivalent markers cannot satisfy behavioral code realization unless the declared target is explicitly a scaffold, not executable product behavior.

12. Scope Honesty Axiom

    A bounded component or steel-thread pass may close only its declared segment. It cannot claim full product convergence while graph, requirement, module, asset, or execution pressure remains.

13. Retry Semantics Axiom

    Retry repairs typed residual gaps. A retry that repairs carrier shape but does not repair behavioral or execution evidence cannot promote the edge to product convergence.

14. Projection Truth Axiom

    Dashboards, summaries, prompts, and comments are read models. Closure truth comes from admitted ledgers, events, execution evidence, and runtime projections.

15. Parity Axiom

    A TS run reaches test35 parity only when it can show the same contract shape: declared requirement obligations, behavioral code realization, realized tests, executed tests, admitted evidence, and computed convergence over the full intended scope.

## Test35 Axiom Differential Against Current TS Archive

This table compares the test35 contract against the 2026-05-12 TS data-mapper steel-thread archive reviewed above. It distinguishes TS platform capability from what this path actually used.

| # | Test35 axiom | TS status in reviewed archive | Current TS realization | Computation detail / missing or misplaced computation | Differential / false equivalence |
| ---: | --- | --- | --- | --- | --- |
| 1 | Requirement Authority | Partial | `worker_invocation_package.json` carries inline obligations and `requirementTraceObligationIds`; worker report carries obligation assessments. | Required: `O = derive_obligations(requirement_surface, edge_policy)`, then compute a governed fulfillment metric or verdict for each obligation from admitted evidence. Current TS: `TagObserved(file, REQ-X) + WorkerClaim(REQ-X, fulfilled) -> fulfilled count`. Missing: authority-derived edge membership, an admitted metric function, and evidence-to-verdict evaluation. | TS has requirement IDs in the carrier, but the edge does not reproduce the full `requirement_surface` obligation ledger. Requirement tags and worker assessments are being mistaken for requirement-authority closure. |
| 2 | Declared Edge | Equivalent structurally | TS declares edge, target, source assets, output contract, feature scope, materialization role, and build/test contract in handoff/invocation carriers. | Required: edge declaration selects the closure predicate: source assets, target asset, fulfillment rule, evidence policy, certification scope. Current TS: the carrier declares those surfaces, but the active predicate is component materialization, not full behavioral code-surface realization. Misplaced computation: using the wrong edge contract as if it were equivalent. | The declaration is real, but it declares `derive_component_code_surface -> component_code_surface`, not test35's full `derive_code_surface -> code_surface` behavioral contract. Same carrier shape, different edge contract. |
| 3 | Deterministic Obligation | Partial | TS computes obligation sets and ledgers for the current edge and records counts in `sdlc_edge_fulfillment_ledger.json`. | Required: expected obligations are a deterministic projection from authority and edge policy. Current TS: expected count is scoped by steel-thread/component selection and can close through worker assessment rows. Missing: deterministic full-surface membership comparison, `expected_ids(requirement_surface) == carried_ids(edge_ledger)`, for the intended product scope. | The expected set is scoped to the component/steel-thread path and can be satisfied by report assertions plus lineage. It is not yet the deterministic full requirement-surface membership used by test35. |
| 4 | Behavioral Fulfillment | Missing | TS records all worker obligation assessments as fulfilled and admits materialized files. | Required: `verdict[o] = evaluate_fulfillment_rule(o, admitted_behavioral_evidence)`. Current TS: `workerAssessment.fulfilled` is folded as fulfillment. Missing: a semantic/behavioral evaluator that maps code and tests to requirement satisfaction. | The archive has no governed behavioral proof that the emitted Scala implements the requirements. It closes over declared fulfillment and carrier shape, not behavior. |
| 5 | Execution Evidence | Missing in this path | Prompt and invocation package name `sbt compile / sbt test`; TS source has execution-evidence carriers for some paths. | Required: declared execution contract creates an evidence obligation, `ExecutedDeclaredContract(e)`. Current TS: contract text is present in the prompt/package, but no admitted `SdlcWorkerExecutionEvidence` is required for close. Missing: closure rule `executionEvidenceStatus != null && status == succeeded`. | The reviewed edge still passed with `executionEvidenceStatus: null`. The infrastructure exists in parts of TS, but this `derive_component_code_surface` path did not make execution evidence a closure gate. |
| 6 | Test Evidence | Missing | No test Scala files were materialized in the reviewed archive. | Required: compute three separate states: planned coverage, realized test source, executed test evidence. Current TS archive computes none for the component edge. Missing: test-module materialization, test discoverability under `sbt test`, and test-run archive admission. | Test35 distinguishes planned coverage, realized test source, and executed test evidence. This archive has none of the executed-test proof and should not be read as product behavior closure. |
| 7 | Ledger Closure | Partial | TS writes `sdlc_edge_fulfillment_ledger.json`, `sdlc_edge_closure_decision.json`, and `sdlc_next_action_projection.json`. | Required: `edgeConverged = carry && fulfillment && admitted && targetCertification && fdRecheck`, with each term backed by the declared evidence policy. Current TS computes ledger fields, but `fulfillment` and `targetCertification` are too weak for executable behavior. Misplaced computation: close is derived from carrier/materialization sufficiency. | Ledger carriers exist, but their predicate is incomplete for executable behavior because materialization and obligation assessment can drive close without admitted execution evidence or remaining-pressure truth. |
| 8 | Admission | Partial | TS postflight admits worker report shape, file paths, digests, lineage tags, and materialization refs. | Required: admission converts raw observations into typed evidence classes and rejects missing evidence required by the edge. Current TS admission validates shape/path/digest/lineage. Missing: required behavioral and execution evidence admission for this edge. | Admission is deterministic for carrier/materialization facts, but it does not require the decisive behavioral or execution evidence. Candidate worker claims still dominate requirement fulfillment. |
| 9 | Materialization Non-Sufficiency | Missing in effect | `targetCertificationPassed: true` and materialization refs prove source files exist under the tenant root with lineage. | Required: materialization is one evidence dimension, not the fulfillment verdict. Current TS: materialization certification can satisfy the effective target close path. Missing: downstream computation that says `materialized == true` is necessary but insufficient until behavior/test/execution predicates also pass. | TS treats materialization certification as enough for close on this path. Test35 treats materialization as necessary evidence, not sufficient behavioral proof. |
| 10 | No Null Evidence Pass | Missing | `fp_evaluate_result.json` says `status: passed` and `postflightStatus: passed` with `executionEvidenceStatus: null`. | Required: if execution contract is declared, `executionEvidenceStatus == null -> not close`. Current TS allows `null -> passed` on this path. Missing: inhabitance check for `ClosedEdge(e)` requiring `ExecutedDeclaredContract(e)`. | This is the clearest false positive. A declared executable edge closed without the evidence that would inhabit the closure proof. |
| 11 | Stub Rejection | Missing | The emitted `Compiler.default` throws `NotImplementedError`; the archive still passes. | Required: admitted code evidence is scanned or behaviorally tested for non-realization markers, then mapped to blocking evidence. Current TS does not compute `StubPresent(file) -> not BehavioralFulfillment`. Missing: stub/deferred implementation predicate in F_D admission or assurance. | TS has no effective stub/deferred-implementation blocker in this path. Test35 behavioral realization would not allow a product code edge to close on this artifact. |
| 12 | Scope Honesty | Missing for projection | The run is a steel-thread component pass with one included module and six deferred modules. | Required: close disposition is relative to declared scope; product convergence requires no remaining graph, requirement, asset, module, or execution pressure. Current TS projects `product_converged` even though deferred scope remains. Misplaced computation: overlay segment completion is treated as product completion. | `sdlc_overlay_segment_completion.json` says `product_converged`. A bounded component segment is being projected as product convergence. |
| 13 | Retry Semantics | Partial | The first attempt blocked for missing materialized source role and requirement lineage; retry repaired those carrier defects. | Required: retry closes only the typed gap it repairs; unresolved behavioral/execution/product pressure remains live. Current TS retry repaired materialization and lineage, then promoted the edge to close. Missing: recomputation of all closure dimensions after retry, not only prior blocking reasons. | Retry semantics exist, but the successful retry only repaired carrier/materialization defects. It did not carry forward unresolved behavior, execution, tests, and full product pressure as blocking gaps. |
| 14 | Projection Truth | Partial | TS has runtime projections and consequence carriers rather than relying only on prompt prose. | Required: read models project from admitted ledger truth and cannot improve or weaken closure law. Current TS read models faithfully project an unsound closure predicate. Missing: stronger upstream ledger predicate; projection cannot repair false closure after the fact. | The projections are only as sound as the admitted ledger predicate. Here the read model overclaims because the closure predicate admitted the wrong evidence basis. |
| 15 | Parity | Missing overall | TS proves materialization-lineage mechanics for one scoped component archive. | Required: parity is an end-to-end simulation: same authority basis, same obligation derivation, same evidence policy, same execution proof, same closure predicate over intended scope. Current TS only matches some carrier names and local mechanics. Missing: preservation of the test35 closure semantics. | Test35 parity requires the whole shape: declared full obligations, behavioral code, realized tests, executed tests, admitted evidence, and computed convergence over intended scope. The reviewed TS archive proves only a subset. |

The differential is therefore not that TS lacks all system infrastructure. The differential is that the current path connects the infrastructure at the wrong closure boundary:

```text
TS archive closure basis:
  component scope
  + files exist
  + lineage tags parse
  + worker obligations say fulfilled
  + materialization postflight passes
  -> close

test35 closure basis:
  declared requirement surface
  + behavioral code realization
  + realized test source
  + executed declared test contract
  + admitted ledger evidence
  + no remaining scope pressure
  -> close
```

This is why the systems can look similar from the outside. They both have manifests, ledgers, postflight, and projections. The difference is the predicate those carriers feed.

### Row 1 Detail: Requirement Tags vs Requirement-Authority Closure

The computational difference is that a requirement tag is a reference, while requirement-authority closure is a derived proof relation.

Current TS archive shape:

```text
product file contains requirement tag REQ-X
+ worker report says REQ-X fulfilled
-> obligation counter increments fulfilled
```

That computes:

```text
TagObserved(file, REQ-X)
WorkerClaim(worker, REQ-X, fulfilled)
```

It does not compute:

```text
RequirementAuthority(current_surface, REQ-X)
EdgeObligates(edge, REQ-X)
AdmittedEvidenceSatisfies(REQ-X, evidence_refs)
BehavioralFulfillment(REQ-X)
```

The missing computation is not the general idea of a metric. This equation is valid only if `worker_percent_complete` is replaced by a governed metric computed by the system:

```text
REQ-X + worker_percent_complete >= 100
```

`percent_complete` or `fulfilled` from the worker is only a claim. It can be admitted as candidate evidence about what the worker believed it did. It cannot be the metric that decides requirement fulfillment.

The metric form would be legitimate if it were:

```text
m = fulfillment_metric(
      authority = current_requirement_surface,
      edge = current_edge,
      requirement = REQ-X,
      evidence = admitted_evidence_refs,
      rule = declared_fulfillment_rule
    )

close_obligation(REQ-X) iff m >= threshold(REQ-X, edge_policy)
```

For a binary behavioral requirement, `m` may be `0` or `1`. For a decomposable requirement, `m` may be:

```text
m = satisfied_subobligations(REQ-X) / expected_subobligations(REQ-X)
```

The important point is that both numerator and denominator must be derived from authority and admitted evidence. The worker cannot provide the denominator, the numerator, or the threshold as a closure fact.

The test35-style computation is:

```text
O = derive_obligations(requirement_surface, edge_policy)
E = admit_evidence(product_files, test_files, execution_reports, ledgers)

for each obligation o in O:
  basis[o] = select_admitted_evidence(E, o)
  verdict[o] = evaluate_fulfillment_rule(o, basis[o])

carry_converged =
  expected_ids(O) == carried_ids(edge_ledger)

fulfillment_converged =
  forall o in O: verdict[o] == fulfilled

edge_converged =
  carry_converged
  && fulfillment_converged
  && admitted
  && target_certification_passed
  && fd_recheck_passed
```

So the authority relation is:

```text
requirement_surface
  -> canonical obligation set
  -> edge obligation membership
  -> admissible evidence policy
  -> evidence refs
  -> fulfillment verdict
  -> ledger closure predicate
```

A tag-only system stops at identity:

```text
REQ-X appeared somewhere
```

A worker-assessment system stops at assertion:

```text
worker says REQ-X is done
```

A requirement-authority closure system derives the verdict:

```text
the current requirement authority obligates this edge to satisfy REQ-X,
and admitted evidence satisfies REQ-X under the declared fulfillment rule.
```

Completion percentage, if shown at all, is downstream read-model math over admitted verdicts:

```text
complete_pct = fulfilled_obligation_count / expected_obligation_count
```

It is not an input to closure unless the metric function itself is declared and admitted as the fulfillment rule. A worker can say 100 percent complete while the system still computes zero percent fulfilled if no admitted behavioral or execution evidence satisfies the obligation.

## Generic Work Formulation: Gain And Close Functions

The reusable abstraction is:

```text
Traversal work is lawful only when each edge declares its gain function.
```

The graph is not only:

```text
A -> B -> C -> ... -> Z
```

It is:

```text
A --g1--> B --g2--> C --g3--> ... --gn--> Z
```

Each `g_i` defines what improvement means for that edge, how improvement is measured, and what evidence can satisfy it.

For one edge:

```text
EdgeGain(e) =
  authority_basis
  + obligation_set
  + evidence_policy
  + metric_function
  + threshold
  + residual_pressure_function
```

The edge computation is:

```text
O_e = derive_obligations(authority, edge_policy)

E_e = admit_evidence(candidate_outputs, runtime_events, test_results, ledgers)

m_e(o) = metric_function(o, E_e)

gain_e = {
  obligation_scores: { o -> m_e(o) },
  fulfilled_count,
  expected_count,
  residual_pressure,
  evidence_refs
}
```

The edge close function is:

```text
close_e iff
  forall o in O_e: m_e(o) >= threshold_e(o)
  and required_evidence_present(e)
  and no_unresolved_required_pressure(e)
```

The metric can be binary:

```text
m_e(o) = 1 if admitted behavioral evidence satisfies o else 0
```

or graded:

```text
m_e(o) = satisfied_subobligations(o) / expected_subobligations(o)
```

But the metric must be declared and computed by the system from admitted evidence. A worker can propose a score; it cannot be the metric authority.

For a compound traversal:

```text
Path(A, Z) = [e1, e2, ..., en]
```

The compound gain is not a blind sum. It is a typed fold:

```text
Gain(A -> Z) =
  compose_gain(gain_e1, gain_e2, ..., gain_en)
```

The composition must preserve bottlenecks:

```text
close(A -> Z) iff
  all required intermediate closures hold
  and final target closure holds
  and no required residual pressure remains
```

So the generic rule is:

```text
No edge without a gain function.
No compound traversal without a gain-composition rule.
No closure from artifacts unless the gain function says those artifacts satisfy the obligation.
```

For `test35`, the effective gain function for code realization was:

```text
requirement_surface obligations
+ behavioral code realization
+ realized tests
+ executed test evidence
+ admitted ledger closure
```

For the reviewed TS archive, the effective gain function was weaker:

```text
component materialized
+ lineage tags observed
+ worker says obligations fulfilled
+ materialization postflight passed
```

That is the real differential. TS has a traversal, but the gain function on that traversal is wrong or underdeclared for the intended `A -> Z` product outcome. For each traversal and each compound traversal, the design question must become:

```text
What is this edge's gain function?
What is this edge's close function?
How do these gains compose across A -> Z?
```

## Formal-System Follow-Up

The closest formal framing is not one field. It is a stack:

1. Category theory gives the compositional graph shape.

   - assets are objects
   - GTL graph functions are morphisms
   - traversals compose morphisms
   - ledgers and evidence form a second category of admitted proof objects
   - a correct runtime is a structure-preserving map from constructive graph execution into admitted ledger truth

   Test35 parity can be read as a simulation or equivalence obligation: the TS line must preserve the same closure semantics as the Python/test35 reference for the same declared edge contract.

2. Formal type theory gives the closure-proof shape.

   A closed edge is a dependent record or proof object, not a boolean:

   ```text
   ClosedEdge(e) =
     ledger : EdgeFulfillmentLedger(e)
     admitted : Admitted(ledger)
     carry : CarryConverged(ledger)
     fulfillment : FulfillmentConverged(ledger)
     target : TargetCertified(ledger)
     recheck : FdRecheckPassed(ledger)
     scope : NoRemainingPressure(e)
   ```

   For executable code edges, the type also requires execution evidence:

   ```text
   execution : ExecutedDeclaredContract(e)
   ```

   If `executionEvidenceStatus = null`, then `ClosedEdge(e)` has no inhabitant. The edge cannot close.

3. Operational semantics gives the implementable transition system.

   ```text
   W = mutable workspace
   L = admitted ledger state
   E = event/replay spine
   Gamma = authority context

   Gamma, W -> candidate output
   Gamma, candidate output -> admitted evidence
   Gamma, admitted evidence -> ledger
   Gamma, ledger -> close | retry | repair | re-enter | reprice | block | yield
   ```

   The core inference rules are:

   ```text
   EXEC-CLOSE
     declared_test_contract(e)
     admitted_execution_evidence(e, command, succeeded, tests > 0)
     ledger_converged(e)
     no_remaining_pressure(e)
     --------------------------------
     close(e)

   NO-RAW-FILE-CLOSE
     files_exist(e)
     lineage_tags_parse(e)
     no_execution_evidence(e)
     --------------------------------
     not close(e)
   ```

4. Computational completeness is contract-relative, not Turing completeness.

   The useful properties are:

   - soundness: if TS says `close`, then the declared evidence contract is actually satisfied
   - completeness: if the declared evidence contract is satisfied by admitted evidence, TS can derive `close`
   - progress: if TS cannot close, it emits a lawful next disposition instead of a false close
   - preservation: every admitted transition preserves ledger invariants

The best name for the system is:

```text
Ledger-admission operational semantics for ODD executable realization
```

This is not a new method. It is an algebraic specialization of existing ODD method: executable product realization closes only through admitted behavioral and execution evidence, never through workspace shape, worker assertion, prompt text, or carrier compliance alone.

## Assurance Matrix For SDLC Graph Completeness

Ledgers are part of the measuring toolset. They are not only audit output. The generic measurement chain is:

```text
workspace change
  -> admitted evidence
  -> ledger measurement rows
  -> gain function
  -> close function
```

Every graph edge and every compound traversal should have an assurance row:

| Field | Purpose |
| --- | --- |
| Edge | Names the graph function/vector, such as `A -> B`. |
| Target outcome | Names the state this edge is supposed to improve or produce. |
| Authority basis | Names the specification, requirement, product, design, policy, or prior-ledger surfaces that define the obligation. |
| Gain function | Defines what counts as improvement for this edge. |
| Metric function | Defines how the gain is measured from admitted evidence. |
| Ledger rows | Names where measured facts are recorded and preserved. |
| Evidence policy | Defines what evidence is admissible input to the metric. |
| Threshold | Defines what measured value is enough for this edge. |
| Close function | Defines the predicate for `close`, `yield`, `retry`, `repair`, `re-enter`, `reprice`, or `block`. |
| Residual pressure | Defines what remains visible when the edge does not close. |
| Composition role | Defines how this edge contributes to the compound `A -> Z` traversal. |
| Proof lane | Names the test, scenario, live run, or replay proof that verifies the gain and close logic. |

Graph completeness for software development is then inspectable:

```text
SDLC graph complete for software development iff
  every required edge has a declared gain function
  and every gain function has an evidence policy and metric
  and every metric writes to admitted ledger truth
  and every close function consumes ledger truth, not worker assertion
  and every compound traversal has a gain-composition rule
  and every residual pressure path has lawful continuation
  and every edge or compound path has proof coverage
```

This matrix turns the question from:

```text
Did a run produce artifacts?
```

into:

```text
Is the SDLC graph measured well enough to develop software?
```

That is the actionable diagnosis for the TS shortfall. TS has many carriers and ledgers, but the reviewed data-mapper path does not yet declare and enforce the right gain and close functions for the intended product outcome. The matrix should expose those rows directly:

```text
carrier exists
+ ledger exists
+ metric missing or wrong
+ close predicate weaker than target outcome
-> not software-development complete
```
