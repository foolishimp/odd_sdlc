# T-184 data_mapper live edge nonconformity: implementation design depth retry

Observed archive:

`build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260526T131037710Z_pid64804/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs`

Live target:

`derive_implementation_design_surface`

Expected T-184 spine:

`GTL graph function edge -> SDLC EdgePolicy -> ABG selected composition -> plugin.transform.C -> system admission/write -> plugin.evaluate.C -> system admission/write -> plugin.consequence.C -> traversal transition`

## Result

The run did not conform cleanly at `derive_implementation_design_surface`.

Two consecutive attempts passed transform/evaluate/review-grade but failed to
close because design-depth evaluation timed out and did not produce its
contracted artifacts.

Attempt 1:

- run: `20260526T165603084Z_pid20915`
- transform/evaluate: present
- review-grade: passed, `634/634` fulfilled
- design-depth evaluator: `actor_process_timeout` at `900200 ms`, `SIGTERM`
- missing: `design_depth_fp_evaluator_assessment.json`
- closure: `disposition=retry`
- closure reason includes:
  `design_depth_fp_evaluator_process_failed`
- target carrier admission: `targetCarrierAdmissionStatus=missing`

Attempt 2:

- run: `20260526T172204812Z_pid20915`
- transform/evaluate: present
- review-grade: passed, `667/667` fulfilled
- design-depth evaluator: `actor_process_timeout` at `900111 ms`, `SIGTERM`
- missing: `design_depth_fp_evaluator_assessment.json`
- closure: `disposition=retry`
- closure reason includes:
  `design_depth_fp_evaluator_process_failed`
- target carrier admission: `targetCarrierAdmissionStatus=missing`

## Process Hygiene

In both design-depth timeout attempts, ABG recorded timeout and SIGTERM, but
the PTY child process tree remained alive under `ppid=1`. The stale trees were
terminated manually after their run artifacts recorded timeout:

- `38120 -> 38121 -> 38124`
- `46962 -> 46963 -> 46966`

The live data-mapper loop started a third retry
`20260526T174759807Z_pid20915`. It was stopped manually after the repeated
nonconformity was established to avoid spending through another identical
retry loop.

Final process check: no matching `data-mapper-full-capability-live:resume`,
`odd-sdlc-ts start`, `design_depth`, `review_grade`, or child Claude process
remained.

## Interpretation

The activity timer is functioning as implemented: actor heartbeats and PTY
stdout chunks are admitted as `runtime_activity_probe_observed`. That keeps
the liveness lease active. The defect is not an inactivity false-positive.

The failing edge is a hard-cap/contract failure:

- design-depth evaluator does not write the contracted
  `design_depth_fp_evaluator_assessment.json`
- closure correctly refuses to close the edge
- the retry path repeats the same failure
- timeout leaves an orphan PTY process tree that must be cleaned up

This is T-184-relevant because a helper outside the core transform/evaluate /
consequence spine is still able to make the edge retry even after
`plugin.transform.C`, `plugin.evaluate.C`, and review-grade all pass.
