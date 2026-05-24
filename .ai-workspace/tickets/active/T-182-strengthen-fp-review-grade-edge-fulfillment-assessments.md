# T-182 Strengthen F_P Review-Grade Edge Fulfillment Assessments

- id: T-182
- title: Strengthen F_P review-grade edge fulfillment assessments
- type: realization_refactor
- ticket_category: implementation_migration
- status: active
- proof_status: not_started
- build_tenant: typescript
- goal: make every generated SDLC asset accountable to its incoming requirements through review-grade `evaluate.C/F_P` obligation assessments on the existing edge fulfillment path, and force explicit semantic depth before code whenever requirements imply separable asset boundaries
- change_intent: consolidate the T-164 data mapper live-run postmortem and the historical data-mapper depth comparison into a targeted prompt/evaluator refactor that strengthens `SdlcWorkerObligationAssessment -> SdlcEdgeFulfillmentLedger` instead of adding a second code-review ledger
- change_class: design_reframe
- re_entry_point: runtime_governance
- first_missing_layer: generic F_P depth predicate and review-grade F_P evaluation over generated assets before edge fulfillment closure
- triaged_at: 2026-05-24
- created_at: 2026-05-24
- updated_at: 2026-05-24
- migration_strategy: strengthen_existing_edge_fulfillment_no_new_review_ledger
- target_truth: accepted upstream design depth plus existing edge fulfillment rows and ledger contain review-grade asset adequacy judgments for each generated asset against incoming requirements and accepted upstream authority
- superseded_truth: trace/tag-only fulfillment, schema-only blocking, or a separate proposed code-review ledger as closure authority
- closure_law: a requirement-bearing asset-producing edge closes only when selected `evaluate.C/F_P` has first accepted enough upstream depth for the asset class and then reviewed the generated asset against incoming requirements, accepted upstream authority, stage boundary, evidence, and likely failure modes, then recorded fulfilled/partial/blocked/unassessed rows through the existing edge fulfillment path with no unresolved required rows
- evaluation_criteria: deterministic tests prove prompt contract, evaluator finding shape, retry work-queue behavior, no new review ledger authority, fail-closed unresolved assessments, and fail-closed coarse topology when requirements imply separable public boundaries; live JS hello world, Rust server hello world, and data mapper reruns show pristine closure with compact prompts and no loss of requirement/design/materialization/test/release pressure
- non_closure_conditions: new parallel code-review ledger, F_D semantic review substitution, tag-only fulfillment, coarse upstream topology accepted for high-depth requirements, missing first-attempt checklist, unresolved gap rows returning success, broad stdout dumps, analyzer/runtime drift, source-specific runtime code, or live closure that depends on filesystem/archive existence instead of selected evaluation truth
- proof_surface: this ticket, T-181 design-depth ticket, RC3 compute-stage design module, T-164 data mapper live-run archive, historical data-mapper depth comparison post, strategy post `20260524T042351Z_STRATEGY_layered_assurance_for_fallible_workers.md`, focused T-182 tests, semantic suite, and live sandbox archives
- depends_on:
  - T-181

## Intake

The T-164 data mapper full capability live run converged, but the postmortem
shows the system relied too heavily on trace/tag and schema pressure before it
closed.

Observed run:

`build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260524T034346301Z_pid43157/workspace`

Observed pattern:

- `derive_component_code_surface` needed four attempts: `219/235`, then a
  regression to `162/235`, then `234/235`, then `235/235`.
- `derive_component_test_surface` needed two attempts: `71/240`, then
  `240/240`.
- repair schedule attempts repeatedly failed on enum/schema pressure before
  converging.
- release parity remained open until repair and execution evidence aligned.

The positive result is that edge fulfillment pressure eventually forced
convergence. The defect is that the force was mostly "is there parseable
evidence?" rather than "does this generated asset adequately realize the
incoming requirement under the accepted upstream authority?"

Follow-up live evidence from
`build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260524T100156523Z_pid95067/workspace`
showed a second realization defect: generic document/design nodes emitted the
transformer CLI process artifacts and an in-process `fp_evaluate_result.json`,
but did not spawn a separate selected `evaluate.C/F_P` reviewer CLI. The
review-grade rule had drifted into a component-code/test-only gate. That is not
the target truth for this ticket. Every close-capable worker-dispatched
generated asset edge must carry the external F_P review-grade evaluator process
as admitted stage truth.

The historical data-mapper depth comparison showed the same defect at a deeper
level. A run with an explicit requirement-to-component interpretation surface
forced more implementation depth before code. A later TypeScript run closed
correctly over a coarser component topology, so the ledgers certified less
product depth. This ticket must implement the explicit behavior needed in the
current TypeScript graph, not rely on shorthand references to that older run.

## Target Truth

There is no new `code_review_ledger`.

The generic closure surface remains:

```text
evaluate.C/F_P findings
  -> SdlcWorkerObligationAssessment rows
  -> SdlcEdgeFulfillmentLedger
  -> SdlcEdgeClosureDecision
  -> SdlcNextActionProjection
```

Every generated asset is reviewable at the same level of accountability:

```text
incoming requirements + accepted upstream authority + generated asset/diff
  -> F_P review of depth, quality, completion, fit, traceability, and risk
  -> per-obligation assessment rows with evidence and required action
  -> existing edge fulfillment ledger
  -> retry until fulfilled or explicitly blocked as residual pressure
```

For source code, this is code review. For UAT cases, it is UAT adequacy review.
For feature decomposition, it is boundary-depth review. For scenarios, it is
scenario pressure review. For repair schedules, it is repair attribution and
actionability review. The syntax and closure path do not change.

## Required Runtime Behavior

The target is explicit semantic pressure, not filename equivalence with any
historical run:

```text
requirements
  -> evaluate.C/F_P design-depth predicate
  -> accepted component-level realization rows when requirement semantics demand them
  -> transform.C/F_P component code realization
  -> evaluate.C/F_P review-grade edge fulfillment
  -> retry work queue
  -> closure only when accepted depth and generated assets both converge
```

The implementation must add these executable behaviors.

### Design-Depth Evaluation Behavior

Selected `evaluate.C/F_P` for `derive_implementation_design_surface` must read:

- incoming requirement rows and requirement text
- accepted design and scenario authority
- target carrier rows for implementation design
- existing module, component topology, realization, dependency, and file-target
  rows
- current evaluated gaps when this is a retry

It must produce admitted design-depth findings that say whether each
requirement or requirement group is:

- `separable_public_boundary_required`
- `shared_component_allowed`
- `test_boundary_required`
- `data_contract_boundary_required`
- `runtime_or_persistence_boundary_required`
- `human_review_required`
- `blocked`

For each required boundary, the admitted implementation-design carrier must
contain enough row-level authority for downstream work:

- owning component id
- owned requirement ids
- public boundary or exported responsibility
- implementation responsibility
- file or package path expectation
- dependency refs when ordering matters
- expected test or qualification overlap
- evidence refs and rationale

The design-depth evaluation fails closed when:

- a requirement is not assigned to any implementation boundary
- one coarse component row owns unrelated responsibilities without an explicit
  cohesion rationale
- a required public/runtime/data/test boundary has no component-level row
- a file target exists without a component realization row
- a component realization row has no requirement ids
- the evaluator cannot explain why shared implementation is sufficient

### Transformer Behavior

Selected `transform.C/F_P` workers for asset-producing edges must treat the
accepted upstream rows as their work queue:

- before editing, build a checklist from requirement ids, accepted authority
  rows, target carrier rows, and expected artifacts
- implement or update artifacts against that checklist
- write compact status output; durable files carry the details
- return no success while required checklist rows are unmapped
- on retry, read evaluated gap rows as mandatory work items

For source-producing edges, each generated or repaired source asset must carry:

- owning component row ref
- source file path
- implemented requirement ids
- parseable source evidence tag or equivalent admitted trace
- materialized-file trace entry
- evidence ref linking the source asset to the accepted depth row

### Component-Code Evaluation Behavior

Selected `evaluate.C/F_P` for component code must review generated source
against accepted implementation-design depth, not against tags alone. It must
mark rows non-fulfilled when:

- source exists but does not implement the accepted component responsibility
- source collapses multiple accepted component rows back into a coarse facade
- requirement tags are present but behavior is not plausibly realized
- public boundary, error contract, data contract, runtime behavior, or test
  overlap required by the accepted depth row is missing
- source file paths or package structure conflict with accepted authority
- tests or qualification surfaces do not overlap the implemented requirement

### Closure Behavior

Closure must consume the existing `SdlcWorkerObligationAssessment ->
SdlcEdgeFulfillmentLedger` path. It must not introduce a second review ledger.

Closure fails when any required generated-asset row is:

- `blocked`
- `partial`
- `unassessed`
- missing a required action
- missing selected `evaluate.C/F_P` evidence
- admitted only by tag/path/schema evidence without semantic review

## Existing Surfaces To Strengthen

- `SdlcWorkerObligationAssessment`
  - existing row shape for obligation id, fulfillment status, evidence refs, and
    blocking reasons
  - target for review-grade row pressure
- `SdlcFpEvaluateResult`
  - selected `evaluate.C/F_P` result and findings
  - target for semantic review findings and evidence refs
- `SdlcEdgeFulfillmentLedger`
  - closure ledger that already carries selected composition identity, target
    carrier admission, residual pressure refs, counts, materialization refs, and
    predecessor refs
  - remains the only edge fulfillment closure surface
- gap dossier/current evaluated gaps
  - retry work queue projection
  - must preserve row-level blockers and required actions across attempts
- design-depth evaluator register
  - upstream implementation-design pressure map
  - consumed as accepted authority, not a separate review ledger

## Actual Implementation Surfaces

This ticket is not satisfied by wording changes alone. The implementation work
must touch the real runtime and analyzer surfaces below, unless inspection proves
one surface already enforces the behavior.

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md`
  - document the explicit depth predicate and review-grade edge fulfillment
    behavior as the TypeScript design authority
- `build_tenants/typescript/code/src/operator/carriers.ts`
  - extend existing carriers only where needed so design-depth findings and
    worker obligation assessments can express boundary kind, required action,
    semantic adequacy failure class, and selected `evaluate.C/F_P` evidence
  - do not add a standalone review ledger carrier
- `build_tenants/typescript/code/src/operator/design_depth_register.ts`
  - admit only whole-file JSON design-depth evaluator registers
  - fail closed on unmapped requirements, missing component/file authority,
    missing requirement ids, missing evidence refs, and unjustified coarse
    component rows
  - preserve F_P semantic authority while F_D admission checks shape, identity,
    references, and fail-closed invariants
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - update the `design_depth_register` F_P evaluation rule prompt so the
    evaluator produces explicit depth findings and required actions
  - ensure evaluator rule output is tied to selected evaluation rule outcome,
    selected composition identity, and actor/runtime provenance
- `build_tenants/typescript/code/src/operator/handoff.ts`
  - update transformer prompts so first attempts build the work checklist from
    accepted authority rows before editing
  - update retry prompts so evaluated gaps are named as mandatory work items
  - update component-code prompts so accepted design-depth rows are the source
    work queue for source files, requirement ids, trace evidence, and materialized
    file entries
  - remove any prompt wording that allows tag/path/schema evidence to substitute
    for semantic realization
- `build_tenants/typescript/code/src/operator/plugins/evaluate/postflight.ts`
  - ensure selected `evaluate.C/F_P` findings are the semantic review source
    for `SdlcFpEvaluateResult`
  - ensure findings can classify `trace_missing`, `semantic_not_realized`,
    `boundary_collapsed`, `wrong_stage`, `schema_invalid`,
    `execution_environment`, and `test_overlap_missing`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  - keep `SdlcEdgeFulfillmentLedger` as the only closure ledger
  - ensure unresolved, partial, blocked, or unassessed review-grade rows cannot
    converge the edge
- `build_tenants/typescript/code/src/operator/assurance_gate.ts`
  - ensure assurance rejects fulfilled rows that lack semantic F_P evidence or
    required action for non-fulfilled rows
- `build_tenants/typescript/code/src/analysis/carrier_loaders.ts`
  - keep analyzer admission aligned with runtime admission for design-depth
    registers and edge fulfillment rows
- `build_tenants/typescript/code/src/analysis/edge_attempts.ts`
  and `build_tenants/typescript/code/src/analysis/retry_forensics.ts`
  - surface review-grade blockers and retry work-queue pressure without adding
    a second authority surface
- `build_tenants/typescript/test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs`
  - add focused tests for the behavior in this ticket
- Existing regression tests to update rather than bypass:
  - `test_t181_fp_evaluator_design_register.test.mjs`
  - `test_t172_staged_target_carrier_contract.test.mjs`
  - `test_t120_retry_local_repair_prompt.test.mjs`
  - `test_t135_evaluator_owned_runner_spine.test.mjs`
  - `test_t139_public_gaps_read_only_evaluator_view.test.mjs`

## Required Design Position

Under the design module method, this is a boundary clarification and prompt /
evaluator realization refactor, not a new product ontology.

The design must state:

- F_P owns semantic asset adequacy review for generic ambiguous SDLC edges.
- F_D owns admission, shape, identity, schema, deterministic evidence checks,
  closure folding, and routing.
- ABG owns admitted event/ledger/runtime truth.
- `SdlcEdgeFulfillmentLedger` remains the fulfillment closure ledger.
- `SdlcWorkerResultReport` remains evidence/projection; it does not become
  semantic closure authority.
- A requirement tag is trace evidence, not fulfillment proof by itself.
- Generated assets must be reviewed against incoming requirements, accepted
  upstream authority, stage fit, and overlap evidence.

## Implementation Plan

1. Update the TypeScript design surface to document review-grade edge
   fulfillment as the target interpretation of existing obligation assessments.
   The design must also state the depth rule: upstream accepted authority for
   an asset-producing edge must decompose requirement pressure to the
   granularity required by the asset class.
2. Strengthen transformer prompts:
   - first attempt creates a checklist from incoming requirements, accepted
     upstream authority, target carrier rows, and expected asset outputs
   - retry attempt treats current evaluated gaps as the worker's work queue
   - no success return while required rows are unmapped
   - source-producing edges require owning component row, source file path,
     parseable source tag, materialized file trace entry, and evidence ref
   - stdout stays compact; durable files carry truth
3. Strengthen evaluator prompts:
   - review generated asset/diff, not only carrier existence
   - review whether accepted upstream design depth is sufficient before
     reviewing downstream materialization
   - classify findings as `trace_missing`, `semantic_not_realized`,
     `boundary_collapsed`, `wrong_stage`, `schema_invalid`,
     `execution_environment`, or `test_overlap_missing`
   - require a required action for every non-fulfilled row
   - reject tag-only fulfillment when code/asset semantics do not support the
     obligation
   - run the review-grade evaluator as a separate selected `evaluate.C/F_P`
     process for every close-capable worker-dispatched generated asset edge, not
     only code/test materialization edges
4. Keep the existing edge fulfillment ledger path:
   - do not introduce a new `code_review_ledger`
   - if carrier shape needs more detail, extend existing assessment/finding
     projection surfaces instead of adding a second closure authority
5. Add deterministic tests:
   - prompt contains first-attempt checklist obligations
   - retry prompt states evaluated gaps are the work queue
   - F_P evaluation cannot fulfill high-pressure source requirements by tag
     evidence alone
   - F_P design-depth evaluation cannot admit a coarse module facade when
     requirements imply separable public boundaries
   - component-code evaluation cannot close when generated source collapses
     accepted component rows back into a coarse facade
   - unresolved review-grade assessment rows fail closure
   - no new review-ledger artifact is required or admitted
   - generic document/design edges require the review-grade assessment, run, and
     evaluator process-started artifacts through the product graph/catalog path
6. Run proof:
   - focused T-182 tests
   - semantic suite
   - JS hello world live
   - Rust server hello world live
   - data mapper full capability live

## Closure Checklist

- [ ] Design surface states review-grade edge fulfillment over existing
  `SdlcWorkerObligationAssessment -> SdlcEdgeFulfillmentLedger`.
- [ ] Design surface states the generic depth predicate before code: accepted
  upstream authority must decompose requirement pressure to the granularity
  required by the asset class.
- [ ] Transformer first-attempt prompts require a requirement/authority/asset
  checklist before editing.
- [ ] Transformer retry prompts make evaluated gaps the explicit work queue.
- [ ] Evaluator prompts inspect semantic adequacy of generated assets, not only
  tags, paths, or schema shape.
- [ ] Evaluator prompts inspect accepted upstream depth before downstream
  materialization closure.
- [ ] Generic document/design generated asset edges require a separate selected
  `evaluate.C/F_P` review-grade evaluator process artifact, not only scalar
  in-process `fp_evaluate_result.json`.
- [ ] F_P findings classify asset adequacy failures into stable reason classes.
- [ ] Coarse component topology fails when high-depth requirements imply
  separable public boundaries.
- [ ] Generated source fails when it collapses accepted component rows back into
  coarse module facades.
- [ ] Unfulfilled or unreviewed required assessment rows block closure.
- [ ] Existing edge ledger remains the only fulfillment closure ledger.
- [ ] Analyzer/runtime views agree on the same admitted assessment and edge
  fulfillment surfaces.
- [ ] Focused tests prove positive and negative behavior.
- [ ] Live JS hello world closes cleanly.
- [ ] Live Rust server hello world closes cleanly.
- [ ] Live data mapper closes without losing requirement, depth,
  materialization, test, repair, execution, release, or traversal pressure.

## Non-Goals

- Do not add a standalone code-review ledger.
- Do not promote strategy commentary into constitutional law.
- Do not add source-specific data mapper behavior to generic SDLC runtime.
- Do not replace F_P review with F_D semantic heuristics.
- Do not change ABG runtime ownership of admitted event, ledger, traversal, or
  replay truth.

## Notes

This ticket exists to stabilize the current release line after the T-164 data
mapper run. It is a consolidation of prompt/evaluator behavior observed during
bug fixing, not a request to widen scope or redesign the graph.
