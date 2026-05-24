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

## Proposed Gap Analysis: F_P Review-Grade Edge Fulfillment

The next significant assurance gap is asset accountability against incoming
requirements. This is not a special code-review mechanism. Every generated asset
can undergo the same level of scrutiny: the evaluator asks whether that stage's
output actually realizes the incoming requirements, upstream authority, and
carried pressure with enough depth, quality, completion, and traceability to
justify closure.

Current depth review holds the transformer accountable for decomposition and
planning quality. The existing surface to strengthen is the per-edge fulfillment
path: `SdlcWorkerObligationAssessment` rows feed the
`SdlcEdgeFulfillmentLedger`, and that ledger is already the generic closure
authority for an edge.

```text
incoming requirements + accepted upstream authority + generated asset
  -> evaluate.C/F_P review-grade obligation assessment
  -> SdlcWorkerObligationAssessment rows + F_P findings
  -> SdlcEdgeFulfillmentLedger
  -> transformer retry work queue
  -> admitted closure only when asset obligations converge
```

### Current State

- Implementation-design depth has an F_P evaluator sidecar.
- Component-code closure is guarded by deterministic postflight, target-carrier
  checks, materialization evidence, and scalar evaluation blockers.
- The live run showed these guards can preserve enough pressure for retries to
  converge.
- There is no generic F_P prompt/admission pattern that makes existing
  obligation assessments review-grade for each asset.
- The most urgent first slice is component-code because the live failures showed
  source files can exist while still under-realizing the accepted depth and
  requirement pressure.

### Target State

Add stage-specific agentic `evaluate.C/F_P` obligation-assessment rules for
generated assets, starting with `derive_component_code_surface` and then
extending the same pattern to tests, scenarios, decomposition, design, and
release surfaces.

This is one instance of the general rule: every promoted stage review surface
should receive the same level of accountability for that stage's output.
Component-code assessment reviews source realization. UAT assessment reviews
testcase adequacy. Decomposition assessment reviews feature boundary depth.
Scenario assessment reviews scenario pressure and coverage. None of these
should be treated as weaker commentary once they are promoted into
`evaluate.C/F_P` admission.

The evaluator reads:

- incoming requirements and carried residual obligations
- accepted upstream authority rows for the stage
- the generated asset being evaluated
- asset-specific evidence such as files, rows, scenarios, test cases, or
  execution artifacts
- existing overlap evidence when available
- previous edge fulfillment and gap rows on retry

The evaluator writes compact review-grade obligation assessments, not a prose
review:

```text
review-grade obligation assessment
  -> stage and asset ref
  -> requirement or obligation ref
  -> upstream authority ref
  -> asset location, row ref, file path, symbol, test id, or scenario id when known
  -> review axis: depth | quality | completion | fit | traceability
  -> finding: pass | blocked | residual_pressure
  -> required action
  -> evidence refs
```

The admitted edge fulfillment rows are then treated as a transformer work queue.
A retry prompt must tell the transformer to work every blocked row to closure or
convert it into explicit residual pressure with evidence.

### Gap Matrix

| Current Surface | Gap | Target F_P Behavior | Fail-Closed Rule |
| --- | --- | --- | --- |
| Upstream authority surface | Proves accepted intent/design/scenario/test pressure, not necessarily downstream realization | Reuse upstream rows as accountability basis for the generated asset | Asset cannot close if it does not realize the accepted upstream authority |
| Asset existence contract | Proves files/rows/artifacts exist and are in declared roots | Check whether each asset item actually carries its assigned requirement pressure | Existence without semantic realization remains pressure |
| Requirement fulfillment ledger | Can show obligations mapped, but may not inspect asset adequacy | Review each asset against each incoming requirement and carried obligation | Unreviewed requirement-to-asset mapping blocks closure |
| Tests/execution evidence | Can prove observed behavior for declared commands | Treat passing tests as overlap, not as complete semantic review | Passing tests do not close unresolved accountability blockers |
| Scalar evaluation blockers | Useful but too coarse for asset-level accountability | Promote findings into durable row-level work orders | Blocked rows must be consumed by retry or preserved as residual pressure |

### Review Axes

The proposed F_P review-grade obligation assessment should hold each stage
transformer to account on these axes:

- `depth`: whether the asset realizes the declared stage shape and boundaries
  instead of collapsing requirements into shallow or global output.
- `quality`: whether the asset is coherent, maintainable, stage-appropriate,
  and avoids placeholders, dead paths, and fragile shortcuts.
- `completion`: whether every input requirement and carried residual obligation
  has a traceable, reviewable asset realization or an explicit blocker.
- `fit`: whether the asset is the right kind of output for the stage and does
  not smuggle work that belongs to another stage.
- `traceability`: whether requirement, authority, asset, and evidence refs are
  sufficient for replay and later overlap checks.

This is a stricter framing of depth review, not a new independent authority
surface. Depth asks whether the product was decomposed with enough semantic
force. Review-grade fulfillment asks whether that semantic force survived
transformation into the next asset and records the answer in the existing edge
fulfillment path.

### Incremental Slice

The first implementation slice should be small:

1. Strengthen the existing `SdlcWorkerObligationAssessment` prompt contract so
   assessment rows are review-grade for the current stage asset.
2. Add an F_P evaluate rule that writes component-code obligation assessments
   from requirements, accepted depth register, component rows, and materialized
   files.
3. Add F_D admission for assessment shape, refs, file paths, and row
   completeness.
4. Feed blocked edge fulfillment rows into the retry prompt as work queue rows.
5. Add closure checks proving component-code cannot close with unreviewed or
   blocked obligation-assessment rows.
6. Run JS hello world, Rust server hello world, and data mapper to compare
   retry quality against the current depth-only evaluator path.

The important boundary is that F_P reviews semantic asset adequacy while F_D
admits the assessment shape and evidence. F_D must not become the semantic
reviewer.

### Full Graph Evaluator Audit Table

This table records the current evaluator surface and the proposed next F_P
ledger against the optimized full SDLC graph. It is intentionally stage-by-stage
so stale graph assumptions or hidden evaluator surfaces are easier to audit.

The scrutiny standard is the same for each promoted edge: evaluate the stage
asset against its input obligations, write row-level blockers/residual pressure
into the existing obligation assessment path, feed those rows back as the
transformer work queue, and fail closure when unresolved rows remain. The
component-code assessment strengthening is the first source-facing slice, not
the only stage where this standard applies.

Current graph truth is `OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS`. Every stage
has the generic GTL evaluator pair declared by the graph module:

```text
<stage>_core_fd
<stage>_semantic_fp
```

Runtime currently adds one concrete agentic F_P evaluation rule:

```text
derive_implementation_design_surface
  -> evaluate.C/F_P design-depth register rule
```

The proposed next concrete evaluator rule is:

```text
derive_component_code_surface
  -> evaluate.C/F_P review-grade obligation assessment rule
```

| # | Stage | Current Evaluator Surface | Existing Edge-Ledger Strengthening |
| ---: | --- | --- | --- |
| 1 | `derive_intent_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review intent asset against seed inputs and declared scope through obligation assessments |
| 2 | `derive_product_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review product definition against intent and excluded scope through obligation assessments |
| 3 | `derive_goal_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review goals against product obligations and current work wave through obligation assessments |
| 4 | `derive_requirement_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review requirements against goals, testability, and traceability through obligation assessments |
| 5 | `derive_uat_testcases_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review UAT cases against requirements, scenarios, and obligation coverage through obligation assessments |
| 6 | `derive_testcase_authority_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review testcase authority refs, traceability, and executable-test intent through obligation assessments |
| 7 | `derive_feature_decomp_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review feature boundaries, independence, and carried pressure through obligation assessments |
| 8 | `derive_design_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review architecture, module responsibilities, and public boundaries through obligation assessments |
| 9 | `derive_scenario_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | review scenario breadth, edge pressure, and requirement coverage through obligation assessments |
| 10 | `derive_implementation_design_surface` | current agentic `evaluate.C/F_P` design-depth register plus F_D admission | existing implementation design-depth ledger remains primary |
| 11 | `derive_component_code_surface` | generic postflight/scalar evaluation over worker output | review source realization against requirements and accepted depth through obligation assessments |
| 12 | `qualify_component_realization_surface` | operator/evaluator qualification, no worker dispatch | consume strengthened edge fulfillment rows as overlap and fail-closed proof |
| 13 | `derive_code_surface` | projection/no-close rollup | no new transformer; project only admitted code truth and unresolved asset pressure |
| 14 | `derive_test_design_surface` | generic `F_D` postflight plus scalar `F_P.evaluate` result | possible future test-design depth ledger |
| 15 | `derive_component_test_surface` | generic postflight/scalar evaluation over test worker output | review test source against test design and requirements through obligation assessments |
| 16 | `prepare_test_execution_surface` | projection/no-close execution transition | none |
| 17 | `derive_test_execution_result_surface` | operator-owned execution evidence admission | review result evidence against declared execution contract through obligation assessments |
| 18 | `qualify_component_test_execution_surface` | operator/evaluator qualification of results against test design | consume strengthened source/test obligation pressure as overlap |
| 19 | `derive_component_repair_schedule_surface` | conditional worker/evaluator path under failure pressure | future repair-quality/depth ledger possible |
| 20 | `derive_test_run_archive_surface` | projection/no-close archive view | none |
| 21 | `derive_release_depth_parity_surface` | evaluator co-affirmation between code, tests, and archive | consume strengthened edge fulfillment rows as release parity input |
| 22 | `prepare_release_surface` | final release qualification | fail closed if any required obligation assessment remains unresolved |

The incremental proposal is not to implement every stage strengthening in one
slice. It is to name every generated asset as accountable to incoming
requirements, keep the existing implementation design-depth evaluator,
strengthen the first component-code F_P obligation-assessment prompt, and make
downstream qualification/release stages consume the existing edge ledger as
admitted pressure.

### Test35 Enforcement Check

The proposed review-grade edge-fulfillment pattern is necessary but not
sufficient to
reproduce the test35 data mapper outcome.

The test35 advantage was not simply better review after implementation. It
forced a deeper interpretation before implementation by inserting an
implementation-module authority surface between requirements and code. That
surface named component responsibilities, package/file structures, fulfillment
boundaries, and requirement-to-component assignments before the code writer ran.

Therefore the enforcement chain must be:

```text
requirements
  -> evaluate.C/F_P design-depth register with requirement-to-component depth
  -> transform.C/F_P component code realization
  -> evaluate.C/F_P review-grade obligation assessments against requirements and accepted depth
  -> SdlcEdgeFulfillmentLedger
  -> retry work queue
  -> closure only when design depth and code realization both converge
```

If the design-depth register remains coarse, the strengthened edge ledger can only
prove realization against a coarse topology. It can reject files that fail to
realize declared component depth, but it cannot by itself recover missing
component boundaries that were never admitted upstream.

The generic rule to add is:

```text
For every asset-producing edge, accepted upstream authority must decompose
requirement pressure to the granularity needed by that asset. For component-code
edges, accepted implementation design depth must decompose requirement pressure
into component-level realization rows when the requirement semantics imply
separable public boundaries. Component-code closure then fails if materialized
files collapse those declared boundaries back into a coarse module facade or
leave requirement-to-asset mappings unreviewed.
```

For data mapper, test35 is useful as an audit oracle, not as hard-coded runtime
truth. The depth evaluator should learn the pattern:

- compiler requirements imply separate type resolution, cast/unification,
  topology compilation, law validation, registry, and dry-run responsibilities
- executor requirements imply separate execution, manifest, replay, lookup,
  costing, synthesis, residue, late-arrival, and completion-gate
  responsibilities
- test requirements imply a richer test topology than a small module-level
  smoke set when the requirement algebra is broad

The strategy should therefore enforce test35-style properties, not test35
filenames. A future data mapper run should match or exceed test35 only when the
design-depth evaluator admits a sufficiently granular topology and the
F_P evaluator proves through edge fulfillment rows that the generated source
files realize it.

### Postmortem: T-164 Data Mapper Full Capability Live

Run inspected:

`build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260524T034346301Z_pid43157/workspace`

The run already proves the right pressure pattern: imperfect workers converged
because edge fulfillment rows, gap pressure, and retry prompts kept applying
pressure. The weakness is that the pressure mostly behaved like trace/tag and
schema accountability. The next iteration should strengthen the same existing
edge fulfillment path until it behaves like a real review of each generated
asset against its incoming requirements.

Observed convergence:

| Stage | Attempts | First Result | Final Result | What Forced Movement |
| --- | ---: | --- | --- | --- |
| `derive_implementation_design_surface` | 1 | 9 component topology rows, 9 component realization rows, local JSON validation passed | closed | F_P design-depth evaluator created the pressure map consumed by later transforms |
| `derive_component_code_surface` | 4 | 219/235 fulfilled, 1 partial, 15 blocked; compiler model/plan collapsed and multiple requirement traces missing | 235/235 fulfilled | F_P evaluation blocked missing trace and collapsed-component evidence; retry prompts carried gap rows forward |
| `derive_component_test_surface` | 2 | 71/240 fulfilled, 169 blocked | 240/240 fulfilled | F_P evaluation blocked missing test requirement traces, then retry completed the declared test files and tags |
| `derive_component_repair_schedule_surface` | 5 | repeated schema/status enum defects | closed | gap rows eventually forced valid repair target/status values |
| `derive_release_depth_parity_surface` | 6 | blocked on open executor repair/failure pressure | closed | repeated release-parity evaluation held open repair pressure until execution evidence and repair schedule aligned |

Transformer findings:

- The first component-code transform followed the admitted implementation design
  enough to create a broad Scala/Spark tenant, but it did not complete the
  requirement-to-source evidence contract.
- The first retry had the gap list, but the prompt did not yet state that the
  gaps were the worker's work queue. It repaired some structure while regressing
  obligation counts from 219 fulfilled to 162 fulfilled.
- Once the prompt pressure narrowed to concrete residual rows, the agent made
  targeted repairs: split compiler source responsibility, added native
  `// requirement:` tags, updated component rows, and closed the last residual
  bootstrap requirement.
- Terminal output was too large. Several workers printed large diffs or generated
  scripts instead of updating files and returning compact counts.

Evaluator findings:

- The F_P evaluator was effective at enforcing trace evidence and component
  boundary pressure. It caught collapsed compiler components, missing source
  tags, missing test tags, invalid repair schedule enums, and open release parity
  pressure.
- The evaluation was not yet review-grade in the code-review sense. It mostly
  asked "is there parseable evidence for the requirement?" rather than "does the
  asset plausibly implement the requirement with the accepted design boundary,
  correct behavior, maintainable structure, and enough test overlap?"
- The existing `SdlcEdgeFulfillmentLedger` is the right closure ledger to
  strengthen. A new code-review ledger is not needed for this release line. The
  F_P evaluator should produce review-grade obligation assessments and findings
  that feed the existing edge fulfillment path.

What "code review" means here:

```text
incoming requirements + accepted upstream authority + generated asset/diff
  -> F_P review of correctness, completeness, boundary fit, evidence, risk
  -> per-obligation assessment rows with evidence and required action
  -> existing SdlcEdgeFulfillmentLedger
  -> retry until rows are fulfilled or explicitly blocked as residual pressure
```

Code review is not a separate artifact class. It is one stage-specific form of
review-grade edge fulfillment. The same structure applies to UAT cases, testcase
authority, feature decomposition, design, scenarios, tests, repair schedules,
and release parity.

Actions for transformer prompts:

1. On every stage, build a checklist from incoming requirements, accepted
   upstream authority rows, target carrier rows, and current evaluated gaps
   before editing.
2. Treat current evaluated gaps as the worker's work queue. Do not return
   success while any row is unmapped; either fulfill it with evidence or preserve
   it as explicit residual pressure.
3. For source-producing edges, every fulfilled requirement must have an owning
   component row, source file path, parseable source tag, materialized file trace
   entry, and evidence ref.
4. For first attempts, apply the same checklist discipline even when there is no
   retry gap list yet. The agent should not wait for the evaluator to discover
   obvious missing requirement-to-asset mappings.
5. Keep stdout bounded. Write assets and validation files; return counts and
   touched paths only. Do not print full diffs, generated JSON, long scripts, or
   broad `git status` output.

Actions for evaluator prompts:

1. Evaluate the asset like a reviewer: inspect the generated asset against the
   incoming requirement, accepted upstream authority, declared boundary, evidence,
   and likely failure mode.
2. Use existing edge fulfillment rows as the output target. Each finding should
   map to `fulfilled`, `partial`, `blocked`, or `unassessed`, with evidence refs
   and a required action when not fulfilled.
3. Distinguish evidence classes: `trace_missing`, `semantic_not_realized`,
   `boundary_collapsed`, `wrong_stage`, `schema_invalid`, `execution_environment`,
   and `test_overlap_missing`.
4. Do not accept a requirement tag alone for high-pressure source behavior. A tag
   is trace evidence; the evaluator should also check that the nearby code or
   asset content plausibly implements the obligation.
5. Validate schema-local enum values and carrier shape before returning. The
   repair-schedule loop showed that missing enum pressure wastes iterations.
6. Emit compact blocker summaries to the CLI and durable row-level findings to
   the admitted evaluation/edge-fulfillment path.

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
- asset quality and review-grade fulfillment pressure
- traversal and next-action pressure
- parallel frontier pressure where the graph declares independent work

### Overlap

Critical facts must appear in more than one admitted surface:

- requirement ids appear in fulfillment pressure and design/component rows
- file targets appear in materialization contracts and component realization rows
- source modules appear in design-depth registers and strengthened edge
  fulfillment/test surfaces
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
| Asset adequacy | F_P review-grade obligation assessments | tests/lint/runtime evidence | edge fulfillment ledger plus evaluation rule outcome | unresolved assessment row, unreviewed requirement-to-asset mapping, or missing proof |
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

4. Strengthen F_P obligation assessment.
   Use the existing edge fulfillment path. Every close-capable
   worker-dispatched generated asset edge must run a separate selected
   `evaluate.C/F_P` review-grade evaluator process. The evaluator reviews the
   generated asset against input requirements, accepted upstream authority, stage
   boundary, and carried residual pressure, then emits review-grade obligation
   assessment rows. The retry transformer must treat blocked assessment rows as
   its work queue.

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
  decomposition, materialization, asset adequacy, execution, or traversal
  pressure

The target is not a perfect worker. The target is a system where imperfect work
cannot close unless the admitted evidence is complete.
