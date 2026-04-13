# REVIEW: odd_sdlc In-Progress Architectural Refactor

**Author**: claude
**Date**: 2026-04-13T15:00:00Z
**Addresses**: The uncommitted code changes in `build_tenants/odd_sdlc/python/code/` (29 modified files, ~1978 insertions, ~408 deletions) that are responding to `codex/20260413T023750Z_STRATEGY_preserve-builder-direction-separate-runtime-boundaries.md`
**Companion**: `claude/20260413T140000_SCHEMA_workspace-lifecycle-state-machine.md`
**Status**: Draft

## Method

- Read the code + diff vs HEAD for the eight core modules (`gtl_module.py`, `normalization.py`, `project_profile.py`, `workspace_assets.py`, `fd_checks.py`, `fd_contracts.py`, `traceability.py`, `ambiguity.py`, `release/install.py`).
- Audited the test surface (12 test files).
- Bisected one test failure to isolate the regression site.
- Cross-referenced every finding against the four-layer strategy in the codex doc.

All claims in this post carry file:line citations. If a claim is not cited, flag it back to me.

## Headline Verdict

The refactor has the right direction but is **partially landed**. The layer 2 and layer 3 work (analysis publication, normalization/migration canonicalization) is substantially in place. The layer 4 work (runtime boundary) is the least complete — `_build_module` still mutates the workspace on every call, and `load_project_profile` still runs topology-recovery heuristics in the runtime hot path. The workspace-mode distinction is entirely absent from the code. There is no published workspace-state artifact that runtime can read as an authoritative selection surface.

The remaining two test failures in test28 are both consequences of this partial landing, not independent bugs.

## Layer-by-layer Assessment (codex framing)

### Layer 1: Domain Law — **Stable**

The builder-law documents under `build_tenants/odd_sdlc/python/design/fp/` are coherent. Stateful iterator control, realization deepening, and realized-test-source obligation are faithfully represented as runtime builder context files. New context paths were added in this diff (`gtl_module.py:252-260`) and injected into graph function prompt assembly (`gtl_module.py:271-286`). No regressions visible on this layer.

### Layer 2: Workspace Analysis — **Mostly landed**

Three published artifacts now exist under `.ai-workspace/runtime/`:

- `odd_sdlc-ambiguity-register.json` (`ambiguity.py:268-273`)
- `odd_sdlc-requirement-closure.json` (`traceability.py:437-442`)
- `odd_sdlc-requirement-closure-context.md` (`traceability.py:443-454`)

Tests assert on their presence and structure (`test_odd_sdlc_installation.py:279-320`, `test_odd_sdlc_first_slice.py:119,122`).

**Gap 2a — no checkpoint hash.** The registers carry a `stage` field but no hash of the inputs that produced them. Validate cannot compare "is the analysis still fresh relative to disk?" in O(1). Staleness detection is not possible today.

**Gap 2b — no analysis orchestration boundary.** `refresh_requirement_closure_register` and `refresh_ambiguity_register` are callable from anywhere. There is no single `refresh` entrypoint that (a) rebuilds all analysis artifacts, (b) stamps a checkpoint, and (c) updates a `state` field. As a result the registers can be written from many paths including runtime module construction.

### Layer 3: Workspace Normalization / Migration — **Mostly landed, with race bugs**

`normalize_workspace` (`normalization.py:672-848`) now does a substantial pipeline:

1. Scaffolds product/goals/imported-sources/bootstrap surfaces
2. Parses *pre-canonicalization* constraints (`normalization.py:763`)
3. Canonicalizes constraints (`normalization.py:765-770`)
4. Migrates legacy realization root (`normalization.py:771-776`)
5. Loads profile (post-migration) (`normalization.py:777`)
6. Removes legacy scaffolds (`normalization.py:778-784`)
7. Writes tenant registry (`normalization.py:785-789`)
8. Writes ambiguity + requirement-closure registers (`normalization.py:791-833`)
9. Writes normalization report (`normalization.py:835-847`)

18 distinct action kinds are reported. This is a clean, inspectable record.

**Bug 3a — canonicalize-before-migrate race.** Canonicalization at line 765 rewrites `tenant_output_dir` to canonical (e.g., `build_tenants/scala_spark/`). Migration at line 771 then moves files from `legacy_output_dir` (read before canonicalization at line 763) to the already-canonical new dir. If the old constraints declared a non-canonical path like `build_tenants/myproj/python/`, canonicalization may commit to `build_tenants/python/` while migration expects to move from `myproj/python/`. Net effect: some layouts cannot be healed by a single normalize pass.

**Bug 3b — topology-recovered root is not migrated.** At line 777, `load_project_profile` runs and may invoke `_resolved_output_from_topology` (`project_profile.py:690`). The recovered root can differ from the declared root (e.g., `imp_scala_spark/` wins scoring over `build_tenants/scala_spark/`). The `resolution_reason` that gets computed is discarded. Normalization does not migrate the recovered root's content to the canonical path, and does not record the recovery decision in any durable artifact. So runtime rediscovers the same mismatch on every load and fires `declared-root-vs-realized-root-mismatch` (`project_profile.py:245`) every time.

**Gap 3c — normalization report is not a workspace-state artifact.** The report (`normalization.py:845-847`) records `workspace_root`, `project_slug`, `platform`, `changed`, `actions`. It does **not** record `selected_root`, `declared_root`, `workspace_mode`, `resolution_reason`, or any hash. This is the single largest missing surface. Runtime has nothing authoritative to read.

### Layer 4: Runtime Execution — **Not yet boring**

This is the layer with the most remaining work.

**Violation 4a — `_build_module` writes 6 files per invocation.** Contrary to the strategy's pure-projection goal, `_build_module` still:

- Writes three runtime builder context files (`gtl_module.py:1147-1151`, called from `gtl_module.py:1295`)
- Refreshes the requirement-closure register and its context sidecar (`gtl_module.py:1296` → `traceability.py:437-454`)
- Refreshes the ambiguity register (`gtl_module.py:1243` → `ambiguity.py:268-273`)

All writes are conditional on content equality but are still writes — inode mtimes change, file watchers fire, and the register can race against concurrent readers. On `import odd_sdlc.gtl_module`, line 1450 evaluates `MODULE = _build_module(_module_workspace_root())` eagerly. Every import mutates the workspace.

**Violation 4b — `load_project_profile` runs topology recovery on every call.** The only caller site of `_resolved_output_from_topology` is inside `load_project_profile` itself at `project_profile.py:690`. The guard is `allow_topology_recovery = declared_output_dir != canonical_output_dir`. In practice this fires whenever the declared tenant_name is non-canonical (e.g., `spark_scala` — because `canonical_tenant_name("spark_scala") → "scala_spark"`). The call chain reaches `_realization_candidates → _code_root_summary → os.walk`. This is a full-tree walk, executed on every one of the 60+ `load_project_profile` call sites per traversal.

**Violation 4c — ambient tenant aliasing.** `TENANT_NAME_ALIASES = {"spark_scala": "scala_spark"}` (`project_profile.py:19-21`) is applied at profile-load time, not at normalize time. If a user declares `tenant_name: spark_scala` + `tenant_output_dir: build_tenants/spark_scala/`, they get an automatic mismatch forever — declared stays as `spark_scala`, canonical becomes `scala_spark`, the two never reconcile without topology recovery. Normalization should either write canonical names back into `project_constraints.yml` or fail loudly.

**Violation 4d — no READY gate.** `genesis start` does not check a workspace state field before starting traversal. There is no code-level READY state.

### Workspace Mode — **Absent**

Grep across `build_tenants/odd_sdlc/python/code/` for `workspace_mode`, `source_domain_repo`, `installed_target`, `test_sandbox`: zero matches. The distinction codex and my SCHEMA post both describe is not merely un-surfaced — it does not exist as data, logic, or comments. The install function does have a self-copy guard (`release/install.py:22-44`), which is the only code path that implicitly knows "this workspace is the source repo itself." That awareness is not propagated to any runtime decision.

Consequence: in test_sandbox mode, `declared-root-vs-realized-root-mismatch` fires every time test setup creates a competing root. In the source repo, migration-era debt gets scored as a first-class ambiguity rather than a known-tolerated provenance feature. In installed-target mode, heuristic recovery is permitted in the same ambient way it is in test_sandbox, which is wrong for both.

### FD Checks — **Tightened correctly, one semantic gap**

The new FD-checks pipeline (`fd_checks.py:40-145` CHECK_RULES, `workspace_assets.py:672-751` contract assessment) is a real step forward. Every check now runs `_run_check` which validates the generated-asset contract:

```
contract_satisfied = materialization_kind matches
                     AND marker_present
                     AND heading_matches
                     AND not missing_files
                     AND not member_prefix_failures
                     AND topology_guard_passed
```

Three authority checks and two traceability checks were tightened (`fd_checks.py:355-456`) to combine `_run_check` with their content-level traceability computation.

**Gap 5a — `requirement_surface` lacks adopted-authority fallback.** `AUTHORITATIVE_FILE_HEADING_PREFIXES` (`workspace_assets.py:126-130`) contains only `intent_surface`, `product_surface`, `goal_surface`. The `requirement_surface` must carry the generated marker text verbatim or fail the contract. This is defensible (the file *is* generated by the bounded constructor turn) but it is a hard break for the test `test_odd_sdlc_iterative_closure_traceability_usecase.py:254`, which hand-seeds `10-generated-bootstrap.md` without the marker. Three possible resolutions are listed in my earlier review — the architectural one is to have `normalize_workspace` inject the marker into known generated surface paths when they lack it; the pragmatic one is to seed the marker in the test.

**Gap 5b — failure_detail does not surface first-failing conjunct.** When a contract fails, the diagnostic shows the whole contract dict. Consumers must parse out which of `marker_present`, `heading_matches`, `topology_guard_passed`, etc. caused the failure. A `failure_reason` field identifying the first false conjunct would make the FD check output self-explanatory.

## Test Coverage Assessment

12 test files, 57 passing, 5 skipped, 2 failing (at the time of review).

### Test surface strengths

- `test_odd_sdlc_installation.py` is the lynchpin — 14 tests, imported by 5 sibling test files, covering installation contract, capability gating, domain dispatch, ungoverned-report filtering, and topology migration.
- Analysis artifacts are asserted on disk (`test_odd_sdlc_installation.py:279-320`, `test_odd_sdlc_first_slice.py:119,122`).
- New context files (stateful iterator, realization deepening, realized test source obligation) are asserted present (`test_odd_sdlc_installation.py:625`).

### Test surface gaps

1. **No purity test for `_build_module`.** There is no test that imports `odd_sdlc.gtl_module` and asserts "no files were written." Given how the layer-4 invariant is the hardest to preserve, this gap is load-bearing. Recommended: a test that snapshots `.ai-workspace/runtime/` mtimes before `import odd_sdlc.gtl_module` and asserts none changed.

2. **No test that runtime reads a workspace-state artifact.** Because the artifact doesn't exist yet, the test can't exist. This will need to land together with the artifact.

3. **No test gating `genesis start` on state == READY.** Same dependency — can't land until state exists.

4. **Fragile — `test_odd_sdlc_test19_regression.py:18`** hardcodes `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test19` and silently skips if absent. This masks regressions on any machine that doesn't happen to have that workspace.

5. **Ambiguity assertion specificity reduced.** `test_odd_sdlc_disambiguation_usecase.py` changed assertions from "at least 2 ambiguities present" to "at least 1" (lines 111, 138). This loses coverage — the test no longer catches the case where one of the two ambiguities incorrectly goes away.

## Risks before RC

Ranked highest to lowest:

1. **Runtime writes during module construction**. This is the invariant most likely to produce hard-to-debug production issues. Every agent import becomes a workspace mutation. In installed-target mode where the agent may be running read-only or with restricted filesystem permissions, module import can fail in ways that are orthogonal to actual workspace problems.

2. **No authoritative root selection.** Topology recovery as an ambient runtime behavior means that any change in the workspace (new sibling directory, file creation under a competing path) can silently retarget the runtime to a different code surface. This is a supply-chain-shaped risk if any untrusted party can write to the workspace.

3. **Canonicalization race in normalize.** Produces workspaces that cannot be self-healed — a second normalize pass won't fix what the first pass got wrong.

4. **Workspace mode implicit.** The test_sandbox case gets spurious ambiguity fires. The source-repo case accumulates first-class ambiguities for known-tolerated provenance debt. Neither is wrong in a way that crashes, but both produce noise that erodes trust in the ambiguity register.

5. **Test regression surface.** Two failing tests today, both attributable to this partial landing. Shipping as RC with failing tests is not acceptable; neither is shipping with the tests patched to pass while the underlying behavior remains broken.

## Landing sequence before RC

My recommended landing order appears as Appendix E of the companion SCHEMA post. Short form:

1. Normalize writes a workspace-state artifact (pure addition, no existing behavior change).
2. Add `validate` step that reads checkpoint, produces READY or STALE.
3. Gate `genesis start` on READY.
4. `load_project_profile` prefers the artifact; topology recovery becomes fallback.
5. Remove writes from `_build_module`.
6. Make workspace_mode explicit.
7. Land T-004 on the new substrate.

Steps 1–3 are independently shippable. Steps 4–5 must ship together. Step 6 is a schema evolution. Step 7 is feature work on top of stable substrate.

## Two immediate fixes (test-level, not architectural)

Independent of the larger refactor, these unblock the current failing tests:

- **`test_odd_sdlc_disambiguation_usecase.py`**: add `import shutil` at the top (line 123 uses `shutil.rmtree` without importing).
- **`test_odd_sdlc_iterative_closure_traceability_usecase.py`**: the cleanest fix is to have `normalize_workspace` inject the `requirement_surface` marker when the generated file exists but lacks it. That keeps the test honest (it seeds what a user-authored generator might write), makes normalization responsible for canonicalizing authored content to generated shape, and removes the semantic inconsistency where `goal_surface` has adopted-authority fallback but `requirement_surface` does not. The alternative — seed the marker in the test — is a two-line change but leaves the inconsistency in place.

Both fixes are in scope for a pre-RC patch. The larger architectural work is not.

## Summary for RC decision

The refactor is moving in the correct direction and has substantially landed the analysis and normalization layers. It has not yet landed the runtime-purity work or the workspace-state artifact. If the definition of RC includes "runtime is boring and deterministic," this tree is not RC. If the definition of RC is "analysis and normalization are stable enough to build on," this tree is close — pending the two test fixes and the canonicalization race repair.

My recommendation: do not cut RC on this tree. Land steps 1–3 of the landing sequence first, then cut RC. Steps 4–7 can land post-RC as a progression of minor releases.
