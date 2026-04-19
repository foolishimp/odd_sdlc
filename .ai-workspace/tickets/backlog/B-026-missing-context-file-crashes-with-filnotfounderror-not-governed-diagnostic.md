---
id: B-026
title: Missing F_P context file produces FileNotFoundError instead of governed diagnostic
type: bug
status: backlog
goal: odd_sdlc runtime gives actionable diagnostic when required context files are absent
change_intent: Detect missing context file paths before F_P dispatch and emit a governed failure event with the missing file name and fix instruction
change_class: realization_refactor
re_entry_point: genesis/binding.py bind_fp context resolution
priority: medium
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
affected_boundary: genesis/interpret.py _iterated_outcome dispatch path
intake_source: dmt.test35_r001 first-boot — 2026-04-19
---

## Description

When a context file required for F_P dispatch is absent, genesis crashes with an
unhandled `FileNotFoundError` raised inside `bind_fp` in `binding.py`:

```
FileNotFoundError: Cannot dispatch F_P: required context(s) not found:
odd_sdlc_stateful_builder_control_frame.
Fix the context locators or provide the missing files before iterating.
```

This exception is raised AFTER `run_started` and `graph_call_opened` have been emitted
by `_ensure_public_runtime_open` in `interpret.py`. The workspace is left with a stale
`run_started` event and no `fp_dispatched` event, triggering B-027 on the next run.

## Fix Location

`interpret.py` — `_iterated_outcome` function, before the call to
`_ensure_public_runtime_open`. Add a guard:

```python
if dispatch_requires_fp and pre.missing_contexts:
    missing = ", ".join(pre.missing_contexts)
    return TraversalOutcome(
        surface=surface,
        result={
            "status": "error",
            "stopped_by": "fp_runtime_failure",
            "failure_class": "missing_context",
            "reason": (
                f"Cannot dispatch F_P: required context(s) not found: {missing}. "
                "Fix the context locators or provide the missing files before iterating."
            ),
            "edge": vector.name,
            "missing_contexts": list(pre.missing_contexts),
        },
    )
```

`pre.missing_contexts` is populated by `precompute_manifest` and available before
`_ensure_public_runtime_open` is called — the guard is zero-cost.

## Observed In

dmt.test35_r001 first-boot run (2026-04-19). Missing file:
`.ai-workspace/runtime/odd_sdlc-stateful-builder-control-frame.md`
