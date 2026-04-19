---
id: B-027
title: Stale pending run after mid-dispatch crash has no self-healing path
type: bug
status: backlog
goal: genesis start --auto recovers from stale pending runs without manual operator intervention
change_intent: Detect stale pending run (run_started with no fp_dispatched) at iteration start and auto-reset rather than failing with policy_config_defect
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: genesis/interpret.py _iterated_outcome pending-run check
triage_note: upward propagation check — no live requirement governs "genesis MUST self-heal from stale pending runs"; re-entry is requirements, not code
priority: medium
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
affected_boundary: genesis/interpret.py
intake_source: dmt.test35_r001 first-boot — 2026-04-19
---

## Description

When genesis crashes mid-dispatch (after `run_started` but before `fp_dispatched`),
the workspace is left with a stale pending run. On the next invocation, `find_pending_run`
returns the stale run and the code returns a "pending" result with no `fp_manifest_path`.
`dispatch_runtime.py` then fails with:

```json
{
  "status": "error",
  "reason": "pending F_P result is missing fp_manifest_path",
  "failure_class": "policy_config_defect"
}
```

The only recovery is a manual `emit-event --type reset`.

## Fix Location

`interpret.py` — `_iterated_outcome`, inside `if dispatch_requires_fp:`, before the
existing `if pending is not None:` block. A stale run is identified by
`pending.manifest_id is None` (no `fp_dispatched` event was ever written):

```python
if pending is not None and pending.manifest_id is None:
    # stale run — auto-recover
    _emit_event(
        runtime.stream,
        "run_failed",
        {
            "edge": vector.name,
            "run_id": pending.run_id,
            "failure_class": "stale_pending_run_recovered",
            "reason": "run was started but never dispatched; auto-recovering with fresh dispatch",
        },
        context=_event_context(runtime, run_id=pending.run_id, active_frame=active_frame),
    )
    pending = None  # fall through to fresh dispatch
```

A legitimate pending run always has a `manifest_id` (set when `fp_dispatched` is emitted).

## Observed In

dmt.test35_r001 first-boot run (2026-04-19). Required manual:
`emit-event --type reset --data '{"scope":"workspace","actor":"operator","reason":"..."}'`
