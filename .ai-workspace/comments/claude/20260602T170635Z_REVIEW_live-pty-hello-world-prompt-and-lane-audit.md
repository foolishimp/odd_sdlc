# T-132 JS hello-world live PTY run — prompt-as-code correctness audit + lane-failure forensics

- author: claude
- date: 2026-06-03
- scope: one fresh live PTY lane I started and monitored end-to-end (`npm run test:t132:hello-world-live:pty`). Prompt-correctness audit of every prompt the lane emitted, plus forensics on the lane's terminal failure.
- run identity (mine): `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260602T165003569Z_pid34723` — node test PID `34723`, run id `run://odd-sdlc/public-start`, target `graph_function:framework_smoke_min_fp`, `until=converged`, executor profile `pty-terminal`.
- excluded (NOT mine, untouched per boundary): runs `…20260602T162519259Z_pid7793` (worker 68678, dead) and `…20260602T165605462Z_pid95189` (worker 50216, was live during my audit). I inspected and managed only PID 34723 and its children.
- governance: STDO. Tool-profile / permission-vs-prescription anchored to PRODUCT.md §Generic Computation Regime Boundary and DESIGN_MODULE_METHOD (§10 No Semantic Center, §11C Recurrence, §12 Interface Bleed). F_P/F_D boundary per PRODUCT.md.
- status: **commentary / evidence surface.** Two prompt-correctness defects confirmed (ready-to-apply fix below). One lane-failure root cause confirmed at the *proximate* layer with a named promotion gate. No source patched — see §8.
- disposition: the run self-terminated (test failed, exit 1). node 34723 and all workers are gone. Archive preserved on disk. I did not kill anything.

---

## 1. Dominant outcome — the lane FAILED; it cannot get from design to code

The test failed after **~16.4 min** (982,547 ms, `--test-timeout=0`, so not a timeout):

```
Error: scenario_t132_hello_world_js_live: expected workspace file
       build_tenants/hello_world_javascript/src/hello.js missing
```

What actually happened (from `events.jsonl`, 495 events, and the 3 operator-runs):

1. `Fg_conform_project` — passed (induction).
2. Design edge `derive_lite_design_adr_surface` → `implementation_design_surface`, **attempt 1** (op-run `…165011386Z`): transform.C wrote `ADR-002`, the design-depth F_P evaluator wrote a clean 12-fragment register (all 12 sections, `designCompletenessVerdict` entity/attribute/flow all `satisfied`). Edge closed `close_allowed` / `fp_evaluate_result=passed` / `postflight=passed`.
3. `graph_span_assessed → graph_span_foldback_evaluated → graph_reentry_planned → graph_reentry_applied` — exactly **one** re-entry, back into the **same** design vector (`fromTerminalVectorIndex 0 → targetVectorIndex 0`, `changeClass: null`, `reEntryPoint: null`).
4. Design edge **attempt 2** (op-run `…165758293Z`): transform.C again + a review-grade edge-fulfillment evaluator (exit 0, wrote `sdlc_edge_fulfillment_ledger.json`) + design-depth evaluator again.
5. `terminal_reached: terminalKind="gap_stop", reason="orphan_evidence_cannot_satisfy_authority"`.

**The code edge was never dispatched.** `fp_dispatch_requested = 2` (both design); `FG_DERIVE_LITE_COMPONENT_CODE_SURFACE` produced no dispatch, no worker, no `src/`. Only `ADR-002` exists in the workspace.

**This is not a scenario-expectation bug.** The `framework_smoke_min_fp` overlay (`src/graph/overlays.ts:326,368-386`) explicitly declares:
- `frameworkSmokeMinFpGraphFunctionNames = [FG_FRAMEWORK_SMOKE_MIN_FP_EXECUTIVE, FG_DERIVE_LITE_DESIGN_ADR_SURFACE, FG_DERIVE_LITE_COMPONENT_CODE_SURFACE]`
- `terminalAssetTypes: ["component_code_surface"]`
- `assetTemplates: [{ assetType: "component_code_surface", defaultPath: "build_tenants/hello_world_javascript/src/hello.js", producer: FG_DERIVE_LITE_COMPONENT_CODE_SURFACE }]`

So the graph's own contract says this lane terminates at `component_code_surface` = `src/hello.js`. The scenario assertion is correct; the runtime failed to satisfy it.

**Classification — candidate, not yet promoted. Two readings; do not presume one.**
`orphan_evidence_cannot_satisfy_authority` admits two causes, and the governance default (AGENTS.md §6; my task text "do not patch generated hello-world product code from outside the F_P worker") is **(B) until (A) is affirmatively shown**:
- **(A) framework closure/projection defect** — well-formed design evidence is not being bound as the authority that releases `FG_DERIVE_LITE_COMPONENT_CODE_SURFACE`; the frontier fails to advance. Patchable in odd_sdlc.
- **(B) F_P worksite pressure** — the design F_P judgment legitimately left a residual semantic obligation that cannot ground the code edge yet. Not patchable from outside; it is repair pressure on the worker/prompt, not the framework.

Discriminator I ran (register + ADR vs. closure status):
- The design-depth register **declares and grounds the code target**: `fileTargetRows` = `src/hello.js` (role `source`) + `test/hello.test.js` (role `test`); `componentTopologyRows`/`componentRealizationRows` map `greeting_emitter → src/hello.js` grounded in `requirement:t132_hello_world_single_tenant.bootstrap.req_t132_001`; `firstProductFileToChange = src/hello.js`. `ADR-002` agrees and lawfully defers materialization to the downstream code edge (`materializationRequired=false`).
- Yet closure returned `graph_span_assessed.obligationRows[0] = { status: "semantic_gap" }` and the run **lawfully** `blocked` (`lawfulStopDispositions: ["product_converged","blocked"]`) with `orphan_evidence_cannot_satisfy_authority` — the code edge was never dispatched.

Per the discriminator (target declared + grounded → tilt A), this **weakens (B) and shifts the burden toward (A)**: the worksite produced exactly the grounded design evidence the contract asks for, and the graph did not advance on it. But a *lawful* `blocked` disposition (not a crash / unlawful state) keeps (B) live and means **the gate is not cleared.**
- **Promotion gate (remaining):** confirm whether the design-depth register is *meant* to be the upstream authority the code edge consumes, and what step turns "admitted design evidence" into "authority that releases the code edge." Resolve the `semantic_gap` against the well-formed register: is the gap a missing closure/projection binding (→ A) or a residual semantic obligation the design F_P must still satisfy (→ B)? Trace from `closure-decision://…` (the `post-action-reentry:retry` obligation) and the code-edge precondition in the graph spine.
- Either way this dwarfs the two prompt defects in impact: **a live hello-world cannot complete.**

---

## 2. Prompt-by-prompt metrics (every prompt the lane emitted)

| prompt | lines | bytes | max line | worker `--tools` | verdict |
|---|---|---|---|---|---|
| `worker_prompt.md` (transform.C, ×2) | 99 | 12.1 KB | 628 | `Read,Write,Edit,Glob` | **Finding 1** |
| `design_depth_fp_evaluator_prompt.md` | 253 | 40.9 KB | 470 | `Read,Write` | **Finding 2** + size note |
| `review_grade_edge_fulfillment_prompt.md` | 135 | 22.1 KB | 491 | `Read,Write` | **Finding 2** |

No prompt dumped a full authority file into stdout. The fat stdout lines (101 KB in transform, 87/42 KB in evaluator) are **stream-json `tool_result` envelopes** (Read results / a Write echo), not narration dumps — the no-dump discipline held.

---

## 3. Finding 1 — transform.C launch contract states its read cap only in shell syntax the worker cannot run

**Source:** `src/operator/plugins/transform/launch_contract.ts:8728`
**Rendered:** `worker_prompt.md:29` (reproduced verbatim in both edge-1 and edge-2 prompts — rule-of-two, systemic):

```
- IO cap: reads <=80 lines. jq/rg/cat/git diff/status end `| head -80`; no bare
  jq/rg/cat. sed is inclusive: end-start+1<=80; `200,299p` invalid (100), use `200,279p`.
```

The transform worker's profile for this edge is `Read,Write,Edit,Glob` — **no Bash** (`installed_operator.ts:2971`, via `constrainPlanningTransformWorkerTools`). So `jq/rg/cat/git/sed` are all unavailable; the lane's central "IO cap" axiom is expressed entirely in a vocabulary the worker can't execute.

Two independent facets (kept separate deliberately):
- **(a) tool-profile contradiction:** a non-shell worker is told how to bound shell commands. It didn't break the run — the model fell back to `Read`/`Glob` (tool trace: only `Read`, `Glob`, `Write` were used; no Bash attempt) — but it is incorrect prompt-as-code.
- **(b) no Read-tool bounding → large JSON read unbounded:** because the only read-cap language is the inoperative shell line, the transform prompt gives **no `Read` offset/limit discipline**. Consequence observed: the worker full-read `worker_invocation_package.json` (26 KB, L16) and `traversal_intent_package.json` (43 KB, L21) with no offset/limit. The design-depth evaluator prompt has the correct rule (`prompt:30/78/98`) and the evaluator used `limit:80` (L61) — the transform prompt is the asymmetric gap.

Severity: **medium.** Latent in this lane, but it mis-instructs every non-shell transform worker and pulls large authority JSON into context unbounded.

---

## 4. Finding 2 — evaluator prompts carry two contradictory truth surfaces about the tool profile

**Source:** `src/operator/plugins/evaluate/prompts.ts:49-53` (`tenantToolBoundaryPromptLines`), spread into **both** evaluator prompts at `prompts.ts:95` (design-depth) and `prompts.ts:348` (review-grade).

The block presumes an execution-capable worker:
```
- …before choosing any local script runtime, shell helper, evidence probe…
- …preserve tenant-declared environment variables when spawning child commands.
- …pass process.env through to child_process/spawn/exec unchanged…
- If a probe helper constructs an env object, start from {...process.env}…
- When a probe needs tool homes, dependency caches, boot directories…
```

But **both** evaluators dispatch `Read,Write` only (`installed_operator.ts:2986`, `:4241`), and the **same prompts** then assert the opposite:
- design-depth `prompt:29`: *"the default design-depth evaluator process exposes only Read and Write. Do not plan around shell, Node, jq, rg, cat, sed…"*
- review-grade `prompt:4`: *"Do not use apply_patch, shell redirection, scripts, formatters, build tools, or editor commands…"*

So each evaluator prompt simultaneously says "Read/Write only, no shell/Node" **and** "preserve env when spawning child commands / pass process.env to child_process/spawn/exec." Two truth surfaces about the tool profile in one prompt — confirmed empirically in **both** callers (not inferred).

Note the design-depth evaluator is dispatched `Read,Write` **unconditionally** (`installed_operator.ts:4241` has no shell gate), so for design-depth the contradiction is unconditional. Severity: **low-medium** (latent — both evaluators behaved correctly, used only Read/Write, no Bash attempt; the design-depth evaluator even used bounded Read). But it is exactly the "no multiple truth surfaces / must not tell a Read/Write worker to use Node/shell" defect.

---

## 4b. Finding 3 — runtime liveness over-credits heartbeat as "progress" (harness/runtime supervision)

Raised by a parallel codex analysis; I verified it against this run's code + artifacts. The structural claim holds; one of codex's specifics does not reproduce here (see §4c).

`abg/m03/contracts/runtime_liveness.ts`: `activityRowsForEvent` maps `actor_process_heartbeat` (timer-driven — `heartbeatMs`/`DEFAULT_HEARTBEAT_MS` in `transport/process_actor.ts`) into a `RuntimeLivenessActivityRow` just like real-output sources (`actor_process_stream_observed`→`local_spawn_stdout`, `actor_result_artifact_observed`→`result_artifact`, `plugin_traversal_prompt_materialized`→`structured_agent_stream`). Then `leaseStateFor` derives `inactivity_exceeded` from `latestActivity(activityRows)` over **all** rows, **with no source filter** (`runtime_liveness.ts:663`). So a bare heartbeat resets the inactivity lease identically to genuine worker output.

A stricter signal already exists — `latestArtifactActivity` filters to `result_artifact`/`archive_write`/`runtime_projection_write` (`:640`) — but it is consumed only by the `inspect_archive` disposition branch, **not** by the primary inactivity decision. So the framework computes the right signal and does not use it where it matters.

Consequence: a worker that is silently hung but still process-alive (heartbeat timer firing, no new stdout/tool/artifact) reads as `leaseState: active` / `disposition.action: continue_waiting` and never trips `inactivity_exceeded` → never `retry`/`controlled_terminate`. With the scenario's `--test-timeout=0`, the liveness observer is the *only* stall governor, so this is the supervision's blind spot.

In this run's projection, `lastActivity.sourceEventKind = runtime_activity_probe_observed` (a probe, not an artifact/stream event) held `leaseState: active` — i.e., active was asserted by a liveness probe, not by evidence of new work.

Class: **ABG/GTL runtime — supervision** (`runtime_liveness.ts`). Fix: compute the inactivity lease from output/progress sources only (`local_spawn_stdout`, `result_artifact`, `structured_agent_stream`), treating `actor_process_heartbeat` and pure liveness probes as "process-alive" but not "making progress." The `latestArtifactActivity`-style filter is the model; widen it to include stream/structured-output and route it into `leaseStateFor`.

## 4c. Codex reconciliation — what reproduced here vs. what did not

- **Over-crediting heartbeat (§4b): CONFIRMED** in code; latent in this run (no worker hung, so it never bit).
- **"An evaluator hung after 'Let me write the assessment JSON' while heartbeats masked it": NOT reproduced here.** All four evaluator processes (design-depth + review-grade, both attempts) exited `subtype:success`, `is_error:false`, last tool `Write`, `status:0`, `timedOut:false`, no signal — they wrote their artifacts and exited. The two design-depth evaluators were *slow* (~302 s, ~286 s) but not stuck. Codex may be describing a different run/session (e.g. `pid95189`) or the general risk; the §4b mechanism is exactly what *would* mask such a hang if it occurred. Conflict surfaced, not silently adopted.
- **"Review-grade should run constrained, not the materializing/transform profile": already constrained here** — review-grade dispatched `--tools Read,Write` in *both* attempts. Codex's concern is structurally valid only for review-grade on code/test/execution edges, where `reviewGradeEdgeRequiresShellTool` hands the full shell profile through `constrainReviewGradePlanningEvaluatorTools` — the same gate as Finding 1/§5. This design lane never reached those edges, so it was not exercised.
- **"Evaluator process failure must not be returned to transform.C/F_P as product repair": sound, and it is the F_P/F_D-boundary face of §1's open (A)-vs-(B) fork.** Not triggered here (evaluators succeeded; the stop was a closure `semantic_gap`), but if `orphan_evidence` is charged to the worksite (B) when it is really a closure/binding gap (A), that is the exact misattribution to avoid.

## 5. Shared root cause + the fix (conditional emission, not deletion)

The transform/evaluator tool profile is **computed, not fixed**, gated on:
```
reviewGradeEdgeRequiresShellTool(manifest) =
  manifest.targetAssetType ∈ { component_code_surface, component_test_surface,
                               test_execution_surface, runtime_execution_surface,
                               execution_result_surface }
```
(`installed_operator.ts:2948`). When **true**, the transform/review-grade worker keeps shell tools and the `jq/sed`/`child_process` lines are **correct and load-bearing**. When **false** (design/spec edges like this one), the worker is constrained to `Read,Write[,Edit,Glob]` and those same lines are wrong.

**Root cause:** `launchContractPrompt` (`launch_contract.ts`) and `tenantToolBoundaryPromptLines` (`prompts.ts`) are generated **blind to** the `reviewGradeEdgeRequiresShellTool(manifest)` decision. The prompt text and the tool-constraint decision are computed from the same manifest but kept inconsistent.

**Do not delete these lines** — that would break shell-capable (code/test/execution) edges. The fix is **conditional emission**, matching the pattern the design-depth prompt already uses for the same concern (`prompt:100-101`: *"under the default Read/Write profile…"*, *"if a future tool profile exposes one…"*):

1. Thread the shell-capability decision (the `reviewGradeEdgeRequiresShellTool(manifest)` boolean, or the resolved `allowedTools` string) into `launchContractPrompt(...)`, `designDepthFpEvaluatorPrompt(...)`, `reviewGradeEdgeFulfillmentPrompt(...)`, and `tenantToolBoundaryPromptLines(...)`.
2. **Shell-capable branch:** emit the `jq/rg/cat/sed | head -80` IO cap and the `child_process/spawn/exec` env guidance as today.
3. **Constrained branch:** drop the shell/`child_process` lines; emit the `Read` offset/limit bounded-inspection discipline instead (the transform prompt currently has none — fixes Finding 1(b) at the same time).
4. Focused tests: assert that for a manifest with `targetAssetType=implementation_design_surface` the rendered transform/evaluator prompts contain **no** `jq|rg|cat|sed|child_process|spawn|exec` token; and for `targetAssetType=component_code_surface` they **do**. This locks the gate to the prompt text.

This is the more defensible framing than "dead lines": the prompts already know how to condition on profile; these two emission sites were left ungated.

---

## 6. What held (confirmed positives — do not re-litigate)

- **A-050 proportionality flowed end-to-end** (confirmed from `worker_construction_brief.json`, not the worker's self-report): `stagePressure.proportionalityProfile = { profileClass: "degenerate", maxModules: 1, maxComponents: 1, hopClass: "single_hop", outcomeClass: "framework_smoke" }`. The design-depth register honored it: 1 module / 1 component. The T-187 A-050 carrier works.
- **F_P/F_D boundary respected:** both evaluator prompts forbid F_P from emitting ABG events / writing ledgers / closing edges / selecting traversal (`design_depth prompt:14,90`; review-grade `prompt:4,§subworkstream`). transform.C is told it does not write the result report or ledgers (`worker_prompt.md:34,40,48`).
- **No-recipe boundary respected** (the T-185/T-187 permission-not-prescription line): `design_depth prompt:88,92` — *"How you inspect the authority is your choice; the framework prescribes the carrier schema and the visibility contract, not the extraction method"* / *"There is no framework-authored recipe for deriving register rows."*
- **No stdout dumps; design-depth evaluator used bounded Read** (`limit:80`) and wrote its contracted artifact incrementally (first update → reconciliation). The contracted artifact was admitted, not a draft.

---

## 7. Observations (noted, not defects)

- **Authority order:** `worker_prompt.md:25` calls the *generated* construction brief "the single prompt source carrier," and the prompts' "Read in order" leads with work-category governance + the construction-brief projection; live spec/product/requirements are reached via the brief's `authorityRefs`. This matches the method's admitted-projection compression (the brief is the admitted authority projection, not a rival to live spec), so I read it as intended, not a violation — but it does place a generated read-model first, which is worth one line against the "live authority before generated evidence" check.
- **Design-depth prompt size / repetition:** 253 lines / 40.9 KB. The register schema/field list appears ~4× (shape decl, payload shape, nested-object contract, ~30 self-check lines). I checked for drift between the copies (e.g., `designCompletenessVerdict` field set at `:164` vs `:246`, `concernRole` values at `:166` vs `:231`) — they are **consistent**, so this is a compression opportunity, not a correctness defect, and out of scope for this pass.

---

## 8. Patch readiness & risk — why I did not patch live

Both target files are **uncommitted / in-flight** right now:
```
 M build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
 M build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
```
(modified beyond `e0fe945 checkpoint t188 lite lifecycle proof`, 2026-06-01). Editing files another session is mid-edit on risks clobbering work and muddying the diff. Per my standing constraint (no stepping on in-flight files) and the advisor's caution on patching ABG-foundational source, **I did not modify source.** The §5 fix is specified and ready to apply once those files are quiesced; I recommend whoever owns the in-flight `t188` edits applies it (it sits naturally alongside the `prompt:100-101` conditioning already added there).

The lane-failure (§1) is the higher priority and is its own investigation, not a prompt edit. Its re-entry class is **not yet decided** and must not be presumed: triage the closure `semantic_gap` against the well-formed, grounded design evidence first. If the missing link is a closure/projection binding that drops good evidence → framework re-entry (`design_reframe` on the design→code authority binding). If the design F_P left a residual semantic obligation the code edge legitimately needs → F_P worksite/prompt pressure, **patched inside the worker, not the framework** (governance default). Do not patch the binding before that fork is resolved — patching the wrong layer is the exact failure AGENTS.md §6 exists to prevent.
