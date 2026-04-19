---
id: B-028
title: Obligation ledger has no carry-forward — forces full reassessment on every pass regardless of gap size
type: bug
status: backlog
goal: incremental passes are proportionate in effort to the actual gap — a one-evaluator fix costs one-evaluator work, not 83-obligation work
change_intent: Add carry-forward semantics to the obligation ledger so that fulfilled obligations from a prior pass are not re-assessed on the next pass unless explicitly touched
change_class: design_reframe
re_entry_point: design
affected_boundary: genesis/result_ingest.py — obligation matching; genesis/binding.py — fulfillment_obligations injection into manifest
priority: high
triaged_at: 2026-04-19
updated_at: 2026-04-19
created_at: 2026-04-19
triage_note: upward propagation check — requirement for iterative convergence exists; design for obligation ledger does not include carry-forward mechanism; re-entry is design
intake_source: dmt.test35_r001 archive edge — 3 dispatches at ~35 min each for a gap that should shrink each pass — 2026-04-19
---

## Observation

A small gap (1–2 evaluators failing, asset mostly converged) costs the same as a cold-start
dispatch. On dmt.test35_r001 the archive edge required 3 dispatches at ~35 min each even
after the asset existed and most obligations were already fulfilled.

## Root Cause

`result_ingest.py` line 346:

```python
missing_count = max(0, len(obligations) - len(assessments_by_id))
```

If any declared obligation is absent from `fulfillment_assessments`, it is marked
`unfulfilled`. The manifest always injects **all declared obligations** into
`[OUTPUT CONTRACT]`. Therefore, the LLM must provide assessments for all obligations
on every dispatch — or prior fulfillments silently regress to `unfulfilled`.

This means:
- 83 obligations declared → 83 must be assessed every pass
- The LLM must review and re-state all 83 even when only 1 is failing
- Pass cost is always proportional to total obligation count, not to gap size
- The stateful builder axiom governs the asset file (targeted edits), but cannot help
  here — the result contract structurally requires complete assessment

## Why Not Context / Axiom

Earlier diagnoses of this ticket were wrong:

- **"Scope OUTPUT CONTRACT to failing evaluators only"** — wrong; full context is correct
- **"Stateful builder axiom is missing"** — wrong; axiom exists and governs asset edits

The axiom is not the lever. The result contract is. Even a perfectly compliant
stateful builder must re-assess all 83 obligations to avoid regression.

## Required Design Change

The obligation ledger needs carry-forward semantics:

1. When a prior fulfilled ledger exists for an edge, obligations with `fulfilled` status
   are carried forward into the next pass without requiring re-assessment.
2. The manifest injects only **open obligations** (unfulfilled, blocked, partial) into
   `[OUTPUT CONTRACT]` on incremental passes.
3. The LLM is asked to assess only the open obligations. Carried obligations are not
   re-assessed unless the LLM explicitly changes their status.
4. `result_ingest.py` merges the LLM's new assessments over the carried ledger instead
   of requiring a complete fresh assessment.

**Upward propagation check:**
- Requirement for iterative convergence: exists — the pipeline is designed for multi-pass
  convergence with diminishing gaps.
- Design for carry-forward semantics: absent — the obligation ledger has no merge/carry
  mechanism; every pass is treated as a fresh cold-start assessment.
- Code deviation: no — code faithfully implements the design (no carry-forward).
- First missing layer: design. Re-entry is `design_reframe`.

## Cost Impact

- Cold-start (0 obligations fulfilled): full assessment required → no change
- Incremental (N of 83 fulfilled): only (83 - N) re-assessed → proportionate cost
- One-evaluator gap: ~1/83 of current cost on that pass
- Convergence behavior: each pass cheaper than the last as obligations close out
