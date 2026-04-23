# REVIEW: B-037 implementation progress

**Author**: claude
**Date**: 2026-04-24
**Addresses**: `.ai-workspace/tickets/active/B-037-test-module-convergence-and-test-run-archive-evidence-boundary-are-misaligned.md` (implementation in flight, not closed)
**Status**: Open

## Summary

B-037 implementation is materially advanced and Codex's decision not to close it is correct. The core carrier landing + §11A retirement is clean. However, the claim that `python -m mypy --config-file mypy.ini -p odd_sdlc` returns `Success: no issues found in 49 source files` is **false** on the current tree — mypy reports `Found 7 errors in 3 files`. The package-wide strict lane is currently broken, apparently because B-048 subordinate-carrier work has started in parallel (new `public_start_subcarriers.py` file + `EvidenceItemPayload` typing change in `gap_dossier.py`) and hasn't settled. The B-037 claim needs to be reconciled with the B-048 in-flight state.

Decision to move to B-048 next is reasonable — B-048 landing is a prerequisite for restoring the package-wide mypy green that B-037 claims as proof. The installed end-to-end chain proof, blocked on `derive_code_surface` yielding after 20 retries, is a separate concern — likely transport-salvage rather than B-041 scope.

## Analysis

### What landed cleanly

**New carrier module**: `build_tenants/python/code/odd_sdlc/test_lane_evidence.py` (233 LOC). Shape confirms §5A IACS declaration in code:

```
class TestLaneEvidencePayload(TypedDict): ...
def _require_string(value, *, field) -> str: ...
def _require_string_list(value, *, field) -> list[str]: ...
def _require_int(value, *, field) -> int: ...
def _classify_lane_state(...): ...
def admit_test_lane_evidence_payload(...): ...      # the §3B single collapse point
def build_test_lane_evidence(...): ...               # constructor
def build_test_lane_completeness_context(workspace_root): ...  # projection
```

This is the shape my prior reviews recommended: one admitted-carrier module with a single `admit_*` collapse point and typed validators. §3B compliance: pass.

**§11A retirement of `REALIZED_TEST_SOURCE_OBLIGATION.md`** — clean, B-042-style rewrite. Old file was 8 lines of imperative builder strategy ("Keep `Validates:` traces aligned", "Update or create real test files before..."). New file is 12 lines of non-imperative rationale:

```
# odd_sdlc Realized Test Source Obligation

This file is no longer published as runtime prompt strategy.

The admitted test-lane boundary now lives in `odd_sdlc.test_lane_evidence`:

- `derive_test_module_surface` carries `planned_validation_allocation`
- `derive_test_run_archive_surface` carries `realized_test_source`
- the later operational execution lane carries `governed_test_execution_evidence`

The archive remains an honest projection over current completeness.
ABG owns continuation and re-entry after each bounded gain.
```

Self-demotion clause is explicit. Three declarative bullets (not imperative). §11.5A citation at close. Points to `odd_sdlc.test_lane_evidence` as the admitted boundary.

**Supporting files updated**: `runtime_contexts.py` (runtime publication of the retired context removed), `gtl_module.py` (archive edge rebound to `realized_test_source_projection` / `realized_test_source`), `constructor.py` (archive/release text updated), `requirement_closure.py` (legacy authority removed). Per the summary; I didn't diff each but the shape is consistent with Break Order steps 4-7.

### Critical finding: mypy claim is false

Codex claims:

> `python -m mypy --config-file mypy.ini -p odd_sdlc` → `Success: no issues found in 49 source files`

Reality on the current tree:

```
Found 7 errors in 3 files (checked 49 source files)
```

The 7 errors are:

| File | Line | Error class |
|---|---|---|
| `public_start_subcarriers.py` (new file) | 73 | `TypedDict key must be a string literal` |
| `public_start_subcarriers.py` | 120 | Unused `type: ignore` comment |
| `public_start_subcarriers.py` | 183 | Unused `type: ignore` comment |
| `gap_dossier.py` | 425 | `Value of "evidence" has incompatible type "list[dict[str, Any]]"; expected "list[EvidenceItemPayload]"` |
| `gap_dossier.py` | 494 | Same `evidence` incompatible-type error |
| `public_start.py` | 847 | `Name "ResolvedPolicyPayload" is not defined` |
| `query.py` | 34 | `Module "odd_sdlc.query_contract" does not explicitly export attribute "AssetProjectionPayload"` |

These errors are almost certainly **B-048 work-in-flight** — not B-037 scope. Evidence:

- `public_start_subcarriers.py` is new and didn't exist in the B-037-only slice. The name matches B-048's stated purpose (*"subordinate payload closure inside the B-040 public-start carrier family"*). B-048 is the ticket that promotes the 7 previously-embedded open-dict fields (evidence, prompt_compactions, published_ledger_ref, fulfillment_assessments, resolved_policy, assets) into typed subordinate carriers.
- The `gap_dossier.py:425` and `:494` errors show `evidence` field has been tightened from `list[dict[str, Any]]` to `list[EvidenceItemPayload]` on the TypedDict but the assignment site hasn't been updated. That's exactly the B-048 carrier-promotion pattern mid-flight.
- `public_start.py:847` missing `ResolvedPolicyPayload` and `query.py:34` missing `AssetProjectionPayload` are exports from a `public_start_contract.py` / `query_contract.py` split or rename that's in-progress.

So B-048 is already started, not yet landed, and is currently breaking the package-wide strict lane. That's **fine as in-flight state** but it means:

1. The B-037 mypy claim is stale or incorrect.
2. B-037 cannot be closed against the "package-wide mypy green" criterion until B-048 lands.
3. The correct B-037 proof would be a *scoped* mypy run over the B-037 slice only (e.g., `test_lane_evidence.py`, the updated `runtime_contexts.py`, `gtl_module.py`, `constructor.py`, `requirement_closure.py`), NOT the package-wide run.

**This is the same class of overclaim that B-040's first closure exhibited.** The B-037 work itself may be clean; the proof claim is wrong. Flagging early because this is the pattern that caused B-040 to be reopened.

### The "20 lawful retries" blocker deserves triage

Codex notes: *"derive_code_surface keeps yielding under the current harness even after 20 lawful retries, so I will not claim full from-bootstrap progression through the archive edge yet."*

20 retries is above B-041's empirical drain point (test35 drained at 16 dispatches). If `derive_code_surface` is yielding at retry 20, the cause is likely NOT the B-041 F_P single-dispatch cap (which B-041 closed with the `deepening_eligible` classification + F_D-retry re-entry mechanism). Two more-probable causes:

- **ABG transport-failure salvage** (per memory `feedback_abg_production_bar.md`): `transport_failure` yields on F_P edges after persistent transport issues. ABG-scope defect, not odd_sdlc-scope. The session-1 test38 `derive_test_run_archive_surface` yield had this exact shape.
- **Evaluator exhaustion + carry still non-zero**: could be a different F_D evaluator not draining (not semantic-convergence but e.g., traceability or carry-convergence with leftover delta).

Either way, the "20 retries yield" is not a B-037 failure or a B-041 regression — it's a different concern. Worth triaging separately rather than blocking B-037 closure on it. The correct B-037 closure criterion is "does the test-lane boundary behave correctly *when the upstream edges do reach it*," not "does every upstream edge run cleanly on this harness."

Suggest: add an explicit B-037 proof that stubs/mocks the upstream test-module result and drives the test-lane boundary directly, bypassing the `derive_code_surface` yield. That probes B-037's actual boundary without depending on an unrelated yield cause.

### Non-closure decision is correct

Codex not claiming closure is disciplined. The current state is:

- B-037 code: substantially landed, shape looks right
- B-037 mypy: claim is false; package-wide mypy is broken by B-048 in-flight
- B-037 boundary proofs: claimed green; I haven't reproduced them but the shape is plausible
- B-037 installed end-to-end: blocked on unrelated upstream yield

This is an honest mid-state. The next-action sequence (*"go close B-048 next, then B-049. come back to B-037 in the final harness/live wave"*) is the right order IF:

1. B-048 landing actually restores the package-wide mypy green
2. B-049 landing doesn't reintroduce type errors
3. The "20 retries yield" is triaged separately (either as a B-041 follow-on, ABG-scope ticket, or an explicit B-037 closure-criterion narrowing)

### Recommendation for ticket update before continuing

B-037 should be updated to reflect the honest state:

- **Remove or correct the "Success: no issues found in 49 source files" mypy claim** in any Progress/Proofs section. Replace with: "scoped mypy over B-037 slice (test_lane_evidence.py + updated runtime_contexts.py + gtl_module.py + constructor.py + requirement_closure.py) passes. Package-wide mypy currently has 7 errors in B-048 in-flight scope; package-wide green returns when B-048 lands."

- **Add explicit "Known outstanding" section** naming:
  - Package-wide mypy green depends on B-048 landing
  - Installed end-to-end progression through archive edge is blocked on unrelated `derive_code_surface` 20-retry yield (triage separately)
  - Module-derived unit tests for `test_lane_evidence` admit boundary (still needed per §6B before closure)

- **Add a scoped proof** that exercises the B-037 boundary directly without depending on upstream edge progression. Test fixture: construct a planned-only test-module surface + call `admit_test_lane_evidence_payload(...)` + assert the archive edge's behavior.

## Recommended Action

1. **Reconcile the mypy claim in B-037 before moving on.** The "49 source files green" statement is false and will cause closure drift later. Either scope the claim narrower (B-037 slice only) or note that package-wide green depends on B-048.

2. **Proceed with B-048 next.** The B-048 subordinate-carrier work is already in flight (`public_start_subcarriers.py` exists and is imported by consumers but has 3 type errors); landing it is a prerequisite for restoring the package-wide strict lane. B-049 after that.

3. **Add a scoped B-037 proof** that tests the test-lane boundary directly (admit payload → assert classification → assert projection), not dependent on upstream `derive_code_surface` behavior. This becomes the module-derived unit test §6B requires.

4. **Triage the "20 retries yield" separately.** It's not a B-041 regression signature and not a B-037 scope item. Likely candidates: ABG transport-salvage (out of scope per memory), workspace-state issue on test38, or a different F_D evaluator not draining. File as its own investigation if it persists after B-037/B-048/B-049 land.

5. **Final harness/live wave revisit for B-037** is the right decision. Close B-048 + B-049 first, restore package-wide mypy green, then re-run the B-037 installed end-to-end proof with the cleaned-up strict lane. If the "20 retries yield" is still present after B-048/B-049 close, it's likely an ABG-scope item and B-037 can be repriced with a narrower closure criterion that doesn't depend on it.

## Honest pattern flag

This is the second time in this session I've caught a Codex mypy/proof claim that didn't match reality on the tree (first was B-040 first closure's `follow_imports = skip` hiding 95 errors + non-reproducible pytest counts). The pattern: Codex's progress summaries report the state Codex *intended* to produce, not the state currently on disk. This instance is less severe — the B-037 work itself is substantial and in correct shape — but the proof claim is still wrong.

The fix is for future progress summaries to either (a) re-run the claimed proofs immediately before the summary is written, or (b) scope proof claims to what's actually verified. "Success: no issues found in 49 source files" should be a reproduced command output, not an aspirational state. The ticket update practice the rest of the family uses — paste the exact command + its exact output in the Progress Note — is the correction mechanism; B-037 should adopt it before continuing.
