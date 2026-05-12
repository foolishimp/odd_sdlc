# T-132 JavaScript Hello World Live Run Forensic

Run under review:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T034912177Z_pid64074`

Conclusion: the product file was produced and the final code edge closed, but the
run is not clean evidence. It required three blocked attempts and one repair
attempt before final source closure, then the outer scenario assertion failed
because the harness could not read its own handoff archive sequence.

Direct product proof:

- `workspace/build_tenants/hello_world_javascript/src/hello.js` exists.
- Direct execution from the sandbox workspace prints `Hello, world!`.
- The file carries five canonical requirement tags and zero raw
  `requirement:REQ-T132-*` tags.
- Final `component_code_surface` attempt:
  `operator-runs/20260512T041518033Z_pid64074/fp_evaluate_result.json`
  has `status: passed`, `postflightStatus: passed`, and no blocking reasons.

## Timing Breakdown

The Node test reported `1672062.597ms` for the live scenario, about 27m 52s.
Summed worker process elapsed time across edge attempts is about 27m 43s. The
operator edge starts span 26m 01s from first worker edge to final worker edge.

| Attempt | Edge | Status | Time | Archive data | Notes |
| --- | --- | --- | ---: | ---: | --- |
| 20260512T034917455Z | `Fg_conform_project_authority` | passed | 124.9s | 5.4 MiB | First live authority materialization; five canonical req ids. |
| 20260512T035122684Z | `derive_feature_decomp_surface` | passed | 42.1s | 4.8 MiB | No retry. |
| 20260512T035205031Z | `derive_design_surface` | passed | 53.8s | 5.9 MiB | No retry. |
| 20260512T035259118Z | `derive_scenario_surface` | passed | 57.6s | 5.7 MiB | No retry. |
| 20260512T035356991Z | `derive_implementation_design_surface` | passed | 73.6s | 5.9 MiB | No retry. |
| 20260512T035510914Z | `select_implementation_stack_profile` | passed | 80.7s | 6.1 MiB | No retry. |
| 20260512T035631908Z | `derive_implementation_module_surface` | passed | 136.8s | 7.4 MiB | No retry; large design surface. |
| 20260512T035848989Z | `derive_aggregate_domain_model_surface` | blocked | 101.1s | 5.0 MiB | Worker read `code/src/assurance` outside sandbox. |
| 20260512T040030102Z | `derive_aggregate_domain_model_surface` | passed | 240.6s | 11.0 MiB | Retry recovered; longest edge. |
| 20260512T040431106Z | `derive_implementation_component_topology_surface` | passed/repair | 103.1s | 6.5 MiB | `fp_evaluate` passed but closure disposition was `repair`; invalid `concernRole` caused same-edge repair. |
| 20260512T040614290Z | `derive_implementation_component_topology_surface` | passed | 52.2s | 11.3 MiB | Retry repaired enum value. |
| 20260512T040706892Z | `derive_aggregate_sunny_day_sequence_surface` | passed | 118.0s | 8.6 MiB | No retry. |
| 20260512T040905268Z | `derive_component_realization_schedule_surface` | passed | 127.7s | 8.4 MiB | No retry. |
| 20260512T041113334Z | `derive_component_code_surface` | blocked | 94.7s | 5.6 MiB | `hello.js` existed but lacked product-file requirement lineage tags. |
| 20260512T041248133Z | `derive_component_code_surface` | blocked | 149.8s | 10.1 MiB | File lineage was fixed, but worker searched old `test_runs` and `code/src`. |
| 20260512T041518033Z | `derive_component_code_surface` | passed | 106.1s | 17.4 MiB | Final close; file replayed with canonical lineage. |

## Volume Breakdown

- Full run archive: 198 MiB.
- Workspace archive: 186 MiB.
- `operator-runs`: 135 MiB.
- Operator-run file count: 555 files.
- Combined `worker_stdout.log`: 3.71 MiB.
- Combined `runtime_events.json`: 42.1 MiB.
- Combined `traversal_intent_package.json`: 181 KiB.
- Largest files are cumulative `runtime_events.json` snapshots:
  final source-close attempt is 11.4 MiB; topology retry is 5.7 MiB;
  aggregate-domain retry is 5.0 MiB.

The immediate bloat is not product-file requirement flattening. Product-file
lineage is now five canonical ids. The largest avoidable volume is repeated
runtime/event snapshots per operator run. That is suspicious because ABG owns
the event log and event graph; `odd_sdlc` should prefer event refs, digests, or
delta projections over repeatedly copying full cumulative event state into each
operator-run archive.

## Retry Forensics

### 1. Aggregate Domain Model Retry

Failure:
`worker_authority_read_outside_workspace`.

Evidence:
`operator-runs/20260512T035848989Z_pid64074/fp_evaluate_result.json` cites
reads under `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/assurance`.

Root cause:
the worker tried to infer the design-completeness schema from framework source
instead of treating the invocation package as the closed schema carrier. The
read-boundary axiom existed, so postflight correctly blocked it, but the prompt
did not explicitly say "do not inspect framework source for schemas."

Fix applied:
`operator/handoff.ts` now adds a transform axiom: do not inspect `odd_sdlc`
framework source or installed runtime source to infer schemas; the invocation
package is the closed schema authority.

### 2. Component Topology Repair

Failure shape:
the first topology attempt wrote an invalid role
`entry_script_stdout_emitter`. The admitted vocabulary only allows
`parser`, `validator`, `mapper`, `error_model`, `io_adapter`, `reporting`,
`domain_model`, or `other`.

Root cause:
prompt under-specification. The directive asked for `concernRole` but did not
publish the enum. The worker invented a semantically reasonable but illegal
role.

Fix applied:
`compactComponentDepthDirective` now publishes the exact enum and tells entry
scripts to use `io_adapter`.

Open concern:
this attempt had `fp_evaluate_result.status: passed` while
`sdlc_edge_closure_decision.disposition: repair`. That status split is too easy
to misread. It should remain under suspicion in T-158/T-159 review: report
admission passing is not the same as closure.

### 3. Component Code First Attempt

Failure:
`materialized_product_requirement_lineage_missing`.

Evidence:
`operator-runs/20260512T041113334Z_pid64074/postflight.json`.
The first `hello.js` was only:
`console.log("Hello, world!")`

Root cause:
the deterministic evaluator was correct, but first-pass prompt pressure was not
concrete enough. It said product files must carry parseable requirement tags but
did not give native source comment syntax or "one exact id per line."

Fix applied:
product materialization directives now tell workers to put exact requirement
ids at the top of source files with valid native comment syntax, e.g.
`// requirement:<canonical-id>`, and not rely on report-only lineage.

### 4. Component Code Second Attempt

Failure:
`worker_authority_read_outside_workspace`.

Evidence:
`operator-runs/20260512T041248133Z_pid64074/fp_evaluate_result.json` cites:

- a search under `.../test_env/test_runs`
- a grep under `.../code/src`

Root cause:
the retry fixed the product file, then self-debugged the evaluator by reading
historical sandboxes and framework source. The retry prompt also exposed raw
absolute outside-workspace paths in the prior diagnostic, which made the
forbidden targets visible.

Fix applied:
worker-facing retry defect text and retry instruction details now redact
outside-workspace paths while preserving durable raw diagnostics in the archive.
Regression: `T-120 retry prompts redact outside-workspace diagnostic paths`.

### 5. Outer Scenario Harness Failure

Failure:
the outer Node test failed after final source closure:
`strict handoff edge sequence too short ... saw`.

Root cause:
`observedHandoffEdgeSequence()` used `statSync` without importing it. The
catch block swallowed the `ReferenceError`, so every operator-run directory was
filtered out and the sequence was always empty.

Second harness issue:
the live descriptor expected a strict no-retry prefix. That is wrong for a
repair-capable graph. Same-edge retries should be compressed when validating
graph progression.

Fix applied:

- `scenario_sandbox.mjs` imports `statSync`.
- sequence assertion compresses consecutive same-edge retries.
- regression: `scenario sandbox: handoff sequence assertion tolerates
  same-edge retries`.

## Requirement Flattening Assessment

This run does not show product-file requirement explosion after the current
T-159 changes. Every worker invocation package carried exactly five canonical
stage requirement ids. The final `hello.js` carries the same five canonical ids
and no raw requirement display-id tags.

Some flattening remains legitimate on planning/design surfaces: feature,
design, module, and component surfaces can map the current requirement set into
an admitted trace table because their job is to tie design features back to
requirements. Product files are narrower: they should carry the canonical
immediate requirement claims for the file, not copied transitive graph pressure.

## Bugs Fixed In This Pass

- Product-file lineage prompt now gives concrete native source comment syntax.
- Component topology prompt now publishes the `concernRole` enum.
- Worker retry prompts now redact outside-workspace diagnostic paths.
- Worker transform axioms now forbid framework-source schema inference.
- Scenario harness now imports `statSync`.
- Scenario handoff sequence assertion now tolerates same-edge retries.

Verification:

- `npm run build:semantic`
- `node --test test_env/tests/test_t118_worker_invocation_package.test.mjs`
- `node --test test_env/tests/test_t120_retry_local_repair_prompt.test.mjs`
- `node --test test_env/sandbox/test_scenario_sandbox.test.mjs --test-name-pattern 'handoff sequence assertion|hello-world live descriptors'`
- Direct run from live sandbox workspace:
  `node build_tenants/hello_world_javascript/src/hello.js` -> `Hello, world!`

## Remaining Review Items

1. Review `fp_evaluate_result.status` versus closure disposition. A `passed`
   evaluator result with `disposition: repair` is not a stable operator-facing
   truth surface.
2. Review `stopAfterWorkspaceFilesExist`. Live closure should not be allowed to
   stop merely because a file exists; it must stop on admitted postflight and
   closure state.
3. Reduce archive volume by replacing repeated full `runtime_events.json`
   snapshots with event-log refs/digests/deltas. ABG owns event preservation;
   `odd_sdlc` should not become a second event-log store by copying cumulative
   event state per edge.
4. Rerun a fresh T-132 live lane after these fixes. This run proves recovery and
   final product correctness, but it is not clean closure evidence for the
   fixed prompt/harness behavior because it was launched before several fixes.

## Fresh Closure Run After Fixes

Fresh run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T050346719Z_pid65805`

Result: pass.

Node test duration:
`1197087.015334ms`, about 19m 57s.

Closure evidence:

- Every observed edge carried exactly 5 canonical requirement obligations.
- No same-edge retry occurred.
- Every edge wrote `fp_evaluate_result.status: passed`,
  `postflightStatus: passed`, and `sdlc_edge_closure_decision.disposition:
  close`.
- Final product file:
  `workspace/build_tenants/hello_world_javascript/src/hello.js`.
- Direct execution from the live workspace prints `Hello, world!`.
- Product materialization manifest row for `src/hello.js` carries
  `materializationSource: current_attempt`, role `source`,
  `rolePolicyRef: target-role-policy://odd-sdlc/product-source-tree`, and 5
  `requirementTraceObligationIds`.
- The file content itself carries the same five canonical requirement tags:

```javascript
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_001
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_002
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_003
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_004
// requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_005
console.log("Hello, world!");
```

Approximate edge timings from operator-run start to next operator-run start:

| Edge | Approx time |
| --- | ---: |
| `Fg_conform_project_authority` | 121s |
| `derive_feature_decomp_surface` | 57s |
| `derive_design_surface` | 64s |
| `derive_scenario_surface` | 94s |
| `derive_implementation_design_surface` | 91s |
| `select_implementation_stack_profile` | 111s |
| `derive_implementation_module_surface` | 104s |
| `derive_aggregate_domain_model_surface` | 91s |
| `derive_implementation_component_topology_surface` | 104s |
| `derive_aggregate_sunny_day_sequence_surface` | 102s |
| `derive_component_realization_schedule_surface` | 137s |
| `derive_component_code_surface` | final edge |

Module bloat fix evidence:

- The live `derive_implementation_module_surface` prompt contains the new
  proportionality guard: "Do not flatten requirement obligations, runtime
  execution proof, process archives, test assertions, downstream evidence, or
  audit lineage into separate module entities".
- The generated module surface now has one module, one `HelloProgram` entity,
  one `emit_hello_world_stdout` operation, and one stateless diagram row.
- The previous sibling entities for process records, stdout assertions, and
  process archive entries were not generated.

Volume evidence:

- Full run archive: 114 MiB.
- `operator-runs`: 62 MiB.
- Operator-run file count: 516 files.
- Combined `runtime_events.json`: 2.1 MiB.
- Combined `worker_stdout.log`: 2.7 MiB.
- Combined `run_compact.json`: 60 KiB.
- Combined `handoff_manifest.json`: 1.4 MiB.

Assessment:

The correctness bugs found in the earlier run are closed for T-132:
requirement lineage stays canonical, source-file lineage is present in both
the product file and manifest row, module design no longer flattens runtime
evidence into sibling entities, and the live lane closes without retry.

The lane is still not proportional for hello world. The remaining cost is not
same-edge repair or requirement explosion; it is the full-breadth graph itself
plus prompt-heavy design surfaces. A one-line program still traverses twelve
prompted edges before the source exists. That is a product/design question for
guided traversal overlays or a minimal proof lane, not a residual T-159
lineage correctness bug.
