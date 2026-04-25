# NOTE: former B-005 reproducer superseded by B-052

**Author**: codex
**Date**: 2026-04-24
**Status**: historical reproducer note

This note preserves the original operator-facing reproduction for the
`resolved_policy.bundle_refs` human-proxy crash that surfaced during
`data_mapper.test39`.

It is **not** a live ticket anymore.

Why it was removed from `tickets/backlog/`:

- the defect is already repaired and closed by
  [B-052-admit-genesis-policy-bundle-refs-through-one-sequence-shaped-ingress.md](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-052-admit-genesis-policy-bundle-refs-through-one-sequence-shaped-ingress.md)
- the original note proposed a different repair direction than the one ratified
  in `B-052`
- keeping it in `tickets/` would leave a duplicate stale work item
- its `B-005` identifier collides with the existing completed ticket
  [B-005-adopt-abg-yielded-handoff-in-odd-sdlc.md](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-005-adopt-abg-yielded-handoff-in-odd-sdlc.md)

Original observed defect:

- `genesis.policy.ResolvedPolicy.to_dict()` emitted
  `bundle_refs` as `tuple[str, ...]`
- `odd_sdlc.public_start_subcarriers` admitted only `list[str]`
- `start --fh-mode human-proxy` aborted while admitting the public-start
  resolved policy payload

Closed repair line:

- `odd_sdlc` now admits lawful string sequences for
  `resolved_policy.bundle_refs` at one ingress seam and normalizes once into
  the local carrier
- source and install regression proofs were added under `B-052`
- the install human-proxy lane now resolves the FH gate and returns a lawful
  yielded continuation instead of crashing

If this defect appears again, reopen from `B-052`, not from this retired
reproducer note.
