---
id: T-161
title: Read-only F_D run analysis linter
type: feature
ticket_category: fd_run_analysis_linter
status: backlog
goal: deterministic-read-only-runtime-analysis-without-new-closure-authority
build_tenant: typescript
owner: odd_sdlc
change_intent: Add a deterministic read-only F_D analysis command over existing workspaces and run archives that emits current-state telemetry, gap analysis, and diagnostics for performance, bloat, retry, and runtime-shape triage without advancing traversal or creating closure authority.
change_class: design_reframe
re_entry_point: design
priority: high
triaged_at: 2026-05-12
created_at: 2026-05-12
updated_at: 2026-05-12
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
  - .ai-workspace/tickets/active/T-158-replay-product-materialization-manifest-across-repair-attempts.md
  - .ai-workspace/tickets/active/T-159-product-assets-carry-requirement-lineage.md
  - .ai-workspace/tickets/backlog/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
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
affected_boundary:
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/shared/blocking_reason.ts
  - build_tenants/typescript/test_env/tests/
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

### 3. Gap Analysis

Report missing or incomplete runtime structure:

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

### 4. Diagnostics

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
- `unattributed_time_high`.

Diagnostics are read-only findings. They may fail the linter command under a
strict profile, but they do not alter closure or traversal state.

### 5. Bloat And Slope Analysis

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

### 6. Retry Forensics

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
  - deterministic_evaluator_bug;
  - harness_bug;
  - runtime_bug;
  - tenant_source_defect;
  - unknown.

The analyzer should not claim semantic root cause. It should report evidence and
classify obvious structural signals.

## Profiles

Profiles are optional rule bundles. First candidates:

- `hello_world`: strict low-complexity baseline.
- `data_mapper`: scale baseline focused on slope, not absolute time.
- `generic`: structural lint only.

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
  "readOnly": true,
  "currentStateTelemetrySummary": {},
  "edgeTraversal": [],
  "gapAnalysis": [],
  "diagnostics": [],
  "bloatAndSlopeAnalysis": {},
  "retryForensics": [],
  "evidenceIndex": []
}
```

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

4. JSON output includes current-state telemetry summary, edge traversal, gap
   analysis, diagnostics, bloat/slope analysis, retry forensics, and evidence
   index sections.

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
`edge_performance_summary.json` artifacts. The analyzer should prefer those when
present but remain able to analyze older archives by reconstruction.
