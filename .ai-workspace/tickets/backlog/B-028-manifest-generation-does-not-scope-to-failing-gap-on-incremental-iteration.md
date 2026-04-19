---
id: B-028
title: Stateful builder axiom not sufficiently governing incremental iteration behavior
type: bug
status: backlog
goal: LLM makes targeted improvements to existing assets rather than full regeneration on incremental iteration
change_intent: Strengthen the stateful builder control frame axioms so the LLM is governed to observe the current asset state and make the minimum necessary change, regardless of how much context is present in the manifest
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: odd_sdlc_stateful_builder_control_frame.md — axiom strength; genesis/binding.py — control frame injection
priority: high
triaged_at: 2026-04-19
updated_at: 2026-04-19
created_at: 2026-04-19
triage_note: upward propagation check — no live requirement governs the axiomatic constraint that the LLM must treat each dispatch as observation-then-targeted-improvement over a persistent asset; re-entry is requirements
intake_source: dmt.test35_r001 derive_test_run_archive_surface manifest — 2026-04-19
---

## Observation

On incremental iteration where the target asset already exists and only specific
evaluators are failing, the LLM regenerates the full asset from scratch rather than
making targeted improvements to the existing artifact.

## Reframed Root Cause

The original diagnosis — "manifest sends too much context" — was wrong.

Full context (full OUTPUT CONTRACT, full ENVIRONMENT, full source asset snapshot) is not
the problem. The model is correct: the LLM is working on a **persistent asset** and should
observe the current state, understand what is failing, and make the minimum necessary
improvement. Full context supports this — the LLM needs to understand all obligations to
know what is already satisfied and what is not.

The actual problem is that the **stateful builder axiom is not strong enough**. The control
frame does not sufficiently govern the LLM to behave as a stateful observer-and-improver.
Without a forceful axiomatic constraint, the LLM defaults to its training behavior: treat
the manifest as a specification and generate a complete artifact from scratch.

## Correct Mental Model

The manifest is not a from-scratch specification. It is a **governance frame** over a
persistent workspace asset. The LLM's job is:

1. Observe the current asset state
2. Identify what the failing evaluators require
3. Make the minimum change that closes the gap
4. Preserve everything else

This model handles all cases correctly — from a cold-start (asset doesn't exist, all
evaluators failing, full generation is the minimum change) to a one-line fix (asset
exists, one evaluator failing, change one field). No manifest scoping or mode switching
is needed. The axiom is the control surface.

## Required Requirement

The `[CONTEXT]` section of every manifest injects the stateful builder control frame.
This frame must assert as an axiomatic constraint:

> "You are acting as a governed stateful builder over a persistent workspace asset.
> The asset already exists. Your sole obligation is to observe its current state,
> identify what the failing evaluators require, and make the minimum targeted change
> that closes the gap. Do not regenerate the asset from scratch. Do not rewrite sections
> that are not implicated by the failing evaluators. The OUTPUT CONTRACT lists all
> obligations — use it to understand what is already satisfied, not as a prompt to
> re-derive everything. Treat preservation of existing correct content as a hard
> constraint, not a preference."

The requirement to add to odd_sdlc: "The stateful builder control frame MUST assert
as an axiomatic constraint that the LLM preserves existing correct asset content and
makes only the minimum change required to close the failing evaluator gap. This axiom
MUST be present regardless of manifest size or iteration mode."

## Why Not Context Scoping

Context scoping (reducing OUTPUT CONTRACT to failing evaluators only) was the original
fix direction. It is a workaround, not a fix:

- It deprives the LLM of the context it needs to know what is already satisfied
- It creates a mode-switching requirement (cold vs incremental) with no clear boundary
- It addresses the symptom (large manifest triggers full regeneration) not the cause
  (missing axiom that constrains the LLM to targeted improvement)
- A well-governed stateful builder should handle full context correctly by design

Cost reduction follows naturally from correct behavior: targeted improvements are
smaller outputs, not smaller inputs.
