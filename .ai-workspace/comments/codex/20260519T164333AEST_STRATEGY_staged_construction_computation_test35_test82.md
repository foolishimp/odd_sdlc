# Strategy: Staged Construction Computation After data_mapper test82

Date: 2026-05-19

Status: commentary / strategy proposal, not ratified specification.

Scope:
- reference run: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`
- current TS run: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl`
- prior RC4 analysis: `.ai-workspace/comments/codex/20260519T160359AEST_ANALYSIS_data_mapper_test82_vs_test35_rc4_depth.md`
- divergent-surface analysis: `.ai-workspace/comments/codex/20260519T162932AEST_ANALYSIS_data_mapper_test82_vs_test35_divergent_construction_surface.md`

Applicability:
- data_mapper is the worked example and proof pressure, not the boundary of the
  method
- the staged disambiguation and proportional residual rules apply to all
  solution construction
- trivial solutions are the degenerate case: they still publish admitted
  decomposition, but that decomposition may lawfully be one requirement, one
  design, one module, one component, one function, and one executable surface

## Thesis

The test35 vs test82 gap is a computation problem.

The general SDLC problem is also a computation problem. Every solution must
reduce ambiguity through staged surfaces before deterministic code can be a
trustworthy closure point.

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

## Disambiguation Axiom

The SDLC is a disambiguation pipeline.

Each stage reduces the ambiguity carried by the prior stage:

```text
Req ambiguity
-> design commitments
-> module/component topology
-> dependency ordering
-> evaluator-selected traversal
-> bounded source/test/build materialization
-> deterministic code
```

Deterministic code is the highest level of disambiguation. It is where the
remaining ambiguity has either been resolved into executable structure or
preserved as an explicit defect, TODO, failing test, blocked obligation, or
re-entry pressure.

This is why collapsing abstraction stages into code generation is unsafe. It
asks the final disambiguation stage to perform upstream ambiguity resolution
while also materializing the deterministic artifact. That can produce compiling
code, but it hides whether the ambiguity was actually resolved at the right
level.

## Proportional Residual Axiom

Residual disambiguation is measured inside the next smaller subsurface.

Each stage should reduce ambiguity with a bounded, roughly proportional fan-out:

```text
requirements <-n1 designs
designs      <-n2 modules
modules      <-n3 functions
functions    <-n4 code lines
```

The exact values are product-specific, but the ratios matter. A stage should
not collapse many unresolved requirements into one coarse downstream object,
and it should not explode one upstream object into an ungoverned swarm of
downstream work.

The proportionality rule protects attention. It keeps each worker or evaluator
inside a bounded surface where the local ambiguity can be seen, measured, and
resolved. If `n1`, `n2`, `n3`, or `n4` becomes too large for its stage, the
pipeline needs another abstraction/dependency stage before materialization.

This gives residual pressure a meaningful scale. A requirement-to-design gap is
not measured the same way as a module-to-function gap or a function-to-code-line
gap. Each residual belongs to its own subsurface, and closure should only fold
when the residual ambiguity in that subsurface is proportional to the next
lawful computation.

## Operational Admission Shape

The proportional residual axiom becomes enforceable when each abstraction
surface emits a measured decomposition summary.

Recommended carrier shape:

```json
{
  "decompositionSummary": {
    "stage": "requirements_to_designs",
    "upstreamKind": "requirement",
    "downstreamKind": "design",
    "upstreamCount": 77,
    "downstreamCount": 23,
    "fanoutRatio": 3.35,
    "maxAllowedFanoutRatio": 5,
    "maxOwnedUpstreamPerDownstream": 8,
    "overloadedDownstreamIds": [],
    "underDecomposedDownstreamIds": [],
    "unresolvedResidualCount": 0,
    "residualRefs": []
  }
}
```

The exact thresholds belong on the selected product construction profile or
edge assurance contract. The evaluator reads those thresholds and rejects the
surface when:

- fan-out exceeds the profile bound
- one downstream object owns too many upstream obligations
- a downstream object has no public boundary for the obligations it owns
- residual ambiguity is carried outside the subsurface that owns it
- a later materialization edge tries to compensate for a missing
  decomposition summary

This keeps the rule replayable. The evaluator does not need to guess whether a
surface "feels shallow"; it checks admitted counts, ownership rows, boundary
rows, and residual refs.

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

The test35 component names are evidence, not law. `TypeResolver`,
`CastRegistry`, `RunReplayService`, `MorphismExecutor`, and
`FidelityInvariantEngine` show that data_mapper's requirement set naturally
decomposes below module-level facades. They should seed comparison ratios and
review examples, but a current run must derive its component set from current
requirements and design rather than copy test35 filenames into runtime policy.

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

1. Production code materialization requires an admitted module decomposition.
   Trivial products still publish a one-module / one-component decomposition;
   there is no escape hatch that bypasses decomposition admission.
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

Measurable predicate sketch:

- requirement density =
  `ownedRequirementCount / max(1, substantiveComponentCount)`
- high-density component =
  `ownedRequirementCount > maxOwnedRequirementsPerComponent` or
  `requirementDensity > maxRequirementDensityPerComponent`
- substantive component =
  a component row with a public boundary, owned requirement ids, admitted file
  or package target, and at least one behavior-bearing implementation/test
  responsibility
- facade row =
  a row or file with high owned requirement count and no public boundary, no
  exported behavior-bearing symbol, or only package/re-export/rollup/status
  wrapper content
- under-decomposed module =
  a module whose high-density requirements are carried by facade rows and no
  admitted child component rows

The numbers are profile data. The predicates are runtime law.

## Data Mapper Proof Path

For data_mapper, the next proof path is not "run another full graph and hope
for depth." It is to insert the missing staged computations and then run. This
is the immediate proof target for the general method, not a data_mapper-only
special case.

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

## T-171 Consequence

This post does not invalidate the test82 RC4 runtime proof. It narrows what the
proof can claim.

test82 stands as evidence that T-171 closed the TypeScript runtime-authority
defect: typed F_P stage authority, evaluator-owned admission, execution
evidence, release ledgers, and closure projection all ran through the installed
operator.

test82 should not be cited as test35-depth product parity. If T-171 requires
like-for-like code/test depth with test35, then T-171 remains open on that
specific proof gate. If T-171 is scoped to runtime closure law, this staged
computation work should be the next design-reframe ticket rather than hidden
inside the RC4 closure narrative.

## Current RC Full Graph Review

The accepted data_mapper test82 RC4 analyzer reports 36 operator-run rows over
this 22-edge graph sequence:

```text
derive_intent_surface
-> derive_product_surface
-> derive_goal_surface
-> derive_requirement_surface
-> derive_uat_testcases_surface
-> derive_testcase_authority_surface
-> derive_feature_decomp_surface
-> derive_design_surface
-> derive_scenario_surface
-> derive_implementation_design_surface
-> derive_component_code_surface
-> qualify_component_realization_surface
-> derive_code_surface
-> derive_test_design_surface
-> derive_component_test_surface
-> prepare_test_execution_surface
-> derive_test_execution_result_surface
-> qualify_component_test_execution_surface
-> derive_component_repair_schedule_surface
-> derive_test_run_archive_surface
-> derive_release_depth_parity_surface
-> prepare_release_surface
```

The graph closed the runtime proof surface:

- final closure: `close`
- operator-run count: 36
- same-edge retries: 4
- repair attempts: 5
- blocked attempts: 6
- aborted attempts: 3
- total wall-clock: 17,465.6s
- final edge: `prepare_release_surface`
- final accepted execution evidence: `derive_test_execution_result_surface`

The graph also exposes the staged-computation gap. It jumps from
`derive_implementation_design_surface` to `derive_component_code_surface`
without an admitted implementation-module decomposition or module dependency
map. The accepted component-code edge carried 885 obligations into 9 source
files. It also jumps from `derive_test_design_surface` to
`derive_component_test_surface` without admitted test-module decomposition or a
test dependency map. The accepted component-test edge carried 1126 obligations
into 7 test files.

That is the functional divergence. The RC graph is strong on runtime authority,
execution admission, repair continuation, and release closure. It is weak on
the intermediate computations that determine whether the next surface is
properly bounded before materialization.

## Proposed Staged Graph

The next graph should preserve the RC graph's runtime authority and add the
missing intermediate disambiguation stages.

```text
derive_intent_surface
-> derive_product_surface
-> derive_goal_surface
-> derive_requirement_surface
-> derive_feature_decomp_surface
-> derive_design_surface
-> derive_implementation_module_surface
-> derive_module_dependency_map_surface
-> Eval_Action.select_steel_thread_or_parallel_build_traversal
-> derive_component_code_surface
-> qualify_component_realization_surface
-> derive_code_surface

derive_requirement_surface
-> derive_uat_testcases_surface
-> derive_testcase_authority_surface
-> derive_test_design_surface
-> select_test_stack_profile
-> derive_test_module_surface
-> derive_test_dependency_map_surface
-> Eval_Action.select_test_steel_thread_or_parallel_test_traversal
-> derive_component_test_surface
-> prepare_test_execution_surface
-> derive_test_execution_result_surface
-> qualify_component_test_execution_surface
-> derive_component_repair_schedule_surface
-> derive_test_run_archive_surface
-> derive_release_depth_parity_surface
-> prepare_release_surface
```

The two displayed branches are one governed graph. They are shown separately
only to make the implementation and test lifecycles legible. The test branch
depends on requirements and design evidence, and the implementation branch
depends on testcase pressure where executable behavior is part of product
closure.

Stage justification:

| Stage | What It Computes | Why It Exists |
|---|---|---|
| `derive_intent_surface` | product direction and purpose | fixes the top-level ambiguity before product claims are generated |
| `derive_product_surface` | product boundary and usable product identity | prevents requirements from being interpreted against the wrong product |
| `derive_goal_surface` | current work-wave focus | bounds which product pressure is active in this traversal |
| `derive_requirement_surface` | canonical obligations and residual requirement ambiguity | creates the upstream obligation set for every downstream computation |
| `derive_feature_decomp_surface` | behavior/feature clusters from requirements | groups requirement pressure before design and scenario work |
| `derive_design_surface` | design commitments to fulfill requirements | turns requirement ambiguity into architecture and behavior commitments |
| `derive_implementation_module_surface` | module/component topology, public boundaries, owned requirements, package/file targets | prevents component-code from inferring topology while materializing code |
| `derive_module_dependency_map_surface` | allowed dependencies, cycles, steel-thread candidates, parallel partitions | lets the evaluator choose traversal order without creating a second product carrier |
| `Eval_Action.select_steel_thread_or_parallel_build_traversal` | traversal method over the admitted dependency map | chooses a bounded vertical slice or dependency-isolated parallel work |
| `derive_component_code_surface` | source/build materialization for admitted component topology | writes deterministic implementation inside a bounded surface |
| `qualify_component_realization_surface` | realization admission against topology, lineage, and build contract | prevents source files from closing merely because they exist |
| `derive_code_surface` | code rollup projection over admitted component realization | summarizes realized code without owning new topology authority |
| `derive_uat_testcases_surface` | user/acceptance behavior obligations from requirements | creates behavior evidence pressure before test design |
| `derive_testcase_authority_surface` | canonical testcase authority and testcase ids | prevents tests from being invented only by implementation workers |
| `derive_test_design_surface` | evidence strategy, fixture strategy, and test classes of evidence | decides what kinds of tests prove the requirements |
| `select_test_stack_profile` | testing build tenant and test stack choice | treats the test stack as an evidence/product decision, not a default |
| `derive_test_module_surface` | test modules/classes/shards mapped to testcases and implementation components | prevents one broad test file from standing in for many behaviors |
| `derive_test_dependency_map_surface` | test dependencies, fixtures, module prerequisites, shard parallelism | lets the evaluator choose test steel-thread or parallel test traversal |
| `Eval_Action.select_test_steel_thread_or_parallel_test_traversal` | traversal method over admitted test dependency map | chooses first executable test spine or parallel test shards |
| `derive_component_test_surface` | materialized tests for admitted test topology | writes deterministic test artifacts inside bounded evidence surfaces |
| `prepare_test_execution_surface` | declared execution command, shard plan, environment, and prerequisite checks | prepares execution without pretending preparation is execution evidence |
| `derive_test_execution_result_surface` | observed runtime pass/fail evidence from declared commands | records execution facts that can clear or preserve residual pressure |
| `qualify_component_test_execution_surface` | admission of execution evidence against test topology | prevents release closure from using raw execution output without evaluation |
| `derive_component_repair_schedule_surface` | repair plan from admitted failures or residual pressure | routes failed execution back into bounded component/test work |
| `derive_test_run_archive_surface` | durable execution archive | preserves replayable execution evidence |
| `derive_release_depth_parity_surface` | parity/depth rollup over code, test, execution, and topology evidence | checks release depth against the selected profile and comparison target |
| `prepare_release_surface` | release closure projection | closes only after upstream topology, materialization, execution, and parity evidence are admitted |

## Backlog Zoom Function

`Eval_Action.zoom_or_continue` is the future traversal evaluator hook that
prevents the graph from being fixed too coarsely. It is split out of the active
staged-graph work and belongs to backlog ticket
`.ai-workspace/tickets/backlog/T-173-define-evaluator-zoom-admission-from-obligation-output-ratios.md`.

After any abstraction stage, the evaluator compares input obligations to output
entities:

```text
input obligations -> output rows
fanout ratio
max owned inputs per output
residual refs per output
public boundary count
substantive downstream responsibility count
```

If the ratio is proportional and residuals are scoped, traversal continues. If
the ratio is too large, the evaluator does not ask the next materialization
edge to absorb the ambiguity. It inserts or selects an intermediate zoom
traversal for that subsurface.

Examples:

- requirements -> designs is overloaded, so zoom through feature or requirement
  cluster decomposition before design closure
- designs -> modules is overloaded, so zoom through implementation-module
  decomposition before component code
- modules -> functions is overloaded, so zoom through component/function
  boundary decomposition before source materialization
- testcases -> test modules is overloaded, so zoom through test-module
  decomposition before test file generation

The zoom action is not a compatibility path and not a second closure law. It is
the evaluator selecting the next lawful disambiguation computation from the
current obligation/output ratio.

## Proposed Runtime Shape

The proposed staged graph above is the controlling graph shape. This compact
list names the new or strengthened authority surfaces and evaluator actions the
TypeScript runtime must make explicit:

```text
derive_requirement_surface
derive_design_surface
derive_implementation_module_surface
derive_module_dependency_map_surface
Eval_Action.select_steel_thread_or_parallel_build_traversal
derive_component_code_surface
qualify_component_realization_surface

derive_testcase_authority_surface
derive_test_design_surface
select_test_stack_profile
derive_test_module_surface
derive_test_dependency_map_surface
Eval_Action.select_test_steel_thread_or_parallel_test_traversal
derive_component_test_surface
prepare_test_execution_surface
derive_test_execution_result_surface
qualify_testcase_authority_surface
```

`select_test_stack_profile` is intentionally a selection stage, not a plain
derivation stage: it chooses among admitted evidence strategies and build
tenant capabilities. If this distinction is not preserved in code, it should be
renamed into the same carrier convention as the other stages.

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

## Realization Sequence

The implementation should be staged so the runtime does not absorb all of this
as one broad refactor:

1. Add decomposition summaries and evaluator checks to the existing
   implementation-design, component-code, testcase-authority, and component-test
   carriers.
2. Add or strengthen module dependency and test dependency carriers, then make
   evaluator actions choose steel-thread or parallel traversal from those
   admitted dependency maps.
3. Make test stack profile selection explicit and admit defaulting only when the
   selected evidence classes are satisfied by the implementation tenant.
4. Add materialization admission checks for high-density/facade/under-decomposed
   modules.
5. Re-run data_mapper as the reference proof after those predicates exist; use
   test35 as comparison evidence for ratios and depth, not as a filename
   template.

## Bottom Line

test35 was deeper because it computed abstraction before detail.

test82 was stronger in runtime law but shallower in construction topology.

The next line should generalize both:

```text
test82 authority and ledgers
+ test35 staged construction computation
= governed runtime closure over deeper product realization for every solution
```

That means reviewing every current surface for whether it owns a real
computational stage or is accidentally asking a later worker to infer the stage
while also materializing it.
