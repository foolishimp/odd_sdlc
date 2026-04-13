# REVIEW: Post-Checkpoint Runtime Boundary Fixes

**Author**: claude
**Date**: 2026-04-13T17:00:00Z
**Baseline**: `b9551cb checkpoint odd_sdlc proving wave before t004`
**Scope**: all working-tree changes on top of the checkpoint (16 modified files, 2 new modules, 1 new ticket)
**Relates to**: claude SCHEMA (20260413T140000), REVIEW refactor (20260413T150000), REVIEW T-004 axiomatic (20260413T160000)

## Headline Verdict

The runtime-boundary "make it boring first" work that my 20260413T150000 review flagged as missing **has landed on this tree**. Specifically: workspace-state artifact exists, analysis refresh is a single boundary, `start` gates on readiness, `_build_module` is a pure projection, `load_project_profile` prefers the published artifact, and `workspace_mode` is now a real field. The remaining gaps are smaller and narrower than before.

The main concerns now are:

1. **mode detection is heuristic, not declared** — `_workspace_mode()` at `analysis.py:24-31` infers mode from which files exist; the workspace itself still doesn't declare what mode it is operating in. Good enough for current behavior; not enough for T-004's mode-gated constitutional repricing (#4 in the axiomatic review).
2. **input_fingerprint is narrow** — only hashes `project_constraints.yml` + `.odd_sdlc/release/genesis.yml`. Design docs, requirement surfaces, and scaffolding changes do not invalidate readiness. A `refresh-analysis` from a stale point can stay "ready" even after significant workspace edits.
3. **`resolve_project_profile` is still called by `traceability.py` and elsewhere indirectly** — the "prefer published" path is in `load_project_profile`, but the published profile is just a serialized snapshot of `ProjectProfile`. Nothing asserts the two paths agree when both are available.
4. **B-004 is filed as a deferred sibling** — correct and disciplined. Flagged for the record.

Recommendation: this tree is much closer to RC. The three concerns above are either test-coverable now or lawful to defer into T-004 with an explicit note.

## What Changed, Layer by Layer

### New module: `analysis.py` (195 lines, untracked)

This is the load-bearing addition. It owns:

- `_workspace_mode(root)` → `installed_target | source_domain_repo | governed_workspace | unclassified_workspace`
- `load_workspace_state`, `workspace_state_ready`, `write_workspace_state`
- `refresh_analysis(root, stage)` — single entry point that writes runtime contexts, ambiguity register, requirement closure register, closure prompt context, and workspace-state artifact, collecting change actions
- `ensure_workspace_ready(root)` — raises `RuntimeError` with the refresh-analysis hint when unpublished or stale

The design cleanly separates "build a register in memory" (in `ambiguity.py`/`traceability.py`) from "publish it to disk" (here). That resolves the Layer-2 Gap 2b ("no analysis orchestration boundary") from my 20260413T150000 review.

**Observation — write-if-changed is correct.** `_write_json_if_changed` + `_write_text_if_changed` both compare existing text byte-for-byte and return zero actions on no-change. That matches the "don't thrash inodes" invariant I flagged.

**Observation — `stage` is stamped as a field but not version-checked.** A `stage: "refresh_analysis"` artifact and a `stage: "install_release"` artifact are both "ready". That's defensible (all stages produce the same shape), but it means consumers can't tell what event wrote the current state. Fine for now; T-004 may want this.

### New module: `runtime_contexts.py` (53 lines, untracked)

Relocates the three runtime builder context paths (`STATEFUL_ITERATOR_CONTROL_*`, `REALIZED_TEST_SOURCE_*`, `REALIZATION_DEEPENING_*`) out of `gtl_module.py` and into a dedicated module, and owns the `publish_runtime_contexts(root)` publisher.

**Good.** Clean separation of concerns. `gtl_module.py` now imports these as `_STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH as _STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH` (re-aliasing the public name as private) to preserve the existing private-module contract. Slightly ugly but defensible.

### `gtl_module.py` — `_build_module` is now pure

Diff removes `_write_runtime_builder_contexts(workspace_root)` and `refresh_requirement_closure_register(workspace_root, stage="module_build")` from `_build_module` at the old lines 1147-1151 / 1295-1296. Also replaces `refresh_ambiguity_register(...)` with `load_or_build_ambiguity_register(...)` in `_configured_leaf_graph_functions`.

**Invariant upgrade.** `_build_module` is now a pure projection — no disk writes on module construction. That lines up with violation 4a from my 20260413T150000 review.

**Caveat — the fallback path in `load_or_build_ambiguity_register` still builds.** If the published register is missing, it falls back to `build_ambiguity_register`, which reads files but *doesn't* write. Good. Same pattern for `load_or_build_requirement_closure_register`. That preserves "pure on import" even in unready workspaces.

### `project_profile.py` — workspace-state is the preferred profile source

New additions:

- `WORKSPACE_STATE_PATH` constant at `project_profile.py:17`
- `ProjectProfile.from_dict(...)` classmethod
- `current_workspace_input_fingerprint(root)` — SHA-256 of `(path, exists, content-sha256)` over a fixed list
- `load_published_workspace_state(root)`
- `load_published_project_profile(root)` — returns only if `ready` is true AND fingerprint matches
- `resolve_project_profile(root)` — the old `load_project_profile` body, renamed
- `load_project_profile(root)` — now: prefer published, fallback to resolve

**Concern 1 — fingerprint scope is narrow.** The tracked set is `PROJECT_CONSTRAINTS_PATH` + `.odd_sdlc/release/genesis.yml`. Realistic workspace edits that *should* invalidate readiness but don't:

- adding/editing requirement surfaces under `specification/requirements/`
- editing `specification/INTENT.md`, `GOALS.md`, `PRODUCT.md`
- adding new code/tests under the tenant output dirs

If a user edits `INTENT.md` then runs `genesis start`, readiness passes and they see stale ambiguity/closure analysis. The file does get rebuilt on the next `refresh-analysis`, but nothing forces the user to run it.

**Mitigation options:**
- (a) expand the fingerprint to include an O(1) hash of directory listings + mtime/size for `specification/` and each tenant output dir
- (b) accept the narrow fingerprint and document it — "analysis is authoritative for constraints/genesis; content freshness is operator responsibility"
- (c) defer into T-004 staleness hash composition (appendix C of SCHEMA post)

My read: (c) is fine for RC — the current fingerprint catches the most common drift (constraints/runtime contract changes) and T-004 was always going to widen it. Worth a one-line comment in `current_workspace_input_fingerprint` documenting the scope.

**Concern 2 — published profile is not validated against resolved.** `load_project_profile` returns the published profile verbatim when `ready` + fingerprint match. No cross-check that `resolve_project_profile(root)` would yield the same profile right now. In theory this cannot diverge (fingerprint gates the narrow set of inputs that drive resolution), but in practice `resolve_project_profile` consults `_resolved_output_from_topology` which does file-tree scoring — a change under the tenant output dir can flip resolution without touching the fingerprinted inputs.

This is the mirror of Concern 1. Same mitigation applies. Same recommendation: document and defer.

### `normalization.py` — analysis is delegated

The 40-line block that previously wrote ambiguity + requirement closure registers inline is replaced by:

```python
analysis_report = refresh_analysis(root, stage="normalize_workspace")
actions.extend(analysis_report["actions"])
```

Plus the report now carries `workspace_state_path`.

**Good.** This is exactly the shape I recommended. Normalization owns constitutional/structural changes; analysis owns register publication + state. One refresh boundary, called from normalize + install + explicit `refresh-analysis` CLI.

**Observation — the canonicalize-before-migrate race from my previous review is not addressed here.** The diff at `normalization.py` is scoped to analysis delegation; the race at lines 765-776 is still present in the unchanged body. If the test corpus doesn't exercise it, it remains latent. Flag for later.

### `traceability.py` — tighter REQ regex and matrix-family expansion

Two substantive changes beyond plumbing:

1. **`_REQUIREMENT_ID_RE` tightened** from `\b(?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*\b` to `\b(?:REQ|RF)-[A-Z0-9]+(?:-[A-Z0-9]+)*-\d{3}\b`. The old regex would match family headers like `REQ-F-ODDSVC` (no trailing three-digit ID), which would have inflated the register with phantom entries. The new regex requires the `-\d{3}` suffix.

2. **New `_matrix_testcase_authority_refs`** parses `specification/scenarios/TESTCASE_AUTHORITY.md` and expands family patterns like `REQ-F-ODDSVC-*` against the live requirement set. Supports authority references that are declared at the family level rather than per-ID.

3. **`_workspace_mode(workspace_root)` and `_traceability_code_root_relative_path(workspace_root)`** for source_domain_repo path shimming. When in source_domain_repo mode, the traceability scan root becomes `build_tenants/odd_sdlc/python` instead of the declared output dir. The installation test at `test_odd_sdlc_installation.py:1154` pins this: `code_root == "build_tenants/odd_sdlc/python"`.

**Concern — `_workspace_mode` in `traceability.py` is a second source of truth.** `analysis.py` has its own `_workspace_mode(root)`. The two functions:

| | `analysis.py:24-31` | `traceability.py:247-256` |
|---|---|---|
| checks | `.odd_sdlc/release/genesis.yml` first, then source markers, then constraints | published workspace_state first, then source marker, else None |
| returns | always a string (falls back to `unclassified_workspace`) | `str \| None` |

These can agree by accident but are independent implementations. T-004 will need one canonical mode detector. For now, low-risk divergence — the traceability one is narrower and consults the published state. Recommendation: rename `traceability.py`'s `_workspace_mode` to `_workspace_mode_from_published` or similar to make the divergence explicit, and have `analysis.py` be the authoritative one.

### `app.py` — `domain_module` plumbing + readiness gate

Two changes:

1. `AppConfig.domain_module: Any | None` and `bootstrap(..., domain_module=None)`. `OddSdlcApp.scope()` now builds the module from config if provided, else resolves it. `catalog(app)` uses the same helper. **Why:** `odd_service.runtime_adapter.create_app` now resolves the domain module once at service-setup time and reuses it across the lifetime of the app, instead of rebuilding on every scope access. Real perf + correctness win (`odd_sdlc_module()` without args was previously re-resolving workspace root; the service path now passes an explicit workspace).

2. `start(app, auto=False)` calls `ensure_workspace_ready(app.config.workspace_root)` before delegating to `gen_start`. That is the READY gate from the landing sequence.

**Good.** Both changes are clean and minimal. The test at `test_odd_sdlc_first_slice.py:418-437` pins the READY gate (`pytest.raises(RuntimeError, match="refresh-analysis")` before refresh, success after).

### `__main__.py` — `refresh-analysis` subcommand

Adds the CLI entrypoint for explicit refresh. Matches the error message in `ensure_workspace_ready` ("run `python -m odd_sdlc refresh-analysis --workspace .`").

**Good.** Operator UX is now aligned with the axiom.

### `release/install.py` — install calls `refresh_analysis`

After `normalize_workspace`, install now calls `refresh_analysis(root, stage="install_release")` and returns the analysis payload in the response.

**Good.** Install-time readiness is preserved; the test `test_install_deploys_runtime_contract_and_enables_genesis_gaps` at `test_odd_sdlc_installation.py:363-366` asserts `workspace_state.ready is True` and `workspace_mode == "installed_target"`.

### `ambiguity.py` — loader prefers published

Adds `load_published_ambiguity_register(root)` and rewrites `load_or_build_ambiguity_register` to prefer published → build fallback (no write on fallback). Same pattern as traceability.

**Good.** Fallback path is read-only — `build_ambiguity_register` does not publish. That preserves the pure-on-import invariant in `_build_module`.

### `odd_service/runtime_adapter.py` — shared domain module

`_router_worker(module, authority_ref)` now takes the module as a parameter; `create_app` resolves `odd_sdlc_module(workspace)` once and passes it to both the router and the bootstrap config.

**Good.** Prevents double-resolution. Also surfaces the bug-fix intent: the router worker used to call `odd_sdlc_module()` with no workspace, which resolved to whatever `_module_workspace_root()` happened to find — a latent bug when the service was asked to operate on a workspace distinct from the module's default resolution.

### `odd_service/service.py` — ephemeral agent sessions

New `_worker_for_session(workspace, session)`:

```python
if session.worker_name:
    worker = get_worker(workspace, name=session.worker_name)
    if worker is not None:
        return worker
if session.agent:
    return WorkerRecord(
        name=session.worker_name or f"ephemeral-{session.agent}",
        agent=session.agent,
        metadata={"ephemeral": True},
    )
return None
```

Replaces `get_worker(root, name=session.worker_name) if session.worker_name else None` in two places (`step` and `gaps`).

**What this fixes.** Before: if the session carried only an `agent` field (not a registered worker), `gaps`/`step` would call runtime with `worker=None`, losing the execution identity. After: an ephemeral `WorkerRecord` is synthesized with `metadata: {"ephemeral": True}` so the runtime still sees the agent identity.

**Concern — ephemeral workers don't persist.** The synthesized record exists only for the duration of the call. If the runtime emits events tagged with this worker, and a later replay tries to rebind, the ephemeral identity may not be rediscoverable. The test `test_ephemeral_agent_session_rehydrates_execution_identity_for_gaps_and_step` pins the call-time identity but not the replay story. Likely fine for `agent`-based sessions where identity is per-turn anyway; flag for T-004 if replay semantics become load-bearing.

## Test Coverage

New tests added (directly verifying the fixes):

1. **`test_module_build_does_not_publish_runtime_sidecars`** (`test_odd_sdlc_first_slice.py:346-359`) — imports `odd_sdlc_module(tmp_path)`, asserts no runtime files were written. This is **exactly the purity test** I called for in my 20260413T150000 review ("No purity test for `_build_module`"). Gap closed.

2. **`test_query_domain_is_read_only_when_analysis_has_not_been_published`** (`test_odd_sdlc_first_slice.py:408-416`) — confirms `query_domain` still returns a valid register payload without publishing sidecars. Defends against regressions where the read path silently writes.

3. **`test_start_requires_explicit_analysis_publication`** (`test_odd_sdlc_first_slice.py:418-437`) — READY gate test. Uses `monkeypatch` on `gen_start` to verify the gate blocks before refresh and passes after.

4. **`test_requirement_closure_register_ignores_family_headers_and_counts_written_testcase_authority`** (`test_odd_sdlc_installation.py:615-707`) — pins the tightened REQ regex (family header `REQ-F-ODDSVC-*` excluded) and matrix-family expansion from `TESTCASE_AUTHORITY.md`. Good specification coverage.

5. **`test_ephemeral_agent_session_rehydrates_execution_identity_for_gaps_and_step`** (`test_odd_service_first_slice.py:133-191`) — pins ephemeral `WorkerRecord` creation for agent-only sessions.

6. **Action-list expansion** in `test_normalize_workspace_standardizes_imported_workspace_shape` — new expected actions: `create_stateful_builder_control_frame`, `create_realized_test_source_obligation`, `create_realization_deepening_control_frame`, `create_requirement_closure_prompt_context`, `create_workspace_state`. Pins that normalize now emits these explicitly.

7. **`workspace_state` assertions** — both installation tests (imported workspace + `install_release`) now assert `workspace_state.ready is True`, `workspace_mode` present, and `input_fingerprint` non-empty.

**Still missing (from my earlier review):**

- No test that `resolve_project_profile(root)` and `load_published_project_profile(root)` agree when both are available. **Suggest adding** — three lines in an existing test.
- No test for staleness detection (fingerprint mismatch after a constraints edit). **Suggest adding** — edit `project_constraints.yml`, assert `workspace_state_ready(root)` returns `(False, payload)`.

## Ticket Updates

### T-004

Added a `## Pre-T-004 Runtime Boundary Work` section that names the six runtime substrate fixes as "the first implementation slice of this ticket". Six new task-list items mirror those fixes. Deferred scope link to B-004 added.

**Interpretation:** the ticket now acknowledges the runtime-boundary work is in-ticket, not out-of-scope. Given what actually landed on this tree, those items are essentially done — a pass through the task list to tick them off would be accurate. The gap-triage layer (the original T-004 substance) remains future work.

**Suggestion:** rather than leave the six new items unchecked, promote them to "landed" via a `### Landed in checkpoint+1` subsection with file:line evidence. Keeps the ticket honest about what's already on disk.

### B-004 (new)

Clean scope-debt ticket for deferred odd_service work (REQ-F-ODDSVC-007/008/009 + partial 004). Correctly sized (69 lines), priority: medium, explicit `deferred_scope` link from T-004. No concerns.

## Test Run (this diff, full odd_sdlc + odd_service suites)

65 passed, 5 skipped, **2 failed**. The two failures are real and both trace to the refactor.

### Failure 1 — `test_load_project_profile_keeps_declared_project_tenant_when_governance_neighbor_exists` (`test_odd_sdlc_installation.py:1060`)

```
assert entries["REQ-CORE-001"]["code_refs"] == ["build_tenants/odd_method/python/src/main/placeholder.py"]
AssertionError: At index 0 diff:
  'build_tenants/odd_sdlc/python/code/odd_sdlc/app.py'
  'build_tenants/odd_method/python/src/main/placeholder.py'
```

**Root cause — the `source_domain_repo` heuristic fires in a nested-competitor workspace.** `traceability.py:_workspace_mode` falls through to `source_domain_root = workspace_root / "build_tenants/odd_sdlc/python" / "code" / "odd_sdlc"`. The test deliberately creates that neighbor to exercise the "declared tenant still wins" invariant, but the new heuristic now rebases the traceability scan on the neighbor directory.

Contrast: the sibling test `test_load_project_profile_ignores_builder_product_neighbors_in_source_repo` at line 1154 *was* updated to expect `build_tenants/odd_sdlc/python/code/odd_sdlc/app.py`, which works when the neighbor is the realized code root. But for the nested-competitor scenario, the declared tenant must win and traceability must follow the declared root.

**Fix direction (smallest lawful):** require the `source_domain_repo` source marker to be paired with an authority marker that only the real odd_method repo carries (e.g., the `.ai-workspace/comments/` directory *and* a specific specification surface), or — preferred — drop the heuristic fallback entirely and trust only `workspace_state.workspace_mode == "source_domain_repo"` from a published state. The heuristic at `traceability.py:253-255` is the trap:

```python
source_domain_root = workspace_root / _SOURCE_DOMAIN_CODE_ROOT / "code" / "odd_sdlc"
if source_domain_root.exists():
    return "source_domain_repo"
```

It flips mode from "nothing published" → "source_domain_repo" purely because an `odd_sdlc/` directory tree exists in the fixture. That is too loose.

### Failure 2 — `test_canonical_sandbox_can_reset_runtime_state_and_rerun_cleanly` (`test_odd_sdlc_sandbox_usecase.py:646`)

```
CalledProcessError: `python -m odd_sdlc start` exit 1
stderr: "odd_sdlc workspace analysis has not been published;
         run `python -m odd_sdlc refresh-analysis --workspace .` ... before `start`."
```

**Root cause — `reset_sandbox_runtime_state` wipes the analysis artifact.** Helper at `sandbox_runtime.py:297-308` does:

```python
shutil.rmtree(runtime_root)  # where runtime_root = workspace / ".ai-workspace"
```

That removes `.ai-workspace/runtime/odd_sdlc-workspace-state.json` along with events. The subsequent `start` fails the readiness gate (which is itself correct behavior — that gate is the whole point of the new invariant).

**Two ways to reconcile:**

1. **Scope reset more narrowly.** Reset should wipe runtime progress (`events/`, `runs/`, checkpoints), not workspace analysis. The analysis surfaces in `.ai-workspace/runtime/odd_sdlc-*.json` describe the workspace, not the run. Keep them. This is the architecturally correct answer.
2. **Re-run `refresh-analysis` after reset.** Either inside `reset_sandbox_runtime_state` itself, or explicitly in the test. Second-best — it layers a redundant publication on top of a too-broad reset.

Recommendation: option 1. The helper should `shutil.rmtree` only `events/`, `runs/`, and narrowly scoped resettable subpaths — not the entire `.ai-workspace` tree.

### Interpretation

Both failures are **substrate correctness issues**, not test fragility:

- Failure 1 proves the heuristic `_workspace_mode` fallback is too permissive and breaks the declared-tenant invariant. This is exactly Concern 2 from the SCHEMA review ("two `_workspace_mode` implementations") materializing in a user-visible way.
- Failure 2 proves that reset and workspace-state lifecycles are not separated. Reset was written for the old model ("wipe `.ai-workspace` and start over"); the new model has published analysis in that same tree that must survive runtime reset.

Neither is fixable by adjusting the assertion. Both are real regressions introduced by the refactor.

## Risk Register (ranked)

1. **Reset wipes workspace-state** (Failure 2). Blocks reset/replay flows that are already validated by the sandbox test. Fix in `reset_sandbox_runtime_state` scope.
2. **`_workspace_mode` heuristic fallback over-fires** (Failure 1). Breaks the nested-competitor invariant. Fix by dropping the fallback and trusting the published state, or requiring a stricter marker set.
3. **Narrow input_fingerprint** — readiness can stay "true" after meaningful workspace edits. Mitigation: document scope, or widen in T-004 per SCHEMA appendix C.
4. **Two `_workspace_mode` implementations** — low-risk divergence now; the Failure 1 case shows it starting to bite. Mitigation: consolidate.
5. **Canonicalize-before-migrate race** — still present in `normalize_workspace`, unchanged since last review. Not in scope for this diff, flagged for record.
6. **Ephemeral worker identity replay** — unknown under replay; not exercised by current tests. Flag for T-004.

## Recommendation

**Do not cut RC on this tree as-is.** Two real regressions (the test failures) block. Both are small — a narrower reset scope and a stricter mode check — but they need to land first.

### Pre-RC (required)

1. Fix `reset_sandbox_runtime_state`: rmtree only `events/`, `runs/`, and narrowly-scoped runtime progress paths; preserve `.ai-workspace/runtime/odd_sdlc-*.json` and `.ai-workspace/context/` analysis surfaces.
2. Fix `traceability._workspace_mode`: drop the heuristic source-domain fallback, or tighten it to require a second-marker authority. Trust `workspace_state.workspace_mode` from the published state. If no published state, return `None` and let traceability fall back to the declared profile (the old behavior).
3. Re-run full suite; expect 67 passed, 5 skipped, 0 failed.

### Pre-RC (recommended)

4. Add one-line comment to `current_workspace_input_fingerprint` documenting scope ("constraints + runtime contract; content surfaces are operator-refresh-responsibility; widened by T-004").
5. Add two tiny tests: (a) published vs resolved profile agree when both available, (b) fingerprint mismatch after constraints edit flips `ready` to false.
6. Tick the "Pre-T-004 Runtime Boundary Work" items in T-004 and move them to a `### Landed in RC` subsection with evidence.

Steps 4–7 of the SCHEMA landing sequence (workspace_mode as a declared field, T-004 proper) remain post-RC work, which matches the original plan.
