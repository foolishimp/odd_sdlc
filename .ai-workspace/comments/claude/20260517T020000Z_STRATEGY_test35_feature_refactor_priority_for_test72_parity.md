# Strategy: Ordered Priority List Of Test35 Features To Refactor Into Test72

**Created**: 2026-05-17T02:00:00Z
**Author**: claude
**Status**: Commentary, not specification
**Scope**: Ordered priority list of test35 (Python) features that must be refactored into test72 (TypeScript) for behavioral parity, derived from edge-by-edge comparison of the two runs.

**References**:

- Source comparison ledger:
  `.ai-workspace/comments/codex/20260516T121044Z_test35_python_success_walkthrough.md`
  (10 traversal comparisons across requirement, feature, UAT, design,
  scenario, implementation, stack/module, code, test, execution preparation)
- Master test35 failure reference:
  `.ai-workspace/comments/codex/20260516T021725Z_MASTER_test35_attempts_failure_reference.md`
- Authority placement strategy:
  `.ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md`
- Prior substrate-vs-consumer assessment:
  `.ai-workspace/comments/claude/20260516T080000Z_REVIEW_abg-substrate-fulfills-test35-strategy-consumer-boundary-remains.md`

This is commentary, not ratified specification.

## Position

The Codex walkthrough confirms the prior assessment: the ABG substrate is
sufficient; the test35-parity question is entirely at the consumer (SDLC
graph) layer. The 14 features below are ordered by value to test35 parity,
where value means "how much does this contribute to test35's distinctive
success: execution-backed closure, requirement-traced behavior, repeated
convergence across attempts."

The first four are **causally entangled** and must land as one wave. Items
5–7 are the **completion-through-execution lane**. Items 8–13 are
second-wave behavior-sharpening. Item 14 is infrastructure.

If only one item gets done, do **#4 (execution result surface)**. Without
admitted execution evidence flowing into the closure spine, every other
refactor risks reproducing F1 / F3 / F4 from the master reference.

## Wave A: Causally Entangled High-Priority Items

These four must land together. None of them is verifiable in isolation;
they jointly define what "closure" means in the test35 sense.

### 1. Closure lifecycle event sequence — `assessed → proof_passed → closure_passed → edge_converged → graph_call_closed → run_completed`

**Value: highest.** Python's per-edge closure lifecycle is the spine of
test35. TS closes the ledger but archives end with
`traversal_attempt_non_progress_classified → terminal_reached`. Several
closed edges have no `vector_evaluated` or `vector_closed` events at all
(feature decomp, scenario surface, and others per Comparisons 2 and 5).
Closure files say `close`; runtime says non-progress. Without consistency,
no test35 comparison is honest — you cannot tell whether an edge actually
closed.

**Refactor:** ensure every closed edge emits the 6-event lifecycle. Type
the existing `traversal_attempt_non_progress_classified` as a separate
post-close inspection signal that cannot contradict closure. Add missing
`vector_evaluated`/`vector_closed` emission on the closure path.

### 2. F_P semantic convergence as single obligation — `<surface>_semantically_converged`

**Value: highest.** Python closes each F_P edge against one declared
semantic obligation (e.g. `design_surface_semantically_converged`,
`scenario_surface_semantically_converged`,
`uat_testcases_surface_semantically_converged`). TS closes against 445
mixed obligations (target asset + F_D evaluators + requirement traces).
This inflation makes closure pass for the wrong reasons — F_D shape can
satisfy many of the 445 without the content actually being convergent.
Comparison 6's `derive_implementation_design_surface` is the clearest
example: TS closes 445/445 after three attempts, but the closing object
is no longer a single semantic-convergence proof.

**Refactor:** add a per-edge semantic-convergence F_P obligation as the
load-bearing closure predicate. Keep the 445-obligation matrix as
evidence/diagnostic dimensions, but make `X_surface_semantically_converged:
true` the gate for `edge_converged`.

### 3. `derive_uat_testcases_surface` traversal — restore UAT-before-design pressure

**Value: very high.** Python's UAT traversal sits between feature
decomposition and design, writing
`specification/scenarios/20-generated-uat-testcases.md` from
`requirement_surface` only. This puts acceptance pressure on design
**before** design is written. TS has no UAT traversal;
`derive_scenario_surface` runs **after** design and reads design as
authority. The pressure direction is reversed.

**Refactor:** declare a new `derive_uat_testcases_surface` edge with
source `requirement_surface`, target `uat_testcases_surface`, output
under `specification/scenarios/`, before `derive_design_surface`. Keep
`derive_scenario_surface` separate as design-informed scenarios.

### 4. `derive_test_execution_result_surface` + `prepare_test_execution_surface` + `derive_test_run_archive_surface`

**Value: very high.** This is the actual execution lane that closed
test35. Python ran `sbt test`, admitted the result, and closed
`derive_test_execution_result_surface` against admitted execution
evidence. Per Comparison 10, TS has reached
`prepare_test_execution_surface` but has not closed it; the
`derive_test_execution_result_surface` and `derive_test_run_archive_surface`
edges have not been observed. Without them, no execution evidence enters
the closure spine and F1 returns.

**Refactor:** declare the three execution-lane edges. Wire the operational
dispatch contract to run the declared test command, admit the result, and
gate closure on execution evidence presence. This is the materialization
of the strategy's "completeness through execution" principle.

## Wave B: Completion-Through-Execution Lane

These three are needed for the run to terminate honestly. They depend on
Wave A landing first.

### 5. Worker prompt locality — generated construction brief as primary worker-facing surface

**Value: high.** Python prompt is one manifest-owned readable payload
(7–28 KB) with `[CURRENT STATE]`, `[GAP]`, `[SOURCE ASSET SNAPSHOT]`,
`[OUTPUT CONTRACT]` sections rendered directly into the dispatch payload.
TS `worker_prompt.md` is a 3–25 KB launcher over 1 MB to 12 MB of sidecar
JSON.

Comparison 10 sharpens this: attempt 25 of
`prepare_test_execution_surface` carries a 2.5 MB prompt context and a
6.6 MB handoff bundle. The retry pressure expands the bundle dramatically
across each repair cycle. Worker cognition is paying a framework-decode
tax that compounds with retries.

**Refactor:** add a derived construction brief generated from the same
typed packages — current state, source authority, current evaluated gaps,
output contract, framework boundary — as the primary prompt body. Keep
typed sidecars as authority refs accessible by sidecar index, not as the
worker's primary read.

### 6. `qualify_testcase_authority` edge

**Value: high.** Python qualifies testcase authority before execution,
writing `specification/scenarios/30-generated-testcase-authority.md`. TS
has no equivalent. Without it, test authority isn't separately admitted
and the test→execution chain has a missing admission step.

**Refactor:** declare the edge after UAT testcases and before test
execution preparation. Same closure pattern as other content edges.

### 7. `prepare_release_surface` + final release closure with combined evidence

**Value: high.** Python release surface reads accumulated design + code +
test + execution evidence and records `construction_complete; no blocking
gaps remain`. TS has not observed release prep. Without this, the
substrate has no terminal "everything closed" surface — pressure could
remain forever invisible.

**Refactor:** declare a release edge that gates on admitted evidence from
all upstream content+execution edges.

## Wave C: Second-Wave Behavior-Sharpening

These improve test35 fidelity but are not blocking. Land after Waves A
and B prove the closure spine works.

### 8. Decomposed authority surfaces — `derive_intent_surface`, `derive_product_surface`, `derive_goal_surface`, `derive_requirement_surface`

**Value: medium-high.** Python builds each as a standalone F_P
traversal with its own fulfillment ledger. TS collapses all four into
`Fg_conform_project` + `Fg_conform_project_authority`. Per Comparison 1,
this is exactly the "framework creates authoritative-looking artifacts
before the corresponding content traversal proves them" failure from the
master reference.

**Refactor:** either restore the four standalone edges, OR declare
explicitly that `Fg_conform_project` is deterministic source-induction
(not content authority) and add a separate F_P content-evaluation edge
per authority surface that proves and repairs them before downstream
design consumes them.

### 9. Construction manifest as single durable construction record

**Value: medium-high.** Python `fp_manifests/<edge>_<ts>.json` is one
file per attempt containing prompt + structured authority + obligation
policy + result path. TS splits across `handoff_manifest.json`,
`worker_invocation_package.json`, `worker_brief.json`,
`traversal_intent_package.json`, `gap_dossier.json`, sometimes more.
Replay/audit drift risk — five files of authority instead of one.

**Refactor:** add a derived
`construction_manifest_<edge>_<ts>.json` per attempt that consolidates
the per-edge construction record from the typed packages. Existing
packages remain authoritative; the manifest is a single inspectable
rollup.

### 10. Materialization tracking — `product_materialization_manifest.files` must list produced files

**Value: medium.** Recurring pattern across feature-decomp (Comparison
2), design (Comparison 4), scenario (Comparison 5), and implementation
design (Comparison 6) edges: `worker_result_report.outputFile` names a
real produced artifact with digest, but
`product_materialization_manifest.files: []`. Either the rule is
"design/scenario surfaces don't count as product materialization" (then
declare that explicitly) or this is a bug. Currently silent.

**Refactor:** either declare an explicit non-product-materialization rule
for design/scenario edges, or wire the worker_result_report output file
into the materialization manifest. Pick one and apply consistently.

### 11. Worker turn telemetry — `worker_turn_started/progress/salvage_candidate/salvaged`

**Value: medium.** Python emits per-turn telemetry that maps to model
interaction shape. TS has `actor_process_*` events (process-level) but no
per-turn semantics. Forensic gap: cannot see "where in the turn sequence
did the worker stall" or "did salvage recover the attempt."

**Refactor:** admit per-turn events derived from the Claude Code
stream-json `assistant` / `user` (tool result) messages. Already
accessible from `worker_process_events.jsonl.trace/events.ndjson`.

### 12. `derive_implementation_module_surface` edge

**Value: medium.** Python has explicit module-design as its own edge
between design and code (Comparison 7). TS skips it and moves directly
into `derive_component_code_surface` + `qualify_component_realization_surface`
+ `derive_code_surface` rollup. The module-design abstraction layer is
absent.

**Refactor:** add the module-design edge, OR declare explicitly that the
component_code edge subsumes module design and verify it produces
module-level design content, not just per-component code.

### 13. `select_implementation_stack_profile` + `select_test_stack_profile`

**Value: medium-low.** Python has explicit traversal state for stack
profile selection (Comparison 7 for implementation; Comparison 9 for
test). TS embeds these in packages/config truth. Functionally works in
TS but makes profile selection invisible to graph audit.

**Refactor:** lift profile selection into declarative edges if you want
them as first-class replay-visible decisions. Otherwise document
explicitly that they're config-resolved.

## Wave D: Infrastructure

### 14. Per-event timestamps on the load-bearing event kinds

**Value: low-medium** (infrastructure, not behavior). The doc and prior
analyses repeatedly hit this. Without it, run forensics work from
probe/heartbeat anchors only.

**Refactor (as discussed earlier):** leave the substrate's replay-truth
events alone; add timing as an analyzer-side derivation from the
probe/heartbeat spine. Don't pollute the substrate carrier with
forensic metadata it doesn't need for replay correctness.

## New Findings From Extended Document Scan (Comparisons 6–10)

Three findings sharpen the priority list without changing the ordering:

### N1. Constructive edge vs rollup edge disambiguation — analyzer concern

Per Comparison 8 finding #6: TS's same-name `derive_code_surface` is a
**rollup** that closes 445 obligations against zero product files. The
actual constructive work happens in `derive_component_code_surface` (20
product files). Same-name comparison to Python's `derive_code_surface`
gives the wrong answer because the comparison axis (rollup vs
constructive) is hidden.

This is an analyzer concern, not a substrate one. The T-161 analyzer
should expose per-edge `kind: constructive | rollup | qualification`
classification so comparisons across systems map honestly. Suggested
addition to T-161 spec: a `constructiveLineage` projection per edge
identifying which edge actually wrote the files vs. which closed against
them.

### N2. Requirement trace alias duplication during retry — gap dossier dedup

Per Comparison 10: TS retry pressure for `prepare_test_execution_surface`
shows the same blockers (`REQ-COV-007`, `REQ-DQ-002`, `REQ-DQ-003`)
repeated across stage 05 coverage, stage 07 DQ, stage 11 integration,
stage 12 LDM, stage 15 traversal, and stage 16 typing requirement
aliases. Same requirement, multiple stage-aliased presentations, all
firing the same blocker.

This is **gap-dossier inflation**: the same missing-trace pressure
expands into multiple seemingly-distinct blockers, growing the retry
prompt to 2.5 MB and the handoff to 6.6 MB. Without dedup, retries
compound the framework-decode tax described in priority #5.

**Suggested:** add a canonical requirement-trace ID with alias resolution
in the gap dossier so the same missing trace produces one blocker, not
six. This is consumer-side (odd_sdlc) graph work, not substrate work.
Lands as an opportunistic improvement during priority #5 (prompt
locality) work.

### N3. Code-construction depth — TS smaller than Python test35

Per Comparison 8: Python `test35` produced dozens of Scala source files
across module subpackages and domain subdirectories. TS
`derive_component_code_surface` final close writes 20 product files —
"many concepts represented in fewer files." Depth gap is measurable.

This may be intentional (different product cut, ADR-driven smaller
modules) or it may indicate that the F_P content evaluator isn't pushing
for full implementation depth. The walkthrough notes this as "not yet
test35-equivalent behavior" but does not declare it a defect.

**Suggested:** treat as a measurement question, not a refactor priority.
The analyzer should surface depth metrics (files-per-module,
source-lines-per-requirement) so the gap is visible. If after Waves A–C
land and execution evidence is admitted, the test pass rate is still
low, depth becomes a Wave-D concern. Otherwise it's product variance,
not a parity gap.

## Recommended Sequencing

**Wave A first**, as one batch:

- (1) closure lifecycle + (2) semantic convergence obligation + (4)
  execution result surface together close the "what is closure" question
- (3) UAT-before-design completes the pressure-direction fix that (1) and
  (2) need to be tested against

These four are not separately verifiable. Until they all land, none of
them can be proven correct because each tests aspects of the others.

**Wave B next** (items 5, 6, 7) for the completion-through-execution
lane. (5) lets the worker actually do test35-style construction without
framework decode; (6) closes the testcase→execution admission chain;
(7) closes the run.

**Wave C in priority order** (items 8–13). These are valuable but
second-wave — they sharpen behavior the first wave makes visible.

**Wave D** (item 14) is infrastructure and can run independently at any
point.

## The One Trap To Avoid

Treat #4 (execution result surface) as anything other than the keystone.
The walkthrough's Comparison 10 shows TS has reached
`prepare_test_execution_surface` but is still repairing requirement-trace
pressure rather than admitting actual `sbt test` evidence. Closure of
the prep edge alone is not test35 parity. The decisive comparison
remains: did TS actually run the declared test command and admit the
result as execution evidence, not merely whether prep closes.

If only one item gets done, do #4. Without admitted execution evidence
flowing into the closure spine, every other refactor risks reproducing
the F1 / F3 / F4 failure modes the master reference cataloged.

## Trust Boundary Reminder From Prior Review

The substrate cannot enforce these refactors on its own. The substrate
provides typed gates; the consumer (odd_sdlc graph + F_D plugin output
shape + overlay declarations + evidence policy + pressure projector
emission) must use them honestly. The prior review enumerated five
consumer-side audits (R1–R5) the substrate cannot perform. This priority
list is the constructive companion to those audits: the audits prevent
bad declarations; this list adds the missing declarations that prevent
bad outcomes.

A consumer-side discipline test for T-170 work: for every item on this
list, ask "does odd_sdlc declare the substrate carrier honestly?" If
the answer is "we infer it from somewhere else," the substrate's defense
is bypassed and the failure mode returns.

---

This is commentary, not law. The findings derive from the Codex
walkthrough as of 2026-05-17. New comparisons (11+) covering test
execution result, run archive, and release surfaces will likely sharpen
priorities #4 and #7 once observed. Ratification of any change belongs
in the appropriate ticket surface under `TICKET_METHOD.md`, not in this
post.
