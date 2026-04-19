---
id: B-027
title: Stale pending run after mid-dispatch crash has no self-healing path
type: bug
status: active
goal: genesis start --auto recovers from stale pending runs without manual operator intervention
change_intent: Detect stale pending run (run_started with no fp_dispatched) at start of each iteration and auto-reset rather than failing with policy_config_defect
change_class: realization_refactor
re_entry_point: genesis/dispatch_runtime.py pending-run recovery path
priority: medium
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
affected_boundary: genesis/dispatch_runtime.py, genesis/services.py
intake_source: dmt.test35_r001 first-boot — 2026-04-19
---

## Description

When genesis crashes mid-dispatch (after `run_started` but before `fp_dispatched`),
the workspace is left with a stale pending run. On the next invocation, the runtime
finds a `run_started` event with no `fp_manifest_path` in its result and fails with:

```json
{
  "status": "error",
  "reason": "pending F_P result is missing fp_manifest_path",
  "failure_class": "policy_config_defect"
}
```

The only recovery is:

```bash
PYTHONPATH=.genesis python -m genesis emit-event \
  --type reset \
  --data '{"scope":"workspace","actor":"operator","reason":"..."}' \
  --workspace .
```

This is not documented anywhere and requires operator knowledge of the runtime internals.

## Expected Behaviour

`genesis start --auto` should detect a stale pending run (a run with `run_started` but
no `fp_dispatched` event, AND no live manifest file) and auto-reset it before proceeding.
The reset should be logged as a governed event with `failure_class: "stale_pending_run_recovered"`.

## Design Note

A pending run with a valid manifest file path that exists on disk is a legitimately
pending F_P result (the LLM may still be working). Only runs with no manifest — i.e.,
runs that crashed before dispatch — should be auto-reset. The distinction is clear:
check whether `fp_dispatched` was emitted for the pending run.

## Observed In

dmt.test35_r001 first-boot run (2026-04-19). Required manual:
`emit-event --type reset --data '{"scope":"workspace","actor":"operator","reason":"..."}'`
