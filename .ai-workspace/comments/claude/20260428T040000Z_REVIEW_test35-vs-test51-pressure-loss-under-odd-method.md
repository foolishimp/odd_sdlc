# REVIEW: Lost Pressure — test35 (Python) vs test51.ts (TypeScript) Under ODD_METHOD Compliance

**Author**: Claude
**Date**: 2026-04-28T04:00:00Z
**Scope**: Comparative archaeology of two `data_mapper` runs:
- `ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35` (Python, "very good" run)
- `ai_sdlc_examples/local_projects/data_mapper/data_mapper.test51.ts` (TypeScript current)
**Posture**: Commentary, not law. Reviewer-only.
**Hypothesis under examination**: in moving the runtime to ODD_METHOD compliance, the TypeScript line lost the pressure mechanisms that drove test35's productive recursive deepening.
**Verdict**: hypothesis confirmed at the event-volume, lifecycle-shape, and obligation-evaluation layers. The pressure was not a Python implementation accident — it was carried by event kinds and per-claim ledgers that the TypeScript algebra collapsed into single transitions.

## Quantitative Comparison

| Surface | test35 (Python) | test51.ts (TypeScript) |
| --- | --- | --- |
| `events.jsonl` lines | 4,662 | 40 |
| Distinct event kinds | 25 | 4 |
| Operator/run invocations observed | 86 `run_bound` | 9 operator-runs (no `run_*` events) |
| Edges traversed (distinct) | 20 | 9 (one incomplete) |
| `derive_code_surface` invocations | 15 | 0 (run stopped before reaching it) |
| `fp_dispatched` events | 57 | 0 |
| `worker_turn_*` lifecycle events | 85 + 209 + 83 + 82 + 1 = 460 | 0 |
| `result_artifact_observed` | 167 | 0 |
| `worker_turn_salvaged` / salvage_candidate | 83 + 82 = 165 | 0 |
| `published_fulfillment_ledger` (per-claim) | 3,152 | 0 |
| `assessed` (per-obligation) | 3,152 | 16 (per-edge synthetic) |
| `fd_findings` | 38 | 0 |
| `found` (gap discovery) | 38 | 0 |
| `proof_passed` / `proof_failed` | 79 / 9 | 0 / 0 |
| `closure_passed` / `edge_converged` | 79 / 79 | 0 / 0 |
| `continuation_opened` / `continuation_abandoned` | 10 / 3 | 0 / 0 (only retry-repair continuation events implemented) |
| `run_bound` / `run_started` / `run_completed` / `run_failed` | 86 / 86 / 79 / 13 | 0 (no run lifecycle in TS event vocabulary) |
| `reset` | 3 | 0 |
| Persisted ledger surfaces | 80 `fp_ledgers/`, 81 `fp_results/`, 82 `fp_manifests/` (separate, gitignored archives) | 1 archive bundle per operator-run (10 total) |
| `build_tenants/<active_tenant>/` files materialized | 1,178 (full Scala project: cdme-{compiler,assurance,executor,adjoint,accounting,fidelity,engine}) | 0 |
| `materializedFileCount` over all 10 runs | 1,178 | 0 |
| Workspace dirs under `.ai-workspace/` | `agents`, `comments`, `context`, `events`, `features`, `fp_ledgers`, `fp_manifests`, `fp_results`, `reviews`, `runtime` | `context`, `events`, `runtime` |

The difference is not 100× or 1000× — it is **categorical**. test51.ts is in a different category of run.

## What Each Run Produced

### test35

Walked the full SDLC graph repeatedly. `derive_code_surface` re-entered 15 times. `derive_test_run_archive_surface` 8 times. `derive_requirement_surface` 6 times. `derive_design_surface` 5 times. Output: a working Scala project with 7 module subprojects (cdme-compiler/assurance/executor/adjoint/accounting/fidelity/engine), each with `src/`, `target/`, sbt `project/`, plus `release/` and `test_env/`. 1,178 files of admitted, materialized, fulfillment-ledgered Scala source.

Every `assessed` event was paired with a `published_fulfillment_ledger` event carrying the obligation, evaluator name, fulfillment_status, evidence_refs, and a `fulfillment_detail` paragraph. Sample (from `fp_ledgers/derive_intent_surface_*.json`):

```json
{
  "evaluator": "intent_surface_semantically_converged",
  "evidence_refs": [
    "specification/INTENT.md",
    "specification/mapper_requirements.md#6.7",
    "specification/REQUIREMENTS.md#2.7",
    "specification/REQUIREMENTS.md#2.8",
    "specification/appendices/APPENDIX_A_FROBENIUS_ALGEBRAS.md"
  ],
  "fulfillment_detail": "Two gaps were resolved: (1) Added INT-007 to cover the Record Accounting and Zero-Loss Guarantee capability area (REQ-ACC-01 through REQ-ACC-05 from mapper_requirements.md §6.7), which had no INT trace. (2) Removed the stale 'Next Steps' section that referenced generating requirements already present in the workspace. All requirement domains now have INT traces...",
  "fulfillment_status": "fulfilled",
  "statement": "The intent surface is semantically converged for the current workspace input set."
}
```

This is a *substantive fulfillment claim*: the worker computed gaps, resolved them, cited evidence, and recorded a paragraph of reasoning per obligation. The runtime made this claim *the unit of pressure*: 3,152 such claims, each its own event.

### test51.ts

Walked nine consecutive edges of `bootstrap_release_self_test`, each producing one markdown surface and converging immediately:

| operator-run | currentEdge after | status | materialized files | assurance verdict |
| --- | --- | --- | --- | --- |
| 78333 | derive_product_surface | worker_invoked | 0 | close_allowed |
| 80395 | derive_goal_surface | worker_invoked | 0 | close_allowed |
| 81857 | derive_requirement_surface | worker_invoked | 0 | close_allowed |
| 83691 | derive_feature_decomp_surface | worker_invoked | 0 | close_allowed |
| 85824 | derive_uat_testcases_surface | worker_invoked | 0 | close_allowed |
| 89512 | derive_design_surface | worker_invoked | 0 | close_allowed |
| 95074 | derive_scenario_surface | worker_invoked | 0 | close_allowed |
| 1904 | derive_implementation_design_surface | worker_invoked | 0 | close_allowed |
| 13264 | select_implementation_stack_profile | worker_invoked | 0 | close_allowed |

The 10th run (20299) was dispatched but no result was admitted yet. **Stopped before `derive_code_surface`.**

Sample worker report (`worker_result_report.json` for derive_intent_surface):

```json
{
  "edgeName": "derive_intent_surface",
  "outputFile": ".../intent_surface.md",
  "digest": "sha256:30840e44...",
  "unresolvedReasons": [],
  "materializedFiles": [],
  "executionEvidence": null,
  "obligationAssessments": []
}
```

`obligationAssessments: []`. Empty array. **The worker submitted zero fulfillment claims for the edge.** Yet the run advanced and `assurance_ledgers.json` carried only `materialization: not_applicable` — no semantic_convergence ledger, no requirement_fulfillment ledger, no obligation_carry ledger. The edge "passed" by absence of contracted obligations rather than by satisfied obligations.

## Lost Pressure Mechanisms

The pressure that drove test35 to produce 1,178 Scala files lives in the gap between the two runs. It is not a single mechanism — it is at least nine.

### LP-1. Per-claim fulfillment ledger
test35: 3,152 `published_fulfillment_ledger` events, one per obligation. Each carries an evaluator, evidence refs, fulfillment status, and a reasoned `fulfillment_detail`.
test51.ts: 16 `assessed` events at edge level (`<edge>_core_fd`, `<edge>_semantic_fp`) — synthesized by the operator code via `resultAssessment(...)` in `installed_operator.ts:263-275`, not derived from worker output. The two obligation IDs are *literals* in the assessment construction; they are not the obligations the worker actually computed.

The pressure mechanism is: **every requirement, scenario, test, and design claim is a separate published event whose absence visibly fails the run**. Today the TypeScript runtime emits a fixed two-obligation pattern per edge regardless of what the worker produced. There is no field in the `worker_result_report` schema that, when empty, blocks the edge.

### LP-2. Worker turn lifecycle observation
test35: `fp_dispatched`(57) → `worker_turn_started`(85) → `worker_turn_progress`(209) → `worker_turn_completed` → `result_artifact_observed`(167) → `worker_turn_salvage_candidate`(82) → `worker_turn_salvaged`(83) → `worker_turn_failed`(1).
test51.ts: 0 of these. The TypeScript event vocabulary collapses the turn into a single deterministic admission boundary: `evaluateWorkerResultPostflight` returns `passed | blocked` and that's the lifecycle.

The pressure mechanism is: **a long-running F_P turn produces telemetry that the runtime can act on**. With 209 progress events test35 could observe stationarity, attempt mid-turn correction, or salvage partial work. test51.ts has no notion of "in-flight" — the turn is a black box between `spawnSync` and the next observation.

### LP-3. Salvage loop
test35: 82 `worker_turn_salvage_candidate` + 83 `worker_turn_salvaged`. When a worker output didn't admit cleanly (wrong shape, missing field, malformed JSON), the runtime *negotiated* with it — extracted the recoverable parts and admitted them as a salvaged result. 165 salvage events is *more salvages than dispatches* (165 vs 57) — salvage was a routine, productive transition.
test51.ts: no salvage. `readWorkerResultReport` at `handoff.ts:778-783` parses the JSON and validates the schema. If validation fails, status becomes `worker_report_rejected` and the run terminates with `nextLawfulAction: "repair_worker_report"` (no event emitted; archive-only — see prior code review of T-076 implementation, Finding 2).

The pressure mechanism is: **probabilistic worker output that doesn't perfectly fit the contract still contains usable evidence**. test35 captured that evidence; test51.ts discards the run.

### LP-4. Found events / gap discovery as first-class pressure
test35: 38 `found` events. Each gap discovery was a distinct event. Combined with `proof_failed`(9) and `continuation_opened`(10), the runtime had explicit pressure to keep iterating.
test51.ts: 0 `found` events. Gap discovery is implicit in the assurance-ledger fold's `gapReasons` array. In the run examined, that array was empty for all 9 runs.

The pressure mechanism is: **gap discovery emits an event that survives replay and shows up in projections**. A future run sees the unresolved gap and re-enters the edge. test51.ts has no gap-discovery event kind in the abiogenesis TypeScript ABG vocabulary; the only gap-shaped event is `retry_repair_planned`, which fires only when postflight rejects the candidate. A *converged-with-gaps* state — closed contract, open obligation — is not representable.

### LP-5. Edge re-entry for productive deepening (not just retry)
test35: `derive_code_surface` ran 15 times. Each pass emitted full proof + closure + converged events; the runtime re-opened the edge in a later run because *more* code was needed, not because the prior pass failed.
test51.ts: each edge ran exactly once and advanced. Once converged, the edge is closed. The deterministic-traversal-state-machine design (`ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md`) names `S18 SameEdgeReentryPrepared` as a transition reachable only from `S17 ContinuationDecided` — i.e., only after a postflight failure or gap.

The pressure mechanism is: **the same edge can be re-entered to deepen its realization without the prior pass having failed**. test35 deepened the Scala project across 15 passes of `derive_code_surface`, each adding more cdme-* modules. The TypeScript algebra has no "deepen" arc — only "retry on failure" or "advance on success". This is the most consequential semantic loss.

### LP-6. Proof gates as runtime events
test35: 79 `proof_passed` + 9 `proof_failed` + 79 `closure_passed` + 79 `edge_converged`. Each edge produced four distinct proof-related events.
test51.ts: 0 of these. Proof is collapsed into `assessed` (one assessmentKind="fp" per obligation). There is no separate `proof_passed`/`proof_failed` distinction. The TS-side substrate does emit `vector_evaluated(blocked)` on retry-repair (per T-076 implementation), but the *passing* path emits no analogue of `proof_passed`.

The pressure mechanism is: **proof verdict is a separate replayable fact, not a derivation of admission**. A future projection in test35 can ask "which edges passed proof but didn't close?" because both events exist. In test51.ts the projection can only ask "which edges have an assessment?" — which doesn't distinguish passed proof from skipped proof.

### LP-7. Run lifecycle as a separate aggregate
test35: 86 `run_bound` + 86 `run_started` + 79 `run_completed` + 13 `run_failed` + 3 `run_superseded`. A "run" was a first-class aggregate with its own lifecycle.
test51.ts: no `run_*` events at all. The TypeScript abiogenesis ABG event vocabulary at `abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/carriers.ts:522` lists `retry_repair_planned`, `retry_attempt_opened`, `retry_attempt_stopped`, `retry_attempt_escalated`, `retry_progress_recorded`, `vector_evaluated`, `assessed` — but no `run_bound` / `run_started` / `run_completed` / `run_failed`.

The pressure mechanism is: **the run boundary is replayable and projection-queryable**. test35's 13 `run_failed` events are 13 visible failures whose remediation pressure is unambiguous. test51.ts cannot record "this run failed" — it can only record "this attempt's postflight blocked" or "the operator returned with status: blocked".

### LP-8. Reset / correction
test35: 3 `reset` events. The runtime had an explicit "this prior conclusion is rescinded; mint a fresh attempt identity" mechanism. ABG axioms call this out: "Correction shadows stale truth; it does not erase history."
test51.ts: 0 reset events. The TS retry algebra terminates a continuation and reopens it (`continuation_terminated` + `continuation_reopened`), which is *related* but not the same — reset is correction over admitted truth, not a continuation-chain step.

### LP-9. Multiple separate published surfaces (ledgers vs results vs manifests)
test35: separate `fp_ledgers/` (80 files), `fp_results/` (81 files), `fp_manifests/` (82 files) directories under `.ai-workspace/`. Three distinct published surfaces per F_P turn. Plus separate `agents/`, `comments/`, `features/`, `reviews/` for collaboration artifacts.
test51.ts: one bundle per operator-run under `runtime/odd_sdlc/operator-runs/<runId>/` containing `handoff_manifest.json`, `worker_result_report.json`, `postflight.json`, `assurance_ledgers.json`, `assurance_satisfaction.json`, `constructor_result.json`, `runtime_events.json`, `run.json`, `run_compact.json`. No separate ledger / result / manifest surfaces. No `comments/` or `features/` or `reviews/` directories.

The pressure mechanism is: **separately-named published surfaces force commitment**. A `fp_ledger.json` file written under a global directory is a public claim about an obligation set. A bundle inside a per-run archive is operationally indistinguishable from a debug log. Co-locating reduces visibility of what is durable claim vs what is run telemetry.

## Why ODD_METHOD Compliance Drove This

The user's hypothesis is correct in shape but worth sharpening. ODD_METHOD compliance did not *itself* prune the pressure events. It pruned the *category* of event the runtime is allowed to emit, and many test35 events fell into the pruned category for defensible reasons.

ODD_METHOD's position (from `abiogenesis/CLAUDE.md` §4): "ABG owns: traversal, runtime facts, frames, continuations, lineage, provenance, correction, and projection mechanics." And: "Runtime advancement truth is carried by `ExecutionBasis` and `AdvancementTransition`, not by controller-local result shapes."

Read literally, this excludes:
- `worker_turn_started` / `worker_turn_progress` / `worker_turn_completed` — these are *worker process* facts, not graph-traversal facts
- `worker_turn_salvage_candidate` / `worker_turn_salvaged` — these are *operator-loop* corrections, not domain advancement
- `result_artifact_observed` — this is a *filesystem observation*, not graph state
- `published_fulfillment_ledger` per claim — this is a *domain projection*, not a runtime event

These are exactly the events test35 emitted in volume. The Python runtime *over-emitted* by ODD's strict reading. The TypeScript ODD-pure ABG correctly does not emit them.

But:
- **fulfillment claims are graph-traversal facts.** Each obligation is a declared evaluator on a vector. Whether it was assessed, with what evidence, and with what verdict is the *substance* of the traversal, not telemetry about it. ODD_METHOD §11 lists `Job` and `Role` as first-class GTL types; an obligation is the assessment unit of a Job's fulfillment. There is no purity argument for collapsing 3,152 obligation assessments into 16 synthetic per-edge `assessed` events.
- **gap discovery is a graph-traversal fact.** The `RefinementBoundary` axiom (ODD_METHOD §2 axiom 8) is explicitly about lawful refinement; gap discovery is its precondition. There is no purity argument for not having a `gap_found` event.
- **proof verdict is a graph-traversal fact distinct from admission.** Admission says "the candidate fits the contract"; proof says "the work satisfied the evaluator". They are different predicates in ODD_METHOD §5 (Evaluator regimes). Collapsing both into `assessed` loses information.
- **run lifecycle is a graph-traversal fact.** A run is bound to a `Job` (ODD_METHOD §2 axiom 11). `run_bound` / `run_started` / `run_completed` are job-lifecycle events; ABG's "Job is the durable semantic work contract" claim entails them.
- **edge re-entry for deepening is a graph-traversal fact.** ODD_METHOD's recursion law (axiom: "recursion progresses as tail-loop control over explicit continuation and child frontier") admits re-entry for deepening, not only for repair. The TypeScript algebra collapsed both to retry-repair.

So the pressure loss is not "ODD_METHOD made us drop these". It is **"the TypeScript ODD-compliant rewrite read ODD_METHOD strictly enough to drop event kinds that are graph-traversal facts in disguise"**. The corrective is not to abandon ODD compliance — it is to recognize which test35 events were domain-level facts and reintroduce them as ODD-compliant typed events.

## Recommendations

The fixes are concrete and small, in roughly increasing order of investment.

### R-1. Make `obligationAssessments: []` a contract violation (small, high leverage)

`build_tenants/typescript/code/src/operator/handoff.ts:353-409` (`admitWorkerResultReport`) accepts an empty `obligationAssessments` array silently. The handoff manifest at `:160-228` requires the worker to populate it (per the prompt at the same file's `promptForHandoff`). But the postflight at `:474-520` doesn't check whether each manifest-declared obligation has a corresponding assessment in the report.

**Change**: in `evaluateWorkerResultPostflight`, add a check that every `manifest.traversalObligationContext.obligations[i].id` is matched by a `report.obligationAssessments[j].obligationId` with `fulfillmentStatus !== "unassessed"`. Missing assessments → blocking reason `obligation_unassessed:<id>`. This restores LP-1 at the contract layer.

### R-2. Emit per-obligation `obligation_assessed` events (small)

Replace the synthetic two-obligation `assessed` emission in `installed_operator.ts:263-275` with one event per worker-supplied obligation. The event carries `obligationId`, `evaluator`, `fulfillmentStatus`, `evidenceRefs`, `fulfillmentDetail`. This is closer to test35's per-claim ledger and is naturally ODD-compliant (an obligation is a graph-vector evaluator declaration; its assessment is graph-traversal truth).

Coordinate with abiogenesis: extend the ABG event alphabet to include a typed `obligation_assessed` event with the proper basis correlation. Today `assessed` is the carrier; promoting to per-obligation requires either (a) a new event kind or (b) emitting N `assessed` events per edge instead of 2.

### R-3. Distinguish `proof_passed` / `proof_failed` from `assessed` (medium)

Test35 emitted both. The TypeScript algebra collapsed them. Restore the distinction by adding `proof_verdict` events (or `proof_passed` / `proof_failed`) that fire after the deterministic postflight returns. `assessed` should remain per-obligation; proof should be per-edge.

In the new `S15 PostflightEvaluated` state of T-076's required state machine, today the transition is:
- `postflight_passed` → no event (next step is hook turn → `assessed`)
- `postflight_failed` → emit `vector_evaluated(blocked)` + retry events

Make it:
- `postflight_passed` → emit `proof_passed`
- `postflight_failed` → emit `proof_failed` + retry events

This gives the runtime a replayable proof-verdict surface that projections can query.

### R-4. Add a `gap_found` event kind (medium)

When the assurance fold's `gapReasons`, `blockingReasons`, or `repriceReasons` arrays are non-empty *but* the run is allowed to advance (e.g., `close_allowed` despite gaps), emit a `gap_found` event per gap with the reason, the obligation it concerns, and the candidate continuation point. This restores LP-4. Today gap discovery is buried inside `assurance_ledgers.json` — a published archive file, not a replayable event.

### R-5. Allow lawful re-entry for deepening, not only repair (medium-large)

This is the biggest semantic gap. T-076's S18 SameEdgeReentryPrepared is reachable only from S17 ContinuationDecided after a failed postflight. There is no path from S20 NextEdgeProjected back to S05 EdgeSelected for an *already-converged* edge.

Add a transition class: `EdgeDeepenRequested`. The runtime can re-enter an edge when:
- the edge has `proof_passed` and `closure_passed` *and*
- a downstream edge or the assurance fold raised an obligation that points back at this edge's output

This is the mechanism by which test35 ran `derive_code_surface` 15 times productively. A first pass produced enough Scala to satisfy local closure; a later pass found that downstream tests needed more modules, so the edge was re-entered.

The semantics need a design ADR. Suggested home: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_RECURSIVE_REALIZATION_DEEPENING.md` already exists in the working tree (untracked) — extending it with this transition class is the right surface.

### R-6. Restore `run_*` events as job-lifecycle truth (large; cross-substrate)

`run_bound` / `run_started` / `run_completed` / `run_failed` / `run_superseded` are job-lifecycle events. They belong to ABG (per ODD_METHOD §2 axiom 11). Their absence from the TypeScript ABG vocabulary is a substrate gap, not an odd_sdlc gap. **Recommendation**: open an abiogenesis ticket to add them. The Python ABG had them; their omission in the TS port is a porting decision, not a methodological one.

### R-7. Add a salvage path with explicit events (large)

This is the most operationally consequential of the LP-* findings (LP-3). 165 salvage events drove much of test35's productivity — most worker turns produced output that needed minor recovery, not rejection. The current `worker_report_rejected` path discards the run.

Add: `worker_turn_salvage_candidate` + `worker_turn_salvaged` event kinds. When `admitWorkerResultReport` fails on a recoverable defect (e.g., missing field that can be defaulted, mis-typed value that can be coerced), emit `worker_turn_salvage_candidate` with the defect, attempt recovery, and emit `worker_turn_salvaged` with the recovered report. Hard rejections (malformed JSON, schema-incompatible types) remain `worker_report_rejected`.

This is debatable — salvage can be a correctness hazard if it covers up worker incompetence. But test35's evidence is that *most worker output is salvageable*; rejecting it terminates productive runs. A bounded salvage policy ("recover defaults; never coerce types") is a reasonable middle.

### R-8. Restore separate published surfaces (small documentation; no code change)

Today `runtime/odd_sdlc/operator-runs/<runId>/` mixes manifest, report, postflight, assurance, runtime_events, run.json. Test35 split these across `fp_ledgers/`, `fp_results/`, `fp_manifests/` at the workspace level.

This is mostly a directory-layout choice. The pressure benefit is *visibility* — a globally-scoped `fp_ledgers/` directory makes ledger volume a project-level health signal. Inside per-run archive bundles, the same files are operationally invisible.

**Recommendation**: when an operator-run completes successfully, copy the admitted ledger / result / manifest into workspace-level directories (`fp_ledgers/<edge>_<timestamp>.json`, `fp_results/<edge>_<timestamp>.json`, `fp_manifests/<edge>_<timestamp>.json`). The per-run archive remains; the workspace-level surfaces become the queryable claim layer.

## Connection To The Active Wave

This finding intersects three active tickets in concrete ways:

- **T-066 (downstream materialization)**: closure_law line 47 requires "shallow-realization evaluators reject placeholder source". My prior review (`20260427T230000Z_REVIEW_active-tickets-and-assurance-ledger-wave.md`) showed the assurance ledgers are not invoked on the operator path. *This run confirms it from outside the source tree*: every test51.ts run produced `assurance_ledgers.json` with at most one ledger entry (materialization, not_applicable). The shallow-realization, capability, and requirement-fulfillment evaluators never fired because they were never invoked. Wiring them in is a precondition for any pressure analogous to test35.

- **T-076 (deterministic traversal)**: the slice closes the postflight-failed-to-archive-only break, which is good. But it does not address LP-5 (re-entry for deepening) or LP-7 (salvage). T-076's design doc explicitly defers full data_mapper RC parity (line 171–174) to T-071–T-075 — which are now consolidated into T-066. The deepening and salvage gaps are not in any active ticket today. **Recommendation**: open T-076b/c successors.

- **T-041 (full operational RC)**: cannot close on test51.ts evidence. closure_law (T-041 line 47) requires "active total-function traversal evidence, and a governed data_mapper/test35 comparator applied to admitted Python and TypeScript evidence". The comparator would surface every LP-* finding above. Today no such comparator exists; this review approximates it. **Recommendation**: this posting plus its predecessors are candidate input to a structured `data_mapper-test35-vs-test51-comparator.json` artifact that becomes T-041's primary closure evidence.

## Closing

The user's framing is correct: ODD_METHOD compliance prompted a re-derivation of which events are first-class graph-traversal truth, and the re-derivation pruned events that *were* first-class but didn't look like it. Per-claim fulfillment, gap discovery, proof verdict, salvage, and run lifecycle are all graph-traversal facts under ODD_METHOD §2 (Structural Axioms), §5 (Evaluator Regimes), and §6 (Recursive Runtime Contract). The TS rewrite read them as runtime mechanics and dropped them.

The path forward is not "abandon ODD compliance". It is "re-classify these events as ODD-compliant typed events with proper basis correlation and replay projection, and emit them on the ABG event bus." Most of R-1 through R-7 are within the existing typed-carrier discipline — they just require the ABG event alphabet to be richer, and the operator code to derive events from worker-supplied obligations rather than from synthetic per-edge defaults.

The smallest single change with the largest pressure-restoration: **R-1 (make `obligationAssessments: []` a contract violation)**. It is a few lines in `handoff.ts:474-520`, no new event kind required, and it forces the worker to commit to per-claim fulfillment evaluation. That alone reproduces a meaningful fraction of LP-1 and creates the demand pressure that R-2 and R-3 then satisfy.
