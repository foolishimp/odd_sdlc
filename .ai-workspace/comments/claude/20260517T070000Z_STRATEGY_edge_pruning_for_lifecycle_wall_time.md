# STRATEGY: Edge Pruning For Lifecycle Wall-Time

**Author**: claude
**Date**: 2026-05-17T07:00:00Z
**Updated**: 2026-05-17T07:50:00Z
**Addresses**: 22-edge `current_full_traversal` lifecycle wall-time. Targets T-171 §G3 (graph product consolidation) and T-161 analyzer constructive-vs-rollup classification. Investigates whether parallelism, process-startup tuning, or edge pruning is the highest-value lever for reducing the ~70 min hello-world full lifecycle. Extended through four addendums to a `Min(F_P)` reframing that uses the existing per-edge evaluator router rather than introducing new constitutional structure.
**Status**: Open
**Scope**: Commentary on lifecycle wall-time. Not specification or ratified design.

**References**:

- Live archive measured: `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T054327856Z_pid84665` (local-spawn, 14 edges completed)
- Live archive measured: `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T065143313Z_pid80634` (pty-terminal, 4 bootstrap edges completed)
- Graph catalog: `build_tenants/typescript/code/src/graph/catalog.ts:101-316`
- Process transport: `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/shared/traced_process/index.ts`
- T-171 ticket: `.ai-workspace/tickets/active/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md` §G3, §W7, §W8
- Worker-axiom rollup hint: `build_tenants/typescript/code/src/operator/handoff.ts:5668`
- Decommission map row 22: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DECOMMISSION_REGISTER.md`

## Position

The biggest available wall-time lever for the SDLC lifecycle is **edge pruning**, not parallelism and not process/PTY tuning. Pruning is roughly 3-4× larger than parallelism and ~10× larger than the PTY/process-startup lever.

The reason: most of the 22 edges in `OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS` are spending ~150-300 s per edge to invoke an F_P worker for work that is either (a) an F_D rollup over already-admitted carriers, (b) declarative metadata that could fold into a sibling F_P edge, or (c) conditional on a failure path that did not occur. Each of those edges still costs one full claude-CLI spawn + prompt round-trip + tool loop, even though it produces no genuinely probabilistic content.

## Findings

### Measured baseline (per-edge timings)

Median of the 14 closed edges in archive `20260517T054327856Z_pid84665`:

- process_started → first stdout: ~190 ms (local-spawn) / ~6,260 ms (pty-terminal — net regression, see separate finding)
- process_started → first tool use: ~7 s
- last stdout → process exit: ~520 ms
- total edge wall: 90-306 s (median ~210 s)

Process-level startup overhead is negligible. Edge wall is dominated by model inference + tool loop. The PTY executor profile currently adds ~6 s/edge of pure overhead because `code/src/shared/traced_process/index.ts:743` allocates a fresh screen session per request (no `terminalSessionKey` reuse from `installed_operator`).

### Edge classification by actual content type

Each of the 22 edges declared in `OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS` (`catalog.ts:101-124`) falls into one of five classes:

| # | Edge | Class | Evidence |
|---:|---|---|---|
| 1 | derive_intent_surface | Constructive F_P | New authority content |
| 2 | derive_product_surface | Constructive F_P | New authority content |
| 3 | derive_goal_surface | Constructive F_P | New authority content |
| 4 | derive_requirement_surface | Constructive F_P | New authority content |
| 5 | derive_uat_testcases_surface | Constructive F_P | New test pressure |
| 6 | derive_testcase_authority_surface | Binding F_P | Mechanical row-to-req binding over #5 outputs |
| 7 | derive_feature_decomp_surface | Constructive F_P | Decomposition |
| 8 | derive_design_surface | Constructive F_P | Design content |
| 9 | derive_scenario_surface | Constructive F_P | Scenario content |
| 10 | derive_implementation_design_surface | Constructive F_P | Implementation plan |
| 11 | derive_component_code_surface | Constructive F_P | Actual code |
| 12 | qualify_component_realization_surface | **F_D check** | Verifies code vs topology, no F_P content |
| 13 | derive_code_surface | **Rollup** | Worker axiom (`handoff.ts:5668`) names it as "compatibility rollup over admitted component_code_surface and component_realization_qualification_surface evidence" |
| 14 | derive_test_design_surface | Constructive F_P | Test plan |
| 15 | derive_component_test_surface | Constructive F_P | Test code |
| 16 | prepare_test_execution_surface | **Declarative** | Declares command/env/inputs — metadata, not work |
| 17 | derive_test_execution_result_surface | Constructive F_P | Execution evidence (T-171 closure law requires this; cannot remove) |
| 18 | qualify_component_test_execution_surface | **F_D check** | Verifies observed vs expected, no F_P |
| 19 | derive_component_repair_schedule_surface | **Conditional** | Only needed when `failedCount > 0` in #17; empty when tests pass |
| 20 | derive_test_run_archive_surface | **Rollup** | Archive surface, mostly projection |
| 21 | derive_release_depth_parity_surface | **F_D check** | Co-affirmation across impl+test |
| 22 | prepare_release_surface | **Rollup** | Release bundle |

Eleven of 22 are not constructive F_P work. They are dispatched as F_P-worker edges because the runtime treats every step as a worker invocation, not because their content is probabilistic.

### Parallelism is the smaller lever

Topological dependency analysis of the same `catalog.ts` inputs/outputs:

- 22 edges collapse to 18 critical-path levels under perfect parallel scheduling
- Three parallel buckets exist: L6 (testcase_authority ∥ feature_decomp), L11 (qualify_realization ∥ test_design), L12 (code_rollup ∥ component_test ∥ test_execution_prep)
- Maximum parallelism saving: 4 edges of wall = **~13 min off ~70 min lifecycle** (~18%)

### PTY/process startup is the smallest lever

- `claude` CLI cold start: ~190 ms × 22 = ~4 s total
- Process teardown: ~520 ms × 22 = ~12 s total
- Current PTY-without-reuse: **costs ~132 s additional per lifecycle**; eliminating that returns to local-spawn baseline

## Pruning tiers

### Tier 1 — Reclassify F_D rollups and declarative edges (safe for any scenario)

Move these from F_P-worker dispatch to inline F_D operations executed synchronously in the closure path:

- #12 `qualify_component_realization_surface` → inline F_D after #11 closes
- #13 `derive_code_surface` → pure projection over admitted carriers
- #16 `prepare_test_execution_surface` → fold contract into #17 worker brief
- #18 `qualify_component_test_execution_surface` → inline F_D after #17 closes
- #20 `derive_test_run_archive_surface` → pure projection
- #21 `derive_release_depth_parity_surface` → inline F_D over #11 and #17
- #22 `prepare_release_surface` → projection bundle

Estimated saving: 6-7 edges × ~250 s = **~25-30 min per lifecycle**.

Invariant preservation: these edges either project from carriers already admitted by prior constructive edges or check shape, identity, and routing. None of them produce product content under the T-171 closure law (`F_P fulfillment ledger + admitted execution evidence + no surviving residual pressure → close`). Treating them as F_D operations is consistent with what they already are; the change is in dispatch, not in semantics.

### Tier 2 — Conditional skip on happy path (saves 1 edge when tests pass)

- #19 `derive_component_repair_schedule_surface` fires only if `derive_test_execution_result_surface.failedCount > 0`. On a happy-path lifecycle this edge produces an empty schedule.

Estimated saving: ~250 s when no test failures occur.

Invariant preservation: the "execution result evidence drives repair" invariant is preserved — an empty schedule is the truthful read when there is nothing to repair, and a non-empty result still triggers the edge.

### Tier 3 — Bundle tightly coupled constructive edges (scenario-dependent)

Some constructive F_P edges travel together and could land in one worker invocation:

- #5+#6 (`uat_testcases` + `testcase_authority`) — testcase authority is a mechanical binding over uat rows
- #7+#8 (`feature_decomp` + `design`) — decomposition is part of the design reasoning
- #10+#11 (`implementation_design` + `component_code`) — plan-and-build for small surfaces; risky for complex products, keep separate for data_mapper
- #14+#15 (`test_design` + `component_test`) — test plan and test code together

Estimated saving (hello-world): 3-4 edges × ~250 s = **~12-16 min**. Less on data_mapper where separation is genuine.

Invariant preservation per bundle:

| Bundle | Invariant | Preserved when |
|---|---|---|
| #5+#6 | "test pressure exists before design construction" | bundle runs before #7/#8 |
| #7+#8 | "design responds to feature decomposition" | one call produces both, with feature_decomp visible before design selects |
| #10+#11 | "implementation decisions are replay-visible" | both products write to ledger before close |
| #14+#15 | "test plan exists before test execution" | bundle runs before #17 |

Tier 3 is `requirement_reprice`-class because it changes the graph product set; it likely needs its own ticket beyond T-171's current scope.

### Combined potential

| Configuration | F_P calls | Wall (hello-world, current per-edge medians) | Saving vs current |
|---|---:|---:|---:|
| Current sequential | 22 | ~70 min | — |
| + parallelism only | 22 / 18 levels | ~57 min | -19% |
| + Tier 1 (rollups → F_D) | 15 | ~45 min | -36% |
| + Tier 1 + Tier 2 | 14 (happy path) | ~42 min | -40% |
| + Tier 1 + 2 + 3 | ~8 | ~22 min | -69% |
| + Tier 1 + 2 + 3 + parallelism | ~8 / ~6 levels | **~16 min** | **-77%** |

For data_mapper the bottom row likely lands at 25-30 min instead of 16 because Tier 3 is more conservative (real product complexity makes the bundles less safe).

## Recommended Action

Land the tiers in order. Each is a distinct change class and a distinct risk profile.

1. **Tier 1 first** (`realization_refactor`, lands inside T-171). Reclassify the seven F_D/rollup/declarative edges so they execute inline in the closure path instead of as F_P worker dispatches. Each goes from ~4 min to <1 s. No worker prompts to redesign. Largest single-step saving with lowest risk.
2. **Tier 2 second** (`realization_refactor`, lands inside T-171). Add the `failedCount > 0` conditional on #19. Trivial change, ~250 s saving per happy-path run.
3. **Revert or fix PTY** (`realization_refactor`). The current pty-terminal profile costs ~132 s per lifecycle for no benefit because there is no session reuse (`traced_process/index.ts:743` mints a fresh session per request). Either switch back to `local-spawn` or wire `terminalSessionKey` reuse from `installed_operator` plus `claude --resume` inside the persistent screen. Do not run PTY-per-edge without reuse.
4. **Add parallel scheduling** (`design_reframe`). Walk the DAG by topological level instead of the fixed linear `OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS` sequence. The three parallel buckets are already implicit in `catalog.ts` inputs/outputs; the scheduler just needs to expose them.
5. **Tier 3 last** (`requirement_reprice`, separate ticket). Bundle tightly coupled constructive edges into one worker invocation. Requires updating worker handoff templates so one prompt produces both halves of a bundle. Higher prompt-engineering cost; bigger payoff. Conservative for data_mapper.

Together: ~70 min hello-world lifecycle → ~16 min, with closure-law invariants preserved. For data_mapper: a 2-3× speedup over the current trajectory.

The pruning lever is decisive enough that landing Tier 1+2 alone (which fits inside T-171 without proliferating tickets) recovers ~25-30 min per lifecycle proof run, materially affecting how often we can afford to run the TS.t171/data_mapper lifecycle gate.

## Open Questions

- Does T-171 §G3 ("Consolidation is accepted only when the invariant is explicit in design, enforced in code, and visible in analyzer output") require each Tier 1 reclassification to land with a paired design note naming the F_D-rollup invariant? Likely yes for `derive_code_surface` (already named as rollup in worker axiom) and `derive_release_depth_parity_surface`; possibly inline for the three `qualify_*` checks.
- Does the T-161 analyzer's `constructive | projection | rollup | missing | unmapped` classification need to be exercised against the reclassified edges to prove the consolidation is visible? Likely yes — that is T-171's explicit ratification path.
- Does Tier 3 belong in T-171 or its own ticket? Recommend separate; Tier 3 changes the graph product set and warrants its own re-entry analysis.

---

## Addendum 1 (2026-05-17T07:30:00Z): Proportionality As The Underlying Concern

The wall-time framing missed a deeper concern. Direct measurement of the in-flight archive `20260517T054327856Z_pid84665` (hello-world full lifecycle) shows the disproportion is constitutional, not just operational:

| Surface | Lines |
|---|---:|
| `hello.js` (the actual product) | **29** |
| `hello.test.js` | 41 |
| INTENT.md | 173 |
| PRODUCT.md | 217 |
| GOALS.md | 235 |
| 10-generated-bootstrap.md | 273 |
| 20-generated-uat-testcases.md | 256 |
| 30-generated-testcase-authority.md | 276 |
| feature_decomp_surface.md | 318 |
| scenario_surface.md | 333 |
| ADR-001-design-surface.md | 380 |
| component_code_surface.md | 634 |
| component_realization_qualification_surface.md | 702 |
| component_test_surface.md | 723 |
| code_surface.md | 754 |
| ADR-002-implementation-design-surface.md | 828 |
| ADR-003-test-design-surface.md | 1,044 |
| **Ceremony total** | **~7,150** |
| **Runtime archive** | **186 MiB** |

**~246× more ceremonial content than product content.** ~70 min wall, 22 worker invocations, 89 MiB events, to deliver one line of code.

This is an ODD method violation, not an inefficiency. `ODD_METHOD` is the worksite-law surface that requires worksite mass to be proportional to outcome value. The current SDLC honours every other ODD constraint (event sourcing, F_P/F_D separation, evidence-backed closure) but not proportionality.

Root cause: the graph has **no outcome-class awareness**. `OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS` (`catalog.ts:101-124`) is one fixed 22-edge linear sequence applied identically to `process.stdout.write("Hello, world!")` and to a multi-module data mapper. Every edge fires an F_P worker. Every worker is told to produce a thorough authority surface. No layer of the system knows the actual outcome is trivial. The model honestly produces 700-1000 lines because that is what the prompt template asks for.

Proposed mechanisms (ordered by leverage):

1. **Declared outcome class drives overlay selection.** Scenario/product declares one of `{framework_smoke, tutorial_example, bounded_feature, domain_product, multi_tenant_platform}`. Each class binds a different overlay in `code/src/graph/overlays.ts`. Hello-world declares `framework_smoke` → 3-4 edges. data_mapper declares `domain_product` → full 22. Same graph language, different governed traversal.
2. **Pressure-sensitive lazy edge firing.** Each edge declares a `skip-if-no-pressure` predicate. An edge fires only when downstream presses for its output. For hello-world, nothing presses for `feature_decomp_surface` because there is only one feature; the edge produces an empty/single-row surface and closes.
3. **Output-size budgets in the worker brief.** When F_P is genuinely needed but outcome is small, the brief carries an explicit size budget. Workers are instructed to produce minimum viable surface within the budget. F_D postflight enforces the cap.
4. **Outcome-class-aware overlay composition (constitutional).** Outcome class is part of the `Scope` declaration. The overlay registry resolves `(scope.kind, outcomeClass)` → overlay. The graph definition stays one source of truth; multiple overlays project subsets of it. Adds a sixth analyzer class to T-161: `outcome_class_skipped` with the skip predicate as the named justification.

Combined effect on hello-world: ~70 min → ~5-8 min, ~7,150 ceremony lines → ~100, 186 MiB archive → ~5 MiB. For data_mapper: essentially unchanged because the outcome genuinely justifies the depth. The framework now matches the outcome instead of imposing a fixed mass.

---

## Addendum 2 (2026-05-17T07:35:00Z): F_D Cannot Generically Process — Retractions To Tier 1

Addendum 1's M2 proposed "F_D template fill for trivial surfaces". That is the "behavioral F_D" code smell. Retracted.

The empirical record in T-171 confirms F_D is unreliable for generic processing. Every "F_D bug" in the ticket's audit notes is an instance of F_D being too narrow to handle F_P output variation:

- `test_design_register` envelope unwrap fix (`test_design_register.ts:391-428`) — F_D parser was too strict for the worker's nested-payload envelope shape
- `component_depth_register_invalid` retry class — F_D parser drift
- The `framework_carrier_parser_drift` retry classification (`retry_forensics.ts:33-42`) exists precisely because F_D keeps tripping on F_P shape variation

The pattern `F_P → F_D admit → F_D rollup → F_D rollup` looks like clean separation but actually means:

- F_D admit: necessary (the envelope contract at the carrier boundary)
- F_D rollup #1: either restates what admit already validated, or interprets content (and trips)
- F_D rollup #2: same problem, downstream of #1

Chained F_D operations are either redundant or guessing. Failure modes look like framework drift instead of like real content issues.

The correct decomposition is **three operating modes, not two**:

| Mode | What it does | When it applies |
|---|---|---|
| **F_P construction** | Generates content under contract; envelope checked at admission | Whenever content involves judgment, including "trivial" surfaces where wording matters |
| **F_D admission** | Narrow envelope/schema check at the carrier boundary; one shot, one place | Always, immediately after F_P at the boundary; never chained |
| **Direct materialization** | Framework writes the file from declared inline content; no transform, no regime | When content is fully declared in the scenario or product spec |

The middle ground "F_D fill" does not actually exist as a reliable mode. It dissolves into either F_P (if any judgment is needed) or direct materialization (if no judgment is needed).

**Retractions to Tier 1 of the original pruning proposal:**

| Original Tier 1 proposal | Revised classification |
|---|---|
| `derive_code_surface` → inline F_D | **Projection** — don't materialize; compute on demand via analyzer/projection layer over admitted carriers |
| `derive_test_run_archive_surface` → inline F_D | **Projection** — same |
| `prepare_release_surface` → inline F_D | **Projection** — same |
| `qualify_component_realization_surface` → inline F_D | Stays **F_P**, but small/narrow (code-vs-topology judgment) — not full ADR-producing |
| `qualify_component_test_execution_surface` → inline F_D | Stays **F_P** (observed-vs-expected judgment) |
| `derive_release_depth_parity_surface` → inline F_D | Stays **F_P**, small/narrow |
| `prepare_test_execution_surface` → inline F_D | **Fold into parent F_P** brief for `derive_test_execution_result_surface` — declarative metadata travels with construction |

The wall-time estimate from Tier 1 stands, but the mechanism is different: savings come from removing rollup materialization (it becomes a projection over events, not a written file) and folding declarative steps into their parent F_P. Not from "F_D inline".

Hello-world's declared content (INTENT/PRODUCT/GOALS/UAT/testcase_authority) becomes **direct materialization**: the scenario declares the content inline; the framework writes the files as-is. No transform, no claude, no F_D parser to drift against. Zero ambiguity, zero shape risk.

---

## Addendum 3 (2026-05-17T07:40:00Z): Min(F_P) As The Constitutional Principle

The proportionality framing and the F_D-unreliability correction both reduce to one principle:

> Between Intent and Outcome, minimise the count of F_P invocations subject to the closure-law floor.

`Intent → Min(F_P) → Outcome`.

This is the right optimization target. Every other lever discussed is a derivative:

| Lever | F_P count effect | Mode |
|---|---|---|
| Direct materialization of declared content | -N (each declared surface = -1 F_P) | Removes ceremonial F_P |
| Bundle tightly coupled constructive edges (former Tier 3) | -N (each bundle = -1 F_P) | Combines F_P |
| Projection layer for rollups (no materialized files) | -N (each rollup → 0 F_P) | Eliminates ceremonial F_P |
| Outcome class → composition selection | enables the above | Meta |
| F_D admission at envelope only | preserves Min(F_P) integrity | Necessary boundary, not a count change |
| Parallel execution | 0 F_P count change | Wall-time only |
| Persistent session / PTY reuse | 0 F_P count change | Overhead-per-call only |

### Floor of F_P count

The closure law (`F_P fulfillment ledger + admitted execution evidence + no surviving residual pressure → close`) sets the lower bound:

| Required F_P | Why it cannot be removed |
|---|---|
| ≥1 product-content F_P | Closure law: F_P fulfillment ledger required for product close |
| ≥1 execution-evidence F_P | Closure law: admitted execution evidence required |
| +N for residual ambiguity | Each genuine ambiguity in Intent that cannot be resolved by direct materialization or a single F_P bundle |

For hello-world:
- Product content: 1 F_P (bundle: produce both `hello.js` and `hello.test.js` — test is mechanical from product)
- Execution: 1 F_P-as-dispatcher (run the test, admit the evidence)
- Residual ambiguity: 0 (intent fully determines outcome)
- **Floor = 2.** Current = 22. Overhead ratio = **11×.**

For data_mapper:
- Product content: 3-5 F_P (multiple components, can't bundle without losing replay visibility)
- Execution: 1 F_P-as-dispatcher (plus more if failure repair fires)
- Residual ambiguity: 2-3 F_P (genuine design decisions needing disambiguation)
- **Floor ≈ 6-8.** Current = 22. Overhead ratio ≈ 3×.

The floor scales with outcome complexity. The current graph does not.

### Constitutional implication

The graph stops being a **fixed pipeline** and becomes a **family of compositions over a shared algebra**. GTL already supports this — `compose`, `substitute`, `gate`, `promote` are the operators that build min-path compositions over a common edge catalog.

`OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS` should be one composition among many, not THE composition. The framework selects the composition whose Min(F_P) closes the declared Intent → Outcome span.

Selection criteria:

1. Outcome class (declared upstream) → candidate composition family
2. Intent decomposition (if non-trivial, the first F_P plans subsequent F_Ps; if trivial, skip planning)
3. Closure law (every candidate must satisfy F_P-fulfillment + execution-evidence + no-residual-pressure for the Outcome)

---

## Addendum 4 (2026-05-17T07:50:00Z): Min(F_P) Is Variant Selection Over The Existing Evaluator Router

Addendum 3's "Constitutional implication" subsection read as if a new composition family was needed. It isn't. The TS implementation already has the evaluator router and the variant pattern. Min(F_P) is **variant selection over existing structure**, not new structure.

### The router already exists

Each reusable graph function declares its evaluator phase sequence in `code/src/graph/library.ts` via `computeOrder`. The per-edge router is regime-tagged and ABG honours it:

| Graph function | computeOrder (library.ts) | Required F_P |
|---|---|---:|
| `FG_SINGLE_TYPED_TRAVERSAL` (:306-311) | `[preflight:F_D, construct:F_P, escalate:F_H_optional, postflight:F_D]` | 1 |
| `FG_INGRESS_PROJECT` (:339-344) | `[preflight:F_D, interpret:F_P, escalate:F_H_optional, postflight:F_D]` | 1 |
| **`FG_CONFORM_PROJECT`** (:372-377) | `[preflight:F_D, canonicalize:F_D, carry_ambiguity:F_P_optional, postflight:F_D]` | **0** |
| `FG_CONFORM_PROJECT_AUTHORITY` (:406-411) | `[observe:F_D, induct:F_P, project_next_action:F_P, postflight:F_D]` | 2 |
| `FG_MATERIALIZE_DECLARED_PRODUCT_ASSET` (:436-442) | `[observe:F_D, construct:F_P, admit_evidence:F_D, evaluate_action:F_P, postflight:F_D]` | 2 |

Three observations:

- **Zero-F_P close is already a permitted mode.** `FG_CONFORM_PROJECT` declares `F_P_optional`. The framework already permits a close without firing F_P when the optional phase doesn't trigger.
- **F_D admit-only phases are interleaved between F_P phases.** Every existing `computeOrder` has F_D phases at the envelope boundary (`preflight`, `postflight`, `admit_evidence`). The chained-F_D pattern Addendum 2 warned about isn't structurally encouraged by the router; it would have to be introduced as a regression.
- **Per-edge regime routing is already the constitutional shape.** Each graph function owns its own evaluator sequence. The lifecycle cost question reduces to "which `computeOrder` and which leaf-function variant resolves under which outcome class".

### The variant pattern already exists

`code/src/graph/catalog.ts:402+` declares `LITE_FUNCTION_CATALOG` with `FG_DERIVE_LITE_DESIGN_ADR_SURFACE` and `FG_DERIVE_LITE_COMPONENT_CODE_SURFACE` — bounded variants of the corresponding bootstrap edges that produce a compact design/ADR authority surface for a bounded implementation slice without expanding the full solution architecture graph.

This is the same shorter-path composition pattern Addendum 3 asked for. It's already accepted methodologically. The decision to extend it to per-outcome-class variants is methodologically continuous, not a constitutional change.

### What is actually missing

Selection. `OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS` is one composition that picks default (non-LITE, full-F_P) variants. There is no resolver that:

- picks LITE variants when outcome class is `framework_smoke` or `tutorial_example`
- elects `F_P_optional` skipped when input determines output
- substitutes a projection over events for a rollup edge

The router and variants exist. The outcome-class-aware selector does not.

### Reframed scope

The recommended next-ticket scope from Addendum 3 was overstated. Reduced scope:

- **Constitutional (small):** add an `outcomeClass` field on `Scope` declarations and on scenario/product spec surfaces. Default `domain_product`.
- **Constitutional (small):** add an `outcome_class_skipped` value to T-161's `SDLC_FD_RUN_ANALYSIS_STAGE_CLASS_VALUES` (`code/src/analysis/types.ts:105-111`) so the analyzer can report which edges were skipped by composition choice vs missed by drift.
- **Operational:** introduce a variant resolver that maps `(scope.kind, outcomeClass, edgeRef)` → graph function variant (defaulting to current bootstrap variant when no class-specific variant exists).
- **Operational:** extend `LITE_FUNCTION_CATALOG` (or add per-outcome-class variants) for edges where a smaller `computeOrder` makes sense for `framework_smoke` and `tutorial_example` outcomes.
- **Operational:** convert rollup edges (`derive_code_surface`, `derive_test_run_archive_surface`, `prepare_release_surface`) to projections over admitted events — no materialised files, no F_P, no F_D parser to drift against. This is independent of outcome class and benefits all classes.
- **Operational:** for declared inline content (hello-world's INTENT/PRODUCT/GOALS), introduce direct materialization mode — framework writes from scenario declaration without any evaluator phase. Note this requires no router change; it is a new evaluator-free path that runs before any graph function is resolved.

What does NOT need to be added:

- No new evaluator router (per-edge `computeOrder` already exists)
- No new regime (F_D admission-only, F_P optional, F_H optional are all already declared)
- No new composition algebra (GTL's `compose`, `substitute`, `gate` are sufficient)
- No new variant catalog mechanism (`LITE_FUNCTION_CATALOG` shows the pattern)

### Implication for Addendum 2

Addendum 2's three-mode model (`F_P construction / F_D admission / Direct materialization`) maps directly onto the existing router's phase tags:

- `F_P construction` → `construct:F_P`, `interpret:F_P`, `induct:F_P`, `evaluate_action:F_P`
- `F_D admission` → `preflight:F_D`, `postflight:F_D`, `admit_evidence:F_D`, `observe:F_D`, `canonicalize:F_D`
- `Direct materialization` → evaluator-free path (no graph function resolution; framework writes from declaration)

The first two are router phases; the third is a router bypass. The retractions from Addendum 2 stand, but they're now expressible in the language the framework already speaks.

---

## Conclusion: Min(F_P) Supersedes The "Pruning Tiers" Framing

The original tier framing was wrong-shape. Pruning is not the principle — Min(F_P) is. Proportionality (Addendum 1) and F_D bounds (Addendum 2) are consequences. The right decomposition for any future lifecycle-cost work:

1. What is the **floor** of F_P count for this Outcome under the closure law?
2. What is currently being spent **above the floor**?
3. What **mechanism** removes each above-floor F_P call? (direct materialization, bundling, projection, outcome-class composition selection — in that order)
4. **Only then** optimise the cost-per-remaining-F_P-call (prompt cache, session reuse) and parallelise what remains.

This is the ODD-method-aligned shape: worksite mass = outcome value, expressed concretely as Min(F_P) over Intent → Outcome.

**Recommended next ticket scope** (separate from T-171; updated per Addendum 4 to use the existing evaluator router rather than introduce a new composition family):

- Constitutional (small): add an `outcomeClass` field on `Scope` declarations and on scenario/product spec surfaces. Default `domain_product`.
- Constitutional (small): add `outcome_class_skipped` to T-161's `SDLC_FD_RUN_ANALYSIS_STAGE_CLASS_VALUES` (`code/src/analysis/types.ts:105-111`) so the analyzer can report which edges were skipped by composition choice vs missed by drift.
- Operational: introduce a variant resolver that maps `(scope.kind, outcomeClass, edgeRef)` → graph function variant. Defaults to current bootstrap variant when no class-specific variant exists.
- Operational: extend `LITE_FUNCTION_CATALOG` (or add a per-outcome-class variant pattern alongside it) for edges where a smaller `computeOrder` is the right answer for `framework_smoke` and `tutorial_example`.
- Operational: convert rollup edges (`derive_code_surface`, `derive_test_run_archive_surface`, `prepare_release_surface`) to projections over admitted events — no materialised files, no F_P, no F_D parser to drift against. Benefits all outcome classes.
- Operational: introduce a direct-materialization mode for declared inline content (`framework_smoke`'s INTENT/PRODUCT/GOALS) that runs as an evaluator-free path before graph function resolution.
- Operational: keep the three `qualify_*` edges and `derive_release_depth_parity_surface` as small/narrow F_P (per Addendum 2's retraction), not as inline F_D.

What does **not** need to be added: a new evaluator router (already in `library.ts`), a new regime mode (`F_P_optional`/`F_H_optional` already declared), a new composition algebra (GTL already has it), or a new variant catalog mechanism (`LITE_FUNCTION_CATALOG` shows the pattern).

T-171 closure should not be expanded to absorb this. T-171 closes when test35 lifecycle parity is proved. The Min(F_P) refactor is the **next** wave — without it, every future lifecycle proof run costs ~70 min per scenario, which is the structural reason audit cycles are slow.
