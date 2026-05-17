# Strategy: Test35 To Test72 Next Steps

Created: 2026-05-17T02:26:35+10:00  
Author: Codex  
Status: Commentary, not specification  
Scope: Next implementation focus for recovering `test35` behavior in the TypeScript `test72` line.

## Source Inputs

- Codex walkthrough: `/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260516T121044Z_test35_python_success_walkthrough.md`
- Claude priority review: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/claude/20260517T020000Z_STRATEGY_test35_feature_refactor_priority_for_test72_parity.md`
- Master failure reference: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260516T021725Z_MASTER_test35_attempts_failure_reference.md`
- Authority-placement strategy: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md`

This post is the next-step working plan. It is not ratified specification and does not close or replace ticket authority by itself.

## Position

The `test35` behavior to recover is not "more edges" or "more typing" by itself.

The behavior to recover is:

```text
observe workspace/register/event truth
-> select the next graph edge
-> construct F_P work from current pressure
-> admit result into ABG events
-> publish fulfillment ledger
-> preserve residual pressure
-> execute declared build/test command
-> admit execution evidence
-> close only from evidence-backed F_P fulfillment truth
```

The current `test72` run has made real progress: it generated design, code, and test artifacts and reached `prepare_test_execution_surface`. It has not yet reproduced the decisive test35 behavior: actual test execution evidence admitted into the closure spine.

## Decision

Use one consumer-side refactor wave in `odd_sdlc.TS`, not a scatter of unrelated tickets.

The wave should have one target:

> TypeScript `odd_sdlc` closes a data-mapper run only after admitted execution evidence participates in F_P fulfillment closure, with residual pressure preserved across retries.

Everything else below is either required to make that target true or instrumentation to prove it.

## Wave A: Closure Spine

Wave A is the highest-value work. It must land as one coherent batch because the pieces verify each other.

| Order | Work item | Why it belongs in Wave A | Required output |
|---:|---|---|---|
| 1 | Execution evidence admission | `test35` is gold-standard because `sbt test` ran and the result was admitted. `test72` has not proven this yet. | `prepare_test_execution_surface -> derive_test_run_archive_surface -> derive_test_execution_result_surface` or an explicitly equivalent chain that runs the declared command and admits the result. |
| 2 | F_P semantic-convergence obligation | F_P content closure must own the close predicate. Target-carrier admission is evidence admission, not content closure. | Every close-capable content edge has a load-bearing `<target>_semantically_converged` obligation, with expected/fulfilled/missing/evidence refs. |
| 3 | Runtime closure lifecycle coherence | Closed TS edges must not also look like non-progress terminal attempts. | Closed edges emit coherent evaluated/admitted/closure/next-action lifecycle evidence. Non-progress is typed as non-close or post-close diagnostic, not contradictory closure truth. |
| 4 | Residual pressure clearing predicate | Retry pressure must survive until admitted evidence satisfies it; it must not disappear behind projection close. | Residual pressure clears only when the implicated obligation has admitted satisfying evidence. |
| 5 | UAT-before-design pressure | `test35` places UAT pressure before design. TS currently lacks `derive_uat_testcases_surface`. | Add or explicitly consolidate `derive_uat_testcases_surface` before `derive_design_surface`, preserving UAT pressure and artifact evidence. |

Wave A acceptance:

1. A live `test72` or successor run executes the declared test command.
2. The run archives command, exit status, logs, and test counts.
3. `derive_test_execution_result_surface` or its declared equivalent admits that evidence.
4. F_P fulfillment ledger closure cites the execution evidence.
5. A failed test produces retry/repair pressure rather than false close.
6. A passed test can close the execution-result edge without contradictory non-progress state.

## Wave B: Worker Construction Surface

Wave B reduces retry cost and framework-induced drift. It should start immediately after the Wave A closure spine is runnable, because execution failures will otherwise produce large, repetitive prompts.

| Order | Work item | Current problem | Required output |
|---:|---|---|---|
| 1 | Generated construction brief | TS `worker_prompt.md` is a launcher over large sidecars. Attempt `20260516T160450822Z_pid86360` had a 2.5 MB prompt context and 6.6 MB handoff bundle before execution evidence existed. | A compact derived construction brief containing current state, source authority, current gaps, output contract, success predicate, and sidecar index. |
| 2 | Gap dossier alias collapse | The same blockers repeat across canonical and stage-specific aliases, inflating retry prompts. | One canonical blocker per underlying requirement gap, with alias refs attached as metadata. |
| 3 | Construction manifest rollup | Python has one `fp_manifest` per attempt with prompt, authority, obligation policy, and result path. TS splits truth across many files. | A derived per-attempt construction manifest that indexes the typed sidecars and stores the rendered construction brief digest. |

Wave B acceptance:

1. A retry prompt can be read as one coherent construction brief.
2. The brief points to sidecars but does not require the worker to mentally join MBs of JSON before understanding the task.
3. Repeated requirement aliases no longer multiply gap counts.
4. `analyze-run` can report prompt bytes, bundle bytes, gap count, and source-locality score.

## Wave C: Missing Graph Products

Wave C restores or explicitly consolidates graph products that `test35` had as first-class traversals.

| Priority | Test35 surface | Current TS state | Next step |
|---:|---|---|---|
| 1 | `derive_uat_testcases_surface` | Missing. Scenario and test design do not replace UAT-before-design pressure. | Add edge before design or declare a consolidation edge with the same source/target pressure. |
| 2 | `qualify_testcase_authority` | Missing. Testcase authority is not separately admitted before execution. | Add edge after UAT/test design and before execution preparation. |
| 3 | `derive_test_run_archive_surface` | Missing. TS has not yet admitted a test run archive. | Add edge or equivalent execution-archive product after running tests. |
| 4 | `derive_test_execution_result_surface` | Missing in observed TS run. | This is already Wave A keystone; track it here as a graph product too. |
| 5 | `prepare_release_surface` | Not reached. | Add only after execution evidence closure works. |
| 6 | `derive_intent_surface`, `derive_product_surface`, `derive_goal_surface`, `derive_requirement_surface` | Collapsed into bootstrap/conformance authority. | Either restore edges or declare conformance as non-content induction plus F_P authority evaluation per surface. |
| 7 | `select_implementation_stack_profile`, `select_test_stack_profile` | Embedded in package/config truth. | Either restore as replay-visible graph decisions or document as config-resolved policy. |
| 8 | `derive_implementation_module_surface`, `derive_test_module_surface` | Partially replaced by component code/test surfaces. | Declare whether component edges subsume module surfaces; if yes, analyzer must expose that mapping. |

Wave C acceptance:

1. Every consolidated test35 surface has an explicit TS declaration stating where its pressure and evidence now live.
2. Analyzer edge maps show `missing`, `mapped`, `split`, and `consolidated` statuses without manual interpretation.
3. No content-bearing authority is silently created by deterministic conformance.

## Wave D: Analyzer And Forensic Proof

Wave D can run alongside other waves where it is low-risk. It should not block execution-evidence work.

| Work item | Required analyzer output |
|---|---|
| Constructive vs rollup edge classification | `kind: constructive | qualification | rollup | execution | release` per edge. |
| Product artifact lineage | Which edge wrote or admitted each design/source/test/archive/release artifact. |
| Closure predicate summary | Whether close was driven by F_P semantic convergence, target-carrier admission, postflight, execution evidence, or another predicate. |
| Prompt bundle metrics | Rendered prompt bytes, construction brief bytes, sidecar bundle bytes, gap count, alias count. |
| Timing decomposition | Worker time, deterministic setup time, postflight time, ledger/projection time, retry delay. |
| Depth metrics | Files per module, source lines per requirement, test methods per requirement, execution coverage. |

Acceptance:

`odd-sdlc-ts analyze-run` can produce a single markdown and JSON report that explains why a `test72` edge closed, where the artifact came from, what evidence it consumed, and whether it maps to a `test35` edge.

## Immediate Implementation Target

Start at the current live point:

```text
prepare_test_execution_surface
```

Do not wait for a clean release lane. The highest-value next action is to make this edge either:

1. run the declared test command and admit an execution result, or
2. fail in a way that preserves the exact execution-blocking pressure.

That gives the system a real signal. A failing executed test is better than another closed design or rollup surface, because it recreates the test35 pressure loop.

## Do Not Do

- Do not treat target-carrier admission as content closure.
- Do not close execution preparation as test35 parity unless the test command actually ran and was admitted.
- Do not add a second controller loop in `odd_sdlc` to imitate Python.
- Do not move substrate-owned behavior into SDLC product code.
- Do not split this into many speculative tickets before Wave A has an execution-evidence proof.
- Do not chase file-count parity before execution feedback proves missing product behavior.

## Next Concrete Steps

1. Inspect the current `prepare_test_execution_surface` implementation and identify where it decides between retry, repair, execution, and close.
2. Trace how a declared build/test command is represented in `worker_invocation_package.json`, `traversal_intent_package.json`, and postflight outputs.
3. Add or repair the execution-result admission path so a real command run can become edge evidence.
4. Make the close decision require the F_P semantic fulfillment ledger plus admitted execution evidence for the execution-result edge.
5. Add the construction brief projection for the execution-prep retry first, because this is where prompt bloat is currently visible.
6. Add analyzer fields for constructive/rollup classification and execution-evidence status so the next run can be compared without manual archive spelunking.

## Open Questions For Implementation

1. Should `prepare_test_execution_surface` itself run `sbt test`, or should it only prepare an execution surface and route to a distinct `derive_test_execution_result_surface` that runs/admites the command?
2. Should `derive_test_run_archive_surface` be a separate edge, or should it be the evidence carrier emitted by `derive_test_execution_result_surface`?
3. Should early authority surfaces be restored as full F_P edges now, or left consolidated until the execution spine is proven?
4. Which artifact classes should count as `product_materialization_manifest.files` versus design/evidence artifact surfaces?

## Working Rule

The next successful proof is not "test72 reaches close."

The next successful proof is:

```text
test72 runs a declared test command
-> captures execution evidence
-> admits the evidence into a ledger
-> closes only because F_P fulfillment and execution evidence justify close
-> preserves pressure when they do not
```

That is the smallest next step that restores the distinctive test35 behavior.
