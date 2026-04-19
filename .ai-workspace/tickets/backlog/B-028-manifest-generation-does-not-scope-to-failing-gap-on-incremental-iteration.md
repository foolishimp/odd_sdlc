---
id: B-028
title: Manifest generation sends full output contract on incremental iteration instead of scoping to failing gap
type: bug
status: backlog
goal: incremental iteration manifests are proportionate to the actual gap, not a full cold-derivation prompt
change_intent: Scope manifest content to failing evaluators + relevant asset section when the target asset already exists
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: genesis/binding.py _assemble_prompt / OUTPUT CONTRACT section
priority: high
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
triage_note: upward propagation check — no live requirement distinguishes cold-derivation manifests from incremental gap-closing manifests; re-entry is requirements
intake_source: dmt.test35_r001 derive_test_run_archive_surface manifest — 2026-04-19
---

## Observation

`derive_test_run_archive_surface` manifest is 49,491 chars (~14k tokens) on an
**incremental iteration** where the target asset already exists and only 3
evaluators are failing. Prompt section breakdown:

| Section | Size | Needed for incremental? |
|---|---|---|
| `[GAP]` | 6,835 chars | Yes |
| `[DETERMINISTIC FAILURES]` | 6,010 chars | Yes |
| `[CONTEXT]` control frame | 3,998 chars | Yes (brief) |
| `[SOURCE ASSET SNAPSHOT]` | 8,280 chars | Partial — only failing-evaluator-relevant sections |
| `[ENVIRONMENT]` full spec | 5,305 chars | No — asset exists; upstream hasn't changed |
| `[OUTPUT CONTRACT]` 83 req list | 16,216 chars | No — asset exists; only failing checks matter |

The `[OUTPUT CONTRACT]` section lists all 83 requirement fulfillment obligations
regardless of how many are already satisfied. For a gap-closing iteration this
is noise that drives the LLM to re-derive the full asset instead of fixing the
specific gap.

## Required Distinction

| Mode | Condition | Manifest scope |
|---|---|---|
| Cold derivation | target asset does not exist | Full output contract, full environment |
| Incremental iteration | target asset exists, N evaluators failing | Failing evaluators + current asset + relevant asset sections only |

## Cost Impact

- Incremental manifest as built: ~14k tokens → ~$0.21/dispatch
- Scoped incremental manifest (estimated): ~3–5k tokens → ~$0.05–0.08/dispatch
- For an edge that iterates 3–5 times to converge, this is 3–4× cost reduction

## Fix Direction (for requirements phase)

Requirement to add to odd_sdlc: "When the target asset already exists and
only specific evaluators are failing, the manifest MUST scope `[OUTPUT CONTRACT]`
to the failing evaluators only, and MUST omit `[ENVIRONMENT]` surfaces that
have not changed since the asset was last produced."
