# T109 Codex 5.3 Live Run Vector Telemetry And Root Cause

Status: forensic report
Date: 2026-05-08
Run archive: `/var/folders/rz/r6wxvr0n15d906k2s0jw8j2h0000gn/T/odd-sdlc-ts-live-test-runs/t109_live_installed_data_mapper_pty/20260508T034008771Z_pid71976`
Worker: `process://codex?model=gpt-5.3-codex`
Graph function: `bootstrap_release_self_test`
Harness result: failed at `step-12-start-derive_aggregate_domain_model_surface`

This is commentary, not constitutional authority.

## Controlling Evidence

| Surface | Evidence |
| --- | --- |
| Live command | `ODD_SDLC_TS_T109_DATA_MAPPER_LIVE=1 ODD_SDLC_TS_T109_DATA_MAPPER_WORKER='process://codex?model=gpt-5.3-codex' node --test test_env/live/test_t109_live_installed_data_mapper_pty.test.mjs` |
| Harness command timeout | `COMMAND_TIMEOUT_MS` defaults to 20 minutes in `build_tenants/typescript/test_env/live/test_t109_live_installed_data_mapper_pty.test.mjs`. |
| Failed process record | `step-12-start-derive_aggregate_domain_model_surface.process.json` reports `status: null`, `signal: SIGTERM`, `error: ... ETIMEDOUT`, `stdoutBytes: 0`, `stderr: ""`. |
| Runtime archive | `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/` contains operator runs through aggregate attempt `20260508T045200789Z_pid24637`. |
| Last completed closure | Vector 10, `derive_implementation_module_surface`, closed in `20260508T043224526Z_pid78013`. |
| Current blocker when killed | Vector 11, `derive_aggregate_domain_model_surface`, final attempt had no postflight, no assurance result, no worker summary, and no admitted output asset. |

## Vector Traversal Telemetry

| Vector | Edge | Attempt | Run dir | Strategy / scope | Included modules | Worker outcome | Elapsed ms | Stdout bytes | Artifact bytes | Postflight | Assurance / route | Next or blocker |
| ---: | --- | ---: | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |
| induction | `Fg_conform_project` | 0 | `20260508T034010863Z_pid72065` | n/a | n/a | converged | n/a | n/a | n/a | n/a | n/a | first edge `derive_intent_surface` |
| 0 | `derive_intent_surface` | 0 | `20260508T034011484Z_pid72075` | `full_breadth / full_breadth` | all 7 modules | exited `0` | 144708 | 406029 | 33045 | passed | close_allowed | `derive_product_surface` |
| 1 | `derive_product_surface` | 0 | `20260508T034236636Z_pid78909` | `full_breadth / full_breadth` | all 7 modules | exited `0` | 192833 | 441738 | 27063 | passed | close_allowed | `derive_goal_surface` |
| 2 | `derive_goal_surface` | 0 | `20260508T034549904Z_pid87847` | `full_breadth / full_breadth` | all 7 modules | exited `0` | 156043 | 477302 | 21005 | passed | close_allowed | `derive_requirement_surface` |
| 3 | `derive_requirement_surface` | 0 | `20260508T034826384Z_pid95150` | `full_breadth / full_breadth` | all 7 modules | exited `0` | 228336 | 897592 | 28341 | passed | close_allowed | `derive_feature_decomp_surface` |
| 4 | `derive_feature_decomp_surface` | 0 | `20260508T035215166Z_pid6448` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 203513 | 2139899 | 11342 | passed | close_allowed | `derive_uat_testcases_surface` |
| 5 | `derive_uat_testcases_surface` | 0 | `20260508T035539138Z_pid15932` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 387256 | 440347 | 11244 | passed | close_allowed | `derive_design_surface` |
| 6 | `derive_design_surface` | 0 | `20260508T040206848Z_pid33645` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 204567 | 236953 | 10576 | passed | close_allowed | `derive_scenario_surface` |
| 7 | `derive_scenario_surface` | 0 | `20260508T040531872Z_pid43159` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 259079 | 405672 | 11669 | passed | close_allowed | `derive_implementation_design_surface` |
| 8 | `derive_implementation_design_surface` | 0 | `20260508T040951410Z_pid55241` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 201299 | 322167 | 10491 | passed | close_allowed | `select_implementation_stack_profile` |
| 9 | `select_implementation_stack_profile` | 0 | `20260508T041313174Z_pid64550` | `full_breadth / full_breadth` | all 7 modules | exited `0` | 292096 | 523448 | 24503 | passed | close_allowed | `derive_implementation_module_surface` |
| 10 | `derive_implementation_module_surface` | 0 | `20260508T041805679Z_pid78013` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 258665 | 228363 | 21686 | passed | retry_same_edge | `design_entity_missing_for_module:cdme-compiler` |
| 10 | `derive_implementation_module_surface` | 1 | `20260508T042224370Z_pid78013` | `steel_thread / steel_thread` | `cdme-compiler` | worker timed out | 600140 | 373614 | 37546 | not reached | not reached | worker produced likely useful artifact but did not exit before process timeout |
| 10 | `derive_implementation_module_surface` | 2 | `20260508T043224526Z_pid78013` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 139054 | 462588 | 38600 | passed | close_allowed | `derive_aggregate_domain_model_surface` |
| 11 | `derive_aggregate_domain_model_surface` | 0 | `20260508T043444086Z_pid24637` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 345102 | 946012 | 23558 | passed | retry_same_edge | `design_aggregate_entity_missing_for_scope_module:cdme-compiler` |
| 11 | `derive_aggregate_domain_model_surface` | 1 | `20260508T044029219Z_pid24637` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 352112 | 1808567 | 30821 | passed | retry_same_edge | missing attributes on 5 entities and missing required attributes on 7 operations |
| 11 | `derive_aggregate_domain_model_surface` | 2 | `20260508T044621372Z_pid24637` | `steel_thread / steel_thread` | `cdme-compiler` | exited `0` | 339303 | 616633 | 39405 | passed | retry_same_edge | `design_depth_register_invalid:...invariantRefs: expected array` |
| 11 | `derive_aggregate_domain_model_surface` | 3 | `20260508T045200789Z_pid24637` | `steel_thread / steel_thread` | `cdme-compiler` | interrupted by parent command timeout | about 150038 observed before kill | 1672612 observed | none admitted | not reached | not reached | outer harness killed `odd-sdlc-ts` before result projection |

Notes:

- `all 7 modules` means `cdme-compiler`, `cdme-assurance`, `cdme-executor`, `cdme-adjoint`, `cdme-accounting`, `cdme-fidelity`, and `cdme-engine`.
- The final aggregate handoff carried `retryBudgetRemaining: 0`, `mustExitAfterBoundedAttempt: false`, and `selectedScheduleItemRefs: ["schedule://odd_sdlc/derive_aggregate_domain_model_surface/cdme-compiler"]`.
- The last failed test surface is the harness process record, not an admitted odd_sdlc postflight result.

## Recovery Progression

| Edge | Attempt sequence | What improved | What remained |
| --- | --- | --- | --- |
| `derive_implementation_module_surface` | missing module entity -> worker timeout -> close_allowed | The same-edge loop eventually produced a module surface accepted by postflight and assurance. | The intermediate worker timeout still consumed a full 600s worker timeout and did not itself become a useful typed framework result. |
| `derive_aggregate_domain_model_surface` | missing aggregate entity -> missing attributes / required attributes -> malformed field type -> external kill | The loop narrowed the aggregate-domain design-depth failures each pass. This is evidence of local repair pressure working. | The repair was too serial and expensive. Each attempt exposed the next strict carrier defect instead of receiving one compact complete accepted-shape checklist and converging quickly. |

## Root Cause

Immediate cause:

The live test harness killed the enclosing `odd-sdlc-ts start` process after the `step-12-start-derive_aggregate_domain_model_surface` invocation exceeded the harness `COMMAND_TIMEOUT_MS` default of 20 minutes. The process record shows `signal: SIGTERM` and `ETIMEDOUT`; it does not show a worker-side quota error or a Scala/product compilation failure.

Why it reached that timeout:

| Cause | Evidence | Impact |
| --- | --- | --- |
| Multiple heavy repair attempts occurred inside one `start --until first_traversal` command. | Aggregate attempts consumed about 345s, 352s, 339s, then about 150s before the parent kill, plus framework overhead. | The single harness command exceeded 20 minutes even though individual inner attempts were making progress. |
| The aggregate repair loop was too incremental. | Assurance moved from missing aggregate module identity, to missing entity/operation attributes, to an exact schema field error on `invariantRefs`. | The framework spent full model calls discovering one layer of strict carrier failure at a time. |
| Retry budget did not stop the final worker launch. | Final handoff carried `retryBudgetRemaining: 0` and `mustExitAfterBoundedAttempt: false`. | The runner launched another expensive Codex attempt instead of returning a typed `retry_budget_exhausted` or bounded-blocked projection. |
| Parent process termination was not admitted as framework truth. | Final attempt has worker events but no `worker_process_summary.json`, no `postflight.json`, no `assurance_satisfaction.json`, no `gap_dossier.json`, and no output asset. | There was no admitted event or projection for the framework to self-heal from after the harness killed the process. |

## Why The Framework Did Not Recover

The framework did recover from normal typed gaps. It recovered vector 10 after `design_entity_missing_for_module:cdme-compiler`, and it repeatedly re-entered vector 11 on typed `same_edge_retry` assurance findings.

It did not recover from the final failure because the failure happened outside the runtime projection boundary:

1. The live harness owns the outer `spawnSync` call.
2. That harness timeout sent `SIGTERM` to `odd-sdlc-ts`.
3. The killed `odd-sdlc-ts` process did not finish the worker, run postflight, fold assurance, or emit a typed blocked projection.
4. The test then failed on `assert.equal(run.status, 0, ...)` using the harness process record.

So the self-healing loop was interrupted by an external command timeout before the framework could convert the condition into an event, ledger row, evaluator decision, or lawful re-entry carrier.

## Functional Defect

The defect is not simply "increase the timeout." Increasing the timeout would hide the boundary failure.

The functional defect is:

| Defect | Required behavior |
| --- | --- |
| Runtime progress is bounded by the live harness rather than by an admitted construction/evaluator disposition. | The installed runtime should return a typed blocked result before the parent process kills it. |
| Retry budget exhaustion is visible in handoff but not enforced before launching another worker. | If retry budget is exhausted, the next action should be a typed blocked/evaluator disposition, not another model call. |
| External process timeout is not admitted as runtime truth. | Worker or command termination should become a typed runtime event/projection with evidence refs. |
| Aggregate carrier repair is prompt-driven and too serial. | The repair prompt should carry exact accepted carrier shape, all current parser field errors, and a compact field-level checklist so one worker call can repair the full local schema frontier. |

## Corrective Work

| Priority | Fix | Test proof |
| ---: | --- | --- |
| 1 | Enforce retry budget before worker dispatch. When `retryBudgetRemaining <= 0`, emit a typed blocked result and exit cleanly without starting another worker. | Deterministic test: a handoff with exhausted retry budget must not call the worker and must project a bounded blocker. |
| 2 | Admit parent/worker timeout as framework truth. Convert timeout/SIGTERM into a typed runtime event and projection instead of relying on harness assertion failure. | Live-harness or deterministic process test: timed-out worker produces an admitted blocker with process evidence refs. |
| 3 | Add wall-clock budget awareness to `start --until first_traversal`. | Test: `start` returns typed blocked/constrained result before the parent harness timeout elapses. |
| 4 | Collapse aggregate repair frontier into one exact local schema checklist. | Test: aggregate-domain repair prompt includes all parser errors, accepted carrier schema/field-set, and no broad regeneration instruction. |
| 5 | Keep same-edge repair evidence but reduce prompt bulk. | Regression: retry prompts reference compact packages and current gap frontier without dumping full historical manifests unless specifically requested. |

## Closure Reading

The recorded run proves the graph can advance through vectors 0-10 and that same-edge repair can recover a typed module-surface failure. It does not prove RC closure. The current live blocker is vector 11 aggregate-domain repair plus the runner/harness boundary defect that lets an external timeout end the process before odd_sdlc projects a typed blocked/recovery state.

