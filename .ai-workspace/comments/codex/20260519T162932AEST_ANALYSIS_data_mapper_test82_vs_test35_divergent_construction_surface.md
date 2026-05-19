# data_mapper test82 vs test35 Divergent Construction Surface

Date: 2026-05-19

Scope:
- test35 workspace: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`
- test82 workspace: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl`
- prior comparison: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/EDGE_COMPARISON_test35_vs_test65_vs_test66_vs_t109_pty_live.md`
- RC4 comparison post: `.ai-workspace/comments/codex/20260519T160359AEST_ANALYSIS_data_mapper_test82_vs_test35_rc4_depth.md`

## Finding

The clearest divergent surface is not wall-clock runtime, ledger count, or final
test pass/fail. It is the construction authority handed to the code writer.

test35 forced a deeper interpretation by inserting an implementation-module
authority surface between requirements and code. That surface decomposed the
requirements into named components, package structures, fulfillment boundaries,
and requirement-to-component assignments before the code surface ran.

test82 instead ran the current TypeScript component-code edge against an
admitted component-depth carrier whose source-role topology was already collapsed
to 9 source component rows. Once those rows were materialized, the ledgers could
close even though the code had less internal decomposition than test35.

This makes the runtime result coherent but unsatisfying: test82 proved T-171 /
RC4 traversal closure, not test35-level product interpretation depth.

## Direct Evidence

### test35: requirement pressure became implementation topology

`test35/build_tenants/scala_spark/design/40-generated-implementation-modules.md`
states that all 77 obligations are mapped across the module surface:

- lines 19-23: the surface defines module boundary records for all 77
  requirements across 7 SBT sub-projects.
- lines 52-67: `cdme-compiler` owns `TopologicalCompiler`, `GrainChecker`,
  `TypeResolver`, `ImplementationFunctor`, `TemporalBindingResolver`,
  `SheafManager`, `MonoidLawValidator`, `AdjointCompositionValidator`,
  `DryRunExecutor`, `AggregationFunctionRegistry`, and `EntityRegistry`.
- lines 68-96: the compiler package structure names separate source files for
  those responsibilities.
- lines 175-190: `cdme-executor` owns `MorphismExecutor`,
  `RunManifestManager`, `ArtifactVersionStore`, `RunReplayService`,
  `LookupVersionResolver`, `CostEstimator`, `SynthesisEngine`,
  `BusinessLogicRegistry`, `ExternalMorphismRegistry`, `ResidueCollector`,
  `LateArrivalHandler`, and `RunCompletionGate`.
- lines 478-560: the file declares itself as the authoritative obligation set
  and maps each requirement to a primary module, secondary modules, and a named
  fulfillment boundary.

That is the decisive forcing function. The code writer was not asked merely to
make "compiler" and "executor" files exist. It inherited a named component
algebra.

The test35 code prompt confirms the same pressure. The `derive_code_surface`
manifest prompt uses:

- effective contexts: `implementation_module_surface`, `implementation_stack_profile`,
  and `requirement_surface`
- output contract: `published_source_code_surface`
- ledger policy: `fulfillment_rule: behavioral_code_realization`
- evidence policy: `behavioral_code_evidence`

The accepted `derive_code_surface` fulfillment result cites 76 unique
`src/main/scala` files as requirement evidence. The prompt carried fewer
requirements than test82, but the requirements were already grounded in a deeper
component/file topology.

### test82: requirement pressure became compact component rows

`test82/build_tenants/scala_spark/design/component_code_surface.md` says:

- lines 8-13: derive source-role component targets from ADR-002 and write a
  requirement trace register.
- lines 9-10: materialize one Scala source file per source-role component.
- line 17: `declaredProductFileTargets` is empty, so product targets are derived
  from ADR-002 `componentRealizationRows` and `fileTargetRows`.
- lines 39-49: the materialized source set is 9 source files plus build config.
- line 63: the summary records "9 source files + build config" as the completed
  full-breadth materialization.

`test82/build_tenants/scala_spark/design/component_test_surface.md` repeats the
same pattern for tests:

- lines 9-14: derive test product targets from ADR-003 `testComponentTopologyRows`.
- lines 47-53: materialized test set is 7 test class files.
- line 66: the summary records 7 test class files and 10 logical test cases.

The accepted `derive_component_code_surface` worker report contains 885
obligation assessments but only 9 unique `src/main/scala` evidence refs. The
accepted `derive_component_test_surface` report contains 7 unique
`src/test/scala` evidence refs.

This is a traceability win but a depth loss. The TypeScript carrier proved that
every listed row had evidence. It did not require that `REQ-TYP-006` expand into
`TypeResolver`, `TypeUnifier`, `CastRegistry`, and related domain files, or that
`REQ-TRV-005` expand into `RunManifestManager`, `ArtifactVersionStore`, and
`RunReplayService`.

### Prompt difference

test35 `derive_code_surface` prompt:

- current-state-first execution
- required source context includes `implementation_module_surface`
- declared fulfillment obligations are the 77 requirement IDs
- ledger adapter rule is `implementation_code_projection`
- fulfillment rule is `behavioral_code_realization`
- execution rule: update workspace artifacts, not only the assessment file

test82 `derive_component_code_surface` prompt:

- launch contract is `F_P.transform`
- selected target carrier is `sdlc_component_code_surface_target_carrier`
- output surface is `component_code_surface.md`
- obligations in scope: 885
- declared product file targets: none
- source role is required
- when targets are empty, derive source target set from admitted composite
  implementation design authority and materialize source files at
  `payload.componentRealizationRows[].relativePath`
- emit a fenced `component_depth_register`

The wording in test82 is precise and compatible with T-102, but it channels the
worker into satisfying the carrier. If the carrier has 9 component rows, the
worker can lawfully produce 9 source files. The prompt does not require a
subcomponent expansion equivalent to test35's implementation-module surface.

## Model Evidence

Model choice may have contributed, but the preserved evidence does not support
model choice as the primary root cause.

test82 is explicit: the worker ran through Claude CLI with:

```text
claude -p --model sonnet --effort xhigh --output-format stream-json --verbose --permission-mode bypassPermissions
```

test35 is mixed. The fp manifests report `selected_backend=claude`,
`backend_id=claude`, `worker_id=genesis` across the relevant fp edges. The
preserved terminal histories also show Claude Code Opus 4.7 high-effort
sessions and Codex `gpt-5.4 xhigh` sessions in the same workspace during the
broader construction period.

That means test35 was not a single clean deterministic model lane comparable to
test82. Model differences are plausible, but the stronger artifact-grounded
cause is carrier topology: test35 gave the worker a richer implementation
module surface to realize.

## Concrete Code Symptom

One representative divergence is type semantics.

test35:

- `TypeResolver.scala` is a dedicated component with explicit semantic type
  enforcement, cast delegation, refinement validation, and typed `CdmeError`
  emission.
- `TopologicalCompiler.scala` remains a morphism/path compiler.
- `CastRegistry.scala`, `TypeUnifier.scala`, and domain error/type files exist
  as separate realization surfaces.

test82:

- `TopologyCompiler.scala` carries many requirement tags at the top of one file.
- It defines core domain types and many validations in one surface.
- It does not split the type-system requirements into the same dedicated
  component set that test35 declared.

That is not just fewer lines. It is a different interpretation of the
requirement algebra: test35 treats type resolution, cast registration, semantic
type enforcement, unification, and topology compilation as separate components;
test82 treats them as a compact compiler responsibility.

The same pattern appears in executor depth. test35 names `MorphismExecutor`,
`RunManifestManager`, `ArtifactVersionStore`, `RunReplayService`,
`LookupVersionResolver`, `CostEstimator`, `SynthesisEngine`,
`BusinessLogicRegistry`, `ExternalMorphismRegistry`, `ResidueCollector`, and
`LateArrivalHandler`. test82 materializes `DataFrameExecutor.scala` and
`ErrorSink.scala` for the executor module.

## Root Cause

The root cause is a depth predicate gap in the TypeScript construction carrier,
not a failure of closure mechanics.

test82 correctly closed what its carrier asked it to close:

- every required edge traversed
- target carriers admitted
- typed-stage reports cited authoritative eval results
- execution evidence succeeded
- release-depth parity and release surfaces closed

But the `component_code_surface` carrier accepted "one source file per
source-role component row" as full-breadth materialization. Since the upstream
component rows were already coarse, the evaluator could not discover that the
result was shallow relative to test35.

The ledgers are therefore doing their current job. They are just folding a
shallower product-topology declaration.

## What test35 Did That test82 Did Not

test35 forced a deeper interpretation by requiring an explicit
`implementation_module_surface` before code. That surface:

1. named owned components inside each module
2. declared package/file structure for those components
3. mapped each live requirement to a primary module and named fulfillment
   boundary
4. carried cross-cutting constraints such as Either discipline, idempotent
   failure, no implicit coercion, exhaustive unification, semantic type
   isolation, zero-loss accounting, and error object contract
5. made the code edge prove behavioral realization against that richer topology

test82 did not have an equivalent depth gate. Its current carrier proves
coverage over the rows it was given, not whether those rows are sufficiently
decomposed for the product's requirement semantics.

## Required Fix Direction

Do not add another broad computational sweep. Add a depth predicate before or
inside `derive_component_code_surface`.

The TypeScript line needs a construction/evaluator rule equivalent to:

```text
For production-code edges, component_code_surface cannot treat a module-level
catch-all file as sufficient when the requirement set implies separable public
boundaries. The admitted implementation design must decompose requirements into
component-level realization rows with public boundary, package path,
requirement ids, and evidence refs; evaluator admission fails when high-depth
requirements are carried only by a coarse module facade.
```

For data_mapper specifically, the depth oracle can be initialized from test35:

- compiler depth: `TopologicalCompiler`, `GrainChecker`, `TypeResolver`,
  `TypeUnifier`, `CastRegistry`, `ImplementationFunctor`,
  `TemporalBindingResolver`, `SheafManager`, `MonoidLawValidator`,
  `AdjointCompositionValidator`, `DryRunExecutor`,
  `AggregationFunctionRegistry`, `EntityRegistry`
- executor depth: `MorphismExecutor`, `RunManifestManager`,
  `ArtifactVersionStore`, `RunReplayService`, `LookupVersionResolver`,
  `CostEstimator`, `SynthesisEngine`, `BusinessLogicRegistry`,
  `ExternalMorphismRegistry`, `ResidueCollector`, `LateArrivalHandler`
- test depth: 35 planned test classes / 73 logical testcase allocations in the
  test35 test-module surface, not 7 module-level test files

The general rule should not hard-code test35 filenames into the runtime. It
should require the implementation-design carrier to declare a component topology
whose granularity is justified by requirement semantics, and then require the
code/test carriers to realize that topology.

## Bottom Line

test82 did not underperform because it had too few ledgers. It underperformed
because the ledgers certified a shallower construction topology.

test35's deeper result came from an intermediate requirement-to-component
interpretation surface. test82 needs that depth predicate in the TypeScript
construction algebra before another full data_mapper run can be expected to
match or exceed test35 code depth.
