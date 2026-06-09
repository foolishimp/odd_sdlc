---
id: T-192
title: Factor evaluation contract into segment-by-dimension grid
type: feature
ticket_category: ordinary
status: completed
proof_status: passed
priority: high
owner: odd_sdlc
created_at: 2026-06-06
updated_at: 2026-06-06
triaged_at: 2026-06-06
change_class: requirement_reprice
re_entry_point: evaluation contract requirements and design
first_missing_layer: SDLC Product and requirements did not declare the logical segment x dimension grid, so evaluator prompts can collapse carrier projection, local semantic review, global coverage fold, trace binding, and closure pressure into one F_P turn
governance_scope: odd_sdlc transform/evaluate contract shape, GTL prompt assets, scoped disambiguation carriers, evaluator prompt construction, ABG-owned orchestration/folding, and live proof lanes
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/
  - build_tenants/typescript/code/src/operator/prompt_assets.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
  - build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
  - build_tenants/typescript/code/src/operator/closure_state_machine.ts
  - build_tenants/typescript/test_env/sandbox/scenarios/t164_rust_hello_service_lite.scenario.mjs
  - .ai-workspace/tickets/completed/T-191-establish-typed-prompt-contract-model.md
  - .ai-workspace/tickets/backlog/T-190-consolidate-configurable-runtime-and-prompt-literals-into-config.md
related_tickets:
  - .ai-workspace/tickets/completed/T-191-establish-typed-prompt-contract-model.md
  - .ai-workspace/tickets/backlog/T-190-consolidate-configurable-runtime-and-prompt-literals-into-config.md
  - .ai-workspace/tickets/completed/T-188-force-fp-depth-through-iteration-and-prompt-control.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-149-collapse-iteration-continuation-deciders-to-one-state-machine.md
affected_boundary:
  requirements:
    - specification/requirements/18-typed-construction-algebra.md
    - specification/PRODUCT.md
  design:
    - build_tenants/typescript/design/
  realization:
    - build_tenants/typescript/code/src/operator/prompt_assets.ts
    - build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
    - build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
    - build_tenants/typescript/code/src/operator/closure_state_machine.ts
    - build_tenants/typescript/test_env/sandbox/
    - build_tenants/typescript/test_env/tests/
requirement_home: specification/requirements/18-typed-construction-algebra.md#REQ-F-ODDSDLC-088
target_truth: SDLC evaluation must be decomposable and scalable. F_P performs bounded local semantic judgment over declared transform segments, scoped carrier projections, and declared evaluation dimensions. F_D/GTL construct typed carriers, rendered views, and structural ref-set checks without comprehending product content. ABG admits and folds typed findings plus runtime facts through the single runtime outcome truth surface. Disambiguation context is a scoped projection over admitted events, not a second writable truth surface or replay dump. A single-hop prompt is allowed only as a physical fusion of a small logical grid; the logical contract remains typed and visible.
superseded_truth: Evaluator prompts may ask one F_P turn to select authority, reconstruct prior disambiguation, rebuild trace bindings, judge depth and completeness, police stage boundaries, classify closure blockers, validate schema, and choose repair pressure. This creates a mini-SDLC inside an evaluator prompt; it is expensive on trivial lanes and does not scale on deep products.
closure_law: This ticket closes only after PRODUCT.md and REQ-F-ODDSDLC-088 define the constitutional WHAT for scalable evaluation; ratified design defines the segment x dimension grid, cell/fold/relation split, scoped DisambiguationCarrier projection, logical-grid/physical-fusion rule, and localized redispatch semantics; T-191's moved P-050/P-060/P-070 prompt-family realization is implemented here clause-first; GridFold is proven to reuse or generalize the T-149 ABG iteration-outcome fold rather than minting a second outcome decider; any required new ABG substrate is ticketed and consumed from a release before odd_sdlc closure; evaluator prompts no longer ask local F_P cells to perform global coverage or closure folds; and a Rust hello-service live lane proves the degenerate case runs through a small fused grid without the previous full mini-SDLC evaluator prompt.
non_closure_conditions:
  - T-191 and T-192 both remain active over the same prompt-family realization files instead of T-192 owning the moved P-050/P-060/P-070 clause-first work
  - review-grade or design-depth evaluator prompts still require one F_P turn to reconstruct authority selection, global coverage, cross-segment trace, closure pressure, and local semantic judgment together
  - completeness-as-coverage is implemented as a per-segment F_P cell that must load all segments
  - cross-segment trace is implemented by loading the full graph into every cell instead of as a fold or narrow relation check
  - DisambiguationCarrier is accumulated history rather than a scoped replay-derived projection over admitted events
  - evaluator cells read raw bootstrap, raw intent, or historical run surfaces when an admitted carrier projection can decide the cell
  - ABG or F_D interprets product semantics instead of folding typed findings and runtime facts
  - ABG GridFold mints a second retry/block/close outcome decider instead of reusing or generalizing the T-149 iteration-outcome fold
  - coverage reduction compares semantic content rather than structurally checking declared obligation/segment ref sets
  - odd_sdlc implements new ABG substrate locally instead of consuming an abiogenesis release when the existing T-149 fold and GraphReentryPoint/reentryTargetVectorIndex cannot express the grid outcome
  - transform segmentation is selected ad hoc by the evaluator at runtime instead of declared by TransformUnit / GTL contract and applied by the framework
  - single-hop execution is treated as permission to collapse logical dimensions back into one untyped evaluator monolith
  - physical prompt fusion loses typed findings, dimension scope, carrier refs, or per-cell provenance
  - localized redispatch is unavailable when one segment/dimension cell fails
  - tests only inspect prompt text or helper functions and do not prove the live grid path
review_gate: closed
---

# T-192: Factor Evaluation Contract Into Segment-By-Dimension Grid

## Intake

Smallest lawful re-entry point: `requirement_reprice`.

Reason: the 2026-06-06 Rust hello-service live lane passed but took about
33 minutes for a five-requirement, two-file product. The server/curl proof was
not the cost. The cost came from evaluator prompts: design-depth evaluation took
about 8m43s and code-edge review-grade took about 7m57s. The code-edge
review-grade prompt asked one F_P evaluator to perform carrier selection,
authority compression, trace binding, local semantic review, global coverage,
stage classification, closure pressure, schema policing, and JSON self-rewrite
in one turn. That is a mini-SDLC inside an evaluator prompt.

This is not a prompt-length polish issue. It is a missing evaluation-contract
shape. The SDLC needs a logical grid: transformation segments crossed with
evaluation dimensions, with typed findings folded by ABG. The current prompt
construction can physically fuse work into one prompt for a tiny product, but
the logical grid must remain visible in the typed prompt asset and output
findings.

The issue is also a reliability defect, not only cost. A later 2026-06-06 Rust
hello-service run blocked at the design edge on
`design_depth_fp_evaluator_process_failed`; the design-depth evaluator trace
returned status `1` under
`build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260606T091502807Z_pid79205`.
That run did not reach the code edge. The oversized evaluator contract is a
block generator when the evaluator is asked to run too much of the SDLC inside
one F_P turn.

## Ticket Boundary Cut

T-191 now closes at the substrate layer: odd_sdlc consumes the released GTL
AssetSurface interface, retires the SDLC-local prompt asset register/admission,
and amends `REQ-F-ODDSDLC-087` to project GTL structure. The remaining T-191
realization work, formerly P-050/P-060/P-070 and its structural/live proofs, is
moved here. This ticket owns the clause-first prompt-family realization in
`plugins/evaluate/prompts.ts` and `plugins/transform/launch_contract.ts`.

T-191 and T-192 must not run concurrent edits over those prompt files. T-191 is
the GTL substrate adoption; T-192 is the evaluation-grid prompt realization.

## Core Model

```text
TransformUnit:
  A -> B
  segmentKey?              # framework-declared partition, not per-run F_P invention

EvaluationDimension:
  dimensionRef
  scope: cell | fold | relation

DisambiguationCarrier:
  scoped projection over admitted events
  current authority snapshot + prior EvaluationFindings + lineage needed by one cell
  not accumulated replay history and not a writable second register

EvaluationFinding:
  segmentRef
  dimensionRef
  status: fulfilled | partial | blocked | deferred
  reason
  evidenceRefs
  carrierRefs

GridFold:
  ABG-owned deterministic fold over EvaluationFinding rows and runtime facts
  reuses/generalizes the T-149 iteration-outcome fold
  emits close | block | suspend | localized redispatch(segmentRef, reason)
```

The grid is logical. Physical execution may fuse cheap cells into one F_P call
when the grid is small, but the fused prompt still consumes the typed carrier
projection and emits typed findings with segment/dimension provenance.

## Cell Versus Fold Dimensions

A dimension is a per-cell F_P question only when it can be decided from:

```text
A.segment[i], B.segment[i], DisambiguationCarrier[i,j]
```

Examples:

- local depth / sufficiency for the segment
- local authority/stage conformance for the segment
- intra-slice realization against the segment's assigned obligations

Global dimensions are not per-cell evaluator questions:

- completeness-as-coverage: structurally, do declared segment obligation refs
  tile the obligation set with no gaps?
- cross-segment trace: does an obligation whose design is in segment 0 and code
  is in segment 3 bind correctly?
- closure readiness: do typed findings and runtime facts admit close or require
  redispatch/block?

Those are folds or narrow relation checks over typed findings and declared refs.
Coverage is an F_D/ABG structural set operation over obligation/segment refs,
not a semantic judgment over product content. If a "dimension" requires every
segment to decide one cell, it is not a cell dimension.

## Proportionality Rule

Evaluation shape derives from admitted decomposition, traversal-hop, and
complexity evidence.

```text
admitted single-hop class -> logical 1 x k grid
admitted segmented class  -> logical n x k grid
tiny grid                 -> may physically fuse cells into one prompt
large/deep grid           -> must execute bounded cells and folds
```

There is no separate lite/full tier as the source of truth. Admitted
decomposition and traversal-hop carriers drive the grid. Config may tune
physical fusion thresholds and runtime budgets, but it must not change the
logical evaluation contract.

## ABG Boundary

ABG owns:

- traversal and dispatch state
- admitting transform/evaluate runtime facts
- admitting runtime facts and carrier projections
- folding typed findings
- retry/redispatch/block/close decisions
- localized redispatch of failed segment/dimension cells
- reusing the T-149 iteration-outcome fold as the single outcome truth surface

ABG does not own:

- product semantic comprehension
- deciding whether Rust service behavior, data mapper mapping behavior, or any
  other product meaning is correct
- generating product repairs

The installed operator/transport invokes physical workers under ABG-owned
runtime truth. F_P owns semantic judgment for local cells and relation checks.
F_D/GTL own typed carrier construction, rendered views, and structural checks.
ABG owns admission, replay, fold, and continuation.

If the existing ABG T-149 fold plus `GraphReentryPoint` and
`reentryTargetVectorIndex` cannot express localized segment redispatch, the
missing substrate is an abiogenesis ticket and release dependency. odd_sdlc must
not grow a local ABG-style outcome decider to compensate.

## Required Design Work

1. Amend `specification/PRODUCT.md` so product law declares decomposable
   evaluation, bounded F_P semantic judgment, F_D/GTL structural carrier/view
   construction, ABG admission/fold/continuation, and admitted-evidence-derived
   proportionality.
2. Add `REQ-F-ODDSDLC-088` in
   `specification/requirements/18-typed-construction-algebra.md` for the WHAT:
   evaluation must be decomposable/scalable; F_P owns bounded local semantic
   judgment; F_D/GTL construct typed carriers and structural refs without
   content comprehension; ABG admits and folds typed findings plus runtime
   facts; carrier context is a projection; prompt construction must not create a
   per-turn mini-SDLC.
3. Add a design surface under `build_tenants/typescript/design/` that defines
   the HOW: segment x dimension grid contract, carrier shape, cell/fold/relation
   classification, physical fusion policy, and ABG fold path.
4. Reconcile the model with T-191 prompt assets by moving T-191 P-050/P-060/P-070
   here: every prompt invocation identifies TransformUnit segment(s),
   EvaluationDimension(s), DisambiguationCarrier refs, and expected
   EvaluationFinding output before rendering.
5. Reconcile the model with T-190 so tunable physical fusion thresholds,
   budgets, and prompt-size caps come from config while the logical grid stays
   method/product law.
6. Define localized redispatch semantics over existing ABG primitives first:
   `GraphReentryPoint`, `reentryTargetVectorIndex`, and the T-149
   iteration-outcome fold. If that is insufficient, create an upstream
   abiogenesis ticket before odd_sdlc realization closure.

## Proof Surface

- Static proof: prompt assets expose segment refs, dimension refs, carrier refs,
  and physical-fusion metadata without raw bootstrap or raw-history leakage.
- Unit proof: dimensions are classified as `cell`, `fold`, or `relation`; a
  coverage dimension cannot be admitted as a per-cell dimension.
- Unit proof: DisambiguationCarrier is a scoped projection with bounded refs,
  not an accumulated replay dump.
- Unit proof: GridFold can close when all cells/folds pass and can redispatch a
  single failed segment/dimension without invalidating admitted sibling cells.
- Structural proof: the GridFold path contains no Rust/data_mapper/product
  vocabulary and does not branch on product semantic terms; it consumes typed
  findings, runtime facts, and declared refs only.
- Structural proof: no second local retry/block/close outcome decider is added
  beside the T-149 fold path.
- Prompt proof: review-grade and design-depth prompts for a degenerate product
  do not ask one evaluator to reconstruct authority, coverage, trace, closure,
  and local semantic review together.
- Live proof: Rust hello-service live lane passes through the new contract and
  demonstrates the degenerate fused case is materially smaller than the
  2026-06-06 run that took about 33 minutes.

## Non-Goals

- This ticket does not move product semantic judgment into ABG or F_D.
- This ticket does not remove the ability to run a single-hop SDLC. It makes
  single-hop a physical fusion of a small logical grid, not an untyped monolith.
- This ticket subsumes T-191's moved clause-first prompt-family realization
  (former P-050/P-060/P-070). It does not reopen T-191's completed GTL
  substrate adoption.
- This ticket does not tune concrete retry or prompt budgets directly; that
  belongs under T-190 unless a value is proven to be method/product law.

## Completion Evidence

Completed 2026-06-06.

Realization:

- `PRODUCT.md` and `REQ-F-ODDSDLC-088` declare decomposable evaluation, bounded
  F_P semantic judgment, F_D/GTL structural carrier/view construction, and
  ABG-owned admission/fold/continuation.
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EVALUATION_GRID_CONTRACT.md`
  defines the segment x dimension grid contract, cell/fold/relation split,
  scoped `DisambiguationCarrier`, physical fusion policy, and ABG fold path.
- `prompt_assets.ts` constructs and archives typed
  `SdlcEvaluationGridContract` sidecars with transform-unit refs, dimension
  refs, scoped carrier refs, expected finding refs, and the ABG iteration
  outcome fold ref.
- `plugins/evaluate/prompts.ts` projects review-grade and design-depth
  evaluator prompts through fused logical grids for small admitted handoffs.
  Local F_P cells decide bounded semantic dimensions; coverage is a structural
  fold over refs; closure and continuation remain ABG fold outputs.
- `plugins/transform/launch_contract.ts` now renders handoff prompts from
  typed sections instead of slicing rendered text.

Deterministic proof:

- `npm run test:t192` passed: 4 tests, including rejection of global coverage as
  a local cell, fused-grid sidecars, compact prompt guardrails, and section-first
  prompt construction.
- `npm run build:semantic && node --test test_env/tests/test_t191_typed_prompt_assets.test.mjs test_env/tests/test_t187_fp_evaluator_prompt_boundary.test.mjs test_env/tests/test_t188_closure_state_machine.test.mjs`
  passed: 51 tests.
- `npm run test:t183` passed: 71 tests, including the T-182/T-183 wrong-stage
  review and closure folding checks.

Live proof:

- Command: `npm run test:scenario:t164-rust-hello-service-live`
- Archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260606T154800791Z_pid17992`
- Result: pass, 1 test, duration `1802252.106667ms`.
- Product files materialized in the live workspace:
  `build_tenants/hello_world_rust_service/Cargo.toml` and
  `build_tenants/hello_world_rust_service/src/main.rs`; Cargo byproducts include
  `Cargo.lock` and `target/debug/hello-world-rust-service`.
- Final operator summary:
  `operator-runs/20260606T160838962Z_pid17992/operator_summary.json` reports
  `obligationReview.status=passed`, `expected=7`, `fulfilled=7`, no partial or
  blocking rows, `admittedSemantic.status=admitted`, and
  `nextLawfulAction=disposition://close`.
- Closure decision:
  `operator-runs/20260606T160838962Z_pid17992/sdlc_edge_closure_decision.json`
  reports `targetCarrierAdmissionStatus=admitted`, no residual pressure refs,
  and `disposition=close`.
- Review-grade assessment for the final component-code edge still classified
  `req_t164_rust_svc_005` as `wrong_stage` partial, but the ABG/closure fold
  admitted that downstream pressure correctly and did not redispatch the
  component-code edge.

Prompt/grid proof from the live archive:

- `20260606T154859017Z_pid17992/review_grade_edge_fulfillment_prompt.md`:
  `17566` bytes.
- `20260606T155312330Z_pid17992/design_depth_fp_evaluator_prompt.md`:
  `23300` bytes.
- `20260606T155312330Z_pid17992/review_grade_edge_fulfillment_prompt.md`:
  `17871` bytes.
- `20260606T160838962Z_pid17992/review_grade_edge_fulfillment_prompt.md`:
  `18014` bytes.
- Prompt sidecars carry `sdlc_evaluation_grid_contract`,
  `physicalExecution=fused_prompt`, and the ABG fold ref
  `package:@abiogenesis/typescript-tenant@3.9.0-rc.12#abg/m03/iteration_state_action/deriveIterationOutcomeFromRows`.
- Review-grade dimensions in sidecars:
  `local-obligation-fulfillment:cell`,
  `local-stage-boundary-conformance:cell`,
  `materialization-binding-relation:relation`, and
  `obligation-coverage-fold:fold`.
- Design-depth dimensions in sidecars:
  `local-depth-sufficiency:cell`,
  `local-authority-stage-conformance:cell`,
  `register-output-contract:relation`, and
  `obligation-coverage-fold:fold`.
