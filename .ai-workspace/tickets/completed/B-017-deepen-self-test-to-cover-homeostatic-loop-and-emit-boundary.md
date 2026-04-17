# B-017 Deepen Self-Test To Cover Homeostatic Loop And Emit Boundary

- id: B-017
- title: Expand self-test beyond smoke coverage so the homeostatic loop and GTL/ABG emit boundary are exercised end to end
- type: bug
- status: completed
- goal: build-reliability-and-regression-detection
- priority: high
- created_at: 2026-04-18
- updated_at: 2026-04-18
- dependencies: B-012, T-009
- change_intent: turn self-test into a real regression surface for the next quality/reliability wave instead of a mostly smoke-level check
- change_class: realization_refactor
- re_entry_point: realization
- triaged_at: 2026-04-18
- intake_source: odd_sdlc review follow-up; extracted from former T-011 umbrella `G11`
- affected_boundary: self_test.py, end-to-end homeostatic proving, and GTL/ABG runtime-boundary regression detection

## Why This Ticket Exists

`self_test.py` is too thin for the next wave.

The coming work is explicitly about:

- incompleteness comprehension
- homeostatic loop closure
- GTL/ABG write-path integrity

If self-test stays smoke-level, regressions in those areas will be found only
by expensive downstream proving.

## Intended Direction

Self-test must become a meaningful local proving lane for the two highest-risk
behaviors in this wave:

1. the full homeostatic loop through application and renewed derivation
2. the runtime emit boundary, so domain code cannot silently regain direct
   write authority

## Task List

- [ ] Add at least one end-to-end self-test that drives a synthetic gap through
  the full homeostatic loop.
- [ ] Add at least one self-test that asserts GTL/ABG emit-boundary integrity.
- [ ] Ensure these tests fail for the wrong reasons if the loop or boundary
  regresses, not merely on incidental file drift.
- [ ] Keep the self-test lane fast enough to run as a meaningful regression
  surface during implementation.

## Acceptance

- self-test is no longer primarily smoke-level for the highest-risk runtime
  behaviors
- loop regressions are caught locally before downstream proving
- emit-boundary regressions are caught locally before downstream proving

## Links

- review source: extracted from former `T-011` umbrella task `G11`
- related: `B-012`, `T-009`
