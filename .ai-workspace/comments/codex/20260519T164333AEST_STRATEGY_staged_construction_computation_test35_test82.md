# Strategy: Staged Construction Computation After data_mapper test82

Date: 2026-05-19

Status: commentary / strategy proposal, not ratified specification.

Scope:
- reference run: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`
- current TS run: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl`
- prior RC4 analysis: `.ai-workspace/comments/codex/20260519T160359AEST_ANALYSIS_data_mapper_test82_vs_test35_rc4_depth.md`
- divergent-surface analysis: `.ai-workspace/comments/codex/20260519T162932AEST_ANALYSIS_data_mapper_test82_vs_test35_divergent_construction_surface.md`

## Thesis

The test35 vs test82 gap is a computation problem.

test35 did not merely produce more code because it had more runtime or a better
model. It split the construction problem into smaller abstract computations
before asking any worker to perform detailed materialization.

The decisive shape was:

```text
Req
-> Design.to_fulfill_Req
-> Module_Decomposition.to_fulfill_Design
-> Module_Dependency_Map.to_isolate_parallelism_and_steel_threads
-> begin bounded parallel build
-> assemble / execute / qualify / release
```

test82 closed its current ledgers, but it compressed too much work into the
later code and test materialization surfaces. The system proved that all
declared component rows had evidence. It did not first compute whether the
component rows were the right granularity for the requirements.

The optimal path is to make staged computation explicit again. The runtime
should not jump from broad requirement/design pressure to coarse materialized
files. It should compute topology, dependency, steel-thread order, and test
topology before code and test construction begin.

## What test35 Preserved

test35 preserved the abstraction ladder.

It had an implementation-module authority between requirements/design and code.
That surface decomposed requirement pressure into named modules, internal
components, package/file boundaries, fulfillment boundaries, and trace
assignments.

That meant the code writer received a smaller computation:

```text
Implement TypeResolver.
Implement CastRegistry.
Implement RunReplayService.
Implement MorphismExecutor.
Implement FidelityInvariantEngine.
```

The worker did not have to solve the entire problem of "what is the internal
product topology?" while also writing the product. That topology had already
been computed at a higher abstraction level.

This is why test35 got deeper code. The important difference was not only that
test35 had more files. It had a prior stage whose output made those files
lawful and necessary.

## What test82 Proved

test82 proved a different and valuable thing.

It proved that the TypeScript/ABG installed operator can:

- traverse the full data_mapper lifecycle
- admit typed F_P stage carriers
- carry evaluator-owned F_P authority into ledgers
- admit execution evidence
- close release surfaces through governed ledgers
- produce a reproducible RC proof surface

That is a runtime and authority win.

The weakness is that test82's construction topology was too compact. The
component-code carrier accepted one source file per source-role component row.
Because the admitted rows were coarse, the downstream code edge lawfully built
a coarse implementation.

The failure mode is therefore not "the ledgers lied." The ledgers folded a
shallower construction computation.

## The Lost Boundary

The lost boundary is the boundary between abstract construction computation and
detailed materialization.

Abstract computation answers:

- What are the product's modules?
- What components inside each module own which requirements?
- Which public boundaries must exist?
- Which dependencies are allowed?
- Which components can be built in parallel?
- Which components form the first steel thread?
- Which components are prerequisites for test execution?

Detailed materialization answers:

- Write this source file.
- Write this test file.
- Wire this build target.
- Repair this compile error.
- Run this shard.
- Archive this execution result.

When these are collapsed into one F_P transform, the worker receives too much
global reasoning pressure. It can satisfy the carrier by producing a compact
shape. The evaluator can then certify the compact shape because the missing
decomposition was never made an admitted prerequisite.

## Implementation Lifecycle

The implementation lifecycle should be treated as a staged computation chain:

```text
Req
-> Design.to_fulfill_Req
-> Implementation_Module_Decomposition.to_fulfill_Design
-> Module_Dependency_Map
-> Eval_Action.selects_steel_thread_or_parallel_build_traversal
-> Component_Code_Surface
-> Component_Qualification_Surface
-> Code_Rollup_Surface
-> Execution_Preparation_Surface
-> Execution_Result_Surface
-> Release_Surface
```

Each stage has a distinct computational job.

`Design.to_fulfill_Req`:

- turns requirement meaning into design commitments
- preserves unresolved ambiguity as pressure
- names product behaviors without yet choosing all file boundaries

`Implementation_Module_Decomposition.to_fulfill_Design`:

- computes modules, components, public boundaries, and file/package targets
- assigns requirement ids to component owners
- prevents a module facade from absorbing separable requirements
- creates the depth oracle that later code edges must realize

`Module_Dependency_Map`:

- computes allowed dependencies between modules/components
- identifies cycles, layering violations, and shared substrate boundaries
- determines what can be built independently
- distinguishes steel-thread dependencies from parallelizable work

`Eval_Action.selects_steel_thread_or_parallel_build_traversal`:

- reads the admitted module dependency map
- chooses the smallest vertical path when the architecture needs an execution
  spine before broad construction
- chooses dependency-isolated parallel traversal after the steel thread is
  lawful or when the dependency map already proves independent work surfaces
- binds the selected traversal to source files, test files, build targets, and
  execution command without creating a second product carrier

`Component_Code_Surface`:

- materializes the component topology already admitted
- does not decide whether topology is deep enough
- fails admission if required component rows are missing, merged, or
  represented only by module-level catch-all files

The implementation worker becomes more reliable because each transform handles a
smaller computation.

## Test Lifecycle

The test lifecycle is its own SDLC over evidence.

It should not be treated as "generate some tests after implementation." It has
the same staged computation pattern as implementation:

```text
Req
-> Testcases.to_fulfill_Req
-> Test_Design.to_cover_Behavior
-> Test_Module_Decomposition.to_fulfill_Test_Design
-> Test_Dependency_Map
-> Test_Build_Tenant_Profile
-> Eval_Action.selects_test_steel_thread_or_parallel_test_traversal
-> Component_Test_Surface
-> Test_Execution_Preparation
-> Test_Execution_Result
-> Test_Run_Archive
-> Testcase_Authority_Qualification
```

`Testcases.to_fulfill_Req`:

- computes what behavioral evidence is required by the requirements
- names positive, negative, edge, integration, and regression obligations
- remains independent from the implementation file layout

`Test_Design.to_cover_Behavior`:

- turns test obligations into test strategies
- identifies unit, integration, property, golden-data, compile-time, and
  runtime evidence classes
- names fixture and data requirements

`Test_Module_Decomposition.to_fulfill_Test_Design`:

- decomposes test obligations into test modules/classes/shards
- prevents one broad module test from standing in for many semantic behaviors
- maps test modules back to requirements and implementation components

`Test_Dependency_Map`:

- computes which tests require which product modules, fixtures, services, and
  data assets
- isolates parallel test shards
- identifies which tests belong in the first executable steel thread

`Test_Build_Tenant_Profile`:

- chooses the testing stack as a first-class construction decision
- may differ from the implementation build tenant
- should not silently default when requirement evidence needs a different test
  substrate

`Eval_Action.selects_test_steel_thread_or_parallel_test_traversal`:

- reads testcase authority, test design, test module decomposition, test
  dependency map, and selected test stack profile
- chooses the first executable test steel thread when runtime evidence is not
  yet established
- chooses dependency-isolated parallel test traversal after the test spine is
  lawful or when the dependency map proves shard independence

The testing stack is a product decision over evidence, not a convenience
default. A Scala Spark implementation may need ScalaTest for unit behavior,
golden-data fixtures for transformations, property tests for algebraic laws,
schema-contract tests for public carriers, and a separate compatibility or
performance tenant. The test lifecycle must be allowed to choose that stack.

## Why This Enables Parallelism

Parallel work is only safe after dependency computation.

Without a dependency map, "parallel build" is just multiple workers editing a
shared unknown surface. That produces collisions, shallow facades, or hidden
coupling.

With a dependency map, parallel workers receive bounded jobs:

```text
Worker A: implement type-system components and their tests.
Worker B: implement execution/replay components and their tests.
Worker C: implement fidelity/accounting components and their tests.
Worker D: implement engine integration after A/B/C publish admitted surfaces.
```

The steel thread is not a small product. It is the first dependency-valid slice
that proves the architecture can execute. After it closes, parallelism can
expand without losing integration truth.

## Required Review Lens For Current Surfaces

Every current TypeScript construction surface should be reviewed under this
question:

```text
Is this surface computing a necessary abstraction, or is it collapsing that
computation into a later materialization edge?
```

Useful classification:

- abstraction computation: derives requirement/design/module/test topology
- dependency computation: derives ordering, allowed references, and parallelism
- steel-thread computation: selects the first executable vertical slice
- materialization: writes source/test/build files for admitted topology
- evaluation: reads product state and admits evidence
- rollup/projection: summarizes admitted surfaces without owning new truth
- execution observation: records runtime facts from declared commands

Collapsed stages to look for:

- code surfaces that also infer module decomposition
- test surfaces that also infer testcase authority
- execution surfaces that also repair product topology
- release surfaces that imply product completeness from ledger count alone
- defaulted test stack profiles that were never selected as evidence strategy

## Admission Rules Needed

The staged computation model needs admission rules, not just prompt language.

Recommended evaluator checks:

1. Production code materialization requires an admitted module decomposition
   unless the product is explicitly classified as trivial.
2. A component-code surface fails if a high-density requirement set is carried
   only by module-level facade files.
3. A module decomposition surface fails if separable public responsibilities are
   merged without an explicit design reason.
4. A dependency map must exist before the evaluator selects steel-thread or
   parallel-build traversal.
5. The evaluator-selected traversal must identify source, test, build, and
   execution evidence for the selected vertical slice or parallel partition.
6. Component tests require admitted testcase authority, test design, and test
   module decomposition.
7. Test stack profile selection is explicit; defaulting to the implementation
   build tenant is admitted only when the test evidence classes justify it.
8. F_P.transform may write the materialized workspace files for its edge;
   evaluators and non-transform F_P stages remain read-only and pass typed
   values to the TypeScript admission surface.

These rules make the missing computation visible. A worker cannot close a
later edge by compensating for a missing earlier abstraction stage.

## Data Mapper Optimal Path

For data_mapper, the next optimal path is not "run another full graph and hope
for depth." It is to insert the missing staged computations and then run.

Recommended data_mapper path:

1. Reconstruct the test35 abstraction ladder as the comparison oracle:
   implementation modules, module dependencies, stack profiles, test modules,
   and test schedule.
2. Derive a current TypeScript implementation-module decomposition carrier from
   the live requirements and design, using test35 as evidence of required
   granularity but not hard-coding test35 file names as runtime law.
3. Derive a module dependency map that identifies the executable steel thread
   and the parallelizable component clusters.
4. Derive a test lifecycle in parallel with implementation topology:
   testcase authority, test design, test module decomposition, test dependency
   map, and explicit test stack profile.
5. Begin implementation with the steel thread only.
6. Admit execution evidence for the steel thread.
7. Expand to dependency-isolated parallel component builds.
8. Run component and integration test shards from the admitted test dependency
   map.
9. Roll up code, tests, execution archive, release parity, and release only
   after the topology and evidence carriers close.

The target is not to recreate test35 by file count. The target is to recreate
test35's computational boundary: abstract topology first, bounded
materialization second.

## Proposed Runtime Shape

The TypeScript graph should make these surfaces explicit or strengthen existing
ones to carry the same authority:

```text
derive_requirement_surface
derive_design_surface
derive_implementation_module_surface
derive_module_dependency_map_surface
derive_component_code_surface
qualify_component_realization_surface

derive_testcase_authority_surface
derive_test_design_surface
select_test_stack_profile
derive_test_module_surface
derive_test_dependency_map_surface
derive_component_test_surface
prepare_test_execution_surface
derive_test_execution_result_surface
derive_test_run_archive_surface
qualify_testcase_authority_surface
```

Steel-thread build and parallel build are traversal methods selected by the
evaluator action over admitted dependency carriers. They are not separate target
carrier surfaces. The same applies to test steel-thread and parallel test
traversal.

Some of these may already exist under different names. The review should not
start by adding names. It should start by checking whether the current carrier
actually computes and admits the stage's authority.

If an existing surface only summarizes a prior result, it is a projection. If
it computes topology or dependency and evaluators enforce that topology, it is
an authority surface.

## Governance Implication

This is likely a design-reframe over the TypeScript construction algebra, with
possible requirement wording if the existing requirements do not already demand
the staged boundary.

The fix should remain under the single-surface rule:

- do not create a second compatibility closure law
- do not let prompt text stand in for evaluator admission
- do not make model choice the primary control surface
- do not encode data_mapper-specific file names into generic runtime law
- do make staged computation, dependency isolation, and test lifecycle topology
  first-class admitted carriers

## Bottom Line

test35 was deeper because it computed abstraction before detail.

test82 was stronger in runtime law but shallower in construction topology.

The next line should combine both:

```text
test82 authority and ledgers
+ test35 staged construction computation
= governed runtime closure over deeper product realization
```

That means reviewing every current surface for whether it owns a real
computational stage or is accidentally asking a later worker to infer the stage
while also materializing it.
