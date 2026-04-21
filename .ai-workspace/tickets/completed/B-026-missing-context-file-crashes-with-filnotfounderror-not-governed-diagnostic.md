---
id: B-026
title: EXTERNALIZED — first-boot missing-context crash was template-scaffold fallout; any dispatch hardening belongs in abiogenesis
type: bug
status: completed
goal: n/a — externalized
change_intent: n/a — externalized
change_class: realization_refactor
re_entry_point: dmt_template/scaffold/.ai-workspace/runtime/
affected_boundary: dmt_template scaffold ownership first; abiogenesis dispatch hardening only as optional follow-on
triage_note: dmt.test35_r001 traced the missing file to scaffold omission; that is not live odd_sdlc backlog authority against abiogenesis dispatch code
priority: medium
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
intake_source: dmt.test35_r001 first-boot — 2026-04-19
---

## Externalization Reason

`dmt.test35_r001` first-boot did hit a missing-context failure, but the missing
file was:

- `.ai-workspace/runtime/odd_sdlc-stateful-builder-control-frame.md`

The local workspace backlog now records the actual root cause more accurately:

- `dmt.test35_r001` local `B-001`: the template scaffold omitted the required
  runtime control frame files
- the template-side scaffold fix was already applied and committed there
  (`d03756b`)

So odd_sdlc should not keep a second live backlog ticket pretending this is a
domain-owned requirements or runtime-policy defect in abiogenesis.

If extra pre-dispatch hardening is still wanted after the scaffold fix, that is
substrate-owned abiogenesis follow-on work, not odd_sdlc backlog authority.
