---
id: B-027
title: EXTERNALIZED — stale pending run was first-boot scaffold fallout; any self-healing policy belongs in abiogenesis
type: bug
status: completed
goal: n/a — externalized
change_intent: n/a — externalized
change_class: realization_refactor
re_entry_point: dmt_template/README.md
affected_boundary: dmt_template first-boot recovery ownership first; abiogenesis self-healing only as optional follow-on
triage_note: the stale pending run followed the scaffold omission recorded in local B-001/B-002; odd_sdlc should not keep this as live domain backlog authority
priority: medium
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
intake_source: dmt.test35_r001 first-boot — 2026-04-19
---

## Externalization Reason

The stale pending run was a downstream consequence of the same first-boot
scaffold omission captured in local workspace tickets:

- local `B-001`: required runtime control frame files missing from scaffold
- local `B-002`: recovery guidance needed after the resulting failed first boot

That makes two things true:

1. the operator did encounter a stale pending run
2. the causal owner was not odd_sdlc backlog authority over abiogenesis

The local template/workspace layer now owns the concrete first-boot fix and
recovery guidance. If substrate self-healing is still wanted later, it should
be tracked in abiogenesis, not here.

## Observed In

`dmt.test35_r001` first-boot run (2026-04-19) after the missing-context crash.
