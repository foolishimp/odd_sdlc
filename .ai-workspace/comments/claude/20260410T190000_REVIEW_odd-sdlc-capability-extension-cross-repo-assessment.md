# REVIEW: odd_sdlc Capability Extension — Cross-Repo Assessment of Landed RC and Uncommitted Work

**Author**: claude-opus-4-6
**Date**: 2026-04-10T19:00:00+11:00
**Addresses**: odd_sdlc software-domain RC (landed: `5216278`), uncommitted capability-extension work across `odd_method` (19 files) and `specification_methodology` (1 file), and their combined effect on ambiguity governance, capability gating, test evidence, workspace topology, and release honesty
**Status**: Draft

---

## Summary

This review examines both the landed odd_sdlc software-domain RC (`5216278 Land odd_sdlc software-domain RC candidate`) and the current uncommitted capability-extension work across two repositories:

- **odd_method**: 19 uncommitted files spanning `gtl_module.py`, `project_profile.py`, `ambiguity.py`, `normalization.py`, `fd_checks.py`, `constructor.py`, `query_contract.py`, `asset_types.py`, `workspace_assets.py`, `query.py`, `install.py`, constitutional surfaces, design, and tests
- **specification_methodology**: 1 uncommitted file — `SPEC_METHOD.md` (ambiguity governance doctrine)

The work is structurally sound. The ambiguity doctrine is correct and minimal. Capability gating works for deployment/runtime/retrofit edges. The query contract v6 is clean. Constitutional surfaces are internally consistent.

But three gaps remain load-bearing:

1. **Test execution is not gated.** `has_test_execution_capability()` exists in code but is never called by `gtl_module.py`. Test edges traverse regardless of whether `test_execution_contract` is declared. This is a capability leakage.
2. **All ambiguity classes are hardcoded `blocking: True`.** The ratified method says "Blocking is policy." No policy mechanism exists. The code contradicts the doctrine.
3. **The ambiguity register is designed and coded but never exercised.** test20/21/22 all lack the register JSON. The feature has not been proven in any real workspace traversal.

This is a description of current reality (landed RC + uncommitted work). Findings are separated from recommendations.

---

## Analysis

### Area 1: Method-Level Ambiguity Doctrine (SPEC_METHOD.md)

**Question**: Is the method-level ambiguity doctrine now correct and minimal?

**Verdict**: Yes. The doctrine is correct, minimal, and contained to one authority surface.

The uncommitted changes to `specification_methodology/specification/standards/SPEC_METHOD.md` add a bounded ambiguity governance section with three properties:

1. **Detection is mandatory, blocking is policy** (line 206). This is the load-bearing sentence. It separates the obligation to surface ambiguity from the decision about whether to halt on it.

2. **Risk-appetite-driven escalation**. Projects choose their own threshold between `F_P` bounded processing and `F_H` escalation. The method does not hardcode a single blocking policy.

3. **Small hard-stop exception class**. Five conditions remain hard stops regardless of risk appetite: violated invariant, absent required authority surface, missing declared capability, undeclared irreversible side effect, explicit policy gate (lines 223–229).

The doctrine does not leak into other surfaces. It does not redefine GTL or ABG semantics. It adds one governance concern — how major ambiguity is handled at boundaries — and contains it within SPEC_METHOD.

**Evidence**: `specification_methodology/specification/standards/SPEC_METHOD.md` lines 195–229.

**Risk**: None. The doctrine is well-bounded.

---

### Area 2: Constitutional Surface Consistency

**Question**: Do the constitutional and design surfaces across odd_method remain internally consistent?

**Verdict**: Yes. Strong internal consistency, no contradictions found.

Reviewed surfaces:
- `specification/GOALS.md` — 4 goals (G-1 through G-4), aligned with product and requirements
- `specification/PRODUCT.md` — product identity and scope declaration
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md` — 28+ requirements (REQ-F-ODDSDLC-*, REQ-F-ASSETMODEL-*, REQ-F-QUERYDOM-*)
- `specification/scenarios/TESTCASE_AUTHORITY.md` — testcase authority with scenario coverage
- `build_tenants/odd_sdlc/python/design/SOFTWARE_DOMAIN_BUILDOUT.md` — software-domain design

The requirement numbering is stable. The design traces back to requirements via explicit `Implements:` headers. The goals do not contradict the requirements or product surface. The testcase authority cross-references scenario coverage against requirements.

No foreign ontology is introduced. No stale contradictions detected. The ABG/GTL boundary is preserved — the design speaks in terms of odd_sdlc workspace governance, not GTL graph algebra.

---

### Area 3: Capability Gating Implementation

**Question**: Does odd_sdlc implement capability gating without breaking the generic framework model?

**Verdict**: Partially. Deployment/runtime/retrofit gating works correctly. Test execution gating has a structural gap.

#### 3.1 What works: Operational edge gating

`gtl_module.py:1066–1076` — `_active_operational_leaf_graph_functions()`:

```python
def _active_operational_leaf_graph_functions(workspace_root):
    if not _workspace_declares_project_constraints(workspace_root):
        return OPERATIONAL_LEAF_GRAPH_FUNCTIONS  # BUG — see §3.3
    profile = load_project_profile(workspace_root)
    active = []
    if profile.has_deployment_capability():
        active.append(GF_PREPARE_DEPLOYMENT)
    if profile.has_deployment_capability() and profile.has_runtime_observation_capability():
        active.append(GF_DERIVE_RUNTIME_OBSERVATION)
        active.append(GF_DERIVE_RETROFIT_PLAN)
    return tuple(active)
```

When `project_constraints.yml` exists and capability fields are empty, the operational edges (deployment, runtime observation, retrofit) are correctly excluded from the traversal graph. This was proven in test22: all three fields were empty strings, and the three operational edges did not traverse. The gating is in the graph topology itself — the edges are removed from the module, not just skipped.

F_D enforcement is also correct: `fd_checks.py:134–137` — the `required_profile_fields` gate on deployment/runtime/retrofit F_D evaluators checks that the declared capability field has a non-empty stripped value. If the field is blank, F_D fails.

#### 3.2 What is missing: Test execution is not gated

`has_test_execution_capability()` exists at `project_profile.py:83` but is **never called** by `gtl_module.py`. The test edges (`derive_test_design_surface`, `select_test_stack_profile`, `derive_test_module_surface`, `derive_test_run_archive_surface`, `qualify_testcase_authority`) are always included in the graph, regardless of whether `test_execution_contract` is declared.

Furthermore, the F_D checks for test edges (`fd_checks.py:87–98`) have **no `required_profile_fields`**:

```python
"test-design-dependency-surfaces-present": CheckRule(
    required_generated_assets=("design_surface", "scenario_surface"),
),  # no required_profile_fields
"test-run-archive-dependency-surfaces-present": CheckRule(
    required_generated_assets=("test_module_surface", "test_stack_profile"),
),  # no required_profile_fields
```

Compare to deployment, which does require a capability field:

```python
"deployment-dependency-surfaces-present": CheckRule(
    required_generated_assets=("release_surface",),
    required_profile_fields=("deployment_contract",),
),
```

The test execution capability field is only used in two places:
1. `project_profile.py:187` — inside `detect_project_profile_ambiguities()`, where it can emit a `missing-test-execution-capability` ambiguity
2. `project_profile.py:239` — a secondary ambiguity when test report files exist without a declared capability

Neither of these actually prevents the test edges from traversing. They surface the problem as an ambiguity entry, but since the ambiguity register is not yet exercised in real traversals (see Area 5), the information goes nowhere.

**Result**: In test22, `test_execution_contract: ""` and yet all 5 test edges traversed and declared convergence. The F_P actor ran sbt tests and produced 149 passing results — real evidence, but produced without a governing capability contract. This is exactly the kind of leakage the capability system was designed to prevent.

#### 3.3 Missing constraints file: all operational edges activate

`gtl_module.py:1067–1068`:

```python
if not _workspace_declares_project_constraints(workspace_root):
    return OPERATIONAL_LEAF_GRAPH_FUNCTIONS
```

When no `project_constraints.yml` exists, **all** operational functions (deployment, runtime observation, retrofit) are returned unconditionally. The intent appears to be a permissive default for workspaces that predate the capability system. But the effect is that any workspace without a constraints file will attempt deployment, runtime observation, and retrofit traversal with no governing capability declaration.

This is a safety inversion: the absence of a governance declaration results in maximum capability, not minimum.

#### 3.4 Workspace root traversal ambiguity

`gtl_module.py:1054–1059`:

```python
def _active_workspace_root(start=None):
    current = (start or Path.cwd()).resolve()
    for candidate in (current, *current.parents):
        return candidate  # first match
    return current
```

This traverses parent directories looking for `project_constraints.yml`. It can pick up a constraints file from a parent workspace, binding the module to the wrong project's capability declarations. At `gtl_module.py:1229`, `MODULE = _build_module(_active_workspace_root())` is evaluated at import time, meaning the module's topology is determined by whichever workspace root is found during Python import.

---

### Area 4: Ambiguity Blocking Policy

**Question**: Is ambiguity being surfaced correctly but over-blocked in the current implementation?

**Verdict**: Yes. Surfacing is correct. Blocking contradicts the ratified method.

#### 4.1 What the method says

SPEC_METHOD (uncommitted): "Ambiguity detection is mandatory. Blocking is policy." Projects should choose their own threshold based on declared risk appetite. Only a small hard-stop class should be unconditionally blocking.

#### 4.2 What the code does

All four ambiguity classes in `project_profile.py:117–269` are hardcoded `blocking: True`:

| Ambiguity Class | `blocking` | Should it be a hard stop per SPEC_METHOD? |
|----------------|-----------|------------------------------------------|
| `multiple_realization_roots` | `True` | Arguable — could be a hard stop (competing roots is genuinely dangerous) |
| `declared_root_vs_realized_root_mismatch` | `True` | Arguable — could be a hard stop |
| `execution_stage_without_declared_capability` | `True` | Yes — this is "missing declared capability" in the hard-stop class |
| `declared_capability_absent_but_side_effect_observed` | `True` | No — this is an observation, not a violated invariant |

The merge logic in `ambiguity.py:29–77` accumulates ambiguities and auto-resolves disappeared ones, but has no mechanism to read a project-level policy and override the blocking status. The `_summary()` function defaults to `blocking: True` if the field is missing — making the default maximally restrictive.

#### 4.3 The practical consequence

The over-blocking is currently harmless because the ambiguity register is not yet enforced as a traversal gate. But if/when the register is wired into the traversal engine as a gate, every workspace with a side-effect observation (e.g., test reports existing without a declared test execution contract — which is the normal case for test22) will be hard-blocked.

The gap is: no `blocking_policy` mechanism exists. The code needs a way for project-level policy to declare which ambiguity classes are blocking vs. carry-forward for a given risk appetite.

---

### Area 5: Ambiguity Register Deployment Status

**Question**: Is the ambiguity register feature actually exercised?

**Verdict**: No. The feature is designed and coded but has not been proven.

- `asset_types.py:291–300` defines `ambiguity_register_surface` with semantic facets
- `normalization.py` seeds the register via `build_ambiguity_register()` as a side effect of `normalize_workspace()`
- `query_contract.py` includes `ambiguity_register` in query-domain v6 (16 top-level keys)
- `project_profile.py:117–269` emits 4 ambiguity classes with full structured entries

But:

- test20, test21, and test22 contain **no** `ambiguity_register` JSON in their workspaces
- No traversal log references the register
- The normalization step that seeds the register may not have been in the installed genesis version that ran test20–22

The feature exists in source code. It does not exist in production evidence. The gap between "coded" and "proven" is the same gap this review is about.

---

### Area 6: Release and Runtime Surface Honesty

**Question**: Are release/runtime surfaces now honest enough about `construction_complete_pending_execution`?

**Verdict**: Yes. The `constructor.py` logic is correct and consistent.

`constructor.py` uses the same three-way completion state across release, deployment, and runtime observation surfaces:

```python
if test_summary["parsed_report_count"] == 0:
    completion_state = "construction_complete_pending_execution"
elif test_summary["failures"] == 0 and test_summary["errors"] == 0:
    completion_state = "execution_evidence_recorded"
else:
    completion_state = "execution_evidence_recorded_with_failures"
```

This appears at lines 965–970, 1022–1027, and 1067–1072. The logic is identical in all three places. When no test reports are parsed, the surface honestly declares pending execution rather than claiming convergence.

In test22, the release surface declared `construction_complete_pending_execution` with explicit documentation of which modules were not compiled (cdme-execution) and which requirements were deferred. This is a genuine improvement over test12, which claimed full convergence on wrong-language toy code.

**One concern**: The completion state is honest, but the genesis engine's convergence model still accepts `construction_complete_pending_execution` surfaces as converged (delta=0). The surface tells the truth; the engine doesn't act on it. A release surface that says "I have no execution evidence" should arguably cause the release edge's F_D check to emit a different signal than one that says "execution evidence recorded with zero failures."

---

### Area 7: Workspace Topology

**Question**: Is the workspace topology still too ambiguous, especially product output root vs framework payload root?

**Verdict**: Yes, there is residual ambiguity, but the capability system partially addresses it.

#### 7.1 The topology problem

`_active_workspace_root()` at `gtl_module.py:1054–1059` traverses parent directories to find `project_constraints.yml`. This is evaluated at import time (`MODULE = _build_module(_active_workspace_root())` at line 1229). The module topology — which edges exist, which operational functions are active — is fixed at import based on whichever constraints file the traversal finds.

In a clean workspace like test22, this works: `project_constraints.yml` exists at the workspace root, and the traversal finds it immediately. In development or CI environments where the cwd might be a subdirectory, or where multiple nested workspaces exist, the parent traversal can bind to the wrong workspace.

#### 7.2 Source-tree vs installed-workspace incoherence

The `odd_sdlc` module is both:
- Developed in the `odd_method` source tree (where `project_constraints.yml` governs odd_method itself)
- Installed into target workspaces (where `project_constraints.yml` governs the target project)

When running tests or developing in the source tree, `_active_workspace_root()` finds odd_method's own constraints file and builds the module with odd_method's capabilities — not the target workspace's. The tests work around this with fixture-created temporary workspaces, but the production import path (`MODULE = _build_module(...)` at module scope) does not distinguish these contexts.

#### 7.3 Product output root detection

`project_profile.py:111–114` provides `realization_candidates_for_declared_root()` and the ambiguity detection emits `multiple_realization_roots` and `declared_root_vs_realized_root_mismatch` when competing output trees exist. This is good — the topology ambiguity is surfaced.

But since the ambiguity register is not yet exercised (Area 5) and all ambiguities are hardcoded blocking (Area 4), the surfacing has no practical effect yet.

---

### Area 8: Test Evidence Quality

**Question**: Do the tests prove the behavior end-to-end, or mostly assert local structure?

**Verdict**: Mixed. ~50% excellent behavioral proof, ~25% good, ~25% weak structure-only.

#### 8.1 Test inventory

| Test File | Count | Quality | Verdict |
|-----------|-------|---------|---------|
| `test_odd_sdlc_capability_gating_usecase.py` | 2 | Excellent | Multi-stage behavioral proof — builds workspace, runs gap analysis, verifies operational edges are correctly gated/ungated based on declared capabilities |
| `test_odd_sdlc_disambiguation_usecase.py` | 1 | Excellent | State-transition proof — creates ambiguity, verifies detection, resolves, verifies auto-resolution on re-normalization |
| `test_odd_sdlc_first_slice.py` | 7 | Mixed | Catalog and query-domain tests are good behavioral proof; some tests only assert string presence in generated text |
| `test_odd_sdlc_installation.py` | 6 | Mixed | Good: verifies genesis.yml structure, node/edge counts, evaluator regimes. Weak: some tests are tautological (assert the module object exists) |

The capability gating and disambiguation tests are the best in the suite. They prove actual behavior transitions end-to-end: workspace creation → normalization → ambiguity detection → capability gating → correct edge topology. This is the right level of testing for a framework.

#### 8.2 Gaps

- **No test for the missing-constraints fallback.** `_active_operational_leaf_graph_functions()` returns ALL operational functions when no constraints file exists (the safety inversion from Area 3.3). No test asserts this behavior or catches it as a defect.
- **No test for test-execution capability gating.** The capability gating test verifies deployment/runtime gating but does not verify that test edges should be gated when `test_execution_contract` is blank. This mirrors the production gap — the code doesn't gate test execution, and neither does the test suite.
- **REQ-F-ODDSDLC-027 claimed by two test files.** Both `test_odd_sdlc_installation.py` and `test_odd_sdlc_first_slice.py` claim to validate this requirement. The installation test checks for the requirement key's presence in the module's req_refs; the first-slice test exercises behavioral aspects. This is not a contradiction, but the dual claim should be reconciled in the testcase authority.

---

## Synthesis: Answers to the 7 Main Questions

| # | Question | Answer |
|---|----------|--------|
| 1 | Is the method-level ambiguity doctrine correct and minimal? | **Yes.** SPEC_METHOD is clean, bounded, contained. No leakage. |
| 2 | Does odd_sdlc implement capability gating without breaking the generic model? | **Partially.** Deployment/runtime/retrofit: correct. Test execution: not gated. Missing constraints: safety inversion. |
| 3 | Is ambiguity surfaced correctly but over-blocked? | **Yes.** Detection is thorough (4 classes, structured entries). All hardcoded `blocking: True` contradicts the doctrine. No policy mechanism. |
| 4 | Is there still leakage where side effects occur without a declared capability? | **Yes.** Test execution is the concrete case. test22: `test_execution_contract: ""`, yet 5 test edges traversed and 149 tests ran. |
| 5 | Are release/runtime surfaces honest about pending execution? | **Yes.** `construction_complete_pending_execution` logic is correct and consistent across 3 surfaces. But the engine still accepts this as converged. |
| 6 | Is workspace topology still ambiguous? | **Yes, residually.** Parent traversal can bind to wrong workspace. Source-tree vs installed-workspace import behavior is not distinguished. Ambiguity detection exists but is not yet enforced. |
| 7 | Do tests prove behavior end-to-end? | **~50% yes.** Capability gating and disambiguation tests are excellent behavioral proofs. Installation and first-slice tests are mixed. No test covers the missing-constraints fallback or test-execution gating. |

---

## Product Bugs Identified

| # | Bug | Severity | Where |
|---|-----|----------|-------|
| PB-CAP-1 | `has_test_execution_capability()` exists but is never called by `gtl_module.py`; test edges are always active regardless of declared capability | High | `gtl_module.py` — no call to `has_test_execution_capability()` in `_active_operational_leaf_graph_functions()` or edge definition; `fd_checks.py:87–98` — test F_D checks have no `required_profile_fields` |
| PB-CAP-2 | Missing `project_constraints.yml` causes all operational edges to activate (safety inversion: no governance → max capability) | High | `gtl_module.py:1067–1068` — `return OPERATIONAL_LEAF_GRAPH_FUNCTIONS` when no constraints file found |
| PB-AMB-1 | All 4 ambiguity classes hardcoded `blocking: True`; contradicts ratified doctrine "blocking is policy"; no project-level policy mechanism | Medium | `project_profile.py:134,164,221,251` — literal `"blocking": True`; `ambiguity.py` — no policy override interface |
| PB-AMB-2 | Ambiguity register designed and coded but never exercised in any workspace traversal | Medium | test20/21/22 all lack register JSON; `normalization.py` seeds it but installed genesis versions may not include the code |
| PB-TOP-1 | `_active_workspace_root()` parent traversal can bind module topology to wrong workspace's constraints | Medium | `gtl_module.py:1054–1059` — traverses parents; `gtl_module.py:1229` — `MODULE = _build_module(...)` at import time |
| PB-TOP-2 | Source-tree vs installed-workspace import not distinguished; running in source tree binds to odd_method's own constraints | Low | `gtl_module.py:1229` — module-scope evaluation |

---

## Recommended Action

### Priority 1: Close the test-execution capability gap (PB-CAP-1)

Wire `has_test_execution_capability()` into the edge topology, mirroring the deployment/runtime pattern. The test edges should not be excluded from the graph (test design is a construction concern), but the test *execution* edge (`derive_test_run_archive_surface`) should gate on a declared `test_execution_contract` — either by adding `required_profile_fields=("test_execution_contract",)` to the test-run-archive F_D check, or by conditionally including the test execution edge in the graph function list.

This is the most immediately actionable fix. It closes the demonstrated leakage (test22 producing ungoverned test evidence) with a one-line F_D check change.

### Priority 2: Fix the missing-constraints safety inversion (PB-CAP-2)

When no `project_constraints.yml` exists, return an empty tuple instead of all operational functions:

```python
if not _workspace_declares_project_constraints(workspace_root):
    return ()  # no governance → no operational capability
```

This is a two-character fix with a large safety impact. Test coverage should be added simultaneously.

### Priority 3: Add a blocking-policy mechanism (PB-AMB-1)

The ambiguity register needs a way to read project-level risk appetite and override the hardcoded `blocking: True`. Options:

- A `blocking_policy` field in `project_constraints.yml` mapping ambiguity classes to `block | carry | escalate`
- A default policy that matches the SPEC_METHOD hard-stop class (blocking for violated invariants, missing capabilities, undeclared side effects; carry-forward for observational ambiguities)

This is a design decision, not a one-line fix. The blocking tension should be resolved before the ambiguity register is wired into the traversal engine as a gate — otherwise, every workspace with test evidence and no declared test execution contract will be hard-blocked.

### Priority 4: Exercise the ambiguity register (PB-AMB-2)

Run a workspace traversal with the current uncommitted code (which includes the register seeding in `normalization.py`) and verify that the register JSON is produced, contains the expected ambiguity entries, and survives the full traversal lifecycle. This is a validation task, not a code change.

### Future: Workspace topology cleanup (PB-TOP-1, PB-TOP-2)

The parent traversal and import-time binding are not urgent — they affect development ergonomics more than production correctness. But they should be addressed before odd_sdlc is used in CI/CD environments where cwd is not predictable.

---

## Evidence Corpus

| Source | Location | State |
|--------|----------|-------|
| SPEC_METHOD ambiguity doctrine | `specification_methodology/specification/standards/SPEC_METHOD.md` | Uncommitted |
| odd_sdlc RC | `odd_method` commit `5216278` | Landed |
| Capability-extension work | `odd_method` — 19 uncommitted files | Working tree |
| gtl_module.py | `odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py` | Uncommitted changes |
| project_profile.py | `odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/project_profile.py` | Uncommitted changes |
| fd_checks.py | `odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py` | Uncommitted changes |
| ambiguity.py | `odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/ambiguity.py` | Uncommitted changes |
| constructor.py | `odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/constructor.py` | Uncommitted changes |
| query_contract.py | `odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/query_contract.py` | Uncommitted changes |
| test22 workspace | `ai_sdlc_examples/local_projects/data_mapper.test22/` | Committed |
| test22 project_constraints.yml | `data_mapper.test22/.ai-workspace/context/project_constraints.yml` | Committed |
| test22 fp_results | `data_mapper.test22/.ai-workspace/fp_results/` | Committed |
| Prior test22 self-assessment | `odd_method/.ai-workspace/comments/claude/20260410T163000_REVIEW_test22-autonomous-genesis-convergence-assessment.md` | On disk |
