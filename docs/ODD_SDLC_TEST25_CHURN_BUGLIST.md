# ODD SDLC Test25 Churn Bug List

Captured during the fresh-install `data_mapper.test25` RC run on 2026-04-10.

This is the post-run bug list for waste, churn, and observability defects exposed by the run.
It now includes the source fixes already applied and the remaining open issues.

## Scope

- Workspace under observation: `ai_sdlc_examples/local_projects/data_mapper.test25`
- RC source under test: `odd_method` commit `26ba806`
- Installed engine source under test: `abiogenesis`
- Runtime entrypoint under observation: `PYTHONPATH=.genesis python -m genesis start --auto --workspace .`

## Current Operator Read

- The run stopped with total delta `2.333333333333333`.
- Closed through `derive_test_run_archive_surface`.
- Remaining open edges are `qualify_testcase_authority` and `prepare_release_surface`.
- Two framework defects were confirmed and fixed in source:
  - missing canonical target bindings in installed workspaces
  - closure allowing `F_P` success to pass while deterministic `F_D` failures remained unresolved
- Observability is still too weak for comfortable operation.

## Bug List

### OBS-01 — No in-flight `F_P` progress visibility during long agent turns

- Severity: high
- Impact: long remote Claude turns look indistinguishable from hangs, so operators cannot tell whether the system is progressing, blocked, or wasting spend.
- Evidence:
  - `dispatch_runtime.py` emits `worker_turn_started`, then blocks on `dispatch_agent(...)` until the subprocess exits.
  - `transport.py` uses blocking `subprocess.run(...)` for the agent subprocess.
  - In `test25`, UAT, design, and scenario each spent many minutes with no intermediate progress events even though they later completed successfully.
- Source refs:
  - `/.genesis/genesis/dispatch_runtime.py:296`
  - `/.genesis/genesis/dispatch_runtime.py:308`
  - `/.genesis/genesis/transport.py:368`

### OBS-02 — `open_frames: 0` is misleading while a live agent child is still running

- Severity: high
- Impact: the main operator status surface suggests inactivity while remote work is still in flight.
- Evidence:
  - During the run, `gaps` reported `open_frames: 0` while a live `claude -p` child was attached to the Genesis parent and actively holding the current edge.
  - This forced manual correlation across `ps`, `events.jsonl`, and `gaps`.
- Reproduction:
  - Run `gaps` while `genesis start --auto` is active on a long `F_P` edge.

### OUT-01 — Installed workspaces were dispatching `F_P` without concrete target bindings

- Severity: critical
- Status: fixed in source
- Impact: the model could satisfy the semantic story while inventing output file names and directories.
- Root cause:
  - installed workspaces get `.genesis` from `abiogenesis`
  - asset-binding query dispatch was executed without the runtime contract `pythonpath`
  - the default `python -m odd_sdlc query-domain --workspace .` fallback therefore silently returned no bindings
  - installed runtime contracts also did not declare an explicit `asset_binding_contract`
- Evidence:
  - live manifests in `test25` recorded `target_asset_binding: null`
  - `test25` produced non-canonical files such as `build_tenants/common/design/30-generated-uat-testcases.md`
- Fix applied:
  - `abiogenesis/.../genesis/binding.py` now runs asset-binding queries with runtime `PYTHONPATH`
  - `odd_method/.../release/install.py` now writes an explicit `asset_binding_contract` into `.odd_sdlc/release/genesis.yml`
  - fresh reinstall on `data_mapper.test26` now resolves `26` bindings, including:
    - `uat_testcases_surface -> specification/scenarios/20-generated-uat-testcases.md`
    - `design_surface -> build_tenants/common/design/30-generated-odd-design.md`
    - `test_run_archive_surface -> build_tenants/python/test_env/50-generated-run-archive.md`

### OUT-02 — Target asset materialization was not blocking closure

- Severity: critical
- Status: fixed in source
- Impact: an edge could report convergence even when its canonical target path was still absent, which allowed downstream churn and hidden repair work.
- Evidence:
  - `derive_uat_testcases_surface` currently shows `delta = 0` in `gaps`.
  - But `assess_generated_asset_contract(..., "uat_testcases_surface")` still returns `contract_satisfied = False`.
  - The canonical expected file is `specification/scenarios/20-generated-uat-testcases.md`, but it does not exist.
- Fix applied:
  - `abiogenesis/.../genesis/result_ingest.py` now fails closure with `policy_reason=target_binding_not_materialized` when the bound canonical path was not actually written
  - verified with synthetic ingest on `data_mapper.test26`

### OUT-03 — `closure_passed` could be emitted even when pre-failing `F_D` checks still failed after the turn

- Severity: critical
- Status: fixed in source
- Impact: the system could spend a long `F_P` turn, emit `proof_passed` and `closure_passed`, then immediately rediscover the same deterministic `F_D` failure on the next auto iteration.
- Evidence:
  - `test25` spent a full `derive_test_run_archive_surface` turn
  - that turn emitted `closure_passed`
  - the next run immediately reopened `derive_test_run_archive_surface` and found `test_traceability_present` still failing
- Root cause:
  - result ingest trusted `F_P` assessments for proof/closure and did not rerun the deterministic failures that were already known at dispatch time
- Fix applied:
  - manifests now carry `fd_failures` with name/binding
  - result ingest reruns those deterministic bindings before closure
  - if any still fail, closure now fails with `policy_reason=fd_failures_unresolved_after_fp`
  - verified with synthetic ingest on `data_mapper.test26`

### OUT-04 — Asset path drift and duplicate generated surfaces in the original run

- Severity: critical
- Status: observed in `test25`, expected to be prevented by OUT-01 and OUT-02 fixes on fresh installs
- Evidence:
  - the canonical asset registry expects:
    - `uat_testcases_surface` -> `specification/scenarios/20-generated-uat-testcases.md`
    - `design_surface` -> `build_tenants/common/design/30-generated-odd-design.md`
  - the original run produced:
    - `build_tenants/common/design/30-generated-uat-testcases.md`
    - `build_tenants/common/design/40-generated-design-surface.md`
    - later also `build_tenants/common/design/30-generated-odd-design.md`

### CHURN-01 — Downstream turns repaired upstream asset-path drift ad hoc

- Severity: high
- Status: observed in `test25`, expected to be reduced by OUT-01 and OUT-02 fixes on fresh installs
- Impact: downstream edges spent tokens clearing deterministic failures caused by upstream contract drift instead of advancing their own edge cleanly.
- Evidence:
  - `derive_scenario_surface` began with `scenario_dependency_surfaces_present` failing.
  - Later the canonical design file `30-generated-odd-design.md` appeared and scenario passed.
  - No new design turn was dispatched between those points, which suggests the downstream scenario turn repaired upstream canonicalization as part of clearing its own deterministic failure.
- Consequence:
  - token spend includes hidden repair work that should have been resolved at the producing edge.

### OBS-03 — No explicit asset-write telemetry

- Severity: medium
- Impact: we cannot answer "which turn wrote which file, when, and why" from runtime events alone.
- Evidence:
  - `events.jsonl` tells us when a turn starts and ends, but not which workspace files were created, replaced, or canonicalized during that turn.
  - This made the design-path repair difficult to attribute cleanly.

### OPEN-01 — Test traceability is structurally open because generated test modules claim requirement coverage before generated test source files exist

- Severity: high
- Status: open
- Impact: `derive_test_run_archive_surface` still cannot converge lawfully in `test25`, and likely any similar workspace, until the method either generates governed test source files or stops over-claiming test traceability in documentation surfaces.
- Evidence:
  - final `gaps` shows `derive_test_run_archive_surface` failing only `test_traceability_present`
  - `missing_test_traceability_ids(...)` in `test25` returns essentially the full claimed requirement inventory
  - `traceability_scan(...)` reports `orphan_test_files = []` because there are no generated test source files under the code root yet
  - `40-generated-test-modules.md` claims broad testcase coverage, but `test_traceability_present` is defined against actual generated test files carrying `Validates:` tags
- Interpretation:
  - this is not the same bug class as path drift
  - it is a design/contract mismatch between the test-module documentation surface and the deterministic traceability rule

## Immediate Optimization Targets

- Add heartbeat/progress events for active `F_P` turns.
- Expose active in-flight turns in `gaps` or a dedicated status command.
- Surface the active target binding and elapsed turn time in operator status.
- Emit file-write telemetry for generated assets.
- Decide whether test traceability should be satisfied by generated test source, by generated authority documents, or by a separate lawful edge before archive/release.

## Known Live Evidence From Test25

- Canonical design exists and satisfies contract:
  - `build_tenants/common/design/30-generated-odd-design.md`
- Duplicate design artifact also exists:
  - `build_tenants/common/design/40-generated-design-surface.md`
- Canonical scenario exists and satisfies contract:
  - `specification/scenarios/40-generated-scenarios.md`
- UAT contract is still not satisfied at its canonical path:
  - expected `specification/scenarios/20-generated-uat-testcases.md`
  - actual observed file `build_tenants/common/design/30-generated-uat-testcases.md`
- Canonical test run archive exists and satisfies contract:
  - `build_tenants/python/test_env/50-generated-run-archive.md`
- Final open deterministic gap in the run:
  - `test_traceability_present`

## Follow-Up

- Run a fresh end-to-end install after the fixed engine/domain sources are in place and confirm that:
  - manifests carry non-null target bindings
  - non-materialized target paths fail closure immediately
  - unresolved deterministic failures fail closure immediately
- Convert the remaining open issues into a prioritized bug-fix / optimization wave with intake triage and lawful re-entry classification.
