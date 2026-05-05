# test69.TS.cx Steel-Thread Run Forensic Analysis

## Scope

Subject workspace:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test69.TS.cx`

Run archive root:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test69.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs`

This analysis uses archived metadata, handoff manifests, worker summaries,
worker output volumes, gap dossiers, and emitted transform artifacts. It does
not rerun the live lane.

## Executive Finding

The ABG/ODD runtime mechanics behaved coherently through the first four worker
edges:

- PTY executor was used for every worker edge.
- Worker process output was archived.
- `featureScope` was present in every worker handoff.
- Same-edge retry repaired the first `derive_product_surface` gap.
- No API retry storm, timeout, or no-output transport failure occurred.

The run failed at `derive_feature_decomp_surface` for a different reason:
steel-thread scope existed as metadata but had not yet reduced worker pressure.
Every steel-thread edge still carried full-breadth obligation pressure:

- 97 total traversal obligations
- 90 requirement obligations
- 22 authority refs
- 22 retrieval hints

The feature-decomp worker exhausted the Codex context window after producing
about 3.34 MB of stdout. Later retries failed fast because the selected
`gpt-5.3-codex-spark` quota was exhausted.

## Run Timeline

| Archive | Edge | Vector | Result | Elapsed | Prompt | Stdout | Output artifact | Gap |
| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | --- |
| `20260504T163430111Z_pid49204` | `Fg_conform_project` | n/a | converged | n/a | n/a | n/a | n/a | none |
| `20260504T163437673Z_pid49383` | `derive_intent_surface` | 0 | passed | 33.4s | 60.7 KB | 629.2 KB | 11.4 KB | none |
| `20260504T163511130Z_pid49383` | `derive_product_surface` | 1 | postflight gap | 24.7s | 60.8 KB | 705.2 KB | 9.4 KB | 234 requirement trace gaps |
| `20260504T163535815Z_pid49383` | `derive_product_surface` | 1 | passed retry | 20.5s | 62.0 KB | 559.1 KB | 9.6 KB | none |
| `20260504T163556365Z_pid49383` | `derive_goal_surface` | 2 | passed | 32.6s | 60.8 KB | 656.2 KB | 12.9 KB | none |
| `20260504T163629017Z_pid49383` | `derive_requirement_surface` | 3 | passed | 47.5s | 61.0 KB | 538.1 KB | 10.9 KB | none |
| `20260504T163716508Z_pid49383` | `derive_feature_decomp_surface` | 4 | worker failed | 187.6s | 60.7 KB | 3.34 MB | absent | `worker_process_failed` |
| `20260504T164024130Z_pid49383` | `derive_feature_decomp_surface` | 4 | worker failed | 3.2s | 60.9 KB | 62.8 KB | absent | `worker_process_failed` |
| `20260504T164027296Z_pid49383` | `derive_feature_decomp_surface` | 4 | worker failed | 2.9s | 61.1 KB | 62.9 KB | absent | `worker_process_failed` |
| `20260504T164030254Z_pid49383` | `derive_feature_decomp_surface` | 4 | worker failed | 2.8s | 61.3 KB | 63.1 KB | absent | `worker_process_failed` |

Aggregate worker cost through the failed run:

- total worker elapsed: 355s
- total prompt bytes: 549 KB
- total stdout bytes: 6.62 MB
- total successful transform artifact bytes: 54 KB

The output ratio is poor: workers emitted far more terminal transcript than
durable artifact. This is acceptable as forensic observability but poor as a
steady-state build strategy.

## Edge-by-Edge Quality Notes

### `Fg_conform_project`

Status: passed.

The first CLI invocation conformed the workspace and returned
`next_action: rerun_start_for_downstream_graph`. This matches current operator
semantics.

No bug found on this edge.

### `derive_intent_surface`

Status: passed.

Quality signals:

- transform artifact starts with `## Execution Plan`
- includes `## Requirement Trace Register`
- records 90 `requirement:REQ-*` trace entries
- mentions the steel-thread scope
- no Codex runtime error text

Concern:

This edge carried all 90 requirements even though `featureScope.mode` was
`steel_thread` and `includedModuleNames` was only `cdme-compiler`.

Bug:

Steel-thread scope was archived but not applied to traversal pressure. The
worker was still responsible for full-breadth requirement trace register
coverage.

### `derive_product_surface`, first attempt

Status: postflight gap, then ABG retried.

Quality signals:

- transform artifact starts with `## Execution Plan`
- includes `## Requirement Trace Register`
- only records 12 `requirement:REQ-*` trace entries
- postflight observed 234 gap reasons

The gap shape is useful. It proves postflight is enforcing trace obligations
and retrying the same edge when the worker output is substantively incomplete.
This is the correct class of loop: ABG-owned same-edge retry, not an external
script loop.

Bug:

The gap was caused by full-breadth pressure during a steel-thread run. The
worker was expected to cover 90 requirement obligations, including deferred
module families such as ADJ, COV, DQ, ENG, LDM, PDM, TRV, and TYP.

### `derive_product_surface`, retry

Status: passed.

Quality signals:

- transform artifact starts with `## Execution Plan`
- includes `## Requirement Trace Register`
- records 90 `requirement:REQ-*` trace entries
- no gap dossier

This is strong evidence that same-edge retry repaired a real semantic
postflight failure.

Concern:

Passing by expanding to all 90 requirement traces is mechanically valid but
strategically wrong for steel-thread delivery. It trained the live lane toward
full-breadth trace enumeration rather than in-scope construction.

### `derive_goal_surface`

Status: passed.

Quality signals:

- transform artifact starts with `## Execution Plan`
- includes `## Requirement Trace Register`
- records 90 `requirement:REQ-*` trace entries
- no gap dossier

Concern:

This edge succeeded but still carried full-breadth pressure. It likely spent
unnecessary token and wall-clock budget proving deferred breadth.

### `derive_requirement_surface`

Status: passed.

Quality signals:

- transform artifact starts with `## Execution Plan`
- includes `## Requirement Trace Register`
- records 90 `requirement:REQ-*` trace entries
- no gap dossier

Concern:

This edge is a natural place to carry broad requirements, but in a steel-thread
run it should project the in-scope subset plus deferred breadth notes, not
force every downstream edge to keep carrying all 90 requirement obligations.

### `derive_feature_decomp_surface`

Status: failed.

First attempt:

- elapsed: 187.6s
- stdout: 3.34 MB
- no transform artifact persisted
- no stderr
- status: 1
- outcome: exited
- not timed out
- no API retry events

The stdout contains the direct failure:

`ERROR: Codex ran out of room in the model's context window.`

The worker also emitted:

`context compacted`

The worker attempted to inspect very large manifest/authority surfaces, then
hit context exhaustion before writing the required artifact.

Later attempts:

- each failed in about 3s
- stdout about 63 KB
- no transform artifact
- direct failure was the model quota:

`ERROR: You've hit your usage limit for GPT-5.3-Codex-Spark. Switch to another model now, or try again at 5:02 AM.`

Root cause:

The worker did not fail because feature decomposition is inherently invalid.
It failed because the handoff made a steel-thread worker carry full-breadth
requirement pressure and full authority retrieval pressure.

## Scope Metadata Behavior

Every worker handoff had:

- `featureScope.mode: steel_thread`
- `includedModuleNames: ["cdme-compiler"]`
- deferred modules:
  - `cdme-assurance`
  - `cdme-executor`
  - `cdme-adjoint`
  - `cdme-accounting`
  - `cdme-fidelity`
  - `cdme-engine`

But every worker handoff also had:

- `obligationCount: 97`
- `requirementCount: 90`
- `authorityRefCount: 22`
- `retrievalHintCount: 22`

This is the central defect found by the run.

The scope carrier existed, but it was not yet load-bearing for traversal
pressure. It was visible in the manifest and prompt, but the rest of the
handoff still behaved as full-breadth.

## Bugs Found

### B-1: Steel-thread scope did not reduce traversal pressure

Severity: high.

Evidence:

- All steel-thread worker manifests carried 97 obligations and 90 requirement
  obligations.
- `derive_feature_decomp_surface` exhausted model context while trying to
  process full authority pressure.

Impact:

The steel-thread strategy cannot reliably accelerate delivery if every edge
still carries full-breadth requirement and authority pressure.

Status:

Fixed after this run in `odd_sdlc` source by making `featureScope` filter:

- traversal obligations
- authority refs
- retrieval hints
- module tranche keys

The fix still needs build/test/install/live proof.

### B-2: Prompt/manifest pressure is too large for worker context safety

Severity: high.

Evidence:

- Feature-decomp prompt was about 60.7 KB before worker reads.
- Feature-decomp stdout grew to 3.34 MB.
- Codex emitted `context compacted` and then context-window exhaustion.

Impact:

The worker can burn the entire model context before writing the required
artifact. This makes live behavior appear random and wastes retry budget.

Required correction:

After scope filtering, add a pressure budget guard. A worker handoff should
publish counts and fail fast before dispatch when prompt pressure exceeds a
declared budget for the selected worker/model.

### B-3: Retry metadata is inconsistent for worker runtime failures

Severity: medium.

Evidence:

- `derive_feature_decomp_surface` was attempted four times.
- Per-attempt gap dossiers report `retryEligible: false` and
  `nextLawfulActions: ["triage_gap"]`.
- The traversal still consumed retry attempts after the first failure.

Impact:

Operator-facing metadata does not fully explain why retries happened. This
weakens forensic trust.

Required correction:

Align `gap_dossier.retryEligible` and `nextLawfulActions` with the actual
traversal retry policy, or record a separate ABG retry-policy reason when the
runner retries despite a domain gap being marked non-retryable.

### B-4: Worker runtime failures are over-broadly collapsed to `worker_process_failed`

Severity: medium.

Evidence:

- First feature-decomp failure was context-window exhaustion.
- Later feature-decomp failures were model quota exhaustion.
- Gap dossier records only `worker_process_failed`.

Impact:

Different operational causes collapse into one domain reason. The operator has
to inspect stdout manually to distinguish context pressure from quota.

Required correction:

Classify common agent CLI failures into typed worker runtime reasons:

- `worker_context_window_exhausted`
- `worker_model_quota_exhausted`
- `worker_cli_argument_parse_failed`
- `worker_usage_limit`

Keep raw stdout/stderr as evidence refs.

### B-5: PTY transcript volume is high relative to artifact volume

Severity: medium.

Evidence:

- total stdout: 6.62 MB
- successful artifact output: 54 KB
- feature-decomp stdout alone: 3.34 MB

Impact:

Forensics are rich, but the runtime is expensive and noisy. If every edge emits
hundreds of KB to MB of terminal transcript for small artifacts, live runs will
be slow and harder to review.

Required correction:

Keep raw transcript for forensics, but add compact trace summaries:

- stdout byte count
- last useful worker message
- detected error class
- artifact written or not
- requirement trace count
- scope pressure counts

### B-6: Passed early edges may be semantically broad rather than steel-thread deep

Severity: medium.

Evidence:

- Intent, product, goal, and requirement edges all passed with 90 requirement
  traces.
- Their artifacts are small and structurally compliant.
- The live chain had not yet reached implementation/design depth.

Impact:

The run proves the early graph mechanics and retry loop, but does not prove
test35-style deep production-shaped construction. It mostly proves that the
worker can summarize and trace broad authority until feature decomposition
overloads context.

Required correction:

After scope-pressure filtering, rerun and judge quality at the first true
constructive edges:

- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`
- `derive_design_surface`
- `derive_implementation_module_surface`
- `derive_aggregate_domain_model_surface`

## What Worked

- PTY executor produced useful trace archives.
- `featureScope` was archived correctly.
- ABG same-edge retry repaired a real `derive_product_surface` postflight gap.
- Successful worker artifacts consistently started with `## Execution Plan`.
- Successful worker artifacts included `## Requirement Trace Register`.
- No transient API retry storm was observed.
- No timeout or inactivity kill was observed.

## What Did Not Work

- Steel-thread scope was not load-bearing for handoff pressure.
- Feature decomposition overloaded the worker before artifact creation.
- Retry metadata did not match actual retry behavior for worker runtime
  failures.
- Runtime failure classification was too coarse.
- Transcript volume dwarfed durable artifact volume.

## Recommended Next Proof Sequence

1. Build and test the scope-pressure fix.

Command:

`npm run test:t122`

2. Reinstall the rebuilt `odd_sdlc` package into a fresh sandbox or into
`test69` only if preserving the failed run archive is sufficient.

3. Rerun with the same worker after the Spark limit resets.

Command:

`ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE=pty-terminal node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until converged --worker 'process://codex?model=gpt-5.3-codex-spark'`

4. Compare the next run against this one at the same metadata points:

- obligation count should drop below 97
- requirement count should drop below 90
- authority refs should drop below 22
- retrieval hints should drop below 22
- prompt bytes should fall materially below ~60 KB
- feature-decomp stdout should not climb into MBs before artifact write
- feature-decomp should write `feature_decomp_surface.md`

5. If feature-decomp still fails after pressure filtering, classify whether the
remaining failure is:

- inadequate scope selection
- prompt still too large
- worker model too small for the edge
- artifact contract too vague
- genuine feature-decomposition semantic failure

