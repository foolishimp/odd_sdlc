# STRATEGY: Testing Graph Functions And Test Assets

**Author**: codex
**Date**: 2026-04-11T01:45:52Z
**Addresses**: Graph-function-first buildout of testing carriers, test assets, and reusable harness defaults in `odd_sdlc`, using `test25` as the proving corpus
**Status**: Draft

## Scope Boundary

This note treats `test25` as the important proving corpus, not as a disposable failing run to be unblocked with a narrow workaround.

That means the objective is not:

- clear one eager evaluator and declare victory
- optimize for one fast exit path that leaves the testing branch shape incomplete

The objective is:

- make the testing branch match the intended builder pattern
- use `test25` to prove that the branch shape is correct end to end
- only accept smaller staged deliveries when they are direct steps toward that completed branch shape, not when they merely suppress the symptom

So this document remains architectural, but it is architectural in service of the live qualification corpus.

## Summary

The correct lens for the `odd_sdlc` testing buildout is not "automate tests" and not "write more test markdown."

The correct lens is:

- graph functions are structured build functions for agentic coders
- ABG gives those coders deterministic tools, envelopes, and event truth
- testing should be built through the same carrier pattern as implementation
- `generic_test_harness` should be a reusable qualification carrier family over project-specific stacks

This means the testing branch should be expressed as lawful graph-function families over explicit asset contracts, not as a late document-only side branch.

The core split is:

- code implementation path
- UAT test implementation path
- unit / integration / property test implementation path

These are related, but they are not the same path.

## Position

The builder guide already provides the right runtime and authoring law.

From the builder perspective:

- a semantic job binds a published graph function
- the graph function is the public structured build carrier
- ABG materializes and traverses its internal vectors against a cumulative environment
- deterministic law constrains where probabilistic construction may occur

That means the agentic coder is not "running a script."

The coder is using a lawful tool:

- named
- typed
- composable
- observable
- evidence-bearing
- closable

The practical purpose of GTL/ABG here is to put deterministic tools in the hands of probabilistic coders.

The runtime pattern is:

```text
authority / intake / request
-> graph-function invocation
-> F_D bind / materialize / environment resolve / preflight
-> F_P constructive turn on the current edge
-> F_D assess / proof / closure / event emission
-> recurse, continue, escalate, or close
```

This recursive interleaving is the point:

- probabilistic construction
- deterministic structure
- invariant enforcement
- event-based observability
- closure through declared law rather than token determinism

## Current odd_sdlc Read

The current qualification branch already contains the beginnings of the right pattern:

- `derive_uat_testcases_surface`
- `derive_test_design_surface`
- `select_test_stack_profile`
- `derive_test_module_surface`
- `derive_test_run_archive_surface`
- `qualify_testcase_authority`

The current catalog also already frames test stack as a reusable harness-selection concern rather than one hardcoded framework:

- `test_stack_profile` is described as selecting the concrete stack and harness conventions for the current generated test branch
- examples already include `pytest` and `Playwright`
- the proving subset already has reusable sandbox patterns

The current proving-subset constructor also shows the intended defaults:

- sandbox orchestration
- run archive policy
- comparative evidence projection
- later UI path kept open

So the right move is not to discard the existing qualification branch.

The right move is to complete it.

## The Missing Structural Piece

`test25` exposed the narrow structural gap:

- the test branch currently reaches test design, test stack, and test module planning
- but it does not yet have the realized test-asset / test-code carrier that is the sibling of `derive_code_surface`

That is why the branch currently overstates its own completion:

- `derive_test_module_surface` can describe test sources, suites, and requirement coverage
- but the workflow does not yet materialize governed test code under the code root
- later deterministic traceability then evaluates realized test-code conditions against a branch that only produced planning truth

This is not evidence that the testing branch concept is wrong.

It is evidence that the testing branch is missing its realization carrier.

More precisely, the branch currently collapses two different truths into one:

- planning traceability
- realized traceability

That collapse is the real design mistake exposed by `test25`.

## Target Testing Architecture

### 1. Code Implementation Path

Purpose:

- build executable product code from requirements through design and implementation structure

Shape:

```text
requirements
-> design
-> implementation design
-> implementation stack binding
-> implementation module design
-> code implementation
```

Representative binding story:

- requirements define what must exist
- design defines structure and constraints
- implementation ADR / stack binding selects the concrete technical realization
- module design defines implementation decomposition
- code surface materializes executable implementation assets

### 2. UAT Test Implementation Path

Purpose:

- construct requirement-facing acceptance assets from requirement truth and design truth

Shape:

```text
requirements + design
-> UAT test assets
-> UAT tests / testcase collections
-> testcase authority
```

This branch remains closer to product and scenario authority than to module-level implementation realization.

Its function is not to mirror the code tree.

Its function is to preserve acceptance truth.

### 3. Unit / Integration / Property Test Implementation Path

Purpose:

- construct implementation-dual test assets and realized test code from module/design truth and selected harness truth

Shape:

```text
design + scenario
-> test design
-> test stack / harness binding
-> test module design
-> test assets
-> realized test code
-> run archive / evidence
```

This is the yin/yang branch with implementation.

It is not a child of UAT.

It is the test-side realization branch over implementation-facing structure.

## generic_test_harness

`generic_test_harness` should be treated as a reusable qualification carrier family over project-specific stacks.

It should not mean one fixed testing framework.

It should mean:

- a governed harness contract
- reusable harness defaults
- explicit stack binding into project-specific execution technology

The general-purpose defaults should be extracted from the proving subset patterns already present in `odd_sdlc`.

Those defaults include:

- governed run archive model
- sandbox orchestration conventions
- comparative snapshot / report projection
- fixture / shared-session patterns
- traceability tagging conventions
- deterministic generated test roots and module layout
- reusable report-discovery and evidence projection rules

The concrete selected harness should still be chosen by the `F_P` process from implementation truth.

Examples:

- `sbt + scala + spark` -> ScalaTest / ScalaCheck / Spark-session harness
- `python` -> pytest / property-testing harness
- `react UX` -> Playwright / browser harness
- later branches may choose other lawful stack families

So the harness is generic at the carrier level, but specific at the selected binding.

## Test Stack Selection Must Depend On Implementation Truth

`select_test_stack_profile` should not be modeled as an isolated test-only choice.

It should be the bridge from implementation reality into qualification reality.

That means it should depend on some combination of:

- `implementation_design_surface`
- `implementation_stack_profile`
- `implementation_module_surface`
- `test_design_surface`

This is the right place for the `F_P` worker to decide:

- what harness family fits the build stack
- what default qualification patterns are reusable
- what generated test asset forms are appropriate for this branch

In other words:

```text
implementation design -> test stack design
```

is the right conceptual move.

## Asset Model For The Completed Testing Branch

The qualification branch should distinguish planning, harness, realization, and evidence.

Recommended shapes:

- `test_design_surface`
  - what is being proved and why
- `test_stack_profile`
  - which harness family and concrete stack are selected
- `test_module_surface`
  - logical decomposition, planned coverage, and ownership of the test branch
- `test_asset_surface`
  - generated harness-level assets, fixtures, scaffolds, generators, support files, config surfaces
- `test_code_surface`
  - realized test source under the governed code root
- `test_run_archive_surface`
  - governed archive / evidence projection
- `testcase_authority_surface`
  - authority lane for UAT/scenario qualification

Important law:

- planning surfaces may claim intended coverage, but only as planning traceability
- planning surfaces must not be treated as realized source truth unless a realization edge exists
- realized traceability should be evaluated against realized `test_code_surface`, not against planning markdown
- execution capability gating is about running tests and collecting returned evidence, not about designing or generating test assets

## Two-Stage Traceability Pattern

The correct pattern is not one monolithic `test_traceability_present`.

It is two traceability stages with different meanings.

### Planning Traceability

Purpose:

- prove that the planned test branch covers the intended requirement, design, module, and scenario obligations

Acceptable sources:

- `test_design_surface`
- `test_module_surface`
- `testcase_authority_surface`

Meaning:

- "this branch intends to validate these obligations"

This is a lawful planning claim.

It is not yet proof that governed test source exists.

### Realized Traceability

Purpose:

- prove that governed generated test assets or test code actually materialize the planned validation claims

Acceptable sources:

- `test_asset_surface`
- `test_code_surface`
- later execution evidence when present

Meaning:

- "these obligations are now realized in governed test assets or test source"

This is the traceability stage that should gate run archive, release preparation, and later execution qualification.

### Placement Rule

The workflow should therefore:

- assess planning traceability on planning surfaces
- assess realized traceability on realized test assets or test code
- never let a planning-only surface satisfy a realized-source deterministic gate

This is the direct fix for the `test25` mismatch.

## Concrete Implementation Targets

The next coder should not have to infer which files or evaluator names this strategy means.

The concrete implementation targets are:

- `build_tenants/odd_sdlc/python/code/odd_sdlc/traceability.py`
  - split planning-claim helpers from realized-source helpers
  - keep source scanning for generated test code explicit
- `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py`
  - add a planning-traceability evaluator
  - retain a realized-traceability evaluator for generated test code
- `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_contracts.py`
  - publish both evaluator contracts with clear descriptions
- `build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py`
  - attach planning traceability to the planning stage
  - attach realized traceability to the realized test-code stage
- `build_tenants/odd_sdlc/python/code/odd_sdlc/function_catalog.py`
  - update function intent strings so planning surfaces stop claiming realized source truth
- `docs/LLM_ODD_SDLC_GUIDE.md`
  - update the published chain description once the realized test branch exists

Recommended evaluator names:

- `planned_test_traceability_present`
- `realized_test_traceability_present`

Compatibility rule:

- keep `test_traceability_present` only as a temporary compatibility alias during transition if needed
- the steady state should use the two explicit names, not one overloaded name

Attachment rule:

- `planned_test_traceability_present` gates `derive_test_module_surface`
- `realized_test_traceability_present` gates the realized test-code stage, not the planning stage

## Boundary Between test_asset_surface And test_code_surface

This boundary must be concrete.

`test_asset_surface` means generated non-source or harness-shaping test payloads, for example:

- `build.sbt` test-scope additions
- `pytest.ini`
- Playwright config
- shared run scripts
- sandbox wiring
- report-discovery config
- fixture manifests
- support metadata for the selected harness

`test_code_surface` means executable governed test source under the governed code root, for example:

- `src/test/scala/**/*.scala`
- `tests/**/*.py`
- `*.spec.ts`
- Scala fixture source compiled or executed as part of the test branch
- property generators implemented as source files

Concrete examples:

- `SparkSessionFixture.scala` belongs to `test_code_surface`
- a ScalaCheck generator implemented in Scala source belongs to `test_code_surface`
- `build.sbt` test scope wiring belongs to `test_asset_surface`

If the first implementation wave does not need the distinction in code yet, it may collapse both into one realized test branch.

But if that happens, the collapsed branch must still be explicitly defined as realized, not planning.

## Migration And Validation Stance

`test25` remains the qualification corpus that exposed the branch defect.

But it should be treated as evidence, not as the workspace that must be resumed across graph-shape changes.

The migration stance is:

- preserve old event history as provenance
- prefer validating the corrected branch shape on a fresh installed workspace
- use `test25` to define the defect and acceptance criteria
- use a fresh successor run to prove the new graph shape end to end

This avoids forcing append-only old events to masquerade as if they were produced by a materially different graph.

## Meaning Of test_run_archive_surface Without Execution

The current method already gives the correct semantic baseline:

- if no governed execution evidence is returned, the completion state is `construction_complete_pending_execution`
- this is a valid construction state
- it is not the same thing as qualified release

So the intended behavior is:

- `test_run_archive_surface` may converge as an archive-construction surface without execution evidence
- `prepare_release_surface` may still be generated with `status: pending_evidence`
- later executional or operational qualification remains separately gated by declared capability and returned evidence

This strategy does not attempt to turn `pending_evidence` into `qualified`.

It ensures the testing branch reaches an honest construction state without falsely claiming realized traceability.

## Graph Function Design Pattern

The reusable pattern should look like this.

### Implementation family

```text
requirements_to_design
design_to_implementation_design
implementation_design_to_stack_profile
implementation_design_to_module_surface
implementation_module_surface_to_code_surface
```

### UAT family

```text
requirements_and_design_to_uat_asset_surface
uat_asset_surface_to_uat_testcase_surface
uat_testcase_surface_and_scenarios_to_testcase_authority
```

### Unit / integration / property family

```text
design_and_scenarios_to_test_design
implementation_design_and_test_design_to_test_stack_profile
test_design_and_test_stack_to_test_module_surface
test_module_surface_to_planning_traceability
test_module_surface_and_test_stack_to_test_asset_surface
test_asset_surface_to_test_code_surface
test_code_surface_to_realized_traceability
test_code_surface_and_test_stack_to_test_run_archive_surface
```

These should be authored as reusable graph-function families, then composed into one or more published executive carriers.

That keeps the graph lawful and still gives the agentic coder structured build functions rather than random scripts.

## Provenance and Runtime Meaning

This testing buildout should preserve the same provenance law as the rest of GTL/ABG.

The runtime meaning is:

- intent or authority opens the branch
- deterministic bind resolves the executable environment
- `F_P` performs constructive work on the current edge
- deterministic proof and closure decide whether that work lawfully advanced the branch
- events capture what happened, what remained open, and what evidence now exists

So the testing branch is not a side utility.

It is first-class governed constructive work.

## Design Consequences

1. Do not collapse UAT and unit-test realization into one surface.

2. Do distinguish planning traceability from realized traceability.

3. Do not let test-planning surfaces satisfy realized-source gates without a test-code carrier.

4. Do not hardcode one testing framework into the qualification branch.

5. Do let `generic_test_harness` provide reusable defaults that the selected stack profile specializes.

6. Do treat test stack selection as a bridge from implementation truth into qualification truth.

7. Do keep execution evidence gating separate from test-asset and test-code generation.

## Immediate Buildout Moves

### Move 1

Reframe `select_test_stack_profile` so it is not only `test_design_surface -> test_stack_profile`.

It should also see implementation-side truth.

### Move 2

Introduce a lawful realization carrier between `derive_test_module_surface` and `derive_test_run_archive_surface`.

That likely means:

- `test_asset_surface`
- `test_code_surface`

or one equivalent realized test branch if the distinction is not needed yet.

### Move 3

Extract the existing proving-subset sandbox patterns into a named `generic_test_harness` default library.

This should be published as an `odd_sdlc` qualification module boundary backed by reusable templates and helper assets, not just by prose.

It should provide reusable defaults without fixing the concrete selected stack.

### Move 4

Split deterministic traceability into:

- planning traceability on planning surfaces
- realized traceability on realized test code or governed test assets

### Move 5

Publish distinct qualification families for:

- `uat_qualification`
- `developer_qualification`

Both should later feed `prepare_release_surface` through explicit contract references rather than through one overloaded "tests" branch.

## Recommended Framing For The Next Wave

The next wave should be framed as:

`Build out qualification graph functions so the testing branch has the same lawful realization pattern as the implementation branch, using generic_test_harness defaults and implementation-informed test stack selection.`

That keeps the work:

- graph-function-first
- reusable
- algebraically legible
- faithful to the builder guide
- consistent with the agentic-coder runtime lens

## Closing Position

Graph functions are structured build tools for agentic coders.

For the testing branch, the right buildout is not a pile of test documents and not an ad hoc scripting layer.

The right buildout is:

- reusable testing graph functions
- reusable test asset contracts
- reusable harness defaults
- implementation-informed stack binding
- realized test-code carriers
- eventful proof and closure over those produced assets

That is the correct lens to apply to the buildout of testing graph functions and test assets in `odd_sdlc`.
