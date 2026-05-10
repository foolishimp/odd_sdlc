# Full External Data Mapper Live Sandbox Forensic Log

Status: exploratory live hardening log
Agent: codex
Run archive: `build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260510T171412025Z_pid93995`
Sandbox workspace: `build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260510T171412025Z_pid93995/workspace`
Source template: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template`
Worker: `process://claude?model=sonnet&effort=xhigh`

## Purpose

Run the external `data_mapper.template` as a full live odd_sdlc sandbox using the latest local odd_sdlc install, not a test-framework-only fixture. The run was used to expose framework bugs, patch generic defects, and record follow-up ticket candidates.

## Actual Edge Walk

1. `Fg_conform_project`
   - Installed command completed deterministic project conformance.
   - Runtime archive: `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260510T171414625Z_pid94147`.

2. `Fg_conform_project_authority`
   - Live F_P worker invoked.
   - Runtime archive: `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260510T171416751Z_pid94184`.
   - Closure decision: `close`.
   - Worker stdout: 2,027,045 bytes.
   - Output artifact: `.ai-workspace/runtime/odd_sdlc/assets/20260510T171416751Z_pid94184/project_bootstrap_surface.md` (15,950 bytes).
   - Wall time from command wrapper: 1,126 seconds.
   - Observation: launch prompt was compact (2.9 KB), but the worker emitted a large tool/result stream while conforming the full imported authority set.

3. `Fg_materialize_declared_product_asset`
   - Live F_P worker invoked from the lineage-selected materialization edge.
   - Runtime archive: `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260510T173301846Z_pid51903`.
   - Closure decision: `close`.
   - Worker stdout: 840,525 bytes.
   - Output artifact: `build_tenants/scala_spark/design/component_code_surface.md` (31,548 bytes).
   - Wall time from command wrapper: 675 seconds.
   - Product materialization emitted 32 files under `build_tenants/scala_spark`, including `build.sbt`, `project/build.properties`, source files, and test files across the `cdme-*` modules.

## Bugs Found And Patched

### 1. Live sandbox runner forced legacy bootstrap target

Symptom: after `gaps` reported `Fg_conform_project_authority`, the new deterministic runner invoked `start --target graph_function:bootstrap_release_self_test`, causing the run to enter the old broad bootstrap graph.

Fix: `build_tenants/typescript/test_env/live/run_full_external_data_mapper_sandbox.mjs` now uses `start --target next --until first_traversal --worker ...` after deterministic project conformance.

Status: patched.

### 2. Public gaps accepted stale archived selected action without replay proof

Symptom: after `Fg_materialize_declared_product_asset` closed, `gaps` still reported `currentEdge: Fg_materialize_declared_product_asset`. The live runner repeated converged starts until `MAX_STEPS`.

Root cause: `startOutcomeForObservedReplay` accepted `selectedNextGraphFunctionNameFromArchive()` whenever it found an archived selected action, even when the selected basis did not have replay events for the current request. A closed conformance edge selected materialization; after materialization closed, that older selected-action archive was still reused as if it were current.

Fix: `build_tenants/typescript/code/src/spec_method/entry.ts` now only returns the archive-selected start outcome when `hasReplayForBasis(selected.executionContract.basis, input.events)` is true.

Validation: running the rebuilt source CLI over the completed sandbox now returns `projection.status: converged` and `projection.currentEdge: null`.

Status: patched. The installed command inside the already-created sandbox is still the old installed copy; a fresh install/run is required to prove the installed artifact has the fix.

### 3. Live sandbox runner did not stop on converged start

Symptom: even after `start` returned `status: converged` with `currentEdge: null`, the runner continued its `gaps -> start` loop.

Fix: `run_full_external_data_mapper_sandbox.mjs` now sets `terminalReason: odd_sdlc_reported_converged` and stops when `start.status === "converged"` or `startSummary.status === "converged" && startSummary.currentEdge === null`.

Status: patched.

### 4. Live sandbox summary missed materialization packages

Symptom: `run_summary.json` reported `productMaterializationPackages: []` even though the materialization package existed.

Root cause: the summary scanner looked for `pkg.productMaterialization.required`, but the invocation package exposes the flag as `pkg.outputContract.materializationRequired`.

Fix: `run_full_external_data_mapper_sandbox.mjs` now detects `outputContract.materializationRequired === true` and records declared product targets from `outputContract.declaredProductFileTargets`.

Status: patched.

## Current Evidence

The run successfully reached the target materialization edge and closed it:

- `Fg_conform_project_authority`: `sdlc_edge_closure_decision.disposition = close`
- `Fg_materialize_declared_product_asset`: `sdlc_edge_closure_decision.disposition = close`
- Materialization ledger counts for `Fg_materialize_declared_product_asset`: expected 113, fulfilled 113, partial 0, blocked 0, unfulfilled 0, missing 0, extra 0.
- Generated tenant files: 32 under `build_tenants/scala_spark`.

The run did not compile or test the generated Scala/Spark tenant. It proves induction, lineage-selected materialization, postflight admission, and closure for the materialization edge. It does not prove executable data_mapper correctness.

## Follow-Up Ticket Candidates

1. Steel-thread live lane for full data_mapper.
   - Purpose: run a bounded requirement lineage through authority conformance and product materialization before expanding to full breadth.
   - Why: the full-breadth conformance edge is lawful but expensive and noisy. With requirement lineage now working, the first RC-grade proof should carry a selected requirement set, source refs, and product target roots, then assert the ledger chain over that narrow slice.

2. Gaps replay regression test for stale selected-action archive.
   - Purpose: encode the bug fixed in `entry.ts`.
   - Required assertion: after an archived selected action has been consumed and the downstream action has closed with `choosesNextTraversal: false`, `gaps` must report `projection.currentEdge: null`, not resurrect the stale selected action.

3. Live sandbox runner hardening.
   - Purpose: make `npm run live:data-mapper-sandbox` the canonical deterministic full external data_mapper sandbox command.
   - Required assertions: archive root under `test_env/test_runs`, installed command used from sandbox `node_modules/.bin`, terminal reason recorded, materialization package recorded, product file count recorded, and no repeated converged starts.

4. Prompt/result volume review for full-breadth conformance.
   - Purpose: determine whether `Fg_conform_project_authority` should use a compact authority index plus retrieval hints instead of causing F_P to enumerate the full imported requirement body in the terminal stream.
   - Boundary: this is not a pre-dispatch F_D gate. It is a steel-thread / prompt-shaping / lineage-surface issue.

## Verification Commands

Passed:

```sh
npm run build:semantic
node --check test_env/live/run_full_external_data_mapper_sandbox.mjs
npm run test:t143
```

Source CLI validation over completed run:

```sh
ODD_SDLC_TS_OUTPUT=json node build/semantic/code/src/cli/main.js gaps \
  --workspace build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260510T171412025Z_pid93995/workspace
```

Result after patch:

```json
{
  "projectionStatus": "converged",
  "currentEdge": null
}
```

Not clean:

```sh
npm run test:t064 -- --test-name-pattern replay-backed
```

The npm invocation ran the broader `test:t064` file and failed one existing event-count assertion: event log lines 60 vs emittedRuntimeEventKinds 59. I did not chase this during the live data_mapper hardening pass because it is outside the stale-gaps fix and should be triaged separately if it reproduces under the normal focused command.
