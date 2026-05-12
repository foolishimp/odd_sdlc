# T-132 Live Performance, Bloat, And Telemetry Post

Status: commentary. This is not specification, design law, or ticket closure.

Runs reviewed:

- `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T034912177Z_pid64074`
- `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T044815391Z_pid44464`
- `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T050346719Z_pid65805`

The purpose of this post is to separate fixed SDLC startup cost, live F_P
prompt execution cost, deterministic system cost, bloat slope, and bug overhead.
The run data is from preserved sandbox archives. Byte volumes below use
recursive file-byte sums unless noted.

## Executive Finding

The clean T-132 run is not failing from retries anymore. It is expensive because
one line of product source still traverses twelve live worker edges:

1. conform authority
2. feature decomposition
3. design
4. scenario
5. implementation design
6. stack profile
7. module surface
8. aggregate domain model
9. component topology
10. sunny-day sequence
11. component realization schedule
12. component code

That is a fixed methodology-depth cost, not product LOC cost. On the clean run,
`1188.2s` of `1197.1s` was worker/F_P elapsed time. Coarse archive timing shows
only about `8.9s` outside worker execution after the first operator directory is
created, but the current archives do not first-class instrument install, setup,
build, package-write, postflight, consequence-write, or dispatch phases. The
next fix is telemetry, not guessing.

The earlier dirty run had a different cost class: bug overhead. It took about
`1672.1s` and had four suspicious same-edge repeats: one blocked aggregate
domain attempt, one topology repair, and two blocked component-code attempts.
The clean run removed those repeats and dropped wall time to about `1197.1s`.

## Definitions

| Cost | Current proxy | Limitation |
| --- | --- | --- |
| Fixed startup | Run archive timestamp to first operator-run directory. Clean run: about `5.2s`. | Does not include outer `npm` startup, installed package setup, sandbox creation, or build/install work before archive creation. |
| Prompt/F_P execution | Per-edge `worker_run.json.elapsedMs`. | Captures worker process elapsed, not token count or model-side queue/latency detail. |
| System/postflight cost | Next operator-run directory timestamp minus current worker elapsed. | Coarse. Needs explicit phase timers for post-transform, postflight, assurance, consequence write, dispatch, and idle/wait. |
| Prompt volume | `worker_prompt.md`, `worker_invocation_package.json`, `handoff_manifest.json`, `traversal_intent_package.json`. | Byte proxy only. No tokenizer, no exact model input tokens, and attachment/file-read behavior is not separated. |
| Bloat | Archive bytes, runtime/event bytes, handoff bytes, stdout bytes, lineage counts. | Needs normalized ratios per requirement, edge, component, product file, and retry. |
| Bug overhead | Same-edge repeats, blocked/repair dispositions, wasted worker seconds before block. | Current summaries require archive scraping; should be emitted as a first-class performance summary. |

## Run Comparison

| Run | Shape | Attempts | Same-edge repeats | Product source | Wall time | Worker time | Archive bytes | Operator-run bytes | Main overhead driver |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| `034912` | Buggy recovery run | 16 | 4 | yes | `1672.1s` | `1662.8s` | `182.1 MiB` | `125.3 MiB` | Bug overhead: outside-workspace reads, invalid enum, missing source lineage, retry path leak. |
| `044815` | Aborted bloat observation | 9 | 0 before stop | no | not closed | `704.9s` | `71.4 MiB` | `38.1 MiB` | Killed around component topology while investigating module/topology bloat. |
| `050346` | Fresh clean closure | 12 | 0 | yes | `1197.1s` | `1188.2s` | `105.8 MiB` | `61.0 MiB` | Fixed graph-depth cost: twelve live F_P calls. |

The clean run produced:

```js
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_001
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_002
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_003
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_004
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_005
console.log("Hello, world!");
```

Every clean-run edge carried exactly five requirement obligations. That is not
evidence of requirement-id explosion in the final product file. The expensive
part is breadth of traversal and live execution per admitted surface.

## Clean Run Edge Timing

Run: `20260512T050346719Z_pid65805`

All rows closed with `fp_evaluate_result.status: passed`,
`postflightStatus: passed`, and closure disposition `close`.

| # | Edge | Req | Edge window | Worker/F_P | System approx | Prompt KiB | Invocation KiB | Handoff KiB | Traversal KiB | Stdout KiB | Event KiB | Tool calls |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | `Fg_conform_project_authority` | 5 | `120.9s` | `120.6s` | `0.3s` | `3.0` | `19.0` | `69.0` | `7.3` | `197.9` | `1108.4` | 20 |
| 2 | `derive_feature_decomp_surface` | 5 | `56.9s` | `56.6s` | `0.3s` | `2.1` | `19.5` | `106.5` | `7.6` | `119.9` | `1242.0` | 9 |
| 3 | `derive_design_surface` | 5 | `63.7s` | `63.4s` | `0.3s` | `2.2` | `19.8` | `111.8` | `7.7` | `147.9` | `1542.1` | 10 |
| 4 | `derive_scenario_surface` | 5 | `94.5s` | `94.2s` | `0.3s` | `2.0` | `20.0` | `113.0` | `8.0` | `165.0` | `1388.0` | 8 |
| 5 | `derive_implementation_design_surface` | 5 | `90.8s` | `90.4s` | `0.4s` | `2.3` | `20.7` | `116.5` | `8.4` | `213.5` | `1670.7` | 10 |
| 6 | `select_implementation_stack_profile` | 5 | `110.8s` | `110.5s` | `0.3s` | `2.1` | `20.8` | `114.5` | `8.6` | `194.1` | `1424.9` | 9 |
| 7 | `derive_implementation_module_surface` | 5 | `104.4s` | `104.0s` | `0.3s` | `4.9` | `23.9` | `122.1` | `8.9` | `222.4` | `1596.4` | 9 |
| 8 | `derive_aggregate_domain_model_surface` | 5 | `91.3s` | `90.9s` | `0.3s` | `4.1` | `23.1` | `118.2` | `9.1` | `194.3` | `1298.8` | 7 |
| 9 | `derive_implementation_component_topology_surface` | 5 | `103.6s` | `103.3s` | `0.3s` | `2.7` | `22.1` | `138.6` | `9.6` | `215.5` | `1902.8` | 8 |
| 10 | `derive_aggregate_sunny_day_sequence_surface` | 5 | `101.6s` | `101.3s` | `0.3s` | `3.2` | `22.6` | `134.6` | `9.7` | `284.8` | `1811.6` | 9 |
| 11 | `derive_component_realization_schedule_surface` | 5 | `136.7s` | `136.3s` | `0.4s` | `2.6` | `22.2` | `148.3` | `10.1` | `415.9` | `2580.4` | 11 |
| 12 | `derive_component_code_surface` | 5 | `116.7s` | `116.6s` | `0.1s` | `4.3` | `26.0` | `140.9` | `10.3` | `338.9` | `2073.2` | 10 |

Clean-run volume totals across operator edges:

| Carrier | Total |
| --- | ---: |
| `worker_prompt.md` | `35.5 KiB` |
| `worker_invocation_package.json` | `259.7 KiB` |
| `handoff_manifest.json` | `1434.0 KiB` |
| `traversal_intent_package.json` | `105.3 KiB` |
| `worker_stdout.log` | `2710.1 KiB` |
| `runtime_events.json` + `worker_process_events.jsonl` | `19639.3 KiB` |
| postflight/result/materialization outputs | `356.4 KiB` |
| worker process event rows | `770` |

The literal prompt markdown is small. The meaningful context carriers are the
invocation package, handoff manifest, traversal package, and the accumulated
event/runtime snapshots. Prompt bloat should therefore be measured as a bundle,
not only as `worker_prompt.md`.

## Cross-Run Edge Comparison

Format: `attempts / worker seconds / non-close attempts`.

| Edge | `034912` | `044815` | `050346` |
| --- | ---: | ---: | ---: |
| `Fg_conform_project_authority` | `1x / 124.9s / 0` | `1x / 120.9s / 0` | `1x / 120.6s / 0` |
| `derive_feature_decomp_surface` | `1x / 42.1s / 0` | `1x / 56.6s / 0` | `1x / 56.6s / 0` |
| `derive_design_surface` | `1x / 53.8s / 0` | `1x / 54.4s / 0` | `1x / 63.4s / 0` |
| `derive_scenario_surface` | `1x / 57.6s / 0` | `1x / 61.3s / 0` | `1x / 94.2s / 0` |
| `derive_implementation_design_surface` | `1x / 73.6s / 0` | `1x / 69.2s / 0` | `1x / 90.4s / 0` |
| `select_implementation_stack_profile` | `1x / 80.7s / 0` | `1x / 78.7s / 0` | `1x / 110.5s / 0` |
| `derive_implementation_module_surface` | `1x / 136.8s / 0` | `1x / 119.8s / 0` | `1x / 104.0s / 0` |
| `derive_aggregate_domain_model_surface` | `2x / 341.7s / 1` | `1x / 144.1s / 0` | `1x / 90.9s / 0` |
| `derive_implementation_component_topology_surface` | `2x / 155.4s / 1` | started, killed | `1x / 103.3s / 0` |
| `derive_aggregate_sunny_day_sequence_surface` | `1x / 118.0s / 0` | not reached | `1x / 101.3s / 0` |
| `derive_component_realization_schedule_surface` | `1x / 127.7s / 0` | not reached | `1x / 136.3s / 0` |
| `derive_component_code_surface` | `3x / 350.6s / 2` | not reached | `1x / 116.6s / 0` |

The bug overhead in `034912` is visible:

- `derive_aggregate_domain_model_surface`: one blocked outside-workspace read,
  then retry.
- `derive_implementation_component_topology_surface`: one repair due invalid
  `concernRole`, then retry.
- `derive_component_code_surface`: missing product-file lineage, then
  outside-workspace read on retry, then final close.

Those repeats account for most of the difference between the dirty run and the
clean run.

## Bloat Assessment

### What is not exploding

For T-132, requirement fanout is not currently exploding:

- every clean edge has `req = 5`
- final `hello.js` has exactly five canonical requirement tags
- no raw display-id tags appear in the product source
- same-edge retry count is zero in the clean run

This suggests the T-159 lineage fix is not flattening every upstream dependency
into the product source. Product files now carry the immediate canonical
requirement obligations needed for traceability.

### What is growing

Handoff and runtime/event data grow as surfaces accumulate:

- handoff manifest grows from `69.0 KiB` at authority conformance to a high of
  `148.3 KiB` at component schedule
- traversal intent grows from `7.3 KiB` to `10.3 KiB`
- event/runtime snapshot material totals `19.6 MiB` across clean-run edges
- stdout totals `2.7 MiB`, larger than all literal prompt markdown

That looks roughly linear across the clean T-132 run. It is still too much for a
hello-world proof lane, but the preserved data does not show exponential
requirement growth in this clean case.

The structural risk is repeated cumulative snapshots. ABG owns reliable event
preservation through events, ledgers, and the event graph. `odd_sdlc` should not
become a second event-log store by copying full cumulative event state into
every operator-run archive. It should carry event refs, digests, deltas, and
phase summaries.

### Product proportionality

For a one-line product, the cost is dominated by fixed graph depth:

- twelve live F_P calls
- each call between `56.6s` and `136.3s`
- total clean live time about `19m 57s`

That fixed cost may be acceptable for a heavy SDLC lane, but it should be made
explicit. If common product shapes always require the same twelve live prompts,
then hello-world is measuring the floor. If data_mapper adds many more
requirements and components, the cost should grow with admitted feature/module
count, not with duplicated transitive references or repeated full context
snapshots.

## Bug Overhead Rules

Every retry is suspicious. A retry should emit a forensic record with:

- edge name
- attempt ordinal
- predecessor attempt ref
- blocking or repair reason code
- worker seconds wasted before block
- prompt package digest
- handoff digest
- product/materialization delta summary
- whether the retry cause is prompt gap, worker policy violation, deterministic
  evaluator bug, harness bug, runtime bug, or tenant-source defect

For T-132, the clean run has no retry overhead. The earlier run proves why this
matters: three blocked attempts plus one repair added several minutes and
created misleading closure pressure even though the final product was tiny.

## Telemetry Requirements

These should be added as first-class runtime artifacts, not reconstructed by
scraping archives.

### Run Summary

Add `run_performance_summary.json` at the scenario/root run archive:

- `runRef`
- `scenarioRef`
- `executorProfile`
- `sourceInstallStartAt`
- `sourceInstallEndAt`
- `sandboxCreateStartAt`
- `sandboxCreateEndAt`
- `installedProductProbeStartAt`
- `installedProductProbeEndAt`
- `firstOperatorRunStartAt`
- `lastOperatorRunEndAt`
- `totalWallMs`
- `startupWallMs`
- `operatorWallMs`
- `workerWallMs`
- `deterministicWallMs`
- `idleOrUnattributedWallMs`
- `sameEdgeRetryCount`
- `blockedAttemptCount`
- `repairAttemptCount`
- `yieldAttemptCount`
- `finalClosureDisposition`
- `productFileCount`
- `requirementObligationCount`
- `archiveFileBytes`
- `operatorRunFileBytes`
- `eventFileBytes`
- `stdoutBytes`

### Edge Summary

Add `edge_performance_summary.json` per operator run:

- `edgeName`
- `graphFunctionRef`
- `graphVectorRef`
- `attemptOrdinal`
- `sameEdgeAttemptOrdinal`
- `phaseStartedAt`
- `preflightStartedAt`
- `preflightEndedAt`
- `packageWriteStartedAt`
- `packageWriteEndedAt`
- `workerStartedAt`
- `workerEndedAt`
- `reportAdmissionStartedAt`
- `reportAdmissionEndedAt`
- `postTransformStartedAt`
- `postTransformEndedAt`
- `postflightStartedAt`
- `postflightEndedAt`
- `assuranceStartedAt`
- `assuranceEndedAt`
- `consequenceWriteStartedAt`
- `consequenceWriteEndedAt`
- `dispatchStartedAt`
- `dispatchEndedAt`
- `edgeEndedAt`
- `workerMs`
- `deterministicMs`
- `postflightMs`
- `assuranceMs`
- `consequenceWriteMs`
- `dispatchMs`
- `idleOrUnattributedMs`

### Prompt And Context Volume

Add a prompt/context section to each edge summary:

- `workerPromptBytes`
- `workerInvocationPackageBytes`
- `handoffManifestBytes`
- `traversalIntentPackageBytes`
- `inlineRequirementCount`
- `requirementTraceObligationCount`
- `sourceAuthorityRefCount`
- `retrievalHintCount`
- `priorGapDossierCount`
- `repairInstructionCount`
- `productTargetCount`
- `allowedWriteRootCount`
- `workerStdoutBytes`
- `workerStderrBytes`
- `workerProcessEventsBytes`
- `runtimeEventsBytes`
- `runCompactBytes`
- `estimatedInputTokens` when the executor can expose it
- `estimatedOutputTokens` when the executor can expose it
- `toolCallCount`
- `maxNoOutputGapMs`
- `apiRetryCount`
- `rateLimitEventCount`

### Bloat Slope Metrics

Compute per run and per edge:

- bytes per requirement obligation
- bytes per source authority ref
- bytes per product file
- bytes per component
- bytes per tool call
- bytes per retry
- lineage refs per product file
- source authority refs per edge
- handoff bytes by edge index
- event snapshot bytes by edge index
- stdout bytes by edge index
- duplicate requirement authority count
- raw display-id requirement count
- canonical requirement id count
- lineage fanout ratio: `lineageRefsOnProductFiles / currentRequirementObligations`
- transitive dependency fanout ratio when a surface intentionally flattens
  upstream references

Flag as suspicious:

- requirement obligation count changes when no requirement ingress edge ran
- handoff bytes more than double while requirement count and product target count
  are stable
- lineage fanout ratio grows across product-materialization edges without a new
  requirement obligation
- same-edge retry count is nonzero
- event snapshot bytes grow superlinearly with edge index
- product source carries transitive design/module refs as requirement tags

### Retry Forensic Trigger

On every `retry` or `repair` disposition, write
`retry_forensic_summary.json`:

- `attemptRef`
- `previousAttemptRef`
- `edgeName`
- `workerMsBeforeBlock`
- `blockingReasons`
- `repairReasons`
- `changedFiles`
- `productFilesObserved`
- `productFilesMaterialized`
- `lineageStatus`
- `outsideWorkspaceReadCount`
- `schemaViolationCount`
- `promptDefectClass`
- `deterministicDefectClass`
- `runtimeDefectClass`
- `harnessDefectClass`
- `recommendedLawfulReentryPoint`

This makes "every retry is suspicious" operational instead of relying on a
human to notice elapsed time.

## Performance Requirements To Derive

1. A live scenario must emit a machine-readable performance summary with phase
   timers. Closure evidence without phase timers is insufficient for
   performance triage.
2. Prompt volume must be reported as a bundle: prompt text, invocation package,
   handoff manifest, traversal package, and referenced inline context.
3. Product-file lineage must be counted separately from planning/design
   traceability tables. Product files should carry current canonical requirement
   obligations, not a flattened copy of every upstream design dependency.
4. Same-edge retry count must be a first-class failure/attention metric even
   when the final product closes.
5. Runtime/event archive volume must be measured as refs/deltas/snapshots, with
   a bias toward refs and digests over repeated full cumulative snapshots.
6. Hello-world baseline should assert:
   - five canonical requirement obligations
   - zero duplicate requirement authorities
   - zero same-edge retries
   - source file carries exactly the five canonical requirement tags
   - no raw display-id requirement tags
   - handoff and event bytes stay below governed thresholds
7. Data_mapper baseline should compare slopes, not absolute times:
   - per requirement
   - per component
   - per product file
   - per edge
   - per retry

## Immediate Interpretation

The clean run is a real improvement: the product materializes correctly, lineage
is present, and retry overhead is gone for T-132.

The remaining performance issue is structural visibility. The system currently
lets us infer that F_P worker time dominates, but it does not explicitly tell us
where setup, package writing, postflight, consequence admission, dispatch, and
archive writes spend time. That makes every performance conversation too
forensic.

The likely requirement is a governed performance/volume ledger for live lanes,
starting with T-132 and then data_mapper. It should not gate correctness by
default, but it should make proportionality failures and bloat regressions
visible immediately.
