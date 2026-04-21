---
id: B-031
title: EXTERNALIZED — obligation-ledger carry-forward on incremental passes is substrate-owned in abiogenesis
type: bug
status: completed
goal: n/a — externalized
change_intent: n/a — externalized
change_class: design_reframe
re_entry_point: design
affected_boundary: abiogenesis `genesis/result_ingest.py`; abiogenesis `genesis/binding.py`
priority: medium
triaged_at: 2026-04-19
created_at: 2026-04-19
updated_at: 2026-04-19
triage_note: the observed cost issue may be real, but the affected implementation and design surface are abiogenesis-owned, not odd_sdlc domain publication
intake_source: dmt.test35_r001 archive edge — 3 dispatches at ~35 min each for a gap that should shrink each pass — 2026-04-19
---

## Externalization Reason

The observation behind this ticket is about incremental obligation-ledger
behavior across repeated dispatches.

But the named affected surfaces are:

- `genesis/result_ingest.py`
- `genesis/binding.py`

Those are substrate-owned abiogenesis surfaces, not odd_sdlc domain-owned
surfaces.

So this may still be a real optimization or design issue, but it is not lawful
odd_sdlc backlog authority.

## What Was Observed

`dmt.test35_r001` needed three archive-edge dispatches at roughly 35 minutes
each even after the target asset existed and most obligations were already
fulfilled.

That is a useful substrate-forensics signal.

It is not, by itself, proof of an odd_sdlc domain defect.

## Conclusion

Keep the evidence for upstream abiogenesis triage if needed, but do not keep
this as live odd_sdlc backlog authority.
