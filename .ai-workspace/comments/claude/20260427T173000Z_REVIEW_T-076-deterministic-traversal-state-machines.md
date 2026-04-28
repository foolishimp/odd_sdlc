# REVIEW: T-076 Reconcile test35 and TypeScript Deterministic Traversal State Machines

**Author**: Claude
**Date**: 2026-04-27T17:30:00Z
**Scope**: `odd_sdlc/.ai-workspace/tickets/backlog/T-076-reconcile-test35-and-typescript-deterministic-traversal-state-machines.md`
**Posture**: Commentary, not law. Reviewer-only; no edits to the ticket.
**Anchoring**: STDO scope letters S/T/D/O annotate each finding with the constitutional method whose authority is at stake.

## Summary

T-076 is a strong, well-structured `design_reframe` ticket. Its core diagnostic is correct and load-bearing: the test49 stop is *not* the relativePath defect — it is that a deterministic admission failure left event calculus and became archive-only state. Promoting that observation into "no archive-only branch in the algebra" (§ Algebraic Closure Law) is the right reframe and is consistent with `ODD_METHOD` graph-function-as-carrier and ABG-owned continuation authority.

The principal review concerns are scope breadth, state-list/diagram inconsistency for blocked/reprice/human terminals, and a missing explicit ownership boundary between ABG-substrate transitions and odd_sdlc-domain transitions in the state catalog itself.

## Agreement With Ticket Position

Where the ticket is right and the review reinforces it:

- **Two-layer defect split (§ Root Cause Split)** is the correct framing. Repairing only the relativePath basis would close a contract defect and leave the algebra defect intact. `evaluation_criteria` line 56 ("path-basis contract defects are repaired without using that repair as closure for the continuation-algebra defect") and `non_closure_conditions` line 70 ("fixing only the relativePath mismatch") explicitly guard against this. Keep both.
- **F_P proposes; F_D admits** (§ Mathematical Model). The split between probabilistic candidate generation and deterministic admission/projection is the right place to draw the law. This matches `ODD_METHOD`'s F_D/F_P/F_H regime and removes the temptation to "explain state drift by stochasticity" (correctly listed as a non-closure condition, line 75).
- **Surface algebra (§ Surface Algebra)**. Modeling `GraphFunctionResultSurface` as a typed product of `OutputAssetSurface × WorkerResultReportSurface × ProductMaterializationManifestSurface × PostflightVerdictSurface × GapDossierSurface? × ClosureProofSurface? × EventCorrelation` closes the archive-only loophole at the type level rather than at process discipline. This is the correct authority surface for D in STDO terms.
- **`OperatorSummarySurface ... read model only; never transition authority`** (line 243). Direct response to the test49 defect where `nextLawfulAction=repair_worker_output` was treated as transition rather than projection. Keep this exact wording.
- **"do not implement a hidden odd_sdlc-only engine to compensate"** (line 1098–1099). Correct guard against introducing a parallel substrate when ABG generic hooks are missing. Pairs correctly with the instruction to open a linked abiogenesis ticket instead.
- **Test35 framed as precedent for capability, not TypeScript architecture authority** (line 453). This is the correct reading and matches the `non_closure_conditions` line 74 ("relying on exact Python implementation structure as TypeScript architecture authority"). The Python distributed control structure should not be ported.

## Findings

### 1. High [T,D]: scope breadth exceeds a single design_reframe ticket

The closure law (frontmatter line 47) bundles three deliverables into one ticket:

1. publish a state-machine design comparing test35 and current TS state by state,
2. implement the missing deterministic transitions (or open substrate tickets), and
3. prove with an installed `data_mapper` successor that a failed `derive_code_surface` postflight becomes admitted gap/continuation surface.

The body adds 22 explicit states (S00–S21), 18 contracted surfaces, three Mermaid diagrams, a mathematical model, an FP realization sketch, and a path-basis contract repair. `proof_surface` adds five separate artifacts.

Per `CLAUDE.md` "use the smallest lawful re-entry point", and per `TICKET_METHOD.md` ticket sizing, this is a small program of work, not one re-entry. Suggest splitting:

- **T-076** (keep): publish the state-machine design surface + state comparison table + surface contracts. `change_class: design_reframe`. Closure: ratified design under `build_tenants/typescript/design/`.
- **T-076a**: implement `postflight_failed → gap_opened → continuation_decided → same_edge_reentry_prepared` transitions and associated event emissions. `change_class: realization_refactor`. Depends on T-076 ratification.
- **T-076b**: path-basis contract repair (handoff manifest + checker + worker schema). `change_class: realization_refactor`. Independent of T-076a; can land in parallel.
- **T-076c**: installed `data_mapper` successor proof. Depends on T-076a + T-076b.
- **abiogenesis/T-???**: any generic ABG event/continuation hook gaps surfaced by T-076.

The ticket itself partly anticipates this in `## Triage` ("If the state comparison discovers missing constitutional wording, spawn a separate requirement-reprice ticket. Do not hide requirement changes inside this ticket."). Apply the same discipline to design and realization layers, not just to the requirement boundary.

Rationale this is not just paperwork: bundled tickets where design + realization + installed proof close together create silent pressure to *retro-justify* the realization to whatever the proof emits, which is the failure mode `evaluation_criteria` line 56 is trying to prevent at the path-basis layer. Keeping design ratification as a separate gate is the structural defense.

### 2. Medium [D]: blocked/reprice/human "states" appear in the diagram but not in the prose state catalog

The "Full Required State Machine" prose (lines 257–424) lists 22 states S00–S21. The "Mermaid State Machine: Required TypeScript Contract" diagram (lines 668–737) introduces additional state nodes that have no entry in the prose catalog:

- `B00_InstallTopologyBlocked`, `B01_StartRejected`, `B02_BasisRejected`, `B03_ReplayBasisMismatch`, `B04_GraphFunctionRejected`, `B06_FrameRejected`, `B07_WorkerBlocked`, `B16_GapRejected`, `B17_UnrecoverableBlock`
- `R17_RepricingRequired`
- `H17_HumanRequired`

In the prose, these appear as the `failure:` clause of each parent state (e.g. S00's `failure: blocked_install_topology_invalid`) and as terminals under S17 ContinuationDecided. The prose treats them as event labels; the diagram treats them as states.

Per § Algebraic Closure Law (lines 818–897), the machine must be total: every `(state, observation)` pair returns exactly one of `next | gap | reprice | human | blocked`. If `Reprice`, `Human`, and `Blocked` are first-class typed arms of `TransitionResult` (lines 949–954, repeated at 962–968), then they must be first-class states with carrier types and replay projection rules — not implicit terminal events.

Recommendation: either

(a) extend the prose state catalog to enumerate the typed terminal/blocked/reprice/human states with their input surfaces, replay projection, and exit law (preferred — matches the FP shape the design itself prescribes), or

(b) explicitly annotate them in the prose as "event-only terminals with no replay projection beyond `<event_kind>` itself" and remove them from the state diagram so the diagram and catalog agree.

Mixed treatment is the failure mode the ticket is trying to escape. The diagram should not contain typed states that the catalog does not name.

### 3. Medium [O,D]: the state catalog does not mark which transitions are ABG-substrate vs odd_sdlc-domain

The `## Design Obligations` (lines 1056–1071) require:

> which state transitions belong to ABG substrate versus odd_sdlc domain

But the state catalog itself (lines 257–424) does not annotate this. Each state lists owner of *input surfaces* (e.g. S03 ReplayLoaded inputs reference `ExecutionBasisSurface, event log`) but does not name the owner of the *transition function* and *event emission*.

This matters because the `Implementation Direction` (line 1097–1099) says "do not implement a hidden odd_sdlc-only engine to compensate" — but absent a per-transition ownership column, the design surface itself does not make the boundary visible. A reviewer cannot tell from the catalog which transitions, if missing in ABG today, must be opened as abiogenesis tickets vs which are squarely odd_sdlc-domain to implement.

Recommendation: add a `transition_owner:` field to each state entry with values from `{abg_substrate, odd_sdlc_domain, joint}`. Make this part of the design-document closure criterion rather than discovered during implementation.

### 4. Low [S]: `authority_refs` should explicitly cite which `requirement` clause grounds each evaluation criterion

The frontmatter cites two requirement files generically:

```
specification/requirements/10-odd-sdlc-software-domain-buildout.md
specification/requirements/12-declarative-operational-state-transitions.md
```

`evaluation_criteria` lines 49–62 list 14 criteria. Per `SPEC_METHOD` trace closure and `TICKET_METHOD` reviews-anchor-to-§-clauses (per memory `feedback_stdo_constitutional_governance.md`), each criterion should anchor to a specific § clause. Today the mapping is implicit. This is low-risk for triage but will block a clean design ratification when reviewers come back to score the design.

Specific criteria where the anchor is most load-bearing:

- line 53 ("the design document maps each test35 distributed state to the TypeScript state that replaces or preserves it") — needs a clause that authorizes test35 as comparison source rather than authority. The body says this clearly in prose (line 453); promote it to a requirement-clause anchor.
- line 60 ("runtime event sequence tests assert ordering and duplication for dispatch, result observation, postflight, gap, continuation, retry, and closure states") — needs an anchor under requirement 12 (declarative operational state transitions), or a noted gap if no such clause exists.
- line 61 ("gaps/start replay basis remains stable after `until=converged` runs or reports a typed basis mismatch with a lawful recovery path") — this is the basis-stability claim from `Immediate Known Defects` line 1085. Should anchor to whatever requirement governs replay-basis stability, or open a requirement-reprice ticket if one is missing.

This is a triage hygiene finding, not a blocker. The `## Triage` section already commits to spawning a separate requirement-reprice ticket if missing wording is discovered; tightening the anchor list would let that discovery happen at design time rather than during review.

### 5. Low [D]: same-edge re-entry contract for prior materialization is under-specified

S18 SameEdgeReentryPrepared (lines 396–402) requires "next handoff includes prior materialization state and prior gap reasons" but does not specify the *consumption rule* for prior materialization. Open questions:

- Are prior admitted files preserved by-digest and only re-emitted on overwrite? Or are they re-materialized?
- If a same-edge retry produces a *different* set of materialized files (e.g. fewer files because the worker now believes some are unnecessary), is that a `materialization_rejected` because the prior admission is being narrowed, or a `materialization_admitted` with a new manifest superseding the old?
- Does the `monotone fixed-point iteration` guidance (line 859–860, "preserves prior admitted artifacts unless a repair event supersedes them") imply a `repair_event` kind that supersedes specific prior admissions? If so, that event kind should be in the catalog.

The `Algebraic Closure Law` (lines 855–860) names monotonicity correctly. The state catalog should make the supersession event explicit so the FP reducer at line 970 is total.

### 6. Low [D]: `OperatorSummarySurface` should explicitly forbid being persisted in a location that will be read on next-run start

The current `installed_operator.ts` defect is that `nextLawfulAction` is treated as transition. The ticket correctly demotes `OperatorSummarySurface` to read-model-only (line 243). But there is no constraint preventing an implementation from *persisting* the read model into a location that is then read by `start` on the next invocation, which would re-introduce the defect through a different door.

Recommendation: add a non-closure condition that operator summary state (including `next_action`, `nextLawfulAction`, status prose) must never be on the read path of `start --until converged` resumption. Resumption reads only event log + admitted-surface state.

## Items To Carry Forward Into Design

If T-076 is kept as one ticket or split per Finding 1, the following are likely to be discovered as cross-cutting and worth pre-flagging:

1. **`graph_already_closed`** appears at S05 (line 298) as a terminal but is described as a transition to S21. Clarify whether `graph_already_closed` is its own observation kind or a synonym for "S20 with no open edge."
2. **Idempotency of `result_report_observed` vs `result_report_admitted`**. The two-step admission (S10 → S11) is correct, but the design must specify what happens when the same `worker_result_report.json` is observed twice (e.g., operator-restart). Replay should idempotently produce the same admission outcome.
3. **`evaluation_criteria` line 60 names an event-sequence-ordering test obligation.** This is a strong test contract but needs an oracle — the design should publish the canonical event-ordering vector for one full edge traversal and one failed-postflight-then-retry traversal. That oracle is itself a contracted surface and should appear in `proof_surface`.

## Concrete Suggestions (No Edits Made)

The following are recommendations only; the project owner decides whether to apply them.

1. Split T-076 per Finding 1.
2. Add `transition_owner` annotation to each state in lines 257–424 (Finding 3).
3. Either lift B*/R17/H17 into the prose state catalog or remove them from the diagram (Finding 2).
4. Add per-criterion `anchor:` to each line in `evaluation_criteria` (Finding 4).
5. Add a `non_closure_condition`: "operator summary surfaces persisted on the start-resumption read path" (Finding 6).
6. Add to `proof_surface`: "canonical event-ordering oracle for one passing edge and one failed-postflight retry edge" (carry-forward 3).

## Closing

The ticket's diagnostic is sharp and the prescription is correct in its core algebra. The reframe — from "operator returns next_action prose" to "every transition emits typed events and produces a typed gap/continuation/closure result" — is the right load-bearing change. The review's findings are scope and traceability hygiene around an otherwise solid design surface. No finding contradicts the ticket's core position; all are either tightening or splitting.
