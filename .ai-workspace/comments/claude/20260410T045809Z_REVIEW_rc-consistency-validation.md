# RC Consistency and Validation Review — Capability + Ambiguity + Closure Work

**Author**: Claude (Opus 4.6)
**Date**: 2026-04-10T04:58:09Z
**Status**: Review of uncommitted work prior to RC tag
**Scope**: odd_method repo only (specification_methodology repo not re-read this pass)
**Verdict**: **NOT RC-ready — one deterministic regression and one generalization concern must clear first**

---

## 1. What I Reviewed

The uncommitted working tree on `main` after the incremental capability/ambiguity/closure pass. Focus was on:

- whether REQ-F-ODDSDLC-029/030/031 have full trace from spec through code, design, scenario, and test
- whether the new traceability module, F_D checks, and query contract v7 wire into the runtime end-to-end
- whether the full test suite passes
- whether anything is dangling, orphaned, or internally inconsistent

I did not re-walk the specification_methodology repo on this pass. The cross-repo consistency check from the earlier synthesis still stands; nothing in this pass invalidated it.

## 2. Consistency Matrix

### 2.1 REQ-F-ODDSDLC-029 — carry unresolved live requirements forward

| Layer | Artifact | Status |
|---|---|---|
| Requirement | `specification/requirements/10-odd-sdlc-software-domain-buildout.md:310` | present, 4 ACs |
| Product | `specification/PRODUCT.md` — "Requirement Closure Register" entry | present |
| Goals | `specification/GOALS.md` — iterative closure language | present |
| Scenario | `specification/scenarios/12-iterative-requirement-closure-and-generated-traceability.md` | present, `Validates: 029/030/031` |
| Design | `build_tenants/odd_sdlc/python/design/SOFTWARE_DOMAIN_BUILDOUT.md` | present, 3 new sections |
| Code | `traceability.py` — register builder, status classification | present, `Implements: 029/030/031` |
| Code | `query.py:80` `query_requirement_closure_register`, wired into `query_domain()` | present |
| Code | `query_contract.py` bumped to v7, `requirement_closure_register` in top_level_keys | present |
| Code | `fd_checks.py` — `requirement_scope_complete()` | present |
| Code | `fd_contracts.py:43` — CLI `requirement-scope-complete` | registered |
| Code | `gtl_module.py:262,593` — `_requirement_scope_fd` attached to `derive_requirement_surface` as extra FD | wired |
| Seed | `normalization.py:539` — `build_requirement_closure_register()` written at normalize time | seeded |
| Install | `release/install.py:108,143,162` — register referenced in bootloader | present |
| Asset | `asset_types.py:301`, `workspace_assets.py:37,72,180,234` — `requirement_closure_register_surface` | registered |
| Test | `test_odd_sdlc_iterative_closure_traceability_usecase.py` — 3-stage end-to-end | passes |
| Test | `test_odd_sdlc_first_slice.py:658,742` — register exposed in both `query-state` and `query-domain` | passes |

**Closure**: complete.

### 2.2 REQ-F-ODDSDLC-030 — generated source and test trace authority

| Layer | Artifact | Status |
|---|---|---|
| Requirement | same file, line 326 | present, 4 ACs |
| Scenario | scenario 12, steps 3–6 | present |
| Design | `SOFTWARE_DOMAIN_BUILDOUT.md` — "Generated Traceability Chain" | present |
| Code | `constructor.py` — `Implements:` in `app.py` / `workflow.py`, `Validates:` in generated test files | present |
| Code | `traceability.py` — `_tagged_requirement_ids()`, `implementation_claim_refs`, `test_claim_refs` | present, `Implements: 030` |
| Code | `function_catalog.py:3,91,119` — `Implements: 030` and intent strings mention Implements/Validates trace authority | present |
| Test | same iterative closure test | passes |

**Closure**: complete.

### 2.3 REQ-F-ODDSDLC-031 — deterministic scope and traceability integrity

| Layer | Artifact | Status |
|---|---|---|
| Requirement | same file, line 341 | present, 4 ACs |
| Scenario | scenario 12, step 7 | present |
| Design | `SOFTWARE_DOMAIN_BUILDOUT.md` — "Deterministic Scope And Traceability Gates" | present |
| Code | `fd_checks.py` — `goal_surface_authority_validated`, `requirement_scope_complete`, `code_traceability_present`, `test_traceability_present` | present, `Implements: 031` |
| Code | `fd_contracts.py:33,43,108,138` — four CLI names registered | present, `Implements: 031` |
| Code | `gtl_module.py:260,262,275,281` — four FD evaluators created | present |
| Code | `gtl_module.py:584,593,690,723` — attached to `derive_goal_surface`, `derive_requirement_surface`, `derive_code_surface`, `derive_test_run_archive_surface` as `extra_fd_evaluators` | wired |
| Test | iterative closure test asserts all four return 0 at closure | passes |

**Closure**: code and wiring are complete, but see §3 for the deterministic regression.

## 3. Blocker — deterministic regression in risk_appetite use case

### 3.1 Observed

```
FAILED test_odd_sdlc_risk_appetite_usecase.py::test_low_risk_appetite_escalates_major_ambiguity_to_fh
FAILED test_odd_sdlc_risk_appetite_usecase.py::test_high_risk_appetite_allows_fp_to_carry_major_ambiguity
```

Both tests expect the `start --auto` run to advance to `select_implementation_stack_profile` where the ambiguity register should drive either F_H escalation (low) or F_P carry (high). Both now stop at `derive_goal_surface` with `fd_gap` / returncode 4.

Archived `low_risk.start.json`:

```json
{
  "blocking_reason": "fd_gap",
  "edge": "derive_goal_surface",
  "failing_evaluators": ["goal_surface_authority_validated"],
  "stopped_by": "fd_gap"
}
```

### 3.2 Root cause

`normalization.py:263` `_default_goals_surface()` seeds `GOALS.md` with imported-source bullets but never copies the `INT-###` identifiers from `INTENT.md`. The data_mapper template's `INTENT.md` carries `INT-001` through `INT-006`. The new `goal_surface_authority_validated` FD evaluator (which is deterministically correct) sees six imported intent IDs absent from the generated goals and fails.

This is a **regression introduced by REQ-F-ODDSDLC-031 AC-1** applied to a normalization path that was written before the AC existed. The gate is doing its job; the normalization flow is not yet honoring the gate's precondition.

### 3.3 Other tests survived because they work around it

- `test_data_mapper_template_as_is_requires_scope_and_traceability_work_before_auto_convergence` (`test_odd_sdlc_installation.py:524`) **already expects returncode 4** — it was explicitly updated for the new gates. The test name even encodes the reason.
- `test_odd_sdlc_iterative_closure_traceability_usecase.py:_seed_workspace()` hand-writes a GOALS.md that already contains INT-001/INT-002, bypassing the gap.
- `test_odd_sdlc_first_slice.py:_seed_workspace()` either uses a minimal workspace that has no INT-### anchors, or writes a compliant surface.

The risk_appetite tests are the only ones that (a) use the real `data_mapper.template`, (b) walk the real normalization path, and (c) expect the run to traverse past `derive_goal_surface`. They are **stale relative to REQ-F-ODDSDLC-031** and break the moment the gate exists.

### 3.4 Fix options, ranked

**Option A — principled (preferred for RC)**: extend `_default_goals_surface()` in `normalization.py` to copy forward the `INT-###` IDs it finds in `INTENT.md`. This is what REQ-F-ODDSDLC-031 AC-1 effectively demands: the normalized goals surface should satisfy the authority carry-forward invariant out of the box. Risk_appetite tests then recover automatically and exercise their intended ambiguity-escalation flow.

**Option B — partial fix**: make the risk_appetite test pre-seed its own GOALS.md with the intent IDs before calling `normalize_workspace`. This unblocks the test but leaves the normalization flow permanently non-compliant with its own authority rule for any non-trivial imported INTENT.md.

**Option C — wrong**: weaken the gate or move it behind a flag. This violates REQ-F-ODDSDLC-031.

**Recommendation**: do Option A. It's small (a few lines in `_default_goals_surface`), it's the honest fix, and it closes the loop between the requirement and the flow that is supposed to realize it.

## 4. Generalization concern — traceability paths pinned to the odd_sdlc/python tenant

`traceability.py:19-27` hardcodes:

```
_GENERATED_REQUIREMENT_SURFACE_PATH = specification/requirements/10-generated-bootstrap.md
_IMPLEMENTATION_TRACE_PATHS = (
    build_tenants/odd_sdlc/python/design/40-generated-implementation-design.md,
    build_tenants/odd_sdlc/python/design/40-generated-implementation-modules.md,
)
_TEST_TRACE_PATHS = (
    build_tenants/odd_sdlc/python/test_env/tests/40-generated-test-modules.md,
    specification/scenarios/30-generated-testcase-authority.md,
)
```

These paths match `workspace_assets.py:45-53` exactly, so the proving subset is **internally consistent**. This is not a bug in the RC sense.

However:

- For any workspace whose active tenant is not `odd_sdlc/python` (e.g. the data_mapper `spark_scala` tenant), these paths will never exist. `implementation_claim_refs()` returns `{}`, `missing_code_traceability_ids()` returns `()`, and the `code_traceability_present` FD gate passes vacuously.
- `traceability_scan()` still walks the workspace's real `code_root` and flags every source file without an `Implements:` tag as an orphan. For the data_mapper spark_scala tenant that would be every real scala file — so the gate flips from vacuous pass to hard fail the moment it runs on a non-self-hosting workspace.
- Net effect: the traceability gates only work cleanly on the self-hosting odd_sdlc proving workspace. Anywhere else they either under-cover or over-fail.

This is a **known scope restriction**, not a ship-blocker, because:
1. Nothing in the current test matrix exercises a non-proving-tenant traceability run.
2. The proving subset is explicitly pinned to `odd_sdlc/python` in `workspace_assets.py` and the rest of the pipeline has the same pin.
3. Generalizing to per-tenant trace path resolution is its own scoped change, not an RC hotfix.

I recommend **documenting this as a known limitation in the RC notes** with a follow-up requirement to generalize trace path resolution via `ProjectProfile` rather than hardcoded odd_sdlc paths. The follow-up requirement can reuse the existing `tenant_name`/`output_dir` fields.

## 5. What did pass

- **25 tests pass, 4 skipped** (`test_odd_sdlc_live_codex` skips are appropriate — they need a real transport contract).
- `test_odd_sdlc_iterative_closure_traceability_usecase.py` — the flagship end-to-end for 029/030/031 — passes cleanly across all three stages (missing / specified / realized).
- `test_odd_sdlc_first_slice.py` — 8 tests — all pass with v7 contract and `requirement_closure_register` top-level key.
- `test_odd_sdlc_installation.py` — 10 tests — all pass, including the one that asserts the data_mapper template deliberately blocks at returncode 4 on the new gates.
- `test_odd_sdlc_capability_gating_usecase.py`, `test_odd_sdlc_disambiguation_usecase.py` — pass.
- `test_abg_default_policy_hooks.py` — 2 tests pass.
- Query contract v7 is consistent: `QUERY_DOMAIN_CONTRACT_VERSION = "v7"`, both `query-state` and `query-domain` payloads include `requirement_closure_register` at top level, and first_slice asserts it end-to-end.
- `IGNORE_ROOTS` and `SOURCE_EXTENSIONS` in `project_profile.py:26-48` exist and are consumed correctly by `traceability._is_source_file()`.
- Normalization seeds the closure register at `normalization.py:539-556`, symmetric with the ambiguity register seed above it.
- All three new requirements (029/030/031) have `Implements:` trace in the files that realize them, and `Validates:` trace in the scenario and test files. No orphan REQ tags.

## 6. Cross-check against the earlier incremental review

The 10-bug punch list from `20260410T014643Z_REVIEW_odd-sdlc-capability-ambiguity-audit.md` / incremental review posting:

| Bug | Status |
|---|---|
| 1. F_P dispatch timeout hardcoded too low | closed (1800s, verified) |
| 2. Risk-appetite field not read | closed (`project_profile.py:70`, `ambiguity._policy_action_for_entry()`) |
| 3. Blocking vs hard_stop rename | closed (`hard_stop` field used) |
| 4. Dynamic F_H evaluator injection missing | closed (`gtl_module._clone_leaf_graph_function`) |
| 5. Capability gates not at F_D | closed (`fd_checks` enforces `required_profile_fields`) |
| 6. `construction_complete_pending_execution` posture | closed (see bootloader and scenarios) |
| 7. Ungoverned report flagging | closed (`summarize_test_evidence` adds ungoverned counts) |
| 8. Query contract not bumped | closed (v6 → v7) |
| 9. Requirement carry-forward not enforced | **partially closed** — register exists, gate exists, but **normalization-side seeding of GOALS.md from INTENT.md is missing**, see §3 |
| 10. Generated source not carrying Implements/Validates tags | closed (`constructor.py`) |

Net: 9/10 closed, 1 partially closed. The partial one is the same issue as §3.

## 7. RC Verdict

**Do not tag RC until §3 is fixed.**

Ship conditions, in priority order:

1. **Must fix**: `normalization._default_goals_surface()` carries forward `INT-###` identifiers from `INTENT.md` (Option A in §3.4). Re-run `test_odd_sdlc_risk_appetite_usecase.py`; both tests must pass without any other change.
2. **Must verify after fix**: full suite clean — 27 pass / 4 skipped / 0 fail expected.
3. **Document as known limitation**: traceability path pinning to `odd_sdlc/python` tenant per §4. Open a follow-up requirement to generalize per tenant profile, don't block RC on it.
4. **Optional**: add one explicit assertion in the iterative closure test that `normalize_workspace()` alone (no manual GOALS.md seed) produces a `goal_surface_authority_validated == 0` when INTENT.md carries INT-### anchors. This closes the feedback loop permanently so the §3 bug cannot regress silently again.

Estimated delta to clear: small. The fix is localized to one function; the test re-run is ~70s.

Once (1) and (2) are green, this is RC-ready from my read. The consistency surface between requirement → design → scenario → code → test → scan is clean, the query contract bump is internally consistent end-to-end, and the self-hosting proving subset honors its own invariants.

---

*This is commentary per `workspace://.genesis/docs/standards/POSTING_GUIDE.md`, not law.*
