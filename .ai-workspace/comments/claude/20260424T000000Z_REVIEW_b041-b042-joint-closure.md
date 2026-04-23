# REVIEW: B-041 and B-042 Joint Closure

**Author**: claude
**Date**: 2026-04-24
**Addresses**: `.ai-workspace/tickets/completed/B-041-fp-semantic-convergence-failures-on-realization-edges-cap-depth-at-first-dispatch.md`, `.ai-workspace/tickets/completed/B-042-stop-governance-surfaces-from-drifting-into-builder-strategy-law.md`
**Status**: Closed

## Summary

Both tickets are legitimately closed on the declared narrow scope. All four proof selectors reproduce on the current tree. Retirement probe returns zero hits in live source. The package-wide mypy upgrade to `strict = True` without any `follow_imports = skip` escape hatches is a material improvement beyond the explicitly-claimed closure scope and lifts the prior B-040-era typing-lane quality ceiling by a large margin. The pre-existing residual debt (7 open-dict fields in `public_start_contract.py`, 9+ `dict[str, Any]` in `operational_dispatch.py`, ~250 `dict[str, Any]` package-wide) is unchanged — all of it belongs to B-043 and is consistent with the declared out-of-scope boundary.

## Analysis

### Claims verified

| Claim | Reproduced on the current tree |
|---|---|
| B-041 source selector: 9 passed, 86 deselected | ✓ `9 passed, 86 deselected in 0.35s` |
| B-041 install selector: 2 passed, 34 deselected | ✓ `2 passed, 34 deselected in 69.49s` |
| B-042 source selector: 6 passed, 89 deselected | ✓ `6 passed, 89 deselected in 0.12s` |
| B-042 install selector: 4 passed, 32 deselected | ✓ `4 passed, 32 deselected in 12.73s` |
| B-042 retirement probe: no hits | ✓ `grep -rE 'deepen_realization\|_collect_shallow_findings\|framework_condition.*"shallow"\|"## Global Law"\|deepening_preferred_over_expansion'` returns zero live-source hits (one hit in `test_odd_sdlc_first_slice.py` is a negative-proof assertion that the string is NOT published, which is the correct shape) |
| Package strict lane: `python -m mypy --config-file mypy.ini -p odd_sdlc` → 48 source files, Success | ✓ `Success: no issues found in 48 source files` |

No hidden filter, no deselection concealing failures, no `follow_imports = skip` concealing cross-module type flow.

### Material progress beyond claimed closure scope

The upgrade to `[mypy-odd_sdlc.*] strict = True` with no `follow_imports = skip` lines is not explicitly claimed in the Codex summary but represents a substantial step up from the B-040 second-closure state:

| Axis | B-040 second closure | B-041/B-042 joint closure |
|---|---:|---:|
| Strict modules | 9 named | whole package (48 files) |
| `follow_imports = skip` modules | 13 | 0 |
| Package-wide mypy | not measured (only 9-module lane) | Success |

The prior risk that "typed carriers flow across module boundaries as `Any` through `follow_imports = skip` escape hatches" is now retired structurally. Every module in the `odd_sdlc.*` namespace is checked under strict rules.

### B-041 closure substance

The installed proof `test_install_data_mapper_derive_code_surface_reenters_with_realization_iteration_continuity` operationally verifies the B-041 target_truth in a real workspace:

- `deepening_eligible` classification present in route events
- `priority_source == "triage.realization_iteration"` on both re-dispatched route records
- Zero-based `dispatch_index` advances (0, 1)
- Prior-turn digest context (`odd_sdlc_realization_iteration_digest`) appears in the second dispatch's `[CONTEXT]`
- F_D carry-convergence remains the termination signal; no retry budget, turn counter, or gain calculator introduced

The nine source-level tests cover route policy, classification publication, refresh-analysis digest publication, fallback to fixed-vector on non-eligible failures, and read-only query behavior. The source + install coverage together is substantive.

### B-042 closure substance

Retirement grep returns zero hits for `deepen_realization`, `_collect_shallow_findings`, `_scan_file_for_shallow_findings`, `framework_condition.*"shallow"`, `"## Global Law"`, `deepening_preferred_over_expansion` in live source. The one occurrence inside `test_odd_sdlc_first_slice.py` is a negative-proof assertion that the string is absent from published context (correct shape).

The six source-level tests assert:
- `repair_frontier.py` prompt emits `"current governance truth"` and `"without prescribing builder strategy"`, not the retired `"## Global Law"` block
- `refresh_analysis` does not publish a replacement strategy surface
- Shallow code findings do not publish deepening strategy
- Module build does not publish runtime sidecars of the retired shape
- Constructive vectors consume the neutralized repair-frontier context
- Code edge prompt uses the neutralized context

`REALIZATION_DEEPENING_CONTROL_FRAME.md` has been rewritten as 14 lines of non-imperative rationale with explicit self-demotion ("It is rationale only. It is not a runtime-published builder control frame"). Under the strictest B-042 Drift Surface Inventory reading, this is Option 3 (rewrite) implemented cleanly. The file's installed presence at `test_odd_sdlc_installation.py:708` is now lawful because the content is non-imperative observation and the runtime-publication path is retired.

### Evaluator discipline

Applying the three evaluators the user set (Authority Seam Closure, Essential Carrier Consolidation, Typed Enforcement After Proof) to the final state:

- **E1 — Authority Seam Closure**: realization-iteration classification is carried through typed route events and prompt-context digests; no controller-side reconstruction of classification state observed in the bounded slice.
- **E2 — Essential Carrier Consolidation**: no new rival carriers introduced for retry authorization. Classification is a one-bit typed discriminator on evaluator registration, not a state-machine carrier family. No fragment classes.
- **E3 — Typed Enforcement After Proof**: zero `# type: ignore` across the whole `odd_sdlc` package under package-wide `strict = True`. Existing `cast()` sites are all post-validation Literal narrowing (22 sites, all lawful under `DESIGN_MODULE_METHOD.md §4A`).

### Residual debt (explicitly out of scope, captured by B-043)

The following is unchanged from the B-040 second-closure state. None of it regresses B-041 or B-042; all of it is captured by the active `B-043` ticket:

1. **7 open-dict fields inside typed carriers in `public_start_contract.py`** (`evidence` L160 / L175, `resolved_policy` L485, `prompt_compactions` L551, `published_ledger_ref` L552, `fulfillment_assessments` L554, `assets` L619). Typed-envelope-over-open-payload shape. Passes `strict = True` because `dict[str, object]` is a typed top, but remains `DESIGN_MODULE_METHOD.md §5C` boundary-inflation-adjacent.
2. **`operational_dispatch.py` retains 9 `dict[str, Any]` occurrences** including the public return type `dispatch_operational(app) -> dict[str, Any]`. Explicitly B-043 scope.
3. **~250 `dict[str, Any]` occurrences across the `odd_sdlc.*` package.** mypy-strict-lawful but substantively open-payload. B-043 owns this; also potentially a future ticket for non-B-043 modules.

### Comparison to the Codex closure-pattern trend

The "first closure overclaims, review-driven reopen, second closure lands" pattern that held for B-040 and B-044 does not repeat here. B-041 and B-042 were both left in `active/` through implementation and at-boundary review cycles; this closure is the first closure attempt for both, and it lands cleanly. The discipline is generalizing.

## Recommended Action

**Accept closure.** Both tickets can stay in `completed/`.

Three follow-on items worth noting for future-ticket scope, none of which is B-041 or B-042 defect:

1. The 7 open-dict fields in `public_start_contract.py` are latent carrier-inflation debt. If not already in B-043's explicit scope, consider a subordinate payload register pass or a B-044-class successor to close them to closed discriminated unions (`ObservationEvidence`, `YieldedFulfillmentAssessment`, etc.).

2. `operational_dispatch.py` and the broader 250 `dict[str, Any]` package-wide count mean that "package mypy strict green" is necessary but not sufficient under the three-evaluator reading. B-043 nominally owns `operational_dispatch.py`; a broader typed-opaque-to-closed-carrier migration wave may be needed later. Not urgent; not a B-041/B-042 defect.

3. `REALIZATION_DEEPENING_CONTROL_FRAME.md` filename still carries `CONTROL_FRAME` in its name while the content explicitly says "not a runtime-published builder control frame." A rename to `REALIZATION_CONTINUITY_RATIONALE.md` would align file name with file content. Cosmetic; would require updating `test_odd_sdlc_installation.py:708` in lockstep.

None of these is blocking. Closure stands.
