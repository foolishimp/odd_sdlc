# Strategy: Layered Assurance For Fallible Workers

## Claim

ODD SDLC should not depend on a single worker, evaluator, extractor, or test
run becoming perfectly reliable. The next iteration should audit and align the
system so fallible workers become a perfect assurance process.

Perfect assurance here means process perfection inside the declared closure
law:

- every accepted closure has passed every required independent assurance gate
- every uncertainty becomes residual pressure, retry pressure, human callout, or
  a blocker
- no hidden surface can satisfy authority outside the selected GTL/ABG compute
  path
- no product fact closes from stdout, archive existence, parser fallback, or a
  compatibility bridge

This is the engineering version of making a high-risk system reliable with
imperfect components: layer, overlap, test, audit, and fail closed.

## Current Operating Model

The intended compute spine remains:

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

The semantic hierarchy is:

```text
selected evaluate.C/F_P over workspace
  -> highest semantic/product judgment

F_D admission guards
  -> shape, identity, provenance, consistency, boundedness, fail-closed checks

ABG system
  -> runtime events, ledgers, admission, replay, provenance, continuation

ODD SDLC
  -> product semantics, prompts, register policy, pressure interpretation,
     analyzer/read-model projection
```

## Current State Observed

Live data mapper run:

```text
test_env/test_runs/t164_data_mapper_full_capability_live/
  20260524T034346301Z_pid43157
```

Current behavior shows the strategy is directionally working, but not yet clean
or consistent.

### Working

- The F_P design-depth evaluator is a separate agentic evaluator process for
  `derive_implementation_design_surface`.
- It writes its own prompt, stdout, stderr, run result, process events, register,
  and rule-outcome artifacts under the operator-run archive.
- Component-code failed, preserved pressure, retried, and converged.
- Component-test failed, preserved pressure, retried, and converged.
- Execution preparation/result/qualification passed after component-test
  convergence.
- The evaluator is correctly preventing early closure when trace, schema, or
  obligation pressure is missing.

Observed retry pattern:

```text
component_code attempt 1 -> 47 blockers
component_code attempt 2 -> 144 blockers
component_code attempt 3 -> admitted, zero blockers
component_code follow-up -> admitted, zero blockers

component_test attempt 1 -> 507 blockers
component_test retry -> passed, zero blockers
```

This supports the core strategy: imperfect workers can converge when evaluator
pressure is preserved and replayed.

### Partially Implemented

Only the implementation-design register currently has a separate evaluator CLI:

```text
design_depth_fp_evaluator_prompt.md
design_depth_fp_evaluator_stdout.log
design_depth_fp_evaluator_stderr.log
design_depth_fp_evaluator_run.json
design_depth_fp_evaluator_register.json
design_depth_fp_evaluator_rule_outcome.json
```

Most other evaluation stages write only:

```text
fp_evaluate_result.json
```

Some operator-owned qualification/execution stages also write:

```text
installed_operator_evaluation_artifact.json
```

Those are not separate evaluator terminals. Component-code and component-test
evaluation are currently scalar/operator evaluation surfaces that produce
ledgers and blockers. The retry transformer then works those ledgers.

If the product direction is "agentic evaluate.C/F_P over the workspace for each
ambiguous evaluation stage," then code/test/coverage/code-quality evaluation
still needs additional evaluator-rule processes.

### Priority F_P Review Surface: Depth

If only one additional product concern receives an agentic F_P evaluator first,
it should be depth.

Depth is the priority because it is the highest-risk ambiguity surface. A worker
can satisfy schemas, create files, pass narrow tests, and still collapse the
real product into shallow surfaces. Depth is where F_P should decide whether
the construction is proportionate to the requirements and whether residual
pressure remains visible enough for the next transform.

Depth is where deterministic checks are least sufficient. F_D can validate
schema, enums, trace marker presence, file existence, digest, command status,
and target-carrier shape. It cannot reliably judge whether the work is
substantive enough, whether the component split is proportionate, whether
requirement pressure was collapsed into a shallow global tag list, or whether
the worker avoided the hard semantic obligation by producing valid but thin
surface area.

The depth evaluator should review:

- decomposition proportionality
- requirement pressure density per component/test/repair row
- source/test file ownership against declared component boundaries
- public-boundary specificity
- missing or collapsed modules
- shallow realization and placeholder code
- overbroad global requirement tagging
- whether residual pressure is explicit instead of hidden
- whether repair rows bind concrete evidence or merely restate failure

The depth evaluator's output should be a compact depth-pressure register that
the next transformer treats as a work queue. It should not be a prose review.
It should produce rows like:

```text
depth row -> owning component -> affected file/test/repair row
  -> pressure reason -> required action -> evidence refs
```

The existing implementation-design F_P register is the first version of this
pattern. The next iteration should generalize it so component-code,
component-test, repair-schedule, and release-depth parity can all receive a
depth-oriented F_P evaluation surface when ambiguity is high.

### Exposed Gaps

1. Retry prompts preserve pressure, but they are not tight enough.
   The prompt lists current evaluated gaps, but it must say explicitly that the
   gap ledger is the worker's work queue and that the worker must work through it
   until every row is mapped or explicitly blocked.

2. Current evaluated gap compaction missed non-`workspace.*` requirement ids.
   Data mapper ids such as `data_mapper.intent.req_int_003` were present in raw
   evaluator reasons but were not promoted into the compact blocked-obligation
   section. This weakened the retry prompt.

3. Worker stdout is still too large.
   The workers are using terminal narration as work trace. The durable artifact
   should be the work product; stdout should be bounded telemetry.

4. Repair-schedule prompts omitted schema enums.
   The live run exposed missing prompt constraints for `repairTarget` and
   `attributionConfidence`. The evaluator caught these as schema-local blockers,
   but the prompt should have supplied the allowed values up front.

5. There is still a difference between evaluator-generated pressure and
   evaluator-as-agentic-process.
   The current scalar evaluator can generate useful ledgers, but it is not the
   same as an agentic evaluator that inspects the workspace, writes an evaluation
   artifact, validates it, and iterates before returning.

### Source Fixes Made During This Run

- Added explicit retry wording: current evaluated gaps are the worker's work
  queue.
- Added retry coverage contract: each blocked requirement obligation must map to
  component, source file, source tag, component realization row, and
  materialized-file trace entry, or become explicit residual pressure.
- Fixed current-gap requirement-id extraction to promote non-`workspace.*`
  product requirement ids into the blocked-obligation section.
- Added prompt visibility for repair schedule `repairTarget` allowed values.
- Added prompt visibility for repair schedule `attributionConfidence` allowed
  values.

These source fixes affect future generated prompts. They do not rewrite prompts
already launched inside the active live run.

## Assurance Strategy

The path from a 90 percent worker to a 100 percent assurance process is not a
stronger single prompt. It is a layered system where independent surfaces make
different kinds of mistakes visible.

The next iteration must make four commitments explicit:

1. Prompts are tuned for an agentic worker over a live workspace.
   The worker is not a single-shot API completion. It can inspect bounded
   authority, make a plan, edit files, validate, repair, and repeat. The prompt
   must give enough autonomy to manage the workspace while sharply bounding
   authority, output surfaces, stdout, and closure conditions.

2. Multiple ledgers preserve pressure across the whole surface.
   No single ledger is expected to carry all truth. Requirement fulfillment,
   design-depth, materialization, semantic evaluation, execution evidence, code
   quality, traversal, and parallel frontier pressure overlap. This overlap is
   the reliability mechanism.

3. Ledgers are work orders.
   A ledger is not just an audit artifact after the fact. It is the worker's
   bounded work queue. The worker reads the ledger to understand what must be
   done, groups it into repair batches, updates artifacts, validates coverage,
   and then moves to the next ledger row.

4. Evaluation iterates toward convergence.
   Evaluators are also fallible, so convergence comes from repeated
   transform/evaluate loops, independent overlap, fail-closed admission, and
   residual pressure preservation. The target is 100 percent closure-law
   convergence from imperfect processes, not one perfect judgment.

The ledger is the durable work queue. It should not be treated as a giant
instruction blob or as a final audit report. A worker should be able to work
through ledger pressure at its own pace:

```text
ledger rows
  -> grouped repair checklist
  -> bounded repair batch
  -> artifact edits
  -> local coverage check
  -> remaining ledger rows
```

The return condition is strict even when the work loop is flexible: no worker
returns success while a required ledger row remains unmapped, unassessed, or
unexplained as residual pressure.

### Layer

Each product closure must be covered by multiple evaluator perspectives:

- obligation and fulfillment pressure
- design-depth and decomposition pressure
- materialization and target-carrier pressure
- semantic intent-fit and residual ambiguity pressure
- execution and test evidence pressure
- code quality and review pressure
- traversal and next-action pressure
- parallel frontier pressure where the graph declares independent work

### Overlap

Critical facts must appear in more than one admitted surface:

- requirement ids appear in fulfillment pressure and design/component rows
- file targets appear in materialization contracts and component realization rows
- source modules appear in design-depth registers and code-review/test surfaces
- test obligations appear in testcase authority, execution evidence, and
  requirement fulfillment
- selected composition identity appears in transform, evaluation, consequence,
  and analyzer projections

Overlap is deliberate. If one worker drops a fact, a different gate should see
the inconsistency.

### Iterate

The system should expect partial work:

```text
transform attempt
  -> evaluation set
  -> residual pressure
  -> retry with prior pressure
  -> evaluation set
  -> close or block
```

Retry is not failure. Silent closure with missing pressure is failure.

### Fail Closed

Missing evidence is not accepted as "probably okay." It is pressure.

The closure law should reject:

- unassessed obligations
- missing requirement trace evidence
- component rows collapsed into unowned files
- materialized files without target-carrier authority
- parser fallback or archive existence as authority
- F_D-only admission where selected evaluate.C/F_P is required
- stale selected-composition identity
- analyzer/runtime drift
- feature flags or compatibility bridges that can satisfy live authority

## Audit Target

The next work iteration should be an audit and consistency pass. Its purpose is
to prove that every closure path routes through the same compute spine and that
every pressure surface is either authoritative, derived from authority, or
deleted.

Audit every interface in these categories:

1. Graph selection and compute composition
   - selected graph function
   - selected composition ref and digest
   - selected regime binding
   - transform.C, evaluate.C, consequence.C stage bindings

2. Transform authority
   - worker prompt source
   - construction brief
   - invocation package
   - transform result
   - worker report as projection only

3. Evaluation authority
   - evaluation rule set
   - F_P design-depth register rule
   - retained F_D evaluator registers where still lawful
   - F_P evaluation findings
   - residual pressure refs
   - admission evidence tying sidecars to selected evaluation outcome

4. Ledger and assurance authority
   - obligation fulfillment ledger
   - requirement closure register
   - materialization contract/admission
   - postflight result
   - gap dossier
   - assurance fold
   - closure decision

5. Consequence and replay authority
   - consequence.C projection
   - next-action projection
   - traversal transition
   - replay continuation
   - analyzer projection

6. Compatibility and bypass removal
   - feature flags
   - parser aliases
   - synthetic identity creation
   - filesystem existence admission
   - archive scan fallbacks
   - analyzer-only validation logic
   - legacy deterministic bridges

## Coverage Contract

Every product edge should have a compact coverage matrix:

| Closure Concern | Primary Surface | Overlap Surface | Runtime Proof | Fail-Closed Condition |
| --- | --- | --- | --- | --- |
| Requirement fulfillment | obligation ledger | trace/register rows | evaluation result | missing/unassessed/blocking obligation |
| Decomposition | design-depth register | component realization rows | downstream transform pressure | collapsed/unowned component |
| Materialization | materialization contract | worker report projection | product materialization manifest | missing role, wrong root, replay mismatch |
| Code quality | code-review register or diagnostics | tests/lint/runtime evidence | execution evidence | unresolved diagnostic or missing proof |
| Semantic fit | evaluate.C/F_P finding | residual pressure refs | ABG evaluation ledger | partial, ambiguous, or stale evidence |
| Execution | test execution register | requirement closure | test/run artifact | no run, failed run, or undeclared skip |
| Traversal | closure decision | next-action projection | ABG replay event | missing fold, stale identity, bypassed consequence |

This matrix is the target shape for the audit. If a closure concern lacks a
primary surface, overlap surface, runtime proof, or fail-closed condition, the
system has an assurance gap.

## Prompt Strategy

Agentic F_P workers should not be asked for a single-shot answer. Each stage
prompt should require:

- read the one compressed governance reference for the work category
- make a plan and checklist
- inspect only bounded authority needed for the current checklist item
- write the contracted artifact early
- validate the artifact locally
- repair from validation and evaluation pressure
- keep stdout bounded
- respond with a short final status only

The durable artifact is the work product. Terminal narration is not truth.

## Next Iteration Work Plan

1. Inventory all authority surfaces.
   Produce a table of public/private carriers, their owner, producer, consumer,
   and whether they are authoritative or projection-only.

2. Delete bypasses first.
   Remove or demote feature flags, parser aliases, archive existence admission,
   synthetic selected-composition identity, and F_D-only live authority paths.

3. Normalize evaluator outputs.
   Keep evaluate.C as the place where F_D/F_P/F_H composed rules produce
   findings, registers, diagnostics, and residual pressure. Keep ABG as the only
   writer of admitted event and ledger truth.

4. Add a code-quality pressure surface.
   Either define a compact code-review register or explicitly route code-review
   pressure through existing execution/materialization diagnostics. Do not leave
   code review as an implicit bucket.

5. Add matrix tests.
   For each closure concern, add positive and negative tests proving the primary
   surface, overlap surface, runtime proof, and fail-closed condition.

6. Prove with live sandboxes.
   Run JS hello world, Rust server hello world, and data mapper. Closure is not
   just pass/fail; proof must show that every accepted edge carried the expected
   pressure and every retry preserved residual pressure.

## Success Standard

The system is ready for the next release candidate when:

- live default execution requires selected evaluate.C/F_P where required
- F_D checks are guards, not substitute semantic authority
- every admitted closure has overlapping evidence
- every known bypass is removed or explicitly projection-only
- analyzer output and runtime admission agree on the same authority surfaces
- data mapper can fail, retry, and converge without losing requirement,
  decomposition, materialization, code-review, execution, or traversal pressure

The target is not a perfect worker. The target is a system where imperfect work
cannot close unless the admitted evidence is complete.
