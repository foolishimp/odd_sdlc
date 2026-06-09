---
id: T-161
title: Read-only F_D run analysis linter
type: feature
ticket_category: fd_run_analysis_linter
status: active
goal: deterministic-read-only-runtime-analysis-without-new-closure-authority
build_tenant: typescript
owner: odd_sdlc
change_intent: Add a deterministic read-only F_D analysis command over existing workspaces and run archives that emits current-state telemetry, runtime artifact gaps, and diagnostics for performance, bloat, retry, and runtime-shape triage without advancing traversal or creating closure authority.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-12
created_at: 2026-05-12
updated_at: 2026-05-16
activated_at: 2026-05-16
governance_scope: STDO Method
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
  - .ai-workspace/comments/codex/20260512T054127Z_POST_t132_live_performance_bloat_telemetry.md
related_tickets:
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-158-replay-product-materialization-manifest-across-repair-attempts.md
  - .ai-workspace/tickets/completed/T-159-product-assets-carry-requirement-lineage.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - .ai-workspace/tickets/completed/T-132-create-hello-world-single-tenant-live-proof-lane.md
  - .ai-workspace/tickets/completed/T-133-create-minimum-overhead-rust-hello-world-live-lane.md
  - .ai-workspace/tickets/completed/T-139-consolidate-public-gaps-as-read-only-evaluator-view.md
  - .ai-workspace/tickets/completed/T-143-derive-product-materialization-targets-from-conformed-authority.md
  - .ai-workspace/tickets/completed/T-145-replay-visible-closure-and-worker-report-authority-deletion.md
  - .ai-workspace/tickets/completed/T-151-one-closed-computational-loop-and-runner-evaluator-sovereignty.md
evidence_archives:
  clean_t132_js_live: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T050346719Z_pid65805
  retry_heavy_t132_js_live: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T034912177Z_pid64074
  aborted_t132_bloat_observation: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T044815391Z_pid44464
  fresh_t133_rust_live: build_tenants/typescript/test_env/test_runs/scenario_t133_hello_world_rust_live/20260512T055755078Z_pid33268
  data_mapper_scale_sandbox: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T172019616Z_pid87986
  data_mapper_repair_timeout: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T112004427Z_pid37576
affected_boundary:
  - build_tenants/typescript/code/src/analysis/   # new pure read-model module
  - build_tenants/typescript/code/src/spec_method/entry.ts   # CLI dispatch only
  - build_tenants/typescript/code/src/shared/blocking_reason.ts   # diagnostic code registration only
  - build_tenants/typescript/test_env/tests/
restricted_boundary:
  # Touching any of these from T-161 requires an explicit execution-authority
  # audit in the review-resolution comment before the change lands. The linter
  # is a read-model over their outputs; it must not modify their behavior.
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/start/public_start.ts
excluded_boundary:
  - traversal advancement
  - worker invocation
  - workspace mutation
  - evidence admission into closure ledgers
  - F_P semantic evaluation
  - Ev closure evaluation
  - ABG event-log ownership
  - any new source of routing or closure truth
non_closure_conditions:
  - analyzer writes into the inspected workspace or run archive by default
  - analyzer advances traversal, invokes workers, or repairs files
  - analyzer output is consumed as closure/routing authority
  - analyzer silently treats missing or malformed runtime files as success
  - analyzer reports only wall-clock duration without edge/phase attribution
  - analyzer reports prompt volume only as prompt markdown bytes, excluding invocation, handoff, traversal, stdout, and event carriers
  - analyzer cannot distinguish no retry, retry, repair, block, and aborted-run shapes
  - analyzer cannot flag requirement/product-lineage fanout and bloat slope anomalies
  - analyzer publishes a `gapAnalysis` field that competes with public `gaps` requirement-fulfillment authority
  - analyzer treats `run_performance_summary.json` or `edge_performance_summary.json` as authority without structurally comparing them to raw runtime carriers
  - analyzer modifies any file listed in `restricted_boundary` without an explicit execution-authority audit
  - analyzer emits non-`info` severity from unratified threshold-policy refs
  - analyzer cannot answer "what is running now, is it productive, and where is it stuck" for a long-running graph
---

# T-161: Read-Only F_D Run Analysis Linter

## STDO Triage

First missing layer: design.

The need is not more live logging and not another evaluator. The need is a
deterministic read-only F_D analysis program over current workspace and preserved
run state.

The command must be runnable at any time against:

- a live installed workspace;
- a source-workspace runtime directory;
- a preserved scenario run archive;
- a selected operator-run archive.

It observes current state and emits a multi-section read model. It must not
mutate the inspected workspace, admit evidence, advance traversal, invoke a
worker, repair product files, or create closure authority.

This is a linter-style extension for SDLC runtime shape. It can fail a test lane
or report diagnostics, but it does not become the source of truth for traversal
state. F_P and Ev remain responsible for semantic evaluation and closure. ABG
remains responsible for event-log, frame, continuation, and replay truth.

## Problem Statement

Recent live T-132 work exposed two different cost classes:

- bug overhead: same-edge retries, blocked attempts, repair attempts, and
  harness/runtime defects;
- fixed methodology-depth cost: a clean one-line hello-world product still
  required twelve live F_P worker edges.

The existing archives contain enough data to reconstruct timing, retry shape,
prompt/context volume, handoff growth, event volume, and lineage fanout. But
the reconstruction currently requires bespoke archive scraping and manual
forensics.

That makes performance and bloat review too slow and too easy to confuse with
closure. A read-only F_D analysis command should produce the structured current
state view directly.

## Required Command Shape

Candidate public command names:

```bash
odd-sdlc-ts analyze-run --workspace .
odd-sdlc-ts analyze-run --run-archive build_tenants/typescript/test_env/test_runs/.../20260512T050346719Z_pid65805
odd-sdlc-ts analyze-run --operator-run .ai-workspace/runtime/odd_sdlc/operator-runs/...
odd-sdlc-ts lint-run --workspace . --profile hello_world
odd-sdlc-ts lint-run --run-archive ... --profile data_mapper
```

The exact name may be refined during implementation, but the command contract
must preserve these properties:

- read-only by default;
- deterministic output from files already present on disk;
- no worker process launch;
- no traversal advancement;
- no writes under the inspected workspace/run archive unless the operator
  explicitly supplies an output path outside or beside the inspected archive;
- machine-readable JSON output;
- human-readable markdown/table output.

## Required Multi-Section Output

The output must be multi-section. At minimum:

### 1. Current State Telemetry Summary

Summarize what exists now:

- inspected root and run/archive identity;
- scenario/profile when inferable;
- operator-run count;
- graph edge sequence;
- same-edge retry count;
- blocked attempt count;
- repair attempt count;
- yielded/aborted/incomplete attempt count;
- final observed closure disposition, if present;
- total wall-clock duration when inferable;
- summed worker/F_P elapsed time;
- unattributed/system elapsed time when inferable;
- archive bytes;
- operator-run bytes;
- runtime/event bytes;
- stdout/stderr bytes;
- prompt/context carrier bytes;
- product file count;
- requirement obligation count;
- requirement lineage count on product files.

### 2. Edge Traversal Table

For each operator run:

- attempt ordinal;
- graph function / edge name;
- graph vector ref when present;
- target asset type when present;
- worker elapsed time;
- edge-window elapsed time when inferable;
- deterministic/system time when inferable;
- F_P evaluate status;
- postflight status;
- closure disposition;
- selected next action;
- retry/repair predecessor ref;
- blocking reason codes;
- product files written or replayed;
- requirement obligation count;
- product-lineage count;
- prompt/context byte counts.

### 3. Active-Run Liveness

For a long-running graph the operator needs to answer three questions at any
moment: what is running now, is it productive, and where is it stuck. The
analyzer must publish this section even when the run is already complete (in
which case the fields describe the last-active edge before the run ended).

Required fields:

- `activeOperatorRunRef` — the most recent operator-run directory.
- `activeEdgeRef` — graph function / vector / target asset type for the
  in-flight or last edge.
- `actorInvocationRef` — current or last `actor_invocation_started` event ref.
- `workerProcessRef` — `worker_process_started.json` ref when present.
- `workerPid` — best-effort process id (from worker_process_started or
  filename suffix); reported with `processAliveCheckedAt` and
  `processAlive: true | false | unknown`.
- `lastEventAt` — most recent `runtime_events.json` / `worker_process_events.jsonl`
  entry timestamp.
- `lastStdoutAt` — most recent stdout write mtime.
- `lastHeartbeatAt` — most recent `actor_process_heartbeat` event timestamp.
- `heartbeatAgeMs` — now minus `lastHeartbeatAt`.
- `maxNoOutputGapMs` — longest observed gap between consecutive stdout or
  event entries within the active edge.
- `archiveGrowthBytesPerMinute` — rolling growth of the active operator-run
  directory across the last several samples.
- `productiveSignal` — one of `progressing`, `stalled_with_io`,
  `stalled_no_io`, `completed`, `aborted_or_killed`, `unknown`. The classifier
  is structural: `stalled_no_io` requires `heartbeatAgeMs > threshold` and
  zero stdout/event growth in the same window; `progressing` requires any
  measurable stdout or event delta plus a recent heartbeat.
- `lastBlockingReason` — typed blocking reason from the last admitted
  postflight / assurance if the run has produced one.

The classifier is F_D and structural; it must not call `productive` based on
elapsed time alone. The thresholds backing `stalled_*` classification ride
through the same profile/threshold policy refs as the slope analysis (see
Profiles section).

### 4. Runtime Artifact Gaps

Report missing or incomplete runtime structure. This section is **runtime
artifact gaps** only — it does **not** carry product-requirement fulfillment
state. Public requirement-fulfillment state lives behind the `gaps` command
and the requirement closure register; this section reports only the shape of
the admitted runtime carriers.

- missing `worker_run.json`;
- missing `worker_invocation_package.json`;
- missing `handoff_manifest.json`;
- missing `fp_evaluate_result.json`;
- missing `sdlc_edge_closure_decision.json`;
- missing `sdlc_edge_fulfillment_ledger.json`;
- missing `sdlc_next_action_projection.json`;
- missing product materialization manifest on product edges;
- malformed JSON;
- missing graph function / graph vector authority;
- missing predecessor refs;
- missing product-file lineage;
- stale or mismatched replay manifest references;
- no final closure decision;
- archive sequence gaps.

### 5. Diagnostics

Emit typed diagnostics with severity:

- `retry_observed`;
- `repair_observed`;
- `blocked_attempt_observed`;
- `worker_authority_read_outside_workspace_observed`;
- `prompt_context_volume_high`;
- `handoff_growth_suspicious`;
- `event_snapshot_volume_high`;
- `requirement_fanout_suspicious`;
- `product_lineage_missing`;
- `product_lineage_fanout_suspicious`;
- `runtime_artifact_missing`;
- `runtime_artifact_malformed`;
- `edge_sequence_incomplete`;
- `phase_timing_unavailable`;
- `aborted_run_observed`;
- `unattributed_time_high`;
- `active_run_stalled_no_io`;
- `active_run_stalled_with_io`;
- `worker_heartbeat_age_high`;
- `archive_growth_zero_during_active_edge`;
- `summary_source_drift`.

Diagnostics are read-only findings. They may fail the linter command under a
strict profile, but they do not alter closure or traversal state.

### 6. Bloat And Slope Analysis

Compute normalized ratios:

- bytes per requirement obligation;
- bytes per source authority ref;
- bytes per product file;
- bytes per component;
- bytes per edge;
- bytes per retry;
- handoff bytes by edge index;
- event bytes by edge index;
- stdout/stderr bytes by edge index;
- prompt/context bytes by edge index;
- lineage refs per product file;
- source authority refs per edge;
- duplicate requirement authority count;
- raw display-id requirement count;
- canonical requirement id count;
- transitive dependency fanout ratio where a surface intentionally flattens
  upstream references.

The analyzer should flag potential superlinear growth. It should distinguish
legitimate design traceability tables from product-file lineage, where the
expected count is the current canonical requirement obligations for that file.

### 7. Retry Forensics

Every retry or repair must get a compact forensic row:

- edge name;
- attempt ref;
- predecessor attempt ref;
- worker seconds before retry/repair/block;
- blocking/repair reason codes;
- changed files;
- product files observed;
- product files materialized or replayed;
- lineage status;
- outside-workspace read count;
- schema violation count;
- likely cause class:
  - prompt_schema_gap;
  - worker_policy_violation;
  - target_carrier_admission_missing;
  - deterministic_evaluator_bug;
  - harness_bug;
  - runtime_bug;
  - tenant_source_defect;
  - unknown.

The classifier must check causes in the order listed above; the **first**
matching condition wins. `deterministic_evaluator_bug` is **not** a
catch-all and may be assigned only when F_D postflight explicitly
rejected the attempt (`postflight.status != "passed"` or
`postflight.blockingReasons` is non-empty). A passing postflight that
nonetheless results in `closure.disposition == "block"` must be
classified as `target_carrier_admission_missing` when the fulfillment
ledger or residual pressure carries
`targetCarrierAdmissionStatus == "missing"`, and otherwise as
`unknown`. Misclassifying T-133 target-carrier admission blocks as
`deterministic_evaluator_bug` is a known defect; see non-closure
conditions.

Detection rules per cause class:

- `prompt_schema_gap` — worker stream-json carries a schema-related
  error reply from the model, or `worker_result_report.obligationAssessments[]`
  contains `fulfillmentStatus != "fulfilled"` with a schema diagnostic.
- `worker_policy_violation` — `postflight.blockingReasons` contains
  any `worker_authority_read_outside_workspace*` entry, or
  `runtime_artifact_missing` for `worker_run.json` in conjunction with
  a worker policy diagnostic.
- `target_carrier_admission_missing` — postflight passed
  (`status: "passed"`, empty `blockingReasons`) **AND** closure is
  `block` **AND** any of:
  - `sdlc_edge_fulfillment_ledger.targetCarrierAdmissionStatus == "missing"`
  - `sdlc_edge_residual_pressure.targetCarrierAdmissionStatus == "missing"`
  - `sdlc_edge_residual_pressure.requiredPressureRefs` contains a
    `pressure://odd-sdlc/target-carrier/.../missing_admission` entry
- `deterministic_evaluator_bug` — `postflight.status != "passed"` or
  `postflight.blockingReasons` non-empty, with no overlap into the
  classes above.
- `harness_bug` — operator-run terminated abnormally and structural
  signals (missing `worker_run.json`, missing
  `worker_process_summary.json` exit metadata) point to harness rather
  than worker.
- `runtime_bug` — process-level failure with `worker_process_summary`
  recording crash / signal exit; worker JSON output is empty or
  truncated.
- `tenant_source_defect` — F_P retry attempts repeatedly fail on the
  same tenant source file with the same diagnostic across attempts.
- `unknown` — none of the above matched; the attempt is recorded but
  no structural cause is claimed.

The analyzer should not claim semantic root cause. It should report
evidence and classify obvious structural signals only.

## Profiles

Profiles are optional rule bundles. First candidates:

- `hello_world`: strict low-complexity baseline.
- `data_mapper`: scale baseline focused on slope, not absolute time.
- `generic`: structural lint only.

### Profile And Threshold Policy Refs

Every profile must declare:

- `profilePolicyRef` — typed ref to the profile's structural rule set
  (e.g. `policy://odd-sdlc/analysis/profile/hello_world/v1`).
- `thresholdPolicyRef` — typed ref to the numeric thresholds the profile uses
  for slope, bloat, heartbeat age, and stall classification.
- `policyStatus` — `ratified` or `informational`. Unratified thresholds
  produce diagnostics with severity `info` only; they do **not** fail a
  strict lint until promoted.

The thresholds themselves are not embedded inline in `odd_sdlc` core. They
live behind the policy ref so a project or tenant can override them through
its own admitted policy without forking the analyzer. Until those policy
carriers are ratified, the analyzer ships with default `informational`
thresholds and any "high" / "suspicious" diagnostic in this section is
explicitly advisory.

`hello_world` profile should check:

- zero same-edge retries for the clean baseline;
- canonical requirement obligation count remains stable unless an ingress edge
  changed it;
- product source carries canonical requirement lineage;
- no raw display-id requirement tags in product files;
- no duplicate requirement authority ids;
- prompt/context and event bytes remain below governed thresholds once
  thresholds are ratified.

`data_mapper` profile should check:

- slope per requirement;
- slope per component;
- slope per product file;
- retries by edge;
- blocked worker seconds by edge;
- lineage fanout;
- event/archive growth by edge index;
- whether repeated traversal segments are bug overhead or expected refinement.

## Output Contract

The JSON output should be stable enough for tests and later CI consumption.

Candidate top-level shape:

```json
{
  "kind": "sdlc_fd_run_analysis",
  "version": 1,
  "inspectedRoot": "...",
  "profile": "hello_world",
  "profilePolicyRef": "policy://odd-sdlc/analysis/profile/hello_world/v1",
  "thresholdPolicyRef": "policy://odd-sdlc/analysis/threshold/hello_world/v1",
  "policyStatus": "informational",
  "readOnly": true,
  "currentStateTelemetrySummary": {},
  "edgeTraversal": [],
  "activeRunLiveness": {},
  "runtimeArtifactGaps": [],
  "diagnostics": [],
  "bloatAndSlopeAnalysis": {},
  "retryForensics": [],
  "evidenceIndex": []
}
```

Field-naming note: this section is **`runtimeArtifactGaps`**, not
`gapAnalysis`. The unqualified term *gap* is reserved for the public `gaps`
view over product requirement fulfillment. The analyzer reports structural
gaps in admitted runtime carriers; it does not publish a competing
requirements-fulfillment surface.

Markdown output should render the same sections as tables for operator review.

## Design Constraints

- The analyzer is F_D only.
- The analyzer is read-only.
- The analyzer does not evaluate semantic correctness of live product behavior.
- The analyzer does not admit output into closure ledgers.
- The analyzer does not create or update gap dossiers as authority.
- The analyzer must not become a fallback closure or routing surface.
- The analyzer must distinguish current state from recommendation.
- Missing runtime artifacts must be diagnostics, not silently ignored.
- Stale/old archive shape must be diagnosed, not normalized into success.
- Any write mode must require an explicit output path and must write analysis
  artifacts as commentary/read-model output, not under traversal authority.

## Acceptance Criteria

1. A command can analyze the clean T-132 archive:

   ```text
   build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T050346719Z_pid65805
   ```

   It reports twelve edge attempts, zero same-edge retries, zero blocked
   attempts, final product source present, five canonical requirement tags on
   `hello.js`, and worker/F_P time dominating total time.

2. The same command can analyze the retry-heavy T-132 archive:

   ```text
   build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T034912177Z_pid64074
   ```

   It reports the aggregate-domain retry, topology repair, and component-code
   blocked attempts as retry/repair diagnostics with wasted worker seconds.

3. The command can analyze the aborted bloat-observation archive:

   ```text
   build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T044815391Z_pid44464
   ```

   It reports an incomplete run without treating it as closure failure or
   closure success.

4. JSON output includes current-state telemetry summary, edge traversal,
   active-run liveness, runtime artifact gaps, diagnostics, bloat/slope
   analysis, retry forensics, summary drift, and evidence index sections.
   The output must not publish a `gapAnalysis` field; runtime carrier gaps
   live under `runtimeArtifactGaps`.

5. Markdown output renders those same sections in operator-readable form.

6. Unit tests prove the analyzer performs no writes to the inspected workspace
   or run archive.

7. Unit tests cover malformed/missing runtime artifacts and prove they produce
   typed diagnostics.

8. Unit tests cover product-file lineage fanout and missing-lineage diagnostics.

9. Unit tests cover prompt/context byte accounting across prompt markdown,
   worker invocation package, handoff manifest, traversal package, stdout/stderr,
   and event/runtime carriers.

10. The analyzer is not consumed by start/dispatch/closure code as routing or
    closure authority.

11. The analyzer can be invoked against a live, mid-run workspace whose latest
    operator-run has no `run.json`. The `activeRunLiveness` section reports
    `activeEdgeRef`, `workerPid`, `processAlive`, `lastEventAt`,
    `heartbeatAgeMs`, `maxNoOutputGapMs`, and `archiveGrowthBytesPerMinute`,
    and classifies the run as `progressing`, `stalled_with_io`,
    `stalled_no_io`, `aborted_or_killed`, or `completed`. The classifier
    relies only on file mtime, event timestamps, and PID liveness.

12. Unit tests cover the active-run liveness classifier on at least four
    fixtures: a progressing in-flight run, a stalled_no_io case, a clean
    completed run, and a killed/aborted run. Stalled and aborted cases must
    not be classified as completed.

13. When the inspected archive contains a `run_performance_summary.json` or
    `edge_performance_summary.json`, the analyzer recomputes the equivalent
    field from raw carriers and asserts equality within tolerance. A
    deliberate per-field tampering test produces `summary_source_drift` and
    causes the recomputed value to win.

14. The analyzer runs against the fresh T-133 Rust live archive and the
    `full_external_data_mapper_sandbox` archives recorded in
    `evidence_archives`. It reports the data_mapper run's repair/timeout
    shape as retry/repair diagnostics with wasted worker seconds and
    `aborted_run_observed` where applicable, and reports the Rust run
    alongside T-132 to demonstrate the clean baseline holds across two
    languages.

15. Implementation lands without modifying any file listed in
    `restricted_boundary` above. If during implementation a restricted file
    must change, the change is captured in a separate ticket or a
    review-resolution comment that explicitly audits the execution-authority
    impact before the change merges.

16. Profile thresholds emit `info` severity diagnostics only while their
    backing `thresholdPolicyRef` is unratified. A strict-profile failure
    (non-zero exit) requires ratified thresholds.

## Non-Goals

- No live worker execution.
- No automatic repair.
- No semantic validation of product behavior.
- No mutation of inspected run archives.
- No replacement for `gaps`.
- No replacement for F_P or Ev.
- No ABG event-store redesign.

## Implementation Notes

Implementation should prefer a pure archive reader module with no dependency on
live traversal state. The public command should call that reader and format JSON
or markdown.

The first slice can reconstruct from current files:

- `worker_run.json`
- `worker_invocation_package.json`
- `handoff_manifest.json`
- `traversal_intent_package.json`
- `worker_prompt.md`
- `worker_stdout.log`
- `worker_stderr.log`
- `worker_process_events.jsonl`
- `runtime_events.json`
- `fp_evaluate_result.json`
- `postflight.json`
- `sdlc_edge_fulfillment_ledger.json`
- `sdlc_edge_closure_decision.json`
- `sdlc_next_action_projection.json`
- `product_materialization_manifest.json`

Later live runs may emit direct `run_performance_summary.json` and
`edge_performance_summary.json` artifacts. When those summary files are
present the analyzer **must structurally compare them against the raw
runtime/consequence/event carriers** before treating them as the analysis
source. Specifically:

- For every numeric field on the summary (worker elapsed, postflight status,
  blocking reasons, retry counts, byte totals), the analyzer recomputes the
  same field from the raw carriers and asserts equality within a documented
  tolerance.
- On mismatch, emit `summary_source_drift` with the field name, summary
  value, recomputed value, and the raw carrier ref that produced the
  recomputed value. The summary is treated as `untrusted` for that field;
  the recomputed value wins.
- If the summary is structurally valid and all spot-checked fields agree,
  the analyzer may quote the summary's pre-computed phase timers for
  fields it cannot recompute from raw carriers, and must note in the
  output which fields came from the summary vs the raw carriers.

A summary file must never become a *second* truth surface. It is a
performance/audit convenience over the same admitted runtime carriers.

## Review Resolution 2026-05-12

Codex/Claude review verdict: "T-161 is the right design move. F_D, read-only,
explicitly non-authoritative — fits W/L/E/Ev direction and the product rule
that visible state is a projection, not runtime truth. Tighten a few points
before implementation."

Findings folded back into this ticket:

| Severity | Finding | Resolution |
| --- | --- | --- |
| High | Missing active-run liveness as a first-class section. | New §"Active-Run Liveness" output section with `activeEdgeRef`, `workerPid`, `processAlive`, `actorInvocationRef`, `lastEventAt`, `lastStdoutAt`, `lastHeartbeatAt`, `heartbeatAgeMs`, `maxNoOutputGapMs`, `archiveGrowthBytesPerMinute`, `productiveSignal`. New diagnostic codes `active_run_stalled_no_io`, `active_run_stalled_with_io`, `worker_heartbeat_age_high`, `archive_growth_zero_during_active_edge`. New AC-11 and AC-12. |
| Medium | Later summary files could become a rival truth surface. | Implementation Notes now require structural recomputation against raw carriers and an explicit `summary_source_drift` diagnostic; recomputed value wins. New AC-13 and a new non-closure condition. |
| Medium | `gapAnalysis` competes with public `gaps`. | Section renamed to **Runtime Artifact Gaps**; JSON field renamed to `runtimeArtifactGaps`; explicit boundary note that requirement-fulfillment state lives behind `gaps` only. New non-closure condition forbidding the old name. |
| Medium | Profile thresholds need governed policy refs. | New §"Profile And Threshold Policy Refs" requiring `profilePolicyRef`, `thresholdPolicyRef`, `policyStatus`; unratified thresholds are `info`-only. JSON output carries the three fields. New AC-16 and a new non-closure condition. |
| Medium | `affected_boundary` broader than read-only design. | Frontmatter `affected_boundary` narrowed to a new `code/src/analysis/` module, `spec_method/entry.ts` CLI dispatch, `shared/blocking_reason.ts` for code registration, and the test tree. New `restricted_boundary` lists `handoff.ts`, `installed_operator.ts`, `operator/carriers.ts`, `traversal_consequence.ts`, `query_domain.ts`, `public_start.ts` — touching any of them from T-161 requires an explicit execution-authority audit. New AC-15 and a new non-closure condition. |
| Low | Evidence set should include T-133 and a data_mapper archive. | `evidence_archives` adds `fresh_t133_rust_live` (`20260512T055755078Z_pid33268`), `data_mapper_scale_sandbox` (`20260511T172019616Z_pid87986`), `data_mapper_repair_timeout` (`20260511T112004427Z_pid37576`). New AC-14 covers them. |

The review verdict is recorded as agreement; the ticket remains `status: backlog`
pending implementation under the tightened constraints above.

## Reactivation 2026-05-16: Multi-View Analyzer

The first slice landed (`code/src/analysis/` module + `analyze-run` CLI). The
ticket is reactivated to grow the analyzer into a **view-oriented** F_D read
model. Views are named, deterministic, read-only projections over the same
admitted carriers. The existing default output becomes one named view; new
named views are added beside it, and drill-down views address rows of the
upstream view by stable reference. View system law inherits every existing
T-161 constraint (read-only, F_D, no closure/routing authority, no writes into
the inspected workspace).

**Scope note on prior acceptance criteria.** The original ACs 1-16 were
authored before the view system existed. They describe outputs that now
live under `--view summary` (the default). AC-20 below guarantees the
default view does not regress. Read ACs 1-16 as "applying to `--view
summary`"; ACs 17+ define additional views.

### 2026-05-16 Spec Coherence Pass

Folded into this addendum after end-to-end review:

- `viewRef` format now includes a scope digest to prevent silent cross-archive
  mis-resolution.
- `edge-summary` JSON schema replaced the obsolete `panels` block with
  `phases` + `fixedCostRollup` matching the rewritten time-accounting body.
- `edge-full` default selection contradiction resolved: when neither
  `--components` nor `--bundles` is supplied, behavior is `--bundles all`.
- `edge-full` JSON example updated to the current `selection` object and
  the NDJSON rendering rule made explicit.
- View system law now states the envelope (kind/version/inspectedRoot/
  profile/policy refs/readOnly) is identical across all views.
- `--output` rule consolidated in view system law; `edge-tail --follow` is
  the lone exception.
- Consolidated diagnostic registry added.
- New ACs: `viewRef` drill-down round-trip (AC-33), at-most-once carrier
  parsing per invocation (AC-34).
- Source carriers tightened: `closure_decision.admittedAt` preferred over
  mtime; `--tail all --follow` cap behavior clarified; `edge-prompts`
  rendering knobs explicitly differentiated from `edge-full --bundles
  prompts`.

### View System Law

- One CLI flag selects the view: `analyze-run --view <name>` (default keeps
  the current output, named `summary`).
- The set of known view names is **closed**: an unknown `--view` value fails
  with the registry of known keys. No silent fallback to `summary`.
- **Envelope identity.** Every view returns the *same* envelope shell:
  `kind`, `version`, `inspectedRoot`, `inspectedKind`, `scopeDigest`,
  `profile`, `profilePolicyRef`, `thresholdPolicyRef`, `policyStatus`,
  `readOnly`, `diagnostics`. Only the typed body under `view.<name>`
  differs. Views must not omit or rename envelope fields.
- **`scopeDigest`** is a stable hash over `(inspectedKind, normalized
  inspectedRoot, list of operator-run identities admitted into the
  analysis)`. It is the identity of the *current invocation's analysis
  scope* and is the namespace under which `viewRef`s are issued.
- **`viewRef` format** is
  `view://odd-sdlc/analysis/<scopeDigest>/<view-name>/<row-key>`. The
  scopeDigest segment prevents silent mis-resolution when refs are
  copied across invocations against different archives. Examples:
  `view://odd-sdlc/analysis/sha256-abcd1234/edge-aggregate/derive_implementation_design_surface`,
  `view://odd-sdlc/analysis/sha256-abcd1234/edge-summary/Fg_conform_project_authority`.
- Each view declares a stable `viewRef` per row. Drill-down views accept
  that ref as input via `--edge-ref` (or the equivalent for other view
  classes). This is the addressability contract for nested views.
- **scope check on drill-down.** When `--edge-ref <viewRef>` is supplied,
  the analyzer recomputes the current invocation's `scopeDigest` and
  rejects the ref with exit non-zero if the embedded `scopeDigest` does
  not match. There is no cross-archive ref resolution.
- Views may read each other's outputs, but a view must not consume another
  view's `viewRef` as authority for traversal, closure, or routing. Drill-down
  is presentational.
- Markdown rendering and JSON output are both required for every view.
- **`--output <path>` rule.** Every non-streaming view accepts
  `--output <path>` to write a single concatenated markdown document.
  The path must resolve outside the inspected root; the analyzer rejects
  paths under the inspected workspace or run archive. `edge-tail
  --follow` is the lone view mode that does not accept `--output`
  (streaming output is stdout-only).
- All views must be expressible from the same raw carriers used today; no view
  may demand a new authoritative carrier without a paired upstream ticket.
- **At-most-once carrier parsing.** Within a single analyzer invocation,
  each operator-run carrier file (`events.ndjson`, `stdout.raw`,
  `worker_process_events.jsonl`, etc.) is read and parsed at most once
  even when multiple views or multiple components in one view consume
  it. The analyzer caches parse results in-memory for the lifetime of
  the invocation. This is observable: AC-34 below asserts it.

### View: `edge-aggregate`

Grain: one row per distinct logical edge (graph function / `edge_name`),
aggregating across every operator-run attempt for that edge inside the
inspected scope.

Required columns:

- `edge` — graph function / edge name.
- `iters` — count of operator-run attempts at this edge.
- `wallS` — **edge span**: `lastAttemptEnd − firstAttemptStart`. Includes
  the scheduler/postflight/F_D idle gap *between* attempts on this edge.
  Does **not** include time before the first attempt or after the last
  attempt (between-edge idle is not attributed to any edge in this view).
- `llmS` — sum of **provider API request elapsed only** (HTTP-call
  start→end) across all attempts. See LLM-time rules below.
- `slack` — `wallS − llmS`. The time the edge consumed on the wall clock
  that was not model work. Visible cost of retries, postflight, F_D
  evaluation, and inter-attempt scheduling. May be slightly negative on
  single-attempt rows when `duration_api_ms` sums overlapping HTTP
  requests and exceeds wall-clock; that is expected and not clamped.
- `retries` — same-edge retry count (excludes the first attempt at the edge).
- `blocks` — count of attempts whose final closure was `block`.
- `final` — disposition of the last attempt at this edge
  (`close | block | aborted | yielded | incomplete`).

The `workerS` column is **not** in this view. For the current worker
mix (Claude Code), the worker process is a near-pure shell over the
model and `workerS ≈ llmS` within noise, so it adds no signal in
aggregate. Worker-process elapsed remains available per-attempt in the
default `summary` view, in `edge-summary`'s phase decomposition as
`workerWallS`, and in future attempt-level drill-down views; it is
intentionally excluded from `edge-aggregate` only.

**Revisit clause.** This exclusion is a current-state choice. When the
upstream `actor_request_completed` event lands and the worker mix
diversifies (other actors may do substantial local CPU work between
API calls), `workerS - llmS` becomes informative and should be
reintroduced as a column. Tracked alongside the actor-event admission
ticket.

Additional columns sourced from the same trace `result` event (rendered
when at least one contributing attempt has them):

- `turns` — sum of `num_turns` across attempts.
- `ttftS` — average of `ttft_ms / 1000` across attempts (informational).
- `tokensIn` — sum of `usage.input_tokens`.
- `tokensOut` — sum of `usage.output_tokens`.
- `cacheReadTokens` — sum of `usage.cache_read_input_tokens`.
- `costUsd` — sum of `total_cost_usd`.

Aggregation rules:

- Aggregation key is the graph-function/edge name as declared on the
  operator-run's `sdlc_construction_intent.json` / traversal package, not a
  display label. Same canonical key as the existing per-attempt table.
- Rows are ordered by first-observed attempt timestamp, not alphabetically.
- `firstAttemptStart` is the earliest contributing operator-run's start
  timestamp (operator-run directory timestamp, validated against
  `worker_process_started.json` when present).
- `lastAttemptEnd` is the latest contributing attempt's end timestamp:
  `attemptStart + worker_process_summary.elapsedMs`. When
  `worker_process_summary` is absent (aborted attempt), the analyzer falls
  back to the latest mtime under the operator-run directory and emits
  `phase_timing_unavailable` for that attempt.
- An aborted attempt contributes to `iters` and participates in
  `firstAttemptStart` / `lastAttemptEnd` (so `wallS` reflects that the
  edge was still under attempt during that window), but contributes `0`
  to `llmS` and emits `provider_elapsed_unavailable` for that attempt.
- Between-edge idle (time between one edge's `lastAttemptEnd` and the
  next edge's `firstAttemptStart`) is **not** assigned to either edge in
  this view. It is visible at the scope level as
  `currentStateTelemetrySummary.unattributedElapsedS`.

### LLM-Time Rules (provider request elapsed only)

- `llmS` is the sum of provider HTTP-call elapsed only. It excludes worker
  preflight, postflight, deterministic evaluators, and inter-request idle
  gap. It is **not** worker elapsed minus deterministic time.
- **Primary source today:** Claude Code's traced session output sitting
  beside the worker events in
  `worker_process_events.jsonl.trace/events.ndjson` (mirror of
  `stdout.raw`). The final `{"type":"result", ...}` line carries
  `duration_api_ms`, `duration_ms`, `ttft_ms`, `num_turns`,
  `total_cost_usd`, and a `usage` block with `input_tokens`,
  `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`.
  The analyzer reads this F_D, per attempt, sums `duration_api_ms` for
  `llmS`, and surfaces the other fields as additional columns
  (`turns`, `ttftMs`, `tokensIn`, `tokensOut`, `cacheReadTokens`, `costUsd`).
- **Fallback when the trace `result` line is absent or malformed:** the
  analyzer must not fabricate `llmS` from `workerS - deterministicMs` or
  any other proxy. It emits a typed `provider_elapsed_unavailable`
  diagnostic for that attempt and renders `llmS` as `n/a` for the
  contributing row(s).
- **Upstream normalization (deferred):** a paired upstream ticket should
  admit a typed `actor_request_completed { requestRef, modelRef,
  elapsedMs, tokensIn?, tokensOut? }` event in the worker-runtime event
  spine so non-Claude-Code workers contribute the same field without the
  analyzer parsing actor-specific stream-json. When that typed event
  lands, it becomes the authoritative source and the trace-parsing path
  becomes the fallback.
- **`duration_api_ms` can slightly exceed `duration_ms`** because the
  former is summed across overlapping HTTP requests within the session
  while the latter is wall-clock. The analyzer must not clamp `llmS` to
  `workerS`; it surfaces both honestly and emits an
  `llm_exceeds_worker_elapsed` informational diagnostic when
  `llmS > workerS` for a row, with no severity escalation.

### JSON Output Addition

Top-level envelope grows a `view` field:

```json
{
  "kind": "sdlc_fd_run_analysis",
  "version": 1,
  "view": {
    "kind": "edge_aggregate_view",
    "name": "edge-aggregate",
    "rows": [
      {
        "viewRef": "view://odd-sdlc/analysis/<scopeDigest>/edge-aggregate/<edge_name>",
        "edge": "...",
        "iters": 0,
        "wallS": 0,
        "llmS": null,
        "slack": 0,
        "retries": 0,
        "blocks": 0,
        "final": "close",
        "turns": 0,
        "ttftS": null,
        "tokensIn": null,
        "tokensOut": null,
        "cacheReadTokens": null,
        "costUsd": null
      }
    ]
  }
}
```

When `--view summary` (the default) is selected, `view.kind` is
`summary_view` and the existing fields (`currentStateTelemetrySummary`,
`edgeTraversal`, `activeRunLiveness`, `runtimeArtifactGaps`, `diagnostics`,
`bloatAndSlopeAnalysis`, `retryForensics`) remain in place under it.

### Edge Drill-Down Views

Two views drill into a single logical edge across all its attempts in the
inspected scope:

- `edge-summary` — curated, single-page view of one edge: timing roll-up,
  per-attempt strip, and a fixed minimal component set per attempt.
- `edge-full` — full materialization of one edge with selectable
  per-attempt components against a closed component-label registry.

Both views address one edge. They render every contributing attempt
(including aborted ones) in chronological order. Between-attempt slack is
explicit at the header level.

#### Edge Addressing

Either form accepted:

- `--edge <edge_name>` — canonical edge / graph-function name (same key
  used by the `edge-aggregate` view).
- `--edge-ref <viewRef>` — a
  `view://odd-sdlc/analysis/<scopeDigest>/edge-aggregate/<edge_name>` ref,
  supporting drill-down chaining from the aggregate view. The analyzer
  rejects refs whose `scopeDigest` does not match the current invocation
  (see View System Law).

Exactly one must be supplied. An edge name with zero matching attempts in
the inspected scope fails with the list of edge names present. There is
no fuzzy match.

#### Component Label Registry

A closed, stable label set. Each label maps to one or more operator-run
files. Future additions to this registry are admitted by addendum, not by
silent expansion.

| label                       | source files                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| `traversal-intent`          | `traversal_intent_package.json`, `sdlc_construction_intent.json`                                        |
| `handoff`                   | `handoff_manifest.json`, `worker_brief.json`, `worker_invocation_package.json`                          |
| `prompt`                    | `worker_prompt.md` — the framework-constructed prompt sent at invocation                                |
| `conversation`              | reconstructed from `worker_process_events.jsonl.trace/events.ndjson` (or `stdout.raw`) — every `system` / `user` / `assistant` stream-json event rendered as a turn-by-turn transcript with text content, tool_use blocks, and tool_result blocks |
| `events`                    | `runtime_events.json`, `worker_process_events.jsonl`                                                    |
| `pty`                       | `worker_stdout.log`, `worker_stderr.log`, `worker_process_events.jsonl.trace/stdout.raw`, `.../terminal.transcript` |
| `process`                   | `worker_process_summary.json`, `worker_process_started.json`, `worker_process_started_context.json`     |
| `liveness`                  | `runtime_liveness_observer_projection.json`                                                             |
| `result-report`             | `worker_result_report.json`, `worker_run.json`                                                          |
| `fp-evaluate`               | `fp_evaluate_result.json`, `fp_transform_request.json`, `fp_transform_result.json`                      |
| `post-transform-observation` | `post_transform_observation.json`                                                                      |
| `ledgers`                   | `sdlc_edge_fulfillment_ledger.json`, `assurance_ledgers.json`, `assurance_satisfaction.json`            |
| `gain-residual`             | `sdlc_edge_gain.json`, `sdlc_edge_residual_pressure.json`                                               |
| `closure-decision`          | `sdlc_edge_closure_decision.json`, `sdlc_next_action_projection.json`                                   |
| `postflight`                | `postflight.json`                                                                                       |
| `overlays`                  | `sdlc_overlay_binding_post_action.json`, `sdlc_overlay_segment_completion.json`                         |
| `product`                   | `product_materialization_manifest.json`                                                                 |
| `worksite-evidence`         | `sdlc_worksite_evidence.json`                                                                           |
| `hook-outcome`              | `hook_outcome.json`                                                                                     |
| `constructor-result`        | `constructor_result.json`                                                                               |
| `conformed-project`         | `conformed_project.json`                                                                                |
| `operator-run`              | `operator_summary.json`, `run.json`, `run_compact.json`, `run_compact.txt`, `postmortem.md`             |

Special selector: `all` selects every label.

A component whose source file is absent for a given attempt renders as
`(missing)` with one line of explanation; the analyzer must not silently
skip it.

##### Named Bundles

Bundles are named, ratified groupings of labels for consistent reports.
The purpose of bundles is to make the report **shape** stable across
runs and across operators; ad-hoc per-invocation label lists are
allowed but discouraged because they produce inconsistent reports that
neither humans nor downstream tools can compare.

| bundle            | expansion                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `decision-trace`  | `traversal-intent`, `ledgers`, `gain-residual`, `closure-decision`, `postflight`           |
| `prompts`         | `prompt`, `conversation`                                                                   |
| `io`              | `prompt`, `conversation`, `pty`, `events`                                                  |
| `outputs`         | `result-report`, `fp-evaluate`, `product`, `post-transform-observation`                    |
| `framework`       | `process`, `liveness`, `operator-run`, `worksite-evidence`, `hook-outcome`, `constructor-result`, `conformed-project`, `overlays` |
| `all`             | every label in the registry                                                                |

CLI accepts `--bundles <list>` and `--components <list>` independently;
the rendered selection is the **union** of the two. Both may be supplied
together. If neither is supplied for `edge-full`, the default is
`--bundles all`. Unknown bundle names fail with the published bundle
list (same fail-closed rule as `--components`).

The bundle registry is closed, same as the component label registry.
Future additions require an addendum.

#### `edge-summary` View

Purpose: **fixed-cost identification**. Decompose each attempt's wall
time into phases so the operator can see what is paid per attempt versus
what scales with task complexity, and decide whether interventions like
warm-session caching, PTY pooling, or postflight parallelism are worth
building.

Fixed structure, no `--components` flag.

1. **Header** — edge name, edge `viewRef`, `iters`, edge-span `wallS`,
   `llmS`, `slack`, `retries`, `blocks`, `final`, total `costUsd`, total
   `turns`. Same numbers the aggregate view would show for this row,
   plus first/last attempt timestamps.

2. **Per-attempt phase decomposition** — one row per attempt with
   timing decomposed into named phases. Every phase is sourced from
   admitted carriers; nothing is computed from wall-clock minus other
   phases (no silent inference).

   | column                | phase                                    | source carrier(s)                                                    |
   | --------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
   | `t0`                  | op-run open (anchor)                     | operator-run directory creation / first file mtime                    |
   | `frameworkPrebootS`   | t0 → worker process spawn                | `worker_process_started.json.startedAt` − operator-run dir create     |
   | `ptyStartupS`         | process spawn → first Claude event       | first `structured_event_observed` ts in `events.ndjson` − process startedAt |
   | `ttftS`               | first user turn → first model token      | `result.ttft_ms` from trace `stdout.raw`                              |
   | `apiS`                | sum of provider HTTP request elapsed     | `result.duration_api_ms` from trace `stdout.raw`                      |
   | `claudeSessionS`      | Claude CLI session wall time             | `result.duration_ms` from trace `stdout.raw`                          |
   | `workerWallS`         | process spawn → process exit             | `worker_process_summary.elapsedMs`                                    |
   | `frameworkPostflightS`| process exit → closure decision admitted | `sdlc_edge_closure_decision.json.admittedAt` (typed field) − (processStartedAt + elapsedMs); falls back to file mtime with `phase_timing_imprecise` diagnostic when the typed field is absent |
   | `opRunCloseS`         | closure admit → op-run final mtime       | latest mtime in op-run dir − closure admit ts                         |
   | `idleToNextS`         | this op-run close → next op-run open     | next attempt's `t0` − this op-run final mtime (last attempt: `n/a`)   |

   Derived per-row totals (read-only):

   - `frameworkS` = `frameworkPrebootS + frameworkPostflightS + opRunCloseS`
   - `unattributedS` = `workerWallS − ptyStartupS − apiS` (slack inside
     the worker process between API requests and stdout drain;
     reported as `n/a` if `ptyStartupS` or `apiS` is missing).
   - `attemptWallS` = `frameworkPrebootS + workerWallS + frameworkPostflightS + opRunCloseS`

   When any source carrier is absent for an attempt, that phase
   renders as `n/a` with a single typed diagnostic
   (`phase_timing_unavailable`, scoped to attempt + phase). The
   analyzer must never substitute another column's value or a
   wall-clock subtraction.

3. **Fixed-cost roll-up** — aggregate the per-attempt phase
   decomposition into a single block answering: "what does each attempt
   cost regardless of task complexity?"

   - Mean / median / max / sum, across attempts in this edge, for each
     phase column above.
   - **`fixedCostPerAttemptS`** — sum of mean `frameworkPrebootS`,
     mean `ptyStartupS`, mean `frameworkPostflightS`, and mean
     `opRunCloseS`. This is the "what would we save per warm attempt"
     headline number.
   - **`amortizedSavingsIfWarmS`** — `fixedCostPerAttemptS × (iters − 1)`.
     The hypothetical saving if every attempt after the first reused a
     warm session and bypassed framework preboot + PTY startup. Tagged
     `hypothetical`; never published as authority.
   - Coefficient-of-variation per phase (stddev / mean) — high CoV
     means the cost is not actually fixed and warm-session savings
     would be uneven.

4. **Inter-attempt gap log** — for each transition between attempts:
   `attempt N close → attempt N+1 open = <idleToNextS>s`. This is the
   same number as `idleToNextS` row-wise, surfaced as a contiguous
   timeline so the slack is visible in shape, not just totals.

The summary view does not stream raw stdout, prompt text, event logs,
or any component file. Component rendering is `edge-full`'s job. The
summary view's job is the time breakdown.

#### `edge-full` View

Component-selectable. CLI:

```
analyze-run --view edge-full --edge <name>
            [--components <list>]   # optional
            [--bundles <list>]      # optional
            [--attempt <selector>]  # default: all
            [--no-size-cap]
            [--output <path>]
```

Selection rules:

- `--components` and `--bundles` are independent. The rendered
  selection is the **union** of both flags' resolved labels.
- **Default selection:** when neither `--components` nor `--bundles`
  is supplied, behavior is `--bundles all` (every label in the
  component registry, in declaration order). There is no implicit
  `--components all`; `all` lives only in the bundle registry.
- `--components <list>` accepts only labels from the component
  registry; unknown labels exit non-zero and print the registry.
- `--bundles <list>` accepts only bundle names from the bundle
  registry; unknown bundles exit non-zero and print the registry.
- `--attempt` defaults to `all`. Accepts a 0-based attempt index, a
  range (`0-3`), a comma list (`0,4,7`), or `all`.

Rendering rules:

- Each rendered component is preceded by a `## <label> — attempt <N>`
  heading and shows the source file path(s).
- **JSON files** render pretty-printed under one code block per file.
- **NDJSON files** (`worker_process_events.jsonl`, `events.ndjson`,
  `stdout.raw` when treated as stream-json) render with each line as
  a separate pretty-printed JSON object under a sub-heading
  `### line N`. Lines are not joined into a single document; the
  per-line structure is preserved so the operator can correlate by
  line offset. A header above the run reports total line count and
  byte count.
- **Markdown files** (`worker_prompt.md`, `postmortem.md`,
  `run_compact.txt`) render verbatim.
- **Text logs** (`worker_stdout.log`, `worker_stderr.log`,
  `terminal.transcript`) render verbatim under a fenced code block
  with line/byte counts in the header.
- **Binary or undecidable files** (none in the current registry, but
  reserved): render with `(binary, <bytes> bytes, sha256=<digest>)`,
  no content.

Size cap:

- Per-invocation rendered-byte cap, default 25 MiB. If the resolved
  selection's rendered byte total would exceed the cap, the analyzer
  exits non-zero with `edge_full_size_cap_exceeded` and prints the
  per-component byte breakdown. The cap is computed before rendering;
  there is no silent truncation.
- `--no-size-cap` opts out; the cap is then `Infinity` and rendering
  proceeds. The opt-out is reflected in `sizeReport.capBytes: null`
  and `sizeReport.capDisabled: true`.

Output:

- The full view writes to stdout by default. `--output <path>` writes a
  single concatenated markdown document outside the inspected root, per
  the consolidated View System Law `--output` rule.

#### JSON Output Shape (both views)

`edge-summary`:

```json
{
  "view": {
    "kind": "edge_summary_view",
    "name": "edge-summary",
    "edge": "...",
    "edgeRef": "view://odd-sdlc/analysis/<scopeDigest>/edge-aggregate/<edge_name>",
    "header": { "iters": 0, "wallS": 0, "llmS": null, "slack": 0,
                "retries": 0, "blocks": 0, "final": "close",
                "costUsd": null, "turns": 0,
                "firstAttemptStart": "...", "lastAttemptEnd": "..." },
    "attempts": [
      {
        "index": 0,
        "operatorRunRef": "...",
        "startedAt": "...",
        "phases": {
          "t0": "...",
          "frameworkPrebootS": 0,
          "ptyStartupS": 0,
          "ttftS": null,
          "apiS": null,
          "claudeSessionS": null,
          "workerWallS": 0,
          "frameworkPostflightS": 0,
          "opRunCloseS": 0,
          "idleToNextS": null
        },
        "derived": {
          "frameworkS": 0,
          "unattributedS": null,
          "attemptWallS": 0
        },
        "phaseAvailability": {
          "frameworkPrebootS": "admitted|n/a",
          "ptyStartupS": "admitted|n/a",
          "ttftS": "admitted|n/a",
          "apiS": "admitted|n/a",
          "frameworkPostflightS": "admitted|n/a|imprecise_mtime_fallback",
          "opRunCloseS": "admitted|n/a|imprecise_mtime_fallback"
        }
      }
    ],
    "fixedCostRollup": {
      "perPhase": {
        "frameworkPrebootS":     { "mean": 0, "median": 0, "max": 0, "sum": 0, "cov": 0 },
        "ptyStartupS":           { "mean": 0, "median": 0, "max": 0, "sum": 0, "cov": 0 },
        "ttftS":                 { "mean": 0, "median": 0, "max": 0, "sum": 0, "cov": 0 },
        "apiS":                  { "mean": 0, "median": 0, "max": 0, "sum": 0, "cov": 0 },
        "frameworkPostflightS":  { "mean": 0, "median": 0, "max": 0, "sum": 0, "cov": 0 },
        "opRunCloseS":           { "mean": 0, "median": 0, "max": 0, "sum": 0, "cov": 0 }
      },
      "fixedCostPerAttemptS": 0,
      "amortizedSavingsIfWarmS": { "value": 0, "tag": "hypothetical" }
    },
    "interAttemptGaps": [
      { "betweenAttempts": [0, 1], "idleS": 0 }
    ]
  }
}
```

Notes on the `edge-summary` JSON shape:

- `attempts[].phases` carries one numeric (or null) field per phase
  column from the spec table. Nothing is computed by wall-clock
  subtraction; a missing source carrier means the value is `null` and
  the corresponding `phaseAvailability` field records the reason.
- `attempts[].derived` carries the three derived totals
  (`frameworkS`, `unattributedS`, `attemptWallS`). Any derived total
  whose inputs include a `null` phase is itself `null`.
- `fixedCostRollup.perPhase` aggregates each phase across attempts.
  `cov` is coefficient of variation (`stddev / mean`); `null` when
  `mean` is zero or only one attempt contributed.
- `amortizedSavingsIfWarmS.tag` must be the literal string
  `"hypothetical"`. Downstream consumers must not strip the tag (see
  non-closure conditions).

`edge-full`:

```json
{
  "view": {
    "kind": "edge_full_view",
    "name": "edge-full",
    "edge": "...",
    "edgeRef": "view://odd-sdlc/analysis/<scopeDigest>/edge-aggregate/<edge_name>",
    "selection": {
      "bundles":     ["all"],
      "components":  [],
      "resolvedLabels": [
        "traversal-intent", "handoff", "prompt", "conversation",
        "events", "pty", "process", "liveness", "result-report",
        "fp-evaluate", "post-transform-observation", "ledgers",
        "gain-residual", "closure-decision", "postflight", "overlays",
        "product", "worksite-evidence", "hook-outcome",
        "constructor-result", "conformed-project", "operator-run"
      ],
      "attempts":    "all"
    },
    "attempts": [
      {
        "index": 0,
        "operatorRunRef": "...",
        "components": {
          "traversal-intent": {
            "files": [
              { "ref": "...", "bytes": 0, "kind": "json", "content": { /* parsed */ } }
            ]
          },
          "prompt": {
            "files": [
              { "ref": "...", "bytes": 0, "kind": "markdown", "content": "..." }
            ]
          },
          "conversation": {
            "files": [
              { "ref": "...", "bytes": 0, "kind": "ndjson", "lineCount": 0,
                "lines": [ { "lineNumber": 1, "content": { /* parsed line */ } } ] }
            ]
          },
          "events": {
            "files": [
              { "ref": "...", "bytes": 0, "kind": "ndjson", "lineCount": 0,
                "lines": [ { "lineNumber": 1, "content": { /* parsed line */ } } ] }
            ]
          },
          "pty": {
            "files": [
              { "ref": "...", "bytes": 0, "kind": "text", "lineCount": 0, "content": "..." }
            ]
          }
          // ... other resolved labels follow with kind ∈ {json, ndjson, markdown, text, binary, missing}
        }
      }
    ],
    "sizeReport": {
      "requestedBytes": 0,
      "renderedBytes":  0,
      "capBytes":       26214400,
      "capExceeded":    false,
      "capDisabled":    false,
      "perComponentBytes": {
        "traversal-intent": 0,
        "conversation":     0
      }
    }
  }
}
```

JSON shape notes:

- `selection.resolvedLabels` is the final union of `bundles` + `components`
  after registry expansion, with duplicates removed. This is the
  ground-truth list of what was rendered; downstream consumers should
  read this rather than re-deriving from `bundles`/`components`.
- Each `components.<label>.files[]` entry carries a `kind`
  discriminator: `json`, `ndjson`, `markdown`, `text`, `binary`, or
  `missing`. `ndjson` entries use a `lines[]` array of structured
  objects; `text` entries use a single `content` string.
- A component whose source file is absent for the attempt renders as
  `{ "files": [{ "ref": "...", "kind": "missing", "reason": "..." }] }`,
  not omitted. The corresponding markdown renders `(missing)`.
- Components **not** in `selection.resolvedLabels` are omitted from the
  JSON entirely (not rendered as null).

#### `edge-prompts` View — Complete Prompt and Conversation Dump

Purpose: dump every prompt and every conversation turn for an edge, in
order, across all (or selected) attempts. Used for prompt audit, model
behavior review, leak-of-context analysis, and prompt-engineering
iteration.

CLI:

```
analyze-run --view edge-prompts --edge <name>
            [--attempt <index|range|list|all>]   # default: all
            [--include framework|conversation|both]
                                                  # default: both
            [--turn-format markdown|raw-json]    # default: markdown
            [--redact-tool-results]              # default: off
            [--output <path>]
```

Behavior:

- For each selected attempt, render two sections in order:
  1. **Framework prompt** (`prompt` component) — the
     `worker_prompt.md` content verbatim. Headed
     `## Attempt N — Framework Prompt` with file path.
  2. **Conversation** (`conversation` component) — every
     stream-json event from the trace `events.ndjson` (preferred) or
     `stdout.raw` (fallback) of type `system`, `user`, or `assistant`,
     rendered in order. Each turn gets a heading
     `### Turn K — <role>` and includes:
     - text content blocks rendered as markdown
     - `tool_use` blocks rendered as
       ` ```tool_use:<name>\n<pretty-printed input>\n``` `
     - `tool_result` blocks rendered as
       ` ```tool_result:<tool_use_id>\n<content>\n``` ` —
       truncated only if `--redact-tool-results` is set, in which case
       the content is replaced with `[redacted: <byteCount> bytes,
       digest=<sha256>]`. Without the flag, content renders verbatim.
- `--include framework` skips conversation; `--include conversation`
  skips the framework prompt; `--include both` (default) renders both.
- `--turn-format raw-json` affects **markdown rendering only**: it
  emits each stream-json event verbatim on its own line under a code
  block per attempt instead of the formatted turn-by-turn rendering.
  The JSON envelope's `attempts[].conversation` array is always
  structured (turn objects with `index`, `role`, `content`,
  `toolUses`, `toolResults`); `--turn-format` does not change its
  shape. Useful when the analyzer is feeding the markdown output to
  another tool.
- The 25 MiB size cap from `edge-full` applies. Conversations can be
  large; the analyzer prints a `sizeReport` block and fails fast on
  cap-exceeded with the per-attempt byte breakdown. `--no-size-cap`
  opts out, same rules as `edge-full`.
- `--output <path>` writes a single concatenated markdown document
  outside the inspected root.
- JSON envelope mirrors the markdown structure under
  `view.kind = "edge_prompts_view"`, with `attempts[].framework`
  (string content + path) and `attempts[].conversation` (an array of
  rendered turns with `index`, `role`, `content`, `toolUses`,
  `toolResults`, and the raw event ref for traceability).

Diagnostics:

- `conversation_source_missing` (warn) — neither `events.ndjson` nor
  `stdout.raw` available for an attempt; the framework prompt still
  renders if present.
- `conversation_malformed_stream` (warn) — a stream-json line failed
  to parse; the analyzer skips that line, emits the diagnostic with
  the byte offset, and continues. Never silently drops without the
  diagnostic.
- `prompt_source_missing` (warn) — `worker_prompt.md` absent; the
  conversation still renders if present.

The `edge-prompts` view is fully F_D and deterministic. It does not
adopt `--follow`; that surface stays quarantined to `edge-tail`.

**Relationship to `edge-full --bundles prompts`.** `edge-prompts` is
the focused, render-tuned view; `edge-full --bundles prompts` is the
generic component dump that includes the same two labels (`prompt`,
`conversation`). The underlying **content reconstruction** is shared
and byte-identical between the two access paths (AC-32 guarantees
this for the `conversation` label). The **rendering options** —
`--include`, `--turn-format`, `--redact-tool-results` — are
edge-prompts-specific and not valid on `edge-full`. In short:
`edge-prompts` = `edge-full --bundles prompts` + rendering knobs
specific to prompt audit.

#### `edge-tail` View — Live PTY Tail

Purpose: `tail -f`-equivalent over an edge's PTY/output streams. Used
during a live run to watch what the active attempt is doing, or after
the fact to read the last N lines of a completed attempt without
materializing the full file through `edge-full`.

CLI:

```
analyze-run --view edge-tail --edge <name>
            [--tail <N>]               # default: 100
            [--follow | -f]            # default: off
            [--source stdout|stderr|terminal|claude-stream]
                                       # default: stdout
            [--attempt <index|latest>] # default: latest
```

Source mapping:

| `--source`       | file                                                          |
| ---------------- | ------------------------------------------------------------- |
| `stdout`         | `<op-run>/worker_stdout.log`                                  |
| `stderr`         | `<op-run>/worker_stderr.log`                                  |
| `terminal`       | `<op-run>/worker_process_events.jsonl.trace/terminal.transcript` |
| `claude-stream`  | `<op-run>/worker_process_events.jsonl.trace/stdout.raw`       |

Behavior:

- Without `--follow`: read the file's current state, print the last
  `--tail N` lines (or fewer if the file has fewer lines), exit 0. This
  mode is still F_D and deterministic: same file contents in →
  same output out.
- With `--follow`: print the last `--tail N` lines, then watch the file
  with kqueue/fsevents (or stat-poll fallback) and stream appended
  lines until SIGINT or until the file becomes terminal (worker
  process exits AND closure decision is admitted). When the watched
  attempt completes and `--attempt latest` was selected against a live
  run, the view rolls over to the next attempt's file when one opens;
  it prints a single divider line `--- attempt N+1 (<edge>) ---` and
  continues. With an explicit `--attempt <index>`, no rollover; the
  view exits when that attempt's file becomes terminal.
- `--follow` produces streaming markdown only. No JSON output (the
  view envelope is incompatible with streaming). The shell exit code
  is 0 on clean termination, non-zero on file disappearance or read
  error.
- `--follow` is the **only view mode in this analyzer that may produce
  non-deterministic output**. It is explicitly opt-in. Without
  `--follow`, the view is F_D, deterministic, and integrates with the
  rest of the analyzer envelope.
- The `claude-stream` source ignores `--tail` line-count semantics and
  instead tails the last `N` newline-delimited stream-json events
  (each `{"type":"assistant"|"user"|"system"|"result", ...}` line).
  Mixed text and JSON sources both tail by line; the per-source
  parsing affects only how lines are interpreted in headers.
- `--tail` accepts `all` to print the entire current file content
  before following (or in one shot when `--follow` is off). Useful
  with `claude-stream` for short sessions.
- **Cap behavior:** the 25 MiB cap from `edge-full` applies to the
  pre-follow initial-tail portion only. If the requested initial tail
  exceeds the cap, the analyzer exits non-zero with
  `edge_full_size_cap_exceeded` *before* entering follow mode.
  Streaming after the initial tail is uncapped by design — `--follow`
  is meant for live observation, not bulk extraction. `--no-size-cap`
  opts the initial-tail portion out of the cap (same semantics as
  `edge-full`).
- No write modes. No `--output` flag (streaming output is to stdout
  only) — `edge-tail` is the lone view exempt from the View System
  Law `--output` rule.

Diagnostics:

- `live_follow_active` (info) — emitted once when `--follow` is on, so
  any downstream consumer can tell the output is non-deterministic.
- `tail_source_missing` (error) — selected source file does not exist
  for the resolved attempt; print the available sources and exit
  non-zero.
- `tail_attempt_rollover` (info) — emitted when `--follow` with
  `--attempt latest` switches to the next attempt's file.

### Future Drill-Down Views (registered, not yet specified)

Placeholders only — each becomes its own addendum or sub-ticket before
implementation:

- `attempt` — drill into one operator-run by ref; event stream timing,
  prompt segments, postflight breakdown. Refines `edge-full --attempt N`
  with per-event timing and segment classification.
- `provider-requests` — flat table of every provider request across the
  scope with `modelRef`, `elapsedMs`, `tokensIn`, `tokensOut`,
  attempt ref. Required when the upstream `actor_request_completed`
  event lands.

These are listed only to constrain the view-name registry and the addressing
contract; their column sets and JSON shapes are deferred.

### Consolidated Diagnostic Registry

The full set of diagnostics the analyzer emits, across all views. This
table is the authoritative registry; per-view sections may reference
diagnostics but must not introduce new codes without adding them here.
Severity levels: `info`, `warn`, `error`. `info` diagnostics never fail
a strict-profile lint; `warn` and `error` may, subject to the profile's
ratified threshold policy.

| code                                          | severity | scope          | trigger                                                                                  |
| --------------------------------------------- | -------- | -------------- | ---------------------------------------------------------------------------------------- |
| `retry_observed`                              | warn     | edge           | one or more same-edge retries observed                                                   |
| `repair_observed`                             | warn     | edge           | one or more repair attempts observed                                                     |
| `blocked_attempt_observed`                    | warn     | attempt        | a single attempt ended in `block`                                                        |
| `aborted_run_observed`                        | warn     | attempt        | an attempt has no postflight and no `worker_run.json`                                    |
| `worker_authority_read_outside_workspace_observed` | warn | attempt        | tool calls referenced paths outside the workspace root                                   |
| `prompt_context_volume_high`                  | info     | edge / scope   | prompt + context bytes exceeded the threshold policy                                     |
| `handoff_growth_suspicious`                   | info     | edge           | handoff bytes grew superlinearly across retry attempts                                   |
| `event_snapshot_volume_high`                  | info     | edge / scope   | event bytes per edge exceeded threshold policy                                           |
| `requirement_fanout_suspicious`               | info     | scope          | canonical requirement obligations fan out beyond threshold                               |
| `product_lineage_missing`                     | warn     | scope          | product file lacks canonical requirement lineage                                         |
| `product_lineage_fanout_suspicious`           | info     | scope          | product file lineage refs fan out beyond threshold                                       |
| `runtime_artifact_missing`                    | warn     | attempt        | an expected runtime carrier file is absent                                               |
| `runtime_artifact_malformed`                  | warn     | attempt        | a runtime carrier file failed JSON parse / schema check                                  |
| `edge_sequence_incomplete`                    | warn     | scope          | gap in the operator-run sequence (missing timestamps / refs)                             |
| `phase_timing_unavailable`                    | warn     | attempt-phase  | a source carrier needed for an `edge-summary` phase was absent                           |
| `phase_timing_imprecise`                      | info     | attempt-phase  | a phase fell back to mtime because the typed `admittedAt` field was absent               |
| `unattributed_time_high`                      | info     | scope          | summed worker time is a small fraction of total wall-clock                               |
| `active_run_stalled_no_io`                    | warn     | active edge    | heartbeat aged out, no stdout/event growth in window                                     |
| `active_run_stalled_with_io`                  | info     | active edge    | I/O present but no event advance                                                         |
| `worker_heartbeat_age_high`                   | warn     | active edge    | last heartbeat older than the policy threshold                                           |
| `archive_growth_zero_during_active_edge`      | warn     | active edge    | active op-run directory has zero byte growth in the sample window                        |
| `summary_source_drift`                        | warn     | scope          | a `run_performance_summary` field disagrees with raw-carrier recompute beyond tolerance  |
| `provider_elapsed_unavailable`                | warn     | attempt        | trace `result.duration_api_ms` is absent or unparseable                                  |
| `llm_exceeds_worker_elapsed`                  | info     | attempt / edge | `llmS > workerS` due to overlapping concurrent provider requests; expected, not a bug    |
| `edge_full_size_cap_exceeded`                 | error    | invocation     | rendered byte total for the selection exceeds the 25 MiB cap (or `--no-size-cap` cap)    |
| `live_follow_active`                          | info     | invocation     | `edge-tail --follow` is active; output is non-deterministic from this point              |
| `tail_source_missing`                         | error    | invocation     | `edge-tail` resolved source file does not exist for the resolved attempt                 |
| `tail_attempt_rollover`                       | info     | invocation     | `edge-tail --follow --attempt latest` switched to the next attempt's file                |
| `conversation_source_missing`                 | warn     | attempt        | neither `events.ndjson` nor `stdout.raw` available for an attempt                        |
| `conversation_malformed_stream`               | warn     | attempt + line | a stream-json line in the conversation source failed to parse; byte offset reported      |
| `prompt_source_missing`                       | warn     | attempt        | `worker_prompt.md` absent for an attempt                                                 |

Diagnostics are read-only findings. The analyzer **must** emit every
applicable diagnostic at its declared severity; downstream code must
not silently drop or downgrade them. New diagnostic codes require an
addendum that adds a row to this table.

### New Acceptance Criteria

17. `analyze-run --view edge-aggregate` renders the aggregate-per-edge table
    described above with the columns `edge | iters | wallS | llmS | slack |
    retries | blocks | final` (plus optional `turns`, `ttftS`, `tokensIn`,
    `tokensOut`, `cacheReadTokens`, `costUsd` when contributing attempts
    carry them), ordered by first-observed attempt time, both in markdown
    and in JSON under `view.kind = "edge_aggregate_view"`. `wallS` is the
    edge span (`lastAttemptEnd − firstAttemptStart`), not the sum of
    attempt windows. `workerS` is not in this view.

18. When provider request elapsed is not present in admitted carriers, the
    `edge-aggregate` view renders `llmS` as `n/a` and emits exactly one
    `provider_elapsed_unavailable` diagnostic for the scope. The remaining
    columns are populated.

19. `analyze-run --view <unknown>` exits non-zero and prints the known view
    registry. There is no silent fallback to `summary`.

20. Default invocation (`analyze-run` with no `--view` flag) is structurally
    equivalent to `analyze-run --view summary` — the existing default output
    does not regress.

21. Each `edge-aggregate` row carries a stable `viewRef` of the form
    `view://odd-sdlc/analysis/<scopeDigest>/edge-aggregate/<edge_name>`.
    Unit tests assert `viewRef` stability across two runs of the analyzer
    on the same archive (same `scopeDigest`) and `viewRef` differentiation
    across two distinct archives (different `scopeDigest`) even when the
    edge name is identical.

22. `analyze-run --view edge-summary --edge <name>` renders the
    fixed-cost time-accounting view defined above: header, per-attempt
    phase decomposition (`frameworkPrebootS`, `ptyStartupS`, `ttftS`,
    `apiS`, `workerWallS`, `frameworkPostflightS`, `opRunCloseS`,
    `idleToNextS`), the fixed-cost roll-up
    (`fixedCostPerAttemptS`, `amortizedSavingsIfWarmS`,
    coefficient-of-variation per phase), and the inter-attempt gap
    log. Both markdown and JSON outputs are produced. Missing source
    carriers render the affected phase as `n/a` with one
    `phase_timing_unavailable` diagnostic per attempt-phase; no phase
    may be inferred by wall-clock subtraction.

23. `analyze-run --view edge-full --edge <name>` defaults to
    `--bundles all --attempt all` and renders every label in the
    component registry, per attempt, in registry declaration order.
    Each component is preceded by its label heading and file path(s).
    Missing source files render as `(missing)`, not silently omitted.

24. `--components <list>` and `--bundles <list>` accept only labels /
    bundles from the published registries; unknown values exit non-zero
    and print the relevant registry. The rendered selection is the
    union when both flags are supplied. `--attempt <selector>` accepts
    a single index, a range, a comma list, or `all`; out-of-range
    selectors fail with the attempt count.

25. The `edge-full` view emits a `sizeReport` block with
    `requestedBytes`, `renderedBytes`, `capBytes`, `capExceeded`. When
    `capExceeded` is true and `--no-size-cap` was not supplied, the
    command exits non-zero with `edge_full_size_cap_exceeded` and the
    per-component byte breakdown. No silent truncation.

26. `edge-summary`, `edge-full`, and `edge-tail` accept either
    `--edge <name>` or `--edge-ref <viewRef>`; supplying both, or
    neither, fails. The `viewRef` form must resolve to a known
    `edge-aggregate` row in the inspected scope.

27. `analyze-run --view edge-tail --edge <name>` without `--follow`
    prints the last `--tail N` lines (default 100) of the resolved
    source file (default `stdout`) for the resolved attempt (default
    `latest`), exits 0, and produces deterministic output for a given
    file state. JSON output is suppressed only when `--follow` is on;
    without `--follow` the envelope is the same shape as other views.

28. `analyze-run --view edge-tail --edge <name> --follow` streams
    appended lines after the initial tail, emits one
    `live_follow_active` info diagnostic at start, rolls over to the
    next attempt's file (with a `tail_attempt_rollover` info
    diagnostic) when `--attempt latest` is in effect and a new
    attempt opens, exits 0 on clean SIGINT, and exits non-zero on
    file disappearance or unrecoverable read error. The view is the
    sole non-deterministic output surface in the analyzer; this is
    explicit in the rendered header.

29. `--source stdout|stderr|terminal|claude-stream` resolves to the
    canonical file mapping in the registry above; an unknown source
    fails non-zero. A missing resolved file emits
    `tail_source_missing` and exits non-zero with the available
    sources for the resolved attempt.

30. `analyze-run --view edge-prompts --edge <name>` defaults to
    `--include both --attempt all --turn-format markdown` and renders,
    per attempt: the verbatim framework prompt (`worker_prompt.md`)
    followed by the full conversation (every `system` / `user` /
    `assistant` stream-json turn from `events.ndjson` or
    `stdout.raw`), including text content, `tool_use` blocks, and
    `tool_result` blocks. Both markdown and JSON outputs are
    produced under `view.kind = "edge_prompts_view"`. The 25 MiB size
    cap from `edge-full` applies; cap-exceeded fails fast with the
    per-attempt byte breakdown.

31. `--include framework|conversation|both` selects which sections
    render; `--turn-format markdown|raw-json` switches between
    formatted turn rendering and verbatim stream-json events;
    `--redact-tool-results` replaces tool_result content with a
    digest+byte-count placeholder. Absent the redact flag, tool
    results render verbatim.

32. The `conversation` component label resolves to the same
    reconstructed turn-by-turn transcript whether selected through
    `edge-full --components conversation`, `edge-full --bundles
    prompts`, `edge-full --bundles io`, or `edge-prompts`. Stream
    parse failures emit `conversation_malformed_stream` (warn) with
    byte offset and the line is skipped; never silently dropped.

33. **`viewRef` drill-down round-trip.** A `viewRef` extracted from a
    JSON output of `analyze-run --view edge-aggregate` (e.g. via
    `jq '.view.rows[0].viewRef'`) can be passed verbatim to a
    subsequent `analyze-run --view edge-summary --edge-ref <viewRef>`
    or `analyze-run --view edge-full --edge-ref <viewRef>` invocation
    against the same `--run-archive` and produces the corresponding
    edge view. A `viewRef` from one inspected root is rejected with
    exit non-zero when passed against a different inspected root
    (different `scopeDigest`); the analyzer must not silently
    misresolve. Unit tests cover both the round-trip and the
    cross-archive rejection.

34. **At-most-once carrier parsing.** Within a single `analyze-run`
    invocation, each operator-run source file in the registry
    (`events.ndjson`, `stdout.raw`, `worker_process_events.jsonl`,
    `worker_stdout.log`, `worker_stderr.log`, every JSON manifest)
    is read from disk and parsed at most once even when multiple
    views or multiple components consume it. Unit tests assert this
    by spying on the filesystem reader and confirming the read count
    per file equals 1 under `--view edge-full --bundles all` (which
    triggers every component path).

35. **Retry forensics cause classification — `target_carrier_admission_missing`.**
    For any blocked attempt where `postflight.status == "passed"` and
    `postflight.blockingReasons` is empty **and** the fulfillment
    ledger or residual pressure reports
    `targetCarrierAdmissionStatus == "missing"` (or carries a
    `pressure://odd-sdlc/target-carrier/.../missing_admission`
    requiredPressureRef), retry forensics must classify the attempt as
    `target_carrier_admission_missing`. Misclassification as
    `deterministic_evaluator_bug` is a defect — that class is reserved
    for attempts where postflight itself rejected (non-passing status
    or non-empty blocking reasons). Unit tests cover both classes
    against fixtures derived from the T-132 retry-heavy archive (which
    contains attempts that block on F_D evaluation) and the active
    T-132 archive's `qualify_component_test_execution_surface` first
    attempt (which blocks on missing target-carrier admission while
    postflight is clean).

### New Non-Closure Conditions

- analyzer fabricates `llmS` from worker elapsed, deterministic elapsed, or
  wall-clock when provider request elapsed is unavailable
- `--view <unknown>` silently falls back to the default view
- view system allows a view's output to be consumed as routing/closure
  authority anywhere in `start` / `dispatch` / closure code paths
- drill-down view consumes a `viewRef` as authority for traversal advancement
- any new view requires a new authoritative carrier in the operator-run
  archive without a paired upstream admission ticket
- `edge-full --components <list>` silently expands to include labels
  outside the published registry, or silently drops unknown labels
- `edge-full --bundles <list>` silently expands to include unpublished
  bundles, or silently drops unknown bundles
- `edge-summary` or `edge-full` silently skip a missing component source
  file without rendering `(missing)` or emitting a diagnostic
- `edge-full` silently truncates rendered content past the size cap
  instead of failing with `edge_full_size_cap_exceeded`
- `edge-summary`, `edge-full`, or `edge-tail` resolve a non-existent
  edge name to a fuzzy or partial match instead of failing with the
  present-edge registry
- `edge-summary` infers a missing time phase by subtracting other
  phases from wall-clock instead of rendering `n/a` and emitting
  `phase_timing_unavailable`
- `edge-summary` publishes `amortizedSavingsIfWarmS` without the
  `hypothetical` tag, or any downstream surface consumes it as
  routing/closure authority
- `edge-tail` without `--follow` produces non-deterministic output for
  a given file state (e.g. by silently buffering live appends during
  the read), violating the one-shot F_D guarantee
- `edge-tail --follow` runs without emitting the `live_follow_active`
  info diagnostic, hiding the fact that the output is non-deterministic
- `edge-tail --follow` produces JSON output, or any other view in the
  analyzer adopts the `--follow` flag and becomes non-deterministic
- `edge-tail --follow` continues after worker process exit AND closure
  decision admission for the watched attempt when `--attempt <index>`
  was explicit, instead of exiting cleanly when the attempt becomes
  terminal
- `edge-tail` writes to any file path under the inspected workspace or
  run archive, or accepts `--output` (streaming output is stdout-only)
- `edge-prompts` or the `conversation` component silently drops a
  malformed stream-json line without emitting
  `conversation_malformed_stream` and the byte offset
- `edge-prompts --redact-tool-results` redacts text content blocks or
  assistant output, not just `tool_result` blocks; the redact scope
  must be exactly tool results
- `edge-prompts` writes the conversation transcript back into the
  inspected workspace or run archive; output goes only to stdout or
  to a path supplied via `--output` outside the inspected root
- the `conversation` component renders different content depending on
  which view or bundle selected it; the reconstruction must be the
  same transcript regardless of selection path
- retry forensics classifies an attempt as `deterministic_evaluator_bug`
  when postflight passed and the block was caused by
  `targetCarrierAdmissionStatus == "missing"` (T-133 enforcement); the
  correct class is `target_carrier_admission_missing` per the
  classifier rules in §7
- retry forensics treats `deterministic_evaluator_bug` as a catch-all
  for any block with no other obvious cause; the class is reserved for
  attempts where postflight itself rejected, and falls through to
  `unknown` otherwise
