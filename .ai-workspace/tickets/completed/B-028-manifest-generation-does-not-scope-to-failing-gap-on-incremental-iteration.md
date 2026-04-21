---
id: B-028
title: INVALID — stateful builder axiom already present; full regeneration on large gap is correct
type: bug
status: completed
goal: n/a — invalidated
change_intent: n/a — invalidated
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: n/a
priority: low
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
triage_note: invalidated — the stateful builder control frame already governs the correct behavior; the observed full regeneration was correct for the gap size; no requirement gap exists
intake_source: dmt.test35_r001 derive_test_run_archive_surface manifest — 2026-04-19
---

## Invalidation Reason

This ticket went through two wrong diagnoses before being invalidated:

1. **First framing**: "scope OUTPUT CONTRACT to failing evaluators only" — wrong; full context
   is correct; the LLM needs to know what is already satisfied to make targeted improvements.

2. **Second framing**: "stateful builder axiom is missing" — wrong; the axiom already exists
   in `odd_sdlc_stateful_builder_control_frame.md`:
   - "Inspect the current target asset... before changing anything."
   - "Do not treat the edge like a one-shot pure function call over serialized state."
   - "Use the current workspace state as truth."

3. **Actual state**: The manifest for the observed dispatch had `current_asset exists: True`,
   the control frame was injected, the LLM had the current state. The full regeneration was
   correct behavior — the archive had both F_D and F_P failures requiring structural changes,
   so full regeneration was the minimum correct change for that gap size.

## Conclusion

The system is working as designed. Full context + stateful builder axiom = correct behavior
across all gap sizes, from cold-start to one-line fix. No requirement gap exists.
