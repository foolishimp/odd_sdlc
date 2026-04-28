# Summary: test35 Gap After Two-Day TypeScript Attempts

**Status**: commentary synthesis  
**Date**: 2026-04-28  
**Scope**: `data_mapper.test35` capability gap versus the current
`odd_sdlc.TS` line through `data_mapper.test54.ts`.  
**Purpose**: compress the last two days of attempts into one surface so the
remaining solution can be reasoned about tonight.

## Existing Flow Post

The existing post/ticket that contains the state-machine comparison is:

`/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-076-reconcile-test35-and-typescript-deterministic-traversal-state-machines.md`

It contains:

- `Mermaid State Machine: Test35 Distributed Precedent`
- `Mermaid State Machine: Current TypeScript Observed In Test49`
- `Mermaid State Machine: Required TypeScript Contract`
- the total-function framing:
  `F_P.propose -> F_D.admit -> F_D.close -> event/gap/retry/reprice state`

The strongest quantitative pressure-loss review is:

`/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/claude/20260428T040000Z_REVIEW_test35-vs-test51-pressure-loss-under-odd-method.md`

The latest one-shot run postmortem is:

`/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260428T093352Z_POSTMORTEM_data_mapper_test54_one_shot_ts_build.md`

The lossy-obligation root-cause post is:

`/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260428T153000Z_ROOT_CAUSE_lossy_traversal_obligation_carriers.md`

## Executive Diagnosis

`test35` did not win because Python had better Scala templates.

It won because the Python line accidentally assembled a productive control
system:

```text
current workspace state
  + cumulative intent/context history
  + per-claim fulfillment ledgers
  + prior manifests/results
  + proof failures
  + continuation pressure
  -> next F_P traversal
  -> admitted artifacts
  -> proof/closure/gap events
  -> same workspace deepens
```

The TypeScript line has recovered several pieces:

- conform-project induction
- installed ABG/odd_sdlc topology
- public `gaps` and `start`
- one-command `start --until blocked`
- cumulative traversal intent package
- non-empty prompt-edge obligations
- typed blocking reasons
- postflight gap/retry path
- materialized source/test files
- test archive execution-evidence blocking

The remaining gap is now narrower and clearer:

```text
TS can traverse autonomously across edges,
but it still realizes too coarsely.

It does not yet decompose realization into planned work packages,
evaluate package-level output against the full obligation surface,
and productively re-enter/deepen completed realization work until
domain-shaped source, tests, and execution evidence converge.
```

## What test35 Actually Did

Reference workspace:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`

High-signal numbers:

- `4662` events
- `86` run starts
- `57` F_P dispatches
- `38` found/gap discovery events
- `3152` per-claim assessment / fulfillment-ledger events
- `82` F_P manifests
- `81` F_P result files
- `80` F_P ledger files
- `16` `derive_code_surface` run starts
- `9` `derive_test_run_archive_surface` run starts
- about `105` main Scala files
- about `35` Scala test files
- admitted test execution: `173` passing tests across `32` suites

The important behavior:

```text
edge output was not treated as "one file generated"

edge output was treated as:
  artifacts
  manifests
  ledgers
  proof facts
  gaps
  continuation pressure
  later replayable state
```

The heavy edges were revisited. `derive_code_surface` deepened over many
passes. Later test/design/archive pressure could point back to code. Prior
state was not forgotten.

That is the capability to preserve.

## Current TS Flow After The Latest Work

Latest external run:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test54.ts`

Command:

```bash
ODD_SDLC_TS_OUTPUT=json node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex
```

Observed autonomous edge sequence:

```text
Fg_conform_project
derive_intent_surface
derive_product_surface
derive_goal_surface
derive_requirement_surface
derive_feature_decomp_surface
derive_uat_testcases_surface
derive_design_surface
derive_scenario_surface
derive_implementation_design_surface
select_implementation_stack_profile
derive_implementation_module_surface
derive_code_surface
derive_test_design_surface
select_test_stack_profile
derive_test_module_surface
derive_test_run_archive_surface
```

Output:

- loop steps: `17`
- event rows: `88`
- closed vectors: `0..14`
- main Scala files: `7`
- main Scala LOC: `1113`
- test Scala files: `7`
- test Scala LOC: `449`
- `sbt test:compile` was reported during test-module work
- no admitted governed `sbt test` execution result

The final stop was a worker report contract bug:

```text
executionEvidence.status = not_run
admitted enum = succeeded | failed | pending
```

That has now been fixed in source by normalizing `not_run` to `pending` and by
making pending/non-executed test evidence block closure rather than pass as
test-run proof. The external workspace still needs a fresh rerun to prove the
installed behavior.

## Attempts And Failures

### Attempt 1: Treat TS As Already Having The Python Runtime Capability

Failure:

The early TS line had graph/catalog/start/hook pieces, but not a full installed
operator loop and not the Python-level continuation behavior. It could pass
internal tests while failing as a real external one-shot builder.

Correction:

Installer, public CLI, installed topology, ABG install population, and cold
agent bootstrap were built out.

Remaining lesson:

Internal tenant tests are not enough. `data_mapper.testNN.ts` remains the real
external acceptance harness.

### Attempt 2: Run Fresh data_mapper Workspaces Without Proper Project Induction

Failure:

`test50`/`test51` showed TS could begin downstream edges while the workspace was
not a conformant spec-method project. There was no proper
`specification/requirements/` folder, no build tenant root, and imported
documents were not converted into governed source truth.

Correction:

`T-087` made project induction a graph function:

```text
{ loose/random documents }
  -> Fg_ingress_project
  -> Fg_conform_project[F_D]
  -> structured spec_method project
```

This creates:

- `specification/PRODUCT.md`
- `specification/GOALS.md`
- `specification/requirements/`
- `specification/requirements/00-imported-sources.md`
- `.ai-workspace/context/project_bootstrap.md`
- `.ai-workspace/context/project_constraints.yml`
- `build_tenants/TENANT_REGISTRY.md`

Remaining lesson:

Bootstrap is just the first case of a general law:

```text
external context -> structured governed asset
```

Every edge can fail this way if its input is only prompt text and not admitted
source truth.

### Attempt 3: Strengthen Prompts Without Binding A Typed Intent Surface

Failure:

Prompt wording alone did not restore `test35` pressure. The worker needed the
actual A-to-B intent, source authority, prior edge state, output contract,
evaluator expectations, and gaps as a typed replayable package.

Correction:

`T-088` introduced the cumulative traversal intent package. The worker prompt
is now a projection over typed manifest authority, not independent prose.

Remaining lesson:

Better prompts help only when the prompt is derived from a typed obligation
surface. Otherwise it is prompt tuning, not governed compute.

### Attempt 4: Create Obligation Lists But Let Them Be Empty Or Thin

Failure:

Early edges could carry no obligations, and later edges could carry generic
IDs like:

```text
Fulfill live requirement REQ-LDM-004.
```

That is formal pressure, not semantic pressure. It can prove the worker saw an
ID. It cannot prove the worker was constrained by the requirement text,
acceptance criteria, source span, design/module obligation, or prior gap.

Correction:

`T-089` made prompt-bearing edges carry target, evaluator, requirement, and
prior-gap obligations, and made postflight reject missing, extra, unassessed,
or unevidenced blocked assessments.

`T-091` then identified the deeper defect: obligation carriers must preserve
payload, not just IDs and refs. The needed carrier is a traversal obligation
dossier:

```text
edge identity
source assets
target contract
required gain
authority obligations
design/module obligations
prior edge obligations
prior gap obligations
evaluator obligations
runtime context obligations
coverage contract
```

Remaining lesson:

The evaluator must be able to ask:

```text
Did the result match the requirement?
```

not merely:

```text
Did the worker claim the requirement ID was fulfilled?
```

### Attempt 5: Fix Postflight Failure But Leave It Outside Event Calculus

Failure:

`test49` reached `derive_code_surface`, wrote product files, then postflight
rejected relative paths. The visible bug was path basis. The serious bug was
that the failure stayed in an operator archive and returned prose:

```text
nextLawfulAction = repair_worker_output
```

No typed gap/continuation/retry state entered replay.

Correction:

`T-076` defined and implemented the required deterministic traversal state
machine:

```text
candidate result
  -> deterministic admission
  -> postflight pass/fail
  -> gap dossier when blocked
  -> continuation decision
  -> same-edge re-entry when lawful
```

Remaining lesson:

Archive files are not authority. A failure must become event/projection truth
or the graph cannot reason over it.

### Attempt 6: Manually Step Edges And Mistake That For One-Shot Operation

Failure:

`test53` advanced only because the operator manually repeated:

```text
gaps -> start -> gaps -> start
```

That is not the `test35` external behavior. From the outside, `test35` behaved
like one long-running build.

Correction:

`T-092` added the installed CLI effect shell:

```text
publicStartOnce = one pure ABG-backed transition
installed CLI start --until blocked = repeated lawful calls over ABG replay truth
```

`test54` proved one command can now traverse seventeen edges.

Remaining lesson:

The loop exists now at the operator-facing shell. It still needs better graph
structure and evaluation pressure to produce `test35`-level depth.

### Attempt 7: Build Assurance Ledgers But Not Yet Get test35 Depth

Failure:

Assurance dimensions were implemented or designed:

- materialization
- semantic convergence
- obligation carry
- requirement fulfillment
- ambiguity
- capability
- shallow realization

But assurance as unit tests is not the same thing as assurance driving
traversal. The run must be blocked, deepened, or repriced from those ledgers.

Correction:

The later postflight/obligation work began wiring the assurance path into the
operator, but the external proof is still incomplete.

Remaining lesson:

Assurance ledgers must be active graph pressure. If they only exist as archive
files or tests, they do not force the next traversal.

### Attempt 8: Let Code/Test Synthesis Happen As One Huge Edge

Failure:

`test54` generated real files, but shallowly:

- one broad `derive_code_surface` pass
- one broad `derive_test_module_surface` pass
- seven main files
- seven test files
- no live `sbt test` proof

This is better than a markdown scaffold, but not the enterprise-depth behavior
of `test35`.

Likely cause:

The graph jumps too directly:

```text
design/module surfaces -> code
test design/modules -> test archive
```

There is no explicit schedule/work-plan asset that decomposes design into work
packages, dependencies, acceptance checks, and re-entry conditions.

Correction opened:

`T-093` adds the missing scheduling phase:

```text
requirements/design/module surfaces
  -> schedule/work-plan surface
  -> planned realization package edges
  -> evaluation
  -> repair/deepen/reprice
```

Remaining lesson:

Depth should not depend on one enormous prompt. The graph needs intermediate
planned state so compute is distributed and evaluators can pressure narrower
units.

### Attempt 9: Produce A Test-Run Archive Without Running Tests

Failure:

`test54` reached `derive_test_run_archive_surface`, but the worker returned an
archive saying tests were not run.

Correction:

`T-094` normalized the status vocabulary.

`T-095` makes non-executed test evidence a pending/blocking state, not closure
evidence, when a test execution contract exists.

Remaining lesson:

For the test-run archive edge, "not run" is valid state but invalid proof.

## Current Fixed Versus Missing State

Fixed enough to keep:

- installed topology under `.abiogenesis/odd_sdlc/typescript`
- cold-agent bootstrap files
- `gaps` / `start` public UX
- project induction as `Fg_conform_project`
- cumulative traversal intent package
- non-empty obligation pressure on prompt-bearing edges
- typed blocking reasons
- postflight failure to gap/retry path
- one-command autonomous `start --until blocked`
- product-file materialization contract
- execution-evidence pending/not-run blocker

Still missing or unproven:

- fresh external rerun after the T-094/T-095 fixes
- governed live `sbt test` execution archive
- schedule/work-plan asset between design/module and code/test realization
- package-level realization edges instead of one broad code edge
- productive deepening after partial lawful closure
- package-level gap dossiers that point back to the exact work package
- proof that assurance ledgers actively block/deepen the operator path
- a `test35` comparator artifact applied to fresh TS evidence

## Root Cause In One Sentence

The TypeScript line recovered traversal control, but not yet productive
realization depth, because the current graph still asks broad edges to produce
large product surfaces in one pass instead of deriving an explicit schedule,
executing bounded work packages, evaluating each package against rich
obligation dossiers, and re-entering/deepening until evidence converges.

## Tonight's Implementation Hypothesis

The next solution should not be a Scala/data_mapper hack and should not expand
ABG unless the graph proves it must.

Implement the missing SDLC graph shape:

```text
ConformProject
  -> Intent/Product/Goals/Requirements
  -> Feature/UAT/Design/Scenario
  -> ImplementationDesign
  -> ImplementationModule
  -> RealizationSchedule
  -> ExecuteWorkPackage[n]
  -> EvaluateWorkPackage[n]
  -> RepairOrDeepenWorkPackage[n]
  -> AggregateCodeSurface
  -> TestDesign/TestStack/TestModule
  -> TestExecutionSchedule
  -> ExecuteTestPackage[n]
  -> EvaluateTestPackage[n]
  -> TestRunArchive
```

Minimum schedule carrier:

```text
RealizationWorkPackage {
  id
  source design/module refs
  required output files or file roles
  dependency package ids
  acceptance obligations
  evaluator obligations
  current status
  prior artifact refs
  prior gap refs
  retry/deepen eligibility
}
```

Minimum package loop:

```text
package state + cumulative intent + obligation dossier
  -> F_P proposal
  -> F_D admission/materialization
  -> assurance ledger fold
  -> ClosedPackage | RetryPackage | DeepenPackage | Reprice | HumanBlock
```

Expected effect:

- code generation becomes many smaller traversals, not one huge prompt
- tests can pull missing code packages back into the realization loop
- assurance registers become graph pressure rather than passive archive facts
- "continued until blocked" becomes meaningful because each next step has a
  smaller typed target

## Immediate Next Test

Run a fresh external successor after installing the current source:

```text
data_mapper.test55.ts
```

Expected minimum bar for the next run:

- no schema stop on `not_run`
- if tests are not run, block as pending/live-test-required
- if tests run, admit durable execution evidence
- schedule surface exists before code realization once T-093 is implemented
- code/test realization cites the schedule surface
- output has more than one realization package or an explicit typed reason why
  only one package exists

The next success criterion is not immediate parity with `105` Scala files.
The next success criterion is proof that TS has the same shape of productive
compute as `test35`: cumulative pressure, planned bounded work, active
evaluation, same-workspace deepening, and replayable closure or gap truth.

