# B-025 Publish One Operational-Capability Truth Across Normalization, Gaps, And Edge Diagnostics

- id: B-025
- title: Publish one authoritative operational-capability truth across normalization, gaps, active graph publication, and edge-local diagnostics
- type: bug
- status: completed
- goal: build-reliability-and-boundary-integrity
- change_intent: Replace the current fragmented operator story for operational capability gating with one authoritative capability-truth surface that normalization, workspace state, active graph publication, `gaps`, and downstream edge diagnostics all consume.
- change_class: realization_refactor
- re_entry_point: realized_surface
- priority: high
- dependencies: odd_sdlc B-020 completed; abiogenesis B-021 through B-025 completed
- intake_source: operational-capability forensic analysis on 2026-04-19; missing test-execution capability truth existed in normalization and ambiguity state but was not surfaced consistently in graph publication, `gaps`, or archive-edge diagnostics
- affected_boundary: ambiguity register publication, workspace-state publication, capability-gated graph publication, `gaps` projection, operational evidence diagnostics
- triaged_at: 2026-04-19
- created_at: 2026-04-19
- updated_at: 2026-04-20

## Completion

This ticket is closed.

`odd_sdlc` now publishes one authoritative operational-capability projection and
reuses that same fact across:

- workspace-state publication
- active graph publication and operational graph-function gating
- operator catalog and `query-domain`
- `gaps` capability-blocked edge projection
- edge-local diagnostics over returned evidence

The landed projection is rooted in:

- `odd_sdlc/build_tenants/python/code/odd_sdlc/project_profile.py`
- `odd_sdlc/build_tenants/python/code/odd_sdlc/analysis.py`
- `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py`
- `odd_sdlc/build_tenants/python/code/odd_sdlc/app.py`
- `odd_sdlc/build_tenants/python/code/odd_sdlc/query.py`
- `odd_sdlc/build_tenants/python/code/odd_sdlc/workspace_assets.py`

Focused proof exists in:

- `odd_sdlc/build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py`
- `odd_sdlc/build_tenants/python/test_env/tests/test_odd_sdlc_installation.py`
- `odd_sdlc/build_tenants/python/test_env/tests/test_odd_sdlc_capability_gating_usecase.py`

## Scope Correction

The ticket is complete for the capability-truth seam it owns.

Broader migration work remains open elsewhere:

- `B-019` still owns the remaining operator gap-surface truth defect
- `T-016` and `T-017` still own the broader `start` / target-routing expansion

Those open tickets are not evidence that the operational-capability one-truth
projection failed to land.

## Context

One reproduced failure workspace exposed one real domain bug, but it appeared through
several weaker symptoms:

- the workspace already published a missing capability fact in normalization /
  ambiguity state
- capability-gated operational edges were absent from the active graph because
  the capability was undeclared
- archive-edge diagnostics reported ungoverned test evidence counts without
  carrying the same capability explanation forward

Earlier intake split that one defect into three weaker follow-on framings:

- field-shape validation for `test_execution_contract: ""`
- evaluator root-cause diagnostic enrichment
- gated-edge visibility in `genesis gaps`

Those are not three independent truths.

The domain already models undeclared capability through the current profile
contract:

- normalization seeds capability fields such as `test_execution_contract` as
  `""`
- `ProjectProfile.has_*_capability()` treats blank string as undeclared

So the real defect is not “empty string is inherently invalid.” The real defect
is that one underlying undeclared-capability fact is not projected consistently
across the domain surfaces operators actually use.

## Problem Statement

Missing operational capability is currently modeled, but not projected through
one authoritative operator truth.

The same underlying fact is fragmented across:

- normalization / ambiguity state
- workspace state
- active graph publication
- `gaps`
- downstream edge-local diagnostics when evidence is present but unguided or
  ungoverned

That forces operators to reconcile multiple read models by hand to understand
one capability condition.

## Current Contract Reading

This ticket does **not** change the current field-shape contract by itself.

Today, the domain models undeclared capability through blank capability fields
such as:

- `build_execution_contract: ""`
- `test_execution_contract: ""`
- `deployment_contract: ""`
- `runtime_observation_contract: ""`

If that representation is later repriced, that is a separate contract change.
This ticket is about singular truth projection, not field-shape repricing.

## Required Direction

1. Keep one authoritative operational-capability fact rooted in normalization /
   workspace-state publication
2. Make active graph publication consume that same fact when deciding whether
   operational graph functions are active or gated
3. Make `gaps` consume and surface that same fact when an operational edge or
   operational lane is gated inactive
4. Make downstream edge-local diagnostics consume that same fact when evidence
   is classified as unguided, unguided-by-contract, or ungoverned because the
   governing operational capability is undeclared
5. Apply the same rule across all operational capability families, not only
   test execution:
   - build execution
   - test execution
   - deployment
   - runtime observation

The important law is one truth:

- one operational capability state
- many read models
- zero contradictory operator stories

## Acceptance

- when an operational capability is undeclared, one capability-truth fact is
  published and reused consistently
- active graph publication can distinguish active versus gated operational
  functions by consuming that same capability truth
- `gaps` can show gated operational edges or their gated state by consuming
  that same published capability truth
- edge-local diagnostics can state that reports or returned evidence are
  unguided or ungoverned because the governing operational capability is
  undeclared, without requiring the operator to inspect multiple files manually
- the rule applies consistently across build, test execution, deployment, and
  runtime-observation capability families

## Explicit Non-Goals

- This ticket does not by itself reprice blank-string capability fields as
  invalid input.
- This ticket does not invent a second local rule for one edge or one
  capability family only.
- This ticket does not move operational capability law down into ABIogenesis.
- ABG's `gen-start` / `gen-gaps` operator wave is already landed. The
  remaining defect here is odd_sdlc-local projection and gating truth.

## Links

- ambiguity / profile publication:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/project_profile.py`
- normalization defaults:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/normalization.py`
- capability-gated graph publication:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py`
- operational evidence summary:
  `odd_sdlc/build_tenants/python/code/odd_sdlc/workspace_assets.py`
- reproducer:
  `ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35`
