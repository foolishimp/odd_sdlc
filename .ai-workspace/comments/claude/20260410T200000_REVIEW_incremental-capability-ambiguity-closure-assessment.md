# REVIEW: Incremental Closure Assessment — Capability Gating + Ambiguity Policy Implementation

**Author**: claude-opus-4-6
**Date**: 2026-04-10T20:00:00+11:00
**Addresses**: Uncommitted changes across 20 files in `odd_method` (1427 insertions, 212 deletions) and 1 file in `specification_methodology`, assessed against the combined product-bug list from the Claude and Codex reviews dated 2026-04-10
**Status**: Draft

---

## Summary

This is an incremental review of the uncommitted capability-extension work, assessed against the combined bug list from two prior reviews:

- `20260410T190000_REVIEW_odd-sdlc-capability-extension-cross-repo-assessment.md` (Claude)
- `20260410T014643Z_REVIEW_odd-sdlc-capability-ambiguity-audit.md` (Codex)

21/21 tests pass (233s). The work closes or substantially addresses 7 of the 10 combined product bugs from both reviews. Three residual concerns remain. One is a genuine improvement not anticipated by either review.

| Prior Bug | Status | Evidence |
|-----------|--------|----------|
| PB-CAP-1 (Claude) / Codex #2: test execution not gated | **Closed** | `workspace_assets.py:503–518` — `summarize_test_evidence()` returns zero-count governed evidence when `test_execution_contract` is blank; `test_odd_sdlc_installation.py::test_ungoverned_test_reports_are_not_counted_as_governed_evidence` proves it |
| PB-CAP-2 (Claude): missing constraints → all operational edges | **Closed** | `gtl_module.py` — `_active_operational_leaf_graph_functions()` now returns `()` when no constraints file exists; `test_odd_sdlc_installation.py::test_module_fails_closed_when_constraints_are_absent` proves it |
| PB-AMB-1 (Claude) / Codex #4: hardcoded blocking, no policy | **Closed** | `ambiguity.py:82–91` — `_policy_action_for_entry()` implements risk-appetite-driven policy; `project_profile.py` adds `ambiguity_risk_appetite` field with `low/medium/high`; `hard_stop` field replaces blanket `blocking: True` |
| PB-AMB-2 (Claude): ambiguity register never exercised | **Closed** | `normalization.py:511–528` — register seeded during normalize; test asserts `register_kind`, `summary.total`, `policy_action == "hard_block"` |
| PB-TOP-1 (Claude) / Codex #1: cwd-dependent graph shape | **Partially closed** | `module()` now accepts explicit `workspace_root`; `app.py:40` passes `self.config.workspace_root`; `test_odd_sdlc_installation.py::test_query_domain_uses_explicit_workspace_root_when_called_outside_workspace` proves the CLI path. But `MODULE = _build_module(_active_workspace_root())` at import time still exists at line 1229 |
| PB-TOP-2 (Claude): source-tree vs installed-workspace | **Open** | Same import-time binding; not addressed in this slice |
| Codex #3: catalog still advertises gated-off functions | **Closed** | `app.py:73–128` — catalog now uses `active_function_catalog` and filters programs to `active_executive_programs`; `test_odd_sdlc_installation.py::test_query_domain_uses_explicit_workspace_root_when_called_outside_workspace` asserts gated functions are absent from `programs`, `functions`, and `graph_functions` |

This is a description of current reality, not target direction. Findings are separated from recommendations.

---

## Analysis

### 1. Test Execution Capability Gating — Closed

**Prior bug**: `has_test_execution_capability()` existed but was never called. Test edges traversed regardless of blank `test_execution_contract`.

**What changed**: The fix is not in the graph topology (test edges still traverse — test *design* is a construction concern, not an execution concern). Instead, `summarize_test_evidence()` in `workspace_assets.py:503–518` now checks the profile capability:

```python
if not profile.has_test_execution_capability():
    return {
        "report_file_count": 0,
        "parsed_report_count": 0,
        "tests": 0,
        ...
        "ungoverned_report_file_count": len(report_files),
        "ungoverned_report_paths": report_paths,
    }
```

When the capability is undeclared, test reports are classified as `ungoverned_report_*` and excluded from governed evidence. This means:
- The `constructor.py` completion-state logic sees `parsed_report_count == 0` and produces `construction_complete_pending_execution`
- The release surface cannot claim governed test evidence when no capability is declared
- The reports are still discoverable (counted as ungoverned) but not authoritative

**Test proof**: `test_ungoverned_test_reports_are_not_counted_as_governed_evidence` seeds a workspace with JUnit XML but no declared `test_execution_contract`, verifies `report_file_count == 0`, `ungoverned_report_file_count == 1`.

**Assessment**: This is a better design decision than gating the test edges in the graph. Test *design* surfaces (test design, test stack profile, test module) are construction artifacts that should exist regardless. Only test *execution evidence* requires a declared capability. The approach correctly separates construction from execution evidence.

---

### 2. Missing Constraints Safety Inversion — Closed

**Prior bug**: `_active_operational_leaf_graph_functions()` returned ALL operational functions when no `project_constraints.yml` existed.

**What changed**: `gtl_module.py` — the function now returns `()`:

```python
def _active_operational_leaf_graph_functions(workspace_root):
    if not _workspace_declares_project_constraints(workspace_root):
        return ()  # was: OPERATIONAL_LEAF_GRAPH_FUNCTIONS
```

**Test proof**: `test_module_fails_closed_when_constraints_are_absent` creates a workspace with no constraints file and asserts `release_operational_cycle` is absent and `active_operational_steps == ()`.

**Assessment**: Correct fix, correct test. Fail-closed is the right default.

---

### 3. Ambiguity Policy Mechanism — Closed (Significant New Work)

**Prior bug**: All 4 ambiguity classes hardcoded `blocking: True`, contradicting the ratified doctrine "blocking is policy."

**What changed**: This is the largest single piece of work in the slice. Three interconnected changes:

**3.1 Risk appetite field**: `project_profile.py` adds `ambiguity_risk_appetite` to `ProjectProfile` (loaded from `project_constraints.yml`), with `normalized_risk_appetite()` enforcing `{low, medium, high}`, defaulting to `medium`.

**3.2 Policy action computation**: `ambiguity.py:82–91` — `_policy_action_for_entry()`:

```python
def _policy_action_for_entry(entry, *, risk_appetite):
    if bool(entry.get("hard_stop")):
        return "hard_block"
    ambiguity_class = str(entry.get("class") or "")
    if ambiguity_class == "multiple_realization_roots":
        return "escalate_fh" if risk_appetite in {"low", "medium"} else "fp_decide"
    if ambiguity_class == "declared_root_vs_realized_root_mismatch":
        return "escalate_fh" if risk_appetite == "low" else "fp_decide"
    return "escalate_fh" if risk_appetite == "low" else "fp_decide"
```

The policy actions are:
- `hard_block` — unconditional, for entries with `hard_stop: True` (capability prerequisites)
- `escalate_fh` — requires human approval before the resolving edge can close
- `fp_decide` — F_P may carry the ambiguity forward with a recorded decision

**3.3 `hard_stop` replaces `blocking`**: In `project_profile.py`, `detect_project_profile_ambiguities()` now uses `hard_stop` instead of `blocking`:
- `multiple_realization_roots`: `hard_stop: False` — risk-appetite-driven
- `declared_root_vs_realized_root_mismatch`: `hard_stop: False` — risk-appetite-driven
- `execution_stage_without_declared_capability`: `hard_stop: True` — always blocks (matches SPEC_METHOD hard-stop class: "missing declared capability")
- `declared_capability_absent_but_side_effect_observed`: `hard_stop: True` — always blocks (matches: "undeclared irreversible side effect")

**3.4 Dynamic F_H evaluator injection**: `gtl_module.py` — `_configured_leaf_graph_functions()` reads the ambiguity register, and when `policy_action == "escalate_fh"`, clones the affected leaf graph function with an additional `F_H` evaluator. This means the ABG traversal engine will require human approval before closing the edge — the ambiguity policy is enforced at the graph level, not just in a report.

**3.5 Enrichment pipeline**: `ambiguity.py:105–173` — `_enrich_entry()` adds `policy_action`, `decision_owner`, `decision_status`, `decision_basis`, `decision_event_refs`, `risk_appetite` to each entry. It consults the event stream for prior `graph_call_closed` and `approved` events to determine if the decision has already been made.

**Test proof**: `test_normalize_workspace_standardizes_imported_workspace_shape` verifies the register is created, has the correct `register_kind`, and that the `missing-deployment-capability` entry gets `policy_action: "hard_block"`.

**Assessment**: This is a clean implementation of the SPEC_METHOD doctrine. The risk appetite → policy action → graph topology chain is well-constructed. The `hard_stop` / `escalate_fh` / `fp_decide` taxonomy maps directly to the method's "hard-stop class" / "escalate to F_H" / "bounded F_P decision-making" language.

**One concern**: The `_policy_action_for_entry()` function has class-specific logic for `multiple_realization_roots` and `declared_root_vs_realized_root_mismatch`, but the default fallback (`return "escalate_fh" if risk_appetite == "low" else "fp_decide"`) applies to any future ambiguity class. This means new ambiguity classes will default to `fp_decide` at medium/high risk appetite. That's probably correct for most cases, but it means a new ambiguity class that should always be a hard stop could be missed if the author forgets to set `hard_stop: True` in the detection entry. The policy function and the detection function must agree. Consider whether the hard-stop determination should live in one place, not two.

---

### 4. Ambiguity Register Now Exercised — Closed

**Prior bug**: Register designed and coded but never seeded in any real workspace.

**What changed**: `normalization.py:511–528` seeds the register during `normalize_workspace()`:

```python
ambiguity_payload = build_ambiguity_register(root, stage="normalize_workspace")
ambiguity_content = json.dumps(ambiguity_payload, indent=2, sort_keys=True)
if not ambiguity_path.exists():
    _write_text(ambiguity_path, ambiguity_content, ...)
else:
    existing_ambiguity = ambiguity_path.read_text(encoding="utf-8")
    if existing_ambiguity != ambiguity_content:
        _write_text(ambiguity_path, ambiguity_content, ...)
```

The normalization report action list now includes `create_ambiguity_register` or `update_ambiguity_register`. The register is also refreshed by `refresh_ambiguity_register()` when the module is built (`_configured_leaf_graph_functions`) or when the catalog is queried (`load_or_build_ambiguity_register`).

**Test proof**: The normalization test asserts the register JSON exists and has correct structure, total count, and policy action for a specific entry.

**Assessment**: Closed. The register is now exercised in the test suite. However, it has still not been exercised in a real dogfood traversal (test23+). The normalization seeding and query-time refresh paths are proven; the traversal-time behavior (where the register influences graph topology via F_H injection) is proven at the unit level but not yet at the integration level.

---

### 5. Catalog Dishonesty — Closed

**Prior bug (Codex #3)**: Published catalog still advertised gated-off operational functions and programs even when the active module had removed them.

**What changed**: `app.py:73–128` now uses capability-aware catalog filtering:

```python
active_function_catalog = list(module.metadata.get("function_catalog", FUNCTION_CATALOG))
active_executive_programs = set(module.metadata.get("executive_graph_functions", ()))
...
"functions": [entry.to_dict() if hasattr(entry, "to_dict") else entry for entry in active_function_catalog],
"programs": [entry.to_dict() for entry in PROGRAM_CATALOG if entry.name in active_executive_programs],
```

And `gtl_module.py` — `_active_function_catalog()` filters `FUNCTION_CATALOG` to only include entries whose `backing_graph_function` is in the set of active functions (leaf + operational).

**Test proof**: `test_query_domain_uses_explicit_workspace_root_when_called_outside_workspace` asserts that `release_operational_cycle` is not in programs, and `prepare_deployment_surface` is not in functions or graph_functions.

**Assessment**: Correct fix. The catalog now reflects the active module's capability-gated topology.

---

### 6. CWD-Dependent Graph Shape — Partially Closed

**Prior bug (Codex #1 / Claude PB-TOP-1)**: Module topology depended on `Path.cwd()`, not on the workspace being operated.

**What changed**: `module()` now accepts an explicit `workspace_root` parameter:

```python
def module(workspace_root: Path | str | None = None) -> Module:
    if workspace_root is None:
        return _build_module(_active_workspace_root())
    return _build_module(Path(workspace_root).resolve())
```

All callers in `app.py` now pass `self.config.workspace_root` or the explicit workspace path.

**Test proof**: `test_query_domain_uses_explicit_workspace_root_when_called_outside_workspace` runs `query-domain --workspace <path>` from the `odd_method` root (which has its own constraints file) and verifies the result reflects the target workspace's capabilities, not the cwd's.

**What remains**: `MODULE = _build_module(_active_workspace_root())` still exists at line 1229. This import-time evaluation means any code that imports `odd_sdlc.gtl_module` and accesses `MODULE` directly (rather than calling `module()`) will get the cwd-dependent version. The `module()` function bypasses this when called with a workspace root, but the module-level constant is still cwd-bound.

**Assessment**: The primary operational path (via `app.py` → `module(workspace_root)`) is fixed. The residual import-time binding is a development/testing ergonomics issue, not a production correctness issue — but it should be cleaned up.

---

### 7. Unanticipated Improvement: Dynamic F_H Evaluator Injection

Not in either prior review's bug list. `gtl_module.py` — `_configured_leaf_graph_functions()` and `_clone_leaf_graph_function()` implement a mechanism where the ambiguity register's `escalate_fh` entries dynamically inject `F_H` evaluators onto the affected graph edges. This means:

- When ambiguity risk appetite is `low` and a `multiple_realization_roots` ambiguity is active, the `select_implementation_stack_profile` edge gets an F_H evaluator requiring human approval
- The ABG traversal engine will halt at that edge and require explicit human approval before closing it
- The decision is recorded in the event stream and can be referenced by the register's enrichment logic

This closes the loop between the ambiguity register (detection) and the traversal engine (enforcement). The ambiguity policy is not just a report — it directly shapes the graph topology. This is a strong architectural choice.

**Evidence**: `gtl_module.py` — `_ambiguity_fh_evaluator()` creates the evaluator with a description referencing the active ambiguity titles. `_clone_leaf_graph_function()` clones the graph function with the additional evaluator and an `ambiguity_policy` declaration on the vector.

---

### 8. Additional Improvements Not in Prior Bug Lists

**8.1 Dispatch timeout now declared in graph function declarations**: `gtl_module.py:428–435` — each graph function now carries `("config", Attrs(entries=(("timeout", 1800),)))` in its dispatch declaration. This makes the timeout visible to the ABG runtime without hardcoding it in the transport layer. `test_default_claude_manifest_declares_domain_dispatch_timeout` verifies the resolved manifest contains `dispatch.config.timeout == 1800`.

**8.2 `expected_resolving_edge` now populated for capability ambiguities**: `project_profile.py:222–227` maps each capability field to its resolving edge (`test_execution_contract` → `derive_test_run_archive_surface`, etc.). This closes Codex's note that "capability ambiguities set `expected_resolving_edge` to `None`."

**8.3 Normalization seeds capability fields and risk appetite in constraints**: `normalization.py` ensures `ambiguity_risk_appetite`, `test_execution_contract`, `deployment_contract`, and `runtime_observation_contract` are present in `project_constraints.yml` after normalization. New workspaces get correct defaults; legacy workspaces are backfilled.

**8.4 Gap count corrected from 21 to 18**: Tests now assert 18 gaps (not 21) because operational edges are no longer included in the gap count when capabilities are undeclared.

---

## Residual Concerns

### R-1: Import-time module binding (Low)

`MODULE = _build_module(_active_workspace_root())` at `gtl_module.py:1229` still exists. Not urgent — the operational path uses `module(workspace_root)` — but it's a latent source of cwd-dependent behavior for any code that imports `MODULE` directly.

### R-2: Hard-stop determination split across two locations (Low)

`hard_stop: True/False` is set in `project_profile.py::detect_project_profile_ambiguities()` per entry. The policy function in `ambiguity.py::_policy_action_for_entry()` reads it but also applies class-specific logic for non-hard-stop entries. A future ambiguity class where the author forgets `hard_stop: True` in the detection entry will silently fall through to `fp_decide` at medium/high appetite. Consider whether the canonical hard-stop determination should live in one authoritative list.

### R-3: Test execution F_D check still has no `required_profile_fields` (Low)

The test-execution gating was implemented at the evidence-summarization level (correct), but the F_D check rules in `fd_checks.py:87–98` for test edges still have no `required_profile_fields`. This is acceptable given the chosen design (gate evidence, not edges), but it means the F_D check for `test-run-archive-dependency-surfaces-present` will pass even when test execution is ungoverned. The `summarize_test_evidence()` gating prevents the ungoverned evidence from reaching the release surface, so this is defense-in-depth rather than a correctness gap.

---

## Recommended Action

1. **Clean up import-time binding** (R-1): Replace `MODULE = _build_module(_active_workspace_root())` with a lazy accessor or remove the module-level constant entirely now that `module(workspace_root)` is the primary API.

2. **Consolidate hard-stop authority** (R-2): Consider a single `HARD_STOP_AMBIGUITY_CLASSES` constant that both detection and policy reference, rather than distributing the decision across `hard_stop: True` fields in detection entries and class-specific logic in the policy function.

3. **Run a real dogfood traversal** with the new code installed: The normalization, register, policy, and F_H injection paths are all proven at the unit/CLI level. The end-to-end traversal path — where the register shapes the live graph and a real F_P dispatch encounters an F_H-gated edge — has not yet been proven.

---

## Verification

```
21 passed in 233.40s
```

All tests pass, including 8 new tests:
- `test_module_gates_operational_cycle_without_declared_capability`
- `test_module_publishes_operational_cycle_when_capability_is_declared`
- `test_module_fails_closed_when_constraints_are_absent`
- `test_query_domain_uses_explicit_workspace_root_when_called_outside_workspace`
- `test_ungoverned_test_reports_are_not_counted_as_governed_evidence`
- `test_default_claude_manifest_declares_domain_dispatch_timeout`

Plus updated assertions in existing tests for ambiguity register, capability fields, corrected gap count (21→18), and query-domain v6.
