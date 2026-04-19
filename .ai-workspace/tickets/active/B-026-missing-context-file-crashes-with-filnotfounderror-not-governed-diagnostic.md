---
id: B-026
title: Missing F_P context file produces FileNotFoundError instead of governed diagnostic
type: bug
status: active
goal: odd_sdlc runtime gives actionable diagnostic when required context files are absent
change_intent: Detect missing context file paths before F_P dispatch and emit a governed failure event with the missing file name and fix instruction
change_class: realization_refactor
re_entry_point: genesis/binding.py bind_fp context resolution
priority: medium
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
affected_boundary: genesis/binding.py
intake_source: dmt.test35_r001 first-boot — 2026-04-19
---

## Description

When a context file required for F_P dispatch is absent, genesis crashes with an
unhandled `FileNotFoundError`:

```
FileNotFoundError: Cannot dispatch F_P: required context(s) not found:
odd_sdlc_stateful_builder_control_frame.
Fix the context locators or provide the missing files before iterating.
```

This is a raw Python exception, not a governed `run_failed` or `policy_config_defect`
event. The workspace is left with a stale `run_started` event and no `fp_dispatched`
event. The next `genesis start --auto` invocation then fails with:

```json
{ "reason": "pending F_P result is missing fp_manifest_path",
  "failure_class": "policy_config_defect" }
```

requiring a manual `emit-event --type reset` to recover.

## Expected Behaviour

1. `bind_fp` detects missing context files before emitting `run_started`
2. Emits a `run_failed` event with `failure_class: "missing_context"`, the missing
   file path, and a fix instruction
3. `genesis start --auto` reports the failure cleanly and exits with a non-zero code
4. No stale pending run is left; the workspace is immediately re-iterable

## Root Cause

`binding.py:bind_fp` raises `FileNotFoundError` after `run_started` has been emitted
but before `fp_dispatched` is written. The runtime has no recovery path for this
mid-dispatch failure class.

## Observed In

dmt.test35_r001 first-boot run (2026-04-19). Missing file:
`.ai-workspace/runtime/odd_sdlc-stateful-builder-control-frame.md`
